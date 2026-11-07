const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://corviin-hub.onrender.com';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
  { name: '01_select_profile', path: '/select-profile' },
  { name: '02_dashboard', path: '/app/dashboard' },
  { name: '03_my_tasks', path: '/app/my-tasks' },
  { name: '04_all_tasks', path: '/app/tasks' },
  { name: '05_plans_goals', path: '/app/plans-goals' },
  { name: '06_calendar_campaigns', path: '/app/calendar/content-campaigns' },
  { name: '07_calendar_team_tasks', path: '/app/calendar/team-tasks' },
  { name: '08_calendar_meetings', path: '/app/calendar/meetings-visits' },
  { name: '09_campaigns_list', path: '/app/campaigns' },
  { name: '10_assets_storage', path: '/app/assets' },
  { name: '11_crm_overview', path: '/app/crm' },
  { name: '12_crm_tech', path: '/app/crm/tech' },
  { name: '13_crm_re_partners', path: '/app/crm/real-estate/partners' },
  { name: '14_crm_re_buyers', path: '/app/crm/real-estate/buyers' },
  { name: '15_meetings', path: '/app/meetings' },
  { name: '16_team', path: '/app/team' },
  { name: '17_notifications', path: '/app/notifications' },
  { name: '18_settings', path: '/app/settings' },
  { name: '19_design_system', path: '/app/design-system' },
];

async function captureAll() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // First, open select-profile and log in with profile "Anant"
  console.log(`Navigating to ${BASE_URL}/select-profile...`);
  await page.goto(`${BASE_URL}/select-profile`, { waitUntil: 'networkidle2', timeout: 45000 });
  await sleep();

  // Take screenshot of select profile
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_select_profile.png'), fullPage: true });
  console.log('Saved 01_select_profile.png');

  // Click on "Anant" profile card
  try {
    const buttons = await page.$$('button');
    let anantClicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Anant')) {
        await btn.click();
        anantClicked = true;
        break;
      }
    }
    if (!anantClicked) {
      // Fallback: set in localStorage directly
      await page.evaluate(() => {
        localStorage.setItem('corviin-hub-state', JSON.stringify({
          state: {
            selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            selectedWorkspaceId: 'ws-tech-0001-0000-000000000001'
          },
          version: 0
        }));
      });
    }
  } catch (err) {
    console.error('Error clicking Anant:', err.message);
  }

  await sleep();

  // Ensure state is set
  await page.evaluate(() => {
    localStorage.setItem('corviin-hub-state', JSON.stringify({
      state: {
        selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        selectedWorkspaceId: 'ws-tech-0001-0000-000000000001'
      },
      version: 0
    }));
  });

  // Now capture each subsequent page
  for (let i = 1; i < PAGES.length; i++) {
    const p = PAGES[i];
    const url = `${BASE_URL}${p.path}`;
    console.log(`[${i}/${PAGES.length - 1}] Capturing ${p.name} from ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
      await sleep(); // Wait for API calls to settle
      const filePath = path.join(OUTPUT_DIR, `${p.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Saved ${p.name}.png`);
    } catch (e) {
      console.error(`Failed capturing ${p.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully in /screenshots!');
}

captureAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
