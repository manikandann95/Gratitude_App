// Journal Page JavaScript

// --- Set Today Date ---
const dateEl = document.getElementById('todayDate');
if (dateEl) {
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  dateEl.textContent = new Date().toLocaleDateString('en-US', opts);
}

// --- Progress Tracking ---
function updateProgress() {
  const inputs = document.querySelectorAll('.gratitude-input');
  const reflection = document.getElementById('reflectionText');
  const intention = document.getElementById('intentionText');
  let filled = 0;
  inputs.forEach(i => { if (i.value.trim()) filled++; });
  if (reflection && reflection.value.trim().length > 10) filled += 2;
  if (intention && intention.value.trim().length > 5) filled++;
  const total = inputs.length + 3;
  const pct = Math.round((filled / total) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct === 100 ? '✦ Perfect day! Your cosmos is full!' : pct + '% complete — keep going!';
}

// --- Mood ---
function setMood(btn, emoji) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const label = document.getElementById('moodLabel');
  if (label) label.textContent = 'Feeling ' + btn.getAttribute('title');
  localStorage.setItem('cosmos-mood-' + new Date().toDateString(), emoji + ':' + btn.getAttribute('title'));
}

// Restore today mood
const todayMood = localStorage.getItem('cosmos-mood-' + new Date().toDateString());
if (todayMood) {
  const moodLabel = document.getElementById('moodLabel');
  if (moodLabel) moodLabel.textContent = 'Feeling ' + todayMood.split(':')[1];
}

// --- Prompts ---
const prompts = [
  "What is one thing that happened today that you are unexpectedly grateful for?",
  "Describe a person in your life who has positively shaped who you are. What are you grateful for in them?",
  "What is something about your body or health you often take for granted?",
  "What challenge are you currently facing that is actually helping you grow?",
  "Name three things in your immediate environment right now that you appreciate.",
  "What opportunity do you have in your life that someone else would love to have?",
  "What simple pleasure brought you joy today?",
  "What is something you have learned recently that you are grateful for?",
  "Who made you feel seen, heard, or loved recently?",
  "What aspect of your career or work are you genuinely grateful for?",
  "How has a past struggle made you stronger and wiser?",
  "What is a talent or skill you have that you tend to undervalue?",
  "What does your ideal abundant life look like? Write it as if it has already happened.",
  "What moment of peace or quiet today are you grateful for?",
  "What financial blessing, no matter how small, are you grateful for?",
];

let promptIndex = new Date().getDay();
function showPrompt() {
  const el = document.getElementById('dailyPrompt');
  if (el) el.textContent = prompts[promptIndex % prompts.length];
}
function newPrompt() {
  promptIndex++;
  const el = document.getElementById('dailyPrompt');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = prompts[promptIndex % prompts.length]; el.style.opacity = '1'; }, 200);
  }
  el.style.transition = 'opacity 0.3s';
}
showPrompt();

// --- Sidebar Affirmations ---
const sidebarAffs = [
  "I am grateful for all the abundance in my life.",
  "Every day in every way I am getting better and better.",
  "I attract love, joy, and prosperity effortlessly.",
  "I am at peace with my past and excited about my future.",
  "My gratitude creates a magnetic field of miracles.",
  "I am worthy of all good things coming my way.",
  "Abundance is my birthright and I claim it now.",
];
let sidebarAffIdx = Math.floor(Math.random() * sidebarAffs.length);
const sidebarAffEl = document.getElementById('sidebarAff');
if (sidebarAffEl) sidebarAffEl.textContent = sidebarAffs[sidebarAffIdx];

function newSidebarAff() {
  sidebarAffIdx = (sidebarAffIdx + 1) % sidebarAffs.length;
  const el = document.getElementById('sidebarAff');
  if (el) { el.style.opacity='0'; setTimeout(() => { el.textContent = sidebarAffs[sidebarAffIdx]; el.style.opacity='1'; }, 200); }
  el.style.transition = 'opacity 0.3s';
}

// --- Save / Load Entries ---
function saveEntry() {
  const gratitudes = Array.from(document.querySelectorAll('.gratitude-input'))
    .map(i => i.value.trim()).filter(v => v);
  const reflection = document.getElementById('reflectionText')?.value.trim();
  const intention = document.getElementById('intentionText')?.value.trim();
  
  if (gratitudes.length === 0 && !reflection) {
    showToast('Please add at least one gratitude entry!');
    return;
  }
  
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    dateStr: new Date().toDateString(),
    gratitudes,
    reflection,
    intention,
    mood: localStorage.getItem('cosmos-mood-' + new Date().toDateString()) || '',
  };
  
  const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
  // Remove today's if exists
  const filtered = entries.filter(e => e.dateStr !== entry.dateStr);
  filtered.unshift(entry);
  localStorage.setItem('cosmos-journal-entries', JSON.stringify(filtered));
  showToast('Entry saved! Beautiful work today!');
  loadEntries();
  updateStats();
}

