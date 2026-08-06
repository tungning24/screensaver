/* ==========================================================================
   SCREENSAVER GALLERY - MAIN SCRIPT (FIXED & FULL OPTIMIZED)
   ========================================================================== */

const c = document.querySelector('canvas'),
    x = c.getContext('2d'),
    $ = id => document.getElementById(id),
    TAU = Math.PI * 2;
const glCanvas = document.getElementById('webglLayer');
let glMode = "";
let gl = null;
let glScene = "";
let fps = 0;
let fpsFrames = 0;
let fpsLast = performance.now();
let locRes;
let locTime;
let locBlobs;
let locColors;
let W, H, last = 0,
    t = 0,
    color = localStorage.screenColor || '#36F76D',
    scene = localStorage.screenScene || 'inkBubblesWebGL',
    S = {},
    theme = localStorage.screenTheme || 'normal';

// --- Sound Configuration ---
const soundConfig = {
  rain: {
    type: 'multi',
    title: 'Rain',
    folder: 'mp3/rain/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural: { title: 'Natural', levels: [18.18, 28.28, 36.36, 51.52, 59.6, 54.55, 36.36, 27.27, 17.17, 6.06] },
      Brown: { title: 'Brown', levels: [62.12, 57.17, 52.22, 47.17, 42.22, 37.27, 33.54, 29.8, 26.06, 22.32] },
      pink: { title: 'Pink', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] },
      white: { title: 'White', levels: [22.12, 26.26, 30.4, 34.55, 37.27, 42.83, 48.28, 52.42, 57.98, 62.12] },
      speechBlocker: { title: 'Speech Blocker', levels: [18.89, 29.7, 37.78, 54.04, 62.12, 56.77, 37.78, 28.38, 17.58, 6.77] },
      fairyRain: { title: 'Fairy Rain', levels: [0, 0, 0, 0, 19.6, 29.39, 39.29, 49.09, 58.89, 68.69] },
      bedroom: { title: 'Bedroom', levels: [0, 0, 0, 22.83, 51.82, 62.12, 51.82, 31.11, 14.55, 0] },
      jungleLodge: { title: 'Jungle Lodge', levels: [75.76, 0, 31.52, 0, 44.14, 0, 44.14, 0, 31.52, 0] }
    }
  },
  theFall: {
    type: 'multi',
    title: 'The Fall',
    folder: 'mp3/theFall/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural: { title: 'Natural', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] },
      WhiteNoisy: { title: 'WhiteNoisy', levels: [57.07, 0, 57.07, 57.07, 0, 57.07, 57.07, 0, 0, 0] },
      Watery: { title: 'Watery', levels: [0, 62.12, 0, 0, 0, 0, 0, 62.12, 62.12, 0] },
      majestic: { title: 'Majestic', levels: [75.76, 60.61, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 30.3, 15.15] },
      gigantic: { title: 'Gigantic', levels: [68.69, 43.74, 56.16, 0, 0, 0, 0, 0, 0, 0] },
      fresh: { title: 'Fresh', levels: [0, 18.99, 38.08, 57.07, 57.07, 57.07, 57.07, 57.07, 38.08, 18.99] },
      sparkling: { title: 'Sparkling', levels: [0, 0, 18.89, 37.88, 37.88, 37.88, 37.88, 37.88, 56.77, 75.76] },
      distant: { title: 'Distant', levels: [0, 0, 0, 0, 75.76, 56.77, 37.88, 0, 0, 0] },
      closeFall: { title: 'CloseFall', levels: [0, 0, 0, 0, 37.88, 56.77, 75.76, 0, 0, 0] }
    }
  },
  japGarden: {
    type: 'multi',
    title: 'Japanese Garden',
    folder: 'mp3/japGarden/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural:  { title: 'Natural', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] },
      Wildlife:  { title: 'Wildlife', levels: [56.57, 0, 0, 56.57, 56.57, 56.57, 0, 0, 0, 0] },
      DistantWaterfall:  { title: 'DistantWaterfall', levels: [75.76, 0, 0, 0, 0, 0, 53.03, 0, 0, 0] },
      ShishiOdoshi: { title: 'Shishi Odoshi', levels: [0, 0, 0, 0, 0, 0, 43.33, 75.76, 0, 0] },
      bambooGarden: { title: 'Bamboo Garden', levels: [0, 60.61, 75.76, 45.45, 60.61, 0, 0, 0, 0, 0] },
      japaneseSummer: { title: 'Japanese Summer', levels: [0, 0, 0, 0, 45.45, 45.45, 0, 0, 75.76, 0] },
      quietude: { title: 'Quietude', levels: [0, 0, 0, 0, 0, 0, 60.61, 0, 0, 75.76] },
      lonelyBird: { title: 'Lonely Bird', levels: [0, 0, 53.03, 45.45, 0, 75.76, 60.61, 60.61, 0, 0] }
    }
  },
  singingBowl: {
    type: 'multi',
    title: 'Singing Bowls',
    folder: 'mp3/singingBowl/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural:  { title: 'Natural', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] }
    }
  },
  unrealOcean: {
    type: 'multi',
    title: 'Unreal Ocean',
    folder: 'mp3/unrealOcean/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural: { title: 'Natural', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] },
      brown: { title: 'Brown', levels: [62.12, 57.17, 52.22, 47.17, 42.22, 37.27, 33.54, 29.8, 26.06, 22.32] },
      pink: { title: 'Pink', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] },
      white: { title: 'White', levels: [22.12, 26.26, 30.4, 34.55, 37.27, 42.83, 48.28, 52.42, 57.98, 62.12] },
      speechBlocker: { title: 'Speech Blocker', levels: [18.89, 29.7, 37.78, 54.04, 62.12, 56.77, 37.78, 28.38, 17.58, 6.77] },
      distantShore: { title: 'Distant Shore', levels: [0, 18.89, 37.88, 56.77, 75.76, 56.77, 37.88, 18.89, 0, 0] },
      closetotheWater: { title: 'Close to the Water', levels: [0, 53.84, 0, 22.93, 35.05, 45.76, 56.57, 49.8, 39.09, 31.01] },
      homebytheSea: { title: 'Home by the Sea', levels: [0, 0, 0, 34.34, 68.69, 34.34, 68.69, 34.34, 0, 0] },
      rainyShore: { title: 'Rainy Shore', levels: [0, 0, 37.88, 56.77, 37.88, 56.77, 56.77, 56.77, 75.76, 56.77] },
      underwater: { title: 'Underwater', levels: [0, 53.03, 0, 75.76, 37.88, 0, 0, 0, 0, 0] }
    }
  },
  stormyWeather: {
    type: 'multi',
    title: 'Stormy Weather',
    folder: 'mp3/stormyWeather/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural:  { title: 'Natural', levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22] },
      stormWinds: { title: 'Storm Winds', levels: [68.69, 68.69, 0, 0, 0, 0, 0, 0, 0, 0] },
      porchRain: { title: 'Porch Rain', levels: [0, 0, 62.12, 0, 0, 0, 0, 62.12, 62.12, 0] },
      distantThunder: { title: 'Distant Thunder', levels: [0, 0, 0, 62.12, 62.12, 62.12, 0, 0, 0, 0] },
      calmRain: { title: 'Calm Rain', levels: [0, 0, 0, 0, 0, 0, 75.76, 60.61, 45.45, 0] },
      sizzlingRain: { title: 'Sizzling Rain', levels: [0, 0, 0, 0, 0, 0, 0, 45.45, 60.61, 75.76] }
    }
  },
  calmLake: {
    type: 'multi',
    title: 'Calm Lake',
    folder: 'mp3/calmLake/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural: { title: 'Natural', levels: [54.34, 54.34, 23.33, 23.33, 23.33, 0, 0, 62.12, 23.33, 23.33] },
      ambience: { title: 'Ambience', levels: [0, 0, 68.69, 68.69, 0, 0, 0, 0, 0, 0] },
      kissUs: { title: 'Kiss Us', levels: [25.76, 0, 17.17, 68.69, 68.69, 0, 0, 0, 0, 0] },
      canoeSnipes: { title: 'Canoe & Snipes', levels: [51.52, 68.69, 0, 0, 0, 68.69, 0, 0, 0, 0] },
      snipesLapwings: { title: 'Snipes & Lapwings', levels: [34.34, 0, 0, 0, 0, 68.69, 68.69, 0, 0, 0] },
      midnightLoon: { title: 'Midnight Loon', levels: [33.64, 0, 0, 0, 33.64, 0, 0, 0, 75.76, 0] },
      loonCalls: { title: 'Loon Calls', levels: [34.34, 0, 0, 0, 0, 0, 0, 68.69, 68.69, 0] },
      windyLake: { title: 'Windy Lake', levels: [61.01, 22.93, 0, 0, 0, 0, 0, 22.93, 22.93, 68.69] }
    }
  },
  distantThunder: {
    type: 'multi',
    title: 'Distant Thunder',
    folder: 'mp3/distantThunder/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural:  { title: 'Natural', levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22] },
      stillDry: { title: 'Still Dry', levels: [57.07, 57.07, 57.07, 57.07, 57.07, 0, 0, 0, 0, 0] },
      firstDrops: { title: 'First Drops', levels: [57.07, 0, 57.07, 0, 57.07, 57.07, 0, 57.07, 0, 0] },
      gettingWet: { title: 'Getting Wet', levels: [0, 51.52, 0, 51.52, 51.52, 51.52, 45.05, 45.05, 38.59, 25.76] },
      calmStorm: { title: 'Calm Storm', levels: [62.12, 43.43, 43.43, 43.43, 43.43, 43.43, 49.7, 55.86, 55.86, 43.43] },
      summerRain: { title: 'Summer Rain', levels: [51.52, 51.52, 51.52, 0, 0, 0, 0, 51.52, 51.52, 51.52] },
      almostGone: { title: 'Almost Gone', levels: [0, 56.57, 0, 0, 56.57, 0, 0, 28.28, 49.49, 49.49] }
    }
  },
  healingWater: {
    type: 'multi',
    title: 'Healing Water',
    folder: 'mp3/healingWater/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural:  { title: 'Natural', levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22] },
      earlyMorning: { title: 'Early Morning', levels: [0, 56.77, 47.37, 0, 0, 0, 0, 0, 0, 75.76] },
      cascade: { title: 'Cascade', levels: [0, 62.12, 54.34, 0, 54.34, 0, 0, 0, 0, 0] },
      creek: { title: 'Creek', levels: [0, 0, 0, 51.52, 60.1, 0, 68.69, 0, 0, 0] },
      babblingBrook: { title: 'Babbling Brook', levels: [0, 0, 0, 0, 0, 0, 37.78, 60.1, 68.69, 0] },
      almostUnreal: { title: 'Almost Unreal', levels: [0, 0, 0, 0, 0, 0, 0, 0, 75.76, 56.77] },
      calming: { title: 'Calming', levels: [0, 54.55, 0, 68.69, 0, 0, 56.57, 0, 0, 0] },
      walkwithMe: { title: 'Walk with Me', levels: [75.76, 31.82, 25.66, 0, 36.67, 0, 29.29, 0, 0, 24.44] },
      woodenBridges: { title: 'Wooden Bridges', levels: [75.76, 21.01, 25.25, 0, 0, 0, 0, 0, 0, 0] }
    }
  },
  rainOnTent: {
    type: 'multi',
    title: 'Rain On Tent',
    folder: 'mp3/rainOnTent/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
      natural:  { title: 'Natural', levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22] },
      covered:  { title: 'Covered', levels: [0,0,0,43.13,0,68.69,0,58.89,0,0] },
      LastDrops:  { title: 'LastDrops', levels: [0, 0, 43.33, 75.76, 43.33, 0, 0, 0, 0, 0] },
      brown: { title: 'Brown', levels: [62.12, 57.17, 52.22, 47.17, 42.22, 37.27, 33.54, 29.8, 26.06, 22.32] },
      pink: { title: 'Pink', levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45] },
      White:  { title: 'White', levels: [22.12, 26.26, 30.4, 34.55, 37.27, 42.83, 48.28, 52.42, 57.98, 62.12] },
      speechBlocker: { title: 'Speech Blocker', levels: [18.89, 29.7, 37.78, 54.04, 62.12, 56.77, 37.78, 28.38, 17.58, 6.77] },
      lightRain: { title: 'Light Rain', levels: [0, 0, 0, 0, 20.71, 32.02, 41.41, 52.73, 62.12, 52.73] },
      lullingRain: { title: 'Lulling Rain', levels: [0, 0, 0, 22.63, 52.73, 62.12, 52.73, 32.02, 15.05, 0] },
      steadyRain: { title: 'Steady Rain', levels: [37.68, 37.68, 56.57, 0, 56.57, 0, 56.57, 0, 56.57, 37.68] },
      RainyDay:  { title: 'RainyDay', levels: [68.69, 38.18, 24.44, 48.89, 61.01, 50.4, 42.73, 38.18, 35.15, 35.15] },
      bytheRiver: { title: 'By the River', levels: [0, 75.76, 52.73, 32.42, 14.85, 0, 0, 20.3, 20.3, 0] },
      jungleOvernight: { title: 'Jungle Overnight', levels: [75.76, 0, 31.52, 0, 44.14, 31.52, 44.14, 0, 31.52, 0] }
    }
  }
};

let activeAudios = [];
let audioUnlocked = false;

function pctToVol(pct) {
  if (pct <= 0) return 0;
  return Math.pow(pct / 100, 2); 
}

function setSound(v, mode = null) {
  const fullValue = mode ? `${v}:${mode}` : v;
  localStorage.screenSound = fullValue || '';
  
  activeAudios.forEach(a => a.pause());
  activeAudios = [];
    
  if (mode) localStorage.screenSoundMode = mode;
  
  const sound = soundConfig[v];
  if (!v || !sound) return;

  if (sound.type === 'single') {
    const a = new Audio(sound.src);
    a.loop = true;
    a.volume = sound.volume ?? 1.0;
    a.play().then(() => { audioUnlocked = true; }).catch(() => {});
    activeAudios.push(a);
  } else if (sound.type === 'multi') {
    const selectedMode = mode || sound.defaultMode || 'natural';
    const modeData = sound.modes?.[selectedMode];
    const percentages = modeData?.levels || modeData || [];
    const masterVol = sound.volume ?? 1.0;

    for (let i = 0; i < 10; i++) {
      const src = `${sound.folder}${i}a.ogg`;
      const a = new Audio(src);
      a.loop = true;

      const trackPct = percentages[i] !== undefined ? percentages[i] : 100;
      a.volume = pctToVol(trackPct) * masterVol;

      a.play().then(() => { audioUnlocked = true; }).catch(() => {});
      activeAudios.push(a);
    }
  }
}

// Unlock Autoplay on User Interaction for Smart TV / Browsers
function unlockAudioOnInteraction() {
  if (audioUnlocked) return;
  activeAudios.forEach(a => a.play().catch(() => {}));
  audioUnlocked = true;
  window.removeEventListener('click', unlockAudioOnInteraction);
  window.removeEventListener('keydown', unlockAudioOnInteraction);
}
window.addEventListener('click', unlockAudioOnInteraction);
window.addEventListener('keydown', unlockAudioOnInteraction);

function handleSingleSelect(compositeValue) {
  const [soundKey, modeKey] = compositeValue.split(':');
  setSound(soundKey, modeKey || compositeValue);
}

function renderSoundOptions() {
  const selectEl = document.getElementById('sound');
  if (!selectEl) return;
  selectEl.innerHTML = '<option value="">No sound</option>';

  Object.keys(soundConfig).forEach(key => {
    const item = soundConfig[key];
    if (item.type === 'single') {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = item.title;
      selectEl.appendChild(opt);
    } else if (item.type === 'multi') {
      const group = document.createElement('optgroup');
      group.label = item.title;

      Object.keys(item.modes).forEach(modeKey => {
        const mode = item.modes[modeKey];
        const opt = document.createElement('option');
        opt.value = `${key}:${modeKey}`;
        opt.textContent = item.title + " (" + mode.title + ")" || `${item.title} (${modeKey})`;
        group.appendChild(opt);
      });

      selectEl.appendChild(group);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSoundOptions();
  renderThemeOptions();
  renderSceneOptions();
  if (theme === 'random3Colors') { updateRandom3Colors(); }
  
  const savedSound = localStorage.screenSound || '';
  const soundSelect = document.getElementById('sound');
  
  const sceneSelect = document.getElementById('scene');
  if (sceneSelect) {
      sceneSelect.addEventListener('change', (e) => {
          const selected = e.target.value;
          localStorage.setItem('screenScene', selected);
      });
  }  

  const themeSelect = document.getElementById('theme');
  if (themeSelect) {
      themeSelect.value = theme;
      themeSelect.addEventListener('change', (e) => {
          theme = e.target.value;
          localStorage.screenTheme = theme;
          updateThemeColors();
      });
  }

  updateThemeColors();
  
  if (soundSelect) {
      if (Array.from(soundSelect.options).some(opt => opt.value === savedSound)) {
        soundSelect.value = savedSound;
      } else {
        soundSelect.value = '';
      }
      
      const [soundKey, modeKey] = soundSelect.value.split(':');
      setSound(soundKey, modeKey);
  }

  const colorPicker = document.getElementById('colorPicker');
  const colorText = document.getElementById('colorText');
  const swatches = document.querySelectorAll('.presets .swatch');

  if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
          setAccentColor(e.target.value);
      });
  }

  if (colorText) {
      colorText.addEventListener('change', (e) => {
          let val = e.target.value.trim();
          if (!val.startsWith('#')) val = '#' + val;
          if (/^#[0-9A-F]{6}$/i.test(val)) {
              setAccentColor(val);
          } else {
              e.target.value = color;
          }
      });
  }

  swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
          const selectedColor = swatch.dataset.color;
          setAccentColor(selectedColor);
      });
  });
});

