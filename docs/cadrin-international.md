# CADRIN — anglais, guides et sélection

Itération du 13 novembre 2026. La direction ALLURE et le corpus existant sont conservés. Le propriétaire a autorisé la mise en ligne de la prévisualisation et le déploiement depuis GitHub ; les garde-fous du lancement indexable restent actifs.

## Ce qui est préparé

- Français à la racine, anglais sous `/en/`, avec URL propres et choix FR/EN sur chaque page. La suggestion anglaise se fonde sur la langue du navigateur et le choix enregistré, sans redirection forcée ni géolocalisation.
- Changement de langue du sélecteur conservant critères, tri et comparaison. Sans JavaScript, les liens de langue, les fiches et le tableau complet restent accessibles.
- Huit guides dans chaque langue : première montre, budget, automatique/quartz/solaire, proportions, cadeau, Bambino/Tsuyosa/Seiko, Eco-Drive/Tsuyosa, achat en ligne. Les trois nouveaux sujets approfondissent les questions du lecteur ; les huit fiches documentaires restent distinctes des six références utilisables dans le sélecteur.
- Index des guides partagé, entrées par besoin, comparatif des mouvements partagé, tri par prix/largeur, recherche, six critères et comparaison limitée à trois références. Le partage copie l’URL ; un champ sélectionnable prend le relais si le presse-papiers est interdit.
- Contact, mentions légales et confidentialité en français et anglais. Ces dernières restent incomplètes, explicitement signalées, et exclues du build indexable tant que leur validation manque.
- Prix et références viennent du corpus existant. La traduction ne dispose pas d’un second catalogue de prix, de stocks ou de droits photographiques.

## Vérification Tempus

Sources consultées le 13 novembre 2026 :

- https://tempusshop.com/en/pages/a-propos : présence d’une interface anglaise ; ce n’est pas une preuve de couverture de livraison.
- https://tempusshop.com/en/policies/terms-of-sale : article 8.3 indiquant la livraison mondiale.
- https://tempusshop.com/en/pages/faq : annonce Colissimo 48 h explicitement rattachée à la France métropolitaine.
- https://tempusshop.com/en/policies/refund-policy : politique à consulter pour la commande et la destination réelles.

Une requête réseau réelle sur les six destinations exactes `/en/products/…` a donné HTTP 200 après redirection vers `/products/…`, avec la référence attendue. Le moteur de recherche pouvait restituer d’anciennes pages anglaises ; cette différence est documentée plutôt que présentée comme une expérience marchande intégralement anglaise. Preuve locale : `evidence/international/tempus-destinations.json`. Aucune disponibilité n’a été déduite de ce contrôle.

Les URL anglaises sont des destinations ordinaires explicitement vérifiées. Un futur lien affilié ne doit jamais être traduit ou réécrit automatiquement : son URL et son suivi réels doivent être validés. Le composant conserve le lien affilié fourni plutôt que de lui substituer la destination anglaise ordinaire.

## Sources des nouveaux guides

- Seiko SRPE55 et SRPG35 : dimensions fabricant, consultées sur les pages officielles britanniques. Aucun prix britannique n’est transposé au catalogue français.
- Seiko, histoire du quartz et notice des calibres 4R : fonctionnement et limites d’usage. Les indications spécifiques aux plongeuses d’une notice générique ne sont pas transposées aux montres de la sélection.
- Citizen, technologie Eco-Drive et notice J7/J8 : alimentation lumineuse, stockage et précautions de charge. Pas de promesse de durée de vie ou de coût d’entretien universel.
- Les sources complètes sont dans les métadonnées des guides ; les liens vers les sources originales sont conservés, y compris lorsqu’elles sont en français ou allemand.

## Administration et limites externes

L’éditeur a fourni MicroDev, Pierre Narguet, entrepreneur individuel sous régime micro, SIREN 932132566, commune Aubry-du-Hainaut et TVA non applicable. Le registre public ne diffuse pas ses identité/adresse. À sa demande, aucune adresse complète ni téléphone personnel n’a été recherché ou ajouté. Ces champs restent nécessaires pour compléter les mentions professionnelles selon https://entreprendre.service-public.gouv.fr/vosdroits/F37351.

