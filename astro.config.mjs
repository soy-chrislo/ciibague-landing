// @ts-check

import node from '@astrojs/node';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://main.contactoinmobiliarioibague.com',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
});
