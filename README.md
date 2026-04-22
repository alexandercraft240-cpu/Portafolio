# PORTAFOLIO FINAL — Miguel Sepúlveda
## Guía de configuración y despliegue

---

## 📁 ESTRUCTURA DEL PROYECTO

```
PORTAFOLIO FINAL/
├── index.html          ← Estructura HTML principal
├── style.css           ← Todos los estilos
├── script.js           ← Toda la lógica JS
├── README.md           ← Esta guía
└── assets/
    ├── img/
    │   └── tu-foto.jpg ← ⚠️ COLOCA AQUÍ TU FOTO
    └── icons/          ← Iconos SVG de tecnologías (opcional)
        ├── html.svg
        ├── css.svg
        ├── js.svg
        └── ...
```

---

## 🖼️ CÓMO AGREGAR TU FOTO

1. Consigue tu foto en formato JPG, PNG o WebP
2. Tamaño recomendado: **400×400px** o mayor (cuadrada)
3. Renómbrala a **`tu-foto.jpg`** (o el nombre que prefieras)
4. Pégala en la carpeta **`assets/img/`**
5. Si la nombraste diferente, edita esta línea en `index.html`:
   ```html
   <img src="assets/img/tu-foto.jpg" alt="Miguel Sepúlveda" ... />
   ```
   Cambia `tu-foto.jpg` por el nombre real de tu archivo.

---

## 💻 CÓMO ABRIRLO EN VS CODE

1. Abre VS Code
2. Ve a **Archivo → Abrir carpeta...**
3. Selecciona la carpeta `PORTAFOLIO FINAL`
4. Instala la extensión **Live Server** (si no la tienes):
   - Ctrl+Shift+X → busca "Live Server" → Instalar
5. Clic derecho en `index.html` → **"Open with Live Server"**
6. Se abrirá en tu navegador en `http://127.0.0.1:5500`

---

## 🚀 CÓMO SUBIRLO A GITHUB

### Primera vez (configuración inicial):
```bash
git init
git add .
git commit -m "Primer commit: portafolio personal"
```

### Crear repositorio en GitHub:
1. Ve a github.com → botón verde **"New"**
2. Nombre sugerido: `portafolio` o `mi-portafolio`
3. Déjalo en **público** (necesario para GitHub Pages)
4. NO inicialices con README (ya tienes uno)
5. Clic en **"Create repository"**

### Conectar y subir:
```bash
git remote add origin https://github.com/TU_USUARIO/portafolio.git
git branch -M main
git push -u origin main
```

---

## 🌐 CÓMO PUBLICAR CON GITHUB PAGES

1. En tu repositorio de GitHub, ve a **Settings** (Configuración)
2. En el menú izquierdo, clic en **Pages**
3. En "Source" / "Branch", selecciona **main** y carpeta **/ (root)**
4. Clic en **Save**
5. Espera ~2 minutos
6. Tu portafolio estará en:
   ```
   https://TU_USUARIO.github.io/portafolio/
   ```

---

## ✏️ CÓMO PERSONALIZAR CONTENIDO

Busca los comentarios `<!-- EDITAR:` en `index.html` para encontrar
exactamente dónde cambiar cada cosa:

| Qué cambiar | Dónde buscarlo |
|---|---|
| Tu nombre | Sección `hero-name` |
| Tu rol / especialidad | Array `texts` en `script.js` |
| Tu descripción | `hero-bio` y `about-text` |
| Tus proyectos | `#proyectos`, duplicar `project-card` |
| Tus habilidades | `#habilidades`, editar `skill-tag` |
| Tu email | Múltiples lugares (busca `migsepulv2004`) |
| Tus redes sociales | Busca las `href` de LinkedIn, GitHub |

---

## ➕ CÓMO AGREGAR UN NUEVO PROYECTO

En `index.html`, dentro de `<div class="projects-grid">`, copia este bloque:

```html
<article class="project-card" data-animate="fade-up" data-delay="300">
  <div class="project-preview">
    <div class="project-iframe-wrapper">
      <iframe 
        src="URL_DE_TU_PROYECTO" 
        title="Nombre del proyecto"
        loading="lazy"
        scrolling="no"
        tabindex="-1"
      ></iframe>
      <div class="project-iframe-overlay">
        <a href="URL_DE_TU_PROYECTO" target="_blank" rel="noopener noreferrer"
           class="btn btn-primary project-btn">
          <i data-lucide="external-link"></i>
          Ver proyecto
        </a>
      </div>
    </div>
  </div>
  <div class="project-info">
    <div class="project-meta">
      <span class="project-number">03</span>
      <h3 class="project-title">Nombre del Proyecto</h3>
    </div>
    <p class="project-desc">Descripción breve del proyecto aquí.</p>
    <div class="project-tags">
      <span class="tag">React</span>
      <span class="tag">Node.js</span>
    </div>
    <a href="URL_DE_TU_PROYECTO" target="_blank" rel="noopener noreferrer"
       class="project-link">
      Abrir en nueva pestaña
      <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
    </a>
  </div>
</article>
```

---

## 🎨 CÓMO CAMBIAR EL COLOR DE ACENTO

En `style.css`, busca el bloque `:root { }` al inicio del archivo.
Cambia el valor de `--accent` por cualquier color HEX o RGB:

```css
--accent: #38bdf8;  /* Celeste (actual) */
/* Opciones:
   --accent: #a78bfa;  (Violeta)
   --accent: #34d399;  (Verde esmeralda)
   --accent: #fb923c;  (Naranja)
   --accent: #f472b6;  (Rosa)
*/
```

---

Hecho con ❤️ — Miguel Sepúlveda
