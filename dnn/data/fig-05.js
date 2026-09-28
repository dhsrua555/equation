/* 05 로지스틱 회귀 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  const sg = (z) => 1 / (1 + Math.exp(-z));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 5.1 sigmoid and its derivative
    sigmoid() {
      return G({ w: 560, h: 220, x: [-6, 6], y: [-0.05, 1.08], xl: 'z', label: '시그모이드와 그 도함수', xt: [[-4, '−4'], [-2, '−2'], [0, '0'], [2, '2'], [4, '4']], yt: [[0.25, '1/4'], [0.5, '1/2'], [1, '1']], hg: [0.5, 1], m: [10, 14, 22, 34],
        c: [{ f: sg, c: 'ld' }, { f: (z) => sg(z) * (1 - sg(z)), c: 'rx' }],
        extra: (X, Y) => legend(X(-5.6), Y(0.95), [['ld', 'σ(z) = 1/(1+e⁻ᶻ)'], ['rx', 'σ′(z) = σ(z)(1−σ(z))']]) + dot(X, Y, 0, 0.5) + dot(X, Y, 0, 0.25),
        cap: R`$\sigma$는 실수 전체를 $(0,1)$로 보내는 S자 곡선이고 $z=0$에서 $\tfrac12$을 지납니다. 도함수는 $z=0$에서 최대 $\tfrac14$이고, $\lvert z\rvert$가 커지면 0에 가까워집니다(**포화**). 이 사실이 10단원의 기울기 소실 문제의 뿌리입니다.` });
    },
    // 5.2 decision boundary and parallel probability contours
    logcontour() {
      const w = [-4, 1.2, 0.9]; // w0 + w1 x1 + w2 x2
      const lineAt = (c) => { const t = Math.log(c / (1 - c)); return (x1) => (t - w[0] - w[1] * x1) / w[2]; };
      const P = [[0.4, 0.6, 0], [0.9, 1.2, 0], [1.3, 0.3, 0], [0.5, 1.8, 0], [1.8, 1.0, 0], [0.2, 2.6, 0], [1.1, 2.0, 0], [2.2, 0.4, 0],
        [2.6, 1.9, 1], [3.1, 1.2, 1], [2.0, 2.8, 1], [3.4, 2.4, 1], [2.8, 3.1, 1], [3.6, 0.7, 1], [1.6, 3.4, 1], [3.2, 3.3, 1]];
      return G({ w: 560, h: 260, x: [0, 4], y: [0, 3.6], xl: 'x₁', yl: 'x₂', label: '결정 경계와 확률 등고선', xt: [[1, '1'], [2, '2'], [3, '3']], yt: [[1, '1'], [2, '2'], [3, '3']], m: [10, 14, 22, 24],
        c: [{ f: lineAt(0.334), c: 'dm ds' }, { f: lineAt(0.5), c: 'ld' }, { f: lineAt(0.666), c: 'dm ds' }],
        extra: (X, Y) => P.map(([a, b, cl]) => dot(X, Y, a, b, cl === 0)).join('')
          + [[0.334, "rl"], [0.5, "lb"], [0.666, "rl"]].map(([c, k]) => { const t = Math.log(c / (1 - c)), y0 = 0.14, x0 = (t - w[0] - w[2] * y0) / w[1]; return FK.T(X(x0) + 5, Y(y0), String(c), { a: "start", c: k }); }).join(""),
        cap: R`$P(y=1\mid x)=\sigma(w_0+w_1x_1+w_2x_2)$이 같은 점들은 $w^Tx=\text{상수}$인 직선이라 모두 결정 경계($p=0.5$, 실선)와 평행합니다. 채운 점은 레이블 1, 빈 점은 0. 결정 경계에서 멀어질수록 확률이 0 또는 1에 가까워집니다.` });
    },
    // 5.3 per-sample loss as a function of the score z = wᵀx
    bceloss() {
      return G({ w: 560, h: 220, x: [-4, 4], y: [0, 4.3], xl: 'z = wᵀx', yl: '손실', label: '이진 교차 엔트로피 손실', xt: [[-2, '−2'], [0, '0'], [2, '2']], yt: [[1, '1'], [2, '2'], [3, '3']], m: [10, 14, 22, 30],
        c: [{ f: (z) => Math.log(1 + Math.exp(-z)), c: 'ld' }, { f: (z) => Math.log(1 + Math.exp(z)), c: 'rx' }, { f: (z) => (1 - sg(z)) * (1 - sg(z)) * 4, c: 'dm ds' }],
        extra: (X, Y) => legend(X(-1.2), Y(4.05), [['ld', 'y = 1:  log(1 + e⁻ᶻ)'], ['rx', 'y = 0:  log(1 + eᶻ)'], ['dm ds', '비교: 4(1 − σ(z))² (y = 1)']]),
        cap: R`정답이 1인데 점수 $z$가 크게 음수이면(자신 있게 틀림) 교차 엔트로피 손실은 직선처럼 계속 커져 강한 기울기를 줍니다. 제곱오차 $(1-\sigma(z))^2$은 같은 상황에서 평평해져(기울기 $\approx0$) 학습이 멈추고, $z$에 대해 볼록도 아닙니다.` });
    },
  });
})();
