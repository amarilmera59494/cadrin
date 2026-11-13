import { getCollection } from 'astro:content';
import { publishable } from '../data/publication';
export { publishable } from '../data/publication';
export const production = import.meta.env.SITE_STAGE === 'production';
export async function catalogue() {
  const watches = await getCollection('watches', ({data}) => !production || publishable(data));
  const guides = await getCollection('guides', ({data}) => !production || publishable(data));
  const selections = await getCollection('selections', ({data}) => (!production || publishable(data)) && data.watches.every(id => watches.some(w => w.id === id)));
  const finder = watches.filter(w => w.data.finder).sort((a,b) => a.data.brand.localeCompare(b.data.brand, "fr") || a.data.name.localeCompare(b.data.name, "fr"));
  guides.sort((a,b) => Number(b.id === "choisir-premiere-montre") - Number(a.id === "choisir-premiere-montre") || a.data.title.localeCompare(b.data.title, "fr"));
  const accessibleGuides = guides.filter(g => !production || !g.data.related.length || g.data.related.every(id => finder.some(w => w.id === id)));
  return { watches, guides: accessibleGuides, selections, finder };
}
export const dateLabel = (date:string) => new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date));
