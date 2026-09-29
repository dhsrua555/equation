/* 11 규제 I — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;

  // a 9×9 pixel glyph (an "F"-like shape with a dot) used for augmentation pictures
  const glyph = [
    '.........', '.#######.', '.##......', '.##......', '.######..', '.##......', '.##...#..', '.##......', '.........',
  ].map((r) => r.split('').map((c) => (c === '#' ? 1 : 0)));
  const bg = 0.18;
  const sample = (fn) => Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, j) => fn(i, j)));
  const at = (g, i, j) => { const a = Math.round(i), b = Math.round(j); return a >= 0 && a < 9 && b >= 0 && b < 9 ? g[a][b] : 0; };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 9.1 bias–variance trade-off measured on many data sets (polynomial M = 9, varying λ)
    biasvar() {
      const L = 100, N = 10, grid = Array.from({ length: 50 }, (_, k) => (k + 0.5) / 50);
      const lams = Array.from({ length: 37 }, (_, k) => -34 + k);
      const sets = Array.from({ length: L }, (_, l) => MF.sinData(N, 1000 + l, 0.3, true));
      const rows = lams.map((ll) => {
        const fits = sets.map((D) => MF.polyfit(D.xs, D.ts, 9, Math.exp(ll)).f);
        const mean = grid.map((x) => fits.reduce((s, f) => s + f(x), 0) / L);
        const b2 = grid.reduce((s, x, i) => s + (mean[i] - MF.SIN(x)) ** 2, 0) / grid.length;
        const va = grid.reduce((s, x, i) => s + fits.reduce((q, f) => q + (f(x) - mean[i]) ** 2, 0) / L, 0) / grid.length;
        return [ll, b2, va];
      });
      const cap = (v) => Math.min(v, 0.4);
      return G({ w: 560, h: 230, x: [-34, 2], y: [0, 0.4], xl: 'ln λ', label: '편향-분산 절충', m: [14, 16, 22, 34], ay0: -34, xt: [[-30, '−30'], [-20, '−20'], [-10, '−10'], [0, '0']], yt: [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3']],
        c: [{ pts: rows.map(([l, b]) => [l, cap(b)]), c: 'rx' }, { pts: rows.map(([l, , v]) => [l, cap(v)]), c: 'ld' }, { pts: rows.map(([l, b, v]) => [l, cap(b + v)]), c: 'vl' }],
        extra: (X, Y) => legend(X(-22), Y(0.37), [['rx', '(편향)²'], ['ld', '분산'], ['vl', '(편향)² + 분산']]),
        cap: R`입력 위치는 같고 잡음만 다른 자료 10개짜리 훈련 집합을 100벌 만들어 같은 $M=9$ 다항식을 규제 $\lambda$로 맞췄습니다. $\lambda$가 작으면(왼쪽, 유연한 모델) 자료마다 곡선이 크게 달라 **분산**이 크고, 크면(오른쪽, 단순한 모델) 모든 곡선이 참 규칙에서 한쪽으로 벗어나 **편향**이 큽니다. 둘의 합은 중간에서 가장 작습니다.` });
    },
    // 9.1.3 data augmentation of a small glyph (Bishop Fig. 9.1)
    augment() {
      const th = 0.35, c = Math.cos(th), sn = Math.sin(th);
      const r = MF.rng(4);
      const vs = [
        ['원본', sample((i, j) => (glyph[i][j] ? 1 : bg))],
        ['좌우 반전', sample((i, j) => (glyph[i][8 - j] ? 1 : bg))],
        ['확대', sample((i, j) => (at(glyph, 4 + (i - 4) / 1.35, 4 + (j - 4) / 1.35) ? 1 : bg))],
        ['평행이동', sample((i, j) => (at(glyph, i - 1, j + 1) ? 1 : bg))],
        ['회전', sample((i, j) => (at(glyph, 4 + c * (i - 4) - sn * (j - 4), 4 + sn * (i - 4) + c * (j - 4)) ? 1 : bg))],
        ['밝기·대비', sample((i, j) => (glyph[i][j] ? 0.75 : 0.45))],
        ['잡음 추가', sample((i, j) => Math.min(1, Math.max(0, (glyph[i][j] ? 1 : bg) + 0.28 * MF.normal(r))))],
        ['어둡게', sample((i, j) => (glyph[i][j] ? 0.55 : 0.05))],
      ];
      let s = '';
      vs.forEach(([t, g], k) => { const x = 20 + (k % 4) * 138, y = 16 + Math.floor(k / 4) * 124; s += MF.pix(x, y, 10, g, { max: 1, gray: true }) + T(x + 45, y + 108, t, { s: 11, c: 'em' }); });
      return FK.fig(560, 262, '자료 증강', s,
        R`원본(왼쪽 위)을 좌우 반전, 확대, 평행이동, 회전, 밝기·대비 변화, 잡음 추가 등으로 바꾼 복제본들입니다. 모두 **같은 레이블**을 붙여 훈련 자료에 넣으면, 망이 이 변환들에 불변인 함수를 배우게 됩니다.`);
    },
    // 9.1.4 equivariance of segmentation vs invariance of classification
    equivar() {
      const img = (dx) => sample((i, j) => (at(glyph, i, j - dx) ? 1 : bg));
      const seg = (dx) => sample((i, j) => (at(glyph, i, j - dx) ? 1 : 0));
      let s = MF.pix(40, 20, 9, img(0), { max: 1, gray: true }) + MF.pix(250, 20, 9, img(2), { max: 1, gray: true });
      s += MF.pix(40, 140, 9, seg(0), { max: 1, pos: 'ldh' }) + MF.pix(250, 140, 9, seg(2), { max: 1, pos: 'ldh' });
      s += FK.A(128, 60, 244, 60, 'ax', 7) + T(186, 52, 'T (옮기기)', { s: 11 }) + FK.A(128, 180, 244, 180, 'ax', 7) + T(186, 172, 'T', { s: 11 });
      s += FK.A(80, 104, 80, 136, 'ax', 7) + T(88, 124, 'S', { a: 'start', s: 11 }) + FK.A(290, 104, 290, 136, 'ax', 7) + T(298, 124, 'S', { a: 'start', s: 11 });
      s += FK.A(340, 60, 420, 60, 'rx', 7) + T(470, 64, 'C(T(I)) = “F”', { c: 'rl' }) + T(470, 190, 'S(T(I)) = T(S(I))', { c: 'lb' }) + T(470, 208, '등변', { s: 11 }) + T(470, 82, '불변', { s: 11 });
      return FK.fig(560, 234, '등변성과 불변성', s,
        R`위: 영상 $I$와 옮긴 영상 $T(I)$. 아래: 분할망 $S$의 결과(칠한 칸). 옮긴 뒤 분할한 것과 분할한 뒤 옮긴 것이 같으므로 $S(T(I))=T(S(I))$(등변). 분류망 $C$는 위치와 무관하게 같은 레이블을 내므로 $C(T(I))=C(I)$(불변).`);
    },
    // 9.2 weight decay shrinks along low-curvature directions (Bishop Fig. 9.3)
    wdshrink() {
      const l1 = 0.25, l2 = 4, lam = 1, ws = [2.4, 1.1];
      const wh = [(l1 / (l1 + lam)) * ws[0], (l2 / (l2 + lam)) * ws[1]];
      const path = Array.from({ length: 41 }, (_, k) => { const L = k === 0 ? 0 : Math.exp(-4 + k * 0.25); return [(l1 / (l1 + L)) * ws[0], (l2 / (l2 + L)) * ws[1]]; });
      return G({ w: 560, h: 250, x: [-1.2, 3.6], y: [-1.1, 2.0], xl: 'w₁', yl: 'w₂', label: '가중치 감쇠의 해', m: [12, 12, 20, 24], xt: [], yt: [],
        inner: (X, Y) => MF.ellipses(ws, l1, l2, 0, [0.02, 0.08, 0.18, 0.32, 0.5], 'rx')(X, Y) + MF.ellipses([0, 0], lam, lam, 0, [0.1, 0.3, 0.6, 1.0], 'dm')(X, Y) + MF.poly(X, Y, path, 'vl ds'),
        extra: (X, Y) => FK.dot(X, Y, ...ws) + FK.dot(X, Y, ...wh, true) + T(X(ws[0]) + 8, Y(ws[1]) - 6, 'w*', { a: 'start', c: 'rl' }) + T(X(wh[0]) - 8, Y(wh[1]) - 8, 'ŵ', { a: 'end', c: 'em' }) + T(X(3.3), Y(1.9) + 8, 'E(w)', { a: 'end', c: 'rl', s: 11 }) + T(X(-0.95), Y(-0.9), '½λ‖w‖²', { a: 'start', s: 11 }),
        cap: R`$E$의 등고선(가로로 긴 타원, 축이 헤시안의 고유벡터)과 벌점 $\frac\lambda2\lVert\mathbf w\rVert^2$의 등고선(원). 규제된 해 $\hat{\mathbf w}$는 성분마다 $\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$로 줄어듭니다. 곡률이 작은(오차가 둔감한) $w_1$은 $\frac{0.25}{1.25}=0.2$배로 크게, 곡률이 큰 $w_2$는 $\frac45$배로 조금만 줄어듭니다. 점선은 $\lambda$를 0에서 키울 때 해가 움직이는 길입니다.` });
    },
    // 9.2.2 unit balls of the generalized regularizer
    lqball() {
      const q = [0.5, 1, 2, 4];
      const ps = q.map((qq, i) => ({ w: 140, h: 150, ox: i * 140, x: [-1.3, 1.3], y: [-1.3, 1.3], title: `q = ${qq}`, m: [22, 6, 6, 6], xt: [], yt: [],
        inner: (X, Y) => [0.25, 0.5, 0.75, 1].map((rr) => { let d = ''; for (let k = 0; k <= 200; k++) { const t = (2 * Math.PI * k) / 200, c = Math.cos(t), s = Math.sin(t); const r = rr / (Math.abs(c) ** qq + Math.abs(s) ** qq) ** (1 / qq); d += `${k ? 'L' : 'M'}${FK.f1(X(r * c))},${FK.f1(Y(r * s))}`; } return FK.P(d + 'Z', rr === 1 ? 'rx' : 'dm'); }).join('') }));
      return G2(560, 150, '일반화된 가중치 감쇠의 등고선', ps,
        R`$\Omega(\mathbf w)=\frac\lambda2\sum_j\lvert w_j\rvert^q$의 등고선. $q=2$는 원(가중치 감쇠), $q=1$은 꼭짓점이 축 위에 있는 마름모(라쏘), $q\lt1$은 축으로 더 뾰족하게 들어가고, $q\gt2$는 사각형에 가까워집니다. 꼭짓점이 축 위에 있을수록 해가 축(일부 $w_j=0$)에 걸리기 쉽습니다.`);
    },
    // 9.2.2 lasso vs quadratic constraint (Bishop Fig. 9.6)
    lassoridge() {
      const c0 = [1.35, 1.9], a = 3, b = 1, th = Math.PI / 4;
      const E = (x, y) => { const u = (x - c0[0]) * Math.cos(th) + (y - c0[1]) * Math.sin(th), v = -(x - c0[0]) * Math.sin(th) + (y - c0[1]) * Math.cos(th); return 0.5 * (a * u * u + b * v * v); };
      const best = (q, eta) => { let bw = null, be = Infinity; for (let k = 0; k < 4000; k++) { const t = (2 * Math.PI * k) / 4000, c = Math.cos(t), s = Math.sin(t); const r = eta / (Math.abs(c) ** q + Math.abs(s) ** q) ** (1 / q); const e = E(r * c, r * s); if (e < be) { be = e; bw = [r * c, r * s, e]; } } return bw; };
      const P = (q, eta, t, ox) => { const w = best(q, eta);
        return { w: 280, h: 240, ox, x: [-1.4, 2.8], y: [-1.4, 2.8], title: t, m: [22, 6, 8, 8], xt: [], yt: [],
          inner: (X, Y) => { let d = ''; for (let k = 0; k <= 200; k++) { const tt = (2 * Math.PI * k) / 200, c = Math.cos(tt), s = Math.sin(tt); const r = eta / (Math.abs(c) ** q + Math.abs(s) ** q) ** (1 / q); d += `${k ? 'L' : 'M'}${FK.f1(X(r * c))},${FK.f1(Y(r * s))}`; } return FK.P(d + 'Z', 'fl2') + FK.P(d + 'Z', 'ld') + MF.contour(E, [-1.4, 2.8], [-1.4, 2.8], [w[2], 0.35, 0.8, 1.4, 2.2], 70, 'rx')(X, Y) + FK.dot(X, Y, w[0], w[1], true) + T(X(w[0]) - 8, Y(w[1]) - 6, 'ŵ', { a: 'end', c: 'em' }); } }; };
      return G2(560, 240, '라쏘와 이차 규제의 제약 영역', [P(1, 1, '|w₁| + |w₂| ≤ η (라쏘)', 0), P(2, 1, 'w₁² + w₂² ≤ η (이차)', 280)],
        R`규제된 최소화는 칠한 제약 영역 안에서 $E(\mathbf w)$(타원 등고선)를 최소로 하는 것과 같습니다. 등고선이 영역에 처음 닿는 점이 해 $\hat{\mathbf w}$입니다. 마름모는 축 위의 꼭짓점에서 닿기 쉬워 $\hat w_1=0$인 **희소해**가 나오고, 원에서는 두 성분이 모두 0이 아닌 채로 작아집니다.`);
    },
    // 9.3 learning curves and early stopping (Bishop Fig. 9.7)
    earlystop() {
      const tr = (t) => 0.15 + 0.12 * Math.exp(-t / 9), va = (t) => 0.36 + 0.09 * Math.exp(-t / 9) + 0.0009 * Math.max(0, t - 12) ** 1.35 * 0.35;
      let tb = 0, vb = 9; for (let t = 0; t <= 50; t += 0.1) { if (va(t) < vb) { vb = va(t); tb = t; } }
      return G2(560, 210, '학습 곡선과 조기 종료', [
        { w: 280, h: 210, x: [0, 50], y: [0.12, 0.3], xl: '반복', title: '훈련 오차', m: [22, 10, 22, 30], xt: [[0, '0'], [25, '25'], [50, '50']], yt: [[0.15, '0.15'], [0.25, '0.25']], vg: [tb], c: [{ f: tr, c: 'rx' }] },
        { w: 280, h: 210, ox: 280, x: [0, 50], y: [0.34, 0.46], xl: '반복', title: '검증 오차', m: [22, 10, 22, 30], xt: [[0, '0'], [Math.round(tb), String(Math.round(tb))], [50, '50']], yt: [[0.35, '0.35'], [0.45, '0.45']], vg: [tb], c: [{ f: va, c: 'ld' }] },
      ], R`훈련 오차는 계속 줄지만 검증 오차는 줄다가 과적합이 시작되면 다시 늘어납니다. 검증 오차가 최소인 반복(점선)에서 학습을 멈추면 유효 복잡도가 제한되어 일반화가 가장 좋습니다(그림은 전형적인 모양을 그린 것).`);
    },
    // 9.3 early stopping ≈ weight decay (Bishop Fig. 9.8)
    esweight() {
      const l1 = 0.3, l2 = 3, ws = [2.4, 1.2], rho = 0.2;
      const path = Array.from({ length: 60 }, (_, t) => [ws[0] * (1 - (1 - rho * l1) ** t), ws[1] * (1 - (1 - rho * l2) ** t)]);
      const tau = 6, wt = path[tau];
      return G({ w: 560, h: 240, x: [-0.3, 3.2], y: [-0.3, 1.8], xl: 'w₁', yl: 'w₂', label: '조기 종료와 가중치 감쇠', m: [12, 12, 20, 24], xt: [], yt: [],
        inner: (X, Y) => MF.ellipses(ws, l1, l2, 0, [0.02, 0.08, 0.18, 0.32, 0.5], 'rx')(X, Y) + MF.poly(X, Y, path, 'ld') + MF.dots(X, Y, path.slice(0, 20)),
        extra: (X, Y) => FK.dot(X, Y, ...ws) + FK.dot(X, Y, ...wt, true) + T(X(ws[0]) + 8, Y(ws[1]) - 6, 'w*', { a: 'start', c: 'rl' }) + T(X(wt[0]) + 2, Y(wt[1]) - 12, `ŵ (τ = ${tau})`, { a: 'start', c: 'em' }) + T(X(0) + 4, Y(0) + 16, '원점에서 시작', { a: 'start', s: 11 }),
        cap: R`원점에서 시작한 경사하강법($\rho=0.2$)의 경로. 곡률이 큰 $w_2$ 방향은 몇 단계 만에 $w_2^\star$에 도달하지만 곡률이 작은 $w_1$ 방향은 천천히 움직여, 일찍 멈춘 $\hat{\mathbf w}$는 가중치 감쇠의 해처럼 둔감한 성분만 작습니다: $w_j^{(\tau)}=\{1-(1-\rho\eta_j)^\tau\}w_j^\star$.` });
    },
    // 9.3 double descent (schematic after Nakkiran et al. 2019)
    ddescent() {
      const test = (x) => 0.18 + 0.3 * Math.exp(-x / 2.5) + 0.2 / (1 + ((x - 10) / 3) ** 2) - 0.0008 * Math.max(0, x - 10) * 1.2;
      const train = (x) => Math.max(0, 0.42 * Math.exp(-x / 3.2) - 0.02 * Math.max(0, x - 8));
      return G({ w: 560, h: 230, x: [0, 64], y: [0, 0.55], xl: '모델 크기 (너비)', yl: '오차', label: '이중 하강', m: [14, 16, 22, 30], xt: [[1, '1'], [10, '10'], [20, '20'], [40, '40'], [60, '60']], yt: [[0.2, '0.2'], [0.4, '0.4']],
        inner: (X, Y) => FK.R(X(6), Y(0.55), X(15) - X(6), Y(0) - Y(0.55), 'fl'), c: [{ f: test, c: 'ld' }, { f: train, c: 'rx' }],
        extra: (X, Y) => legend(X(40), Y(0.5), [['ld', '시험 오차'], ['rx', '훈련 오차']]) + FK.L(X(10), Y(0), X(10), Y(0.55), 'dm ds') + T(X(10.5), Y(0.5), '보간 임계점', { a: 'start', s: 11 }) + T(X(35), Y(0.08), '현대적 영역: 클수록 좋음', { s: 10.5 }),
        cap: R`시험 오차는 모델이 커지며 줄었다가, 훈련 자료를 정확히 맞출 수 있게 되는 **보간 임계점**(점선, 칠한 임계 영역) 근처에서 다시 커지고, 더 커지면 다시 줄어듭니다. 훈련 오차가 0이 된 뒤에도 시험 오차는 계속 좋아집니다. ResNet18 실험의 모양을 본뜬 개념도입니다.` });
    },
  });
})();
