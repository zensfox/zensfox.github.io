/* script.js — ZensFox Clean Stable Build
   ✨ Fix:
   - Preview works modal fully working
   - No translation system
   - No nav conflict
   - Works fine on Acode/mobile preview
*/

(() => {
  "use strict";

  /* -------------------------
     Helpers
  ------------------------- */
  const $q = (sel, root = document) => root.querySelector(sel);
  const $qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const pageIds = ["home", "about", "works", "contact"];
  let current = "home";
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navBtns = $qa(".nav-btn");
  const pages = pageIds.map((id) => $q(`#page-${id}`)).filter(Boolean);
  const panelTitle = $q("#panelTitle");
  const panelSub = $q("#panelSub");
  const panelBody = $q("#panelBody");
  const glassCards = $qa(".glass-card");
  const yearEl = $q("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------
     Navigation
  ------------------------- */
  function setActiveNav(name) {
    navBtns.forEach((btn) => {
      const t = btn.dataset.target;
      const active = t === name;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function updatePanelHeading(name) {
    const titles = {
      home: "Home",
      about: "Fursona",
      works: "Works",
      contact: "Contact",
    };
    const subs = {
      home: "Crafting calm.",
      about: "About my fursona.",
      works: "Some of art works.",
      contact: "Connect with me.",
    };
    if (panelTitle) panelTitle.textContent = titles[name] || "Home";
    if (panelSub) panelSub.textContent = subs[name] || "";
  }

  function show(name, push = true) {
    if (!pageIds.includes(name)) return;
    pages.forEach((p) => {
      const isTarget = p.id === `page-${name}`;
      p.classList.toggle("show", isTarget);
      p.setAttribute("aria-hidden", isTarget ? "false" : "true");
    });
    setActiveNav(name);
    updatePanelHeading(name);
    current = name;
    if (push) history.pushState({ page: name }, "", `#${name}`);
  }

  function initNavigation() {
    navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        if (target) show(target, true);
      });
    });

    const h = location.hash.replace("#", "");
    if (h && pageIds.includes(h)) show(h, false);
    else show(current, false);

    window.addEventListener("popstate", (ev) => {
      const hash = location.hash.replace("#", "");
      if (hash && pageIds.includes(hash)) show(hash, false);
      else if (ev.state && pageIds.includes(ev.state.page))
        show(ev.state.page, false);
    });
  }

  /* -------------------------
     Works Preview Modal
  ------------------------- */
  function initWorksPreview() {
    const items = document.querySelectorAll(".work");
    if (!items.length) return;

    let modal = document.createElement("div");
    modal.className = "preview-modal";
    modal.innerHTML = `
      <div class="preview-inner">
        <button class="preview-close">×</button>
        <img src="" alt="Preview" class="preview-img" />
        <div class="preview-caption"></div>
        <button class="preview-nav-btn prev">‹</button>
        <button class="preview-nav-btn next">›</button>
      </div>
    `;
    document.body.appendChild(modal);

    const imgEl = modal.querySelector(".preview-img");
    const capEl = modal.querySelector(".preview-caption");
    const closeBtn = modal.querySelector(".preview-close");
    const prevBtn = modal.querySelector(".preview-nav-btn.prev");
    const nextBtn = modal.querySelector(".preview-nav-btn.next");

    let currentIndex = -1;
    const works = Array.from(items);

    function open(index) {
  if (index < 0 || index >= works.length) return;

  // Tentukan arah animasi
  const direction = index > currentIndex ? "slide-right" : "slide-left";

  // Reset animasi sebelumnya
  imgEl.classList.remove("slide-left", "slide-right");
  void imgEl.offsetWidth; // memaksa reflow supaya animasi bisa diulang

  // Pasang animasi baru
  imgEl.classList.add(direction);

  // Update gambar & caption
  imgEl.src = works[index].dataset.img || works[index].querySelector("img").src;
  capEl.textContent = works[index].dataset.title || "Artwork";

  modal.classList.add("show");
  currentIndex = index;
}


    function close() {
      modal.classList.remove("show");
      currentIndex = -1;
    }

    function next() {
      open((currentIndex + 1) % works.length);
    }

    function prev() {
      open((currentIndex - 1 + works.length) % works.length);
    }

    works.forEach((item, i) => {
      item.addEventListener("click", () => open(i));
    });

    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    window.addEventListener("keydown", (e) => {
      if (currentIndex === -1) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });
  }

  /* -------------------------
     Glass card tilt
  ------------------------- */
  function enableTilt(list) {
    if (!list || list.length === 0 || prefersReducedMotion) return;
    list.forEach((card) => {
      let rect = null;
      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY;
        if (clientX == null || clientY == null) return;
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        const rx = (-y / rect.height) * 8;
        const ry = (x / rect.width) * 8;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      }
      function reset() {
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        rect = null;
      }
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", reset);
      card.addEventListener("touchmove", onMove, { passive: true });
      card.addEventListener("touchend", reset);
      card.addEventListener("touchcancel", reset);
    });
  }

  /* -------------------------
     Accessibility
  ------------------------- */
  function initA11y() {
    if (panelBody) panelBody.setAttribute("tabindex", "0");
    navBtns.forEach((btn) => btn.setAttribute("tabindex", "0"));
  }

  /* -------------------------
     Init all
  ------------------------- */
  function initAll() {
    initNavigation();


    window.addEventListener("load", () => {
      initWorksPreview();
    });

    if (window.innerWidth > 760) enableTilt(glassCards);
    initA11y();
  }

  document.addEventListener("DOMContentLoaded", initAll);
})();




