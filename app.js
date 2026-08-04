/* ============================================================
   Alvaro Aramayo Chain — portfolio
   1. Nav state
   2. Scroll reveals
   3. Hero: 3D slot lattice (hand-rolled renderer, no libraries)
   4. Pointer-driven 3D tilt on cards
   5. Booking demo (sample data only)
   6. Scroll fx: progress bar + parallax background
   ============================================================ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. nav ─────────────────────────────────────────────── */

const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ── 2. scroll reveals ──────────────────────────────────── */

const items = document.querySelectorAll('.reveal');

if (REDUCED || !('IntersectionObserver' in window)) {
  items.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

/* ── 3. hero lattice ────────────────────────────────────── */

(function lattice() {
  const canvas = document.getElementById('lattice');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /* --- geometry constants: a wall of "time slots" in space --- */
  const GX = 1.16, GY = 0.92;          // grid spacing
  const SW = 0.92, SH = 0.60, ST = 0.22; // slab width / height / thickness
  const CAM_Z = 12;

  const COL_OPEN   = [ 26,  34,  58];
  const COL_BOOKED = [240, 167,  66];
  const COL_ALT    = [124, 107, 245];
  const LIGHT = norm([-0.38, 0.72, 0.92]);

  /* box corners + faces (front, back, top, bottom, right, left) */
  const CORNERS = [
    [-1,-1, 1], [ 1,-1, 1], [ 1, 1, 1], [-1, 1, 1],
    [-1,-1,-1], [ 1,-1,-1], [ 1, 1,-1], [-1, 1,-1]
  ];
  const FACES = [
    [0,1,2,3], [5,4,7,6], [3,2,6,7], [4,5,1,0], [1,5,6,2], [4,0,3,7]
  ];

  let W = 0, H = 0, dpr = 1, f = 1;
  let slabs = [];
  let mx = 0, my = 0, tx = 0, ty = 0;   // mouse target / eased
  let scrollShift = 0;
  let raf = null, started = 0;

  function norm(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0]/l, v[1]/l, v[2]/l];
  }

  function hash(i, j) {
    const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  function build() {
    const spanX = (W / f) * CAM_Z;
    const spanY = (H / f) * CAM_Z;
    let cols = Math.ceil(spanX / GX) + 3;
    let rows = Math.ceil(spanY / GY) + 3;

    // keep the slab count sane — tighter budget on small / touch screens
    const budget = W < 700 ? 108 : (W < 1100 ? 170 : 230);
    while (cols * rows > budget) {
      if (cols >= rows) cols -= 1; else rows -= 1;
    }

    slabs = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const h = hash(i, j);
        const kind = h < 0.15 ? 1 : (h > 0.955 ? 2 : 0);
        slabs.push({
          x: (i - (cols - 1) / 2) * GX,
          y: (j - (rows - 1) / 2) * GY,
          kind,
          phase: h * Math.PI * 2,
          drift: 0.55 + h * 0.7
        });
      }
    }
  }

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    f = Math.max(W, H * 0.85) * 1.08;
    build();
  }

  /* rotate a point: Y then X */
  function rotate(p, cy, sy, cx, sx) {
    const x =  p[0] * cy + p[2] * sy;
    const z = -p[0] * sy + p[2] * cy;
    const y =  p[1] * cx - z * sx;
    const z2 = p[1] * sx + z * cx;
    return [x, y, z2];
  }

  function draw(time) {
    const t = time / 1000;
    const intro = Math.min(1, (time - started) / 2200);
    const ease = 1 - Math.pow(1 - intro, 3);

    ctx.clearRect(0, 0, W, H);

    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;

    const ry = -0.40 + Math.sin(t * 0.13) * 0.06 + mx * 0.16;
    const rx = -0.17 + Math.sin(t * 0.09) * 0.03 + my * 0.11;
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cx = Math.cos(rx), sx = Math.sin(rx);

    const quads = [];

    for (const s of slabs) {
      const wave = Math.sin(s.x * 0.5 + t * 0.32 + s.phase) * 0.55
                 + Math.cos(s.y * 0.62 - t * 0.24) * 0.38;
      const zc = wave + (s.kind === 0 ? 0 : s.drift) - (1 - ease) * 5;
      const yc = s.y + scrollShift;

      let minZ = Infinity;
      const proj = [];

      for (const c of CORNERS) {
        const p = rotate([
          s.x + c[0] * SW / 2,
          yc  + c[1] * SH / 2,
          zc  + c[2] * ST / 2
        ], cy, sy, cx, sx);

        const depth = CAM_Z - p[2];
        if (depth < 1.2) { minZ = -1; break; }
        const k = f / depth;
        proj.push([W / 2 + p[0] * k, H / 2 - p[1] * k, p]);
        if (depth < minZ) minZ = depth;
      }
      if (minZ < 0 || proj.length < 8) continue;

      const base = s.kind === 1 ? COL_BOOKED : (s.kind === 2 ? COL_ALT : COL_OPEN);
      const fade = Math.max(0.12, Math.min(1, 1.7 - minZ / 16)) * ease;

      for (const fc of FACES) {
        const a = proj[fc[0]], b = proj[fc[1]], c2 = proj[fc[2]];
        // 2-D cross product on screen space = backface cull
        const cross = (b[0] - a[0]) * (c2[1] - a[1]) - (b[1] - a[1]) * (c2[0] - a[0]);
        if (cross >= 0) continue;

        // face normal in world space for shading
        const p0 = a[2], p1 = b[2], p2 = c2[2];
        const u = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
        const v = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
        const n = norm([
          u[1]*v[2] - u[2]*v[1],
          u[2]*v[0] - u[0]*v[2],
          u[0]*v[1] - u[1]*v[0]
        ]);
        const lam = 0.42 + 0.58 * Math.max(0, n[0]*LIGHT[0] + n[1]*LIGHT[1] + n[2]*LIGHT[2]);

        quads.push({
          z: minZ,
          pts: fc.map(idx => proj[idx]),
          r: base[0] * lam, g: base[1] * lam, b: base[2] * lam,
          a: fade * (s.kind === 0 ? 0.95 : 1),
          glow: s.kind !== 0 && lam > 0.85
        });
      }
    }

    quads.sort((p, q) => q.z - p.z);   // far to near

    for (const q of quads) {
      ctx.beginPath();
      ctx.moveTo(q.pts[0][0], q.pts[0][1]);
      for (let i = 1; i < q.pts.length; i++) ctx.lineTo(q.pts[i][0], q.pts[i][1]);
      ctx.closePath();
      ctx.fillStyle = `rgba(${q.r|0},${q.g|0},${q.b|0},${q.a.toFixed(3)})`;
      if (q.glow) {
        ctx.shadowColor = `rgba(${q.r|0},${q.g|0},${q.b|0},${(q.a * 0.55).toFixed(3)})`;
        ctx.shadowBlur = 26;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    raf = requestAnimationFrame(draw);
  }

  /* --- wiring --- */

  resize();
  canvas.classList.add('ready');

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 160);
  });

  if (REDUCED) {
    started = performance.now() - 3000;
    draw(3000);
    cancelAnimationFrame(raf);
    return;
  }

  window.addEventListener('pointermove', (e) => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * -2;
  }, { passive: true });

  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const p = Math.min(1, window.scrollY / (hero.offsetHeight || 1));
    scrollShift = p * 3.2;
    canvas.style.opacity = String(1 - p * 0.85);
  }, { passive: true });

  // pause the loop when the hero is off-screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!raf) { started = started || performance.now(); raf = requestAnimationFrame(draw); }
      } else if (raf) {
        cancelAnimationFrame(raf); raf = null;
      }
    }, { threshold: 0 }).observe(hero);
  }

  started = performance.now();
  raf = requestAnimationFrame(draw);
})();

