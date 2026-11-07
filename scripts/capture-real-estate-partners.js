const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/page13-verification');
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\fe518faf-b7cf-4fe3-a974-71c5fa4d6fd4\\partners-verification';
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

async function run() {
  const PORT = 5176;
  server.listen(PORT, async () => {
    console.log(`Local web preview running at http://localhost:${PORT}`);

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      });

      const page = await browser.newPage();

      async function setupApp(theme = 'light') {
        await page.goto(`http://localhost:${PORT}/select-profile`, { waitUntil: 'domcontentloaded' });
        await page.evaluate((th) => {
          const stateData = {
            state: {
              selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              selectedWorkspaceId: 'ws-real-0002-0000-000000000002',
              theme: th,
              hasHydrated: true,
            },
            version: 0,
          };
          localStorage.setItem('corviin-hub-state', JSON.stringify(stateData));
          localStorage.setItem('corviin-app-store', JSON.stringify(stateData));
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

      // 1. Desktop Light Table View
      console.log('Capturing 01_re_partners_table_desktop_light.png...');
      await setupApp('light');
      await page.goto(`http://localhost:${PORT}/app/crm/real-estate/partners`, {
        waitUntil: 'domcontentloaded',
      });
      await sleep(1500);
      await capture('01_re_partners_table_desktop_light.png', 1440, 900);

      // 2. Desktop Dark Table View
      console.log('Capturing 02_re_partners_table_desktop_dark.png...');
      await setupApp('dark');
      await page.goto(`http://localhost:${PORT}/app/crm/real-estate/partners`, {
        waitUntil: 'domcontentloaded',
      });
      await sleep(1500);
      await capture('02_re_partners_table_desktop_dark.png', 1440, 900);

      // 3. Desktop Light Pipeline Board View
      console.log('Capturing 03_re_partners_board_desktop_light.png...');
      await setupApp('light');
      await page.goto(`http://localhost:${PORT}/app/crm/real-estate/partners`, {
        waitUntil: 'domcontentloaded',
      });
      await sleep(1500);
      const boardBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Pipeline Board'));
      });
      if (boardBtn) {
        await boardBtn.click();
        await sleep(800);
      }
      await capture('03_re_partners_board_desktop_light.png', 1440, 900);

      // 4. Desktop Dark Board View
      console.log('Capturing 04_re_partners_board_desktop_dark.png...');
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      await sleep(600);
      await capture('04_re_partners_board_desktop_dark.png', 1440, 900);

      // Revert to light and switch back to Table View for Drawer
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
      });
      const tableBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Table View'));
      });
      if (tableBtn) {
        await tableBtn.click();
        await sleep(600);
      }

      // 5. Open Partner Detail Drawer (Overview tab)
      console.log('Capturing 05_re_partner_detail_overview_light.png...');
      const detailsBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.trim() === 'Details');
      });
      if (detailsBtn) {
        await detailsBtn.click();
        await sleep(1000);
      }
      await capture('05_re_partner_detail_overview_light.png', 1440, 900);

      // 6. Switch to Projects Tab in Drawer
      console.log('Capturing 06_re_partner_detail_projects_tab.png...');
      const projectsTab = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Projects'));
      });
      if (projectsTab) {
        await projectsTab.click();
        await sleep(600);
      }
      await capture('06_re_partner_detail_projects_tab.png', 1440, 900);

      // 7. Switch to Stage History Tab in Drawer
      console.log('Capturing 07_re_partner_detail_activity_tab.png...');
      const historyTab = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Stage History'));
      });
      if (historyTab) {
        await historyTab.click();
        await sleep(600);
      }
      await capture('07_re_partner_detail_activity_tab.png', 1440, 900);

      // Close drawer
      await page.keyboard.press('Escape');
      await sleep(500);

      // 8. Mobile Table View Light (375x812)
      console.log('Capturing 08_re_partners_mobile_table_light.png...');
      await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
      await sleep(800);
      await capture('08_re_partners_mobile_table_light.png', 375, 812);

      // 9. Mobile Board View Dark
      console.log('Capturing 09_re_partners_mobile_board_dark.png...');
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      const mobileBoardBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Pipeline Board'));
      });
      if (mobileBoardBtn) {
        await mobileBoardBtn.click();
        await sleep(800);
      }
      await capture('09_re_partners_mobile_board_dark.png', 375, 812);

      console.log('All 9 verification screenshots captured successfully!');
    } catch (err) {
      console.error('Error during screenshot capture:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
      process.exit(0);
    }
  });
}

run();
