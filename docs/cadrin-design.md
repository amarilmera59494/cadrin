# Cadrin · direction ALLURE

V1 locale, 13 novembre 2026. Le bordeaux `#4a1725`, l’ivoire `#f5f0e6`, le sable `#e9e1d4` et l’accent `#792a40` prolongent ALLURE. Les titres de couverture utilisent Barlow Condensed ; le texte et les titres de guide utilisent DM Sans. Les deux familles sont locales et couvertes par les licences conservées dans `licenses/`.

L’accueil associe un titre en deux lignes et une photographie portée. Sa version mobile place les deux actions avant une image de 300 px, sans hauteur fixe imposée au texte. Les pages de lecture restent claires. Les fiches produit privilégient les repères et les sources plutôt qu’un espace photographique rempli avec une autre montre.

Les tokens sont dans `src/styles/cadrin.css` : palette, familles, largeur maximale de 1320 px, colonne de lecture de 700 px, gouttières et échelle d’espacement. Les titres du hero utilisent la largeur de leur propre conteneur pour résister au zoom. Trois fichiers WOFF2 utiles au premier écran sont préchargés ; les images hors écran sont différées.

Le logotype espacé est composé dans `Wordmark.astro`, avec une coupure sur le A et un trait terminal. Les variantes vectorielles claire/sombre sont dans `public/brand/`, le favicon est un C géométrique sans cadran. Le master vectoriel reprend Barlow Condensed sous licence OFL ; `scripts/create-wordmark.py` permet sa régénération avec FontTools, uniquement si l’identité change. La génération normale de l’OG ne dépend pas de Python.

Composants utiles : `Photo`, `WatchCard`, `WatchComparison`, `Filters`, `CadrinMerchantLink`, `Comparison`, header/footer et layout Cadrin. Le tableau comparatif s’ouvre nativement, sans JavaScript. Les filtres n’attribuent aucun score et n’utilisent ni prix inconnu ni correspondance automatique entre diamètre et poignet.

Photographie : sources et conditions dans `src/data/image-registry.ts` et `SOURCES.md`. Les trois images licenciées sont exclusivement des ambiances, sans référence représentée revendiquée. Le hero conserve Renzo Watches. Remplacement souhaité avant lancement : photo portée propre à Cadrin, avec droits éditoriaux/commerciaux écrits et référence exacte identifiée. Les fiches attendent des photos de SRPE55K1, AW0102-13AE et F-91W-1YEG autorisées pour cet usage.

Mouvement : couleur/soulignement, très léger recadrage au survol sur le module guide, aucune révélation différée. `prefers-reduced-motion` supprime les transitions. Menu non modal, vrai bouton et état `aria-expanded`, fermeture Échap, retour du focus. Sans JS, les liens de navigation restent visibles.

Archives : `archives/concepts/` conserve les anciennes sources, assets, documentation et scripts. Les routes historiques sont hors de `src/pages/`. `npm run dev:archives` permet de revoir les trois concepts, sans les ajouter au build Cadrin.

Les cartes et les fiches partagent `WatchPhoto`. Un packshot entier tient dans un cadre 3:2 avec `object-fit: contain`. Une photo portée autorisée utilise son propre point de cadrage. En preview, une ligne courte identifie la photo manquante. Elle disparaît en production. Le dossier d’itération présente les mesures de composition et les captures comparatives.
