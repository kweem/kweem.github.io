/* ── Initialize grid (attach handlers and GSAP animations) ── */
const reduceMotionGrid = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initGrid() {
  // Click and keyboard handlers
  document.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('click', () => {
      toggleExpand(card.dataset.key, parseInt(card.dataset.row), card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpand(card.dataset.key, parseInt(card.dataset.row), card);
      }
    });
  });

  // Photo lightbox handlers
  document.querySelectorAll('.ph').forEach(ph => {
    ph.addEventListener('click', () => {
      const all = ph.closest('.photo-layout').querySelectorAll('.ph');
      const idx = Array.from(all).indexOf(ph);
      openLightbox(all, idx);
    });
  });

  // Scroll reveal: cards slide up with stagger per row
  if (!reduceMotionGrid) {
    gsap.utils.toArray('.prod-card').forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        delay: (i % 4) * 0.07
      });
    });

    // Scroll reveal: about + spotlicht strips
    gsap.utils.toArray('.gsap-up').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });
  }
}

/* ── Expand/collapse ── */
let openKey = null, openRow = null;

function repositionPanel(clickedCard, panel) {
  const top = clickedCard.getBoundingClientRect().top;
  const allCards = Array.from(document.querySelectorAll('.prod-card'));
  const rowCards = allCards.filter(c => Math.abs(c.getBoundingClientRect().top - top) < 2);
  const lastInRow = rowCards[rowCards.length - 1];
  if (lastInRow.nextElementSibling !== panel) {
    lastInRow.after(panel);
  }
}

function toggleExpand(key, row, clickedCard) {
  const same = openKey === key;
  document.querySelectorAll('.expand-panel').forEach(p => {
    p.classList.add('no-transition');
    p.classList.remove('is-open');
  });
  document.body.offsetHeight; // force reflow so instant-close is applied
  document.querySelectorAll('.expand-panel').forEach(p => p.classList.remove('no-transition'));
  document.querySelectorAll('.prod-card').forEach(c => c.classList.remove('is-open'));
  if (window.pauseAllPlayers) {
    window.pauseAllPlayers();
  } else {
    document.querySelectorAll('.ex-reel').forEach(v => { v.pause(); v.currentTime = 0; });
  }

  if (same) {
    openKey = null;
    openRow = null;
    return;
  }

  const panel = document.getElementById('panel-' + row);
  if (clickedCard) repositionPanel(clickedCard, panel);

  openKey = key;
  openRow = row;

  // Show the right pre-rendered content block
  const ei = document.getElementById('ei-' + row);
  ei.querySelectorAll('.expand-content').forEach(el => el.style.display = 'none');
  const content = ei.querySelector(`.expand-content[data-key="${key}"]`);
  content.style.display = 'contents';

  // Reset GSAP state (for re-opening)
  const elL = document.getElementById(`exl-${row}-${key}`);
  const elR = document.getElementById(`expr-${row}-${key}`);
  gsap.set(elL, { opacity: 0, x: -20 });
  gsap.set(elR, { opacity: 0, x:  20 });

  panel.classList.add('is-open');
  document.querySelectorAll('.prod-card').forEach(c => {
    if (c.dataset.key === key) c.classList.add('is-open');
  });

  const photos = content.querySelectorAll('.ph');

  if (!reduceMotionGrid) {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(elL, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' })
      .to(elR, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' }, '-=0.4');

    photos.forEach((ph, pi) => {
      tl.fromTo(ph, { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' },
        `-=${pi === 0 ? 0.25 : 0.2}`);
    });

    // Reel entrance (optioneel — alleen als aanwezig)
    const reelSection = content.querySelector('.expand-reel');
    if (reelSection) {
      gsap.set(reelSection, { opacity: 0, y: 16 });
      tl.to(reelSection,
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.1'
      );
    }
  } else {
    // No motion: just show everything immediately
    gsap.set(elL, { opacity: 1, x: 0 });
    gsap.set(elR, { opacity: 1, x: 0 });
    photos.forEach(ph => gsap.set(ph, { scale: 1, opacity: 1 }));
    const reelSection = content.querySelector('.expand-reel');
    if (reelSection) gsap.set(reelSection, { opacity: 1, y: 0 });
  }

  setTimeout(() => {
    const panel = document.getElementById('panel-' + row);
    const rect = panel.getBoundingClientRect();
    const scrollY = window.scrollY + rect.top - 250;
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }, 50);
}

function closeExpand(scrollToCard) {
  const card = scrollToCard ? document.querySelector('.prod-card.is-open') : null;
  if (window.pauseAllPlayers) {
    window.pauseAllPlayers();
  } else {
    document.querySelectorAll('.ex-reel').forEach(v => { v.pause(); v.currentTime = 0; });
  }
  document.querySelectorAll('.expand-panel').forEach(p => p.classList.remove('is-open'));
  document.querySelectorAll('.prod-card').forEach(c => c.classList.remove('is-open'));
  openKey = null;
  openRow = null;
  if (card) {
    const top = window.scrollY + card.getBoundingClientRect().top - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
