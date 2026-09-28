/* 06 행렬과 연립일차방정식 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G2, dot } = window.EMG;
  const FK = window.FK;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 7.3 two equations in two unknowns: one, infinitely many, or no solution
    f06lines() {
      const base = { w: 186, h: 180, x: [-0.6, 2.6], y: [-0.6, 2.6], m: [20, 6, 16, 16], xt: [[1, '1'], [2, '2']], yt: [[1, '1'], [2, '2']], xl: 'x₁', yl: 'x₂' };
      const line = (a, b, c) => (x) => (c - a * x) / b; // a x1 + b x2 = c
      return G2(558, 180, '두 직선의 세 가지 위치 관계', [
        Object.assign({}, base, { title: '(a) 해가 하나', c: [{ f: line(1, 1, 2), c: 'ld' }, { f: line(1, -1, 0), c: 'rx' }], extra: (X, Y) => dot(X, Y, 1, 1) }),
        Object.assign({}, base, { ox: 186, title: '(b) 해가 무수히 많음', c: [{ f: line(3, 3, 6), c: 'rx' }, { f: line(1, 1, 2), c: 'ld ds' }] }),
        Object.assign({}, base, { ox: 372, title: '(c) 해가 없음', c: [{ f: line(1, 1, 2), c: 'ld' }, { f: line(1, 1, 0), c: 'rx' }] }),
      ], R`(a) $x_1+x_2=2$, $x_1-x_2=0$은 점 $(1,1)$에서 만납니다. (b) $x_1+x_2=2$와 $3x_1+3x_2=6$은 같은 직선입니다. (c) $x_1+x_2=2$와 $x_1+x_2=0$은 평행해 만나지 않습니다. 미지수가 셋이면 직선 대신 평면들의 위치 관계가 됩니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
