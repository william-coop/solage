/* Solage — contenu de référence et calendrier.
   La liste des grilles, le calendrier et les deux fiches viennent du Guide d'inspection des immeubles
   à l'intention des gestionnaires (RQOH, mise à jour de mars 2017). Utilisation à des fins de démonstration
   seulement : les droits restent à confirmer. Les tâches et les dates sont fictives. */

D.MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
D.SAISONS = { Hiver: [0, 1, 2], Printemps: [3, 4, 5], 'Été': [6, 7, 8], Automne: [9, 10, 11] }; // découpage du guide (hiver = janvier à mars)

/* ---------- Grilles d'entretien ----------
   mois : index 0-11. pertinence : jugement provisoire pour un CPE. origine : 'Guide 2017' ou 'À créer (propre aux CPE)'. */
D.grilles = [
  { id: 'alarme', titre: 'Détection et alarme-incendie', saison: 'Hiver', mois: [0], fiches: ['2.6.1', '2.6.2', '2.6.3'], points: 13, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'cuisine', titre: 'Cuisine et équipements', saison: 'Hiver', mois: [1], fiches: ['2.4.7'], points: 9, pertinence: 'À adapter', origine: 'Guide 2017' },
  { id: 'entretoit-pente', titre: 'Entretoit, toit en pente', saison: 'Hiver', mois: [1], fiches: ['2.3.2'], points: 6, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'entretoit-plat', titre: 'Entretoit, toit plat', saison: 'Hiver', mois: [1], fiches: ['2.3.1'], points: 4, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'plomberie', titre: 'Plomberie de salle de bain', saison: 'Hiver', mois: [2], fiches: ['2.7.1'], points: 8, pertinence: 'À adapter', origine: 'Guide 2017' },
  { id: 'toit-pente', titre: 'Toit en pente', saison: 'Printemps et automne', mois: [4, 9], fiches: ['2.3.2'], points: 12, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'toit-plat', titre: 'Toit plat', saison: 'Printemps et automne', mois: [4, 9], fiches: ['2.3.1'], points: 11, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'electricite', titre: 'Entrée électrique et distribution', saison: 'Printemps et automne', mois: [3, 9], fiches: ['2.8.2'], points: 10, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'puisard', titre: 'Puisard et fosse de retenue', saison: 'Printemps', mois: [3], fiches: ['2.7.3'], points: 6, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'parement', titre: 'Parement, murs extérieurs et fondation', saison: 'Printemps', mois: [4], fiches: ['2.2.1', '2.2.2'], points: 10, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'balcons', titre: 'Balcons, perrons, paliers, escaliers, rampes et échelles extérieurs', saison: 'Printemps', mois: [4], fiches: ['2.2.3'], points: 6, pertinence: 'À adapter', origine: 'Guide 2017' },
  { id: 'portes-fenetres', titre: 'Portes extérieures et fenêtres', saison: 'Printemps', mois: [4], fiches: ['2.2.4', '2.2.5'], points: 5, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'antennes', titre: 'Structure de réception et antennes', saison: 'Printemps', mois: [4], fiches: ['2.8.3'], points: 5, pertinence: 'Peu pertinent', origine: 'Guide 2017' },
  { id: 'arbres', titre: 'Arbres, arbustes et plates-bandes', saison: 'Printemps et automne', mois: [4, 9], fiches: ['2.1.8'], points: 11, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'dechets', titre: 'Contenant, compacteur et chute à déchets', saison: 'Printemps', mois: [5], fiches: ['2.4.8'], points: 20, pertinence: 'Peu pertinent', origine: 'Guide 2017' },
  { id: 'stationnement', titre: 'Stationnement, trottoir et égout pluvial', saison: 'Printemps', mois: [5], fiches: ['2.1.1', '2.1.2', '2.1.9'], points: 11, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'escalier-ext', titre: "Escalier et rampe d'accès extérieurs", saison: 'Printemps', mois: [5], fiches: ['2.1.3'], points: 6, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'terrasses', titre: 'Terrasses et dalles extérieures', saison: 'Printemps', mois: [5], fiches: ['2.1.4'], points: 4, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'clotures', titre: 'Clôtures', saison: 'Printemps', mois: [5], fiches: ['2.1.7'], points: 6, pertinence: 'À adapter', origine: 'Guide 2017' },
  { id: 'soutenement', titre: 'Murs de soutènement et margelles', saison: 'Printemps', mois: [5], fiches: ['2.1.5', '2.1.6'], points: 6, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'chauffe-eau', titre: 'Chauffe-eau', saison: 'Été', mois: [6], fiches: ['2.7.5'], points: 8, pertinence: 'À adapter', origine: 'Guide 2017' },
  { id: 'chauffage', titre: 'Chauffage', saison: 'Été', mois: [8], fiches: ['2.5.2'], points: 6, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'robinet', titre: "Robinet principal d'arrêt d'eau", saison: 'Été', mois: [8], fiches: ['2.7.2'], points: 6, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'eclairage', titre: "Système d'éclairage", saison: 'Automne', mois: [10], fiches: ['2.8.1'], points: 7, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'planchers', titre: 'Finition des planchers', saison: 'Automne', mois: [10], fiches: ['2.4.4'], points: 9, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'murs', titre: 'Murs et plafonds', saison: 'Automne', mois: [10], fiches: ['2.4.3'], points: 3, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'escalier-int', titre: "Escalier et rampe d'accès intérieurs", saison: 'Automne', mois: [10], fiches: ['2.4.2'], points: 13, pertinence: 'Oui', origine: 'Guide 2017' },
  { id: 'aire-jeu', titre: 'Aire de jeu extérieure et surfaces amortissantes', saison: 'Printemps', mois: [4], fiches: [], points: 14, pertinence: 'Oui', origine: 'À créer (propre aux CPE)' },
  { id: 'cuisine-pro', titre: 'Cuisine de production : hotte et extinction', saison: 'Hiver', mois: [1], fiches: [], points: 10, pertinence: 'Oui', origine: 'À créer (propre aux CPE)' },
  { id: 'urgence', titre: "Éclairage d'urgence et extincteurs portatifs", saison: 'Chaque mois', mois: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], fiches: ['2.6.4'], points: 6, pertinence: 'Oui', origine: 'À créer (propre aux CPE)' },
  { id: 'enfants', titre: 'Sécurité des enfants : eau chaude, prises, rangements', saison: 'Automne', mois: [9], fiches: [], points: 12, pertinence: 'Oui', origine: 'À créer (propre aux CPE)' }
];
D.grille = id => D.grilles.find(g => g.id === id) || D.grilles.find(g => g.id === 'toit-pente');

