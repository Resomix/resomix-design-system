// Retakes the /lab/design screenshots (docs/lab-design/) and icon files (assets/icons/)
// by driving headless Chrome over the DevTools protocol.
// Run: npm run capture            (LAB_URL and CHROME override the defaults)
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const LAB_URL = process.env.LAB_URL ?? 'https://staging-frontend.resomix.com/lab/design';
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const W = 1280; // the desktop design width
const shotsDir = new URL('docs/lab-design/', root);
const iconsDir = new URL('assets/icons/', root);

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'rx-capture-'))}`, '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page'); }
    catch { await sleep(200); }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evaluate = async (expression) =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: LAB_URL });
  await sleep(6000);

  // Hide the site header, beta notice, cookie banner and player so sections capture clean.
  await evaluate(`(() => { for (const el of document.querySelectorAll('body *')) {
    const p = getComputedStyle(el).position;
    if ((p === 'fixed' || p === 'sticky') && !el.closest('main')) el.style.setProperty('display', 'none', 'important');
  } return true; })()`);
  // Scroll through once so lazy content renders.
  await evaluate(`(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
    scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); return true; })()`);
  await sleep(1500);

  // Sections are the targets of the page's own "On this page" links, plus the intro above them.
  const page = await evaluate(`(() => {
    const main = document.querySelector('main');
    const top = (el) => el.getBoundingClientRect().top + scrollY;
    const ids = [...new Set([...main.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)))];
    const list = [{ id: 'intro', y: top(main) }];
    for (const el of ids.map((i) => document.getElementById(i)).filter(Boolean)) list.push({ id: el.id, y: top(el) });
    list.sort((a, b) => a.y - b.y);
    const bottom = top(main) + main.getBoundingClientRect().height;
    return { height: document.documentElement.scrollHeight,
      sections: list.map((s, i) => ({ ...s, h: (list[i + 1]?.y ?? bottom) - s.y })) };
  })()`);

  mkdirSync(shotsDir, { recursive: true });
  for (const [i, s] of page.sections.entries()) {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
      clip: { x: 0, y: s.y, width: W, height: s.h, scale: 1 } });
    const file = `${String(i).padStart(2, '0')}-${s.id}.png`;
    writeFileSync(new URL(file, shotsDir), Buffer.from(shot.data, 'base64'));
    console.log(file);
  }
  const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: W, height: page.height, scale: 0.5 } });
  writeFileSync(new URL('full-page.png', shotsDir), Buffer.from(full.data, 'base64'));
  console.log('full-page.png');

  // Icons: each tile's <img> is an inlined data: SVG or a built asset URL, named by the tile's label.
  const icons = await evaluate(`(() => [...document.querySelectorAll('#icons img')].map((img) => {
    let tile = img;
    while (tile && !/\\.svg\\b/.test(tile.textContent)) tile = tile.parentElement;
    return { name: tile?.textContent.match(/[\\w-]+\\.svg/)?.[0], src: img.currentSrc || img.src };
  }).filter((i) => i.name))()`);
  mkdirSync(iconsDir, { recursive: true });
  for (const { name, src } of icons) {
    let body;
    if (src.startsWith('data:image/svg+xml;base64,')) body = Buffer.from(src.split(',')[1], 'base64').toString('utf8');
    else if (src.startsWith('data:image/svg+xml')) body = decodeURIComponent(src.slice(src.indexOf(',') + 1));
    else body = await (await fetch(src)).text();
    writeFileSync(new URL(name, iconsDir), body.trim() + '\n');
  }
  console.log(`${icons.length} icons`);
  ws.close();
} finally {
  chrome.kill();
}
