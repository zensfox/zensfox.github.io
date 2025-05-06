    particlesJS("particles-js", {
      particles: {
        number: { value: 80 },
        shape: { type: "char" },
        color: { value: "#ffffff" },
        size: { value: 4 },
        move: { speed: 2 },
        line_linked: { enable: false }
      }
    });

    const clickSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_b648cf4031.mp3?filename=click-124467.mp3');
    const bgMusic = new Audio(".mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    window.addEventListener('load', () => {
      bgMusic.play().catch(() => {});
    });

    function showFrame(frameId, btn) {
      clickSound.play();
      const target = document.getElementById(frameId);

      if (btn.classList.contains("active")) return;

      document.querySelectorAll('.frame').forEach(f => {
        f.classList.remove('show');
        f.style.display = 'none';
      });

      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

      target.style.display = 'block';
      void target.offsetWidth;
      target.classList.add('show', 'fade-in');

      btn.classList.add('active');

      setTimeout(() => {
        target.classList.remove('fade-in');
      }, 400);
    }

    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".toggle-panel").forEach(button => {
        button.addEventListener("click", () => {
          clickSound.play();
          const targetId = button.dataset.target;
          const panel = document.getElementById(targetId);

          document.querySelectorAll(".panel-toggle").forEach(p => {
            if (p !== panel) p.classList.remove("show");
          });

          panel.classList.toggle("show");
        });
      });
    });
  
  
  
  
  function toggleShape(img) {
    img.classList.toggle('square');
  }


document.querySelector('.profile-pic').addEventListener('click', function() {
  const zoomOverlay = document.getElementById('imageZoomOverlay');
  const zoomedImage = document.getElementById('zoomedImage');
  zoomedImage.src = this.src;
  zoomOverlay.style.display = 'flex';
});

function closeZoom() {
  document.getElementById('imageZoomOverlay').style.display = 'none';
}

document.querySelector('.fursona-img').addEventListener('click', function() {
  const zoomOverlay = document.getElementById('imageZoomOverlay');
  const zoomedImage = document.getElementById('zoomedImage');
  zoomedImage.src = this.src;
  zoomOverlay.style.display = 'flex';
});

function closeZoom() {
  document.getElementById('imageZoomOverlay').style.display = 'none';
}


particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 250
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.8,
      "random": true
    },
    "size": {
      "value": 10,
      "random": true
    },
    "move": {
      "direction": "bottom",
      "speed": 2,
      "straight": false,
      "out_mode": "out"
    },
    "line_linked": {
      "enable": false
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": false
      },
      "onclick": {
        "enable": false
      }
    }
  },
  "retina_detect": true
});


  const audio = document.getElementById("bgm");
  let isPlaying = false;

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying = !isPlaying;
  }

  const bgm = document.getElementById("bgm");

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      bgm.pause();
    } else {
      bgm.play();
    }
  });
