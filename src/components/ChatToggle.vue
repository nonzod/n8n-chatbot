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
import openChatIcon from '/resources/images/open_chat.svg';
import closeChatIcon from '/resources/images/close_chat.svg';

// Determina quale icona mostrare in base allo stato
const iconPath = computed(() => props.isOpen ? closeChatIcon : openChatIcon);

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
.tt-chat-tooltip {
  position: relative;
  background-color: white;
  border: 1px solid var(--tt-chat-tooltip-border-color);
  border-radius: 15px;
  padding: 10px 15px;
  max-width: 250px;
  margin: 0 5px 20px 0;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
  
  // Codina del fumetto più pronunciata e definita
  &:after {
    content: '';
    position: absolute;
    bottom: -9px;
    right: 25px;
    width: 15px;
    height: 16px;
    background-color: white;
    border-right: 1px solid var(--tt-chat-tooltip-border-color);
    border-bottom: 1px solid var(--tt-chat-tooltip-border-color);
    transform: rotate(45deg);
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
  
  // Stile per il testo nel fumetto
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1;
    color: var(--tt-chat-primary-color);
  }
  
  // Opzionale: bordo leggero ma più realistico
  &.comic-style {
    border-radius: 12px;
    border: 1px solid #000;
    background-color: #FFFDF4; // colore carta leggero
  }
  
  // Animazione più sottile
  animation: softAppear 0.2s ease-out forwards;
}

@keyframes softAppear {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.tt-chat-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50% 0 0 50%;
  background-color: var(--tt-chat-primary-color, brown);
  color: white;
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  .tt-chat-toggle-icon {
    width: 24px;
    height: 24px;
  }
}
</style>