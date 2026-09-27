/* 고체역학 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param } = window.EMPlots.util;
  function line(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  function poly(ctx, T, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y)))); ctx.stroke(); }
  const axes = (ctx, T, c, x0, x1, y0, y1) => { ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, x0, 0, x1, 0); line(ctx, T, 0, y0, 0, y1); };
  const pick = (ctx, c, hi) => { ctx.strokeStyle = hi ? c.b : c.a; ctx.lineWidth = hi ? 1.9 : 1.1; };

  window.EMPlots.add({
    // 01 — a hanging cable: the sag shrinks as the tension grows (parabolas through two supports)
    slCable(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.2 * asp, 1.2 * asp, -1.1, 0.35);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -9, 0, 9, 0);
      [0.06, 0.14, 0.24, 0.36, 0.5, 0.66, 0.84, 1.0].forEach((s, i) => { pick(ctx, c, i === 4); curve(ctx, (x) => s * (x * x - 1), -1, 1, 200, T); });
      ctx.fillStyle = c.b; [-1, 1].forEach((x) => { ctx.beginPath(); ctx.arc(T.X(x), T.Y(0), 3, 0, TAU); ctx.fill(); });
    },
    // 02 — stress on an oblique plane: sigma = cos^2(theta), tau = sin(theta)cos(theta), for growing loads
    slOblique(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.75 * asp / 1.2, 1.75 * asp / 1.2, -0.75, 1.25);
      axes(ctx, T, c, -3, 3, -0.8, 1.3);
      [0.3, 0.5, 0.7, 0.85, 1].forEach((P, i) => {
        pick(ctx, c, i === 4); curve(ctx, (t) => P * Math.cos(t) ** 2, -Math.PI / 2, Math.PI / 2, 200, T);
        ctx.strokeStyle = c.a; ctx.lineWidth = 1; curve(ctx, (t) => P * Math.sin(t) * Math.cos(t), -Math.PI / 2, Math.PI / 2, 200, T);
      });
    },
    // 03 — simple shear: a row of squares deformed by growing shear strain
    slShear(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, 6.6 * asp / 1.4, -0.4, 1.6);
      for (let k = 0; k < 7; k++) {
        const g = 0.12 * k, x0 = k * 1.35;
        pick(ctx, c, k === 4);
        poly(ctx, T, [[x0, 0], [x0 + 1, 0], [x0 + 1 + g, 1], [x0 + g, 1], [x0, 0]]);
        ctx.strokeStyle = c.faint; ctx.lineWidth = 1; poly(ctx, T, [[x0, 0], [x0, 1], [x0 + 1, 1], [x0 + 1, 0]]);
      }
    },
    // 04 — stress-strain curves: mild steel with a yield plateau, a rounded alloy, a brittle line, and unloading paths
    ssCurve(ctx, w, h, c) {
      const asp = w / h, X = 0.3 * asp / 1.3, T = frame(w, h, -0.01, X, -0.05, 1.12);
      axes(ctx, T, c, -1, 1, -1, 2);
      const steel = (e) => (e < 0.012 ? e / 0.012 * 0.55 : e < 0.03 ? 0.55 : e < 0.2 ? 0.55 + 0.35 * Math.sin(((e - 0.03) / 0.17) * Math.PI / 2) : 0.9 - 2.5 * (e - 0.2) ** 2 * 10);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, steel, 0, Math.min(0.28, X), 400, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2;
      curve(ctx, (e) => 0.8 * (1 - Math.exp(-e / 0.025)) + 0.35 * e, 0, Math.min(0.24, X), 300, T);
      curve(ctx, (e) => (e < 0.02 ? e * 45 : NaN), 0, 0.02, 50, T);
      [0.08, 0.13, 0.18].forEach((e) => { const s = steel(e); ctx.lineWidth = 1; line(ctx, T, e, s, e - s * 0.012 / 0.55, 0); });
    },
    // 05 — axial displacement u(x) along bars whose area shrinks linearly
    slAxial(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.05 * asp / 1.4, -0.1, 1.6);
      axes(ctx, T, c, -1, 2, -1, 2);
      [0, 0.2, 0.4, 0.55, 0.7, 0.8, 0.88].forEach((a, i) => {
        pick(ctx, c, i === 3);
        curve(ctx, (x) => (a === 0 ? x : -Math.log(1 - a * x) / a) * 0.9, 0, 1, 200, T);
      });
    },
    // 06 — a twisted shaft: surface generators become helices, visible half only
    slTorsion(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.1, 2.1 * asp / 1.6, -1.35, 1.35);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 1, 9, 1); line(ctx, T, 0, -1, 9, -1);
      const L = 2.1 * asp / 1.6;
      for (let k = 0; k < 16; k++) {
        const th = (k * Math.PI) / 8;
        ctx.strokeStyle = k === 6 ? c.b : c.a; ctx.lineWidth = k === 6 ? 1.9 : 1;
        ctx.beginPath(); let pen = false;
        for (let s = 0; s <= 300; s++) {
          const x = (L * s) / 300, ph = th + 0.9 * x;
          if (Math.sin(ph) < 0) { pen = false; continue; }
          const y = Math.cos(ph);
          if (pen) ctx.lineTo(T.X(x), T.Y(y)); else { ctx.moveTo(T.X(x), T.Y(y)); pen = true; }
        }
        ctx.stroke();
      }
    },
    // 07 — bending-moment diagrams of a simply supported beam: a point load at several positions, and a uniform load
    slMoment(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.05 * asp / 1.4, -0.08, 0.36);
      axes(ctx, T, c, -1, 2, -1, 1);
      [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].forEach((a) => { pick(ctx, c, false); poly(ctx, T, [[0, 0], [a, a * (1 - a)], [1, 0]]); });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (x) => 1.3 * 0.5 * x * (1 - x) * 0.95, 0, 1, 200, T);
    },
    // 08 — flexure: linear stress distributions through the neutral axis for growing moments
    slBending(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.3 * asp, 1.3 * asp, -1.25, 1.25);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, -9, 0, 9, 0); line(ctx, T, 0, -1, 0, 1);
      [0.25, 0.5, 0.75, 1.0, 1.25, 1.5].forEach((k, i) => { pick(ctx, c, i === 3); line(ctx, T, k, -1, -k, 1); });
    },
    // 09 — shear stress over a rectangular section (parabolas) and the jump at a flange
    slShearFlow(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.1, 1.6 * asp / 1.2, -1.15, 1.15);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, -1, 0, 1);
      [0.3, 0.55, 0.8, 1.05, 1.3].forEach((V, i) => { pick(ctx, c, i === 2); param(ctx, (y) => V * (1 - y * y), (y) => y, -1, 1, 200, T); });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.4;
      param(ctx, (y) => (Math.abs(y) < 0.75 ? 1.5 * (1 - (y / 1.02) ** 2 * 0.55) : 0.16 * (1 - y * y) / (1 - 0.5625)), (y) => y, -1, 1, 300, T);
    },
    // 10 — elastic curves of a simply supported beam under a point load at a = 0.2 … 0.8
    slDeflect(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.05 * asp / 1.4, -0.085, 0.02);
      axes(ctx, T, c, -1, 2, -1, 1);
      const v = (a) => (x) => { const b = 1 - a; return x <= a ? -(b * x * (1 - b * b - x * x)) / 6 : -(a * (1 - x) * (1 - a * a - (1 - x) ** 2)) / 6; };
      [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].forEach((a, i) => { pick(ctx, c, i === 3); curve(ctx, (x) => 1.2 * v(a)(x), 0, 1, 200, T); });
    },
    // 11 — superposition: two deflection curves and their sum
    slSuper(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.05 * asp / 1.4, -0.034, 0.004);
      axes(ctx, T, c, -1, 2, -1, 1);
      const pl = (x) => { const a = 0.3, b = 0.7; return x <= a ? -(b * x * (1 - b * b - x * x)) / 6 : -(a * (1 - x) * (1 - a * a - (1 - x) ** 2)) / 6; };
      const ud = (x) => -(x * (1 - 2 * x * x + x * x * x)) / 24 * 0.9;
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; curve(ctx, pl, 0, 1, 200, T); curve(ctx, ud, 0, 1, 200, T);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (x) => pl(x) + ud(x), 0, 1, 200, T);
    },
    // 12 — Mohr's circles for a family of plane stress states
    slMohr(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.3 * asp + 0.4, 1.3 * asp + 0.4, -1.3, 1.3);
      axes(ctx, T, c, -9, 9, -1.3, 1.3);
      [[0.2, 0.35], [0.35, 0.6], [0.5, 0.85], [0.6, 1.05], [0.3, 0.2], [0.8, 0.4]].forEach(([cx, r], i) => {
        pick(ctx, c, i === 2); ctx.beginPath(); ctx.arc(T.X(cx), T.Y(0), (T.X(cx + r) - T.X(cx)), 0, TAU); ctx.stroke();
      });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1; line(ctx, T, 0.5 - 0.85 * Math.cos(0.9), 0.85 * Math.sin(0.9), 0.5 + 0.85 * Math.cos(0.9), -0.85 * Math.sin(0.9));
    },
    // 13 — hoop stress across the wall of a pressurized cylinder (Lamé) for thinner and thinner walls
    slVessel(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, 0.9, 0.9 + 1.25 * asp / 1.3, -0.3, 5.4);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 9, 0);
      [2.2, 1.8, 1.5, 1.3, 1.2, 1.12].forEach((b, i) => {
        pick(ctx, c, i === 3); curve(ctx, (r) => (1 / (b * b - 1)) * (1 + (b * b) / (r * r)) * 0.9, 1, b, 100, T);
      });
    },
    // 14 — yield loci in the principal-stress plane: the Tresca hexagon inside the von Mises ellipse
    slYield(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.5 * asp, 1.5 * asp, -1.5, 1.5);
      axes(ctx, T, c, -9, 9, -1.5, 1.5);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9;
      param(ctx, (t) => Math.cos(t) - Math.sin(t) / Math.sqrt(3), (t) => Math.cos(t) + Math.sin(t) / Math.sqrt(3), 0, TAU, 300, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.3; poly(ctx, T, [[1, 0], [1, 1], [0, 1], [-1, 0], [-1, -1], [0, -1], [1, 0]]);
      [0.4, 0.7].forEach((s) => { ctx.lineWidth = 1; poly(ctx, T, [[s, 0], [s, s], [0, s], [-s, 0], [-s, -s], [0, -s], [s, 0]]); });
    },
    // 15 — buckling modes sin(n pi x / L) for n = 1 … 4
    slBuckle(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.05, 1.05 * asp / 1.4, -1.25, 1.25);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; line(ctx, T, 0, 0, 9, 0);
      [1, 2, 3, 4].forEach((n) => { pick(ctx, c, n === 1); curve(ctx, (x) => Math.sin(n * Math.PI * x) * (n === 1 ? 1 : 0.8 / Math.sqrt(n)), 0, 1, 300, T); });
    },
  });
})();
