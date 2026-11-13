import { defineConfig } from 'astro/config';
const stage = process.env.SITE_STAGE ?? 'preview';
if (!['preview', 'production'].includes(stage)) throw new Error('SITE_STAGE doit être preview ou production.');
export default defineConfig({
  site: 'https://cadrin.fr', output: 'static', trailingSlash: 'always',
  outDir: stage === 'production' ? './dist-production' : './dist',
  devToolbar: { enabled: false },
  vite: { define: { 'import.meta.env.SITE_STAGE': JSON.stringify(stage) } },
});
