/** Only local, cleared photos of the identified watch belong in this register. */
export interface ProductPhoto {
  src: string;
  reference: string;
  kind: 'packshot' | 'worn';
  width: number;
  height: number;
  alt: string;
  altEn?: string;
  creditEn?: string;
  credit: string;
  source: string;
  permissionFile: string;
  focus?: string;
}

export const productPhotos: Record<string, ProductPhoto> = {
  "/images/products/citizen-rainell-em1201-52l.webp": {
    "src": "/images/products/citizen-rainell-em1201-52l.webp",
    "reference": "EM1201-52L",
    "kind": "packshot",
    "width": 800,
    "height": 1000,
    "alt": "Citizen L Rainell Bleu EM1201-52L — photographie Tempus",
    "altEn": "Citizen L Rainell Bleu EM1201-52L — Tempus product photograph",
    "credit": "Photo Tempus · EM1201-52L",
    "creditEn": "Photo: Tempus · EM1201-52L",
    "source": "https://tempusshop.com/products/citizen-l-rainell-bleu-em1201-52l",
    "permissionFile": "licenses/tempus-media.md"
  },
  "/images/products/orient-bambino-ra-ac0m04y.webp": {
    "src": "/images/products/orient-bambino-ra-ac0m04y.webp",
    "reference": "RA-AC0M04Y",
    "kind": "packshot",
    "width": 800,
    "height": 1000,
    "alt": "Orient Classic Bambino RA-AC0M04Y — photographie Tempus",
    "altEn": "Orient Classic Bambino RA-AC0M04Y — Tempus product photograph",
    "credit": "Photo Tempus · RA-AC0M04Y",
    "creditEn": "Photo: Tempus · RA-AC0M04Y",
    "source": "https://tempusshop.com/products/orient-classic-ra-ac0m04y",
    "permissionFile": "licenses/tempus-media.md"
  },
  "/images/products/citizen-tsuyosa-nj0150-81e.webp": {
    "src": "/images/products/citizen-tsuyosa-nj0150-81e.webp",
    "reference": "NJ0150-81E",
    "kind": "packshot",
    "width": 800,
    "height": 1000,
    "alt": "Citizen Tsuyosa noir NJ0150-81E — photographie Tempus",
    "altEn": "Citizen Tsuyosa noir NJ0150-81E — Tempus product photograph",
    "credit": "Photo Tempus · NJ0150-81E",
    "creditEn": "Photo: Tempus · NJ0150-81E",
    "source": "https://tempusshop.com/products/citizen-tsuyosa-noir-nj0150-81e",
    "permissionFile": "licenses/tempus-media.md"
  },
  "/images/products/casio-f91w.webp": {
    "src": "/images/products/casio-f91w.webp",
    "reference": "F-91W-1YEG",
    "kind": "packshot",
    "width": 800,
    "height": 1000,
    "alt": "Casio Vintage F-91W-1YEG — photographie Tempus",
    "altEn": "Casio Vintage F-91W-1YEG — Tempus product photograph",
    "credit": "Photo Tempus · F-91W-1YEG",
    "creditEn": "Photo: Tempus · F-91W-1YEG",
    "source": "https://tempusshop.com/products/casio-vintage-f-91w-1yeg",
    "permissionFile": "licenses/tempus-media.md"
  },
  "/images/products/seiko-srpe55k1.webp": {
    "src": "/images/products/seiko-srpe55k1.webp",
    "reference": "SRPE55K1",
    "kind": "packshot",
    "width": 800,
    "height": 800,
    "alt": "Seiko 5 date Kanji SRPE55K1 — photographie Tempus",
    "altEn": "Seiko 5 date Kanji SRPE55K1 — Tempus product photograph",
    "credit": "Tempus · fiche SRPE55K1, visuel nommé SBSA045",
    "creditEn": "Tempus · SRPE55K1 listing, image named SBSA045",
    "source": "https://tempusshop.com/products/seiko-5-srpe55k1-date-kanji",
    "permissionFile": "licenses/tempus-media.md"
  },
  "/images/products/citizen-aw0102-13ae.webp": {
    "src": "/images/products/citizen-aw0102-13ae.webp",
    "reference": "AW0102-13AE",
    "kind": "packshot",
    "width": 800,
    "height": 1000,
    "alt": "Citizen Eco-drive AW0102-13AE — photographie Tempus",
    "altEn": "Citizen Eco-drive AW0102-13AE — Tempus product photograph",
    "credit": "Photo Tempus · AW0102-13AE",
    "creditEn": "Photo: Tempus · AW0102-13AE",
    "source": "https://tempusshop.com/products/citizen-aw0102-13ae",
    "permissionFile": "licenses/tempus-media.md"
  }
};

export function clearedPhoto(src: string | null | undefined, reference: string) {
  if (!src) return;
  const photo = productPhotos[src];
  if (photo?.reference === reference && photo.src === src &&
      src.startsWith('/images/products/') && !src.includes('..') &&
      photo.width > 0 && photo.height > 0 && photo.credit.trim() &&
      photo.alt.trim() && photo.source.trim() && photo.permissionFile.startsWith('licenses/') &&
      !photo.permissionFile.includes('..')) return photo;
}
