<script setup lang="ts">
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const emit = defineEmits<{
  (e: 'select', date: string): void;
}>();

const props = defineProps<{
  label?: string;
}>();

const selectedDate = ref<Date | null>(null);

function handleConfirm() {
  if (selectedDate.value) {
    // Formatta la data come DD/MM/YYYY
    const formattedDate = selectedDate.value.toLocaleDateString('it-IT');
    emit('select', formattedDate);
  }
}
</script>

<template>
  <div class="tt-chat-datepicker">
    <div class="tt-chat-datepicker-message">
      {{ label || 'Seleziona una data:' }}
    </div>
    
    <div class="tt-chat-datepicker-input">
      <VueDatePicker
        v-model="selectedDate"
        :locale="'it'"
        :format="'dd/MM/yyyy'"
        :enable-time-picker="false"
        :auto-apply="false"
        :clearable="false"
        placeholder="Seleziona una data..."
        :year-range="[1920, new Date().getFullYear()]"
        class="tt-chat-datepicker-field"
      />
    </div>
    
    <button 
      class="tt-chat-datepicker-button" 
      @click="handleConfirm" 
      :disabled="!selectedDate"
    >
      Conferma data
    </button>
  </div>
</template>

<style lang="scss">
.tt-chat-datepicker {
  display: flex;
  flex-direction: column;
  padding: 15px;
  
  &-message {
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--tt-chat-primary-color);
  }
  
  &-input {
    margin-bottom: 15px;
  }
  
  &-field {
    // Override degli stili del datepicker per mantenere coerenza con il tema
    :deep(.dp__input) {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 14px;
      width: 100%;
      
      &:focus {
        outline: none;
        border-color: var(--tt-chat-primary-color);
        box-shadow: 0 0 0 1px var(--tt-chat-primary-color);
      }
    }
    
    :deep(.dp__input_wrap) {
      width: 100%;
    }
    
    :deep(.dp__menu) {
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      font-size: 14px;
    }
    
    :deep(.dp__active_date) {
      background-color: var(--tt-chat-primary-color);
      color: white;
    }
    
    :deep(.dp__today) {
      border: 1px solid var(--tt-chat-primary-color);
    }
    
    :deep(.dp__button) {
      background-color: var(--tt-chat-primary-color);
      
      &:hover {
        background-color: var(--tt-chat-primary-color);
        opacity: 0.9;
      }
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