/* 10 SGD·미니배치·활성화 함수 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G, G2, dot, legend } = FK;
  const sg = (z) => 1 / (1 + Math.exp(-z));
  // a small least squares problem: f(β) = mean ½(β0 + β1 u_i − y_i)²
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const N = 40;
  const U = Array.from({ length: N }, (_, i) => -1 + (2 * (i + 0.5)) / N);
  const Y = U.map((u) => 1 + 2 * u + 1.2 * (rnd() - 0.5));
  const grad = (b, idx) => { let g0 = 0, g1 = 0; idx.forEach((i) => { const r = b[0] + b[1] * U[i] - Y[i]; g0 += r; g1 += r * U[i]; }); return [g0 / idx.length, g1 / idx.length]; };
  // optimum and Hessian for the level sets
  const su = U.reduce((s, u) => s + u, 0) / N, suu = U.reduce((s, u) => s + u * u, 0) / N;
  const sy = Y.reduce((s, y) => s + y, 0) / N, suy = U.reduce((s, u, i) => s + u * Y[i], 0) / N;
  const det = suu - su * su, bh = [(suu * sy - su * suy) / det, (suy - su * sy) / det];
  const A = [[1, su], [su, suu]];
  const tr = A[0][0] + A[1][1], dd = A[0][0] * A[1][1] - A[0][1] * A[0][1], disc = Math.sqrt(tr * tr / 4 - dd);
  const l1 = tr / 2 + disc, l2 = tr / 2 - disc;
  const ev = (l) => { const v = [A[0][1], l - A[0][0]], n = Math.hypot(v[0], v[1]) || 1; return n < 1e-9 ? [1, 0] : [v[0] / n, v[1] / n]; };
  const v1 = Math.abs(A[0][1]) < 1e-9 ? [1, 0] : ev(l1), v2 = Math.abs(A[0][1]) < 1e-9 ? [0, 1] : ev(l2);
  const ell = (c) => Array.from({ length: 121 }, (_, k) => { const t = (2 * Math.PI * k) / 120, a = Math.sqrt(2 * c / l1) * Math.cos(t), b = Math.sqrt(2 * c / l2) * Math.sin(t); return [bh[0] + a * v1[0] + b * v2[0], bh[1] + a * v1[1] + b * v2[1]]; });
  const run = (B, lr, T) => {
    let b = [-1.2, -1.4];
    const out = [b.slice()];
    const all = Array.from({ length: N }, (_, i) => i);
    for (let t = 0; t < T; t++) {
      const idx = B >= N ? all : Array.from({ length: B }, () => Math.floor(rnd() * N));
      const g = grad(b, idx);
      b = [b[0] - lr * g[0], b[1] - lr * g[1]];
      out.push(b.slice());
    }
    return out;
  };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 10.1–10.2 paths of batch GD, minibatch SGD and single-sample SGD
    sgdpaths() {
      seed = 11;
      const pGD = run(N, 0.5, 40), pMB = run(8, 0.5, 40), pSG = run(1, 0.5, 40);
      const lev = [0.05, 0.2, 0.5, 1, 1.8];
      return G({ w: 560, h: 270, x: [-1.5, 2.2], y: [-1.7, 2.6], xl: 'β₀', yl: 'β₁', label: '배치, 미니배치, 확률적 경사하강법의 경로', m: [10, 150, 22, 26], xt: [[0, '0'], [1, '1'], [2, '2']], yt: [[0, '0'], [1, '1'], [2, '2']],
        c: lev.map((c) => ({ pts: ell(c), c: 'dm' })).concat([{ pts: pSG, c: 'rx' }, { pts: pMB, c: 'vl' }, { pts: pGD, c: 'ld' }]),
        extra: (X, Y) => dot(X, Y, -1.2, -1.4) + dot(X, Y, bh[0], bh[1], true) + legend(X(2.2) + 14, Y(2.3), [['ld', '배치 GD (N = 40)'], ['vl', '미니배치 (B = 8)'], ['rx', 'SGD (B = 1)']]),
        cap: R`자료 40개의 최소제곱 손실(등고선)에서 같은 점, 같은 학습률($0.5$)로 40걸음씩 간 경로입니다. 배치 GD는 매끈하게, 미니배치는 약간 흔들리며, 표본 하나짜리 SGD는 크게 흔들리며 최솟점(빈 원) 근처로 갑니다. 세 방법의 기울기는 기댓값이 같고 **분산**만 다릅니다. SGD는 최솟점에 도착한 뒤에도 가만히 있지 못하고 주변을 맴돕니다(잡음 바닥).` });
    },
    // 10.4 derivatives of the activation functions
    actderiv() {
      return G({ w: 560, h: 210, x: [-5, 5], y: [-0.1, 1.15], xl: 'z', label: '활성화 함수의 도함수', xt: [[-4, '−4'], [-2, '−2'], [0, '0'], [2, '2'], [4, '4']], yt: [[0.25, '1/4'], [1, '1']], hg: [0.25, 1], m: [10, 14, 22, 30],
        c: [{ f: (z) => sg(z) * (1 - sg(z)), c: 'ld' }, { f: (z) => 1 - Math.tanh(z) ** 2, c: 'rx' }, { pts: [[-5, 0], [0, 0], null, [0, 1], [5, 1]], c: 'vl' }],
        extra: (X, Y) => legend(X(-4.8), Y(0.95), [['ld', 'σ′(z) ≤ 1/4'], ['rx', 'tanh′(z) ≤ 1'], ['vl', 'ReLU′(z) ∈ {0, 1}']]) + dot(X, Y, 0, 1, true) + dot(X, Y, 0, 0, true),
        cap: R`역전파에서 층마다 곱해지는 값입니다. 시그모이드는 최대 $\tfrac14$이라 층을 지날 때마다 기울기가 적어도 4배씩 줄고, $\lvert z\rvert\gt4$ 정도면 거의 0(포화)입니다. tanh는 0에서 1이지만 역시 양 끝에서 0. ReLU는 양수에서 정확히 1이라 줄지 않고, 음수에서는 정확히 0입니다(죽은 ReLU).` });
    },
    // 10.2 training loss against the number of steps for the three gradient estimates (slide 6, right)
    sgdcurve() {
      seed = 5;
      const T = 80, lossAt = (b) => U.reduce((s, u, i) => { const r = b[0] + b[1] * u - Y[i]; return s + 0.5 * r * r; }, 0) / N;
      const lg = (p) => p.map((b, k) => [k, Math.log10(lossAt(b))]);
      const lmin = Math.log10(lossAt(bh));
      const pGD = lg(run(N, 0.5, T)), pMB = lg(run(8, 0.5, T)), pSG = lg(run(1, 0.5, T));
      return G({ w: 560, h: 250, x: [0, T], y: [-1.4, 0.8], ax0: -1.4, xl: '걸음 수', yl: '손실(로그 눈금)', label: '세 방법의 학습 곡선', m: [14, 150, 26, 34],
        xt: [[0, '0'], [20, '20'], [40, '40'], [60, '60'], [80, '80']], yt: [[-1, '0.1'], [0, '1']], hg: [lmin],
        c: [{ pts: pSG, c: 'rx' }, { pts: pMB, c: 'vl' }, { pts: pGD, c: 'ld' }],
        extra: (X, Y) => legend(X(T) + 14, Y(0.5), [['ld', '배치 GD'], ['vl', '미니배치 (B = 8)'], ['rx', 'SGD (B = 1)']]) + FK.T(X(T) + 14, Y(lmin) + 4, '← 최솟값', { a: 'start', s: 11 }),
        cap: R`10.1절의 최소제곱 문제에서 같은 점, 같은 학습률($0.5$)로 80걸음 간 손실(세로축은 로그 눈금)입니다. 세 방법 모두 처음에는 비슷하게 빨리 내려갑니다. 배치 GD는 최솟값(점선)까지 매끈하게 내려가 머물고, 미니배치는 조금, 표본 하나짜리 SGD는 크게 들쭉날쭉하며 최솟값 위에서 맴돕니다. 슬라이드의 SGD 학습 곡선(오른쪽 위의 톱니 모양)이 이렇게 생깁니다.` });
    },
    // 10.4 the five activation functions of slides 8–15 with their derivatives
    actfns() {
      const dsg = (z) => sg(z) * (1 - sg(z));
      const elu = (z) => (z > 0 ? z : Math.exp(z) - 1), delu = (z) => (z > 0 ? 1 : Math.exp(z));
      const lk = (z) => (z >= 0 ? z : 0.01 * z);
      const base = { w: 187, h: 165, x: [-5, 5], xt: [[-4, '−4'], [4, '4']], m: [24, 8, 20, 26] };
      const P = (ox, oy, title, y, yt, c) => Object.assign({}, base, { ox, oy, title, y, yt, c });
      const ps = [
        P(0, 0, '(a) 시그모이드', [-0.1, 1.1], [[0, '0'], [1, '1']], [{ f: sg, c: 'ld' }, { f: dsg, c: 'rx' }]),
        P(187, 0, '(b) tanh', [-1.15, 1.15], [[-1, '−1'], [1, '1']], [{ f: Math.tanh, c: 'ld' }, { f: (z) => 1 - Math.tanh(z) ** 2, c: 'rx' }]),
        P(374, 0, '(c) ReLU', [-0.5, 5.3], [[0, '0'], [5, '5']], [{ f: (z) => Math.max(0, z), c: 'ld' }, { pts: [[-5, 0], [0, 0], null, [0, 1], [5, 1]], c: 'rx' }]),
        P(0, 168, '(d) Leaky ReLU', [-0.5, 5.3], [[0, '0'], [5, '5']], [{ f: lk, c: 'ld' }, { pts: [[-5, 0.01], [0, 0.01], null, [0, 1], [5, 1]], c: 'rx' }]),
        P(187, 168, '(e) ELU', [-1.3, 5.3], [[-1, '−1'], [5, '5']], [{ f: elu, c: 'ld' }, { f: delu, c: 'rx' }]),
      ];
      const lg = legend(386, 218, [['ld', 'g(z)'], ['rx', "g′(z)"]]);
      return FK.fig(560, 340, '활성화 함수와 도함수', ps.map(FK.Gp).join('') + lg + FK.T(386, 262, 'Leaky ReLU: 0.01z', { a: 'start', s: 11 }) + FK.T(386, 278, 'ELU: α = 1', { a: 'start', s: 11 }),
        R`슬라이드 8–15의 다섯 활성화 함수 $g(z)$와 그 도함수 $g'(z)$. (a) 시그모이드는 $(0,1)$, 도함수는 최대 $\frac14$이고 양 끝에서 0. (b) tanh는 $(-1,1)$로 0 중심이고 도함수는 최대 1이지만 역시 양 끝에서 0. (c) ReLU는 $z>0$에서 $g'=1$이라 포화가 없고 $z<0$에서는 $g'=0$. (d) Leaky ReLU는 음수 쪽에도 기울기 $0.01$을 남깁니다. (e) ELU는 음수 쪽을 $\alpha(e^z-1)$로 매끈하게 포화시켜 평균 출력이 0에 가까워집니다($\alpha=1$로 그림).`);
    },
    // 10.4 why all-positive inputs force a zigzag: every update is in the (+,+) or (−,−) quadrant
    zigzag() {
      const path = [[0, 0], [0.6, 0.2], [0.2, -0.4], [0.9, -0.3], [0.5, -0.8], [1, -0.7], [0.9, -1], [1, -0.98]];
      return G({ w: 560, h: 280, x: [-1.4, 1.7], y: [-1.5, 1.4], xl: 'w₁', yl: 'w₂', label: '0 중심이 아닌 입력과 지그재그', m: [10, 160, 14, 14], xt: [], yt: [],
        c: [{ pts: path, c: 'rx' }],
        extra: (X, Y) => FK.R(X(0), Y(1.4), X(1.7) - X(0), Y(0) - Y(1.4), 'fl') + FK.R(X(-1.4), Y(0), X(0) - X(-1.4), Y(-1.5) - Y(0), 'fl')
          + FK.T(X(0.85), Y(1.1), '갱신 가능 (+, +)', { s: 11 }) + FK.T(X(-0.7), Y(-1.25), '갱신 가능 (−, −)', { s: 11 })
          + FK.T(X(0.85), Y(-1.35), '불가능: (+, −)', { s: 11 }) + FK.T(X(-0.7), Y(1.1), '불가능: (−, +)', { s: 11 })
          + FK.A(X(0), Y(0), X(1) - 4, Y(-1) + 4, 'ld', 9) + dot(X, Y, 0, 0) + dot(X, Y, 1, -1, true)
          + FK.T(X(1) + 10, Y(-1) + 4, '목표 (+1, −1)', { a: 'start', c: 'lb' }) + FK.T(X(1.7) + 14, Y(0.75), '직선: 필요한 방향', { a: 'start', s: 11, c: 'lb' }) + FK.T(X(1.7) + 14, Y(0.5), '꺾은선: 가능한 걸음만', { a: 'start', s: 11 }) + FK.T(X(1.7) + 14, Y(0.3), '이어 만든 경로', { a: 'start', s: 11 }),
        cap: R`입력이 모두 양수일 때($x_i>0$) 한 뉴런의 가중치 기울기 $\frac{\partial L}{\partial w_i}=\frac{\partial L}{\partial s}x_i$는 모두 같은 부호라, 갱신 $(\Delta w_1,\Delta w_2)$는 $(+,+)$ 또는 $(-,-)$ 사분면(음영)으로만 갈 수 있습니다. 최적 방향이 $(+1,-1)$이면 원점에서 곧장 가지 못하고 두 사분면의 걸음을 번갈아 이어 계단처럼 다가갑니다. 걸음 크기는 모양을 보이려고 정한 예시입니다.` });
    },
  });
})();
