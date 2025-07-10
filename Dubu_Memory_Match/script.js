const cardImages = [
  { src: 'air_bubu.webm', match: 'air_dudu.webm' },
  { src: 'air_dudu.webm', match: 'air_bubu.webm' },
  { src: 'angry_bubu.webm', match: 'angry_dudu.webm' },
  { src: 'angry_dudu.webm', match: 'angry_bubu.webm' },
  { src: 'baby_bubu.webm', match: 'baby_dudu.webm' },
  { src: 'baby_dudu.webm', match: 'baby_bubu.webm' },
  { src: 'duck_bubu.webm', match: 'duck_dudu.webm' },
  { src: 'duck_dudu.webm', match: 'duck_bubu.webm' },
  { src: 'eat_bubu.webm', match: 'eat_dudu.webm' },
  { src: 'eat_dudu.webm', match: 'eat_bubu.webm' },
  { src: 'happy_bubu.webm', match: 'happy_dudu.webm' },
  { src: 'happy_dudu.webm', match: 'happy_bubu.webm' },
  { src: 'icecream_bubu.webm', match: 'icecream_dudu.webm' },
  { src: 'icecream_dudu.webm', match: 'icecream_bubu.webm' },
  { src: 'work_bubu.webm', match: 'work_dudu.webm' },
  { src: 'work_dudu.webm', match: 'work_bubu.webm' }
];
let firstCard = null;
let secondCard = null;
let matches = 0;
let lockBoard = false;
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function preloadImages() {
  cardImages.forEach(({ src }) => {
    const img = new Image();
    img.src = src.replace('.webm', '.png');
  });
}
function createCard(pair) {
  const card = document.createElement('div');
  card.classList.add('card');
  const img = document.createElement('img');
  img.src = pair.src.replace('.webm', '.png');
  img.alt = 'card image';
  img.loading = 'lazy';
  img.classList.add('hidden');
  const video = document.createElement('video');
  video.src = pair.src;
  video.loop = true;
  video.autoplay = false;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.preload = 'auto';
  video.classList.add('hidden');
  card.appendChild(img);
  card.appendChild(video);
  card.dataset.match = pair.match;
  card.dataset.src = pair.src;
  card.dataset.status = 'unflipped';
  card.addEventListener('click', flipCard);
  return card;
}
function flipCard() {
  if (lockBoard || this === firstCard || this.dataset.status === 'matched') return;
  const video = this.querySelector('video');
  const img = this.querySelector('img');
  img.classList.add('hidden');
  video.classList.remove('hidden');
  video.load();
  setTimeout(() => {
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, 50);
  this.dataset.status = 'flipped';
  this.classList.add('flipped');
  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;
    checkForMatch();
  }
}
function checkForMatch() {
  const isMatch = firstCard.dataset.match === secondCard.dataset.src;
  if (isMatch) {
    markAsMatched();
  } else {
    unflipCards();
  }
}
function markAsMatched() {
  [firstCard, secondCard].forEach(card => {
    card.classList.add('matched');
    card.dataset.status = 'matched';
    const video = card.querySelector('video');
    const img = card.querySelector('img');
    video.pause();
    video.classList.add('hidden');
    img.classList.remove('hidden');
    card.removeEventListener('click', flipCard);
  });
  matches++;
  resetBoard();
  if (matches === cardImages.length / 2) {
    setTimeout(showWinDialog, 500);
  }
}
function unflipCards() {
  setTimeout(() => {
    [firstCard, secondCard].forEach(card => {
      const video = card.querySelector('video');
      const img = card.querySelector('img');
      video.pause();
      video.classList.add('hidden');
      img.classList.add('hidden');
      card.classList.remove('flipped');
      card.dataset.status = 'unflipped';
    });
    resetBoard();
  }, 1000);
}
function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
function showWinDialog() {
  document.getElementById('winDialog').classList.remove('hidden');
  document.getElementById('yesButton').addEventListener('click', () => {
    document.getElementById('winDialog').classList.add('hidden');
    document.getElementById('gameBoard').classList.add('hidden');
    document.querySelector('h1').classList.add('hidden');
    showDoubleNyeheyyy();
  }, { once: true });
}
function showDoubleNyeheyyy() {
  document.getElementById('doubleNyeheyyySection').classList.remove('hidden');
  document.getElementById('letterButton').addEventListener('click', () => {
    document.getElementById('letterFromDuduContainer').classList.remove('hidden');
    document.getElementById('doubleNyeheyyySection').classList.add('hidden');
  }, { once: true });
}
function handleNoButtonClick() {
  const btn = document.getElementById('noButton');
  if (!btn.classList.contains('shrink')) {
    btn.classList.add('shrink');
  } else {
    btn.classList.add('hidden-button');
  }
}
document.getElementById('noButton').addEventListener('click', handleNoButtonClick);
document.getElementById('exit-button').addEventListener('click', () => {
  window.location.href = "../index.html";
});
document.getElementById('letterButton').addEventListener('click', () => {
  document.getElementById('letterFromDuduContainer').classList.remove('hidden');
  document.getElementById('doubleNyeheyyySection').classList.add('hidden');
}, { once: true });
document.getElementById('playAgainButton').addEventListener('click', () => {
  document.getElementById('letterFromDuduContainer').classList.add('hidden');
  document.getElementById('doubleNyeheyyySection').classList.add('hidden');
  document.querySelector('h1').classList.remove('hidden');
  document.getElementById('gameBoard').classList.remove('hidden');
  document.getElementById('gameBoard').innerHTML = '';
  matches = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  initGame();
});
function initGame() {
  shuffle(cardImages);
  preloadImages();
  const board = document.getElementById('gameBoard');
  cardImages.forEach(pair => {
    const card = createCard(pair);
    board.appendChild(card);
  });
}
initGame();