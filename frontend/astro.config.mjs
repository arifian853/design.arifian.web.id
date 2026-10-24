// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import { privatePreview } from './dev/private-preview';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwind(), privatePreview()], server: { cors: false } },
  server: { host: "127.0.0.1" }
});