const CACHE='screen-gallery-v2',FILES=['./','index.html','style.css','script.js','manifest.webmanifest','icon_192.png','icon_512.png','mp3/light-rain.mp3','mp3/ocean-waves.mp3','mp3/rainy-with-birds.mp3','mp3/Rainy-Mood.m4a'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
