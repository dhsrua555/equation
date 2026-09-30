/* 17 선형대수학(강의 PPT) — 본문 그림 (em/figs.js의 EMG, core/figkit.js의 FK로 그립니다) */
(function () {
  const { G2, legend, piT, PI } = window.EMG;
  const { fig, L, A, T, P } = window.FK;
  const R = String.raw;
  const piTicks = (vals, d) => vals.map((v) => [v, piT(v, d)]);
  const best5 = (x) => 0.987862 * x - 0.155271 * x ** 3 + 0.00564312 * x ** 5;
  const taylor5 = (x) => x - x ** 3 / 6 + x ** 5 / 120;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 3.2 ② projection onto a plane W: v − w ⊥ W, and w is the closest point (slide 37)
    f17proj() {
      const O = [190, 204], w = [382, 186], v = [382, 46], u = [292, 214];
      const d = [O[0] - w[0], O[1] - w[1]], n = Math.hypot(d[0], d[1]), e = [(d[0] / n) * 12, (d[1] / n) * 12];
      let s = P('M70,236L392,236L502,150L180,150Z', 'bm2');
      s += A(O[0], O[1], w[0], w[1], 'ld') + A(O[0], O[1], v[0], v[1], 'vl') + A(w[0], w[1], v[0], v[1], 'rx');
      s += P(`M${w[0]},${w[1] - 12}L${w[0] + e[0]},${w[1] - 12 + e[1]}L${w[0] + e[0]},${w[1] + e[1]}`, 'dm');
      s += L(u[0], u[1], v[0], v[1], 'dm ds') + L(u[0], u[1], w[0], w[1], 'dm ds');
      s += `<circle class="dotf" cx="${u[0]}" cy="${u[1]}" r="3"/><circle class="dotf" cx="${O[0]}" cy="${O[1]}" r="2.6"/>`;
      s += T(92, 228, 'W', { a: 'start', c: 'em' }) + T(O[0] - 8, O[1] + 16, 'O') + T(v[0] + 10, v[1] + 4, 'v', { a: 'start', c: 'em' });
      s += T(w[0] + 10, w[1] + 14, 'w', { a: 'start', c: 'em' }) + T(v[0] + 10, (v[1] + w[1]) / 2, 'v − w ⊥ W', { a: 'start' });
      s += T(u[0] - 6, u[1] + 14, 'u', { a: 'end', c: 'em' }) + T(u[0] + 8, 258, 'u ∈ W이면 ‖v − u‖ ≥ ‖v − w‖', { a: 'start' });
      return fig(560, 268, '벡터 v를 부분공간 W에 정사영한 w와, W의 다른 점 u', s,
        R`부분공간 $W$(평면) 위로 $v$를 정사영한 $w$. $v-w$는 $W$에 수직이고, $W$의 다른 어떤 점 $u$보다 $w$가 $v$에 가깝습니다: $\|v-u\|^2=\|v-w\|^2+\|w-u\|^2$.`);
    },
    // 3.2 ③ sin x, its degree-5 best approximation on [−π, π], and the degree-5 Taylor polynomial (slides 38–40)
    f17sin() {
      const base = { w: 560, x: [-3.45, 3.45], m: [22, 18, 24, 40], xt: piTicks([-PI, -PI / 2, PI / 2, PI], 2) };
      return G2(560, 420, 'sin x의 5차 최선 근사와 5차 테일러 다항식, 그리고 두 오차', [
        Object.assign({}, base, { oy: 0, h: 230, y: [-1.35, 1.35], yt: [[1, '1'], [-1, '−1']], title: '(a) sin x와 두 5차 다항식',
          c: [{ f: Math.sin, c: 'vl' }, { f: best5, c: 'ld' }, { f: taylor5, c: 'rx' }],
          extra: (X, Y) => legend(X(0.35), Y(-0.55), [['vl', 'sin x'], ['ld', '최선 근사 (P5에 정사영)'], ['rx', '5차 테일러 다항식']]) }),
        Object.assign({}, base, { oy: 236, h: 184, y: [-0.62, 0.62], yt: [[0.5, '0.5'], [-0.5, '−0.5']], title: '(b) 오차 sin x − p(x)', hg: [0.016, -0.016],
          c: [{ f: (x) => Math.sin(x) - best5(x), c: 'ld' }, { f: (x) => Math.sin(x) - taylor5(x), c: 'rx' }] }),
      ], R`(a) $[-\pi,\pi]$에서 $\sin x$와 두 5차 다항식. 내적 $\int_{-\pi}^{\pi}fg\,dx$로 구한 최선 근사 $w(x)\approx0.987862x-0.155271x^3+0.00564312x^5$는 곡선과 거의 겹치지만, 테일러 다항식은 구간 끝에서 벗어납니다. (b) 오차 $\sin x-p(x)$. 최선 근사의 오차는 구간 전체에서 $0.016$ 이하(점선 사이)이고, 테일러의 오차는 $x=\pm\pi$에서 $0.524$까지 커집니다.`);
    },
    // quiz HW1-2(3): errors of the best quadratic approximation of cos x on [−1, 1] and of 1 − x²/2
    f17cosfit() {
      const s1 = Math.sin(1), c1 = Math.cos(1);
      const w = (x) => (6 * s1 - 7.5 * c1) + (22.5 * c1 - 15 * s1) * x * x;
      return G2(560, 240, 'cos x의 2차 최선 근사와 테일러 다항식의 오차', [
        { w: 560, h: 240, x: [-1.08, 1.08], y: [-0.012, 0.046], m: [22, 18, 24, 46], oy: 0,
          xt: [[-1, '−1'], [-0.5, '−0.5'], [0.5, '0.5'], [1, '1']], yt: [[0.04, '0.04'], [0.02, '0.02'], [-0.01, '−0.01']],
          title: '오차 cos x − p(x)',
          c: [{ f: (x) => Math.cos(x) - w(x), c: 'ld', a: -1, b: 1 }, { f: (x) => Math.cos(x) - 1 + (x * x) / 2, c: 'rx', a: -1, b: 1 }],
          extra: (X, Y) => legend(X(0.1), Y(0.036), [['ld', '최선 근사 w(x)'], ['rx', '테일러 1 − x²/2']]) },
      ], R`$[-1,1]$에서 $\cos x$와 두 2차 다항식의 오차. 테일러 다항식 $1-\frac{x^2}2$의 오차는 끝점에서 $0.04$까지 커지지만, 최선 근사 $w(x)\approx0.99656-0.46526x^2$의 오차는 구간 전체에서 $0.01$보다 작고 고르게 퍼져 있습니다.`);
    },
  });
})();
