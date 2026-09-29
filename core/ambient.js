/* 배경 벡터장 — 마우스를 움직이면 격자 위의 짧은 바늘들이 나타나 커서(최솟점)를 향해 돌아섭니다.
   경사하강의 화살표나 자석 둘레의 쇳가루처럼 보이고, 마우스를 멈추면 1초 안에 가라앉습니다.
   글을 가리지 않도록 옅게 그리고, 불투명한 상자(정리·예제·머리말) 뒤로 숨습니다.
   터치 기기, “동작 줄이기” 설정, 시험 중 화면에서는 켜지 않습니다. */
(function () {
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches) return;

  const S = 28; // lattice spacing (CSS px)
  const R = 170; // reach of the cursor
  const DECAY = 0.962; // per frame: a needle fades in about a second
  const ALPHA = 0.6; // strongest needle opacity
  const LEVELS = 8; // opacity buckets, one stroke call each

  let cv = null, ctx = null, W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
  let ang = new Float32Array(0), amp = new Float32Array(0);
  let mx = -1e4, my = -1e4, lx = null, ly = null, energy = 0, running = false;
  let ink = '#2d5f8f', tip = '#a8764b';

  function mount() {
    cv = document.createElement('canvas');
    cv.className = 'ambient';
    cv.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(cv, document.body.firstChild);
    ctx = cv.getContext('2d');
    size();
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / S) + 1; rows = Math.ceil(H / S) + 1;
    ang = new Float32Array(cols * rows); amp = new Float32Array(cols * rows);
  }
  function colors() {
    const cs = getComputedStyle(document.documentElement);
    ink = cs.getPropertyValue('--denim').trim() || ink;
    tip = cs.getPropertyValue('--camel').trim() || tip;
  }
  const off = () => calm.matches || document.body.dataset.view === 'exam-live';

  function frame() {
    energy *= 0.9;
    const x0 = Math.max(0, Math.floor((mx - R) / S)), x1 = Math.min(cols - 1, Math.ceil((mx + R) / S));
    const y0 = Math.max(0, Math.floor((my - R) / S)), y1 = Math.min(rows - 1, Math.ceil((my + R) / S));
    let live = energy > 0.004;
    for (let i = 0; i < amp.length; i++) amp[i] *= DECAY;
    for (let r = y0; r <= y1; r++) {
      for (let c = x0; c <= x1; c++) {
        const px = c * S + S / 2, py = r * S + S / 2;
        const dx = mx - px, dy = my - py, d = Math.hypot(dx, dy);
        if (d >= R) continue;
        const k = r * cols + c;
        const target = Math.atan2(dy, dx);
        if (amp[k] < 0.02) ang[k] = target;
        else { let t = target - ang[k]; t -= Math.round(t / (2 * Math.PI)) * 2 * Math.PI; ang[k] += t * 0.22; }
        const near = Math.min(1, Math.max(0, (d - 10) / 22)); // keep the spot under the cursor clear
        const q = d / R, want = energy * (1 - q * q) * near;
        if (want > amp[k]) amp[k] += (want - amp[k]) * 0.5;
      }
    }
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.lineWidth = 1.5;
    const paths = Array.from({ length: LEVELS }, () => new Path2D());
    const dots = Array.from({ length: LEVELS }, () => new Path2D());
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = r * cols + c, a = amp[k];
        if (a < 0.015) continue;
        live = true;
        const lv = Math.min(LEVELS - 1, Math.floor(a * LEVELS));
        const px = c * S + S / 2, py = r * S + S / 2;
        const h = (6 + 12 * a) / 2, ux = Math.cos(ang[k]) * h, uy = Math.sin(ang[k]) * h;
        paths[lv].moveTo(px - ux, py - uy); paths[lv].lineTo(px + ux, py + uy);
        const rr = 0.7 + 1.3 * a;
        dots[lv].moveTo(px + ux + rr, py + uy); dots[lv].arc(px + ux, py + uy, rr, 0, 2 * Math.PI);
      }
    }
    for (let lv = 0; lv < LEVELS; lv++) {
      ctx.globalAlpha = ALPHA * (lv + 0.5) / LEVELS;
      ctx.strokeStyle = ink; ctx.stroke(paths[lv]);
      ctx.fillStyle = tip; ctx.fill(dots[lv]);
    }
    ctx.globalAlpha = 1;
    if (live) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, W, H); }
  }

  function move(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (off()) return;
    if (!cv) mount();
    mx = e.clientX; my = e.clientY;
    if (lx !== null) energy = Math.min(1, energy + Math.hypot(mx - lx, my - ly) * 0.02);
    lx = mx; ly = my;
    if (!running) { running = true; colors(); requestAnimationFrame(frame); }
  }
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { lx = ly = null; mx = my = -1e4; });
  window.addEventListener('resize', () => { if (cv) size(); });
})();
