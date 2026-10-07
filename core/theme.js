/* 밝은 화면 / 어두운 화면 전환. <head>에서 불러 저장된 선택을 첫 화면 전에 적용하고,
   페이지가 준비되면 왼쪽 아래에 전환 버튼을 붙입니다. 선택은 이 브라우저에만 저장되고,
   선택한 적이 없으면 기기 설정(prefers-color-scheme)을 따릅니다. */
(function () {
  const KEY = 'equation-theme';
  const root = document.documentElement;
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (t) => { try { localStorage.setItem(KEY, t); } catch (e) { /* private window: this page only */ } };
  const saved = read();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  const current = () => {
    const t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8z"/></svg>';

  function paint(btn) {
    const dark = current() === 'dark';
    // the icon shows where a press takes you
    btn.innerHTML = dark ? SUN : MOON;
    const label = dark ? '밝은 화면으로' : '어두운 화면으로';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }
  function mount() {
    if (document.getElementById('theme-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'theme-btn';
    btn.className = 'theme-btn';
    btn.type = 'button';
    paint(btn);
    btn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      btn.classList.remove('turn'); void btn.offsetWidth; btn.classList.add('turn');
      paint(btn); // pages redraw their canvases by watching data-theme
    });
    document.body.appendChild(btn);
    // following the device setting until the reader chooses
    if (window.matchMedia) {
      const mq = matchMedia('(prefers-color-scheme: dark)');
      const on = () => paint(btn);
      if (mq.addEventListener) mq.addEventListener('change', on); else if (mq.addListener) mq.addListener(on);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
