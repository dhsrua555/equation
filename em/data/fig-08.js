/* 08 벡터 미분 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, PI } = window.EMG;
  const FK = window.FK;
  // oblique view of 3-space: x toward the viewer (lower left), y to the right, z up
  const pj = ([x, y, z]) => [y - 0.6 * x, z - 0.45 * x];
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const mul = (c, a) => a.map((v) => c * v);
  const A3 = (X, Y, p, q, c = 'ld', h = 8) => { const P = pj(p), Q = pj(q); return FK.A(X(P[0]), Y(P[1]), X(Q[0]), Y(Q[1]), c, h); };
  const L3 = (X, Y, p, q, c = 'vl') => { const P = pj(p), Q = pj(q); return FK.L(X(P[0]), Y(P[1]), X(Q[0]), Y(Q[1]), c); };
  const T3 = (X, Y, p, s, dx = 0, dy = 0, o = {}) => { const P = pj(p); return FK.T(X(P[0]) + dx, Y(P[1]) + dy, s, o); };
  const poly3 = (pts) => pts.map(pj);
  const axes3 = (X, Y, n) => A3(X, Y, [0, 0, 0], [n, 0, 0], 'dm', 6) + A3(X, Y, [0, 0, 0], [0, n, 0], 'dm', 6) + A3(X, Y, [0, 0, 0], [0, 0, n * 0.8], 'dm', 6)
    + T3(X, Y, [n, 0, 0], 'x', -4, 12) + T3(X, Y, [0, n, 0], 'y', 8, 4) + T3(X, Y, [0, 0, n * 0.8], 'z', 8, 4);
  // arrows of a plane vector field f on a grid; pixel length len·min(1, |v|/ref)
  function quiver(X, Y, f, xs, ys, len, ref, c = 'ld') {
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
      s += FK.A(px - (dx * l) / 2, py - (dy * l) / 2, px + (dx * l) / 2, py + (dy * l) / 2, c, Math.min(6.5, 2.5 + l / 4));
    }));
    return s;
  }
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 40) => Array.from({ length: n + 1 }, (_, k) => { const t = a0 + ((a1 - a0) * k) / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; });
  const arcA = (X, Y, cx, cy, r, a0, a1, c = 'rx') => { const p = arc(r, a0, a1, cx, cy, 24), n = p.length; return FK.P(p.map((q, k) => (k ? 'L' : 'M') + FK.f1(X(q[0])) + ',' + FK.f1(Y(q[1]))).join(''), c) + FK.A(X(p[n - 3][0]), Y(p[n - 3][1]), X(p[n - 1][0]), Y(p[n - 1][1]), c, 7); };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 9.2 orthogonal projection of a on the line of b: p > 0 and p < 0
    f08proj() {
      const panel = (a, b, ox, title, back) => {
        const bb = b[0] * b[0] + b[1] * b[1], k = (a[0] * b[0] + a[1] * b[1]) / bb, q = [k * b[0], k * b[1]];
        const ga = Math.atan2(a[1], a[0]), gb = Math.atan2(b[1], b[0]);
        return { ox, w: 280, h: 210, x: [-1.5, 2.3], y: [-0.45, 1.95], axes: false, title, m: [22, 8, 8, 8],
          c: [{ pts: [[back ? -1.4 * b[0] / Math.sqrt(bb) : 0, back ? -1.4 * b[1] / Math.sqrt(bb) : 0], [2.2 * b[0] / Math.sqrt(bb), 2.2 * b[1] / Math.sqrt(bb)]], c: 'dm' },
            { pts: [a, q], c: 'dm ds' }, { pts: arc(0.32, gb, ga), c: 'vl' }, { pts: [[0, 0], q], c: 'rx' }],
          extra: (X, Y) => FK.A(X(0), Y(0), X(a[0]), Y(a[1]), 'vl', 9) + FK.A(X(0), Y(0), X(b[0]), Y(b[1]), 'ld', 9)
            + FK.T(X(a[0]) + 8, Y(a[1]) - 2, 'a', { a: 'start', c: 'it' }) + FK.T(X(b[0]) + 2, Y(b[1]) + 16, 'b', { c: 'it' })
            + FK.T(X(0.42 * Math.cos((ga + gb) / 2)) + 4, Y(0.42 * Math.sin((ga + gb) / 2)), 'γ', { a: 'start', c: 'it' })
            + FK.T(X(q[0] / 2) + (back ? 0 : 6), Y(q[1] / 2) + 16, back ? 'p (< 0)' : 'p', { c: 'rl' })
            + dot(X, Y, 0, 0) + FK.T(X(0) - 4, Y(0) + 14, 'O', { a: 'end' }),
        };
      };
      return G2(560, 210, '정사영', [
        panel([0.75, 1.55], [1.7, 0.45], 0, '(a) 예각: p > 0', false),
        panel([-1.05, 1.3], [1.7, 0.45], 280, '(b) 둔각: p < 0', true),
      ], R`$\mathbf a$에서 $\mathbf b$가 놓인 직선에 수선을 내린 발까지의 부호 있는 길이가 정사영 $p=|\mathbf a|\cos\gamma=\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|}$입니다(주황 선분). 각이 둔각이면 발이 $\mathbf b$의 반대쪽에 떨어져 $p\lt 0$이 되고, 직각이면 $p=0$입니다.`);
    },
    // 9.3 cross product and scalar triple product
    f08cross() {
      const a = [1.2, 0.2, 0], b = [-0.1, 1.4, 0], n = [0, 0, 1.7];
      const pa = { w: 280, h: 230, x: [-1.2, 2.3], y: [-0.85, 2.0], axes: false, title: '(a) 외적과 평행사변형', m: [22, 6, 6, 6],
        c: [{ pts: poly3([[0, 0, 0], a, add(a, b), b, [0, 0, 0]]), c: 'fl2' }, { pts: poly3([a, add(a, b), b]), c: 'dm ds' }],
        extra: (X, Y) => A3(X, Y, [0, 0, 0], a, 'ld') + A3(X, Y, [0, 0, 0], b, 'ld') + A3(X, Y, [0, 0, 0], mul(0.85, n), 'rx')
          + T3(X, Y, a, 'a', -8, 4, { a: 'end', c: 'it' }) + T3(X, Y, b, 'b', 8, 4, { a: 'start', c: 'it' }) + T3(X, Y, mul(0.85, n), 'a × b', 8, 6, { a: 'start', c: 'rl' })
          + T3(X, Y, add(a, b), '넓이 = |a × b|', 0, 18, { c: 'em' }) };
      const e1 = [1.2, 0.2, 0], e2 = [-0.1, 1.4, 0], e3 = [0.3, 0.5, 1.1];
      const base = [[0, 0, 0], e1, add(e1, e2), e2, [0, 0, 0]], top = base.map((p) => add(p, e3));
      const pb = { ox: 280, w: 280, h: 230, x: [-1.2, 2.3], y: [-0.85, 2.0], axes: false, title: '(b) 삼중곱과 평행육면체', m: [22, 6, 6, 6],
        c: [{ pts: poly3(base), c: 'fl2' }, { pts: poly3(top), c: 'vl' }, { pts: poly3([e1, add(e1, e2), e2]), c: 'vl' }].concat([e1, add(e1, e2), e2].map((p) => ({ pts: poly3([p, add(p, e3)]), c: 'vl' }))),
        extra: (X, Y) => A3(X, Y, [0, 0, 0], e1, 'ld') + A3(X, Y, [0, 0, 0], e2, 'ld') + A3(X, Y, [0, 0, 0], e3, 'rx')
          + L3(X, Y, e3, [e3[0], e3[1], 0], 'dm ds') + A3(X, Y, [0, 0, 0], [0, 0, 0.75], 'vl', 7)
          + T3(X, Y, e1, 'b', -8, 4, { a: 'end', c: 'it' }) + T3(X, Y, e2, 'c', 8, 4, { a: 'start', c: 'it' }) + T3(X, Y, e3, 'a', -8, -2, { a: 'end', c: 'it' })
          + T3(X, Y, [0, 0, 0.75], 'b × c', -6, 0, { a: 'end' }) + T3(X, Y, [e3[0], e3[1], 0.5], 'h', 6, 4, { a: 'start', c: 'it' }) };
      return G2(560, 230, '외적과 삼중곱의 기하', [pa, pb],
        R`(a) $\mathbf a\times\mathbf b$는 두 벡터가 이루는 평행사변형에 수직이고, 길이가 그 넓이 $|\mathbf a||\mathbf b|\sin\gamma$입니다. 방향은 $\mathbf a$를 $\mathbf b$ 쪽으로 돌릴 때 오른나사가 나아가는 쪽입니다. (b) 밑면의 넓이 $|\mathbf b\times\mathbf c|$에 높이 $h=|\mathbf a||\cos\gamma|$ ($\gamma$는 $\mathbf a$와 $\mathbf b\times\mathbf c$ 사이의 각)를 곱한 부피가 $|\mathbf a\cdot(\mathbf b\times\mathbf c)|$입니다.`);
    },
    // 9.4 two vector fields: gravitational attraction and the velocity field of a rotating body
    f08fields() {
      const g = (x, y) => { const r = Math.hypot(x, y); return r < 0.35 ? null : [-x / (r * r * r), -y / (r * r * r)]; };
      const w = (x, y) => [-y, x];
      const box = { w: 280, h: 230, x: [-2.2, 2.2], y: [-1.8, 1.8], axes: false, m: [22, 8, 8, 8] };
      return G2(560, 230, '벡터장의 예', [
        Object.assign({}, box, { title: '(a) 중력장 p = −c r / r³', extra: (X, Y) => quiver(X, Y, g, rng(-2, 2, 9), rng(-1.6, 1.6, 8), 22, 0.9) + dot(X, Y, 0, 0) + FK.T(X(0) + 6, Y(0) - 6, 'P₀', { a: 'start', c: 'em' }) }),
        Object.assign({}, box, { ox: 280, title: '(b) 회전체의 속도장 v = w × r', c: [{ pts: arc(1.2, 0, 2 * PI), c: 'dm ds' }],
          extra: (X, Y) => quiver(X, Y, w, rng(-2, 2, 9), rng(-1.6, 1.6, 8), 24, 2.4) + dot(X, Y, 0, 0) + FK.T(X(0) + 6, Y(0) + 14, '회전축', { a: 'start' }) }),
      ], R`(a) 원점 $P_0$의 질량이 끌어당기는 힘의 장(한 평면에서 본 모습). 모든 화살표가 $P_0$을 향하고, 크기는 거리의 제곱에 반비례합니다(가까울수록 길지만 그림에서는 길이를 제한했습니다). (b) 회전축(원점에서 종이를 뚫고 나오는 방향)을 중심으로 각속도 $\omega$로 도는 물체의 속도장 $\mathbf v=\omega[-y,x,0]$. 축에서 멀수록 빠르고, 모든 속도가 동심원에 접합니다.`);
    },
    // 9.5 arc length as a limit of chords; tangent vector and tangent line
    f08curve() {
      const cf = (t) => [t, 1.1 + 0.75 * Math.sin(1.1 * t - 0.4) + 0.12 * t];
      const cpts = rng(0.3, 4.6, 120).map(cf), ch = rng(0.3, 4.6, 6).map(cf);
      const t0 = PI / 3, P = [3 * Math.cos(t0), 2 * Math.sin(t0)], d = [-3 * Math.sin(t0), 2 * Math.cos(t0)];
      const ell = rng(0, 2 * PI, 160).map((t) => [3 * Math.cos(t), 2 * Math.sin(t)]);
      return G2(560, 220, '호의 길이와 접선', [
        { w: 280, h: 220, x: [0, 5], y: [0, 2.6], axes: false, title: '(a) 현들의 꺾은선으로 길이 근사', m: [22, 8, 8, 8],
          c: [{ pts: cpts, c: 'ld' }, { pts: ch, c: 'rx' }],
          extra: (X, Y) => ch.map((p) => dot(X, Y, p[0], p[1])).join('') + FK.T(X(ch[0][0]), Y(ch[0][1]) + 16, 'r(a)') + FK.T(X(ch[5][0]), Y(ch[5][1]) + 16, 'r(b)') + FK.T(X(ch[2][0]) + 4, Y(ch[2][1]) - 10, 'r(t₂)', { a: 'start' }) },
        { ox: 280, w: 280, h: 220, x: [-3.6, 3.6], y: [-2.35, 3.0], title: '(b) 타원 x²/9 + y²/4 = 1의 접선', xt: [[3, '3'], [-3, '−3']], yt: [[2, '2']], xl: 'x', yl: 'y', m: [22, 8, 8, 8],
          c: [{ pts: ell, c: 'vl' }, { pts: [[P[0] - 0.75 * d[0], P[1] - 0.75 * d[1]], [P[0] + 0.62 * d[0], P[1] + 0.62 * d[1]]], c: 'dm ds' }],
          extra: (X, Y) => FK.A(X(0), Y(0), X(P[0]), Y(P[1]), 'ld', 8) + FK.A(X(P[0]), Y(P[1]), X(P[0] + 0.5 * d[0]), Y(P[1] + 0.5 * d[1]), 'rx', 8) + dot(X, Y, P[0], P[1])
            + FK.T(X(P[0] / 2) + 8, Y(P[1] / 2) + 4, 'r(t₀)', { a: 'start', c: 'lb' }) + FK.T(X(P[0] + 0.5 * d[0]) + 10, Y(P[1] + 0.5 * d[1]) - 6, "r′(t₀)", { a: 'start', c: 'rl' }) },
      ], R`(a) 곡선 위에 점 $\mathbf r(t_0),\dots,\mathbf r(t_n)$을 찍고 현의 길이를 더한 뒤, 가장 긴 간격 $\Delta t_m$을 0으로 보낸 극한이 곡선의 길이 $\int_a^b|\mathbf r'(t)|\,dt$입니다. (b) $\mathbf r(t)=[3\cos t,2\sin t]$의 $t_0=\pi/3$에서 접선벡터 $\mathbf r'(t_0)$와 접선 $\mathbf q(w)=\mathbf r(t_0)+w\,\mathbf r'(t_0)$ (점선).`);
    },
    // 9.5 tangential and normal acceleration; centripetal acceleration
    f08accel() {
      const v = [1, 2], a = [0, 2], at = [0.8, 1.6], an = [-0.8, 0.4], P = [1, 1];
      const R0 = 1.5, th = 0.9, Q = [R0 * Math.cos(th), R0 * Math.sin(th)];
      return G2(560, 230, '가속도의 분해', [
        { w: 280, h: 230, x: [-0.6, 2.4], y: [-0.2, 3.3], title: '(a) 포물선 운동 r = [t, t²], t = 1', xt: [[1, '1'], [2, '2']], yt: [[1, '1'], [2, '2'], [3, '3']], xl: 'x', yl: 'y', m: [22, 8, 16, 18],
          c: [{ f: (x) => x * x, a: -0.4, b: 1.8, c: 'vl' }, { pts: [[P[0] - 0.5 * v[0], P[1] - 0.5 * v[1]], [P[0] + 1.1 * v[0], P[1] + 1.1 * v[1]]], c: 'dm' }, { pts: [[P[0] + at[0], P[1] + at[1]], [P[0] + a[0], P[1] + a[1]]], c: 'dm ds' }, { pts: [[P[0] + an[0], P[1] + an[1]], [P[0] + a[0], P[1] + a[1]]], c: 'dm ds' }],
          extra: (X, Y) => FK.A(X(P[0]), Y(P[1]), X(P[0] + a[0]), Y(P[1] + a[1]), 'vl', 8)
            + FK.A(X(P[0]), Y(P[1]), X(P[0] + at[0]), Y(P[1] + at[1]), 'rx', 7) + FK.A(X(P[0]), Y(P[1]), X(P[0] + an[0]), Y(P[1] + an[1]), 'rx', 7) + dot(X, Y, P[0], P[1])
            + FK.T(X(P[0] + 1.1 * v[0]) - 6, Y(P[1] + 1.1 * v[1]) + 4, 'v 방향', { a: 'end' }) + FK.T(X(P[0] + a[0]) + 6, Y(P[1] + a[1]) + 4, 'a', { a: 'start', c: 'it' })
            + FK.T(X(P[0] + at[0]) + 6, Y(P[1] + at[1]) + 2, 'a_{tan}', { a: 'start', c: 'rl' }) + FK.T(X(P[0] + an[0]) - 4, Y(P[1] + an[1]) - 6, 'a_{norm}', { a: 'end', c: 'rl' }) },
        { ox: 280, w: 280, h: 230, x: [-2.25, 2.25], y: [-1.6, 1.8], title: '(b) 등속 원운동', axes: false, m: [22, 8, 8, 8],
          c: [{ pts: arc(R0, 0, 2 * PI), c: 'vl' }],
          extra: (X, Y) => FK.A(X(Q[0]), Y(Q[1]), X(Q[0] - 0.9 * Math.sin(th)), Y(Q[1] + 0.9 * Math.cos(th)), 'ld', 8) + FK.A(X(Q[0]), Y(Q[1]), X(0.25 * Q[0]), Y(0.25 * Q[1]), 'rx', 8)
            + FK.L(X(0), Y(0), X(0.25 * Q[0]), Y(0.25 * Q[1]), 'dm ds') + dot(X, Y, 0, 0) + dot(X, Y, Q[0], Q[1])
            + FK.T(X(Q[0] - 0.9 * Math.sin(th)) - 4, Y(Q[1] + 0.9 * Math.cos(th)) - 4, 'v', { a: 'end', c: 'lb' }) + FK.T(X(0.55 * Q[0]) + 8, Y(0.55 * Q[1]) + 12, 'a = −ω² r', { a: 'start', c: 'rl' })
            + FK.L(X(0), Y(0), X(-R0 * 0.7071), Y(-R0 * 0.7071), 'dm') + FK.T(X(-R0 * 0.35) - 4, Y(-R0 * 0.35) + 14, 'R', { a: 'end', c: 'it' }) },
      ], R`(a) $t=1$에서 $\mathbf v=[1,2]$, $\mathbf a=[0,2]$. 가속도를 속도 방향 성분 $\mathbf a_{\text{tan}}=[0.8,1.6]$과 수직 성분 $\mathbf a_{\text{norm}}=[-0.8,0.4]$로 나눈 모습입니다. 법선 성분은 곡선이 휘는 안쪽을 향합니다. (b) 속력이 일정해도 속도의 방향이 바뀌므로 가속도가 있고, 중심을 향하는 구심가속도 $-\omega^2\mathbf r$ (크기 $\omega^2R$)만 남습니다.`);
    },
    // 9.5 circular helix with the trihedron u, p, b
    f08helix() {
      const c = 0.14, K = Math.sqrt(1 + c * c), t0 = 2 * PI + 1.37;
      const hel = rng(0, 4 * PI, 360).map((t) => pj([Math.cos(t), Math.sin(t), c * t]));
      const P = [Math.cos(t0), Math.sin(t0), c * t0];
      const u = [-Math.sin(t0) / K, Math.cos(t0) / K, c / K], p = [-Math.cos(t0), -Math.sin(t0), 0], b = [(c * Math.sin(t0)) / K, (-c * Math.cos(t0)) / K, 1 / K];
      return G({
        w: 420, h: 280, x: [-1.9, 1.9], y: [-0.7, 2.05], axes: false, m: [8, 8, 8, 8], label: '원형 나선과 삼면체',
        c: [{ pts: [pj([0, 0, -0.2]), pj([0, 0, 1.95])], c: 'dm ds' }, { pts: hel, c: 'ld' }],
        extra: (X, Y) => A3(X, Y, P, add(P, mul(0.75, u)), 'rx') + A3(X, Y, P, add(P, mul(0.75, p)), 'rx') + A3(X, Y, P, add(P, mul(0.75, b)), 'rx')
          + T3(X, Y, add(P, mul(0.75, u)), 'u (접선)', -10, 18, { a: 'start', c: 'rl' }) + T3(X, Y, add(P, mul(0.75, p)), 'p (주법선)', -4, -8, { c: 'rl' }) + T3(X, Y, add(P, mul(0.75, b)), 'b (종법선)', 6, 6, { a: 'start', c: 'rl' })
          + (() => { const q = pj(P); return dot(X, Y, q[0], q[1]); })() + T3(X, Y, [0, 0, 1.95], '나선의 축', 6, 4, { a: 'start' }),
        cap: R`나선 $\mathbf r(t)=[a\cos t,a\sin t,ct]$와 한 점에서의 단위접선벡터 $\mathbf u$, 단위주법선벡터 $\mathbf p$ (축을 향함), 단위종법선벡터 $\mathbf b=\mathbf u\times\mathbf p$. $\mathbf u$와 $\mathbf p$가 접촉평면을 이루고, 곡률은 $\mathbf u$가, 비틀림은 $\mathbf b$가 돌아가는 빠르기입니다. 나선에서는 둘 다 일정합니다.`,
      });
    },
    // 9.7 gradient is perpendicular to the level curves
    f08grad() {
      const lv = [0.5, 1.5, 3, 5, 7.5];
      const ell = (c) => rng(0, 2 * PI, 160).map((t) => [Math.sqrt(c) * Math.cos(t), Math.sqrt(c / 3) * Math.sin(t)]);
      const pts = rng(0, 2 * PI, 13).slice(0, 12).map((t) => [Math.sqrt(3) * Math.cos(t), Math.sin(t)]);
      return G({
        w: 420, h: 250, x: [-3.3, 3.3], y: [-1.95, 1.95], m: [8, 10, 8, 10], xl: 'x', yl: 'y', label: '기울기와 등위선',
        c: lv.map((c) => ({ pts: ell(c), c: c === 3 ? 'vl' : 'dm' })),
        extra: (X, Y) => pts.map(([x, y]) => FK.A(X(x), Y(y), X(x + 0.13 * 2 * x), Y(y + 0.13 * 6 * y), 'rx', 7)).join('')
          + FK.T(X(2.95), Y(-1.7), 'f = 3', { a: 'end', c: 'em' }),
        cap: R`$f(x,y)=x^2+3y^2$의 등위선 $f=c$ (가운데 굵은 선이 $f=3$)과 그 위의 점에서 그린 $\nabla f=[2x,6y]$ (주황). 기울기는 언제나 등위선에 수직이고, 등위선이 촘촘한 쪽($y$ 방향)에서 더 깁니다. 등위선을 따라가면 $f$가 변하지 않으므로 그 방향의 방향도함수가 0이기 때문입니다.`,
      });
    },
    // 9.8 a source field and an incompressible field
    f08div() {
      const box = { w: 280, h: 230, x: [-2, 2], y: [-1.65, 1.65], axes: false, m: [22, 8, 8, 8] };
      const sq = [[0.6, 0.4], [1.2, 0.4], [1.2, 1.0], [0.6, 1.0], [0.6, 0.4]];
      return G2(560, 230, '발산의 뜻', [
        Object.assign({}, box, { title: '(a) v = [x, y],  div v = 2', c: [{ pts: sq, c: 'vl' }], extra: (X, Y) => quiver(X, Y, (x, y) => [x, y], rng(-1.8, 1.8, 9), rng(-1.4, 1.4, 8), 26, 2.2) }),
        Object.assign({}, box, { ox: 280, title: '(b) v = [x, −y],  div v = 0', c: [{ pts: sq, c: 'vl' }], extra: (X, Y) => quiver(X, Y, (x, y) => [x, -y], rng(-1.8, 1.8, 9), rng(-1.4, 1.4, 8), 26, 2.2) }),
      ], R`검은 사각형을 작은 상자로 보고 드나드는 양을 비교해 보세요. (a) 어느 면에서나 들어오는 것보다 나가는 것이 많아(모든 점이 샘) 발산이 양수입니다. (b) 오른쪽 면으로 더 많이 나가지만 위쪽 면으로 그만큼 더 들어와 알짜 유출이 0입니다. 비압축성 흐름의 모습입니다.`);
    },
    // 9.9 curl: a shear flow rotates, a vortex outside its core does not
    f08curl() {
      const box = { w: 280, h: 230, x: [-2, 2], y: [-1.65, 1.65], axes: false, m: [22, 8, 8, 8] };
      const wheel = (X, Y, cx, cy, ang) => { const r = 0.28; let s = FK.C(X(cx), Y(cy), 3, 'dotf'); for (let k = 0; k < 4; k++) { const t = ang + (k * PI) / 2; s += FK.L(X(cx), Y(cy), X(cx + r * Math.cos(t)), Y(cy + r * Math.sin(t)), 'vl'); } return s; };
      return G2(560, 230, '회전의 뜻', [
        Object.assign({}, box, { title: '(a) 층밀림 v = [y, 0],  curl v = −k', extra: (X, Y) => quiver(X, Y, (x, y) => [y, 0], rng(-1.8, 1.8, 9), rng(-1.4, 1.4, 8), 30, 1.6) + wheel(X, Y, 0.95, 0.2, 0.3) + arcA(X, Y, 0.95, 0.2, 0.42, 1.2, -0.6) }),
        Object.assign({}, box, { ox: 280, title: '(b) v = [−y, x]/(x² + y²),  curl v = 0', extra: (X, Y) => quiver(X, Y, (x, y) => { const r2 = x * x + y * y; return r2 < 0.1 ? null : [-y / r2, x / r2]; }, rng(-1.8, 1.8, 9), rng(-1.4, 1.4, 8), 26, 1.1) + dot(X, Y, 0, 0) + wheel(X, Y, 1.2, 0.85, 0.5) }),
      ], R`물에 띄운 작은 바람개비(검은 십자)로 생각합니다. (a) 흐름선은 모두 직선이지만 위쪽이 더 빨라 바람개비가 시계 방향으로 돕니다(회전 $-\mathbf k$). (b) 원점 둘레를 도는 흐름이지만 바깥으로 갈수록 느려지는 정도가 딱 맞아, 원점을 뺀 모든 곳에서 바람개비는 원을 따라 돌 뿐 스스로 돌지 않습니다(회전 0). “흐름이 휘는가”와 “회전이 0이 아닌가”는 다른 질문입니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
