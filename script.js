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
	/*
const sounds = {rain:'mp3/light-rain.mp3',waves:'mp3/ocean-waves.mp3',birds:'mp3/rainy-with-birds.mp3',mood:'mp3/Rainy-Mood.m4a'}, audio = new Audio();
audio.loop = true;
function setSound(v) { localStorage.screenSound = v; audio.pause(); if (!v) return audio.removeAttribute('src'); audio.src = sounds[v]; audio.play().catch(() => {}) }
*/
/* อัพเดท 0.1 มีมัลติ
// 1. กำหนดเสียงโดยเปลี่ยนค่าบางตัวเป็น Array ของไฟล์สั้นๆ (0.5 - 1.5 MB รวมกัน)
const soundGroups = {
    rain: [{
        src: 'mp3/light-rain.mp3',
        volume: 1
    }], // เล่น 3 เสียงพร้อมกัน
    waves: [{
        src: 'mp3/ocean-waves.mp3',
        volume: 1
    }], // เสียงเดี่ยวแบบเดิมก็ยังใช้ได้
    birds: [{
        src: 'mp3/rainy-with-birds.mp3',
        volume: 1
    }],
    mood: [{
        src: 'mp3/Rainy-Mood.m4a',
        volume: 1
    }],
    theFall: [{
            src: 'mp3/theFall/0a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/1a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/2a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/3a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/4a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/5a.ogg',
            volume: 0.3
        }, 
		{
            src: 'mp3/theFall/6a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/7a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/theFall/8a.ogg',
            volume: 0.3
        }, 
		{
            src: 'mp3/theFall/9a.ogg',
            volume: 0.3
        }
    ],
	japGarden: [{
            src: 'mp3/japGarden/0a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/1a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/2a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/3a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/4a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/5a.ogg',
            volume: 0.3
        }, 
		{
            src: 'mp3/japGarden/6a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/7a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/japGarden/8a.ogg',
            volume: 0.3
        }, 
		{
            src: 'mp3/japGarden/9a.ogg',
            volume: 0.3
        }
    ],
	singingBowl: [{
            src: 'mp3/singingBowl/0a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/1a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/2a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/3a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/4a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/5a.ogg',
            volume: 0.3
        }, 
		{
            src: 'mp3/singingBowl/6a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/7a.ogg',
            volume: 0.3
        },
        {
            src: 'mp3/singingBowl/8a.ogg',
            volume: 0.3
        }, 
		{
            src: 'mp3/singingBowl/9a.ogg',
            volume: 0.3
        }
    ]
};

// 2. ตัวแปรเก็บรายการ Audio Elements ที่กำลังเล่นอยู่
let activeAudios = [];

function setSound(v) {
  localStorage.screenSound = v;

  // หยุดและล้างเสียงเดิมที่กำลังเล่นอยู่ทั้งหมด
  activeAudios.forEach(a => a.pause());
  activeAudios = [];

  if (!v || !soundGroups[v]) return;

  // แปลงให้เป็น Array เสมอ (เพื่อรองรับทั้งแบบไฟล์เดียว และหลายไฟล์)
  //const files = Array.isArray(soundGroups[v]) ? soundGroups[v] : [soundGroups[v]];

  // สร้าง Audio element และสั่งเล่นพร้อมกันทุกไฟล์ในชุด
  soundGroups[v].forEach(item => {
    const a = new Audio(item.src);
    a.loop = true;
    a.volume = item.volume ?? 1.0; // กำหนดความดัง (ถ้าไม่ตั้งไว้ จะใช้ 1.0)
    a.play().catch(() => {});
    activeAudios.push(a);
  });
}*/
// 1. Config เก็บข้อมูลเสียงทั้งหมด
const soundConfig = {
  // --- เสียงเดี่ยว ( Single Track ) ---
  //rain:  { type: 'single', title: 'Light rain', src: 'mp3/light-rain.mp3', volume: 1.0 },
  //waves: { type: 'single', title: 'Ocean waves', src: 'mp3/ocean-waves.mp3', volume: 1.0 },
  //birds: { type: 'single', title: 'Rain with birds', src: 'mp3/rainy-with-birds.mp3', volume: 1.0 },
  //mood:  { type: 'single', title: 'Rainy mood', src: 'mp3/Rainy-Mood.m4a', volume: 1.0 },

  // --- เสียงมัลติแทร็ก ( Multi Track ) ---
  rain: {
    type: 'multi',
	title: 'Rain',
    folder: 'mp3/rain/',
    volume: 1.0, // Master Volume รวมของเสียงนี้ 0.0-1.0
    defaultMode: 'natural',
    modes: {
	  natural: {
		  title: 'Natural',
		  levels: [18.18, 28.28, 36.36, 51.52, 59.6, 54.55, 36.36, 27.27, 17.17, 6.06]
		},
      Brown: {
		  title: 'Brown',
		  levels: [62.12, 57.17, 52.22, 47.17, 42.22, 37.27, 33.54, 29.8, 26.06, 22.32]
		},
	  pink: {
		  title: 'Pink',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		},
		white: {
		  title: 'White',
		  levels: [22.12, 26.26, 30.4, 34.55, 37.27, 42.83, 48.28, 52.42, 57.98, 62.12]
		},
		speechBlocker: {
		  title: 'Speech Blocker',
		  levels: [18.89, 29.7, 37.78, 54.04, 62.12, 56.77, 37.78, 28.38, 17.58, 6.77]
		},
		fairyRain: {
		  title: 'Fairy Rain',
		  levels: [0, 0, 0, 0, 19.6, 29.39, 39.29, 49.09, 58.89, 68.69]
		},
		bedroom: {
		  title: 'Bedroom',
		  levels: [0, 0, 0, 22.83, 51.82, 62.12, 51.82, 31.11, 14.55, 0]
		},
		jungleLodge: {
		  title: 'Jungle Lodge',
		  levels: [75.76, 0, 31.52, 0, 44.14, 0, 44.14, 0, 31.52, 0]
		}
    }
  },
  theFall: {
    type: 'multi',
	title: 'The Fall',
    folder: 'mp3/theFall/',
    volume: 1.0, // Master Volume รวมของเสียงนี้ 0.0-1.0
    defaultMode: 'natural',
    modes: {
		natural: {
		  title: 'Natural',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		}, // % จาก myNoise
		WhiteNoisy: {
		  title: 'WhiteNoisy',
		  levels: [57.07, 0, 57.07, 57.07, 0, 57.07, 57.07, 0, 0, 0]
		  },
		Watery: {
		  title: 'Watery',
		  levels: [0, 62.12, 0, 0, 0, 0, 0, 62.12, 62.12, 0]
		  },
		majestic: {
		  title: 'Majestic',
		  levels: [75.76, 60.61, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 30.3, 15.15]
		},
		gigantic: {
		  title: 'Gigantic',
		  levels: [68.69, 43.74, 56.16, 0, 0, 0, 0, 0, 0, 0]
		},
		fresh: {
		  title: 'Fresh',
		  levels: [0, 18.99, 38.08, 57.07, 57.07, 57.07, 57.07, 57.07, 38.08, 18.99]
		},
		sparkling: {
		  title: 'Sparkling',
		  levels: [0, 0, 18.89, 37.88, 37.88, 37.88, 37.88, 37.88, 56.77, 75.76]
		},
		distant: {
		  title: 'Distant',
		  levels: [0, 0, 0, 0, 75.76, 56.77, 37.88, 0, 0, 0]
		},
		closeFall: {
		  title: 'CloseFall',
		  levels: [0, 0, 0, 0, 37.88, 56.77, 75.76, 0, 0, 0]
		}
    }
  },

  japGarden: {
    type: 'multi',
	title: 'Japanese Garden',
    folder: 'mp3/japGarden/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural:  {
		  title: 'Natural',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		}, // ถ้าไม่ใส่ % จะคิดที่ 100% เต็มทุกช่อง
		Wildlife:  {
		  title: 'Wildlife',
		  levels: [56.57, 0, 0, 56.57, 56.57, 56.57, 0, 0, 0, 0]
	    },
		DistantWaterfall:  {
		  title: 'DistantWaterfall',
		  levels: [75.76, 0, 0, 0, 0, 0, 53.03, 0, 0, 0]
		},
		ShishiOdoshi: {
		  title: 'Shishi Odoshi',
		  levels: [0, 0, 0, 0, 0, 0, 43.33, 75.76, 0, 0]
		},
		bambooGarden: {
		  title: 'Bamboo Garden',
		  levels: [0, 60.61, 75.76, 45.45, 60.61, 0, 0, 0, 0, 0]
		},
		japaneseSummer: {
		  title: 'Japanese Summer',
		  levels: [0, 0, 0, 0, 45.45, 45.45, 0, 0, 75.76, 0]
		},
		quietude: {
		  title: 'Quietude',
		  levels: [0, 0, 0, 0, 0, 0, 60.61, 0, 0, 75.76]
		},
		lonelyBird: {
		  title: 'Lonely Bird',
		  levels: [0, 0, 53.03, 45.45, 0, 75.76, 60.61, 60.61, 0, 0]
		}
    }
  },

  singingBowl: {
    type: 'multi',
	title: 'Singing Bowls',
    folder: 'mp3/singingBowl/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural:  {
		  title: 'Natural',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		}
    }
  },
  unrealOcean: {
    type: 'multi',
	title: 'Unreal Ocean',
    folder: 'mp3/unrealOcean/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural: {
		  title: 'Natural',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		},
		brown: {
		  title: 'Brown',
		  levels: [62.12, 57.17, 52.22, 47.17, 42.22, 37.27, 33.54, 29.8, 26.06, 22.32]
		},
		pink: {
		  title: 'Pink',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		},
		white: {
		  title: 'White',
		  levels: [22.12, 26.26, 30.4, 34.55, 37.27, 42.83, 48.28, 52.42, 57.98, 62.12]
		},
		speechBlocker: {
		  title: 'Speech Blocker',
		  levels: [18.89, 29.7, 37.78, 54.04, 62.12, 56.77, 37.78, 28.38, 17.58, 6.77]
		},
		distantShore: {
		  title: 'Distant Shore',
		  levels: [0, 18.89, 37.88, 56.77, 75.76, 56.77, 37.88, 18.89, 0, 0]
		},
		closetotheWater: {
		  title: 'Close to the Water',
		  levels: [0, 53.84, 0, 22.93, 35.05, 45.76, 56.57, 49.8, 39.09, 31.01]
		},
		homebytheSea: {
		  title: 'Home by the Sea',
		  levels: [0, 0, 0, 34.34, 68.69, 34.34, 68.69, 34.34, 0, 0]
		},
		rainyShore: {
		  title: 'Rainy Shore',
		  levels: [0, 0, 37.88, 56.77, 37.88, 56.77, 56.77, 56.77, 75.76, 56.77]
		},
		underwater: {
		  title: 'Underwater',
		  levels: [0, 53.03, 0, 75.76, 37.88, 0, 0, 0, 0, 0]
		}
	}
  },
  stormyWeather: {
    type: 'multi',
	title: 'Stormy Weather',
    folder: 'mp3/stormyWeather/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural:  {
		  title: 'Natural',
		  levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22]
		},
		stormWinds: {
		  title: 'Storm Winds',
		  levels: [68.69, 68.69, 0, 0, 0, 0, 0, 0, 0, 0]
		},
		porchRain: {
		  title: 'Porch Rain',
		  levels: [0, 0, 62.12, 0, 0, 0, 0, 62.12, 62.12, 0]
		},
		distantThunder: {
		  title: 'Distant Thunder',
		  levels: [0, 0, 0, 62.12, 62.12, 62.12, 0, 0, 0, 0]
		},
		calmRain: {
		  title: 'Calm Rain',
		  levels: [0, 0, 0, 0, 0, 0, 75.76, 60.61, 45.45, 0]
		},
		sizzlingRain: {
		  title: 'Sizzling Rain',
		  levels: [0, 0, 0, 0, 0, 0, 0, 45.45, 60.61, 75.76]
		}
	}
  },
  calmLake: {
    type: 'multi',
	title: 'Calm Lake',
    folder: 'mp3/calmLake/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural: {
		  title: 'Natural',
		  levels: [54.34, 54.34, 23.33, 23.33, 23.33, 0, 0, 62.12, 23.33, 23.33]
		},
		ambience: {
		  title: 'Ambience',
		  levels: [0, 0, 68.69, 68.69, 0, 0, 0, 0, 0, 0]
		},
		kissUs: {
		  title: 'Kiss Us',
		  levels: [25.76, 0, 17.17, 68.69, 68.69, 0, 0, 0, 0, 0]
		},
		canoeSnipes: {
		  title: 'Canoe & Snipes',
		  levels: [51.52, 68.69, 0, 0, 0, 68.69, 0, 0, 0, 0]
		},
		snipesLapwings: {
		  title: 'Snipes & Lapwings',
		  levels: [34.34, 0, 0, 0, 0, 68.69, 68.69, 0, 0, 0]
		},
		midnightLoon: {
		  title: 'Midnight Loon',
		  levels: [33.64, 0, 0, 0, 33.64, 0, 0, 0, 75.76, 0]
		},
		loonCalls: {
		  title: 'Loon Calls',
		  levels: [34.34, 0, 0, 0, 0, 0, 0, 68.69, 68.69, 0]
		},
		windyLake: {
		  title: 'Windy Lake',
		  levels: [61.01, 22.93, 0, 0, 0, 0, 0, 22.93, 22.93, 68.69]
		}
	}
  },
  distantThunder: {
    type: 'multi',
	title: 'Distant Thunder',
    folder: 'mp3/distantThunder/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural:  {
		  title: 'Natural',
		  levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22]
		},
		stillDry: {
		  title: 'Still Dry',
		  levels: [57.07, 57.07, 57.07, 57.07, 57.07, 0, 0, 0, 0, 0]
		},
		firstDrops: {
		  title: 'First Drops',
		  levels: [57.07, 0, 57.07, 0, 57.07, 57.07, 0, 57.07, 0, 0]
		},
		gettingWet: {
		  title: 'Getting Wet',
		  levels: [0, 51.52, 0, 51.52, 51.52, 51.52, 45.05, 45.05, 38.59, 25.76]
		},
		calmStorm: {
		  title: 'Calm Storm',
		  levels: [62.12, 43.43, 43.43, 43.43, 43.43, 43.43, 49.7, 55.86, 55.86, 43.43]
		},
		summerRain: {
		  title: 'Summer Rain',
		  levels: [51.52, 51.52, 51.52, 0, 0, 0, 0, 51.52, 51.52, 51.52]
		},
		almostGone: {
		  title: 'Almost Gone',
		  levels: [0, 56.57, 0, 0, 56.57, 0, 0, 28.28, 49.49, 49.49]
		}
	}
  },
  healingWater: {
    type: 'multi',
	title: 'Healing Water',
    folder: 'mp3/healingWater/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural:  {
		  title: 'Natural',
		  levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22]
		},
		earlyMorning: {
		  title: 'Early Morning',
		  levels: [0, 56.77, 47.37, 0, 0, 0, 0, 0, 0, 75.76]
		},
		cascade: {
		  title: 'Cascade',
		  levels: [0, 62.12, 54.34, 0, 54.34, 0, 0, 0, 0, 0]
		},
		creek: {
		  title: 'Creek',
		  levels: [0, 0, 0, 51.52, 60.1, 0, 68.69, 0, 0, 0]
		},
		babblingBrook: {
		  title: 'Babbling Brook',
		  levels: [0, 0, 0, 0, 0, 0, 37.78, 60.1, 68.69, 0]
		},
		almostUnreal: {
		  title: 'Almost Unreal',
		  levels: [0, 0, 0, 0, 0, 0, 0, 0, 75.76, 56.77]
		},
		calming: {
		  title: 'Calming',
		  levels: [0, 54.55, 0, 68.69, 0, 0, 56.57, 0, 0, 0]
		},
		walkwithMe: {
		  title: 'Walk with Me',
		  levels: [75.76, 31.82, 25.66, 0, 36.67, 0, 29.29, 0, 0, 24.44]
		},
		woodenBridges: {
		  title: 'Wooden Bridges',
		  levels: [75.76, 21.01, 25.25, 0, 0, 0, 0, 0, 0, 0]
		}
	}
  },

  rainOnTent: {
    type: 'multi',
	title: 'Rain On Tent',
    folder: 'mp3/rainOnTent/',
    volume: 1.0,
    defaultMode: 'natural',
    modes: {
		natural:  {
		  title: 'Natural',
		  levels: [43.43, 56.57, 51.52, 46.46, 41.41, 52.53, 33.33, 29.29, 25.25, 22.22]
		},
		covered:  {
		  title: 'Covered',
		  levels: [0,0,0,43.13,0,68.69,0,58.89,0,0]
		},
		LastDrops:  {
		  title: 'LastDrops',
		  levels: [0, 0, 43.33, 75.76, 43.33, 0, 0, 0, 0, 0]
		},
		brown: {
		  title: 'Brown',
		  levels: [62.12, 57.17, 52.22, 47.17, 42.22, 37.27, 33.54, 29.8, 26.06, 22.32]
		},
		pink: {
		  title: 'Pink',
		  levels: [45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45, 45.45]
		},
		White:  {
		  title: 'White',
		  levels: [22.12, 26.26, 30.4, 34.55, 37.27, 42.83, 48.28, 52.42, 57.98, 62.12]
		},
		speechBlocker: {
		  title: 'Speech Blocker',
		  levels: [18.89, 29.7, 37.78, 54.04, 62.12, 56.77, 37.78, 28.38, 17.58, 6.77]
		},
		lightRain: {
		  title: 'Light Rain',
		  levels: [0, 0, 0, 0, 20.71, 32.02, 41.41, 52.73, 62.12, 52.73]
		},
		lullingRain: {
		  title: 'Lulling Rain',
		  levels: [0, 0, 0, 22.63, 52.73, 62.12, 52.73, 32.02, 15.05, 0]
		},
		steadyRain: {
		  title: 'Steady Rain',
		  levels: [37.68, 37.68, 56.57, 0, 56.57, 0, 56.57, 0, 56.57, 37.68]
		},
		RainyDay:  {
		  title: 'RainyDay',
		  levels: [68.69, 38.18, 24.44, 48.89, 61.01, 50.4, 42.73, 38.18, 35.15, 35.15]
		},
		bytheRiver: {
		  title: 'By the River',
		  levels: [0, 75.76, 52.73, 32.42, 14.85, 0, 0, 20.3, 20.3, 0]
		},
		jungleOvernight: {
		  title: 'Jungle Overnight',
		  levels: [75.76, 0, 31.52, 0, 44.14, 31.52, 44.14, 0, 31.52, 0]
		}
    }
  }
};

