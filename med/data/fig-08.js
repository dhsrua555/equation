/* 08 경사하강법과 옵티마이저 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  // ill-conditioned quadratic E = ½(a w1² + b w2²)
  const quad = (a, b) => ({ E: (x, y) => 0.5 * (a * x * x + b * y * y), g: ([x, y]) => [a * x, b * y] });
  function run(step, w0, n) { const P = [w0.slice()]; let st = {}; let w = w0.slice(); for (let t = 1; t <= n; t++) { w = step(w, st, t); P.push(w.slice()); } return P; }

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 7.1 error surface with a local and a global minimum; −∇E points downhill
    errsurf() {
      const E = (x, y) => 1.2 - 0.9 * Math.exp(-((x + 1.2) ** 2 + (y - 0.2) ** 2) / 0.5) - 1.2 * Math.exp(-((x - 1.1) ** 2 + (y + 0.3) ** 2) / 0.7) + 0.05 * (x * x + y * y);
      const gr = (x, y) => { const h = 1e-4; return [(E(x + h, y) - E(x - h, y)) / (2 * h), (E(x, y + h) - E(x, y - h)) / (2 * h)]; };
      const wc = [0.1, 1.2], g = gr(...wc), gl = Math.hypot(...g);
      return G({ w: 560, h: 250, x: [-2.8, 2.8], y: [-1.9, 1.9], xl: 'w₁', yl: 'w₂', label: '가중치 공간의 오차 곡면', m: [12, 12, 18, 22], xt: [], yt: [],
        inner: MF.contour(E, [-2.8, 2.8], [-1.9, 1.9], [0.25, 0.4, 0.55, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5], 80, 'dm'),
        extra: (X, Y) => FK.dot(X, Y, -1.2, 0.2) + FK.dot(X, Y, 1.1, -0.3) + FK.dot(X, Y, ...wc, true)
          + FK.A(X(wc[0]), Y(wc[1]), X(wc[0] + 0.7 * g[0] / gl), Y(wc[1] + 0.7 * g[1] / gl), 'rx', 8) + FK.A(X(wc[0]), Y(wc[1]), X(wc[0] - 0.7 * g[0] / gl), Y(wc[1] - 0.7 * g[1] / gl), 'ld', 8)
          + T(X(-1.2), Y(0.2) - 10, 'w_A (국소 최소)', { s: 11 }) + T(X(1.1), Y(-0.3) + 18, 'w_B (전역 최소)', { s: 11 }) + T(X(wc[0] + 0.75 * g[0] / gl) + 4, Y(wc[1] + 0.75 * g[1] / gl), '∇E', { a: 'start', c: 'rl' }) + T(X(wc[0] - 0.75 * g[0] / gl) - 4, Y(wc[1] - 0.75 * g[1] / gl) + 12, '−∇E', { a: 'end', c: 'lb' }),
        cap: R`등고선은 오차 $E(\mathbf w)$가 같은 점들입니다. 두 정류점($\nabla E=0$) 중 $\mathbf w_A$는 국소 최소, $\mathbf w_B$는 전역 최소입니다. 빈 점에서 기울기 $\nabla E$는 오차가 가장 빨리 커지는 방향(등고선에 수직)이므로 $-\nabla E$ 방향으로 조금 움직이면 $\delta E\simeq\delta\mathbf w^T\nabla E\lt0$입니다.` });
    },
    // 7.2 batch, stochastic, mini-batch paths on the same quadratic
    sgdpaths() {
      const Q = quad(1, 4), r = MF.rng(21);
      const noisy = (sd) => (w, st, t) => { const g = Q.g(w); const eta = 0.18; return [w[0] - eta * (g[0] + sd * MF.normal(r)), w[1] - eta * (g[1] + sd * MF.normal(r))]; };
      const w0 = [-2.6, 1.2];
      const paths = [['배치 GD', run(noisy(0), w0, 25)], ['SGD (B = 1)', run(noisy(2.2), w0, 40)], ['미니배치 (B = 16)', run(noisy(2.2 / 4), w0, 30)]];
      const ps = paths.map(([t, P], i) => ({ w: 186, h: 170, ox: i * 186, x: [-3, 1.4], y: [-1.6, 1.6], title: t, m: [22, 6, 8, 6], xt: [], yt: [], axes: false,
        inner: (X, Y) => MF.ellipses([0, 0], 1, 4, 0, [0.1, 0.4, 0.9, 1.6, 2.5, 3.6], 'dm')(X, Y) + MF.poly(X, Y, P, i === 0 ? 'ld' : 'rx') + FK.dot(X, Y, 0, 0) }));
      return G2(558, 170, '배치, 확률적, 미니배치 경사하강법', ps,
        R`같은 오차 곡면(타원 등고선)에서 출발점만 같게 두었습니다. 배치 경사하강법은 매끈하게, SGD는 한 점의 기울기가 잡음이 많아 심하게 흔들리며, 미니배치는 그 사이로 최소점(가운데 점)에 다가갑니다. 크기 $B$인 미니배치 기울기의 분산은 한 점 기울기의 $1/B$이라 표준편차는 $1/\sqrt B$로 줄어듭니다.`);
    },
    // 7.2.5 initialization: signal size across ReLU layers for three weight scales
    initscale() {
      const n = 256, L = 12;
      const ratio = (s2) => (n * s2) / 2; // second moment multiplies by n σ²/2 per ReLU layer (zero-mean weights)
      const sch = [['He: σ² = 2/n', 2 / n, 'ld'], ['Xavier: σ² = 2/(n+n)', 1 / n, 'rx'], ['작은 상수: σ = 0.01', 1e-4, 'vl ds']];
      return G({ w: 560, h: 230, x: [0, L], y: [-12, 1], xl: '층', yl: 'log₁₀ (2차 모멘트)', label: '초기화 크기와 신호의 크기', m: [14, 16, 22, 40], xt: [0, 3, 6, 9, 12].map((v) => [v, String(v)]), yt: [[0, '1'], [-4, '10⁻⁴'], [-8, '10⁻⁸'], [-12, '10⁻¹²']],
        c: sch.map(([, s2, c]) => ({ f: (l) => l * Math.log10(ratio(s2)), c })),
        extra: (X, Y) => legend(X(0.4), Y(-6.2), sch.map(([t, , c]) => [c, t])),
        cap: R`폭 $n=256$인 ReLU층을 쌓을 때, 입력의 2차 모멘트가 층마다 $n\sigma^2/2$배가 됩니다(평균 0인 가중치). He 초기화는 정확히 1배라 12층 뒤에도 크기가 유지되고, 입출력 폭이 같을 때의 Xavier는 층마다 절반으로 줄며, 작은 상수는 $0.0128$배씩 줄어 곧 0이 됩니다(기울기 소실).` });
    },
    // 7.3 learning rate: zig-zag across a narrow valley and the contraction factor |1 − ηλ|
    lrzigzag() {
      const a = 1, b = 9, Q = quad(a, b);
      const gd = (eta) => (w) => { const g = Q.g(w); return [w[0] - eta * g[0], w[1] - eta * g[1]]; };
      const P = run(gd(0.2), [-2.7, 0.9], 20);
      return G2(560, 220, '학습률과 수렴', [
        { w: 300, h: 220, x: [-3, 1], y: [-1.2, 1.2], title: '좁은 골짜기의 지그재그 (η = 0.2)', m: [22, 6, 12, 6], xt: [], yt: [], axes: false,
          inner: (X, Y) => MF.ellipses([0, 0], a, b, 0, [0.1, 0.4, 0.9, 1.6, 2.5, 3.6], 'dm')(X, Y) + MF.poly(X, Y, P, 'rx') + FK.dot(X, Y, 0, 0)
            + FK.A(X(0.1), Y(-1.05), X(0.8), Y(-1.05), 'ax', 6) + T(X(0.85), Y(-1.05) + 4, 'u₁', { a: 'start', s: 11 }) + FK.A(X(0.1), Y(-1.05), X(0.1), Y(-0.5), 'ax', 6) + T(X(0.1), Y(-0.5) - 4, 'u₂', { s: 11 }) },
        { w: 260, h: 220, ox: 300, x: [0, 0.3], y: [0, 2.2], xl: 'η', title: '방향별 축소율 |1 − ηλᵢ|', m: [22, 10, 22, 26], xt: [[2 / 9, '2/λmax'], [1 / 9, '1/λmax']], yt: [[1, '1'], [2, '2']], hg: [1], vg: [2 / 9],
          c: [{ f: (e) => Math.abs(1 - e * a), c: 'ld' }, { f: (e) => Math.abs(1 - e * b), c: 'rx' }],
          extra: (X, Y) => legend(X(0.01), Y(2.05), [['ld', 'λ₁ = 1 (완만)'], ['rx', 'λ₂ = 9 (가파름)']]) },
      ], R`왼쪽: 곡률이 방향마다 다르면(헤시안 고윳값 $1$과 $9$) 기울기가 최소점을 곧바로 가리키지 않아, 가파른 $\mathbf u_2$ 방향으로는 진동하고 완만한 $\mathbf u_1$ 방향으로는 느리게 나아갑니다. 오른쪽: 이차 근사에서 고유방향 성분은 매 단계 $(1-\eta\lambda_i)$배가 되므로, 모든 방향이 수렴하려면 $\eta\lt2/\lambda_{\max}$이고, 그때 완만한 방향의 축소율은 $1-2\lambda_{\min}/\lambda_{\max}$에 가까워 느립니다.`);
    },
    // 7.3.1 momentum and Nesterov as vector diagrams
    momvec() {
      let s = '';
      const O = [70, 170], M = [70 + 120, 170 - 90], Gd = [O[0] + 150, O[1] + 20];
      s += FK.A(O[0], O[1], M[0], M[1], 'ld', 8) + FK.A(M[0], M[1], M[0] + 150, M[1] + 20, 'rx', 8) + FK.A(O[0], O[1], M[0] + 150, M[1] + 20, 'vl', 8);
      s += FK.C(O[0], O[1], 4, 'vlh') + T(O[0] - 6, O[1] + 16, 'w⁽ᵗ⁻¹⁾', { a: 'start', s: 11 });
      s += T(M[0] - 50, M[1] + 10, 'μΔw⁽ᵗ⁻²⁾', { c: 'lb', s: 11 }) + T(M[0] + 80, M[1] - 2, '−η∇E(w⁽ᵗ⁻¹⁾)', { c: 'rl', s: 11 }) + T(M[0] + 60, O[1] - 18, '실제 이동', { c: 'em', s: 11 });
      s += T(160, 26, '모멘텀: 현재 위치의 기울기', { c: 'em' });
      const O2 = [330, 170], M2 = [330 + 120, 170 - 90];
      s += FK.A(O2[0], O2[1], M2[0], M2[1], 'ld', 8) + FK.A(M2[0], M2[1], M2[0] + 90, M2[1] + 45, 'rx', 8) + FK.A(O2[0], O2[1], M2[0] + 90, M2[1] + 45, 'vl', 8);
      s += FK.C(M2[0], M2[1], 4, 'rxh') + T(M2[0] + 4, M2[1] - 8, '먼저 가 본 곳', { a: 'start', s: 11, c: 'rl' });
      s += FK.C(O2[0], O2[1], 4, 'vlh') + T(M2[0] - 50, M2[1] + 10, 'μΔw', { c: 'lb', s: 11 }) + T(M2[0] + 40, M2[1] + 66, '−η∇E(w + μΔw)', { c: 'rl', s: 11, a: 'start' });
      s += T(430, 26, '네스테로프: 앞을 본 기울기', { c: 'em' });
      return FK.fig(560, 205, '모멘텀과 네스테로프 모멘텀', s,
        R`모멘텀은 지난 이동 $\mu\Delta\mathbf w^{(\tau-2)}$에 현재 위치의 기울기 단계를 더합니다. 네스테로프는 지난 이동만큼 먼저 가 본 위치 $\mathbf w^{(\tau-1)}+\mu\Delta\mathbf w^{(\tau-2)}$에서 기울기를 계산해(“앞을 보는” 기울기) 너무 멀리 가는 것을 미리 바로잡습니다.`);
    },
    // 7.3.1 momentum accumulates on a gentle slope and cancels across a valley
    momeffect() {
      const mu = 0.9, k = Array.from({ length: 31 }, (_, t) => [t, (1 - mu ** (t + 1)) / (1 - mu)]);
      const Q = quad(0.5, 20), w0 = [-2.7, 0.25];
      const gd = run((w) => { const g = Q.g(w); return [w[0] - 0.09 * g[0], w[1] - 0.09 * g[1]]; }, w0, 30);
      const mom = run((w, st) => { const g = Q.g(w); st.v = st.v || [0, 0]; st.v = [0.5 * st.v[0] - 0.14 * g[0], 0.5 * st.v[1] - 0.14 * g[1]]; return [w[0] + st.v[0], w[1] + st.v[1]]; }, w0, 30);
      return G2(560, 220, '모멘텀의 두 효과', [
        { w: 260, h: 220, x: [0, 30], y: [0, 11], xl: 'τ', title: '일정한 기울기: 이동 폭 / (η|∇E|)', m: [22, 10, 22, 28], xt: [[0, '0'], [10, '10'], [20, '20'], [30, '30']], yt: [[1, '1'], [10, '10']], hg: [10],
          c: [{ pts: k, c: 'ld' }], inner: (X, Y) => MF.dots(X, Y, k.filter((_, i) => i % 3 === 0)), extra: (X, Y) => T(X(29), Y(10) - 6, '1/(1 − μ) = 10', { a: 'end', s: 11, c: 'lb' }) },
        { w: 300, h: 220, ox: 260, x: [-3, 1], y: [-1.2, 1.2], title: '좁은 골짜기: GD와 모멘텀', m: [22, 6, 12, 6], xt: [], yt: [], axes: false,
          inner: (X, Y) => MF.ellipses([0, 0], 0.5, 20, 0, [0.05, 0.2, 0.5, 0.9, 1.4, 2.0], 'dm')(X, Y) + MF.poly(X, Y, gd, 'rx') + MF.poly(X, Y, mom, 'ld') + FK.dot(X, Y, 0, 0),
          extra: (X, Y) => legend(X(-2.9), Y(-0.85), [['rx', 'GD η = 0.09 (30단계)'], ['ld', '모멘텀 η = 0.14, μ = 0.5']]) },
      ], R`왼쪽: 기울기가 일정한 완만한 영역에서는 매 단계 이동이 $1+\mu+\mu^2+\cdots$로 쌓여 $\eta/(1-\mu)$, $\mu=0.9$이면 10배로 커집니다. 오른쪽: 곡률이 큰 방향에서는 번갈아 바뀌는 기울기가 서로 상쇄되어 진동이 줄고, 완만한 방향으로는 관성이 쌓여 훨씬 빨리 나아갑니다(곡률 비 40인 곡면에서 같은 30단계).`);
    },
    // 7.3.2 learning-rate schedules
    lrsched() {
      const e0 = 0.1, K = 60, eK = 0.01;
      const lin = (t) => (t < K ? (1 - t / K) * e0 + (t / K) * eK : eK), pw = (t) => e0 * (1 + t / 10) ** -0.8, ex = (t) => e0 * 0.5 ** (t / 20);
      return G({ w: 560, h: 220, x: [0, 100], y: [0, 0.105], xl: 'τ', yl: 'η⁽ᵗ⁾', label: '학습률 스케줄', m: [14, 16, 22, 38], xt: [[0, '0'], [K, 'K = 60'], [100, '100']], yt: [[0.1, '0.1'], [0.05, '0.05'], [0.01, '0.01']],
        c: [{ f: lin, c: 'ld' }, { f: pw, c: 'rx' }, { f: ex, c: 'vl ds' }],
        extra: (X, Y) => legend(X(52), Y(0.098), [['ld', '선형: η⁽⁰⁾ = 0.1 → η⁽ᴷ⁾ = 0.01'], ['rx', '거듭제곱: (1 + τ/10)^(−0.8)'], ['vl ds', '지수: 0.5^(τ/20)']]),
        cap: R`세 스케줄 모두 처음에는 큰 학습률로 빨리 내려가고 점점 줄여 최소점 근처에서 안정적으로 수렴하게 합니다. 선형 스케줄은 $K$단계 뒤 $\eta^{(K)}$로 고정되고, 거듭제곱($c\lt0$)과 지수($0\lt c\lt1$)는 계속 줄어듭니다.` });
    },
    // 7.3.3 adaptive optimizers on an ill-conditioned quadratic with badly scaled axes
    adaptive() {
      const a = 0.2, b = 20, Q = quad(a, b), w0 = [-4.5, 0.4], n = 60, d = 1e-8;
      const gd = run((w) => { const g = Q.g(w); return [w[0] - 0.05 * g[0], w[1] - 0.05 * g[1]]; }, w0, n);
      const ada = run((w, st) => { const g = Q.g(w); st.r = st.r || [0, 0]; st.r = st.r.map((r, i) => r + g[i] * g[i]); return w.map((v, i) => v - (0.5 / (Math.sqrt(st.r[i]) + d)) * g[i]); }, w0, n);
      const rms = run((w, st) => { const g = Q.g(w); st.r = st.r || [0, 0]; st.r = st.r.map((r, i) => 0.9 * r + 0.1 * g[i] * g[i]); return w.map((v, i) => v - (0.08 / (Math.sqrt(st.r[i]) + d)) * g[i]); }, w0, n);
      const adam = run((w, st, t) => { const g = Q.g(w); st.s = st.s || [0, 0]; st.r = st.r || [0, 0]; st.s = st.s.map((s, i) => 0.9 * s + 0.1 * g[i]); st.r = st.r.map((r, i) => 0.99 * r + 0.01 * g[i] * g[i]); return w.map((v, i) => v - 0.1 * (st.s[i] / (1 - 0.9 ** t)) / (Math.sqrt(st.r[i] / (1 - 0.99 ** t)) + d)); }, w0, n);
      const panel = (P, t, c, i) => ({ w: 280, h: 130, ox: (i % 2) * 280, oy: Math.floor(i / 2) * 130, x: [-5, 1], y: [-0.6, 0.6], title: t, m: [20, 6, 6, 6], xt: [], yt: [], axes: false,
        inner: (X, Y) => MF.ellipses([0, 0], a, b, 0, [0.02, 0.1, 0.3, 0.7, 1.3, 2.1], 'dm')(X, Y) + MF.poly(X, Y, P, c) + FK.dot(X, Y, 0, 0) + FK.dot(X, Y, P[P.length - 1][0], P[P.length - 1][1], true) });
      return G2(560, 260, '적응형 옵티마이저의 경로', [panel(gd, 'GD η = 0.05', 'rx', 0), panel(ada, 'AdaGrad η = 0.5', 'ld', 1), panel(rms, 'RMSProp η = 0.08, β = 0.9', 'ld', 2), panel(adam, 'Adam η = 0.1, β₁ = 0.9, β₂ = 0.99', 'ld', 3)],
        R`$E=\frac12(0.2w_1^2+20w_2^2)$에서 같은 점에서 출발해 60단계 간 뒤의 위치가 빈 점입니다. 고정 학습률 GD는 가파른 $w_2$ 때문에 학습률을 작게 잡아야 해서 완만한 $w_1$ 방향으로 절반도 못 갑니다. 적응형 옵티마이저는 파라미터마다 기울기 크기의 (이동)평균으로 나누므로 두 방향이 비슷한 보폭으로 움직여 최소점(채운 점)에 닿습니다. AdaGrad는 누적합 때문에 보폭이 점점 줄고, Adam은 모멘텀 때문에 조금 출렁입니다.`);
    },
    // 7.3.3 Adam's bias correction for a constant gradient g = 1
    adambias() {
      const b1 = 0.9, b2 = 0.99;
      return G({ w: 560, h: 210, x: [0, 60], y: [0, 1.1], xl: 'τ', label: 'Adam의 편향 보정', m: [14, 16, 22, 30], xt: [[1, '1'], [10, '10'], [30, '30'], [60, '60']], yt: [[0.5, '0.5'], [1, '1']], hg: [1],
        c: [{ f: (t) => 1 - b1 ** t, c: 'ld', a: 1 }, { f: (t) => 1 - b2 ** t, c: 'rx', a: 1 }],
        extra: (X, Y) => legend(X(28), Y(0.45), [['ld', 's⁽ᵗ⁾ = 1 − β₁ᵗ (β₁ = 0.9)'], ['rx', 'r⁽ᵗ⁾ = 1 − β₂ᵗ (β₂ = 0.99)'], ['dm ds', '보정 후 ŝ, r̂ = 1']]),
        cap: R`기울기가 늘 $1$이면 참 1차·2차 모멘트는 1인데, 0에서 시작한 이동평균은 $s^{(\tau)}=1-\beta_1^\tau$, $r^{(\tau)}=1-\beta_2^\tau$로 처음에 0 쪽으로 치우칩니다($\tau=1$에서 $0.1$과 $0.01$). $1-\beta^\tau$로 나누면 정확히 1이 됩니다. $\beta_2$가 1에 더 가까워 $r$의 편향이 더 오래 갑니다.` });
    },
  });
})();
