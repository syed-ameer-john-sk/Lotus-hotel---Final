const test = require('node:test');
const assert = require('node:assert');

// Global Mocks for the browser environment
global.localStorage = { getItem: () => 'fr', setItem: () => {} };
global.window = { addEventListener: () => {} };

// A mock DOM registry
let mockElements = {};
let appends = [];

global.document = {
  getElementById: (id) => mockElements[id] || null,
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      classList: {
        classes: new Set(),
        add: function(c) { this.classes.add(c); },
        remove: function(c) { this.classes.delete(c); },
        contains: function(c) { return this.classes.has(c); }
      }
    };
    return el;
  },
  body: {
    appendChild: (el) => {
      appends.push(el);
      if (el.id) {
        mockElements[el.id] = el;
      }
    }
  },
  querySelectorAll: () => [],
  documentElement: {}
};

// Reset function to clear DOM between tests
function resetMockDOM() {
  mockElements = {};
  appends = [];
}

const { showToast } = require('../main.js');

test('showToast creates a toast element if it does not exist', (t) => {
  resetMockDOM();
  t.mock.timers.enable({ apis: ['setTimeout'] });

  showToast('Hello World');

  const toastEl = mockElements['toast'];
  assert.ok(toastEl, 'Toast element should be created');
  assert.strictEqual(toastEl.tagName, 'DIV');
  assert.strictEqual(toastEl.id, 'toast');
  assert.strictEqual(appends.length, 1, 'Should have appended exactly one element');
  assert.strictEqual(appends[0], toastEl);

  // Clean up
  t.mock.timers.reset();
});

test('showToast reuses existing toast element if it already exists', (t) => {
  resetMockDOM();
  t.mock.timers.enable({ apis: ['setTimeout'] });

  // Pre-create the element
  const existingToast = document.createElement('div');
  existingToast.id = 'toast';
  document.body.appendChild(existingToast);
  assert.strictEqual(appends.length, 1);

  showToast('Another message');

  const toastEl = document.getElementById('toast');
  assert.strictEqual(toastEl, existingToast, 'Should reuse the existing toast element');
  assert.strictEqual(appends.length, 1, 'Should not append a new element');

  // Clean up
  t.mock.timers.reset();
});

test('showToast sets text content, adds show class, and removes it after 4000ms', (t) => {
  resetMockDOM();
  t.mock.timers.enable({ apis: ['setTimeout'] });

  showToast('Test Message');

  const toastEl = document.getElementById('toast');
  assert.strictEqual(toastEl.textContent, 'Test Message', 'Should set the text content correctly');
  assert.ok(toastEl.classList.contains('show'), 'Should add the show class immediately');

  // Advance time by 3999ms, class should still be there
  t.mock.timers.tick(3999);
  assert.ok(toastEl.classList.contains('show'), 'Class should still be there before 4000ms');

  // Advance time to 4000ms, class should be removed
  t.mock.timers.tick(1);
  assert.strictEqual(toastEl.classList.contains('show'), false, 'Should remove the show class after 4000ms');

  // Clean up
  t.mock.timers.reset();
});
