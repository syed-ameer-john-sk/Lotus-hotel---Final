// ============================================================
// LOTUS RESTAURANT – MAIN.JS
// i18n engine, scroll animations, menu tabs, opening hours,
// video observer, sticky reserve, nav, FAQ
// ============================================================

/* ==========================================================
   GLOBAL STATE
   ========================================================== */
let currentLang = typeof localStorage !== 'undefined' ? (localStorage.getItem('lotus_lang') || 'fr') : 'fr';
let heroSliderInterval = null;
let toastTimeout = null;

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
  
  if (heroSliderInterval) clearInterval(heroSliderInterval);
  
  let current = 0;
  const total = slides.length;

  heroSliderInterval = setInterval(() => {
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
  
  document.querySelectorAll('.curry-name, .menu-item-name, .drinks-item-name').forEach(el => {
    if (!el.dataset.origFr) {
      // Use childNodes to find the text node to avoid destroying nested spans like .menu-tag
      let frText = "";
      for (let node of el.childNodes) {
        if (node.nodeType === 3) { // Text node
          frText += node.textContent;
        }
      }
      el.dataset.origFr = frText.trim();
    }
    
    let text = el.dataset.origFr;
    Object.keys(frDict).forEach(frWord => {
      const regex = new RegExp('\\b' + frWord + '\\b', 'g');
      if (regex.test(text)) {
        text = text.replace(regex, dict[frWord] || frWord);
      }
    });

    // Update only the first text node child to preserve elements like <span class="menu-tag">
    for (let node of el.childNodes) {
      if (node.nodeType === 3) {
        node.textContent = text + ' ';
        break; 
      }
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

function initOpeningStatus() {
  const statusEl = document.getElementById('opening-status');
  if (!statusEl) return;

  const statusTexts = {
    fr: {
      open: "Ouvert · Ferme à",
      closed_at: "Fermé · Ouvre à",
      closed_wed: "Fermé le mercredi",
      next_thu: "jeudi à 11h30"
    },
    en: {
      open: "Open now · Closes at",
      closed_at: "Closed · Opens at",
      closed_wed: "Closed on Wednesdays",
      next_thu: "Thursday at 11:30 AM"
    },
    es: {
      open: "Abierto · Cierra a las",
      closed_at: "Cerrado · Abre a las",
      closed_wed: "Cerrado los miércoles",
      next_thu: "el jueves a las 11h30"
    },
    de: {
      open: "Geöffnet · Schließt um",
      closed_at: "Geschlossen · Öffnet um",
      closed_wed: "Mittwochs geschlossen",
      next_thu: "Donnerstag um 11:30 Uhr"
    },
    it: {
      open: "Aperto · Chiude alle",
      closed_at: "Chiuso · Apre alle",
      closed_wed: "Chiuso il mercoledì",
      next_thu: "giovedì alle 11:30"
    },
    ar: {
      open: "مفتوح · يغلق عند",
      closed_at: "مغلق · يفتح عند",
      closed_wed: "مغلق أيام الأربعاء",
      next_thu: "الخميس الساعة 11:30 صباحًا"
    },
    hi: {
      open: "खुला है · बंद होने का समय",
      closed_at: "बंद है · खुलने का समय",
      closed_wed: "बुधवार को बंद रहता है",
      next_thu: "गुरुवार सुबह 11:30 बजे"
    }
  };

  const updateStatus = () => {
    const now = new Date();
    
    // Get current day and time in Europe/Paris
    const parisDayOptions = { timeZone: 'Europe/Paris', weekday: 'long' };
    const parisDay = new Intl.DateTimeFormat('en-US', parisDayOptions).format(now).toLowerCase();
    
    const parisTimeOptions = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false };
    const [h, m] = new Intl.DateTimeFormat('fr-FR', parisTimeOptions).format(now).split(':').map(Number);
    const time = h * 60 + m;

    const isWednesday = parisDay === 'wednesday';
    
    // Slot 1: 11:30 (690) to 15:00 (900)
    // Slot 2: 18:30 (1110) to 23:00 (1380)
    const slot1Open = 11 * 60 + 30; 
    const slot1Close = 15 * 60;     
    const slot2Open = 18 * 60 + 30; 
    const slot2Close = 23 * 60;     

    let isOpen = false;
    let statusMsg = "";
    
    const lang = currentLang || 'fr';
    const texts = statusTexts[lang] || statusTexts['fr'];

    if (!isWednesday) {
      if (time >= slot1Open && time < slot1Close) {
        isOpen = true;
        const closeStr = lang === 'en' ? '3:00 PM' : '15h00';
        statusMsg = `${texts.open} ${closeStr}`;
      } else if (time >= slot2Open && time < slot2Close) {
        isOpen = true;
        const closeStr = lang === 'en' ? '11:00 PM' : '23h00';
        statusMsg = `${texts.open} ${closeStr}`;
      }
    }

    if (!isOpen) {
      if (isWednesday) {
        statusMsg = `${texts.closed_at} ${texts.next_thu}`;
      } else if (parisDay === 'tuesday' && time >= slot2Close) {
        statusMsg = `${texts.closed_at} ${texts.next_thu}`;
      } else {
        if (time < slot1Open) {
          const openStr = lang === 'en' ? '11:30 AM' : '11h30';
          statusMsg = `${texts.closed_at} ${openStr}`;
        } else if (time >= slot1Close && time < slot2Open) {
          const openStr = lang === 'en' ? '6:30 PM' : '18h30';
          statusMsg = `${texts.closed_at} ${openStr}`;
        } else {
          const tomorrowIsWed = parisDay === 'tuesday';
          let tomorrowOpenStr = "";
          if (tomorrowIsWed) {
            tomorrowOpenStr = texts.next_thu;
          } else {
            const tomorrowTexts = {
              fr: "demain à 11h30",
              en: "tomorrow at 11:30 AM",
              es: "mañana a las 11h30",
              de: "morgen um 11:30 Uhr",
              it: "domani alle 11:30",
              ar: "غدًا الساعة 11:30 صباحًا",
              hi: "कल सुबह 11:30 बजे"
            };
            tomorrowOpenStr = tomorrowTexts[lang] || tomorrowTexts['fr'];
          }
          statusMsg = `${texts.closed_at} ${tomorrowOpenStr}`;
        }
      }
    }

    const dot = statusEl.querySelector('.status-dot') || document.createElement('span');
    dot.className = 'status-dot';
    const text = statusEl.querySelector('.status-text') || document.createElement('span');
    text.className = 'status-text';
    
    if (!statusEl.contains(dot)) statusEl.appendChild(dot);
    if (!statusEl.contains(text)) statusEl.appendChild(text);

    if (isOpen) {
      dot.style.background = '#2ECC71'; 
      dot.classList.add('pulse');
    } else {
      dot.style.background = '#E74C3C'; 
      dot.classList.remove('pulse');
    }
    text.textContent = statusMsg;
  };

  updateStatus();
  setInterval(updateStatus, 60000); 
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
  const dateInput = document.getElementById('res-date');
  const timeInput = document.getElementById('res-time');
  
  if (!form) return;

  // UX Fix: Prevent past dates
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    
    // UI Feedback
    btn.disabled = true;
    btn.textContent = '...';
    
    try {
      // Enterprise Integration Simulation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      btn.textContent = '✓';
      btn.style.background = '#4CAF7D';
      showToast('✓ Réservation envoyée avec succès !');
      
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    } catch (err) {
      btn.textContent = 'Error';
      btn.disabled = false;
      showToast('❌ Erreur lors de la réservation.');
    }
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
  
  // Race Condition Fix: Clear previous timeout
  if (toastTimeout) clearTimeout(toastTimeout);
  
  toast.textContent = msg;
  toast.classList.add('show');
  
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toastTimeout = null;
  }, 4000);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    get currentLang() { return currentLang; },
    set currentLang(v) { currentLang = v; }
  };
}
