const fs = require('fs');
const path = require('path');

const gameJsPath = path.join(__dirname, '..', 'game.js');
let content = fs.readFileSync(gameJsPath, 'utf8');

// 1. In constructor, add initial screenState and team keys
const oldConstructorPiece = `    this.baseFormationAway = [
      { role: "GK",  x: 48,  z: 0 },
      { role: "RB",  x: 30,  z: 18 },
      { role: "CB1", x: 34,  z: 7 },
      { role: "CB2", x: 34,  z: -7 },
      { role: "LB",  x: 30,  z: -18 },
      { role: "CDM", x: 18,  z: 0 },
      { role: "CM1", x: 10,  z: 13 },
      { role: "CAM", x: 4,   z: -13 },
      { role: "RW",  x: -16, z: 18 },
      { role: "ST",  x: -20, z: 0 },
      { role: "LW",  x: -16, z: -18 }
    ];

    this.initWorld();`;

const newConstructorPiece = `    this.baseFormationAway = [
      { role: "GK",  x: 48,  z: 0 },
      { role: "RB",  x: 30,  z: 18 },
      { role: "CB1", x: 34,  z: 7 },
      { role: "CB2", x: 34,  z: -7 },
      { role: "LB",  x: 30,  z: -18 },
      { role: "CDM", x: 18,  z: 0 },
      { role: "CM1", x: 10,  z: 13 },
      { role: "CAM", x: 4,   z: -13 },
      { role: "RW",  x: -16, z: 18 },
      { role: "ST",  x: -20, z: 0 },
      { role: "LW",  x: -16, z: -18 }
    ];

    // Screen State: 'splash', 'menu', 'match'
    this.screenState = 'splash';
    this.selectedHomeKey = 'real_madrid';
    this.selectedAwayKey = 'al_nassr';
    this.currentHomeTeam = TEAMS_DATABASE[this.selectedHomeKey];
    this.currentAwayTeam = TEAMS_DATABASE[this.selectedAwayKey];
    this.menuCamAngle = 0;
    this.currentCardFilter = { team: 'all', pos: 'all', tier: 'all', search: '' };

    this.initWorld();`;

if (!content.includes(oldConstructorPiece)) {
  console.error("Could not find constructor piece to replace!");
  process.exit(1);
}
content = content.replace(oldConstructorPiece, newConstructorPiece);

// 2. In createHumanoidPlayer, dynamic colors from current team
const oldColorsPiece = `    // Colors: Home (Navy Blue / Emerald), Away (Crimson / Gold)
    const jerseyColor = isHome ? (data.pos === 'GK' ? 0x0284c7 : 0x0f2b48) : (data.pos === 'GK' ? 0xf59e0b : 0x991b1b);
    const shortsColor = isHome ? 0xf8fafc : 0x1e293b;
    const skinTone = data.isStar && data.name.includes("Ronaldo") ? 0xd4a373 : (data.isStar && data.name.includes("Messi") ? 0xf3c59e : 0xe0ac69);
    const hairColor = data.isStar && data.name.includes("Ronaldo") ? 0x1a1a1a : (data.isStar && data.name.includes("Messi") ? 0x5c4033 : 0x262626);`;

const newColorsPiece = `    // Dynamic Team Colors
    const currentTeam = isHome ? (this.currentHomeTeam || TEAMS_DATABASE.real_madrid) : (this.currentAwayTeam || TEAMS_DATABASE.al_nassr);
    const jerseyColor = data.pos === 'GK' ? currentTeam.gkColor : (isHome ? currentTeam.homeColor : (currentTeam.awayColor || currentTeam.homeColor));
    const shortsColor = currentTeam.shortsColor || (isHome ? 0xf8fafc : 0x1e293b);
    const skinTone = data.isStar && data.name.includes("Ronaldo") ? 0xd4a373 : (data.isStar && data.name.includes("Messi") ? 0xf3c59e : 0xe0ac69);
    const hairColor = data.isStar && data.name.includes("Ronaldo") ? 0x1a1a1a : (data.isStar && data.name.includes("Messi") ? 0x5c4033 : 0x262626);`;

