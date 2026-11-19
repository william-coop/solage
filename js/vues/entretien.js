/* Vues « Entretien » : calendrier, grilles d'entretien, remplissage d'une grille, inspections, rapport d'inspection,
   déficiences et travaux. Données fictives. Le contenu des grilles et du calendrier saisonnier vient du guide de 2017
   (démonstration seulement) : chaque écran concerné est précédé du bandeau avisDemo(). */
(function () {
  'use strict';

  /* ---------- Style propre à ces vues (classes préfixées « ent- », couleurs du thème seulement) ---------- */
  const ENT_CSS = `
  .ent-leg { display: flex; flex-direction: column; gap: 8px; font-size: .84rem; }
  .ent-leg .evt { cursor: default; display: inline-block; min-width: 96px; text-align: center; }
  .ent-puce { display: inline-block; width: 14px; height: 14px; border-radius: 4px; vertical-align: -2px; margin-right: 6px; }
  .ent-mois { min-width: 660px; }
  .ent-fait { opacity: .6; }
  .ent-an th.ent-cur { background: var(--marine); color: var(--surface); text-align: center; }
  .ent-an th.ent-m { text-align: center; padding: 10px 6px; }
  .ent-an td.ent-nom { min-width: 260px; }
  .ent-an td.ent-c { padding: 0; height: 32px; min-width: 44px; text-align: center; border-left: 1px solid var(--surface); color: var(--surface); font-size: .8rem; }
  .ent-an td.ent-cur { box-shadow: inset 2px 0 0 var(--marine), inset -2px 0 0 var(--marine); }
  .ent-an td.ent-c.ent-vide.ent-cur { background: var(--bleu-tres-pale); }
  .ent-an tr.ent-grp td { background: var(--surface-2); font-weight: 700; color: var(--marine); font-size: .8rem; }
  .ent-s-hiver { background: var(--bleu-vif); }
  .ent-s-printemps { background: var(--vert-vif); }
  .ent-s-ete { background: var(--ambre); }
  .ent-s-automne { background: var(--alerte); }
  .ent-bande { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 12px 18px; background: var(--bleu-pale); border-bottom: 1px solid var(--ligne); }
  .champ.ent-empl { flex-direction: row; align-items: center; gap: 8px; }
  .champ.ent-empl input { height: 32px; width: 230px; max-width: 100%; }
  .ent-pt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
  .ent-no { color: var(--texte-3); font-weight: 700; }
  .ent-outils { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .ent-codes { display: inline-flex; gap: 4px; }
  .ent-code { min-width: 38px; height: 28px; border-radius: 99px; border: 1px solid var(--ligne-forte); background: var(--surface); color: var(--texte-2); font-weight: 700; font-size: .74rem; padding: 0 8px; }
  .ent-code:hover { background: var(--bleu-tres-pale); }
  .ent-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 38px; height: 24px; border-radius: 99px; font-weight: 700; font-size: .74rem; padding: 0 8px; }
  .ent-code[aria-pressed="true"][data-code="NA"], .ent-chip[data-code="NA"] { background: var(--vert); border-color: var(--vert); color: var(--surface); }
  .ent-code[aria-pressed="true"][data-code="SN"], .ent-chip[data-code="SN"] { background: var(--bleu); border-color: var(--bleu); color: var(--surface); }
  .ent-code[aria-pressed="true"][data-code="RP"], .ent-chip[data-code="RP"] { background: var(--ambre); border-color: var(--ambre); color: var(--marine); }
  .ent-code[aria-pressed="true"][data-code="RE"], .ent-chip[data-code="RE"] { background: var(--alerte); border-color: var(--alerte); color: var(--surface); }
  .ent-code[aria-pressed="true"][data-code="DE"], .ent-chip[data-code="DE"] { background: var(--critique); border-color: var(--critique); color: var(--surface); }
  .ent-constat { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 16px; padding: 16px 18px; border-bottom: 1px solid var(--ligne); }
  .ent-constat:last-child { border-bottom: 0; }
  .ent-niveau { display: flex; flex-direction: column; gap: 10px; }
  .ent-niveau .cv { grid-template-columns: minmax(70px, 30%) minmax(0, 1fr); }
  @media (min-width: 1101px) { .ent-colle { position: sticky; top: calc(var(--bandeau) + var(--haut) + 16px); } }
  @media (max-width: 600px) { .ent-constat { grid-template-columns: minmax(0, 1fr); } }
  `;
  const style = () => `<style>${ENT_CSS}</style>`;

  /* ---------- Utilitaires locaux ---------- */
  const MOIS_ABR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const CLASSE_SAISON = { Hiver: 'hiver', Printemps: 'printemps', 'Été': 'ete', Automne: 'automne' };
  const saisonDuMois = m => Object.keys(D.SAISONS).find(s => D.SAISONS[s].includes(m));
  const enRetard = t => !t.fait && joursAvant(t.date) < 0;
  const couleurTache = t => enRetard(t) ? 'rouge' : t.type === 'Contrat' ? 'ambre' : t.type === 'Conformité' ? 'vert' : '';
  const icoTache = t => t.type === 'Contrat' ? 'camion' : t.type === 'Conformité' ? 'bouclier' : 'grille';
  const nomCourt = id => D.inst(id).nom.replace(/^Installation (de la |de l'|du |des )?/, '');
  const titreCourt = t => t.titre.replace(/^Grille «\s*(.*?)\s*»$/, '$1');
  const moisLong = iso => D.MOIS[+iso.slice(5, 7) - 1] + ' ' + iso.slice(0, 4);
  const virgule = n => String(n).replace('.', ',');
  const selectInst = (id, tout, choisi) => `<select id="${id}" aria-label="Installation">${tout ? '<option value="">Toutes les installations</option>' : ''}${D.installations.map(i => `<option value="${i.id}" ${i.id === choisi ? 'selected' : ''}>${i.nom}</option>`).join('')}</select>`;
  const flecheFil = ic('droite').replace('<svg', '<svg width="12" height="12"');
  const pilPertinence = p => pil(p === 'Oui' ? 'ok' : p === 'À adapter' ? 'alerte' : 'neutre', p === 'Oui' ? 'Pertinente' : p === 'À adapter' ? 'À adapter' : 'Peu pertinente');
  const etiqOrigine = o => etiq(o === 'Guide 2017' ? 'Guide 2017' : 'À créer (propre aux CPE)', o === 'Guide 2017' ? 'bleu' : 'vert');
  const moisTexte = g => g.mois.length === 12 ? 'Chaque mois' : g.mois.map(m => MOIS_ABR[m]).join(', ');
  const liensFiches = g => g.fiches.length
    ? g.fiches.map(f => `<button type="button" class="etiq bleu" style="border:0;cursor:pointer" ${aller('fiche', { id: f })} title="Ouvrir la fiche ${f}">${f}</button>`).join(' ')
    : '<span class="muet">—</span>';
  const AVIS_GUIDE = "Contenu utilisé à des fins de démonstration seulement. Les grilles et le calendrier saisonnier viennent du Guide d'inspection des immeubles à l'intention des gestionnaires (RQOH, mars 2017). Les droits d'utilisation restent à confirmer. Les tâches, les dates et les résultats sont fictifs.";

  /* =====================================================================
     1. Calendrier d'entretien
     ===================================================================== */
  App.vue('calendrier', {
    rendu() {
      const an = +AUJ.slice(0, 4), mo = +AUJ.slice(5, 7) - 1, auj = +AUJ.slice(8, 10);
      const prefixe = AUJ.slice(0, 7);
      const premier = new Date(an, mo, 1).getDay();
      const nbJours = new Date(an, mo + 1, 0).getDate();
      const joursPrec = new Date(an, mo, 0).getDate();
      const total = Math.ceil((premier + nbJours) / 7) * 7;
      const taches = D.taches.slice().sort((a, b) => a.date.localeCompare(b.date));

      const evt = t => `<div class="evt ${couleurTache(t)} ${t.fait ? 'ent-fait' : ''}" data-inst="${t.inst}" ${t.grille ? aller('grille', { id: t.grille, inst: t.inst }) : `data-action="${esc(t.titre)}"`} title="${esc(t.titre)} · ${esc(D.inst(t.inst).nom)}${t.fait ? ' (fait)' : ''}">${esc(nomCourt(t.inst))} · ${esc(titreCourt(t))}</div>`;
      let cases = '';
      for (let k = 0; k < total; k++) {
        const j = k - premier + 1;
        if (j < 1 || j > nbJours) { cases += `<div class="jour hors"><span class="no">${j < 1 ? joursPrec + j : j - nbJours}</span></div>`; continue; }
        const iso = `${prefixe}-${String(j).padStart(2, '0')}`;
        cases += `<div class="jour ${j === auj ? 'auj' : ''}"><span class="no">${j}</span>${taches.filter(t => t.date === iso).map(evt).join('')}</div>`;
      }
      const vueMois = `
        <div class="rangee entre"><h2>${D.MOIS[mo]} ${an}</h2>
          <div class="rangee"><button class="btn clair mini" aria-label="Mois précédent" data-action="Navigation entre les mois non offerte dans la démonstration">${ic('gauche')}</button><button class="btn clair mini" aria-label="Mois suivant" data-action="Navigation entre les mois non offerte dans la démonstration">${ic('droite')}</button></div></div>
        <div class="table-zone"><div class="mois ent-mois">${['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'].map(n => `<div class="jour-nom">${n}</div>`).join('')}${cases}</div></div>
        <p class="petit muet">Cliquez sur une tâche liée à une grille pour la remplir. Les tâches faites sont estompées.</p>`;

      /* Année : matrice des grilles par mois */
      const entete = D.MOIS.map((m, i) => `<th class="ent-m ${i === mo ? 'ent-cur' : ''}" title="${m}">${MOIS_ABR[i].replace('.', '')}</th>`).join('');
      const ligneAn = g => `<tr class="cliquable" ${aller('grille', { id: g.id })}>
        <td class="ent-nom"><span class="principal-cel">${g.titre}</span><span class="sous">${g.points} points · ${g.saison}</span></td>
        ${D.MOIS.map((m, i) => {
          const on = g.mois.includes(i), s = saisonDuMois(i);
          return `<td class="ent-c ${on ? 'ent-s-' + CLASSE_SAISON[s] : 'ent-vide'} ${i === mo ? 'ent-cur' : ''}" ${on ? `title="${esc(g.titre)} : ${m} (${s.toLowerCase()})"` : ''}>${on ? '&bull;' : ''}</td>`;
        }).join('')}</tr>`;
      const guide = D.grilles.filter(g => g.origine === 'Guide 2017'), creer = D.grilles.filter(g => g.origine !== 'Guide 2017');
      const legendeSaisons = Object.keys(D.SAISONS).map(s => `<span><i class="ent-puce ent-s-${CLASSE_SAISON[s]}"></i>${s} (${D.MOIS[D.SAISONS[s][0]].toLowerCase()} à ${D.MOIS[D.SAISONS[s][2]].toLowerCase()})</span>`).join('');
      const vueAnnee = `
        ${avisDemo("Calendrier saisonnier tiré du Guide d'inspection des immeubles à l'intention des gestionnaires (RQOH, mars 2017), à des fins de démonstration seulement. Les grilles « À créer » sont des propositions propres aux CPE.")}
        <div class="rangee petit" style="gap:16px">${legendeSaisons}<span><b>Mois courant</b> : ${D.MOIS[mo].toLowerCase()}</span></div>
        <div class="carte serree"><div class="table-zone"><table class="t ent-an">
          <thead><tr><th>Grille</th>${entete}</tr></thead>
          <tbody>
            <tr class="ent-grp"><td colspan="13">Grilles du guide de 2017 (${guide.length})</td></tr>${guide.map(ligneAn).join('')}
            <tr class="ent-grp"><td colspan="13">À créer, propres aux CPE (${creer.length})</td></tr>${creer.map(ligneAn).join('')}
          </tbody></table></div></div>`;

      /* Liste : tâches groupées par mois */
      const mois = [...new Set(taches.map(t => t.date.slice(0, 7)))];
      const vueListe = mois.map(m => {
        const l = taches.filter(t => t.date.slice(0, 7) === m);
        return `<div class="carte serree ent-grp-mois"><div class="carte-tete"><h2>${moisLong(m + '-01')}</h2><span class="petit muet">${l.length} tâche${l.length > 1 ? 's' : ''}</span></div><div class="liste">
          ${l.map(t => `<div class="ligne ${t.grille ? 'cliquable' : ''}" data-inst="${t.inst}" ${t.grille ? aller('grille', { id: t.grille, inst: t.inst }) : ''}>
            <div class="ico ${couleurTache(t) === 'rouge' ? 'rouge' : couleurTache(t)}">${ic(icoTache(t))}</div>
            <div class="corps"><b>${t.titre}</b><span>${D.inst(t.inst).nom} · ${t.resp}</span></div>
            ${etiq(t.type, t.type === 'Contrat' ? 'ambre' : t.type === 'Conformité' ? 'vert' : 'bleu')}${t.fait ? pil('ok', 'Fait') : echeance(t.date)}</div>`).join('')}
        </div></div>`;
      }).join('');

      /* Colonne latérale */
      const saison = saisonDuMois(mo);
      const duMois = D.grilles.filter(g => g.mois.includes(mo)).sort((a, b) => a.mois.length - b.mois.length);
      const etat = g => {
        const ts = D.taches.filter(t => t.grille === g.id && t.date.slice(0, 7) === prefixe);
        if (!ts.length) return pil('neutre', 'Non planifiée');
        const reste = ts.filter(t => !t.fait).length;
        return reste ? pil(ts.some(enRetard) ? 'critique' : 'alerte', `${reste} à faire`) : pil('ok', 'Fait');
      };
      return `${style()}
      <div class="page-tete">
        <div><h1>Calendrier d'entretien</h1><p class="intro">Les grilles d'entretien, les vérifications de conformité et les contrats de vos installations, au même endroit. Une tâche non faite après sa date devient rouge.</p></div>
        <div class="actions"><button class="btn clair" data-action="Calendrier exporté vers votre agenda">${ic('telecharger')}Exporter vers mon agenda</button></div>
      </div>
      ${avisDemo(AVIS_GUIDE)}
      <div class="grille g-2-1">
        <div data-onglets class="pile">
          <div class="rangee entre"><div class="segments" role="tablist"><button class="actif" data-onglet="mois">Mois</button><button data-onglet="annee">Année</button><button data-onglet="liste">Liste</button></div><span class="petit muet">Aujourd'hui : ${dateFr(AUJ)}</span></div>
          <div data-panneau="mois" class="pile">${vueMois}</div>
          <div data-panneau="annee" class="pile" hidden>${vueAnnee}</div>
          <div data-panneau="liste" class="pile" hidden>${vueListe}</div>
        </div>
        <div class="pile">
          <button class="btn bloc" data-action="Formulaire d'ajout d'une tâche ouvert">${ic('plus')}Ajouter une tâche</button>
          <div class="carte"><div class="carte-tete"><h2>Installation</h2></div>
            <div class="champ"><label for="ent-cal-inst">Afficher les tâches de</label>${selectInst('ent-cal-inst', true)}</div></div>
          <div class="carte"><div class="carte-tete"><h2>Légende</h2></div>
            <div class="ent-leg">
              <span><span class="evt">Grille</span> grille d'entretien</span>
              <span><span class="evt vert">Conformité</span> vérification obligatoire</span>
              <span><span class="evt ambre">Contrat</span> contrat ou fournisseur</span>
              <span><span class="evt rouge">En retard</span> tâche non faite</span>
            </div></div>
          <div class="carte serree"><div class="carte-tete"><h2>Saison en cours</h2>${etiq(saison, 'ambre')}</div>
            <div class="liste">${duMois.map(g => `<div class="ligne cliquable" ${aller('grille', { id: g.id })}><div class="corps"><b>${g.titre}</b><span>${g.points} points${g.mois.length === 12 ? ' · chaque mois' : ''}</span></div>${etat(g)}</div>`).join('')}</div>
            <p class="petit muet" style="padding:10px 18px 14px">Découpage du guide : ${saison.toLowerCase()} de ${D.MOIS[D.SAISONS[saison][0]].toLowerCase()} à ${D.MOIS[D.SAISONS[saison][2]].toLowerCase()}.</p></div>
        </div>
      </div>`;
    },
    apres(racine) {
      const sel = racine.querySelector('#ent-cal-inst');
      if (!sel) return;
      sel.addEventListener('change', () => {
        racine.querySelectorAll('[data-inst]').forEach(el => { el.hidden = !!sel.value && el.dataset.inst !== sel.value; });
        racine.querySelectorAll('.ent-grp-mois').forEach(g => { g.hidden = !g.querySelector('[data-inst]:not([hidden])'); });
      });
    }
  });

  /* =====================================================================
     2. Bibliothèque des grilles
     ===================================================================== */
  App.vue('grilles', {
    rendu() {
      const groupes = [['Hiver', 'Hiver'], ['Printemps', 'Printemps'], ['Printemps et automne', 'Printemps|Automne'], ['Été', 'Été'], ['Automne', 'Automne'], ['Chaque mois', 'Chaque mois']];
      const bloc = ([nom, cles]) => {
        const l = D.grilles.filter(g => g.saison === nom).sort((a, b) => a.mois[0] - b.mois[0] || a.titre.localeCompare(b.titre));
        if (!l.length) return '';
        return `<div class="carte serree ent-gr" data-saisons="${cles}">
          <div class="carte-tete"><div class="rangee"><div class="ico ${nom === 'Hiver' ? '' : nom === 'Printemps' ? 'vert' : 'ambre'}">${ic(nom === 'Hiver' ? 'flocon' : nom === 'Printemps' ? 'feuille' : nom === 'Chaque mois' ? 'calendrier' : 'soleil')}</div><h2>${nom}</h2></div><span class="petit muet ent-nb">${l.length} grilles</span></div>
          <div class="table-zone"><table class="t"><thead><tr><th>Grille</th><th>Mois</th><th class="num">Points</th><th>Fiches liées</th><th>Pour un CPE</th><th>Origine</th></tr></thead>
          <tbody>${l.map(g => `<tr class="cliquable" data-origine="${g.origine === 'Guide 2017' ? 'guide' : 'creer'}" ${aller('grille', { id: g.id })}>
            <td style="min-width:240px"><span class="principal-cel">${g.titre}</span></td>
            <td style="white-space:nowrap">${moisTexte(g)}</td><td class="num">${g.points}</td><td>${liensFiches(g)}</td><td>${pilPertinence(g.pertinence)}</td><td>${etiqOrigine(g.origine)}</td></tr>`).join('')}</tbody></table></div></div>`;
      };
      const nbGuide = D.grilles.filter(g => g.origine === 'Guide 2017').length;
      return `${style()}
      <div class="page-tete">
        <div><h1>Grilles d'entretien</h1><p class="intro">Une grille est une courte liste de vérifications à faire à une saison donnée, avec un code de résultat pour chaque point. Choisissez-en une pour la remplir.</p></div>
        <div class="actions"><button class="btn clair" ${aller('calendrier')}>${ic('calendrier')}Voir le calendrier</button></div>
      </div>
      ${avisDemo(AVIS_GUIDE)}
      <div class="grille g3">
        <div class="carte stat"><span class="val">${D.grilles.length}</span><span class="lib">grilles au total</span></div>
        <div class="carte stat"><span class="val">${nbGuide}</span><span class="lib">tirées du guide de 2017</span></div>
        <div class="carte stat"><span class="val">${D.grilles.length - nbGuide}</span><span class="lib">à créer, propres aux CPE (aire de jeu, cuisine de production, sécurité des enfants)</span></div>
      </div>
      <div class="rangee" style="gap:18px">
        <div class="rangee"><span class="petit muet">Saison</span><div class="segments" id="ent-f-saison">${['Toutes', 'Hiver', 'Printemps', 'Été', 'Automne', 'Chaque mois'].map((s, i) => `<button type="button" class="${i ? '' : 'actif'}" data-filtre="${i ? s : ''}">${s}</button>`).join('')}</div></div>
        <div class="rangee"><span class="petit muet">Origine</span><div class="segments" id="ent-f-origine">${[['Toutes', ''], ['Guide 2017', 'guide'], ['À créer', 'creer']].map(([l, v], i) => `<button type="button" class="${i ? '' : 'actif'}" data-filtre="${v}">${l}</button>`).join('')}</div></div>
      </div>
      <div class="pile" id="ent-groupes">${groupes.map(bloc).join('')}</div>
      <div class="avis" id="ent-vide" hidden>${ic('info')}<div>Aucune grille ne correspond à ce filtre.</div></div>`;
    },
    apres(racine) {
      const fs = racine.querySelector('#ent-f-saison'), fo = racine.querySelector('#ent-f-origine');
      if (!fs || !fo) return;
      const valeur = z => z.querySelector('.actif').dataset.filtre;
      const filtrer = () => {
        const s = valeur(fs), o = valeur(fo);
        let visibles = 0;
        racine.querySelectorAll('.ent-gr').forEach(g => {
          const okSaison = !s || g.dataset.saisons.split('|').includes(s);
          let n = 0;
          g.querySelectorAll('tbody tr').forEach(tr => { const ok = okSaison && (!o || tr.dataset.origine === o); tr.hidden = !ok; if (ok) n++; });
          g.hidden = n === 0;
          g.querySelector('.ent-nb').textContent = `${n} grille${n > 1 ? 's' : ''}`;
          visibles += n;
        });
        racine.querySelector('#ent-vide').hidden = visibles > 0;
      };
      [fs, fo].forEach(z => z.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        z.querySelectorAll('button').forEach(x => x.classList.toggle('actif', x === b));
        filtrer();
      }));
    }
  });

  /* =====================================================================
     3. Remplir une grille
     ===================================================================== */
  const VISITES_TOIT = [
    ['2026-10-06', "Préposé à l'entretien", "9 points sans particularité. Bardeaux soulevés au versant sud (expertise demandée), solins à surveiller, gouttière à resceller."],
    ['2026-05-12', 'Direction adjointe', "Bardeaux qui commencent à friser, photos ajoutées. Gouttières nettoyées."],
    ['2025-10-09', "Préposé à l'entretien", 'Rien à signaler, sauf une descente de gouttière à rattacher.'],
    ['2025-05-15', "Préposé à l'entretien", 'Grillage pare-oiseaux du ventilateur statique remplacé.']
  ];

  App.vue('grille', {
    parent: 'grilles',
    rendu(p) {
      const g = D.grille(p.id || 'toit-pente');
      const inst = D.inst(p.inst || 'erables');
      const fil = `<div class="fil"><button ${aller('grilles')}>Grilles d'entretien</button>${flecheFil}<span>${g.titre}</span></div>`;
      const fichesTxt = g.fiches.length ? g.fiches.map(f => `Fiche ${f}`).join(', ') : 'Aucune fiche du guide';

      if (g.id !== 'toit-pente') {
        return `${style()}
        <div class="page-tete"><div>${fil}<h1>${g.titre}</h1><p class="intro">${g.saison} · ${g.points} points · ${inst.nom}</p></div>
          <div class="actions"><button class="btn" ${aller('grille', { id: 'toit-pente', inst: inst.id })}>${ic('grille')}Ouvrir la grille « Toit en pente »</button></div></div>
        ${avisDemo(AVIS_GUIDE)}
        <div class="grille g-2-1">
          <div class="carte pile" style="align-items:flex-start">
            <div class="ico ambre">${ic('grille')}</div><h2>Grille non reproduite dans le prototype</h2>
            <p style="color:var(--texte-2);max-width:65ch">Seule la grille « Toit en pente » (12 points) est reproduite au complet dans le prototype, à titre d'exemple. Dans l'application, chaque grille aurait la même présentation : cases à cocher, code de résultat par point, photos, notes, historique des visites et création d'une déficience.</p>
            <div class="rangee"><button class="btn" ${aller('grille', { id: 'toit-pente', inst: inst.id })}>Ouvrir la grille « Toit en pente »</button><button class="btn clair" ${aller('grilles')}>Retour aux grilles</button></div>
          </div>
          <div class="carte"><div class="carte-tete"><h2>En bref</h2></div>
            <dl class="cv" style="grid-template-columns:1fr"><div><dt class="petit">Saison</dt><dd>${g.saison}</dd></div><div><dt class="petit">Mois suggérés</dt><dd>${moisTexte(g)}</dd></div><div><dt class="petit">Nombre de points</dt><dd>${g.points}</dd></div><div><dt class="petit">Fiches liées</dt><dd>${liensFiches(g)}</dd></div><div><dt class="petit">Pour un CPE</dt><dd>${pilPertinence(g.pertinence)}</dd></div><div><dt class="petit">Origine</dt><dd>${etiqOrigine(g.origine)}</dd></div></dl></div>
        </div>`;
      }

      const G = D.grilleToit;
      const total = G.sections.reduce((n, s) => n + s.points.length, 0);
      const codes = Object.keys(D.CODES);
      const point = (txt, i) => {
        const code = G.dernier[i];
        return `<div class="coche" data-pt="${i}">
          <input type="checkbox" id="ent-p${i}" aria-label="Point ${i + 1} vérifié">
          <div class="ent-pt">
            <label class="texte" for="ent-p${i}"><span class="ent-no">${i + 1}.</span> ${txt}</label>
            <div class="ent-outils">
              <div class="ent-codes" role="group" aria-label="Code du point ${i + 1}">${codes.map(c => `<button type="button" class="ent-code" data-code="${c}" aria-pressed="${c === code}" title="${esc(D.CODES[c])}">${c}</button>`).join('')}</div>
              <span class="petit muet ent-code-lib">${D.CODES[code]}</span>
              <button type="button" class="btn nu mini" data-action="Photo ajoutée au point ${i + 1}">${ic('photo')}Photo</button>
              <button type="button" class="btn nu mini" data-action="Note ajoutée au point ${i + 1}">${ic('crayon')}Note</button>
            </div>
            <div class="ent-def" ${code === 'NA' ? 'hidden' : ''}><button type="button" class="btn nu mini" ${aller('travaux', { nouveau: true, inst: inst.id })}>${ic('plus')}Créer une déficience</button></div>
          </div>
        </div>`;
      };
      let k = 0;
      const sections = G.sections.map((s, si) => `
        <section class="carte serree">
          <div class="ent-bande"><h2>${s.titre}</h2><div class="champ ent-empl"><label for="ent-e${si}">Emplacement</label><input id="ent-e${si}" type="text" placeholder="Ex.&nbsp;: versant sud"></div></div>
          ${s.note ? `<div class="avis ambre" style="margin:14px 18px 0">${ic('alerte')}<div><b>Sécurité.</b> ${s.note}</div></div>` : ''}
          <div style="padding:4px 18px 8px">${s.points.map(txt => point(txt, k++)).join('')}</div>
        </section>`).join('');
      const nbSignales = G.dernier.filter(c => c !== 'NA').length;

      return `${style()}
      <div class="page-tete"><div>${fil}<h1>${G.id === g.id ? g.titre : 'Toit en pente'}</h1><p class="intro">Cochez chaque point vérifié, puis choisissez le code qui décrit ce que vous avez constaté. Les codes sont déjà ceux de la dernière visite : modifiez-les au besoin.</p></div>
        <div class="actions"><button class="btn clair" ${aller('fiche', { id: '2.3.2' })}>${ic('livre')}Lire la fiche 2.3.2</button></div></div>
      ${avisDemo(AVIS_GUIDE)}
      <div class="grille g-2-1">
        <div class="pile">
          <div class="carte"><dl class="cv" style="grid-template-columns:minmax(120px,28%) minmax(0,1fr)">
            <dt>Installation</dt><dd>${inst.nom}</dd>
            <dt>Intervenant ou intervenante</dt><dd>${ROLES[App.role].personne}</dd>
            <dt>Date du jour</dt><dd>${dateFr(AUJ)}</dd>
            <dt>Saison</dt><dd>${g.saison} (octobre ou mai)</dd>
            <dt>Outils et matériaux requis</dt><dd style="font-weight:400">${G.outils}</dd>
            <dt>Fiche liée</dt><dd><button type="button" class="etiq bleu" style="border:0;cursor:pointer" ${aller('fiche', { id: '2.3.2' })}>2.3.2 Toit en pente</button></dd>
          </dl></div>
          ${sections}
        </div>
        <div class="pile">
          <div class="carte ent-colle pile serre"><div class="carte-tete" style="margin-bottom:0"><h2>Progression</h2></div>
            <div class="stat"><span class="val"><span id="ent-prog-n">0</span> <small>/ ${total} points vérifiés</small></span></div>
            <div class="barre ok"><i id="ent-prog-b" style="width:0%"></i></div>
            <p class="petit muet"><span id="ent-prog-s">${nbSignales}</span> point${nbSignales > 1 ? 's' : ''} à signaler (code autre que NA).</p>
            <button class="btn bloc" data-action="Visite enregistrée au carnet de ${esc(inst.nom)}">${ic('coche')}Enregistrer la visite</button>
            <button class="btn clair bloc" data-action="Visite enregistrée sur l'appareil, synchronisation au retour du réseau">${ic('horsligne')}Enregistrer hors ligne</button>
            <button class="btn nu bloc" data-action="Section ajoutée à la grille">${ic('plus')}Ajouter une section</button>
          </div>
          <div class="carte"><div class="carte-tete"><h2>Légende des codes</h2></div>
            <div class="pile serre">${codes.map(c => `<div class="rangee" style="flex-wrap:nowrap"><span class="ent-chip" data-code="${c}">${c}</span><span class="petit">${D.CODES[c]}</span></div>`).join('')}</div></div>
          <div class="carte serree"><div class="carte-tete"><h2>Historique des visites</h2></div>
            <div class="liste">${VISITES_TOIT.map(([d, qui, r]) => `<div class="ligne" style="align-items:flex-start"><div class="corps"><b>${dateFr(d)}</b><span>${qui}</span><div class="petit" style="color:var(--texte-2);margin-top:3px">${r}</div></div></div>`).join('')}</div></div>
        </div>
      </div>`;
    },
    apres(racine) {
      if (!racine.querySelector('.coche[data-pt]')) return;
      const maj = () => {
        const total = racine.querySelectorAll('.coche[data-pt]').length;
        const faits = racine.querySelectorAll('.coche[data-pt] input[type="checkbox"]:checked').length;
        const signales = [...racine.querySelectorAll('.ent-code[aria-pressed="true"]')].filter(b => b.dataset.code !== 'NA').length;
        racine.querySelector('#ent-prog-n').textContent = faits;
        racine.querySelector('#ent-prog-b').style.width = Math.round(faits / total * 100) + '%';
        racine.querySelector('#ent-prog-s').textContent = signales;
      };
      racine.addEventListener('change', e => { if (e.target.matches('.coche[data-pt] input[type="checkbox"]')) maj(); });
      racine.addEventListener('click', e => {
        const b = e.target.closest('.ent-code'); if (!b) return;
        const pt = b.closest('.coche');
        pt.querySelectorAll('.ent-code').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        pt.querySelector('.ent-code-lib').textContent = D.CODES[b.dataset.code];
        pt.querySelector('.ent-def').hidden = b.dataset.code === 'NA';
        maj();
      });
    }
  });

  /* =====================================================================
     4. Inspections
     ===================================================================== */
  const TYPES_INSPECTION = ['Inspection annuelle', "Inspection annuelle de l'aire de jeu", 'Bilan de santé (aux cinq ans)', "Vérification annuelle de l'alarme incendie"];

  App.vue('inspections', {
    rendu() {
      const liste = D.inspections.slice().sort((a, b) => b.date.localeCompare(a.date));
      const faites = D.inspections.filter(i => i.statut !== 'À planifier' && i.date.slice(0, 4) === AUJ.slice(0, 4));
      const aPlanifier = D.inspections.filter(i => i.statut === 'À planifier');
      const prochaine = aPlanifier.slice().sort((a, b) => a.date.localeCompare(b.date))[0];
      return `${style()}
      <div class="page-tete">
        <div><h1>Inspections</h1><p class="intro">Trois niveaux de suivi se complètent : le personnel vérifie chaque mois, une inspection a lieu chaque année et un bilan de santé complet est fait aux cinq ans.</p></div>
        <div class="actions"><button class="btn" id="ent-demander">${ic('plus')}Demander une inspection</button></div>
      </div>
      <div class="grille g3">
        <div class="carte ent-niveau"><div class="rangee"><div class="ico">${ic('grille')}</div><div><div class="sur">Niveau 1 · chaque mois</div><h3>Vérification par le personnel</h3></div></div>
          <p class="petit" style="color:var(--texte-2)">Le personnel d'entretien parcourt les grilles d'entretien selon le calendrier saisonnier et note ce qu'il constate, avec photos à l'appui.</p>
          <dl class="cv"><dt>Qui</dt><dd>Personnel d'entretien</dd><dt>Quand</dt><dd>Selon le calendrier</dd><dt>Outil</dt><dd>Grilles d'entretien</dd></dl>
          <button class="btn clair mini" style="align-self:flex-start" ${aller('calendrier')}>Ouvrir le calendrier</button></div>
        <div class="carte ent-niveau"><div class="rangee"><div class="ico vert">${ic('loupe')}</div><div><div class="sur">Niveau 2 · chaque année</div><h3>Inspection annuelle</h3></div></div>
          <p class="petit" style="color:var(--texte-2)">Une personne spécialisée en bâtiment fait le tour de l'installation, relève les déficiences et estime les travaux. L'aire de jeu et l'alarme incendie ont leurs propres inspections.</p>
          <dl class="cv"><dt>Qui</dt><dd>Technologue ou fournisseur agréé</dd><dt>Quand</dt><dd>Une fois par année</dd><dt>Résultat</dt><dd>Rapport et déficiences</dd></dl></div>
        <div class="carte ent-niveau"><div class="rangee"><div class="ico ambre">${ic('bouclier')}</div><div><div class="sur">Niveau 3 · aux cinq ans</div><h3>Bilan de santé</h3></div></div>
          <p class="petit" style="color:var(--texte-2)">Un ou une professionnelle examine l'ensemble du bâtiment et ajuste l'inventaire des composantes, leur durée de vie utile et le coût de leur remplacement.</p>
          <dl class="cv"><dt>Qui</dt><dd>Professionnel ou professionnelle</dd><dt>Quand</dt><dd>Aux cinq ans</dd><dt>Résultat</dt><dd>Plan de maintien d'actifs</dd></dl>
          <button class="btn clair mini" style="align-self:flex-start" ${aller('maintien')}>Voir le maintien d'actifs</button></div>
      </div>
      <div class="grille g4">
        <div class="carte stat"><span class="val">${faites.length}</span><span class="lib">inspections réalisées en ${AUJ.slice(0, 4)}</span></div>
        <div class="carte stat"><span class="val">${faites.reduce((s, i) => s + i.deficiences, 0)}</span><span class="lib">déficiences relevées</span></div>
        <div class="carte stat"><span class="val">${aPlanifier.length}</span><span class="lib">inspections à planifier</span></div>
        <div class="carte stat"><span class="val" style="font-size:1.25rem">${prochaine ? dateFr(prochaine.date, true) + ' ' + prochaine.date.slice(0, 4) : '—'}</span><span class="lib">prochaine échéance${prochaine ? ' : ' + D.inst(prochaine.inst).nom : ''}</span></div>
      </div>
      <div class="carte serree"><div class="carte-tete"><h2>Toutes les inspections</h2><span class="petit muet">Les plus récentes en premier</span></div>
        <div class="table-zone"><table class="t"><thead><tr><th>Type</th><th>Installation</th><th>Date</th><th>Réalisée par</th><th class="num">Constats</th><th class="num">Déficiences</th><th>Statut</th></tr></thead>
        <tbody>${liste.map(i => `<tr class="cliquable" ${aller('inspection', { id: i.id })}>
          <td style="min-width:200px"><span class="principal-cel">${i.type}</span></td><td>${D.inst(i.inst).nom}</td><td style="white-space:nowrap">${dateFr(i.date)}</td>
          <td style="min-width:200px">${i.par}</td><td class="num">${i.constats || '—'}</td><td class="num">${i.deficiences || '—'}</td>
          <td>${pil(i.statut === 'À planifier' ? 'alerte' : 'ok', i.statut)}</td></tr>`).join('')}</tbody></table></div></div>`;
    },
    apres(racine) {
      const b = racine.querySelector('#ent-demander');
      if (!b) return;
      b.addEventListener('click', () => {
        App.modale('Demander une inspection', `
          <div class="champ"><label for="ent-di-inst">Installation</label>${selectInst('ent-di-inst', false)}</div>
          <div class="champ"><label for="ent-di-type">Type d'inspection</label><select id="ent-di-type">${TYPES_INSPECTION.map(t => `<option>${t}</option>`).join('')}</select></div>
          <div class="champ"><label for="ent-di-per">Période souhaitée</label><select id="ent-di-per"><option>Le plus tôt possible</option><option>Décembre 2026 ou janvier 2027</option><option>Printemps 2027</option><option>Été 2027</option><option>Automne 2027</option></select></div>
          <div class="champ"><label for="ent-di-msg">Message</label><textarea id="ent-di-msg" placeholder="Précisez ce qui motive la demande ou ce que vous souhaitez faire examiner."></textarea></div>
          <div class="avis ambre">${ic('info')}<div class="petit">La demande serait transmise au Service des infrastructures de l'AQCPE. Ce partenariat est proposé et reste à confirmer.</div></div>`,
          `<button class="btn clair" data-fermer>Annuler</button><button class="btn" data-fermer data-action="Demande d'inspection envoyée">${ic('envoyer')}Envoyer la demande</button>`);
      });
    }
  });

  /* =====================================================================
     5. Rapport d'inspection
     ===================================================================== */
  const CONSTATS_I1 = [
    { cat: 'Toiture', comp: 'c1', def: 'd2', photo: 'Bardeaux qui frisent, versant sud', type: 'toit', code: 'DE', horizon: "D'ici 1 an", est: 78000,
      obs: "Les pattes des bardeaux frisent et se soulèvent du côté sud. L'entretoit semble mal ventilé.",
      action: "Faire évaluer la toiture par une personne professionnelle du bâtiment (architecte ou technologue), puis planifier la réfection. Un regroupement d'achats est proposé pour juin 2027." },
    { cat: 'Enveloppe', comp: 'c3', def: 'd4', photo: 'Joints de mortier dégradés', type: 'brique', code: 'RP', horizon: "D'ici 1 an", est: 3200,
      obs: 'Les joints de mortier sont dégradés sous deux fenêtres.',
      action: 'Faire reprendre les joints par un maçon ou une maçonne avant le prochain hiver.' },
    { cat: 'Enveloppe', comp: 'c2', def: 'd7', photo: 'Fissure du mur nord', type: 'brique', code: 'SN', horizon: '1 à 5 ans', est: 0,
      obs: "Fissure verticale de moins de 1/8 po dans le mur nord de la fondation, déjà notée en octobre 2025.",
      action: "Mesurer la fissure chaque printemps et chaque automne. Appeler un ingénieur ou un spécialiste en fissures si elle atteint 1/8 po ou plus, ou si elle devient horizontale." },
    { cat: 'Enveloppe', comp: 'c5', def: null, photo: 'Portes extérieures', type: '', code: 'NA', horizon: '—', est: 0,
      obs: 'Portes extérieures et ferme-portes en bon état; fermeture complète vérifiée.', action: 'Aucune action requise.' },
    { cat: 'Mécanique', comp: 'c6', def: 'd3', photo: 'Chauffe-eau de 60 gallons', type: '', code: 'RE', horizon: "D'ici 1 an", est: 4200,
      obs: 'Deux chauffe-eau installés en 2015. Leur fin de vie utile est prévue en 2027.',
      action: 'Remplacer les deux chauffe-eau. Les travaux sont planifiés pour le 8 mars 2027, en lien avec le regroupement d’achats.' },
    { cat: 'Mécanique', comp: 'c7', def: null, photo: 'Thermopompe murale', type: '', code: 'NA', horizon: '—', est: 0,
      obs: 'Thermopompe en bon état de fonctionnement; filtres propres.', action: 'Aucune action requise.' },
    { cat: 'Extérieur', comp: 'c11', def: 'd1', photo: 'Nids-de-poule au débarcadère', type: '', code: 'RP', horizon: 'Maintenant', est: 6500,
      obs: "Crevasses et nids-de-poule près du débarcadère. De la glace s'accumule à cet endroit. L'asphalte a atteint la fin de sa vie utile estimée.",
      action: "Colmater les nids-de-poule avant le gel et prévoir le resurfaçage du stationnement." },
    { cat: 'Sécurité', comp: 'c10', def: null, photo: "Éclairage d'urgence", type: '', code: 'NA', horizon: '—', est: 0,
      obs: "Éclairage d'urgence et enseignes de sortie fonctionnels lors de l'essai.", action: 'Aucune action requise.' },
    { cat: 'Électricité', comp: 'c16', def: null, photo: 'Panneau électrique, local 104', type: '', code: 'NA', horizon: '—', est: 0,
      obs: 'Panneau localisé, identifié et dégagé.', action: 'Aucune action requise.' }
  ];
  const pilHorizon = h => pil(h === 'Maintenant' ? 'critique' : h === "D'ici 1 an" ? 'alerte' : h === '1 à 5 ans' ? 'info' : 'neutre', h);
  const pilStatutInsp = s => pil(s === 'À planifier' ? 'alerte' : 'ok', s);

  App.vue('inspection', {
    parent: 'inspections',
    rendu(p) {
      const i = D.inspections.find(x => x.id === (p.id || 'i1')) || D.inspections[0];
      const inst = D.inst(i.inst);
      const fil = `<div class="fil"><button ${aller('inspections')}>Inspections</button>${flecheFil}<span>${i.type}</span></div>`;

      if (i.statut === 'À planifier') {
        return `${style()}
        <div class="page-tete"><div>${fil}<h1>${i.type}</h1><p class="intro">${inst.nom} · échéance prévue le ${dateFr(i.date)}</p></div></div>
        <div class="carte pile" style="align-items:flex-start;max-width:720px">
          <div class="ico ambre">${ic('calendrier')}</div><h2>Cette inspection n'est pas encore planifiée</h2>
          <p style="color:var(--texte-2)">Aucune date n'est fixée et aucune personne n'est assignée. Une fois la demande envoyée, la date retenue s'ajoutera au calendrier d'entretien.</p>
          <dl class="cv" style="width:100%"><dt>Installation</dt><dd>${inst.nom}</dd><dt>Type</dt><dd>${i.type}</dd><dt>Échéance</dt><dd>${dateFr(i.date)}</dd><dt>Statut</dt><dd>${pilStatutInsp(i.statut)}</dd></dl>
          <div class="rangee"><button class="btn" data-action="Planification de l'inspection demandée">${ic('calendrier')}Planifier l'inspection</button><button class="btn clair" ${aller('inspections')}>Retour aux inspections</button></div>
        </div>`;
      }

      const actions = `<div class="actions">
        <button class="btn clair" data-action="Rapport exporté en PDF">${ic('telecharger')}Exporter en PDF</button>
        <button class="btn clair" data-action="Rapport ajouté à l'ordre du jour du conseil d'administration">${ic('utilisateurs')}Présenter au CA</button>
        <button class="btn clair" data-action="Rapport transmis au courtier">${ic('envoyer')}Envoyer au courtier</button>
        <button class="btn" data-action="Déficiences converties en travaux">${ic('outil')}Convertir en travaux</button></div>`;
      const entete = `<div class="page-tete"><div>${fil}<h1>${i.type}</h1><p class="intro">${inst.nom} · ${dateFr(i.date)}</p></div>${actions}</div>`;
      const fiche = `<div class="carte"><dl class="cv" style="grid-template-columns:minmax(120px,22%) minmax(0,1fr)">
        <dt>Type</dt><dd>${i.type}</dd><dt>Installation</dt><dd>${inst.nom}</dd><dt>Date</dt><dd>${dateFr(i.date)}</dd><dt>Réalisée par</dt><dd>${i.par}</dd><dt>Durée</dt><dd>${i.duree}</dd><dt>Statut</dt><dd>${pilStatutInsp(i.statut)}</dd></dl></div>`;

      if (i.id !== 'i1') {
        const defs = D.deficiences.filter(d => d.inst === i.inst && d.constat === i.date);
        return `${style()}${entete}${fiche}
        <div class="grille g4">
          <div class="carte stat"><span class="val">${i.constats}</span><span class="lib">constats</span></div>
          <div class="carte stat"><span class="val">${i.deficiences}</span><span class="lib">déficiences</span></div>
          <div class="carte stat"><span class="val">${argent(defs.reduce((s, d) => s + d.cout, 0))}</span><span class="lib">coût estimé</span></div>
          <div class="carte stat"><span class="val">${defs.filter(d => d.statut === 'Terminé').length} <small>/ ${defs.length}</small></span><span class="lib">déficiences corrigées</span></div>
        </div>
        <div class="carte serree"><div class="carte-tete"><h2>Déficiences relevées</h2></div><div class="liste">
          ${defs.map(d => `<div class="ligne cliquable" ${aller('travaux', { id: d.id })}><div class="corps"><b>${d.titre}</b><span>${d.metier} · code ${d.code}</span></div>${pil(D.GRAVITES[d.gravite], d.gravite)}${pil(d.statut === 'Terminé' ? 'ok' : 'info', d.statut)}</div>`).join('') || '<div class="ligne"><div class="corps"><span>Aucune déficience rattachée à cette date dans la démonstration.</span></div></div>'}
        </div></div>
        <div class="avis">${ic('info')}<div>Le détail des constats n'est reproduit au complet que pour l'inspection annuelle des Érables du 6 octobre 2026. <button class="btn nu mini" ${aller('inspection', { id: 'i1' })}>Ouvrir ce rapport</button></div></div>`;
      }

      /* Rapport complet i1 */
      const defs = CONSTATS_I1.map(c => D.deficiences.find(d => d.id === c.def)).filter(Boolean);
      const parGravite = Object.keys(D.GRAVITES).map(gv => [gv, defs.filter(d => d.gravite === gv).length]).filter(x => x[1]);
      const cats = [...new Set(CONSTATS_I1.map(c => c.cat))];
      const constat = c => {
        const comp = D.composantes.find(x => x.id === c.comp);
        return `<div class="ent-constat">
          ${photo(c.photo, c.type)}
          <div class="pile serre">
            <div class="rangee"><b style="color:var(--marine)">${comp.nom}</b><span class="ent-chip" data-code="${c.code}" title="${esc(D.CODES[c.code])}">${c.code}</span><span class="petit muet">${D.CODES[c.code]}</span><span class="pousse">${pilHorizon(c.horizon)}</span></div>
            <p class="petit" style="color:var(--texte-2)">${c.obs}</p>
            <dl class="cv" style="grid-template-columns:minmax(110px,26%) minmax(0,1fr)"><dt>Action recommandée</dt><dd style="font-weight:400">${c.action}</dd><dt>Estimation</dt><dd>${c.est ? argent(c.est) : c.code === 'NA' ? '—' : 'Aucune pour l’instant'}</dd></dl>
            ${c.def ? `<div><button class="btn nu mini" ${aller('travaux', { id: c.def })}>${ic('outil')}Voir la déficience</button></div>` : ''}
          </div></div>`;
      };
      return `${style()}${entete}${fiche}
      <div class="grille g4">
        <div class="carte stat"><span class="val">${CONSTATS_I1.length}</span><span class="lib">constats, dont ${CONSTATS_I1.filter(c => c.code === 'NA').length} sans particularité</span></div>
        <div class="carte stat"><span class="val">${defs.length}</span><span class="lib">déficiences</span><div class="rangee" style="gap:6px">${parGravite.map(([g, n]) => pil(D.GRAVITES[g], `${n} ${g.toLowerCase()}${n > 1 && g !== 'Urgent' ? 's' : ''}`)).join('')}</div></div>
        <div class="carte stat"><span class="val">${argent(defs.reduce((s, d) => s + d.cout, 0))}</span><span class="lib">coût estimé des corrections</span></div>
        <div class="carte stat"><span class="val">${CONSTATS_I1.filter(c => c.horizon === 'Maintenant').length}</span><span class="lib">à corriger maintenant</span></div>
      </div>
      ${cats.map(cat => `<div class="carte serree"><div class="carte-tete"><h2>${cat}</h2><span class="petit muet">${CONSTATS_I1.filter(c => c.cat === cat).length} constat${CONSTATS_I1.filter(c => c.cat === cat).length > 1 ? 's' : ''}</span></div>${CONSTATS_I1.filter(c => c.cat === cat).map(constat).join('')}</div>`).join('')}
      <p class="petit muet">Estimations indicatives, à valider par soumission. Rapport fictif produit pour la démonstration.</p>`;
    }
  });

  /* =====================================================================
     6. Déficiences et travaux
     ===================================================================== */
  const colonne = d => d.statut === 'Suivi' ? 'À évaluer' : d.statut;
  const METIER_FOURNISSEURS = { 'Entrepreneur en pavage': ['f5'], 'Couvreur': ['f1'], 'Plombier': ['f4'], 'Maçon': ['f6'], "Spécialiste d'aires de jeu": ['f3'], 'Technicien en alarme incendie': ['f2'] };
  const METIER_CAMPAGNE = { 'Couvreur': 'g1', 'Plombier': 'g4', "Spécialiste d'aires de jeu": 'g2', 'Technicien en alarme incendie': 'g3' };

  function detailTravail(d) {
    const comp = D.composantes.find(c => c.id === d.comp);
    const idx = Math.max(0, D.STATUTS_TRAVAUX.indexOf(colonne(d)));
    const termine = d.statut === 'Terminé';
    const etape = (lib, sub, cl) => `<div class="etape ${cl}"><i></i><div><b>${lib}</b><span>${sub}</span></div></div>`;
    const chrono = [
      etape('Constat', `${dateFr(d.constat)} · ${d.source}`, 'fait'),
      etape('Soumission demandée', idx > 1 ? 'Fait' : idx === 1 ? 'En cours, en attente des soumissions' : 'À faire', idx > 1 ? 'fait' : idx === 1 ? '' : 'attente'),
      etape('Travaux planifiés', d.prevu ? 'Prévus le ' + dateFr(d.prevu) : idx > 2 ? 'Fait' : 'À faire', idx > 2 ? 'fait' : idx === 2 ? '' : 'attente'),
      etape('Travaux terminés', d.fait ? dateFr(d.fait) : 'À venir', idx >= 3 ? 'fait' : 'attente')
    ].join('');
    const fournisseurs = (METIER_FOURNISSEURS[d.metier] || []).map(id => D.fournisseurs.find(f => f.id === id)).filter(Boolean);
    const camp = D.campagnes.find(c => c.id === METIER_CAMPAGNE[d.metier]);
    const bloc = termine ? '' : `
      <div><h3 style="margin-bottom:6px">Fournisseurs agréés : ${d.metier.toLowerCase()}</h3>
        ${fournisseurs.length ? `<div class="liste">${fournisseurs.map(f => `<div class="ligne"><div class="ico gris">${ic('camion')}</div><div class="corps"><b>${f.nom}</b><span>${f.regions} · ${virgule(f.note)} sur 5 · ${f.contrats} contrats · ${f.rabais}</span></div><button class="btn mini" data-action="Demande de soumission envoyée à ${esc(f.nom)}">Demander une soumission</button></div>`).join('')}</div>`
          : '<p class="petit muet">Aucun fournisseur agréé n’est encore inscrit pour ce corps de métier.</p>'}</div>
      ${camp ? `<div class="avis ambre">${ic('panier')}<div><b>Un regroupement d'achats existe</b><div class="petit" style="margin-top:2px">${camp.titre} · économie estimée ${camp.economie} · inscriptions jusqu'au ${dateFr(camp.limite)}</div>
        <button class="btn ambre mini" style="margin-top:8px" data-fermer ${aller('achats', { id: camp.id })}>Voir le regroupement</button></div></div>` : ''}`;
    const corps = `
      ${photo(d.photo ? 'Photo du constat' : 'Aucune photo ajoutée', d.photo)}
      <div class="rangee">${pil(D.GRAVITES[d.gravite], d.gravite)}<span class="ent-chip" data-code="${d.code}" title="${esc(D.CODES[d.code])}">${d.code}</span><span class="petit muet">${D.CODES[d.code]}</span><span class="pousse">${pil(termine ? 'ok' : 'info', d.statut)}</span></div>
      ${d.statut === 'Suivi' ? `<div class="avis">${ic('info')}<div class="petit">Cette déficience est au suivi : aucune intervention n'est requise pour l'instant, mais elle est vérifiée à chaque inspection.</div></div>` : ''}
      <dl class="cv" style="grid-template-columns:minmax(120px,32%) minmax(0,1fr)">
        <dt>Installation</dt><dd>${D.inst(d.inst).nom}</dd>
        <dt>Composante liée</dt><dd>${comp.nom}${comp.note ? `<span class="petit muet" style="display:block;font-weight:400">${comp.note}</span>` : ''}</dd>
        <dt>Corps de métier</dt><dd>${d.metier}</dd>
        <dt>${termine ? 'Coût réel estimé' : 'Coût estimé'}</dt><dd>${d.cout ? argent(d.cout) : 'Aucun pour l’instant'}</dd>
      </dl>
      <div><h3 style="margin-bottom:10px">Chronologie</h3><div class="chrono">${chrono}</div></div>
      ${bloc}`;
    App.modale(d.titre, corps, `<button class="btn clair" data-fermer>Fermer</button>${termine ? '' : `<button class="btn" data-action="Statut de la déficience mis à jour">Changer le statut</button>`}`);
  }

  function signalerDeficience(inst) {
    App.modale('Signaler une déficience', `
      <div class="champ"><label for="ent-sg-inst">Installation</label>${selectInst('ent-sg-inst', false, inst)}</div>
      <div class="champ"><label for="ent-sg-titre">Ce que vous avez constaté</label><input id="ent-sg-titre" type="text" placeholder="Ex.&nbsp;: fuite sous l'évier de la cuisine"></div>
      <div class="grille g2">
        <div class="champ"><label for="ent-sg-code">Code</label><select id="ent-sg-code">${Object.entries(D.CODES).map(([c, l]) => `<option value="${c}">${c} : ${l}</option>`).join('')}</select></div>
        <div class="champ"><label for="ent-sg-prio">Priorité</label><select id="ent-sg-prio">${Object.keys(D.GRAVITES).map(g => `<option ${g === 'Moyenne' ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
      </div>
      <div class="champ"><label for="ent-sg-desc">Description</label><textarea id="ent-sg-desc" placeholder="Où se trouve le problème? Depuis quand? Est-ce que la sécurité des enfants est touchée?"></textarea></div>
      <button class="btn clair mini" style="align-self:flex-start" data-action="Photo ajoutée au signalement">${ic('photo')}Ajouter une photo</button>`,
      `<button class="btn clair" data-fermer>Annuler</button><button class="btn" data-fermer data-action="Déficience signalée">Envoyer le signalement</button>`);
  }

  App.vue('travaux', {
    rendu() {
      const defs = D.deficiences;
      const ouvertes = defs.filter(d => d.statut !== 'Terminé');
      const prioritaires = ouvertes.filter(d => d.gravite === 'Élevée' || d.gravite === 'Urgent');
      const fiche = d => `<div class="fiche-k" data-detail="${d.id}" tabindex="0" role="button" aria-label="Ouvrir le détail : ${esc(d.titre)}">
        <b>${d.titre}</b><span class="muet">${D.inst(d.inst).nom}</span>
        <div class="rangee" style="gap:6px">${pil(D.GRAVITES[d.gravite], d.gravite)}${etiq(d.code, 'bleu')}${d.statut === 'Suivi' ? etiq('Suivi', 'ambre') : ''}</div>
        <div class="rangee entre"><span class="fort num">${d.cout ? argent(d.cout) : 'Sans coût'}</span><span class="muet" style="text-align:right">${d.metier}</span></div>
        ${d.prevu && d.statut === 'Planifié' ? `<span class="petit muet">Prévu le ${dateFr(d.prevu)}</span>` : ''}${d.fait ? `<span class="petit muet">Terminé le ${dateFr(d.fait)}</span>` : ''}
      </div>`;
      const kanban = `<div class="kanban">${D.STATUTS_TRAVAUX.map(s => {
        const l = defs.filter(d => colonne(d) === s);
        return `<div class="colonne"><h3><span>${s}</span><span class="num">${l.length}</span></h3><div class="petit muet num">${argent(l.reduce((t, d) => t + d.cout, 0))}</div>
          ${l.map(fiche).join('') || '<div class="petit muet">Aucune déficience.</div>'}</div>`;
      }).join('')}</div>`;
      const table = `<div class="carte serree"><div class="table-zone"><table class="t"><thead><tr><th>Déficience</th><th>Installation</th><th>Code</th><th>Priorité</th><th>Statut</th><th>Corps de métier</th><th class="num">Estimation</th></tr></thead>
        <tbody>${defs.slice().sort((a, b) => b.constat.localeCompare(a.constat)).map(d => `<tr class="cliquable" data-detail="${d.id}"><td style="min-width:240px"><span class="principal-cel">${d.titre}</span><span class="sous">${d.source} · ${dateFr(d.constat)}</span></td><td>${D.inst(d.inst).nom}</td><td>${etiq(d.code, 'bleu')}</td><td>${pil(D.GRAVITES[d.gravite], d.gravite)}</td><td>${d.statut}</td><td>${d.metier}</td><td class="num">${d.cout ? argent(d.cout) : '—'}</td></tr>`).join('')}</tbody></table></div></div>`;
      return `${style()}
      <div class="page-tete">
        <div><h1>Déficiences et travaux</h1><p class="intro">Suivez chaque déficience, de son constat jusqu'à la fin des travaux. Ouvrez une carte pour voir le détail, demander une soumission ou vérifier si un regroupement d'achats existe.</p></div>
        <div class="actions"><button class="btn" id="ent-signaler">${ic('plus')}Signaler une déficience</button></div>
      </div>
      <div class="grille g4">
        <div class="carte stat"><span class="val">${ouvertes.length}</span><span class="lib">déficiences ouvertes</span></div>
        <div class="carte stat"><span class="val">${prioritaires.length}</span><span class="lib">de priorité élevée ou urgente</span></div>
        <div class="carte stat"><span class="val">${argent(ouvertes.reduce((s, d) => s + d.cout, 0))}</span><span class="lib">travaux estimés</span></div>
        <div class="carte stat"><span class="val">${defs.length - ouvertes.length}</span><span class="lib">travaux terminés</span></div>
      </div>
      <div data-onglets class="pile">
        <div class="rangee"><div class="segments"><button class="actif" data-onglet="tableau">Tableau de suivi</button><button data-onglet="liste">Liste</button></div></div>
        <div data-panneau="tableau" class="pile">${kanban}</div>
        <div data-panneau="liste" class="pile" hidden>${table}</div>
      </div>`;
    },
    apres(racine, p) {
      const ouvrir = id => { const d = D.deficiences.find(x => x.id === id); if (d) detailTravail(d); };
      racine.addEventListener('click', e => { const el = e.target.closest('[data-detail]'); if (el) ouvrir(el.dataset.detail); });
      racine.addEventListener('keydown', e => {
        const el = e.target.closest('.fiche-k[data-detail]');
        if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ouvrir(el.dataset.detail); }
      });
      const b = racine.querySelector('#ent-signaler');
      if (b) b.addEventListener('click', () => signalerDeficience());
      if (p && p.id) ouvrir(p.id);
      else if (p && p.nouveau) signalerDeficience(p.inst);
    }
  });
})();
