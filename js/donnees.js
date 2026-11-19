/* Solage — données de démonstration. TOUT est fictif : noms, adresses, montants, dates, fournisseurs.
   Les durées de vie et les coûts sont des ordres de grandeur inventés pour illustrer l'interface. */

const D = {};

D.cpe = { nom: 'CPE Les Petits Bâtisseurs', region: 'Estrie', places: 186, membreDepuis: 2009 };

/* ---------- Installations ---------- */
D.installations = [
  {
    id: 'erables', nom: 'Installation des Érables', ville: 'Sherbrooke', adresse: '120, rue des Érables, Sherbrooke', region: 'Estrie',
    places: 80, annee: 1996, superficie: 742, etages: 2, statut: 'Propriétaire', photo: 'brique',
    structure: 'Ossature de bois, parement de brique', toiture: "Toit en pente, bardeaux d'asphalte (2004)", chauffage: 'Plinthes électriques et thermopompe (2016)',
    sante: 68, tendance: -4, bilan: '2022-05-12', prochainBilan: '2027-05-12', inspectionAnnuelle: '2026-10-06',
    valeurReconstruction: 3450000, deficiencesOuvertes: 7, tachesMois: 5, exemptionPFI: false
  },
  {
    id: 'ruisseau', nom: 'Installation du Ruisseau', ville: 'Magog', adresse: '45, chemin du Ruisseau, Magog', region: 'Estrie',
    places: 62, annee: 2012, superficie: 610, etages: 1, statut: 'Propriétaire', photo: 'toit',
    structure: 'Ossature de bois, parement de fibrociment', toiture: 'Toit plat, membrane élastomère (2012)', chauffage: 'Système central à air pulsé, récupérateur de chaleur',
    sante: 86, tendance: 1, bilan: null, prochainBilan: '2030-03-31', inspectionAnnuelle: '2026-09-22',
    valeurReconstruction: 2980000, deficiencesOuvertes: 0, tachesMois: 3, exemptionPFI: true
  },
  {
    id: 'gare', nom: 'Installation de la Gare', ville: 'Sherbrooke', adresse: '8, rue de la Gare, bureau 100, Sherbrooke', region: 'Estrie',
    places: 44, annee: 1978, superficie: 395, etages: 1, statut: 'Locataire (bail jusqu’en 2031)', photo: '',
    structure: "Rez-de-chaussée d'un immeuble commercial", toiture: 'À la charge du locateur', chauffage: 'Plinthes électriques',
    sante: 74, tendance: 0, bilan: null, prochainBilan: null, inspectionAnnuelle: '2026-10-14',
    valeurReconstruction: 0, deficiencesOuvertes: 1, tachesMois: 2, exemptionPFI: false
  }
];
D.inst = id => D.installations.find(i => i.id === id) || D.installations[0];

/* ---------- Composantes (inventaire du carnet de santé) ----------
   etat : 1 = très bon … 5 = à remplacer. vie = durée de vie utile indicative (années). */
