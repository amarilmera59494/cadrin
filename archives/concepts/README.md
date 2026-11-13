# Maquettes horlogères — AU PORTÉ / domaine candidat cadrin.com

Livraison locale du 12 novembre 2026. **Aucun déploiement, domaine réservé, service payant activé ou compte partenaire connecté.** Projet Astro autonome créé après inspection de l'espace GroomSolo ; aucun fichier de `../repository` modifié. Le brief a été lu intégralement dans `C:/Users/pierre/Downloads/prompt-codex-maquettes-horlogerie.md`.

## Lancer

Node **24.22.1** recommandé (voir `.node-version` et `engines`). Sur cette machine, cette version existe déjà :

```powershell
cd C:\Users\pierre\Documents\GroomSolo\au-porte
$env:PATH = 'C:\Users\pierre\Documents\GroomSolo\.tools\node-v24.22.1-win-x64;' + $env:PATH
npm ci
npm run dev -- --port 4321
```

Ouvrir http://127.0.0.1:4321/concepts/ . Arrêter le serveur avec Ctrl+C avant de réutiliser le port.

```powershell
npm run check
npm run build
npm run preview -- --port 4321
```

Dans un second terminal, avec la prévisualisation active :

```powershell
npm run qa
npm run audit:mobile
```

Les tests utilisent Chrome installé (`channel: chrome`) et un répertoire temporaire local `.tmp/`. Photos et polices sont locales : aucun tiers n'est appelé par les pages.

## Pages

| Direction | Accueil | Guide |
| --- | --- | --- |
| Galerie | `/concepts/` | — |
| REVUE | `/concepts/revue/` | `/concepts/revue/guide/` |
| MESURE | `/concepts/mesure/` | `/concepts/mesure/guide/` |
| ALLURE | `/concepts/allure/` | `/concepts/allure/guide/` |

La racine renvoie vers la galerie ; une page 404 est générée.

## Architecture et marque

- `src/data/site.ts` : **nom, signature, domaine candidat, origine publique et réseaux sociaux**. `cadrin.com` n'est ni validé ni utilisé comme canonique. Le nom reste AU PORTÉ selon la demande initiale ; remplacer `name` par `CADRIN` change les identités textuelles. Favicon et image OG sont régénérés au build.
- `src/data/products.ts` : six références, sources, date, caractéristiques, interprétations et limites. Prix, stock et visuel produit sont nuls ; droits photo à obtenir.
- `src/content/guide/` : quatre chapitres Markdown partagés, Content Collections Astro et schéma Zod.
- Pages et styles propres à chaque direction ; composants communs limités aux éléments sémantiques, données, crédits et méthode. Aucun composant géant à variantes.
- `src/data/merchants.ts` : registre multi-marchand et liens affiliés futurs. `MerchantLink.astro` exige une URL validée et un marchand approuvé. Il ajoute `sponsored noopener noreferrer` et « Voir chez Tempus Shop » lorsque ce marchand sera activé.
- Les clics affiliés futurs émettent seulement un `CustomEvent('affiliate-click')` local, avec `productId` et `placement`. Aucun envoi réseau, cookie, stockage ou donnée personnelle.

Astro 7.4.11, TypeScript strict, HTML prérendu, CSS sur mesure, JavaScript natif. Aucun SSR, React, CMS, base de données ou authentification.

## Cloudflare Workers Static Assets

Une seule chaîne : **`cf` 1.0.0-beta.31**, CLI actuelle vérifiée. Le package est `cf`, pas `@cloudflare/cf`. Le projet neuf n'avait aucune configuration Wrangler ; aucun outil du dépôt GroomSolo n'a été migré.

`cloudflare.config.ts` définit un Worker sans entrypoint serveur. La CLI reçoit les assets prérendus en argument : `assets.directory` n'est pas un champ de cette configuration `cf`.

```powershell
npm run build
npm run cloudflare:check
# Équivalent : npx cf deploy dist --dry-run --provision=false
```

Le dry-run a été exécuté avec succès, sans téléversement. `workersDev: false`, aucun compte ni route inventé. `public/_headers` prépare les en-têtes Cloudflare, notamment `X-Robots-Tag`. `astro preview` ne simule pas ces en-têtes ; le noindex HTML y est bien présent.

**Futur déploiement, après autorisation et préparation de la direction retenue seulement :** authentification humaine `npx cf auth login`, configuration du compte et de l'accès privé ou de la route autorisée, build et dry-run, puis `npx cf deploy dist --provision=false`. Cette dernière commande n'a pas été exécutée.

`npm run deploy` échoue volontairement ; `PUBLIC_RELEASE=1` bloque aussi le build. Ces gardes limitent la publication accidentelle via les scripts, mais n'empêchent pas un humain de téléverser manuellement `dist/`.

## Noindex et futur site public

Les sept pages portent `noindex, nofollow` et restent hors sitemap. Aucun canonique vers un domaine non confirmé. `robots.txt` autorise l'exploration nécessaire à la lecture du noindex. Le noindex **ne protège pas l'accès** : la prévisualisation locale écoute sur `127.0.0.1`. Pour une revue distante, configurer Cloudflare Access sur un domaine de prévisualisation, avec une politique d'accès validée avant tout téléversement.

Avant production : choisir une direction, définir les URLs finales, vérifier nom et domaine, droits photo, auteur/relecture, références et liens marchands. Préparer ensuite canoniques absolues, URL OG absolue et sitemap limité aux pages publiques vérifiées. Garder les concepts exclus. Balisage actuel : WebSite/Organization (projet éditorial), Article, BreadcrumbList ; aucun auteur inventé, Offer, Review, AggregateRating ou Product.

Vérifier les règles WAF, Bot Fight Mode, challenges, robots gérés et accès aux assets sur Cloudflare ; autoriser les robots voulus de façon ciblée, sans désactiver la sécurité globale. OAI-SearchBot concerne la recherche, GPTBot l'entraînement : décisions indépendantes à faire valider pour la production. Aucun `llms.txt`, FAQ ou balisage ne garantit une citation. Google ne demande pas de balisage spécial pour ses fonctionnalités IA. Sources officielles dans SOURCES.md.

## Livrables

- `DESIGN.md` : directions, principes de réemploi et recommandation.
- `SOURCES.md` et `licenses/` : sources, licences et informations manquantes.
- `QA.md` : tests exécutés, mesures et limites.
- `evidence/final/` : captures complètes et premiers écrans desktop/mobile des sept pages ; rapport navigateur JSON.
- `evidence/lighthouse/` : audits réellement exécutés, JSON et HTML.
- `evidence/build-report.json` : contrôle noindex et budget JavaScript gzip par page.

Les photos d'ambiance ne représentent pas les six références. Les visuels produit autorisés, essais, prix, stocks et disponibilité chez Tempus Shop restent à obtenir. Auteur, relecture, propriété du domaine et aspects juridiques du média restent à finaliser. Les mesures locales ne prouvent ni les performances terrain, ni une conformité WCAG complète, ni le rendu sur appareils réels.
