// Carrousels TikTok toute l'année, série 02 (14/11/2026). Même ordre et mêmes numéros que les slides.
// Avis : synthèse d'avis publics de propriétaires (sources ci-dessous), aucun essai Cadrin.
export type TiktokGuideItem = {handle: string; name: string; plus?: string[]; minus?: string[]};
export type TiktokGuide = {id: string; kicker: string; title: string; summary: string; guide: string; guideLabel: string; items: TiktokGuideItem[]; sources?: {label: string; url: string}[]};

export const tiktokGuides: TiktokGuide[] = [
 {
  id: 's01-tsuyosa-bambino-seiko5',
  kicker: 'Le comparatif honnête',
  title: 'Tsuyosa, Bambino ou Seiko 5 ?',
  summary: 'Trois automatiques souvent recommandées pour commencer. La Seiko coûte le moins cher, la Tsuyosa a le verre saphir et 50 m d’étanchéité, la Bambino joue la carte habillée avec son verre bombé.',
  guide: '/guides/bambino-tsuyosa-seiko-5/',
  guideLabel: 'Lire le guide Bambino, Tsuyosa ou Seiko 5',
  items: [
   {handle: 'seiko-5-snkl23j1', name: 'Seiko 5 SNKL23', plus: ['Réputée increvable', 'La vraie automatique la moins chère des trois', 'Un 38 mm qui va à presque tous les poignets'], minus: ['Ni remontage à la main, ni stop-seconde', 'Précision variable d’un exemplaire à l’autre']},
   {handle: 'citizen-tsuyosa-noir-nj0150-81e', name: 'Citizen Tsuyosa', plus: ['Verre saphir, très résistant aux rayures', 'Bracelet intégré, effet « montre chère »', 'Étanche à 50 m'], minus: ['Couronne petite, pas facile à saisir', 'Passe mal sous une manche ajustée']},
   {handle: 'orient-classic-ra-ac0m04y', name: 'Orient Bambino', plus: ['Le verre bombé, très habillé', 'Paraît plus fine qu’elle ne l’est', 'Mouvement conçu et fabriqué par Orient'], minus: ['Verre minéral, plus sensible aux rayures qu’un saphir', 'Bracelet cuir d’origine jugé moyen', '30 m : pas faite pour nager']},
  ],
  sources: [
   {label: 'Avis clients Citizen sur la Tsuyosa (reviews.io)', url: 'https://www.reviews.io/product-reviews/store/citizenwatch-com/NJ0150-56X?page=1'},
   {label: 'Two Broke Watch Snobs, Orient Bambino', url: 'https://twobrokewatchsnobs.com/orient-bambino-review/'},
   {label: 'Monochrome Watches, Orient Bambino 38', url: 'https://monochrome-watches.com/orient-bambino-38-value-proposition-review-dress-watch-specs-price/'},
   {label: 'Watchgecko, Seiko 5 SNKL23', url: 'https://www.watchgecko.com/blogs/magazine/the-seiko-5-snkl23-review'},
  ],
 },
 {
  id: 's02-taille-poignet',
  kicker: 'Avant d’acheter',
  title: '40 mm, c’est trop grand pour moi ?',
  summary: 'Le diamètre ne suffit pas : regardez aussi la longueur de corne à corne et l’épaisseur, puis comparez avec une montre que vous aimez déjà. La Tsuyosa existe en 37 et en 40 mm.',
  guide: '/guides/choisir-taille-montre/',
  guideLabel: 'Lire le guide des tailles de montre',
  items: [
   {handle: 'citizen-tsuyosa-vert-37mm-nj0200-50x', name: 'Tsuyosa 37 mm'},
   {handle: 'orient-classic-ra-ac0m04y', name: 'Bambino 38,5 mm'},
   {handle: 'citizen-tsuyosa-verte-nj0150-81x', name: 'Tsuyosa 40 mm'},
  ],
 },
 {
  id: 's03-casio-retro-ou-gshock',
  kicker: 'Même prix, deux styles',
  title: 'Casio rétro ou G-Shock ?',
  summary: 'Toutes les deux à 99,90 € au relevé. La Casio Vintage ABL-100 est fine, dorée et connectée en Bluetooth. La G-Shock GA-2100 est antichoc et étanche à 200 m.',
  guide: '/comparatifs/casio-retro-ou-g-shock/',
  guideLabel: 'Lire le comparatif Casio rétro ou G-Shock',
  items: [
   {handle: 'casio-vintage-abl-100weg-9a', name: 'Casio Vintage ABL-100', plus: ['Le look rétro doré', 'Se règle toute seule via le téléphone', 'Plus grande que les Casio vintage classiques'], minus: ['Le podomètre ne se désactive pas', 'Peu de fonctions connectées']},
   {handle: 'casio-g-shock-ga-2100-1a1er', name: 'G-Shock GA-2100', plus: ['Antichoc, étanche à 200 m', 'Légère, environ 51 g', 'Fine pour une G-Shock'], minus: ['Petit écran digital', 'Éclairage LED faible', 'Pas d’aiguilles luminescentes sur la version tout noire']},
  ],
  sources: [
   {label: 'G-Central, fiche G-Shock GA-2100', url: 'https://www.g-central.com/specs/g-shock-ga-2100/'},
   {label: 'Decaf Journal, G-Shock GA-2100', url: 'https://www.decafjournal.com/casio-g-shock-ga-2100-review/'},
   {label: 'G-Central, Casio ABL-100', url: 'https://g-central.com/?p=72704'},
  ],
 },
];
