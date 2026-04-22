/* ================================================================
   PORTAFOLIO PERSONAL - Miguel Sepúlveda
   script.js — Lógica e interactividad

   ÍNDICE:
   1.  Inicialización
   2.  Cursor personalizado
   3.  Canvas de partículas (fondo)
   4.  Navbar (scroll + menú móvil)
   5.  Typewriter (efecto máquina de escribir)
   6.  Animaciones de scroll (IntersectionObserver)
   7.  Formulario de contacto
   8.  Botón volver arriba
   9.  Año actual en footer
   10. Inicializar iconos Lucide
   ================================================================ */


/* ================================================================
   1. INICIALIZACIÓN
   Todo se ejecuta cuando el DOM está listo.
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // La intro se lanza primero y llama al resto cuando termina
  initIntroScreen();
});

/* ================================================================
   INTRO SCREEN
   Secuencia:
   0.3s  → aparece "Hola, yo soy"
   0.6s  → cae "Ángel"
   0.85s → cae "Sepúlveda" con shimmer
   1.4s  → pop de las 3 palabras
   2.1s  → barra de progreso arranca
   2.4s  → barra llega a 100% (0.8s de duración)
   3.2s  → la intro se oculta y el sitio aparece
   ================================================================ */
function initIntroScreen() {
  const screen    = document.getElementById('introScreen');
  const loaderBar = document.getElementById('introLoaderBar');
  const loadingTxt= document.getElementById('introLoadingText');

  if (!screen) {
    // Si no existe la intro, arrancar el sitio directamente
    bootSite();
    return;
  }

  // Arrancar barra de progreso después de que aparezca la intro
  let progress = 0;
  const loadingMessages = [
    'Cargando portafolio...',
    'Preparando proyectos...',
    'Casi listo...',
    '¡Aquí vamos!'
  ];

  // Esperar a que las animaciones CSS terminen (~2.1s) y luego correr la barra
  setTimeout(() => {
    const barDuration = 900;  // ms que tarda en llenarse
    const interval    = 16;   // ~60fps
    const step        = (interval / barDuration) * 100;
    let   msgIndex    = 0;

    const ticker = setInterval(() => {
      progress = Math.min(progress + step, 100);
      if (loaderBar) loaderBar.style.width = progress + '%';

      // Cambiar texto de carga
      const newMsgIndex = Math.floor((progress / 100) * loadingMessages.length);
      if (newMsgIndex !== msgIndex && newMsgIndex < loadingMessages.length) {
        msgIndex = newMsgIndex;
        if (loadingTxt) {
          loadingTxt.style.opacity = '0';
          setTimeout(() => {
            loadingTxt.textContent = loadingMessages[msgIndex];
            loadingTxt.style.opacity = '1';
          }, 150);
        }
      }

      if (progress >= 100) {
        clearInterval(ticker);
        // Pequeña pausa al llegar a 100% y luego esconder
        setTimeout(hideIntro, 350);
      }
    }, interval);
  }, 2100);

  // Ocultar la intro con animación de salida
  function hideIntro() {
    screen.classList.add('hiding');
    // Después de la transición CSS (0.8s), quitar del DOM
    setTimeout(() => {
      screen.classList.add('hidden');
      bootSite();
    }, 850);
  }
}

/* ================================================================
   ARRANQUE DEL SITIO (se llama después de la intro)
   ================================================================ */
function bootSite() {
  initCursor();
  initParticles();
  initNavbar();
  initTypewriter();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
  initFooterYear();

  if (typeof lucide !== 'undefined') {
    // lucide ya no se usa — todos los iconos son SVG inline
  }
}




