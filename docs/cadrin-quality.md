# Parcours de choix et finition — 14 novembre 2026

## Changements

Direction ALLURE/CADRIN, Astro statique et architecture Cloudflare conservés. Cette passe améliore les parcours existants ; elle n'ajoute pas d'articles, de références, de prix inventés ou de nouveaux assets.

- Le comparateur présente les photos exactes, les références, les favoris et l'écart entre les prix extrêmes au relevé. Le mode « différences seulement » ignore les simples écarts de présentation numérique, par exemple `45.4 mm` / `45.4mm`. Il ne déduit pas une équivalence à partir de données absentes et ne prétend pas comparer les montres à la même échelle.
- Sur mobile, les cellules restent lisibles dans un tableau défilant, avec les intitulés de lignes fixes. Le bouton flottant disparaît lorsque la comparaison est visible. Le compteur est actualisé dès la sélection ; l'arrivée par lien direct place le focus sur la comparaison. Retrait et remise à zéro conservent un focus utilisable.
- Une recherche sans résultat propose jusqu'à trois suppressions de critère, avec le nombre exact de résultats. Chaque changement exige une action explicite. Cas reproduit : `brand=Casio&q=GA-2100`, alors que ces références appartiennent à la marque `G-Shock` dans le catalogue Tempus. Revenir en arrière restaure les critères. La pagination disparaît lorsqu'il n'y a aucun résultat.
- Les favoris rejoignent la navigation principale, avec leur compteur. Les fiches détaillées, les montres vues en vidéo et le comparateur proposent maintenant l'enregistrement. Le parcours depuis une fiche présélectionne la bonne référence et laisse choisir une seconde montre dans le catalogue de sa marque.
- Les fiches détaillées affichent le prix, la date et le statut de commande du même relevé que le catalogue. Les dates de vérification des caractéristiques et des destinations restent distinctes.
- Le bouton marchand reflète le statut : « Acheter », « Précommander », « Commander » ou « Vérifier chez Tempus » pour une commande indisponible au relevé. Cette règle s'applique aux fiches, guides, favoris, cartes, recommandations et comparaisons en français et en anglais. Les liens conservent le code d'affiliation et `rel=sponsored`.
- Les fiches sont reliées aux dossiers de marque et aux comparatifs pertinents. Les cartes des guides donnent toute leur largeur aux photos sur petit écran et davantage d'espace aux textes et aux prix.
- Le README indique désormais la procédure d'actualisation contrôlée des offres, au lieu du réimport historique complet.

## Vérifications

- `npm run check` : zéro erreur, zéro avertissement ; cinq indications d'imports inutilisés dans le dossier marketing préexistant, laissé intact.
- Builds production et preview : 203 / 207 documents HTML ; production indexable, preview noindex par défaut, 202 routes publiques. Contrôles robots, canonicals, sitemap et affiliation réussis.
- `npm run launch:check` : réussi. `quality-check.mjs` vérifie les suggestions de filtres, leur absence d'effet implicite et les libellés de commande. Le contrôle de build détecte également un bouton marchand statique incompatible avec le relevé, notamment après un cache Markdown obsolète.
- `npm run hosting:check` : 215 contrôles réussis.
- Parcours général français : 106 vues, 363 liens, zéro erreur ou échec signalé. Anglais : 94 vues, 357 liens, 41 routes sans JavaScript, zéro erreur ou échec signalé.
- `node scripts/quality-qa.mjs` : parcours clavier, retours arrière, favoris, compteur, limite de trois comparaisons, filtres sans résultat, focus, affiliation, version anglaise, six routes sans JavaScript et panne simulée du chargement JSON. Le catalogue statique reste utilisable en cas d'échec réseau.
- Cette suite examine 36 mises en page aux largeurs 360, 390, 550, 700, 701, 768, 1024, 1440 et 1920 px ; aucun débordement global ni photo cassée. Axe ne signale aucune violation sur les quatre gabarits mobiles testés. Ce n'est pas une certification exhaustive d'accessibilité.
- Régressions `retention-qa.mjs` et `growth-qa.mjs` réussies : listes partagées, stockage bloqué, synchronisation entre onglets, menu, sélection guidée, liens affiliés et consentement de mesure.

