let level = 0;
let maxLevel = 10;
let timeLimit = 120;
let timerInterval;
let currentImage;
let buttonPosition = 0;
let giveUpClickCount = 0;
let usedImages = [];
const answers = {
  'Dbp/angry.mp4': ['angry', 'Angry', 'ANGRY'],
  'Dbp/happy.mp4': ['happy', 'Happy', 'HAPPY'],
  'Dbp/annoyed.mp4': ['annoyed', 'Annoyed', 'ANNOYED', 'annoying', 'Annoying', 'ANNOYING', 'tampororot', 'Tampororot'],
  'Dbp/boredom.mp4': ['boredom', 'Boredom', 'BOREDOM', 'bored', 'Bored', 'BORED'],
  'Dbp/confused.mp4': ['confused', 'Confused', 'CONFUSED'],
  'Dbp/craving.mp4': ['craving', 'Craving', 'CRAVING'],
  'Dbp/disgusted.mp4': ['disgusted', 'Disgusted', 'DISGUSTED', 'disgusting', 'Disgusting', 'DISGUSTING'],
  'Dbp/excited.mp4': ['excited', 'Excited', 'EXCITED'],
  'Dbp/horny.mp4': ['horny', 'Horny', 'HORNY'],
  'Dbp/hurt.mp4': ['hurt', 'Hurt', 'HURT', 'pain', 'Pain', 'PAIN'],
  'Dbp/insecure.mp4': ['insecured', 'Insecured', 'INSECURED', 'insecure', 'Insecure', 'INSECURE'],
  'Dbp/jealous.mp4': ['jealous', 'Jealous', 'JEALOUS', 'jealousy', 'Jealousy', 'JEALOUSY', 'jealoused', 'Jealoused'],
  'Dbp/love.mp4': ['love', 'Love', 'LOVED', 'LOVE'],
  'Dbp/playful.mp4': ['playful', 'Playful', 'PLAYFUL'],
  'Dbp/proud.mp4': ['proud', 'Proud', 'PROUD'],
  'Dbp/romantic.mp4': ['romantic', 'Romantic', 'ROMANTIC'],
  'Dbp/sad.mp4': ['sad', 'Sad', 'SAD', 'crying', 'Crying', 'CRYING', 'cried', 'Cried'],
  'Dbp/scared.mp4': ['scared', 'Scared', 'SCARED'],
  'Dbp/shocked.mp4': ['shocked', 'Shocked', 'SHOCKED'],
  'Dbp/shy.mp4': ['shy', 'Shy', 'SHY']
};
function getRandomImage() {
  const images = Object.keys(answers);
  const remainingImages = images.filter(img => !usedImages.includes(img));
  if (remainingImages.length === 0) {
    usedImages = [];
    return images[Math.floor(Math.random() * images.length)];
  }
  const randomImage = remainingImages[Math.floor(Math.random() * remainingImages.length)];
  usedImages.push(randomImage);
  return randomImage;
}
function displayNewImage() {
  currentImage = getRandomImage();
  const video = document.getElementById('random-image');
  if (currentImage) {
    video.src = currentImage;
    video.loop = true;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.load();
    video.onloadeddata = () => {
      video.play().catch(err => console.warn("Autoplay failed:", err));
    };
  }
}
function updateLevel() {
  level++;
  if (level > maxLevel) level = maxLevel;
  document.getElementById("level-count").textContent = level;
  if (level === 10) showLevel10Screen();
}
function resetLevel() {
  level = 0;
  document.getElementById("level-count").textContent = level;
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
function stopTimer() {
  clearInterval(timerInterval);
}
function gameOver() {
  stopTimer();
  resetLevel();
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
  const msg = document.getElementById('message');
  msg.textContent = '';
  msg.classList.remove('incorrect');
  msg.style.display = 'block';
  clearInterval(timerInterval);
  ['custom-image', 'custom-note', 'go-back-button'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  const giveUpBtn = document.getElementById("new-image");
  giveUpClickCount = 0;
  giveUpBtn.style.transform = 'scale(1)';
  displayNewImage();
}
function checkGuess() {
  const guess = document.getElementById("guess-input").value.trim();
  const msg = document.getElementById("message");
  if (answers[currentImage].includes(guess)) {
    updateLevel();
    displayNewImage();
    document.getElementById("guess-input").value = '';
    msg.textContent = 'Correct!';
    msg.classList.remove('incorrect');
  } else {
    msg.textContent = 'Try again!';
    msg.classList.add('incorrect');
  }
  msg.style.display = 'block';
}
function handleKeyPress(e) {
  if (e.key === 'Enter') checkGuess();
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
  const width = container.clientWidth;
  const btnWidth = button.offsetWidth;
  const center = (width - btnWidth) / 2;
  const distance = width / 2 - btnWidth / 2;
  buttonPosition = buttonPosition === 0 ? -1 : (buttonPosition === -1 ? 1 : 0);
  let newLeft = center + (buttonPosition * distance);
  newLeft = Math.max(0, Math.min(width - btnWidth, newLeft));
  button.style.left = `${newLeft}px`;
}
function handleGiveUpClick() {
  giveUpClickCount++;
  const btn = document.getElementById('new-image');
  btn.style.transform = `scale(${1 - giveUpClickCount * 0.2})`;
  if (giveUpClickCount === 3) {
    stopTimer();
    resetLevel();
    ['level-timer-container', 'random-image', 'guess-input', 'submit-guess', 'new-image', 'message'].forEach(id => {
      document.getElementById(id).style.display = "none";
    });
    const video = document.createElement('video');
    video.src = 'Dbp/giveup.mp4';
    video.id = 'custom-image';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.style.maxWidth = '100%';
    const note = document.createElement('p');
    note.textContent = 'Bubu says: Don\'t give up so easily!';
    note.id = 'custom-note';
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Go Back';
    backBtn.id = 'go-back-button';
    const container = document.querySelector('.game-container');
    container.appendChild(video);
    container.appendChild(note);
    container.appendChild(backBtn);
    backBtn.addEventListener('click', () => {
      video.remove();
      note.remove();
      backBtn.remove();
      btn.style.transform = 'scale(1)';
      giveUpClickCount = 0;
      document.getElementById("intro-image").style.display = "block";
      document.getElementById("start-game").style.display = "block";
      document.getElementById("dont-save").style.display = "block";
      const msg = document.getElementById('message');
      msg.textContent = '';
      msg.classList.remove('incorrect');
      msg.style.display = 'block';
      document.querySelector('h1').style.display = 'block';
      document.querySelector('.note').style.display = 'block';
    });
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
  const msg = document.getElementById('message');
  msg.textContent = '';
  msg.classList.remove('incorrect');
  msg.style.display = 'block';
  const giveUpBtn = document.getElementById("new-image");
  giveUpClickCount = 0;
  giveUpBtn.style.transform = 'scale(1)';
  displayNewImage();
}
document.getElementById("start-game").addEventListener('click', showGameElements);
document.getElementById("submit-guess").addEventListener('click', checkGuess);
document.getElementById("new-image").addEventListener('click', handleGiveUpClick);
document.getElementById("dont-save").addEventListener('mouseover', moveDontSaveButton);
document.getElementById("time-travel-back").addEventListener('click', resetGame);
document.getElementById("play-again").addEventListener('click', resetToMainScreen);
document.getElementById("guess-input").addEventListener('keydown', handleKeyPress);
document.getElementById("exit-game").addEventListener('click', () => {
  window.location.href = "../index.html";
});