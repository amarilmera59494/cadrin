# Comparatif G-Shock et guide étanchéité — 14 novembre 2026

## Livraison

- Comparatif FR/EN des références exactes GA-2100-1A1ER et GA-2100-1AER : photos autorisées Tempus, contraste du cadran, dimensions communes, fonctions, choix selon les préférences, liens produit affiliés.
- Guide FR/EN sur les marquages 3/5/10/20 bar ou ATM, les limites d’usage, le bracelet et l’entretien. Trois exemples illustrés : Orient RA-AC0M04Y, Citizen NJ0150-81E, GA-2100-1A1ER.
- Filtre catalogue `water=5|10|20`, cumulable avec les autres critères. Il lit uniquement les marquages bar/ATM explicites, y compris dans les parenthèses d’une indication en mètres. Pas de conversion des mètres seuls, pas de déduction d’une aptitude sportive.
- Au relevé : 545 valeurs exploitables sur 2 902 fiches ; 466 résultats à partir de 5, 232 à partir de 10, 80 à partir de 20. Les valeurs absentes ou ambiguës restent exclues.
- Navigation depuis les guides et le catalogue, sommaires, photos, favoris, comparaison et CTA existants conservés. Paramètre d’affiliation central inchangé : `bg_ref=bDlTL8AyKb`.
- Ouverture des critères avancés à l’arrivée sur un lien filtré. Libellés courts et champs alignés après examen mobile. Espaces insécables pour la ponctuation du nouveau guide français.

## Sources et limites

Les deux pages produit Tempus ont été ouvertes dans le navigateur le 14 novembre : titre, référence, destination et caractéristiques visibles concordent. Les pages Casio GA-2100-1A et GA-2100-1A1 documentent les caractéristiques communes. Le texte générique Tempus de la 1AER mentionne parfois la 1A1ER : il n’a pas été repris comme description de la variante. Le contraste est une lecture des photos, pas une mesure en faible lumière.

Sources primaires citées dans les articles :

- https://www.casio.com/fr/watches/gshock/product.GA-2100-1A/
- https://www.casio.com/fr/watches/gshock/product.GA-2100-1A1/
- https://www.casio.com/europe/support/watches/faq/article/00/05/15/61/
- https://www.citizenwatch-global.com/support/maintenance/wr.html
- https://www.seikowatches.com/fr-fr/customerservice/faq/care-maintenance-2

Photos locales déjà présentes et documentées par `licenses/tempus-media.md`. Aucun packshot généré, nouvel avis, essai physique ou promesse de stock. Les prix et commandes affichés proviennent du relevé catalogue daté, sans nouvel horodatage artificiel des 2 902 fiches.

## Vérifications

Candidate préparée dans `.tmp/editorial-release` à partir du HEAD `5508257` et des seuls fichiers de cette itération. Le commit Noël concurrent `5508257` est conservé. Les répertoires non suivis `.claude/`, `marketing/` et le fichier `MEMORY.md` ne sont pas inclus.

- `npm run check` sur la candidate : 0 erreur, 0 avertissement, 0 suggestion.
- `npm run launch:check` : validation stricte réussie, références/photos/droits/affiliation et contenu bilingue contrôlés.
- Production : 208 fichiers HTML, 207 routes publiques. Preview : 212 fichiers HTML, 211 routes ; noindex conservé.
- `npm run hosting:check` sur la production finale : 220 contrôles réussis.
- `node scripts/editorial-qa.mjs` : 20 mises en page à 320/390/768/1024/1440 px, 4 audits axe sans violation détectée, 45 destinations internes HTTP 200, 6 vérifications de filtre et 6 routes sans JavaScript. Images décodées et liens produits affiliés contrôlés.
- `node scripts/quality-qa.mjs` : 36 mises en page et régressions comparateur/favoris/récupération de recherche/menu mobile, clavier et panne de téléchargement JSON réussies.
- `SITE_STAGE=production npm run qa` : 112 vues, 395 liens, aucune erreur ni échec.
- `SITE_STAGE=production npm run qa:i18n` : 98 vues, 386 liens, 43 routes sans JavaScript, aucune erreur ni échec.

Les premières exécutions globales utilisaient les attentes preview et son ancien manifeste contre la production : échecs de robots et de routes archivées, sans défaut correspondant dans la candidate. Les suites ont ensuite été exécutées dans la candidate avec le bon stage. Le test anglais créait aussi son profil navigateur avant son dossier temporaire sur une copie vierge : création explicite du dossier ajoutée, puis suite relancée avec succès. Aucun contrôle n’a été désactivé.

Captures dans `evidence/editorial/` : `0-390.png` et `0-1440.png` pour le comparatif FR ; `1-*` pour EN ; `2-*` pour le guide FR ; `3-*` pour EN ; `water-filter-390.png` ; `gshock-before-390.png` et `gshock-after-390.png` pour le maillage du guide existant. Les captures avec images décodées remplacent la première prise navigateur qui avait photographié des emplacements avant chargement. Les captures sont des preuves locales, pas des assets du build public.

## Routes et lancement

- `/comparatifs/g-shock-ga-2100-1a1er-ou-1aer/`
- `/en/comparisons/g-shock-ga-2100-1a1er-or-1aer/`
- `/guides/etancheite-montre-3-5-10-20-atm/`
- `/en/guides/watch-water-resistance-3-5-10-20-atm/`
- `/catalogue/?water=10` et `/en/catalogue/?water=10`

Local : `npm run dev -- --port 4321`. Production locale : définir `SITE_STAGE=production`, lancer `npm run build`, puis `node scripts/serve-cloudflare.mjs dist-production`.

La qualité globale « S+ » reste un objectif, pas un label mesuré. Le blocage des destinations Longines n’est pas levé par cette livraison. Une construction d’URL correcte ne prouve pas une commission attribuée ; celle-ci se vérifie dans le programme partenaire. Aucun score Lighthouse ni résultat commercial n’est revendiqué pour cette itération.
