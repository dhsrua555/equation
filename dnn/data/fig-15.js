/* 15 합성곱 신경망의 기초 — 본문 그림. 숫자는 모두 5주차 월요일(3) 슬라이드의 예입니다. */
(function () {
  const R = String.raw;
  const FK = window.FK;
  // a grid of numbers; cells holding a large value are filled
  const grid = (x0, y0, cs, M, opt = {}) => M.map((row, i) => row.map((v, j) => {
    const x = x0 + j * cs, y = y0 + i * cs;
    const on = opt.fill ? opt.fill(v, i, j) : false;
    return FK.R(x, y, cs, cs, on ? 'bm2' : 'bm') + (v === null ? '' : FK.T(x + cs / 2, y + cs / 2 + 3.5, String(v), { s: opt.s || 9 }));
  }).join('')).join('');
  const frame = (x, y, w, h) => FK.R(x, y, w, h, 'sv');
  // a box seen at a slant: front face (x, y, w, h) and a top and side of depth k
  const box3 = (x, y, w, h, k, c = 'bm') => {
    const dx = k * 0.7, dy = -k * 0.5;
    return FK.P(`M${x},${y}L${x + dx},${y + dy}L${x + w + dx},${y + dy}L${x + w},${y}Z`, c)
      + FK.P(`M${x + w},${y}L${x + w + dx},${y + dy}L${x + w + dx},${y + h + dy}L${x + w},${y + h}Z`, c) + FK.R(x, y, w, h, c);
  };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 15.2 3×3 moving average of the slide image (slides 8–13)
    movavg() {
      const F = Array.from({ length: 10 }, () => Array(10).fill(0));
      for (let r = 2; r <= 6; r++) for (let c = 3; c <= 7; c++) F[r][c] = 90;
      F[5][4] = 0; F[8][2] = 90;
      const G = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) => {
        if (i === 0 || j === 0 || i === 9 || j === 9) return null;
        let s = 0; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) s += F[i + a][j + b];
        return s / 9;
      }));
      const cs = 23;
      const body = grid(20, 34, cs, F, { fill: (v) => v > 0, s: 8 }) + grid(300, 34, cs, G, { fill: (v) => v !== null && v >= 50, s: 8 })
        + frame(20 + cs, 34, 3 * cs, 3 * cs) + frame(300 + 2 * cs, 34 + cs, cs, cs)
        + FK.T(135, 22, 'F[x, y]', { c: 'em' }) + FK.T(415, 22, 'G[x, y]', { c: 'em' })
        + FK.T(415, 280, '경계 칸은 계산하지 않음', { s: 11 });
      return FK.fig(560, 290, '3×3 이동 평균', body,
        R`왼쪽 $F$: 값 90인 사각형(가운데 구멍 하나는 0)과 외딴 점 하나. 오른쪽 $G$: 각 칸에 $3\times3$ 이웃의 평균을 적은 결과(슬라이드 13). 표시한 창 안에는 90이 하나뿐이라 $G=90/9=10$입니다. 사각형의 경계는 $0\to30\to60\to90$으로 번지고, 구멍은 80으로 메워지며, 외딴 점은 10짜리 얼룩이 됩니다. 칸을 채운 것은 값이 50 이상인 곳입니다.`);
    },
    // 15.3 one 3×3 filter on the 5×5 image, stride 1, no padding (slides 43–45)
    convex() {
      const I = [[2, 4, 9, 1, 4], [2, 1, 4, 4, 6], [1, 1, 2, 9, 2], [7, 3, 5, 1, 3], [2, 3, 4, 8, 5]];
      const K = [[1, 2, 3], [-4, 7, 4], [2, -5, 1]];
      const O = [[51, 66, 20], [31, 49, 101], [15, 53, -2]];
      const cs = 30;
      const body = grid(20, 40, cs, I, { fill: (v, i, j) => i < 3 && j < 3, s: 11 })
        + grid(240, 70, cs, K, { s: 11 }) + grid(420, 70, cs, O, { fill: (v, i, j) => i === 0 && j === 0, s: 11 })
        + FK.T(215, 118, '×', { c: 'em', s: 18 }) + FK.T(395, 118, '=', { c: 'em', s: 18 })
        + FK.T(95, 30, '입력 5×5', { c: 'em' }) + FK.T(285, 60, '필터 3×3', { c: 'em' }) + FK.T(465, 60, '특성 맵 3×3', { c: 'em' })
        + FK.T(280, 215, '2·1 + 4·2 + 9·3 + 2·(−4) + 1·7 + 4·4 + 1·2 + 1·(−5) + 2·1 = 51', { s: 11, c: 'lb' });
      return FK.fig(560, 230, '필터 하나의 합성곱', body,
        R`채운 $3\times3$ 조각과 필터를 원소끼리 곱해 더하면 특성 맵의 왼쪽 위 51이 됩니다. 창을 한 칸씩 옮기며 같은 계산을 하면 $3\times3$ 특성 맵이 나옵니다(슬라이드 43–45). 필터의 아홉 수가 학습할 가중치입니다.`);
    },
    // 15.6 fully connected vs convolution: every edge is its own weight vs three shared weights (slides 63–65)
    fcconv() {
      const xs = (n, x0, gap) => Array.from({ length: n }, (_, k) => x0 + k * gap);
      const top = xs(7, 30, 34), bot = xs(5, 64, 34);
      const node = (x, y) => FK.C(x, y, 9, 'nd');
      let fc = '';
      bot.forEach((bx) => top.forEach((tx) => { fc += FK.L(tx, 60, bx, 160, 'dm'); }));
      top.forEach((x) => { fc += node(x, 60); }); bot.forEach((x) => { fc += node(x, 160); });
      const ox = 290, cls = ['ld', 'rx', 'vl'];
      let cv = '';
      bot.forEach((bx, k) => [0, 1, 2].forEach((d) => { cv += FK.L(ox + top[k + d], 60, ox + bx, 160, cls[d]); }));
      top.forEach((x) => { cv += node(ox + x, 60); }); bot.forEach((x) => { cv += node(ox + x, 160); });
      const body = fc + cv
        + FK.T(132, 26, '완전연결층: 가중치 7×5 = 35개', { c: 'em' }) + FK.T(ox + 132, 26, '합성곱층: 가중치 3개를 공유', { c: 'em' })
        + FK.T(132, 196, 'l번째 층 → (l+1)번째 층', { s: 11 }) + FK.T(ox + 132, 196, '선의 종류 = 같은 가중치 w₁, w₂, w₃', { s: 11 });
      return FK.fig(560, 210, '완전연결층과 합성곱층의 연결', body,
        R`(왼쪽) 완전연결층은 위층의 모든 노드가 아래층의 모든 노드에 연결되고 선마다 다른 가중치가 있습니다. (오른쪽) 1차원 합성곱층(필터 크기 3)은 각 노드가 이웃 세 노드에만 연결되고(국소 연결), 같은 종류의 선은 모든 위치에서 같은 가중치입니다(가중치 공유). 슬라이드 63–65의 그림을 1차원으로 그렸습니다.`);
    },
    // 15.3 a 5×5×3 filter slides over a 32×32×3 image and leaves one 28×28 activation map; six filters give 28×28×6 (slides 15–20, 37)
    convvol() {
      const img = box3(30, 74, 120, 120, 20), flt = box3(46, 90, 30, 30, 20, 'bm2');
      const map = box3(236, 82, 105, 105, 4), cell = FK.R(251, 97, 8, 8, 'bm2');
      let vol = '';
      for (let s = 5; s >= 0; s--) vol += FK.R(412 + s * 6, 82 - s * 5, 105, 105, 'bm');
      vol += FK.R(412, 82, 8, 8, 'bm2');
      const body = img + flt + map + cell + vol
        + FK.L(76, 90, 251, 97, 'dm ds') + FK.L(76, 120, 251, 105, 'dm ds')
        + FK.T(30, 46, '필터 5×5×3 (채운 상자)', { a: 'start', s: 11, c: 'lb' })
        + FK.T(90, 214, '입력 32×32×3', { c: 'em' }) + FK.T(90, 230, '깊이 3 = RGB', { s: 11 })
        + FK.T(288, 40, '한 칸 = wᵀx + b', { s: 11, c: 'em' }) + FK.T(288, 54, '75개 곱의 합 + 편향', { s: 11 })
        + FK.T(288, 214, '활성화 맵 28×28×1', { c: 'em' }) + FK.T(288, 230, '32 − 5 + 1 = 28', { s: 11 })
        + FK.A(352, 134, 404, 134, 'ax', 7) + FK.T(378, 126, '필터 6개', { s: 11 })
        + FK.T(480, 214, '출력 28×28×6', { c: 'em' }) + FK.T(480, 230, '필터 하나 = 맵 한 장', { s: 11 });
      return FK.fig(560, 244, '합성곱층: 입력 부피, 필터, 활성화 맵', body,
        R`필터는 입력의 **깊이 전체**(3채널)로 뻗은 $5\times5\times3$ 상자입니다. 필터를 가로·세로로만 미끄러뜨리며 각 위치에서 75차원 내적에 편향을 더하면(점선) 활성화 맵의 한 칸이 되고, 모든 위치를 채우면 $28\times28\times1$ 맵 한 장이 나옵니다. 필터를 6개 쓰면 맵이 6장 쌓여 출력은 $28\times28\times6$입니다(슬라이드 15–20, 37).`);
    },
    // 15.4 where a 3×3 filter can sit on a 7×7 input: stride 1, stride 2, and zero padding 1 (slides 21–34)
    stridepad() {
      const cells = (x0, y0, n, cs, zero) => {
        let s = '';
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const z = zero && (i === 0 || j === 0 || i === n - 1 || j === n - 1);
          s += FK.R(x0 + j * cs, y0 + i * cs, cs, cs, 'bm') + (z ? FK.T(x0 + j * cs + cs / 2, y0 + i * cs + cs / 2 + 3, '0', { s: 8 }) : '');
        }
        return s;
      };
      const win = (x0, y0, cs, c, r, cls, k) => FK.R(x0 + c * cs + k, y0 + r * cs + k, 3 * cs - 2 * k, 3 * cs - 2 * k, cls);
      const y0 = 40, cs = 20, cp = 140 / 9;
      const body = cells(20, y0, 7, cs) + win(20, y0, cs, 0, 0, 'ld', 1) + win(20, y0, cs, 1, 0, 'rx', 3)
        + cells(205, y0, 7, cs) + win(205, y0, cs, 0, 0, 'ld', 1) + win(205, y0, cs, 2, 0, 'rx', 3) + win(205, y0, cs, 4, 0, 'vl', 1)
        + cells(390, y0, 9, cp, true) + FK.R(390 + cp, y0 + cp, 7 * cp, 7 * cp, 'th') + win(390, y0, cp, 0, 0, 'ld', 1) + win(390, y0, cp, 1, 0, 'rx', 3)
        + FK.T(90, 24, '보폭 1', { c: 'em' }) + FK.T(275, 24, '보폭 2', { c: 'em' }) + FK.T(460, 24, '패딩 1, 보폭 1', { c: 'em' })
        + FK.T(90, 202, '(7 − 3)/1 + 1 = 5', { s: 11 }) + FK.T(275, 202, '(7 − 3)/2 + 1 = 3', { s: 11 }) + FK.T(460, 202, '(7 − 3 + 2)/1 + 1 = 7', { s: 11 })
        + FK.T(90, 220, '출력 5×5', { c: 'lb' }) + FK.T(275, 220, '출력 3×3', { c: 'lb' }) + FK.T(460, 220, '출력 7×7 (크기 유지)', { c: 'lb' });
      return FK.fig(560, 232, '보폭과 패딩에 따른 필터의 자리', body,
        R`$7\times7$ 입력 위의 $3\times3$ 필터. 색이 다른 굵은 테두리가 필터의 첫 번째, 두 번째, 세 번째 자리이고, 오른쪽의 두꺼운 검은 테두리는 원래의 $7\times7$ 입력입니다. (왼쪽) 한 칸씩 옮기면 가로로 다섯 자리, (가운데) 두 칸씩 옮기면 0, 2, 4번 칸의 세 자리, (오른쪽) 테두리에 0을 한 칸 덧대면 $9\times9$에서 일곱 자리가 되어 크기가 그대로입니다. 출력 크기는 모두 $\frac{N-K+2P}{S}+1$입니다.`);
    },
    // 15.5 2×2 max and average pooling with stride 2 on the slide's 4×4 input (slides 56–58)
    pooling() {
      const I = [[5, 10, 6, 7], [4, 0, 4, 3], [2, 4, 3, 4], [0, 8, 1, 6]];
      const MX = [[10, 7], [8, 6]], AV = [[4.75, 5], [3.5, 3.5]];
      const q = (i, j) => (Math.floor(i / 2) + Math.floor(j / 2)) % 2 === 0;
      const cs = 40, big = (v, i, j) => v === MX[Math.floor(i / 2)][Math.floor(j / 2)];
      let body = '';
      I.forEach((row, i) => row.forEach((v, j) => {
        body += FK.R(30 + j * cs, 50 + i * cs, cs, cs, q(i, j) ? 'bm2' : 'bm') + FK.T(30 + j * cs + cs / 2, 50 + i * cs + cs / 2 + 4, String(v), { s: 13, c: big(v, i, j) ? 'lb' : '' });
      }));
      [[0, 0], [0, 2], [2, 0], [2, 2]].forEach(([i, j]) => { body += frame(30 + j * cs, 50 + i * cs, 2 * cs, 2 * cs); });
      const out = (x0, y0, M) => M.map((row, i) => row.map((v, j) => FK.R(x0 + j * cs, y0 + i * cs, cs, cs, q(2 * i, 2 * j) ? 'bm2' : 'bm') + FK.T(x0 + j * cs + cs / 2, y0 + i * cs + cs / 2 + 4, String(v), { s: 13, c: 'em' })).join('')).join('');
      body += out(310, 36, MX) + out(310, 152, AV)
        + FK.T(110, 36, '입력 4×4', { c: 'em' }) + FK.T(350, 26, '최대 풀링', { c: 'em' }) + FK.T(350, 142, '평균 풀링', { c: 'em' })
        + FK.A(200, 100, 300, 76, 'ax', 7) + FK.A(200, 160, 300, 192, 'ax', 7) + FK.T(250, 162, '2×2 창, 보폭 2', { s: 11 })
        + FK.T(400, 70, '창마다 가장 큰 값', { a: 'start', s: 11 }) + FK.T(400, 86, '{5, 10, 4, 0} → 10', { a: 'start', s: 11, c: 'lb' })
        + FK.T(400, 186, '창마다 평균', { a: 'start', s: 11 }) + FK.T(400, 202, '19/4 = 4.75', { a: 'start', s: 11, c: 'lb' })
        + FK.T(280, 246, '채널마다 따로 적용 · 학습할 매개변수 없음', { s: 11 });
      return FK.fig(560, 256, '최대 풀링과 평균 풀링', body,
        R`$4\times4$ 입력을 같은 색의 $2\times2$ 창 네 개로 나누고(겹치지 않게 보폭 2), 창마다 수 하나만 남깁니다. 최대 풀링은 창에서 가장 큰 값(색을 넣은 수)을, 평균 풀링은 네 수의 평균을 남깁니다. 가로·세로가 절반이 되고 채널 수는 그대로입니다(슬라이드 56–58).`);
    },
    // 15.5 a fully connected layer on an image: stretch 32×32×3 to 3072×1, then W (10×3072) gives 10 numbers (slides 60–61)
    // 15.7 tensor sizes of the MNIST CNN in practice 8-2 (box height ∝ width/height, box width ∝ channels)
    mnistcnn() {
      const st = [[28, 1, '입력', '28×28×1'], [28, 32, 'conv1', '28×28×32'], [14, 32, 'pool', '14×14×32'], [14, 64, 'conv2', '14×14×64'], [7, 64, 'pool', '7×7×64']];
      const ops = [['conv 3×3', 'P=1'], ['풀링 2', ''], ['conv 3×3', 'P=1'], ['풀링 2', '']];
      const yb = 170, gap = 62, ya = yb - 28;
      const arrow = (x1, x2, l1, l2) => FK.A(x1 + 4, ya, x2 - 6, ya, 'ax', 7) + FK.T((x1 + x2) / 2, ya - (l2 ? 22 : 8), l1, { s: 10 }) + (l2 ? FK.T((x1 + x2) / 2, ya - 8, l2, { s: 10 }) : '');
      let x = 34, body = '', prev = null;
      st.forEach(([n, ch, name, size], i) => {
        const h = n * 3.2, w = 3 + ch * 0.42, k = h * 0.3, y = yb - h;
        if (prev) body += arrow(prev, x, ops[i - 1][0], ops[i - 1][1]);
        body += box3(x, y, w, h, k, i % 2 ? 'bm2' : 'bm') + FK.T(x + w / 2 + 4, yb + 16, size, { s: 10 }) + FK.T(x + w / 2 + 4, yb + 30, name, { s: 10, c: 'em' });
        prev = x + w + k * 0.7;
        x = prev + gap;
      });
      body += arrow(prev, x, '펴기', '');
      body += FK.R(x, 30, 12, 140, 'bm') + FK.T(x + 6, yb + 16, '3136', { s: 10 }) + FK.T(x + 6, yb + 30, '벡터', { s: 10, c: 'em' });
      const x2 = x + 12 + gap;
      body += arrow(x + 12, x2, 'fc', '');
      body += FK.R(x2, 120, 12, 50, 'bm2') + FK.T(x2 + 6, yb + 16, '10', { s: 10 }) + FK.T(x2 + 6, yb + 30, '로짓', { s: 10, c: 'em' });
      return FK.fig(600, 214, 'MNIST CNN(실습 8-2)의 텐서 크기', body,
        R`실습 8-2의 CNN에서 이미지 한 장의 텐서 크기. 상자의 높이는 가로·세로 크기, 폭은 채널 수를 대략 나타냅니다. $3\times3$ 합성곱(패딩 1)은 가로·세로를 보존하고 채널을 늘리며, $2\times2$ 최대 풀링은 채널은 그대로 두고 가로·세로를 절반으로 줄입니다. 마지막 $7\times7\times64$를 3136차원으로 펴서 완전연결층이 로짓 10개를 냅니다.`);
    },
    fcstretch() {
      const img = box3(20, 96, 72, 72, 14);
      let rows = '';
      for (let r = 1; r < 10; r++) rows += FK.L(250, 100 + r * 6, 470, 100 + r * 6, 'dm');
      const body = img + FK.A(104, 132, 140, 132, 'ax', 7) + FK.T(122, 122, '펴기', { s: 11 })
        + FK.R(150, 20, 18, 220, 'bm') + FK.R(150, 20, 18, 220, 'fl')
        + FK.T(159, 14, 'x', { c: 'it' }) + FK.T(178, 236, '3072×1', { a: 'start', s: 11 })
        + FK.R(250, 100, 220, 60, 'bm') + rows + FK.R(250, 118, 220, 6, 'bm2')
        + FK.T(360, 92, 'W: 10×3072', { c: 'em' })
        + FK.R(520, 100, 18, 60, 'bm') + FK.R(520, 118, 18, 6, 'bm2') + FK.T(529, 92, 'Wx', { c: 'it' }) + FK.T(529, 176, '10×1', { s: 11 })
        + FK.L(470, 121, 520, 121, 'dm ds') + FK.L(168, 121, 250, 121, 'dm ds') + FK.T(495, 135, '=', { s: 14, c: 'em' })
        + FK.T(56, 190, '32×32×3', { c: 'em' })
        + FK.T(360, 186, '한 칸 = W의 한 행 · x', { c: 'lb' }) + FK.T(360, 202, '3072차원 내적', { s: 11 });
      return FK.fig(560, 246, '이미지에 쓰는 완전연결층', body,
        R`$32\times32\times3$ 이미지를 한 줄로 펴서 $3072\times1$ 벡터 $x$를 만들고, $10\times3072$ 가중치 $W$를 곱해 10개의 활성화를 얻습니다. 출력의 한 칸(칠한 칸)은 $W$의 한 행(칠한 행)과 $x$의 3072차원 내적입니다. 펴는 순간 어느 화소가 어느 화소의 이웃인지는 사라집니다(슬라이드 60–61).`);
    },
  });
})();

