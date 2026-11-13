> État historique de préparation. La mise en ligne a ensuite été autorisée : voir [cadrin-hosting.md](cadrin-hosting.md) pour la configuration actuelle.

# Lancer et préparer la publication

Livraison locale du 13 novembre 2026 dans `D:/Affi_montres`. Aucun déploiement, push, changement DNS, rattachement de domaine ou service distant activé. Le domaine acheté est cadrin.fr, origine future `https://cadrin.fr`. La possession est déclarée par le propriétaire ; aucune configuration DNS n’est présumée.

Le dossier initial n’avait pas de `.git` et le dépôt GitHub fourni était vide. Les fichiers d’origine ont été sauvegardés dans `archives/concepts/` avant modification. Aucun historique ni fichier local n’a été réinitialisé. La seule adaptation des archives concerne l’autorisation Vite de lire les polices dans le `node_modules` parent.

## Commandes locales

Node 24.22.1, npm et le lockfile existant. Aucune mise à niveau de framework ni réinstallation de dépendances. Le binaire Node 24 déjà présent dans GroomSolo échouait à écrire dans D: ; une copie identique dans le projet fonctionne. Sur cette machine :

```powershell
cd D:\Affi_montres
$env:PATH = "$PWD\.tmp\node24;" + $env:PATH
npm run dev -- --port 4321
```

Ouvrir `http://127.0.0.1:4321/`. La copie `.tmp/node24/node.exe` est locale et ignorée ; sur une autre machine, utiliser une version compatible avec `engines` et `npm ci` si les dépendances sont absentes. Si le cache local est supprimé, recopier le binaire existant ou utiliser une installation Node 24 compatible. Aucun npm global n’a été modifié.

```powershell
npm run check
npm run content:check
npm run build
npm run cloudflare:dev
```

L’émulation Static Assets du build écoute sur `http://127.0.0.1:4323/`. Dans un autre terminal avec le même PATH :

```powershell
npm run qa
npm run audit:mobile
npm run cloudflare:check
npm run launch:check
```

`launch:check` échoue actuellement **par conception**, avec les blocages réels ; `content:check` vérifie la cohérence du corpus et expose les mêmes prérequis sans les traiter comme des erreurs d’implémentation. `npm run deploy` refuse toujours la publication. L’absence de Git ne remplace pas cette garde et les gardes ne peuvent pas empêcher un téléversement manuel.

Archives : `npm run dev:archives`, puis `http://127.0.0.1:4322/concepts/`. Arrêter un serveur avec Ctrl+C avant de reprendre son port. `npm run preview -- --port 4321` reste disponible, mais Astro Preview ne simule pas les en-têtes Cloudflare ; préférer `cloudflare:dev` pour la QA d’hébergement.

## Preview et répétition de production

`SITE_STAGE=preview` est la valeur par défaut, indépendamment de `NODE_ENV`. La preview génère les brouillons, un noindex HTML et HTTP, aucun sitemap. `robots.txt` permet de lire le noindex. Ce n’est pas une protection d’accès : garder la preview locale ; prévoir un contrôle d’accès si elle devient distante.

```powershell
$env:SITE_STAGE = 'production'
npm run build
node scripts/check-production.mjs
Remove-Item Env:SITE_STAGE
```

Le résultat de cette répétition reste dans `dist-production/`, séparé du build de preview `dist/`. Seuls accueil, index des guides, index des sélections, méthode et 404 sont générés aujourd’hui : les sept entrées éditoriales attendent leur validation. Les index vides n’exposent aucun lien vers un brouillon. Le sitemap contient uniquement les quatre routes structurelles ; la 404 reste noindex. Ce résultat de répétition **n’est pas un contenu de lancement validé**.

Les canoniques et l’OG absolue utilisent cadrin.fr uniquement dans ce mode explicite. Le contrôle du build vérifie les métadonnées, le JSON-LD, les exclusions et le budget JS. La préparation finale des en-têtes et du sitemap fait partie de `npm run build` : utiliser cette commande complète.

## Cloudflare

Configuration conservée dans `cloudflare.config.ts` avec `cf` **1.0.0-beta.31**. Aucun Wrangler ajouté. Workers Static Assets reçoit `dist` comme argument, sans serveur de rendu. `workersDev: false`, aucune route de domaine, aucun secret, aucune ressource distante. `htmlHandling: force-trailing-slash`, `notFoundHandling: 404-page` : routes de répertoires avec slash et réponse 404 pour les URLs absentes, sans fallback SPA.

`npm run cloudflare:check` exécute uniquement `cf deploy dist --dry-run --provision=false`. L’émulation utilise le Miniflare déjà installé avec cette version de `cf` : sa nouvelle API exige `workers[].config` et un module inerte pour le harnais local. Ce module ne fait pas partie du build déployable. Le harnais reprend les options de routage du même fichier Cloudflare et lit les vrais `_headers` générés. Aucun deuxième CLI ni dépendance n’a été installé. `cf dev` détecte le framework Astro dans ce projet ; il n’est pas présenté comme l’émulation des assets compilés.

Sources techniques : [configuration cf](https://developers.cloudflare.com/cf/projects/cloudflare-config/), [routage HTML Static Assets](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/), [Content Collections Astro](https://docs.astro.build/en/guides/content-collections/).

## Prérequis encore ouverts

- Photos autorisées de SRPE55K1, AW0102-13AE et F-91W-1YEG, preuve des droits et insertion dans le registre ; image portée propre à Cadrin souhaitée pour remplacer à terme l’ambiance existante.
- Confirmation du diamètre de la Seiko K1 et de la variante de calendrier décrite par Tempus.
- Clarification de la largeur de F-91W-1YEG ; la divergence entre Tempus et la page de famille Casio reste visible, non arbitrée.
- Relecture horlogère et attribution éditoriale réelles. Mettre à jour chaque statut après validation, jamais sur la seule base d’un build.
- Admission au programme Tempus, liens affiliés réels et permissions du kit. Le site utilise aujourd’hui trois liens produits ordinaires vers Tempus, sans commission.
- Mentions légales : identité/statut de l’éditeur, adresse légale publiable, identifiants applicables, directeur de publication, hébergeur effectivement choisi et coordonnées. Confidentialité : données réellement traitées, finalités, conservation, destinataires et exercice des droits. Contact : canal confirmé. Les brouillons administratifs restent dans cette documentation, pas dans les routes publiques. Aucune adresse `contact@cadrin.fr` n’a été créée.
- Compléter `src/data/launch.ts`, obtenir un `launch:check` satisfaisant, puis une autorisation de publication distincte. Préparer ensuite l’accès au compte, le domaine et le DNS dans une mission dédiée.

Pour l’indexation future, vérifier que Googlebot et OAI-SearchBot autorisés peuvent accéder aux pages et assets sans challenge inattendu. GPTBot concerne une décision distincte sur l’entraînement ; la politique devra être choisie avant lancement. Ne pas désactiver globalement les protections Cloudflare. Aucun balisage ni `llms.txt` ne garantit une citation ou une position. Références historiques officielles dans `SOURCES.md`.
