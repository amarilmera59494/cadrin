# CADRIN — catalogue Tempus et affiliation

## Périmètre livré

Le catalogue public a été parcouru intégralement le 13 novembre 2026 : 3 029 produits, 13 pages de données marchandes. L'explorateur retient 2 901 fiches de montres, réparties sur 23 marques et 61 pages par langue. Les 128 exclusions comprennent 84 produits hors montres, 43 montres sans SKU et une fiche sans prix positif exploitable. Un classement interne `upsell` ne signifie pas qu'un produit est un accessoire : la Casio F-91W, notamment, reste incluse.

Le catalogue marchand et les six analyses CADRIN ont des statuts distincts. Le premier reprend des données Tempus datées, sans prétendre à 2 901 vérifications fabricant ou essais. Les six analyses conservent leurs sources constructeur, leurs limites de variante et leurs caractéristiques documentées. Les anciennes fiches AW1231-58E et SRPE55 restent archivées, exclues de production ; aucun remplacement visuel par une autre référence.

## Affiliation centralisée

- Lien général fourni : https://tempusshop.com/pierrenarguet
- Identifiant public : `bg_ref=bDlTL8AyKb`.
- Origine vérifiée : redirection HTTP 301 du lien général, confirmée ensuite par les deux liens produits GAC-2500-9A et GAC-2500-7A fournis par le propriétaire.
- Construction : `affiliateUrl()` dans `src/data/affiliation.ts`, à partir de la destination produit exacte. La fonction conserve les autres paramètres et l'ancre, remplace un ancien `bg_ref` et refuse un domaine extérieur.
- Les boutons, images cliquables, comparaisons et citations de fiches produits Tempus utilisent ce mécanisme avec `rel="sponsored"`. Les citations marchandes signalent aussi leur affiliation. Les liens vers les fabricants et les politiques marchandes ne sont pas transformés.
- `scripts/check-build.mjs` bloque le build si un lien produit Tempus dans le HTML généré n'a pas l'unique identifiant attendu et le balisage sponsorisé.
- Les deux liens fournis par le propriétaire font partie des assertions de `scripts/check-tempus-catalogue.mjs`.

Documentation du fournisseur : https://docs.bixgrow.com/affiliate-links/manage-affiliate-links/custom-link et https://docs.bixgrow.com/affiliate-links/how-do-affiliate-links-work.

Les destinations des six analyses et les deux exemples fournis ont répondu HTTP 200 en conservant le paramètre. Aucune commande ni commission réelle n'a été simulée ou revendiquée. L'attribution finale dépend du dispositif marchand et de ses conditions.

## Photos et provenance

Autorisation de réutilisation déclarée explicitement par le propriétaire le 13 novembre 2026, consignée dans `licenses/tempus-media.md`. Cette déclaration couvre les visuels diffusés par Tempus, y compris Seiko. Les captures privées de l'affilié restent exclues de Git.

2 901 vignettes marchandes locales en WebP, environ 36,3 Mo au total ; seules les images des cartes consultées sont chargées. Chaque fichier conserve son association au produit marchand dans `src/data/tempus-catalogue.json`. Les six visuels éditoriaux disposent d'un registre séparé, de crédits et d'alternatives textuelles FR/EN. Aucune génération, aucun faux packshot, aucune modification de cadran ou de bracelet.

La photo associée par Tempus à la SRPE55K1 s'appelle SBSA045. Le crédit et le texte exposent cette limite ; la variante livrée et la langue du calendrier demandent confirmation. Les associations photo/SKU du catalogue étendu restent celles fournies par Tempus, sans certification indépendante de chaque variante.

## Prix, filtres et contenus

Prix datés en EUR hors livraison, sans réduction calculée ni stock physique déduit d'une commande possible. La devise EUR et les prix de contrôle ont été rapprochés de `cart.js`, de fiches produit `.js` et du HTML marchand. Les prix de plusieurs montres ont changé pendant l'itération : les six analyses et les tranches du guide ont été actualisées. Les automatiques analysées sont désormais rapprochées sous 350 €, la Rainell sous 400 € au relevé.

Filtres par texte, marque, budget, mouvement explicitement indiqué, catégorie explicitement indiquée et indication de commande ; tri des prix, comparaison de trois modèles, URL partageable, navigation avant/arrière. Les données inconnues ne sont pas devinées. Les mentions de précommande ou de commande ne sont pas interprétées comme du stock. Le catalogue fonctionne sans JavaScript par pagination statique. En cas d'échec du chargement des données, les cartes HTML restent disponibles.

Les huit guides existants sont illustrés par des modèles réels et reliés à l'explorateur. Aucune création massive d'articles. La validation éditoriale correspond à un contrôle documentaire des textes FR/EN et des sources ; le champ de contrôle ne désigne pas un relecteur humain inventé et ne constitue pas un essai produit. Les contrôles de droits, photos, sources, liens et publication restent actifs. Seuls les contenus explicitement archivés sont exclus de la condition de publication globale.

## Première commande

Tempus annonce publiquement **WELCOME10**, −10 % sur une première commande. La page https://tempusshop.com/pages/code-promo exclut les nouveautés et les articles déjà remisés, et indique le non-cumul. Aucun minimum ni délai d'expiration n'est inventé ; l'éligibilité et le total doivent être vérifiés chez le marchand. Il ne s'agit pas d'un code exclusif CADRIN. Aucun essai au paiement n'a été effectué.

Encart FR/EN sur l'accueil, près des liens marchands des six analyses et en fin de catalogue. Copie du code au clavier et à la souris, message de repli si le presse-papiers est refusé, code lisible sans JavaScript. Les explications détaillées sur les autres engagements Tempus restent dans le composant existant, avec leurs sources et limites.

