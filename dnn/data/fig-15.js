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
