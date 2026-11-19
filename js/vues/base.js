/* Vues de base : connexion, tableau de bord, notifications, installations, carnet de santé d'une installation. */

/* ---------- Connexion ---------- */
App.vue('connexion', {
  pleinEcran: true,
  rendu() {
    return `
    <div class="connexion">
      <section class="connexion-visuel">
        <div class="rangee">${logoSolage(46)}<div><div class="marque-nom" style="font-size:1.7rem">Solage</div><div class="marque-sous">Le carnet de santé des bâtiments du réseau des CPE</div></div></div>
        <div class="pile">
          <h1>Un bâtiment en santé, des tout-petits en sécurité.</h1>
          <p>Planifiez l'entretien, suivez vos inspections, documentez vos travaux et vos réclamations au même endroit. Vos données servent aussi à regrouper les travaux entre membres pour obtenir de meilleurs prix.</p>
          <div class="rangee" style="gap:22px;margin-top:8px">
            <div><div class="marque-nom">3</div><div class="marque-sous">installations suivies</div></div>
            <div><div class="marque-nom">22</div><div class="marque-sous">composantes au carnet</div></div>
            <div><div class="marque-nom">5</div><div class="marque-sous">regroupements ouverts</div></div>
          </div>
        </div>
        <div class="lateral-pied" style="border:0;padding:0">Une initiative proposée par
          <div class="partenaires"><span class="pastille"><img src="img/logo_williamcoop.svg" alt="william.coop"></span><span class="pastille aq">AQCPE</span><span style="opacity:.8">Partenariat proposé, à confirmer</span></div>
        </div>
      </section>
      <section class="connexion-form">
        <form class="connexion-boite" id="form-connexion">
          <div><h1>Ouvrir une session</h1><p class="muet" style="margin-top:4px">Utilisez votre compte de membre william.coop.</p></div>
          <div class="champ"><label for="cx-id">Nom d'utilisateur</label><input id="cx-id" type="text" value="dominique.tremblay" autocomplete="off"></div>
          <div class="champ"><label for="cx-mdp">Mot de passe</label><input id="cx-mdp" type="password" value="demonstration" autocomplete="off"></div>
          <div class="champ"><label for="cx-role">Profil de démonstration</label>
            <select id="cx-role">${Object.entries(ROLES).map(([k, v]) => `<option value="${k}">${v.nom}</option>`).join('')}</select>
          </div>
          <button class="btn bloc" type="submit">Ouvrir une session</button>
          <div class="rangee entre petit"><a href="#" data-action="Courriel de réinitialisation envoyé">Mot de passe oublié</a><a href="#" data-action="Identifiant envoyé par courriel">Identifiant oublié</a><a href="#" data-action="Demande d'inscription transmise">S'inscrire</a></div>
          <div class="avis ambre">${ic('info')}<div class="petit">Solage est un outil d'aide à la gestion. Il ne remplace pas l'avis d'un professionnel du bâtiment. Connexion sécurisée (HTTPS).</div></div>
        </form>
      </section>
    </div>`;
  },
  apres(racine) {
    racine.querySelector('#form-connexion').addEventListener('submit', e => {
      e.preventDefault();
      App.role = racine.querySelector('#cx-role').value;
      App.aller(ROLES[App.role].accueil);
    });
  }
});

