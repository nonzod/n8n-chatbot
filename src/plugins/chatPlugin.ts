import type { App, Plugin } from 'vue';
import { ref, computed } from 'vue';

import { LOCAL_STORAGE_SESSION_KEY, loadPreviousSession, sendMessage } from '../utils/api';
import { generateId } from '../utils/helpers';
import { ChatSymbol, OptionsSymbol } from '../composables/useChat';
import type { ChatOptions, ChatMessage } from '../types';

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
    };
    
    // Unisci le opzioni fornite con i default
    const resolvedOptions = ref({
      ...defaultOptions,
      ...options,
      webhookConfig: {
        ...defaultOptions.webhookConfig,
        ...options.webhookConfig,
      },
    });
    
    // Fornisci le opzioni come injection
    app.provide(OptionsSymbol, resolvedOptions);
    
    // Stato della chat
    const messages = ref<ChatMessage[]>([]);
    const currentSessionId = ref<string | null>(null);
    const waitingForResponse = ref(false);
    
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
     * Carica la sessione precedente
     */
    async function loadPreviousSessionHandler(): Promise<string | undefined> {
      if (!resolvedOptions.value.loadPreviousSession) {
        return;
      }
      
      // Recupera l'ID di sessione da localStorage o crea un nuovo ID
      const sessionId = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY) || generateId();
      
      try {
        // Carica i messaggi precedenti
        const previousMessagesResponse = await loadPreviousSession(
          sessionId, 
          resolvedOptions.value
        );
        
        const timestamp = new Date().toISOString();
        
        // Converte i messaggi nel formato corretto
        messages.value = (previousMessagesResponse?.data || []).map((message, index) => ({
          id: `${index}`,
          text: message.kwargs.content,
          sender: message.id.includes('HumanMessage') ? 'user' : 'bot',
          createdAt: timestamp,
        }));
        
        // Se ci sono messaggi, imposta l'ID di sessione
        if (messages.value.length) {
          currentSessionId.value = sessionId;
        }
        
        return sessionId;
      } catch (error) {
        console.error('Failed to load previous session:', error);
        return undefined;
      }
    }
    
    /**
     * Inizia una nuova sessione
     */
    async function startNewSession(): Promise<void> {
      const newSessionId = generateId();
      currentSessionId.value = newSessionId;
      
      // Salva l'ID di sessione in localStorage
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, newSessionId);
    }
    
    /**
     * Invia un messaggio
     */
    async function sendMessageHandler(text: string, files: File[] = []): Promise<void> {
      if (!currentSessionId.value) {
        await startNewSession();
      }
      
      // Crea il messaggio dell'utente
      const sentMessage: ChatMessage = {
        id: generateId(),
        text,
        sender: 'user',
        files,
        createdAt: new Date().toISOString(),
      };
      
      // Aggiungi il messaggio alla lista
      messages.value.push(sentMessage);
      waitingForResponse.value = true;
      
      try {
        // Invia il messaggio al server
        const response = await sendMessage(
          text,
          files,
          currentSessionId.value as string,
          resolvedOptions.value
        );
        
        // Estrai il testo dalla risposta
        let responseText = response.output ?? response.text ?? '';
        
        // Se non c'è un testo ma ci sono altri dati, prova a convertirli in JSON
        if (responseText === '' && Object.keys(response).length > 0) {
          try {
            responseText = JSON.stringify(response, null, 2);
          } catch (e) {
            // In caso di errore, usa una stringa vuota
            responseText = '';
          }
        }
        
        // Crea il messaggio di risposta
        const receivedMessage: ChatMessage = {
          id: generateId(),
          text: responseText,
          sender: 'bot',
          createdAt: new Date().toISOString(),
        };
        
        // Aggiungi la risposta alla lista dei messaggi
        messages.value.push(receivedMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
        
        // Aggiungi un messaggio di errore
        messages.value.push({
          id: generateId(),
          text: 'Sorry, there was an error processing your request. Please try again.',
          sender: 'bot',
          createdAt: new Date().toISOString(),
        });
      } finally {
        waitingForResponse.value = false;
      }
    }
    
    // Crea lo store della chat
    const chatStore = {
      initialMessages,
      messages,
      currentSessionId,
      waitingForResponse,
      loadPreviousSession: loadPreviousSessionHandler,
      startNewSession,
      sendMessage: sendMessageHandler,
    };
    
    // Fornisci lo store come injection
    app.provide(ChatSymbol, chatStore);
  },
};