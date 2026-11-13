import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const source = z.object({label:z.string(), url:z.url({protocol:/^https$/})});
const editorial = z.object({
  title:z.string(), description:z.string(), status:z.enum(['draft','published','archived']),
  sources:z.array(source), verifiedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  author:z.string().nullable(), reviewer:z.string().nullable(), rights:z.enum(['approved','pending']),
});
const guide = defineCollection({ loader: glob({pattern:'*.md',base:'./src/content/guide'}), schema:z.object({title:z.string(),short:z.string(),order:z.number()}) });
const guides = defineCollection({loader:glob({pattern:'*.md',base:'./src/content/guides'}),schema:editorial.extend({image:z.enum(['sleeve','wrist','leather']).nullable(),related:z.array(z.string()).default([])})});
const selections = defineCollection({loader:glob({pattern:'*.md',base:'./src/content/selections'}),schema:editorial.extend({watches:z.array(z.string()).min(3).max(6)})});
const watches = defineCollection({loader:glob({pattern:'*.md',base:'./src/content/watches'}),schema:editorial.extend({
  brand:z.string(), name:z.string(), reference:z.string(), size:z.number().positive().nullable(), sizeLabel:z.string(),
  movement:z.enum(['Automatique','Quartz','Solaire']), use:z.enum(['quotidien','bureau','week-end']),
  finder:z.object({bracelet:z.enum(["Acier","Cuir","Résine"]),display:z.enum(["Aiguilles","Numérique"]),category:z.enum(["Homme","Femme"]).optional()}).optional(),
  material:z.string(), note:z.string(), limit:z.string(), image:z.string().nullable(),
  priceCheckedAt:z.iso.date().optional(),price:z.number().positive().nullable(), stock:z.string().nullable(), facts:z.array(z.object({label:z.string(),value:z.string()})),
})});
export const collections = {guide,guides,selections,watches};