D.composantes = [
  { id: 'c1', inst: 'erables', cat: 'Toiture', nom: "Toiture en bardeaux d'asphalte", annee: 2004, vie: 25, etat: 4, cout: 78000, fiche: '2.3.2', note: 'Bardeaux qui frisent du côté sud; entretoit à mieux ventiler.' },
  { id: 'c2', inst: 'erables', cat: 'Enveloppe', nom: 'Fondations de béton coulé', annee: 1996, vie: 75, etat: 2, cout: 0, fiche: '2.2.1', note: 'Fissure verticale de moins de 1/8 po, sous surveillance.' },
  { id: 'c3', inst: 'erables', cat: 'Enveloppe', nom: 'Parement de brique', annee: 1996, vie: 75, etat: 2, cout: 0, fiche: '2.2.2', note: 'Joints de mortier à refaire sous deux fenêtres.' },
  { id: 'c4', inst: 'erables', cat: 'Enveloppe', nom: 'Fenêtres (verre thermos)', annee: 2010, vie: 25, etat: 3, cout: 64000, fiche: '2.2.5', note: 'Buée entre les verres dans deux locaux.' },
  { id: 'c5', inst: 'erables', cat: 'Enveloppe', nom: 'Portes extérieures et ferme-portes', annee: 2010, vie: 25, etat: 2, cout: 18000, fiche: '2.2.4', note: '' },
  { id: 'c6', inst: 'erables', cat: 'Mécanique', nom: 'Chauffe-eau (2 × 60 gallons)', annee: 2015, vie: 12, etat: 4, cout: 4200, fiche: '2.7.5', note: 'Fin de vie utile prévue en 2027.' },
  { id: 'c7', inst: 'erables', cat: 'Mécanique', nom: 'Thermopompe murale', annee: 2016, vie: 15, etat: 2, cout: 9500, fiche: '2.5.2', note: '' },
  { id: 'c8', inst: 'erables', cat: 'Mécanique', nom: "Échangeur d'air et conduits", annee: 2008, vie: 20, etat: 3, cout: 16500, fiche: '2.5.1', note: 'Nettoyage des conduits fait en 2023.' },
  { id: 'c9', inst: 'erables', cat: 'Sécurité', nom: "Système d'alarme incendie", annee: 2008, vie: 20, etat: 3, cout: 22000, fiche: '3.6', note: 'Panneau à remplacer avec la mise à niveau prévue en 2028.' },
  { id: 'c10', inst: 'erables', cat: 'Sécurité', nom: "Éclairage d'urgence et enseignes de sortie", annee: 2018, vie: 15, etat: 2, cout: 6800, fiche: '2.6.4', note: '' },
  { id: 'c11', inst: 'erables', cat: 'Extérieur', nom: 'Stationnement et accès (asphalte)', annee: 2006, vie: 20, etat: 5, cout: 41000, fiche: '2.1.1', note: 'Crevasses et nids-de-poule; accumulation de glace près du débarcadère.' },
  { id: 'c12', inst: 'erables', cat: 'Extérieur', nom: 'Aire de jeu : modules et surface amortissante', annee: 2014, vie: 15, etat: 3, cout: 58000, fiche: null, note: 'Composante propre aux CPE, absente du guide de 2017.' },
  { id: 'c13', inst: 'erables', cat: 'Extérieur', nom: 'Clôture de la cour', annee: 2014, vie: 25, etat: 2, cout: 14000, fiche: '2.1.7', note: '' },
  { id: 'c14', inst: 'erables', cat: 'Intérieur', nom: 'Revêtements de plancher', annee: 2012, vie: 20, etat: 3, cout: 36000, fiche: '2.4.4', note: '' },
  { id: 'c15', inst: 'erables', cat: 'Intérieur', nom: 'Cuisine : hotte commerciale et équipements', annee: 2009, vie: 20, etat: 3, cout: 27000, fiche: '2.4.7', note: '' },
  { id: 'c16', inst: 'erables', cat: 'Électricité', nom: 'Entrée électrique et distribution', annee: 1996, vie: 40, etat: 2, cout: 19000, fiche: '2.8.2', note: 'Panneau localisé et identifié (local 104).' },
  { id: 'c20', inst: 'ruisseau', cat: 'Toiture', nom: 'Toit plat, membrane élastomère', annee: 2012, vie: 25, etat: 2, cout: 92000, fiche: '2.3.1', note: '' },
  { id: 'c21', inst: 'ruisseau', cat: 'Mécanique', nom: 'Système central à air pulsé', annee: 2012, vie: 20, etat: 2, cout: 38000, fiche: '2.5.2', note: '' },
  { id: 'c22', inst: 'ruisseau', cat: 'Extérieur', nom: 'Aire de jeu : modules et surface amortissante', annee: 2021, vie: 15, etat: 1, cout: 61000, fiche: null, note: '' },
  { id: 'c23', inst: 'ruisseau', cat: 'Mécanique', nom: 'Chauffe-eau', annee: 2022, vie: 12, etat: 1, cout: 3900, fiche: '2.7.5', note: '' },
  { id: 'c30', inst: 'gare', cat: 'Intérieur', nom: 'Revêtements de plancher', annee: 2016, vie: 20, etat: 2, cout: 21000, fiche: '2.4.4', note: 'Améliorations locatives.' },
  { id: 'c31', inst: 'gare', cat: 'Extérieur', nom: 'Aire de jeu clôturée', annee: 2016, vie: 15, etat: 3, cout: 33000, fiche: null, note: '' }
];
D.ETATS = { 1: ['Très bon', 'ok'], 2: ['Bon', 'ok'], 3: ['Passable', 'alerte'], 4: ['Mauvais', 'alerte'], 5: ['À remplacer', 'critique'] };
D.finDeVie = c => c.annee + c.vie;

