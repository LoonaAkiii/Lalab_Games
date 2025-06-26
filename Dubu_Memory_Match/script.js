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
function preloadImages() {
  cardImages.forEach(({ src }) => {
    const img = new Image();
    img.src = src.replace('.webm', '.png');
  });
}
function createCard(pair) {
  const card = document.createElement('div');
  card.classList.add('card');
  const placeholder = document.createElement('img');
  placeholder.src = pair.src.replace('.webm', '.png');
  placeholder.alt = 'card image';
  placeholder.loading = 'lazy';
  placeholder.style.width = '100%';
  placeholder.style.height = '100%';
  placeholder.style.objectFit = 'cover';
  card.appendChild(placeholder);
  card.dataset.match = pair.match;
  card.dataset.src = pair.src;
  card.dataset.status = 'unflipped';
  card.addEventListener('click', flipCard);
  return card;
}
function flipCard() {
  if (lockBoard || this === firstCard || this.dataset.status === 'matched') return;
  if (this.dataset.status === 'unflipped') {
    const video = document.createElement('video');
    video.src = this.dataset.src;
    video.loop = true;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    this.appendChild(video);
    video.play().catch(() => {});
    this.dataset.status = 'flipped';
    const oldImg = this.querySelector('img');
    if (oldImg) this.removeChild(oldImg);
  }
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
    disableCards();
  } else {
    unflipCards();
  }
}
function markAsMatched() {
  [firstCard, secondCard].forEach(card => {
    card.classList.add('matched');
    card.dataset.status = 'matched';
    replaceVideoWithSnapshot(card);
  });
}
function replaceVideoWithSnapshot(card) {
  const video = card.querySelector('video');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
  }
  const oldImg = card.querySelector('img');
  if (oldImg) oldImg.remove();
  const snapshot = document.createElement('img');
  snapshot.src = card.dataset.src.replace('.webm', '.png');
  snapshot.alt = 'Matched Snapshot';
  snapshot.style.width = '100%';
  snapshot.style.height = '100%';
  snapshot.style.objectFit = 'cover';
  card.appendChild(snapshot);
}
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  matches++;
  if (matches === cardImages.length / 2) {
    setTimeout(showWinDialog, 500);
  }
}
function unflipCards() {
  setTimeout(() => {
    [firstCard, secondCard].forEach(card => {
      card.classList.remove('flipped');
      card.dataset.status = 'unflipped';
      const video = card.querySelector('video');
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.remove();
      }
      const oldImg = card.querySelector('img');
      if (oldImg) oldImg.remove();
      const img = document.createElement('img');
      img.src = card.dataset.src.replace('.webm', '.png');
      img.alt = 'Card preview';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.loading = 'lazy';
      card.appendChild(img);
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
  const btn = document.getElementById('noButton');
  if (!btn.classList.contains('shrink')) {
    btn.classList.add('shrink');
  } else {
    btn.classList.add('hidden-button');
  }
}
document.getElementById('noButton').addEventListener('click', handleNoButtonClick);
document.getElementById('exitButtonFixed').addEventListener('click', () => {
  document.body.innerHTML = '';
  window.location.href = "../index.html";
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