// ============================================================
//  COSMOS CHALLENGES — 30-Day Challenge Tracker
// ============================================================
const CHALLENGE_KEY = 'cosmos-active-challenge';

const CHALLENGES = [
  { id:'gratitude', icon:'&#127775;', title:'30 Days of Gratitude', desc:'Write 5 things you are grateful for every single day. Transform your perspective on life permanently.', color:'#9b7dea' },
  { id:'morning', icon:'&#127774;', title:'Morning Miracle 30', desc:'Commit to a 30-minute morning ritual every day — gratitude, affirmations, meditation, journaling, and movement.', color:'#fbbf24' },
  { id:'affirmations', icon:'&#10024;', title:'30-Day Affirmation Sprint', desc:'Repeat your chosen affirmations 10 times every morning and 10 times every evening for 30 days.', color:'#ec4899' },
  { id:'meditation', icon:'&#129504;', title:'Daily Meditation 30', desc:'Meditate for at least 10 minutes every day. Even on the hardest days, just sit in silence and breathe.', color:'#60a5fa' },
  { id:'scripting', icon:'&#9997;&#65039;', title:'30 Days of Scripting', desc:'Write a gratitude script every day. See your dream life in vivid detail through your own written words.', color:'#34d399' },
  { id:'nophone', icon:'&#128247;', title:'Mindful Morning 30', desc:'No phone for the first 30 minutes every morning. Begin each day with stillness and intention instead.', color:'#f472b6' },
  { id:'water', icon:'&#128167;', title:'30-Day Hydration Gratitude', desc:'Drink 8 glasses of water daily and express gratitude with each one. Honor the miracle of clean water.', color:'#4ade80' },
  { id:'visionboard', icon:'&#128444;&#65039;', title:'Vision Board Daily 30', desc:'Visit and feel your vision board every single morning for 30 days. Watch the magic unfold.', color:'#a78bfa' },
];

function loadActive() {
  const saved = localStorage.getItem(CHALLENGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveActive(data) {
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
}

window.startChallenge = function(id) {
  const ch = CHALLENGES.find(c => c.id === id);
  if (!ch) return;
  if (loadActive()) {
    if (!confirm('You have an active challenge. Start a new one? (Current progress will be lost)')) return;
  }
  const data = { id, title: ch.title, desc: ch.desc, icon: ch.icon, startDate: new Date().toISOString(), completedDays: [], lastMarked: null };
  saveActive(data);
  renderPage();
  showToast('Challenge started! You have got this. &#127942;');
};

window.markToday = function() {
  const active = loadActive();
  if (!active) return;
  const today = new Date().toDateString();
  if (active.lastMarked === today) { showToast('Already marked today! Come back tomorrow.'); return; }
  active.completedDays.push(today);
  active.lastMarked = today;
  saveActive(active);
  awardCoins(10, 'Challenge Day ' + active.completedDays.length + ' Complete');
  showToast('+10 coins! Day ' + active.completedDays.length + ' complete!');
  if (active.completedDays.length >= 30) {
    awardCoins(50, '30-Day Challenge COMPLETED!');
    showToast('CONGRATULATIONS! You completed the 30-day challenge! +50 bonus coins!');
    localStorage.removeItem(CHALLENGE_KEY);
  }
  renderPage();
};

window.abandonChallenge = function() {
  if (!confirm('Abandon this challenge? All progress will be lost.')) return;
  localStorage.removeItem(CHALLENGE_KEY);
  renderPage();
  showToast('Challenge abandoned. Start again anytime!');
};

function renderPage() {
  const active = loadActive();

  if (active) {
    document.getElementById('activeChallengeSection').style.display = 'block';
    document.getElementById('pickChallengeSection').style.display = 'none';

    const daysCompleted = active.completedDays.length;
    document.getElementById('activeChallengeTitle').innerHTML = active.icon + ' ' + active.title;
    document.getElementById('activeChallengeDesc').textContent = active.desc;
    document.getElementById('activeDayCount').textContent = daysCompleted + '/30';
    document.getElementById('challengeProgressBar').style.width = Math.round((daysCompleted / 30) * 100) + '%';

    const today = new Date().toDateString();
    const todayDone = active.lastMarked === today;

    // Build 30-day grid
    const grid = document.getElementById('challengeGrid');
    const startDate = new Date(active.startDate);
    let html = '';
    for (let i = 1; i <= 30; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i - 1);
      const isCompleted = active.completedDays.includes(cellDate.toDateString());
      const isTodayCell = cellDate.toDateString() === today;
      html += `<div class="day-cell${isCompleted ? ' completed' : ''}${isTodayCell ? ' today-cell' : ''}">
        <span>${i}</span>
        ${isCompleted ? '<span class="day-check">&#9989;</span>' : isTodayCell ? '<span style="font-size:0.6rem;color:var(--accent-purple)">TODAY</span>' : ''}
      </div>`;
    }
    grid.innerHTML = html;
  } else {
    document.getElementById('activeChallengeSection').style.display = 'none';
    document.getElementById('pickChallengeSection').style.display = 'block';

    const list = document.getElementById('challengesList');
    list.innerHTML = CHALLENGES.map(ch => `
      <div class="challenge-card glass" onclick="startChallenge('${ch.id}')" style="border-left:3px solid ${ch.color}">
        <div class="ch-icon">${ch.icon}</div>
        <div class="ch-info">
          <h4>${ch.title}</h4>
          <p>${ch.desc}</p>
        </div>
        <span class="ch-badge">Start &#8594;</span>
      </div>`).join('');
  }
}

renderPage();
