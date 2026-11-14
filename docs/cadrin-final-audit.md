# CADRIN — audit transversal et sélection visuelle

État du 14 novembre 2026. Ce document décrit les contrôles de cette livraison. Les rapports des itérations précédentes restent des historiques, pas des attestations actuelles de disponibilité ou de performance.

## Correction issue de l'audit

La sélection de trois montres présentait les premières photos trop loin dans la page. Dans le même navigateur, à 390 × 844 px avec une langue système anglaise et la suggestion de langue visible, la première photo est passée de 1 532,7 à 597,6 px du haut du document. Les captures `evidence/final-audit/selection/{before,after}-matched-390.png` montrent ces deux états ; elles ont été ouvertes. La comparaison porte sur un accès visuel, pas sur un taux de conversion mesuré.

Les trois raccourcis photographiques mènent directement aux fiches. Ils reprennent les fichiers autorisés du registre existant et leurs crédits, dont la réserve Seiko : la fiche SRPE55K1 utilise un visuel nommé SBSA045 chez Tempus. Les montres ne sont pas présentées à la même échelle. Aucun nouveau packshot ni asset généré.

Les filtres secondaires sont repliés au chargement et disponibles dans les deux langues. Une URL déjà filtrée les ouvre. Le retour arrière et avant restaure les choix ; le changement de langue les conserve. La remise à zéro depuis un résultat vide rend les trois cartes visibles et replace le focus sur le premier critère. Sans JavaScript, les photos, fiches et liens restent accessibles ; les filtres interactifs ne sont pas annoncés comme disponibles.

Le contrôle complet a détecté une discordance entre le texte visible des raccourcis et leur nom accessible. Les libellés ARIA redondants ont été retirés pour laisser le texte du lien fournir son nom. Le test ciblé applique désormais les mêmes catégories axe que les suites complètes, dont WCAG 2.1 A et 2.2 AA. Ce correctif précède les résultats finaux ci-dessous.

La mesure Lighthouse suivante a relevé un saut de niveau de titre avant les cartes. Un titre de niveau 2, « Les trois montres en détail », rétablit la structure avant leurs titres de niveau 3. Le test ciblé inclut aussi les bonnes pratiques axe pour couvrir cette régression. Les suites complètes avaient passé avant cette dernière correction limitée au composant de sélection ; les deux routes sont revérifiées ensuite par la suite ciblée et Lighthouse.

## Relecture du périmètre demandé

| Demande | État vérifié / limite |
| --- | --- |
| Préserver ALLURE et le dépôt | Bordeaux, ivoire, composants et architecture conservés. Aucun remplacement du site. `.claude/`, `MEMORY.md` et `marketing/` laissés intacts. |
| Accueil → sélection → fiche → Tempus | Parcours FR/EN testés au clavier, sur mobile et sans JS. Le contrôle des 12 destinations des six fiches détaillées atteint les pages attendues ; ce n'est pas un achat ni une preuve de commission. |
| Liens affiliés homogènes | `affiliateUrl()` ajoute/remplace uniquement `bg_ref=bDlTL8AyKb`, préserve le chemin produit et les autres paramètres. Contrôles de publication conservés, liens commerciaux marqués `sponsored`. Aucun identifiant de suivi inventé. |
| Contenus et outils | 14 guides bilingues, cinq dossiers de marque, cinq comparatifs, six analyses détaillées. Catalogue de 2 902 entrées de 24 marques, choix guidé parmi dix références, comparaison et favoris existants conservés. Ces entrées ne sont pas 2 902 essais ni 2 902 fiches relues individuellement chez le fabricant. |
| Photos et caractéristiques | Registres de droits, photos Tempus, crédits et sources maintenus. Aucun changement de donnée produit dans ce lot. Les corrections et vérifications précédentes sont décrites dans les rapports catalogue et Orient. |
| Présentation mobile | Captures de la sélection aux largeurs 320, 360, 390, 768, 1 440 et 1 920 px, en FR/EN. Captures ouvertes, dont 320 px anglais et filtres mobiles ouverts. Aucune modification globale de taille de police. |
| Accessibilité et absence de JS | Menu, lien d'évitement, filtres, focus, historique et parcours contrôlés. Audits axe automatisés ; pas de certification exhaustive ni de test humain avec lecteur d'écran. |
| Hébergement et SEO | HTML statique Astro, 211 routes publiques et 212 HTML avec la 404. Production indexable ; prévisualisation noindex par défaut. Sitemap, canonicals, alternates, réponses 404, redirections et cache vérifiés par les contrôles du projet. Aucune nouvelle base, dépendance ou modification DNS. |
| Publication | Les restrictions des premiers briefs ont été remplacées par l'autorisation explicite ultérieure de publier. Les mentions légales existantes restent inchangées à la demande du propriétaire ; aucune conformité juridique n'est certifiée. |

