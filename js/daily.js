// Daily Practice Page JavaScript

// --- Panel Navigation ---
function showPanel(id, btn) {
  document.querySelectorAll('.practice-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.practice-nav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  if (btn && btn !== 'this') btn.classList.add('active');
  // Find btn by id
  const btnEl = document.getElementById('btn-' + id);
  if (btnEl) btnEl.classList.add('active');
}

// --- Checklist Toggle ---
function toggleCheck(item) {
  const cb = item.querySelector('input');
  cb.checked = !cb.checked;
  item.classList.toggle('done', cb.checked);
  if (cb.checked) showToast('Great job! Keep going!');
}

// --- Affirmations Data ---
const affirmations = {
  health: [
    "My body is a temple of health and vitality. Every cell radiates with energy and life.",
    "I am grateful for my strong, capable, and healthy body.",
    "Every breath I take fills me with healing energy and renewed vitality.",
    "I honor my body with nourishing food, joyful movement, and restful sleep.",
    "My immune system is powerful. I radiate health and well-being.",
    "I am grateful for my beating heart and every breath that sustains my life.",
    "My body heals itself naturally. I am whole, healthy, and thriving.",
  ],
  wealth: [
    "I am a magnet for abundance. Money flows to me easily and frequently.",
    "I am grateful for the financial blessings already in my life.",
    "Wealth and prosperity are my natural state of being.",
    "I attract incredible opportunities that create amazing income.",
    "I am financially free and grateful for the abundance that surrounds me.",
    "Money is my ally. I manage it wisely and it grows magnificently.",
    "I deserve wealth and I accept it graciously into my life.",
  ],
  career: [
    "I am talented, capable, and valued. My career grows beautifully every single day.",
    "I am grateful for work that is meaningful, fulfilling, and rewarding.",
    "My unique gifts and talents create tremendous value for others.",
    "Opportunities for growth and advancement find me effortlessly.",
    "I am a leader. I inspire, uplift, and create positive change.",
    "My career path is aligned with my deepest purpose and passion.",
    "I am grateful for every experience that has shaped my professional excellence.",
  ],
  peace: [
    "I am at peace. I release all tension and welcome serenity into every part of my being.",
    "I choose peace in every moment. I am calm, centered, and at ease.",
    "I release what I cannot control and trust the beautiful unfolding of life.",
    "My mind is still. My heart is open. I am in harmony with all that is.",
    "I am grateful for the stillness within me that no storm can disturb.",
    "I breathe in peace. I breathe out love. I am whole and complete.",
    "Tranquility is my natural state. I return to it again and again.",
  ]
};

const affIndexes = { health: 0, wealth: 0, career: 0, peace: 0 };

function switchAffTab(tab, btn) {
  document.querySelectorAll('#panel-affirmations .tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#panel-affirmations .tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('affTab-' + tab).classList.add('active');
  btn.classList.add('active');
}

function nextAff(tab) {
  affIndexes[tab] = (affIndexes[tab] + 1) % affirmations[tab].length;
  updateAffDisplay(tab);
}
function prevAff(tab) {
  affIndexes[tab] = (affIndexes[tab] - 1 + affirmations[tab].length) % affirmations[tab].length;
  updateAffDisplay(tab);
}
function updateAffDisplay(tab) {
  const el = document.getElementById('affDisplay-' + tab);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      el.textContent = affirmations[tab][affIndexes[tab]];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200);
  }
}

