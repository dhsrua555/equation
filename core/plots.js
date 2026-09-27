/* Plates: every unit is illustrated by the curve family that defines it, drawn in thin lines.
   This file holds the drawing machinery; each field registers its own plates with EMPlots.add({ name(ctx, w, h, colors) {…} }).
   Everything is deterministic (no Math.random) so the plates look the same on every visit. */
(function () {
  const TAU = Math.PI * 2;
  const P = {};

  // map math coordinates to canvas
  function frame(w, h, x0, x1, y0, y1) {
    return {
      X: (x) => ((x - x0) / (x1 - x0)) * w,
      Y: (y) => h - ((y - y0) / (y1 - y0)) * h,
    };
  }
  function curve(ctx, f, a, b, n, T) {
    ctx.beginPath();
    let pen = false;
    for (let k = 0; k <= n; k++) {
      const x = a + ((b - a) * k) / n;
      const y = f(x);
      if (!isFinite(y)) { pen = false; continue; }
      if (pen) ctx.lineTo(T.X(x), T.Y(y)); else { ctx.moveTo(T.X(x), T.Y(y)); pen = true; }
    }
    ctx.stroke();
  }
  function param(ctx, fx, fy, a, b, n, T) {
    ctx.beginPath();
    for (let k = 0; k <= n; k++) {
      const t = a + ((b - a) * k) / n;
      const x = fx(t), y = fy(t);
      k ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y));
    }
    ctx.stroke();
  }
  function trace(ctx, F, x, y, dt, steps, T) {
    ctx.beginPath();
    ctx.moveTo(T.X(x), T.Y(y));
    for (let k = 0; k < steps; k++) {
      // RK2 midpoint
      const [a1, b1] = F(x, y);
      const [a2, b2] = F(x + (dt / 2) * a1, y + (dt / 2) * b1);
      x += dt * a2; y += dt * b2;
      ctx.lineTo(T.X(x), T.Y(y));
    }
    ctx.stroke();
  }

  function colors(el) {
    const cs = getComputedStyle(el);
    const v = (n) => cs.getPropertyValue(n).trim();
    return { a: v('--plot-a'), b: v('--plot-b'), faint: v('--plot-faint'), faint2: v('--plot-faint2') };
  }

  function draw(canvas) {
    const fn = P[canvas.dataset.plot];
    if (!fn) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    fn(ctx, rect.width, rect.height, colors(canvas));
  }

  let ro = null;
  function mount(root) {
    const list = (root || document).querySelectorAll('canvas[data-plot]');
    if (!ro && 'ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => entries.forEach((e) => draw(e.target)));
    }
    list.forEach((cv) => { draw(cv); if (ro) ro.observe(cv); });
  }
  function redrawAll() { document.querySelectorAll('canvas[data-plot]').forEach(draw); }

  window.EMPlots = {
    mount, redrawAll,
    add(set) { Object.assign(P, set); },
    get names() { return Object.keys(P); },
    util: { TAU, frame, curve, param, trace },
  };
})();
