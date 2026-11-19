/* Solage — prototype cliquable. Coquille, navigation et utilitaires.
   Aucune donnée réelle, aucun appel réseau : tout est simulé. */

const AUJ = '2026-11-18'; // « aujourd'hui » figé pour la cohérence des données de démonstration

/* ---------- Icônes (traits, 24 × 24) ---------- */
const ICONES = {
  accueil: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  batiment: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2"/>',
  calendrier: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  grille: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2"/><path d="M9 12l2 2 4-4"/><path d="M9 17h6"/>',
  loupe: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  outil: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  tendance: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  bouclier: '<path d="M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  parapluie: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v7a2 2 0 0 0 4 0"/><path d="M12 3V2"/>',
  dossier: '<path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  livre: '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',
  panier: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12h11.2L21 7H6"/>',
  camion: '<path d="M2 6h11v10H2z"/><path d="M13 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  rapport: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  reglages: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.2l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0-1.2-2.8H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 2.8-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0 1.2 2.8h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  cloche: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M10.5 20a1.7 1.7 0 0 0 3 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  droite: '<path d="M9 6l6 6-6 6"/>',
  gauche: '<path d="M15 6l-6 6 6 6"/>',
  coche: '<path d="M5 12l5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  alerte: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  photo: '<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/>',
  carte: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  utilisateurs: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  telecharger: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  envoyer: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
  eau: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',
  feu: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-2 1.500-3 3.500-3 5.500C10.500 10 9 8.500 9 7c-2 2-4 4.500-4 8a7 7 0 0 0 7 7z"/>',
  eclair: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  thermo: '<path d="M14 14.800V5a2 2 0 0 0-4 0v9.800a4 4 0 1 0 4 0z"/>',
  horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  dollar: '<path d="M12 2v20M17 6.500C17 4.600 15 4 12 4S7 5 7 7.500 9.500 11 12 12s5 1.500 5 4-2 3.500-5 3.500-5-.600-5-2.500"/>',
  filtre: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  horsligne: '<path d="M2 8.800a15 15 0 0 1 4.200-2.700M22 8.800a15 15 0 0 0-9-3.700M5.500 12.600a10 10 0 0 1 3-1.900M18.500 12.600a10 10 0 0 0-4-2.200M8.800 16.200a5 5 0 0 1 6.400 0"/><path d="M12 20v.500M3 3l18 18"/>',
  etoile: '<path d="M12 3l2.800 5.700 6.200.900-4.500 4.400 1 6.200-5.500-2.900-5.500 2.900 1-6.200L3 9.600l6.200-.900z"/>',
  telephone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  crayon: '<path d="M4 20l1-4L16.500 4.500a2.100 2.100 0 0 1 3 3L8 19z"/>',
  oeil: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  graphique: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  feuille: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
  flocon: '<path d="M12 2v20M3.300 7l17.400 10M20.700 7L3.300 17"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.500 1.500M17.500 17.500L19 19M5 19l1.500-1.500M17.500 6.500L19 5"/>',
  toit: '<path d="M2 12l10-8 10 8"/><path d="M5 12v8h14v-8"/>',
  jeu: '<circle cx="12" cy="5" r="2"/><path d="M4 21l8-12 8 12"/><path d="M8 15h8"/>',
  lien: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  cadenas: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13v2M15 13v2M2 14h2M20 14h2"/><circle cx="12" cy="3" r="1"/>',
  cible: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  sortie: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
function ic(nom) {
  const d = (ICONES[nom] || ICONES.info).replace(/(\d)\.(\d)00/g, '$1.$2');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

/* ---------- Utilitaires d'affichage ---------- */
const fmtArgent = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const fmtNombre = new Intl.NumberFormat('fr-CA');
function argent(n) { return fmtArgent.format(n); }
function nombre(n) { return fmtNombre.format(n); }
function dateFr(iso, court) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('fr-CA', court ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'long', year: 'numeric' });
}
function joursAvant(iso) { return Math.round((new Date(iso + 'T12:00:00') - new Date(AUJ + 'T12:00:00')) / 864e5); }
function echeance(iso) {
  const j = joursAvant(iso);
  if (j < 0) return pil('critique', `En retard de ${-j} j`);
  if (j === 0) return pil('alerte', "Aujourd'hui");
  if (j <= 30) return pil('alerte', `Dans ${j} j`);
  return pil('neutre', dateFr(iso, true));
}
function pil(type, texte) { return `<span class="pil ${type}">${texte}</span>`; }
function etiq(texte, couleur) { return `<span class="etiq ${couleur || ''}">${texte}</span>`; }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function initiales(nom) { return nom.split(/\s+/).map(m => m[0]).slice(0, 2).join('').toUpperCase(); }
function photo(legende, type) { return `<div class="photo ${type || ''}"><div>${ic('photo')}<br>${legende || 'Photo'}</div></div>`; }
function barre(pct, type) { return `<div class="barre ${type || ''}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`; }
function jauge(pct, libelle, couleur) {
  const c = 2 * Math.PI * 54, v = c * pct / 100;
  return `<div class="jauge"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="54" fill="none" stroke="#e6eaf2" stroke-width="12"/><circle cx="66" cy="66" r="54" fill="none" stroke="${couleur || 'var(--vert)'}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${v} ${c}"/></svg><div class="centre"><div><b>${pct}</b><span>${libelle || 'sur 100'}</span></div></div></div>`;
}
/* Attributs de navigation à placer sur n'importe quel élément cliquable */
function aller(route, params) { return `data-aller="${route}"${params ? ` data-params='${esc(JSON.stringify(params))}'` : ''}`; }
/* Bandeau obligatoire au-dessus de tout contenu tiré du guide */
function avisDemo(texte) {
  return `<div class="avis demo">${ic('alerte')}<div>${texte || "Contenu utilisé à des fins de démonstration seulement. Extrait du Guide d'inspection des immeubles à l'intention des gestionnaires (RQOH, mars 2017). Les droits d'utilisation restent à confirmer avant toute diffusion."}</div></div>`;
}
function logoSolage(taille) {
  const t = taille || 38;
  return `<svg class="logo-solage" width="${t}" height="${t}" viewBox="0 0 38 38" aria-hidden="true"><rect width="38" height="38" rx="10" fill="#ffaa01"/><path d="M8 19l11-9 11 9" fill="none" stroke="#17244a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18v7h14v-7" fill="none" stroke="#17244a" stroke-width="3" stroke-linejoin="round"/><rect x="7" y="27" width="24" height="4" rx="2" fill="#3b8831"/></svg>`;
}

