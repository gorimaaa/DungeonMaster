import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vitest/config.js';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  test: {
    globals: true, // Active les variables globales de Vitest (comme `describe`, `it`, etc.)
    environment: 'jsdom', // Environnement de test pour React (simule un navigateur)
  },
  server: {
    host: "0.0.0.0",  // Autorise l'accès depuis toutes les IPs
    port: 5173,  // Change si nécessaire
    strictPort: true,
    allowedHosts: ["srv-dpi-proj-dungeonmaster-test.univ-rouen.fr"] // 🔥 Ajoute ton domaine ici
  }
} as UserConfig);