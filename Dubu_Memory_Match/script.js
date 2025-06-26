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
  { src: 'work_dudu.webm', match: 'work_bubu.webm' },
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

function createCard(pair) {
  const card = document.createElement('div');
  card.classList.add('card');

  const video = document.createElement('video');
  video.src = pair.src;
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.classList.add('card-video');

  card.dataset.match = pair.match;
  card.appendChild(video);
  card.addEventListener('click', flipCard);
  return card;
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

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
  const firstCardMatch = firstCard.dataset.match;
  const secondCardSrc = secondCard.querySelector('video').src.split('/').pop();

  if (firstCardMatch === secondCardSrc) {
    markAsMatched();
    disableCards();
  } else {
    unflipCards();
  }
}

function markAsMatched() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
  matches += 1;
  if (matches === cardImages.length / 2) {
    setTimeout(() => showWinDialog(), 500);
  }
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function showWinDialog() {
  const winDialog = document.getElementById('winDialog');
  const yesButton = document.getElementById('yesButton');

  winDialog.classList.remove('hidden');

  yesButton.addEventListener('click', () => {
    winDialog.classList.add('hidden');
    document.getElementById('gameBoard').classList.add('hidden');
    document.querySelector('h1').classList.add('hidden');
    showDoubleNyeheyyy();
  });
}

function showDoubleNyeheyyy() {
  const section = document.getElementById('doubleNyeheyyySection');
  section.classList.remove('hidden');

  document.getElementById('letterButton').addEventListener('click', () => {
    const container = document.getElementById('letterFromDuduContainer');
    container.classList.remove('hidden');
    section.classList.add('hidden');
  });
}

function handleNoButtonClick() {
  const noButton = document.getElementById('noButton');
  if (!noButton.classList.contains('shrink')) {
    noButton.classList.add('shrink');
  } else {
    noButton.classList.add('hidden-button');
  }
}

document.getElementById('noButton').addEventListener('click', handleNoButtonClick);

function initGame() {
  shuffle(cardImages);
  const board = document.getElementById('gameBoard');
  cardImages.forEach(pair => {
    const card = createCard(pair);
    board.appendChild(card);
  });
}

initGame();