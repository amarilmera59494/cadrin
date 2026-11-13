# Guides d’achat et sélecteur

Le sélecteur local compare six références étudiées chez Tempus. La sélection éditoriale de trois montres reste disponible. Le nouveau parcours part des guides budget, cadeau, automatiques ou Citizen vers des critères préremplis, un comparatif partageable et les fiches détaillées avec accès au marchand.

Les pages de collections [Citizen](https://tempusshop.com/collections/citizen), [Seiko](https://tempusshop.com/collections/montre-seiko), [Casio](https://tempusshop.com/collections/casio) et [montre femme](https://tempusshop.com/collections/montre-femme) ont servi à repérer les gammes. Les nouvelles fiches Orient Bambino RA-AC0M04Y, Citizen Tsuyosa NJ0150-81E et Citizen L Rainell EM1201-52L renvoient chacune au fabricant et à la référence exacte chez Tempus. La Rainell apporte un point de comparaison à 26,2 mm de large. Les catégories homme et femme dépendent de la description commerciale documentée. La Casio sans catégorie documentée reste dans les résultats sans filtre de catégorie.

## Prix et limites

Pour chaque modèle, le prix principal visible et l’offre structurée EUR de la même page produit ont été rapprochés le 13 novembre 2026. Le prix exclut la livraison. Aucun prix barré ni tarif d’une suggestion voisine ne sert au filtre. Les prix ne sont pas actualisés automatiquement. Lors d’une révision, rouvrir la fiche exacte, vérifier son prix courant, mettre à jour price et priceCheckedAt ensemble et revoir les exemples du guide budget. [Relevés et destinations](../evidence/iteration-04/prix.json).

## Vérifications

Astro check sur 59 fichiers sans diagnostic. Build preview de 20 pages dont la 404 et budget JS maximal de 1 725 octets gzip. La répétition de production a exclu les brouillons, le sélecteur et ses liens. Le contrôle strict de lancement reste en échec attendu. Les photos produit autorisées, la validation humaine et les informations de lancement restent nécessaires. Les commissions nécessitent encore de vrais liens du programme Tempus.

La suite navigateur a contrôlé 54 couples page et largeur, 81 liens et ancres, 38 audits axe et les 19 routes sans JavaScript. Aucun échec ni erreur console du site. La suite spécifique couvre les critères combinés, la recherche, le budget, les références de catégorie, le résultat vide, la conservation des choix après filtrage, le maximum de trois montres, les URL partageables et le retour arrière. Test en Chrome de bureau et en émulation mobile, sans téléphone physique. Les liens marchands ont été consultés et vérifiés indépendamment. Aucune transaction, mesure de conversion ou publication.

Lancer `npm run build` puis `npm run cloudflare:dev`. Dans un second terminal, exécuter `node scripts/finder-qa.mjs` et `npm run qa`. Le serveur Astro de développement écoute sur le port 4321.

[Capture ordinateur](../evidence/iteration-04/selecteur-1440.png) · [Capture mobile](../evidence/iteration-04/selecteur-390.png) · [Comparaison](../evidence/iteration-04/comparaison.png) · [Rapport navigateur](../evidence/iteration-04/qa/browser-report.json) · [Tests du sélecteur](../evidence/iteration-04/selecteur-tests.json).
