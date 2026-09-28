/* 04 확률적 회귀, 규제, 커널 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  // ten points from sin(2πx) with fixed noise, as in the lecture's experiment
  const X = Array.from({ length: 10 }, (_, i) => i / 9);
  const E = [0.12, -0.18, 0.05, 0.21, -0.09, -0.25, 0.14, -0.06, 0.19, -0.11];
  const Y = X.map((x, i) => Math.sin(2 * Math.PI * x) + E[i]);
  // least squares polynomial of degree M (normal equations, Gaussian elimination)
  const fit = (M) => {
    const n = M + 1, A = [], b = [];
    for (let r = 0; r < n; r++) {
      A.push([]); b.push(0);
      for (let c = 0; c < n; c++) A[r].push(X.reduce((s, x) => s + Math.pow(x, r + c), 0));
      b[r] = X.reduce((s, x, i) => s + Math.pow(x, r) * Y[i], 0);
    }
    for (let k = 0; k < n; k++) {
      let p = k; for (let r = k + 1; r < n; r++) if (Math.abs(A[r][k]) > Math.abs(A[p][k])) p = r;
      [A[k], A[p]] = [A[p], A[k]]; [b[k], b[p]] = [b[p], b[k]];
      for (let r = k + 1; r < n; r++) { const f = A[r][k] / A[k][k]; for (let c = k; c < n; c++) A[r][c] -= f * A[k][c]; b[r] -= f * b[k]; }
    }
    const c = Array(n).fill(0);
    for (let k = n - 1; k >= 0; k--) { let s = b[k]; for (let j = k + 1; j < n; j++) s -= A[k][j] * c[j]; c[k] = s / A[k][k]; }
    return (x) => c.reduce((s, ck, k) => s + ck * Math.pow(x, k), 0);
  };
  // degree 9 through ten points = the interpolating polynomial (Lagrange form is stable)
  const lagr = (x) => X.reduce((s, xi, i) => { let l = 1; X.forEach((xj, j) => { if (j !== i) l *= (x - xj) / (xi - xj); }); return s + Y[i] * l; }, 0);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 4.2 under- and overfitting
    polyfit() {
      const panel = (ox, f, title) => ({ ox, w: 186.7, h: 210, x: [-0.03, 1.03], y: [-1.7, 1.7], title, m: [22, 6, 8, 6], axes: false,
        c: [{ f: (x) => Math.sin(2 * Math.PI * x), c: 'dm ds' }, { f, c: 'ld' }], extra: (Xp, Yp) => X.map((x, i) => dot(Xp, Yp, x, Y[i])).join('') });
      return G2(560, 210, '다항회귀의 차수와 과적합', [panel(0, fit(1), 'M = 1 (과소적합)'), panel(186.7, fit(3), 'M = 3 (적당)'), panel(373.4, lagr, 'M = 9 (과적합)')],
        R`점선이 자료를 만든 참 함수 $\sin2\pi x$, 점이 잡음이 섞인 훈련 자료 10개, 실선이 최소제곱 다항식입니다. $M=1$은 너무 단순해 모양을 못 따라가고, $M=9$는 모수 10개로 10개의 점을 정확히 지나지만(훈련오차 0) 점 사이, 특히 양 끝에서 크게 출렁여 새 자료를 잘못 예측합니다.`);
    },
    // 4.3 why L1 gives sparse solutions: level sets touching the constraint region
    l1l2() {
      const A = [[1, 0.35], [0.35, 0.55]], c0 = [1.35, 0.55];
      const Q = (b) => { const d = [b[0] - c0[0], b[1] - c0[1]]; return A[0][0] * d[0] * d[0] + 2 * A[0][1] * d[0] * d[1] + A[1][1] * d[1] * d[1]; };
      const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[0][1], disc = Math.sqrt(tr * tr / 4 - det);
      const l1 = tr / 2 + disc, l2 = tr / 2 - disc;
      const ev = (l) => { const v = [A[0][1], l - A[0][0]], n = Math.hypot(v[0], v[1]); return [v[0] / n, v[1] / n]; };
      const v1 = ev(l1), v2 = ev(l2);
      const ell = (lev) => Array.from({ length: 121 }, (_, k) => { const t = (2 * Math.PI * k) / 120, a = Math.sqrt(lev / l1) * Math.cos(t), b = Math.sqrt(lev / l2) * Math.sin(t); return [c0[0] + a * v1[0] + b * v2[0], c0[1] + a * v1[1] + b * v2[1]]; });
      const touch = (bd) => { let best = null; bd.forEach((p) => { const q = Q(p); if (!best || q < best[0]) best = [q, p]; }); return best; };
      const circ = Array.from({ length: 721 }, (_, k) => [Math.cos((2 * Math.PI * k) / 720), Math.sin((2 * Math.PI * k) / 720)]);
      const diam = []; for (let k = 0; k <= 800; k++) { const t = (4 * k) / 800, s = Math.floor(t) % 4, u = t - Math.floor(t); const P = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]]; diam.push([P[s][0] + (P[s + 1][0] - P[s][0]) * u, P[s][1] + (P[s + 1][1] - P[s][1]) * u]); }
      const [q2, p2] = touch(circ), [q1, p1] = touch(diam);
      const panel = (ox, bd, lev, p, title) => ({ ox, w: 280, h: 250, x: [-1.4, 2.4], y: [-1.25, 1.91], title, xl: 'β₁', yl: 'β₂', m: [22, 8, 12, 12], xt: [[1, '1']], yt: [[1, '1']],
        c: [{ pts: bd, c: 'fl2' }, { pts: bd, c: 'vl' }, { pts: ell(lev), c: 'ld' }, { pts: ell(lev * 2.6), c: 'dm' }, { pts: ell(lev * 0.35), c: 'dm' }],
        extra: (Xp, Yp) => dot(Xp, Yp, c0[0], c0[1], true) + dot(Xp, Yp, p[0], p[1]) + FK.T(Xp(c0[0]) + 6, Yp(c0[1]) - 6, 'β̂(최소제곱)', { a: 'start', c: 'em' }) });
      return G2(560, 250, '릿지와 라쏘의 제약 영역', [panel(0, circ, q2, p2, '(a) 릿지: β₁² + β₂² ≤ t'), panel(280, diam, q1, p1, '(b) 라쏘: |β₁| + |β₂| ≤ t')],
        R`규제된 문제는 “계수가 칠한 영역 안에 있어야 한다”는 제약 아래 제곱오차를 최소화하는 것과 같습니다. 타원은 제곱오차의 등고선이고, 해는 등고선이 영역에 처음 닿는 점(채운 점)입니다. 원(릿지)에는 모서리가 없어 보통 두 계수가 모두 0이 아닌 곳에서 닿고, 마름모(라쏘)는 축 위의 **꼭짓점**에서 닿기 쉬워 한 계수가 정확히 0이 됩니다.`);
    },
    // 4.4 lifting a circle-separated data set with φ(x) = x1² + x2²
    lift() {
      const pts = [];
      for (let k = 0; k < 22; k++) { const t = (2 * Math.PI * k) / 22 + 0.1, r = 0.35 + 0.25 * ((k * 7) % 5) / 5; pts.push([r * Math.cos(t), r * Math.sin(t), 0]); }
      for (let k = 0; k < 26; k++) { const t = (2 * Math.PI * k) / 26, r = 1.15 + 0.35 * ((k * 3) % 5) / 5; pts.push([r * Math.cos(t), r * Math.sin(t), 1]); }
      return G2(560, 230, '특성공간으로 올리기', [
        { w: 250, h: 230, x: [-2, 2], y: [-1.7, 1.71], title: '(a) 원래 공간: 직선으로 못 나눔', xl: 'x₁', yl: 'x₂', m: [22, 8, 12, 12],
          c: [{ pts: Array.from({ length: 121 }, (_, k) => [Math.cos((2 * Math.PI * k) / 120), Math.sin((2 * Math.PI * k) / 120)]), c: 'dm ds' }],
          extra: (Xp, Yp) => pts.map(([a, b, cl]) => dot(Xp, Yp, a, b, cl === 1)).join('') },
        { ox: 250, w: 310, h: 230, x: [-1.8, 1.8], y: [-0.2, 3.3], title: '(b) z = x₁² + x₂² 를 더하면 평면(선) z = 1로 나뉨', xl: 'x₁', yl: 'z', m: [22, 8, 12, 12], hg: [1],
          extra: (Xp, Yp) => pts.map(([a, b, cl]) => dot(Xp, Yp, a, a * a + b * b, cl === 1)).join('') },
      ], R`(a) 안쪽 점(채운 원)과 바깥쪽 점(빈 원)은 어떤 직선으로도 나눌 수 없습니다. (b) 새 좌표 $z=x_1^2+x_2^2$ (원점에서의 거리 제곱)을 더하면 안쪽 점은 아래, 바깥쪽 점은 위에 놓여 수평선 $z=1$ 하나로 나뉩니다. 슬라이드의 $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$에서는 $z_1+z_2=1$이라는 평면이 같은 일을 합니다.`);
    },
  });
})();
