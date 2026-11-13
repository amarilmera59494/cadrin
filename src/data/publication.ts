import { clearedPhoto } from './product-photos.ts';
export type EditorialStatus={status:string;sources:unknown[];verifiedAt:string|null;reviewer:string|null;rights:string;image?:string|null;reference?:string};
export function publishable(data:EditorialStatus){return data.status==='published'&&data.sources.length>0&&!!data.verifiedAt&&!!data.reviewer&&data.rights==='approved'&&(!data.reference||!!clearedPhoto(data.image,data.reference))}
