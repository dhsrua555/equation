/* 14 급수와 유수 적분 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, legend, PI } = window.EMG;
  const FK = window.FK;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 80) => rng(a0, a1, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  const midA = (X, Y, pts, c = 'ld', at = 0.5) => { const i = Math.max(1, Math.min(pts.length - 1, Math.round(at * (pts.length - 1)))); const p = pts[i - 1], q = pts[i]; const dx = X(q[0]) - X(p[0]), dy = Y(q[1]) - Y(p[1]), d = Math.hypot(dx, dy) || 1; return FK.A(X(q[0]) - (dx / d) * 5, Y(q[1]) - (dy / d) * 5, X(q[0]) + (dx / d) * 4, Y(q[1]) + (dy / d) * 4, c, 8); };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 15.2/15.4 the disk of convergence reaches the nearest singularity; real partial sums blow up
    f14disk() {
      const sn = (n) => (x) => { let s = 0, t = 1; for (let k = 0; k <= n; k++) { s += t; t *= -x * x; } return s; };
      return G2(560, 240, '수렴 원판과 특이점', [
        { w: 260, h: 240, x: [-2.2, 2.6], y: [-2.0, 2.3], title: '(a) 1/(1 + z²)의 테일러 급수', xl: 'x', yl: 'y', xt: [[1, '1']], m: [22, 8, 14, 14],
          c: [{ pts: arc(1, 0, 2 * PI, 0, 0, 120), c: 'ld' }, { pts: arc(Math.SQRT2, 0, 2 * PI, 1, 0, 120), c: 'rx' }, { pts: [[0, 0], [0, 1]], c: 'dm ds' }, { pts: [[1, 0], [0, 1]], c: 'dm ds' }],
          extra: (X, Y) => dot(X, Y, 0, 1, true) + dot(X, Y, 0, -1, true) + dot(X, Y, 0, 0) + dot(X, Y, 1, 0)
            + FK.T(X(0) + 6, Y(1) - 6, 'i', { a: 'start', c: 'em' }) + FK.T(X(0) + 6, Y(-1) + 14, '−i', { a: 'start', c: 'em' })
            + FK.T(X(-0.72), Y(-0.72) + 14, 'R = 1', { a: 'end', c: 'lb' }) + FK.T(X(2.2), Y(1.25), 'R = √2', { a: 'start', c: 'rl' }) },
        { ox: 270, w: 290, h: 240, x: [-1.6, 1.6], y: [-0.6, 1.8], title: '(b) 실수축에서의 부분합', xl: 'x', xt: [[-1, '−1'], [1, '1']], yt: [[1, '1']], m: [22, 10, 16, 16],
          c: [{ f: (x) => 1 / (1 + x * x), c: 'vl' }, { f: sn(4), a: -1.5, b: 1.5, n: 300, c: 'ld' }, { f: sn(5), a: -1.5, b: 1.5, n: 300, c: 'rx' }, { f: sn(12), a: -1.5, b: 1.5, n: 300, c: 'dm ds' }],
          extra: (X, Y) => FK.T(X(1.05), Y(0.2) - 6, '1/(1 + x²)', { a: 'start', c: 'em' }) + FK.L(X(1), Y(-0.6), X(1), Y(1.8), 'dm') + FK.L(X(-1), Y(-0.6), X(-1), Y(1.8), 'dm') },
      ], R`(a) $\frac1{1+z^2}$은 $\pm i$ (빈 점)에서만 특이하므로, 0 중심 테일러 급수의 수렴반경은 1 (파란 원), 1 중심이면 $|1-i|=\sqrt2$ (주황 원)입니다. 수렴 원판은 가장 가까운 특이점에 닿을 때까지 커집니다. (b) 실수 $x$로만 보면 $\frac1{1+x^2}$은 어디서나 매끄러운데도, 부분합 $1-x^2+x^4-\cdots$ (차수 8, 10, 24)이 $|x|>1$에서 크게 벗어납니다. 복소평면의 $\pm i$가 원인입니다.`);
    },
    // 15.5 non-uniform convergence: continuous terms, discontinuous limit
    f14uniform() {
      const ns = [1, 2, 5, 12, 40], cls = ['vl', 'ld', 'rx', 'dm ds', 'ld ds'];
      return G({
        w: 460, h: 220, x: [0, 1.08], y: [-0.08, 1.12], xl: 'x', xt: [[0.5, '0.5'], [1, '1']], yt: [[1, '1']], m: [8, 10, 18, 18], label: '고르지 않은 수렴',
        c: ns.map((n, i) => ({ f: (x) => Math.pow(x, n), a: 0, b: 1, n: 300, c: cls[i] })),
        extra: (X, Y) => dot(X, Y, 1, 1) + dot(X, Y, 1, 0, true) + legend(X(0.04), Y(1.0), ns.map((n, i) => [cls[i], `n = ${n}`])),
        cap: R`$f_n(x)=x^n$은 모두 연속이지만, $0\le x\lt 1$에서는 0으로, $x=1$에서는 1로 가서 극한함수가 불연속입니다. $n$을 아무리 키워도 $x=1$ 가까이에 $f_n(x)=\frac12$인 점이 있으므로 $\sup_{0\le x\le1}|f_n(x)-f(x)|$가 0으로 가지 않습니다. 곧 고른 수렴이 아니고, 이것이 연속함수의 극한이 불연속이 될 수 있는 이유입니다.`,
      });
    },
    // 16.1 three Laurent series of the same function in three concentric regions
    f14annuli() {
      return G({
        w: 420, h: 250, x: [-3.82, 3.82], y: [-2.2, 2.2], xl: 'x', yl: 'y', xt: [[-1, '−1'], [2, '2']], m: [8, 10, 14, 14], label: '로랑 급수의 수렴 영역',
        c: [{ pts: [[-3.82, -2.2], [3.82, -2.2], [3.82, 2.2], [-3.82, 2.2]], c: 'fl' }, { pts: arc(2, 0, 2 * PI, 0, 0, 140).concat([null], arc(1, 2 * PI, 0, 0, 0, 100)), c: 'fl2' }, { pts: arc(1, 0, 2 * PI, 0, 0, 100), c: 'rg' }, { pts: arc(1, 0, 2 * PI, 0, 0, 100), c: 'ld ds' }, { pts: arc(2, 0, 2 * PI, 0, 0, 140), c: 'ld ds' }],
        extra: (X, Y) => dot(X, Y, -1, 0, true) + dot(X, Y, 2, 0, true) + FK.T(X(0.1), Y(0.3), 'I', { c: 'em' }) + FK.T(X(0.3), Y(1.35), 'II', { c: 'em' }) + FK.T(X(2.4), Y(1.9), 'III', { c: 'em' }),
        cap: R`$f(z)=\frac3{(z+1)(z-2)}$의 특이점 $-1$, $2$ (빈 점)를 지나는 원이 평면을 세 영역으로 나눕니다: I $|z|\lt 1$ (테일러 급수), II $1\lt |z|\lt 2$ (고리), III $|z|>2$. 중심이 같아도 영역마다 로랑 급수가 다르고, 한 영역 안에서는 하나뿐입니다.`,
      });
    },
    // 16.2 behaviour near a pole and near an essential singularity
    f14sing() {
      return G2(560, 220, '극과 진성 특이점', [
        { w: 280, h: 220, x: [-2, 2], y: [-0.3, 6], title: '(a) 극: |1/z²| → ∞', xl: 'x', xt: [[-1, '−1'], [1, '1']], yt: [[2, '2'], [4, '4']], m: [22, 10, 16, 18],
          c: [{ f: (x) => 1 / (x * x), a: -2, b: -0.05, c: 'ld' }, { f: (x) => 1 / (x * x), a: 0.05, b: 2, c: 'ld' }] },
        { ox: 280, w: 280, h: 220, x: [-2, 2], y: [-0.3, 6], title: '(b) 진성 특이점: e^(1/x)', xl: 'x', xt: [[-1, '−1'], [1, '1']], yt: [[2, '2'], [4, '4']], m: [22, 10, 16, 18],
          c: [{ f: (x) => Math.exp(1 / x), a: -2, b: -0.01, c: 'rx' }, { f: (x) => Math.exp(1 / x), a: 0.05, b: 2, c: 'rx' }],
          extra: (X, Y) => FK.T(X(-1.1), Y(0.9) - 4, '→ 0', { c: 'rl' }) + FK.T(X(0.3), Y(5.2), '→ ∞', { a: 'start', c: 'rl' }) },
      ], R`실수축을 따라 0에 다가갈 때. (a) 극에서는 어느 방향에서 다가가든 $|f|\to\infty$입니다. (b) $e^{1/z}$는 오른쪽에서 오면 $\infty$, 왼쪽에서 오면 0, 허수축을 따라 오면 절댓값 1로 극한이 없습니다. 실제로 0의 아무리 작은 근방에서도 0이 아닌 모든 값을 무한히 자주 취합니다(피카르 정리).`);
    },
    // 16.3 residue theorem: small circles around the singularities inside C
    f14residue() {
      const C = rng(0, 2 * PI, 160).map((t) => [2.1 * Math.cos(t) + 0.2 * Math.cos(2 * t), 1.5 * Math.sin(t) + 0.12 * Math.sin(3 * t)]);
      const zs = [[-0.9, 0.4], [0.6, -0.5], [1.1, 0.6]];
      return G({
        w: 420, h: 240, x: [-2.9, 3.41], y: [-1.75, 1.75], axes: false, m: [8, 8, 8, 8], label: '유수 정리의 증명',
        c: [{ pts: C, c: 'ld' }].concat(zs.map(([x, y]) => ({ pts: arc(0.32, 0, 2 * PI, x, y, 50), c: 'rx' }))),
        extra: (X, Y) => midA(X, Y, C, 'ld', 0.2) + midA(X, Y, C, 'ld', 0.65) + zs.map(([x, y], i) => dot(X, Y, x, y) + midA(X, Y, arc(0.32, 0, 2 * PI, x, y, 50), 'rx', 0.3) + FK.T(X(x) + 4, Y(y) + 14, `z${'₁₂₃'[i]}`, { a: 'start', c: 'em' })).join('')
          + FK.T(X(2.2), Y(1.3), 'C', { a: 'start', c: 'lb' }) + dot(X, Y, 2.9, -1.35, true) + FK.T(X(2.9), Y(-1.35) + 14, '밖의 특이점', { c: 'em' }),
        cap: R`$C$ 안의 특이점 $z_1,\dots,z_k$를 작은 원으로 둘러싸면, 그 사이의 다중연결 영역에서 $f$가 해석적이므로 $\oint_C=\oint_{C_1}+\cdots+\oint_{C_k}$ (모두 반시계)입니다. 각 작은 원의 적분이 $2\pi i\operatorname{Res}_{z=z_j}f$이므로 유수 정리가 나옵니다. $C$ 밖의 특이점은 셈에 들어가지 않습니다.`,
      });
    },
    // 16.4 closing the real axis with a big semicircle; indenting around a real pole
    f14semi() {
      const R0 = 2.4;
      const S = arc(R0, 0, PI, 0, 0, 80), small = arc(0.35, PI, 0, 1, 0, 30);
      return G2(560, 220, '실적분의 경로', [
        { w: 280, h: 220, x: [-3, 3], y: [-0.9, 3.33], title: '(a) 실수축 + 큰 반원 S', xl: 'x', yl: 'y', xt: [[-R0, '−R'], [R0, 'R']], m: [22, 8, 16, 14],
          c: [{ pts: [[-R0, 0], [R0, 0]], c: 'ld' }, { pts: S, c: 'ld' }],
          extra: (X, Y) => midA(X, Y, [[-R0, 0], [0.2, 0]], 'ld', 1) + midA(X, Y, S, 'ld', 0.3) + dot(X, Y, 0.8, 1.0, true) + dot(X, Y, -0.9, 0.6, true) + dot(X, Y, 0.5, -0.5, true)
            + FK.T(X(0.8) + 6, Y(1.0) - 4, '센다', { a: 'start', c: 'em' }) + FK.T(X(0.5) + 6, Y(-0.5) + 4, '세지 않음', { a: 'start' }) + FK.T(X(1.9), Y(1.9), 'S', { a: 'start', c: 'lb' }) },
        { ox: 280, w: 280, h: 220, x: [-3, 3], y: [-0.9, 3.33], title: '(b) 실수축 위의 극 피하기', xl: 'x', yl: 'y', xt: [[1, 'a']], m: [22, 8, 16, 14],
          c: [{ pts: [[-R0, 0], [0.65, 0]], c: 'ld' }, { pts: small, c: 'rx' }, { pts: [[1.35, 0], [R0, 0]], c: 'ld' }, { pts: S, c: 'ld' }],
          extra: (X, Y) => dot(X, Y, 1, 0, true) + dot(X, Y, -0.6, 1.2, true) + midA(X, Y, small, 'rx', 0.5) + midA(X, Y, S, 'ld', 0.3) + FK.T(X(1), Y(0.35) - 6, 'C₂', { c: 'rl' }) + FK.T(X(1.2), Y(-0.1) + 16, '반지름 r', { a: 'start' }) },
      ], R`(a) $\int_{-R}^R f\,dx+\int_Sf\,dz=2\pi i\sum(\text{위 반평면의 유수})$이고, 분모의 차수가 충분히 높으면 $R\to\infty$에서 $\int_S\to0$입니다. 아래 반평면의 극은 경로 밖이라 세지 않습니다. (b) 실수축 위의 단순극 $a$는 작은 반원 $C_2$로 피해 가고, $r\to0$에서 $C_2$ 위의 적분이 (시계 방향이므로) $-\pi i\operatorname{Res}_{z=a}f$가 되어 주값 공식에 $\pi i\operatorname{Res}$가 더해집니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
