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
  });
})();
