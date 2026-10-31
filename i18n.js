/* ============================================================
   Alvaro Aramayo Chain — portfolio
   Language switch (English / Spanish). No framework.

   Every translatable node in index.html carries one of:
     data-i18n       → replaces textContent
     data-i18n-aria  → replaces aria-label
     data-i18n-alt   → replaces alt
   This file is the source of truth for all copy. The English text
   inside index.html is only a fallback for visitors without JS
   (and for crawlers); it is overwritten on load.

   Language order: ?lang=es|en  →  saved choice  →  browser language.
   Loaded as a plain script at the end of <body>, so the right
   language is in place before the first paint (no flash, no shift).
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'aac-lang';
  var LANGS = ['en', 'es'];

  var DICT = {
    en: {
      'meta.title': 'Alvaro Aramayo Chain — Full Stack Developer',
      'meta.desc':  'Full stack developer based in Argentina. Websites and web applications with WhatsApp and email integrations, built end to end.',

      'skip':          'Skip to content',
      'nav.home':      'Alvaro Aramayo Chain, back to top',
      'nav.sections':  'Sections',
      'nav.language':  'Language',
      'nav.about':     'About',
      'nav.work':      'Work',
      'nav.stack':     'Stack',
      'nav.contact':   'Contact',
      'nav.menu':      'Menu',
      'nav.close':     'Close',

      'hero.role': 'Full Stack Developer',
      'hero.loc':  'Based in Argentina',
      'hero.tz':   'Salta, GMT−3',
      'hero.lede': 'I build institutional websites, functional sites and web applications — designed, built and shipped end to end, from the first line of backend code to the interface a client actually uses.',
      'hero.cta1': 'See the work',
      'hero.cta2': 'Get in touch',

      'about.title':    'I make web products that hold up once real customers start using them.',
      'about.photoAlt': 'Portrait of Alvaro Aramayo Chain',
      'about.p1':  'Most of my work sits where a website stops being a brochure and starts doing a job — taking a booking, sending the confirmation, remembering to follow up. I care about the boring parts: clean data, sane backend structure, nothing that falls over on a busy Saturday.',
      'about.p2':  'I usually work the whole flow solo: scope it out with whoever\'s asking, build the backend and the interface, wire up WhatsApp and email so nothing gets forgotten, and stay close after launch to fix what actually breaks. Studying cybersecurity alongside that pushes me to default to systems that are hardened from the start.',
      'about.f1k': 'Focus',        'about.f1v': 'Websites and web applications',
      'about.f2k': 'Integrations', 'about.f2v': 'WhatsApp and email',
      'about.f3k': 'Practice',     'about.f3v': 'Backend best practices',
      'about.f4k': 'Studying',     'about.f4v': 'Cybersecurity',
      'about.f5k': 'Based in',     'about.f5v': 'Argentina, works remotely',
      'about.h1t': 'End to end',
      'about.h1d': 'One person across backend, interface and integrations — fewer handoffs, fewer things lost in translation.',
      'about.h2t': 'Automation-minded',
      'about.h2d': 'If a step repeats — a reminder, a confirmation, a follow-up — it belongs in the system, not on someone\'s to-do list.',
      'about.h3t': 'Security-aware',
      'about.h3d': 'Cybersecurity study feeds back into the day job: data handled carefully by default, not as an afterthought.',

      'work.title':      'Real products, built end to end.',
      'status.done':     'Completed',
      'status.dev':      'In development',
      'status.template': 'Reusable template',
      'link.live':       'Live site',
      'link.code':       'Code',
      'a11y.newtab':     '(opens in a new tab)',

      'p1.title': 'Salta Sistemas — corporate website',
      'p1.desc':  'Institutional site for an IT services company in Salta: service catalog, past work and a contact form, all managed from an admin panel.',
      'p2.title': 'Condor Seguridad — security company website',
      'p2.desc':  'Corporate site for a private security firm in the Puna region of Salta, presenting its services to the mining operations it works with.',
      'p3.short': 'Booking platform',
      'p3.title': 'Booking & appointments platform',
      'p3.desc':  'Scheduling SaaS for salons, clinics and studios: customers book a free slot online and the business gets a clean agenda.',
      'p3.stack': 'Multi-tenant web app · WhatsApp reminders · Email confirmations',
      'p4.title': 'Secure Password Generator — desktop app',
      'p4.desc':  'Generates strong random passwords from a retro padlock-shaped window, in Spanish or English, for Windows, macOS and Linux.',
      'p4.stack': 'Python · Cross-platform builds · Tests & CI · MIT',
      'p5.title': 'mochec — agrochemical product site',
      'p5.desc':  'Product catalog for an agrochemical company, with a WhatsApp-first contact flow instead of online checkout.',
      'p5.stack': 'Python · Flask · JSON catalog · WhatsApp',
      'p6.title': 'Agrofuturo — "under construction" page',
      'p6.desc':  'Brand-first holding page for an agrochemicals and farm-supply company while its full site is being built.',
      'p6.stack': 'HTML · CSS · Custom branding',
      'p6.alt':   'Agrofuturo S.R.L. under-construction page',
      'p7.short': 'Coming soon',
      'p7.title': '"Coming soon" placeholder page',
      'p7.desc':  'A one-page site a business can put live in minutes while its real website gets built.',
      'p7.stack': 'HTML · CSS · Email capture',

      'stack.title':   'What I work with, grouped by what it\'s for.',
      'stack.lang':    'Languages',
      'stack.data':    'Frameworks & data',
      'stack.tools':   'Tools',
      'stack.infra':   'Infrastructure',
      'stack.ai':      'AI',
      'stack.apis':    'APIs',
      'stack.hosting': 'Hosting',
      'stack.vps':     'VPS',
      'stack.domains': 'Domains',

      'contact.title':      'Let\'s work together.',
      'contact.lede':       'Have something to build? Tell me about it.',
      'contact.email':      'Email',
      'contact.studio':     'Studio',
      'contact.studioNote': 'Web development',
      'contact.githubNote': 'Code & side projects',
      'contact.copy':       'Copy email',
      'contact.copied':     'Copied',
      'contact.copyKeys':   'Press Ctrl+C',
      'contact.copiedSr':   'Email address copied to clipboard',
      'contact.copyFailSr': 'Copy failed. Select the address and copy it manually.',

      'foot.loc': 'Salta, Argentina',
      'foot.top': 'Back to top'
    },

    es: {
      'meta.title': 'Alvaro Aramayo Chain — Desarrollador Full Stack',
      'meta.desc':  'Desarrollador full stack en Argentina. Sitios y aplicaciones web con integraciones de WhatsApp y email, de punta a punta.',

      'skip':          'Ir al contenido',
      'nav.home':      'Alvaro Aramayo Chain, volver arriba',
      'nav.sections':  'Secciones',
      'nav.language':  'Idioma',
      'nav.about':     'Sobre mí',
      'nav.work':      'Proyectos',
      'nav.stack':     'Tecnologías',
      'nav.contact':   'Contacto',
      'nav.menu':      'Menú',
      'nav.close':     'Cerrar',

      'hero.role': 'Desarrollador Full Stack',
      'hero.loc':  'Desde Argentina',
      'hero.tz':   'Salta, GMT−3',
      'hero.lede': 'Creo sitios institucionales, sitios funcionales y aplicaciones web — diseñados, construidos y publicados de punta a punta, desde la primera línea de código del backend hasta la interfaz que el cliente realmente usa.',
      'hero.cta1': 'Ver proyectos',
      'hero.cta2': 'Escribime',

      'about.title':    'Hago productos web que aguantan cuando empiezan a usarlos clientes reales.',
      'about.photoAlt': 'Retrato de Alvaro Aramayo Chain',
      'about.p1':  'Casi todo mi trabajo está donde un sitio deja de ser un folleto y empieza a hacer una tarea: tomar una reserva, enviar la confirmación, acordarse del seguimiento. Me importan las partes aburridas: datos limpios, una estructura de backend sensata, nada que se caiga un sábado con mucho movimiento.',
      'about.p2':  'Normalmente hago todo el flujo solo: defino el alcance con quien lo pide, construyo el backend y la interfaz, conecto WhatsApp y el email para que no se pierda nada, y sigo cerca después del lanzamiento para arreglar lo que realmente falla. Estudiar ciberseguridad en paralelo me lleva a construir sistemas seguros desde el principio.',
      'about.f1k': 'Enfoque',        'about.f1v': 'Sitios y aplicaciones web',
      'about.f2k': 'Integraciones',  'about.f2v': 'WhatsApp y email',
      'about.f3k': 'Práctica',       'about.f3v': 'Buenas prácticas de backend',
      'about.f4k': 'Estudiando',     'about.f4v': 'Ciberseguridad',
      'about.f5k': 'Ubicación',      'about.f5v': 'Argentina, trabajo remoto',
      'about.h1t': 'De punta a punta',
      'about.h1d': 'Una sola persona para backend, interfaz e integraciones: menos traspasos y menos cosas que se pierden en el camino.',
      'about.h2t': 'Mentalidad de automatización',
      'about.h2d': 'Si un paso se repite —un recordatorio, una confirmación, un seguimiento— tiene que estar en el sistema, no en la lista de pendientes de alguien.',
      'about.h3t': 'Con la seguridad presente',
      'about.h3d': 'Lo que estudio de ciberseguridad vuelve al trabajo diario: los datos se tratan con cuidado por defecto, no como algo que se agrega al final.',

      'work.title':      'Productos reales, construidos de punta a punta.',
      'status.done':     'Finalizado',
      'status.dev':      'En desarrollo',
      'status.template': 'Plantilla reutilizable',
      'link.live':       'Ver sitio',
      'link.code':       'Código',
      'a11y.newtab':     '(se abre en una pestaña nueva)',

      'p1.title': 'Salta Sistemas — sitio institucional',
      'p1.desc':  'Sitio institucional para una empresa de servicios informáticos de Salta: catálogo de servicios, trabajos realizados y formulario de contacto, administrable desde un panel.',
      'p2.title': 'Condor Seguridad — sitio de empresa de seguridad',
      'p2.desc':  'Sitio corporativo para una empresa de seguridad privada de la Puna salteña, que presenta sus servicios a las operaciones mineras con las que trabaja.',
      'p3.short': 'Plataforma de turnos',
      'p3.title': 'Plataforma de turnos y reservas',
      'p3.desc':  'SaaS de turnos para peluquerías, consultorios y estudios: el cliente reserva online un horario libre y el negocio tiene una agenda ordenada.',
      'p3.stack': 'App web multi-negocio · Recordatorios por WhatsApp · Confirmaciones por email',
      'p4.title': 'Secure Password Generator — app de escritorio',
      'p4.desc':  'Genera contraseñas aleatorias seguras desde una ventana con forma de candado retro, en español o inglés, para Windows, macOS y Linux.',
      'p4.stack': 'Python · Builds multiplataforma · Tests y CI · MIT',
      'p5.title': 'mochec — sitio de productos agroquímicos',
      'p5.desc':  'Catálogo de productos para una empresa de agroquímicos, con contacto por WhatsApp en lugar de compra online.',
      'p5.stack': 'Python · Flask · Catálogo en JSON · WhatsApp',
      'p6.title': 'Agrofuturo — página «en construcción»',
      'p6.desc':  'Página de espera centrada en la marca para una empresa de agroquímicos e insumos agrícolas, mientras se construye su sitio completo.',
      'p6.stack': 'HTML · CSS · Marca personalizada',
      'p6.alt':   'Página en construcción de Agrofuturo S.R.L.',
      'p7.short': 'Próximamente',
      'p7.title': 'Página provisional «próximamente»',
      'p7.desc':  'Un sitio de una sola página que un negocio puede publicar en minutos mientras se construye su web definitiva.',
      'p7.stack': 'HTML · CSS · Captura de emails',

      'stack.title':   'Con qué trabajo, agrupado según para qué sirve.',
      'stack.lang':    'Lenguajes',
      'stack.data':    'Frameworks y datos',
      'stack.tools':   'Herramientas',
      'stack.infra':   'Infraestructura',
      'stack.ai':      'IA',
      'stack.apis':    'APIs',
      'stack.hosting': 'Hosting',
      'stack.vps':     'VPS',
      'stack.domains': 'Dominios',

      'contact.title':      'Trabajemos juntos.',
      'contact.lede':       '¿Tenés algo para construir? Contame.',
      'contact.email':      'Email',
      'contact.studio':     'Estudio',
      'contact.studioNote': 'Desarrollo web',
      'contact.githubNote': 'Código y proyectos propios',
      'contact.copy':       'Copiar email',
      'contact.copied':     'Copiado',
      'contact.copyKeys':   'Usá Ctrl+C',
      'contact.copiedSr':   'Dirección de email copiada al portapapeles',
      'contact.copyFailSr': 'No se pudo copiar. Seleccioná la dirección y copiala a mano.',

      'foot.loc': 'Salta, Argentina',
      'foot.top': 'Volver arriba'
    }
  };

  var root = document.documentElement;
  var current = 'en';

  function storageGet() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storageSet(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* private mode: keep it for this visit only */ }
  }

  function initialLang() {
    var param = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.indexOf(param) !== -1) return param;
    var saved = storageGet();
    if (LANGS.indexOf(saved) !== -1) return saved;
    return /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
  }

  function t(key) {
    var dict = DICT[current];
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : DICT.en[key];
  }

  function render() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.dataset.i18nAlt)); });

    root.lang = current;
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]').setAttribute('content', t('meta.desc'));
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === current));
    });
  }

  function setLang(lang, animate) {
    if (LANGS.indexOf(lang) === -1 || (lang === current && animate)) return;
    current = lang;
    storageSet(lang);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduce) { render(); return; }
    // short opacity dip on the texts, swap while they are invisible
    root.classList.add('is-switching');
    setTimeout(function () {
      render();
      root.classList.remove('is-switching');
    }, 160);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.lang__btn');
    if (btn) setLang(btn.dataset.lang, true);
  });

  current = initialLang();
  render();

  // other scripts (copy feedback) read strings through this
  window.i18n = { t: t, get lang() { return current; } };
})();
