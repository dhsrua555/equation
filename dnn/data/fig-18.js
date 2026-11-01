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
      s += FK.C(f1(fs[0]), f1(fs[1]), 4.5, 'jt') + FK.T(fs[0] + 10, fs[1] - 8, 'f*', { c: 'it' });
      s += FK.C(410, 70, 2.4, 'doto') + FK.T(422, 74, 'N = 4', { a: 'start' })
        + FK.C(410, 96, 2, 'dotf') + FK.T(422, 100, 'N = 32', { a: 'start' })
        + FK.C(410, 122, 4.5, 'jt') + FK.T(422, 126, 'f* = Σ α_j h_j', { a: 'start' })
        + FK.T(410, 160, 'E‖f* − avg‖² ≤ B²/N', { a: 'start', c: 'em' });
      return FK.fig(560, 250, 'Maurey 보조정리: 무작위 꼭짓점의 평균', s,
        R`꼭짓점 $h_1,\dots,h_5$를 확률 $\alpha=(0.1,0.3,0.15,0.25,0.2)$로 $N$번 뽑아 평균한 점을 40번씩 찍었습니다. 평균은 모두 볼록 껍질(옅은 영역) 안에 있고 기댓값은 $f^*=\sum_j\alpha_jh_j$입니다. $N=4$(빈 점)보다 $N=32$(찬 점)가 $f^*$ 둘레에 훨씬 촘촘히 모입니다. 제곱 거리의 평균이 $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)$로 $N$에 반비례하기 때문입니다.`);
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
