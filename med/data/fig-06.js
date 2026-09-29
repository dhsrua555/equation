/* 06 베이지안 확률과 규제 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  const N = (m, s2) => (x) => Math.exp(-((x - m) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);
  // Beta(a, b) density for integer a, b ≥ 1
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const beta = (a, b) => (m) => (m < 0 || m > 1 ? 0 : (fact(a + b - 1) / (fact(a - 1) * fact(b - 1))) * m ** (a - 1) * (1 - m) ** (b - 1));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2.6.1 posterior of a coin after 0, 1, 3 heads (uniform prior) and after 7 heads in 10
    coinpost() {
      return G({ w: 560, h: 230, x: [0, 1], y: [0, 4.3], xl: 'μ (앞면 확률)', label: '동전의 사후분포', m: [14, 16, 22, 26], xt: [[0, '0'], [0.5, '0.5'], [0.8, '0.8'], [1, '1']], yt: [[1, '1'], [2, '2'], [4, '4']],
        c: [{ f: beta(1, 1), c: 'dm ds' }, { f: beta(2, 1), c: 'vl' }, { f: beta(4, 1), c: 'rx' }, { f: beta(8, 4), c: 'ld' }],
        extra: (X, Y) => legend(X(0.03), Y(4.05), [['dm ds', '사전 p(μ) = 1'], ['vl', '앞면 1번: 2μ'], ['rx', '앞면 3번: 4μ³ (평균 0.8)'], ['ld', '10번 중 앞면 7번: Beta(8, 4)']]) + FK.L(X(0.8), Y(0), X(0.8), Y(4.3), 'dm ds') + T(X(0.97), Y(4.1), 'MLE = 1', { a: 'end', s: 11, c: 'rl' }),
        cap: R`균등 사전분포에서 앞면만 3번 나오면 MLE는 1(앞으로 늘 앞면)이라는 극단적 결론을 내지만, 사후분포 $4\mu^3$은 여전히 넓고 평균이 $0.8$입니다. 10번 중 7번처럼 자료가 쌓이면 사후분포가 좁아지며 참값 근처로 모입니다.` });
    },
    // 2.6.2 MAP: the Gaussian prior pulls the estimate toward zero
    mapprior() {
      const s2 = 0.5, wML = 1.6, lv = 0.35; // likelihood in w ~ N(wML, lv) (one weight)
      const lik = N(wML, lv), pri = N(0, s2);
      const postVar = 1 / (1 / lv + 1 / s2), postMean = postVar * (wML / lv);
      const post = N(postMean, postVar);
      return G({ w: 560, h: 220, x: [-2.2, 3.4], y: [0, 1.0], xl: 'w', label: 'MAP 추정과 사전분포', m: [14, 16, 22, 26], xt: [[0, '0'], [postMean, 'w_MAP'], [wML, 'w_ML']], yt: [], vg: [postMean, wML],
        c: [{ f: pri, c: 'dm ds' }, { f: lik, c: 'rx' }, { f: post, c: 'ld' }],
        extra: (X, Y) => legend(X(-2.1), Y(0.93), [['dm ds', '사전 N(0, s²)'], ['rx', '가능도 (모양)'], ['ld', '사후 ∝ 가능도 × 사전']]),
        cap: R`가중치 하나만 볼 때: 가능도의 꼭대기가 $w_{\text{ML}}$이고, 평균 0인 가우시안 사전분포를 곱하면 사후분포의 꼭대기 $w_{\text{MAP}}$가 0 쪽으로 당겨집니다. 이 “0으로 당기기”가 $L_2$ 규제의 벌점 $\frac1{2s^2}w^2$이고, 사전분포가 좁을수록($s$ 작을수록) 더 세게 당깁니다.` });
    },
    // 2.6.3 Bayesian predictive distribution of polynomial regression: wider where data are scarce
    predictive() {
      const r = MF.rng(3), xs = [0.02, 0.08, 0.15, 0.22, 0.28, 0.72, 0.8, 0.88, 0.96], ts = xs.map((x) => MF.SIN(x) + 0.2 * MF.normal(r));
      const M = 9, alpha = 2e-5, beta = 11.1;
      const phi = (x) => Array.from({ length: M + 1 }, (_, j) => x ** j);
      const S0 = Array.from({ length: M + 1 }, (_, i) => Array.from({ length: M + 1 }, (_, j) => (i === j ? alpha : 0) + beta * xs.reduce((s, x) => s + phi(x)[i] * phi(x)[j], 0)));
      const S = MF.inv(S0);
      const b = Array.from({ length: M + 1 }, (_, i) => beta * xs.reduce((s, x, n) => s + phi(x)[i] * ts[n], 0));
      const mN = S.map((row) => row.reduce((s, v, j) => s + v * b[j], 0));
      const mean = (x) => phi(x).reduce((s, v, j) => s + v * mN[j], 0);
      const sd = (x) => { const p = phi(x); const q = S.map((row) => row.reduce((s, v, j) => s + v * p[j], 0)); return Math.sqrt(1 / beta + p.reduce((s, v, i) => s + v * q[i], 0)); };
      const band = (X, Y) => { let up = '', dn = ''; for (let k = 0; k <= 200; k++) { const x = k / 200; up += `${k ? 'L' : 'M'}${FK.f1(X(x))},${FK.f1(Y(Math.min(2.3, mean(x) + sd(x))))}`; } for (let k = 200; k >= 0; k--) { const x = k / 200; dn += `L${FK.f1(X(x))},${FK.f1(Y(Math.max(-2.3, mean(x) - sd(x))))}`; } return FK.P(up + dn + 'Z', 'fl2'); };
      return G({ w: 560, h: 230, x: [0, 1], y: [-2.3, 2.3], xl: 'x', yl: 't', label: '베이지안 예측분포', m: [14, 16, 22, 26], xt: [[0, '0'], [0.5, '0.5'], [1, '1']], yt: [[1, '1'], [-1, '−1']],
        c: [{ f: MF.SIN, c: 'dm ds' }, { f: mean, c: 'ld' }],
        inner: (X, Y) => band(X, Y) + MF.dots(X, Y, xs.map((x, n) => [x, ts[n]]), true),
        cap: R`$M=9$ 다항식에 가우시안 사전분포를 두고 사후분포 전체로 예측분포 $p(t\mid x,\mathcal D)=\int p(t\mid x,\mathbf w)p(\mathbf w\mid\mathcal D)\,d\mathbf w$를 구했습니다. 곡선이 예측 평균, 칠한 띠가 평균 $\pm$ 표준편차입니다. 자료가 없는 가운데($0.3\lt x\lt0.7$)에서 띠가 넓어져 “모른다”는 것을 표현합니다. 점선은 참 규칙.` });
    },
  });
})();
