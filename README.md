# CADRIN

Média horloger francophone construit à partir d’ALLURE. Astro 7.4.11, TypeScript, HTML statique, bordeaux et ivoire. V1 en prévisualisation publique sur Cloudflare, en noindex. Voir [la configuration d’hébergement](docs/cadrin-hosting.md).

```powershell
cd D:\Affi_montres
$env:PATH = "$PWD\.tmp\node24;" + $env:PATH
npm run dev -- --port 4321
```

Preview : http://127.0.0.1:4321/ — noindex par défaut.

- [Sélection et vérification des références](docs/cadrin-product-readiness.md)
- [Itération 03 et captures avant/après](docs/cadrin-iteration-03.md)
- [Sélecteur, guides d’achat et relevé Tempus](docs/cadrin-iteration-04.md)
- [Design et composants](docs/cadrin-design.md)
- [Contenus, sources et affiliation](docs/cadrin-content.md)
- [Vérifications et captures](docs/cadrin-qa.md)
- [Commandes, Cloudflare et prérequis](docs/cadrin-launch.md)

Routes : `/`, `/selections/`, `/selections/trois-montres-au-quotidien/`, `/montres/seiko-srpe55k1/`, `/montres/citizen-aw0102-13ae/`, `/montres/seiko-srpe55/`, `/montres/citizen-aw1231/`, `/montres/casio-f91w/`, `/guides/`, `/guides/choisir-premiere-montre/`, `/notre-methode/`, et la 404.

Le sélecteur `/trouver-ma-montre/` compare six références vérifiées chez Tempus. Les guides par budget, cadeau et collection sont accessibles depuis `/guides/`. Les six prix sont des relevés datés, hors livraison. Les huit fiches documentaires et les cinq guides restent en brouillon. Les liens marchands sont ordinaires. Les droits photographiques, la relecture et les informations administratives restent à fournir avant lancement.

Les concepts d’origine sont conservés dans `archives/concepts/` et exclus physiquement des routes Cadrin. `npm run dev:archives` les sert sur le port 4322. Les comptes rendus des itérations précédentes décrivent leur état historique ; la mise en ligne du 13 novembre est documentée séparément.
