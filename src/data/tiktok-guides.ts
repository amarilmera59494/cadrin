// Carrousels TikTok toute l'année, série 02 (14/11/2026). Même ordre et mêmes numéros que les slides.
// Avis : synthèse d'avis publics de propriétaires (sources ci-dessous), aucun essai Cadrin.
export type TiktokGuideItem = {handle: string; name: string; plus?: string[]; minus?: string[]};
export type TiktokGuide = {id: string; kicker: string; title: string; summary: string; guide: string; guideLabel: string; items: TiktokGuideItem[]; plusTitle?: string; minusTitle?: string; sources?: {label: string; url: string}[]};

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
 {
  id: 's04-automatique-quartz-solaire',
  plusTitle: 'Pour vous si…',
  minusTitle: 'À prévoir',
  kicker: 'La question du lundi matin',
  title: 'Automatique, quartz ou solaire ?',
  summary: 'Après trois jours dans un tiroir, le quartz et le solaire tournent encore, l’automatique est à relancer. Le quartz demande une pile, le solaire de la lumière, l’automatique un entretien mécanique.',
  guide: '/guides/automatique-quartz-solaire/',
  guideLabel: 'Lire le guide automatique, quartz ou solaire',
  items: [
   {handle: 'casio-g-shock-ga-2100-1a1er', name: 'Quartz : G-Shock GA-2100', plus: ['Vous voulez la reprendre et partir', 'Vous la portez au sport ou dehors'], minus: ['Une pile à changer un jour']},
   {handle: 'citizen-aw0102-13ae', name: 'Solaire : Citizen Eco-Drive', plus: ['Vous voulez oublier la pile', 'Vous portez des tenues habillées'], minus: ['À ranger à la lumière, pas dans une boîte fermée', 'Étanche à 30 m']},
   {handle: 'citizen-tsuyosa-noir-nj0150-81e', name: 'Automatique : Citizen Tsuyosa', plus: ['Vous aimez la mécanique et le geste', 'Vous voulez le verre saphir'], minus: ['Arrêtée après environ 2 jours au repos', 'Moins précise qu’un quartz']},
  ],
 },
 {
  id: 's05-orient-mako-iii',
  kicker: 'L’avis des propriétaires',
  title: 'Orient Mako III : ça vaut 399 € ?',
  summary: 'Verre saphir, 200 m, mouvement maison F6922 avec remontage à la main et stop-seconde, 42 mm pour 13 mm d’épaisseur. Trois couleurs au même prix.',
  guide: '/marques/orient/',
  guideLabel: 'Voir notre page Orient',
  items: [
   {handle: '1-orient-mako-iii-kamasu-ra-aa0001b19b', name: 'Mako III noire', plus: ['Le rapport qualité-prix, cité très souvent', 'Se porte bien au quotidien', 'Saphir et 200 m à ce prix'], minus: ['Fermoir simple, pas usiné', 'Précision jugée moyenne par certains', '13 mm : pas faite pour la chemise']},
   {handle: 'orient-mako-iii-kamasu-ra-aa0003r19b', name: 'Mako III rouge'},
   {handle: '1-orient-mako-iii-kamasu-ra-aa0004e19b', name: 'Mako III verte'},
  ],
  sources: [
   {label: 'Ben’s Watch Club, Orient Kamasu', url: 'https://benswatchclub.squarespace.com/blog/orient-kamasu-review'},
   {label: 'Deployant, Mako III Kamasu verte', url: 'https://deployant.com/review-the-new-dark-green-mako-iii-kamasu-by-orient/'},
   {label: 'Dialicious, avis de propriétaires', url: 'https://www.dialicious.com/en/orient/mako_iii_kamasu'},
  ],
 },
 {
  id: 's06-premiere-montre-erreurs',
  kicker: 'Première montre',
  title: '5 erreurs à éviter',
  summary: 'Regarder seulement le diamètre, oublier le prix total, croire qu’il faut une mécanique, acheter sans lire la fiche, négliger le bracelet. Et trois premiers choix sûrs.',
  guide: '/guides/choisir-premiere-montre/',
  guideLabel: 'Lire le guide de la première montre',
  items: [
   {handle: 'casio-g-shock-ga-2100-1a1er', name: 'G-Shock GA-2100'},
   {handle: 'citizen-aw0102-13ae', name: 'Citizen Eco-Drive'},
   {handle: 'citizen-tsuyosa-noir-nj0150-81e', name: 'Citizen Tsuyosa'},
  ],
 },
 {
  id: 's07-eco-drive-ou-tsuyosa',
  plusTitle: 'Pour vous si…',
  minusTitle: 'À prévoir',
  kicker: 'Même marque, deux énergies',
  title: 'Solaire ou automatique ?',
  summary: 'Deux Citizen de 40 mm. L’Eco-Drive annonce 240 jours de réserve à pleine charge, la Tsuyosa environ 42 heures, avec en échange le verre saphir, 50 m et un bracelet acier.',
  guide: '/guides/citizen-eco-drive-ou-tsuyosa/',
  guideLabel: 'Lire le guide Eco-Drive ou Tsuyosa',
  items: [
   {handle: 'citizen-aw0102-13ae', name: 'Citizen Eco-Drive', plus: ['Vous alternez entre plusieurs montres', 'Vous aimez le look cuir et doré'], minus: ['Il lui faut de la lumière', 'Verre minéral, 30 m']},
   {handle: 'citizen-tsuyosa-noir-nj0150-81e', name: 'Citizen Tsuyosa', plus: ['Vous la portez presque tous les jours', 'Vous voulez saphir et 50 m'], minus: ['À remettre à l’heure après environ 2 jours au repos']},
  ],
 },
];
