import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// Opzione per includere Vue nel bundle (può essere controllata tramite variabile d'ambiente)
const includeVue = 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'] }),
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(__dirname, './src/scss')],
        api: "modern"
      }
    }
  },
  build: {
    assetsInlineLimit: 8192,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'SimpleChatN8N',
      fileName: (format) => (includeVue ? `tt-chat.bundle.${format}.js` : `tt-chat.${format}.js`),
    },
    rollupOptions: {
      // Decidi se includere o escludere Vue e dipendenze dal bundle
      external: includeVue ? [] : ['vue', 'vue-select'],
      output: {
        globals: includeVue ? {} : {
          vue: 'Vue',
          'vue-select': 'VueSelect',
        },
        exports: 'named',
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.error', 'console.warn', 'console.info', 'console.debug'],
      },
    },
  },
});