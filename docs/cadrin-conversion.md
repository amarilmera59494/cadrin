# CADRIN — Parcours d’achat et prix France, 13 novembre 2026

## Ce qui a changé

Cette itération conserve ALLURE et Astro. Elle rapproche le choix, la photo, le prix et l’achat, sans panier Cadrin, faux avis, rareté inventée, compte à rebours ni remise calculée sans éligibilité.

1. **Accueil — choix guidé et produits accessibles.** Le bouton principal mène à un formulaire budget / mouvement / cadran. Le nombre de résultats est calculé au build depuis le même filtre que le catalogue, puis mis à jour sans requête distante. Les résultats limitent la recherche aux commandes ouvertes au relevé, ce qui inclut éventuellement des précommandes et ne garantit pas un stock physique. Un cas sans résultat explique comment élargir la recherche et permet de réinitialiser. Quatre modèles illustrés présentent des raisons concrètes de choisir : Casio F-91W, G-Shock GA-2100, Citizen Tsuyosa et Orient Bambino. Le contrôle éditorial exige qu’ils soient commandables au relevé. Sans JavaScript, les quatre cartes et le catalogue HTML restent accessibles ; le formulaire interactif est masqué.
2. **Catalogue — accès direct aux résultats.** Les entrées depuis le choix guidé, les raccourcis et les visuels des guides aboutissent à `#catalogue-count`. Le bouton « Afficher les résultats » évite de chercher où commence la liste après les filtres. L’introduction est plus courte ; les limites détaillées restent dans un accordéon natif. Les critères actifs, la comparaison et leurs URL sont conservés.
3. **Fiches — achat rapproché du modèle.** La photo, le prix France et le bouton Tempus sont regroupés avant l’analyse. Sur la Tsuyosa, à 390 × 900, le premier bouton commence à **771 px**, contre **1 109,8 px** avant intervention : il est entièrement visible dans la première fenêtre après chargement. La photo reste entière, centrée et non déformée. Deux alternatives illustrées sont proposées sur chacune des six fiches, avec leurs caractéristiques disponibles, prix datés et liens exacts. La réserve de variante Seiko reste visible.
4. **Guides — comparaison plus nette.** Les cartes conservent leurs photos exactes et leurs boutons bordeaux ; les prix et états de commande sont alignés autant que le contenu le permet. Les liens de budget ouvrent directement les résultats. Les mentions de prix précisent le marché France. Le contenu pédagogique et la transparence d’affiliation restent présents.

Les captures avant intervention sont dans `evidence/conversion/before/`, étapes `01-home`, `02-catalogue`, `03-watch`, `04-guide`, en 390 × 900 et 1440 × 900. Chaque capture initiale a été ouverte. Les captures après sont dans `evidence/conversion/browser/` et `evidence/conversion/after/`, avec les variantes de page entière et `-top`. Les images différées sont chargées avant capture. Les captures des pages entières dépassent naturellement 900 pixels de hauteur.

## Correction des prix : le marché doit être explicite

L’audit a révélé un défaut dans le relevé précédent : contrôler uniquement la devise retournée par `cart.js` ne fixait pas le pays appliqué au flux produits. Depuis le même environnement, la Tsuyosa NJ0150-81E renvoyait 324,42 dans le flux sans pays explicite, contre 299,00 sur la fiche pour la France. La différence a été reproduite sur `.js` et `.json`, puis la fiche française a été ouverte dans le navigateur.

L’import demande désormais **`country=FR&currency=EUR`** sur chaque page du catalogue et sur la vérification de devise. Le snapshot contient `market: { country: 'FR', currency: 'EUR' }` et le contrôle de contenu refuse un marché absent ou différent. Les **2 902 fiches de 24 marques** ont été rafraîchies ; les six analyses utilisent les mêmes nouveaux prix. Les données techniques et les corrections de référence sont ensuite réappliquées par l’enrichissement existant.

