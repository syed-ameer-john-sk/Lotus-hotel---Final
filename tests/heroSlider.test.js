const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const { initHeroSlider } = require('../main.js');

describe('Hero Slider', () => {
  let dom;
  let originalDocument;
  let originalSetInterval;
  let intervalCallbacks;

  beforeEach(() => {
    // Setup JSDOM
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="slider">
            <div class="hero-slide active">Slide 1</div>
            <div class="hero-slide">Slide 2</div>
            <div class="hero-slide">Slide 3</div>
          </div>
        </body>
      </html>
    `);

    originalDocument = global.document;
    global.document = dom.window.document;

    // Mock setInterval
    originalSetInterval = global.setInterval;
    intervalCallbacks = [];
    global.setInterval = (cb, delay) => {
      intervalCallbacks.push({ cb, delay });
      return 123; // Fake interval ID
    };
  });

  afterEach(() => {
    // Restore globals
    global.document = originalDocument;
    global.setInterval = originalSetInterval;
  });

  test('should not initialize if there are fewer than 2 slides', () => {
    dom.window.document.getElementById('slider').innerHTML = '<div class="hero-slide active">Slide 1</div>';

    initHeroSlider();

    assert.strictEqual(intervalCallbacks.length, 0);
  });

  test('should switch active class between slides correctly over time', () => {
    initHeroSlider();

    assert.strictEqual(intervalCallbacks.length, 1);
    assert.strictEqual(intervalCallbacks[0].delay, 5000);

    const triggerInterval = intervalCallbacks[0].cb;
    const slides = dom.window.document.querySelectorAll('.hero-slide');

    // Initial state
    assert.strictEqual(slides[0].classList.contains('active'), true);
    assert.strictEqual(slides[1].classList.contains('active'), false);
    assert.strictEqual(slides[2].classList.contains('active'), false);

    // First interval (5000ms)
    triggerInterval();
    assert.strictEqual(slides[0].classList.contains('active'), false);
    assert.strictEqual(slides[1].classList.contains('active'), true);
    assert.strictEqual(slides[2].classList.contains('active'), false);

    // Second interval (10000ms)
    triggerInterval();
    assert.strictEqual(slides[0].classList.contains('active'), false);
    assert.strictEqual(slides[1].classList.contains('active'), false);
    assert.strictEqual(slides[2].classList.contains('active'), true);

    // Third interval - wraps around (15000ms)
    triggerInterval();
    assert.strictEqual(slides[0].classList.contains('active'), true);
    assert.strictEqual(slides[1].classList.contains('active'), false);
    assert.strictEqual(slides[2].classList.contains('active'), false);
  });
});