/* 15 보충 그림: 슬라이드의 나머지 계산 예와 도식 (필터 두 개, 제로 패딩, 전역 평균 풀링, 필터 반응, 1×1 합성곱, 층 쌓기, 특성의 위계) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const cell = (x, y, w, h, v, o = {}) => FK.R(x, y, w, h, o.on ? 'bm2' : 'bm') + (v === null || v === undefined ? '' : FK.T(x + w / 2, y + h / 2 + 3.5, String(v), { s: o.s || 10, c: o.c || '' }));
  const grid = (x0, y0, cs, M, o = {}) => M.map((r, i) => r.map((v, j) => cell(x0 + j * cs, y0 + i * cs, cs, cs, v, { on: o.fill ? o.fill(v, i, j) : false, s: o.s })).join('')).join('');
  const frame = (x, y, w, h) => FK.R(x, y, w, h, 'sv');
  const box3 = (x, y, w, h, k, c = 'bm') => {
    const dx = k * 0.7, dy = -k * 0.5;
    return FK.P(`M${x},${y}L${x + dx},${y + dy}L${x + w + dx},${y + dy}L${x + w},${y}Z`, c)
      + FK.P(`M${x + w},${y}L${x + w + dx},${y + dy}L${x + w + dx},${y + h + dy}L${x + w},${y + h}Z`, c) + FK.R(x, y, w, h, c);
  };
  const conv = (I, K) => { const n = I.length - K.length + 1, m = I[0].length - K[0].length + 1; return Array.from({ length: n }, (_, i) => Array.from({ length: m }, (_, j) => { let s = 0; K.forEach((r, a) => r.forEach((w, b) => { s += w * I[i + a][j + b]; })); return Math.round(s * 100) / 100; })); };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 15.3 two 3×3 filters on a 4×4 input: one 2×2 feature map per filter (slides 47–50)
    filters2() {
      const X = [[1, 0, 3, 1], [0, -1, 2, 0], [2, 0, 4, 2], [0, 3, 0, 1]];
      const W1 = [[1, 1, 0], [0, 1, -1], [0, 0, 0]], W2 = [[-1, 1, 0], [0, -1, 0], [-1, 1, 0]];
      const F1 = conv(X, W1), F2 = conv(X, W2);
      const body = grid(20, 60, 30, X, { fill: (v, i, j) => i < 3 && j < 3, s: 12 })
        + grid(200, 30, 26, W1, { s: 11 }) + grid(200, 140, 26, W2, { s: 11 })
        + grid(360, 52, 34, F1, { s: 12, fill: (v, i, j) => i === 0 && j === 0 }) + grid(360, 162, 34, F2, { s: 12, fill: (v, i, j) => i === 0 && j === 0 })
        + FK.T(80, 46, '입력 4×4', { c: 'em' }) + FK.T(239, 24, '필터 1', { c: 'em' }) + FK.T(239, 234, '필터 2', { c: 'em' })
        + FK.T(394, 44, '특성 맵 1', { c: 'em' }) + FK.T(394, 154, '특성 맵 2', { c: 'em' })
        + FK.A(150, 100, 196, 70, 'ax', 7) + FK.A(150, 130, 196, 170, 'ax', 7)
        + FK.A(282, 70, 354, 86, 'ax', 7) + FK.A(282, 180, 354, 196, 'ax', 7)
        + FK.T(496, 90, '2×2×2', { c: 'em' }) + FK.T(496, 108, '출력 부피', { s: 11 })
        + FK.T(496, 200, '필터마다 맵 한 장', { s: 10 });
      return FK.fig(560, 250, '필터 두 개: 입력 4×4 → 출력 2×2×2', body,
        R`입력 $4\times4$에 $3\times3$ 필터 두 개를 보폭 1, 패딩 없이 적용합니다(슬라이드 47–50). 채운 왼쪽 위 조각이 각 필터와 내적되어 특성 맵의 왼쪽 위 칸이 됩니다. 창을 오른쪽·아래로 한 칸씩 옮기면 나머지 칸이 채워지고, 필터가 두 개이므로 출력은 $2\times2\times2$입니다. 필터 2의 오른쪽 아래 칸은 슬라이드의 $-5$ 대신 계산대로 $-4$입니다.`);
    },
    // 15.4 zero padding 1 keeps the 5×5 output of the 5×5 image (slide 46)
    zeropad() {
      const I = [[2, 4, 9, 1, 4], [2, 1, 4, 4, 6], [1, 1, 2, 9, 2], [7, 3, 5, 1, 3], [2, 3, 4, 8, 5]];
      const K = [[1, 2, 3], [-4, 7, 4], [2, -5, 1]];
      const P = Array.from({ length: 7 }, (_, i) => Array.from({ length: 7 }, (_, j) => (i === 0 || j === 0 || i === 6 || j === 6) ? 0 : I[i - 1][j - 1]));
      const O = conv(P, K);
      const body = grid(14, 50, 24, P, { s: 10, fill: (v, i, j) => i < 3 && j < 3 }) + frame(14 + 24, 50 + 24, 120, 120)
        + grid(236, 76, 22, K, { s: 10 }) + grid(364, 50, 34, O, { s: 11, fill: (v, i, j) => i === 0 && j === 0 })
        + FK.T(98, 36, '입력 + 0 테두리 7×7', { c: 'em' }) + FK.T(269, 66, '필터 3×3', { c: 'em' }) + FK.T(450, 36, '특성 맵 5×5', { c: 'em' })
        + FK.T(214, 120, '×', { c: 'em', s: 18 }) + FK.T(340, 120, '=', { c: 'em', s: 18 })
        + FK.T(280, 254, '0·1 + 0·2 + 0·3 + 0·(−4) + 2·7 + 4·4 + 0·2 + 2·(−5) + 1·1 = 21', { s: 11, c: 'lb' });
      return FK.fig(560, 268, '제로 패딩: 5×5 입력에서 5×5 출력', body,
        R`같은 $5\times5$ 입력과 필터에 테두리를 0 한 칸으로 덧대면(굵은 테두리가 원래 입력) $7\times7$에서 $7-3+1=5$이므로 출력이 입력과 같은 $5\times5$로 유지됩니다(슬라이드 46). 패딩 없이는 $3\times3$이었습니다. 채운 왼쪽 위 조각에는 0이 다섯 개 들어 있어 값이 $2\cdot7+4\cdot4-2\cdot5+1=21$입니다.`);
    },
    // 15.5 global average pooling: each channel's map becomes one number (slide 59)
    gap() {
      const A = [[1, 3, 2], [4, 6, 5], [7, 9, 8]], B = [[0, 2, 1], [3, 5, 4], [5, 3, 4]], C = [[9, 1, 0], [2, 8, 1], [0, 3, 12]];
      const avg = (M) => Math.round(M.flat().reduce((a, b) => a + b, 0) / 9 * 100) / 100;
      let body = '';
      [A, B, C].forEach((M, k) => {
        const x = 30 + k * 130;
        body += grid(x, 60, 26, M, { s: 11 }) + FK.T(x + 39, 50, `채널 ${k + 1}`, { c: 'em' })
          + FK.A(x + 39, 142, x + 39, 172, 'ax', 7) + cell(x + 14, 176, 50, 28, avg(M), { on: true, s: 13, c: 'lb' })
          + FK.T(x + 39, 224, `합 ${M.flat().reduce((a, b) => a + b, 0)} ÷ 9`, { s: 11 });
      });
      body += FK.T(480, 100, '3×3×3', { c: 'em' }) + FK.T(480, 118, '→ 1×1×3', { c: 'em' }) + FK.T(480, 138, '채널마다 한 수', { s: 11 }) + FK.T(480, 156, '매개변수 없음', { s: 11 });
      return FK.fig(560, 240, '전역 평균 풀링', body,
        R`채널마다 활성화 맵 전체를 평균해 숫자 하나로 만듭니다. $H\times W\times C$ 부피가 $C$차원 벡터가 됩니다(슬라이드 59의 $6\times6$ 맵 대신 계산하기 쉬운 $3\times3$ 맵 세 장을 예로 정한 값입니다).`);
    },
    // 15.2 a 4×4 vertical-bar filter on an 8×8 stroke image: the response moves with the image (slides 66–69)
    filterresp() {
      const img = (c0) => Array.from({ length: 8 }, (_, i) => Array.from({ length: 8 }, (_, j) => (i >= 1 && i <= 5 && (j === c0 || j === c0 + 1)) ? 1 : (i === 6 && (j === c0 - 1 || j === c0 || j === c0 + 1)) ? 1 : 0));
      const W = [[0, 1, 1, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0.9, 0.9, 0]];
      const panel = (ox, c0, title) => {
        const I = img(c0), O = conv(I, W), cs = 12, oc = 25;
        const pix = I.map((r, i) => r.map((v, j) => (v ? `<rect class="bm2" style="fill-opacity:.75" x="${ox + j * cs}" y="${62 + i * cs}" width="${cs}" height="${cs}"/>` : FK.R(ox + j * cs, 62 + i * cs, cs, cs, 'bm'))).join('')).join('');
        const heat = O.map((r, i) => r.map((v, j) => `<rect class="bm2" style="fill-opacity:${(0.05 + 0.5 * Math.min(v, 8) / 8).toFixed(2)}" x="${ox + 130 + j * oc}" y="${62 + i * oc}" width="${oc}" height="${oc}"/>` + FK.T(ox + 130 + j * oc + oc / 2, 62 + i * oc + oc / 2 + 3, v.toFixed(1), { s: 7.5 })).join('')).join('');
        return pix + heat + FK.T(ox + 48, 46, title, { c: 'em', s: 11 }) + FK.T(ox + 192, 46, '필터 반응 5×5', { c: 'em', s: 11 }) + FK.A(ox + 100, 125, ox + 126, 125, 'ax', 7);
      };
      const body = panel(20, 2, '획이 왼쪽에') + panel(300, 4, '같은 획, 오른쪽으로 2칸')
        + FK.T(280, 206, '필터 4×4: 가운데 두 열이 1(아랫줄은 0.9), 바깥 열은 0', { s: 11 })
        + FK.T(280, 224, '진한 칸 = 큰 반응. 획이 옮겨 가면 반응도 따라간다', { s: 11, c: 'lb' });
      return FK.fig(560, 238, '필터 하나의 반응은 이미지와 함께 움직인다', body,
        R`세로 막대 모양 필터(슬라이드 66–67의 $4\times4$ 필터)를 $8\times8$ 획 이미지의 모든 위치에 적용한 반응입니다(이미지는 보기 위해 새로 정한 값). 진한 칸일수록 반응이 큽니다. 같은 획을 오른쪽으로 2칸 옮기면 반응 지도도 오른쪽으로 2칸 옮겨 갑니다. 이것이 합성곱의 이동 등변성입니다(슬라이드 69).`);
    },
    // 15.6 1×1 convolution: the same 64→32 linear map at every pixel (slide 53)
    onebyone() {
      const body = box3(30, 80, 80, 80, 56) + box3(380, 80, 80, 80, 28, 'bm2')
        + FK.L(84, 114, 84 + 39, 114 - 28, 'gd') + FK.C(84, 114, 3, 'nd')
        + FK.L(434, 114, 434 + 19.6, 114 - 14, 'gd') + FK.C(434, 114, 3, 'nd')
        + FK.T(70, 190, '입력 56×56×64', { c: 'em' }) + FK.T(420, 190, '출력 56×56×32', { c: 'em' })
        + FK.A(210, 118, 340, 118, 'ax', 7) + FK.T(275, 100, '1×1 합성곱, 필터 32개', { c: 'em', s: 11 }) + FK.T(275, 136, '필터 하나 = 1×1×64', { s: 11 })
        + FK.T(275, 154, '= 64차원 내적 + 편향', { s: 11 })
        + FK.T(250, 222, '한 화소: 64차원 벡터 → W (32×64) → 32차원 벡터, 같은 W를 모든 화소에', { s: 11, c: 'lb' });
      return FK.fig(560, 240, '1×1 합성곱', body,
        R`$56\times56\times64$ 입력의 한 화소(선으로 표시한 64개 값)에 $1\times1\times64$ 필터 32개를 적용하면 32개 수가 나옵니다. 한 화소만 보면 $W\in\mathbb R^{32\times64}$인 완전연결층이고, 같은 $W$를 모든 화소에 쓴다는 점이 다릅니다(슬라이드 53). 가로·세로 크기는 그대로, 깊이만 64에서 32로 줄었습니다.`);
    },
    // 15.3 stacking convolution layers: 32×32×3 -> 28×28×6 -> 24×24×10 (slides 37–38)
    convchain() {
      const body = box3(20, 74, 40, 100, 12) + box3(220, 80, 34, 88, 20, 'bm2') + box3(410, 88, 28, 76, 30)
        + FK.T(50, 196, '32×32×3', { c: 'em' }) + FK.T(245, 196, '28×28×6', { c: 'em' }) + FK.T(435, 196, '24×24×10', { c: 'em' })
        + FK.A(100, 124, 190, 124, 'ax', 7) + FK.A(300, 124, 380, 124, 'ax', 7)
        + FK.T(145, 96, 'CONV + ReLU', { s: 11, c: 'em' }) + FK.T(145, 112, '5×5×3 필터 6개', { s: 11 }) + FK.T(145, 148, '6×(75+1) = 456', { s: 11, c: 'lb' })
        + FK.T(340, 96, 'CONV + ReLU', { s: 11, c: 'em' }) + FK.T(340, 112, '5×5×6 필터 10개', { s: 11 }) + FK.T(340, 148, '10×(150+1) = 1,510', { s: 11, c: 'lb' })
        + FK.T(520, 124, '⋯', { s: 20, c: 'em' }) + FK.T(280, 230, '필터의 깊이는 항상 앞 층의 깊이와 같다 (3, 6, …)', { s: 11 });
      return FK.fig(560, 244, '합성곱층 쌓기', body,
        R`합성곱층 사이에 활성화 함수를 끼워 쌓습니다(슬라이드 37–38). $32\times32\times3$ 입력에 $5\times5\times3$ 필터 6개를 쓰면 $28\times28\times6$, 다시 $5\times5\times6$ 필터 10개를 쓰면 $24\times24\times10$이 됩니다. 각 층의 매개변수는 $C_{\text{out}}(K^2C_{\text{in}}+1)$로 $456$과 $1{,}510$개이고 입력의 가로·세로와 무관합니다.`);
    },
    // 15.6 features by depth: edges -> textures -> parts -> classifier (slides 51–52)
    featurehier() {
      const stage = (x, t, sub) => FK.R(x, 40, 118, 44, 'bm') + FK.T(x + 59, 58, t, { s: 11, c: 'em' }) + FK.T(x + 59, 74, sub, { s: 10 });
      let body = stage(8, '낮은 층', '모서리·색 얼룩') + stage(146, '중간 층', '질감·무늬') + stage(284, '높은 층', '물체의 부분') + stage(422, '선형 분류기', '클래스 점수')
        + FK.A(128, 62, 144, 62, 'ax', 6) + FK.A(266, 62, 282, 62, 'ax', 6) + FK.A(404, 62, 420, 62, 'ax', 6);
      // glyphs: oriented strokes
      for (let k = 0; k < 4; k++) body += FK.L(34 + k * 22, 150, 50 + k * 22, 112, 'gd') + FK.L(34 + k * 22, 190, 46 + k * 22, 160, 'dm');
      // texture: a small repeating dot lattice
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) body += FK.C(170 + j * 18, 108 + i * 18, 4, (i + j) % 2 ? 'nd' : 'sp');
      // part: a wheel-like circle with spokes
      body += FK.C(330, 150, 34, 'nd') + FK.C(330, 150, 8, 'sp') + FK.L(330, 116, 330, 184, 'gd') + FK.L(296, 150, 364, 150, 'gd');
      // classifier bars
      [['car', 70], ['truck', 30], ['ship', 12]].forEach(([n, w], k) => { body += FK.R(440, 112 + k * 26, w, 16, 'bm2') + FK.T(446 + w, 125 + k * 26, n, { s: 10, a: 'start' }); });
      body += FK.T(80, 214, '작은 영역', { s: 11 }) + FK.T(210, 214, '더 넓은 영역', { s: 11 }) + FK.T(330, 214, '더 넓고 추상적', { s: 11 });
      return FK.fig(560, 232, '깊이에 따라 달라지는 특성', body,
        R`CNN의 특성은 층이 깊어질수록 더 넓은 영역을 보고 더 추상적이 됩니다(슬라이드 51–52: VGG-16의 Conv1_1, Conv3_2, Conv5_3 필터와 활성화). 낮은 층은 모서리와 색 얼룩, 중간 층은 질감과 반복 무늬, 높은 층은 바퀴 같은 물체의 부분을 잡고, 마지막 선형 분류기가 이를 합쳐 클래스 점수를 냅니다. 그림의 무늬는 이해를 돕는 도식입니다.`);
    },
  });
})();
