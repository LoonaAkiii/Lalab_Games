document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const hasConfirmed = localStorage.getItem('musicConfirmed');
  const tryPlayMusic = () => {
    if (music.paused) {
      music.play().catch(() => {});
    }
  };
  if (hasConfirmed) {
    tryPlayMusic();
  } else {
    const enableMusic = () => {
      music.play().then(() => {
        localStorage.setItem('musicConfirmed', 'yes');
      }).catch(() => {});
      window.removeEventListener('click', enableMusic);
      window.removeEventListener('touchstart', enableMusic);
      window.removeEventListener('scroll', enableMusic);
    };
    window.addEventListener('click', enableMusic, { once: true });
    window.addEventListener('touchstart', enableMusic, { once: true });
    window.addEventListener('scroll', enableMusic, { once: true });
  }
  const retryOnUserAction = () => {
    tryPlayMusic();
  };
  window.addEventListener('click', retryOnUserAction);
  window.addEventListener('touchstart', retryOnUserAction);
  window.addEventListener('scroll', retryOnUserAction);
});