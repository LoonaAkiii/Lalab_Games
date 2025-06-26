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
  video.setAttribute('src', pair.src);
  video.setAttribute('preload', 'none');
  video.loop = true;
  video.autoplay = false;
  video.muted = true;
  video.playsInline = true;
  video.classList.add('card-video');
  card.dataset.match = pair.match;
  card.dataset.src = pair.src;
  card.appendChild(video);
  card.addEventListener('click', flipCard);
  return card;
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add('flipped');
  const video = this.querySelector('video');
  video.play().catch(() => {});
  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;
    checkForMatch();
  }
}

function checkForMatch() {
  const firstMatch = firstCard.dataset.match;
  const secondSrc = secondCard.dataset.src;
  if (firstMatch === secondSrc) {
    markAsMatched();
    disableCards();
  } else {
    unflipCards();
  }
}

function markAsMatched() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  replaceVideoWithSnapshot(firstCard);
  replaceVideoWithSnapshot(secondCard);
}

function replaceVideoWithSnapshot(card) {
  const video = card.querySelector('video');
  if (video) {
    const videoSrc = video.getAttribute('src');
    const img = document.createElement('img');
    img.src = videoSrc.replace('.webm', '.png');
    img.alt = 'Matched Snapshot';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    video.pause();
    video.remove();
    card.appendChild(img);
  }
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
    firstCard.querySelector('video').pause();
    secondCard.querySelector('video').pause();
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
  });
}

function showDoubleNyeheyyy() {
  document.getElementById('doubleNyeheyyySection').classList.remove('hidden');
  document.getElementById('letterButton').addEventListener('click', () => {
    document.getElementById('letterFromDuduContainer').classList.remove('hidden');
    document.getElementById('doubleNyeheyyySection').classList.add('hidden');
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

document.getElementById('exitButtonFixed').addEventListener('click', () => {
  window.location.href = "../index.html";
});

function initGame() {
  shuffle(cardImages);
  const board = document.getElementById('gameBoard');
  cardImages.forEach(pair => {
    const card = createCard(pair);
    board.appendChild(card);
  });
}

initGame();