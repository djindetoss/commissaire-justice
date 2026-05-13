'use strict';

/* ═══════════════════════════════════════════
   COMMISSAIRE DE JUSTICE — main.js
   Maître Rokia ADJAGBA
═══════════════════════════════════════════ */

/* ── Header scroll effect ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ── Burger / mobile menu ── */
const burger    = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* Close on outside click */
mobileMenu?.addEventListener('click', e => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));


/* ── Scroll animations ── */
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));


/* ── Counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);


/* ── Tabs ── */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${target}`)?.classList.add('active');
  });
});


/* ── Carousel (testimonials) ── */
(function initCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  const cards     = carousel.querySelectorAll('.testimonial-card');
  const dotsWrap  = document.getElementById('carousel-dots');
  const prevBtn   = document.getElementById('carousel-prev');
  const nextBtn   = document.getElementById('carousel-next');

  /* Determine visible cards based on viewport */
  function getVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
  }

  let visibleCount = getVisible();
  let currentIndex = 0;
  const total       = cards.length;

  function maxIndex() { return total - visibleCount; }

  /* Build dots */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i <= Math.min(count - 1, 5); i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === currentIndex)
    );
  }

  function updateLayout() {
    /* Show only `visibleCount` cards */
    cards.forEach((c, i) => {
      c.style.display = i >= currentIndex && i < currentIndex + visibleCount ? '' : 'none';
    });

    /* Update grid columns */
    carousel.style.gridTemplateColumns = `repeat(${visibleCount}, 1fr)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex();
    updateDots();
  }

  function goTo(idx) {
    currentIndex = Math.max(0, Math.min(idx, maxIndex()));
    updateLayout();
  }

  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

  /* Touch swipe */
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(currentIndex + (dx < 0 ? 1 : -1));
  });

  /* Auto-play */
  let autoPlay = setInterval(() => {
    if (currentIndex >= maxIndex()) goTo(0);
    else goTo(currentIndex + 1);
  }, 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      if (currentIndex >= maxIndex()) goTo(0);
      else goTo(currentIndex + 1);
    }, 5000);
  });

  /* Resize */
  window.addEventListener('resize', () => {
    const v = getVisible();
    if (v !== visibleCount) {
      visibleCount = v;
      currentIndex = 0;
      buildDots();
      updateLayout();
    }
  }, { passive: true });

  buildDots();
  updateLayout();
})();


/* ── Contact form ── */
const contactForm = document.getElementById('contact-form');
const formError   = document.getElementById('form-error');
const formSuccess = document.getElementById('form-success');
const submitBtn   = document.getElementById('submit-btn');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  formError.style.display  = 'none';
  formSuccess.style.display = 'none';

  const prenom  = contactForm.prenom.value.trim();
  const nom     = contactForm.nom.value.trim();
  const email   = contactForm.email.value.trim();
  const objet   = contactForm.objet.value;
  const message = contactForm.message.value.trim();
  const consent = contactForm.consent.checked;

  /* Basic validation */
  if (!prenom || !nom) return showError('Veuillez indiquer votre prénom et nom.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Adresse email invalide.');
  if (!objet) return showError('Veuillez sélectionner un objet.');
  if (!message || message.length < 20) return showError('Votre message doit contenir au moins 20 caractères.');
  if (!consent) return showError('Vous devez accepter la politique de confidentialité.');

  /* Simulate send */
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Envoi en cours…';

  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Envoyer le message →';
    formSuccess.textContent = '✅ Message envoyé avec succès ! Nous vous répondrons sous 24 heures ouvrées.';
    formSuccess.style.display = 'block';
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  }, 1400);

  function showError(msg) {
    formError.textContent = msg;
    formError.style.display = 'block';
    formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});


/* ── Back to top ── */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (header?.offsetHeight || 72) + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Keyboard navigation (ESC closes mobile menu) ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});