/* ---------- Codes des grilles (repris du guide de 2017, p. 8) ---------- */
D.CODES = { NA: 'Rien à effectuer', SN: 'Suivi nécessaire', RP: 'À réparer ou à peinturer', RE: 'À remplacer', DE: "Demande d'expertise" };

/* ---------- Déficiences et travaux ---------- */
D.deficiences = [
  { id: 'd1', inst: 'erables', comp: 'c11', titre: 'Nids-de-poule près du débarcadère', code: 'RP', gravite: 'Élevée', statut: 'Soumission demandée', cout: 6500, constat: '2026-10-06', source: 'Inspection annuelle', photo: '', metier: 'Entrepreneur en pavage' },
  { id: 'd2', inst: 'erables', comp: 'c1', titre: 'Bardeaux qui frisent, versant sud', code: 'DE', gravite: 'Élevée', statut: 'À évaluer', cout: 78000, constat: '2026-10-06', source: 'Inspection annuelle', photo: 'toit', metier: 'Couvreur' },
  { id: 'd3', inst: 'erables', comp: 'c6', titre: 'Chauffe-eau en fin de vie utile', code: 'RE', gravite: 'Moyenne', statut: 'Planifié', cout: 4200, constat: '2026-10-06', source: 'Inspection annuelle', photo: '', metier: 'Plombier', prevu: '2027-03-08' },
  { id: 'd4', inst: 'erables', comp: 'c3', titre: 'Joints de mortier dégradés sous deux fenêtres', code: 'RP', gravite: 'Moyenne', statut: 'À évaluer', cout: 3200, constat: '2026-10-06', source: 'Inspection annuelle', photo: 'brique', metier: 'Maçon' },
  { id: 'd5', inst: 'erables', comp: 'c4', titre: 'Buée entre les verres, locaux 12 et 14', code: 'RE', gravite: 'Faible', statut: 'Planifié', cout: 2900, constat: '2026-04-21', source: "Grille d'entretien, printemps", photo: '', metier: 'Vitrier', prevu: '2027-05-17' },
  { id: 'd6', inst: 'erables', comp: 'c12', titre: 'Surface amortissante tassée sous la glissoire', code: 'RP', gravite: 'Élevée', statut: 'Soumission demandée', cout: 5400, constat: '2026-05-14', source: "Inspection annuelle de l'aire de jeu", photo: 'jeu', metier: "Spécialiste d'aires de jeu" },
  { id: 'd7', inst: 'erables', comp: 'c2', titre: 'Fissure verticale dans la fondation, mur nord', code: 'SN', gravite: 'Faible', statut: 'Suivi', cout: 0, constat: '2025-10-09', source: 'Inspection annuelle', photo: '', metier: 'Spécialiste en fissures' },
  { id: 'd8', inst: 'ruisseau', comp: 'c20', titre: 'Drain de toit partiellement obstrué', code: 'RP', gravite: 'Moyenne', statut: 'Terminé', cout: 350, constat: '2026-09-22', source: 'Inspection annuelle', photo: 'toit', metier: 'Couvreur', fait: '2026-10-02' },
  { id: 'd9', inst: 'gare', comp: 'c31', titre: 'Loquet de la barrière de la cour défectueux', code: 'RP', gravite: 'Urgent', statut: 'Terminé', cout: 180, constat: '2026-10-14', source: 'Inspection annuelle', photo: '', metier: "Préposé à l'entretien", fait: '2026-10-15' },
  { id: 'd10', inst: 'gare', comp: 'c30', titre: 'Tuiles décollées dans le vestiaire', code: 'RP', gravite: 'Moyenne', statut: 'À évaluer', cout: 900, constat: '2026-10-14', source: 'Inspection annuelle', photo: '', metier: 'Poseur de revêtements souples' },
  { id: 'd11', inst: 'erables', comp: 'c9', titre: 'Détecteur de fumée du corridor de l’étage à remplacer', code: 'RE', gravite: 'Urgent', statut: 'Terminé', cout: 240, constat: '2026-09-15', source: "Vérification annuelle de l'alarme incendie", photo: '', metier: 'Technicien en alarme incendie', fait: '2026-09-17' }
];
D.GRAVITES = { 'Urgent': 'critique', 'Élevée': 'alerte', 'Moyenne': 'info', 'Faible': 'neutre' };
D.STATUTS_TRAVAUX = ['À évaluer', 'Soumission demandée', 'Planifié', 'Terminé'];