La politique de confidentialité décrit le fonctionnement constaté : Cloudflare, contact transféré vers Gmail, absence d’analytics/pixels/rejeu, préférence linguistique locale et filtres dans l’URL. La durée détaillée de conservation des échanges et la documentation des traitements restent à formaliser par l’éditeur ; la page n’est pas déclarée validée.

L’inscription Tempus n’est pas encore acceptée, les liens de suivi et les droits de photos produits ne sont pas reçus. Aucune commission n’est donc activée. Les photos d’ambiance existantes conservent leurs crédits et ne deviennent pas des photos des modèles sélectionnés.

La relecture humaine, y compris anglaise, reste requise. `englishEditorialApproved` est faux ; aucune identité d’auteur, de testeur ni validation humaine n’a été inventée. Les pages sont publiques mais en noindex : ce marquage n’est ni un contrôle d’accès ni une dispense de mentions légales.

## Reproduire la vérification

Node 24.22.1 (`.tmp/node24/node.exe` dans cet environnement). Commandes :

```text
npm run check
npm run content:check
npm run build
npm run hosting:check
npm run cloudflare:dev
npm run qa
node scripts/finder-qa.mjs
node scripts/i18n-qa.mjs
npm run audit:mobile
```

`QA_ORIGIN` choisit le serveur, `QA_OUTPUT` le dossier de preuves. Redémarrer le serveur Static Assets local après un build : les fichiers HTML changent sur disque, mais les règles `_headers` sont chargées au démarrage ; sinon une ancienne CSP bloque légitimement un nouveau script intégré. Ne pas assouplir la CSP pour contourner ce décalage du banc de test.

Les tests anglais couvrent aussi les liens internes et ancres, la restauration des filtres, le changement de langue, les limites de comparaison, le partage avec presse-papiers interdit, le stockage local bloqué et la suggestion sans redirection. Les tests de production vérifient l’exclusion des brouillons et les alternates réciproques des pages réellement générées. Aucun score Lighthouse ne constitue une mesure terrain.

## Résultats locaux de cette version

- Astro : 75 fichiers, aucune erreur, aucun avertissement ni hint.
- Build preview : 50 routes + la 404, JavaScript initial maximal 2 667 octets gzip. Noindex HTML et HTTP, aucun sitemap preview.
- HTTP : 63 contrôles réussis (routes, erreurs, cache, en-têtes, slash, HEAD/POST).
- Navigateur français : 74 combinaisons page/largeur, 145 liens et ancres, 25 parcours sans JavaScript ; aucune erreur ni violation axe relevée.
- Navigateur anglais : 62 combinaisons page/largeur, 149 liens et ancres, 25 parcours sans JavaScript ; aucune erreur ni violation axe relevée. Filtrage, tri, trois comparaisons maximum, changement de langue et partage de secours vérifiés.
- Capture de zoom 200 % inspectée avant/après : débordement du choix de langue corrigé par adaptation du bandeau à sa largeur réelle. Libellés accessibles FR/EN et fiches corrigés pour reprendre le texte visible.
- Production indexable : génération séparée, brouillons exclus et refus du déploiement avant tout téléversement, comme attendu. Aucun garde-fou désactivé.
- Lighthouse mobile local (trois passages, avant l’ajout final du guide mouvement) : médiane accueil 99/100, guide première montre 100/100 ; accessibilité 100/100, CLS 0. Ces mesures de laboratoire ne sont pas des données d’utilisateurs réels.

Captures dans `evidence/international/french/` et `evidence/international/browser/`, aux largeurs explicites de 390 et 1440 px. Les contrôles de débordement couvrent aussi 320, 360, 768 et 1920 px selon la suite. Les captures d’accueil, de guide, d’index, de sélecteur et de zoom ont été ouvertes et inspectées.
