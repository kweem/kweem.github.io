/* ── Hero slides (heroImgs injected by template) ── */
const slidesEl = document.getElementById('heroSlides');
const dotsEl = document.getElementById('heroDots');
const idxEl = document.getElementById('heroIdx');

document.getElementById('heroTotal').textContent = String(heroImgs.length).padStart(2, '0');

for (let i = heroImgs.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [heroImgs[i], heroImgs[j]] = [heroImgs[j], heroImgs[i]];
}

heroImgs.forEach((img, i) => {
  const src = (typeof img === 'object')
    ? (window.innerWidth <= 768 ? img.mobile : img.desktop)
    : img;
  const d = document.createElement('div');
  d.className = 'hero-slide' + (i === 0 ? ' active' : '');
  d.style.backgroundImage = `url('${src}')`;
  slidesEl.appendChild(d);

  const dot = document.createElement('div');
  dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
  dotsEl.appendChild(dot);
});

let hIdx = 0;
setInterval(() => {
  const slides = slidesEl.querySelectorAll('.hero-slide');
  const dots = dotsEl.querySelectorAll('.hero-dot');

  slides[hIdx].classList.remove('active');
  dots[hIdx].classList.remove('active');

  hIdx = (hIdx + 1) % heroImgs.length;

  slides[hIdx].classList.add('active');
  dots[hIdx].classList.add('active');

  idxEl.textContent = String(hIdx + 1).padStart(2, '0');
  gsap.fromTo(idxEl, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
}, 3500);

/* ── Check for reduced motion preference ── */
const reduceMotionHero = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Hero parallax ── */
if (!reduceMotionHero) {
  gsap.to('.hero-slides', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* ── Hero entrance ── */
window.addEventListener('load', () => {
  if (reduceMotionHero) {
    // No motion: just show all hero elements immediately
    document.getElementById('hEyebrow').style.opacity = '1';
    document.getElementById('hEyebrow').style.transform = 'translateY(0)';
    document.querySelectorAll('.tw').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    document.getElementById('hTagline').style.opacity = '1';
    document.getElementById('hTagline').style.transform = 'translateY(0)';
    document.getElementById('hCta').style.opacity = '1';
    document.getElementById('heroCounter').style.opacity = '1';
    document.getElementById('heroDots').style.opacity = '1';
  } else {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#hEyebrow', { opacity: 1, y: 0, duration: 0.65 }, 0.15)
      .to('.tw', { y: 0, opacity: 1, duration: 0.75, stagger: 0.1 }, 0.35)
      .to('#hTagline', { opacity: 1, y: 0, duration: 0.6 }, 0.7)
      .to('#hCta', { opacity: 1, duration: 0.5 }, 0.95)
      .to('#heroCounter', { opacity: 1, duration: 0.5 }, 0.85)
      .to('#heroDots', { opacity: 1, duration: 0.5 }, 0.85);
  }
});