// --- Palettes & Color Categories ---
const baseColors = ['#36F76D', '#35D7FF', '#C77DFF', '#FF4D7D', '#FFB347'];

const paletteCategories = {
    calm: ['SoftPeachyDelight', 'SoftPastelShades', 'CoastalBlues', 'OceanBlueSerenity', 'FreshGreens', 'LightSteel'],
    energetic: ['VibrantFusion', 'VibrantTones', 'ColorfulRainbowSpectrum', 'PurpleRaindrops'],
    cyberpunk: ['GradientBlues', 'PurpleRaindrops', 'VividNightfall', 'VibrantSunset'],
    nature: ['FreshGreens', 'SpringGreenHarmony', 'WarmEarthTones', 'GoldenHarvest'],
    sunset: ['FieryRedSunset', 'OceanSunset', 'SunsetGradient', 'VibrantSunset'],
    dark: ['DeepSeaBlue', 'VividNightfall', 'ClassicRedPalette', 'WarmNeutralTones'],
    pastel: ['SoftPeachyDelight', 'SoftPastelShades', 'PastelDreamland', 'CherryBlossomBloom'],
    retro: ['ClassicRedPalette', 'VibrantSunset', 'SunsetGradient'],
    space: ['DeepSeaBlue', 'VividNightfall', 'GradientBlues'],
    matrix: ['FreshGreens', 'SpringGreenHarmony']
};

const palettes = {
    SoftPeachyDelight: ['#FEC5BB','#FCD5CE','#FAE1DD','#F8EDEB','#E8E8E4','#D8E2DC','#ECE4DB','#FFE5D9','#FFD7BA','#FEC89A'],
    SoftPastelShades: ['#EDDCD2','#FFF1E6','#FDE2E4','#FAD2E1','#C5DEDD','#DBE7E4','#F0EFEB','#D6E2E9','#BCD4E6','#99C1DE'],
    PastelDreamland: ['#FFCBF2','#F3C4FB','#ECBCFD','#E5B3FE','#E2AFFF','#DEAAFF','#D8BBFF','#D0D1FF','#C8E7FF','#C0FDFF'],
    FieryRedSunset: ['#03071E','#370617','#6A040F','#9D0208','#D00000','#DC2F02','#E85D04','#F48C06','#FAA307','#FFBA08'],
    OceanSunset: ['#001219','#005F73','#0A9396','#94D2BD','#E9D8A6','#EE9B00','#CA6702','#BB3E03','#AE2012','#9B2226'],
    ColorfulRainbowSpectrum: ['#669900','#99CC33','#CCEE66','#006699','#3399CC','#990066','#CC3399','#FF6600','#FF9900','#FFCC00'],
    VibrantTones: ['#F94144','#F3722C','#F8961E','#F9844A','#F9C74F','#90BE6D','#43AA8B','#4D908E','#577590','#277DA1'],
    VibrantFusion: ['#FF0000','#FF8700','#FFD300','#DEFF0A','#A1FF0A','#0AFF99','#0AEFFF','#147DF5','#580AFF','#BE0AFF'],
    CoastalBlues: ['#012A4A','#013A63','#01497C','#014F86','#2A6F97','#2C7DA0','#468FAF','#61A5C2','#89C2D9','#A9D6E5'],
    DeepSeaBlue: ['#0466C8','#0353A4','#023E7D','#002855','#001845','#001233','#33415C','#5C677D','#7D8597','#979DAC'],
    OceanBlueSerenity: ['#03045E','#023E8A','#0077B6','#0096C7','#00B4D8','#48CAE4','#90E0EF','#ADE8F4','#CAF0F8'],
    BlueGradient: ['#E3F2FD','#BBDEFB','#90CAF9','#64B5F6','#42A5F5','#2196F3','#1E88E5','#1976D2','#1565C0','#0D47A1'],
    GradientBlues: ['#7400B8','#6930C3','#5E60CE','#5390D9','#4EA8DE','#48BFE3','#56CFE1','#64DFDF','#72EFDD','#80FFDB'],
    CherryBlossomBloom: ['#590D22','#800F2F','#A4133C','#C9184A','#FF4D6D','#FF758F','#FF8FA3','#FFB3C1','#FFCCD5','#FFF0F3'],
    FreshGreens: ['#D8F3DC','#B7E4C7','#95D5B2','#74C69D','#52B788','#40916C','#2D6A4F','#1B4332','#081C15'],
    SpringGreenHarmony: ['#007F5F','#2B9348','#55A630','#80B918','#AACC00','#BFD200','#D4D700','#DDDF00','#EEEF20','#FFFF3F'],
    SunsetGradient: ['#FF7B00','#FF8800','#FF9500','#FFA200','#FFAA00','#FFB700','#FFC300','#FFD000','#FFDD00','#FFEA00'],
    GoldenHarvest: ['#FFE169','#FAD643','#EDC531','#DBB42C','#C9A227','#B69121','#A47E1B','#926C15','#805B10','#76520E'],
    PurpleRaindrops: ['#F72585','#B5179E','#7209B7','#560BAD','#480CA8','#3A0CA3','#3F37C9','#4361EE','#4895EF','#4CC9F0'],
    VividNightfall: ['#10002B','#240046','#3C096C','#5A189A','#7B2CBF','#9D4EDD','#C77DFF','#E0AAFF'],
    VibrantSunset: ['#FF6D00','#FF7900','#FF8500','#FF9100','#FF9E00','#240046','#3C096C','#5A189A','#7B2CBF','#9D4EDD'],
    WarmNeutralTones: ['#582F0E','#7F4F24','#936639','#A68A64','#B6AD90','#C2C5AA','#A4AC86','#656D4A','#414833','#333D29'],
    WarmEarthTones: ['#EDC4B3','#E6B8A2','#DEAB90','#D69F7E','#CD9777','#C38E70','#B07D62','#9D6B53','#8A5A44','#774936'],
    ClassicRedPalette: ['#0B090A','#161A1D','#660708','#A4161A','#BA181B','#E5383B','#B1A7A6','#D3D3D3','#F5F3F4','#FFFFFF'],
    LightSteel: ['#F8F9FA','#E9ECEF','#DEE2E6','#CED4DA','#ADB5BD','#6C757D','#495057','#343A40','#212529']
};

let activeColors = [...baseColors];
let themeTimer = null;
const chars = 'アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%#&_()[]{}<>!';
let activeRandomTheme = localStorage.screenActiveRandomTheme || Object.keys(palettes)[0];

const tone = (i = 0) => {
    if (!activeColors || activeColors.length === 0) return color;
    return activeColors[i % activeColors.length];
},
rgb = h => {
    let n = parseInt(h.slice(1), 16);
    return `${n>>16},${n>>8&255},${n&255}`;
},
R = (a, b) => a + Math.random() * (b - a),
bg = a => {
    x.globalCompositeOperation = 'source-over';
    x.fillStyle = `rgba(2,4,3,${a})`;
    x.fillRect(0, 0, W, H);
},
dot = (a, b, r, f = tone()) => {
    x.fillStyle = f;
    x.beginPath();
    x.arc(a, b, r, 0, TAU);
    x.fill();
},
count = n => Math.max(20, W / n | 0);

const darkTone = (hex, p = 20) =>
    "#" + hex.slice(1).match(/../g)
        .map(c => Math.max(0, parseInt(c, 16) * (100 - p) / 100 | 0)
        .toString(16).padStart(2, "0"))
        .join("");

// --- Optimized Hex-to-RGB Helper (No Canvas Creation in Loop) ---
const hexToRgbNormalizedFast = (colStr) => {
    if (!colStr) return [0.5, 0.5, 0.5];
    let hex = colStr.replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    if (isNaN(num)) return [0.5, 0.5, 0.5];
    return [
        Math.pow(((num >> 16) & 255) / 255, 2.2),
        Math.pow(((num >> 8) & 255) / 255, 2.2),
        Math.pow((num & 255) / 255, 2.2)
    ];
};

function renderThemeOptions() {
    const randomGroup = document.getElementById('randomOptGroup');
    const singleGroup = document.getElementById('singleOptGroup');
    
    if (randomGroup) {
        Object.keys(paletteCategories).forEach(cat => {
            const opt = document.createElement('option');
            opt.value = `random_${cat}`;
            opt.textContent = `Random ${cat.charAt(0).toUpperCase() + cat.slice(1)} (30s)`;
            randomGroup.appendChild(opt);
        });
    }

    if (singleGroup) {
        singleGroup.innerHTML = '';
        Object.keys(palettes).forEach(pKey => {
            const opt = document.createElement('option');
            opt.value = pKey;
            opt.textContent = pKey.charAt(0).toUpperCase() + pKey.slice(1);
            singleGroup.appendChild(opt);
        });
    }
}

function getRandomItems(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(num, arr.length));
}

function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

// Centralized Theme Color Manager
function updateThemeColors() {
    if (themeTimer) {
        clearInterval(themeTimer);
        themeTimer = null;
    }

    const updateUI = (currentColor) => {
        document.querySelectorAll('.presets .swatch').forEach(swatch => {
            if (theme === 'normal' && swatch.dataset.color.toLowerCase() === currentColor.toLowerCase()) {
                swatch.classList.add('active');
            } else {
                swatch.classList.remove('active');
            }
        });

        if (currentColor) {
            const colorPicker = document.getElementById('colorPicker');
            const colorText = document.getElementById('colorText');
            if (colorPicker) colorPicker.value = currentColor;
            if (colorText) colorText.value = currentColor.toUpperCase();
        }
    };

    if (theme === 'normal') {
        activeColors = [color];
        updateUI(color);
        return;
    }

    if (theme === 'random') {
        const rotateRandomBase = () => {
            const pick = baseColors[Math.floor(Math.random() * baseColors.length)];
            activeColors = [pick];
            updateUI(pick);
        };
        rotateRandomBase();
        themeTimer = setInterval(rotateRandomBase, 12000);
        return;
    }

    if (theme === 'random3Colors') {
        const rotate3Colors = () => {
            activeColors = [getRandomHexColor(), getRandomHexColor(), getRandomHexColor()];
            updateUI(activeColors[0]);
        };
        rotate3Colors();
        themeTimer = setInterval(rotate3Colors, 30000);
        return;
    }

    if (theme === 'randomTheme') {
        const allKeys = Object.keys(palettes);
        const rotateThemeAll = () => {
            const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
            activeColors = getRandomItems(palettes[randomKey], 3);
            updateUI(activeColors[0]);
        };
        rotateThemeAll();
        themeTimer = setInterval(rotateThemeAll, 30000);
        return;
    }

    if (theme.startsWith('random_')) {
        const catKey = theme.replace('random_', '');
        const catList = paletteCategories[catKey] || Object.keys(palettes);
        const rotateCategory = () => {
            const randomPaletteKey = catList[Math.floor(Math.random() * catList.length)];
            const pal = palettes[randomPaletteKey] || baseColors;
            activeColors = getRandomItems(pal, 3);
            updateUI(activeColors[0]);
        };
        rotateCategory();
        themeTimer = setInterval(rotateCategory, 30000);
        return;
    }

    if (palettes[theme]) {
        const targetPalette = palettes[theme];
        const rotateSinglePalette = () => {
            activeColors = getRandomItems(targetPalette, 3);
            updateUI(activeColors[0]);
        };
        rotateSinglePalette();
        themeTimer = setInterval(rotateSinglePalette, 30000);
        return;
    }

    activeColors = [color];
    updateUI(color);
}

function reset() {
    let q = count(+$('density').value),
        particles = Array.from({
            length: Math.min(260, q * 7)
        }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: R(-1, 1),
            vy: R(-1, 1),
            r: R(2, 14),
            p: R(0, TAU),
            c: Math.random() * 3 | 0
        }));
    S = {
        drop: Array.from({ length: q }, () => Math.random() * -H / 16),
        star: Array.from({
            length: Math.min(1400, Math.max(700, q * 32))
        }, () => ({
            x: (Math.random() - .5) * W,
            y: (Math.random() - .5) * H,
            z: Math.random() * W
        })),
        p: particles,
        b: Array.from({ length: 9 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: R(35, 160),
            vx: R(-.6, .6),
            vy: R(-.6, .6),
            p: R(0, TAU),
            c: Math.random() * 3 | 0
        })),
        d: { x: W * .4, y: H * .4, vx: 2, vy: 1.5 },
        g: [],
        tv_star: Array.from({ length: 250 }, () => ({
            x: (Math.random() - 0.5) * W * 1.5,
            y: (Math.random() - 0.5) * H * 1.5,
            z: Math.random() * W,
            pz: Math.random() * W
        })),
        tv_matrix: Array.from({ length: Math.min(60, count(28)) }, () => ({
            y: Math.random() * -40,
            speed: R(0.12, 0.28),
            len: R(10, 22) | 0,
            chars: Array.from({ length: 22 }, () => chars[Math.random() * chars.length | 0])
        })),
        tv_blobs: Array.from({ length: 6 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: R(120, 260),
            vx: R(-0.5, 0.5),
            vy: R(-0.5, 0.5),
            c: Math.random() * 3 | 0
        })),
        tv_dvd: { x: W * 0.3, y: H * 0.3, vx: 2.5, vy: 1.8, c: 0 }
    };
}

function fallSetup() {
    const newStyleScenes = ['sakura2', 'snow2', 'confetti2'];
    if (newStyleScenes.includes(scene)) {
        fallSetup2();
        return;
    }
    if (['sakura', 'snow', 'snow2', 'storm', 'storm2', 'confetti'].includes(scene)) S.p = Array.from({
        length: Math.min(260, count(+$('density').value) * 7)
    }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: R(2, 14),
        vx: R(-35, 35),
        vy: R(15, 100),
        p: R(0, TAU),
        c: Math.random() * 3 | 0
    }));
}

function fallSetup2() {
    const width = W || (x ? x.canvas.width : 0);
    const height = H || (x ? x.canvas.height : 0);

    const itemAmount = typeof count === 'function' && $('density') 
        ? Math.min(260, count(+$('density').value) * 1.1) 
        : 50;

    S.items2 = Array.from({ length: itemAmount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() * 2 - 1) * 0.02,
        colorIndex: Math.floor(Math.random() * 3)
    }));
}

// --- Scene Rendering Functions ---
function synthwave(k) {
    bg(.12);
    const c1 = tone(0);
    const c2 = tone(1);
    const c3 = tone(2);
    const horizon = H * 0.45;
    const centerX = W * 0.5;

    for (let i = 0; i < S.tv_star.length; i++) {
        let s = S.tv_star[i];
        let sx = s.x + W * 0.5;
        let sy = s.y + H * 0.25;
        if (sx < 0 || sx > W || sy < 0 || sy > horizon) continue;
        let a = 0.4 + Math.sin(t * 0.03 + i) * 0.3;
        x.fillStyle = `rgba(${rgb(c3)},${a})`;
        x.fillRect(sx, sy, 2, 2);
    }

    for (let i = -8; i <= 8; i++) {
        let bx = centerX + i * 80;
        let beam = x.createLinearGradient(bx, 0, centerX, horizon);
        beam.addColorStop(0, "transparent");
        beam.addColorStop(.7, `rgba(${rgb(c2)},.06)`);
        beam.addColorStop(1, `rgba(${rgb(c1)},.22)`);
        x.strokeStyle = beam;
        x.lineWidth = 2;
        x.beginPath();
        x.moveTo(bx, 0);
        x.lineTo(centerX, horizon);
        x.stroke();
    }

    let sunR = Math.min(W, H) * 0.14;
    let g = x.createRadialGradient(centerX, horizon - 40, 20, centerX, horizon - 40, sunR * 2.2);
    g.addColorStop(0, c3);
    g.addColorStop(.5, c2);
    g.addColorStop(.9, c1);
    g.addColorStop(1, "transparent");
    x.fillStyle = g;
    x.beginPath();
    x.arc(centerX, horizon - 40, sunR * 2.2, 0, TAU);
    x.fill();

    x.fillStyle = c3;
    x.beginPath();
    x.arc(centerX, horizon - 40, sunR, 0, TAU);
    x.fill();

    x.save();
    x.beginPath();
    x.arc(centerX, horizon - 40, sunR, 0, TAU);
    x.clip();
    x.strokeStyle = `rgba(${rgb(c2)},.5)`;
    for (let i = 0; i < 12; i++) {
        let yy = horizon - 40 - sunR + i * 14;
        x.beginPath();
        x.moveTo(centerX - sunR, yy);
        x.lineTo(centerX + sunR, yy);
        x.stroke();
    }
    x.restore();

    x.strokeStyle = c2;
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(0, horizon);
    x.lineTo(W, horizon);
    x.stroke();

    let flow = (t * 0.02) % 1;
    x.strokeStyle = `rgba(${rgb(c1)},.75)`;
    x.lineWidth = 1;

    for (let i = 1; i < 24; i++) {
        let p = ((i / 24 + flow) % 1);
        let y = horizon + Math.pow(p, 2.2) * (H - horizon);
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    for (let i = -20; i <= 20; i++) {
        let px = centerX + i * 60;
        x.beginPath();
        x.moveTo(px, H);
        x.lineTo(centerX, horizon);
        x.stroke();
    }

    x.fillStyle = darkTone(c1, 80);
    x.beginPath();
    x.moveTo(0, horizon);
    for (let i = 0; i <= W; i += 40) {
        let h = Math.sin(i * 0.01) * 40 + Math.sin(i * 0.03) * 20;
        x.lineTo(i, horizon - 40 - h);
    }
    x.lineTo(W, horizon);
    x.closePath();
    x.fill();

    x.strokeStyle = "rgba(255,255,255,.02)";
    x.lineWidth = 1;
    for (let y = 0; y < H; y += 4) {
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    let glowY = ((t * 4) % (H + 800)) - 400;
    let skyGlow = x.createLinearGradient(0, glowY - 250, 0, glowY + 250);
    skyGlow.addColorStop(0, "transparent");
    skyGlow.addColorStop(.5, `rgba(${rgb(c2)},.18)`);
    skyGlow.addColorStop(1, "transparent");
    x.fillStyle = skyGlow;
    x.fillRect(0, glowY - 250, W, 500);

    let vg = x.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.9);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,.45)");
    x.fillStyle = vg;
    x.fillRect(0, 0, W, H);
}

