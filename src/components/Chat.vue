<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import ChatMessage from './ChatMessage.vue';
import IconLoader from './IconLoader.vue';
import ChatInput from './input/ChatInput.vue';
import ConfirmPrivacy from './input/ConfirmPrivacy.vue';
import SelectProvince from './input/SelectProvince.vue';
import Datepicker from './input/Datepicker.vue';
import SpecialInput from './input/SpecialInput.vue';
import { useChat } from '../composables/useChat';
import { useOptions } from '../composables/useOptions';
import type { ChatAction, ChatMessage as ChatMessageType } from '../types';

const chatBodyRef = ref<HTMLElement | null>(null);
const chatStore = useChat();
const options = useOptions();
const { messages, currentSessionId, waitingForResponse, sendMessage, startNewSession } = chatStore;

// Stato per controllare la visualizzazione del form privacy
const showPrivacyForm = ref(false);
const currentPrivacyAction = ref<ChatAction | null>(null);

// Stato per controllare la visualizzazione del form provincia
const showProvinceForm = ref(false);
const currentProvinceAction = ref<ChatAction | null>(null);

// Stato per controllare la visualizzazione del datepicker
const showDatePicker = ref(false);
const currentDatePickerAction = ref<ChatAction | null>(null);

// Stato per controllare la visualizzazione dell'input component
const showInputComponent = ref(false);
const currentInputAction = ref<ChatAction | null>(null);

const lastProcessedMessageId = ref<string | null>(null);
// Stato per memorizzare il valore callback
const currentCallbackValue = ref<string | null>(null);

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

// Funzione per gestire l'invio di un messaggio standard
async function handleSendMessage(text: string, files: File[] = []) {
  if (!currentSessionId.value && startNewSession) {
    try {
      await startNewSession();
    } catch (error) {
      console.error("startNewSession():", error);
    }
  }
  
  try {
    await sendMessage(text, files);
  } catch (error) {
    console.error("sendMessage():", error);
  }
}

// Funzione per controllare un messaggio per azioni speciali (privacy, provincia, datepicker e input)
function checkMessageForSpecialActions(message: ChatMessageType): void {
  // Se il messaggio è già stato processato, esci
  if (message.id === lastProcessedMessageId.value) {
    return;
  }
  
  // Se il messaggio contiene azioni, verifica se c'è un'azione speciale
  if (message?.actions && Array.isArray(message.actions)) {
    // Controlla prima le azioni di privacy
    const privacyAction = message.actions.find(
      action => action && action.type === 'privacy'
    );
    
    if (privacyAction) {
      currentPrivacyAction.value = privacyAction;
      showPrivacyForm.value = true;
      lastProcessedMessageId.value = message.id;
      return;
    }
    
    // Controlla le azioni di selezione provincia
    const provinceAction = message.actions.find(
      action => action && action.type === 'select_province'
    );
    
    if (provinceAction) {
      currentProvinceAction.value = provinceAction;
      showProvinceForm.value = true;
      lastProcessedMessageId.value = message.id;
      return;
    }
    
    // Controlla le azioni del datepicker
    const datePickerAction = message.actions.find(
      action => action && action.type === 'datepicker'
    );
    
    if (datePickerAction) {
      currentDatePickerAction.value = datePickerAction;
      showDatePicker.value = true;
      lastProcessedMessageId.value = message.id;
      return;
    }
    
    // Controlla le azioni di input (iniziano con "input_type_")
    const inputAction = message.actions.find(
      action => action && action.type.startsWith('input_type_')
    );
    
    if (inputAction) {
      currentInputAction.value = inputAction;
      showInputComponent.value = true;
      lastProcessedMessageId.value = message.id;
      return;
    }
  }
}

// Funzione per gestire la conferma di privacy
async function handlePrivacyConfirm(privacyAccepted: boolean) {
  console.log("Privacy:", privacyAccepted);
  
  if (!currentSessionId.value && startNewSession) {
    try {
      await startNewSession();
    } catch (error) {
      console.error("startNewSession()", error);
    }
  }
  
  try {
    // Invia la risposta di privacy con un messaggio vuoto
    await sendMessage('', [], privacyAccepted);
    // Nascondi il form di privacy
    showPrivacyForm.value = false;
    currentPrivacyAction.value = null;
  } catch (error) {
    console.error("sendMessage():", error);
  }
}

// Funzione per gestire la selezione della provincia
async function handleProvinceSelect(province: string) {
  console.log("Provincia selezionata:", province);
  
  if (!currentSessionId.value && startNewSession) {
    try {
      await startNewSession();
    } catch (error) {
      console.error("startNewSession()", error);
    }
  }
  
  try {
    // Invia la provincia selezionata come messaggio
    await sendMessage(province, []);
    // Nascondi il form di selezione provincia
    showProvinceForm.value = false;
    currentProvinceAction.value = null;
  } catch (error) {
    console.error("sendMessage():", error);
  }
}

