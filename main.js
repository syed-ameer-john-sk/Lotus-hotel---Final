// ============================================================
// LOTUS RESTAURANT – MAIN.JS
// i18n engine, scroll animations, menu tabs, opening hours,
// video observer, sticky reserve, nav, FAQ, particles
// ============================================================

/* ==========================================================
   GLOBAL STATE
   ========================================================== */
let currentLang = localStorage.getItem('lotus_lang') || 'fr';

/* ==========================================================
   LOADING SCREEN
   ========================================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 800);
  }
  initAll();
});

function initAll() {
  initI18n();
  initEntry();
  initNav();
  initScrollReveal();
  initMenuTabs();
  initFAQ();
  initOpeningStatus();
  initParticles();
  initVideoObserver();
  initReservationForm();
  initStickyReserve();
  initLangSelector();
  initHeroSlider();
}

/* ==========================================================
   HERO IMAGE SLIDER
   ========================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  let current = 0;
  const total = slides.length;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % total;
    slides[current].classList.add('active');
  }, 5000);
}

/* ==========================================================
   MENU TRANSLATION SYSTEM
   ========================================================== */


/* ==========================================================
   I18N ENGINE
   ========================================================== */
function t(key) {
  const lang = translations[currentLang] || translations['fr'];
  return lang[key] || translations['fr'][key] || key;
}

function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('lotus_lang', lang);
  document.documentElement.lang = lang;
  // RTL
  if (RTL_LANGS.includes(lang)) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
  // Apply all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-ph'));
  });
  // HTML content (allow em tags)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  // Update active lang button
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Update lang btn label
  const langBtn = document.getElementById('lang-btn-label');
  if (langBtn && LANG_META[lang]) {
    langBtn.textContent = LANG_META[lang].flag + ' ' + lang.toUpperCase();
  }
  // Re-run status after lang change
  initOpeningStatus();
  }

function initI18n() {
  applyTranslations(currentLang);
}

/* ==========================================================
   LANG SELECTOR
   ========================================================== */
function initLangSelector() {
  const selector = document.querySelector('.lang-selector');
  const btn = document.querySelector('.lang-btn');
  if (!selector || !btn) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    selector.classList.toggle('open');
  });
  document.addEventListener('click', () => selector.classList.remove('open'));
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();
      applyTranslations(opt.dataset.lang);
      selector.classList.remove('open');
    });
  });
}

/* ==========================================================
   ENTRY SCREEN
   ========================================================== */
function initEntry() {
  const screen = document.getElementById('entry-screen');
  if (!screen) return;
  screen.style.display = 'none';
  document.body.style.overflow = '';
}

/* ==========================================================
   NAV
   ========================================================== */
function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('nav-close');

  // Scroll effect (using requestAnimationFrame for performance)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile toggle
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      mobile.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const closeMobile = () => {
      mobile.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', closeMobile);
    if (closeBtn) closeBtn.addEventListener('click', closeMobile);
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==========================================================
   SCROLL REVEAL
   ========================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
}

/* ==========================================================
   MENU TABS
   ========================================================== */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ==========================================================
   FAQ
   ========================================================== */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ==========================================================
   OPENING STATUS
   ========================================================== */
function initOpeningStatus() {
  const statusEl = document.getElementById('opening-status');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay();  // 0=Sun, 1=Mon...
  const hour = now.getHours();
  const min = now.getMinutes();
  const time = hour * 60 + min;

  // Schedule: Mon–Sat: 12:00–14:30 + 19:00–23:00, Sun: 19:00–23:00
  let isOpen = false;
  let nextOpen = '';

  const lunchStart = 12 * 60;
  const lunchEnd   = 14 * 60 + 30;
  const dinnerStart = 19 * 60;
  const dinnerEnd   = 23 * 60;

  if (day === 0) {
    // Sunday — dinner only
    isOpen = (time >= dinnerStart && time < dinnerEnd);
    if (!isOpen) nextOpen = '19h00';
  } else if (day >= 1 && day <= 6) {
    // Mon–Sat
    isOpen = (time >= lunchStart && time < lunchEnd) || (time >= dinnerStart && time < dinnerEnd);
    if (!isOpen) {
      if (time < lunchStart) nextOpen = '12h00';
      else if (time >= lunchEnd && time < dinnerStart) nextOpen = '19h00';
      else nextOpen = '12h00 ' + (translations[currentLang]?.nav_menu ? '' : '');
    }
  }

  const dot = statusEl.querySelector('.status-dot');
  const text = statusEl.querySelector('.status-text');
  if (dot && text) {
    if (isOpen) {
      dot.className = 'status-dot open';
      text.innerHTML = `<span class="status-open">${t('status_open')}</span>`;
    } else {
      dot.className = 'status-dot closed';
      text.innerHTML = `<span class="status-closed">${t('status_closed')} ${nextOpen}</span>`;
    }
  }
}

/* ==========================================================
   PARTICLES
   ========================================================== */
function initParticles() {
  const container = document.querySelector('.entry-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 4}s;
      animation-duration: ${3 + Math.random() * 4}s;
      opacity: ${0.2 + Math.random() * 0.6};
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
    `;
    container.appendChild(p);
  }
}

/* ==========================================================
   VIDEO OBSERVER
   ========================================================== */
function initVideoObserver() {
  const videos = document.querySelectorAll('video[data-autoplay]');
  if (!videos.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.3 });
  videos.forEach(v => observer.observe(v));
}

/* ==========================================================
   RESERVATION FORM
   ========================================================== */
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = '✓';
    btn.style.background = '#4CAF7D';
    showToast('✓ Réservation envoyée avec succès !');
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ==========================================================
   STICKY RESERVE
   ========================================================== */
function initStickyReserve() {
  const sticky = document.getElementById('sticky-reserve');
  if (!sticky) return;
  const resSection = document.getElementById('reservation');
  let shown = false;
  let stickyTicking = false;
  window.addEventListener('scroll', () => {
    if (!stickyTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const shouldShow = scrollY > 500;
        // Hide when reservation section is visible
        if (resSection) {
          const rect = resSection.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            sticky.classList.add('hidden');
            stickyTicking = false;
            return;
          }
        }
        sticky.classList.toggle('hidden', !shouldShow);
        stickyTicking = false;
      });
      stickyTicking = true;
    }
  }, { passive: true });
}

/* ==========================================================
   TOAST
   ========================================================== */
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
