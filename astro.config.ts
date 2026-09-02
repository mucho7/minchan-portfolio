import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mucho7.github.io',
  base: '/minchan-portfolio/',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), react()]
});
