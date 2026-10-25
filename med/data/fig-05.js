/* 05 밀도의 변환과 정보이론 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  const N = (m, s2) => (x) => Math.exp(-((x - m) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);
  const sg = (a) => 1 / (1 + Math.exp(-a));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2.4 the mode of a density moves under a nonlinear change of variables (Bishop Fig. 2.12)
    transform() {
      const px = N(6, 1), g = (y) => Math.log(y / (1 - y)) + 5; // x = g(y)
      const py = (y) => px(g(y)) / (y * (1 - y));                  // |dg/dy| = 1/(y(1−y))
      let ym = 0.5, best = 0; for (let k = 1; k < 2000; k++) { const y = k / 2000; if (py(y) > best) { best = py(y); ym = y; } }
      const yOfMode = sg(6 - 5);
      // histogram of transformed samples y = g⁻¹(x), x ~ N(6, 1): it follows p_y, not the naive substitution
      const r = MF.rng(21), NS = 20000, NB = 40, hist = Array(NB).fill(0);
      for (let n = 0; n < NS; n++) { const y = sg(6 + MF.normal(r) - 5); hist[Math.min(NB - 1, Math.floor(y * NB))]++; }
      const bars = (X, Y) => hist.map((c, i) => { const h = (c * NB) / NS / best; return FK.R(X(i / NB), Y(h), X(1 / NB) - X(0), Y(0) - Y(h), 'ldh'); }).join('');
      return G2(560, 230, '밀도의 최빈값은 대응점으로 옮겨가지 않는다', [
        { w: 300, h: 230, x: [0, 10], y: [0, 1.05], xl: 'x', title: 'y = g⁻¹(x) = σ(x − 5)와 pₓ(x)', m: [22, 10, 22, 48], xt: [[5, '5'], [6, '6'], [10, '10']], yt: [[yOfMode, 'g⁻¹(6)'], [1, '1']], vg: [6], hg: [yOfMode],
          c: [{ f: (x) => sg(x - 5), c: 'ld' }, { f: (x) => 0.9 * px(x) / px(6), c: 'rx' }],
          extra: (X, Y) => T(X(8.7), Y(0.92), 'g⁻¹', { c: 'lb' }) + T(X(7.6), Y(0.5), 'pₓ', { c: 'rl' }) },
        { w: 260, h: 230, ox: 300, x: [0, 1], y: [0, 1.1], xl: 'y', title: 'p_{y}(y) = pₓ(g(y)) |g′(y)|', m: [22, 10, 22, 16], xt: [[ym, ym.toFixed(2)], [yOfMode, yOfMode.toFixed(2)]], yt: [], vg: [ym, yOfMode],
          inner: (X, Y) => bars(X, Y) + MF.poly(X, Y, Array.from({ length: 400 }, (_, k) => { const y = (k + 0.5) / 400; return [y, px(g(y)) / px(6)]; }), 'dm ds') + MF.poly(X, Y, Array.from({ length: 400 }, (_, k) => { const y = (k + 0.5) / 400; return [y, py(y) / best]; }), 'rx'),
          extra: (X, Y) => T(X(0.2), Y(0.95), '야코비안 포함', { c: 'rl', a: 'start' }) + T(X(0.2), Y(0.83), '(점선: 단순 대입)', { a: 'start', s: 11 }) + T(X(0.2), Y(0.71), '(막대: 변환한 표본)', { a: 'start', s: 11 }) },
      ], R`$p_x=\N(6,1)$을 $x=g(y)=\ln\frac y{1-y}+5$로 바꿉니다. 단순 대입 $p_x(g(y))$(점선)이면 최빈값이 $g^{-1}(6)=\sigma(1)\approx0.73$으로 옮겨가지만, 야코비안 $\lvert g'(y)\rvert=\frac1{y(1-y)}$을 곱한 실제 밀도 $p_y$의 최빈값은 약 $${ym.toFixed(2)}$입니다. 막대는 $p_x$에서 뽑은 표본 2만 개를 하나하나 $y=g^{-1}(x)$로 옮겨 만든 히스토그램인데, 점선이 아니라 야코비안을 곱한 곡선과 겹칩니다. 밀도는 보통 함수와 달리 변수를 바꾸면 모양 자체가 바뀝니다.`);
    },
    // 2.4.1 a 2-D nonlinear transformation of a grid and of Gaussian samples (slide 31)
    flow2d() {
      const f = ([x1, x2]) => [x1 + Math.tanh(5 * x1), x2 + Math.tanh(5 * x2) + x1 ** 3 / 3];
      const r = MF.rng(6), pts = Array.from({ length: 260 }, () => [0.5 * MF.normal(r), 0.5 * MF.normal(r)]);
      const grid = (map) => (X, Y) => {
        let s = '';
        for (let k = -6; k <= 6; k++) {
          const a = k / 4;
          let d1 = '', d2 = '';
          for (let t = 0; t <= 60; t++) { const b = -1.5 + (3 * t) / 60; const p = map([a, b]), q = map([b, a]); d1 += `${t ? 'L' : 'M'}${FK.f1(X(p[0]))},${FK.f1(Y(p[1]))}`; d2 += `${t ? 'L' : 'M'}${FK.f1(X(q[0]))},${FK.f1(Y(q[1]))}`; }
          s += FK.P(d1, 'dm') + FK.P(d2, 'dm');
        }
        return s;
      };
      const id = (p) => p;
      const P = (map, lab, ox, lim) => ({ w: 280, h: 240, ox, x: [-lim, lim], y: [-lim, lim], title: lab, m: [22, 10, 10, 10], xt: [], yt: [], axes: false,
        inner: (X, Y) => grid(map)(X, Y) + MF.dots(X, Y, pts.map(map).filter((p) => Math.abs(p[0]) < lim && Math.abs(p[1]) < lim)) });
      return G2(560, 240, '2차원 비선형 변환', [P(id, 'x: 격자와 가우시안 표본', 0, 1.6), P(f, 'y₁ = x₁ + tanh 5x₁,  y₂ = x₂ + tanh 5x₂ + x₁³/3', 280, 2.6)],
        R`왼쪽의 곧은 격자와 가우시안 표본이 변환 뒤(오른쪽)에는 가운데가 벌어진 네 덩어리로 갈라집니다. 격자 칸의 넓이가 변한 비율이 $\lvert\det\mathbf J\rvert$이고, 칸이 늘어난 곳은 밀도가 그만큼 낮아집니다. 이런 가역 변환을 여러 번 쌓는 것이 정규화 흐름입니다.`);
    },
    // 2.4.1 the same map acting on the density itself (slide 31, middle column): p_y = p_x / |det ∂y/∂x|
    flowdens() {
      const s2 = 0.25, px = (a, b) => Math.exp(-(a * a + b * b) / (2 * s2)) / (2 * Math.PI * s2);
      const d = (u) => 1 + 5 * (1 - Math.tanh(5 * u) ** 2);            // d/du (u + tanh 5u)
      const inv = (v) => { let lo = -6, hi = 6; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (m + Math.tanh(5 * m) < v) lo = m; else hi = m; } return (lo + hi) / 2; };
      const py = (y1, y2) => { const x1 = inv(y1), x2 = inv(y2 - x1 ** 3 / 3); return px(x1, x2) / (d(x1) * d(x2)); };
      let top = 0; for (let i = 0; i <= 80; i++) for (let j = 0; j <= 80; j++) top = Math.max(top, py(-2.6 + (5.2 * i) / 80, -2.6 + (5.2 * j) / 80));
      const lv = [0.06, 0.25, 0.5, 0.8];
      const P = (f, mx, lab, ox, lim) => ({ w: 280, h: 240, ox, x: [-lim, lim], y: [-lim, lim], title: lab, m: [22, 10, 10, 10], xt: [], yt: [], axes: false,
        inner: (X, Y) => FK.R(X(-lim), Y(lim), X(lim) - X(-lim), Y(-lim) - Y(lim), 'dm') + MF.contour(f, [-lim, lim], [-lim, lim], lv.map((v) => v * mx), 70, 'rx')(X, Y) });
      return G2(560, 240, '같은 변환을 밀도에 적용하면', [P(px, px(0, 0), 'pₓ(x): 가우시안 밀도의 등고선', 0, 1.6), P(py, top, 'p_{y}(y) = pₓ(x) / |det(∂y/∂x)|', 280, 2.6)],
        R`왼쪽은 $\mathbf x\sim\N(\mathbf 0,\,0.25\mathbf I)$의 등고선(동심원), 오른쪽은 변환 뒤의 밀도입니다. $\partial y_i/\partial x_i=1+5\,\mathrm{sech}^2(5x_i)$는 원점에서 6까지 커지므로 원점 근처의 공간이 크게 늘어나고, 그만큼 밀도가 낮아져 가운데가 비고 네 귀퉁이에 봉우리가 생깁니다. 앞 그림에서 변환한 표본이 모인 네 덩어리와 같은 자리입니다. 슬라이드의 식 $p_{\mathbf y}=p_{\mathbf x}\lvert\det\mathbf J\rvert$에서 $\mathbf J=\partial\mathbf x/\partial\mathbf y$이므로 $\lvert\det\mathbf J\rvert=1/\lvert\det(\partial\mathbf y/\partial\mathbf x)\rvert$입니다.`);
    },
    // 2.5.1 entropy of a peaked and a broad histogram (slide 34)
    entropyhist() {
      const mk = (sd) => { const a = Array.from({ length: 30 }, (_, i) => Math.exp(-((i - 14.5) ** 2) / (2 * sd * sd))); const z = a.reduce((s, v) => s + v, 0); return a.map((v) => v / z); };
      const H = (p) => -p.reduce((s, v) => s + (v > 0 ? v * Math.log(v) : 0), 0);
      const a = mk(1.42), b = mk(5.45);
      const P = (p, ox) => ({ w: 280, h: 190, ox, x: [-0.5, 29.5], y: [0, 0.3], title: `H = ${H(p).toFixed(2)}`, m: [22, 10, 18, 30], xt: [], yt: [[0.25, '0.25']],
        extra: (X, Y) => p.map((v, i) => FK.R(X(i - 0.42), Y(v), X(0.84) - X(0), Y(0) - Y(v), 'ldh')).join('') });
      return G2(560, 190, '뾰족한 분포와 넓은 분포의 엔트로피', [P(a, 0), P(b, 280)],
        R`같은 30개 칸에 확률을 나눠 준 두 분포. 몇 칸에 몰린 분포는 엔트로피가 작고($\mathrm H=-\sum p\ln p$, 내트), 넓게 퍼진 분포는 큽니다. 30칸 균등분포가 최대 $\ln30\approx3.40$입니다.`);
    },
    // 2.5.3 binary entropy and differential entropy of a Gaussian
    entcurves() {
      const Hb = (p) => (p <= 0 || p >= 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)));
      const Hg = (v) => 0.5 * (1 + Math.log(2 * Math.PI * v));
      const v0 = 1 / (2 * Math.PI * Math.E);
      return G2(560, 210, '두 가지 엔트로피', [
        { w: 280, h: 210, x: [0, 1], y: [0, 1.1], xl: 'p', title: '베르누이 엔트로피 (비트)', m: [22, 10, 22, 28], xt: [[0, '0'], [0.5, '½'], [1, '1']], yt: [[1, '1']], c: [{ f: Hb, c: 'ld' }] },
        { w: 280, h: 210, ox: 280, x: [0, 1], y: [-1.2, 1.3], xl: 'σ²', title: '가우시안의 미분 엔트로피 (내트)', m: [22, 10, 22, 28], xt: [[v0, '1/2πe'], [1, '1']], yt: [[1, '1'], [-1, '−1']], vg: [v0], c: [{ f: Hg, c: 'rx', a: 0.003 }] },
      ], R`왼쪽: 동전의 앞면 확률 $p$에 따른 $\mathrm H=-p\log_2p-(1-p)\log_2(1-p)$. 공정한 동전($p=\tfrac12$)이 1비트로 최대이고, 결과가 확실하면 0입니다. 오른쪽: $\mathrm H=\frac12\{1+\ln(2\pi\sigma^2)\}$는 분산이 클수록 커지며, $\sigma^2\lt\frac1{2\pi e}\approx0.0585$이면 **음수**입니다.`);
    },
    // 2.5.5 convex function and chord: Jensen's inequality (slide 37)
    jensen() {
      const f = (x) => 0.18 * (x - 2.2) ** 2 + 0.4;
      const a = 0.6, b = 4.4, lam = 0.4, xl = lam * a + (1 - lam) * b;
      return G({ w: 560, h: 230, x: [0, 5], y: [0, 2], xl: 'x', label: '볼록함수와 현', m: [14, 16, 22, 20], xt: [[a, 'a'], [xl, 'x_λ'], [b, 'b']], yt: [],
        c: [{ f, c: 'rx' }, { pts: [[a, f(a)], [b, f(b)]], c: 'ld' }],
        inner: (X, Y) => FK.L(X(xl), Y(0), X(xl), Y(lam * f(a) + (1 - lam) * f(b)), 'dm ds') + FK.L(X(a), Y(0), X(a), Y(f(a)), 'dm ds') + FK.L(X(b), Y(0), X(b), Y(f(b)), 'dm ds') + FK.dot(X, Y, xl, f(xl)) + FK.dot(X, Y, xl, lam * f(a) + (1 - lam) * f(b), true),
        extra: (X, Y) => T(X(xl) + 8, Y(f(xl)) + 14, 'f(x_λ)', { a: 'start', c: 'rl' }) + T(X(xl) + 8, Y(lam * f(a) + (1 - lam) * f(b)) - 8, 'λf(a) + (1−λ)f(b)', { a: 'start', c: 'lb' }) + T(X(4.7), Y(f(4.7)) - 6, 'f(x)', { c: 'rl' }),
        cap: R`$x_\lambda=\lambda a+(1-\lambda)b$에서 곡선의 높이 $f(x_\lambda)$(채운 점)는 현의 높이 $\lambda f(a)+(1-\lambda)f(b)$(빈 점)보다 낮습니다. 볼록함수의 정의이자 옌센 부등식 $f(\E[x])\le\E[f(x)]$의 두 점 버전입니다. $-\ln x$가 볼록이라 $\KL\ge0$이 나옵니다.` });
    },
    // 2.5.5 KL divergence is not symmetric
    klasym() {
      const p = (x) => 0.5 * N(-1.5, 0.3)(x) + 0.5 * N(1.5, 0.3)(x);
      const grid = Array.from({ length: 2001 }, (_, k) => -6 + (12 * k) / 2000), dx = 12 / 2000;
      const KL = (a, b) => grid.reduce((s, x) => { const u = a(x); return u > 1e-12 ? s + u * Math.log(u / Math.max(b(x), 1e-300)) * dx : s; }, 0);
      // q1 minimizes KL(p||q) among Gaussians: moment matching (mean 0, variance 0.3 + 2.25); q2 sits on one mode
      const q1 = N(0, 2.55), q2 = N(1.5, 0.3);
      const k1 = [KL(p, q1), KL(q1, p)], k2 = [KL(p, q2), KL(q2, p)];
      const P = (q, t, ox, k) => ({ w: 280, h: 200, ox, x: [-4, 4], y: [0, 0.8], title: t, m: [22, 10, 20, 12], xt: [[-1.5, '−1.5'], [1.5, '1.5']], yt: [], c: [{ f: p, c: 'ld' }, { f: q, c: 'rx' }],
        extra: (X, Y) => T(X(-3.9), Y(0.72), `KL(p‖q) = ${k[0].toFixed(2)}`, { a: 'start', s: 11 }) + T(X(-3.9), Y(0.62), `KL(q‖p) = ${k[1].toFixed(2)}`, { a: 'start', s: 11 }) });
      return G2(560, 200, 'KL 발산의 비대칭성', [P(q1, 'q: 두 봉우리를 덮는 가우시안', 0, k1), P(q2, 'q: 한 봉우리에 맞춘 가우시안', 280, k2)],
        R`봉우리가 둘인 $p$(가는 곡선)를 가우시안 $q$로 근사합니다. $\KL(p\Vert q)$는 $p$가 큰 곳에서 $q$가 작으면 크게 벌하므로 두 봉우리를 모두 덮는 넓은 $q$를 선호하고, $\KL(q\Vert p)$는 $q$가 큰 곳에서 $p$가 작으면 벌하므로 한 봉우리에 맞춘 좁은 $q$를 선호합니다. 두 값이 다르므로 KL은 거리가 아닙니다.`);
    },
  });
})();
