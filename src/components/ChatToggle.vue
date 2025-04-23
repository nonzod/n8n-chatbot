<script setup lang="ts">
import { computed } from 'vue';

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
}
</script>

<template>
  <div class="simple-chat-toggle" @click="toggleChat">
    <img :src="iconPath" alt="Toggle chat" class="simple-chat-toggle-icon" />
  </div>
</template>

<style scoped>
.simple-chat-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--simple-chat-primary-color, #2196f3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.simple-chat-toggle:hover {
  transform: scale(1.05);
}

.simple-chat-toggle-icon {
  width: 24px;
  height: 24px;
  filter: invert(1); /* Per rendere l'icona bianca se è nera nell'SVG */
}
</style>