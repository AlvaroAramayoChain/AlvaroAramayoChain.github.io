/* ============================================================
   Alvaro Aramayo Chain — portfolio
   Plain script, no libraries. Everything here is progressive:
   without it the page is complete and readable.

   1. Flags
   2. Live clock + footer year
   3. Mobile menu
   4. Headline reveals (IntersectionObserver)
   5. Paper ↔ ink theme for the contact section
   6. Copy email
   7. Custom cursor (fine pointers only)
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. flags ──────────────────────────────────────────── */

  var root = document.documentElement;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var t = function (k) { return window.i18n ? window.i18n.t(k) : k; };

  /* ── 2. clock + year ───────────────────────────────────── */
  // Ticks once a minute and stops while the tab is hidden.

  var clocks = document.querySelectorAll('.clock');
  var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Argentina/Salta', hour: '2-digit', minute: '2-digit', hour12: false });
  var clockTimer = null;

  function tick() {
    var now = new Date();
    clocks.forEach(function (el) { el.textContent = fmt.format(now); el.setAttribute('datetime', now.toISOString()); });
  }
  function startClock() {
    tick();
    clearTimeout(clockTimer);
    // align to the next minute boundary, then repeat
    clockTimer = setTimeout(function loop() { tick(); clockTimer = setTimeout(loop, 60000); }, 60000 - Date.now() % 60000);
  }
  startClock();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(clockTimer); else startClock();
  });

  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ── 3. mobile menu ────────────────────────────────────── */

  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.menu-btn');

  function setMenu(open, returnFocus) {
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a').focus({ preventScroll: true });
    else if (returnFocus) menuBtn.focus();
  }

  menuBtn.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open'), true); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false, true);
  });
  // leaving the mobile layout closes the menu
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) setMenu(false, false); });

  /* ── 4. headline reveals ───────────────────────────────── */

  // js-motion is set by the inline snippet at the top of <body>
  if (root.classList.contains('js-motion')) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });
  }

  /* ── 5. paper ↔ ink theme ──────────────────────────────── */
  // The contact section and footer sit on a fixed black layer that
  // fades in (opacity only) once the section owns the viewport.

  if (root.classList.contains('js-motion')) {
    var dark = new Set();
    var themeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) dark.add(entry.target); else dark.delete(entry.target);
      });
      root.classList.toggle('is-ink', dark.size > 0);
    }, { rootMargin: '-45% 0px -45% 0px' });   // a thin band across the middle of the screen
    document.querySelectorAll('.section--ink, .footer').forEach(function (el) { themeIO.observe(el); });
  }

  /* ── 6. copy email ─────────────────────────────────────── */

  document.querySelectorAll('.copy').forEach(function (btn) {
    var status = btn.parentElement.querySelector('.copy__status');
    var label = btn.querySelector('.copy__b');
    var timer;

    function feedback(ok) {
      label.textContent = t(ok ? 'contact.copied' : 'contact.copyKeys');
      status.textContent = t(ok ? 'contact.copiedSr' : 'contact.copyFailSr');
      btn.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(function () { btn.classList.remove('is-copied'); }, 2200);
    }

    btn.addEventListener('click', function () {
      var text = btn.dataset.copy;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { feedback(true); }, function () { feedback(legacyCopy(text)); });
      } else {
        feedback(legacyCopy(text));
      }
    });
  });

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ── 7. custom cursor ──────────────────────────────────── */
  // The animation frame only runs while the dot is catching up with
  // the pointer; once it settles, nothing is scheduled.

  if (FINE && !REDUCED) {
    root.classList.add('has-cursor');
    var cursor = document.querySelector('.cursor');
    var target = { x: 0, y: 0 }, pos = { x: 0, y: 0 }, raf = 0;

    function step() {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      cursor.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)';
      raf = (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.2) ? requestAnimationFrame(step) : 0;
    }

    window.addEventListener('pointermove', function (e) {
      target.x = e.clientX; target.y = e.clientY;
      if (!cursor.classList.contains('is-visible')) { pos.x = target.x; pos.y = target.y; cursor.classList.add('is-visible'); }
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { cursor.classList.remove('is-visible'); });

    document.addEventListener('pointerover', function (e) {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .card, .tech'));
    });
  }
})();
