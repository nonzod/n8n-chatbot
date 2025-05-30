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
      theme: {}, // Sarà unito con le opzioni utente
      allowFileUploads: false,
      showTooltip: true,
      tooltipText: "Hai bisogno di aiuto?",
      initialMessages: [],
      placeholder: 'Scrivi un messaggio...',
      title: 'Chat',
      subtitle: 'Come posso aiutarti?',
    };

    // Unisci le opzioni fornite con i default
    const resolvedOptions = ref<ChatOptions>({
      ...defaultOptions,
      ...options,
      webhookConfig: {
        ...defaultOptions.webhookConfig,
        ...options.webhookConfig,
      },
      theme: { // Assicura un merge corretto anche per il tema
        ...defaultOptions.theme,
        ...options.theme,
      },
      icons: {
        ...defaultOptions.icons,
        ...options.icons,
      }
    });

    // Fornisci le opzioni come injection
    app.provide(OptionsSymbol, resolvedOptions);

    // Stato della chat
    const messages = ref<ChatMessage[]>([]);
    const currentSessionId = ref<string | null>(null);
    const waitingForResponse = ref(false);
    const pendingCallbackValue = ref<string | null>(null); // Stato per il valore del callback in sospeso

    // Messaggi iniziali
    const initialMessages = computed<ChatMessage[]>(() =>
      (resolvedOptions.value.initialMessages || []).map((text) => ({
        id: generateId(),
        text,
        sender: 'bot',
        createdAt: new Date().toISOString(),
      }))
    );

    /**
     * Carica la sessione precedente o ne inizia una nuova se necessario.
     * Restituisce l'ID di sessione.
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
      currentSessionId.value = sessionIdFromStorage; // Imposta l'ID corrente

      try {
        const previousMessagesResponse = await loadPreviousSession(
          sessionIdFromStorage,
          resolvedOptions.value
        );

        console.log("Risposta caricamento sessione:", previousMessagesResponse);

        if (previousMessagesResponse?.data && Array.isArray(previousMessagesResponse.data) && previousMessagesResponse.data.length > 0) {
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
          if (loadedMessages.length > 0) {
            messages.value = loadedMessages;
            // currentSessionId.value è già impostato
            // localStorage ha già l'ID di sessione
            console.log("Sessione caricata con successo, messaggi:", messages.value.length);
            return sessionIdFromStorage;
          }
        }

        // Se non ci sono messaggi caricati ma abbiamo messaggi iniziali, tecnicamente dovrebbe essere una nuova sessione
        // ma poiché loadPreviousSession = true e abbiamo un ID, manteniamo l'ID ma mostriamo i messaggi iniziali
        // Questo scenario è un po' ambiguo. Per ora, se non ci sono messaggi, non aggiungiamo quelli iniziali qui.
        // Se vogliamo che i messaggi iniziali appaiano se la cronologia è vuota, startNewSession li gestisce.
        // Se la cronologia è vuota, ma l'ID sessione esiste, non verranno mostrati i messaggi iniziali.
        // Per coerenza, se non ci sono messaggi precedenti, forse è meglio resettare e usare startNewSession?
        // Per ora, se non ci sono messaggi da caricare, considerala una sessione "vuota" con l'ID esistente.
        // Se l'utente vuole iniziare fresco, dovrebbe pulire localStorage o implementare un bottone "nuova chat".
        console.log("Nessun messaggio precedente trovato per la sessione:", sessionIdFromStorage);
        messages.value = []; // Pulisci i messaggi se la sessione caricata è vuota
        if (initialMessages.value.length > 0 && messages.value.length === 0) {
            console.log("La sessione caricata è vuota, ma ci sono messaggi iniziali. Aggiungo messaggi iniziali.");
            messages.value = [...initialMessages.value];
        }


        return sessionIdFromStorage;
      } catch (error) {
        console.error('Errore durante il caricamento della sessione precedente:', error);
        // In caso di errore nel caricamento, inizia una nuova sessione
        return await startNewSession();
      }
    }

    /**
     * Inizia una nuova sessione.
     * Restituisce il nuovo ID di sessione.
     */
    async function startNewSession(): Promise<string> {
      const newSessionId = generateId();
      currentSessionId.value = newSessionId;
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, newSessionId);
      pendingCallbackValue.value = null; // Resetta il callback in sospeso

      // Aggiungi i messaggi iniziali se presenti
      if (initialMessages.value.length > 0) {
        messages.value = [...initialMessages.value];
      } else {
        // Pulisci i messaggi esistenti
        messages.value = [];
      }

      console.log("Nuova sessione iniziata:", newSessionId);
      return newSessionId;
    }

    /**
     * Invia un messaggio.
     * Il parametro 'callback' non è più passato direttamente qui;
     * viene letto da 'pendingCallbackValue'.
     */
    async function sendMessageHandler(
        text: string,
        files: File[] = [],
        privacy?: boolean
    ): Promise<void> {
      // Assicura che ci sia un ID di sessione
      if (!currentSessionId.value) {
        // Prova a caricare o iniziare una nuova sessione
        // loadPreviousSessionHandler si occuperà di chiamare startNewSession se necessario
        await (resolvedOptions.value.loadPreviousSession ? loadPreviousSessionHandler() : startNewSession());
        
        // Se dopo il tentativo non c'è ancora un ID di sessione, è un problema.
        if (!currentSessionId.value) {
            console.error("Impossibile stabilire un ID di sessione.");
            messages.value.push({
                id: generateId(),
                text: 'Errore: Impossibile stabilire una sessione. Per favore, ricarica.',
                sender: 'bot',
                createdAt: new Date().toISOString(),
            });
            waitingForResponse.value = false; // Resetta lo stato di attesa
            return;
        }
      }

      const userMessageText = text.trim();
      const callbackToSend = pendingCallbackValue.value; // Leggi il valore del callback in sospeso

      // Condizione per non inviare:
      // - Nessun testo utente
      // - Nessun file
      // - Non è una risposta a un prompt di privacy (privacy === undefined)
      // - Nessun callback in sospeso da inviare
      if (userMessageText === '' && files.length === 0 && privacy === undefined && !callbackToSend) {
        console.log("sendMessageHandler: Nessun testo, file, dati privacy o callback in sospeso. Nulla da inviare.");
        return; // Non fare nulla se non c'è input significativo e nessun callback
      }

      // Aggiungi il messaggio dell'utente all'UI solo se c'è testo o file effettivi
      // Se è solo un callback con testo vuoto, la richiesta verrà inviata,
      // ma non aggiungeremo un messaggio utente vuoto all'UI.
      if (userMessageText !== '' || files.length > 0) {
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

      try {
        // Invia il messaggio al server
        const response = await sendMessage(
          userMessageText, // Può essere una stringa vuota se l'utente ha solo premuto invio con un callback pendente
          files,
          currentSessionId.value as string, // Ora dovrebbe essere sempre valorizzato
          resolvedOptions.value,
          privacy,
          callbackToSend // Invia il valore del callback memorizzato (può essere null)
        );

        // Se il messaggio è stato inviato con successo e c'era un callback, resettalo.
        if (callbackToSend) {
          pendingCallbackValue.value = null;
        }

        // Estrai il testo dalla risposta
        let responseText = response.output ?? response.text ?? '';

        // Se non c'è un testo ma ci sono altri dati (e non ci sono azioni), prova a convertirli in JSON
        if (responseText === '' && Object.keys(response).length > 0 && (!response.actions || response.actions.length === 0)) {
          try {
            responseText = JSON.stringify(response, null, 2);
          } catch (e) {
            // In caso di errore, usa una stringa vuota
            responseText = '';
          }
        }

        // Crea il messaggio di risposta del bot se c'è testo o azioni
        if (responseText.trim() !== '' || (response.actions && response.actions.length > 0) ) {
            const receivedMessage: ChatMessage = {
              id: generateId(),
              text: responseText,
              sender: 'bot',
              createdAt: new Date().toISOString(),
            };
    
            // Aggiungi le azioni se presenti nella risposta
            if (response.actions && Array.isArray(response.actions) && response.actions.length > 0) {
              receivedMessage.actions = response.actions;
    
              // --- LOGICA PER MEMORIZZARE NUOVA AZIONE CALLBACK DALLA RISPOSTA ---
              const newCallbackAction = receivedMessage.actions.find(
                (action: ChatAction) => action.type === 'callback' && typeof action.value === 'string' && action.value.trim() !== ''
              );
              if (newCallbackAction && newCallbackAction.value) {
                console.log(`Azione callback ricevuta. Memorizzo il valore: ${newCallbackAction.value} per il prossimo messaggio utente.`);
                pendingCallbackValue.value = newCallbackAction.value; // Memorizza per il PROSSIMO invio
              }
              // --- FINE LOGICA ---
            }
    
            // Aggiungi la risposta alla lista dei messaggi
            messages.value.push(receivedMessage);
        }

      } catch (error) {
        console.error('Invio messaggio fallito:', error);
        // Non resettare pendingCallbackValue.value qui, così può essere ritentato col prossimo messaggio.
        // Il callback rimane "in sospeso" se l'invio fallisce.
        messages.value.push({
          id: generateId(),
          text: 'Spiacenti, si è verificato un errore durante l\'elaborazione della tua richiesta. Riprova.',
          sender: 'bot',
          createdAt: new Date().toISOString(),
        });
      } finally {
        waitingForResponse.value = false;
      }
    }

    // Crea lo store della chat
    const chatStore: Chat = {
      initialMessages, // Questo è un ComputedRef, non direttamente ChatMessage[]
      messages,
      currentSessionId,
      waitingForResponse,
      pendingCallbackValue, // Esponi il valore del callback reattivo
      loadPreviousSession: loadPreviousSessionHandler,
      startNewSession,
      sendMessage: sendMessageHandler, // La firma ora corrisponde a quella definita in interface Chat
    };

    // Fornisci lo store come injection
    app.provide(ChatSymbol, chatStore);
  },
};