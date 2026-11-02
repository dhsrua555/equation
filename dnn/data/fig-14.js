/* 14 실전 최적화: 모멘텀과 적응형 학습률 — 본문 그림. 모두 수업 필기의 함수 f(x) = ½x₁² + 50x₂²에서 (−5, −1)로 출발합니다. */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  const grad = (p) => [p[0], 100 * p[1]];
  const ell = (c) => Array.from({ length: 161 }, (_, k) => { const t = (2 * Math.PI * k) / 160; return [Math.sqrt(2 * c) * Math.cos(t), Math.sqrt(2 * c / 100) * Math.sin(t)]; });
  const levels = [0.5, 2, 5, 9, 14, 25];
  const path = (T, step) => { let p = [-5, -1]; const st = {}; const out = [p.slice()]; for (let t = 1; t <= T; t++) { p = step(p, grad(p), st, t); out.push(p.slice()); } return out; };
  const gd = (a) => (p, g) => [p[0] - a * g[0], p[1] - a * g[1]];
  const hb = (a, rho) => (p, g, s) => { s.v = s.v || [0, 0]; s.v = [rho * s.v[0] - a * g[0], rho * s.v[1] - a * g[1]]; return [p[0] + s.v[0], p[1] + s.v[1]]; };
  const ada = (a) => (p, g, s) => { s.r = s.r || [0, 0]; s.r = [s.r[0] + g[0] * g[0], s.r[1] + g[1] * g[1]]; return [p[0] - (a * g[0]) / (Math.sqrt(s.r[0]) + 1e-7), p[1] - (a * g[1]) / (Math.sqrt(s.r[1]) + 1e-7)]; };
  const rms = (a, d) => (p, g, s) => { s.r = s.r || [0, 0]; s.r = [d * s.r[0] + (1 - d) * g[0] * g[0], d * s.r[1] + (1 - d) * g[1] * g[1]]; return [p[0] - (a * g[0]) / (Math.sqrt(s.r[0]) + 1e-7), p[1] - (a * g[1]) / (Math.sqrt(s.r[1]) + 1e-7)]; };
  const adam = (a, b1, b2) => (p, g, s, t) => {
    s.m = s.m || [0, 0]; s.v = s.v || [0, 0];
    s.m = [b1 * s.m[0] + (1 - b1) * g[0], b1 * s.m[1] + (1 - b1) * g[1]];
    s.v = [b2 * s.v[0] + (1 - b2) * g[0] * g[0], b2 * s.v[1] + (1 - b2) * g[1] * g[1]];
    const mh = s.m.map((v) => v / (1 - Math.pow(b1, t))), vh = s.v.map((v) => v / (1 - Math.pow(b2, t)));
    return [p[0] - (a * mh[0]) / (Math.sqrt(vh[0]) + 1e-8), p[1] - (a * mh[1]) / (Math.sqrt(vh[1]) + 1e-8)];
  };
  const box = { x: [-5.6, 1.0], y: [-1.25, 1.25], xl: 'x₁', yl: 'x₂', xt: [[-4, '−4'], [-2, '−2'], [0, '0']], yt: [[-1, '−1'], [1, '1']] };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 14.1–14.2 GD zigzags; heavy ball momentum damps the zigzag and speeds up the flat direction
    illcond() {
      const pg = path(40, gd(0.019)), pm = path(40, hb(0.005, 0.9));
      const panel = (ox, pts, title, n) => Object.assign({ ox, w: 280, h: 230, title, m: [22, 8, 20, 26] }, box, {
        c: levels.map((c) => ({ pts: ell(c), c: 'dm' })).concat([{ pts, c: 'ld' }]),
        extra: (X, Y) => pts.slice(0, n).map((p) => dot(X, Y, p[0], p[1])).join('') + dot(X, Y, 0, 0, true) });
      return G2(560, 230, '나쁜 조건수와 모멘텀', [panel(0, pg, '(a) GD, α = 0.019 (40걸음)', 8), panel(280, pm, '(b) 모멘텀, α = 0.005, ρ = 0.9', 8)],
        R`수업 필기의 $f(x_1,x_2)=\tfrac12x_1^2+\tfrac{100}2x_2^2$ (헤시안 $\diag(1,100)$, 조건수 100). (a) GD는 가파른 $x_2$ 방향으로 좌우로 튀면서($x_2$: $-1\to0.9\to-0.81\to\cdots$) 완만한 $x_1$ 방향으로는 매 걸음 $1.9\%$씩만 가서, 40걸음 뒤에도 $x_1\approx-2.3$입니다. (b) 모멘텀은 학습률이 GD의 4분의 1인데도, 가파른 $x_2$ 방향은 좌우로 튀지 않고 부드러운 물결로 줄어들며, 완만한 $x_1$ 방향은 같은 부호의 기울기가 속도에 쌓여(유효 학습률 $\alpha/(1-\rho)=0.05$) 40걸음 뒤 $x_1\approx-0.3$까지 옵니다. 빈 원이 최솟점입니다.`);
    },
    // 14.2 momentum vs Nesterov as vectors (slide 6)
    nesterov() {
      const o = [70, 175], v = [95, -115], g = [110, 0];
      const panel = (ox, nest) => {
        const P = [ox + o[0], o[1]], V = [P[0] + v[0], P[1] + v[1]];
        const G0 = nest ? V : P, Gt = [G0[0] + g[0] * (nest ? 0.75 : 1), G0[1] + (nest ? 22 : 0)];
        const S = nest ? Gt : [P[0] + v[0] + g[0], P[1] + v[1]];
        return FK.A(P[0], P[1], V[0], V[1], 'ld', 9) + FK.A(G0[0], G0[1], Gt[0], Gt[1], 'rx', 9) + FK.A(P[0], P[1], S[0], S[1], 'vl', 9)
          + (nest ? '' : FK.L(V[0], V[1], S[0], S[1], 'dm ds') + FK.L(Gt[0], Gt[1], S[0], S[1], 'dm ds'))
          + FK.C(P[0], P[1], 5, 'nd') + FK.T(ox + 140, 22, nest ? '네스테로프 모멘텀' : '모멘텀', { c: 'em' })
          + FK.T(P[0] + v[0] / 2 - 8, P[1] + v[1] / 2, '속도 ρv', { a: 'end', c: 'lb' })
          + FK.T((G0[0] + Gt[0]) / 2, (nest ? Gt[1] + 18 : G0[1] + 18), nest ? '−α∇f(x + ρv)' : '−α∇f(x)', { c: 'rl' })
          + FK.T(S[0] + 6, S[1] - 6, '실제 걸음', { a: 'start', c: 'em' });
      };
      return FK.fig(560, 210, '모멘텀과 네스테로프 모멘텀', panel(0, false) + panel(280, true),
        R`(왼쪽) 모멘텀은 **지금 위치**의 기울기와 속도를 더해 걸음을 정합니다. (오른쪽) 네스테로프는 속도만큼 먼저 가 본 **앞 지점** $x+\rho v$에서 기울기를 재어 속도에 더합니다(“미리 내다보기”). 앞 지점에서 기울기가 이미 방향을 바꿨다면 걸음을 일찍 줄여 지나침을 막습니다.`);
    },
    // 14.3–14.4 adaptive methods move both coordinates by about the same amount
    adaptive() {
      const pg = path(40, gd(0.019)), pa = path(40, ada(0.5)), pr = path(40, rms(0.1, 0.9)), pd = path(40, adam(0.15, 0.9, 0.999));
      return G(Object.assign({ w: 560, h: 250, label: '적응형 학습률 방법의 경로', m: [10, 150, 22, 26] }, box, {
        c: levels.map((c) => ({ pts: ell(c), c: 'dm' })).concat([{ pts: pg, c: 'dm ds' }, { pts: pa, c: 'ld' }, { pts: pr, c: 'vl ds' }, { pts: pd, c: 'rx' }]),
        extra: (X, Y) => dot(X, Y, -5, -1) + dot(X, Y, 0, 0, true) + legend(X(1.0) + 14, Y(1.05), [['dm ds', 'GD (α = 0.019)'], ['ld', 'AdaGrad (α = 0.5)'], ['vl ds', 'RMSProp (α = 0.1)'], ['rx', 'Adam (α = 0.15)']]),
        cap: R`같은 출발점에서 40걸음. 적응형 방법은 좌표마다 “지금까지 기울기 크기”로 나누므로 첫걸음에서 두 좌표가 거의 같은 거리($\approx\alpha$)를 움직여 대각선으로 출발하고, GD처럼 가파른 $x_2$ 방향으로 좌우로 튀지 않습니다. AdaGrad와 RMSProp은 거의 같은 길로 40걸음 뒤 $x_1\approx-1$까지 옵니다. Adam은 1차 모멘트(모멘텀) 때문에 $x_2$ 방향으로 한 번 부드럽게 출렁이지만 더 멀리 가서 $x_1\approx-0.27$에 이릅니다. GD는 여전히 $x_1\approx-2.3$.` }));
    },
  });
})();

