<script setup lang="ts">
import { computed } from 'vue';
import type { ChatMessage } from '../types';

const props = defineProps<{
  message: ChatMessage;
}>();

const classes = computed(() => {
  return {
    'simple-chat-message-from-user': props.message.sender === 'user',
    'simple-chat-message-from-bot': props.message.sender === 'bot',
  };
});

// Funzione semplice per formattare il testo con markdown di base
// In una versione più completa, si potrebbe usare una libreria markdown
function formatText(text: string): string {
  // Converti **testo** in <strong>testo</strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Converti *testo* in <em>testo</em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Converti `codice` in <code>codice</code>
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Converti URL in <a>
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );
  
  // Converti newlines in <br>
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}

const formattedText = computed(() => formatText(props.message.text));
</script>

<template>
  <div class="simple-chat-message" :class="classes">
    <div class="simple-chat-message-content" v-html="formattedText"></div>
    <div v-if="message.files && message.files.length > 0" class="simple-chat-message-files">
      <div v-for="file in message.files" :key="file.name" class="simple-chat-message-file">
        {{ file.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.simple-chat-message {
  display: block;
  position: relative;
  max-width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  word-wrap: break-word;
}

.simple-chat-message-from-user {
  background-color: var(--simple-chat-user-bg, #e0f7fa);
  color: var(--simple-chat-user-color, #000);
  margin-left: auto;
  border-bottom-right-radius: 0;
}

.simple-chat-message-from-bot {
  background-color: var(--simple-chat-bot-bg, #f5f5f5);
  color: var(--simple-chat-bot-color, #000);
  border-bottom-left-radius: 0;
}

.simple-chat-message-content {
  line-height: 1.5;
}

.simple-chat-message-files {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.simple-chat-message-file {
  font-size: 0.8em;
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>