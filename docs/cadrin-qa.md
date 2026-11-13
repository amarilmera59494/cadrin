# Vérification de la V1 Cadrin

Ce rapport conserve les mesures de la première livraison. Pour la sélection actuelle, consulter [les contrôles de l’itération 03](cadrin-iteration-03.md).

Session du 13 novembre 2026 (heure de Paris). Contrôles sur le build statique local, servi par le Miniflare déjà installé, à `http://127.0.0.1:4323`. Aucun déploiement. Les horodatages JSON sont en UTC.

## Résultat

- `npm run check` : 52 fichiers, aucune erreur, aucun avertissement, aucun hint.
- `npm run content:check` : aucune erreur structurelle ; les prérequis éditoriaux restent ouverts.
- `npm run build` : 10 pages de preview, dont la 404 ; génération et contrôle du build réussis.
- Build avec `SITE_STAGE=production` : 5 pages, dont la 404. Les cinq entrées éditoriales en brouillon sont exclues, ainsi que tous les concepts archivés. Aucun lien orphelin vers ces brouillons.
- JavaScript initial propre au site : maximum mesuré de 995 octets gzip en preview, sous le budget de 60 Ko. Pas de framework client hydraté.
- `npm run cloudflare:check` : dry-run réussi, 53 fichiers lus ; aucune ressource provisionnée ni publication.
- `node scripts/check-production.mjs` : 13 contrôles réussis sur le routage, les canoniques, l’indexation, les exclusions et le sitemap. Les URLs absentes donnent bien HTTP 404 ; `/guides` redirige vers `/guides/` avec HTTP 307.
- `npm run launch:check` : échec attendu, car les conditions de publication ne sont pas remplies. Ce résultat ne doit pas être masqué pour obtenir un feu vert artificiel.

Les commandes reproductibles et la particularité du binaire Node local sont documentées dans [cadrin-launch.md](cadrin-launch.md).

## Parcours et accessibilité

`npm run qa` utilise Chromium 157.0.8103.78 et Playwright 1.65.0. Rapport complet : [browser-report.json](../evidence/cadrin/final/browser-report.json).

- 34 couples page/largeur contrôlés : les neuf routes de contenu à 1440 et 390 px ; les quatre pages principales aussi à 320, 360, 768 et 1920 px. Aucun débordement de page ni image cassée, un seul H1 par page.
- 18 audits axe sur desktop et mobile : aucune violation détectée pour les règles WCAG A/AA utilisées. Ce contrôle automatisé ne vaut pas certification d’accessibilité.
- 28 liens ou ancres internes vérifiés.
- Menu mobile : bouton réel, état accessible, navigation au clavier, fermeture par Échap et retour du focus au bouton.
- Lien d’évitement, ancres du sommaire, défilement clavier du tableau et focus visibles contrôlés.
- Filtres : automatique, quartz, usage, dimensions connues, combinaison sans résultat, compteur, réinitialisation et liens contenant les paramètres. Une dimension inconnue n’entre pas dans un filtre de dimensions vérifiées.
- Neuf routes examinées sans JavaScript : contenu et navigation accessibles ; filtres masqués et toutes les montres visibles. Le comparateur natif s’ouvre aussi avec Entrée sans JavaScript, vérifié séparément dans le navigateur.
- Quatre pages principales à zoom CSS 200 % dans une fenêtre de 1280 px : aucun débordement horizontal. Il s’agit d’une simulation CSS du grossissement, pas d’un essai matériel de tous les modes de zoom navigateur.
- Préférence de mouvement réduit contrôlée.
- Aucun échec de la suite finale, aucune erreur console propre aux pages Cadrin durant cette suite.

Le parcours a également été effectué dans le navigateur disponible : accueil → index des sélections → sélection → fiche Casio → Tempus Shop. La destination a ouvert la référence **F-91W-1YEG**, avec redirection de langue du marchand vers `https://tempusshop.com/en/products/casio-vintage-f-91w-1yeg`. Aucun achat ni formulaire envoyé. Les scripts tiers de Tempus ne font pas partie du score ou du contrôle console de Cadrin.

