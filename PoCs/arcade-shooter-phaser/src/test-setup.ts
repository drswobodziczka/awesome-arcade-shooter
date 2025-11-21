/**
 * @file test-setup.ts
 * @description Test environment setup for Phaser tests.
 * Mocks canvas and browser APIs required by Phaser.
 */

import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock HTMLCanvasElement if not available
  if (typeof HTMLCanvasElement === 'undefined') {
    global.HTMLCanvasElement = class HTMLCanvasElement {
      getContext() {
        return {
          fillStyle: '',
          fillRect: () => {},
          clearRect: () => {},
          getImageData: () => ({ data: [] }),
          putImageData: () => {},
          createImageData: () => ([]),
          setTransform: () => {},
          drawImage: () => {},
          save: () => {},
          restore: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          closePath: () => {},
          stroke: () => {},
          translate: () => {},
          scale: () => {},
          rotate: () => {},
          arc: () => {},
          fill: () => {},
          measureText: () => ({ width: 0 }),
          transform: () => {},
          rect: () => {},
          clip: () => {},
        };
      }
      toDataURL() {
        return '';
      }
    } as any;
  }

  // Mock canvas 2D context
  if (typeof CanvasRenderingContext2D === 'undefined') {
    global.CanvasRenderingContext2D = class CanvasRenderingContext2D {
      fillStyle = '';
      fillRect = () => {};
      clearRect = () => {};
      getImageData = () => ({ data: [] });
      putImageData = () => {};
      createImageData = () => [];
      setTransform = () => {};
      drawImage = () => {};
      save = () => {};
      restore = () => {};
      beginPath = () => {};
      moveTo = () => {};
      lineTo = () => {};
      closePath = () => {};
      stroke = () => {};
      translate = () => {};
      scale = () => {};
      rotate = () => {};
      arc = () => {};
      fill = () => {};
      measureText = () => ({ width: 0 });
      transform = () => {};
      rect = () => {};
      clip = () => {};
    } as any;
  }

  // Mock WebGL context
  if (typeof WebGLRenderingContext === 'undefined') {
    global.WebGLRenderingContext = class WebGLRenderingContext {} as any;
  }

  // Mock AudioContext
  if (typeof AudioContext === 'undefined') {
    global.AudioContext = class AudioContext {
      createBuffer = () => ({ getChannelData: () => new Float32Array(0) });
      createBufferSource = () => ({
        buffer: null,
        connect: () => {},
        start: () => {},
      });
      createGain = () => ({
        gain: { value: 1 },
        connect: () => {},
      });
      destination = {};
      sampleRate = 44100;
    } as any;
  }
});
