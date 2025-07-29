import type { Ref } from 'vue';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  createdAt: string;
  files?: File[];
  actions?: ChatAction[];
}

export interface ChatOptions {
  // Webhook configuration
  webhookUrl: string;
  webhookConfig?: {
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
  };
  
  // UI configuration
  target?: string | Element;
  mode?: 'window' | 'fullscreen';
  initialMessages?: string[];
  
  // Chat configuration
  chatInputKey?: string;
  chatSessionKey?: string;
  loadPreviousSession?: boolean;
  
  // Customization
  showTooltip?: boolean;
  tooltipText?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    userMessageColor?: string;
    botMessageColor?: string;
    userTextColor?: string;
    botTextColor?: string;
    headerColor?: string;
    headerTextColor?: string;
    toggleBackground?: string; // Aggiunto per coerenza con helpers.ts
  };
  
  // Icons customization (Base64 encoded SVG)
  icons?: {
    openChat?: string;
    closeChat?: string;
    send?: string;
    headerLogo?: string;
  };

  // i18n
  placeholder?: string;
  title?: string;
  subtitle?: string;
  
  // Optional features
  allowFileUploads?: boolean;
}

export interface Chat {
  messages: Ref<ChatMessage[]>;
  currentSessionId: Ref<string | null>;
  waitingForResponse: Ref<boolean>;
  pendingCallbackValue: Ref<string | null>;
  loadPreviousSession?: () => Promise<string | undefined>;
  startNewSession?: () => Promise<string>;
  sendMessage: (text: string, files: File[], privacy?: boolean) => Promise<void>;
}

// API response types
export interface LoadPreviousSessionResponseItem {
  id: string | string[];
  kwargs: {
    content: string;
    additional_kwargs?: Record<string, unknown>;
  };
}

export interface LoadPreviousSessionResponse {
  data: LoadPreviousSessionResponseItem[];
}

// Actions
export interface ChatAction {
  type: 'button' | 'checkbox' | 'privacy' | 'callback' | 'select_province' | 'datepicker';
  label: string;
  action: string;
  value?: string;
}

export interface SendMessageResponse {
  output?: string | string[];
  text?: string;
  actions?: ChatAction[];
}