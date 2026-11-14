// « Ce qu'en disent les tests publiés » : synthèse de tests et d'avis publics, consultés le 14/11/2026.
// Règles : jamais « nous l'avons testée » ; chaque point revient chez plusieurs sources ou découle d'une caractéristique vérifiable ;
// formulation propre à Cadrin, sources citées et liées. Aucun texte repris d'une source.
export type ReviewSynthesis = {id: string; family: string; match: RegExp; plus: string[]; minus: string[]; note?: string; sources: {label: string; url: string}[]};

export const reviewSyntheses: ReviewSynthesis[] = [
  {id: 'tsuyosa', family: 'Citizen Tsuyosa', match: /^NJ0150-/,
    plus: ['Une finition souvent jugée au-dessus de son prix, avec un bracelet intégré qui fait « montre chère »', 'Le verre saphir et 50 m d’étanchéité, rares à ce tarif pour une automatique', 'Le remontage manuel et le stop-seconde du calibre 8210'],
    minus: ['Une couronne petite, difficile à saisir', 'Le boîtier accroche les manches longues ajustées', 'Une automatique : elle s’arrête après environ 42 heures sans être portée'],
    sources: [{label: 'Avis clients Citizen (reviews.io)', url: 'https://www.reviews.io/product-reviews/store/citizenwatch-com/NJ0150-56X?page=1'}, {label: 'Dappered, essai de la Tsuyosa 40 mm', url: 'https://dappered.com/2025/09/in-review-the-citizen-tsuyosa-automatic-40mm-watch/amp'}, {label: 'Citizen, fiche du calibre 8210', url: 'https://www.citizenwatch.com/us/en/product/NJ0150-56A'}]},
  {id: 'bambino', family: 'Orient Bambino', match: /^RA-AC0M/,
    plus: ['Le verre bombé et le cadran, très habillés pour le prix', 'Elle paraît plus fine au poignet que ses cotes ne le laissent penser', 'Un mouvement automatique conçu par Orient, avec remontage manuel et stop-seconde'],
    minus: ['Le verre minéral se raye plus facilement qu’un saphir', 'Le bracelet cuir d’origine est souvent remplacé par les propriétaires', '30 m d’étanchéité : à retirer avant la baignade'],
    sources: [{label: 'Two Broke Watch Snobs, Orient Bambino', url: 'https://twobrokewatchsnobs.com/orient-bambino-review/'}, {label: 'Monochrome Watches, Bambino 38 mm', url: 'https://monochrome-watches.com/orient-bambino-38-value-proposition-review-dress-watch-specs-price/'}, {label: 'The Slender Wrist, Bambino', url: 'https://theslenderwrist.com/orient-bambino-v3-gen-2-review/'}]},
  {id: 'seiko5', family: 'Seiko 5 SNKL23', match: /^SNKL23/,
    plus: ['Une réputation de robustesse, entretenue depuis des décennies', 'L’une des automatiques les plus abordables du catalogue', 'Un format de 38 mm qui convient à la plupart des poignets'],
    minus: ['Ni remontage manuel ni stop-seconde : il faut la porter ou la secouer pour la relancer', 'Une précision qui varie d’un exemplaire à l’autre', '30 m d’étanchéité et verre Hardlex'],
    sources: [{label: 'Watchgecko, Seiko 5 SNKL23', url: 'https://www.watchgecko.com/blogs/magazine/the-seiko-5-snkl23-review'}, {label: 'Ben’s Watch Club, SNKL23', url: 'https://benswatchclub.squarespace.com/blog/seiko-snkl23-review'}]},
  {id: 'ga2100', family: 'G-Shock GA-2100', match: /^GA-2100/,
    plus: ['Antichoc et étanche à 200 m : elle encaisse sport, plage et bricolage', 'Légère, autour de 51 g, et fine pour une G-Shock', 'Le style octogonal qui a fait son succès'],
    minus: ['Un petit écran numérique, peu lisible pour certaines fonctions', 'Un éclairage LED jugé faible', 'Sur la version tout noire, des aiguilles peu lisibles dans l’obscurité'],
    sources: [{label: 'G-Central, fiche GA-2100', url: 'https://www.g-central.com/specs/g-shock-ga-2100/'}, {label: 'Decaf Journal, G-Shock GA-2100', url: 'https://www.decafjournal.com/casio-g-shock-ga-2100-review/'}]},
  {id: 'abl100', family: 'Casio Vintage ABL-100', match: /^ABL-100/,
    plus: ['Le look rétro des Casio numériques, en plus grand', 'La connexion Bluetooth pour régler l’heure automatiquement', 'Un prix sous 100 €'],
    minus: ['Le podomètre ne se désactive pas, selon des retours d’utilisateurs', 'Des fonctions connectées jugées limitées', 'Verre acrylique et 30 m : une montre de ville'],
    sources: [{label: 'G-Central, Casio ABL-100', url: 'https://g-central.com/?p=72704'}, {label: 'Notebookcheck, lancement des ABL-100', url: 'https://www.notebookcheck.net/Casio-launches-its-new-Bluetooth-equipped-Vintage-watches-in-more-markets.1371038.0.html'}]},
  {id: 'mako3', family: 'Orient Mako III', match: /^RA-AA000[1-4]/,
    plus: ['Un rapport qualité-prix cité très souvent', 'Verre saphir et 200 m d’étanchéité', 'Le calibre maison F6922, avec remontage manuel et stop-seconde'],
    minus: ['Un fermoir embouti jugé simple pour le prix', 'Une précision jugée moyenne par certains propriétaires', '42 mm et 13 mm d’épaisseur : pas une montre de chemise'],
    sources: [{label: 'Ben’s Watch Club, Orient Kamasu', url: 'https://benswatchclub.squarespace.com/blog/orient-kamasu-review'}, {label: 'Deployant, Mako III Kamasu', url: 'https://deployant.com/review-the-new-dark-green-mako-iii-kamasu-by-orient/'}, {label: 'Dialicious, avis de propriétaires', url: 'https://www.dialicious.com/en/orient/mako_iii_kamasu'}]},
  {id: 'prx-quartz', family: 'Tissot PRX 40 mm quartz', match: /^T137\.410\./,
    plus: ['Le bracelet intégré, bien ajusté et confortable', 'Fine (10,4 mm) et compacte au poignet malgré ses 40 mm', 'Un quartz sans contrainte, pile à changer tous les quelques années'],
    minus: ['Elle peut paraître grande sur un poignet fin : la version 35 mm existe', 'Un fermoir sans ajustement rapide', 'Une luminescence jugée limitée'],
    sources: [{label: 'Two Broke Watch Snobs, Tissot PRX', url: 'https://twobrokewatchsnobs.com/tissot-prx-review/'}, {label: 'Fratello, Tissot PRX', url: 'https://www.fratellowatches.com/hands-on-review-the-tissot-prx-has-convinced-me/'}, {label: 'WatchCharts, PRX quartz', url: 'https://watchcharts.com/articles/p/6129/tissot-prx-t1374101105100-watch-review'}]},
  {id: 'prx-auto', family: 'Tissot PRX Powermatic 80', match: /^T137\.(407|207)\./,
    plus: ['Environ 80 heures de réserve de marche : elle passe le week-end posée', 'Un spiral antimagnétique et le stop-seconde', 'Saphir et 100 m d’étanchéité'],
    minus: ['Un prix nettement plus élevé que la version quartz au même style', 'L’ergonomie du bracelet intégré ne convient pas à tous les poignets', 'Pas de certification chronomètre sur la PRX'],
    sources: [{label: 'Gear Patrol, PRX Powermatic 80 35 mm', url: 'https://www.gearpatrol.com/watches/a45907814/tissot-prx-35-powermatic-gold-review/'}, {label: 'Watchgecko, PRX 35 mm Powermatic 80', url: 'https://www.watchgecko.com/blogs/magazine/the-tissot-prx-review'}, {label: 'Fratello, PRX Powermatic 80 35 mm', url: 'https://fratellowatches.com/hands-on-tissot-prx-powermatic-80-35mm'}]},
  {id: 'khaki-mech', family: 'Hamilton Khaki Field Mechanical', match: /^H69(39|42|43)/,
    plus: ['Très lisible pour sa taille, dans l’esprit des montres militaires', 'Environ 80 heures de réserve pour le calibre à remontage manuel H-50', 'Fine et légère au poignet'],
    minus: ['Une précision de quelques secondes par jour, normale pour une mécanique', 'À remonter à la main régulièrement', 'Selon la référence, le verre et l’étanchéité diffèrent : vérifiez la fiche'],
    note: 'La plupart des tests portent sur la version 38 mm à verre saphir ; la référence H69399930 vendue ici mesure 36 mm, avec un verre acrylique et 100 m d’étanchéité selon Hamilton.',
    sources: [{label: 'Hamilton, fiche H69399930', url: 'https://www.hamiltonwatch.com/en-gb/h69399930-khaki-field-mechanical.html'}, {label: 'The Slender Wrist, Khaki Field Mechanical', url: 'https://theslenderwrist.com/hamilton-khaki-field-mechanical-review/'}, {label: 'Ben’s Watch Club, Khaki Field Mechanical', url: 'https://benswatchclub.squarespace.com/blog/hamilton-khaki-field-mechanical-review'}]},
];

export const reviewFor = (reference: string) => reviewSyntheses.find(r => r.match.test(reference));
