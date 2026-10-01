/* 시뮬레이션 도구: 분야의 sims.js가 window.SITE_SIMS에 조작형 시뮬레이션을 등록할 때 씁니다.
   캔버스(고해상도·크기 맞춤), 조절 막대·버튼, 끌기, 애니메이션 루프, 3차원 투영, 작은 선형대수와 선형 계획법(심플렉스)을 담았습니다.
   색은 분야의 CSS 변수에서 읽으므로 밝은/어두운 화면을 모두 따릅니다. */
(function () {
  const SK = {};
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  SK.clamp = clamp;
  SK.reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  SK.el = el;

  // ---------- colours from the field palette ----------
  SK.colors = (node) => {
    const cs = getComputedStyle(node || document.documentElement);
    const v = (n, d) => (cs.getPropertyValue(n).trim() || d);
    const paper = v('--paper', '#f0f1f2');
    const dark = (() => { const m = /^#?([0-9a-f]{6})$/i.exec(paper.replace('#', '')); if (!m) return false; const n = parseInt(m[1], 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) < 110; })();
    return {
      dark, paper, paper2: v('--paper-2', '#e1e4e7'), paper3: v('--paper-3', '#f9fafa'),
      ink: v('--ink', '#15191e'), ink2: v('--ink-2', '#4e5155'), ink3: v('--ink-3', '#686b6f'),
      rule: v('--rule', 'rgba(0,0,0,.14)'), ruleS: v('--rule-strong', 'rgba(0,0,0,.32)'),
      acc: v('--camel', '#b0781a'), accInk: v('--camel-ink', '#835709'), blue: v('--denim', '#3d5166'), blue2: v('--denim-2', '#54697f'),
      ok: v('--ok', '#2c7a57'), bad: v('--bad', '#b03f3b'), mid: v('--mid', '#9a6f1c'),
      faint: v('--plot-faint', 'rgba(0,0,0,.16)'),
      // x, y, z axis colours (the usual red, green, blue, toned to sit on the paper)
      x: dark ? '#ff8f78' : '#c2412d', y: dark ? '#86d49a' : '#2c8547', z: dark ? '#93b6ff' : '#2d5fb8',
      okBg: dark ? 'rgba(134,212,154,.16)' : 'rgba(44,122,87,.12)', badBg: dark ? 'rgba(255,143,120,.16)' : 'rgba(176,63,59,.10)',
      accBg: dark ? 'rgba(230,179,90,.18)' : 'rgba(176,120,26,.13)', blueBg: dark ? 'rgba(169,189,210,.16)' : 'rgba(61,81,102,.10)',
    };
  };
  SK.alpha = (c, a) => { // '#rrggbb' → rgba with alpha; anything else is returned as is
    const m = /^#([0-9a-f]{6})$/i.exec(c);
    if (!m) return c;
    const n = parseInt(m[1], 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };

  // ---------- canvas that fits its box and redraws on resize ----------
  SK.canvas = (host, opt = {}) => {
    const wrap = el('div', 'sim-canvas' + (opt.cls ? ' ' + opt.cls : ''));
    const cv = el('canvas');
    cv.setAttribute('role', 'img');
    if (opt.label) cv.setAttribute('aria-label', opt.label);
    wrap.appendChild(cv);
    host.appendChild(wrap);
    const st = { cv, wrap, ctx: cv.getContext('2d'), w: 0, h: 0, draw: null, C: SK.colors(host) };
    let pending = false;
    st.fit = () => {
      const w = Math.max(200, wrap.clientWidth || 600);
      const ratio = opt.ratio || 0.6;
      const h = Math.round(clamp(w * ratio, opt.min || 240, opt.max || 520));
      const d = Math.min(window.devicePixelRatio || 1, 2);
      if (st.w !== w || st.h !== h || cv.width !== Math.round(w * d)) {
        cv.width = Math.round(w * d); cv.height = Math.round(h * d);
        cv.style.width = w + 'px'; cv.style.height = h + 'px';
        st.w = w; st.h = h;
        st.ctx.setTransform(d, 0, 0, d, 0, 0);
      }
      st.C = SK.colors(host);
      if (st.draw) { st.ctx.clearRect(0, 0, st.w, st.h); st.draw(st.ctx, st.w, st.h, st.C); }
    };
    st.req = () => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; if (st.draw && wrap.isConnected) { st.ctx.clearRect(0, 0, st.w, st.h); st.draw(st.ctx, st.w, st.h, st.C); } }); };
    st.now = () => { if (st.draw) { st.ctx.clearRect(0, 0, st.w, st.h); st.draw(st.ctx, st.w, st.h, st.C); } };
    // a theme switch repaints with the new palette; every watcher lets go once the sim has left the page
    const mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
    let mo = null, ro = null;
    const release = () => { if (ro) ro.disconnect(); if (mo) mo.disconnect(); if (mq && mq.removeEventListener) mq.removeEventListener('change', repaint); };
    function repaint() { if (!wrap.isConnected) { release(); return; } st.C = SK.colors(host); st.req(); }
    if (mq && mq.addEventListener) mq.addEventListener('change', repaint);
    if ('MutationObserver' in window) { mo = new MutationObserver(repaint); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); }
    if ('ResizeObserver' in window) {
      // only a change of width matters (the height follows from it); refit on the next frame so the observer never loops
      let lastW = -1;
      ro = new ResizeObserver(() => { if (!wrap.isConnected) { release(); return; } const w = wrap.clientWidth; if (w === lastW) return; lastW = w; requestAnimationFrame(st.fit); });
      ro.observe(wrap);
    }
    requestAnimationFrame(st.fit);
    return st;
  };
  // a world ↔ screen map that keeps x and y on the same scale
  SK.fitMap = (w, h, box, pad = 18) => {
    const [x0, x1, y0, y1] = box;
    const s = Math.min((w - 2 * pad) / (x1 - x0), (h - 2 * pad) / (y1 - y0));
    const ox = (w - s * (x1 - x0)) / 2 - s * x0, oy = (h + s * (y1 - y0)) / 2 + s * y0;
    return { s, X: (x) => ox + s * x, Y: (y) => oy - s * y, ix: (px) => (px - ox) / s, iy: (py) => (oy - py) / s };
  };

  // ---------- drawing helpers ----------
  SK.line = (ctx, x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  SK.arrow = (ctx, x1, y1, x2, y2, col, w = 2, head = 9) => {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 0.5) return;
    const a = Math.atan2(y2 - y1, x2 - x1), hh = Math.min(head, L * 0.6);
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    SK.line(ctx, x1, y1, x2 - hh * 0.7 * Math.cos(a), y2 - hh * 0.7 * Math.sin(a));
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - hh * Math.cos(a) + hh * 0.42 * Math.sin(a), y2 - hh * Math.sin(a) - hh * 0.42 * Math.cos(a));
    ctx.lineTo(x2 - hh * Math.cos(a) - hh * 0.42 * Math.sin(a), y2 - hh * Math.sin(a) + hh * 0.42 * Math.cos(a));
    ctx.closePath(); ctx.fill(); ctx.restore();
  };
  SK.dot = (ctx, x, y, r, fill, stroke, lw = 1.5) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
  SK.text = (ctx, s, x, y, o = {}) => {
    ctx.save();
    ctx.font = `${o.w || 500} ${o.s || 12}px "IBM Plex Sans", "IBM Plex Sans KR", system-ui, sans-serif`;
    ctx.fillStyle = o.c || '#000'; ctx.textAlign = o.a || 'left'; ctx.textBaseline = o.b || 'middle';
    if (o.halo) { ctx.lineWidth = 3.5; ctx.strokeStyle = o.halo; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    ctx.fillText(s, x, y); ctx.restore();
  };
  SK.grid = (ctx, M, box, step, col) => {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1;
    for (let x = Math.ceil(box[0] / step) * step; x <= box[1] + 1e-9; x += step) SK.line(ctx, M.X(x), M.Y(box[2]), M.X(x), M.Y(box[3]));
    for (let y = Math.ceil(box[2] / step) * step; y <= box[3] + 1e-9; y += step) SK.line(ctx, M.X(box[0]), M.Y(y), M.X(box[1]), M.Y(y));
    ctx.restore();
  };

  // ---------- controls ----------
  SK.panel = (host, cls) => { const p = el('div', 'sim-ctrl' + (cls ? ' ' + cls : '')); host.appendChild(p); return p; };
  let uid = 0;
  SK.slider = (parent, o) => {
    const id = 'sk' + ++uid;
    const wrap = el('div', 'sim-sl');
    const fmt = o.fmt || ((v) => (Math.round(v * 100) / 100).toString());
    wrap.innerHTML = `<label for="${id}">${o.label}</label><input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step || 0.01}" value="${o.value}"><output for="${id}"></output>`;
    parent.appendChild(wrap);
    const inp = wrap.querySelector('input'), out = wrap.querySelector('output');
    const show = () => { out.textContent = fmt(+inp.value); };
    show();
    inp.addEventListener('input', () => { show(); if (o.on) o.on(+inp.value); });
    return { el: wrap, input: inp, get value() { return +inp.value; }, set(v, quiet) { inp.value = v; show(); if (!quiet && o.on) o.on(+inp.value); } };
  };
  SK.seg = (parent, o) => {
    const wrap = el('div', 'sim-seg');
    if (o.label) wrap.appendChild(el('span', 'sim-seg-l', o.label));
    const box = el('div', 'sim-seg-b');
    box.setAttribute('role', 'group');
    if (o.label) box.setAttribute('aria-label', o.label.replace(/<[^>]+>/g, ''));
    wrap.appendChild(box);
    let cur = o.value;
    const btns = o.options.map(([v, t]) => {
      const b = el('button', null, t); b.type = 'button'; b.dataset.v = v;
      b.addEventListener('click', () => { set(v); });
      box.appendChild(b); return b;
    });
    const paint = () => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(cur))));
    function set(v, quiet) { cur = v; paint(); if (!quiet && o.on) o.on(v); }
    paint();
    parent.appendChild(wrap);
    return { el: wrap, get value() { return cur; }, set };
  };
  SK.select = (parent, o) => {
    const id = 'sk' + ++uid;
    const w = el('label', 'sim-sel', `<span>${o.label}</span><select id="${id}">${o.options.map(([v, t]) => `<option value="${v}"${String(v) === String(o.value) ? ' selected' : ''}>${t}</option>`).join('')}</select>`);
    w.setAttribute('for', id);
    parent.appendChild(w);
    const s = w.querySelector('select');
    s.addEventListener('change', () => o.on && o.on(s.value));
    return { el: w, get value() { return s.value; }, set(v) { s.value = v; } };
  };
  SK.btn = (parent, html, on, cls) => { const b = el('button', 'sim-btn' + (cls ? ' ' + cls : ''), html); b.type = 'button'; b.addEventListener('click', on); parent.appendChild(b); return b; };
  SK.check = (parent, label, value, on) => {
    const id = 'sk' + ++uid;
    const w = el('label', 'sim-chk', `<input id="${id}" type="checkbox"${value ? ' checked' : ''}><span>${label}</span>`);
    parent.appendChild(w);
    const inp = w.querySelector('input');
    inp.addEventListener('change', () => on && on(inp.checked));
    return { el: w, get value() { return inp.checked; }, set(v) { inp.checked = !!v; } };
  };
  SK.out = (parent, cls) => { const o = el('div', 'sim-out' + (cls ? ' ' + cls : '')); parent.appendChild(o); return o; };
  // KaTeX into an element (silently plain text when KaTeX is missing)
  SK.tex = (s, display) => {
    try { return window.katex ? katex.renderToString(s, { displayMode: !!display, throwOnError: false, strict: false }) : s; } catch (e) { return s; }
  };
  SK.num = (v, d = 2) => { const r = Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v; return r.toFixed(d).replace(/^-(0\.0*)$/, '$1'); };
  SK.texMat = (M, d = 2) => `\\begin{bmatrix}${M.map((r) => r.map((v) => SK.num(v, d)).join('&')).join('\\\\')}\\end{bmatrix}`;
  SK.texVec = (v, d = 2) => `(${v.map((x) => SK.num(x, d)).join(',\\ ')})`;
  SK.badge = (ok, yes, no) => `<span class="sim-badge ${ok ? 'ok' : 'bad'}">${ok ? yes : no}</span>`;

  // ---------- pointer dragging on a canvas ----------
  // pick(x, y) returns a handle (or null); move(handle, x, y); end(handle). Coordinates are CSS pixels in the canvas.
  SK.drag = (st, o) => {
    const cv = st.cv;
    let h = null;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const [x, y] = pos(e);
      h = o.pick(x, y, e);
      if (h == null) return;
      e.preventDefault();
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
      cv.classList.add('dragging');
      if (o.start) o.start(h, x, y);
    });
    cv.addEventListener('pointermove', (e) => {
      const [x, y] = pos(e);
      if (h != null) { o.move(h, x, y, e); return; }
      if (o.hover) cv.style.cursor = o.hover(x, y) ? 'grab' : '';
      else cv.style.cursor = o.pick(x, y, e) != null ? 'grab' : '';
    });
    const up = () => { if (h == null) return; const k = h; h = null; cv.classList.remove('dragging'); if (o.end) o.end(k); };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
  };

  // ---------- animation loop that stops itself when the sim leaves the page ----------
  SK.loop = (host, step) => {
    let raf = 0, last = 0, on = false;
    const tick = (t) => {
      if (!on) return;
      if (!host.isConnected) { on = false; return; }
      const dt = last ? Math.min((t - last) / 1000, 1 / 20) : 1 / 60;
      last = t;
      if (step(dt) === false) { on = false; return; }
      raf = requestAnimationFrame(tick);
    };
    return {
      start() { if (on) return; on = true; last = 0; raf = requestAnimationFrame(tick); },
      stop() { on = false; cancelAnimationFrame(raf); },
      get running() { return on; },
    };
  };

  // ---------- 3-D: an orthographic camera that orbits the origin (z up) ----------
  SK.cam = (o = {}) => {
    const c = { yaw: o.yaw != null ? o.yaw : 0.55, pitch: o.pitch != null ? o.pitch : 0.38, s: o.s || 120, cx: 0, cy: 0, target: o.target || [0, 0, 0] };
    c.basis = () => {
      const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
      return { r: [-sy, cy, 0], u: [-sp * cy, -sp * sy, cp], f: [cp * cy, cp * sy, sp] };
    };
    c.P = (p) => {
      const b = c.basis(), q = [p[0] - c.target[0], p[1] - c.target[1], p[2] - c.target[2]];
      return [c.cx + c.s * (q[0] * b.r[0] + q[1] * b.r[1] + q[2] * b.r[2]), c.cy - c.s * (q[0] * b.u[0] + q[1] * b.u[1] + q[2] * b.u[2]), q[0] * b.f[0] + q[1] * b.f[1] + q[2] * b.f[2]];
    };
    return c;
  };
  // drag on empty canvas space to orbit; returns true when it handled the drag
  SK.orbit = (st, cam, onChange) => {
    let o = null;
    return {
      pick(x, y) { o = [x, y, cam.yaw, cam.pitch]; return 'orbit'; },
      move(h, x, y) { if (h !== 'orbit' || !o) return; cam.yaw = o[2] - (x - o[0]) * 0.01; cam.pitch = clamp(o[3] + (y - o[1]) * 0.01, -1.45, 1.45); onChange(); },
    };
  };
  SK.axes3 = (ctx, cam, T, len, C, o = {}) => { // draw a frame: T = 4×4 (or {R, p})
    const R = T.R || [[T[0][0], T[0][1], T[0][2]], [T[1][0], T[1][1], T[1][2]], [T[2][0], T[2][1], T[2][2]]];
    const p = T.p || [T[0][3], T[1][3], T[2][3]];
    const O = cam.P(p);
    const cols = [C.x, C.y, C.z];
    const order = [0, 1, 2].map((k) => ({ k, d: cam.P([p[0] + len * R[0][k], p[1] + len * R[1][k], p[2] + len * R[2][k]])[2] })).sort((a, b) => a.d - b.d);
    order.forEach(({ k }) => {
      const E = cam.P([p[0] + len * R[0][k], p[1] + len * R[1][k], p[2] + len * R[2][k]]);
      const col = o.faint ? SK.alpha(cols[k], 0.4) : cols[k];
      SK.arrow(ctx, O[0], O[1], E[0], E[1], col, o.w || 2.2, o.head || 8);
      if (o.labels) SK.text(ctx, o.labels[k], E[0] + (E[0] - O[0]) * 0.12, E[1] + (E[1] - O[1]) * 0.12, { c: col, a: 'center', s: 11.5, w: 600, halo: C.paper3 });
    });
    if (o.name) SK.text(ctx, o.name, O[0] - 6, O[1] + 12, { c: o.faint ? C.ink3 : C.ink2, a: 'right', s: 11.5, w: 600, halo: C.paper3 });
  };

  // ---------- small linear algebra ----------
  const V = {
    add: (a, b) => a.map((x, i) => x + b[i]), sub: (a, b) => a.map((x, i) => x - b[i]), sc: (a, s) => a.map((x) => x * s),
    dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0), cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    norm: (a) => Math.hypot(...a), unit: (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); },
  };
  SK.V = V;
  const M = {
    I: (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))),
    mul: (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0))),
    mv: (A, x) => A.map((r) => r.reduce((s, v, k) => s + v * x[k], 0)),
    T: (A) => A[0].map((_, j) => A.map((r) => r[j])),
    skew: (w) => [[0, -w[2], w[1]], [w[2], 0, -w[0]], [-w[1], w[0], 0]],
    // Rodrigues: rotation about unit axis w by angle th
    rot: (w, th) => {
      const [x, y, z] = w, c = Math.cos(th), s = Math.sin(th), v = 1 - c;
      return [[c + x * x * v, x * y * v - z * s, x * z * v + y * s], [y * x * v + z * s, c + y * y * v, y * z * v - x * s], [z * x * v - y * s, z * y * v + x * s, c + z * z * v]];
    },
    // e^{[S]θ} for a screw S = (ω, v) with |ω| = 1 or (ω = 0, |v| = 1)
    exp6: (S, th) => {
      const w = S.slice(0, 3), v = S.slice(3);
      const nw = Math.hypot(...w);
      if (nw < 1e-12) return [[1, 0, 0, v[0] * th], [0, 1, 0, v[1] * th], [0, 0, 1, v[2] * th], [0, 0, 0, 1]];
      const R = M.rot(w, th), W = M.skew(w), W2 = M.mul(W, W);
      const G = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? th : 0) + (1 - Math.cos(th)) * W[i][j] + (th - Math.sin(th)) * W2[i][j]));
      const p = M.mv(G, v);
      return [[R[0][0], R[0][1], R[0][2], p[0]], [R[1][0], R[1][1], R[1][2], p[1]], [R[2][0], R[2][1], R[2][2], p[2]], [0, 0, 0, 1]];
    },
    app: (T, p) => [T[0][0] * p[0] + T[0][1] * p[1] + T[0][2] * p[2] + T[0][3], T[1][0] * p[0] + T[1][1] * p[1] + T[1][2] * p[2] + T[1][3], T[2][0] * p[0] + T[2][1] * p[1] + T[2][2] * p[2] + T[2][3]],
    R: (T) => [[T[0][0], T[0][1], T[0][2]], [T[1][0], T[1][1], T[1][2]], [T[2][0], T[2][1], T[2][2]]],
    inv2: (A) => { const d = A[0][0] * A[1][1] - A[0][1] * A[1][0]; return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]]; },
    // solve A x = b (square) by Gaussian elimination with partial pivoting; null when singular
    solve: (A0, b0) => {
      const n = A0.length, A = A0.map((r, i) => [...r, b0[i]]);
      for (let c = 0; c < n; c++) {
        let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
        if (Math.abs(A[p][c]) < 1e-12) return null;
        [A[c], A[p]] = [A[p], A[c]];
        for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; }
      }
      return A.map((r, i) => r[n] / r[i]);
    },
    // reduced row echelon form (copy); returns { R, pivots, rank }
    rref: (A0, tol = 1e-9) => {
      const A = A0.map((r) => r.slice()), m = A.length, n = A[0].length, piv = [];
      let r = 0;
      for (let c = 0; c < n && r < m; c++) {
        let p = r; for (let i = r + 1; i < m; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
        if (Math.abs(A[p][c]) < tol) continue;
        [A[r], A[p]] = [A[p], A[r]];
        const d = A[r][c]; for (let k = 0; k < n; k++) A[r][k] /= d;
        for (let i = 0; i < m; i++) if (i !== r) { const f = A[i][c]; if (f) for (let k = 0; k < n; k++) A[i][k] -= f * A[r][k]; }
        piv.push(c); r++;
      }
      A.forEach((row) => row.forEach((v, k) => { if (Math.abs(v) < tol) row[k] = 0; }));
      return { R: A, pivots: piv, rank: r };
    },
    // eigen-decomposition of a symmetric 2×2 matrix: [[l1, v1], [l2, v2]] with l1 ≥ l2
    eig2: (A) => {
      const a = A[0][0], b = A[0][1], d = A[1][1], tr = a + d, dt = a * d - b * b, q = Math.sqrt(Math.max(tr * tr / 4 - dt, 0));
      const l1 = tr / 2 + q, l2 = tr / 2 - q;
      let v1 = Math.abs(b) > 1e-12 ? [l1 - d, b] : (a >= d ? [1, 0] : [0, 1]);
      const n = Math.hypot(...v1); v1 = [v1[0] / n, v1[1] / n];
      return [[l1, v1], [l2, [-v1[1], v1[0]]]];
    },
  };
  SK.M = M;

  // ---------- linear programming: min c·x subject to A x = b, x ≥ 0 (two-phase simplex, Bland's rule) ----------
  SK.lp = (A0, b0, c0) => {
    const m = A0.length, n = A0[0].length, eps = 1e-10;
    const A = A0.map((r, i) => (b0[i] < 0 ? r.map((v) => -v) : r.slice()));
    const b = b0.map((v) => Math.abs(v));
    // tableau rows: [x (n) | artificials (m) | rhs]
    let T = A.map((r, i) => [...r, ...Array.from({ length: m }, (_, j) => (i === j ? 1 : 0)), b[i]]);
    let basis = Array.from({ length: m }, (_, i) => n + i);
    const W = n + m;
    const pivot = (r, c) => {
      const d = T[r][c]; T[r] = T[r].map((v) => v / d);
      T.forEach((row, i) => { if (i !== r) { const f = row[c]; if (Math.abs(f) > 0) T[i] = row.map((v, k) => v - f * T[r][k]); } });
      basis[r] = c;
    };
    const run = (cost, allowed) => {
      for (let it = 0; it < 500; it++) {
        let enter = -1;
        for (let j = 0; j < W; j++) {
          if (!allowed(j) || basis.includes(j)) continue;
          let rc = cost[j]; for (let i = 0; i < T.length; i++) rc -= cost[basis[i]] * T[i][j];
          if (rc < -eps) { enter = j; break; }
        }
        if (enter < 0) return 'optimal';
        let leave = -1, best = Infinity;
        for (let i = 0; i < T.length; i++) {
          if (T[i][enter] > eps) {
            const q = T[i][W] / T[i][enter];
            if (q < best - 1e-12 || (Math.abs(q - best) <= 1e-12 && basis[i] < basis[leave])) { best = q; leave = i; }
          }
        }
        if (leave < 0) return 'unbounded';
        pivot(leave, enter);
      }
      return 'optimal';
    };
    const c1 = Array.from({ length: W }, (_, j) => (j >= n ? 1 : 0));
    run(c1, () => true);
    const art = T.reduce((s, row, i) => s + (basis[i] >= n ? row[W] : 0), 0);
    if (art > 1e-8) return { status: 'infeasible' };
    // drive artificials out of the basis (or drop redundant rows)
    for (let i = T.length - 1; i >= 0; i--) {
      if (basis[i] < n) continue;
      let j = 0; while (j < n && Math.abs(T[i][j]) < 1e-9) j++;
      if (j < n) pivot(i, j); else { T.splice(i, 1); basis.splice(i, 1); }
    }
    const c2 = Array.from({ length: W }, (_, j) => (j < n ? c0[j] : 0));
    const st = run(c2, (j) => j < n);
    if (st === 'unbounded') return { status: 'unbounded' };
    const x = Array(n).fill(0);
    basis.forEach((j, i) => { if (j < n) x[j] = T[i][W]; });
    return { status: 'optimal', x, value: x.reduce((s, v, j) => s + v * c0[j], 0) };
  };
  // force closure of wrench columns (rows = wrench components): rank full and some k > 0 with A k = 0.
  // Returns { closure, rank, margin } where margin = the largest t with k_i ≥ t, Σk = 1.
  SK.closure = (cols, dim) => {
    if (!cols.length) return { closure: false, rank: 0, margin: 0 };
    const A = Array.from({ length: dim }, (_, i) => cols.map((c) => c[i]));
    const rank = M.rref(A, 1e-9).rank;
    const n = cols.length;
    // variables: t, s_1..s_n ≥ 0 with k = t·1 + s
    const rows = A.map((r) => [r.reduce((a, v) => a + v, 0), ...r]);
    rows.push([n, ...Array(n).fill(1)]);
    const rhs = [...Array(dim).fill(0), 1];
    const res = SK.lp(rows, rhs, [-1, ...Array(n).fill(0)]);
    const margin = res.status === 'optimal' ? res.x[0] : 0;
    const k = res.status === 'optimal' ? res.x.slice(1).map((s) => s + margin) : null;
    return { closure: rank === dim && margin > 1e-7, rank, margin, inHull: res.status === 'optimal', k };
  };

  window.SimKit = SK;
})();
