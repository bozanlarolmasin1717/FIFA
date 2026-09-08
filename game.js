/**
 * YASIRIN FIFA - 11v11 FOOTBALL SIMULATION PROTOTYPE
 * High-performance 3D engine built on Three.js
 * Features:
 * - 11v11 Articulated Humanoid Players with distinct physiology (Messi, Ronaldo, GKs, Defenders)
 * - Full-scale pitch (100m x 64m playable on 116m x 80m manicured grass) with stadium stands & crowd
 * - Millimeter-accurate line markings, goal posts, netting, and boundary clamps
 * - Overhauled Ball Physics: Natural grass friction, bounce restitution, net ripple
 * - Fluid FIFA Passing: Distance-scaled velocity, smart directional targeting, proactive receiver runs & smooth control transfer
 * - Dynamic Shooting: W/S corner aim, power-scaled speed (75-125 km/h) & elevation, shot speed badge
 * - Active Goalkeepers: Goal line patrols and reactive diving parries
 * - Authentic Match Clock: Realistic half durations, Halftime whistle/modal, Full Time whistle & Full Match Restart
 * - Controls: WASD move, Shift sprint, Space player switch, LMB shoot/tackle, RMB pass, Q through ball, E cross, M slide, Z subs, C camera, ESC settings
 */

// --- Audio Synthesizer Integration (FIFAAudioEngine) ---
const FootballAudio = window.FIFAAudioEngine || class FootballAudioFallback {
  constructor() {
    this.enabled = true;
  }
  init() {}
  playKick() {}
  playCrossbar() {}
  playTackle() {}
  playNet() {}
  playWhistle() {}
  playGoalCelebration() {}
  playGoalRoar() {}
  playCrowdGasp() {}
  startStadiumCrowd() {}
  stopStadiumCrowd() {}
  startMusic() {}
  stopMusic() {}
  nextTrack() {}
  prevTrack() {}
  setMasterVolume() {}
  setMusicVolume() {}
  setSFXVolume() {}
  setCrowdVolume() {}
  toggleMute() { return false; }
  playUIHover() {}
  playUIClick() {}
};


// --- 5 TOP WORLD TEAMS DATABASE (63 LICENSED PLAYERS WITH PHOTOS) ---
const TEAMS_DATABASE = {
  real_madrid: {
    key: "real_madrid",
    name: "Real Madrid CF",
    shortName: "REAL MADRID",
    tag: "RMA",
    badge: "assets/badges/rma.svg",
    homeColor: 0xffffff,
    shortsColor: 0xf8fafc,
    accentColor: 0xf59e0b,
    gkColor: 0x0284c7,
    ratings: { ovr: 88, att: 90, mid: 88, def: 86 },
    starters: [
      { name: "Courtois", num: 1, pos: "GK", ovr: 89, tier: "gold", height: 1.99, weight: 96, pace: 50, sho: 20, pas: 65, dri: 48, def: 88, phy: 85, photo: "thibaut_courtois", club: "Real Madrid", clubShort: "RMA" },
      { name: "Carvajal", num: 2, pos: "RB", ovr: 85, tier: "gold", height: 1.73, weight: 73, pace: 82, sho: 60, pas: 80, dri: 81, def: 84, phy: 82, photo: "dani_carvajal", club: "Real Madrid", clubShort: "RMA" },
      { name: "Militao", num: 3, pos: "CB", ovr: 86, tier: "gold", height: 1.86, weight: 79, pace: 85, sho: 50, pas: 72, dri: 74, def: 86, phy: 84, photo: "eder_militao", club: "Real Madrid", clubShort: "RMA" },
      { name: "Rudiger", num: 22, pos: "CB", ovr: 87, tier: "epic", height: 1.90, weight: 85, pace: 82, sho: 53, pas: 71, dri: 70, def: 87, phy: 86, photo: "antonio_rudiger", club: "Real Madrid", clubShort: "RMA" },
      { name: "Mendy", num: 23, pos: "LB", ovr: 83, tier: "silver", height: 1.80, weight: 73, pace: 90, sho: 64, pas: 76, dri: 80, def: 82, phy: 85, photo: "ferland_mendy", club: "Real Madrid", clubShort: "RMA" },
      { name: "Tchouameni", num: 14, pos: "CDM", ovr: 85, tier: "gold", height: 1.87, weight: 81, pace: 76, sho: 72, pas: 82, dri: 79, def: 83, phy: 86, photo: "aurelien_tchouameni", club: "Real Madrid", clubShort: "RMA" },
      { name: "Valverde", num: 8, pos: "CM", ovr: 88, tier: "epic", height: 1.82, weight: 78, pace: 88, sho: 84, pas: 85, dri: 84, def: 80, phy: 85, photo: "federico_valverde", club: "Real Madrid", clubShort: "RMA" },
      { name: "Bellingham", num: 5, pos: "CAM", ovr: 90, tier: "epic", height: 1.86, weight: 77, pace: 82, sho: 86, pas: 88, dri: 90, def: 78, phy: 84, photo: "jude_bellingham", club: "Real Madrid", clubShort: "RMA", isStar: true },
      { name: "Rodrygo", num: 11, pos: "RW", ovr: 87, tier: "epic", height: 1.74, weight: 64, pace: 89, sho: 82, pas: 81, dri: 88, def: 40, phy: 68, photo: "rodrygo", club: "Real Madrid", clubShort: "RMA" },
      { name: "Mbappe", num: 9, pos: "ST", ovr: 92, tier: "legendary", height: 1.78, weight: 73, pace: 97, sho: 92, pas: 83, dri: 93, def: 36, phy: 78, photo: "kylian_mbappe", club: "Real Madrid", clubShort: "RMA", isStar: true },
      { name: "Vinicius Jr", num: 7, pos: "LW", ovr: 90, tier: "epic", height: 1.76, weight: 73, pace: 96, sho: 84, pas: 81, dri: 93, def: 35, phy: 72, photo: "vinicius_jr", club: "Real Madrid", clubShort: "RMA", isStar: true }
    ],
    bench: [
      { name: "Modric", num: 10, pos: "CM", ovr: 87, tier: "gold", height: 1.72, weight: 66, pace: 72, sho: 76, pas: 90, dri: 88, def: 72, phy: 66, photo: "luka_modric", club: "Real Madrid", clubShort: "RMA" },
      { name: "Camavinga", num: 6, pos: "CM", ovr: 84, tier: "silver", height: 1.82, weight: 68, pace: 82, sho: 68, pas: 82, dri: 84, def: 80, phy: 80, photo: "eduardo_camavinga", club: "Real Madrid", clubShort: "RMA" },
      { name: "Arda Guler", num: 15, pos: "CAM", ovr: 83, tier: "silver", height: 1.75, weight: 65, pace: 80, sho: 79, pas: 85, dri: 87, def: 45, phy: 60, photo: "arda_guler", club: "Real Madrid", clubShort: "RMA" }
    ]
  },

  man_city: {
    key: "man_city",
    name: "Manchester City",
    shortName: "MAN CITY",
    tag: "MCI",
    badge: "assets/badges/mci.svg",
    homeColor: 0x38bdf8,
    shortsColor: 0xf8fafc,
    accentColor: 0x0f172a,
    gkColor: 0x10b981,
    ratings: { ovr: 89, att: 91, mid: 91, def: 87 },
    starters: [
      { name: "Ederson", num: 31, pos: "GK", ovr: 88, tier: "gold", height: 1.88, weight: 86, pace: 60, sho: 30, pas: 92, dri: 70, def: 86, phy: 82, photo: "ederson", club: "Manchester City", clubShort: "MCI" },
      { name: "Walker", num: 2, pos: "RB", ovr: 85, tier: "gold", height: 1.78, weight: 70, pace: 91, sho: 63, pas: 77, dri: 78, def: 82, phy: 83, photo: "kyle_walker", club: "Manchester City", clubShort: "MCI" },
      { name: "Ruben Dias", num: 3, pos: "CB", ovr: 88, tier: "epic", height: 1.87, weight: 82, pace: 70, sho: 40, pas: 74, dri: 72, def: 89, phy: 87, photo: "ruben_dias", club: "Manchester City", clubShort: "MCI" },
      { name: "Stones", num: 5, pos: "CB", ovr: 85, tier: "gold", height: 1.88, weight: 76, pace: 72, sho: 51, pas: 80, dri: 79, def: 86, phy: 80, photo: "john_stones", club: "Manchester City", clubShort: "MCI" },
      { name: "Gvardiol", num: 24, pos: "LB", ovr: 86, tier: "gold", height: 1.85, weight: 80, pace: 83, sho: 65, pas: 80, dri: 81, def: 86, phy: 85, photo: "josko_gvardiol", club: "Manchester City", clubShort: "MCI" },
      { name: "Rodri", num: 16, pos: "CDM", ovr: 91, tier: "legendary", height: 1.91, weight: 82, pace: 68, sho: 80, pas: 88, dri: 84, def: 89, phy: 87, photo: "rodri", club: "Manchester City", clubShort: "MCI", isStar: true },
      { name: "De Bruyne", num: 17, pos: "CM", ovr: 91, tier: "legendary", height: 1.81, weight: 70, pace: 74, sho: 88, pas: 94, dri: 87, def: 65, phy: 77, photo: "kevin_de_bruyne", club: "Manchester City", clubShort: "MCI", isStar: true },
      { name: "Bernardo", num: 20, pos: "CAM", ovr: 88, tier: "epic", height: 1.73, weight: 64, pace: 76, sho: 79, pas: 88, dri: 92, def: 65, phy: 68, photo: "bernardo_silva", club: "Manchester City", clubShort: "MCI" },
      { name: "Foden", num: 47, pos: "RW", ovr: 89, tier: "epic", height: 1.71, weight: 64, pace: 87, sho: 84, pas: 86, dri: 91, def: 56, phy: 65, photo: "phil_foden", club: "Manchester City", clubShort: "MCI" },
      { name: "Haaland", num: 9, pos: "ST", ovr: 91, tier: "legendary", height: 1.94, weight: 88, pace: 90, sho: 94, pas: 68, dri: 81, def: 45, phy: 89, photo: "erling_haaland", club: "Manchester City", clubShort: "MCI", isStar: true },
      { name: "Grealish", num: 10, pos: "LW", ovr: 84, tier: "silver", height: 1.75, weight: 68, pace: 80, sho: 76, pas: 84, dri: 87, def: 47, phy: 74, photo: "jack_grealish", club: "Manchester City", clubShort: "MCI" }
    ],
    bench: [
      { name: "Doku", num: 11, pos: "RW", ovr: 83, tier: "silver", height: 1.73, weight: 68, pace: 95, sho: 72, pas: 76, dri: 88, def: 32, phy: 66, photo: "jeremy_doku", club: "Manchester City", clubShort: "MCI" },
      { name: "Kovacic", num: 8, pos: "CM", ovr: 84, tier: "silver", height: 1.77, weight: 80, pace: 72, sho: 71, pas: 85, dri: 87, def: 74, phy: 75, photo: "mateo_kovacic", club: "Manchester City", clubShort: "MCI" }
    ]
  },

  barcelona: {
    key: "barcelona",
    name: "FC Barcelona",
    shortName: "BARCELONA",
    tag: "FCB",
    badge: "assets/badges/fcb.svg",
    homeColor: 0x991b1b,
    shortsColor: 0x1e3a8a,
    accentColor: 0xf59e0b,
    gkColor: 0x0284c7,
    ratings: { ovr: 86, att: 88, mid: 87, def: 84 },
    starters: [
      { name: "Ter Stegen", num: 1, pos: "GK", ovr: 88, tier: "gold", height: 1.87, weight: 85, pace: 52, sho: 22, pas: 78, dri: 50, def: 87, phy: 82, photo: "ter_stegen", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Kounde", num: 23, pos: "RB", ovr: 85, tier: "gold", height: 1.80, weight: 75, pace: 84, sho: 48, pas: 76, dri: 78, def: 86, phy: 80, photo: "jules_kounde", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Araujo", num: 4, pos: "CB", ovr: 86, tier: "gold", height: 1.92, weight: 84, pace: 85, sho: 45, pas: 68, dri: 65, def: 87, phy: 86, photo: "ronald_araujo", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Cubarsi", num: 2, pos: "CB", ovr: 82, tier: "silver", height: 1.84, weight: 76, pace: 75, sho: 42, pas: 82, dri: 76, def: 83, phy: 78, photo: "pau_cubarsi", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Balde", num: 3, pos: "LB", ovr: 83, tier: "silver", height: 1.75, weight: 69, pace: 92, sho: 58, pas: 75, dri: 82, def: 78, phy: 76, photo: "alejandro_balde", club: "FC Barcelona", clubShort: "FCB" },
      { name: "De Jong", num: 21, pos: "CDM", ovr: 87, tier: "epic", height: 1.80, weight: 74, pace: 81, sho: 70, pas: 87, dri: 88, def: 80, phy: 79, photo: "frenkie_de_jong", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Pedri", num: 8, pos: "CM", ovr: 87, tier: "epic", height: 1.74, weight: 60, pace: 78, sho: 74, pas: 88, dri: 89, def: 72, phy: 70, photo: "pedri", club: "FC Barcelona", clubShort: "FCB", isStar: true },
      { name: "Gavi", num: 6, pos: "CAM", ovr: 84, tier: "silver", height: 1.73, weight: 70, pace: 80, sho: 70, pas: 82, dri: 84, def: 75, phy: 80, photo: "gavi", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Lamine Yamal", num: 19, pos: "RW", ovr: 86, tier: "epic", height: 1.78, weight: 65, pace: 90, sho: 81, pas: 84, dri: 90, def: 35, phy: 62, photo: "lamine_yamal", club: "FC Barcelona", clubShort: "FCB", isStar: true },
      { name: "Lewandowski", num: 9, pos: "ST", ovr: 89, tier: "epic", height: 1.85, weight: 81, pace: 75, sho: 90, pas: 79, dri: 85, def: 44, phy: 82, photo: "robert_lewandowski", club: "FC Barcelona", clubShort: "FCB", isStar: true },
      { name: "Raphinha", num: 11, pos: "LW", ovr: 86, tier: "gold", height: 1.76, weight: 68, pace: 91, sho: 82, pas: 82, dri: 86, def: 52, phy: 73, photo: "raphinha", club: "FC Barcelona", clubShort: "FCB" }
    ],
    bench: [
      { name: "Dani Olmo", num: 20, pos: "CAM", ovr: 85, tier: "gold", height: 1.79, weight: 72, pace: 78, sho: 81, pas: 85, dri: 86, def: 55, phy: 66, photo: "dani_olmo", club: "FC Barcelona", clubShort: "FCB" },
      { name: "Ferran Torres", num: 7, pos: "ST", ovr: 82, tier: "silver", height: 1.84, weight: 77, pace: 82, sho: 80, pas: 78, dri: 82, def: 45, phy: 73, photo: "ferran_torres", club: "FC Barcelona", clubShort: "FCB" }
    ]
  },

  bayern: {
    key: "bayern",
    name: "Bayern München",
    shortName: "BAYERN",
    tag: "BAY",
    badge: "assets/badges/bay.svg",
    homeColor: 0xdc2626,
    shortsColor: 0xdc2626,
    accentColor: 0xffffff,
    gkColor: 0x0284c7,
    ratings: { ovr: 87, att: 89, mid: 87, def: 86 },
    starters: [
      { name: "Neuer", num: 1, pos: "GK", ovr: 87, tier: "gold", height: 1.93, weight: 93, pace: 55, sho: 25, pas: 88, dri: 60, def: 86, phy: 84, photo: "manuel_neuer", club: "Bayern München", clubShort: "BAY" },
      { name: "Kimmich", num: 6, pos: "RB", ovr: 87, tier: "gold", height: 1.77, weight: 75, pace: 72, sho: 74, pas: 89, dri: 84, def: 84, phy: 80, photo: "joshua_kimmich", club: "Bayern München", clubShort: "BAY" },
      { name: "Upamecano", num: 2, pos: "CB", ovr: 84, tier: "silver", height: 1.86, weight: 90, pace: 82, sho: 42, pas: 70, dri: 72, def: 84, phy: 85, photo: "dayot_upamecano", club: "Bayern München", clubShort: "BAY" },
      { name: "Kim Min-jae", num: 3, pos: "CB", ovr: 85, tier: "gold", height: 1.90, weight: 86, pace: 80, sho: 40, pas: 68, dri: 70, def: 86, phy: 86, photo: "kim_min_jae", club: "Bayern München", clubShort: "BAY" },
      { name: "Davies", num: 19, pos: "LB", ovr: 85, tier: "gold", height: 1.83, weight: 77, pace: 95, sho: 68, pas: 78, dri: 85, def: 78, phy: 79, photo: "alphonso_davies", club: "Bayern München", clubShort: "BAY" },
      { name: "Goretzka", num: 8, pos: "CDM", ovr: 85, tier: "gold", height: 1.89, weight: 82, pace: 78, sho: 80, pas: 81, dri: 81, def: 80, phy: 84, photo: "leon_goretzka", club: "Bayern München", clubShort: "BAY" },
      { name: "Olise", num: 17, pos: "RW", ovr: 84, tier: "silver", height: 1.80, weight: 73, pace: 83, sho: 79, pas: 84, dri: 86, def: 50, phy: 66, photo: "michael_olise", club: "Bayern München", clubShort: "BAY" },
      { name: "Musiala", num: 42, pos: "CAM", ovr: 89, tier: "epic", height: 1.84, weight: 72, pace: 86, sho: 82, pas: 85, dri: 92, def: 64, phy: 68, photo: "jamal_musiala", club: "Bayern München", clubShort: "BAY", isStar: true },
      { name: "Sane", num: 10, pos: "LW", ovr: 85, tier: "gold", height: 1.83, weight: 80, pace: 90, sho: 83, pas: 80, dri: 87, def: 38, phy: 70, photo: "leroy_sane", club: "Bayern München", clubShort: "BAY" },
      { name: "Kane", num: 9, pos: "ST", ovr: 91, tier: "legendary", height: 1.88, weight: 89, pace: 74, sho: 93, pas: 84, dri: 83, def: 49, phy: 83, photo: "harry_kane", club: "Bayern München", clubShort: "BAY", isStar: true },
      { name: "Coman", num: 11, pos: "LW", ovr: 84, tier: "silver", height: 1.80, weight: 76, pace: 91, sho: 76, pas: 78, dri: 86, def: 34, phy: 64, photo: "kingsley_coman", club: "Bayern München", clubShort: "BAY" }
    ],
    bench: [
      { name: "Muller", num: 25, pos: "CAM", ovr: 84, tier: "silver", height: 1.85, weight: 76, pace: 68, sho: 81, pas: 83, dri: 79, def: 55, phy: 70, photo: "thomas_muller", club: "Bayern München", clubShort: "BAY" }
    ]
  },

  al_nassr: {
    key: "al_nassr",
    name: "Al-Nassr FC",
    shortName: "AL-NASSR",
    tag: "NAS",
    badge: "assets/badges/nas.svg",
    homeColor: 0xeab308,
    shortsColor: 0x1e3a8a,
    accentColor: 0x3b82f6,
    gkColor: 0x10b981,
    ratings: { ovr: 85, att: 92, mid: 84, def: 81 },
    starters: [
      { name: "Bento", num: 24, pos: "GK", ovr: 82, tier: "silver", height: 1.90, weight: 88, pace: 50, sho: 20, pas: 70, dri: 45, def: 82, phy: 80, photo: "bento", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Al-Ghannam", num: 2, pos: "RB", ovr: 81, tier: "silver", height: 1.73, weight: 67, pace: 86, sho: 60, pas: 76, dri: 79, def: 76, phy: 75, photo: "sultan_al_ghannam", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Laporte", num: 27, pos: "CB", ovr: 85, tier: "gold", height: 1.91, weight: 85, pace: 68, sho: 50, pas: 78, dri: 71, def: 86, phy: 82, photo: "aymeric_laporte", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Lajami", num: 78, pos: "CB", ovr: 80, tier: "silver", height: 1.83, weight: 76, pace: 76, sho: 38, pas: 66, dri: 65, def: 81, phy: 80, photo: "ali_lajami", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Alex Telles", num: 13, pos: "LB", ovr: 82, tier: "silver", height: 1.81, weight: 71, pace: 80, sho: 74, pas: 82, dri: 79, def: 78, phy: 76, photo: "alex_telles", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Brozovic", num: 77, pos: "CDM", ovr: 85, tier: "gold", height: 1.81, weight: 68, pace: 70, sho: 74, pas: 85, dri: 82, def: 82, phy: 84, photo: "marcelo_brozovic", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Otavio", num: 25, pos: "CM", ovr: 84, tier: "silver", height: 1.72, weight: 68, pace: 81, sho: 75, pas: 83, dri: 84, def: 75, phy: 78, photo: "otavio", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Talisca", num: 94, pos: "CAM", ovr: 84, tier: "silver", height: 1.90, weight: 80, pace: 82, sho: 86, pas: 80, dri: 83, def: 48, phy: 76, photo: "anderson_talisca", club: "Al-Nassr", clubShort: "NAS" },
      { name: "Ghareeb", num: 29, pos: "RW", ovr: 81, tier: "silver", height: 1.65, weight: 60, pace: 89, sho: 74, pas: 78, dri: 85, def: 38, phy: 60, photo: "abdulrahman_ghareeb", club: "Al-Nassr", clubShort: "NAS" },
      { name: "C. Ronaldo", num: 7, pos: "ST", ovr: 94, tier: "legendary", height: 1.87, weight: 83, pace: 92, sho: 95, pas: 82, dri: 88, def: 38, phy: 88, photo: "cristiano_ronaldo", club: "Al-Nassr", clubShort: "NAS", isStar: true },
      { name: "Mane", num: 10, pos: "LW", ovr: 86, tier: "gold", height: 1.75, weight: 69, pace: 90, sho: 83, pas: 80, dri: 87, def: 45, phy: 76, photo: "sadio_mane", club: "Al-Nassr", clubShort: "NAS", isStar: true }
    ],
    bench: []
  }
};

// Backward-compatible PLAYER_DATABASE reference pointing to current active teams
let PLAYER_DATABASE = {
  home: TEAMS_DATABASE.real_madrid.starters,
  away: TEAMS_DATABASE.al_nassr.starters,
  benchHome: TEAMS_DATABASE.real_madrid.bench,
  benchAway: TEAMS_DATABASE.al_nassr.bench
};

// =========================================================================
// GAMEPLAY & PHYSICS ARCHITECTURE MODULES
// =========================================================================

/**
 * GameplayEventDispatcher
 * Manages game events for rules, statistics, and game state systems.
 * Supports:
 * - OnBallPassed(player, power, target)
 * - OnShotTaken(player, power, direction)
 * - OnBallEnteredTrigger(triggerZoneName)
 */
class GameplayEventDispatcher {
  constructor(game) {
    this.game = game;
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  }

  addListener(eventName, callback) {
    return this.on(eventName, callback);
  }

  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }

  removeListener(eventName, callback) {
    this.off(eventName, callback);
  }

  emit(eventName, ...args) {
    // 1. Notify internal subscribers
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach(cb => {
        try {
          cb(...args);
        } catch (err) {
          console.error(`[EventDispatcher Error in ${eventName}]:`, err);
        }
      });
    }

    // 2. Dispatch browser CustomEvent on window for decoupled modules
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      try {
        let detail = {};
        if (eventName === 'OnBallPassed') {
          detail = { player: args[0], power: args[1], target: args[2] };
        } else if (eventName === 'OnShotTaken') {
          detail = { player: args[0], power: args[1], direction: args[2] };
        } else if (eventName === 'OnBallEnteredTrigger') {
          detail = { triggerZoneName: args[0] };
        } else {
          detail = { args };
        }
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
      } catch (e) {}
    }
  }
}

/**
 * PitchTriggerZoneSystem
 * Monitors pitch trigger zones (Penalty boxes, 6-yard boxes, center circle, thirds, goal mouths, sidelines)
 * and dispatches OnBallEnteredTrigger(zoneName) when ball enters a zone.
 */
