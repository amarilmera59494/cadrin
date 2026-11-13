# Mesure CADRIN

État vérifié le 13 novembre 2026. Objectif : comprendre l’usage des pages, de la sélection et des sorties vers Tempus sans inventer des chiffres de ventes.

## Ce qui est collecté

Après un accord explicite dans « Préférences de statistiques » en pied de page : `page_view`, `selector_complete`, `filter_change`, `compare`, `affiliate_click`. Le site envoie un événement structuré à son propre chemin `/api/measure`, puis le Worker le consigne dans Cloudflare Workers Logs.

Champs autorisés : type d’événement, route CADRIN connue, source/campagne parmi des valeurs prédéfinies, emplacement du lien, chemin du produit Tempus connu, éventuellement nombre de suggestions. Pas de texte saisi, recherche libre, URL complète, identifiant utilisateur, cookie analytique ou identifiant de session ajouté par ce code. Le choix de consentement est conservé localement pour 180 jours ; DNT/GPC désactive l’envoi. Aucun événement avant accord, après refus, ni dans les builds preview.

Cloudflare assure le transport et dispose de ses propres métadonnées techniques de requête : ne pas présenter cela comme une absence totale de traitement de données. La page de confidentialité du site le précise. Le Worker désactive les journaux d’invocation et expurge les paramètres d’URL dans l’observabilité configurée. Les événements applicatifs n’incluent pas l’adresse IP ni l’agent utilisateur.

Le serveur impose même origine, POST JSON, corps de 1 024 octets maximum et listes fermées. La limite de 20 événements/minute dans le navigateur réduit les doubles actions accidentelles ; ce n’est pas un mécanisme anti-abus côté serveur. Des événements artificiels restent possibles : ces données ne constituent pas une comptabilité.

## Lire les chiffres

La requête enregistrée dans l’observabilité Cloudflare se nomme **CADRIN — interactions consenties** (`u4kmt3h29nwnot1yeav8fl9w`). Elle groupe les événements par type, source et campagne, en excluant `test:true`.

Export manuel avec le CLI Cloudflare déjà connecté :

```powershell
node scripts/metrics-export.mjs 2026-11-13
# Sans date : journée UTC précédente.
```

Résultats dans `evidence/metrics/YYYY-MM-DD.json` et trois CSV : sources, pages, produits. Les exports sont locaux et ignorés par Git. Les journées sont en UTC ; un export de la journée en cours porte `partialDay:true`. Le script refuse les dates hors des trois derniers jours et les résultats susceptibles d’être tronqués. Il ne crée aucun abonnement ni tâche planifiée.

La conservation des journaux dépend du forfait Cloudflare ; la documentation au jour de livraison indique 3 jours pour Free et 7 jours pour Paid. L’accès OAuth utilisé ne permet pas de vérifier la facturation du compte. Aucun changement de forfait n’a été effectué. Exporter régulièrement les agrégats avant expiration ; aucune conservation longue durée ni collecte automatique quotidienne n’est mise en place. Source : https://developers.cloudflare.com/workers/observability/logs/workers-logs/

## Ce que les chiffres ne disent pas

- Ce sont des événements, pas des visiteurs uniques. Une même personne peut agir plusieurs fois.
- L’accord étant volontaire, une partie de l’audience est absente. Ne pas appeler ces chiffres « audience totale ».
- La source est évaluée sur chaque page ; il n’y a pas de suivi de session ni d’attribution entre les pages. Un passage TikTok → guide → autre page peut perdre sa campagne au second chargement. Les clics directs de la page d’arrivée gardent sa campagne.
- Un clic vers Tempus n’est ni une commande ni une commission. Les ventes et remboursements doivent être lus dans le tableau de bord affilié Tempus ; aucun accès ni import de ces résultats n’a été simulé.
- Sans dénominateur d’audience complet et sans attribution de session, ne pas présenter un taux global de conversion commerciale.

## Preuves de fonctionnement

Consentement, refus persistant, retrait, absence d’envoi initial, domaines/champs interdits et preview désactivée ont été testés. Deux événements synthétiques explicitement marqués `test:true` ont reçu HTTP 204 en production ; leur présence a été vérifiée dans Cloudflare. Ils sont exclus des exports d’audience.

Le premier export réel du 13 novembre est vide : cela ne prouve aucune vente et n’a pas été rempli avec des données de démonstration. Les 61 vues G-Shock visibles sur la capture de Pierre sont une observation TikTok distincte, pas une mesure de visites CADRIN.
