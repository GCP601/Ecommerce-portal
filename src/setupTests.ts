// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock do global.fetch
global.fetch = jest.fn() as jest.Mock;

// Mock para imagens
Object.defineProperty(global, 'Image', {
  writable: true,
  value: class MockImage {
    constructor() {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 100);
    }
  }
});