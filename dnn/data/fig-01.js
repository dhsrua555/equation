/* 01 선형회귀와 정규방정식 — 본문 그림 (core/figkit.js의 FK.G로 그립니다) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  const xs = [0, 1, 2, 3], ys = [1, 2, 2, 4];
  const b0 = 0.9, b1 = 0.9;
  // gradient descent with the slide rule β ← β + α Xᵀ(y − Xβ) on the four points
  const gd = (al, n) => {
    let b = [0, 0];
    const out = [b.slice()];
    for (let s = 0; s < n; s++) {
      let g0 = 0, g1 = 0;
      xs.forEach((x, i) => { const r = ys[i] - (b[0] + b[1] * x); g0 += r; g1 += r * x; });
      b = [b[0] + al * g0, b[1] + al * g1];
      out.push(b.slice());
    }
    return out;
  };
  // level sets of f(β) = SSE: (β − β̂)ᵀ A (β − β̂) = c with A = XᵀX = [[4,6],[6,14]]
  const l1 = 9 + Math.sqrt(61), l2 = 9 - Math.sqrt(61);
  const nv = (l) => { const v = [6, l - 4], n = Math.hypot(v[0], v[1]); return [v[0] / n, v[1] / n]; };
  const v1 = nv(l1), v2 = nv(l2);
  const ell = (c) => Array.from({ length: 121 }, (_, k) => {
    const t = (2 * Math.PI * k) / 120, a = Math.sqrt(c / l1) * Math.cos(t), b = Math.sqrt(c / l2) * Math.sin(t);
    return [b0 + a * v1[0] + b * v2[0], b1 + a * v1[1] + b * v2[1]];
  });

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 1.1 / 1.4 residuals of the least squares line and of the mean line
    lsqfit() {
      return G2(560, 250, '최소제곱 직선과 잔차', [
        { w: 290, h: 250, x: [-0.5, 3.6], y: [0, 4.6], xl: 'x', yl: 'y', title: '(a) 최소제곱 직선 ŷ = 0.9 + 0.9x', xt: [[1, '1'], [2, '2'], [3, '3']], yt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], m: [22, 10, 20, 24],
          c: [{ f: (x) => b0 + b1 * x, c: 'ld' }].concat(xs.map((x, i) => ({ pts: [[x, ys[i]], [x, b0 + b1 * x]], c: 'rx' }))),
          extra: (X, Y) => xs.map((x, i) => dot(X, Y, x, ys[i])).join('') + FK.T(X(2.05), Y(2.35), '−0.7', { a: 'start', c: 'rl' }) + FK.T(X(3.05), Y(3.85), '+0.4', { a: 'start', c: 'rl' }) },
        { ox: 290, w: 270, h: 250, x: [-0.5, 3.6], y: [0, 4.6], xl: 'x', yl: 'y', title: '(b) 평균선 y = 2.25 (기준선)', xt: [[1, '1'], [2, '2'], [3, '3']], yt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], m: [22, 10, 20, 24],
          c: [{ f: () => 2.25, c: 'dm ds' }].concat(xs.map((x, i) => ({ pts: [[x, ys[i]], [x, 2.25]], c: 'rx' }))),
          extra: (X, Y) => xs.map((x, i) => dot(X, Y, x, ys[i])).join('') },
      ], R`세로 선분이 잔차 $y_i-\hat y_i$입니다. (a) 최소제곱 직선의 제곱오차합은 $0.01+0.04+0.49+0.16=0.70$, (b) 모든 점을 평균 $\bar y=2.25$로 예측하는 수평선의 제곱오차합은 $4.75$입니다. 기울기를 주면 오차가 $4.75\to0.70$으로 줄고, 그 비율 $1-0.70/4.75\approx0.85$를 결정계수 $R^2$라 부릅니다.`);
    },
    // 1.4 SSE as a function of the slope of lines through the centroid
    sseslope() {
      const f = (m) => 4.75 - 9 * m + 5 * m * m;
      return G({ w: 560, h: 220, x: [-0.4, 2.2], y: [0, 7], xl: '기울기 m', yl: 'SSE', label: '기울기에 따른 제곱오차합',
        xt: [[0, '0'], [0.9, '0.9'], [1.8, '1.8']], yt: [[0.7, '0.70'], [4.75, '4.75']], hg: [0.7, 4.75], vg: [0.9], m: [10, 14, 22, 40],
        c: [{ f, c: 'ld' }], extra: (X, Y) => dot(X, Y, 0, 4.75) + dot(X, Y, 0.9, 0.7) + FK.T(X(0.05), Y(4.75) - 8, '수평선', { a: 'start', c: 'rl' }) + FK.T(X(0.95), Y(0.7) - 8, '최적', { a: 'start', c: 'lb' }),
        cap: R`무게중심 $(1.5,\,2.25)$를 지나는 직선을 기울기 $m$만큼 돌리며 제곱오차합을 그리면 $\mathrm{SSE}(m)=4.75-9m+5m^2$라는 **아래로 볼록한 포물선**입니다. 수평선($m=0$)에서 시작해 돌릴수록 줄다가 $m=0.9$에서 최소 $0.70$이 되고 그 뒤로 다시 늘어납니다. 슬라이드의 “회전하면 24.62 → 16.5로 줄다가 다시 늘어난다”는 그림이 바로 이것입니다.` });
    },
    // 1.5 gradient descent paths on the level sets of the SSE
    gdpath() {
      const p1 = gd(0.05, 40), p2 = gd(0.11, 40);
      const lev = [0.25, 1, 2.5, 5];
      const panel = (ox, pts, title) => ({ ox, w: 280, h: 250, x: [-0.35, 1.65], y: [-0.25, 1.55], xl: 'β₀', yl: 'β₁', title, xt: [[0.9, '0.9']], yt: [[0.9, '0.9']], m: [22, 8, 20, 26],
        c: lev.map((c) => ({ pts: ell(c), c: 'dm' })).concat([{ pts, c: 'rx' }]),
        extra: (X, Y) => pts.slice(0, 14).map((p) => dot(X, Y, p[0], p[1])).join('') + dot(X, Y, b0, b1, true) });
      return G2(560, 250, '경사하강법의 경로', [panel(0, p1, '(a) α = 0.05'), panel(280, p2, '(b) α = 0.11')],
        R`가는 곡선은 제곱오차합이 같은 점들(등고선), 빈 원은 최솟점 $(0.9,\,0.9)$입니다. 슬라이드 규칙 $\beta\leftarrow\beta+\alpha X^T(y-X\beta)$로 $(0,0)$에서 출발했습니다. 등고선이 길쭉한 타원이라 (a) 가파른 방향으로는 금방 내려오지만 완만한 긴 축 방향으로는 느리게 기어가고, (b) 학습률을 한계 $2/\lambda_{\max}(X^TX)\approx0.119$ 가까이 키우면 가파른 방향으로 좌우로 튀면서 내려갑니다.`);
    },
  });
})();
