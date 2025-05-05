[![Banner image](https://raw.githubusercontent.com/nonzod/n8n-chatbot/main/resources/tourtools.png)](https://www.tourtools.it)

# TT Chat N8N

[![npm version](https://img.shields.io/npm/v/tt-chat-n8n.svg)](https://www.npmjs.com/package/tt-chat-n8n)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A customizable Vue.js chat widget for integrating n8n-powered chatbots into any website.

<div align="center">
  <img src="https://raw.githubusercontent.com/nonzod/n8n-chatbot/main/resources/screenshot.png" alt="TT Chat N8N Preview" width="400">
</div>

## Features

- 🚀 **Easy Integration**: Simple API to add a chat widget to any website
- 🎨 **Highly Customizable**: Extensive theming and configuration options
- 🔄 **Session Management**: Automatic conversation history persistence
- 📱 **Responsive Design**: Works on both desktop and mobile devices
- 💬 **Markdown Support**: Rich text formatting in bot responses
- 🔘 **Interactive Actions**: Support for buttons and privacy consent workflows
- 📎 **File Uploads**: Optional file attachment capability
- 🌐 **Internationalization**: Customizable text for multilingual support

## Installation

```bash
npm install tt-chat-n8n
```

Or using yarn:

```bash
yarn add tt-chat-n8n
```

## Quick Start

### ES Module Import

```javascript
import { createChat } from 'tt-chat-n8n';
import 'tt-chat-n8n/style.css';

createChat({
  webhookUrl: 'YOUR_N8N_WEBHOOK_URL',
  title: 'Chat Support',
  subtitle: 'How can we help you today?'
});
```

### Script Tag (UMD)

```html
<link href="https://unpkg.com/tt-chat-n8n/dist/style.css" rel="stylesheet">
<script src="https://unpkg.com/tt-chat-n8n/dist/tt-chat.umd.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    TTChatN8N.createChat({
      webhookUrl: 'YOUR_N8N_WEBHOOK_URL'
    });
  });
</script>
```

## Configuration Options

```javascript
createChat({
  // Required: n8n webhook URL
  webhookUrl: 'https://n8n.example.com/webhook/your-id',
  
  // HTTP request configuration
  webhookConfig: {
    method: 'POST', // 'GET' or 'POST'
    headers: {} // Custom HTTP headers
  },
  
  // DOM target element or selector
  target: '#tt-chat-n8n',
  
  // Display mode
  mode: 'window', // 'window' (popup) or 'fullscreen'
  
  // Initial welcome messages
  initialMessages: [
    'Hello! 👋',
    'How can I help you today?'
  ],
  
  // Request parameter key names
  chatInputKey: 'chatInput', // Parameter name for input text
  chatSessionKey: 'sessionId', // Parameter name for session ID
  
  // Session management
  loadPreviousSession: true, // Load previous conversation
  
  // File upload feature
  allowFileUploads: false, // Enable file uploads
  
  // UI text customization
  title: 'Chat',
  subtitle: 'How can I help you?',
  placeholder: 'Type your message...',
  
  // Tooltip customization
  showTooltip: true,
  tooltipText: "Try our chatbot",
  
  // Theme customization
  theme: {
    primaryColor: '#044273',
    backgroundColor: '#ffffff',
    userMessageColor: '#e0f7fa',
    botMessageColor: '#f5f5f5',
    userTextColor: '#000000',
    botTextColor: '#000000',
    headerColor: '#044273',
    headerTextColor: '#ffffff'
  },
  
  // Icon customization (SVG as base64 strings)
  icons: {
    openChat: 'data:image/svg+xml;base64,...', // Icon for opening chat
    closeChat: 'data:image/svg+xml;base64,...', // Icon for closing chat
    send: 'data:image/svg+xml;base64,...', // Send button icon
    headerLogo: 'data:image/svg+xml;base64,...' // Header logo
  }
});
```

## Icon Customization

You can customize all SVG icons used in the chat interface by providing base64-encoded SVG strings:

```javascript
createChat({
  webhookUrl: 'YOUR_N8N_WEBHOOK_URL',
  icons: {
    openChat: 'data:image/svg+xml;base64,PHN2ZyB3...', // Base64 encoded SVG
    closeChat: 'data:image/svg+xml;base64,PHN2ZyB3...', // Base64 encoded SVG
    send: 'data:image/svg+xml;base64,PHN2ZyB3...', // Base64 encoded SVG
    headerLogo: 'data:image/svg+xml;base64,PHN2ZyB3...' // Base64 encoded SVG
  }
});
```

To convert your SVG to base64, use an online converter or the following Node.js script:

```javascript
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'your-icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');
const base64 = Buffer.from(svgContent).toString('base64');

console.log(`data:image/svg+xml;base64,${base64}`);
```

## n8n Integration

The widget communicates with an n8n workflow through two main actions:

### 1. Load Previous Session

When the widget initializes, it attempts to load previous conversation history:

**Request:**
```json
{
  "action": "loadPreviousSession",
  "sessionId": "unique-session-id"
}
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "HumanMessage_1",
      "kwargs": {
        "content": "User message"
      }
    },
    {
      "id": "AIMessage_1",
      "kwargs": {
        "content": "Bot response"
      }
    }
  ]
}
```

### 2. Send Message

When a user sends a message:

**Request:**
```json
{
  "action": "sendMessage",
  "sessionId": "unique-session-id",
  "chatInput": "User message text"
}
```

**Expected Response:**
```json
{
  "output": "Bot response message",
  "actions": [
    {
      "type": "button",
      "label": "Visit Website",
      "action": "https://example.com"
    }
  ]
}
```

## Interactive Elements

The chat supports several types of interactive elements that can be included in bot responses:

### Buttons

```json
{
  "output": "Would you like to visit our website?",
  "actions": [
    {
      "type": "button",
      "label": "Visit Website",
      "action": "https://example.com"
    }
  ]
}
```

### Privacy Consent

To trigger a privacy consent form:

```json
{
  "output": "Before we continue, we need your consent.",
  "actions": [
    {
      "type": "privacy",
      "label": "Accept Privacy Policy",
      "action": "https://example.com/privacy"
    }
  ]
}
```

The user's response will be sent back with a `privacy` field:

```json
{
  "action": "sendMessage",
  "sessionId": "unique-session-id",
  "chatInput": "",
  "privacy": true
}
```

## JavaScript API

```javascript
// Create chat instance
const chatInstance = createChat({
  webhookUrl: 'YOUR_WEBHOOK_URL'
});

// Remove the widget
chatInstance.unmount();
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Development

```bash
# Clone repository
git clone https://github.com/nonzod/n8n-chatbot.git
cd tt-chat-n8n

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://mit-license.org/)