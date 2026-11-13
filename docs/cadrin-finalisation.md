# CADRIN — guides illustrés et préparation du lancement

Itération du 13 novembre 2026. L'éditeur demande une version indexable et déclare la situation juridique finalisée. Le dépôt contient néanmoins encore une page de mentions explicitement incomplète et une politique de conservation à finaliser. Le texte définitif lui a été demandé ; aucune adresse, aucun téléphone ni accord de relecture n'ont été inventés. Les questions sur le texte final et les droits des photos restent en attente.

## Changements livrés

Les huit guides FR/EN disposent d'une ouverture photographique responsive et créditée, avec une légende pédagogique spécifique. Les images proviennent des trois photographies Unsplash déjà documentées dans SOURCES.md et le registre. Elles restent des ambiances hors sélection, jamais les photographies des références commerciales.

Chaque guide propose trois repères pratiques propres à son sujet. Le guide des tailles compare graphiquement les cotes fabricant Seiko SRPE55 (40 / 44,6 mm) et SRPG35 (39,4 / 48,1 mm). Les barres partent de zéro et partagent l'échelle 0–50 mm. Les chiffres restent lisibles sans JavaScript et ne prédisent pas le confort.

Les boutons marchands conservent leurs destinations produit exactes. Le nouveau contrôle `node scripts/check-merchant-links.mjs` suit les redirections des 12 URL FR/EN, vérifie HTTP 200, le domaine, le chemin produit et la référence dans le titre. Les 12 ont réussi. Aucun stock, droit d'image ou suivi affilié n'est déduit de ce test. Les deux fiches purement documentaires sans destination exacte restent sans bouton marchand.

Un encart Tempus accessible au clavier et sans JavaScript figure près du bouton marchand et dans le guide d'achat en ligne. Il distingue offre promotionnelle, conditions, déclarations du vendeur et garanties légales. Les informations sont datées, sans compte à rebours, prix remisé calculé ni promesse d'application du code.

## Recherche Tempus

Sources consultées le 13 novembre 2026 :

- https://tempusshop.com/pages/code-promo : WELCOME10 annoncé pour la première commande (−10 % dans le bandeau) ; exclusions des nouveautés et articles déjà remisés, non-cumul et restrictions possibles par code. Code non testé au paiement. Ni code Cadrin ni remise exclusive.
- https://tempusshop.com/pages/pourquoi-tempus-shop : Tempus se déclare distributeur officiel, annonce montres neuves, boîte, papiers et carte de garantie datée/tamponnée. Les recherches sur les domaines des fabricants n'ont pas confirmé un agrément individuel de toutes les marques. Ne pas transformer cette déclaration en certification indépendante.
- https://tempusshop.com/pages/faq : préparation et transport sont distincts. Les pages et instantanés consultés diffèrent entre 99 et 129 euros, et sur le périmètre du relais offert. Aucun seuil universel ni délai total de 48 h promis.
- https://tempusshop.com/policies/refund-policy : rétractation annoncée de 14 jours, frais de retour normalement à l'acheteur sauf défaut/non-conformité, conditions spécifiques avant ajustement ou personnalisation. Le droit légal n'est pas présenté comme un privilège exclusif au marchand.
- https://tempusshop.com/pages/service-apres-vente-et-garantie : interlocuteur et conditions à consulter. Ne pas généraliser une durée de garantie constructeur à toutes les références.
- https://tempusshop.com/policies/legal-notice : réutilisation des images subordonnée à une autorisation écrite préalable. Les photos commerciales n'ont donc pas été copiées.

La recherche Wikimedia a trouvé des F-91W sous licence libre, mais sans établir le suffixe F-91W-1YEG de notre sélection. Ces photos ne sont pas intégrées comme photos produit exactes.

## Éléments attendus pour les photographies produit

Pour les six références marchandes : F-91W-1YEG, AW0102-13AE, SRPE55K1, NJ0150-81E, RA-AC0M04Y et EM1201-52L. Fournir le fichier exact, sa provenance et son crédit, ainsi que l'autorisation couvrant cadrin.fr, ses pages FR/EN, cartes, fiches et guides à vocation commerciale. Préciser les éventuelles limites de durée, territoire et recadrage. AW1231-58E et SRPE55 sont aussi nécessaires si leurs fiches documentaires doivent être publiées avec les contrôles actuels.

Le registre `src/data/product-photos.ts` et le composant WatchPhoto sont déjà prêts à recevoir les fichiers. Inventaire local : `evidence/launch-final/photos-required.json`. Une admission au programme d'affiliation ne constitue pas automatiquement une licence photo.

## Contrôles

- Astro : 81 fichiers, zéro erreur, avertissement ou hint.
- Build preview : 50 routes + 404, maximum 2 667 octets gzip de JavaScript initial ; 63 contrôles HTTP réussis.
- QA française : 74 couples page/largeur, 152 liens et ancres, aucune erreur ni échec.
- QA anglaise : 62 couples page/largeur, 149 liens et ancres, 25 pages sans JS, aucune erreur ni échec. La suite française couvre également 25 pages sans JS.
- Inspection dédiée des 16 guides à 390, 768 et 1440 px : 48 contrôles sans débordement ni erreur ; audits axe mobiles sans violation détectée.
- Encarts Tempus FR/EN : ouverture au clavier avec et sans JS, bonnes destinations marchandes, pas de débordement, audits axe sans violation détectée.
- Captures avant/après locales dans `evidence/launch-final/before/`, `guides/`, `details/`, `fr/` et `en/`. Ouvertures desktop et mobile inspectées.

Les contrôles de sitemap et d'exclusion ne supposent plus éternellement dix pages publiques et des guides en brouillon : ils comparent les manifestes réellement générés. Ils ne changent ni la sélection éditoriale, ni la garde de publication. La répétition de production passe ; `launch:check` reste en échec sur les données non validées. La version indexable n'est donc pas déclarée finalisée.


Lighthouse 13.6.0 mobile local, trois passages : accueil 99/99/99 ; guide première montre 99/98/99. Médiane 99/100 en performance, 100/100 en accessibilité sur les deux routes ; CLS médian 0. Ces mesures de laboratoire portent sur le guide avec sa nouvelle photo, pas sur tous les appareils. La dernière correction ne change que le contour de focus de l'encart Tempus : il reste visible sans chevaucher le texte suivant.
