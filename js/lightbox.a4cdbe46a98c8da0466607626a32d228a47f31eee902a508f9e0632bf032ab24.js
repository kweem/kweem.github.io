(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let photos = [], currentIndex = 0;

  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');

  function show(index) {
    currentIndex = index;
    const ph = photos[index];
    lbImg.src = ph.querySelector('img').src;
    lbImg.alt = ph.querySelector('img').alt;
    lbPrev.classList.toggle('lb-hidden', index === 0);
    lbNext.classList.toggle('lb-hidden', index === photos.length - 1);
  }

  window.openLightbox = function (phElements, startIndex) {
    photos = Array.from(phElements);
    lb.classList.add('lb-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    show(startIndex);
    if (reduceMotion) {
      gsap.set(lb, { opacity: 1 });
      gsap.set(lbImg, { scale: 1, opacity: 1 });
    } else {
      gsap.set(lbImg, { scale: 0.94, opacity: 0 });
      gsap.to(lb,    { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.to(lbImg, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out', delay: 0.05 });
    }
    document.addEventListener('keydown', onKey);
  };

  window.closeLightbox = function () {
    document.removeEventListener('keydown', onKey);
    const finish = () => {
      lb.classList.remove('lb-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.src = '';
    };
    if (reduceMotion) { gsap.set(lb, { opacity: 0 }); finish(); }
    else { gsap.to(lb, { opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: finish }); }
  };

  function navigate(dir) {
    const next = currentIndex + dir;
    if (next < 0 || next >= photos.length) return;
    if (reduceMotion) { show(next); return; }
    gsap.to(lbImg, { opacity: 0, x: dir * -30, duration: 0.15, ease: 'power2.in', onComplete: () => {
      show(next);
      gsap.fromTo(lbImg, { opacity: 0, x: dir * 30 }, { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out' });
    }});
  }

  function onKey(e) {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev .addEventListener('click', () => navigate(-1));
  lbNext .addEventListener('click', () => navigate(1));
  lb     .addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
})();