/* ---------- Inspections ---------- */
D.inspections = [
  { id: 'i1', inst: 'erables', type: 'Inspection annuelle', date: '2026-10-06', par: 'Camille Roy, technologue (Service des infrastructures, AQCPE)', statut: 'Rapport déposé', constats: 9, deficiences: 5, duree: '3 h 10' },
  { id: 'i2', inst: 'gare', type: 'Inspection annuelle', date: '2026-10-14', par: 'Camille Roy, technologue (Service des infrastructures, AQCPE)', statut: 'Rapport déposé', constats: 4, deficiences: 2, duree: '1 h 45' },
  { id: 'i3', inst: 'ruisseau', type: 'Inspection annuelle', date: '2026-09-22', par: 'Camille Roy, technologue (Service des infrastructures, AQCPE)', statut: 'Rapport déposé', constats: 3, deficiences: 1, duree: '2 h 20' },
  { id: 'i4', inst: 'erables', type: "Vérification annuelle de l'alarme incendie", date: '2026-09-15', par: 'Entreprise spécialisée (fournisseur agréé)', statut: 'Certificat reçu', constats: 1, deficiences: 1, duree: '1 h 30' },
  { id: 'i5', inst: 'erables', type: "Inspection annuelle de l'aire de jeu", date: '2026-05-14', par: 'Inspectrice certifiée en aires de jeu', statut: 'Rapport déposé', constats: 3, deficiences: 1, duree: '1 h 15' },
  { id: 'i6', inst: 'erables', type: 'Bilan de santé (aux cinq ans)', date: '2022-05-12', par: 'Technologue professionnel (Service des infrastructures, AQCPE)', statut: 'Rapport déposé', constats: 31, deficiences: 12, duree: '1 journée' },
  { id: 'i7', inst: 'erables', type: 'Bilan de santé (aux cinq ans)', date: '2027-05-12', par: 'À planifier', statut: 'À planifier', constats: 0, deficiences: 0, duree: '' },
  { id: 'i8', inst: 'ruisseau', type: "Inspection annuelle de l'aire de jeu", date: '2027-05-20', par: 'À planifier', statut: 'À planifier', constats: 0, deficiences: 0, duree: '' }
];