Le lien marchand vérifié est ordinaire, sans affiliation active. Le contrôle vérifie son hôte HTTPS, sa référence et ses attributs. L’événement local `affiliate_click` ne transmet rien à un service externe.

## Mesures Lighthouse mobiles

Lighthouse 13.6.0, trois passages successifs par page sur le build compilé, profil mobile simulé 412 × 823, CPU ×4, RTT 150 ms et débit 1638,4 kbit/s. Pas d’autre audit lourd exécuté simultanément. Les paramètres complets et chaque mesure figurent dans [summary.json](../evidence/cadrin/lighthouse/summary.json), avec six rapports HTML et JSON dans le même dossier.

| Page | Performance, médiane | Accessibilité, médiane | LCP médian | CLS médian | TBT médian |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accueil | 99/100 | 100/100 | 2 109,59 ms | 0 | 0 ms |
| Guide première montre | 100/100 | 100/100 | 757,35 ms | 0 | 0 ms |

Passages accueil : 99, 99, 99. Passages guide : 100, 100, 100. Le premier passage accueil mesure 10,20 ms de TBT ; les deux suivants 0 ms. Ce sont des mesures de laboratoire locales, pas des données terrain ni une garantie de performance après hébergement.

## Captures et corrections visuelles

Les huit captures pleine page ci-dessous et leurs huit variantes `-top.png` ont été produites à partir des fenêtres demandées, puis ouvertes pour inspection. Les variantes `-top` montrent exactement le premier écran 1440 × 1000 ou 390 × 844 ; les captures pleine page conservent la largeur et montrent tout le contenu.

| Page | Desktop | Mobile |
| --- | --- | --- |
| Accueil | [1440](../evidence/cadrin/final/accueil-1440.png) | [390](../evidence/cadrin/final/accueil-390.png) |
| Sélection | [1440](../evidence/cadrin/final/selections-trois-montres-au-quotidien-1440.png) | [390](../evidence/cadrin/final/selections-trois-montres-au-quotidien-390.png) |
| Guide | [1440](../evidence/cadrin/final/guides-choisir-premiere-montre-1440.png) | [390](../evidence/cadrin/final/guides-choisir-premiere-montre-390.png) |
| Fiche Casio | [1440](../evidence/cadrin/final/montres-casio-f91w-1440.png) | [390](../evidence/cadrin/final/montres-casio-f91w-390.png) |

[Index local des captures](../evidence/cadrin/final/captures.html). Il ne fait pas partie du site public.

Corrections issues des observations : titre d’accueil dimensionné sur son conteneur pour le grossissement à 200 %, préchargement des trois polices nécessaires pour supprimer le déplacement initial, sommaire mobile en deux colonnes, espacement des liens de fin de guide, panneau marchand remonté avant les caractéristiques sur mobile. Les grandes capitales restent réservées aux moments forts ; le guide utilise une typographie de lecture plus calme.

Les photographies d’ambiance ne représentent pas les références de la sélection. Les fiches montrent explicitement l’absence de photo produit autorisée. Ces emplacements sont un manque d’asset identifié, pas un défaut de chargement.

## Archives et limites

Les pages ALLURE d’origine ont été ouvertes avant modification et les captures initiales sont conservées dans `evidence/cadrin-before-*.png`. Après archivage, `/concepts/allure/` a été rouvert sur le serveur séparé 4322 : HTTP 200, trois polices WOFF2 chargées avec HTTP 200, aucune réponse en erreur observée. L’autorisation Vite de lecture du `node_modules` parent a été corrigée dans la configuration des archives.

Pas d’essai sur Safari, Firefox, lecteur d’écran ou téléphone physique pendant cette session. Aucun score SEO ou de conversion n’est revendiqué. Aucun prix, stock, avis, auteur, essai au poignet ou contrat d’affiliation n’a été inventé. Les sources, divergences entre références et conditions de publication sont détaillées dans [cadrin-content.md](cadrin-content.md) et [cadrin-launch.md](cadrin-launch.md).

La V1 est utilisable en prévisualisation. Elle reste non publiable jusqu’à obtention des photographies autorisées, relecture et attribution éditoriales, informations légales et contact vérifiés, puis activation éventuelle de vrais liens affiliés Tempus.
