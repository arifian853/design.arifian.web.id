// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    plugins: [tailwind()],
    server: {
      cors: false,
      fs: {
        strict: true,
        deny: ['**/.env*', '**/private/**', '**/.agents/**', '**/.git/**', '**/ImplementationPlan.md', '**/ImplementationStatus.md', '**/ProjectTimeline.md'],
      },
    },
  },
  server: { host: '127.0.0.1' },
});
