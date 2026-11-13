/** Only local, cleared photos of the identified watch belong in this register. */
export interface ProductPhoto {
  src: string;
  reference: string;
  kind: 'packshot' | 'worn';
  width: number;
  height: number;
  alt: string;
  credit: string;
  source: string;
  permissionFile: string;
  focus?: string;
}

export const productPhotos: Record<string, ProductPhoto> = {};

export function clearedPhoto(src: string | null | undefined, reference: string) {
  if (!src) return;
  const photo = productPhotos[src];
  if (photo?.reference === reference && photo.src === src &&
      src.startsWith('/images/products/') && !src.includes('..') &&
      photo.width > 0 && photo.height > 0 && photo.credit.trim() &&
      photo.alt.trim() && photo.source.trim() && photo.permissionFile.startsWith('licenses/') &&
      !photo.permissionFile.includes('..')) return photo;
}
