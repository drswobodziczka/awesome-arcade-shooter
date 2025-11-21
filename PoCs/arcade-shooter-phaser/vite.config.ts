import { defineConfig } from 'vite';

export default defineConfig({
  base: '/awesome-arcade-shooter/',
  test: {
    globals: true,
    environment: 'happy-dom', // DOM environment for Phaser tests
    setupFiles: ['./src/test-setup.ts'], // Mock canvas/WebGL for Phaser
  },
});
