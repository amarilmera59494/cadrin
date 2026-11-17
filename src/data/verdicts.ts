// « Notre choix » : une montre désignée en tête de chaque sélection et du guide cadeau.
// Règles (voir /notre-methode/#notre-choix) :
// - elle répond aux critères de la sélection et elle est commandable chez Tempus au dernier relevé
//   (une précommande ou une montre indisponible ne peut pas être notre choix : le candidat suivant prend sa place) ;
// - l'argument vient de la fiche (verre, étanchéité, taille, mouvement) et, quand ils existent, des tests
//   publiés cités sur la fiche (src/data/review-syntheses.ts) ; jamais d'essai revendiqué ;
// - sa principale limite est toujours écrite ;
// - la commission n'entre pas dans le choix.
// Les prix ne figurent jamais dans le texte : ils sont lus dans le relevé du jour.
export type VerdictNote={for:string;why:string;limit:string};
export type VerdictSlot={label?:string;refs:string[]};

const noTest='Nous n’avons pas trouvé de test publié : ce choix repose sur sa fiche.';

export const verdictNotes:Record<string,VerdictNote>={
 'NJ0150-81E':{for:'Une première automatique à porter tous les jours, au bureau comme le week-end.',why:'Verre saphir et 50 m d’étanchéité, rares à ce prix sur une automatique, avec remontage manuel et stop-seconde. Les tests publiés saluent une finition au-dessus de son prix et son bracelet intégré.',limit:'Sa couronne est petite et difficile à saisir ; elle s’arrête après environ 42 heures sans être portée.'},
 'NJ0150-81L':{for:'Une automatique au verre très résistant aux rayures, sans dépasser 300 €.',why:'Verre saphir et 50 m d’étanchéité, rares à ce prix sur une automatique, avec remontage manuel et stop-seconde. Les tests publiés saluent une finition au-dessus de son prix.',limit:'Sa couronne est petite et difficile à saisir ; elle s’arrête après environ 42 heures sans être portée.'},
 'SNKL23J1':{for:'Découvrir la mécanique sans dépasser 200 €.',why:'Une automatique japonaise à la réputation de robustesse entretenue depuis des décennies, en 38 mm, un format qui convient à la plupart des poignets.',limit:'Ni remontage manuel ni stop-seconde ; 30 m d’étanchéité et verre Hardlex : retirez-la avant la baignade.'},
 'GA-2100-1A1ER':{for:'Une montre qu’on ne ménage pas : sport, plage, bricolage.',why:'Antichoc et étanche à 200 m, légère (environ 51 g) et fine pour une G-Shock. Les tests publiés retiennent aussi son boîtier octogonal, devenu sa signature.',limit:'45,4 mm de large ; un éclairage jugé faible et, sur cette version toute noire, des aiguilles peu lisibles dans l’obscurité.'},
 'GA-2100LXB-1AER':{for:'Une montre qu’on ne ménage pas : sport, plage, bricolage.',why:'Antichoc et étanche à 200 m, légère et fine pour une G-Shock, avec le boîtier octogonal qui a fait le succès de la GA-2100.',limit:'45,4 mm de large et un éclairage jugé faible par les tests publiés.'},
 'MTP-B145D-2A2VEF':{for:'Une montre de ville discrète, pour un petit budget.',why:'Acier, 35 mm et 7,4 mm d’épaisseur, 50 m d’étanchéité : une montre fine qui passe sous une manche de chemise.',limit:'Verre minéral. '+noTest},
 'EFK-110D-1A':{for:'Une automatique au verre très résistant aux rayures, sans dépasser 250 €.',why:'Verre saphir, mouvement automatique et 100 m d’étanchéité, dans un boîtier de 38 mm : la fiche réunit les trois points qui comptent le plus à ce prix.',limit:'Casio est moins connue que Seiko ou Citizen en automatique. '+noTest},
 'SRK047P1':{for:'Une montre habillée au verre très résistant aux rayures, sous 200 €.',why:'Verre saphir, 39 mm et 8 mm d’épaisseur, petite seconde : elle passe sous une manche de chemise.',limit:'Quartz et 50 m d’étanchéité. '+noTest},
 'CA4714-55E':{for:'Ne plus jamais changer de pile.',why:'Eco-Drive se recharge à la lumière ; chronographe, date, 100 m d’étanchéité et bracelet acier : la plus polyvalente des solaires de cette sélection pour tous les jours.',limit:'Verre minéral et 12 mm d’épaisseur ; rangée longtemps dans le noir, elle s’arrête jusqu’à sa recharge. '+noTest},
 'CA4714-04A':{for:'Ne plus jamais changer de pile.',why:'Eco-Drive se recharge à la lumière ; chronographe, date et 100 m d’étanchéité, sur bracelet cuir.',limit:'Verre minéral et 12,3 mm d’épaisseur ; rangée longtemps dans le noir, elle s’arrête jusqu’à sa recharge. '+noTest},
 'CA4630-02A':{for:'Un chronographe sans pile à changer.',why:'Eco-Drive se recharge à la lumière ; chronographe, date et 100 m d’étanchéité.',limit:'42 mm et 14 mm d’épaisseur : un format marqué. '+noTest},
 'RA-AA0001B':{for:'Nager et passer l’été au bord de l’eau avec une vraie plongeuse mécanique.',why:'Verre saphir, 200 m et calibre maison F6922 avec remontage manuel et stop-seconde : parmi les plongeuses automatiques, c’est le rapport qualité-prix le plus souvent cité par les tests publiés.',limit:'42 mm et 13 mm d’épaisseur, un fermoir jugé simple. Pour la plongée en bouteille, préférez une montre certifiée ISO 6425.'},
 'RA-AA0004E':{for:'Nager et passer l’été au bord de l’eau avec une vraie plongeuse mécanique.',why:'Verre saphir, 200 m et calibre maison F6922 avec remontage manuel et stop-seconde : parmi les plongeuses automatiques, c’est le rapport qualité-prix le plus souvent cité par les tests publiés.',limit:'42 mm et 13 mm d’épaisseur, un fermoir jugé simple. Pour la plongée en bouteille, préférez une montre certifiée ISO 6425.'},
 'RA-AA0003R':{for:'Nager et passer l’été au bord de l’eau avec une vraie plongeuse mécanique.',why:'Verre saphir, 200 m et calibre maison F6922 avec remontage manuel et stop-seconde : parmi les plongeuses automatiques, c’est le rapport qualité-prix le plus souvent cité par les tests publiés.',limit:'Un fermoir jugé simple et 13 mm d’épaisseur. Pour la plongée en bouteille, préférez une montre certifiée ISO 6425.'},
 'NJ0200-50L':{for:'Un poignet fin qui veut une automatique au verre saphir.',why:'La Tsuyosa, saluée par les tests publiés en 40 mm, ramenée à 37 mm : verre saphir, 50 m d’étanchéité, bracelet acier intégré et 11,6 mm d’épaisseur.',limit:'Comme toute automatique, elle s’arrête au repos ; faites ajuster le bracelet à son tour de poignet.'},
 'NJ0200-50Z':{for:'Offrir une automatique qui se remarque, à un poignet fin.',why:'La Tsuyosa, saluée par les tests publiés en 40 mm, en 37 mm avec un cadran rose : verre saphir, 50 m d’étanchéité et bracelet acier intégré.',limit:'Comme toute automatique, elle s’arrête au repos ; le bracelet devra être ajusté au poignet.'},
 'FE6121-67L':{for:'Une montre de tous les jours, sans pile à changer.',why:'Eco-Drive rechargée par la lumière, acier, 33,5 mm et 8 mm d’épaisseur, 50 m d’étanchéité.',limit:'Verre minéral ; rangée longtemps dans le noir, elle s’arrête jusqu’à sa recharge. '+noTest},
 'FE6121-67A':{for:'Une montre de tous les jours, sans pile à changer.',why:'Eco-Drive rechargée par la lumière, acier, 33,5 mm et 8 mm d’épaisseur, 50 m d’étanchéité.',limit:'Verre minéral ; rangée longtemps dans le noir, elle s’arrête jusqu’à sa recharge. '+noTest},
 '671737':{for:'Un classique français, au cadran rose poudré.',why:'La Himalaya de Lip en 29 mm : petite seconde, verre minéral bombé et bracelet acier maille chevron.',limit:'Quartz et 50 m d’étanchéité : une montre de ville. '+noTest},
 'TW2W10100':{for:'Le style d’un chronographe vintage, sans dépasser 200 €.',why:'Une Marlin au dessin rétro : 40 mm, compteurs de chronographe et échelle tachymétrique, sur bracelet cuir.',limit:'Verre acrylique (il se raye mais se polit), 13 mm d’épaisseur et 50 m. '+noTest},
 'TW2W10200':{for:'Le style d’un chronographe vintage, sans dépasser 200 €.',why:'Une Marlin au dessin rétro : 40 mm, compteurs de chronographe et échelle tachymétrique, sur bracelet cuir.',limit:'Verre acrylique (il se raye mais se polit), 13 mm d’épaisseur et 50 m. '+noTest},
 'SM30200.01':{for:'Une montre suisse sobre, sous 250 €.',why:'Verre saphir, 100 m d’étanchéité, 39 mm et 8,5 mm d’épaisseur : la fiche la plus complète de la sélection à ce prix.',limit:'Quartz. '+noTest},
 'SM30200.03':{for:'Une montre suisse sobre, sous 250 €.',why:'Verre saphir, 100 m d’étanchéité, 39 mm et 8,5 mm d’épaisseur : la fiche la plus complète de la sélection à ce prix.',limit:'Quartz. '+noTest},
 '671541':{for:'Offrir un nom historique de l’horlogerie française.',why:'Lip, marque née à Besançon, et sa Himalaya en 40 mm : cadran gris mat et verre minéral bombé, au dessin vintage.',limit:'Quartz, verre minéral et 50 m : une montre de ville. Tempus n’indique pas son épaisseur. '+noTest},
 'TW2W22500':{for:'Un homme qui aime les objets à l’esprit vintage.',why:'La réédition de la Q Timex lancée en 1979 : bracelet acier, jour et date, 38 mm et 9,5 mm d’épaisseur, un format qui va à la plupart des poignets.',limit:'Verre acrylique (il se raye mais se polit) et 50 m ; une pile à changer, comme tout quartz. '+noTest},
};

