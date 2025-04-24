# Tourtools N8N Chatbot

Fork del frontend ufficiale del chatbot N8N

## Setup Locale

Node version 22

### Clone e Installazione

```bash
# Clona il repository
git clone [url-del-tuo-repository]
cd tt-chat-n8n

# Installa le dipendenze
npm install
```

### Comandi di Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev

# Esegue la build per la produzione
npm run build

# Verifica i tipi TypeScript
npm run typecheck
```

## Utilizzo Base

### Integrazione come Dipendenza Locale

```javascript
// Nel tuo progetto principale
import { createChat } from './path/to/tt-chat-n8n/dist/tt-chat.es.js';
import './path/to/tt-chat-n8n/dist/style.css';

createChat({
  webhookUrl: 'YOUR_N8N_WEBHOOK_URL'
});
```

### Integrazione Diretta nella Pagina HTML

```html
<script type="module">
  import { createChat } from './path/to/tt-chat-n8n/dist/tt-chat.es.js';
  
  createChat({
    webhookUrl: 'YOUR_N8N_WEBHOOK_URL'
  });
</script>
<link href="./path/to/tt-chat-n8n/dist/style.css" rel="stylesheet">
```

## Opzioni di Configurazione

```javascript
createChat({
  // Obbligatorio: URL del webhook N8N
  webhookUrl: 'https://n8n.example.com/webhook/your-id',
  
  // Configurazione della richiesta HTTP
  webhookConfig: {
    method: 'POST', // 'GET' o 'POST'
    headers: {} // Header HTTP personalizzati
  },
  
  // Selettore o elemento DOM per il mounting
  target: '#tt-chat-n8n',
  
  // Modalità di visualizzazione
  mode: 'window', // 'window' (finestra popup) o 'fullscreen'
  
  // Messaggi iniziali da visualizzare
  initialMessages: [
    'Ciao! 👋',
    'Come posso aiutarti oggi?'
  ],
  
  // Chiavi per parametri della richiesta
  chatInputKey: 'chatInput', // nome del parametro per il testo di input
  chatSessionKey: 'sessionId', // nome del parametro per l'ID sessione
  
  // Gestione sessione
  loadPreviousSession: true, // carica la conversazione precedente
  
  // Funzionalità file
  allowFileUploads: false, // abilita upload di file
  
  // Testi dell'interfaccia
  title: 'Chat',
  subtitle: 'Come posso aiutarti?',
  placeholder: 'Scrivi un messaggio...',
  
  // Personalizzazione tema
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

## Integrazione con N8N

Il widget comunica con un flusso di lavoro N8N attraverso due principali azioni:

1. **loadPreviousSession**: Carica messaggi di una sessione precedente
2. **sendMessage**: Invia un nuovo messaggio e riceve la risposta

### Configurazione del Webhook N8N

1. Crea un nuovo workflow in N8N
2. Aggiungi un nodo "Webhook" come trigger
3. Configura il webhook per gestire i due tipi di richieste:
   - `action: 'loadPreviousSession'` per caricare conversazioni passate
   - `action: 'sendMessage'` per elaborare nuovi messaggi

### Formato Risposta del Webhook

```javascript
// Esempio di risposta per sendMessage
{
  "output": "Questo è il messaggio di risposta del bot",
  "actions": [
    {
      "type": "button",
      "label": "Visita il sito",
      "action": "https://example.com"
    }
  ]
}

// Esempio di risposta per loadPreviousSession
{
  "data": [
    {
      "id": "HumanMessage_1",
      "kwargs": {
        "content": "Messaggio dell'utente"
      }
    },
    {
      "id": "AIMessage_1",
      "kwargs": {
        "content": "Risposta del bot"
      }
    }
  ]
}
```

## Gestione della Sessione

Il widget salva l'ID sessione in `localStorage` per mantenere la continuità della conversazione. Puoi disabilitare questo comportamento impostando `loadPreviousSession: false`.

## Consenso privacy

Si attiva inviando

```json
{
  "sessionId": "xxxxxx",
  "chatInput": "lorem ipsum",
  "output": "Consenso di privacy",
  "actions": [
    { "type": "privacy", "label": "Accetta la privacy", "action": "https://www.privacy.page"}
  ]
}
```

In risposta si riceve:

```json
{
    "action":"sendMessage",
    "sessionId":"xxxxxx",
    "chatInput":"lorem ipsum",
    "privacy": true|false
}
```

## API Javascript

```javascript
// Crea l'istanza del chat
const chatInstance = createChat({
  webhookUrl: 'YOUR_WEBHOOK_URL'
});

// Smonta il widget
chatInstance.unmount();
```

## Struttura del Progetto

```
├── src/
│   ├── components/       # Componenti Vue
│   ├── composables/      # Composable functions
│   ├── plugins/          # Plugin Vue
│   ├── utils/            # Utility e funzioni di supporto
│   ├── scss/             # File SCSS e variabili
│   ├── main.ts           # Entry point
│   └── types.ts          # Type definitions
├── dist/                 # Build output
├── vite.config.ts        # Configurazione Vite
└── package.json
```

## Browser Supportati

- Chrome/Edge (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)

## Licenza

MIT