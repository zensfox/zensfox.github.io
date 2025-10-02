/* Updated script.js — perbaikan jam ngebug & proteksi null refs */

/* --- particles (tetap sama) --- */
particlesJS("particles-js", {
  particles: {
    number: { value: 250 },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.8, random: true },
    size: {
      value: 15,
      random: {
        enable: true,
        minimumValue: 8,
      }
    },
    move: {
      direction: "bottom",
      speed: 3,
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false
    },
    line_linked: { enable: false }
  },
  interactivity: {
    detectsOn: "canvas",
    events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }
  },
  retina_detect: true
});

/* --- sounds / audio --- */
const clickSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_b648cf4031.mp3?filename=click-124467.mp3');
const audio = document.getElementById("bgm");

/* --- helpers & globals --- */
let currentFrame = 'home';
let clockInterval = null; // guard supaya interval jam nggak dobel

function togglePlay() {
  const btn = document.getElementById("bgm-toggle");
  if (btn) {
    btn.classList.remove('glow');
    void btn.offsetWidth;
    btn.classList.add('glow');
    setTimeout(() => btn.classList.remove('glow'), 300);
  }

  if (!audio) return;
  if (audio.paused) {
    audio.play().catch(()=>{}); // catch buat safety (browsers sometimes block autoplay)
    btn && (btn.textContent = '♫');
  } else {
    audio.pause();
    btn && (btn.textContent = '♫');
  }
}

document.addEventListener("visibilitychange", () => {
  if (!audio) return;
  if (document.hidden) audio.pause();
  else audio.play().catch(()=>{});
});

/* --- frame switching (robust) --- */
function showFrame(frameId, btn) {
  try { clickSound.play(); } catch(e){}

  if (frameId === currentFrame) return;

  const outgoing = document.getElementById(currentFrame);
  if (outgoing) {
    outgoing.classList.remove('show');
    outgoing.style.display = 'none';
  }

  const incoming = document.getElementById(frameId);
  if (incoming) {
    incoming.style.display = 'block';
    // reset animations a bit
    incoming.classList.remove('slide-left','slide-right','fade-in','fade-in-up');
    void incoming.offsetWidth;
    incoming.classList.add('fade-in');
    incoming.classList.add('show');
  }

  document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  currentFrame = frameId;
}

/* --- safe toggle-panels --- */
document.querySelectorAll(".toggle-panel").forEach(button => {
  button.addEventListener("click", () => {
    try { clickSound.play(); } catch(e){}
    const panel = document.getElementById(button.dataset.target);
    document.querySelectorAll(".panel-toggle").forEach(p => {
      if (p !== panel) p.classList.remove("show");
    });
    panel && panel.classList.toggle("show");
  });
});

/* --- nav indicator (safe) --- */
function moveIndicatorTo(btn) {
  const indicator = document.querySelector('.nav-indicator');
  if (!indicator || !btn) return; // guard
  try {
    const rect = btn.getBoundingClientRect();
    const parentRect = btn.parentElement.getBoundingClientRect();
    indicator.style.left = `${rect.left - parentRect.left}px`;
    indicator.style.width = `${rect.width}px`;
  } catch (e) { /* fail silently */ }
}

/* === CLOCK fixes === */
function updateClock() {
  const clock = document.getElementById("clock-indicator");
  if (!clock) return;

  const now = new Date();
  const h = now.getHours().toString().padStart(2,"0");
  const m = now.getMinutes().toString().padStart(2,"0");
  const newTime = `${h}:${m}`;

  // hanya update saat menit berubah (menghindari repaint tak perlu)
  if (clock.dataset.lastTime !== newTime) {
    clock.textContent = newTime;
    clock.dataset.lastTime = newTime;
  }
}

/* --- theme by time --- */
function autoSetThemeByTime() {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;
  if (isDay) document.body.classList.add("light-mode");
  else document.body.classList.remove("light-mode");
}

/* --- zen mood / facts (keamanan element null) --- */
function updateZenMood() {
  const moods = [
    "Zen is drifting through snowy thoughts ❄️",
    "Zen is meditating in silence... again.",
    "Zen is stargazing under the night sky.",
    "Zen is sketching stars with his tail.",
    "Zen is enjoying the cold in peace.",
    "Zen is approaching you quietly, tail wagging slowly.",
    "Zen is hiding behind snowflakes today.",
    "Zen is half-asleep but still listening.",
    "Zen is humming a lullaby for the aurora."
  ];
  const el = document.getElementById("zen-mood");
  if (!el) return;
  let i = 0;

  function typeMood(text, callback) {
    let j = 0;
    el.textContent = '';
    el.style.opacity = 1;
    const typing = setInterval(() => {
      if (j < text.length) el.textContent += text[j++];
      else {
        clearInterval(typing);
        if (callback) callback();
      }
    }, 40);
  }

  function nextMood() {
    const mood = moods[i];
    typeMood(mood, () => {
      setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => {
          i = (i + 1) % moods.length;
          nextMood();
        }, 100000);
      }, 4000);
    });
  }

  nextMood();
}

