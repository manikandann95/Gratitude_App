const ALL_PRACTICES = [
  { id:'gratitude-spark', title:'Gratitude Spark', desc:'Recollect 1-3 grateful moments from your past to instantly shift your mood.', tags:['general','daily'], cats:['Health'] },
  { id:'vision-minute', title:'Vision Minute', desc:'Spend 60 seconds vividly imagining one thing you want in your life.', tags:['general','daily','Morning or Evening'], cats:['general'] },
  { id:'10-breath-reset', title:'The 10-Breath Reset', desc:'Take 10 conscious breaths to reset your state in under 2 minutes.', tags:['general','daily'], cats:['Health'] },
  { id:'gratitude-morning', title:'Gratitude Writing — Morning', desc:'Write 15-20 gratitude statements every morning across all six areas of your life.', tags:['general','daily','Morning'], cats:['Health'] },
  { id:'gratitude-bed', title:'Gratitude Writing — Before Bed', desc:'Close your day by writing 3-5 gratitude statements about what went well today.', tags:['general','daily','Evening'], cats:['Health'] },
  { id:'daily-affirmation', title:'Daily Affirmation', desc:'Play affirmation audios in the background daily while you go about your routine — minimum 30 minutes.', tags:['general','daily'], cats:['general'] },
  { id:'water-manifestation', title:'Water Manifestation', desc:'Charge every glass of water with your intention before drinking — a 5-10 second daily practice.', tags:['general','daily'], cats:['general'] },
  { id:'media-detox', title:'Media Detox', desc:'Strict cleansing of your media consumption during your manifestation period — content not aligned with your goals.', tags:['self','daily'], cats:['general'] },
  { id:'people-detox', title:'People Detox', desc:'Cleanse your social circle during your manifestation period — distance yourself from negative energy.', tags:['self','daily'], cats:['Relationship'] },
  { id:'333-script', title:'333 Script', desc:'Write the same one-line affirmation 33 times a day for 3 consecutive days.', tags:['general','daily','Morning or Evening'], cats:['general'] },
  { id:'777-script', title:'777 Script', desc:'Write the same one-line affirmation 7 times in the morning and 7 times at night, for 7 consecutive days.', tags:['general','daily','Morning + Night'], cats:['general'] },
  { id:'scriptwriting', title:'Scriptwriting', desc:'Write your desired reality as if it has already happened — detailed, emotional, present tense.', tags:['general','daily'], cats:['general'] },
  { id:'mirror-work', title:'Mirror Work', desc:'Look into your eyes in the mirror and say affirmations out loud for 5 minutes.', tags:['self','daily','Morning'], cats:['Health'] },
  { id:'pillow-method', title:'Pillow Method', desc:'Write your affirmation on paper and place it under your pillow each night. Fall asleep in the feeling of the wish fulfilled.', tags:['general','daily','Evening'], cats:['general'] },
  { id:'two-cup-method', title:'Two Cup Method', desc:'A ritual for shifting your reality using intention and water. A powerful one-time practice.', tags:['general'], cats:['general'] },
];

