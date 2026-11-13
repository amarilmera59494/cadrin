# Cadrin · consolidation de la sélection

Le 13 novembre 2026, les trois fiches de la sélection ont été rapprochées de pages produit précises chez Tempus. Les liens sont ordinaires. Les cinq candidates documentées, les sources ouvertes, les divergences et les actions par modèle figurent dans [le dossier des références](cadrin-product-readiness.md).

## Ce qui a changé

- La sélection garde trois lectures du quotidien. La mécanique est désormais la **Seiko SRPE55K1**, documentée sous son suffixe par Seiko Boutique. La solaire est la **Citizen AW0102-13AE**, présente sous la même référence dans le catalogue Citizen et chez Tempus. La numérique reste la **Casio F-91W-1YEG**. Deux nouvelles URL identifient les nouvelles fiches. Les anciennes SRPE55 et AW1231-58E gardent leur adresse et leur fonction documentaire. Le guide conserve ses exemples fabricant.
- Les cartes et les fiches partagent un emplacement photo. Les packshots autorisés utiliseront un cadre 3:2 qui conserve la montre entière, les photos portées auront un point de cadrage propre. Aujourd’hui la preview affiche la référence et une courte mention de l’image manquante. Les images du hero et du module guide restent créditées comme ambiances.
- Le registre des photos produit lie fichier, référence, dimensions, crédit, source et justificatif. Le rendu exige l’accord des droits sur la fiche. Le contrôle de contenu vérifie les fichiers. L’exclusion des brouillons et le contrôle de lancement restent en place.
- Sur les captures initiales à 390 px, la fiche répétait la référence dans un grand pavé de chantier avant le lien marchand. La première correction a raccourci ce pavé. À l’inspection suivante, la répétition de la référence restait visible : elle a été retirée de la fiche. Le lecteur voit désormais le modèle en tête, la divergence matérielle près du lien, puis le bouton Tempus dans le premier écran de la Casio à 390 × 844.
- Sur l’accueil et la sélection, les marques, références et usages se lisent dans le même ordre sur les trois cartes. Les raisons du choix portent sur le mouvement, le calendrier ou le chronomètre. Le titre de l’index des guides annonce clairement son sujet. Plusieurs devises, répétitions et notes de validation ont été retirées. Les sources, la nature documentaire du contenu et le fonctionnement des liens restent accessibles.

Fichiers principaux : `src/content/watches/`, la sélection Markdown, `src/data/destinations.ts`, `product-photos.ts`, `publication.ts`, `WatchPhoto.astro`, `WatchCard.astro`, `CadrinMerchantLink.astro`, les pages de sélection et de fiche, l’accueil, les guides, la méthode et le pied de page. Contrôles adaptés dans `scripts/cadrin-content-check.mjs`, `cadrin-browser-qa.mjs` et `check-production.mjs`. Les dépendances, le lockfile, les archives et la configuration Cloudflare ont été conservés.

## Captures comparables

Chrome 157.0.8103.78, contexte neuf à 100 %, DPR 1, captures sans interface navigateur. Hauteurs de 1000 px sur ordinateur et 844 px sur mobile. Les vues de la grille isolent la section à sa largeur effective. Le dossier `avant` provient de la prévisualisation de développement, le dossier `apres` du build compilé.

| Vue | Avant | Après |
| --- | --- | --- |
| Accueil 1440 | [PNG](../evidence/iteration-03/avant/accueil-1440.png) | [PNG](../evidence/iteration-03/apres/accueil-1440.png) |
| Accueil 390 | [PNG](../evidence/iteration-03/avant/accueil-390.png) | [PNG](../evidence/iteration-03/apres/accueil-390.png) |
| Cartes 1440 | [PNG](../evidence/iteration-03/avant/cartes-1440.png) | [PNG](../evidence/iteration-03/apres/cartes-1440.png) |
| Cartes 360 | [PNG](../evidence/iteration-03/avant/cartes-360.png) | [PNG](../evidence/iteration-03/apres/cartes-360.png) |
| Fiche 390 | [PNG](../evidence/iteration-03/avant/fiche-390.png) | [PNG](../evidence/iteration-03/apres/fiche-390.png) |
| Sélection 1440 | [PNG](../evidence/iteration-03/avant/selection-1440.png) | [PNG](../evidence/iteration-03/apres/selection-1440.png) |
| Guide 390 | [PNG](../evidence/iteration-03/avant/guide-390.png) | [PNG](../evidence/iteration-03/apres/guide-390.png) |

Les [vues avant](../evidence/iteration-03/avant-planche.jpg) et [vues après](../evidence/iteration-03/apres-planche.jpg) regroupent aussi l’accueil et les cartes à 320, 360 et 1920 px, ainsi que la fiche, la sélection et le guide en desktop et mobile. Les PNG originaux restent disponibles dans les deux dossiers. La composition mesure effectivement 1320 px à 1440 et à 1920 px. La colonne du guide mesure 700 px à 1440 et 350 px à 390. Le corps de page reste à 16 px. La correction de taille concerne le texte des cartes. [Mesures après](../evidence/iteration-03/apres/mesures.json).

## Vérification locale

- `npm run check` a examiné 54 fichiers avec zéro erreur, avertissement ou indication. `npm run content:check` a relevé zéro erreur structurelle.
- Le build par défaut a produit 12 pages dont la 404. La répétition de production en a produit cinq dont la 404. Les sept brouillons et les concepts sont exclus. Les 17 contrôles d’hébergement sont passés. Le dry-run Cloudflare a lu 57 fichiers. [Rapport de routage](../evidence/cadrin/production-hosting-report.json).
- `npm run qa` a vérifié 38 couples page/largeur, 30 liens ou ancres, 22 audits axe et 11 routes sans JavaScript. Les 28 contrôles d’interaction et d’hébergement incluent clavier, focus, Échap, filtres, état vide, remise à zéro, retour arrière depuis la fiche avec conservation du filtre, comparaison au clavier dans le guide, préférence de mouvement réduit et trajet jusqu’au clic marchand. Aucune violation axe détectée, aucun échec ni erreur console du site. Les fiches externes Tempus ont également été ouvertes dans Chrome, avec réponse HTTP 200 et référence visible pour les trois modèles. [Rapport navigateur](../evidence/iteration-03/qa/browser-report.json).
- Zoom du navigateur à 200 % dans un profil Chrome temporaire, via le réglage natif du navigateur. Fenêtre extérieure 1440 px, largeur interne passée de 1424 à 712 px et DPR de 1 à 2. Le zoom CSS est resté à 1. Aucun débordement sur accueil, sélection, fiche Casio et guide. [Relevé du zoom natif](../evidence/iteration-03/zoom.json).
- `npm run launch:check` reste en échec attendu. [État des contenus et blocages](../evidence/cadrin/content-report.json). Aucun nouveau visuel produit chargé ni changement du chargement des photos d’ambiance. Lighthouse n’a pas été relancé pour cette passe. Aucun test sur appareil physique, Safari, Firefox ou lecteur d’écran. Les nouveaux cadrages photo devront être contrôlés avec les futurs fichiers.

La prochaine action externe est d’obtenir les trois photographies identifiées et leurs permissions écrites pour Cadrin. Il reste ensuite à valider la relecture, l’identité de l’éditeur, les mentions légales et le contact. Pour monétiser, obtenir les liens fournis par le programme Tempus. La largeur de la Casio et la description de la variante Seiko restent à confirmer. Aucun formulaire marchand envoyé ni compte modifié.
