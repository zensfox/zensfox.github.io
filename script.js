particlesJS("particles-js", {
  particles: {
    number: { value: 250 },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: {
      value: 0.8,
      random: true
    },
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
    line_linked: {
      enable: false
    }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onhover: { enable: false },
      onclick: { enable: false },
      resize: true
    }
  },
  retina_detect: true
});


const clickSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_b648cf4031.mp3?filename=click-124467.mp3');
const audio = document.getElementById("bgm");

function togglePlay() {
  const btn = document.getElementById("bgm-toggle");
  btn.classList.remove('glow');
  void btn.offsetWidth;
  btn.classList.add('glow');
  setTimeout(() => btn.classList.remove('glow'), 300);

  if (audio.paused) {
    audio.play();
    btn.textContent = '♫';
  } else {
    audio.pause();
    btn.textContent = '♫';
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) audio.pause();
  else audio.play();
});

let currentFrame = 'home'; // default

function showFrame(frameId, btn) {
  clickSound.play();
  if (btn.classList.contains("active")) return;

  const outgoing = document.getElementById(currentFrame);
  const incoming = document.getElementById(frameId);

  // Sembunyikan frame lama
  outgoing.classList.remove('show');
  outgoing.style.display = 'none';

  // Animasi frame baru
  incoming.style.display = 'block';
  incoming.classList.remove('slide-left', 'slide-right');
  void incoming.offsetWidth; // reset animasi

  if (frameId === 'home' && currentFrame === 'project') {
    incoming.classList.add('slide-left');
  } else if (frameId === 'project' && currentFrame === 'home') {
    incoming.classList.add('slide-right');
  } else {
    incoming.classList.add('fade-in'); // fallback
  }

  incoming.classList.add('show');

  // Update nav
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  moveIndicatorTo(btn);

  currentFrame = frameId;
}


document.querySelectorAll(".toggle-panel").forEach(button => {
  button.addEventListener("click", () => {
    clickSound.play();
    const panel = document.getElementById(button.dataset.target);
    document.querySelectorAll(".panel-toggle").forEach(p => {
      if (p !== panel) p.classList.remove("show");
    });
    panel.classList.toggle("show");
  });
});

function moveIndicatorTo(btn) {
  const indicator = document.querySelector('.nav-indicator');
  const rect = btn.getBoundingClientRect();
  const parentRect = btn.parentElement.getBoundingClientRect();
  indicator.style.left = `${rect.left - parentRect.left}px`;
  indicator.style.width = `${rect.width}px`;
}

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const clock = document.getElementById("clock-indicator");
  const newTime = `${h}:${m}`;

  if (clock.textContent !== newTime) {
    clock.classList.remove("animated-in");
    clock.classList.add("animated-out");

    setTimeout(() => {
      clock.textContent = newTime;
      clock.classList.remove("animated-out");
      clock.classList.add("animated-in");
    }, 200);
  }
}


function autoSetThemeByTime() {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;
  if (isDay) {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
}

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
  let i = 0;

  function typeMood(text, callback) {
    let j = 0;
    el.textContent = '';
    el.style.opacity = 1;
    const typing = setInterval(() => {
      el.textContent += text[j++];
      if (j === text.length) {
        clearInterval(typing);
        if (callback) callback();
      }
    }, 60);
  }

  function nextMood() {
    const mood = moods[i];
    typeMood(mood, () => {
      setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => {
          i = (i + 1) % moods.length;
          nextMood();
        }, 36000);
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
  factEl.textContent = "Fun Fact: " + facts[Math.floor(Math.random() * facts.length)];
}

document.addEventListener("DOMContentLoaded", () => {
  moveIndicatorTo(document.querySelector(".nav-item.active"));
  autoSetThemeByTime();
  updateClock();
  setInterval(updateClock, 30000);
  updateZenMood();
  showRandomFact();
});


function openZoom(src) {
  const zoomOverlay = document.getElementById("imageZoomOverlay");
  const zoomImg = document.getElementById("zoomedImage");
  zoomImg.src = src;
  zoomOverlay.style.display = "flex";
}

function closeZoom() {
  const zoomOverlay = document.getElementById("imageZoomOverlay");
  const zoomImg = document.getElementById("zoomedImage");
  zoomImg.src = "";
  zoomOverlay.style.display = "none";
}



document.addEventListener("DOMContentLoaded", () => {
  let percent = 0;
  const percentText = document.getElementById("loading-percent");
  const fill = document.getElementById("loading-fill");
  const overlay = document.getElementById("loading-overlay");
  const main = document.getElementById("main-content");
  const crack = document.querySelector(".ice-crack");
  const message = document.getElementById("loading-message");

  const messages = [
    "Warming frozen thoughts...",
    "Unfreezing memory...",
    "Syncing dream-state...",
    "Reconnecting with Zen...",
    "Finalizing frost boot..."
  ];

  const interval = setInterval(() => {
    percent++;
    percentText.textContent = percent + "%";
    fill.style.width = percent + "%";

    // Ubah teks setiap 25%
    if (percent % 25 === 0 && message) {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      message.textContent = msg;
    }

    // Saat loading selesai
    if (percent >= 100) {
      clearInterval(interval);

      // Jalankan animasi retak
      crack.classList.add("crack-out");

      // Tunggu animasi selesai, lalu tampilkan konten
      setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => {
          overlay.remove();
          if (main) main.style.display = "block";

          // Jalankan init lainnya (kalau ada)
          AOS.init?.();
        }, 700);
      }, 1000);
    }
  }, 25); // total ~2.5 detik loading
});