// 2. ตัวแปรเก็บรายการ Audio Elements ที่กำลังเล่นอยู่
let activeAudios = [];

// ฟังก์ชั่นแปลง % (0-100) เป็น Volume (0.0 - 1.0) แบบเนียนเป็นธรรมชาติ
function pctToVol(pct) {
  if (pct <= 0) return 0;
  return Math.pow(pct / 100, 2); 
}

// 3. ฟังก์ชั่นสั่งเล่นเสียง (รองรับทั้ง single, multi และการส่ง mode ย่อย)
function setSound(v, mode = null) {
  //localStorage.screenSound = v;
  // บันทึกค่าที่จะนำไปใช้กับ <select> โดยตรง
  const fullValue = mode ? `${v}:${mode}` : v;
  localStorage.screenSound = fullValue || '';
  // หยุดและล้างเสียงเดิมทั้งหมด
  activeAudios.forEach(a => a.pause());
  activeAudios = [];
    
  if (mode) localStorage.screenSoundMode = mode;
  
  const sound = soundConfig[v];
  if (!v || !sound) return;

  // --- Case A: แบบเสียงเดี่ยว (Single) ---
  if (sound.type === 'single') {
    const a = new Audio(sound.src);
	localStorage.screenSound = v || '';
    a.loop = true;
    a.volume = sound.volume ?? 1.0;
    a.play().catch(() => {});
    activeAudios.push(a);
  } 

  // --- Case B: แบบมัลติแทร็ก (Multi 10 ช่อง) ---
  else if (sound.type === 'multi') {
    const selectedMode = mode || sound.defaultMode || 'natural';
	const modeData = sound.modes?.[selectedMode];
	const percentages = modeData?.levels || modeData || [];
    //const percentages = sound.modes?.[selectedMode] || [];
    const masterVol = sound.volume ?? 1.0;

    // สร้างวนลูป 0 ถึง 9 อัตโนมัติ (ไม่ต้องเขียน 0a.ogg ถึง 9a.ogg เองให้เมื่อย)
    for (let i = 0; i < 10; i++) {
      const src = `${sound.folder}${i}a.ogg`;
      const a = new Audio(src);
      a.loop = true;

      // ความดัง = (เปอร์เซ็นต์ของช่อง i) x (Master Volume)
      const trackPct = percentages[i] !== undefined ? percentages[i] : 100;
      a.volume = pctToVol(trackPct) * masterVol;

      a.play().catch(() => {});
      activeAudios.push(a);
    }
  }
}
function handleSingleSelect(compositeValue) {
  // แยกค่าด้วยเครื่องหมาย : เช่น "theFall:lulling" -> ["theFall", "lulling"]
  const [soundKey, modeKey] = compositeValue.split(':');
  
  // เรียกใช้ setSound ตามปกติ
  setSound(soundKey, modeKey || compositeValue);
}
function renderSoundOptions() {
  const selectEl = document.getElementById('sound');
  
  // 1. เคลียร์ค่าเดิมและใส่ "No sound" เป็นตัวแรก
  selectEl.innerHTML = '<option value="">No sound</option>';

  // 2. วนลูปสร้าง Option ตาม config
  Object.keys(soundConfig).forEach(key => {
    const item = soundConfig[key];

    if (item.type === 'single') {
      // --- เสียงเดี่ยว: สร้าง <option> ปกติ ---
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = item.title;
      selectEl.appendChild(opt);

    } else if (item.type === 'multi') {
      // --- เสียงมัลติ: สร้าง <optgroup> แล้วใส่โหมดย่อยลงไป ---
      const group = document.createElement('optgroup');
      group.label = item.title;

      Object.keys(item.modes).forEach(modeKey => {
        const mode = item.modes[modeKey];
        const opt = document.createElement('option');
        opt.value = `${key}:${modeKey}`; // e.g. "theFall:natural"
        opt.textContent = item.title+" ("+mode.title+")" || `${item.title} (${modeKey})`;
        group.appendChild(opt);
      });

      selectEl.appendChild(group);
    }
  });
}

