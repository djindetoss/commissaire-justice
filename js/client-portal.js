'use strict';

/* ═══════════════════════════════════════════
   ESPACE CLIENT — client-portal.js
   Commissaire de Justice · Maître Rokia ADJAGBA
═══════════════════════════════════════════ */

/* ── Mock user accounts ── */
const USERS = {
  'client@example.fr': {
    password:    'Client2026!',
    id:          'CLI-00142',
    prenom:      'Sophie',
    nom:         'Marchand',
    email:       'client@example.fr',
    telephone:   '06 12 34 56 78',
    adresse:     '14 rue du Faubourg, 59000 Lille',
    type:        'Particulier',
    ref:         'CLI-00142',
    depuis:      'Mars 2025',
  },
  'pro@cabinet.fr': {
    password:    'ProCDJ2026!',
    id:          'PRO-00078',
    prenom:      'Jean-Baptiste',
    nom:         'Renard',
    email:       'pro@cabinet.fr',
    telephone:   '03 20 00 00 00',
    adresse:     '87 bd de la Liberté, 59800 Lille',
    type:        'Professionnel',
    societe:     'Cabinet Renard & Associés',
    ref:         'PRO-00078',
    depuis:      'Janvier 2024',
  },
};

/* ── Mock data ── */
function getMockData(userId) {
  const isClient = userId === 'CLI-00142';

  const constats = isClient ? [
    { ref: 'CON-2026-0421', type: 'État des lieux', date: '08/04/2026', adresse: '23 rue du Pont, 59300 Valenciennes', statut: 'disponible', pages: 14 },
    { ref: 'CON-2026-0387', type: 'Constat internet', date: '15/03/2026', adresse: 'URL : www.example.com', statut: 'disponible', pages: 8 },
    { ref: 'CON-2026-0301', type: 'Avant travaux', date: '20/02/2026', adresse: '4 impasse des Lilas, 59000 Lille', statut: 'disponible', pages: 22 },
    { ref: 'CON-2025-1194', type: 'Nuisance sonore', date: '10/11/2025', adresse: '8 allée des Roses, 59700 Marcq-en-Barœul', statut: 'disponible', pages: 6 },
  ] : [
    { ref: 'CON-2026-0435', type: 'Constat de sinistre', date: '12/04/2026', adresse: '45 rue du Commerce, 59100 Roubaix', statut: 'disponible', pages: 18 },
    { ref: 'CON-2026-0412', type: 'Après travaux', date: '02/04/2026', adresse: '45 rue du Commerce, 59100 Roubaix', statut: 'disponible', pages: 20 },
    { ref: 'CON-2026-0389', type: 'État des lieux de sortie', date: '14/03/2026', adresse: '12 av. Jean Jaurès, 59500 Douai', statut: 'disponible', pages: 16 },
    { ref: 'CON-2026-0350', type: 'Constat internet', date: '28/02/2026', adresse: 'LinkedIn : profil contrefaisant', statut: 'disponible', pages: 10 },
    { ref: 'CON-2025-1088', type: 'Propriété intellectuelle', date: '05/09/2025', adresse: 'Site web litigieux', statut: 'disponible', pages: 12 },
  ];

  const documents = isClient ? [
    { ref: 'ACT-2026-0180', intitule: 'Commandement de payer — M. X', type: 'Signification', date: '01/04/2026', format: 'PDF' },
    { ref: 'ACT-2026-0142', intitule: 'Assignation en référé — TJ Lille', type: 'Actes judiciaires', date: '18/03/2026', format: 'PDF' },
    { ref: 'COR-2026-0098', intitule: 'Lettre de mise en demeure — M. Durand', type: 'Courriers', date: '05/02/2026', format: 'PDF' },
    { ref: 'DEC-2025-0441', intitule: 'Jugement TJ Lille — 15/11/2025', type: 'Décisions', date: '20/11/2025', format: 'PDF' },
  ] : [
    { ref: 'ACT-2026-0201', intitule: 'Signification de décision — Cour d\'appel', type: 'Signification', date: '10/04/2026', format: 'PDF' },
    { ref: 'ACT-2026-0188', intitule: 'Assignation en justice — SARL Alpha', type: 'Actes judiciaires', date: '28/03/2026', format: 'PDF' },
    { ref: 'ACT-2026-0170', intitule: 'Commandement de quitter les lieux', type: 'Signification', date: '15/03/2026', format: 'PDF' },
    { ref: 'COR-2026-0120', intitule: 'Mise en demeure — Impayé facture 2024-089', type: 'Courriers', date: '20/02/2026', format: 'PDF' },
    { ref: 'DEC-2025-0480', intitule: 'Injonction de payer — 22/12/2025', type: 'Décisions', date: '02/01/2026', format: 'PDF' },
  ];

  const demandes = isClient ? [
    {
      ref: 'DEM-2026-0088', titre: 'Constat avant travaux — Appartement 59', type: 'constat-travaux',
      date: '28/04/2026', statut: 'en-cours', urgence: 'normale',
      etapes: ['Reçue', 'Examinée', 'Planifiée', 'Réalisée', 'Rapport envoyé'],
      etapeCurrent: 2,
      description: 'Constat avant travaux de rénovation appartement 2e étage, 23 rue du Pont.',
    },
    {
      ref: 'DEM-2026-0061', titre: 'Recouvrement amiable — Facture impayée', type: 'recouvrement-amiable',
      date: '10/03/2026', statut: 'traite', urgence: 'normale',
      etapes: ['Reçue', 'Examinée', 'Mise en demeure', 'Amiable', 'Clôturée'],
      etapeCurrent: 5,
      description: 'Recouvrement d\'une créance de 3 450 € — débiteur M. X.',
    },
    {
      ref: 'DEM-2026-0039', titre: 'Constat internet — Copie non autorisée', type: 'constat-internet',
      date: '18/02/2026', statut: 'traite', urgence: 'prioritaire',
      etapes: ['Reçue', 'Examinée', 'Réalisée', 'Rapport envoyé'],
      etapeCurrent: 4,
      description: 'Constat d\'une page web reproduisant illégalement du contenu propriétaire.',
    },
  ] : [
    {
      ref: 'DEM-2026-0095', titre: 'Signification d\'assignation — SARL Beta', type: 'signification-assignation',
      date: '02/05/2026', statut: 'attente', urgence: 'urgente',
      etapes: ['Reçue', 'Examinée', 'Signifiée', 'PV transmis'],
      etapeCurrent: 0,
      description: 'Assignation en référé-provision devant le TJ de Lille.',
    },
    {
      ref: 'DEM-2026-0081', titre: 'Recouvrement judiciaire — Factures 2025', type: 'recouvrement-judiciaire',
      date: '15/04/2026', statut: 'en-cours', urgence: 'normale',
      etapes: ['Reçue', 'Examinée', 'Procédure engagée', 'Saisie ordonnée', 'Recouvré'],
      etapeCurrent: 2,
      description: 'Recouvrement judiciaire de 18 750 € sur 3 factures impayées.',
    },
    {
      ref: 'DEM-2026-0058', titre: 'Expulsion — Local commercial abandonné', type: 'local-abandonne',
      date: '22/03/2026', statut: 'en-cours', urgence: 'normale',
      etapes: ['Reçue', 'Examinée', 'Constats réalisés', 'Procédure lancée', 'Clôturée'],
      etapeCurrent: 3,
      description: 'Reprise d\'un local commercial laissé à l\'abandon depuis 8 mois.',
    },
    {
      ref: 'DEM-2026-0021', titre: 'Saisie-attribution — Compte bancaire', type: 'saisie',
      date: '08/02/2026', statut: 'traite', urgence: 'prioritaire',
      etapes: ['Reçue', 'Examinée', 'Saisie pratiquée', 'Fonds obtenus'],
      etapeCurrent: 4,
      description: 'Saisie-attribution sur compte courant pour créance 6 200 €.',
    },
  ];

  const paiements = isClient ? [
    { ref: 'FAC-2026-0312', intitule: 'Constat état des lieux — CON-2026-0421', date: '10/04/2026', montant: '185,00 €', statut: 'paye' },
    { ref: 'FAC-2026-0280', intitule: 'Recouvrement amiable — DEM-2026-0061', date: '15/03/2026', montant: '95,00 €', statut: 'paye' },
    { ref: 'FAC-2026-0340', intitule: 'Constat avant travaux — DEM-2026-0088', date: '05/05/2026', montant: '220,00 €', statut: 'en-attente' },
  ] : [
    { ref: 'FAC-2026-0325', intitule: 'Signification assignation — DEM-2026-0095', date: '05/05/2026', montant: '145,00 €', statut: 'en-attente' },
    { ref: 'FAC-2026-0298', intitule: 'Recouvrement judiciaire — tranche 1', date: '20/04/2026', montant: '450,00 €', statut: 'paye' },
    { ref: 'FAC-2026-0265', intitule: 'Constat sinistre — CON-2026-0435', date: '18/03/2026', montant: '280,00 €', statut: 'paye' },
    { ref: 'FAC-2026-0320', intitule: 'Honoraires recouvrement — DEM-2026-0021', date: '01/05/2026', montant: '620,00 €', statut: 'en-attente' },
  ];

  const messages = isClient ? [
    { id: 1, de: 'Étude CDJ', initiales: 'CDJ', sujet: 'Rapport constat prêt — CON-2026-0421', apercu: 'Votre rapport de constat est disponible dans votre espace client…', date: 'Aujourd\'hui', lu: false },
    { id: 2, de: 'Étude CDJ', initiales: 'CDJ', sujet: 'Accusé de réception — DEM-2026-0088', apercu: 'Nous avons bien reçu votre demande de constat avant travaux…', date: '28 avr.', lu: false },
    { id: 3, de: 'Étude CDJ', initiales: 'CDJ', sujet: 'Dossier recouvrement clôturé — DEM-2026-0061', apercu: 'Nous avons le plaisir de vous informer que la créance a été recouvrée…', date: '25 mars', lu: true },
  ] : [
    { id: 1, de: 'Étude CDJ', initiales: 'CDJ', sujet: 'Urgence — Assignation reçue — DEM-2026-0095', apercu: 'Nous avons bien pris en charge votre demande urgente. La signification…', date: 'Aujourd\'hui', lu: false },
    { id: 2, de: 'Étude CDJ', initiales: 'CDJ', sujet: 'Rapport constat sinistre — CON-2026-0435', apercu: 'Veuillez trouver ci-joint le rapport complet du constat de sinistre réalisé…', date: '13 avr.', lu: false },
    { id: 3, de: 'Étude CDJ', initiales: 'CDJ', sujet: 'Point d\'avancement — DEM-2026-0081', apercu: 'La procédure de recouvrement judiciaire est en cours. Voici un état des lieux…', date: '20 avr.', lu: true },
  ];

  const notifications = isClient ? [
    { icon: '📋', titre: 'Constat disponible', desc: 'Votre rapport CON-2026-0421 est prêt à télécharger.', time: 'Il y a 2h', lu: false },
    { icon: '🔄', titre: 'Demande mise à jour', desc: 'Votre demande DEM-2026-0088 est désormais planifiée.', time: 'Il y a 1 jour', lu: false },
    { icon: '✅', titre: 'Recouvrement réussi', desc: 'La créance liée à DEM-2026-0061 a été recouvrée.', time: 'Il y a 5 jours', lu: true },
  ] : [
    { icon: '⚡', titre: 'Demande urgente reçue', desc: 'Votre demande DEM-2026-0095 est prise en charge en urgence.', time: 'Aujourd\'hui', lu: false },
    { icon: '📋', titre: 'Rapport disponible', desc: 'Le rapport de sinistre CON-2026-0435 est disponible.', time: 'Il y a 3h', lu: false },
    { icon: '💳', titre: 'Facture émise', desc: 'La facture FAC-2026-0325 est en attente de règlement (145 €).', time: 'Il y a 1 jour', lu: true },
  ];

  return { constats, documents, demandes, paiements, messages, notifications };
}


