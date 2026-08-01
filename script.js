const c = document.querySelector('canvas'),
    x = c.getContext('2d'),
    $ = id => document.getElementById(id),
    TAU = Math.PI * 2;
let W, H, last = 0,
    t = 0,
    color = localStorage.screenColor || '#36F76D',
    scene = localStorage.screenScene || 'matrix',
    S = {},
    theme = localStorage.screenTheme || 'normal';
const sounds = {rain:'mp3/light-rain.mp3',waves:'mp3/ocean-waves.mp3',birds:'mp3/rainy-with-birds.mp3',mood:'mp3/Rainy-Mood.m4a'}, audio = new Audio();
audio.loop = true;
function setSound(v) { localStorage.screenSound = v; audio.pause(); if (!v) return audio.removeAttribute('src'); audio.src = sounds[v]; audio.play().catch(() => {}) }
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
    pastel: ['#A8E6CF', '#FFD3B6', '#FFAAA5']
};
const baseColors = ['#36F76D', '#35D7FF', '#C77DFF', '#FF4D7D', '#FFB347'],
    randomThemes = ['neon', 'ocean', 'sunset', 'violet', 'ice', 'forest', 'candy', 'gold', 'lava'],
    title = {
        tv_clock: 'TV FLIP CLOCK [60FPS]',
        tv_stars: 'TV COSMIC STAR WARP [60FPS]',
        tv_matrix: 'TV OPTIMIZED MATRIX [60FPS]',
        tv_grid: 'TV CYBERPUNK GRID [60FPS]',
        tv_grid2: 'TV CYBERPUNK GRID MOTION [60FPS]',
        tv_blobs: 'TV NEON FLUID BLOBS [60FPS]',
        tv_dvd: 'TV RETRO DVD DRIFT [60FPS]',
        matrix: 'MATRIX FLOW',
        matrix2: 'AUTHENTIC MATRIX',
        stars: 'STARFIELD',
        fire: 'FIREPLACE EMBER',
        rain: 'RAIN ON GLASS',
        aurora: 'AURORA',
        ink: 'FLUID INK',
        ink2: 'FLUID INK BUBBLES',
        dvd: 'RETRO DVD',
        clock: 'DIGITAL CLOCK',
        grid: 'CYBER GRID',
        network: 'PARTICLE NETWORK',
        terminal: 'CODE TERMINAL',
        hello: 'HELLO WORLD',
        fireflies: 'FIREFLIES',
        bubbles: 'FLOATING BUBBLES',
        mesh: 'LOW POLY MESH',
        sakura: 'SAKURA',
        snow: 'SNOW',
        storm: 'STORM RAIN',
        snow2: 'SNOW 2',
        storm2: 'STORM RAIN 2',
        paint: 'PAINT SPLASH',
        plasma: 'PLASMA',
        smoke: 'SMOKE',
        confetti: 'CONFETTI',
		synthwave: 'RETRO SYNTHWAVE'
    },
    chars = 'アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%#&_()[]{}<>!';
