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
const selectorUI = document.getElementById('selector-ui');
const firstTap = document.getElementById('first-tap');
const secondTap = document.getElementById('second-tap');
const claimScreen = document.getElementById('claim-screen');
const backFromScreenBtn = document.getElementById('back-from-screen');
const backFromClaimBtn = document.getElementById('back-from-claim');
let currentAvatar = 0;
const avatars = ['img/Haru.png', 'img/Cheeze.png', 'img/LifeFourCuts.png', 'img/LifeFourCuts2.png'];
let selectedAvatar = '';
tapOverlay.addEventListener('click', (e) => {
  if (e.target.id !== 'first-tap') return;
  tapOverlay.style.display = 'none';
  document.getElementById('photobooth').style.display = 'none';
  screenContainer.classList.remove('hidden');
  selectorUI.style.display = 'flex';
});
avatarImg.addEventListener('click', () => {
  avatarImg.classList.toggle('selected');
});
nextBtn.addEventListener('click', () => {
  avatarImg.classList.remove('anim-in');
  avatarImg.classList.add('anim-out');
  setTimeout(() => {
    currentAvatar = (currentAvatar + 1) % avatars.length;
    avatarImg.src = avatars[currentAvatar];
    avatarImg.classList.remove('selected');
    avatarImg.classList.remove('anim-out');
    avatarImg.classList.add('anim-in');
  }, 300);
});
backFromScreenBtn.addEventListener('click', () => {
  screenContainer.classList.add('hidden');
  document.getElementById('photobooth').style.display = 'block';
  tapOverlay.style.display = 'block';
});
backFromClaimBtn.addEventListener('click', () => {
  claimScreen.style.display = 'none';
  document.getElementById('photobooth').style.display = 'block';
  tapOverlay.style.display = 'block';
});
const printBtn = document.getElementById('print-btn');
printBtn.addEventListener('click', () => {
  if (!avatarImg.classList.contains('selected')) return;
  selectedAvatar = avatars[currentAvatar];
  sessionStorage.setItem('printedAvatar', selectedAvatar);
  sessionStorage.setItem('claimAnimationPlayed', 'false');
  selectorUI.style.display = 'flex';
  screenContainer.classList.add('hidden');
  document.getElementById('photobooth').style.display = 'block';
  firstTap.style.display = 'none';
  tapOverlay.style.display = 'block';
  tapOverlay.style.pointerEvents = 'none';
  firstTap.style.pointerEvents = 'none';
  setTimeout(() => {
    firstTap.style.display = 'inline';
    tapOverlay.style.pointerEvents = 'none';
    firstTap.style.pointerEvents = 'auto';
  }, 10000);
});
secondTap.addEventListener('click', (e) => {
  e.stopPropagation();
  const printedAvatar = sessionStorage.getItem('printedAvatar');
  if (!printedAvatar) return;
  claimScreen.innerHTML = '';
  const claimWrapper = document.createElement('div');
  Object.assign(claimWrapper.style, {position: 'relative',display: 'inline-block',width: '100%',maxWidth: '100vw',height: 'auto'});
  claimScreen.appendChild(claimWrapper);
  const claimBg = document.createElement('img');
  claimBg.src = 'claim.png';
  Object.assign(claimBg.style, {display: 'block',width: '100%',height: 'auto'});
  claimWrapper.appendChild(claimBg);
  const claimedImg = document.createElement('img');
  claimedImg.src = printedAvatar;
  Object.assign(claimedImg.style, {zIndex: '1',position: 'absolute',top: '50%',left: '50%',width: '50%',maxWidth: '240px',cursor: 'pointer',transform: 'translate3d(-50%,-195%,0)',willChange: 'transform'});
  claimWrapper.appendChild(claimedImg);
  const claimOverlay = document.createElement('img');
  claimOverlay.src = 'claim2.png';
  Object.assign(claimOverlay.style, {position: 'absolute',top: '0',left: '0',width: '100%',height: '100%',objectFit: 'contain',zIndex: '2',pointerEvents: 'none'});
  claimWrapper.appendChild(claimOverlay);
  Object.assign(backFromClaimBtn.style, {zIndex: '10',display: 'block',pointerEvents: 'auto'});
  claimScreen.appendChild(backFromClaimBtn);
  document.getElementById('photobooth').style.display = 'none';
  tapOverlay.style.display = 'none';
  claimScreen.style.display = 'flex';
  claimScreen.style.flexDirection = 'column';
  claimScreen.style.alignItems = 'center';
  claimScreen.style.justifyContent = 'center';
  const hasAnimated = sessionStorage.getItem('claimAnimationPlayed') === 'true';
  const waitForImage = (img) => new Promise((resolve) => {
    if (img.complete && img.naturalWidth !== 0) return resolve();
    img.addEventListener('load', resolve, {once: true});
    img.addEventListener('error', resolve, {once: true});
  });
  Promise.all([waitForImage(claimBg), waitForImage(claimOverlay), waitForImage(claimedImg)]).then(() => {
    void claimWrapper.offsetWidth;
    if (!hasAnimated) {
      claimedImg.style.transform = 'translate3d(-50%,-195%,0)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          claimedImg.classList.add('claim-avatar');
          sessionStorage.setItem('claimAnimationPlayed', 'true');
        }, 30);
      });
    } else {
      claimedImg.style.transform = 'translate3d(-50%, -11%, 0)';
    }
  });
  claimedImg.addEventListener('click', () => {
    if (claimedImg.requestFullscreen) claimedImg.requestFullscreen();
    else if (claimedImg.webkitRequestFullscreen) claimedImg.webkitRequestFullscreen();
  });
});
const fullscreenExitBtn = document.getElementById('fullscreen-exit');
document.addEventListener('fullscreenchange', () => {
  fullscreenExitBtn.classList.toggle('hidden', !document.fullscreenElement);
});
fullscreenExitBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    claimScreen.style.display = 'flex';
  }
});
