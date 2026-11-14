// Sélections construites depuis le catalogue (/selections/<slug>/).
// Critères explicites et vérifiables sur les fiches ; ordre : best-sellers du vendeur, puis prix croissant.
// Aucune note, aucun classement de qualité, aucun essai revendiqué.
import type {CatalogueProduct} from '../lib/tempus-catalogue';
import {normalise,sizeNumber,waterMark} from '../lib/tempus-catalogue';

export type Hub = {
  slug: string; kicker: string; title: string; h1: string; description: string;
  intro: string[]; criteria: string[]; tips: [string, string][];
  guides: {label: string; url: string}[]; match: (p: CatalogueProduct) => boolean;
  sort?: 'price' | 'best'; limit?: number;
};

const has = (s: string | undefined, re: RegExp) => re.test(normalise(s || ''));
const swiss = new Set(['Tissot', 'Hamilton', 'Mido', 'Alpina', 'Swiss Millitary', 'Vulcain', 'Squale', 'Nivada Grenchen', 'Longines']);
const french = new Set(['Lip', 'Kelton', 'Auricoste']);
const G = {
  water: {label: 'Le guide de l’étanchéité', url: '/guides/etancheite-montre-3-5-10-20-atm/'},
  moves: {label: 'Automatique, quartz ou solaire', url: '/guides/automatique-quartz-solaire/'},
  size: {label: 'Choisir la taille de sa montre', url: '/guides/choisir-taille-montre/'},
  budget: {label: 'Les montres par budget', url: '/guides/montres-par-budget/'},
  gift: {label: 'Offrir une montre', url: '/guides/offrir-une-montre/'},
  first: {label: 'Choisir sa première montre', url: '/guides/choisir-premiere-montre/'},
  colour: {label: 'Choisir la couleur du cadran', url: '/guides/choisir-couleur-cadran/'},
  online: {label: 'Acheter une montre en ligne', url: '/guides/acheter-montre-en-ligne/'},
  upgrade: {label: 'Passer à une montre plus haut de gamme', url: '/guides/premiere-montre-haut-de-gamme/'},
  crystal: {label: 'Saphir, minéral ou acrylique', url: '/guides/verre-saphir-mineral-acrylique/'},
  auto: {label: 'Réserve de marche et remontage', url: '/guides/montre-automatique-reserve-de-marche/'},
  diver: {label: 'Montre de plongée et norme ISO 6425', url: '/guides/montre-de-plongee-iso-6425/'},
  spec: {label: 'Lire une fiche technique', url: '/guides/lire-fiche-technique-montre/'},
};