let activeRandomTheme = localStorage.screenActiveRandomTheme || randomThemes[0];
const tone = (i = 0) => {
        let p = palettes[theme === 'randomTheme' ? activeRandomTheme : theme] || [color];
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
            length: 18
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
function synthwave(k) {
    bg(.12);

    const c1 = tone(0);
    const c2 = tone(1);
    const c3 = tone(2);

    const horizon = H * 0.45;
    const centerX = W * 0.5;

    // ===== Stars =====
    for (let i = 0; i < S.tv_star.length; i++) {
        let s = S.tv_star[i];

        let sx = s.x + W * 0.5;
        let sy = s.y + H * 0.25;

        if (sx < 0 || sx > W || sy < 0 || sy > horizon) continue;

        let a = 0.4 + Math.sin(t * 0.03 + i) * 0.3;

        x.fillStyle = `rgba(${rgb(c3)},${a})`;
        x.fillRect(sx, sy, 2, 2);
    }

    // ===== Light Beams =====
    for (let i = -8; i <= 8; i++) {

        let bx = centerX + i * 80;

        let beam = x.createLinearGradient(
            bx,
            0,
            centerX,
            horizon
        );

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

    // ===== Sun Glow =====
    let sunR = Math.min(W, H) * 0.14;

    let g = x.createRadialGradient(
        centerX,
        horizon - 40,
        20,
        centerX,
        horizon - 40,
        sunR * 2.2
    );

    g.addColorStop(0, c3);
    g.addColorStop(.5, c2);
    g.addColorStop(.9, c1);
    g.addColorStop(1, "transparent");

    x.fillStyle = g;
    x.beginPath();
    x.arc(
        centerX,
        horizon - 40,
        sunR * 2.2,
        0,
        TAU
    );
    x.fill();

    // ===== Sun =====
    x.fillStyle = c3;

    x.beginPath();
    x.arc(
        centerX,
        horizon - 40,
        sunR,
        0,
        TAU
    );
    x.fill();

    // ===== Sun Stripes =====
    x.save();

    x.beginPath();
    x.arc(
        centerX,
        horizon - 40,
        sunR,
        0,
        TAU
    );
    x.clip();

    x.strokeStyle = `rgba(${rgb(c2)},.5)`;

    for (let i = 0; i < 12; i++) {

        let yy =
            horizon -
            40 -
            sunR +
            i * 14;

        x.beginPath();
        x.moveTo(centerX - sunR, yy);
        x.lineTo(centerX + sunR, yy);
        x.stroke();
    }

    x.restore();

    // ===== Horizon =====
    x.strokeStyle = c2;
    x.lineWidth = 3;

    x.beginPath();
    x.moveTo(0, horizon);
    x.lineTo(W, horizon);
    x.stroke();

    // ===== Moving Grid =====
    let flow = (t * 0.02) % 1;

    x.strokeStyle = `rgba(${rgb(c1)},.75)`;
    x.lineWidth = 1;

    for (let i = 1; i < 24; i++) {

        let p =
            ((i / 24 + flow) % 1);

        let y =
            horizon +
            Math.pow(p, 2.2) *
            (H - horizon);

        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    // ===== Perspective Lines =====
    for (let i = -20; i <= 20; i++) {

        let px =
            centerX +
            i * 60;

        x.beginPath();
        x.moveTo(px, H);
        x.lineTo(centerX, horizon);
        x.stroke();
    }

    // ===== Mountains =====
    x.fillStyle = darkTone(c1, 80);

    x.beginPath();
    x.moveTo(0, horizon);

    for (let i = 0; i <= W; i += 40) {

        let h =
            Math.sin(i * 0.01) * 40 +
            Math.sin(i * 0.03) * 20;

        x.lineTo(
            i,
            horizon - 40 - h
        );
    }

    x.lineTo(W, horizon);
    x.closePath();
    x.fill();

    // ===== CRT Scanlines =====
    x.strokeStyle = "rgba(255,255,255,.02)";
    x.lineWidth = 1;

    for (let y = 0; y < H; y += 4) {
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }
	
	// ===== FULL SCREEN MOVING GLOW =====
    let glowY =
        ((t * 4) % (H + 800))
        - 400;

    let skyGlow = x.createLinearGradient(
        0,
        glowY - 250,
        0,
        glowY + 250
    );

    skyGlow.addColorStop(0, "transparent");
    skyGlow.addColorStop(.5, `rgba(${rgb(c2)},.18)`);
    skyGlow.addColorStop(1, "transparent");

    x.fillStyle = skyGlow;
    x.fillRect(
        0,
        glowY - 250,
        W,
        500
    );

    // ===== Vignette =====
    let vg = x.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.1,
        W / 2,
        H / 2,
        H * 0.9
    );

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
    S.drop.forEach((d, i) => {
        for (let j = 0; j < 10; j++) {
            x.globalAlpha = 1 - j / 10;
            x.fillStyle = j ? tone() : '#f0fff2';
            x.fillText(chars[Math.random() * chars.length | 0], i * W / S.drop.length + W / S.drop.length / 2, d * fs - j * fs)
        }
        d += k * (.06 + Math.random());
        if (d * fs > H && Math.random() > .975) d = -Math.random() * 20;
        S.drop[i] = d
    });
    x.globalAlpha = 1;
    x.shadowBlur = 0
}

function matrix2(k) {
    bg(.25); // Crisp background clear to prevent blurry smudging
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
                speed: R(0.1, 0.25), //0.25,0.70
                len: len,
                chars: Array.from({ length: len }, () => chars[Math.random() * chars.length | 0]),
                ticks: 0
            };
        });
    }

    S.matrix2.forEach((col, i) => {
        let colX = i * W / S.matrix2.length + (W / S.matrix2.length) / 2;
        col.ticks = (col.ticks || 0) + k;

        // Change head character at a comfortable speed (~10 times per sec instead of 60)
        if (col.ticks >= 6) {
            col.chars[0] = chars[Math.random() * chars.length | 0];
            col.ticks = 0;
        }

        // Subtle random mutation in tail (0.3% chance per frame) to keep text crisp & readable
        if (Math.random() < 0.003) {
            let mutIdx = 1 + (Math.random() * (col.len - 1) | 0);
            col.chars[mutIdx] = chars[Math.random() * chars.length | 0];
        }

        for (let j = 0; j < col.len; j++) {
            let charY = (col.y - j) * fs;
            if (charY < -fs || charY > H + fs) continue;

            if (j === 0) {
                // Sharp White Head with subtle glow
                x.shadowColor = '#ffffff';
                x.shadowBlur = 4;
                x.fillStyle = '#ffffff';
                x.globalAlpha = 1;
            } else {
                // Clear, readable body characters fading down the tail
                x.shadowColor = activeTone;
                x.shadowBlur = j < 2 ? 3 : 0;
                let fade = 1 - (j / col.len);
                x.globalAlpha = Math.max(0.12, fade);
                x.fillStyle = activeTone;
            }

            x.fillText(col.chars[j] || chars[0], colX, charY);
        }

        col.y += k * col.speed;

        // Reset drop when tail moves completely off-screen
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

function dvd(k) {
    bg(1);
    let d = S.d;
    d.x += d.vx * k * 2;
    d.y += d.vy * k * 2;
    if (d.x < 0 || d.x > W - 145) d.vx *= -1;
    if (d.y < 0 || d.y > H - 60) d.vy *= -1;
    x.strokeStyle = x.fillStyle = color;
    x.lineWidth = 3;
    x.strokeRect(d.x, d.y, 145, 60);
    x.font = 'bold 28px sans-serif';
    x.textAlign = 'center';
    x.fillText('DVD', d.x + 72, d.y + 39)
}

function clock() {
    bg(.15);
    let d = new Date();
    x.textAlign = 'center';
    x.fillStyle = color;
    x.shadowColor = color;
    x.shadowBlur = 20;
    x.font = `${Math.min(W*.16,155)}px monospace`;
    x.fillText(d.toLocaleTimeString(), W / 2, H / 2);
    x.shadowBlur = 0;
    x.fillStyle = '#aab6ac';
    x.font = '15px monospace';
    x.fillText(d.toDateString(), W / 2, H / 2 + 48)
}

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
}

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
    bg(.6); //trail .18
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
        g.x -= g.v * k * 3; //speed 15
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
}

