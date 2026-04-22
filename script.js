/* ================================================================
   PORTAFOLIO PERSONAL - Ángel Sepúlveda
   script.js — Lógica e interactividad

   ÍNDICE:
   1.  Inicialización
   2.  Intro / Splash Screen
   3.  Arranque del sitio
   4.  Sistema de idioma i18n (ES ↔ EN)
   5.  Cursor personalizado
   6.  Canvas de partículas
   7.  Navbar
   8.  Typewriter multiidioma
   9.  Animaciones de scroll
   10. Formulario de contacto
   11. Botón volver arriba
   12. Año en footer
   ================================================================ */


/* ================================================================
   1. INICIALIZACIÓN
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initIntroScreen();
});


/* ================================================================
   2. INTRO SCREEN
   Reducida a ~3s total para no aburrir al visitante.
   Secuencia:
   0.3s  → "Hola, yo soy"
   0.6s  → "Ángel"
   0.85s → "Sepúlveda" (shimmer)
   1.4s  → 3 palabras clave (pop)
   1.8s  → barra de progreso arranca
   2.6s  → barra al 100%, intro se oculta
   ================================================================ */
function initIntroScreen() {
  const screen    = document.getElementById('introScreen');
  const loaderBar = document.getElementById('introLoaderBar');
  const loadingTxt= document.getElementById('introLoadingText');

  if (!screen) { bootSite(); return; }

  // Aplicar idioma guardado también en la intro
  const savedLang = localStorage.getItem('lang') || 'es';
  applyIntroLang(savedLang);

  let progress = 0;

  // Mensajes de carga multiidioma
  const loadingMessages = {
    es: ['Cargando portafolio...', 'Preparando proyectos...', 'Casi listo...', '¡Aquí vamos! 🚀'],
    en: ['Loading portfolio...', 'Preparing projects...', 'Almost there...', "Let's go! 🚀"]
  };

  // La barra arranca cuando las animaciones CSS ya terminaron (~1.8s)
  setTimeout(() => {
    const msgs      = loadingMessages[savedLang] || loadingMessages.es;
    const barDuration = 750; // ms totales de la barra
    const interval    = 16;
    const step        = (interval / barDuration) * 100;
    let   msgIndex    = 0;

    const ticker = setInterval(() => {
      progress = Math.min(progress + step, 100);
      if (loaderBar) loaderBar.style.width = progress + '%';

      const newIdx = Math.floor((progress / 100) * msgs.length);
      if (newIdx !== msgIndex && newIdx < msgs.length) {
        msgIndex = newIdx;
        if (loadingTxt) {
          loadingTxt.style.opacity = '0';
          setTimeout(() => {
            loadingTxt.textContent  = msgs[msgIndex];
            loadingTxt.style.opacity = '1';
          }, 150);
        }
      }

      if (progress >= 100) {
        clearInterval(ticker);
        setTimeout(hideIntro, 300);
      }
    }, interval);
  }, 1800); // Reducido de 2100ms a 1800ms

  function hideIntro() {
    screen.classList.add('hiding');
    setTimeout(() => {
      screen.classList.add('hidden');
      bootSite();
    }, 850);
  }
}

/* Traduce los textos visibles en la intro antes de mostrarla */
function applyIntroLang(lang) {
  document.querySelectorAll('[data-i18n-intro]').forEach(el => {
    const key = el.getAttribute('data-i18n-intro');
    const val = (translations[lang] || translations.es)[key];
    if (val) el.textContent = val;
  });
}


/* ================================================================
   3. ARRANQUE DEL SITIO
   ================================================================ */
function bootSite() {
  initI18n();       // Sistema de idioma — primero para que todo tenga texto correcto
  initCursor();
  initParticles();
  initNavbar();
  initTypewriter();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
  initFooterYear();
}


/* ================================================================
   4. SISTEMA DE IDIOMA i18n (ES ↔ EN)
   ─────────────────────────────────────────────────────────────────
   Cómo funciona:
   • Cada elemento con  data-i18n="clave"  recibe su traducción.
   • Cada input con  data-i18n-placeholder="clave"  recibe el placeholder.
   • El idioma se guarda en localStorage y persiste entre visitas.
   • El botón #langToggle alterna entre ES y EN sin recargar.
   ─────────────────────────────────────────────────────────────────
   Para añadir un texto nuevo:
   1. Agrega data-i18n="mi.clave" al elemento en el HTML.
   2. Agrega "mi.clave" con su texto en ambos objetos de abajo.
   ================================================================ */

