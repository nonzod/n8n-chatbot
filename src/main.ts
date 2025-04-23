import { createApp } from 'vue';
import type { ChatOptions } from './types';
import { createMountingElement, applyTheme } from './utils/helpers';
import { ChatPlugin } from './plugins';
import App from './App.vue';

// Opzioni di default
const DEFAULT_TARGET = '#simple-chat-n8n';

/**
 * Crea il widget di chat
 */
export function createChat(options: ChatOptions): { 
  unmount: () => void;
  _app: ReturnType<typeof createApp>;
} {
  // Target di montaggio
  const target = options.target || DEFAULT_TARGET;
  const targetElement = typeof target === 'string' 
    ? createMountingElement(target) 
    : target;
  
  // Applica il tema se fornito
  if (options.theme) {
    applyTheme(options.theme);
  }
  
  // Crea l'app
  const app = createApp(App);
  app.use(ChatPlugin, options);
  
  // Monta l'app
  app.mount(targetElement);
  
  return {
    unmount: () => app.unmount(),
    _app: app,
  };
}

// Esporta i tipi
export type { ChatOptions, ChatMessage } from './types';