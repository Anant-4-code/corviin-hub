const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/page17-verification');
const ARTIFACTS_DIR = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\fe518faf-b7cf-4fe3-a974-71c5fa4d6fd4\\notifications-verification';
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
  const PORT = 5179;
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
              selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
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

      // 1. Desktop Light Notifications View
      console.log('Capturing 01_notifications_desktop_light.png...');
      await setupApp('light');
      await page.goto(`http://localhost:${PORT}/app/notifications`, { waitUntil: 'domcontentloaded' });
      await sleep(1500);
      await capture('01_notifications_desktop_light.png', 1440, 900);

      // 2. Desktop Dark Notifications View
      console.log('Capturing 02_notifications_desktop_dark.png...');
      await setupApp('dark');
      await page.goto(`http://localhost:${PORT}/app/notifications`, { waitUntil: 'domcontentloaded' });
      await sleep(1500);
      await capture('02_notifications_desktop_dark.png', 1440, 900);

      // 3. Desktop Light Unread Filtered View
      console.log('Capturing 03_notifications_unread_filtered_light.png...');
      await setupApp('light');
      await page.goto(`http://localhost:${PORT}/app/notifications`, { waitUntil: 'domcontentloaded' });
      await sleep(1500);
      const unreadBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Unread') && !b.textContent.includes('Mark'));
      });
      if (unreadBtn) {
        await page.evaluate((b) => b && b.click(), unreadBtn);
        await sleep(800);
      }
      await capture('03_notifications_unread_filtered_light.png', 1440, 900);

      // 4. Desktop Light Activity Timeline Tab
      console.log('Capturing 04_activity_timeline_desktop_light.png...');
      await setupApp('light');
      await page.goto(`http://localhost:${PORT}/app/notifications`, { waitUntil: 'domcontentloaded' });
      await sleep(1500);
      const activityTab = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.getAttribute('aria-label') === 'Workspace Activity & Audit Timeline' || b.textContent.includes('Activity'));
      });
      if (activityTab) {
        await page.evaluate((b) => b && b.click(), activityTab);
        await sleep(1000);
      }
      await capture('04_activity_timeline_desktop_light.png', 1440, 900);

      // 5. Desktop Dark Activity Timeline Tab
      console.log('Capturing 05_activity_timeline_desktop_dark.png...');
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      await sleep(600);
      await capture('05_activity_timeline_desktop_dark.png', 1440, 900);

      // 6. Inspect Diff Drawer Open (Light)
      console.log('Capturing 06_activity_diff_drawer_light.png...');
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
      });
      await sleep(400);
      const inspectBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.textContent.includes('Inspect Diff'));
      });
      if (inspectBtn) {
        await page.evaluate((b) => b && b.click(), inspectBtn);
        await sleep(1000);
      }
      await capture('06_activity_diff_drawer_light.png', 1440, 900);

      // Close drawer
      const closeBtn = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.querySelector('svg.lucide-x'));
      });
      if (closeBtn) {
        await page.evaluate((b) => b && b.click(), closeBtn);
        await sleep(500);
      }

      // 7. Activity Filtered by Module (Light)
      console.log('Capturing 07_activity_filtered_module_light.png...');
      await page.evaluate(() => {
        const selects = document.querySelectorAll('select');
        if (selects.length > 0) {
          selects[0].value = 'CAMPAIGN';
          selects[0].dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await sleep(800);
      await capture('07_activity_filtered_module_light.png', 1440, 900);

      // 8. Mobile View Light (Notifications Tab)
      console.log('Capturing 08_notifications_mobile_light.png...');
      await setupApp('light');
      await page.goto(`http://localhost:${PORT}/app/notifications`, { waitUntil: 'domcontentloaded' });
      await sleep(1500);
      await capture('08_notifications_mobile_light.png', 390, 844);

      // 9. Mobile View Dark (Activity Tab)
      console.log('Capturing 09_activity_mobile_dark.png...');
      await setupApp('dark');
      await page.goto(`http://localhost:${PORT}/app/notifications`, { waitUntil: 'domcontentloaded' });
      await sleep(1500);
      const mobileActTab = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find((b) => b.getAttribute('aria-label') === 'Workspace Activity & Audit Timeline' || b.textContent.includes('Activity'));
      });
      if (mobileActTab) {
        await page.evaluate((b) => b && b.click(), mobileActTab);
        await sleep(800);
      }
      await capture('09_activity_mobile_dark.png', 390, 844);

      console.log('ALL 9 NOTIFICATIONS & ACTIVITY SCREENSHOTS CAPTURED SUCCESSFULLY!');
    } catch (err) {
      console.error('Error during capture:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
      process.exit(0);
    }
  });
}

run();