/* ---------- Tableau de bord ---------- */
App.vue('accueil', {
  rendu() {
    const ouvertes = D.deficiences.filter(d => d.statut !== 'Terminé');
    const urgentes = ouvertes.filter(d => d.gravite === 'Élevée' || d.gravite === 'Urgent');
    const taches = D.taches.filter(t => t.date.slice(0, 7) === AUJ.slice(0, 7));
    const faites = taches.filter(t => t.fait).length;
    const aVenir = D.taches.filter(t => !t.fait).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
    const sante = Math.round(D.installations.reduce((s, i) => s + i.sante, 0) / D.installations.length);
    const echeances = D.obligations.filter(o => joursAvant(o.prochaine) <= 60).sort((a, b) => a.prochaine.localeCompare(b.prochaine));
    const camp = D.campagnes.filter(c => c.pertinent && c.statut === 'Inscriptions ouvertes');
    const rec = D.reclamations.find(r => !r.regle);
    return `
    <div class="page-tete">
      <div><div class="sur">Mercredi 18 novembre 2026 · ${D.cpe.nom}</div><h1>Bonjour Dominique</h1>
        <p class="intro">L'automne tire à sa fin : il reste ${taches.length - faites} tâches d'entretien à faire avant l'hiver, et deux travaux attendent une décision.</p></div>
      <div class="actions"><button class="btn clair" ${aller('rapports')}>${ic('rapport')}Rapport au CA</button><button class="btn" ${aller('grilles')}>${ic('grille')}Remplir une grille</button></div>
    </div>

    <div class="grille g4">
      <div class="carte"><div class="rangee" style="flex-wrap:nowrap">${jauge(sante, 'sur 100', 'var(--ambre)')}<div class="stat"><span class="lib">Indice de santé du parc</span><span class="tend mauvais">−1 point depuis un an</span><button class="btn nu mini" ${aller('installations')}>Voir le détail</button></div></div></div>
      <div class="carte stat"><span class="lib">Tâches d'entretien en novembre</span><span class="val">${faites} <small>/ ${taches.length} faites</small></span>${barre(faites / taches.length * 100, 'ok')}<button class="btn nu mini" style="align-self:flex-start" ${aller('calendrier')}>Ouvrir le calendrier</button></div>
      <div class="carte stat"><span class="lib">Déficiences ouvertes</span><span class="val">${ouvertes.length} <small>dont ${urgentes.length} prioritaires</small></span><span class="tend neutre">Travaux estimés : ${argent(ouvertes.reduce((s, d) => s + d.cout, 0))}</span><button class="btn nu mini" style="align-self:flex-start" ${aller('travaux')}>Voir les travaux</button></div>
      <div class="carte stat"><span class="lib">Échéances de conformité, 60 jours</span><span class="val">${echeances.length}</span><span class="tend ${echeances.some(o => joursAvant(o.prochaine) < 0) ? 'mauvais' : 'neutre'}">${echeances.filter(o => joursAvant(o.prochaine) < 0).length} en retard</span><button class="btn nu mini" style="align-self:flex-start" ${aller('conformite')}>Voir la conformité</button></div>
    </div>

    <div class="grille g-2-1">
      <div class="pile">
        <div class="carte serree">
          <div class="carte-tete"><h2>À faire prochainement</h2><button class="lien" ${aller('calendrier')}>Tout le calendrier</button></div>
          <div class="liste">
            ${aVenir.map(t => `<div class="ligne cliquable" ${aller(t.grille ? 'grille' : 'calendrier', t.grille ? { id: t.grille, inst: t.inst } : null)}>
              <div class="ico ${t.type === 'Contrat' ? 'ambre' : t.type === 'Conformité' ? 'vert' : ''}">${ic(t.type === 'Contrat' ? 'camion' : t.type === 'Conformité' ? 'bouclier' : 'grille')}</div>
              <div class="corps"><b>${t.titre}</b><span>${D.inst(t.inst).nom} · ${t.resp}</span></div>
              ${etiq(t.type, t.type === 'Contrat' ? 'ambre' : t.type === 'Conformité' ? 'vert' : 'bleu')}${echeance(t.date)}
            </div>`).join('')}
          </div>
        </div>

        <div class="carte serree">
          <div class="carte-tete"><h2>Mes installations</h2><button class="lien" ${aller('installations')}>Voir tout</button></div>
          <div class="table-zone"><table class="t">
            <thead><tr><th>Installation</th><th>Indice de santé</th><th>Déficiences</th><th>Bilan de santé</th><th>Carnet d'entretien</th></tr></thead>
            <tbody>${D.installations.map(i => `<tr class="cliquable" ${aller('installation', { id: i.id })}>
              <td><span class="principal-cel">${i.nom}</span><span class="sous">${i.ville} · ${i.places} places · ${i.annee}</span></td>
              <td style="min-width:150px"><div class="rangee" style="flex-wrap:nowrap"><b class="num">${i.sante}</b><div style="flex:1">${barre(i.sante, i.sante >= 80 ? 'ok' : i.sante >= 70 ? 'alerte' : 'critique')}</div></div></td>
              <td class="num">${i.deficiencesOuvertes}</td>
              <td>${i.bilan ? pil('ok', dateFr(i.bilan)) : i.exemptionPFI ? pil('info', 'Non exigé avant 2030') : pil('neutre', 'Locataire')}</td>
              <td>${pil('ok', 'À jour')}</td></tr>`).join('')}
            </tbody></table></div>
        </div>

        <div class="carte">
          <div class="carte-tete"><h2>Prêt pour une demande au Ministère?</h2>${pil('ok', '2 installations sur 2 prêtes')}</div>
          <p class="petit" style="color:var(--texte-2);max-width:75ch">Selon les règles budgétaires 2026-2027 des CPE, un CPE propriétaire doit avoir réalisé un bilan de santé de ses infrastructures, tenir un carnet d'entretien et exécuter les correctifs planifiés avant tout investissement de plus de 50 000 $. Solage tient ces trois éléments à jour.</p>
          <div class="grille g3" style="margin-top:14px">
            <div class="rangee" style="flex-wrap:nowrap"><div class="ico vert">${ic('coche')}</div><div><b>Bilan de santé</b><div class="petit muet">Érables : 12 mai 2022 · Ruisseau : exempté jusqu'au 31 mars 2030</div></div></div>
            <div class="rangee" style="flex-wrap:nowrap"><div class="ico vert">${ic('coche')}</div><div><b>Carnet d'entretien</b><div class="petit muet">22 composantes, mis à jour le 6 octobre 2026</div></div></div>
            <div class="rangee" style="flex-wrap:nowrap"><div class="ico ambre">${ic('horloge')}</div><div><b>Correctifs planifiés</b><div class="petit muet">8 sur 12 exécutés, 4 planifiés</div></div></div>
          </div>
        </div>
      </div>

      <div class="pile">
        <div class="carte" style="border-color:var(--ambre);background:var(--ambre-pale)">
          <div class="carte-tete"><h2>Regroupements qui vous concernent</h2>${etiq('william.coop', 'ambre')}</div>
          <div class="pile serre">
            ${camp.map(c => `<div class="ligne cliquable" style="padding:12px 14px;background:var(--surface);border:1px solid var(--ligne);border-radius:var(--r-s)" ${aller('achats', { id: c.id })}>
              <div class="corps"><b>${c.titre}</b><span>${c.region} · du ${dateFr(c.debut, true)} au ${dateFr(c.fin, true)} · économie estimée ${c.economie}</span><div class="petit" style="color:var(--ambre-fonce);margin-top:4px">${c.raison}</div></div>${ic('droite')}
            </div>`).join('')}
          </div>
          <button class="btn ambre bloc" style="margin-top:12px" ${aller('achats')}>Voir les achats regroupés</button>
        </div>

        <div class="carte">
          <div class="carte-tete"><h2>Conformité à surveiller</h2><button class="lien" ${aller('conformite')}>Tout voir</button></div>
          <div class="liste">${echeances.slice(0, 4).map(o => `<div class="ligne"><div class="corps"><b>${o.titre}</b><span>${D.inst(o.inst).nom}</span></div>${echeance(o.prochaine)}</div>`).join('')}</div>
        </div>

        ${rec ? `<div class="carte">
          <div class="carte-tete"><h2>Réclamation en cours</h2>${pil('alerte', rec.statut)}</div>
          <div class="ligne cliquable" ${aller('reclamations', { id: rec.id })}><div class="ico">${ic('eau')}</div><div class="corps"><b>${rec.type}, ${dateFr(rec.date)}</b><span>${D.inst(rec.inst).nom} · ${argent(rec.paye)} reçus sur ${argent(rec.reclame)} réclamés</span></div></div>
        </div>` : ''}

        <div class="carte">
          <div class="carte-tete"><h2>Conseil de saison</h2>${etiq('Automne', 'ambre')}</div>
          <p class="petit" style="color:var(--texte-2)">Avant les premières neiges : dégagez les gouttières, vérifiez que les descentes éloignent l'eau des fondations et faites le tour des ferme-portes extérieurs.</p>
          <button class="btn nu mini" style="margin-top:8px" ${aller('fiche', { id: '2.3.2' })}>${ic('livre')}Lire la fiche « Toit en pente »</button>
        </div>
      </div>
    </div>`;
  }
});

