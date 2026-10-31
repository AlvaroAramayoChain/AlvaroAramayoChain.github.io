/* ============================================================
   Alvaro Aramayo Chain — portfolio
   1. Nav state
   2. Scroll reveals
   3. Site preview demos (sample data only)
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
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  items.forEach(el => io.observe(el));
}

/* ── 3. site preview demos — sample copy only, browsable in place ── */

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
