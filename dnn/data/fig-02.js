/* 02 확률, 가능도, 베이즈 추론 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  // log-gamma (Lanczos) for Beta densities
  const lg = (x) => {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
    let s = 1.000000000190015; c.forEach((v) => { y += 1; s += v / y; });
    return -t + Math.log((2.5066282746310005 * s) / x);
  };
  const beta = (a, b) => (t) => (t <= 0 || t >= 1 ? 0 : Math.exp((a - 1) * Math.log(t) + (b - 1) * Math.log(1 - t) - (lg(a) + lg(b) - lg(a + b))));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2.5–2.6 prior × likelihood → posterior for 7 heads in 10 tosses
    betapost() {
      const lik = (t) => (2.4 * Math.pow(t, 7) * Math.pow(1 - t, 3)) / (Math.pow(0.7, 7) * Math.pow(0.3, 3)); // height 2.4 at the MLE, shape only
      return G({ w: 560, h: 240, x: [0, 1], y: [0, 3.4], xl: 'θ', label: '사전분포, 가능도, 사후분포', xt: [[0.5, '0.5'], [0.667, '0.67'], [0.7, ''], [1, '1']], yt: [[1, '1'], [2, '2'], [3, '3']], vg: [0.5, 0.7], m: [10, 150, 22, 30],
        c: [{ f: beta(2, 2), c: 'dm' }, { f: lik, c: 'rx ds' }, { f: beta(9, 5), c: 'ld' }],
        extra: (X, Y) => legend(X(1) + 16, Y(3.1), [['dm', '사전 Beta(2,2)'], ['rx ds', '가능도 θ⁷(1−θ)³'], ['ld', '사후 Beta(9,5)']]) + FK.T(X(0.7) + 3, Y(3.25), 'MLE 0.7', { a: 'start', c: 'rl' }),
        cap: R`동전 10번 중 앞면 7번. 사전분포(“공정할 것 같다”, 0.5 근처가 높음)에 가능도를 곱해 정규화하면 사후분포 $\operatorname{Beta}(9,5)$가 됩니다. 사후분포의 꼭대기(MAP, $\approx0.667$)는 가능도의 꼭대기(MLE, $0.7$)보다 사전분포 쪽(0.5)으로 조금 당겨져 있습니다. (가능도 곡선은 모양만 보이려고 높이를 맞췄습니다.)` });
    },
    // 2.7 posteriors of the two sellers
    sellers() {
      return G({ w: 560, h: 230, x: [0.3, 1], y: [0, 14.5], xl: 'θ (좋은 리뷰를 받을 확률)', label: '두 판매자의 사후분포', xt: [[0.5, '0.5'], [0.75, '0.75'], [0.9, '0.9'], [1, '1']], yt: [[5, '5'], [10, '10']], m: [10, 14, 22, 30],
        c: [{ f: beta(91, 11), c: 'ld' }, { f: beta(3, 1), c: 'rx' }],
        extra: (X, Y) => legend(X(0.34), Y(13), [['ld', '판매자 1: Beta(91, 11) — 리뷰 100개'], ['rx', '판매자 2: Beta(3, 1) — 리뷰 2개']]),
        cap: R`리뷰가 100개인 판매자 1의 사후분포는 0.89 근처에 좁게 몰려 있고, 리뷰가 2개인 판매자 2의 사후분포 $3\theta^2$은 넓게 퍼져 있습니다. 판매자 2의 MLE는 1이지만, 실제로는 0.5 근처일 가능성도 꽤 큽니다. 둘을 비교하면 $P(\theta_1>\theta_2\mid D)\approx0.713$입니다.` });
    },
    // 2.8 MSE of the shrinkage (MAP) estimator vs the sample mean
    shrinkmse() {
      const n = 4, t2 = 0.5, a = (n * t2) / (n * t2 + 1);
      const mse = (th) => (1 - a) * (1 - a) * th * th + (a * a) / n;
      return G({ w: 560, h: 230, x: [-2.2, 2.2], y: [0, 0.75], xl: '참값 θ', yl: 'MSE', label: '수축 추정량과 표본평균의 MSE', xt: [[-1.118, '−1.12'], [0, '0'], [1.118, '1.12'], [2, '2']], yt: [[0.25, '1/n'], [0.111, '1/9']], vg: [-1.118, 1.118], m: [10, 14, 22, 36],
        c: [{ f: () => 1 / n, c: 'rx' }, { f: mse, c: 'ld' }],
        extra: (X, Y) => legend(X(-2.1), Y(0.7), [['ld', 'MAP (a = 2/3)'], ['rx', '표본평균 X̄ (MLE)']]),
        cap: R`$n=4$, $\tau^2=0.5$일 때. 표본평균의 MSE는 $\theta$와 무관하게 $1/n=0.25$. MAP $\hat\theta=a\bar X$ ($a=\tfrac23$)의 MSE는 편향² $(1-a)^2\theta^2$ + 분산 $a^2/n$이라 $\theta$에 대한 포물선입니다. 참값이 0 근처($\theta^2\lt2\tau^2+1/n=1.25$)이면 MAP이 이기고, 멀면 편향 때문에 집니다.` });
    },
  });
})();
