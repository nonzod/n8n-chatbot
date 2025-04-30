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

<style lang="scss">
.tt-chat-window-wrapper {
  position: fixed;
  right: var(--tt-chat-window-right, var(--tt-chat-spacing));
  bottom: var(--tt-chat-window-bottom, var(--tt-chat-spacing));
  z-index: var(--tt-chat-window-z-index);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: calc(100% - (var(--tt-chat-window-right, var(--tt-chat-spacing))) * 1.5);
  max-height: calc(100% - (var(--tt-chat-window-bottom, var(--tt-chat-spacing))) * 1.5);

  .tt-chat-window {
    width: var(--tt-chat-window-width);
    height: var(--tt-chat-window-height);
    max-width: 100%;
    max-height: 100%;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    margin-right: var(--tt-chat-window-margin-right);
    margin-bottom: var(--tt-chat-window-margin-bottom);
    overflow: hidden;
  }
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