/* ---------- Notifications ---------- */
App.vue('notifications', {
  rendu() {
    const n = [
      ['alerte', 'rouge', "Vérification mensuelle de l'éclairage d'urgence en retard", 'Installation des Érables · prévue le 10 novembre', 'conformite'],
      ['panier', 'ambre', 'Nouveau regroupement : réfection de toitures en Estrie', '14 installations inscrites · inscriptions jusqu’au 29 janvier 2027', 'achats'],
      ['rapport', '', "Rapport d'inspection annuelle déposé", 'Installation de la Gare · 14 octobre 2026 · 2 déficiences', 'inspections'],
      ['parapluie', '', 'Votre courtier a consulté le rapport de l’immeuble', 'Installation des Érables · 3 novembre 2026', 'assurance'],
      ['outil', 'vert', 'Travail terminé : loquet de la barrière de la cour', 'Installation de la Gare · 15 octobre 2026', 'travaux'],
      ['flocon', '', "Le calendrier d'hiver est prêt", '9 tâches proposées pour décembre à février', 'calendrier']
    ];
    return `<div class="page-tete"><div><h1>Notifications</h1><p class="intro">Les rappels sont aussi envoyés par courriel, selon vos préférences.</p></div><div class="actions"><button class="btn clair" data-action="Notifications marquées comme lues">Tout marquer comme lu</button></div></div>
    <div class="carte serree"><div class="liste">${n.map(([i, c, t, s, r]) => `<div class="ligne cliquable" ${aller(r)}><div class="ico ${c}">${ic(i)}</div><div class="corps"><b>${t}</b><span>${s}</span></div>${ic('droite')}</div>`).join('')}</div></div>`;
  }
});

