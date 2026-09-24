// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import searchIndex from './src/integrations/search-index.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://improved-goggles-p39p5p9.pages.github.io',
  integrations: [mdx(), searchIndex()],
  markdown: {
    syntaxHighlight: false,
  },
  vite: {
    resolve: {
      conditions: ['development', 'import'],
    },
  },
});
