import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Auto-detect GitHub Pages base path:
// - If GITHUB_REPOSITORY is 'khalil98dev/PersonalSite', base becomes '/PersonalSite/'
// - If GITHUB_REPOSITORY is 'khalil98dev/khalil98dev.github.io', base becomes '/'
// - Or use explicit VITE_BASE_PATH if provided
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const isUserSite = repoName.toLowerCase().endsWith('.github.io');
const basePath = process.env.VITE_BASE_PATH || (repoName && !isUserSite ? `/${repoName}/` : '/');

export default defineConfig({
  base: basePath,
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
