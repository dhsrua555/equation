/* 04 확률밀도와 가우시안 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  const N = (m, s2) => (x) => Math.exp(-((x - m) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2.2 density, a small interval and the cumulative distribution (Bishop Fig. 2.6)
    pdfcdf() {
      const p = (x) => 0.55 * N(2.2, 0.55)(x) + 0.45 * N(5.2, 0.35)(x);
      const P = (z) => { let s = 0; const n = 400, a = -1; for (let k = 0; k < n; k++) s += p(a + ((z - a) * (k + 0.5)) / n); return (s * (z - a)) / n; };
      return G({ w: 560, h: 230, x: [0, 7.5], y: [0, 1.05], xl: 'x', label: '확률밀도와 누적분포', m: [14, 16, 22, 30], xt: [[1.75, 'δx']], yt: [[0.5, '0.5'], [1, '1']],
        c: [{ f: p, c: 'rx' }, { f: P, c: 'ld', n: 160 }],
        inner: (X, Y) => { let d = `M${X(1.6)},${Y(0)}`; for (let k = 0; k <= 10; k++) { const x = 1.6 + 0.03 * k; d += `L${FK.f1(X(x))},${FK.f1(Y(p(x)))}`; } return FK.P(d + `L${X(1.9)},${Y(0)}Z`, 'fl2'); },
        extra: (X, Y) => T(X(5.2), Y(p(5.2)) - 8, 'p(x)', { c: 'rl' }) + T(X(6.8), Y(0.96), 'P(x)', { c: 'lb' }),
        cap: R`밀도 $p(x)$(봉우리 두 개)와 누적분포 $P(x)=\int_{-\infty}^xp(u)\,du$(0에서 1로 올라가는 곡선). 칠한 띠의 넓이 $\simeq p(x)\,\delta x$가 $x$가 $(x,x+\delta x)$에 들어갈 확률입니다. $P$의 기울기가 $p$이므로 $P'(x)=p(x)$입니다.` });
    },
    // 2.2.1 uniform, exponential and Laplace densities
    commonpdfs() {
      const U = (x) => (x >= -1 && x <= 1 ? 0.5 : 0), E = (x) => (x >= 0 ? Math.exp(-x) : 0), L = (x) => 0.5 * Math.exp(-Math.abs(x - 1));
      return G({ w: 560, h: 220, x: [-2, 4], y: [0, 1.08], xl: 'x', yl: 'p(x)', label: '대표적인 확률밀도', m: [14, 16, 22, 30], xt: [-2, -1, 0, 1, 2, 3, 4].map((v) => [v, String(v)]), yt: [[0.5, '0.5'], [1, '1']],
        c: [{ f: U, c: 'rx', n: 1200 }, { f: E, c: 'ld', n: 1200 }, { f: L, c: 'vl ds' }],
        extra: (X, Y) => legend(X(1.9), Y(0.98), [['rx', '균등 [−1, 1]'], ['ld', '지수 λ = 1'], ['vl ds', '라플라스 μ = 1, γ = 1']]),
        cap: R`균등분포는 구간에서 일정한 밀도 $1/(d-c)$, 지수분포는 $x\ge0$에서 $\lambda e^{-\lambda x}$로 감소, 라플라스분포는 $\mu$를 중심으로 양쪽이 지수적으로 감소하는 뾰족한 모양 $\frac1{2\gamma}e^{-\lvert x-\mu\rvert/\gamma}$입니다. 세 곡선 모두 아래 넓이가 1입니다.` });
    },
    // 2.3 the Gaussian and its width
    gaussfig() {
      const s = 0.8, g = N(0, s * s);
      return G({ w: 560, h: 210, x: [-3.4, 3.4], y: [0, 0.56], xl: 'x', label: '가우시안 분포', m: [14, 16, 22, 30], xt: [[-s, 'μ − σ'], [0, 'μ'], [s, 'μ + σ']], yt: [],
        c: [{ f: g, c: 'rx' }],
        inner: (X, Y) => { let d = `M${X(-s)},${Y(0)}`; for (let k = 0; k <= 40; k++) { const x = -s + (2 * s * k) / 40; d += `L${FK.f1(X(x))},${FK.f1(Y(g(x)))}`; } return FK.P(d + `L${X(s)},${Y(0)}Z`, 'fl'); },
        extra: (X, Y) => FK.A2(X(-s), Y(g(s)), X(s), Y(g(s)), 'dm', 6) + T(X(0), Y(g(s)) - 6, '2σ') + T(X(1.9), Y(0.4), 'N(x | μ, σ²)', { c: 'rl' }) + T(X(0), Y(0.12), '약 68%', { s: 11 }),
        cap: R`$\N(x\mid\mu,\sigma^2)=\frac1{(2\pi\sigma^2)^{1/2}}\exp\{-\frac{(x-\mu)^2}{2\sigma^2}\}$. 평균이자 최빈값인 $\mu$에서 가장 높고, 폭은 대략 $2\sigma$입니다. $\mu\pm\sigma$ 사이(칠한 부분)에 확률의 약 68%가 있습니다.` });
    },
    // 2.3.1 likelihood of i.i.d. data (Bishop Fig. 2.9)
    likelihood() {
      const xs = [-1.4, -0.7, -0.35, 0.1, 0.45, 0.9, 1.6], g = N(0.1, 0.7);
      return G({ w: 560, h: 210, x: [-2.6, 2.6], y: [0, 0.55], xl: 'x', yl: 'p(x)', label: '가능도', m: [14, 16, 22, 30], xt: [], yt: [],
        c: [{ f: g, c: 'rx' }],
        inner: (X, Y) => xs.map((x) => FK.L(X(x), Y(0), X(x), Y(g(x)), 'ld') + FK.dot(X, Y, x, g(x)) + FK.dot(X, Y, x, 0, true)).join(''),
        extra: (X, Y) => T(X(1.2), Y(0.43), 'N(x | μ, σ²)', { c: 'rl' }) + T(X(xs[5]), Y(0) + 16, 'xₙ', { s: 11 }),
        cap: R`자료점 $x_n$(가로축의 빈 점)마다 가우시안의 높이 $\N(x_n\mid\mu,\sigma^2)$(세로 선분)를 구해 **모두 곱한** 것이 가능도 $p(\mathbf x\mid\mu,\sigma^2)=\prod_n\N(x_n\mid\mu,\sigma^2)$입니다. 곡선을 옮기거나 폭을 바꿔 선분들의 곱이 가장 커지게 하는 것이 최대가능도입니다.` });
    },
    // 2.3.3 bias of the maximum-likelihood variance (Bishop Fig. 2.10)
    mlbias() {
      const r = MF.rng(31), truth = N(0, 1);
      const ps = [0, 1, 2].map((i) => {
        const a = MF.normal(r), b = MF.normal(r), m = (a + b) / 2, v = ((a - m) ** 2 + (b - m) ** 2) / 2;
        return { w: 186, h: 170, ox: i * 186, x: [-3, 3], y: [0, 1.4], m: [14, 8, 20, 10], xt: [[0, 'μ']], yt: [], vg: [0], axes: true, noY: true,
          c: [{ f: truth, c: 'rx' }, { f: N(m, Math.max(v, 0.08)), c: 'ld' }],
          inner: (X, Y) => MF.dots(X, Y, [[a, 0.02], [b, 0.02]]) };
      });
      return G2(558, 170, '최대가능도 분산의 편향', ps,
        R`넓은 곡선이 참 가우시안, 좁은 곡선은 점 두 개(아래의 점)로 최대가능도를 맞춘 가우시안입니다. 평균은 참값 주위에 흩어져 평균적으로 맞지만, 분산은 **자료에 맞춘 평균**을 기준으로 재기 때문에 체계적으로 작습니다: $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$ ($N=2$이면 절반).`);
    },
    // 2.2.2 covariance: sign of the joint spread
    covfig() {
      const r = MF.rng(17);
      const mk = (rho) => Array.from({ length: 70 }, () => { const u = MF.normal(r), v = MF.normal(r); return [u, rho * u + Math.sqrt(1 - rho * rho) * v]; });
      const p = (rho, title, ox) => ({ w: 186, h: 186, ox, x: [-3, 3], y: [-3, 3], title, m: [22, 8, 12, 8], xt: [], yt: [], inner: (X, Y) => MF.dots(X, Y, mk(rho), true) });
      return G2(558, 186, '공분산의 부호', [p(0.85, 'Cov > 0', 0), p(0, 'Cov ≈ 0', 186), p(-0.85, 'Cov < 0', 372)],
        R`$\Cov[x,y]=\E[(x-\E x)(y-\E y)]$. 평균보다 큰 $x$에 평균보다 큰 $y$가 함께 나오면 곱이 양수라 공분산이 양수(왼쪽), 반대로 움직이면 음수(오른쪽), 관계가 없으면 0 근처(가운데)입니다. 공분산이 0이어도 독립이 아닐 수 있습니다(예: $y=x^2$).`);
    },
  });
})();