/* Grille complète de démonstration (guide de 2017, p. 141-142) */
D.grilleToit = {
  id: 'toit-pente',
  outils: "Échelle coulissante, marteau, clous, grattoir, produit d'étanchéité, brosses, tournevis et bardeaux",
  sections: [
    { titre: "Trappe d'accès et échelle fixe", points: [
      "Vérifier l'étanchéité et le fonctionnement de la trappe d'accès (lorsqu'existante); améliorer si nécessaire.",
      "Vérifier l'état des barreaux et la solidité des ancrages de l'échelle d'accès; fixer de nouveau et peindre au besoin."] },
    { titre: 'Toit', note: "Lorsqu'une échelle est nécessaire pour accéder à la toiture, respecter les règles de sécurité (aide pour tenir l'échelle, etc.).", points: [
      "Vérifier l'état des bardeaux de toit et noter tout soulèvement, gondolage et bardeaux cassés ou manquants; fixer de nouveau les bardeaux lâches ou déplacés, remplacer les bardeaux déficients ou manquants.",
      "Vérifier l'état de la structure (affaissement, zone molle, ondulation); consulter un spécialiste pour les corrections à apporter.",
      "Vérifier l'état des solins métalliques, des couronnements et des joints d'expansion, lorsque présents; fixer les éléments lâches et sceller les joints douteux ou fissurés."] },
    { titre: 'Gouttière (réceptacle et descente)', points: [
      "Vérifier l'état de la gouttière (solidité, éléments manquants); solidifier les éléments lâches et remplacer ceux qui manquent.",
      "Vérifier l'étanchéité et l'écoulement; sceller les perforations et incliner la gouttière vers la descente si nécessaire. Ajouter des tamis à feuilles mortes ou nettoyer régulièrement s'il y a des feuillus à proximité."] },
    { titre: "Bouche d'aération du toit", points: [
      "Vérifier l'état et la solidité des bouches d'aération et l'étanchéité des joints à la toiture; solidifier, reprendre les joints déficients et repeindre si nécessaire.",
      "Évents : vérifier l'étanchéité du recouvrement d'évent; corriger si nécessaire.",
      "Col-de-cygne : vérifier le fonctionnement et l'étanchéité du volet à gravité et le grillage pare-oiseaux; corriger les volets et grillages déficients.",
      "Ventilateur éolien : vérifier manuellement l'opération du ventilateur; huiler ou changer le roulement à billes.",
      "Ventilateur statique : vérifier le grillage pare-oiseaux."] }
  ],
  /* Résultats fictifs de la dernière visite (6 octobre 2026), dans l'ordre des 12 points */
  dernier: ['NA', 'NA', 'DE', 'NA', 'SN', 'RP', 'NA', 'NA', 'NA', 'NA', 'NA', 'NA']
};

