/* ============================================================
   Future Cars — animation engine (vanilla JS, no dependencies)
   ============================================================ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- shared car SVG ---------- */
  function carSVG(id) {
    return `
<svg class="car-svg" viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="bodyGrad-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".55"/>
      <stop offset=".25" stop-color="var(--body)"/>
      <stop offset="1" stop-color="#070a1a"/>
    </linearGradient>
    <linearGradient id="beamGrad-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".9"/>
      <stop offset="1" stop-color="var(--body)" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="flame-${id}" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".4" stop-color="var(--body)"/>
      <stop offset="1" stop-color="var(--body)" stop-opacity="0"/>
    </linearGradient>
    <pattern id="hex-${id}" width="14" height="12" patternUnits="userSpaceOnUse">
      <path d="M7 0 L14 3.5 L14 8.5 L7 12 L0 8.5 L0 3.5 Z" fill="none" stroke="#fff" stroke-width=".7"/>
    </pattern>
    <filter id="softGlow-${id}" x="-20%" y="-20%" width="140%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b"/>
      <feFlood flood-color="var(--body)" flood-opacity=".35"/>
      <feComposite in2="b" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="neon-${id}" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="blur-${id}" x="-50%" y="-200%" width="200%" height="500%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <clipPath id="bodyClip-${id}"><path d="M30,140 C40,98 120,58 230,52 C330,48 410,82 452,122 C464,135 454,150 436,150 L60,150 C40,150 24,150 30,140 Z"/></clipPath>
    <clipPath id="canopyClip-${id}"><path d="M118,112 C150,70 240,60 300,66 C345,70 385,92 405,112 Z"/></clipPath>
  </defs>
  <g>
    <ellipse class="shadow" cx="245" cy="196" rx="190" ry="12"/>
    <g class="maglev">
      <rect class="pad" x="100" y="164" width="70" height="8" rx="4"/>
      <rect class="pad" x="330" y="164" width="70" height="8" rx="4"/>
      <path class="field" d="M90 184 Q135 200 180 184"/>
      <path class="field" d="M320 184 Q365 200 410 184"/>
    </g>
    <g class="wheelgroup">
      <g class="wheel-l">
        <circle class="wheel" cx="135" cy="154" r="30"/>
        <g class="hub"><circle cx="135" cy="154" r="16"/><path d="M135 138 V170 M119 154 H151 M124 143 L146 165 M146 143 L124 165"/></g>
      </g>
      <g class="wheel-r">
        <circle class="wheel" cx="365" cy="154" r="30"/>
        <g class="hub"><circle cx="365" cy="154" r="16"/><path d="M365 138 V170 M349 154 H381 M354 143 L376 165 M376 143 L354 165"/></g>
      </g>
    </g>
    <path class="thruster" d="M30 128 L-80 118 L-60 136 L-110 144 L-40 150 L30 148 Z"/>
    <path class="exhaust-ion" d="M20 138 H-120"/>
    <path class="body" d="M30,140 C40,98 120,58 230,52 C330,48 410,82 452,122 C464,135 454,150 436,150 L60,150 C40,150 24,150 30,140 Z"/>
    <path class="solar" clip-path="url(#bodyClip-${id})" d="M30,140 C40,98 120,58 230,52 C330,48 410,82 452,122 C464,135 454,150 436,150 L60,150 C40,150 24,150 30,140 Z"/>
    <path class="canopy" d="M118,112 C150,70 240,60 300,66 C345,70 385,92 405,112 Z"/>
    <rect class="canopy-shine" clip-path="url(#canopyClip-${id})" x="150" y="60" width="40" height="60" transform="skewX(-25)"/>
    <g class="core">
      <rect x="225" y="112" width="52" height="24" rx="6"/>
      <circle class="core-dot" cx="251" cy="124" r="4"/>
      <path d="M225 118 H210 M225 130 H210 M277 118 H292 M277 130 H292" />
    </g>
    <path class="lightstrip" d="M44 132 L440 132"/>
    <polygon class="beam" points="452,118 640,80 640,170 452,136"/>
  </g>
</svg>`;
  }
  // SVG url(#id) references must be rewritten for the CSS, which uses generic ids.
  function mountCar(el, id) {
    el.innerHTML = carSVG(id);
    const svg = el.querySelector('svg');
    svg.querySelector('.body').style.fill = `url(#bodyGrad-${id})`;
    svg.querySelector('.body').style.filter = `url(#softGlow-${id})`;
    svg.querySelector('.solar').style.fill = `url(#hex-${id})`;
    svg.querySelector('.lightstrip').style.filter = `url(#neon-${id})`;
    svg.querySelector('.beam').style.fill = `url(#beamGrad-${id})`;
    svg.querySelector('.thruster').style.fill = `url(#flame-${id})`;
    svg.querySelector('.shadow').style.filter = `url(#blur-${id})`;
    svg.querySelectorAll('.pad').forEach(p => p.style.filter = `url(#neon-${id})`);
    return svg;
  }
  mountCar(document.getElementById('hero-car'), 'hero').closest('.hero-car').classList.add('lights-on');
  mountCar(document.getElementById('anatomy-car'), 'anatomy');
  mountCar(document.getElementById('studio-car'), 'studio');

  /* ---------- starfield (warp) ---------- */
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], speed = 0.012, targetSpeed = 0.012;
  function resize() {
    W = canvas.width = innerWidth * devicePixelRatio;
    H = canvas.height = innerHeight * devicePixelRatio;
  }
  function makeStar() {
    return { x: (Math.random() - .5) * W * 2, y: (Math.random() - .5) * H * 2, z: Math.random(), pz: 0 };
  }
  resize();
  for (let i = 0; i < 260; i++) stars.push(makeStar());
  addEventListener('resize', resize);
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const dy = Math.abs(scrollY - lastY); lastY = scrollY;
    targetSpeed = Math.min(0.09, 0.012 + dy * 0.0006);
  }, { passive: true });
  function frame() {
    speed += (targetSpeed - speed) * 0.08;
    targetSpeed += (0.012 - targetSpeed) * 0.04;
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    for (const s of stars) {
      s.pz = s.z;
      s.z -= speed;
      if (s.z <= 0.02) { Object.assign(s, makeStar()); s.z = 1; s.pz = 1; }
      const sx = s.x / s.z + W / 2, sy = s.y / s.z + H / 2;
      const px = s.x / s.pz + W / 2, py = s.y / s.pz + H / 2;
      if (sx < 0 || sx > W || sy < 0 || sy > H) { Object.assign(s, makeStar()); continue; }
      const a = (1 - s.z) * .9;
      ctx.strokeStyle = `rgba(${s.z > .5 ? '200,230,255' : '34,229,255'},${a})`;
      ctx.lineWidth = (1 - s.z) * 2.2 * devicePixelRatio;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) frame(); else canvas.remove();

  /* ---------- progress bar ---------- */
  const bar = document.querySelector('.progress');
  addEventListener('scroll', () => {
    const p = scrollY / (document.documentElement.scrollHeight - innerHeight);
    bar.style.width = (p * 100) + '%';
  }, { passive: true });

  /* ---------- cursor glow + parallax ---------- */
  const glow = document.querySelector('.cursor-glow');
  let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.add('has-mouse');
    const nx = (mx / innerWidth - .5), ny = (my / innerHeight - .5);
    const car = document.getElementById('hero-car');
    car.style.setProperty('--px', nx);
    car.querySelector('svg > g').style.transform = `translate(${nx * 24}px, ${ny * 12}px) rotate(${nx * 2}deg)`;
    document.querySelector('.sun').style.marginLeft = (nx * -30) + 'px';
  });
  (function glowLoop() {
    gx += (mx - gx) * .12; gy += (my - gy) * .12;
    glow.style.transform = `translate(${gx - 210}px, ${gy - 210}px)`;
    requestAnimationFrame(glowLoop);
  })();
  document.querySelectorAll('.stat').forEach(s => s.addEventListener('pointermove', e => {
    const r = s.getBoundingClientRect();
    s.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    s.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- hero title split ---------- */
  const title = document.querySelector('[data-split]');
  const text = title.textContent; title.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'ch' + (ch === ' ' ? ' sp' : '');
    s.textContent = ch === ' ' ? ' ' : ch;
    s.style.setProperty('--i', i);
    title.appendChild(s);
  });
  // Once the letters have landed, collapse back to plain text so the
  // gradient text clip (which breaks across animated children) applies.
  setTimeout(() => { title.textContent = text; }, 300 + text.length * 45 + 950);

  /* ---------- speed lines ---------- */
  const sl = document.querySelector('.speedlines');
  const cols = ['#22e5ff', '#ff2bd6', '#7c4dff', '#ffffff'];
  for (let i = 0; i < 14; i++) {
    const l = document.createElement('i');
    l.style.setProperty('--y', (20 + Math.random() * 70) + '%');
    l.style.setProperty('--d', (1.2 + Math.random() * 2) + 's');
    l.style.setProperty('--dl', (-Math.random() * 4) + 's');
    l.style.setProperty('--c', cols[i % cols.length]);
    sl.appendChild(l);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        if (en.target.classList.contains('stat')) countUp(en.target.querySelector('.num'));
        if (en.target.id === 'anatomy-stage') setTimeout(() => setExploded(true), 500);
        io.unobserve(en.target);
      }
    });
  }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .h2').forEach(el => io.observe(el));

  /* ---------- timeline progress line ---------- */
  const tl = document.querySelector('.timeline');
  const fill = document.querySelector('.line-fill');
  function tlProgress() {
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / r.height));
    fill.style.setProperty('--p', (p * 100) + '%');
  }
  addEventListener('scroll', tlProgress, { passive: true }); tlProgress();

  /* ---------- count up ---------- */
  function countUp(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    const dur = 1600, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * e).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- anatomy ---------- */
  const stage = document.getElementById('anatomy-stage');
  const explodeBtn = document.getElementById('explode-btn');
  function setExploded(on) {
    stage.classList.toggle('exploded', on);
    explodeBtn.textContent = on ? 'Assemble' : 'Explode';
  }
  explodeBtn.addEventListener('click', () => setExploded(!stage.classList.contains('exploded')));
  document.querySelectorAll('.hot').forEach(h => {
    const show = () => stage.dataset.part = h.dataset.part;
    const hide = () => delete stage.dataset.part;
    h.addEventListener('pointerenter', show); h.addEventListener('focus', show);
    h.addEventListener('pointerleave', hide); h.addEventListener('blur', hide);
    h.addEventListener('click', e => { e.preventDefault(); show(); });
  });

  /* ---------- studio ---------- */
  const studio = document.getElementById('studio-stage');
  const car = document.getElementById('studio-car');
  const names = { '#22e5ff': 'Ion Cyan', '#ff2bd6': 'Plasma Magenta', '#b6ff3b': 'Reactor Lime', '#ff8a3b': 'Solar Flare', '#f2f4ff': 'Lunar Pearl', '#7c4dff': 'Deep Violet' };
  const state = { color: '#22e5ff', mode: 'wheels', ride: 12, tint: 35, lights: true, solar: true };
  const readout = document.getElementById('readout');
  function render() {
    studio.style.setProperty('--body', state.color);
    car.style.setProperty('--ride', state.ride + 'px');
    car.style.setProperty('--tint', (state.tint / 100).toFixed(2));
    studio.dataset.mode = state.mode;
    car.classList.toggle('lights-on', state.lights);
    car.classList.toggle('solar-off', !state.solar);
    const range = state.solar ? 1200 + state.ride * 2 : 980;
    const top = state.mode === 'flight' ? 310 : state.mode === 'maglev' ? 420 : 250;
    readout.innerHTML =
      `MODEL <b>FC-50 ${names[state.color].split(' ')[1].toUpperCase()}</b>\n` +
      `DRIVE <b>${state.mode.toUpperCase()}</b>  ·  TOP <b>${top} km/h</b>\n` +
      `RANGE <b>${range.toLocaleString()} km</b>  ·  RIDE <b>${state.ride} cm</b>\n` +
      `CANOPY <b>${state.tint}% tint</b>  ·  LIGHTS <b>${state.lights ? 'ON' : 'OFF'}</b>`;
  }
  document.getElementById('swatches').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#swatches button').forEach(x => x.classList.toggle('on', x === b));
    state.color = b.dataset.c; render();
  });
  document.getElementById('modes').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#modes button').forEach(x => x.classList.toggle('on', x === b));
    state.mode = b.dataset.mode;
    if (state.mode !== 'wheels' && state.ride < 20) { state.ride = 24; document.getElementById('hover').value = 24; document.getElementById('hover-out').textContent = 24; }
    render();
  });
  document.getElementById('hover').addEventListener('input', e => { state.ride = +e.target.value; document.getElementById('hover-out').textContent = state.ride; render(); });
  document.getElementById('tint').addEventListener('input', e => { state.tint = +e.target.value; document.getElementById('tint-out').textContent = state.tint; render(); });
  document.getElementById('lights').addEventListener('change', e => { state.lights = e.target.checked; render(); });
  document.getElementById('solar').addEventListener('change', e => { state.solar = e.target.checked; render(); });
  render();

  /* ---------- city ---------- */
  const sky = document.getElementById('skyline');
  const n = innerWidth < 600 ? 18 : 34;
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div');
    b.className = 'bld';
    b.style.height = (20 + Math.random() * 80) + '%';
    b.style.setProperty('--dl', (Math.random() * .8) + 's');
    b.style.setProperty('--bd', (2 + Math.random() * 5) + 's');
    sky.appendChild(b);
  }
  const fliers = document.getElementById('fliers');
  const fcols = ['#22e5ff', '#ff2bd6', '#b6ff3b', '#ffffff', '#7c4dff'];
  for (let i = 0; i < 9; i++) {
    const f = document.createElement('div');
    f.className = 'flier' + (i % 3 === 0 ? ' back' : '');
    f.style.setProperty('--y', (5 + Math.random() * 45) + '%');
    f.style.setProperty('--w', (26 + Math.random() * 40) + 'px');
    f.style.setProperty('--d', (6 + Math.random() * 9) + 's');
    f.style.setProperty('--dl', (-Math.random() * 12) + 's');
    f.style.setProperty('--c', fcols[i % fcols.length]);
    fliers.appendChild(f);
  }
  const street = document.getElementById('streetcars');
  for (let i = 0; i < 6; i++) {
    const c = document.createElement('div');
    c.className = 'scar' + (i % 2 ? ' back' : '');
    c.style.setProperty('--d', (4 + Math.random() * 4) + 's');
    c.style.setProperty('--dl', (-Math.random() * 8) + 's');
    c.style.setProperty('--c', fcols[(i + 2) % fcols.length]);
    c.style.bottom = (i % 2 ? 30 : 10) + 'px';
    street.appendChild(c);
  }
})();
