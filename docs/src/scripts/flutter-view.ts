/**
 * Keeps embedded Flutter demos (`FlutterView.astro`) in sync with the docs
 * site's light/dark theme.
 *
 * Each `.flutter-view iframe` is rendered with a `data-src` (instead of `src`)
 * so we can bake the current theme into the initial URL — the Flutter app reads
 * `?theme=` on startup, avoiding a light/dark flash before the first paint.
 *
 * After load, theme toggles are relayed to every demo via `postMessage`. The
 * Flutter app cross-fades the change (~200ms), matching the docs page's own
 * colour transition. A `ready` handshake covers demos that finish loading after
 * a toggle, or when the reader's saved theme differs from the initial seed.
 */

const SET_THEME = 'assemble:set-theme';
const READY = 'assemble:ready';

function currentTheme(): string {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function postTheme(target: Window | null, mode: string): void {
  target?.postMessage({ type: SET_THEME, mode }, '*');
}

/** Assigns each pending iframe its `src`, seeding the active theme. */
function initFrames(): void {
  const mode = currentTheme();
  document
    .querySelectorAll<HTMLIFrameElement>('.flutter-view iframe[data-src]')
    .forEach((frame) => {
      if (frame.dataset.themeInit === 'true') return;
      const raw = frame.dataset.src ?? '';
      const separator = raw.includes('?') ? '&' : '?';
      frame.src = `${raw}${separator}theme=${encodeURIComponent(mode)}`;
      frame.dataset.themeInit = 'true';
    });
}

/** Sends the current theme to every loaded demo. */
function broadcastTheme(mode: string): void {
  document
    .querySelectorAll<HTMLIFrameElement>('.flutter-view iframe')
    .forEach((frame) => postTheme(frame.contentWindow, mode));
}

// A demo announces readiness → reply with the current theme.
window.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.type === READY) {
    postTheme(event.source as Window, currentTheme());
  }
});

// The reader toggled light/dark → relay to all demos.
document.addEventListener('assemble:themechange', (event: Event) => {
  const detail = (event as CustomEvent<{ mode?: string }>).detail;
  broadcastTheme(detail?.mode ?? currentTheme());
});

// Initialise on first load and after every Astro view transition.
document.addEventListener('astro:page-load', initFrames);
initFrames();
