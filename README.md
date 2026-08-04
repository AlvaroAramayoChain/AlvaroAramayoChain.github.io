# Portfolio — Alvaro Aramayo Chain

Sitio estático (HTML + CSS + JS puro, sin dependencias ni build) listo para GitHub Pages.

```
index.html                     estructura y textos
styles.css                     estilos
app.js                         retícula 3D del hero + animaciones por scroll
assets/alvaro.jpg              foto de perfil
assets/demo-placeholder.svg    mock de la app (reemplazable)
```

---

## 1. Publicarlo en GitHub Pages

### Opción A — sin terminal (más fácil)

1. En GitHub: **New repository**.
2. Nombre exacto: `AlvaroAramayoChain.github.io` · visibilidad **Public** · sin README.
3. **Create repository** → **uploading an existing file**.
4. Arrastrá `index.html`, `styles.css`, `app.js`, `.nojekyll` y la carpeta `assets` completa.
5. **Commit changes**.
6. **Settings → Pages**: en *Source* elegí **Deploy from a branch**, branch `main`, carpeta `/ (root)` → **Save**.

En 1–2 minutos queda online en:

```
https://alvaroaramayochain.github.io
```

> Con ese nombre de repo la URL no lleva subcarpeta. Si usás otro nombre (ej. `portfolio`),
> la URL sería `https://alvaroaramayochain.github.io/portfolio/` y funciona igual, porque
> todas las rutas del sitio son relativas.

### Opción B — con Git

```bash
cd carpeta-del-portfolio
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/AlvaroAramayoChain/AlvaroAramayoChain.github.io.git
git push -u origin main
```

Después activá Pages igual que en el paso 6 de arriba.

Para actualizarlo más adelante: editá, `git add . && git commit -m "..." && git push`.

### Verlo antes de subirlo

```bash
python3 -m http.server 8000
```

Y abrís `http://localhost:8000`. (Abrir el `index.html` con doble clic también funciona.)

---

## 2. Reemplazar la demo por la de tu app

El mock que está ahora (`assets/demo-placeholder.svg`) es de relleno. Cuando tengas material propio:

**Captura o GIF** — guardalo en `assets/` y cambiá una sola línea de `index.html`:

```html
<img class="case__shot" src="assets/demo.png" alt="...">
```

**Video** (mejor si querés mostrar el flujo completo) — reemplazá el `<img>` por:

```html
<video class="case__shot" src="assets/demo.mp4"
       autoplay muted loop playsinline
       poster="assets/demo-poster.jpg"></video>
```

Buscá el comentario `↓↓↓ Replace the <img> below ↓↓↓` en `index.html`, está marcado.

### Qué conviene grabar (30–45 segundos alcanza)

1. La página pública del negocio, eligiendo un turno libre.
2. La confirmación que ve el cliente.
3. El panel del negocio con la agenda del día.
4. El recordatorio de WhatsApp o el mail de confirmación.

**Importante para no filtrar nada:** grabá siempre con datos inventados (nombres, teléfonos
y mails de prueba), con un negocio ficticio, y revisá que en la pantalla no aparezcan URLs
internas, tokens, paneles de hosting ni la consola del navegador. Nunca subas `.env`,
credenciales ni código del backend a este repo — este repo es solo la vitrina.

Recomendado para grabar: **ScreenToGif** (Windows) o **Peek** (Linux) para GIF;
**OBS Studio** para video. Comprimí el video a menos de ~5 MB para que cargue rápido.

---

## 3. Retoques rápidos

| Qué | Dónde |
|---|---|
| Textos, títulos, secciones | `index.html` |
| Colores (fondo, ámbar, violeta) | variables `:root` arriba de `styles.css` |
| Tipografías | variables `--display`, `--body`, `--mono` en `styles.css` |
| Velocidad / densidad de la retícula 3D | constantes al inicio de `app.js` (`GX`, `GY`, `CAM_Z`, `budget`) |
| Agregar otro proyecto | duplicá el bloque `<article class="case">` en `index.html` |

El sitio ya es responsive, tiene foco visible para teclado y respeta
`prefers-reduced-motion` (si el visitante desactivó animaciones, se ve estático).

---

## 4. Link en tu perfil de GitHub

En el README de tu perfil, en el botón **PORTFOLIO**, poné:

```
https://alvaroaramayochain.github.io
```
