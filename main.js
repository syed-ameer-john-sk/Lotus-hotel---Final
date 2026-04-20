// ============================================================
// LOTUS RESTAURANT – MAIN.JS
// i18n engine, scroll animations, menu tabs, opening hours,
// video observer, sticky reserve, nav, FAQ
// ============================================================

/* ==========================================================
   GLOBAL STATE
   ========================================================== */
let currentLang = typeof localStorage !== 'undefined' ? (localStorage.getItem('lotus_lang') || 'fr') : 'fr';

/* ==========================================================
   LOADING SCREEN
   ========================================================== */
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hide'), 800);
    }
    initAll();
  });
}

function initAll() {
  initI18n();
  initNav();
  initScrollReveal();
  initMenuTabs();
  initFAQ();
  initOpeningStatus();
  initVideoObserver();
  initReservationForm();
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
  }, 6500);
}

/* ==========================================================
   MENU TRANSLATION SYSTEM
   ========================================================== */
const menuWords = {
  fr: { Poulet:'Poulet', Agneau:'Agneau', Boeuf:'Boeuf', Crevettes:'Crevettes', Crevette:'Crevette', 'Légumes':'Légumes', Calamar:'Calamar', Saumon:'Saumon', Gambas:'Gambas', Poisson:'Poisson', Viande:'Viande', 'Fromage':'Fromage', Nature:'Nature', Mangue:'Mangue', Rose:'Rose', Ananas:'Ananas', Banane:'Banane' },
  en: { Poulet:'Chicken', Agneau:'Lamb', Boeuf:'Beef', Crevettes:'Prawns', Crevette:'Prawn', 'Légumes':'Vegetables', Calamar:'Squid', Saumon:'Salmon', Gambas:'King Prawns', Poisson:'Fish', Viande:'Meat', 'Fromage':'Cheese', Nature:'Plain', Mangue:'Mango', Rose:'Rose', Ananas:'Pineapple', Banane:'Banana' },
  es: { Poulet:'Pollo', Agneau:'Cordero', Boeuf:'Ternera', Crevettes:'Gambas', Crevette:'Gamba', 'Légumes':'Verduras', Calamar:'Calamar', Saumon:'Salmón', Gambas:'Gambas', Poisson:'Pescado', Viande:'Carne', 'Fromage':'Queso', Nature:'Natural', Mangue:'Mango', Rose:'Rosa', Ananas:'Piña', Banane:'Plátano' },
  de: { Poulet:'Hähnchen', Agneau:'Lamm', Boeuf:'Rind', Crevettes:'Garnelen', Crevette:'Garnele', 'Légumes':'Gemüse', Calamar:'Tintenfisch', Saumon:'Lachs', Gambas:'Riesengarnelen', Poisson:'Fisch', Viande:'Fleisch', 'Fromage':'Käse', Nature:'Natur', Mangue:'Mango', Rose:'Rose', Ananas:'Ananas', Banane:'Banane' },
  it: { Poulet:'Pollo', Agneau:'Agnello', Boeuf:'Manzo', Crevettes:'Gamberi', Crevette:'Gambero', 'Légumes':'Verdure', Calamar:'Calamaro', Saumon:'Salmone', Gambas:'Gamberoni', Poisson:'Pesce', Viande:'Carne', 'Fromage':'Formaggio', Nature:'Naturale', Mangue:'Mango', Rose:'Rosa', Ananas:'Ananas', Banane:'Banana' },
  ar: { Poulet:'دجاج', Agneau:'لحم غنم', Boeuf:'لحم بقر', Crevettes:'جمبري', Crevette:'جمبري', 'Légumes':'خضروات', Calamar:'حبار', Saumon:'سلمون', Gambas:'جمبري كبير', Poisson:'سمك', Viande:'لحم', 'Fromage':'جبن', Nature:'سادة', Mangue:'مانجو', Rose:'ورد', Ananas:'أناناس', Banane:'موز' },
  hi: { Poulet:'चिकन', Agneau:'मेमना', Boeuf:'बीफ', Crevettes:'झींगा', Crevette:'झींगा', 'Légumes':'सब्ज़ियाँ', Calamar:'स्क्विड', Saumon:'सैल्मन', Gambas:'बड़ा झींगा', Poisson:'मछली', Viande:'मांस', 'Fromage':'पनीर', Nature:'सादा', Mangue:'आम', Rose:'गुलाब', Ananas:'अनानास', Banane:'केला' },
};

