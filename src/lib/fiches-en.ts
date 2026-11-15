// English versions of the generated watch pages (/en/watch/<slug>/). Build-time only: the spec dictionary is never sent to the browser.
// Same rules as the French pages: every sentence comes from the retailer listing, with no score, review or hands-on test.
import type {CatalogueProduct} from './tempus-catalogue';
import {sizeNumber,waterMark} from './tempus-catalogue';
import {glassKind,strapKind,waterBar,type Check} from './fiches';
import dictionary from '../data/spec-terms-en.json';

const terms = dictionary as Record<string, string>;
// Retailer values without a dictionary entry are mostly numbers and calibre names: normalise decimals and units only.
export function specEn(value = ''): string {
  return terms[value] ?? value.replace(/(\d),(\d)/g, '$1.$2').replace(/\bmètres\b/g, 'metres').replace(/(\d)\s?mm\b/g, '$1 mm').replace(/(\d)\s?x\s?(\d)/g, '$1 × $2');
}
export const categoryEn = (c = '') => ({Homme: 'Men', Femme: 'Women'} as Record<string, string>)[c] ?? c;
export const movementEn = (m = '') => ({Automatique: 'Automatic', Quartz: 'Quartz', Solaire: 'Solar', Manuel: 'Hand-wound', 'Connectée': 'Connected'} as Record<string, string>)[m] ?? m;
const movementPhrase = (m = '') => ({Automatique: 'automatic', Quartz: 'quartz', Solaire: 'solar', Manuel: 'hand-wound mechanical', 'Connectée': 'connected'} as Record<string, string>)[m] ?? '';
const glassLabel: Record<string, string> = {saphir: 'sapphire crystal', mineral: 'mineral crystal', acrylique: 'acrylic crystal', resine: 'resin crystal'};
const mm = (n: number) => `${n} mm`;
const lower = (s = '') => /^[A-Z]{2}|^[A-Z][a-z]*[A-Z]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);

export function ficheSummaryEn(p: CatalogueProduct) {
  const size = sizeNumber(p.caseSize), water = waterMark(p.water), metres = water === null ? waterBar(p) : null;
  const cat = p.category === 'Homme' ? "men's " : p.category === 'Femme' ? "women's " : '', mv = movementPhrase(p.movement);
  const head = `${size !== null ? `A ${mm(size)} ` : 'A '}${cat}${mv ? mv + ' ' : ''}watch`;
  const parts = [size === null && /^A [aeiou]/i.test(head) ? head.replace(/^A /, 'An ') : head];
  if (p.glass) parts.push(glassLabel[glassKind(p.glass)]);
  if (water !== null) parts.push(`water-resistant to ${water} bar`); else if (metres !== null) parts.push(`water-resistant to ${Math.round(metres * 10)} m`);
  if (p.strap) { const v = lower(specEn(p.strap)); parts.push(/\b(strap|bracelet)\b/i.test(v) ? v : `${v} ${strapKind(p.strap) === 'metal' ? 'bracelet' : 'strap'}`); }
  return parts.join(', ') + '.';
}

const guides = {
  water: {label: 'Water resistance explained', url: '/en/guides/watch-water-resistance-3-5-10-20-atm/'},
  diver: {label: "Divers' watches and ISO 6425", url: '/en/guides/divers-watches-iso-6425/'},
  movement: {label: 'Automatic, quartz or solar', url: '/en/guides/automatic-quartz-or-solar/'},
  reserve: {label: 'Power reserve and winding', url: '/en/guides/automatic-watch-power-reserve/'},
  glass: {label: 'Sapphire, mineral or acrylic', url: '/en/guides/sapphire-mineral-or-acrylic-crystal/'},
  size: {label: 'Watch size and fit', url: '/en/guides/watch-size-and-fit/'},
};

