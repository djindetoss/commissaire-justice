'use strict';

/* ═══════════════════════════════════════════
   CDJ ADMIN — admin.js
   Gestion des avis Google (reviews.json)
═══════════════════════════════════════════ */

/* ── Credentials (demo — à remplacer par un vrai système d'auth) ── */
const ADM_USERS = {
  admin: 'CDJ2026!'
};
const SESSION_KEY  = 'cdj_admin_session';
const OVERRIDE_KEY = 'cdj_review_overrides';
const REVIEWS_KEY  = 'cdj_custom_reviews'; // locally added reviews

/* ── State ── */
let allReviews   = [];   // base from reviews.json
let overrides    = {};   // { id: bool }
let customReviews = [];  // added via admin UI
let currentFilter = 'all';
let dirty = false;       // unsaved changes flag

/* ═════════════════════════ AUTH ═════════════════════════ */
function isLoggedIn() {
  return !!sessionStorage.getItem(SESSION_KEY);
}

function login(user, pass) {
  if (ADM_USERS[user] && ADM_USERS[user] === pass) {
    sessionStorage.setItem(SESSION_KEY, user);
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('adm-app').style.display   = 'none';
  document.getElementById('adm-login').style.display = 'flex';
}

/* ── Login form ── */
const loginForm = document.getElementById('adm-login-form');
const loginErr  = document.getElementById('adm-err');
const loginBtn  = document.getElementById('adm-submit-btn');
const eyeBtn    = document.getElementById('adm-eye');
const passInput = document.getElementById('adm-pass');

eyeBtn?.addEventListener('click', () => {
  const isText = passInput.type === 'text';
  passInput.type = isText ? 'password' : 'text';
  eyeBtn.textContent = isText ? '👁' : '🙈';
});

loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const user = document.getElementById('adm-user').value.trim();
  const pass = passInput.value;
  if (login(user, pass)) {
    document.getElementById('adm-login').style.display = 'none';
    document.getElementById('adm-app').style.display   = 'flex';
    initApp();
  } else {
    loginErr.textContent = 'Identifiant ou mot de passe incorrect.';
    loginErr.style.display = 'block';
    loginBtn.style.animation = 'none';
    requestAnimationFrame(() => {
      loginBtn.style.animation = 'adm-slide-in .3s ease';
    });
  }
});

document.getElementById('adm-logout')?.addEventListener('click', logout);

/* ═════════════════════════ APP INIT ═════════════════════════ */
async function initApp() {
  loadLocalData();
  await fetchReviews();
  renderAll();
  bindToolbar();
  bindFilterTabs();
}

function loadLocalData() {
  try { overrides     = JSON.parse(localStorage.getItem(OVERRIDE_KEY) || '{}'); } catch {}
  try { customReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)  || '[]'); } catch {}
}

async function fetchReviews() {
  try {
    const res = await fetch('reviews.json?v=' + Date.now());
    if (!res.ok) throw new Error();
    allReviews = await res.json();
  } catch {
    allReviews = [];
    showToast('Impossible de charger reviews.json', 'error');
  }
}

/* Merge base + custom, apply overrides */
function getMergedReviews() {
  const base = [...allReviews, ...customReviews];
  return base.map(r => ({
    ...r,
    visible: r.id in overrides ? overrides[r.id] : r.visible
  }));
}

function getFiltered() {
  const merged = getMergedReviews();
  if (currentFilter === 'visible') return merged.filter(r => r.visible);
  if (currentFilter === 'hidden')  return merged.filter(r => !r.visible);
  return merged;
}

/* ═════════════════════════ RENDER ═════════════════════════ */
function renderAll() {
  renderStats();
  renderList();
  updateSaveNotice();
}

function renderStats() {
  const merged = getMergedReviews();
  const visible = merged.filter(r => r.visible);
  document.getElementById('stat-total').textContent   = merged.length;
  document.getElementById('stat-visible').textContent = visible.length;
  document.getElementById('stat-hidden').textContent  = merged.length - visible.length;
  if (visible.length) {
    const avg = (visible.reduce((s, r) => s + r.note, 0) / visible.length).toFixed(1);
    document.getElementById('stat-avg').textContent = `${avg} ★`;
  } else {
    document.getElementById('stat-avg').textContent = '—';
  }
}

