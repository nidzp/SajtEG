const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  server: {
    host: true
  },
  preview: {
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        intro: resolve(__dirname, 'intro.html'),
        main: resolve(__dirname, 'index.html'),
        kontakt: resolve(__dirname, 'kontakt.html')
      }
    }
  }
});
