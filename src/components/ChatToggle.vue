<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOptions } from '../composables/useOptions';

const options = useOptions();

// Nuovo stato per tenere traccia se il tooltip è stato chiuso
const tooltipClosed = ref(false);

const tooltip = computed(() => ({
  // Mostra il tooltip solo se non è stato chiuso e se l'opzione showTooltip è true
  show: options.value?.showTooltip && !tooltipClosed.value,
  text: options.value?.tooltipText || "Chiedi consiglio al nostro chatbot"
}));

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

// Calcola i percorsi delle immagini SVG
const openChatIconPath = computed(() => 'resources/images/open_chat.svg');
const closeChatIconPath = computed(() => 'resources/images/close_chat.svg');

// Determina quale icona mostrare in base allo stato
const iconPath = computed(() => props.isOpen ? closeChatIconPath.value : openChatIconPath.value);

function toggleChat() {
  emit('toggle');
  // Imposta tooltipClosed a true quando il toggle viene cliccato
  tooltipClosed.value = true;
}
</script>

<template>
  <div class="tt-chat-tooltip" v-if="tooltip.show">
    <p>{{ tooltip.text }} </p>
  </div>
  <div class="tt-chat-toggle" @click="toggleChat">
    <img :src="iconPath" alt="Toggle chat" class="tt-chat-toggle-icon" />
  </div>
</template>

<style lang="scss">
.tt-chat-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--tt-chat-primary-color, brown);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.tt-chat-toggle:hover {
  transform: scale(1.05);
}

.tt-chat-toggle-icon {
  width: 24px;
  height: 24px;
}
</style>