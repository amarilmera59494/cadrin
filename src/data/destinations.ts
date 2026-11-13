export type Destination = {merchant:string;url:string;affiliate:boolean;verifiedAt:string;reference:string;host:string};
export const destinations:Record<string,Destination>={
 'citizen-rainell-em1201-52l':{merchant:'Tempus Shop',url:'https://tempusshop.com/products/citizen-l-rainell-bleu-em1201-52l',affiliate:false,verifiedAt:'2026-11-13',reference:'EM1201-52L',host:'tempusshop.com'},
 'orient-bambino-ra-ac0m04y':{merchant:'Tempus Shop',url:'https://tempusshop.com/products/orient-classic-ra-ac0m04y',affiliate:false,verifiedAt:'2026-11-13',reference:'RA-AC0M04Y',host:'tempusshop.com'},
 'citizen-tsuyosa-nj0150-81e':{merchant:'Tempus Shop',url:'https://tempusshop.com/products/citizen-tsuyosa-noir-nj0150-81e',affiliate:false,verifiedAt:'2026-11-13',reference:'NJ0150-81E',host:'tempusshop.com'},
 'casio-f91w':{merchant:'Tempus Shop',url:'https://tempusshop.com/products/casio-vintage-f-91w-1yeg',affiliate:false,verifiedAt:'2026-11-13',reference:'F-91W-1YEG',host:'tempusshop.com'},
 'seiko-srpe55k1':{merchant:'Tempus Shop',url:'https://tempusshop.com/products/seiko-5-srpe55k1-date-kanji',affiliate:false,verifiedAt:'2026-11-13',reference:'SRPE55K1',host:'tempusshop.com'},
 'citizen-aw0102-13ae':{merchant:'Tempus Shop',url:'https://tempusshop.com/products/citizen-aw0102-13ae',affiliate:false,verifiedAt:'2026-11-13',reference:'AW0102-13AE',host:'tempusshop.com'},
};
export function validDestination(d:Destination|undefined):d is Destination{if(!d)return false;try{const u=new URL(d.url);return u.protocol==='https:'&&!u.username&&!u.password&&u.hostname===d.host&&!!d.verifiedAt&&!!d.reference}catch{return false}}
export const hasAffiliation=Object.values(destinations).some(d=>validDestination(d)&&d.affiliate);
