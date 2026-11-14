import {plain} from './import-tempus-specifications.mjs';

// Only a colour explicitly attached to "cadran". Never consume the surrounding
// marketing sentence or pick up a strap/hand colour later in the description.
const colours=[
 ['Noir','noire?|black'],['Bleu','bleue?|blue|turquoise'],['Vert','verte?|green|kaki'],
 ['Blanc','blanc(?:he)?|white'],['Argenté','argentée?|argent|silver'],['Gris','grise?|anthracite|grey|gray'],
 ['Beige','beige|crème|creme|ivoire|ivory|champagne'],['Rose','rose|pink|saumon'],
 ['Rouge','rouge|red|bordeaux'],['Marron','marron|brune?|brown|chocolat'],
 ['Jaune','jaune|yellow'],['Doré','dorée?|gold'],['Orange','orange'],['Violet','violet(?:te)?|purple|mauve']
];
const word=colours.map(([,pattern])=>`(?:${pattern})`).join('|');
const expression=new RegExp(`\\bcadran\\s+(?:(?:numérique|analogique)\\s+)?(?:de\\s+couleur\\s+)?(${word})(?![\\p{L}])(?:\\s*(?:et|/|&)\\s*(${word})(?![\\p{L}]))?`,'iu');
export function dialFromDescription(html=''){
 const text=plain(html),match=text.match(expression);
 if(!match||/\b(?:sans|non|pas|contrairement|inspirée?|autre|ancien|without|unlike)\b/i.test(text.slice(Math.max(0,match.index-80),match.index)))return {dial:'',dialColors:[]};
 const families=[...new Set(match.slice(1).filter(Boolean).map(token=>colours.find(([,pattern])=>new RegExp(`^(?:${pattern})$`,'iu').test(token))[0]))];
 return {dial:families.join(' / '),dialColors:families};
}

// A model explicitly sold as a chronograph/GMT is different from prose which
// merely mentions a historic chronograph, a phone's GPS, or the lack of Bluetooth.
// Other functions require an exact technical table or a documented correction.
export function functionsFromTitle(title=''){
 if(/\b(?:sans|non|pas|without|no|inspir\w*|style|hommage|homage)\b/i.test(title))return '';
 return [/(?:^|\s)chronograph(?:e)?(?:\s|$|[-–:])/i.test(title)?'Chronographe':'',/(?:^|\s)GMT(?:\s|$|[-–:])/i.test(title)?'GMT':''].filter(Boolean).join(', ');
}