/* ── 4. pointer-driven 3D tilt ──────────────────────────────
   Cards marked [data-tilt="<strength>"] tip toward the pointer.
   Skipped entirely on touch/coarse pointers and reduced motion. */

if (!REDUCED && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const strength = parseFloat(el.dataset.tilt) || 8;
    let rect = null;

    el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });

    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--ry', (px * strength).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (py * -strength).toFixed(2) + 'deg');
    });

    el.addEventListener('pointerleave', () => {
      rect = null;
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

/* ── 5. site preview demos — sample copy only, browsable in place ── */

document.querySelectorAll('.demo').forEach((demo) => {
  const scroller = demo.querySelector('.demo__scroll');
  if (!scroller) return;

  demo.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = demo.querySelector('#' + btn.dataset.goto);
      if (target) scroller.scrollTo({ top: target.offsetTop - 6, behavior: 'smooth' });
    });
  });
});

/* ── 6. scroll fx: progress bar + parallax background ──────
   The progress bar tracks the user's own scroll (kept even under
   reduced motion — it doesn't move on its own). The background
   parallax shift is pure decoration, so it's skipped under
   reduced motion instead of just slowed down. */

(function scrollFx() {
  const bar = document.getElementById('scrollProgress');
  const bg = document.getElementById('bgFx');
  if (!bar && !bg) return;

  let ticking = false;

  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;

    if (bar) bar.style.transform = `scaleX(${p})`;
    if (bg && !REDUCED) bg.style.setProperty('--shift', (window.scrollY * -0.06).toFixed(1) + 'px');

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  update();
})();
