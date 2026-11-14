# Catalogue : couleurs, fonctions et sources

Livraison du 14 novembre 2026. Cette itération corrige la fiabilité de la sélection existante, sans ajouter de références ni renouveler les prix ou les disponibilités.

## Changements

- 937 fiches corrigées sur les 2 902 du catalogue. Le différentiel porte exclusivement sur `dial`, `dialColors` et `functions`. Références, destinations, photos, prix, catégories, mouvements et statuts de commande conservés.
- Lorsqu'aucun tableau technique correspondant à la référence n'est disponible, l'extraction de couleur ne garde que les familles explicitement rattachées au mot « cadran ». Les fragments comme « rouge ajoute une touche » deviennent « Rouge ». Les contextes négatifs ou comparatifs détectés restent non renseignés. Il s'agit de familles de couleur, pas d'une certification de nuance exacte.
- Les fonctions ne sont plus déduites de la simple présence d'un mot dans une description. Une mention historique de chronographes ne classe plus l'Auricoste T26DLC dans ce filtre. Tableau technique correspondant, correction documentée ou mention explicite Chronographe/GMT dans le titre sont les sources admises. Le chronomètre et l'alarme de la F-91W-1YEG sont conservés via une correction documentée issue de sa description Tempus.
- Les filtres de commande excluent les destinations dont l'achat a été suspendu. Les fiches restent consultables sans ce filtre.
- Une carte unique occupe toute la grille sur mobile, jusqu'à 700 px. Les grilles de plusieurs résultats sont conservées.
- Les 80 occurrences de citations des guides, analyses et dossiers publiés disposent d'un libellé de document ou de référence en anglais. La source du guide quartz pointe maintenant vers l'explication technique Seiko, plutôt que sa page historique.
- Les liens produits actifs gardent le chemin exact et le paramètre central `bg_ref=bDlTL8AyKb`. Aucune construction manuelle par article.

## Données et limites

Source d'extraction : le relevé Tempus déjà conservé dans `evidence/tempus-catalogue/raw.json`, les tableaux techniques et les corrections documentées. Ce traitement n'est pas un nouveau relevé de stock. Le mode `--selection-only` protège les autres champs et vérifie la correspondance identifiant/handle avant écriture. Un champ vide signifie que cette méthode ne permet pas de le renseigner, pas que la fonction est absente de la montre.

Le 14 novembre, les collections Longines française et anglaise chez Tempus affichent zéro produit dans la session consultée. Le lien Flagship Heritage Moonphase L4.815.4.02.3 fourni par le propriétaire ouvre une page 404 dans cette session ; une requête distincte redirige vers l'accueil. Il ne mène donc pas actuellement à une fiche achetable vérifiée. Les 620 références Longines enregistrées restent consultables, avec achat suspendu. Cela ne prouve pas une rupture mondiale ni la fin d'un partenariat. Il faut une destination produit de nouveau accessible pour lever cette suspension. Aucune attribution de commission réelle n'a été testée.

## Vérifications exécutées

Candidate isolée dans `.tmp/trust-release`, issue du HEAD existant avec uniquement les fichiers concernés superposés. Les dossiers locaux non suivis ne font pas partie du build.

- `npm run check` : 0 erreur, 0 avertissement, 0 indication sur cette candidate.
- `npm run launch:check` : PASS, contrôles de publication conservés ; contrôle des liens du catalogue et nouveau test `catalogue-trust-check.mjs` inclus.
- Build `SITE_STAGE=production npm run build` : 207 routes publiques, 208 pages HTML, pas d'erreur de contrôle de sortie ; maximum de JavaScript initial compressé annoncé par le contrôle : 13 891 octets.
- `SITE_STAGE=production npm run hosting:check` : 220 contrôles, PASS. Une première invocation sans cette variable cherchait le dossier preview `dist` et a échoué ; elle a été relancée avec la configuration correspondant à la candidate de production.
- `catalogue-trust-qa.mjs` : 12 mises en page (320, 390, 768 et 1 440 px), 4 états de filtre dont le retour arrière, 3 audits axe sans violation détectée, 3 routes sans JavaScript, aucun événement d'erreur JS. Contrôle du code affilié et de `rel=sponsored` sur les liens observés.
- `quality-qa.mjs` : 36 mises en page, récupération après recherche vide, comparaison, favoris, clavier, menu mobile, six parcours sans JS et repli si le JSON du catalogue échoue. Relancé après la correction de largeur ; PASS.
- `npm run qa:i18n` sur la candidate finale : 98 vues, 386 liens internes, 43 routes sans JavaScript, aucun échec ni erreur JS.

Les captures avant/après ont été ouvertes et examinées. Le défaut de demi-largeur sur résultat unique a été corrigé puis recapturé. Aucun nouveau score Lighthouse n'est revendiqué dans cette livraison.

## Preuves et reproduction

- Différentiel structuré : `evidence/catalogue-quality-changes.json`.
- Captures avant : `evidence/catalogue-trust/before/{type26,colour,sources}-390.png`.
- Captures après : `evidence/catalogue-trust/after/{type26,colour,sources}-{390,1440}.png` ; images de viewport dans le même dossier.
- Rapports : `evidence/catalogue-trust/{after,quality-final,i18n}/report.json`, journaux `evidence/catalogue-trust-*.log`.
- Pages : `/catalogue/?q=MTP-1302PD-4AVEF`, `/catalogue/?q=T26DLC`, `/catalogue/?brand=Longines&order=open`, `/en/guides/watch-water-resistance-3-5-10-20-atm/`.
- Prévisualisation : `npm run dev -- --port 4321`. Production locale PowerShell : `$env:SITE_STAGE='production'`, `npm run build`, puis `node scripts/serve-cloudflare.mjs dist-production`.

Cette livraison améliore des défauts démontrés ; elle ne constitue pas une certification globale « S+ », une validation manuelle de chaque caractéristique des 2 902 références ou une garantie de revenus.

## Publication observée

- Commit `cb76873e76e4e6324d7e1259476a0d2e07817abe`, build Cloudflare `3968b983-0ac0-490b-9f91-8876708dd115` : succès observé.
- `QA_ORIGIN=https://cadrin.fr node scripts/catalogue-trust-qa.mjs` : PASS avec les mêmes 12 mises en page, 4 états de filtre, 3 audits axe et 3 routes sans JavaScript. Preuves dans `evidence/catalogue-trust/live/`.
- Contrôle HTTP public : trois pages 200 avec canonical exact, alternates FR/EN, indexation autorisée et liens affiliés ; catalogue JSON corrigé ; route inexistante 404 ; robots autorisant l'exploration. Résultats horodatés dans `evidence/catalogue-trust/live-metadata.json`.
- Ouverture supplémentaire dans le navigateur connecté, viewport mesuré 390 × 844 : la Casio MTP-1302PD-4AVEF affiche Rouge, le bouton pointe vers sa destination exacte avec `bg_ref=bDlTL8AyKb`. Capture `evidence/catalogue-trust/live-connected-390.png`, ouverte et examinée.
