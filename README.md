# CADRIN

Média horloger en français et en anglais construit à partir d’ALLURE. Astro 7.4.11, TypeScript, HTML statique, bordeaux et ivoire. Version de production indexable en ligne sur Cloudflare ; les builds locaux restent en prévisualisation noindex par défaut. Voir [la configuration d’hébergement](docs/cadrin-hosting.md).

```powershell
cd D:\Affi_montres
$env:PATH = "$PWD\.tmp\node24;" + $env:PATH
npm run dev -- --port 4321
```

Preview : http://127.0.0.1:4321/ — noindex par défaut.

- [Audit transversal et sélection visuelle](docs/cadrin-final-audit.md)
- [Orient et comparatif Bambino / Presage](docs/cadrin-orient-editorial.md)
- [Fiabilité des données du catalogue](docs/cadrin-catalogue-trust.md)
- [Finition du parcours, comparateur et favoris](docs/cadrin-quality.md)
- [Comparatif G-Shock, guide étanchéité et filtre documenté](docs/cadrin-editorial-water.md)
- [Dossiers de marque, comparatifs et actualisation contrôlée](docs/cadrin-retention.md)
- [Parcours d’achat, choix guidé et prix France](docs/cadrin-conversion.md)
- [Audit de sélection, nouveaux guides et captures](docs/cadrin-selection-audit.md)
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

Le sélecteur `/trouver-ma-montre/` propose un choix guidé parmi dix références puis ouvre le catalogue complet. Les six analyses détaillées restent dans `/analyses/`. L’explorateur `/catalogue/` rassemble 2 902 fiches marchandes de 24 marques avec photos Tempus, filtres et comparaison de trois modèles. Les quatorze guides FR/EN, cinq dossiers de marque et cinq comparatifs sont illustrés et reliés aux outils. La liste de favoris est locale, partageable et limitée à douze modèles. Deux anciennes fiches sans destination exacte restent archivées et exclues de production.

Les liens produits Tempus portent tous `bg_ref=bDlTL8AyKb` et `rel="sponsored"`, y compris les citations marchandes. La construction est centralisée et contrôlée au build. L’autorisation photographique déclarée par le propriétaire est consignée dans `licenses/tempus-media.md`. Les prix sont des relevés datés, hors livraison ; précommande, sur commande et stock physique ne sont pas confondus. WELCOME10 est présenté avec ses exclusions, sans remise appliquée artificiellement aux prix.

Pour actualiser les offres : `npm run catalogue:refresh`, examiner `evidence/tempus-refresh/report.json`, puis `npm run catalogue:apply` si aucun blocage ne subsiste. Cette procédure préserve les caractéristiques, les photos et les corrections validées ; voir `docs/cadrin-retention.md`. Les imports historiques sont des outils de maintenance, pas la commande habituelle de mise à jour. Le build ne lance aucun import réseau. Pour la production : définir `$env:SITE_STAGE='production'`, exécuter `npm run build`, `npm run launch:check` et `npm run hosting:check`. Ne pas assimiler les tests locaux à une conversion affiliée réelle.
