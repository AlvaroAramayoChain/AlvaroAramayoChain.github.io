/* ============================================================
   Alvaro Aramayo Chain — portfolio
   1. Nav state
   2. Scroll reveals
   3. Pointer-driven 3D tilt on cards
   4. Site preview demos (sample data only)
   5. Scroll fx: progress bar + parallax background
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

/* ── 3. pointer-driven 3D tilt ──────────────────────────────
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

/* ── 4. site preview demos — sample copy only, browsable in place ── */

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

/* ── 5. scroll fx: progress bar + parallax background ──────
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
