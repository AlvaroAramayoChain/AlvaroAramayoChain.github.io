/* ============================================================
   Alvaro Aramayo Chain — portfolio
   Plain script, no build step. GSAP + ScrollTrigger + Lenis come
   from CDNs (see index.html); everything degrades to a static,
   fully readable page when they are missing or when the visitor
   prefers reduced motion.

    1. Setup + capability flags
    2. Live clock + footer year
    3. Smooth scroll (Lenis) + anchor links
    4. Nav: hide on scroll down, mobile menu
    5. Booking demo (sample data only)
    6. Copy email
    7. Preloader → hero intro
    8. Hero: mouse-reactive name
    9. Selected work: pinned horizontal track
   10. Scroll reveals (titles, editorial copy, portrait, contact)
   11. Paper ↔ ink theme sync
   12. Marquees driven by scroll velocity
   13. Custom cursor
   14. Magnetic buttons
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. setup ──────────────────────────────────────────── */

  var root = document.documentElement;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  // Motion was requested in <head>; drop it if the libraries failed to load.
  if (root.classList.contains('js-motion') && !hasGsap) root.classList.remove('js-motion');

  var MOTION = root.classList.contains('js-motion');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  if (MOTION) gsap.registerPlugin(ScrollTrigger);

  // Expo-style curves used throughout; never GSAP's default ease.
  var EASE_OUT = 'expo.out';
  var EASE_INOUT = 'expo.inOut';

  /* ── 2. live clock + year ─────────────────────────────── */

  var clocks = document.querySelectorAll('.clock');
  var fmtLong = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Argentina/Salta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  function tick() {
    var now = new Date();
    var t = fmtLong.format(now);
    clocks.forEach(function (el) {
      // the footer clock drops the seconds
      el.textContent = el.closest('.foot') ? t.slice(0, 5) : t;
      el.setAttribute('datetime', now.toISOString());
    });
  }
  tick();
  setInterval(tick, 1000);

  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ── 3. smooth scroll + anchors ───────────────────────── */

  if (MOTION && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return 1 - Math.pow(2, -10 * t); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (target === 0) window.scrollTo(0, 0);
    else target.scrollIntoView();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    if (root.classList.contains('menu-open')) closeMenu(false);
    scrollToTarget(target);
    // keep keyboard focus in step with the scroll position
    var focusEl = target === 0 ? document.getElementById('main') : target;
    focusEl.setAttribute('tabindex', '-1');
    focusEl.focus({ preventScroll: true });
  });

  /* ── 4. nav + mobile menu ─────────────────────────────── */

  var nav = document.querySelector('.nav');
  var lastY = window.scrollY;

  function onScrollNav(y) {
    if (root.classList.contains('menu-open')) return;
    var goingDown = y > lastY;
    nav.classList.toggle('is-hidden', goingDown && y > window.innerHeight * 0.6);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', function (e) { onScrollNav(e.scroll); });
  else window.addEventListener('scroll', function () { onScrollNav(window.scrollY); }, { passive: true });

  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.nav__menu');
  var menuWords = menu.querySelectorAll('.menu__word, .menu__idx');

  function openMenu() {
    menu.hidden = false;
    root.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
    if (MOTION) {
      gsap.timeline()
        .fromTo(menu, { yPercent: -100 }, { yPercent: 0, duration: 0.9, ease: EASE_INOUT })
        .fromTo(menuWords, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE_OUT, stagger: 0.06 }, '-=0.35')
        .fromTo('.menu__foot', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.6');
    }
    menu.querySelector('a').focus({ preventScroll: true });
  }

  function closeMenu(returnFocus) {
    menuBtn.setAttribute('aria-expanded', 'false');
    var done = function () {
      menu.hidden = true;
      root.classList.remove('menu-open');
      if (lenis) lenis.start();
      if (returnFocus) menuBtn.focus();
    };
    if (MOTION) gsap.to(menu, { yPercent: -100, duration: 0.7, ease: EASE_INOUT, onComplete: done });
    else done();
  }

  menuBtn.addEventListener('click', function () {
    if (root.classList.contains('menu-open')) closeMenu(true); else openMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) closeMenu(true);
  });

  /* ── 5. booking demo (kept above the motion gate: works everywhere) ── */

  document.querySelectorAll('.mock-book').forEach(function (box) {
    var msg = box.querySelector('.mock-book__msg');
    box.addEventListener('click', function (e) {
      var slot = e.target.closest('button[data-time]');
      if (!slot) return;
      var was = slot.classList.contains('is-picked');
      box.querySelectorAll('.is-picked').forEach(function (b) { b.classList.remove('is-picked'); b.removeAttribute('aria-pressed'); });
      if (was) { msg.textContent = 'Pick a free slot to see the booking flow'; return; }
      slot.classList.add('is-picked');
      slot.setAttribute('aria-pressed', 'true');
      msg.textContent = 'Booked for ' + slot.dataset.time + '. Confirmation email sent, WhatsApp reminder scheduled.';
    });
  });

  /* ── 6. copy email (works everywhere) ────────────────── */

  document.querySelectorAll('.copy').forEach(function (btn) {
    var status = btn.parentElement.querySelector('.copy__status');
    var label = btn.querySelector('.copy__b');
    var timer;

    function feedback(ok) {
      label.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      status.textContent = ok ? 'Email address copied to clipboard' : 'Copy failed. Select the address and copy it manually.';
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

  // Whole linked project panels are clickable, not just their small link.
  document.querySelectorAll('.proj[data-href]').forEach(function (p) {
    p.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      window.open(p.dataset.href, '_blank', 'noopener');
    });
  });

  // Everything below is motion only.
  if (!MOTION) return;

  /* ── 7. preloader → hero intro ────────────────────────── */

  var loader = document.querySelector('.loader');
  var num = loader.querySelector('.loader__num');
  var bar = loader.querySelector('.loader__bar span');
  var heroWords = document.querySelectorAll('.hero__word');

  gsap.set(heroWords, { yPercent: 110 });
  gsap.set('.hero__meta > *, .hero__foot > *', { opacity: 0 });
  if (lenis) lenis.stop();
  window.scrollTo(0, 0);

  // Hold the curtain until the counter finishes AND fonts are in (max 2.5s).
  var fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(function (r) { setTimeout(r, 2500); })
  ]);
  var count = { v: 0 };
  var counted = new Promise(function (resolve) {
    gsap.to(count, {
      v: 100, duration: 1.7, ease: 'power3.inOut',
      onUpdate: function () {
        num.textContent = String(Math.round(count.v)).padStart(3, '0');
        bar.style.transform = 'scaleX(' + count.v / 100 + ')';
      },
      onComplete: resolve
    });
  });

  Promise.all([counted, fontsReady]).then(function () {
    gsap.timeline({
      onComplete: function () {
        loader.remove();
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
      }
    })
      .to(num, { yPercent: -100, duration: 0.7, ease: 'power4.in' })
      .to(loader, { yPercent: -100, duration: 1.15, ease: EASE_INOUT }, '-=0.15')
      .to(heroWords, { yPercent: 0, duration: 1.5, ease: EASE_OUT, stagger: 0.11 }, '-=0.55')
      .to('.hero__meta > *', { opacity: 1, duration: 0.8, stagger: 0.08 }, '-=1.1')
      .to('.hero__foot > *', { opacity: 1, duration: 0.8, stagger: 0.12 }, '-=0.9');
  });

  /* ── 8. hero: the name leans toward the pointer ───────── */

  if (FINE) {
    var movers = Array.prototype.map.call(heroWords, function (w) {
      return { depth: parseFloat(w.dataset.depth) || 1, to: gsap.quickTo(w, 'x', { duration: 1.4, ease: 'power3.out' }) };
    });
    var hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var amp = Math.min(window.innerWidth * 0.025, 40);
      movers.forEach(function (m) { m.to(nx * amp * m.depth); });
    });
    hero.addEventListener('pointerleave', function () { movers.forEach(function (m) { m.to(0); }); });
  }

  /* ── 9. selected work: pinned horizontal track ────────── */
  // Created before every other ScrollTrigger so their positions include the pin.

  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    var section = document.querySelector('.work');
    var track = document.querySelector('.work__track');
    var progress = document.querySelector('.work__progress span');

    function distance() {
      var pad = parseFloat(getComputedStyle(document.querySelector('.work__pin')).paddingLeft) || 0;
      return Math.max(0, track.scrollWidth + pad * 2 - window.innerWidth);
    }

    gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: function () { return '+=' + distance(); },
        // pin the inner wrapper so .work itself grows by the pin distance
        // and the theme trigger below measures the whole sequence
        pin: '.work__pin',
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: function (self) { progress.style.transform = 'scaleX(' + self.progress + ')'; }
      }
    });
  });

  /* ── 10. scroll reveals ────────────────────────────────── */

  // Giant section titles rise out of their own clip line.
  document.querySelectorAll('.sec-head__title').forEach(function (h) {
    var span = document.createElement('span');
    while (h.firstChild) span.appendChild(h.firstChild);
    h.appendChild(span);
    gsap.from(span, {
      yPercent: 105, duration: 1.3, ease: EASE_OUT,
      scrollTrigger: { trigger: h, start: 'top 88%' }
    });
  });

  // Editorial paragraph: words rise line by line (stagger follows the
  // real line breaks, measured after layout).
  document.querySelectorAll('.split-lines').forEach(function (p) {
    splitWords(p);
    var inner = p.querySelectorAll('.w > span');
    gsap.set(inner, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: p, start: 'top 80%', once: true,
      onEnter: function () {
        var line = -1, prevTop = null;
        inner.forEach(function (s) {
          var top = s.parentNode.offsetTop;
          if (top !== prevTop) { line++; prevTop = top; }
          gsap.to(s, { yPercent: 0, duration: 1.1, ease: EASE_OUT, delay: line * 0.085 });
        });
      }
    });
  });

  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          frag.appendChild(wordSpan(document.createTextNode(part)));
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) {
        // inline emphasis: split its words but keep the element around each one
        var words = node.textContent.split(/\s+/).filter(Boolean);
        var frag2 = document.createDocumentFragment();
        words.forEach(function (w, i) {
          var clone = node.cloneNode(false);
          clone.textContent = w;
          frag2.appendChild(wordSpan(clone));
          if (i < words.length - 1) frag2.appendChild(document.createTextNode(' '));
        });
        node.replaceWith(frag2);
      }
    });
  }

  function wordSpan(child) {
    var outer = document.createElement('span');
    var inner = document.createElement('span');
    outer.className = 'w';
    inner.appendChild(child);
    outer.appendChild(inner);
    return outer;
  }

  // Portrait: mask opens upward while the photo settles from a zoom.
  var portrait = document.querySelector('.portrait__mask');
  if (portrait) {
    gsap.timeline({ scrollTrigger: { trigger: portrait, start: 'top 82%' } })
      .from(portrait, { yPercent: 100, duration: 1.4, ease: EASE_INOUT })
      .from(portrait.querySelector('img'), { yPercent: -100, scale: 1.3, duration: 1.4, ease: EASE_INOUT }, 0);
  }

  // Fact rows tick in from the left, one after another.
  gsap.from('.facts > div', {
    xPercent: -4, opacity: 0, duration: 0.9, ease: EASE_OUT, stagger: 0.07,
    scrollTrigger: { trigger: '.facts', start: 'top 85%' }
  });

  // Contact headline: both lines rise, the second slightly late.
  gsap.from('.contact__line > span', {
    yPercent: 105, duration: 1.4, ease: EASE_OUT, stagger: 0.14,
    scrollTrigger: { trigger: '.contact__big', start: 'top 85%' }
  });

  /* ── 11. paper ↔ ink theme sync ────────────────────────── */
  // One fixed black layer fades in (opacity only) while a dark section
  // owns the middle of the viewport; text colours follow via html.is-ink.

  var inkActive = new Set();
  document.querySelectorAll('[data-theme="ink"]').forEach(function (sec) {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: function (self) {
        if (self.isActive) inkActive.add(sec); else inkActive.delete(sec);
        root.classList.toggle('is-ink', inkActive.size > 0);
      }
    });
  });

  /* ── 12. marquees ─────────────────────────────────────── */
  // Base drift plus a boost from scroll velocity; the direction flips
  // with the scroll direction. Only ticks while on screen.

  var scrollVel = 0, scrollDir = 1;
  if (lenis) lenis.on('scroll', function (e) { scrollVel = e.velocity; if (e.direction) scrollDir = e.direction; });

  document.querySelectorAll('.marquee').forEach(function (mq) {
    var track = mq.querySelector('.marquee__track');
    var item = track.querySelector('.marquee__item');
    var sign = parseFloat(mq.dataset.speed) || 1;
    var x = 0, itemW = 0, visible = false;

    function fill() {
      while (track.children.length > 1) track.lastChild.remove();
      itemW = item.offsetWidth;
      var copies = Math.ceil((window.innerWidth * 2) / itemW) + 1;
      for (var i = 0; i < copies; i++) track.appendChild(item.cloneNode(true));
    }
    fill();
    window.addEventListener('resize', debounce(fill, 200));
    if (document.fonts) document.fonts.ready.then(fill);

    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(mq);

    var wrap = function (v) { return ((v % itemW) - itemW) % itemW; };
    gsap.ticker.add(function (time, delta) {
      if (!visible || !itemW) return;
      var boost = Math.min(Math.abs(scrollVel) * 0.9, 24);
      x -= (1.1 + boost) * scrollDir * sign * (delta / 16.67);
      track.style.transform = 'translate3d(' + wrap(x) + 'px,0,0)';
    });
  });

  /* ── 13. custom cursor ────────────────────────────────── */

  if (FINE) {
    root.classList.add('has-cursor');
    var cursor = document.querySelector('.cursor');
    var label = cursor.querySelector('.cursor__label');
    var cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    var cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });

    window.addEventListener('pointermove', function (e) { cx(e.clientX); cy(e.clientY); cursor.classList.remove('is-hidden'); });
    document.addEventListener('pointerleave', function () { cursor.classList.add('is-hidden'); });

    document.addEventListener('pointerover', function (e) {
      var view = e.target.closest('[data-cursor]');
      var link = e.target.closest('a, button');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !view && !!link);
      if (view) label.textContent = view.dataset.cursorLabel || 'View';
    });
  }

  /* ── 14. magnetic buttons ─────────────────────────────── */

  if (FINE) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var inner = el.querySelector('.magnetic__inner');
      var ex = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      var ey = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      var ix = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' });
      var iy = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' });

      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        ex(dx * 0.3); ey(dy * 0.4);
        if (inner) { ix(dx * 0.15); iy(dy * 0.2); }
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
      });
    });
  }

  /* ── housekeeping ─────────────────────────────────────── */

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
