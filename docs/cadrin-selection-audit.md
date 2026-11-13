# CADRIN — Sélection, guides illustrés et audit du 13 novembre 2026

## Résultat éditorial

La direction ALLURE reste intacte : bordeaux, ivoire, typographie et lecture calme. L’itération porte sur les choix proposés au lecteur et leurs preuves, sans nouvelle galerie ni fausses photographies.

Treize guides en français et en anglais disposent désormais d’un visuel exact de référence. Dix groupes d’exemples apportent plusieurs alternatives au fil du texte, avec photo Tempus, référence, raison de choisir, caractéristiques disponibles, prix daté hors livraison, état de commande au relevé et lien affilié direct. Le guide budget comporte neuf exemples. Les nouvelles pages sont :

- `/guides/choisir-couleur-cadran/`
- `/guides/g-shock-montre-jeune/`
- `/guides/premiere-montre-haut-de-gamme/`
- `/guides/squelette-coeur-ouvert-tourbillon/`
- `/guides/montre-connectee-gps-bluetooth/`

Les versions anglaises et leurs correspondances sont dans `src/lib/i18n.ts`. Le guide haut de gamme utilise des références concrètes sans assimiler toute montre coûteuse à la haute horlogerie. Le guide mécanisme distingue cœur ouvert, squelette et tourbillon ; aucune référence explicitement vendue comme tourbillon n’a été identifiée dans le relevé Tempus. L’ICE Smart 3.0 025115 figure dans le guide connecté avec le GPS intégré indiqué par Tempus. La GBD-200 est présentée avec la calibration de distance par le GPS du téléphone décrite par Casio, pas comme une montre à GPS autonome.