/* ---------- Assurance ---------- */
D.assurance = {
  assureur: 'Assureur partenaire (fictif)', courtier: 'Cabinet de courtage partenaire (fictif)', personne: 'Alex Bouchard', tel: '819 555-0142',
  police: 'BAT-000000', debut: '2026-04-01', echeance: '2027-04-01', prime: 28640, franchise: 5000, franchiseEau: 10000,
  garanties: ['Bâtiments et contenu (valeur à neuf)', 'Bris des équipements', "Pertes d'exploitation", 'Responsabilité civile générale', 'Responsabilité des administrateurs et dirigeants']
};
D.SINISTRES = ['Feu', 'Vol', 'Vandalisme', "Dégâts d'eau", "Refoulement d'égout", 'Inondation', 'Tempête de vent', 'Tremblement de terre', 'Tornade', 'Glissement de terrain'];
D.reclamations = [
  { id: 'r1', inst: 'erables', date: '2026-02-11', type: "Dégâts d'eau", desc: "Bris d'un tuyau d'alimentation dans la salle de lavage; plancher et bas de murs de deux locaux touchés.", reclame: 24800, paye: 14800, regle: false, statut: 'En traitement', etapes: [['2026-02-11', 'Sinistre déclaré au courtier', 'fait'], ['2026-02-12', "Travaux d'urgence (assèchement)", 'fait'], ['2026-02-19', "Visite de l'expert en sinistres", 'fait'], ['2026-03-30', 'Paiement partiel reçu : 14 800 $', 'fait'], ['', 'Règlement final', 'attente']] },
  { id: 'r2', inst: 'gare', date: '2025-08-03', type: 'Vandalisme', desc: 'Vitrine de la façade fracassée durant la fin de semaine.', reclame: 3100, paye: 0, regle: true, statut: 'Sous la franchise', etapes: [['2025-08-04', 'Sinistre déclaré au courtier', 'fait'], ['2025-08-06', 'Montant inférieur à la franchise; dossier fermé', 'fait']] },
  { id: 'r3', inst: 'erables', date: '2023-12-18', type: 'Tempête de vent', desc: 'Bardeaux arrachés sur le versant ouest et clôture endommagée par une branche.', reclame: 11900, paye: 6900, regle: true, statut: 'Réglé', etapes: [['2023-12-18', 'Sinistre déclaré au courtier', 'fait'], ['2023-12-21', 'Réparation temporaire du toit', 'fait'], ['2024-02-02', 'Règlement final : 6 900 $', 'fait']] },
  { id: 'r4', inst: 'ruisseau', date: '2021-07-09', type: "Refoulement d'égout", desc: 'Refoulement au sous-sol technique après une pluie abondante.', reclame: 18300, paye: 8300, regle: true, statut: 'Réglé', etapes: [['2021-07-09', 'Sinistre déclaré au courtier', 'fait'], ['2021-09-14', 'Règlement final : 8 300 $', 'fait']] }
];

/* ---------- Fournisseurs agréés (fictifs) ---------- */
D.fournisseurs = [
  { id: 'f1', nom: 'Toitures du Haut-Saint-François', metier: 'Couvreur', regions: 'Estrie, Centre-du-Québec', note: 4.7, contrats: 23, rabais: 'Tarif négocié pour les membres', licence: 'Licence RBQ vérifiée' },
  { id: 'f2', nom: 'Protection incendie Memphré', metier: 'Alarme incendie, extincteurs, éclairage de sécurité', regions: 'Estrie, Montérégie', note: 4.8, contrats: 61, rabais: 'Tournée annuelle regroupée', licence: 'Licence RBQ vérifiée' },
  { id: 'f3', nom: 'Aires de jeu Trottinette', metier: "Inspection et entretien d'aires de jeu", regions: 'Tout le Québec', note: 4.6, contrats: 48, rabais: 'Forfait inspection annuelle', licence: 'Inspection certifiée' },
  { id: 'f4', nom: 'Plomberie des Cantons', metier: 'Plombier', regions: 'Estrie', note: 4.4, contrats: 17, rabais: 'Tarif négocié pour les membres', licence: 'Licence RBQ vérifiée' },
  { id: 'f5', nom: 'Pavage Orford', metier: 'Entrepreneur en pavage', regions: 'Estrie', note: 4.2, contrats: 9, rabais: 'Regroupement de travaux possible', licence: 'Licence RBQ vérifiée' },
  { id: 'f6', nom: 'Maçonnerie Saint-François', metier: 'Maçon', regions: 'Estrie, Chaudière-Appalaches', note: 4.5, contrats: 12, rabais: 'Tarif négocié pour les membres', licence: 'Licence RBQ vérifiée' },
  { id: 'f7', nom: 'Ventilation Boréale', metier: 'Ventilation et nettoyage de conduits', regions: 'Estrie, Montérégie, Montréal', note: 4.3, contrats: 34, rabais: 'Tournée regroupée au printemps', licence: 'Licence RBQ vérifiée' }
];

