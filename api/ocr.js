// api/ocr.js — Vercel Serverless Function
// Runs Tesseract OCR on the server (fast) and returns parsed team data
// Called by scan.html with POST { imgA: base64, imgB: base64 }

import Tesseract from 'tesseract.js';

// ── Fuzzy match helpers ──
const MOVES = ["Accelerock","Acid Spray","Acrobatics","Aerial Ace","After You","Agility","Air Cutter","Air Slash","Ally Switch","Amnesia","Ancient Power","Aqua Jet","Aqua Ring","Aqua Tail","Assurance","Attract","Aura Sphere","Aurora Veil","Avalanche","Baby Doll Eyes","Baton Pass","Beat Up","Belch","Belly Drum","Bite","Blizzard","Body Press","Body Slam","Boomburst","Bounce","Brave Bird","Breaking Swipe","Brick Break","Brutal Swing","Bug Buzz","Bulk Up","Bulldoze","Bullet Punch","Bullet Seed","Calm Mind","Charge Beam","Charm","Chilling Water","Circle Throw","Clear Smog","Close Combat","Coaching","Coil","Confuse Ray","Copycat","Counter","Crunch","Curse","Dark Pulse","Dazzling Gleam","Destiny Bond","Detect","Dig","Discharge","Dive","Double-Edge","Dragon Claw","Dragon Dance","Dragon Pulse","Dragon Rush","Dragon Tail","Drain Punch","Draining Kiss","Drill Run","Earth Power","Earthquake","Eerie Impulse","Electro Ball","Electroweb","Encore","Endeavor","Endure","Energy Ball","Explosion","Extrasensory","Facade","Fake Out","Fake Tears","Feint","Fire Blast","Fire Fang","Fire Punch","Fire Spin","Flail","Flame Charge","Flamethrower","Flare Blitz","Flash Cannon","Fling","Flip Turn","Fly","Focus Blast","Focus Energy","Focus Punch","Follow Me","Foul Play","Freeze Dry","Frenzy Plant","Future Sight","Giga Drain","Giga Impact","Grass Knot","Grassy Glide","Grassy Terrain","Gravity","Growth","Gunk Shot","Gyro Ball","Hammer Arm","Hard Press","Haze","Head Smash","Heal Bell","Heat Crash","Heat Wave","Heavy Slam","Helping Hand","Hex","High Horsepower","High Jump Kick","Horn Leech","Hurricane","Hydro Cannon","Hydro Pump","Hyper Beam","Hyper Voice","Ice Beam","Ice Fang","Ice Hammer","Ice Punch","Ice Shard","Ice Spinner","Icicle Crash","Icicle Spear","Icy Wind","Infernal Parade","Inferno","Ingrain","Iron Defense","Iron Head","Iron Tail","Jet Punch","Kings Shield","Knock Off","Lash Out","Last Respects","Lava Plume","Leaf Blade","Leaf Storm","Leech Life","Leech Seed","Life Dew","Light Screen","Liquidation","Low Kick","Low Sweep","Mach Punch","Magic Room","Mean Look","Mega Kick","Megahorn","Memento","Metal Burst","Metal Sound","Meteor Beam","Mirror Coat","Misty Terrain","Moonblast","Moonlight","Morning Sun","Mortal Spin","Mud Shot","Mud-Slap","Muddy Water","Mystical Fire","Nasty Plot","Night Shade","Night Slash","Nuzzle","Outrage","Overheat","Pain Split","Parting Shot","Payback","Perish Song","Petal Dance","Phantom Force","Play Rough","Poison Jab","Pollen Puff","Poltergeist","Pounce","Power Whip","Protect","Psych Up","Psychic","Psychic Fangs","Psycho Cut","Psyshock","Quiver Dance","Rage Powder","Raging Bull","Rain Dance","Rapid Spin","Razor Shell","Recover","Reflect","Rest","Reversal","Rising Voltage","Roar","Rock Blast","Rock Slide","Rock Tomb","Role Play","Roost","Round","Sacred Sword","Safeguard","Sand Tomb","Sandstorm","Scale Shot","Scary Face","Scorching Sands","Screech","Seed Bomb","Shadow Ball","Shadow Claw","Shadow Sneak","Shell Smash","Skill Swap","Sleep Powder","Sleep Talk","Sludge Bomb","Sludge Wave","Smack Down","Smart Strike","Snarl","Snore","Snowscape","Solar Beam","Solar Blade","Spikes","Spiky Shield","Spirit Shackle","Spite","Stealth Rock","Steel Beam","Steel Wing","Stomping Tantrum","Stone Edge","Stored Power","Storm Throw","Strength Sap","Substitute","Sucker Punch","Sunny Day","Superpower","Surf","Swagger","Swords Dance","Synthesis","Tailwind","Taunt","Temper Flare","Terrain Pulse","Thief","Thrash","Throat Chop","Thunder","Thunder Fang","Thunder Punch","Thunder Wave","Thunderbolt","Tickle","Tidy Up","Torment","Toxic","Trailblaze","Trick","Trick Room","Triple Arrows","Triple Axel","U-Turn","Uproar","Venoshock","Volt Switch","Water Pulse","Water Spout","Waterfall","Wave Crash","Weather Ball","Whirlpool","Whirlwind","Wide Guard","Wild Charge","Will-O-Wisp","Wish","Wood Hammer","X-Scissor","Yawn","Zen Headbutt"];
const ABILITIES = ["Adaptability","Aerilate","Aftermath","Air Lock","Arena Trap","Bad Dreams","Battle Armor","Blaze","Bulletproof","Chlorophyll","Clear Body","Cloud Nine","Color Change","Competitive","Compound Eyes","Contrary","Corrosion","Curious Medicine","Cursed Body","Cute Charm","Dark Aura","Dauntless Shield","Defeatist","Defiant","Download","Drizzle","Drought","Dry Skin","Effect Spore","Electric Surge","Emergency Exit","Fairy Aura","Filter","Flame Body","Flash Fire","Flower Veil","Fluffy","Forecast","Friend Guard","Frisk","Full Metal Body","Fur Coat","Gale Wings","Gluttony","Good as Gold","Gorilla Tactics","Guts","Hadron Engine","Harvest","Heatproof","Huge Power","Hustle","Hyper Cutter","Ice Body","Ice Face","Ice Scales","Illusion","Immunity","Impostor","Infiltrator","Inner Focus","Insomnia","Intimidate","Intrepid Sword","Iron Barbs","Iron Fist","Justified","Keen Eye","Klutz","Leaf Guard","Levitate","Libero","Lightning Rod","Limber","Long Reach","Magic Bounce","Magic Guard","Magnet Pull","Marvel Scale","Mimicry","Mirror Armor","Mold Breaker","Moody","Motor Drive","Multiscale","Mummy","Natural Cure","Neutralizing Gas","No Guard","Oblivious","Opportunist","Overcoat","Overgrow","Own Tempo","Parental Bond","Pastel Veil","Pixilate","Poison Heal","Poison Point","Poison Touch","Power Construct","Prankster","Pressure","Primordial Sea","Protosynthesis","Psychic Surge","Punk Rock","Pure Power","Quark Drive","Quick Draw","Quick Feet","Rain Dish","Rattled","Reckless","Refrigerate","Regenerator","Rivalry","Rock Head","Rocky Payload","Rough Skin","Sand Force","Sand Rush","Sand Stream","Sand Veil","Sap Sipper","Scrappy","Screen Cleaner","Serene Grace","Shadow Shield","Shadow Tag","Shed Skin","Sheer Force","Simple","Skill Link","Slush Rush","Snow Warning","Solar Power","Solid Rock","Soul-Heart","Speed Boost","Stakeout","Stamina","Static","Steadfast","Steel Worker","Sticky Hold","Storm Drain","Sturdy","Suction Cups","Surge Surfer","Swarm","Swift Swim","Symbiosis","Synchronize","Technician","Telepathy","Thick Fat","Tinted Lens","Torrent","Tough Claws","Transistor","Truant","Unaware","Unburden","Unnerve","Volt Absorb","Water Absorb","Water Bubble","Weak Armor","White Smoke","Wimp Out","Wonder Guard","Wonder Skin","Zen Mode","Zero to Hero"];
const POKEMON = ["Abomasnow","Absol","Aegislash","Aerodactyl","Aggron","Alakazam","Alcremie","Altaria","Ampharos","Appletun","Araquanid","Arbok","Arcanine","Archaludon","Ariados","Armarouge","Aromatisse","Audino","Aurorus","Avalugg","Azumarill","Banette","Basculegion","Bastiodon","Beartic","Beedrill","Bellibolt","Blastoise","Camerupt","Castform","Ceruledge","Chandelure","Charizard","Chesnaught","Chimecho","Clawitzer","Clefable","Cofagrigus","Conkeldurr","Corviknight","Crabominable","Decidueye","Dedenne","Delphox","Diggersby","Ditto","Dragapult","Dragonite","Drampa","Emboar","Emolga","Empoleon","Espathra","Espeon","Excadrill","Farigiraf","Feraligatr","Flapple","Flareon","Floette","Florges","Forretress","Froslass","Furfrou","Gallade","Garbodor","Garchomp","Gardevoir","Garganacl","Gengar","Glaceon","Glalie","Glimmora","Gliscor","Golurk","Goodra","Gourgeist","Greninja","Gyarados","Hatterene","Hawlucha","Heliolisk","Heracross","Hippowdon","Houndoom","Hydrapple","Hydreigon","Incineroar","Infernape","Jolteon","Kangaskhan","Kingambit","Kleavor","Klefki","Kommo-o","Krookodile","Leafeon","Liepard","Lopunny","Lucario","Luxray","Lycanroc","Machamp","Mamoswine","Manectric","Maushold","Medicham","Meganium","Meowscarada","Meowstic","Milotic","Mimikyu","Morpeko","Mr. Rime","Mudsdale","Ninetales","Noivern","Oranguru","Orthworm","Palafin","Pangoro","Passimian","Pelipper","Pidgeot","Pikachu","Pinsir","Politoed","Polteageist","Primarina","Quaquaval","Raichu","Rampardos","Reuniclus","Rhyperior","Roserade","Rotom","Runerigus","Sableye","Salazzle","Samurott","Sandaconda","Scizor","Scovillain","Serperior","Sharpedo","Simipour","Simisage","Simisear","Sinistcha","Skarmory","Skeledirge","Slowbro","Slowking","Slurpuff","Sneasler","Snorlax","Spiritomb","Starmie","Steelix","Stunfisk","Sylveon","Talonflame","Tauros","Tinkaton","Torkoal","Torterra","Toucannon","Toxapex","Toxicroak","Trevenant","Tsareena","Typhlosion","Tyranitar","Tyrantrum","Umbreon","Vanilluxe","Vaporeon","Venusaur","Victreebel","Vivillon","Volcarona","Watchog","Weavile","Whimsicott","Wyrdeer","Zoroark"];