function getActivePractices() {
  return JSON.parse(localStorage.getItem('cosmos-active-practices') || '[]');
}
function saveActivePractices(arr) {
  localStorage.setItem('cosmos-active-practices', JSON.stringify(arr));
}
function addPractice(id) {
  const active = getActivePractices();
  if(!active.includes(id)) {
    active.push(id);
    saveActivePractices(active);
    renderActivePractices();
    renderPracticeList();
    if(typeof showToast === 'function') showToast('Practice added to active list');
  }
}
function removePractice(id) {
  let active = getActivePractices();
  active = active.filter(p => p !== id);
  saveActivePractices(active);
  renderActivePractices();
  renderPracticeList();
}
function renderActivePractices() {
  const activeIds = getActivePractices();
  const section = document.getElementById('activePracticesSection');
  const list = document.getElementById('activePracticesList');
  const label = document.getElementById('activePracticesLabel');
  if(!section || !list) return;

  if(activeIds.length === 0) {
    section.style.display = 'none';
  } else {
    section.style.display = 'block';
    label.innerText = `MY ACTIVE PRACTICES · ${activeIds.length}`;
    list.innerHTML = '';
    activeIds.forEach(id => {
      const p = ALL_PRACTICES.find(x => x.id === id);
      if(p) {
        list.innerHTML += `<div class="active-practice-item glass" style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;">
          <div>
            <strong>${p.title}</strong>
            <div style="font-size:0.8rem;opacity:0.7;">Ongoing</div>
          </div>
          <button class="end-cycle-btn btn btn-sm btn-ghost" onclick="removePractice('${id}')">End Cycle</button>
        </div>`;
      }
    });
  }
}
function renderPracticeList() {
  const list = document.getElementById('practiceList');
  if(!list) return;
  const activeIds = getActivePractices();
  
  const search = (document.getElementById('practiceSearch')?.value || '').toLowerCase();
  
  const f1 = document.querySelector('#filterRow1 .filter-chip.active')?.dataset.filter || 'All';
  const f2 = document.querySelector('#filterRow2 .filter-chip.active')?.dataset.filter || 'All';

  list.innerHTML = '';
  
  ALL_PRACTICES.forEach(p => {
    if(search && !p.title.toLowerCase().includes(search) && !p.desc.toLowerCase().includes(search)) return;
    if(f1 !== 'All' && !p.tags.includes(f1)) return;
    if(f2 !== 'All' && !p.cats.includes(f2)) return;

    const isActive = activeIds.includes(p.id);
    const btnHtml = isActive 
      ? `<button class="practice-add-btn btn btn-ghost" onclick="removePractice('${p.id}')" style="color:var(--primary-color)">&#10003;</button>`
      : `<button class="practice-add-btn btn btn-ghost" onclick="addPractice('${p.id}')">+</button>`;

    list.innerHTML += `<div class="practice-card glass" style="padding:16px;border-radius:12px;position:relative;">
      <h3 class="practice-title" style="margin-bottom:8px;">${p.title}</h3>
      <p class="practice-desc" style="font-size:0.9rem;opacity:0.8;margin-bottom:12px;">${p.desc}</p>
      <div class="practice-tags" style="display:flex;gap:4px;flex-wrap:wrap;">
        ${p.tags.map(t=>`<span class="tag-chip" style="font-size:0.7rem;padding:2px 6px;background:rgba(255,255,255,0.1);border-radius:4px;">${t}</span>`).join('')}
      </div>
      <div style="position:absolute;top:16px;right:16px;">${btnHtml}</div>
    </div>`;
  });
}
function filterPractices() {
  renderPracticeList();
}
function initFilterChips() {
  ['filterRow1', 'filterRow2'].forEach(rowId => {
    const row = document.getElementById(rowId);
    if(row) {
      const chips = row.querySelectorAll('.filter-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          filterPractices();
        });
      });
    }
  });
}
function openBundleModal() {
  const m = document.getElementById('bundleModal');
  if(m) m.style.display = 'flex';
}
function closeBundleModal() {
  const m = document.getElementById('bundleModal');
  if(m) m.style.display = 'none';
}
function startBundle() {
  const bundleIds = ['daily-affirmation', 'vision-minute', 'gratitude-morning', 'gratitude-bed', 'media-detox', 'people-detox'];
  bundleIds.forEach(id => {
    const active = getActivePractices();
    if(!active.includes(id)) {
      active.push(id);
      saveActivePractices(active);
    }
  });
  renderActivePractices();
  renderPracticeList();
  closeBundleModal();
  if(typeof showToast === 'function') showToast('Bundle started! 6 practices added.');
}

function getCourseProgress(courseId) {
  return parseInt(localStorage.getItem('cosmos-course-progress-'+courseId) || '0');
}
function renderCoursesTab() {
  document.querySelectorAll('.course-card[data-course]').forEach(card => {
    const cid = card.dataset.course;
    const prog = getCourseProgress(cid);
    const fill = card.querySelector('.course-progress-fill');
    const text = card.querySelector('.course-progress-text');
    if(fill) fill.style.width = prog + '%';
    if(text) text.innerText = prog + '% complete';
  });
}

function init() {
  renderActivePractices();
  renderPracticeList();
  initFilterChips();
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('tab') === 'courses') {
    renderCoursesTab();
  }
}
window.addEventListener('DOMContentLoaded', init);
