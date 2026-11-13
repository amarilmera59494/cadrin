export type Locale = 'fr' | 'en';
export const localeOf = (path:string):Locale => path === '/en' || path.startsWith('/en/') ? 'en' : 'fr';
export const routePairs:Record<string,string> = {
  '/':'/en/', '/trouver-ma-montre/':'/en/watch-finder/',
  '/contact/':'/en/contact/', '/mentions-legales/':'/en/legal-notice/', '/confidentialite/':'/en/privacy/',
  '/selections/':'/en/selections/', '/guides/':'/en/guides/', '/notre-methode/':'/en/our-method/',
  '/selections/trois-montres-au-quotidien/':'/en/selections/three-everyday-watches/',
  '/guides/choisir-premiere-montre/':'/en/guides/choosing-your-first-watch/',
  '/guides/montres-par-budget/':'/en/guides/watches-by-budget/',
  '/guides/offrir-une-montre/':'/en/guides/giving-a-watch/',
  '/guides/bambino-tsuyosa-seiko-5/':'/en/guides/bambino-tsuyosa-seiko-5/',
  '/guides/citizen-eco-drive-ou-tsuyosa/':'/en/guides/citizen-eco-drive-or-tsuyosa/',
  '/guides/choisir-taille-montre/':'/en/guides/watch-size-and-fit/',
  '/guides/acheter-montre-en-ligne/':'/en/guides/buying-a-watch-online/',
  '/guides/automatique-quartz-solaire/':'/en/guides/automatic-quartz-or-solar/',
  ...Object.fromEntries(['casio-f91w','citizen-aw0102-13ae','citizen-aw1231','citizen-rainell-em1201-52l','citizen-tsuyosa-nj0150-81e','orient-bambino-ra-ac0m04y','seiko-srpe55','seiko-srpe55k1'].map(id=>[`/montres/${id}/`,`/en/watches/${id}/`])),
};
export function localPath(path:string, locale:Locale):string {
  const u=new URL(path,'https://cadrin.fr');
  const fr=Object.entries(routePairs).find(([,en])=>en===u.pathname)?.[0] || u.pathname;
  return (locale==='en' ? routePairs[fr] || '/en/' : fr)+u.search+u.hash;
}
export const textFor=(locale:Locale)=>(fr:string,en:string)=>locale==='en'?en:fr;
const terms:Record<string,string>={
  Automatique:'Automatic',Solaire:'Solar',Quartz:'Quartz',Acier:'Steel',Cuir:'Leather','Résine':'Resin',Aiguilles:'Analogue','Numérique':'Digital',Femme:'Women',Homme:'Men',
  'À confirmer':'To be confirmed',Diamètre:'Diameter',Largeur:'Width',Épaisseur:'Thickness',Mouvement:'Movement',Calibre:'Calibre',Calendrier:'Calendar',Boîtier:'Case',Bracelet:'Strap / bracelet',Verre:'Crystal',Cadran:'Dial',
  'Corne à corne':'Lug to lug','Longueur du boîtier':'Case length','Réserve annoncée':'Stated power reserve','Boîtier / verre':'Case / crystal','Boîtier / bracelet':'Case / bracelet','Poids annoncé':'Stated weight','Référence marchand':'Retailer reference',Affichage:'Display',Dimensions:'Dimensions',
  'Quartz à pile':'Battery-powered quartz','Numérique LCD':'Digital LCD','À confirmer auprès du marchand':'Confirm with the retailer','Quartz solaire Eco-Drive':'Eco-Drive solar quartz','Eco-Drive solaire':'Solar Eco-Drive','Eco-Drive · quartz solaire':'Eco-Drive · solar quartz','Jour et date':'Day and date','Acier inoxydable':'Stainless steel',Saphir:'Sapphire',
  '8210 · automatique':'8210 · automatic','F6724 · automatique, remontage manuel':'F6724 · automatic with hand winding','4R36 · automatique à remontage manuel':'4R36 · automatic with hand winding','Environ 41 heures':'Approximately 41 hours','Acier inoxydable / Hardlex':'Stainless steel / Hardlex','Acier inoxydable / acier inoxydable':'Stainless steel / stainless steel',Beige:'Beige',
};
export function term(value:string,locale:Locale):string {return locale==='fr'?value:terms[value] || value.replace(/Largeur /g,'Width ').replace(/(\d),(\d)/g,'$1.$2');}
