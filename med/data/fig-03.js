/* 03 확률의 규칙과 베이즈 정리 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2 intro: an unobserved variable looks like noise
    unobs() {
      const r = MF.rng(12), n = 90;
      const a = Array.from({ length: n }, () => { const x1 = r(), x2 = r(); return [x1, Math.sin(2 * Math.PI * x1) * Math.sin(2 * Math.PI * x2)]; });
      const c2 = Math.sin(2 * Math.PI * (Math.PI / 2));
      const b = Array.from({ length: n }, () => { const x1 = r(); return [x1, Math.sin(2 * Math.PI * x1) * c2 + 0.04 * MF.normal(r)]; });
      const p = (pts, title, ox) => ({ w: 280, h: 200, ox, x: [0, 1], y: [-1.1, 1.1], title, m: [22, 10, 20, 24], xl: 'x₁', yl: 'y', xt: [[0, '0'], [1, '1']], yt: [[1, '1'], [-1, '−1']],
        inner: (X, Y) => MF.dots(X, Y, pts, true) });
      return G2(560, 200, '관측하지 않은 변수의 효과', [p(a, 'x₂를 관측하지 않음', 0), p(b, 'x₂ = π/2로 고정', 280)],
        R`$y=\sin(2\pi x_1)\sin(2\pi x_2)$는 잡음이 없는 결정적 함수입니다. 그런데 $x_2$를 모른 채 $y$를 $x_1$만의 함수로 보면 점들이 크게 흩어져 잡음처럼 보입니다(왼쪽). $x_2$를 한 값으로 고정하면 깔끔한 곡선이 됩니다(오른쪽). 관측하지 않은 변수가 우연적 불확실성의 한 원인입니다.`);
    },
    // 2.1 joint, marginal and conditional distributions from samples (Bishop Fig. 2.5)
    jointhist() {
      const r = MF.rng(4), N = 60, pts = [];
      for (let n = 0; n < N; n++) {
        const y = r() < 0.6 ? 1 : 2;
        const x = Math.max(1, Math.min(9, Math.round(y === 1 ? 3.6 + 1.3 * MF.normal(r) : 6.2 + 1.6 * MF.normal(r))));
        pts.push([x, y]);
      }
      const cX = Array(10).fill(0), cXY1 = Array(10).fill(0); let cY1 = 0;
      pts.forEach(([x, y]) => { cX[x]++; if (y === 1) { cXY1[x]++; cY1++; } });
      const jit = MF.rng(9);
      const scat = { w: 280, h: 170, x: [0.4, 9.6], y: [0.4, 2.6], title: '결합분포 p(X, Y): 표본 60개', m: [22, 10, 20, 34], xt: [1, 3, 5, 7, 9].map((v) => [v, String(v)]), yt: [[1, 'Y=1'], [2, 'Y=2']],
        inner: (X, Y) => { let s = ''; for (let k = 1; k <= 9; k++) s += FK.L(X(k + 0.5), Y(0.5), X(k + 0.5), Y(2.5), 'dm'); s += FK.L(X(0.5), Y(1.5), X(9.5), Y(1.5), 'dm'); return s + pts.map(([x, y]) => FK.dot(X, Y, x + 0.7 * (jit() - 0.5), y + 0.6 * (jit() - 0.5))).join(''); } };
      const bars = (vals, title, ox, oy, ymax, cls) => ({ w: 280, h: 170, ox, oy, x: [0.4, 9.6], y: [0, ymax], title, m: [22, 10, 20, 34], xt: [1, 3, 5, 7, 9].map((v) => [v, String(v)]), yt: [[ymax / 2, (ymax / 2).toFixed(2)]],
        extra: (X, Y) => vals.map((v, k) => (k === 0 ? '' : FK.R(X(k) - 11, Y(v), 22, Y(0) - Y(v), cls))).join('') });
      const pY = { w: 280, h: 170, ox: 280, x: [0, 0.8], y: [0.4, 2.6], title: '주변분포 p(Y)', m: [22, 10, 20, 34], xt: [[0.4, '0.4'], [0.8, '0.8']], yt: [[1, 'Y=1'], [2, 'Y=2']],
        extra: (X, Y) => FK.R(X(0), Y(1.3), X(cY1 / N) - X(0), Y(0.7) - Y(1.3), 'bm') + FK.R(X(0), Y(2.3), X((N - cY1) / N) - X(0), Y(1.7) - Y(2.3), 'bm') + FK.R(X(0), Y(1.3), X(cY1 / N) - X(0), Y(0.7) - Y(1.3), 'sv') + FK.R(X(0), Y(2.3), X((N - cY1) / N) - X(0), Y(1.7) - Y(2.3), 'sv') };
      return G2(560, 340, '결합·주변·조건부 분포', [scat, pY, bars(cX.map((c) => c / N), '주변분포 p(X)', 0, 170, 0.3, 'ldh'), bars(cXY1.map((c) => c / cY1), '조건부분포 p(X | Y = 1)', 280, 170, 0.5, 'rxh')],
        R`$X$는 9개 값, $Y$는 2개 값을 갖는 변수의 표본 60개입니다(점 하나가 한 표본). 칸마다 점을 세면 $n_{ij}$, 전체로 나누면 결합확률. 행이나 열로 모두 더하면 주변분포 $p(Y)$와 $p(X)$이고, $Y=1$인 행만 떼어 **그 행의 합으로 다시 나누면** 조건부분포 $p(X\mid Y=1)$입니다(막대 합이 1).`);
    },
    // 2.1.4 base-rate effect: posterior of disease given a positive test against prevalence
    baserate() {
      const post = (p, se = 0.9, fp = 0.03) => (se * p) / (se * p + fp * (1 - p));
      return G({ w: 560, h: 230, x: [0, 0.3], y: [0, 1.02], xl: '유병률 p(C = 1)', yl: 'p(C=1 | T=1)', label: '유병률과 양성 예측도', m: [14, 16, 22, 34],
        xt: [[0.01, '1%'], [0.05, '5%'], [0.1, '10%'], [0.2, '20%'], [0.3, '30%']], yt: [[0.23, '0.23'], [0.5, '0.5'], [1, '1']], hg: [0.9], vg: [0.01],
        c: [{ f: (p) => post(p), c: 'ld' }, { f: (p) => post(p, 0.9, 0.1), c: 'rx' }],
        inner: (X, Y) => FK.dot(X, Y, 0.01, post(0.01)),
        extra: (X, Y) => legend(X(0.15), Y(0.42), [['ld', '민감도 0.9, 위양성률 0.03'], ['rx', '민감도 0.9, 위양성률 0.10']]) + T(X(0.29), Y(0.9) - 6, '민감도 0.9', { a: 'end', s: 11 }),
        cap: R`같은 검사라도 양성일 때 실제로 병이 있을 확률은 유병률(사전확률)에 크게 좌우됩니다. 교재의 예(유병률 1%, 점)에서는 $0.23$에 불과하고, 유병률이 20%면 약 $0.88$입니다. 위양성률이 커지면 곡선이 더 낮아집니다. 민감도(점선)와 양성 예측도를 혼동하지 마세요.` });
    },
  });
})();