// "Check before buying": the same fixed rules as the French pages, drawn from our guides.
export function ficheChecksEn(p: CatalogueProduct): Check[] {
  const out: Check[] = [], size = sizeNumber(p.caseSize), water = waterBar(p), thick = sizeNumber(p.thickness);
  const inMetres = waterMark(p.water) === null && water !== null, stated = specEn(p.water);
  if (water === null) { /* missing: flagged in the specification table */ }
  else if (inMetres && water <= 3) out.push({title: `${stated}: not for swimming`, text: 'The retailer states it in metres, roughly 3 bar: rain and splashes, not the pool.', guide: guides.water});
  else if (inMetres) out.push({title: `${stated}: about ${water} bar`, text: 'The retailer states it in metres. It is a test pressure, not a depth: read the manual before swimming.', guide: guides.water});
  else if (water <= 3) out.push({title: `${water} bar: not for swimming`, text: 'Rain, splashes and hand washing. Take it off before the pool or the sea.', guide: guides.water});
  else if (water < 10) out.push({title: `${water} bar: light swimming, per the manual`, text: 'No diving, hot showers or sauna. The manual for this reference has the final word.', guide: guides.water});
  else if (water < 20) out.push({title: `${water} bar: swimming possible`, text: 'Per the manual. Avoid hot showers and never operate the crown under water.', guide: guides.water});
  else out.push({title: `${water} bar: swimming and snorkelling`, text: 'Per the manual. Scuba diving calls for a certified divers’ watch, which this figure alone does not guarantee.', guide: guides.diver});
  if (p.movement === 'Automatique') out.push({title: 'Automatic: it stops when left unworn', text: 'Once its power reserve runs out (the duration is set by the manufacturer), it stops and must be reset. Less accurate than quartz.', guide: guides.reserve});
  else if (p.movement === 'Quartz') out.push({title: 'Quartz: a battery to replace', text: 'Nothing to adjust day to day. Have the water resistance checked when the battery is changed.', guide: guides.movement});
  else if (p.movement === 'Solaire') out.push({title: 'Solar: it runs on light', text: 'No battery to change, but store it in the light rather than in a closed box.', guide: guides.movement});
  else if (/manuel/i.test(p.movement || '')) out.push({title: 'Hand winding', text: 'You wind it by turning the crown, ideally every day: a small ritual to enjoy.', guide: guides.movement});
  if (p.glass) { const g = glassKind(p.glass);
    out.push(g === 'saphir' ? {title: 'Sapphire crystal', text: 'Highly scratch-resistant, but it can crack from a sharp knock.', guide: guides.glass}
      : g === 'acrylique' ? {title: 'Acrylic crystal', text: 'It scratches more easily, but light scratches polish out with paste.', guide: guides.glass}
      : g === 'resine' ? {title: 'Resin crystal', text: 'A light, impact-resistant plastic crystal that scratches easily.', guide: guides.glass}
      : {title: 'Mineral crystal', text: 'More prone to scratches than sapphire; a deep scratch will not come out.', guide: guides.glass}); }
  if (size === null) { /* size not stated as a number: the table repeats the retailer wording */ }
  else if (size >= 43) out.push({title: `${mm(size)}: a large case`, text: 'Imposing on a slim wrist. Compare it with a watch you already wear, including the lug-to-lug length.', guide: guides.size});
  else if (size <= 36) out.push({title: `${mm(size)}: a discreet size`, text: 'Ideal for a slim wrist or a vintage look. On a broad wrist it can look small.', guide: guides.size});
  else out.push({title: `${mm(size)}: a common size`, text: 'Diameter is not enough: check the thickness and the lug-to-lug length too.', guide: guides.size});
  if (thick !== null && thick >= 13) out.push({title: `${mm(thick)} thick`, text: 'It will struggle to slide under a fitted shirt cuff.'});
  const s = strapKind(p.strap);
  if (s === 'cuir') out.push({title: 'Leather strap', text: 'It adjusts without tools, but dislikes water and heavy perspiration.'});
  else if (s === 'metal') out.push({title: 'Metal bracelet', text: 'Plan to size it to your wrist, usually by having a watchmaker remove links.'});
  return out;
}

export function detailRowsEn(p: CatalogueProduct): [string, string][] {
  return ([['Dial', p.dial], ['Case size', p.caseSize], ['Thickness', p.thickness], ['Case material', p.caseMaterial], ['Strap / bracelet', p.strap], ['Crystal', p.glass], ['Calibre', p.calibre], ['Functions', p.functions], ['Water resistance', p.water]] as [string, string | undefined][])
    .filter((r): r is [string, string] => !!r[1]).map(([k, v]) => [k, specEn(v)]);
}