/* ── DICCIONARIO DE TRADUCCIONES ── */
const translations = {

  es: {
    /* Intro */
    'intro.hello':   'Hola, yo soy',
    'intro.word1':   'Creativo',
    'intro.word2':   'Apasionado',
    'intro.word3':   'Comprometido',
    'intro.loading': 'Cargando portafolio...',

    /* Navbar */
    'nav.home':     'Inicio',
    'nav.about':    'Sobre mí',
    'nav.skills':   'Habilidades',
    'nav.projects': 'Proyectos',
    'nav.why':      '¿Por qué yo?',
    'nav.contact':  'Contacto',

    /* Hero */
    'hero.greeting':        'Hola, soy',
    'hero.bio':             'Desarrollador Frontend con enfoque en rendimiento, diseño de interfaz y experiencia de usuario. Construyo productos digitales funcionales, escalables y visualmente cuidados — desde el primer commit hasta el despliegue en producción.',
    'hero.btnProjects':     'Ver proyectos',
    'hero.btnContact':      'Contáctame',
    'hero.btnCV':           'Hoja de vida',
    'hero.available':       'Disponible para trabajar',
    'hero.photoPlaceholder':'Añade tu foto aquí',

    /* Sobre mí */
    'about.label': '01. Sobre mí',
    'about.title': 'Quién soy',
    'about.p1':    'Soy desarrollador web Junior con especialización en Frontend, apasionado por transformar requerimientos técnicos en interfaces que los usuarios disfruten usar. Mi stack principal es HTML, CSS y JavaScript, con experiencia en diseño responsivo, accesibilidad y rendimiento web.',
    'about.p2':    'Aprendo rápido, escribo código limpio y me adapto bien a entornos ágiles. Puedo trabajar de forma autónoma o en equipo, priorizando siempre la calidad del producto y la comunicación efectiva.',
    'about.p3':    'Busco mi primera experiencia profesional en una empresa donde pueda aportar valor desde el primer día, crecer junto a un equipo técnico y participar en proyectos que generen impacto real.',
    'about.ageLabel':       'Edad:',
    'about.ageUnit':        'años',
    'about.eduLabel':       'Educación:',
    'about.eduVal':         'Ingeniería en Sistemas / Autodidacta',
    'about.langLabel':      'Idiomas:',
    'about.langVal':        'Español (nativo), Inglés (básico-intermedio)',
    'about.interestsLabel': 'Intereses:',
    'about.interestsVal':   'UI/UX, Open Source, Innovación',
    'about.stat1': 'Años aprendiendo',
    'about.stat2': 'Proyectos creados',
    'about.stat3': 'Tecnologías',
    'about.stat4': 'Compromiso',

    /* Habilidades */
    'skills.label':        '02. Habilidades',
    'skills.title':        'Mi stack tecnológico',
    'skills.cat1':         'Lenguajes',
    'skills.cat2':         'Backend / Datos',
    'skills.cat3':         'Herramientas',
    'skills.integrations': 'Integraciones',
    'skills.ai':           'IA Aplicada',

    /* Proyectos */
    'projects.label':         '03. Proyectos',
    'projects.title':         'Lo que he construido',
    'projects.viewLive':      'Ver en vivo',
    'projects.openTab':       'Abrir en nueva pestaña',
    'projects.viewCode':      'Ver código',
    'projects.problem':       '🎯 Problema que resuelve',
    'projects.learned':       '📚 Qué aprendí',
    'projects.ecomarDesc':    'Plataforma de concienciación ambiental marina construida con HTML, CSS y JavaScript vanilla. Implementé diseño responsivo mobile-first, navegación con scroll suave y arquitectura modular.',
    'projects.ecomarProblem': 'Ausencia de recursos digitales atractivos sobre conservación marina para el público general.',
    'projects.ecomarLearned': 'Responsive design avanzado, estructuración de proyectos frontend y optimización de assets visuales.',
    'projects.serenaDesc':    'Aplicación web con foco en UX/UI, construida priorizando accesibilidad, claridad visual y fluidez en la interacción. Arquitectura modular y diseño responsivo cuidado al detalle.',
    'projects.serenaproblem': 'Necesidad de una interfaz web intuitiva, limpia y accesible para el usuario final.',
    'projects.serenaLearned': 'Principios de accesibilidad (WCAG), CSS escalable y buenas prácticas de UX.',

    /* ¿Por qué yo? */
    'why.label':      '04. Propuesta de valor',
    'why.title':      '¿Por qué contratarme?',
    'why.intro':      'No solo escribo código — entrego soluciones. Me involucro en cada proyecto pensando en el usuario final, la mantenibilidad del código y el impacto real del trabajo. Busco equipos donde pueda aportar, aprender y crecer.',
    'why.card1Title': 'Orientado a resultados reales',
    'why.card1Desc':  'Cada tarea tiene un objetivo claro. Cumplo plazos, priorizo lo que genera valor y entrego código que funciona antes de declararlo terminado.',
    'why.card2Title': 'Aprendizaje continuo',
    'why.card2Desc':  'Me adapto rápido a nuevas tecnologías y metodologías. El cambio no me frena — lo proceso, lo aprendo y lo aplico en el menor tiempo posible.',
    'why.card3Title': 'Colaboración efectiva',
    'why.card3Desc':  'Me comunico con claridad, acepto feedback de forma constructiva y contribuyo activamente al flujo de trabajo del equipo.',
    'why.card4Title': 'Visión de producto',
    'why.card4Desc':  'Pienso más allá del código: accesibilidad, rendimiento, UX. Lo que construyo debe ser funcional, usable y visualmente coherente.',
    'why.card5Title': 'Código limpio y mantenible',
    'why.card5Desc':  'Escribo código que el equipo puede leer, mantener y escalar. Sigo buenas prácticas y dejo comentarios donde realmente importan.',
    'why.card6Title': 'Motivación genuina',
    'why.card6Desc':  'Busco un lugar donde contribuir, crecer y construir cosas que importen. Traigo energía, iniciativa y compromiso desde el primer día.',

    /* Contacto */
    'contact.label':          '05. Contacto',
    'contact.title':          'Hablemos',
    'contact.p1':             '¿Tienes un proyecto en mente o buscas incorporar talento a tu equipo? Estoy disponible para roles de prácticas, trabajo remoto o posiciones junior.',
    'contact.p2':             'Respondo en menos de 24 horas. Prefiero conversaciones directas y concretas.',
    'contact.formEmail':      'Email',
    'contact.formEmailPh':    'tu@email.com',
    'contact.formSubject':    'Asunto',
    'contact.formSubjectPh':  '¿De qué quieres hablar?',
    'contact.formMessage':    'Mensaje',
    'contact.formMessagePh':  'Cuéntame sobre tu proyecto o propuesta...',
    'contact.formSend':       'Enviar mensaje',
    'contact.successMsg':     '✓ Abriendo tu cliente de correo...',
    'contact.errorEmpty':     'Por favor, completa todos los campos.',
    'contact.errorEmail':     'Por favor, ingresa un correo válido.',

    /* Footer */
    'footer.copy': 'Diseñado y construido para fines laborales.',
  },

  en: {
    /* Intro */
    'intro.hello':   "Hi, I'm",
    'intro.word1':   'Creative',
    'intro.word2':   'Passionate',
    'intro.word3':   'Committed',
    'intro.loading': 'Loading portfolio...',

    /* Navbar */
    'nav.home':     'Home',
    'nav.about':    'About me',
    'nav.skills':   'Skills',
    'nav.projects': 'Projects',
    'nav.why':      'Why me?',
    'nav.contact':  'Contact',

    /* Hero */
    'hero.greeting':        "Hi, I'm",
    'hero.bio':             'Frontend Developer focused on performance, UI design, and user experience. I build functional, scalable, and visually polished digital products — from the first commit to production deployment.',
    'hero.btnProjects':     'View projects',
    'hero.btnContact':      'Contact me',
    'hero.btnCV':           'Resume',
    'hero.available':       'Available for work',
    'hero.photoPlaceholder':'Add your photo here',

    /* About */
    'about.label': '01. About me',
    'about.title': 'Who I am',
    'about.p1':    "I'm a Junior Frontend Web Developer passionate about turning technical requirements into interfaces users actually enjoy. My main stack is HTML, CSS, and JavaScript, with experience in responsive design, accessibility, and web performance.",
    'about.p2':    'I learn fast, write clean code, and adapt well to agile environments. I can work independently or as part of a team, always prioritizing product quality and effective communication.',
    'about.p3':    "I'm looking for my first professional role at a company where I can add value from day one, grow alongside a technical team, and work on projects that create real impact.",
    'about.ageLabel':       'Age:',
    'about.ageUnit':        'years old',
    'about.eduLabel':       'Education:',
    'about.eduVal':         'Systems Engineering / Self-taught',
    'about.langLabel':      'Languages:',
    'about.langVal':        'Spanish (native), English (basic-intermediate)',
    'about.interestsLabel': 'Interests:',
    'about.interestsVal':   'UI/UX, Open Source, Innovation',
    'about.stat1': 'Years learning',
    'about.stat2': 'Projects built',
    'about.stat3': 'Technologies',
    'about.stat4': 'Commitment',

    /* Skills */
    'skills.label':        '02. Skills',
    'skills.title':        'My tech stack',
    'skills.cat1':         'Languages',
    'skills.cat2':         'Backend / Data',
    'skills.cat3':         'Tools',
    'skills.integrations': 'Integrations',
    'skills.ai':           'Applied AI',

    /* Projects */
    'projects.label':         '03. Projects',
    'projects.title':         "What I've built",
    'projects.viewLive':      'View live',
    'projects.openTab':       'Open in new tab',
    'projects.viewCode':      'View code',
    'projects.problem':       '🎯 Problem it solves',
    'projects.learned':       '📚 What I learned',
    'projects.ecomarDesc':    'Marine environmental awareness platform built with vanilla HTML, CSS, and JavaScript. Implemented mobile-first responsive design, smooth scroll navigation, and modular architecture.',
    'projects.ecomarProblem': 'Lack of visually engaging digital resources about marine conservation for the general public.',
    'projects.ecomarLearned': 'Advanced responsive design, frontend project structuring, and visual asset optimization.',
    'projects.serenaDesc':    'Web application focused on UX/UI, built prioritizing accessibility, visual clarity, and interaction fluidity. Modular code architecture and carefully crafted responsive design.',
    'projects.serenaproblem': 'Need for an intuitive, clean, and accessible web interface for end users.',
    'projects.serenaLearned': 'Web accessibility principles (WCAG), scalable CSS, and UX best practices.',

    /* Why me? */
    'why.label':      '04. Value proposition',
    'why.title':      'Why hire me?',
    'why.intro':      "I don't just write code — I deliver solutions. I approach every project with the end user in mind, focusing on code maintainability and real-world impact. I'm looking for teams where I can contribute, learn, and grow.",
    'why.card1Title': 'Results-driven',
    'why.card1Desc':  'Every task has a clear goal. I meet deadlines, prioritize what generates value, and deliver working code before calling it done.',
    'why.card2Title': 'Continuous learning',
    'why.card2Desc':  'I adapt quickly to new technologies and methodologies. Change does not stop me — I process it, learn it, and apply it as fast as possible.',
    'why.card3Title': 'Effective collaboration',
    'why.card3Desc':  'I communicate clearly, accept feedback constructively, and actively contribute to the team workflow.',
    'why.card4Title': 'Product mindset',
    'why.card4Desc':  'I think beyond the code: accessibility, performance, UX. What I build must be functional, usable, and visually coherent.',
    'why.card5Title': 'Clean, maintainable code',
    'why.card5Desc':  'I write code the team can read, maintain, and scale. I follow best practices and leave comments where they truly matter.',
    'why.card6Title': 'Genuine motivation',
    'why.card6Desc':  "I'm not just looking for a job. I want a place to contribute, grow, and build things that matter. I bring energy, initiative, and commitment from day one.",

    /* Contact */
    'contact.label':          '05. Contact',
    'contact.title':          "Let's talk",
    'contact.p1':             "Got a project in mind or looking to add talent to your team? I'm available for internships, remote roles, or junior positions.",
    'contact.p2':             'I reply within 24 hours. I prefer direct and concrete conversations.',
    'contact.formEmail':      'Email',
    'contact.formEmailPh':    'you@email.com',
    'contact.formSubject':    'Subject',
    'contact.formSubjectPh':  'What do you want to talk about?',
    'contact.formMessage':    'Message',
    'contact.formMessagePh':  'Tell me about your project or proposal...',
    'contact.formSend':       'Send message',
    'contact.successMsg':     '✓ Opening your email client...',
    'contact.errorEmpty':     'Please fill in all fields.',
    'contact.errorEmail':     'Please enter a valid email address.',

    /* Footer */
    'footer.copy': 'Designed and built for professional purposes.',
  }
};

