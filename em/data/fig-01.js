/* 01 1계 상미분방정식 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, legend, PI } = window.EMG;
  const { L, T, f1 } = window.FK;
  // short slope segments of y' = f(x, y) on a grid, drawn in pixel space so every segment has the same length
  const field = (f, xs, ys, len = 9) => (X, Y) => {
    const sx = X(1) - X(0), sy = Y(0) - Y(1);
    let s = '';
    xs.forEach((x) => ys.forEach((y) => {
      const m = f(x, y), dx = sx, dy = sy * m, n = Math.hypot(dx, dy) || 1;
      const ux = (dx / n) * len / 2, uy = (dy / n) * len / 2;
      s += L(X(x) - ux, Y(y) + uy, X(x) + ux, Y(y) - uy, 'dm');
    }));
    return s;
  };
  const grid = (a, b, h) => { const r = []; for (let v = a; v <= b + 1e-9; v += h) r.push(+v.toFixed(6)); return r; };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 1.1 a family of solution curves
    f01fam() {
      const cs = [-3, -2, -1, 0, 1, 2, 3, 4];
      return G({
        x: [-2 * PI - 0.2, 2 * PI + 0.2], y: [-4.4, 5.4], h: 230,
        xt: [[-2 * PI, '−2π'], [-PI, '−π'], [PI, 'π'], [2 * PI, '2π']], yt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']], xl: 'x', yl: 'y',
        c: cs.map((c) => ({ f: (x) => Math.sin(x) + c, c: c === 0 ? 'ld' : 'dm' })),
        t: [[2 * PI + 0.1, 4.25, 'c = 4', { a: 'end' }], [2 * PI + 0.1, 0.25, 'c = 0', { a: 'end', c: 'em' }], [2 * PI + 0.1, -2.75, 'c = −3', { a: 'end' }]],
        label: 'y′ = cos x의 해곡선족',
        cap: R`$y'=\cos x$의 일반해 $y=\sin x+c$ ($c=-3,\dots,4$). 상수 $c$ 하나에 곡선 하나가 대응하고, 곡선들은 위아래로 평행이동한 관계입니다.`,
      });
    },
    // 1.1 exponential growth and decay
    f01exp() {
      const cs = [0.5, 1, 1.5, 2];
      return G2(560, 200, '지수적 성장과 감쇠', [
        { w: 275, h: 200, x: [0, 14], y: [0, 36], title: '(a) y′ = 0.2y (성장)', xt: [[5, '5'], [10, '10']], yt: [[10, '10'], [20, '20'], [30, '30']], xl: 't', m: [20, 10, 22, 30],
          c: cs.map((c) => ({ f: (t) => c * Math.exp(0.2 * t), c: 'ld' })) },
        { ox: 285, w: 275, h: 200, x: [0, 14], y: [0, 2.3], title: '(b) y′ = −0.2y (감쇠)', xt: [[5, '5'], [10, '10']], yt: [[0.5, '0.5'], [1, '1'], [1.5, '1.5'], [2, '2']], xl: 't', m: [20, 10, 22, 30],
          c: cs.map((c) => ({ f: (t) => c * Math.exp(-0.2 * t), c: 'rx' })) },
      ], R`$y=ce^{0.2t}$와 $y=ce^{-0.2t}$ ($c=0.5,1,1.5,2$). 부호 하나로 폭발적 증가와 0으로의 감쇠가 갈립니다.`);
    },
    // 1.2 direction field of y' = x + y with solutions and Euler steps
    f01dir() {
      const f = (x, y) => x + y;
      const sol = (c) => (x) => c * Math.exp(x) - x - 1;
      const eul = [[0, 0]];
      for (let k = 0; k < 5; k++) { const [x, y] = eul[eul.length - 1]; eul.push([x + 0.2, y + 0.2 * (x + y)]); }
      return G({
        x: [-2, 1.2], y: [-2, 2], h: 300,
        xt: [[-2, '−2'], [-1, '−1'], [1, '1']], yt: [[-2, '−2'], [-1, '−1'], [1, '1'], [2, '2']], xl: 'x', yl: 'y',
        inner: field(f, grid(-1.9, 1.1, 0.2), grid(-1.9, 1.9, 0.2), 8),
        c: [{ f: sol(2), c: 'ld' }, { f: sol(1), c: 'ld' }, { f: sol(0), c: 'ld' }, { pts: eul, c: 'rx' }],
        extra: (X, Y) => eul.map(([x, y]) => dot(X, Y, x, y)).join('') + legend(X(-1.95), Y(1.8), [['ld', '해곡선 y = ceˣ − x − 1'], ['rx', '오일러 방법 (h = 0.2)']]),
        label: 'y′ = x + y의 방향장, 해곡선, 오일러 근사',
        cap: R`$y'=x+y$의 방향장과 $(0,1)$, $(0,0)$, $(0,-1)$을 지나는 해곡선. $(0,-1)$을 지나는 해는 직선 $y=-x-1$입니다. 주황 꺾은선은 $(0,0)$에서 출발한 오일러 방법($h=0.2$)으로, 해곡선이 아래로 볼록하기 때문에 계속 아래쪽으로 벗어납니다.`,
      });
    },
    // 1.5 indoor temperature following a daily outdoor cycle
    f01temp() {
      const k = 0.2, w = PI / 12;
      const TA = (t) => 10 + 6 * Math.cos(w * t);
      const ss = (t) => 10 + (6 * k / (k * k + w * w)) * (k * Math.cos(w * t) + w * Math.sin(w * t));
      const c = 20 - ss(0);
      const Tn = (t) => ss(t) + c * Math.exp(-k * t);
      return G({
        x: [0, 72], y: [2, 21], h: 230, ax0: 2,
        xt: [[12, '12'], [24, '24'], [36, '36'], [48, '48'], [60, '60'], [72, '72 h']], yt: [[5, '5'], [10, '10'], [15, '15'], [20, '20']], yl: 'T (°C)',
        c: [{ f: TA, c: 'dm' }, { f: Tn, c: 'ld', n: 400 }, { f: ss, c: 'rx ds', n: 400 }],
        extra: (X, Y) => legend(X(30), Y(20), [['dm', '바깥 온도 T_{A}(t)'], ['ld', '실내 온도 T(t), T(0) = 20'], ['rx ds', '정상상태 부분']]),
        label: '하루 주기의 바깥 온도와 실내 온도',
        cap: R`$T'=0.2\,(T_A-T)$, $T_A=10+6\cos\frac{\pi t}{12}$. 처음 하루쯤은 초기온도의 영향(과도 상태)이 남지만 곧 정상상태(점선)를 따라갑니다. 실내 온도는 바깥보다 진폭이 작고(약 $0.61$배) 약 3.5시간 늦게 최고점에 이릅니다.`,
      });
    },
    // 1.5 logistic curves and the phase line
    f01logi() {
      const A = 1, B = 0.25; // A/B = 4
      const y = (y0) => (t) => 1 / (B / A + (1 / y0 - B / A) * Math.exp(-A * t));
      const y0s = [0.2, 0.8, 2, 6, 8];
      return G2(560, 230, '로지스틱 곡선과 상선', [
        { w: 440, h: 230, x: [0, 8], y: [0, 8.6], xt: [[2, '2'], [4, '4'], [6, '6'], [8, '8']], yt: [[4, '4'], [8, '8']], xl: 't', yl: 'y', hg: [4], t: [[7.9, 4.3, 'y = A/B', { a: 'end' }]],
          c: y0s.map((v) => ({ f: y(v), c: v > 4 ? 'rx' : 'ld' })) },
        { ox: 450, w: 110, h: 230, x: [-1, 1], y: [0, 8.6], axes: false, title: '상선', m: [14, 10, 24, 10],
          extra: (X, Y) => {
            const A2 = window.FK.A;
            let s = L(X(0), Y(0.05), X(0), Y(8.5), 'ax');
            s += A2(X(0), Y(1.2), X(0), Y(3.2), 'ld', 8) + A2(X(0), Y(7.6), X(0), Y(4.8), 'rx', 8);
            s += `<circle class="dotf" cx="${f1(X(0))}" cy="${f1(Y(4))}" r="4"/><circle class="doto" cx="${f1(X(0))}" cy="${f1(Y(0.1))}" r="4"/>`;
            s += T(X(0) + 10, Y(4) + 4, '안정', { a: 'start', c: 'em' }) + T(X(0) + 10, Y(0.1) + 2, '불안정', { a: 'start' });
            return s;
          } },
      ], R`$y'=y-0.25y^2$ ($A/B=4$)의 해. 처음 인구가 4보다 작으면 S자로 늘고(파란 선), 크면 줄어서(주황) 모두 $A/B=4$로 갑니다. 오른쪽 상선은 $f(y)$의 부호만으로 그린 요약입니다.`);
    },
    // 1.6 ellipses and their orthogonal trajectories
    f01orth() {
      const els = [0.25, 0.75, 1.5, 2.5];
      const ell = (c) => { const p = []; for (let k = 0; k <= 120; k++) { const t = (2 * PI * k) / 120; p.push([2 * Math.sqrt(c) * Math.cos(t), Math.sqrt(c) * Math.sin(t)]); } return p; };
      const qs = [-0.6, -0.15, -0.03, 0.03, 0.15, 0.6];
      return G({
        x: [-3.6, 3.6], y: [-1.9, 1.9], h: 250,
        xt: [[-3, '−3'], [-2, '−2'], [-1, '−1'], [1, '1'], [2, '2'], [3, '3']], yt: [[-1, '−1'], [1, '1']], xl: 'x', yl: 'y',
        c: els.map((c) => ({ pts: ell(c), c: 'ld' })).concat(qs.map((q) => ({ f: (x) => q * x ** 4, c: 'rx' }))).concat([{ pts: [[0, -1.9], [0, 1.9]], c: 'rx' }]),
        label: '타원족과 그 직교 궤적',
        cap: R`타원족 $\frac{x^2}{4}+y^2=c$(파란 선)와 직교 궤적 $y=c^*x^4$(주황, $x=0$ 포함). 두 곡선족은 만나는 모든 점에서 직각으로 교차합니다.`,
      });
    },
    // 1.7 the rectangle R and the slope cone of the existence theorem
    f01rect() {
      const panel = (ox, a, K, title) => ({
        ox, w: 275, h: 210, x: [-2.4, 2.4], y: [-1.5, 1.5], axes: false, title, m: [20, 8, 12, 8],
        extra: (X, Y) => {
          const b = 1, al = Math.min(a, b / K);
          let s = `<rect class="rg" x="${f1(X(-a))}" y="${f1(Y(b))}" width="${f1(X(a) - X(-a))}" height="${f1(Y(-b) - Y(b))}"/>`;
          s += `<path class="fl2" d="M${f1(X(0))},${f1(Y(0))}L${f1(X(al))},${f1(Y(K * al))}L${f1(X(al))},${f1(Y(-K * al))}ZM${f1(X(0))},${f1(Y(0))}L${f1(X(-al))},${f1(Y(K * al))}L${f1(X(-al))},${f1(Y(-K * al))}Z"/>`;
          s += L(X(-Math.min(2.3, 1.45 / K)), Y(-K * Math.min(2.3, 1.45 / K)), X(Math.min(2.3, 1.45 / K)), Y(K * Math.min(2.3, 1.45 / K)), 'rx') + L(X(-Math.min(2.3, 1.45 / K)), Y(K * Math.min(2.3, 1.45 / K)), X(Math.min(2.3, 1.45 / K)), Y(-K * Math.min(2.3, 1.45 / K)), 'rx');
          s += L(X(-al), Y(-1.35), X(-al), Y(1.35), 'dm ds') + L(X(al), Y(-1.35), X(al), Y(1.35), 'dm ds');
          s += dot(X, Y, 0, 0) + T(X(0), Y(0) + 16, '(x₀, y₀)') + T(X(a) - 4, Y(b) + 14, 'R', { a: 'end', c: 'em' });
          s += T(X(al), Y(-1.45) + 6, 'x₀ + α') + T(X(-al), Y(-1.45) + 6, 'x₀ − α');
          return s;
        },
      });
      return G2(560, 210, '존재 정리의 직사각형과 기울기 쐐기', [panel(0, 1.2, 0.6, '(a) b/K ≥ a → α = a'), panel(285, 2, 1.6, '(b) b/K < a → α = b/K')],
        R`해곡선의 기울기는 $\pm K$ 사이이므로 $(x_0,y_0)$에서 출발한 해곡선은 기울기 $\pm K$인 두 직선(주황) 사이의 쐐기에 갇힙니다. (a) 쐐기가 직사각형 $R$의 옆변에 먼저 닿으면 $\alpha=a$, (b) 위아래 변에 먼저 닿으면 $\alpha=b/K$입니다. 그 밖에서는 해가 $R$을 벗어날 수 있어 정리가 아무것도 말해 주지 않습니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
