/* 기초 수학 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve } = window.EMPlots.util;
  const clip = (f, lim) => (x) => { const y = f(x); return Math.abs(y) > lim ? NaN : y; };
  function dot(ctx, T, x, y, r) { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), r, 0, TAU); ctx.fill(); }
  function vline(ctx, T, x, y0, y1) { ctx.beginPath(); ctx.moveTo(T.X(x), T.Y(y0)); ctx.lineTo(T.X(x), T.Y(y1)); ctx.stroke(); }

  window.EMPlots.add({
    // 01 — sin x and its Taylor polynomials T1, T3, …, T13 hugging it further and further out
    taylor(ctx, w, h, c) {
      const span = 7.2, T = frame(w, h, -span, span, -2.6, 2.6);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      curve(ctx, () => 0, -span, span, 2, T);
      ctx.lineWidth = 1.2;
      for (let n = 1; n <= 13; n += 2) {
        const Tn = (x) => { let s = 0, term = x; for (let k = 1; k <= n; k += 2) { s += term; term *= -x * x / ((k + 1) * (k + 2)); } return s; };
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.3 + 0.07 * n / 2;
        curve(ctx, clip(Tn, 3.4), -span, span, 600, T);
      }
      ctx.globalAlpha = 1; ctx.strokeStyle = c.b; ctx.lineWidth = 2;
      curve(ctx, Math.sin, -span, span, 600, T);
    },
    // 02 — area under e^{-x^2} with Riemann sums of shrinking width
    riemann(ctx, w, h, c) {
      const T = frame(w, h, -2.6, 2.6, -0.12, 1.25);
      const f = (x) => Math.exp(-x * x);
      [6, 12, 26].forEach((n, j) => {
        ctx.strokeStyle = j === 2 ? c.a : c.faint2; ctx.lineWidth = 1; ctx.globalAlpha = j === 2 ? 0.55 : 1;
        const a = -2.4, b = 2.4, dx = (b - a) / n;
        for (let i = 0; i < n; i++) {
          const x0 = a + i * dx, y = f(x0 + dx / 2);
          ctx.strokeRect(T.X(x0), T.Y(y), T.X(x0 + dx) - T.X(x0), T.Y(0) - T.Y(y));
        }
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = c.faint; curve(ctx, () => 0, -2.6, 2.6, 2, T);
      ctx.strokeStyle = c.b; ctx.lineWidth = 2;
      curve(ctx, f, -2.6, 2.6, 400, T);
    },
    // 03 — 1/(1+x^2) and the partial sums of its power series, which peel away outside |x| < 1
    partial(ctx, w, h, c) {
      const T = frame(w, h, -2.1, 2.1, -0.9, 1.9);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      vline(ctx, T, -1, -0.9, 1.9); vline(ctx, T, 1, -0.9, 1.9);
      curve(ctx, () => 0, -2.1, 2.1, 2, T);
      ctx.lineWidth = 1.2;
      for (let n = 1; n <= 14; n++) {
        const S = (x) => { let s = 0, t = 1; for (let k = 0; k <= n; k++) { s += t; t *= -x * x; } return s; };
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.25 + 0.045 * n;
        curve(ctx, clip(S, 2.6), -2.1, 2.1, 500, T);
      }
      ctx.globalAlpha = 1; ctx.strokeStyle = c.b; ctx.lineWidth = 2;
      curve(ctx, (x) => 1 / (1 + x * x), -2.1, 2.1, 300, T);
    },
    // 04 — level curves of x^3 - 3x + y^2: a minimum at (1,0) and a saddle at (-1,0)
    saddle(ctx, w, h, c) {
      const ar = w / h, T = frame(w, h, -2.5, 2.5, -2.5 / ar, 2.5 / ar);
      const g = (x) => x * x * x - 3 * x;
      ctx.lineWidth = 1.15;
      for (let k = -8; k <= 12; k++) {
        const lvl = k * 0.45;
        ctx.strokeStyle = Math.abs(lvl - 2) < 1e-9 ? c.b : c.a;
        ctx.globalAlpha = Math.abs(lvl - 2) < 1e-9 ? 1 : 0.55;
        [1, -1].forEach((s) => curve(ctx, (x) => { const r = lvl - g(x); return r < 0 ? NaN : s * Math.sqrt(r); }, -2.5, 2.5, 900, T));
      }
      ctx.globalAlpha = 1; ctx.fillStyle = c.b;
      dot(ctx, T, 1, 0, 3.5); dot(ctx, T, -1, 0, 3.5);
    },
    // 05 — a wiggly function trapped inside Lipschitz cones of slope ±L
    lipschitz(ctx, w, h, c) {
      const T = frame(w, h, -4.2, 4.2, -2.2, 2.2);
      const f = (x) => 0.6 * Math.sin(1.3 * x) + 0.25 * Math.sin(3.1 * x);
      const L = 1.6;
      ctx.lineWidth = 1;
      [-3.2, -1.6, 0, 1.6, 3.2].forEach((a, j) => {
        ctx.strokeStyle = j === 2 ? c.b : c.faint2; ctx.globalAlpha = j === 2 ? 0.9 : 1;
        const fa = f(a);
        curve(ctx, (x) => fa + L * Math.abs(x - a), -4.2, 4.2, 4, T);
        curve(ctx, (x) => fa - L * Math.abs(x - a), -4.2, 4.2, 4, T);
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = c.a; ctx.lineWidth = 2;
      curve(ctx, f, -4.2, 4.2, 600, T);
      ctx.fillStyle = c.b; dot(ctx, T, 0, f(0), 3.5);
    },
    // exam cover — damped sine family
    exam(ctx, w, h, c) {
      const T = frame(w, h, 0, 10, -1.3, 1.3);
      ctx.lineWidth = 1.1;
      for (let k = 0; k < 9; k++) {
        ctx.strokeStyle = k === 4 ? c.b : c.a;
        curve(ctx, (x) => Math.exp(-0.08 * x) * Math.sin(x * (0.9 + k * 0.08) + k * 0.4) * (0.35 + k * 0.08), 0, 10, 300, T);
      }
    },
  });
})();
