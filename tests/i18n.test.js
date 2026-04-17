import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

describe('i18n translation getter t(key) from main.js', () => {
  let main;

  beforeEach(() => {
    // Standard mock translations
    global.translations = {
      fr: {
        hello: 'Bonjour',
        welcome: 'Bienvenue'
      },
      en: {
        hello: 'Hello'
      }
    };

    // Clear require cache
    delete require.cache[require.resolve('../main.js')];
    main = require('../main.js');
    main.currentLang = 'fr';
  });

  test('Happy path: returns correct translation for existing key in current language (fr)', () => {
    main.currentLang = 'fr';
    assert.strictEqual(main.t('hello'), 'Bonjour');
  });

  test('Happy path: returns correct translation for existing key in current language (en)', () => {
    main.currentLang = 'en';
    assert.strictEqual(main.t('hello'), 'Hello');
  });

  test('Default Language Fallback: falls back to fr if currentLang is not in translations', () => {
    main.currentLang = 'es'; // Not in mock translations
    assert.strictEqual(main.t('hello'), 'Bonjour');
  });

  test('Key Fallback: falls back to fr translation if key is missing in current language', () => {
    main.currentLang = 'en';
    // 'welcome' is missing in 'en' but exists in 'fr'
    assert.strictEqual(main.t('welcome'), 'Bienvenue');
  });

  test('Missing Key: returns the key itself if missing in both current language and fr', () => {
    main.currentLang = 'en';
    assert.strictEqual(main.t('unknown_key'), 'unknown_key');

    main.currentLang = 'fr';
    assert.strictEqual(main.t('unknown_key'), 'unknown_key');
  });

  test('Handles edge cases like null or undefined currentLang', () => {
    main.currentLang = null;
    assert.strictEqual(main.t('hello'), 'Bonjour');

    main.currentLang = undefined;
    assert.strictEqual(main.t('hello'), 'Bonjour');
  });
});
