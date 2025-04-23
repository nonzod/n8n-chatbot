<script setup lang="ts">
import { computed } from 'vue';
import type { ChatMessage, ChatAction } from '../types';

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

// Verifica se ci sono azioni associate al messaggio
const hasActions = computed(() => {
  return !!props.message.actions && props.message.actions.length > 0;
});

// Gestisce il click su un pulsante
function handleButtonClick(url: string) {
  window.open(url, '_blank', 'noopener');
}
</script>

<template>
  <div class="simple-chat-message" :class="classes">
    <div class="simple-chat-message-content" v-html="formattedText"></div>
    
    <!-- Render delle azioni se presenti -->
    <div v-if="hasActions" class="simple-chat-message-actions">
      <template v-for="(action, index) in message.actions" :key="index">
        <!-- Button -->
        <button 
          v-if="action.type === 'button'" 
          class="simple-chat-action-button"
          @click="handleButtonClick(action.action)"
        >
          {{ action.label }}
        </button>
        
        <!-- Checkbox -->
        <div v-else-if="action.type === 'checkbox'" class="simple-chat-action-checkbox">
          <input type="checkbox" :id="'action-checkbox-' + index">
          <label :for="'action-checkbox-' + index">
            {{ action.label }}
            <a v-if="action.action" :href="action.action" target="_blank" rel="noopener">Dettagli</a>
          </label>
        </div>
      </template>
    </div>
    
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

/* Stili per le azioni */
.simple-chat-message-actions {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.simple-chat-action-button {
  background-color: var(--simple-chat-primary-color, #2196f3);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  text-align: center;
  align-self: flex-start;
}

.simple-chat-action-button:hover {
  background-color: var(--simple-chat-primary-color-hover, #1976d2);
}

.simple-chat-action-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.simple-chat-action-checkbox input[type="checkbox"] {
  margin-top: 3px;
}

.simple-chat-action-checkbox label {
  font-size: 14px;
  line-height: 1.4;
}

.simple-chat-action-checkbox a {
  margin-left: 5px;
  color: var(--simple-chat-primary-color, #2196f3);
  text-decoration: none;
}

.simple-chat-action-checkbox a:hover {
  text-decoration: underline;
}
</style>