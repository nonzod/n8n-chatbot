<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import { useChat } from '../composables/useChat';
import { useOptions } from '../composables/useOptions';

const chatBodyRef = ref<HTMLElement | null>(null);
const chatStore = useChat();
const options = useOptions();
const { messages, currentSessionId, waitingForResponse } = chatStore;

// Computed properties per gli elementi UI
const title = computed(() => options.value?.title || 'Chat');
const subtitle = computed(() => options.value?.subtitle || 'How can I help you today?');

// Funzione per scorrere in fondo alla chat
function scrollToBottom() {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
    }
  });
}

// Osservatore per scorrere in fondo quando arrivano nuovi messaggi
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// Inizializzazione della chat
onMounted(async () => {
  try {
    console.log("Chat component mounted, initializing...");
    // Se c'è una sessione precedente, caricala
    if (options.value?.loadPreviousSession !== false && chatStore.loadPreviousSession) {
      console.log("Attempting to load previous session...");
      await chatStore.loadPreviousSession();
      console.log("Session loaded:", currentSessionId.value, "Messages:", messages.value.length);
    } 
    // Se non è possibile caricare una sessione precedente, avvia una nuova sessione
    else if (chatStore.startNewSession) {
      console.log("Starting new session...");
      await chatStore.startNewSession();
      console.log("New session started:", currentSessionId.value);
    }

    // Nel caso in cui non sia stato ancora impostato l'ID di sessione, forzane la creazione
    if (!currentSessionId.value && chatStore.startNewSession) {
      console.log("Forcing new session creation...");
      await chatStore.startNewSession();
      console.log("Forced session:", currentSessionId.value);
    }
    
    // Scorri in fondo alla chat dopo l'inizializzazione
    scrollToBottom();
  } catch (error) {
    console.error('Error initializing chat:', error);
    // In caso di errore, tenta di iniziare una nuova sessione
    if (chatStore.startNewSession) {
      await chatStore.startNewSession();
    }
  }
});
</script>

<template>
  <div class="tt-chat">
    <div class="tt-chat-header">
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
    </div>
    
    <div ref="chatBodyRef" class="tt-chat-body">
      <div v-if="messages.length === 0" class="tt-chat-empty">
        <p>Start a conversation!</p>
      </div>
      
      <template v-else>
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        
        <!-- Indicatore di digitazione -->
        <div v-if="waitingForResponse" class="tt-chat-typing">
          <div class="tt-chat-typing-dot"></div>
          <div class="tt-chat-typing-dot"></div>
          <div class="tt-chat-typing-dot"></div>
        </div>
      </template>
    </div>
    
    <div class="tt-chat-footer">
      <!-- L'input è sempre visibile -->
      <ChatInput />
    </div>
  </div>
</template>

<style>
.tt-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--tt-chat-bg, #fff);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

.tt-chat-header {
  padding: 15px;
  background-color: var(--tt-chat-header-bg, #f5f5f5);
  border-bottom: 1px solid #e0e0e0;
}

.tt-chat-header h2 {
  margin: 0 0 5px 0;
  font-size: 1.2em;
  font-weight: 600;
  color: var(--tt-chat-header-color, #333);
}

.tt-chat-header p {
  margin: 0;
  font-size: 0.9em;
  color: var(--tt-chat-subheader-color, #666);
}

.tt-chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.tt-chat-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic;
}

.tt-chat-footer {
  border-top: 1px solid #e0e0e0;
}

.tt-chat-typing {
  display: flex;
  padding: 10px;
  max-width: 60px;
  background-color: var(--tt-chat-bot-bg, #f5f5f5);
  border-radius: 10px;
  margin-bottom: 10px;
  align-self: flex-start;
}

.tt-chat-typing-dot {
  width: 8px;
  height: 8px;
  background: #888;
  border-radius: 50%;
  margin: 0 3px;
  animation: tt-chat-typing 1s infinite;
}

.tt-chat-typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.tt-chat-typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes tt-chat-typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>