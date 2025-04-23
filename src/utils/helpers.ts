/**
 * Genera un ID univoco semplice
 * Versione semplificata, in produzione usare UUID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Crea l'elemento di montaggio se non esiste
 */
export function createMountingElement(target: string): HTMLElement {
  let element = document.querySelector(target) as HTMLElement;
  
  if (!element) {
    element = document.createElement('div');
    
    if (target.startsWith('#')) {
      element.id = target.substring(1);
    } else if (target.startsWith('.')) {
      element.className = target.substring(1);
    }
    
    document.body.appendChild(element);
  }
  
  return element;
}

/**
 * Applica il tema dinamicamente
 */
export function applyTheme(theme: Record<string, string> = {}): void {
  const themeVars = {
    '--tt-chat-primary-color': theme.primaryColor || '#2196f3',
    '--tt-chat-bg': theme.backgroundColor || '#ffffff',
    '--tt-chat-user-bg': theme.userMessageColor || '#e0f7fa',
    '--tt-chat-bot-bg': theme.botMessageColor || '#f5f5f5',
    '--tt-chat-user-color': theme.userTextColor || '#000000',
    '--tt-chat-bot-color': theme.botTextColor || '#000000',
    '--tt-chat-header-bg': theme.headerColor || '#f5f5f5',
    '--tt-chat-header-color': theme.headerTextColor || '#333333',
  };
  
  const style = document.createElement('style');
  style.setAttribute('id', 'tt-chat-theme');
  
  const cssVariables = Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
    
  style.textContent = `:root {\n${cssVariables}\n}`;
  
  // Rimuove lo stile precedente se esiste
  const existingStyle = document.getElementById('tt-chat-theme');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  document.head.appendChild(style);
}