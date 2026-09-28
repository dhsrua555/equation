/* 03 연립 ODE와 상평면 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, legend, dot, PI } = window.EMG;
  const FK = window.FK;
  const f1 = FK.f1;
  // RK4 trajectory of y' = f(y) from y0, n steps of size h, stopped when it leaves the box |y| < lim
  function traj(f, y0, h, n, lim) {
    const pts = [y0.slice()];
    let y = y0.slice();
    for (let k = 0; k < n; k++) {
      const a = f(y), b = f([y[0] + (h / 2) * a[0], y[1] + (h / 2) * a[1]]), c = f([y[0] + (h / 2) * b[0], y[1] + (h / 2) * b[1]]), d = f([y[0] + h * c[0], y[1] + h * c[1]]);
      y = [y[0] + (h / 6) * (a[0] + 2 * b[0] + 2 * c[0] + d[0]), y[1] + (h / 6) * (a[1] + 2 * b[1] + 2 * c[1] + d[1])];
      if (!isFinite(y[0]) || !isFinite(y[1]) || Math.abs(y[0]) > lim[0] || Math.abs(y[1]) > lim[1]) { pts.push(y); break; }
      pts.push(y);
    }
    return pts;
  }
  // small arrowhead on a trajectory at index i (pixel space)
  function arrow(X, Y, p, i, c = 'ld') {
    if (i + 1 >= p.length) return '';
    const x1 = X(p[i][0]), y1 = Y(p[i][1]), x2 = X(p[i + 1][0]), y2 = Y(p[i + 1][1]);
    const d = Math.hypot(x2 - x1, y2 - y1);
    if (d < 1e-6) return '';
    const ux = (x2 - x1) / d, uy = (y2 - y1) / d;
    return FK.A(x1 - ux * 4, y1 - uy * 4, x1 + ux * 3, y1 + uy * 3, c, 7);
  }
  // phase portrait panel: f, starting points, forward/backward steps, half-widths
  function phase(o) {
    const lim = [o.R * 1.5, (o.Ry || o.R) * 1.5];
    const paths = [];
    o.starts.forEach((s) => {
      const fw = o.fw === false ? [s] : traj(o.f, s, o.h || 0.02, o.n || 600, lim);
      const bw = o.bw === false ? [s] : traj(o.f, s, -(o.h || 0.02), o.nb || o.n || 600, lim);
      paths.push({ pts: bw.slice().reverse().concat(fw.slice(1)), mid: bw.length - 1 + Math.min(o.am || 12, fw.length - 2) });
    });
    return Object.assign({
      x: [-o.R, o.R], y: [-(o.Ry || o.R), o.Ry || o.R], xt: [], yt: [], xl: o.xl || 'y₁', yl: o.yl || 'y₂', m: [20, 8, 14, 8],
      inner: (X, Y) => paths.map((p) => `<path class="${o.c || 'ld'}" d="${p.pts.map((q, k) => (k ? 'L' : 'M') + f1(X(q[0])) + ',' + f1(Y(q[1]))).join('')}"/>` + arrow(X, Y, p.pts, Math.max(0, p.mid), o.c || 'ld')).join('') + (o.innerExtra ? o.innerExtra(X, Y) : ''),
      extra: o.extra,
    }, o.panel);
  }
  const lin = (a, b, c, d) => (y) => [a * y[0] + b * y[1], c * y[0] + d * y[1]];
  const ring = (r, n, off = 0) => Array.from({ length: n }, (_, k) => [r * Math.cos(off + (2 * PI * k) / n), r * Math.sin(off + (2 * PI * k) / n)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 4.1 the two-loop network: currents over time and the trajectory in the phase plane
    f03net() {
      const I1 = (t) => 6 * Math.exp(-2 * t) - 8 * Math.exp(-3 * t) + 2;
      const I2 = (t) => 4 * Math.exp(-2 * t) - 4 * Math.exp(-3 * t);
      const pts = []; for (let k = 0; k <= 200; k++) { const t = (k / 200) * 5; pts.push([I1(t), I2(t)]); }
      return G2(560, 210, '두 고리 회로의 전류와 상평면 궤적', [
        { w: 290, h: 210, x: [0, 5], y: [-0.1, 2.75], title: '(a) 시간에 대한 그래프', xt: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5 s']], yt: [[1, '1'], [2, '2']], xl: 't', m: [20, 10, 22, 24],
          c: [{ f: I1, c: 'ld' }, { f: I2, c: 'rx' }], t: [[4.6, 2.2, 'I₁', { c: 'em' }], [1.2, 0.55, 'I₂', { c: 'em' }]] },
        { ox: 300, w: 260, h: 210, x: [-0.1, 2.75], y: [-0.05, 0.72], title: '(b) 상평면의 궤적 (I₁, I₂)', xt: [[1, '1'], [2, '2']], yt: [[0.5, '0.5']], xl: 'I₁', yl: 'I₂', m: [20, 10, 22, 26],
          c: [{ pts, c: 'ld' }], extra: (X, Y) => arrow(X, Y, pts, 30) + arrow(X, Y, pts, 90) + dot(X, Y, 0, 0) + dot(X, Y, 2, 0, true) + FK.T(X(2), Y(0) - 8, '(2, 0)') },
      ], R`스위치를 닫은 뒤의 두 전류. (a)는 두 곡선을 따로, (b)는 $t$를 매개변수로 한 점 $(I_1(t),I_2(t))$의 곡선(궤적)입니다. 궤적은 원점에서 출발해 정상상태 $(2,0)$으로 들어가고, 화살표가 $t$가 커지는 방향입니다.`);
    },
    // 4.3 the five (six) types of critical points
    f03types() {
      const W = 186, H = 186;
      const P = (ox, oy, title, o) => phase(Object.assign({ R: 1, panel: { ox, oy, w: W, h: H, title } }, o));
      return G2(558, 2 * H + 6, '임계점의 종류', [
        P(0, 0, '비고유 마디점 (λ = −1, −4)', { f: lin(-2, 1, 2, -3), starts: ring(1.1, 12, 0.13).concat([[0.7, 0.7], [-0.7, -0.7], [0.45, -0.9], [-0.45, 0.9]]), h: 0.01, n: 400, am: 8 }),
        P(186, 0, '고유 마디점 (A = −I)', { f: lin(-1, 0, 0, -1), starts: ring(1.1, 12), h: 0.02, n: 300, am: 10 }),
        P(372, 0, '안장점 (λ = 1, −1)', { f: lin(1, 0, 0, -1), starts: [[0.1, 1.1], [0.3, 1.1], [0.6, 1.1], [-0.1, 1.1], [-0.3, 1.1], [-0.6, 1.1], [0.1, -1.1], [0.3, -1.1], [0.6, -1.1], [-0.1, -1.1], [-0.3, -1.1], [-0.6, -1.1], [0, 1.1], [0, -1.1], [0.01, 0], [-0.01, 0]], h: 0.02, n: 300, am: 30, bw: false }),
        P(0, 192, '중심 (λ = ±3i)', { f: lin(0, 1, -9, 0), starts: [[0.1, 0], [0.2, 0], [0.3, 0]], h: 0.01, n: 240, bw: false, am: 60 }),
        P(186, 192, '나선점 (λ = −1 ± i)', { f: lin(-1, 1, -1, -1), starts: ring(1.2, 4, 0.3), h: 0.02, n: 500, am: 20, bw: false }),
        P(372, 192, '퇴화 마디점 (λ = 2, 2)', { f: lin(1, 1, -1, 3), starts: ring(0.05, 8, 0.2).concat([[0.001, 0.001], [-0.001, -0.001]]), h: 0.01, n: 400, am: 60, bw: false }),
      ], R`각 행렬의 상평면 그림(화살표는 $t$가 커지는 방향). 위: $\begin{bmatrix}-2&1\\2&-3\end{bmatrix}$, $-I$, $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$. 아래: $\begin{bmatrix}0&1\\-9&0\end{bmatrix}$, $\begin{bmatrix}-1&1\\-1&-1\end{bmatrix}$, $\begin{bmatrix}1&1\\-1&3\end{bmatrix}$. 앞의 둘과 나선점은 안정하고 끌어당기며, 중심은 안정하지만 끌어당기지 않고, 안장점과 퇴화 마디점(여기서는 $\lambda=2>0$)은 불안정합니다.`);
    },
    // 4.5 pendulum: undamped (energy levels) and damped
    f03pend() {
      const k = 1;
      const levels = [-0.6, -0.2, 0.3, 0.7, 1, 1.5, 2.2];
      const curves = [];
      levels.forEach((C) => {
        // y2 = ±sqrt(2(C + k cos y1))
        [1, -1].forEach((s) => curves.push({ f: (y1) => { const v = 2 * (C + k * Math.cos(y1)); return v >= 0 ? s * Math.sqrt(v) : NaN; }, c: C === 1 ? 'rx' : 'ld', n: 900 }));
      });
      const damp = (y) => [y[1], -Math.sin(y[0]) - 0.25 * y[1]];
      const starts = [[-2 * PI + 0.2, 2.6], [-PI - 0.4, 2.7], [-0.5, 2.6], [0.6, 2.8], [2.5, -2.7], [PI + 0.3, -2.6], [-3.3, -2.5], [1.2, 2.8]];
      const paths = starts.map((s) => traj(damp, s, 0.03, 1400, [12, 5]));
      return G2(560, 330, '진자의 상평면', [
        { w: 560, h: 160, x: [-3 * PI, 3 * PI], y: [-3, 3], title: '(a) 감쇠 없음: θ″ + sin θ = 0 (에너지 등고선)', xt: [[-2 * PI, '−2π'], [-PI, '−π'], [PI, 'π'], [2 * PI, '2π']], xl: 'θ', yl: 'θ′', m: [20, 10, 16, 22],
          c: curves, extra: (X, Y) => [-2, -1, 0, 1, 2].map((n) => dot(X, Y, n * PI, 0, n % 2 !== 0)).join('') },
        { oy: 170, w: 560, h: 160, x: [-3 * PI, 3 * PI], y: [-3, 3], title: '(b) 감쇠 있음: θ″ + 0.25θ′ + sin θ = 0', xt: [[-2 * PI, '−2π'], [-PI, '−π'], [PI, 'π'], [2 * PI, '2π']], xl: 'θ', yl: 'θ′', m: [20, 10, 16, 22],
          inner: (X, Y) => paths.map((p) => `<path class="ld" d="${p.map((q, i) => (i ? 'L' : 'M') + f1(X(q[0])) + ',' + f1(Y(q[1]))).join('')}"/>` + arrow(X, Y, p, 20)).join(''),
          extra: (X, Y) => [-2, -1, 0, 1, 2].map((n) => dot(X, Y, n * PI, 0, n % 2 !== 0)).join('') },
      ], R`(a) 에너지 $\frac12\theta'^2-\cos\theta=C$의 등고선. 닫힌 곡선은 앞뒤로 흔들리는 운동, 물결 모양은 계속 도는 운동이고, 둘을 가르는 주황 곡선($C=1$)이 안장점 $(\pm\pi,0)$(속 빈 점)을 잇습니다. (b) 감쇠가 있으면 궤적이 나선을 그리며 $(2n\pi,0)$에 빨려 들어가고, 처음에 돌던 운동도 결국 흔들림으로 바뀝니다.`);
    },
    // 4.5 Lotka–Volterra cycles
    f03lv() {
      const a = 1, b = 0.5, k = 0.25, l = 0.75; // equilibrium (l/k, a/b) = (3, 2)
      const f = (y) => [a * y[0] - b * y[0] * y[1], k * y[0] * y[1] - l * y[1]];
      const starts = [[3, 0.8], [3, 1.2], [3, 1.6], [3, 0.4]];
      const paths = starts.map((s) => traj(f, s, 0.02, 700, [20, 20]));
      return G({
        x: [0, 11], y: [0, 7], h: 240, xt: [[3, 'l/k = 3'], [6, '6'], [9, '9']], yt: [[2, 'a/b = 2'], [4, '4'], [6, '6']], xl: 'y₁ (피식자)', yl: 'y₂ (포식자)', m: [14, 16, 24, 50],
        inner: (X, Y) => paths.map((p) => `<path class="ld" d="${p.map((q, i) => (i ? 'L' : 'M') + f1(X(q[0])) + ',' + f1(Y(q[1]))).join('')}"/>` + arrow(X, Y, p, 40)).join(''),
        extra: (X, Y) => dot(X, Y, 3, 2) + dot(X, Y, 0, 0, true),
        label: '로트카-볼테라 모델의 궤적',
        cap: R`$y_1'=y_1-0.5y_1y_2$, $y_2'=0.25y_1y_2-0.75y_2$. 모든 궤적이 평형점 $(3,2)$를 도는 닫힌 곡선이고(반시계 방향), 피식자가 최대일 때부터 포식자가 늘기 시작해 피식자보다 늦게 최대가 됩니다. 원점은 안장점입니다.`,
      });
    },
    // 4.5 van der Pol limit cycle
    f03vdp() {
      const mu = 1;
      const f = (y) => [y[1], mu * (1 - y[0] * y[0]) * y[1] - y[0]];
      const inside = traj(f, [0.1, 0], 0.02, 520, [6, 6]);
      const outside = traj(f, [-3.6, 3.2], 0.02, 420, [8, 8]);
      const cyc = traj(f, [2, 0], 0.02, 3000, [6, 6]).slice(2000);
      return G({
        x: [-6, 6], y: [-4, 4], h: 300, xt: [[-2, '−2'], [2, '2']], yt: [[-2, '−2'], [2, '2']], xl: 'y', yl: 'y′', m: [14, 12, 20, 24],
        inner: (X, Y) => [inside, outside].map((p) => `<path class="ld" d="${p.map((q, i) => (i ? 'L' : 'M') + f1(X(q[0])) + ',' + f1(Y(q[1]))).join('')}"/>` + arrow(X, Y, p, 60) + arrow(X, Y, p, 200)).join('') + '<path class="rx" d="' + cyc.map((q, i) => (i ? 'L' : 'M') + f1(X(q[0])) + ',' + f1(Y(q[1]))).join('') + '"/>',
        label: '판 데르 폴 방정식의 극한 순환',
        cap: R`$y''-(1-y^2)y'+y=0$. 안쪽에서 출발한 궤적(작은 진폭, 음의 감쇠)은 커지고 바깥에서 출발한 궤적은 줄어들어, 둘 다 같은 닫힌 곡선(주황, 극한 순환)으로 모여듭니다.`,
      });
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
