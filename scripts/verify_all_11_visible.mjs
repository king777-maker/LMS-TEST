import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SNAPSHOTS_DIR = path.resolve('public/snapshots');
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

async function verifyAll11Visible() {
  console.log("===============================================================================");
  console.log("   BROADBEACH ACADEMY — VERIFY ALL 11 FREE COURSES VISIBILITY                  ");
  console.log("===============================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { width: 1920, height: 1080, name: '1920x1080' },
    { width: 1600, height: 900, name: '1600x900' },
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1366, height: 768, name: '1366x768' },
    { width: 1280, height: 800, name: '1280x800' }
  ];

  for (const vp of viewports) {
    console.log(`\n-------------------------------------------------------------------------------`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`-------------------------------------------------------------------------------`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    // Move mouse to top left first
    await page.mouse.move(0, 0);
    await new Promise(r => setTimeout(r, 200));

    // Find the nav button with text 'Free Courses'
    const buttons = await page.$$('nav button');
    let targetButton = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Free Courses')) {
        targetButton = btn;
        break;
      }
    }

    if (!targetButton) {
      console.error("[FAIL] Free Courses button not found!");
      continue;
    }

    // Hover over button
    await targetButton.hover();
    await new Promise(r => setTimeout(r, 600));

    // Inspect dropdown menu
    const dropdownInfo = await page.evaluate(() => {
      const menu = document.querySelector('#dropdown-menu-free-courses');
      if (!menu) return null;
      const rect = menu.getBoundingClientRect();

      // Find all course links
      const courseLinks = Array.from(menu.querySelectorAll('a[role="menuitem"]')).filter(
        a => !a.textContent.includes('Explore All')
      );

      // Find scrollable container
      const listContainer = menu.querySelector('.overflow-y-auto');

      const isListScrollable = listContainer
        ? listContainer.scrollHeight > listContainer.clientHeight + 2
        : false;

      const linksData = courseLinks.map((a, i) => {
        const linkRect = a.getBoundingClientRect();
        const isVisibleInMenu = linkRect.top >= rect.top && linkRect.bottom <= rect.bottom;
        return {
          index: i + 1,
          title: a.querySelector('span')?.textContent?.trim() || a.textContent.trim(),
          height: Math.round(linkRect.height),
          isVisibleInMenu
        };
      });

      return {
        menuWidth: Math.round(rect.width),
        menuHeight: Math.round(rect.height),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        totalCourses: courseLinks.length,
        isListScrollable,
        listScrollHeight: listContainer ? listContainer.scrollHeight : 0,
        listClientHeight: listContainer ? listContainer.clientHeight : 0,
        links: linksData
      };
    });

    if (!dropdownInfo) {
      console.error("[FAIL] Dropdown menu not visible!");
      continue;
    }

    console.log(`✓ Dropdown Dimensions: ${dropdownInfo.menuWidth}px wide x ${dropdownInfo.menuHeight}px high`);
    console.log(`✓ Total Courses Found: ${dropdownInfo.totalCourses}`);
    console.log(`✓ Internal Scrollbar: ${dropdownInfo.isListScrollable ? "ACTIVE (Needs optimization)" : "NONE (All visible simultaneously)"}`);

    let allVisible = true;
    for (const item of dropdownInfo.links) {
      console.log(`  [Course ${item.index}] (${item.height}px) "${item.title}" -> ${item.isVisibleInMenu ? "VISIBLE" : "CLIPPED/HIDDEN"}`);
      if (!item.isVisibleInMenu) allVisible = false;
    }

    const shotPath = path.join(SNAPSHOTS_DIR, `free_courses_all_11_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`✓ Saved visual snapshot: public/snapshots/free_courses_all_11_${vp.name}.png`);

    if (allVisible && !dropdownInfo.isListScrollable && dropdownInfo.totalCourses === 11) {
      console.log(`[PASS] Viewport ${vp.name}: ALL 11 COURSES VISIBLE SIMULTANEOUSLY WITH ZERO SCROLLBAR!`);
    } else {
      console.warn(`[WARN] Viewport ${vp.name}: Some courses clipped or scrollbar present.`);
    }
  }

  await browser.close();
  console.log("\nFinished visual verification!");
}

verifyAll11Visible().catch(console.error);
