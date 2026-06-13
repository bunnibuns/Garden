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

/* ===== GALLERY SLIDER ===== */

// ─── НАСТРОЙКА: укажите количество фото в папке images/projects/ ───
const PHOTO_COUNT = 5; // измените на нужное число
// ────────────────────────────────────────────────────────────────────

const track    = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('sliderDots');
let current = 0;
let startX = 0;
let isDragging = false;

// Создаём слайды
for (let i = 1; i <= PHOTO_COUNT; i++) {
  const slide = document.createElement('div');
  slide.className = 'slide' + (i === 1 ? ' active' : '');

  const img = document.createElement('img');
  img.src = `images/projects/${i}.jpg`;
  img.alt = `Project photo ${i}`;
  img.loading = i === 1 ? 'eager' : 'lazy';

  slide.appendChild(img);
  track.appendChild(slide);

  // Dot
  const dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 1 ? ' active' : '');
  dot.setAttribute('aria-label', `Photo ${i}`);
  dot.addEventListener('click', () => goTo(i - 1));
  dotsWrap.appendChild(dot);
}

function goTo(index) {
  const slides = track.querySelectorAll('.slide');
  const dots   = dotsWrap.querySelectorAll('.slider-dot');
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + PHOTO_COUNT) % PHOTO_COUNT;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

document.getElementById('sliderPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('sliderNext').addEventListener('click', () => goTo(current + 1));

// Keyboard arrows
document.addEventListener('keydown', e => {
  if (document.getElementById('panel-gallery').classList.contains('active')) {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  }
});

// Touch / swipe support
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
}, { passive: true });

// Mouse drag support (desktop)
track.addEventListener('mousedown',  e => { startX = e.clientX; isDragging = true; });
track.addEventListener('mouseup',    e => {
  if (!isDragging) return;
  isDragging = false;
  const diff = startX - e.clientX;
  if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
});
track.addEventListener('mouseleave', () => { isDragging = false; });

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  this.reset();
  setTimeout(() => { success.style.display = 'none'; }, 6000);
});
