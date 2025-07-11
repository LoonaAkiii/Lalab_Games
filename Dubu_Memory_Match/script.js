const cardImages = [
  { src: 'air_bubu.mp4', match: 'air_dudu.mp4' },
  { src: 'air_dudu.mp4', match: 'air_bubu.mp4' },
  { src: 'angry_bubu.mp4', match: 'angry_dudu.mp4' },
  { src: 'angry_dudu.mp4', match: 'angry_bubu.mp4' },
  { src: 'baby_bubu.mp4', match: 'baby_dudu.mp4' },
  { src: 'baby_dudu.mp4', match: 'baby_bubu.mp4' },
  { src: 'duck_bubu.mp4', match: 'duck_dudu.mp4' },
  { src: 'duck_dudu.mp4', match: 'duck_bubu.mp4' },
  { src: 'eat_bubu.mp4', match: 'eat_dudu.mp4' },
  { src: 'eat_dudu.mp4', match: 'eat_bubu.mp4' },
  { src: 'happy_bubu.mp4', match: 'happy_dudu.mp4' },
  { src: 'happy_dudu.mp4', match: 'happy_bubu.mp4' },
  { src: 'icecream_bubu.mp4', match: 'icecream_dudu.mp4' },
  { src: 'icecream_dudu.mp4', match: 'icecream_bubu.mp4' },
  { src: 'work_bubu.mp4', match: 'work_dudu.mp4' },
  { src: 'work_dudu.mp4', match: 'work_bubu.mp4' },
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
    img.src = src.replace('.mp4', '.png');
  });
}
function createCard(pair) {
  const card = document.createElement('div');
  card.classList.add('card');
  const img = document.createElement('img');
  img.src = pair.src.replace('.mp4', '.png');
  img.alt = 'card image';
  img.loading = 'lazy';
  img.classList.add('hidden');
  const video = document.createElement('video');
  video.src = pair.src;
  video.loop = true;
  video.autoplay = false;
  video.muted = true;
  video.playsInline = true;
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
  video.currentTime = 0;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
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
    const video = card.querySelector('video');
    const img = card.querySelector('img');
    video.pause();
    video.remove();
    img.classList.remove('hidden');
    card.classList.add('matched');
    card.dataset.status = 'matched';
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
  const nyeheyyyVid = document.querySelector('.nyeheyyy-gif');
  nyeheyyyVid.currentTime = 0;
  nyeheyyyVid.play();
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