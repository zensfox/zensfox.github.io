
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

let currentFrame = 'home';

function showFrame(frameId, btn) {
  clickSound.play();
  if (btn.classList.contains("active")) return;

  const outgoing = document.getElementById(currentFrame);
  const incoming = document.getElementById(frameId);

  outgoing.classList.remove('show');
  outgoing.style.display = 'none';

  incoming.style.display = 'block';
  incoming.classList.remove('slide-left', 'slide-right');
  void incoming.offsetWidth;

  if (frameId === 'home' && currentFrame === 'project') {
    incoming.classList.add('slide-left');
  } else if (frameId === 'project' && currentFrame === 'home') {
    incoming.classList.add('slide-right');
  } else {
    incoming.classList.add('fade-in');
  }

  incoming.classList.add('show');

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
  factEl.textContent = "Fun Fact: " + facts[Math.floor(Math.random() * facts.length)];
}

function initMainContent() {
  moveIndicatorTo(document.querySelector(".nav-item.active"));
  autoSetThemeByTime();
  updateClock();
  setInterval(updateClock, 30000);
  updateZenMood();
  showRandomFact();
}


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
    percentText.textContent = percent + "%";
    fill.style.width = percent + "%";

    if (percent % 25 === 0 && message) {
      message.textContent = messages[Math.floor(Math.random() * messages.length)];
    }

    if (percent >= 100) {
      clearInterval(interval);
      warp.classList.add("expand");

      setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => {
  overlay.remove();
  if (main) {
    main.style.display = "block";
    main.classList.add("fade-in-up");  // 👈 Tambahkan animasi muncul dari bawah
  }


          setTimeout(() => {
            particlesJS("particles-js", {
              particles: {
                number: { value: 250 },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.8, random: true },
                size: {
                  value: 15,
                  random: { enable: true, minimumValue: 8 }
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
                events: {
                  onhover: { enable: false },
                  onclick: { enable: false },
                  resize: true
                }
              },
              retina_detect: true
            });
          }, 100);

          AOS.init?.();
          initMainContent(); // ← fungsi dijalankan setelah loading selesai

        }, 700);
      }, 1000);
    }
  }, 25);
});




const galleryData = [
  {
    img: "img1.jpg",
    title: "Art 1",
    desc: "Profile Photo :v",
    artist: "@just_a_cocox",
    date: "14/4/2025",
    tools: "IbisPaint",
    tags: "furry,digital Art."
  },
  {
    img: "img2.jpg",
    title: "Art 2",
    desc: "Romance :v",
    artist: "@Neotsaqif",
    date: "4/4/2025",
    tools: "IbisPaint",
    tags: "digital art"
  },
  {
    img: "img3.jpg",
    title: "Art 3",
    desc: "With Yuki :v",
    artist: "@just_a_cocox",
    date: "23/6/2026",
    tools: "IbisPaint",
    tags: "furry,digital art"
  }
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

  // Transisi keluar
  mainArt.classList.remove("fade-in");
  void mainArt.offsetWidth;

  // Update konten
  if (data.img) {
  mainArt.src = data.img;
  mainArt.style.display = "block";
} else {
  mainArt.src = "";
  mainArt.style.display = "none";

void mainArt.offsetWidth; // reset animasi



if (data.img) {
  setTimeout(() => {
    mainArt.classList.add("visible");
  }, 50);
}

  }

  titleEl.textContent = data.title || `Slot ${currentIndex + 1}`;

  infoList.innerHTML = data.img ? `
    <li><strong>🎨 Artist:</strong> ${data.artist}</li>
    <li><strong>📅 Date:</strong> ${data.date}</li>
    <li><strong>🖌️ Tools:</strong> ${data.tools}</li>
    <li><strong>📎 Tags:</strong> ${data.tags}</li>
  ` : `<li><em>This slot is empty.</em></li>`;

  // Aktifkan animasi gambar
  setTimeout(() => {
    mainArt.classList.add("fade-in");
  }, 50);

  // Thumbnail aktif + teks "+"
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

 

  const offset = -(currentIndex * 60 - 60);
  document.getElementById("thumbnailTrack").style.transform = `translateX(${offset}px)`;
}

document.addEventListener("DOMContentLoaded", renderGallery);




function openZoom(src) {
  const overlay = document.getElementById("imageZoomOverlay");
  const zoomImg = document.getElementById("zoomedImage");

  zoomImg.src = src;
  overlay.style.display = "flex";

  // kasih delay buat animasi smooth
  setTimeout(() => {
    overlay.classList.add("show");
  }, 10);
}

function closeZoom() {
  const overlay = document.getElementById("imageZoomOverlay");
  overlay.classList.remove("show");

  // delay biar smooth hilangnya
  setTimeout(() => {
    overlay.style.display = "none";
    document.getElementById("zoomedImage").src = "";
  }, 300);
}




