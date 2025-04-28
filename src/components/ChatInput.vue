<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useOptions } from '../composables/useOptions';
import { useChat } from '../composables/useChat';
import ButtonSend from './ButtonSend.vue';

const input = ref('');
const files = ref<FileList | null>(null);
const options = useOptions();
const { waitingForResponse } = useChat();
const textareaRef = ref<HTMLTextAreaElement | null>(null); // Ref per il riferimento diretto alla textarea

const emit = defineEmits<{
  (e: 'send', text: string, files: File[]): void;
}>();

const isSubmitDisabled = computed(() => {
  return input.value.trim() === '' || waitingForResponse.value;
});

const placeholder = computed(() => {
  return options.value?.placeholder || 'Type your message...';
});

const allowFileUploads = computed(() => {
  return options.value?.allowFileUploads || false;
});

function onSubmit() {
  if (isSubmitDisabled.value) {
    return;
  }

  const messageText = input.value.trim();
  emit('send', messageText, Array.from(files.value || []));
  
  // Resetta l'input
  input.value = '';
  files.value = null;
  
  // Utilizziamo nextTick per assicurarci che il DOM sia aggiornato prima di impostare il focus
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
      textareaRef.value.style.height = 'auto';
    }
  });
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
    <textarea 
      ref="textareaRef"
      v-model="input" 
      :placeholder="placeholder" 
      @keydown="onKeydown" 
      @input="adjustHeight"
    ></textarea>

    <div class="tt-chat-input-controls">
      <input 
        v-if="allowFileUploads" 
        type="file" 
        id="file-upload" 
        @change="handleFileInput"
        :disabled="waitingForResponse" 
        class="tt-chat-file-input" 
      />
      <label 
        v-if="allowFileUploads" 
        for="file-upload" 
        class="tt-chat-file-button"
      >
        📎
      </label>

      <ButtonSend @click="onSubmit" :disabled="isSubmitDisabled" />
    </div>

    <div v-if="files && files.length > 0" class="tt-chat-files-preview">
      <div 
        v-for="(file, index) in Array.from(files)" 
        :key="index" 
        class="tt-chat-file-preview"
      >
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
  position: relative;

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

.tt-chat-file-input {
  display: none;
}

.tt-chat-file-button {
  cursor: pointer;
  margin-right: 10px;
  font-size: 16px;
}

.tt-chat-files-preview {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px 15px;
  background-color: rgba(0, 0, 0, 0.02);
}

.tt-chat-file-preview {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>