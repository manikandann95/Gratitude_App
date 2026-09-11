// ============================================================
//  COSMOS GRATITUDE APP — Main JavaScript
// ============================================================

// --- Theme Management ---
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('cosmos-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '☽';

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('cosmos-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '☽';
  });
}

// --- Stars Generation ---
function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = window.innerWidth < 640 ? 60 : 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${Math.random() * 4 + 2}s;
      --delay: ${-Math.random() * 6}s;
      opacity: ${Math.random() * 0.6 + 0.1};
    `;
    container.appendChild(star);
  }
}
generateStars();

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// --- Mobile Menu ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
  });
}

// --- Quotes Database ---
const quotes = [
  { text: "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity.", author: "Melody Beattie" },
  { text: "The more grateful I am, the more beauty I see.", author: "Mary Davis" },
  { text: "Gratitude is the healthiest of all human emotions. The more you express gratitude for what you have, the more likely you will have even more to express gratitude for.", author: "Zig Ziglar" },
  { text: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.", author: "Melody Beattie" },
  { text: "When you are grateful, fear disappears and abundance appears.", author: "Tony Robbins" },
  { text: "Gratitude is not only the greatest of virtues, but the parent of all others.", author: "Marcus Tullius Cicero" },
  { text: "The secret of having it all is knowing you already do.", author: "Unknown" },
  { text: "Appreciation is a wonderful thing: It makes what is excellent in others belong to us as well.", author: "Voltaire" },
  { text: "I would maintain that thanks are the highest form of thought, and that gratitude is happiness doubled by wonder.", author: "G.K. Chesterton" },
  { text: "Be thankful for what you have; you'll end up having more. If you concentrate on what you don't have, you will never, ever have enough.", author: "Oprah Winfrey" },
  { text: "Silent gratitude isn't very much use to anyone.", author: "Gertrude Stein" },
  { text: "Joy is the simplest form of gratitude.", author: "Karl Barth" },
  { text: "Wealth is not about having a lot of money; it's about having a lot of options.", author: "Chris Rock" },
  { text: "Your health is an investment, not an expense.", author: "Unknown" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
];

let quoteIndex = Math.floor(Math.random() * quotes.length);

function newQuote() {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  const q = quotes[quoteIndex];
  const el = document.getElementById('dailyQuote');
  const auth = document.getElementById('quoteAuthor');
  if (el && auth) {
    el.style.opacity = '0';
    auth.style.opacity = '0';
    setTimeout(() => {
      el.textContent = q.text;
      auth.textContent = '— ' + q.author;
      el.style.opacity = '1';
      auth.style.opacity = '1';
    }, 300);
  }
}

// Set daily quote based on date
const dayIndex = new Date().getDay() % quotes.length;
const dailyQ = quotes[dayIndex];
const dailyQuoteEl = document.getElementById('dailyQuote');
const dailyAuthorEl = document.getElementById('quoteAuthor');
if (dailyQuoteEl) dailyQuoteEl.textContent = dailyQ.text;
if (dailyAuthorEl) dailyAuthorEl.textContent = '— ' + dailyQ.author;

// --- Toast Notification ---
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// --- Active Nav Link ---
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') && path.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

// --- Gratitude Streak ---
function updateStreak() {
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('cosmos-last-visit');
  let streak = parseInt(localStorage.getItem('cosmos-streak') || '0');
  
  if (lastVisit !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastVisit === yesterday.toDateString()) {
      streak += 1;
    } else if (!lastVisit) {
      streak = 1;
    } else {
      streak = 1;
    }
    localStorage.setItem('cosmos-streak', streak);
    localStorage.setItem('cosmos-last-visit', today);
  }
  
  const streakEl = document.getElementById('streakCount');
  if (streakEl) streakEl.textContent = streak;
}
updateStreak();

// --- Copy to Clipboard ---
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  }).catch(() => {
    showToast('Text copied!');
  });
}

// Affirmation copy on click
document.querySelectorAll('.affirmation-card').forEach(card => {
  card.addEventListener('click', () => {
    copyText(card.querySelector('p')?.textContent || card.textContent.trim());
  });
});