/* ---------- Tâches d'entretien (fictives) ---------- */
D.taches = [
  { id: 't1', inst: 'erables', titre: 'Grille « Toit en pente »', date: '2026-10-08', grille: 'toit-pente', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: true },
  { id: 't2', inst: 'erables', titre: 'Grille « Entrée électrique et distribution »', date: '2026-10-15', grille: 'electricite', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: true },
  { id: 't3', inst: 'erables', titre: 'Grille « Arbres, arbustes et plates-bandes »', date: '2026-10-20', grille: 'arbres', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: true },
  { id: 't4', inst: 'ruisseau', titre: 'Grille « Toit plat »', date: '2026-10-09', grille: 'toit-plat', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: true },
  { id: 't5', inst: 'erables', titre: 'Grille « Système d’éclairage »', date: '2026-11-05', grille: 'eclairage', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: true },
  { id: 't6', inst: 'erables', titre: "Vérification mensuelle de l'éclairage d'urgence", date: '2026-11-10', grille: 'urgence', saison: 'Chaque mois', resp: 'Direction adjointe', type: 'Conformité', fait: false },
  { id: 't7', inst: 'erables', titre: 'Grille « Murs et plafonds »', date: '2026-11-12', grille: 'murs', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: true },
  { id: 't8', inst: 'erables', titre: 'Grille « Finition des planchers »', date: '2026-11-24', grille: 'planchers', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: false },
  { id: 't9', inst: 'erables', titre: "Grille « Escalier et rampe d'accès intérieurs »", date: '2026-11-26', grille: 'escalier-int', saison: 'Automne', resp: "Préposé à l'entretien", type: 'Grille', fait: false },
  { id: 't10', inst: 'ruisseau', titre: 'Grille « Système d’éclairage »', date: '2026-11-06', grille: 'eclairage', saison: 'Automne', resp: 'Responsable de l’installation', type: 'Grille', fait: true },
  { id: 't11', inst: 'ruisseau', titre: "Vérification mensuelle de l'éclairage d'urgence", date: '2026-11-10', grille: 'urgence', saison: 'Chaque mois', resp: 'Responsable de l’installation', type: 'Conformité', fait: true },
  { id: 't12', inst: 'ruisseau', titre: 'Grille « Finition des planchers »', date: '2026-11-20', grille: 'planchers', saison: 'Automne', resp: 'Responsable de l’installation', type: 'Grille', fait: false },
  { id: 't13', inst: 'gare', titre: 'Grille « Murs et plafonds »', date: '2026-11-13', grille: 'murs', saison: 'Automne', resp: 'Responsable de l’installation', type: 'Grille', fait: true },
  { id: 't14', inst: 'gare', titre: 'Grille « Finition des planchers »', date: '2026-11-27', grille: 'planchers', saison: 'Automne', resp: 'Responsable de l’installation', type: 'Grille', fait: false },
  { id: 't15', inst: 'erables', titre: 'Début du contrat de déneigement', date: '2026-12-01', grille: null, saison: 'Hiver', resp: 'Fournisseur', type: 'Contrat', fait: false },
  { id: 't16', inst: 'erables', titre: "Vérification mensuelle de l'éclairage d'urgence", date: '2026-12-10', grille: 'urgence', saison: 'Chaque mois', resp: 'Direction adjointe', type: 'Conformité', fait: false },
  { id: 't17', inst: 'erables', titre: 'Grille « Détection et alarme-incendie »', date: '2027-01-12', grille: 'alarme', saison: 'Hiver', resp: "Préposé à l'entretien", type: 'Grille', fait: false },
  { id: 't18', inst: 'erables', titre: 'Grille « Cuisine et équipements »', date: '2027-02-09', grille: 'cuisine', saison: 'Hiver', resp: 'Responsable de l’alimentation', type: 'Grille', fait: false },
  { id: 't19', inst: 'erables', titre: 'Grille « Entretoit, toit en pente »', date: '2027-02-16', grille: 'entretoit-pente', saison: 'Hiver', resp: "Préposé à l'entretien", type: 'Grille', fait: false },
  { id: 't20', inst: 'erables', titre: 'Remplacement des chauffe-eau (regroupement)', date: '2027-03-08', grille: null, saison: 'Hiver', resp: 'Plomberie des Cantons', type: 'Contrat', fait: false }
];

