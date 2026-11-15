/* ==========================================================================
   CONFIGURACIÓN PERSONAL: edita solo este bloque.
   Lo que quede vacío ("") no se muestra en la página.
   ========================================================================== */
const PERFIL = {
  email: "",      // ej. "tucorreo@ejemplo.com"  -> muestra el correo y el formulario de contacto
  linkedin: "",   // ej. "https://www.linkedin.com/in/tu-usuario"
  cv: "",         // ej. "assets/cv/CV-Erick-Picavia.pdf"  -> muestra el botón "Descargar CV"
  demos: {        // enlaces a demos públicas; vacío = sin botón "Ver demo"
    entradas: "",
    catastro: "",
    cafe: "",
  },
};

/* ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

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
        if (clave === "email") el.textContent = PERFIL.email;
        if (el.hasAttribute("data-config-text")) {
          el.textContent = href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        }
      });
      $$(`[data-config-item="${clave}"]`).forEach((el) => { el.hidden = false; });
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

  /* ---------- Formulario (sin backend: abre el correo del visitante) ---------- */
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
  contacto();
})();
