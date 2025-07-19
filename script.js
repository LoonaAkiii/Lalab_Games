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
const updateButton = document.getElementById('force-update');
if (updateButton) {
  updateButton.addEventListener('click', async () => {
    updateButton.classList.add('bounce');
    setTimeout(() => updateButton.classList.remove('bounce'), 200);
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
      window.location.reload(true);
    }
  });
}