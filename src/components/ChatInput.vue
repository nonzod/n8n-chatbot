<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChat } from '../composables/useChat';
import { useOptions } from '../composables/useOptions';

const input = ref('');
const files = ref<FileList | null>(null);
const chatStore = useChat();
const options = useOptions();
const { waitingForResponse, currentSessionId, startNewSession, sendMessage } = chatStore;

const isSubmitDisabled = computed(() => {
  return input.value.trim() === '' || waitingForResponse.value;
});

const placeholder = computed(() => {
  return options.value?.placeholder || 'Type your message...';
});

const allowFileUploads = computed(() => {
  return options.value?.allowFileUploads || false;
});

async function onSubmit() {
  if (isSubmitDisabled.value) {
    return;
  }

  const messageText = input.value.trim();
  input.value = '';
  
  // Verifica se è necessario inizializzare una sessione prima di inviare un messaggio
  if (!currentSessionId.value && startNewSession) {
    try {
      console.log("Inizializzazione sessione prima di inviare il messaggio");
      await startNewSession();
    } catch (error) {
      console.error("Errore durante l'inizializzazione della sessione:", error);
    }
  }
  
  try {
    await sendMessage(messageText, Array.from(files.value || []));
    files.value = null;
  } catch (error) {
    console.error("Errore durante l'invio del messaggio:", error);
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    onSubmit();
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement;
  files.value = target.files;
}

function adjustHeight(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
}
</script>

<template>
  <div class="simple-chat-input">
    <textarea
      v-model="input"
      :placeholder="placeholder"
      @keydown="onKeydown"
      @input="adjustHeight"
      :disabled="waitingForResponse"
    ></textarea>
    
    <div class="simple-chat-input-controls">
      <input
        v-if="allowFileUploads"
        type="file"
        id="file-upload"
        @change="handleFileInput"
        :disabled="waitingForResponse"
        class="simple-chat-file-input"
      />
      <label v-if="allowFileUploads" for="file-upload" class="simple-chat-file-button">
        📎
      </label>
      
      <button 
        class="simple-chat-send-button" 
        @click="onSubmit" 
        :disabled="isSubmitDisabled"
      >
        ➤
      </button>
    </div>
    
    <div v-if="files && files.length > 0" class="simple-chat-files-preview">
      <div v-for="(file, index) in Array.from(files)" :key="index" class="simple-chat-file-preview">
        {{ file.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.simple-chat-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
}

textarea {
  resize: none;
  border: 1px solid #ddd;
  border-radius: 18px;
  padding: 10px 15px;
  min-height: 40px;
  max-height: 150px;
  overflow-y: auto;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  line-height: 1.4;
}

.simple-chat-input-controls {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.simple-chat-send-button {
  border: none;
  background: var(--simple-chat-primary-color, #2196f3);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.simple-chat-send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.simple-chat-file-input {
  display: none;
}

.simple-chat-file-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  margin-right: 8px;
}

.simple-chat-files-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.simple-chat-file-preview {
  font-size: 12px;
  padding: 3px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>