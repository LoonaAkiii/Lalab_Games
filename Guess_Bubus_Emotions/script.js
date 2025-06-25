let level = 0;
let maxLevel = 10;
let timeLimit = 120; // 120 seconds = 2 minutes
let timerInterval;
let currentImage;
let buttonPosition = 0; // 0 for center, -1 for left, 1 for right
let giveUpClickCount = 0; // Track clicks on the "Give Up" button
let usedImages = []; // To track images already used

// Define acceptable answers for each image
const answers = {
    'Dbp/angry.gif': ['angry', 'Angry', 'ANGRY'],
    'Dbp/happy.gif': ['happy', 'Happy', 'HAPPY'],
    'Dbp/annoyed.gif': ['annoyed', 'Annoyed', 'ANNOYED', 'annoying', 'Annoying', 'ANNOYING', 'tampororot', 'Tampororot'],
    'Dbp/boredom.gif': ['boredom', 'Boredom', 'BOREDOM', 'bored', 'Bored', 'BORED'],
    'Dbp/confused.gif': ['confused', 'Confused', 'CONFUSED'],
    'Dbp/craving.gif': ['craving', 'Craving', 'CRAVING'],
    'Dbp/disgusted.gif': ['disgusted', 'Disgusted', 'DISGUSTED', 'disgusting', 'Disgusting', 'DISGUSTING'],
    'Dbp/excited.gif': ['excited', 'Excited', 'EXCITED'],
    'Dbp/horny.gif': ['horny', 'Horny', 'HORNY'],
    'Dbp/hurt.gif': ['hurt', 'Hurt', 'HURT', 'pain', 'Pain', 'PAIN'],
    'Dbp/insecure.gif': ['insecured', 'Insecured', 'INSECURED', 'insecure', 'Insecure', 'INSECURE'],
    'Dbp/jealous.gif': ['jealous', 'Jealous', 'JEALOUS', 'jealousy', 'Jealousy', 'JEALOUSY', 'jealoused', 'Jealoused'],
    'Dbp/love.gif': ['love', 'Love', 'LOVED', 'love', 'Love', 'LOVE'],
    'Dbp/playful.gif': ['playful', 'Playful', 'PLAYFUL'],
    'Dbp/proud.gif': ['proud', 'Proud', 'PROUD'],
    'Dbp/romantic.gif': ['romantic', 'Romantic', 'ROMANTIC'],
    'Dbp/sad.gif': ['sad', 'Sad', 'SAD', 'crying', 'Crying', 'CRYING', 'cried', 'Cried'],
    'Dbp/scared.gif': ['scared', 'Scared', 'SCARED'],
    'Dbp/shocked.gif': ['shocked', 'Shocked', 'SHOCKED'],
    'Dbp/shy.gif': ['shy', 'Shy', 'SHY']
};

function getRandomImage() {
    const images = Object.keys(answers);
    const remainingImages = images.filter(img => !usedImages.includes(img));

    if (remainingImages.length === 0) {
        usedImages = [];
        return images[Math.floor(Math.random() * images.length)]; // Random image from all
    }

    const randomImage = remainingImages[Math.floor(Math.random() * remainingImages.length)];
    usedImages.push(randomImage);
    return randomImage;
}

function displayNewImage() {
    currentImage = getRandomImage();
    if (currentImage) {
        document.getElementById('random-image').src = currentImage;
    } else {
        console.error('No image available to display.');
    }
}

function updateLevel() {
    level++;
    if (level > maxLevel) {
        level = maxLevel;
    }
    document.getElementById("level-count").textContent = level;
}

function resetLevel() {
    level = 0;
    document.getElementById("level-count").textContent = level;
}