class PitchTriggerZoneSystem {
  constructor(eventDispatcher) {
    this.events = eventDispatcher;
    this.activeZones = new Set();

    // Standard football pitch trigger zones (field: 100m length x 64m width, goals at X: +/-50.0)
    this.zones = [
      {
        name: 'CenterCircle',
        contains: (pos) => (pos.x * pos.x + pos.z * pos.z) <= (9.15 * 9.15)
      },
      {
        name: 'PenaltyBoxHome',
        contains: (pos) => (pos.x >= -50.0 && pos.x <= -33.5 && Math.abs(pos.z) <= 20.15)
      },
      {
        name: 'PenaltyBoxAway',
        contains: (pos) => (pos.x >= 33.5 && pos.x <= 50.0 && Math.abs(pos.z) <= 20.15)
      },
      {
        name: 'GoalAreaHome',
        contains: (pos) => (pos.x >= -50.0 && pos.x <= -44.5 && Math.abs(pos.z) <= 9.15)
      },
      {
        name: 'GoalAreaAway',
        contains: (pos) => (pos.x >= 44.5 && pos.x <= 50.0 && Math.abs(pos.z) <= 9.15)
      },
      {
        name: 'FinalThirdHome',
        contains: (pos) => (pos.x >= -50.0 && pos.x < -16.6 && Math.abs(pos.z) <= 32.0)
      },
      {
        name: 'MiddleThird',
        contains: (pos) => (pos.x >= -16.6 && pos.x <= 16.6 && Math.abs(pos.z) <= 32.0)
      },
      {
        name: 'FinalThirdAway',
        contains: (pos) => (pos.x > 16.6 && pos.x <= 50.0 && Math.abs(pos.z) <= 32.0)
      },
      {
        name: 'GoalHome',
        contains: (pos) => (pos.x < -50.0 && Math.abs(pos.z) <= 3.66 && pos.y <= 2.44)
      },
      {
        name: 'GoalAway',
        contains: (pos) => (pos.x > 50.0 && Math.abs(pos.z) <= 3.66 && pos.y <= 2.44)
      },
      {
        name: 'TouchlineTop',
        contains: (pos) => (pos.z < -32.0)
      },
      {
        name: 'TouchlineBottom',
        contains: (pos) => (pos.z > 32.0)
      },
      {
        name: 'GoalLineHome',
        contains: (pos) => (pos.x < -50.0 && Math.abs(pos.z) > 3.66)
      },
      {
        name: 'GoalLineAway',
        contains: (pos) => (pos.x > 50.0 && Math.abs(pos.z) > 3.66)
      }
    ];
  }

  update(ballPos) {
    if (!ballPos) return;
    const currentZones = new Set();

    for (let i = 0; i < this.zones.length; i++) {
      const z = this.zones[i];
      if (z.contains(ballPos)) {
        currentZones.add(z.name);
        if (!this.activeZones.has(z.name)) {
          // Entered new trigger zone
          this.events.emit('OnBallEnteredTrigger', z.name);
          if (this.events.game && typeof this.events.game.onBallEnteredTrigger === 'function') {
            this.events.game.onBallEnteredTrigger(z.name);
          }
        }
      }
    }

    this.activeZones = currentZones;
  }
}

/**
 * =========================================================================
 * MATCH MANAGER & GAME LOOP SYSTEM
 * Handles:
 * 1. Match State Machine (WarmUp, KickOff, Playing, GoalScored, OutOfBounds, FullTime)
 * 2. Countdown Match Timer (90 game mins / 5 real mins = 300s countdown)
 * 3. Boundary & Trigger Zone Controls (Goal line detection, Throw-in, Corner kick, Goal kick)
 * 4. Score Management & Minimal Match HUD Synchronization
 * =========================================================================
 */
const MatchState = Object.freeze({
  WARM_UP: 'WarmUp',
  KICK_OFF: 'KickOff',
  PLAYING: 'Playing',
  GOAL_SCORED: 'GoalScored',
  OUT_OF_BOUNDS: 'OutOfBounds',
  FULL_TIME: 'FullTime'
});

class MatchManager {
  constructor(game) {
    this.game = game;
    this.state = MatchState.WARM_UP;
    this.previousState = null;

    // Countdown Match Timer: 5 real minutes (300 seconds) = 90 game minutes
    this.totalRealSeconds = 300.0;
    this.remainingSeconds = 300.0;
    this.totalGameMinutes = 90.0;

    // Score State
    this.homeScore = 0;
    this.awayScore = 0;

    // State Transitions & Timers
    this.stateTimer = 0.0;
    this.lastScoringTeam = null; // 'home' or 'away'
    this.lastScorerPlayer = null;
    this.outOfBoundsType = null; // 'throw_in', 'corner', 'goal_kick'
    this.outOfBoundsBeneficiary = null; // 'home' or 'away'

    // UI Element Cache
    this.ui = {
      scoreHome: null,
      scoreAway: null,
      clockTime: null,
      clockGameMin: null,
      stateBadge: null,
      goalBanner: null,
      goalScorer: null,
      eventPill: null,
      fulltimeBanner: null,
      fulltimeScore: null
    };
  }

  init() {
    this.cacheUIElements();
    this.setupEventListeners();
  }

  cacheUIElements() {
    this.ui.scoreHome = document.getElementById('score-home');
    this.ui.scoreAway = document.getElementById('score-away');
    this.ui.clockTime = document.getElementById('clock-display');
    this.ui.clockGameMin = document.getElementById('half-display');
    this.ui.stateBadge = document.getElementById('hud-match-state-badge');
    this.ui.goalBanner = document.getElementById('goal-banner');
    this.ui.goalScorer = document.getElementById('goal-scorer-info');
    this.ui.eventPill = document.getElementById('hud-event-pill');
    this.ui.fulltimeBanner = document.getElementById('fulltime-banner');
    this.ui.fulltimeScore = document.getElementById('fulltime-score-text');
  }

  setupEventListeners() {
    // Restart match button in Full Time modal
    const restartBtn = document.getElementById('btn-restart-match');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (this.ui.fulltimeBanner) this.ui.fulltimeBanner.style.display = 'none';
        this.game.startMatch(this.game.selectedHomeKey, this.game.selectedAwayKey);
      });
    }

    const menuBtn = document.getElementById('btn-fulltime-main-menu') || document.getElementById('btn-fulltime-menu');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        if (this.ui.fulltimeBanner) this.ui.fulltimeBanner.style.display = 'none';
        this.game.returnToMainMenu();
      });
    }
  }

  startMatch(homeKey, awayKey) {
    this.cacheUIElements();
    this.homeScore = 0;
    this.awayScore = 0;
    this.remainingSeconds = this.totalRealSeconds;
    this.stateTimer = 2.0; // 2s WarmUp introduction
    this.lastScoringTeam = null;
    this.lastScorerPlayer = null;
    this.outOfBoundsType = null;

    if (this.ui.fulltimeBanner) this.ui.fulltimeBanner.style.display = 'none';
    if (this.ui.goalBanner) this.ui.goalBanner.classList.remove('show');
    if (this.ui.eventPill) this.ui.eventPill.classList.remove('active');

    this.updateHUD();
    this.setState(MatchState.WARM_UP);
  }

  setState(newState, meta = {}) {
    if (this.state === newState && newState !== MatchState.OUT_OF_BOUNDS) return;
    this.previousState = this.state;
    this.state = newState;

    // Dispatch custom event for extensible systems
    if (this.game.events) {
      this.game.events.emit('OnMatchStateChanged', {
        state: this.state,
        previousState: this.previousState,
        meta
      });
    }

    this.onStateEnter(newState, meta);
    this.updateHUDStateBadge();
  }

  onStateEnter(state, meta) {
    switch (state) {
      case MatchState.WARM_UP:
        this.stateTimer = 2.0;
        this.showEventPill('MAÇ BAŞLIYOR', 'warmup');
        break;

      case MatchState.KICK_OFF:
        this.stateTimer = 0;
        this.showEventPill('BAŞLAMA VURUŞU', 'kickoff');
        break;

      case MatchState.PLAYING:
        this.hideEventPill();
        break;

      case MatchState.GOAL_SCORED:
        this.stateTimer = 3.5; // 3.5 seconds goal celebration
        this.showGoalBanner(meta.scorer, meta.isHome);
        break;

      case MatchState.OUT_OF_BOUNDS:
        this.stateTimer = 1.4; // Brief positioning pause
        if (meta.subType === 'throw_in') {
          this.showEventPill('TAÇ ATIŞI', 'touchline');
        } else if (meta.subType === 'corner') {
          this.showEventPill('KÖŞE VURUŞU', 'corner');
        } else if (meta.subType === 'goal_kick') {
          this.showEventPill('AUT ATIŞI', 'goalkick');
        }
        break;

      case MatchState.FULL_TIME:
        this.game.isPaused = true;
        this.game.audio.playWhistle('long');
        this.showFullTimeModal();
        break;
    }
  }

  update(dt) {
    if (this.game.isPaused && this.state !== MatchState.WARM_UP) return;

    // 1. State Machine Transitions
    switch (this.state) {
      case MatchState.WARM_UP:
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          this.setState(MatchState.KICK_OFF);
        }
        break;

      case MatchState.KICK_OFF:
        // Transition to Playing once ball is kicked or moved
        if (this.game.ball && this.game.ballVel) {
          const ballMoved = this.game.ball.position.lengthSq() > 0.6 || this.game.ballVel.lengthSq() > 1.2;
          if (ballMoved) {
            this.setState(MatchState.PLAYING);
          }
        }
        break;

      case MatchState.PLAYING:
        // 2. Countdown Match Timer (300s -> 0s)
        this.remainingSeconds -= dt;
        if (this.remainingSeconds <= 0) {
          this.remainingSeconds = 0;
          this.setState(MatchState.FULL_TIME);
        }
        this.updateHUDClock();
        break;

      case MatchState.GOAL_SCORED:
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          if (this.ui.goalBanner) this.ui.goalBanner.classList.remove('show');
          // Reset players and ball to kickoff positions
          // The conceding team gets kickoff possession
          const kickoffTeam = this.lastScoringTeam === 'home' ? 'away' : 'home';
          this.game.resetKickoff(kickoffTeam);
          this.setState(MatchState.KICK_OFF);
        }
        break;

      case MatchState.OUT_OF_BOUNDS:
        this.stateTimer -= dt;
        if (this.stateTimer <= 0) {
          this.hideEventPill();
          this.setState(MatchState.PLAYING);
        }
        break;

      case MatchState.FULL_TIME:
        // Handled in onStateEnter
        break;
    }
  }

  // --- Trigger Zone Boundary Handlers ---
  handleTriggerZone(zoneName) {
    if (this.state !== MatchState.PLAYING && this.state !== MatchState.KICK_OFF) return;

    if (zoneName === 'GoalHome') {
      // Ball entered Home Goal -> Away team scores!
      this.triggerGoal(false);
    } else if (zoneName === 'GoalAway') {
      // Ball entered Away Goal -> Home team scores!
      this.triggerGoal(true);
    } else if (zoneName === 'TouchlineTop' || zoneName === 'TouchlineBottom') {
      this.triggerThrowIn();
    } else if (zoneName === 'GoalLineHome') {
      this.triggerGoalLineOutOfBounds(true);
    } else if (zoneName === 'GoalLineAway') {
      this.triggerGoalLineOutOfBounds(false);
    }
  }

  triggerGoal(isHomeScored) {
    if (this.state === MatchState.GOAL_SCORED) return;

    if (isHomeScored) {
      this.homeScore++;
      this.lastScoringTeam = 'home';
    } else {
      this.awayScore++;
      this.lastScoringTeam = 'away';
    }

    const defaultScorer = isHomeScored
      ? (this.game.homePlayers.find(p => p.data.pos === 'ST') || this.game.homePlayers[9] || this.game.homePlayers[0]).data.name
      : (this.game.awayPlayers.find(p => p.data.pos === 'ST') || this.game.awayPlayers[9] || this.game.awayPlayers[0]).data.name;

    const scorerName = (this.game.lastKicker && this.game.lastKicker.data) ? this.game.lastKicker.data.name : defaultScorer;
    this.lastScorerPlayer = scorerName;

    // Audio & Atmospheric Effects
    this.game.audio.playGoalRoar();
    this.game.audio.playWhistle();
    this.game.spawnConfetti();
    this.game.cameraShake = 0.45;

    // Trigger celebrations & reactions
    const scoringSquad = isHomeScored ? this.game.homePlayers : this.game.awayPlayers;
    const concedingSquad = isHomeScored ? this.game.awayPlayers : this.game.homePlayers;

    let scorerObj = this.game.lastKicker;
    if (!scorerObj || !scoringSquad.includes(scorerObj)) {
      scorerObj = scoringSquad.find(p => p.data.pos === 'ST') || scoringSquad[9] || scoringSquad[0];
    }

    if (scorerObj) {
      scorerObj.isCelebrating = true;
      scorerObj.celebrationTimer = 4.5;
      const isRonaldo = scorerObj.data && scorerObj.data.name.includes('Ronaldo');
      scorerObj.celebrationType = isRonaldo ? 'siuuu' : (Math.random() < 0.5 ? 'knee_slide' : 'siuuu');
    }

    // Teammates rush to celebrate
    scoringSquad.forEach(p => {
      if (p !== scorerObj && !p.isSentOff) {
        p.isTeammateCelebrating = true;
      }
    });

    // Conceding team disappointment
    concedingSquad.forEach(p => {
      if (!p.isSentOff) {
        p.isConcedingDisappointed = true;
      }
    });

    this.updateHUDScore();
    this.setState(MatchState.GOAL_SCORED, { scorer: scorerName, isHome: isHomeScored });
  }

  triggerThrowIn() {
    if (this.state === MatchState.GOAL_SCORED || this.state === MatchState.OUT_OF_BOUNDS) return;

    const lastKicker = this.game.lastKicker;
    const isLastKickerHome = lastKicker ? this.game.homePlayers.includes(lastKicker) : true;
    const beneficiary = isLastKickerHome ? 'away' : 'home';

    this.game.audio.playWhistle();

    // Clamp ball to sideline
    const ballPos = this.game.ball.position;
    const touchZ = Math.sign(ballPos.z) * 31.8;
    const touchX = THREE.MathUtils.clamp(ballPos.x, -45.0, 45.0);
    this.game.ball.position.set(touchX, this.game.ballRadius, touchZ);
    this.game.ballVel.set(0, 0, 0);
    this.game.ballSpin.set(0, 0, 0);
    this.game.kickCooldown = 0.6;

    // Position closest outfield player of beneficiary team
    const playersList = beneficiary === 'home' ? this.game.homePlayers : this.game.awayPlayers;
    let nearest = playersList[1];
    let minDist = 999;
    playersList.forEach(p => {
      if (p.data.pos === 'GK') return;
      const d = p.mesh.position.distanceTo(ballPos);
      if (d < minDist) { minDist = d; nearest = p; }
    });

    if (nearest) {
      nearest.mesh.position.set(touchX, 0, touchZ);
      nearest.hasPossession = true;
      if (beneficiary === 'home') {
        if (this.game.activePlayer && this.game.activePlayer.parts) {
          this.game.activePlayer.parts.selectionRing.material.opacity = 0;
        }
        this.game.activePlayer = nearest;
        this.game.updateHUDPlayerCard();
      }
    }

    this.setState(MatchState.OUT_OF_BOUNDS, { subType: 'throw_in', beneficiary });
  }

  triggerGoalLineOutOfBounds(isHomeEnd) {
    if (this.state === MatchState.GOAL_SCORED || this.state === MatchState.OUT_OF_BOUNDS) return;

    // Disregard if ball is inside the goal mouth
    const inGoalMouth = Math.abs(this.game.ball.position.z) <= (this.game.goalWidth / 2) && this.game.ball.position.y <= this.game.goalHeight;
    if (inGoalMouth) return;

    const lastKicker = this.game.lastKicker;
    const isLastKickerHome = lastKicker ? this.game.homePlayers.includes(lastKicker) : false;

    this.game.audio.playWhistle();

    // Standard Football Rules:
    // If ball went over Home end line (x < -50):
    // - Last touched by Defending Home player -> Away Corner Kick
    // - Last touched by Attacking Away player -> Home Goal Kick
    // If ball went over Away end line (x > 50):
    // - Last touched by Defending Away player -> Home Corner Kick
    // - Last touched by Attacking Home player -> Away Goal Kick

    const isCorner = isHomeEnd ? isLastKickerHome : !isLastKickerHome;

    if (isCorner) {
      // CORNER KICK
      const cornerX = isHomeEnd ? -48.5 : 48.5;
      const cornerZ = Math.sign(this.game.ball.position.z || 1) * 30.5;
      this.game.ball.position.set(cornerX, this.game.ballRadius, cornerZ);
      this.game.ballVel.set(0, 0, 0);
      this.game.ballSpin.set(0, 0, 0);
      this.game.kickCooldown = 0.8;

      const attackingTeam = isHomeEnd ? 'away' : 'home';
      const attackers = attackingTeam === 'home' ? this.game.homePlayers : this.game.awayPlayers;
      const taker = attackers.find(p => p.data.pos === 'RW' || p.data.pos === 'LW' || p.data.pos === 'ST') || attackers[9] || attackers[1];
      if (taker) {
        taker.mesh.position.set(cornerX, 0, cornerZ);
        taker.hasPossession = true;
        if (attackingTeam === 'home') {
          if (this.game.activePlayer && this.game.activePlayer.parts) {
            this.game.activePlayer.parts.selectionRing.material.opacity = 0;
          }
          this.game.activePlayer = taker;
          this.game.updateHUDPlayerCard();
        }
      }

      this.setState(MatchState.OUT_OF_BOUNDS, { subType: 'corner', beneficiary: attackingTeam });
    } else {
      // GOAL KICK
      const defendingGK = isHomeEnd ? this.game.homePlayers[0] : this.game.awayPlayers[0];
      const kickX = isHomeEnd ? -44.0 : 44.0;
      this.game.ball.position.set(kickX, this.game.ballRadius, 0);
      this.game.ballVel.set(0, 0, 0);
      this.game.ballSpin.set(0, 0, 0);
      this.game.kickCooldown = 0.8;

      if (defendingGK) {
        defendingGK.mesh.position.set(kickX + (isHomeEnd ? 1.0 : -1.0), 0, 0);
        defendingGK.hasPossession = true;
        if (isHomeEnd) {
          if (this.game.activePlayer && this.game.activePlayer.parts) {
            this.game.activePlayer.parts.selectionRing.material.opacity = 0;
          }
          this.game.activePlayer = defendingGK;
          this.game.updateHUDPlayerCard();
        }
      }

      this.setState(MatchState.OUT_OF_BOUNDS, { subType: 'goal_kick', beneficiary: isHomeEnd ? 'home' : 'away' });
    }
  }

  // --- HUD Synchronization ---
  updateHUD() {
    this.updateHUDScore();
    this.updateHUDClock();
    this.updateHUDStateBadge();
  }

  updateHUDScore() {
    if (this.ui.scoreHome) this.ui.scoreHome.textContent = this.homeScore;
    if (this.ui.scoreAway) this.ui.scoreAway.textContent = this.awayScore;
  }

  updateHUDClock() {
    const totalSec = Math.max(0, Math.floor(this.remainingSeconds));
    const countdownMins = Math.floor(totalSec / 60);
    const countdownSecs = totalSec % 60;
    const countdownStr = `${String(countdownMins).padStart(2, '0')}:${String(countdownSecs).padStart(2, '0')}`;

    // Game minute equivalent from countdown progression (0' to 90')
    const elapsedRatio = 1.0 - (this.remainingSeconds / this.totalRealSeconds);
    const gameMin = Math.min(90, Math.floor(elapsedRatio * 90));

    if (this.ui.clockTime) this.ui.clockTime.textContent = countdownStr;
    if (this.ui.clockGameMin) this.ui.clockGameMin.textContent = `${gameMin}' Dk`;
  }

  updateHUDStateBadge() {
    if (!this.ui.stateBadge) return;

    const stateMap = {
      [MatchState.WARM_UP]: { text: 'ISINMA', class: 'badge-warmup' },
      [MatchState.KICK_OFF]: { text: 'BAŞLAMA VURUŞU', class: 'badge-kickoff' },
      [MatchState.PLAYING]: { text: 'CANLI MAÇ', class: 'badge-playing' },
      [MatchState.GOAL_SCORED]: { text: 'GOL!', class: 'badge-goal' },
      [MatchState.OUT_OF_BOUNDS]: { text: 'DURAN TOP', class: 'badge-bounds' },
      [MatchState.FULL_TIME]: { text: 'MAÇ SONU', class: 'badge-fulltime' }
    };

    const current = stateMap[this.state] || { text: this.state.toUpperCase(), class: '' };
    this.ui.stateBadge.textContent = current.text;
    this.ui.stateBadge.className = `hud-state-badge ${current.class}`;
  }

  showGoalBanner(scorer, isHome) {
    if (!this.ui.goalBanner) return;
    const teamName = isHome 
      ? (this.game.currentHomeTeam?.shortName || 'EV SAHİBİ')
      : (this.game.currentAwayTeam?.shortName || 'DEPLASMAN');

    if (this.ui.goalScorer) {
      this.ui.goalScorer.textContent = `${scorer} (${teamName}) harika bir vuruşla ağları havalandırdı!`;
    }
    this.ui.goalBanner.classList.add('show');
  }

  showEventPill(text, type) {
    if (!this.ui.eventPill) return;
    this.ui.eventPill.textContent = text;
    this.ui.eventPill.className = `hud-event-pill active pill-${type}`;
  }

  hideEventPill() {
    if (!this.ui.eventPill) return;
    this.ui.eventPill.classList.remove('active');
  }

  showFullTimeModal() {
    if (!this.ui.fulltimeBanner) return;
    const hName = this.game.currentHomeTeam?.shortName || 'EV SAHİBİ';
    const aName = this.game.currentAwayTeam?.shortName || 'DEPLASMAN';
    if (this.ui.fulltimeScore) {
      this.ui.fulltimeScore.textContent = `${hName} ${this.homeScore} - ${this.awayScore} ${aName}`;
    }
    this.ui.fulltimeBanner.style.display = 'flex';
  }
}

/**
 * PlayerLocomotionEngine
 * Handles 8-directional movement, acceleration curves, sprint transitions,
 * stamina dynamics, and the critical speed difference between running with vs without the ball.
 */
class PlayerLocomotionEngine {
  constructor(game) {
    this.game = game;
    // Acceleration constants (m/s²)
    this.accelRateNormal = 28.0;
    this.accelRateSprint = 22.0;
    this.brakingDecelRate = 34.0;
    this.rotationLerpSpeed = 16.0;
  }

  /**
   * Calculates maximum speed taking into account:
   * 1. Player pace and dribbling attributes
   * 2. Possession state: on-ball vs off-ball speed difference
   * 3. Sprinting vs normal jog state
   */
  calculateMaxSpeed(player, isSprinting) {
    const pace = player.data.pace || 80;
    const dri = player.data.dri || 80;
    const hasBall = !!player.hasPossession;

    if (hasBall) {
      // Toplu Koşu: Dribling sırasında ayak temasları ve top kontrolü nedeniyle hız ~18-20% daha düşüktür
      if (isSprinting) {
        // Sprint with ball: ~11.6 m/s base scaled by pace & dribbling stats
        return 11.6 * ((pace * 0.6 + dri * 0.4) / 80.0);
      } else {
        // Jog with ball: ~7.2 m/s base
        return 7.2 * ((pace * 0.5 + dri * 0.5) / 80.0);
      }
    } else {
      // Topsuz Koşu: Serbest koşu ve topsuz depar çok daha çevik ve hızlıdır
      if (isSprinting) {
        // Sprint without ball: ~14.8 m/s base scaled by pace
        return 14.8 * (pace / 80.0);
      } else {
        // Jog without ball: ~8.8 m/s base
        return 8.8 * (pace / 80.0);
      }
    }
  }

