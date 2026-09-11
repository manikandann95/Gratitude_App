// ============================================================
//  COSMOS NOTIFICATIONS — Browser Notification Scheduler
// ============================================================
(function() {
  const STORAGE_KEY = 'cosmos-reminders';

  const DEFAULTS = [
    { id: 'morning',  label: '🌅 Morning Gratitude', time: '07:00', enabled: true  },
    { id: 'evening',  label: '🌙 Evening Reflection', time: '21:00', enabled: true  },
    { id: 'journal',  label: '📖 Journal Reminder',   time: '09:00', enabled: false },
    { id: 'vision',   label: '🖼️ Vision Board',       time: '08:00', enabled: false },
    { id: 'affirmation', label: '✨ Daily Affirmation', time: '12:00', enabled: false },
  ];

  function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULTS;
  }

  function save(reminders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }

  async function requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      return result;
    }
    return Notification.permission;
  }

  function sendNotification(title, body) {
    if (Notification.permission !== 'granted') return;
    const n = new Notification(title, {
      body,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="28" font-size="28">✦</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="28" font-size="28">✦</text></svg>',
      requireInteraction: false,
    });
    n.onclick = () => { window.focus(); n.close(); };
    setTimeout(() => n.close(), 8000);
  }

  // Check if any reminder should fire right now (within current minute)
  function checkReminders() {
    if (Notification.permission !== 'granted') return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const currentTime = hh + ':' + mm;
    const reminders = load();
    const firedKey = 'cosmos-notif-fired-' + new Date().toDateString();
    const fired = JSON.parse(localStorage.getItem(firedKey) || '[]');

    reminders.forEach(r => {
      if (r.enabled && r.time === currentTime && !fired.includes(r.id)) {
        const messages = {
          morning: '🌅 Good morning! Start your day with gratitude. Open your morning ritual.',
          evening: '🌙 Time for your evening reflection. How was your day?',
          journal: '📖 Your gratitude journal is waiting. Write 5 things you\'re grateful for today!',
          vision: '🖼️ Visit your vision board and feel the excitement of your dreams coming true!',
          affirmation: '✨ Pause, breathe, and repeat your daily affirmation. You are magnificent!',
        };
        sendNotification('Cosmos Gratitude ✦', messages[r.id] || r.label);
        fired.push(r.id);
        localStorage.setItem(firedKey, JSON.stringify(fired));
      }
    });
  }

  // --- Public API ---
  window.CosmosNotifications = {
    load, save, requestPermission, sendNotification,

    init: function() {
      // Check every minute
      checkReminders();
      setInterval(checkReminders, 60000);
    },

    renderSettings: function(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const reminders = load();

      container.innerHTML = `
        <div style="margin-bottom:16px">
          <button class="btn btn-primary btn-sm" id="enableNotifsBtn" onclick="CosmosNotifications.enable()">
            🔔 Enable Notifications
          </button>
          <span id="notifStatus" style="margin-left:12px;font-size:0.82rem;color:var(--text-muted)">
            ${Notification.permission === 'granted' ? '✅ Notifications active' : Notification.permission === 'denied' ? '❌ Blocked — allow in browser settings' : '⚠️ Not yet enabled'}
          </span>
        </div>
        <div class="notif-settings" id="notifRows">
          ${reminders.map(r => `
            <div class="notif-row" data-id="${r.id}">
              <span>${r.label}</span>
              <div style="display:flex;align-items:center;gap:12px">
                <input class="notif-time" type="time" value="${r.time}" data-id="${r.id}" onchange="CosmosNotifications.updateTime('${r.id}', this.value)" />
                <label class="toggle-switch">
                  <input type="checkbox" ${r.enabled ? 'checked' : ''} onchange="CosmosNotifications.toggle('${r.id}', this.checked)" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>`).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="CosmosNotifications.testNow()">🔔 Send Test Notification</button>
      `;
    },

    enable: async function() {
      const result = await requestPermission();
      const statusEl = document.getElementById('notifStatus');
      if (result === 'granted') {
        if (statusEl) statusEl.textContent = '✅ Notifications active';
        sendNotification('Cosmos Gratitude ✦', '🎉 Notifications enabled! We\'ll remind you to practice gratitude daily.');
      } else {
        if (statusEl) statusEl.textContent = result === 'denied' ? '❌ Blocked — allow in browser settings' : '⚠️ Permission not granted';
      }
    },

    toggle: function(id, val) {
      const reminders = load();
      const r = reminders.find(r => r.id === id);
      if (r) { r.enabled = val; save(reminders); }
    },

    updateTime: function(id, time) {
      const reminders = load();
      const r = reminders.find(r => r.id === id);
      if (r) { r.time = time; save(reminders); }
    },

    testNow: function() {
      requestPermission().then(perm => {
        if (perm === 'granted') {
          sendNotification('Cosmos Gratitude ✦', '✨ This is your daily gratitude reminder. You are doing amazing!');
        } else {
          if (window.showToast) showToast('Please enable notifications first!');
        }
      });
    }
  };

  window.CosmosNotifications.init();
})();