if (!content.includes(oldColorsPiece)) {
  console.error("Could not find colors piece in createHumanoidPlayer!");
  process.exit(1);
}
content = content.replace(oldColorsPiece, newColorsPiece);

// 3. In updateCamera, add cinematic menu orbit
const oldUpdateCameraPiece = `  updateCamera() {
    const focus = this.activePlayer ? this.activePlayer.mesh.position : new THREE.Vector3();`;

const newUpdateCameraPiece = `  updateCamera() {
    // In Splash or Main Menu: smooth cinematic orbit around stadium pitch
    if (this.screenState !== 'match') {
      this.menuCamAngle = (this.menuCamAngle || 0) + 0.0025;
      const radius = 42;
      this.camera.position.set(
        Math.sin(this.menuCamAngle) * radius,
        18,
        Math.cos(this.menuCamAngle) * radius
      );
      this.camera.lookAt(0, 1.5, 0);
      return;
    }

    const focus = this.activePlayer ? this.activePlayer.mesh.position : new THREE.Vector3();`;

if (!content.includes(oldUpdateCameraPiece)) {
  console.error("Could not find oldUpdateCameraPiece!");
  process.exit(1);
}
content = content.replace(oldUpdateCameraPiece, newUpdateCameraPiece);

// 4. In updateHUDPlayerCard, update player photo
const oldHudCardPiece = `  updateHUDPlayerCard() {
    if (!this.activePlayer) return;
    const d = this.activePlayer.data;
    document.getElementById('hud-player-rating').textContent = d.ovr;
    document.getElementById('hud-player-name').textContent = d.name.toUpperCase();
    document.getElementById('hud-player-num').textContent = \`#\${d.num}\`;
    document.getElementById('hud-player-pos').textContent = d.pos;
  }`;

const newHudCardPiece = `  updateHUDPlayerCard() {
    if (!this.activePlayer) return;
    const d = this.activePlayer.data;
    const ratingEl = document.getElementById('hud-player-rating');
    const nameEl = document.getElementById('hud-player-name');
    const numEl = document.getElementById('hud-player-num');
    const posEl = document.getElementById('hud-player-pos');
    const imgEl = document.getElementById('hud-player-img');

    if (ratingEl) ratingEl.textContent = d.ovr;
    if (nameEl) nameEl.textContent = d.name.toUpperCase();
    if (numEl) numEl.textContent = \`#\${d.num}\`;
    if (posEl) posEl.textContent = d.pos;
    if (imgEl && d.photo) {
      imgEl.src = \`assets/players/\${d.photo}.jpg\`;
      imgEl.style.display = 'block';
    }
  }`;

if (!content.includes(oldHudCardPiece)) {
  console.error("Could not find oldHudCardPiece!");
  process.exit(1);
}
content = content.replace(oldHudCardPiece, newHudCardPiece);

// 5. Replace initUI, toggleModal, populateCardsModal, populateSubsModal, executeSubstitution
const oldInitUIPiece = `  // --- UI & Modals Management ---
  initUI() {`;

const initUIIndex = content.indexOf(oldInitUIPiece);
if (initUIIndex === -1) {
  console.error("Could not find initUIIndex!");
  process.exit(1);
}

