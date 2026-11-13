import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const guide = defineCollection({ loader: glob({pattern: '*.md', base: './src/content/guide'}), schema: z.object({ title: z.string(), short: z.string(), order: z.number() }) });
export const collections = { guide };