/* ---------- Sommaire du guide de 2017 ---------- */
D.guide = [
  { num: '2.1', titre: 'Aménagement extérieur', icone: 'feuille', fiches: [['2.1.1', 'Aires de stationnement et accès', 'Printemps'], ['2.1.2', 'Trottoir', 'Printemps'], ['2.1.3', "Escaliers et rampes d'accès extérieurs", 'Printemps'], ['2.1.4', 'Terrasses et dalles extérieures', 'Printemps'], ['2.1.5', 'Margelles', 'Printemps'], ['2.1.6', 'Murs de soutènement', 'Printemps'], ['2.1.7', 'Clôtures', 'Printemps'], ['2.1.8', 'Arbres, arbustes et plates-bandes', 'Printemps et automne'], ['2.1.9', 'Égout pluvial (puisard)', 'Printemps']] },
  { num: '2.2', titre: 'Enveloppe du bâtiment', icone: 'batiment', fiches: [['2.2.1', 'Fondations et dalles inférieures', 'Printemps'], ['2.2.2', 'Parements et murs extérieurs', 'Printemps'], ['2.2.3', 'Balcons, perrons, paliers, escaliers, rampes et échelles extérieurs', 'Printemps'], ['2.2.4', 'Portes extérieures', 'Printemps'], ['2.2.5', 'Fenêtres', 'Printemps']] },
  { num: '2.3', titre: 'Toiture', icone: 'toit', fiches: [['2.3.1', 'Toit plat', 'Printemps, automne et hiver'], ['2.3.2', 'Toit en pente', 'Printemps et automne']] },
  { num: '2.4', titre: 'Intérieur', icone: 'accueil', fiches: [['2.4.1', 'Portes intérieures', 'En tout temps'], ['2.4.2', "Escaliers et rampes d'accès intérieurs", 'Automne'], ['2.4.3', 'Murs et plafonds', 'Automne'], ['2.4.4', 'Finition des planchers', 'Automne'], ['2.4.5', 'Ascenseurs et plateformes', 'En tout temps'], ['2.4.6', 'Buanderie', 'En tout temps'], ['2.4.7', 'Cuisine et équipements', 'Hiver'], ['2.4.8', 'Contenant, compacteur et chute à déchets', 'Printemps'], ['2.4.9', "Garage, sous-sol et locaux d'entretien", 'En tout temps'], ['2.4.10', 'Structure souterraine, vide sanitaire', 'En tout temps'], ['2.4.11', 'Moisissures', 'En tout temps'], ['2.4.12', 'Amiante', 'En tout temps']] },
  { num: '2.5', titre: 'Aspect mécanique', icone: 'thermo', fiches: [['2.5.1', 'Ventilation', 'Toute l’année'], ['2.5.2', 'Chauffage', 'Été'], ['2.5.3', 'Climatisation', 'En tout temps']] },
  { num: '2.6', titre: 'Aspect sécurité', icone: 'bouclier', fiches: [['2.6.1', 'Détecteur de fumée et détecteur thermique', 'Hiver'], ['2.6.2', "Exercice d'évacuation, sorties d'urgence et plan d'urgence", 'Hiver'], ['2.6.3', 'Détection du monoxyde de carbone', 'Hiver'], ['2.6.4', "Système d'éclairage d'urgence", 'En tout temps']] },
  { num: '2.7', titre: 'Plomberie', icone: 'eau', fiches: [['2.7.1', 'Plomberie de salle de bain', 'Hiver'], ['2.7.2', "Robinet principal d'arrêt d'eau", 'Été'], ['2.7.3', 'Puisard et fosse de retenue', 'Printemps'], ['2.7.4', 'Drain de fondation', 'Été'], ['2.7.5', 'Chauffe-eau', 'Été'], ['2.7.6', "Accès aux composants d'une installation de plomberie", 'En tout temps']] },
  { num: '2.8', titre: 'Électricité', icone: 'eclair', fiches: [['2.8.1', "Système d'éclairage", 'Automne'], ['2.8.2', 'Entrée électrique et distribution', 'Printemps et automne'], ['2.8.3', 'Structure de réception et antenne', 'Printemps']] },
  { num: '3', titre: "Contrats d'entretien", icone: 'camion', fiches: [['3.1', 'Inspection des façades', ''], ['3.2', 'Ventilation', ''], ['3.3', 'Chauffage à eau chaude', ''], ['3.4', 'Gicleurs', ''], ['3.5', "Extincteurs et éclairage d'urgence", ''], ['3.6', "Système d'alarme incendie", ''], ['3.7', 'Hottes', ''], ['3.8', 'Ascenseur, monte-charge et appareil de levage', ''], ['3.9', "Génératrice d'urgence", '']] }
];