Sources principales : fiches Tempus exactes dans chaque guide ; [Casio GBD-200](https://www.casio.com/us/watches/gshock/product.GBD-200-1/), [histoire Casio F-91W](https://www.casio.com/us/watches/casio/about/f-91w/), [Breguet, le tourbillon](https://www.breguet.com/fr/le-tourbillon). Les photos sont issues des fiches Tempus, avec l’autorisation du propriétaire documentée dans `licenses/tempus-media.md`. Aucun packshot généré.

## Sélection et données

Le catalogue contient 2 902 références photographiées de 23 marques issues du relevé existant. L’ajout est l’ICE Smart 025115, identifiée sur la fiche Tempus malgré l’absence de SKU dans son flux. Les autres exclusions du flux (variantes multiples, absence de référence ou d’image exploitable, accessoires) sont maintenues.

Filtres : marque, budget, cadran, bracelet, mouvement, catégorie renseignée, dimension maximale, collection best-sellers, fonction et état de commande. Recherche normalisée des références avec ou sans tirets, critères retirables, URL partageable, tri, comparaison persistante de trois modèles et pagination HTML sans JavaScript. La sélection de six analyses conserve son rôle complémentaire et propose aussi le cadran.

Au relevé :

| Donnée exploitable | Références |
| --- | ---: |
| Couleur de cadran explicite | 1 527 |
| Famille de bracelet | 1 404 |
| Dimension renseignée | 745 |
| Table technique acceptée | 746 |
| Présence dans la collection best-seller Tempus | 630 |

Les dimensions composées ne sont pas arbitrairement converties en diamètre pour le filtre numérique. Les modèles sans caractéristique exploitable sont exclus du filtre correspondant, ce que l’interface explique. La collection [best-seller Tempus](https://tempusshop.com/collections/best-seller) fournit une appartenance datée, pas des chiffres de ventes ni un classement inventé.

Les six fiches analysées ont été réorganisées en format, mouvement/fonctions et matériaux. Les valeurs Tempus sont privilégiées conformément à la demande du propriétaire, notamment la largeur Casio de 33,2 mm. Les anciens écarts sont conservés dans `docs/cadrin-source-transition.json`, pas exposés comme notes de développement dans les guides.

L’import technique refuse les tableaux portant une autre référence (exception régionale F-91W explicitement documentée). Seize anciennes entrées non conformes ont été retirées après contrôle. Les cas validés manuellement restent traçables dans `src/data/tempus-spec-overrides.json` : cadran rose NJ0200-50Z depuis le titre et les photos de la fiche Tempus, mouvement quartz F-91W depuis la description Tempus. Aucune couleur n’est inférée automatiquement depuis une photographie.

## Audit visuel et technique

Avant : le catalogue démarrait par ordre alphabétique, les critères cadran/matière/fonction manquaient, les guides étaient surtout textuels et le comparateur donnait peu de détails.

Après : entrées par envie et budget, accès à la collection best-sellers, photos et alternatives au sein des articles, spécifications repliables, comparaison plus détaillée. L’interface conserve ses contrôles sur mobile. Les captures ont permis de repérer et corriger la Tsuyosa rose classée en bleu, et un cache de Markdown qui conservait des cartes anciennes après changement de données. Le digest des guides dépend désormais du catalogue, des exemples et du rendu ; le contrôle du build détecte les valeurs d’exemples périmées.

Les captures sont locales, hors build public :

- Avant : `evidence/selection-audit/before/1-390.png` à `7-390.png`, ainsi que les versions 1440 ; parcours accueil, sélecteur, catalogue, index guides, première montre, fiche, méthode.
- Après : `evidence/selection-audit/after/catalogue-390.png`, `catalogue-1440.png`, les variantes `catalogue-cards-*`, et les quatre guides budget/G-Shock/GPS/mécanisme, en page entière et cadrage des cartes.
- Fenêtres après : **390 × 900** et **1440 × 900** ; les captures de page entière ont une hauteur supérieure à 900. Les images différées sont chargées avant capture. Contrôles de débordement à 320, 390, 768 et 1440 px.
- `budget-390-initial.png` est un essai exploratoire réalisé avec une fenêtre de 375 px malgré son nom ; ne pas l’utiliser comme preuve d’une largeur 390.

Contrôles exécutés :

- Astro : zéro erreur, avertissement ou hint au dernier contrôle.
- Production : 179 pages dont 178 routes publiques et une 404 ; budget JavaScript maximal compressé 5 591 octets après ajout des boutons. Liens internes, affiliation, sitemap et robots contrôlés au build.
- Garde de publication stricte : réussie ; contrôle de correspondance des références et des exemples intégré.
- Hébergement local Cloudflare : 191 contrôles réussis.
- Parcours FR : 82 combinaisons page/largeur, 221 liens, aucune erreur/échec.
- Parcours EN : 70 combinaisons page/largeur, 218 liens, 29 routes sans JavaScript, aucune erreur/échec.
- Catalogue : 10 contextes largeur/langue, 33 assertions d’interaction, deux parcours sans JavaScript, aucune erreur.
- Nouveaux critères et guides : 8 contextes catalogue, 76 assertions, 26 guides FR/EN, deux parcours illustrés sans JavaScript, aucune erreur. Axe WCAG 2.2 AA sur les vues ciblées ; cela ne constitue pas un audit humain exhaustif de conformité.
- La vérification des sorties vers Tempus contrôle les références, le paramètre `bg_ref=bDlTL8AyKb` et `rel=sponsored`. Aucun achat ni crédit de commission réel n’a été testé.

Rapports machine : `evidence/selection-audit/after/report.json`, `site/browser-report.json`, `english/report.json`, `build.txt`, `content-check.txt`, `hosting-check.txt` et `astro-check.txt`.

## Mesures de chargement

Lighthouse 13.6.0, émulation mobile locale, trois passages par page : médianes performance accueil 99, guide première montre 100, catalogue 100 ; accessibilité automatisée 100 sur ces trois pages. CLS 0. LCP médian : 2 260 ms, 761 ms et 913 ms ; TBT catalogue 54,5 ms. Rapports : `evidence/selection-audit/lighthouse/summary.json` et rapports HTML voisins. Ces mesures de laboratoire ne sont pas des Core Web Vitals collectées auprès des visiteurs. Elles ont précédé la dernière harmonisation de deux paragraphes sur les prix et le remplacement des liens d’achat par des boutons.

Le build de prévisualisation a aussi été contrôlé : 183 pages, noindex par défaut, aucun échec ; ses routes de revue supplémentaires ne sont pas publiques en production.

## Verdict

Le site a franchi une étape substantielle de cohérence éditoriale et d’utilité. L’étiquette « S+ » ne serait pas étayée : une partie du catalogue manque de caractéristiques, le stock reste un relevé, les parcours n’ont pas encore été évalués avec des lecteurs représentatifs et aucun essai au poignet n’a été réalisé. Les tests automatiques ne prouvent ni les conversions ni les revenus futurs. Les prochaines améliorations utiles sont l’élargissement des caractéristiques validées, des retours d’utilisateurs sur le choix et la comparaison, puis la mesure réelle des sorties affiliées avec un cadre de confidentialité adapté.

Les mentions légales ont été conservées à la demande du propriétaire. Aucun nouveau service payant, CMS ou base de données. Pas de changement DNS, compte ou routage email.

## Maintenance et lancement

```powershell
cd D:\Affi_montres
$env:PATH = "$PWD\.tmp\node24;" + $env:PATH
npm run dev -- --port 4321
```

La prévisualisation reste noindex par défaut. Pour contrôler la production : définir `$env:SITE_STAGE='production'`, puis `npm run check`, `npm run build`, `npm run launch:check` et `npm run hosting:check`. Ne pas réutiliser un serveur Miniflare démarré avant un nouveau build : son manifeste d’assets doit être rechargé, sinon des nouveaux fichiers CSS peuvent sembler absents. Redémarrer uniquement le serveur de vérification concerné.

Pour rafraîchir les données : `node scripts/import-tempus-catalogue.mjs --refresh`, puis `node scripts/enrich-tempus-catalogue.mjs`. Les tableaux détaillés sont une opération séparée : `node scripts/import-tempus-specifications.mjs --refresh --limit=700`, puis relancer l’enrichissement. Les requêtes sont séquentielles, espacées et s’arrêtent en cas de HTTP 429. Les données absentes ou rejetées ne sont pas inventées. La liste best-sellers est une photographie versionnée ; elle doit faire l’objet d’un nouveau relevé paginé explicite pour changer sa date. Aucun réseau marchand n’est requis durant le build.

Relancer ensuite les contrôles, examiner les différences de prix/photographies et les plafonds des exemples de guides. Les tests bloquent une alternative devenue plus chère que son budget éditorial.


## Publication et complément : boutons d’achat

La version de contenu `1c19978` a été publiée par Cloudflare (build `6293adcf-ee54-446f-a441-1c19cb6d4d60`, succès). Vérification sur le domaine public : 178 routes en 200, index/follow, canonical et sitemap cohérents ; 195 contrôles d’hébergement réussis ; les 76 assertions de sélection et les 26 guides FR/EN passent aussi en ligne. Preuves : `evidence/selection-audit/online-publication.json`, `online/report.json`, `online-hosting.txt`.

À la demande du propriétaire, les liens d’achat sont remplacés par des boutons bordeaux « Acheter chez Tempus » / « Buy at Tempus » sur les fiches, les cartes du catalogue, le comparateur et les alternatives des guides. La destination exacte et le suivi affilié restent identiques. Le bouton conserve la sémantique d’un lien de navigation, avec focus clavier, indication de sortie et zone tactile minimale de 52 px. Les états de commande et les mentions d’affiliation restent visibles. Le HTML sans JavaScript reçoit le même bouton que les cartes interactives.

Contrôles du complément : Astro sans erreur/avertissement/hint, garde de publication, build et 191 contrôles locaux d’hébergement réussis ; 92 assertions de sélection, 26 guides FR/EN, 8 contextes catalogue et deux parcours sans JavaScript ; suite anglaise complète de 70 contextes, 218 liens et 29 routes sans JavaScript. Captures à 390 × 900 et 1440 × 900 ouvertes et inspectées dans `evidence/selection-audit/buttons/`, notamment `montres-par-budget-390-cards.png`, `catalogue-cards-390.png` et `g-shock-montre-jeune-1440-cards.png`. Aucun débordement ni violation Axe signalé sur les vues ciblées.
