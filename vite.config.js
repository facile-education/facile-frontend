import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dynamicImport from 'vite-plugin-dynamic-import'
import vitePluginRequire from 'vite-plugin-require'

const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    port: 8080
  },
  plugins: [
    vue(),
    vitePluginRequire({
      // @fileRegex RegExp
      // optional：default file processing rules are as follows
      // fileRegex:/(.jsx?|.tsx?|.vue)$/

      // Conversion mode. The default mode is import
      // importMetaUrl | import
      // importMetaUrl see https://vitejs.cn/guide/assets.html#new-url-url-import-meta-url
      // translateType: "importMetaUrl" | "import";
    }),
    VueI18nPlugin({
      compositionOnly: false,
      include: [path.resolve(__dirname, './src/locales/**')]
    }),
    legacy({
      targets: ['defaults', 'not IE 11', 'Firefox 52', 'iOS >= 12']
    }),
    /* For dynamic imports (ex. router) */
    dynamicImport()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@router': path.resolve(__dirname, './src/router'),
      '@views': path.resolve(__dirname, './src/router/views'),
      '@layouts': path.resolve(__dirname, './src/router/layouts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@design': path.resolve(__dirname, './src/design/index.scss'),
      '@modules': path.resolve(__dirname, './node_modules')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
})