  /**
   * Updates player movement with 8-directional input, acceleration, and inertia
   */
  updatePlayerMovement(player, inputDir, isShiftDown, dt) {
    if (!player) return { isMoving: false, isSprinting: false, currentSpeed: 0 };

    if (!player.vel) {
      player.vel = new THREE.Vector3();
    }

    // 1. Sprint & Stamina Mechanics
    const canSprint = isShiftDown && player.stamina > 5.0;
    const isSprinting = canSprint && inputDir.lengthSq() > 0.01;

    if (isSprinting) {
      player.stamina = Math.max(0, player.stamina - dt * 14.0);
    } else {
      // Stamina recovers when jogging, walking, or standing
      player.stamina = Math.min(100.0, player.stamina + dt * 5.0);
    }

    // Update HUD stamina if active player
    if (player === this.game.activePlayer) {
      const stamFill = document.getElementById('hud-stamina-fill');
      if (stamFill) stamFill.style.width = `${player.stamina}%`;
    }

    // 2. 8-Directional Normalized Input
    const hasInput = inputDir.lengthSq() > 0.001;
    let targetVelocity = new THREE.Vector3();

    if (hasInput) {
      const normDir = inputDir.clone().normalize();
      const maxSpeed = this.calculateMaxSpeed(player, isSprinting);
      targetVelocity.copy(normDir).multiplyScalar(maxSpeed);

      // Smooth acceleration towards target velocity
      const accelRate = isSprinting ? this.accelRateSprint : this.accelRateNormal;
      const alpha = Math.min(1.0, dt * accelRate);
      player.vel.lerp(targetVelocity, alpha);
    } else {
      // Braking / dynamic friction deceleration
      const brakeAlpha = Math.min(1.0, dt * this.brakingDecelRate);
      player.vel.lerp(new THREE.Vector3(0, 0, 0), brakeAlpha);
      if (player.vel.lengthSq() < 0.04) {
        player.vel.set(0, 0, 0);
      }
    }

    // 3. Apply Velocity to Position
    player.mesh.position.addScaledVector(player.vel, dt);
    player.speed = player.vel.length();

    // 4. Smooth Weighted Rotation along movement direction
    if (player.speed > 0.25) {
      const targetRotY = Math.atan2(player.vel.x, player.vel.z);
      let diff = targetRotY - player.mesh.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      player.mesh.rotation.y += diff * Math.min(1.0, dt * this.rotationLerpSpeed);
    }

    return {
      isMoving: player.speed > 0.2,
      isSprinting: isSprinting,
      currentSpeed: player.speed
    };
  }
}

/**
 * BallPhysicsEngine
 * Handles aerodynamic quadratic drag, Magnus lift/curl,
 * turf ground rolling resistance, restitution bounces with spin transfer, and goal post collisions.
 */
class BallPhysicsEngine {
  constructor(game) {
    this.game = game;
    this.gravity = 13.2; // m/s² natural snappiness for 3D football
    this.airDragCoeff = 0.0012;
    this.magnusScale = 0.0042;
    this.bounceRestitution = 0.58; // FIFA soccer ball elasticity on manicured grass
    this.turfRollingDecel = 3.8; // m/s² natural ground friction deceleration
  }

  update(ball, ballVel, ballSpin, dt) {
    if (!ball) return;

    // 1. Aerodynamic Magnus Force (Curves trajectory in air)
    if (ballSpin.lengthSq() > 0.01) {
      const magnus = new THREE.Vector3().crossVectors(ballSpin, ballVel).multiplyScalar(this.magnusScale);
      ballVel.addScaledVector(magnus, dt);
      ballSpin.multiplyScalar(Math.pow(0.965, dt * 60)); // Natural spin decay
    }

    // 2. Aerodynamic Quadratic Air Drag
    const speed = ballVel.length();
    if (speed > 0.05) {
      const dragFactor = Math.min(0.25, this.airDragCoeff * speed);
      ballVel.addScaledVector(ballVel, -dragFactor * dt);
    }

    // 3. Gravity Acceleration
    ballVel.y -= this.gravity * dt;

    // 4. Velocity Position Integration
    ball.position.addScaledVector(ballVel, dt);

    // 5. Ground Contact, Bounce Restitution & Rolling Friction
    if (ball.position.y <= this.game.ballRadius) {
      ball.position.y = this.game.ballRadius;

      // Vertical bounce
      if (Math.abs(ballVel.y) > 0.65) {
        ballVel.y = -ballVel.y * this.bounceRestitution;
        // Spin-to-ground impulse transfer (topspin accelerates, backspin checks up)
        ballVel.x += ballSpin.z * 0.06;
        ballVel.z -= ballSpin.x * 0.06;
        ballSpin.multiplyScalar(0.72); // Impact dampens spin
      } else {
        ballVel.y = 0;
      }

      // Turf Ground Rolling Friction (Manicured pitch friction)
      const groundSpeed = Math.sqrt(ballVel.x * ballVel.x + ballVel.z * ballVel.z);
      if (groundSpeed > 0.04) {
        const newSpeed = Math.max(0, groundSpeed - this.turfRollingDecel * dt);
        const frictionRatio = newSpeed / groundSpeed;
        ballVel.x *= frictionRatio;
        ballVel.z *= frictionRatio;
      } else {
        ballVel.x = 0;
        ballVel.z = 0;
      }
    }

    // 6. Realistic Angular Rolling Rotation
    const rollingSpeed = Math.sqrt(ballVel.x * ballVel.x + ballVel.z * ballVel.z);
    if (rollingSpeed > 0.04) {
      ball.rotation.x += (ballVel.z / this.game.ballRadius) * dt;
      ball.rotation.z -= (ballVel.x / this.game.ballRadius) * dt;
    }
  }
}

// Export for module accessibility
if (typeof window !== 'undefined') {
  window.GameplayEventDispatcher = GameplayEventDispatcher;
  window.PitchTriggerZoneSystem = PitchTriggerZoneSystem;
  window.PlayerLocomotionEngine = PlayerLocomotionEngine;
  window.BallPhysicsEngine = BallPhysicsEngine;
}

