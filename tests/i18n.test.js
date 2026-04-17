const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');

// Create sandbox context with JSDOM
const sandbox = {
  window: dom.window,
  document: dom.window.document,
  console: console,
  setTimeout: setTimeout,
  setInterval: setInterval,
  localStorage: {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = value; },
    clear() { this.store = {}; }
  },
  IntersectionObserver: class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  RTL_LANGS: ['ar'],
  LANG_META: {
    fr: { flag: '🇫🇷', name: 'Français' },
    en: { flag: '🇬🇧', name: 'English' },
    ar: { flag: '🇸🇦', name: 'العربية' },
    es: { flag: '🇪🇸', name: 'Español' }
  },
  translations: {
    fr: { test_key: 'Test FR', html_key: '<b>FR</b>', status_open: 'Ouvert', status_closed: 'Fermé', nav_menu: 'Menu' },
    en: { test_key: 'Test EN', html_key: '<b>EN</b>', status_open: 'Open', status_closed: 'Closed', nav_menu: 'Menu' },
    ar: { test_key: 'Test AR', html_key: '<b>AR</b>', status_open: 'مفتوح', status_closed: 'مغلق', nav_menu: 'قائمة' }
  }
};

vm.createContext(sandbox);

// Load main.js into the sandbox
const code = fs.readFileSync('./main.js', 'utf8');
vm.runInContext(code, sandbox);

// Mock translateMenu to avoid errors
vm.runInContext('translateMenu = () => {};', sandbox);

test('t() function tests', async (t) => {
  await t.test('returns correct translation for active lang', () => {
    sandbox.applyTranslations('en');
    assert.strictEqual(sandbox.t('test_key'), 'Test EN');

    sandbox.applyTranslations('ar');
    assert.strictEqual(sandbox.t('test_key'), 'Test AR');
  });

  await t.test('falls back to fr when language is not in translations', () => {
    sandbox.applyTranslations('es');
    assert.strictEqual(sandbox.t('test_key'), 'Test FR');
  });

  await t.test('falls back to key when key is not in translations', () => {
    sandbox.applyTranslations('en');
    assert.strictEqual(sandbox.t('missing_key'), 'missing_key');
  });
});

test('applyTranslations sets HTML document properties', () => {
  sandbox.applyTranslations('ar');
  assert.strictEqual(sandbox.document.documentElement.lang, 'ar');
  assert.strictEqual(sandbox.document.documentElement.dir, 'rtl');
  assert.strictEqual(sandbox.localStorage.getItem('lotus_lang'), 'ar');

  sandbox.applyTranslations('en');
  assert.strictEqual(sandbox.document.documentElement.lang, 'en');
  assert.strictEqual(sandbox.document.documentElement.dir, 'ltr');
});

test('applyTranslations updates DOM elements with data-i18n attributes', () => {
  sandbox.document.body.innerHTML = '<div data-i18n="test_key"></div>';
  sandbox.applyTranslations('en');
  assert.strictEqual(sandbox.document.querySelector('[data-i18n="test_key"]').textContent, 'Test EN');

  sandbox.applyTranslations('fr');
  assert.strictEqual(sandbox.document.querySelector('[data-i18n="test_key"]').textContent, 'Test FR');
});

test('applyTranslations updates input placeholders with data-i18n-ph', () => {
  sandbox.document.body.innerHTML = '<input data-i18n-ph="test_key" />';
  sandbox.applyTranslations('ar');
  assert.strictEqual(sandbox.document.querySelector('input').placeholder, 'Test AR');
});

test('applyTranslations updates input/textarea placeholders with data-i18n', () => {
  sandbox.document.body.innerHTML = '<textarea data-i18n="test_key"></textarea>';
  sandbox.applyTranslations('en');
  assert.strictEqual(sandbox.document.querySelector('textarea').placeholder, 'Test EN');
});

test('applyTranslations updates HTML content with data-i18n-html', () => {
  sandbox.document.body.innerHTML = '<div data-i18n-html="html_key"></div>';
  sandbox.applyTranslations('en');
  assert.strictEqual(sandbox.document.querySelector('[data-i18n-html="html_key"]').innerHTML, '<b>EN</b>');
});

test('applyTranslations updates active lang button state', () => {
  sandbox.document.body.innerHTML = `
    <button class="lang-option" data-lang="fr"></button>
    <button class="lang-option" data-lang="en"></button>
  `;
  sandbox.applyTranslations('en');
  assert.strictEqual(sandbox.document.querySelector('[data-lang="en"]').classList.contains('active'), true);
  assert.strictEqual(sandbox.document.querySelector('[data-lang="fr"]').classList.contains('active'), false);
});

test('applyTranslations updates lang button label if present', () => {
  sandbox.document.body.innerHTML = '<button id="lang-btn-label"></button>';
  sandbox.applyTranslations('en');
  assert.strictEqual(sandbox.document.getElementById('lang-btn-label').textContent, '🇬🇧 EN');
});