// Funzione per gestire la selezione della data
async function handleDateSelect(date: string) {
  console.log("Data selezionata:", date);
  
  if (!currentSessionId.value && startNewSession) {
    try {
      await startNewSession();
    } catch (error) {
      console.error("startNewSession()", error);
    }
  }
  
  try {
    // Invia la data selezionata come messaggio
    await sendMessage(date, []);
    // Nascondi il datepicker
    showDatePicker.value = false;
    currentDatePickerAction.value = null;
  } catch (error) {
    console.error("sendMessage():", error);
  }
}

// Funzione per gestire il submit dell'input component
async function handleInputSubmit(value: string) {
  console.log("Input inviato:", value);
  
  if (!currentSessionId.value && startNewSession) {
    try {
      await startNewSession();
    } catch (error) {
      console.error("startNewSession()", error);
    }
  }
  
  try {
    // Invia il valore dell'input come messaggio
    await sendMessage(value, []);
    // Nascondi l'input component
    showInputComponent.value = false;
    currentInputAction.value = null;
  } catch (error) {
    console.error("sendMessage():", error);
  }
}

// Controlla i nuovi messaggi per le azioni speciali
watch(messages, (newMessages) => {
  scrollToBottom();
  
  // Se ci sono messaggi
  if (newMessages.length > 0) {
    // Controlla l'ultimo messaggio
    const latestMessage = newMessages[newMessages.length - 1];
    checkMessageForSpecialActions(latestMessage);
  }
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
    if (!currentSessionId.value && startNewSession) {
      console.log("Forcing new session creation...");
      await startNewSession();
      console.log("Forced session:", currentSessionId.value);
    }
    
    // Controlla tutti i messaggi esistenti per azioni speciali
    if (messages.value.length > 0) {
      // Controlla solo l'ultimo messaggio per semplicità
      const latestMessage = messages.value[messages.value.length - 1];
      checkMessageForSpecialActions(latestMessage);
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
      <IconLoader name="headerLogo" className="tt-chat-header-logo" />
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
      <!-- Form di privacy quando richiesto -->
      <div v-if="showPrivacyForm" class="tt-chat-privacy-container">
        <ConfirmPrivacy 
          :privacyUrl="currentPrivacyAction?.action"
          @confirm="handlePrivacyConfirm"
        />
      </div>
      
      <!-- Form di selezione provincia quando richiesto -->
      <div v-else-if="showProvinceForm" class="tt-chat-province-container">
        <SelectProvince 
          @select="handleProvinceSelect"
        />
      </div>
      
      <!-- Datepicker quando richiesto -->
      <div v-else-if="showDatePicker" class="tt-chat-datepicker-container">
        <Datepicker 
          :label="currentDatePickerAction?.label"
          @select="handleDateSelect"
        />
      </div>
      
      <!-- Input component quando richiesto -->
      <div v-else-if="showInputComponent" class="tt-chat-input-component-container">
        <SpecialInput 
          :inputType="currentInputAction?.type || 'input_type_text'"
          :label="currentInputAction?.label"
          @submit="handleInputSubmit"
        />
      </div>
      
      <!-- Form standard in tutti gli altri casi -->
      <div v-else class="tt-chat-input-container">
        <ChatInput @send="handleSendMessage" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tt-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--tt-chat-bg, #fff);
  font-family: var(--tt-chat-font-family);
  z-index: 99;
  
  &-header {
    position: relative;
    padding: 15px;
    background-color: var(--tt-chat-header-bg, #f5f5f5);
    border-bottom: 1px solid var(--tt-chat-light-shade-100);
    
    h2 {
      margin: 0 0 5px 0;
      font-size: 26px;
      line-height: 31px;
      font-weight: 600;
      color: var(--tt-chat-header-color, #333);
      position: relative;
      z-index: 1;
    }
    
    p {
      margin: 0 0 10px 0;
      font-size: 18px;
      line-height: 22px;      
      color: var(--tt-chat-subheader-color, #666);
      position: relative;
      z-index: 1;
    }

    &-logo {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  
  &-body {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
  }
  
  &-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #888;
    font-style: italic;
  }
  
  &-footer {
    border-top: 1px solid var(--tt-chat-light-shade-100);
  }
  
  &-typing {
    display: flex;
    padding: 10px;
    max-width: 60px;
    background-color: var(--tt-chat-bot-bg, #f5f5f5);
    border-radius: 10px;
    margin-bottom: 10px;
    align-self: flex-start;
    
    &-dot {
      width: 8px;
      height: 8px;
      background: #888;
      border-radius: 50%;
      margin: 0 3px;
      animation: tt-chat-typing 1s infinite;
      
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
  
  &-privacy-container,
  &-province-container,
  &-datepicker-container,
  &-input-component-container {
    width: 100%;
  }
  
  &-input-container {
    width: 100%;
  }
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