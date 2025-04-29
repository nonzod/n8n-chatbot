<script setup lang="ts">
import { computed } from 'vue';
import { useOptions } from '../composables/useOptions';

// Import delle icone di default
import defaultOpenChatIcon from '/resources/images/open_chat.svg';
import defaultCloseChatIcon from '/resources/images/close_chat.svg';
import defaultSendIcon from '/resources/images/send.svg';
import defaultHeaderLogoIcon from '/resources/images/header_logo.svg';

const options = useOptions();

// Tipi di icone supportate
type IconType = 'openChat' | 'closeChat' | 'send' | 'headerLogo';

const props = defineProps<{
  name: IconType;
  alt?: string;
  className?: string;
}>();

// Mappa delle icone di default
const defaultIcons: Record<IconType, string> = {
  openChat: defaultOpenChatIcon,
  closeChat: defaultCloseChatIcon,
  send: defaultSendIcon,
  headerLogo: defaultHeaderLogoIcon
};

// Restituisce l'icona corretta in base al nome e alle opzioni configurate
const iconSrc = computed(() => {
  // Usa l'icona personalizzata se disponibile, altrimenti usa quella di default
  return options.value?.icons?.[props.name] || defaultIcons[props.name];
});

// Alt text predefinito per ogni tipo di icona
const defaultAltTexts: Record<IconType, string> = {
  openChat: 'Apri chat',
  closeChat: 'Chiudi chat',
  send: 'Invia messaggio',
  headerLogo: 'Logo'
};

// Usa l'alt text specificato o quello predefinito
const altText = computed(() => props.alt || defaultAltTexts[props.name]);
</script>

<template>
  <img :src="iconSrc" :alt="altText" :class="className" />
</template>