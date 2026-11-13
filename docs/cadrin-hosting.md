# Hébergement CADRIN

La mise en ligne a été autorisée le 13 novembre 2026. Cette décision remplace les interdictions de déploiement des comptes rendus précédents. Le domaine reste enregistré et renouvelé chez OVH ; DNS et hébergement sont confiés à Cloudflare.

## Version en ligne

Le Worker `cadrin` sert exclusivement les fichiers statiques Astro. L'adresse de secours est https://cadrin.pierre-narguet.workers.dev. Les domaines `cadrin.fr` et `www.cadrin.fr` sont rattachés au même Worker. Leur disponibilité dépend de la délégation OVH et de la validation des certificats.

Le déploiement utilise `SITE_STAGE=preview` : tous les parcours sont consultables, les pages et les réponses HTTP restent en noindex, sans sitemap. Ce site distant est accessible au public ; noindex n'est pas un contrôle d'accès. Les brouillons éditoriaux et limites photographiques restent identifiés. Les contrôles stricts du futur lancement indexable sont conservés.

## Déploiement reproductible

Node est fixé par `.node-version`, les dépendances par `package-lock.json`. Installer avec `npm ci`, puis `npm run check && npm run build && npm run hosting:check && npm run deploy`. `hosting:check` démarre automatiquement un serveur éphémère Miniflare, vérifie HTTP et le cache, puis l'arrête. La commande deploy vérifie le corpus et le build avant tout téléversement. Avec `SITE_STAGE=production`, elle exige en plus la validation éditoriale et administrative stricte. Ne pas changer les statuts pour faire passer ce contrôle.

La branche `main` du dépôt `amarilmera59494/cadrin` est connectée à Workers Builds. `SITE_STAGE=preview` et `NODE_VERSION=24.22.1` sont définis explicitement. Les changements de code et de contenu déclenchent une compilation ; les archives et la documentation seules en sont exclues. Le premier build distant a terminé avec succès le 13 novembre 2026.

Aucun secret ne doit entrer dans Git. Le build utilise un jeton Workers déjà enregistré dans le compte Cloudflare, sans copie de sa valeur. La création d'un jeton dédié CADRIN reste souhaitable pour isoler sa rotation et sa révocation ; la connexion OAuth disponible ne permet pas de créer de nouveaux jetons API. Les captures et sauvegardes opérationnelles locales sont ignorées. Les anciens concepts restent dans les archives du dépôt, sans route dans le site déployé.

## HTTP et sécurité

- Pas d'Apache ni de `.htaccess`. Astro génère une véritable page 404 ; Workers Static Assets utilise `404-page`, sans repli SPA.
- Les routes de pages ont un slash final. Une URL inexistante garde le statut 404.
- Une règle de zone redirige HTTP et www vers `https://cadrin.fr`, en conservant chemin et paramètres.
- TLS minimum 1.2, TLS 1.3 actif, mode Full strict. Aucun serveur d'origine tiers.
- CSP avec empreintes des scripts intégrés, blocage des frames et objets, en-têtes nosniff et politique de référent. Les scripts et polices viennent du site.
- HTML revalidé ; assets Astro à nom haché conservés un an en cache immuable.
- Les règles de cache des assets ciblent les fichiers réellement générés, retirent la valeur générale avant remplacement et laissent les 404 revalidables. Le test HTTP vérifie la valeur complète, pas seulement la présence d'« immutable ».
- Pas de clés, répertoire source, journaux ou preuves internes dans les assets publiés.

Contrôler l'hébergement : `QA_ORIGIN=https://cadrin.fr node scripts/hosting-check.mjs` (syntaxe shell POSIX ; sous PowerShell, définir `$env:QA_ORIGIN`). Les suites navigateur acceptent la même variable. Une panne de l'infrastructure Cloudflare n'est pas simulée par la page 404 du site ; aucun faux résultat de test 5xx n'est revendiqué.

## Courriel

La règle entrante `contact@cadrin.fr` pointe vers l'adresse Gmail confirmée par le propriétaire dans Cloudflare Email Routing. La réception dépend des MX Cloudflare et de l'activation de la zone. La destination est déjà vérifiée dans Cloudflare. Cette redirection n'est pas une boîte SMTP/IMAP et ne configure pas l'envoi depuis Gmail sous l'identité contact@cadrin.fr.

Les trois MX Cloudflare et la clé DKIM fournie par le service sont enregistrés. SPF reste unique et autorise Cloudflare ainsi qu'OVH pour préserver une éventuelle émission existante. DMARC commence à `p=none` ; ce mode n'impose pas le rejet. Aucune boîte OVH n'a été supprimée. Les anciennes entrées de parking web ont été retirées de la zone Cloudflare après sauvegarde.

Après activation DNS, activer Email Routing et envoyer un message d'essai depuis une adresse différente du Gmail destinataire, puis vérifier sa réception. Un statut API activé ne prouve pas à lui seul une livraison dans la boîte Gmail. DNSSEC n'est pas activé tant que les paramètres DS correspondants n'ont pas été transmis au registrar.

## Lancement commercial

Les droits des photos exactes, la relecture éditoriale, l'identité juridique et les pages administratives restent à compléter. Les destinations Tempus sont des liens ordinaires : aucun suivi affilié ni revenu n'est activé par la mise en ligne technique.

## Revenir à une version précédente

Dans Cloudflare, Worker cadrin → Deployments, sélectionner une version précédente et effectuer un rollback. Revenir également au commit correspondant dans Git pour que le prochain build ne réintroduise pas la modification. La sauvegarde DNS avant migration est conservée localement dans `.tmp/dns-before-cloudflare.json` ; elle ne doit pas être restaurée en bloc après l'activation du mail sans analyser ses effets sur la réception.
