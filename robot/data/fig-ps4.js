/* 로봇공학 그림 — 과제 풀이 Problem Set #4(교재 연습문제 3.17, 3.19, 3.21, 3.23과 그림 4.13, 4.15, 4.16 로봇의 D-H).
   교재 그림을 그대로 옮기지 않고 풀이에 필요한 좌표계·치수만 남겨 다시 그렸습니다. 3차원은 x̂가 앞(왼쪽 아래)으로 보이는 사투영입니다.
   그리는 도구는 core/figkit.js(FK). */
(function () {
  const { fig, L, A, A2, T, C, P, f1 } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  // oblique view: x toward the viewer (drawn down-left), y to the right, z up
  const view = (cx, cy, s, kx = 0.45, ky = 0.35) => (p) => [cx + s * (p[1] - kx * p[0]), cy - s * (p[2] - ky * p[0])];
  const add = (p, q, k = 1) => p.map((v, i) => v + k * q[i]);
  const path = (pts, cls) => P('M' + pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L'), cls);
  const poly = (pts, cls) => path(pts, cls) .replace('"/>', 'Z"/>');
  const tx = (p, s, o = {}) => T(p[0], p[1], s, Object.assign({ s: 11 }, o));
  // a frame: origin o (3D), axes e = [x, y, z] (3D unit vectors), drawn len long; names; label offsets in px
  const frame = (Q, o, e, len, names, cls = 'vl', off = [[0, 0], [0, 0], [0, 0]]) => {
    const O = Q(o);
    let s = C(O[0], O[1], 2.8, 'jt');
    e.forEach((d, i) => { const E = Q(add(o, d, len)), Lb = Q(add(o, d, len * 1.3)); s += A(...O, ...E, cls, 8) + tx([Lb[0] + off[i][0], Lb[1] + 4 + off[i][1]], names[i], { c: 'it' }); });
    return s;
  };
  // circle of radius r about centre c in the plane spanned by unit vectors u, v (3D), as a screen path
  const ring = (Q, c, u, v, r, a0 = 0, a1 = 360, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const a = rad(a0 + ((a1 - a0) * i) / n); return Q(add(add(c, u, r * Math.cos(a)), v, r * Math.sin(a))); });
  const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], nX = [-1, 0, 0], nY = [0, -1, 0], nZ = [0, 0, -1];

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // PS4 · 3.17 — {a} at a corner of the table top, workpiece {d}, camera {c} above it, gripper {b}
    fp4Frames() {
      const Q = view(250, 214, 56);
      let s = poly([Q([0, -0.2, 0]), Q([0, 3.4, 0]), Q([-2.4, 3.4, 0]), Q([-2.4, -0.2, 0])], 'rg') + path([Q([0, -0.2, 0]), Q([0, 3.4, 0]), Q([-2.4, 3.4, 0]), Q([-2.4, -0.2, 0]), Q([0, -0.2, 0])], 'gd');
      s += path([Q([0, -0.2, 0]), Q([0, -0.2, -0.7])], 'gd') + path([Q([0, 3.4, 0]), Q([0, 3.4, -0.7])], 'gd') + path([Q([0, -0.2, -0.7]), Q([0, 3.4, -0.7])], 'gd');
      // workpiece cube at d
      const cube = (o, h) => { const q = (x, y, z) => Q([o[0] + x, o[1] + y, o[2] + z]); return poly([q(0.2, -0.2, h), q(0.2, 0.3, h), q(-0.3, 0.3, h), q(-0.3, -0.2, h)], 'bm2') + poly([q(0.2, -0.2, 0), q(0.2, 0.3, 0), q(0.2, 0.3, h), q(0.2, -0.2, h)], 'bm2'); };
      s += cube([-1, 1, 0], 0.35);
      s += frame(Q, [0, 0, 0], [X, Y, Z], 0.9, ['x̂_a', 'ŷ_a', 'ẑ_a'], 'vl', [[-4, 4], [6, 0], [0, -2]]) + tx(add(Q([0, 0, 0]), [-10, -8]), '{a}', { a: 'end', c: 'em' });
      s += frame(Q, [-1, 1, 0.35], [X, Y, Z], 0.75, ['x̂_d', 'ŷ_d', 'ẑ_d'], 'ld', [[-4, 4], [8, 2], [-12, 4]]) + tx(add(Q([-1, 1, 0.35]), [16, -10]), '{d}', { a: 'start', c: 'em' });
      // camera {c} two above d, gripper {b} four to its left (along x̂_c = ŷ_a)
      const cO = [-1, 1, 2.35], bO = [-1, -3, 2.35];
      s += path([Q(add(cO, Z, 0.25)), Q(add(cO, Z, 0.85))], 'th') + C(...Q(add(cO, Z, 0.25)), 6, 'sp');
      s += frame(Q, cO, [Y, X, nZ], 0.7, ['x̂_c', 'ŷ_c', 'ẑ_c'], 'rx', [[4, 0], [-8, 4], [10, -2]]) + tx(add(Q(cO), [8, -14]), '{c}', { a: 'start', c: 'em' });
      s += path([Q(add(bO, Z, 0.15)), Q(add(bO, Z, 0.75))], 'th') + path([Q(add(add(bO, Y, -0.3), Z, 0.15)), Q(add(add(bO, Y, 0.3), Z, 0.15))], 'th');
      s += frame(Q, bO, [Y, X, nZ], 0.7, ['x̂_b', 'ŷ_b', 'ẑ_b'], 'rx', [[4, 0], [-8, 4], [10, -2]]) + tx(add(Q(bO), [-10, -12]), '{b}', { a: 'end', c: 'em' });
      s += L(...Q(add(bO, Y, 0)), ...Q(add(cO, Y, 0)), 'dm ds');
      // dimensions
      const d1a = Q([0.6, 0, 0]), d1b = Q([0.6, 1, 0]); s += A2(...d1a, ...d1b, 'dm', 6) + tx(add(d1a, [26, 18]), '1');
      const e1 = Q([0, 3.0, 0]), e2 = Q([-1, 3.0, 0]); s += A2(...e1, ...e2, 'dm', 6) + tx(add(mid2(e1, e2), [12, 6]), '1', { a: 'start' }) + L(...Q([-1, 1, 0]), ...Q([-1, 3.0, 0]), 'dm ds');
      const h1 = Q([-1, 3.0, 0.35]), h2 = Q([-1, 3.0, 2.35]); s += A2(...h1, ...h2, 'dm', 6) + tx(add(mid2(h1, h2), [8, 4]), '2', { a: 'start' }) + L(...Q(cO), ...h2, 'dm ds') + L(...Q([-1, 1, 0.35]), ...h1, 'dm ds');
      return fig(560, 292, '작업 공간의 네 좌표계: 탁자 모서리의 {a}, 탁자 위 물체의 {d}, 그 위 2만큼 높이의 카메라 {c}, 그리퍼 {b}',
        s,
        '{a}와 {d}는 축 방향이 같고, {d}는 {a}에서 $\\hat y_a$로 1, $-\\hat x_a$로 1(탁자 앞 모서리에서 안쪽으로 1) 떨어져 있습니다. 카메라 {c}는 $\\hat x_c=\\hat y_a$, $\\hat y_c=\\hat x_a$, $\\hat z_c=-\\hat z_a$(아래를 봄)이고 {d}보다 2 높습니다. {b}는 {c}와 방향이 같고 $\\hat x_c$ 반대쪽으로 4 떨어져 있습니다($T_{bc}$).');
    },
    // PS4 · 3.19 — two satellites: satellite 2 on the equatorial orbit, satellite 1 on an orbit tilted 30° about x̂0
    fp4Sat() {
      // x̂0 drawn steeply down so that neither orbit plane is seen edge-on
      const Q = view(250, 140, 1, 0.25, 0.55), R1 = 92, R2 = 168, c = Math.sqrt(3) / 2, sn = 0.5;
      const n1 = [0, -sn, c], u1 = [0, c, sn]; // orbit-1 normal and the in-plane direction to satellite 1 at t = 0
      let s = path(ring(Q, [0, 0, 0], Y, nX, R2, 180, 360), 'gd') + path(ring(Q, [0, 0, 0], Y, nX, R2, 0, 180), 'dm ds');
      s += path(ring(Q, [0, 0, 0], u1, nX, R1, 180, 360), 'gd') + path(ring(Q, [0, 0, 0], u1, nX, R1, 0, 180), 'dm ds');
      s += C(...Q([0, 0, 0]), 24, 'sp');
      s += L(...Q([0, 0, 0]), ...Q([0, 0, 100]), 'dm ds') + L(...Q([0, 0, 0]), ...Q(n1.map((v) => v * 100)), 'dm ds');
      const z9 = Q([0, 0, 82]), n9 = Q(n1.map((v) => v * 82));
      s += `<path class="dm" d="M${f1(z9[0])},${f1(z9[1])}A82,82 0 0 0 ${f1(n9[0])},${f1(n9[1])}"/>` + tx(add(mid2(z9, n9), [4, 18]), '30°');
      s += frame(Q, [0, 0, 0], [X, Y, Z], 36, ['x̂_0', 'ŷ_0', 'ẑ_0'], 'vl', [[-10, 4], [4, 12], [-12, 6]]) + tx(add(Q([0, 0, 0]), [-30, -10]), '{0}', { a: 'end', c: 'em' });
      const s1 = u1.map((v) => v * R1), s2 = [0, R2, 0];
      s += L(...Q([0, 0, 0]), ...Q(s1), 'dm') + L(...Q([0, 0, 0]), ...Q(s2), 'dm');
      s += tx(add(Q(u1.map((v) => v * R1 * 0.55)), [-4, -6]), 'R₁', { c: 'it', a: 'end' }) + tx(add(Q([0, R2 * 0.62, 0]), [0, 16]), 'R₂', { c: 'it' });
      s += C(...Q(s1), 5, 'dotf') + C(...Q(s2), 6, 'dotf');
      s += frame(Q, s1, [u1.map((v) => -v), n1, nX], 26, ['x̂_1', 'ŷ_1', 'ẑ_1'], 'rx', [[-8, 12], [-8, 0], [6, -2]]) + tx(add(Q(s1), [16, 12]), '위성 1 {1}', { a: 'start', c: 'em' });
      s += frame(Q, s2, [nY, Z, nX], 26, ['x̂_2', 'ŷ_2', 'ẑ_2'], 'rx', [[-2, 14], [10, 2], [8, 0]]) + tx(add(Q(s2), [10, 30]), '위성 2 {2}', { a: 'start', c: 'em' });
      return fig(560, 262, '지구 중심의 {0}과 두 위성: 위성 2는 x̂_0ŷ_0 평면의 궤도, 위성 1은 그 평면을 x̂_0 둘레로 30° 기울인 궤도. t = 0의 모습',
        s,
        '두 위성의 $\\hat x$축은 늘 지구 중심을 향합니다. 이 풀이에서는 $\\hat y_1,\\hat y_2$를 각 궤도 평면의 법선(위쪽), $\\hat z=\\hat x\\times\\hat y$를 진행 방향(속도 $v_1,v_2$의 방향)으로 잡았습니다. $t=0$에 두 위성 모두 $-\\hat x_0$ 쪽(그림의 안쪽)으로 움직입니다. 위성 1 궤도의 법선은 $\\hat z_0$에서 30° 기울어 있습니다.');
    },
    // PS4 · 3.21 — the orbit frame {a}, the space station {c} on the ŷ_a axis with its axis toward the North Star, the spacecraft {b}
    fp4Station() {
      // the whole orbit (radius 800) fits: {a} at its centre, the station on its rim
      const Q = view(226, 176, 0.22, 0.3, 0.45), c = Math.sqrt(3) / 2, sn = 0.5;
      const zc = [0, -sn, c], yc = [0, c, sn], pC = [0, 800, 0], pB = [-100, 300, 500];
      let s = path(ring(Q, [0, 0, 0], Y, nX, 800), 'dm');
      s += C(...Q([0, 0, 0]), 12, 'sp') + frame(Q, [0, 0, 0], [X, Y, Z], 190, ['x̂_a', 'ŷ_a', 'ẑ_a'], 'vl', [[-8, 4], [0, 14], [10, 4]]) + tx(add(Q([0, 0, 0]), [-14, -8]), '{a}', { a: 'end', c: 'em' });
      s += A(...Q([0, 0, 0]), ...Q(pC), 'ld', 9) + tx(add(Q([0, 520, 0]), [0, 16]), 'p', { c: 'it' });
      s += path(ring(Q, pC, yc, X, 130), 'gd') + path(ring(Q, pC, yc, X, 65), 'gd');
      const ns = Q(add(pC, zc, 400));
      s += L(...Q(pC), ...ns, 'dm ds') + tx(add(ns, [6, -4]), '북극성 쪽', { s: 10.5, a: 'start' });
      const a0 = Q(add(pC, Z, 300)), a1 = Q(add(pC, zc, 300));
      s += L(...Q(pC), ...a0, 'dm ds') + `<path class="dm" d="M${f1(a0[0])},${f1(a0[1])}A66,66 0 0 0 ${f1(a1[0])},${f1(a1[1])}"/>` + tx(add(a0, [8, 16]), '30°', { s: 10.5, a: 'start' });
      s += frame(Q, pC, [X, yc, zc], 190, ['x̂_c', 'ŷ_c', 'ẑ_c'], 'rx', [[-6, 6], [6, 2], [10, 6]]) + tx(add(Q(pC), [22, 30]), '{c} 정거장', { a: 'start', c: 'em' });
      s += frame(Q, pB, [Y, nX, Z], 160, ['x̂_b', 'ŷ_b', 'ẑ_b'], 'vl', [[6, 2], [8, 4], [10, 6]]) + tx(add(Q(pB), [-14, -8]), '{b} 우주선', { a: 'end', c: 'em' });
      s += A(...Q(pB), ...Q(pC), 'ld', 9) + tx(add(mid2(Q(pB), Q(pC)), [-10, 4]), 'r', { a: 'end', c: 'it' });
      return fig(560, 268, '궤도 중심의 {a}, ŷ_a 위 800에 있는 우주 정거장 {c}(축 ẑ_c가 북극성 쪽), 우주선 {b}와 정거장까지의 벡터 r',
        s,
        '$\\hat x_c=\\hat x_a$이고 $\\hat y_c,\\hat z_c$는 $\\hat y_a\\hat z_a$ 평면에 있으며, $\\hat z_c$는 $\\hat z_a$에서 $-\\hat y_a$ 쪽으로 30° 기울어 북극성을 향합니다. $r$은 우주선 {b}의 원점에서 정거장 {c}의 원점으로 가는 벡터로 보았습니다.');
    },
    // PS4 · 3.23 — round table seen from above: {0} on the floor, car 1 on the rim, car 2 on a radius
    fp4Cars() {
      const k = 52, Cc = [300, 146], W = (x, y) => [Cc[0] + k * x, Cc[1] - k * y], s2 = Math.SQRT1_2;
      // a frame at o with axes ex, ey in the table plane; each axis name sits at the arrow tip plus its own offset (px)
      const fr = (o, ex, ey, cls, nx, ny, ox, oy, len = 0.55) => {
        const O = W(...o), tip = (e) => W(o[0] + len * e[0], o[1] + len * e[1]);
        return C(O[0], O[1], 3, 'jt') + A(...O, ...tip(ex), cls, 8) + A(...O, ...tip(ey), cls, 8) + tx(add(tip(ex), ox), nx, { c: 'it' }) + tx(add(tip(ey), oy), ny, { c: 'it' });
      };
      let s = C(...Cc, 2 * k, 'rg') + C(...Cc, 2 * k, 'gd') + C(...Cc, 3, 'dotf') + L(...W(-2, 0), ...W(0, 0), 'dm ds') + L(...W(0, -2), ...W(0, 2), 'dm ds');
      s += fr([-1, -1], [1, 0], [0, 1], 'vl', 'x̂_0', 'ŷ_0', [12, 5], [0, -6]) + tx(add(W(-1, -1), [-6, 20]), '{0} (바닥)', { c: 'em' });
      s += A2(...W(-1, -2.22), ...W(0, -2.22), 'dm', 6) + tx(add(W(-0.5, -2.22), [0, 16]), 'L = 1') + A2(...W(0.2, -1), ...W(0.2, 0), 'dm', 6) + tx(add(W(0.2, -0.5), [8, 4]), 'L = 1', { a: 'start' });
      // car 1 at the top of the rim moving counterclockwise (x̂1), car 2 on the radius at 45° moving to the centre (x̂2)
      s += fr([0, 2], [-1, 0], [0, -1], 'rx', 'x̂_1', 'ŷ_1', [-2, -9], [11, 4]) + tx(add(W(0, 2), [12, -12]), '{1} 차 1 (속력 v₁)', { a: 'start', c: 'em' });
      const p2 = [-2 * s2, 2 * s2];
      s += L(...W(...p2), ...W(0, 0), 'dm ds');
      s += fr(p2, [s2, -s2], [s2, s2], 'rx', 'x̂_2', 'ŷ_2', [12, 6], [-9, -2]) + tx(add(W(...p2), [-12, 4]), '{2} 차 2 (속력 v₂)', { a: 'end', c: 'em' });
      s += `<path class="dm" d="M${f1(W(-0.7, 0)[0])},${f1(W(-0.7, 0)[1])}A${f1(0.7 * k)},${f1(0.7 * k)} 0 0 1 ${f1(W(-0.495, 0.495)[0])},${f1(W(-0.495, 0.495)[1])}"/>` + tx(add(W(-0.9, 0.3), [0, 4]), '45°');
      s += tx(add(W(2, 0), [10, 4]), 'R = 2', { a: 'start' }) + tx([476, 258], '탁자 위는 바닥에서 H = 2', { s: 10.5 });
      return fig(560, 290, '위에서 본 둥근 탁자(반지름 2): 바닥의 {0}, 테두리를 도는 차 1의 {1}, 반지름을 따라 중심으로 가는 차 2의 {2}. t = 0의 모습',
        s,
        '{0}은 바닥(탁자 높이 $H=2$ 아래)에 있고 탁자 중심은 {0}에서 $(1,1,2)$입니다. 세 좌표계 모두 $\\hat z$가 위(화면 밖)입니다. 차 1은 $\\hat x_1$ 방향(반시계)으로 테두리를 따라, 차 2는 $\\hat x_2$ 방향으로 반지름을 따라 중심 쪽으로 움직입니다.');
    },
    // PS4 · Fig 4.13 — PRRRRR at its zero configuration with the D-H frames
    fp4Dh413(opt) { // opt 'bare' (the problem): the robot with {0} and {b} only, without the D-H frames
      const bare = opt === 'bare';
      const L1 = 1.4, L2 = 1.1, L3 = 1.1, L4 = 1.5, h = 1.4, E = L1 + L2 + L3 + L4;
      const Q = view(78, 226, 62);
      let s = cube(Q, [0, 0, 0], 0.32);
      s += line(Q, [0, L1, -0.15], [0, L1, h + 0.75], 'dm ds');
      [L1, L1 + L2, L1 + L2 + L3].forEach((y) => { s += line(Q, [0.75, y, h], [-0.9, y, h], 'dm ds'); });
      s += line(Q, [0, E - 0.2, h], [0, E + 0.7, h], 'dm ds');
      s += line(Q, [0, 0, 0], [0, L1, 0], 'th') + line(Q, [0, L1, 0], [0, L1, h], 'th') + line(Q, [0, L1, h], [0, E, h], 'th');
      s += cyl3(Q, [0, L1, 0.45 * h], Z, 0.75 * h, 18) + [L1, L1 + L2, L1 + L2 + L3].map((y) => cyl3(Q, [0, y, h], X, 0.75, 14)).join('') + cyl3(Q, [0, L1 + L2 + L3 + 0.62 * L4, h], Y, 0.55, 14);
      s += A2(...Q([0, 0.25, -0.32]), ...Q([0, 1.1, -0.32]), 'ld', 6) + tx(add(Q([0, 0.68, -0.32]), [0, 16]), 'θ₁ (병진)', { c: 'rl' });
      s += frame(Q, [0, 0, 0], [X, Y, Z], 0.55, ['x̂_0', '', 'ẑ_0'], 'vl', [[-6, 4], [0, 0], [-10, 0]]) + tx(add(Q([0, 0, 0]), [-14, -18]), '{0}', { a: 'end', c: 'em' });
      // D-H frames: x̂_i dashed-blue (ld), ẑ_i (rx)
      const fx = (o, d, lab, off) => A(...Q(o), ...Q(add(o, d, 0.55)), 'ld', 8) + tx(add(Q(add(o, d, 0.72)), off), lab, { c: 'lb', s: 11 });
      const fz = (o, d, lab, off) => A(...Q(o), ...Q(add(o, d, 0.55)), 'rx', 8) + tx(add(Q(add(o, d, 0.72)), off), lab, { c: 'rl', s: 11 });
      const O1 = [0, L1, 0], O2 = [0, L1, h], O4 = [0, L1 + L2, h], O5 = [0, L1 + L2 + L3, h], O6 = [0, E, h];
      if (bare) s += frame(Q, O6, [X, Y, Z], 0.5, ['x̂_b', 'ŷ_b', 'ẑ_b'], 'vl', [[-6, 6], [6, 4], [0, 0]]) + tx(add(Q(O6), [14, 22]), '{b}', { a: 'start', c: 'em' });
      if (!bare) s += fz(O1, Y, 'ẑ₁', [8, 10]) + fx(O1, X, 'x̂₁', [-10, 10]);
      if (!bare) s += fz(O2, Z, 'ẑ₂', [-12, 2]) + fz(O2, nX, 'ẑ₃', [8, -2]) + fx(O2, Y, 'x̂₂ = x̂₃', [2, 16]);
      if (!bare) s += fz(O4, nX, 'ẑ₄', [8, -2]) + fx(O4, Y, 'x̂₄', [0, 16]);
      if (!bare) s += fz(O5, nX, 'ẑ₅', [8, -2]) + fx(O5, Z, 'x̂₅', [-12, 2]);
      if (!bare) s += fz(O6, Y, 'ẑ₆', [10, 4]) + fx(O6, X, 'x̂₆', [-6, 8]) + A(...Q(O6), ...Q(add(O6, Z, 0.55)), 'vl', 8) + tx(add(Q(add(O6, Z, 0.72)), [0, 2]), 'ẑ_b', { c: 'it' });
      if (!bare) [O1, O2, O4, O5, O6].forEach((o) => { s += C(...Q(o), 3.2, 'dotf'); });
      // dimensions along the arm and the height h
      const dy = h + 1.15, ticks = [0, L1, L1 + L2, L1 + L2 + L3, E];
      ticks.forEach((y) => { s += line(Q, [0, y, dy - 0.12], [0, y, dy + 0.12], 'dm'); });
      ['L₁', 'L₂', 'L₃', 'L₄'].forEach((n, i) => { s += A2(...Q([0, ticks[i], dy]), ...Q([0, ticks[i + 1], dy]), 'dm', 6) + tx(add(Q([0, (ticks[i] + ticks[i + 1]) / 2, dy]), [0, -6]), n, { c: 'it' }); });
      s += A2(...Q([0, L1 + 0.42, 0]), ...Q([0, L1 + 0.42, h]), 'dm', 6) + tx(add(Q([0, L1 + 0.42, h / 2]), [6, 4]), 'h', { a: 'start', c: 'it' });
      const jl = (p, d, lab, a = 'middle') => tx(add(Q(p), d), lab, { a, c: 'rl' });
      if (bare) s += jl([0, L1, 0.45 * h], [-16, 4], 'θ₂', 'end') + [L1, L1 + L2, L1 + L2 + L3].map((y, i) => jl([0.55, y, h], [-8, 12], `θ${'₃₄₅'[i]}`, 'end')).join('') + jl([0, L1 + L2 + L3 + 0.62 * L4, h], [-6, -14], 'θ₆');
      return fig(560, 282, '그림 4.13의 PRRRRR 팔(영 자세)과 D-H 좌표계: ẑ_i는 관절 i의 축, x̂_i는 축 i에서 축 i+1로 가는 공통 수선',
        s,
        '관절 1은 $\\hat y_0$ 방향 병진, 관절 2는 수직축, 관절 3–5는 $\\hat x_0$에 나란한 축(양의 방향 $-\\hat x_0$), 관절 6은 팔 방향($\\hat y_0$) 축입니다. 점이 좌표계 {1}–{6}의 원점입니다({2}와 {3}은 같은 점). 끝 좌표계 {b}는 {6}과 원점이 같고 $\\hat x_6$ 둘레로 90° 돌린 것입니다.');
    },
    // PS4 · Fig 4.15 — RRPPRR at its zero configuration with the D-H frames
    fp4Dh415(opt) { // opt 'bare' (the problem): the robot with {0} and {b} only, without the D-H frames
      const bare = opt === 'bare';
      const Lu = 1, Q = view(150, 64, 62);
      let s = line(Q, [0, -0.5, 0], [0, 0.5, 0], 'gd') + [-0.4, -0.2, 0, 0.2, 0.4].map((y) => line(Q, [0, y, 0], [0, y - 0.12, 0.16], 'ht')).join('');
      s += line(Q, [0, 0, 0.5], [0, 0, -2.4], 'dm ds') + line(Q, [0.9, 0, -2], [-0.8, 0, -2], 'dm ds') + line(Q, [0, 3, -0.3], [0, 3, -2.3], 'dm ds') + line(Q, [0, 1.6, -1], [0, 3.5, -1], 'dm ds');
      s += line(Q, [0, 0, 0], [0, 0, -2], 'th') + line(Q, [0, 0, -2], [0, 1, -2], 'th') + line(Q, [0, 1, -2], [0, 1, -1], 'th') + line(Q, [0, 1, -1], [0, 3, -1], 'th') + line(Q, [0, 3, -1], [0, 3, -2], 'th');
      s += cyl3(Q, [0, 0, -0.95], Z, 0.6, 18) + cyl3(Q, [0, 0, -2], X, 0.7, 15) + box(Q, [0, 1, -2], 0.42) + box(Q, [0, 1, -1], 0.42) + cyl3(Q, [0, 2.05, -1], Y, 0.6, 15) + cyl3(Q, [0, 3, -1.42], Z, 0.5, 18);
      s += A(...Q([0, 0.7, -2.45]), ...Q([0, 1.35, -2.45]), 'ld', 7) + tx(add(Q([0, 1.02, -2.45]), [0, 15]), 'θ₃', { c: 'rl' }) + A(...Q([0, 1.42, -1.75]), ...Q([0, 1.42, -1.3]), 'ld', 7) + tx(add(Q([0, 1.42, -1.5]), [8, 4]), 'θ₄', { a: 'start', c: 'rl' });
      s += frame(Q, [0, 0, 0], [X, Y, Z], 0.5, ['x̂_0', 'ŷ_0', 'ẑ_0'], 'vl', [[-6, 4], [4, 4], [0, 0]]) + tx(add(Q([0, 0, 0]), [-16, -8]), '{0}', { a: 'end', c: 'em' });
      const fx = (o, d, lab, off) => A(...Q(o), ...Q(add(o, d, 0.5)), 'ld', 8) + tx(add(Q(add(o, d, 0.66)), off), lab, { c: 'lb', s: 11 });
      const fz = (o, d, lab, off) => A(...Q(o), ...Q(add(o, d, 0.5)), 'rx', 8) + tx(add(Q(add(o, d, 0.66)), off), lab, { c: 'rl', s: 11 });
      const O1 = [0, 0, -2], O3 = [0, 1, -2], O4 = [0, 1, -1], O5 = [0, 3, -1], O6 = [0, 3, -2];
      if (bare) s += frame(Q, O6, [Y, X, nZ], 0.5, ['x̂_b', 'ŷ_b', 'ẑ_b'], 'vl', [[6, 4], [-6, 6], [10, 4]]) + tx(add(Q(O6), [16, -6]), '{b}', { a: 'start', c: 'em' });
      if (!bare) s += fz(O1, Z, 'ẑ₁ = x̂₂', [-28, 8]) + fx(O1, Y, 'x̂₁', [-4, -10]) + fz(O1, X, 'ẑ₂', [-8, 4]);
      if (!bare) s += fz(O3, Y, 'ẑ₃', [6, 14]) + fx(O3, X, 'x̂₃', [-4, 6]);
      if (!bare) s += fz(O4, Z, 'ẑ₄', [-10, 0]) + fx(O4, X, 'x̂₄', [-4, 6]);
      if (!bare) s += fz(O5, Y, 'ẑ₅', [6, -4]) + fx(O5, X, 'x̂₅', [-6, 8]);
      if (!bare) s += fz(O6, nZ, 'ẑ₆ = ẑ_b', [16, 4]) + fx(O6, Y, 'x̂₆ = x̂_b', [16, -2]);
      if (!bare) [O1, O3, O4, O5, O6].forEach((o) => { s += C(...Q(o), 3.2, 'dotf'); });
      s += tx(add(Q([0, 0, -0.5]), [-12, 4]), 'L', { a: 'end', c: 'it' }) + tx(add(Q([0, 0, -1.55]), [10, 4]), 'L', { a: 'start', c: 'it' }) + tx(add(Q([0, 0.3, -2]), [-4, 22]), 'L', { c: 'it' }) + tx(add(Q([0, 1, -1.5]), [-12, 4]), 'L', { a: 'end', c: 'it' }) + tx(add(Q([0, 2.55, -1]), [0, -10]), 'L', { c: 'it' }) + tx(add(Q([0, 3, -1.75]), [10, 4]), 'L', { a: 'start', c: 'it' });
      const jl = (p, d, lab, a = 'middle') => tx(add(Q(p), d), lab, { a, c: 'rl' });
      if (bare) s += jl([0, 0, -0.95], [-16, 4], 'θ₁', 'end') + jl([0.45, 0, -2], [-10, 12], 'θ₂', 'end') + jl([0, 2.05, -1], [0, 24], 'θ₅') + jl([0, 3, -1.42], [-16, 4], 'θ₆', 'end');
      return fig(560, 250, '그림 4.15의 RRPPRR 팔(영 자세)과 D-H 좌표계. 원점(점)은 {1}={2}, {3}, {4}, {5}, {6}={b}',
        s,
        '관절 1은 수직축, 관절 2는 $\\hat x_0$ 방향 축, 관절 3은 $\\hat y_0$ 방향 병진, 관절 4는 수직 병진, 관절 5는 $\\hat y_0$ 방향 축, 관절 6은 아래($-\\hat z_0$)를 향한 축입니다. 병진 관절은 방향만 정해지므로 그 축을 이웃 축과 만나는 선(가로 링크, 두 상자를 잇는 세로 링크)으로 골랐습니다. {2}의 $\\hat x_2$는 $+\\hat z_0$(위)입니다.');
    },
    // PS4 · Fig 4.16 — URRPR at its zero configuration (x̂0 up) with the D-H frames and the common normals of length 2L
    fp4Dh416(opt) { // opt 'bare' (the problem): the robot with {0} and {b} only, without the D-H frames
      const bare = opt === 'bare';
      const r3 = Math.sqrt(3), cx = 196, cy = 296, k = 54;
      const Q = (p) => [cx + k * (-0.62 * p[1] + 0.86 * p[2]), cy - k * (p[0] - 0.34 * p[1] - 0.44 * p[2])];
      const U = [1, 0, 0], J3 = [1 + r3, 0, -1], top = [2 + r3, 0, -1], J4 = [2 + r3, 0, r3 - 1], Bp = [2 + r3, 0, 1 + r3], mid = [1.6, 0, 0], midb = [1.6, 0, -1];
      let s = `<ellipse class="sp" cx="${f1(Q([0, 0, 0])[0])}" cy="${f1(Q([0, 0, 0])[1] + 8)}" rx="44" ry="16"/>` + line(Q, [0, 0, 0], U, 'th');
      s += line(Q, U, mid, 'th') + line(Q, mid, midb, 'th') + line(Q, midb, top, 'th') + line(Q, top, J4, 'th') + line(Q, J4, Bp, 'th');
      s += line(Q, [1, 0, -0.9], [1, 0, 0.9], 'dm ds') + line(Q, [1, -0.9, 0], [1, 0.9, 0], 'dm ds') + line(Q, add(J3, Y, -0.9), add(J3, Y, 0.9), 'dm ds') + line(Q, add(J4, Y, -0.9), add(J4, Y, 0.9), 'dm ds') + line(Q, Bp, add(Bp, Z, 0.6), 'dm ds');
      if (!bare) s += line(Q, U, J3, 'dm') + line(Q, J3, J4, 'dm') + tx(add(Q([1 + r3 / 2, 0, -0.5]), [14, 4]), '2L', { a: 'start', c: 'it' }) + tx(add(Q([1 + r3 + 0.35, 0, -1 + 0.35 * r3]), [0, 22]), '2L', { c: 'it' });
      s += cyl3(Q, U, Z, 0.75, 15) + cyl3(Q, U, Y, 0.75, 15) + cyl3(Q, J3, Y, 0.8, 15) + cyl3(Q, J4, Y, 0.8, 15) + cyl3(Q, add(J4, Z, 1.1), Z, 0.7, 13) + cyl3(Q, add(Bp, Z, -0.2), Z, 0.3, 15);
      s += A(...Q(add(add(J4, Z, 0.8), X, -0.45)), ...Q(add(add(J4, Z, 1.3), X, -0.45)), 'ld', 7) + tx(add(Q(add(add(J4, Z, 1.05), X, -0.45)), [-2, 18]), 'θ₅', { c: 'rl' });
      s += frame(Q, [0, 0, 0], [X, Y, Z], 0.55, ['', 'ŷ_0', 'ẑ_0'], 'vl', [[10, 4], [-4, 6], [6, 6]]) + tx(add(Q([0, 0.5, 0]), [-36, 10]), '{0}', { a: 'end', c: 'em' });
      const fx = (o, d, lab, off) => A(...Q(o), ...Q(add(o, d, 0.6)), 'ld', 8) + tx(add(Q(add(o, d, 0.78)), off), lab, { c: 'lb', s: 11 });
      const fz = (o, d, lab, off) => A(...Q(o), ...Q(add(o, d, 0.6)), 'rx', 8) + tx(add(Q(add(o, d, 0.78)), off), lab, { c: 'rl', s: 11 });
      const x2 = [r3 / 2, 0, -0.5], x3 = [0.5, 0, r3 / 2];
      if (bare) s += frame(Q, Bp, [X, Y, Z], 0.55, ['x̂_b', 'ŷ_b', 'ẑ_b'], 'vl', [[8, 0], [-6, 8], [8, 6]]) + tx(add(Q(Bp), [14, -10]), '{b}', { a: 'start', c: 'em' });
      if (!bare) s += fz(U, Z, 'ẑ₁', [8, 6]) + fx(U, X, 'x̂₁', [10, 2]) + fz(U, Y, 'ẑ₂', [-8, 6]) + fx(U, x2, 'x̂₂', [-16, 10]);
      if (!bare) s += fz(J3, Y, 'ẑ₃', [-8, 6]) + fx(J3, x3, 'x̂₃', [8, 0]);
      if (!bare) s += fz(J4, Y, 'ẑ₄', [-6, 18]) + fz(J4, Z, 'ẑ₅', [4, -8]) + fx(J4, X, 'x̂₄ = x̂₅', [8, -2]);
      if (!bare) s += fz(Bp, Z, 'ẑ₆ = ẑ_b', [10, 10]) + fx(Bp, X, 'x̂₆ = x̂_b', [0, -4]);
      if (!bare) [U, J3, J4, Bp].forEach((o) => { s += C(...Q(o), 3.2, 'dotf'); });
      s += tx(add(Q(U), [-40, 34]), 'U 관절 (θ₁, θ₂)', { a: 'end', s: 10.5 });
      const jl = (p, d, lab, a = 'middle') => tx(add(Q(p), d), lab, { a, c: 'rl' });
      if (bare) s += jl(add(U, Z, 0.45), [12, 14], 'θ₁', 'start') + jl(add(U, Y, 0.45), [-12, 12], 'θ₂', 'end') + jl(add(J3, Y, 0.5), [-10, 8], 'θ₃', 'end') + jl(add(J4, Y, 0.5), [-10, 10], 'θ₄', 'end') + jl(add(Bp, Z, -0.2), [0, -14], 'θ₆');
      return fig(560, 350, '그림 4.16의 URRPR 팔(영 자세, x̂₀이 위)과 D-H 좌표계. 가는 실선은 축 2–3, 축 3–4의 공통 수선(길이 2L)',
        s,
        'U 관절의 두 축(관절 1: $\\hat z_0$ 방향, 관절 2: $\\hat y_0$ 방향)은 {0}에서 $L$ 위의 한 점에서 만납니다. 관절 2, 3, 4의 축은 모두 $\\hat y_0$에 나란하고, 이웃 축 사이의 공통 수선은 각각 수직에서 30°, 수평에서 30° 기운 길이 $2L$의 선분입니다. 관절 5는 팔 방향($\\hat z_0$) 병진, 관절 6은 같은 선을 축으로 도는 회전 관절입니다.');
    },
  });
  function mid2(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function line(Q, p, q, cls) { return L(...Q(p), ...Q(q), cls); }
  // a joint housing: a cylinder of length len along the 3D direction d at p, seen from the side (a rounded rectangle)
  function cyl3(Q, p, d, len, w) {
    const a = Q(add(p, d, -len / 2)), b = Q(add(p, d, len / 2)), c = mid2(a, b), l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l < 6) return C(c[0], c[1], w / 2, 'sp');
    const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    return `<rect class="sp" x="${f1(c[0] - l / 2)}" y="${f1(c[1] - w / 2)}" width="${f1(l)}" height="${f1(w)}" rx="4" transform="rotate(${f1(ang)} ${f1(c[0])} ${f1(c[1])})"/>`;
  }
  // a block (prismatic joint housing) centred at p with half-size e
  function box(Q, p, e) {
    const q = (x, y, z) => Q([p[0] + x, p[1] + y, p[2] + z]);
    return poly([q(e, -e, -e * 0.6), q(e, e, -e * 0.6), q(e, e, e * 0.6), q(e, -e, e * 0.6)], 'sp') + poly([q(e, -e, e * 0.6), q(e, e, e * 0.6), q(-e, e, e * 0.6), q(-e, -e, e * 0.6)], 'sp') + poly([q(e, e, -e * 0.6), q(-e, e, -e * 0.6), q(-e, e, e * 0.6), q(e, e, e * 0.6)], 'sp');
  }
  function cube(Q, p, e) { return box(Q, add(p, [0, -e, 0]), e); }
})();