/* ================================================================
   2. CURSOR PERSONALIZADO
   Sigue al mouse con un pequeño retraso para efecto suave.
   En móvil/táctil no se muestra (oculto via CSS).
   ================================================================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // Posición del cursor
  let mouseX = 0, mouseY = 0;
  // Posición del ring (más lenta = efecto de retraso)
  let ringX = 0, ringY = 0;

  // Seguir al mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Mover el dot instantáneamente
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Animar el ring con lerp (suavizado)
  function animateRing() {
    // Interpolación lineal: acercarse 12% de la distancia cada frame
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover sobre elementos interactivos → expandir ring
  const interactables = document.querySelectorAll(
    'a, button, input, textarea, .project-card, .why-card, .skill-tag, .contact-link'
  );

  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Ocultar cursor cuando sale de la ventana
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.6';
  });
}


/* ================================================================
   3. CANVAS DE PARTÍCULAS (FONDO)
   Crea puntos flotantes conectados por líneas — efecto "red".
   EDITAR: Ajusta PARTICLE_COUNT, MAX_DISTANCE, colores, etc.
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ---- CONFIGURACIÓN ----
  const PARTICLE_COUNT = 60;     // Número de partículas
  const MAX_DISTANCE   = 130;    // Distancia máxima para dibujar línea
  const PARTICLE_COLOR = '56, 189, 248'; // RGB del color de partícula
  const SPEED_RANGE    = 0.4;    // Velocidad máxima

  let particles = [];
  let width, height;

  // Ajustar canvas al tamaño de la ventana
  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Crear partículas
  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x:  Math.random() * width,
        y:  Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED_RANGE,
        vy: (Math.random() - 0.5) * SPEED_RANGE,
        r:  Math.random() * 1.8 + 0.8 // radio (tamaño del punto)
      });
    }
  }

  // Loop de animación
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Actualizar y dibujar cada partícula
    particles.forEach(p => {
      // Mover
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en los bordes
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Dibujar punto
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 0.5)`;
      ctx.fill();
    });

    // Dibujar líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          // Opacidad basada en distancia (más cerca = más opaco)
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

  createParticles();
  animate();

  // Recrear partículas al redimensionar
  window.addEventListener('resize', createParticles);
}


/* ================================================================
   4. NAVBAR
   - Fondo al hacer scroll
   - Link activo según sección visible
   - Menú hamburguesa en móvil
   ================================================================ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Añadir clase .scrolled al hacer scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  }, { passive: true });

  // Menú hamburguesa (móvil)
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en un link
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // Actualizar link activo según la sección visible
  function updateActiveLink() {
    const scrollY = window.scrollY + 100;

    // Obtener todas las secciones con id
    const sections = document.querySelectorAll('section[id]');

    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Ejecutar al cargar
  updateActiveLink();
}


/* ================================================================
   5. TYPEWRITER
   Efecto de máquina de escribir en el hero.
   EDITAR: Cambia el array 'texts' con tus propios roles.
   ================================================================ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  // EDITAR: Modifica estas frases con tus roles reales
  const texts = [
    'Desarrollador Frontend',
    'Creador de interfaces',
    'Apasionado por el código',
    'Resolvedor de problemas'
  ];

  let textIndex  = 0; // Índice del texto actual
  let charIndex  = 0; // Carácter actual
  let isDeleting = false;
  let timeout;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      // Borrar un carácter
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Escribir un carácter
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    // Velocidades
    let speed = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === currentText.length) {
      // Pausa al terminar de escribir
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Pasar al siguiente texto
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 400;
    }

    timeout = setTimeout(type, speed);
  }

  type();
}


/* ================================================================
   6. ANIMACIONES DE SCROLL (IntersectionObserver)
   Observa los elementos con [data-animate] y les agrega
   la clase .is-visible cuando entran al viewport.
   ================================================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez visible, dejar de observar (para mejor performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.1,   // Activar cuando el 10% del elemento es visible
      rootMargin: '0px 0px -50px 0px' // Margen inferior negativo (activa un poco antes)
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ================================================================
   7. FORMULARIO DE CONTACTO
   Por defecto usa mailto: para abrir el cliente de correo.
   
   PARA FORMULARIO REAL: Usa Formspree (gratis):
   1. Ve a formspree.io y crea una cuenta
   2. Crea un formulario y copia tu endpoint
   3. Descomenta el bloque "VERSIÓN CON FORMSPREE" abajo
   ================================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validación básica
    if (!email || !subject || !message) {
      showFormNote('Por favor, completa todos los campos.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormNote('Por favor, ingresa un correo válido.', 'error');
      return;
    }

    // ---- VERSIÓN MAILTO (por defecto) ----
    const mailtoLink = `mailto:migsepulv2004@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Email: ${email}\n\n${message}`)}`;
    window.open(mailtoLink, '_blank');

    showFormNote('✓ Abriendo tu cliente de correo...', 'success');
    form.reset();


    /* ---- VERSIÓN CON FORMSPREE (descomenta para usar) ----
    REEMPLAZA 'https://formspree.io/f/TU_ID' con tu endpoint real
    
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch('https://formspree.io/f/TU_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (response.ok) {
        showFormNote('✓ Mensaje enviado. Te responderé pronto.', 'success');
        form.reset();
      } else {
        throw new Error('Error en el envío');
      }
    } catch (err) {
      showFormNote('❌ Hubo un error. Intenta de nuevo.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="send"></i> Enviar mensaje';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    */
  });

  // Mostrar mensaje de estado del formulario
  function showFormNote(message, type) {
    if (!note) return;
    note.textContent = message;
    note.className = `form-note ${type}`;

    // Limpiar después de 5 segundos
    setTimeout(() => {
      note.textContent = '';
      note.className = 'form-note';
    }, 5000);
  }

  // Validar formato de email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ================================================================
   8. BOTÓN VOLVER ARRIBA
   Aparece cuando el usuario baja más de 400px.
   ================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // Mostrar/ocultar según el scroll
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Al hacer clic, ir al inicio con scroll suave
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   9. AÑO ACTUAL EN FOOTER
   Actualiza automáticamente el año — no necesitas cambiarlo nunca.
   ================================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
