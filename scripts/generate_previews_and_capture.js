const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const artifactDir = 'C:\\Users\\bozan\\.gemini\\antigravity\\brain\\6e4acaaf-120c-4ac3-9f74-cd9e3784d759';
const tempDir = 'C:\\Users\\bozan\\AppData\\Local\\Temp';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const baseIndexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

const targets = [
  {
    name: 'screenshot_cards.png',
    fileName: 'preview_cards.html',
    modify: (html) => {
      let h = html.replace('id="splash-screen" class="screen-layer active"', 'id="splash-screen" class="screen-layer"');
      h = h.replace('id="main-menu" class="screen-layer"', 'id="main-menu" class="screen-layer active"');
      h = h.replace('id="modal-cards"', 'id="modal-cards" class="modal-backdrop open"');
      return h.replace('</body>', `<script>
        window.addEventListener('DOMContentLoaded', () => {
          if (window.game) {
            window.game.screenState = 'menu';
            window.game.populateCardsModal();
            document.getElementById('modal-cards').classList.add('open');
          }
        });
      </script></body>`);
    }
  },
  {
    name: 'screenshot_teamselect.png',
    fileName: 'preview_teamselect.html',
    modify: (html) => {
      let h = html.replace('id="splash-screen" class="screen-layer active"', 'id="splash-screen" class="screen-layer"');
      h = h.replace('id="main-menu" class="screen-layer"', 'id="main-menu" class="screen-layer active"');
      h = h.replace('id="modal-team-select"', 'id="modal-team-select" class="modal-backdrop open"');
      return h.replace('</body>', `<script>
        window.addEventListener('DOMContentLoaded', () => {
          if (window.game) {
            window.game.screenState = 'menu';
            window.game.populateTeamSelection();
            document.getElementById('modal-team-select').classList.add('open');
          }
        });
      </script></body>`);
    }
  },
  {
    name: 'screenshot_match.png',
    fileName: 'preview_match.html',
    modify: (html) => {
      let h = html.replace('id="splash-screen" class="screen-layer active"', 'id="splash-screen" class="screen-layer"');
      return h.replace('</body>', `<script>
        window.addEventListener('DOMContentLoaded', () => {
          if (window.game) {
            window.game.startMatch('real_madrid', 'al_nassr');
          }
        });
      </script></body>`);
    }
  }
];

console.log("Capturing targeted modal screenshots...");

for (const t of targets) {
  const previewPath = path.join(rootDir, t.fileName);
  const modifiedHtml = t.modify(baseIndexHtml);
  fs.writeFileSync(previewPath, modifiedHtml, 'utf8');

  const tempOut = path.join(tempDir, `shot_${t.name}`);
  const artifactOut = path.join(artifactDir, t.name);
  const rootOut = path.join(rootDir, t.name);

  const fileUri = `file:///${previewPath.replace(/\\/g, '/')}`;
  console.log(`Capturing ${t.name} from ${fileUri}...`);

  const cmd = `cmd /c ""${chromePath}" --headless=new --disable-gpu --allow-file-access-from-files --run-all-compositor-stages-before-draw --window-size=1600,950 --screenshot="${tempOut}" "${fileUri}""`;

  try {
    execSync(cmd, { timeout: 15000 });
    if (fs.existsSync(tempOut)) {
      fs.copyFileSync(tempOut, artifactOut);
      try { fs.copyFileSync(tempOut, rootOut); } catch (e) {}
      console.log(`[SUCCESS] Saved ${t.name} (${fs.statSync(tempOut).size} bytes)`);
    } else {
      console.error(`[FAIL] ${tempOut} not found`);
    }
  } catch (e) {
    console.error(`[ERROR] ${t.name}:`, e.message);
  }
}

console.log("All targeted captures completed!");