/* ---------- Deux fiches complètes, à des fins de démonstration ---------- */
D.fiches = {
  '2.3.2': {
    num: '2.3.2', titre: 'Toit en pente', section: 'Toiture', pages: '55-56', saisons: ['Printemps', 'Automne'], grille: 'toit-pente', photoType: 'toit',
    description: [
      "Les ouvertures et les sorties mécaniques sur le toit permettent la sortie des évacuateurs (salle de bain, hotte, sécheuse ou ventilation intérieure), et les sorties sous le toit par les soffites permettent de créer un mouvement d'air. Pour les morceaux en métal, il faut vérifier qu'ils ne soient pas rouillés; une peinture spéciale peut être utilisée au besoin. Autrement, c'est principalement une question d'étanchéité. Il faut vérifier que les recouvrements et solins soient bien étanches et que le calfeutrage soit intact.",
      "Les gouttières, quant à elles, servent à diriger l'eau du toit vers un endroit précis. Elles ont une durée de vie appréciable si elles sont fabriquées en aluminium. Les modèles de PVC sont plus fragiles et ne sont pas recommandés. On doit s'assurer que les gouttières soient en bon état et qu'elles ne soient pas obstruées, par exemple par du feuillage. Les descentes de gouttières doivent aussi être en bon état et il faut s'assurer qu'elles éloignent l'eau des fondations à la sortie.",
      "Les toits en pente sont généralement revêtus de bardeaux d'asphalte. Le vieillissement prématuré des bardeaux peut être causé par deux facteurs distincts : une mauvaise installation et une mauvaise aération naturelle de l'entretoit."
    ],
    sousTitre: "Aération de l'entretoit",
    sousTexte: "Une bonne aération de l'entretoit est le point le plus important pour éviter des problèmes de condensation qui pourraient se transformer en infiltration. Il faut s'assurer que les sous-faces ventilées soient bien dégagées pour permettre à l'air provenant de l'extérieur de circuler jusqu'à l'entretoit. En hiver, l'air chaud et humide qui n'est pas évacué peut créer du frimas sous les bardeaux et ainsi les endommager.",
    deficiences: "Lorsque les pattes des bardeaux frisent, se retroussent et s'espacent considérablement, on peut en déduire que soit l'usure du temps a fait son travail, soit qu'une des problématiques précédemment expliquées fait son œuvre. Après des vents violents, le bardeau peut se soulever ou se décoller. Lorsqu'il y a un doute sur l'usure prématurée, il est nécessaire de faire appel à un professionnel pour en déterminer la cause. La durée de vie des toits en bardeaux est généralement de 25 à 30 ans.",
    professionnel: 'Architecte ou technologue professionnel.',
    metiers: ["Couvreur pour le bardeau", "Menuisier pour l'aération"],
    photos: ['Bardeau usé', 'Gouttière obstruée', "Cernes d'humidité dans un entretoit"],
    reperes: [['Durée de vie utile', '25 à 30 ans (bardeaux)'], ['Période suggérée', 'Printemps et automne (mai et octobre)'], ["Grille d'entretien", 'Toit en pente, 12 points']]
  },
  '2.2.1': {
    num: '2.2.1', titre: 'Fondations et dalles inférieures', section: 'Enveloppe du bâtiment', pages: '41-42', saisons: ['Printemps'], grille: 'parement', photoType: 'brique',
    description: [
      "Les fondations peuvent être faites de différents matériaux, les plus communs étant le béton coulé et les blocs de béton. Le même rôle est joué par chacun : soutenir le bâtiment et transférer les charges de ce dernier jusqu'au sol. C'est le pilier du bâtiment, c'est pourquoi il est important que la fondation demeure en bon état. La dalle de béton du sous-sol est indirectement reliée à la fondation. Elle subit elle aussi les effets du mouvement de la fondation.",
      "La majeure partie des fissures apparaissent dans les mois suivant la construction initiale, tant pour le béton que pour le mortier des blocs. Avec le temps, les mouvements du sol et la récurrence des infiltrations d'eau vont faire grandir ces fissures. Lorsqu'une fissure apparaît, il est donc primordial de la colmater pour éviter que l'eau ne s'y infiltre et continue à y causer des dommages.",
      "Le béton étant considéré comme une matière fragile, une fissure observable dans le haut du mur de fondation a de grandes chances de se propager jusqu'au bas du mur. Il faut donc porter une attention particulière à chacune des fissures pour déterminer le type d'intervention nécessaire."
    ],
    sousTitre: null, sousTexte: null,
    deficiences: "Principalement, on doit s'assurer que la fondation est exempte de fissures. Une fissuration pourrait causer des infiltrations d'eau non visibles et, par le fait même, un excès d'humidité et des moisissures. Il faut également faire la distinction entre un bris de crépi et une fissure de fondation. Pour limiter les risques d'infiltrations d'eau, on doit s'assurer que le terrain soit en pente de façon à éloigner l'eau du bâtiment. Pour la dalle de béton, on doit également s'assurer qu'elle soit exempte de fissures, d'efflorescence et de cernes d'humidité. Si vous remarquez des fissures importantes (1/8 po de largeur et plus) ou des fissures horizontales, contactez un ingénieur ou un spécialiste en fissures.",
    professionnel: "S'il y a apparence d'une déficience quelconque, un ingénieur devrait être contacté afin d'évaluer la situation et la gravité des dommages.",
    metiers: ['Fondation de béton coulé : cimentier applicateur ou spécialiste de fissures', 'Fondation de blocs de béton : maçon', 'Fondation de moellons : maçon', 'Dalle de béton coulé : cimentier applicateur ou spécialiste de fissures'],
    photos: ['Fissure importante (1/8 po)', 'Bris de crépi', "Cernes d'humidité sur une fondation"],
    reperes: [['Seuil à retenir', 'Fissure de 1/8 po et plus, ou horizontale : ingénieur'], ['Période suggérée', 'Printemps'], ["Grille d'entretien", 'Parement, murs extérieurs et fondation, 10 points']]
  }
};

