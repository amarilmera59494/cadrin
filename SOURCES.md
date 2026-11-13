# Sources et licences conservées

Ce document conserve le registre initial du 12 novembre 2026. Les données et décisions actuelles de Cadrin, dont le domaine cadrin.fr et le catalogue réduit à trois références, sont dans [cadrin-content.md](docs/cadrin-content.md). Les mentions ci-dessous de maquettes, de six références et de cadrin.com décrivent l’état historique, pas la V1.

# Sources, licences et statut des contenus

Vérifications du **12 novembre 2026**. Les fiches constructeur renseignent les caractéristiques ; elles ne donnent pas les droits de réutilisation de leurs photographies.

## Photographies

Aucun kit Tempus Shop ni visuel produit autorisé n'a été fourni. Les quatre pages ci-dessous ont été consultées dans un navigateur et portent « Free to use under the Unsplash License ». La [licence Unsplash](https://unsplash.com/license) autorise la réutilisation et l'adaptation, y compris commerciale, sous ses conditions. Elle ne remplace pas les éventuels droits de marque ou des personnes. Les photographies servent à illustrer des sujets éditoriaux, sans suggérer de partenariat ni d'approbation.

| Fichier | Auteur et source | Utilisation |
| --- | --- | --- |
| `leather-*` | [Fabian Heimann — 4R_WEmhx8og](https://unsplash.com/photos/round-silver-colored-fossil-chronograph-watch-at-922-with-brown-leather-band-4R_WEmhx8og) ; CDN `photo-1542496658-e33a6d0d50f6` | REVUE, guide REVUE, diptyque ALLURE, galerie |
| `sleeve-*` | [Renzo Watches — 6N-i1CrQkzA](https://unsplash.com/photos/person-wearing-black-leather-strap-analog-watch-6N-i1CrQkzA) ; CDN `photo-1600071177478-88758260617d` | ALLURE et guide, proportions REVUE, galerie |
| `wrist-*` | [Alex Boscarato — U6X1le3OcpY](https://unsplash.com/photos/person-wearing-silver-round-chronograph-watch-U6X1le3OcpY) ; CDN `photo-1615029530759-79e0ca82371a` | Lookbook ALLURE, niveaux de gris MESURE |
| `evidence/originals/mirror.jpg` | [Pat Taylor — 12V36G17IbQ](https://unsplash.com/photos/round-silver-colored-chronograph-watch-with-brown-leather-strap-12V36G17IbQ) ; CDN `photo-1524805444758-089113d48a6d` | Étudiée puis écartée ; absente de `public/` |

Les légendes créditent les auteurs, indiquent « Photographie d’ambiance » et « Hors sélection ». **Ces photos ne représentent aucune des six références.** Originaux dans `evidence/originals/`, hors sortie publique. Tailles 480/900/1600 px, AVIF/WebP, `srcset`/`sizes`, dimensions HTML, image principale prioritaire et images hors écran différées. Aucune génération IA, invention de cadran ou modification de logo. Les recadrages et le passage en niveaux de gris sont en CSS.

Le cercle MESURE est un schéma abstrait de dimension, explicitement hors échelle, pas une photographie de Seiko. Favicon et image Open Graph : créations typographiques du projet générées depuis le nom centralisé.

## Polices

Fontsource 5.3.0, auto-hébergées. Copies des licences **SIL Open Font License 1.1** dans `licenses/`.

- DM Sans : [googlefonts/dm-fonts](https://github.com/googlefonts/dm-fonts), texte commun et titres MESURE.
- Bodoni Moda : [indestructible-type/Bodoni](https://github.com/indestructible-type/Bodoni), titres REVUE romains et italiques.
- Barlow Condensed : [jpt/barlow](https://github.com/jpt/barlow), titres ALLURE, 500/600.
- IBM Plex Mono : [IBM/plex](https://github.com/IBM/plex), données MESURE, 400.

Deux familles par direction, imports limités aux pages concernées. La galerie utilise des approximations système dans ses miniatures, sans charger tous les jeux de polices.

## Six références partagées

`src/data/products.ts` conserve référence, source, date, caractéristiques, interprétation, limites, `validation`, `image`, `imageStatus`, `price` et `stock`.

| Référence | Caractéristiques utilisées | Source primaire |
| --- | --- | --- |
| Seiko SRPE55 | Automatique 4R36 ; Ø 40 mm ; 44,6 mm corne à corne ; épaisseur 11,5 mm ; acier ; Hardlex ; réserve annoncée environ 41 h | [Seiko France](https://www.seikowatches.com/fr-fr/products/5sports/srpe55) |
| Seiko SRPG35 | Automatique 4R36 ; Ø 39,4 mm ; 48,1 mm corne à corne ; acier ; nylon ; réserve annoncée environ 41 h | [Seiko France](https://www.seikowatches.com/fr-fr/products/5sports/srpg35) |
| Citizen BM8180-03E | Eco-Drive solaire ; 37 mm ; acier ; nylon | [Citizen US](https://www.citizenwatch.com/us/en/product/BM8180-03E) |
| Citizen AW1231-58E | Eco-Drive / quartz solaire ; Ø 40 mm ; acier et bracelet acier | [Citizen Europe Allemagne](https://de.citizenwatch.eu/de/p/aw1231-58e/) |
| Casio F-91W-1 | Quartz à pile ; 38,2 × 35,2 × 8,5 mm ; résine | [Casio international](https://www.casio.com/intl/watches/casio/product.F-91W-1/) |
| Casio DW-5600UE-1 | Quartz à pile ; 48,9 × 42,8 × 13,4 mm ; résine | [Casio Japon, variante régionale 1JF](https://www.casio.com/jp/watches/gshock/product.DW-5600UE-1/) |

Les pages Casio ont été lues dans le navigateur après refus de certains accès HTTP directs. La fiche BM8180 indique E100 dans son descriptif et E101 dans ses détails : **calibre omis**. Aucune disponibilité française déduite d'une fiche régionale étrangère.

Prix, stocks, promotions, scores, essais et disponibilité Tempus Shop absents. `price`, `stock`, `image` valent `null`, `imageStatus` vaut `rights-pending`. `manufacturer-specs-checked` ne signifie pas « prêt à publier » : seules les caractéristiques retenues ont été contrôlées. Les usages bureau/quotidien/week-end et les notes sont des interprétations éditoriales signalées.

## Texte et affiliation

Guide original de maquette, synthèse documentaire partagée via Content Collections. Aucun expert ni essai fictif ; auteur et relecture à attribuer avant publication. Les fourchettes 100–200, 200–400 et 400–600 € sont des budgets de recherche, pas des prix supposés pour les modèles.

Tempus Shop est envisagé selon le brief ; compte non confirmé et kit non reçu. Conditions commerciales internes non affichées aux lecteurs. Aucun lien affilié ni identifiant inventé. Ordre éditorial indépendant de la commission, registre multi-marchand, événements de clic locaux sans collecte. Mention d'affiliation près des recommandations et explication détaillée en bas des accueils.

Les concepts sont identifiés comme maquettes et en noindex. `npm run deploy` refuse la publication et `PUBLIC_RELEASE=1` bloque le build. Ces gardes ne constituent pas une protection d'accès et ne peuvent empêcher un téléversement manuel par un opérateur.

## Documentation technique consultée

- [Astro — Why Astro](https://docs.astro.build/en/concepts/why-astro/), [prérendu](https://docs.astro.build/en/guides/on-demand-rendering/), [Content Collections](https://docs.astro.build/en/guides/content-collections/). Stable installée : 7.4.11 ; import actuel `astro/zod`.
- [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/), [CLI cf pour agents](https://developers.cloudflare.com/cf/agents/index.md), [build/déploiement](https://developers.cloudflare.com/cf/projects/), [configuration](https://developers.cloudflare.com/cf/projects/cloudflare-config/). Aide et schéma installés consultés ; `cf deploy dist --dry-run --provision=false` réellement exécuté. Aucun SSR nécessaire.
- [Google — AI features](https://developers.google.com/search/docs/appearance/ai-features) : pas de balisage spécial ni garantie de visibilité. Texte consulté conservé dans `evidence/google-ai.txt`.
- [OpenAI — Crawlers](https://developers.openai.com/api/docs/bots) : OAI-SearchBot pour la recherche, GPTBot pour l'entraînement ; politiques indépendantes. Texte dans `evidence/openai-bots.txt`.
- [Web Vitals](https://web.dev/articles/vitals) : objectifs terrain au p75, LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms. Texte dans `evidence/vitals.txt`.

## Manquants avant production

Validation du nom et de la propriété de cadrin.com ; direction retenue ; auteur/relecture ; photographies produit et droits du kit ; compte partenaire et destinations affiliées ; prix, variantes et disponibilité ; mentions légales adaptées ; choix des politiques robots et de l'accès privé. Aucun élément manquant n'est présenté comme acquis.
