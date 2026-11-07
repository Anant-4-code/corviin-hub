const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/page01-verification');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Serve dist folder locally
const distPath = path.resolve(__dirname, '../apps/web/dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.startsWith('/api/')) {
    // Mock profiles API
    if (reqPath.includes('/profiles')) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({
        data: [
          { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', displayName: 'Anant', initials: 'A', email: 'anant@corviin.com' },
          { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', displayName: 'Rohit', initials: 'R', email: 'rohit@corviin.com' },
          { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', displayName: 'Utkarsh', initials: 'U', email: 'utkarsh@corviin.com' }
        ]
      }));
    }
    if (reqPath.includes('/workspaces')) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({
        data: [
          { id: 'ws-tech-0001-0000-000000000001', name: 'Corviin Tech', slug: 'corviin-tech', type: 'TECH' }
        ]
      }));
    }
  }

  let filePath = path.join(distPath, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distPath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4173, async () => {
  console.log('Local test preview server running on port 4173');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'desktop_1440x900', width: 1440, height: 900, isMobile: false },
    { name: 'tablet_768x1024', width: 768, height: 1024, isMobile: true, hasTouch: true },
    { name: 'mobile_390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: 'mobile_360x800', width: 360, height: 800, isMobile: true, hasTouch: true },
  ];

  for (const vp of viewports) {
    // 1. LIGHT THEME
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
    await page.goto('http://localhost:4173/select-profile', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('corviin-hub-theme', 'light');
    });
    await sleep(600);

    // Initial state (none selected)
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_light_initial.png`), fullPage: true });

    // Click on Anant (selected state)
    const cards = await page.$$('[role="radio"]');
    if (cards.length > 0) {
      await cards[0].click();
      await sleep(400);
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_light_selected.png`), fullPage: true });
    }

    // 2. DARK THEME
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('corviin-hub-theme', 'dark');
    });
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}_dark_selected.png`), fullPage: true });
  }

  console.log('Successfully captured all verification viewports!');
  await browser.close();
  server.close();
  process.exit(0);
});

