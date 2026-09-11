// ============================================================
//  COSMOS CREATOR — Affirmation & Quote Creator
// ============================================================
const AFF_KEY = 'cosmos-custom-affirmations';
const QUOTE_KEY = 'cosmos-custom-quotes';

window.switchCreator = function(panel, btn) {
  document.querySelectorAll('.creator-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + panel).classList.add('active');
  btn.classList.add('active');
  if (panel === 'notifications') {
    CosmosNotifications.renderSettings('notifSettingsContainer');
  }
};

// --- AFFIRMATIONS ---
window.saveAffirmation = function() {
  const text = document.getElementById('affText')?.value.trim();
  const cat = document.getElementById('affCategory')?.value;
  if (!text) { showToast('Please write your affirmation first!'); return; }

  const affs = JSON.parse(localStorage.getItem(AFF_KEY) || '[]');
  affs.unshift({ id: Date.now(), text, category: cat, date: new Date().toISOString() });
  localStorage.setItem(AFF_KEY, JSON.stringify(affs));
  document.getElementById('affText').value = '';
  loadAffirmations();
  showToast('Affirmation saved! Speak it with conviction. &#10024;');
};

window.loadAffirmations = function() {
  const filter = document.getElementById('filterAff')?.value || 'all';
  let affs = JSON.parse(localStorage.getItem(AFF_KEY) || '[]');
  if (filter !== 'all') affs = affs.filter(a => a.category === filter);

  const el = document.getElementById('affList');
  if (!el) return;
  if (affs.length === 0) {
    el.innerHTML = '<div class="empty-state">No affirmations yet. Create your first one!</div>';
    return;
  }
  const catIcons = { health:'&#127807;', wealth:'&#128176;', career:'&#128640;', peace:'&#128154;', 'self-love':'&#127800;', relationship:'&#128149;', power:'&#9889;', custom:'&#10024;' };
  el.innerHTML = affs.map(a => `
    <div class="created-item">
      <div style="flex:1">
        <span style="font-size:0.7rem;color:var(--text-muted);text-transform:capitalize;margin-bottom:4px;display:block">${catIcons[a.category]||'&#10022;'} ${a.category}</span>
        <p>${a.text}</p>
      </div>
      <div class="item-actions">
        <button class="item-btn use" onclick="copyText(${JSON.stringify(a.text)})" title="Copy">&#128203;</button>
        <button class="item-btn del" onclick="deleteAff(${a.id})" title="Delete">&#215;</button>
      </div>
    </div>`).join('');
};

window.deleteAff = function(id) {
  const affs = JSON.parse(localStorage.getItem(AFF_KEY) || '[]').filter(a => a.id !== id);
  localStorage.setItem(AFF_KEY, JSON.stringify(affs));
  loadAffirmations();
};

// --- QUOTES ---
window.saveQuote = function() {
  const text = document.getElementById('quoteText')?.value.trim();
  const author = document.getElementById('quoteAuthor')?.value.trim() || 'My Wisdom';
  if (!text) { showToast('Please write your quote first!'); return; }

  const quotes = JSON.parse(localStorage.getItem(QUOTE_KEY) || '[]');
  quotes.unshift({ id: Date.now(), text, author, date: new Date().toISOString() });
  localStorage.setItem(QUOTE_KEY, JSON.stringify(quotes));
  document.getElementById('quoteText').value = '';
  loadQuotes();
  showToast('Quote saved! Your wisdom is captured. &#127775;');
};

function loadQuotes() {
  const quotes = JSON.parse(localStorage.getItem(QUOTE_KEY) || '[]');
  const el = document.getElementById('quoteList');
  if (!el) return;
  if (quotes.length === 0) {
    el.innerHTML = '<div class="empty-state">No quotes yet. Capture your wisdom!</div>';
    return;
  }
  el.innerHTML = quotes.map(q => `
    <div class="created-item">
      <div style="flex:1">
        <p>"${q.text}"</p>
        <span style="font-size:0.75rem;color:var(--text-muted)">&#8212; ${q.author}</span>
      </div>
      <div class="item-actions">
        <button class="item-btn use" onclick="copyText(${JSON.stringify('"' + q.text + '" — ' + q.author)})" title="Copy">&#128203;</button>
        <button class="item-btn del" onclick="deleteQuote(${q.id})" title="Delete">&#215;</button>
      </div>
    </div>`).join('');
}

window.deleteQuote = function(id) {
  const quotes = JSON.parse(localStorage.getItem(QUOTE_KEY) || '[]').filter(q => q.id !== id);
  localStorage.setItem(QUOTE_KEY, JSON.stringify(quotes));
  loadQuotes();
};

// --- Responsive grid ---
function makeResponsive() {
  if (window.innerWidth < 768) {
    ['affGrid','quoteGrid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.gridTemplateColumns = '1fr';
    });
  }
}
window.addEventListener('resize', makeResponsive);
makeResponsive();

// --- Init ---
loadAffirmations();
loadQuotes();
