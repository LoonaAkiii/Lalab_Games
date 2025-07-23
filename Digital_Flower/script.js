const btn = document.getElementById('drawBtn');
const input = document.getElementById('commandInput');
const notif = document.getElementById('notification');
const flowerContainer = document.querySelector('.rose-container');
const flowerMessages = [
  `Nyeheheee flowers for bubu!!🌸 >:33`,
  `Fabooty flowerss!! >:DD`,
  `Dudu flowers for Bubuuu!! >:DD`,
  `Flowers ka sakinnn!! >;P`,
  `You loves me... you loves me not... you loves me!! >:DD`
];
const bantotMessages = [
  `Bantotie ka!! >:((`,
  `Hanyaaa!! >:UU`,
  `Wala to guyss >:UU`
];
let isAnimating = false;
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}
function showNotification(message, isError = false) {
  return new Promise((resolve) => {
    notif.textContent = message;
    notif.className = isError ? 'error' : 'success';
    setTimeout(() => {
      notif.classList.add('hidden');
      setTimeout(() => {
        notif.className = 'hidden';
        resolve();
      }, 300);
    }, 2000);
  });
}
function cleanInput(text) {
  return text.toLowerCase().replace(/[.,!?]/g, '').trim();
}
function colorizeRose(color) {
  document.querySelectorAll('.petal').forEach((petal, i) => {
    if (i === 2 || i === 3) {
      petal.style.background = darkenColor(color, 20);
    } else {
      petal.style.background = color;
    }
  });
}
function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
}
btn.addEventListener('click', async () => {
  if (isAnimating) return;
  btn.classList.remove('bounce');
  void btn.offsetWidth;
  btn.classList.add('bounce');
  const raw = input.value;
  const cleaned = cleanInput(raw);
  const triggers = ['hello','hi','how are you','what','bantot','fabooty','cutie','buttcrack','dudu','thank you','wala','ano'];
  const matches = triggers.some(trigger => cleaned.includes(trigger));
  isAnimating = true;
  btn.disabled = true;
  input.disabled = true;
  if (matches) {
    const color = getRandomColor();
    const message = flowerMessages[Math.floor(Math.random() * flowerMessages.length)];
    colorizeRose(color);
    flowerContainer.classList.remove('hidden');
    await showNotification(message);
  } else {
    const errorMessage = bantotMessages[Math.floor(Math.random() * bantotMessages.length)];
    await showNotification(errorMessage, true);
  }
  isAnimating = false;
  btn.disabled = false;
  input.disabled = false;
});
document.getElementById('exit-button').addEventListener('click', () => {
  sessionStorage.removeItem('digitalflower');
  window.location.href = "../index.html";
});
flowerContainer.classList.add('hidden');
document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const loadingScreen = document.getElementById('loading-screen');
  const tapText = document.querySelector('.tap-text');
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const alreadyLoaded = sessionStorage.getItem('digitalflower');
  const fromHub = document.referrer.includes('index.html');
  const tryPlayMusic = () => {
    if (music && music.paused) {
      music.play().catch(() => {});
    }
  };
  if (fromHub && !alreadyLoaded && loadingScreen && tapText) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      tapText.style.display = 'block';
      const continueHandler = () => {
        loadingScreen.style.display = 'none';
        document.getElementById('exit-button').classList.remove('hidden');
        document.body.style.overflow = '';
        sessionStorage.setItem('digitalflower', 'true');
        localStorage.setItem('musicConfirmed', 'yes');
        window.removeEventListener('click', continueHandler);
        window.removeEventListener('touchstart', continueHandler);
        const blocker = document.createElement('div');
        blocker.style.position = 'fixed';
        blocker.style.top = '0';
        blocker.style.left = '0';
        blocker.style.width = '100%';
        blocker.style.height = '100%';
        blocker.style.zIndex = '9999';
        blocker.style.background = 'transparent';
        document.body.appendChild(blocker);
        setTimeout(() => {
          document.body.removeChild(blocker);
        }, 300);
        tryPlayMusic();
      };
      window.addEventListener('click', continueHandler);
      window.addEventListener('touchstart', continueHandler);
    }, 3000);
    return;
  } else {
    if (loadingScreen) loadingScreen.style.display = 'none';
  }
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
  const resumeOnUserInteraction = () => {
    tryPlayMusic();
  };
  window.addEventListener('click', resumeOnUserInteraction);
  window.addEventListener('touchstart', resumeOnUserInteraction);
  window.addEventListener('scroll', resumeOnUserInteraction);
});