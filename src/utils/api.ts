import type {
  ChatOptions,
  LoadPreviousSessionResponse,
  SendMessageResponse
} from '../types';

// Costante per l'ID della sessione in localStorage
export const LOCAL_STORAGE_SESSION_KEY = 'tt-chat-n8n-session-id';

/**
 * Funzione per fare richieste API autenticate
 */
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  console.log("Calling API:", url, options);
  const response = await fetch(url, {
    mode: 'cors',
    cache: 'no-cache',
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  const result = await response.json() as T;
  console.log("API Response:", result);
  return result;
}

/**
 * Funzione per caricare la sessione precedente
 */
export async function loadPreviousSession(
  sessionId: string, 
  options: ChatOptions
): Promise<LoadPreviousSessionResponse> {
  console.log("Loading previous session with ID:", sessionId);
  
  const method = options.webhookConfig?.method === 'POST' ? 'POST' : 'GET';
  const body = {
    action: 'loadPreviousSession',
    [options.chatSessionKey || 'sessionId']: sessionId,
  };
  
  if (method === 'POST') {
    return await fetchApi<LoadPreviousSessionResponse>(options.webhookUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.webhookConfig?.headers,
      },
      body: JSON.stringify(body),
    });
  } else {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    
    return await fetchApi<LoadPreviousSessionResponse>(
      `${options.webhookUrl}?${params.toString()}`,
      {
        method,
        headers: options.webhookConfig?.headers,
      }
    );
  }
}

/**
 * Funzione per inviare un messaggio
 */
export async function sendMessage(
  message: string,
  files: File[],
  sessionId: string,
  options: ChatOptions,
  privacy?: boolean
): Promise<SendMessageResponse> {
  const method = options.webhookConfig?.method === 'POST' ? 'POST' : 'GET';
  const body: Record<string, any> = {
    action: 'sendMessage',
    [options.chatSessionKey || 'sessionId']: sessionId,
    [options.chatInputKey || 'chatInput']: message,
  };
  
  // Aggiungi il parametro privacy se è stato specificato
  if (privacy !== undefined) {
    body.privacy = privacy;
  }
  
  // Se ci sono file, usa FormData per l'upload
  if (files.length > 0) {
    const formData = new FormData();
    
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return await fetchApi<SendMessageResponse>(options.webhookUrl, {
      method: 'POST',
      headers: options.webhookConfig?.headers,
      body: formData,
    });
  }
  
  // Altrimenti usa JSON
  if (method === 'POST') {
    return await fetchApi<SendMessageResponse>(options.webhookUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.webhookConfig?.headers,
      },
      body: JSON.stringify(body),
    });
  } else {
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    
    return await fetchApi<SendMessageResponse>(
      `${options.webhookUrl}?${params.toString()}`,
      {
        method,
        headers: options.webhookConfig?.headers,
      }
    );
  }
}