/* ---------- Liste des installations ---------- */
App.vue('installations', {
  rendu() {
    const reseau = App.role !== 'dg';
    return `
    <div class="page-tete"><div><h1>${reseau ? 'Installations' : 'Mes installations'}</h1><p class="intro">Chaque installation a son carnet de santé : composantes, entretien, inspections, travaux, documents et assurance.</p></div>
      <div class="actions"><button class="btn" data-action="Formulaire d'ajout d'une installation ouvert">${ic('plus')}Ajouter une installation</button></div></div>
    ${reseau ? `<div class="avis">${ic('info')}<div>Profil de démonstration : vous voyez ici les installations du ${D.cpe.nom}. Dans l'application réelle, l'accès dépend du consentement du membre.</div></div>` : ''}
    <div class="grille g3">
      ${D.installations.map(i => `<article class="carte ombre pile" style="cursor:pointer" ${aller('installation', { id: i.id })}>
        <div class="photo large ${i.photo}"><div>${ic('batiment')}<br>Photo de la façade</div></div>
        <div class="rangee entre"><div><h2>${i.nom}</h2><div class="petit muet">${i.adresse}</div></div></div>
        <div class="rangee">${etiq(i.statut, i.statut === 'Propriétaire' ? 'bleu' : '')}${etiq(i.places + ' places')}${etiq('Construit en ' + i.annee)}</div>
        <div class="rangee" style="flex-wrap:nowrap">${jauge(i.sante, 'sur 100', i.sante >= 80 ? 'var(--vert)' : i.sante >= 70 ? 'var(--ambre)' : 'var(--critique)')}
          <dl class="cv" style="flex:1;grid-template-columns:1fr auto"><dt>Déficiences ouvertes</dt><dd class="num">${i.deficiencesOuvertes}</dd><dt>Tâches ce mois-ci</dt><dd class="num">${i.tachesMois}</dd><dt>Dernière inspection</dt><dd>${dateFr(i.inspectionAnnuelle, true)}</dd></dl></div>
        <button class="btn clair bloc">Ouvrir le carnet de santé</button>
      </article>`).join('')}
    </div>`;
  }
});

