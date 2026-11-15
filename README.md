# Portafolio de Erick Picavia

Sitio personal de Erick Picavia, backend developer en La Paz, Bolivia. Presenta mis proyectos, las tecnologías con las que trabajo, mi formación y cómo contactarme.

Es un sitio estático hecho con HTML, CSS y JavaScript, sin frameworks, sin Node.js y sin dependencias externas. Se publica en GitHub Pages en <https://erickxdps.github.io/>.

## Estructura

```
erick-portfolio/
├── index.html          Contenido de todas las secciones, SEO y datos estructurados
├── style.css           Sistema visual: colores, tipografía, layout y responsive
├── script.js           Configuración personal (arriba del todo) y comportamiento
├── README.md
└── assets/
    ├── fonts/          Mona Sans (variable, autoalojada)
    ├── icons/          favicon.svg y apple-touch-icon.png
    ├── images/         og.png (vista previa al compartir) y capturas de proyectos
    └── cv/             Tu CV en PDF
```

## Ejecutar en local

Abre `index.html` con doble clic. No hace falta instalar nada.

Para verlo tal como funcionará publicado, levanta un servidor local:

```bash
python3 -m http.server 8000
```

y entra a <http://localhost:8000>.

## Modificar los datos personales

Casi todo se cambia en el bloque `PERFIL` al principio de `script.js`. Lo que quede vacío (`""`) no se muestra en la página.

```js
const PERFIL = {
  email: "tucorreo@ejemplo.com",                    // muestra el correo y el formulario de contacto
  linkedin: "https://www.linkedin.com/in/tu-usuario",
  cv: "assets/cv/CV-Erick-Picavia.pdf",             // muestra el botón "Descargar CV"
  demos: { entradas: "", catastro: "", cafe: "" },  // enlaces "Ver demo" de cada proyecto
};
```

Los textos (presentación, sobre mí, formación) están en `index.html`, separados por comentarios `<!-- ===== SECCIÓN ===== -->`.

El formulario de contacto no tiene backend: prepara el mensaje y lo abre en el programa de correo del visitante (`mailto:`). No aparenta enviar nada por su cuenta.

## Añadir un proyecto

1. En `index.html`, copia un bloque `<article class="proyecto">` completo y pégalo dentro de la sección `#proyectos`.
2. Cambia el `id`, el título, la descripción, el problema, lo destacado, las tecnologías y el enlace a GitHub.
3. Para la imagen, reemplaza el `<svg>` dentro de `.proyecto__visual` por una captura:
   ```html
   <img src="assets/images/mi-proyecto.webp" alt="Pantalla principal de Mi Proyecto" width="1240" height="660" loading="lazy">
   ```
   Usa WebP de unos 1240 px de ancho para que cargue rápido.
4. Si tiene demo, ponle `data-demo="mi-clave"` al enlace "Ver demo" y agrega `mi-clave: "https://..."` en `PERFIL.demos`.

Los proyectos se alternan solos (texto a la izquierda o a la derecha).

## Sustituir el CV

1. Copia tu PDF a `assets/cv/`, por ejemplo `assets/cv/CV-Erick-Picavia.pdf`.
2. En `script.js` pon `cv: "assets/cv/CV-Erick-Picavia.pdf"`.

Para actualizarlo, reemplaza el archivo manteniendo el mismo nombre.

## Publicar en GitHub Pages

1. Crea en GitHub un repositorio público llamado exactamente **`Erickxdps.github.io`**.
2. Desde esta carpeta:
   ```bash
   git remote add origin git@github.com:Erickxdps/Erickxdps.github.io.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. En uno o dos minutos el sitio estará en <https://erickxdps.github.io/>.

Cada `git push` a `main` actualiza el sitio.

## Conectar un dominio propio

1. Compra el dominio (por ejemplo `erickpicavia.dev`).
2. En tu proveedor DNS crea:
   - Para el dominio raíz, cuatro registros `A` hacia `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`.
   - Para `www`, un registro `CNAME` hacia `erickxdps.github.io`.
3. En GitHub: **Settings → Pages → Custom domain**, escribe el dominio y activa **Enforce HTTPS** cuando esté disponible.
4. Cambia `https://erickxdps.github.io/` por tu dominio en `index.html` (`canonical`, `og:url`, `og:image` y el JSON-LD).

## Decisiones de diseño

- **Paleta:** fondo `#0B0B0F`, superficies `#13131B`, violeta `#8B5CF6` / `#A78BFA`, texto `#F4F4F5` / `#A1A1AA`.
- **Tipografía:** Mona Sans, la tipografía variable de GitHub, en una sola familia. Los títulos usan el ancho expandido (125 %) y el texto el ancho normal. La monoespaciada se usa solo donde hay código.
- **Inicio:** una petición HTTP real a un "perfil" es el único momento animado de la página; respeta `prefers-reduced-motion`.
- **Proyectos:** cada uno se ilustra con una parte de su modelo de datos real, sacado de su repositorio, en lugar de capturas genéricas.
- **Rendimiento:** unos 150 KB en total, una sola fuente autoalojada y sin librerías.
