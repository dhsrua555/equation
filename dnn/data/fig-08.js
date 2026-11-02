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
    // 8.1 perception → reason → action
    aipipe() {
      const T = FK.T, bx = FK.R, A = FK.A;
      let s = '';
      [[90, '지각', '관측을 기계가 이해하는', '형태로 바꾼다'], [280, '추론', '데이터와 출력 사이의', '사상을 설계한다'], [470, '행동', '과제를 이루기 위한', '결정을 내린다']].forEach(([x, h, a, b]) => {
        s += T(x, 20, h, { c: 'lb', s: 14 }) + T(x, 38, a, { s: 11 }) + T(x, 52, b, { s: 11 });
      });
      s += bx(28, 70, 124, 66, 'bm') + T(90, 100, 'x', { c: 'em', s: 15 }) + T(90, 120, '이미지(관측)', { s: 11 });
      s += A(152, 103, 215, 103, 'ax', 8) + bx(215, 81, 130, 44, 'bm2') + T(280, 109, 'f(x; W)', { c: 'em', s: 16 });
      s += T(280, 150, 'W는 자료에서 학습하는 파라미터', { c: 'rl', s: 11 }) + A(280, 140, 280, 127, 'rx', 7);
      s += A(345, 103, 410, 103, 'ax', 8) + bx(410, 62, 120, 98, 'bm');
      ['오른쪽으로 돌기', '왼쪽으로 돌기', '앞으로 가기', '뒤로 가기', '멈춤'].forEach((t, k) => { s += T(470, 82 + k * 18, t, { s: 11 }); });
      s += T(470, 180, 'y', { c: 'em', s: 15 });
      return FK.fig(560, 192, '지각, 추론, 행동', s,
        R`AI의 목표는 지능의 구성 요소를 계산 가능한 함수로 만드는 것입니다. 관측 $x$(자율주행의 카메라 영상)를 지각으로 기계가 다룰 수 있는 수로 바꾸고, 가운데 함수 $f(x;W)$가 입력을 출력으로 보내며(신경망이 이 역할을 하고 $W$는 자료에서 학습), 출력 $y$가 행동(결정)이 됩니다.`);
    },
    // 8.1 decision regions in the plane
    decregions() {
      const c = [3, 2], pU = [3.9, 3.6], pL = [0, 1.1], pD = [4, 0];
      const body = FK.Gp({ w: 340, h: 240, x: [0, 5.2], y: [0, 3.6], xl: 'x₁', yl: 'x₂', m: [10, 12, 22, 24],
        c: [{ pts: [pL, c, pU, [0, 3.6]], c: 'fl' }, { pts: [pU, c, pD, [5.2, 0], [5.2, 3.6]], c: 'rg' }, { pts: [pL, c, pD, [0, 0]], c: 'fl2' },
          { pts: [pL, c, pU], c: 'ld' }, { pts: [c, pD], c: 'ld' }],
        t: [[1.0, 2.7, 'R₁', { c: 'em', s: 15 }], [4.4, 1.5, 'R₂', { c: 'em', s: 15 }], [1.2, 0.5, 'R₃', { c: 'em', s: 15 }]],
        extra: (X, Y) => FK.T(X(3.45), Y(3.3), '결정 경계', { a: 'end', c: 'rl' }) })
        + FK.T(370, 70, 'f : X → Y', { a: 'start', c: 'em', s: 15 }) + FK.T(370, 105, 'X = ℝ²', { a: 'start', s: 14 }) + FK.T(370, 135, 'Y = {C₁, C₂, C₃}', { a: 'start', s: 14 })
        + FK.T(370, 175, '입력 공간이 결정 영역으로', { a: 'start', s: 11 }) + FK.T(370, 191, '나뉘고, 각 영역의 점은 그 영역에', { a: 'start', s: 11 }) + FK.T(370, 207, '해당하는 클래스로 분류된다', { a: 'start', s: 11 });
      return FK.fig(560, 240, '결정 영역과 결정 경계', body,
        R`분류는 입력 $x\in\mathcal X=\mathbb R^2$를 클래스 $\mathcal Y=\{C_1,C_2,C_3\}$ 중 하나로 보내는 함수입니다. 어떤 결정 규칙이든 입력 공간을 결정 영역 $R_1,R_2,R_3$로 나누고, 영역을 가르는 선이 결정 경계입니다(여기서는 선분 세 개).`);
    },
    // 8.1 what the computer sees, and the output of an image classifier
    imgcls() {
      const T = FK.T; let seed = 7; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      let s = T(24, 22, '컴퓨터가 보는 것: 화소 값의 표', { a: 'start', c: 'em' });
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) s += FK.R(24 + j * 22, 34 + i * 22, 22, 22, 'bm') + T(35 + j * 22, 49 + i * 22, String(Math.floor(rnd() * 90) + 5), { s: 8 });
      s += FK.A(162, 100, 214, 100, 'ax', 8) + FK.R(214, 72, 104, 56, 'bm2') + T(266, 96, '이미지 분류기', { c: 'em' }) + T(266, 114, 'f(x; W)', { s: 11 }) + FK.A(318, 100, 368, 100, 'ax', 8);
      s += T(450, 40, '클래스별 확률', { c: 'em' });
      [['고양이', 0.82], ['개', 0.15], ['모자', 0.02], ['머그잔', 0.01]].forEach(([n, p], k) => {
        const y = 62 + k * 28;
        s += T(418, y + 14, n, { a: 'end' }) + FK.R(424, y, 120 * p, 20, k ? 'fl' : 'fl2') + T(424 + 120 * p + 5, y + 14, Math.round(p * 100) + '%', { a: 'start', c: k ? '' : 'em' });
      });
      return FK.fig(560, 190, '이미지 분류의 입력과 출력', s,
        R`왼쪽은 이미지를 컴퓨터가 보는 방식입니다. 화소마다 밝기 숫자가 있는 큰 표일 뿐입니다(숫자는 모양만 보인 예). 분류기는 이 표를 받아 클래스마다 확률을 내고(슬라이드의 값: 고양이 82%, 개 15%, 모자 2%, 머그잔 1%), 가장 큰 확률의 클래스가 예측입니다.`);
    },
    // 8.1 end-to-end deep learning pipeline
    e2e() {
      const T = FK.T, R_ = FK.R, A = FK.A;
      let s = T(20, 16, '훈련 단계', { a: 'start', c: 'lb' }) + T(20, 146, '테스트 단계', { a: 'start', c: 'lb' });
      s += R_(20, 28, 110, 58, 'bm') + T(75, 54, '훈련 이미지', { c: 'em' }) + T(75, 72, 'x', {});
      s += R_(190, 22, 120, 30, 'bm') + T(250, 42, '훈련 레이블 y') + R_(190, 64, 120, 30, 'bm2') + T(250, 84, '학습', { c: 'em' });
      s += A(250, 52, 250, 64, 'ax', 6) + A(130, 62, 190, 80, 'ax', 7) + A(310, 79, 378, 66, 'ax', 7);
      s += R_(378, 34, 164, 60, 'bm') + T(460, 58, '이미지 특징과 분류기') + T(460, 78, 'f′(x) = g(f(x))', { c: 'em' });
      s += R_(20, 160, 110, 44, 'bm') + T(75, 186, '테스트 이미지 x');
      s += R_(170, 160, 200, 44, 'bm') + T(270, 178, '“학습된” 특징·분류기') + T(270, 195, 'f′(x)', { c: 'em' });
      s += R_(410, 160, 100, 44, 'bm2') + T(460, 179, '예측') + T(460, 197, 'ŷ', { c: 'em' });
      s += A(130, 182, 170, 182, 'ax', 7) + A(370, 182, 410, 182, 'ax', 7) + A(420, 94, 300, 160, 'rx', 7);
      s += T(396, 134, '학습된 f′ 복사', { a: 'start', c: 'rl', s: 11 });
      return FK.fig(560, 214, '종단간 딥러닝 파이프라인', s,
        R`딥러닝은 특징 추출과 분류기를 따로 만들지 않고 한꺼번에 학습합니다(종단간). 훈련 이미지와 레이블로 학습하여 “학습된 특징 + 분류기” $f'(x)=g(f(x))$를 얻고, 시험 이미지 $x$를 넣어 예측 $\hat y$를 냅니다.`);
    },
    // 8.2 two-layer network of the CIFAR10 example: shapes and parameter count
    twolayer() {
      const T = FK.T, A = FK.A;
      let s = FK.R(30, 40, 26, 120, 'bm') + T(43, 34, 'x', { c: 'em' }) + T(43, 176, '3072')
        + A(70, 100, 150, 100, 'ax', 8) + T(110, 90, 'W₁', { c: 'lb' }) + T(110, 117, '100 × 3072', { s: 11 })
        + FK.R(160, 120, 26, 40, 'bm2') + T(173, 114, 'h', { c: 'em' }) + T(173, 176, '100')
        + A(200, 140, 270, 140, 'ax', 8) + T(235, 130, 'W₂', { c: 'lb' }) + T(235, 157, '10 × 100', { s: 11 })
        + FK.R(280, 148, 26, 12, 'bm') + T(293, 142, 's', { c: 'em' }) + T(293, 176, '10')
        + T(340, 62, '가중치 수', { a: 'start', c: 'em' }) + T(340, 86, '3072 × 100 + 100 × 10', { a: 'start' }) + T(340, 106, '= 308,200', { a: 'start', c: 'em' })
        + T(340, 140, '파라미터가 많으면 작은 자료를', { a: 'start', c: 'rl', s: 11 }) + T(340, 156, '외워 버려 과적합하기 쉽다', { a: 'start', c: 'rl', s: 11 });
      return FK.fig(560, 190, 'CIFAR10 2층 신경망의 모양', s,
        R`$f(x)=W_2\max(0,W_1x)$. 입력 $x\in\mathbb R^{3072}$는 $W_1\in\mathbb R^{100\times3072}$로 100차원 은닉 벡터 $h$가 되고, $W_2\in\mathbb R^{10\times100}$이 10개의 클래스 점수 $s$를 냅니다. 막대의 높이가 벡터의 길이입니다.`);
    },
    // 8.3 fully-connected architectures: 2-layer and 3-layer nets
    nnarch() {
      const T = FK.T;
      const net = (xs, cols, names) => {
        const cy = 118, gap = 34, ys = (n) => Array.from({ length: n }, (_, i) => cy + (i - (n - 1) / 2) * gap);
        let e = '', c = '';
        cols.forEach((n, k) => {
          if (k + 1 < cols.length) ys(n).forEach((y1) => ys(cols[k + 1]).forEach((y2) => { e += FK.L(xs[k], y1, xs[k + 1], y2, 'dm'); }));
          ys(n).forEach((y) => { c += FK.C(xs[k], y, 10, 'nd'); });
          e += FK.R(xs[k] - 17, cy - n * gap / 2, 34, n * gap, 'fl');
          c += T(xs[k], 214, names[k], { s: 11 });
        });
        return e + c;
      };
      const s = net([30, 110, 190], [3, 4, 2], ['입력', '은닉', '출력']) + net([290, 370, 450, 530], [3, 4, 4, 1], ['입력', '은닉 1', '은닉 2', '출력'])
        + FK.L(250, 30, 250, 220, 'dm ds') + T(110, 18, '2층 신경망 (은닉층 1개)', { c: 'em' }) + T(410, 18, '3층 신경망 (은닉층 2개)', { c: 'em' })
        + T(280, 238, '이웃한 층의 모든 뉴런이 연결된 완전연결층', { s: 11 });
      return FK.fig(560, 244, '완전연결 신경망의 구조', s,
        R`동그라미 하나가 뉴런이고 선은 가중치입니다. (왼쪽) 입력 3, 은닉 4, 출력 2인 망은 은닉층이 하나라서 “2층 신경망”입니다(입력층은 세지 않음). 식은 $f(x)=\softmax(W_2\max(0,W_1x))$. (오른쪽) 은닉층이 둘이면 “3층 신경망”이고 $f(x)=W_3\max(0,W_2\max(0,W_1x))$ 꼴입니다. 층이 깊고 파라미터가 수백만 개인 망을 깊은 신경망이라 부릅니다.`);
    },
    // 8.4 perceptron with inputs, weights, bias, sum and nonlinearity
    perceptron() {
      const T = FK.T, A = FK.A;
      let s = '';
      [[50, 'x₁*'], [105, 'x₂*'], [160, '1']].forEach(([y, l]) => { s += FK.C(55, y, 19, 'nd') + T(55, y + 4, l, { c: 'em' }); });
      [['w₁', 66, 'lb'], ['w₂', 100, 'lb'], ['b', 134, 'lb']].forEach(([l, y, c], k) => { s += A(74, [50, 105, 160][k], 208, 105 + (k - 1) * 8, 'ax', 7) + T(130, y - (k === 2 ? -6 : 6) + (k === 1 ? 4 : 0), l, { c }); });
      s += FK.C(230, 105, 22, 'nd') + T(230, 112, 'Σ', { c: 'em', s: 18 })
        + A(252, 105, 322, 105, 'ax', 8) + T(287, 92, 'z = wᵀx + b', { s: 11 })
        + FK.R(322, 83, 52, 44, 'bm2') + T(348, 112, 'g', { c: 'em', s: 16 }) + T(348, 148, '비선형 활성화 함수', { c: 'rl', s: 11 })
        + A(374, 105, 440, 105, 'ax', 8) + T(462, 110, 'ŷ', { c: 'em', s: 16 })
        + T(55, 20, '입력과 편향', { c: 'lb', s: 11 }) + T(280, 190, 'g를 빼면 앞의 선형 모델이 된다', { s: 11 }) + T(280, 206, 'ŷ = z', { s: 11 });
      return FK.fig(560, 214, '퍼셉트론', s,
        R`입력 $x_1,x_2$와 상수 1에 가중치 $w_1,w_2,b$를 곱해 $\Sigma$에서 더하면 선형 점수 $z=w_1x_1+w_2x_2+b$입니다(슬라이드 26: $z>0$이면 양성). 여기에 비선형 활성화 $g$를 씌운 $\hat y=g(w^Tx+b)$가 퍼셉트론(슬라이드 30)이고, 이것을 쌓은 것이 신경망입니다.`);
    },
    // 8.4 binary classification with a linear model
    planar() {
      const f = (x) => 3.4 - x, P = [[0.6, 0.5], [1.2, 0.9], [0.8, 1.6], [1.7, 0.6]], Q = [[3.1, 1.9], [2.4, 2.5], [4, 1.2], [3.6, 2.8], [1.9, 2.9]];
      const body = FK.Gp({ w: 420, h: 270, x: [0, 5], y: [0, 3.4], xl: 'x₁', m: [10, 12, 22, 24],
        c: [{ pts: [[0, 3.4], [5, 3.4], [5, 0], [3.4, 0]], c: 'fl2' }, { pts: [[0, 3.4], [3.4, 0], [0, 0]], c: 'rg' }, { f, c: 'ld ds' }],
        t: [[4.15, 3.1, 'ŷ > 0', { c: 'em' }], [0.12, 0.25, 'ŷ < 0', { a: 'start', c: 'em' }]],
        extra: (X, Y) => P.map(([a, b]) => FK.dot(X, Y, a, b, true)).join('') + Q.map(([a, b]) => FK.dot(X, Y, a, b)).join('')
          + FK.C(X(1.3), Y(2.7), 6, 'rxh') + FK.T(X(1.3), Y(2.7) - 11, 'x*', { c: 'rl' }) + FK.T(X(3.5), Y(0.3), 'w₁x₁ + w₂x₂ + b = 0', { a: 'start', c: 'lb', s: 11 }) })
        + FK.T(14, 24, 'x₂', { s: 12 }) + FK.C(446, 70, 4, 'dotf') + FK.T(456, 74, '양성', { a: 'start' }) + FK.C(446, 94, 4, 'doto') + FK.T(456, 98, '음성', { a: 'start' }) + FK.C(446, 118, 5, 'rxh') + FK.T(456, 122, '새 점', { a: 'start' });
      return FK.fig(560, 270, '선형 모델의 이진 분류', body,
        R`양성(채운 점)과 음성(빈 점)을 $\hat y=w_1x_1+w_2x_2+b$의 부호로 가릅니다. 결정 경계는 직선 $w_1x_1+w_2x_2+b=0$이고 위쪽이 $\hat y>0$(양성), 아래쪽이 $\hat y<0$(음성)입니다. 새 점 $x^*=(x_1^*,x_2^*)$는 모델에 넣어 $\hat y$의 부호만 보면 분류됩니다. (여기서는 $w=(1,1)$, $b=-3.4$ 예시)`);
    },
    // 8.4 the three parameter settings of the slides as level lines of y-hat
    planes3() {
      const sq = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      const clip = (poly, w1, w2, b) => {
        const f = (p) => w1 * p[0] + w2 * p[1] + b, out = [];
        poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
          if (fp >= 0) out.push(p);
          if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); } });
        return out;
      };
      const seg = (w1, w2, b, c) => { const p = [];
        if (Math.abs(w2) > 1e-9) [-1, 1].forEach((x) => { const y = (c - b - w1 * x) / w2; if (Math.abs(y) <= 1 + 1e-9) p.push([x, y]); });
        if (Math.abs(w1) > 1e-9) [-1, 1].forEach((y) => { const x = (c - b - w2 * y) / w1; if (Math.abs(x) <= 1 + 1e-9 && !p.some((q) => Math.abs(q[0] - x) + Math.abs(q[1] - y) < 1e-6)) p.push([x, y]); });
        return p.slice(0, 2); };
      const panel = (ox, [w1, w2, b]) => {
        const n = Math.hypot(w1, w2), st = (Math.abs(w1) + Math.abs(w2)) / 3, lv = [-2, -1, 1, 2].map((k) => k * st);
        return { ox, w: 186, h: 206, x: [-1, 1], y: [-1, 1], title: '[w₁, w₂, b] = [' + [w1, w2, b].map((v) => (v < 0 ? '−' + -v : v)).join(', ') + ']', m: [26, 8, 18, 16], xt: [[-1, '−1'], [1, '1']], yt: [[-1, '−1'], [1, '1']],
          c: [{ pts: clip(sq, w1, w2, b), c: 'fl2' }, ...lv.map((c) => ({ pts: seg(w1, w2, b, c - 0), c: 'dm' })).filter((o) => o.pts.length === 2), { pts: seg(w1, w2, b, 0), c: 'ld' }],
          extra: (X, Y) => FK.A(X(0), Y(0), X(0.5 * w1 / n), Y(0.5 * w2 / n), 'rx', 7) + FK.T(X(0.55 * w1 / n) + (w1 >= 0 ? 6 : -6), Y(0.55 * w2 / n) + 3, 'w', { c: 'rl', a: w1 >= 0 ? 'start' : 'end' }) };
      };
      return G2(560, 206, '선형 모델의 세 파라미터', [panel(0, [-1, -5, -1]), panel(187, [3, 3, -1]), panel(374, [3, -2, 1])],
        R`$\hat y=w_1x_1+w_2x_2+b$의 값이 같은 점을 이은 등위선입니다(진한 선이 $\hat y=0$인 결정 경계, 칠한 쪽이 $\hat y>0$). 등위선은 모두 평행하고 화살표 $w$는 $\hat y$가 가장 빨리 커지는 방향으로 경계에 수직입니다. 파라미터가 바뀌면 경계의 기울기와 위치가 바뀝니다. 슬라이드 21의 세 평면이 이 등위선들입니다.`);
    },
    // 8.4 data a line cannot separate
    nonlin() {
      let seed = 11; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      const pos = Array.from({ length: 36 }, () => { const r = Math.sqrt(rnd()) * 0.95, a = rnd() * 6.2832; return [r * Math.cos(a), r * Math.sin(a)]; });
      const neg = Array.from({ length: 56 }, () => { const r = 1.55 + rnd() * 0.65, a = rnd() * 6.2832; return [r * Math.cos(a), r * Math.sin(a)]; });
      const base = (ox, title, extra) => ({ ox, w: 280, h: 270, x: [-2.6, 2.6], y: [-2.28, 2.28], title, m: [26, 10, 16, 10], axes: false,
        extra: (X, Y) => pos.map(([a, b]) => FK.dot(X, Y, a, b)).join('') + neg.map(([a, b]) => FK.dot(X, Y, a, b, true)).join('') + extra(X, Y) });
      const mark = (X, Y, a, b) => FK.L(X(a) - 4, Y(b) - 4, X(a) + 4, Y(b) + 4, 'rx') + FK.L(X(a) - 4, Y(b) + 4, X(a) + 4, Y(b) - 4, 'rx');
      const circ = (X, Y) => `<ellipse class="ld ds" cx="${FK.f1(X(0))}" cy="${FK.f1(Y(0))}" rx="${FK.f1(X(1.25) - X(0))}" ry="${FK.f1(Y(0) - Y(1.25))}"/>`;
      return G2(560, 270, '선형으로 나눌 수 없는 자료', [
        base(0, '(a) 직선 경계: 한쪽에 섞인다', (X, Y) => FK.L(X(0.1), Y(-2.28), X(0.1), Y(2.28), 'ld') + pos.filter((p) => p[0] < 0.1).map(([a, b]) => mark(X, Y, a, b)).join('') + neg.filter((p) => p[0] >= 0.1).map(([a, b]) => mark(X, Y, a, b)).join('')),
        base(280, '(b) 비선형 경계: 나눈다', circ),
      ], R`채운 점이 양성, 빈 점이 음성입니다. (a) 양성이 한가운데 모여 있고 음성이 그 둘레를 감싸면 어떤 직선(예: 세로선)도 영역을 제대로 나누지 못합니다(×가 틀린 점). (b) 곡선(점선) 경계를 쓰면 모두 맞힙니다. 현실의 자료 대부분이 이렇게 선형 분리가 안 되므로 비선형성이 필요합니다. 점은 설명을 위해 만든 예입니다.`);
    },
    // 8.5 a digit image as a vector
    digitvec() {
      const T = FK.T;
      const bmp = ['............', '...ooOOOo...', '..oO@@@@Oo..', '..O@o..o@O..', '..O@o..o@O..', '..oO@@@@@O..', '....oooO@O..', '.......O@o..', '.......O@o..', '......oO@o..', '.....oO@O...', '.....oOo....'];
      const lv = { '.': 0, o: 0.4, O: 0.7, '@': 1 }, v = bmp.join('').split('').map((c) => lv[c]);
      let s = T(112, 22, '12 × 12로 줄여 그린 숫자 9', { c: 'em' });
      bmp.forEach((row, i) => [...row].forEach((c, j) => { s += `<rect class="dotf" x="${28 + j * 14}" y="${34 + i * 14}" width="14" height="14" fill-opacity="${lv[c]}"/><rect class="dm" x="${28 + j * 14}" y="${34 + i * 14}" width="14" height="14"/>`; }));
      s += FK.A(206, 120, 262, 120, 'ax', 8) + T(234, 108, '펼치기', { s: 11 });
      const idx = [0, 1, 2, -1, 15, 16, 17, -1, 141, 142, 143];
      idx.forEach((k, r) => { s += k < 0 ? T(318, 46 + r * 16 + 4, '⋮', { c: 'em' }) : T(318, 46 + r * 16, v[k].toFixed(1)); });
      s += FK.P('M300,32 L294,32 L294,214 L300,214', 'gd') + FK.P('M336,32 L342,32 L342,214 L336,214', 'gd');
      s += T(366, 112, '실제 이미지는', { a: 'start', s: 11 }) + T(366, 128, '28 × 28 = 784차원 벡터', { a: 'start', c: 'em' }) + T(366, 146, '화소마다 0과 1 사이의 값', { a: 'start', s: 11 });
      return FK.fig(560, 222, '숫자 이미지를 벡터로', s,
        R`회색조 이미지는 화소마다 0(검정)에서 1(흰색) 사이의 값을 가지므로, 행을 이어 붙여 한 줄로 펼치면 벡터가 됩니다. 그림은 12×12로 줄여 그린 예이고 실제 MNIST는 $28\times28=784$차원입니다. 이 벡터가 신경망의 입력층입니다.`);
    },
    // 8.5 forward propagation through a digit-recognising network
    digitnet() {
      const T = FK.T, xs = [60, 190, 320, 440];
      const col = (n, y0, y1) => Array.from({ length: n }, (_, i) => y0 + ((y1 - y0) * i) / (n - 1));
      const ys = [[...col(4, 40, 100), ...col(4, 160, 220)], col(8, 40, 220), col(8, 40, 220), col(10, 34, 226)];
      let s = '';
      for (let k = 0; k < 3; k++) ys[k].forEach((a) => ys[k + 1].forEach((b) => { s += FK.L(xs[k], a, xs[k + 1], b, 'dm'); }));
      ys.forEach((c, k) => c.forEach((y, i) => { s += FK.C(xs[k], y, k === 0 ? 7 : 8, k === 3 && i === 7 ? 'rxh' : 'nd'); }));
      s += T(60, 134, '⋮', { c: 'em', s: 20 });
      ys[3].forEach((y, i) => { s += T(460, y + 4, String(i), { a: 'start', c: i === 7 ? 'rl' : '' }); });
      s += T(60, 250, '입력층: 화소 784개', { s: 11 }) + T(190, 250, '은닉층 1', { s: 11 }) + T(320, 250, '은닉층 2', { s: 11 }) + T(440, 250, '출력층: 숫자 0–9', { s: 11 });
      return FK.fig(560, 258, '숫자 인식 신경망의 순방향 계산', s,
        R`784개 화소가 입력층에 들어가 은닉층 둘을 거쳐 10개 출력(숫자 0–9)이 됩니다. 가장 많이 켜진 출력(여기서는 7)이 예측입니다. 은닉층의 뉴런 수는 보이기 위해 줄였고, 슬라이드(3Blue1Brown)의 망은 입력 784, 은닉 16, 16, 출력 10입니다.`);
    },
    // 8.5 digits as combinations of abstract features
    compose() {
      const T = FK.T, th = (x1, y1, x2, y2) => FK.L(x1, y1, x2, y2, 'th'), el = (cx, cy, rx, ry) => `<ellipse class="th" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
      const row = (y, d, parts) => {
        let s = `<text class="em" x="46" y="${y + 13}" text-anchor="middle" style="font-size:38px">${d}</text>` + T(96, y + 5, '=', {});
        parts.forEach((p, k) => { const x = 120 + k * 100; s += FK.R(x, y - 30, 70, 60, 'bm') + p(x + 35, y) + (k ? T(x - 15, y + 5, '+', {}) : ''); });
        return s;
      };
      const s = row(44, '9', [(x, y) => el(x, y - 4, 16, 14), (x, y) => th(x, y - 22, x, y + 22)])
        + row(126, '8', [(x, y) => el(x, y - 6, 12, 10), (x, y) => el(x, y + 3, 16, 14)])
        + row(208, '4', [(x, y) => th(x, y - 22, x, y + 22), (x, y) => th(x, y - 8, x, y + 12), (x, y) => th(x - 18, y, x + 18, y)])
        + T(480, 118, '추상화된 특징들의', { s: 11, c: 'rl' }) + T(480, 134, '조합으로 구별한다', { s: 11, c: 'rl' });
      return FK.fig(560, 250, '숫자를 특징의 조합으로 보기', s,
        R`사람은 숫자를 추상화된 특징들의 조합으로 구별합니다: 9 = 위쪽 동그라미 + 세로획, 8 = 동그라미 + 동그라미, 4 = 세로획 + 짧은 세로획 + 가로획. 신경망의 마지막 은닉층 뉴런이 이런 부분 특징에 하나씩 반응하고, 출력 뉴런은 해당 특징이 함께 켜질 때 켜집니다. (도형은 설명을 위한 도식입니다.)`);
    },
    // 8.5 embedded digits cluster by class
    clusters() {
      let seed = 5; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      const g = () => (rnd() + rnd() + rnd() - 1.5) * 0.5;
      const C = Array.from({ length: 10 }, (_, k) => { const a = (k * 36 + 12) * Math.PI / 180, r = k % 2 ? 2.3 : 1.35; return [r * Math.cos(a) * 1.4, r * Math.sin(a)]; });
      const pts = C.map(([cx, cy]) => Array.from({ length: 16 }, () => [cx + g(), cy + g()]));
      return FK.G({ w: 560, h: 270, x: [-4.2, 4.2], y: [-2.9, 2.9], axes: false, label: '임베딩된 숫자의 군집', m: [8, 8, 8, 8],
        extra: (X, Y) => pts.map((P, k) => P.map(([a, b]) => FK.dot(X, Y, a, b, k % 2 === 1)).join('')).join('') + C.map(([cx, cy], k) => FK.T(X(cx) + 46, Y(cy) + 5, String(k), { c: 'em', s: 14, a: 'start' })).join(''),
        cap: R`학습된 은닉층의 임베딩을 2차원으로 그리면 같은 숫자끼리 한 덩어리로 모이고 다른 숫자와는 떨어집니다(숫자 0–9). 그래서 마지막 층은 선형 분류기만으로 충분합니다. 점의 위치는 이 현상을 보이기 위해 만든 모형이며 실제 데이터가 아닙니다.` });
    },
  });
})();
