// Scripting Page JavaScript

const allPrompts = {
  health: [
    "I am so grateful and happy now that I wake up every morning feeling vibrant, energized, and full of life. My body is strong, healthy, and glowing...",
    "I am so deeply thankful for my perfect health. Every cell in my body radiates with vitality. I feel amazing in my body every single day...",
    "I am grateful that I have found my perfect relationship with food and movement. Nourishing my body feels effortless and joyful...",
    "I am so happy and grateful that I sleep deeply and wake up refreshed every morning. My mind is clear, my heart is light, and my energy is boundless...",
  ],
  wealth: [
    "I am so grateful and happy now that abundance flows to me from multiple directions. My bank account is growing beautifully and money comes easily...",
    "I am deeply thankful for my financial freedom. I have more than enough to live the life of my dreams and give generously to others...",
    "I am so grateful that I have achieved complete debt freedom. The feeling of financial peace is incredible. I feel so free and empowered...",
    "I am grateful that my investments are growing steadily and creating the passive income that lets me live life completely on my own terms...",
  ],
  career: [
    "I am so grateful and happy now that I am doing work that lights me up and makes a meaningful difference. I wake up excited to begin each day...",
    "I am deeply thankful for my thriving business. I attract ideal clients, do work I love, and create real impact. Success flows to me naturally...",
    "I am so grateful that I am recognized and valued for my unique gifts and contributions. My career is fulfilling and rewarding in every way...",
    "I am grateful that I have found my perfect work-life harmony. I am productive, inspired, and present both at work and with the people I love...",
  ],
  peace: [
    "I am so grateful and happy now that I live in a state of deep, unshakeable peace. My mind is calm, my heart is open, and I feel at ease...",
    "I am deeply thankful for the stillness within me. No matter what happens around me, I return to my inner sanctuary of peace and clarity...",
    "I am so grateful for my loving, joyful, and harmonious relationships. I am surrounded by people who uplift, inspire, and cherish me...",
    "I am grateful that I have released all anxiety and fear. I trust the journey of my life completely and move forward with confidence and ease...",
  ],
  freedom: [
    "I am so grateful and happy now that I am completely financially free. I wake up each morning knowing I have complete choice over how I spend my day...",
    "I am deeply thankful for my passive income streams that more than cover all my needs. I have the freedom to travel, create, and enjoy life fully...",
    "I am so grateful that I have designed a life of true freedom. My time is my own. I work when I want, with whom I want, on what inspires me most...",
    "I am grateful for the incredible freedom I now experience. I have broken free from financial stress and live in abundance, joy, and total peace of mind...",
  ],
};

allPrompts.all = [...allPrompts.health, ...allPrompts.wealth, ...allPrompts.career, ...allPrompts.peace, ...allPrompts.freedom];

let currentCat = 'all';
let promptOffset = 0;

