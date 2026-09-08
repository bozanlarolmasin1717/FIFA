const fs = require('fs');
const path = require('path');

const gameJsPath = path.join(__dirname, '..', 'game.js');
let content = fs.readFileSync(gameJsPath, 'utf8');

// Build TEAMS_DATABASE code
const teamsDatabaseCode = `
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
`;

// Replace from "// --- Player Database & Rosters ---" to before "// --- Main Game Engine ---"
const startMarker = "// --- Player Database & Rosters ---";
const endMarker = "// --- Main Game Engine ---";

const sIndex = content.indexOf(startMarker);
const eIndex = content.indexOf(endMarker);

if (sIndex === -1 || eIndex === -1) {
  console.error("Could not find start or end markers for PLAYER_DATABASE in game.js");
  process.exit(1);
}

content = content.slice(0, sIndex) + teamsDatabaseCode + "\n" + content.slice(eIndex);

console.log("Successfully replaced TEAMS_DATABASE!");

fs.writeFileSync(gameJsPath, content, 'utf8');
console.log("Saved game.js with updated database.");