export const hubs: Hub[] = [
  {
    slug: 'montres-automatiques-moins-de-300-euros', kicker: 'Automatique', title: 'Montres automatiques à moins de 300 €',
    h1: 'Automatiques.<br>Moins de 300 €.', description: 'Les montres automatiques à moins de 300 € du catalogue : prix datés, taille, verre et étanchéité, et ce qu’il faut vérifier avant d’acheter.',
    intro: ['Une automatique se remonte avec les mouvements du poignet : pas de pile, et une trotteuse qui glisse au lieu de sauter. Sous 300 €, on trouve des mouvements japonais éprouvés chez Seiko, Orient ou Citizen, avec des écarts nets sur le verre et l’étanchéité.', 'Regardez d’abord ces deux lignes : un verre saphir résiste bien mieux aux rayures, et 3 bar ne permet pas de se baigner. Vérifiez aussi si la montre s’arrête au repos ; c’est le cas de toutes les automatiques, au bout de leur réserve de marche.'],
    criteria: ['Mouvement automatique indiqué sur la fiche du vendeur', 'Prix France inférieur ou égal à 300 €, hors livraison', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['Saphir ou minéral ?', 'À ce prix, le verre saphir fait souvent la différence au fil des années.'], ['Elle s’arrête au repos', 'Si vous alternez plusieurs montres, prévoyez de la remettre à l’heure.'], ['Remontage et stop-seconde', 'Pratiques pour la relancer et la régler à la seconde ; tous les calibres ne les ont pas.']],
    guides: [G.auto, G.moves, G.crystal], match: p => p.movement === 'Automatique' && p.price <= 300,
  },
  {
    slug: 'montres-moins-de-100-euros', kicker: 'Petit budget', title: 'Montres à moins de 100 €',
    h1: 'Moins de 100 €.<br>Sans faire cheap.', description: 'Les montres à moins de 100 € du catalogue, avec prix datés, taille, verre et étanchéité : ce qu’on peut attendre à ce prix, et ce qu’il faut vérifier.',
    intro: ['Sous 100 €, le quartz domine : précis, sans entretien, avec une pile à changer de temps en temps. Les écarts se jouent sur les matériaux (résine ou acier), le verre et l’étanchéité.', 'C’est le bon budget pour une montre de sport, une rétro numérique ou un premier cadeau. Attention aux remises : comparez avec un prix relevé et daté, pas seulement avec le prix barré.'],
    criteria: ['Prix France de 50 à 100 €, hors livraison', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['Résine ou acier', 'La résine est légère et encaisse les chocs ; l’acier fait plus habillé.'], ['Le verre', 'Souvent minéral ou acrylique à ce prix : plus sensible aux rayures qu’un saphir.'], ['L’étanchéité', 'Une montre de sport à 20 bar suit à la piscine ; une 3 bar, non.']],
    guides: [G.budget, G.crystal, G.spec], match: p => p.price <= 100,
  },
  {
    slug: 'montres-de-100-a-200-euros', kicker: 'Budget moyen', title: 'Montres de 100 à 200 €',
    h1: 'De 100 à 200 €.<br>Le bon compromis.', description: 'Les montres de 100 à 200 € du catalogue : prix datés, taille, verre, étanchéité, et les points à vérifier avant d’acheter.',
    intro: ['Entre 100 et 200 €, on change de catégorie : boîtiers acier, premiers verres saphir, solaires et quelques automatiques d’entrée de gamme. C’est le budget le plus courant pour une montre de tous les jours ou un cadeau.', 'Pour départager deux modèles proches, comparez le verre, l’étanchéité et l’épaisseur, puis le bracelet : c’est souvent lui qui décide si la montre sera portée.'],
    criteria: ['Prix France de 100,01 à 200 €, hors livraison', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['Le saphir apparaît', 'Quelques modèles l’offrent déjà : un vrai plus pour une montre portée tous les jours.'], ['Solaire ou quartz', 'Le solaire évite les changements de pile, à condition de laisser la montre à la lumière.'], ['Le bracelet', 'Cuir : réglage sans outil. Acier : maillons à retirer chez un horloger.']],
    guides: [G.budget, G.moves, G.gift], match: p => p.price > 100 && p.price <= 200,
  },
  {
    slug: 'montres-verre-saphir-moins-de-300-euros', kicker: 'Verre saphir', title: 'Montres avec verre saphir à moins de 300 €',
    h1: 'Verre saphir.<br>Moins de 300 €.', description: 'Les montres à verre saphir à moins de 300 € du catalogue : le verre presque inrayable, avec prix datés, taille et étanchéité.',
    intro: ['Le verre saphir est synthétique et presque inrayable : c’est le détail qui garde une montre nette pendant des années. Longtemps réservé au haut de gamme, on le trouve désormais sous 300 €.', 'Il a une contrepartie : très dur, il peut se fendre sur un choc sec, là où un verre minéral se rayerait. Pour une montre de bureau ou de tous les jours, c’est le meilleur compromis.'],
    criteria: ['Verre saphir indiqué sur la fiche du vendeur', 'Prix France inférieur ou égal à 300 €, hors livraison', 'Commandable au relevé, diamètre et étanchéité renseignés'],
    tips: [['Saphir, pas « traité saphir »', 'Seule la mention « saphir » compte ; un verre minéral traité reste un minéral.'], ['Rayures contre chocs', 'Le saphir résiste aux rayures, pas aux chocs violents.'], ['Le reste de la fiche', 'Le verre ne dit rien de l’étanchéité : vérifiez-la séparément.']],
    guides: [G.crystal, G.spec, G.upgrade], match: p => has(p.glass, /saphir/) && p.price <= 300,
  },
  {
    slug: 'montres-solaires', kicker: 'Solaire', title: 'Montres solaires',
    h1: 'Solaires.<br>Plus jamais de pile.', description: 'Les montres solaires du catalogue : rechargées par la lumière, avec prix datés, taille, verre et étanchéité.',
    intro: ['Une montre solaire est un quartz dont la pile se recharge à la lumière, naturelle ou artificielle. Elle garde la précision du quartz sans les changements de pile, et continue de tourner des mois une fois chargée.', 'La seule habitude à prendre : ne pas la laisser des semaines dans une boîte fermée. Citizen (Eco-Drive) et Casio (Tough Solar) sont les noms les plus courants.'],
    criteria: ['Mouvement solaire indiqué sur la fiche du vendeur', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['La lumière', 'Rangez-la près d’une fenêtre plutôt que dans un tiroir.'], ['La réserve', 'Une fois chargée, elle tient des mois ; la durée exacte dépend du calibre.'], ['Le verre', 'Comparez-le : il varie beaucoup d’un modèle à l’autre.']],
    guides: [G.moves, G.water, G.budget], match: p => p.movement === 'Solaire',
  },
  {
    slug: 'montres-etanches-200-metres', kicker: '20 bar et plus', title: 'Montres étanches à 200 m',
    h1: 'Étanches à 200 m.<br>Pour l’eau, vraiment.', description: 'Les montres étanches à 20 bar (200 m) ou plus du catalogue : natation et masque-tuba, avec prix datés, taille et verre.',
    intro: ['À 20 bar (200 m), une montre suit la natation et le masque-tuba, selon la notice du fabricant. C’est le niveau des plongeuses et des montres de sport robustes.', 'Ce chiffre ne fait pas une montre de plongée avec bouteilles : celle-ci répond à une norme précise (ISO 6425). Et l’étanchéité vieillit : faites-la contrôler quand la pile est changée ou après un choc.'],
    criteria: ['Étanchéité de 20 bar (200 m) ou plus indiquée sur la fiche du vendeur', 'Commandable au relevé, diamètre et verre renseignés'],
    tips: [['La couronne', 'Si elle est vissée, revissez-la bien avant d’aller dans l’eau.'], ['Pas de chaleur', 'Douche chaude, bain et sauna fatiguent les joints, même à 200 m.'], ['La plongée bouteille', 'Elle demande une montre de plongée certifiée, pas seulement 20 bar.']],
    guides: [G.diver, G.water, G.spec], match: p => (waterMark(p.water) ?? 0) >= 20,
  },
  {
    slug: 'montres-petit-poignet', kicker: '38 mm et moins', title: 'Montres pour petit poignet',
    h1: 'Petit poignet.<br>Montres de 38 mm et moins.', description: 'Les montres de 38 mm et moins du catalogue, pour un poignet fin ou une allure vintage : prix datés, épaisseur, verre et étanchéité.',
    intro: ['Une montre trop grande déborde du poignet et finit dans un tiroir. Sous 38 mm, les proportions redeviennent celles des montres classiques et vintage, pour hommes comme pour femmes.', 'Le diamètre ne suffit pas : regardez aussi l’épaisseur et la longueur de corne à corne, qui décident si la montre « dépasse ». Comparez avec une montre que vous portez déjà.'],
    criteria: ['Diamètre de 38 mm ou moins indiqué sur la fiche du vendeur', 'Commandable au relevé, verre et étanchéité renseignés'],
    tips: [['Le corne à corne', 'S’il dépasse la largeur du poignet, la montre paraît trop grande.'], ['L’épaisseur', 'Une montre fine glisse sous une manche ; au-delà de 12 mm, ça se sent.'], ['Le bracelet', 'Un bracelet trop large alourdit une petite montre.']],
    guides: [G.size, G.gift], match: p => (sizeNumber(p.caseSize) ?? 99) <= 38,
  },
  {
    slug: 'montres-femme', kicker: 'Femme', title: 'Montres femme',
    h1: 'Montres femme.<br>Prix datés, tailles claires.', description: 'Les montres femme du catalogue : prix datés, diamètre, verre, étanchéité et points à vérifier avant d’acheter ou d’offrir.',
    intro: ['Les montres classées « femme » par le vendeur, avec leurs vraies dimensions. Le diamètre va du bijou de 20 mm à la montre de 36 mm et plus : regardez-le avant tout, c’est lui qui donne le style.', 'Pour un cadeau, regardez la montre qu’elle porte déjà, la couleur de ses bijoux (doré ou argenté) et le type de bracelet, plus facile à ajuster en cuir.'],
    criteria: ['Catégorie « Femme » sur la fiche du vendeur', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['Doré ou argenté', 'Fiez-vous aux bijoux qu’elle porte déjà.'], ['Le diamètre', 'Sous 30 mm, c’est un bijou ; à partir de 34 mm, une montre de tous les jours.'], ['Le bracelet', 'Une maille ou un acier se règlent souvent chez un horloger.']],
    guides: [G.gift, G.size, G.colour], match: p => p.category === 'Femme',
  },
  {
    slug: 'chronographes', kicker: 'Chronographe', title: 'Chronographes',
    h1: 'Chronographes.<br>Le look et la fonction.', description: 'Les montres chronographes du catalogue : prix datés, taille, verre, étanchéité, et ce qu’il faut vérifier avant d’acheter.',
    intro: ['Un chronographe ajoute un chronomètre à la montre : deux poussoirs, des compteurs sur le cadran. C’est l’allure des montres de course automobile et d’aviation.', 'Ces fonctions ajoutent de l’épaisseur et de la largeur : vérifiez ces deux cotes, surtout pour un poignet fin. La plupart des chronographes abordables sont à quartz.'],
    criteria: ['« Chrono » dans le nom ou les fonctions indiquées sur la fiche du vendeur', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['L’épaisseur', 'Plus de fonctions, plus d’épaisseur : passez la fiche technique en revue.'], ['La lisibilité', 'Trois compteurs chargent le cadran ; deux restent plus lisibles.'], ['Sous l’eau', 'N’actionnez pas les poussoirs dans l’eau, sauf mention contraire.']],
    guides: [G.size, G.water, G.moves], match: p => has(`${p.title} ${p.functions}`, /chrono/),
  },
  {
    slug: 'montres-marques-suisses', kicker: 'Marques suisses', title: 'Montres de marques suisses',
    h1: 'Marques suisses.<br>Prix datés.', description: 'Les montres des marques suisses du catalogue (Tissot, Hamilton, Mido, Swiss Military…) : prix datés, taille, verre, étanchéité.',
    intro: ['Tissot, Hamilton, Mido, Swiss Military, Squale : ces marques suisses couvrent l’essentiel de l’horlogerie accessible venue de Suisse, du quartz aux automatiques à longue réserve de marche.', 'La mention « Swiss Made » dépend de chaque modèle et obéit à des règles précises : vérifiez-la sur la fiche ou sur le cadran. Nous indiquons ici la marque, pas l’origine de chaque pièce.'],
    criteria: ['Marque suisse : Tissot, Hamilton, Mido, Alpina, Swiss Military, Vulcain, Squale, Nivada Grenchen', 'Commandable au relevé, lien disponible, diamètre, verre et étanchéité renseignés'],
    tips: [['Swiss Made', 'Vérifiez la mention modèle par modèle.'], ['La réserve de marche', 'Certaines automatiques suisses tiennent bien plus longtemps au repos : lisez la fiche.'], ['Le service', 'Renseignez-vous sur la garantie et l’entretien avant d’acheter.']],
    guides: [G.upgrade, G.moves, G.online], match: p => swiss.has(p.brand),
  },
  {
    slug: 'montres-marques-francaises', kicker: 'Marques françaises', title: 'Montres de marques françaises',
    h1: 'Marques françaises.<br>Lip, Kelton, Auricoste.', description: 'Les montres des marques françaises du catalogue (Lip, Kelton, Auricoste) : prix datés, taille, verre, étanchéité.',
    intro: ['Lip, née à Besançon, Kelton et Auricoste : des marques françaises aux styles très différents, de la montre habillée vintage à la plongeuse.', 'Marque française ne veut pas dire fabriquée en France : la provenance des mouvements et des composants varie selon les modèles. Lisez la fiche si ce critère compte pour vous.'],
    criteria: ['Marque française : Lip, Kelton, Auricoste', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['L’origine', 'Marque française ne signifie pas « fabriqué en France ».'], ['Le style', 'Lip joue le vintage, Auricoste la plongée : regardez les formes.'], ['Le verre', 'Souvent minéral bombé chez Lip : beau, mais moins résistant qu’un saphir.']],
    guides: [G.gift, G.size], match: p => french.has(p.brand),
  },
  {
    slug: 'idees-cadeaux-homme-moins-de-200-euros', kicker: 'Cadeau homme', title: 'Idées cadeaux montre homme à moins de 200 €',
    h1: 'Un cadeau pour lui.<br>Moins de 200 €.', description: 'Des idées de montres homme à moins de 200 € : prix datés, taille, verre, étanchéité, et ce qu’il faut savoir avant d’offrir.',
    intro: ['Une montre homme à moins de 200 € : un budget où l’on trouve des G-Shock, des solaires, des automatiques d’entrée de gamme et des chronographes rétro. Les best-sellers du vendeur passent en premier.', 'Avant d’offrir, regardez la montre qu’il porte déjà : sa taille, sa couleur, son bracelet. Et vérifiez les conditions de retour du vendeur, au cas où.'],
    criteria: ['Catégorie « Homme » sur la fiche du vendeur', 'Prix France inférieur ou égal à 200 €, hors livraison', 'Commandable au relevé, diamètre, verre et étanchéité renseignés'],
    tips: [['Sa montre actuelle', 'Offrez une autre couleur ou un autre style, pas la même en double.'], ['La taille', 'Entre 38 et 42 mm, on se trompe rarement.'], ['Le retour', 'Vérifiez les conditions avant de commander.']],
    guides: [G.gift, G.size, G.budget], match: p => p.category === 'Homme' && p.price <= 200,
  },
];

