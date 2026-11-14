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

Le premier lot de navigation est publié, sans nouvelle recommandation Tissot/Hamilton/Mido. Commit `4203c282132dd5be1914ef1e12b4fd0fb47c9d93`, build Cloudflare `e55fec25-60b8-409f-b337-28ad6540e405`, succès observé. La suite de navigation a été rejouée sur `https://cadrin.fr` : dix mises en page, deux parcours FR/EN, fonctionnement sans JS et dégradation sur échec des données, PASS. Les captures publiques `evidence/polish/live/fr-390.png` et `fr-1440.png` ont été ouvertes. La page conserve `index, follow`.

L'objectif global reste actif : conséquences des contrôles de destinations, comparaison interprétable, guides et nouvelles pistes restent à traiter. Neuf redirections non-Longines issues de l'échantillon sont préparées dans `evidence/polish/confirmed-redirect-candidates.json`, sans mutation de données produit. Les deux vérifications ad hoc PRX/Khaki sont détaillées ci-dessus. Les nouvelles sources TikTok apparues en parallèle dans le répertoire de travail n'ont pas été modifiées ni incluses dans cette livraison.


## Deuxième lot : destinations exactes et affiliation

Le constructeur `affiliateUrl` conserve le chemin exact du produit, les autres paramètres et le fragment, puis fixe une unique valeur `bg_ref=bDlTL8AyKb`. La référence Longines fournie par Pierre sert de cas de régression, avec variantes, ancien identifiant et paramètres dupliqués. Ce test prouve la construction, pas une conversion rémunérée.

Onze destinations supplémentaires constatées comme redirigées sont consignées dans `src/data/paused-tempus-destinations.json` : quatre Hamilton, quatre Tissot et trois Mido. La suspension porte sur ces chemins précis, y compris leurs variantes de langue, jamais sur l'ensemble de ces marques. Le traitement Longines déjà publié est conservé. Les cartes, photos, caractéristiques et favoris restent disponibles. Les filtres de commande ne présentent plus ces références comme commandables. Une note FR/EN explique la suspension sans prétendre à une rupture de stock.

La vérification de build a trouvé une PRX encore cliquable dans le guide haut de gamme. Les exemples de guides et leurs citations appliquent maintenant la même suspension. Le build refuse tout lien produit vers l'un des onze chemins, même correctement affilié. Un test négatif a injecté un tel lien dans une copie de la page générée : refus confirmé, puis restauration exacte. Le compteur singulier « 1 fiche » a également été corrigé après inspection des captures.

Validation locale du 14 novembre :
- Astro : 174 fichiers, zéro erreur, avertissement ou hint.
- Publication stricte : PASS ; build : 212 HTML / 211 routes publiques, zéro erreur, maximum JS comptabilisé 14 020 octets gzip.
- Hébergement : 224 contrôles, PASS.
- Suite catalogue : dix mises en page, 33 interactions, deux parcours sans JS, aucune erreur.
- Suite favoris : 25 mises en page et parcours clavier, stockage, partage et comparaison, aucune erreur.
- Nouvelle suite destinations : 22 cartes FR/EN, comparaison mixte, favoris, explication et changement de langue, guides, catalogue statique sans JS ; huit mises en page 320/390/768/1440, zéro violation axe détectée, PASS.
- Captures avant/après ouvertes : `evidence/destinations/{before,after}/card-390.png`, après desktop `card-1440.png`, ainsi que les vues de résultats après FR 390/1440. Les captures de carte sont recadrées sur l'élément ; le nombre du nom désigne la largeur du viewport.

Limite conservée : l'audit distant complet reste interrompu par les réponses 429. Aucun stock, prix, droit photo ou suivi de commission n'a été inventé ou revalidé par ces tests locaux. Les travaux TikTok non suivis restent hors livraison. Comparaison éditoriale et prochaine amélioration des guides restent au programme.

La capture du guide sur viewport 390 px a révélé un lien de suspension trop imposant. Sa typographie et son espacement ont été resserrés dans `guide-examples.css`, puis la capture `evidence/destinations/after/guide-390.png` a été ouverte à nouveau. La suite destinations a été rejouée, PASS.


## Troisième lot : comprendre et partager une comparaison