// Style the affirmation displays for animation
document.querySelectorAll('[id^="affDisplay-"]').forEach(el => {
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// --- Meditation Timer ---
let timerMinutes = 10;
let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;

function setTimer(mins) {
  stopTimer();
  timerMinutes = mins;
  timerSeconds = 0;
  updateTimerDisplay();
  showToast(mins + ' minute meditation set!');
}

function startTimer() {
  if (timerRunning) return;
  if (timerMinutes === 0 && timerSeconds === 0) resetTimer();
  timerRunning = true;
  timerInterval = setInterval(() => {
    if (timerSeconds === 0) {
      if (timerMinutes === 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        showToast('Meditation complete! Wonderful practice!');
        return;
      }
      timerMinutes--;
      timerSeconds = 59;
    } else {
      timerSeconds--;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  stopTimer();
  timerMinutes = 10;
  timerSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (el) {
    el.textContent = String(timerMinutes).padStart(2,'0') + ':' + String(timerSeconds).padStart(2,'0');
  }
}

// --- Breathwork ---
let breathInterval = null;
let breathPhase = 0;
const breathPhases = [
  { label: 'Inhale', duration: 4000, scale: 'scale(1.5)', opacity: '1', shadow: '0 0 60px rgba(155,125,234,0.5)' },
  { label: 'Hold', duration: 4000, scale: 'scale(1.5)', opacity: '0.9', shadow: '0 0 40px rgba(236,72,153,0.4)' },
  { label: 'Exhale', duration: 6000, scale: 'scale(1)', opacity: '0.7', shadow: '0 0 20px rgba(96,165,250,0.3)' },
];

function startBreath() {
  stopBreath();
  runBreathPhase();
}

function runBreathPhase() {
  const circle = document.getElementById('breathCircle');
  const label = document.getElementById('breathLabel');
  const phase = breathPhases[breathPhase % breathPhases.length];
  
  if (circle && label) {
    circle.style.transform = phase.scale;
    circle.style.opacity = phase.opacity;
    circle.style.boxShadow = phase.shadow;
    circle.textContent = phase.label;
    label.textContent = phase.label + ' (' + (phase.duration/1000) + 's)';
  }
  
  breathInterval = setTimeout(() => {
    breathPhase++;
    runBreathPhase();
  }, phase.duration);
}

function stopBreath() {
  clearTimeout(breathInterval);
  const circle = document.getElementById('breathCircle');
  const label = document.getElementById('breathLabel');
  if (circle) { circle.style.transform = 'scale(1)'; circle.textContent = 'Breathe'; }
  if (label) label.textContent = 'Paused';
  breathPhase = 0;
}

// --- Morning Affirmation Rotation ---
const morningAffs = [
  "I am grateful for this new day and all the abundance it brings.",
  "Today I choose joy, peace, and gratitude in every moment.",
  "I am worthy of all the beautiful things coming my way today.",
  "My heart overflows with gratitude for the gift of this day.",
];
const dayAff = morningAffs[new Date().getDay() % morningAffs.length];
const morningEl = document.getElementById('morningAffirmation');
if (morningEl) morningEl.textContent = dayAff;

// --- Daily Practice Coins Integration ---
// Override toggleCheck to award coins
const _origToggleCheck = window.toggleCheck;
window.toggleCheck = function(item) {
  const cb = item.querySelector('input');
  const wasDone = cb.checked;
  _origToggleCheck && _origToggleCheck(item);
  if (!wasDone && cb.checked) {
    // Award coin for each checked item (once per day per panel)
    const today = new Date().toDateString();
    const panel = item.closest('.practice-panel');
    const panelId = panel ? panel.id : 'unknown';
    const key = 'cosmos-daily-coins-' + panelId + '-' + today;
    const count = parseInt(localStorage.getItem(key) || '0');
    if (count < 10) {
      awardCoins(1, 'Daily Practice Item');
      localStorage.setItem(key, count + 1);
    }
    // Complete practice streak
    const panelName = panelId.replace('panel-','');
    const streak = PracticeStreak.complete('daily');
    if (streak > 1 && count === 0) showToast('&#128293; ' + streak + '-day Daily streak!');
  }
};

// --- Extended Affirmation Categories (Self-Love, Relationship, Power, Custom) ---
affirmations.selflove = [
  'I love and accept myself completely and unconditionally, exactly as I am right now.',
  'I am enough. I have always been enough. I will always be enough. I am whole.',
  'I am worthy of all good things — love, success, joy, and abundance.',
  'I radiate confidence, warmth, and authentic power. I am magnetic.',
  'I honor my body, trust my intuition, and love myself through every season of life.',
  'I forgive myself completely and release all shame, guilt, and self-judgment.',
  'I celebrate who I am becoming. I am proud of my growth and grateful for my journey.',
];
affirmations.relationship = [
  'I am surrounded by love. My relationships are deep, joyful, and mutually nourishing.',
  'I attract loving, kind, and supportive people into my life with ease and grace.',
  'My romantic relationship is passionate, harmonious, and deeply fulfilling.',
  'I communicate with love, listen with empathy, and create safety in all my relationships.',
  'I forgive easily. I release the past with love and open my heart fully to the present.',
  'I am a wonderful partner, friend, and family member. I show up with love and presence.',
  'I am grateful for every person who has loved me and helped me grow into who I am.',
];
affirmations.power = [
  'I am powerful beyond measure. I create my reality with every thought, word, and action.',
  'I am a force of nature. I am unstoppable, unbreakable, and magnificent.',
  'I have unlimited potential. Every day I step more fully into my greatness.',
  'I am the master of my mind, my energy, and my destiny. I choose consciously.',
  'Obstacles become my steppingstones. I rise stronger through every challenge.',
  'I am a leader. I inspire others by simply being my authentic, powerful self.',
  'The universe conspires in my favor. I am divinely supported in all that I do.',
];
affirmations.custom = [];

// Load custom affirmations from Creator
function loadCustomAffs() {
  const saved = JSON.parse(localStorage.getItem('cosmos-custom-affirmations') || '[]');
  if (saved.length > 0) {
    affirmations.custom = saved.map(a => a.text);
    if (affirmations.custom.length > 0) {
      const el = document.getElementById('affDisplay-custom');
      if (el) el.textContent = affirmations.custom[0];
    }
  }
}
loadCustomAffs();