/*function tv_grid2(k) {
    bg(.15);
    let h = H * 0.5;
    let activeTone = tone();
    let flow = (t * 0.015) % 1;

    // Perspective lines (Top & Bottom halves radiating from center horizon)
    x.strokeStyle = activeTone;
    x.lineWidth = 1;
    for (let i = -18; i <= 18; i++) {
        let topX = W / 2 + i * (W * 0.15);
        let botX = W / 2 + i * (W * 0.15);
        let centerX = W / 2 + i * (W * 0.02);

        // Top Grid radiating up
        x.beginPath();
        x.moveTo(centerX, h);
        x.lineTo(topX, 0);
        x.stroke();

        // Bottom Grid radiating down
        x.beginPath();
        x.moveTo(centerX, h);
        x.lineTo(botX, H);
        x.stroke();
    }

    // Moving horizontal grid lines (Bottom half downwards)
    for (let i = 0; i < 11; i++) {
        let p = ((i / 11) + flow) % 1;
        let y = h + (H - h) * (p * p);
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    // Moving horizontal grid lines (Top half upwards from center)
    for (let i = 0; i < 11; i++) {
        let p = ((i / 11) + flow) % 1;
        let y = h - h * (p * p);
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    // Cyberpunk Horizon Shadow & Glow Overlay
    let shadowG = x.createLinearGradient(0, h - 70, 0, h + 70);
    shadowG.addColorStop(0, 'rgba(2, 4, 3, 0)');
    shadowG.addColorStop(0.35, 'rgba(2, 4, 3, 0.75)');
    shadowG.addColorStop(0.5, 'rgba(2, 4, 3, 0.95)');
    shadowG.addColorStop(0.65, 'rgba(2, 4, 3, 0.75)');
    shadowG.addColorStop(1, 'rgba(2, 4, 3, 0)');
    x.fillStyle = shadowG;
    x.fillRect(0, h - 70, W, 140);

    // Glowing Neon Center Horizon Line
    x.strokeStyle = darkTone(activeTone, 85);
    x.lineWidth = 2.5;
    x.beginPath();
    x.moveTo(0, h);
    x.lineTo(W, h);
    x.stroke();

    x.strokeStyle = darkTone(activeTone, 80);
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(0, h - 2);
    x.lineTo(W, h - 2);
    x.moveTo(0, h + 2);
    x.lineTo(W, h + 2);
    x.stroke();
}
*/
let neonFlicker = 1;
let neonFlickerTimer = 0;
function tv_grid2(k) {
    bg(.15);

    let h = H * 0.5;
    let activeTone = tone();
    let flow = (t * 0.015) % 1;

    // ===== Neon Flicker =====
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

    // Grid brightness follows flicker slightly
    const gridAlpha = 0.7 + neonFlicker * 0.3;

    // ===== Perspective Lines =====
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

    // ===== Bottom Grid =====
    for (let i = 0; i < 11; i++) {
        let p = ((i / 11) + flow) % 1;
        let y = h + (H - h) * (p * p);

        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    // ===== Top Grid =====
    for (let i = 0; i < 11; i++) {
        let p = ((i / 11) + flow) % 1;
        let y = h - h * (p * p);

        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(W, y);
        x.stroke();
    }

    x.restore();

    // ===== Horizon Shadow =====
    let shadowG = x.createLinearGradient(0, h - 70, 0, h + 70);

    shadowG.addColorStop(0, 'rgba(2,4,3,0)');
    shadowG.addColorStop(0.35, 'rgba(2,4,3,0.75)');
    shadowG.addColorStop(0.5, 'rgba(2,4,3,0.95)');
    shadowG.addColorStop(0.65, 'rgba(2,4,3,0.75)');
    shadowG.addColorStop(1, 'rgba(2,4,3,0)');

    x.fillStyle = shadowG;
    x.fillRect(0, h - 70, W, 140);

    // ===== Flickering Neon Horizon =====
    x.save();

    x.globalAlpha = neonFlicker;

    // Main Glow
    x.shadowColor = activeTone;
    x.shadowBlur = 30 * neonFlicker;

    x.strokeStyle = activeTone;
    x.lineWidth = 3;

    x.beginPath();
    x.moveTo(0, h);
    x.lineTo(W, h);
    x.stroke();

    // Outer Glow Lines
    x.shadowBlur = 15 * neonFlicker;
    x.lineWidth = 1;

    x.beginPath();
    x.moveTo(0, h - 2);
    x.lineTo(W, h - 2);

    x.moveTo(0, h + 2);
    x.lineTo(W, h + 2);

    x.stroke();

    x.restore();
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
    x.font = 'bold 30px "Space Grotesk", sans-serif';
    x.textAlign = 'center';
    x.fillText('TV DVD', d.x + boxW / 2, d.y + boxH / 2 + 10);
}

function loop(now) {
    let k = Math.min(2.5, (now - last || 16) / 16) * +$('speed').value;
    last = now;
    t += k;
    ({
        tv_clock,
        tv_stars,
        tv_matrix,
        tv_grid,
        tv_grid2,
        tv_blobs,
        tv_dvd,
        matrix,
        matrix2,
        stars,
        fire,
        rain,
        aurora: () => blobs(k),
        ink: () => blobs(k, true),
        ink2: () => inkBubbles(k),
        dvd,
        clock,
        grid,
        network,
        terminal,
        hello,
        fireflies,
        bubbles,
        mesh,
        sakura: () => fall(k, 'sakura'),
        snow: () => fall(k, 'snow'),
        storm: () => fall(k, 'storm'),
        storm2: () => fall(k, 'storm2'),
        snow2: () => fall(k, 'snow2'),
        paint: () => blobs(k),
        plasma,
        smoke,
        confetti: () => fall(k, 'confetti'),
		synthwave
    } [scene] || tv_clock)(k);
    requestAnimationFrame(loop)
}

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
    const choices = randomThemes.filter(name => name !== activeRandomTheme);
    activeRandomTheme = choices[choices.length * Math.random() | 0];
    localStorage.screenActiveRandomTheme = activeRandomTheme;
    setColor(tone())
}

