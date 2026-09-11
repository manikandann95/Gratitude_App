// ============================================================
//  COSMOS REPORT — Weekly/Monthly Summary Generator
// ============================================================
let currentPeriod = 'weekly';

function getData() {
  return {
    entries: JSON.parse(localStorage.getItem('cosmos-journal-entries') || '[]'),
    scripts: JSON.parse(localStorage.getItem('cosmos-scripts') || '[]'),
    coins: parseInt(localStorage.getItem('cosmos-coins') || '0'),
    coinHistory: JSON.parse(localStorage.getItem('cosmos-coin-history') || '[]'),
    streak: parseInt(localStorage.getItem('cosmos-streak') || '0'),
    bestStreak: parseInt(localStorage.getItem('cosmos-best-streak') || '0'),
  };
}

function filterByDays(arr, days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return arr.filter(e => new Date(e.date || e.ts || Date.now()) >= cutoff);
}

function buildReport(period) {
  const d = getData();
  const days = period === 'weekly' ? 7 : period === 'monthly' ? 30 : 36500;
  const label = period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : 'All Time';

  const entries = period === 'alltime' ? d.entries : filterByDays(d.entries, days);
  const scripts = period === 'alltime' ? d.scripts : filterByDays(d.scripts, days);
  const coinHist = period === 'alltime' ? d.coinHistory : filterByDays(d.coinHistory.map(h => ({...h,date:new Date(h.ts||Date.now()).toISOString()})), days);
  const coinsEarned = coinHist.reduce((sum, h) => sum + (h.amount||0), 0);

  // Gratitude items from entries
  const allGratitudes = entries.flatMap(e => e.gratitudes || []).filter(Boolean);
  const allReflections = entries.map(e => e.reflection).filter(Boolean);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const streakNames = ['daily','journal','scripting','vision-board'];
  const streakData = streakNames.map(n => ({ name: n, val: PracticeStreak.get(n) }));

  const html = `
    <div id="printableReport">
      <div class="glass" style="border-radius:20px;padding:32px;margin-bottom:24px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:24px">
          <div>
            <h2 style="font-family:var(--font-display);font-size:1.8rem;margin-bottom:4px">&#10022; ${label} Report</h2>
            <p style="color:var(--text-muted);font-size:0.85rem">Generated ${dateStr}</p>
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:100px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3)">
            <span>&#128176;</span>
            <span style="font-weight:700;color:#fbbf24">${d.coins} Total Coins</span>
          </div>
        </div>

        <div class="report-grid">
          <div class="report-stat-card glass"><div class="report-stat-num">${entries.length}</div><div class="report-stat-label">Journal Entries</div></div>
          <div class="report-stat-card glass"><div class="report-stat-num">${allGratitudes.length}</div><div class="report-stat-label">Gratitudes Written</div></div>
          <div class="report-stat-card glass"><div class="report-stat-num">${scripts.length}</div><div class="report-stat-label">Scripts Written</div></div>
          <div class="report-stat-card glass"><div class="report-stat-num">${coinsEarned}</div><div class="report-stat-label">&#128176; Coins Earned</div></div>
          <div class="report-stat-card glass"><div class="report-stat-num">${d.streak}</div><div class="report-stat-label">Current Streak</div></div>
          <div class="report-stat-card glass"><div class="report-stat-num">${d.bestStreak}</div><div class="report-stat-label">Best Streak</div></div>
        </div>
      </div>

      <!-- Practice Streaks -->
      <div class="glass" style="border-radius:20px;padding:28px;margin-bottom:20px">
        <div class="report-section">
          <h3>&#128293; Practice Streaks</h3>
          <div class="report-bar-wrap">
            ${streakData.map(s => `
              <div class="report-bar-row">
                <span class="report-bar-label" style="text-transform:capitalize">${s.name.replace('-',' ')}</span>
                <div class="report-bar-track"><div class="report-bar-fill" style="width:${Math.min(s.val*10,100)}%"></div></div>
                <span class="report-bar-val">${s.val}d &#128293;</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Journal Highlights -->
      ${entries.length > 0 ? `
      <div class="glass" style="border-radius:20px;padding:28px;margin-bottom:20px">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">&#128218; Journal Highlights</h3>
        ${entries.slice(0,5).map(e => {
          const d2 = new Date(e.date);
          const ds = d2.toLocaleDateString('en-US',{month:'short',day:'numeric',weekday:'short'});
          return `<div style="padding:16px;border-radius:12px;background:var(--bg-glass);border:1px solid var(--border-glass);margin-bottom:12px">
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px">${ds}</div>
            ${(e.gratitudes||[]).slice(0,3).map(g => `<div style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:4px">&#10022; ${g}</div>`).join('')}
            ${e.reflection ? `<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;font-style:italic;border-left:2px solid var(--accent-purple);padding-left:12px">${e.reflection.substring(0,200)}${e.reflection.length>200?'...':''}</div>` : ''}
          </div>`;
        }).join('')}
      </div>` : ''}

      <!-- Scripts -->
      ${scripts.length > 0 ? `
      <div class="glass" style="border-radius:20px;padding:28px;margin-bottom:20px">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px">&#9997;&#65039; Scripts Written</h3>
        ${scripts.slice(0,3).map(s => `
          <div style="padding:14px;border-radius:12px;background:var(--bg-glass);border:1px solid var(--border-glass);margin-bottom:10px">
            <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px">${s.title}</div>
            <div style="font-size:0.82rem;color:var(--text-secondary);font-style:italic">${s.content.substring(0,150)}...</div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:6px">${s.dateStr} &middot; ${s.content.split(/\s+/).filter(w=>w).length} words</div>
          </div>`).join('')}
      </div>` : ''}

      <!-- Motivational Close -->
      <div class="glass" style="border-radius:20px;padding:32px;text-align:center">
        <div style="font-size:2rem;margin-bottom:12px">&#10022;</div>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:8px">Keep Going. You Are Transforming.</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.8;max-width:500px;margin:0 auto">"The more you practice gratitude, the more you have to be grateful for. Keep showing up for yourself — the universe is responding."</p>
      </div>
    </div>`;

  document.getElementById('reportContent').innerHTML = html;
}

window.switchReport = function(period, btn) {
  currentPeriod = period;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.style.background = 'var(--bg-glass)';
    b.style.color = 'var(--text-secondary)';
    b.style.borderColor = 'var(--border-glass)';
  });
  btn.style.background = 'linear-gradient(135deg,#9b7dea,#ec4899)';
  btn.style.color = '#fff';
  btn.style.borderColor = 'transparent';
  buildReport(period);
};

window.exportTxt = function() {
  const d = getData();
  let txt = 'COSMOS GRATITUDE REPORT\n';
  txt += 'Generated: ' + new Date().toLocaleString() + '\n';
  txt += '='.repeat(50) + '\n\n';
  txt += 'TOTAL COINS: ' + d.coins + '\n';
  txt += 'CURRENT STREAK: ' + d.streak + ' days\n';
  txt += 'BEST STREAK: ' + d.bestStreak + ' days\n\n';
  txt += 'JOURNAL ENTRIES (' + d.entries.length + ')\n' + '-'.repeat(30) + '\n';
  d.entries.forEach(e => {
    txt += '\n[' + new Date(e.date).toLocaleDateString() + ']\n';
    (e.gratitudes||[]).forEach((g,i) => { txt += (i+1) + '. ' + g + '\n'; });
    if (e.reflection) txt += '\nReflection: ' + e.reflection + '\n';
    if (e.intention) txt += 'Intention: ' + e.intention + '\n';
  });
  txt += '\nSCRIPTS (' + d.scripts.length + ')\n' + '-'.repeat(30) + '\n';
  d.scripts.forEach(s => { txt += '\n[' + s.dateStr + '] ' + s.title + '\n' + s.content + '\n'; });

  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'cosmos-gratitude-report.txt'; a.click();
  URL.revokeObjectURL(url);
  showToast('Report exported as TXT!');
};

buildReport('weekly');
