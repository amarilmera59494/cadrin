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
  {slug: 'g-shock-ga-2100-ou-gm-2100', a: 'GA-2100-1A1ER', b: 'GM-2100-1AER', kicker: 'Résine ou métal', title: 'G-Shock GA-2100 ou GM-2100 ?',
    intro: ['La même silhouette octogonale, deux matières : la GA-2100 est tout en résine, la GM-2100 ajoute une lunette en métal. Le prix double.', 'Les deux restent des G-Shock antichocs à 20 bar. La différence est surtout visuelle et tactile.'],
    verdict: ['Prenez la GA-2100 pour la légèreté et le prix : la G-Shock octogonale la plus accessible.', 'Prenez la GM-2100 si vous voulez une allure plus habillée, avec l’éclat du métal.'],
    guides: [G.water, G.size, G.spec]},
  {slug: 'citizen-tsuyosa-ou-orient-mako-iii', a: 'NJ0150-81E', b: 'RA-AA0001B', kicker: 'Deux automatiques japonaises', title: 'Citizen Tsuyosa ou Orient Mako III ?',
    intro: ['Deux automatiques japonaises à verre saphir, autour de 300 et 400 €. La Tsuyosa est une montre de ville au bracelet intégré ; la Mako III, une plongeuse avec lunette tournante.', 'Regardez surtout l’étanchéité, l’épaisseur et la taille : elles racontent deux usages différents.'],
    verdict: ['Prenez la Tsuyosa pour le bureau et les tenues de ville : plus fine et plus discrète.', 'Prenez la Mako III pour l’eau et les week-ends : 20 ATM et une lunette de plongée.'],
    guides: [G.water, G.auto, G.size]},
  {slug: 'orient-mako-iii-ou-citizen-tsuyosa-shore', a: 'RA-AA0001B', b: 'NJ0234-58X', kicker: 'Deux automatiques sportives', title: 'Orient Mako III ou Citizen Tsuyosa Shore ?',
    intro: ['Deux automatiques sportives à verre saphir, séparées d’une cinquantaine d’euros. La Mako III joue la plongeuse classique ; la Tsuyosa Shore, une sportive plus compacte.', 'L’étanchéité, le diamètre et l’épaisseur font la différence au poignet.'],
    verdict: ['Prenez la Mako III si vous voulez une vraie allure de plongeuse et 20 ATM.', 'Prenez la Tsuyosa Shore si vous préférez un format de 40 mm, plus facile à porter en ville.'],
    guides: [G.diver, G.water, G.size]},
  {slug: 'lip-himalaya-ou-orient-bambino', a: '671543', b: 'RA-AC0M04Y', kicker: 'Deux habillées vintage', title: 'Lip Himalaya ou Orient Bambino ?',
    intro: ['Deux montres habillées à verre bombé, sur cuir, pour une allure vintage. La Lip est un quartz de marque française ; la Bambino, une automatique japonaise.', 'Le mouvement et l’étanchéité les séparent davantage que le style.'],
    verdict: ['Prenez la Lip si vous voulez une montre habillée simple, sans entretien, et une marque française.', 'Prenez la Bambino si vous voulez une automatique au style classique, à porter tous les jours.'],
    guides: [G.moves, G.crystal, G.water]},
];
