import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [
      vue(),
      dts({ include: ['src'] }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };

  // Configurazione specifica per la build della libreria
  if (command === 'build') {
    return {
      ...config,
      build: {
        lib: {
          entry: resolve(__dirname, 'src/main.ts'),
          name: 'SimpleChatN8N',
          fileName: (format) => `tt-chat.${format}.js`,
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
    };
  }

  // Configurazione per lo sviluppo
  return {
    ...config,
    optimizeDeps: {
      // Include le dipendenze da pre-bundlare
      include: ['vue'],
    },
  };
});