<script setup lang="ts">
import { ref } from 'vue';
import Chat from './Chat.vue';

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
    
    <div class="simple-chat-toggle" @click="toggleChat">
      <transition name="simple-chat-toggle-transition" mode="out-in">
        <div v-if="!isOpen" class="simple-chat-toggle-icon">💬</div>
        <div v-else class="simple-chat-toggle-icon">✕</div>
      </transition>
    </div>
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
  font-size: 20px;
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

.simple-chat-toggle-transition-enter-active,
.simple-chat-toggle-transition-leave-active {
  transition: opacity 0.2s;
}

.simple-chat-toggle-transition-enter-from,
.simple-chat-toggle-transition-leave-to {
  opacity: 0;
}
</style>