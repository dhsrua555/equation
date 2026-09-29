/* 09 정규화(Normalization) — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  const N = (m, s2) => (x) => Math.exp(-((x - m) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 7.4.1 inputs before and after standardisation (slide 24)
    inputnorm() {
      const r = MF.rng(8);
      const raw = Array.from({ length: 24 }, () => [3 + 2.2 * MF.normal(r), 1.5 + 5 * MF.normal(r)]);
      const mu = [0, 1].map((k) => raw.reduce((s, p) => s + p[k], 0) / raw.length);
      const sd = [0, 1].map((k) => Math.sqrt(raw.reduce((s, p) => s + (p[k] - mu[k]) ** 2, 0) / raw.length));
      const z = raw.map((p) => [(p[0] - mu[0]) / sd[0], (p[1] - mu[1]) / sd[1]]);
      return G({ w: 560, h: 250, x: [-10, 10], y: [-10, 10], xl: 'x₁', yl: 'x₂', label: '입력 정규화', m: [12, 150, 20, 150], xt: [[-10, '−10'], [10, '10']], yt: [[-10, '−10'], [10, '10']],
        inner: (X, Y) => MF.dots(X, Y, raw, true) + z.map(([a, b]) => T(X(a), Y(b) + 4, '×', { c: 'lb' })).join(''),
        extra: (X, Y) => T(X(10) + 16, Y(8), '○ 정규화 전', { a: 'start', c: 'rl' }) + T(X(10) + 16, Y(8) + 18, '× 정규화 후', { a: 'start', c: 'lb' }),
        cap: R`두 입력의 평균과 퍼짐이 달라 정규화 전의 점들(빈 점)은 넓고 비스듬히 흩어져 있습니다. 입력마다 훈련 자료의 평균을 빼고 표준편차로 나누면($\tilde x_{ni}=(x_{ni}-\mu_i)/\sigma_i$) 원점 근처에 평균 0, 분산 1로 모입니다(×). 검증·시험 자료도 **같은** $\mu_i,\sigma_i$로 변환합니다.` });
    },
    // 7.4.1 why: scale of inputs sets the curvature of the error surface
    scalecurv() {
      const P = (a, b, t, ox) => ({ w: 280, h: 200, ox, x: [-1.6, 1.6], y: [-1.1, 1.1], title: t, m: [22, 8, 8, 8], xt: [], yt: [], axes: false,
        inner: (X, Y) => MF.ellipses([0, 0], a, b, 0, [0.03, 0.12, 0.27, 0.48, 0.75], 'dm')(X, Y) + FK.dot(X, Y, 0, 0) });
      return G2(560, 200, '입력 척도와 오차 곡면', [P(0.4, 40, '척도가 다른 입력: 곡률 비 100', 0), P(4, 4, '정규화한 입력: 곡률이 같음', 280)],
        R`선형 회귀의 제곱오차에서 헤시안은 $\sum_n\mathbf x_n\mathbf x_n^T$라 입력의 척도가 곧 곡률입니다(키 1.8 m와 혈소판 수 300,000/µL처럼 척도가 수십만 배 다르면 곡률 비는 그 제곱). 왼쪽처럼 가늘고 긴 골짜기에서는 경사하강법이 지그재그로 느리지만, 입력을 정규화하면 오른쪽처럼 둥글어져 기울기가 최소점을 곧바로 가리킵니다.`);
    },
    // 7.4.2 vanishing and exploding gradients: product of layer factors
    vanish() {
      const L = 30;
      return G({ w: 560, h: 220, x: [0, L], y: [-6, 6], xl: '층 수 K', yl: 'log₁₀ |∂E/∂w₁|', label: '기울기 소실과 폭발', m: [14, 16, 22, 40], xt: [0, 10, 20, 30].map((v) => [v, String(v)]), yt: [[-6, '10⁻⁶'], [-3, '10⁻³'], [0, '1'], [3, '10³'], [6, '10⁶']], hg: [0],
        c: [{ f: (k) => k * Math.log10(0.6), c: 'rx' }, { f: (k) => k * Math.log10(1.5), c: 'ld' }, { f: () => 0, c: 'vl ds' }],
        extra: (X, Y) => legend(X(12), Y(5.6), [['ld', '층마다 인수 1.5 → 폭발'], ['vl ds', '인수 1 → 유지'], ['rx', '층마다 인수 0.6 → 소실']]),
        cap: R`첫 층 가중치의 기울기는 층마다의 야코비안 원소 $\partial z^{(k)}/\partial z^{(k-1)}$의 곱입니다. 그 크기가 대부분 1보다 작으면(예: 0.6) 30층 뒤 $0.6^{30}\approx2\times10^{-7}$로 사라지고, 1보다 크면(1.5) $1.5^{30}\approx2\times10^5$로 폭발합니다. 배치 정규화는 층마다 활성화의 척도를 고정해 이 곱을 1 근처로 유지하도록 돕습니다.` });
    },
    // 7.4.2 batch normalization of one unit: raw, standardized, rescaled
    bnsteps() {
      const r = MF.rng(14), a = Array.from({ length: 16 }, () => 5 + 2.5 * MF.normal(r));
      const mu = a.reduce((s, v) => s + v, 0) / a.length, v = a.reduce((s, x) => s + (x - mu) ** 2, 0) / a.length;
      const h = a.map((x) => (x - mu) / Math.sqrt(v + 1e-5)), gam = 0.6, bet = 1.5, t = h.map((x) => gam * x + bet);
      const row = (vals, y) => (X, Y) => vals.map((x) => FK.dot(X, Y, x, y, true)).join('');
      return G({ w: 560, h: 210, x: [-4, 12], y: [0, 3.6], xl: '값', label: '배치 정규화의 두 단계', m: [12, 14, 20, 150], xt: [[-2, '−2'], [0, '0'], [2, '2'], [5, '5'], [10, '10']], yt: [], axes: true, noY: true, vg: [0],
        inner: (X, Y) => row(a, 3)(X, Y) + row(h, 2)(X, Y) + row(t, 1)(X, Y) + FK.L(X(mu), Y(3) - 12, X(mu), Y(3) + 12, 'rx') + FK.L(X(bet), Y(1) - 12, X(bet), Y(1) + 12, 'ld'),
        extra: (X, Y) => T(X(-4) - 8, Y(3) + 4, 'aₙᵢ (미니배치 16개)', { a: 'end', s: 11 }) + T(X(-4) - 8, Y(2) + 4, 'âₙᵢ: 평균 0, 분산 1', { a: 'end', s: 11 }) + T(X(-4) - 8, Y(1) + 4, 'γâ + β (0.6, 1.5)', { a: 'end', s: 11 }) + T(X(mu), Y(3) - 16, `μᵢ = ${mu.toFixed(2)}`, { c: 'rl', s: 11 }) + T(X(bet), Y(1) - 16, 'β', { c: 'lb', s: 11 }),
        cap: R`한 유닛의 사전활성 16개(맨 위)를 미니배치 평균 $\mu_i$와 표준편차로 표준화하면 가운데 줄처럼 0을 중심으로 폭 1로 모입니다. 마지막으로 학습 가능한 $\gamma_i$배 늘이고 $\beta_i$만큼 옮겨 층이 필요한 척도와 위치를 스스로 고르게 합니다.` });
    },
    // 7.4.2 running averages used at inference
    bnrunning() {
      const r = MF.rng(2), alpha = 0.9, T0 = 60;
      const batch = Array.from({ length: T0 }, () => 2 + 0.6 * MF.normal(r));
      const run = []; let m = 0; batch.forEach((b, t) => { m = alpha * m + (1 - alpha) * b; run.push([t + 1, m]); });
      return G({ w: 560, h: 210, x: [0, T0], y: [0, 4.2], xl: 'τ (미니배치)', label: '추론용 이동평균', m: [14, 16, 22, 30], xt: [[1, '1'], [20, '20'], [40, '40'], [60, '60']], yt: [[2, '2']], hg: [2],
        c: [{ pts: batch.map((b, t) => [t + 1, b]), c: 'dm' }, { pts: run, c: 'ld' }],
        inner: (X, Y) => MF.dots(X, Y, batch.map((b, t) => [t + 1, b]), true),
        extra: (X, Y) => legend(X(30), Y(0.9), [['dm', '미니배치 평균 μᵢ (빈 점)'], ['ld', '이동평균 μ̄ᵢ (α = 0.9)']]),
        cap: R`미니배치마다의 평균(빈 점)은 표본이 적어 흔들리지만, $\bar\mu_i^{(\tau)}=\alpha\bar\mu_i^{(\tau-1)}+(1-\alpha)\mu_i$는 전체 평균(점선) 근처로 매끄럽게 모입니다(0에서 시작하므로 처음 몇 단계는 작음). 학습이 끝나면 이 값을 고정해 예제 하나로도 같은 정규화를 합니다.` });
    },
  });
})();
