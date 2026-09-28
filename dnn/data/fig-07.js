/* 07 서포트 벡터 머신 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, dot } = FK;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 7.6 the Problem Set 1 data set (plus a point that is not a support vector)
    svm2pt() {
      // plot area 404 × 236 px for 6.75 × 3.94 units → equal scale
      return G({ w: 440, h: 270, x: [-1.25, 5.5], y: [-1.0, 2.94], xl: 'x₁', yl: 'x₂', label: 'Problem Set의 두 점 SVM', xt: [[2, '2'], [4, '4']], yt: [[2, '2']], m: [12, 12, 22, 24],
        c: [{ f: (x) => 2 - x, c: 'ld' }, { f: (x) => -x, c: 'dm ds' }, { f: (x) => 4 - x, c: 'dm ds' }, { pts: [[0, 0], [1, 1]], c: 'rx' }],
        extra: (X, Y) => dot(X, Y, 0, 0, true) + dot(X, Y, 2, 2) + dot(X, Y, 4, 1)
          + FK.T(X(0) - 6, Y(0) + 15, 'x₁ (y = −1)', { a: 'end', c: 'em' }) + FK.T(X(2) + 7, Y(2) - 6, 'x₂ (y = +1)', { a: 'start', c: 'em' }) + FK.T(X(4), Y(1) + 18, 'x₃ (+1, α₃ = 0)', { c: 'rl' })
          + FK.T(X(2.75), Y(-0.72), 'H₀: x₁ + x₂ = 2', { a: 'start', c: 'lb' }) + FK.T(X(0.62), Y(0.35), '√2', { a: 'start', c: 'rl' }),
        cap: R`Problem Set 1 문제 3의 두 점 $x_1=(0,0)$ (빈 원, $y=-1$), $x_2=(2,2)$ ($y=+1$). 최대 마진 초평면은 두 점을 잇는 선분의 수직이등분선 $x_1+x_2=2$ (실선)이고, 점선 $x_1+x_2=0$, $x_1+x_2=4$가 $H_-$, $H_+$입니다. 짧은 선분이 마진 $\sqrt2$. 셋째 점 $x_3=(4,1)$을 더해도 $H_+$ 바깥에 있어 $\alpha_3=0$이고 해가 변하지 않습니다.` });
    },
  });
})();