function startTimer() {
    let timeRemaining = timeLimit;
    document.getElementById("timer").textContent = formatTime(timeRemaining);
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = formatTime(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function gameOver() {
    stopTimer();

    document.getElementById("level-timer-container").style.display = "none";
    document.getElementById("random-image").style.display = "none";
    document.getElementById("guess-input").style.display = "none";
    document.getElementById("submit-guess").style.display = "none";
    document.getElementById("new-image").style.display = "none";
    document.getElementById("message").style.display = "none";

    document.getElementById("game-over").style.display = "block";
}

function resetGame() {
    resetLevel();
    
    document.getElementById("game-over").style.display = "none";
    
    document.getElementById("intro-image").style.display = "block";
    document.getElementById("start-game").style.display = "block";
    document.getElementById("dont-save").style.display = "block";
    
    document.querySelector('h1').style.display = 'block';
    document.querySelector('.note').style.display = 'block';

    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
    messageElement.classList.remove('incorrect');
    messageElement.style.display = 'block';

    clearInterval(timerInterval);

    const customImage = document.getElementById('custom-image');
    if (customImage) customImage.remove();
    const customNote = document.getElementById('custom-note');
    if (customNote) customNote.remove();
    const goBackButton = document.getElementById('go-back-button');
    if (goBackButton) goBackButton.remove();

    displayNewImage();
}

function checkGuess() {
    const userGuess = document.getElementById("guess-input").value.trim();
    const messageElement = document.getElementById("message");

    if (answers[currentImage].includes(userGuess)) {
        updateLevel();
        displayNewImage();
        document.getElementById("guess-input").value = '';
        messageElement.textContent = 'Correct!';
        messageElement.classList.remove('incorrect');
        messageElement.style.display = 'block';
    } else {
        messageElement.textContent = 'Try again!';
        messageElement.classList.add('incorrect');
        messageElement.style.display = 'block';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
}

function showGameElements() {
    document.querySelector('h1').style.display = 'none';
    document.querySelector('.note').style.display = 'none';

    document.getElementById("level-timer-container").style.display = "block";
    document.getElementById("random-image").style.display = "block";
    document.getElementById("guess-input").style.display = "block";
    document.getElementById("submit-guess").style.display = "block";
    document.getElementById("new-image").style.display = "block";
    document.getElementById("intro-image").style.display = "none";

    document.getElementById("start-game").style.display = "none";
    document.getElementById("dont-save").style.display = "none";

    document.getElementById("guess-input").focus();

    startTimer();

    displayNewImage();
}


function moveDontSaveButton() {
    const button = document.getElementById('dont-save');
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const buttonWidth = button.offsetWidth;

    const buttonCenter = (containerWidth - buttonWidth) / 2;
    const moveDistance = containerWidth / 2 - buttonWidth / 2; // Dynamic distance to move left or right

    if (buttonPosition === 0) { 
        buttonPosition = -1;
    } else if (buttonPosition === -1) { 
        buttonPosition = 1;
    } else { 
        buttonPosition = 0;
    }

    let newLeft;
    if (buttonPosition === -1) {
        newLeft = buttonCenter - moveDistance;
    } else if (buttonPosition === 1) {
        newLeft = buttonCenter + moveDistance;
    } else {
        newLeft = buttonCenter;
    }

    newLeft = Math.max(0, Math.min(containerWidth - buttonWidth, newLeft));

    button.style.left = `${newLeft}px`;
}

function handleGiveUpClick() {
    giveUpClickCount++;
    const giveUpButton = document.getElementById('new-image');

    giveUpButton.style.transform = `scale(${1 - giveUpClickCount * 0.2})`;

    if (giveUpClickCount === 3) {
        stopTimer();

        document.getElementById("level-timer-container").style.display = "none";
        document.getElementById("random-image").style.display = "none";
        document.getElementById("guess-input").style.display = "none";
        document.getElementById("submit-guess").style.display = "none";
        document.getElementById("new-image").style.display = "none";
        document.getElementById("message").style.display = "none";


        const customImage = document.createElement('img');
        customImage.src = 'Dbp/giveup.gif';
        customImage.alt = 'Custom Image';
        customImage.id = 'custom-image';

        const customNote = document.createElement('p');
        customNote.textContent = 'Bubu says: Don\'t give up so easily!';
        customNote.id = 'custom-note';

        const goBackButton = document.createElement('button');
        goBackButton.textContent = 'Go Back';
        goBackButton.id = 'go-back-button';

        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(customImage);
        gameContainer.appendChild(customNote);
        gameContainer.appendChild(goBackButton);

        goBackButton.addEventListener('click', () => {
            customImage.remove();
            customNote.remove();
            goBackButton.remove();
        
            giveUpButton.style.transform = 'scale(1)';
            giveUpClickCount = 0;
        
            document.getElementById("intro-image").style.display = "block";
            document.getElementById("start-game").style.display = "block";
            document.getElementById("dont-save").style.display = "block";
        
            const messageElement = document.getElementById('message');
            messageElement.textContent = '';
            messageElement.classList.remove('incorrect');
            messageElement.style.display = 'block';
        
            document.querySelector('h1').style.display = 'block';
            document.querySelector('.note').style.display = 'block';
        });
    }
}

function updateLevel() {
    level++;
    if (level > maxLevel) {
        level = maxLevel;
    }
    document.getElementById("level-count").textContent = level;

    if (level === 10) {
        showLevel10Screen();
    }
}

function showLevel10Screen() {
    stopTimer();

    document.getElementById("level-timer-container").style.display = "none";
    document.getElementById("random-image").style.display = "none";
    document.getElementById("guess-input").style.display = "none";
    document.getElementById("submit-guess").style.display = "none";
    document.getElementById("new-image").style.display = "none";
    document.getElementById("message").style.display = "none";

    document.getElementById("level-10-screen").style.display = "block";
}

function resetToMainScreen() {
    resetLevel();
    
    document.getElementById("level-10-screen").style.display = "none";

    document.getElementById("intro-image").style.display = "block";
    document.getElementById("start-game").style.display = "block";
    document.getElementById("dont-save").style.display = "block";

    document.querySelector('h1').style.display = 'block';
    document.querySelector('.note').style.display = 'block';

    document.getElementById("timer").textContent = formatTime(timeLimit);
    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
    messageElement.classList.remove('incorrect');
    messageElement.style.display = 'block';

    displayNewImage();
}

document.getElementById("start-game").addEventListener('click', showGameElements);
document.getElementById("submit-guess").addEventListener('click', checkGuess);
document.getElementById("new-image").addEventListener('click', handleGiveUpClick);
document.getElementById("dont-save").addEventListener('mouseover', moveDontSaveButton);
document.getElementById("time-travel-back").addEventListener('click', resetGame);
document.getElementById("play-again").addEventListener('click', resetToMainScreen);

document.getElementById("guess-input").addEventListener('keydown', handleKeyPress);