function starsHTML(note) {
  return Array.from({ length: 5 }, (_, i) => {
    const cls = i < Math.floor(note) ? 'full' : (i < note ? 'half' : 'empty');
    const sym = cls === 'empty' ? '☆' : '★';
    return `<span class="adm-rv-star ${cls === 'empty' ? 'empty' : ''}">${sym}</span>`;
  }).join('');
}

function renderList() {
  const list = document.getElementById('adm-reviews-list');
  const reviews = getFiltered().sort((a, b) => (a.ordre || 99) - (b.ordre || 99));

  if (!reviews.length) {
    list.innerHTML = '<p class="adm-loading">Aucun avis à afficher pour ce filtre.</p>';
    return;
  }

  list.innerHTML = reviews.map(r => {
    const vis = r.visible;
    return `
    <div class="adm-review-card ${vis ? 'is-visible' : 'is-hidden'}" data-id="${r.id}">
      <div class="adm-rv-avatar">${r.initiales}</div>

      <div class="adm-rv-body">
        <div class="adm-rv-top">
          <span class="adm-rv-author">${escHtml(r.auteur)}</span>
          <span class="adm-badge ${vis ? 'adm-badge-green' : 'adm-badge-gray'}">${vis ? 'Visible' : 'Masqué'}</span>
          <div class="adm-rv-stars">${starsHTML(r.note)}</div>
          <span class="adm-rv-date">${escHtml(r.date)}</span>
          ${r.id.startsWith('c_') ? '<span class="adm-badge adm-badge-gray" style="font-size:10px">Ajouté</span>' : ''}
        </div>
        <p class="adm-rv-text" id="txt-${r.id}">${escHtml(r.texte)}</p>
        ${r.texte.length > 160 ? `<span class="adm-rv-expand" onclick="toggleExpand('${r.id}')">Voir plus ▾</span>` : ''}
      </div>

      <div class="adm-rv-order">
        <label>Ordre</label>
        <input type="number" min="1" max="99" value="${r.ordre || 99}"
               onchange="updateOrder('${r.id}', this.value)" />
      </div>

      <div class="adm-rv-toggle">
        <label class="text">Visible</label>
        <label class="adm-toggle">
          <input type="checkbox" ${vis ? 'checked' : ''}
                 onchange="toggleVisibility('${r.id}', this.checked)" />
          <span class="adm-toggle-slider"></span>
        </label>
      </div>

      <div class="adm-rv-actions">
        <button class="adm-rv-btn" onclick="openEditModal('${r.id}')">✏️ Modifier</button>
        <button class="adm-rv-btn del" onclick="deleteReview('${r.id}')">🗑 Supprimer</button>
      </div>
    </div>`;
  }).join('');
}

function toggleExpand(id) {
  const el = document.getElementById(`txt-${id}`);
  if (!el) return;
  const isExp = el.classList.toggle('expanded');
  el.nextElementSibling.textContent = isExp ? 'Voir moins ▴' : 'Voir plus ▾';
}

/* ═════════════════════════ ACTIONS ═════════════════════════ */
function toggleVisibility(id, vis) {
  overrides[id] = vis;
  saveOverrides();
  setDirty(true);
  renderAll();
  showToast(vis ? 'Avis rendu visible ✓' : 'Avis masqué', vis ? 'success' : 'info');
}

function updateOrder(id, val) {
  const n = Math.max(1, Math.min(99, parseInt(val, 10) || 99));
  // Update in allReviews or customReviews
  const idx = allReviews.findIndex(r => r.id === id);
  if (idx !== -1) allReviews[idx].ordre = n;
  const cidx = customReviews.findIndex(r => r.id === id);
  if (cidx !== -1) { customReviews[cidx].ordre = n; saveCustomReviews(); }
  setDirty(true);
}

function deleteReview(id) {
  if (!confirm('Supprimer cet avis définitivement ?')) return;
  // From customReviews (permanently)
  const cidx = customReviews.findIndex(r => r.id === id);
  if (cidx !== -1) { customReviews.splice(cidx, 1); saveCustomReviews(); }
  // From allReviews (session only — will reappear on reload)
  const idx = allReviews.findIndex(r => r.id === id);
  if (idx !== -1) allReviews.splice(idx, 1);
  // Also remove override
  delete overrides[id];
  saveOverrides();
  setDirty(true);
  renderAll();
  showToast('Avis supprimé', 'info');
}

function showAllReviews() {
  getMergedReviews().forEach(r => { overrides[r.id] = true; });
  saveOverrides();
  setDirty(true);
  renderAll();
  showToast('Tous les avis sont maintenant visibles', 'success');
}