function showScriptCat(cat, btn) {
  currentCat = cat;
  promptOffset = 0;
  document.querySelectorAll('.sct-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPrompts();
}

function renderPrompts() {
  const container = document.getElementById('promptList');
  if (!container) return;
  const list = allPrompts[currentCat] || allPrompts.all;
  const items = list.slice(promptOffset, promptOffset + 4);
  container.innerHTML = items.map((p, i) => `
    <div class="prompt-item" onclick="usePrompt(this, ${JSON.stringify(p)})">
      <strong style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:4px">Prompt ${promptOffset + i + 1}</strong>
      ${p.substring(0, 120)}...
    </div>`).join('');
}

function loadMorePrompts() {
  const list = allPrompts[currentCat] || allPrompts.all;
  promptOffset = (promptOffset + 4) % list.length;
  renderPrompts();
}

function usePrompt(el, text) {
  document.querySelectorAll('.prompt-item').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  const editor = document.getElementById('scriptContent');
  if (editor) {
    editor.value = text + '\n\n';
    editor.focus();
    countWords();
    showToast('Prompt loaded! Begin writing your script.');
  }
}

renderPrompts();

// --- Word Counter ---
function countWords() {
  const content = document.getElementById('scriptContent')?.value || '';
  const words = content.trim().split(/\s+/).filter(w => w).length;
  const el = document.getElementById('wordCount');
  if (el) el.textContent = words + ' words';
}

// --- Save Script ---
function saveScript() {
  const title = document.getElementById('scriptTitle')?.value.trim() || 'Untitled Script';
  const content = document.getElementById('scriptContent')?.value.trim();
  if (!content) { showToast('Please write your script first!'); return; }
  
  const script = {
    id: Date.now(),
    title,
    content,
    date: new Date().toISOString(),
    dateStr: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
  };
  
  const scripts = JSON.parse(localStorage.getItem('cosmos-scripts') || '[]');
  scripts.unshift(script);
  localStorage.setItem('cosmos-scripts', JSON.stringify(scripts));
  showToast('Script saved! Your reality is being written!');
  loadSavedScripts();
}

function copyScript() {
  const content = document.getElementById('scriptContent')?.value;
  if (!content) { showToast('Nothing to copy!'); return; }
  navigator.clipboard.writeText(content).then(() => showToast('Script copied!'));
}

function clearScript() {
  const title = document.getElementById('scriptTitle');
  const content = document.getElementById('scriptContent');
  if (title) title.value = '';
  if (content) content.value = '';
  countWords();
}

function deleteScript(id) {
  const scripts = JSON.parse(localStorage.getItem('cosmos-scripts') || '[]');
  localStorage.setItem('cosmos-scripts', JSON.stringify(scripts.filter(s => s.id !== id)));
  loadSavedScripts();
  showToast('Script deleted.');
}

function loadSavedScripts() {
  const scripts = JSON.parse(localStorage.getItem('cosmos-scripts') || '[]');
  const container = document.getElementById('savedScriptsList');
  if (!container) return;
  if (scripts.length === 0) {
    container.innerHTML = '<div class="empty-state">No scripts yet. Write your first script above!</div>';
    return;
  }
  container.innerHTML = scripts.slice(0, 5).map(s => `
    <div class="saved-script-item">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <h4>${s.title}</h4>
        <div style="display:flex;gap:8px">
          <button onclick="loadScript(${s.id})" style="background:none;border:none;cursor:pointer;color:var(--accent-purple);font-size:0.8rem;font-family:var(--font-main)">Load</button>
          <button onclick="deleteScript(${s.id})" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.8rem;font-family:var(--font-main)">Delete</button>
        </div>
      </div>
      <p>${s.content.substring(0, 150)}${s.content.length > 150 ? '...' : ''}</p>
      <div class="meta">${s.dateStr} &middot; ${s.content.trim().split(/\s+/).filter(w=>w).length} words</div>
    </div>`).join('');
}

function loadScript(id) {
  const scripts = JSON.parse(localStorage.getItem('cosmos-scripts') || '[]');
  const script = scripts.find(s => s.id === id);
  if (script) {
    const titleEl = document.getElementById('scriptTitle');
    const contentEl = document.getElementById('scriptContent');
    if (titleEl) titleEl.value = script.title;
    if (contentEl) { contentEl.value = script.content; countWords(); }
    window.scrollTo({ top: document.querySelector('.scripting-layout').offsetTop - 100, behavior: 'smooth' });
    showToast('Script loaded!');
  }
}

loadSavedScripts();

// --- Scripting Coins & Streak Integration ---
const _origSaveScript = window.saveScript;
window.saveScript = function() {
  _origSaveScript && _origSaveScript();
  const today = new Date().toDateString();
  const key = 'cosmos-scripting-awarded-' + today;
  if (!localStorage.getItem(key)) {
    const streak = PracticeStreak.complete('scripting');
    awardCoins(3, 'Script Saved');
    localStorage.setItem(key, '1');
    if (streak > 1) showToast('&#128293; ' + streak + '-day Scripting streak!');
  }
};