/* ---------- Carnet de santé d'une installation ---------- */
App.vue('installation', {
  parent: 'installations',
  rendu(p) {
    const i = D.inst(p.id || App.dernierInst);
    App.dernierInst = i.id;
    const comps = D.composantes.filter(c => c.inst === i.id);
    const defs = D.deficiences.filter(d => d.inst === i.id);
    const insps = D.inspections.filter(x => x.inst === i.id).sort((a, b) => b.date.localeCompare(a.date));
    const taches = D.taches.filter(t => t.inst === i.id).sort((a, b) => a.date.localeCompare(b.date));
    const docs = D.documents.filter(d => d.inst === i.id || d.inst === null);
    const recs = D.reclamations.filter(r => r.inst === i.id);
    const an = +AUJ.slice(0, 4);
    const cats = [...new Set(comps.map(c => c.cat))];
    const ligneComp = c => {
      const reste = D.finDeVie(c) - an, pct = Math.min(100, Math.round((an - c.annee) / c.vie * 100));
      return `<tr class="cliquable" ${c.fiche ? aller('fiche', { id: c.fiche }) : 'data-action="Fiche de la composante ouverte"'}>
        <td><span class="principal-cel">${c.nom}</span><span class="sous">${c.note || 'Aucune remarque'}</span></td>
        <td>${c.annee}</td>
        <td style="min-width:150px">${barre(pct, reste <= 1 ? 'critique' : reste <= 5 ? 'alerte' : 'ok')}<span class="sous">${reste > 0 ? `Fin de vie utile vers ${D.finDeVie(c)} (${reste} ans)` : `Fin de vie utile dépassée depuis ${-reste} an${reste < -1 ? 's' : ''}`}</span></td>
        <td>${pil(D.ETATS[c.etat][1], D.ETATS[c.etat][0])}</td>
        <td class="num">${c.cout ? argent(c.cout) : '—'}</td>
        <td>${c.fiche ? etiq('Fiche ' + c.fiche, 'bleu') : etiq('Propre aux CPE', 'vert')}</td></tr>`;
    };
    return `
    <div class="page-tete">
      <div><div class="fil"><button ${aller('installations')}>Installations</button>${ic('droite').replace('<svg', '<svg width="12" height="12"')}<span>${i.nom}</span></div>
        <h1>${i.nom}</h1><p class="intro">${i.adresse} · ${i.statut} · ${i.places} places · construit en ${i.annee} · ${nombre(i.superficie)} m²</p></div>
      <div class="actions">
        <button class="btn clair" data-action="Rapport de l'immeuble transmis au courtier">${ic('envoyer')}Envoyer le rapport au courtier</button>
        <button class="btn clair" data-action="Carnet de santé exporté en PDF">${ic('telecharger')}Exporter le carnet</button>
        <button class="btn" ${aller('grilles')}>${ic('grille')}Remplir une grille</button>
      </div>
    </div>

    <div data-onglets class="pile">
      ${onglets([['apercu', 'Aperçu'], ['composantes', `Composantes (${comps.length})`], ['entretien', 'Entretien'], ['inspections', `Inspections (${insps.length})`], ['travaux', `Travaux (${defs.length})`], ['documents', `Documents (${docs.length})`], ['assurance', 'Assurance']], 'apercu')}

      <div data-panneau="apercu" class="pile">
        <div class="grille g-2-1">
          <div class="carte">
            <div class="rangee souple" style="align-items:flex-start;flex-wrap:nowrap;gap:22px">
              ${jauge(i.sante, 'sur 100', i.sante >= 80 ? 'var(--vert)' : i.sante >= 70 ? 'var(--ambre)' : 'var(--critique)')}
              <div class="pile serre" style="flex:1 1 240px">
                <div class="rangee entre"><h2>Indice de santé</h2>${i.tendance < 0 ? pil('alerte', i.tendance + ' points depuis un an') : pil('ok', 'Stable')}</div>
                <p class="petit" style="color:var(--texte-2)">L'indice combine l'état des composantes, leur âge par rapport à leur durée de vie utile et le nombre de déficiences ouvertes. Il sert à comparer et à prioriser; il ne remplace pas un bilan de santé fait par un professionnel.</p>
                <div class="pile serre">
                  ${cats.map(cat => { const l = comps.filter(c => c.cat === cat); const s = Math.round(100 - (l.reduce((a, c) => a + c.etat, 0) / l.length - 1) * 22); return `<div class="rangee" style="flex-wrap:nowrap"><span class="petit" style="width:92px">${cat}</span><div style="flex:1">${barre(s, s >= 80 ? 'ok' : s >= 60 ? 'alerte' : 'critique')}</div><b class="num petit" style="width:26px;text-align:right">${s}</b></div>`; }).join('')}
                </div>
              </div>
            </div>
          </div>
          <div class="carte"><div class="carte-tete"><h2>Fiche de l'immeuble</h2><button class="lien" data-action="Fiche de l'immeuble en mode édition">Modifier</button></div>
            <dl class="cv"><dt>Structure</dt><dd>${i.structure}</dd><dt>Toiture</dt><dd>${i.toiture}</dd><dt>Chauffage</dt><dd>${i.chauffage}</dd><dt>Étages</dt><dd>${i.etages}</dd><dt>Bilan de santé</dt><dd>${i.bilan ? dateFr(i.bilan) : i.exemptionPFI ? 'Non exigé avant le 31 mars 2030' : 'Sans objet (locataire)'}</dd><dt>Prochain bilan</dt><dd>${i.prochainBilan ? dateFr(i.prochainBilan) : '—'}</dd></dl></div>
        </div>
        <div class="grille g2">
          <div class="carte serree"><div class="carte-tete"><h2>Composantes à surveiller</h2></div><div class="liste">
            ${comps.filter(c => c.etat >= 4 || D.finDeVie(c) - an <= 3).slice(0, 5).map(c => `<div class="ligne"><div class="ico ${c.etat >= 5 ? 'rouge' : 'ambre'}">${ic('alerte')}</div><div class="corps"><b>${c.nom}</b><span>Fin de vie utile vers ${D.finDeVie(c)} · remplacement estimé à ${argent(c.cout)}</span></div>${pil(D.ETATS[c.etat][1], D.ETATS[c.etat][0])}</div>`).join('') || '<div class="ligne"><div class="corps"><span>Aucune composante en fin de vie utile d’ici trois ans.</span></div></div>'}
          </div></div>
          <div class="carte"><div class="carte-tete"><h2>Photos récentes</h2><button class="lien" data-action="Galerie de photos ouverte">Galerie</button></div>
            <div class="photos">${photo('Façade', i.photo)}${photo('Toiture', 'toit')}${photo('Aire de jeu', 'jeu')}${photo('Salle mécanique')}${photo('Fondation, mur nord', 'brique')}${photo('Cuisine')}</div></div>
        </div>
      </div>

      <div data-panneau="composantes" class="pile" hidden>
        <div class="avis">${ic('info')}<div>Les durées de vie utile et les coûts de remplacement sont indicatifs. L'inspecteur ou l'inspectrice les ajuste lors du bilan de santé.</div></div>
        ${cats.map(cat => `<div class="carte serree"><div class="carte-tete"><h2>${cat}</h2><button class="lien" data-action="Formulaire d'ajout de composante ouvert">Ajouter une composante</button></div><div class="table-zone"><table class="t">
          <thead><tr><th>Composante</th><th>Installée</th><th>Durée de vie utile</th><th>État</th><th class="num">Remplacement</th><th>Guide</th></tr></thead>
          <tbody>${comps.filter(c => c.cat === cat).map(ligneComp).join('')}</tbody></table></div></div>`).join('')}
      </div>

      <div data-panneau="entretien" class="pile" hidden>
        <div class="carte serree"><div class="carte-tete"><h2>Tâches d'entretien</h2><button class="lien" ${aller('calendrier')}>Ouvrir le calendrier</button></div><div class="liste">
          ${taches.map(t => `<div class="ligne cliquable" ${aller(t.grille ? 'grille' : 'calendrier', t.grille ? { id: t.grille, inst: t.inst } : null)}><div class="ico ${t.fait ? 'vert' : ''}">${ic(t.fait ? 'coche' : 'grille')}</div><div class="corps"><b>${t.titre}</b><span>${t.resp} · ${t.saison}</span></div>${t.fait ? pil('ok', 'Fait le ' + dateFr(t.date, true)) : echeance(t.date)}</div>`).join('')}
        </div></div>
      </div>

      <div data-panneau="inspections" class="pile" hidden>
        <div class="carte serree"><div class="table-zone"><table class="t"><thead><tr><th>Type</th><th>Date</th><th>Réalisée par</th><th class="num">Constats</th><th class="num">Déficiences</th><th>Statut</th></tr></thead>
          <tbody>${insps.map(x => `<tr class="cliquable" ${aller('inspection', { id: x.id })}><td class="principal-cel">${x.type}</td><td>${dateFr(x.date)}</td><td>${x.par}</td><td class="num">${x.constats || '—'}</td><td class="num">${x.deficiences || '—'}</td><td>${pil(x.statut === 'À planifier' ? 'alerte' : 'ok', x.statut)}</td></tr>`).join('')}</tbody></table></div></div>
      </div>

      <div data-panneau="travaux" class="pile" hidden>
        <div class="carte serree"><div class="table-zone"><table class="t"><thead><tr><th>Déficience</th><th>Code</th><th>Priorité</th><th>Statut</th><th class="num">Estimation</th></tr></thead>
          <tbody>${defs.map(d => `<tr class="cliquable" ${aller('travaux', { id: d.id })}><td><span class="principal-cel">${d.titre}</span><span class="sous">${d.source} · ${dateFr(d.constat)}</span></td><td>${etiq(d.code, 'bleu')}</td><td>${pil(D.GRAVITES[d.gravite], d.gravite)}</td><td>${d.statut}</td><td class="num">${d.cout ? argent(d.cout) : '—'}</td></tr>`).join('')}</tbody></table></div></div>
      </div>

      <div data-panneau="documents" class="pile" hidden>
        <div class="carte serree"><div class="carte-tete"><h2>Documents de l'installation</h2><button class="lien" ${aller('documents')}>Tous les documents</button></div><div class="liste">
          ${docs.map(d => `<div class="ligne cliquable" data-action="Document ouvert : ${esc(d.nom)}"><div class="ico gris">${ic('rapport')}</div><div class="corps"><b>${d.nom}</b><span>${d.cat} · ${dateFr(d.date)} · ${d.taille}</span></div>${etiq(d.type)}</div>`).join('')}
        </div></div>
      </div>

      <div data-panneau="assurance" class="pile" hidden>
        <div class="grille g2">
          <div class="carte"><div class="carte-tete"><h2>Couverture</h2><button class="lien" ${aller('assurance')}>Voir la police</button></div>
            <dl class="cv"><dt>Assureur</dt><dd>${D.assurance.assureur}</dd><dt>Courtier</dt><dd>${D.assurance.courtier}</dd><dt>Échéance</dt><dd>${dateFr(D.assurance.echeance)}</dd><dt>Valeur de reconstruction</dt><dd>${i.valeurReconstruction ? argent(i.valeurReconstruction) : 'Immeuble assuré par le locateur'}</dd><dt>Franchise</dt><dd>${argent(D.assurance.franchise)} (${argent(D.assurance.franchiseEau)} pour les dégâts d'eau)</dd></dl>
            <button class="btn clair" style="margin-top:14px" data-action="Rapport de l'immeuble transmis au courtier">${ic('envoyer')}Envoyer le rapport de l'immeuble au courtier</button></div>
          <div class="carte serree"><div class="carte-tete"><h2>Réclamations</h2><button class="lien" ${aller('reclamations')}>Toutes les réclamations</button></div><div class="liste">
            ${recs.map(r => `<div class="ligne cliquable" ${aller('reclamations', { id: r.id })}><div class="corps"><b>${r.type}</b><span>${dateFr(r.date)} · ${argent(r.paye)} payés</span></div>${pil(r.regle ? 'ok' : 'alerte', r.regle ? 'Réglé' : 'En traitement')}</div>`).join('') || '<div class="ligne"><div class="corps"><span>Aucune réclamation pour cette installation.</span></div></div>'}
          </div></div>
        </div>
      </div>
    </div>`;
  }
});

