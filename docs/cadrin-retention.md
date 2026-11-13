# Dossiers de marque, comparatifs et favoris — 14 novembre 2026

## Livraison

La direction ALLURE/CADRIN est conservée. Quatre dossiers de marque (Longines, Seiko, Citizen, Casio/G-Shock) et trois comparatifs précis sont disponibles en français et en anglais. Les pages utilisent les photos exactes du catalogue Tempus déjà autorisées dans `licenses/tempus-media.md`. Aucun nouveau visuel généré, essai physique, auteur fictif ou classement de ventes n'est ajouté.

Les dossiers présentent une histoire sourcée, les familles utiles au choix, trois références et leurs limites, puis les caractéristiques et les sources. Les comparatifs traitent Tsuyosa 37/40 mm, Casio A158/G-Shock GA-2100 et Seiko SNKL23J1/Citizen NJ0150-81E. L'écart de prix du troisième est calculé à partir du relevé, sans remise supplémentaire supposée.

Routes FR :

- `/marques/` et `/marques/longines/`, `/marques/seiko/`, `/marques/citizen/`, `/marques/casio-g-shock/`.
- `/comparatifs/` et `/comparatifs/tsuyosa-37-ou-40-mm/`, `/comparatifs/casio-retro-ou-g-shock/`, `/comparatifs/tsuyosa-ou-seiko-5-budget/`.
- `/mes-favoris/` ; pendant anglais `/en/saved-watches/`.
- Routes éditoriales anglaises dans `src/data/feature-routes.ts`, vérifiées contre les dossiers. Cette petite table évite d'embarquer tous les textes des articles dans le JavaScript client.

Le catalogue, le sélecteur guidé, les exemples des guides et les nouveaux dossiers proposent l'enregistrement local. Une liste garde au maximum 12 montres, permet d'en comparer trois et se partage par fragment `#liste=...`. Ouvrir une liste partagée ne remplace pas la liste personnelle ; son import est explicite. Le fragment ne contient ni nom ni compte lecteur. La confidentialité décrit cette fonction ; les mentions légales sont inchangées.

## Sources historiques vérifiées

