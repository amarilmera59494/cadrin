# CADRIN

Média horloger en français et en anglais construit à partir d’ALLURE. Astro 7.4.11, TypeScript, HTML statique, bordeaux et ivoire. Version de production indexable préparée pour Cloudflare ; les builds locaux restent en prévisualisation noindex par défaut. Voir [la configuration d’hébergement](docs/cadrin-hosting.md).

```powershell
cd D:\Affi_montres
$env:PATH = "$PWD\.tmp\node24;" + $env:PATH
npm run dev -- --port 4321
```

Preview : http://127.0.0.1:4321/ — noindex par défaut.

- [Catalogue Tempus, affiliation, photos et vérifications actuelles](docs/cadrin-tempus-affiliation.md)
- [Version bilingue, nouveaux guides et limites de publication](docs/cadrin-international.md)
- [Sélection et vérification des références](docs/cadrin-product-readiness.md)
- [Itération 03 et captures avant/après](docs/cadrin-iteration-03.md)
- [Sélecteur, guides d’achat et relevé Tempus](docs/cadrin-iteration-04.md)
- [Design et composants](docs/cadrin-design.md)
- [Contenus, sources et affiliation](docs/cadrin-content.md)
- [Vérifications et captures](docs/cadrin-qa.md)
- [Commandes, Cloudflare et prérequis](docs/cadrin-launch.md)

La version anglaise démarre sur `/en/`, son sélecteur sur `/en/watch-finder/`. Contact : `/contact/` ; informations administratives : `/mentions-legales/` et `/confidentialite/` (texte existant conservé à la demande explicite du propriétaire ; pas de certification indépendante).

Routes principales : `/`, `/catalogue/`, `/en/catalogue/`, `/selections/`, `/selections/trois-montres-au-quotidien/`, `/montres/seiko-srpe55k1/`, `/montres/citizen-aw0102-13ae/`, `/montres/casio-f91w/`, `/guides/`, `/guides/choisir-premiere-montre/`, `/notre-methode/`, et la 404.

Le sélecteur `/trouver-ma-montre/` compare six références analysées. L’explorateur `/catalogue/` rassemble 2 901 fiches marchandes de 23 marques avec photos Tempus, filtres et comparaison de trois modèles. Les huit guides FR/EN sont publiables, illustrés et reliés aux outils. Deux anciennes fiches sans destination exacte restent archivées et exclues de production.

Les liens produits Tempus portent tous `bg_ref=bDlTL8AyKb` et `rel="sponsored"`, y compris les citations marchandes. La construction est centralisée et contrôlée au build. L’autorisation photographique déclarée par le propriétaire est consignée dans `licenses/tempus-media.md`. Les prix sont des relevés datés, hors livraison ; précommande, sur commande et stock physique ne sont pas confondus. WELCOME10 est présenté avec ses exclusions, sans remise appliquée artificiellement aux prix.

Pour rafraîchir le catalogue : `node scripts/import-tempus-catalogue.mjs --refresh`, puis contrôle des changements et des exemples éditoriaux. Pour la production : définir `$env:SITE_STAGE='production'`, exécuter `npm run build`, `npm run launch:check` et `npm run hosting:check`. Ne pas assimiler la validation documentaire à un essai physique ni à une conversion affiliée réelle.

Les concepts d’origine sont conservés dans `archives/concepts/` et exclus physiquement des routes Cadrin. `npm run dev:archives` les sert sur le port 4322. Les comptes rendus des itérations précédentes décrivent leur état historique ; la mise en ligne du 13 novembre est documentée séparément.