Huit contrôles indépendants contre les endpoints produits France/EUR ont confirmé les nouveaux prix : Casio F-91W, GA-2100, Tsuyosa, Bambino, Rainell, Eco-Drive AW0102, Seiko SRPE55K1 et ICE 025115. Preuve : `evidence/conversion/fr-price-proof.json`. Exemple de source : [Tsuyosa pour la France](https://tempusshop.com/products/citizen-tsuyosa-noir-nj0150-81e?country=FR&currency=EUR). Les prix restent des relevés, hors livraison ; un visiteur d’un autre pays peut recevoir d’autres conditions chez Tempus. Aucun rabais WELCOME10 n’est appliqué artificiellement aux prix affichés.

Les conditions [WELCOME10](https://tempusshop.com/pages/code-promo) et [les engagements Tempus](https://tempusshop.com/pages/pourquoi-tempus-shop) ont été relus. Les exclusions du code restent visibles. Les notes de livraison guident vers les frais du panier ; elles ne prétendent pas garantir une livraison gratuite universelle.

## Mesure des clics : préparation, pas collecte activée

Un seul écouteur délégué produit l’événement DOM `affiliate_click` après l’activation d’un bouton d’achat. Il couvre les fiches, cartes, comparaisons, guides, alternatives et accueil, y compris les cartes générées après filtrage. Champs : `reference`, `merchant`, `placement`, `productPath`, `pagePath` et `contentId`. Aucun champ de recherche, URL complète de navigation, email, identifiant utilisateur ou donnée de formulaire n’est transmis. L’événement ne bloque pas la navigation et fonctionne avec Entrée au clavier.

Aucun collecteur réseau, stockage, cookie ni outil tiers n’a été activé. Ce mécanisme prépare une instrumentation cohérente ; **il ne mesure pas encore les visiteurs réels**. Le code BixGrow demeure `bg_ref=bDlTL8AyKb`, tous les liens produits restent `rel=sponsored`, et les conditions de prix/pays ne modifient pas l’attribution. Une commande réelle et le crédit de commission n’ont pas été testés.

## Vérifications

- Astro : zéro erreur, avertissement ou hint.
- Build de production : 178 routes publiques et la 404, contrôle des liens, métadonnées, sitemap, affiliation et fraîcheur des exemples Markdown réussi. Maximum JavaScript compressé : 5 952 octets par page.
- Garde de publication stricte et 191 contrôles locaux d’hébergement réussis. Build de prévisualisation noindex et 195 contrôles de prévisualisation réussis.
- Nouveau parcours : 24 contextes page/largeur/langue, 54 assertions, deux contextes sans JavaScript, aucune erreur. Sont contrôlés les combinaisons de critères, le compteur, l’état vide, la remise à zéro, l’arrivée aux résultats, les boutons et un événement unique par clic clavier.
- Suite française : 82 contextes, 225 liens, aucun échec/erreur.
- Suite anglaise : 70 contextes, 222 liens, 29 routes sans JavaScript, aucun échec/erreur.
- Catalogue : critères combinés, tri, comparaison persistante, navigation dans l’historique et pagination sans JavaScript vérifiés avec les données mises à jour.
- Sélecteur de six modèles : quatre largeurs, budgets, référence, état vide, comparaison, passage marchand et absence de JavaScript vérifiés.
- Axe ciblé WCAG 2.2 AA sans violation dans les vues vérifiées. Cela ne remplace pas un audit humain exhaustif.

Rapports : `evidence/conversion/browser/report.json`, `fr/browser-report.json`, `en/report.json`, `catalogue/report.json`, `check.txt`, `build.txt`, `content.txt`, `hosting.txt`.

## Performances locales

Lighthouse 13.6.0, mobile simulé 412 × 823, réseau et processeur ralentis, trois passages par page sur le build servi localement. Médianes :

| Page | Performance | Accessibilité automatisée | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accueil | 98 | 100 | 2,34 s | 0 | 0 ms |
| Guide | 100 | 100 | 0,76 s | 0 | 0 ms |
| Catalogue | 100 | 100 | 0,91 s | 0 | 57 ms |

Preuve : `evidence/conversion/lighthouse/summary.json`, neuf rapports HTML/JSON. Ces mesures de laboratoire locales ne sont ni des Core Web Vitals de visiteurs réels ni un score garanti sur le domaine public.

## Limites et suite utile

L’amélioration du parcours est observée ; un gain de conversion ne l’est pas encore. Il faut un trafic réel, une attribution confirmée et des périodes comparables pour juger les ventes. Le niveau « S+ » ne constitue donc pas une certification attribuable par les tests techniques.

Les prochaines décisions doivent partir des chiffres : proportion d’utilisateurs qui trouvent des résultats, clics Tempus par emplacement, achats attribués, commission et produits réellement commandés. Changer une seule hypothèse importante à la fois permet d’interpréter ces résultats. Les caractéristiques manquantes du catalogue ne sont toujours pas inventées ; les données brutes ne valent pas un essai physique.

Aucun changement DNS, domaine, email, mentions légales ou compte externe. Les builds locaux restent noindex par défaut ; seule la production est indexable.

```powershell
cd D:\Affi_montres
$env:PATH = "$PWD\.tmp\node24;" + $env:PATH
npm run dev -- --port 4321
```

Maintenance : `node scripts/import-tempus-catalogue.mjs --refresh`, puis `node scripts/enrich-tempus-catalogue.mjs`, contrôles et examen des différences. Toujours préciser le marché France/EUR pour comparer les prix avec les snapshots. Après un nouveau build, redémarrer le serveur Miniflare de vérification pour recharger son manifeste d’assets.
