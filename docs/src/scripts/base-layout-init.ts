/**
 * Base layout initialization: mobile header nav, event delegation, Astro lifecycle.
 */
import { applyTheme, setMode, resetContrast } from './theme';
import { openSearchOverlay, closeSearchOverlay } from './search';

// ===================================
// Mobile Header Nav (right drawer)
// ===================================

const mobileOverlay = document.getElementById('mobileOverlay');

function openMobileHeaderNav() {
  const headerNav = document.getElementById('header-nav-panel');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (headerNav && menuBtn) {
    headerNav.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobileOverlay?.classList.add('active');
  }
}

function closeMobileHeaderNav() {
  const headerNav = document.getElementById('header-nav-panel');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (headerNav) headerNav.classList.remove('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  mobileOverlay?.classList.remove('active');
}

// ===================================
// Event Delegation
// ===================================

document.addEventListener('click', function(e) {
  const target = e.target as HTMLElement;

  if (target.closest('.mobile-menu-btn')) {
    const headerNav = document.getElementById('header-nav-panel');
    if (headerNav && headerNav.classList.contains('open')) {
      closeMobileHeaderNav();
    } else {
      openMobileHeaderNav();
    }
    return;
  }

  if (target.closest('.mobile-nav-close')) {
    closeMobileHeaderNav();
    return;
  }

  if (target.id === 'mobileOverlay') {
    closeMobileHeaderNav();
    return;
  }

  if (target.closest('#search-trigger')) {
    openSearchOverlay();
    return;
  }
});

// Escape to close mobile nav (search handles its own Escape)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const searchOverlay = document.getElementById('search-overlay');
    if (!searchOverlay?.classList.contains('active')) {
      closeMobileHeaderNav();
    }
  }
});

// ===================================
// Astro View Transitions lifecycle
// ===================================

document.addEventListener('astro:before-preparation', () => {
  (window as any).__previousPath = window.location.pathname;
});

document.addEventListener('astro:after-swap', () => {
  const mode = localStorage.getItem('theme-mode') || 'light';
  setMode(mode);
  resetContrast();
  applyTheme();
});