/* ---------- À propos du prototype ---------- */
App.vue('apropos', {
  rendu() {
    const hyp = [
      ['Droits sur le guide', "Le guide de 2017 sert ici à une démonstration interne. Les droits d'utilisation, d'adaptation et de diffusion restent à confirmer par écrit."],
      ['Nom et image', "« Solage » est un nom provisoire. La palette mélange les couleurs de william.coop et de l'AQCPE. Disponibilité du nom non vérifiée."],
      ['Partenariat', "L'AQCPE est une partenaire pressentie. Rien n'est convenu avec elle; son logo n'est pas utilisé."],
      ['Inspection', "L'AQCPE aurait déjà une application d'inspection. Solage la compléterait au lieu de la remplacer."],
      ['Données des membres', 'Le membre reste propriétaire de ses données. Le courtier, la coop et l’AQCPE voient seulement ce que le membre accepte de partager.'],
      ['Indice de santé', "Indicateur maison sur 100, à définir avec des spécialistes. Il ne remplace pas un bilan de santé."],
      ['Durées de vie et coûts', 'Valeurs fictives, pour illustrer les écrans.'],
      ['Conformité', "Liste indicative. Les fréquences marquées « À valider » viennent de normes qui n'ont pas été consultées."],
      ['Achats regroupés', 'Fournisseurs, dates et économies estimées sont fictifs. Aucune entente n’existe.'],
      ['Assurance', "Courtier et assureur génériques. Aucun gain de prime n'est promis."]
    ];
    return `
    <div class="page-tete"><div><h1>À propos du prototype</h1><p class="intro">Solage est une maquette de présentation. La navigation fonctionne, mais aucune action n'est enregistrée et toutes les données sont fictives.</p></div></div>
    ${avisDemo("Le sommaire du guide, les titres des grilles, la grille « Toit en pente » et deux fiches viennent du Guide d'inspection des immeubles à l'intention des gestionnaires (RQOH, mise à jour de mars 2017). Ils sont utilisés à des fins de démonstration seulement. Les droits restent à confirmer avant toute diffusion.")}
    <div class="grille g-2-1">
      <div class="pile">
        <div class="carte"><div class="carte-tete"><h2>L'idée en quatre volets</h2></div>
          <div class="grille g2">
            <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico">${ic('batiment')}</div><div><b>Le carnet de santé du membre</b><div class="petit muet">Composantes, entretien saisonnier, travaux, documents. Répond à l'exigence du bilan de santé et du carnet d'entretien des règles budgétaires 2026-2027.</div></div></div>
            <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico vert">${ic('loupe')}</div><div><b>L'inspection</b><div class="petit muet">Le rapport d'inspection devient un carnet vivant, que le membre tient à jour entre deux bilans.</div></div></div>
            <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico ambre">${ic('panier')}</div><div><b>Les achats regroupés</b><div class="petit muet">La coop repère les besoins communs et organise des tournées de travaux par région.</div></div></div>
            <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico">${ic('parapluie')}</div><div><b>L'assurance</b><div class="petit muet">Réclamations, prévention et rapport de l'immeuble partagé avec le courtier, sur consentement.</div></div></div>
          </div>
        </div>
        <div class="carte serree"><div class="carte-tete"><h2>Hypothèses à valider</h2><span class="petit muet">Liste complète dans le document d'analyse</span></div>
          <div class="liste">${hyp.map(([t, d], n) => `<div class="ligne" style="align-items:flex-start"><span class="etiq bleu num" style="min-width:30px;justify-content:center">${n + 1}</span><div class="corps"><b>${t}</b><span>${d}</span></div></div>`).join('')}</div>
        </div>
      </div>
      <div class="pile">
        <div class="carte"><div class="carte-tete"><h2>Parcours suggéré pour la présentation</h2></div>
          <div class="chrono">
            <div class="etape"><i></i><div><b>Tableau de bord</b><span>Ce que la direction voit le matin.</span></div></div>
            <div class="etape"><i></i><div><b>Carnet de santé des Érables</b><span>Composantes, durée de vie, indice de santé.</span></div></div>
            <div class="etape"><i></i><div><b>Grille « Toit en pente »</b><span>La grille papier du guide, devenue formulaire.</span></div></div>
            <div class="etape"><i></i><div><b>Déficiences et travaux</b><span>Du constat à la demande de soumission.</span></div></div>
            <div class="etape"><i></i><div><b>Achats regroupés</b><span>La tournée de toitures en Estrie.</span></div></div>
            <div class="etape"><i></i><div><b>Profil Réseau</b><span>Le portrait du parc et les occasions détectées.</span></div></div>
            <div class="etape"><i></i><div><b>Profil Inspection</b><span>Le mode mobile, même sans réseau.</span></div></div>
            <div class="etape"><i></i><div><b>Réclamations et courtier</b><span>Le volet assurance.</span></div></div>
          </div>
          <button class="btn bloc" ${aller('accueil')}>Commencer par le tableau de bord</button>
        </div>
        <div class="carte"><div class="carte-tete"><h2>Profils de démonstration</h2></div>
          <p class="petit" style="color:var(--texte-2)">Changez de profil avec le menu en haut de l'écran : direction de CPE, inspection (AQCPE), réseau (william.coop et AQCPE), courtier d'assurance.</p></div>
        <div class="avis ambre">${ic('info')}<div class="petit">Solage serait un outil d'aide à la gestion. Il ne remplacerait pas l'avis d'un professionnel du bâtiment ni une validation juridique.</div></div>
      </div>
    </div>`;
  }
});
