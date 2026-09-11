// ============================================================
//  COSMOS CALENDAR — Activity Calendar JS
// ============================================================
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getActivityData() {
  // Pull all activity from localStorage
  const entries = JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]');
  const scripts = JSON.parse(localStorage.getItem('cosmos-scripts') || '[]');
  const coinHistory = JSON.parse(localStorage.getItem('cosmos-coin-history') || '[]');

  const data = {};

  function addDot(dateStr, type) {
    if (!data[dateStr]) data[dateStr] = { types: new Set() };
    data[dateStr].types.add(type);
  }

  entries.forEach(e => {
    const d = new Date(e.date);
    const key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    addDot(key, 'journal');
  });

  scripts.forEach(s => {
    const d = new Date(s.date);
    const key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    addDot(key, 'script');
  });

  // Daily streak dates from localStorage
  ['daily-morning','daily-evening','journal','scripting','vision-board'].forEach(name => {
    const dateKey = localStorage.getItem('cosmos-streak-date-' + name);
    if (dateKey) {
      const d = new Date(dateKey);
      const key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
      if (name === 'vision-board') addDot(key, 'vision');
      else addDot(key, 'daily');
    }
  });

  coinHistory.forEach(h => {
    const d = new Date(h.ts || Date.now());
    const key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    addDot(key, 'coin');
  });

  return data;
}

window.calNav = function(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
};

function renderCalendar() {
  const title = document.getElementById('calTitle');
  const daysEl = document.getElementById('calDays');
  if (!title || !daysEl) return;

  title.textContent = MONTH_NAMES[calMonth] + ' ' + calYear;

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const data = getActivityData();

  let html = '';
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = calYear + '-' + (calMonth+1) + '-' + d;
    const isToday = today.getDate() === d && today.getMonth() === calMonth && today.getFullYear() === calYear;
    const dayData = data[key];
    const dots = dayData ? Array.from(dayData.types).map(t => `<div class="cal-dot dot-${t}"></div>`).join('') : '';

    html += `<div class="cal-day${isToday ? ' today' : ''}" onclick="showDayDetail(${d})">
      <span class="cal-day-num">${d}</span>
      ${dots ? `<div class="cal-dots">${dots}</div>` : ''}
    </div>`;
  }

  daysEl.innerHTML = html;
  renderMonthStats(data, daysInMonth);
  renderStreaks();
}

window.showDayDetail = function(d) {
  const key = calYear + '-' + (calMonth+1) + '-' + d;
  const data = getActivityData();
  const dayData = data[key];
  const dateStr = MONTH_NAMES[calMonth] + ' ' + d + ', ' + calYear;
  const el = document.getElementById('dayDetail');
  if (!el) return;

  if (!dayData) {
    el.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem"><strong>${dateStr}</strong><br>No activity recorded.</p>`;
    return;
  }

  const types = Array.from(dayData.types);
  const labels = { journal:'📖 Journal entry', script:'✍️ Script written', daily:'☀️ Daily practice', vision:'🖼️ Vision board', coin:'🪙 Coins earned' };
  el.innerHTML = `
    <p style="font-weight:700;margin-bottom:12px">${dateStr}</p>
    ${types.map(t => `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;background:var(--bg-glass);border:1px solid var(--border-glass);margin-bottom:6px;font-size:0.85rem">${labels[t] || t}</div>`).join('')}`;
};

function renderMonthStats(data, daysInMonth) {
  const el = document.getElementById('monthStats');
  if (!el) return;
  let journal = 0, scripts = 0, daily = 0, vision = 0, active = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = calYear + '-' + (calMonth+1) + '-' + d;
    const day = data[key];
    if (!day) continue;
    active++;
    if (day.types.has('journal')) journal++;
    if (day.types.has('script')) scripts++;
    if (day.types.has('daily')) daily++;
    if (day.types.has('vision')) vision++;
  }
  const pct = d => Math.round((d / daysInMonth) * 100);
  el.innerHTML = `
    <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:4px">Active Days: <strong style="color:var(--text-primary)">${active}/${daysInMonth}</strong></div>
    ${[['Journal', journal, 'dot-journal'],['Scripts', scripts, 'dot-script'],['Daily', daily, 'dot-daily'],['Vision', vision, 'dot-vision']].map(([label,val,cls]) => `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:3px"><span>${label}</span><span>${val}</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct(val)}%"></div></div>
      </div>`).join('')}`;
}

function renderStreaks() {
  const el = document.getElementById('streaksList');
  if (!el) return;
  const practices = [
    { name: 'daily', label: '☀️ Daily Practice' },
    { name: 'journal', label: '📖 Journal' },
    { name: 'scripting', label: '✍️ Scripting' },
    { name: 'vision-board', label: '🖼️ Vision Board' },
  ];
  el.innerHTML = practices.map(p => {
    const s = PracticeStreak.get(p.name);
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-radius:8px;background:var(--bg-glass);border:1px solid var(--border-glass)">
      <span style="font-size:0.82rem">${p.label}</span>
      <span style="font-size:0.82rem;font-weight:700;color:${s > 0 ? '#fbbf24' : 'var(--text-muted)'}">${s > 0 ? '🔥 ' + s + 'd' : 'No streak'}</span>
    </div>`;
  }).join('');
}

renderCalendar();

// Responsive layout fix
if (window.innerWidth < 768) {
  const layout = document.getElementById('calLayout');
  if (layout) layout.style.gridTemplateColumns = '1fr';
}
