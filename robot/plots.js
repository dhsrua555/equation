/* 로봇공학 단원 표지: 각 단원을 정의하는 곡선족 (그리는 틀은 core/plots.js) */
(function () {
  const { TAU, frame, curve, param } = window.EMPlots.util;
  const pick = (ctx, c, hi) => { ctx.strokeStyle = hi ? c.b : c.a; ctx.lineWidth = hi ? 1.9 : 1.1; };
  function seg(ctx, T, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(T.X(x1), T.Y(y1)); ctx.lineTo(T.X(x2), T.Y(y2)); ctx.stroke(); }
  // circle-circle intersection (upper branch relative to the segment from p to q)
  function meet(p, r1, q, r2) {
    const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy);
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return null;
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
    const mx = p[0] + (a * dx) / d, my = p[1] + (a * dy) / d;
    return [mx - (h * dy) / d, my + (h * dx) / d];
  }
  const ellipse = (ctx, T, cx, cy, a, b, ang) => param(ctx, (t) => cx + a * Math.cos(t) * Math.cos(ang) - b * Math.sin(t) * Math.sin(ang), (t) => cy + a * Math.cos(t) * Math.sin(ang) + b * Math.sin(t) * Math.cos(ang), 0, TAU, 80, T);
  // 2R arm helpers (unit link lengths L1, L2)
  const jac = (L1, L2, t1, t2) => [[-L1 * Math.sin(t1) - L2 * Math.sin(t1 + t2), -L2 * Math.sin(t1 + t2)], [L1 * Math.cos(t1) + L2 * Math.cos(t1 + t2), L2 * Math.cos(t1 + t2)]];
  function velEllipse(ctx, T, L1, L2, t1, t2, k) {
    const J = jac(L1, L2, t1, t2), a = J[0][0] ** 2 + J[0][1] ** 2, b = J[0][0] * J[1][0] + J[0][1] * J[1][1], d = J[1][0] ** 2 + J[1][1] ** 2;
    const tr = a + d, det = a * d - b * b, disc = Math.sqrt(Math.max(tr * tr / 4 - det, 0)), l1 = tr / 2 + disc, l2 = Math.max(tr / 2 - disc, 0);
    const ang = Math.atan2(l1 - a, b), x = L1 * Math.cos(t1) + L2 * Math.cos(t1 + t2), y = L1 * Math.sin(t1) + L2 * Math.sin(t1 + t2);
    ellipse(ctx, T, x, y, k * Math.sqrt(l1), Math.max(k * Math.sqrt(l2), 0.004), ang);
  }

  window.EMPlots.add({
    // 01 — coupler curves of a crank-rocker four-bar linkage
    rbLinkage(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.6, -1.6 + 7.2 * asp / 1.25, -1.8, 4.6);
      const a = 1, b = 3, cc = 3.5, d = 3;
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -1, 0, 4, 0);
      [[0.3, 0.8], [0.5, 1.2], [0.7, 0.6], [0.2, -0.5], [0.9, 1.6], [0.5, 0.3]].forEach(([u, v], i) => {
        pick(ctx, c, i === 1); ctx.beginPath(); let pen = false;
        for (let k = 0; k <= 240; k++) {
          const f = (TAU * k) / 240, A = [a * Math.cos(f), a * Math.sin(f)], B = meet(A, cc, [d, 0], b);
          if (!B) { pen = false; continue; }
          const ex = B[0] - A[0], ey = B[1] - A[1], x = A[0] + u * ex - v * ey * 0.5, y = A[1] + u * ey + v * ex * 0.5;
          if (pen) ctx.lineTo(T.X(x), T.Y(y)); else { ctx.moveTo(T.X(x), T.Y(y)); pen = true; }
        }
        ctx.stroke();
      });
    },
    // 02 — a torus with joint-space trajectories winding around it
    rbTorus(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.2 * asp, 2.2 * asp, -2.2, 2.2), Rr = 1.3, r = 0.55;
      const P = (u, v) => [(Rr + r * Math.cos(v)) * Math.cos(u), 0.42 * (Rr + r * Math.cos(v)) * Math.sin(u) + 0.9 * r * Math.sin(v)];
      for (let i = 0; i < 12; i++) { ctx.strokeStyle = c.faint; ctx.lineWidth = 1; const u = (TAU * i) / 12; param(ctx, (v) => P(u, v)[0], (v) => P(u, v)[1], 0, TAU, 60, T); }
      for (let i = 0; i < 4; i++) { ctx.strokeStyle = c.faint; const v = (TAU * i) / 4; param(ctx, (u) => P(u, v)[0], (u) => P(u, v)[1], 0, TAU, 120, T); }
      [[1, 3], [2, 5], [1, 1]].forEach(([p, q], i) => { pick(ctx, c, i === 0); param(ctx, (t) => P(p * t, q * t)[0], (t) => P(p * t, q * t)[1], 0, TAU, 600, T); });
    },
    // 03 — convex hulls of wrench vectors around the origin
    rbHull(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.5 * asp, 1.5 * asp, -1.5, 1.5);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -9, 0, 9, 0); seg(ctx, T, 0, -2, 0, 2);
      for (let k = 0; k < 5; k++) {
        const n = 3 + k, pts = [];
        for (let i = 0; i < n; i++) { const t = (TAU * i) / n + 0.35 * k, rr = 0.45 + 0.17 * k + 0.12 * Math.sin(3 * i + k); pts.push([rr * Math.cos(t), rr * Math.sin(t)]); }
        pick(ctx, c, k === 2); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(T.X(p[0]), T.Y(p[1])) : ctx.moveTo(T.X(p[0]), T.Y(p[1])))); ctx.closePath(); ctx.stroke();
        if (k === 2) pts.forEach((p) => seg(ctx, T, 0, 0, p[0], p[1]));
      }
    },
    // 04 — friction cones of growing mu on a contact point
    rbCone(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.3 * asp, 1.3 * asp, -0.25, 1.35);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -9, 0, 9, 0);
      [0.15, 0.3, 0.5, 0.75, 1.0, 1.4].forEach((mu, i) => { const al = Math.atan(mu), L = 1.25; pick(ctx, c, i === 2); seg(ctx, T, 0, 0, L * Math.sin(al), L * Math.cos(al)); seg(ctx, T, 0, 0, -L * Math.sin(al), L * Math.cos(al)); });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.3; ellipse(ctx, T, 0, 1.25 * Math.cos(Math.atan(0.5)), 1.25 * Math.sin(Math.atan(0.5)), 0.08, 0);
    },
    // 05 — a frame turning about its z axis: successive x and y axes
    rbFrames(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.25 * asp, 1.25 * asp, -1.25, 1.25);
      for (let k = 0; k <= 8; k++) { const t = (k * Math.PI) / 16; pick(ctx, c, k === 4); seg(ctx, T, 0, 0, Math.cos(t), Math.sin(t)); seg(ctx, T, 0, 0, -0.7 * Math.sin(t), 0.7 * Math.cos(t)); }
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; curve(ctx, (x) => Math.sqrt(Math.max(1 - x * x, 0)), 0, 1, 80, T);
    },
    // 06 — circles traced by points turning about a tilted axis (exponential coordinates)
    rbExp(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -1.4 * asp, 1.4 * asp, -1.4, 1.4), tilt = 0.5;
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -1.3 * Math.sin(tilt), -1.3 * Math.cos(tilt), 1.3 * Math.sin(tilt), 1.3 * Math.cos(tilt));
      [-0.9, -0.5, -0.1, 0.3, 0.7, 1.0].forEach((z, i) => {
        const rr = Math.sqrt(Math.max(1.1 - z * z * 0.8, 0.05)), cx = z * Math.sin(tilt), cy = z * Math.cos(tilt);
        pick(ctx, c, i === 3); ellipse(ctx, T, cx, cy, rr, 0.32 * rr, -tilt);
      });
    },
    // 07 — helices of equal pitch at several radii about one screw axis
    rbHelix(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, 6.6 * asp / 1.6, -1.3, 1.3);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -1, 0, 12, 0);
      [0.3, 0.55, 0.8, 1.05].forEach((rr, i) => { pick(ctx, c, i === 2); param(ctx, (t) => 0.35 * t, (t) => rr * Math.cos(t), 0, 6 * TAU / 1.6, 500, T); });
    },
    // 08 — screw motions of one radius with increasing pitch
    rbPitch(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, 6.6 * asp / 1.6, -1.3, 1.3);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, -1, 0, 12, 0);
      [0.08, 0.16, 0.3, 0.5, 0.8].forEach((p, i) => { pick(ctx, c, i === 2); param(ctx, (t) => p * t, (t) => (0.35 + 0.15 * i) * Math.cos(t), 0, 11 / p, 600, T); });
    },
    // 09 — reachable points of a 2R arm on a joint-angle grid, with the two boundary circles
    rbWorkspace(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.1 * asp, 2.1 * asp, -2.1, 2.1), L1 = 1.2, L2 = 0.7;
      ctx.fillStyle = c.a;
      for (let i = 0; i < 48; i++) for (let j = 0; j < 20; j++) {
        const t1 = (TAU * i) / 48, t2 = -Math.PI + (TAU * (j + 0.5)) / 20, x = L1 * Math.cos(t1) + L2 * Math.cos(t1 + t2), y = L1 * Math.sin(t1) + L2 * Math.sin(t1 + t2);
        ctx.fillRect(T.X(x) - 1, T.Y(y) - 1, 2, 2);
      }
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.6; ellipse(ctx, T, 0, 0, L1 + L2, L1 + L2, 0); ellipse(ctx, T, 0, 0, L1 - L2, L1 - L2, 0);
    },
    // 10 — velocity ellipses of a 2R arm along an end-effector path
    rbJacobian(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.2, -0.2 + 2.6 * asp, -0.4, 2.2);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1;
      param(ctx, (t) => Math.cos(t) + Math.cos(t + 1.9 - 1.2 * t), (t) => Math.sin(t) + Math.sin(t + 1.9 - 1.2 * t), 0, 1.3, 80, T);
      for (let k = 0; k <= 8; k++) { const t = (1.3 * k) / 8; pick(ctx, c, k === 4); velEllipse(ctx, T, 1, 1, t, 1.9 - 1.2 * t, 0.16); }
    },
    // 11 — manipulability ellipses as the elbow angle opens toward the straight (singular) arm
    rbManip(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.4, -0.4 + 3.4 * asp, -0.9, 1.9);
      [2.6, 2.1, 1.6, 1.1, 0.7, 0.35, 0.12].forEach((t2, i) => {
        const t1 = 0.25 + 0.05 * i, x = Math.cos(t1) + Math.cos(t1 + t2), y = Math.sin(t1) + Math.sin(t1 + t2);
        ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, 0, 0, Math.cos(t1), Math.sin(t1)); seg(ctx, T, Math.cos(t1), Math.sin(t1), x, y);
        pick(ctx, c, i === 3); velEllipse(ctx, T, 1, 1, t1, t2, 0.2);
      });
    },
    // 12 — elbow-up and elbow-down solutions of a 2R arm for targets along a line
    rbIK(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.3, -0.3 + 2.4 * asp, -0.5, 1.9), L1 = 1, L2 = 0.8;
      for (let k = 0; k < 6; k++) {
        const x = 0.7 + 0.2 * k, y = 0.9 - 0.08 * k, c2 = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2);
        if (Math.abs(c2) > 1) continue;
        [1, -1].forEach((sg) => {
          const t2 = Math.atan2(sg * Math.sqrt(1 - c2 * c2), c2), t1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
          pick(ctx, c, sg < 0 && k === 2); if (sg > 0) { ctx.strokeStyle = c.faint2 || c.a; }
          seg(ctx, T, 0, 0, L1 * Math.cos(t1), L1 * Math.sin(t1)); seg(ctx, T, L1 * Math.cos(t1), L1 * Math.sin(t1), x, y);
        });
      }
    },
    // 13 — tip path of an unactuated 2R arm (double pendulum with point masses)
    rbDynamics(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -2.2 * asp, 2.2 * asp, -2.3, 1.6), g = 9.81;
      const acc = (s) => {
        const [t1, t2, w1, w2] = s, c2 = Math.cos(t2), s2 = Math.sin(t2);
        const M = [[1 + (1 + 2 * c2 + 1), c2 + 1], [c2 + 1, 1]];
        const cv = [-s2 * (2 * w1 * w2 + w2 * w2), s2 * w1 * w1];
        const gv = [2 * g * Math.cos(t1) + g * Math.cos(t1 + t2), g * Math.cos(t1 + t2)];
        const r = [-cv[0] - gv[0], -cv[1] - gv[1]], det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        return [w1, w2, (M[1][1] * r[0] - M[0][1] * r[1]) / det, (-M[1][0] * r[0] + M[0][0] * r[1]) / det];
      };
      [[0.2, 0.9], [0.25, 0.9]].forEach((ic, i) => {
        let s = [ic[0], ic[1], 0, 0]; const dt = 0.004;
        ctx.beginPath(); pick(ctx, c, i === 0); ctx.globalAlpha = i === 0 ? 0.9 : 0.5;
        for (let k = 0; k < 2500; k++) {
          const k1 = acc(s), k2 = acc(s.map((v, j) => v + (dt / 2) * k1[j])), k3 = acc(s.map((v, j) => v + (dt / 2) * k2[j])), k4 = acc(s.map((v, j) => v + dt * k3[j]));
          s = s.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
          const x = Math.cos(s[0]) + Math.cos(s[0] + s[1]), y = Math.sin(s[0]) + Math.sin(s[0] + s[1]);
          k ? ctx.lineTo(T.X(x), T.Y(y)) : ctx.moveTo(T.X(x), T.Y(y));
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    },
    // 14 — time scalings s(t): cubic, quintic and trapezoids of several cruise speeds
    rbScaling(ctx, w, h, c) {
      const asp = w / h, T = frame(w, h, -0.08, -0.08 + 1.25 * asp / 1.15, -0.08, 1.1);
      ctx.strokeStyle = c.faint; ctx.lineWidth = 1; seg(ctx, T, 0, 0, 3, 0); seg(ctx, T, 0, 0, 0, 1.05); seg(ctx, T, 1, 0, 1, 1.05);
      const trap = (v) => { const a = v * v / (v - 1); return (t) => (t < v / a ? 0.5 * a * t * t : t > 1 - v / a ? 1 - 0.5 * a * (1 - t) ** 2 : v * t - v * v / (2 * a)); };
      [1.2, 1.35, 1.6, 1.85].forEach((v) => { ctx.strokeStyle = c.a; ctx.lineWidth = 1; curve(ctx, trap(v), 0, 1, 120, T); });
      ctx.strokeStyle = c.b; ctx.lineWidth = 1.9; curve(ctx, (t) => 3 * t * t - 2 * t ** 3, 0, 1, 120, T);
      ctx.lineWidth = 1.4; curve(ctx, (t) => 10 * t ** 3 - 15 * t ** 4 + 6 * t ** 5, 0, 1, 120, T);
    },
  });
})();