// Pages marques construites depuis le catalogue (/marques/<slug>/), pour les marques sans dossier éditorial.
const brandHub = (brand: string, slug: string, h1: string, intro: string[], tips: [string, string][], guides: {label: string; url: string}[]): Hub => ({
  slug, kicker: brand, title: `Montres ${brand} : prix datés et repères`, h1,
  description: `Les montres ${brand} du catalogue : prix relevés et datés, taille, verre, étanchéité, mouvement, et ce qu’il faut vérifier avant d’acheter.`,
  intro, tips, guides, match: p => p.brand === brand,
  criteria: [`Marque ${brand}`, 'Commandable au relevé, lien disponible, diamètre, verre et étanchéité renseignés'],
});
export const brandHubs: Hub[] = [
  brandHub('Tissot', 'tissot', 'Tissot.<br>Le suisse accessible.', ['Tissot est une marque suisse dont le nom est associé au Locle et à l’année 1853, inscrits sur ses cadrans. Dans ce catalogue, elle commence autour de 375 € avec la PRX à quartz, l’un des best-sellers du vendeur.', 'La gamme va du quartz aux automatiques Powermatic 80, dont Tissot met en avant la longue réserve de marche. Comparez la taille (35 ou 40 mm pour la PRX), le mouvement et le bracelet intégré avant de choisir.'], [['PRX : 35 ou 40 mm', 'Le bracelet intégré élargit visuellement la montre : comparez avec votre poignet.'], ['Quartz ou Powermatic 80', 'Le quartz ne demande rien ; l’automatique tient plusieurs jours au repos selon Tissot.'], ['Le verre', 'Saphir sur une grande partie de la gamme : vérifiez-le sur la fiche.']], [G.moves, G.size, G.upgrade]),
  brandHub('Hamilton', 'hamilton', 'Hamilton.<br>Américaine, faite en Suisse.', ['Hamilton est née aux États-Unis, à Lancaster en Pennsylvanie, à la fin du XIXe siècle, avant de rejoindre l’horlogerie suisse. Elle est connue pour ses montres de terrain Khaki Field et ses Jazzmaster à cœur ouvert.', 'Hamilton annonce jusqu’à 80 heures de réserve de marche pour son calibre à remontage manuel H-50, celui de la Khaki Field Mechanical. Dans ce catalogue, ses prix commencent autour de 440 €.'], [['Khaki ou Jazzmaster', 'Khaki : montre de terrain sobre ; Jazzmaster : plus habillée, souvent à cœur ouvert.'], ['Remontage manuel', 'La Khaki Field Mechanical se remonte à la main : un geste quotidien à aimer.'], ['La taille', 'Les Khaki Field existent en plusieurs diamètres : comparez avec une montre que vous portez déjà.']], [G.auto, G.upgrade, G.size]),
  brandHub('Lip', 'lip', 'Lip.<br>Née à Besançon.', ['Lip est une marque horlogère française née à Besançon en 1867. Elle est connue pour ses modèles au style vintage : Himalaya, Churchill, Rallye, Henriette.', 'Marque française ne veut pas dire fabriquée en France : la provenance des mouvements varie selon les modèles. Dans ce catalogue, Lip va d’environ 100 € à plus de 1 000 €, avec beaucoup de petits formats.'], [['Les petits formats', 'Beaucoup de Lip mesurent moins de 30 mm : des montres-bijoux, à vérifier sur la fiche.'], ['Le verre', 'Souvent minéral, parfois bombé : beau, mais moins résistant aux rayures qu’un saphir.'], ['L’étanchéité', 'Souvent 3 ATM : pas de baignade avec ces modèles.']], [G.gift, G.size, G.crystal]),
  brandHub('Zeppelin', 'zeppelin', 'Zeppelin.<br>L’esprit des dirigeables.', ['Zeppelin est une marque allemande dont les montres s’inspirent de l’aviation et des dirigeables du début du XXe siècle : cadrans clairs, chiffres arabes, verres bombés.', 'Elle propose des quartz et des automatiques à des prix accessibles. Regardez particulièrement le verre et l’étanchéité, qui varient selon les séries.'], [['Le style', 'Cadrans vintage très lisibles : un look habillé et rétro.'], ['Le mouvement', 'Quartz ou automatique selon les séries : lisez la fiche.'], ['L’eau', 'Vérifiez l’étanchéité avant tout usage aquatique.']], [G.moves, G.water, G.colour]),
  brandHub('Timex', 'timex', 'Timex.<br>Le classique américain.', ['Timex est une marque américaine connue pour ses montres simples et abordables, dont les rééditions Marlin et les montres de terrain.', 'Dans ce catalogue, la gamme mêle quartz et automatiques, souvent sur cuir. Le verre est parfois acrylique sur les rééditions : un choix de style à connaître avant d’acheter.'], [['Les rééditions', 'Le verre acrylique fait partie du charme vintage, mais se raye plus vite.'], ['Le bracelet', 'Souvent cuir : réglage facile, mais il craint l’eau.'], ['La taille', 'Plusieurs modèles autour de 38 à 40 mm : un format polyvalent.']], [G.crystal, G.budget, G.gift]),
  brandHub('Squale', 'squale', 'Squale.<br>La plongée, en spécialité.', ['Squale est une marque suisse spécialisée dans les montres de plongée, avec des lunettes tournantes et de fortes étanchéités.', 'Une forte étanchéité ne suffit pas à faire une montre de plongée certifiée : vérifiez la mention et la notice si vous plongez avec bouteilles.'], [['L’étanchéité', 'Vérifiez le niveau exact et la mention de plongée sur la fiche.'], ['La couronne vissée', 'Revissez-la avant d’aller dans l’eau.'], ['La taille', 'Les plongeuses sont souvent larges et épaisses : comparez avec votre poignet.']], [G.diver, G.water, G.size]),
];
