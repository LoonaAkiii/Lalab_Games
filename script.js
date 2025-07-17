document.addEventListener('DOMContentLoaded', () => {
  const prompt = document.getElementById('music-prompt');
  const yesBtn = document.getElementById('music-yes');
  const music = document.getElementById('bg-music');
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  if (hasConfirmed) {
    prompt.style.display = 'none';
    music.play().catch(() => {});
  }
  yesBtn.addEventListener('click', () => {
    music.play().then(() => {
      localStorage.setItem('musicConfirmed', 'yes');
      prompt.style.display = 'none';
    }).catch(() => {
      alert('Audio play failed. Please tap anywhere to retry.');
    });
  });
  document.body.addEventListener('touchstart', () => {
    music.play().catch(() => {});
  }, { once: true });
});
