import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env files from both client and server directories
  const serverEnv = loadEnv(mode, path.resolve(__dirname, '../server'), '');
  const clientEnv = loadEnv(mode, process.cwd(), '');

  // Strip NODE_ENV from loaded env objects to prevent Vite warnings
  delete serverEnv.NODE_ENV;
  delete clientEnv.NODE_ENV;

  const googleClientId = clientEnv.VITE_GOOGLE_CLIENT_ID || serverEnv.VITE_GOOGLE_CLIENT_ID || serverEnv.GOOGLE_CLIENT_ID || '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(googleClientId)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
                return 'vendor-core';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-animation';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor-others';
            }
          }
        }
      },
      chunkSizeWarningLimit: 800
    }
  };
});
