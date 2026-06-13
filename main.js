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

/* ===== GALLERY LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.dataset.full || item.querySelector('img').src;
    lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  this.reset();
  setTimeout(() => { success.style.display = 'none'; }, 6000);
});
