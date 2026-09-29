/* 배경 벡터장 — 마우스를 움직이면 격자 위의 짧은 바늘들이 나타나 커서(최솟점)를 향해 돌아섭니다.
   경사하강의 화살표나 자석 둘레의 쇳가루처럼 보이고, 마우스를 멈추면 1초 안에 가라앉습니다.
   글을 가리지 않도록 옅게 그리고, 불투명한 상자(정리·예제·머리말) 뒤로 숨습니다.
   터치 기기, “동작 줄이기” 설정, 시험 중 화면에서는 켜지 않습니다.
   가볍게 돌도록: 살아 있는 바늘만 목록으로 들고 다니며 그 둘레만 지우고 그리고, 할 일이 없으면 멈춥니다. */
(function () {
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches) return;

  const S = 28; // lattice spacing (CSS px)
  const R = 170; // reach of the cursor
  const DECAY = 0.955; // per frame: a needle fades in about a second
  const ALPHA = 0.6; // strongest needle opacity
  const LEVELS = 6; // opacity buckets, one stroke call each
  const PAD = 16; // margin around the drawn needles when clearing

  let cv = null, ctx = null, W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
  let ang = null, amp = null, on = null, act = [];
  let mx = 0, my = 0, has = false, lx = null, ly = null, moved = 0, energy = 0;
  let running = false, box = null, scrolledAt = -1e9;
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
    const de = document.documentElement;
    W = de.clientWidth; H = de.clientHeight; // the canvas box: the viewport without its scrollbars
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / S); rows = Math.ceil(H / S);
    ang = new Float32Array(cols * rows); amp = new Float32Array(cols * rows); on = new Uint8Array(cols * rows);
    act = []; box = null;
  }
  function colors() {
    const cs = getComputedStyle(document.documentElement);
    ink = cs.getPropertyValue('--denim').trim() || ink;
    tip = cs.getPropertyValue('--camel').trim() || tip;
  }
  const off = () => calm.matches || document.body.dataset.view === 'exam-live';

  function frame(now) {
    energy = Math.min(1, energy * 0.88 + moved * 0.02);
    moved = 0;
    // stir the needles around the cursor
    if (has && energy > 0.004) {
      const c0 = Math.max(0, Math.floor((mx - R) / S)), c1 = Math.min(cols - 1, Math.floor((mx + R) / S));
      const r0 = Math.max(0, Math.floor((my - R) / S)), r1 = Math.min(rows - 1, Math.floor((my + R) / S));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const dx = mx - (c * S + S / 2), dy = my - (r * S + S / 2), d = Math.hypot(dx, dy);
          if (d >= R) continue;
          const q = d / R, want = energy * (1 - q * q) * Math.min(1, Math.max(0, (d - 10) / 22));
          const k = r * cols + c, target = Math.atan2(dy, dx);
          if (!on[k]) {
            if (want < 0.02) continue;
            on[k] = 1; act.push(k); ang[k] = target; amp[k] = 0;
          } else {
            let t = target - ang[k];
            t -= Math.round(t / (2 * Math.PI)) * 2 * Math.PI;
            ang[k] += t * 0.22;
          }
          if (want > amp[k]) amp[k] += (want - amp[k]) * 0.5;
        }
      }
    }
    // fade, then redraw only the live needles
    if (box) ctx.clearRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
    const decay = now - scrolledAt < 160 ? 0.8 : DECAY; // scrolling sweeps them away quickly
    const paths = [], dots = [];
    for (let l = 0; l < LEVELS; l++) { paths.push(new Path2D()); dots.push(new Path2D()); }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, n = 0;
    for (let i = 0; i < act.length; i++) {
      const k = act[i], a = amp[k] * decay;
      if (a < 0.015) { on[k] = 0; amp[k] = 0; continue; }
      amp[k] = a; act[n++] = k;
      const c = k % cols, r = (k - c) / cols, px = c * S + S / 2, py = r * S + S / 2;
      const h = (6 + 12 * a) / 2, ux = Math.cos(ang[k]) * h, uy = Math.sin(ang[k]) * h;
      const l = Math.min(LEVELS - 1, Math.floor(a * LEVELS)), rr = 0.7 + 1.3 * a;
      paths[l].moveTo(px - ux, py - uy); paths[l].lineTo(px + ux, py + uy);
      dots[l].moveTo(px + ux + rr, py + uy); dots[l].arc(px + ux, py + uy, rr, 0, 2 * Math.PI);
      if (px < x0) x0 = px;
      if (px > x1) x1 = px;
      if (py < y0) y0 = py;
      if (py > y1) y1 = py;
    }
    act.length = n;
    if (n) {
      ctx.lineCap = 'round'; ctx.lineWidth = 1.5;
      for (let l = 0; l < LEVELS; l++) {
        ctx.globalAlpha = ALPHA * (l + 0.5) / LEVELS;
        ctx.strokeStyle = ink; ctx.stroke(paths[l]);
        ctx.fillStyle = tip; ctx.fill(dots[l]);
      }
      ctx.globalAlpha = 1;
      box = [x0 - PAD, y0 - PAD, x1 + PAD, y1 + PAD];
    } else box = null;
    if (n || (has && energy > 0.004)) requestAnimationFrame(frame);
    else running = false;
  }

  function move(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (e.buttons || off()) { lx = null; return; } // dragging a scrollbar or selecting text
    const de = document.documentElement;
    if (e.clientX >= de.clientWidth || e.clientY >= de.clientHeight) { has = false; lx = null; return; } // over a scrollbar
    if (!cv) mount();
    if (lx !== null) moved += Math.hypot(e.clientX - lx, e.clientY - ly);
    mx = lx = e.clientX; my = ly = e.clientY; has = true;
    if (!running) { running = true; colors(); requestAnimationFrame(frame); }
  }
  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { has = false; lx = null; } });
  window.addEventListener('scroll', () => { scrolledAt = performance.now(); }, { passive: true });
  window.addEventListener('resize', () => { if (cv) { size(); ctx.clearRect(0, 0, W, H); } });
})();
