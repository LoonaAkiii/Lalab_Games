const digits = [0, 0, 0, 0];
const correctCode = '0313';
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
function changeDigit(index, delta) {
  digits[index] = (digits[index] + delta + 10) % 10;
  document.getElementById(`digit-${index}`).textContent = digits[index];
  checkCode();
}
function checkCode() {
  const entered = digits.join('');
  if (entered === correctCode) {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('letterScreen').style.display = 'block';
    resizeCanvas();
  }
}
function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function scratch(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}
function lockAgain() {
  document.getElementById('letterScreen').style.display = 'none';
  document.getElementById('lockScreen').style.display = 'flex';
  digits.fill(0);
  for (let i = 0; i < 4; i++) {
    document.getElementById(`digit-${i}`).textContent = '0';
  }
}
function exitGame() {
  sessionStorage.removeItem('gameLoadedOnce');
  window.location.href = "../index.html";
}
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());
document.body.onmousedown = e => e.preventDefault();
canvas.addEventListener('mousedown', () => canvas.addEventListener('mousemove', scratch));
canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', scratch));
canvas.addEventListener('touchstart', scratch, { passive: false });
canvas.addEventListener('touchmove', scratch, { passive: false });
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const loadingScreen = document.getElementById('loading-screen');
  const tapText = document.querySelector('.tap-text');
  const fromHub = document.referrer.includes('index.html');
  const alreadyLoaded = sessionStorage.getItem('gameLoadedOnce');
  const tryPlayMusic = () => {
    if (music && music.paused) {
      music.play().catch(() => {});
    }
  };
  if (fromHub && !alreadyLoaded && loadingScreen && tapText) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      tapText.style.display = 'block';
      const handleTapToContinue = () => {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('gameLoadedOnce', 'true');
        if (!hasConfirmed) {
          music.play().then(() => {
            localStorage.setItem('musicConfirmed', 'yes');
          }).catch(() => {});
        } else {
          tryPlayMusic();
        }
        window.removeEventListener('click', handleTapToContinue);
        window.removeEventListener('touchstart', handleTapToContinue);
        window.addEventListener('click', tryPlayMusic);
        window.addEventListener('touchstart', tryPlayMusic);
        window.addEventListener('scroll', tryPlayMusic);
      };
      window.addEventListener('click', handleTapToContinue);
      window.addEventListener('touchstart', handleTapToContinue);
    }, 3000);
  } else {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (hasConfirmed) {
      tryPlayMusic();
      window.addEventListener('click', tryPlayMusic);
      window.addEventListener('touchstart', tryPlayMusic);
      window.addEventListener('scroll', tryPlayMusic);
    } else {
      const enableMusic = () => {
        music.play().then(() => {
          localStorage.setItem('musicConfirmed', 'yes');
        }).catch(() => {});
        window.removeEventListener('click', enableMusic);
        window.removeEventListener('touchstart', enableMusic);
        window.removeEventListener('scroll', enableMusic);
        window.addEventListener('click', tryPlayMusic);
        window.addEventListener('touchstart', tryPlayMusic);
        window.addEventListener('scroll', tryPlayMusic);
      };
      window.addEventListener('click', enableMusic, { once: true });
      window.addEventListener('touchstart', enableMusic, { once: true });
      window.addEventListener('scroll', enableMusic, { once: true });
    }
  }
});