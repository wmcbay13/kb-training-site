// Apply the saved choice before the stylesheet loads to avoid a bright flash.
(() => {
  const key = 'foundry-and-flow-theme-v1';
  const systemTheme = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let preference = null;
  try {
    const stored = localStorage.getItem(key);
    if (stored === 'dark' || stored === 'light') preference = stored;
  } catch { /* Follow the system when storage is unavailable. */ }

  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? '#18221d' : '#eee8dc';
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  applyTheme(preference || (systemTheme && systemTheme.matches ? 'dark' : 'light'));
  function initializeToggle() {
    applyTheme(document.documentElement.dataset.theme);
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(preference);
      try { localStorage.setItem(key, preference); } catch { /* Keep the choice for this visit. */ }
    });
  }
  // Bind the control independently of optional system-preference listeners.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeToggle, { once: true });
  else initializeToggle();

  const followSystem = event => {
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  };
  if (systemTheme && typeof systemTheme.addEventListener === 'function') systemTheme.addEventListener('change', followSystem);
  else if (systemTheme && typeof systemTheme.addListener === 'function') systemTheme.addListener(followSystem);
})();
