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
    // 12.1 why a big learning rate bounces in a bowl and a decayed one settles (handwritten sketches next to slides 28–29)
    lrbowl() {
      const x0 = 1.7, e1 = 1.8, e2 = 0.9, sw = 6, TT = 14;
      const cst = [x0], dec = [x0];
      for (let t = 0; t < TT; t++) { cst.push(cst[t] * (1 - e1)); dec.push(dec[t] * (1 - (t < sw ? e1 : e2))); }
      const f = (x) => 0.5 * x * x;
      const pa = cst.slice(0, 8).map((x) => [x, f(x)]);
      return FK.G2(560, 240, '큰 학습률과 학습률 감소', [
        { w: 280, h: 240, x: [-2.1, 2.1], y: [0, 2.3], xl: 'x', yl: 'f', xt: [[-2, '−2'], [0, '0'], [2, '2']], yt: [], m: [24, 10, 22, 22], title: '(a) 큰 학습률로 그릇 오가기',
          c: [{ f, c: 'ld' }, { pts: pa, c: 'rx' }], extra: (X, Y) => pa.map(([x, y]) => FK.dot(X, Y, x, y)).join('') + FK.T(X(0) + 8, Y(2.1), 'η = 1.8/β:', { s: 11, a: 'start' }) + FK.T(X(0) + 8, Y(1.85), '벽에서 벽으로', { s: 11, a: 'start' }) },
        { w: 280, h: 240, ox: 280, x: [0, TT], y: [-1.9, 1.9], xl: 't', yl: 'x_t', xt: [[0, '0'], [sw, String(sw)], [10, '10']], yt: [[-1, '−1'], [1, '1']], vg: [sw], m: [24, 10, 22, 30], title: '(b) 걸음마다의 위치',
          c: [{ pts: cst.map((x, t) => [t, x]), c: 'rx' }, { pts: dec.map((x, t) => [t, x]), c: 'ld' }],
          extra: (X, Y) => cst.map((x, t) => FK.dot(X, Y, t, x, true)).join('') + dec.map((x, t) => FK.dot(X, Y, t, x)).join('') + FK.T(X(sw) + 4, Y(-1.55), '여기서 학습률 줄임', { a: 'start', s: 11 })
            + FK.T(X(9.5), Y(1.45), '계속 큰 학습률', { a: 'start', s: 11, c: 'rl' }) + FK.T(X(7.2), Y(0.5), '학습률 감소', { a: 'start', s: 11, c: 'lb' }) },
      ], R`$f(x)=\frac\beta2x^2$ ($\beta=1$), $x_0=1.7$에서 GD $x_{t+1}=(1-\eta\beta)x_t$ (예시로 정한 값). (a) $\eta=1.8/\beta$(임계값 $2/\beta$에 가까움)이면 매 걸음 그릇의 반대편 벽으로 건너뛰며 $|1-\eta\beta|=0.8$배씩 천천히만 줄어듭니다. (b) 그대로 두면(속이 빈 점) 계속 진동하고, 6걸음 뒤 $\eta=0.9/\beta$로 줄이면(찬 점) 배율이 $0.1$이 되어 바닥으로 내려앉습니다. 슬라이드 28–29 옆 필기의 그림입니다.`);
    },
    // 12.2 training loss under step decay and cosine annealing (slides 29–30); the curves are illustrative
    lrloss() {
      const h = (t) => { const v = Math.sin(t * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); };
      const stepBase = (t) => (t < 30 ? 2.2 + 1.8 * Math.exp(-t / 2.5) : t < 60 ? 1.4 + 0.8 * Math.exp(-(t - 30) / 2) : 1.05 + 0.35 * Math.exp(-(t - 60) / 2));
      const stepAmp = (t) => (t < 30 ? 0.22 : t < 60 ? 0.12 : 0.06);
      const cosBase = (t) => 0.6 * Math.exp(-t / 7) + 0.4 * 0.5 * (1 + Math.cos((Math.PI * t) / 300));
      const jag = (b, a, T, n) => Array.from({ length: n + 1 }, (_, k) => { const t = (T * k) / n; return [t, Math.max(0, b(t) + a(t) * (2 * h(k) - 1))]; });
      const base = { w: 280, h: 240, m: [24, 10, 24, 34], xl: '에폭' };
      return FK.G2(560, 240, '학습률 감소와 학습 손실', [
        Object.assign({}, base, { x: [0, 100], y: [0.6, 4.2], yl: '손실', xt: [[0, '0'], [30, '30'], [60, '60'], [100, '100']], yt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], vg: [30, 60, 90], title: '(a) 계단 감소',
          c: [{ pts: jag(stepBase, stepAmp, 100, 200), c: 'dm' }, { pts: Array.from({ length: 201 }, (_, k) => [k / 2, stepBase(k / 2)]), c: 'ld' }],
          extra: (X, Y) => [30, 60, 90].map((t) => FK.T(X(t) + 3, Y(3.9), '×0.1', { a: 'start', s: 10 })).join('') }),
        Object.assign({}, base, { ox: 280, x: [0, 300], y: [0, 1.05], yl: '손실', xt: [[0, '0'], [100, '100'], [200, '200'], [300, '300']], yt: [[0.5, '0.5'], [1, '1']], title: '(b) 코사인 감소',
          c: [{ pts: jag(cosBase, (t) => 0.1 * (cosBase(t) + 0.05), 300, 300), c: 'dm' }, { pts: Array.from({ length: 301 }, (_, t) => [t, cosBase(t)]), c: 'ld' }] }),
      ], R`슬라이드 29–30의 학습 손실 곡선을 다시 그린 것입니다(모양만 나타낸 예시이며, 들쭉날쭉한 선은 미니배치 잡음, 굵은 선은 그 평균). (a) 에폭 30, 60, 90에서 학습률에 $\times0.1$을 하면 손실이 계단처럼 뚝 떨어지고, 학습률이 작아질수록 잡음의 폭도 줄어듭니다. (b) 코사인 스케줄은 학습률이 $0$에 가까워지는 끝에서 손실이 부드럽게 $0$ 근처로 내려가며 잡음도 사라집니다.`);
    },
    // 12.3–12.5 where BN sits, what it does in training and at test time, and how it is fused (slides 40–42)
    bnstack() {
      const box = (x, y, w, h, l1, l2, c = 'bm') => FK.R(x, y, w, h, c) + FK.T(x + w / 2, y + (l2 ? 18 : h / 2 + 4), l1, { s: 11 }) + (l2 ? FK.T(x + w / 2, y + 34, l2, { s: 11 }) : '');
      const ar = (x1, y1, x2, y2, c = 'ax') => FK.A(x1, y1, x2, y2, c, 7);
      let body = FK.T(74, 14, '(a) 층 쌓기', { c: 'em' });
      [['FC', 'bm'], ['BN', 'bm2'], ['tanh', 'bm'], ['FC', 'bm'], ['BN', 'bm2'], ['tanh', 'bm']].forEach(([l, c], i) => { body += FK.R(24, 26 + i * 40, 100, 26, c) + FK.T(74, 44 + i * 40, l, { c: c === 'bm2' ? 'em' : '' }) + (i ? ar(74, 52 + (i - 1) * 40, 74, 26 + i * 40) : ''); });
      body += FK.T(74, 270, '⋮') + FK.T(74, 292, '완전연결·합성곱 층 뒤,', { s: 11 }) + FK.T(74, 307, '비선형 앞에 넣음', { s: 11 });
      body += FK.T(172, 20, '(b) 학습 시: 배치 통계량', { a: 'start', c: 'em' })
        + box(172, 32, 92, 46, 'x: N×D', '미니배치') + box(284, 32, 116, 46, '열마다 평균·분산', 'μ_B, σ_B') + box(420, 32, 132, 46, '정규화한 뒤', 'y = γ·x̂ + β', 'bm2')
        + ar(264, 55, 282, 55) + ar(400, 55, 418, 55) + box(278, 108, 128, 40, '이동평균 갱신', '(모멘텀 m)') + ar(342, 78, 342, 106)
        + FK.T(172, 194, '(c) 테스트 시: 저장된 통계량', { a: 'start', c: 'em' })
        + box(172, 206, 92, 46, 'x: 표본 하나도', '가능 (N = 1)') + box(284, 206, 116, 46, '이동평균 μ_run', 'σ_run (상수)') + box(420, 206, 132, 46, 'y = a·x + b', '(특성별 선형)', 'bm2')
        + ar(264, 229, 282, 229) + ar(400, 229, 418, 229) + ar(342, 148, 342, 204, 'rx') + FK.T(350, 174, '저장', { a: 'start', s: 11 })
        + ar(486, 252, 486, 280) + box(420, 282, 132, 42, '앞의 FC에 합침', "W′ = diag(a)W");
      return FK.fig(570, 330, '배치 정규화의 위치와 학습·테스트 동작', body,
        R`슬라이드 40–42의 내용을 한 그림에 모았습니다. (a) BN은 보통 FC나 합성곱 층 뒤, 비선형 앞에 들어갑니다. (b) 학습 때는 미니배치의 특성별 평균·분산 $\mu_B,\sigma_B$로 정규화하고 $\gamma,\beta$로 되돌린 뒤, 같은 통계량으로 이동평균을 갱신해 둡니다. (c) 테스트 때는 배치가 작거나 1개일 수 있으므로 저장해 둔 이동평균을 **상수**로 써서, $a_j=\gamma_j/\sqrt{\sigma_j^2+\varepsilon}$, $b_j=\beta_j-a_j\mu_j$인 특성별 선형 연산 $y=a\,x+b$가 됩니다. 이 선형 연산은 앞의 FC 층 $Wx+b_0$에 합쳐 $W'=\mathrm{diag}(a)W$, $b'=\mathrm{diag}(a)b_0+b$로 만들 수 있어 테스트 때 추가 비용이 없습니다.`);
    },
  });
})();