/* Estado actual del idioma */
let currentLang = 'es';

/* ── FUNCIÓN PRINCIPAL: aplica el idioma al DOM ── */
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  /* Textos normales */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  /* Placeholders de inputs */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = translations[lang][key];
    if (val !== undefined) el.placeholder = val;
  });

  /* Textos de la intro (por si el usuario cambia idioma y vuelve a cargar) */
  applyIntroLang(lang);

  /* Reiniciar el typewriter con los textos del nuevo idioma */
  restartTypewriter(lang);

  /* Actualizar estilo visual del botón toggle */
  updateLangToggleUI(lang);

  /* Guardar preferencia */
  localStorage.setItem('lang', lang);
}

/* ── INICIALIZAR i18n ── */
function initI18n() {
  const savedLang = localStorage.getItem('lang') || 'es';
  applyLang(savedLang);

  const btn = document.getElementById('langToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = currentLang === 'es' ? 'en' : 'es';
    applyLang(next);
  });
}

/* Actualiza la UI del botón toggle (activo / inactivo) */
function updateLangToggleUI(lang) {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.setAttribute('data-lang', lang);
  btn.title = lang === 'es' ? 'Switch to English' : 'Cambiar a Español';
}


/* ================================================================
   5. CURSOR PERSONALIZADO
   ================================================================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, input, textarea, .project-card, .why-card, .skill-tag, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.6'; });
}


/* ================================================================
   6. CANVAS DE PARTÍCULAS
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx            = canvas.getContext('2d');
  const PARTICLE_COUNT = 60;
  const MAX_DISTANCE   = 130;
  const PARTICLE_COLOR = '56, 189, 248';
  const SPEED_RANGE    = 0.4;

  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:  Math.random() * width,
        y:  Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED_RANGE,
        vy: (Math.random() - 0.5) * SPEED_RANGE,
        r:  Math.random() * 1.8 + 0.8
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 0.5)`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  animate();
}


/* ================================================================
   7. NAVBAR — scroll + menú móvil + link activo
   ================================================================ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  }, { passive: true });

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  function updateActiveLink() {
    const scrollY   = window.scrollY + 100;
    const sections  = document.querySelectorAll('section[id]');
    let current     = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop) current = s.id; });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }

  updateActiveLink();
}


/* ================================================================
   8. TYPEWRITER MULTIIDIOMA
   Los textos cambian según el idioma activo.
   EDITAR: modifica los arrays 'es' o 'en' para cambiar las frases.
   ================================================================ */
