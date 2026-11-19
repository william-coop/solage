/* Vues de gestion : maintien d'actifs, conformité, assurance, réclamations, documents, rapports, paramètres.
   Tout est fictif. Le fichier est enveloppé dans une fonction pour ne pas polluer la portée globale. */
(function () {
  'use strict';

  const AN = +AUJ.slice(0, 4);
  const DEBUT5 = (AN - 5) + AUJ.slice(4); // il y a cinq ans, jour pour jour
  const S50 = '50&nbsp;000&nbsp;$';
  const dfr = (iso, court) => dateFr(iso, court).replace(/^1 /, '1er ');
  const pl = (n, s, p) => n + ' ' + (n > 1 ? (p || s + 's') : s);
  const fmtK = v => (v >= 10000 ? Math.round(v / 1000) : (v / 1000).toFixed(1).replace('.', ',')) + ' k$';
  const fleche = () => ic('droite').replace('<svg', '<svg width="12" height="12"');

  /* ---------- Mise en forme commune (un seul bloc, classes préfixées « ges- ») ---------- */
  const CSS = `<style>
    .ges-s-erables { fill: var(--bleu); } .ges-s-ruisseau { fill: var(--vert); } .ges-s-gare { fill: var(--ambre); }
    .ges-sw-erables { background: var(--bleu); } .ges-sw-ruisseau { background: var(--vert); } .ges-sw-gare { background: var(--ambre); }
    .ges-ax text { fill: var(--texte-3); font-size: 11px; }
    .ges-gr line { stroke: var(--ligne); stroke-width: 1; }
    .ges-val { fill: var(--marine); font-size: 11px; font-weight: 700; }
    .ges-leg { display: flex; gap: 16px; flex-wrap: wrap; font-size: .82rem; color: var(--texte-2); }
    .ges-sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; margin-right: 6px; vertical-align: -1px; }
    table.t tr.ges-an td { background: var(--bleu-tres-pale); color: var(--marine); padding: 8px 14px; }
    .ges-btn { border: 0; cursor: pointer; font: inherit; font-size: .74rem; }
    .ges-doc { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 18px; align-items: start; }
    .ges-cats { display: flex; flex-direction: column; padding: 6px; }
    .ges-cat { display: flex; justify-content: space-between; align-items: center; gap: 8px; width: 100%; border: 0; background: none; text-align: left; padding: 9px 12px; border-radius: var(--r-s); font-size: .88rem; color: var(--texte-2); }
    .ges-cat:hover { background: var(--bleu-tres-pale); }
    .ges-cat.actif { background: var(--bleu-pale); color: var(--bleu); font-weight: 700; }
    .ges-cat.vide { color: var(--texte-3); }
    .ges-cat .nb { font-size: .76rem; font-weight: 700; background: #eef0f5; color: var(--texte-2); border-radius: 99px; padding: 0 8px; min-width: 24px; text-align: center; }
    .ges-depot { border: 2px dashed var(--ligne-forte); border-radius: var(--r-m); padding: 18px; text-align: center; background: var(--surface-2); color: var(--texte-2); }
    .ges-depot.sur { border-color: var(--ambre); background: var(--ambre-pale); }
    .ges-feuille { background: var(--surface); border: 1px solid var(--ligne-forte); border-radius: var(--r-s); padding: 20px; box-shadow: var(--ombre); min-width: 0; }
    .ges-grand { font-family: var(--titre); font-size: 2.6rem; font-weight: 700; color: var(--marine); line-height: 1; }
    table.t tr.ges-sel td { background: var(--bleu-pale); }
    .ges-cadre { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
    .ges-cadre > div { border: 1px solid var(--ligne); border-radius: var(--r-s); padding: 10px 12px; background: var(--surface-2); }
    .ges-etapes { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; }
    .ges-etapes > div { border: 1px solid var(--ligne); border-radius: var(--r-m); padding: 12px; background: var(--surface); display: flex; flex-direction: column; gap: 6px; }
    @media (max-width: 860px) { .ges-doc { grid-template-columns: minmax(0, 1fr); } }
  </style>`;

  /* ---------- Petits assemblages ---------- */
  const kpi = (val, lib, extra) => `<div class="carte stat"><span class="lib">${lib}</span><span class="val">${val}</span>${extra || ''}</div>`;
  const tbl = (th, rows) => {
    const num = th.map(h => h[0] === '>');
    return `<div class="table-zone"><table class="t"><thead><tr>${th.map((h, i) => `<th${num[i] ? ' class="num"' : ''}>${num[i] ? h.slice(1) : h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${num[i] ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  };
  const feuille = (titre, sous, corps) => `<div class="ges-feuille pile"><div><div class="sur">Solage · ${D.cpe.nom}</div><h2 style="margin-top:4px">${titre}</h2><div class="petit muet">${sous}</div></div>${corps}<div class="petit muet">Données fictives, produites à des fins de démonstration.</div></div>`;

  /* =====================================================================
     1. Maintien d'actifs
     ===================================================================== */
  const SCENARIOS = {
    echeance: ["À l'échéance", "Chaque composante est planifiée l'année de sa fin de vie utile; celles déjà échues passent en 2027."],
    report: ['Report de 2 ans', 'Chaque projet est repoussé de deux ans. Les projets qui sortent de la période 2027 à 2036 ne figurent plus au plan; le risque de panne ou de bris augmente.'],
    regroupe: ['Devancer avec un regroupement', "Les toitures du plan sont devancées en 2027 pour profiter d'un regroupement de travaux entre membres, avec 15 % de moins sur le coût. Ce rabais est une estimation fictive (les regroupements affichent actuellement de 12 à 18 %)."]
  };

  function planMaintien(scn) {
    const liste = []; let sortis = 0;
    D.composantes.filter(c => c.cout > 0).forEach(c => {
      const nat = Math.max(2027, D.finDeVie(c));
      let an = nat, cout = c.cout, regroupe = false;
      if (scn === 'report') an = nat + 2;
      if (scn === 'regroupe' && c.cat === 'Toiture' && nat <= 2036) { an = 2027; cout = Math.round(c.cout * 0.85); regroupe = true; }
      if (an > 2036) { sortis++; return; }
      liste.push({ c, an, cout, nat, regroupe });
    });
    liste.sort((a, b) => a.an - b.an || b.cout - a.cout);
    return { liste, sortis };
  }

  function graphique(liste) {
    const ans = []; for (let a = 2027; a <= 2036; a++) ans.push(a);
    const tot = a => liste.filter(x => x.an === a).reduce((s, x) => s + x.cout, 0);
    const max = Math.max(1, ...ans.map(tot));
    const pas = [10000, 20000, 25000, 50000, 100000, 200000].find(s => max / s <= 5) || 200000;
    const haut = Math.ceil(max / pas) * pas;
    const W = 720, H = 300, gx = 56, gd = 12, gh = 24, gb = 30;
    const y = v => gh + (H - gh - gb) * (1 - v / haut);
    const slot = (W - gx - gd) / ans.length, bw = slot * 0.62;
    let g = '';
    for (let v = 0; v <= haut; v += pas) g += `<line x1="${gx}" x2="${W - gd}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/>`;
    let ax = '';
    for (let v = 0; v <= haut; v += pas) ax += `<text x="${gx - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v === 0 ? '0' : fmtK(v)}</text>`;
    let barres = '';
    ans.forEach((a, i) => {
      const x = gx + i * slot + (slot - bw) / 2;
      let cumul = 0;
      D.installations.forEach(inst => {
        const v = liste.filter(p => p.an === a && p.c.inst === inst.id).reduce((s, p) => s + p.cout, 0);
        if (!v) return;
        const y1 = y(cumul + v), h = y(cumul) - y1;
        barres += `<rect class="ges-s-${inst.id}" x="${x.toFixed(1)}" y="${y1.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2"><title>${a}, ${inst.nom} : ${argent(v)}</title></rect>`;
        cumul += v;
      });
      if (cumul) barres += `<text class="ges-val" x="${(x + bw / 2).toFixed(1)}" y="${(y(cumul) - 6).toFixed(1)}" text-anchor="middle">${fmtK(cumul)}</text>`;
      ax += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle">${a}</text>`;
    });
    return `<div class="table-zone"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Investissements prévus par année, de 2027 à 2036, par installation" style="width:100%;min-width:560px;height:auto;display:block">
      <g class="ges-gr">${g}</g><g class="ges-ax">${ax}</g>${barres}</svg></div>
      <div class="ges-leg" style="margin-top:8px">${D.installations.map(i => `<span><i class="ges-sw ges-sw-${i.id}"></i>${i.nom}</span>`).join('')}</div>`;
  }

  function corpsMaintien(scn) {
    const { liste, sortis } = planMaintien(scn);
    const somme = f => liste.filter(f).reduce((s, x) => s + x.cout, 0);
    const t5 = somme(x => x.an <= 2031), t10 = somme(() => true);
    const gros = liste.filter(x => x.cout > 50000).length;
    const annees = []; for (let a = 2027; a <= 2036; a++) annees.push(a);
    const campagne = c => (c.cat === 'Toiture' ? 'g1' : /chauffe-eau/i.test(c.nom) ? 'g4' : null);
    const ligne = x => {
      const c = x.c, camp = campagne(c);
      const tags = [
        x.cout > 50000 ? `<span class="etiq bleu">Plus de ${S50} : approbation du Ministère</span>` : '',
        camp ? `<button class="etiq ambre ges-btn" ${aller('achats', { id: camp })}>Regroupement possible</button>` : '',
        x.regroupe ? etiq('Devancé de ' + (x.nat - x.an) + ' an' + (x.nat - x.an > 1 ? 's' : ''), 'vert') : ''
      ].filter(Boolean).join(' ');
      const note = x.an !== x.nat && scn === 'report' ? `Reporté de 2 ans (fin de vie utile vers ${D.finDeVie(c)})` : `${c.cat} · installée en ${c.annee}, fin de vie utile vers ${D.finDeVie(c)}`;
      return `<tr class="cliquable" ${aller('installation', { id: c.inst })}>
        <td><span class="principal-cel">${c.nom}</span><span class="sous">${note}</span></td>
        <td>${D.inst(c.inst).nom}</td>
        <td>${pil(D.ETATS[c.etat][1], D.ETATS[c.etat][0])}</td>
        <td class="num">${argent(x.cout)}${x.regroupe ? `<span class="sous">estimation, 15 % de moins</span>` : ''}</td>
        <td><div class="rangee" style="gap:6px">${tags || '<span class="muet">—</span>'}</div></td></tr>`;
    };
    const lignes = annees.map(a => {
      const l = liste.filter(x => x.an === a);
      if (!l.length) return '';
      const s = l.reduce((t, x) => t + x.cout, 0);
      return `<tr class="ges-an"><td colspan="5"><b>${a}</b> <span class="muet">· ${pl(l.length, 'projet')} · ${argent(s)}</span></td></tr>` + l.map(ligne).join('');
    }).join('');
    return `
    <div class="grille g4">
      ${kpi(argent(t5), 'Investissements sur 5 ans (2027 à 2031)')}
      ${kpi(argent(t10), 'Investissements sur 10 ans (2027 à 2036)')}
      ${kpi(argent(Math.round(t10 / 10)), 'Provision annuelle suggérée', '<span class="tend neutre">Total sur 10 ans ÷ 10</span>')}
      ${kpi(gros, 'Projets de plus de ' + S50, `<span class="tend ${gros ? 'mauvais' : 'neutre'}">${gros ? 'Approbation préalable du Ministère' : 'Aucun'}</span>`)}
    </div>
    <div class="avis ${scn === 'echeance' ? '' : 'ambre'}">${ic('info')}<div><b>${SCENARIOS[scn][0]}.</b> ${SCENARIOS[scn][1]}${sortis ? ` ${pl(sortis, 'projet sort', 'projets sortent')} de la période 2027 à 2036.` : ''}</div></div>
    <div class="carte">
      <div class="carte-tete"><h2>Investissements prévus par année</h2><span class="petit muet">Coûts indicatifs, en dollars courants</span></div>
      ${graphique(liste)}
    </div>
    <div class="carte serree">
      <div class="carte-tete"><h2>Projets par année</h2><span class="petit muet">${pl(liste.length, 'projet')} · ${argent(t10)}</span></div>
      <div class="table-zone"><table class="t"><thead><tr><th>Composante</th><th>Installation</th><th>État</th><th class="num">Coût estimé</th><th>À savoir</th></tr></thead><tbody>${lignes}</tbody></table></div>
    </div>`;
  }

  App.vue('maintien', {
    rendu() {
      const cond = (ico, cl, titre, pastille, texte) => `<div class="pile serre"><div class="rangee" style="flex-wrap:nowrap"><div class="ico ${cl}">${ic(ico)}</div><div><b>${titre}</b></div></div>${pastille}<div class="petit muet">${texte}</div></div>`;
      return `${CSS}
      <div class="page-tete">
        <div><h1>Plan de maintien d'actifs</h1><p class="intro">Les investissements à prévoir de 2027 à 2036, calculés à partir de la fin de vie utile de chaque composante de vos installations.</p></div>
        <div class="actions"><button class="btn clair" data-action="Plan de maintien d'actifs exporté en PDF">${ic('telecharger')}Exporter en PDF</button><button class="btn" ${aller('rapports')}>${ic('rapport')}Préparer un rapport</button></div>
      </div>
      <div class="avis ambre">${ic('alerte')}<div>Les durées de vie utile et les coûts sont indicatifs et fictifs. Ils serviront de point de départ, puis seront ajustés lors du bilan de santé fait par un professionnel.</div></div>
      <div class="rangee"><span class="petit fort">Scénario</span>
        <div class="segments" role="group" aria-label="Scénario du plan" id="ges-scn">${Object.entries(SCENARIOS).map(([k, v]) => `<button data-scn="${k}" class="${k === 'echeance' ? 'actif' : ''}">${v[0]}</button>`).join('')}</div></div>
      <div class="pile" style="gap:22px" id="ges-maintien">${corpsMaintien('echeance')}</div>
      <div class="carte">
        <div class="carte-tete"><h2>Avant d'investir plus de ${S50}</h2>${etiq('Règles budgétaires 2026-2027', 'bleu')}</div>
        <p style="color:var(--texte-2);max-width:80ch">Selon les règles budgétaires 2026-2027 des CPE, un CPE propriétaire doit avoir réalisé un bilan de santé de ses infrastructures, établi un carnet d'entretien et exécuté les correctifs planifiés avant tout investissement de plus de ${S50}. Un tel investissement demande aussi l'approbation préalable du Ministère.</p>
        <p class="petit muet" style="margin-top:8px;max-width:80ch">Les installations financées par le Programme de financement des infrastructures (PFI) depuis le 1er avril 2020 ne sont pas tenues de fournir un bilan avant le 31 mars 2030, mais doivent tenir leur carnet à jour.</p>
        <div class="grille g3" style="margin-top:16px">
          ${cond('coche', 'vert', 'Bilan de santé', pil('ok', 'Fait'), 'Érables : 12 mai 2022 (prochain : 12 mai 2027). Ruisseau : non exigé avant le 31 mars 2030 (PFI). Gare : locataire, sans objet.')}
          ${cond('coche', 'vert', "Carnet d'entretien", pil('ok', 'À jour'), `${D.composantes.length} composantes inscrites, mises à jour à la suite de l'inspection du 6 octobre 2026.`)}
          ${cond('horloge', 'ambre', 'Correctifs planifiés', pil('alerte', 'En cours'), '8 sur 12 exécutés, 4 planifiés. Les 4 restants doivent être exécutés avant un investissement de plus de ' + S50 + '.')}
        </div>
        <div class="rangee" style="margin-top:16px"><button class="btn clair mini" ${aller('rapports')}>${ic('rapport')}Dossier « bilan de santé et carnet d'entretien »</button><button class="btn nu mini" ${aller('travaux')}>Voir les travaux planifiés</button></div>
      </div>`;
    },
    apres(racine) {
      const zone = racine.querySelector('#ges-maintien');
      racine.querySelector('#ges-scn').addEventListener('click', e => {
        const b = e.target.closest('[data-scn]'); if (!b) return;
        racine.querySelectorAll('#ges-scn button').forEach(x => x.classList.toggle('actif', x === b));
        zone.innerHTML = corpsMaintien(b.dataset.scn);
      });
    }
  });

  /* =====================================================================
     2. Conformité
     ===================================================================== */
  function corpsConformite(inst) {
    const l = D.obligations.filter(o => !inst || o.inst === inst);
    const retard = l.filter(o => joursAvant(o.prochaine) < 0).length;
    const bientot = l.filter(o => { const j = joursAvant(o.prochaine); return j >= 0 && j <= 60; }).length;
    const cats = [...new Set(l.map(o => o.cat))];
    return `
    <div class="grille g3">
      ${kpi(retard, 'En retard', `<span class="tend ${retard ? 'mauvais' : 'neutre'}">${retard ? 'À faire en priorité' : 'Aucune'}</span>`)}
      ${kpi(bientot, "À venir d'ici 60 jours", '<span class="tend neutre">Du 18 novembre 2026 au 17 janvier 2027</span>')}
      ${kpi(l.length - retard - bientot, 'À jour', `<span class="tend neutre">Sur ${pl(l.length, 'obligation')} suivies</span>`)}
    </div>
    ${cats.map(cat => {
      const lignes = l.filter(o => o.cat === cat).sort((a, b) => a.prochaine.localeCompare(b.prochaine));
      return `<div class="carte serree"><div class="carte-tete"><h2>${cat}</h2><span class="petit muet">${pl(lignes.length, 'obligation')}</span></div>
      <div class="table-zone"><table class="t"><thead><tr><th>Obligation</th><th>Fréquence</th><th>Dernière fois</th><th>Prochaine échéance</th><th>Preuve</th><th>Source</th><th>Certitude</th><th>Actions</th></tr></thead>
      <tbody>${lignes.map(o => `<tr>
        <td style="min-width:240px"><span class="principal-cel">${o.titre}</span><span class="sous">${D.inst(o.inst).nom}</span></td>
        <td style="min-width:150px">${o.frequence}</td>
        <td>${o.derniere ? dfr(o.derniere) : '—'}</td>
        <td>${echeance(o.prochaine)}<span class="sous">${dfr(o.prochaine)}</span></td>
        <td style="min-width:150px">${o.preuve}</td>
        <td style="min-width:200px" class="petit">${o.source}</td>
        <td>${o.certitude === 'Vérifié' ? pil('ok', 'Vérifié') : pil('alerte', 'À valider')}</td>
        <td><div class="pile serre" style="min-width:150px"><button class="btn clair mini" data-action="Preuve ajoutée : ${esc(o.titre)}">${ic('plus')}Ajouter une preuve</button><button class="btn nu mini" data-action="Marquée comme faite : ${esc(o.titre)}">${ic('coche')}Marquer comme fait</button></div></td>
      </tr>`).join('')}</tbody></table></div></div>`;
    }).join('')}`;
  }

  App.vue('conformite', {
    rendu() {
      return `${CSS}
      <div class="page-tete">
        <div><h1>Conformité</h1><p class="intro">Les obligations récurrentes de vos installations, leur preuve et leur prochaine échéance, au même endroit.</p></div>
        <div class="actions"><button class="btn clair" data-action="Liste des obligations exportée en PDF">${ic('telecharger')}Exporter</button></div>
      </div>
      <div class="avis ambre">${ic('alerte')}<div>Liste indicative préparée pour la démonstration. Les fréquences marquées « À valider » viennent de normes qui n'ont pas été consultées. Faites-les valider auprès de la personne responsable avant de vous y fier.</div></div>
      <div class="rangee"><span class="petit fort">Installation</span>
        <div class="segments" role="group" aria-label="Filtrer par installation" id="ges-inst">
          <button data-inst="" class="actif">Toutes</button>${D.installations.map(i => `<button data-inst="${i.id}">${i.nom.replace('Installation ', '').replace(/^(des|du|de la) /, '')}</button>`).join('')}
        </div></div>
      <div class="pile" style="gap:22px" id="ges-conf">${corpsConformite('')}</div>`;
    },
    apres(racine) {
      const zone = racine.querySelector('#ges-conf');
      racine.querySelector('#ges-inst').addEventListener('click', e => {
        const b = e.target.closest('[data-inst]'); if (!b) return;
        racine.querySelectorAll('#ges-inst button').forEach(x => x.classList.toggle('actif', x === b));
        zone.innerHTML = corpsConformite(b.dataset.inst);
      });
    }
  });

  /* =====================================================================
     3. Assurance
     ===================================================================== */
  /* Éléments qu'un assureur veut connaître, tirés de l'inventaire, des inspections et des réclamations */
  function elementsImmeuble(i) {
    const cs = D.composantes.filter(c => c.inst === i.id);
    const age = c => `${c.nom}, installé en ${c.annee} (${AN - c.annee} ans)`;
    const toit = cs.find(c => c.cat === 'Toiture');
    const elec = cs.find(c => c.cat === 'Électricité');
    const ce = cs.find(c => /chauffe-eau/i.test(c.nom));
    const alarmeC = cs.find(c => /alarme/i.test(c.nom));
    const alarmeO = D.obligations.find(o => o.inst === i.id && /^Système d'alarme/.test(o.titre));
    const recs = D.reclamations.filter(r => r.inst === i.id && r.date >= DEBUT5);
    const insp = D.inspections.filter(x => x.inst === i.id && x.date <= AUJ && x.statut !== 'À planifier').sort((a, b) => b.date.localeCompare(a.date))[0];
    const etat = c => D.ETATS[c.etat][0];
    return [
      { cle: 'Toiture', ico: 'toit', ok: !!toit || /locateur/i.test(i.toiture), val: toit ? age(toit) : (/locateur/i.test(i.toiture) ? 'À la charge du locateur' : null), sous: toit ? 'État : ' + etat(toit) : '' },
      { cle: 'Électricité', ico: 'eclair', ok: !!elec, val: elec ? age(elec) : null, sous: elec ? 'État : ' + etat(elec) : '' },
      { cle: 'Plomberie et chauffe-eau', ico: 'eau', ok: !!ce, val: ce ? age(ce) : null, sous: ce ? 'État : ' + etat(ce) : '' },
      { cle: 'Alarme incendie', ico: 'feu', ok: !!(alarmeC || alarmeO), val: alarmeO ? 'Vérifiée le ' + dfr(alarmeO.derniere) : (alarmeC ? age(alarmeC) : null), sous: alarmeC ? 'État du panneau : ' + etat(alarmeC) : (alarmeO ? alarmeO.preuve : '') },
      { cle: 'Réclamations des cinq dernières années', ico: 'rapport', ok: true, val: recs.length ? pl(recs.length, 'réclamation') + ' (' + argent(recs.reduce((s, r) => s + r.paye, 0)) + ' payés)' : 'Aucune réclamation', sous: 'Depuis le ' + dfr(DEBUT5) },
      { cle: 'Dernière inspection', ico: 'loupe', ok: !!insp, val: insp ? dfr(insp.date) : null, sous: insp ? insp.type : '' }
    ];
  }
  const completude = els => { const n = els.filter(e => e.ok).length; return { n, tot: els.length, ok: n === els.length }; };

  App.vue('assurance', {
    rendu() {
      const a = D.assurance;
      const j = joursAvant(a.echeance), total = joursAvant(a.echeance) - joursAvant(a.debut);
      const ecoule = Math.round((total - j) / total * 100);
      const reconst = D.installations.reduce((s, i) => s + i.valeurReconstruction, 0);
      return `${CSS}
      <div class="page-tete">
        <div><h1>Police et courtier</h1><p class="intro">Votre police d'assurance, vos valeurs de reconstruction et le rapport de l'immeuble que votre courtier peut consulter, avec votre consentement.</p></div>
        <div class="actions"><button class="btn clair" ${aller('reclamations')}>${ic('rapport')}Réclamations</button><button class="btn" data-action="Demande de modification de la police transmise au courtier">${ic('envoyer')}Écrire au courtier</button></div>
      </div>

      <div class="grille g-2-1">
        <div class="pile">
          <div class="carte">
            <div class="carte-tete"><h2>Résumé de la police</h2>${pil('ok', 'En vigueur')}</div>
            <dl class="cv"><dt>Numéro de police</dt><dd>${a.police}</dd><dt>Assureur</dt><dd>${a.assureur}</dd><dt>Période de couverture</dt><dd>${dfr(a.debut)} au ${dfr(a.echeance)}</dd><dt>Prime annuelle</dt><dd>${argent(a.prime)}</dd><dt>Franchise</dt><dd>${argent(a.franchise)}</dd><dt>Franchise, dégâts d'eau</dt><dd>${argent(a.franchiseEau)}</dd></dl>
          </div>
          <div class="grille g2">
            <div class="carte"><div class="carte-tete"><h2>Garanties</h2></div>
              <div class="liste">${a.garanties.map(g => `<div class="ligne"><div class="ico vert">${ic('coche')}</div><div class="corps"><b style="font-weight:600">${g}</b></div></div>`).join('')}</div></div>
            <div class="carte serree"><div class="carte-tete"><h2>Valeurs de reconstruction</h2></div>
              <div class="liste">${D.installations.map(i => `<div class="ligne"><div class="corps"><b>${i.nom}</b><span>${i.statut}</span></div><b class="num">${i.valeurReconstruction ? argent(i.valeurReconstruction) : '—'}</b></div>`).join('')}
                <div class="ligne" style="background:var(--surface-2)"><div class="corps"><b>Total</b><span>L'immeuble de la Gare est assuré par le locateur</span></div><b class="num">${argent(reconst)}</b></div></div></div>
          </div>
        </div>
        <div class="pile">
          <div class="carte" style="border-color:var(--ambre);background:var(--ambre-pale)">
            <div class="carte-tete"><h2>Renouvellement</h2>${etiq('1er avril 2027', 'ambre')}</div>
            <div class="rangee" style="flex-wrap:nowrap;align-items:flex-end"><span class="ges-grand">${j}</span><span style="color:var(--texte-2);padding-bottom:4px">jours avant l'échéance de la police</span></div>
            <div style="margin-top:12px">${barre(ecoule, ecoule > 85 ? 'critique' : 'alerte')}<div class="petit muet" style="margin-top:4px">${ecoule} % de la période de couverture est écoulée</div></div>
            <p class="petit" style="color:var(--texte-2);margin-top:10px">Un rapport de l'immeuble à jour aide votre courtier à préparer le renouvellement.</p>
          </div>
          <div class="carte">
            <div class="carte-tete"><h2>Votre courtier</h2></div>
            <div class="rangee" style="flex-wrap:nowrap"><div class="avatar">${initiales(a.personne)}</div><div><b>${a.personne}</b><div class="petit muet">${a.courtier}</div></div></div>
            <dl class="cv" style="margin-top:12px;grid-template-columns:auto 1fr"><dt>Téléphone</dt><dd>${a.tel}</dd><dt>Accès</dt><dd>Sur consentement</dd></dl>
            <div class="rangee" style="margin-top:12px"><button class="btn clair mini" data-action="Appel au courtier simulé">${ic('telephone')}Appeler</button><button class="btn clair mini" data-action="Courriel au courtier simulé">${ic('envoyer')}Écrire</button></div>
          </div>
        </div>
      </div>

      <div class="pile" style="gap:14px">
        <div class="rangee entre"><div><h2>Rapport de l'immeuble pour l'assureur</h2><p class="petit muet" style="max-width:75ch;margin-top:2px">Les renseignements qu'un assureur veut connaître, tirés de votre carnet de santé, de vos inspections et de vos réclamations. Ce qui manque est signalé pour que vous le complétiez.</p></div></div>
        <div class="grille g3">${D.installations.map(i => {
          const els = elementsImmeuble(i), c = completude(els);
          return `<div class="carte pile serre">
            <div class="rangee entre"><h3>${i.nom}</h3>${c.ok ? pil('ok', 'Complet') : pil('alerte', `Incomplet (${c.n} sur ${c.tot})`)}</div>
            ${barre(c.n / c.tot * 100, c.ok ? 'ok' : 'alerte')}
            <div class="liste">${els.map(e => `<div class="ligne" style="align-items:flex-start;padding:9px 0"><div class="ico ${e.ok ? 'vert' : 'ambre'}" style="width:30px;height:30px">${ic(e.ok ? 'coche' : 'alerte')}</div><div class="corps"><b style="font-size:.84rem">${e.cle}</b><span>${e.ok ? e.val : 'Non renseigné'}${e.ok && e.sous ? ' · ' + e.sous : ''}</span></div></div>`).join('')}</div>
            ${c.ok ? '' : `<button class="btn clair mini" ${aller('installation', { id: i.id })}>Compléter le carnet</button>`}
          </div>`;
        }).join('')}</div>
        <div class="carte">
          <div class="coche" style="padding-top:0;border-bottom:0"><input type="checkbox" id="ges-consent" aria-describedby="ges-consent-txt"><div><label for="ges-consent" class="fort">Partager le rapport de l'immeuble avec mon courtier</label>
            <p class="petit muet" id="ges-consent-txt" style="margin-top:4px;max-width:75ch">Seul le rapport ci-dessus est transmis, jamais l'ensemble de votre carnet. Votre courtier le consulte pour la durée de votre consentement, que vous pouvez retirer en tout temps dans <a href="#" ${aller('parametres', { onglet: 'partage' })}>Paramètres</a>. Les renseignements sont protégés et vous en restez propriétaire.</p></div></div>
          <div class="rangee" style="margin-top:10px"><button class="btn" id="ges-envoi" disabled data-action="Rapport de l'immeuble transmis au courtier">${ic('envoyer')}Envoyer le rapport de l'immeuble au courtier</button><span class="petit muet" id="ges-consent-etat">Cochez la case pour activer l'envoi.</span></div>
        </div>
      </div>

      <div class="carte" style="border-color:var(--bleu-vif);background:var(--bleu-tres-pale)">
        <div class="carte-tete"><h2>Prévention : les dégâts d'eau</h2>${etiq('Conseil', 'bleu')}</div>
        <div class="grille g2">
          <div class="pile serre"><p style="color:var(--texte-2)">Un bris de tuyau est vite coûteux : la réclamation de février 2026 aux Érables en est un exemple. Savoir où couper l'eau, et que tout le personnel le sache, limite les dégâts.</p>
            <ul class="petit" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px;color:var(--texte-2)"><li>Repérer le robinet principal d'arrêt d'eau de chaque installation et l'étiqueter.</li><li>Noter son emplacement dans le carnet et l'afficher pour le personnel.</li><li>Le manœuvrer une fois par année pour s'assurer qu'il fonctionne.</li><li>Rappel : la franchise est de ${argent(a.franchiseEau)} pour les dégâts d'eau.</li></ul></div>
          <div class="pile serre">${D.installations.filter(i => i.statut === 'Propriétaire').map(i => `<div class="ligne" style="padding:8px 0"><div class="corps"><b>${i.nom}</b><span>Emplacement du robinet principal : à noter</span></div><button class="btn clair mini" data-action="Emplacement noté : ${esc(i.nom)}">Noter</button></div>`).join('')}
            <div class="rangee"><button class="btn nu mini" ${aller('fiche', { id: '2.7.2' })}>${ic('livre')}Fiche « Robinet principal d'arrêt d'eau »</button><button class="btn nu mini" ${aller('grille', { id: 'robinet' })}>${ic('grille')}Grille d'entretien</button></div></div>
        </div>
      </div>`;
    },
    apres(racine) {
      const c = racine.querySelector('#ges-consent'), b = racine.querySelector('#ges-envoi'), t = racine.querySelector('#ges-consent-etat');
      c.addEventListener('change', () => {
        b.disabled = !c.checked;
        t.textContent = c.checked ? 'Consentement donné : votre courtier pourra consulter le rapport.' : "Cochez la case pour activer l'envoi.";
      });
    }
  });

  /* =====================================================================
     4. Réclamations
     ===================================================================== */
  const PHOTOS_REC = { r1: ['Salle de lavage', 'Plancher touché', 'Tuyau remplacé'], r2: ['Vitrine fracassée'], r3: ['Versant ouest', 'Clôture endommagée'], r4: ['Sous-sol technique'] };
  const DOCS_REC = {
    r1: [['Déclaration de sinistre', '210 Ko'], ["Rapport de l'expert en sinistres", '1,4 Mo'], ["Factures des travaux d'urgence", '680 Ko'], ['Avis de paiement partiel', '95 Ko']],
    r2: [['Déclaration de sinistre', '180 Ko'], ['Soumission de remplacement de la vitrine', '240 Ko']],
    r3: [['Déclaration de sinistre', '200 Ko'], ['Facture de réparation du toit', '310 Ko'], ['Avis de règlement final', '90 Ko']],
    r4: [['Déclaration de sinistre', '190 Ko'], ['Avis de règlement final', '88 Ko']]
  };
  const pilStatut = r => pil(r.statut === 'Réglé' ? 'ok' : r.statut === 'En traitement' ? 'alerte' : 'neutre', r.statut);

  function detailRec(r) {
    const docs = DOCS_REC[r.id] || [], photos = PHOTOS_REC[r.id] || [];
    return `<div class="carte pile" data-ges-detail>
      <div class="carte-tete" style="margin-bottom:0"><div><div class="sur">Réclamation sélectionnée</div><h2>${r.type}, ${dfr(r.date)}</h2><div class="petit muet">${D.inst(r.inst).nom}</div></div><div class="rangee">${pilStatut(r)}<button class="btn clair mini" data-action="Réclamation ouverte en modification">${ic('crayon')}Modifier</button></div></div>
      <div class="grille g-2-1">
        <div class="pile">
          <div><h3>Description</h3><p style="color:var(--texte-2);margin-top:4px">${r.desc}</p></div>
          <div><h3 style="margin-bottom:10px">Chronologie</h3><div class="chrono">${r.etapes.map(([d, t, e]) => `<div class="etape ${e}"><i></i><div><b>${t}</b><span>${d ? dfr(d) : 'À venir'}</span></div></div>`).join('')}</div></div>
          <div><h3 style="margin-bottom:8px">Photos</h3><div class="photos">${photos.map(l => photo(l)).join('')}<button class="photo" style="border:2px dashed var(--ligne-forte);background:none;cursor:pointer" data-action="Ajout de photos simulé">${ic('plus')}<span>Ajouter</span></button></div></div>
        </div>
        <div class="pile">
          <div><h3>Montants</h3><dl class="cv" style="margin-top:8px;grid-template-columns:1fr auto"><dt>Réclamé</dt><dd class="num">${argent(r.reclame)}</dd><dt>Payé</dt><dd class="num">${argent(r.paye)}</dd><dt>Réglé</dt><dd>${r.regle ? 'Oui' : 'Non'}</dd></dl></div>
          <div><h3>Documents</h3><div class="liste" style="margin-top:4px">${docs.map(([n, t]) => `<div class="ligne cliquable" style="padding:9px 0" data-action="Document ouvert : ${esc(n)}"><div class="ico gris" style="width:30px;height:30px">${ic('rapport')}</div><div class="corps"><b style="font-size:.84rem">${n}</b><span>PDF · ${t}</span></div></div>`).join('')}</div></div>
          <p class="petit muet">Si une réclamation est modifiée, l'historique des changements est conservé.</p>
        </div>
      </div>
    </div>`;
  }

  function formSinistre() {
    return `<div class="champ"><label for="ges-f-date">Date du sinistre</label><input id="ges-f-date" type="date" value="${AUJ}"></div>
      <div class="champ"><label for="ges-f-type">Sinistre</label><select id="ges-f-type">${D.SINISTRES.map(s => `<option>${s}</option>`).join('')}</select></div>
      <div class="champ"><label for="ges-f-inst">Installation</label><select id="ges-f-inst">${D.installations.map(i => `<option value="${i.id}">${i.nom}</option>`).join('')}</select></div>
      <div class="grille g2"><div class="champ"><label for="ges-f-paye">Montant payé ($)</label><input id="ges-f-paye" type="number" min="0" step="100" placeholder="0"></div>
        <div class="champ"><label for="ges-f-regle">Réglé</label><select id="ges-f-regle"><option>Non</option><option>Oui</option></select></div></div>
      <div class="champ"><label for="ges-f-desc">Description</label><textarea id="ges-f-desc" placeholder="Que s'est-il passé? Quels locaux ou équipements sont touchés?"></textarea></div>
      <div class="champ"><label>Photos</label><button class="btn clair" type="button" data-action="Ajout de photos simulé">${ic('photo')}Ajouter des photos</button></div>
      <p class="petit muet">Si une réclamation est modifiée, l'historique des changements est conservé.</p>`;
  }

  App.vue('reclamations', {
    rendu(p) {
      const courtier = App.role === 'courtier';
      const liste = D.reclamations.slice().sort((a, b) => b.date.localeCompare(a.date));
      const cinq = liste.filter(r => r.date >= DEBUT5);
      const sel = liste.find(r => r.id === p.id);
      const types = [...new Set(cinq.map(r => r.type))];
      const maxRec = Math.max(1, ...cinq.map(r => r.reclame));
      return `${CSS}
      <div class="page-tete">
        <div><h1>${courtier ? 'Réclamations des membres' : 'Réclamations'}</h1>
          <p class="intro">${courtier ? `Les réclamations des membres qui vous ont donné accès à leur dossier. Vous voyez ici celles du ${D.cpe.nom}, partagées avec son consentement.` : "Le suivi de chaque sinistre, de la déclaration au règlement final, avec ses photos et ses documents."}</p></div>
        <div class="actions"><button class="btn" id="ges-declarer">${ic('plus')}Déclarer un sinistre</button></div>
      </div>
      <div class="grille g4">
        ${kpi(cinq.length, 'Réclamations sur cinq ans', `<span class="tend neutre">Depuis le ${dfr(DEBUT5)}</span>`)}
        ${kpi(argent(cinq.reduce((s, r) => s + r.paye, 0)), 'Total payé sur cinq ans')}
        ${kpi(cinq.filter(r => !r.regle).length, 'En cours', '<span class="tend neutre">Non réglées</span>')}
        <div class="carte pile serre"><span class="lib petit">Répartition par type (cinq ans)</span>
          ${types.map(t => { const l = cinq.filter(r => r.type === t); return `<div><div class="rangee entre petit"><span>${t}</span><b>${l.length}</b></div>${barre(l.reduce((s, r) => s + r.reclame, 0) / maxRec / 1.0 * 100, 'alerte')}</div>`; }).join('') || '<span class="petit muet">Aucune</span>'}</div>
      </div>
      <div class="carte serree">
        <div class="carte-tete"><h2>Toutes les réclamations</h2><span class="petit muet">Cliquez sur une ligne pour voir le détail</span></div>
        <div class="table-zone"><table class="t" id="ges-rec"><thead><tr><th>Date du sinistre</th><th>Sinistre</th><th>Installation</th><th class="num">Montant réclamé</th><th class="num">Montant payé</th><th>Réglé</th><th>Statut</th></tr></thead>
          <tbody>${liste.map(r => `<tr class="cliquable ${sel && sel.id === r.id ? 'ges-sel' : ''}" data-rec="${r.id}">
            <td>${dfr(r.date)}${r.date < DEBUT5 ? '<span class="sous">Il y a plus de cinq ans</span>' : ''}</td>
            <td class="principal-cel">${r.type}</td>
            <td>${D.inst(r.inst).nom}${courtier ? `<span class="sous">${D.cpe.nom}</span>` : ''}</td>
            <td class="num">${argent(r.reclame)}</td><td class="num">${argent(r.paye)}</td>
            <td>${r.regle ? pil('ok', 'Oui') : pil('alerte', 'Non')}</td><td>${pilStatut(r)}</td></tr>`).join('')}</tbody></table></div>
      </div>
      <div id="ges-detail">${sel ? detailRec(sel) : `<div class="avis">${ic('info')}<div>Sélectionnez une réclamation dans le tableau pour voir sa chronologie, ses photos et ses documents.</div></div>`}</div>`;
    },
    apres(racine, p) {
      const tab = racine.querySelector('#ges-rec'), det = racine.querySelector('#ges-detail');
      tab.addEventListener('click', e => {
        const tr = e.target.closest('[data-rec]'); if (!tr) return;
        tab.querySelectorAll('tr').forEach(x => x.classList.toggle('ges-sel', x === tr));
        det.innerHTML = detailRec(D.reclamations.find(r => r.id === tr.dataset.rec));
        det.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      racine.querySelector('#ges-declarer').addEventListener('click', () => {
        App.modale('Déclarer un sinistre', formSinistre(), `<button class="btn clair" data-fermer>Annuler</button><button class="btn" data-fermer data-action="Sinistre déclaré">Enregistrer la déclaration</button>`);
      });
      if (p && p.id && det.firstElementChild && det.firstElementChild.scrollIntoView) det.firstElementChild.scrollIntoView({ block: 'nearest' });
    }
  });

  /* =====================================================================
     5. Documents
     ===================================================================== */
  const CATS_VIDES = ["Règlements d'immeuble", 'Actes de propriété'];
  const IC_TYPE = { PDF: 'rapport' };

  function corpsDocs(cat, inst, q) {
    const nom = d => d.inst ? D.inst(d.inst).nom : 'Tout le CPE';
    const base = D.documents.filter(d => (!inst || (inst === 'cpe' ? !d.inst : d.inst === inst)) && (!q || d.nom.toLowerCase().includes(q.toLowerCase())));
    const cats = [...new Set(D.documents.map(d => d.cat)), ...CATS_VIDES];
    const liste = base.filter(d => !cat || d.cat === cat).sort((a, b) => b.date.localeCompare(a.date));
    return `<div class="ges-doc">
      <div class="carte serree"><div class="ges-cats" id="ges-cats">
        <button class="ges-cat ${!cat ? 'actif' : ''}" data-cat=""><span>Tous les documents</span><span class="nb">${base.length}</span></button>
        ${cats.map(c => { const n = base.filter(d => d.cat === c).length; return `<button class="ges-cat ${cat === c ? 'actif' : ''} ${!n ? 'vide' : ''}" data-cat="${esc(c)}"><span>${c}</span><span class="nb">${n}</span></button>`; }).join('')}
      </div></div>
      <div class="carte serree">
        <div class="carte-tete"><h2>${cat || 'Tous les documents'}</h2><span class="petit muet">${pl(liste.length, 'document')}</span></div>
        ${liste.length ? `<div class="table-zone"><table class="t"><thead><tr><th>Nom</th><th>Catégorie</th><th>Installation</th><th>Date</th><th class="num">Taille</th><th>Actions</th></tr></thead>
        <tbody>${liste.map(d => `<tr><td style="min-width:240px"><div class="rangee" style="flex-wrap:nowrap"><div class="ico gris" style="width:30px;height:30px">${ic(IC_TYPE[d.type] || 'rapport')}</div><span class="principal-cel">${d.nom}</span></div></td>
          <td>${etiq(d.cat)}</td><td>${nom(d)}</td><td>${dfr(d.date)}</td><td class="num">${d.taille}</td>
          <td><div class="rangee" style="flex-wrap:nowrap;gap:4px"><button class="btn clair mini" data-action="Document ouvert : ${esc(d.nom)}">Ouvrir</button><button class="btn nu mini" data-action="Lien de partage créé : ${esc(d.nom)}">${ic('lien')}Partager</button></div></td></tr>`).join('')}</tbody></table></div>`
          : `<div style="padding:28px 20px;text-align:center" class="muet"><div class="ico gris" style="margin:0 auto 10px">${ic('dossier')}</div>Aucun document dans cette catégorie pour l'instant.<div style="margin-top:10px"><button class="btn clair mini" data-action="Sélecteur de fichiers ouvert">${ic('plus')}Ajouter un document</button></div></div>`}
      </div></div>`;
  }

  App.vue('documents', {
    rendu() {
      return `${CSS}
      <div class="page-tete">
        <div><h1>Documents</h1><p class="intro">Plans, certificats, contrats, garanties et procès-verbaux de vos installations, classés et faciles à retrouver.</p></div>
        <div class="actions"><button class="btn" data-action="Sélecteur de fichiers ouvert">${ic('plus')}Ajouter un document</button></div>
      </div>
      <div class="ges-depot" id="ges-depot">${ic('telecharger').replace('<svg', '<svg width="26" height="26"')}<div style="margin-top:6px"><b style="color:var(--marine)">Glissez vos fichiers ici</b> ou <button class="btn nu mini" data-action="Sélecteur de fichiers ouvert">choisissez-les sur votre appareil</button></div><div class="petit muet">PDF, images et documents Office. Le classement par catégorie serait proposé automatiquement.</div></div>
      <div class="rangee">
        <div class="recherche" style="display:block;min-width:min(280px,100%)">${ic('loupe')}<input id="ges-q" type="search" placeholder="Chercher un document" aria-label="Chercher un document"></div>
        <div class="champ" style="min-width:220px"><select id="ges-inst-doc" aria-label="Filtrer par installation"><option value="">Toutes les installations</option>${D.installations.map(i => `<option value="${i.id}">${i.nom}</option>`).join('')}<option value="cpe">Tout le CPE (sans installation)</option></select></div>
      </div>
      <div id="ges-docs">${corpsDocs('', '', '')}</div>`;
    },
    apres(racine) {
      const e = { cat: '', inst: '', q: '' };
      const zone = racine.querySelector('#ges-docs');
      const maj = () => { zone.innerHTML = corpsDocs(e.cat, e.inst, e.q); };
      zone.addEventListener('click', ev => { const b = ev.target.closest('[data-cat]'); if (b) { e.cat = b.dataset.cat; maj(); } });
      racine.querySelector('#ges-inst-doc').addEventListener('change', ev => { e.inst = ev.target.value; maj(); });
      racine.querySelector('#ges-q').addEventListener('input', ev => { e.q = ev.target.value.trim(); maj(); });
      const dep = racine.querySelector('#ges-depot');
      ['dragenter', 'dragover'].forEach(n => dep.addEventListener(n, ev => { ev.preventDefault(); dep.classList.add('sur'); }));
      dep.addEventListener('dragleave', () => dep.classList.remove('sur'));
      dep.addEventListener('drop', ev => {
        ev.preventDefault(); dep.classList.remove('sur');
        const n = ev.dataTransfer && ev.dataTransfer.files ? ev.dataTransfer.files.length : 0;
        App.toast(n ? pl(n, 'fichier déposé', 'fichiers déposés') : 'Fichier déposé');
      });
    }
  });

  /* =====================================================================
     6. Rapports
     ===================================================================== */
  const DEPENSES = [
    ['Fournitures d\'entretien (ampoules, détecteurs, produits)', 'erables', 312],
    ['Déneigement, versement de novembre', 'erables', 1850],
    ['Nettoyage des gouttières', 'ruisseau', 460],
    ['Réparation de la serrure du vestiaire', 'gare', 145]
  ];

  function apercuMensuel() {
    const taches = D.taches.filter(t => t.date.slice(0, 7) === AUJ.slice(0, 7)).sort((a, b) => a.date.localeCompare(b.date));
    const faites = taches.filter(t => t.fait), restantes = taches.filter(t => !t.fait);
    const ouvertes = D.deficiences.filter(d => d.statut !== 'Terminé');
    const ordre = { Urgent: 0, 'Élevée': 1, Moyenne: 2, Faible: 3 };
    const prio = ouvertes.slice().sort((a, b) => ordre[a.gravite] - ordre[b.gravite]).slice(0, 4);
    const ech = D.obligations.filter(o => joursAvant(o.prochaine) <= 60).sort((a, b) => a.prochaine.localeCompare(b.prochaine));
    const dep = DEPENSES.reduce((s, d) => s + d[2], 0);
    return feuille('Rapport mensuel au conseil d\'administration', 'Novembre 2026 · Préparé le ' + dfr(AUJ), `
      <div class="ges-cadre">
        <div><div class="sur">Tâches faites</div><b class="num">${faites.length} sur ${taches.length}</b></div>
        <div><div class="sur">Déficiences ouvertes</div><b class="num">${ouvertes.length}</b></div>
        <div><div class="sur">Échéances, 60 jours</div><b class="num">${ech.length}</b></div>
        <div><div class="sur">Dépenses du mois</div><b class="num">${argent(dep)}</b></div>
      </div>
      <div><h3>Tâches d'entretien</h3>
        ${tbl(['Tâche', 'Installation', 'Date', 'État'], taches.map(t => [t.titre, D.inst(t.inst).nom.replace('Installation ', ''), dfr(t.date, true), t.fait ? pil('ok', 'Faite') : (joursAvant(t.date) < 0 ? pil('critique', 'En retard') : pil('neutre', 'À faire'))]))}</div>
      <div><h3>Déficiences à suivre</h3>
        ${tbl(['Déficience', 'Installation', 'Priorité', 'Statut', '>Estimation'], prio.map(d => [d.titre, D.inst(d.inst).nom.replace('Installation ', ''), pil(D.GRAVITES[d.gravite], d.gravite), d.statut, d.cout ? argent(d.cout) : '—']))}</div>
      <div><h3>Échéances de conformité des 60 prochains jours</h3>
        ${tbl(['Obligation', 'Installation', 'Échéance'], ech.map(o => [o.titre, D.inst(o.inst).nom.replace('Installation ', ''), echeance(o.prochaine)]))}</div>
      <div><h3>Dépenses d'entretien et de réparation (fictives)</h3>
        ${tbl(['Dépense', 'Installation', '>Montant'], DEPENSES.map(d => [d[0], D.inst(d[1]).nom.replace('Installation ', ''), argent(d[2])]).concat([['<b>Total</b>', '', `<b>${argent(dep)}</b>`]]))}</div>`);
  }

  function apercuCarnet() {
    const i = D.inst('erables');
    const cs = D.composantes.filter(c => c.inst === i.id).sort((a, b) => D.finDeVie(a) - D.finDeVie(b));
    const defs = D.deficiences.filter(d => d.inst === i.id && d.statut !== 'Terminé');
    return feuille('Carnet de santé de l\'immeuble', `${i.nom} · ${i.adresse}`, `
      <div class="ges-cadre">
        <div><div class="sur">Indice de santé</div><b class="num">${i.sante} sur 100</b></div>
        <div><div class="sur">Construit en</div><b class="num">${i.annee}</b></div>
        <div><div class="sur">Composantes</div><b class="num">${cs.length}</b></div>
        <div><div class="sur">Déficiences ouvertes</div><b class="num">${defs.length}</b></div>
      </div>
      <div><h3>Composantes, de la plus proche à la plus lointaine fin de vie utile</h3>
        ${tbl(['Composante', 'Installée', 'Fin de vie utile', 'État', '>Remplacement'], cs.map(c => [c.nom, c.annee, 'Vers ' + D.finDeVie(c), pil(D.ETATS[c.etat][1], D.ETATS[c.etat][0]), c.cout ? argent(c.cout) : '—']))}</div>
      <div><h3>Déficiences ouvertes</h3>
        ${tbl(['Déficience', 'Priorité', 'Statut'], defs.map(d => [d.titre, pil(D.GRAVITES[d.gravite], d.gravite), d.statut]))}</div>`);
  }

  function apercuCourtier() {
    const par = D.installations.map(i => ({ i, els: elementsImmeuble(i) }));
    const cles = par[0].els.map(e => e.cle);
    return feuille("Rapport de l'immeuble pour l'assureur", `Police ${D.assurance.police} · échéance du ${dfr(D.assurance.echeance)} · Courtier : ${D.assurance.personne}`, `
      ${tbl(['Élément', ...par.map(x => x.i.nom.replace('Installation ', ''))], cles.map((k, n) => [`<b>${k}</b>`, ...par.map(x => x.els[n].ok ? `${x.els[n].val}${x.els[n].sous ? `<span class="sous">${x.els[n].sous}</span>` : ''}` : '<span class="muet">Non renseigné</span>')]))}
      <div class="rangee">${par.map(x => { const c = completude(x.els); return `<span>${x.i.nom.replace('Installation ', '')} : ${c.ok ? pil('ok', 'Complet') : pil('alerte', `${c.n} sur ${c.tot}`)}</span>`; }).join('')}</div>
      <p class="petit muet">Transmis seulement avec le consentement du membre, qui peut le retirer en tout temps.</p>`);
  }

  function apercuMinistere() {
    const gros = planMaintien('echeance').liste.filter(x => x.cout > 50000);
    return feuille('Bilan de santé et carnet d\'entretien', `Dossier en vue d'un investissement de plus de ${S50}`, `
      <p style="color:var(--texte-2)">Selon les règles budgétaires 2026-2027 des CPE, un CPE propriétaire doit avoir réalisé un bilan de santé de ses infrastructures, établi un carnet d'entretien et exécuté les correctifs planifiés avant tout investissement de plus de ${S50}, lequel demande aussi l'approbation préalable du Ministère.</p>
      ${tbl(['Condition', 'Érables', 'Ruisseau', 'Gare'], [
        ['<b>Bilan de santé</b>', pil('ok', '12 mai 2022'), pil('info', 'Non exigé avant le 31 mars 2030 (PFI)'), pil('neutre', 'Locataire')],
        ["<b>Carnet d'entretien</b>", pil('ok', 'À jour'), pil('ok', 'À jour'), pil('ok', 'À jour')],
        ['<b>Correctifs planifiés</b>', pil('alerte', 'En cours'), pil('ok', 'Aucun'), pil('ok', 'Aucun')]
      ])}
      <div><h3>Projets du plan de plus de ${S50}</h3>
        ${tbl(['Projet', 'Installation', 'Année', '>Coût estimé'], gros.map(x => [x.c.nom, D.inst(x.c.inst).nom.replace('Installation ', ''), x.an, argent(x.cout)]))}</div>
      <p class="petit muet">Annexes prévues : rapport du bilan de santé du 30 mai 2022, carnet d'entretien, preuves des correctifs exécutés.</p>`);
  }

  function apercuReclamations() {
    const l = D.reclamations.slice().sort((a, b) => b.date.localeCompare(a.date));
    return feuille('Historique des réclamations', `Toutes les installations · ${pl(l.length, 'réclamation')} au dossier`, `
      ${tbl(['Date', 'Sinistre', 'Installation', '>Réclamé', '>Payé', 'Statut'], l.map(r => [dfr(r.date, true) + ' ' + r.date.slice(0, 4), r.type, D.inst(r.inst).nom.replace('Installation ', ''), argent(r.reclame), argent(r.paye), r.statut]))}
      <p style="color:var(--texte-2)">Total payé : <b>${argent(l.reduce((s, r) => s + r.paye, 0))}</b> sur <b>${argent(l.reduce((s, r) => s + r.reclame, 0))}</b> réclamés.</p>`);
  }

  function apercuMaintien() {
    const { liste } = planMaintien('echeance');
    const t5 = liste.filter(x => x.an <= 2031).reduce((s, x) => s + x.cout, 0), t10 = liste.reduce((s, x) => s + x.cout, 0);
    const lignes = []; for (let a = 2027; a <= 2036; a++) { const l = liste.filter(x => x.an === a); lignes.push([a, pl(l.length, 'projet'), argent(l.reduce((s, x) => s + x.cout, 0))]); }
    return feuille("Plan de maintien d'actifs", '2027 à 2036 · coûts et durées de vie indicatifs, fictifs', `
      <div class="ges-cadre"><div><div class="sur">Sur 5 ans</div><b class="num">${argent(t5)}</b></div><div><div class="sur">Sur 10 ans</div><b class="num">${argent(t10)}</b></div><div><div class="sur">Provision annuelle</div><b class="num">${argent(Math.round(t10 / 10))}</b></div></div>
      ${tbl(['Année', 'Projets', '>Investissement'], lignes)}`);
  }

  function apercuInspections() {
    const l = D.inspections.slice().sort((a, b) => b.date.localeCompare(a.date));
    return feuille('Registre des inspections', 'Toutes les installations', tbl(['Date', 'Type', 'Installation', 'Réalisée par', '>Constats', '>Déficiences', 'Statut'],
      l.map(x => [dfr(x.date, true) + ' ' + x.date.slice(0, 4), x.type, D.inst(x.inst).nom.replace('Installation ', ''), x.par, x.constats || '—', x.deficiences || '—', pil(x.statut === 'À planifier' ? 'alerte' : 'ok', x.statut)])));
  }

  const MODELES = [
    { id: 'mensuel', ico: 'calendrier', titre: 'Rapport mensuel d\'activités', dest: "Conseil d'administration", desc: "Les tâches faites et à faire, les déficiences ouvertes, les échéances à venir et les dépenses du mois.", apercu: apercuMensuel },
    { id: 'carnet', ico: 'batiment', titre: "Carnet de santé de l'immeuble", dest: 'Direction et conseil d\'administration', desc: "L'indice de santé, l'inventaire des composantes, leur fin de vie utile et les déficiences d'une installation.", apercu: apercuCarnet },
    { id: 'courtier', ico: 'parapluie', titre: "Rapport de l'immeuble pour le courtier", dest: "Courtier d'assurance, avec consentement", desc: "Toiture, électricité, plomberie, alarme incendie, réclamations et dernière inspection de chaque installation.", apercu: apercuCourtier },
    { id: 'ministere', ico: 'bouclier', titre: 'Dossier « bilan de santé et carnet d\'entretien »', dest: 'Ministère', desc: "Les trois conditions à remplir avant un investissement de plus de " + S50 + ", avec les projets concernés.", apercu: apercuMinistere },
    { id: 'reclamations', ico: 'rapport', titre: 'Historique des réclamations', dest: 'Courtier, assureur ou conseil d\'administration', desc: "Chaque sinistre déclaré, les montants réclamés et payés, et l'état du règlement.", apercu: apercuReclamations },
    { id: 'maintien', ico: 'tendance', titre: "Plan de maintien d'actifs", dest: "Conseil d'administration", desc: "Les investissements prévus de 2027 à 2036, le total sur 5 et 10 ans et la provision annuelle suggérée.", apercu: apercuMaintien },
    { id: 'inspections', ico: 'loupe', titre: 'Registre des inspections', dest: "Direction et Service des infrastructures de l'AQCPE", desc: "Les inspections réalisées et à venir, leurs constats et leurs déficiences, installation par installation.", apercu: apercuInspections }
  ];

  App.vue('rapports', {
    rendu() {
      const reseau = App.role === 'reseau';
      const intro = reseau
        ? "Les rapports agrégés du réseau regroupent les données des seuls membres qui ont consenti au partage, sans exposer le détail d'un membre."
        : "Des modèles prêts à l'emploi, remplis avec les données de vos installations, pour le conseil d'administration, votre courtier ou le Ministère.";
      return `${CSS}
      <div class="page-tete"><div><h1>Rapports</h1><p class="intro">${intro}</p></div>
        <div class="actions"><button class="btn clair" data-action="Planification d'un envoi mensuel simulée">${ic('calendrier')}Planifier un envoi mensuel</button></div></div>
      <div class="grille g3">${MODELES.map(m => `<article class="carte pile">
        <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico">${ic(m.ico)}</div><div><h3>${m.titre}</h3><div class="petit muet" style="margin-top:2px">Destinataire : ${m.dest}</div></div></div>
        <p class="petit" style="color:var(--texte-2);flex:1">${m.desc}</p>
        <div class="rangee"><button class="btn mini" data-apercu="${m.id}">${ic('oeil')}Aperçu</button><button class="btn clair mini" data-action="Rapport exporté en PDF : ${esc(m.titre)}">${ic('telecharger')}Exporter en PDF</button><button class="btn nu mini" data-action="Rapport envoyé par courriel : ${esc(m.titre)}">${ic('envoyer')}Envoyer par courriel</button></div>
      </article>`).join('')}</div>
      <div class="pile serre"><div class="rangee entre"><h2>Aperçu : rapport mensuel au CA, novembre 2026</h2><div class="rangee"><button class="btn clair mini" data-action="Rapport exporté en PDF : rapport mensuel">${ic('telecharger')}Exporter en PDF</button><button class="btn nu mini" data-action="Rapport envoyé par courriel : rapport mensuel">${ic('envoyer')}Envoyer par courriel</button></div></div>
        ${apercuMensuel()}</div>`;
    },
    apres(racine) {
      racine.addEventListener('click', e => {
        const b = e.target.closest('[data-apercu]'); if (!b) return;
        const m = MODELES.find(x => x.id === b.dataset.apercu);
        App.modale(m.titre, m.apercu(), `<button class="btn clair" data-fermer>Fermer</button><button class="btn clair" data-fermer data-action="Rapport exporté en PDF : ${esc(m.titre)}">${ic('telecharger')}Exporter en PDF</button><button class="btn" data-fermer data-action="Rapport envoyé par courriel : ${esc(m.titre)}">${ic('envoyer')}Envoyer par courriel</button>`);
      });
    }
  });

  /* =====================================================================
     7. Paramètres
     ===================================================================== */
  const UTILISATEURS = [
    ['Dominique Tremblay', 'Direction générale', 'Toutes les installations', 'Accès complet', '2026-11-18'],
    ['Maude Lavoie', 'Direction adjointe', 'Toutes les installations', 'Entretien, travaux, conformité', '2026-11-17'],
    ['Samuel Gagné', "Préposé à l'entretien", 'Installation des Érables', "Grilles d'entretien, déficiences", '2026-11-12'],
    ['Nadia Pelletier', "Responsable d'installation", 'Installation du Ruisseau', "Grilles, tâches et documents de l'installation", '2026-11-16'],
    ['Étienne Roy', 'Membre du CA (lecture seule)', 'Toutes les installations', 'Consultation des rapports', '2026-11-02']
  ];
  const CONSENTEMENTS = [
    ['wc', 'william.coop', 'Repérer des regroupements d\'achats', "william.coop utilise des données agrégées (par exemple, le nombre de toitures à remplacer en 2029 dans une région) pour repérer des regroupements de travaux et obtenir de meilleurs prix pour les membres. Aucun document ni aucune photo n'est transmis.", true],
    ['aq', "Service des infrastructures de l'AQCPE", 'Réaliser les inspections', "Le Service des infrastructures consulte le carnet de santé de vos installations (composantes, historique, déficiences) pour préparer et réaliser les inspections. L'accès est limité aux personnes qui interviennent chez vous.", true],
    ['co', "Courtier d'assurance", "Préparer le renouvellement", "Votre courtier peut consulter le rapport de l'immeuble (toiture, électricité, plomberie, alarme incendie, réclamations, dernière inspection), jamais l'ensemble de votre carnet.", true]
  ];

  App.vue('parametres', {
    rendu(p) {
      const act = ['org', 'util', 'notif', 'partage', 'hors'].includes(p && p.onglet) ? p.onglet : 'org';
      const h = k => (k === act ? '' : 'hidden');
      return `${CSS}
      <div class="page-tete"><div><h1>Paramètres</h1><p class="intro">Votre organisation, les personnes qui ont accès à Solage, vos notifications et vos consentements.</p></div></div>
      <div data-onglets class="pile">
        ${onglets([['org', 'Organisation'], ['util', 'Utilisateurs et rôles'], ['notif', 'Notifications'], ['partage', 'Partage des données'], ['hors', 'Mode hors ligne']], act)}

        <div data-panneau="org" class="pile" ${h('org')}>
          <div class="grille g-1-2">
            <div class="carte"><div class="carte-tete"><h2>Votre CPE</h2><button class="lien" data-action="Fiche de l'organisation en mode édition">Modifier</button></div>
              <dl class="cv" style="grid-template-columns:auto 1fr"><dt>Nom</dt><dd>${D.cpe.nom}</dd><dt>Région</dt><dd>${D.cpe.region}</dd><dt>Places</dt><dd>${D.cpe.places}</dd><dt>Membre depuis</dt><dd>${D.cpe.membreDepuis}</dd><dt>Installations</dt><dd>${D.installations.length}</dd></dl></div>
            <div class="carte serree"><div class="carte-tete"><h2>Installations</h2><button class="lien" data-action="Formulaire d'ajout d'une installation ouvert">Ajouter une installation</button></div>
              <div class="table-zone"><table class="t"><thead><tr><th>Installation</th><th>Statut</th><th class="num">Places</th><th class="num">Année</th><th class="num">Superficie</th></tr></thead>
                <tbody>${D.installations.map(i => `<tr class="cliquable" ${aller('installation', { id: i.id })}><td><span class="principal-cel">${i.nom}</span><span class="sous">${i.adresse}</span></td><td>${etiq(i.statut.split(' (')[0], i.statut === 'Propriétaire' ? 'bleu' : '')}</td><td class="num">${i.places}</td><td class="num">${i.annee}</td><td class="num">${nombre(i.superficie)} m²</td></tr>`).join('')}</tbody></table></div></div>
          </div>
        </div>

        <div data-panneau="util" class="pile" ${h('util')}>
          <div class="carte serree"><div class="carte-tete"><h2>Utilisateurs et rôles</h2><button class="btn mini" data-action="Invitation envoyée">${ic('plus')}Inviter une personne</button></div>
            <div class="table-zone"><table class="t"><thead><tr><th>Personne</th><th>Rôle</th><th>Installations</th><th>Accès</th><th>Dernière connexion</th><th></th></tr></thead>
              <tbody>${UTILISATEURS.map(u => `<tr><td><div class="rangee" style="flex-wrap:nowrap"><div class="avatar petit">${initiales(u[0])}</div><span class="principal-cel">${u[0]}</span></div></td><td>${etiq(u[1], u[1].startsWith('Direction') ? 'bleu' : u[1].startsWith('Membre') ? '' : 'vert')}</td><td>${u[2]}</td><td class="petit">${u[3]}</td><td>${dfr(u[4], true)}</td><td><button class="btn nu mini" data-action="Rôle de ${esc(u[0])} en modification">Modifier</button></td></tr>`).join('')}</tbody></table></div></div>
          <div class="avis">${ic('info')}<div>Les noms ci-dessus sont fictifs. Le profil « membre du CA » consulte les rapports sans pouvoir rien modifier.</div></div>
        </div>

        <div data-panneau="notif" class="pile" ${h('notif')}>
          <div class="carte" id="ges-notif"><div class="carte-tete"><h2>Notifications</h2></div>
            <div class="coche"><input type="checkbox" id="ges-n-courriel" checked><div><label for="ges-n-courriel" class="fort">Recevoir les rappels par courriel</label><div class="petit muet">En plus des notifications dans l'application.</div></div></div>
            <div class="coche"><input type="checkbox" id="ges-n-30" data-jours="30" checked><div><label for="ges-n-30" class="fort">Rappel 30 jours avant l'échéance</label></div></div>
            <div class="coche"><input type="checkbox" id="ges-n-7" data-jours="7" checked><div><label for="ges-n-7" class="fort">Rappel 7 jours avant l'échéance</label></div></div>
            <div class="coche"><input type="checkbox" id="ges-n-1" data-jours="1" checked><div><label for="ges-n-1" class="fort">Rappel 1 jour avant l'échéance</label></div></div>
            <div class="rangee entre" style="margin-top:12px"><span class="petit" id="ges-n-resume" style="color:var(--texte-2)"></span><button class="btn" data-action="Préférences de notification enregistrées">Enregistrer</button></div></div>
        </div>

        <div data-panneau="partage" class="pile" ${h('partage')}>
          <div class="avis vert">${ic('bouclier')}<div><b>Vous restez propriétaire de vos données.</b> Chaque partage repose sur votre consentement, que vous pouvez retirer en tout temps; l'accès prend alors fin.</div></div>
          <div class="carte" id="ges-partage">${CONSENTEMENTS.map(c => `<div class="coche"><input type="checkbox" id="ges-c-${c[0]}" data-cons="${c[0]}" ${c[4] ? 'checked' : ''}><div style="flex:1"><div class="rangee entre"><label for="ges-c-${c[0]}" class="fort">${c[1]} : ${c[2].toLowerCase()}</label><span data-etat="${c[0]}">${c[4] ? pil('ok', 'Actif') : pil('neutre', 'Retiré')}</span></div><p class="petit muet" style="margin-top:4px;max-width:75ch">${c[3]}</p></div></div>`).join('')}
            <div class="rangee entre" style="margin-top:12px"><span class="petit muet" id="ges-p-resume"></span><button class="btn" data-action="Consentements enregistrés">Enregistrer mes choix</button></div></div>
        </div>

        <div data-panneau="hors" class="pile" ${h('hors')}>
          <div class="carte"><div class="carte-tete"><h2>Travailler sans réseau</h2><span id="ges-sync">${pil('ok', 'Synchronisé')}</span></div>
            <p style="color:var(--texte-2);max-width:75ch">Dans l'application proposée, la tablette conserve les grilles d'entretien et les fiches d'inspection pour que le travail se poursuive dans un sous-sol, une salle mécanique ou sur le toit. Dès que le réseau revient, les modifications se synchronisent avec la version Web.</p>
            <div class="ges-etapes" style="margin-top:14px">
              <div><div class="ico">${ic('telephone')}</div><b>1. Sur la tablette</b><span class="petit muet">Vous remplissez une grille ou une inspection, photos comprises, même sans réseau.</span></div>
              <div><div class="ico ambre">${ic('horsligne')}</div><b>2. En attente</b><span class="petit muet">Les modifications sont gardées sur l'appareil et marquées « en attente de synchronisation ».</span></div>
              <div><div class="ico vert">${ic('coche')}</div><b>3. Synchronisation</b><span class="petit muet">Au retour du réseau, tout est envoyé automatiquement, et l'historique garde chaque version.</span></div>
              <div><div class="ico gris">${ic('graphique')}</div><b>4. Version Web</b><span class="petit muet">La direction retrouve les résultats dans le tableau de bord, les rapports et le calendrier.</span></div>
            </div>
            <div class="rangee" style="margin-top:16px"><button class="btn clair" id="ges-hl">${ic('horsligne')}Simuler une perte de réseau</button><span class="petit muet" id="ges-hl-txt">Tout est à jour.</span></div></div>
        </div>
      </div>`;
    },
    apres(racine) {
      /* Notifications : le résumé suit les cases */
      const n = racine.querySelector('#ges-notif');
      const majN = () => {
        const j = [...n.querySelectorAll('[data-jours]')].filter(c => c.checked).map(c => c.dataset.jours);
        const mail = n.querySelector('#ges-n-courriel').checked;
        racine.querySelector('#ges-n-resume').textContent = j.length
          ? `Rappels ${j.length > 1 ? j.slice(0, -1).join(', ') + ' et ' + j[j.length - 1] : j[0]} ${j[j.length - 1] === '1' && j.length === 1 ? 'jour' : 'jours'} avant chaque échéance${mail ? ', par courriel et dans l\'application.' : ', dans l\'application seulement.'}`
          : 'Aucun rappel avant les échéances.';
      };
      n.addEventListener('change', majN); majN();
      /* Consentements : pastille et résumé */
      const p = racine.querySelector('#ges-partage');
      const majP = () => {
        let actifs = 0;
        p.querySelectorAll('[data-cons]').forEach(c => {
          if (c.checked) actifs++;
          p.querySelector(`[data-etat="${c.dataset.cons}"]`).innerHTML = c.checked ? pil('ok', 'Actif') : pil('neutre', 'Retiré');
        });
        racine.querySelector('#ges-p-resume').textContent = actifs + ' consentement' + (actifs > 1 ? 's' : '') + ' actif' + (actifs > 1 ? 's' : '') + ' sur 3.';
      };
      p.addEventListener('change', majP); majP();
      /* Mode hors ligne simulé */
      const b = racine.querySelector('#ges-hl'), s = racine.querySelector('#ges-sync'), t = racine.querySelector('#ges-hl-txt');
      let hors = false;
      b.addEventListener('click', () => {
        hors = !hors;
        s.innerHTML = hors ? pil('alerte', '3 modifications en attente') : pil('ok', 'Synchronisé');
        t.textContent = hors ? 'Hors ligne : vos grilles et photos restent sur la tablette.' : 'Réseau rétabli : 3 modifications synchronisées.';
        b.innerHTML = ic('horsligne') + (hors ? 'Rétablir le réseau' : 'Simuler une perte de réseau');
      });
    }
  });
})();
