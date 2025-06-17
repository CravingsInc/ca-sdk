import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

console.log(path.resolve(__dirname, '../src'))
console.log(path.resolve(__dirname, ''))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@cravingsinc/ca-sdk': path.resolve(__dirname, '../src')
      }
    },

    define: {
      'process.env': { ...env }
    },

    server: {
      watch: {
        ignored: ['!../src/**']
      }
    }
  }
});
