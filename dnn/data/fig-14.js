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
