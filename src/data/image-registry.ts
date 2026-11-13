import {images} from './images.ts';
export const imageRegistry=Object.fromEntries(['sleeve','wrist','leather'].map(key=>{
 const photo=images[key as 'sleeve'|'wrist'|'leather'];
 return [key,{files:[480,900,1600].flatMap(width=>['avif','webp'].map(format=>`/images/${key}-${width}.${format}`)),source:photo.page,author:photo.author,license:'https://unsplash.com/license',rights:'approved',usage:'editorial-atmosphere',representedReference:null,conditions:'Crédit sous la photo. Hors sélection. Ne pas attribuer à une référence ni suggérer une approbation. Licence documentée dans SOURCES.md le 12 novembre 2026.'}];
}));
