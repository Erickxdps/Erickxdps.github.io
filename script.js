/* ==========================================================================
   CONFIGURACIÓN PERSONAL: edita solo este bloque.
   Lo que quede vacío ("") no se muestra en la página.
   ========================================================================== */
const PERFIL = {
  email: "juliopicavia0000@gmail.com",  // muestra el correo, el botón "Escríbeme" y el formulario
  linkedin: "",   // ej. "https://www.linkedin.com/in/tu-usuario"
  cv: "",         // ej. "assets/cv/CV-Erick-Picavia.pdf"  -> muestra el botón "Descargar CV"
  whatsapp: "+591 69882061",  // con código de país; vacío = sin botones de WhatsApp
  mensajesWhatsapp: {         // texto que aparece ya escrito en el chat
    general: "Hola Erick, vi tu página y quiero hacerte una consulta.",
    software: "Hola Erick, vi tu página y tengo un requerimiento de software. Te cuento lo que necesito:",
    tecnico: "Hola Erick, vi tu página y necesito servicio técnico a domicilio. El problema es:",
  },
  demos: {        // enlaces a demos públicas; vacío = sin botón "Ver demo"
    entradas: "",
    catastro: "",
    cafe: "",
  },
};

/* Respuestas de la consola de la portada (botones /perfil, /proyectos, /stack y /contacto).
   enlace(texto, url) muestra el texto como enlace dentro de la respuesta. */
const API = {
  perfil: () => ({
    nombre: "Erick Picavia",
    rol: "Backend Developer",
    ubicacion: "La Paz, Bolivia",
    estudios: "Informática, UMSA",
    stack: ["Python", "Flask", "SQL"],
    bases_de_datos: ["PostgreSQL", "SQLite"],
    abierto_a: ["empleo", "freelance", "servicio técnico"],
  }),
  proyectos: () => [
    { nombre: enlace("Museum Ticketing System", "#p-entradas"), pruebas: 60 },
    { nombre: enlace("Sistema de Catastro", "#p-catastro"), pruebas: 102 },
    { nombre: enlace("Café Manager", "#p-cafe"), pruebas: 242 },
    { nombre: enlace("Rally Assistant", "#p-rally"), pruebas: 112 },
  ],
  stack: () => ({
    lenguajes: ["Python", "SQL", "JavaScript"],
    backend: ["Flask", "SQLAlchemy", "Jinja2"],
    bases_de_datos: ["PostgreSQL", "SQLite"],
    frontend: ["HTML", "CSS", "JavaScript"],
    herramientas: ["Git", "GitHub", "Linux", "VS Code"],
    despliegue: ["Nginx", "Gunicorn", "Waitress"],
  }),
  contacto: () => {
    const c = {};
    if (PERFIL.email) c.email = enlace(PERFIL.email, `mailto:${PERFIL.email}`);
    if (PERFIL.whatsapp) c.whatsapp = enlace(PERFIL.whatsapp, enlaceWhatsapp("general"));
    c.github = enlace("github.com/Erickxdps", "https://github.com/Erickxdps");
    if (PERFIL.linkedin) c.linkedin = enlace(PERFIL.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), PERFIL.linkedin);
    return c;
  },
};

/* ========================================================================== */

function enlace(texto, href) { return { texto, href, esEnlace: true }; }

