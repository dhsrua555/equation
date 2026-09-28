/* 07 고유값 문제 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, legend, dot, PI } = window.EMG;
  const FK = window.FK;
  const circle = (r, n = 160) => Array.from({ length: n + 1 }, (_, k) => [r * Math.cos((2 * PI * k) / n), r * Math.sin((2 * PI * k) / n)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 8.2 stretching of a membrane by y = Ax, A = [[3,1],[1,3]]
    f07membrane() {
      const map = ([x, y]) => [3 * x + y, x + 3 * y];
      const ell = circle(1).map(map);
      const pts = [0, 30, 60, 100, 150, 200, 250, 300].map((d) => [Math.cos((d * PI) / 180), Math.sin((d * PI) / 180)]);
      const s = Math.SQRT1_2;
      return G({
        x: [-4.6, 4.6], y: [-3.4, 3.4], h: 300, w: 400, m: [10, 10, 16, 16], xt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']], yt: [[-2, '−2'], [2, '2']], xl: 'x₁', yl: 'x₂',
        c: [{ pts: circle(1), c: 'vl' }, { pts: ell, c: 'ld' }, { pts: [[-3.4, -3.4], [3.4, 3.4]], c: 'dm ds' }, { pts: [[-2.3, 2.3], [2.3, -2.3]], c: 'dm ds' }],
        extra: (X, Y) => pts.map((p) => { const q = map(p); return FK.A(X(p[0]), Y(p[1]), X(q[0]), Y(q[1]), 'rx', 7); }).join('')
          + FK.A(X(0), Y(0), X(4 * s), Y(4 * s), 'ld', 9) + FK.A(X(0), Y(0), X(2 * s), Y(-2 * s), 'ld', 9)
          + FK.T(X(4 * s) + 6, Y(4 * s) - 4, '×4', { a: 'start', c: 'em' }) + FK.T(X(2 * s) + 6, Y(-2 * s) + 12, '×2', { a: 'start', c: 'em' }),
        label: '막의 늘임과 주방향',
        cap: R`$\mathbf y=A\mathbf x$, $A=\begin{bmatrix}3&1\\1&3\end{bmatrix}$에 의해 단위원(검은 선)이 타원(파란 선)이 됩니다. 주황 화살표는 원 위의 점이 옮겨 가는 곳으로, 대부분 방향이 바뀝니다. 고유벡터 방향(점선, 45°와 135°)에서만 방향이 그대로이고 길이가 각각 4배, 2배가 됩니다.`,
      });
    },
    // 8.4 principal axes of a conic
    f07conic() {
      // 5x1^2 - 4x1x2 + 8x2^2 = 36 ; eigen 4 along (2,1)/√5, 9 along (1,-2)/√5
      const u = [2 / Math.sqrt(5), 1 / Math.sqrt(5)], v = [1 / Math.sqrt(5), -2 / Math.sqrt(5)];
      const ell = Array.from({ length: 161 }, (_, k) => { const t = (2 * PI * k) / 160; const a = 3 * Math.cos(t), b = 2 * Math.sin(t); return [a * u[0] + b * v[0], a * u[1] + b * v[1]]; });
      const hy = (sg) => Array.from({ length: 121 }, (_, k) => { const t = -1.6 + (3.2 * k) / 120; const a = sg * Math.cosh(t), b = Math.sqrt(3) * Math.sinh(t); const s = Math.SQRT1_2; return [s * (a - b), s * (a + b)]; });
      return G2(560, 250, '이차곡선의 주축', [
        { w: 280, h: 250, x: [-3.6, 3.6], y: [-3, 3], title: '5x₁² − 4x₁x₂ + 8x₂² = 36', xt: [[-3, '−3'], [3, '3']], yt: [[-2, '−2'], [2, '2']], xl: 'x₁', yl: 'x₂', m: [20, 8, 16, 14],
          c: [{ pts: [[-3.6 * u[0] * 1.2, -3.6 * u[1] * 1.2], [3.6 * u[0] * 1.2, 3.6 * u[1] * 1.2]], c: 'dm ds' }, { pts: [[-1.4 * v[0] * 2, -1.4 * v[1] * 2], [1.4 * v[0] * 2, 1.4 * v[1] * 2]], c: 'dm ds' }, { pts: ell, c: 'ld' }],
          extra: (X, Y) => FK.T(X(3.2 * u[0]) + 4, Y(3.2 * u[1]) - 4, 'y₁', { a: 'start' }) + FK.T(X(2.4 * v[0]) + 4, Y(2.4 * v[1]) + 8, 'y₂', { a: 'start' }) },
        { ox: 280, w: 280, h: 250, x: [-4, 4], y: [-3.3, 3.3], title: 'x₁² + 4x₁x₂ + x₂² = 3', xt: [[-3, '−3'], [3, '3']], yt: [[-2, '−2'], [2, '2']], xl: 'x₁', yl: 'x₂', m: [20, 8, 16, 14],
          c: [{ pts: [[-3, -3], [3, 3]], c: 'dm ds' }, { pts: [[-3, 3], [3, -3]], c: 'dm ds' }, { pts: hy(1), c: 'rx' }, { pts: hy(-1), c: 'rx' }] },
      ], R`왼쪽: 고유값 4, 9인 타원 $\frac{y_1^2}{9}+\frac{y_2^2}{4}=1$. 주축(점선)은 고유벡터 $(2,1)^T$, $(1,-2)^T$ 방향입니다. 오른쪽: 고유값 $3$, $-1$이라 부호가 달라 쌍곡선 $y_1^2-\frac{y_2^2}{3}=1$이 되고, 주축은 $45^\circ$ 돌아간 두 대각선입니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
