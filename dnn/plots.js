/* 심층 신경망 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve } = window.EMPlots.util;
  function line(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  function dot(ctx, T, x, y, r) { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), r, 0, TAU); ctx.fill(); }
  function ring(ctx, T, x, y, r) { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), r, 0, TAU); ctx.stroke(); }
  // deterministic pseudo-noise in [-1, 1]
  const noise = (k) => { const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453; return 2 * (s - Math.floor(s)) - 1; };
  const lgamma = (z) => {
    // Lanczos approximation, good enough for plotting Beta densities
    const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * z))) - lgamma(1 - z);
    z -= 1; let x = c[0];
    for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
    const t = z + g + 0.5;
    return 0.5 * Math.log(TAU) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  };
  const betaPdf = (a, b) => { const lb = lgamma(a) + lgamma(b) - lgamma(a + b); return (x) => (x <= 0 || x >= 1 ? 0 : Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - lb)); };
  function solve(A, y) {
    // Gaussian elimination with partial pivoting (small systems only)
    const n = y.length, M = A.map((r, i) => r.concat([y[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    return x;
  }

  window.EMPlots.add({
    // 01 — least squares: data around a line and lines rotated about the centroid
    lsq(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.2 * asp, 1.2 * asp, -0.15, 1.15);
      const pts = [];
      for (let k = 0; k < 26; k++) { const x = 0.04 + (k / 25) * 0.92 * asp; pts.push([x, 0.18 + 0.55 * (x / asp) + 0.09 * noise(k + 3)]); }
      const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length, my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const sxy = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0), sxx = pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
      const b1 = sxy / sxx;
      ctx.lineWidth = 1;
      for (let k = -7; k <= 7; k++) {
        if (!k) continue;
        const m = b1 + k * 0.09;
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.25 + 0.05 * (7 - Math.abs(k));
        line(ctx, T, -0.3 * asp, my + m * (-0.3 * asp - mx), 1.3 * asp, my + m * (1.3 * asp - mx));
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.faint; pts.forEach(([x, y]) => line(ctx, T, x, y, x, my + b1 * (x - mx)));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.8;
      line(ctx, T, -0.3 * asp, my + b1 * (-0.3 * asp - mx), 1.3 * asp, my + b1 * (1.3 * asp - mx));
      ctx.fillStyle = c.a; pts.forEach(([x, y]) => dot(ctx, T, x, y, 2.4));
    },
    // 02 — Beta posteriors of a coin with 70% heads as the number of tosses grows
    beta(ctx, w, h, c) {
      const T = frame(w, h, -0.02, 1.02, -0.4, 9.5);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 1, 0);
      [0, 2, 4, 8, 14, 22, 34, 50, 80].forEach((n, k) => {
        const S = Math.round(0.7 * n);
        ctx.strokeStyle = k === 5 ? c.b : c.a; ctx.lineWidth = k === 5 ? 1.8 : 1.15;
        ctx.globalAlpha = 0.45 + 0.06 * k;
        curve(ctx, betaPdf(S + 1, n - S + 1), 0.001, 0.999, 400, T);
      });
      ctx.globalAlpha = 1;
    },
    // 03 — binary entropy (bold) and KL(p‖q) for several q
    entropy(ctx, w, h, c) {
      const T = frame(w, h, -0.03, 1.03, -0.08, 1.35);
      const lg = (x) => Math.log(x) / Math.LN2;
      const H = (p) => (p <= 0 || p >= 1 ? 0 : -p * lg(p) - (1 - p) * lg(1 - p));
      ctx.lineWidth = 1.1;
      [0.1, 0.25, 0.4, 0.6, 0.75, 0.9].forEach((q) => {
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.7;
        curve(ctx, (p) => { const v = (p > 0 ? p * lg(p / q) : 0) + (p < 1 ? (1 - p) * lg((1 - p) / (1 - q)) : 0); return v > 1.5 ? NaN : v; }, 0.0005, 0.9995, 400, T);
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, H, 0.0005, 0.9995, 400, T);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 1, 0);
    },
    // 04 — M = 9 polynomial fits of sin(2πx) with ridge penalties of decreasing strength
    ridge(ctx, w, h, c) {
      const T = frame(w, h, -0.04, 1.04, -1.9, 1.9);
      const xs = [], ts = [];
      for (let k = 0; k < 10; k++) { const x = k / 9; xs.push(x); ts.push(Math.sin(TAU * x) + 0.28 * noise(k + 11)); }
      const M = 9, phi = (x) => Array.from({ length: M + 1 }, (_, j) => x ** j);
      const fit = (lam) => {
        const A = Array.from({ length: M + 1 }, (_, i) => Array.from({ length: M + 1 }, (_, j) => xs.reduce((s, x) => s + phi(x)[i] * phi(x)[j], 0) + (i === j ? lam : 0)));
        const y = Array.from({ length: M + 1 }, (_, i) => xs.reduce((s, x, n) => s + phi(x)[i] * ts[n], 0));
        const b = solve(A, y);
        return (x) => phi(x).reduce((s, v, j) => s + v * b[j], 0);
      };
      ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, (x) => Math.sin(TAU * x), -0.04, 1.04, 300, T);
      ctx.lineWidth = 1.15;
      [1e-7, 1e-5, 1e-3, 1e-2, 1e-1, 1].forEach((lam, k) => {
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.35 + 0.1 * k;
        const f = fit(lam);
        curve(ctx, (x) => { const v = f(x); return Math.abs(v) > 2.2 ? NaN : v; }, -0.03, 1.03, 400, T);
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.b; xs.forEach((x, k) => dot(ctx, T, x, ts[k], 2.6));
    },
    // 05 — logistic sigmoids with different slopes
    sigmoid(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -6 * asp / 1.4, 6 * asp / 1.4, -0.12, 1.12);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      line(ctx, T, -20, 0.5, 20, 0.5); line(ctx, T, 0, -0.12, 0, 1.12); line(ctx, T, -20, 0, 20, 0); line(ctx, T, -20, 1, 20, 1);
      [0.25, 0.4, 0.6, 0.8, 1.2, 1.7, 2.5, 4, 7].forEach((k, i) => {
        ctx.strokeStyle = i === 4 ? c.b : c.a; ctx.lineWidth = i === 4 ? 1.9 : 1.1;
        curve(ctx, (x) => 1 / (1 + Math.exp(-k * x)), -20, 20, 500, T);
      });
    },
    // 06 — softmax probabilities of three classes along a line, at several temperatures
    softmax(ctx, w, h, c) {
      const T = frame(w, h, -4, 4, -0.08, 1.08);
      const sm = (x, t, k) => { const z = [-1.4 * x, 0.9, 1.4 * x].map((v) => v / t); const m = Math.max(...z); const e = z.map((v) => Math.exp(v - m)); return e[k] / (e[0] + e[1] + e[2]); };
      [2.2, 1.4, 0.9, 0.55].forEach((t, i) => {
        [0, 1, 2].forEach((k) => {
          ctx.strokeStyle = k === 1 ? c.b : c.a; ctx.lineWidth = i === 2 ? 1.8 : 1; ctx.globalAlpha = 0.35 + 0.2 * i;
          curve(ctx, (x) => sm(x, t, k), -4, 4, 300, T);
        });
      });
      ctx.globalAlpha = 1;
    },
    // 07 — maximum-margin hyperplane with the two margin lines and support vectors
    margin(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.6 * asp, 1.6 * asp, -1.6, 1.6);
      const n = [0.6, 0.8], d = (x, y) => n[0] * x + n[1] * y;
      const L = (off) => { const t = 4 * asp; line(ctx, T, off * n[0] - t * n[1], off * n[1] + t * n[0], off * n[0] + t * n[1], off * n[1] - t * n[0]); };
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let k = -8; k <= 8; k++) if (Math.abs(k) > 1) L(k * 0.25);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; ctx.setLineDash([5, 5]); L(0.45); L(-0.45); ctx.setLineDash([]);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; L(0);
      for (let k = 0; k < 34; k++) {
        const x = 1.5 * asp * noise(k + 40), y = 1.45 * noise(k + 90), s = d(x, y);
        if (Math.abs(s) < 0.5) continue;
        if (s > 0) { ctx.fillStyle = c.a; dot(ctx, T, x, y, 3); } else { ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; ring(ctx, T, x, y, 3.2); }
      }
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.5;
      [[0.45, -0.6], [0.45, 0.9], [-0.45, 0.2]].forEach(([off, t]) => ring(ctx, T, off * n[0] - t * n[1], off * n[1] + t * n[0], 6));
    },
    // 08 — activation functions: ReLU (bold), leaky ReLU, ELU, tanh, sigmoid
    activation(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp / 1.3, 3 * asp / 1.3, -1.4, 3);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -10, 0, 10, 0); line(ctx, T, 0, -2, 0, 4);
      ctx.lineWidth = 1.2; ctx.strokeStyle = c.a;
      curve(ctx, Math.tanh, -10, 10, 400, T);
      curve(ctx, (x) => 1 / (1 + Math.exp(-x)), -10, 10, 400, T);
      curve(ctx, (x) => (x > 0 ? x : 0.1 * x), -10, 10, 400, T);
      curve(ctx, (x) => (x > 0 ? x : Math.exp(x) - 1), -10, 10, 400, T);
      ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, (x) => Math.max(0, x), -10, 10, 400, T);
    },
    // 09 — a layered network; one backward path is highlighted
    graph(ctx, w, h, c) {
      const layers = [4, 6, 6, 5, 3], L = layers.length;
      const pos = layers.map((n, l) => Array.from({ length: n }, (_, i) => [w * (0.12 + (0.76 * l) / (L - 1)), h * (0.5 + ((i - (n - 1) / 2) * 0.72) / 6)]));
      ctx.lineWidth = 0.9;
      for (let l = 0; l < L - 1; l++) pos[l].forEach((p, i) => pos[l + 1].forEach((q, j) => {
        ctx.strokeStyle = (i + j + l) % 5 === 0 ? c.a : c.faint;
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }));
      const path = [1, 2, 4, 2, 1];
      ctx.strokeStyle = c.b; ctx.lineWidth = 2;
      ctx.beginPath(); path.forEach((i, l) => { const [x, y] = pos[l][i]; l ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
      pos.forEach((col, l) => col.forEach(([x, y], i) => {
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU);
        ctx.fillStyle = getComputedStyle(ctx.canvas).getPropertyValue('--paper-2') || '#fff'; ctx.fill();
        ctx.strokeStyle = path[l] === i ? c.b : c.a; ctx.lineWidth = path[l] === i ? 2 : 1.2; ctx.stroke();
      }));
    },
    // 10 — gradient descent (smooth) and stochastic gradient descent (noisy) on elliptic contours
    sgd(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.2 * asp, 2.2 * asp, -2.2, 2.2);
      const A = 0.25, B = 2.2;
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let k = 1; k <= 11; k++) { const r = 0.22 * k; ctx.beginPath(); for (let t = 0; t <= 200; t++) { const u = (t / 200) * TAU; const x = (r / Math.sqrt(A)) * Math.cos(u), y = (r / Math.sqrt(B)) * Math.sin(u); t ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)); } ctx.stroke(); }
      const run = (x, y, eta, noisy, steps) => { const P2 = [[x, y]]; for (let k = 0; k < steps; k++) { const gx = 2 * A * x + (noisy ? 0.9 * noise(k + 7) : 0), gy = 2 * B * y + (noisy ? 0.9 * noise(k + 70) : 0); x -= eta * gx; y -= eta * gy; P2.push([x, y]); } return P2; };
      const draw = (P2) => { ctx.beginPath(); P2.forEach(([x, y], k) => (k ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)))); ctx.stroke(); };
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; draw(run(-3.4, 1.3, 0.2, true, 60));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; draw(run(-3.4, -1.3, 0.2, false, 40));
    },
    // 11 — activation distributions through six tanh layers: tiny init collapses, Xavier keeps its spread
    init(ctx, w, h, c) {
      const T = frame(w, h, -2.4, 2.4, -0.1, 4.2);
      const g = (s) => (x) => Math.exp(-(x * x) / (2 * s * s)) / (s * Math.sqrt(TAU));
      ctx.lineWidth = 1.1;
      [0.49, 0.29, 0.18, 0.11].forEach((s, k) => { ctx.strokeStyle = c.a; ctx.globalAlpha = 0.9 - 0.15 * k; curve(ctx, (x) => { const v = g(s)(x); return v > 4.3 ? NaN : v; }, -2.4, 2.4, 500, T); });
      ctx.globalAlpha = 1;
      [0.63, 0.49, 0.41, 0.36, 0.32, 0.3].forEach((s, k) => { ctx.strokeStyle = c.b; ctx.lineWidth = k === 5 ? 1.9 : 1.1; ctx.globalAlpha = 0.5 + 0.1 * k; curve(ctx, g(s), -2.4, 2.4, 400, T); });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -3, 0, 3, 0);
    },
    // 12 — learning-rate schedules: step, cosine, linear, inverse square root, each after a warmup
    schedule(ctx, w, h, c) {
      const T = frame(w, h, -3, 103, -0.06, 1.12);
      const warm = (t, f) => (t < 8 ? t / 8 : f(t));
      ctx.lineWidth = 1.2; ctx.strokeStyle = c.a;
      curve(ctx, (t) => warm(t, (u) => (u < 30 ? 1 : u < 60 ? 0.3 : u < 90 ? 0.09 : 0.027)), 0, 100, 1000, T);
      curve(ctx, (t) => warm(t, (u) => 1 - (u - 8) / 92), 0, 100, 400, T);
      curve(ctx, (t) => warm(t, (u) => Math.sqrt(8 / u)), 0, 100, 400, T);
      ctx.strokeStyle = c.b; ctx.lineWidth = 2;
      curve(ctx, (t) => warm(t, (u) => 0.5 * (1 + Math.cos((Math.PI * (u - 8)) / 92))), 0, 100, 400, T);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -3, 0, 103, 0);
    },
    // 13 — descent lemma: a β-smooth function lies under the quadratic built at every point
    // 14: gradient descent zigzags on an ill-conditioned quadratic, momentum rolls through
    momentum(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.2 * asp, 2.2 * asp, -2.2, 2.2);
      const A = 0.1, B = 2.5; // f = A x² + B y²
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let k = 1; k <= 11; k++) { const r = 0.2 * k; ctx.beginPath(); for (let t = 0; t <= 200; t++) { const u = (t / 200) * TAU; const x = (r / Math.sqrt(A)) * Math.cos(u), y = (r / Math.sqrt(B)) * Math.sin(u); t ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)); } ctx.stroke(); }
      const draw = (P2) => { ctx.beginPath(); P2.forEach(([x, y], k) => (k ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)))); ctx.stroke(); };
      const gd = () => { let x = -2.7, y = 1.3; const P2 = [[x, y]]; for (let k = 0; k < 45; k++) { x -= 0.37 * 2 * A * x; y -= 0.37 * 2 * B * y; P2.push([x, y]); } return P2; };
      const hb = () => { let x = -2.7, y = -1.3, vx = 0, vy = 0; const P2 = [[x, y]]; for (let k = 0; k < 45; k++) { vx = 0.8 * vx - 0.08 * 2 * A * x; vy = 0.8 * vy - 0.08 * 2 * B * y; x += vx; y += vy; P2.push([x, y]); } return P2; };
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; draw(gd());
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; draw(hb());
    },
    descent(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3.2 * asp / 1.4, 3.2 * asp / 1.4, -1.6, 3.4);
      const f = (x) => 0.35 * x * x + 0.55 * Math.sin(2.2 * x) + 0.15 * Math.cos(5 * x) * 0.3;
      const df = (x) => 0.7 * x + 1.21 * Math.cos(2.2 * x) - 0.225 * Math.sin(5 * x);
      const beta = 4.6; // ≥ sup|f''| = 0.7 + 2.662 + 1.125
      ctx.lineWidth = 1.1;
      [-2.6, -1.8, -1.1, -0.4, 0.3, 1, 1.7, 2.4].forEach((x0) => {
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.75;
        curve(ctx, (y) => f(x0) + df(x0) * (y - x0) + (beta / 2) * (y - x0) ** 2, x0 - 1.4, x0 + 1.4, 200, T);
        ctx.fillStyle = c.a; dot(ctx, T, x0, f(x0), 2.4);
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, f, -6, 6, 500, T);
    },
    // exam covers
    exam(ctx, w, h, c) {
      const T = frame(w, h, 0, 10, -1.3, 1.3);
      ctx.lineWidth = 1.1;
      for (let k = 0; k < 9; k++) {
        ctx.strokeStyle = k === 4 ? c.b : c.a;
        curve(ctx, (x) => Math.tanh(1.2 * Math.sin(x * (0.9 + k * 0.08) + k * 0.4)) * (0.35 + k * 0.08), 0, 10, 300, T);
      }
    },
  });
})();