const typewriterTexts = {
  es: [
    'Desarrollador Frontend',
    'Creador de interfaces',
    'Apasionado por el código',
    'Resolvedor de problemas',
    'Listo para tu equipo'
  ],
  en: [
    'Frontend Developer',
    'UI Builder',
    'Clean code enthusiast',
    'Problem solver',
    'Ready for your team'
  ]
};

let typewriterInterval = null; // Referencia al timeout activo

function initTypewriter() {
  startTypewriter(currentLang);
}

function startTypewriter(lang) {
  const el = document.getElementById('typewriter');
  if (!el) return;

  /* Cancelar typewriter anterior si existe */
  if (typewriterInterval) {
    clearTimeout(typewriterInterval);
    typewriterInterval = null;
    el.textContent = '';
  }

  const texts     = typewriterTexts[lang] || typewriterTexts.es;
  let textIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() {
    const current = texts[textIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === current.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex  = (textIndex + 1) % texts.length;
      speed = 350;
    }

    typewriterInterval = setTimeout(type, speed);
  }

  type();
}

/* Llama a esta función cuando cambia el idioma */
function restartTypewriter(lang) {
  startTypewriter(lang);
}


/* ================================================================
   9. ANIMACIONES DE SCROLL (IntersectionObserver)
   ================================================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}


/* ================================================================
   10. FORMULARIO DE CONTACTO
   Por defecto abre el cliente de correo con mailto.
   ================================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const t       = translations[currentLang] || translations.es;
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!email || !subject || !message) {
      showFormNote(t['contact.errorEmpty'], 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormNote(t['contact.errorEmail'], 'error');
      return;
    }

    const mailtoLink = `mailto:migsepulv2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Email: ${email}\n\n${message}`)}`;
    window.open(mailtoLink, '_blank');
    showFormNote(t['contact.successMsg'], 'success');
    form.reset();
  });

  function showFormNote(message, type) {
    if (!note) return;
    note.textContent = message;
    note.className   = `form-note ${type}`;
    setTimeout(() => { note.textContent = ''; note.className = 'form-note'; }, 5000);
  }
}


/* ================================================================
   11. BOTÓN VOLVER ARRIBA
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ================================================================
   12. AÑO ACTUAL EN FOOTER
   ================================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