## Maintenance et lancement

Avec Node compatible avec `package.json` :

```powershell
npm run dev
# Prévisualisation locale, noindex par défaut.

node scripts/import-tempus-catalogue.mjs --refresh
# Opération explicite : rafraîchir le relevé public et les vignettes.
# Revoir ensuite les prix et exemples éditoriaux avant publication.

npm run check
npm run content:check
npm run build
$env:SITE_STAGE='production'
npm run build
npm run launch:check
npm run hosting:check
node scripts/check-production.mjs
node scripts/serve-cloudflare.mjs dist-production
```

L'import n'est jamais exécuté pendant un build ni une visite. Il conserve les sources et refuse une pagination incomplète ou des identifiants dupliqués. Les nouveaux produits à plusieurs variantes demandent une prise en charge explicite. Aucun service payant, compte, CMS, base de données ou collecte analytique n'a été ajouté.

Les preuves locales sont dans `evidence/tempus-catalogue/` : import, destinations, contrôles, captures avant/après, audits navigateur, offre et Lighthouse. Les mesures Lighthouse sont des mesures de laboratoire locales, pas des données d'utilisateurs réels ni une mesure d'INP en production.

## Vérifications locales de cette livraison

- Astro : 96 fichiers contrôlés, aucune erreur, aucun avertissement ni suggestion.
- Build de production : 168 routes et une 404. Le build de prévisualisation reste noindex. Les archives ne sont pas publiées.
- Hébergement Cloudflare local : 181 contrôles réussis, dont en-têtes, chemins sensibles, redirections, HEAD et rejet POST.
- Parcours FR : 72 vérifications de largeur/page ; parcours EN : 60, sans erreur JavaScript ni violation Axe détectée dans les audits exécutés. Les deux suites testent aussi les liens internes, le clavier, la navigation et l’usage sans JavaScript.
- Catalogue : 10 vérifications FR/EN à 320, 390, 768, 1024 et 1440 px ; 33 assertions d’interaction, pagination sans JavaScript dans les deux langues, repli en cas d’échec du JSON. Les changements de langue conservent les filtres modifiés, la page et les comparaisons.
- Offre : quatre contextes FR/EN desktop/mobile ; copie clavier, presse-papiers refusé et code accessible sans JavaScript. Aucun test de commande ou paiement.
- Sélecteur de six modèles : 320, 390, 768 et 1440 px, budget actualisé, filtres, trois favoris maximum, retour arrière et comparaison sans JavaScript.
- Les captures avant/après ont été ouvertes. Corrections : filtres avancés repliables dans le catalogue, espace réservé pendant leur chargement, texte des cartes mobile sur toute la largeur sous la photo et prix à jour.

Captures principales : `evidence/tempus-catalogue/after/accueil-1440.png`, `catalogue-1440.png`, `catalogue-390.png`, `guide-390.png`, `fiche-1440.png` et `selecteur-390-cards.png`. Les dimensions des fenêtres sont 1440 × 900 et 390 × 900 ; les images de page entière dépassent naturellement la hauteur de la fenêtre.

Lighthouse 13.6.0, mobile local, trois passages par page après les dernières modifications : médianes performance accueil 99, guide 100, catalogue 100 ; accessibilité 100 sur ces trois pages ; CLS 0. LCP médian respectivement 2 113 ms, 1 662 ms et 915 ms. Ce sont les mesures du poste de test, pas une promesse de vitesse identique sur tous les appareils et réseaux. Rapport complet : `evidence/tempus-catalogue/lighthouse/summary.json`.

## Publication et vérification du site public

Publié le 13 novembre 2026 sur https://cadrin.fr depuis le commit `cb9c23a28f81df647931586115caa4f7cfc961ae`. Build Cloudflare GitHub `3bacf9ea-0d79-4c80-af9b-935ebe47722b` terminé avec succès ; déclencheur renommé « CADRIN main production », environnement SITE_STAGE=production. Les commandes conservent les contrôles de contenu, build et hébergement.

Vérifications après déploiement :

- 168 routes publiques répondent en HTTP 200, avec index/follow, canonical exact et sans en-tête noindex. Sitemap vérifié contre la liste des routes.
- 11 648 occurrences de liens produits Tempus dans les pages HTML portent exactement le code `bDlTL8AyKb` et rel=sponsored (occurrences répétées entre pages et langues, pas autant de produits distincts).
- 185 contrôles d'hébergement réussis sur le domaine public : HTTPS, redirections www/HTTP, HSTS, en-têtes, chemins sensibles, 404 et cache des assets.
- Catalogue public : 10 contextes de largeur/langue, 33 assertions d'interaction et deux parcours sans JavaScript ; aucune erreur rapportée. Les photos chargent dans les contextes inspectés.
- Captures du site public ouvertes et inspectées à 1440 × 900 et 390 × 900 : `evidence/tempus-catalogue/online/public-gac-1440.png` et `public-gac-390.png`. Le navigateur anglophone présente la suggestion de langue prévue, refermable.

Preuves : `evidence/tempus-catalogue/online-publication.json`, `evidence/tempus-catalogue/online/report.json` et `evidence/deployment/hosting-cadrin.fr.json`. La suppression de noindex autorise l'indexation ; elle ne démontre pas encore l'indexation effective par Google.

Aucune commande marchande n'a été passée. La remontée d'une commission réelle et l'application effective de WELCOME10 au paiement ne sont pas vérifiées. Le relevé catalogue reste daté ; les limites de références, de variantes et de disponibilité sont conservées dans les pages. Les réseaux sociaux n'ont pas encore été configurés ni alimentés.
