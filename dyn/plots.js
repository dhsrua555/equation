/* 동역학 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param, trace } = window.EMPlots.util;
  const pick = (ctx, c, hi) => { ctx.strokeStyle = hi ? c.b : c.a; ctx.lineWidth = hi ? 1.9 : 1.1; };
  function seg(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  const axes = (ctx, T, c, x0, x1, y0, y1) => { ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, x0, 0, x1, 0); seg(ctx, T, 0, y0, 0, y1); };

  window.EMPlots.add({
    // 01 — a cubic position with its velocity and acceleration
    dyRect(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, -0.3 + 6.2 * asp / 1.4, -12, 26);
      axes(ctx, T, c, -1, 12, -12, 26);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (t) => t ** 3 - 9 * t * t + 24 * t, 0, 5.4, 200, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.2; curve(ctx, (t) => 3 * t * t - 18 * t + 24, 0, 5.4, 200, T);
      ctx.lineWidth = 1; ctx.globalAlpha = 0.6; curve(ctx, (t) => 6 * t - 18, 0, 5.4, 50, T); ctx.globalAlpha = 1;
    },
    // 02 — projectiles launched at the same speed and different angles
    dyProj(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.03, -0.03 + 1.15 * asp / 1.9, -0.03, 0.62);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, 0, 0, 3, 0);
      [15, 30, 45, 60, 75].forEach((d, i) => {
        const a = (d * Math.PI) / 180, R = Math.sin(2 * a);
        pick(ctx, c, i === 2); curve(ctx, (x) => x * Math.tan(a) - (x * x) / (2 * Math.cos(a) ** 2), 0, R, 120, T);
      });
    },
    // 03 — friction force against applied force: static rises, then drops to kinetic
    dyFriction(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.1, -0.1 + 3.2 * asp / 1.5, -0.1, 1.25);
      axes(ctx, T, c, -1, 9, -1, 2);
      [[0.6, 0.45], [0.8, 0.6], [1.0, 0.75], [1.15, 0.9]].forEach(([s, k], i) => {
        pick(ctx, c, i === 1); curve(ctx, (p) => (p < s ? p : k), 0, 2.9, 400, T);
      });
      ctx.strokeStyle = c.faint; ctx.setLineDash([4, 4]); curve(ctx, (p) => p, 0, 1.2, 10, T); ctx.setLineDash([]);
    },
    // 04 — conics sharing a focus: circle, ellipses, parabola
    dyOrbit(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.6 * asp, 1.4 * asp, -2, 2);
      [0, 0.3, 0.55, 0.75, 0.9, 1].forEach((e, i) => {
        const p = 1; pick(ctx, c, i === 3);
        const lim = e < 1 ? Math.PI : 2.3;
        param(ctx, (t) => (p / (1 + e * Math.cos(t))) * Math.cos(t), (t) => (p / (1 + e * Math.cos(t))) * Math.sin(t), -lim, lim, 400, T);
      });
      ctx.fillStyle = c.b; ctx.beginPath(); ctx.arc(T.X(0), T.Y(0), 3, 0, TAU); ctx.fill();
    },
    // 05 — a potential well with several total-energy levels
    dyWell(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.4 * asp / 1.2, 2.4 * asp / 1.2, -1.2, 1.6);
      const V = (x) => 0.25 * x ** 4 - x * x;
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, V, -2.3, 2.3, 300, T);
      [-0.7, -0.3, 0.2, 0.8].forEach((E, i) => {
        ctx.strokeStyle = c.a; ctx.lineWidth = i === 1 ? 1.5 : 1;
        ctx.beginPath(); let pen = false;
        for (let k = 0; k <= 300; k++) { const x = -2.3 + (4.6 * k) / 300; if (V(x) <= E) { pen ? ctx.lineTo(T.X(x), T.Y(E)) : ctx.moveTo(T.X(x), T.Y(E)); pen = true; } else pen = false; }
        ctx.stroke();
      });
    },
    // 06 — velocities after a collision against the coefficient of restitution
    dyImpact(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.08, -0.08 + 1.25 * asp / 1.4, -0.5, 1.15);
      axes(ctx, T, c, -1, 3, -1, 2);
      [0.5, 1, 2].forEach((r, i) => {
        pick(ctx, c, i === 1);
        curve(ctx, (e) => (1 - r * e) / (1 + r), 0, 1, 60, T);
        curve(ctx, (e) => (1 + e) / (1 + r), 0, 1, 60, T);
      });
    },
    // 07 — an extremal path between fixed ends and varied neighbours
    dyVariation(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.08, -0.08 + 1.2 * asp / 1.3, -0.35, 1.05);
      const y = (x) => x * x;
      ctx.strokeStyle = c.b; ctx.lineWidth = 2; curve(ctx, y, 0, 1, 100, T);
      [-0.3, -0.18, -0.08, 0.08, 0.18, 0.3].forEach((a, i) => { ctx.strokeStyle = c.a; ctx.lineWidth = 1; curve(ctx, (x) => y(x) + a * Math.sin(Math.PI * x) * (1 + 0.6 * Math.sin(3 * x + i)), 0, 1, 100, T); });
    },
    // 08 — phase portrait of the pendulum: librations and rotations
    dyPendulum(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.25 * Math.PI, 1.25 * Math.PI, -3.2 / asp * 1.25, 3.2 / asp * 1.25);
      [0.4, 0.9, 1.4, 1.8, 2.0, 2.3, 2.8].forEach((E, i) => {
        pick(ctx, c, E === 2.0);
        [1, -1].forEach((sg) => curve(ctx, (th) => { const v = 2 * (E - (1 - Math.cos(th))) ; return v >= 0 ? sg * Math.sqrt(v) : NaN; }, -1.25 * Math.PI, 1.25 * Math.PI, 500, T));
      });
    },
    // 09 — cycloids traced by points on a rolling wheel
    dyCycloid(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, -0.3 + 2.6 * asp, -0.2, 2.4);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -1, 0, 30, 0);
      [0.4, 0.7, 1, 1.3].forEach((k, i) => { pick(ctx, c, k === 1); param(ctx, (t) => t - k * Math.sin(t), (t) => 1 - k * Math.cos(t), 0, 3 * TAU, 600, T); });
    },
    // 10 — straight paths on a turning disk, seen from the fixed frame
    dyCoriolis(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.2 * asp, 1.2 * asp, -1.2, 1.2);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; param(ctx, (t) => Math.cos(t), (t) => Math.sin(t), 0, TAU, 120, T);
      [0.6, 0.9, 1.3, 1.8, 2.5].forEach((W, i) => {
        pick(ctx, c, i === 2);
        // a ball rolling outward along a line of the disk: r = t, angle = W t in the disk frame is a straight line in the fixed frame
        param(ctx, (t) => t * Math.cos(-W * t), (t) => t * Math.sin(-W * t), 0, 1, 120, T);
      });
    },
    // 11 — distance rolled down an incline against time for hoop, shell, disk and solid sphere
    dyInertia(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.08, -0.08 + 1.4 * asp / 1.2, -0.05, 1.05);
      axes(ctx, T, c, -1, 3, -1, 2);
      [1 / 2, 3 / 5, 2 / 3, 5 / 7, 1].forEach((f, i) => { pick(ctx, c, i === 2); curve(ctx, (t) => Math.min(f * t * t, 1.02), 0, 1.3, 150, T); });
    },
    // 12 — energy split of a disk rolling down: potential into translation and rotation 2:1
    dyRollEnergy(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.08, -0.08 + 1.3 * asp / 1.2, -0.05, 1.08);
      axes(ctx, T, c, -1, 3, -1, 2);
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (t) => 1 - t * t, 0, 1, 100, T);
      ctx.strokeStyle = c.a; ctx.lineWidth = 1.4; curve(ctx, (t) => (2 / 3) * t * t, 0, 1, 100, T);
      ctx.lineWidth = 1.1; curve(ctx, (t) => (1 / 3) * t * t, 0, 1, 100, T);
      ctx.strokeStyle = c.faint; ctx.setLineDash([4, 4]); curve(ctx, () => 1, 0, 1, 2, T); ctx.setLineDash([]);
    },
    // 13 — normal velocities of the contact points during an impact (compression, then restitution)
    dyEccentric(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.08, -0.08 + 1.35 * asp / 1.2, -0.7, 1.1);
      axes(ctx, T, c, -1, 3, -1, 2);
      [0.2, 0.5, 0.8].forEach((e, i) => {
        pick(ctx, c, i === 1);
        const vA = (t) => (t < 0.5 ? 1 - 1.1 * t : 0.45 - 1.1 * e * (t - 0.5) * 0.9), vB = (t) => (t < 0.5 ? -0.2 + 1.3 * t : 0.45 + 1.3 * e * (t - 0.5) * 0.9);
        curve(ctx, vA, 0, 1, 100, T); curve(ctx, vB, 0, 1, 100, T);
      });
      ctx.strokeStyle = c.faint; ctx.setLineDash([4, 4]); seg(ctx, T, 0.5, -0.7, 0.5, 1.1); ctx.setLineDash([]);
    },
    // 14 — inertia ellipsoids (sections) with their principal axes
    dyEllipsoid(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.3 * asp, 1.3 * asp, -1.3, 1.3), th = 0.5;
      [[1.2, 0.5], [1.0, 0.6], [0.8, 0.7], [0.6, 0.55]].forEach(([a, b], i) => {
        pick(ctx, c, i === 1);
        param(ctx, (t) => a * Math.cos(t) * Math.cos(th) - b * Math.sin(t) * Math.sin(th), (t) => a * Math.cos(t) * Math.sin(th) + b * Math.sin(t) * Math.cos(th), 0, TAU, 120, T);
      });
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -1.3 * Math.cos(th), -1.3 * Math.sin(th), 1.3 * Math.cos(th), 1.3 * Math.sin(th)); seg(ctx, T, 0.8 * Math.sin(th), -0.8 * Math.cos(th), -0.8 * Math.sin(th), 0.8 * Math.cos(th));
    },
    // 15 — the tip of a precessing top: circles with small nutation loops
    dyPrecession(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.35 * asp, 1.35 * asp, -1.35, 1.35);
      [[1.0, 0.08, 14], [0.75, 0.05, 11], [0.5, 0.035, 9]].forEach(([r, n, k], i) => {
        pick(ctx, c, i === 0);
        param(ctx, (t) => (r + n * Math.cos(k * t)) * Math.cos(t), (t) => 0.55 * (r + n * Math.cos(k * t)) * Math.sin(t) + n * 0.6 * Math.sin(k * t), 0, TAU, 800, T);
      });
    },
  });
})();
