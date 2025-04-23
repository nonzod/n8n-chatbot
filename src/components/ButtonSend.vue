<script setup lang="ts">
defineProps<{
  disabled: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button class="tt-chat-send-button" @click="$emit('click')" :disabled="disabled">
    <img :src="'resources/images/send.svg'" alt="Send message" class="tt-chat-send-button" />
  </button>
</template>

<style lang="scss">
.tt-chat-send-button {
  background-color: transparent;
  color: var(--tt-chat-primary-color);
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: transparent;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>