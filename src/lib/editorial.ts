import { getCollection } from 'astro:content';
import { publishable } from '../data/publication';
export { publishable } from '../data/publication';
export const production = import.meta.env.SITE_STAGE === 'production';
export async function catalogue() {
  const watches = await getCollection('watches', ({data}) => !production || publishable(data));
  const guides = await getCollection('guides', ({data}) => !production || publishable(data));
  const selections = await getCollection('selections', ({data}) => (!production || publishable(data)) && data.watches.every(id => watches.some(w => w.id === id)));
  const finder = watches.filter(w => w.data.finder).sort((a,b) => a.data.brand.localeCompare(b.data.brand, "fr") || a.data.name.localeCompare(b.data.name, "fr"));
  const guideOrder=['choisir-premiere-montre','montres-par-budget','automatique-quartz-solaire','choisir-taille-montre','offrir-une-montre','bambino-tsuyosa-seiko-5','citizen-eco-drive-ou-tsuyosa','acheter-montre-en-ligne'];
  const position=(id:string)=>guideOrder.includes(id)?guideOrder.indexOf(id):guideOrder.length;
  guides.sort((a,b) => position(a.id)-position(b.id) || a.data.title.localeCompare(b.data.title,'fr'));
  const accessibleGuides = guides.filter(g => !production || !g.data.related.length || g.data.related.every(id => finder.some(w => w.id === id)));
  return { watches, guides: accessibleGuides, selections, finder };
}
export const dateLabel = (date:string,locale:'fr'|'en'='fr') => new Intl.DateTimeFormat(locale==='en'?'en-GB':'fr-FR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date));
