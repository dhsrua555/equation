/* 04 급수해와 특수함수 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, legend, J, P, simpson, PI } = window.EMG;
  // Bessel function of the second kind, integral representation (x > 0)
  function Y(n, x) {
    const a = simpson((t) => Math.sin(x * Math.sin(t) - n * t), 0, PI, 200) / PI;
    const b = simpson((t) => (Math.exp(n * t) + (n % 2 ? -1 : 1) * Math.exp(-n * t)) * Math.exp(-x * Math.sinh(t)), 0, 12, 1200) / PI;
    return a - b;
  }

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 5.2 Legendre polynomials
    f04leg() {
      const cls = ['dm', 'dm ds', 'rx', 'ld', 'vl'];
      return G({
        x: [-1.08, 1.08], y: [-1.1, 1.15], h: 240, m: [14, 120, 24, 34],
        xt: [[-1, '−1'], [-0.5, '−0.5'], [0.5, '0.5'], [1, '1']], yt: [[1, '1'], [-1, '−1'], [0.5, '0.5'], [-0.5, '−0.5']], xl: 'x',
        c: [0, 1, 2, 3, 4].map((n) => ({ f: (x) => P(n, x), c: cls[n] })),
        extra: (X, Y2) => legend(X(1.14), Y2(0.9), [['dm', 'P_0 = 1'], ['dm ds', 'P_1 = x'], ['rx', 'P_2'], ['ld', 'P_3'], ['vl', 'P_4']]),
        label: '르장드르 다항식 P0에서 P4',
        cap: R`르장드르 다항식 $P_0,\dots,P_4$. 모두 $P_n(1)=1$이 되도록 정규화되어 있고, $P_n$은 $(-1,1)$에서 서로 다른 근 $n$개를 가지며, $n$이 짝수이면 우함수, 홀수이면 기함수입니다.`,
      });
    },
    // 5.4–5.5 Bessel functions of the first and second kind
    f04bes() {
      const asym = (x) => Math.sqrt(2 / (PI * x)) * Math.cos(x - PI / 4);
      return G2(560, 420, '베셀 함수', [
        { w: 560, h: 210, x: [0, 15.5], y: [-0.5, 1.05], title: '(a) 제1종 J₀, J₁, J₂', xt: [[2.405, '2.405'], [5.520, '5.520'], [8.654, '8.654'], [10, ''], [15, '15']], yt: [[1, '1'], [0.5, '0.5'], [-0.5, '−0.5']], xl: 'x', m: [20, 12, 22, 30],
          c: [{ f: asym, c: 'vl ds', a: 0.9, n: 300 }, { f: (x) => J(0, x), c: 'ld', n: 400 }, { f: (x) => J(1, x), c: 'rx', n: 400 }, { f: (x) => J(2, x), c: 'dm', n: 400 }],
          extra: (X, Y2) => legend(X(10.6), Y2(0.95), [['ld', 'J_0'], ['rx', 'J_1'], ['dm', 'J_2'], ['vl ds', '√(2/πx) cos(x − π/4)']]) },
        { oy: 214, w: 560, h: 206, x: [0, 15.5], y: [-1.6, 0.8], title: '(b) 제2종 Y₀, Y₁', xt: [[5, '5'], [10, '10'], [15, '15']], yt: [[0.5, '0.5'], [-0.5, '−0.5'], [-1, '−1']], xl: 'x', m: [20, 12, 22, 30],
          c: [{ f: (x) => Y(0, x), c: 'ld', a: 0.05, n: 300 }, { f: (x) => Y(1, x), c: 'rx', a: 0.35, n: 300 }],
          extra: (X, Y2) => legend(X(10.6), Y2(0.62), [['ld', 'Y_0'], ['rx', 'Y_1']]) },
      ], R`(a) $J_0$은 코사인, $J_1$은 사인과 비슷하게 진동하지만 영점 간격이 일정하지 않고 진폭이 $1/\sqrt x$처럼 줄어듭니다. 점선은 $J_0$의 점근식 $\sqrt{2/(\pi x)}\cos(x-\pi/4)$로, 작은 $x$에서도 꽤 정확합니다. (b) $Y_0$, $Y_1$은 $x\to0^+$에서 $-\infty$로 발산합니다. 그래서 원점을 포함하는 영역의 문제에서는 $Y$를 버립니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
