/* 12 복소수와 해석함수 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, PI } = window.EMG;
  const FK = window.FK;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 60) => rng(a0, a1, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  const V = (X, Y, a, b, c = 'ld', h = 8) => FK.A(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), c, h);
  const sh = (y) => (Math.exp(y) - Math.exp(-y)) / 2;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 13.1–13.2 the complex plane: addition, subtraction, conjugate, polar form
    f12plane() {
      const z1 = [3, 1], z2 = [1, 2], s = [4, 3], d = [2, -1];
      const z = [2.2, 1.6], r = Math.hypot(...z), th = Math.atan2(z[1], z[0]);
      return G2(560, 240, '복소평면', [
        { w: 280, h: 240, x: [-0.6, 5.1], y: [-1.3, 3.2], title: '(a) 덧셈과 뺄셈', xl: 'x', yl: 'y', xt: [[1, '1'], [3, '3']], yt: [[1, '1'], [2, '2']], m: [22, 10, 16, 16],
          c: [{ pts: [z1, s, z2], c: 'dm ds' }, { pts: [z2, z1], c: 'rx ds' }],
          extra: (X, Y) => V(X, Y, [0, 0], z1) + V(X, Y, [0, 0], z2) + V(X, Y, [0, 0], s, 'vl') + V(X, Y, [0, 0], d, 'rx')
            + FK.T(X(z1[0]) + 6, Y(z1[1]) + 12, 'z₁', { a: 'start', c: 'lb' }) + FK.T(X(z2[0]) - 6, Y(z2[1]) - 4, 'z₂', { a: 'end', c: 'lb' }) + FK.T(X(s[0]) + 6, Y(s[1]) + 4, 'z₁ + z₂', { a: 'start', c: 'em' }) + FK.T(X(d[0]) + 6, Y(d[1]) + 12, 'z₁ − z₂', { a: 'start', c: 'rl' }) },
        { ox: 280, w: 280, h: 240, x: [-0.8, 4.7], y: [-2.1, 2.3], title: '(b) 극형식과 켤레', xl: 'x', yl: 'y', xt: [[z[0], 'x']], yt: [[z[1], 'y']], m: [22, 10, 16, 16],
          c: [{ pts: [[z[0], 0], z], c: 'dm ds' }, { pts: [[0, z[1]], z], c: 'dm ds' }, { pts: arc(0.55, 0, th), c: 'vl' }, { pts: [z, [z[0], -z[1]]], c: 'dm' }],
          extra: (X, Y) => V(X, Y, [0, 0], z) + V(X, Y, [0, 0], [z[0], -z[1]], 'rx') + dot(X, Y, z[0], z[1]) + dot(X, Y, z[0], -z[1], true)
            + FK.T(X(z[0]) + 6, Y(z[1]) - 4, 'z = x + iy', { a: 'start', c: 'lb' }) + FK.T(X(z[0]) + 6, Y(-z[1]) + 12, 'z̄ = x − iy', { a: 'start', c: 'rl' })
            + FK.T(X(z[0] / 2) - 4, Y(z[1] / 2) - 6, 'r = |z|', { a: 'end', c: 'em' }) + FK.T(X(0.7), Y(0.22), 'θ', { a: 'start', c: 'it' }) },
      ], R`(a) 덧셈은 벡터처럼 평행사변형 법칙을 따르고, $z_1-z_2$는 $z_2$에서 $z_1$로 가는 화살표(주황 점선)를 원점으로 옮긴 것입니다. $|z_1-z_2|$가 두 점 사이의 거리입니다. (b) $z=r(\cos\theta+i\sin\theta)$의 $r=|z|$와 $\theta=\arg z$. 켤레 $\bar z$는 실수축에 대한 대칭점입니다.`);
    },
    // 13.2 multiplication: moduli multiply, arguments add; multiplying by i is a quarter turn
    f12mult() {
      const z1 = [1, 1], z2 = [Math.sqrt(3), 1], p = [Math.sqrt(3) - 1, Math.sqrt(3) + 1];
      const w = [2, 1], iw = [-1, 2], iiw = [-2, -1];
      return G2(560, 240, '곱셈의 기하', [
        { w: 280, h: 240, x: [-0.4, 3.85], y: [-0.3, 3.1], title: '(a) z₁z₂: 길이는 곱, 각은 합', xl: 'x', yl: 'y', xt: [[1, '1'], [2, '2']], yt: [[1, '1'], [2, '2']], m: [22, 10, 16, 16],
          c: [{ pts: arc(0.5, 0, PI / 6), c: 'rx' }, { pts: arc(0.75, 0, PI / 4), c: 'ld' }, { pts: arc(1.0, 0, (5 * PI) / 12), c: 'vl' }],
          extra: (X, Y) => V(X, Y, [0, 0], z1) + V(X, Y, [0, 0], z2, 'rx') + V(X, Y, [0, 0], p, 'vl')
            + FK.T(X(z1[0]) + 6, Y(z1[1]) - 2, 'z₁ = 1 + i', { a: 'start', c: 'lb' }) + FK.T(X(z2[0]) + 6, Y(z2[1]) + 4, 'z₂ = √3 + i', { a: 'start', c: 'rl' }) + FK.T(X(p[0]) + 6, Y(p[1]), 'z₁z₂', { a: 'start', c: 'em' })
            + FK.T(X(1.05), Y(0.62), '75°', { a: 'start', c: 'em' }) },
        { ox: 280, w: 280, h: 240, x: [-2.6, 2.6], y: [-1.6, 2.54], title: '(b) i를 곱하면 90° 회전', xl: 'x', yl: 'y', m: [22, 10, 16, 16],
          c: [{ pts: arc(Math.hypot(2, 1), Math.atan2(1, 2), Math.atan2(-1, -2) + 2 * PI, 0, 0, 80), c: 'dm ds' }],
          extra: (X, Y) => V(X, Y, [0, 0], w) + V(X, Y, [0, 0], iw, 'rx') + V(X, Y, [0, 0], iiw, 'vl')
            + FK.T(X(w[0]) + 4, Y(w[1]) + 12, 'z', { a: 'start', c: 'lb' }) + FK.T(X(iw[0]) - 4, Y(iw[1]) - 4, 'iz', { a: 'end', c: 'rl' }) + FK.T(X(iiw[0]) - 4, Y(iiw[1]) + 12, 'i²z = −z', { a: 'end', c: 'em' }) },
      ], R`(a) $z_1=\sqrt2\,e^{i\pi/4}$, $z_2=2e^{i\pi/6}$이면 $z_1z_2=2\sqrt2\,e^{i5\pi/12}=(\sqrt3-1)+(\sqrt3+1)i$. 편각 $45^\circ+30^\circ=75^\circ$. (b) $i=e^{i\pi/2}$를 곱하면 길이는 그대로이고 $90^\circ$ 돕니다. 두 번 곱하면 $180^\circ$, 곧 $i^2=-1$입니다.`);
    },
    // 13.2 roots lie on a circle at the corners of a regular polygon
    f12roots() {
      const panel = (roots, R0, ox, title, labs) => ({
        ox, w: 186.7, h: 200, x: [-2.6, 2.6], y: [-2.6, 2.6], axes: true, title, m: [22, 6, 6, 6],
        c: [{ pts: arc(R0, 0, 2 * PI, 0, 0, 120), c: 'dm ds' }, { pts: roots.concat([roots[0]]), c: 'ld' }],
        extra: (X, Y) => roots.map((q, i) => dot(X, Y, q[0], q[1]) + FK.T(X(q[0]) + (q[0] >= 0 ? 6 : -6), Y(q[1]) + (q[1] >= 0 ? -6 : 14), labs[i], { a: q[0] >= 0 ? 'start' : 'end', c: 'em' })).join(''),
      });
      const r4 = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
      const r3 = [[Math.sqrt(3), 1], [-Math.sqrt(3), 1], [0, -2]];
      const r5 = rng(0, 2 * PI, 6).slice(0, 5).map((t) => [2 * Math.cos(t), 2 * Math.sin(t)]);
      return G2(560, 200, '거듭제곱근', [
        panel(r4, Math.SQRT2, 0, '(a) z⁴ = −4', ['1 + i', '−1 + i', '−1 − i', '1 − i']),
        panel(r3, 2, 186.7, '(b) z³ = 8i', ['√3 + i', '−√3 + i', '−2i']),
        panel(r5, 2, 373.4, '(c) 1의 5제곱근 (×2로 확대)', ['1', 'ω', 'ω²', 'ω³', 'ω⁴']),
      ], R`$n$제곱근 $n$개는 반지름 $\sqrt[n]{|z|}$인 원 위에 정 $n$각형의 꼭짓점으로 놓이고, 이웃한 두 근의 편각 차는 $2\pi/n$입니다. 한 근에 1의 $n$제곱근 $\omega=e^{2\pi i/n}$을 차례로 곱하면 나머지 근이 나옵니다.`);
    },
    // 13.3 disks, annuli, half-planes
    f12regions() {
      const box = { w: 186.7, h: 190, x: [-2.4, 2.8], y: [-2.1, 2.72], m: [22, 6, 6, 6] };
      const ring = (r, cx, cy) => arc(r, 0, 2 * PI, cx, cy, 120);
      return G2(560, 190, '복소평면의 영역', [
        Object.assign({}, box, { title: '(a) |z − (1 + i)| < 1.5', c: [{ pts: ring(1.5, 1, 1), c: 'fl2' }, { pts: ring(1.5, 1, 1), c: 'ld ds' }], extra: (X, Y) => dot(X, Y, 1, 1) + FK.T(X(1) + 6, Y(1) - 6, 'a = 1 + i', { a: 'start', c: 'em' }) + FK.L(X(1), Y(1), X(1 + 1.5 * Math.cos(-0.7)), Y(1 + 1.5 * Math.sin(-0.7)), 'vl') + FK.T(X(1.75), Y(0.25) + 14, 'ρ', { c: 'it' }) }),
        Object.assign({}, box, { ox: 186.7, title: '(b) 1 < |z| < 2 (고리)', c: [{ pts: ring(2, 0, 0).concat([null], ring(1, 0, 0).reverse()), c: 'fl2' }, { pts: ring(2, 0, 0), c: 'ld ds' }, { pts: ring(1, 0, 0), c: 'ld ds' }] }),
        Object.assign({}, box, { ox: 373.4, title: '(c) Re z > 1 (반평면)', c: [{ pts: [[1, -2.1], [2.8, -2.1], [2.8, 2.72], [1, 2.72]], c: 'fl2' }, { pts: [[1, -2.1], [1, 2.72]], c: 'ld ds' }], extra: (X, Y) => FK.T(X(1) + 4, Y(0) + 14, '1', { a: 'start' }) }),
      ], R`점선 경계는 집합에 속하지 않습니다. 세 집합 모두 열려 있고(모든 점이 집합 안의 원판으로 둘러싸임) 연결되어 있으므로 정의역입니다. (a)의 원판 $|z-a|\lt \rho$를 $a$의 $\rho$-근방이라 합니다.`);
    },
    // 13.3/13.4 the two directions of approach used in the Cauchy–Riemann proof
    f12cr() {
      const z = [1, 1];
      return G({
        w: 400, h: 220, x: [-0.2, 2.6], y: [-0.1, 2.3], axes: false, m: [8, 8, 8, 8], label: '두 방향에서의 극한',
        c: [{ pts: [[0, 1], [2.6, 1]], c: 'dm' }, { pts: [[1, -0.1], [1, 2.3]], c: 'dm' }],
        extra: (X, Y) => V(X, Y, [2.1, 1], [1.07, 1], 'ld', 9) + V(X, Y, [1, 2.0], [1, 1.07], 'rx', 9) + dot(X, Y, z[0], z[1]) + dot(X, Y, 2.1, 1, true) + dot(X, Y, 1, 2.0, true)
          + FK.T(X(1) - 6, Y(1) + 16, 'z', { a: 'end', c: 'em' }) + FK.T(X(1.6), Y(1) + 18, '경로 I: Δz = Δx', { c: 'lb' }) + FK.T(X(1) + 8, Y(1.6), '경로 II: Δz = iΔy', { a: 'start', c: 'rl' })
          + FK.T(X(2.15), Y(1) - 10, 'z + Δx', { a: 'start' }) + FK.T(X(1) + 8, Y(2.0) - 4, 'z + iΔy', { a: 'start' }),
        cap: R`미분가능하다는 것은 $\Delta z$가 어느 방향에서 0으로 가든 차분몫이 같은 값으로 간다는 뜻입니다. 경로 I (실수축 방향)에서 $f'=u_x+iv_x$, 경로 II (허수축 방향)에서 $f'=-iu_y+v_y$가 나오고, 둘을 같게 놓은 것이 코시-리만 방정식입니다. $f=\bar z$이면 차분몫 $\overline{\Delta z}/\Delta z$가 경로 I에서 $1$, 경로 II에서 $-1$이라 미분할 수 없습니다.`,
      });
    },
    // 13.5 the exponential maps the fundamental strip onto the punctured plane
    f12exp() {
      const xs = [-1, 0, 0.7], ys = [-2 * PI / 3, -PI / 3, 0, PI / 3, 2 * PI / 3];
      return G2(560, 240, '지수함수의 사상', [
        { w: 280, h: 240, x: [-2.2, 2.2], y: [-3.9, 3.9], title: '(a) z 평면의 기본 띠 −π < y ≤ π', xl: 'x', yl: 'y', yt: [[PI, 'π'], [-PI, '−π']], xt: [[-1, '−1'], [0.7, '0.7']], m: [22, 10, 16, 22],
          c: [{ pts: [[-2.2, -PI], [2.2, -PI], [2.2, PI], [-2.2, PI]], c: 'fl' }, { pts: [[-2.2, PI], [2.2, PI]], c: 'dm' }, { pts: [[-2.2, -PI], [2.2, -PI]], c: 'dm ds' }]
            .concat(xs.map((x) => ({ pts: [[x, -PI], [x, PI]], c: 'ld' })), ys.map((y) => ({ pts: [[-2.2, y], [2.2, y]], c: 'rx' }))) },
        { ox: 280, w: 280, h: 240, x: [-2.9, 2.9], y: [-2.3, 2.3], title: '(b) w = e^z 평면', xl: 'u', yl: 'v', xt: [[1, '1'], [2, '2']], m: [22, 10, 16, 16],
          c: xs.map((x) => ({ pts: arc(Math.exp(x), 0, 2 * PI, 0, 0, 120), c: 'ld' })).concat(ys.map((y) => ({ pts: [[0, 0], [2.3 * Math.cos(y) * 1.4, 2.3 * Math.sin(y) * 1.4]], c: 'rx' })), [{ pts: [[0, 0], [-2.3, 0]], c: 'vl' }]),
          extra: (X, Y) => dot(X, Y, 0, 0, true) + FK.T(X(0.15), Y(-2.1), '원점(0)은 값이 아님', { a: 'start', c: 'em' }) },
      ], R`$e^z=e^xe^{iy}$에서 세로선 $x=$상수(파랑)는 반지름 $e^x$인 원으로, 가로선 $y=$상수(주황)는 편각이 $y$인 반직선으로 갑니다. 띠의 높이가 $2\pi$라 원을 딱 한 바퀴 돌고, 위아래로 $2\pi$씩 옮긴 띠도 똑같은 그림을 줍니다(주기 $2\pi i$). $e^z\ne0$이므로 원점은 값이 되지 않습니다. 윗변 $y=\pi$와 아랫변은 모두 음의 실수축(검은 선)으로 갑니다.`);
    },
    // 13.6 |sin z| is unbounded
    f12sin() {
      const ys = [0, 0.5, 1, 1.5], cls = ['vl', 'ld', 'rx', 'dm ds'];
      return G({
        w: 460, h: 220, x: [0, 2 * PI], y: [0, 2.6], xl: 'x', xt: [[PI / 2, 'π/2'], [PI, 'π'], [2 * PI, '2π']], yt: [[1, '1'], [2, '2']], m: [10, 12, 22, 22], label: '복소 사인의 절댓값',
        c: ys.map((y, i) => ({ f: (x) => Math.sqrt(Math.sin(x) ** 2 + sh(y) ** 2), c: cls[i] })),
        extra: (X, Y) => ys.map((y, i) => FK.T(X(PI) + 5, i === 0 ? Y(0) - 8 : Y(sh(y)) - 7, `y = ${y}`, { a: 'start', c: i === 0 ? 'em' : i === 1 ? 'lb' : i === 2 ? 'rl' : '' })).join(''),
        cap: R`직선 $\operatorname{Im}z=y$를 따라 본 $|\sin z|=\sqrt{\sin^2x+\sinh^2y}$. 실수축($y=0$)에서는 1을 넘지 않지만 실수축에서 멀어지면 $\sinh y$만큼 커져 유계가 아닙니다. 0이 되는 곳은 $y=0$, $x=n\pi$뿐입니다.`,
      });
    },
    // 13.7 branch cut of Ln z and the values of ln(−1 + i)
    f12log() {
      const z = [-1, 1], L = Math.log(Math.SQRT2), a0 = (3 * PI) / 4;
      const vals = [-2, -1, 0, 1].map((n) => [L, a0 + 2 * n * PI]);
      return G2(560, 250, '로그의 가지', [
        { w: 260, h: 250, x: [-2.2, 2.2], y: [-2.0, 2.0], title: '(a) z 평면: 가지 자름', xl: 'x', yl: 'y', m: [22, 10, 16, 16],
          c: [{ pts: [[-2.2, 0], [0, 0]], c: 'rx' }, { pts: arc(Math.SQRT2, -PI + 0.08, PI - 0.08, 0, 0, 100), c: 'dm ds' }, { pts: arc(0.5, 0, a0), c: 'vl' }],
          extra: (X, Y) => V(X, Y, [0, 0], z) + dot(X, Y, z[0], z[1]) + FK.T(X(z[0]) - 4, Y(z[1]) - 6, '−1 + i', { a: 'end', c: 'lb' }) + FK.T(X(0.35), Y(0.55), 'Arg = 3π/4', { a: 'start', c: 'em' })
            + FK.T(X(-1.9), Y(0) - 8, '가지 자름', { a: 'start', c: 'rl' }) + FK.T(X(-1.5), Y(0.18) - 18, 'Arg → π', { a: 'start' }) + FK.T(X(-1.5), Y(-0.18) + 22, 'Arg → −π', { a: 'start' }) },
        { ox: 280, w: 280, h: 250, x: [-1.3, 2.0], y: [-12.5, 9.5], title: '(b) w 평면: ln(−1 + i)의 값들', xl: 'u', yl: 'v', yt: [[PI, 'π'], [-PI, '−π'], [3 * PI, '3π'], [-3 * PI, '−3π']], m: [22, 10, 16, 26],
          c: [{ pts: [[-1.3, -PI], [2.0, -PI], [2.0, PI], [-1.3, PI]], c: 'fl2' }, { pts: [[L, -12.5], [L, 9.5]], c: 'dm ds' }],
          extra: (X, Y) => vals.map((q, i) => dot(X, Y, q[0], q[1]) + FK.T(X(q[0]) + 8, Y(q[1]) + 4, i === 2 ? 'Ln (주값)' : `n = ${i - 2}`, { a: 'start', c: i === 2 ? 'lb' : '' })).join('') + FK.T(X(-1.2), Y(0) + 4, '주값의 띠', { a: 'start', c: 'em' }) },
      ], R`(a) 주편각 $\operatorname{Arg}z\in(-\pi,\pi]$는 음의 실수축(주황)을 건너면 $\pi$에서 $-\pi$로 뜁니다. 그래서 $\operatorname{Ln}z$는 이 반직선(가지 자름)에서 불연속이고 그 밖에서 해석적입니다. (b) $\ln(-1+i)=\ln\sqrt2+i\big(\frac{3\pi}4+2n\pi\big)$의 값들은 세로선 $u=\ln\sqrt2\approx0.347$ 위에 $2\pi$ 간격으로 놓이고, 그중 띠 $-\pi\lt v\le\pi$에 있는 것이 주값입니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