// Ordre de priorité par emplacement : le premier candidat commandable et conforme aux critères est retenu.
export const verdictPlacements:Record<string,VerdictSlot[]>={
 'montres-automatiques-moins-de-300-euros':[{refs:['NJ0150-81E','NJ0150-81L','SNKL23J1']}],
 'montres-moins-de-100-euros':[{refs:['GA-2100-1A1ER','MTP-B145D-2A2VEF']}],
 'montres-de-100-a-200-euros':[{refs:['SNKL23J1','GA-2100LXB-1AER']}],
 'montres-verre-saphir-moins-de-300-euros':[{refs:['EFK-110D-1A','SRK047P1','NJ0150-81L']}],
 'montres-solaires':[{refs:['CA4714-55E','CA4714-04A','FE6121-67L']}],
 'montres-etanches-200-metres':[{refs:['RA-AA0001B','RA-AA0004E','RA-AA0003R','GA-2100-1A1ER']}],
 'montres-petit-poignet':[{refs:['NJ0200-50L','NJ0200-50Z','SNKL23J1']}],
 'montres-femme':[{refs:['FE6121-67L','FE6121-67A','671737']}],
 'chronographes':[{refs:['TW2W10100','TW2W10200','CA4630-02A']}],
 'montres-marques-suisses':[{refs:['SM30200.01','SM30200.03']}],
 'montres-marques-francaises':[{refs:['671541','671737']}],
 'idees-cadeaux-homme-moins-de-200-euros':[{refs:['TW2W22500','SNKL23J1','GA-2100-1A1ER']}],
 'guide:offrir-une-montre':[{label:'Pour lui',refs:['SNKL23J1','GA-2100-1A1ER']},{label:'Pour elle',refs:['NJ0200-50Z','NJ0200-50L','FE6121-67L']}],
};
