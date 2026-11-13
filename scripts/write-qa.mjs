import {readFile,writeFile} from 'node:fs/promises';
const report=JSON.parse(await readFile('evidence/final/browser-report.json','utf8'));
const audits=JSON.parse(await readFile('evidence/lighthouse/summary.json','utf8'));
const build=JSON.parse(await readFile('evidence/build-report.json','utf8'));
const metrics=audits.map(a=>`| ${a.route} | ${a.performance} | ${a.accessibility} | ${(a.LCP_ms/1000).toFixed(2)} s | ${a.CLS.toFixed(3)} | ${a.TBT_ms} ms |`).join('\n');
const routes=['concepts',...['revue','mesure','allure'].flatMap(d=>[`concepts-${d}`,`concepts-${d}-guide`])];
const captures=routes.map(r=>`| ${r} | [1440 px](evidence/final/${r}-1440.png) | [390 px](evidence/final/${r}-390.png) |`).join('\n');
await writeFile('QA.md',`# QA — résultats réellement obtenus

Build statique local vérifié le **12 novembre 2026**, sans publication. Navigateur : Chrome ${report.browser}, Playwright 1.65.0, Axe 4.14.0, Lighthouse 13.6.0.

## Vérification finale

- \`npm run check\` : 0 erreur, 0 avertissement, 0 hint.
- \`npm run build\` : 9 pages statiques générées (7 concepts + redirection racine + 404), contrôle noindex et budget JavaScript réussi.
- \`npm run qa\` : **${report.viewports.length} vues** = 7 pages × 1440, 768, 390 et 360 px. HTTP 200, aucun débordement horizontal de page, aucune image cassée, un H1 par page.
- **14 audits Axe** (desktop 1440 et mobile 390), règles WCAG 2/2.1/2.2 A/AA : aucune violation détectée. Ce résultat automatique ne constitue pas un audit WCAG complet.
- **${report.links.length} destinations internes** et ancres vérifiées : aucun lien cassé. Les sources externes ont été consultées pour la documentation, pas soumises à un test de disponibilité marchand.
- Clavier : lien d'évitement, menus natifs ouverts avec Entrée, fermeture Échap, détails de sélection ouverts avec Entrée, ancres des guides. Tableau des trois guides : défilement clavier horizontal vérifié à 390 px (40 px après flèche droite ; preuve \`evidence/table-keyboard.json\`).
- Filtres MESURE : Automatique → 2 résultats ; Automatique + jusqu'à 38 mm → 0 + message ; réinitialisation → 6 ; Bureau → 1. Compteur annoncé par aria-live.
- JavaScript désactivé : contenu et guide visibles sur les sept pages, six références par accueil, menus natifs opérationnels. Filtres masqués et explication honnête sans JS.
- Reduced motion : toutes les animations et transitions calculées sont désactivées sur les sept pages. Aucun contenu ne dépend d'une animation d'entrée.
- Console des pages locales : **${report.errors.length} erreur**. Aucun traceur installé. Contrôle réseau des trois guides : zéro ressource externe ; seules DM Sans et la famille de la direction sont demandées.
- \`npm run cloudflare:check\` : dry-run accepté, 61 fichiers lus, aucun téléversement ni binding ; preuve \`evidence/cloudflare-dry-run.txt\`.
- \`npm run deploy\` : sortie 1 attendue, publication refusée. Import de la configuration avec \`PUBLIC_RELEASE=1\` : refus attendu confirmé.
- Dépôt GroomSolo voisin : état Git toujours propre après la livraison.

Rapport détaillé : [browser-report.json](evidence/final/browser-report.json). Scripts de contrôle livrés dans \`scripts/\`.

## Mesures Lighthouse mobiles

Un passage final par URL, après corrections, sur \`astro preview\`. Émulation mobile **412 × 823**, DPR 1,75, réseau simulé (RTT 150 ms, débit 1638,4 Kbit/s), ralentissement CPU ×4. Mesures locales de laboratoire, pas une médiane de plusieurs campagnes ni des métriques terrain.

| Page | Performance | Accessibilité | LCP labo | CLS labo | TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
${metrics}

Les cibles Lighthouse ≥95 sont atteintes dans ces passages. **INP terrain non mesuré** ; TBT ne le remplace pas. Les objectifs LCP ≤2,5 s, CLS ≤0,1 et INP ≤200 ms au p75 en production restent à mesurer sur le site public réel. Rapports HTML/JSON et paramètres complets dans [evidence/lighthouse](evidence/lighthouse/), synthèse dans [summary.json](evidence/lighthouse/summary.json).

Budget initial JavaScript gzip calculé à partir des scripts du HTML généré : **${Math.min(...build.map(r=>r.jsGzipBytes))} à ${Math.max(...build.map(r=>r.jsGzipBytes))} octets par page**, hors JSON-LD non exécutable. Pas d'import dynamique ni de framework client. Budget cible de 60 Ko respecté. Il s'agit du poids compressible des scripts, pas du poids total transféré de la page ; voir [build-report.json](evidence/build-report.json).

## Corrections et inspection visuelle

Première passe complète capturée dans \`evidence/pass-1/\`, inspection des accueils et guides desktop/mobile. Défauts constatés puis corrigés :

1. Guide REVUE mobile : la largeur minimale du tableau élargissait la grille parente. \`min-width: 0\` sur les enfants de grille préserve le défilement dans le tableau sans masquer du contenu.
2. ALLURE : contraste du grand folio relevé de #b6a19e à #8b7270.
3. Galerie : suppression des aria-label remplaçant les titres visibles des miniatures, pour conserver un nom accessible cohérent avec le texte.
4. Guide REVUE : espacement accru entre titre et chapeau.

Seconde passe après corrections : tous les contrôles ci-dessus réussis, nouvelles captures. Galerie desktop/mobile, trois accueils et trois guides inspectés ; cadrages, hiérarchie, rythmes, contenus longs, menus et états de sélection contrôlés. Le rendu reste volontairement éditorial sans photos produit, dont les droits manquent.

Corrections techniques pendant la réalisation : balise option manquante, imports de fichiers de police adaptés aux packages installés, import Zod actuel. L'audit Lighthouse initial a nécessité un répertoire de profil et un port de débogage explicites sous Windows ; le script livré utilise un profil neuf et un port libre. Les tentatives interrompues ne sont pas comptées comme audits réussis.

## Captures finales

14 captures pleine page (7 desktop + 7 mobile), plus 14 premiers écrans suffixés \`-top.png\`. Comparaisons assemblées à partir de captures réelles : [desktop](evidence/comparaison-desktop.png) et [mobile](evidence/comparaison-mobile.png).

| Page | Desktop | Mobile |
| --- | --- | --- |
${captures}

## Limites restantes

Pas d'essai sur iPhone/Android physiques, Safari, Firefox ou lecteur d'écran ; pas de test utilisateur ni mesure de conversion. Pas de déploiement Cloudflare : en-têtes servis, cache/CDN, WAF/Access et politique robots publique non validés en ligne. \`astro preview\` ne sert pas les règles de \`_headers\` ; noindex HTML vérifié et en-tête préparé seulement. Pas de validation sociale réelle de l'OG relatif, en attente d'un domaine confirmé. Aucun domaine, compte partenaire, photo produit, prix, stock, essai ni auteur expert présumé. Voir SOURCES.md et README.md avant une éventuelle mise en production.
`);
const cards=routes.map(r=>`<article><h2>${r.replace('concepts-','').replaceAll('-',' / ')}</h2><div><a href="final/${r}-1440.png"><img src="final/${r}-1440-top.png" alt="Premier écran desktop ${r}"><span>Capture desktop complète · 1440 px</span></a><a href="final/${r}-390.png"><img src="final/${r}-390-top.png" alt="Premier écran mobile ${r}"><span>Capture mobile complète · 390 px</span></a></div></article>`).join('');
await writeFile('evidence/captures.html',`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Captures des trois directions</title><style>body{font:16px system-ui;background:#f7f6f2;color:#252522;max-width:1200px;margin:40px auto;padding:20px}h1{font-size:40px}article{border-top:1px solid #bbb;padding:30px 0}article>div{display:grid;grid-template-columns:3fr 1fr;gap:30px}img{width:100%;height:auto;display:block}a{color:inherit}span{display:block;margin:15px 0}@media(max-width:600px){article>div{grid-template-columns:1fr}}</style><h1>Sept pages, deux formats.</h1><p>Captures réelles du build local après correction. Cliquez pour ouvrir les pages complètes.</p>${cards}</html>`);
console.log('QA.md and evidence/captures.html generated from final evidence.');