// เรียกใช้งานฟังก์ชันทันทีตอนโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
  renderSoundOptions();
  
  // ดึงค่าเดิมที่เคยเลือกไว้กลับมาแสดง
  const savedSound = localStorage.screenSound || '';
  const soundSelect = document.getElementById('sound');
  
  // เช็กว่าค่ายังอยู่ในลิสต์ไหม ถ้าอยู่ค่อยใส่ค่า
  if (Array.from(soundSelect.options).some(opt => opt.value === savedSound)) {
    soundSelect.value = savedSound;
  } else {
    soundSelect.value = '';
  }
  
  // สั่งเล่นเสียงตามปกติ
  const [soundKey, modeKey] = soundSelect.value.split(':');
  setSound(soundKey, modeKey);
});
const palettes = {
    neon: ['#36F76D', '#35D7FF', '#C77DFF'],
    ocean: ['#32D9FF', '#147DFF', '#A6FFFF'],
    sunset: ['#FF4D7D', '#FF9D40', '#FFE17D'],
    violet: ['#C77DFF', '#765CFF', '#FF92D0'],
    mono: ['#F3F7F4', '#AABAB0', '#617168'],
    ice: ['#E8FAFF', '#77D9FF', '#4D7CFF'],
    forest: ['#B7F34A', '#32A852', '#0B5D3B'],
    candy: ['#FF7EB6', '#FFB86B', '#8F7CFF'],
    gold: ['#FFF1A8', '#FFC14D', '#D88416'],
    lava: ['#FFDD57', '#FF6B35', '#C1121F'],
    pastel: ['#A8E6CF', '#FFD3B6', '#FFAAA5'],
	cyberpunk: ['#FF0055', '#7B2CBF', '#00F5FF'],
    midnight:  ['#001219', '#005F73', '#0A9396'],
    deepspace: ['#1A1A2E', '#16213E', '#0F3460'],
    vampire:   ['#0D0D0D', '#800020', '#E63946'],
    synthdark: ['#2B0B3F', '#521262', '#FF007F'],
    abyss:     ['#081C15', '#1B4332', '#40916C'],
    toxin:     ['#0B090A', '#161A1D', '#52B788'],
    voids:      ['#181823', '#537188', '#CBB279']
};

const baseColors = ['#36F76D', '#35D7FF', '#C77DFF', '#FF4D7D', '#FFB347'],
    randomThemes = ['neon', 'ocean', 'sunset', 'violet', 'ice', 'forest', 'candy', 'gold', 'lava','cyberpunk','midnight','deepspace','vampire','synthdark','abyss','toxin','voids'],
	paletteCategories = {
		dark: ['cyberpunk', 'midnight', 'deepspace', 'vampire', 'synthdark', 'abyss', 'toxin', 'voids'],
		light: ['pastel', 'mono', 'ice'],
		neon: ['neon', 'ocean', 'violet', 'candy'],
		warm: ['sunset', 'gold', 'lava', 'forest']
	},
    chars = 'アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%#&_()[]{}<>!';
let activeRandomTheme = localStorage.screenActiveRandomTheme || randomThemes[0];

const tone = (i = 0) => {
        let isRandomPal = theme === 'randomTheme' || theme.startsWith('random_');
        let p = palettes[isRandomPal ? activeRandomTheme : theme] || [color];
        return p[i % p.length]
    },
    rgb = h => {
        let n = parseInt(h.slice(1), 16);
        return `${n>>16},${n>>8&255},${n&255}`
    },
    R = (a, b) => a + Math.random() * (b - a),
    bg = a => {
        x.globalCompositeOperation = 'source-over';
        x.fillStyle = `rgba(2,4,3,${a})`;
        x.fillRect(0, 0, W, H)
    },
    dot = (a, b, r, f = tone()) => {
        x.fillStyle = f;
        x.beginPath();
        x.arc(a, b, r, 0, TAU);
        x.fill()
    },
    count = n => Math.max(20, W / n | 0);
	