/* ---------- Regroupements de travaux (achats regroupés) ---------- */
D.campagnes = [
  { id: 'g1', titre: 'Réfection de toitures en bardeaux', region: 'Estrie', debut: '2027-06-07', fin: '2027-07-16', limite: '2027-01-29', inscrits: 14, cible: 20, fournisseur: 'f1', economie: '12 à 18 %', statut: 'Inscriptions ouvertes', pertinent: 'erables', raison: "Votre toiture des Érables atteint sa fin de vie utile en 2029 et montre des signes d'usure." },
  { id: 'g2', titre: "Inspection annuelle des aires de jeu", region: 'Estrie et Montérégie', debut: '2027-05-03', fin: '2027-05-28', limite: '2027-03-12', inscrits: 37, cible: 40, fournisseur: 'f3', economie: '20 %', statut: 'Inscriptions ouvertes', pertinent: 'ruisseau', raison: 'Trois aires de jeu à inspecter en mai 2027.' },
  { id: 'g3', titre: "Vérification annuelle de l'alarme incendie et des extincteurs", region: 'Estrie', debut: '2027-09-13', fin: '2027-09-24', limite: '2027-06-30', inscrits: 52, cible: 50, fournisseur: 'f2', economie: '15 %', statut: 'Vous êtes inscrit', pertinent: 'erables', raison: 'Vos trois installations sont inscrites à la tournée.' },
  { id: 'g4', titre: 'Remplacement de chauffe-eau', region: 'Estrie', debut: '2027-03-01', fin: '2027-03-19', limite: '2027-01-15', inscrits: 9, cible: 15, fournisseur: 'f4', economie: '10 %', statut: 'Inscriptions ouvertes', pertinent: 'erables', raison: 'Vos chauffe-eau des Érables datent de 2015.' },
  { id: 'g5', titre: 'Nettoyage des conduits de ventilation', region: 'Montérégie', debut: '2027-04-12', fin: '2027-04-30', limite: '2027-02-26', inscrits: 18, cible: 25, fournisseur: 'f7', economie: '14 %', statut: 'Hors de votre région', pertinent: null, raison: '' }
];

/* ---------- Documents ---------- */
D.documents = [
  { nom: 'Bilan de santé 2022, Installation des Érables', cat: 'Rapports et certificats', inst: 'erables', date: '2022-05-30', type: 'PDF', taille: '8,4 Mo' },
  { nom: "Rapport d'inspection annuelle 2026", cat: 'Rapports et certificats', inst: 'erables', date: '2026-10-09', type: 'PDF', taille: '3,1 Mo' },
  { nom: "Certificat de vérification de l'alarme incendie 2026", cat: 'Rapports et certificats', inst: 'erables', date: '2026-09-17', type: 'PDF', taille: '420 Ko' },
  { nom: "Certificat de conformité de l'aire de jeu", cat: 'Rapports et certificats', inst: 'erables', date: '2026-05-20', type: 'PDF', taille: '610 Ko' },
  { nom: 'Plans tels que construits (architecture)', cat: 'Plans et devis', inst: 'erables', date: '1996-08-15', type: 'PDF', taille: '22 Mo' },
  { nom: 'Certificat de localisation', cat: 'Plans et devis', inst: 'erables', date: '2014-06-03', type: 'PDF', taille: '1,2 Mo' },
  { nom: 'Facture, thermopompe murale', cat: 'Factures', inst: 'erables', date: '2016-09-12', type: 'PDF', taille: '180 Ko' },
  { nom: 'Garantie du fabricant, thermopompe (10 ans)', cat: 'Garanties', inst: 'erables', date: '2016-09-12', type: 'PDF', taille: '240 Ko' },
  { nom: "Contrat d'entretien, alarme incendie et extincteurs", cat: "Contrats d'entretien", inst: 'erables', date: '2026-01-10', type: 'PDF', taille: '350 Ko' },
  { nom: 'Contrat de déneigement 2026-2027', cat: "Contrats d'entretien", inst: 'erables', date: '2026-10-01', type: 'PDF', taille: '210 Ko' },
  { nom: "Police d'assurance 2026-2027", cat: 'Assurance', inst: null, date: '2026-04-01', type: 'PDF', taille: '1,9 Mo' },
  { nom: 'Bail commercial, Installation de la Gare', cat: 'Baux et actes', inst: 'gare', date: '2021-07-01', type: 'PDF', taille: '2,6 Mo' },
  { nom: "Procès-verbal du CA, adoption du plan de maintien d'actifs", cat: 'Procès-verbaux', inst: null, date: '2026-06-17', type: 'PDF', taille: '150 Ko' },
  { nom: 'Plans de la membrane de toiture', cat: 'Plans et devis', inst: 'ruisseau', date: '2012-05-22', type: 'PDF', taille: '5,3 Mo' }
];
