// FILE: vite.config.ts

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SVGX',
      formats: ['es', 'umd'],
      fileName: (format) => `svgx.${format === 'es' ? 'es' : 'umd'}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: 'named',          // ← fixes default export warning
      },
    },
    sourcemap: true,
    minify: 'esbuild',             // ← replaces 'terser' (no extra install)
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