/* ---------- Rôles et menus ---------- */
const ROLES = {
  dg: {
    nom: 'Direction de CPE', personne: 'Dominique Tremblay', titre: 'Direction générale · CPE Les Petits Bâtisseurs', accueil: 'accueil', avatar: '',
    menu: [
      ['', [['accueil', 'Tableau de bord', 'accueil'], ['installations', 'Mes installations', 'batiment']]],
      ['Entretien', [['calendrier', 'Calendrier', 'calendrier'], ['grilles', "Grilles d'entretien", 'grille'], ['inspections', 'Inspections', 'loupe'], ['travaux', 'Déficiences et travaux', 'outil', 8]]],
      ['Planification', [['maintien', "Maintien d'actifs", 'tendance'], ['conformite', 'Conformité', 'bouclier', 4]]],
      ['Assurance', [['assurance', 'Police et courtier', 'parapluie'], ['reclamations', 'Réclamations', 'rapport']]],
      ['Ressources', [['guide', 'Guide du bâtiment', 'livre'], ['documents', 'Documents', 'dossier'], ['fournisseurs', 'Fournisseurs agréés', 'camion'], ['achats', 'Achats regroupés', 'panier', 3]]],
      ['', [['rapports', 'Rapports', 'graphique'], ['parametres', 'Paramètres', 'reglages'], ['apropos', 'À propos du prototype', 'info']]]
    ]
  },
  insp: {
    nom: 'Inspection (AQCPE)', personne: 'Camille Roy', titre: 'Inspection en bâtiment · Service des infrastructures', accueil: 'tournee', avatar: 'vert',
    menu: [
      ['', [['tournee', 'Ma tournée', 'telephone'], ['inspections', 'Inspections', 'loupe'], ['installations', 'Installations', 'batiment']]],
      ['Ressources', [['grilles', "Grilles d'entretien", 'grille'], ['guide', 'Guide du bâtiment', 'livre']]],
      ['', [['apropos', 'À propos du prototype', 'info']]]
    ]
  },
  reseau: {
    nom: 'Réseau (william.coop · AQCPE)', personne: 'Claude Gagnon', titre: 'Administration du réseau', accueil: 'reseau', avatar: 'ambre',
    menu: [
      ['', [['reseau', 'Portrait du parc', 'carte'], ['regroupements', 'Regroupements de travaux', 'panier'], ['installations', 'Installations', 'batiment']]],
      ['Administration', [['bibliotheque', 'Bibliothèque de contenu', 'grille'], ['guide', 'Guide du bâtiment', 'livre'], ['fournisseurs', 'Fournisseurs agréés', 'camion'], ['membres', 'Membres et accès', 'utilisateurs']]],
      ['', [['rapports', 'Rapports', 'graphique'], ['apropos', 'À propos du prototype', 'info']]]
    ]
  },
  courtier: {
    nom: "Courtier d'assurance", personne: 'Alex Bouchard', titre: 'Courtage en assurance de dommages', accueil: 'portefeuille', avatar: '',
    menu: [
      ['', [['portefeuille', 'Portefeuille assuré', 'parapluie'], ['reclamations', 'Réclamations', 'rapport']]],
      ['', [['apropos', 'À propos du prototype', 'info']]]
    ]
  }
};