function pick(v) {
    scene = v;
    $('scene').value = v;
    $('sceneTitle').textContent = title[v] || v.toUpperCase();
    localStorage.screenScene = v;
    reset();
    fallSetup()
}

function resize() {
    let isTvScene = scene.startsWith('tv_');
    let d = isTvScene ? 1 : Math.min(devicePixelRatio, 2);
    W = innerWidth;
    H = innerHeight;
    c.width = W * d;
    c.height = H * d;
    x.setTransform(d, 0, 0, d, 0, 0);
    reset();
    fallSetup()
}
$('sound').value = localStorage.screenSound || '';
$('sound').onchange = e => setSound(e.target.value);
$('theme').value = theme;
$('theme').onchange = e => {
    theme = e.target.value;
    localStorage.screenTheme = theme;
    if (theme === 'randomTheme') rotateRandomTheme();
    else if (palettes[theme]) setColor(tone());
    reset();
    fallSetup()
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
        setColor(a[a.length * Math.random() | 0])
    }
}, 12000);
setInterval(() => {
    if (theme === 'randomTheme') rotateRandomTheme();
}, 20000);
setColor(palettes[theme] || theme === 'randomTheme' ? tone() : color);
if (localStorage.screenControlsHidden === '1') setControlsHidden(true);
pick(scene);
resize();
onresize = resize;
requestAnimationFrame(loop);
