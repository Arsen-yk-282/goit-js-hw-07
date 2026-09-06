import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve('src/index.html'),
        timer: resolve('src/1-timer.html'),
        snackbar: resolve('src/2-snackbar.html'),
      },
    },
  },
});
