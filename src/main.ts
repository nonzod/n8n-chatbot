import './style.scss';
import { createApp } from 'vue';
import type { App, Component } from 'vue';
import type { ChatOptions } from './types';
import { createMountingElement, applyTheme } from './utils/helpers';
import { ChatPlugin } from './plugins';
import AppComponent from './App.vue';

// Opzioni di default
const DEFAULT_TARGET = '#tt-chat-n8n';

// Tracking dell'istanza dell'app per evitare istanze multiple
let currentAppInstance: ReturnType<typeof createApp> | null = null;
let currentContainer: Element | null = null;

/**
 * Crea il widget di chat
 */
export function createChat(options: ChatOptions): {
  unmount: () => void;
  _app: ReturnType<typeof createApp>;
  _container: Element;
} {
  console.log('Creating chat widget with options:', options);

  if (!options.webhookUrl) {
    console.error('[SimpleChatN8N] webhookUrl is required');
    throw new Error('webhookUrl is required');
  }

  // Target di montaggio
  const target = options.target || DEFAULT_TARGET;
  const targetElement = typeof target === 'string'
    ? createMountingElement(target)
    : target;

  // Controlla se c'è già un'istanza attiva per questo target
  if (currentAppInstance && currentContainer === targetElement) {
    console.log('Instance already exists for this target, reusing it');
    return {
      unmount: () => currentAppInstance?.unmount(),
      _app: currentAppInstance,
      _container: targetElement,
    };
  }

  // Se esiste un'istanza precedente per un target diverso, la smontiamo
  if (currentAppInstance) {
    console.log('Unmounting previous instance');
    currentAppInstance.unmount();
    currentAppInstance = null;
    currentContainer = null;
  }

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

  // Memorizza l'istanza corrente
  currentAppInstance = app;
  currentContainer = targetElement;

  console.log('Chat widget created and mounted on:', targetElement);

  return {
    unmount: () => {
      app.unmount();
      currentAppInstance = null;
      currentContainer = null;
    },
    _app: app,
    _container: targetElement,
  };
}

// Esporta i tipi
export type { ChatOptions, ChatMessage } from './types';

// Esporta i componenti
export * from './components';