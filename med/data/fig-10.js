/* 10 역전파 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, legend } = FK;
  const T = FK.T;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 8.1.1 single-layer network (slide 4)
    singlelayer() {
      const xs = [[90, 40, 'x_M'], [90, 130, 'x_2'], [90, 190, 'x_1']];
      let s = xs.map(([x, y]) => MF.link(x, y, 330, 115, 16, 18, 'ax', 7)).join('');
      s += xs.map(([x, y, l]) => MF.nd(x, y, '', 16) + T(x, y + 5, l, { c: 'em' })).join('') + T(90, 90, '⋮', { c: 'em' });
      s += MF.nd(330, 115, 'y', 18) + T(200, 62, 'w_M', { s: 11 }) + T(200, 118, 'w_2', { s: 11 }) + T(200, 168, 'w_1', { s: 11 });
      s += T(380, 80, 'y_k = Σᵢ w_{ki} xᵢ', { a: 'start', c: 'lb' }) + T(380, 110, 'E_n = ½ Σ_k (y_{nk} − t_{nk})²', { a: 'start' }) + T(380, 150, '∂Eₙ/∂w_{ji} = (y_{nj} − t_{nj}) x_{ni}', { a: 'start', c: 'rl' }) + T(380, 174, '= 오차 신호 × 입력 활성', { a: 'start', s: 11 });
      return FK.fig(560, 214, '단층 신경망', s,
        R`출력이 입력의 가중합인 가장 단순한 망입니다. 가중치 $w_{ji}$는 출력 $y_j$에만 들어 있으므로 그 기울기는 출력의 오차 $y_{nj}-t_{nj}$와 그 가중치가 연결된 입력 $x_{ni}$의 곱입니다. 이 “오차 × 입력” 구조가 다층망의 역전파에서도 그대로 반복됩니다.`);
    },
    // 8.1.4 finite differences: truncation vs rounding error
    numdiff() {
      const f = Math.sin, df = Math.cos, w = 1;
      const pts = (central) => { const P = []; for (let k = 1; k <= 15; k += 0.25) { const e = 10 ** -k; const d = central ? (f(w + e) - f(w - e)) / (2 * e) : (f(w + e) - f(w)) / e; const err = Math.abs(d - df(w)); P.push([-k, Math.log10(Math.max(err, 1e-17))]); } return P; };
      const a = pts(false), b = pts(true);
      return G({ w: 560, h: 230, x: [-15, -1], y: [-12, 0], xl: 'log₁₀ ε', yl: 'log₁₀ |오차|', label: '수치 미분의 오차', m: [14, 16, 22, 36], ax0: -12, ay0: -15, xt: [[-14, '−14'], [-11, '−11'], [-8, '−8'], [-5, '−5'], [-2, '−2']], yt: [[-10, '−10'], [-5, '−5'], [0, '0']],
        c: [{ pts: a, c: 'rx' }, { pts: b, c: 'ld' }],
        extra: (X, Y) => legend(X(-14.6), Y(-9.6), [['rx', '전진 차분: 오차 O(ε)'], ['ld', '중앙 차분: 오차 O(ε²)']]),
        cap: R`$E(w)=\sin w$의 $w=1$에서의 도함수를 배정밀도로 근사했습니다. 오른쪽(큰 $\varepsilon$)에서는 절단 오차가 지배해 전진 차분은 기울기 1, 중앙 차분은 기울기 2로 줄고, 왼쪽(작은 $\varepsilon$)에서는 반올림 오차 $\sim10^{-16}/\varepsilon$이 커집니다. 중앙 차분이 최적($\varepsilon\approx10^{-5}$)에서 훨씬 정확하지만, 어느 쪽이든 가중치마다 두 번씩 망을 돌려야 해 $O(W^2)$입니다.` });
    },
    // 8.2 evaluation trace of f(x1,x2) = x1 x2 + exp(x1 x2) − sin x2
    autodiff() {
      const P = { v1: [60, 60], v2: [60, 180], v3: [180, 90], v4: [180, 190], v5: [300, 60], v6: [300, 150], v7: [440, 110] };
      const E = [['v1', 'v3'], ['v2', 'v3'], ['v2', 'v4'], ['v3', 'v5'], ['v3', 'v6'], ['v4', 'v6'], ['v5', 'v7'], ['v6', 'v7']];
      let s = E.map(([a, b]) => MF.link(P[a][0], P[a][1], P[b][0], P[b][1], 18, 18, 'ax', 6)).join('');
      const lab = { v1: 'v₁', v2: 'v₂', v3: 'v₃', v4: 'v₄', v5: 'v₅', v6: 'v₆', v7: 'v₇' };
      Object.entries(P).forEach(([k, [x, y]]) => { s += MF.nd(x, y, lab[k], 18); });
      const op = { v1: 'x₁', v2: 'x₂', v3: 'v₁v₂', v4: 'sin v₂', v5: 'exp v₃', v6: 'v₃ − v₄', v7: 'v₅ + v₆ = f' };
      Object.entries(P).forEach(([k, [x, y]]) => { s += T(x, y - 24, op[k], { s: 11, c: 'lb' }); });
      const adj = { v7: 'v̄₇ = 1', v6: 'v̄₆ = 1', v5: 'v̄₅ = 1', v4: 'v̄₄ = −1', v3: 'v̄₃ = 1 + exp v₃', v2: 'v̄₂ = v̄₃v₁ + v̄₄ cos v₂', v1: 'v̄₁ = v̄₃v₂' };
      Object.entries(P).forEach(([k, [x, y]]) => { s += T(x, y + 34, adj[k], { s: 10.5, c: 'rl' }); });
      return FK.fig(560, 244, '자동 미분의 계산 그래프', s,
        R`$f(x_1,x_2)=x_1x_2+\exp(x_1x_2)-\sin x_2$를 기본 연산으로 쪼갠 그래프입니다. 위쪽 글자가 순방향으로 계산하는 중간 변수, 아래쪽이 후진 모드의 수반 변수 $\bar v_i=\partial f/\partial v_i$입니다. $\bar v_7=1$에서 출발해 자식들의 $\bar v_j\,\partial v_j/\partial v_i$를 더하며 거꾸로 내려오면 한 번에 $\partial f/\partial x_1=\bar v_1$, $\partial f/\partial x_2=\bar v_2$를 얻습니다.`);
    },
  });
})();