const darkTone = (hex, p = 20) =>
    "#" + hex.slice(1).match(/../g)
        .map(c => Math.max(0, parseInt(c, 16) * (100 - p) / 100 | 0)
        .toString(16).padStart(2, "0"))
        .join("");

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
        drop: Array.from({
            length: q
        }, () => Math.random() * -H / 16),
        star: Array.from({
            length: Math.min(1400, Math.max(700, q * 32))
        }, () => ({
            x: (Math.random() - .5) * W,
            y: (Math.random() - .5) * H,
            z: Math.random() * W
        })),
        p: particles,
        b: Array.from({
            length: 9
        }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: R(35, 160),
            vx: R(-.6, .6),
            vy: R(-.6, .6),
            p: R(0, TAU),
            c: Math.random() * 3 | 0
        })),
        d: {
            x: W * .4,
            y: H * .4,
            vx: 2,
            vy: 1.5
        },
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
        tv_dvd: {
            x: W * 0.3,
            y: H * 0.3,
            vx: 2.5,
            vy: 1.8,
            c: 0
        }
    }
}

function fallSetup() {
	const newStyleScenes = ['sakura2', 'snow2', 'confetti2'];

    // ถ้าเป็นฉากในกลุ่มระบบใหม่
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
    }))
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
        colorIndex: Math.floor(Math.random() * 3) // สุ่มดึงสี Theme
    }));
}

// ==========================================
// SCENE DRAWING FUNCTIONS (Canvas 2D & WebGL)
// ==========================================

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

    // 1. เช็คว่า W และ H มีขนาดจริงหรือไม่ ถ้ายังไม่มีให้ดึงค่าจาก Canvas
    const width = W || (x.canvas ? x.canvas.width : 0);
    const height = H || (x.canvas ? x.canvas.height : 0);

    if (width === 0 || height === 0) return; // กันการทำงานถ้าจอยังไม่พร้อม

    const cols = Math.floor(width / 20) || 1;

    // 2. ถ้า drops ยังไม่มี หรือจำนวนคอลัมน์เปลี่ยน ให้สุ่มตำแหน่ง Y กระจายทั่วจอทันที (ไม่เริ่มที่ 0 ทั้งหมด)
    if (typeof drops === 'undefined' || !Array.isArray(drops) || drops.length !== cols) {
        window.drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -100)); 
    }

    // 3. วาดพื้นหลังดำจางๆ
    x.fillStyle = "rgba(0, 0, 0, 0.05)";
    x.fillRect(0, 0, width, height);

    // 4. ตั้งค่าตัวอักษร
    x.fillStyle = tone();
    x.font = "18px monospace";
    x.textBaseline = "top"; // ช่วยให้พิกัด Y คำนวณง่ายขึ้น ไม่จมขอบบน

    // 5. วาดตัวอักษร
    drops.forEach((y, i) => {
        const text = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
        
        // วาดเฉพาะตัวที่ลงมาจากขอบบนแล้ว
        if (y > 0) {
            x.fillText(text, i * 20, y);
        }

        // เช็คขอบล่างเพื่อรีเซ็ตกลับไปข้างบน
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

    // เคลียร์พื้นหลังแบบสร้าง Trail จางๆ
    x.fillStyle = "rgba(0, 0, 0, 0.1)";
    x.fillRect(0, 0, width, height);

    // กำหนด Array สำหรับเก็บชิ้นส่วนพลุใน S (ถ้ายังไม่มี)
    if (!S.fireworkList) S.fireworkList = [];

    // สุ่มจุดพลุใหม่ (โอกาส 5% ต่อเฟรม)
    if (Math.random() < 0.10) {
        const cx = Math.random() * width;
        //const cy = (Math.random() * height) / 2; // จุดพลุเฉพาะช่วงครึ่งบนของจอ
		const cy = Math.random() * height; // ✅ สุ่มตำแหน่ง Y ตั้งแต่ขอบบนสุดถึงขอบล่างสุด
        
        // ใช้สีสุ่ม หรือเปลี่ยนเป็น tone() ถ้าอยากให้ใช้สี Theme
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

    // อัปเดตตำแหน่ง วาด และคัดแยกชิ้นส่วนที่ยังไม่หมดอายุ (ลบตัวที่ life <= 0 ออกแบบปลอดภัย)
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
            return true; // เก็บไว้ต่อ
        }
        return false; // ตัวที่หมดอายุจะถูกกรองออก
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
        x.fillRect(X, Y, Math.max(.5, a * 3), Math.max(.5, a * 3))
    });
    x.globalAlpha = 1;
    x.shadowBlur = 0
}

function fire(k) {
    bg(.18);
    x.fillStyle = `rgba(${rgb(color)},.6)`;
    S.p.forEach(p => {
        p.y -= k * (1 + Math.random() * 3);
        p.x += Math.sin(p.y * .04) * k;
        if (p.y < -12) {
            p.y = H + Math.random() * H * .1;
            p.x = Math.random() * W
        }
        dot(p.x, p.y, 1 + Math.random() * 2, x.fillStyle)
    })
}

function rain(k, storm = false) {
    bg(storm ? .28 : .15);
    x.strokeStyle = `rgba(${rgb(tone())},.7)`;
    S.p.forEach(p => {
        p.y += k * (storm ? 35 : 15);
        p.x -= k * (storm ? 6 : 2);
        if (p.y > H) {
            p.y = -30;
            p.x = Math.random() * W
        }
        x.lineWidth = storm ? 1.5 : 1;
        x.beginPath();
        x.moveTo(p.x, p.y);
        x.lineTo(p.x - (storm ? 12 : 5), p.y + (storm ? 55 : 22));
        x.stroke();
        if (storm && Math.random() < .006) {
            x.fillStyle = '#eff';
            x.fillRect(p.x - 2, H - 3, 5, 2)
        }
    })
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
        x.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2)
    });
    x.globalCompositeOperation = 'source-over'
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
    
    // 🎯 ล็อกจุดอ้างอิงตัวอักษรให้อยู่กึ่งกลางแนวตั้ง
    x.font = 'bold 28px sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle'; 
    x.fillText('DVD', d.x + 145 / 2, d.y + 60 / 2); // ให้อยู่กึ่งกลางกล่องพอดี (y + 30)
}