function matrix(k) {
    bg(.08);
    let fs = +$('density').value;
    x.font = `${fs}px monospace`;
    x.textAlign = 'center';
    x.shadowColor = tone();
    x.shadowBlur = 8;

    if (!S.gridChars) S.gridChars = [];

    S.drop.forEach((d, i) => {
        if (!S.gridChars[i]) S.gridChars[i] = [];
        let currentRow = Math.floor(d);

        for (let j = 0; j < 10; j++) {
            let rowIdx = currentRow - j;
            if (!S.gridChars[i][rowIdx] || Math.random() < 0.02) {
                S.gridChars[i][rowIdx] = chars[Math.floor(Math.random() * chars.length)];
            }
            x.globalAlpha = 1 - j / 10;
            x.fillStyle = j ? tone() : '#f0fff2';
            let charToDraw = S.gridChars[i][rowIdx];
            x.fillText(charToDraw, i * W / S.drop.length + W / S.drop.length / 2, (currentRow - j) * fs);
        }

        d += k * (.048 + Math.random() * 0.012);

        if (d * fs > H + 10 * fs && Math.random() > .975) {
            d = -Math.random() * 20;
            S.gridChars[i] = [];
        }
        
        S.drop[i] = d;
    });

    x.globalAlpha = 1;
    x.shadowBlur = 0;
}

function matrix2(k) {
    bg(.25);
    let fs = +$('density').value;
    x.font = `500 ${fs}px monospace`;
    x.textAlign = 'center';
    let activeTone = tone();

    if (!S.matrix2 || S.matrix2.length !== count(fs)) {
        let cols = count(fs);
        S.matrix2 = Array.from({ length: cols }, () => {
            let len = R(12, 28) | 0;
            return {
                y: R(-H / fs, 0),
                speed: R(0.1, 0.25),
                len: len,
                chars: Array.from({ length: len }, () => chars[Math.random() * chars.length | 0]),
                ticks: 0
            };
        });
    }

    S.matrix2.forEach((col, i) => {
        let colX = i * W / S.matrix2.length + (W / S.matrix2.length) / 2;
        col.ticks = (col.ticks || 0) + k;

        if (col.ticks >= 6) {
            col.chars[0] = chars[Math.random() * chars.length | 0];
            col.ticks = 0;
        }

        if (Math.random() < 0.003) {
            let mutIdx = 1 + (Math.random() * (col.len - 1) | 0);
            col.chars[mutIdx] = chars[Math.random() * chars.length | 0];
        }

        for (let j = 0; j < col.len; j++) {
            let charY = (col.y - j) * fs;
            if (charY < -fs || charY > H + fs) continue;

            if (j === 0) {
                x.shadowColor = '#ffffff';
                x.shadowBlur = 4;
                x.fillStyle = '#ffffff';
                x.globalAlpha = 1;
            } else {
                x.shadowColor = activeTone;
                x.shadowBlur = j < 2 ? 3 : 0;
                let fade = 1 - (j / col.len);
                x.globalAlpha = Math.max(0.12, fade);
                x.fillStyle = activeTone;
            }

            x.fillText(col.chars[j] || chars[0], colX, charY);
        }

        col.y += k * col.speed;

        if ((col.y - col.len) * fs > H) {
            col.y = -Math.random() * 12;
            col.speed = R(0.1, 0.25);
            col.len = R(12, 28) | 0;
            col.chars = Array.from({ length: col.len }, () => chars[Math.random() * chars.length | 0]);
            col.ticks = 0;
        }
    });

    x.globalAlpha = 1;
    x.shadowBlur = 0;
}

function tv_matrix2() {
    if (!x) return;

    const width = W || (x.canvas ? x.canvas.width : 0);
    const height = H || (x.canvas ? x.canvas.height : 0);

    if (width === 0 || height === 0) return;

    const cols = Math.floor(width / 20) || 1;

    if (typeof drops === 'undefined' || !Array.isArray(drops) || drops.length !== cols) {
        window.drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -100)); 
    }

    x.fillStyle = "rgba(0, 0, 0, 0.05)";
    x.fillRect(0, 0, width, height);

    x.fillStyle = tone();
    x.font = "18px monospace";
    x.textBaseline = "top";

    drops.forEach((y, i) => {
        const text = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
        
        if (y > 0) {
            x.fillText(text, i * 20, y);
        }

        if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
        } else {
            drops[i] = y + 20;
        }
    });
}

function fireworks(k) {
    if (!x) return;

    const width = W || (x.canvas ? x.canvas.width : 0);
    const height = H || (x.canvas ? x.canvas.height : 0);

    if (width === 0 || height === 0) return;

    x.fillStyle = "rgba(0, 0, 0, 0.1)";
    x.fillRect(0, 0, width, height);

    if (!S.fireworkList) S.fireworkList = [];

    if (Math.random() < 0.10) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const color = typeof tone === 'function' ? tone(Math.floor(Math.random() * 3)) : `hsl(${Math.random() * 360}, 100%, 50%)`;

        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 / 30) * i;
            const spd = Math.random() * 5 + 2;
            S.fireworkList.push({
                x: cx, 
                y: cy,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 1, 
                color: color
            });
        }
    }

    S.fireworkList = S.fireworkList.filter(p => {
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.life -= 0.02 * k;

        if (p.life > 0) {
            x.fillStyle = p.color;
            x.globalAlpha = Math.max(0, p.life);
            x.beginPath();
            x.arc(p.x, p.y, 2, 0, Math.PI * 2);
            x.fill();
            x.globalAlpha = 1;
            return true;
        }
        return false;
    });
}

function stars(k) {
    bg(.18);
    x.fillStyle = '#fff';
    x.shadowColor = color;
    x.shadowBlur = 4;
    S.star.forEach(s => {
        s.z -= k * 12;
        if (s.z < 1) Object.assign(s, {
            z: W,
            x: (Math.random() - .5) * W,
            y: (Math.random() - .5) * H
        });
        let X = s.x / s.z * W + W / 2,
            Y = s.y / s.z * W + H / 2,
            a = 1 - s.z / W;
        x.globalAlpha = a;
        x.fillRect(X, Y, Math.max(.5, a * 3), Math.max(.5, a * 3));
    });
    x.globalAlpha = 1;
    x.shadowBlur = 0;
}

function fire(k) {
    bg(.18);
    x.fillStyle = `rgba(${rgb(color)},.6)`;
    S.p.forEach(p => {
        p.y -= k * (1 + Math.random() * 3);
        p.x += Math.sin(p.y * .04) * k;
        if (p.y < -12) {
            p.y = H + Math.random() * H * .1;
            p.x = Math.random() * W;
        }
        dot(p.x, p.y, 1 + Math.random() * 2, x.fillStyle);
    });
}

function rain(k, storm = false) {
    bg(storm ? .28 : .15);
    x.strokeStyle = `rgba(${rgb(tone())},.7)`;
    S.p.forEach(p => {
        p.y += k * (storm ? 35 : 15);
        p.x -= k * (storm ? 6 : 2);
        if (p.y > H) {
            p.y = -30;
            p.x = Math.random() * W;
        }
        x.lineWidth = storm ? 1.5 : 1;
        x.beginPath();
        x.moveTo(p.x, p.y);
        x.lineTo(p.x - (storm ? 12 : 5), p.y + (storm ? 55 : 22));
        x.stroke();
        if (storm && Math.random() < .006) {
            x.fillStyle = '#eff';
            x.fillRect(p.x - 2, H - 3, 5, 2);
        }
    });
}

function blobs(k, ink = false) {
    bg(.12);
    x.globalCompositeOperation = 'lighter';
    S.b.forEach(b => {
        b.x += b.vx * k * (ink ? 8 : 3);
        b.y += b.vy * k * (ink ? 8 : 3);
        if (b.x < 0 || b.x > W) b.vx *= -1;
        if (b.y < 0 || b.y > H) b.vy *= -1;
        let g = x.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${rgb(tone(b.c))},${ink?.3:.45})`);
        g.addColorStop(1, 'transparent');
        x.fillStyle = g;
        x.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    });
    x.globalCompositeOperation = 'source-over';
}

function inkBubbles(k) {
    bg(.6);
    S.b.forEach(b => {
        b.x += b.vx * k * 8;
        b.y += b.vy * k * 8;
        if (b.x < 0 || b.x > W) b.vx *= -1;
        if (b.y < 0 || b.y > H) b.vy *= -1;

        let g = x.createRadialGradient(b.x - b.r * .3, b.y - b.r * .3, 1, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        g.addColorStop(.25, `rgba(${rgb(tone(b.c))}, .65)`);
        g.addColorStop(.75, `rgba(${rgb(tone(b.c))}, .3)`);
        g.addColorStop(1, 'transparent');

        x.fillStyle = g;
        x.beginPath();
        x.arc(b.x, b.y, b.r, 0, TAU);
        x.fill();

        x.strokeStyle = `rgba(${rgb(tone(b.c))}, .85)`;
        x.lineWidth = 2;
        x.stroke();
    });
}

function tv_inkBubbles(k) {
    bg(.35);
    x.globalCompositeOperation = "lighter";

    for (let b of S.b) {
        b.x += b.vx * k * 8;
        b.y += b.vy * k * 8;
        if (b.x < 0 || b.x > W) b.vx *= -1;
        if (b.y < 0 || b.y > H) b.vy *= -1;

        let col = tone(b.c);
        let g = x.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${rgb(col)},0.45)`);
        g.addColorStop(.5, `rgba(${rgb(col)},0.25)`);
        g.addColorStop(1, "transparent");

        x.fillStyle = g;
        x.beginPath();
        x.arc(b.x, b.y, b.r, 0, TAU);
        x.fill();

        x.strokeStyle = `rgba(${rgb(col)},.8)`;
        x.lineWidth = 2;
        x.beginPath();
        x.arc(b.x, b.y, b.r, 0, TAU);
        x.stroke();
    }

    x.globalCompositeOperation = "source-over";
}

function dvd(k) {
    bg(1);
    let d = S.d;
    if (!d) return;
    d.x += d.vx * k * 2;
    d.y += d.vy * k * 2;
    if (d.x < 0 || d.x > W - 145) d.vx *= -1;
    if (d.y < 0 || d.y > H - 60) d.vy *= -1;
    
    x.strokeStyle = x.fillStyle = color;
    x.lineWidth = 3;
    x.strokeRect(d.x, d.y, 145, 60);
    
    x.font = 'bold 28px sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle'; 
    x.fillText('DVD', d.x + 145 / 2, d.y + 60 / 2);
}

function clock() {
    bg(.15);
    let d = new Date();
    
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';
    x.fillStyle = color;
    x.shadowColor = color;
    x.shadowBlur = 20;
    
    x.font = `${Math.min(W * .16, 155)}px monospace`;
    x.fillText(d.toLocaleTimeString(), W / 2, H / 2);
    
    x.shadowBlur = 0;
    x.fillStyle = '#aab6ac';
    x.font = '15px monospace';
    x.fillText(d.toDateString(), W / 2, H / 2 + 48);
}

function grid() {
    bg(.18);
    let cx = W / 2,
        cy = H / 2,
        a = tone(),
        r = Math.hypot(W, H);

    for (let i = 0; i < 16; i++) {
        if (i % 2) {
            let p = (i / 16) * TAU + t * .0015;
            x.fillStyle = `rgba(${rgb(a)},.42)`;
            x.beginPath();
            x.moveTo(cx, cy);
            x.lineTo(cx + Math.cos(p - .12) * r, cy + Math.sin(p - .12) * r);
            x.lineTo(cx + Math.cos(p + .12) * r, cy + Math.sin(p + .12) * r);
            x.fill();
        }
    }

    x.fillStyle = a;
    x.shadowColor = a;
    x.shadowBlur = 18;
    x.beginPath();
    x.arc(cx, cy, Math.min(W, H) * .12, 0, TAU);
    x.fill();
    x.shadowBlur = 0;
}

function network(k) {
    bg(.14);
    let a = S.p;
    for (let p of a) {
        p.x += p.vx * k * 2;
        p.y += p.vy * k * 2;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    for (let i = 0; i < a.length; i++)
        for (let j = i + 1; j < a.length; j++) {
            let q = (a[i].x - a[j].x) ** 2 + (a[i].y - a[j].y) ** 2;
            if (q < 15000) {
                x.strokeStyle = `rgba(${rgb(color)},${.25*(1-q/15000)})`;
                x.beginPath();
                x.moveTo(a[i].x, a[i].y);
                x.lineTo(a[j].x, a[j].y);
                x.stroke();
            }
        }
    x.fillStyle = color;
    a.forEach(p => x.fillRect(p.x, p.y, 3, 3));
}

function terminal() {
    bg(.12);
    x.font = '14px monospace';
    x.fillStyle = color;
    let l = ['> boot sequence ... OK', 'packet transmitted: 0x5F3A', 'system status: ONLINE', 'accessing secure node_', '[##########] 100%', 'root@network:~$ ./run'];
    for (let i = 0; i < 25; i++) x.fillText(l[i % 6], 30, (i * 31 + performance.now() * .04) % (H + 30) - 20);
}

function hello(k) {
    bg(.6);
    if (Math.random() < k * .025 && S.g.length < 15) {
        let a = ['Hello', 'สวัสดี', 'Hola', 'Bonjour', '你好', 'こんにちは', '안녕하세요', 'Hallo', 'Ciao', 'Olá', 'Привет', 'مرحبا', 'नमस्ते', 'Hej', 'Merhaba', 'Halo', 'Aloha', 'Sawubona', 'שלום', 'Xin chào'];
        S.g.push({
            s: a[Math.random() * a.length | 0],
            x: W + 80,
            y: R(50, H - 30),
            v: R(1, 4),
            z: Math.random() < .15 ? R(92, 168) : R(32, 62),
            r: R(-.3, .3),
            p: 0,
            c: Math.random() * 3 | 0
        });
    }
    S.g.forEach(g => {
        g.x -= g.v * k * 3;
        g.p += k;
        let a = Math.min(1, g.p / 15, (W - g.x) / 80, (g.x + 240) / 100);
        x.save();
        x.translate(g.x, g.y);
        x.rotate(g.r);
        x.globalAlpha = Math.max(0, a);
        x.fillStyle = tone(g.c);
        x.font = `600 ${g.z}px Space Grotesk`;
        x.fillText(g.s, 0, 0);
        x.restore();
    });
    S.g = S.g.filter(g => g.x > -260);
    x.globalAlpha = 1;
}

function fireflies(k) {
    bg(.13);
    x.shadowColor = color;
    x.shadowBlur = 18;
    S.p.forEach(p => {
        p.p += k * .04;
        p.x += Math.sin(p.p) * k;
        p.y += Math.cos(p.p * .7) * k;
        if (p.x < 0 || p.x > W) p.x = Math.random() * W;
        if (p.y < 0 || p.y > H) p.y = Math.random() * H;
        dot(p.x, p.y, 2, `rgba(${rgb(color)},${.2+.8*Math.sin(p.p)**2})`);
    });
    x.shadowBlur = 0;
}

function bubbles(k) {
    bg(.1);
    S.p.forEach(p => {
        p.y -= p.r * k * .07;
        p.x += Math.sin(t + p.p) * k * .3;
        if (p.y < -p.r) {
            p.y = H + p.r;
            p.x = Math.random() * W;
        }
        let g = x.createRadialGradient(p.x - p.r * .3, p.y - p.r * .3, 1, p.x, p.y, p.r);
        g.addColorStop(0, '#fff8');
        g.addColorStop(.2, `rgba(${rgb(tone(p.c))},.2)`);
        g.addColorStop(1, 'transparent');
        x.fillStyle = g;
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, TAU);
        x.fill();
        x.strokeStyle = `rgba(${rgb(tone(p.c))},.4)`;
        x.stroke();
    });
}

