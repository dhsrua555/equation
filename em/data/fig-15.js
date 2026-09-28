/* 15 등각사상 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, PI } = window.EMG;
  const FK = window.FK;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 80) => rng(a0, a1, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  // complex helpers on [re, im]
  const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cd = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const map = (f, pts) => pts.map((p) => (p ? f(p) : null));
  const cut = (pts, lim) => pts.map((p) => (p && Math.abs(p[0]) < lim && Math.abs(p[1]) < lim ? p : null));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 17.1 w = z²: the grid of the first quadrant becomes two orthogonal families of parabolas
    f15z2() {
      const cs = [0.5, 1, 1.5], sq = (p) => [p[0] * p[0] - p[1] * p[1], 2 * p[0] * p[1]];
      const vx = cs.map((c) => rng(0, 2, 60).map((y) => [c, y])), hy = cs.map((k) => rng(0, 2, 60).map((x) => [x, k]));
      return G2(560, 240, 'w = z²의 사상', [
        { w: 240, h: 240, x: [-0.2, 2.2], y: [-0.2, 2.2], title: '(a) z 평면', xl: 'x', yl: 'y', xt: [[1, '1'], [2, '2']], yt: [[1, '1'], [2, '2']], m: [22, 10, 16, 16],
          c: vx.map((p) => ({ pts: p, c: 'ld' })).concat(hy.map((p) => ({ pts: p, c: 'rx' }))) },
        { ox: 250, w: 310, h: 240, x: [-4.92, 4.92], y: [-0.4, 6.6], title: '(b) w 평면: 서로 직교하는 포물선', xl: 'u', yl: 'v', xt: [[-4, '−4'], [4, '4']], yt: [[3, '3'], [6, '6']], m: [22, 10, 16, 16],
          c: vx.map((p) => ({ pts: map(sq, p), c: 'ld' })).concat(hy.map((p) => ({ pts: map(sq, p), c: 'rx' }))) },
      ], R`세로선 $x=c$ (파랑)는 왼쪽으로 열린 포물선 $v^2=4c^2(c^2-u)$로, 가로선 $y=k$ (주황)는 오른쪽으로 열린 포물선 $v^2=4k^2(k^2+u)$로 갑니다. 격자의 직각이 상에서도 직각으로 남는 것이 등각성입니다. 다만 원점($f'(0)=0$)에서는 각이 두 배가 되어, 1사분면(각 $90^\circ$) 전체가 위쪽 반평면(각 $180^\circ$)으로 펴집니다.`);
    },
    // 17.1 Joukowski map: circles to ellipses, an offset circle to an airfoil
    f15jouk() {
      const J = (p) => { const d = p[0] * p[0] + p[1] * p[1]; return [p[0] + p[0] / d, p[1] - p[1] / d]; };
      const c0 = [-0.12, 0.15], R0 = Math.hypot(1 - c0[0], c0[1]);
      const rs = [1.3, 1.7];
      return G2(560, 230, '주코프스키 사상', [
        { w: 250, h: 230, x: [-2.3, 2.3], y: [-1.85, 2.02], title: '(a) z 평면', xl: 'x', yl: 'y', xt: [[-1, '−1'], [1, '1']], m: [22, 8, 16, 14],
          c: [{ pts: arc(1, 0, 2 * PI), c: 'dm ds' }].concat(rs.map((r) => ({ pts: arc(r, 0, 2 * PI), c: 'ld' })), [{ pts: arc(R0, 0, 2 * PI, c0[0], c0[1], 160), c: 'rx' }]),
          extra: (X, Y) => dot(X, Y, 1, 0) + dot(X, Y, -1, 0) },
        { ox: 250, w: 310, h: 230, x: [-3.15, 3.15], y: [-2.0, 2.2], title: '(b) w = z + 1/z', xl: 'u', yl: 'v', xt: [[-2, '−2'], [2, '2']], m: [22, 8, 16, 14],
          c: [{ pts: [[-2, 0], [2, 0]], c: 'vl' }].concat(rs.map((r) => ({ pts: map(J, arc(r, 0, 2 * PI, 0, 0, 160)), c: 'ld' })), [{ pts: map(J, arc(R0, 0, 2 * PI, c0[0], c0[1], 400)), c: 'rx' }]),
          extra: (X, Y) => dot(X, Y, 2, 0) + dot(X, Y, -2, 0) + FK.T(X(0), Y(0.3) - 10, '에어포일', { c: 'rl' }) },
      ], R`원 $|z|=r$ ($r>1$, 파랑)은 초점이 $\pm2$인 타원으로 가고, 단위원(점선)은 선분 $[-2,2]$ (검은 선)로 납작해집니다. 임계점 $z=1$을 지나고 중심이 조금 비켜난 원(주황)은 뒷전이 뾰족한 날개 단면(주코프스키 에어포일)이 됩니다. 뾰족한 점은 각을 두 배로 만드는 임계점 $z=1$의 상입니다.`);
    },
    // 17.2 inversion w = 1/z: lines become circles through the origin
    f15inv() {
      const inv = (p) => cd([1, 0], p);
      const cs = [-1, -0.5, 0.5, 1];
      const vl = cs.map((c) => rng(-6, 6, 400).map((y) => [c, y])), hl = cs.map((k) => rng(-6, 6, 400).map((x) => [x, k]));
      return G2(560, 240, '반전 w = 1/z', [
        { w: 270, h: 240, x: [-2.2, 2.2], y: [-1.75, 1.83], title: '(a) z 평면의 직선', xl: 'x', yl: 'y', xt: [[-1, '−1'], [1, '1']], yt: [[1, '1']], m: [22, 8, 16, 14],
          c: [{ pts: arc(1, 0, 2 * PI), c: 'dm ds' }].concat(vl.map((p) => ({ pts: p, c: 'ld' })), hl.map((p) => ({ pts: p, c: 'rx' }))) },
        { ox: 280, w: 280, h: 240, x: [-2.2, 2.2], y: [-1.7, 1.75], title: '(b) w 평면: 원점을 지나는 원', xl: 'u', yl: 'v', xt: [[-1, '−1'], [1, '1']], yt: [[1, '1']], m: [22, 8, 16, 14],
          c: [{ pts: arc(1, 0, 2 * PI), c: 'dm ds' }].concat(vl.map((p) => ({ pts: cut(map(inv, p), 3), c: 'ld' })), hl.map((p) => ({ pts: cut(map(inv, p), 3), c: 'rx' }))) },
      ], R`원점을 지나지 않는 직선 $x=c$는 원점을 지나는 원 $\big|w-\frac1{2c}\big|=\frac1{2|c|}$로, $y=k$는 $\big|w+\frac i{2k}\big|=\frac1{2|k|}$로 갑니다. 단위원(점선)은 자기 자신으로 가지만 안쪽과 바깥쪽이 뒤바뀝니다. 직선을 “무한원점을 지나는 원”으로 보면, 반전은 원을 원으로 보내는 사상입니다.`);
    },
    // 17.3 upper half-plane onto the unit disk by w = (z − i)/(z + i)
    f15cayley() {
      const T = (p) => cd([p[0], p[1] - 1], [p[0], p[1] + 1]);
      const xs = [-2, -1, -0.5, 0, 0.5, 1, 2], ys = [0.25, 0.5, 1, 2];
      const vl = xs.map((c) => rng(0, 30, 600).map((y) => [c, y])), hl = ys.map((k) => rng(-40, 40, 1600).map((x) => [x, k]));
      return G2(560, 240, '반평면에서 원판으로', [
        { w: 280, h: 240, x: [-2.4, 2.4], y: [-0.3, 2.6], title: '(a) 위쪽 반평면', xl: 'x', yl: 'y', xt: [[-2, '−2'], [2, '2']], yt: [[1, 'i']], m: [22, 8, 16, 16],
          c: vl.map((p) => ({ pts: p, c: 'ld' })).concat(hl.map((p) => ({ pts: p, c: 'rx' }))), extra: (X, Y) => dot(X, Y, 0, 1) },
        { ox: 280, w: 280, h: 240, x: [-1.4, 1.6], y: [-1.15, 1.22], title: '(b) w = (z − i)/(z + i)', xl: 'u', yl: 'v', m: [22, 8, 16, 16],
          c: [{ pts: arc(1, 0, 2 * PI, 0, 0, 160), c: 'vl' }].concat(vl.map((p) => ({ pts: map(T, p), c: 'ld' })), hl.map((p) => ({ pts: map(T, p), c: 'rx' }))), extra: (X, Y) => dot(X, Y, 0, 0) + FK.T(X(0) + 6, Y(0) + 14, 'i의 상', { a: 'start', c: 'em' }) + dot(X, Y, 1, 0, true) + FK.T(X(1) + 4, Y(0) - 12, '∞의 상', { a: 'start' }) },
      ], R`실수축은 단위원으로, $z=i$는 중심 0으로 가므로 위쪽 반평면 전체가 원판 안으로 들어갑니다. 세로선(파랑)과 가로선(주황)은 모두 $w=1$ ($z=\infty$의 상)을 지나는 원호가 되고, 두 족은 여전히 직교합니다.`);
    },
    // 17.4 w = sin z: vertical lines to hyperbolas, horizontal lines to ellipses
    f15sin() {
      const S = (p) => [Math.sin(p[0]) * Math.cosh(p[1]), Math.cos(p[0]) * Math.sinh(p[1])];
      const xs = [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2], ys = [-1, -0.5, 0.5, 1];
      const vl = xs.map((c) => rng(-1.3, 1.3, 80).map((y) => [c, y])), hl = ys.map((k) => rng(-PI / 2, PI / 2, 120).map((x) => [x, k]));
      return G2(560, 230, 'w = sin z의 사상', [
        { w: 270, h: 230, x: [-2.0, 2.0], y: [-1.6, 1.6], title: '(a) 띠 −π/2 < x < π/2', xl: 'x', yl: 'y', xt: [[-PI / 2, '−π/2'], [PI / 2, 'π/2']], m: [22, 8, 16, 14],
          c: [{ pts: [[-PI / 2, -1.5], [-PI / 2, 1.5]], c: 'dm ds' }, { pts: [[PI / 2, -1.5], [PI / 2, 1.5]], c: 'dm ds' }].concat(vl.map((p) => ({ pts: p, c: 'ld' })), hl.map((p) => ({ pts: p, c: 'rx' }))) },
        { ox: 280, w: 280, h: 230, x: [-2.4, 2.4], y: [-1.78, 1.79], title: '(b) w 평면', xl: 'u', yl: 'v', xt: [[-1, '−1'], [1, '1']], m: [22, 8, 16, 14],
          c: vl.map((p) => ({ pts: map(S, p), c: 'ld' })).concat(hl.map((p) => ({ pts: map(S, p), c: 'rx' })), [{ pts: [[1, 0], [2.4, 0]], c: 'vl' }, { pts: [[-2.4, 0], [-1, 0]], c: 'vl' }]),
          extra: (X, Y) => dot(X, Y, 1, 0, true) + dot(X, Y, -1, 0, true) },
      ], R`$u=\sin x\cosh y$, $v=\cos x\sinh y$에서 세로선 $x=c$는 쌍곡선 $\frac{u^2}{\sin^2c}-\frac{v^2}{\cos^2c}=1$ (파랑)으로, 가로선 $y=k$는 초점이 $\pm1$인 타원 $\frac{u^2}{\cosh^2k}+\frac{v^2}{\sinh^2k}=1$ (주황)로 갑니다. 띠의 경계 $x=\pm\frac\pi2$는 반직선 $u\ge1$, $u\le-1$ (검은 선)로 접히고, 그 끝 $\pm1$이 임계점 $\pm\frac\pi2$의 상입니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