function clock() {
    bg(.15);
    let d = new Date();
    
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic'; // 🎯 รีเซ็ต Baseline แนวตั้งให้ชัวร์
    x.fillStyle = color;
    x.shadowColor = color;
    x.shadowBlur = 20;
    
    x.font = `${Math.min(W * .16, 155)}px monospace`;
    x.fillText(d.toLocaleTimeString(), W / 2, H / 2);
    
    x.shadowBlur = 0; // ล้างค่าเงา
    x.fillStyle = '#aab6ac';
    x.font = '15px monospace';
    x.fillText(d.toDateString(), W / 2, H / 2 + 48);
}
/*
function grid() {
    bg(.18);
    let h = H * .5,
        a = tone(),
        r = Math.hypot(W, H);
    x.save();
    x.beginPath();
    x.rect(0, 0, W, h);
    x.clip();
    x.fillStyle = '#020403';
    x.fillRect(0, 0, W, h);
    for (let i = 0; i < 16; i++)
        if (i % 2) {
            let p = (i / 16) * TAU + t * .0015;
            x.fillStyle = `rgba(${rgb(a)},.42)`;
            x.beginPath();
            x.moveTo(W / 2, h);
            x.lineTo(W / 2 + Math.cos(p - .12) * r, h + Math.sin(p - .12) * r);
            x.lineTo(W / 2 + Math.cos(p + .12) * r, h + Math.sin(p + .12) * r);
            x.fill()
        } x.restore();
    x.strokeStyle = `rgba(${rgb(a)},.48)`;
    for (let i = -18; i < 19; i++) {
        x.beginPath();
        x.moveTo(W / 2 + i * W * .04, h);
        x.lineTo(W / 2 + i * W * .15, H);
        x.stroke()
    }
    let flow = (t * .012) % 1;
    for (let i = 0; i < 14; i++) {
        let p = ((i / 14) + flow) % 1,
            y = h + (H - h) * p * p;
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke()
    }
    x.fillStyle = a;
    x.shadowColor = a;
    x.shadowBlur = 18;
    x.beginPath();
    x.arc(W / 2, h, Math.min(W, H) * .12, 0, TAU);
    x.fill();
    x.shadowBlur = 0
}*/
function grid() {
    bg(.18);
    let cx = W / 2,      // จุดศูนย์กลางแนว X (กลางจอ)
        cy = H / 2,      // จุดศูนย์กลางแนว Y (กลางจอ)
        a = tone(),
        r = Math.hypot(W, H); // รัศมีครอบคลุมจนพ้นขอบจอ

    // ☀️ วาด Sunburst (รัศมีหมุน) เต็ม 360 องศา
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

    // 🔴 วาดดวงอาทิตย์ไว้ตรงกลาง
    x.fillStyle = a;
    x.shadowColor = a;
    x.shadowBlur = 18;
    x.beginPath();
    x.arc(cx, cy, Math.min(W, H) * .12, 0, TAU);
    x.fill();
    x.shadowBlur = 0;
}
/* sun มีกระพริบ
function grid() {
    bg(.18);
    let cx = W / 2,
        cy = H / 2,
        a = tone(),
        r = Math.hypot(W, H);

    // ☀️ วาด Sunburst (รัศมีหมุน)
    // ตรงนี้เราอาจจะอยากให้มันกระพริบตามพระอาทิตย์ด้วย
    for (let i = 0; i < 16; i++) {
        if (i % 2) {
            let p = (i / 16) * TAU + t * .0015;
            // สุ่ม Opacity เล็กน้อยให้แสงรัศมีดูไม่นิ่ง
            let burstAlpha = .35 + Math.random() * .15; 
            x.fillStyle = `rgba(${rgb(a)},${burstAlpha})`;
            x.beginPath();
            x.moveTo(cx, cy);
            x.lineTo(cx + Math.cos(p - .12) * r, cy + Math.sin(p - .12) * r);
            x.lineTo(cx + Math.cos(p + .12) * r, cy + Math.sin(p + .12) * r);
            x.fill();
        }
    }

    // 🔴 ส่วนดวงอาทิตย์ (จุดสำคัญของ Effect นีออนเสีย)
    
    // 1. สร้างตัวแปรสุ่มสถานะการกระพริบ (Neon Flicker Logic)
    let flicker = Math.random();
    let shadowBase = 22;  // ขนาดเงาปกติ
    let currentShadow = 0; // ขนาดเงาในเฟรมนี้
    let currentAlpha = 1;  // ความเข้มสีในเฟรมนี้

    if (flicker < 0.03) {
        // อัตรา 3% สว่างวาบสุดๆ
        currentShadow = shadowBase * 2.5; 
        currentAlpha = 1;
    } else if (flicker < 0.10) {
        // อัตรา 7% ถัดมา ดับเกือบสนิท
        currentShadow = shadowBase * 0.2; 
        currentAlpha = 0.3;
    } else if (flicker < 0.15) {
        // อัตรา 5% ถัดมา สว่างแบบสั่นๆ
        currentShadow = shadowBase + (Math.random() * 8 - 4);
        currentAlpha = 0.9;
    } else {
        // สถานะปกติ 85% ของเวลาทั้งหมด
        currentShadow = shadowBase;
        currentAlpha = 1;
    }

    // 2. ใช้สี Theme 'a' แต่ปรับ Opacity ตามสถานะการกระพริบ
    let finalColor = `rgba(${rgb(a)},${currentAlpha})`;

    // 3. วาดดวงอาทิตย์พร้อมเงากระพริบ
    x.fillStyle = finalColor;
    x.shadowColor = finalColor; // ให้เงาใช้สีเดียวกับตัว
    x.shadowBlur = currentShadow; // ขนาดเงาที่สุ่มได้

    x.beginPath();
    x.arc(cx, cy, Math.min(W, H) * .12, 0, TAU);
    x.fill();
    x.shadowBlur = 0; // รีเซ็ตค่าเสมอ
}*/
function network(k) {
    bg(.14);
    let a = S.p;
    for (let p of a) {
        p.x += p.vx * k * 2;
        p.y += p.vy * k * 2;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1
    }
    for (let i = 0; i < a.length; i++)
        for (let j = i + 1; j < a.length; j++) {
            let q = (a[i].x - a[j].x) ** 2 + (a[i].y - a[j].y) ** 2;
            if (q < 15000) {
                x.strokeStyle = `rgba(${rgb(color)},${.25*(1-q/15000)})`;
                x.beginPath();
                x.moveTo(a[i].x, a[i].y);
                x.lineTo(a[j].x, a[j].y);
                x.stroke()
            }
        }
    x.fillStyle = color;
    a.forEach(p => x.fillRect(p.x, p.y, 3, 3))
}

function terminal() {
    bg(.12);
    x.font = '14px monospace';
    x.fillStyle = color;
    let l = ['> boot sequence ... OK', 'packet transmitted: 0x5F3A', 'system status: ONLINE', 'accessing secure node_', '[##########] 100%', 'root@network:~$ ./run'];
    for (let i = 0; i < 25; i++) x.fillText(l[i % 6], 30, (i * 31 + performance.now() * .04) % (H + 30) - 20)
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
        })
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
        x.restore()
    });
    S.g = S.g.filter(g => g.x > -260);
    x.globalAlpha = 1
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
        dot(p.x, p.y, 2, `rgba(${rgb(color)},${.2+.8*Math.sin(p.p)**2})`)
    });
    x.shadowBlur = 0
}

function bubbles(k) {
    bg(.1);
    S.p.forEach(p => {
        p.y -= p.r * k * .07;
        p.x += Math.sin(t + p.p) * k * .3;
        if (p.y < -p.r) {
            p.y = H + p.r;
            p.x = Math.random() * W
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
        x.stroke()
    })
}

function mesh(k) {
    bg(.16);
    let a = S.p;
    for (let p of a) {
        p.x += p.vx * k;
        p.y += p.vy * k;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1
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
                x.stroke()
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
            p.x = Math.random() * W
        }
        if (type === 'storm') {
            x.strokeStyle = `rgba(${rgb(tone(p.c))},.55)`;
            x.lineWidth = p.r * .12;
            x.beginPath();
            x.moveTo(p.x, p.y);
            x.lineTo(p.x - p.vx * .2, p.y - p.r * 3);
            x.stroke()
        } else if (type === 'storm2') {
            dot(p.x, p.y, p.r * .35, `rgba(${rgb(tone(p.c))},.8)`);
        } else if (type === 'snow2') {
            x.shadowColor = tone(p.c);
            x.shadowBlur = 7;
            dot(p.x, p.y, p.r * .35, `rgba(${rgb(tone(p.c))},.8)`);
            x.shadowBlur = 0
        } else if (type === 'snow') {
            x.shadowColor = '#fff';
            x.shadowBlur = 7;
            dot(p.x, p.y, p.r * .35, '#fff');
            x.shadowBlur = 0
        } else if (type === 'sakura') {
            x.save();
            x.translate(p.x, p.y);
            x.rotate(t + p.p);
            x.fillStyle = 'rgba(255,185,210,.8)';
            x.beginPath();
            x.ellipse(0, 0, p.r * .55, p.r * .3, 0, 0, TAU);
            x.fill();
            x.restore()
        } else {
            x.save();
            x.translate(p.x, p.y);
            x.rotate(t + p.p);
            x.fillStyle = tone(p.c);
            x.fillRect(-p.r / 3, -p.r / 6, p.r * .7, p.r * .35);
            x.restore()
        }
    })
}
function fall2(k) {
    bg(1);
    if (!S.items2) return;

    S.items2.forEach(item => {
        // อัปเดตตำแหน่งและการหมุน
        item.y += item.speedY * k * 0.8;
        item.x += item.speedX * k * 1.5;
        item.rot += item.vRot * k;

        // เมื่อตกเลยขอบล่างให้วนกลับไปข้างบน
        if (item.y > H + item.size) {
            item.y = -item.size;
            item.x = Math.random() * W;
        }

        x.save();
        x.translate(item.x, item.y);
        x.rotate(item.rot);

        // 🎨 แยกวาดตามประเภทฉาก (scene)
        if (scene === 'sakura2') {
            // 🌸 กลีบดอกไม้ (ซากุระ)
            x.fillStyle = '#ffb7c5';
            x.beginPath();
            x.ellipse(0, 0, item.size, item.size / 2, 0, 0, Math.PI * 2);
            x.fill();

        } else if (scene === 'snow2') {
            // ❄️ หิมะ (วงกลมเรืองแสง)
            x.shadowColor = '#fff';
            x.shadowBlur = 6;
            x.fillStyle = 'rgba(255, 255, 255, 0.85)';
            x.beginPath();
            x.arc(0, 0, item.size * 0.4, 0, Math.PI * 2);
            x.fill();

        } else if (scene === 'confetti2') {
            // 🎉 สายรุ้ง/กระดาษโปรย (สี่เหลี่ยมใช้สีตาม Theme)
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
        x.fillRect(px - r, py - r, r * 2, r * 2)
    }
    x.globalCompositeOperation = 'source-over'
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
        x.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2)
    })
}

