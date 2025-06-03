// src/plugins/chatPlugin.ts - Versione refactored
import type { App, Plugin } from 'vue';
import { ref, computed } from 'vue';

import { sendMessage } from '../utils/api';
import { ChatSymbol } from '../composables/useChat';
import { OptionsSymbol } from '../composables/useOptions';
import { SessionManager } from '../composables/sessionManager';
import { MessageProcessor } from '../composables/messageProcessor';
import type { ChatOptions, ChatMessage, Chat } from '../types';
import { generateId } from '../utils/helpers';

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

    // Inizializza i manager
    const sessionManager = new SessionManager(
      currentSessionId,
      messages,
      resolvedOptions.value,
      initialMessages.value
    );

    const messageProcessor = new MessageProcessor(
      messages,
      pendingCallbackValue
    );

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
        const sessionId = await sessionManager.ensureSessionId();

        // Aggiunge il messaggio dell'utente all'UI solo se c'è contenuto effettivo
        messageProcessor.addUserMessage(userMessageText, files);
        
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
        const responseTexts = messageProcessor.extractResponseTexts(response);
        messageProcessor.addBotMessages(responseTexts, response.actions);

      } catch (error) {
        console.error('Invio messaggio fallito:', error);
        messageProcessor.addErrorMessage('Spiacenti, si è verificato un errore durante l\'elaborazione della tua richiesta. Riprova.');
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
      loadPreviousSession: () => sessionManager.loadPreviousSession(),
      startNewSession: () => sessionManager.startNewSession(),
      sendMessage: sendMessageHandler,
    };

    // Fornisce lo store come injection
    app.provide(ChatSymbol, chatStore);
  },
};