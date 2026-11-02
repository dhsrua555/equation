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


  // ---- experiments for 4.2-4.3 (own fixed noise; the lecture's exact data are not reproduced) ----
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const gauss = () => { let s = 0; for (let k = 0; k < 12; k++) s += rnd(); return s - 6; };
  const SD = 0.3;
  const truth = (x) => Math.sin(2 * Math.PI * x);
  const mkset = (n, noisy) => { const xs = Array.from({ length: n }, (_, i) => i / (n - 1)); return [xs, xs.map((x) => truth(x) + (noisy ? SD * gauss() : 0))]; };
  const TX = Array.from({ length: 200 }, (_, i) => (i + 0.5) / 200), TY = TX.map((x) => truth(x) + SD * gauss());
  // ridge/least squares of degree M on (xs, ys): solves (BtB + lam I) c = Bt y in the basis t^k, t = 2x - 1 when lam = 0 (better conditioned), monomials otherwise
  const polyfit2 = (xs, ys, M, lam) => {
    const t = (x) => (lam === 0 ? 2 * x - 1 : x), n = M + 1, A = [], b = [];
    for (let r = 0; r < n; r++) {
      A.push([]); b.push(xs.reduce((s, x, i) => s + Math.pow(t(x), r) * ys[i], 0));
      for (let c = 0; c < n; c++) A[r].push(xs.reduce((s, x) => s + Math.pow(t(x), r + c), 0) + (r === c ? lam : 0));
    }
    for (let k = 0; k < n; k++) {
      let p = k; for (let r = k + 1; r < n; r++) if (Math.abs(A[r][k]) > Math.abs(A[p][k])) p = r;
      [A[k], A[p]] = [A[p], A[k]]; [b[k], b[p]] = [b[p], b[k]];
      for (let r = k + 1; r < n; r++) { const f = A[r][k] / A[k][k]; for (let c = k; c < n; c++) A[r][c] -= f * A[k][c]; b[r] -= f * b[k]; }
    }
    const c = Array(n).fill(0);
    for (let k = n - 1; k >= 0; k--) { let s = b[k]; for (let j = k + 1; j < n; j++) s -= A[k][j] * c[j]; c[k] = s / A[k][k]; }
    return (x) => c.reduce((s, ck, k) => s + ck * Math.pow(t(x), k), 0);
  };
  const [X10, Y10] = mkset(10, true);
  const erms = (f, xs, ys) => Math.sqrt(xs.reduce((s, x, i) => s + (f(x) - ys[i]) ** 2, 0) / xs.length);
  // M = 9 through ten points is the interpolating polynomial; use Lagrange form there
  const lag10 = (x) => X10.reduce((s, xi, i) => { let l = 1; X10.forEach((xj, j) => { if (j !== i) l *= (x - xj) / (xi - xj); }); return s + Y10[i] * l; }, 0);
  const fitM = (M) => (M >= 9 ? lag10 : polyfit2(X10, Y10, M, 0));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 4.2 under- and overfitting
    polyfit() {
      const panel = (ox, f, title) => ({ ox, w: 186.7, h: 210, x: [-0.03, 1.03], y: [-1.7, 1.7], title, m: [22, 6, 8, 6], axes: false,
        c: [{ f: (x) => Math.sin(2 * Math.PI * x), c: 'dm ds' }, { f, c: 'ld' }], extra: (Xp, Yp) => X.map((x, i) => dot(Xp, Yp, x, Y[i])).join('') });
      return G2(560, 210, '다항회귀의 차수와 과적합', [panel(0, fit(1), 'M = 1 (과소적합)'), panel(186.7, fit(3), 'M = 3 (적당)'), panel(373.4, lagr, 'M = 9 (과적합)')],
        R`점선이 자료를 만든 참 함수 $\sin2\pi x$, 점이 잡음이 섞인 훈련 자료 10개, 실선이 최소제곱 다항식입니다. $M=1$은 너무 단순해 모양을 못 따라가고, $M=9$는 모수 10개로 10개의 점을 정확히 지나지만(훈련오차 0) 점 사이, 특히 양 끝에서 크게 출렁여 새 자료를 잘못 예측합니다.`);
    },
    // 4.2 training vs validation E_RMS against the degree M
    rmsm() {
      const Ms = Array.from({ length: 10 }, (_, i) => i);
      const tr = Ms.map((M) => [M, erms(fitM(M), X10, Y10)]), te = Ms.map((M) => [M, erms(fitM(M), TX, TY)]);
      const top = Math.ceil(Math.max(...te.map((p) => Math.min(p[1], 1.6))) * 5) / 5;
      return G({ w: 560, h: 240, x: [-0.4, 9.6], y: [0, 1], xl: 'M', yl: 'E_RMS', label: '차수에 따른 훈련·검증 오차', m: [14, 18, 26, 40],
        xt: Ms.map((M) => [M, String(M)]), yt: [[0, '0'], [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']],
        c: [{ pts: tr, c: 'ld' }, { pts: te.map((p) => [p[0], Math.min(p[1], 1.2)]), c: 'rx' }],
        extra: (X, Y) => tr.map((p) => dot(X, Y, p[0], p[1])).join('') + te.map((p) => dot(X, Y, p[0], Math.min(p[1], 1.2), true)).join('')
          + legend(X(5.3), Y(0.9), [['ld', '훈련 자료 (10개)'], ['rx', '검증 자료 (200개)']]),
        cap: R`예: 훈련 자료 10개와 같은 곡선에서 새로 뽑은 검증 자료 200개로 $E_{\mathrm{RMS}}=\sqrt{f(\hat\beta)/n}$을 잰 것입니다(고정한 잡음으로 직접 계산한 예시이며 슬라이드의 숫자와는 다릅니다). 훈련오차(점)는 $M$이 커질수록 계속 줄어 $M=9$에서 $0$이 됩니다. 검증오차(빈 원)는 $M=3$에서 가장 낮고(약 $0.38$) 그 뒤로는 줄지 않으며, $M\ge5$에서 훈련오차와의 격차가 크게 벌어져 $M=9$에서 가장 큽니다(약 $0.47$). 검증오차가 최저인 차수가 고를 차수입니다.` });
    },
    // 4.2 the same M = 9 fit with n = 10 and n = 100 points
    ndata() {
      const [X100, Y100] = mkset(100, true);
      const panel = (ox, xs, ys, f, title) => ({ ox, w: 280, h: 220, x: [-0.03, 1.03], y: [-1.7, 1.7], title, m: [22, 14, 8, 6], axes: false,
        c: [{ f: truth, c: 'dm ds' }, { f: (x) => Math.max(-1.55, Math.min(1.55, f(x))), c: 'ld' }], extra: (Xp, Yp) => xs.map((x, i) => dot(Xp, Yp, x, ys[i])).join('') });
      return G2(560, 220, '자료 수에 따른 M=9 다항식', [
        panel(0, X10, Y10, lag10, 'n = 10 (M = 9)'), panel(280, X100, Y100, polyfit2(X100, Y100, 9, 0), 'n = 100 (M = 9)')],
        R`같은 $M=9$, $\lambda=0$이라도 자료가 10개이면 점을 모두 지나며 출렁이지만(왼쪽), 100개이면 거의 참 곡선(점선)을 따릅니다(오른쪽). 모수 하나당 자료 10개 정도라는 경험칙의 뜻입니다. 두 경우 모두 고정한 잡음으로 직접 계산한 예시입니다.`);
    },
    // 4.3 ridge on M = 9: the fits for ln λ = -16 and 0, and the errors against ln λ
    ridgefit() {
      const ridge = (lnl) => polyfit2(X10, Y10, 9, Math.exp(lnl));
      const panel = (ox, f, title) => ({ ox, w: 186.7, h: 210, x: [-0.03, 1.03], y: [-1.7, 1.7], title, m: [22, 6, 8, 6], axes: false,
        c: [{ f: truth, c: 'dm ds' }, { f, c: 'ld' }], extra: (Xp, Yp) => X10.map((x, i) => dot(Xp, Yp, x, Y10[i])).join('') });
      const ls = Array.from({ length: 26 }, (_, i) => -25 + i);
      const tr = ls.map((l) => [l, erms(ridge(l), X10, Y10)]), te = ls.map((l) => [l, erms(ridge(l), TX, TY)]);
      const best = te.reduce((a, p) => (p[1] < a[1] ? p : a));
      return G2(560, 210, '릿지 회귀의 규제 세기', [
        panel(0, ridge(-7), 'ln λ = −7'), panel(186.7, ridge(0), 'ln λ = 0'),
        { ox: 373.4, w: 186.7, h: 210, x: [-26, 1], y: [0, 0.8], title: 'E_RMS 대 ln λ', xl: 'ln λ', ay0: -26, m: [26, 8, 24, 36], xt: [[-20, '−20'], [-10, '−10'], [0, '0']], yt: [[0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6']],
          c: [{ pts: tr, c: 'ld' }, { pts: te, c: 'rx' }], extra: (X, Y) => dot(X, Y, best[0], best[1], true) + FK.T(X(-25), Y(0.74), '훈련', { a: 'start', c: 'lb' }) + FK.T(X(-25), Y(0.66), '검증', { a: 'start', c: 'rl' }) }],
        R`$M=9$ 다항식에 릿지를 적용한 예(자료는 4.2절의 10점, 직접 계산). 왼쪽: $\ln\lambda=-7$이면 곡선이 점들을 대체로 따라가면서도 $\lambda=0$일 때보다 덜 출렁이고, 가운데: $\ln\lambda=0$이면 계수가 너무 눌려 과소적합입니다. 오른쪽: $\lambda$를 키울수록 훈련오차(아래쪽 곡선)는 늘고 검증오차(위쪽 곡선)는 내려갔다 올라가며, 빈 원이 검증오차가 최소인 $\ln\lambda$입니다 ($\ln\lambda=-7$, 검증오차 약 $0.39$, 규제 없을 때는 약 $0.47$). 슬라이드에서는 같은 방식의 그림에서 $\ln\lambda\approx-17$ 근처가 가장 좋았습니다(자료와 잡음이 달라 위치는 다릅니다).`);
    },
    // 4.3 unit balls |b1|^q + |b2|^q = 1
    lqball() {
      const ball = (q) => Array.from({ length: 401 }, (_, k) => { const t = (2 * Math.PI * k) / 400, c = Math.cos(t), s = Math.sin(t); return [Math.sign(c) * Math.pow(Math.abs(c), 2 / q), Math.sign(s) * Math.pow(Math.abs(s), 2 / q)]; });
      const panel = (ox, q) => ({ ox, w: 140, h: 150, x: [-1.4, 1.4], y: [-1.4, 1.4], title: 'q = ' + q, m: [22, 6, 8, 6], xt: [], yt: [], c: [{ pts: ball(q), c: 'ld' }] });
      return G2(560, 150, 'q에 따른 규제 영역', [panel(0, 0.5), panel(140, 1), panel(280, 2), panel(420, 4)],
        R`$\lvert\beta_1\rvert^q+\lvert\beta_2\rvert^q=1$의 모양입니다. $q<1$이면 축 위로 뾰족하게 파인 별 모양(볼록하지 않음), $q=1$은 마름모(라쏘), $q=2$는 원(릿지), $q=4$는 모서리가 둥근 네모입니다. 모서리가 뾰족할수록 해가 축 위에 걸려 계수가 정확히 0이 되기 쉽습니다.`);
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
