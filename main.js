// ===== NAV SCROLL BEHAVIOUR =====
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
  header.classList.add('scrolled'); // always styled
}

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== REVIEWS LOADER =====
const defaultReviews = [
  {
    text: "D&J completely transformed our back garden. The patio is absolutely stunning and the team were professional, tidy, and on time throughout. Couldn't recommend them more highly.",
    author: "Sarah M.",
    location: "Stratford-upon-Avon",
    stars: 5
  },
  {
    text: "Had them install a new driveway and fence. Excellent quality work, very competitive pricing, and they left the property spotless. Will definitely use them again.",
    author: "James T.",
    location: "Warwick",
    stars: 5
  },
  {
    text: "Regular lawn maintenance for the past year. Always show up when they say they will and the garden always looks great. A reliable, friendly team.",
    author: "Helen R.",
    location: "Leamington Spa",
    stars: 5
  }
];

function renderStars(n) {
  return Array.from({length: n}, () =>
    `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  ).join('');
}

function renderReviews(reviews) {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${renderStars(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.author.split(' ').map(w => w[0]).join('')}</div>
        <div>
          <div class="review-name">${r.author}</div>
          <div class="review-location">${r.location}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Try to load from JSON, fall back to defaults
async function loadReviews() {
  try {
    const res = await fetch('/data/reviews.json');
    if (!res.ok) throw new Error();
    const reviews = await res.json();
    renderReviews(reviews);
  } catch {
    renderReviews(defaultReviews);
  }
}

loadReviews();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const successMsg = document.getElementById('formSuccess');
    if (successMsg) {
      successMsg.style.display = 'block';
      contactForm.reset();
      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    }
  });
}

// ===== GALLERY FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== LANGUAGE DETECTION =====
function detectLanguage() {
  const lang = navigator.language.slice(0, 2);
  if (['ru', 'pl'].includes(lang)) {
    const supported = ['en', 'ru', 'pl'];
    if (supported.includes(lang)) {
      // Could load /lang/{lang}.json here for full i18n
      console.log('Language detected:', lang);
    }
  }
}
detectLanguage();
