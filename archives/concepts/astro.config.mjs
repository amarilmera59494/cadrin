import {fileURLToPath} from 'node:url';
import { defineConfig } from 'astro/config';
if (process.env.PUBLIC_RELEASE === '1') throw new Error('Publication publique bloquée : choisir une direction, valider identité, droits et contenu avant de préparer une configuration publique.');
export default defineConfig({ vite: {server: {fs: {allow: [fileURLToPath(new URL('../../',import.meta.url))]}}}, output: 'static', trailingSlash: 'always', devToolbar: { enabled: false } });
