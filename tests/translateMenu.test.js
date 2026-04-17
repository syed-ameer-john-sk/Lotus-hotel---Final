const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

test('translateMenu works correctly and preserves HTML tags', () => {
  const mainJs = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf-8');
  const transJs = fs.readFileSync(path.join(__dirname, '../translations.js'), 'utf-8');

  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div class="menu-item-name">Poulet Tikka</div>
        <div class="curry-name">Agneau Korma <span class="menu-tag">V</span></div>
        <div class="drinks-item-name">Lassi Mangue</div>
        <script>
          // mock localStorage to avoid opaque origin errors
          window.localStorage = {
            getItem: () => 'fr',
            setItem: () => {}
          };
        </script>
        <script>${transJs}</script>
        <script>${mainJs}</script>
      </body>
    </html>
  `;

  // We set a dummy url to avoid localStorage security errors
  const dom = new JSDOM(html, { url: "http://localhost/", runScripts: "dangerously" });
  const window = dom.window;
  const document = window.document;

  // Initial state should be FR
  // Switch to EN
  window.translateMenu('en');

  // Assert regular menu item translation
  const menuItem = document.querySelector('.menu-item-name');
  assert.strictEqual(menuItem.textContent.trim(), 'Chicken Tikka');

  // Assert translation on item with nested child tag (like <span class="menu-tag">V</span>)
  const curryName = document.querySelector('.curry-name');

  // The first child node should be the text node, and it should be correctly translated
  const textNode = curryName.childNodes[0];
  assert.strictEqual(textNode.nodeType, window.Node.TEXT_NODE);
  assert.strictEqual(textNode.textContent.trim(), 'Lamb Korma');

  // The span tag should remain intact
  const vTag = curryName.querySelector('.menu-tag');
  assert.ok(vTag, 'menu-tag span should be preserved');
  assert.strictEqual(vTag.textContent, 'V');

  // Also check that it handles words not in dictionary gracefully
  const drinksItem = document.querySelector('.drinks-item-name');
  assert.strictEqual(drinksItem.textContent.trim(), 'Lassi Mango'); // 'Mangue' -> 'Mango', 'Lassi' not in dict

  // Switch back to FR
  window.translateMenu('fr');
  assert.strictEqual(menuItem.textContent.trim(), 'Poulet Tikka');
  assert.strictEqual(curryName.childNodes[0].textContent.trim(), 'Agneau Korma');
});
