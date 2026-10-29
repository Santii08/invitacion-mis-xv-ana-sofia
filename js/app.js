/**
 * ========================================================
 * MIS XV - ANA SOFÍA | JAVASCRIPT PRINCIPAL
 * - Detección de parámetros de URL (?invitado=...&pases=...)
 * - Cuenta regresiva al 27 de Noviembre de 2026 19:00 (Bogotá)
 * - Reproductor de música interactivo
 * - Envío de confirmación RSVP a Google Sheets
 * - Agendar en Google Calendar
 * - Partículas de destellos mágicos
 * ========================================================
 */

// CONFIGURACIÓN DE TU GOOGLE SHEET (WEB APP URL)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMo58YyvhUXhq-IJfqWffzJd1mI3oHP9OySStz8vX7sQIJkjuNreI6NPMYjpyCUIwT/exec";

// Teléfono de contacto de la anfitriona (Bogotá / Colombia)
const HOST_PHONE = "573203976424";

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initUrlParams();
  initCountdown();
  initMusicPlayer();
  initCalendarButton();
  initRsvpForm();
  initSongModal();
});

/* ----------------------------------------------------
   1. DETECCIÓN DE INVITADO PERSONALIZADO POR URL
   ---------------------------------------------------- */
function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("invitado") || params.get("nombre");
  const rawPasses = params.get("pases") || params.get("cupos");

  const vipBanner = document.getElementById("guestVipBanner");
  const nameDisplay = document.getElementById("guestNameDisplay");
  const passesDisplay = document.getElementById("guestPassesCount");
  const passesLabel = document.getElementById("guestPassesLabel");
  const inputName = document.getElementById("rsvpName");
  const selectPax = document.getElementById("rsvpPax");

  if (guestName) {
    const cleanName = decodeURIComponent(guestName.replace(/\+/g, " "));
    nameDisplay.textContent = cleanName;
    if (inputName) inputName.value = cleanName;

    let passes = parseInt(rawPasses, 10);
    if (isNaN(passes) || passes < 1) passes = 2; // Por defecto 2 si no se especifica

    if (passesDisplay) passesDisplay.textContent = passes;
    if (passesLabel) {
      passesLabel.textContent = passes === 1 ? "pase reservado" : "pases reservados";
    }

    // Configurar el selector de personas según los pases permitidos
    if (selectPax) {
      selectPax.innerHTML = "";
      for (let i = 1; i <= Math.max(passes, 4); i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${i} ${i === 1 ? "persona" : "personas"}`;
        if (i === passes) opt.selected = true;
        selectPax.appendChild(opt);
      }
    }

    vipBanner.classList.remove("hidden");
  }
}

/* ----------------------------------------------------
   2. CUENTA REGRESIVA AL EVENTO
   Fecha: 27 de Noviembre de 2026 a las 7:00 PM (Bogotá, UTC-5)
   ---------------------------------------------------- */
function initCountdown() {
  const eventDate = new Date("2026-11-27T19:00:00-05:00").getTime();

  const elDays = document.getElementById("cdDays");
  const elHours = document.getElementById("cdHours");
  const elMinutes = document.getElementById("cdMinutes");
  const elSeconds = document.getElementById("cdSeconds");

  function update() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent = String(days).padStart(2, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMinutes.textContent = String(minutes).padStart(2, "0");
    elSeconds.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* ----------------------------------------------------
   3. REPRODUCTOR DE MÚSICA AMBIENTAL
   ---------------------------------------------------- */
function initMusicPlayer() {
  const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("btnMusic");
  if (!audio || !btn) return;

  let isPlaying = false;

  btn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      btn.classList.remove("playing");
      isPlaying = false;
    } else {
      audio.play().then(() => {
        btn.classList.add("playing");
        isPlaying = true;
      }).catch(err => {
        console.log("Autoplay prevenido por el navegador:", err);
      });
    }
  });

  // Intentar reproducir suavemente en la primera interacción del usuario con la página
  const startAudioOnFirstClick = () => {
    if (!isPlaying) {
      audio.play().then(() => {
        btn.classList.add("playing");
        isPlaying = true;
      }).catch(() => {});
    }
    document.removeEventListener("click", startAudioOnFirstClick);
  };
  document.addEventListener("click", startAudioOnFirstClick, { once: true });
}

/* ----------------------------------------------------
   4. AGENDAR EN GOOGLE CALENDAR
   ---------------------------------------------------- */
function initCalendarButton() {
  const btn = document.getElementById("btnAddToCalendar");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // 27 Nov 2026 19:00 - 28 Nov 2026 03:00 (Bogotá UTC-5 => 20261128T000000Z a 20261128T080000Z)
    const title = encodeURIComponent("Mis XV - Ana Sofía");
    const dates = "20261128T000000Z/20261128T080000Z";
    const details = encodeURIComponent(
      "Celebración de los XV Años de Ana Sofía.\n" +
      "Traje formal (Nota: Se reserva el color azul y lila).\n" +
      "¡Te esperamos para vivir una noche inolvidable!"
    );
    const location = encodeURIComponent("Calle 34 #15-24, Teusaquillo, Bogotá, Colombia");

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(gcalUrl, "_blank");
  });
}

/* ----------------------------------------------------
   5. FORMULARIO RSVP & ENVÍO A GOOGLE SHEETS
   ---------------------------------------------------- */
function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  const radioAsistencia = document.getElementsByName("asistencia");
  const attendingDetails = document.getElementById("attendingDetails");
  const btnSubmit = document.getElementById("btnSubmitRsvp");
  const successBox = document.getElementById("rsvpSuccessMessage");
  const errorBox = document.getElementById("rsvpErrorMessage");
  const btnWhatsapp = document.getElementById("btnNotifyWhatsapp");

  // Mostrar / ocultar detalles según si asiste
  Array.from(radioAsistencia).forEach(r => {
    r.addEventListener("change", (e) => {
      if (e.target.value === "No") {
        attendingDetails.classList.add("hidden");
      } else {
        attendingDetails.classList.remove("hidden");
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("rsvpName").value.trim();
    if (!nombre) {
      alert("Por favor escribe tu nombre para registrar tu respuesta.");
      return;
    }

    const asistira = document.querySelector('input[name="asistencia"]:checked').value;
    const personas = asistira === "Si" ? document.getElementById("rsvpPax").value : "0";
    const acompanantes = asistira === "Si" ? document.getElementById("rsvpGuestsNames").value.trim() : "";
    const restricciones = asistira === "Si" ? document.getElementById("rsvpDiet").value.trim() : "";
    const cancion = asistira === "Si" ? document.getElementById("rsvpSong").value.trim() : "";
    const mensaje = document.getElementById("rsvpMessage").value.trim();

    const dataPayload = {
      fechaHora: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      nombre,
      asiste: asistira,
      personas,
      acompanantes: acompanantes || "Ninguno",
      restricciones: restricciones || "Ninguna",
      cancion: cancion || "Sin sugerencia",
      mensaje: mensaje || "Sin mensaje"
    };

    // Guardar también copia local para el panel de administración
    saveToLocalStore(dataPayload);

    // Estado cargando en el botón
    btnSubmit.disabled = true;
    btnSubmit.querySelector(".btn-text").classList.add("hidden");
    btnSubmit.querySelector(".btn-spinner").classList.remove("hidden");
    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    let enviadoASheet = false;

    // Intentar enviar a Google Sheets si hay URL configurada
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "TU_GOOGLE_APPS_SCRIPT_URL_AQUI") {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataPayload)
        });
        enviadoASheet = true;
      } catch (err) {
        console.warn("Fallo el envío al Apps Script:", err);
      }
    } else {
      // Simular delay para feedback visual cuando está en demo local
      await new Promise(r => setTimeout(r, 600));
      enviadoASheet = true;
    }

    btnSubmit.disabled = false;
    btnSubmit.querySelector(".btn-text").classList.remove("hidden");
    btnSubmit.querySelector(".btn-spinner").classList.add("hidden");

    if (enviadoASheet) {
      successBox.classList.remove("hidden");
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });

      // Configurar botón para enviar copia por WhatsApp si el usuario lo desea
      if (btnWhatsapp) {
        btnWhatsapp.onclick = () => {
          let msg = `Hola Ana Sofía ✨,\n`;
          if (asistira === "Si") {
            msg += `¡Confirmo mi asistencia a tus XV!\n`;
            msg += `👤 Nombre: ${nombre}\n`;
            msg += `👥 Asistentes: ${personas}\n`;
            if (acompanantes) msg += `🤝 Acompañantes: ${acompanantes}\n`;
            if (cancion) msg += `🎵 Canción sugerida: ${cancion}\n`;
            if (mensaje) msg += `💌 Mensaje: ${mensaje}\n`;
          } else {
            msg += `Lamentablemente no podré acompañarte a tus XV 😢.\n`;
            msg += `👤 De parte de: ${nombre}\n`;
            if (mensaje) msg += `💌 Mensaje: ${mensaje}\n`;
          }
          const waUrl = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(msg)}`;
          window.open(waUrl, "_blank");
        };
      }
    } else {
      errorBox.classList.remove("hidden");
    }
  });
}

