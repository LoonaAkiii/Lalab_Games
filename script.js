document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bg-music');
  const loadingScreen = document.createElement('div');
  const icon = document.createElement('span');
  const tapText = document.createElement('div');
  loadingScreen.id = 'loading-screen';
  loadingScreen.style.position = 'fixed';
  loadingScreen.style.top = '0';
  loadingScreen.style.left = '0';
  loadingScreen.style.width = '100vw';
  loadingScreen.style.height = '100vh';
  loadingScreen.style.background = 'linear-gradient(to bottom right, #ffe6f0, #ffd6ec)';
  loadingScreen.style.display = 'flex';
  loadingScreen.style.flexDirection = 'column';
  loadingScreen.style.alignItems = 'center';
  loadingScreen.style.justifyContent = 'center';
  loadingScreen.style.zIndex = '9999';
  icon.className = 'material-symbols-outlined';
  icon.textContent = 'joystick';
  icon.style.fontSize = '64px';
  icon.style.color = '#a20060';
  icon.style.animation = 'bounceClick 1.2s infinite ease-in-out';
  tapText.className = 'tap-text';
  tapText.textContent = 'Touch to continue...';
  tapText.style.color = '#a20060';
  tapText.style.fontSize = '1.2rem';
  tapText.style.marginTop = '1rem';
  tapText.style.display = 'none';
  loadingScreen.appendChild(icon);
  loadingScreen.appendChild(tapText);
  document.body.appendChild(loadingScreen);
  document.body.style.overflow = 'hidden';
  function tryPlayMusic() {
    if (music && music.paused) {
      music.play().catch(() => {});
    }
  }
  setTimeout(() => {
    tapText.style.display = 'block';
    const handleFirstTap = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setTimeout(() => {
        loadingScreen.remove();
        document.body.style.overflow = '';
        const hasConfirmed = localStorage.getItem('musicConfirmed');
        if (!hasConfirmed) {
          music.play().then(() => {
            localStorage.setItem('musicConfirmed', 'yes');
          }).catch(() => {});
        } else {
          tryPlayMusic();
        }
        const tryResumeMusic = () => {
          tryPlayMusic();
        };
        window.addEventListener('click', tryResumeMusic);
        window.addEventListener('touchstart', tryResumeMusic);
        window.addEventListener('scroll', tryResumeMusic);
      }, 50);
      window.removeEventListener('click', handleFirstTap);
      window.removeEventListener('touchstart', handleFirstTap);
    };
    window.addEventListener('click', handleFirstTap, { passive: false });
    window.addEventListener('touchstart', handleFirstTap, { passive: false });
  }, 3000);
  const updateButton = document.getElementById('force-update');
  if (updateButton) {
    updateButton.addEventListener('click', async () => {
      updateButton.classList.add('bounce');
      setTimeout(() => updateButton.classList.remove('bounce'), 200);
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) await reg.unregister();
        const cacheNames = await caches.keys();
        for (const name of cacheNames) await caches.delete(name);
        window.location.reload(true);
      }
    });
  }
});