function tv_clock() {
    bg(.15);
    let d = new Date();
    let shiftX = Math.sin(t * 0.02) * 14;
    let shiftY = Math.cos(t * 0.015) * 10;
    
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic'; // 🎯 บังคับจุดวางตัวอักษรแนวตั้ง
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

/*function tv_grid(k) {
    bg(.18);
    let h = H * 0.52;
    let activeTone = tone();
    
    let sunR = Math.min(W, H) * 0.16;
    let g = x.createLinearGradient(W / 2, h - sunR, W / 2, h);
    g.addColorStop(0, '#FFF1A8');
    g.addColorStop(1, activeTone);
    x.fillStyle = g;
    x.beginPath();
    x.arc(W / 2, h, sunR, 0, TAU);
    x.fill();

    x.strokeStyle = activeTone;
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(0, h);
    x.lineTo(W, h);
    x.stroke();

    x.lineWidth = 1;
    for (let i = -16; i <= 16; i++) {
        x.beginPath();
        x.moveTo(W / 2 + i * (W * 0.025), h);
        x.lineTo(W / 2 + i * (W * 0.14), H);
        x.stroke();
    }

    let flow = (t * 0.015) % 1;
    for (let i = 0; i < 10; i++) {
        let p = ((i / 10) + flow) % 1;
        let y = h + (H - h) * (p * p);
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }
}*/
function tv_grid(k) {
    bg(0.2);

    // 1. ปรับขนาดตารางให้ขยายเต็มชิดขอบทั้ง 4 ด้าน
    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols;
    const cellH = H / rows;
    const totalCells = cols * rows;

    // Initial Setup
    if (!S.tv_grid2 || S.tv_grid2.cols !== cols || S.tv_grid2.rows !== rows) {
        S.tv_grid2 = {
            cols, rows,
            state: 'FILL', // 'FILL', 'HOLD', 'FLASH', 'CLEAR', 'WAIT'
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

    // --------------------------------------------------
    // 2. Logic ควบคุมการ ติด / กระพริบทั้งจอ / ดับ (State Machine)
    // --------------------------------------------------
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

    // --------------------------------------------------
    // 3. วาดกล่องไฟสุ่ม 3 สี (ไม่มีเส้นตาราง)
    // --------------------------------------------------
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let idx = r * cols + c;
            let cell = g.cells[idx];
            
            // 💡 เว้นระยะช่องละ 1.5px เพื่อให้พอเห็นรอยต่อระหว่างกล่องนีออนเวลามันติดสว่างพร้อมกัน
            let gap = 1.5; 
            let cellX = c * cellW + gap;
            let cellY = r * cellH + gap;
            let drawW = cellW - gap * 2;
            let drawH = cellH - gap * 2;

            let cellColor = tone(cell.colorIndex);

            // คำนวณความสว่างตามสถานะ
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

            // วาดบล็อกไฟ
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
let neonFlicker = 1;
let neonFlickerTimer = 0;
function tv_grid2(k) {
    bg(.15);
    let h = H * 0.5;
    let activeTone = tone();
    let flow = (t * 0.015) % 1;

    if (neonFlickerTimer <= 0) {
        if (Math.random() < 0.015) {
            neonFlicker = 0.03 + Math.random() * 0.25;
            neonFlickerTimer = 1 + Math.floor(Math.random() * 4);
        } else {
            neonFlicker = 1;
        }
    } else {
        neonFlickerTimer--;
    }

    const gridAlpha = 0.7 + neonFlicker * 0.3;

    x.save();
    x.globalAlpha = gridAlpha;
    x.strokeStyle = activeTone;
    x.lineWidth = 1;

    for (let i = -18; i <= 18; i++) {
        let topX = W / 2 + i * (W * 0.15);
        let botX = W / 2 + i * (W * 0.15);
        let centerX = W / 2 + i * (W * 0.02);

        x.beginPath();
        x.moveTo(centerX, h);
        x.lineTo(topX, 0);
        x.stroke();

        x.beginPath();
        x.moveTo(centerX, h);
        x.lineTo(botX, H);
        x.stroke();
    }

    for (let i = 0; i < 11; i++) {
        let p = ((i / 11) + flow) % 1;
        let y = h + (H - h) * (p * p);
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    for (let i = 0; i < 11; i++) {
        let p = ((i / 11) + flow) % 1;
        let y = h - h * (p * p);
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    x.restore();

    let shadowG = x.createLinearGradient(0, h - 70, 0, h + 70);
    shadowG.addColorStop(0, 'rgba(2,4,3,0)');
    shadowG.addColorStop(0.35, 'rgba(2,4,3,0.75)');
    shadowG.addColorStop(0.5, 'rgba(2,4,3,0.95)');
    shadowG.addColorStop(0.65, 'rgba(2,4,3,0.75)');
    shadowG.addColorStop(1, 'rgba(2,4,3,0)');

    x.fillStyle = shadowG;
    x.fillRect(0, h - 70, W, 140);

    x.save();
    x.globalAlpha = neonFlicker;
    x.shadowColor = activeTone;
    x.shadowBlur = 30 * neonFlicker;

    x.strokeStyle = activeTone;
    x.lineWidth = 3;

    x.beginPath();
    x.moveTo(0, h);
    x.lineTo(W, h);
    x.stroke();

    x.shadowBlur = 15 * neonFlicker;
    x.lineWidth = 1;

    x.beginPath();
    x.moveTo(0, h - 2);
    x.lineTo(W, h - 2);
    x.moveTo(0, h + 2);
    x.lineTo(W, h + 2);
    x.stroke();

    x.restore();
}*/
function tv_grid2(k) {
    bg(0.2);

    // 🎯 1. ปรับขนาดตารางให้ขยายเต็มชิดขอบทั้ง 4 ด้านพอดี
    const targetSize = Math.min(W, H) > 600 ? 50 : 35;
    const cols = Math.max(1, Math.round(W / targetSize));
    const rows = Math.max(1, Math.round(H / targetSize));
    const cellW = W / cols; // คำนวณความกว้างช่องให้พอดีขอบ W
    const cellH = H / rows; // คำนวณความสูงช่องให้พอดีขอบ H
    const totalCells = cols * rows;

    // Initial Setup
    if (!S.tv_grid2 || S.tv_grid2.cols !== cols || S.tv_grid2.rows !== rows) {
        S.tv_grid2 = {
            cols, rows,
            state: 'FILL', // 'FILL', 'HOLD', 'FLASH', 'CLEAR', 'WAIT'
            cells: Array.from({ length: totalCells }, () => ({
                active: false,
                flickering: false,
                flickerTimer: 0,
                opacity: 0,
                // 🎯 สุ่มสี 1 ใน 3 สีของ Theme ไว้ประจำช่อง
                colorIndex: Math.floor(Math.random() * 3) 
            })),
            timer: 0,
            flashTimer: 0,
            gridAlpha: 0.3
        };
    }

    let g = S.tv_grid2;

    // --------------------------------------------------
    // 2. Logic ควบคุมการ ติด / กระพริบทั้งจอ / ดับ (State Machine)
    // --------------------------------------------------
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
        // ติดครบแล้ว ค้างไว้ 240 เฟรม (ใช้อัตรา k เพื่อรองรับจอ 144Hz/240Hz ให้เวลาเท่ากัน)
        if (g.timer > 240) { 
            g.state = 'FLASH'; // 🎯 ย้ายไปกระพริบพร้อมกันทั้งจอก่อนดับ
            g.timer = 0;
            g.flashTimer = 0;
        }
    } else if (g.state === 'FLASH') {
        // 🎯 กระพริบพร้อมกันทั้งจอประมาณ 25 เฟรม
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
            // 🎯 ก่อนเริ่มรอบใหม่ สุ่มเปลี่ยนสีของแต่ละช่องใหม่ให้หลากหลายขึ้น
            g.cells.forEach(c => c.colorIndex = Math.floor(Math.random() * 3));
            g.state = 'FILL';
            g.timer = 0;
        }
    }

    // --------------------------------------------------
    // 3. วาดเส้นตาราง (Grid Lines) ชิดขอบ 4 ด้าน
    // --------------------------------------------------
    let themeMainColor = tone(0); // ใช้สีหลักวาดตาราง

    if (Math.random() < 0.08) {
        g.gridAlpha = Math.random() < 0.3 ? 0.05 : 0.45;
    } else {
        g.gridAlpha += (0.25 - g.gridAlpha) * 0.1;
    }

    x.strokeStyle = `rgba(${rgb(themeMainColor)}, ${g.gridAlpha})`;
    x.lineWidth = 3; //1.5

    x.beginPath();
    // เส้นแนวตั้ง (ชิดขอบซ้ายไปขวา)
    for (let c = 0; c <= cols; c++) {
        let lx = c * cellW;
        x.moveTo(lx, 0);
        x.lineTo(lx, H);
    }
    // เส้นแนวนอน (ชิดขอบบนลงล่าง)
    for (let r = 0; r <= rows; r++) {
        let ly = r * cellH;
        x.moveTo(0, ly);
        x.lineTo(W, ly);
    }
    x.stroke();

    // --------------------------------------------------
    // 4. วาดกล่องไฟสุ่ม 3 สี + Effect กระพริบ
    // --------------------------------------------------
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let idx = r * cols + c;
            let cell = g.cells[idx];
            let cellX = c * cellW + 2;
            let cellY = r * cellH + 2;
            let drawW = cellW - 4;
            let drawH = cellH - 4;

            // ดึงสีสุ่ม 1 ใน 3 สีของ Theme ตาม colorIndex ของช่องนั้นๆ
            let cellColor = tone(cell.colorIndex);

            // 🎯 สภาพการกระพริบตอน FLASH (กระพริบพร้อมกันทั้งจอ)
            if (g.state === 'FLASH') {
                cell.opacity = Math.random() < 0.35 ? (Math.random() * 0.9 + 0.1) : 0.05;
            } 
            // สภาพการกระพริบปกติ
            else if (cell.flickering) {
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

            // วาดบล็อกไฟ
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
    
    // 🎯 ล็อกจุดอ้างอิงแนวตั้งให้อยู่ตรงกลางกล่องพอดี
    x.font = 'bold 30px "Space Grotesk", sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle'; 
    x.fillText('TV DVD', d.x + boxW / 2, d.y + boxH / 2); // วางกึ่งกลางกล่อง
}

// ==========================================
// WebGL Init & Render Logic
// ==========================================

let glProgramNebula = null;
let glReadyNebula = false;
function nebulaWebGL(k) {
    x.clearRect(0, 0, W, H);

    if (!glReadyNebula) initNebulaWebGL();

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(glProgramNebula);

    gl.uniform2f(
        gl.getUniformLocation(glProgramNebula, "u_res"),
        glCanvas.width,
        glCanvas.height
    );

    gl.uniform1f(
        gl.getUniformLocation(glProgramNebula, "u_time"),
        t
    );

    const hexToRgbNormalized = (colStr) => {
		if (!colStr) return [0.5, 0.5, 0.5];
		let ctx = document.createElement('canvas').getContext('2d');
		ctx.fillStyle = colStr;
		let hex = ctx.fillStyle;
		
		if (hex.startsWith('#')) {
			let r = Math.pow(parseInt(hex.slice(1, 3), 16) / 255, 2.2);
			let g = Math.pow(parseInt(hex.slice(3, 5), 16) / 255, 2.2);
			let b = Math.pow(parseInt(hex.slice(5, 7), 16) / 255, 2.2);
			return [r, g, b];
		}
		return [0.5, 0.5, 0.5];
	};

    let c1 = hexToRgbNormalized(tone(0));
    let c2 = hexToRgbNormalized(tone(1));
    let c3 = hexToRgbNormalized(tone(2));
    let cols = [...c1, ...c2, ...c3];

    gl.uniform3fv(
        gl.getUniformLocation(glProgramNebula, "colors[0]"),
        new Float32Array(cols)
    );

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initNebulaWebGL(){
    if (glReadyNebula) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            preserveDrawingBuffer: false
        });
    }

    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    varying vec2 v_uv;

    void main(){
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `;

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
    }
    `;

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
        new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]),
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

        arr.push(
            b.x / W,
            1 - b.y / H,
            b.r / 180
        );
    }

    while (arr.length < 24) arr.push(0);

    gl.useProgram(glProgramInkBubbles);

    gl.uniform2f(locRes, glCanvas.width, glCanvas.height);
    gl.uniform1f(locTime, t);
    gl.uniform3fv(locBlobs, new Float32Array(arr));

    const hexToRgb01 = h => {
        let n = parseInt(h.slice(1), 16);
        return [
            ((n >> 16) & 255) / 255,
            ((n >> 8) & 255) / 255,
            (n & 255) / 255
        ];
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
        gl = glCanvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            preserveDrawingBuffer: false
        });
    }

    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos,0.0,1.0);
    }
    `;

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
    }
    `;

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
        new Float32Array([
            -1,-1,
             1,-1,
            -1, 1,
            -1, 1,
             1,-1,
             1, 1
        ]),
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

    gl.uniform2f(
        gl.getUniformLocation(glProgramMatrix, "u_res"),
        glCanvas.width,
        glCanvas.height
    );

    gl.uniform1f(
        gl.getUniformLocation(glProgramMatrix, "u_time"),
        (t * 0.001) % 10000.0
    );

    const hexToRgbNormalized = (colStr) => {
        if (!colStr) return [0.2, 1.0, 0.4];
        let ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = colStr;
        let hex = ctx.fillStyle;
        if (hex.startsWith('#')) {
            return [
                parseInt(hex.slice(1, 3), 16) / 255,
                parseInt(hex.slice(3, 5), 16) / 255,
                parseInt(hex.slice(5, 7), 16) / 255
            ];
        }
        return [0.2, 1.0, 0.4];
    };

    let c1 = hexToRgbNormalized(tone(0)); 
    let c2 = hexToRgbNormalized(tone(1) || tone(0));

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
        gl = glCanvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            preserveDrawingBuffer: false
        });
    }

    if (!gl) return;

    fontTexture = createFontTexture();

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `;

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
    }
    `;

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
        new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]),
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

    gl.uniform2f(
        gl.getUniformLocation(glProgramTunnel, "u_res"),
        glCanvas.width,
        glCanvas.height
    );

    gl.uniform1f(
        gl.getUniformLocation(glProgramTunnel, "u_time"),
        (t * 0.001) % 10000.0
    );

    const hexToRgbNormalized = (colStr) => {
        if (!colStr) return [0.2, 0.8, 1.0];
        let ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = colStr;
        let hex = ctx.fillStyle;
        if (hex.startsWith('#')) {
            return [
                parseInt(hex.slice(1, 3), 16) / 255,
                parseInt(hex.slice(3, 5), 16) / 255,
                parseInt(hex.slice(5, 7), 16) / 255
            ];
        }
        return [0.2, 0.8, 1.0];
    };

    let c1 = hexToRgbNormalized(tone(0)); 
    let c2 = hexToRgbNormalized(tone(1) || tone(0));

    gl.uniform3f(gl.getUniformLocation(glProgramTunnel, "u_colorMain"), c1[0], c1[1], c1[2]);
    gl.uniform3f(gl.getUniformLocation(glProgramTunnel, "u_colorAccent"), c2[0], c2[1], c2[2]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function initTunnelWebGL() {
    if (glReadyTunnel) return;

    if (!gl) {
        gl = glCanvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            preserveDrawingBuffer: false
        });
    }

    if (!gl) return;

    const vs = `
    attribute vec2 a_pos;
    void main(){
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }
    `;

    const fs = `
    precision highp float;

    uniform vec2 u_res;
    uniform float u_time;
    uniform vec3 u_colorMain;
    uniform vec3 u_colorAccent;

    void main() {
        vec2 st = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

        vec2 tunnelOffset = vec2(
            sin(u_time * 1.2) * 0.85,
            cos(u_time * 0.9) * 0.45
        );
        
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
    }
    `;

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
        new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]),
        gl.STATIC_DRAW
    );

    let loc = gl.getAttribLocation(glProgramTunnel, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glReadyTunnel = true;
}