/* ═══════════════════════════════════════════
   APP STATE
═══════════════════════════════════════════ */
let currentUser = null;
let data        = null;

/* ── Persistent session ── */
function saveSession(user) {
  try { localStorage.setItem('cdj_session', JSON.stringify({ email: user.email, ts: Date.now() })); } catch {}
}
function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem('cdj_session') || 'null');
    if (!s) return null;
    if (Date.now() - s.ts > 8 * 3600 * 1000) { localStorage.removeItem('cdj_session'); return null; }
    return s.email;
  } catch { return null; }
}
function clearSession() {
  try { localStorage.removeItem('cdj_session'); } catch {}
}


/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${icons[type] || '💬'}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}


/* ═══════════════════════════════════════════
   AUTH
═══════════════════════════════════════════ */
function login(email, password) {
  const user = USERS[email.toLowerCase().trim()];
  if (!user || user.password !== password) return false;
  currentUser = user;
  data = getMockData(user.id);
  return true;
}

function logout() {
  clearSession();
  currentUser = null;
  data = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-password').value = '';
  showToast('Vous avez été déconnecté.', 'info');
}

/* ── Fill demo ── */
window.fillDemo = function(email, pw) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = pw;
  document.getElementById('login-email').dispatchEvent(new Event('input'));
};

