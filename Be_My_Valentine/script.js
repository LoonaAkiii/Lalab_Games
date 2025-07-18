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
  window.location.href = "../index.html";
}
window.onload = () => {
  goTo('index');
};
document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const tryPlayMusic = () => {
    if (music.paused) {
      music.play().catch(() => {});
    }
  };
  if (hasConfirmed) {
    tryPlayMusic();
  } else {
    const enableMusic = () => {
      music.play().then(() => {
        localStorage.setItem('musicConfirmed', 'yes');
      }).catch(() => {});
      window.removeEventListener('click', enableMusic);
      window.removeEventListener('touchstart', enableMusic);
      window.removeEventListener('scroll', enableMusic);
    };
    window.addEventListener('click', enableMusic, { once: true });
    window.addEventListener('touchstart', enableMusic, { once: true });
    window.addEventListener('scroll', enableMusic, { once: true });
  }
  const retryOnUserAction = () => {
    tryPlayMusic();
  };
  window.addEventListener('click', retryOnUserAction);
  window.addEventListener('touchstart', retryOnUserAction);
  window.addEventListener('scroll', retryOnUserAction);
});