const artScroll = document.getElementById("artScroll");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

rightBtn.onclick = () => {
  artScroll.scrollBy({ left: 120, behavior: "smooth" });
}

leftBtn.onclick = () => {
  artScroll.scrollBy({ left: -120, behavior: "smooth" });
}



/* =========================================================
   4. Smooth Scroll Inertia (Panel Body)
   ========================================================= */
const panelScroll = document.querySelector('.page-inner');
if (panelScroll) {
  panelScroll.style.scrollBehavior = "smooth";
}

/* =========================================================
   5. Panel Title Transition
   ========================================================= */
function animateTitleChange(newTitle, newSub) {
  panelTitle.parentElement.classList.add("fading");
  panelSub.classList.add("fading");

  setTimeout(() => {
    panelTitle.textContent = newTitle;
    panelSub.textContent = newSub;

    panelTitle.parentElement.classList.remove("fading");
    panelSub.classList.remove("fading");
  }, 200);
}

/* Patch ke updatePanelHeading existing */
const originalUpdatePanel = updatePanelHeading;
updatePanelHeading = function(name) {
  const titles = {
    home: "Home",
    about: "Fursona",
    works: "Works",
    contact: "Contact",
  };
  const subs = {
    home: "Crafting calm.",
    about: "About my fursona.",
    works: "Some of art works.",
    contact: "Connect with me.",
  };
  animateTitleChange(titles[name], subs[name]);
};


/* =========================================================
   COMMISSION SYSTEM
   ========================================================= */

// STATUS
let commissionStatus = "OPEN"; 
// OPEN, LIMITED, CLOSED

// SLOT SYSTEM
let maxSlots = 3;
let filledSlots = 1;

// ==== UPDATE STATUS CARD ====
function updateCommStatus() {
  const stat = document.getElementById("commStatus");

  if (commissionStatus === "OPEN") {
    stat.textContent = "OPEN";
    stat.style.color = "#2fff77";
  } else if (commissionStatus === "LIMITED") {
    stat.textContent = "LIMITED";
    stat.style.color = "#ffdd55";
  } else {
    stat.textContent = "CLOSED";
    stat.style.color = "#ff5d5d";
  }
}

// ==== UPDATE SLOT BAR ====
function updateSlots() {
  const slotBox = document.getElementById("slotDisplay");
  let icons = "";

  for (let i = 0; i < filledSlots; i++) icons += "🟦";
  for (let i = 0; i < maxSlots - filledSlots; i++) icons += "⬜";

  slotBox.textContent = icons;
}

// ==== FORM GENERATOR ====
document.getElementById("commForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("nameInput").value;
  const type = document.getElementById("typeInput").value;
  const note = document.getElementById("noteInput").value || "-";
  const fileInput = document.getElementById("refFile");

  let fileName = fileInput.files.length
    ? fileInput.files[0].name
    : "Tidak ada file";

  const output = `
Commission Request:
Nama: ${name}
Tipe: ${type}
Referensi File: ${fileName}
Catatan: ${note}
  `;

  document.getElementById("outputMessage").value = output;
});

// ==== INIT ====
updateCommStatus();
updateSlots();