function translateMenu(lang) {
  const dict = menuWords[lang] || menuWords.fr;
  const frDict = menuWords.fr;
  // Build reverse map from current displayed text back to FR key
  // We store original FR text in a data attribute for reliable mapping
  document.querySelectorAll('.curry-name, .menu-item-name, .drinks-item-name').forEach(el => {
    // Store original FR text on first run
    if (!el.dataset.origFr) {
      let tempClone = el.cloneNode(true);
      const tempTag = tempClone.querySelector('.menu-tag');
      if (tempTag) tempTag.remove();
      el.dataset.origFr = tempClone.textContent.trim();
    }
    let text = el.dataset.origFr;
    // Replace each FR word with the translated word
    Object.keys(frDict).forEach(frWord => {
      const regex = new RegExp('\\b' + frWord + '\\b', 'g');
      if (regex.test(text)) {
        text = text.replace(regex, dict[frWord] || frWord);
      }
    });
    // Preserve V tag spans
    const vTag = el.querySelector('.menu-tag');
    if (vTag) {
      el.childNodes[0].textContent = text + ' ';
    } else {
      el.textContent = text;
    }
  });
}

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
  // HTML content (allow em tags securely)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const rawText = t(el.getAttribute('data-i18n-html'));
    el.replaceChildren();

    const parts = rawText.split(/(<\/?em>)/i);
    let inEm = false;

    parts.forEach(part => {
      if (!part) return;
      if (part.toLowerCase() === '<em>') {
        inEm = true;
      } else if (part.toLowerCase() === '</em>') {
        inEm = false;
      } else {
        if (inEm) {
          const emEl = document.createElement('em');
          emEl.textContent = part;
          el.appendChild(emEl);
        } else {
          el.appendChild(document.createTextNode(part));
        }
      }
    });
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
  // Translate the menu arrays (Poulet, Agneau, etc.)
  translateMenu(lang);
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
   NAV
   ========================================================== */
function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('nav-close');

  // Scroll effect
  let navTicking = false;
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      window.requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        navTicking = false;
      });
      navTicking = true;
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
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const hour = now.getHours();
  const min = now.getMinutes();
  const time = hour * 60 + min;

  let isOpen = false;
  let nextOpen = '';

  const lunchStart = 12 * 60;
  const lunchEnd = 14 * 60 + 30;
  const dinnerStart = 19 * 60;
  const dinnerEnd = 23 * 60;

  if (day === 0) {
    // Sunday — dinner 19:00 - 23:00
    if (time >= dinnerStart && time < dinnerEnd) {
      isOpen = true;
    } else {
      nextOpen = '19:00';
    }
  } else {
    // Mon–Sat
    if ((time >= lunchStart && time < lunchEnd) || (time >= dinnerStart && time < dinnerEnd)) {
      isOpen = true;
    } else {
      if (time < lunchStart) {
        nextOpen = '12:00';
      } else if (time < dinnerStart) {
        nextOpen = '19:00';
      } else {
        nextOpen = '12:00'; // Tomorrow
      }
    }
  }

  const dot = statusEl.querySelector('.status-dot');
  const text = statusEl.querySelector('.status-text');

  if (dot && text) {
    if (isOpen) {
      dot.className = 'status-dot open';
      text.textContent = t('status_open');
    } else {
      dot.className = 'status-dot closed';
      text.textContent = `${t('status_closed')} ${nextOpen}`;
    }
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

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    get currentLang() { return currentLang; },
    set currentLang(v) { currentLang = v; }
  };
}
