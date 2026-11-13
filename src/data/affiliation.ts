// Public tracking identifier observed in the 301 redirect from the owner-supplied
// https://tempusshop.com/pierrenarguet on 2026-11-13, then independently confirmed
// by the owner's GAC-2500-9A and GAC-2500-7A product links. Not a secret.
export const tempusAffiliate = {url:'https://tempusshop.com/pierrenarguet', code:'bDlTL8AyKb', verifiedAt:'2026-11-13'};
export function affiliateUrl(url:string) {
  const target=new URL(url);
  if(target.protocol!=='https:' || target.hostname!=='tempusshop.com' || target.username || target.password) throw new Error('Invalid Tempus destination');
  target.searchParams.set('bg_ref',tempusAffiliate.code);
  return target.href;
}
export function isTempusProduct(url:string) {
  try {const target=new URL(url);return target.protocol==='https:'&&target.hostname==='tempusshop.com'&&/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?products\/[^/]+\/?$/i.test(target.pathname);} catch {return false;}
}
