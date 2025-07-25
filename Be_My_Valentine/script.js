let noClickCount = 0;
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    const vids = p.querySelectorAll('video');
    vids.forEach(v => v.pause());
  });
  const target = document.getElementById(`page-${page}`);
  target.classList.add('active');
  const activeVids = target.querySelectorAll('video');
  activeVids.forEach(v => {
    v.currentTime = 0;
    v.play();
  });
}
function handleNoClick() {
  noClickCount++;
  if (noClickCount === 1) {
    goTo('no1');
    shrinkNo('no-button-1', 0.5);
  } else if (noClickCount === 2) {
    goTo('no2');
    shrinkNo('no-button-2', 0.2);
  } else {
    goTo('no3');
  }
}
function shrinkNo(id, scale) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.style.transform = `scale(${scale})`;
  }
}
function resetGame() {
  noClickCount = 0;
  goTo('index');
}
function exitGame() {
  sessionStorage.removeItem('valentineLoaded');
  window.location.href = "../index.html";
}
window.onload = () => {
  goTo('index');
};
document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const alreadyLoaded = sessionStorage.getItem('valentineLoaded');
  const loadingScreen = document.getElementById('loading-screen');
  const tapText = document.querySelector('.tap-text');
  const progressFill = document.getElementById('progress-fill');
  const progressIcon = document.getElementById('progress-icon');
  const progressWrapper = document.querySelector('.progress-wrapper');
  const tryPlayMusic = () => {
    if (music && music.paused) {
      music.play().catch(() => {});
    }
  };
  const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const animateProgress = () => {
    let progress = 0;
    progressIcon.style.opacity = '1';
    const iconWidth = progressIcon.offsetWidth;
    const barWidth = progressWrapper.clientWidth;
    const maxLeft = barWidth - iconWidth;
    const step = () => {
      if (progress < 100) {
        progress += 1;
        const eased = easeInOutSine(progress / 100);
        progressFill.style.width = progress + '%';
        progressIcon.style.left = (maxLeft * eased) + 'px';
        setTimeout(step, 30);
      } else {
        progressFill.style.width = '100%';
        progressIcon.style.left = (maxLeft + 20) + 'px';
        setTimeout(() => {
          tapText.classList.add('show');
          setTimeout(() => {
            tapText.classList.add('loop');
            enableTap();
          }, 800);
        }, 300);
      }
    };
    step();
  };
  const enableTap = () => {
    const continueHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      loadingScreen.classList.add('exit');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('valentineLoaded', 'true');
        tryPlayMusic();
        localStorage.setItem('musicConfirmed', 'yes');
      }, 600);
      window.removeEventListener('click', continueHandler, { passive: false });
      window.removeEventListener('touchstart', continueHandler, { passive: false });
    };
    window.addEventListener('click', continueHandler, { passive: false });
    window.addEventListener('touchstart', continueHandler, { passive: false });
  };
  if (!alreadyLoaded && loadingScreen && tapText) {
    document.body.style.overflow = 'hidden';
    animateProgress();
  } else {
    if (loadingScreen) loadingScreen.style.display = 'none';
    const enableMusic = () => {
      tryPlayMusic();
      localStorage.setItem('musicConfirmed', 'yes');
      window.removeEventListener('click', enableMusic);
      window.removeEventListener('touchstart', enableMusic);
    };
    if (!hasConfirmed) {
      window.addEventListener('click', enableMusic, { once: true });
      window.addEventListener('touchstart', enableMusic, { once: true });
    } else {
      tryPlayMusic();
    }
  }
});