/* ---------- Obligations de conformité (dates fictives; sources et fréquences à valider, voir la vue « À propos ») ---------- */
/* certitude : 'Vérifié' = lu dans la source en novembre 2026; 'À valider' = fréquence tirée d'une norme non consultée. */
D.obligations = [
  { id: 'o1', inst: 'erables', cat: 'Sécurité incendie', titre: "Éclairage d'urgence et enseignes de sortie : vérification mensuelle", frequence: 'Chaque mois', source: 'Code de sécurité (CNPI 2020, partie 6)', certitude: 'À valider', derniere: '2026-10-09', prochaine: '2026-11-10', preuve: 'Registre de vérification' },
  { id: 'o2', inst: 'erables', cat: 'Sécurité incendie', titre: 'Extincteurs portatifs : inspection visuelle mensuelle', frequence: 'Chaque mois', source: 'Code de sécurité (CNPI 2020), NFPA 10', certitude: 'À valider', derniere: '2026-11-03', prochaine: '2026-12-03', preuve: 'Registre de vérification' },
  { id: 'o3', inst: 'erables', cat: 'Sécurité incendie', titre: "Système d'alarme incendie : inspection annuelle par une firme", frequence: 'Chaque année', source: 'Code de sécurité, CAN/ULC-S536 (fiche de la RBQ)', certitude: 'Vérifié', derniere: '2026-09-15', prochaine: '2027-09-15', preuve: 'Certificat du 17 septembre 2026' },
  { id: 'o4', inst: 'erables', cat: 'Sécurité incendie', titre: 'Extincteurs portatifs : entretien annuel', frequence: 'Chaque année', source: 'Code de sécurité (CNPI 2020), NFPA 10', certitude: 'À valider', derniere: '2026-09-15', prochaine: '2027-09-15', preuve: 'Étiquettes et rapport' },
  { id: 'o5', inst: 'erables', cat: 'Aire de jeu', titre: "Certificat de conformité de l'aire de jeu (norme CSA Z614)", frequence: 'Aux 3 ans (au plus tard le 31 décembre de la 3e année)', source: "Règlement sur les services de garde éducatifs à l'enfance, art. 42", certitude: 'Vérifié', derniere: '2023-06-12', prochaine: '2026-12-31', preuve: 'Certificat du 12 juin 2023' },
  { id: 'o6', inst: 'erables', cat: 'Aire de jeu', titre: "Rapport annuel d'inspection de l'aire de jeu", frequence: 'Chaque année', source: 'RSGEE, art. 40, et norme CSA Z614', certitude: 'Vérifié', derniere: '2026-05-14', prochaine: '2027-05-14', preuve: 'Rapport du 14 mai 2026' },
  { id: 'o7', inst: 'erables', cat: 'Eau potable', titre: 'Plomb dans l’eau : échantillonnage de suivi au robinet principal', frequence: 'Aux 5 ans, de juillet à septembre', source: "Règlement sur le contrôle du plomb dans l'eau (services de garde), 2025", certitude: 'Vérifié', derniere: '2026-08-18', prochaine: '2031-08-18', preuve: 'Résultat : inférieur à 5 µg/L' },
  { id: 'o8', inst: 'erables', cat: 'Qualité de l’air', titre: 'Ventilation mécanique : inspection et réglage', frequence: 'Au moins une fois par année', source: 'Règlement sur la santé et la sécurité du travail, art. 104', certitude: 'Vérifié', derniere: '2026-04-22', prochaine: '2027-04-22', preuve: "Bon de travail du fournisseur" },
  { id: 'o9', inst: 'erables', cat: 'Qualité de l’air', titre: 'Avertisseurs de monoxyde de carbone : remplacement selon le fabricant', frequence: 'Selon la date du fabricant', source: 'RSGEE, art. 34', certitude: 'Vérifié', derniere: '2020-01-15', prochaine: '2027-01-15', preuve: 'Date inscrite sur les appareils' },
  { id: 'o10', inst: 'erables', cat: 'Matières dangereuses', titre: "Amiante : vérification de l'état des calorifuges", frequence: 'Aux 2 ans (bâtiment construit avant le 20 mai 1999)', source: 'Règlement sur la santé et la sécurité du travail, art. 69.8', certitude: 'Vérifié', derniere: '2025-03-11', prochaine: '2027-03-11', preuve: 'Registre de l’amiante' },
  { id: 'o11', inst: 'erables', cat: 'Financement', titre: 'Bilan de santé des infrastructures', frequence: 'Avant tout investissement de plus de 50 000 $ (aux 5 ans selon la pratique)', source: 'Règles budgétaires des CPE 2026-2027', certitude: 'Vérifié', derniere: '2022-05-12', prochaine: '2027-05-12', preuve: 'Rapport du 30 mai 2022' },
  { id: 'o12', inst: 'ruisseau', cat: 'Aire de jeu', titre: "Certificat de conformité de l'aire de jeu (norme CSA Z614)", frequence: 'Aux 3 ans (au plus tard le 31 décembre de la 3e année)', source: "Règlement sur les services de garde éducatifs à l'enfance, art. 42", certitude: 'Vérifié', derniere: '2024-05-22', prochaine: '2027-12-31', preuve: 'Certificat du 22 mai 2024' },
  { id: 'o13', inst: 'ruisseau', cat: 'Sécurité incendie', titre: "Système d'alarme incendie : inspection annuelle par une firme", frequence: 'Chaque année', source: 'Code de sécurité, CAN/ULC-S536 (fiche de la RBQ)', certitude: 'Vérifié', derniere: '2026-09-16', prochaine: '2027-09-16', preuve: 'Certificat du 18 septembre 2026' },
  { id: 'o14', inst: 'ruisseau', cat: 'Financement', titre: 'Bilan de santé des infrastructures', frequence: 'Non exigé avant le 31 mars 2030 (financement du PFI depuis 2020)', source: 'Règles budgétaires des CPE 2026-2027', certitude: 'Vérifié', derniere: null, prochaine: '2030-03-31', preuve: 'Carnet d’entretien tenu à jour' },
  { id: 'o15', inst: 'ruisseau', cat: 'Mécanique', titre: "Climatisation de 20 kW ou plus : épreuve d'étanchéité", frequence: 'Chaque année (au plus 15 mois entre deux épreuves)', source: 'Règlement sur les halocarbures, art. 22', certitude: 'Vérifié', derniere: '2026-05-06', prochaine: '2027-05-06', preuve: 'Rapport du frigoriste' },
  { id: 'o16', inst: 'gare', cat: 'Aire de jeu', titre: "Certificat de conformité de l'aire de jeu (norme CSA Z614)", frequence: 'Aux 3 ans (au plus tard le 31 décembre de la 3e année)', source: "Règlement sur les services de garde éducatifs à l'enfance, art. 42", certitude: 'Vérifié', derniere: '2025-06-03', prochaine: '2028-12-31', preuve: 'Certificat du 3 juin 2025' },
  { id: 'o17', inst: 'gare', cat: 'Eau potable', titre: 'Plomb dans l’eau : échantillonnage de suivi au robinet principal', frequence: 'Aux 5 ans, de juillet à septembre', source: "Règlement sur le contrôle du plomb dans l'eau (services de garde), 2025", certitude: 'Vérifié', derniere: '2026-08-20', prochaine: '2031-08-20', preuve: 'Résultat : inférieur à 5 µg/L' }
];
