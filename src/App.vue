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

.tt-chat-app {
  width: 100%;
  height: 100%;
}
</style>