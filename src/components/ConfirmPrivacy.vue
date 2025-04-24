<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'confirm', privacy: boolean): void;
}>();

const props = defineProps<{
  privacyUrl?: string;
}>();

const selectedOption = ref<string>('');

function handleConfirm() {
  emit('confirm', selectedOption.value === 'accept');
}
</script>

<template>
  <div class="tt-chat-privacy">
    <div class="tt-chat-privacy-message">
      Per continuare la conversazione, è necessario accettare la privacy policy.
      <a v-if="privacyUrl" :href="privacyUrl" target="_blank" rel="noopener">Leggi la privacy policy</a>
    </div>
    
    <div class="tt-chat-privacy-options">
      <div class="tt-chat-privacy-option">
        <input 
          type="radio" 
          id="privacy-accept" 
          value="accept" 
          v-model="selectedOption"
          name="privacy-choice"
        >
        <label for="privacy-accept">Accetta</label>
      </div>
      
      <div class="tt-chat-privacy-option">
        <input 
          type="radio" 
          id="privacy-refuse" 
          value="refuse" 
          v-model="selectedOption"
          name="privacy-choice"
        >
        <label for="privacy-refuse">Rifiuta</label>
      </div>
    </div>
    
    <button 
      class="tt-chat-privacy-button" 
      @click="handleConfirm" 
      :disabled="!selectedOption"
    >
      Conferma scelta
    </button>
  </div>
</template>

<style lang="scss">
.tt-chat-privacy {
  display: flex;
  flex-direction: column;
  padding: 15px;
  
  &-message {
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.5;
    
    a {
      display: block;
      margin-top: 5px;
      color: var(--tt-chat-primary-color);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  &-options {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  &-option {
    display: flex;
    align-items: center;
    gap: 5px;
    
    input {
      margin: 0;
    }
    
    label {
      font-size: 14px;
      cursor: pointer;
    }
  }
  
  &-button {
    align-self: flex-start;
    background-color: var(--tt-chat-primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>