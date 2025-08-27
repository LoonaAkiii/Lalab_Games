const $ = id => document.getElementById(id);
const $$ = sel => document.querySelector(sel);
const setStyles = (el, styles) => Object.assign(el.style, styles);
const [
  exitBtn, music, loadingScreen, progressFill, progressIcon
] = [
  'exit-btn','bg-music','loading-screen','progress-fill','progress-icon'
].map($);
const tapText = $$('.tap-text');
const progressWrapper = $$('.progress-wrapper');
function preventScroll(e) { e.preventDefault(); }
function disableScroll() { document.addEventListener('touchmove', preventScroll, { passive: false }); }
function enableScroll() { document.removeEventListener('touchmove', preventScroll, { passive: false }); }
if (exitBtn) {
  exitBtn.addEventListener('click', () => {
    enableScroll();
    sessionStorage.removeItem('photobooth');
    location.href = "../index.html";
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const alreadyLoaded = sessionStorage.getItem('maze');
  const tryPlayMusic = () => music && music.paused && music.play().catch(()=>{});
  const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const animateProgress = () => {
    if (!progressIcon || !progressWrapper) return;
    const iconWidth = progressIcon.offsetWidth;
    const barWidth = progressWrapper.clientWidth;
    const maxLeft = barWidth - iconWidth + 22;
    const duration = 3000;
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeInOutSine(t);
      progressIcon.style.left = maxLeft * eased + 'px';
      progressFill.style.width = ((maxLeft * eased + iconWidth / 2) / barWidth * 100) + '%';
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        progressFill.style.width = '100%';
        progressIcon.style.left = maxLeft + 'px';
        setTimeout(() => {
          if (tapText) tapText.classList.add('show');
          setTimeout(() => {
            if (tapText) tapText.classList.add('loop');
            enableTap();
          }, 800);
        }, 300);
      }
    };
    requestAnimationFrame(step);
  };
  function enableTap() {
    const handler = e => {
      e.preventDefault();
      e.stopPropagation();
      if (loadingScreen) loadingScreen.classList.add('exit');
      setTimeout(() => {
        if (loadingScreen) loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('maze', 'true');
        tryPlayMusic();
        localStorage.setItem('musicConfirmed', 'yes');
        if (exitBtn) exitBtn.classList.remove('hidden');
        disableScroll();
        launchGame();
      }, 600);
      ['click','touchstart'].forEach(evt => window.removeEventListener(evt, handler, { passive: false }));
    };
    ['click','touchstart'].forEach(evt => window.addEventListener(evt, handler, { passive: false }));
  }
  if (!alreadyLoaded && loadingScreen && tapText) {
    document.body.style.overflow = 'hidden';
    progressIcon.style.opacity = '1';
    animateProgress();
  } else {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (exitBtn) exitBtn.classList.remove('hidden');
    disableScroll();
    const enableMusic = () => {
      tryPlayMusic();
      localStorage.setItem('musicConfirmed', 'yes');
      ['click','touchstart'].forEach(evt => window.removeEventListener(evt, enableMusic));
    };
    if (!hasConfirmed) {
      ['click','touchstart'].forEach(evt => window.addEventListener(evt, enableMusic, { once:true }));
    } else {
      tryPlayMusic();
    }
    launchGame();
  }
});
let canvas, ctx;
let rows, cols, cellSize;
let maze = [];
let player, goal;
let zoomFactor = 5;
function generateMaze() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));
  function carve(x, y) {
    const dirs = [
      [0, -2], [0, 2],
      [-2, 0], [2, 0]
    ].sort(() => Math.random() - 0.5);
    for (let [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < cols && ny > 0 && ny < rows && maze[ny][nx] === 1) {
        maze[ny][nx] = 0;
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }
  maze[1][1] = 0;
  carve(1, 1);
  player = { x: 1, y: 1 };
  let gx, gy, dist;
  do {
    gx = Math.floor(Math.random() * (cols - 2)) + 1;
    gy = Math.floor(Math.random() * (rows - 2)) + 1;
    dist = Math.abs(gx - player.x) + Math.abs(gy - player.y);
  } while (maze[gy][gx] !== 0 || dist < Math.floor(rows / 2));
  goal = { x: gx, y: gy };
}
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let camX = player.x - canvas.width / (cellSize * zoomFactor * 2);
  let camY = player.y - canvas.height / (cellSize * zoomFactor * 2);
  camX = Math.max(0, Math.min(cols - canvas.width / (cellSize * zoomFactor), camX));
  camY = Math.max(0, Math.min(rows - canvas.height / (cellSize * zoomFactor), camY));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "#a20060";
        ctx.fillRect(
          (x - camX) * cellSize * zoomFactor,
          (y - camY) * cellSize * zoomFactor,
          cellSize * zoomFactor,
          cellSize * zoomFactor
        );
      }
    }
  }
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(
    (goal.x - camX) * cellSize * zoomFactor,
    (goal.y - camY) * cellSize * zoomFactor,
    cellSize * zoomFactor,
    cellSize * zoomFactor
  );
  ctx.fillStyle = "#ff66a3";
  ctx.fillRect(
    (player.x - camX) * cellSize * zoomFactor,
    (player.y - camY) * cellSize * zoomFactor,
    cellSize * zoomFactor,
    cellSize * zoomFactor
  );
}
function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    drawMaze();
    if (player.x === goal.x && player.y === goal.y) {
      setTimeout(() => alert("🎉 You reached the goal!"), 100);
    }
  }
}
function startMaze() {
  canvas = document.getElementById("mazeCanvas");
  ctx = canvas.getContext("2d");
  if (window.innerWidth < 600) {
    rows = cols = 25;
    cellSize = 10;
    canvas.width = 300;
    canvas.height = 300;
  } else {
    rows = cols = 35;
    cellSize = 12;
    canvas.width = 400;
    canvas.height = 400;
  }
  canvas.style.display = "block";
  generateMaze();
  drawMaze();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});
function launchGame() {
  startMaze();
}
document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-btn");
  const introScreen = document.getElementById("intro-screen");
  if (playBtn && introScreen) {
    playBtn.addEventListener("click", () => {
      introScreen.style.display = "none";
      launchGame();
    });
  }
});