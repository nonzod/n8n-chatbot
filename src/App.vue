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

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

.tt-chat-app {
  width: 100%;
  height: 100%;
}
</style>