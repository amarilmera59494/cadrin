// Fiches modèle générées depuis le catalogue (/montre/<slug>/).
// Tout le texte est déduit des champs de la fiche marchande : aucune note, aucun avis, aucun essai.
import type {CatalogueProduct} from './tempus-catalogue.ts';
import {merchantLinkAvailable,normalise,sizeNumber,waterMark} from './tempus-catalogue.ts';

export const ficheBase = '/montre/';
const slugify = (s: string) => normalise(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Une page existe pour chaque montre commandable dont le lien marchand fonctionne.
export function ficheEligible(p: CatalogueProduct) {
  return p.orderable && merchantLinkAvailable(p) && !!p.image;
}
// « Documentée » : diamètre, verre et étanchéité connus. Seules ces montres entrent dans les sélections et les alternatives.
export function ficheDocumented(p: CatalogueProduct) {
  return ficheEligible(p) && p.price >= 50 && !!p.movement && sizeNumber(p.caseSize) !== null && waterMark(p.water) !== null && !!p.glass;
}

export function ficheSlug(p: Pick<CatalogueProduct, 'brand' | 'title' | 'reference'>) {
  const title = slugify(p.title), brand = slugify(p.brand), ref = slugify(p.reference);
  const base = title.includes(brand) ? title : `${brand}-${title}`;
  return base.includes(ref) || base.includes(ref.replace(/[0-9]{2}[a-z]$/, '')) ? base : `${base}-${ref}`;
}

export const ficheBaseEn = '/en/watch/';
export function ficheHref(p: CatalogueProduct, en = false) { return ficheEligible(p) ? `${en ? ficheBaseEn : ficheBase}${ficheSlug(p)}/` : null; }

export const glassKind = (g = '') => { const s = normalise(g); return s.includes('saphir') ? 'saphir' : s.includes('resine') ? 'resine' : s.includes('acryl') || s.includes('plexi') || s.includes('hesalite') ? 'acrylique' : 'mineral'; };
const glassLabel: Record<string, string> = {saphir: 'verre saphir', mineral: 'verre minéral', acrylique: 'verre acrylique', resine: 'verre en résine'};
// Étanchéité en bar : marquage bar/ATM, ou mètres convertis (10 m ≈ 1 bar) quand la fiche ne donne que des mètres.
export function waterBar(p: CatalogueProduct) { const w = waterMark(p.water); if (w !== null) return w; const m = (p.water || '').match(/^(\d+)\s*(?:m|mètres|metres)\b/i); return m ? Number(m[1]) / 10 : null; }
const movementPhrase = (m = '') => ({Automatique: 'automatique', Quartz: 'à quartz', Solaire: 'solaire', Manuel: 'mécanique à remontage manuel', 'Connectée': 'connectée'} as Record<string, string>)[m] ?? '';
export const strapKind = (s = '') => { const n = normalise(s); return /cuir|veau|bovin|alligator/.test(n) ? 'cuir' : /acier|metal|titane|milanais|maille/.test(n) ? 'metal' : /resine|caoutchouc|silicone|nylon|tissu|nato/.test(n) ? 'souple' : ''; };
const mm = (n: number) => `${String(n).replace('.', ',')} mm`;
const lower = (s = '') => /^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);

// Une phrase de synthèse, factuelle, limitée à ce que la fiche indique.
export function ficheSummary(p: CatalogueProduct) {
  const size = sizeNumber(p.caseSize), water = waterMark(p.water), metres = water === null ? waterBar(p) : null;
  const parts: string[] = [];
  const cat = p.category === 'Homme' ? ' homme' : p.category === 'Femme' ? ' femme' : '', mv = movementPhrase(p.movement);
  parts.push(`Montre${cat}${mv ? ' ' + mv : ''}${size !== null ? ` de ${mm(size)}` : ''}`);
  if (p.glass) parts.push(glassLabel[glassKind(p.glass)]);
  if (water !== null) parts.push(`étanche à ${water} bar`); else if (metres !== null) parts.push(`étanche à ${Math.round(metres * 10)} m`);
  if (p.strap) parts.push(`bracelet ${lower(p.strap)}`);
  return parts.join(', ') + '.';
}

export type Check = {title: string; text: string; guide?: {label: string; url: string}};

