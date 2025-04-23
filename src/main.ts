import './style.css';
import { createApp } from 'vue';
import type { App, Component } from 'vue';
import type { ChatOptions } from './types';
import { createMountingElement, applyTheme } from './utils/helpers';
import { ChatPlugin } from './plugins';
import AppComponent from './App.vue';

// Opzioni di default
const DEFAULT_TARGET = '#simple-chat-n8n';

/**
 * Crea il widget di chat
 */
export function createChat(options: ChatOptions): { 
  unmount: () => void;
  _app: ReturnType<typeof createApp>;
  _container: Element;
} {
  console.log('Creazione del widget di chat con opzioni:', options);
  
  if (!options.webhookUrl) {
    console.error('[SimpleChatN8N] webhookUrl is required');
    throw new Error('webhookUrl is required');
  }

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
  const app = createApp(AppComponent as Component);
  
  // Registra il plugin
  app.use(ChatPlugin, options);
  
  // Monta l'app
  app.mount(targetElement);
  
  console.log('Widget di chat creato e montato su:', targetElement);
  
  return {
    unmount: () => app.unmount(),
    _app: app,
    _container: targetElement,
  };
}

// Esporta i tipi
export type { ChatOptions, ChatMessage } from './types';

// Esporta i componenti
export * from './components';