function mesh(k) {
    bg(.16);
    let a = S.p;
    for (let p of a) {
        p.x += p.vx * k;
        p.y += p.vy * k;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    for (let i = 0; i < a.length; i++)
        for (let j = i + 1; j < a.length; j++) {
            let q = (a[i].x - a[j].x) ** 2 + (a[i].y - a[j].y) ** 2;
            if (q < 19000) {
                let g = x.createLinearGradient(a[i].x, a[i].y, a[j].x, a[j].y);
                g.addColorStop(0, `rgba(${rgb(color)},.3)`);
                g.addColorStop(1, 'transparent');
                x.strokeStyle = g;
                x.beginPath();
                x.moveTo(a[i].x, a[i].y);
                x.lineTo(a[j].x, a[j].y);
                x.stroke();
            }
        }
}

function fall(k, type) {
    bg(type === 'storm' || type === 'storm2' ? .28 : .1);
    S.p.forEach(p => {
        p.y += p.vy * k * .06;
        p.x += p.vx * k * .02;
        if (p.y > H + p.r) {
            p.y = -p.r;
            p.x = Math.random() * W;
        }
        if (type === 'storm') {
            x.strokeStyle = `rgba(${rgb(tone(p.c))},.55)`;
            x.lineWidth = p.r * .12;
            x.beginPath();
            x.moveTo(p.x, p.y);
            x.lineTo(p.x - p.vx * .2, p.y - p.r * 3);
            x.stroke();
        } else if (type === 'storm2') {
            dot(p.x, p.y, p.r * .35, `rgba(${rgb(tone(p.c))},.8)`);
        } else if (type === 'snow2') {
            x.shadowColor = tone(p.c);
            x.shadowBlur = 7;
            dot(p.x, p.y, p.r * .35, `rgba(${rgb(tone(p.c))},.8)`);
            x.shadowBlur = 0;
        } else if (type === 'snow') {
            x.shadowColor = '#fff';
            x.shadowBlur = 7;
            dot(p.x, p.y, p.r * .35, '#fff');
            x.shadowBlur = 0;
        } else if (type === 'sakura') {
            x.save();
            x.translate(p.x, p.y);
            x.rotate(t + p.p);
            x.fillStyle = 'rgba(255,185,210,.8)';
            x.beginPath();
            x.ellipse(0, 0, p.r * .55, p.r * .3, 0, 0, TAU);
            x.fill();
            x.restore();
        } else {
            x.save();
            x.translate(p.x, p.y);
            x.rotate(t + p.p);
            x.fillStyle = tone(p.c);
            x.fillRect(-p.r / 3, -p.r / 6, p.r * .7, p.r * .35);
            x.restore();
        }
    });
}

function fall2(k) {
    bg(1);
    if (!S.items2) return;

    S.items2.forEach(item => {
        item.y += item.speedY * k * 0.8;
        item.x += item.speedX * k * 1.5;
        item.rot += item.vRot * k;

        if (item.y > H + item.size) {
            item.y = -item.size;
            item.x = Math.random() * W;
        }

        x.save();
        x.translate(item.x, item.y);
        x.rotate(item.rot);

        if (scene === 'sakura2') {
            x.fillStyle = '#ffb7c5';
            x.beginPath();
            x.ellipse(0, 0, item.size, item.size / 2, 0, 0, Math.PI * 2);
            x.fill();
        } else if (scene === 'snow2') {
            x.shadowColor = '#fff';
            x.shadowBlur = 6;
            x.fillStyle = 'rgba(255, 255, 255, 0.85)';
            x.beginPath();
            x.arc(0, 0, item.size * 0.4, 0, Math.PI * 2);
            x.fill();
        } else if (scene === 'confetti2') {
            x.fillStyle = typeof tone === 'function' ? tone(item.colorIndex) : '#f00';
            x.fillRect(-item.size / 2, -item.size / 4, item.size, item.size / 2);
        }

        x.restore();
    });
}

function plasma() {
    bg(1);
    x.globalCompositeOperation = 'screen';
    for (let i = 0; i < 7; i++) {
        let px = W * (.5 + .42 * Math.sin(t * .012 + i * 1.7)),
            py = H * (.5 + .4 * Math.cos(t * .017 + i * 2.1)),
            r = Math.max(W, H) * .45,
            g = x.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, tone(i) + '99');
        g.addColorStop(1, 'transparent');
        x.fillStyle = g;
        x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    x.globalCompositeOperation = 'source-over';
}

function smoke(k) {
    bg(.07);
    S.b.forEach(b => {
        b.x += b.vx * k;
        b.y += b.vy * k;
        b.r += Math.sin(t + b.p) * .15;
        let g = x.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(190,210,205,.08)');
        g.addColorStop(1, 'transparent');
        x.fillStyle = g;
        x.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    });
}

function tv_clock() {
    bg(.15);
    let d = new Date();
    let shiftX = Math.sin(t * 0.02) * 14;
    let shiftY = Math.cos(t * 0.015) * 10;
    
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';
    x.fillStyle = color;
    x.font = `600 ${Math.min(W * .15, 140)}px "Space Grotesk", sans-serif`;
    x.fillText(d.toLocaleTimeString(), W / 2 + shiftX, H / 2 + shiftY);
    
    x.fillStyle = 'rgba(217, 232, 221, 0.85)';
    x.font = '500 20px "DM Mono", monospace';
    let days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    let dateStr = `${days[d.getDay()]} · ${d.toLocaleDateString()}`;
    x.fillText(dateStr, W / 2 + shiftX, H / 2 + shiftY + 54);
}

function tv_stars(k) {
    bg(.25);
    let activeTone = tone();
    x.lineWidth = 1.5;
    if (!S.tv_star) return;
    S.tv_star.forEach(s => {
        s.pz = s.z;
        s.z -= k * 18;
        if (s.z < 1) {
            s.z = W;
            s.pz = W;
            s.x = (Math.random() - .5) * W * 1.5;
            s.y = (Math.random() - .5) * H * 1.5;
        }
        let X = s.x / s.z * W + W / 2;
        let Y = s.y / s.z * W + H / 2;
        let pX = s.x / s.pz * W + W / 2;
        let pY = s.y / s.pz * W + H / 2;
        let a = Math.max(0.1, 1 - s.z / W);
        
        x.strokeStyle = activeTone;
        x.globalAlpha = a;
        x.beginPath();
        x.moveTo(pX, pY);
        x.lineTo(X, Y);
        x.stroke();
    });
    x.globalAlpha = 1;
}

function tv_matrix(k) {
    bg(.18);
    let fs = 24;
    x.font = `500 ${fs}px monospace`;
    x.textAlign = 'center';
    if (!S.tv_matrix) return;
    let cols = S.tv_matrix.length;
    let colWidth = W / cols;

    S.tv_matrix.forEach((col, i) => {
        let colX = i * colWidth + colWidth / 2;
        col.y += k * col.speed;
        
        for (let j = 0; j < col.len; j++) {
            let charY = (col.y - j) * fs;
            if (charY < -fs || charY > H + fs) continue;
            
            if (j === 0) {
                x.fillStyle = '#ffffff';
                x.globalAlpha = 1;
            } else {
                x.fillStyle = tone();
                x.globalAlpha = Math.max(0.1, 1 - (j / col.len));
            }
            x.fillText(col.chars[j % col.chars.length], colX, charY);
        }

        if ((col.y - col.len) * fs > H) {
            col.y = -Math.random() * 10;
            col.speed = R(0.12, 0.28);
        }
    });
    x.globalAlpha = 1;
}

function tv_grid(k) {
    bg(0.2);

    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;
    const totalCells = cols * rows;

    if (!S.tv_grid2 || S.tv_grid2.cols !== cols || S.tv_grid2.rows !== rows) {
        S.tv_grid2 = {
            cols, rows,
            state: 'FILL',
            cells: Array.from({ length: totalCells }, () => ({
                active: false,
                flickering: false,
                flickerTimer: 0,
                opacity: 0,
                colorIndex: Math.floor(Math.random() * 3)
            })),
            timer: 0,
            flashTimer: 0
        };
    }

    let g = S.tv_grid2;
    g.timer += k;

    if (g.state === 'FILL') {
        if (g.timer > 3) {
            g.timer = 0;
            let inactiveIndices = g.cells
                .map((c, i) => (!c.active && !c.flickering ? i : -1))
                .filter(i => i !== -1);

            if (inactiveIndices.length > 0) {
                let pickIndex = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
                g.cells[pickIndex].flickering = true;
                g.cells[pickIndex].flickerTimer = 0;
            } else {
                let stillFlickering = g.cells.some(c => c.flickering);
                if (!stillFlickering) {
                    g.state = 'HOLD';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'HOLD') {
        if (g.timer > 240) { 
            g.state = 'FLASH';
            g.timer = 0;
            g.flashTimer = 0;
        }
    } else if (g.state === 'FLASH') {
        g.flashTimer += k;
        if (g.flashTimer > 25) {
            g.state = 'CLEAR';
            g.timer = 0;
        }
    } else if (g.state === 'CLEAR') {
        if (g.timer > 1.5) {
            g.timer = 0;
            let activeIndices = g.cells
                .map((c, i) => (c.active ? i : -1))
                .filter(i => i !== -1);

            if (activeIndices.length > 0) {
                let closeCount = Math.min(activeIndices.length, Math.floor(Math.random() * 2) + 1);
                for (let i = 0; i < closeCount; i++) {
                    if (activeIndices.length === 0) break;
                    let randIdx = Math.floor(Math.random() * activeIndices.length);
                    let targetIndex = activeIndices[randIdx];
                    activeIndices.splice(randIdx, 1);

                    g.cells[targetIndex].active = false;
                    g.cells[targetIndex].flickering = true;
                    g.cells[targetIndex].flickerTimer = 0;
                }
            } else {
                let anyFlickering = g.cells.some(c => c.flickering);
                if (!anyFlickering) {
                    g.state = 'WAIT';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'WAIT') {
        if (g.timer > 40) {
            g.cells.forEach(c => c.colorIndex = Math.floor(Math.random() * 3));
            g.state = 'FILL';
            g.timer = 0;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let idx = r * cols + c;
            let cell = g.cells[idx];
            
            let gap = 1.5; 
            let cellX = c * cellW + gap;
            let cellY = r * cellH + gap;
            let drawW = cellW - gap * 2;
            let drawH = cellH - gap * 2;

            let cellColor = tone(cell.colorIndex);

            if (g.state === 'FLASH') {
                cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
            } else if (cell.flickering) {
                cell.flickerTimer += k;

                if (g.state === 'FILL') {
                    cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
                    if (cell.flickerTimer > 25) {
                        cell.flickering = false;
                        cell.active = true;
                        cell.opacity = 1;
                    }
                } else {
                    cell.opacity = Math.random() < 0.5 ? 0.8 : 0.1;
                    if (cell.flickerTimer > 25) {
                        cell.flickering = false;
                        cell.opacity = 0;
                    }
                }
            } else if (cell.active) {
                cell.opacity = 0.85 + Math.random() * 0.15;
            } else {
                cell.opacity = 0;
            }

            if (cell.opacity > 0.05) {
                x.save();
                x.fillStyle = `rgba(${rgb(cellColor)}, ${cell.opacity * 0.85})`;
                x.shadowColor = cellColor;
                x.shadowBlur = cell.opacity * 12;

                x.fillRect(cellX, cellY, drawW, drawH);
                x.restore();
            }
        }
    }
}
function tv_grid2(k) {
    bg(0.2);

    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;
    const totalCells = cols * rows;

    if (!S.tv_grid2 || S.tv_grid2.cols !== cols || S.tv_grid2.rows !== rows) {
        S.tv_grid2 = {
            cols, rows,
            state: 'FILL',
            cells: Array.from({ length: totalCells }, () => ({
                active: false,
                flickering: false,
                flickerTimer: 0,
                opacity: 0,
                colorIndex: Math.floor(Math.random() * 3)
            })),
            timer: 0,
            flashTimer: 0,
            clearWaveProgress: 0,
            clearBatches: []
        };
    }

    let g = S.tv_grid2;
    g.timer += k;

    if (g.state === 'FILL') {
        if (g.timer > 3) {
            g.timer = 0;
            let inactiveIndices = g.cells
                .map((c, i) => (!c.active && !c.flickering ? i : -1))
                .filter(i => i !== -1);

            if (inactiveIndices.length > 0) {
                let pickIndex = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
                g.cells[pickIndex].flickering = true;
                g.cells[pickIndex].flickerTimer = 0;
            } else {
                let stillFlickering = g.cells.some(c => c.flickering);
                if (!stillFlickering) {
                    g.state = 'HOLD';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'HOLD') {
        if (g.timer > 240) { 
            g.state = 'FLASH';
            g.timer = 0;
            g.flashTimer = 0;
        }
    } else if (g.state === 'FLASH') {
        g.flashTimer += k;
        if (g.flashTimer > 25) {
            g.state = 'CLEAR';
            g.timer = 0;
            g.clearWaveProgress = 0;

            // --- สุ่มทิศทางคลื่นการดับ (Direction Setup) ---
            const dirs = ['TOP_BOTTOM', 'BOTTOM_TOP', 'LEFT_RIGHT', 'RIGHT_LEFT', 'TL_BR', 'TR_BL', 'BL_TR', 'BR_TL'];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            
            let groups = {};

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    let idx = r * cols + c;
                    let key = 0;

                    switch (dir) {
                        case 'TOP_BOTTOM': key = r; break;
                        case 'BOTTOM_TOP': key = (rows - 1 - r); break;
                        case 'LEFT_RIGHT': key = c; break;
                        case 'RIGHT_LEFT': key = (cols - 1 - c); break;
                        case 'TL_BR':      key = r + c; break;                     // มุมบนซ้าย -> ล่างขวา
                        case 'TR_BL':      key = r + (cols - 1 - c); break;        // มุมบนขวา -> ล่างซ้าย
                        case 'BL_TR':      key = (rows - 1 - r) + c; break;        // มุมล่างซ้าย -> บนขวา
                        case 'BR_TL':      key = (rows - 1 - r) + (cols - 1 - c); break; // มุมล่างขวา -> บนซ้าย
                    }

                    if (!groups[key]) groups[key] = [];
                    groups[key].push(idx);
                }
            }

            // จัดกลุ่มแถวตามลำดับคลื่น
            g.clearBatches = Object.keys(groups)
                .sort((a, b) => Number(a) - Number(b))
                .map(k => groups[k]);
        }
    } else if (g.state === 'CLEAR') {
        // ทุกๆ 3 เฟรม/เวลาที่กำหนด ปล่อยคลื่นดับไปแถวถัดไป
        if (g.timer > 3) {
            g.timer = 0;
            
            if (g.clearWaveProgress < g.clearBatches.length) {
                let currentBatch = g.clearBatches[g.clearWaveProgress];
                currentBatch.forEach(targetIndex => {
                    if (g.cells[targetIndex].active) {
                        g.cells[targetIndex].active = false;
                        g.cells[targetIndex].flickering = true;
                        g.cells[targetIndex].flickerTimer = 0;
                    }
                });
                g.clearWaveProgress++;
            } else {
                let anyFlickering = g.cells.some(c => c.flickering);
                if (!anyFlickering) {
                    g.state = 'WAIT';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'WAIT') {
        if (g.timer > 40) {
            g.cells.forEach(c => c.colorIndex = Math.floor(Math.random() * 3));
            g.state = 'FILL';
            g.timer = 0;
        }
    }

    // --- RENDER ---
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let idx = r * cols + c;
            let cell = g.cells[idx];
            
            let gap = 1.5; 
            let cellX = c * cellW + gap;
            let cellY = r * cellH + gap;
            let drawW = cellW - gap * 2;
            let drawH = cellH - gap * 2;

            let cellColor = tone(cell.colorIndex);

            if (g.state === 'FLASH') {
                cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
            } else if (cell.flickering) {
                cell.flickerTimer += k;

                if (g.state === 'FILL') {
                    cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
                    if (cell.flickerTimer > 25) {
                        cell.flickering = false;
                        cell.active = true;
                        cell.opacity = 1;
                    }
                } else {
                    // เอฟเฟกต์กะพริบตอนกำลังดับลง
                    cell.opacity = Math.random() < 0.5 ? 0.8 : 0.1;
                    if (cell.flickerTimer > 25) {
                        cell.flickering = false;
                        cell.opacity = 0;
                    }
                }
            } else if (cell.active) {
                cell.opacity = 0.85 + Math.random() * 0.15;
            } else {
                cell.opacity = 0;
            }

            if (cell.opacity > 0.05) {
                x.save();
                x.fillStyle = `rgba(${rgb(cellColor)}, ${cell.opacity * 0.85})`;
                x.shadowColor = cellColor;
                x.shadowBlur = cell.opacity * 12;

                x.fillRect(cellX, cellY, drawW, drawH);
                x.restore();
            }
        }
    }
}
/*
function tv_grid_tetris(k) {
    bg(0.2);

    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;
    const totalCells = cols * rows;

    if (!S.tv_tetris || S.tv_tetris.cols !== cols || S.tv_tetris.rows !== rows) {
        S.tv_tetris = {
            cols, rows,
            state: 'FALL', // 'FALL', 'HOLD', 'DRAIN', 'WAIT'
            // grid เก็บข้อมูลเซลล์ [row][col]
            grid: Array.from({ length: rows }, () => 
                Array.from({ length: cols }, () => ({
                    active: false,
                    colorIndex: 0,
                    opacity: 0
                }))
            ),
            fallingBlock: null, // บล็อก 1 ช่องที่กำลังหล่น { r, c, colorIndex }
            timer: 0,
            fallSpeed: 1.5, // ความเร็วในการหล่น (ปรับตามชอบ)
            drainTimer: 0
        };
        
        // สุ่มสร้างบล็อกแรกที่กำลังหล่น
        spawnBlock(S.tv_tetris);
    }

    let g = S.tv_tetris;
    g.timer += k;

    // ฟังก์ชันสร้างบล็อก 1 ช่องสุ่มหล่นจากด้านบน
    function spawnBlock(state) {
        // หาคอลัมน์ที่ยังไม่เต็ม (แถวบนสุด [0] ยังว่างอยู่)
        let validCols = [];
        for (let c = 0; c < state.cols; c++) {
            if (!state.grid[0][c].active) {
                validCols.push(c);
            }
        }

        if (validCols.length > 0) {
            let selectedCol = validCols[Math.floor(Math.random() * validCols.length)];
            state.fallingBlock = {
                r: 0,
                c: selectedCol,
                colorIndex: Math.floor(Math.random() * 3)
            };
        } else {
            // ถ้าทุกคอลัมน์เต็มแล้ว เปลี่ยนเป็น HOLD เพื่อเตรียมลบออก
            state.fallingBlock = null;
            state.state = 'HOLD';
            state.timer = 0;
        }
    }

    // --- LOGIC STATES ---
    if (g.state === 'FALL') {
        if (g.fallingBlock && g.timer > g.fallSpeed) {
            g.timer = 0;
            let fb = g.fallingBlock;
            let nextR = fb.r + 1;

            // เช็คว่าชนขอบล่าง หรือชนบล็อกที่อยู่ข้างใต้แล้วหรือยัง
            if (nextR >= rows || g.grid[nextR][fb.c].active) {
                // หยุดอยู่กับที่และรวมเข้ากับ grid
                g.grid[fb.r][fb.c].active = true;
                g.grid[fb.r][fb.c].colorIndex = fb.colorIndex;
                g.grid[fb.r][fb.c].opacity = 1;

                // สุ่มสร้างบล็อกใหม่
                spawnBlock(g);
            } else {
                // หล่นลงล่าง 1 แถว
                fb.r = nextR;
            }
        }
    } else if (g.state === 'HOLD') {
        if (g.timer > 30) {
            g.state = 'DRAIN';
            g.timer = 0;
            g.drainTimer = 0;
        }
    } else if (g.state === 'DRAIN') {
        g.drainTimer += k;
        // ลบแถวล่างสุดออกเรื่อยๆ ทำให้แถวบนไหลลงมา
        if (g.drainTimer > 4) { // จังหวะเวลาการไหลลงล่าง
            g.drainTimer = 0;

            // เลื่อนข้อมูลแถวด้านบนลงมาด้านล่างทีละ 1 แถว
            for (let r = rows - 1; r > 0; r--) {
                for (let c = 0; c < cols; c++) {
                    g.grid[r][c].active = g.grid[r - 1][c].active;
                    g.grid[r][c].colorIndex = g.grid[r - 1][c].colorIndex;
                    g.grid[r][c].opacity = g.grid[r - 1][c].opacity;
                }
            }

            // แถวบนสุดเติมความว่างเปล่า
            for (let c = 0; c < cols; c++) {
                g.grid[0][c].active = false;
                g.grid[0][c].opacity = 0;
            }

            // เช็คว่าล้างจนว่างเปล่าหมดทุกเซลล์หรือยัง
            let hasActiveCell = g.grid.some(row => row.some(cell => cell.active));
            if (!hasActiveCell) {
                g.state = 'WAIT';
                g.timer = 0;
            }
        }
    } else if (g.state === 'WAIT') {
        if (g.timer > 20) {
            g.state = 'FALL';
            g.timer = 0;
            spawnBlock(g);
        }
    }

    // --- RENDER ---
    const gap = 1.5;

    // 1. วาดบล็อกที่คงค้างอยู่ใน Grid
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = g.grid[r][c];
            if (cell.active) {
                let cellX = c * cellW + gap;
                let cellY = r * cellH + gap;
                let drawW = cellW - gap * 2;
                let drawH = cellH - gap * 2;
                let cellColor = tone(cell.colorIndex);

                let opacity = (0.85 + Math.random() * 0.15) * cell.opacity;

                x.save();
                x.fillStyle = `rgba(${rgb(cellColor)}, ${opacity * 0.85})`;
                x.shadowColor = cellColor;
                x.shadowBlur = opacity * 12;

                x.fillRect(cellX, cellY, drawW, drawH);
                x.restore();
            }
        }
    }

    // 2. วาดบล็อกกำลังหล่น (Falling Block)
    if (g.state === 'FALL' && g.fallingBlock) {
        let fb = g.fallingBlock;
        let cellX = fb.c * cellW + gap;
        let cellY = fb.r * cellH + gap;
        let drawW = cellW - gap * 2;
        let drawH = cellH - gap * 2;
        let cellColor = tone(fb.colorIndex);

        x.save();
        x.fillStyle = `rgba(${rgb(cellColor)}, 0.95)`;
        x.shadowColor = cellColor;
        x.shadowBlur = 15;

        x.fillRect(cellX, cellY, drawW, drawH);
        x.restore();
    }
}
*/
function tv_grid_tetris(k) {
    bg(0.2);

    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;
    const totalCells = cols * rows;

    if (!S.tv_tetris2 || S.tv_tetris2.cols !== cols || S.tv_tetris2.rows !== rows) {
        S.tv_tetris2 = {
            cols, rows,
            state: 'FALL', // 'FALL', 'HOLD', 'CLEAR_WAVE', 'WAIT'
            grid: Array.from({ length: rows }, () => 
                Array.from({ length: cols }, () => ({
                    active: false,
                    colorIndex: 0,
                    flickering: false,
                    flickerTimer: 0
                }))
            ),
            fallingBlock: null,
            timer: 0,
            fallSpeed: 1.2,
            clearRow: rows - 1, // เริ่มลบจากแถวล่างสุด
            clearCol: 0        // เริ่มลบจากซ้ายไปขวา
        };
        spawnBlock(S.tv_tetris2);
    }

    let g = S.tv_tetris2;
    g.timer += k;

    function spawnBlock(state) {
        let validCols = [];
        for (let c = 0; c < state.cols; c++) {
            if (!state.grid[0][c].active) validCols.push(c);
        }

        if (validCols.length > 0) {
            let selectedCol = validCols[Math.floor(Math.random() * validCols.length)];
            state.fallingBlock = {
                r: 0,
                c: selectedCol,
                colorIndex: Math.floor(Math.random() * 3)
            };
        } else {
            // เต็มจอแล้ว! ไปโหมด HOLD
            state.fallingBlock = null;
            state.state = 'HOLD';
            state.timer = 0;
        }
    }

    // --- LOGIC STATES ---
    if (g.state === 'FALL') {
        if (g.fallingBlock && g.timer > g.fallSpeed) {
            g.timer = 0;
            let fb = g.fallingBlock;
            let nextR = fb.r + 1;

            if (nextR >= rows || g.grid[nextR][fb.c].active) {
                g.grid[fb.r][fb.c].active = true;
                g.grid[fb.r][fb.c].colorIndex = fb.colorIndex;
                spawnBlock(g);
            } else {
                fb.r = nextR;
            }
        }
    } else if (g.state === 'HOLD') {
        if (g.timer > 30) {
            g.state = 'CLEAR_WAVE';
            g.timer = 0;
            g.clearRow = rows - 1; // ลบจากล่างขึ้นบน
            g.clearCol = 0;        // ลบจากซ้ายไปขวา
        }
    } else if (g.state === 'CLEAR_WAVE') {
        // วิ่งลบทีละเซลล์จากซ้ายไปขวา
        if (g.timer > 1.5) { // ปรับความเร็วคลื่นตรงนี้
            g.timer = 0;

            if (g.clearRow >= 0) {
                let cell = g.grid[g.clearRow][g.clearCol];
                if (cell.active) {
                    cell.active = false;
                    cell.flickering = true;
                    cell.flickerTimer = 0;
                }

                g.clearCol++;
                // ถ้าลบหมดแถวแล้ว ขึ้นไปแถวบน
                if (g.clearCol >= cols) {
                    g.clearCol = 0;
                    g.clearRow--;
                }
            } else {
                // เช็คว่าเอฟเฟกต์กะพริบดับหมดหรือยัง
                let anyFlickering = g.grid.some(row => row.some(c => c.flickering));
                if (!anyFlickering) {
                    g.state = 'WAIT';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'WAIT') {
        if (g.timer > 30) {
            g.state = 'FALL';
            g.timer = 0;
            spawnBlock(g);
        }
    }

    // --- RENDER ---
    const gap = 1.5;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = g.grid[r][c];
            let cellX = c * cellW + gap;
            let cellY = r * cellH + gap;
            let drawW = cellW - gap * 2;
            let drawH = cellH - gap * 2;
            let cellColor = tone(cell.colorIndex);
            let opacity = 0;

            if (cell.flickering) {
                cell.flickerTimer += k;
                opacity = Math.random() < 0.5 ? 0.8 : 0.1;
                if (cell.flickerTimer > 15) {
                    cell.flickering = false;
                    opacity = 0;
                }
            } else if (cell.active) {
                opacity = 0.85 + Math.random() * 0.15;
            }

            if (opacity > 0.05) {
                x.save();
                x.fillStyle = `rgba(${rgb(cellColor)}, ${opacity * 0.85})`;
                x.shadowColor = cellColor;
                x.shadowBlur = opacity * 12;
                x.fillRect(cellX, cellY, drawW, drawH);
                x.restore();
            }
        }
    }

    // วาดบล็อกกำลังหล่น
    if (g.state === 'FALL' && g.fallingBlock) {
        let fb = g.fallingBlock;
        let cellX = fb.c * cellW + gap;
        let cellY = fb.r * cellH + gap;
        let drawW = cellW - gap * 2;
        let drawH = cellH - gap * 2;
        let cellColor = tone(fb.colorIndex);

        x.save();
        x.fillStyle = `rgba(${rgb(cellColor)}, 0.95)`;
        x.shadowColor = cellColor;
        x.shadowBlur = 15;
        x.fillRect(cellX, cellY, drawW, drawH);
        x.restore();
    }
}
function tv_grid_tetris2(k) {
    bg(0.2);

    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;

    if (!S.tv_tetris_cls || S.tv_tetris_cls.cols !== cols || S.tv_tetris_cls.rows !== rows) {
        S.tv_tetris_cls = {
            cols, rows,
            state: 'FALL', // 'FALL', 'CLEARING'
            grid: Array.from({ length: rows }, () => 
                Array.from({ length: cols }, () => ({
                    active: false,
                    colorIndex: 0,
                    flickering: false,
                    flickerTimer: 0
                }))
            ),
            fallingBlock: null,
            timer: 0,
            fallSpeed: 1.0,
            clearingRows: [], // รายชื่อแถวที่กำลังจะลบ
            clearCol: 0,
            clearTimer: 0
        };
        spawnBlock(S.tv_tetris_cls);
    }

    let g = S.tv_tetris_cls;
    g.timer += k;

    function spawnBlock(state) {
        // สุ่มปล่อยบล็อกในคอลัมน์ที่ยังไม่เต็ม
        let validCols = [];
        for (let c = 0; c < state.cols; c++) {
            if (!state.grid[0][c].active) validCols.push(c);
        }

        if (validCols.length > 0) {
            let selectedCol = validCols[Math.floor(Math.random() * validCols.length)];
            state.fallingBlock = {
                r: 0,
                c: selectedCol,
                colorIndex: Math.floor(Math.random() * 3)
            };
        } else {
            // กรณีฉุกเฉินถ้าเกือบเต็ม ให้ล้างกระดาน
            state.grid.forEach(row => row.forEach(c => { c.active = false; c.flickering = false; }));
            spawnBlock(state);
        }
    }

    // --- LOGIC STATES ---
    if (g.state === 'FALL') {
        if (g.fallingBlock && g.timer > g.fallSpeed) {
            g.timer = 0;
            let fb = g.fallingBlock;
            let nextR = fb.r + 1;

            if (nextR >= rows || g.grid[nextR][fb.c].active) {
                // บล็อกตกถึงพื้น/ชนแถวอื่น
                g.grid[fb.r][fb.c].active = true;
                g.grid[fb.r][fb.c].colorIndex = fb.colorIndex;
                g.fallingBlock = null;

                // ตรวจหาแถวที่เต็ม (Full Rows)
                let fullRows = [];
                for (let r = 0; r < rows; r++) {
                    if (g.grid[r].every(cell => cell.active)) {
                        fullRows.push(r);
                    }
                }

                if (fullRows.length > 0) {
                    g.state = 'CLEARING';
                    g.clearingRows = fullRows;
                    g.clearCol = 0;
                    g.clearTimer = 0;
                } else {
                    spawnBlock(g);
                }
            } else {
                fb.r = nextR;
            }
        }
    } else if (g.state === 'CLEARING') {
        g.clearTimer += k;
        
        // ลบจากซ้ายไปขวา (Wave Effect)
        if (g.clearTimer > 1.2) {
            g.clearTimer = 0;

            if (g.clearCol < cols) {
                g.clearingRows.forEach(r => {
                    let cell = g.grid[r][g.clearCol];
                    cell.active = false;
                    cell.flickering = true;
                    cell.flickerTimer = 0;
                });
                g.clearCol++;
            } else {
                // เช็คว่ากะพริบดับหมดหรือยัง
                let anyFlickering = g.grid.some(row => row.some(c => c.flickering));
                if (!anyFlickering) {
                    // เลื่อนแถวข้างบนลงมาแทนที่แถวที่โดนลบ
                    g.clearingRows.sort((a, b) => a - b).forEach(clearedRow => {
                        for (let r = clearedRow; r > 0; r--) {
                            for (let c = 0; c < cols; c++) {
                                g.grid[r][c].active = g.grid[r - 1][c].active;
                                g.grid[r][c].colorIndex = g.grid[r - 1][c].colorIndex;
                            }
                        }
                        for (let c = 0; c < cols; c++) {
                            g.grid[0][c].active = false;
                        }
                    });

                    g.clearingRows = [];
                    g.state = 'FALL';
                    g.timer = 0;
                    spawnBlock(g);
                }
            }
        }
    }

    // --- RENDER ---
    const gap = 1.5;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = g.grid[r][c];
            let cellX = c * cellW + gap;
            let cellY = r * cellH + gap;
            let drawW = cellW - gap * 2;
            let drawH = cellH - gap * 2;
            let cellColor = tone(cell.colorIndex);
            let opacity = 0;

            if (cell.flickering) {
                cell.flickerTimer += k;
                opacity = Math.random() < 0.5 ? 0.8 : 0.1;
                if (cell.flickerTimer > 15) {
                    cell.flickering = false;
                    opacity = 0;
                }
            } else if (cell.active) {
                opacity = 0.85 + Math.random() * 0.15;
            }

            if (opacity > 0.05) {
                x.save();
                x.fillStyle = `rgba(${rgb(cellColor)}, ${opacity * 0.85})`;
                x.shadowColor = cellColor;
                x.shadowBlur = opacity * 12;
                x.fillRect(cellX, cellY, drawW, drawH);
                x.restore();
            }
        }
    }

    // วาดบล็อกกำลังหล่น
    if (g.state === 'FALL' && g.fallingBlock) {
        let fb = g.fallingBlock;
        let cellX = fb.c * cellW + gap;
        let cellY = fb.r * cellH + gap;
        let drawW = cellW - gap * 2;
        let drawH = cellH - gap * 2;
        let cellColor = tone(fb.colorIndex);

        x.save();
        x.fillStyle = `rgba(${rgb(cellColor)}, 0.95)`;
        x.shadowColor = cellColor;
        x.shadowBlur = 15;
        x.fillRect(cellX, cellY, drawW, drawH);
        x.restore();
    }
}

function tv_grid_spectrum(k) {
    bg(0.15); // พื้นหลังมืดช่วยลดภาระการเรนเดอร์

    const targetSize = Math.min(W, H) > 600 ? 45 : 30;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;

    if (!S.tv_spec || S.tv_spec.cols !== cols || S.tv_spec.rows !== rows) {
        S.tv_spec = {
            cols, rows,
            time: 0,
            modeTimer: 0,
            mode: 0, // 0: Vertical Waves, 1: Ripple Waves, 2: Noise Grid
            // สุ่มกำหนดค่า Phase สำหรับแต่ละคอลัมน์เพื่อความหลากหลาย
            offsets: Array.from({ length: cols }, () => Math.random() * 10)
        };
    }

    let g = S.tv_spec;
    g.time += k * 0.08; // ความเร็วของคลื่น
    g.modeTimer += k;

    // สลับโหมดการเล่นทุกๆ 80 เฟรม เพื่อไม่ให้ภาพซ้ำจำเจ
    if (g.modeTimer > 80) {
        g.modeTimer = 0;
        g.mode = (g.mode + 1) % 3;
    }

    const gap = 1.5;

    // วาดครอบคลุมทั้งจอ (Loop เดียวรวดเดียว)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let val = 0;

            if (g.mode === 0) {
                // โหมด คลื่นวิ่งแนวนอน/แนวตั้งสลับกัน (Equalizer Wave)
                let wave1 = Math.sin(c * 0.3 + g.time + g.offsets[c]);
                let wave2 = Math.cos(r * 0.2 - g.time);
                val = (wave1 + wave2 + 2) / 4; // Normalized 0..1
            } else if (g.mode === 1) {
                // โหมด คลื่นวงกลมกระจายออกจากจุดศูนย์กลาง (Center Ripple)
                let cx = cols / 2;
                let cy = rows / 2;
                let dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
                val = (Math.sin(dist * 0.5 - g.time * 2) + 1) / 2;
            } else {
                // โหมด สัญญาณรบกวนอนาล็อกแบบเป็นจังหวะ (Pulse Noise)
                val = Math.sin(c * 0.5 + g.time) * Math.cos(r * 0.5 + g.time);
                val = Math.abs(val);
            }

            // คำนวณความสว่างและความเข้มแสง
            let opacity = Math.min(1, Math.max(0, val));

            // ข้ามการวาดช่องที่มืดสนิท เพื่อประหยัด Render Performance บนเครื่องเก่า
            if (opacity < 0.1) continue;

            let cellX = c * cellW + gap;
            let cellY = r * cellH + gap;
            let drawW = cellW - gap * 2;
            let drawH = cellH - gap * 2;

            // เลือกสีตามความสูง/ตำแหน่ง (ไล่เฉด RGB สไตล์ไซเบอร์ปังก์)
            let colorIndex = (r + c + Math.floor(g.time * 2)) % 3;
            let cellColor = tone(colorIndex);

            x.save();
            x.fillStyle = `rgba(${rgb(cellColor)}, ${opacity * 0.8})`;

            // เปิด Glow เฉพาะช่องที่สว่างมากๆ เพื่อประหยัดการคำนวณ Shadow
            if (opacity > 0.7) {
                x.shadowColor = cellColor;
                x.shadowBlur = opacity * 8;
            }

            x.fillRect(cellX, cellY, drawW, drawH);
            x.restore();
        }
    }
}
/*
function tv_grid2(k) {
    bg(0.2);

    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;
    const totalCells = cols * rows;

    if (!S.tv_grid2 || S.tv_grid2.cols !== cols || S.tv_grid2.rows !== rows) {
        S.tv_grid2 = {
            cols, rows,
            state: 'FILL',
            cells: Array.from({ length: totalCells }, () => ({
                active: false,
                flickering: false,
                flickerTimer: 0,
                opacity: 0,
                colorIndex: Math.floor(Math.random() * 3) 
            })),
            timer: 0,
            flashTimer: 0,
            gridAlpha: 0.3
        };
    }

    let g = S.tv_grid2;
    g.timer += k;

    if (g.state === 'FILL') {
        if (g.timer > 3) {
            g.timer = 0;
            let inactiveIndices = g.cells
                .map((c, i) => (!c.active && !c.flickering ? i : -1))
                .filter(i => i !== -1);

            if (inactiveIndices.length > 0) {
                let pickIndex = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
                g.cells[pickIndex].flickering = true;
                g.cells[pickIndex].flickerTimer = 0;
            } else {
                let stillFlickering = g.cells.some(c => c.flickering);
                if (!stillFlickering) {
                    g.state = 'HOLD';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'HOLD') {
        if (g.timer > 240) { 
            g.state = 'FLASH';
            g.timer = 0;
            g.flashTimer = 0;
        }
    } else if (g.state === 'FLASH') {
        g.flashTimer += k;
        if (g.flashTimer > 25) {
            g.state = 'CLEAR';
            g.timer = 0;
        }
    } else if (g.state === 'CLEAR') {
        if (g.timer > 1.5) {
            g.timer = 0;
            let activeIndices = g.cells
                .map((c, i) => (c.active ? i : -1))
                .filter(i => i !== -1);

            if (activeIndices.length > 0) {
                let closeCount = Math.min(activeIndices.length, Math.floor(Math.random() * 2) + 1);
                for (let i = 0; i < closeCount; i++) {
                    if (activeIndices.length === 0) break;
                    let randIdx = Math.floor(Math.random() * activeIndices.length);
                    let targetIndex = activeIndices[randIdx];
                    activeIndices.splice(randIdx, 1);

                    g.cells[targetIndex].active = false;
                    g.cells[targetIndex].flickering = true;
                    g.cells[targetIndex].flickerTimer = 0;
                }
            } else {
                let anyFlickering = g.cells.some(c => c.flickering);
                if (!anyFlickering) {
                    g.state = 'WAIT';
                    g.timer = 0;
                }
            }
        }
    } else if (g.state === 'WAIT') {
        if (g.timer > 120) {
            g.cells.forEach(c => c.colorIndex = Math.floor(Math.random() * 3));
            g.state = 'FILL';
            g.timer = 0;
        }
    }

    let themeMainColor = tone(0);

    if (Math.random() < 0.08) {
        g.gridAlpha = Math.random() < 0.3 ? 0.05 : 0.45;
    } else {
        g.gridAlpha += (0.25 - g.gridAlpha) * 0.1;
    }

    x.strokeStyle = `rgba(${rgb(themeMainColor)}, ${g.gridAlpha})`;
    x.lineWidth = 3;

    x.beginPath();
    for (let c = 0; c <= cols; c++) {
        let lx = c * cellW;
        x.moveTo(lx, 0);
        x.lineTo(lx, H);
    }
    for (let r = 0; r <= rows; r++) {
        let ly = r * cellH;
        x.moveTo(0, ly);
        x.lineTo(W, ly);
    }
    x.stroke();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let idx = r * cols + c;
            let cell = g.cells[idx];
            let cellX = c * cellW + 2;
            let cellY = r * cellH + 2;
            let drawW = cellW - 4;
            let drawH = cellH - 4;

            let cellColor = tone(cell.colorIndex);

            if (g.state === 'FLASH') {
                cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
            } else if (cell.flickering) {
                cell.flickerTimer += k;

                if (g.state === 'FILL') {
                    cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
                    if (cell.flickerTimer > 25) {
                        cell.flickering = false;
                        cell.active = true;
                        cell.opacity = 1;
                    }
                } else {
                    cell.opacity = Math.random() < 0.5 ? 0.8 : 0.1;
                    if (cell.flickerTimer > 25) {
                        cell.flickering = false;
                        cell.opacity = 0;
                    }
                }
            } else if (cell.active) {
                cell.opacity = 0.85 + Math.random() * 0.15;
            } else {
                cell.opacity = 0;
            }

            if (cell.opacity > 0.05) {
                x.save();
                x.fillStyle = `rgba(${rgb(cellColor)}, ${cell.opacity * 0.85})`;
                x.shadowColor = cellColor;
                x.shadowBlur = cell.opacity * 12;

                x.fillRect(cellX, cellY, drawW, drawH);
                x.restore();
            }
        }
    }
}
*/
function tv_blobs(k) {
    bg(.16);
    if (!S.tv_blobs) return;
    S.tv_blobs.forEach(b => {
        b.x += b.vx * k * 2.5;
        b.y += b.vy * k * 2.5;
        if (b.x < 0 || b.x > W) b.vx *= -1;
        if (b.y < 0 || b.y > H) b.vy *= -1;
        
        let g = x.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${rgb(tone(b.c))}, 0.5)`);
        g.addColorStop(1, 'transparent');
        x.fillStyle = g;
        x.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    });
}

function tv_dvd(k) {
    bg(.25);
    if (!S.tv_dvd) return;
    let d = S.tv_dvd;
    let boxW = 160, boxH = 70;
    d.x += d.vx * k * 2;
    d.y += d.vy * k * 2;
    let bounced = false;
    if (d.x < 0 || d.x > W - boxW) { d.vx *= -1; bounced = true; }
    if (d.y < 0 || d.y > H - boxH) { d.vy *= -1; bounced = true; }
    if (bounced) { d.c = (d.c + 1) % 5; }

    let curColor = tone(d.c);
    x.strokeStyle = x.fillStyle = curColor;
    x.lineWidth = 3;
    x.strokeRect(d.x, d.y, boxW, boxH);
    
    x.font = 'bold 30px "Space Grotesk", sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle'; 
    x.fillText('TV DVD', d.x + boxW / 2, d.y + boxH / 2);
}

// --- WebGL Init & Render Logic (OPTIMIZED FAST COLOR CONVERSION) ---
let glProgramNebula = null;
let glReadyNebula = false;

function nebulaWebGL(k) {
    x.clearRect(0, 0, W, H);
    if (!glReadyNebula) initNebulaWebGL();

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgramNebula);

    gl.uniform2f(gl.getUniformLocation(glProgramNebula, "u_res"), glCanvas.width, glCanvas.height);
    gl.uniform1f(gl.getUniformLocation(glProgramNebula, "u_time"), t);

    let c1 = hexToRgbNormalizedFast(tone(0));
    let c2 = hexToRgbNormalizedFast(tone(1));
    let c3 = hexToRgbNormalizedFast(tone(2));
    let cols = [...c1, ...c2, ...c3];

    gl.uniform3fv(gl.getUniformLocation(glProgramNebula, "colors[0]"), new Float32Array(cols));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initNebulaWebGL(){
    if (glReadyNebula) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: false });
    }
    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main(){
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;

    const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 colors[3];
    varying vec2 v_uv;

    float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for(int i = 0; i < 5; i++){
            v += noise(p) * a;
            p = rot * p * 2.0;
            a *= 0.5;
        }
        return v;
    }

    void main(){
        vec2 st = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);
        vec2 p = st * 2.5;
        p.x += mod(u_time * 0.015, 300.0);
        float n = fbm(p);
        float n_smooth = smoothstep(0.1, 0.9, n);
        vec3 col = mix(colors[0], colors[1], n_smooth);
        col = mix(col, colors[2], pow(n_smooth, 2.0));
        float glow = smoothstep(0.15, 0.85, n);
        gl_FragColor = vec4(col * (0.45 + glow * 0.55), 1.0);
    }`;

    function shader(type, src){
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
            console.log(gl.getShaderInfoLog(s));
        }
        return s;
    }

    glProgramNebula = gl.createProgram();
    gl.attachShader(glProgramNebula, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(glProgramNebula, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(glProgramNebula);

    if(!gl.getProgramParameter(glProgramNebula, gl.LINK_STATUS)){
        console.log(gl.getProgramInfoLog(glProgramNebula));
        return;
    }

    gl.useProgram(glProgramNebula);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    let loc = gl.getAttribLocation(glProgramNebula, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glReadyNebula = true;
}

let glProgramInkBubbles = null;
let glReadyInkBubbles = false;

function inkBubblesWebGL(k) {
    x.clearRect(0, 0, W, H);
    if (!glReadyInkBubbles) initInkWebGL();

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let arr = [];

    for (let b of S.b) {
        b.x += b.vx * k * 8;
        b.y += b.vy * k * 8;

        if (b.x < 0 || b.x > W) b.vx *= -1;
        if (b.y < 0 || b.y > H) b.vy *= -1;

        arr.push(b.x / W, 1 - b.y / H, b.r / 180);
    }

    while (arr.length < 24) arr.push(0);

    gl.useProgram(glProgramInkBubbles);

    gl.uniform2f(locRes, glCanvas.width, glCanvas.height);
    gl.uniform1f(locTime, t);
    gl.uniform3fv(locBlobs, new Float32Array(arr));

    const hexToRgb01 = h => {
        let n = parseInt(h.slice(1), 16);
        return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    const cols = [
        ...hexToRgb01(tone(0)),
        ...hexToRgb01(tone(1)),
        ...hexToRgb01(tone(2))
    ];

    gl.uniform3fv(locColors, new Float32Array(cols));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initInkWebGL(){
    if (glReadyInkBubbles) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: false });
    }
    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos,0.0,1.0);
    }`;

    const fs = `
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 blobs[8];
    uniform vec3 colors[3];

    void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        float v = 0.0;
        for(int i=0;i<8;i++){
            vec2 p = blobs[i].xy;
            float r = blobs[i].z;
            float d = distance(uv, p);
            v += r*r / (d*d*40.0);
        }
        vec3 col = mix(colors[0], colors[1], clamp(v * 0.5,0.0,1.0));
        col = mix(col, colors[2], clamp(v * 0.25,0.0,1.0));
        float glow = smoothstep(.8, 1.4, v);
        gl_FragColor = vec4(col * glow, glow);
    }`;

    function shader(type,src){
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    glProgramInkBubbles = gl.createProgram();
    gl.attachShader(glProgramInkBubbles, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(glProgramInkBubbles, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(glProgramInkBubbles);
    gl.useProgram(glProgramInkBubbles);

    locRes = gl.getUniformLocation(glProgramInkBubbles, "u_res");
    locTime = gl.getUniformLocation(glProgramInkBubbles, "u_time");
    locBlobs = gl.getUniformLocation(glProgramInkBubbles, "blobs[0]");
    locColors = gl.getUniformLocation(glProgramInkBubbles, "colors[0]");

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1,-1, 1,-1, -1, 1, -1, 1, 1,-1, 1, 1]),
        gl.STATIC_DRAW
    );

    let loc = gl.getAttribLocation(glProgramInkBubbles, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glReadyInkBubbles = true;
}

let glProgramMatrix = null;
let glReadyMatrix = false;
let fontTexture = null;

function matrixWebGL(k) {
    x.clearRect(0, 0, W, H);
    if (!glReadyMatrix) initMatrixWebGL();

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgramMatrix);

    gl.uniform2f(gl.getUniformLocation(glProgramMatrix, "u_res"), glCanvas.width, glCanvas.height);
    gl.uniform1f(gl.getUniformLocation(glProgramMatrix, "u_time"), (t * 0.001) % 10000.0);

    let c1 = hexToRgbNormalizedFast(tone(0)); 
    let c2 = hexToRgbNormalizedFast(tone(1) || tone(0));

    gl.uniform3f(gl.getUniformLocation(glProgramMatrix, "u_colorMain"), c1[0], c1[1], c1[2]);
    gl.uniform3f(gl.getUniformLocation(glProgramMatrix, "u_colorHead"), c2[0], c2[1], c2[2]);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fontTexture);
    gl.uniform1i(gl.getUniformLocation(glProgramMatrix, "u_fontTexture"), 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createFontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#00000000';
    ctx.fillRect(0, 0, 512, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    for (let i = 0; i < 16; i++) {
        let ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 32 + 16, 16);
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}

function initMatrixWebGL() {
    if (glReadyMatrix) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: false });
    }
    if (!gl) return;

    fontTexture = createFontTexture();

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;

    const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorHead;
    uniform sampler2D u_fontTexture;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }

    vec4 renderMatrixLayer(vec2 st, vec2 gridOffset, float speedMult, float scaleMult, float alphaMult) {
        float cols = 65.0 * scaleMult;
        vec2 grid = vec2(cols, cols * (u_res.y / u_res.x) * 0.45);
        vec2 layerSt = st + gridOffset;
        vec2 cellID = floor(layerSt * grid);
        vec2 cellUV = fract(layerSt * grid);
        float colHash = hash(vec2(cellID.x, 31.0));
        float speed = (3.5 + colHash * 0.5) * speedMult;
        float dropOffset = colHash * 999.0;
        float loopLen = 40.0 + colHash * 20.0;
        float currentY = cellID.y + (u_time * speed * 8.0) + dropOffset;
        float posInLoop = mod(currentY, loopLen);
        float streamLen = 10.0 + colHash * 10.0;
        float distFromHead = posInLoop;
        float inStream = step(0.0, distFromHead) * step(distFromHead, streamLen);
        float head = step(distFromHead, 1.0) * step(0.0, distFromHead);
        float tail = (1.0 - (distFromHead / streamLen)) * inStream;
        tail = pow(clamp(tail, 0.0, 1.0), 1.5);
        float glitchTime = floor(u_time * 1.5 + hash(cellID) * 10.0);
        float charSeed = hash(cellID + vec2(glitchTime * 0.05, colHash));
        float charIdx = floor(charSeed * 16.0);
        vec2 fontUV = vec2((cellUV.x + charIdx) / 16.0, cellUV.y);
        float charTex = texture2D(u_fontTexture, fontUV).a;
        vec3 col = mix(u_colorMain * tail * 1.3, vec3(0.95, 1.0, 0.95), head);
        float alpha = charTex * (head * 2.2 + tail * 1.0) * alphaMult;
        return vec4(col * alpha, alpha);
    }

    void main() {
        vec2 st = gl_FragCoord.xy / u_res.xy;
        vec4 layer1 = renderMatrixLayer(st, vec2(0.0, 0.0), 1.0, 1.0, 1.0);
        vec2 shiftOffset = vec2(0.0077, 0.015);
        vec4 layer2 = renderMatrixLayer(st, shiftOffset, 0.65, 1.25, 0.45);
        vec3 finalCol = layer1.rgb + layer2.rgb * (1.0 - layer1.a * 0.5);
        float finalAlpha = clamp(layer1.a + layer2.a, 0.0, 1.0);
        gl_FragColor = vec4(finalCol, finalAlpha);
    }`;

    function shader(type, src) {
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(s));
        }
        return s;
    }

    glProgramMatrix = gl.createProgram();
    gl.attachShader(glProgramMatrix, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(glProgramMatrix, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(glProgramMatrix);

    if (!gl.getProgramParameter(glProgramMatrix, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(glProgramMatrix));
        return;
    }

    gl.useProgram(glProgramMatrix);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    let loc = gl.getAttribLocation(glProgramMatrix, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glReadyMatrix = true;
}

let glProgramTunnel = null;
let glReadyTunnel = false;

function tunnelWebGL(k) {
    x.clearRect(0, 0, W, H);
    if (!glReadyTunnel) initTunnelWebGL();

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgramTunnel);

    gl.uniform2f(gl.getUniformLocation(glProgramTunnel, "u_res"), glCanvas.width, glCanvas.height);
    gl.uniform1f(gl.getUniformLocation(glProgramTunnel, "u_time"), (t * 0.001) % 10000.0);

    let c1 = hexToRgbNormalizedFast(tone(0)); 
    let c2 = hexToRgbNormalizedFast(tone(1) || tone(0));

    gl.uniform3f(gl.getUniformLocation(glProgramTunnel, "u_colorMain"), c1[0], c1[1], c1[2]);
    gl.uniform3f(gl.getUniformLocation(glProgramTunnel, "u_colorAccent"), c2[0], c2[1], c2[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initTunnelWebGL() {
    if (glReadyTunnel) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: false });
    }
    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;

    const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    void main() {
        vec2 st = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
        vec2 tunnelOffset = vec2(sin(u_time * 1.2) * 0.85, cos(u_time * 0.9) * 0.45);
        vec2 shiftedSt = st - tunnelOffset;
        float r = length(shiftedSt);             
        float a = atan(shiftedSt.y, shiftedSt.x); 
        r = max(r, 0.0001);
        a += sin(0.2 / r + u_time * 2.0) * 0.15;
        vec2 uv = vec2(1.0 / r + u_time * 2.2, a / 3.14159265);
        vec2 grid = fract(uv * vec2(3.0, 8.0)); 
        vec2 check = step(vec2(0.12), grid) * step(grid, vec2(0.88));
        float pattern = check.x * check.y;
        float colorSwitch = step(0.5, fract(uv.y * 4.0));
        vec3 baseColor = mix(u_colorMain, u_colorAccent, colorSwitch);
        float edgeGlow = smoothstep(0.0, 0.15, grid.x) * smoothstep(1.0, 0.85, grid.x) *
                         smoothstep(0.0, 0.15, grid.y) * smoothstep(1.0, 0.85, grid.y);
        float depthFade = smoothstep(0.0, 0.45, r); 
        vec3 finalColor = mix(baseColor * 1.8, u_colorAccent, 1.0 - edgeGlow) * pattern;
        finalColor *= depthFade;
        float coreLight = pow(clamp(0.04 / r, 0.0, 1.0), 2.0);
        finalColor += u_colorAccent * coreLight;
        gl_FragColor = vec4(finalColor, depthFade);
    }`;

    function shader(type, src) {
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(s));
        }
        return s;
    }

    glProgramTunnel = gl.createProgram();
    gl.attachShader(glProgramTunnel, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(glProgramTunnel, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(glProgramTunnel);

    if (!gl.getProgramParameter(glProgramTunnel, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(glProgramTunnel));
        return;
    }

    gl.useProgram(glProgramTunnel);

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    let loc = gl.getAttribLocation(glProgramTunnel, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glReadyTunnel = true;
}

let glProgramSpectrum = null;
let glReadySpectrum = false;
let glSpectrumBuffer = null; // เพิ่มตัวแปรเก็บ Buffer เพื่อประหยัด CPU/GPU

function spectrumWebGL(k) {
    x.clearRect(0, 0, W, H);
    if (!glReadySpectrum) initSpectrumWebGL();
    if (!glProgramSpectrum) return; // กัน crash ถ้าสร้าง shader ไม่สำเร็จ

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.15, 0.15, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgramSpectrum);

    // Bind Buffer และผูก Attribute ทุกครั้งก่อน Draw ป้องกันภาพค้างจากการสลับ Scene
    gl.bindBuffer(gl.ARRAY_BUFFER, glSpectrumBuffer);
    let loc = gl.getAttribLocation(glProgramSpectrum, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    gl.uniform2f(gl.getUniformLocation(glProgramSpectrum, "u_res"), glCanvas.width, glCanvas.height);
    
    // ใช้ u_time จากค่าสะสม k หรือ t ให้แน่ใจว่าตัวแปร t ส่งค่าขยับตลอดเวลา
    let currentTime = (typeof t !== 'undefined' ? t : performance.now()) * 0.1;
    gl.uniform1f(gl.getUniformLocation(glProgramSpectrum, "u_time"), currentTime % 10000.0);

    let c1 = hexToRgbNormalizedFast(tone(0)); 
    let c2 = hexToRgbNormalizedFast(tone(1) || tone(0));

    gl.uniform3f(gl.getUniformLocation(glProgramSpectrum, "u_colorMain"), c1[0], c1[1], c1[2]);
    gl.uniform3f(gl.getUniformLocation(glProgramSpectrum, "u_colorAccent"), c2[0], c2[1], c2[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initSpectrumWebGL() {
    if (glReadySpectrum) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: false });
    }
    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;

    const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    void main() {
        vec2 st = gl_FragCoord.xy / u_res.xy;
        
        float targetSize = min(u_res.x, u_res.y) > 600.0 ? 45.0 : 30.0;
        vec2 gridCount = max(vec2(1.0), floor(u_res / targetSize));
        
        vec2 cellId = floor(st * gridCount);
        vec2 cellUv = fract(st * gridCount);

        vec2 border = step(vec2(0.06), cellUv) * step(cellUv, vec2(0.94));
        float cellMask = border.x * border.y;

        float time = u_time * 0.8; // เพิ่มความเร็วเวลา
        float mode = mod(floor(time / 8.0), 3.0);

        float val = 0.0;
        if (mode < 0.5) {
            float wave1 = sin(cellId.x * 0.3 + time);
            float wave2 = cos(cellId.y * 0.2 - time);
            val = (wave1 + wave2 + 2.0) / 4.0;
        } else if (mode < 1.5) {
            vec2 center = gridCount * 0.5;
            float dist = length(cellId - center);
            val = (sin(dist * 0.4 - time * 2.0) + 1.0) / 2.0;
        } else {
            val = abs(sin(cellId.x * 0.5 + time) * cos(cellId.y * 0.5 + time));
        }

        float opacity = clamp(val, 0.0, 1.0);
        float colorSwitch = step(0.5, fract((cellId.x + cellId.y) * 0.1));
        vec3 baseColor = mix(u_colorMain, u_colorAccent, colorSwitch);

        float innerGlow = smoothstep(0.2, 0.5, opacity);
        vec3 finalColor = baseColor * (0.6 + innerGlow * 1.2) * cellMask * opacity;

        gl_FragColor = vec4(finalColor, opacity * cellMask);
    }`;

    function shader(type, src) {
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
        }
        return s;
    }

    glProgramSpectrum = gl.createProgram();
    gl.attachShader(glProgramSpectrum, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(glProgramSpectrum, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(glProgramSpectrum);

    if (!gl.getProgramParameter(glProgramSpectrum, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(glProgramSpectrum));
        return;
    }

    // สร้าง Buffer เก็บไว้ครั้งเดียว
    glSpectrumBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glSpectrumBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    glReadySpectrum = true;
}

let glProgramCyberGrid = null;
let glReadyCyberGrid = false;
let glCyberGridBuffer = null;

function cyberGridWebGL(k) {
    x.clearRect(0, 0, W, H);
    if (!glReadyCyberGrid) initCyberGridWebGL();
    if (!glProgramCyberGrid) return;

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.05, 0.05, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgramCyberGrid);

    // Bind Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, glCyberGridBuffer);
    let loc = gl.getAttribLocation(glProgramCyberGrid, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    gl.uniform2f(gl.getUniformLocation(glProgramCyberGrid, "u_res"), glCanvas.width, glCanvas.height);
    
    // ใช้สเกลเวลา 0.1 ที่ไหลลื่นกำลังดี
    let currentTime = (typeof t !== 'undefined' ? t : performance.now()) * 0.1;
    gl.uniform1f(gl.getUniformLocation(glProgramCyberGrid, "u_time"), currentTime % 10000.0);

    let c1 = hexToRgbNormalizedFast(tone(0)); 
    let c2 = hexToRgbNormalizedFast(tone(1) || tone(0));

    gl.uniform3f(gl.getUniformLocation(glProgramCyberGrid, "u_colorMain"), c1[0], c1[1], c1[2]);
    gl.uniform3f(gl.getUniformLocation(glProgramCyberGrid, "u_colorAccent"), c2[0], c2[1], c2[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initCyberGridWebGL() {
    if (glReadyCyberGrid) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: false });
    }
    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }`;
	
	const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    // Pseudo-random helper
    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        // Normalize UV to Center (-1.0 to 1.0)
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

        float horizon = 0.1;
        float fov = 0.8;
        
        vec2 p = uv;
        p.y -= horizon;
        
        // =========================================================
        // ดึงระนาบด้านบนและล่างเข้ามาชนกันตรงกลาง (โดยไม่เปลี่ยนสเกลลึก)
        // =========================================================
        // กำหนดระยะขั้นต่ำของ Y เพื่อไม่ให้มีช่องว่างดำตรงกลาง แต่สเกลมุมมองเท่าเดิม
        float minGap = 0.08; 
        float shiftedY = abs(p.y) + minGap;
        
        // คำนวณความลึก Z-Depth จากพิกัดที่ดึงเข้าหากันแล้ว
        float z = fov / shiftedY;
        vec2 gridUv = vec2(p.x * z, z + u_time * 0.8);

        // Grid & Cell Calculations (เท่าเดิมเป๊ะ)
        vec2 gridCount = vec2(12.0, 12.0);
        vec2 cellId = floor(gridUv * gridCount);
        vec2 cellUv = fract(gridUv * gridCount);

        // เส้นขอบตารางพิกเซล
        // vec2 border = step(vec2(0.08), cellUv) * step(cellUv, vec2(0.92));
        // float cellMask = border.x * border.y;
		float cellMask = 1.0; // บล็อกจะชนกันพอดีโดยไม่มีช่องว่าง

        // Digital Wave & Pulse Activity (เท่าเดิมเป๊ะ)
        float rnd = rand(cellId);
        float pulse = sin(u_time * 2.0 + rnd * 6.28) * 0.5 + 0.5;
        float wave = sin(cellId.y * 0.3 - u_time * 1.5) * cos(cellId.x * 0.3);
        
        float activity = step(0.3, rnd) * (pulse * 0.6 + wave * 0.4);
        activity = clamp(activity, 0.05, 1.0);

        // Color & Depth Fog Fade (เท่าเดิมเป๊ะ)
        float colorSelect = step(0.5, rand(cellId + 1.0));
        vec3 baseColor = mix(u_colorMain, u_colorAccent, colorSelect);

        // คงเอฟเฟกต์แสงหมอกและ Glow แสงเดิมไว้ทั้งหมด
		// เลข 12.0 คือระยะความลึกที่เริ่มมืด:
		// - ปรับเพิ่มเป็น 20.0 หรือ 30.0 = ตารางตรงกลางจะสว่างชัดขึ้น ไม่โดนหมอกสีดำบัง
		// - ปรับลดเหลือ 5.0 = หมอกมืดจะกินพื้นที่สว่างตรงกลางมากขึ้น
        float fog = smoothstep(15.5, 0.0, z);
        float centerGlow = exp(-length(uv - vec2(0.0, horizon)) * 3.0);

        // รวมแสงและสีตามโค้ดแรกสุด
        vec3 finalColor = baseColor * (activity * 1.5) * cellMask;
        finalColor += u_colorAccent * centerGlow * 0.6; 
        finalColor *= fog;

        gl_FragColor = vec4(finalColor, fog);
    }`;
	/*
มีหมอกลอยตรงกกลาง
	const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    // Pseudo-random helper
    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Smooth Noise Function สำหรับสร้างเมฆหมอกนุ่มนวล
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        // Normalize UV to Center (-1.0 to 1.0)
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

        float horizon = 0.1;
        float fov = 0.8;
        
        vec2 p = uv;
        p.y -= horizon;
        
        float z = fov / abs(p.y);
        vec2 gridUv = vec2(p.x * z, z + u_time * 0.8);

        // Grid & Cell Calculations
        vec2 gridCount = vec2(12.0, 12.0);
        vec2 cellId = floor(gridUv * gridCount);
        vec2 cellUv = fract(gridUv * gridCount);

        vec2 border = step(vec2(0.08), cellUv) * step(cellUv, vec2(0.92));
        float cellMask = border.x * border.y;

        // Digital Wave & Pulse Activity
        float rnd = rand(cellId);
        float pulse = sin(u_time * 2.0 + rnd * 6.28) * 0.5 + 0.5;
        float wave = sin(cellId.y * 0.3 - u_time * 1.5) * cos(cellId.x * 0.3);
        
        float activity = step(0.3, rnd) * (pulse * 0.6 + wave * 0.4);
        activity = clamp(activity, 0.05, 1.0);

        float colorSelect = step(0.5, rand(cellId + 1.0));
        vec3 baseColor = mix(u_colorMain, u_colorAccent, colorSelect);

        // Fog ละลายไปกับเส้นขอบฟ้า
        float fog = smoothstep(12.0, 0.0, z);

        // =========================================================
        // เมฆ/หมอกเคลื่อนที่จากซ้ายไปขวา (Horizontal Moving Fog)
        // =========================================================
        // สเกลตำแหน่งหมอกให้อยู่เฉพาะตรงขอบฟ้า
        vec2 fogUv = vec2(uv.x * 1.2 - u_time * 0.12, uv.y * 1.8); 
    
		float fogNoise = noise(fogUv * 2.0) * 0.5 + noise(fogUv * 4.0) * 0.5;
		
		// คืนค่ารัศมีการฟุ้งกระจายของหมอกไว้เท่าเดิม (3.5)
		float fogMask = exp(-abs(uv.y - horizon) * 3.5); 
		
		// ลดตัวคูณความเข้มลงเหลือเพียง 0.25 (จางลงมาก แต่พื้นที่ครอบคลุมเท่าเดิม)
		vec3 fogColor = mix(u_colorAccent, u_colorMain, fogNoise) * fogNoise * fogMask * 0.25;

        // รวมแสงทั้งหมด
        vec3 finalColor = baseColor * (activity * 1.5) * cellMask * fog;
        finalColor += fogColor; // เพิ่มชั้นหมอกเลื่อนลงไปตรงกลาง

        gl_FragColor = vec4(finalColor, max(fog, fogMask * fogNoise));
    }`;
default มีช่องมืดตรงกลาง
    const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    // Pseudo-random helper
    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        // Normalize UV to Center (-1.0 to 1.0)
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

        // 1. Perspective Grid Projection (สร้างมิติมุมมองพุ่งเข้าหาจอ)
        float horizon = 0.1;
        float fov = 0.8;
        
        // แยกส่วนพื้นทางเดินข้างล่างกับเพดานข้างบน
        vec2 p = uv;
        p.y -= horizon;
        
        // คำนวณความลึก (Z-Depth)
        float z = fov / abs(p.y);
        vec2 gridUv = vec2(p.x * z, z + u_time * 0.8); // เคลื่อนที่พุ่งไปข้างหน้า

        // 2. Grid & Cell Calculations
        vec2 gridCount = vec2(12.0, 12.0);
        vec2 cellId = floor(gridUv * gridCount);
        vec2 cellUv = fract(gridUv * gridCount);

        // เส้นขอบตารางพิกเซล
        vec2 border = step(vec2(0.08), cellUv) * step(cellUv, vec2(0.92));
        float cellMask = border.x * border.y;

        // 3. Digital Wave & Pulse Activity (สร้างเอฟเฟกต์ไฟวิ่งบนตึก/ตาราง)
        float rnd = rand(cellId);
        float pulse = sin(u_time * 2.0 + rnd * 6.28) * 0.5 + 0.5;
        float wave = sin(cellId.y * 0.3 - u_time * 1.5) * cos(cellId.x * 0.3);
        
        float activity = step(0.3, rnd) * (pulse * 0.6 + wave * 0.4);
        activity = clamp(activity, 0.05, 1.0);

        // 4. Color & Depth Fog Fade
        float colorSelect = step(0.5, rand(cellId + 1.0));
        vec3 baseColor = mix(u_colorMain, u_colorAccent, colorSelect);

        // Fog ละลายไปกับเส้นขอบฟ้า (Horizon Fog)
        float fog = smoothstep(12.0, 0.0, z);

        // แสง Glow จากกึ่งกลางขอบฟ้า (Horizon Core Glow)
        float centerGlow = exp(-length(uv - vec2(0.0, horizon)) * 3.0);

        // รวมแสงและสีทั้งหมด
        vec3 finalColor = baseColor * (activity * 1.5) * cellMask;
        finalColor += u_colorAccent * centerGlow * 0.6; // ใส่ไฟสว่างตรงขอบฟ้า
        finalColor *= fog;

        gl_FragColor = vec4(finalColor, fog);
    }`;
	
ไม่มีช่องตรงกลาง
	const fs = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    // Pseudo-random helper
    float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        // Normalize UV to Center (-1.0 to 1.0)
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

        // 1. Perspective Grid Projection
        float horizon = 0.1;
        float fov = 0.8;
        
        vec2 p = uv;
        p.y -= horizon;
        
        // ป้องกันค่า division by zero บริเวณเส้นแนวนอนพอดี
        float safeY = sign(p.y) * max(abs(p.y), 0.001);
        float z = fov / abs(safeY);
        vec2 gridUv = vec2(p.x * z, z + u_time * 0.8);

        // 2. Grid & Cell Calculations
        vec2 gridCount = vec2(12.0, 12.0);
        vec2 cellId = floor(gridUv * gridCount);
        vec2 cellUv = fract(gridUv * gridCount);

        // เส้นขอบตารางพิกเซล
        vec2 border = step(vec2(0.08), cellUv) * step(cellUv, vec2(0.92));
        float cellMask = border.x * border.y;

        // 3. Digital Wave & Pulse Activity
        float rnd = rand(cellId);
        float pulse = sin(u_time * 2.0 + rnd * 6.28) * 0.5 + 0.5;
        float wave = sin(cellId.y * 0.3 - u_time * 1.5) * cos(cellId.x * 0.3);
        
        float activity = step(0.3, rnd) * (pulse * 0.6 + wave * 0.4);
        activity = clamp(activity, 0.05, 1.0);

        // 4. Color Selection
        float colorSelect = step(0.5, rand(cellId + 1.0));
        vec3 baseColor = mix(u_colorMain, u_colorAccent, colorSelect);

        // รวมแสงและสีทั้งหมด (ตัด fog มืดตรงกลางออก เพื่อให้ตารางชนชิดติดกันพอดี)
        vec3 finalColor = baseColor * (activity * 1.5) * cellMask;

        gl_FragColor = vec4(finalColor, 1.0);
    }`;
*/
    function shader(type, src) {
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
        }
        return s;
    }

    glProgramCyberGrid = gl.createProgram();
    gl.attachShader(glProgramCyberGrid, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(glProgramCyberGrid, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(glProgramCyberGrid);

    if (!gl.getProgramParameter(glProgramCyberGrid, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(glProgramCyberGrid));
        return;
    }

    glCyberGridBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glCyberGridBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    glReadyCyberGrid = true;
}

// --- Centralized Scene Registry ---
const scenes = { 
    inkBubblesWebGL: { category: "webgl", type: "webgl", title: "INK BUBBLES [WebGL]", init: initInkWebGL, glSceneName: "inkWebGL", render: (k) => inkBubblesWebGL(k) }, 
    nebulaWebGL:     { category: "webgl", type: "webgl", title: "COSMIC NEBULA[WebGL]", init: initNebulaWebGL, glSceneName: "nebulaWebGL", render: (k) => nebulaWebGL(k) }, 
    matrixWebGL:     { category: "webgl", type: "webgl", title: "Matrix [WebGL]", init: initMatrixWebGL, glSceneName: "matrixWebGL", render: (k) => matrixWebGL(k) }, 
    tunnelWebGL:     { category: "webgl", type: "webgl", title: "Tunnel [WebGL]", init: initTunnelWebGL, glSceneName: "tunnelWebGL", render: (k) => tunnelWebGL(k) }, 
    spectrumWebGL:   { category: "webgl", type: "webgl", title: "Spectrum Matrix [WebGL]", init: initSpectrumWebGL, glSceneName: "spectrumWebGL", render: (k) => spectrumWebGL(k) }, 
    cyberGridWebGL:   { category: "webgl", type: "webgl", title: "Cyber City Grid [WebGL]", init: initCyberGridWebGL, glSceneName: "cyberGridWebGL", render: (k) => cyberGridWebGL(k) }, 

    tv_clock:      { category: "tv", type: "canvas", title: "TV FLIP CLOCK [60FPS]", render: () => tv_clock() }, 
    tv_stars:      { category: "tv", type: "canvas", title: "TV COSMIC STAR WARP [60FPS]", render: (k) => tv_stars(k) }, 
    tv_matrix:     { category: "tv", type: "canvas", title: "TV OPTIMIZED MATRIX [60FPS]", render: (k) => tv_matrix(k) }, 
    tv_matrix2:    { category: "tv", type: "canvas", title: "TV OPTIMIZED MATRIX 2 [60FPS]", render: (k) => tv_matrix2() },
    tv_grid:       { category: "tv", type: "canvas", title: "TV GRID PULSE [60FPS]", render: (k) => tv_grid(k) }, 
    tv_grid2:      { category: "tv", type: "canvas", title: "TV GRID PULSE WAVE [60FPS]", render: (k) => tv_grid2(k) }, 
	tv_grid_tetris:{ category: "tv", type: "canvas", title: "TV TETRIS [60FPS]", render: (k) => tv_grid_tetris(k) },
	tv_grid_tetris2:{ category: "tv", type: "canvas", title: "TV TETRIS 2[60FPS]", render: (k) => tv_grid_tetris2(k) },
	tv_grid_spectrum:{ category: "tv", type: "canvas", title: "TV GRID SPECTRUM [60FPS]", render: (k) => tv_grid_spectrum(k) },
    tv_blobs:      { category: "tv", type: "canvas", title: "TV NEON FLUID BLOBS [60FPS]", render: (k) => tv_blobs(k) }, 
    tv_dvd:        { category: "tv", type: "canvas", title: "TV RETRO DVD DRIFT [60FPS]", render: (k) => tv_dvd(k) }, 
    tv_inkBubbles: { category: "tv", type: "canvas", title: "TV FLOATING BUBBLES", render: (k) => tv_inkBubbles(k) }, 

    matrix:    { category: "pc", type: "canvas", title: "MATRIX FLOW", render: (k) => matrix(k) }, 
    matrix2:   { category: "pc", type: "canvas", title: "AUTHENTIC MATRIX", render: (k) => matrix2(k) }, 
    stars:     { category: "pc", type: "canvas", title: "STARFIELD", render: (k) => stars(k) }, 
    fire:      { category: "pc", type: "canvas", title: "FIREPLACE EMBER", render: (k) => fire(k) }, 
    rain:      { category: "pc", type: "canvas", title: "RAIN ON GLASS", render: (k) => rain(k) }, 
    aurora:    { category: "pc", type: "canvas", title: "AURORA", render: (k) => blobs(k) }, 
    ink:       { category: "pc", type: "canvas", title: "FLUID INK", render: (k) => blobs(k, true) }, 
    ink2:      { category: "pc", type: "canvas", title: "FLUID INK BUBBLES", render: (k) => inkBubbles(k) }, 
    dvd:       { category: "pc", type: "canvas", title: "RETRO DVD", render: (k) => dvd(k) }, 
    clock:     { category: "pc", type: "canvas", title: "DIGITAL CLOCK", render: () => clock() }, 
    grid:      { category: "pc", type: "canvas", title: "CYBER GRID", render: () => grid() }, 
    network:   { category: "pc", type: "canvas", title: "PARTICLE NETWORK", render: (k) => network(k) }, 
    terminal:  { category: "pc", type: "canvas", title: "CODE TERMINAL", render: () => terminal() }, 
    hello:     { category: "pc", type: "canvas", title: "HELLO WORLD", render: (k) => hello(k) }, 
    fireflies: { category: "pc", type: "canvas", title: "FIREFLIES", render: (k) => fireflies(k) }, 
    bubbles:   { category: "pc", type: "canvas", title: "FLOATING BUBBLES", render: (k) => bubbles(k) }, 
    mesh:      { category: "pc", type: "canvas", title: "LOW POLY MESH", render: (k) => mesh(k) }, 
    sakura:    { category: "pc", type: "canvas", title: "SAKURA", render: (k) => fall(k, 'sakura') }, 
    sakura2:   { category: "pc", type: "canvas", title: "SAKURA 2", render: (k) => fall2(k) },
    snow:      { category: "pc", type: "canvas", title: "SNOW", render: (k) => fall(k, 'snow') },  
    snow2:     { category: "pc", type: "canvas", title: "SNOW 2", render: (k) => fall2(k) },
    storm:     { category: "pc", type: "canvas", title: "STORM RAIN", render: (k) => fall(k, 'storm') },	
    storm2:    { category: "pc", type: "canvas", title: "STORM RAIN 2", render: (k) => fall(k, 'storm2') }, 
    fireworks: { category: "pc", type: "canvas", title: "Fireworks", render: (k) => fireworks(k) }, 
    plasma:    { category: "pc", type: "canvas", title: "PLASMA", render: () => plasma() }, 
    smoke:     { category: "pc", type: "canvas", title: "SMOKE", render: (k) => smoke(k) }, 
    confetti:  { category: "pc", type: "canvas", title: "CONFETTI", render: (k) => fall(k, 'confetti') }, 
    confetti2: { category: "pc", type: "canvas", title: "CONFETTI 2", render: (k) => fall2(k) },
    synthwave: { category: "pc", type: "canvas", title: "RETRO SYNTHWAVE", render: (k) => synthwave(k) } 
};

function renderSceneOptions() {
    const meta = {
        webgl: { group: document.getElementById('group-webgl'), icon: '🧮 ' },
        tv:    { group: document.getElementById('group-tv'), icon: '📺 ' },
        pc:    { group: document.getElementById('group-pc'), icon: '💻' }
    };

    const counters = { webgl: 1, tv: 1, pc: 1 };
	
    Object.values(meta).forEach(m => {
        if (m.group) m.group.innerHTML = '';
    });

    Object.keys(scenes).forEach((key) => {
        const item = scenes[key];
        const category = item.category || 'pc';
        const targetGroup = meta[category]?.group;

        if (targetGroup) {
            const numStr = String(counters[category]++).padStart(2, '0');
            const icon = meta[category].icon;
            
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `${icon}${numStr} - ${item.title}`;
            
            targetGroup.appendChild(opt);
        }
    });

    const sceneSelect = document.getElementById('scene');
    const savedScene = localStorage.getItem('screenScene') || scene;

    if (sceneSelect && savedScene && scenes[savedScene]) {
        sceneSelect.value = savedScene;
    }
}

function pick(v) {
    const sc = scenes[v] ? v : 'tv_clock';
    scene = sc;

    const currentSceneObj = scenes[sc];

    if ($('scene')) $('scene').value = sc;
    if ($('sceneTitle')) $('sceneTitle').textContent = currentSceneObj?.title || sc.toUpperCase();
    localStorage.screenScene = sc;

    if (currentSceneObj && currentSceneObj.type === "webgl") {
        glCanvas.classList.add("active");

        const targetGlScene = sc;
        if (glScene !== targetGlScene) {
            if (typeof currentSceneObj.init === 'function') {
                currentSceneObj.init();
            }
            glScene = targetGlScene;
        }

        if (gl) {
            gl.viewport(0, 0, glCanvas.width, glCanvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
    } else {
        if (gl) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        glCanvas.classList.remove("active");
    }

    reset();
    fallSetup();
}

function loop(now) {
    let k = Math.min(2.5, (now - last || 16) / 16) * +$('speed').value;
    last = now;
    t += k;
	
    fpsFrames++;
    if (now - fpsLast >= 1000) {
        fps = fpsFrames;
        fpsFrames = 0;
        fpsLast = now;

        const fpsBox = $('fpsCounter');
        if (fpsBox) {
            fpsBox.textContent = `FPS ${fps}`;
        }
    }

    const currentScene = scenes[scene] || scenes['tv_clock'];
    if (currentScene && typeof currentScene.render === 'function') {
        currentScene.render(k);
    }

    requestAnimationFrame(loop);
}

function setAccentColor(newColor) {
    color = newColor;
    localStorage.screenColor = newColor;

    theme = 'normal';
    localStorage.screenTheme = 'normal';

    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.value = 'normal';
    }

    const colorPicker = document.getElementById('colorPicker');
    const colorText = document.getElementById('colorText');
    if (colorPicker) colorPicker.value = newColor;
    if (colorText) colorText.value = newColor.toUpperCase();

    updateThemeColors();
}

function setColor(v) {
    if (!/^#[\da-f]{6}$/i.test(v)) return;
    color = v.toUpperCase();
    if ($('colorPicker')) $('colorPicker').value = color;
    if ($('colorText')) $('colorText').value = color;
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-rgb', rgb(color));
    localStorage.screenColor = color;
    document.querySelectorAll('.swatch').forEach(b => b.classList.toggle('active', b.dataset.color === color));
}

// Fixed ReferenceError by querying actual palettes/categories instead of missing randomThemes
function rotateRandomTheme() {
    let pool = [];

    if (theme.startsWith('random_')) {
        const catName = theme.replace('random_', '');
        pool = paletteCategories[catName] || [];
    } else {
        pool = Object.keys(palettes);
    }

    const choices = pool.filter(name => name !== activeRandomTheme);
    const selectedPool = choices.length > 0 ? choices : pool;

    activeRandomTheme = selectedPool[Math.floor(Math.random() * selectedPool.length)];
    localStorage.screenActiveRandomTheme = activeRandomTheme;
    setColor(tone());
}

function updateRandom3Colors() {
    const new3Colors = [
        getRandomHexColor(),
        getRandomHexColor(),
        getRandomHexColor()
    ];
    palettes.random3Colors = new3Colors;
    setColor(new3Colors[0]);
}

function resize() {
    let isTvScene = scene.startsWith('tv_');
    let d = isTvScene ? 1 : Math.min(devicePixelRatio, 2);
    W = innerWidth;
    H = innerHeight;
    glCanvas.width  = (W * 0.5) | 0;
    glCanvas.height = (H * 0.5) | 0;
    c.width = W * d;
    c.height = H * d;
    x.setTransform(d, 0, 0, d, 0, 0);
    reset();
    fallSetup();
}

// Binds & Controls
if ($('sound')) {
    $('sound').value = localStorage.screenSound || '';
    $('sound').onchange = e => handleSingleSelect(e.target.value);
}

if ($('theme')) {
    $('theme').value = theme;
    $('theme').onchange = e => {
        theme = e.target.value;
        localStorage.screenTheme = theme;

        if (theme === 'random3Colors') {
            updateRandom3Colors();
        } else if (theme.startsWith('random')) {
            rotateRandomTheme();
        } else if (palettes[theme]) {
            setColor(tone());
        }
        reset();
        fallSetup();
    };
}

if ($('colorPicker')) {
    $('colorPicker').oninput = e => {
        theme = 'normal';
        if ($('theme')) $('theme').value = theme;
        setColor(e.target.value);
    };
}

if ($('colorText')) {
    $('colorText').onchange = e => {
        theme = 'normal';
        if ($('theme')) $('theme').value = theme;
        setColor(e.target.value);
    };
}

if ($('scene')) $('scene').onchange = e => pick(e.target.value);
if ($('speed')) {
    $('speed').oninput = () => {
        if ($('speedValue')) $('speedValue').textContent = `${+$('speed').value}×`;
    };
}

if ($('density')) {
    $('density').oninput = () => {
        let n = +$('density').value;
        if ($('densityValue')) $('densityValue').textContent = n < 19 ? 'High' : n > 32 ? 'Low' : 'Normal';
        reset();
        fallSetup();
    };
}

document.querySelectorAll('.swatch').forEach(b => b.onclick = () => {
    theme = 'normal';
    if ($('theme')) $('theme').value = theme;
    setColor(b.dataset.color);
});

if ($('toggle')) {
    $('toggle').onclick = e => {
        let p = $('panel');
        if (p) {
            p.classList.toggle('collapsed');
            e.target.textContent = p.classList.contains('collapsed') ? '+' : '−';
        }
    };
}

function setControlsHidden(hidden) {
    document.body.classList.toggle('hidden-ui', hidden);

    const button = $('uiVisibilityToggle');
    if (button) {
        button.textContent = hidden ? 'SHOW CONTROLS' : 'HIDE CONTROLS';
        button.setAttribute('aria-pressed', String(hidden));
        button.setAttribute('aria-label', hidden ? 'Show controls' : 'Hide controls');
    }

    const fpsBox = $('fpsCounter');
    if (fpsBox) {
        fpsBox.style.display = hidden ? 'none' : 'block';
    }

    localStorage.screenControlsHidden = hidden ? '1' : '';
}

function toggleControls() {
    setControlsHidden(!document.body.classList.contains('hidden-ui'));
}

if ($('uiVisibilityToggle')) $('uiVisibilityToggle').onclick = toggleControls;

function getSceneValues() {
    return Array.from($('scene').options).map(o => o.value).filter(Boolean);
}

function nextScene(direction) {
    const list = getSceneValues();
    const idx = list.indexOf(scene);
    let newIdx = (idx + direction + list.length) % list.length;
    pick(list[newIdx]);
}

function remoteItems() {
    const panelCollapsed = $('panel')?.classList.contains('collapsed');
    const items = [$('toggle')].filter(Boolean);
    if (!panelCollapsed) items.push($('scene'), $('theme'), $('sound'), $('speed'), $('density'), ...document.querySelectorAll('.swatch'));
    if ($('uiVisibilityToggle')) items.push($('uiVisibilityToggle'));
    return items.filter(Boolean);
}

function focusRemoteItem(index) {
    const items = remoteItems();
    if (items.length === 0) return;
    const item = items[(index + items.length) % items.length];
    document.querySelectorAll('.remote-focus').forEach(el => el.classList.remove('remote-focus'));
    item.classList.add('remote-focus');
    item.focus({ preventScroll: true });
    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function currentRemoteIndex() {
    const items = remoteItems();
    const index = items.indexOf(document.activeElement);
    return index < 0 ? 0 : index;
}

function changeSelect(select, direction) {
    if (!select) return;
    const options = Array.from(select.options).filter(option => !option.disabled);
    const index = options.findIndex(option => option.value === select.value);
    select.value = options[(index + direction + options.length) % options.length].value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
}

function changeRange(input, direction) {
    if (!input) return;
    const step = Number(input.step) || 1;
    const value = Math.max(Number(input.min), Math.min(Number(input.max), Number(input.value) + step * direction));
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

function adjustRemoteItem(direction) {
    const item = document.activeElement;
    if (item === $('scene')) nextScene(direction);
    else if (item === $('theme') || item === $('sound')) changeSelect(item, direction);
    else if (item === $('speed') || item === $('density')) changeRange(item, direction);
    else if (item && item.classList.contains('swatch')) {
        const swatches = Array.from(document.querySelectorAll('.swatch'));
        const index = swatches.indexOf(item);
        const next = swatches[(index + direction + swatches.length) % swatches.length];
        if (next) {
            next.click();
            focusRemoteItem(remoteItems().indexOf(next));
        }
    }
}

function remoteKey(e) {
    const code = e.keyCode || e.which;
    if (['ArrowUp', 'Up'].includes(e.key) || code === 38) return 'up';
    if (['ArrowDown', 'Down'].includes(e.key) || code === 40) return 'down';
    if (['ArrowLeft', 'Left'].includes(e.key) || code === 37) return 'left';
    if (['ArrowRight', 'Right'].includes(e.key) || code === 39) return 'right';
    if (['Enter', 'Select', 'Accept', 'NumpadEnter'].includes(e.key) || [13, 23, 66].includes(code)) return 'ok';
    if (['Escape', 'Back', 'BrowserBack', 'GoBack', 'XF86Back'].includes(e.key) || [4, 27, 166, 461, 661, 10009].includes(code)) return 'back';
    return '';
}

document.onkeydown = e => {
    if (e.key === 'h' || e.key === 'H') {
        toggleControls();
        return;
    }
    if (e.key === 'f' || e.key === 'F') {
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        return;
    }

    const key = remoteKey(e);
    if (!key) return;
    const hidden = document.body.classList.contains('hidden-ui');

    if (hidden) {
        if (key !== 'back') {
            setControlsHidden(false);
            focusRemoteItem(0);
        }
        e.preventDefault();
        return;
    }

    if (key === 'back') {
        setControlsHidden(true);
    } else if (key === 'up') {
        focusRemoteItem(currentRemoteIndex() - 1);
    } else if (key === 'down') {
        focusRemoteItem(currentRemoteIndex() + 1);
    } else if (key === 'left') {
        adjustRemoteItem(-1);
    } else if (key === 'right') {
        adjustRemoteItem(1);
    } else if (key === 'ok') {
        const item = document.activeElement;
        if (item === $('toggle') || item === $('uiVisibilityToggle')) item.click();
    }
    e.preventDefault();
};

// Application Startup Initialization
setColor(palettes[theme] || theme === 'randomTheme' ? tone() : color);
if (localStorage.screenControlsHidden === '1') setControlsHidden(true);
pick(scene);
resize();
onresize = resize;
requestAnimationFrame(loop);