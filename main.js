/* ===== PANEL NAVIGATION ===== */
const panels = document.querySelectorAll('.panel');
const navBtns = document.querySelectorAll('.nav-btn[data-panel]');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');

function showPanel(id) {
  const target = document.getElementById('panel-' + id);
  if (!target) return;

  panels.forEach(p => {
    if (p === target) return;
    if (p.classList.contains('active')) {
      p.classList.add('exit');
      p.classList.remove('active');
      setTimeout(() => p.classList.remove('exit'), 380);
    }
  });

  target.classList.remove('exit');
  target.classList.add('active');

  navBtns.forEach(b => b.classList.toggle('active', b.dataset.panel === id));
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    showPanel(btn.dataset.panel);
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Logo → home
document.querySelector('.logo').addEventListener('click', () => showPanel('home'));

// Mobile nav toggle
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

/* ===== REVIEWS ===== */
async function loadReviews() {
  const strip = document.getElementById('reviewsStrip');
  if (!strip) return;

  let reviews = [];
  try {
    const res = await fetch('data/reviews.json');
    if (!res.ok) throw new Error();
    reviews = await res.json();
  } catch {
    reviews = [
      { author: 'Sarah M.', location: 'Stratford-upon-Avon', stars: 5, text: 'D&J completely transformed our garden. Professional, tidy and always on time.' },
      { author: 'James T.', location: 'Warwick', stars: 5, text: 'Excellent quality work and fair pricing. Left the property spotless.' }
    ];
  }

  strip.innerHTML = reviews.slice(0, 2).map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">${r.author} <span class="review-location">· ${r.location}</span></div>
    </div>
  `).join('');
}
loadReviews();

/* ===== GALLERY GRID + LIGHTBOX ===== */

// ─── НАСТРОЙКА: укажите количество фото в папке images/projects/ ───
const PHOTO_COUNT = 5; // измените на нужное число
// ────────────────────────────────────────────────────────────────────

const grid    = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lbImg   = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');
let currentPhoto = 0;

// Строим сетку превью
for (let i = 1; i <= PHOTO_COUNT; i++) {
  const thumb = document.createElement('div');
  thumb.className = 'gallery-thumb';

  const img = document.createElement('img');
  img.src = `images/projects/${i}.jpg`;
  img.alt = `Project ${i}`;
  img.loading = i <= 6 ? 'eager' : 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'gallery-thumb-overlay';
  overlay.textContent = '🔍';

  thumb.appendChild(img);
  thumb.appendChild(overlay);
  thumb.addEventListener('click', () => openLightbox(i - 1));
  grid.appendChild(thumb);
}

// Открыть lightbox
function openLightbox(index) {
  currentPhoto = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  lbImg.src = `images/projects/${currentPhoto + 1}.jpg`;
  lbImg.alt = `Project ${currentPhoto + 1}`;
  lbCounter.textContent = `${currentPhoto + 1} / ${PHOTO_COUNT}`;
  document.getElementById('lbPrev').disabled = currentPhoto === 0;
  document.getElementById('lbNext').disabled = currentPhoto === PHOTO_COUNT - 1;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => { if (currentPhoto > 0) { currentPhoto--; updateLightbox(); } });
document.getElementById('lbNext').addEventListener('click', () => { if (currentPhoto < PHOTO_COUNT - 1) { currentPhoto++; updateLightbox(); } });

// Клик по фону — закрыть
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

// Клавиатура
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft'  && currentPhoto > 0)              { currentPhoto--; updateLightbox(); }
  if (e.key === 'ArrowRight' && currentPhoto < PHOTO_COUNT - 1) { currentPhoto++; updateLightbox(); }
});

// Свайп на мобильном
let touchStartX = 0;
lbImg.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lbImg.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (diff > 40  && currentPhoto < PHOTO_COUNT - 1) { currentPhoto++; updateLightbox(); }
  if (diff < -40 && currentPhoto > 0)               { currentPhoto--; updateLightbox(); }
}, { passive: true });

/* ===== CONTACT FORM (Formspree) ===== */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Basic validation
  const phone = document.getElementById('phone').value.trim();
  const fname = document.getElementById('fname').value.trim();
  if (!fname || !phone) {
    formError.textContent = '⚠️ Please fill in your name and phone number.';
    formError.style.display = 'block';
    setTimeout(() => formError.style.display = 'none', 4000);
    return;
  }

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  formSuccess.style.display = 'none';
  formError.style.display = 'none';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      formSuccess.style.display = 'block';
      contactForm.reset();
      setTimeout(() => formSuccess.style.display = 'none', 6000);
    } else {
      throw new Error('Server error');
    }
  } catch {
    formError.textContent = '⚠️ Something went wrong. Please call us on 07342 274 551.';
    formError.style.display = 'block';
    setTimeout(() => formError.style.display = 'none', 6000);
  } finally {
    submitBtn.textContent = '📩 Send My Request – Get Quote Fast';
    submitBtn.disabled = false;
  }
});
