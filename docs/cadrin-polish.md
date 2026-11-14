# CADRIN — finition du parcours et prochaines idées

Objectif ouvert le 14 novembre 2026 : polir le site en profondeur et trouver de nouvelles bonnes idées. Ce suivi ne réduit pas cet objectif à une seule modification de catalogue.

## Ordre de travail

1. Fluidifier la recherche et la navigation du catalogue, avec preuves FR/EN et mobile.
2. Vérifier les destinations marchandes signalées pendant la recherche éditoriale ; ne pas confondre une entrée du flux produits avec une fiche accessible.
3. Rendre la comparaison plus interprétable : repères factuels sur les différences, liens vers les explications appropriées, sans score arbitraire ni avis d'essai.
4. Relire les guides et leur navigation mobile ; privilégier les alternatives concrètes et les paragraphes qui aident réellement à choisir.
5. Développer les pistes cadeaux et nouvelles familles uniquement lorsque les références exactes, les sources, les photos et les destinations sont validées. Auditer l'ensemble à la fin, sans auto-attribuer un niveau « S+ ».

## Premier lot : commandes du catalogue

Constat dans le site public : le tri est caché dans les critères avancés ; la pagination n'est disponible qu'après 48 cartes. Les nouveaux contrôles rapprochent le tri, le retour aux filtres et le changement de page des résultats. Un lien d'ouverture permet d'aller directement aux montres. La pagination native du haut fonctionne aussi sans JavaScript ou quand le téléchargement des données échoue.

Les liens des deux paginations sont actualisés quand la comparaison change. Le contrôle dans Chrome a ouvert une page 2 dans un nouvel onglet avec Ctrl-clic : la référence comparée était conservée dans l'URL et dans le tableau. Cela corrige un cas où les clics ordinaires conservaient l'état mais les liens copiés ou ouverts ailleurs pouvaient être périmés.

La première composition ajoutait trop d'espace entre les commandes. Les captures ont conduit à réunir compte, partage, retour aux filtres et tri dans une même barre. Photos, couleurs et contenus existants sont conservés. Aucun prix, stock, image ou partenariat supplémentaire n'est créé.

Repère de recherche : [Baymard, Product Lists & Filtering](https://baymard.com/research/ecommerce-product-lists) et [vue des filtres appliqués](https://baymard.com/research-articles/how-to-design-applied-filters). Les changements répondent à des observations faites sur CADRIN ; les résultats de recherche externes ne sont pas une mesure de conversion de notre site.

## Preuves locales du premier lot

- Astro : 170 fichiers, zéro erreur, avertissement ou hint.
- Build production : 211 routes publiques, aucune erreur du vérificateur. Maximum de JavaScript comptabilisé par `check-build.mjs` : 14 052 octets gzip, contre 13 891 auparavant. Aucune dépendance ajoutée.
- Contrôle de publication : PASS ; hébergement local : 224 contrôles réussis.
- Suite catalogue existante : 10 mises en page, 33 interactions et deux parcours sans JS, aucune erreur. Son sélecteur « retirer » ciblait par erreur le premier bouton, devenu un favori dans une livraison précédente ; il cible désormais explicitement `data-remove`, sans supprimer l'assertion.
- Nouvelle suite `scripts/catalogue-navigation-qa.mjs` : dix mises en page FR/EN, de 320 à 1 440 px, audits axe sans violation détectée ; tri/prix, historique, reset du champ associé au formulaire, pagination haute, conservation de comparaison et de langue, focus, absence de JS et échec du chargement des données, PASS.
- Captures ouvertes : `evidence/polish/{before,after}-controls-{390,1440}.png`. Les captures « avant » ont été reprises après décodage des photos pour ne pas confondre un chargement en cours avec une absence d'asset.

## Découverte à traiter avant les prochains contenus

Les fiches candidates Tissot PRX T137.410.11.051.00 (`/products/tissot-prx-noir`) et Hamilton Khaki Field H69439931 (`/products/hamilton-khaki-field-mechanical-38mm`) ont redirigé vers l'accueil lors du contrôle HTTP. Le navigateur a confirmé la redirection de la Tissot. Avec `country=FR&currency=EUR`, cette dernière a retourné 404 ; l'ajout de notre identifiant affilié n'a pas résolu la destination. Une Citizen NJ0150-81E contrôlée au même moment a ouvert sa fiche exacte.

Un échantillon allant jusqu'à trois références par marque a été contrôlé séparément dans `evidence/polish/merchant-sample.json` : 70 destinations, 56 réponses 200 sur le chemin produit, 12 redirections hors fiche (Hamilton, Longines, Mido, Tissot) et deux autres réponses non-200. Il ne prouve pas la disponibilité de toute une marque. Les opportunités Tissot/Hamilton restent donc des pistes, pas des recommandations à publier comme achetables. Les sources fabricant trouvées sont [la PRX T1374101105100](https://www.tissotwatches.com/pl-pl/T1374101105100.html) et [la Khaki Field H69439931](https://www.hamiltonwatch.com/en-int/h69439931-khaki-field-mechanical.html).

Les deux réponses non-200 de l'échantillon sont des limitations HTTP 429 sur des Timex, pas une preuve de fiches supprimées. Un audit des 2 902 destinations a ensuite été lancé avec `node scripts/audit-tempus-destinations.mjs` : deux requêtes simultanées au maximum, pause entre requêtes, arrêt sur limitations répétées, aucune mutation distante. Rapport progressif dans `evidence/tempus-destinations/report.json`. Un HTTP 200 sur un chemin produit est seulement un contrôle d'accès : il ne prouve ni référence exacte, ni stock, ni commission. Ne pas présenter le lot comme entièrement audité avant `complete: true`, ni relancer un processus encore actif.

L'audit large s'est arrêté volontairement après 84 contrôles : 81 réponses produit et trois limitations HTTP 429. Il est incomplet (`complete: false`) et le processus est terminé, code 2. Ne pas assimiler les limitations à des produits supprimés, ni relancer immédiatement un audit massif. La prochaine correction doit porter d'abord sur les destinations dont la redirection a effectivement été constatée, avec une information adaptée dans les cartes, le comparateur et les favoris ; ne pas généraliser un échantillon à toute une marque.

Le premier lot de navigation est prêt pour publication, sans nouvelle recommandation Tissot/Hamilton/Mido. L'objectif global reste actif : conséquences des contrôles de destinations, comparaison interprétable, guides et nouvelles pistes restent à traiter.