/* 14 보충 그림: 슬라이드 3의 세 가지 어려움, 필기의 1차원 네스테로프 예. */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const poly = (f, x0, x1, X, Y, n = 60) => 'M' + Array.from({ length: n + 1 }, (_, k) => { const x = x0 + ((x1 - x0) * k) / n; return X(x).toFixed(1) + ',' + Y(f(x)).toFixed(1); }).join('L');

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 14.1 slide 3: local minimum, saddle point, poor conditioning
    landscape() {
      let b = '';
      // (a) local minimum: a shallow dip next to a deeper valley; the ball sits in the shallow one
      const f1 = (x) => 0.9 * Math.pow(x * x - 1, 2) + 0.25 * x;
      const X1 = (x) => 20 + (x + 1.6) * 52, Y1 = (y) => 150 - y * 34;
      b += FK.P(poly(f1, -1.6, 1.6, X1, Y1), 'ld') + FK.C(X1(0.95), Y1(f1(0.95)) - 6, 5, 'nd')
        + FK.T(100, 20, '(a) 국소 최소', { c: 'em' }) + FK.T(X1(-1.0), 178, '더 깊은 골짜기', { s: 11 }) + FK.T(X1(0.95), 178, '갇힌 곳', { s: 11 });
      // (b) saddle: slice along one axis is a hill, slice along the other a valley
      const ox = 200;
      const X2 = (x) => ox + 10 + (x + 1.5) * 52, Y2 = (y) => 110 - y * 30;
      b += FK.P(poly((x) => 0.35 * x * x, -1.5, 1.5, X2, Y2), 'ld') + FK.P(poly((x) => -0.35 * x * x + 0.0, -1.5, 1.5, X2, (y) => 110 - y * 30 + 0), 'rx')
        + FK.C(X2(0), Y2(0) - 6, 5, 'nd') + FK.T(ox + 100, 20, '(b) 안장점', { c: 'em' })
        + FK.T(ox + 100, 168, '자주색 선: 오르막', { s: 11, c: 'lb' }) + FK.T(ox + 100, 184, '초록 선: 내리막 · 기울기 0', { s: 11, c: 'rl' });
      // (c) poor conditioning: elongated contours and a zigzag path
      const ox3 = 400, cx = ox3 + 90, cy = 100;
      for (const k of [0.5, 0.8, 1.1]) b += `<ellipse class="dm" cx="${cx}" cy="${cy}" rx="${(80 * k).toFixed(1)}" ry="${(22 * k).toFixed(1)}"/>`;
      let d = 'M' + (cx - 78) + ',' + (cy + 12);
      for (let k = 1; k <= 8; k++) d += 'L' + (cx - 78 + k * 9.5) + ',' + (cy + (k % 2 ? -12 : 12) * (1 - k / 10));
      b += FK.P(d, 'rx') + FK.C(cx, cy, 3, 'nd') + FK.T(ox3 + 90, 20, '(c) 나쁜 조건수', { c: 'em' })
        + FK.T(ox3 + 90, 168, '가파른 쪽으로 튀고', { s: 11 }) + FK.T(ox3 + 90, 184, '완만한 쪽은 느림', { s: 11 });
      return FK.fig(600, 200, 'GD가 어려워하는 세 곳', b,
        R`슬라이드 3의 세 그림을 다시 그린 개념도입니다(수치는 보기용). (a) 기울기가 0이지만 최소가 아닌 얕은 골짜기에 갇힌 국소 최소. (b) 한 방향으로는 올라가고 다른 방향으로는 내려가는 안장점: 기울기가 0이어서 GD가 거의 멈춥니다. (c) 등고선이 길쭉한 타원(조건수가 큼)이면 GD는 가파른 쪽으로 좌우로 튀며 완만한 쪽으로 느리게 갑니다. 모멘텀은 이 세 곳 모두에서 속도로 밀고 나가도록 돕습니다.`);
    },
    // 14.2 handwritten 1-D Nesterov example: f = x^2/2, x_t = 1, v_t = -2, rho = 0.9, alpha = 0.1
    nest1d() {
      const X = (x) => 280 + x * 120, Y = (y) => 120 - y * 90;
      let b = FK.P(poly((x) => x * x / 2, -1.25, 1.25, X, Y, 80), 'dm') + FK.L(30, 120, 530, 120, 'dm ds')
        + FK.T(X(0), 138, '최솟점 0', { s: 11 });
      const pt = (x, lab, c, dy, o = {}) => FK.C(X(x), Y(x * x / 2), 5, c) + FK.T(X(x) + (o.dx || 0), Y(x * x / 2) + dy, lab, Object.assign({ s: 11, c: 'em' }, o.a ? { a: o.a } : {}));
      b += pt(1, 'x_t = 1', 'nd', -10, { dx: -10, a: 'end' }) + pt(-0.8, 'y_t = −0.8', 'sp', -10, { dx: 12, a: 'start' })
        + FK.C(X(-0.9), 120, 4, 'nd') + FK.C(X(-0.72), 120, 4, 'sp')
        + FK.T(X(-0.9) - 8, 150, '모멘텀: −0.9', { s: 11, c: 'rl', a: 'end' }) + FK.T(X(-0.72) + 8, 150, '네스테로프: −0.72', { s: 11, c: 'lb', a: 'start' })
        + FK.A(X(1), 178, X(-0.8) + 4, 178, 'ld', 8) + FK.T(X(0.1), 196, 'ρv_t = −1.8', { s: 11, c: 'lb' });
      return FK.fig(560, 208, '1차원 예: 모멘텀과 네스테로프', b,
        R`$f(x)=x^2/2$, $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$(수업 필기의 값). 속도 $\rho v_t=-1.8$만큼 가면 앞 지점 $y_t=-0.8$에 닿습니다. 모멘텀은 지나온 $x_t=1$의 기울기 $f'(1)=1$로 $-0.1$ 더 밀어 $-0.9$에 이르고, 네스테로프는 앞 지점의 기울기 $f'(-0.8)=-0.8$로 $+0.08$ 되돌려 $-0.72$에 이릅니다. 최솟점 0에 더 가까운 쪽은 네스테로프입니다.`);
    },
  });
})();
