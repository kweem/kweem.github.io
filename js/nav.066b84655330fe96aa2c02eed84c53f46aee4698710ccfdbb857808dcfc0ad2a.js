/* ── Update active nav link based on current URL ── */
function updateActiveNav() {
  const path = window.location.pathname;

  // Determine which page is active
  let activePage = null;
  if (path === '/' || path === '') activePage = 'home';
  else if (path.includes('/spotlicht')) activePage = 'spotlicht';
  else if (path.includes('/over')) activePage = 'over';
  else if (path.includes('/contact')) activePage = 'contact';

  // Update desktop nav
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
  });
  if (activePage) document.getElementById(`n-${activePage}`)?.classList.add('active');

  // Update mobile nav
  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.classList.remove('active');
  });
  if (activePage) document.getElementById(`nm-${activePage}`)?.classList.add('active');
}

// Run on page load and when navigating
updateActiveNav();
window.addEventListener('popstate', updateActiveNav);

/* ── Scroll listener ── */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);

  const scrollLine = document.getElementById('scroll-line');
  if (scrollLine) {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollLine.style.width = pct + '%';
  }
}, { passive: true });

/* ── Mobile menu toggle ── */
let menuOpen = false;
let _focusTrapHandler = null;

function toggleMenu() {
  menuOpen = !menuOpen;
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');

  burger.classList.toggle('open', menuOpen);
  burger.setAttribute('aria-expanded', menuOpen);
  mobile.classList.toggle('open', menuOpen);
  mobile.style.display = menuOpen ? 'flex' : '';
  document.body.style.overflow = menuOpen ? 'hidden' : '';

  if (menuOpen) {
    focusTrapMenu();
  } else if (_focusTrapHandler) {
    mobile.removeEventListener('keydown', _focusTrapHandler);
    _focusTrapHandler = null;
  }
}

/* ── Focus trap for mobile menu ── */
function focusTrapMenu() {
  const mobile = document.getElementById('navMobile');
  const focusableElements = mobile.querySelectorAll(
    'a, button, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  _focusTrapHandler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  mobile.addEventListener('keydown', _focusTrapHandler);
}
