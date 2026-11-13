# CADRIN — parcours, sélection et diffusion

Livraison du 13 novembre 2026. Ce document décrit l’itération de croissance ; les anciens comptes rendus restent des historiques.

## Parcours en ligne

- `/vues-sur-nos-reseaux/` et `/en/seen-on-social/` réunissent les trois références des vidéos déjà publiées : GA-2100-1A1ER, NJ0200-50Z et A158WEA-1EF. Photos exactes, prix datés, limites, guide associé et bouton vers le produit Tempus avec `bg_ref=bDlTL8AyKb`.
- `/trouver-ma-montre/` et `/en/watch-finder/` donnent accès aux 2 902 fiches du relevé Tempus. L’aide guidée cherche, séparément et explicitement, parmi dix références commentées : budget, style, mouvement, dimension et couleur. Elle propose jusqu’à trois pistes et ne relâche jamais un critère pour remplir les résultats.
- Les six analyses historiques restent accessibles à `/analyses/` et `/en/analysed-watches/`. Les anciens paramètres de filtres et de comparaison restent compris.
- Les guides budget, cadeau et G-Shock gagnent des critères de décision et des comparaisons concrètes. Le guide cadeau illustre les Tsuyosa rose et bleue de 37 mm ainsi que la noire de 40 mm. Pas de nouvel article de remplissage.
- Les vidéos locales sont chargées à la demande, accompagnées de sous-titres. Les photos restent celles des références concernées. Le dossier `marketing/` préexistant est préservé.

## Diffusion

Sept épingles Pinterest programmées et revérifiées dans la liste « Scheduled Pins » : du 14 au 20 novembre 2026, chaque jour à 12 h, Europe/Paris. Les destinations sont les guides CADRIN pertinents, avec paramètres de campagne autorisés par la mesure. La programmation n’est pas une preuve de publication future.

Une quatrième vidéo, « Tsuyosa : 37 ou 40 mm ? », a été préparée avec la voix Marion et les vraies photos Tempus : 16,6 secondes, 1080 × 1920, H.264/AAC, sous-titres SRT/VTT. Elle est programmée pour le 14 novembre à 18 h (GMT+1 Paris), statut revérifié dans TikTok Studio. Déclarations commerciale et de voix synthétique activées dans la plateforme. Les trois vidéos antérieures ne sont pas republiées.

Fichiers locaux : `marketing/growth-week-01/`. Les visuels gardent une mention commerciale lisible ; l’accroche reste centrée sur la montre et le choix du lecteur. Aucun compte à rebours, faux avis ou chiffre de vente inventé.

## Vérification

Tests exécutés sur Windows avec Node v25.8.0 installé ; le build Cloudflare est configuré avec Node 24.22.1.

- `npm run check` : zéro erreur, zéro avertissement ; cinq indications sur des imports inutilisés dans le matériel marketing local.
- `npm run launch:check` : validation stricte réussie, sans désactiver de contrôle.
- Build production : 183 pages HTML, dont la 404 ; 182 routes publiques. Maximum JavaScript compressé par page : 9 330 octets. Ce budget n’est pas un score Lighthouse ni une mesure de réseau réel.
- Build de prévisualisation : 187 pages HTML, `noindex` conservé. Les pages de travail supplémentaires ne font pas partie du build public.
- `npm run hosting:check` : 195 contrôles HTTP/hébergement réussis.
- `npm run qa` : 86 combinaisons page/largeur, 254 liens internes, aucune erreur remontée.
- `npm run qa:i18n` : 74 combinaisons page/largeur, 251 liens, 31 contrôles sans JavaScript, aucune erreur remontée.
- `node scripts/growth-qa.mjs` : choix stricts, résultat vide, remise à zéro, liens affiliés, anciennes URL, menu mobile/Escape/focus, consentement/refus/retrait, navigation sans JavaScript. Largeurs 360, 390, 768, 1440 et 1920 px. Aucun débordement horizontal ni photo cassée ; axe WCAG AA sans violation sur les deux nouvelles interfaces à 390 px.
- `node scripts/growth-unit.mjs` : validation et limites du collecteur, isolation des origines, consentement, désactivation en prévisualisation, repli statique.
- `node scripts/growth-live-qa.mjs` : les 182 URL du sitemap répondent 200 sans `noindex`, vraie 404, huit vues navigateur en ligne sans erreur JavaScript ni ressource en échec.

Captures locales avant/après : `evidence/growth/before/`, `evidence/growth/after/`, `evidence/growth/live/`. Les captures finales ont été ouvertes ; les cartes mobiles trop étroites ont été corrigées, les photos répétées du guide cadeau réduites et le bouton de remise à zéro rendu cohérent avec le formulaire.

## Déploiement et exploitation

Astro demeure statique. Le petit Worker traite seulement `/api/measure` ; les autres requêtes passent aux assets Cloudflare. Les mentions légales n’ont pas été modifiées. La page de confidentialité décrit la nouvelle mesure.

La préparation Cloudflare efface uniquement son propre dossier généré `.cloudflare/output`, après contrôle du chemin réel, puis vérifie chaque asset par SHA-256. Cela empêche les anciens fichiers de preview de survivre à un build de production : `writeAssets` seul conservait des fichiers déjà présents.

Code poussé sur `main` au commit `7ae861b190991aac8e58c6a829d4349cd2f419c9`. Build GitHub → Cloudflare `a2170138-c4fe-4875-bbd7-16ed87121b29` terminé avec succès ; version Worker `c589a742-6f8b-40e5-b81b-ff58d0c88b6c` active à 100 %. Les 182 routes et huit vues navigateur ont de nouveau été vérifiées après ce déploiement. Aucune modification DNS ni changement de forfait.

PowerShell :

```powershell
npm run dev
# Prévisualisation locale avec noindex par défaut.

$env:SITE_STAGE='production'
npm run build
npm run cloudflare:dev
# Pour publier une version autorisée : npm run deploy
```

Après un nouveau build, redémarrer le serveur Miniflare local : un serveur déjà lancé peut garder l’ancien manifeste d’assets en mémoire.

## Limites qui restent réelles

Les prix, disponibilités et données produit sont un relevé daté, pas un flux de stock en temps réel. Les liens affiliés sont contrôlés dans le HTML et le parcours, mais cela ne prouve ni attribution d’une commande ni commission. La mesure est volontaire, partielle et sans identification individuelle ; consulter `cadrin-measurement.md`. Aucun résultat commercial ni classement « S+ » n’est revendiqué.
