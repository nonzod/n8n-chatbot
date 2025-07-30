<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

const emit = defineEmits<{
  (e: 'submit', value: string): void;
}>();

const props = defineProps<{
  inputType: string;
  label?: string;
}>();

const inputValue = ref<string>('');
const inputRef = ref<HTMLInputElement | null>(null);
let iti: any = null;

// Estrae il tipo HTML dall'action type (es: "input_type_email" -> "email")
const htmlInputType = computed(() => {
  if (props.inputType.startsWith('input_type_')) {
    return props.inputType.replace('input_type_', '');
  }
  return 'text'; // fallback
});

// Placeholder dinamico basato sul tipo di input
const placeholder = computed(() => {
  const placeholders: Record<string, string> = {
    email: 'Inserisci la tua email...',
    tel: 'Inserisci il tuo numero di telefono...',
    text: 'Inserisci il testo...',
    url: 'Inserisci un URL...',
    number: 'Inserisci un numero...',
  };
  return placeholders[htmlInputType.value] || 'Inserisci un valore...';
});

// Validazione base per alcuni tipi
const isValid = computed(() => {
  if (!inputValue.value.trim()) return false;
  
  switch (htmlInputType.value) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.value);
    case 'tel':
      return iti ? iti.isValidNumber() : inputValue.value.length >= 8;
    case 'url':
      try {
        new URL(inputValue.value);
        return true;
      } catch {
        return false;
      }
    case 'number':
      return !isNaN(Number(inputValue.value));
    default:
      return inputValue.value.trim().length > 0;
  }
});

function handleSubmit() {
  if (isValid.value) {
    let valueToSubmit = inputValue.value.trim();
    
    // Per i numeri di telefono, restituisci il numero in formato internazionale
    if (htmlInputType.value === 'tel' && iti) {
      try {
        valueToSubmit = iti.getNumber();
      } catch (e) {
        // Fallback al valore originale se c'è un errore
        valueToSubmit = inputValue.value.trim();
      }
    }
    
    emit('submit', valueToSubmit);
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSubmit();
  }
}

// Inizializza intl-tel-input quando il componente è montato e il tipo è 'tel'
onMounted(() => {
  if (htmlInputType.value === 'tel' && inputRef.value) {
    iti = intlTelInput(inputRef.value, {
      initialCountry: 'it',
      loadUtils: () => import("intl-tel-input/build/js/utils.js"),
      autoPlaceholder: 'aggressive',
      separateDialCode: false,
      //allowDropdown: true,
      useFullscreenPopup: true
    });
    
    // Listener per aggiornare il valore quando cambia
    inputRef.value?.addEventListener('input', () => {
      inputValue.value = inputRef.value?.value || '';
    });
    
    // Listener per quando cambia il paese
    inputRef.value?.addEventListener('countrychange', () => {
      inputValue.value = inputRef.value?.value || '';
    });
  }
});

// Pulisci intl-tel-input quando il componente viene smontato
onUnmounted(() => {
  if (iti) {
    iti.destroy();
    iti = null;
  }
});
</script>

<template>
  <div class="tt-chat-input-component">
    <div class="tt-chat-input-component-message">
      {{ label || 'Inserisci le informazioni richieste:' }}
    </div>
    
    <div class="tt-chat-input-component-field">
      <!-- Input speciale per telefono con intl-tel-input -->
      <input
        v-if="htmlInputType === 'tel'"
        ref="inputRef"
        v-model="inputValue"
        type="tel"
        @keypress="handleKeyPress"
        class="tt-chat-input-component-input"
        :class="{ 'invalid': inputValue && !isValid }"
      />
      
      <!-- Input normale per altri tipi -->
      <input
        v-else
        v-model="inputValue"
        :type="htmlInputType"
        :placeholder="placeholder"
        @keypress="handleKeyPress"
        class="tt-chat-input-component-input"
        :class="{ 'invalid': inputValue && !isValid }"
      />
    </div>
    
    <button 
      class="tt-chat-input-component-button" 
      @click="handleSubmit" 
      :disabled="!isValid"
    >
      Conferma
    </button>
  </div>
</template>

<style lang="scss">
.tt-chat-input-component {
  display: flex;
  flex-direction: column;
  padding: 15px;
  
  &-message {
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--tt-chat-primary-color);
  }
  
  &-field {
    margin-bottom: 15px;
    
    // Stili per intl-tel-input (solo per input telefono)
    :deep(.iti) {
      width: 100%;
      
      .iti__flag-container {
        border-right: 1px solid #ddd;
      }
      
      .iti__selected-flag {
        padding: 8px 12px;
        
        &:hover,
        &:focus {
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
      
      .iti__country-list {
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        
        .iti__country {
          padding: 8px 12px;
          
          &.iti__highlight {
            background-color: var(--tt-chat-primary-color);
            color: white;
          }
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }
  
  &-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;
    
    // Override per intl-tel-input
    &[type="tel"] {
      padding-left: 52px; // Spazio per la bandiera del paese
    }
    
    &:focus {
      outline: none;
      border-color: var(--tt-chat-primary-color);
      box-shadow: 0 0 0 1px var(--tt-chat-primary-color);
    }
    
    &.invalid {
      border-color: #e74c3c;
      
      &:focus {
        border-color: #e74c3c;
        box-shadow: 0 0 0 1px #e74c3c;
      }
    }
    
    &::placeholder {
      color: #999;
      font-style: italic;
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