// Almacenar en localStorage para ver en panel privado
function saveToLocalStore(item) {
  try {
    const list = JSON.parse(localStorage.getItem("confirmaciones_ana_sofia") || "[]");
    list.push(item);
    localStorage.setItem("confirmaciones_ana_sofia", JSON.stringify(list));
  } catch (e) {
    console.error("No se pudo guardar localmente", e);
  }
}

/* ----------------------------------------------------
   6. MODAL DE SUGERIR CANCIÓN
   ---------------------------------------------------- */
function initSongModal() {
  const modal = document.getElementById("songModal");
  const btnOpen = document.getElementById("btnOpenSongModal");
  const btnClose = document.getElementById("btnCloseSongModal");
  const form = document.getElementById("quickSongForm");
  const feedback = document.getElementById("quickSongFeedback");

  if (!modal || !btnOpen) return;

  btnOpen.addEventListener("click", () => {
    modal.classList.remove("hidden");
    feedback.classList.add("hidden");
  });

  btnClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const song = document.getElementById("quickSongInput").value.trim();
    const guest = document.getElementById("quickSongUser").value.trim() || "Anónimo";

    if (!song) return;

    // Guardar en el campo del formulario principal también
    const mainSongInput = document.getElementById("rsvpSong");
    if (mainSongInput) mainSongInput.value = song;

    feedback.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.add("hidden");
      form.reset();
    }, 1200);
  });
}

/* ----------------------------------------------------
   7. PARTÍCULAS Y DESTELLOS MÁGICOS DE FONDO
   ---------------------------------------------------- */
function initParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const p = document.createElement("div");
  p.className = "sparkle-particle";

  const size = Math.random() * 5 + 3;
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${Math.random() * 100}vw`;

  const duration = Math.random() * 8 + 6;
  const delay = Math.random() * 6;
  p.style.animationDuration = `${duration}s`;
  p.style.animationDelay = `${delay}s`;

  container.appendChild(p);
}
