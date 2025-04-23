<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import { useChat } from '../composables/useChat';
import { useOptions } from '../composables/useOptions';

const chatBodyRef = ref<HTMLElement | null>(null);
const chatStore = useChat();
const options = useOptions();
const { messages, currentSessionId, waitingForResponse } = chatStore;

// Computed properties per gli elementi UI
const title = computed(() => options.value.title || 'Chat');
const subtitle = computed(() => options.value.subtitle || 'How can I help you today?');

// Funzione per scorrere in fondo alla chat
function scrollToBottom() {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
    }
  });
}

// Inizializzazione della chat
onMounted(async () => {
  // Se c'è una sessione precedente, caricala
  if (options.value.loadPreviousSession !== false && chatStore.loadPreviousSession) {
    await chatStore.loadPreviousSession();
  } 
  // Altrimenti, inizia una nuova sessione
  else if (chatStore.startNewSession) {
    await chatStore.startNewSession();
  }
  
  scrollToBottom();
  
  // Osservatore per scorrere in fondo quando arrivano nuovi messaggi
  const observer = new MutationObserver(scrollToBottom);
  if (chatBodyRef.value) {
    observer.observe(chatBodyRef.value, {
      childList: true,
      subtree: true
    });
  }
});
</script>

<template>
  <div class="simple-chat">
    <div class="simple-chat-header">
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>
    
    <div ref="chatBodyRef" class="simple-chat-body">
      <div v-if="messages.length === 0" class="simple-chat-empty">
        <p>Start a conversation!</p>
      </div>
      
      <template v-else>
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        
        <!-- Indicatore di digitazione -->
        <div v-if="waitingForResponse" class="simple-chat-typing">
          <div class="simple-chat-typing-dot"></div>
          <div class="simple-chat-typing-dot"></div>
          <div class="simple-chat-typing-dot"></div>
        </div>
      </template>
    </div>
    
    <div class="simple-chat-footer">
      <ChatInput v-if="currentSessionId" />
    </div>
  </div>
</template>

<style>
.simple-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--simple-chat-bg, #fff);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

.simple-chat-header {
  padding: 15px;
  background-color: var(--simple-chat-header-bg, #f5f5f5);
  border-bottom: 1px solid #e0e0e0;
}

.simple-chat-header h2 {
  margin: 0 0 5px 0;
  font-size: 1.2em;
  font-weight: 600;
  color: var(--simple-chat-header-color, #333);
}

.simple-chat-header p {
  margin: 0;
  font-size: 0.9em;
  color: var(--simple-chat-subheader-color, #666);
}

.simple-chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.simple-chat-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic;
}

.simple-chat-footer {
  border-top: 1px solid #e0e0e0;
}

.simple-chat-typing {
  display: flex;
  padding: 10px;
  max-width: 60px;
  background-color: var(--simple-chat-bot-bg, #f5f5f5);
  border-radius: 10px;
  margin-bottom: 10px;
  align-self: flex-start;
}

.simple-chat-typing-dot {
  width: 8px;
  height: 8px;
  background: #888;
  border-radius: 50%;
  margin: 0 3px;
  animation: simple-chat-typing 1s infinite;
}

.simple-chat-typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.simple-chat-typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes simple-chat-typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>