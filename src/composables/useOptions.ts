import { inject, ref } from 'vue';
import type { ChatOptions } from '../types';

// Symbol per l'iniezione delle opzioni
export const OptionsSymbol = Symbol('Options');

/**
 * Composable per accedere alle opzioni della chat
 * @returns Oggetto di opzioni della chat
 */
export function useOptions() {
  const options = inject(OptionsSymbol);
  
  if (!options) {
    throw new Error('useOptions() must be used within a chat provider');
  }
  
  return options as ReturnType<typeof ref<ChatOptions>>;
}