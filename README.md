# Chatbot frontend for N8N

```txt
simple-chat-n8n/
├── src/
│   ├── components/
│   │   ├── Chat.vue            # Componente principale 
│   │   ├── ChatInput.vue       # Input per i messaggi
│   │   ├── ChatMessage.vue     # Componente per i singoli messaggi
│   │   └── ChatWindow.vue      # Wrapper per modalità finestra
│   ├── composables/
│   │   ├── useChat.ts          # Logica principale della chat
│   │   └── useOptions.ts       # Gestione opzioni
│   ├── utils/
│   │   ├── api.ts              # Chiamate API
│   │   └── helpers.ts          # Funzioni di utilità
│   ├── App.vue                 # Componente root
│   ├── main.ts                 # Entry point
│   └── types.ts                # Type definitions
├── package.json
├── vite.config.ts
└── README.md
```

# Simple Chat N8N

Una versione semplificata del widget di chat per n8n, implementata con Vue 3 e TypeScript.

## Caratteristiche

- 🔄 Chat in modalità finestra o schermo intero
- 💬 Invio e ricezione di messaggi
- 🗄️ Sessioni di chat persistenti
- 🎨 Personalizzazione UI con variabili CSS
- 📱 Layout responsive
- 🔌 Facile integrazione

## Installazione

```bash
npm install simple-chat-n8n
```

## Utilizzo

### Inclusione tramite CDN

```html
<link href="https://cdn.jsdelivr.net/npm/simple-chat-n8n/dist/style.css" rel="stylesheet">
<script type="module">
  import { createChat } from 'https://cdn.jsdelivr.net/npm/simple-chat-n8n/dist/simple-chat.es.js';

  createChat({
    webhookUrl: 'YOUR_N8N_WEBHOOK_URL'
  });
</script>
```

### Inclusione tramite NPM

```javascript
import { createChat } from 'simple-chat-n8n';
import 'simple-chat-n8n/style.css';

createChat({
  webhookUrl: 'YOUR_N8N_WEBHOOK_URL'
});
```

## Opzioni

```javascript
createChat({
  // Obbligatorio: URL del webhook n8n
  webhookUrl: 'https://n8n.example.com/webhook/your-id',
  
  // Opzionale: Configurazione della richiesta
  webhookConfig: {
    method: 'POST', // 'GET' o 'POST'
    headers: {} // Header HTTP personalizzati
  },
  
  // Opzionale: Selettore CSS o elemento DOM dove montare la chat
  target: '#simple-chat-n8n',
  
  // Opzionale: Modalità di visualizzazione
  mode: 'window', // 'window' o 'fullscreen'
  
  // Opzionale: Messaggi iniziali da mostrare
  initialMessages: [
    'Ciao! 👋',
    'Come posso aiutarti oggi?'
  ],
  
  // Opzionale: Chiavi per i parametri della richiesta
  chatInputKey: 'chatInput',
  chatSessionKey: 'sessionId',
  
  // Opzionale: Carica la sessione precedente
  loadPreviousSession: true,
  
  // Opzionale: Consenti upload di file
  allowFileUploads: false,
  
  // Opzionale: Testi personalizzati
  title: 'Chat',
  subtitle: 'Come posso aiutarti?',
  placeholder: 'Scrivi un messaggio...',
  
  // Opzionale: Personalizzazione del tema
  theme: {
    primaryColor: '#2196f3',
    backgroundColor: '#ffffff',
    userMessageColor: '#e0f7fa',
    botMessageColor: '#f5f5f5',
    userTextColor: '#000000',
    botTextColor: '#000000',
    headerColor: '#f5f5f5',
    headerTextColor: '#333333'
  }
});
```

## Funzionamento con N8N

Per utilizzare questo widget di chat, è necessario configurare un flusso di lavoro N8N che utilizza il nodo "Chat Trigger". Il flusso di lavoro deve gestire due tipi di azioni:

1. `loadPreviousSession` - Quando l'utente apre la chat e la sessione precedente deve essere caricata
2. `sendMessage` - Quando l'utente invia un messaggio

### Esempio di flusso di lavoro N8N

Consulta la documentazione ufficiale di N8N per creare un flusso di lavoro con il nodo "Chat Trigger" o utilizza il flusso di esempio fornito nella repository.

## Personalizzazione CSS

Il widget può essere personalizzato tramite le variabili CSS:

```css
:root {
  --simple-chat-primary-color: #2196f3;
  --simple-chat-bg: #ffffff;
  --simple-chat-user-bg: #e0f7fa;
  --simple-chat-bot-bg: #f5f5f5;
  --simple-chat-user-color: #000000;
  --simple-chat-bot-color: #000000;
  --simple-chat-header-bg: #f5f5f5;
  --simple-chat-header-color: #333333;
}
```

## Licenza

MIT
