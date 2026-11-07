const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/page03-04-verification');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(404);
    res.end();
  }
});

async function main() {
  server.listen(4173, async () => {
    console.log('Static web server running at http://localhost:4173');

    try {
      const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Seed local storage with selected profile and workspace
      await page.goto('http://localhost:4173/select-profile', { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        localStorage.setItem(
          'corviin-hub-state',
          JSON.stringify({
            state: {
              selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
              theme: 'light',
              sidebarCollapsed: false,
            },
            version: 0,
          }),
        );
      });

      // --- PAGE 03: MY TASKS ---
      console.log('Capturing Page 03: My Tasks Desktop Light...');
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto('http://localhost:4173/app/my-tasks', { waitUntil: 'networkidle0' });
      await sleep(1000);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '01_my_tasks_desktop_light.png'),
        fullPage: true,
      });

      console.log('Capturing Page 03: My Tasks Desktop Dark...');
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        const st = JSON.parse(localStorage.getItem('corviin-hub-state') || '{}');
        if (st.state) st.state.theme = 'dark';
        localStorage.setItem('corviin-hub-state', JSON.stringify(st));
      });
      await sleep(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '02_my_tasks_desktop_dark.png'),
        fullPage: true,
      });

      console.log('Capturing Page 03: My Tasks Mobile Light...');
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
      await page.setViewport({ width: 390, height: 844 });
      await sleep(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '03_my_tasks_mobile_light.png'),
        fullPage: true,
      });

      console.log('Capturing Page 03: My Tasks Mobile Dark...');
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await sleep(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '04_my_tasks_mobile_dark.png'),
        fullPage: true,
      });

      // --- PAGE 04: ALL TASKS ---
      console.log('Capturing Page 04: All Tasks Desktop Light...');
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto('http://localhost:4173/app/tasks', { waitUntil: 'networkidle0' });
      await sleep(1000);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '05_all_tasks_desktop_light.png'),
        fullPage: true,
      });

      console.log('Capturing Page 04: All Tasks Desktop Dark...');
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await sleep(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '06_all_tasks_desktop_dark.png'),
        fullPage: true,
      });

      console.log('Capturing Page 04: All Tasks Mobile Light...');
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
      await page.setViewport({ width: 390, height: 844 });
      await sleep(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '07_all_tasks_mobile_light.png'),
        fullPage: true,
      });

      console.log('Capturing Page 04: All Tasks Mobile Dark...');
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await sleep(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '08_all_tasks_mobile_dark.png'),
        fullPage: true,
      });

      // Capture Kanban view
      console.log('Capturing Kanban Board View...');
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
      await page.setViewport({ width: 1440, height: 900 });
      const kanbanBtn = await page.$('button[title="Kanban Board View"]');
      if (kanbanBtn) {
        await kanbanBtn.click();
        await sleep(500);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, '09_all_tasks_kanban_view.png'),
          fullPage: true,
        });
      }

      // Capture Workload view
      console.log('Capturing Team Workload View...');
      const workloadBtn = await page.$('button[title="By Member Workload View"]');
      if (workloadBtn) {
        await workloadBtn.click();
        await sleep(500);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, '10_all_tasks_workload_view.png'),
          fullPage: true,
        });
      }

      await browser.close();
      server.close();
      console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
      process.exit(0);
    } catch (err) {
      console.error('Error during screenshot capture:', err);
      server.close();
      process.exit(1);
    }
  });
}

main();
