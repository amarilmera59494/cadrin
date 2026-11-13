# Contenus, sources et destinations

Les collections Astro typées sont dans `src/content.config.ts`. Le corpus volontairement court comprend six références dans le sélecteur, deux anciennes fiches documentaires, une sélection de trois modèles et cinq guides. Les quatre chapitres d’origine ont été conservés et ajustés dans `src/content/guide/` ; aucun essai physique n’est revendiqué.

Chaque fiche Markdown conserve titre, description, statut, sources avec URL HTTPS, date de vérification, auteur et relecteur connus ou `null`, droits, photo, prix et stock. Une date ne change pas au build. Les valeurs inconnues restent nulles. Le frontmatter actuel utilise des valeurs JSON valides en YAML, également lisibles par le contrôle indépendant `content:check` : conserver ce format, y compris pour les listes de sources et de faits.

## Ajouter ou revoir une montre

1. Créer `src/content/watches/slug.md`, à partir d’une fiche existante. Vérifier la référence et les caractéristiques auprès des sources concernées. Un champ `facts` n’est pas une permission de compléter de mémoire.
2. Donner une proposition d’usage concrète dans `note`, et un point à vérifier dans `limit`. Les filtres utilisent `movement`, `size` et `use`. Un `size: null` exclut la montre des filtres de dimensions connues et l’inclut dans « Dimensions à confirmer ».
3. Fournir un visuel correspondant exactement au modèle, son auteur, sa source et les droits écrits dans le registre. Ne pas employer une ambiance comme photo produit.
4. Ajouter son identifiant à la sélection, limitée à trois à six montres. L’ordre vient de la sélection et n’est pas lié à une commission.
5. Passer les contrôles et faire relire. `published` ne suffit pas : sources, date, relecteur, droits approuvés et image exacte pour les montres sont requis. Une sélection dont une montre est non publiable reste exclue en production.

## Guide et sélection

`src/content/guides/choisir-premiere-montre.md` porte l’introduction et les métadonnées du guide ; les quatre chapitres partagés portent son fond. Ce guide historique conserve son gabarit. Les autres guides rendent le corps Markdown et son sommaire, avec les identifiants des montres dans related.

Les sélections sont dans `src/content/selections/`. Leurs liens vers les fiches sont rendus dans le HTML initial. Le sélecteur utilise le prix observé en euros sur la référence exacte chez Tempus et la date priceCheckedAt. La source est la destination marchande de la fiche. Les budgets du guide sont des repères de recherche, pas des offres.

## Marchands et affiliation

`src/data/destinations.ts` est le registre actif. Une destination doit avoir une URL HTTPS sans identifiants de connexion, un hôte attendu, la référence exacte et une date de vérification. Le composant `CadrinMerchantLink` est partagé par les fiches ; navigation dans le même onglet. `affiliate: true` ajoute `rel="sponsored"` et l’événement local `affiliate_click` (contenu, référence, marchand, emplacement). Aucun transport réseau, cookie ni outil analytique. La configuration actuelle ne contient aucun lien rémunéré.

Les trois destinations Tempus et leurs divergences sont consignées dans [le dossier de sélection](cadrin-product-readiness.md). Les anciennes SRPE55 et AW1231-58E restent consultables sous leur URL d’origine, avec uniquement un lien documentaire. Les exemples du guide restent attribués à ces références initiales.

## Ajouter une photographie exacte

Placer le fichier dans `public/images/products/`, puis renseigner `src/data/product-photos.ts` avec son chemin public, la référence complète, le type (`packshot` ou `worn`), les vraies dimensions, le texte alternatif, le crédit, la source et le chemin de la permission conservée sous `licenses/`. Une photo portée peut aussi définir `focus`, par exemple `50% 40%`, après vérification visuelle du cadrage. Conserver les justificatifs dans le dossier de travail, hors des assets publics.

Après contrôle de la permission pour l’usage concerné, reporter le chemin dans `image` de la fiche et valider `rights`. Le composant exige une correspondance avec le registre et la référence. `content:check` vérifie la présence du fichier et du justificatif. Relancer ce contrôle et les captures sur les deux formats après réception des photos. Le statut éditorial et le lien affilié se règlent séparément.
