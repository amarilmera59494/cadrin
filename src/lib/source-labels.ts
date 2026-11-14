// Server-only labels for the documents already cited in editorial content.
// Product references are resolved from the recorded catalogue, never inferred
// from another listing's title. URLs and affiliate handling remain unchanged.
import data from '../data/tempus-catalogue.json' with {type:'json'};
const documents:Record<string,string>={
 'https://www.seikowatches.com/us-en/special/heritage/':'Seiko — watchmaking history',
 'https://www.seikowatches.com/global-en/special/heritage/':'Seiko — watchmaking history',
 'https://www.seikowatches.com/us-en/customerservice/knowledge/quartz-knowledge':'Seiko — how quartz watches work',
 'https://www.seikowatches.com/instructions/html/SEIKO_4R35_4R36_4R37_4R38_4R39_4R71_4R72_EN/index':'Seiko — 4R calibre instruction manual',
 'https://www.citizenwatch-global.com/technologies/eco-drive/index.html':'Citizen — Eco-Drive technology',
 'https://www.citizenwatch-global.com/support/pdf/j7xx_j80x_j81x_j83x/e.pdf':'Citizen — J7/J8 calibre instruction manual (PDF)',
 'https://www.seikowatches.com/uk-en/products/5sports/srpe55':'Seiko — SRPE55 specifications',
 'https://orient-watch.com/en/orient/collection/classic/classic-and-simple-style-38/RA-AC0M04Y/':'Orient — RA-AC0M04Y Classic & Simple Style 38',
 'https://fr.citizenwatch.eu/fr/p/nj0150-81e/':'Citizen — Tsuyosa NJ0150-81E (French)',
 'https://www.seikoboutique.co.uk/product/seiko-5-sports-27/':'Seiko Boutique — SRPE55K1 specifications',
 'https://www.seikowatches.com/fr-fr/products/5sports/srpe55':'Seiko — SRPE55 specifications (French)',
 'https://www.casio.com/intl/watches/casio/product.F-91W-1/':'Casio — F-91W-1 specifications',
 'https://de.citizenwatch.eu/de/p/aw1231-58e/':'Citizen — AW1231-58E specifications (German)',
 'https://www.seikowatches.com/fr-fr/products/5sports/srpg35':'Seiko — SRPG35 specifications (French)',
 'https://www.seikowatches.com/uk-en/products/5sports/srpg35':'Seiko — SRPG35 specifications',
 'https://de.citizenwatch.eu/de/p/em1201-52l/':'Citizen — L Rainell EM1201-52L (German)',
 'https://de.citizenwatch.eu/media/filer_public/3f/f8/3ff871af-1632-443b-b078-8dfcf9747972/citizen_folder_q1_2022.pdf':'Citizen Europe — Classic Elegant catalogue, J800 (PDF)',
 'https://www.citizenwatch-global.com/support/maintenance/wr.html':'Citizen — water-resistance markings and permitted uses',
 'https://www.casio.com/europe/support/watches/faq/article/00/05/15/61/':'Casio — water-resistance precautions',
 'https://www.seikowatches.com/fr-fr/customerservice/faq/care-maintenance-2':'Seiko — water resistance and care (French)',
 'https://www.casio.com/us/watches/casio/about/f-91w/':'Casio — history of the F-91W',
 'https://www.casio.com/us/watches/gshock/product.GBD-200-1/':'Casio — GBD-200 functions and smartphone calibration',
 'https://www.breguet.com/fr/le-tourbillon':'Breguet — the tourbillon (French)',
 'https://www.casio.com/fr/watches/gshock/product.GA-2100-1A/':'Casio — GA-2100-1A specifications (French)',
 'https://www.casio.com/fr/watches/gshock/product.GA-2100-1A1/':'Casio — GA-2100-1A1 specifications (French)',
 'https://www.swatchgroup.com/en/companies-brands/landmarks/longines-museum':'Swatch Group — Longines Museum and history',
 'https://www.longines.com/en-gr/p/watch-conquest-l3-720-4-02-6':'Longines — Conquest L3.720.4.02.6',
 'https://www.citizenwatch-global.com/about/history/index.html':'Citizen — company history',
 'https://citizenwatch.eu/en/info/technologies/eco-drive/':'Citizen Europe — Eco-Drive technology',
 'https://www.casio.com/intl/news/2024/0215-trn-50/':'Casio — Casiotron and the 1974 launch',
 'https://www.casio.com/europe/watches/50th/':'Casio — 50 years of watches',
 'https://tempusshop.com/en/policies/terms-of-sale':'Tempus — terms of sale',
 'https://tempusshop.com/en/pages/faq':'Tempus — delivery and frequently asked questions',
 'https://tempusshop.com/en/policies/refund-policy':'Tempus — returns policy',
 'https://tempusshop.com/collections/montre-femme':'Tempus — women’s watch collection'
};
const productLabels=new Map(data.products.map(p=>[new URL(p.source).pathname,`Tempus — ${p.brand} ${p.reference}`]));
export function sourceLabel(url:string){
 const target=new URL(url);target.search='';target.hash='';
 const known=documents[target.href];if(known)return known;
 if(target.hostname==='tempusshop.com')return productLabels.get(target.pathname.replace(/^\/en\//,'/'))||'Tempus — source document';
 return `${target.hostname.replace(/^www\./,'')} — source document`;
}
export const hasSourceLabel=(url:string)=>!sourceLabel(url).endsWith(' — source document');
