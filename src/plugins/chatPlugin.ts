// src/plugins/chatPlugin.ts
import type { App, Plugin } from 'vue';
import { ref, computed } from 'vue';

import { LOCAL_STORAGE_SESSION_KEY, loadPreviousSession, sendMessage } from '../utils/api';
import { generateId } from '../utils/helpers';
import { ChatSymbol } from '../composables/useChat';
import { OptionsSymbol } from '../composables/useOptions';
import type { ChatOptions, ChatMessage, ChatAction, Chat } from '../types';

/**
 * Plugin Vue per inizializzare lo stato della chat
 */
export const ChatPlugin: Plugin = {
  install(app: App, options: ChatOptions) {
    // Opzioni di default
    const defaultOptions: ChatOptions = {
      webhookUrl: '',
      webhookConfig: {
        method: 'POST',
        headers: {},
      },
      mode: 'window',
      loadPreviousSession: true,
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      theme: {},
      allowFileUploads: false,
      showTooltip: true,
      tooltipText: "Hai bisogno di aiuto?",
      initialMessages: [],
      placeholder: 'Scrivi un messaggio...',
      title: 'Chat',
      subtitle: 'Come posso aiutarti?',
    };

    // Unisce le opzioni fornite con i default
    const resolvedOptions = ref<ChatOptions>({
      ...defaultOptions,
      ...options,
      webhookConfig: {
        ...defaultOptions.webhookConfig,
        ...options.webhookConfig,
      },
      theme: {
        ...defaultOptions.theme,
        ...options.theme,
      },
      icons: {
        ...defaultOptions.icons,
        ...options.icons,
      }
    });

    // Fornisce le opzioni come injection
    app.provide(OptionsSymbol, resolvedOptions);

    // Stato della chat
    const messages = ref<ChatMessage[]>([]);
    const currentSessionId = ref<string | null>(null);
    const waitingForResponse = ref(false);
    const pendingCallbackValue = ref<string | null>(null);

    // Messaggi iniziali computati
    const initialMessages = computed<ChatMessage[]>(() =>
      (resolvedOptions.value.initialMessages || []).map((text) => ({
        id: generateId(),
        text,
        sender: 'bot',
        createdAt: new Date().toISOString(),
      }))
    );

    /**
     * Inizializza una nuova sessione
     */
    async function startNewSession(): Promise<string> {
      const newSessionId = generateId();
      currentSessionId.value = newSessionId;
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, newSessionId);
      pendingCallbackValue.value = null;

      // Aggiunge i messaggi iniziali se presenti
      messages.value = initialMessages.value.length > 0 ? [...initialMessages.value] : [];

      console.log("Nuova sessione iniziata:", newSessionId);
      return newSessionId;
    }

    /**
     * Carica la sessione precedente o ne inizia una nuova
     */
    async function loadPreviousSessionHandler(): Promise<string | undefined> {
      if (!resolvedOptions.value.loadPreviousSession) {
        return await startNewSession();
      }

      const sessionIdFromStorage = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (!sessionIdFromStorage) {
        console.log("Nessun ID di sessione in localStorage. Inizio una nuova sessione.");
        return await startNewSession();
      }
      
      console.log("Trovato sessionId in localStorage:", sessionIdFromStorage);
      currentSessionId.value = sessionIdFromStorage;

      try {
        const previousMessagesResponse = await loadPreviousSession(
          sessionIdFromStorage,
          resolvedOptions.value
        );

        console.log("Risposta caricamento sessione:", previousMessagesResponse);

        if (previousMessagesResponse?.data?.length > 0) {
          const timestamp = new Date().toISOString();
          const loadedMessages = previousMessagesResponse.data.map((message, index) => {
            const messageContent = message.kwargs?.content || "Messaggio vuoto";
            const sender = Array.isArray(message.id)
              ? (message.id.some(id => String(id).includes('HumanMessage')) ? 'user' : 'bot')
              : (String(message.id).includes('HumanMessage') ? 'user' : 'bot');

            return {
              id: `${index}-${generateId()}`,
              text: messageContent,
              sender: sender as 'user' | 'bot',
              createdAt: timestamp,
            };
          });

          console.log("Messaggi caricati:", loadedMessages);
          messages.value = loadedMessages;
          
          // Se la cronologia è vuota ma ci sono messaggi iniziali, li aggiunge
          if (messages.value.length === 0 && initialMessages.value.length > 0) {
            console.log("Sessione vuota, aggiunto messaggi iniziali");
            messages.value = [...initialMessages.value];
          }

          return sessionIdFromStorage;
        }

        // Sessione vuota - aggiunge messaggi iniziali se presenti
        console.log("Nessun messaggio precedente trovato per la sessione:", sessionIdFromStorage);
        messages.value = initialMessages.value.length > 0 ? [...initialMessages.value] : [];
        return sessionIdFromStorage;

      } catch (error) {
        console.error('Errore durante il caricamento della sessione precedente:', error);
        return await startNewSession();
      }
    }

    /**
     * Assicura che esista un ID di sessione valido
     */
    async function ensureSessionId(): Promise<string> {
      if (!currentSessionId.value) {
        const sessionId = resolvedOptions.value.loadPreviousSession 
          ? await loadPreviousSessionHandler() 
          : await startNewSession();
        
        if (!sessionId) {
          throw new Error("Impossibile stabilire un ID di sessione");
        }
        return sessionId;
      }
      return currentSessionId.value;
    }

    /**
     * Aggiunge un messaggio di errore alla chat
     */
    function addErrorMessage(text: string): void {
      messages.value.push({
        id: generateId(),
        text,
        sender: 'bot',
        createdAt: new Date().toISOString(),
      });
    }

    /**
     * Estrae i testi di risposta dall'oggetto response
     */
    function extractResponseTexts(response: any): string[] {
      // Gestisce array di messaggi
      if (Array.isArray(response.output)) {
        return response.output.filter((msg: any) => typeof msg === 'string' && msg.trim() !== '');
      }
      
      // Gestisce stringa singola
      if (typeof response.output === 'string' && response.output.trim() !== '') {
        return [response.output];
      }
      
      // Fallback su response.text
      const fallbackText = response.text ?? '';
      if (fallbackText.trim() !== '') {
        return [fallbackText];
      }

      // Se non ci sono testi ma ci sono altri dati (senza azioni), converte in JSON
      if (Object.keys(response).length > 0 && (!response.actions || response.actions.length === 0)) {
        try {
          return [JSON.stringify(response, null, 2)];
        } catch (e) {
          return [];
        }
      }

      return [];
    }

    /**
     * Processa le azioni dalla risposta del server
     */
    function processActions(actions: ChatAction[]): void {
      const callbackAction = actions.find(
        action => action.type === 'callback' && 
                 typeof action.value === 'string' && 
                 action.value.trim() !== ''
      );
      
      if (callbackAction?.value) {
        console.log(`Azione callback ricevuta. Memorizzo il valore: ${callbackAction.value} per il prossimo messaggio utente.`);
        pendingCallbackValue.value = callbackAction.value;
      }
    }

    /**
     * Crea e aggiunge i messaggi di risposta del bot
     */
    function addBotMessages(responseTexts: string[], actions?: ChatAction[]): void {
      responseTexts.forEach((responseText, index) => {
        const receivedMessage: ChatMessage = {
          id: generateId(),
          text: responseText,
          sender: 'bot',
          createdAt: new Date().toISOString(),
        };

        // Aggiunge le azioni solo al primo messaggio per evitare duplicazioni
        if (index === 0 && actions?.length) {
          receivedMessage.actions = actions;
          processActions(actions);
        }

        messages.value.push(receivedMessage);
      });

      // Se ci sono azioni ma nessun testo, crea comunque un messaggio per le azioni
      if (responseTexts.length === 0 && actions?.length) {
        const actionsMessage: ChatMessage = {
          id: generateId(),
          text: '',
          sender: 'bot',
          createdAt: new Date().toISOString(),
          actions,
        };

        processActions(actions);
        messages.value.push(actionsMessage);
      }
    }

    /**
     * Invia un messaggio al server
     */
    async function sendMessageHandler(
        text: string,
        files: File[] = [],
        privacy?: boolean
    ): Promise<void> {
      const userMessageText = text.trim();
      const callbackToSend = pendingCallbackValue.value;

      // Verifica se c'è qualcosa da inviare
      if (!userMessageText && !files.length && privacy === undefined && !callbackToSend) {
        console.log("sendMessageHandler: Nessun contenuto da inviare.");
        return;
      }

      try {
        // Assicura che esista un ID di sessione
        const sessionId = await ensureSessionId();

        // Aggiunge il messaggio dell'utente all'UI solo se c'è contenuto effettivo
        if (userMessageText || files.length > 0) {
          const sentMessage: ChatMessage = {
            id: generateId(),
            text: userMessageText,
            sender: 'user',
            files,
            createdAt: new Date().toISOString(),
          };
          messages.value.push(sentMessage);
        }
        
        waitingForResponse.value = true;

        // Invia il messaggio al server
        const response = await sendMessage(
          userMessageText,
          files,
          sessionId,
          resolvedOptions.value,
          privacy,
          callbackToSend
        );

        // Reset del callback se inviato con successo
        if (callbackToSend) {
          pendingCallbackValue.value = null;
        }

        // Estrae e processa la risposta
        const responseTexts = extractResponseTexts(response);
        addBotMessages(responseTexts, response.actions);

      } catch (error) {
        console.error('Invio messaggio fallito:', error);
        addErrorMessage('Spiacenti, si è verificato un errore durante l\'elaborazione della tua richiesta. Riprova.');
      } finally {
        waitingForResponse.value = false;
      }
    }

    // Crea lo store della chat
    const chatStore: Chat = {
      messages,
      currentSessionId,
      waitingForResponse,
      pendingCallbackValue,
      loadPreviousSession: loadPreviousSessionHandler,
      startNewSession,
      sendMessage: sendMessageHandler,
    };

    // Fornisce lo store come injection
    app.provide(ChatSymbol, chatStore);
  },
};