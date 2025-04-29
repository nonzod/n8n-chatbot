<script setup lang="ts">
import { computed } from 'vue';
import Chat from './components/Chat.vue';
import ChatWindow from './components/ChatWindow.vue';
import { useOptions } from './composables/useOptions';

const options = useOptions();
const mode = computed(() => options.value?.mode || 'window');
</script>

<template>
  <div class="tt-chat-app">
    <Chat v-if="mode === 'fullscreen'" />
    <ChatWindow v-else />
  </div>
</template>

<style lang="scss">
@use './scss/styles.scss';

// Stili globali
.tt-chat-app {
  font-family: var(--tt-chat-font-family);
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>