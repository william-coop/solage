/* Vues : guide du bâtiment (sommaire), fiche descriptive. */

const COULEUR_SAISON = { Printemps: 'vert', Automne: 'ambre', Hiver: 'bleu', 'Été': 'ambre' };
function etiqSaisons(texte) {
  if (!texte) return '';
  return texte.split(/, | et /).map(s => { const n = s.charAt(0).toUpperCase() + s.slice(1); return etiq(n, COULEUR_SAISON[n] || ''); }).join(' ');
}

App.vue('guide', {
  rendu() {
    const complet = Object.keys(D.fiches);
    return `
    <div class="page-tete"><div><h1>Guide du bâtiment</h1><p class="intro">Les fiches expliquent chaque composante : à quoi elle sert, quoi surveiller, qui appeler. Chaque fiche est reliée à sa grille d'entretien et aux composantes de vos installations.</p></div>
      <div class="actions"><div class="recherche" style="display:block;min-width:260px">${ic('loupe')}<input id="rech-guide" type="search" placeholder="Chercher dans le guide" aria-label="Chercher dans le guide"></div></div></div>
    ${avisDemo("Contenu utilisé à des fins de démonstration seulement. Le sommaire et deux fiches viennent du Guide d'inspection des immeubles à l'intention des gestionnaires (RQOH, mars 2017). Les droits d'utilisation restent à confirmer, et le contenu devra être mis à jour et adapté aux CPE avant toute diffusion.")}
    <div class="grille g-2-1">
      <div class="pile">
        ${D.guide.map(s => `<div class="carte serree">
          <div class="carte-tete"><div class="rangee"><div class="ico">${ic(s.icone)}</div><h2>${s.num} ${s.titre}</h2></div><span class="petit muet">${s.fiches.length} fiches</span></div>
          <div class="liste">${s.fiches.map(([num, titre, saison]) => `<div class="ligne cliquable" ${aller('fiche', { id: num })}>
            <span class="etiq bleu num" style="min-width:52px;justify-content:center">${num}</span>
            <div class="corps"><b>${titre}</b></div>${etiqSaisons(saison)}${complet.includes(num) ? pil('ok', 'Fiche complète') : ''}${ic('droite').replace('<svg', '<svg width="16" height="16" style="color:var(--texte-3)"')}
          </div>`).join('')}</div></div>`).join('')}
      </div>
      <div class="pile">
        <div class="carte" style="border-color:var(--vert);background:var(--vert-pale)">
          <div class="carte-tete"><h2>Fiches à créer pour les CPE</h2>${etiq('Proposition', 'vert')}</div>
          <p class="petit" style="color:var(--texte-2)">Le guide de 2017 a été conçu pour l'habitation communautaire. Ces sujets n'y figurent pas et seraient rédigés avec le Service des infrastructures de l'AQCPE.</p>
          <ul class="petit" style="margin:10px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:5px">
            <li>Aire de jeu extérieure et surfaces amortissantes</li><li>Cuisine de production, hotte commerciale</li><li>Sécurité des enfants : eau chaude, prises, rangement des produits</li><li>Salles d'hygiène et tables à langer</li><li>Qualité de l'air, ventilation et confort d'été</li><li>Eau potable : plomb et entretien des points d'eau</li><li>Contrôle des accès et barrières de la cour</li>
          </ul>
        </div>
        <div class="carte"><div class="carte-tete"><h2>Demander à l'assistant</h2>${etiq('Idée', 'ambre')}</div>
          <div class="pile serre">
            <div class="carte plate" style="background:var(--bleu-tres-pale);padding:10px 12px"><span class="petit">« Il y a de la buée entre les vitres d'une fenêtre. Est-ce que c'est grave? »</span></div>
            <div class="rangee" style="flex-wrap:nowrap;align-items:flex-start"><div class="ico vert">${ic('robot')}</div><p class="petit" style="color:var(--texte-2)">La buée entre les verres indique que le verre thermos a atteint la fin de sa vie utile. Ce n'est pas urgent, mais prévoyez le remplacement. <a href="#" ${aller('fiche', { id: '2.2.5' })}>Voir la fiche 2.2.5 Fenêtres</a></p></div>
            <div class="champ"><input id="q-assistant" type="text" placeholder="Posez une question sur votre bâtiment" aria-label="Question à l'assistant"></div>
            <button class="btn clair mini" data-action="Question envoyée à l'assistant">${ic('envoyer')}Envoyer</button>
            <p class="petit muet">L'assistant répond à partir des fiches du guide et cite ses sources. Il ne remplace pas un professionnel.</p>
          </div>
        </div>
        <div class="carte"><div class="carte-tete"><h2>Lexique</h2></div>
          <dl class="pile serre petit" style="margin:0"><div><b>Solage</b><div class="muet">Terme familier pour les fondations d'un bâtiment.</div></div><div><b>Solin</b><div class="muet">Pièce, souvent métallique, qui assure l'étanchéité à la jonction de deux surfaces.</div></div><div><b>Soffite</b><div class="muet">Dessous d'un avant-toit, souvent ventilé.</div></div><div><b>Déficience</b><div class="muet">Défaut ou désordre constaté sur une composante.</div></div></dl>
        </div>
      </div>
    </div>`;
  }
});

