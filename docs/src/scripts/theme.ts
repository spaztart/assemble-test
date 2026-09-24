/**
 * Theme switching: light/dark mode toggle, contrast cycling, Prism CSS swap.
 */

let currentMode = localStorage.getItem('theme-mode') || 'light';
let currentContrast = 0;

export function applyTheme() {
  document.documentElement.setAttribute('data-theme', currentMode);
  localStorage.setItem('theme-mode', currentMode);

  // Notify embedded Flutter demos so they can match the active theme.
  document.dispatchEvent(
    new CustomEvent('assemble:themechange', { detail: { mode: currentMode } })
  );

  const prismLight = document.getElementById('prism-light') as HTMLLinkElement;
  const prismDark = document.getElementById('prism-dark') as HTMLLinkElement;

  if (currentMode === 'light') {
    prismLight?.removeAttribute('disabled');
    prismDark?.setAttribute('disabled', 'disabled');
  } else {
    prismLight?.setAttribute('disabled', 'disabled');
    prismDark?.removeAttribute('disabled');
  }

  const contrastBadge = document.getElementById('contrastBadge');
  if (contrastBadge) {
    if (currentContrast === 0) {
      contrastBadge.textContent = '';
      contrastBadge.classList.remove('visible');
    } else {
      contrastBadge.textContent = currentContrast === 1 ? 'AA' : 'AAA';
      contrastBadge.classList.add('visible');
    }
  }
}

export function setMode(mode: string) {
  currentMode = mode;
}

export function resetContrast() {
  currentContrast = 0;
}

// Bind toggle buttons
const themeToggle = document.getElementById('themeToggle');
const contrastToggle = document.getElementById('contrastToggle');

themeToggle?.addEventListener('click', () => {
  currentMode = currentMode === 'light' ? 'dark' : 'light';
  applyTheme();
});

contrastToggle?.addEventListener('click', () => {
  currentContrast = (currentContrast + 1) % 3;
  applyTheme();
});

// Apply on load
applyTheme();
