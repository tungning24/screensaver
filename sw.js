const CACHE='screen-gallery-v2',FILES=['./','index.html','style.css','script.js','manifest.webmanifest','icon_192.png','icon_512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