/* ---------- Application ---------- */
const App = {
  vues: {},
  role: 'dg',
  route: 'connexion',
  params: {},

  /* Enregistre une vue : App.vue('nom', { titre, parent, rendu(params) -> html, apres(racine, params) }) */
  vue(nom, def) { this.vues[nom] = def; },

  aller(route, params) {
    this.params = params || {};
    if (location.hash.slice(1) === route) this.afficher(); else location.hash = route;
  },

  toast(texte) {
    const z = document.getElementById('toasts');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = ic('coche') + `<div>${texte}<div class="petit" style="opacity:.7">Action simulée dans le prototype</div></div>`;
    z.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  },

  modale(titre, corps, pied) {
    this.fermerModale();
    const v = document.createElement('div');
    v.className = 'voile'; v.id = 'voile';
    v.innerHTML = `<div class="modale" role="dialog" aria-modal="true"><div class="modale-tete"><h2>${titre}</h2><button class="fermer" data-fermer aria-label="Fermer">${ic('x')}</button></div><div class="modale-corps">${corps}</div><div class="modale-pied">${pied || `<button class="btn clair" data-fermer>Fermer</button>`}</div></div>`;
    document.body.appendChild(v);
  },
  fermerModale() { const v = document.getElementById('voile'); if (v) v.remove(); },

  navHtml() {
    const r = ROLES[this.role];
    const actif = (this.vues[this.route] && this.vues[this.route].parent) || this.route;
    return r.menu.map(([groupe, liens]) =>
      (groupe ? `<div class="nav-groupe">${groupe}</div>` : '<div style="height:8px"></div>') +
      liens.map(([route, lib, icone, compte]) =>
        `<button class="nav-lien ${actif === route ? 'actif' : ''}" data-aller="${route}">${ic(icone)}<span>${lib}</span>${compte ? `<span class="compte">${compte}</span>` : ''}</button>`
      ).join('')
    ).join('');
  },

  coquilleHtml(contenu) {
    const r = ROLES[this.role];
    return `
    <div class="coquille">
      <aside class="lateral" id="lateral">
        <div class="marque" data-aller="${r.accueil}">${logoSolage()}<div><div class="marque-nom">Solage</div><div class="marque-sous">Le carnet de santé des bâtiments</div></div></div>
        <nav class="nav" aria-label="Navigation principale">${this.navHtml()}</nav>
        <div class="lateral-pied">Une initiative proposée par
          <div class="partenaires"><span class="pastille"><img src="img/logo_williamcoop.svg" alt="william.coop"></span><span class="pastille aq" title="Partenariat proposé, à confirmer">AQCPE</span></div>
        </div>
      </aside>
      <div class="principal">
        <header class="haut">
          <button class="burger" id="burger" aria-label="Ouvrir le menu">${ic('menu')}</button>
          <div class="recherche">${ic('loupe')}<input id="recherche" type="search" placeholder="Chercher une composante, une tâche, un document…" aria-label="Recherche"></div>
          <div class="haut-droite">
            <select class="select-role" id="role" aria-label="Changer de profil de démonstration">
              ${Object.entries(ROLES).map(([k, v]) => `<option value="${k}" ${k === this.role ? 'selected' : ''}>Profil : ${v.nom}</option>`).join('')}
            </select>
            <button class="bouton-icone" data-aller="notifications" aria-label="Notifications">${ic('cloche')}<span class="point"></span></button>
            <div class="avatar ${r.avatar}">${initiales(r.personne)}</div>
            <div class="qui"><b>${r.personne}</b><small>${r.titre}</small></div>
            <button class="bouton-icone" data-aller="connexion" aria-label="Se déconnecter" title="Se déconnecter">${ic('sortie')}</button>
          </div>
        </header>
        <main class="contenu" id="contenu">${contenu}</main>
      </div>
    </div>`;
  },

  afficher() {
    let route = location.hash.slice(1) || 'connexion';
    if (!this.vues[route]) route = this.vues[ROLES[this.role].accueil] ? ROLES[this.role].accueil : 'connexion';
    this.route = route;
    const v = this.vues[route];
    const racine = document.getElementById('app');
    let html;
    try { html = v.rendu(this.params || {}); }
    catch (e) { console.error(e); html = `<div class="avis rouge">${ic('alerte')}<div>Cette vue n'a pas pu s'afficher : ${esc(e.message)}</div></div>`; }
    racine.innerHTML = v.pleinEcran ? html : this.coquilleHtml(html);
    document.title = 'Solage';
    window.scrollTo(0, 0);
    const zone = document.getElementById('contenu') || racine;
    if (v.apres) { try { v.apres(zone, this.params || {}); } catch (e) { console.error(e); } }
  },

  demarrer() {
    window.addEventListener('hashchange', () => this.afficher());
    document.addEventListener('click', e => {
      const f = e.target.closest('[data-fermer]');
      if (f || e.target.id === 'voile') { this.fermerModale(); if (!f || !f.dataset.action) { if (!f || !f.dataset.aller) return; } }
      const a = e.target.closest('[data-aller]');
      if (a) {
        e.preventDefault();
        let p = {};
        if (a.dataset.params) { try { p = JSON.parse(a.dataset.params); } catch (_) {} }
        document.getElementById('lateral')?.classList.remove('ouvert');
        this.aller(a.dataset.aller, p);
        return;
      }
      const act = e.target.closest('[data-action]');
      if (act) { e.preventDefault(); this.toast(act.dataset.action); return; }
      const o = e.target.closest('[data-onglet]');
      if (o) {
        const zone = o.closest('[data-onglets]');
        zone.querySelectorAll(':scope > .onglets > [data-onglet], :scope > .rangee [data-onglet], :scope > .segments > [data-onglet]').forEach(b => b.classList.toggle('actif', b === o));
        zone.querySelectorAll(':scope > [data-panneau]').forEach(p => { p.hidden = p.dataset.panneau !== o.dataset.onglet; });
        return;
      }
      if (e.target.closest('#burger')) document.getElementById('lateral').classList.toggle('ouvert');
    });
    document.addEventListener('change', e => {
      if (e.target.id === 'role') { this.role = e.target.value; this.aller(ROLES[this.role].accueil); }
      const c = e.target.closest('.coche');
      if (c && e.target.type === 'checkbox') c.classList.toggle('fait', e.target.checked);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.fermerModale();
      if (e.key === 'Enter' && e.target.id === 'recherche') this.toast('Recherche de « ' + esc(e.target.value) + ' »');
    });
    /* Liens directs pour la présentation : index.html?profil=reseau&id=erables&onglet=composantes#installation */
    const q = new URLSearchParams(location.search);
    if (ROLES[q.get('profil')]) this.role = q.get('profil');
    if (q.get('id')) this.params = { id: q.get('id') };
    this.afficher();
    if (q.get('onglet')) document.querySelector('[data-onglet="' + q.get('onglet') + '"]')?.click();
    if (q.get('y')) { const c = document.getElementById('contenu'); if (c) c.style.marginTop = (-q.get('y')) + 'px'; } // décale le contenu, pour les captures d'écran
  }
};

/* Onglets : conteneur [data-onglets] avec, comme enfants directs, une barre .onglets (boutons [data-onglet="x"])
   et des panneaux [data-panneau="x"] (ajouter l'attribut hidden sur les panneaux inactifs). */
function onglets(liste, actif) {
  return `<div class="onglets">${liste.map(([cle, lib]) => `<button class="onglet ${cle === actif ? 'actif' : ''}" data-onglet="${cle}">${lib}</button>`).join('')}</div>`;
}
