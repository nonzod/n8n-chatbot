import { inject } from 'vue';
import type { Chat } from '../types';

// Symbol per l'iniezione dello stato della chat
export const ChatSymbol = Symbol('Chat');

/**
 * Composable per accedere allo stato della chat
 * @returns Stato globale della chat
 */
export function useChat(): Chat {
  const chat = inject(ChatSymbol);
  
  if (!chat) {
    throw new Error('useChat() must be used within a chat provider');
  }
  
  return chat as Chat;
}