function clearToday() {
  document.querySelectorAll('.gratitude-input').forEach(i => i.value = '');
  const r = document.getElementById('reflectionText');
  const t = document.getElementById('intentionText');
  if (r) r.value = '';
  if (t) t.value = '';
  updateProgress();
}

function deleteEntry(id) {
  const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
  const filtered = entries.filter(e => e.id !== id);
  localStorage.setItem('cosmos-journal-entries', JSON.stringify(filtered));
  loadEntries();
  updateStats();
  showToast('Entry deleted.');
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
  const container = document.getElementById('entryList');
  if (!container) return;
  
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state">&#127775; Your gratitude journey starts here. Save today\'s entry!</div>';
    return;
  }
  
  container.innerHTML = entries.slice(0, 10).map(e => {
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    const preview = e.gratitudes[0] || e.reflection || 'Entry saved';
    return `
      <div class="entry-item">
        <div>
          <p>${preview.substring(0,120)}${preview.length > 120 ? '...' : ''}</p>
          <span class="entry-meta">${dateStr} ${e.mood ? e.mood.split(':')[0] : ''}</span>
        </div>
        <button class="entry-delete" onclick="deleteEntry(${e.id})" title="Delete">&#215;</button>
      </div>`;
  }).join('');
}

function updateStats() {
  const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
  const totalEl = document.getElementById('totalEntries');
  const weekEl = document.getElementById('weekEntries');
  const bestEl = document.getElementById('bestStreak');
  
  if (totalEl) totalEl.textContent = entries.length;
  
  // This week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekCount = entries.filter(e => new Date(e.date) > oneWeekAgo).length;
  if (weekEl) weekEl.textContent = weekCount;
  
  // Best streak
  const streak = parseInt(localStorage.getItem('cosmos-streak') || '0');
  const best = Math.max(streak, parseInt(localStorage.getItem('cosmos-best-streak') || '0'));
  localStorage.setItem('cosmos-best-streak', best);
  if (bestEl) bestEl.textContent = best + ' days';
}

// Load on start
loadEntries();
updateStats();

// Restore today's entry if exists
const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
const todayEntry = entries.find(e => e.dateStr === new Date().toDateString());
if (todayEntry) {
  const inputs = document.querySelectorAll('.gratitude-input');
  todayEntry.gratitudes.forEach((g, i) => { if (inputs[i]) inputs[i].value = g; });
  const r = document.getElementById('reflectionText');
  const t = document.getElementById('intentionText');
  if (r && todayEntry.reflection) r.value = todayEntry.reflection;
  if (t && todayEntry.intention) t.value = todayEntry.intention;
  updateProgress();
}

// --- Journal Coins & Streak Integration ---
// Called from saveEntry in journal.js after saving
const _origSaveEntry = window.saveEntry;
window.saveEntry = function() {
  _origSaveEntry && _origSaveEntry();
  // Award coins on save (once per day)
  const today = new Date().toDateString();
  const awardedKey = 'cosmos-journal-awarded-' + today;
  if (!localStorage.getItem(awardedKey)) {
    const streak = PracticeStreak.complete('journal');
    awardCoins(3, 'Journal Entry Saved');
    localStorage.setItem(awardedKey, '1');
    if (streak > 1) showToast('&#128293; ' + streak + '-day Journal streak!');
  }
};

// --- Export Journal as TXT ---
window.exportJournalTxt = function() {
  const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
  if (entries.length === 0) { showToast('No entries to export!'); return; }
  let txt = 'COSMOS GRATITUDE JOURNAL\n';
  txt += 'Exported: ' + new Date().toLocaleString() + '\n';
  txt += '='.repeat(50) + '\n\n';
  entries.forEach(e => {
    txt += '[' + new Date(e.date).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) + ']\n';
    (e.gratitudes||[]).forEach((g,i) => { if(g) txt += (i+1) + '. ' + g + '\n'; });
    if (e.reflection) txt += '\nReflection:\n' + e.reflection + '\n';
    if (e.intention) txt += '\nTomorrow\'s Intention:\n' + e.intention + '\n';
    txt += '\n' + '-'.repeat(40) + '\n\n';
  });
  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'cosmos-journal.txt'; a.click();
  URL.revokeObjectURL(url);
  showToast('Journal exported as TXT!');
};
