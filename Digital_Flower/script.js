const btn = document.getElementById('drawBtn');
const input = document.getElementById('commandInput');
const exitBtn = document.getElementById('exit-button');
const notif = document.getElementById('notification');
const flowerContainer = document.querySelector('.rose-container');
const music = document.getElementById('bg-music');
const loadingScreen = document.getElementById('loading-screen');
const tapText = document.querySelector('.tap-text');

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
  exitBtn.disabled = true;

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
  exitBtn.disabled = false;
});

exitBtn.addEventListener('click', () => {
  sessionStorage.removeItem('digitalflower');
  window.location.href = "../index.html";
});

document.addEventListener('DOMContentLoaded', () => {
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const alreadyLoaded = sessionStorage.getItem('digitalflower');
  const fromHub = document.referrer.includes('index.html');

  const tryPlayMusic = () => {
    if (music && music.paused) {
      music.play().catch(() => {});
    }
  };

  const disableControls = () => {
    btn.disabled = true;
    input.disabled = true;
    exitBtn.disabled = true;
  };

  const enableControls = () => {
    btn.disabled = false;
    input.disabled = false;
    exitBtn.disabled = false;
  };

  const cleanup = () => {
    loadingScreen.style.display = 'none';
    exitBtn.classList.remove('hidden');
    sessionStorage.setItem('digitalflower', 'true');
  };

  const handleTap = () => {
    tapText.style.display = 'none';
    cleanup();
    setTimeout(() => {
      enableControls();
      tryPlayMusic();
      // Do not call input.focus() here to avoid iOS keyboard issue
    }, 300);
  };

  if (fromHub && !alreadyLoaded) {
    disableControls();
    setTimeout(() => {
      tapText.style.display = 'block';
      tapText.addEventListener('click', handleTap, { once: true });
      tapText.addEventListener('touchstart', handleTap, { once: true });
    }, 3000);
  } else {
    cleanup();
    if (hasConfirmed) {
      tryPlayMusic();
    } else {
      const enableMusic = () => {
        tryPlayMusic();
        localStorage.setItem('musicConfirmed', 'yes');
        window.removeEventListener('click', enableMusic);
        window.removeEventListener('touchstart', enableMusic);
      };
      window.addEventListener('click', enableMusic, { once: true });
      window.addEventListener('touchstart', enableMusic, { once: true });
    }
  }
});
