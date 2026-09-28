/* 03 정보이론 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  const kl = (p, q) => p.reduce((s, pi, i) => (pi > 0 ? s + pi * Math.log(pi / q[i]) : s), 0);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 3.1 binary entropy in bits
    binent() {
      const h = (p) => (p <= 0 || p >= 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)));
      return G({ w: 560, h: 210, x: [0, 1], y: [0, 1.15], xl: 'p = P(X=1)', yl: 'H (비트)', label: '베르누이 분포의 엔트로피', xt: [[0.1, '0.1'], [0.5, '0.5'], [0.9, '0.9'], [1, '1']], yt: [[0.469, '0.469'], [1, '1']], hg: [0.469, 1], vg: [0.5], m: [10, 14, 22, 44],
        c: [{ f: h, c: 'ld' }], extra: (X, Y) => dot(X, Y, 0.9, 0.469) + dot(X, Y, 0.1, 0.469) + dot(X, Y, 0.5, 1),
        cap: R`$H(p)=-p\log_2p-(1-p)\log_2(1-p)$. 결과가 뻔한 동전($p=0$ 또는 $1$)은 엔트로피 0, 가장 예측하기 어려운 공정한 동전($p=\tfrac12$)이 최대 1비트입니다. $p=0.9$와 $p=0.1$은 대칭이라 같은 $0.469$비트.` });
    },
    // 3.3 Jensen's inequality for a convex function and a two-point distribution
    jensen() {
      const f = (x) => (x - 0.3) * (x - 0.3) * 0.9 + 0.2;
      const a = 0.6, b = 3.2, w = 0.35, m = w * a + (1 - w) * b;
      return G({ w: 560, h: 230, x: [0, 3.8], y: [0, 7.6], xl: 'x', label: '젠센 부등식', xt: [[a, 'a'], [m, 'E[X]'], [b, 'b']], m: [10, 14, 22, 20],
        c: [{ f, c: 'ld' }, { pts: [[a, f(a)], [b, f(b)]], c: 'rx' }, { pts: [[m, 0], [m, w * f(a) + (1 - w) * f(b)]], c: 'dm ds' }],
        extra: (X, Y) => dot(X, Y, a, f(a)) + dot(X, Y, b, f(b)) + dot(X, Y, m, f(m)) + dot(X, Y, m, w * f(a) + (1 - w) * f(b), true)
          + FK.T(X(m) - 6, Y(w * f(a) + (1 - w) * f(b)) - 6, 'E[φ(X)]', { a: 'end', c: 'rl' }) + FK.T(X(m) + 8, Y(f(m)) + 14, 'φ(E[X])', { a: 'start', c: 'lb' }),
        cap: R`$X$가 확률 $0.35$로 $a$, $0.65$로 $b$인 확률변수라 하면 $\E[\varphi(X)]$는 현(chord) 위의 점, $\varphi(\E X)$는 곡선 위의 점입니다. 볼록함수의 곡선은 현 아래에 있으므로 $\varphi(\E X)\le\E\varphi(X)$. 등호는 $X$가 한 값에 몰려 있거나 $\varphi$가 그 구간에서 직선일 때뿐입니다.` });
    },
    // 3.6 JS stays bounded while KL blows up
    jskl() {
      const js = (s) => { const p = [0.5, 0.5], q = [s, 1 - s], m = [(0.5 + s) / 2, (1.5 - s) / 2]; return 0.5 * kl(p, m) + 0.5 * kl(q, m); };
      const klf = (s) => (s <= 0 ? NaN : kl([0.5, 0.5], [s, 1 - s]));
      return G({ w: 560, h: 230, x: [0, 1], y: [0, 1.6], xl: 's', label: 'KL과 JS 발산의 비교', xt: [[0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']], yt: [[0.693, 'ln 2'], [1, '1']], hg: [0.693], m: [10, 14, 22, 40],
        c: [{ f: klf, a: 0.002, c: 'rx' }, { f: js, c: 'ld' }],
        extra: (X, Y) => legend(X(0.56), Y(1.45), [['rx', 'KL(p ‖ q)'], ['ld', 'JS(p ‖ q)']]),
        cap: R`$p=\operatorname{Bern}(\tfrac12)$, $q=\operatorname{Bern}(s)$. $s\to0$ 또는 $s\to1$이면 $q$가 $p$의 한 값을 거의 불가능하다고 보므로 $\KL(p\Vert q)\to\infty$입니다. JS는 두 분포의 평균 $m$과 비교하므로 항상 $\ln2$ 이하에 머뭅니다. 두 곡선 모두 $s=\tfrac12$ ($p=q$)에서만 0입니다.` });
    },
  });
})();