Captures avant/après ouvertes et examinées dans `evidence/quality/before/` et `evidence/quality/after/`. Ce sont des captures de composants aux viewports 390 et 1440 px ; leur largeur utile est respectivement 350 px et jusqu'à 1320 px. Les fichiers `watch-full-*.png` capturent la page complète. `evidence/quality/qa/` contient aussi huit captures de viewport dont les largeurs PNG 390 / 1440 px sont contrôlées avec Sharp. Le tableau mobile a été resserré après inspection et le numéro de page inutile de l'écran vide a été supprimé.

Rapports : `evidence/quality/qa/report.json`, `fr/browser-report.json`, `en/`, `hosting.log`, `build-production.log`, `build-preview.log`, `astro-check.log`, `launch-check.log`, `retention.log`, `growth.log`.

## Limites externes et mesure

Les trois destinations Longines du dossier ont été revérifiées : Conquest L3.720.4.02.6, HydroConquest L3.780.4.56.6 et DolceVita L5.255.4.08.2 répondent toujours HTTP 302 vers l'accueil Tempus. Chrome confirme que la Conquest aboutit à l'accueil anglais. Rapport : `evidence/quality/longines-check.json`. La suspension des achats Longines reste donc en place ; cela ne signifie ni que toutes les références ont été testées à nouveau, ni qu'elles sont nécessairement épuisées. Il faut des destinations exactes fonctionnelles pour lever cette limite.

Pas de nouvelle mesure Lighthouse, de test physique de montre, de commande réelle ni de commission d'affiliation testée dans cette passe. Aucun taux de conversion, classement « S+ » ou résultat commercial n'est déduit des contrôles techniques. Les ventes et l'attribution doivent être observées dans le compte partenaire.

## Lancement et routes

```powershell
npm run dev -- --port 4321
# Prévisualisation locale, noindex par défaut.

$env:SITE_STAGE='production'
npm run build
$env:PORT='4340'
node scripts/serve-cloudflare.mjs dist-production
# Redémarrer ce serveur après un nouveau build de production.
```

Routes concernées : `/catalogue/`, `/trouver-ma-montre/`, `/mes-favoris/`, `/vues-sur-nos-reseaux/`, `/montres/citizen-tsuyosa-nj0150-81e/`, `/montres/seiko-srpe55k1/`, `/guides/montres-par-budget/`, et leurs versions anglaises. Les dossiers de `/marques/` et `/comparatifs/` restent disponibles.

Le dossier `marketing/` et le fichier non suivi `MEMORY.md`, apparu pendant la session, ne font pas partie de cette livraison.

## Publication vérifiée

Commit de production `59ae3700297a1fa0587f28b2d81e6570e5e94d47`, build Cloudflare `b9924ae7-7bb7-43a0-bd7e-f67422e80727` terminé avec succès. Après déploiement, les 202 routes du sitemap répondent HTTP 200, avec indexation autorisée et canonical attendu ; une URL inconnue répond réellement 404.

Le contrôle navigateur public confirme la récupération d'une recherche vide, les photos du comparateur, le mode différences, l'enregistrement et le compteur des favoris, les statuts marchands FR/EN, le code affilié et la suspension Longines. Aucune erreur signalée. Dix captures de composants et deux captures de page complète ont été produites en ligne aux viewports 390 / 1440 px ; les captures du comparateur desktop, de la fiche mobile et des cartes de guide mobile ont été ouvertes et examinées. Preuves dans `evidence/quality/live/`, rapport `report.json`, dimensions `captures.json`.
