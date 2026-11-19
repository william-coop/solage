// Vérifie que chaque vue se rend sans erreur (hors navigateur). Usage : node verifier-vues.js [fichier-de-vues.js ...]
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = { console, Intl, Date, Math, JSON, setTimeout, location: { hash: '' }, window: {}, document: { getElementById: () => null, addEventListener() {}, createElement: () => ({}) } };
vm.createContext(ctx);
const base = ['js/app.js', 'js/donnees.js', 'js/donnees-guide.js'];
const vues = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(__dirname, 'js/vues')).map(f => 'js/vues/' + f);
for (const f of [...base, ...vues]) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx, { filename: f });
const res = vm.runInContext(`(() => { const out = []; for (const role of Object.keys(ROLES)) { App.role = role; for (const [n, v] of Object.entries(App.vues)) { try { const h = v.rendu({}); if (typeof h !== 'string' || /undefined|NaN|\\[object Object\\]/.test(h)) out.push('ATTENTION ' + n + ' (' + role + ') : contient undefined/NaN/[object Object] ou ne retourne pas une chaîne'); else if (role === 'dg') out.push('ok ' + n + ' (' + h.length + ' car.)'); } catch (e) { out.push('ERREUR ' + n + ' (' + role + ') : ' + e.message); } } } return out.join('\\n'); })()`, ctx);
console.log(res);