App.vue('fiche', {
  parent: 'guide',
  rendu(p) {
    const id = p.id || '2.3.2';
    const f = D.fiches[id];
    let section = D.guide.find(s => s.fiches.some(x => x[0] === id));
    const meta = section ? section.fiches.find(x => x[0] === id) : null;
    const fil = `<div class="fil"><button ${aller('guide')}>Guide du bâtiment</button>${ic('droite').replace('<svg', '<svg width="12" height="12"')}<span>${section ? section.num + ' ' + section.titre : ''}</span></div>`;
    if (!f) {
      return `<div class="page-tete"><div>${fil}<h1>${id} ${meta ? meta[1] : 'Fiche'}</h1><p class="intro">${meta && meta[2] ? 'Période suggérée pour l’entretien : ' + meta[2].toLowerCase() + '.' : ''}</p></div></div>
      <div class="carte pile" style="align-items:flex-start"><div class="ico ambre">${ic('livre')}</div><h2>Fiche non reproduite dans le prototype</h2>
        <p style="color:var(--texte-2);max-width:65ch">Le prototype ne contient que deux fiches complètes, à titre d'exemple : 2.3.2 Toit en pente et 2.2.1 Fondations et dalles inférieures. Dans l'application, chaque fiche du guide aurait la même présentation.</p>
        <div class="rangee"><button class="btn" ${aller('fiche', { id: '2.3.2' })}>Voir la fiche « Toit en pente »</button><button class="btn clair" ${aller('fiche', { id: '2.2.1' })}>Voir la fiche « Fondations »</button></div></div>`;
    }
    const comps = D.composantes.filter(c => c.fiche === id);
    const g = D.grille(f.grille);
    return `
    <div class="page-tete"><div>${fil}<h1>${f.num} ${f.titre}</h1><p class="intro">Période suggérée pour l'entretien : ${f.saisons.join(' et ').toLowerCase()}.</p></div>
      <div class="actions"><button class="btn clair" data-action="Fiche ajoutée à vos favoris">${ic('etoile')}Ajouter aux favoris</button><button class="btn" ${aller('grille', { id: f.grille })}>${ic('grille')}Ouvrir la grille d'entretien</button></div></div>
    ${avisDemo()}
    <div class="grille g-2-1">
      <article class="carte pile">
        <div class="photo large ${f.photoType}"><div>${ic('photo')}<br>Photo de la composante</div></div>
        <div class="prose">
          <h2>Description</h2>
          ${f.description.map(t => `<p>${t}</p>`).join('')}
          ${f.sousTitre ? `<h3>${f.sousTitre}</h3><p>${f.sousTexte}</p>` : ''}
          <h2 style="margin-top:8px">Déficiences possibles</h2>
          <p>${f.deficiences}</p>
        </div>
        <div><h3 style="margin-bottom:8px">Exemples de déficiences</h3><div class="photos">${f.photos.map(l => photo(l, f.photoType)).join('')}</div></div>
        <div class="grille g2">
          <div class="carte plate" style="background:var(--bleu-tres-pale)"><div class="sur">Professionnel</div><p style="margin-top:4px">${f.professionnel}</p></div>
          <div class="carte plate" style="background:var(--bleu-tres-pale)"><div class="sur">Corps de métier</div><ul style="margin:4px 0 0;padding-left:18px">${f.metiers.map(m => `<li>${m}</li>`).join('')}</ul></div>
        </div>
        <p class="petit muet">Source : Guide d'inspection des immeubles à l'intention des gestionnaires, RQOH, mise à jour de mars 2017, p. ${f.pages}. Texte abrégé pour la démonstration.</p>
      </article>
      <div class="pile">
        <div class="carte"><div class="carte-tete"><h2>Repères</h2></div>
          <dl class="cv" style="grid-template-columns:1fr">${f.reperes.map(([k, v]) => `<div><dt class="petit">${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          <div class="rangee" style="margin-top:12px">${f.saisons.map(s => etiq(s, COULEUR_SAISON[s])).join('')}</div></div>
        <div class="carte serree"><div class="carte-tete"><h2>Dans vos installations</h2></div><div class="liste">
          ${comps.map(c => `<div class="ligne cliquable" ${aller('installation', { id: c.inst })}><div class="corps"><b>${c.nom}</b><span>${D.inst(c.inst).nom} · installée en ${c.annee} · fin de vie utile vers ${D.finDeVie(c)}</span></div>${pil(D.ETATS[c.etat][1], D.ETATS[c.etat][0])}</div>`).join('') || '<div class="ligne"><div class="corps"><span>Aucune composante liée à cette fiche.</span></div></div>'}
        </div></div>
        <div class="carte"><div class="carte-tete"><h2>Grille d'entretien liée</h2></div>
          <div class="rangee" style="flex-wrap:nowrap"><div class="ico">${ic('grille')}</div><div><b>${g.titre}</b><div class="petit muet">${g.points} points · ${g.saison}</div></div></div>
          <button class="btn clair bloc" style="margin-top:12px" ${aller('grille', { id: g.id })}>Remplir la grille</button></div>
        <div class="carte" style="border-color:var(--ambre);background:var(--ambre-pale)"><div class="carte-tete"><h2>Besoin d'un fournisseur?</h2>${etiq('william.coop', 'ambre')}</div>
          <p class="petit" style="color:var(--texte-2)">Des fournisseurs agréés de votre région offrent ce service à un tarif négocié pour les membres.</p>
          <button class="btn ambre bloc" style="margin-top:10px" ${aller('fournisseurs')}>Voir les fournisseurs agréés</button></div>
      </div>
    </div>`;
  }
});