const newUIAndGameMethods = `  // --- UI & Modals Management ---
  initUI() {
    // --- SPLASH SCREEN LOGIC ---
    const splashScreen = document.getElementById('splash-screen');
    const mainMenu = document.getElementById('main-menu');
    const btnSplashStart = document.getElementById('btn-splash-start');

    const enterMainMenu = () => {
      if (this.screenState !== 'splash') return;
      this.audio.init();
      this.audio.playKick(0.7, 'power');
      this.screenState = 'menu';
      splashScreen?.classList.remove('active');
      mainMenu?.classList.add('active');
    };

    btnSplashStart?.addEventListener('click', enterMainMenu);
    window.addEventListener('keydown', (e) => {
      if (this.screenState === 'splash') {
        enterMainMenu();
      } else if (this.screenState === 'match' && e.code === 'Escape') {
        this.togglePauseMenu();
      }
    });

    // --- MAIN MENU TOOLBAR BUTTONS ---
    const btnAudio = document.getElementById('menu-btn-audio');
    const audioIcon = document.getElementById('menu-audio-icon');
    btnAudio?.addEventListener('click', () => {
      this.audio.enabled = !this.audio.enabled;
      if (audioIcon) {
        audioIcon.style.opacity = this.audio.enabled ? '1' : '0.35';
      }
      this.audio.playKick(0.3, 'finesse');
    });

    const btnFs = document.getElementById('menu-btn-fs');
    btnFs?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      this.audio.playKick(0.3, 'finesse');
    });

    // --- MAIN MENU HUB CARDS ---
    // 1. Play Hero Card -> Open Team Select Modal
    const btnHeroPlay = document.getElementById('btn-hero-play');
    const cardHeroMatch = document.getElementById('card-hero-match');
    const openTeamSelect = () => {
      this.audio.playKick(0.4, 'finesse');
      this.populateTeamSelection();
      this.toggleModal('modal-team-select');
    };
    btnHeroPlay?.addEventListener('click', openTeamSelect);

    // 2. Cards Hub Card -> Open Kartlarım Modal
    const btnCardsHub = document.getElementById('btn-open-cards-hub');
    const cardHubCards = document.getElementById('card-hub-cards');
    const openCards = () => {
      this.audio.playKick(0.4, 'finesse');
      this.populateCardsModal();
      this.toggleModal('modal-cards');
    };
    btnCardsHub?.addEventListener('click', openCards);

    // 3. Subs Hub Card
    document.getElementById('btn-open-subs-hub')?.addEventListener('click', () => {
      this.audio.playKick(0.4, 'finesse');
      this.populateSubsModal();
      this.toggleModal('modal-subs');
    });

    // 4. Settings Hub Card
    document.getElementById('btn-open-settings-hub')?.addEventListener('click', () => {
      this.audio.playKick(0.4, 'finesse');
      this.toggleModal('modal-settings');
    });

    // 5. Controls Guide
    document.getElementById('btn-open-controls-modal')?.addEventListener('click', () => {
      this.audio.playKick(0.4, 'finesse');
      this.toggleModal('modal-controls');
    });
    document.getElementById('btn-close-controls')?.addEventListener('click', () => {
      this.toggleModal('modal-controls');
    });

    // --- MODAL CLOSE BUTTONS ---
    document.getElementById('btn-close-team-select')?.addEventListener('click', () => this.toggleModal('modal-team-select'));
    document.getElementById('btn-close-cards')?.addEventListener('click', () => this.toggleModal('modal-cards'));
    document.getElementById('btn-close-subs')?.addEventListener('click', () => this.toggleModal('modal-subs'));
    document.getElementById('btn-close-settings')?.addEventListener('click', () => this.toggleModal('modal-settings'));

    // --- TEAM SELECT: START MATCH BUTTON ---
    document.getElementById('btn-confirm-start-match')?.addEventListener('click', () => {
      this.startMatch(this.selectedHomeKey, this.selectedAwayKey);
    });

    // --- IN-GAME HUD BUTTONS ---
    document.getElementById('btn-camera')?.addEventListener('click', () => this.cycleCamera());
    document.getElementById('btn-cards')?.addEventListener('click', () => {
      this.populateCardsModal();
      this.toggleModal('modal-cards');
    });
    document.getElementById('btn-subs')?.addEventListener('click', () => {
      this.populateSubsModal();
      this.toggleModal('modal-subs');
    });
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.togglePauseMenu();
    });

    // --- PAUSE MENU ACTIONS ---
    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      this.toggleModal('modal-pause');
      this.isPaused = false;
    });
    document.getElementById('btn-pause-subs')?.addEventListener('click', () => {
      this.populateSubsModal();
      this.toggleModal('modal-subs');
    });
    document.getElementById('btn-pause-cards')?.addEventListener('click', () => {
      this.populateCardsModal();
      this.toggleModal('modal-cards');
    });
    document.getElementById('btn-pause-settings')?.addEventListener('click', () => {
      this.toggleModal('modal-settings');
    });
    document.getElementById('btn-pause-main-menu')?.addEventListener('click', () => {
      this.returnToMainMenu();
    });
    document.getElementById('btn-fulltime-main-menu')?.addEventListener('click', () => {
      const ft = document.getElementById('fulltime-banner');
      if (ft) ft.style.display = 'none';
      this.returnToMainMenu();
    });

    // --- HALFTIME & FULLTIME RESTART BUTTONS ---
    document.getElementById('btn-resume-second-half')?.addEventListener('click', () => {
      const ht = document.getElementById('halftime-banner');
      if (ht) ht.style.display = 'none';
      this.matchHalf = 3;
      this.isPaused = false;
      this.resetKickoff();
      document.getElementById('half-display').textContent = '2. YARI';
    });

    document.getElementById('btn-restart-match')?.addEventListener('click', () => {
      const ft = document.getElementById('fulltime-banner');
      if (ft) ft.style.display = 'none';
      this.startMatch(this.selectedHomeKey, this.selectedAwayKey);
    });

    // --- KARTLARIM FILTERS & SEARCH ---
    const searchInput = document.getElementById('cards-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.currentCardFilter.search = e.target.value.trim().toLowerCase();
      this.populateCardsModal();
    });

    const setupFilterPills = (containerId, filterKey) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
          container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.currentCardFilter[filterKey] = pill.dataset[filterKey];
          this.audio.playKick(0.2, 'finesse');
          this.populateCardsModal();
        });
      });
    };

    setupFilterPills('team-filter-pills', 'team');
    setupFilterPills('pos-filter-pills', 'pos');
    setupFilterPills('tier-filter-pills', 'tier');

    // --- SETTINGS SEGMENTED CONTROLS ---
    const gfxButtons = document.querySelectorAll('#graphics-control .seg-btn');
    gfxButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        gfxButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setGraphicsQuality(btn.dataset.quality);
      });
    });

    const speedButtons = document.querySelectorAll('#speed-control .seg-btn');
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.timeScale = parseInt(btn.dataset.speed);
      });
    });

    const audioButtons = document.querySelectorAll('#audio-control .seg-btn');
    audioButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        audioButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.audio.enabled = btn.dataset.audio === 'on';
      });
    });

    // --- SUBSTITUTION CONFIRM ---
    document.getElementById('btn-confirm-sub')?.addEventListener('click', () => {
      this.executeSubstitution();
    });
  }

  togglePauseMenu() {
    const modal = document.getElementById('modal-pause');
    if (!modal) return;
    const isCurrentlyOpen = modal.classList.contains('open');

    if (!isCurrentlyOpen) {
      document.getElementById('pause-home-name').textContent = this.currentHomeTeam.name.toUpperCase();
      document.getElementById('pause-away-name').textContent = this.currentAwayTeam.name.toUpperCase();
      document.getElementById('pause-score').textContent = \`\${this.homeScore} - \${this.awayScore}\`;
      this.toggleModal('modal-pause');
      this.isPaused = true;
    } else {
      this.toggleModal('modal-pause');
      this.isPaused = false;
    }
  }

  toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const isOpen = modal.classList.contains('open');
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    if (!isOpen) {
      modal.classList.add('open');
      if (this.screenState === 'match') this.isPaused = true;
    } else {
      if (this.screenState === 'match') this.isPaused = false;
    }
  }

  // --- TEAM SELECTION MANAGEMENT ---
  populateTeamSelection() {
    const homeList = document.getElementById('home-team-list');
    const awayList = document.getElementById('away-team-list');
    if (!homeList || !awayList) return;

    homeList.innerHTML = '';
    awayList.innerHTML = '';

    const teams = Object.values(TEAMS_DATABASE);

    const updatePreview = () => {
      const hTeam = TEAMS_DATABASE[this.selectedHomeKey];
      const aTeam = TEAMS_DATABASE[this.selectedAwayKey];

      document.getElementById('sel-home-name').textContent = hTeam.name.toUpperCase();
      document.getElementById('home-att-val').textContent = hTeam.ratings.att;
      document.getElementById('home-att-bar').style.width = \`\${hTeam.ratings.att}%\`;
      document.getElementById('home-mid-val').textContent = hTeam.ratings.mid;
      document.getElementById('home-mid-bar').style.width = \`\${hTeam.ratings.mid}%\`;
      document.getElementById('home-def-val').textContent = hTeam.ratings.def;
      document.getElementById('home-def-bar').style.width = \`\${hTeam.ratings.def}%\`;

      document.getElementById('sel-away-name').textContent = aTeam.name.toUpperCase();
      document.getElementById('away-att-val').textContent = aTeam.ratings.att;
      document.getElementById('away-att-bar').style.width = \`\${aTeam.ratings.att}%\`;
      document.getElementById('away-mid-val').textContent = aTeam.ratings.mid;
      document.getElementById('away-mid-bar').style.width = \`\${aTeam.ratings.mid}%\`;
      document.getElementById('away-def-val').textContent = aTeam.ratings.def;
      document.getElementById('away-def-bar').style.width = \`\${aTeam.ratings.def}%\`;
    };

    teams.forEach(t => {
      // Home Pill
      const hPill = document.createElement('div');
      hPill.className = \`team-select-pill \${this.selectedHomeKey === t.key ? 'active' : ''}\`;
      hPill.innerHTML = \`
        <div class="team-pill-info">
          <span class="team-dot" style="background-color: #\${t.homeColor.toString(16).padStart(6, '0')}"></span>
          <span class="team-pill-name">\${t.name}</span>
        </div>
        <span class="team-pill-ovr">\${t.ratings.ovr} OVR</span>
      \`;
      hPill.addEventListener('click', () => {
        this.selectedHomeKey = t.key;
        homeList.querySelectorAll('.team-select-pill').forEach(p => p.classList.remove('active'));
        hPill.classList.add('active');
        this.audio.playKick(0.2, 'finesse');
        updatePreview();
      });
      homeList.appendChild(hPill);

      // Away Pill
      const aPill = document.createElement('div');
      aPill.className = \`team-select-pill \${this.selectedAwayKey === t.key ? 'active' : ''}\`;
      aPill.innerHTML = \`
        <div class="team-pill-info">
          <span class="team-dot" style="background-color: #\${t.homeColor.toString(16).padStart(6, '0')}"></span>
          <span class="team-pill-name">\${t.name}</span>
        </div>
        <span class="team-pill-ovr">\${t.ratings.ovr} OVR</span>
      \`;
      aPill.addEventListener('click', () => {
        this.selectedAwayKey = t.key;
        awayList.querySelectorAll('.team-select-pill').forEach(p => p.classList.remove('active'));
        aPill.classList.add('active');
        this.audio.playKick(0.2, 'finesse');
        updatePreview();
      });
      awayList.appendChild(aPill);
    });

    updatePreview();
  }

  // --- START MATCH & RETURN TO MAIN MENU ---
  startMatch(homeKey, awayKey) {
    this.selectedHomeKey = homeKey || 'real_madrid';
    this.selectedAwayKey = awayKey || 'al_nassr';
    this.currentHomeTeam = TEAMS_DATABASE[this.selectedHomeKey];
    this.currentAwayTeam = TEAMS_DATABASE[this.selectedAwayKey];

    PLAYER_DATABASE.home = this.currentHomeTeam.starters;
    PLAYER_DATABASE.away = this.currentAwayTeam.starters;
    PLAYER_DATABASE.benchHome = this.currentHomeTeam.bench;
    PLAYER_DATABASE.benchAway = this.currentAwayTeam.bench;

    // Spawn 11v11 squads
    this.spawnSquads();

    // Update scoreboard
    const homeNameEl = document.getElementById('hud-home-name');
    const awayNameEl = document.getElementById('hud-away-name');
    if (homeNameEl) homeNameEl.textContent = this.currentHomeTeam.shortName;
    if (awayNameEl) awayNameEl.textContent = this.currentAwayTeam.shortName;

    const homeDot = document.getElementById('hud-home-dot');
    const awayDot = document.getElementById('hud-away-dot');
    if (homeDot) homeDot.style.backgroundColor = '#' + this.currentHomeTeam.homeColor.toString(16).padStart(6, '0');
    if (awayDot) awayDot.style.backgroundColor = '#' + this.currentAwayTeam.homeColor.toString(16).padStart(6, '0');

    document.getElementById('score-home').textContent = '0';
    document.getElementById('score-away').textContent = '0';
    this.homeScore = 0;
    this.awayScore = 0;
    this.matchMinute = 0;
    this.matchHalf = 1;
    document.getElementById('clock-display').textContent = '00:00';
    document.getElementById('half-display').textContent = '1. YARI';

    // Transition Screens
    document.getElementById('splash-screen')?.classList.remove('active');
    document.getElementById('main-menu')?.classList.remove('active');
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    document.getElementById('hud-overlay').style.display = 'flex';

    this.currentCamIndex = 0; // Broadcast Cam
    this.screenState = 'match';
    this.isPaused = false;
    this.resetKickoff();
    this.audio.playWhistle();
  }

  returnToMainMenu() {
    this.screenState = 'menu';
    this.isPaused = true;

    // Hide Match HUD & modals
    document.getElementById('hud-overlay').style.display = 'none';
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));

    // Show Main Menu
    document.getElementById('main-menu')?.classList.add('active');
    this.audio.playKick(0.3, 'finesse');
  }

  // --- "KARTLARIM" (FUT ULTIMATE TEAM CARD SHOWCASE) ---
  populateCardsModal() {
    const container = document.getElementById('cards-container');
    if (!container) return;
    container.innerHTML = '';

    // Collect all players across the 5 top teams
    let allCards = [];
    Object.entries(TEAMS_DATABASE).forEach(([teamKey, teamData]) => {
      const teamPlayers = [...teamData.starters, ...(teamData.bench || [])];
      teamPlayers.forEach(p => {
        allCards.push({ ...p, teamKey: teamKey });
      });
    });

    // Apply Team Filter
    if (this.currentCardFilter.team && this.currentCardFilter.team !== 'all') {
      allCards = allCards.filter(c => c.teamKey === this.currentCardFilter.team);
    }

    // Apply Position Filter
    if (this.currentCardFilter.pos && this.currentCardFilter.pos !== 'all') {
      const pos = this.currentCardFilter.pos;
      if (pos === 'DEF') {
        allCards = allCards.filter(c => ['CB', 'RB', 'LB'].includes(c.pos));
      } else if (pos === 'MID') {
        allCards = allCards.filter(c => ['CDM', 'CM', 'CAM'].includes(c.pos));
      } else if (pos === 'FWD') {
        allCards = allCards.filter(c => ['ST', 'RW', 'LW', 'CF'].includes(c.pos));
      } else if (pos === 'GK') {
        allCards = allCards.filter(c => c.pos === 'GK');
      }
    }

    // Apply Tier Filter
    if (this.currentCardFilter.tier && this.currentCardFilter.tier !== 'all') {
      allCards = allCards.filter(c => c.tier === this.currentCardFilter.tier);
    }

    // Apply Search Filter
    if (this.currentCardFilter.search) {
      const query = this.currentCardFilter.search;
      allCards = allCards.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.club.toLowerCase().includes(query) || 
        c.pos.toLowerCase().includes(query)
      );
    }

    // Sort by tier descending, then by OVR descending
    const tierOrder = { legendary: 4, epic: 3, gold: 2, silver: 1 };
    allCards.sort((a, b) => {
      if (tierOrder[b.tier] !== tierOrder[a.tier]) {
        return tierOrder[b.tier] - tierOrder[a.tier];
      }
      return b.ovr - a.ovr;
    });

    if (allCards.length === 0) {
      container.innerHTML = \`<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--color-text-muted);">Aramanıza uygun oyuncu kartı bulunamadı.</div>\`;
      return;
    }

    allCards.forEach(d => {
      const card = document.createElement('div');
      card.className = \`player-card card-tier-\${d.tier}\`;

      const fallbackAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";

      card.innerHTML = \`
        <div class="card-tier-label">\${d.tier.toUpperCase()}</div>
        <div class="card-header-stats">
          <div class="card-ovr-box">
            <span class="card-ovr">\${d.ovr}</span>
            <span class="card-position">\${d.pos}</span>
          </div>
          <div class="card-meta-badges">
            <span class="card-num-badge">#\${d.num}</span>
            <span class="card-club-pill">\${d.clubShort}</span>
          </div>
        </div>
        <div class="card-player-portrait">
          <img src="assets/players/\${d.photo}.jpg" alt="\${d.name}" onerror="this.src='\${fallbackAvatar}'">
        </div>
        <div class="card-info">
          <div class="card-name">\${d.name}</div>
          <div class="card-physio">\${d.height}m &bull; \${d.weight}kg</div>
          <div class="card-stats-grid">
            <div class="card-stat-item"><span class="stat-val">\${d.pace}</span><span class="stat-key">PAC</span></div>
            <div class="card-stat-item"><span class="stat-val">\${d.sho}</span><span class="stat-key">SHO</span></div>
            <div class="card-stat-item"><span class="stat-val">\${d.pas}</span><span class="stat-key">PAS</span></div>
            <div class="card-stat-item"><span class="stat-val">\${d.dri}</span><span class="stat-key">DRI</span></div>
            <div class="card-stat-item"><span class="stat-val">\${d.def}</span><span class="stat-key">DEF</span></div>
            <div class="card-stat-item"><span class="stat-val">\${d.phy}</span><span class="stat-key">PHY</span></div>
          </div>
        </div>
      \`;

      card.addEventListener('click', () => {
        this.audio.playKick(0.3, 'finesse');
      });

      container.appendChild(card);
    });
  }

  // --- SUBSTITUTIONS MODAL ---
  populateSubsModal() {
    const startersList = document.getElementById('active-starters-list');
    const benchList = document.getElementById('bench-substitutes-list');
    if (!startersList || !benchList) return;

    startersList.innerHTML = '';
    benchList.innerHTML = '';

    this.selectedOutgoing = null;
    this.selectedIncoming = null;

    this.homePlayers.forEach(p => {
      const item = document.createElement('div');
      item.className = 'roster-item';
      item.innerHTML = \`
        <div class="roster-item-info">
          <span style="font-weight:700; color:var(--color-primary-light);">#\${p.data.num}</span>
          <span>\${p.data.name} (\${p.data.pos})</span>
        </div>
        <div class="roster-item-stamina">\${Math.round(p.stamina)}% COND</div>
      \`;
      item.addEventListener('click', () => {
        document.querySelectorAll('#active-starters-list .roster-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.selectedOutgoing = p;
        this.audio.playKick(0.2, 'finesse');
      });
      startersList.appendChild(item);
    });

    const benchPlayers = (this.currentHomeTeam && this.currentHomeTeam.bench) || [];
    benchPlayers.forEach(b => {
      const item = document.createElement('div');
      item.className = 'roster-item';
      item.innerHTML = \`
        <div class="roster-item-info">
          <span style="font-weight:700; color:var(--color-accent-light);">#\${b.num}</span>
          <span>\${b.name} (\${b.pos})</span>
        </div>
        <div class="roster-item-stamina" style="color:var(--color-accent-light);">100% COND</div>
      \`;
      item.addEventListener('click', () => {
        document.querySelectorAll('#bench-substitutes-list .roster-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.selectedIncoming = b;
        this.audio.playKick(0.2, 'finesse');
      });
      benchList.appendChild(item);
    });
  }

  executeSubstitution() {
    if (!this.selectedOutgoing || !this.selectedIncoming) {
      alert("Lütfen sahadan çıkacak oyuncuyu ve girecek yedeği seçin.");
      return;
    }

    const outP = this.selectedOutgoing;
    const inData = this.selectedIncoming;

    outP.data = inData;
    outP.stamina = 100;
    this.activePlayer = outP;
    this.updateHUDPlayerCard();

    this.audio.playKick(0.5, 'power');
    this.toggleModal('modal-subs');
  }

  setGraphicsQuality(level) {
    if (level === 'low') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.floodlights.forEach(l => l.castShadow = false);
    } else if (level === 'med') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = true;
      this.floodlights.forEach(l => l.castShadow = true);
    } else if (level === 'high') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.floodlights.forEach(l => l.castShadow = true);
    }
  }
}

// Start simulation on load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new FootballGame();
});
`;

content = content.slice(0, initUIIndex) + newUIAndGameMethods;

fs.writeFileSync(gameJsPath, content, 'utf8');
console.log("Successfully updated game.js methods!");
