const digits = [0, 0, 0, 0];
const correctCode = '0313';
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
function changeDigit(index, delta) {
  digits[index] = (digits[index] + delta + 10) % 10;
  document.getElementById(`digit-${index}`).textContent = digits[index];
  checkCode();
}
function checkCode() {
  const entered = digits.join('');
  if (entered === correctCode) {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('letterScreen').style.display = 'block';
    resizeCanvas();
  }
}
function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function scratch(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}
function lockAgain() {
  document.getElementById('letterScreen').style.display = 'none';
  document.getElementById('lockScreen').style.display = 'flex';
  digits.fill(0);
  for (let i = 0; i < 4; i++) {
    document.getElementById(`digit-${i}`).textContent = '0';
  }
}
function exitGame() {
  window.location.href = "../index.html";
}
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());
document.body.onmousedown = e => e.preventDefault();
canvas.addEventListener('mousedown', () => canvas.addEventListener('mousemove', scratch));
canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', scratch));
canvas.addEventListener('touchstart', scratch, { passive: false });
canvas.addEventListener('touchmove', scratch, { passive: false });
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);