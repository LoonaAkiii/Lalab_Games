const $ = id => document.getElementById(id);
const $$ = sel => document.querySelector(sel);
const setStyles = (el, styles) => Object.assign(el.style, styles);
const [
  exitBtn, music, loadingScreen, progressFill, progressIcon, tapOverlay,
  screenContainer, avatarImg, nextBtn, selectorUI, firstTap, secondTap,
  claimScreen, backFromScreenBtn, backFromClaimBtn, printBtn
] = [
  'exit-btn','bg-music','loading-screen','progress-fill','progress-icon','tap-overlay',
  'screen-container','avatar-img','next-btn','selector-ui','first-tap','second-tap',
  'claim-screen','back-from-screen','back-from-claim','print-btn'
].map($);
const tapText = $$('.tap-text'), progressWrapper = $$('.progress-wrapper');
let currentAvatar = 0, selectedAvatar = '';
const avatars = ['img/Haru.png','img/Cheeze.png','img/LifeFourCuts.png','img/LifeFourCuts2.png'];
function preventScroll(e) { e.preventDefault(); }
function disableScroll() {
  document.addEventListener('touchmove', preventScroll, { passive: false });
}
function enableScroll() {
  document.removeEventListener('touchmove', preventScroll, { passive: false });
}
exitBtn.addEventListener('click', () => {
  enableScroll();
  sessionStorage.removeItem('photobooth');
  location.href = "../index.html";
});
document.addEventListener('DOMContentLoaded', () => {
  const hasConfirmed = localStorage.getItem('musicConfirmed'),
        alreadyLoaded = sessionStorage.getItem('photobooth'),
        tryPlayMusic = () => music?.paused && music.play().catch(()=>{}),
        easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  const animateProgress = () => {
    const iconWidth = progressIcon.offsetWidth, barWidth = progressWrapper.clientWidth,
          maxLeft = barWidth - iconWidth + 22, duration = 3000, start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / duration, 1), eased = easeInOutSine(t);
      progressIcon.style.left = maxLeft * eased + 'px';
      progressFill.style.width = ((maxLeft * eased + iconWidth / 2) / barWidth * 100) + '%';
      t < 1 ? requestAnimationFrame(step) : (() => {
        progressFill.style.width = '100%';
        progressIcon.style.left = maxLeft + 'px';
        setTimeout(() => {
          tapText.classList.add('show');
          setTimeout(() => {
            tapText.classList.add('loop');
            enableTap();
          }, 800);
        }, 300);
      })();
    };
    requestAnimationFrame(step);
  };
  const enableTap = () => {
    const handler = e => {
      e.preventDefault(); e.stopPropagation();
      loadingScreen.classList.add('exit');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('photobooth', 'true');
        tryPlayMusic();
        localStorage.setItem('musicConfirmed', 'yes');
        exitBtn.classList.remove('hidden');
        disableScroll();
      }, 600);
      ['click','touchstart'].forEach(evt => window.removeEventListener(evt, handler, {passive:false}));
    };
    ['click','touchstart'].forEach(evt => window.addEventListener(evt, handler, {passive:false}));
  };
  if (!alreadyLoaded && loadingScreen && tapText) {
    document.body.style.overflow = 'hidden';
    progressIcon.style.opacity = '1';
    animateProgress();
  } else {
    loadingScreen && (loadingScreen.style.display = 'none');
    exitBtn.classList.remove('hidden');
    disableScroll();
    const enableMusic = () => {
      tryPlayMusic();
      localStorage.setItem('musicConfirmed', 'yes');
      ['click','touchstart'].forEach(evt => window.removeEventListener(evt, enableMusic));
    };
    !hasConfirmed
      ? ['click','touchstart'].forEach(evt => window.addEventListener(evt, enableMusic, {once:true}))
      : tryPlayMusic();
  }
});
tapOverlay.addEventListener('click', e => {
  if (e.target.id !== 'first-tap') return;
  tapOverlay.style.display = 'none';
  $('photobooth').style.display = 'none';
  screenContainer.classList.remove('hidden');
  selectorUI.style.display = 'flex';
});
avatarImg.addEventListener('click', () => avatarImg.classList.toggle('selected'));
nextBtn.addEventListener('click', () => {
  avatarImg.classList.replace('anim-in','anim-out');
  setTimeout(() => {
    currentAvatar = (currentAvatar + 1) % avatars.length;
    avatarImg.src = avatars[currentAvatar];
    avatarImg.classList.remove('selected','anim-out');
    avatarImg.classList.add('anim-in');
  }, 300);
});
backFromScreenBtn.addEventListener('click', () => {
  screenContainer.classList.add('hidden');
  $('photobooth').style.display = 'block';
  tapOverlay.style.display = 'block';
});
backFromClaimBtn.addEventListener('click', () => {
  claimScreen.style.display = 'none';
  $('photobooth').style.display = 'block';
  tapOverlay.style.display = 'block';
});
printBtn.addEventListener('click', () => {
  if (!avatarImg.classList.contains('selected')) return;
  selectedAvatar = avatars[currentAvatar];
  sessionStorage.setItem('printedAvatar', selectedAvatar);
  sessionStorage.setItem('claimAnimationPlayed', 'false');
  selectorUI.style.display = 'flex';
  screenContainer.classList.add('hidden');
  $('photobooth').style.display = 'block';
  firstTap.style.display = 'none';
  tapOverlay.style.display = 'block';
  tapOverlay.style.pointerEvents = 'none';
  firstTap.style.pointerEvents = 'none';
  setTimeout(() => {
    firstTap.style.display = 'inline';
    tapOverlay.style.pointerEvents = 'none';
    firstTap.style.pointerEvents = 'auto';
  }, 10000);
});
secondTap.addEventListener('click', e => {
  e.stopPropagation();
  const printedAvatar = sessionStorage.getItem('printedAvatar');
  if (!printedAvatar) return;
  claimScreen.innerHTML = '';
  const claimWrapper = document.createElement('div');
  setStyles(claimWrapper, {position:'relative',display:'inline-block',width:'100%',maxWidth:'100vw',height:'auto'});
  claimScreen.appendChild(claimWrapper);
  const imgEl = (src, styles) => { const i = new Image(); i.src = src; setStyles(i, styles); return i; };
  const claimBg = imgEl('claim.png', {display:'block',width:'100%',height:'auto'});
  const claimedImg = imgEl(printedAvatar, {zIndex:1,position:'absolute',top:'50%',left:'50%',width:'50%',maxWidth:'240px',transform:'translate3d(-50%,-195%,0)',opacity:0,backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',cursor:'pointer',pointerEvents:'none'});
  const claimOverlay = imgEl('claim2.png', {position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'contain',zIndex:2,pointerEvents:'none'});
  [claimBg, claimedImg, claimOverlay].forEach(el => claimWrapper.appendChild(el));
  setStyles(backFromClaimBtn, {zIndex:10,display:'block',pointerEvents:'auto'});
  claimScreen.appendChild(backFromClaimBtn);
  setStyles(claimScreen, {display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'});
  $('photobooth').style.display = 'none';
  tapOverlay.style.display = 'none';
  const hasAnimated = sessionStorage.getItem('claimAnimationPlayed') === 'true';
  const waitForImage = img => new Promise(res => (img.complete && img.naturalWidth) ? res() : img.addEventListener('load', res, {once:true}));
  Promise.all([claimBg, claimOverlay, claimedImg].map(waitForImage)).then(() => {
    void claimWrapper.offsetWidth;
    if (!hasAnimated) {
      claimedImg.style.opacity = 1;
      requestAnimationFrame(() => {
        claimedImg.classList.add('claim-avatar');
        sessionStorage.setItem('claimAnimationPlayed', 'true');
        setTimeout(() => claimedImg.style.pointerEvents = 'auto', 5000);
      });
    } else {
      setStyles(claimedImg, {opacity:1,transform:'translate3d(-50%, -11%, 0)',pointerEvents:'auto'});
    }
  });
  claimedImg.addEventListener('click', () => {
    const fsContainer = document.createElement('div');
    setStyles(fsContainer, {position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'black',display:'flex',alignItems:'center',justifyContent:'center',zIndex:99999});
    fsContainer.appendChild(imgEl(printedAvatar, {maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}));
    const btnWrapper = document.createElement('div');
    setStyles(btnWrapper, {position:'absolute',top:'10px',right:'10px',display:'flex',gap:'10px',zIndex:100000});
    const makeBtn = (icon, click) => {
      const b = document.createElement('button');
      b.innerHTML = `<span class="material-icons">${icon}</span>`;
      setStyles(b, {background:'#f78da7',color:'#fff',border:'none',borderRadius:'50%',width:'40px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'24px'});
      b.addEventListener('click', click);
      return b;
    };
    btnWrapper.appendChild(makeBtn('download', () => {
      const link = document.createElement('a');
      link.href = printedAvatar; link.download = 'photobooth_image.png';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    }));
    btnWrapper.appendChild(makeBtn('close', () => document.body.removeChild(fsContainer)));
    fsContainer.appendChild(btnWrapper);
    document.body.appendChild(fsContainer);
  });
});