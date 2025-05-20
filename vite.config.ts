import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@cravingsinc/ca-sdk': path.resolve(__dirname, './src')
    }
  },
  root: 'example',
});
