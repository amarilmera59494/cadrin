# Hébergement CADRIN

La mise en ligne a été autorisée le 13 novembre 2026. Cette décision remplace les interdictions de déploiement des comptes rendus précédents. Le domaine reste enregistré et renouvelé chez OVH ; DNS et hébergement sont confiés à Cloudflare.

## Version en ligne

Le Worker `cadrin` sert exclusivement les fichiers statiques Astro. L'adresse de secours est https://cadrin.pierre-narguet.workers.dev. Les domaines `cadrin.fr` et `www.cadrin.fr` sont rattachés au même Worker. Leur disponibilité dépend de la délégation OVH et de la validation des certificats.

Le déploiement utilise `SITE_STAGE=preview` : tous les parcours sont consultables, les pages et les réponses HTTP restent en noindex, sans sitemap. Ce site distant est accessible au public ; noindex n'est pas un contrôle d'accès. Les brouillons éditoriaux et limites photographiques restent identifiés. Les contrôles stricts du futur lancement indexable sont conservés.

## Déploiement reproductible

Node est fixé par `.node-version`, les dépendances par `package-lock.json`. Installer avec `npm ci`, puis `npm run check && npm run build && npm run deploy`. La commande deploy vérifie le corpus et le build avant tout téléversement. Avec `SITE_STAGE=production`, elle exige en plus la validation éditoriale et administrative stricte. Ne pas changer les statuts pour faire passer ce contrôle.

La branche `main` du dépôt `amarilmera59494/cadrin` est la source prévue pour Workers Builds. Aucun secret ne doit entrer dans Git. Les captures et sauvegardes opérationnelles locales sont ignorées. Les anciens concepts restent dans les archives du dépôt, sans route dans le site déployé.

## HTTP et sécurité

- Pas d'Apache ni de `.htaccess`. Astro génère une véritable page 404 ; Workers Static Assets utilise `404-page`, sans repli SPA.
- Les routes de pages ont un slash final. Une URL inexistante garde le statut 404.
- Une règle de zone redirige HTTP et www vers `https://cadrin.fr`, en conservant chemin et paramètres.
- TLS minimum 1.2, TLS 1.3 actif, mode Full strict. Aucun serveur d'origine tiers.
- CSP avec empreintes des scripts intégrés, blocage des frames et objets, en-têtes nosniff et politique de référent. Les scripts et polices viennent du site.
- HTML revalidé ; assets Astro à nom haché conservés un an en cache immuable.
- Pas de clés, répertoire source, journaux ou preuves internes dans les assets publiés.

Contrôler l'hébergement : `QA_ORIGIN=https://cadrin.fr node scripts/hosting-check.mjs` (syntaxe shell POSIX ; sous PowerShell, définir `$env:QA_ORIGIN`). Les suites navigateur acceptent la même variable. Une panne de l'infrastructure Cloudflare n'est pas simulée par la page 404 du site ; aucun faux résultat de test 5xx n'est revendiqué.

## Courriel

La règle entrante `contact@cadrin.fr` pointe vers l'adresse Gmail confirmée par le propriétaire dans Cloudflare Email Routing. La réception dépend des MX Cloudflare et de l'activation de la zone. La destination est déjà vérifiée dans Cloudflare. Cette redirection n'est pas une boîte SMTP/IMAP et ne configure pas l'envoi depuis Gmail sous l'identité contact@cadrin.fr.

## Lancement commercial

Les droits des photos exactes, la relecture éditoriale, l'identité juridique et les pages administratives restent à compléter. Les destinations Tempus sont des liens ordinaires : aucun suivi affilié ni revenu n'est activé par la mise en ligne technique.

## Revenir à une version précédente

Dans Cloudflare, Worker cadrin → Deployments, sélectionner une version précédente et effectuer un rollback. Revenir également au commit correspondant dans Git pour que le prochain build ne réintroduise pas la modification. La sauvegarde DNS avant migration est conservée localement dans `.tmp/dns-before-cloudflare.json` ; elle ne doit pas être restaurée en bloc après l'activation du mail sans analyser ses effets sur la réception.
