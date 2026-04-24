// Shared site scripts: cookbook popup + nav active state
(function () {
  // ─── Cookbook modal (first-visit only) ───
  const modal = document.getElementById('cookbook-modal');
  if (modal) {
    const seen = localStorage.getItem('mxriyum-cookbook-seen');
    const forceShow = new URLSearchParams(location.search).get('popup') === '1';
    if (!seen || forceShow) {
      setTimeout(() => modal.classList.add('show'), 900);
    }
    const close = () => {
      modal.classList.remove('show');
      localStorage.setItem('mxriyum-cookbook-seen', '1');
    };
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }
})();
