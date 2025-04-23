import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'] }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SimpleChatN8N',
      fileName: (format) => `simple-chat.${format}.js`,
    },
    rollupOptions: {
      // Assicurati che le dipendenze esterne non siano incluse nel bundle
      external: ['vue'],
      output: {
        // Fornisci le variabili globali per le dipendenze esterne
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
});