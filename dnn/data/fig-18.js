/* 18 바론 정리와 일반화 — 본문 그림 (Maurey의 무작위 표본 평균, 코사인 능선의 헤비사이드 계단 근사) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const f1 = (v) => Math.round(v * 10) / 10;
  // deterministic uniform numbers in [0, 1)
  const rng = (seed) => { let s = seed >>> 0; return () => ((s = (1664525 * s + 1013904223) >>> 0) / 4294967296); };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 18.3 Maurey: averages of N random vertices (drawn with probabilities α_j) gather around f* = Σ α_j h_j
    maurey() {
      const H = [[95, 205], [55, 95], [190, 28], [335, 78], [310, 215]];
      const al = [0.1, 0.3, 0.15, 0.25, 0.2];
      const fs = [0, 1].map((k) => H.reduce((s, h, j) => s + al[j] * h[k], 0));
      const draw = (u) => { let c = 0; for (let j = 0; j < 5; j++) { c += al[j]; if (u < c) return j; } return 4; };
      const avg = (N, r) => { let x = 0, y = 0; for (let i = 0; i < N; i++) { const h = H[draw(r())]; x += h[0]; y += h[1]; } return [x / N, y / N]; };
      const r = rng(18);
      let s = FK.P('M' + H.map((p) => p.join(',')).join('L') + 'Z', 'fl') + FK.P('M' + H.map((p) => p.join(',')).join('L') + 'Z', 'gd');
      for (let t = 0; t < 40; t++) { const [x, y] = avg(4, r); s += FK.C(f1(x), f1(y), 2.4, 'doto'); }
      for (let t = 0; t < 40; t++) { const [x, y] = avg(32, r); s += FK.C(f1(x), f1(y), 2, 'dotf'); }
      H.forEach(([x, y], j) => { s += FK.C(x, y, 3.2, 'jt') + FK.T(x + (x < 150 ? -12 : 13), y + (y < 100 ? -6 : 16), 'h_' + (j + 1), { c: 'it' }); });
      s += FK.C(f1(fs[0]), f1(fs[1]), 4.5, 'jt');
      s += FK.C(410, 70, 2.4, 'doto') + FK.T(422, 74, 'N = 4', { a: 'start' })
        + FK.C(410, 96, 2, 'dotf') + FK.T(422, 100, 'N = 32', { a: 'start' })
        + FK.C(410, 122, 4.5, 'jt') + FK.T(422, 126, 'f* = Σ α_j h_j', { a: 'start' })
        + FK.T(410, 160, 'E‖f* − avg‖² ≤ B²/N', { a: 'start', c: 'em' });
      return FK.fig(560, 250, 'Maurey 보조정리: 무작위 꼭짓점의 평균', s,
        R`꼭짓점 $h_1,\dots,h_5$를 확률 $\alpha=(0.1,0.3,0.15,0.25,0.2)$로 $N$번 뽑아 평균한 점을 40번씩 찍었습니다. 평균은 모두 볼록 껍질(옅은 영역) 안에 있고 기댓값은 $f^*=\sum_j\alpha_jh_j$입니다. $N=4$(빈 점)보다 $N=32$(찬 점)가 $f^*$ 둘레에 훨씬 촘촘히 모입니다. 제곱 거리의 평균이 $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)$로 $N$에 반비례하기 때문입니다.`);
    },
    // 18.1 extending f from Omega=[-1,1] to the whole line: a smooth extension vs an abrupt one
    extend() {
      const f = (t) => 0.55 + 0.3 * Math.sin(3.2 * t) - 0.12 * t;
      const f1v = f(1), fm = f(-1);
      const edge = (t) => (t > 0 ? f1v : fm);
      const smooth = (t) => (Math.abs(t) <= 1 ? f(t) : edge(t) * (1 + Math.cos(Math.PI * (Math.abs(t) - 1))) / 2 * (Math.abs(t) < 2 ? 1 : 0));
      const rough = (t) => (Math.abs(t) <= 1 ? f(t) : edge(t) + 0.28 * Math.sin(14 * (Math.abs(t) - 1)) * Math.min(1, (Math.abs(t) - 1) * 4) - 0.2 * (Math.abs(t) - 1));
      return FK.G({ w: 560, h: 250, x: [-2.2, 2.2], y: [-0.25, 1.35], m: [14, 14, 26, 14], label: 'Ω 밖으로 연장하기', noY: true,
        xt: [[-1, '−1'], [1, '1']], xl: 'x',
        inner: (X, Y) => FK.R(X(-1), Y(1.35), X(1) - X(-1), Y(-0.25) - Y(1.35), 'fl'),
        c: [
          { f: rough, a: -2.2, b: 2.2, n: 700, c: 'rx' },
          { f: smooth, a: -2.2, b: 2.2, n: 400, c: 'vl' },
          { f, a: -1, b: 1, c: 'ld' },
        ],
        t: [[0, 1.27, 'Ω (f가 정의된 곳)', { c: 'lb' }]],
        extra: (X, Y) => FK.legend(X(-2.1), Y(1.25), [['ld', 'f (Ω 안)'], ['vl', '부드러운 연장'], ['rx', '급하게 이은 연장']]),
        cap: R`$f$는 구간 $\Omega=[-1,1]$(옅은 띠) 위에서만 정의됩니다. $\Omega$ 밖으로 이어 붙이는 방법은 무한히 많고, 모두 $f_e|_\Omega=f$를 만족합니다. 부드럽게 $0$으로 줄이는 연장(검은 선)은 고주파가 거의 없어서 $\int(1+|\xi|)^s|\hat f_e|d\xi$가 작고, 밖에서 심하게 출렁이는 연장(붉은 선)은 고주파 때문에 이 적분이 큽니다. $B^s(\Omega)$의 노름은 이런 연장들 가운데 **적분이 가장 작은 것**의 값(하한)입니다.` });
    },
    // 18.4 the lattice approximation: C∫q dΛ ≈ C Σ q(θ) Λ(I_θ), weights sum to 1
    lattice() {
      const x0 = 0.6, n = 2;
      const kap = (v) => 0.9 * Math.tanh(3 * v);
      const q = (v) => (Math.abs(v) < 1e-9 ? 0 : (Math.cos(2 * Math.PI * v * x0 + kap(v)) - Math.cos(kap(v))) / (2 * Math.PI * Math.abs(v)));
      const rho = (v) => Math.exp(-v * v / (2 * 1.1 * 1.1)) / (1.1 * Math.sqrt(2 * Math.PI));
      const th = []; for (let k = -6; k <= 6; k++) th.push(k / n);
      const top = { ox: 0, oy: 0, w: 560, h: 150, x: [-3.4, 3.4], y: [-0.8, 0.5], m: [14, 14, 6, 14], noY: true, ax0: 0,
        xt: [], xl: 'ξ',
        c: [{ f: q, a: -3.4, b: 3.4, n: 700, c: 'ld' }],
        extra: (X, Y) => th.map((v) => FK.C(X(v), Y(q(v)), 3.2, 'doto')).join('') + FK.T(X(-3.3), Y(0.42), 'q_{x}(ξ)', { a: 'start', c: 'it' }) };
      const bot = { ox: 0, oy: 150, w: 560, h: 130, x: [-3.4, 3.4], y: [0, 0.42], m: [8, 14, 26, 14], noY: true,
        xt: th.filter((v, i) => i % 2 === 0).map((v) => [v, String(v)]), xl: 'ξ',
        c: [{ f: rho, a: -3.4, b: 3.4, c: 'rx' }],
        inner: (X, Y) => th.map((v) => FK.R(X(v - 0.25), Y(rho(v)), X(v + 0.25) - X(v - 0.25), Y(0) - Y(rho(v)), 'fl2')).join(''),
        extra: (X, Y) => FK.T(X(-3.3), Y(0.38), '밀도 dΛ/dξ와 칸의 질량 Λ(I_θ)', { a: 'start', c: 'rl' }) };
      return FK.G2(560, 290, '격자 근사', [top, bot],
        R`위: 코사인 능선의 한 성분 $q_x(\xi)$(고정한 $x$, 위상 $\kappa(\xi)$는 홀함수). 빈 점은 격자점 $\theta\in\frac1n\mathbb Z$($n=2$)에서의 값 $q_x(\theta)$입니다. 아래: 확률측도 $\Lambda$의 밀도(붉은 곡선)와, 격자점을 품은 칸 $I_\theta$마다 쌓인 질량 $\Lambda(I_\theta)$(막대의 넓이). 막대의 넓이는 모두 $0$ 이상이고 합이 $1$입니다. 그래서 원래의 적분 $f(x)-f(0)=C\int q_x\,d\Lambda$를 격자 합 $C\sum_\theta q_x(\theta)\Lambda(I_\theta)$로 바꾸면, 이는 함수 $x\mapsto Cq_x(\theta)$들의 **볼록 결합**이 되고, 칸을 잘게 할수록($n\to\infty$) 원래 값에 가까워집니다.`);
    },
    // 18.4 a cosine ridge φ(t) on [−1, 1] and its Heaviside staircase with K = 5 steps on each side
    barronstep() {
      const w = 0.6, ka = 0.9, K = 5;
      const phi = (t) => (Math.cos(2 * Math.PI * w * t + ka) - Math.cos(ka)) / (2 * Math.PI * w);
      const stair = (t) => (t >= 0 ? phi(Math.floor(t * K + 1e-9) / K) : phi(-Math.floor(-t * K + 1e-9) / K));
      return FK.G({ w: 560, h: 240, x: [-1.1, 1.1], y: [-0.5, 0.2], xl: 't', label: '코사인 능선과 헤비사이드 계단',
        xt: [[-1, '−1'], [-0.6, '−0.6'], [-0.2, ''], [0.2, ''], [0.6, '0.6'], [1, '1']], m: [12, 14, 22, 30],
        c: [{ f: stair, a: -1, b: 1, n: 1200, c: 'rx' }, { f: phi, a: -1, b: 1, c: 'ld' }],
        extra: (X, Y) => FK.legend(X(-1.0), Y(0.16), [['ld', 'φ(t)'], ['rx', '계단 근사, K = 5']]),
        cap: R`$|\xi|=0.6$, $\kappa=0.9$인 코사인 능선 $\varphi(t)=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}$와, $t_k=\pm\frac k5$에서 높이 $\varphi(t_k)-\varphi(t_{k-1})$만큼 뛰는 헤비사이드 계단. $\varphi(0)=0$이고 $|\varphi'|\le1$이라 오차는 어디서나 $\frac15$ 이하이고, 계단 높이의 절댓값의 합은 전체 변동 $\int_{-1}^1|\varphi'|dt\le2$ 이하입니다. 이것이 $G_C$의 높이 한계 $2C$의 출처입니다.` });
    },
  });
})();
