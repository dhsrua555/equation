/* 09 벡터 적분과 적분 정리 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, PI } = window.EMG;
  const FK = window.FK;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 60) => rng(a0, a1, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  // arrowhead in the middle of a polyline (data coordinates)
  const midA = (X, Y, pts, c = 'ld', at = 0.5) => { const i = Math.max(1, Math.min(pts.length - 1, Math.round(at * (pts.length - 1)))); const p = pts[i - 1], q = pts[i]; const dx = X(q[0]) - X(p[0]), dy = Y(q[1]) - Y(p[1]), d = Math.hypot(dx, dy) || 1; return FK.A(X(q[0]) - (dx / d) * 5, Y(q[1]) - (dy / d) * 5, X(q[0]) + (dx / d) * 4, Y(q[1]) + (dy / d) * 4, c, 8); };
  function quiver(X, Y, f, xs, ys, len, ref, c = 'dm') {
    let s = '';
    xs.forEach((x) => ys.forEach((y) => {
      const v = f(x, y);
      if (!v) return;
      const m = Math.hypot(v[0], v[1]);
      if (m < 1e-9) return;
      const px = X(x), py = Y(y);
      let dx = X(x + v[0] * 1e-3) - px, dy = Y(y + v[1] * 1e-3) - py;
      const d = Math.hypot(dx, dy); dx /= d; dy /= d;
      const l = len * Math.min(1, m / ref);
      if (l < 4) return;
      s += FK.A(px - (dx * l) / 2, py - (dy * l) / 2, px + (dx * l) / 2, py + (dy * l) / 2, c, Math.min(6, 2.5 + l / 4));
    }));
    return s;
  }
  // orthographic view from azimuth az, elevation el: p() gives screen coordinates, d() depth toward the viewer
  const view = (az, el) => {
    const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el);
    return { p: ([x, y, z]) => [-x * sa + y * ca, z * ce - (x * ca + y * sa) * se], v: [ca * ce, sa * ce, se] };
  };
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  // split a 3-D polyline into visible (front) and hidden parts by the sign of test(q)
  function split(V, pts, test, cf, cb) {
    const out = [];
    let cur = [], st = null;
    pts.forEach((q) => {
      const s = test(q) >= 0;
      if (st !== null && s !== st) { if (cur.length > 1) out.push({ pts: cur, c: st ? cf : cb }); cur = [cur[cur.length - 1]]; }
      cur.push(V.p(q)); st = s;
    });
    if (cur.length > 1) out.push({ pts: cur, c: st ? cf : cb });
    return out.filter((c) => c.c);
  }
  const A3 = (X, Y, V, p, q, c = 'rx', h = 8) => { const P = V.p(p), Q = V.p(q); return FK.A(X(P[0]), Y(P[1]), X(Q[0]), Y(Q[1]), c, h); };
  const T3 = (X, Y, V, p, s, dx = 0, dy = 0, o = {}) => { const P = V.p(p); return FK.T(X(P[0]) + dx, Y(P[1]) + dy, s, o); };
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const mul = (c, a) => a.map((v) => c * v);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 10.1/10.2 path dependence; a domain that is not simply connected
    f09paths() {
      const c1 = rng(0, 1, 40).map((t) => [t, t]), c2 = rng(0, 1, 40).map((t) => [t, t * t]);
      const ring = (r) => arc(r, 0, 2 * PI, 0, 0, 120);
      return G2(560, 240, '경로에 따라 달라지는 선적분', [
        { w: 270, h: 240, x: [-0.25, 1.3], y: [-0.25, 1.3], axes: false, title: '(a) F = [y, −x]: 끝점이 같아도 값이 다름', m: [22, 8, 8, 8],
          c: [{ pts: c1, c: 'ld' }, { pts: c2, c: 'rx' }],
          extra: (X, Y) => quiver(X, Y, (x, y) => [y, -x], rng(-0.15, 1.2, 7), rng(-0.15, 1.2, 7), 20, 1.2) + midA(X, Y, c1, 'ld', 0.55) + midA(X, Y, c2, 'rx', 0.6)
            + dot(X, Y, 0, 0) + dot(X, Y, 1, 1) + FK.T(X(0) - 6, Y(0) + 14, 'A', { a: 'end', c: 'em' }) + FK.T(X(1) + 6, Y(1) - 6, 'B', { a: 'start', c: 'em' })
            + FK.T(X(0.42) - 6, Y(0.55), 'C₁: 0', { a: 'end', c: 'lb' }) + FK.T(X(0.72) + 8, Y(0.4), 'C₂: −1/3', { a: 'start', c: 'rl' }) },
        { ox: 290, w: 270, h: 240, x: [-1.94, 1.94], y: [-1.55, 1.65], axes: false, title: '(b) 구멍이 있는 영역', m: [22, 8, 8, 8],
          c: [{ pts: ring(1.5).concat([null], ring(0.45).reverse()), c: 'fl' }, { pts: ring(1.5), c: 'dm' }, { pts: ring(0.45), c: 'dm' }, { pts: ring(1), c: 'rx' }],
          extra: (X, Y) => quiver(X, Y, (x, y) => { const r2 = x * x + y * y; return r2 < 0.3 || r2 > 2.4 ? null : [-y / r2, x / r2]; }, rng(-1.4, 1.4, 8), rng(-1.4, 1.4, 8), 18, 1) + midA(X, Y, ring(1), 'rx', 0.12) + midA(X, Y, ring(1), 'rx', 0.62)
            + dot(X, Y, 0, 0) + FK.T(X(0), Y(0) + 14, '원점 제외', { c: 'em' }) + FK.T(X(0.75) + 4, Y(0.95) - 4, '∮ = 2π', { a: 'start', c: 'rl' }) },
      ], R`(a) 소용돌이 모양의 장 $\mathbf F=[y,-x]$를 $A$에서 $B$까지 적분하면 직선 $C_1$에서는 0, 포물선 $C_2$에서는 $-\frac13$입니다. (b) $\mathbf F=\big[\frac{-y}{x^2+y^2},\frac{x}{x^2+y^2}\big]$는 원점을 뺀 곳에서 회전이 0이지만, 원점을 한 바퀴 도는 원에서의 적분은 $2\pi$입니다. 원을 영역 안에서 한 점으로 줄일 수 없기(구멍을 지나야 하므로) 때문입니다.`);
    },
    // 10.3 polar coordinates: a rectangle in the rθ-plane and its image
    f09jac() {
      const rs = rng(1, 2, 5), ts = rng(0, PI / 2, 7);
      const cell = { r0: 1.5, r1: 1.75, t0: ts[3], t1: ts[4] };
      const img = (r, t) => [r * Math.cos(t), r * Math.sin(t)];
      const cellImg = [].concat(rng(cell.t0, cell.t1, 12).map((t) => img(cell.r0, t)), rng(cell.t1, cell.t0, 12).map((t) => img(cell.r1, t)));
      return G2(560, 250, '극좌표의 넓이 요소', [
        { w: 270, h: 250, x: [0, 2.5], y: [-0.15, 1.9], title: '(a) rθ 평면의 직사각형 R*', xt: [[1, '1'], [2, '2']], yt: [[PI / 4, 'π/4'], [PI / 2, 'π/2']], xl: 'r', yl: 'θ', m: [22, 10, 20, 30],
          c: rs.map((r) => ({ pts: [[r, 0], [r, PI / 2]], c: 'dm' })).concat(ts.map((t) => ({ pts: [[1, t], [2, t]], c: 'dm' })), [{ pts: [[cell.r0, cell.t0], [cell.r1, cell.t0], [cell.r1, cell.t1], [cell.r0, cell.t1], [cell.r0, cell.t0]], c: 'fl2' }, { pts: [[1, 0], [2, 0], [2, PI / 2], [1, PI / 2], [1, 0]], c: 'ld' }]),
          extra: (X, Y) => FK.T(X(1.62), Y(cell.t0) + 14, 'Δr', { c: 'rl' }) + FK.T(X(cell.r1) + 4, Y((cell.t0 + cell.t1) / 2) + 4, 'Δθ', { a: 'start', c: 'rl' }) },
        { ox: 290, w: 270, h: 250, x: [-0.2, 2.3], y: [-0.2, 2.25], title: '(b) xy 평면의 상 R', xt: [[1, '1'], [2, '2']], yt: [[1, '1'], [2, '2']], xl: 'x', yl: 'y', m: [22, 10, 20, 20],
          c: rs.map((r) => ({ pts: arc(r, 0, PI / 2), c: 'dm' })).concat(ts.map((t) => ({ pts: [img(1, t), img(2, t)], c: 'dm' })), [{ pts: cellImg, c: 'fl2' }, { pts: arc(1, 0, PI / 2).concat([[0, 2]], arc(2, PI / 2, 0), [[1, 0]]), c: 'ld' }]),
          extra: (X, Y) => { const m = img(1.62, cell.t1 + 0.02), q = img(cell.r1 + 0.05, (cell.t0 + cell.t1) / 2); return FK.T(X(m[0]) - 4, Y(m[1]) - 6, 'Δr', { a: 'end', c: 'rl' }) + FK.T(X(q[0]) + 4, Y(q[1]) + 4, 'rΔθ', { a: 'start', c: 'rl' }); } },
      ], R`$x=r\cos\theta$, $y=r\sin\theta$는 $r\theta$ 평면의 직사각형을 $xy$ 평면의 부채꼴 고리로 보냅니다. 작은 칸 $\Delta r\times\Delta\theta$ (진한 부분)는 변이 $\Delta r$과 $r\Delta\theta$인 거의 직사각형이 되므로 넓이가 약 $r\,\Delta r\,\Delta\theta$, 곧 넓이 비율(야코비안)이 $r$입니다. 원점에서 멀수록 칸이 커집니다.`);
    },
    // 10.4 Green's theorem: orientation with a hole; the special region of the proof
    f09green() {
      const blob = rng(0, 2 * PI, 160).map((t) => [1.25 * Math.cos(t) + 0.18 * Math.cos(2 * t), 0.95 * Math.sin(t) + 0.1 * Math.sin(3 * t)]);
      const hole = arc(0.32, 2 * PI, 0, 0.3, 0.05, 80);
      const u = (x) => 0.35 + 0.25 * Math.sin(1.4 * x) - 0.08 * x, v = (x) => 1.55 + 0.3 * Math.cos(1.2 * x - 0.5);
      const a0 = 0.4, b0 = 2.8, bot = rng(a0, b0, 60).map((x) => [x, u(x)]), top = rng(b0, a0, 60).map((x) => [x, v(x)]);
      return G2(560, 240, '그린 정리의 방향과 증명', [
        { w: 280, h: 240, x: [-1.7, 1.7], y: [-1.3, 1.3], axes: false, title: '(a) 경계의 방향: 영역을 왼쪽에', m: [22, 8, 8, 8],
          c: [{ pts: blob.concat([null], hole), c: 'fl2' }, { pts: blob, c: 'ld' }, { pts: hole, c: 'rx' }],
          extra: (X, Y) => midA(X, Y, blob, 'ld', 0.1) + midA(X, Y, blob, 'ld', 0.45) + midA(X, Y, blob, 'ld', 0.8) + midA(X, Y, hole, 'rx', 0.3) + midA(X, Y, hole, 'rx', 0.8)
            + FK.T(X(-0.55), Y(-0.2), 'R', { c: 'it' }) + FK.T(X(1.2), Y(0.85), 'C₁', { a: 'start', c: 'lb' }) + FK.T(X(0.3), Y(0.05) + 4, 'C₂', { c: 'rl' }) },
        { ox: 280, w: 280, h: 240, x: [0, 3.2], y: [-0.2, 2.05], title: '(b) 특수 영역: u(x) ≤ y ≤ v(x)', xt: [[a0, 'a'], [b0, 'b']], xl: 'x', yl: 'y', m: [22, 10, 20, 14],
          c: [{ pts: bot.concat(top), c: 'fl2' }, { pts: bot, c: 'rx' }, { pts: top, c: 'ld' }, { pts: [[a0, 0], [a0, u(a0)]], c: 'dm ds' }, { pts: [[b0, 0], [b0, u(b0)]], c: 'dm ds' }, { pts: [[b0, u(b0)], [b0, v(b0)]], c: 'vl' }, { pts: [[a0, v(a0)], [a0, u(a0)]], c: 'vl' }],
          extra: (X, Y) => midA(X, Y, bot, 'rx', 0.5) + midA(X, Y, top, 'ld', 0.5) + FK.T(X(1.6), Y(u(1.6)) + 16, 'C*: y = u(x)', { c: 'rl' }) + FK.T(X(1.6), Y(v(1.6)) - 8, 'C**: y = v(x)', { c: 'lb' }) + FK.T(X(1.6), Y(1.0), 'R', { c: 'it' }) },
      ], R`(a) 구멍이 있는 영역에서는 바깥 경계 $C_1$을 반시계 방향, 안쪽 경계 $C_2$를 시계 방향으로 돕니다. 어느 쪽이든 걸어가는 사람의 왼쪽에 $R$이 있습니다. (b) 증명에서 쓰는 영역. $\iint_R\frac{\partial F_1}{\partial y}dx\,dy$를 $y$로 먼저 적분하면 위 곡선 $C^{**}$와 아래 곡선 $C^*$에서의 $F_1$ 값의 차가 되고, 그것이 경계를 따라 도는 $-\oint F_1\,dx$입니다. 세로 변에서는 $dx=0$이라 기여가 없습니다.`);
    },
    // 10.5 a parametric surface: the sphere, its parameter rectangle, tangent vectors and normal
    f09surf() {
      const V = view(0.55, 0.38), vv = V.v;
      const S = (u, v) => [Math.cos(v) * Math.cos(u), Math.cos(v) * Math.sin(u), Math.sin(v)];
      const front = (q) => dot3(q, vv);
      const curves = [];
      rng(0, 2 * PI, 13).slice(0, 12).forEach((u) => curves.push(...split(V, rng(-PI / 2, PI / 2, 60).map((v) => S(u, v)), front, 'dm', null)));
      [-PI / 3, -PI / 6, 0, PI / 6, PI / 3].forEach((v) => curves.push(...split(V, rng(0, 2 * PI, 120).map((u) => S(u, v)), front, 'dm', null)));
      const u0 = 0.55 - 1.0 + 2 * PI, v0 = 0.45, P = S(u0, v0);
      const ru = [-Math.cos(v0) * Math.sin(u0), Math.cos(v0) * Math.cos(u0), 0], rv = [-Math.sin(v0) * Math.cos(u0), -Math.sin(v0) * Math.sin(u0), Math.cos(v0)];
      const pl = [add(P, add(mul(-0.35, ru), mul(-0.35, rv))), add(P, add(mul(0.35, ru), mul(-0.35, rv))), add(P, add(mul(0.35, ru), mul(0.35, rv))), add(P, add(mul(-0.35, ru), mul(0.35, rv)))];
      return G2(560, 250, '곡면의 매개변수 표현', [
        { w: 250, h: 250, x: [-0.5, 7], y: [-1.9, 2.0], title: '(a) 매개변수 영역 R', xt: [[PI, 'π'], [2 * PI, '2π']], yt: [[-PI / 2, '−π/2'], [PI / 2, 'π/2']], xl: 'u', yl: 'v', m: [22, 10, 16, 34],
          c: rng(0, 2 * PI, 13).map((u) => ({ pts: [[u, -PI / 2], [u, PI / 2]], c: 'dm' })).concat([-PI / 3, -PI / 6, 0, PI / 6, PI / 3].map((v) => ({ pts: [[0, v], [2 * PI, v]], c: 'dm' })), [{ pts: [[0, -PI / 2], [2 * PI, -PI / 2], [2 * PI, PI / 2], [0, PI / 2], [0, -PI / 2]], c: 'ld' }]),
          extra: (X, Y) => dot(X, Y, u0, v0) + FK.T(X(u0) + 6, Y(v0) - 6, '(u₀, v₀)', { a: 'start', c: 'em' }) },
        { ox: 270, w: 290, h: 250, x: [-1.75, 1.45], y: [-1.12, 1.4], axes: false, title: '(b) 구면 r(u, v)와 접평면', m: [22, 8, 8, 8],
          c: [{ pts: arc(1, 0, 2 * PI, 0, 0, 160), c: 'vl' }].concat(curves, [{ pts: pl.concat([pl[0]]).map(V.p), c: 'fl2' }, { pts: pl.concat([pl[0]]).map(V.p), c: 'dm' }]),
          extra: (X, Y) => A3(X, Y, V, P, add(P, mul(0.55, ru))) + A3(X, Y, V, P, add(P, mul(0.55, rv))) + A3(X, Y, V, P, add(P, mul(0.6, P)), 'ld')
            + T3(X, Y, V, add(P, mul(0.55, ru)), 'r_u', 6, 4, { a: 'start', c: 'rl' }) + T3(X, Y, V, add(P, mul(0.55, rv)), 'r_v', 0, -6, { c: 'rl' }) + T3(X, Y, V, add(P, mul(0.6, P)), 'N', -6, 4, { a: 'end', c: 'lb' })
            + (() => { const q = V.p(P); return dot(X, Y, q[0], q[1]); })() },
      ], R`$\mathbf r(u,v)=[\cos v\cos u,\ \cos v\sin u,\ \sin v]$는 $uv$ 평면의 직사각형 $R$을 단위구면으로 보냅니다. $u$=상수인 선은 경선(자오선), $v$=상수인 선은 위선이 됩니다. 한 점에서 $\mathbf r_u$ (위선 방향)와 $\mathbf r_v$ (경선 방향)가 접평면을 펼치고, 그 외적 $\mathbf N$이 법선입니다(여기서는 바깥쪽).`);
    },
    // 10.7 proof of the divergence theorem for a special region (vertical cross-section)
    f09gauss() {
      const g = (x) => 0.45 + 0.18 * Math.sin(2.2 * x) - 0.05 * x, h = (x) => 1.7 + 0.25 * Math.cos(1.6 * x - 0.3);
      const a0 = 0.35, b0 = 2.9, bot = rng(a0, b0, 60).map((x) => [x, g(x)]), top = rng(b0, a0, 60).map((x) => [x, h(x)]);
      const xt = 1.2, xb = 2.2, e = 1e-4;
      const nrm = (f, x, s) => { const d = (f(x + e) - f(x - e)) / (2 * e), l = Math.hypot(d, 1); return [(-s * d) / l, s / l]; };
      const nt = nrm(h, xt, 1), nb = nrm(g, xb, -1);
      return G({
        w: 480, h: 250, x: [0, 4.1], y: [-0.35, 2.3], xl: 'x (또는 y)', yl: 'z', xt: [[a0, ''], [b0, '']], m: [8, 10, 22, 16], label: '발산 정리 증명의 특수 영역',
        c: [{ pts: bot.concat(top), c: 'fl2' }, { pts: bot, c: 'rx' }, { pts: top, c: 'ld' }, { pts: [[a0, g(a0)], [a0, h(a0)]], c: 'vl' }, { pts: [[b0, g(b0)], [b0, h(b0)]], c: 'vl' },
          { pts: [[1.75, 0], [1.75, h(1.75)]], c: 'dm ds' }, { pts: [[a0, 0], [b0, 0]], c: 'vl' }],
        extra: (X, Y) => FK.A(X(xt), Y(h(xt)), X(xt + 0.45 * nt[0]), Y(h(xt) + 0.45 * nt[1]), 'ld', 8) + FK.A(X(xb), Y(g(xb)), X(xb + 0.45 * nb[0]), Y(g(xb) + 0.45 * nb[1]), 'rx', 8)
          + FK.A(X(b0), Y(1.2), X(b0 + 0.4), Y(1.2), 'vl', 7)
          + FK.T(X(xt + 0.45 * nt[0]) + 6, Y(h(xt) + 0.45 * nt[1]) + 4, 'n (cos γ > 0)', { a: 'start', c: 'lb' }) + FK.T(X(xb + 0.45 * nb[0]) + 6, Y(g(xb) + 0.45 * nb[1]) + 10, 'n (cos γ < 0)', { a: 'start', c: 'rl' })
          + FK.T(X(2.6), Y(h(2.6)) - 8, 'S₁: z = h(x, y)', { c: 'lb' }) + FK.T(X(0.95), Y(g(0.95)) + 16, 'S₂: z = g(x, y)', { c: 'rl' }) + FK.T(X(b0) + 8, Y(1.2) - 8, 'S₃ (옆면, cos γ = 0)', { a: 'start' })
          + FK.T(X(1.75) + 5, Y(1.0), '∫ ∂F₃/∂z dz', { a: 'start', c: 'em' }) + FK.T(X((a0 + b0) / 2), Y(0) + 16, '밑면에 내린 정사영 R', { c: 'em' }),
        cap: R`$T$를 $g(x,y)\le z\le h(x,y)$로 쓸 수 있는 영역의 단면. $\iiint_T\frac{\partial F_3}{\partial z}dV$를 $z$로 먼저 적분하면(점선) 윗면 $S_1$과 아랫면 $S_2$에서의 $F_3$ 값의 차가 됩니다. 한편 $\iint_SF_3\cos\gamma\,dA$에서 윗면은 $\cos\gamma>0$이라 $+$, 아랫면은 $\cos\gamma\lt 0$이라 $-$, 옆면은 $\cos\gamma=0$이라 0이 되어 두 값이 같아집니다.`,
      });
    },
    // 10.9 Stokes: a cap with its boundary curve and the right-hand orientation
    f09stokes() {
      const V = view(0.5, 0.45), vv = V.v;
      const Pz = (x, y) => [x, y, 1 - x * x - y * y];
      const vis = (q) => dot3([2 * q[0], 2 * q[1], 1], vv);
      const curves = [];
      [0.25, 0.5, 0.75].forEach((r) => curves.push(...split(V, rng(0, 2 * PI, 120).map((t) => Pz(r * Math.cos(t), r * Math.sin(t))), vis, 'dm', null)));
      rng(0, 2 * PI, 13).slice(0, 12).forEach((t) => curves.push(...split(V, rng(0, 1, 30).map((r) => Pz(r * Math.cos(t), r * Math.sin(t))), vis, 'dm', null)));
      const rim = rng(0, 2 * PI, 160).map((t) => [Math.cos(t), Math.sin(t), 0]);
      const rimParts = split(V, rim, (q) => dot3(q, vv) + 0.05, 'rx', 'rx ds');
      const ph = 0.5 + 1.2, r0 = 0.6, Q = Pz(r0 * Math.cos(ph), r0 * Math.sin(ph)), Nq = [2 * Q[0], 2 * Q[1], 1], ln = Math.hypot(...Nq), nq = Nq.map((c) => c / ln);
      const tA = 0.5 - 0.35, tB = 0.5 + 1.15, rimA = (t) => [Math.cos(t), Math.sin(t), 0], tan = (t) => [-Math.sin(t), Math.cos(t), 0];
      return G({
        w: 420, h: 260, x: [-1.55, 1.55], y: [-0.75, 1.55], axes: false, m: [8, 8, 8, 8], label: '스토크스 정리의 방향',
        c: curves.concat(rimParts),
        extra: (X, Y) => A3(X, Y, V, [0, 0, 1], [0, 0, 1.45], 'ld') + A3(X, Y, V, Q, add(Q, mul(0.5, nq)), 'ld')
          + A3(X, Y, V, rimA(tA), add(rimA(tA), mul(0.35, tan(tA))), 'rx', 9) + A3(X, Y, V, rimA(tB), add(rimA(tB), mul(0.35, tan(tB))), 'rx', 9)
          + T3(X, Y, V, [0, 0, 1.45], 'n', 8, 4, { a: 'start', c: 'lb' }) + T3(X, Y, V, add(Q, mul(0.5, nq)), 'n', 6, 2, { a: 'start', c: 'lb' })
          + T3(X, Y, V, rimA(tA), 'C', 4, 18, { c: 'rl' }) + FK.T(X(-0.98), Y(0.62), 'S', { a: 'end', c: 'it' }),
        cap: R`곡면 $S: z=1-x^2-y^2$ ($z\ge0$)과 경계 $C$ (바닥의 단위원). 법선 $\mathbf n$을 위쪽으로 잡으면 $C$는 위에서 보아 반시계 방향입니다. 오른손 엄지를 $\mathbf n$ 방향으로 세웠을 때 나머지 손가락이 감기는 방향이고, $C$를 따라 걸으면 $S$가 왼쪽에 있습니다. 같은 $C$를 경계로 하는 다른 곡면(예: 바닥 원판)을 써도 $\iint(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA$는 같습니다.`,
      });
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
