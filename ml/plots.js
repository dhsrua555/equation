/* 기계 학습 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param } = window.EMPlots.util;
  function line(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  function dot(ctx, T, x, y, r) { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), r, 0, TAU); ctx.fill(); }
  function ring(ctx, T, x, y, r) { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), r, 0, TAU); ctx.stroke(); }
  // deterministic pseudo-noise in [-1, 1]
  const noise = (k) => { const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453; return 2 * (s - Math.floor(s)) - 1; };
  const axes = (ctx, T, c, x0, x1, y0, y1) => { ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, x0, 0, x1, 0); line(ctx, T, 0, y0, 0, y1); };
  const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };

  window.EMPlots.add({
    // 01 — realizable finite-class bound eps(m) = ln(|H|/delta)/m for growing |H|
    finite(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -40 * asp, 900 * asp, -0.05, 1.05);
      axes(ctx, T, c, -40 * asp, 900 * asp, -0.05, 1.05);
      [10, 100, 1e3, 1e4, 1e6, 1e9, 1e12].forEach((H, i) => {
        ctx.strokeStyle = i === 3 ? c.b : c.a; ctx.lineWidth = i === 3 ? 1.9 : 1.1;
        curve(ctx, (m) => Math.min(Math.log(H / 0.05) / m, 1.2), 2, 900 * asp, 600, T);
      });
    },
    // 02 — conditional probabilities eta(x) and the Bayes error min(eta, 1 - eta)
    bayes(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -0.08, 1.08);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -9, 0.5, 9, 0.5); line(ctx, T, 0, -0.1, 0, 1.1);
      [0.6, 0.9, 1.4, 2.2, 3.5].forEach((k, i) => {
        const eta = (x) => 1 / (1 + Math.exp(-k * x));
        ctx.strokeStyle = c.a; ctx.lineWidth = 1; ctx.globalAlpha = 0.45 + 0.1 * i;
        curve(ctx, eta, -9, 9, 400, T);
        ctx.strokeStyle = c.b; ctx.lineWidth = i === 2 ? 1.9 : 1;
        curve(ctx, (x) => Math.min(eta(x), 1 - eta(x)), -9, 9, 400, T);
      });
      ctx.globalAlpha = 1;
    },
    // 03 — Hoeffding tails 2exp(-2 m t^2) for growing m
    hoeffding(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.6 * asp, 0.6 * asp, -0.06, 1.1);
      axes(ctx, T, c, -1, 1, -0.06, 1.1);
      [2, 4, 8, 16, 32, 64, 128].forEach((m, i) => {
        ctx.strokeStyle = i === 3 ? c.b : c.a; ctx.lineWidth = i === 3 ? 1.9 : 1.1;
        curve(ctx, (t) => Math.min(1, 2 * Math.exp(-2 * m * t * t)), -1, 1, 500, T);
      });
    },
    // 04 — approximation error falls, estimation error rises, their sum has a floor
    tradeoff(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, 10 * asp / 1.3, -0.05, 1.1);
      axes(ctx, T, c, -1, 20, -0.05, 1.1);
      const app = (x) => 0.85 * Math.exp(-0.55 * x) + 0.05, est = (m) => (x) => Math.min(1.2, (0.04 * x * x) / m + 0.02);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.4; curve(ctx, app, 0, 20, 300, T);
      [0.6, 1, 1.6, 2.6, 4.2].forEach((m, i) => {
        ctx.strokeStyle = c.a; ctx.lineWidth = 1; ctx.globalAlpha = 0.5; curve(ctx, est(m), 0, 20, 300, T);
        ctx.globalAlpha = 1; ctx.strokeStyle = c.b; ctx.lineWidth = i === 2 ? 1.9 : 1;
        curve(ctx, (x) => app(x) + est(m)(x), 0, 20, 300, T);
      });
    },
    // 05 — growth function: 2^m against Sauer's bound sum_{i<=d} C(m, i), on a log scale
    vcgrowth(ctx, w, h, c) {
      const asp = w / h, M = 14 * asp / 1.3, T = frame(w, h, -0.5, M, -0.6, 12);
      axes(ctx, T, c, -0.5, M, -0.6, 12);
      const lg = (v) => Math.log2(v);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (m) => m, 0, M, 200, T);
      [1, 2, 3, 4, 5, 6].forEach((d) => {
        ctx.strokeStyle = c.a; ctx.lineWidth = 1.1;
        curve(ctx, (m) => { let s = 0; for (let i = 0; i <= d; i++) s += choose(m, i); return lg(Math.max(s, 1)); }, 0, M, 300, T);
      });
      ctx.fillStyle = c.b;
      for (let m = 0; m <= Math.floor(M); m++) dot(ctx, T, m, m, 2.2);
    },
    // 06 — structural risk minimization: empirical risk falls with n, the penalty rises
    srm(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.5, 12 * asp / 1.3, -0.05, 1.05);
      axes(ctx, T, c, -1, 20, -0.05, 1.05);
      const emp = (n) => 0.75 * Math.exp(-0.45 * n) + 0.04;
      const pen = (m) => (n) => Math.sqrt((n * Math.log(2) + 2 * Math.log(n + 1) + 3) / (2 * m));
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.4; curve(ctx, emp, 0, 20, 300, T);
      [40, 80, 160, 320, 640].forEach((m, i) => {
        ctx.strokeStyle = c.b; ctx.lineWidth = i === 2 ? 1.9 : 1; ctx.globalAlpha = 0.5 + 0.1 * i;
        curve(ctx, (n) => emp(n) + pen(m)(n), 0, 20, 300, T);
      });
      ctx.globalAlpha = 1; ctx.fillStyle = c.a;
      for (let n = 1; n < 20; n++) dot(ctx, T, n, emp(n), 2);
    },
    // 07 — perceptron: separating lines that turn toward a separator of two point clouds
    halfspace(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.3 * asp, 1.3 * asp, -1.3, 1.3);
      const pts = [];
      for (let k = 0; k < 40; k++) { const s = k % 2 ? 1 : -1; pts.push([0.55 * s + 0.35 * noise(k) * asp, 0.3 * s + 0.45 * noise(k + 50), s]); }
      for (let k = 0; k < 9; k++) {
        const a = -0.2 + (k / 8) * 1.25, nx = Math.cos(a), ny = Math.sin(a);
        ctx.strokeStyle = k === 8 ? c.b : c.a; ctx.lineWidth = k === 8 ? 1.9 : 1; ctx.globalAlpha = 0.35 + 0.08 * k;
        line(ctx, T, -3 * ny, 3 * nx, 3 * ny, -3 * nx);
      }
      ctx.globalAlpha = 1;
      pts.forEach(([x, y, s]) => { if (s > 0) { ctx.fillStyle = c.a; dot(ctx, T, x, y, 2.6); } else { ctx.strokeStyle = c.b; ctx.lineWidth = 1.2; ring(ctx, T, x, y, 2.8); } });
    },
    // 08 — boosting: exp(-2 gamma^2 T) training-error bounds for several edges gamma
    boost(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2, 60 * asp / 1.3, -0.05, 1.05);
      axes(ctx, T, c, -2, 100, -0.05, 1.05);
      [0.05, 0.08, 0.12, 0.17, 0.24, 0.33].forEach((g, i) => {
        ctx.strokeStyle = i === 2 ? c.b : c.a; ctx.lineWidth = i === 2 ? 1.9 : 1.1;
        curve(ctx, (t) => Math.exp(-2 * g * g * t), 0, 100, 400, T);
      });
      ctx.fillStyle = c.b;
      for (let t = 1; t < 100; t += 3) dot(ctx, T, t, Math.exp(-2 * 0.0144 * t) * (0.55 + 0.25 * Math.abs(noise(t))), 1.6);
    },
    // 09 — convex, Lipschitz and smooth: a convex curve under its chords, over its tangents
    convex(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2 * asp, 2 * asp, -0.4, 3.6);
      const f = (x) => Math.log(1 + Math.exp(2 * x)) - 0.4 * x;
      const df = (x) => 2 / (1 + Math.exp(-2 * x)) - 0.4;
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, f, -6, 6, 400, T);
      [-1.6, -1, -0.5, 0, 0.5, 1, 1.6].forEach((x0) => {
        ctx.strokeStyle = c.a; ctx.lineWidth = 1; curve(ctx, (x) => f(x0) + df(x0) * (x - x0), -6, 6, 2, T);
      });
      ctx.strokeStyle = c.faint2; ctx.lineWidth = 1;
      [[-1.8, 0.4], [-0.9, 1.3], [-0.2, 1.7]].forEach(([a, b]) => line(ctx, T, a, f(a), b, f(b)));
    },
    // 10 — ridge regularization path: coefficients shrink toward 0 as lambda grows
    ridge(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -4.2, 4.2 + 3 * (asp - 1), -1.25, 1.25);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -10, 0, 10, 0);
      const coef = [1.05, -0.8, 0.62, -0.45, 0.3, 0.9, -1.1, 0.15];
      const eig = [0.3, 1.2, 0.08, 3, 0.6, 0.02, 1.8, 0.9];
      coef.forEach((b, i) => {
        ctx.strokeStyle = i === 1 ? c.b : c.a; ctx.lineWidth = i === 1 ? 1.9 : 1.1;
        curve(ctx, (L) => (b * eig[i]) / (eig[i] + Math.exp(L)), -10, 10, 300, T);
      });
    },
    // 11 — SGD on elongated level sets: a noisy path and the averaged iterate
    sgd(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.2 * asp, 2.2 * asp, -2.2, 2.2);
      ctx.strokeStyle = c.faint2; ctx.lineWidth = 1;
      [0.3, 0.6, 0.95, 1.35, 1.8, 2.3, 2.9].forEach((r) => param(ctx, (t) => 1.9 * r * Math.cos(t), (t) => 0.7 * r * Math.sin(t), 0, TAU, 160, T));
      let x = -2.8, y = 1.4, ax = 0, ay = 0;
      const path = [[x, y]], avg = [];
      for (let k = 1; k <= 80; k++) {
        const eta = 0.35 / Math.sqrt(k);
        x -= eta * (x / 3.6 + 0.9 * noise(k)); y -= eta * (y / 0.5 * 0.9 + 0.9 * noise(k + 99));
        path.push([x, y]); ax += (x - ax) / k; ay += (y - ay) / k; avg.push([ax, ay]);
      }
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.1; ctx.beginPath(); path.forEach(([px, py], i) => (i ? ctx.lineTo(T.X(px), T.Y(py)) : ctx.moveTo(T.X(px), T.Y(py)))); ctx.stroke();
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; ctx.beginPath(); avg.forEach(([px, py], i) => (i ? ctx.lineTo(T.X(px), T.Y(py)) : ctx.moveTo(T.X(px), T.Y(py)))); ctx.stroke();
    },
    // 12 — hinge loss max(0, 1 - z) over the 0-1 loss, with ramp and logistic cousins
    hinge(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.4 * asp / 1.3, 2.6 * asp / 1.3, -0.25, 3.2);
      axes(ctx, T, c, -9, 9, -0.25, 3.2);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(T.X(-9), T.Y(1)); ctx.lineTo(T.X(0), T.Y(1)); ctx.moveTo(T.X(0), T.Y(0)); ctx.lineTo(T.X(9), T.Y(0)); ctx.stroke();
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (z) => Math.max(0, 1 - z), -9, 9, 400, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1;
      [0.5, 1, 2].forEach((s) => curve(ctx, (z) => Math.log(1 + Math.exp(-z / s)) / Math.log(1 + Math.exp(0)) * 0.7 * s, -9, 9, 400, T));
      curve(ctx, (z) => Math.min(1, Math.max(0, 1 - z)), -9, 9, 400, T);
    },
    // 13 — representer theorem: f = sum_i alpha_i K(x_i, .) with Gaussian kernels
    rbf(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3.2 * asp, 3.2 * asp, -1.4, 1.6);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -20, 0, 20, 0);
      const xs = [], al = [];
      for (let k = 0; k < 11; k++) { xs.push(-3 * asp + (k / 10) * 6 * asp + 0.2 * noise(k)); al.push(0.9 * noise(k + 17)); }
      const K = (a, b, s) => Math.exp(-((a - b) * (a - b)) / (2 * s * s));
      ctx.strokeStyle = c.a; ctx.lineWidth = 1;
      xs.forEach((x0, i) => curve(ctx, (x) => al[i] * K(x, x0, 0.45), -20, 20, 500, T));
      [0.3, 0.45, 0.7].forEach((s, j) => {
        ctx.strokeStyle = c.b; ctx.lineWidth = j === 1 ? 1.9 : 0.9;
        curve(ctx, (x) => xs.reduce((acc, x0, i) => acc + al[i] * K(x, x0, s), 0), -20, 20, 600, T);
      });
      ctx.fillStyle = c.b; xs.forEach((x0, i) => dot(ctx, T, x0, 0, 2));
    },
    // 14 — multiclass: linear scores <w_y, x> and their upper envelope argmax_y
    multiclass(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -3, 3.4);
      const W = [[-0.9, 0.2], [0.1, 1.1], [0.8, -0.3], [1.4, -2.1], [-1.6, -1.8]];
      ctx.strokeStyle = c.a; ctx.lineWidth = 1;
      W.forEach(([a, b]) => curve(ctx, (x) => a * x + b, -20, 20, 2, T));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9;
      curve(ctx, (x) => Math.max(...W.map(([a, b]) => a * x + b)), -20, 20, 800, T);
    },
    // 15 — impurity measures of a split: Gini, entropy, misclassification
    impurity(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, 0.5 - 0.6 * asp, 0.5 + 0.6 * asp, -0.05, 1.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -2, 0, 3, 0); line(ctx, T, 0.5, 0, 0.5, 1.1);
      const H = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, H, 0, 1, 300, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.3; curve(ctx, (p) => 4 * p * (1 - p) * 0.5 * 2, 0, 1, 300, T);
      curve(ctx, (p) => 2 * Math.min(p, 1 - p), 0, 1, 300, T);
      ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
      [0.25, 0.5, 0.75].forEach((s) => curve(ctx, (p) => s * H(p), 0, 1, 300, T));
      ctx.globalAlpha = 1;
    },
    // 16 — weighted majority: expert weights exp(-eta * mistakes) decaying at different rates
    wm(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2, 60 * asp / 1.3, -0.05, 1.08);
      axes(ctx, T, c, -2, 100, -0.05, 1.08);
      [0.02, 0.05, 0.1, 0.18, 0.3, 0.45].forEach((r, i) => {
        ctx.strokeStyle = i === 0 ? c.b : c.a; ctx.lineWidth = i === 0 ? 1.9 : 1.1;
        ctx.beginPath(); let wt = 1, mist = 0;
        for (let t = 0; t <= 100; t++) {
          if (Math.abs(noise(t * 7 + i)) < r * 1.8) mist++;
          wt = Math.exp(-0.25 * mist);
          t ? ctx.lineTo(T.X(t), T.Y(wt)) : ctx.moveTo(T.X(t), T.Y(wt));
        }
        ctx.stroke();
      });
    },
    // 17 — k-means: three clouds, their centroids and the Voronoi boundaries
    kmeans(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.4 * asp, 1.4 * asp, -1.4, 1.4);
      const C = [[-0.8 * asp, 0.45], [0.75 * asp, 0.55], [0.05, -0.7]];
      ctx.strokeStyle = c.faint2; ctx.lineWidth = 1;
      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const cen = [(C[0][0] + C[1][0] + C[2][0]) / 3, (C[0][1] + C[1][1] + C[2][1]) / 3];
      [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => { const m = mid(C[i], C[j]); const dx = m[0] - cen[0], dy = m[1] - cen[1]; line(ctx, T, cen[0], cen[1], cen[0] + 6 * dx, cen[1] + 6 * dy); });
      C.forEach(([cx, cy], j) => {
        for (let k = 0; k < 26; k++) {
          const r = 0.42 * Math.sqrt(Math.abs(noise(k + 31 * j))), a = TAU * Math.abs(noise(k * 3 + j));
          ctx.fillStyle = j === 1 ? c.b : c.a; dot(ctx, T, cx + r * Math.cos(a), cy + 0.8 * r * Math.sin(a), 2.1);
        }
        ctx.strokeStyle = c.b; ctx.lineWidth = 1.6; ring(ctx, T, cx, cy, 6);
      });
    },
    // 18 — PCA: an elongated cloud with its principal axes and the projections on the first
    pca(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2 * asp, 2 * asp, -2, 2);
      const a = 0.5, u = [Math.cos(a), Math.sin(a)], v = [-Math.sin(a), Math.cos(a)];
      ctx.strokeStyle = c.faint2; ctx.lineWidth = 1;
      [0.5, 1, 1.5, 2].forEach((r) => param(ctx, (t) => 1.6 * r * Math.cos(t) * u[0] + 0.45 * r * Math.sin(t) * v[0], (t) => 1.6 * r * Math.cos(t) * u[1] + 0.45 * r * Math.sin(t) * v[1], 0, TAU, 120, T));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; line(ctx, T, -4 * u[0], -4 * u[1], 4 * u[0], 4 * u[1]);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.1; line(ctx, T, -1.2 * v[0], -1.2 * v[1], 1.2 * v[0], 1.2 * v[1]);
      for (let k = 0; k < 34; k++) {
        const s = 1.25 * noise(k), t = 0.38 * noise(k + 70), px = s * u[0] + t * v[0], py = s * u[1] + t * v[1];
        ctx.strokeStyle = c.faint2; ctx.lineWidth = 1; line(ctx, T, px, py, s * u[0], s * u[1]);
        ctx.fillStyle = c.a; dot(ctx, T, px, py, 2.1);
      }
    },
  });
})();
