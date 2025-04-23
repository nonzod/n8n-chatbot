<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChat } from '../composables/useChat';
import { useOptions } from '../composables/useOptions';
import ButtonSend from './ButtonSend.vue';

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
  <div class="tt-chat-input">
    <textarea v-model="input" :placeholder="placeholder" @keydown="onKeydown" @input="adjustHeight"
      :disabled="waitingForResponse"></textarea>

    <div class="tt-chat-input-controls">
      <input v-if="allowFileUploads" type="file" id="file-upload" @change="handleFileInput"
        :disabled="waitingForResponse" class="tt-chat-file-input" />
      <label v-if="allowFileUploads" for="file-upload" class="tt-chat-file-button">
        📎
      </label>

      <ButtonSend @click="onSubmit" :disabled="isSubmitDisabled" />
    </div>

    <div v-if="files && files.length > 0" class="tt-chat-files-preview">
      <div v-for="(file, index) in Array.from(files)" :key="index" class="tt-chat-file-preview">
        {{ file.name }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tt-chat-input {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0;


  textarea {
    resize: none;
    border: none;
    padding: 10px 15px;
    min-height: 40px;
    max-height: 150px;
    overflow-y: auto;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    line-height: 1.4;
    flex: 1;
  }

  .tt-chat-input-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
  }

}
</style>