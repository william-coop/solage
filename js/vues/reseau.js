/* Vues du réseau : achats regroupés, fournisseurs agréés, portrait du parc, regroupements de travaux,
   bibliothèque de contenu, membres et accès, portefeuille du courtier, tournée de l'inspection.
   Tous les chiffres du réseau, les CPE nommés ici et les fournisseurs sont fictifs. */

/* ---------- Utilitaires propres à ces vues (préfixe res) ---------- */
function resDec(n) { return n.toFixed(1).replace('.', ','); }
function resPlusJours(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function resFour(id) { return D.fournisseurs.find(f => f.id === id) || D.fournisseurs[0]; }
function resStatutCamp(c) {
  if (c.statut === 'Vous êtes inscrit') return pil('ok', 'Inscription confirmée');
  if (c.statut === 'Hors de votre région') return pil('neutre', c.statut);
  return pil('info', c.statut);
}
function resNote(n) { return `<span class="rangee" style="gap:4px;flex-wrap:nowrap"><span style="color:var(--ambre);display:inline-flex">${ic('etoile').replace('<svg', '<svg width="16" height="16"')}</span><b class="num">${resDec(n)}</b><span class="muet petit">/ 5</span></span>`; }
function resCouleurIndice(v) { return v >= 80 ? 'ok' : v >= 70 ? 'alerte' : 'critique'; }

const RES_CSS = `<style>
  .res-vedette { border-color: var(--ambre); box-shadow: 0 0 0 3px var(--ambre-pale), var(--ombre); }
  .res-encart { background: var(--ambre-pale); border-radius: var(--r-s); padding: 10px 12px; font-size: .84rem; color: var(--texte); display: flex; gap: 10px; align-items: flex-start; }
  .res-encart svg { width: 17px; height: 17px; flex: none; color: var(--ambre-fonce); margin-top: 2px; }
  .res-barre-cel { display: flex; align-items: center; gap: 8px; min-width: 120px; }
  .res-barre-cel .barre { flex: 1; height: 7px; }
  .res-barre-cel b { width: 30px; text-align: right; font-variant-numeric: tabular-nums; }
  .res-graph { display: grid; grid-template-columns: 34px repeat(6, minmax(52px, 1fr)); gap: 0 12px; min-width: 470px; position: relative; }
  .res-axe { position: relative; height: 230px; font-size: .7rem; color: var(--texte-3); }
  .res-axe span { position: absolute; right: 0; transform: translateY(50%); }
  .res-col { position: relative; height: 230px; display: flex; flex-direction: column; justify-content: flex-end; background: repeating-linear-gradient(0deg, var(--ligne) 0 1px, transparent 1px 57.5px); }
  .res-col i { display: block; width: 100%; border-top: 1px solid var(--surface); }
  .res-col i:first-of-type { border-radius: 4px 4px 0 0; }
  .res-col .res-total { position: absolute; left: 0; right: 0; text-align: center; font-weight: 700; font-size: .78rem; color: var(--marine); }
  .res-annee { text-align: center; font-size: .78rem; font-weight: 700; color: var(--texte-2); padding-top: 6px; }
  .res-legende { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: .8rem; color: var(--texte-2); }
  .res-legende span { display: inline-flex; align-items: center; gap: 6px; }
  .res-legende i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
  .res-occ { border: 1px solid var(--ligne); border-left: 4px solid var(--ambre); border-radius: var(--r-s); padding: 14px 16px; background: var(--surface); display: flex; flex-direction: column; gap: 8px; }
  .res-occ h3 { font-size: .95rem; }
  .res-chiffres { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: .8rem; color: var(--texte-2); }
  .res-chiffres b { color: var(--marine); }
  .res-etapes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; list-style: none; margin: 0; padding: 0; }
  .res-etapes li button { width: 100%; text-align: left; border: 1px solid var(--ligne); background: var(--surface); border-radius: var(--r-s); padding: 9px 11px; display: flex; gap: 9px; align-items: center; font-size: .8rem; font-weight: 700; color: var(--texte-2); }
  .res-etapes li button:hover { border-color: var(--bleu-vif); }
  .res-num { width: 26px; height: 26px; border-radius: 50%; background: var(--bleu); color: var(--surface); display: grid; place-items: center; font-weight: 700; font-size: .8rem; flex: none; font-family: var(--titre); }
  .res-num.ambre { background: var(--ambre); color: var(--marine); }
  .res-tl { display: grid; grid-template-columns: 130px repeat(6, minmax(70px, 1fr)); min-width: 620px; border: 1px solid var(--ligne); border-radius: var(--r-s); overflow: hidden; font-size: .78rem; }
  .res-tl > div { padding: 8px 8px; border-bottom: 1px solid var(--ligne); border-right: 1px solid var(--ligne); min-height: 38px; display: flex; align-items: center; }
  .res-tl .res-tl-tete { background: var(--surface-2); font-weight: 700; color: var(--texte-3); text-transform: uppercase; letter-spacing: .05em; font-size: .66rem; }
  .res-tl .res-tl-ville { font-weight: 700; color: var(--marine); }
  .res-tl .res-tl-bloc { background: var(--bleu-pale); color: var(--bleu); font-weight: 700; border-left: 3px solid var(--bleu); }
  .res-tl .res-tl-bloc.ambre { background: var(--ambre-pale); color: var(--ambre-fonce); border-left-color: var(--ambre); }
  .res-gauche-tel { display: grid; grid-template-columns: minmax(250px, 300px) minmax(0, 1fr); gap: 18px; align-items: start; }
  .res-tels { display: flex; flex-wrap: wrap; gap: 18px; justify-content: center; }
  .res-tel-cadre { display: flex; flex-direction: column; gap: 8px; align-items: center; }
  .res-tel-cadre > .sur { text-align: center; }
  .res-code { width: 100%; display: flex; gap: 10px; align-items: center; text-align: left; border: 1px solid var(--ligne); background: var(--surface); border-radius: var(--r-s); padding: 8px 10px; font-size: .8rem; color: var(--texte); }
  .res-code b { min-width: 30px; height: 24px; border-radius: 5px; background: var(--bleu-pale); color: var(--bleu); display: grid; place-items: center; font-size: .74rem; }
  .res-code.actif { border-color: var(--bleu); background: var(--bleu-tres-pale); box-shadow: inset 0 0 0 1px var(--bleu); }
  .res-code.actif b { background: var(--bleu); color: var(--surface); }
  .res-horsligne { background: var(--alerte-pale); color: var(--alerte); border: 1px solid var(--alerte); border-radius: var(--r-s); padding: 8px 10px; display: flex; gap: 8px; align-items: center; font-weight: 700; font-size: .78rem; }
  .res-horsligne svg { width: 18px; height: 18px; flex: none; }
  .res-tel-carte { background: var(--surface); border: 1px solid var(--ligne); border-radius: var(--r-m); padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
  .res-tel-carte b { color: var(--marine); }
  .res-mini { font-size: .72rem; color: var(--texte-3); }
  .res-adapt { display: grid; grid-template-columns: 150px minmax(0, 1fr) 34px; gap: 10px; align-items: center; font-size: .84rem; }
  @media (max-width: 1100px) { .res-gauche-tel { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 860px) { .res-etapes { grid-template-columns: repeat(2, minmax(0, 1fr)); } .res-adapt { grid-template-columns: 110px minmax(0, 1fr) 30px; } }
</style>`;

/* =====================================================================
   1. Achats regroupés (profil Direction de CPE)
   ===================================================================== */
const RES_VILLES = {
  'Estrie': ['Sherbrooke', 'Magog', 'Coaticook', 'East Angus', 'Lac-Mégantic', 'Windsor'],
  'Montérégie': ['Longueuil', 'Saint-Hyacinthe', 'Saint-Jean-sur-Richelieu', 'Châteauguay', 'Sorel-Tracy']
};
function resTournee(c) {
  const villes = c.region.includes('Montérégie') && c.region.includes('Estrie')
    ? [...RES_VILLES['Estrie'].slice(0, 3), ...RES_VILLES['Montérégie'].slice(0, 3)]
    : (RES_VILLES[c.region] || RES_VILLES['Estrie']);
  const semaines = [];
  for (let d = c.debut, i = 0; d <= c.fin; d = resPlusJours(d, 7), i++) semaines.push(d);
  return semaines.map((s, i) => [s, villes[i % villes.length], 2 + ((i * 3 + c.inscrits) % 4)]);
}

function resCarteCampagne(c, vedette) {
  const f = resFour(c.fournisseur);
  const pct = Math.round(c.inscrits / c.cible * 100);
  const atteinte = c.inscrits >= c.cible;
  const hors = c.statut === 'Hors de votre région';
  return `<article class="carte pile ${vedette ? 'res-vedette' : 'ombre'}">
    <div class="rangee entre" style="align-items:flex-start;flex-wrap:nowrap">
      <div><div class="rangee" style="gap:6px;margin-bottom:6px">${etiq(c.region, 'bleu')}${vedette ? etiq('Recommandé pour vous', 'ambre') : ''}</div><h2>${c.titre}</h2></div>
      ${resStatutCamp(c)}
    </div>
    <dl class="cv">
      <dt>Fenêtre de travaux</dt><dd>Du ${dateFr(c.debut, true)} au ${dateFr(c.fin)}</dd>
      <dt>Inscriptions jusqu'au</dt><dd><span class="rangee" style="gap:6px">${dateFr(c.limite)} ${echeance(c.limite)}</span></dd>
      <dt>Fournisseur agréé</dt><dd>${f.nom}<span class="sous petit muet" style="display:block;font-weight:400">${f.metier} · ${f.licence}</span></dd>
      <dt>Économie estimée</dt><dd>${c.economie} <span class="muet petit" style="font-weight:400">par rapport à un contrat individuel</span></dd>
    </dl>
    <div class="pile serre">
      <div class="rangee entre petit"><span><b class="num">${c.inscrits}</b> installations inscrites sur <b class="num">${c.cible}</b> visées</span>${atteinte ? pil('ok', 'Cible atteinte : prix de groupe confirmé') : `<span class="muet">Encore ${c.cible - c.inscrits} pour atteindre la cible</span>`}</div>
      ${barre(pct, atteinte ? 'ok' : 'alerte')}
    </div>
    ${c.pertinent && c.raison ? `<div class="res-encart">${ic('cible')}<div><b>Pourquoi cela vous concerne</b><br>${c.raison}</div></div>` : ''}
    <div class="rangee" style="margin-top:auto">
      ${c.statut === 'Vous êtes inscrit'
        ? `<button class="btn clair" data-action="Inscription modifiée">${ic('crayon')}Modifier mon inscription</button>`
        : `<button class="btn ambre" data-inscrire="${c.id}" ${hors ? 'disabled style="opacity:.55;cursor:not-allowed" title="Ce regroupement vise une autre région"' : ''}>${ic('plus')}Inscrire une installation</button>`}
      <button class="btn clair" data-detail="${c.id}">${ic('oeil')}Voir le détail</button>
    </div>
  </article>`;
}

function resModaleInscrire(c) {
  const toiture = /toiture/i.test(c.titre);
  const lignes = D.installations.map(i => {
    const exclue = toiture && i.statut.startsWith('Locataire');
    const coche = c.pertinent === i.id && !exclue;
    return `<label class="coche" style="${exclue ? 'opacity:.55' : ''}"><input type="checkbox" value="${i.id}" data-places="${i.places}" ${coche ? 'checked' : ''} ${exclue ? 'disabled' : ''}>
      <div style="flex:1"><b style="color:var(--marine)">${i.nom}</b><div class="petit muet">${i.ville} · ${i.places} places · construit en ${i.annee}${exclue ? ' · toiture à la charge du locateur' : ''}</div></div>
      ${c.pertinent === i.id ? etiq('Besoin repéré au carnet', 'ambre') : ''}</label>`;
  }).join('');
  App.modale(`Inscrire une installation`, `
    <p style="color:var(--texte-2)">Regroupement « ${c.titre} », ${c.region}. Travaux du ${dateFr(c.debut, true)} au ${dateFr(c.fin)}, avec ${resFour(c.fournisseur).nom}.</p>
    <div><div class="sur" style="margin-bottom:4px">Installations à inscrire</div><div class="liste" id="res-choix">${lignes}</div></div>
    <div class="avis" id="res-resume"></div>
    <div class="champ"><label for="res-dispo">Contraintes d'accès ou de calendrier (facultatif)</label><textarea id="res-dispo" placeholder="Par exemple : accès à la cour par la rue arrière, fermeture du 19 au 30 juillet"></textarea></div>
    <p class="petit muet">L'inscription est sans frais. Vous confirmez votre engagement seulement après la confirmation des prix par le fournisseur.</p>`,
    `<button class="btn clair" data-fermer>Annuler</button><button class="btn ambre" id="res-confirmer" data-fermer data-action="Inscription transmise">Confirmer l'inscription</button>`);
  const v = document.getElementById('voile');
  const maj = () => {
    const choix = [...v.querySelectorAll('#res-choix input:checked')];
    const places = choix.reduce((s, x) => s + +x.dataset.places, 0);
    const btn = v.querySelector('#res-confirmer');
    btn.disabled = !choix.length;
    btn.style.opacity = choix.length ? '' : '.5';
    btn.dataset.action = `Inscription transmise : ${choix.length} installation${choix.length > 1 ? 's' : ''} au regroupement « ${c.titre} »`;
    const apres = c.inscrits + choix.length;
    v.querySelector('#res-resume').innerHTML = `${ic('info')}<div>${choix.length
      ? `<b>${choix.length} installation${choix.length > 1 ? 's' : ''} sélectionnée${choix.length > 1 ? 's' : ''}</b> (${places} places). Le regroupement passerait à ${apres} inscriptions sur ${c.cible} visées${apres >= c.cible ? ' : la cible serait atteinte.' : '.'}`
      : 'Cochez au moins une installation.'}</div>`;
  };
  v.querySelector('#res-choix').addEventListener('change', maj);
  maj();
}

function resModaleDetail(c) {
  const f = resFour(c.fournisseur);
  const fermeture = resPlusJours(c.limite, 14);
  const etapes = [
    ['Besoins recensés', `Repérés dans les carnets de santé des membres de la région, automne 2026`, 'fait'],
    ['Appel de propositions aux fournisseurs agréés', `Proposition retenue : ${f.nom}`, 'fait'],
    ['Confirmation des prix', `Après la clôture des inscriptions, vers le ${dateFr(fermeture)}`, ''],
    ['Tournée régionale', `Du ${dateFr(c.debut, true)} au ${dateFr(c.fin)}, à dates fixes par ville`, 'attente'],
    ['Bilan', 'Satisfaction des membres, coûts réels et garanties, environ un mois après la tournée', 'attente']
  ];
  const tournee = resTournee(c);
  App.modale(c.titre, `
    <div class="rangee">${etiq(c.region, 'bleu')}${resStatutCamp(c)}${etiq('Économie estimée ' + c.economie, 'ambre')}</div>
    <div><h3 style="margin-bottom:10px">Étapes du regroupement</h3>
      <div class="chrono">${etapes.map(([t, s, e]) => `<div class="etape ${e}"><i></i><div><b>${t}</b><span>${s}</span></div></div>`).join('')}</div></div>
    <div><h3 style="margin-bottom:6px">Conditions</h3>
      <ul class="petit" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px;color:var(--texte-2)">
        <li>Inscription sans frais; engagement ferme seulement après la confirmation des prix.</li>
        <li>Même prix unitaire pour toutes les installations inscrites, peu importe leur taille.</li>
        <li>Travaux planifiés hors des heures de garde ou dans une zone clôturée, loin des enfants.</li>
        <li>Licence et assurance responsabilité du fournisseur vérifiées par la coop.</li>
        <li>L'économie réelle dépend du nombre d'inscriptions et de l'état de chaque bâtiment; elle n'est pas garantie.</li>
      </ul></div>
    <div><h3 style="margin-bottom:6px">Calendrier de tournée prévu</h3>
      <div class="liste">${tournee.map(([s, ville, n]) => `<div class="ligne" style="padding:8px 0"><div class="ico gris">${ic('camion')}</div><div class="corps"><b>Semaine du ${dateFr(s, true)}</b><span>${ville} · ${n} installations</span></div></div>`).join('')}</div>
      <p class="petit muet" style="margin-top:6px">Calendrier indicatif; les dates de chaque installation sont confirmées avec la direction trois semaines à l'avance.</p></div>`,
    `<button class="btn clair" data-fermer>Fermer</button>${c.statut === 'Inscriptions ouvertes' ? `<button class="btn ambre" data-fermer data-inscrire-ensuite="${c.id}">Inscrire une installation</button>` : ''}`);
  const v = document.getElementById('voile');
  const b = v.querySelector('[data-inscrire-ensuite]');
  if (b) b.addEventListener('click', () => setTimeout(() => resModaleInscrire(c), 0));
}

App.vue('achats', {
  rendu(p) {
    const ordre = D.campagnes.slice().sort((a, b) => (b.id === p.id) - (a.id === p.id));
    const region = ordre.filter(c => c.region.includes(D.cpe.region));
    const miennes = ordre.filter(c => c.statut === 'Vous êtes inscrit');
    const ouverts = D.campagnes.filter(c => c.statut === 'Inscriptions ouvertes' && c.region.includes(D.cpe.region)).length;
    const grilleCartes = l => l.length ? `<div class="grille g2">${l.map(c => resCarteCampagne(c, c.id === p.id)).join('')}</div>` : `<div class="carte"><p class="muet">Aucun regroupement dans cette liste pour l'instant.</p></div>`;
    return `${RES_CSS}
    <div class="page-tete">
      <div><div class="sur">william.coop · ${D.cpe.region}</div><h1>Achats regroupés</h1>
        <p class="intro">Quand plusieurs membres ont le même besoin au même moment, la coop négocie un seul contrat avec un fournisseur agréé, qui fait une tournée régionale à dates fixes. Chacun obtient un meilleur prix et moins de démarches.</p></div>
      <div class="actions"><button class="btn clair" ${aller('fournisseurs')}>${ic('camion')}Fournisseurs agréés</button><button class="btn ambre" data-proposer>${ic('plus')}Proposer un regroupement</button></div>
    </div>
    <div class="grille g4">
      <div class="carte stat"><span class="lib">Regroupements ouverts dans votre région</span><span class="val">${ouverts}</span></div>
      <div class="carte stat"><span class="lib">Vos installations inscrites</span><span class="val">3 <small>· 1 regroupement</small></span></div>
      <div class="carte stat"><span class="lib">Besoins de votre carnet couverts par un regroupement</span><span class="val">3 <small>/ 5</small></span>${barre(60, 'alerte')}</div>
      <div class="carte stat"><span class="lib">Économie estimée sur vos inscriptions</span><span class="val">${argent(2900)}</span><span class="tend neutre">Estimation, selon les prix confirmés en 2026</span></div>
    </div>
    <div class="grille g-2-1">
      <div data-onglets class="pile">
        ${onglets([['region', `Offerts dans ma région (${region.length})`], ['miennes', `Mes inscriptions (${miennes.length})`], ['tous', `Tous (${ordre.length})`]], 'region')}
        <div data-panneau="region" class="pile">${grilleCartes(region)}</div>
        <div data-panneau="miennes" class="pile" hidden>${grilleCartes(miennes)}</div>
        <div data-panneau="tous" class="pile" hidden>${grilleCartes(ordre)}</div>
      </div>
      <div class="pile">
        <div class="carte" id="res-proposer">
          <div class="carte-tete"><h2>Proposer un regroupement</h2>${etiq('Membres', 'ambre')}</div>
          <p class="petit" style="color:var(--texte-2);margin-bottom:12px">Un besoin revient chez vous et sans doute chez vos voisins? Proposez-le : la coop vérifie dans les carnets combien de membres sont concernés.</p>
          <div class="pile serre">
            <div class="champ"><label for="res-p-type">Type de travaux ou de service</label><select id="res-p-type"><option>Déneigement des toitures</option><option>Remplacement de fenêtres</option><option>Scellement du stationnement</option><option>Analyse de la qualité de l'air</option><option>Autre</option></select></div>
            <div class="champ"><label for="res-p-quand">Période souhaitée</label><select id="res-p-quand"><option>Printemps 2027</option><option>Été 2027</option><option>Automne 2027</option></select></div>
            <div class="champ"><label for="res-p-note">Précisions</label><textarea id="res-p-note" placeholder="Par exemple : nos deux installations ont des toits plats à déneiger chaque hiver"></textarea></div>
            <button class="btn ambre bloc" data-action="Proposition transmise à l'équipe des achats regroupés">${ic('envoyer')}Envoyer la proposition</button>
          </div>
        </div>
        <div class="carte" style="background:var(--bleu-tres-pale)">
          <div class="carte-tete"><h2>Comment vos données aident le réseau</h2>${ic('cadenas').replace('<svg', '<svg width="18" height="18" style="color:var(--bleu)"')}</div>
          <div class="pile serre petit" style="color:var(--texte-2)">
            <p>Quand vous documentez une composante (type, année, état), Solage l'additionne à celles des autres membres, <b>sans votre nom ni votre adresse</b>. C'est ainsi que la coop repère, par exemple, une vingtaine de toitures à refaire dans une même région.</p>
            <p>Vous recevez un avis personnel seulement quand un regroupement correspond à un besoin de votre carnet.</p>
            <div class="rangee" style="gap:6px;margin-top:4px">${pil('ok', 'Données agrégées : william.coop')}${pil('ok', 'Inspection : AQCPE')}${pil('neutre', 'Courtier : au cas par cas')}</div>
            <button class="btn nu mini" style="align-self:flex-start;margin-top:4px" ${aller('parametres')}>Gérer mes consentements</button>
          </div>
        </div>
      </div>
    </div>`;
  },
  apres(racine) {
    racine.addEventListener('click', e => {
      const ins = e.target.closest('[data-inscrire]');
      if (ins && !ins.disabled) { resModaleInscrire(D.campagnes.find(c => c.id === ins.dataset.inscrire)); return; }
      const det = e.target.closest('[data-detail]');
      if (det) { resModaleDetail(D.campagnes.find(c => c.id === det.dataset.detail)); return; }
      if (e.target.closest('[data-proposer]')) {
        const z = racine.querySelector('#res-proposer');
        z.scrollIntoView({ behavior: 'smooth', block: 'center' });
        z.querySelector('select').focus({ preventScroll: true });
      }
    });
  }
});

/* =====================================================================
   2. Fournisseurs agréés (Direction de CPE et Réseau)
   ===================================================================== */
const RES_METIERS = [
  ['tous', 'Tous les corps de métier', () => true],
  ['toiture', 'Toiture', f => /couvreur/i.test(f.metier)],
  ['incendie', 'Sécurité incendie', f => /incendie/i.test(f.metier)],
  ['jeu', 'Aires de jeu', f => /jeu/i.test(f.metier)],
  ['plomberie', 'Plomberie', f => /plomb/i.test(f.metier)],
  ['ventilation', 'Ventilation', f => /ventilation/i.test(f.metier)],
  ['exterieur', 'Pavage et maçonnerie', f => /pavage|maçon/i.test(f.metier)]
];
function resCleMetier(f) { const m = RES_METIERS.slice(1).find(([, , t]) => t(f)); return m ? m[0] : 'autre'; }

function resModaleSoumission(f) {
  const opts = id => {
    const l = D.deficiences.filter(d => d.inst === id && d.statut !== 'Terminé');
    return l.map(d => `<option value="${d.id}">${esc(d.titre)} (${d.metier})</option>`).join('') + '<option value="">Aucune déficience liée</option>';
  };
  App.modale(`Demander une soumission`, `
    <div class="rangee" style="flex-wrap:nowrap"><div class="ico ambre">${ic('camion')}</div><div><b>${f.nom}</b><div class="petit muet">${f.metier} · ${f.regions}</div></div></div>
    <div class="grille g2" style="gap:12px">
      <div class="champ"><label for="res-s-inst">Installation</label><select id="res-s-inst">${D.installations.map(i => `<option value="${i.id}">${i.nom}</option>`).join('')}</select></div>
      <div class="champ"><label for="res-s-date">Visite souhaitée</label><select id="res-s-date"><option>D'ici deux semaines</option><option>D'ici un mois</option><option>Au printemps 2027</option></select></div>
    </div>
    <div class="champ"><label for="res-s-def">Déficience liée</label><select id="res-s-def">${opts(D.installations[0].id)}</select></div>
    <div class="champ"><label for="res-s-desc">Description des travaux</label><textarea id="res-s-desc">Merci de nous transmettre une soumission pour les travaux décrits dans la déficience liée. Les photos et le rapport d'inspection sont joints.</textarea></div>
    <label class="coche"><input type="checkbox" checked><div>Joindre les photos et l'extrait du rapport d'inspection</div></label>
    <p class="petit muet">Le fournisseur reçoit seulement les renseignements de cette demande. Le tarif négocié pour les membres s'applique.</p>`,
    `<button class="btn clair" data-fermer>Annuler</button><button class="btn ambre" data-fermer data-action="Demande de soumission envoyée à ${esc(f.nom)}">${ic('envoyer')}Envoyer la demande</button>`);
  const v = document.getElementById('voile');
  const inst = v.querySelector('#res-s-inst'), def = v.querySelector('#res-s-def');
  const choisir = () => {
    def.innerHTML = opts(inst.value);
    const lie = [...def.options].find(o => { const d = D.deficiences.find(x => x.id === o.value); return d && resCleMetier({ metier: d.metier }) === resCleMetier(f); });
    if (lie) def.value = lie.value;
  };
  inst.addEventListener('change', choisir);
  choisir();
}

function resModaleEvaluations(f) {
  const regs = f.regions === 'Tout le Québec' ? ['Estrie', 'Montérégie', 'Capitale-Nationale'] : f.regions.split(', ');
  const de = r => /^[AEÉIOU]/.test(r) ? `de l'${r}` : r === 'Montréal' ? 'de Montréal' : `de la ${r}`;
  const avis = [
    [5, 'Ponctuel et propre', "L'équipe est arrivée à la date prévue de la tournée et a travaillé pendant la sieste dans une zone clôturée. Rapport clair avec photos."],
    [4, 'Bon travail, devis détaillé', 'Prix conforme au tarif négocié. Un délai d’une semaine pour la facture, mais tout était bien expliqué.'],
    [5, 'Nous le recommandons', 'Très bonne communication avec la direction. Le technicien a pris le temps d’expliquer l’entretien à faire à notre préposé.']
  ];
  App.modale(`Évaluations : ${f.nom}`, `
    <div class="rangee entre">${resNote(f.note)}<span class="petit muet">${f.contrats} contrats dans le réseau · évaluations anonymisées</span></div>
    <div class="liste">${avis.map(([n, t, txt], k) => `<div class="ligne" style="align-items:flex-start"><div class="ico gris">${ic('batiment')}</div><div class="corps"><div class="rangee entre"><b>${t}</b>${resNote(n)}</div><span>Un CPE ${de(regs[k % regs.length])} · ${['octobre 2026', 'juillet 2026', 'mai 2026'][k]}</span><p class="petit" style="margin-top:4px;color:var(--texte-2)">${txt}</p></div></div>`).join('')}</div>
    <p class="petit muet">Seuls les membres qui ont fait affaire avec le fournisseur par Solage peuvent l'évaluer.</p>`);
}

App.vue('fournisseurs', {
  rendu() {
    const reseau = App.role === 'reseau';
    const regions = [...new Set(D.fournisseurs.flatMap(f => f.regions.split(', ')))].sort((a, b) => a.localeCompare(b, 'fr'));
    return `${RES_CSS}
    <div class="page-tete">
      <div><h1>Fournisseurs agréés</h1><p class="intro">Des entreprises dont la coop a vérifié la licence et les assurances, avec un avantage négocié pour les membres. Les évaluations viennent de CPE qui ont fait affaire avec elles.</p></div>
      <div class="actions">${reseau ? `<button class="btn ambre" data-action="Formulaire d'agrément d'un fournisseur ouvert">${ic('plus')}Ajouter un fournisseur agréé</button>` : `<button class="btn clair" ${aller('achats')}>${ic('panier')}Achats regroupés</button>`}</div>
    </div>
    <div class="carte" style="padding:14px 18px">
      <div class="rangee" style="gap:14px">
        <div class="champ" style="flex:1;min-width:200px"><label for="res-f-metier">Corps de métier</label><select id="res-f-metier">${RES_METIERS.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></div>
        <div class="champ" style="flex:1;min-width:200px"><label for="res-f-region">Région desservie</label><select id="res-f-region"><option value="">Toutes les régions</option>${regions.map(r => `<option ${!reseau && r === D.cpe.region ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
        <p class="petit muet" id="res-f-compte" style="align-self:flex-end;padding-bottom:9px"></p>
      </div>
    </div>
    <div class="grille g3" id="res-f-liste">
      ${D.fournisseurs.map(f => `<article class="carte ombre pile" data-metier="${resCleMetier(f)}" data-regions="${esc(f.regions)}">
        <div class="rangee entre" style="align-items:flex-start;flex-wrap:nowrap"><div class="rangee" style="flex-wrap:nowrap"><div class="avatar ${f.id === 'f3' ? 'vert' : ''}">${initiales(f.nom)}</div><div><h2 style="font-size:1rem">${f.nom}</h2><div class="petit muet">${f.metier}</div></div></div>${resNote(f.note)}</div>
        <dl class="cv" style="grid-template-columns:minmax(100px,38%) minmax(0,1fr)">
          <dt>Régions</dt><dd>${f.regions}</dd>
          <dt>Dans le réseau</dt><dd>${f.contrats} contrats</dd>
          <dt>Avantage</dt><dd>${f.rabais}</dd>
        </dl>
        <div class="rangee">${pil('ok', f.licence)}${pil('ok', 'Assurance vérifiée')}</div>
        <div class="rangee" style="margin-top:auto">
          <button class="btn mini ambre" data-soumission="${f.id}">${ic('envoyer')}Demander une soumission</button>
          <button class="btn mini clair" data-evaluations="${f.id}">Voir les évaluations</button>
        </div>
      </article>`).join('')}
    </div>
    <div class="carte" id="res-f-vide" hidden><p class="muet">Aucun fournisseur agréé ne correspond à ces filtres. <button class="btn nu mini" data-reinit>Retirer les filtres</button></p></div>
    <div class="avis">${ic('info')}<div>Être agréé ne garantit pas la qualité des travaux : la coop vérifie la licence et les assurances chaque année et retire les fournisseurs dont les évaluations baissent. Les entreprises présentées ici sont fictives.</div></div>`;
  },
  apres(racine) {
    const m = racine.querySelector('#res-f-metier'), r = racine.querySelector('#res-f-region');
    const filtrer = () => {
      let n = 0;
      racine.querySelectorAll('#res-f-liste > article').forEach(a => {
        const ok = (m.value === 'tous' || a.dataset.metier === m.value) && (!r.value || a.dataset.regions.includes(r.value) || a.dataset.regions === 'Tout le Québec');
        a.hidden = !ok; if (ok) n++;
      });
      racine.querySelector('#res-f-compte').textContent = `${n} fournisseur${n > 1 ? 's' : ''} sur ${D.fournisseurs.length}`;
      racine.querySelector('#res-f-vide').hidden = n > 0;
    };
    m.addEventListener('change', filtrer); r.addEventListener('change', filtrer);
    racine.addEventListener('click', e => {
      const s = e.target.closest('[data-soumission]'); if (s) return resModaleSoumission(resFour(s.dataset.soumission));
      const ev = e.target.closest('[data-evaluations]'); if (ev) return resModaleEvaluations(resFour(ev.dataset.evaluations));
      if (e.target.closest('[data-reinit]')) { m.value = 'tous'; r.value = ''; filtrer(); }
    });
    filtrer();
  }
});

/* =====================================================================
   3. Portrait du parc (profil Réseau) — chiffres fictifs
   ===================================================================== */
const RES_REGIONS = [
  { nom: 'Montréal', inst: 78, indice: 69, toits: 19, jeux: 31, ce: 22 },
  { nom: 'Montérégie', inst: 61, indice: 72, toits: 14, jeux: 24, ce: 17 },
  { nom: 'Capitale-Nationale', inst: 42, indice: 74, toits: 9, jeux: 15, ce: 11 },
  { nom: 'Estrie', inst: 31, indice: 71, toits: 12, jeux: 13, ce: 9 },
  { nom: 'Laurentides', inst: 24, indice: 75, toits: 6, jeux: 9, ce: 7 },
  { nom: 'Outaouais', inst: 23, indice: 70, toits: 7, jeux: 10, ce: 8 },
  { nom: 'Laval', inst: 22, indice: 73, toits: 5, jeux: 8, ce: 6 },
  { nom: 'Lanaudière', inst: 21, indice: 72, toits: 5, jeux: 8, ce: 6 },
  { nom: 'Mauricie', inst: 18, indice: 68, toits: 6, jeux: 7, ce: 5 },
  { nom: 'Chaudière-Appalaches', inst: 17, indice: 76, toits: 4, jeux: 6, ce: 4 },
  { nom: 'Saguenay–Lac-Saint-Jean', inst: 16, indice: 71, toits: 5, jeux: 6, ce: 5 },
  { nom: 'Centre-du-Québec', inst: 14, indice: 73, toits: 4, jeux: 5, ce: 3 }
];
const RES_ANNEES = [
  { an: 2027, toits: 28, fen: 18, meca: 47, jeux: 21 },
  { an: 2028, toits: 34, fen: 22, meca: 41, jeux: 26 },
  { an: 2029, toits: 34, fen: 27, meca: 36, jeux: 19 },
  { an: 2030, toits: 29, fen: 31, meca: 52, jeux: 24 },
  { an: 2031, toits: 26, fen: 24, meca: 39, jeux: 30 },
  { an: 2032, toits: 35, fen: 20, meca: 33, jeux: 17 }
];
const RES_SERIES = [['toits', 'Toitures', 'var(--marine)'], ['fen', 'Fenêtres', 'var(--bleu-vif)'], ['meca', 'Mécanique (chauffage, ventilation, eau chaude)', 'var(--ambre)'], ['jeux', 'Aires de jeu', 'var(--vert)']];
const RES_OCCASIONS = [
  { titre: '23 toitures en bardeaux à refaire en Estrie et en Montérégie d’ici 2028', membres: 19, volume: 1840000, fournisseurs: 1, icone: 'toit', note: 'Fin de vie utile atteinte ou état « mauvais » au dernier bilan.' },
  { titre: '39 aires de jeu à certifier en 2027 à Montréal et à Laval', membres: 27, volume: 47000, fournisseurs: 1, icone: 'jeu', note: 'Certificats de conformité qui arrivent à échéance le 31 décembre 2027.' },
  { titre: '22 chauffe-eau en fin de vie utile à Montréal', membres: 17, volume: 92000, fournisseurs: 0, icone: 'eau', note: 'Appareils de 12 ans et plus; aucun plombier agréé encore dans la région.' },
  { titre: '14 panneaux d’alarme incendie à remplacer, Capitale-Nationale et Chaudière-Appalaches', membres: 11, volume: 310000, fournisseurs: 0, icone: 'feu', note: 'Panneaux de 20 ans et plus signalés lors des vérifications annuelles.' },
  { titre: '18 installations aux fenêtres en fin de vie, Outaouais et Laurentides', membres: 13, volume: 690000, fournisseurs: 0, icone: 'batiment', note: 'Verre thermos embué ou cadres détériorés, d’ici 2029.' }
];

function resLigneRegion(r, max) {
  const cel = (v, m, type) => `<td><div class="res-barre-cel"><b>${v}</b>${barre(v / m * 100, type)}</div></td>`;
  return `<tr>
    <td class="principal-cel">${r.nom}</td>
    ${cel(r.inst, max.inst, '')}
    <td><div class="res-barre-cel"><b>${r.indice}</b>${barre(r.indice, resCouleurIndice(r.indice))}</div></td>
    ${cel(r.toits, max.toits, 'alerte')}
    ${cel(r.jeux, max.jeux, 'ok')}
    ${cel(r.ce, max.ce, 'alerte')}
  </tr>`;
}
function resMaxRegions() {
  const max = {};
  ['inst', 'toits', 'jeux', 'ce'].forEach(k => { max[k] = Math.max(...RES_REGIONS.map(r => r[k])); });
  return max;
}

App.vue('reseau', {
  rendu() {
    const tot = k => RES_REGIONS.reduce((s, r) => s + r[k], 0);
    const nInst = tot('inst');
    const indice = RES_REGIONS.reduce((s, r) => s + r.indice * r.inst, 0) / nInst;
    const max = resMaxRegions();
    const echelle = 160;
    const totaux = RES_ANNEES.map(a => RES_SERIES.reduce((s, [k]) => s + a[k], 0));
    return `${RES_CSS}
    <div class="page-tete">
      <div><div class="sur">william.coop · Service des infrastructures de l'AQCPE</div><h1>Portrait du parc immobilier des membres</h1>
        <p class="intro">Ce que les carnets de santé disent, ensemble, de l'état des bâtiments du réseau : où sont les besoins, quand ils arrivent, et où un regroupement de travaux ferait gagner tout le monde.</p></div>
      <div class="actions"><button class="btn clair" data-action="Portrait du parc exporté en PDF">${ic('telecharger')}Exporter</button><button class="btn ambre" ${aller('regroupements')}>${ic('panier')}Regroupements de travaux</button></div>
    </div>
    <div class="avis">${ic('info')}<div class="petit">Chiffres fictifs, à des fins de démonstration. Dans l'application, ce portrait ne montre que des données agrégées : aucun CPE n'y est identifié, et chaque membre choisit ce qu'il partage avec la coop, l'AQCPE et son courtier.</div></div>

    <div class="grille g4">
      <div class="carte stat"><span class="lib">CPE participants</span><span class="val">214</span><span class="tend bon">+38 depuis janvier 2026</span></div>
      <div class="carte stat"><span class="lib">Installations documentées</span><span class="val">${nombre(nInst)}</span><span class="tend neutre">${nombre(5874)} composantes au carnet</span></div>
      <div class="carte stat"><span class="lib">Âge moyen des bâtiments</span><span class="val">29 <small>ans</small></span><span class="tend neutre">41 % construits avant 1995</span></div>
      <div class="carte"><div class="rangee" style="flex-wrap:nowrap">${jauge(Math.round(indice), 'indice moyen', 'var(--ambre)')}<div class="stat"><span class="lib">Indice de santé moyen</span><span class="tend mauvais">−2 points en un an</span><span class="lib">Travaux prévus sur cinq ans : <b>48,6 M$</b></span></div></div></div>
    </div>

    <section class="carte" style="border-color:var(--ambre);background:var(--ambre-pale)">
      <div class="carte-tete"><div><h2>Occasions de regroupement détectées</h2><p class="petit" style="color:var(--texte-2);margin-top:2px">Calculées chaque nuit à partir des carnets : même composante, même région, même horizon.</p></div>${etiq(RES_OCCASIONS.length + ' occasions', 'ambre')}</div>
      <div class="grille g2" style="gap:12px">
        ${RES_OCCASIONS.map((o, k) => `<div class="res-occ" ${k === 0 ? 'style="grid-column:1/-1;border-left-width:6px"' : ''}>
          <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico ambre">${ic(o.icone)}</div><div style="flex:1"><h3>${o.titre}</h3><p class="petit muet">${o.note}</p></div>${k === 0 ? pil('ok', 'Prioritaire') : ''}</div>
          <div class="res-chiffres"><span><b>${o.membres}</b> membres concernés</span><span>Volume estimé <b>${argent(o.volume)}</b></span><span>${o.fournisseurs ? `<b>${o.fournisseurs}</b> fournisseur agréé dans la région` : 'Fournisseur agréé à trouver'}</span></div>
          <div class="rangee"><button class="btn ${k === 0 ? 'ambre' : 'clair'} mini" ${aller('regroupements', { occasion: k })}>${ic('plus')}Créer un regroupement</button>${k === 0 ? '<span class="petit muet">Une tournée de six semaines en juin et juillet 2027 est envisageable.</span>' : ''}</div>
        </div>`).join('')}
      </div>
    </section>

    <div class="grille g-3-2">
      <section class="carte serree">
        <div class="carte-tete"><h2>Répartition par région administrative</h2>
          <div class="segments" role="group" aria-label="Trier par">
            ${[['inst', 'Installations'], ['indice', 'Indice'], ['toits', 'Toitures'], ['jeux', 'Aires de jeu'], ['ce', 'Chauffe-eau']].map(([k, l], i) => `<button data-tri="${k}" class="${i === 0 ? 'actif' : ''}">${l}</button>`).join('')}
          </div></div>
        <div class="table-zone"><table class="t">
          <thead><tr><th>Région</th><th>Installations</th><th>Indice moyen</th><th>Toitures à refaire<span class="sous" style="text-transform:none;letter-spacing:0">d'ici 3 ans</span></th><th>Aires de jeu<span class="sous" style="text-transform:none;letter-spacing:0">à certifier en 2027</span></th><th>Chauffe-eau<span class="sous" style="text-transform:none;letter-spacing:0">en fin de vie</span></th></tr></thead>
          <tbody id="res-regions">${RES_REGIONS.map(r => resLigneRegion(r, max)).join('')}</tbody>
          <tfoot><tr><td class="principal-cel" style="border-top:1px solid var(--ligne-forte)">Réseau</td><td class="fort num" style="border-top:1px solid var(--ligne-forte)">${nInst}</td><td class="fort num" style="border-top:1px solid var(--ligne-forte)">${resDec(indice)}</td><td class="fort num" style="border-top:1px solid var(--ligne-forte)">${tot('toits')}</td><td class="fort num" style="border-top:1px solid var(--ligne-forte)">${tot('jeux')}</td><td class="fort num" style="border-top:1px solid var(--ligne-forte)">${tot('ce')}</td></tr></tfoot>
        </table></div>
        <p class="petit muet" style="padding:10px 18px">Barres à l'échelle de la valeur la plus élevée de chaque colonne. L'indice est sur 100.</p>
      </section>

      <section class="carte">
        <div class="carte-tete"><h2>Composantes qui atteignent leur fin de vie utile, par année</h2></div>
        <div class="table-zone"><div class="res-graph" role="img" aria-label="Histogramme empilé de 2027 à 2032">
          <div class="res-axe">${[0, 40, 80, 120, 160].map(v => `<span style="bottom:${v / echelle * 100}%">${v}</span>`).join('')}</div>
          ${RES_ANNEES.map((a, i) => `<div class="res-col" title="${a.an} : ${totaux[i]} composantes">
            <span class="res-total" style="bottom:calc(${totaux[i] / echelle * 100}% + 4px)">${totaux[i]}</span>
            ${RES_SERIES.slice().reverse().map(([k, l, c]) => `<i style="height:${a[k] / echelle * 100}%;background:${c}" title="${l} : ${a[k]}"></i>`).join('')}
          </div>`).join('')}
          <div></div>${RES_ANNEES.map(a => `<div class="res-annee">${a.an}</div>`).join('')}
        </div></div>
        <div class="res-legende" style="margin-top:12px">${RES_SERIES.map(([, l, c]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')}</div>
        <p class="petit muet" style="margin-top:8px">Selon l'année d'installation et la durée de vie utile indicative inscrites aux carnets. Les toitures de 2027 à 2029 (${RES_ANNEES.slice(0, 3).reduce((s, a) => s + a.toits, 0)}) correspondent à la colonne « Toitures à refaire » du tableau.</p>
      </section>
    </div>

    <section class="carte">
      <div class="carte-tete"><h2>Ce que le réseau y gagne</h2></div>
      <div class="grille g3">
        <div class="pile serre"><div class="rangee"><div class="ico vert">${ic('batiment')}</div><h3>Les membres</h3></div>
          <p class="petit" style="color:var(--texte-2)">Moins de temps à chercher un entrepreneur et à comparer des soumissions. Des travaux prévus d'avance, à dates fixes, et un budget plus prévisible pour le conseil d'administration.</p></div>
        <div class="pile serre"><div class="rangee"><div class="ico ambre">${ic('panier')}</div><h3>La coop</h3></div>
          <p class="petit" style="color:var(--texte-2)">Un pouvoir d'achat regroupé fondé sur des besoins réels et datés, pas sur des estimations. Les fournisseurs agréés planifient une tournée complète, ce qui permet de négocier de meilleurs prix pour tous.</p></div>
        <div class="pile serre"><div class="rangee"><div class="ico">${ic('graphique')}</div><h3>L'AQCPE</h3></div>
          <p class="petit" style="color:var(--texte-2)">Un portrait à jour des besoins du parc immobilier, région par région, pour appuyer ses représentations sur le financement des infrastructures et cibler ses inspections.</p></div>
      </div>
    </section>`;
  },
  apres(racine) {
    const corps = racine.querySelector('#res-regions');
    const max = resMaxRegions();
    racine.querySelectorAll('[data-tri]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.tri;
      racine.querySelectorAll('[data-tri]').forEach(x => x.classList.toggle('actif', x === b));
      const l = RES_REGIONS.slice().sort((x, y) => k === 'indice' ? x[k] - y[k] : y[k] - x[k]);
      corps.innerHTML = l.map(r => resLigneRegion(r, max)).join('');
    }));
  }
});

/* =====================================================================
   4. Regroupements de travaux (profil Réseau)
   ===================================================================== */
const RES_ADMISSIBLES = [
  { cpe: 'CPE Les Petits Bâtisseurs', inst: 'Installation des Érables', ville: 'Sherbrooke', toit: 2004, etat: 4, cout: 78000, coche: true },
  { cpe: 'CPE Pomme de Pin-Pin', inst: 'Installation du Verger', ville: 'Coaticook', toit: 2003, etat: 4, cout: 64000, coche: true },
  { cpe: 'CPE Les Trottinettes du Lac', inst: 'Installation de la Baie', ville: 'Magog', toit: 2005, etat: 3, cout: 71000, coche: true },
  { cpe: 'CPE Bricolo-Bricoli', inst: 'Installation principale', ville: 'Sherbrooke', toit: 2001, etat: 5, cout: 86000, coche: true },
  { cpe: 'CPE La Cabane à Sons', inst: 'Installation des Pins', ville: 'Lac-Mégantic', toit: 2006, etat: 3, cout: 59000, coche: true },
  { cpe: 'CPE Les Grenouilles Curieuses', inst: 'Installation du Marais', ville: 'East Angus', toit: 2002, etat: 4, cout: 52000, coche: true },
  { cpe: 'CPE Le Nid des Hiboux Lunaires', inst: 'Installation de la Colline', ville: 'Sherbrooke', toit: 2004, etat: 3, cout: 68000, coche: true },
  { cpe: 'CPE Les Petites Boussoles', inst: 'Installation du Nord', ville: 'Windsor', toit: 2007, etat: 3, cout: 57000, coche: false }
];
const RES_TL = [
  ['Sherbrooke', 1, 3, '3 installations', ''],
  ['Coaticook', 3, 4, '1 installation', ''],
  ['Magog', 3, 4, '1 installation', 'ambre'],
  ['East Angus', 4, 5, '1 installation', ''],
  ['Lac-Mégantic', 5, 6, '1 installation', 'ambre'],
  ['Windsor', 6, 7, 'À confirmer', 'ambre']
];

App.vue('regroupements', {
  rendu(p) {
    const occ = RES_OCCASIONS[p.occasion] || RES_OCCASIONS[0];
    const semaines = ['2027-06-07', '2027-06-14', '2027-06-21', '2027-06-28', '2027-07-05', '2027-07-12'];
    const etape = (n, titre, sous, corps) => `<section class="carte" id="res-etape-${n}">
      <div class="carte-tete"><div class="rangee" style="flex-wrap:nowrap"><span class="res-num ${n === 1 ? 'ambre' : ''}">${n}</span><div><h2>${titre}</h2><p class="petit muet">${sous}</p></div></div></div>${corps}</section>`;
    return `${RES_CSS}
    <div class="page-tete">
      <div><h1>Regroupements de travaux</h1><p class="intro">Suivez les regroupements en cours et créez-en de nouveaux à partir des besoins repérés dans les carnets des membres.</p></div>
      <div class="actions"><button class="btn clair" ${aller('reseau')}>${ic('carte')}Portrait du parc</button><button class="btn ambre" data-aller-etape="1">${ic('plus')}Créer un regroupement</button></div>
    </div>

    <section class="carte serree">
      <div class="carte-tete"><h2>Regroupements en cours</h2><span class="petit muet">${D.campagnes.length} regroupements · ${D.campagnes.reduce((s, c) => s + c.inscrits, 0)} installations inscrites</span></div>
      <div class="table-zone"><table class="t">
        <thead><tr><th>Regroupement</th><th>Inscrits / cible</th><th>Fournisseur agréé</th><th>Inscriptions jusqu'au</th><th>Travaux</th><th>Statut</th><th>Économie estimée</th></tr></thead>
        <tbody>${D.campagnes.map(c => { const ok = c.inscrits >= c.cible; return `<tr class="cliquable" data-action="Fiche du regroupement « ${esc(c.titre)} » ouverte">
          <td><span class="principal-cel">${c.titre}</span><span class="sous">${c.region}</span></td>
          <td style="min-width:150px"><div class="res-barre-cel"><b style="width:auto">${c.inscrits}/${c.cible}</b>${barre(c.inscrits / c.cible * 100, ok ? 'ok' : 'alerte')}</div></td>
          <td>${resFour(c.fournisseur).nom}<span class="sous">${resFour(c.fournisseur).metier}</span></td>
          <td>${echeance(c.limite)}</td>
          <td style="white-space:nowrap">${dateFr(c.debut, true)} au ${dateFr(c.fin, true)} 2027</td>
          <td>${ok ? pil('ok', 'Cible atteinte') : pil('info', 'Inscriptions ouvertes')}</td>
          <td>${c.economie}</td></tr>`; }).join('')}</tbody>
      </table></div>
    </section>

    <div class="pile" style="gap:12px">
      <div class="rangee entre"><div><h2>Créer un regroupement</h2><p class="petit muet">Point de départ : « ${occ.titre} »</p></div>${pil('neutre', 'Brouillon')}</div>
      <ol class="res-etapes" aria-label="Étapes">
        ${['Besoin détecté', 'Installations admissibles', 'Appel de propositions', 'Calendrier de tournée'].map((t, i) => `<li><button data-aller-etape="${i + 1}"><span class="res-num ${i === 0 ? 'ambre' : ''}">${i + 1}</span>${t}</button></li>`).join('')}
      </ol>
    </div>

    ${etape(1, 'Besoin détecté', 'Prérempli à partir des carnets; modifiable.', `
      <div class="grille g4" style="gap:12px">
        <div class="champ"><label for="res-r-comp">Composante</label><select id="res-r-comp"><option selected>Toiture en bardeaux d'asphalte</option><option>Toit plat, membrane élastomère</option><option>Chauffe-eau</option><option>Aire de jeu : certification</option></select></div>
        <div class="champ"><label for="res-r-region">Région</label><select id="res-r-region"><option selected>Estrie</option><option>Estrie et Montérégie</option><option>Montérégie</option></select></div>
        <div class="champ"><label for="res-r-horizon">Horizon</label><select id="res-r-horizon"><option>D'ici 2027</option><option selected>D'ici 2028</option><option>D'ici 2029</option></select></div>
        <div class="champ"><label for="res-r-critere">Critère</label><select id="res-r-critere"><option selected>Fin de vie utile ou état « mauvais »</option><option>Fin de vie utile seulement</option></select></div>
      </div>
      <div class="res-encart" style="margin-top:12px">${ic('cible')}<div>En Estrie, <b>12 toitures</b> répondent au critère dans les carnets, dont 8 dont le membre a accepté d'être avisé des regroupements. Les autres membres recevront un avis général.</div></div>`)}

    ${etape(2, 'Installations admissibles', 'Cochez les installations à inviter. Les membres confirment ensuite eux-mêmes leur inscription.', `
      <div class="table-zone"><table class="t">
        <thead><tr><th style="width:40px"><span class="sr" style="position:absolute;left:-9999px">Inclure</span></th><th>Installation</th><th>Ville</th><th class="num">Toiture</th><th>État</th><th class="num">Estimation</th></tr></thead>
        <tbody id="res-adm">${RES_ADMISSIBLES.map((a, i) => `<tr>
          <td><input type="checkbox" data-i="${i}" ${a.coche ? 'checked' : ''} aria-label="Inclure ${esc(a.inst)}" style="width:18px;height:18px;accent-color:var(--vert)"></td>
          <td><span class="principal-cel">${a.inst}</span><span class="sous">${a.cpe}</span></td>
          <td>${a.ville}</td><td class="num">${a.toit}<span class="sous">fin de vie vers ${a.toit + 25}</span></td>
          <td>${pil(D.ETATS[a.etat][1], D.ETATS[a.etat][0])}</td><td class="num">${argent(a.cout)}</td></tr>`).join('')}</tbody>
      </table></div>
      <div class="rangee entre" style="margin-top:12px;padding:12px 14px;background:var(--bleu-tres-pale);border-radius:var(--r-s)" id="res-compteur" aria-live="polite"></div>
      <p class="petit muet" style="margin-top:8px">Noms de CPE fictifs. Les estimations viennent des carnets et seront remplacées par les prix confirmés du fournisseur.</p>`)}

    ${etape(3, 'Appel de propositions aux fournisseurs agréés', 'Les fournisseurs agréés de la région reçoivent le volume et le calendrier, sans le nom des membres.', `
      <div class="grille g2" style="gap:14px">
        <div class="pile serre">
          ${[['f1', 'Lot principal : réfection des toitures', true], ['f7', "Lot optionnel : aération de l'entretoit", false]].map(([id, lot, c]) => { const f = resFour(id); return `<label class="coche" style="align-items:center"><input type="checkbox" ${c ? 'checked' : ''}><div style="flex:1"><b style="color:var(--marine)">${f.nom}</b><div class="petit muet">${lot} · ${f.regions} · ${f.contrats} contrats dans le réseau</div></div>${resNote(f.note)}</label>`; }).join('')}
          <div class="champ" style="margin-top:6px"><label for="res-r-date">Date limite des propositions</label><input id="res-r-date" type="text" value="15 février 2027"></div>
        </div>
        <div class="carte plate" style="background:var(--surface-2)"><div class="sur" style="margin-bottom:6px">Critères d'évaluation</div>
          <ul class="petit" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px;color:var(--texte-2)">
            <li>Prix unitaire au mètre carré, identique pour tous les membres</li><li>Capacité à tenir la tournée aux dates fixées</li><li>Garantie de main-d'œuvre d'au moins 10 ans</li><li>Licence et assurance responsabilité à jour</li><li>Sécurité du chantier près des enfants : zone clôturée, horaires</li><li>Évaluations des membres pour des travaux antérieurs</li>
          </ul></div>
      </div>`)}

    ${etape(4, 'Calendrier de tournée', 'Une ville à la fois, du 7 juin au 16 juillet 2027. Aucun travail le 24 juin ni le 1er juillet.', `
      <div class="table-zone"><div class="res-tl">
        <div class="res-tl-tete">Ville</div>${semaines.map(s => `<div class="res-tl-tete">${dateFr(s, true)}</div>`).join('')}
        ${RES_TL.map(([ville, de, a, lib, c]) => `<div class="res-tl-ville">${ville}</div>${semaines.map((s, i) => i + 1 === de ? `<div class="res-tl-bloc ${c}" style="grid-column:span ${a - de}">${lib}</div>` : (i + 1 > de && i + 1 < a) ? '' : '<div></div>').join('')}`).join('')}
      </div></div>
      <div class="rangee" style="margin-top:10px;gap:14px"><span class="res-legende"><span><i style="background:var(--bleu)"></i>Confirmé avec le fournisseur</span><span><i style="background:var(--ambre)"></i>À confirmer avec le membre</span></span></div>
      <div class="rangee" style="margin-top:16px;border-top:1px solid var(--ligne);padding-top:14px">
        <button class="btn ambre" data-action="Regroupement publié : les membres de l'Estrie peuvent s'inscrire">${ic('envoyer')}Publier le regroupement</button>
        <button class="btn clair" data-action="Avis envoyé aux membres concernés">${ic('cloche')}Aviser les membres concernés</button>
        <button class="btn nu" data-action="Brouillon enregistré">Enregistrer le brouillon</button>
      </div>`)}`;
  },
  apres(racine) {
    const maj = () => {
      const choix = [...racine.querySelectorAll('#res-adm input:checked')].map(x => RES_ADMISSIBLES[+x.dataset.i]);
      const membres = new Set(choix.map(a => a.cpe)).size;
      const vol = choix.reduce((s, a) => s + a.cout, 0);
      racine.querySelector('#res-compteur').innerHTML = `<span><b class="num">${choix.length}</b> installation${choix.length > 1 ? 's' : ''} sélectionnée${choix.length > 1 ? 's' : ''} sur ${RES_ADMISSIBLES.length} · <b class="num">${membres}</b> membre${membres > 1 ? 's' : ''}</span><span>Volume estimé : <b class="num">${argent(vol)}</b></span>`;
    };
    racine.querySelector('#res-adm').addEventListener('change', maj);
    maj();
    racine.addEventListener('click', e => {
      const b = e.target.closest('[data-aller-etape]');
      if (b) racine.querySelector('#res-etape-' + b.dataset.allerEtape).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});

/* =====================================================================
   5. Bibliothèque de contenu (profil Réseau)
   ===================================================================== */
App.vue('bibliotheque', {
  rendu() {
    const g = D.grilles;
    const cat = {
      pertinentes: g.filter(x => x.origine === 'Guide 2017' && x.pertinence === 'Oui').length,
      adapter: g.filter(x => x.pertinence === 'À adapter').length,
      peu: g.filter(x => x.pertinence === 'Peu pertinent').length,
      creer: g.filter(x => x.origine !== 'Guide 2017').length
    };
    const total = g.length;
    const lignesAdapt = [['Pertinentes telles quelles', cat.pertinentes, 'ok'], ['À adapter aux CPE', cat.adapter, 'alerte'], ['Peu pertinentes', cat.peu, ''], ['À créer (propres aux CPE)', cat.creer, 'critique']];
    const pts = D.grilleToit.sections.flatMap(s => s.points.map(p => [s.titre, p]));
    const outils = D.grilleToit.outils.split(/, | et /);
    const materiaux = [['Bardeaux d’asphalte', 'Toiture', '25 à 30 ans'], ['Membrane élastomère', 'Toiture', '25 ans'], ['Brique d’argile', 'Enveloppe', '75 ans'], ['Panneau de fibrociment', 'Enveloppe', '50 ans'], ['Béton coulé', 'Fondations', '75 ans'], ['Verre thermos', 'Fenêtres', '20 à 25 ans'], ['Revêtement d’asphalte', 'Extérieur', '20 ans'], ['Surface amortissante (copeaux)', 'Aire de jeu', 'À regarnir chaque année']];
    const metiers = [...new Set([...D.deficiences.map(d => d.metier), ...Object.values(D.fiches).flatMap(f => f.metiers)])];
    const defTypes = D.deficiences.map(d => [d.titre, d.code, d.metier, d.gravite]);
    const fiches = D.guide.flatMap(s => s.fiches.map(f => [f[0], f[1], s.titre, !!D.fiches[f[0]]]));
    const actions = t => `<div class="rangee" style="gap:4px;flex-wrap:nowrap"><button class="btn nu mini" data-action="Grille « ${esc(t)} » ouverte en modification">Modifier</button><button class="btn nu mini" data-action="Grille « ${esc(t)} » dupliquée">Dupliquer</button><button class="btn nu mini" data-action="Grille « ${esc(t)} » retirée de la bibliothèque">Retirer</button></div>`;
    const pertPil = x => x.origine !== 'Guide 2017' ? pil('critique', 'À créer') : x.pertinence === 'Oui' ? pil('ok', 'Pertinente') : x.pertinence === 'À adapter' ? pil('alerte', 'À adapter') : pil('neutre', 'Peu pertinente');
    const table = (tetes, lignes) => `<div class="carte serree"><div class="table-zone"><table class="t"><thead><tr>${tetes.map(t => `<th>${t}</th>`).join('')}</tr></thead><tbody>${lignes}</tbody></table></div></div>`;
    return `${RES_CSS}
    <div class="page-tete">
      <div><h1>Bibliothèque de contenu</h1><p class="intro">Le contenu commun à tous les membres : grilles d'entretien, points de vérification, fiches du guide et listes de référence. Une modification ici s'applique à toutes les installations.</p></div>
      <div class="actions"><button class="btn clair" data-action="Historique des modifications ouvert">${ic('horloge')}Historique</button><button class="btn" data-action="Nouvelle grille d'entretien créée en brouillon">${ic('plus')}Nouvelle grille</button></div>
    </div>
    ${avisDemo("Contenu utilisé à des fins de démonstration seulement. La liste des grilles, la grille « Toit en pente » et les fiches viennent du Guide d'inspection des immeubles à l'intention des gestionnaires (RQOH, mars 2017). Les droits d'utilisation restent à confirmer, et le contenu devra être adapté aux CPE avec le Service des infrastructures de l'AQCPE.")}
    <div class="grille g-2-1">
      <section class="carte">
        <div class="carte-tete"><h2>Adaptation du contenu aux CPE</h2><span class="petit muet">${total} grilles · ${g.reduce((s, x) => s + x.points, 0)} points de vérification</span></div>
        <div class="pile serre">${lignesAdapt.map(([l, n, t]) => `<div class="res-adapt"><span>${l}</span>${barre(n / total * 100, t)}<b class="num" style="text-align:right">${n}</b></div>`).join('')}</div>
      </section>
      <section class="carte" style="background:var(--vert-pale);border-color:var(--vert)">
        <div class="carte-tete"><h2>Prochaine étape</h2>${etiq('AQCPE', 'vert')}</div>
        <p class="petit" style="color:var(--texte-2)">Rédiger les ${cat.creer} grilles propres aux CPE et réviser les ${cat.adapter} grilles à adapter avec le Service des infrastructures, puis les faire valider par un comité de directions.</p>
      </section>
    </div>
    <div data-onglets class="pile">
      ${onglets([['grilles', `Grilles d'entretien (${total})`], ['points', 'Points de vérification'], ['outils', 'Outils'], ['materiaux', 'Matériaux'], ['metiers', 'Corps de métier'], ['deficiences', 'Déficiences types'], ['fiches', 'Fiches du guide']], 'grilles')}
      <div data-panneau="grilles" class="pile">${table(['Grille', 'Saison', 'Points', 'Origine', 'Pertinence pour un CPE', 'Actions'], g.map(x => `<tr><td class="principal-cel">${x.titre}<span class="sous">${x.fiches.length ? 'Fiches ' + x.fiches.join(', ') : 'Aucune fiche liée'}</span></td><td>${x.saison}</td><td class="num">${x.points}</td><td>${x.origine === 'Guide 2017' ? etiq('Guide 2017', 'bleu') : etiq('Propre aux CPE', 'vert')}</td><td>${pertPil(x)}</td><td>${actions(x.titre)}</td></tr>`).join(''))}</div>
      <div data-panneau="points" class="pile" hidden>
        <p class="petit muet">Exemple : les ${pts.length} points de la grille « Toit en pente ».</p>
        ${table(['N°', 'Section', 'Point de vérification', ''], pts.map(([s, p], i) => `<tr><td class="num">${i + 1}</td><td style="white-space:nowrap">${s}</td><td>${p}</td><td><button class="btn nu mini" data-action="Point de vérification ouvert en modification">Modifier</button></td></tr>`).join(''))}
      </div>
      <div data-panneau="outils" class="pile" hidden>
        <div class="carte"><p class="petit muet" style="margin-bottom:10px">Outils cités dans la grille « Toit en pente ».</p><div class="rangee" style="gap:8px">${outils.map(o => etiq(o.charAt(0).toUpperCase() + o.slice(1), 'bleu')).join('')}<button class="btn nu mini" data-action="Outil ajouté à la liste">${ic('plus')}Ajouter</button></div></div>
      </div>
      <div data-panneau="materiaux" class="pile" hidden>${table(['Matériau', 'Composante', 'Durée de vie indicative'], materiaux.map(([m, c, d]) => `<tr><td class="principal-cel">${m}</td><td>${c}</td><td>${d}</td></tr>`).join(''))}<p class="petit muet">Durées de vie indicatives inventées pour la démonstration; à valider avec l'AQCPE.</p></div>
      <div data-panneau="metiers" class="pile" hidden><div class="carte serree"><div class="liste">${metiers.map(m => `<div class="ligne"><div class="ico gris">${ic('outil')}</div><div class="corps"><b>${m}</b><span>${D.fournisseurs.filter(f => resCleMetier(f) !== 'autre' && resCleMetier(f) === resCleMetier({ metier: m })).length} fournisseur(s) agréé(s) lié(s)</span></div></div>`).join('')}</div></div></div>
      <div data-panneau="deficiences" class="pile" hidden>${table(['Déficience type', 'Code', 'Corps de métier', 'Priorité suggérée'], defTypes.map(([t, c, m, gr]) => `<tr><td class="principal-cel">${t}</td><td>${etiq(c, 'bleu')}<span class="sous">${D.CODES[c]}</span></td><td>${m}</td><td>${pil(D.GRAVITES[gr], gr)}</td></tr>`).join(''))}</div>
      <div data-panneau="fiches" class="pile" hidden>${table(['N°', 'Fiche', 'Section', 'Contenu'], fiches.map(([n, t, s, c]) => `<tr class="cliquable" ${aller('fiche', { id: n })}><td class="num">${n}</td><td class="principal-cel">${t}</td><td>${s}</td><td>${c ? pil('ok', 'Fiche complète') : pil('neutre', 'Sommaire seulement')}</td></tr>`).join(''))}</div>
    </div>`;
  }
});

/* =====================================================================
   6. Membres et accès (profil Réseau)
   ===================================================================== */
const RES_MEMBRES = [
  { nom: 'CPE Les Petits Bâtisseurs', region: 'Estrie', inst: 3, connexion: '2026-11-18', pct: 92, c: [1, 1, 1] },
  { nom: 'CPE Pomme de Pin-Pin', region: 'Estrie', inst: 2, connexion: '2026-11-16', pct: 78, c: [1, 1, 1] },
  { nom: 'CPE Les Trottinettes du Lac', region: 'Estrie', inst: 1, connexion: '2026-11-09', pct: 64, c: [1, 1, 0] },
  { nom: 'CPE Bricolo-Bricoli', region: 'Estrie', inst: 2, connexion: '2026-10-21', pct: 41, c: [1, 0, 1] },
  { nom: 'CPE La Cabane à Sons', region: 'Estrie', inst: 1, connexion: '2026-11-12', pct: 70, c: [1, 1, 0] },
  { nom: 'CPE Les Grenouilles Curieuses', region: 'Montérégie', inst: 4, connexion: '2026-11-17', pct: 85, c: [1, 1, 1] },
  { nom: 'CPE Le Nid des Hiboux Lunaires', region: 'Montérégie', inst: 2, connexion: '2026-09-30', pct: 28, c: [0, 1, 0] },
  { nom: 'CPE Les Petites Boussoles', region: 'Centre-du-Québec', inst: 1, connexion: '2026-11-03', pct: 55, c: [1, 0, 0] }
];

App.vue('membres', {
  rendu() {
    const consent = (v, l) => v ? pil('ok', l) : `<span class="pil neutre sans-point" style="text-decoration:line-through">${l}</span>`;
    return `${RES_CSS}
    <div class="page-tete">
      <div><h1>Membres et accès</h1><p class="intro">Les CPE qui utilisent Solage, l'avancement de leur carnet et les partages qu'ils ont acceptés. Chaque membre garde le contrôle de ses consentements.</p></div>
      <div class="actions"><button class="btn clair" data-action="Liste des membres exportée">${ic('telecharger')}Exporter</button><button class="btn" data-action="Invitation envoyée au membre">${ic('envoyer')}Inviter un membre</button></div>
    </div>
    <div class="avis">${ic('info')}<div class="petit">Noms de CPE et chiffres fictifs. La coop voit l'avancement du carnet et les consentements, jamais le contenu d'un carnet sans l'autorisation du membre.</div></div>
    <div class="grille g4">
      <div class="carte stat"><span class="lib">CPE inscrits</span><span class="val">214</span><span class="tend bon">+12 ce mois-ci</span></div>
      <div class="carte stat"><span class="lib">Actifs dans les 30 derniers jours</span><span class="val">163 <small>· 76 %</small></span>${barre(76, 'ok')}</div>
      <div class="carte stat"><span class="lib">Complétion moyenne des carnets</span><span class="val">64 %</span>${barre(64, 'alerte')}</div>
      <div class="carte stat"><span class="lib">Partage agrégé accepté (coop)</span><span class="val">91 %</span>${barre(91, 'ok')}</div>
    </div>
    <section class="carte serree">
      <div class="carte-tete"><h2>Membres</h2>
        <div class="recherche" style="display:block;min-width:220px;max-width:300px;flex:1">${ic('loupe')}<input id="res-m-rech" type="search" placeholder="Chercher un CPE ou une région" aria-label="Chercher un membre"></div></div>
      <div class="table-zone"><table class="t">
        <thead><tr><th>CPE</th><th>Région</th><th class="num">Installations</th><th>Dernière connexion</th><th>Carnet complété</th><th>Consentements</th></tr></thead>
        <tbody id="res-m-liste">${RES_MEMBRES.map((m, i) => `<tr class="cliquable" data-cherche="${esc((m.nom + ' ' + m.region).toLowerCase())}" ${i === 0 ? aller('installations') : `data-action="Fiche du membre ${esc(m.nom)} ouverte"`}>
          <td><span class="principal-cel">${m.nom}</span><span class="sous">${i === 0 ? 'Membre depuis ' + D.cpe.membreDepuis : 'Nom fictif'}</span></td>
          <td>${m.region}</td><td class="num">${m.inst}</td>
          <td>${joursAvant(m.connexion) === 0 ? pil('ok', "Aujourd'hui") : -joursAvant(m.connexion) > 30 ? pil('alerte', dateFr(m.connexion, true)) : dateFr(m.connexion, true)}</td>
          <td style="min-width:150px"><div class="res-barre-cel"><b>${m.pct}%</b>${barre(m.pct, m.pct >= 75 ? 'ok' : m.pct >= 50 ? 'alerte' : 'critique')}</div></td>
          <td><div class="rangee" style="gap:4px;flex-wrap:nowrap">${consent(m.c[0], 'Coop')}${consent(m.c[1], 'AQCPE')}${consent(m.c[2], 'Courtier')}</div></td></tr>`).join('')}
          <tr id="res-m-vide" hidden><td colspan="6" class="muet">Aucun membre ne correspond à cette recherche.</td></tr></tbody>
      </table></div>
    </section>`;
  },
  apres(racine) {
    const champ = racine.querySelector('#res-m-rech');
    champ.addEventListener('input', () => {
      const q = champ.value.trim().toLowerCase();
      let n = 0;
      racine.querySelectorAll('#res-m-liste tr[data-cherche]').forEach(tr => { const ok = !q || tr.dataset.cherche.includes(q); tr.hidden = !ok; if (ok) n++; });
      racine.querySelector('#res-m-vide').hidden = n > 0;
    });
  }
});

/* =====================================================================
   7. Portefeuille assuré (profil Courtier)
   ===================================================================== */
const RES_IMMEUBLES_FICTIFS = [
  { id: 'x1', nom: 'Installation du Verger', membre: 'CPE Pomme de Pin-Pin', ville: 'Coaticook', sante: 81, toit: 2003, insp: '2026-08-27', recl: [1, 9400], recu: '2026-09-02', risque: 'Modéré', renouv: '2027-01-01', comps: [['Toiture en bardeaux', 2003, 4], ['Chauffage à air pulsé', 2015, 2], ["Système d'alarme incendie", 2012, 2], ['Aire de jeu', 2019, 1]] },
  { id: 'x2', nom: 'Installation de la Baie', membre: 'CPE Les Trottinettes du Lac', ville: 'Magog', sante: 77, toit: 2005, insp: '2026-06-11', recl: [0, 0], recu: '2026-06-20', risque: 'Faible', renouv: '2027-06-01', comps: [['Toiture en bardeaux', 2005, 3], ['Chauffe-eau', 2020, 1], ["Système d'alarme incendie", 2016, 2], ['Plomberie', 1999, 3]] },
  { id: 'x3', nom: 'Installation principale', membre: 'CPE Bricolo-Bricoli', ville: 'Sherbrooke', sante: 58, toit: 2001, insp: '2025-10-02', recl: [2, 37800], recu: '2025-10-20', risque: 'Élevé', renouv: '2027-02-01', comps: [['Toiture en bardeaux', 2001, 5], ['Chauffe-eau', 2012, 4], ['Entrée électrique', 1988, 3], ['Drain de fondation', 1988, 4]] },
  { id: 'x4', nom: 'Installation du Marais', membre: 'CPE Les Grenouilles Curieuses', ville: 'East Angus', sante: 72, toit: 2002, insp: '2026-09-30', recl: [1, 4200], recu: '2026-10-08', risque: 'Modéré', renouv: '2027-07-01', comps: [['Toiture en bardeaux', 2002, 4], ['Thermopompe', 2018, 2], ["Système d'alarme incendie", 2010, 3], ['Aire de jeu', 2017, 2]] }
];
const RES_RISQUE = { Faible: 'ok', Modéré: 'alerte', Élevé: 'critique' };

function resImmeubles() {
  const limite = resPlusJours(AUJ, -5 * 365);
  const deD = D.installations.map(i => {
    const toitC = D.composantes.find(c => c.inst === i.id && c.cat === 'Toiture');
    const recs = D.reclamations.filter(r => r.inst === i.id && r.date >= limite);
    return {
      id: i.id, nom: i.nom, membre: D.cpe.nom, ville: i.ville, sante: i.sante, toit: toitC ? toitC.annee : null, insp: i.inspectionAnnuelle,
      recl: [recs.length, recs.reduce((s, r) => s + r.reclame, 0)], recu: { erables: '2026-11-03', ruisseau: '2026-10-01', gare: '2026-10-20' }[i.id],
      risque: i.id === 'erables' ? 'Modéré' : 'Faible', renouv: D.assurance.echeance, deD: true
    };
  });
  return [...deD, ...RES_IMMEUBLES_FICTIFS];
}

function resModaleRapport(im) {
  const an = +AUJ.slice(0, 4);
  let comps, insps, recs, prev;
  if (im.deD) {
    comps = D.composantes.filter(c => c.inst === im.id && (['Toiture', 'Mécanique', 'Sécurité', 'Électricité'].includes(c.cat) || c.etat >= 4)).slice(0, 7).map(c => [c.nom, c.annee, c.etat]);
    insps = D.inspections.filter(x => x.inst === im.id && x.statut !== 'À planifier').map(x => [x.type, x.date, x.deficiences]);
    recs = D.reclamations.filter(r => r.inst === im.id).map(r => [r.type, r.date, r.reclame, r.statut]);
    const t = D.taches.filter(x => x.inst === im.id && x.date <= AUJ);
    prev = [t.filter(x => x.fait).length, t.length];
  } else {
    comps = im.comps;
    insps = [['Inspection annuelle', im.insp, im.risque === 'Élevé' ? 6 : 2]];
    recs = im.recl[0] ? [[im.risque === 'Élevé' ? "Dégâts d'eau" : 'Tempête de vent', resPlusJours(im.insp, -400), im.recl[1], 'Réglé']] : [];
    prev = im.risque === 'Élevé' ? [3, 7] : [6, 7];
  }
  const pctPrev = prev[1] ? Math.round(prev[0] / prev[1] * 100) : 100;
  App.modale(`Rapport de l'immeuble`, `
    <div class="rangee entre" style="align-items:flex-start"><div><h3>${im.nom}</h3><div class="petit muet">${im.membre} · ${im.ville}</div></div><div class="rangee" style="gap:6px">${pil(RES_RISQUE[im.risque], 'Risque ' + im.risque.toLowerCase())}${etiq('Indice ' + im.sante + ' / 100', 'bleu')}</div></div>
    <p class="petit muet">Rapport partagé par le membre le ${dateFr(im.recu)}. Résumé produit par Solage à partir du carnet de santé.</p>
    <div><div class="sur" style="margin-bottom:4px">Composantes clés</div><div class="table-zone"><table class="t"><thead><tr><th>Composante</th><th class="num">Année</th><th>État</th></tr></thead>
      <tbody>${comps.map(([n, a, e]) => `<tr><td>${n}</td><td class="num">${a}<span class="sous">${an - a} ans</span></td><td>${pil(D.ETATS[e][1], D.ETATS[e][0])}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="grille g2" style="gap:14px">
      <div><div class="sur" style="margin-bottom:4px">Inspections</div><div class="liste">${insps.map(([t, d, n]) => `<div class="ligne" style="padding:7px 0"><div class="corps"><b>${t}</b><span>${dateFr(d)} · ${n} déficience${n > 1 ? 's' : ''}</span></div></div>`).join('')}</div></div>
      <div><div class="sur" style="margin-bottom:4px">Réclamations</div><div class="liste">${recs.map(([t, d, m, s]) => `<div class="ligne" style="padding:7px 0"><div class="corps"><b>${t}</b><span>${dateFr(d)} · ${argent(m)} réclamés · ${s}</span></div></div>`).join('') || '<div class="ligne"><div class="corps"><span>Aucune réclamation.</span></div></div>'}</div></div>
    </div>
    <div><div class="rangee entre" style="margin-bottom:6px"><div class="sur">Entretien préventif</div>${pctPrev >= 80 ? pil('ok', 'À jour') : pil('alerte', 'En retard')}</div>${barre(pctPrev, pctPrev >= 80 ? 'ok' : 'alerte')}<p class="petit muet" style="margin-top:4px">${prev[0]} tâches faites sur ${prev[1]} prévues à ce jour cette saison.</p></div>`,
    `<button class="btn clair" data-fermer>Fermer</button><button class="btn" data-fermer data-action="Rapport de l'immeuble téléchargé en PDF">${ic('telecharger')}Télécharger le PDF</button>`);
}

App.vue('portefeuille', {
  rendu() {
    const l = resImmeubles();
    const renouv = l.filter(x => joursAvant(x.renouv) >= 0 && joursAvant(x.renouv) <= 90).length;
    const recents = l.filter(x => joursAvant(x.recu) >= -365).length;
    return `${RES_CSS}
    <div class="page-tete">
      <div><h1>Portefeuille assuré</h1><p class="intro">L'état des immeubles de CPE que vous assurez, tel que documenté dans leur carnet de santé. Utile pour préparer un renouvellement ou répondre à un assureur.</p></div>
      <div class="actions"><button class="btn clair" data-action="Portefeuille exporté">${ic('telecharger')}Exporter</button></div>
    </div>
    <div class="avis">${ic('cadenas')}<div>Vous voyez seulement les immeubles dont le membre a accepté de partager le rapport de l'immeuble avec vous. Le membre peut retirer ce partage en tout temps.</div></div>
    <div class="grille g3">
      <div class="carte stat"><span class="lib">Immeubles suivis</span><span class="val">${l.length}</span><span class="tend neutre">${new Set(l.map(x => x.membre)).size} CPE assurés</span></div>
      <div class="carte stat"><span class="lib">Rapports reçus depuis moins d'un an</span><span class="val">${recents} <small>/ ${l.length}</small></span>${barre(recents / l.length * 100, 'ok')}</div>
      <div class="carte stat"><span class="lib">Renouvellements d'ici 90 jours</span><span class="val">${renouv}</span><span class="tend neutre">Prochain : ${dateFr(l.map(x => x.renouv).filter(d => joursAvant(d) >= 0).sort()[0])}</span></div>
    </div>
    <section class="carte serree">
      <div class="carte-tete"><h2>Immeubles</h2><span class="petit muet">Cliquez sur un immeuble pour voir son rapport</span></div>
      <div class="table-zone"><table class="t">
        <thead><tr><th>Immeuble</th><th>Indice de santé</th><th class="num">Âge de la toiture</th><th>Dernière inspection</th><th class="num">Réclamations (5 ans)</th><th>Rapport reçu</th><th>Renouvellement</th><th>Risque</th></tr></thead>
        <tbody>${l.map(x => `<tr class="cliquable" data-immeuble="${x.id}">
          <td><span class="principal-cel">${x.nom}</span><span class="sous">${x.membre} · ${x.ville}</span></td>
          <td style="min-width:130px"><div class="res-barre-cel"><b>${x.sante}</b>${barre(x.sante, resCouleurIndice(x.sante))}</div></td>
          <td class="num">${x.toit ? (+AUJ.slice(0, 4) - x.toit) + ' ans' : '<span class="muet">Locateur</span>'}</td>
          <td>${dateFr(x.insp, true)} ${x.insp.slice(0, 4)}</td>
          <td class="num">${x.recl[0]}${x.recl[0] ? `<span class="sous">${argent(x.recl[1])}</span>` : ''}</td>
          <td>${dateFr(x.recu, true)} ${x.recu.slice(0, 4)}</td>
          <td>${echeance(x.renouv)}</td>
          <td>${pil(RES_RISQUE[x.risque], x.risque)}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>
    <p class="petit muet">Niveau de risque indicatif calculé par Solage (état de la toiture, entretien préventif, réclamations). Il ne remplace pas l'analyse de l'assureur. Immeubles et CPE fictifs.</p>`;
  },
  apres(racine) {
    racine.addEventListener('click', e => {
      const tr = e.target.closest('[data-immeuble]');
      if (tr) resModaleRapport(resImmeubles().find(x => x.id === tr.dataset.immeuble));
    });
  }
});

/* =====================================================================
   8. Ma tournée (profil Inspection)
   ===================================================================== */
const RES_VISITES = [
  { heure: '8 h 30', inst: 'Installation du Verger', cpe: 'CPE Pomme de Pin-Pin', ville: 'Coaticook', type: 'Inspection annuelle', etat: ['ok', 'Terminée'] },
  { heure: '11 h 00', inst: 'Installation des Érables', cpe: 'CPE Les Petits Bâtisseurs', ville: 'Sherbrooke', type: 'Suivi de déficience : toiture', etat: ['info', 'En cours'] },
  { heure: '14 h 30', inst: 'Installation de la Baie', cpe: 'CPE Les Trottinettes du Lac', ville: 'Magog', type: 'Inspection annuelle', etat: ['neutre', 'À venir'] }
];

function resTel(titre, sousTitre, corps, actif, horsLigne) {
  const barre4 = [['calendrier', 'Tournée'], ['loupe', 'Inspection'], ['photo', 'Photos'], ['menu', 'Plus']];
  return `<div class="tel"><div class="tel-ecran">
    <div class="tel-etat"><span>9 h 41</span><span class="rangee" style="gap:4px">${horsLigne ? `${ic('horsligne').replace('<svg', '<svg width="13" height="13"')}Hors ligne` : 'LTE'} · 82 %</span></div>
    <div class="tel-tete"><div style="font-size:.7rem;opacity:.75">${sousTitre}</div><h3>${titre}</h3></div>
    <div class="tel-corps">${corps}</div>
    <div class="tel-barre">${barre4.map(([i, l], k) => `<span class="${k === actif ? 'actif' : ''}">${ic(i)}${l}</span>`).join('')}</div>
  </div></div>`;
}

App.vue('tournee', {
  rendu() {
    const g = D.grilleToit;
    const point = g.sections[1].points[0];
    const codes = Object.entries(D.CODES);
    const telA = resTel('Tournée du jour', 'Mercredi 18 novembre', `
      <div class="rangee entre"><span class="res-mini">3 visites · 74 km</span>${pil('ok', 'Synchronisé')}</div>
      ${RES_VISITES.map((v, i) => `<div class="res-tel-carte" style="${i === 1 ? 'border-color:var(--bleu);box-shadow:inset 3px 0 0 var(--bleu)' : ''}">
        <div class="rangee entre"><b>${v.heure}</b>${pil(v.etat[0], v.etat[1])}</div>
        <div><b>${v.inst}</b><div class="res-mini">${v.ville} · ${v.type}</div></div>
        ${i === 1 ? `<button class="btn mini bloc" data-action="Inspection reprise au point 3">${ic('droite')}Reprendre</button>` : i === 2 ? `<button class="btn mini clair bloc" data-action="Itinéraire ouvert dans l'application de navigation">${ic('carte')}Itinéraire</button>` : ''}
      </div>`).join('')}
      <button class="btn vert bloc" data-action="Tournée démarrée : 3 visites téléchargées pour le mode hors ligne">${ic('telephone')}Démarrer la tournée</button>`, 0);
    const telB = resTel('Toit en pente', 'Installation des Érables · point 3 sur 12', `
      <div class="pile serre" style="gap:4px"><div class="rangee entre res-mini"><span>Section « Toit »</span><span>25 %</span></div>${barre(25)}</div>
      <div class="res-tel-carte"><div class="res-mini">Point de vérification</div><p style="font-size:.8rem">${point}</p></div>
      <div class="pile serre" style="gap:6px" id="res-codes" role="radiogroup" aria-label="Code">
        ${codes.map(([k, l]) => `<button class="res-code ${k === 'DE' ? 'actif' : ''}" data-code="${k}" role="radio" aria-checked="${k === 'DE'}"><b>${k}</b>${l}</button>`).join('')}
      </div>
      <div class="res-mini" id="res-code-choix" aria-live="polite">Code retenu : DE, ${D.CODES.DE.toLowerCase()}</div>
      <div class="rangee" style="gap:6px;flex-wrap:nowrap">
        <button class="btn mini clair" style="flex:1;justify-content:center" data-action="Appareil photo ouvert">${ic('photo')}Photo (2)</button>
        <button class="btn mini clair" style="flex:1;justify-content:center" data-action="Dictée démarrée : parlez, Solage transcrit">${ic('crayon')}Dicter une note</button>
      </div>
      <div class="res-tel-carte" style="background:var(--bleu-tres-pale)"><div class="res-mini">Note dictée</div><p style="font-size:.78rem">Bardeaux qui frisent sur le versant sud, environ le tiers de la surface. Aucune infiltration visible dans l'entretoit.</p></div>
      <div class="res-mini rangee" style="gap:4px">${ic('carte').replace('<svg', '<svg width="13" height="13"')}Versant sud, au-dessus du local 12</div>
      <button class="btn bloc" data-action="Point enregistré; point suivant affiché">Point suivant ${ic('droite')}</button>`, 1);
    const telC = resTel('Synchronisation', 'Données sur l\'appareil', `
      <div class="res-horsligne">${ic('horsligne')}<div>Aucun réseau. Vos saisies sont enregistrées sur l'appareil.</div></div>
      <div class="sur">En attente de synchronisation</div>
      ${[['Installation du Verger', 'Inspection annuelle · 42 points', '8 photos'], ['Installation des Érables', 'Suivi de déficience · 3 points sur 12', '2 photos'], ['Installation des Cèdres', 'Inspection annuelle (hier) · 38 points', '11 photos']].map(([n, t, ph]) => `<div class="res-tel-carte"><div class="rangee entre" style="flex-wrap:nowrap"><b>${n}</b>${pil('alerte', 'En attente')}</div><div class="res-mini">${t} · ${ph}</div></div>`).join('')}
      <div class="sur">Photos en file d'attente (21)</div>
      <div class="photos" style="grid-template-columns:repeat(3,1fr);gap:6px">${photo('Versant sud', 'toit')}${photo('Gouttière', 'toit')}${photo('Aire de jeu', 'jeu')}</div>
      <div class="res-mini">Envoi automatique au retour du réseau, en Wi-Fi seulement (réglage).</div>
      <button class="btn clair bloc" data-action="Synchronisation lancée : elle se fera dès le retour du réseau">${ic('telecharger')}Synchroniser maintenant</button>`, 2, true);
    return `${RES_CSS}
    <div class="page-tete">
      <div><div class="sur">Service des infrastructures · AQCPE</div><h1>Ma tournée</h1>
        <p class="intro">Vos visites du jour, sur téléphone ou sur tablette. Les grilles se remplissent sur place, même sans réseau, et le rapport est prêt pour le membre dès la synchronisation.</p></div>
      <div class="actions"><button class="btn clair" data-action="Tournée de demain téléchargée pour le mode hors ligne">${ic('telecharger')}Préparer demain</button><button class="btn vert" ${aller('inspection', { id: 'i1' })}>${ic('rapport')}Ouvrir le rapport d'inspection</button></div>
    </div>
    <div class="pile" style="gap:26px">
      <div class="grille g3" style="align-items:start">
        <section class="carte serree">
          <div class="carte-tete"><h2>Mercredi 18 novembre</h2><span class="petit muet">3 visites</span></div>
          <div class="liste">${RES_VISITES.map((v, i) => `<div class="ligne">
            <div style="width:52px;flex:none" class="fort num petit">${v.heure}</div>
            <div class="corps"><b>${v.inst}</b><span>${v.ville} · ${v.type}</span></div>${pil(v.etat[0], v.etat[1])}</div>`).join('')}</div>
        </section>
        <section class="carte">
          <div class="carte-tete"><h2>Synchronisation</h2>${pil('alerte', '3 en attente')}</div>
          <dl class="cv" style="grid-template-columns:minmax(0,1fr) auto"><dt>Dernière synchronisation</dt><dd>7 h 52</dd><dt>Inspections en attente</dt><dd class="num">3</dd><dt>Photos en file d'attente</dt><dd class="num">21</dd><dt>Espace utilisé</dt><dd>146 Mo</dd></dl>
        </section>
        <section class="carte" style="background:var(--vert-pale);border-color:var(--vert)">
          <div class="rangee" style="flex-wrap:nowrap;margin-bottom:8px"><div class="ico vert">${ic('horsligne')}</div><h2>Sur le terrain, sans réseau</h2></div>
          <p class="petit" style="color:var(--texte-2)">Au sous-sol, dans un entretoit ou en région, le réseau manque souvent. Les grilles, les photos et les notes dictées sont enregistrées sur l'appareil, puis synchronisées dès le retour du réseau. La même inspection se poursuit sur téléphone, sur tablette ou sur le Web.</p>
        </section>
      </div>
      <div class="res-tels">
        <div class="res-tel-cadre"><span class="sur">a · Tournée du jour</span>${telA}</div>
        <div class="res-tel-cadre"><span class="sur">b · Inspection en cours</span>${telB}</div>
        <div class="res-tel-cadre"><span class="sur">c · Hors ligne</span>${telC}</div>
      </div>
    </div>`;
  },
  apres(racine) {
    const zone = racine.querySelector('#res-codes');
    zone.addEventListener('click', e => {
      const b = e.target.closest('[data-code]');
      if (!b) return;
      zone.querySelectorAll('[data-code]').forEach(x => { x.classList.toggle('actif', x === b); x.setAttribute('aria-checked', x === b); });
      racine.querySelector('#res-code-choix').textContent = `Code retenu : ${b.dataset.code}, ${D.CODES[b.dataset.code].toLowerCase()}`;
    });
  }
});