// --- Main Game Engine ---
class FootballGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.audio = new FootballAudio();

    // Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08101a); // Atmospheric stadium midnight sky
    this.scene.fog = new THREE.FogExp2(0x0a1624, 0.0032);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.16;
    this.container.appendChild(this.renderer.domElement);

    // Confetti System for Goal Celebrations
    this.confettiParticles = [];
    this.stadiumCrowd = null;

    // Camera Modes
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 500);
    this.cameraModes = ['broadcast', 'behind', 'tactical', 'overhead'];
    this.currentCamIndex = 0;
    this.cameraTarget = new THREE.Vector3();

    // Playable Pitch Dimensions (Standard 100m length x 64m width)
    // Coords: X from -50.0 to +50.0, Z from -32.0 to +32.0
    this.fieldLength = 100.0;
    this.fieldWidth = 64.0;
    this.goalWidth = 7.32;
    this.goalHeight = 2.44;

    // Match Simulation State
    this.homeScore = 0;
    this.awayScore = 0;
    this.matchMinute = 0;
    this.matchHalf = 1; // 1 = 1st Half, 2 = Halftime, 3 = 2nd Half, 4 = Full Time
    this.timeScale = 8; // Authentic FIFA pace (45 game mins = ~5.6 real mins)
    this.isPaused = false;
    this.isGoalSequence = false;
    this.goalTimer = 0;

    // Ball State
    this.ball = null;
    this.ballRadius = 0.44;
    this.ballVel = new THREE.Vector3(0, 0, 0);
    this.ballSpin = new THREE.Vector3(0, 0, 0);
    this.lastKicker = null;
    this.passReceiver = null;
    this.kickCooldown = 0;
    this.postHitCooldown = 0;
    this.cameraShake = 0.0;

    // Input States
    this.keys = {};
    this.mouse = { x: 0, y: 0, worldPos: new THREE.Vector3() };
    this.isShiftDown = false;

    // Unified Power Bar Mechanic
    this.isChargingPower = false;
    this.powerCharge = 0.0;
    this.chargeType = null; // 'shot', 'pass', 'through', 'aerial'

    // Players Array
    this.homePlayers = [];
    this.awayPlayers = [];
    this.activePlayer = null;

    // Tactical 4-3-3 Formations (Strictly inside X: [-48, 48], Z: [-22, 22])
    this.baseFormationHome = [
      { role: "GK",  x: -48, z: 0 },
      { role: "RB",  x: -30, z: -18 },
      { role: "CB1", x: -34, z: -7 },
      { role: "CB2", x: -34, z: 7 },
      { role: "LB",  x: -30, z: 18 },
      { role: "CDM", x: -18, z: 0 },
      { role: "CM1", x: -10, z: -13 },
      { role: "CAM", x: -4,  z: 13 },
      { role: "RW",  x: 16,  z: -18 },
      { role: "ST",  x: 20,  z: 0 },
      { role: "LW",  x: 16,  z: 18 }
    ];

    this.baseFormationAway = [
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

    // Initialize Modular Gameplay, Physics & Event Systems
    this.events = new GameplayEventDispatcher(this);
    this.triggerZones = new PitchTriggerZoneSystem(this.events);
    this.locomotionEngine = new PlayerLocomotionEngine(this);
    this.ballPhysicsEngine = new BallPhysicsEngine(this);
    this.matchManager = new MatchManager(this);
    this.matchManager.init();

    // Referee & Rules State
    this.referee = null;
    this.foulCooldown = 0;
    this.subBoardTimeout = null;

    this.initWorld();
    this.initInput();
    this.initUI();
    this.initSplashEffects();
    this.animate();
  }

  // --- Gameplay Event Hooks (Extensible for rules, stats, commentary, referee) ---
  onBallPassed(player, power, target) {
    // Extensible hook for pass statistics, reception triggers, and offside validation
    // console.log(`[Event] OnBallPassed: ${player?.data?.name || 'Player'}, Power: ${(power * 100).toFixed(0)}%`);
  }

  onShotTaken(player, power, direction) {
    // Extensible hook for shot telemetry, xG calculation, and goalkeeper reaction triggers
    // console.log(`[Event] OnShotTaken: ${player?.data?.name || 'Player'}, Power: ${(power * 100).toFixed(0)}%`);
  }

  onBallEnteredTrigger(triggerZoneName) {
    // Forward trigger zone entries to MatchManager rules system
    if (this.matchManager) {
      this.matchManager.handleTriggerZone(triggerZoneName);
    }
  }

  // --- World Creation (Pitch, Stadium, Floodlights, Goals) ---
  initWorld() {
    // 1. Natural Stadium Atmosphere Lighting
    const hemiLight = new THREE.HemisphereLight(0xbadaf8, 0x0f2916, 0.52);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.24);
    this.scene.add(ambientLight);

    // 2. Primary Broadcast Floodlight (Key light with high-res soft shadow)
    const keyLight = new THREE.DirectionalLight(0xfffaec, 0.92);
    keyLight.position.set(22, 46, 38);
    keyLight.target.position.set(0, 0, 0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 135;
    keyLight.shadow.camera.left = -64;
    keyLight.shadow.camera.right = 64;
    keyLight.shadow.camera.top = 44;
    keyLight.shadow.camera.bottom = -44;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);
    this.scene.add(keyLight.target);

    // 3. Balanced Fill Floodlight (Soft contrast balance)
    const fillLight = new THREE.DirectionalLight(0xb0cde5, 0.38);
    fillLight.position.set(-22, 40, -38);
    fillLight.target.position.set(0, 0, 0);
    this.scene.add(fillLight);
    this.scene.add(fillLight.target);

    this.floodlights = [keyLight];

    // 4. 4 Architectural Steel Lattice Floodlight Towers with Gantry Bulb Matrices
    const towerCoords = [
      { x: -58, z: -40, rot: Math.PI * 0.25 },
      { x: 58, z: -40, rot: -Math.PI * 0.25 },
      { x: -58, z: 40, rot: Math.PI * 0.75 },
      { x: 58, z: 40, rot: -Math.PI * 0.75 }
    ];

    towerCoords.forEach(coord => {
      const towerGroup = new THREE.Group();
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.35 });

      // 4 Main corner columns
      const legOffsets = [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]];
      legOffsets.forEach(([lx, lz]) => {
        const legGeo = new THREE.CylinderGeometry(0.18, 0.28, 38, 6);
        const legMesh = new THREE.Mesh(legGeo, mastMat);
        legMesh.position.set(lx, 19, lz);
        towerGroup.add(legMesh);
      });

      // Horizontal reinforcing struts
      for (let y = 6; y <= 36; y += 6) {
        const ringGeo = new THREE.BoxGeometry(2.0, 0.25, 2.0);
        const ringMesh = new THREE.Mesh(ringGeo, mastMat);
        ringMesh.position.set(0, y, 0);
        towerGroup.add(ringMesh);
      }

      // Floodlight Head Gantry Platform (Angled down towards center pitch)
      const headGantry = new THREE.Group();
      headGantry.position.set(0, 38, 0);
      headGantry.rotation.y = coord.rot;
      headGantry.rotation.x = 0.32;

      const frameGeo = new THREE.BoxGeometry(6.4, 3.6, 0.5);
      const frameMesh = new THREE.Mesh(frameGeo, mastMat);
      headGantry.add(frameMesh);

      // High-Intensity Floodlight Bulb Matrix (3x5 array of brilliant lamps)
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfffef0 });
      const rows = 3, cols = 5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bulbGeo = new THREE.BoxGeometry(0.85, 0.75, 0.15);
          const bulb = new THREE.Mesh(bulbGeo, bulbMat);
          bulb.position.set((c - 2) * 1.15, (r - 1) * 1.05, 0.3);
          headGantry.add(bulb);
        }
      }

      // Atmospheric subtle volumetric beam cone
      const coneGeo = new THREE.CylinderGeometry(0.4, 14, 45, 16, 1, true);
      coneGeo.translate(0, -22.5, 0);
      coneGeo.rotateX(Math.PI / 2);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xfffae8,
        transparent: true,
        opacity: 0.04,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.set(0, 0, 0.4);
      headGantry.add(coneMesh);

      towerGroup.add(headGantry);
      towerGroup.position.set(coord.x, 0, coord.z);
      this.scene.add(towerGroup);
    });

    // Pitch Surface with realistic grass texture & markings
    this.createPitch();

    // 3D Goals with curved stanchions and net physics
    this.createGoal(-50.0, 0, 1);
    this.createGoal(50.0, 0, -1);

    // Full 3D Stadium Architecture (Grandstands, crowd, animated LED ribbon boards)
    this.createStadiumStands();

    // High-Fidelity Match Ball
    this.createBall();

    // Spawn 11v11 Squads
    this.spawnSquads();

    // Select Starter Player
    this.activePlayer = this.homePlayers.find(p => p.data.isStar) || this.homePlayers[9];
    this.updateHUDPlayerCard();
  }

  createPitch() {
    const pitchCanvas = document.createElement('canvas');
    pitchCanvas.width = 2048;
    pitchCanvas.height = 1412;
    const ctx = pitchCanvas.getContext('2d');

    const totalLen = 116;
    const totalWid = 80;
    const playLen = 100;
    const playWid = 64;

    const scaleX = pitchCanvas.width / totalLen; // ~17.655 px/m
    const scaleY = pitchCanvas.height / totalWid; // ~17.65 px/m

    const marginX = 8 * scaleX; // ~141 px
    const marginY = 8 * scaleY; // ~141 px
    const playW = playLen * scaleX; // ~1766 px
    const playH = playWid * scaleY; // ~1130 px

    // 1. Synthetic grass perimeter apron (Dark emerald lawn)
    ctx.fillStyle = '#0a3219';
    ctx.fillRect(0, 0, pitchCanvas.width, pitchCanvas.height);

    // 2. Santiago Bernabéu / Premier League alternating mown lawn stripes
    const stripes = 18;
    const stripeW = playW / stripes;
    for (let i = 0; i < stripes; i++) {
      const isEven = i % 2 === 0;
      const grad = ctx.createLinearGradient(marginX + i * stripeW, 0, marginX + (i + 1) * stripeW, 0);
      if (isEven) {
        grad.addColorStop(0, '#13743c');
        grad.addColorStop(0.5, '#168043');
        grad.addColorStop(1, '#13743c');
      } else {
        grad.addColorStop(0, '#0f6233');
        grad.addColorStop(0.5, '#116d3a');
        grad.addColorStop(1, '#0f6233');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(marginX + i * stripeW, marginY, stripeW + 1, playH);
    }

    // 3. Natural grass blade micro-texture stippling
    const imgData = ctx.getImageData(marginX, marginY, playW, playH);
    const data = imgData.data;
    const len = data.length;
    for (let i = 0; i < len; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise * 0.35));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.3));
    }
    ctx.putImageData(imgData, marginX, marginY);

    // 4. Goalmouth & Penalty Spot Scuffs (Authentic wear & tear patina)
    const midX = pitchCanvas.width / 2;
    const midY = pitchCanvas.height / 2;
    const penSpotDist = 11.0 * scaleX;

    ctx.fillStyle = 'rgba(24, 58, 30, 0.42)';
    ctx.beginPath();
    ctx.ellipse(marginX + 20, midY, 65, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(marginX + playW - 20, midY, 65, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(marginX + penSpotDist, midY, 24, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(marginX + playW - penSpotDist, midY, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Crisp Chalk Markings with natural turf bleed
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.94)';
    ctx.lineWidth = 7;
    ctx.fillStyle = 'rgba(248, 250, 252, 0.94)';

    // Outer Touchlines & Goal lines
    ctx.strokeRect(marginX, marginY, playW, playH);

    // Halfway Line
    ctx.beginPath();
    ctx.moveTo(midX, marginY);
    ctx.lineTo(midX, marginY + playH);
    ctx.stroke();

    // Center Circle & Center Spot (Radius = 9.15m)
    const centerRadius = 9.15 * scaleX;
    ctx.beginPath();
    ctx.arc(midX, midY, centerRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(midX, midY, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Penalty Areas (16.5m x 40.3m)
    const penDepth = 16.5 * scaleX;
    const penWidth = 40.3 * scaleY;
    const penTop = midY - penWidth / 2;
    ctx.strokeRect(marginX, penTop, penDepth, penWidth);
    ctx.strokeRect(marginX + playW - penDepth, penTop, penDepth, penWidth);

    // Goal Areas / 6-Yard Box (5.5m x 18.3m)
    const goalDepth = 5.5 * scaleX;
    const goalAreaWidth = 18.3 * scaleY;
    const goalTop = midY - goalAreaWidth / 2;
    ctx.strokeRect(marginX, goalTop, goalDepth, goalAreaWidth);
    ctx.strokeRect(marginX + playW - goalDepth, goalTop, goalDepth, goalAreaWidth);

    // Penalty Spots & Arcs
    ctx.beginPath();
    ctx.arc(marginX + penSpotDist, midY, 5, 0, Math.PI * 2);
    ctx.arc(marginX + playW - penSpotDist, midY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Left arc
    ctx.beginPath();
    ctx.arc(marginX + penSpotDist, midY, centerRadius, -0.65, 0.65);
    ctx.stroke();
    // Right arc
    ctx.beginPath();
    ctx.arc(marginX + playW - penSpotDist, midY, centerRadius, Math.PI - 0.65, Math.PI + 0.65);
    ctx.stroke();

    // Corner Arcs (Radius = 1m)
    const cornerR = 1.0 * scaleX * 1.5;
    ctx.beginPath(); ctx.arc(marginX, marginY, cornerR, 0, Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(marginX + playW, marginY, cornerR, Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(marginX, marginY + playH, cornerR, -Math.PI / 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(marginX + playW, marginY + playH, cornerR, Math.PI, Math.PI * 1.5); ctx.stroke();

    const pitchTexture = new THREE.CanvasTexture(pitchCanvas);
    pitchTexture.wrapS = THREE.ClampToEdgeWrapping;
    pitchTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Procedural Grass Bump Map (specular sheen at broadcast camera angles)
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 512;
    bumpCanvas.height = 512;
    const bctx = bumpCanvas.getContext('2d');
    bctx.fillStyle = '#808080';
    bctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 6000; i++) {
      bctx.fillStyle = Math.random() > 0.5 ? '#9e9e9e' : '#686868';
      bctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 3.5);
    }
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(16, 12);

    const pitchGeo = new THREE.PlaneGeometry(totalLen, totalWid);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: pitchTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.034,
      roughness: 0.64,
      metalness: 0.08
    });

    const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.receiveShadow = true;
    this.scene.add(pitchMesh);

    // Tartan Running Track & Perimeter Apron
    const trackGeo = new THREE.PlaneGeometry(totalLen + 24, totalWid + 24);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x091b12, roughness: 0.95 });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = -Math.PI / 2;
    trackMesh.position.y = -0.04;
    this.scene.add(trackMesh);

    // 4 Corner Flags with flexible striped poles and team flags
    const cornerPositions = [
      { x: -50.0, z: -32.0, isHome: true },
      { x: -50.0, z: 32.0, isHome: true },
      { x: 50.0, z: -32.0, isHome: false },
      { x: 50.0, z: 32.0, isHome: false }
    ];

    cornerPositions.forEach(c => {
      const flagGroup = new THREE.Group();
      // Flexible Spring Pole
      const poleGeo = new THREE.CylinderGeometry(0.028, 0.028, 1.5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 0.75;
      pole.castShadow = true;
      flagGroup.add(pole);

      const finialGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const finial = new THREE.Mesh(finialGeo, poleMat);
      finial.position.y = 1.5;
      flagGroup.add(finial);

      const flagGeo = new THREE.PlaneGeometry(0.38, 0.26);
      const flagMat = new THREE.MeshStandardMaterial({
        color: c.isHome ? 0xffffff : 0xdc2626,
        side: THREE.DoubleSide,
        roughness: 0.7
      });
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0.19, 1.34, 0);
      flagGroup.add(flagMesh);

      flagGroup.position.set(c.x, 0, c.z);
      this.scene.add(flagGroup);
    });

    // Modern 3D Team Dugouts / Technical Area Benches (Sideline at Z = -35.2)
    [-14, 14].forEach((dx, idx) => {
      const dugoutGroup = new THREE.Group();
      const isHomeDugout = idx === 0;

      // Transparent Curved Polycarbonate Canopy
      const shelterGeo = new THREE.CylinderGeometry(2.4, 2.4, 7.5, 16, 1, true, 0, Math.PI * 0.55);
      const shelterMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.42,
        roughness: 0.15,
        metalness: 0.4,
        side: THREE.DoubleSide
      });
      const shelter = new THREE.Mesh(shelterGeo, shelterMat);
      shelter.rotation.z = Math.PI / 2;
      shelter.rotation.y = Math.PI;
      shelter.position.set(0, 1.5, 0);
      dugoutGroup.add(shelter);

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
      const frameL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2), frameMat);
      frameL.position.set(-3.6, 1.1, -1.0);
      dugoutGroup.add(frameL);
      const frameR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2), frameMat);
      frameR.position.set(3.6, 1.1, -1.0);
      dugoutGroup.add(frameR);

      // 6 Luxury Sports Bucket Seats
      const seatColor = isHomeDugout ? 0x1e3a8a : 0x991b1b;
      const seatMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.5 });
      for (let s = -2.5; s <= 2.5; s += 1.0) {
        const seatBottom = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.5), seatMat);
        seatBottom.position.set(s, 0.45, -0.2);
        dugoutGroup.add(seatBottom);

        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.12), seatMat);
        seatBack.position.set(s, 0.75, -0.42);
        dugoutGroup.add(seatBack);
      }

      dugoutGroup.position.set(dx, 0, -35.2);
      this.scene.add(dugoutGroup);
    });
  }

  createGoal(x, z, dir) {
    const goalGroup = new THREE.Group();
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.4
    });

    // Upright Posts
    const postGeo = new THREE.CylinderGeometry(0.09, 0.09, this.goalHeight, 16);
    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(0, this.goalHeight / 2, -this.goalWidth / 2);
    leftPost.castShadow = true;
    goalGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.set(0, this.goalHeight / 2, this.goalWidth / 2);
    rightPost.castShadow = true;
    goalGroup.add(rightPost);

    // Crossbar
    const crossbarGeo = new THREE.CylinderGeometry(0.09, 0.09, this.goalWidth, 16);
    const crossbar = new THREE.Mesh(crossbarGeo, postMat);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(0, this.goalHeight, 0);
    crossbar.castShadow = true;
    goalGroup.add(crossbar);

    // European-Style Curved Net Tension Stanchions
    const stanchionMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3, metalness: 0.7 });
    [-this.goalWidth / 2, this.goalWidth / 2].forEach(pz => {
      const stanchionGeo = new THREE.CylinderGeometry(0.045, 0.045, 3.2, 8);
      const stanchion = new THREE.Mesh(stanchionGeo, stanchionMat);
      stanchion.rotation.z = dir * 0.75;
      stanchion.position.set(-1.2 * dir, 1.25, pz);
      goalGroup.add(stanchion);
    });

    // Ground anchor bar
    const groundFrameGeo = new THREE.CylinderGeometry(0.045, 0.045, this.goalWidth, 8);
    const groundFrame = new THREE.Mesh(groundFrameGeo, stanchionMat);
    groundFrame.rotation.x = Math.PI / 2;
    groundFrame.position.set(-2.2 * dir, 0.05, 0);
    goalGroup.add(groundFrame);

    // Hexagonal / Diamond Goal Netting Texture
    const netCanvas = document.createElement('canvas');
    netCanvas.width = 128;
    netCanvas.height = 128;
    const nctx = netCanvas.getContext('2d');
    nctx.strokeStyle = '#e2e8f0';
    nctx.lineWidth = 2;
    for (let i = -128; i <= 256; i += 16) {
      nctx.beginPath(); nctx.moveTo(i, 0); nctx.lineTo(i + 128, 128); nctx.stroke();
      nctx.beginPath(); nctx.moveTo(i, 128); nctx.lineTo(i + 128, 0); nctx.stroke();
    }
    const netTex = new THREE.CanvasTexture(netCanvas);
    netTex.wrapS = THREE.RepeatWrapping;
    netTex.wrapT = THREE.RepeatWrapping;
    netTex.repeat.set(12, 6);

    const netDepth = 2.2 * dir;
    const netMat = new THREE.MeshStandardMaterial({
      map: netTex,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      roughness: 0.8
    });

    const backNet = new THREE.Mesh(new THREE.PlaneGeometry(this.goalWidth, this.goalHeight, 4, 4), netMat);
    backNet.rotation.y = Math.PI / 2;
    backNet.position.set(-netDepth, this.goalHeight / 2, 0);
    goalGroup.add(backNet);

    const topNet = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(netDepth), this.goalWidth, 4, 4), netMat);
    topNet.rotation.x = -Math.PI / 2;
    topNet.position.set(-netDepth / 2, this.goalHeight, 0);
    goalGroup.add(topNet);

    const sideNetLeft = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(netDepth), this.goalHeight, 4, 4), netMat);
    sideNetLeft.position.set(-netDepth / 2, this.goalHeight / 2, -this.goalWidth / 2);
    goalGroup.add(sideNetLeft);

    const sideNetRight = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(netDepth), this.goalHeight, 4, 4), netMat);
    sideNetRight.position.set(-netDepth / 2, this.goalHeight / 2, this.goalWidth / 2);
    goalGroup.add(sideNetRight);

    goalGroup.position.set(x, 0, z);
    this.scene.add(goalGroup);
  }

  // --- Stadium Architecture, Animated LED Boards & Crowd ---
  createStadiumStands() {
    // 1. Dynamic Animated Digital LED Ribbon Boards
    this.ledCanvas = document.createElement('canvas');
    this.ledCanvas.width = 1024;
    this.ledCanvas.height = 128;
    this.ledCtx = this.ledCanvas.getContext('2d');
    this.ledScrollOffset = 0;

    this.ledTexture = new THREE.CanvasTexture(this.ledCanvas);
    this.ledTexture.wrapS = THREE.RepeatWrapping;
    this.ledTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.ledTexture.repeat.set(8, 1);

    const ledMat = new THREE.MeshStandardMaterial({
      map: this.ledTexture,
      emissive: 0xffffff,
      emissiveMap: this.ledTexture,
      emissiveIntensity: 0.95,
      roughness: 0.3,
      metalness: 0.2
    });

    // Touchline LED Boards (North & South)
    const adGeoLong = new THREE.BoxGeometry(102, 1.05, 0.35);
    const adNorth = new THREE.Mesh(adGeoLong, ledMat);
    adNorth.position.set(0, 0.52, -33.6);
    this.scene.add(adNorth);

    const adSouth = new THREE.Mesh(adGeoLong, ledMat);
    adSouth.position.set(0, 0.52, 33.6);
    this.scene.add(adSouth);

    // Goal-end LED Boards (East & West)
    const adGeoShort = new THREE.BoxGeometry(0.35, 1.05, 24);
    const adEast = new THREE.Mesh(adGeoShort, ledMat);
    adEast.position.set(-51.5, 0.52, 20);
    this.scene.add(adEast);

    const adEast2 = new THREE.Mesh(adGeoShort, ledMat);
    adEast2.position.set(-51.5, 0.52, -20);
    this.scene.add(adEast2);

    const adWest = new THREE.Mesh(adGeoShort, ledMat);
    adWest.position.set(51.5, 0.52, 20);
    this.scene.add(adWest);

    const adWest2 = new THREE.Mesh(adGeoShort, ledMat);
    adWest2.position.set(51.5, 0.52, -20);
    this.scene.add(adWest2);

    this.renderLedCanvas(0);

    // 2. Realistic 4-Sided Multi-Tiered Grandstand Architecture
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x1e2634, roughness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.4 });
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.7 });

    const stands = [
      { id: 'north', w: 124, z: -52, x: 0, rotY: 0, seatColor: 0x1d4ed8 }, // Madrid / TV side
      { id: 'south', w: 124, z: 52, x: 0, rotY: Math.PI, seatColor: 0xb91c1c }, // Manchester side
      { id: 'west',  w: 86,  z: 0, x: -68, rotY: Math.PI / 2, seatColor: 0x0f766e }, // Goal End
      { id: 'east',  w: 86,  z: 0, x: 68, rotY: -Math.PI / 2, seatColor: 0xd97706 }  // Goal End
    ];

    stands.forEach(s => {
      const standGroup = new THREE.Group();

      // Tier 1: Lower Bowl
      const tier1Geo = new THREE.BoxGeometry(s.w, 8, 14);
      const tier1 = new THREE.Mesh(tier1Geo, concreteMat);
      tier1.position.set(0, 4, 0);
      standGroup.add(tier1);

      // Seats on Tier 1
      for (let r = 0; r < 5; r++) {
        const rowGeo = new THREE.BoxGeometry(s.w * 0.96, 0.6, 1.8);
        const rowMat = new THREE.MeshStandardMaterial({
          color: r % 2 === 0 ? s.seatColor : 0xf8fafc,
          roughness: 0.6
        });
        const rowMesh = new THREE.Mesh(rowGeo, rowMat);
        rowMesh.position.set(0, 8.2 + r * 0.9, -5.5 + r * 2.5);
        standGroup.add(rowMesh);
      }

      // Tier 2: VIP Executive Suites
      const vipGeo = new THREE.BoxGeometry(s.w, 4.5, 4);
      const vip = new THREE.Mesh(vipGeo, glassMat);
      vip.position.set(0, 14.5, 5.5);
      standGroup.add(vip);

      // Tier 3: Upper Deck Grandstand
      const tier3Geo = new THREE.BoxGeometry(s.w, 12, 16);
      const tier3 = new THREE.Mesh(tier3Geo, concreteMat);
      tier3.position.set(0, 22, 13);
      standGroup.add(tier3);

      // Seats on Tier 3
      for (let r = 0; r < 6; r++) {
        const rowGeo = new THREE.BoxGeometry(s.w * 0.95, 0.6, 2.0);
        const rowMat = new THREE.MeshStandardMaterial({ color: s.seatColor, roughness: 0.6 });
        const rowMesh = new THREE.Mesh(rowGeo, rowMat);
        rowMesh.position.set(0, 28.2 + r * 1.2, 7.5 + r * 2.4);
        standGroup.add(rowMesh);
      }

      // Stadium Cantilever Roof Canopy
      const roofGeo = new THREE.BoxGeometry(s.w + 4, 1.2, 32);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0, 36.5, 6);
      roof.rotation.x = -0.06;
      standGroup.add(roof);

      // Steel Support Trusses
      for (let tx = -s.w * 0.42; tx <= s.w * 0.42; tx += s.w * 0.28) {
        const trussGeo = new THREE.CylinderGeometry(0.18, 0.18, 26, 6);
        const truss = new THREE.Mesh(trussGeo, trussMat);
        truss.rotation.x = 0.55;
        truss.position.set(tx, 33, 10);
        standGroup.add(truss);
      }

      standGroup.position.set(s.x, 0, s.z);
      standGroup.rotation.y = s.rotY;
      this.scene.add(standGroup);
    });

    // 3. Dense Animated Stadium Crowd using InstancedMesh
    const crowdCount = 1400;
    const spectatorGeo = new THREE.BoxGeometry(0.45, 0.65, 0.35);
    const spectatorMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
    this.stadiumCrowd = new THREE.InstancedMesh(spectatorGeo, spectatorMat, crowdCount);

    const dummy = new THREE.Object3D();
    const shirtColors = [
      new THREE.Color(0xffffff), // White
      new THREE.Color(0x1d4ed8), // Blue
      new THREE.Color(0xdc2626), // Red
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0x334155), // Dark Jacket
      new THREE.Color(0x0ea5e9)  // Cyan
    ];

    let instIdx = 0;
    stands.forEach(s => {
      const perStand = Math.floor(crowdCount / stands.length);
      for (let i = 0; i < perStand && instIdx < crowdCount; i++) {
        const isUpper = Math.random() > 0.45;
        let ly, lz;
        if (!isUpper) {
          const r = Math.floor(Math.random() * 5);
          ly = 8.8 + r * 0.9;
          lz = -5.5 + r * 2.5;
        } else {
          const r = Math.floor(Math.random() * 6);
          ly = 28.8 + r * 1.2;
          lz = 7.5 + r * 2.4;
        }
        const lx = (Math.random() - 0.5) * (s.w * 0.9);

        dummy.position.set(lx, ly, lz);
        dummy.rotation.y = 0;
        dummy.applyMatrix4(new THREE.Matrix4().makeRotationY(s.rotY));
        dummy.position.add(new THREE.Vector3(s.x, 0, s.z));
        dummy.updateMatrix();

        this.stadiumCrowd.setMatrixAt(instIdx, dummy.matrix);
        const col = shirtColors[Math.floor(Math.random() * shirtColors.length)];
        this.stadiumCrowd.setColorAt(instIdx, col);
        instIdx++;
      }
    });

    this.stadiumCrowd.instanceMatrix.needsUpdate = true;
    if (this.stadiumCrowd.instanceColor) this.stadiumCrowd.instanceColor.needsUpdate = true;
    this.scene.add(this.stadiumCrowd);
  }

  // Render dynamic scrolling sponsors onto pitchside LED ribbon boards
  renderLedCanvas(offset) {
    if (!this.ledCtx) return;
    const ctx = this.ledCtx;
    const w = this.ledCanvas.width;
    const h = this.ledCanvas.height;

    // Dark sleek digital screen background
    ctx.fillStyle = '#050a10';
    ctx.fillRect(0, 0, w, h);

    const sponsors = [
      { bg: '#059669', text: 'EA SPORTS FC 25', sub: 'THE WORLD\'S GAME', col: '#ffffff' },
      { bg: '#b91c1c', text: 'FLY EMIRATES', sub: 'FLY BETTER', col: '#fef08a' },
      { bg: '#0284c7', text: 'PLAYSTATION 5', sub: 'PLAY HAS NO LIMITS', col: '#ffffff' },
      { bg: '#10b981', text: 'YASIRIN FIFA', sub: 'MATCH SIMULATION', col: '#000000' },
      { bg: '#d97706', text: 'ADIDAS FOOTBALL', sub: 'IMPOSSIBLE IS NOTHING', col: '#ffffff' },
      { bg: '#1e293b', text: 'NIKE FOOTBALL', sub: 'JUST DO IT', col: '#38bdf8' }
    ];

    const blockW = 220;
    const totalW = sponsors.length * blockW;
    const startX = - (offset % totalW);

    for (let i = -1; i < sponsors.length + 3; i++) {
      const idx = ((i % sponsors.length) + sponsors.length) % sponsors.length;
      const sp = sponsors[idx];
      const bx = startX + i * blockW;

      // Glow bar at top
      ctx.fillStyle = sp.bg;
      ctx.fillRect(bx, 0, blockW - 12, 14);

      // Sponsor Brand Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(bx, 14, blockW - 12, h - 22);

      // Text Brand Title
      ctx.fillStyle = sp.col;
      ctx.font = 'bold 24px Chakra Petch, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sp.text, bx + (blockW - 12) / 2, 60);

      // Slogan Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(sp.sub, bx + (blockW - 12) / 2, 88);

      // Accent bottom line
      ctx.fillStyle = sp.bg;
      ctx.fillRect(bx, h - 8, blockW - 12, 8);
    }
  }

  // --- Realistic 3D Soccer Ball with Dynamic Ground Shadow ---
  createBall() {
    const ballGeo = new THREE.SphereGeometry(this.ballRadius, 32, 32);

    const ballCanvas = document.createElement('canvas');
    ballCanvas.width = 1024;
    ballCanvas.height = 512;
    const ctx = ballCanvas.getContext('2d');

    // Pearl white composite leather
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 512);

    // Dark seam grooves
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;

    // Draw interlocking Star Panels (UEFA Champions League style)
    const drawStar = (cx, cy, spikes, outerR, innerR, fillCol, strokeCol) => {
      let rot = Math.PI / 2 * 3;
      let x = cx, y = cy;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
      ctx.fillStyle = fillCol;
      ctx.fill();
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 4;
      ctx.stroke();
    };

    for (let bx = 64; bx < 1024; bx += 192) {
      for (let by = 64; by < 512; by += 192) {
        drawStar(bx, by, 5, 52, 26, '#0f172a', '#f59e0b');
        drawStar(bx + 96, by + 96, 5, 42, 20, '#1e3a8a', '#fbbf24');
      }
    }

    // FIFA Official Match Ball Gold Seal
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FIFA PRO', 512, 256);

    const ballTex = new THREE.CanvasTexture(ballCanvas);
    const ballMat = new THREE.MeshStandardMaterial({
      map: ballTex,
      roughness: 0.22,
      metalness: 0.14
    });

    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.castShadow = true;
    this.ball.position.set(0, this.ballRadius, 0);
    this.scene.add(this.ball);

    // Dynamic Ball Soft Ground Contact Shadow (Scales & fades with ball height)
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    const radGrad = sctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    radGrad.addColorStop(0, 'rgba(6, 18, 10, 0.75)');
    radGrad.addColorStop(0.5, 'rgba(6, 18, 10, 0.35)');
    radGrad.addColorStop(1, 'rgba(6, 18, 10, 0.0)');
    sctx.fillStyle = radGrad;
    sctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    this.ballShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.ballShadow.rotation.x = -Math.PI / 2;
    this.ballShadow.position.y = 0.02;
    this.scene.add(this.ballShadow);
  }

  // --- Anatomical Human Athletic Player Models with Authentic Kits ---
  createHumanoidPlayer(data, isHome) {
    const group = new THREE.Group();

    // Physiology Scaling (Reference: 1.80m = 1.0)
    const heightScale = THREE.MathUtils.clamp(data.height / 1.80, 0.88, 1.18);
    const weightScale = THREE.MathUtils.clamp(data.weight / 75, 0.85, 1.25);

    // Dynamic Team Colors & Physiology
    const currentTeam = isHome ? (this.currentHomeTeam || TEAMS_DATABASE.real_madrid) : (this.currentAwayTeam || TEAMS_DATABASE.al_nassr);
    const isGK = data.pos === 'GK';

    const jerseyColor = isGK ? (currentTeam.gkColor || 0x0284c7) : (isHome ? (currentTeam.homeColor || 0xffffff) : (currentTeam.awayColor || currentTeam.homeColor || 0x991b1b));
    const shortsColor = isGK ? 0x1e293b : (currentTeam.shortsColor || (isHome ? 0xf8fafc : 0x1e293b));
    const accentColor = currentTeam.accentColor || 0xf59e0b;

    // Skin Tone
    let skinTone = 0xe0ac69;
    if (data.name.includes("Ronaldo") || data.name.includes("Courtois")) skinTone = 0xd8a47f;
    else if (data.name.includes("Messi") || data.name.includes("De Bruyne") || data.name.includes("Haaland")) skinTone = 0xf5cbb0;
    else if (data.name.includes("Vinicius") || data.name.includes("Mane") || data.name.includes("Tchouameni") || data.name.includes("Rudiger") || data.name.includes("Davies") || data.name.includes("Mendy")) skinTone = 0x5a3825;
    else if (data.name.includes("Bellingham") || data.name.includes("Rodrygo") || data.name.includes("Militao") || data.name.includes("Yamal")) skinTone = 0x8d5b4c;

    // Hair Color
    let hairColor = 0x1a1a1a;
    if (data.name.includes("De Bruyne")) hairColor = 0xb45309;
    else if (data.name.includes("Haaland")) hairColor = 0xfef08a; // Blonde
    else if (data.name.includes("Messi") || data.name.includes("Modric")) hairColor = 0x4a2e18;

    const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.65 });
    const jerseyMat = new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.45, metalness: 0.05 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: shortsColor, roughness: 0.55 });
    const accentMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.4 });
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.85 });

    // 1. Tapered Athletic Torso (Broad athletic shoulders, tapered waist)
    const chestWidth = 0.62 * weightScale;
    const waistWidth = 0.50 * weightScale;
    const torsoHeight = 0.84 * heightScale;
    const torsoDepth = 0.36 * weightScale;

    // Cylinder with tapered waist & chest
    const torsoGeo = new THREE.CylinderGeometry(chestWidth * 0.5, waistWidth * 0.5, torsoHeight, 12);
    torsoGeo.scale(1.0, 1.0, torsoDepth / chestWidth);
    const torso = new THREE.Mesh(torsoGeo, jerseyMat);
    torso.position.y = 1.35 * heightScale;
    torso.castShadow = true;
    group.add(torso);

    // Collar Ribbing (V-Neck trim)
    const collarGeo = new THREE.TorusGeometry(0.16 * weightScale, 0.025, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, accentMat);
    collar.position.set(0, torsoHeight * 0.48, 0);
    torso.add(collar);

    // Number & Name Decal Canvas on back of jersey
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 128;
    backCanvas.height = 128;
    const bctx = backCanvas.getContext('2d');
    bctx.fillStyle = isHome && !isGK ? '#1e293b' : '#ffffff';
    bctx.font = 'bold 78px sans-serif';
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText(data.num, 64, 76);
    bctx.font = 'bold 22px sans-serif';
    bctx.fillText(data.name.toUpperCase().split(' ').pop(), 64, 24);

    const backTex = new THREE.CanvasTexture(backCanvas);
    const backMat = new THREE.MeshBasicMaterial({ map: backTex, transparent: true });
    const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.38), backMat);
    backPlane.rotation.y = Math.PI;
    backPlane.position.set(0, 0.08 * heightScale, -0.19 * weightScale);
    torso.add(backPlane);

    // Front Sponsor / Team Crest Decal on chest
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 128;
    frontCanvas.height = 64;
    const fctx = frontCanvas.getContext('2d');
    fctx.fillStyle = isHome && !isGK ? '#1e293b' : '#ffffff';
    fctx.font = 'bold 20px sans-serif';
    fctx.textAlign = 'center';
    fctx.fillText(currentTeam.shortName || 'FIFA', 64, 44);
    // Tiny shield badge
    fctx.fillStyle = '#f59e0b';
    fctx.beginPath();
    fctx.arc(32, 22, 10, 0, Math.PI * 2);
    fctx.fill();

    const frontTex = new THREE.CanvasTexture(frontCanvas);
    const frontMat = new THREE.MeshBasicMaterial({ map: frontTex, transparent: true });
    const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.17), frontMat);
    frontPlane.position.set(0, 0.12 * heightScale, 0.19 * weightScale);
    torso.add(frontPlane);

    // 2. Athletic Shorts / Hips
    const hipsGeo = new THREE.CylinderGeometry(waistWidth * 0.52, waistWidth * 0.55, 0.38 * heightScale, 12);
    hipsGeo.scale(1.0, 1.0, 0.75);
    const hips = new THREE.Mesh(hipsGeo, shortsMat);
    hips.position.y = 0.88 * heightScale;
    hips.castShadow = true;
    group.add(hips);

    // 3. Head, Neck & Star Player Hair
    const neckGeo = new THREE.CylinderGeometry(0.10, 0.11, 0.16 * heightScale, 8);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = torsoHeight * 0.54;
    torso.add(neck);

    const headGeo = new THREE.SphereGeometry(0.22 * heightScale, 16, 16);
    headGeo.scale(0.9, 1.05, 0.95);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.14 * heightScale;
    head.castShadow = true;
    neck.add(head);

    // Custom Star Player Hairstyles
    let hair;
    if (data.name.includes("Haaland")) {
      // Haaland: High top-knot / athletic ponytail
      const hairGroup = new THREE.Group();
      const bunGeo = new THREE.SphereGeometry(0.12 * heightScale, 8, 8);
      const bun = new THREE.Mesh(bunGeo, hairMat);
      bun.position.set(0, 0.22 * heightScale, -0.12 * heightScale);
      hairGroup.add(bun);

      const topGeo = new THREE.BoxGeometry(0.38 * heightScale, 0.18 * heightScale, 0.40 * heightScale);
      const top = new THREE.Mesh(topGeo, hairMat);
      top.position.y = 0.12 * heightScale;
      hairGroup.add(top);
      hair = hairGroup;
    } else if (data.name.includes("Ronaldo")) {
      // Ronaldo: High fade with combed slick pompadour
      const hairGeo = new THREE.BoxGeometry(0.40 * heightScale, 0.22 * heightScale, 0.42 * heightScale);
      hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 0.14 * heightScale, -0.02);
    } else if (data.name.includes("Messi")) {
      // Messi: Textured flow sweep with stubble beard
      const hairGroup = new THREE.Group();
      const hairGeo = new THREE.BoxGeometry(0.42 * heightScale, 0.24 * heightScale, 0.44 * heightScale);
      const mHair = new THREE.Mesh(hairGeo, hairMat);
      mHair.position.y = 0.12 * heightScale;
      hairGroup.add(mHair);

      // Beard Stubble
      const beardGeo = new THREE.CylinderGeometry(0.18 * heightScale, 0.16 * heightScale, 0.14 * heightScale, 8, 1, false, 0, Math.PI);
      const beardMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
      const beard = new THREE.Mesh(beardGeo, beardMat);
      beard.position.set(0, -0.06 * heightScale, 0.08 * heightScale);
      hairGroup.add(beard);
      hair = hairGroup;
    } else {
      // Standard dynamic athletic hairstyle
      const hairGeo = new THREE.BoxGeometry(0.40 * heightScale, 0.20 * heightScale, 0.42 * heightScale);
      hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.y = 0.12 * heightScale;
    }
    head.add(hair);

    // 4. Arms & Hands (Goalkeepers get thick padded goalie gloves!)
    const armLen = 0.72 * heightScale;
    const armWidth = 0.09 * weightScale;

    const leftArm = new THREE.Group();
    leftArm.position.set(-chestWidth * 0.52, torsoHeight * 0.38, 0);
    torso.add(leftArm);

    const rightArm = new THREE.Group();
    rightArm.position.set(chestWidth * 0.52, torsoHeight * 0.38, 0);
    torso.add(rightArm);

    // Upper sleeve (jersey material)
    const sleeveGeo = new THREE.CylinderGeometry(armWidth * 1.1, armWidth * 0.95, armLen * 0.45, 8);
    sleeveGeo.translate(0, -armLen * 0.22, 0);
    const sleeveL = new THREE.Mesh(sleeveGeo, jerseyMat);
    leftArm.add(sleeveL);
    const sleeveR = new THREE.Mesh(sleeveGeo, jerseyMat);
    rightArm.add(sleeveR);

    // Forearm (skin material)
    const forearmGeo = new THREE.CylinderGeometry(armWidth * 0.9, armWidth * 0.8, armLen * 0.45, 8);
    forearmGeo.translate(0, -armLen * 0.65, 0);
    const forearmL = new THREE.Mesh(forearmGeo, skinMat);
    leftArm.add(forearmL);
    const forearmR = new THREE.Mesh(forearmGeo, skinMat);
    rightArm.add(forearmR);

    // Hands / Goalkeeper Gloves
    const gloveMat = isGK ? new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }) : skinMat;
    const handGeo = isGK ? new THREE.BoxGeometry(0.18, 0.20, 0.12) : new THREE.BoxGeometry(0.12, 0.14, 0.10);
    handGeo.translate(0, -armLen - 0.04, 0);

    const handL = new THREE.Mesh(handGeo, gloveMat);
    leftArm.add(handL);
    const handR = new THREE.Mesh(handGeo, gloveMat);
    rightArm.add(handR);

    // 5. Legs, Socks & Modern Soccer Cleats (Pivot at hip joints)
    const legLen = 0.78 * heightScale;
    const legWidth = 0.11 * weightScale;

    // Team Socks Colors: Madrid (White with gold band), Manchester (Black with red band)
    const sockColor = isHome && !isGK ? 0xf8fafc : (isGK ? 0x0284c7 : 0x111827);
    const sockMat = new THREE.MeshStandardMaterial({ color: sockColor, roughness: 0.6 });

    // Left Leg
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-waistWidth * 0.28, 0.82 * heightScale, 0);
    group.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Group();
    rightLeg.position.set(waistWidth * 0.28, 0.82 * heightScale, 0);
    group.add(rightLeg);

    // Thigh (Skin)
    const thighGeo = new THREE.CylinderGeometry(legWidth * 1.05, legWidth * 0.9, legLen * 0.45, 8);
    thighGeo.translate(0, -legLen * 0.22, 0);
    const thighL = new THREE.Mesh(thighGeo, skinMat);
    thighL.castShadow = true;
    leftLeg.add(thighL);
    const thighR = new THREE.Mesh(thighGeo, skinMat);
    thighR.castShadow = true;
    rightLeg.add(thighR);

    // Calf & Soccer Sock (Sock covers knee down to ankle)
    const calfGeo = new THREE.CylinderGeometry(legWidth * 0.95, legWidth * 0.8, legLen * 0.55, 8);
    calfGeo.translate(0, -legLen * 0.70, 0);
    const sockL = new THREE.Mesh(calfGeo, sockMat);
    sockL.castShadow = true;
    leftLeg.add(sockL);
    const sockR = new THREE.Mesh(calfGeo, sockMat);
    sockR.castShadow = true;
    rightLeg.add(sockR);

    // Modern Aerodynamic Soccer Cleats (Nike Mercurial / Adidas Predator styling)
    const bootColor = isHome ? 0x22c55e : 0xf43f5e; // Neon Volt Green vs Fiery Blazing Pink/Crimson
    const bootUpperMat = new THREE.MeshStandardMaterial({ color: bootColor, roughness: 0.35, metalness: 0.2 });
    const bootSoleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

    const createBoot = () => {
      const bootGroup = new THREE.Group();
      // Aerodynamic pointed upper
      const upperGeo = new THREE.BoxGeometry(0.17, 0.11, 0.34);
      upperGeo.translate(0, 0, 0.08);
      const upper = new THREE.Mesh(upperGeo, bootUpperMat);
      bootGroup.add(upper);

      // Black sole plate
      const soleGeo = new THREE.BoxGeometry(0.18, 0.03, 0.35);
      soleGeo.translate(0, -0.06, 0.08);
      const sole = new THREE.Mesh(soleGeo, bootSoleMat);
      bootGroup.add(sole);

      return bootGroup;
    };

    const leftBoot = createBoot();
    leftBoot.position.set(0, -legLen, 0);
    leftLeg.add(leftBoot);

    const rightBoot = createBoot();
    rightBoot.position.set(0, -legLen, 0);
    rightLeg.add(rightBoot);

    // 6. Soft Ground Contact Shadow Disk (Keeps player grounded on turf)
    const contactShadowGeo = new THREE.PlaneGeometry(0.9, 0.9);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x06140a,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    group.add(contactShadow);

    // 7. Sleek Modern FIFA Overhead Floating Indicator (Inverted Triangle)
    const indicatorGeo = new THREE.ConeGeometry(0.18, 0.32, 4);
    indicatorGeo.rotateX(Math.PI); // Point downwards
    const indicatorMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0
    });
    const playerIndicator = new THREE.Mesh(indicatorGeo, indicatorMat);
    playerIndicator.position.y = 2.45 * heightScale;
    group.add(playerIndicator);

    // Active Selection Ring on Ground
    const ringGeo = new THREE.RingGeometry(0.62, 0.78, 28);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    const selectionRing = new THREE.Mesh(ringGeo, ringMat);
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.position.y = 0.035;
    group.add(selectionRing);

    return {
      mesh: group,
      data: data,
      isHome: isHome,
      stamina: 100.0,
      hasPossession: false,
      isTackling: false,
      isCelebrating: false,
      celebrationTimer: 0,
      tackleTimer: 0,
      tackleCooldown: 0,
      stumbleTimer: 0,
      kickTimer: 0,
      diveTimer: 0,
      diveDir: 0,
      touchCooldown: 0,
      runCycle: Math.random() * Math.PI * 2,
      baseTorsoY: 1.35 * heightScale,
      parts: { torso, hips, head, leftLeg, rightLeg, leftArm, rightArm, selectionRing, playerIndicator, contactShadow },
      vel: new THREE.Vector3(),
      lastPos: new THREE.Vector3(),
      speed: 0
    };
  }

  spawnSquads() {
    this.homePlayers.forEach(p => this.scene.remove(p.mesh));
    this.awayPlayers.forEach(p => this.scene.remove(p.mesh));
    this.homePlayers = [];
    this.awayPlayers = [];

    PLAYER_DATABASE.home.forEach((data, i) => {
      const p = this.createHumanoidPlayer(data, true);
      const slot = this.baseFormationHome[i] || { x: -20, z: 0 };
      p.mesh.position.set(slot.x, 0, slot.z);
      p.mesh.rotation.y = Math.PI / 2;
      this.scene.add(p.mesh);
      this.homePlayers.push(p);
    });

    PLAYER_DATABASE.away.forEach((data, i) => {
      const p = this.createHumanoidPlayer(data, false);
      const slot = this.baseFormationAway[i] || { x: 20, z: 0 };
      p.mesh.position.set(slot.x, 0, slot.z);
      p.mesh.rotation.y = -Math.PI / 2;
      this.scene.add(p.mesh);
      this.awayPlayers.push(p);
    });

    // Spawn 3D Official Match Referee
    this.createReferee();
  }

  // --- OFFICIAL 3D REFEREE SYSTEM & CARD MECHANICS ---
  createReferee() {
    if (this.referee && this.referee.mesh) {
      this.scene.remove(this.referee.mesh);
    }

    const group = new THREE.Group();

    // Vibrant Neon Lime / Yellow Referee Shirt & Black Shorts
    const refShirtMat = new THREE.MeshStandardMaterial({ color: 0xcbfb45, roughness: 0.45 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd8a47f, roughness: 0.65 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });

    // 1. Torso
    const torsoGeo = new THREE.CylinderGeometry(0.30, 0.24, 0.82, 12);
    const torso = new THREE.Mesh(torsoGeo, refShirtMat);
    torso.position.y = 1.34;
    torso.castShadow = true;
    group.add(torso);

    // Collar
    const collarGeo = new THREE.TorusGeometry(0.15, 0.025, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, blackMat);
    collar.position.set(0, 0.40, 0);
    torso.add(collar);

    // FIFA Referee Badge on Chest
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 128;
    badgeCanvas.height = 64;
    const bctx = badgeCanvas.getContext('2d');
    bctx.fillStyle = '#0f172a';
    bctx.fillRect(0, 0, 128, 64);
    bctx.fillStyle = '#f59e0b';
    bctx.fillRect(4, 4, 120, 6);
    bctx.fillStyle = '#ffffff';
    bctx.font = 'bold 26px sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText('FIFA REF', 64, 46);
    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    const badgePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12), new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true }));
    badgePlane.position.set(0.08, 0.12, 0.25);
    torso.add(badgePlane);

    // 2. Shorts / Hips
    const hipsGeo = new THREE.CylinderGeometry(0.26, 0.27, 0.36, 12);
    const hips = new THREE.Mesh(hipsGeo, blackMat);
    hips.position.y = 0.88;
    hips.castShadow = true;
    group.add(hips);

    // 3. Head & Neck
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.10, 0.16, 8);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.45;
    torso.add(neck);

    const headGeo = new THREE.SphereGeometry(0.21, 16, 16);
    headGeo.scale(0.9, 1.05, 0.95);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.14;
    head.castShadow = true;
    neck.add(head);

    const hairGeo = new THREE.BoxGeometry(0.38, 0.18, 0.40);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.12;
    head.add(hair);

    // 4. Arms & Cards
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.35, 0.36, 0);
    const lUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.34, 8), refShirtMat);
    lUpper.position.y = -0.17;
    leftArm.add(lUpper);
    const lFore = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.32, 8), skinMat);
    lFore.position.y = -0.46;
    leftArm.add(lFore);
    torso.add(leftArm);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.35, 0.36, 0);
    const rUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.34, 8), refShirtMat);
    rUpper.position.y = -0.17;
    rightArm.add(rUpper);
    const rFore = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.32, 8), skinMat);
    rFore.position.y = -0.46;
    rightArm.add(rFore);

    // 3D Yellow Card Mesh in Hand
    const yellowCardGeo = new THREE.BoxGeometry(0.12, 0.18, 0.005);
    const yellowCardMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0xca8a04,
      emissiveIntensity: 0.5
    });
    const yellowCardMesh = new THREE.Mesh(yellowCardGeo, yellowCardMat);
    yellowCardMesh.position.set(0, -0.65, 0.08);
    yellowCardMesh.visible = false;
    rightArm.add(yellowCardMesh);

    // 3D Red Card Mesh in Hand
    const redCardGeo = new THREE.BoxGeometry(0.12, 0.18, 0.005);
    const redCardMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.6
    });
    const redCardMesh = new THREE.Mesh(redCardGeo, redCardMat);
    redCardMesh.position.set(0, -0.65, 0.08);
    redCardMesh.visible = false;
    rightArm.add(redCardMesh);

    torso.add(rightArm);

    // 5. Legs & Boots (Black socks & boots)
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.16, -0.18, 0);
    const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 8), skinMat);
    lThigh.position.y = -0.19;
    leftLeg.add(lThigh);
    const lShin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 8), blackMat);
    lShin.position.y = -0.52;
    leftLeg.add(lShin);
    const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.26), blackMat);
    lBoot.position.set(0, -0.74, 0.06);
    leftLeg.add(lBoot);
    hips.add(leftLeg);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.16, -0.18, 0);
    const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 8), skinMat);
    rThigh.position.y = -0.19;
    rightLeg.add(rThigh);
    const rShin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 8), blackMat);
    rShin.position.y = -0.52;
    rightLeg.add(rShin);
    const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.26), blackMat);
    rBoot.position.set(0, -0.74, 0.06);
    rightLeg.add(rBoot);
    hips.add(rightLeg);

    // Soft Contact Shadow
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 0.85),
      new THREE.MeshBasicMaterial({ color: 0x06140a, transparent: true, opacity: 0.45, depthWrite: false })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    group.add(contactShadow);

    group.position.set(0, 0, 8);
    this.scene.add(group);

    this.referee = {
      mesh: group,
      parts: { torso, hips, head, leftArm, rightArm, leftLeg, rightLeg, yellowCardMesh, redCardMesh },
      state: 'patrol',
      stateTimer: 0,
      targetPos: new THREE.Vector3(0, 0, 8),
      runCycle: 0,
      activeCardType: null,
      foulPlayer: null
    };
  }

  updateReferee(dt) {
    if (!this.referee || !this.ball) return;
    const ref = this.referee;
    const parts = ref.parts;

    if (ref.state === 'show_card') {
      ref.stateTimer -= dt;
      // Right arm raised high holding card
      parts.rightArm.rotation.x = -2.85;
      parts.rightArm.rotation.z = 0.25;
      parts.leftArm.rotation.x = -0.5;
      parts.torso.rotation.x = -0.05;
      parts.leftLeg.rotation.x = 0;
      parts.rightLeg.rotation.x = 0;

      if (ref.activeCardType === 'yellow') {
        parts.yellowCardMesh.visible = true;
        parts.redCardMesh.visible = false;
      } else if (ref.activeCardType === 'red') {
        parts.yellowCardMesh.visible = false;
        parts.redCardMesh.visible = true;
      }

      // Face offending player
      if (ref.foulPlayer && ref.foulPlayer.mesh) {
        const dir = new THREE.Vector3().subVectors(ref.foulPlayer.mesh.position, ref.mesh.position);
        ref.mesh.rotation.y = Math.atan2(dir.x, dir.z);
      }

      if (ref.stateTimer <= 0) {
        parts.yellowCardMesh.visible = false;
        parts.redCardMesh.visible = false;
        parts.rightArm.rotation.x = 0;
        parts.rightArm.rotation.z = 0;
        ref.state = 'patrol';
        ref.activeCardType = null;
        this.hideFoulCardBanner();
      }
      return;
    }

    if (ref.state === 'sprint_to_foul') {
      const target = ref.targetPos;
      const toTarget = new THREE.Vector3().subVectors(target, ref.mesh.position);
      toTarget.y = 0;
      const dist = toTarget.length();

      if (dist > 2.2) {
        toTarget.normalize();
        ref.mesh.position.addScaledVector(toTarget, dt * 11);
        ref.mesh.rotation.y = Math.atan2(toTarget.x, toTarget.z);

        // Sprinting animation
        ref.runCycle += dt * 16;
        const stride = Math.sin(ref.runCycle);
        parts.leftLeg.rotation.x = stride * 0.7;
        parts.rightLeg.rotation.x = -stride * 0.7;
        parts.leftArm.rotation.x = -stride * 0.6;
        parts.rightArm.rotation.x = stride * 0.6;
        parts.torso.rotation.x = 0.15;
      } else {
        // Arrived at foul spot! Show card!
        ref.state = 'show_card';
        ref.stateTimer = 2.8;
      }
      return;
    }

    // Normal patrol: follows the ball diagonally keeping 10-14m distance
    const ballPos = this.ball.position;
    const offsetX = ballPos.x > 0 ? -11 : 11;
    const offsetZ = Math.sin(ballPos.x * 0.05) * 8 + (ballPos.z > 0 ? -8 : 8);
    ref.targetPos.set(
      THREE.MathUtils.clamp(ballPos.x + offsetX, -40, 40),
      0,
      THREE.MathUtils.clamp(ballPos.z + offsetZ, -24, 24)
    );

    const toTarget = new THREE.Vector3().subVectors(ref.targetPos, ref.mesh.position);
    toTarget.y = 0;
    const dist = toTarget.length();

    if (dist > 3.0) {
      toTarget.normalize();
      const speed = Math.min(dist * 2.2, 8.5);
      ref.mesh.position.addScaledVector(toTarget, dt * speed);
      ref.mesh.rotation.y = THREE.MathUtils.lerp(ref.mesh.rotation.y, Math.atan2(toTarget.x, toTarget.z), dt * 8);

      ref.runCycle += dt * speed * 1.6;
      const stride = Math.sin(ref.runCycle);
      parts.leftLeg.rotation.x = stride * 0.5;
      parts.rightLeg.rotation.x = -stride * 0.5;
      parts.leftArm.rotation.x = -stride * 0.45;
      parts.rightArm.rotation.x = stride * 0.45;
      parts.torso.rotation.x = 0.08;
    } else {
      // Idle referee observing play
      parts.leftLeg.rotation.x = THREE.MathUtils.lerp(parts.leftLeg.rotation.x, 0, dt * 10);
      parts.rightLeg.rotation.x = THREE.MathUtils.lerp(parts.rightLeg.rotation.x, 0, dt * 10);
      parts.leftArm.rotation.x = THREE.MathUtils.lerp(parts.leftArm.rotation.x, 0, dt * 10);
      parts.rightArm.rotation.x = THREE.MathUtils.lerp(parts.rightArm.rotation.x, 0, dt * 10);
      parts.torso.rotation.x = THREE.MathUtils.lerp(parts.torso.rotation.x, 0, dt * 10);

      // Look towards ball
      const toBall = new THREE.Vector3().subVectors(ballPos, ref.mesh.position);
      ref.mesh.rotation.y = THREE.MathUtils.lerp(ref.mesh.rotation.y, Math.atan2(toBall.x, toBall.z), dt * 5);
    }
  }

  triggerFoul(fouler, victim, isSlide = false) {
    if (this.foulCooldown > 0 || !fouler || !victim) return;
    this.foulCooldown = 4.5;

    // 1. Victim reaction: falls to turf and rolls
    victim.stumbleTimer = 3.5;
    victim.isFouled = true;
    victim.hasPossession = false;

    // 2. Fouler reaction: innocence protest
    fouler.isFouling = true;
    fouler.hasPossession = false;
    fouler.vel.set(0, 0, 0);

    // 3. Card assessment
    fouler.yellowCards = (fouler.yellowCards || 0) + 1;
    const isSecondYellow = fouler.yellowCards === 2;
    const isDirectRed = isSlide && (Math.abs(victim.mesh.position.x) > 35) && (fouler.yellowCards >= 1 || Math.random() < 0.35);
    const isRed = isSecondYellow || isDirectRed || (fouler.yellowCards >= 2);

    const cardType = isRed ? 'red' : 'yellow';
    const reasonText = isSecondYellow ? '2. Sarıdan Kırmızı Kart' : (isDirectRed ? 'Son Adam / Sert Faul' : 'Sert Müdahale');

    // 4. Referee runs over & displays card
    if (this.referee) {
      this.referee.state = 'sprint_to_foul';
      this.referee.targetPos.copy(victim.mesh.position).add(new THREE.Vector3(1.4, 0, 1.4));
      this.referee.activeCardType = cardType;
      this.referee.foulPlayer = fouler;
    }

    // Audio cues
    this.audio.playCardWhistle(isRed);

    // 5. Broadcast HUD Banner
    this.showFoulCardBanner(fouler.data.name, fouler.data.num, cardType, reasonText);

    // 6. If Red Card: player is sent off!
    if (isRed) {
      fouler.isSentOff = true;
      setTimeout(() => {
        fouler.isWalkingOff = true;
      }, 2500);
    }

    // 7. Free Kick setup at foul spot
    const foulSpot = victim.mesh.position.clone();
    setTimeout(() => {
      this.ball.position.set(foulSpot.x, this.ballRadius, foulSpot.z);
      this.ballVel.set(0, 0, 0);
      this.ballSpin.set(0, 0, 0);
      fouler.isFouling = false;
      victim.isFouled = false;
    }, 3500);
  }

  showFoulCardBanner(name, num, cardType, reason) {
    const banner = document.getElementById('foul-card-banner');
    const title = document.getElementById('foul-banner-title');
    const pName = document.getElementById('foul-player-name');
    const pNum = document.getElementById('foul-player-num');
    const pReason = document.getElementById('foul-reason-text');
    const symbol = document.getElementById('foul-card-symbol');

    if (!banner) return;
    if (title) title.textContent = cardType === 'red' ? 'KIRMIZI KART' : 'SARI KART';
    if (pName) pName.textContent = name.toUpperCase();
    if (pNum) pNum.textContent = `#${num}`;
    if (pReason) pReason.textContent = reason;

    if (symbol) {
      symbol.className = `referee-card-symbol ${cardType}`;
    }

    if (cardType === 'red') {
      banner.classList.add('red-card-border');
    } else {
      banner.classList.remove('red-card-border');
    }

    banner.classList.add('show');
    if (this.foulBannerTimeout) clearTimeout(this.foulBannerTimeout);
    this.foulBannerTimeout = setTimeout(() => {
      banner.classList.remove('show');
    }, 4000);
  }

  hideFoulCardBanner() {
    const banner = document.getElementById('foul-card-banner');
    if (banner) banner.classList.remove('show');
  }

  // --- Input Management ---
  initInput() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.key === 'Shift') this.isShiftDown = true;

      // Slide tackle (M key)
      if (e.code === 'KeyM') {
        this.performSlideTackle();
      }

      // Through ball (Q key)
      if (e.code === 'KeyQ' && !this.isChargingPower) {
        this.startCharging('through');
      }

      // Aerial pass (E key)
      if (e.code === 'KeyE' && !this.isChargingPower) {
        this.startCharging('aerial');
      }

      // Substitutions Menu (Z key)
      if (e.code === 'KeyZ') {
        this.populateSubsModal();
        this.toggleModal('modal-subs');
      }

      // Camera Angle Switch (C key)
      if (e.code === 'KeyC') {
        this.cycleCamera();
      }

      // Switch active player to nearest to ball (Spacebar)
      if (e.code === 'Space') {
        this.switchActivePlayerNearestBall();
      }

      // Settings Menu (ESC key)
      if (e.code === 'Escape') {
        this.toggleModal('modal-settings');
      }
    });

    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
      if (e.key === 'Shift') this.isShiftDown = false;

      // Release Q (Through ball)
      if (e.code === 'KeyQ' && this.isChargingPower && this.chargeType === 'through') {
        this.releaseKick();
      }

      // Release E (Aerial pass)
      if (e.code === 'KeyE' && this.isChargingPower && this.chargeType === 'aerial') {
        this.releaseKick();
      }
    });

    // Mouse Controls (LMB = Shot / Tackle, RMB = Pass)
    window.addEventListener('mousedown', e => {
      // Avoid triggering shots when interacting with HUD buttons or modals
      if (e.target.closest('.interactive') || e.target.closest('.modal-dialog') || e.target.closest('.action-btn-primary')) {
        return;
      }

      if (e.button === 0) {
        // LMB: Shot (or standing tackle if defending)
        this.startCharging('shot');
      } else if (e.button === 2) {
        // RMB: Pass
        e.preventDefault();
        this.startCharging('pass');
      }
    });

    window.addEventListener('mouseup', e => {
      if (e.button === 0 && this.chargeType === 'shot') {
        this.releaseKick();
      } else if (e.button === 2 && this.chargeType === 'pass') {
        e.preventDefault();
        this.releaseKick();
      }
    });

    window.addEventListener('contextmenu', e => e.preventDefault());

    // Mouse Aim Raycaster on pitch plane
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    window.addEventListener('mousemove', e => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(this.mouse, this.camera);
      raycaster.ray.intersectPlane(plane, this.mouse.worldPos);
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // --- Unified Power Bar Logic ---
  startCharging(type) {
    if (!this.activePlayer || this.isPaused) return;

    // Must be close to the ball to charge a kick!
    const distToBall = this.activePlayer.mesh.position.distanceTo(this.ball.position);
    if (!this.activePlayer.hasPossession && distToBall > 2.4) {
      // If defending, perform standing tackle / poke
      if (type === 'shot' || type === 'pass') {
        this.performStandingTackle();
      }
      return;
    }

    this.isChargingPower = true;
    this.chargeType = type;
    this.powerCharge = 0.0;

    const bar = document.getElementById('power-bar-wrapper');
    const label = document.getElementById('power-action-label');
    const fill = document.getElementById('power-fill');
    if (bar && label) {
      bar.classList.add('active');
      const names = {
        shot: "POWER SHOT",
        pass: "GROUND PASS",
        through: "THROUGH BALL",
        aerial: "AERIAL LOB"
      };
      label.textContent = names[type] || "ACTION";
      if (fill) fill.style.width = '0%';
    }
  }

  releaseKick() {
    if (!this.isChargingPower || !this.activePlayer) return;

    const charge = THREE.MathUtils.clamp(this.powerCharge, 0.15, 1.0);
    this.isChargingPower = false;

    const playerPos = this.activePlayer.mesh.position;
    const playerRotY = this.activePlayer.mesh.rotation.y;
    const forward = new THREE.Vector3(Math.sin(playerRotY), 0, Math.cos(playerRotY));
    const shoStat = this.activePlayer.data.sho || 75;
    const pasStat = this.activePlayer.data.pas || 75;

    let aim = new THREE.Vector3();
    let forceMag = 0;
    let elevation = 0;
    let shotKmh = 0;
    let spinY = 0;
    let kickSoundType = 'normal';
    let kickTarget = null;

    switch (this.chargeType) {
      case 'shot':
        // Precision FIFA Shot targeting Away goal at X = 50.0
        // Corner placement using W (screen top / Z = -2.8), S (screen bottom / Z = +2.8) or mouse
        let targetZ = 0;
        let isManualAim = false;

        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
          targetZ = -2.8;
          isManualAim = true;
        } else if (this.keys['KeyS'] || this.keys['ArrowDown']) {
          targetZ = 2.8;
          isManualAim = true;
        } else if (this.mouse.worldPos && this.mouse.worldPos.x > 0) {
          targetZ = THREE.MathUtils.clamp(this.mouse.worldPos.z, -3.4, 3.4);
          isManualAim = true;
        } else {
          targetZ = (Math.random() - 0.5) * 3.6;
        }

        // Finesse / Curved Shot if Sprint/Shift is held OR aimed sharply towards corners
        const isFinesse = this.isShiftDown || Math.abs(targetZ) > 2.0;

        if (isFinesse) {
          kickSoundType = 'finesse';
          // Curved banana shot curling into side netting
          spinY = (targetZ > playerPos.z ? 1 : -1) * (16.0 + (shoStat / 100) * 8.0);
          aim.set(50.0 - playerPos.x, 0, targetZ - playerPos.z).normalize();
          forceMag = 24 + (shoStat / 100) * 8 + charge * 18;
          elevation = 1.0 + charge * 2.8;
          shotKmh = Math.round(72 + charge * 38 + (shoStat / 100) * 10);
        } else {
          kickSoundType = 'power';
          // Lethal driven power strike
          aim.set(50.0 - playerPos.x, 0, targetZ - playerPos.z).normalize();
          forceMag = 30 + (shoStat / 100) * 12 + charge * 24;
          elevation = 0.4 + charge * 2.0;
          shotKmh = Math.round(82 + charge * 46 + (shoStat / 100) * 12);
          if (charge > 0.65) {
            this.cameraShake = 0.28 * charge;
          }
        }

        this.flashShotSpeed(shotKmh);

        // Dispatch OnShotTaken event
        this.events.emit('OnShotTaken', this.activePlayer, charge, aim.clone());
        this.onShotTaken(this.activePlayer, charge, aim.clone());
        break;

      case 'pass':
        // Direct ground pass to teammate in target direction
        let passDir = new THREE.Vector3();
        if (this.keys['KeyW'] || this.keys['ArrowUp']) passDir.z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) passDir.z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) passDir.x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) passDir.x += 1;
        if (passDir.lengthSq() < 0.1) passDir.copy(forward);
        passDir.normalize();

        const mate = this.findBestTeammatePass(passDir);
        if (mate) {
          const toMate = new THREE.Vector3().subVectors(mate.mesh.position, playerPos);
          const dist = toMate.length();
          aim.copy(toMate).normalize();
          forceMag = Math.min(32, Math.max(16, dist * 1.3 + (pasStat / 100) * 4));
          this.passReceiver = mate;
          kickTarget = mate.mesh.position.clone();
        } else {
          aim.copy(passDir);
          forceMag = 22 + charge * 10;
          kickTarget = playerPos.clone().addScaledVector(aim, forceMag * 0.8);
        }
        elevation = 0.05;
        kickSoundType = 'normal';

        // Dispatch OnBallPassed event
        this.events.emit('OnBallPassed', this.activePlayer, charge, kickTarget);
        this.onBallPassed(this.activePlayer, charge, kickTarget);
        break;

      case 'through':
        // Through ball leads runner into stride ahead with subtle curve
        let leadDir = new THREE.Vector3(1, 0, 0);
        if (this.keys['KeyW'] || this.keys['ArrowUp']) leadDir.z -= 0.6;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) leadDir.z += 0.6;
        leadDir.normalize();

        const runner = this.findBestTeammatePass(leadDir);
        if (runner) {
          const leadDist = 7.0 + (pasStat / 100) * 3.0;
          const leadSpot = runner.mesh.position.clone().add(new THREE.Vector3(leadDist, 0, 0));
          aim.subVectors(leadSpot, playerPos).normalize();
          const dist = playerPos.distanceTo(leadSpot);
          forceMag = Math.min(34, Math.max(22, dist * 1.35 + 5));
          this.passReceiver = runner;
          spinY = (Math.random() - 0.5) * 6;
          kickTarget = leadSpot.clone();
        } else {
          aim.copy(leadDir);
          forceMag = 26 + charge * 8;
          kickTarget = playerPos.clone().addScaledVector(aim, forceMag * 0.8);
        }
        elevation = 0.12;
        kickSoundType = 'finesse';

        // Dispatch OnBallPassed event
        this.events.emit('OnBallPassed', this.activePlayer, charge, kickTarget);
        this.onBallPassed(this.activePlayer, charge, kickTarget);
        break;

      case 'aerial':
        // High arching cross / lob into penalty box
        aim.set(40.0 - playerPos.x, 0, (Math.random() - 0.5) * 14 - playerPos.z).normalize();
        forceMag = 24 + charge * 18;
        elevation = 6.5 + charge * 6.5;
        spinY = (Math.random() - 0.5) * 12;
        kickSoundType = 'normal';
        kickTarget = playerPos.clone().addScaledVector(aim, forceMag * 0.9);

        // Dispatch OnBallPassed event
        this.events.emit('OnBallPassed', this.activePlayer, charge, kickTarget);
        this.onBallPassed(this.activePlayer, charge, kickTarget);
        break;
    }

    // Apply kick physics & spin to ball
    this.ballVel.copy(aim).multiplyScalar(forceMag);
    this.ballVel.y = elevation;
    this.ballSpin.set((Math.random() - 0.5) * 4, spinY, 0);

    // Trigger leg swing kick animation on kicker
    this.activePlayer.kickTimer = 0.35;
    this.activePlayer.hasPossession = false;
    this.kickCooldown = 0.45;
    this.lastKicker = this.activePlayer;
    this.audio.playKick(charge, kickSoundType);

    // Hide power bar
    const bar = document.getElementById('power-bar-wrapper');
    if (bar) bar.classList.remove('active');
    this.chargeType = null;
    this.powerCharge = 0.0;
  }

  performStandingTackle() {
    if (!this.activePlayer) return;
    this.activePlayer.kickTimer = 0.3; // extend leg forward
    const pPos = this.activePlayer.mesh.position;
    const distToBall = pPos.distanceTo(this.ball.position);

    if (distToBall < 2.2) {
      this.activePlayer.hasPossession = true;
      this.awayPlayers.forEach(op => {
        if (op.hasPossession) {
          op.hasPossession = false;
          op.stumbleTimer = 0.45;
        }
      });
      this.kickCooldown = 0.35;
      this.audio.playTackle();
    }
  }

  performSlideTackle() {
    if (!this.activePlayer || this.activePlayer.isTackling || this.activePlayer.isSentOff) return;
    this.activePlayer.isTackling = true;
    this.activePlayer.tackleTimer = 0.65;
    this.activePlayer.stamina = Math.max(0, this.activePlayer.stamina - 15);

    const forward = new THREE.Vector3(
      Math.sin(this.activePlayer.mesh.rotation.y),
      0,
      Math.cos(this.activePlayer.mesh.rotation.y)
    );
    this.activePlayer.vel.copy(forward).multiplyScalar(16);

    const tacklerPos = this.activePlayer.mesh.position;
    const distToBall = tacklerPos.distanceTo(this.ball.position);

    // Check collision with opponent players
    let hitOpponent = null;
    this.awayPlayers.forEach(op => {
      if (op.isSentOff) return;
      const d = tacklerPos.distanceTo(op.mesh.position);
      if (d < 2.5) hitOpponent = op;
    });

    if (hitOpponent && this.foulCooldown <= 0) {
      // Check if tackle was from behind
      const opDir = new THREE.Vector3(Math.sin(hitOpponent.mesh.rotation.y), 0, Math.cos(hitOpponent.mesh.rotation.y));
      const dot = forward.dot(opDir);
      const isMissedBall = distToBall > 2.0;

      if (dot > 0.05 || isMissedBall) {
        // FOUL!
        this.triggerFoul(this.activePlayer, hitOpponent, true);
        return;
      }
    }

    if (distToBall < 2.8) {
      const tackleDir = forward.clone().add(new THREE.Vector3(0, 0.3, 0)).normalize();
      this.ballVel.copy(tackleDir).multiplyScalar(22);
      this.activePlayer.hasPossession = false;
      this.kickCooldown = 0.45;
      this.awayPlayers.forEach(op => {
        if (op.hasPossession) {
          op.hasPossession = false;
          op.stumbleTimer = 0.5;
        }
      });
      this.audio.playTackle();
    }
  }

  switchActivePlayerNearestBall() {
    let nearest = null;
    let minDist = 9999;
    const bPos = this.ball.position;
    this.homePlayers.forEach(p => {
      if (p.data.pos === 'GK') return;
      const d = p.mesh.position.distanceTo(bPos);
      if (d < minDist) {
        minDist = d;
        nearest = p;
      }
    });
    if (nearest && nearest !== this.activePlayer) {
      if (this.activePlayer) this.activePlayer.parts.selectionRing.material.opacity = 0;
      this.activePlayer = nearest;
      this.updateHUDPlayerCard();
    }
  }

  findBestTeammatePass(aimDir) {
    let best = null;
    let highestScore = -999;
    const pPos = this.activePlayer.mesh.position;

    this.homePlayers.forEach(p => {
      if (p === this.activePlayer || p.data.pos === 'GK') return;
      const toP = new THREE.Vector3().subVectors(p.mesh.position, pPos);
      const dist = toP.length();
      if (dist < 3.0 || dist > 45.0) return;
      toP.normalize();

      const dot = aimDir.dot(toP);
      if (dot <= 0.0) return;

      const distScore = 1.0 - Math.abs(dist - 18.0) / 30.0;
      const score = dot * 0.75 + distScore * 0.25;

      if (score > highestScore) {
        highestScore = score;
        best = p;
      }
    });

    return best;
  }

  flashShotSpeed(kmh) {
    const el = document.getElementById('shot-speed-indicator');
    const val = document.getElementById('speed-value');
    if (el && val) {
      val.textContent = kmh;
      el.classList.add('active');
      clearTimeout(this.speedTimer);
      this.speedTimer = setTimeout(() => el.classList.remove('active'), 1800);
    }
  }

  // --- Main Simulation Loop ---
  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = 0.016;

    if (!this.isPaused) {
      if (this.matchManager) {
        this.matchManager.update(dt);
      } else {
        this.updateMatchClock(dt);
      }
      if (this.foulCooldown > 0) this.foulCooldown -= dt;
      this.updateBallPhysics(dt);
      this.updatePlayers(dt);
      this.updateReferee(dt);
      this.updatePowerBar(dt);
    }

    this.updateVisualEffects(dt);
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  // --- Dynamic Visual Effects: Animated LED Boards, Crowd, Ball Shadow & Confetti ---
  updateVisualEffects(dt) {
    // 1. Dynamic Pitchside LED Advertising Boards Smooth Scroll
    if (this.ledCtx && this.ledTexture) {
      this.ledScrollOffset = (this.ledScrollOffset || 0) + dt * 110;
      this.renderLedCanvas(this.ledScrollOffset);
      this.ledTexture.needsUpdate = true;
    }

    // 2. Ball Ground Contact Shadow Tracking
    if (this.ball && this.ballShadow) {
      this.ballShadow.position.x = this.ball.position.x;
      this.ballShadow.position.z = this.ball.position.z;
      const h = Math.max(0, this.ball.position.y - this.ballRadius);
      const s = Math.max(0.35, 1.0 - h * 0.09);
      this.ballShadow.scale.set(s, s, 1);
      this.ballShadow.material.opacity = Math.max(0.06, 0.72 / (1.0 + h * 0.9));
    }

    // 3. Active Player Indicator Hover & Pulse
    if (this.activePlayer && this.activePlayer.parts) {
      const p = this.activePlayer;
      if (p.parts.playerIndicator) {
        p.parts.playerIndicator.material.opacity = 0.95;
        p.parts.playerIndicator.rotation.y += dt * 3.5;
        const hScale = (p.data.height || 1.80) / 1.80;
        p.parts.playerIndicator.position.y = 2.42 * hScale + Math.sin(Date.now() * 0.007) * 0.06;
      }
      if (p.parts.selectionRing) {
        p.parts.selectionRing.material.opacity = 0.85;
        p.parts.selectionRing.rotation.z += dt * 1.5;
      }
    }

    // Hide selection rings & indicators for inactive players
    this.homePlayers.forEach(p => {
      if (p !== this.activePlayer && p.parts) {
        if (p.parts.playerIndicator) p.parts.playerIndicator.material.opacity = 0;
        if (p.parts.selectionRing) p.parts.selectionRing.material.opacity = 0;
      }
    });
    this.awayPlayers.forEach(p => {
      if (p !== this.activePlayer && p.parts) {
        if (p.parts.playerIndicator) p.parts.playerIndicator.material.opacity = 0;
        if (p.parts.selectionRing) p.parts.selectionRing.material.opacity = 0;
      }
    });

    // 4. Goal Confetti Ribbon Physics
    if (this.confettiParticles && this.confettiParticles.length > 0) {
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const c = this.confettiParticles[i];
        c.position.addScaledVector(c.vel, dt);
        c.rotation.x += c.rotVel.x * dt;
        c.rotation.y += c.rotVel.y * dt;
        c.rotation.z += c.rotVel.z * dt;
        c.life -= dt;
        if (c.position.y < 0.05) {
          c.position.y = 0.05;
          c.vel.set(0, 0, 0);
        }
        if (c.life <= 0) {
          this.scene.remove(c);
          this.confettiParticles.splice(i, 1);
        }
      }
    }
  }

  // Spawn vibrant stadium celebration confetti ribbons on goal
  spawnConfetti() {
    const colors = [0xf59e0b, 0xffffff, 0xdc2626, 0x10b981, 0x06b6d4, 0x1d4ed8];
    const count = 280;
    for (let i = 0; i < count; i++) {
      const geo = new THREE.PlaneGeometry(0.28 + Math.random() * 0.22, 0.14 + Math.random() * 0.12);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);

      // Spawn high above stadium pitch
      const sx = (Math.random() - 0.5) * 80;
      const sz = (Math.random() - 0.5) * 50;
      const sy = 24 + Math.random() * 14;
      mesh.position.set(sx, sy, sz);

      mesh.vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        -(4 + Math.random() * 6),
        (Math.random() - 0.5) * 8
      );
      mesh.rotVel = new THREE.Vector3(
        Math.random() * 8,
        Math.random() * 8,
        Math.random() * 8
      );
      mesh.life = 6.0 + Math.random() * 2.0;

      this.scene.add(mesh);
      this.confettiParticles.push(mesh);
    }
  }

  updateMatchClock(dt) {
    // If Halftime or Full Time, STOP clock completely!
    if (this.matchHalf === 2 || this.matchHalf === 4) {
      return;
    }

    // Authentic match minute progression: (dt / 60) * timeScale
    this.matchMinute += (dt / 60) * this.timeScale;

    // Halftime Cap at 45:00
    if (this.matchMinute >= 45.0 && this.matchHalf === 1) {
      this.matchMinute = 45.0;
      this.matchHalf = 2; // Halftime pause
      this.audio.playWhistle();
      this.isPaused = true;
      const halfEl = document.getElementById('half-display');
      if (halfEl) halfEl.textContent = 'HALFTIME';
      const ht = document.getElementById('halftime-banner');
      if (ht) ht.style.display = 'flex';
    }
    // Full Time Cap at 90:00
    else if (this.matchMinute >= 90.0 && this.matchHalf === 3) {
      this.matchMinute = 90.0;
      this.matchHalf = 4; // Full Time pause
      this.audio.playWhistle();
      this.isPaused = true;
      const halfEl = document.getElementById('half-display');
      if (halfEl) halfEl.textContent = 'FULL TIME';
      const ft = document.getElementById('fulltime-banner');
      const ftText = document.getElementById('fulltime-score-text');
      const hName = (this.currentHomeTeam && this.currentHomeTeam.shortName) || 'HOME';
      const aName = (this.currentAwayTeam && this.currentAwayTeam.shortName) || 'AWAY';
      if (ftText) ftText.textContent = `${hName} ${this.homeScore} - ${this.awayScore} ${aName}`;
      if (ft) ft.style.display = 'flex';
    }

    const displayMin = Math.floor(this.matchMinute);
    const displaySec = Math.floor((this.matchMinute % 1) * 60);
    const clockStr = `${String(displayMin).padStart(2, '0')}:${String(displaySec).padStart(2, '0')}`;

    const clockEl = document.getElementById('clock-display');
    if (clockEl) clockEl.textContent = clockStr;

    // Goal sequence timer
    if (this.isGoalSequence) {
      this.goalTimer -= dt;
      if (this.goalTimer <= 0) {
        this.isGoalSequence = false;
        const gb = document.getElementById('goal-banner');
        if (gb) gb.classList.remove('show');
        this.resetKickoff();
      }
    }
  }

  updateBallPhysics(dt) {
    // 1-6. Modular Aerodynamics, Magnus Lift/Curve, Restitution Bounces & Ground Turf Friction
    this.ballPhysicsEngine.update(this.ball, this.ballVel, this.ballSpin, dt);

    // Evaluate pitch trigger zones and dispatch OnBallEnteredTrigger
    this.triggerZones.update(this.ball.position);

    // 7. Goal Post Collisions (Metallic crossbar & upright pings)
    if (this.postHitCooldown > 0) {
      this.postHitCooldown -= dt;
    } else {
      [-50.0, 50.0].forEach(goalX => {
        const dx = Math.abs(this.ball.position.x - goalX);
        if (dx < 0.45) {
          const absZ = Math.abs(this.ball.position.z);
          const py = this.ball.position.y;

          // Uprights (Left & Right posts at Z = +/- 3.66, Y <= 2.44)
          if (Math.abs(absZ - 3.66) < 0.38 && py <= 2.5) {
            this.ballVel.x = -Math.sign(this.ballVel.x || (goalX > 0 ? 1 : -1)) * Math.max(12, Math.abs(this.ballVel.x) * 0.7);
            this.ballVel.z += (Math.random() - 0.5) * 8.0;
            this.ballVel.y = Math.max(2.0, this.ballVel.y * 0.5);
            this.audio.playCrossbar();
            this.cameraShake = 0.38;
            this.postHitCooldown = 0.25;
          }
          // Crossbar at Y = 2.44, Z between -3.66 and +3.66
          else if (Math.abs(py - 2.44) < 0.38 && absZ <= 3.7) {
            this.ballVel.y = -Math.abs(this.ballVel.y || 4.0) * 0.65 - 1.5;
            this.ballVel.x = -Math.sign(this.ballVel.x || (goalX > 0 ? 1 : -1)) * Math.max(10, Math.abs(this.ballVel.x) * 0.6);
            this.audio.playCrossbar();
            this.cameraShake = 0.45;
            this.postHitCooldown = 0.25;
          }
        }
      });
    }

    // 8. Net Cushioning (Inside the net, ball gently dampens and drops)
    const inAwayNet = this.ball.position.x > 50.0 && this.ball.position.x < 52.6 && Math.abs(this.ball.position.z) <= (this.goalWidth / 2) && this.ball.position.y <= this.goalHeight;
    const inHomeNet = this.ball.position.x < -50.0 && this.ball.position.x > -52.6 && Math.abs(this.ball.position.z) <= (this.goalWidth / 2) && this.ball.position.y <= this.goalHeight;
    if (inAwayNet || inHomeNet) {
      this.ballVel.multiplyScalar(0.84);
      if (this.isGoalSequence && Math.abs(this.ballVel.x) > 4) {
        this.audio.playNet();
      }
    }

    // 9. Pass Receiver Proactive Movement & First Touch
    if (this.passReceiver && this.passReceiver !== this.activePlayer) {
      const toBall = new THREE.Vector3().subVectors(this.ball.position, this.passReceiver.mesh.position);
      toBall.y = 0;
      if (toBall.length() > 0.4) {
        toBall.normalize().multiplyScalar(8.0 * dt);
        this.passReceiver.mesh.position.add(toBall);
      }

      const distToReceiver = this.ball.position.distanceTo(this.passReceiver.mesh.position);
      if (distToReceiver < 2.0) {
        if (this.activePlayer) this.activePlayer.parts.selectionRing.material.opacity = 0;
        this.activePlayer = this.passReceiver;
        this.activePlayer.hasPossession = true;
        this.passReceiver = null;
        this.kickCooldown = 0.15;
        // Soft first touch cushion
        this.ballVel.multiplyScalar(0.2);
        this.updateHUDPlayerCard();
      }
    }

    // Goal Detection
    this.checkGoalCollision();

    // Out of Bounds Handling:
    // 1. Sideline / Touchlines (Z: +/- 32.0)
    if (Math.abs(this.ball.position.z) > 32.2) {
      this.handleOutOfBounds(false);
    }

    // 2. Goal lines behind bounds (X: +/- 50.2) when not inside the net
    if (Math.abs(this.ball.position.x) > 50.2 && !this.isGoalSequence) {
      const inGoalMouth = Math.abs(this.ball.position.z) <= (this.goalWidth / 2) && this.ball.position.y <= this.goalHeight;
      if (!inGoalMouth) {
        this.handleOutOfBounds(true);
      }
    }
  }

  handleOutOfBounds(isGoalKick) {
    if (this.matchManager) {
      if (isGoalKick) {
        const isHomeEnd = this.ball.position.x < 0;
        this.matchManager.triggerGoalLineOutOfBounds(isHomeEnd);
      } else {
        this.matchManager.triggerThrowIn();
      }
      return;
    }

    if (this.isGoalSequence) return;
    this.audio.playWhistle();

    if (isGoalKick) {
      // Reset to 6-yard box for defending GK
      const isHomeEnd = this.ball.position.x < 0;
      const kickX = isHomeEnd ? -44.0 : 44.0;
      this.ball.position.set(kickX, this.ballRadius, 0);
      this.ballVel.set(0, 0, 0);
      this.kickCooldown = 0.5;

      const gk = isHomeEnd ? this.homePlayers[0] : this.awayPlayers[0];
      if (gk) {
        gk.mesh.position.set(kickX + (isHomeEnd ? 1.0 : -1.0), 0, 0);
        gk.hasPossession = true;
        if (isHomeEnd && this.activePlayer) {
          this.activePlayer.parts.selectionRing.material.opacity = 0;
          this.activePlayer = gk;
          this.updateHUDPlayerCard();
        }
      }
    } else {
      // Touchline Throw-in: place ball on touchline
      const touchZ = Math.sign(this.ball.position.z) * 31.8;
      const touchX = THREE.MathUtils.clamp(this.ball.position.x, -45, 45);
      this.ball.position.set(touchX, this.ballRadius, touchZ);
      this.ballVel.set(0, 0, 0);
      this.kickCooldown = 0.5;

      let nearest = this.homePlayers[1];
      let minDist = 999;
      this.homePlayers.forEach(p => {
        if (p.data.pos === 'GK') return;
        const d = p.mesh.position.distanceTo(this.ball.position);
        if (d < minDist) { minDist = d; nearest = p; }
      });
      if (nearest) {
        nearest.mesh.position.set(touchX, 0, touchZ);
        nearest.hasPossession = true;
        if (this.activePlayer) this.activePlayer.parts.selectionRing.material.opacity = 0;
        this.activePlayer = nearest;
        this.updateHUDPlayerCard();
      }
    }
  }

  checkGoalCollision() {
    const halfL = 50.0;
    const halfGW = this.goalWidth / 2; // 3.66

    // Home Team Goal Check (Ball crosses +50.0 into Away goal)
    if (this.ball.position.x >= halfL && this.ball.position.x <= halfL + 2.5 && Math.abs(this.ball.position.z) <= halfGW && this.ball.position.y <= this.goalHeight) {
      if (this.matchManager) {
        this.matchManager.triggerGoal(true);
      } else if (!this.isGoalSequence) {
        this.triggerGoal(true);
      }
    }
    // Away Team Goal Check (Ball crosses -50.0 into Home goal)
    else if (this.ball.position.x <= -halfL && this.ball.position.x >= -halfL - 2.5 && Math.abs(this.ball.position.z) <= halfGW && this.ball.position.y <= this.goalHeight) {
      if (this.matchManager) {
        this.matchManager.triggerGoal(false);
      } else if (!this.isGoalSequence) {
        this.triggerGoal(false);
      }
    }
  }

  triggerGoal(isHomeGoal) {
    this.isGoalSequence = true;
    this.goalTimer = 4.0;

    if (isHomeGoal) {
      this.homeScore++;
      document.getElementById('score-home').textContent = this.homeScore;
    } else {
      this.awayScore++;
      document.getElementById('score-away').textContent = this.awayScore;
    }

    this.audio.playGoalRoar();
    this.audio.playWhistle();
    this.spawnConfetti();
    this.cameraShake = 0.45;

    // Goal Scorer Info
    const defaultScorer = isHomeGoal 
      ? (this.homePlayers.find(p => p.data.pos === 'ST') || this.homePlayers[9] || this.homePlayers[0]).data.name 
      : (this.awayPlayers.find(p => p.data.pos === 'ST') || this.awayPlayers[9] || this.awayPlayers[0]).data.name;
    const scorer = this.lastKicker ? this.lastKicker.data.name : defaultScorer;
    const banner = document.getElementById('goal-banner');
    const scorerInfo = document.getElementById('goal-scorer-info');
    if (scorerInfo) scorerInfo.textContent = `${scorer} muhteşem bir gol atıyor!`;
    if (banner) banner.classList.add('show');

    // Trigger celebration on scorer
    if (this.lastKicker) {
      this.lastKicker.isCelebrating = true;
      this.lastKicker.celebrationTimer = 3.5;
    }
  }

  resetKickoff(kickingTeam = 'home') {
    this.ball.position.set(0, this.ballRadius, 0);
    this.ballVel.set(0, 0, 0);
    this.ballSpin.set(0, 0, 0);
    this.lastKicker = null;
    this.passReceiver = null;
    this.kickCooldown = 0.3;

    // Reset formations & animation states
    this.homePlayers.forEach((p, i) => {
      const slot = this.baseFormationHome[i] || { x: -20, z: 0 };
      if (!p.isSentOff) {
        p.mesh.position.set(slot.x, 0, slot.z);
        p.mesh.rotation.set(0, Math.PI / 2, 0);
      }
      p.hasPossession = false;
      p.isCelebrating = false;
      p.isTeammateCelebrating = false;
      p.isConcedingDisappointed = false;
      p.isFouled = false;
      p.isFouling = false;
      if (p.parts && p.parts.selectionRing) p.parts.selectionRing.material.opacity = 0;
    });

    this.awayPlayers.forEach((p, i) => {
      const slot = this.baseFormationAway[i] || { x: 20, z: 0 };
      if (!p.isSentOff) {
        p.mesh.position.set(slot.x, 0, slot.z);
        p.mesh.rotation.set(0, -Math.PI / 2, 0);
      }
      p.hasPossession = false;
      p.isCelebrating = false;
      p.isTeammateCelebrating = false;
      p.isConcedingDisappointed = false;
      p.isFouled = false;
      p.isFouling = false;
      if (p.parts && p.parts.selectionRing) p.parts.selectionRing.material.opacity = 0;
    });

    // Determine kickoff taker based on conceding/restarting team
    if (kickingTeam === 'away') {
      const awayKicker = this.awayPlayers.find(p => p.data.pos === 'ST') || this.awayPlayers[9] || this.awayPlayers[0];
      awayKicker.mesh.position.set(0.6, 0, 0);
      awayKicker.hasPossession = true;
      // Keep user control on active home player
      const homeClosest = this.homePlayers.find(p => p.data.pos === 'ST') || this.homePlayers[9] || this.homePlayers[0];
      this.activePlayer = homeClosest;
      if (this.activePlayer && this.activePlayer.parts && this.activePlayer.parts.selectionRing) {
        this.activePlayer.parts.selectionRing.material.opacity = 0.85;
      }
      this.updateHUDPlayerCard();
    } else {
      const homeKicker = this.homePlayers.find(p => p.data.pos === 'ST') || this.homePlayers[9] || this.homePlayers[0];
      homeKicker.mesh.position.set(-0.6, 0, 0);
      homeKicker.hasPossession = true;
      this.activePlayer = homeKicker;
      if (this.activePlayer && this.activePlayer.parts && this.activePlayer.parts.selectionRing) {
        this.activePlayer.parts.selectionRing.material.opacity = 0.85;
      }
      this.updateHUDPlayerCard();
    }
  }

  // --- Universal Player Skeletal Locomotion & Expressive Animation ---
  updatePlayerLocomotion(player, dt, isMoving, speed) {
    // 1. Kick strike animation
    if (player.kickTimer > 0) {
      player.kickTimer -= dt;
      const progress = THREE.MathUtils.clamp(1.0 - (player.kickTimer / 0.35), 0, 1);
      const kickAngle = Math.sin(progress * Math.PI) * 1.35;
      player.parts.rightLeg.rotation.x = -kickAngle;
      player.parts.torso.rotation.x = 0.22;
      return;
    }

    // 2. Foul fall & roll reaction (Holding shin/ankle on turf)
    if (player.isFouled && player.stumbleTimer > 0) {
      player.parts.torso.rotation.x = -1.35;
      player.parts.torso.rotation.z = 0.45;
      player.parts.leftLeg.rotation.x = 1.1;
      player.parts.rightLeg.rotation.x = 1.4;
      player.parts.leftArm.rotation.x = 1.2;
      player.parts.rightArm.rotation.x = 1.0;
      player.parts.torso.position.y = 0.38;
      return;
    }

    // Fouler innocence protest pose ("Ben yapmadım!")
    if (player.isFouling) {
      player.parts.leftArm.rotation.x = -1.2;
      player.parts.leftArm.rotation.z = -0.55;
      player.parts.rightArm.rotation.x = -1.2;
      player.parts.rightArm.rotation.z = 0.55;
      player.parts.torso.rotation.x = -0.15;
      return;
    }

    // Red-carded player walking off to the tunnel
    if (player.isWalkingOff) {
      player.parts.torso.rotation.x = 0.35; // head hung low
      player.parts.leftArm.rotation.x = 0.2;
      player.parts.rightArm.rotation.x = 0.2;
      player.runCycle += dt * 6;
      player.parts.leftLeg.rotation.x = Math.sin(player.runCycle) * 0.35;
      player.parts.rightLeg.rotation.x = -Math.sin(player.runCycle) * 0.35;
      const sideDir = Math.sign(player.mesh.position.z) || 1;
      player.mesh.position.z += dt * sideDir * 3.8;
      if (Math.abs(player.mesh.position.z) > 36) {
        player.mesh.visible = false;
        player.isWalkingOff = false;
      }
      return;
    }

    // Standard brief stumble animation (when dispossessed)
    if (player.stumbleTimer > 0) {
      player.stumbleTimer -= dt;
      player.parts.torso.rotation.x = -0.28;
      player.parts.leftArm.rotation.x = 0.7;
      player.parts.rightArm.rotation.x = 0.7;
      player.parts.leftLeg.rotation.x = 0.15;
      player.parts.rightLeg.rotation.x = -0.15;
      return;
    }

    // 3. Slide Tackle animation
    if (player.isTackling) {
      player.parts.torso.rotation.x = 0.5;
      player.parts.leftLeg.rotation.x = 1.3;
      player.parts.rightLeg.rotation.x = -0.3;
      player.parts.leftArm.rotation.x = -0.8;
      player.parts.rightArm.rotation.x = 0.5;
      return;
    }

    // 4. Goalkeeper Dive animation
    if (player.diveTimer > 0) {
      player.diveTimer -= dt;
      player.mesh.rotation.z = THREE.MathUtils.lerp(player.mesh.rotation.z, player.diveDir * 1.35, dt * 10);
      player.parts.leftArm.rotation.z = player.diveDir * 0.95;
      player.parts.rightArm.rotation.z = player.diveDir * 0.95;
      player.parts.torso.rotation.x = 0.12;
      return;
    } else if (player.data.pos === 'GK') {
      player.mesh.rotation.z = THREE.MathUtils.lerp(player.mesh.rotation.z, 0, dt * 6);
      player.parts.leftArm.rotation.z = THREE.MathUtils.lerp(player.parts.leftArm.rotation.z, 0, dt * 6);
      player.parts.rightArm.rotation.z = THREE.MathUtils.lerp(player.parts.rightArm.rotation.z, 0, dt * 6);
    }

    // 5. Goal Celebrations & Reactions
    if (player.isCelebrating) {
      player.runCycle += dt * 11;
      const cType = player.celebrationType || 'siuuu';

      if (cType === 'siuuu') {
        // Ronaldo SIUUU: Jump, 180° airborne spin, thrust arms down!
        if (player.celebrationTimer > 1.8) {
          player.parts.torso.position.y = player.baseTorsoY + 0.85;
          player.mesh.rotation.y += dt * 11;
          player.parts.leftArm.rotation.x = -2.8;
          player.parts.rightArm.rotation.x = -2.8;
          player.parts.leftLeg.rotation.x = 0.45;
          player.parts.rightLeg.rotation.x = -0.45;
        } else {
          // Landing power stance with chest out and arms locked down
          player.parts.torso.position.y = player.baseTorsoY - 0.12;
          player.parts.leftArm.rotation.x = 0.95;
          player.parts.leftArm.rotation.z = -0.55;
          player.parts.rightArm.rotation.x = 0.95;
          player.parts.rightArm.rotation.z = 0.55;
          player.parts.leftLeg.rotation.x = 0.4;
          player.parts.rightLeg.rotation.x = 0.4;
          player.parts.torso.rotation.x = -0.25;
        }
      } else if (cType === 'knee_slide') {
        // Knee slide on turf with fists clenched
        player.parts.torso.position.y = 0.62;
        player.parts.torso.rotation.x = -0.45;
        player.parts.leftLeg.rotation.x = 1.7;
        player.parts.rightLeg.rotation.x = 1.7;
        player.parts.leftArm.rotation.x = -1.2;
        player.parts.leftArm.rotation.z = -0.45;
        player.parts.rightArm.rotation.x = -1.2;
        player.parts.rightArm.rotation.z = 0.45;
      } else {
        // Cheering with arms held high
        player.parts.leftArm.rotation.x = -2.65;
        player.parts.rightArm.rotation.x = -2.65;
        player.parts.leftLeg.rotation.x = Math.sin(player.runCycle) * 0.45;
        player.parts.rightLeg.rotation.x = -Math.sin(player.runCycle) * 0.45;
        player.parts.torso.position.y = player.baseTorsoY + Math.abs(Math.sin(player.runCycle)) * 0.14;
      }
      return;
    }

    // Teammates cheering together
    if (player.isTeammateCelebrating) {
      player.runCycle += dt * 10;
      player.parts.leftArm.rotation.x = -2.2 + Math.sin(player.runCycle * 2) * 0.3;
      player.parts.rightArm.rotation.x = -2.2 + Math.cos(player.runCycle * 2) * 0.3;
      player.parts.leftLeg.rotation.x = Math.sin(player.runCycle) * 0.4;
      player.parts.rightLeg.rotation.x = -Math.sin(player.runCycle) * 0.4;
      return;
    }

    // Conceding team disappointment pose
    if (player.isConcedingDisappointed) {
      player.parts.torso.rotation.x = 0.45;
      player.parts.leftArm.rotation.x = -1.8;
      player.parts.leftArm.rotation.z = 0.3;
      player.parts.rightArm.rotation.x = -1.8;
      player.parts.rightArm.rotation.z = -0.3;
      player.parts.leftLeg.rotation.x = 0;
      player.parts.rightLeg.rotation.x = 0;
      return;
    }

    // 6. Natural Running Locomotion
    if (isMoving && speed > 0.4) {
      player.runCycle += dt * speed * 1.55;
      const stride = Math.sin(player.runCycle);
      const amp = Math.min(0.85, 0.35 + (speed / 15.0) * 0.5);

      // Articulated legs swing from hip joint
      player.parts.leftLeg.rotation.x = stride * amp;
      player.parts.rightLeg.rotation.x = -stride * amp;

      // Arms swing opposite from shoulders
      player.parts.leftArm.rotation.x = -stride * (amp * 0.75);
      player.parts.rightArm.rotation.x = stride * (amp * 0.75);

      // Torso leans forward with speed
      const targetLean = 0.08 + (speed / 16.0) * 0.18;
      player.parts.torso.rotation.x = THREE.MathUtils.lerp(player.parts.torso.rotation.x, targetLean, 0.2);

      // Vertical stride bobbing (subtle bounce on step impact)
      player.parts.torso.position.y = player.baseTorsoY + Math.abs(Math.sin(player.runCycle * 2)) * 0.045;
    } else {
      // Idle breathing / standing pose
      player.parts.leftLeg.rotation.x = THREE.MathUtils.lerp(player.parts.leftLeg.rotation.x, 0, dt * 10);
      player.parts.rightLeg.rotation.x = THREE.MathUtils.lerp(player.parts.rightLeg.rotation.x, 0, dt * 10);
      player.parts.leftArm.rotation.x = THREE.MathUtils.lerp(player.parts.leftArm.rotation.x, 0, dt * 10);
      player.parts.rightArm.rotation.x = THREE.MathUtils.lerp(player.parts.rightArm.rotation.x, 0, dt * 10);
      player.parts.torso.rotation.x = THREE.MathUtils.lerp(player.parts.torso.rotation.x, 0, dt * 10);

      const breath = Math.sin(Date.now() * 0.003 + player.data.num) * 0.015;
      player.parts.torso.position.y = player.baseTorsoY + breath;
    }
  }

  // --- Players Update (Human Controls + 11v11 AI + Universal Locomotion) ---
  updatePlayers(dt) {
    // 1. User Controlled Active Player Movement
    if (this.activePlayer) {
      if (this.kickCooldown > 0) {
        this.kickCooldown -= dt;
      }

      const move = new THREE.Vector3();
      // Match Broadcast Camera: W = Up (-Z), S = Down (+Z), D = Right (+X), A = Left (-X)
      if (this.keys['KeyW'] || this.keys['ArrowUp']) move.z -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) move.z += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) move.x -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) move.x += 1;

      // 8-Directional Fluid Locomotion, Acceleration & On-Ball vs Off-Ball Speed Mechanics
      const locomotionState = this.locomotionEngine.updatePlayerMovement(
        this.activePlayer,
        move,
        this.isShiftDown,
        dt
      );

      // Animate active player locomotion with accurate current speed
      this.updatePlayerLocomotion(this.activePlayer, dt, locomotionState.isMoving, locomotionState.currentSpeed);

      // Dribbling & Ball Possession Check
      const pPos = this.activePlayer.mesh.position;
      const distToBall = pPos.distanceTo(this.ball.position);

      // Can only regain possession if not currently recovering from stumble
      if (this.kickCooldown <= 0 && this.activePlayer.stumbleTimer <= 0 && distToBall < 2.0) {
        if (!this.activePlayer.hasPossession) {
          this.activePlayer.hasPossession = true;
          this.awayPlayers.forEach(op => op.hasPossession = false);
        }
      }

      // Dynamic Cadence-Based Dribbling & Ball Control (Close control vs sprint knock-on)
      if (this.activePlayer.hasPossession && this.kickCooldown <= 0 && this.activePlayer.stumbleTimer <= 0) {
        const rotY = this.activePlayer.mesh.rotation.y;
        const fwd = new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY));
        const paceStat = this.activePlayer.data.pace || 80;
        const driStat = this.activePlayer.data.dri || 80;

        // Natural foot-to-ball distance:
        // - Close control in normal jog: 0.95m - 1.05m directly at the foot
        // - Sprint knock-on: 2.1m - 2.6m pushed ahead into stride, creating authentic tackle windows
        const isSprinting = locomotionState.isSprinting;
        const leadDist = isSprinting ? (2.1 + (paceStat / 100) * 0.5) : (0.95 + (driStat / 100) * 0.1);
        const dribbleTarget = pPos.clone().add(fwd.multiplyScalar(leadDist));
        dribbleTarget.y = this.ballRadius;

        // Dynamic interpolation rate: tighter touch for elite dribblers, looser during top sprint
        const lerpSpeed = isSprinting ? 0.22 : (0.38 + (driStat / 100) * 0.1);
        this.ball.position.lerp(dribbleTarget, lerpSpeed);

        // Natural rolling rotation of the ball on pitch matching dribble velocity
        const ballSpeed = this.activePlayer.vel ? this.activePlayer.vel.length() : 0;
        if (ballSpeed > 0.08) {
          this.ball.rotation.x += (this.activePlayer.vel.z / this.ballRadius) * dt;
          this.ball.rotation.z -= (this.activePlayer.vel.x / this.ballRadius) * dt;
        }
        this.ballVel.set(0, 0, 0);
      }

      // Slide Tackle Execution & Movement
      if (this.activePlayer.isTackling) {
        this.activePlayer.tackleTimer -= dt;
        this.activePlayer.mesh.position.addScaledVector(this.activePlayer.vel, dt);
        this.activePlayer.vel.multiplyScalar(0.92);
        this.activePlayer.mesh.position.y = 0;

        if (this.activePlayer.tackleTimer <= 0) {
          this.activePlayer.isTackling = false;
        }
      }

      // Pitch bounds clamping
      this.activePlayer.mesh.position.x = THREE.MathUtils.clamp(this.activePlayer.mesh.position.x, -49.2, 49.2);
      this.activePlayer.mesh.position.z = THREE.MathUtils.clamp(this.activePlayer.mesh.position.z, -31.2, 31.2);

      // Selection Ring
      this.activePlayer.parts.selectionRing.material.opacity = 0.85;
    }

    // 2. Pressing AI Identification
    let closestOpponent = null;
    let minOppDist = 9999;
    const bPos = this.ball.position;
    this.awayPlayers.forEach(p => {
      if (p.data.pos === 'GK') return;
      const d = p.mesh.position.distanceTo(bPos);
      if (d < minOppDist) {
        minOppDist = d;
        closestOpponent = p;
      }
    });

    let closestTeammate = null;
    let minMateDist = 9999;
    this.homePlayers.forEach(p => {
      if (p === this.activePlayer || p.data.pos === 'GK') return;
      const d = p.mesh.position.distanceTo(bPos);
      if (d < minMateDist) {
        minMateDist = d;
        closestTeammate = p;
      }
    });

    const awayHasBall = this.awayPlayers.some(p => p.hasPossession);

    // 3. Teammates AI (Home Team)
    this.homePlayers.forEach((p, i) => {
      if (p === this.activePlayer) return;
      p.parts.selectionRing.material.opacity = 0;
      const isPressing = awayHasBall && (p === closestTeammate && minMateDist < 20);
      this.updateTeammateAI(p, this.baseFormationHome[i], dt, isPressing);

      p.mesh.position.x = THREE.MathUtils.clamp(p.mesh.position.x, -49.2, 49.2);
      p.mesh.position.z = THREE.MathUtils.clamp(p.mesh.position.z, -31.2, 31.2);
    });

    // 4. Opponent AI (Away Team - Tactical marking, standing tackles & interceptions)
    this.awayPlayers.forEach((p, i) => {
      const isPressing = (p === closestOpponent && minOppDist < 22);
      this.updateOpponentAI(p, this.baseFormationAway[i], dt, isPressing);

      p.mesh.position.x = THREE.MathUtils.clamp(p.mesh.position.x, -49.2, 49.2);
      p.mesh.position.z = THREE.MathUtils.clamp(p.mesh.position.z, -31.2, 31.2);
    });
  }

  updateTeammateAI(player, baseSlot, dt, isPressing) {
    if (player.data.pos === 'GK') {
      // Home GK (Courtois #1) patrols goal line at X = -49.2
      const targetZ = THREE.MathUtils.clamp(this.ball.position.z * 0.55, -2.4, 2.4);
      player.mesh.position.z = THREE.MathUtils.lerp(player.mesh.position.z, targetZ, dt * 4.0);
      player.mesh.position.x = -49.2;

      // Realistic GK Diving Saves & Concessions
      const distToBall = player.mesh.position.distanceTo(this.ball.position);
      const isShotComing = this.ballVel.x < -7.0 && this.ball.position.x < -36.0;

      if (isShotComing && !this.isGoalSequence && distToBall < 3.0) {
        const shotZ = this.ball.position.z;
        const shotY = this.ball.position.y;
        const dZ = Math.abs(shotZ - player.mesh.position.z);
        const diveReach = 1.95; // Courtois reach

        // If ball is right in top corner or extreme bottom post, GK cannot reach -> GOAL!
        const isUnstoppable = (Math.abs(shotZ) > 2.8 && dZ > 1.5) || (shotY > 1.95 && Math.abs(shotZ) > 2.2);

        if (!isUnstoppable && dZ <= diveReach && player.diveTimer <= 0) {
          player.diveTimer = 0.7;
          player.diveDir = shotZ > player.mesh.position.z ? -1 : 1;
          const shotSpeed = this.ballVel.length();

          if (shotSpeed > 32) {
            // Parried rebound deflection
            this.ballVel.x = Math.max(10, -this.ballVel.x * 0.35);
            this.ballVel.z += (Math.random() - 0.5) * 12.0;
            this.ballVel.y = 2.5;
          } else {
            // Controlled save / corner punch
            this.ballVel.x = 8.0;
            this.ballVel.z = (Math.random() - 0.5) * 6.0;
            this.ballVel.y = 1.2;
          }
          this.audio.playKick(0.7, 'normal');
          this.kickCooldown = 0.5;
        }
      }

      this.updatePlayerLocomotion(player, dt, Math.abs(player.mesh.position.z - targetZ) > 0.1, 4.0);
      return;
    }

    if (isPressing) {
      // Actively press the opponent ball carrier
      const toBall = new THREE.Vector3().subVectors(this.ball.position, player.mesh.position);
      toBall.y = 0;
      const dist = toBall.length();
      toBall.normalize();

      player.mesh.position.addScaledVector(toBall, 8.0 * dt);
      player.mesh.rotation.y = Math.atan2(toBall.x, toBall.z);

      // Teammate Tackle
      if (dist < 1.6 && this.kickCooldown <= 0) {
        player.kickTimer = 0.3;
        player.hasPossession = true;
        this.awayPlayers.forEach(op => {
          if (op.hasPossession) {
            op.hasPossession = false;
            op.stumbleTimer = 0.45;
          }
        });
        if (this.activePlayer) this.activePlayer.parts.selectionRing.material.opacity = 0;
        this.activePlayer = player;
        this.updateHUDPlayerCard();
        this.audio.playTackle();
      }

      this.updatePlayerLocomotion(player, dt, true, 8.0);
      return;
    }

    // Proactive attacking runs when user has possession
    const attackOffset = this.activePlayer && this.activePlayer.hasPossession ? 9.0 : 0.0;
    const target = new THREE.Vector3(
      baseSlot.x + this.ball.position.x * 0.35 + attackOffset,
      0,
      baseSlot.z + this.ball.position.z * 0.25
    );

    const dir = new THREE.Vector3().subVectors(target, player.mesh.position);
    const dist = dir.length();
    const isMoving = dist > 0.8;

    if (isMoving) {
      dir.normalize().multiplyScalar(7.2);
      player.mesh.position.addScaledVector(dir, dt);
      player.mesh.rotation.y = Math.atan2(dir.x, dir.z);
    }

    this.updatePlayerLocomotion(player, dt, isMoving, isMoving ? 7.2 : 0);
  }

  updateOpponentAI(player, baseSlot, dt, isPressing) {
    if (player.tackleCooldown > 0) {
      player.tackleCooldown -= dt;
    }

    if (player.data.pos === 'GK') {
      // Away GK (De Gea #1) patrols goal line at X = 49.2
      const targetZ = THREE.MathUtils.clamp(this.ball.position.z * 0.55, -2.4, 2.4);
      player.mesh.position.z = THREE.MathUtils.lerp(player.mesh.position.z, targetZ, dt * 4.0);
      player.mesh.position.x = 49.2;

      // Realistic GK Diving Saves & Concessions
      const distToBall = player.mesh.position.distanceTo(this.ball.position);
      const isShotComing = this.ballVel.x > 7.0 && this.ball.position.x > 36.0;

      if (isShotComing && !this.isGoalSequence && distToBall < 3.0) {
        const shotZ = this.ball.position.z;
        const shotY = this.ball.position.y;
        const dZ = Math.abs(shotZ - player.mesh.position.z);
        const diveReach = 1.85; // De Gea reach

        // Unstoppable corner strikes, side-netting rockets, or upper-90 goals beat the keeper!
        const isCornerGoal = Math.abs(shotZ) > 2.6 && dZ > 1.35;
        const isUpper90 = shotY > 1.95 && Math.abs(shotZ) > 2.1;
        const isRocket = this.ballVel.length() > 38 && distToBall < 1.6;

        if (isCornerGoal || isUpper90 || isRocket) {
          // Keeper dives in desperation but CANNOT reach! Result: SPECTACULAR GOAL!
          if (player.diveTimer <= 0) {
            player.diveTimer = 0.8;
            player.diveDir = shotZ > player.mesh.position.z ? 1 : -1;
          }
        } else if (dZ <= diveReach && player.diveTimer <= 0) {
          // Keeper executes athletic dive and saves the ball!
          player.diveTimer = 0.7;
          player.diveDir = shotZ > player.mesh.position.z ? 1 : -1;
          const shotSpeed = this.ballVel.length();

          if (shotSpeed > 30) {
            // Hard shot produces rebound deflection!
            this.ballVel.x = Math.min(-10, -this.ballVel.x * 0.35);
            this.ballVel.z += (Math.random() - 0.5) * 12.0;
            this.ballVel.y = 2.5;
          } else {
            // Weak shot caught or parried safe
            this.ballVel.x = -8.0;
            this.ballVel.z = (Math.random() - 0.5) * 6.0;
            this.ballVel.y = 1.0;
          }
          this.audio.playKick(0.75, 'normal');
          this.audio.playCrowdGasp();
          this.kickCooldown = 0.5;
        }
      }

      this.updatePlayerLocomotion(player, dt, Math.abs(player.mesh.position.z - targetZ) > 0.1, 4.0);
      return;
    }

    const distToBall = player.mesh.position.distanceTo(this.ball.position);

    // If opponent has possession, advance towards Home goal
    if (player.hasPossession) {
      const toGoal = new THREE.Vector3(-50.0, 0, 0).sub(player.mesh.position).normalize();
      player.mesh.position.addScaledVector(toGoal, 8.2 * dt);
      player.mesh.rotation.y = Math.atan2(toGoal.x, toGoal.z);

      const fwd = new THREE.Vector3(Math.sin(player.mesh.rotation.y), 0, Math.cos(player.mesh.rotation.y));
      this.ball.position.copy(player.mesh.position).add(fwd.multiplyScalar(0.95));
      this.ball.position.y = this.ballRadius;

      this.updatePlayerLocomotion(player, dt, true, 8.2);

      // Shoot if inside shooting zone
      if (player.mesh.position.x < -20) {
        player.hasPossession = false;
        player.kickTimer = 0.35;
        this.kickCooldown = 0.55;
        const targetZ = (Math.random() - 0.5) * 4.5;
        const shotAim = new THREE.Vector3(-50.0, 0, targetZ).sub(player.mesh.position).normalize();
        this.ballVel.copy(shotAim).multiplyScalar(28);
        this.ballVel.y = 1.6;
        this.lastKicker = player;
        this.audio.playKick(0.85, 'power');
      }
      return;
    }

    // Designated pressing defender: Closes down and executes tackles!
    if (isPressing) {
      const toBall = new THREE.Vector3().subVectors(this.ball.position, player.mesh.position);
      toBall.y = 0;
      const dist = toBall.length();
      toBall.normalize();

      player.mesh.position.addScaledVector(toBall, 8.0 * dt);
      player.mesh.rotation.y = Math.atan2(toBall.x, toBall.z);

      // AI STANDING TACKLE & INTERCEPTION MECHANIC:
      if (dist < 1.6 && player.tackleCooldown <= 0) {
        player.kickTimer = 0.3; // extend tackling leg
        player.tackleCooldown = 1.1; // reset cooldown

        // Check if user is vulnerable (sprinting or facing away)
        const userVulnerable = this.isShiftDown || (this.activePlayer && this.activePlayer.hasPossession);

        if (userVulnerable) {
          // DISPOSSESS USER!
          if (this.activePlayer) {
            this.activePlayer.hasPossession = false;
            this.activePlayer.stumbleTimer = 0.45; // stagger user
          }

          this.audio.playTackle();

          // High DEF stat = cleanly won possession, otherwise loose deflected ball
          const defSkill = (player.data.def || 75) / 100;
          if (Math.random() < defSkill * 0.75) {
            player.hasPossession = true;
            this.kickCooldown = 0.3;
          } else {
            // Loose ball bounces away
            const tackleBounce = toBall.clone().add(new THREE.Vector3(0, 0.2, (Math.random() - 0.5) * 0.8)).normalize();
            this.ballVel.copy(tackleBounce).multiplyScalar(14.0);
            this.kickCooldown = 0.4;
          }
        }
      }

      this.updatePlayerLocomotion(player, dt, true, 8.0);
    } else {
      // Hold 4-3-3 formation position
      const target = new THREE.Vector3(
        baseSlot.x + this.ball.position.x * 0.35,
        0,
        baseSlot.z + this.ball.position.z * 0.25
      );
      const dir = new THREE.Vector3().subVectors(target, player.mesh.position);
      const dist = dir.length();
      const isMoving = dist > 0.8;

      if (isMoving) {
        dir.normalize().multiplyScalar(6.5);
        player.mesh.position.addScaledVector(dir, dt);
        player.mesh.rotation.y = Math.atan2(dir.x, dir.z);
      }

      this.updatePlayerLocomotion(player, dt, isMoving, isMoving ? 6.5 : 0);
    }
  }

  // --- Unified Power Bar Fill Progression ---
  updatePowerBar(dt) {
    if (this.isChargingPower) {
      this.powerCharge = Math.min(1.0, this.powerCharge + dt * 1.4);
      const fill = document.getElementById('power-fill');
      if (fill) {
        fill.style.width = `${Math.round(this.powerCharge * 100)}%`;
      }
    }
  }

  // --- Dynamic Multi-Perspective Camera System ---
  cycleCamera() {
    this.currentCamIndex = (this.currentCamIndex + 1) % this.cameraModes.length;
    const mode = this.cameraModes[this.currentCamIndex];
    const labels = {
      broadcast: "Broadcast Cam",
      behind: "Behind Player",
      tactical: "Side Tactical",
      overhead: "Overhead Blimp"
    };
    const labelEl = document.getElementById('camera-label');
    if (labelEl) labelEl.textContent = labels[mode];
  }

  updateCamera() {
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

    const focus = this.activePlayer ? this.activePlayer.mesh.position : new THREE.Vector3();
    const ballPos = this.ball ? this.ball.position : new THREE.Vector3();
    this.cameraTarget.lerp(new THREE.Vector3().lerpVectors(focus, ballPos, 0.35), 0.1);

    const mode = this.cameraModes[this.currentCamIndex];

    switch (mode) {
      case 'broadcast':
        this.camera.position.lerp(new THREE.Vector3(this.cameraTarget.x * 0.5, 26, 44), 0.08);
        this.camera.lookAt(this.cameraTarget.x, 1.2, this.cameraTarget.z * 0.6);
        break;

      case 'behind':
        if (this.activePlayer) {
          const fwd = new THREE.Vector3(
            Math.sin(this.activePlayer.mesh.rotation.y),
            0,
            Math.cos(this.activePlayer.mesh.rotation.y)
          );
          const camPos = focus.clone().sub(fwd.multiplyScalar(8)).add(new THREE.Vector3(0, 4.2, 0));
          this.camera.position.lerp(camPos, 0.12);
          this.camera.lookAt(focus.x, 1.8, focus.z);
        }
        break;

      case 'tactical':
        this.camera.position.lerp(new THREE.Vector3(this.cameraTarget.x, 18, 32), 0.1);
        this.camera.lookAt(this.cameraTarget.x, 0, 0);
        break;

      case 'overhead':
        this.camera.position.lerp(new THREE.Vector3(this.cameraTarget.x, 48, this.cameraTarget.z + 2), 0.1);
        this.camera.lookAt(this.cameraTarget.x, 0, this.cameraTarget.z);
        break;
    }

    // Camera Shake Impulse on powerful strikes & post pings
    if (this.cameraShake > 0.01) {
      const shakeOffset = new THREE.Vector3(
        (Math.random() - 0.5) * this.cameraShake * 1.6,
        (Math.random() - 0.5) * this.cameraShake * 1.2,
        (Math.random() - 0.5) * this.cameraShake * 1.6
      );
      this.camera.position.add(shakeOffset);
      this.cameraShake *= 0.88;
    } else {
      this.cameraShake = 0;
    }
  }

  // --- CINEMATIC BOZAN GAMES SPLASH SCREEN & PARTICLES ---
  initSplashEffects() {
    const canvas = document.getElementById('splash-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.7 - 0.3,
        color: Math.random() < 0.65 ? 'rgba(16, 185, 129, ' : 'rgba(245, 158, 11, ',
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01
      });
    }

    const animateSplash = () => {
      if (this.screenState === 'splash') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.max(0.05, Math.min(0.9, p.alpha)) + ')';
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color + '0.8)';
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(animateSplash);
    };
    animateSplash();
  }

  replayIntro() {
    this.screenState = 'splash';
    const splashScreen = document.getElementById('splash-screen');
    const mainMenu = document.getElementById('main-menu');
    const hudOverlay = document.getElementById('hud-overlay');

    if (mainMenu) mainMenu.classList.remove('active');
    if (hudOverlay) hudOverlay.style.display = 'none';
    if (splashScreen) {
      splashScreen.classList.add('active');
      const letters = splashScreen.querySelectorAll('.letter-glow');
      letters.forEach(l => {
        l.style.animation = 'none';
        void l.offsetWidth; // trigger reflow
        l.style.animation = '';
      });
      const laser = splashScreen.querySelector('.title-laser-sweep');
      if (laser) {
        laser.style.animation = 'none';
        void laser.offsetWidth;
        laser.style.animation = '';
      }
    }
    this.audio.playIntroBoom();
  }

  // --- UI & Modals Management ---
  initUI() {
    // --- SPLASH SCREEN LOGIC ---
    const splashScreen = document.getElementById('splash-screen');
    const mainMenu = document.getElementById('main-menu');
    const btnSplashStart = document.getElementById('btn-splash-start');

    const enterMainMenu = () => {
      if (this.screenState !== 'splash') return;
      this.audio.init();
      this.audio.playIntroBoom();
      this.audio.startMusic(0);
      this.audio.playWhistle('short');
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

    // Replay Bozan Games Intro Button
    const btnReplayIntro = document.getElementById('menu-btn-replay-intro');
    btnReplayIntro?.addEventListener('click', () => {
      this.replayIntro();
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

    // --- FIFA SOUNDTRACK WIDGET CONTROLS (MAIN MENU) ---
    const btnMusicPrev = document.getElementById('btn-music-prev');
    const btnMusicToggle = document.getElementById('btn-music-toggle');
    const btnMusicNext = document.getElementById('btn-music-next');
    const visualizer = document.getElementById('soundtrack-visualizer');
    const musicIcon = document.getElementById('music-toggle-icon');

    btnMusicPrev?.addEventListener('click', () => {
      this.audio.prevTrack();
    });

    btnMusicToggle?.addEventListener('click', () => {
      if (this.audio.isPlayingMusic) {
        this.audio.stopMusic();
        if (visualizer) visualizer.classList.add('paused');
        if (musicIcon) {
          musicIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
      } else {
        this.audio.startMusic(this.audio.currentTrackIndex);
        if (visualizer) visualizer.classList.remove('paused');
        if (musicIcon) {
          musicIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        }
      }
    });

    btnMusicNext?.addEventListener('click', () => {
      this.audio.nextTrack();
    });

    // Track change callback
    this.audio.onTrackChange = (track) => {
      const titleEl = document.getElementById('soundtrack-title');
      const artistEl = document.getElementById('soundtrack-artist');
      const bpmEl = document.getElementById('soundtrack-bpm');
      const hudTitleEl = document.getElementById('hud-track-title');
      if (titleEl) titleEl.textContent = track.title;
      if (artistEl) artistEl.textContent = `${track.artist} • ${track.genre}`;
      if (bpmEl) bpmEl.textContent = `${track.bpm} BPM`;
      if (hudTitleEl) hudTitleEl.textContent = track.title;

      document.querySelectorAll('#track-control .seg-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.track) === this.audio.currentTrackIndex);
      });

      const hudPill = document.getElementById('hud-now-playing-pill');
      if (hudPill) {
        hudPill.classList.remove('hidden');
        clearTimeout(this.hudPillTimer);
        this.hudPillTimer = setTimeout(() => {
          hudPill.classList.add('hidden');
        }, 4000);
      }
    };

    // --- 4-CHANNEL STUDIO AUDIO MIXER ---
    const sliderMaster = document.getElementById('slider-vol-master');
    const sliderMusic = document.getElementById('slider-vol-music');
    const sliderSFX = document.getElementById('slider-vol-sfx');
    const sliderCrowd = document.getElementById('slider-vol-crowd');

    const dispMaster = document.getElementById('disp-val-master');
    const dispMusic = document.getElementById('disp-val-music');
    const dispSFX = document.getElementById('disp-val-sfx');
    const dispCrowd = document.getElementById('disp-val-crowd');

    sliderMaster?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.audio.setMasterVolume(val / 100);
      if (dispMaster) dispMaster.textContent = `${val}%`;
    });

    sliderMusic?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.audio.setMusicVolume(val / 100);
      if (dispMusic) dispMusic.textContent = `${val}%`;
    });

    sliderSFX?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.audio.setSFXVolume(val / 100);
      if (dispSFX) dispSFX.textContent = `${val}%`;
    });

    sliderCrowd?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.audio.setCrowdVolume(val / 100);
      if (dispCrowd) dispCrowd.textContent = `${val}%`;
    });

    document.querySelectorAll('#track-control .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#track-control .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const trackIdx = parseInt(btn.dataset.track);
        this.audio.startMusic(trackIdx);
      });
    });

    const btnMixerMute = document.getElementById('btn-mixer-mute-toggle');
    const mixerMuteText = document.getElementById('mixer-mute-text');
    const updateMuteUI = (muted) => {
      if (mixerMuteText) mixerMuteText.textContent = muted ? 'Sesi Aç' : 'Tümünü Sustur';
      const hudSoundLabel = document.getElementById('hud-sound-label');
      if (hudSoundLabel) hudSoundLabel.textContent = muted ? 'Sessiz' : 'Ses Açık';
      const menuAudioIcon = document.getElementById('menu-audio-icon');
      if (menuAudioIcon) menuAudioIcon.style.opacity = muted ? '0.35' : '1';
    };

    btnMixerMute?.addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      updateMuteUI(muted);
    });

    document.getElementById('btn-hud-sound')?.addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      updateMuteUI(muted);
    });

    // Tactile UI Sound Effects on all interactive elements
    document.querySelectorAll('button, .seg-btn, .pill, .mini-team-pill, .menu-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (this.audio && this.audio.playUIHover) this.audio.playUIHover();
      });
      el.addEventListener('click', () => {
        if (this.audio && this.audio.playUIClick) this.audio.playUIClick();
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
      document.getElementById('pause-score').textContent = `${this.homeScore} - ${this.awayScore}`;
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
      document.getElementById('home-att-bar').style.width = `${hTeam.ratings.att}%`;
      document.getElementById('home-mid-val').textContent = hTeam.ratings.mid;
      document.getElementById('home-mid-bar').style.width = `${hTeam.ratings.mid}%`;
      document.getElementById('home-def-val').textContent = hTeam.ratings.def;
      document.getElementById('home-def-bar').style.width = `${hTeam.ratings.def}%`;

      document.getElementById('sel-away-name').textContent = aTeam.name.toUpperCase();
      document.getElementById('away-att-val').textContent = aTeam.ratings.att;
      document.getElementById('away-att-bar').style.width = `${aTeam.ratings.att}%`;
      document.getElementById('away-mid-val').textContent = aTeam.ratings.mid;
      document.getElementById('away-mid-bar').style.width = `${aTeam.ratings.mid}%`;
      document.getElementById('away-def-val').textContent = aTeam.ratings.def;
      document.getElementById('away-def-bar').style.width = `${aTeam.ratings.def}%`;
    };

    teams.forEach(t => {
      // Home Pill
      const hPill = document.createElement('div');
      hPill.className = `team-select-pill ${this.selectedHomeKey === t.key ? 'active' : ''}`;
      hPill.innerHTML = `
        <div class="team-pill-info">
          <span class="team-dot" style="background-color: #${t.homeColor.toString(16).padStart(6, '0')}"></span>
          <span class="team-pill-name">${t.name}</span>
        </div>
        <span class="team-pill-ovr">${t.ratings.ovr} OVR</span>
      `;
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
      aPill.className = `team-select-pill ${this.selectedAwayKey === t.key ? 'active' : ''}`;
      aPill.innerHTML = `
        <div class="team-pill-info">
          <span class="team-dot" style="background-color: #${t.homeColor.toString(16).padStart(6, '0')}"></span>
          <span class="team-pill-name">${t.name}</span>
        </div>
        <span class="team-pill-ovr">${t.ratings.ovr} OVR</span>
      `;
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
    this.resetKickoff('home');

    // Start Match Manager State & Timer
    if (this.matchManager) {
      this.matchManager.startMatch(this.selectedHomeKey, this.selectedAwayKey);
    }

    // Sound & Atmosphere transition
    this.audio.stopMusic();
    this.audio.startStadiumCrowd();
    this.audio.playWhistle('long');
  }

  returnToMainMenu() {
    this.screenState = 'menu';
    this.isPaused = true;

    // Hide Match HUD & modals
    document.getElementById('hud-overlay').style.display = 'none';
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));

    // Show Main Menu
    document.getElementById('main-menu')?.classList.add('active');

    // Sound & Atmosphere transition
    this.audio.stopStadiumCrowd();
    this.audio.startMusic(this.audio.currentTrackIndex);
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
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--color-text-muted);">Aramanıza uygun oyuncu kartı bulunamadı.</div>`;
      return;
    }

    allCards.forEach(d => {
      const card = document.createElement('div');
      card.className = `player-card card-tier-${d.tier}`;

      const fallbackAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";

      card.innerHTML = `
        <div class="card-tier-label">${d.tier.toUpperCase()}</div>
        <div class="card-header-stats">
          <div class="card-ovr-box">
            <span class="card-ovr">${d.ovr}</span>
            <span class="card-position">${d.pos}</span>
          </div>
          <div class="card-meta-badges">
            <span class="card-num-badge">#${d.num}</span>
            <span class="card-club-pill">${d.clubShort}</span>
          </div>
        </div>
        <div class="card-player-portrait">
          <img src="assets/players/${d.photo}.jpg" alt="${d.name}" onerror="this.src='${fallbackAvatar}'">
        </div>
        <div class="card-info">
          <div class="card-name">${d.name}</div>
          <div class="card-physio">${d.height}m &bull; ${d.weight}kg</div>
          <div class="card-stats-grid">
            <div class="card-stat-item"><span class="stat-val">${d.pace}</span><span class="stat-key">PAC</span></div>
            <div class="card-stat-item"><span class="stat-val">${d.sho}</span><span class="stat-key">SHO</span></div>
            <div class="card-stat-item"><span class="stat-val">${d.pas}</span><span class="stat-key">PAS</span></div>
            <div class="card-stat-item"><span class="stat-val">${d.dri}</span><span class="stat-key">DRI</span></div>
            <div class="card-stat-item"><span class="stat-val">${d.def}</span><span class="stat-key">DEF</span></div>
            <div class="card-stat-item"><span class="stat-val">${d.phy}</span><span class="stat-key">PHY</span></div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.audio.playKick(0.3, 'finesse');
      });

      container.appendChild(card);
    });
  }

  // --- SUBSTITUTIONS & SQUAD MANAGEMENT ---
  populateSubsModal() {
    const startersList = document.getElementById('active-starters-list');
    const benchList = document.getElementById('bench-substitutes-list');
    if (!startersList || !benchList) return;

    startersList.innerHTML = '';
    benchList.innerHTML = '';

    this.selectedOutgoing = null;
    this.selectedIncoming = null;

    this.homePlayers.forEach(p => {
      const isRed = p.isSentOff;
      const item = document.createElement('div');
      item.className = 'roster-item' + (isRed ? ' sent-off' : '');
      const cardBadge = isRed
        ? '<span style="color:#ef4444; font-weight:800; margin-left:6px; font-size:11px;">[KIRMIZI KART]</span>'
        : (p.yellowCards ? '<span style="color:#eab308; font-weight:800; margin-left:6px; font-size:11px;">[SARI KART]</span>' : '');

      item.innerHTML = `
        <div class="roster-item-info">
          <span style="font-weight:700; color:var(--color-primary-light);">#${p.data.num}</span>
          <span>${p.data.name} (${p.data.pos})</span>
          ${cardBadge}
        </div>
        <div class="roster-item-stamina">${isRed ? 'İHRAÇ EDİLDİ' : Math.round(p.stamina) + '% COND'}</div>
      `;

      if (!isRed) {
        item.addEventListener('click', () => {
          document.querySelectorAll('#active-starters-list .roster-item').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          this.selectedOutgoing = p;
          this.audio.playKick(0.2, 'finesse');
        });
      }
      startersList.appendChild(item);
    });

    const benchPlayers = (this.currentHomeTeam && this.currentHomeTeam.bench) || [];
    benchPlayers.forEach(b => {
      const item = document.createElement('div');
      item.className = 'roster-item';
      item.innerHTML = `
        <div class="roster-item-info">
          <span style="font-weight:700; color:var(--color-accent-light);">#${b.num}</span>
          <span>${b.name} (${b.pos})</span>
        </div>
        <div class="roster-item-stamina" style="color:var(--color-accent-light);">100% COND</div>
      `;
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
    const oldData = outP.data;

    if (outP.isSentOff) {
      alert("Kırmızı kart gören oyuncu değiştirilemez!");
      return;
    }

    // 1. Swap bench array data
    if (this.currentHomeTeam && this.currentHomeTeam.bench) {
      const inIdx = this.currentHomeTeam.bench.findIndex(b => b.name === inData.name && b.num === inData.num);
      if (inIdx !== -1) {
        this.currentHomeTeam.bench[inIdx] = oldData;
      }
    }

    // 2. Rebuild the 3D player mesh on pitch
    const newP = this.createHumanoidPlayer(inData, true);
    newP.mesh.position.copy(outP.mesh.position);
    newP.mesh.rotation.copy(outP.mesh.rotation);
    newP.vel.copy(outP.vel);
    newP.stamina = 100.0;
    newP.yellowCards = 0;

    // Remove old mesh from Three.js scene & add new mesh
    this.scene.remove(outP.mesh);
    this.scene.add(newP.mesh);

    // Replace in this.homePlayers array
    const pIdx = this.homePlayers.indexOf(outP);
    if (pIdx !== -1) {
      this.homePlayers[pIdx] = newP;
    }

    // Update active player if substituted
    if (this.activePlayer === outP) {
      this.activePlayer = newP;
      if (newP.parts.selectionRing) newP.parts.selectionRing.material.opacity = 0.85;
      this.updateHUDPlayerCard();
    }

    // 3. Show 4th Official Electronic Substitution Board (Tabela)
    this.showSubBoard(inData, oldData);

    // 4. Audio Chime & Close Modal
    this.audio.playSubChime();
    this.toggleModal('modal-subs');
    this.selectedOutgoing = null;
    this.selectedIncoming = null;
  }

  showSubBoard(inData, outData) {
    const overlay = document.getElementById('sub-board-overlay');
    const inNum = document.getElementById('sub-in-number');
    const inName = document.getElementById('sub-in-name');
    const outNum = document.getElementById('sub-out-number');
    const outName = document.getElementById('sub-out-name');
    const teamName = document.getElementById('sub-board-team-name');

    if (!overlay) return;
    if (inNum) inNum.textContent = inData.num;
    if (inName) inName.textContent = inData.name.toUpperCase();
    if (outNum) outNum.textContent = outData.num;
    if (outName) outName.textContent = outData.name.toUpperCase();
    if (teamName && this.currentHomeTeam) teamName.textContent = this.currentHomeTeam.shortName || 'BOZAN FC';

    overlay.classList.add('show');
    if (this.subBoardTimeout) clearTimeout(this.subBoardTimeout);
    this.subBoardTimeout = setTimeout(() => {
      overlay.classList.remove('show');
    }, 4500);
  }

  updateHUDPlayerCard() {
    if (!this.activePlayer) return;
    const d = this.activePlayer.data;
    const ratingEl = document.getElementById('hud-player-rating');
    const nameEl = document.getElementById('hud-player-name');
    const numEl = document.getElementById('hud-player-num');
    const posEl = document.getElementById('hud-player-pos');
    const imgEl = document.getElementById('hud-player-img');

    if (ratingEl) ratingEl.textContent = d.ovr;
    if (nameEl) nameEl.textContent = d.name.toUpperCase();
    if (numEl) numEl.textContent = `#${d.num}`;
    if (posEl) posEl.textContent = d.pos;
    if (imgEl && d.photo) {
      imgEl.src = `assets/players/${d.photo}.jpg`;
      imgEl.style.display = 'block';
    }
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
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '');
  const screen = params.get('screen') || hash;
  if (screen === 'menu') {
    document.getElementById('splash-screen')?.classList.remove('active');
    document.getElementById('main-menu')?.classList.add('active');
    window.game.screenState = 'menu';
  } else if (screen === 'cards') {
    document.getElementById('splash-screen')?.classList.remove('active');
    document.getElementById('main-menu')?.classList.add('active');
    window.game.screenState = 'menu';
    window.game.populateCardsModal();
    window.game.toggleModal('modal-cards');
  } else if (screen === 'team_select') {
    document.getElementById('splash-screen')?.classList.remove('active');
    document.getElementById('main-menu')?.classList.add('active');
    window.game.screenState = 'menu';
    window.game.populateTeamSelection();
    window.game.toggleModal('modal-team-select');
  } else if (screen === 'match') {
    window.game.startMatch('real_madrid', 'al_nassr');
  } else if (screen === 'subs') {
    window.game.startMatch('real_madrid', 'al_nassr');
    window.game.populateSubsModal();
    window.game.toggleModal('modal-subs');
  } else if (screen === 'sub_board') {
    window.game.startMatch('real_madrid', 'al_nassr');
    window.game.showSubBoard(window.game.currentHomeTeam.bench[0], window.game.homePlayers[9].data);
  } else if (screen === 'foul') {
    window.game.startMatch('real_madrid', 'al_nassr');
    window.game.triggerFoul(window.game.homePlayers[9], window.game.awayPlayers[9], true);
  } else if (screen === 'goal') {
    window.game.startMatch('real_madrid', 'al_nassr');
    window.game.matchManager.triggerGoal(true);
  }
});
