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

  const metrics = await client.send('Performance.getMetrics');
  console.log('Time taken:', endTime - startTime, 'ms');
  const layoutCount = metrics.metrics.find(m => m.name === 'LayoutCount');
  const layoutDuration = metrics.metrics.find(m => m.name === 'LayoutDuration');
  console.log('LayoutCount:', layoutCount ? layoutCount.value : 'N/A');
  console.log('LayoutDuration:', layoutDuration ? layoutDuration.value : 'N/A');

  server.kill();
  await browser.close();
})();
