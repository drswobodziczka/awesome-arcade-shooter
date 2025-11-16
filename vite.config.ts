import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'PoCs/arcade-shooter',
  base: '/awesome-arcade-shooter/',
  build: {
    outDir: '../../dist',
    emptyOutDir: true
  },
  test: {
    globals: true,
  },
});
