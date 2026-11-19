# Portafolio de Erick Picavia

Sitio personal de Erick Picavia, backend developer en La Paz, Bolivia. Presenta mis proyectos, las tecnologías con las que trabajo, mi formación y cómo contactarme.

Es un sitio estático hecho con HTML, CSS y JavaScript, sin frameworks, sin Node.js y sin dependencias externas. Se publica en GitHub Pages en <https://erickxdps.github.io/>.

## Estructura

```
erick-portfolio/
├── index.html          Contenido de todas las secciones (incluye Servicios), SEO y datos estructurados
├── style.css           Sistema visual: colores, tipografía, layout, responsive e impresión
├── script.js           Configuración personal (arriba del todo) y comportamiento
├── 404.html            Página para enlaces que no existen
├── robots.txt          Permite indexar el sitio y apunta al sitemap
├── sitemap.xml         Mapa del sitio para buscadores
├── herramientas/
│   └── diagramas.py    Genera los diagramas de los proyectos dentro de index.html
├── README.md
└── assets/
    ├── fonts/          Mona Sans y Monaspace Neon (autoalojadas)
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
  email: "tucorreo@ejemplo.com",                    // muestra el correo, "Escríbeme" y el formulario
  linkedin: "https://www.linkedin.com/in/tu-usuario",
  cv: "assets/cv/CV-Erick-Picavia.pdf",             // muestra los botones "Descargar CV"
  whatsapp: "+591 69882061",                        // muestra los botones de WhatsApp
  mensajesWhatsapp: {                               // texto que aparece ya escrito en el chat
    general: "Hola Erick, vi tu página y quiero hacerte una consulta.",
    software: "Hola Erick, vi tu página y tengo un requerimiento de software. Te cuento lo que necesito:",
    tecnico: "Hola Erick, vi tu página y necesito servicio técnico a domicilio. El problema es:",
  },
  demos: { entradas: "", catastro: "", cafe: "" },  // enlaces "Ver demo" de cada proyecto
};
```

### WhatsApp

Los botones de WhatsApp abren un chat con tu número y un mensaje ya escrito:

- **general**: el botón de la portada y la fila de WhatsApp en Contacto.
- **software** y **tecnico**: los botones de la sección Servicios. Cada servicio muestra una vista previa del mensaje.

El número va con código de país (`+591` para Bolivia). Si cambias un mensaje en `mensajesWhatsapp`, también cambia su vista previa en la página.

Los textos (presentación, proyectos, sobre mí, formación) están en `index.html`, separados por comentarios `<!-- ===== SECCIÓN ===== -->`.

### La consola de la portada

Cada botón de la consola (`/perfil`, `/proyectos`, `/stack`, `/contacto`) muestra una respuesta en JSON. Esas respuestas están en el objeto `API`, justo debajo de `PERFIL` en `script.js`. Para cambiar lo que dice una respuesta, edita ese objeto. `enlace("texto", "url")` muestra el texto como un enlace dentro de la respuesta.

### El formulario de contacto

No tiene backend: prepara el mensaje y lo abre en el programa de correo del visitante (`mailto:`). No aparenta enviar nada por su cuenta. El botón "Copiar" copia el correo al portapapeles.

## Proyectos y diagramas

Cada proyecto muestra una parte de su modelo de datos real. Los diagramas son SVG dentro de `index.html`, generados por `herramientas/diagramas.py` a partir de las tablas, campos y relaciones de cada repositorio.

Para cambiar un diagrama (por ejemplo, añadir un campo), edita su bloque en `herramientas/diagramas.py` y ejecuta:

```bash
python3 herramientas/diagramas.py index.html
```

El script reemplaza solo lo que hay entre los marcadores `<!-- svg:clave -->` y `<!-- /svg:clave -->`. Lo demás de `index.html` no se toca.

Al pasar el cursor (o tocar, en el celular) una tabla, se resaltan sus relaciones. En el proyecto de rally, el botón "Recorrer el tramo" recorre la traza y muestra cada nota de ruta antes de su curva.

### Añadir un proyecto

1. En `index.html`, copia un bloque `<article class="proyecto">` completo y pégalo dentro de la sección `#proyectos`.
2. Cambia el `id`, el título, la descripción, el número de pruebas, el problema, lo destacado, las tecnologías y el enlace a GitHub.
3. Para la imagen, reemplaza el contenido de `.lienzo__area` por una captura:
   ```html
   <img src="assets/images/mi-proyecto.webp" alt="Pantalla principal de Mi Proyecto" width="1240" height="660" loading="lazy">
   ```
   Usa WebP de unos 1240 px de ancho para que cargue rápido.
4. Si tiene demo, ponle `data-demo="mi-clave"` al enlace "Ver demo" y agrega `mi-clave: "https://..."` en `PERFIL.demos`.
5. Agrega una columna para el proyecto en la tabla de Tecnologías.

## Tabla de tecnologías

La sección Tecnologías es una tabla HTML: cada fila es una tecnología y cada columna un proyecto. En cada celda usa:

- `<i class="si"></i><span class="sr">Sí</span>` si el proyecto la usa.
- `<i class="listo"></i><span class="sr">Preparado</span>` si el proyecto está preparado para usarla (por ejemplo, PostgreSQL).
- `<i class="no"></i><span class="sr">No</span>` si no la usa.

El texto dentro de `class="sr"` no se ve, pero lo leen los lectores de pantalla.

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
4. Cambia `https://erickxdps.github.io/` por tu dominio en `index.html` (`canonical`, `og:url`, `og:image` y el JSON-LD), en `robots.txt` y en `sitemap.xml`.

## Decisiones de diseño

- **Paleta:** fondo `#0B0B0F`, superficies `#13131B`, violeta `#8B5CF6` / `#A78BFA`, texto `#F4F4F5` / `#A1A1AA`. El botón principal usa texto oscuro sobre el violeta claro para cumplir el contraste mínimo de accesibilidad.
- **Tipografía:** Mona Sans para todo el texto, con el ancho expandido (125 %) en los títulos. Monaspace Neon solo donde hay código: consola, diagramas y rutas de archivos. Ambas son de GitHub y están pensadas para usarse juntas.
- **Inicio:** una consola que responde como una API de Flask. Es el único momento animado al cargar, y cada botón muestra otra respuesta.
- **Proyectos:** cada uno se ilustra con su modelo de datos real, enlazado al archivo de su repositorio, en lugar de capturas genéricas.
- **Tecnologías:** una tabla que muestra en qué proyecto se usa cada herramienta y cuántas pruebas automatizadas tiene cada uno, en lugar de barras de porcentaje.
- **Accesibilidad:** navegación por teclado, foco visible, textos alternativos, contraste AA y respeto por `prefers-reduced-motion`.
- **Rendimiento:** unos 230 KB en total, sin librerías y con las fuentes autoalojadas.

## Créditos

- [Mona Sans](https://github.com/github/mona-sans) y [Monaspace](https://github.com/githubnext/monaspace), de GitHub, bajo licencia SIL Open Font License 1.1.
