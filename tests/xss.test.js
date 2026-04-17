const assert = require('assert');

// Mock a simple DOM implementation
global.document = {
    createElement(tag) {
        return {
            type: 'element',
            tagName: tag.toUpperCase(),
            textContent: '',
            children: [],
            appendChild(node) {
                this.children.push(node);
            },
            replaceChildren() {
                this.children = [];
            }
        };
    },
    createTextNode(text) {
        return { type: 'text', textContent: text };
    }
};

// Simulate the logic we added to main.js
function parseHtmlSafe(rawText, el) {
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
}

function testXSS() {
    const el = document.createElement('div');
    const maliciousPayload = "Safe text <em>Em text</em> <script>alert('XSS')</script>";

    parseHtmlSafe(maliciousPayload, el);

    assert.strictEqual(el.children.length, 3);
    assert.strictEqual(el.children[0].type, 'text');
    assert.strictEqual(el.children[0].textContent, 'Safe text ');

    assert.strictEqual(el.children[1].type, 'element');
    assert.strictEqual(el.children[1].tagName, 'EM');
    assert.strictEqual(el.children[1].textContent, 'Em text');

    assert.strictEqual(el.children[2].type, 'text');
    // The script tag is treated as plain text
    assert.strictEqual(el.children[2].textContent, ' <script>alert(\'XSS\')</script>');

    console.log("XSS mitigation test passed!");
}

testXSS();