function showRandomFact() {
  const facts = [
    "Zen’s fur glows faintly under moonlight.",
    "Zen’s favorite snack is ice cube... Kinda sad.",
    "Zen’s glasses are purely for aesthetics.",
    "Zen’s halo glows brighter when he’s deep in thought.",
    "Zen once hibernate by accident — for 3 days.",
    "Zen’s name, 雪星 (Xuĕ xīng), means 'Snow Star'"
  ];
  const factEl = document.getElementById("zen-fact");
  if (!factEl) return;
  factEl.textContent = "Fun Fact: " + facts[Math.floor(Math.random() * facts.length)];
}

/* --- init (safely) --- */
function initMainContent() {
  // try move indicator to new frame-btn active (fallback ke nav-item jika ada)
  const activeBtn = document.querySelector('.frame-btn.active') || document.querySelector('.nav-item.active');
  moveIndicatorTo(activeBtn);

  autoSetThemeByTime();
  updateClock();

  // clear previous interval jika ada (menghindari multiple intervals)
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClock, 1000);

  updateZenMood();
  showRandomFact();
}

/* --- existing loading overlay + start sequence (tetap sama logic) --- */
document.addEventListener("DOMContentLoaded", () => {
  let percent = 0;
  const percentText = document.getElementById("loading-percent");
  const fill = document.getElementById("loading-fill");
  const overlay = document.getElementById("loading-overlay");
  const main = document.getElementById("main-content");
  const warp = document.getElementById("warp-ring");
  const message = document.getElementById("loading-text");

  const messages = [
    "Stabilizing warp field...",
    "Charging dimensional core...",
    "Tuning frost resonance...",
    "Opening Zen gateway...",
    "Finalizing link..."
  ];

  const interval = setInterval(() => {
    percent++;
    percentText && (percentText.textContent = percent + "%");
    fill && (fill.style.width = percent + "%");

    if (percent % 25 === 0 && message) {
      message.textContent = messages[Math.floor(Math.random() * messages.length)];
    }

    if (percent >= 100) {
      clearInterval(interval);
      warp && warp.classList.add("expand");

      setTimeout(() => {
        if (overlay) overlay.style.opacity = 0;
        setTimeout(() => {
          overlay && overlay.remove();
          if (main) {
            main.style.display = "block";
            main.classList.add("fade-in-up");
          }

          setTimeout(() => {
            try {
              particlesJS("particles-js", { /* same settings as top (ok to re-init) */ 
                particles: {
                  number: { value: 250 }, color: { value: "#ffffff" }, shape: { type: "circle" },
                  opacity: { value: 0.8, random: true }, size: { value: 15, random: { enable: true, minimumValue: 8 } },
                  move: { direction: "bottom", speed: 3, random: false, straight: false, out_mode: "out", bounce: false },
                  line_linked: { enable: false }
                },
                interactivity: { detectsOn: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
                retina_detect: true
              });
            } catch(e){}
          }, 100);

          try { initMainContent(); } catch(e){}
        }, 700);
      }, 1000);
    }
  }, 25);
});

/* --- gallery (tetap ada) --- */
const galleryData = [
  { img: "img1.jpg", title: "Art 1", desc: "Profile Photo :v", artist: "@just_a_cocox", date: "14/4/2025", tools: "IbisPaint", tags: "furry,digital Art." },
  { img: "img2.jpg", title: "Art 2", desc: "Romance :v", artist: "@Neotsaqif", date: "4/4/2025", tools: "IbisPaint", tags: "digital art" },
  { img: "img3.jpg", title: "Art 3", desc: "With Yuki :v", artist: "@just_a_cocox", date: "23/6/2026", tools: "IbisPaint", tags: "furry,digital art" }
];

let currentIndex = 0;

function selectArt(index) {
  currentIndex = index;
  renderGallery();
}

function navigate(dir) {
  currentIndex += dir;
  if (currentIndex < 0) currentIndex = galleryData.length - 1;
  if (currentIndex >= galleryData.length) currentIndex = 0;
  renderGallery();
}

function renderGallery() {
  const data = galleryData[currentIndex];
  const mainArt = document.getElementById("main-art");
  const titleEl = document.getElementById("selected-title");
  const infoList = document.querySelector(".art-info");
  if (!mainArt || !titleEl || !infoList) return;

  mainArt.classList.remove("fade-in");
  void mainArt.offsetWidth;

  if (data.img) {
    mainArt.src = data.img;
    mainArt.style.display = "block";
  } else {
    mainArt.src = "";
    mainArt.style.display = "none";
  }

  titleEl.textContent = data.title || `Slot ${currentIndex + 1}`;
  infoList.innerHTML = data.img ? `
    <li><strong>🎨 Artist:</strong> ${data.artist}</li>
    <li><strong>📅 Date:</strong> ${data.date}</li>
    <li><strong>🖌️ Tools:</strong> ${data.tools}</li>
    <li><strong>📎 Tags:</strong> ${data.tags}</li>
  ` : `<li><em>This slot is empty.</em></li>`;

  setTimeout(() => mainArt.classList.add("fade-in"), 50);

  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((el, i) => {
    el.classList.toggle("active", i === currentIndex);
    if (galleryData[i].img) {
      el.src = galleryData[i].img;
      el.removeAttribute("data-placeholder");
    } else {
      el.src = "empty.jpg";
      el.setAttribute("data-placeholder", "true");
    }
  });

  const track = document.getElementById("thumbnailTrack");
  if (track) {
    const offset = -(currentIndex * 60 - 60);
    track.style.transform = `translateX(${offset}px)`;
  }
}

document.addEventListener("DOMContentLoaded", renderGallery);

/* --- zoom --- */
function openZoom(src) {
  const overlay = document.getElementById("imageZoomOverlay");
  const zoomImg = document.getElementById("zoomedImage");
  if (!overlay || !zoomImg) return;
  zoomImg.src = src;
  overlay.style.display = "flex";
  setTimeout(() => overlay.classList.add("show"), 10);
}
function closeZoom() {
  const overlay = document.getElementById("imageZoomOverlay");
  if (!overlay) return;
  overlay.classList.remove("show");
  setTimeout(() => {
    overlay.style.display = "none";
    const zi = document.getElementById("zoomedImage");
    if (zi) zi.src = "";
  }, 300);
}




// Hindari fungsi scroll otomatis yang dipanggil oleh script eksternal
(function preventAutoScrollMethods(){
  try {
    // backup original kalau mau restore nanti
    if (!window.__origScrollTo) window.__origScrollTo = window.scrollTo;
    if (!window.__origScrollBy) window.__origScrollBy = window.scrollBy;
    if (!Element.prototype.__origScrollIntoView) Element.prototype.__origScrollIntoView = Element.prototype.scrollIntoView;

    // override jadi noop — mencegah script memaksa scroll
    window.scrollTo = function(){ /* disabled to prevent auto jump */ };
    window.scrollBy = function(){ /* disabled */ };
    Element.prototype.scrollIntoView = function(){ /* disabled */ };

    // jika mau restore: window.scrollTo = window.__origScrollTo; etc.
  } catch(e){ console.warn("preventAutoScrollMethods failed", e); }
})();



function lockScroll() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';
  // cegah touchmove di mobile
  document.addEventListener('touchmove', preventDefaultTouch, { passive: false });
}
function unlockScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.height = '';
  document.removeEventListener('touchmove', preventDefaultTouch);
}
function preventDefaultTouch(e) { e.preventDefault(); }

// Contoh: kunci saat loading overlay tampil
// lockScroll(); // aktifin kalau mau
// unlockScroll(); // restore


document.addEventListener("DOMContentLoaded", () => {
  const creditsBtn = document.getElementById("credits-btn");
  const creditsPanel = document.getElementById("credits-panel");

  if (creditsBtn && creditsPanel) {
    // Pastikan panel dimulai tertutup
    creditsPanel.style.display = "none";

    // Klik tombol -> toggle panel
    creditsBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // cegah langsung ketutup karena klik tombol
      const isOpen = creditsPanel.style.display === "block";
      creditsPanel.style.display = isOpen ? "none" : "block";
    });

    // Klik luar -> nutup panel
    document.addEventListener("click", (e) => {
      if (!creditsPanel.contains(e.target) && e.target !== creditsBtn) {
        creditsPanel.style.display = "none";
      }
    });
  }
});



document.addEventListener("touchmove", function(e) {
  // Cek arah swipe → kalau geser horizontal, block
  if (Math.abs(e.touches[0].clientX - (e.startX || e.touches[0].clientX)) > 10) {
    e.preventDefault();
  }
}, { passive: false });
