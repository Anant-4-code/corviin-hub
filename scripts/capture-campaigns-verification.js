const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/page09-verification');
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\fe518faf-b7cf-4fe3-a974-71c5fa4d6fd4\\campaigns-verification';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
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

  // Proxy /api/ requests to localhost:3001
  if (reqPath.startsWith('/api/')) {
    const proxyReq = http.request(
      `http://localhost:3001${req.url}`,
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: 'localhost:3001',
        },
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );
    proxyReq.on('error', () => {
      res.writeHead(502);
      res.end();
    });
    req.pipe(proxyReq);
    return;
  }

  let filePath = path.join(distPath, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distPath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + reqPath);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

async function main() {
  const PORT = 4175;
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  async function setupApp(theme = 'light') {
    await page.goto(`http://localhost:${PORT}/select-profile`, { waitUntil: 'networkidle0' });
    await page.evaluate((th) => {
      localStorage.setItem(
        'corviin-hub-state',
        JSON.stringify({
          state: {
            selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
            theme: th,
          },
          version: 0,
        }),
      );
      if (th === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, theme);
  }

  async function capture(fileName, width, height) {
    await page.setViewport({ width, height });
    await sleep(800);
    const dest1 = path.join(OUTPUT_DIR, fileName);
    const dest2 = path.join(ARTIFACTS_DIR, fileName);
    await page.screenshot({ path: dest1, fullPage: false });
    fs.copyFileSync(dest1, dest2);
    console.log(`Saved screenshot: ${fileName}`);
  }

  try {
    // 1. Desktop Light (Kanban Board View)
    console.log('Capturing 01_campaigns_board_view_desktop_light.png...');
    await setupApp('light');
    await page.goto(`http://localhost:${PORT}/app/campaigns`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    await capture('01_campaigns_board_view_desktop_light.png', 1440, 900);

    // 2. Desktop Dark (Kanban Board View)
    console.log('Capturing 02_campaigns_board_view_desktop_dark.png...');
    await setupApp('dark');
    await page.goto(`http://localhost:${PORT}/app/campaigns`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    await capture('02_campaigns_board_view_desktop_dark.png', 1440, 900);

    // 3. Desktop Grid View
    console.log('Capturing 03_campaigns_grid_view_desktop_light.png...');
    await setupApp('light');
    await page.goto(`http://localhost:${PORT}/app/campaigns`, { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Grid View"]');
      if (btn) btn.click();
    });
    await sleep(1000);
    await capture('03_campaigns_grid_view_desktop_light.png', 1440, 900);

    // 4. Desktop List View
    console.log('Capturing 04_campaigns_list_view_desktop_light.png...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="List View"]');
      if (btn) btn.click();
    });
    await sleep(1000);
    await capture('04_campaigns_list_view_desktop_light.png', 1440, 900);

    // 5. Campaign Detail Overview
    console.log('Capturing 05_campaign_detail_overview_light.png...');
    await page.goto(`http://localhost:${PORT}/app/campaigns/cmp-tech-001`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    await capture('05_campaign_detail_overview_light.png', 1440, 900);

    // 6. Campaign Detail Stage Workspace
    console.log('Capturing 06_campaign_detail_workspace_stage.png...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wsBtn = btns.find((b) => b.textContent && b.textContent.includes('Workspace'));
      if (wsBtn) wsBtn.click();
    });
    await sleep(1000);
    await capture('06_campaign_detail_workspace_stage.png', 1440, 900);

    // 7. Campaign Detail Assets Tab
    console.log('Capturing 07_campaign_detail_assets_tab.png...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const assetsBtn = btns.find((b) => b.textContent && b.textContent.includes('Assets'));
      if (assetsBtn) assetsBtn.click();
    });
    await sleep(1000);
    await capture('07_campaign_detail_assets_tab.png', 1440, 900);

    // 8. Mobile Light (Board/Cards)
    console.log('Capturing 08_campaigns_mobile_board_light.png...');
    await setupApp('light');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/app/campaigns`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    await capture('08_campaigns_mobile_board_light.png', 390, 844);

    // 9. Mobile Dark (Board/Cards)
    console.log('Capturing 09_campaigns_mobile_board_dark.png...');
    await setupApp('dark');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}/app/campaigns`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    await capture('09_campaigns_mobile_board_dark.png', 390, 844);

    console.log('All 9 campaign screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

main();

