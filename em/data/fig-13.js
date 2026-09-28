/* 13 복소적분 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, PI } = window.EMG;
  const FK = window.FK;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 80) => rng(a0, a1, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  // arrowhead on a polyline at fraction `at`
  const midA = (X, Y, pts, c = 'ld', at = 0.5) => { const i = Math.max(1, Math.min(pts.length - 1, Math.round(at * (pts.length - 1)))); const p = pts[i - 1], q = pts[i]; const dx = X(q[0]) - X(p[0]), dy = Y(q[1]) - Y(p[1]), d = Math.hypot(dx, dy) || 1; return FK.A(X(q[0]) - (dx / d) * 5, Y(q[1]) - (dy / d) * 5, X(q[0]) + (dx / d) * 4, Y(q[1]) + (dy / d) * 4, c, 8); };
  const blob = (cx, cy, a, b, n = 160) => rng(0, 2 * PI, n).map((t) => [cx + a * Math.cos(t) + 0.12 * a * Math.cos(2 * t), cy + b * Math.sin(t) + 0.08 * b * Math.sin(3 * t)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 14.1 definition by sums over a subdivided path; path dependence of a non-analytic integrand
    f13path() {
      const cz = (t) => [0.2 + 2.6 * t, 0.3 + 1.5 * Math.sin(2.2 * t) + 0.2 * t];
      const pts = rng(0, 1, 120).map(cz), zs = rng(0, 1, 7).map(cz);
      return G2(560, 230, '복소 선적분', [
        { w: 290, h: 230, x: [0, 3.1], y: [-0.1, 2.3], axes: false, title: '(a) 분할과 합 Σ f(ζ_m) Δz_m', m: [22, 8, 8, 8],
          c: [{ pts, c: 'ld' }, { pts: zs, c: 'rx ds' }],
          extra: (X, Y) => zs.map((p, i) => dot(X, Y, p[0], p[1]) + (i === 0 ? FK.T(X(p[0]) - 2, Y(p[1]) + 16, 'z₀', { c: 'em' }) : i === zs.length - 1 ? FK.T(X(p[0]) + 6, Y(p[1]) + 4, 'Z = z_n', { a: 'start', c: 'em' }) : '')).join('')
            + FK.A(X(zs[2][0]), Y(zs[2][1]), X(zs[3][0]), Y(zs[3][1]), 'rx', 8) + FK.T(X((zs[2][0] + zs[3][0]) / 2) + 6, Y((zs[2][1] + zs[3][1]) / 2) - 8, 'Δz₃', { a: 'start', c: 'rl' }) + midA(X, Y, pts, 'ld', 0.82) },
        { ox: 290, w: 270, h: 230, x: [-0.3, 2.4], y: [-0.25, 1.35], title: '(b) f = Im z, 0 → 2 + i', xl: 'x', yl: 'y', xt: [[1, '1'], [2, '2']], yt: [[1, '1']], m: [22, 10, 18, 18],
          c: [{ pts: [[0, 0], [2, 1]], c: 'ld' }, { pts: [[0, 0], [2, 0], [2, 1]], c: 'rx' }],
          extra: (X, Y) => midA(X, Y, [[0, 0], [1, 0.5]], 'ld', 1) + midA(X, Y, [[0, 0], [1.1, 0]], 'rx', 1) + midA(X, Y, [[2, 0], [2, 0.6]], 'rx', 1) + dot(X, Y, 2, 1)
            + FK.T(X(0.95), Y(0.62), 'C*: 1 + i/2', { a: 'end', c: 'lb' }) + FK.T(X(1.6), Y(0) + 16, 'C₁ + C₂: i/2', { c: 'rl' }) + FK.T(X(2) + 6, Y(1) - 4, '2 + i', { a: 'start', c: 'em' }) },
      ], R`(a) 경로를 점 $z_0,z_1,\dots,z_n$으로 나누고, 각 조각의 한 점 $\zeta_m$에서의 값에 $\Delta z_m=z_m-z_{m-1}$ (주황 현)을 곱해 더한 뒤, 가장 큰 $|\Delta z_m|$을 0으로 보낸 극한이 선적분입니다. (b) 해석적이 아닌 $\operatorname{Im}z$를 적분하면 끝점이 같아도 경로에 따라 값이 다릅니다.`);
    },
    // 14.2 simply and multiply connected domains
    f13conn() {
      const box = { w: 186.7, h: 180, x: [-2.1, 2.1], y: [-1.75, 1.95], axes: false, m: [22, 4, 4, 4] };
      const outer = blob(0, 0, 1.7, 1.35);
      const hole = (cx, cy, r) => arc(r, 2 * PI, 0, cx, cy, 60);
      return G2(560, 180, '단순연결과 다중연결', [
        Object.assign({}, box, { title: '단순연결', c: [{ pts: outer, c: 'fl2' }, { pts: outer, c: 'ld' }] }),
        Object.assign({}, box, { ox: 186.7, title: '이중연결 (구멍 1개)', c: [{ pts: outer.concat([null], hole(0.1, 0, 0.55)), c: 'fl2' }, { pts: outer, c: 'ld' }, { pts: hole(0.1, 0, 0.55), c: 'ld' }] }),
        Object.assign({}, box, { ox: 373.4, title: '삼중연결 (구멍 2개)', c: [{ pts: outer.concat([null], hole(-0.7, 0.1, 0.4), [null], hole(0.75, -0.1, 0.35)), c: 'fl2' }, { pts: outer, c: 'ld' }, { pts: hole(-0.7, 0.1, 0.4), c: 'ld' }, { pts: hole(0.75, -0.1, 0.35), c: 'ld' }] }),
      ], R`단순연결 영역에서는 모든 단순닫힌경로가 영역의 점만 둘러쌉니다. 구멍이 있으면(구멍은 한 점일 수도, 선분일 수도 있음) 구멍을 두르는 경로가 영역 밖의 점을 둘러싸므로 다중연결입니다. 구멍이 $p-1$개인 유계 영역을 $p$중연결이라 합니다.`);
    },
    // 14.2–14.3 deformation to a small circle; cuts for a doubly connected domain
    f13deform() {
      const C = blob(0, 0, 1.6, 1.25), z0 = [0.25, 0.1];
      const outer = arc(1.6, 0, 2 * PI, 0, 0, 120), inner = arc(0.6, 2 * PI, 0, 0, 0, 80);
      return G2(560, 240, '경로 변형과 자르기', [
        { w: 280, h: 240, x: [-2.0, 2.0], y: [-1.55, 1.75], axes: false, title: '(a) C를 작은 원 K로 줄이기', m: [22, 6, 6, 6],
          c: [{ pts: C, c: 'ld' }, { pts: arc(0.45, 0, 2 * PI, z0[0], z0[1], 60), c: 'rx' }, { pts: arc(0.95, 0.3, 2 * PI - 0.3, z0[0], z0[1], 60), c: 'dm ds' }],
          extra: (X, Y) => dot(X, Y, z0[0], z0[1]) + midA(X, Y, C, 'ld', 0.2) + midA(X, Y, C, 'ld', 0.7) + midA(X, Y, arc(0.45, 0, 2 * PI, z0[0], z0[1], 60), 'rx', 0.3)
            + FK.T(X(z0[0]) + 6, Y(z0[1]) + 14, 'z₀', { a: 'start', c: 'em' }) + FK.T(X(1.5), Y(1.05), 'C', { a: 'start', c: 'lb' }) + FK.T(X(z0[0] + 0.3), Y(z0[1] + 0.45) - 2, 'K', { a: 'start', c: 'rl' })
            + FK.L(X(z0[0]), Y(z0[1]), X(z0[0] + 0.45 * Math.cos(-0.9)), Y(z0[1] + 0.45 * Math.sin(-0.9)), 'vl') + FK.T(X(z0[0] + 0.35), Y(z0[1] - 0.5), 'ρ', { a: 'start', c: 'it' }) },
        { ox: 280, w: 280, h: 240, x: [-2.0, 2.0], y: [-1.55, 1.75], axes: false, title: '(b) 이중연결 영역의 자르기', m: [22, 6, 6, 6],
          c: [{ pts: outer.concat([null], inner), c: 'fl' }, { pts: outer, c: 'ld' }, { pts: inner, c: 'rx' }, { pts: [[0.62, 0.08], [1.58, 0.08]], c: 'vl' }, { pts: [[1.58, -0.08], [0.62, -0.08]], c: 'vl' }, { pts: [[-0.62, 0.08], [-1.58, 0.08]], c: 'vl' }, { pts: [[-1.58, -0.08], [-0.62, -0.08]], c: 'vl' }],
          extra: (X, Y) => midA(X, Y, outer, 'ld', 0.25) + midA(X, Y, outer, 'ld', 0.75) + midA(X, Y, inner, 'rx', 0.25) + midA(X, Y, inner, 'rx', 0.75)
            + FK.A(X(0.9), Y(0.08), X(1.25), Y(0.08), 'vl', 6) + FK.A(X(1.3), Y(-0.08), X(0.95), Y(-0.08), 'vl', 6) + FK.A(X(-1.3), Y(0.08), X(-0.95), Y(0.08), 'vl', 6) + FK.A(X(-0.9), Y(-0.08), X(-1.25), Y(-0.08), 'vl', 6)
            + FK.T(X(1.2), Y(1.2), 'C₁', { a: 'start', c: 'lb' }) + FK.T(X(0), Y(0) + 4, 'C₂', { c: 'rl' }) + FK.T(X(0), Y(1.05), 'D₁', { c: 'it' }) + FK.T(X(0), Y(-1.15), 'D₂', { c: 'it' }) },
      ], R`(a) $f(z)/(z-z_0)$처럼 $z_0$에서만 해석적이 아니면, 경로 $C$를 $z_0$을 지나지 않게 연속적으로 줄여 작은 원 $K$로 바꿔도 적분값이 같습니다(경로 변형 원리). 코시 적분 공식의 증명은 $K$의 반지름 $\rho\to0$을 씁니다. (b) 두 개의 자름(검은 선)으로 고리를 단순연결인 두 조각 $D_1$, $D_2$로 나누면, 자른 선 위의 적분은 반대 방향으로 두 번씩 나와 지워지고 바깥 $C_1$ (반시계)과 안쪽 $C_2$ (시계)만 남습니다.`);
    },
    // 14.3 which singularities a contour encloses
    f13contours() {
      const cs = [[1, 0, 0.8, '(a)'], [-1, 0, 0.8, '(b)'], [0, 0, 1.9, '(c)'], [3.5, 0.9, 0.7, '(d)']];
      return G({
        w: 440, h: 260, x: [-2.6, 4.8], y: [-2.15, 2.05], xl: 'x', yl: 'y', xt: [[-1, '−1'], [1, '1']], m: [8, 10, 16, 14], label: '특이점과 경로',
        c: cs.map(([cx, cy, r]) => ({ pts: arc(r, 0, 2 * PI, cx, cy, 100), c: r === 1.9 ? 'ld' : 'rx' })),
        extra: (X, Y) => dot(X, Y, 1, 0, true) + dot(X, Y, -1, 0, true) + cs.map(([cx, cy, r, l]) => midA(X, Y, arc(r, 0, 2 * PI, cx, cy, 100), r === 1.9 ? 'ld' : 'rx', 0.15) + FK.T(X(cx + r * 0.72) + 4, Y(cy + r * 0.72) - 2, l, { a: 'start', c: 'em' })).join(''),
        cap: R`$g(z)=\frac{z+2}{z^2-1}$은 $z=\pm1$ (빈 점)에서 해석적이 아닙니다. (a) $1$만, (b) $-1$만, (c) 둘 다 둘러싸고, (d)는 아무것도 둘러싸지 않습니다. 코시 적분 공식을 쓸 때 **경로 안에 있는 특이점만** 분모에 남기고 나머지는 $f(z)$에 넣습니다.`,
      });
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