/* ── Login form ── */
document.getElementById('login-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const email    = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('btn-login');
  const errEl    = document.getElementById('login-error');

  if (!email || !password) {
    errEl.textContent = 'Veuillez saisir vos identifiants.';
    errEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Connexion…';
  errEl.style.display = 'none';

  setTimeout(() => {
    if (login(email, password)) {
      const remember = document.getElementById('remember')?.checked;
      if (remember) saveSession(currentUser);
      initDashboard();
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('dashboard').style.display   = 'flex';
      showToast(`Bienvenue, ${currentUser.prenom} !`, 'success');
    } else {
      errEl.textContent = '❌ Email ou mot de passe incorrect.';
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Accéder à mon espace →';
    }
  }, 800);
});

/* ── Toggle password visibility ── */
document.getElementById('toggle-pw')?.addEventListener('click', () => {
  const input = document.getElementById('login-password');
  const btn   = document.getElementById('toggle-pw');
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
});

/* ── Forgot password ── */
window.showForgotMsg = function(e) {
  e.preventDefault();
  showToast('Contactez l\'étude : etude@ra-cdj.fr pour réinitialiser votre mot de passe.', 'info');
};

/* ── Logout ── */
document.getElementById('logout-btn')?.addEventListener('click', logout);


/* ═══════════════════════════════════════════
   DASHBOARD INIT
═══════════════════════════════════════════ */
function initDashboard() {
  updateHeaderUser();
  renderKPIs();
  renderOverview();
  renderConstats();
  renderDocuments();
  renderDemandes();
  renderPaiements();
  renderMessages();
  renderProfile();
  initSidebarNav();
  initUserDropdown();
  initSidebarToggle();
  showSection('overview');
}

