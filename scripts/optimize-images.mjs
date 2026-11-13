import sharp from 'sharp';
for(const name of ['leather','wrist','sleeve'])for(const width of [480,900,1600]){
 const input=`evidence/originals/${name}.jpg`;
 await sharp(input).resize({width,withoutEnlargement:true}).avif({quality:58,effort:4}).toFile(`public/images/${name}-${width}.avif`);
 await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${name}-${width}.webp`);
}
console.log('3 photographs × 3 sizes × 2 formats.');