// ==========================================
// CENTRALIZED SCENE REGISTRY
// ==========================================

const scenes = { 
    // --- 🧊 WebGL Optimized Scenes --- 
    inkBubblesWebGL: { type: "webgl", title: "INK BUBBLES [WebGL]", init: initInkWebGL, glSceneName: "ink", render: (k) => inkBubblesWebGL(k) }, 
    nebulaWebGL:     { type: "webgl", title: "COSMIC NEBULA[WebGL]", init: initNebulaWebGL, glSceneName: "nebulaWebGL", render: (k) => nebulaWebGL(k) }, 
    matrixWebGL:     { type: "webgl", title: "Matrix [WebGL]", init: initMatrixWebGL, glSceneName: "matrixWebGL", render: (k) => matrixWebGL(k) }, 
    tunnelWebGL:     { type: "webgl", title: "Tunnel [WebGL]", init: initTunnelWebGL, glSceneName: "tunnelWebGL", render: (k) => tunnelWebGL(k) }, 

    // --- 📺 TV 60FPS Optimized Scenes --- 
    tv_clock:      { type: "canvas", title: "TV FLIP CLOCK [60FPS]", render: () => tv_clock() }, 
    tv_stars:      { type: "canvas", title: "TV COSMIC STAR WARP [60FPS]", render: (k) => tv_stars(k) }, 
    tv_matrix:     { type: "canvas", title: "TV OPTIMIZED MATRIX [60FPS]", render: (k) => tv_matrix(k) }, 
	tv_matrix2:    { type: "canvas", title: "TV OPTIMIZED MATRIX 2 [60FPS]", render: (k) => tv_matrix2() },
    tv_grid:       { type: "canvas", title: "TV CYBERPUNK GRID [60FPS]", render: (k) => tv_grid(k) }, 
    tv_grid2:      { type: "canvas", title: "TV CYBERPUNK GRID MOTION [60FPS]", render: (k) => tv_grid2(k) }, 
    tv_blobs:      { type: "canvas", title: "TV NEON FLUID BLOBS [60FPS]", render: (k) => tv_blobs(k) }, 
    tv_dvd:        { type: "canvas", title: "TV RETRO DVD DRIFT [60FPS]", render: (k) => tv_dvd(k) }, 
    tv_inkBubbles: { type: "canvas", title: "TV FLOATING BUBBLES", render: (k) => tv_inkBubbles(k) }, 

    // --- 💻 PC / Full Graphics Scenes --- 
    matrix:    { type: "canvas", title: "MATRIX FLOW", render: (k) => matrix(k) }, 
    matrix2:   { type: "canvas", title: "AUTHENTIC MATRIX", render: (k) => matrix2(k) }, 
    stars:     { type: "canvas", title: "STARFIELD", render: (k) => stars(k) }, 
    fire:      { type: "canvas", title: "FIREPLACE EMBER", render: (k) => fire(k) }, 
    rain:      { type: "canvas", title: "RAIN ON GLASS", render: (k) => rain(k) }, 
    aurora:    { type: "canvas", title: "AURORA", render: (k) => blobs(k) }, 
    ink:       { type: "canvas", title: "FLUID INK", render: (k) => blobs(k, true) }, 
    ink2:      { type: "canvas", title: "FLUID INK BUBBLES", render: (k) => inkBubbles(k) }, 
    dvd:       { type: "canvas", title: "RETRO DVD", render: (k) => dvd(k) }, 
    clock:     { type: "canvas", title: "DIGITAL CLOCK", render: () => clock() }, 
    grid:      { type: "canvas", title: "CYBER GRID", render: () => grid() }, 
    network:   { type: "canvas", title: "PARTICLE NETWORK", render: (k) => network(k) }, 
    terminal:  { type: "canvas", title: "CODE TERMINAL", render: () => terminal() }, 
    hello:     { type: "canvas", title: "HELLO WORLD", render: (k) => hello(k) }, 
    fireflies: { type: "canvas", title: "FIREFLIES", render: (k) => fireflies(k) }, 
    bubbles:   { type: "canvas", title: "FLOATING BUBBLES", render: (k) => bubbles(k) }, 
    mesh:      { type: "canvas", title: "LOW POLY MESH", render: (k) => mesh(k) }, 
    sakura:    { type: "canvas", title: "SAKURA", render: (k) => fall(k, 'sakura') }, 
	sakura2:   { type: "canvas", title: "SAKURA 2", render: (k) => fall2(k) },
    snow:      { type: "canvas", title: "SNOW", render: (k) => fall(k, 'snow') },  
    snow2:     { type: "canvas", title: "SNOW 2", render: (k) => fall2(k) },
	storm:     { type: "canvas", title: "STORM RAIN", render: (k) => fall(k, 'storm') },	
    storm2:    { type: "canvas", title: "STORM RAIN 2", render: (k) => fall(k, 'storm2') }, 
    fireworks: { type: "canvas", title: "Fireworks", render: (k) => fireworks(k) }, 
    plasma:    { type: "canvas", title: "PLASMA", render: () => plasma() }, 
    smoke:     { type: "canvas", title: "SMOKE", render: (k) => smoke(k) }, 
    confetti:  { type: "canvas", title: "CONFETTI", render: (k) => fall(k, 'confetti') }, 
	confetti2: { type: "canvas", title: "CONFETTI 2", render: (k) => fall2(k) },
    synthwave: { type: "canvas", title: "RETRO SYNTHWAVE", render: (k) => synthwave(k) } 
};

