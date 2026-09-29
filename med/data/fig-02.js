/* 02 곡선 적합 — 본문 그림 (자료는 고정 난수로 만든 t = sin 2πx + 잡음) */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  const D10 = MF.sinData(10, 55, 0.3), D15 = MF.sinData(15, 10, 0.3), D100 = MF.sinData(100, 28, 0.3);
  const TEST = MF.sinData(100, 77, 0.3, false);
  const fitCache = {};
  const fit = (D, M, lam = 0, key) => (fitCache[key] = fitCache[key] || MF.polyfit(D.xs, D.ts, M, lam));
  const clip = (f, a = 1.9) => (x) => { const v = f(x); return Math.abs(v) > a ? NaN : v; };
  const panel = (D, f, title, o = {}) => Object.assign({
    w: 280, h: 190, x: [-0.03, 1.03], y: [-1.6, 1.6], m: [20, 8, 18, 22], title, xt: [[0, '0'], [1, '1']], yt: [[1, '1'], [-1, '−1']],
    c: [{ f: MF.SIN, c: 'ld' }, { f: clip(f), c: 'rx', n: 600 }],
    inner: (X, Y) => MF.dots(X, Y, D.xs.map((x, n) => [x, D.ts[n]]), true),
  }, o);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 1.2.1 the tutorial data
    sindata() {
      return G({ w: 560, h: 210, x: [-0.03, 1.03], y: [-1.6, 1.6], xl: 'x', yl: 't', label: '튜토리얼 자료', m: [14, 16, 20, 30], xt: [[0, '0'], [0.5, '0.5'], [1, '1']], yt: [[1, '1'], [-1, '−1']],
        c: [{ f: MF.SIN, c: 'ld' }], inner: (X, Y) => MF.dots(X, Y, D10.xs.map((x, n) => [x, D10.ts[n]]), true),
        extra: (X, Y) => T(X(0.24), Y(1.25), '참 규칙 sin(2πx)', { c: 'lb' }) + T(X(0.8), Y(1.1), '관측 (xₙ, tₙ)', { c: 'rl' }),
        cap: R`입력 $x_1,\dots,x_N$ ($N=10$)을 $[0,1]$에 고르게 잡고, 목표값은 숨은 규칙 $\sin(2\pi x)$(곡선)에 가우시안 잡음(표준편차 0.3)을 더해 만듭니다. 학습자는 빈 점만 보고 곡선을 추론해야 합니다.` });
    },
    // 1.2.3 sum-of-squares error: vertical residuals
    sseres() {
      const F = fit(D10, 3, 0, 'm3');
      return G({ w: 560, h: 210, x: [-0.03, 1.03], y: [-1.6, 1.6], xl: 'x', yl: 't', label: '제곱오차합', m: [14, 16, 20, 30], xt: [[0, '0'], [1, '1']], yt: [],
        c: [{ f: F.f, c: 'rx' }],
        inner: (X, Y) => D10.xs.map((x, n) => FK.L(X(x), Y(D10.ts[n]), X(x), Y(F.f(x)), 'ld')).join('') + MF.dots(X, Y, D10.xs.map((x, n) => [x, D10.ts[n]]), true),
        extra: (X, Y) => T(X(0.93), Y(F.f(0.93)) - 10, 'y(x, w)', { c: 'rl' }),
        cap: R`세로 선분이 오차 $y(x_n,\mathbf w)-t_n$입니다. 제곱오차합 $E(\mathbf w)=\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2$은 이 길이들의 제곱을 더한 것의 절반이고, 모든 점을 정확히 지날 때만 0입니다. 곡선은 $M=3$ 다항식의 최소제곱 해입니다.` });
    },
    // 1.2.4 fits of order 0, 1, 3, 9
    polyfits() {
      const ps = [0, 1, 3, 9].map((M, i) => panel(D10, fit(D10, M, 0, 'm' + M).f, `M = ${M}${M < 2 ? ' (과소적합)' : M === 3 ? ' (적당)' : ' (과적합)'}`, { ox: (i % 2) * 280, oy: Math.floor(i / 2) * 190 }));
      return G2(560, 380, '다항식 차수에 따른 적합', ps,
        R`곡선 하나는 참 규칙 $\sin(2\pi x)$, 다른 곡선이 최소제곱으로 맞춘 $M$차 다항식입니다. $M=0,1$은 굴곡을 따라가지 못하고, $M=3$은 규칙에 가깝고, $M=9$는 계수 10개로 점 10개를 정확히 지나지만 점 사이에서 크게 출렁입니다.`);
    },
    // 1.2.4 training and test RMS error against M
    ermsM() {
      const pts = (D) => [...Array(10).keys()].map((M) => [M, Math.min(1.15, MF.rms(fit(D10, M, 0, 'm' + M).f, D.xs, D.ts))]);
      const tr = pts(D10), te = pts(TEST);
      return G({ w: 560, h: 220, x: [-0.4, 9.4], y: [0, 1.2], xl: 'M', yl: 'E_RMS', label: '훈련 오차와 시험 오차', m: [14, 16, 22, 34], xt: [0, 3, 6, 9].map((v) => [v, String(v)]), yt: [[0.5, '0.5'], [1, '1']],
        c: [{ pts: tr, c: 'rx' }, { pts: te, c: 'ld' }],
        inner: (X, Y) => MF.dots(X, Y, tr) + MF.dots(X, Y, te, true),
        extra: (X, Y) => legend(X(5.6), Y(1.05), [['rx', '훈련 자료 (N = 10)'], ['ld', '시험 자료 (100개)']]),
        cap: R`$E_{\text{RMS}}=\sqrt{\frac1N\sum_n\{y(x_n,\mathbf w^\star)-t_n\}^2}$. 훈련 오차는 $M$이 커질수록 줄어 $M=9$에서 0이 되지만, 새 자료에 대한 시험 오차는 $3\le M\le8$에서 가장 작고 $M=9$에서 급증합니다(1.15 위는 잘라서 그림). 완벽한 훈련 정확도가 좋은 일반화를 보장하지 않습니다.` });
    },
    // 1.2.4 more data tames the M = 9 polynomial
    datasize() {
      return G2(560, 200, '자료 수와 과적합', [
        panel(D15, fit(D15, 9, 0, 'n15').f, 'N = 15, M = 9', { h: 200 }),
        panel(D100, fit(D100, 9, 0, 'n100').f, 'N = 100, M = 9', { h: 200, ox: 280, inner: (X, Y) => MF.dots(X, Y, D100.xs.map((x, n) => [x, D100.ts[n]]).filter((_, k) => k % 2 === 0), true) }),
      ], R`같은 $M=9$ 다항식이라도 점이 15개면 출렁이지만 100개(그림에는 절반만 표시)면 참 곡선에 거의 붙습니다. 자료가 많을수록 더 복잡한 모델을 써도 과적합이 줄어듭니다.`);
    },
    // 1.2.5 regularized M = 9 fits
    regfits() {
      return G2(560, 200, '규제한 M = 9 다항식', [
        panel(D10, fit(D10, 9, Math.exp(-18), 'l18').f, 'ln λ = −18', { h: 200 }),
        panel(D10, fit(D10, 9, 1, 'l0').f, 'ln λ = 0', { h: 200, ox: 280 }),
      ], R`벌점 $\frac\lambda2\lVert\mathbf w\rVert^2$을 더하면 같은 $M=9$라도 $\ln\lambda=-18$에서 출렁임이 사라지고, $\ln\lambda=0$에서는 계수가 너무 눌려 평평해집니다(과소적합). 규제가 없는 경우($\lambda=0$, $\ln\lambda=-\infty$)가 앞 그림의 $M=9$입니다.`);
    },
    // 1.2.5 RMS error against ln λ
    ermslam() {
      const L = Array.from({ length: 36 }, (_, k) => -35 + k);
      const tr = L.map((l) => [l, MF.rms(MF.polyfit(D10.xs, D10.ts, 9, Math.exp(l)).f, D10.xs, D10.ts)]);
      const te = L.map((l) => [l, Math.min(1.15, MF.rms(MF.polyfit(D10.xs, D10.ts, 9, Math.exp(l)).f, TEST.xs, TEST.ts))]);
      return G({ w: 560, h: 220, x: [-35.5, 0.5], y: [0, 1.2], xl: 'ln λ', yl: 'E_RMS', label: '규제 세기에 따른 오차', m: [14, 16, 22, 34], xt: [[-30, '−30'], [-20, '−20'], [-10, '−10'], [0, '0']], yt: [[0.5, '0.5'], [1, '1']],
        c: [{ pts: tr, c: 'rx' }, { pts: te, c: 'ld' }],
        extra: (X, Y) => legend(X(-33), Y(1.05), [['rx', '훈련'], ['ld', '시험']]),
        cap: R`$M=9$에서 $\lambda$를 키우면 훈련 오차는 계속 커지지만 시험 오차는 중간 값에서 가장 작습니다. $\lambda$가 너무 작으면 과적합, 너무 크면 과소적합입니다. $\lambda$도 이렇게 **검증 자료**로 골라야 하는 초매개변수입니다.` });
    },
    // 1.2.6 S-fold cross-validation (S = 4)
    cvfold() {
      let s = '';
      for (let r = 0; r < 4; r++) {
        for (let k = 0; k < 4; k++) s += FK.R(90 + k * 80, 24 + r * 40, 78, 28, k === r ? 'rxh' : 'bm') + FK.R(90 + k * 80, 24 + r * 40, 78, 28, 'sv');
        s += T(80, 43 + r * 40, `${r + 1}회`, { a: 'end' }) + T(420, 43 + r * 40, `학습 3묶음 → 평가 1묶음`, { a: 'start', s: 11 });
      }
      s += T(250, 190, '네 번의 평가 점수를 평균', { c: 'em' });
      return FK.fig(560, 200, '4겹 교차검증', s,
        R`자료를 크기가 같은 $S=4$묶음으로 나눠 $S-1$묶음으로 학습하고 칠한 묶음으로 평가하기를 네 번 반복합니다. 모든 자료가 학습과 평가에 쓰이지만 학습을 $S$번 해야 합니다. $S=N$이면 한 점씩 빼는 leave-one-out입니다.`);
    },
  });
})();
