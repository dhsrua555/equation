/* 13 하강 보조정리와 경사하강법의 수렴 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, dot, legend } = FK;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 13.3 a smooth function lies below the quadratic upper bounds built at each point
    quadub() {
      const f = (x) => Math.log(1 + Math.exp(x - 1)) + 0.15 * Math.sin(2.2 * x) + 0.2;
      const df = (x) => 1 / (1 + Math.exp(-(x - 1))) + 0.33 * Math.cos(2.2 * x);
      const beta = 1.1;
      const ub = (x0) => (x) => f(x0) + df(x0) * (x - x0) + (beta / 2) * (x - x0) * (x - x0);
      const tl = (x0) => (x) => f(x0) + df(x0) * (x - x0);
      const x0 = 0.4;
      return G({ w: 560, h: 240, x: [-2.2, 3.4], y: [-0.4, 3.4], xl: 'y', label: '하강 보조정리의 이차 상한', xt: [[x0, 'x']], m: [10, 14, 22, 20],
        c: [{ f: ub(x0), c: 'rx' }, { f: tl(x0), c: 'dm ds' }, { f, c: 'ld' }],
        extra: (X, Y) => dot(X, Y, x0, f(x0)) + legend(X(-2.1), Y(3.2), [['ld', 'f(y)'], ['dm ds', '1차 근사 f(x) + ⟨∇f(x), y − x⟩'], ['rx', '이차 상한 (+ β/2 ‖y − x‖²)']]),
        cap: R`점 $x$에서의 1차 근사(점선, 접선)는 $f$보다 클 수도 작을 수도 있지만, 여기에 $\frac\beta2\lVert y-x\rVert^2$을 더한 포물선은 $f$를 **항상 위에서** 덮습니다. 경사하강법 한 걸음은 이 포물선의 최소점 $y=x-\frac1\beta\nabla f(x)$로 가는 것과 같아, 포물선의 바닥이 $f(x)$보다 $\frac1{2\beta}\lVert\nabla f(x)\rVert^2$만큼 낮으니 $f$도 그만큼 이상 내려갑니다.` });
    },
    // 13.4 the guaranteed decrease per step peaks at eta = 1/beta and vanishes at 2/beta; on a quadratic the loss shrinks by (1-eta*beta)^2 per step
    etadecr() {
      const u0 = 2.05, TT = 10;
      const curve = (u) => Array.from({ length: TT + 1 }, (_, t) => [t, Math.pow(1 - u, 2 * t)]);
      const us = [[0.3, 'ld'], [1, 'rx'], [1.7, 'dm ds'], [u0, 'ld ds']];
      return FK.G2(560, 250, '학습률과 한 걸음당 감소량', [
        { w: 280, h: 250, x: [0, 2.3], y: [-0.2, 0.62], xl: 'ηβ', yl: 'β(η − βη²/2)', xt: [[0.5, '0.5'], [1, '1'], [2, '2']], yt: [[0, '0'], [0.5, '0.5']], vg: [1, 2], m: [28, 10, 24, 34], title: '(a) 보장되는 감소 계수',
          c: [{ f: (u) => u - 0.5 * u * u, c: 'ld' }],
          extra: (X, Y) => FK.dot(X, Y, 1, 0.5) + FK.T(X(1) + 6, Y(0.55), '최대 (η = 1/β)', { a: 'start', s: 11 }) + FK.T(X(2) + 4, Y(-0.12), '0 (η = 2/β)', { a: 'end', s: 11 }) },
        { w: 280, h: 250, ox: 280, x: [0, TT], y: [0, 2.8], xl: 't', yl: 'f(x_t)/f(x_0)', xt: [[0, '0'], [5, '5'], [10, '10']], yt: [[1, '1'], [2, '2']], m: [28, 10, 24, 34], title: '(b) 이차함수에서의 손실',
          c: us.map(([u, c]) => ({ pts: curve(u), c })),
          extra: (X, Y) => FK.legend(X(2.6), Y(2.65), us.map(([u, c]) => [c, 'ηβ = ' + u])) },
      ], R`(a) 하강 보조정리가 보장하는 한 걸음의 감소는 $f(x_{t+1})\le f(x_t)-\big(\eta-\frac{\beta\eta^2}{2}\big)\lVert\nabla f(x_t)\rVert^2$이고, $\beta$를 곱한 계수 $\eta\beta-\frac{(\eta\beta)^2}2$는 $\eta=1/\beta$에서 최대(0.5), $\eta=2/\beta$에서 $0$, 그 너머에서는 음수라 보장이 사라집니다. (b) $f=\frac\beta2x^2$이면 $f(x_t)=(1-\eta\beta)^{2t}f(x_0)$입니다. $\eta\beta=1$이면 한 걸음에 $0$, $0.3$과 $1.7$은 같은 속도로 줄고(배율 $0.49$), $\eta\beta=2.05>2$이면 늘어납니다(값은 예시로 고름).`);
    },
    // 13.6 the SGD bound as a function of the step size for a fixed budget T
    sgdbound() {
      const A = 10, B = 2, T = 100;
      const b1 = (e) => A / (e * T), b2 = (e) => B * e;
      const es = Math.sqrt(A / (B * T));
      return G({ w: 560, h: 230, x: [0, 0.8], y: [0, 3.2], xl: '학습률 η', label: 'SGD 보장식과 최적 학습률', xt: [[es, 'η* ≈ 0.22'], [0.5, '0.5']], yt: [[2 * Math.sqrt(A * B / T), '0.89'], [2, '2']], vg: [es], m: [10, 14, 22, 34],
        c: [{ f: b1, a: 0.03, c: 'dm ds' }, { f: b2, c: 'dm' }, { f: (e) => b1(e) + b2(e), a: 0.03, c: 'ld' }],
        extra: (X, Y) => dot(X, Y, es, 2 * Math.sqrt(A * B / T)) + legend(X(0.45), Y(3.0), [['ld', '합: 보장되는 평균 ‖∇f‖²'], ['dm ds', '(f(x₀) − f*)/(ηT)'], ['dm', '(L/2)ηG']]),
        cap: R`$f(x_0)-f^*=10$, $L=1$, $G=4$, $T=100$일 때 $\frac1T\sum\E\lVert\nabla f(x_t)\rVert^2$의 상한 $\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$. 학습률이 작으면 첫 항(출발점에서 멀리 못 감)이, 크면 둘째 항(잡음)이 커집니다. 합은 $\eta^*=\sqrt{\frac{2(f(x_0)-f^*)}{LGT}}\propto\frac1{\sqrt T}$에서 최소 $2\sqrt{\frac{(f(x_0)-f^*)LG}{2T}}=O(1/\sqrt T)$입니다.` });
    },
  });
})();
