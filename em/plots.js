/* 공학수학 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param, trace } = window.EMPlots.util;
  function bessel(n, x) {
    let s = 0; const N = 120;
    for (let k = 0; k <= N; k++) {
      const t = (Math.PI * k) / N;
      const wgt = k === 0 || k === N ? 0.5 : 1;
      s += wgt * Math.cos(n * t - x * Math.sin(t));
    }
    return s / N;
  }

  window.EMPlots.add({
    // 01 — direction field of y' = x - y with solution curves
    slope(ctx, w, h, c) {
      const T = frame(w, h, -3, 5, -3, 5);
      const nx = Math.round(w / 26), ny = Math.round(h / 26);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
        const x = -3 + (8 * i) / nx, y = -3 + (8 * j) / ny;
        const m = x - y, L = 0.13, d = L / Math.sqrt(1 + m * m);
        ctx.beginPath(); ctx.moveTo(T.X(x - d), T.Y(y - m * d)); ctx.lineTo(T.X(x + d), T.Y(y + m * d)); ctx.stroke();
      }
      ctx.lineWidth = 1.4;
      [-6, -3, -1.5, -0.5, 0, 0.6, 1.5, 3, 6, 12].forEach((C, k) => {
        ctx.strokeStyle = k % 3 === 1 ? c.b : c.a;
        curve(ctx, (x) => x - 1 + C * Math.exp(-x), -3, 5, 200, T);
      });
    },
    // 02 — damped oscillations for several damping ratios
    damped(ctx, w, h, c) {
      const T = frame(w, h, 0, 16, -1.25, 1.25);
      ctx.lineWidth = 1.3;
      for (let k = 0; k < 11; k++) {
        const z = 0.04 + k * 0.035;
        ctx.strokeStyle = k % 4 === 2 ? c.b : c.a;
        ctx.globalAlpha = 0.35 + 0.06 * (11 - k);
        curve(ctx, (t) => Math.exp(-z * 2 * t) * Math.cos(2 * Math.sqrt(1 - z * z) * t), 0, 16, 500, T);
      }
      ctx.globalAlpha = 1;
    },
    // 03 — phase portrait: stable spiral
    phase(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.4 * asp, 2.4 * asp, -2.4, 2.4);
      const F = (x, y) => [-0.18 * x - y, x - 0.18 * y];
      ctx.lineWidth = 1.2;
      for (let k = 0; k < 14; k++) {
        const r = 2.6 + 0.9 * (k % 5), a = (k * TAU) / 14;
        ctx.strokeStyle = k % 4 === 0 ? c.b : c.a;
        ctx.globalAlpha = 0.55 + (k % 3) * 0.15;
        trace(ctx, F, r * Math.cos(a) * asp * 0.7, r * Math.sin(a), 0.03, 700, T);
      }
      ctx.globalAlpha = 1;
    },
    // 04 — Bessel functions J0..J3
    bessel(ctx, w, h, c) {
      const T = frame(w, h, 0, 22, -0.7, 1.15);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, T.Y(0)); ctx.lineTo(w, T.Y(0)); ctx.stroke();
      [0, 1, 2, 3, 4].forEach((n) => {
        ctx.strokeStyle = n === 1 ? c.b : c.a; ctx.lineWidth = n === 0 ? 1.8 : 1.2;
        curve(ctx, (x) => bessel(n, x), 0, 22, 360, T);
      });
    },
    // 05 — step responses of a second-order system (Laplace)
    laplace(ctx, w, h, c) {
      const T = frame(w, h, -0.5, 12, -0.15, 1.9);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(T.X(-0.5), T.Y(1)); ctx.lineTo(T.X(12), T.Y(1)); ctx.stroke();
      ctx.lineWidth = 1.3;
      [0.08, 0.15, 0.25, 0.35, 0.5, 0.7, 1.0, 1.6].forEach((z, k) => {
        ctx.strokeStyle = k === 3 ? c.b : c.a;
        const f = (t) => {
          if (t < 0) return 0;
          if (z < 1) {
            const wd = Math.sqrt(1 - z * z);
            return 1 - Math.exp(-z * t) * (Math.cos(wd * t) + (z / wd) * Math.sin(wd * t));
          }
          if (z === 1) return 1 - Math.exp(-t) * (1 + t);
          const s = Math.sqrt(z * z - 1), r1 = -z + s, r2 = -z - s;
          return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2);
        };
        curve(ctx, f, -0.5, 12, 400, T);
      });
    },
    // 06 — a linear map acting on the grid
    grid(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -4 * asp, 4 * asp, -4, 4);
      const A = [[1, 0.55], [0.25, 0.9]];
      const M = (x, y) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      for (let k = -12; k <= 12; k++) {
        param(ctx, () => k, (t) => t, -12, 12, 2, T);
        param(ctx, (t) => t, () => k, -12, 12, 2, T);
      }
      ctx.lineWidth = 1.3;
      for (let k = -12; k <= 12; k++) {
        ctx.strokeStyle = k === 0 ? c.b : c.a;
        param(ctx, (t) => M(k, t)[0], (t) => M(k, t)[1], -12, 12, 2, T);
        param(ctx, (t) => M(t, k)[0], (t) => M(t, k)[1], -12, 12, 2, T);
      }
    },
    // 07 — level sets of a quadratic form with its principal axes
    eigen(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -3, 3);
      const th = 0.52, a = 1, b = 0.42;
      ctx.lineWidth = 1.2;
      for (let k = 1; k <= 16; k++) {
        const r = 0.28 * k;
        ctx.strokeStyle = k % 5 === 0 ? c.b : c.a;
        param(ctx,
          (t) => r * (a * Math.cos(t) * Math.cos(th) - b * Math.sin(t) * Math.sin(th)),
          (t) => r * (a * Math.cos(t) * Math.sin(th) + b * Math.sin(t) * Math.cos(th)),
          0, TAU, 160, T);
      }
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.6;
      param(ctx, (t) => t * Math.cos(th), (t) => t * Math.sin(th), -8, 8, 2, T);
      param(ctx, (t) => -t * Math.sin(th), (t) => t * Math.cos(th), -8, 8, 2, T);
    },
    // 08 — gradient field of f = sin x cos y
    field(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, 0, 9 * asp, 0, 9);
      const n = Math.round(w / 30), m = Math.round(h / 30);
      for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) {
        const x = (9 * asp * i) / n, y = (9 * j) / m;
        const gx = Math.cos(x) * Math.cos(y), gy = -Math.sin(x) * Math.sin(y);
        const g = Math.hypot(gx, gy), L = 0.34 * g;
        if (g < 0.05) continue;
        const ux = gx / g, uy = gy / g;
        const x1 = x + ux * L, y1 = y + uy * L;
        ctx.strokeStyle = g > 0.75 ? c.b : c.a; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(T.X(x - ux * L), T.Y(y - uy * L)); ctx.lineTo(T.X(x1), T.Y(y1)); ctx.stroke();
        const ang = Math.atan2(-(uy), ux), hx = T.X(x1), hy = T.Y(y1);
        ctx.beginPath();
        ctx.moveTo(hx, hy); ctx.lineTo(hx - 5 * Math.cos(ang - 0.45), hy - 5 * Math.sin(ang - 0.45));
        ctx.moveTo(hx, hy); ctx.lineTo(hx - 5 * Math.cos(ang + 0.45), hy - 5 * Math.sin(ang + 0.45));
        ctx.stroke();
      }
    },
    // 09 — field lines and equipotentials of a source–sink pair (Apollonian circles)
    flow(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -3, 3);
      const a = 1;
      ctx.lineWidth = 1.2;
      [0.15, 0.3, 0.45, 0.6, 0.75, 0.88].forEach((k) => {
        const cx = (a * (1 + k * k)) / (1 - k * k), r = (2 * a * k) / (1 - k * k);
        ctx.strokeStyle = c.a;
        [1, -1].forEach((s) => param(ctx, (t) => s * cx + r * Math.cos(t), (t) => r * Math.sin(t), 0, TAU, 160, T));
      });
      [-3, -1.6, -0.9, -0.45, 0.45, 0.9, 1.6, 3].forEach((d, k) => {
        const r = Math.sqrt(a * a + d * d);
        ctx.strokeStyle = k % 3 === 0 ? c.b : c.faint2;
        param(ctx, (t) => r * Math.cos(t), (t) => d + r * Math.sin(t), 0, TAU, 200, T);
      });
    },
    // 10 — Fourier partial sums of a square wave (Gibbs)
    fourier(ctx, w, h, c) {
      const T = frame(w, h, -Math.PI * 1.15, Math.PI * 3.15, -1.45, 1.45);
      ctx.lineWidth = 1.2;
      [1, 3, 5, 7, 9, 13, 19, 29].forEach((N, k) => {
        ctx.strokeStyle = N === 5 ? c.b : c.a;
        ctx.globalAlpha = 0.35 + k * 0.08;
        curve(ctx, (x) => {
          let s = 0;
          for (let n = 1; n <= N; n += 2) s += Math.sin(n * x) / n;
          return (4 / Math.PI) * s;
        }, -Math.PI * 1.15, Math.PI * 3.15, 700, T);
      });
      ctx.globalAlpha = 1;
    },
    // 11 — heat equation: a square pulse diffusing over time
    modes(ctx, w, h, c) {
      const T = frame(w, h, -0.05 * Math.PI, 1.05 * Math.PI, -0.08, 1.25);
      const u = (x, t) => {
        let s = 0;
        for (let n = 1; n <= 61; n++) {
          const bn = (2 / (n * Math.PI)) * (Math.cos((n * Math.PI) / 3) - Math.cos((2 * n * Math.PI) / 3));
          s += bn * Math.sin(n * x) * Math.exp(-n * n * t);
        }
        return s;
      };
      ctx.lineWidth = 1.25;
      [0.0015, 0.01, 0.03, 0.06, 0.1, 0.16, 0.25, 0.38, 0.55, 0.8].forEach((t, k) => {
        ctx.strokeStyle = k === 3 ? c.b : c.a;
        curve(ctx, (x) => u(x, t), 0, Math.PI, 300, T);
      });
    },
    // 12 — conformal image of the grid under w = z²
    conformal(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -4.2 * asp, 4.2 * asp, -4.2, 4.2);
      ctx.lineWidth = 1.15;
      [0.35, 0.7, 1.05, 1.4, 1.75, 2.1].forEach((k, i) => {
        ctx.strokeStyle = i === 2 ? c.b : c.a;
        param(ctx, (y) => k * k - y * y, (y) => 2 * k * y, -3, 3, 200, T); // x = k
        ctx.strokeStyle = i === 2 ? c.b : c.faint2;
        param(ctx, (x) => x * x - k * k, (x) => 2 * k * x, -3, 3, 200, T); // y = k
      });
    },
    // 13 — contours around singular points
    contour(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -3, 3);
      const poles = [[-1.1, 0.4], [1.3, -0.5], [0.2, 1.3]];
      ctx.lineWidth = 1.2;
      for (let k = 1; k <= 11; k++) {
        const r = 0.45 * k;
        ctx.strokeStyle = k === 6 ? c.b : c.a;
        ctx.globalAlpha = 0.3 + 0.06 * k;
        param(ctx, (t) => 0.1 + r * Math.cos(t) * 1.2, (t) => r * Math.sin(t), 0, TAU, 180, T);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.b;
      poles.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), 3.5, 0, TAU); ctx.fill(); });
    },
    // 14 — semicircular contours closing the real axis
    residue(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -0.9, 5.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, T.Y(0)); ctx.lineTo(w, T.Y(0)); ctx.stroke();
      ctx.lineWidth = 1.25;
      for (let k = 1; k <= 12; k++) {
        const R = 0.42 * k;
        ctx.strokeStyle = k === 7 ? c.b : c.a;
        param(ctx, (t) => R * Math.cos(t), (t) => R * Math.sin(t), 0, Math.PI, 160, T);
      }
      ctx.fillStyle = c.b;
      [[0, 1], [0, 2.2], [1.4, 0.8]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(T.X(x), T.Y(y), 3.5, 0, TAU); ctx.fill(); });
    },
    // 15 — Joukowski map w = z + 1/z: circles |z| = r → confocal ellipses, rays → hyperbolas
    joukowski(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3.4 * asp, 3.4 * asp, -3.4, 3.4);
      ctx.lineWidth = 1.2;
      [1.08, 1.2, 1.36, 1.55, 1.8, 2.1, 2.5].forEach((r, k) => {
        ctx.strokeStyle = k === 3 ? c.b : c.a;
        param(ctx, (t) => (r + 1 / r) * Math.cos(t), (t) => (r - 1 / r) * Math.sin(t), 0, TAU, 200, T);
      });
      ctx.strokeStyle = c.faint2;
      for (let k = 1; k < 16; k++) {
        const th = (k * Math.PI) / 16;
        [th, -th].forEach((a) => param(ctx, (r) => (r + 1 / r) * Math.cos(a), (r) => (r - 1 / r) * Math.sin(a), 1, 3.2, 80, T));
      }
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(T.X(-2), T.Y(0)); ctx.lineTo(T.X(2), T.Y(0)); ctx.stroke();
    },
    // 16 — potential flow around a cylinder: streamlines (r − 1/r) sin θ = c and equipotentials
    potential(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -3 * asp, 3 * asp, -3, 3);
      const stream = (cc, lo, hi) => param(ctx, (t) => {
        const k = cc / Math.sin(t); const r = (k + Math.sqrt(k * k + 4)) / 2; return r * Math.cos(t);
      }, (t) => {
        const k = cc / Math.sin(t); const r = (k + Math.sqrt(k * k + 4)) / 2; return r * Math.sin(t);
      }, lo, hi, 400, T);
      ctx.lineWidth = 1.2;
      [0.15, 0.35, 0.6, 0.9, 1.25, 1.7, 2.3, 3].forEach((cc, k) => {
        ctx.strokeStyle = k === 2 ? c.b : c.a;
        stream(cc, 0.004, Math.PI - 0.004);
        stream(-cc, -Math.PI + 0.004, -0.004);
      });
      ctx.strokeStyle = c.faint;
      [-3.2, -2.6, -2.2, 2.2, 2.6, 3.2].forEach((cc) => {
        param(ctx, (t) => {
          const k = cc / Math.cos(t); const r = (k + Math.sqrt(Math.max(k * k - 4, 0))) / 2; return r * Math.cos(t);
        }, (t) => {
          const k = cc / Math.cos(t); const r = (k + Math.sqrt(Math.max(k * k - 4, 0))) / 2; return r * Math.sin(t);
        }, cc > 0 ? -Math.acos(Math.min(1, cc / 3.6 * 0.999)) + 0.0 : Math.PI - Math.acos(Math.min(1, -cc / 3.6)), cc > 0 ? Math.acos(Math.min(1, cc / 3.6 * 0.999)) : Math.PI + Math.acos(Math.min(1, -cc / 3.6)), 200, T);
      });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.8;
      param(ctx, (t) => Math.cos(t), (t) => Math.sin(t), 0, TAU, 120, T);
    },
    // 17 — sin x on [−π, π]: Taylor polynomials of degree 1, 3, 5, 7 (faint) and the degree-5 best (projection) approximation
    bestapprox(ctx, w, h, c) {
      const P = Math.PI, T = frame(w, h, -P * 1.18, P * 1.18, -1.9, 1.9);
      const taylor = (N) => (x) => { let s = 0, t = x; for (let k = 1; k <= N; k += 2) { s += t; t *= (-x * x) / ((k + 1) * (k + 2)); } return s; };
      ctx.lineWidth = 1.1;
      [1, 3, 5, 7].forEach((N, k) => {
        ctx.strokeStyle = c.a; ctx.globalAlpha = 0.25 + k * 0.12;
        curve(ctx, taylor(N), -P * 1.18, P * 1.18, 300, T);
      });
      ctx.globalAlpha = 1; ctx.lineWidth = 1.6; ctx.strokeStyle = c.a;
      curve(ctx, Math.sin, -P * 1.18, P * 1.18, 300, T);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.8;
      curve(ctx, (x) => 0.987862 * x - 0.155271 * x ** 3 + 0.00564312 * x ** 5, -P, P, 300, T);
    },
    // exams — a sine carrier, used on exam covers
    exam(ctx, w, h, c) {
      const T = frame(w, h, 0, 10, -1.3, 1.3);
      ctx.lineWidth = 1.1;
      for (let k = 0; k < 9; k++) {
        ctx.strokeStyle = k === 4 ? c.b : c.a;
        curve(ctx, (x) => Math.sin(x * (0.9 + k * 0.08) + k * 0.4) * (0.35 + k * 0.08), 0, 10, 300, T);
      }
    },
  });
})();