Le tableau chiffré reste disponible. Trois repères lisibles le précèdent désormais : budget, format et habitudes liées au mouvement. Ils sont calculés à partir des modèles réellement sélectionnés. Aucun score de qualité, confort au poignet, classement de ventes ou gagnant artificiel n'est attribué.

- Budget : écart calculé au centime, prix identiques traités séparément, absence de prix conservée. Une destination suspendue n'est pas présentée comme une offre disponible.
- Format : intervalle seulement si toutes les dimensions sont des valeurs simples positives en millimètres. Mesures rectangulaires, multiples ou absentes : pas de classement numérique. Les valeurs exactes et épaisseurs restent lisibles.
- Quotidien : regroupement par type de mouvement explicitement renseigné, avec un lien vers le guide pertinent. Type inconnu conservé ; aucune autonomie ou précision déduite du seul type.

Les explications de mécanique et de recharge lumineuse ont été rapprochées des sources fabricant consultées le 14 novembre : [Citizen, comprendre une montre mécanique](https://www.citizenwatch-global.com/support/maintenance/mechanical.html), [Citizen, Eco-Drive](https://www.citizenwatch-global.com/technologies/eco-drive/index.html) et [Citizen, exposition régulière à la lumière](https://faq.citizenwatch.co.uk/hc/en-gb/articles/6978879213207-Should-I-leave-my-Eco-Drive-watch-in-the-dark). Les durées propres à certains calibres ne sont pas généralisées. Les notices exactes restent la référence.

L'inspection mobile a conduit à remplacer les trois longs blocs ouverts (1 534 px mesurés pour les repères sur le viewport 390 px) par des blocs natifs dépliables. Leur titre garde le résultat utile visible. L'état ouvert est conservé quand on affiche seulement les différences. Les liens vers les guides restent dans les explications ; un accès direct permet de sauter au tableau.

« Partager ces montres » copie une URL contenant seulement les références sélectionnées, dans la bonne langue, avec l'ancre du comparateur. Il ne transporte pas les filtres inutiles. Si le presse-papiers est refusé, un champ sélectionnable reçoit le focus. Une modification de sélection efface le lien de secours ; une réponse tardive ne ressuscite pas l'ancienne comparaison.

L'un des premiers passages de QA a attendu le décodage de photos chargées paresseusement hors écran. Cause identifiée avec une sonde : le test attendait une image dont il ne déclenchait pas le chargement. Les captures forcent désormais le chargement des seules photos de comparaison avant décodage. Les processus de test restés en attente ont été arrêtés explicitement ; ils ne sont pas comptés comme réussis.


Vérifications du troisième lot :
- Test des repères : prix égaux, calcul décimal, mouvements mixtes et absents, dimensions simples, rectangulaires, manquantes ou invalides, achat suspendu et lots sur tout le catalogue. Intégré au contrôle de publication.
- Astro final : 177 fichiers, zéro erreur, avertissement ou hint. Production : 212 HTML, 211 routes publiques, zéro erreur ; JavaScript comptabilisé par le vérificateur : 16 207 octets gzip maximum (14 020 avant ce lot). Aucune dépendance ajoutée.
- Preview : 216 HTML, contrôles noindex et absence de sitemap de production réussis. Production reste indexable, 404 exclue.
- Hébergement : 224 contrôles réussis ; contrôle de publication strict réussi.
- Nouvelle suite comparaison : dix mises en page FR/EN 320, 390, 768, 1024 et 1440 px, zéro violation axe détectée ; blocs au clavier, état ouvert conservé, partage/rechargement, retrait/effacement, guide accessible, secours du presse-papiers et réponse tardive, PASS.
- Suite qualité existante : 36 mises en page 360–1920 px ; recherche vide, compteur, comparaison, sauvegarde, menus et focus, six routes sans JavaScript et échec simulé du JSON, aucune erreur.
- Captures avant/après de viewport dans `evidence/comparison/{before,after}/`, FR/EN. Les captures FR 390/1440, EN 320 et le bloc « Au quotidien » ouvert sur mobile ont été examinés. Un espace a été ajouté sous le résumé ouvert : le contour de focus ne doit pas recouvrir la première référence.

Les contrôles ne mesurent pas un taux de conversion. L'audit des destinations distant reste incomplet et les suspensions précédentes sont préservées. La prochaine étape porte sur les guides et les parcours cadeaux, avant l'audit final de l'objectif global.
