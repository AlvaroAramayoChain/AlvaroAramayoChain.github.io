/* ============================================================
   Alvaro Aramayo Chain — portfolio
   Language switch (English / Spanish)

   How it works
   ------------
   Every translatable node in index.html carries one of:
     data-i18n       → replaces textContent
     data-i18n-html  → replaces innerHTML (copy that contains markup)
     data-i18n-aria  → replaces the aria-label attribute
     data-i18n-alt   → replaces the alt attribute
   The English strings stay inline in the HTML so the page still
   reads correctly if this file ever fails to load.

   The client site recreations inside the demo frames are left in
   Spanish on purpose — they mirror real Spanish-language sites.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'aac-lang';
  var LANGS = ['en', 'es'];

  var DICT = {
    en: {
      'meta.title':  'Alvaro Aramayo Chain — Web Developer',
      'meta.desc':   'Web developer building websites and web applications, with WhatsApp and email integrations. Based in Argentina.',
      'meta.ogTitle':'Alvaro Aramayo Chain — Web Developer',
      'meta.ogDesc': 'Web developer building websites and web applications. Based in Argentina.',

      'skip':          'Skip to content',
      'nav.mark':      'Portfolio — Alvaro Aramayo Chain',
      'nav.top':       'Back to top',
      'nav.sections':  'Sections',
      'nav.about':     'About',
      'nav.work':      'Work',
      'nav.toolkit':   'Toolkit',
      'nav.contact':   'Contact',
      'nav.language':  'Language',
      'nav.langEs':    'Cambiar a español',
      'nav.langEn':    'Switch to English',

      'hero.l1':      'I build institutional',
      'hero.l2':      'websites, functional sites',
      'hero.l3':      'and <em>web applications</em>.',
      'hero.sub':     'Designed, built and shipped end to end — from the first line of backend code to the interface a client actually uses.',
      'hero.cta1':    'See the work',
      'hero.cta2':    'Get in touch',

      'about.eyebrow':     'About',
      'about.portraitAlt': 'Portrait of Alvaro Aramayo Chain',
      'about.h2':  "Hi, I'm Alvaro. I make web products that hold up once real customers start using them.",
      'about.p1':  'Most of my work sits where a website stops being a brochure and starts doing a job — taking a booking, sending the confirmation, remembering to follow up. I care about the boring parts: clean data, sane backend structure, nothing that falls over on a busy Saturday.',
      'about.p2':  'I usually work the whole flow solo: scope it out with whoever’s asking, build the backend and the interface, wire up WhatsApp and email so nothing gets forgotten, and stay close after launch to fix what actually breaks — not just what looks broken. Studying cybersecurity alongside that pushes me to default to systems that are hardened from the start, instead of patched after something goes wrong.',
      'about.f1':  '<span>Focus</span> Websites and web applications',
      'about.f2':  '<span>Integrations</span> WhatsApp and email',
      'about.f3':  '<span>Practice</span> Backend best practices',
      'about.f4':  '<span>Studying</span> Cybersecurity',
      'about.f5':  '<span>Based in</span> Argentina · works remotely',
      'about.h1t': 'End to end',
      'about.h1d': 'One person across backend, interface and integrations — fewer handoffs, fewer things lost in translation.',
      'about.h2t': 'Automation-minded',
      'about.h2d': "If a step repeats — a reminder, a confirmation, a follow-up — it belongs in the system, not on someone's to-do list.",
      'about.h3t': 'Security-aware',
      'about.h3d': 'Cybersecurity study feeds back into the day job: data handled carefully by default, not as an afterthought.',

      'work.eyebrow': 'An example of the projects I build',
      'work.h2':      'Real products, built end to end.',

      'spec.role':   'Role',
      'spec.type':   'Type',
      'spec.status': 'Status',

      'case1.title':  'Salta Sistemas — corporate website',
      'case1.what':   'The institutional website for an IT services company in Salta, Argentina — service catalog, completed-work portfolio and a contact form, backed by a content-managed admin panel instead of hard-coded pages.',
      'case1.role':   'Full-stack development',
      'case1.type':   'Institutional website · Django',
      'case1.status': 'Completed',
      'case1.c1':     'Python & Django',
      'case1.c2':     'Content-managed via admin',
      'case1.c3':     'SEO & sitemap',
      'case1.c4':     'Contact form',
      'case1.c5':     'Ticketing module ready',
      'case1.live':   'Visit the live site',
      'case1.shotAlt':'Screenshot of the Salta Sistemas homepage',

      'case2.title':  'mochec — agrochemical product site',
      'case2.what':   'A product catalog and institutional site for an agrochemical company — plant-nutrition formulations, an environmental policy page, and a WhatsApp-first contact flow instead of online checkout.',
      'case2.role':   'Full-stack development',
      'case2.type':   'Product catalog · Flask',
      'case2.status': 'In development',
      'case2.c1':     'Python & Flask',
      'case2.c2':     'JSON-driven catalog',
      'case2.c3':     'WhatsApp contact',
      'case2.c4':     'Environmental policy page',
      'case2.note':   'Simplified recreation above, not the live site — scroll or use its nav to browse the page. Runs entirely in your browser with generic sample copy; no real client names, contact details or business data shown anywhere.',

      'case3.title':   'Condor Seguridad — private security company website',
      'case3.what':    'The corporate website for Condor Seguridad S.A.S., a private security firm based in the Puna region of Salta, Argentina — presenting its services (surveillance, armed escort, cargo and asset protection) and putting the company in front of the mining operations it works with.',
      'case3.role':    'Full-stack development',
      'case3.type':    'Institutional website',
      'case3.status':  'Completed',
      'case3.c1':      'Institutional website',
      'case3.c2':      'Service catalog',
      'case3.c3':      'Contact form',
      'case3.c4':      'Mobile-first',
      'case3.shotAlt': 'Screenshot of the Condor Seguridad S.A.S. homepage',

      'case4.title':  '"Coming soon" placeholder page',
      'case4.what':   "A simple single-page site for a business whose real website isn't ready yet — a clear message and a way to get in touch, live in minutes instead of waiting on the full build.",
      'case4.role':   'Design & development',
      'case4.type':   'Single-page site',
      'case4.status': 'Reusable template',
      'case4.c1':     'Fast to deploy',
      'case4.c2':     'Custom branding',
      'case4.c3':     'Email capture',
      'case4.c4':     'Mobile-first',
      'case4.note':   "Demo only — the form doesn't send anywhere. Same idea I'd set up for any client: swap the name, colors and message and it's ready to go live while the full site gets built.",

      'case5.title':   'Agrofuturo — "under construction" landing page',
      'case5.what':    'A holding page for Agrofuturo S.R.L., an agrochemicals and farm-supply company, while its full site is being built — brand-first design and a clear message that something is on the way.',
      'case5.role':    'Design & development',
      'case5.type':    'Holding page',
      'case5.status':  'In development',
      'case5.c1':      'Custom branding',
      'case5.c2':      'Mobile-first',
      'case5.c3':      'Fast to deploy',
      'case5.shotAlt': 'Screenshot of the Agrofuturo S.R.L. under-construction landing page',
      'case5.note':    "Not linked yet — the full site for this client is still in development, so there's no public link to share for now.",

      'toolkit.eyebrow': 'Toolkit',
      'toolkit.h2':      "What I work with, grouped by what it's for.",
      'toolkit.write':   'Write',
      'toolkit.store':   'Store',
      'toolkit.run':     'Run',
      'toolkit.ship':    'Ship',
      'toolkit.assist':  'Assist',
      'toolkit.hosting': 'Hosting management',

      'contact.eyebrow':    'Contact',
      'contact.h2':         'Have something to build?',
      'contact.cardonLabel':'Web development'
    },

    es: {
      'meta.title':  'Alvaro Aramayo Chain — Desarrollador web',
      'meta.desc':   'Desarrollador web que construye sitios y aplicaciones web, con integraciones de WhatsApp y email. Basado en Argentina.',
      'meta.ogTitle':'Alvaro Aramayo Chain — Desarrollador web',
      'meta.ogDesc': 'Desarrollador web que construye sitios y aplicaciones web. Basado en Argentina.',

      'skip':          'Ir al contenido',
      'nav.mark':      'Portafolio — Alvaro Aramayo Chain',
      'nav.top':       'Volver arriba',
      'nav.sections':  'Secciones',
      'nav.about':     'Sobre mí',
      'nav.work':      'Trabajo',
      'nav.toolkit':   'Herramientas',
      'nav.contact':   'Contacto',
      'nav.language':  'Idioma',
      'nav.langEs':    'Cambiar a español',
      'nav.langEn':    'Switch to English',

      'hero.l1':      'Creo sitios institucionales,',
      'hero.l2':      'sitios funcionales',
      'hero.l3':      'y <em>aplicaciones web</em>.',
      'hero.sub':     'Diseñado, construido y publicado de punta a punta: desde la primera línea de código del backend hasta la interfaz que el cliente realmente usa.',
      'hero.cta1':    'Ver el trabajo',
      'hero.cta2':    'Escribime',

      'about.eyebrow':     'Sobre mí',
      'about.portraitAlt': 'Retrato de Alvaro Aramayo Chain',
      'about.h2':  'Hola, soy Alvaro. Hago productos web que aguantan cuando empiezan a usarlos clientes reales.',
      'about.p1':  'Casi todo mi trabajo está donde un sitio deja de ser un folleto y empieza a hacer una tarea: tomar una reserva, enviar la confirmación, acordarse del seguimiento. Me importan las partes aburridas: datos limpios, una estructura de backend sensata, nada que se caiga un sábado con mucho movimiento.',
      'about.p2':  'Normalmente hago todo el flujo solo: defino el alcance con quien lo pide, construyo el backend y la interfaz, conecto WhatsApp y el email para que no se pierda nada, y sigo cerca después del lanzamiento para arreglar lo que realmente falla, no solo lo que parece fallar. Estudiar ciberseguridad en paralelo me empuja a partir de sistemas endurecidos desde el principio, en lugar de parchearlos después de que algo salga mal.',
      'about.f1':  '<span>Enfoque</span> Sitios y aplicaciones web',
      'about.f2':  '<span>Integraciones</span> WhatsApp y email',
      'about.f3':  '<span>Práctica</span> Buenas prácticas de backend',
      'about.f4':  '<span>Estudiando</span> Ciberseguridad',
      'about.f5':  '<span>Ubicación</span> Argentina · trabajo remoto',
      'about.h1t': 'De punta a punta',
      'about.h1d': 'Una sola persona para backend, interfaz e integraciones: menos traspasos y menos cosas que se pierden en el camino.',
      'about.h2t': 'Mentalidad de automatización',
      'about.h2d': 'Si un paso se repite —un recordatorio, una confirmación, un seguimiento— tiene que estar en el sistema, no en la lista de pendientes de alguien.',
      'about.h3t': 'Con la seguridad presente',
      'about.h3d': 'Lo que estudio de ciberseguridad vuelve al trabajo diario: los datos se tratan con cuidado por defecto, no como algo que se agrega al final.',

      'work.eyebrow': 'Un ejemplo de los proyectos que construyo',
      'work.h2':      'Productos reales, construidos de punta a punta.',

      'spec.role':   'Rol',
      'spec.type':   'Tipo',
      'spec.status': 'Estado',

      'case1.title':  'Salta Sistemas — sitio institucional',
      'case1.what':   'El sitio institucional de una empresa de servicios informáticos de Salta, Argentina: catálogo de servicios, portfolio de trabajos realizados y formulario de contacto, con un panel de administración para gestionar el contenido en lugar de páginas fijas en el código.',
      'case1.role':   'Desarrollo full-stack',
      'case1.type':   'Sitio institucional · Django',
      'case1.status': 'Finalizado',
      'case1.c1':     'Python y Django',
      'case1.c2':     'Contenido gestionado desde el admin',
      'case1.c3':     'SEO y sitemap',
      'case1.c4':     'Formulario de contacto',
      'case1.c5':     'Módulo de tickets preparado',
      'case1.live':   'Ver el sitio publicado',
      'case1.shotAlt':'Captura de pantalla de la página principal de Salta Sistemas',

      'case2.title':  'mochec — sitio de productos agroquímicos',
      'case2.what':   'Catálogo de productos y sitio institucional para una empresa de agroquímicos: formulaciones de nutrición vegetal, una página de política medioambiental y un flujo de contacto por WhatsApp en lugar de compra online.',
      'case2.role':   'Desarrollo full-stack',
      'case2.type':   'Catálogo de productos · Flask',
      'case2.status': 'En desarrollo',
      'case2.c1':     'Python y Flask',
      'case2.c2':     'Catálogo basado en JSON',
      'case2.c3':     'Contacto por WhatsApp',
      'case2.c4':     'Página de política medioambiental',
      'case2.note':   'Arriba hay una recreación simplificada, no el sitio real: scrolleá o usá su navegación para recorrer la página. Funciona enteramente en tu navegador con contenido de ejemplo genérico; no se muestran nombres de clientes, datos de contacto ni información real del negocio.',

      'case3.title':   'Condor Seguridad — sitio de empresa de seguridad privada',
      'case3.what':    'El sitio institucional de Condor Seguridad S.A.S., una empresa de seguridad privada con base en la Puna de Salta, Argentina: presenta sus servicios (vigilancia, custodia armada, protección de bienes y cargas) y muestra a la empresa ante las operaciones mineras con las que trabaja.',
      'case3.role':    'Desarrollo full-stack',
      'case3.type':    'Sitio institucional',
      'case3.status':  'Finalizado',
      'case3.c1':      'Sitio institucional',
      'case3.c2':      'Catálogo de servicios',
      'case3.c3':      'Formulario de contacto',
      'case3.c4':      'Pensado para móvil',
      'case3.shotAlt': 'Captura de pantalla de la página principal de Condor Seguridad S.A.S.',

      'case4.title':  'Página provisional «próximamente»',
      'case4.what':   'Un sitio de una sola página para un negocio cuya web definitiva todavía no está lista: un mensaje claro y una forma de contacto, online en minutos en vez de esperar el desarrollo completo.',
      'case4.role':   'Diseño y desarrollo',
      'case4.type':   'Sitio de una sola página',
      'case4.status': 'Plantilla reutilizable',
      'case4.c1':     'Rápido de desplegar',
      'case4.c2':     'Marca personalizada',
      'case4.c3':     'Captura de emails',
      'case4.c4':     'Pensado para móvil',
      'case4.note':   'Solo demo: el formulario no envía a ningún lado. Es la misma idea que armaría para cualquier cliente: se cambian el nombre, los colores y el mensaje, y queda lista para publicar mientras se construye el sitio completo.',

      'case5.title':   'Agrofuturo — página «en construcción»',
      'case5.what':    'Una página de espera para Agrofuturo S.R.L., una empresa de agroquímicos e insumos para el campo, mientras se construye su sitio completo: diseño centrado en la marca y un mensaje claro de que algo está por venir.',
      'case5.role':    'Diseño y desarrollo',
      'case5.type':    'Página de espera',
      'case5.status':  'En desarrollo',
      'case5.c1':      'Marca personalizada',
      'case5.c2':      'Pensado para móvil',
      'case5.c3':      'Rápido de desplegar',
      'case5.shotAlt': 'Captura de pantalla de la página en construcción de Agrofuturo S.R.L.',
      'case5.note':    'Todavía sin publicar: el sitio completo de este cliente sigue en desarrollo, así que por ahora no hay un link público para compartir.',

      'toolkit.eyebrow': 'Herramientas',
      'toolkit.h2':      'Con qué trabajo, agrupado según para qué sirve.',
      'toolkit.write':   'Escribir',
      'toolkit.store':   'Guardar',
      'toolkit.run':     'Ejecutar',
      'toolkit.ship':    'Publicar',
      'toolkit.assist':  'Asistir',
      'toolkit.hosting': 'Gestión de hosting',

      'contact.eyebrow':    'Contacto',
      'contact.h2':         '¿Tenés algo para construir?',
      'contact.cardonLabel':'Desarrollo web'
    }
  };

  /* ── pick the starting language ─────────────────────────────
     1. what the visitor chose last time  2. browser language
     3. English as the fallback                                */

  function stored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return LANGS.indexOf(v) > -1 ? v : null;
    } catch (e) { return null; }
  }

  function fromBrowser() {
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i]).toLowerCase();
      if (tag.indexOf('es') === 0) return 'es';
      if (tag.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }

  var current = stored() || fromBrowser();

  /* ── apply ──────────────────────────────────────────────── */

  function setMeta(selector, value) {
    var el = document.querySelector(selector);
    if (el && value) el.setAttribute('content', value);
  }

  function apply(lang) {
    var d = DICT[lang] || DICT.en;
    current = lang;

    document.documentElement.setAttribute('lang', lang);

    if (d['meta.title']) document.title = d['meta.title'];
    setMeta('meta[name="description"]', d['meta.desc']);
    setMeta('meta[property="og:title"]', d['meta.ogTitle']);
    setMeta('meta[property="og:description"]', d['meta.ogDesc']);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-html')];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-alt')];
      if (v != null) el.setAttribute('alt', v);
    });

    document.querySelectorAll('.lang__btn').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-active', on);
    });

    document.dispatchEvent(new CustomEvent('languagechange:site', { detail: { lang: lang } }));
  }

  function setLang(lang, remember) {
    if (LANGS.indexOf(lang) === -1 || lang === current) return;
    apply(lang);
    if (remember !== false) {
      try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }
  }

  /* ── wiring ─────────────────────────────────────────────── */

  document.querySelectorAll('.lang__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'), true);
    });
  });

  apply(current);

  // expose a tiny hook, handy for testing from the console
  window.siteI18n = {
    dict: DICT,
    get lang() { return current; },
    set: function (l) { setLang(l, true); }
  };
})();