function hideAllReviews() {
  getMergedReviews().forEach(r => { overrides[r.id] = false; });
  saveOverrides();
  setDirty(true);
  renderAll();
  showToast('Tous les avis sont masqués', 'info');
}

function resetOverrides() {
  if (!confirm('Réinitialiser toutes les personnalisations de visibilité ?\nLes avis retrouveront leur état par défaut dans reviews.json.')) return;
  overrides = {};
  saveOverrides();
  setDirty(false);
  renderAll();
  showToast('Personnalisations réinitialisées', 'info');
}

/* ── Persist ── */
function saveOverrides() {
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
}
function saveCustomReviews() {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(customReviews));
}

/* ═════════════════════════ EXPORT ═════════════════════════ */
function exportJSON() {
  const merged = getMergedReviews()
    .map(r => ({
      id:         r.id,
      auteur:     r.auteur,
      initiales:  r.initiales,
      note:       r.note,
      date:       r.date,
      date_iso:   r.date_iso || new Date().toISOString().split('T')[0],
      texte:      r.texte,
      source:     r.source || 'Google',
      source_url: r.source_url || '',
      visible:    r.id in overrides ? overrides[r.id] : r.visible,
      ordre:      r.ordre || 99
    }))
    .sort((a, b) => a.ordre - b.ordre);

  const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'reviews.json';
  a.click();
  URL.revokeObjectURL(url);
  setDirty(false);
  showToast('reviews.json téléchargé ✓ — déposez-le dans votre dépôt GitHub', 'success');
}

/* ═════════════════════════ PREVIEW ═════════════════════════ */
function openPreview() {
  const reviews = getMergedReviews()
    .filter(r => r.visible)
    .sort((a, b) => (a.ordre || 99) - (b.ordre || 99));

  const html = reviews.length
    ? `<div class="carousel">${reviews.map(r => `
        <div class="testimonial-card">
          <div class="testi-card-top">
            <div class="testi-stars-row">${previewStars(r.note)}</div>
            <img src="https://www.google.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                 alt="Google" class="testi-google-logo" />
          </div>
          <blockquote class="testi-text">« ${escHtml(r.texte)} »</blockquote>
          <div class="testi-author">
            <div class="testi-avatar">${r.initiales}</div>
            <div>
              <strong>${escHtml(r.auteur)}</strong>
              <span>${escHtml(r.date)}</span>
            </div>
          </div>
        </div>`).join('')}
      </div>`
    : '<p style="color:rgba(255,255,255,.5);text-align:center;padding:40px">Aucun avis visible.</p>';

  document.getElementById('adm-preview-body').innerHTML = html;
  document.getElementById('adm-preview-overlay').style.display = 'flex';
}

function previewStars(note) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star ${i < note ? 'full' : 'empty'}">${i < note ? '★' : '☆'}</span>`
  ).join('');
}

document.getElementById('adm-preview-close')?.addEventListener('click', () => {
  document.getElementById('adm-preview-overlay').style.display = 'none';
});
document.getElementById('adm-preview-overlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('adm-preview-overlay'))
    document.getElementById('adm-preview-overlay').style.display = 'none';
});

/* ═════════════════════════ ADD / EDIT MODAL ═════════════════════════ */
let editingId = null;

function openAddModal() {
  editingId = null;
  document.getElementById('adm-modal-title').textContent = 'Ajouter un avis';
  document.getElementById('adm-modal-form').reset();
  document.getElementById('mf-id').value    = '';
  document.getElementById('mf-visible').checked = true;
  document.getElementById('mf-char-count').textContent = '0 caractères';
  document.getElementById('adm-modal-err').style.display = 'none';
  document.getElementById('adm-modal-overlay').style.display = 'flex';
  document.getElementById('mf-auteur').focus();
}

function openEditModal(id) {
  editingId = id;
  const r = getMergedReviews().find(rv => rv.id === id);
  if (!r) return;
  document.getElementById('adm-modal-title').textContent = 'Modifier l\'avis';
  document.getElementById('mf-id').value       = r.id;
  document.getElementById('mf-auteur').value   = r.auteur;
  document.getElementById('mf-initiales').value = r.initiales;
  document.getElementById('mf-note').value     = r.note;
  document.getElementById('mf-date').value     = r.date;
  document.getElementById('mf-texte').value    = r.texte;
  document.getElementById('mf-ordre').value    = r.ordre || 99;
  document.getElementById('mf-visible').checked = r.visible;
  document.getElementById('mf-char-count').textContent = `${r.texte.length} caractères`;
  document.getElementById('adm-modal-err').style.display = 'none';
  document.getElementById('adm-modal-overlay').style.display = 'flex';
}