- Longines, 1832/1867 : [musée Longines, Swatch Group](https://www.swatchgroup.com/en/companies-brands/landmarks/longines-museum). [Conquest L3.720.4.02.6 officielle](https://www.longines.com/en-gr/p/watch-conquest-l3-720-4-02-6) : référence vérifiée, son prix étranger n'est pas repris.
- Seiko, 1881/1969 : [histoire officielle](https://www.seikowatches.com/global-en/special/heritage/), [Astron quartz](https://www.seikowatches.com/us-en/customerservice/knowledge/quartz-knowledge).
- Citizen, 1918/1924/1930 : [histoire officielle](https://www.citizenwatch-global.com/about/history/index.html). Solaire 1976 et nom Eco-Drive 1994 : [Citizen Europe](https://citizenwatch.eu/en/info/technologies/eco-drive/).
- Casio, Casiotron 1974 : [communiqué anniversaire](https://www.casio.com/intl/news/2024/0215-trn-50/). G-Shock 1983 : [chronologie officielle](https://www.casio.com/europe/watches/50th/).

## Problème externe Longines : liens suspendus

Le flux public contient 620 références Longines, mais cela ne prouve pas qu'elles soient achetables. Les trois destinations retenues pour le dossier redirigent vers l'accueil Tempus :

| Référence | Chemin Tempus contrôlé |
| --- | --- |
| L3.720.4.02.6 | `/products/longines-conquest-38mm-l3-720-4-02-6` |
| L3.780.4.56.6 | `/products/longines-hydroconquest-39mm-1` |
| L5.255.4.08.2 | `/products/longines-dolcevita-l5-255-4-08-2` |

Six autres références contrôlées répondent aussi HTTP 302 vers l'accueil : L4.341.0.97.6, L4.512.4.97.6, L4.512.1.67.7, L4.908.4.97.6, L4.755.4.94.6, L4.908.4.51.6. Une vérification dans Chrome confirme le renvoi de la Conquest à l'accueil anglais, pas à sa fiche. Il ne s'agit donc pas seulement d'une réponse HTTP 200 prise à tort pour une fiche valide.

Par précaution, les liens d'achat de cette marque sont suspendus dans les cartes, les favoris et le comparateur. Les données restent consultables, avec une information visible. Cela n'affirme pas que les 620 pages ont toutes été testées : neuf l'ont été. La fonction centrale `merchantLinkAvailable` doit être revue après confirmation de destinations exactes fonctionnelles. Une actualisation des prix ne lève pas cette suspension. Aucun message n'a été envoyé au partenaire.

## Actualisation contrôlée

```powershell
npm run catalogue:refresh
# Examiner evidence/tempus-refresh/report.json avant l'étape suivante.
npm run catalogue:apply
npm run launch:check
```

Le relevé récupère toutes les pages du flux public avec marché France/EUR explicite. Il prépare un candidat sans modifier le catalogue. L'application exige les empreintes inchangées, un relevé de moins de 24 heures et aucun blocage. Une sauvegarde locale des deux fichiers est créée ; en cas d'échec d'écriture, le script tente leur restauration. Les contrôles de build vérifient ensuite la correspondance des copies source/client.

Seuls prix, possibilité de commande dans le flux et statut précommande/sur commande sont actualisés. Les caractéristiques, images, couleurs corrigées et textes sont préservés. Un changement d'identité, de photo, une référence manquante, un relevé incomplet ou une forte variation de prix bloque l'application. Les produits nouveaux ou exclus sont listés pour revue, jamais ajoutés automatiquement. Le build et le déploiement ne lancent pas d'import réseau.

Relevé effectué : 3 029 entrées distantes, 2 902 montres conservées, deux statuts de commande passés à indisponible (Lip 671265 et Timex TW2W59800), aucun changement de prix. Les 127 autres entrées sont « nouvelles ou exclues », pas nécessairement de nouvelles montres.

`refresh-feature-specs.mjs --references=...` effectue un contrôle documentaire ciblé. Onze fiches ont été relues ; trois Longines ont été laissées intactes à cause des redirections. Les corrections documentées de `tempus-spec-overrides.json` sont réappliquées, notamment le rose NJ0200-50Z : le tableau Tempus dit bleu alors que titre et photo correspondent au rose. Le mouvement automatique SRPB41J1 vient du tableau exact. Les dates de caractéristiques et celles des offres sont distinctes. Les dates techniques enregistrées en UTC peuvent porter le 13 novembre alors que le relevé se déroule le 14 à Paris.

Pas de stock en temps réel ni de tâche récurrente activée. Une vraie commande et l'attribution d'une commission n'ont pas été testées.

## Référencement : observations dans les comptes

Google Search Console : le sitemap actualisé a été renvoyé après déploiement, avec succès et **202 URL découvertes** au 14 novembre. L'inspection actuelle de `https://cadrin.fr/` indique **« Cette URL est sur Google »**, **« La page est indexée »**, HTTPS. Le rapport général des pages est encore en traitement. Cela ne prouve pas l'indexation de toutes les pages, notamment des nouveaux dossiers.

Bing : sitemap initialement en succès, 178 URL découvertes, sans erreur ni avertissement. Après déploiement, le sitemap a été resoumis et le statut **Processing** observé ; le nouveau traitement reste à terminer. L'accueil est **discovered but not crawled**. Une demande d'indexation a été envoyée et le statut **Indexing requested** observé. L'indexation Bing n'est pas annoncée comme acquise.

Preuves : `evidence/retention/google-home-indexed.png`, `google-indexation.png`, `bing-sitemap.png`, `bing-home-inspection.png`, `bing-requested.png`.

## Vérifications locales

- Astro : zéro erreur, zéro avertissement ; cinq indications d'imports inutilisés dans le dossier marketing préexistant, laissé intact.
- Production : 203 documents HTML, 202 routes publiques, canonicals, hreflang, robots, sécurité et liens affiliés vérifiés. Plus gros bundle JavaScript gzip : 14 302 octets ; ce n'est pas un score Lighthouse.
- Preview : noindex conservé par défaut.
- Contrôles éditoriaux stricts et données : réussis, dont les nouveaux dossiers, droits des 14 photos/références, liens suspendus et cas adverses d'actualisation.
- Hébergement Cloudflare local : 215 contrôles réussis.
- Parcours FR : 106 vues, 357 liens, aucune erreur signalée.
- Parcours EN : 94 vues, 354 liens, 41 pages sans JavaScript, aucune erreur signalée.
- Nouvelle suite : favoris au clavier, persistance, suppression et restitution du focus, partage/import, comparaison, langue, lien malformé, synchronisation entre onglets, stockage/presse-papiers bloqués. 25 vues à 360/390/768/1440/1920 px, trois gabarits mobiles contrôlés avec axe, 18 routes sans JavaScript.
- Régression des parcours précédents : filtres, menu mobile et Échap, liens affiliés, comparateur, consentement de mesure, absence de requête de mesure avant consentement et fonctionnement sans JavaScript.

Captures avant : `evidence/retention/before-guides-{390,1440}.png` (largeurs PNG vérifiées : 375 et 1 425 px, la capture Chrome excluant les 15 px de barre de défilement). Après : `evidence/retention/after/` (marques, Longines, Tsuyosa, favoris, guides), largeurs PNG 390 et 1 440 px ; les captures publiques de `live/` ont les mêmes largeurs vérifiées. Les captures ont été ouvertes : suggestion de langue déplacée pour ne plus couvrir le contenu, pied de page réparti en deux colonnes, marges des cartes resserrées et espace supérieur des favoris corrigé.

Lancement local : `npm run dev` (preview noindex). Simulation production : `$env:SITE_STAGE='production'`, `npm run build`, puis `$env:PORT='4340'` et `node scripts/serve-cloudflare.mjs dist-production`. Redémarrer ce serveur après un nouveau build.

## Publication

Commit de production `43dfbe6a23f0fbea3cde33b617a1bbd5f59d9d93`, build Cloudflare `476c92d1-772d-4ebf-9f02-bc7c8469026d` terminé avec succès, version Worker `e3750cfd-e8e5-415a-977c-0ee55ca1918c`. Les 202 routes publiques ont été vérifiées après déploiement (HTTP 200, indexation autorisée et canonical), ainsi que la vraie 404. Six captures publiques desktop/mobile, photos décodées, enregistrement/import/partage/comparaison de favoris : aucune erreur signalée. Rapport et captures dans `evidence/retention/live/`. Le sitemap Google resoumis a immédiatement indiqué 202 URL découvertes ; cela reste distinct de leur indexation. Aucun DNS ni forfait n'est modifié pour cette itération.
