const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://corviin-hub.onrender.com';
const OUTPUT_DESKTOP = path.resolve(__dirname, '../screenshots/desktop');
const OUTPUT_MOBILE = path.resolve(__dirname, '../screenshots/mobile');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

[OUTPUT_DESKTOP, OUTPUT_MOBILE].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function setupPageSession(page) {
  await page.evaluate(() => {
    localStorage.setItem('corviin-hub-state', JSON.stringify({
      state: {
        selectedProfileId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        selectedWorkspaceId: 'ws-tech-0001-0000-000000000001',
        theme: 'light'
      },
      version: 0
    }));
  });
}

async function runCapture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test targets across features, modals, popups, and drawers
  const testScenarios = [
    // 1. Navigation / Global Modals
    {
      name: '01_global_search_modal',
      url: `${BASE_URL}/app/dashboard`,
      action: async (p) => {
        // Trigger Ctrl+K or search button
        await p.keyboard.down('Control');
        await p.keyboard.press('KeyK');
        await p.keyboard.up('Control');
        await sleep(600);
      }
    },
    {
      name: '02_workspace_switcher_dropdown',
      url: `${BASE_URL}/app/dashboard`,
      action: async (p) => {
        // Click workspace switcher trigger
        const triggers = await p.$$('button');
        for (const btn of triggers) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('Corviin Tech') || text.includes('Switch workspace'))) {
            await btn.click();
            await sleep(500);
            break;
          }
        }
      }
    },
    {
      name: '03_contextual_create_popup',
      url: `${BASE_URL}/app/dashboard`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const ariaLabel = await p.evaluate(el => el.getAttribute('aria-label') || el.textContent, btn);
          if (ariaLabel && (ariaLabel.toLowerCase().includes('create') || ariaLabel.includes('New'))) {
            await btn.click();
            await sleep(500);
            break;
          }
        }
      }
    },
    {
      name: '04_notifications_popover',
      url: `${BASE_URL}/app/dashboard`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const label = await p.evaluate(el => el.getAttribute('aria-label') || '', btn);
          if (label.toLowerCase().includes('notification')) {
            await btn.click();
            await sleep(500);
            break;
          }
        }
      }
    },
    {
      name: '05_profile_menu_popup',
      url: `${BASE_URL}/app/dashboard`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const label = await p.evaluate(el => el.getAttribute('aria-label') || '', btn);
          if (label.toLowerCase().includes('profile') || label.toLowerCase().includes('account')) {
            await btn.click();
            await sleep(500);
            break;
          }
        }
      }
    },

    // 2. Tasks Sub-features & Modals
    {
      name: '06_create_task_dialog',
      url: `${BASE_URL}/app/my-tasks`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('New Task') || text.includes('Create Task'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },
    {
      name: '07_tasks_kanban_board_subfeature',
      url: `${BASE_URL}/app/my-tasks`,
      action: async (p) => {
        // Switch to Kanban board view
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.getAttribute('aria-label') || el.textContent, btn);
          if (text && (text.includes('Board') || text.includes('Kanban') || text.includes('Columns'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },

    // 3. Digital Asset Management Modals
    {
      name: '08_upload_asset_dialog',
      url: `${BASE_URL}/app/assets`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && text.includes('Upload Asset')) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },
    {
      name: '09_create_folder_dialog',
      url: `${BASE_URL}/app/assets`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('New Folder') || text.includes('Folder'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },

    // 4. CRM Modals & Sub-features
    {
      name: '10_create_crm_deal_dialog',
      url: `${BASE_URL}/app/crm/tech`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('New Deal') || text.includes('Add Deal') || text.includes('Add Lead') || text.includes('New Record') || text.includes('Create'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },
    {
      name: '11_create_partner_dialog',
      url: `${BASE_URL}/app/crm/real-estate/partners`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('New Partner') || text.includes('Add Partner') || text.includes('Add Channel') || text.includes('Create'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },

    // 5. Meetings Scheduling Dialog
    {
      name: '12_schedule_meeting_dialog',
      url: `${BASE_URL}/app/meetings`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('Schedule Meeting') || text.includes('New Meeting') || text.includes('Schedule'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },

    // 6. Plans & Goals Creation Dialog
    {
      name: '13_create_goal_dialog',
      url: `${BASE_URL}/app/plans-goals`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('New Goal') || text.includes('Create Goal') || text.includes('Add Goal') || text.includes('New Plan'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },

    // 7. Team Add Member Dialog
    {
      name: '14_add_team_member_dialog',
      url: `${BASE_URL}/app/team`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('Add Member') || text.includes('Invite') || text.includes('New Member'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    },

    // 8. Calendar Create Event Dialog
    {
      name: '15_create_calendar_event_dialog',
      url: `${BASE_URL}/app/calendar/content-campaigns`,
      action: async (p) => {
        const buttons = await p.$$('button');
        for (const btn of buttons) {
          const text = await p.evaluate(el => el.textContent, btn);
          if (text && (text.includes('Create Campaign') || text.includes('New Campaign') || text.includes('Schedule Post') || text.includes('New Event'))) {
            await btn.click();
            await sleep(600);
            break;
          }
        }
      }
    }
  ];

  // ==================== 1. CAPTURE DESKTOP (1440 x 900) ====================
  console.log('--- Capturing Desktop Views (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Init auth session
  await page.goto(`${BASE_URL}/select-profile`, { waitUntil: 'networkidle2', timeout: 35000 });
  await setupPageSession(page);

  for (const scenario of testScenarios) {
    try {
      console.log(`[Desktop] ${scenario.name}...`);
      await page.goto(scenario.url, { waitUntil: 'networkidle2', timeout: 35000 });
      await sleep(1000);
      if (scenario.action) {
        await scenario.action(page);
      }
      await sleep(500);
      const outPath = path.join(OUTPUT_DESKTOP, `${scenario.name}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
    } catch (e) {
      console.error(`Error capturing [Desktop] ${scenario.name}:`, e.message);
    }
  }

  // ==================== 2. CAPTURE MOBILE (390 x 844 iPhone 14) ====================
  console.log('--- Capturing Mobile Views (390x844) ---');
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  // Re-verify session in mobile view
  await page.goto(`${BASE_URL}/select-profile`, { waitUntil: 'networkidle2', timeout: 35000 });
  await setupPageSession(page);

  for (const scenario of testScenarios) {
    try {
      console.log(`[Mobile] ${scenario.name}...`);
      await page.goto(scenario.url, { waitUntil: 'networkidle2', timeout: 35000 });
      await sleep(1000);
      if (scenario.action) {
        await scenario.action(page);
      }
      await sleep(500);
      const outPath = path.join(OUTPUT_MOBILE, `${scenario.name}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
    } catch (e) {
      console.error(`Error capturing [Mobile] ${scenario.name}:`, e.message);
    }
  }

  console.log('Finished capturing all desktop and mobile subfeatures and popups!');
  await browser.close();
}

runCapture().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