// « À vérifier avant d'acheter » : règles fixes, reprises de nos guides ; une donnée absente devient un point à demander.
export function ficheChecks(p: CatalogueProduct): Check[] {
  const out: Check[] = [], size = sizeNumber(p.caseSize), water = waterBar(p), thick = sizeNumber(p.thickness);
  const inMetres = waterMark(p.water) === null && water !== null;
  const waterGuide = {label: 'Le guide de l’étanchéité', url: '/guides/etancheite-montre-3-5-10-20-atm/'};
  if (water === null) { /* donnée absente : signalée dans la fiche technique */ }
  else if (inMetres && water <= 3) out.push({title: `${p.water} : pas de baignade`, text: 'Indiqué en mètres par le vendeur, soit environ 3 bar : pluie et éclaboussures, pas de piscine.', guide: waterGuide});
  else if (inMetres) out.push({title: `${p.water} : environ ${water} bar`, text: 'Le vendeur l’indique en mètres. C’est une pression d’essai, pas une profondeur : lisez la notice avant de nager.', guide: waterGuide});
  else if (water <= 3) out.push({title: `${water} bar : pas de baignade`, text: 'Pluie, éclaboussures et lavage des mains. Retirez-la avant la piscine ou la mer.', guide: waterGuide});
  else if (water < 10) out.push({title: `${water} bar : la nage ordinaire, selon la notice`, text: 'Pas de plongée, pas de douche chaude ni de sauna. La notice de la référence reste la règle.', guide: waterGuide});
  else if (water < 20) out.push({title: `${water} bar : natation possible`, text: 'Selon la notice. Évitez la douche chaude et ne touchez pas la couronne sous l’eau.', guide: waterGuide});
  else out.push({title: `${water} bar : natation et masque-tuba`, text: 'Selon la notice. Pour la plongée avec bouteilles, il faut une montre de plongée certifiée, ce que ce chiffre seul ne garantit pas.', guide: {label: 'Montre de plongée et norme ISO 6425', url: '/guides/montre-de-plongee-iso-6425/'}});
  const moveGuide = {label: 'Automatique, quartz ou solaire', url: '/guides/automatique-quartz-solaire/'};
  if (p.movement === 'Automatique') out.push({title: 'Automatique : elle s’arrête au repos', text: 'Sans être portée, elle s’arrête une fois sa réserve de marche épuisée (durée indiquée par le fabricant) et doit être remise à l’heure. Moins précise qu’un quartz.', guide: {label: 'Réserve de marche et remontage', url: '/guides/montre-automatique-reserve-de-marche/'}});
  else if (p.movement === 'Quartz') out.push({title: 'Quartz : une pile à changer', text: 'Rien à régler au quotidien. Faites contrôler l’étanchéité quand la pile est remplacée.', guide: moveGuide});
  else if (p.movement === 'Solaire') out.push({title: 'Solaire : elle vit de la lumière', text: 'Pas de pile à changer, mais rangez-la à la lumière plutôt que dans une boîte fermée.', guide: moveGuide});
  else if (/manuel/i.test(p.movement || '')) out.push({title: 'Remontage manuel', text: 'Elle se remonte en tournant la couronne, idéalement chaque jour : un petit rituel à aimer.', guide: moveGuide});
  const glassGuide = {label: 'Saphir, minéral ou acrylique', url: '/guides/verre-saphir-mineral-acrylique/'};
  if (p.glass) { const g = glassKind(p.glass);
    out.push(g === 'saphir' ? {title: 'Verre saphir', text: 'Très résistant aux rayures, mais il peut se fendre sur un choc sec.', guide: glassGuide}
      : g === 'acrylique' ? {title: 'Verre acrylique', text: 'Il se raye plus facilement, mais une rayure légère se polit avec une pâte.', guide: glassGuide}
      : g === 'resine' ? {title: 'Verre en résine', text: 'Un verre en plastique, léger et résistant aux chocs, mais qui se raye facilement.', guide: glassGuide}
      : {title: 'Verre minéral', text: 'Plus sensible aux rayures qu’un saphir ; une rayure profonde ne part plus.', guide: glassGuide}); }
  const sizeGuide = {label: 'Choisir la taille de sa montre', url: '/guides/choisir-taille-montre/'};
  if (size === null) { /* format non chiffré : la fiche technique reprend la mention du vendeur */ }
  else if (size >= 43) out.push({title: `${mm(size)} : un grand boîtier`, text: 'Imposant sur un poignet fin. Comparez avec une montre que vous portez déjà, en regardant aussi le corne à corne.', guide: sizeGuide});
  else if (size <= 36) out.push({title: `${mm(size)} : un format discret`, text: 'Idéal sur un poignet fin ou pour une allure vintage. Sur un poignet large, elle peut paraître petite.', guide: sizeGuide});
  else out.push({title: `${mm(size)} : un format courant`, text: 'Le diamètre ne suffit pas : regardez aussi l’épaisseur et la longueur de corne à corne.', guide: sizeGuide});
  if (thick !== null && thick >= 13) out.push({title: `${mm(thick)} d’épaisseur`, text: 'Elle passe difficilement sous une manche de chemise ajustée.'});
  const s = strapKind(p.strap);
  if (s === 'cuir') out.push({title: 'Bracelet cuir', text: 'Il se règle sans outil, mais n’aime ni l’eau ni la transpiration intense.'});
  else if (s === 'metal') out.push({title: 'Bracelet métal', text: 'Prévoyez l’ajustement à votre poignet, souvent en retirant des maillons chez un horloger.'});
  return out;
}

// Trois alternatives documentées : même mouvement, prix proche, d'autres marques en priorité.
export function ficheAlternatives(p: CatalogueProduct, all: CatalogueProduct[], n = 3) {
  const pool = all.filter(x => x.id !== p.id && x.reference !== p.reference && ficheDocumented(x) && x.movement === p.movement && Math.abs(x.price - p.price) <= p.price * 0.35);
  pool.sort((a, b) => Number(b.brand !== p.brand) - Number(a.brand !== p.brand) || Number(!!b.bestseller) - Number(!!a.bestseller) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price));
  const picked: CatalogueProduct[] = [], brands = new Set<string>();
  for (const x of pool) { if (picked.length >= n) break; if (!brands.has(x.brand)) { picked.push(x); brands.add(x.brand); } }
  for (const x of pool) { if (picked.length >= n) break; if (!picked.includes(x)) picked.push(x); }
  const cheaper = all.filter(x => ficheDocumented(x) && x.movement === p.movement && x.price < p.price * 0.75 && !picked.includes(x) && x.id !== p.id)
    .sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller) || b.price - a.price)[0];
  return {similar: picked, cheaper};
}

export function ficheTitle(p: CatalogueProduct) { return p.title.includes(p.reference) ? p.title : `${p.title} ${p.reference}`; }
