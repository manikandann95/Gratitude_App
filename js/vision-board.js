// ============================================================
//  VISION BOARD — IndexedDB-based image storage
// ============================================================
const VB_STORE = 'cosmos-vb';
const VB_DB_NAME = 'CosmosVisionBoard';
let vbDB = null;
let vbImages = []; // [{id, src, name}]
let lbIndex = 0;
let slideshowInterval = null;

// --- Open IndexedDB ---
function openVBDB() {
  return new Promise((resolve, reject) => {
    if (vbDB) { resolve(vbDB); return; }
    const req = indexedDB.open(VB_DB_NAME, 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(VB_STORE)) {
        db.createObjectStore(VB_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => { vbDB = e.target.result; resolve(vbDB); };
    req.onerror = e => reject(e);
  });
}

async function getAllImages() {
  const db = await openVBDB();
  return new Promise((resolve) => {
    const tx = db.transaction(VB_STORE, 'readonly');
    const req = tx.objectStore(VB_STORE).getAll();
    req.onsuccess = e => resolve(e.target.result || []);
    req.onerror = () => resolve([]);
  });
}

async function addImage(src, name) {
  const db = await openVBDB();
  return new Promise((resolve) => {
    const tx = db.transaction(VB_STORE, 'readwrite');
    const req = tx.objectStore(VB_STORE).add({ src, name, added: Date.now() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

async function deleteImage(id) {
  const db = await openVBDB();
  return new Promise((resolve) => {
    const tx = db.transaction(VB_STORE, 'readwrite');
    tx.objectStore(VB_STORE).delete(id);
    tx.oncomplete = resolve;
  });
}

async function clearAllImages() {
  const db = await openVBDB();
  return new Promise((resolve) => {
    const tx = db.transaction(VB_STORE, 'readwrite');
    tx.objectStore(VB_STORE).clear();
    tx.oncomplete = resolve;
  });
}

// --- Upload Handler ---
window.handleVBUpload = function(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  showToast('Uploading ' + files.length + ' image(s)...');
  let done = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = async e => {
      await addImage(e.target.result, file.name);
      done++;
      if (done === files.length) {
        showToast(files.length + ' image(s) added to your vision board!');
        renderVB();
      }
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
};

// --- Render Grid ---
async function renderVB() {
  vbImages = await getAllImages();
  const grid = document.getElementById('vbGrid');
  const empty = document.getElementById('vbEmpty');
  const stats = document.getElementById('vbStats');

  if (!grid) return;

  if (vbImages.length === 0) {
    grid.innerHTML = '';
    grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    if (stats) stats.textContent = '';
    return;
  }

  if (empty) empty.style.display = 'none';
  grid.style.display = 'grid';
  if (stats) stats.textContent = vbImages.length + ' image' + (vbImages.length !== 1 ? 's' : '');

  grid.innerHTML = vbImages.map((img, i) => `
    <div class="vb-item" onclick="openLightbox(${i})">
      <img src="${img.src}" alt="${img.name || 'Vision'}" loading="lazy" />
      <button class="vb-delete" onclick="event.stopPropagation();deleteVBImage(${img.id})">&#215;</button>
    </div>`).join('');

  // Award streak + coins for visiting vision board
  const streak = PracticeStreak.complete('vision-board');
  const today = new Date().toDateString();
  const vbAwardedKey = 'cosmos-vb-awarded-' + today;
  if (!localStorage.getItem(vbAwardedKey)) {
    awardCoins(2, 'Vision Board Visit');
    localStorage.setItem(vbAwardedKey, '1');
    if (streak > 1) showToast('🔥 ' + streak + '-day Vision Board streak!');
  }
  PracticeStreak.render('vision-board', 'vbStreakDisplay');
}

window.deleteVBImage = async function(id) {
  await deleteImage(id);
  renderVB();
  showToast('Image removed.');
};

window.clearVisionBoard = async function() {
  if (!confirm('Remove ALL images from your vision board?')) return;
  await clearAllImages();
  renderVB();
  showToast('Vision board cleared.');
};

// --- Lightbox ---
window.openLightbox = function(index) {
  lbIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
};

window.closeLightbox = function() {
  document.getElementById('lightbox').classList.remove('open');
  stopSlideshow();
};

window.lightboxNav = function(dir) {
  lbIndex = (lbIndex + dir + vbImages.length) % vbImages.length;
  updateLightbox();
};

function updateLightbox() {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  if (img && vbImages[lbIndex]) img.src = vbImages[lbIndex].src;
  if (counter) counter.textContent = (lbIndex + 1) + ' / ' + vbImages.length;
}

window.toggleSlideshow = function() {
  if (slideshowInterval) { stopSlideshow(); return; }
  if (vbImages.length === 0) { showToast('Add images to your vision board first!'); return; }
  if (!document.getElementById('lightbox').classList.contains('open')) openLightbox(0);
  slideshowInterval = setInterval(() => {
    lbIndex = (lbIndex + 1) % vbImages.length;
    updateLightbox();
  }, 3500);
  showToast('Slideshow started — enjoy your dreams!');
};

function stopSlideshow() {
  clearInterval(slideshowInterval);
  slideshowInterval = null;
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxNav(1);
  else if (e.key === 'ArrowLeft') lightboxNav(-1);
  else if (e.key === 'Escape') closeLightbox();
});

// --- Init ---
renderVB();
