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
  });
})();
