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
    // 8.6 the CIFAR10 MLP of example 5: layer widths, weight shapes and where the parameters are (W3 Wed slides 49–50)
    mlparch() {
      const cy = 100, bw = 26;
      const L = [['x', '3072', 30, 150], ['h_1', '1536', 150, 116], ['h_2', '768', 270, 86], ['h_3', '384', 390, 62], ['O', '1', 500, 16]];
      const A = [['A_1', '1536×3072', '4,720,128'], ['A_2', '768×1536', '1,180,416'], ['A_3', '384×768', '295,296'], ['A_4', '1×384', '385']];
      let body = '';
      L.forEach(([nm, n, x, h], k) => {
        body += FK.R(x, cy - h / 2, bw, h, k === 0 || k === 4 ? 'bm' : 'bm2')
          + FK.T(x + bw / 2, cy - h / 2 - 7, nm, { c: 'it' }) + FK.T(x + bw / 2, cy + h / 2 + 14, n, { s: 11, c: 'em' });
        if (k < 4) {
          const x1 = x + bw + 4, x2 = L[k + 1][2] - 4, m = (x1 + x2) / 2;
          body += FK.A(x1, cy, x2, cy, 'ax', 7) + FK.T(m, cy - 22, A[k][0], { c: 'it' }) + FK.T(m, cy - 9, A[k][1], { s: 10 })
            + FK.T(m, cy + 15, k < 3 ? 'ReLU' : '활성화 없음', { s: 10, c: 'lb' }) + FK.T(m, cy + 29, A[k][2], { s: 10, c: 'rl' });
        }
      });
      const tot = 6196225, x0 = 40, W = 480;
      let x = x0;
      [['A₁ 76.2%', 4720128], ['A₂ 19.1%', 1180416], ['', 295296], ['', 385]].forEach(([t, v], k) => {
        const w = (W * v) / tot;
        body += FK.R(x, 218, w, 18, k === 0 ? 'bm2' : 'bm') + (t ? FK.T(x + w / 2, 231, t, { s: 10 }) : '');
        x += w;
      });
      body += FK.T(280, 210, '매개변수 6,196,225개가 어느 행렬에 있는가', { s: 11, c: 'em' }) + FK.T(x0 + W, 250, 'A₃ 4.8% · A₄ 0.01% →', { s: 10, a: 'end' });
      return FK.fig(560, 256, 'CIFAR10용 다층 퍼셉트론의 구조', body,
        R`예제 5의 망 $3072\to1536\to768\to384\to1$. 막대의 높이는 층의 폭을, 화살표 위의 크기는 가중치 행렬 $A_\ell\in\mathbb R^{n_\ell\times n_{\ell-1}}$을, 화살표 아래 둘째 줄의 수는 그 층의 매개변수 $(n_{\ell-1}+1)n_\ell$을 나타냅니다. 은닉층 뒤에는 ReLU가 있고 마지막 층에는 활성화가 없습니다. 아래 띠처럼 첫 행렬 하나가 전체의 76%를 차지합니다.`);
    },
  });
})();
