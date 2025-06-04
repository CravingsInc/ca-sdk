import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

console.log( path.resolve(__dirname, '../src'))
console.log( path.resolve(__dirname, ''))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@cravingsinc/ca-sdk': path.resolve(__dirname, '../src')
    }
  },

  server: {
    watch: {
      ignored: ['!../src/**']
    }
  }
});
