/* 12 학습률 스케줄과 배치 정규화 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G2, legend } = FK;
  const T = 100;
  const step = (t) => (t < 30 ? 1 : t < 60 ? 0.1 : t < 90 ? 0.01 : 0.001);
  const cosS = (t) => 0.5 * (1 + Math.cos((Math.PI * t) / T));
  const lin = (t) => 1 - t / T;
  const invs = (t) => 1 / Math.sqrt(Math.max(t, 1));
  const warm = (t) => Math.min(t / 5, Math.sqrt(5 / Math.max(t, 1e-9)));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    lrsched() {
      const base = { w: 280, h: 220, x: [0, 100], y: [0, 1.08], xl: '에폭 t', xt: [[30, '30'], [60, '60'], [90, '90']], yt: [[0.5, '0.5 α₀'], [1, 'α₀']], m: [22, 8, 20, 40] };
      return G2(560, 220, '학습률 스케줄', [
        Object.assign({}, base, { title: '(a) 계단, 코사인, 선형', c: [{ pts: Array.from({ length: 401 }, (_, k) => [k / 4, step(k / 4)]), c: 'vl' }, { f: cosS, c: 'ld' }, { f: lin, c: 'rx ds' }],
          extra: (X, Y) => legend(X(40), Y(0.98), [['vl', '계단 (×0.1)'], ['ld', '코사인'], ['rx ds', '선형']]) }),
        Object.assign({}, base, { ox: 280, title: '(b) 역제곱근, 워밍업', c: [{ f: invs, a: 1, c: 'ld' }, { f: warm, c: 'rx' }],
          extra: (X, Y) => legend(X(40), Y(0.98), [['ld', 'α₀/√t'], ['rx', '워밍업 5 + 역제곱근']]) }),
      ], R`(a) 계단은 정해진 에폭(30, 60, 90)에서 10분의 1로 뚝 떨어뜨리고, 코사인은 처음과 끝에서 천천히, 가운데에서 빠르게 줄여 $T$에서 0이 되며, 선형은 일정한 속도로 줄입니다. (b) 역제곱근은 초반에 급히 줄고 이후 천천히 줄어듭니다. 워밍업은 처음 몇 에폭 동안 0에서 $\alpha_0$까지 선형으로 올린 뒤 줄여, 초반의 큰 학습률로 손실이 폭발하는 것을 막습니다.`);
    },
    // 12.1 loss versus epoch for four learning rates (W4 Mon(2) slides 27–28); the curves are illustrative
    lrcurves() {
      return FK.G({ w: 560, h: 250, x: [0, 10], y: [0, 1.25], m: [14, 96, 26, 40], label: '학습률에 따른 학습 곡선',
        xl: '에폭', yl: '손실', xt: [[0, '0'], [5, '5'], [10, '10']], yt: [],
        c: [
          { f: (x) => 0.9 * Math.exp(0.32 * x), c: 'rx' },
          { f: (x) => 0.9 * Math.exp(-0.07 * x), c: 'vl ds' },
          { f: (x) => 0.55 + 0.35 * Math.exp(-1.3 * x), c: 'vl' },
          { f: (x) => 0.12 + 0.78 * Math.exp(-0.42 * x), c: 'ld' },
        ],
        t: [[1.05, 1.17, '(a) 매우 높음', { a: 'start', c: 'rl' }], [10.15, 0.43, '(b) 낮음', { a: 'start' }],
          [10.15, 0.57, '(c) 높음', { a: 'start' }], [10.15, 0.13, '(d) 좋음', { a: 'start', c: 'lb' }]],
        cap: R`슬라이드 27의 네 곡선을 다시 그린 것입니다(모양만 나타낸 예시). (a) 너무 크면 손실이 폭발하고, (b) 너무 작으면 꾸준하지만 느리게 내려가며, (c) 크면 처음에 빨리 떨어지다가 높은 값에서 멈추고, (d) 알맞으면 빠르고 낮게 내려갑니다. 학습률은 b < d < c < a 순입니다.` });
    },
  });
})();
