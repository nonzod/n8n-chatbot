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
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  
  // i18n (simplified)
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
  loadPreviousSession?: () => Promise<string | undefined>;
  startNewSession?: () => Promise<void>;
  sendMessage: (text: string, files: File[]) => Promise<void>;
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

export interface SendMessageResponse {
  output?: string;
  text?: string;
}

// Actions
export interface ChatAction {
  type: 'button' | 'checkbox';
  label: string;
  action: string;
}

export interface SendMessageResponse {
  output?: string;
  text?: string;
  actions?: ChatAction[];
}