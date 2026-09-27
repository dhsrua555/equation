/* 유체역학 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param } = window.EMPlots.util;
  function line(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  const axes = (ctx, T, c, x0, x1, y0, y1) => { ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, x0, 0, x1, 0); line(ctx, T, 0, y0, 0, y1); };
  const pick = (ctx, c, hi) => { ctx.strokeStyle = hi ? c.b : c.a; ctx.lineWidth = hi ? 1.9 : 1.1; };
  const log10 = (x) => Math.log(x) / Math.LN10;

  window.EMPlots.add({
    // 01 — viscosity against temperature: liquids fall (Andrade), gases rise (power law)
    flCouette(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -5, 100 * asp / 1.3, -0.05, 1.1);
      axes(ctx, T, c, -5, 200, -0.05, 1.1);
      [0.6, 0.8, 1, 1.25, 1.6].forEach((k, i) => { pick(ctx, c, i === 2); curve(ctx, (t) => Math.exp(-k * 0.025 * t) * 0.95, 0, 200, 200, T); });
      [0.4, 0.55, 0.7].forEach((k, i) => { ctx.strokeStyle = c.b; ctx.lineWidth = i === 1 ? 1.6 : 1; ctx.globalAlpha = 0.7; curve(ctx, (t) => 0.15 * k * Math.pow((t + 273) / 273, 0.7) * 2.5, 0, 200, 200, T); });
      ctx.globalAlpha = 1;
    },
    // 02 — hydrostatic pressure grows linearly with depth; isothermal atmosphere decays exponentially
    flHydro(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.3 * asp / 1.3, -0.05, 1.1);
      axes(ctx, T, c, -1, 3, -1, 2);
      [0.4, 0.6, 0.8, 1.0, 1.3].forEach((g, i) => { pick(ctx, c, i === 3); curve(ctx, (z) => Math.min(1.05, 0.1 + g * z), 0, 3, 100, T); });
      [0.8, 1.2, 1.7, 2.4].forEach((k, i) => { ctx.strokeStyle = c.b; ctx.lineWidth = i === 1 ? 1.6 : 1; ctx.globalAlpha = 0.6; curve(ctx, (z) => Math.exp(-k * z), 0, 3, 200, T); });
      ctx.globalAlpha = 1;
    },
    // 03 — pressure prisms on gates at increasing depth: triangles become trapezoids
    flGate(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.1, 1.6 * asp / 1.3, -1.25, 0.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -1, 0, 9, 0);
      for (let k = 0; k < 6; k++) {
        const x0 = 0.05 + k * 0.33, top = -0.15 * k, bot = top - 0.5;
        pick(ctx, c, k === 3);
        ctx.beginPath(); ctx.moveTo(T.X(x0), T.Y(top)); ctx.lineTo(T.X(x0 + 0.08 - top * 0.25), T.Y(top)); ctx.lineTo(T.X(x0 + 0.08 - bot * 0.25), T.Y(bot)); ctx.lineTo(T.X(x0), T.Y(bot)); ctx.closePath(); ctx.stroke();
      }
    },
    // 04 — free surfaces of rigid rotation for growing spin rates (volume kept)
    flRotate(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.15 * asp, 1.15 * asp, -0.4, 1.2);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -1, -0.3, -1, 1.1); line(ctx, T, 1, -0.3, 1, 1.1); line(ctx, T, -1, -0.3, 1, -0.3);
      [0, 0.15, 0.3, 0.45, 0.6, 0.75].forEach((a, i) => { pick(ctx, c, i === 3); curve(ctx, (r) => 0.45 - a / 2 + a * r * r, -1, 1, 200, T); });
    },
    // 05 — Reynolds transport: a control volume with streamlines entering and leaving
    flRTT(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.3 * asp, 1.3 * asp, -1.3, 1.3);
      for (let k = -5; k <= 5; k++) {
        pick(ctx, c, k === 1);
        curve(ctx, (x) => (k * 0.22) * (1 + 0.6 * Math.exp(-x * x * 2)) , -5, 5, 200, T);
      }
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.strokeRect(T.X(-0.7), T.Y(0.9), T.X(0.7) - T.X(-0.7), T.Y(-0.9) - T.Y(0.9)); ctx.setLineDash([]);
    },
    // 06 — a jet turned by vanes of increasing angle
    flJet(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.2, 1.4 * asp, -1.2, 1.3);
      [20, 45, 70, 90, 120, 150].forEach((deg, i) => {
        const th = (deg * Math.PI) / 180;
        pick(ctx, c, i === 3);
        param(ctx, (t) => (t < 0 ? t : Math.sin(t * th) / th), (t) => (t < 0 ? 0 : (1 - Math.cos(t * th)) / th), -1.2, 1, 200, T);
      });
    },
    // 07 — Bernoulli: velocity head and pressure head trade off along a converging-diverging duct
    flBernoulli(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.05 * asp / 1.3, -0.05, 1.1);
      axes(ctx, T, c, -1, 3, -1, 2);
      [0.3, 0.45, 0.6, 0.75].forEach((k, i) => {
        const A = (x) => 1 - k * Math.exp(-Math.pow((x - 0.5) / 0.15, 2));
        pick(ctx, c, i === 2); curve(ctx, (x) => 1 - 0.18 / (A(x) * A(x)) + 0.18, 0, 1.4, 200, T);
        ctx.strokeStyle = c.faint2; ctx.lineWidth = 1; curve(ctx, (x) => 0.18 / (A(x) * A(x)) * 0.5, 0, 1.4, 200, T);
      });
    },
    // 08 — velocity vectors of a Couette-Poiseuille family (differential analysis)
    flNS(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.1, 1.6 * asp / 1.3, -1.1, 1.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -1, -1, 9, -1); line(ctx, T, -1, 1, 9, 1);
      [-2, -1, 0, 1, 2, 3].forEach((P, i) => { pick(ctx, c, i === 2); param(ctx, (y) => 0.5 * (1 + y) / 2 * 1.2 + P * 0.12 * (1 - y * y) + 0.05, (y) => y, -1, 1, 100, T); });
    },
    // 09 — streamlines of a Rankine half-body (uniform stream + source)
    flStream(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.4, 3.2 * asp / 1.3 - 1.4, -1.3, 1.3);
      const m = 0.25;
      for (let k = -6; k <= 6; k++) {
        const psi = k * 0.18;
        pick(ctx, c, Math.abs(psi - m * Math.PI) < 0.1 || k === 0);
        ctx.beginPath(); let pen = false;
        for (let s = 0; s <= 400; s++) {
          const x = -1.4 + (s / 400) * 5;
          // solve psi = U y + m atan2(y, x) for y by bisection on (0, 1.3) or (-1.3, 0)
          const sgn = psi >= 0 ? 1 : -1;
          let lo = 0, hi = 1.3 * sgn, f = (y) => y + m * Math.atan2(y, x) - psi;
          if (f(lo) * f(hi) > 0) { pen = false; continue; }
          for (let it = 0; it < 30; it++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
          const y = (lo + hi) / 2;
          if (pen) ctx.lineTo(T.X(x), T.Y(y)); else { ctx.moveTo(T.X(x), T.Y(y)); pen = true; }
        }
        ctx.stroke();
      }
    },
    // 10 — dimensional analysis: drag coefficient of a sphere against Reynolds number (log-log)
    flPi(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.2, 6.5 * asp / 1.4 - 1, -1.2, 2.8);
      axes(ctx, T, c, -2, 8, -1.5, 3);
      const cd = (lr) => { const Re = Math.pow(10, lr); return log10(24 / Re * (1 + 0.15 * Math.pow(Re, 0.687)) + 0.42 / (1 + 42500 * Math.pow(Re, -1.16)) + (lr > 5.45 ? -0.3 * Math.tanh((lr - 5.45) * 8) : 0)); };
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, cd, -1, 6.3, 400, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1; curve(ctx, (lr) => log10(24) - lr, -1, 2, 50, T);
    },
    // 11 — laminar (parabolic) and turbulent (flatter) pipe profiles
    flPoiseuille(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.1, 1.5 * asp / 1.3, -1.1, 1.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -1, -1, 9, -1); line(ctx, T, -1, 1, 9, 1); line(ctx, T, 0, -1, 0, 1);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; param(ctx, (y) => 1.0 * (1 - y * y), (y) => y, -1, 1, 100, T);
      [5, 7, 9, 12].forEach((n) => { ctx.strokeStyle = c.a; ctx.lineWidth = 1.1; param(ctx, (y) => 0.82 * Math.pow(1 - Math.abs(y), 1 / n), (y) => y, -1, 1, 200, T); });
    },
    // 12 — Moody chart: laminar 64/Re and Colebrook curves for several roughness ratios
    flMoody(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, 2.7, 2.7 + 5.4 * asp / 1.5, -2.1, -0.9);
      const lam = (lr) => log10(64 / Math.pow(10, lr));
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, lam, 2.7, 3.4, 50, T);
      const cb = (eps) => (lr) => { const Re = Math.pow(10, lr); const x = -1.8 * log10(6.9 / Re + Math.pow(eps / 3.7, 1.11)); return log10(1 / (x * x)); };
      [0, 1e-5, 1e-4, 5e-4, 2e-3, 1e-2, 3e-2].forEach((e, i) => { pick(ctx, c, i === 3); curve(ctx, cb(e), 3.5, 8, 300, T); });
    },
    // 13 — laminar boundary-layer thickness delta ~ x^(1/2) and turbulent ~ x^(6/7)
    flBL(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.3 * asp / 1.3, -0.05, 1.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 9, 0);
      [0.3, 0.45, 0.6, 0.8].forEach((k, i) => { pick(ctx, c, i === 1); curve(ctx, (x) => k * Math.sqrt(x) * 0.9, 0, 2, 200, T); });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.4; curve(ctx, (x) => (x < 0.5 ? 0.45 * Math.sqrt(x) * 0.9 : 0.286 + 0.9 * Math.pow(x - 0.5, 6 / 7)), 0, 2, 300, T);
    },
    // 14 — drag coefficients against Reynolds number: sphere, cylinder, flat plate (log-log)
    flDrag(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, 1.5, 1.5 + 5.2 * asp / 1.4, -2.7, 1.3);
      const sph = (lr) => { const Re = Math.pow(10, lr); return log10(24 / Re * (1 + 0.15 * Math.pow(Re, 0.687)) + 0.42 / (1 + 42500 * Math.pow(Re, -1.16))); };
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (lr) => sph(lr) + (lr > 5.4 ? -0.6 * (1 - Math.exp(-(lr - 5.4) * 6)) : 0), 1.5, 6.6, 300, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; curve(ctx, (lr) => sph(lr) + 0.12 + (lr > 5.5 ? -0.5 * (1 - Math.exp(-(lr - 5.5) * 6)) : 0), 1.5, 6.6, 300, T);
      curve(ctx, (lr) => log10(1.328 / Math.sqrt(Math.pow(10, lr))), 2, 5.7, 100, T);
      curve(ctx, (lr) => log10(0.031 / Math.pow(Math.pow(10, lr), 1 / 7)), 5.5, 6.6, 100, T);
    },
    // 15 — potential flow past a circular cylinder: streamlines psi = U (r - a^2/r) sin(theta)
    flCylinder(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.4 * asp / 1.2, 2.4 * asp / 1.2, -2, 2);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(T.X(0), T.Y(0), T.X(1) - T.X(0), 0, TAU); ctx.stroke();
      for (let k = -7; k <= 7; k++) {
        if (k === 0) continue;
        const psi = k * 0.25;
        pick(ctx, c, k === 1 || k === -1);
        ctx.beginPath(); let pen = false;
        for (let s = 0; s <= 400; s++) {
          const x = -5 + (10 * s) / 400;
          // y (r - 1/r) sin -> in Cartesian: psi = y (1 - 1/(x^2+y^2)); solve for y by bisection on the correct side
          const f = (y) => y * (1 - 1 / (x * x + y * y)) - psi;
          let lo = psi > 0 ? 0.0001 : -2.2, hi = psi > 0 ? 2.2 : -0.0001;
          if (x * x < 1) { if (psi > 0) lo = Math.sqrt(1 - x * x) + 1e-4; else hi = -Math.sqrt(1 - x * x) - 1e-4; }
          if (f(lo) * f(hi) > 0) { pen = false; continue; }
          for (let it = 0; it < 30; it++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
          const y = (lo + hi) / 2;
          if (pen) ctx.lineTo(T.X(x), T.Y(y)); else { ctx.moveTo(T.X(x), T.Y(y)); pen = true; }
        }
        ctx.stroke();
      }
    },
  });
})();