function lev(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function best(word, list, maxD = 3) {
  if (!word || word.length < 2) return null;
  const w = word.toLowerCase();
  let bst = null, bd = Infinity;
  for (const x of list) {
    const d = lev(w, x.toLowerCase());
    if (d < bd && d <= maxD) { bd = d; bst = x; }
    if (d === 0) return x;
  }
  return bst;
}

function clean(t) { return (t||'').replace(/[|\\[\]{}~`^_]/g,'').replace(/\s+/g,' ').trim(); }
function fmove(t) { if(!t)return t; const tl=t.trim(); const ex=MOVES.find(m=>m.toLowerCase()===tl.toLowerCase()); if(ex)return ex; return best(tl,MOVES,Math.max(2,Math.floor(tl.length*.3)))||tl; }
function fab(t) { if(!t)return t; const tl=t.trim(); const ex=ABILITIES.find(a=>a.toLowerCase()===tl.toLowerCase()); if(ex)return ex; return best(tl,ABILITIES,3)||tl; }
function fpoke(t) { if(!t)return null; const tl=t.trim(); for(const p of POKEMON)if(p.toLowerCase()===tl.toLowerCase())return p; return best(tl,POKEMON,3); }

// Card bounds (relative to image size) — 2 cols x 3 rows
const CARD_BOUNDS = [
  {x1:.030,y1:.175,x2:.490,y2:.415},
  {x1:.510,y1:.175,x2:.970,y2:.415},
  {x1:.030,y1:.430,x2:.490,y2:.670},
  {x1:.510,y1:.430,x2:.970,y2:.670},
  {x1:.030,y1:.685,x2:.490,y2:.925},
  {x1:.510,y1:.685,x2:.970,y2:.925},
];

// OCR a base64 image with Tesseract
async function ocrBase64(base64) {
  const buf = Buffer.from(base64, 'base64');
  const { data } = await Tesseract.recognize(buf, 'eng', {
    tessedit_pageseg_mode: '6',
    preserve_interword_spaces: '1',
  });
  return data.text;
}

// Crop a region from image buffer using sharp
async function cropRegion(sharp, imgBuf, rx1, ry1, rx2, ry2) {
  const meta = await sharp(imgBuf).metadata();
  const W = meta.width, H = meta.height;
  const left   = Math.floor(rx1 * W);
  const top    = Math.floor(ry1 * H);
  const width  = Math.floor((rx2 - rx1) * W);
  const height = Math.floor((ry2 - ry1) * H);
  // Grayscale + contrast boost + resize for better OCR
  return sharp(imgBuf)
    .extract({ left, top, width, height })
    .resize({ width: width * 3, height: height * 3, fit: 'fill' })
    .grayscale()
    .normalize()         // auto contrast
    .sharpen()
    .toBuffer();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imgA, imgB } = req.body;
    if (!imgA || !imgB) return res.status(400).json({ error: 'Missing images' });

    // Import sharp (available in Vercel Node runtime)
    const sharp = (await import('sharp')).default;

    const bufA = Buffer.from(imgA.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const bufB = Buffer.from(imgB.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Process all 6 cards from both images in parallel
    const [moveResults, statResults] = await Promise.all([
      // Parse Moves & More — left half + right half per card
      Promise.all(CARD_BOUNDS.map(async (cb, i) => {
        const midX = cb.x1 + (cb.x2 - cb.x1) * 0.50;
        const [leftBuf, rightBuf] = await Promise.all([
          cropRegion(sharp, bufA, cb.x1, cb.y1, midX, cb.y2),
          cropRegion(sharp, bufA, midX, cb.y1, cb.x2, cb.y2),
        ]);
        const [lt, rt] = await Promise.all([ocrBase64(leftBuf.toString('base64')), ocrBase64(rightBuf.toString('base64'))]);
        const ll = lt.split('\n').map(l => clean(l)).filter(l => l.length > 1);
        const rl = rt.split('\n').map(l => clean(l)).filter(l => l.length > 2 && !/^\d+$/.test(l));
        return {
          slot: i + 1,
          name:    fpoke(ll[0] || '') || (ll[0] || ''),
          ability: fab(ll[1] || ''),
          item:    ll[2] || '',
          moves:   rl.slice(0, 4).map(m => fmove(m)).filter(Boolean),
        };
      })),

      // Parse Stats — left half (HP/Atk/Def) + right half (SpA/SpD/Spe) per card
      Promise.all(CARD_BOUNDS.map(async (cb, i) => {
        const midX = cb.x1 + (cb.x2 - cb.x1) * 0.50;
        const [leftBuf, rightBuf] = await Promise.all([
          cropRegion(sharp, bufB, cb.x1, cb.y1, midX, cb.y2),
          cropRegion(sharp, bufB, midX, cb.y1, cb.x2, cb.y2),
        ]);
        const [lt, rt] = await Promise.all([ocrBase64(leftBuf.toString('base64')), ocrBase64(rightBuf.toString('base64'))]);

        // SP value = last number on each stat row (after the bar)
        const lastNum = (line) => {
          const nums = clean(line).match(/\d+/g);
          return nums ? parseInt(nums[nums.length - 1]) : 0;
        };
        const llines = lt.split('\n').filter(l => l.match(/\d{2,3}/));
        const rlines = rt.split('\n').filter(l => l.match(/\d{2,3}/));
        const stats = {};
        const hp  = lastNum(llines[0] || ''); if (hp  > 0 && hp  <= 32) stats.hp  = hp;
        const atk = lastNum(llines[1] || ''); if (atk > 0 && atk <= 32) stats.atk = atk;
        const def = lastNum(llines[2] || ''); if (def > 0 && def <= 32) stats.def = def;
        const spa = lastNum(rlines[0] || ''); if (spa > 0 && spa <= 32) stats.spa = spa;
        const spd = lastNum(rlines[1] || ''); if (spd > 0 && spd <= 32) stats.spd = spd;
        const spe = lastNum(rlines[2] || ''); if (spe > 0 && spe <= 32) stats.spe = spe;
        return { slot: i + 1, stats };
      })),
    ]);

    // Merge by slot
    const team = moveResults.map((ms, i) => ({
      ...ms,
      stats: statResults[i]?.stats || {},
    }));

    res.status(200).json({ team });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'OCR failed' });
  }
}
