const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'assets', 'players');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Map of playerKey to Wikipedia article title
const players = {
  // Real Madrid
  'vinicius_jr': 'Vin%C3%ADcius_J%C3%BAnior',
  'jude_bellingham': 'Jude_Bellingham',
  'kylian_mbappe': 'Kylian_Mbapp%C3%A9',
  'rodrygo': 'Rodrygo',
  'federico_valverde': 'Federico_Valverde',
  'luka_modric': 'Luka_Modri%C4%87',
  'thibaut_courtois': 'Thibaut_Courtois',
  'dani_carvajal': 'Dani_Carvajal',
  'eder_militao': '%C3%89der_Milit%C3%A3o',
  'antonio_rudiger': 'Antonio_R%C3%BCdiger',
  'ferland_mendy': 'Ferland_Mendy',
  'eduardo_camavinga': 'Eduardo_Camavinga',
  'arda_guler': 'Arda_G%C3%BCler',
  'aurelien_tchouameni': 'Aur%C3%A9lien_Tchouam%C3%A9ni',

  // Manchester City
  'erling_haaland': 'Erling_Haaland',
  'kevin_de_bruyne': 'Kevin_De_Bruyne',
  'rodri': 'Rodri_(footballer,_born_1996)',
  'phil_foden': 'Phil_Foden',
  'bernardo_silva': 'Bernardo_Silva',
  'ruben_dias': 'R%C3%BAben_Dias',
  'ederson': 'Ederson_(footballer,_born_1993)',
  'kyle_walker': 'Kyle_Walker',
  'josko_gvardiol': 'Jo%C5%A1ko_Gvardiol',
  'john_stones': 'John_Stones',
  'jack_grealish': 'Jack_Grealish',
  'jeremy_doku': 'J%C3%A9r%C3%A9my_Doku',
  'mateo_kovacic': 'Mateo_Kova%C4%8Di%C4%87',

  // Barcelona
  'robert_lewandowski': 'Robert_Lewandowski',
  'lamine_yamal': 'Lamine_Yamal',
  'pedri': 'Pedri',
  'raphinha': 'Raphinha',
  'gavi': 'Gavi_(footballer)',
  'frenkie_de_jong': 'Frenkie_de_Jong',
  'ter_stegen': 'Marc-Andr%C3%A9_ter_Stegen',
  'jules_kounde': 'Jules_Kound%C3%A9',
  'ronald_araujo': 'Ronald_Ara%C3%BAjo',
  'alejandro_balde': 'Alejandro_Balde',
  'pau_cubarsi': 'Pau_Cubars%C3%AD',
  'ferran_torres': 'Ferran_Torres',
  'dani_olmo': 'Dani_Olmo',

  // Bayern Munich
  'harry_kane': 'Harry_Kane',
  'jamal_musiala': 'Jamal_Musiala',
  'leroy_sane': 'Leroy_San%C3%A9',
  'joshua_kimmich': 'Joshua_Kimmich',
  'manuel_neuer': 'Manuel_Neuer',
  'alphonso_davies': 'Alphonso_Davies',
  'michael_olise': 'Michael_Olise',
  'leon_goretzka': 'Leon_Goretzka',
  'dayot_upamecano': 'Dayot_Upamecano',
  'kim_min_jae': 'Kim_Min-jae_(footballer)',
  'thomas_muller': 'Thomas_M%C3%BCller',
  'kingsley_coman': 'Kingsley_Coman',

  // Al-Nassr
  'cristiano_ronaldo': 'Cristiano_Ronaldo',
  'sadio_mane': 'Sadio_Man%C3%A9',
  'anderson_talisca': 'Talisca',
  'marcelo_brozovic': 'Marcelo_Brozovi%C4%87',
  'otavio': 'Ot%C3%A1vio_(footballer,_born_1995)',
  'aymeric_laporte': 'Aymeric_Laporte',
  'sultan_al_ghannam': 'Sultan_Al-Ghannam',
  'ali_lajami': 'Ali_Lajami',
  'alex_telles': 'Alex_Telles',
  'bento': 'Bento_(footballer)',
  'abdulrahman_ghareeb': 'Abdulrahman_Ghareeb'
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BozanGamesSportsSim/1.0 (contact@bozangames.com)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJSON(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BozanGamesSportsSim/1.0 (contact@bozangames.com)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with HTTP ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Downloading player portraits for ${Object.keys(players).length} players...`);
  let successCount = 0;
  let failCount = 0;

  for (const [key, article] of Object.entries(players)) {
    const dest = path.join(targetDir, `${key}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[EXISTS] ${key}`);
      successCount++;
      continue;
    }

    try {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${article}`;
      const data = await fetchJSON(summaryUrl);
      const imgUrl = (data.thumbnail && data.thumbnail.source) || (data.originalimage && data.originalimage.source);
      if (imgUrl) {
        await downloadImage(imgUrl, dest);
        console.log(`[OK] ${key} (${fs.statSync(dest).size} bytes)`);
        successCount++;
      } else {
        console.warn(`[NO_IMG] ${key}`);
        failCount++;
      }
    } catch (err) {
      console.error(`[FAIL] ${key}: ${err.message}`);
      failCount++;
    }

    // Gentle throttle to respect API
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\nCompleted! Downloaded: ${successCount}, Failed: ${failCount}`);
}

run();
