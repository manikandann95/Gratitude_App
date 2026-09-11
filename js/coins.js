// ============================================================
//  COSMOS COINS — Gold Coin Wallet System
// ============================================================
(function() {
  // --- State ---
  function getCoins() { return parseInt(localStorage.getItem('cosmos-coins') || '0'); }
  function setCoins(n) { localStorage.setItem('cosmos-coins', n); }
  function getHistory() { return JSON.parse(localStorage.getItem('cosmos-coin-history') || '[]'); }

  function addHistory(label, amount) {
    const h = getHistory();
    h.unshift({ label, amount, date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}), ts: Date.now() });
    if (h.length > 50) h.pop();
    localStorage.setItem('cosmos-coin-history', JSON.stringify(h));
  }

  // --- Award Coins ---
  window.awardCoins = function(amount, reason) {
    const prev = getCoins();
    setCoins(prev + amount);
    addHistory(reason, amount);
    updateWalletUI();
    showCoinAnimation(amount);
  };

  function showCoinAnimation(amount) {
    const walletBtn = document.querySelector('.coin-wallet-btn');
    if (!walletBtn) return;
    const rect = walletBtn.getBoundingClientRect();

    // Popup label
    const popup = document.createElement('div');
    popup.className = 'coin-earned-popup';
    popup.textContent = '+' + amount + ' 🪙 coins!';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2100);

    // Coin drops
    for (let i = 0; i < Math.min(amount, 5); i++) {
      setTimeout(() => {
        const coin = document.createElement('div');
        coin.className = 'coin-drop';
        coin.textContent = '🪙';
        coin.style.left = (rect.left + rect.width/2 + (Math.random()-0.5)*60) + 'px';
        coin.style.top = (rect.top - 30) + 'px';
        document.body.appendChild(coin);
        setTimeout(() => coin.remove(), 1300);
      }, i * 120);
    }
  }

  // --- Wallet Modal ---
  function buildWalletModal() {
    if (document.getElementById('walletModal')) return;
    const overlay = document.createElement('div');
    overlay.className = 'wallet-modal-overlay';
    overlay.id = 'walletModal';
    overlay.innerHTML = `
      <div class="wallet-modal">
        <button class="modal-close" onclick="closeWallet()">&#215;</button>
        <div class="wallet-big-coin">🪙</div>
        <div class="wallet-total" id="walletTotalDisplay">${getCoins()}</div>
        <div class="wallet-label">Total Gratitude Coins Earned</div>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:16px">Earn coins by completing daily practices, journaling, scripting, and vision board visits.</div>
        <h4 style="font-size:0.82rem;font-weight:700;color:var(--text-muted);text-align:left;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">Recent Activity</h4>
        <div class="wallet-history" id="walletHistory"></div>
        <button class="btn btn-ghost btn-sm" onclick="closeWallet()" style="margin-top:20px;width:100%">Close</button>
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeWallet(); });
    document.body.appendChild(overlay);
  }

  window.openWallet = function() {
    buildWalletModal();
    const overlay = document.getElementById('walletModal');
    overlay.classList.add('open');
    // fill history
    const h = getHistory();
    const hEl = document.getElementById('walletHistory');
    if (hEl) {
      hEl.innerHTML = h.length === 0
        ? '<div style="text-align:center;color:var(--text-muted);padding:16px">No coins earned yet. Start practicing!</div>'
        : h.slice(0,20).map(e => `<div class="wallet-entry"><span>${e.label} <small style="color:var(--text-muted)">${e.date}</small></span><span class="amt">+${e.amount} 🪙</span></div>`).join('');
      const total = document.getElementById('walletTotalDisplay');
      if (total) total.textContent = getCoins();
    }
  };

  window.closeWallet = function() {
    const overlay = document.getElementById('walletModal');
    if (overlay) overlay.classList.remove('open');
  };

  // --- Wallet Button UI ---
  function buildWalletWidget() {
    if (document.getElementById('coinWalletWidget')) return;
    const w = document.createElement('div');
    w.className = 'coin-wallet';
    w.id = 'coinWalletWidget';
    w.innerHTML = `<button class="coin-wallet-btn" onclick="openWallet()"><span class="coin-icon">🪙</span><span class="coin-count" id="walletCoinCount">${getCoins()}</span></button>`;
    document.body.appendChild(w);
  }

  function updateWalletUI() {
    const el = document.getElementById('walletCoinCount');
    if (el) el.textContent = getCoins();
    const totalEl = document.getElementById('walletTotalDisplay');
    if (totalEl) totalEl.textContent = getCoins();
  }

  // --- Per-Practice Streak Tracking ---
  window.PracticeStreak = {
    key: function(name) { return 'cosmos-streak-' + name; },
    dateKey: function(name) { return 'cosmos-streak-date-' + name; },

    get: function(name) {
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem(this.dateKey(name));
      const streak = parseInt(localStorage.getItem(this.key(name)) || '0');
      if (!lastDate) return streak;
      const last = new Date(lastDate);
      const now = new Date();
      const diffDays = Math.floor((now - last) / 86400000);
      if (diffDays > 1) {
        // Streak broken
        localStorage.setItem(this.key(name), '0');
        return 0;
      }
      return streak;
    },

    complete: function(name) {
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem(this.dateKey(name));
      if (lastDate === today) return this.get(name); // Already done today

      const streak = this.get(name);
      const newStreak = streak + 1;
      localStorage.setItem(this.key(name), newStreak);
      localStorage.setItem(this.dateKey(name), today);
      return newStreak;
    },

    render: function(name, containerId) {
      const streak = this.get(name);
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = `<span class="practice-streak-badge"><span class="streak-fire">🔥</span> ${streak} day streak</span>`;
    }
  };

  // --- Init on DOM ready ---
  document.addEventListener('DOMContentLoaded', function() {
    buildWalletWidget();
    updateWalletUI();
  });
})();
