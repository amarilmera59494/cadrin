// Comparatifs « A ou B ? » construits depuis le catalogue (/comparatifs/<slug>/).
// Le tableau est calculé à partir des fiches ; l'introduction et le verdict sont éditoriaux, sans note ni essai revendiqué.
export type AutoComparison = {slug: string; a: string; b: string; title: string; kicker: string; intro: string[]; verdict: [string, string]; guides: {label: string; url: string}[]};

const G = {
  moves: {label: 'Automatique, quartz ou solaire', url: '/guides/automatique-quartz-solaire/'},
  auto: {label: 'Réserve de marche et remontage', url: '/guides/montre-automatique-reserve-de-marche/'},
  crystal: {label: 'Saphir, minéral ou acrylique', url: '/guides/verre-saphir-mineral-acrylique/'},
  water: {label: 'Le guide de l’étanchéité', url: '/guides/etancheite-montre-3-5-10-20-atm/'},
  diver: {label: 'Montre de plongée et norme ISO 6425', url: '/guides/montre-de-plongee-iso-6425/'},
  size: {label: 'Choisir la taille de sa montre', url: '/guides/choisir-taille-montre/'},
  spec: {label: 'Lire une fiche technique', url: '/guides/lire-fiche-technique-montre/'},
};

export const autoComparisons: AutoComparison[] = [
  {slug: 'tissot-prx-ou-citizen-tsuyosa', a: 'T137.410.11.041.00', b: 'NJ0150-81L', kicker: 'Bracelet intégré', title: 'Tissot PRX ou Citizen Tsuyosa ?',
    intro: ['Deux montres de 40 mm au bracelet acier intégré, le style le plus recherché du moment. La PRX est un quartz suisse, la Tsuyosa une automatique japonaise, avec une centaine d’euros d’écart.', 'Le choix se joue moins sur le look que sur le quotidien : une montre qui ne demande rien, ou une mécanique qu’il faut porter.'],
    verdict: ['Prenez la PRX si vous voulez une montre toujours à l’heure, plus fine, avec une signature suisse.', 'Prenez la Tsuyosa si l’idée d’une automatique vous plaît et que vous la porterez presque tous les jours.'],
    guides: [G.moves, G.auto, G.size]},
  {slug: 'tissot-prx-quartz-ou-powermatic-80', a: 'T137.210.11.041.00', b: 'T137.207.11.041.00', kicker: 'Même montre, deux moteurs', title: 'Tissot PRX 35 mm : quartz ou Powermatic 80 ?',
    intro: ['Même boîtier de 35 mm, même cadran : seule la mécanique change, et le prix double presque. C’est la question que se posent la plupart des acheteurs de PRX.', 'Le quartz est plus précis et ne demande rien. Le Powermatic 80 est une automatique dont Tissot met en avant la longue réserve de marche.'],
    verdict: ['Prenez le quartz si vous voulez la PRX pour son style, au meilleur prix.', 'Prenez le Powermatic 80 si la mécanique compte pour vous, et si vous acceptez l’écart de prix.'],
    guides: [G.moves, G.auto, G.spec]},
  {slug: 'g-shock-ga-2100-ou-gm-2100', a: 'GA-2100-1A1ER', b: 'GM-2100-1AER', kicker: 'Résine ou métal', title: 'G-Shock GA-2100 ou GM-2100 ?',
    intro: ['La même silhouette octogonale, deux matières : la GA-2100 est tout en résine, la GM-2100 ajoute une lunette en métal. Le prix double.', 'Les deux restent des G-Shock antichocs à 20 bar. La différence est surtout visuelle et tactile.'],
    verdict: ['Prenez la GA-2100 pour la légèreté et le prix : la G-Shock octogonale la plus accessible.', 'Prenez la GM-2100 si vous voulez une allure plus habillée, avec l’éclat du métal.'],
    guides: [G.water, G.size, G.spec]},
  {slug: 'citizen-tsuyosa-ou-orient-mako-iii', a: 'NJ0150-81E', b: 'RA-AA0001B', kicker: 'Deux automatiques japonaises', title: 'Citizen Tsuyosa ou Orient Mako III ?',
    intro: ['Deux automatiques japonaises à verre saphir, autour de 300 et 400 €. La Tsuyosa est une montre de ville au bracelet intégré ; la Mako III, une plongeuse avec lunette tournante.', 'Regardez surtout l’étanchéité, l’épaisseur et la taille : elles racontent deux usages différents.'],
    verdict: ['Prenez la Tsuyosa pour le bureau et les tenues de ville : plus fine et plus discrète.', 'Prenez la Mako III pour l’eau et les week-ends : 20 ATM et une lunette de plongée.'],
    guides: [G.water, G.auto, G.size]},
  {slug: 'orient-mako-iii-ou-citizen-tsuyosa-shore', a: 'RA-AA0001B', b: 'NJ0234-58X', kicker: 'Deux automatiques sportives', title: 'Orient Mako III ou Citizen Tsuyosa Shore ?',
    intro: ['Deux automatiques sportives à verre saphir, séparées d’une cinquantaine d’euros. La Mako III joue la plongeuse classique ; la Tsuyosa Shore, une sportive plus compacte.', 'L’étanchéité, le diamètre et l’épaisseur font la différence au poignet.'],
    verdict: ['Prenez la Mako III si vous voulez une vraie allure de plongeuse et 20 ATM.', 'Prenez la Tsuyosa Shore si vous préférez un format de 40 mm, plus facile à porter en ville.'],
    guides: [G.diver, G.water, G.size]},
  {slug: 'hamilton-khaki-field-mecanique-ou-quartz', a: 'H69399930', b: 'H69401940', kicker: 'Montre de terrain', title: 'Hamilton Khaki Field : mécanique ou quartz ?',
    intro: ['La Khaki Field est la montre de terrain emblématique d’Hamilton. La version Mechanical se remonte à la main ; la version Quartz ne demande rien et coûte moins cher.', 'Les deux diffèrent aussi par le diamètre et le verre : lisez la fiche avant de choisir.'],
    verdict: ['Prenez la Mechanical si le petit rituel du remontage vous plaît et si le verre acrylique vintage ne vous gêne pas.', 'Prenez la Quartz pour une Khaki Field prête à porter, avec un verre saphir.'],
    guides: [G.auto, G.crystal, G.moves]},
  {slug: 'lip-himalaya-ou-orient-bambino', a: '671543', b: 'RA-AC0M04Y', kicker: 'Deux habillées vintage', title: 'Lip Himalaya ou Orient Bambino ?',
    intro: ['Deux montres habillées à verre bombé, sur cuir, pour une allure vintage. La Lip est un quartz de marque française ; la Bambino, une automatique japonaise.', 'Le mouvement et l’étanchéité les séparent davantage que le style.'],
    verdict: ['Prenez la Lip si vous voulez une montre habillée simple, sans entretien, et une marque française.', 'Prenez la Bambino si vous voulez une automatique au style classique, à porter tous les jours.'],
    guides: [G.moves, G.crystal, G.water]},
];
