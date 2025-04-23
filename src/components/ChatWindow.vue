<script setup lang="ts">
import { ref } from 'vue';
import Chat from './Chat.vue';
import ChatToggle from './ChatToggle.vue';

const isOpen = ref(false);

function toggleChat() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="tt-chat-window-wrapper">
    <transition name="tt-chat-window-transition">
      <div v-if="isOpen" class="tt-chat-window">
        <Chat />
      </div>
    </transition>
    
    <ChatToggle :isOpen="isOpen" @toggle="toggleChat" />
  </div>
</template>

<style scoped>
.tt-chat-window-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.tt-chat-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  overflow: hidden;
}

/* Transitions */
.tt-chat-window-transition-enter-active,
.tt-chat-window-transition-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.tt-chat-window-transition-enter-from,
.tt-chat-window-transition-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>