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
  <div class="simple-chat-window-wrapper">
    <transition name="simple-chat-window-transition">
      <div v-if="isOpen" class="simple-chat-window">
        <Chat />
      </div>
    </transition>
    
    <ChatToggle :isOpen="isOpen" @toggle="toggleChat" />
  </div>
</template>

<style scoped>
.simple-chat-window-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.simple-chat-window {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  overflow: hidden;
}

/* Transitions */
.simple-chat-window-transition-enter-active,
.simple-chat-window-transition-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.simple-chat-window-transition-enter-from,
.simple-chat-window-transition-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>