// ==========================================
// REFACTORED CORE FUNCTIONS
// ==========================================

function pick(v) {
    const sc = scenes[v] ? v : 'tv_clock';
    scene = sc;

    const currentSceneObj = scenes[sc];

    $('scene').value = sc;
    $('sceneTitle').textContent = currentSceneObj?.title || sc.toUpperCase();
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

// ==========================================
// CONTROL & EVENT LISTENERS
// ==========================================

function setColor(v) {
    if (!/^#[\da-f]{6}$/i.test(v)) return;
    color = v.toUpperCase();
    $('colorPicker').value = $('colorText').value = color;
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-rgb', rgb(color));
    localStorage.screenColor = color;
    document.querySelectorAll('.swatch').forEach(b => b.classList.toggle('active', b.dataset.color === color))
}

function rotateRandomTheme() {
    let pool = [];

    if (theme.startsWith('random_')) {
        const catName = theme.replace('random_', '');
        pool = paletteCategories[catName] || [];
    }

    if (pool.length === 0) {
        pool = randomThemes;
    }

    const choices = pool.filter(name => name !== activeRandomTheme);
    const selectedPool = choices.length > 0 ? choices : pool;

    activeRandomTheme = selectedPool[selectedPool.length * Math.random() | 0];
    localStorage.screenActiveRandomTheme = activeRandomTheme;
    setColor(tone());
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
    fallSetup()
}

$('sound').value = localStorage.screenSound || '';
$('sound').onchange = e => handleSingleSelect(e.target.value);

$('theme').value = theme;
$('theme').onchange = e => {
    theme = e.target.value;
    localStorage.screenTheme = theme;

    if (theme.startsWith('random')) {
        rotateRandomTheme();
    } else if (palettes[theme]) {
        setColor(tone());
    }
    reset();
    fallSetup();
};

$('colorPicker').oninput = e => {
    theme = 'normal';
    $('theme').value = theme;
    setColor(e.target.value)
};
$('colorText').onchange = e => {
    theme = 'normal';
    $('theme').value = theme;
    setColor(e.target.value)
};
$('scene').onchange = e => pick(e.target.value);
$('speed').oninput = () => $('speedValue').textContent = `${+$('speed').value}×`;
$('density').oninput = () => {
    let n = +$('density').value;
    $('densityValue').textContent = n < 19 ? 'High' : n > 32 ? 'Low' : 'Normal';
    reset();
    fallSetup()
};
document.querySelectorAll('.swatch').forEach(b => b.onclick = () => {
    theme = 'normal';
    $('theme').value = theme;
    setColor(b.dataset.color)
});
$('toggle').onclick = e => {
    let p = $('panel');
    p.classList.toggle('collapsed');
    e.target.textContent = p.classList.contains('collapsed') ? '+' : '−'
};

function setControlsHidden(hidden) {
    document.body.classList.toggle('hidden-ui', hidden);

    const button = $('uiVisibilityToggle');
    button.textContent = hidden ? 'SHOW CONTROLS' : 'HIDE CONTROLS';
    button.setAttribute('aria-pressed', String(hidden));
    button.setAttribute('aria-label', hidden ? 'Show controls' : 'Hide controls');

    const fpsBox = $('fpsCounter');
    if (fpsBox) {
        fpsBox.style.display = hidden ? 'none' : 'block';
    }

    localStorage.screenControlsHidden = hidden ? '1' : '';
}
function toggleControls() {
    setControlsHidden(!document.body.classList.contains('hidden-ui'));
}
$('uiVisibilityToggle').onclick = toggleControls;

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
    const panelCollapsed = $('panel').classList.contains('collapsed');
    const items = [$('toggle')];
    if (!panelCollapsed) items.push($('scene'), $('theme'), $('sound'), $('speed'), $('density'), ...document.querySelectorAll('.swatch'));
    items.push($('uiVisibilityToggle'));
    return items;
}

function focusRemoteItem(index) {
    const items = remoteItems();
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
    const options = Array.from(select.options).filter(option => !option.disabled);
    const index = options.findIndex(option => option.value === select.value);
    select.value = options[(index + direction + options.length) % options.length].value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
}

function changeRange(input, direction) {
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
    else if (item.classList.contains('swatch')) {
        const swatches = Array.from(document.querySelectorAll('.swatch'));
        const index = swatches.indexOf(item);
        const next = swatches[(index + direction + swatches.length) % swatches.length];
        next.click();
        focusRemoteItem(remoteItems().indexOf(next));
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

setInterval(() => {
    if (theme === 'random') {
        let a = baseColors.filter(v => v !== color);
        setColor(a[a.length * Math.random() | 0]);
    }
}, 12000);

setInterval(() => {
    if (theme.startsWith('randomTheme') || theme.startsWith('random_')) {
        rotateRandomTheme();
    }
}, 20000);

setColor(palettes[theme] || theme === 'randomTheme' ? tone() : color);
if (localStorage.screenControlsHidden === '1') setControlsHidden(true);
pick(scene);
resize();
onresize = resize;
requestAnimationFrame(loop);