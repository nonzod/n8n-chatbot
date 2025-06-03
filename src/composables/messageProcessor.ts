// src/composables/messageProcessor.ts
import type { Ref } from 'vue';
import { generateId } from '../utils/helpers';
import type { ChatMessage, ChatAction } from '../types';

export class MessageProcessor {
  constructor(
    private messages: Ref<ChatMessage[]>,
    private pendingCallbackValue: Ref<string | null>
  ) {}

  /**
   * Aggiunge un messaggio di errore alla chat
   */
  addErrorMessage(text: string): void {
    this.messages.value.push({
      id: generateId(),
      text,
      sender: 'bot',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Aggiunge un messaggio utente alla chat
   */
  addUserMessage(text: string, files: File[] = []): void {
    if (text.trim() || files.length > 0) {
      const sentMessage: ChatMessage = {
        id: generateId(),
        text: text.trim(),
        sender: 'user',
        files,
        createdAt: new Date().toISOString(),
      };
      this.messages.value.push(sentMessage);
    }
  }

  /**
   * Estrae i testi di risposta dall'oggetto response
   */
  extractResponseTexts(response: any): string[] {
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
  processActions(actions: ChatAction[]): void {
    const callbackAction = actions.find(
      action => action.type === 'callback' && 
               typeof action.value === 'string' && 
               action.value.trim() !== ''
    );
    
    if (callbackAction?.value) {
      console.log(`Azione callback ricevuta. Memorizzo il valore: ${callbackAction.value} per il prossimo messaggio utente.`);
      this.pendingCallbackValue.value = callbackAction.value;
    }
  }

  /**
   * Crea e aggiunge i messaggi di risposta del bot
   */
  addBotMessages(responseTexts: string[], actions?: ChatAction[]): void {
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
        this.processActions(actions);
      }

      this.messages.value.push(receivedMessage);
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

      this.processActions(actions);
      this.messages.value.push(actionsMessage);
    }
  }
}