// Abre un chat de WhatsApp con el mensaje indicado ya escrito
function enlaceWhatsapp(clave) {
  const numero = PERFIL.whatsapp.replace(/\D/g, "");
  const mensaje = PERFIL.mensajesWhatsapp[clave];
  return `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}`;
}

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Datos configurables ---------- */
  function aplicarPerfil() {
    const valores = {
      email: PERFIL.email && `mailto:${PERFIL.email}`,
      linkedin: PERFIL.linkedin,
      cv: PERFIL.cv,
    };

    for (const [clave, href] of Object.entries(valores)) {
      if (!href) continue;
      $$(`[data-config="${clave}"]`).forEach((el) => {
        el.href = href;
        el.hidden = false;
        const modo = el.dataset.configText;
        if (modo === "valor") el.textContent = PERFIL[clave];
        if (modo === "url") el.textContent = href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
      });
      $$(`[data-config-item="${clave}"]`).forEach((el) => { el.hidden = false; });
    }

    if (PERFIL.whatsapp) {
      $$("[data-whatsapp]").forEach((el) => {
        el.href = enlaceWhatsapp(el.dataset.whatsapp);
        el.hidden = false;
        if (el.hasAttribute("data-whatsapp-texto")) el.textContent = PERFIL.whatsapp;
      });
      $$('[data-config-item="whatsapp"]').forEach((el) => { el.hidden = false; });
      $$("[data-mensaje]").forEach((el) => {
        const mensaje = PERFIL.mensajesWhatsapp[el.dataset.mensaje];
        if (mensaje) el.lastChild.textContent = mensaje;
      });
    }

    $$("[data-demo]").forEach((el) => {
      const url = PERFIL.demos[el.dataset.demo];
      if (url) { el.href = url; el.hidden = false; }
    });

    const anio = $("[data-anio]");
    if (anio) anio.textContent = new Date().getFullYear();
  }

  /* ---------- Navegación ---------- */
  function navegacion() {
    const nav = $("[data-nav]");
    const boton = $("[data-menu-toggle]");
    const menu = $("#menu");
    const enlaces = $$("a", menu);

    const marcarFija = () => nav.classList.toggle("es-fija", window.scrollY > 8);
    marcarFija();
    window.addEventListener("scroll", marcarFija, { passive: true });

    const cerrar = (devolverFoco = false) => {
      boton.setAttribute("aria-expanded", "false");
      boton.querySelector(".sr").textContent = "Abrir menú";
      menu.classList.remove("abierto");
      nav.classList.remove("menu-abierto");
      if (devolverFoco) boton.focus();
    };

    boton.addEventListener("click", () => {
      const abrir = boton.getAttribute("aria-expanded") !== "true";
      boton.setAttribute("aria-expanded", String(abrir));
      boton.querySelector(".sr").textContent = abrir ? "Cerrar menú" : "Abrir menú";
      menu.classList.toggle("abierto", abrir);
      nav.classList.toggle("menu-abierto", abrir);
      if (abrir) enlaces[0].focus();
    });

    enlaces.forEach((a) => a.addEventListener("click", () => cerrar()));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("abierto")) cerrar(true);
    });
    document.addEventListener("click", (e) => {
      if (menu.classList.contains("abierto") && !nav.contains(e.target)) cerrar();
    });

    // Sección activa en el menú
    if (!("IntersectionObserver" in window)) return;
    const porId = new Map(enlaces.map((a) => [a.hash.slice(1), a]));
    const visibles = new Map();
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => visibles.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let activa = null;
      let max = 0;
      visibles.forEach((ratio, id) => { if (ratio > max) { max = ratio; activa = id; } });
      enlaces.forEach((a) => a.removeAttribute("aria-current"));
      if (activa && porId.has(activa)) porId.get(activa).setAttribute("aria-current", "true");
    }, { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] });

    porId.forEach((_, id) => { const s = document.getElementById(id); if (s) observador.observe(s); });
  }

  /* ---------- Consola de la portada ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const esObjeto = (v) => v !== null && typeof v === "object" && !v.esEnlace;
  const largo = (html) => html.replace(/<[^>]+>/g, "").replace(/&\w+;/g, "x").length;
  const ANCHO = 60;

  function primitivo(v) {
    if (v && v.esEnlace) {
      const externo = /^(https?:|mailto:)/.test(v.href);
      return `<a class="s" href="${esc(v.href)}"${externo ? ' target="_blank" rel="noopener"' : ""}>"${esc(v.texto)}"</a>`;
    }
    if (typeof v === "string") return `<b class="s">"${esc(v)}"</b>`;
    return `<b class="n">${esc(String(v))}</b>`;
  }

  function enLinea(v) {
    if (Array.isArray(v)) return v.some(esObjeto) ? null : `[${v.map(primitivo).join(", ")}]`;
    if (esObjeto(v)) {
      const claves = Object.keys(v);
      if (claves.some((k) => esObjeto(v[k]))) return null;
      return `{ ${claves.map((k) => `<b class="k">"${esc(k)}"</b>: ${primitivo(v[k])}`).join(", ")} }`;
    }
    return primitivo(v);
  }

  // Convierte un valor en líneas de JSON coloreado
  function json(v, sangria = "", lineas = [], prefijo = "", sufijo = "") {
    const linea = enLinea(v);
    if (linea !== null && (!esObjeto(v) && !Array.isArray(v) || largo(sangria + prefijo + linea + sufijo) <= ANCHO)) {
      lineas.push(sangria + prefijo + linea + sufijo);
      return lineas;
    }
    const lista = Array.isArray(v);
    const items = lista ? v.map((x) => [null, x]) : Object.entries(v);
    lineas.push(sangria + prefijo + (lista ? "[" : "{"));
    items.forEach(([k, x], i) => {
      const pre = k === null ? "" : `<b class="k">"${esc(k)}"</b>: `;
      json(x, `${sangria}  `, lineas, pre, i < items.length - 1 ? "," : "");
    });
    lineas.push(sangria + (lista ? "]" : "}") + sufijo);
    return lineas;
  }

  function consola() {
    const raiz = $("[data-consola]");
    if (!raiz) return;
    const salida = $("[data-salida]", raiz);
    const botones = $$("[data-ruta]", raiz);
    let turno = 0;

    const linea = (clase, html, i) => {
      const s = document.createElement("span");
      s.className = clase;
      s.innerHTML = html;
      if (i !== undefined) s.style.setProperty("--i", i);
      return s;
    };

    async function mostrar(ruta, animar) {
      const mio = ++turno;
      const comando = `curl -i localhost:5000/api/${ruta}`;
      salida.textContent = "";
      const cab = linea("l", '<b class="prompt">$</b> <span></span><b class="cursor" aria-hidden="true"></b>');
      const texto = cab.querySelector("span");
      salida.append(cab);

      if (animar) {
        for (let i = 1; i <= comando.length; i++) {
          if (mio !== turno) return;
          texto.textContent = comando.slice(0, i);
          await espera(17);
        }
        await espera(170);
        if (mio !== turno) return;
      } else {
        texto.textContent = comando;
      }
      cab.querySelector(".cursor").remove();

      const filas = [
        ["l dim", 'HTTP/1.1 <b class="ok">200 OK</b>'],
        ["l dim", "Content-Type: application/json"],
        ["l", " "],
        ...json(API[ruta]()).map((html) => ["l", html]),
      ];
      const frag = document.createDocumentFragment();
      filas.forEach(([clase, html], i) => frag.append(linea(animar ? `${clase} entra` : clase, html, i)));
      salida.append(frag);
      salida.lastElementChild.insertAdjacentHTML("beforeend", '<b class="cursor" aria-hidden="true"></b>');
      salida.parentElement.scrollTop = 0;
    }

    botones.forEach((b) => b.addEventListener("click", () => {
      botones.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      mostrar(b.dataset.ruta, !sinMovimiento());
    }));

    // Al cargar, la primera consulta se escribe sola una vez
    if (!sinMovimiento()) {
      salida.style.visibility = "hidden";
      setTimeout(() => { salida.style.visibility = ""; mostrar("perfil", true); }, 450);
    }
  }

  /* ---------- Diagramas: resaltar una tabla y sus relaciones ---------- */
  function diagramas() {
    $$(".diagrama:not(.rally)").forEach((svg) => {
      const nodos = $$(".nodo", svg);
      const aristas = $$(".arista", svg);

      const enfocar = (tabla) => {
        svg.classList.toggle("enfoque", Boolean(tabla));
        const vecinos = new Set(tabla ? [tabla] : []);
        aristas.forEach((a) => {
          const on = Boolean(tabla) && (a.dataset.de === tabla || a.dataset.a === tabla);
          a.classList.toggle("activa", on);
          if (on) { vecinos.add(a.dataset.de); vecinos.add(a.dataset.a); }
        });
        nodos.forEach((n) => {
          n.classList.toggle("activo", vecinos.has(n.dataset.tabla));
          n.classList.toggle("principal", n.dataset.tabla === tabla);
        });
      };

      svg.addEventListener("pointerover", (e) => {
        if (e.pointerType !== "mouse") return;
        const n = e.target.closest(".nodo");
        enfocar(n ? n.dataset.tabla : null);
      });
      svg.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") enfocar(null); });
      svg.addEventListener("click", (e) => {
        const n = e.target.closest(".nodo");
        const yaElegida = n && n.classList.contains("principal");
        enfocar(n && !yaElegida ? n.dataset.tabla : null);
      });
    });
  }

  /* ---------- Rally: recorrer el tramo y "cantar" cada nota antes de la curva ---------- */
  function rally() {
    const fig = $("[data-rally]");
    if (!fig) return;
    const svg = $("svg", fig);
    const traza = $(".traza", svg);
    const recorrida = $(".traza-recorrida", svg);
    const auto = $(".auto", svg);
    const boton = $("[data-recorrer]", fig);
    const lectura = $("[data-lectura]", fig);
    if (!traza || typeof traza.getTotalLength !== "function") return;

    const total = traza.getTotalLength();
    const marcas = $$(".nota", svg).map((n) => {
      const x = Number(n.dataset.x);
      const y = Number(n.dataset.y);
      let en = 0;
      let min = Infinity;
      for (let i = 0; i <= 500; i++) {
        const d = (total * i) / 500;
        const p = traza.getPointAtLength(d);
        const dist = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (dist < min) { min = dist; en = d; }
      }
      return { n, en, texto: n.textContent.trim() };
    });

    recorrida.style.strokeDasharray = `${total} ${total}`;
    recorrida.style.strokeDashoffset = total;
    boton.hidden = false;

    let cuadro = 0;
    const terminar = () => {
      setTimeout(() => {
        svg.classList.remove("recorriendo");
        marcas.forEach((m) => m.n.classList.remove("activa"));
        recorrida.style.strokeDashoffset = total;
        lectura.textContent = "";
        boton.disabled = false;
      }, 1400);
    };

    boton.addEventListener("click", () => {
      boton.disabled = true;
      if (sinMovimiento()) {
        marcas.forEach((m) => m.n.classList.add("activa"));
        lectura.textContent = marcas.map((m) => m.texto).join(", ");
        terminar();
        return;
      }
      svg.classList.add("recorriendo");
      const duracion = 6000;
      const inicio = performance.now();
      const paso = (t) => {
        const k = Math.min(1, (t - inicio) / duracion);
        const d = total * k;
        const p = traza.getPointAtLength(d);
        auto.setAttribute("cx", p.x.toFixed(1));
        auto.setAttribute("cy", p.y.toFixed(1));
        recorrida.style.strokeDashoffset = total - d;
        marcas.forEach((m) => {
          const activa = d >= m.en - 70 && d <= m.en + 12;   // la nota se canta antes de llegar
          if (activa && !m.n.classList.contains("activa")) lectura.textContent = m.texto;
          m.n.classList.toggle("activa", activa);
        });
        if (k < 1) cuadro = requestAnimationFrame(paso);
        else terminar();
      };
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(paso);
    });
  }

  /* ---------- Copiar el correo ---------- */
  function copiarCorreo() {
    const boton = $("[data-copiar]");
    const aviso = $("[data-aviso]");
    if (!boton || !PERFIL.email) return;
    boton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(PERFIL.email);
      } catch {
        const t = document.createElement("textarea");
        t.value = PERFIL.email;
        t.setAttribute("readonly", "");
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.append(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      boton.textContent = "Copiado";
      if (aviso) aviso.textContent = "Correo copiado al portapapeles";
      setTimeout(() => {
        boton.textContent = "Copiar";
        if (aviso) aviso.textContent = "";
      }, 2000);
    });
  }

  /* ---------- Formulario (sin backend: abre el correo de quien escribe) ---------- */
  function contacto() {
    const form = $("[data-contacto]");
    if (!form || !PERFIL.email) return;
    const error = $(".formulario__error", form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const campos = $$("input, textarea", form);
      const vacios = campos.filter((c) => !c.value.trim());
      campos.forEach((c) => c.setAttribute("aria-invalid", String(vacios.includes(c))));

      if (vacios.length) {
        error.textContent = "Completa todos los campos para preparar el mensaje.";
        error.hidden = false;
        vacios[0].focus();
        return;
      }
      error.hidden = true;

      const datos = new FormData(form);
      const asunto = encodeURIComponent(datos.get("asunto").trim());
      const cuerpo = encodeURIComponent(`${datos.get("mensaje").trim()}\n\n${datos.get("nombre").trim()}`);
      window.location.href = `mailto:${PERFIL.email}?subject=${asunto}&body=${cuerpo}`;
    });

    form.addEventListener("input", (e) => {
      if (e.target.value.trim()) e.target.removeAttribute("aria-invalid");
    });
  }

  aplicarPerfil();
  navegacion();
  consola();
  diagramas();
  rally();
  copiarCorreo();
  contacto();
})();
