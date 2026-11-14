import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const guideLoader=glob({pattern:'*.md',base:'./src/content/guides'});
// The rendered Markdown contains live snapshot data. Invalidate it when an example,
// product, affiliate destination or renderer changes, even if its prose is unchanged.
const illustratedGuides: ReturnType<typeof glob>={...guideLoader,async load(context){
 const dependencies=['src/data/tempus-catalogue.json','src/data/paused-tempus-destinations.json','src/data/guide-examples.json','src/data/affiliation.ts','src/lib/i18n.ts','src/lib/tempus-catalogue.ts','scripts/remark-guide-examples.mjs'];
 const contents=await Promise.all(dependencies.map(file=>readFile(new URL(file,context.config.root))));
 const fingerprint=createHash('sha256');for(const content of contents)fingerprint.update(content);
 const digest=fingerprint.digest('hex');
 return guideLoader.load({...context,generateDigest:data=>context.generateDigest({data,illustrations:digest})});
}};
const source = z.object({label:z.string(), url:z.url({protocol:/^https$/})});
const editorial = z.object({
  title:z.string(), description:z.string(), status:z.enum(['draft','published','archived']),
  sources:z.array(source), verifiedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  author:z.string().nullable(), reviewer:z.string().nullable(), rights:z.enum(['approved','pending']),
});
const guide = defineCollection({ loader: glob({pattern:'*.md',base:'./src/content/guide'}), schema:z.object({title:z.string(),short:z.string(),order:z.number()}) });
const guides = defineCollection({loader:illustratedGuides,schema:editorial.extend({image:z.enum(['sleeve','wrist','leather']).nullable(),related:z.array(z.string()).default([])})});
const selections = defineCollection({loader:glob({pattern:'*.md',base:'./src/content/selections'}),schema:editorial.extend({watches:z.array(z.string()).min(3).max(6)})});
const watches = defineCollection({loader:glob({pattern:'*.md',base:'./src/content/watches'}),schema:editorial.extend({
  brand:z.string(), name:z.string(), reference:z.string(), size:z.number().positive().nullable(), sizeLabel:z.string(),
  movement:z.enum(['Automatique','Quartz','Solaire']), use:z.enum(['quotidien','bureau','week-end']),
  finder:z.object({bracelet:z.enum(["Acier","Cuir","Résine"]),display:z.enum(["Aiguilles","Numérique"]),category:z.enum(["Homme","Femme"]).optional()}).optional(),
  material:z.string(), note:z.string(), limit:z.string(), image:z.string().nullable(),
  priceCheckedAt:z.iso.date().optional(),price:z.number().positive().nullable(), stock:z.string().nullable(), facts:z.array(z.object({label:z.string(),value:z.string()})),
})});
export const collections = {guide,guides,selections,watches};
