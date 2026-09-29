/* 의료 인공지능 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param } = window.EMPlots.util;
  function line(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  function dot(ctx, T, x, y, r) { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), r, 0, TAU); ctx.fill(); }
  const noise = (k) => { const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453; return 2 * (s - Math.floor(s)) - 1; };
  const gauss = (m, s) => (x) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(TAU));
  // standard normal CDF (Abramowitz–Stegun 7.1.26)
  const Phi = (x) => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(x * x) / 2);
    return x >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
  };
  function solve(A, y) {
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
  // one heartbeat: P wave, QRS complex, T wave (period 1)
  const beat = (t) => {
    const u = t - Math.floor(t);
    return 0.12 * Math.exp(-((u - 0.18) ** 2) / 0.0012) - 0.12 * Math.exp(-((u - 0.36) ** 2) / 0.00012)
      + 1.0 * Math.exp(-((u - 0.4) ** 2) / 0.00018) - 0.22 * Math.exp(-((u - 0.44) ** 2) / 0.00015)
      + 0.28 * Math.exp(-((u - 0.68) ** 2) / 0.0035);
  };

  window.EMPlots.add({
    // 01 — electrocardiogram traces
    ecg(ctx, w, h, c) {
      const T = frame(w, h, 0, 4.2 * (w / h), -1.2, 5.2);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let k = -1; k <= 5; k++) line(ctx, T, 0, k, 40, k);
      [0.2, 1.6, 3.0, 4.4].forEach((y0, k) => {
        ctx.strokeStyle = k === 1 ? c.b : c.a; ctx.lineWidth = k === 1 ? 1.8 : 1.2;
        curve(ctx, (t) => y0 + 0.9 * beat(t * (0.9 + 0.08 * k) + 0.3 * k), 0, 40, 3000, T);
      });
    },
    // 02 — polynomial fits of sin(2πx) for M = 0, 1, 3, 9
    polyfit(ctx, w, h, c) {
      const T = frame(w, h, -0.04, 1.04, -1.7, 1.7);
      const xs = [], ts = [];
      for (let k = 0; k < 10; k++) { const x = k / 9; xs.push(x); ts.push(Math.sin(TAU * x) + 0.25 * noise(k + 5)); }
      const fit = (M) => {
        const phi = (x) => Array.from({ length: M + 1 }, (_, j) => x ** j);
        const A = Array.from({ length: M + 1 }, (_, i) => Array.from({ length: M + 1 }, (_, j) => xs.reduce((s, x) => s + phi(x)[i] * phi(x)[j], 0) + (i === j ? 1e-10 : 0)));
        const y = Array.from({ length: M + 1 }, (_, i) => xs.reduce((s, x, n) => s + phi(x)[i] * ts[n], 0));
        const b = solve(A, y);
        return (x) => phi(x).reduce((s, v, j) => s + v * b[j], 0);
      };
      ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, (x) => Math.sin(TAU * x), -0.04, 1.04, 300, T);
      [0, 1, 3, 9].forEach((M, k) => {
        const f = fit(M);
        ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.45 + 0.15 * k;
        curve(ctx, (x) => { const v = f(x); return Math.abs(v) > 1.9 ? NaN : v; }, -0.02, 1.02, 500, T);
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.b; xs.forEach((x, k) => dot(ctx, T, x, ts[k], 2.8));
    },
    // 03 — ROC curves of a screening test for increasing separation between the two groups
    roc(ctx, w, h, c) {
      const s = Math.min(w, h), ox = (w - s) / 2, oy = (h - s) / 2;
      const T = { X: (x) => ox + s * (0.06 + 0.88 * x), Y: (y) => oy + s * (0.94 - 0.88 * y) };
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      line(ctx, T, 0, 0, 1, 0); line(ctx, T, 0, 0, 0, 1); line(ctx, T, 1, 0, 1, 1); line(ctx, T, 0, 1, 1, 1);
      ctx.setLineDash([4, 4]); line(ctx, T, 0, 0, 1, 1); ctx.setLineDash([]);
      [0.4, 0.8, 1.2, 1.7, 2.3, 3.0].forEach((d, k) => {
        ctx.strokeStyle = k === 3 ? c.b : c.a; ctx.lineWidth = k === 3 ? 1.9 : 1.1;
        param(ctx, (t) => 1 - Phi(t), (t) => 1 - Phi(t - d), -5, 7, 300, T);
      });
    },
    // 04 — Gaussian densities with several means and variances
    gauss(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -4 * asp / 1.2, 4 * asp / 1.2, -0.04, 0.95);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -20, 0, 20, 0);
      [[-1.8, 1.4], [-1, 0.9], [0.4, 0.55], [1.3, 1.1], [2.2, 0.7], [0, 2]].forEach(([m, s2], k) => {
        ctx.strokeStyle = k === 2 ? c.b : c.a; ctx.lineWidth = k === 2 ? 1.9 : 1.15;
        curve(ctx, gauss(m, s2), -20, 20, 600, T);
      });
    },
    // 05 — a Gaussian pushed through a logistic map: the density's peak does not follow the curve
    transform(ctx, w, h, c) {
      const T = frame(w, h, -1.5, 10.5, -0.06, 1.06);
      const g = (x) => 1 / (1 + Math.exp(-(x - 5)));
      const px = gauss(6, 1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 10, 0); line(ctx, T, 0, 0, 0, 1);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.4; curve(ctx, g, 0, 10, 400, T);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.8; curve(ctx, (x) => 1.9 * px(x) / 1, 0, 10, 400, T);
      // p_y(y) = p_x(g^{-1}(y)) |dg^{-1}/dy|, drawn sideways along the y-axis
      const inv = (y) => 5 + Math.log(y / (1 - y));
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2;
      param(ctx, (y) => 0.25 * px(inv(y)) / (y * (1 - y)), (y) => y, 0.02, 0.995, 400, T);
      ctx.setLineDash([3, 4]); ctx.strokeStyle = c.faint2;
      line(ctx, T, 6, 0, 6, g(6)); line(ctx, T, 0, g(6), 6, g(6)); ctx.setLineDash([]);
    },
    // 06 — posterior over a mean becomes sharper as data accumulate
    posterior(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.2 * asp / 1.3, 2.2 * asp / 1.3, -0.1, 3.4);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -20, 0, 20, 0);
      [0, 1, 2, 5, 10, 20, 40].forEach((N, k) => {
        const s = 1 / Math.sqrt(1 + N * 1.2), m = (N * 0.8) / (N + 1.5);
        ctx.strokeStyle = k === 4 ? c.b : c.a; ctx.lineWidth = k === 4 ? 1.9 : 1.1; ctx.globalAlpha = 0.45 + 0.08 * k;
        curve(ctx, gauss(m, s), -20, 20, 600, T);
      });
      ctx.globalAlpha = 1;
    },
    // 07 — narrow valley: plain gradient descent zig-zags, momentum glides
    momentum(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.3 * asp, 2.3 * asp, -2.3, 2.3);
      const A = 0.12, B = 2.4;
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let k = 1; k <= 12; k++) { const r = 0.2 * k; param(ctx, (u) => (r / Math.sqrt(A)) * Math.cos(u), (u) => (r / Math.sqrt(B)) * Math.sin(u), 0, TAU, 160, T); }
      const path = (mu, eta, steps) => { let x = -3.6, y = 1.2, vx = 0, vy = 0; const P2 = [[x, y]]; for (let k = 0; k < steps; k++) { vx = mu * vx - eta * 2 * A * x; vy = mu * vy - eta * 2 * B * y; x += vx; y += vy; P2.push([x, y]); } return P2; };
      const draw = (P2) => { ctx.beginPath(); P2.forEach(([x, y], k) => (k ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)))); ctx.stroke(); };
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; draw(path(0, 0.38, 40));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; draw(path(0.75, 0.12, 40));
    },
    // 07 — a two-layer tanh network: three soft steps add up to a parabola
    univ(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.25 * asp / 1.4, 1.25 * asp / 1.4, -1.35, 1.35);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -9, 0, 9, 0); line(ctx, T, 0, -9, 0, 9);
      // x² on [-1,1] ≈ c0 + v·tanh(s(x − 0.55)) − v·tanh(s(x + 0.55)) + …; drawn schematically
      const units = [[2.6, -0.55, -1], [2.6, 0.55, 1], [1.2, 0, 0.35]];
      units.forEach(([s, m, v]) => {
        ctx.strokeStyle = c.a; ctx.lineWidth = 1.05; ctx.setLineDash([4, 4]);
        curve(ctx, (x) => v * Math.tanh(s * (x - m)), -9, 9, 500, T);
      });
      const net = (x) => 0.95 * (Math.tanh(2.6 * (x - 0.55)) - Math.tanh(2.6 * (x + 0.55))) / 2 + 0.9 + 0.08 * x;
      ctx.setLineDash([]); ctx.strokeStyle = c.b; ctx.lineWidth = 2;
      curve(ctx, net, -9, 9, 500, T);
      ctx.fillStyle = c.b;
      for (let k = 0; k <= 16; k++) { const x = -1 + k / 8; dot(ctx, T, x, net(x) + 0.05 * noise(k), 2.4); }
    },
    // 08 — many activations with different means and spreads, and the standardized result
    bn(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -6 * asp / 1.3, 6 * asp / 1.3, -0.04, 0.9);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -30, 0, 30, 0);
      [[-3.6, 1.5], [-2.1, 0.8], [2.6, 1.9], [3.9, 1.1], [1.2, 2.6], [-4.8, 0.9]].forEach(([m, s]) => {
        ctx.strokeStyle = c.a; ctx.lineWidth = 1.1; ctx.globalAlpha = 0.7; curve(ctx, gauss(m, s), -30, 30, 600, T);
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, gauss(0, 1), -30, 30, 600, T);
    },
    // 09 — a two-layer network with error signals flowing back
    backprop(ctx, w, h, c) {
      const layers = [3, 5, 5, 2], L = layers.length;
      const pos = layers.map((n, l) => Array.from({ length: n }, (_, i) => [w * (0.14 + (0.72 * l) / (L - 1)), h * (0.5 + ((i - (n - 1) / 2) * 0.7) / 5)]));
      ctx.lineWidth = 0.9;
      for (let l = 0; l < L - 1; l++) pos[l].forEach((p, i) => pos[l + 1].forEach((q, j) => {
        ctx.strokeStyle = (i * 3 + j + l) % 4 === 0 ? c.a : c.faint;
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      }));
      // backward arrows (error signals) from the last layer
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.8;
      [[3, 0, 2, 1], [3, 1, 2, 3], [2, 1, 1, 2], [2, 3, 1, 2], [1, 2, 0, 1]].forEach(([l1, i1, l0, i0]) => {
        const [x1, y1] = pos[l1][i1], [x0, y0] = pos[l0][i0];
        const mx = x1 + (x0 - x1) * 0.82, my = y1 + (y0 - y1) * 0.82;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(mx, my); ctx.stroke();
        const a = Math.atan2(my - y1, mx - x1);
        ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx - 7 * Math.cos(a - 0.4), my - 7 * Math.sin(a - 0.4)); ctx.moveTo(mx, my); ctx.lineTo(mx - 7 * Math.cos(a + 0.4), my - 7 * Math.sin(a + 0.4)); ctx.stroke();
      });
      const bg = getComputedStyle(ctx.canvas).getPropertyValue('--paper-2') || '#fff';
      pos.forEach((col) => col.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; ctx.stroke(); }));
    },
    // 10 — lasso diamond and ridge circle meeting the elliptic contours of the error
    lasso(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.6 * asp, 1.6 * asp, -1.4, 1.8);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -10, 0, 10, 0); line(ctx, T, 0, -10, 0, 10);
      const cx = 0.9, cy = 1.15, th = 0.7;
      for (let k = 1; k <= 8; k++) {
        const a = 0.16 * k, b = 0.08 * k;
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.9 - 0.07 * k;
        param(ctx, (u) => cx + a * Math.cos(u) * Math.cos(th) - b * Math.sin(u) * Math.sin(th), (u) => cy + a * Math.cos(u) * Math.sin(th) + b * Math.sin(u) * Math.cos(th), 0, TAU, 160, T);
      }
      ctx.globalAlpha = 1; ctx.strokeStyle = c.b; ctx.lineWidth = 1.9;
      param(ctx, (u) => 0.62 * Math.cos(u), (u) => 0.62 * Math.sin(u), 0, TAU, 160, T);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); [[0.62, 0], [0, 0.62], [-0.62, 0], [0, -0.62], [0.62, 0]].forEach(([x, y], k) => (k ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)))); ctx.stroke();
    },
    // 11 — double descent: test error falls, peaks at the interpolation threshold, then falls again
    doubledescent(ctx, w, h, c) {
      const T = frame(w, h, -0.3, 10.3, -0.05, 1.25);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 10, 0);
      ctx.setLineDash([4, 4]); line(ctx, T, 4, 0, 4, 1.2); ctx.setLineDash([]);
      [0.8, 1, 1.25].forEach((s, k) => {
        ctx.strokeStyle = k === 1 ? c.b : c.a; ctx.lineWidth = k === 1 ? 2 : 1.1;
        curve(ctx, (x) => 0.35 + 0.35 * Math.exp(-x * 0.9) + (0.55 * s) / (1 + ((x - 4) / (0.45 * s)) ** 2) - 0.018 * Math.max(0, x - 4) * s, 0, 10, 500, T);
      });
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; curve(ctx, (x) => (x < 4 ? 0.7 * Math.exp(-x * 0.55) - 0.08 * x / 4 : 0.02 + 0.0 * x), 0, 10, 500, T);
    },
    // 13 — 1-D sections of Gabor filters: Gaussian envelopes times sinusoids of rising frequency
    gabor(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3.2 * asp / 1.3, 3.2 * asp / 1.3, -1.25, 1.25);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -20, 0, 20, 0);
      [0.9, 1.6, 2.4, 3.3, 4.4].forEach((om, k) => {
        const s = 1.25 - 0.13 * k;
        ctx.strokeStyle = k === 2 ? c.b : c.a; ctx.lineWidth = k === 2 ? 1.9 : 1.05; ctx.globalAlpha = k === 2 ? 1 : 0.8;
        curve(ctx, (x) => Math.exp(-(x * x) / (2 * s * s)) * Math.sin(om * x + 0.3 * k), -20, 20, 900, T);
      });
      ctx.globalAlpha = 1; ctx.setLineDash([3, 4]); ctx.strokeStyle = c.faint2;
      curve(ctx, (x) => Math.exp(-(x * x) / (2 * 0.99 * 0.99)), -20, 20, 400, T); ctx.setLineDash([]);
    },
    // 14 — U-net: resolution falls then rises, skip connections join matching levels
    unet(ctx, w, h, c) {
      const levels = 5, cx = w / 2, top = h * 0.14, dy = (h * 0.66) / (levels - 1);
      const X = (l, side) => cx + side * (w * 0.42 - l * (w * 0.4) / (levels - 1));
      for (let l = 0; l < levels; l++) {
        const y = top + l * dy, bh = h * (0.2 - 0.03 * l);
        [-1, 1].forEach((side) => {
          if (l === levels - 1 && side === 1) return;
          const x = l === levels - 1 ? cx : X(l, side);
          ctx.strokeStyle = c.a; ctx.lineWidth = 1.2;
          for (let k = 0; k < 2; k++) ctx.strokeRect(x - 7 + k * 8 - 4, y - bh / 2, 6, bh);
        });
        if (l < levels - 1) {
          ctx.strokeStyle = c.b; ctx.lineWidth = 1.7;
          ctx.beginPath(); ctx.moveTo(X(l, -1) + 10, y); ctx.lineTo(X(l, 1) - 14, y); ctx.stroke();
          ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
          const y2 = top + (l + 1) * dy, xa = l + 1 === levels - 1 ? cx : X(l + 1, -1), xb = l + 1 === levels - 1 ? cx : X(l + 1, 1);
          ctx.beginPath(); ctx.moveTo(X(l, -1) + 4, y + h * 0.1); ctx.lineTo(xa - 6, y2 - h * 0.07); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(xb + 6, y2 - h * 0.07); ctx.lineTo(X(l, 1) - 4, y + h * 0.1); ctx.stroke();
        }
      }
    },
    // exam covers — a vital-sign line
    exam(ctx, w, h, c) {
      const T = frame(w, h, 0, 6, -1.4, 2.2);
      for (let k = 0; k < 5; k++) {
        ctx.strokeStyle = k === 2 ? c.b : c.a; ctx.lineWidth = k === 2 ? 1.6 : 1;
        curve(ctx, (t) => (k - 2) * 0.55 + 0.9 * beat(t * (1 + 0.1 * k) + 0.2 * k), 0, 6, 900, T);
      }
    },
  });
})();