/* ── Header user info ── */
function updateHeaderUser() {
  const initials = (currentUser.prenom[0] + currentUser.nom[0]).toUpperCase();
  const el       = document.getElementById('dash-avatar');
  const nameEl   = document.getElementById('dash-user-name');
  const refEl    = document.getElementById('dash-user-ref');
  if (el)     el.textContent     = initials;
  if (nameEl) nameEl.textContent = `${currentUser.prenom} ${currentUser.nom}`;
  if (refEl)  refEl.textContent  = `Réf. ${currentUser.ref}`;

  const welcomeEl = document.getElementById('welcome-msg');
  if (welcomeEl) welcomeEl.textContent = `Bonjour ${currentUser.prenom}, voici un résumé de votre espace.`;
}

/* ── KPIs ── */
function renderKPIs() {
  const inProgress = data.demandes.filter(d => d.statut === 'en-cours').length;
  const unread     = data.messages.filter(m => !m.lu).length;
  document.getElementById('notif-badge').textContent = unread + data.notifications.filter(n => !n.lu).length;

  const kpis = [
    { icon: '📋', value: data.constats.length,   label: 'Constats disponibles' },
    { icon: '📁', value: data.documents.length,  label: 'Documents disponibles' },
    { icon: '🔄', value: inProgress,              label: 'Demandes en cours' },
    { icon: '💬', value: unread,                  label: 'Messages non lus' },
  ];
  const grid = document.getElementById('kpi-grid');
  if (!grid) return;
  grid.innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-body">
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-label">${k.label}</div>
      </div>
    </div>`).join('');
}

/* ── Overview panels ── */
function renderOverview() {
  /* Derniers constats */
  const ocEl = document.getElementById('overview-constats');
  if (ocEl) {
    ocEl.innerHTML = data.constats.slice(0, 4).map(c => `
      <div class="mini-item" onclick="showSection('constats')">
        <div class="mini-icon">📋</div>
        <div class="mini-body">
          <div class="mini-title">${c.type}</div>
          <div class="mini-sub">${c.ref} · ${c.date}</div>
        </div>
        <div class="mini-status"><span class="status-badge status-disponible">✓ Disponible</span></div>
      </div>`).join('');
  }

  /* Demandes en cours */
  const odEl = document.getElementById('overview-demandes');
  if (odEl) {
    const active = data.demandes.filter(d => d.statut === 'en-cours' || d.statut === 'attente').slice(0, 4);
    odEl.innerHTML = active.length ? active.map(d => `
      <div class="mini-item" onclick="showSection('demandes')">
        <div class="mini-icon">🔄</div>
        <div class="mini-body">
          <div class="mini-title">${d.titre}</div>
          <div class="mini-sub">${d.ref} · ${d.date}</div>
        </div>
        <div class="mini-status">${statusBadge(d.statut)}</div>
      </div>`).join('')
    : '<p style="font-size:13.5px;color:#718096;padding:8px 0">Aucune demande en cours.</p>';
  }

  /* Notifications */
  const nlEl = document.getElementById('notifications-list');
  if (nlEl) {
    nlEl.innerHTML = data.notifications.map(n => `
      <div class="notif-item ${n.lu ? '' : 'notif-unread'}">
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-title">${n.titre}</div>
          <div class="notif-desc">${n.desc}</div>
        </div>
        <div class="notif-time">${n.time}</div>
      </div>`).join('');
  }

  /* Sidebar badges */
  const badgeConstats = document.getElementById('badge-constats');
  const badgeDocs     = document.getElementById('badge-documents');
  const badgeDem      = document.getElementById('badge-demandes');
  if (badgeConstats) badgeConstats.textContent = data.constats.length;
  if (badgeDocs)     badgeDocs.textContent     = data.documents.length;
  const enCours = data.demandes.filter(d => d.statut === 'en-cours' || d.statut === 'attente').length;
  if (badgeDem && enCours > 0) badgeDem.textContent = enCours;
}

/* ── Constats table ── */
function renderConstats(filter = '') {
  const tbody = document.getElementById('constats-tbody');
  const empty = document.getElementById('constats-empty');
  if (!tbody) return;

  let list = data.constats;
  if (filter) list = list.filter(c =>
    c.ref.toLowerCase().includes(filter) ||
    c.type.toLowerCase().includes(filter) ||
    c.adresse.toLowerCase().includes(filter)
  );

  if (!list.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = list.map(c => `
    <tr>
      <td class="td-ref">${c.ref}</td>
      <td class="td-title">${c.type}</td>
      <td>${c.date}</td>
      <td>${c.adresse}</td>
      <td><span class="status-badge status-disponible">✓ Disponible</span></td>
      <td class="action-btns">
        <button class="btn-view" onclick="previewDoc('constat','${c.ref}')">👁 Consulter</button>
        <button class="btn-dl" onclick="downloadDoc('${c.ref}')">⬇ Télécharger</button>
      </td>
    </tr>`).join('');
}

/* ── Documents table ── */
function renderDocuments(filter = '') {
  const tbody = document.getElementById('docs-tbody');
  const empty = document.getElementById('docs-empty');
  if (!tbody) return;

  let list = data.documents;
  if (filter) list = list.filter(d =>
    d.ref.toLowerCase().includes(filter) ||
    d.intitule.toLowerCase().includes(filter) ||
    d.type.toLowerCase().includes(filter)
  );

  if (!list.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = list.map(d => `
    <tr>
      <td class="td-ref">${d.ref}</td>
      <td class="td-title">${d.intitule}</td>
      <td><span class="status-badge status-en-cours" style="background:#f1f5f9;color:#475569">${d.type}</span></td>
      <td>${d.date}</td>
      <td>📄 ${d.format}</td>
      <td class="action-btns">
        <button class="btn-view" onclick="previewDoc('document','${d.ref}')">👁 Consulter</button>
        <button class="btn-dl" onclick="downloadDoc('${d.ref}')">⬇ Télécharger</button>
      </td>
    </tr>`).join('');
}

/* ── Demandes list ── */
function renderDemandes(filter = '') {
  const container = document.getElementById('demandes-list');
  const empty     = document.getElementById('demandes-empty');
  if (!container) return;

  let list = data.demandes;
  if (filter) list = list.filter(d =>
    d.ref.toLowerCase().includes(filter) ||
    d.titre.toLowerCase().includes(filter)
  );

  if (!list.length) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  container.innerHTML = list.map(d => {
    const pct = Math.round((d.etapeCurrent / d.etapes.length) * 100);
    const stepsHTML = d.etapes.map((s, i) => {
      let cls = '';
      if (i < d.etapeCurrent) cls = 'done';
      else if (i === d.etapeCurrent - 1) cls = 'current';
      return `<div class="progress-step ${cls}"><div class="ps-label">${s}</div></div>`;
    }).join('');

    return `
      <div class="demande-card">
        <div class="demande-card-top">
          <div>
            <div class="demande-title">${d.titre}</div>
            <div class="demande-ref">${d.ref}</div>
          </div>
          ${statusBadge(d.statut)}
        </div>
        <div style="font-size:13.5px;color:#4a5568;line-height:1.6">${d.description}</div>
        <div class="demande-meta">
          <span>📅 ${d.date}</span>
          <span>⚡ Urgence : ${urgenceLabel(d.urgence)}</span>
          <span>📊 Avancement : ${Math.min(d.etapeCurrent, d.etapes.length)} / ${d.etapes.length} étapes</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-steps">${stepsHTML}</div>
        </div>
      </div>`;
  }).join('');
}

/* ── Paiements ── */
function renderPaiements() {
  const el = document.getElementById('paiements-content');
  if (!el) return;
  el.innerHTML = data.paiements.map(p => `
    <div class="paiement-item">
      <div class="paiement-info">
        <h4>${p.intitule}</h4>
        <p>${p.ref} · ${p.date}</p>
      </div>
      <div class="paiement-amount">${p.montant}</div>
      ${p.statut === 'paye'
        ? '<span class="status-badge status-traite">✓ Payé</span>'
        : `<button class="btn-payer" onclick="simulatePay('${p.ref}', this)">💳 Payer en ligne</button>`
      }
    </div>`).join('');
}

/* ── Messages ── */
function renderMessages() {
  const el = document.getElementById('messages-list');
  if (!el) return;
  el.innerHTML = data.messages.map(m => `
    <div class="msg-item ${m.lu ? '' : 'unread'}" onclick="markRead(${m.id})">
      <div class="msg-avatar">${m.initiales}</div>
      <div class="msg-body">
        <div class="msg-from">${m.de}</div>
        <div class="msg-subject">${m.sujet}</div>
        <div class="msg-preview">${m.apercu}</div>
      </div>
      <div class="msg-time">${m.date}</div>
    </div>`).join('');
}

/* ── Profile ── */
function renderProfile() {
  const initials = (currentUser.prenom[0] + currentUser.nom[0]).toUpperCase();

  const avatarBig  = document.getElementById('profile-avatar-big');
  const fullName   = document.getElementById('profile-fullname');
  const typeBadge  = document.getElementById('profile-type-badge');
  const infoGrid   = document.getElementById('profile-info-grid');
  const statsEl    = document.getElementById('profile-stats');
  const profileAvWrap = document.getElementById('profile-avatar-big');

  if (avatarBig)  avatarBig.textContent  = initials;
  if (fullName)   fullName.textContent   = `${currentUser.prenom} ${currentUser.nom}`;
  if (typeBadge)  typeBadge.textContent  = currentUser.type;

  const fields = [
    { label: 'Prénom',        value: currentUser.prenom },
    { label: 'Nom',           value: currentUser.nom },
    { label: 'Email',         value: currentUser.email },
    { label: 'Téléphone',     value: currentUser.telephone },
    { label: 'Adresse',       value: currentUser.adresse },
    { label: 'Référence',     value: currentUser.ref },
    { label: 'Type de compte', value: currentUser.type },
    { label: 'Client depuis', value: currentUser.depuis },
  ];
  if (currentUser.societe) fields.push({ label: 'Société', value: currentUser.societe });

  if (infoGrid) infoGrid.innerHTML = fields.map(f => `
    <div class="pinfo-item">
      <span class="pinfo-label">${f.label}</span>
      <span class="pinfo-value">${f.value}</span>
    </div>`).join('');

  if (statsEl) {
    const stats = [
      ['Constats',  data.constats.length],
      ['Documents', data.documents.length],
      ['Demandes',  data.demandes.length],
      ['En cours',  data.demandes.filter(d => d.statut === 'en-cours').length],
    ];
    statsEl.innerHTML = stats.map(([label, val]) => `
      <div class="profile-stat-item">
        <span>${label}</span>
        <span>${val}</span>
      </div>`).join('');
  }
}


/* ═══════════════════════════════════════════
   INTERACTIONS
═══════════════════════════════════════════ */

/* ── Section navigation ── */
window.showSection = function(name) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.snav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`section-${name}`)?.classList.add('active');
  document.querySelector(`.snav-item[data-section="${name}"]`)?.classList.add('active');
  /* Close sidebar on mobile */
  if (window.innerWidth < 900) {
    document.getElementById('dash-sidebar')?.classList.remove('open');
  }
};

function initSidebarNav() {
  document.querySelectorAll('.snav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });
}

/* ── User dropdown ── */
function initUserDropdown() {
  const btn      = document.getElementById('dash-user-btn');
  const dropdown = document.getElementById('user-dropdown');
  btn?.addEventListener('click', e => {
    e.stopPropagation();
    dropdown?.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown?.classList.remove('open'));
}

/* ── Sidebar toggle (mobile) ── */
function initSidebarToggle() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('dash-sidebar');
  toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
  /* Overlay click closes sidebar */
  document.addEventListener('click', e => {
    if (
      sidebar?.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== toggle
    ) {
      sidebar.classList.remove('open');
    }
  });
}

/* ── Filters ── */
document.getElementById('filter-constats')?.addEventListener('input', e =>
  renderConstats(e.target.value.toLowerCase())
);
document.getElementById('filter-docs')?.addEventListener('input', e =>
  renderDocuments(e.target.value.toLowerCase())
);
document.getElementById('filter-demandes')?.addEventListener('input', e =>
  renderDemandes(e.target.value.toLowerCase())
);
document.getElementById('filter-constat-type')?.addEventListener('change', e => {
  renderConstats(e.target.value);
});
document.getElementById('filter-constat-year')?.addEventListener('change', e => {
  renderConstats(e.target.value);
});


/* ── Document preview modal ── */
window.previewDoc = function(kind, ref) {
  const modal   = document.getElementById('doc-modal');
  const content = document.getElementById('doc-modal-content');
  if (!modal || !content) return;

  let item;
  if (kind === 'constat') item = data.constats.find(c => c.ref === ref);
  else item = data.documents.find(d => d.ref === ref);

  if (!item) return;
  const name   = kind === 'constat' ? item.type : item.intitule;
  const pages  = item.pages ? `${item.pages} pages` : 'PDF';
  const date   = item.date;
  const addr   = item.adresse || item.type || '';

  content.innerHTML = `
    <div class="doc-preview-header">
      <div class="doc-preview-icon">${kind === 'constat' ? '📋' : '📄'}</div>
      <div>
        <div class="doc-preview-title">${name}</div>
        <div class="doc-preview-meta">
          <span>📄 ${ref}</span>
          <span>📅 ${date}</span>
          ${pages ? `<span>📖 ${pages}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="doc-preview-body">
      <p><strong>Référence :</strong> ${ref}</p>
      <p><strong>Type :</strong> ${kind === 'constat' ? 'Constat de Commissaire de Justice' : item.type}</p>
      ${addr ? `<p><strong>Adresse / Objet :</strong> ${addr}</p>` : ''}
      <p><strong>Date :</strong> ${date}</p>
      <p style="margin-top:16px;color:#718096;font-style:italic;">
        Ce document est un acte officiel établi par Maître Rokia ADJAGBA, Commissaire de Justice.
        Il a valeur probante devant toute juridiction française.
      </p>
    </div>
    <div class="doc-preview-actions">
      <button class="btn-primary" onclick="downloadDoc('${ref}');document.getElementById('doc-modal').classList.remove('open')">
        ⬇ Télécharger le PDF
      </button>
      <button class="btn-outline-dark" onclick="document.getElementById('doc-modal').classList.remove('open')">
        Fermer
      </button>
    </div>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

document.getElementById('doc-modal-close')?.addEventListener('click', () => {
  document.getElementById('doc-modal')?.classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('doc-modal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('doc-modal')) {
    document.getElementById('doc-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── Download (simulated) ── */
window.downloadDoc = function(ref) {
  showToast(`Téléchargement de ${ref} en cours…`, 'info');
  setTimeout(() => showToast(`${ref} téléchargé avec succès.`, 'success'), 1200);
};

/* ── Mark message as read ── */
window.markRead = function(id) {
  const msg = data.messages.find(m => m.id === id);
  if (msg) { msg.lu = true; renderMessages(); }
};

/* ── Simulate payment ── */
window.simulatePay = function(ref, btn) {
  btn.disabled = true;
  btn.textContent = '⏳ Traitement…';
  setTimeout(() => {
    const p = data.paiements.find(x => x.ref === ref);
    if (p) { p.statut = 'paye'; renderPaiements(); renderKPIs(); }
    showToast(`Paiement ${ref} confirmé. Merci !`, 'success');
  }, 1800);
};

/* ── New request form ── */
document.getElementById('new-request-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const form  = e.target;
  const type  = form.type?.value;
  const desc  = form.description?.value.trim();
  const errEl = document.getElementById('req-error');
  const sucEl = document.getElementById('req-success');
  const btn   = document.getElementById('req-submit-btn');

  errEl.style.display = 'none';
  sucEl.style.display = 'none';

  if (!type) { errEl.textContent = 'Veuillez sélectionner un type de demande.'; errEl.style.display = 'block'; return; }
  if (!desc || desc.length < 20) { errEl.textContent = 'Veuillez décrire votre demande (min. 20 caractères).'; errEl.style.display = 'block'; return; }

  btn.disabled = true;
  btn.textContent = '⏳ Envoi en cours…';

  setTimeout(() => {
    /* Add to local data */
    const newRef = `DEM-2026-${String(data.demandes.length + 100).padStart(4, '0')}`;
    const typeLabel = document.getElementById('req-type')?.options[document.getElementById('req-type').selectedIndex]?.text || type;
    const urgence = form.querySelector('input[name="urgence"]:checked')?.value || 'normale';
    data.demandes.unshift({
      ref: newRef, titre: typeLabel, type, date: new Date().toLocaleDateString('fr-FR'),
      statut: 'attente', urgence, etapes: ['Reçue', 'Examinée', 'En traitement', 'Finalisée'],
      etapeCurrent: 1, description: desc,
    });
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Soumettre la demande →';
    sucEl.innerHTML = `✅ Votre demande <strong>${newRef}</strong> a été soumise avec succès !<br/>Nous vous répondrons sous 24h ouvrées.`;
    sucEl.style.display = 'block';
    renderDemandes();
    renderKPIs();
    renderOverview();
    showToast(`Demande ${newRef} soumise.`, 'success');
    setTimeout(() => { sucEl.style.display = 'none'; }, 6000);
  }, 1200);
});

/* ── File drag & drop ── */
(function initFileDrop() {
  const zone    = document.getElementById('file-drop-zone');
  const input   = document.getElementById('file-input');
  const filesEl = document.getElementById('fdz-files');
  if (!zone || !input) return;

  let files = [];

  function renderFiles() {
    filesEl.innerHTML = files.map((f, i) => `
      <div class="fdz-file-item">
        <span class="fdz-file-name">📄 ${f.name}</span>
        <span class="fdz-file-size">${(f.size / 1024).toFixed(1)} Ko</span>
        <button class="fdz-remove" onclick="removeFile(${i})">✕</button>
      </div>`).join('');
  }

  window.removeFile = i => { files.splice(i, 1); renderFiles(); };

  input.addEventListener('change', () => {
    files = [...files, ...Array.from(input.files)].slice(0, 5);
    renderFiles();
    input.value = '';
  });

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    files = [...files, ...Array.from(e.dataTransfer.files)].slice(0, 5);
    renderFiles();
  });
})();

/* ── Compose form ── */
document.getElementById('compose-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const objet = e.target.objet?.value.trim();
  const corps = e.target.corps?.value.trim();
  if (!objet || !corps) { showToast('Veuillez remplir tous les champs.', 'error'); return; }
  e.target.reset();
  showToast('Message envoyé à l\'étude avec succès.', 'success');
});

/* ── Compose form date default ── */
const reqDate = document.getElementById('req-date');
if (reqDate) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  reqDate.min = tomorrow.toISOString().split('T')[0];
}


/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function statusBadge(statut) {
  const map = {
    'en-cours':   ['status-en-cours',   '🔄 En cours'],
    'traite':     ['status-traite',     '✅ Traité'],
    'attente':    ['status-attente',    '⏳ En attente'],
    'annule':     ['status-annule',     '❌ Annulé'],
    'disponible': ['status-disponible', '✓ Disponible'],
  };
  const [cls, label] = map[statut] || ['status-brouillon', statut];
  return `<span class="status-badge ${cls}">${label}</span>`;
}

function urgenceLabel(u) {
  const map = { normale: '🟢 Normale', prioritaire: '🟡 Prioritaire', urgente: '🔴 Urgente' };
  return map[u] || u;
}


/* ═══════════════════════════════════════════
   BOOT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Try to restore session */
  const savedEmail = loadSession();
  if (savedEmail && USERS[savedEmail]) {
    currentUser = USERS[savedEmail];
    data = getMockData(currentUser.id);
    initDashboard();
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display   = 'flex';
  }

  /* Keyboard: Escape closes modal */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('doc-modal')?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