document.getElementById('mf-texte')?.addEventListener('input', function() {
  document.getElementById('mf-char-count').textContent = `${this.value.length} caractères`;
});

document.getElementById('adm-modal-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const errEl   = document.getElementById('adm-modal-err');
  const auteur   = document.getElementById('mf-auteur').value.trim();
  const initiales = document.getElementById('mf-initiales').value.trim().toUpperCase();
  const note     = parseInt(document.getElementById('mf-note').value, 10);
  const date     = document.getElementById('mf-date').value.trim();
  const texte    = document.getElementById('mf-texte').value.trim();
  const ordre    = parseInt(document.getElementById('mf-ordre').value, 10) || 99;
  const visible  = document.getElementById('mf-visible').checked;

  if (!auteur)    return showModalErr('Le nom de l\'auteur est requis.');
  if (!initiales) return showModalErr('Les initiales sont requises.');
  if (!date)      return showModalErr('La date est requise.');
  if (!texte || texte.length < 10) return showModalErr('Le texte doit faire au moins 10 caractères.');

  if (editingId) {
    /* Edit existing */
    const idx = allReviews.findIndex(r => r.id === editingId);
    if (idx !== -1) {
      Object.assign(allReviews[idx], { auteur, initiales, note, date, texte, ordre });
    }
    const cidx = customReviews.findIndex(r => r.id === editingId);
    if (cidx !== -1) {
      Object.assign(customReviews[cidx], { auteur, initiales, note, date, texte, ordre });
      saveCustomReviews();
    }
    overrides[editingId] = visible;
  } else {
    /* Add new */
    const id = 'c_' + Date.now();
    const review = {
      id, auteur, initiales, note, date,
      date_iso: new Date().toISOString().split('T')[0],
      texte, source: 'Google', source_url: '', visible, ordre
    };
    customReviews.push(review);
    saveCustomReviews();
    if (overrides[id] === undefined) overrides[id] = visible;
  }
  saveOverrides();
  setDirty(true);
  closeModal();
  renderAll();
  showToast(editingId ? 'Avis modifié ✓' : 'Avis ajouté ✓', 'success');
});

function showModalErr(msg) {
  const el = document.getElementById('adm-modal-err');
  el.textContent = msg;
  el.style.display = 'block';
}

function closeModal() {
  document.getElementById('adm-modal-overlay').style.display = 'none';
}

document.getElementById('adm-modal-close')?.addEventListener('click', closeModal);
document.getElementById('adm-modal-cancel')?.addEventListener('click', closeModal);
document.getElementById('adm-modal-overlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('adm-modal-overlay')) closeModal();
});

/* ═════════════════════════ TOOLBAR BINDINGS ═════════════════════════ */
function bindToolbar() {
  document.getElementById('btn-add-review')?.addEventListener('click', openAddModal);
  document.getElementById('btn-show-all')?.addEventListener('click', showAllReviews);
  document.getElementById('btn-hide-all')?.addEventListener('click', hideAllReviews);
  document.getElementById('btn-reset-overrides')?.addEventListener('click', resetOverrides);
  document.getElementById('btn-export')?.addEventListener('click', exportJSON);
  document.getElementById('btn-preview')?.addEventListener('click', openPreview);
}

function bindFilterTabs() {
  document.querySelectorAll('.adm-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.adm-filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderList();
    });
  });
}

/* ═════════════════════════ SAVE NOTICE ═════════════════════════ */
function setDirty(val) {
  dirty = val;
  updateSaveNotice();
}

function updateSaveNotice() {
  document.getElementById('adm-save-notice').style.display = dirty ? 'block' : 'none';
}

/* ═════════════════════════ TOAST ═════════════════════════ */
let toastTimer;
function showToast(msg, type = 'info') {
  const el = document.getElementById('adm-toast');
  el.textContent = msg;
  el.className   = `adm-toast ${type}`;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3500);
}

/* ═════════════════════════ UTILS ═════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═════════════════════════ BOOT ═════════════════════════ */
if (isLoggedIn()) {
  document.getElementById('adm-login').style.display = 'none';
  document.getElementById('adm-app').style.display   = 'flex';
  initApp();
}
