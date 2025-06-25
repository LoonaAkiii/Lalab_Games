const cardImages = [
    { src: 'air_bubu.gif', match: 'air_dudu.gif' },
    { src: 'air_dudu.gif', match: 'air_bubu.gif' },
    { src: 'angry_bubu.gif', match: 'angry_dudu.gif' },
    { src: 'angry_dudu.gif', match: 'angry_bubu.gif' },
    { src: 'baby_bubu.gif', match: 'baby_dudu.gif' },
    { src: 'baby_dudu.gif', match: 'baby_bubu.gif' },
    { src: 'duck_bubu.gif', match: 'duck_dudu.gif' },
    { src: 'duck_dudu.gif', match: 'duck_bubu.gif' },
    { src: 'eat_bubu.gif', match: 'eat_dudu.gif' },
    { src: 'eat_dudu.gif', match: 'eat_bubu.gif' },
    { src: 'happy_bubu.gif', match: 'happy_dudu.gif' },
    { src: 'happy_dudu.gif', match: 'happy_bubu.gif' },
    { src: 'icecream_bubu.gif', match: 'icecream_dudu.gif' },
    { src: 'icecream_dudu.gif', match: 'icecream_bubu.gif' },
    { src: 'work_bubu.gif', match: 'work_dudu.gif' },
    { src: 'work_dudu.gif', match: 'work_bubu.gif' },
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
    const img = document.createElement('img');
    img.src = pair.src;
    card.dataset.match = pair.match;
    card.appendChild(img);
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
    const secondCardSrc = secondCard.querySelector('img').src.split('/').pop();

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
        document.getElementById('gameBoard').classList.add('hidden'); // Hide the game board
        document.querySelector('h1').classList.add('hidden'); // Hide the h1 heading
        showDoubleNyeheyyy(); // Show the "DOUBLE NYEHEYYY!!" section when "YES!" is clicked
    });
}

function showDoubleNyeheyyy() {
    const doubleNyeheyyySection = document.getElementById('doubleNyeheyyySection');
    doubleNyeheyyySection.classList.remove('hidden');

    // Add behavior for the "LETTER FROM DUDU" button
    document.getElementById('letterButton').addEventListener('click', () => {
        const letterFromDuduContainer = document.getElementById('letterFromDuduContainer');
        letterFromDuduContainer.classList.remove('hidden'); // Show the image when button is clicked

        // Hide the "DOUBLE NYEHEYYY!!" section after clicking "LETTER FROM DUDU" button
        doubleNyeheyyySection.classList.add('hidden');
    });
}

function resetGame() {
    location.reload(); // Simple approach: reload the page
}

function initGame() {
    shuffle(cardImages);
    const gameBoard = document.getElementById('gameBoard');
    cardImages.forEach(pair => {
        const card = createCard(pair);
        gameBoard.appendChild(card);
    });
}

initGame();

function handleNoButtonClick() {
    const noButton = document.getElementById('noButton');

    if (!noButton.classList.contains('shrink')) {
        // First click: Shrink the button
        noButton.classList.add('shrink');
    } else {
        // Second click: Make the button disappear
        noButton.classList.add('hidden-button');
    }
}

document.getElementById('noButton').addEventListener('click', handleNoButtonClick);
