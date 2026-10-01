/* 고난이도 문제 풀이(hard-NN.js)의 그림 — core/figkit.js(FK)와 em/figs.js(EMG)로 그립니다. */
(function () {
  const { G, legend, dot, piT, PI } = window.EMG;
  const R = String.raw;
  const piTicks = (vals, d) => vals.map((v) => [v, piT(v, d)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 7.7 #20(c): the circle through (2,6), (6,4), (7,1) — equal x and y scale
    fhdcircle() {
      const pts = [];
      for (let k = 0; k <= 160; k++) { const t = (2 * PI * k) / 160; pts.push([2 + 5 * Math.cos(t), 1 + 5 * Math.sin(t)]); }
      return G({
        w: 420, h: 400, m: [14, 18, 24, 34], x: [-3.6, 8.4], y: [-4.6, 6.8], xl: 'x', yl: 'y',
        xt: [[-2, '−2'], [2, '2'], [4, '4'], [6, '6'], [8, '8']], yt: [[-4, '−4'], [2, '2'], [4, '4'], [6, '6']],
        c: [{ pts, c: 'ld' }],
        extra: (X, Y) => [[2, 6], [6, 4], [7, 1]].map(([a, b]) => dot(X, Y, a, b)).join('') + dot(X, Y, 2, 1, true) +
          `<line class="dm ds" x1="${X(2)}" y1="${Y(1)}" x2="${X(7)}" y2="${Y(1)}"/>`,
        t: [[2.25, 6.35, '(2, 6)', { a: 'start' }], [6.25, 4.4, '(6, 4)', { a: 'start' }], [7.2, 1.45, '(7, 1)', { a: 'start' }],
          [1.9, 0.35, '중심 (2, 1)', { a: 'end' }], [4.5, 1.35, 'r = 5']],
        label: '세 점 (2,6), (6,4), (7,1)을 지나는 원',
        cap: R`세 점을 지나는 원 $(x-2)^2+(y-1)^2=25$. 행렬식 조건은 $A(x^2+y^2)+Bx+Cy+D=0$의 네 계수가 자명하지 않게 존재할 조건이고, 풀면 중심 $(2,1)$, 반지름 5가 나옵니다(가로·세로 축척 같음).`,
      });
    },
    // 8.4 #23: the hyperbola −11x1² + 84x1x2 + 24x2² = 156 and its principal axes
    fhdhyper() {
      const s13 = Math.sqrt(13), r3 = Math.sqrt(3);
      const toX = (y1, y2) => [(2 * y1 - 3 * y2) / s13, (3 * y1 + 2 * y2) / s13];
      const branch = (sg) => { const p = []; for (let k = 0; k <= 120; k++) { const s = -1.7 + (3.4 * k) / 120; p.push(toX(sg * r3 * Math.cosh(s), 2 * Math.sinh(s))); } return p; };
      const axis = (d) => [toX(-6 * d[0], -6 * d[1]), toX(6 * d[0], 6 * d[1])];
      const v1 = toX(r3, 0), v2 = toX(-r3, 0);
      return G({
        w: 400, h: 396, m: [14, 18, 24, 34], x: [-4.2, 4.2], y: [-4.2, 4.2], xl: 'x₁', yl: 'x₂',
        xt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']], yt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']],
        c: [{ pts: axis([1, 0]), c: 'dm ds' }, { pts: axis([0, 1]), c: 'dm ds' }, { pts: branch(1), c: 'ld' }, { pts: branch(-1), c: 'ld' }],
        extra: (X, Y) => dot(X, Y, v1[0], v1[1]) + dot(X, Y, v2[0], v2[1]),
        t: [[2.35, 3.75, 'y₁ 축 (2, 3)', { a: 'start' }], [-3.9, 2.95, 'y₂ 축 (−3, 2)', { a: 'start' }], [1.15, 1.25, '꼭짓점', { a: 'start' }]],
        label: '이차형식 −11x₁² + 84x₁x₂ + 24x₂² = 156의 쌍곡선과 주축',
        cap: R`$-11x_1^2+84x_1x_2+24x_2^2=156$. 고유벡터 $(2,3)$, $(-3,2)$ 방향의 주축(점선)으로 돌려 보면 $\frac{y_1^2}3-\frac{y_2^2}4=1$인 쌍곡선이고, 꼭짓점(점)은 $y_1=\pm\sqrt3$에 있습니다.`,
      });
    },
    // 11.3 #15: input r(t) = t(π² − t²) (periodic) and the steady-state output for c = 0.5 and c = 2
    fhdss() {
      const r = (t) => { const u = ((t + PI) % (2 * PI) + 2 * PI) % (2 * PI) - PI; return u * (PI * PI - u * u); };
      const y = (c) => (t) => {
        let s = 0;
        for (let n = 1; n <= 40; n++) {
          const b = (12 * (n % 2 ? 1 : -1)) / n ** 3, D = (1 - n * n) ** 2 + (c * n) ** 2;
          s += ((-c * n * b) / D) * Math.cos(n * t) + (((1 - n * n) * b) / D) * Math.sin(n * t);
        }
        return s;
      };
      return G({
        w: 560, h: 290, x: [-2 * PI - 0.1, 2 * PI + 0.1], y: [-28, 46], xl: 't',
        xt: piTicks([-2 * PI, -PI, PI, 2 * PI], 1), yt: [[24, '24'], [12, '12'], [-12, '−12'], [-24, '−24']], hg: [24, -24],
        c: [{ f: r, c: 'dm', n: 600 }, { f: y(2), c: 'rx', n: 400 }, { f: y(0.5), c: 'ld', n: 400 }],
        extra: (X, Y) => legend(X(-2 * PI + 0.25), Y(41), [['dm', '입력 r(t) = t(π² − t²)'], ['rx', '출력 y(t), c = 2'], ['ld', '출력 y(t), c = 0.5']]),
        label: '입력 t(π² − t²)와 감쇠 진동계의 정상상태 출력',
        cap: R`$y''+cy'+y=r(t)$. 입력(회색)의 기본파 $12\sin t$가 고유진동수 1과 같아 출력은 거의 $-\frac{12}c\cos t$입니다. $c=0.5$이면 진폭이 약 24(점선)로 입력의 두 배, 위상은 $\frac\pi2$ 늦습니다.`,
      });
    },
    // 11.6 #14: Weber functions w_n = He_n(x) e^(−x²/4), n = 0..3
    fhdherm() {
      const He = [(x) => 1, (x) => x, (x) => x * x - 1, (x) => x ** 3 - 3 * x];
      const cls = ['vl', 'ld', 'rx', 'dm'];
      return G({
        w: 560, h: 250, x: [-5.4, 5.4], y: [-2.4, 2.4], xl: 'x',
        xt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']], yt: [[2, '2'], [1, '1'], [-1, '−1'], [-2, '−2']],
        c: He.map((h, n) => ({ f: (x) => h(x) * Math.exp(-(x * x) / 4), c: cls[n] })),
        extra: (X, Y) => legend(X(2.55), Y(-0.9), [['vl', 'n = 0'], ['ld', 'n = 1'], ['rx', 'n = 2'], ['dm', 'n = 3']]),
        label: '에르미트 다항식에 e^(−x²/4)를 곱한 베버 함수',
        cap: R`$w_n=He_n(x)e^{-x^2/4}$ ($n=0,1,2,3$). $n$번째 함수는 영점이 $n$개이고 $\lvert x\rvert\to\infty$에서 0으로 갑니다. $\int w_mw_n\,dx=\int e^{-x^2/2}He_mHe_n\,dx=0$ ($m\ne n$)이 문제 (d)의 직교성입니다.`,
      });
    },
  });
})();
