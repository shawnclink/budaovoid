import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://budaovoid.is-a.dev',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
