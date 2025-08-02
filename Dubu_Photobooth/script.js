const exitBtn = document.getElementById('exit-btn');
const music = document.getElementById('bg-music');
const loadingScreen = document.getElementById('loading-screen');
const tapText = document.querySelector('.tap-text');
const progressFill = document.getElementById('progress-fill');
const progressIcon = document.getElementById('progress-icon');
const progressWrapper = document.querySelector('.progress-wrapper');
exitBtn.addEventListener('click', () => {
  sessionStorage.removeItem('photobooth');
  window.location.href = "../index.html";
});
document.addEventListener('DOMContentLoaded', () => {
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const alreadyLoaded = sessionStorage.getItem('photobooth');
  const tryPlayMusic = () => {
    if (music && music.paused) music.play().catch(() => {});
  };
  const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const animateProgress = () => {
    const iconWidth = progressIcon.offsetWidth;
    const barWidth = progressWrapper.clientWidth;
    const iconOffset = 22;
    const maxLeft = barWidth - iconWidth + iconOffset;
    const duration = 3000;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutSine(t);
      progressIcon.style.left = (maxLeft * eased) + 'px';
      progressFill.style.width = ((maxLeft * eased + iconWidth / 2) / barWidth * 100) + '%';
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        progressFill.style.width = '100%';
        progressIcon.style.left = maxLeft + 'px';
        setTimeout(() => {
          tapText.classList.add('show');
          setTimeout(() => {
            tapText.classList.add('loop');
            enableTap();
          }, 800);
        }, 300);
      }
    };
    requestAnimationFrame(step);
  };
  const enableTap = () => {
    const continueHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      loadingScreen.classList.add('exit');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('photobooth', 'true');
        tryPlayMusic();
        localStorage.setItem('musicConfirmed', 'yes');
        exitBtn.classList.remove('hidden');
      }, 600);
      window.removeEventListener('click', continueHandler, { passive: false });
      window.removeEventListener('touchstart', continueHandler, { passive: false });
    };
    window.addEventListener('click', continueHandler, { passive: false });
    window.addEventListener('touchstart', continueHandler, { passive: false });
  };
  if (!alreadyLoaded && loadingScreen && tapText) {
    document.body.style.overflow = 'hidden';
    progressIcon.style.opacity = '1';
    animateProgress();
  } else {
    if (loadingScreen) loadingScreen.style.display = 'none';
    exitBtn.classList.remove('hidden');
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
const tapOverlay = document.getElementById('tap-overlay');
const screenContainer = document.getElementById('screen-container');
const avatarImg = document.getElementById('avatar-img');
const nextBtn = document.getElementById('next-btn');
let currentAvatar = 0;
const avatars = ['img/Haru.png', 'img/Cheeze.png', 'img/LifeFourCuts.png', 'img/LifeFourCuts2.png'];
tapOverlay.addEventListener('click', () => {
  tapOverlay.style.display = 'none';
  document.getElementById('photobooth').style.display = 'none';
  screenContainer.classList.remove('hidden');
});
avatarImg.addEventListener('click', () => {
  avatarImg.classList.toggle('selected');
});
nextBtn.addEventListener('click', () => {
  const avatarArea = document.querySelector('.avatar-area');
  avatarArea.classList.remove('anim-in');
  avatarArea.classList.add('anim-out');
  setTimeout(() => {
    currentAvatar = (currentAvatar + 1) % avatars.length;
    avatarImg.src = avatars[currentAvatar];
    avatarImg.classList.remove('selected');
    avatarArea.classList.remove('anim-out');
    avatarArea.classList.add('anim-in');
  }, 300);
});