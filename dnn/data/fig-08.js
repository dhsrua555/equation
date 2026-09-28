/* 08 신경망의 기초 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G2, dot, legend } = FK;
  const sg = (z) => 1 / (1 + Math.exp(-z));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 8.3 activation functions
    actfns() {
      return G2(560, 220, '활성화 함수', [
        { w: 280, h: 220, x: [-4, 4], y: [-1.3, 1.3], title: '(a) 포화형: 시그모이드, tanh', xt: [[-2, '−2'], [2, '2']], yt: [[-1, '−1'], [1, '1']], m: [22, 10, 18, 26], hg: [1, -1],
          c: [{ f: sg, c: 'ld' }, { f: Math.tanh, c: 'rx' }], extra: (X, Y) => legend(X(-3.8), Y(1.05), [['ld', 'σ(z)'], ['rx', 'tanh z']]) },
        { ox: 280, w: 280, h: 220, x: [-3, 3], y: [-1.3, 3.2], title: '(b) 조각 선형형: ReLU, Leaky ReLU, ELU', xt: [[-2, '−2'], [2, '2']], yt: [[-1, '−1'], [1, '1'], [2, '2']], m: [22, 10, 18, 26],
          c: [{ f: (z) => Math.max(0, z), c: 'ld' }, { f: (z) => Math.max(0.1 * z, z), c: 'rx ds' }, { f: (z) => (z >= 0 ? z : Math.exp(z) - 1), c: 'vl' }],
          extra: (X, Y) => legend(X(-2.8), Y(2.9), [['ld', 'ReLU max(0, z)'], ['rx ds', 'Leaky max(0.1z, z)'], ['vl', 'ELU (α = 1)']]) },
      ], R`(a) 시그모이드는 $(0,1)$, tanh는 $(-1,1)$로 값을 가두고, 양 끝에서 평평해집니다(포화: 기울기 ≈ 0). (b) ReLU는 양수에서 기울기 1로 포화가 없고 계산이 가장 쌉니다. 음수 쪽에서 ReLU는 0(기울기 0), Leaky ReLU는 작은 기울기 0.1, ELU는 $-1$로 부드럽게 다가갑니다.`);
    },
    // 8.4 XOR with two ReLU units: f depends only on s = x1 + x2
    xorfig() {
      const f = (s) => Math.max(0, s) - 2 * Math.max(0, s - 1);
      return G2(560, 240, 'ReLU 두 개로 만든 XOR', [
        { w: 270, h: 240, x: [-0.45, 1.45], y: [-0.45, 1.45], title: '(a) 입력 공간', xl: 'x₁', yl: 'x₂', xt: [[1, '1']], yt: [[1, '1']], m: [22, 10, 18, 20],
          c: [{ pts: [[-0.45, 0.95], [0.95, -0.45], [1.45, -0.45], [1.45, 0.05], [0.05, 1.45], [-0.45, 1.45]], c: 'fl2' }, { f: (x) => 0.5 - x, c: 'dm ds' }, { f: (x) => 1.5 - x, c: 'dm ds' }],
          extra: (X, Y) => dot(X, Y, 0, 0, true) + dot(X, Y, 1, 1, true) + dot(X, Y, 0, 1) + dot(X, Y, 1, 0) + FK.T(X(0.5), Y(0.55), 'f > 1/2', { c: 'lb' }) },
        { ox: 270, w: 290, h: 240, x: [-0.5, 2.5], y: [-0.2, 1.3], title: '(b) s = x₁ + x₂ 에 대한 출력 f', xl: 's', xt: [[0, '0'], [1, '1'], [2, '2']], yt: [[1, '1']], hg: [0.5], m: [22, 10, 18, 20],
          c: [{ f, c: 'ld' }, { f: (s) => Math.max(0, s), c: 'dm ds' }, { f: (s) => -2 * Math.max(0, s - 1), c: 'dm ds' }],
          extra: (X, Y) => dot(X, Y, 0, 0, true) + dot(X, Y, 1, 1) + dot(X, Y, 2, 0, true) + FK.T(X(1.6), Y(1.05), 'f = h₁ − 2h₂', { a: 'start', c: 'lb' }) },
      ], R`(a) 채운 점 $(0,1),(1,0)$은 레이블 1, 빈 점 $(0,0),(1,1)$은 0. 직선 하나로는 나눌 수 없지만, 신경망 $f=\max(0,x_1+x_2)-2\max(0,x_1+x_2-1)$은 두 평행선 사이의 띠(칠한 부분)에서 $f>\tfrac12$이 되어 XOR를 맞힙니다. (b) $f$는 $s=x_1+x_2$만의 함수로, 은닉 유닛 두 개(점선)가 만든 “꺾인 선”이 $s=1$에서 꼭대기를 이룹니다.`);
    },
  });
})();
