const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const artifactDir = 'C:\\Users\\bozan\\.gemini\\antigravity\\brain\\23579926-f21f-40f2-bf9b-b1494fdec93e';
if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
const tempDir = 'C:\\Users\\bozan\\AppData\\Local\\Temp';
const PORT = 3847;

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const mimeMap = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = path.join(rootDir, decodeURIComponent(parsedUrl.pathname));
  if (parsedUrl.pathname === '/') {
    filePath = path.join(rootDir, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeMap[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const screens = [
    { name: 'screenshot_splash.png', query: '' },
    { name: 'screenshot_mainmenu.png', query: '?screen=menu' },
    { name: 'screenshot_cards.png', query: '?screen=cards' },
    { name: 'screenshot_teamselect.png', query: '?screen=team_select' },
    { name: 'screenshot_match.png', query: '?screen=match' }
  ];

  for (const s of screens) {
    const tempOut = path.join(tempDir, `shot_${s.name}`);
    const artifactOut = path.join(artifactDir, s.name);
    const rootOut = path.join(rootDir, s.name);
    const targetUrl = `http://localhost:${PORT}/${s.query}`;

    console.log(`Capturing ${s.name} from ${targetUrl}...`);
    const cmd = `cmd /c ""${chromePath}" --headless=new --disable-gpu --virtual-time-budget=3000 --window-size=1600,950 --screenshot="${tempOut}" "${targetUrl}""`;

    try {
      execSync(cmd, { timeout: 25000 });
      if (fs.existsSync(tempOut)) {
        fs.copyFileSync(tempOut, artifactOut);
        try { fs.copyFileSync(tempOut, rootOut); } catch (e) {}
        console.log(`[OK] Saved ${s.name} (${fs.statSync(tempOut).size} bytes)`);
      } else {
        console.error(`[FAIL] ${tempOut} not created`);
      }
    } catch (e) {
      console.error(`[FAIL] Error capturing ${s.name}:`, e.message);
    }
  }

  server.close();
  console.log("All screenshots captured and saved!");
});
