# Orient et comparaison Bambino / Presage

Livraison du 14 novembre 2026, dans la direction graphique existante. Deux nouveaux sujets, chacun en français et en anglais ; aucune nouvelle image générée ni nouvelle référence importée.

## Contenus et parcours

- `/marques/orient/` et `/en/brands/orient/` : histoire officielle, trois directions (Bambino RA-AC0M04Y, Kamasu RA-AA0004E, cœur ouvert RA-AG0002S), choix par usage, points à regarder, photos et tableau.
- `/comparatifs/orient-bambino-ou-seiko-presage/` et `/en/comparisons/orient-bambino-or-seiko-presage/` : cadrans, proportions, bracelet, routine mécanique et budget pour RA-AC0M04Y / SRPB41J1. L'écart de prix est calculé depuis le relevé du catalogue ; il n'est pas écrit en dur dans le texte.
- Liens contextuels vers les guides de proportions, mouvement et étanchéité ; alternatives filtrées Orient automatique/cuir et Seiko Presage/bleu. Les deux filtres retournent des résultats lors du contrôle, sans supposer que toutes les références sont commandables.
- Les index de marques/comparatifs et les recommandations de lecture existantes intègrent les nouveaux sujets. Le comparateur reprend exactement les deux modèles du dossier ; les favoris sont utilisables sur les cartes.
- Les tableaux des dossiers ajoutent cadran et fonctions. Les intitulés restent visibles pendant le défilement horizontal. Les valeurs absentes restent non renseignées. Les libellés anglais des fonctions et de l'unité « mètres » ont été complétés pour les valeurs rencontrées.

## Sources et correspondance

Quatre fiches Tempus ont été relues par `refresh-feature-specs.mjs`, avec vérification du chemin final et de la référence du tableau. Le tableau de la RA-AG0002S complète ses caractéristiques jusque-là peu renseignées ; les trois autres ne changent que de date de contrôle technique. Le différentiel vérifié concerne exclusivement ces quatre références. Aucun prix, statut de commande, destination, identifiant ou visuel n'a changé. Les dates d'offres restent celles du relevé antérieur du même jour.

| Référence | Destination exacte Tempus | Source fabricant complémentaire |
| --- | --- | --- |
| RA-AC0M04Y | `/products/orient-classic-ra-ac0m04y` | [Orient — Classic & Simple Style 38](https://orient-watch.com/en/orient/collection/classic/classic-and-simple-style-38/RA-AC0M04Y/) |
| RA-AA0004E | `/products/1-orient-mako-iii-kamasu-ra-aa0004e19b` | [Orient — Diver Design](https://orient-watch.com/en/orient/collection/sports/diver-design/RA-AA0004E/) |
| RA-AG0002S | `/products/1-orient-bambino-openheart-ra-ag0002s10b` | [Orient — Semi Skeleton](https://orient-watch.com/en/orient/collection/classic/classic-and-simple-style-semi-skeleton/RA-AG0002S/) |
| SRPB41J1 | `/products/seiko-presage-srpb41j1` | [Seiko — Presage SRPB41J1](https://www.seikowatches.com/fr-fr/products/presage/srpb41j1) |

L'histoire 1950 / 1951 / 2017 vient de [la présentation officielle d'Orient](https://orient-watch.com/en/about_orient/). Les réserves de marche et le remontage manuel du comparatif viennent des fiches fabricant exactes : plus de 40 h pour Orient, environ 41 h pour Seiko. Ce sont des annonces documentaires, pas des mesures CADRIN.

Les dimensions du tableau restent celles de Tempus, conformément à la règle éditoriale demandée. En interne, les écarts avec les sources fabricant sont consignés : Bambino 38,5 mm chez Tempus / 38,4 mm chez Orient ; Kamasu 42 mm / 41,8 mm ; épaisseur Presage 11,2 mm / 11,8 mm. Le texte n'utilise pas ces écarts pour promettre un confort supérieur. Le tableau technique Kamasu identifie RA-AA0004E, tandis qu'un paragraphe commercial Tempus évoque RA-AA0003R19B : ce paragraphe n'a pas servi de source.

Les quatre photos existantes ont été ouvertes et comparées aux références de catalogue. Elles viennent de Tempus, avec les sources conservées par identifiant produit. L'autorisation repose sur la déclaration du propriétaire décrite dans `licenses/tempus-media.md`, pas sur une licence supposée des sites fabricants. Aucun fichier fabricant distinct n'est récupéré.

Tous les liens produits actifs passent par `affiliateUrl` et conservent `bg_ref=bDlTL8AyKb`, le chemin exact et `rel=sponsored`. Les statuts indisponibles du relevé restent visibles, notamment pour Presage et cœur ouvert ; aucun bouton ne les présente comme disponibles.

## Vérifications

Candidate isolée `.tmp/orient-release`, puis comparaison d'empreinte des fichiers avec le dépôt avant publication.

- Astro : 0 erreur, 0 avertissement, 0 indication après retrait d'une variable inutilisée du test.
- Contrôle éditorial strict : PASS. 10 dossiers, 20 routes bilingues de dossiers, 18 références photographiques distinctes ; 86 occurrences de sources nommées sur l'ensemble des contenus contrôlés.
- Production : 211 routes publiques, 212 documents HTML ; contrôle de sortie sans erreur, maximum JS initial gzip 13 890 octets ; 224 contrôles d'hébergement réussis.
- Preview : build réussi et 228 contrôles d'hébergement réussis, dont noindex par défaut.
- `orient-qa.mjs` : 20 mises en page (320/390/768/1024/1440 px), 70 liens internes et ancres, quatre audits axe sans violation détectée, quatre routes sans JavaScript, sept contrôles d'interaction. Photos décodées, références/CTA/code affilié, tableaux traduits, écart de prix, favoris persistants, comparaison des deux modèles et filtres d'alternatives contrôlés. Le défilement au clavier conserve la position des intitulés.
- `quality-qa.mjs` : PASS sur les parcours existants, 36 mises en page, comparaison, recherche vide, favoris, menu, clavier, six routes sans JS et repli si le catalogue JSON échoue.
- `qa:i18n` sur la candidate finale : 102 vues, 413 liens, 45 routes sans JavaScript, zéro erreur ni échec.

Captures ouvertes : dossier Seiko public avant intervention, bandeaux photo nouveaux desktop/mobile, tableau anglais desktop, texte Orient mobile et tableau mobile après défilement. La traduction d'unité et la conservation des intitulés ont été corrigées après observation, puis les tests et captures concernés relancés. Ces contrôles ne constituent pas un essai physique des montres, une certification exhaustive d'accessibilité ou une garantie de ventes. Pas de nouveau score Lighthouse annoncé.

## Preuves et lancement

`evidence/orient/qa/` : captures françaises/anglaises à 390 et 1440 px, sections `hero` / `table`, rapport. `evidence/orient/section-mobile-390.png` et `table-scrolled-390.png` : détails ouverts et examinés dans le navigateur connecté. `spec-changes.json` et `spec-refresh.json` : contrôle documentaire. Journaux `evidence/orient-*.log` et rapport anglais `evidence/orient/i18n/report.json`.

Local : `npm run dev -- --port 4321`. Simulation production PowerShell : `$env:SITE_STAGE='production'`, `npm run build`, puis `node scripts/serve-cloudflare.mjs dist-production`.

Longines reste suspendue pour les achats tant que ses destinations ne donnent pas accès aux fiches attendues. L'attribution d'une vraie commission reste à observer chez le partenaire. Ces limites ne sont pas présentées comme résolues par les nouveaux articles.
