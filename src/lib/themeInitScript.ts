export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('swagger-theme-storage');
    if (!stored) return;

    var parsed = JSON.parse(stored);
    var theme = parsed && parsed.state && parsed.state.theme;
    
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;