## Vérifications de cette livraison

- `npm run check` : zéro erreur, avertissement ou hint dans la copie isolée du dépôt.
- `npm run launch:check` : PASS, aucun blocage retourné par les contrôles existants.
- Build de production : PASS, 211 routes publiques, maximum 13 891 octets gzip pour un fichier JS contrôlé ; ce n'est pas le poids total de toutes les ressources d'une page.
- `npm run hosting:check` : 224 contrôles de production et 228 de prévisualisation, PASS. Le build preview et ses protections restent distincts de la production.
- `npm run qa` : 116 couples page/largeur, 425 liens et ancres, aucun échec ni erreur de console. Rapport `evidence/final-audit/after-fr/browser-report.json`.
- `npm run qa:i18n` : 102 couples page/largeur, 416 liens et ancres, 45 routes sans JS, aucun échec ni erreur de console. Rapport `evidence/final-audit/after-en/report.json`.
- `node scripts/selection-qa.mjs` : 12 mises en page, deux audits axe sans violation détectée, parcours interactif et sans JS dans les deux langues. Rapport `evidence/final-audit/selection/report.json`.
- `node scripts/browser-zoom-qa.mjs` : sept routes à 100 %, 200 % et 400 % dans un profil Chrome temporaire. Fenêtre de 1 440 px ; largeurs intérieures mesurées de 1 424, 712 et 356 px CSS. Aucun débordement horizontal de page, CSS zoom resté à 1. Captures via CDP pour éviter le recadrage incorrect des captures Playwright au zoom natif ; exemples ouverts. Rapport `evidence/final-audit/zoom/report.json`.
- `node scripts/check-merchant-links.mjs` : 12/12 destinations de fiches détaillées vérifiées. Rapport `evidence/launch-final/merchant-links.json`. Le contrôle ne mesure ni stock réel, ni consentement au suivi, ni attribution de vente.

Commandes locales : `npm run dev -- --port 4321` pour le développement noindex ; pour les tests de production, définir `SITE_STAGE=production`, construire, puis `PORT=4344 node scripts/serve-cloudflare.mjs dist-production`. Définir `QA_ORIGIN=http://127.0.0.1:4344` pour les suites navigateur. Les captures et rapports locaux sont exclus de Git et du site public.

## Mesures de performance

Lighthouse 13.6.0, profil mobile simulé, trois passages par route sur le serveur Cloudflare local. Médianes :

| Page | Performance | Accessibilité automatique | LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| Sélection avant | 100 | 100 | 0,761 s | 0 |
| Sélection finale | 100 | 100 | 0,766 s | 0 |
| Accueil | 98 | 100 | 2,484 s | 0 |
| Guide première montre | 100 | 100 | 0,911 s | 0 |
| Catalogue | 100 | 100 | 1,065 s | 0 |

La sélection intermédiaire avait un score d'accessibilité de 98 à cause du saut de titre décrit plus haut. Les trois passages finaux sont conservés séparément dans `evidence/final-audit/performance-selection-final/summary.json` ; les mesures initiales et des autres pages dans `evidence/final-audit/performance/summary.json`. Les quelques millisecondes de différence avant/après ne démontrent pas un gain ou une régression significative. Ces scores ne sont pas une mesure sur réseau mobile réel, ni des Core Web Vitals terrain, ni une certification d'accessibilité.

## Limites qui subsistent

Longines reste consultable mais ses boutons d'achat sont suspendus : les contrôles du 14 novembre ont trouvé des redirections vers l'accueil ou une 404 sur les destinations ciblées, dont la Flagship Heritage Moonphase fournie par le propriétaire. Les collections FR/EN consultées n'affichaient aucun produit. Ce constat n'est ni une rupture mondiale ni un contrôle individuel des 620 références enregistrées. Une fiche Tempus exacte de nouveau accessible permettra de réactiver ces liens, avec le même code affilié.

Les commissions réelles, les performances sur appareils physiques Safari/iOS, les Core Web Vitals terrain et les résultats SEO/conversion ne sont pas établis par ces tests locaux. Aucun score commercial « S+ » ni revenu garanti n'est déduit de l'audit. Le prix et la disponibilité continuent d'exiger une actualisation régulière par la procédure existante.
