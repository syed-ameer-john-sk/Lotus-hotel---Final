const { chromium } = require('playwright');
const http = require('http');

function waitServer(port) {
  return new Promise(resolve => {
    const check = () => {
      http.get(`http://localhost:${port}`, (res) => {
        resolve();
      }).on('error', () => {
        setTimeout(check, 100);
      });
    };
    check();
  });
}

(async () => {
  const { spawn } = require('child_process');
  const server = spawn('python3', ['-m', 'http.server', '8080']);

  await waitServer(8080);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // wait for domcontentloaded instead of load, because google fonts can cause timeouts
  await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });

  // Let the page settle
  await page.waitForTimeout(2000);

  // We are going to spam scroll events and see how many getBoundingClientRect calls are made
  await page.evaluate(() => {
    window.__gbcrCount = 0;
    const orig = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function() {
      window.__gbcrCount++;
      return orig.apply(this, arguments);
    };
  });

  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');

  const startTime = Date.now();
  for(let i = 0; i < 50; i++) {
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(20);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(20);
  }
  const endTime = Date.now();

  const count = await page.evaluate(() => window.__gbcrCount);
  console.log('getBoundingClientRect calls:', count);

  server.kill();
  await browser.close();
})();
