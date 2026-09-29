/* 13 합성곱 신경망 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, legend } = FK;
  const T = FK.T;

  // a small synthetic "photo": sky gradient, a bright disc and a dark block
  const scene = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => {
    const u = j / (n - 1), v = i / (n - 1);
    let s = 0.25 + 0.35 * v;
    if ((u - 0.68) ** 2 + (v - 0.32) ** 2 < 0.045) s = 0.95;
    if (u > 0.12 && u < 0.42 && v > 0.52 && v < 0.88) s = 0.08;
    return s;
  }));
  const conv2 = (I, K) => {
    const out = [];
    for (let j = 0; j + K.length <= I.length; j++) {
      const row = [];
      for (let k = 0; k + K[0].length <= I[0].length; k++) {
        let s = 0;
        K.forEach((kr, l) => kr.forEach((kv, m) => { s += I[j + l][k + m] * kv; }));
        row.push(s);
      }
      out.push(row);
    }
    return out;
  };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 10.1.1 pixels have structure: permuting them destroys the image
    pixperm() {
      const n = 14, img = scene(n), flat = img.flat();
      const r = MF.rng(5), perm = flat.slice();
      for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      const g2 = Array.from({ length: n }, (_, i) => perm.slice(i * n, i * n + n));
      const r2 = MF.rng(9), g3 = Array.from({ length: n }, () => Array.from({ length: n }, () => r2()));
      const c = 11, top = 30;
      let s = MF.pix(20, top, c, img, { max: 1, gray: true }) + MF.pix(205, top, c, g2, { max: 1, gray: true }) + MF.pix(390, top, c, g3, { max: 1, gray: true });
      s += T(97, 20, '1. 자연 영상(격자 구조)', { c: 'em' }) + T(282, 20, '2. 같은 화소를 섞음', { c: 'em' }) + T(467, 20, '3. 화소마다 무작위', { c: 'em' });
      s += FK.A(180, 107, 199, 107, 'ax', 7) + FK.A(365, 107, 384, 107, 'ax', 7);
      s += T(282, 200, '값의 분포는 같지만 영상이 아님', { s: 11 }) + T(467, 200, '자연 영상이 나올 확률 ≈ 0', { s: 11 });
      return FK.fig(560, 212, '화소의 공간 구조', s,
        R`첫 영상의 화소 196개를 무작위로 섞으면(가운데) 세기의 분포는 그대로인데 영상으로 보이지 않습니다. 정보는 값보다 **어느 화소가 어느 화소 옆에 있는가**에 있습니다. 가까운 화소가 비슷하다는 국소 상관이 CNN이 쓰는 사전 지식입니다.`);
    },
    // 10.2.1 receptive field, kernel and feature detector
    receptive() {
      const n = 7, c = 22, x0 = 20, y0 = 34;
      let s = '';
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<rect class="${i >= 1 && i <= 3 && j >= 2 && j <= 4 ? 'rg hl' : 'rg'}" x="${x0 + j * c}" y="${y0 + i * c}" width="${c - 2}" height="${c - 2}"/>`;
      s += FK.R(x0 + 2 * c - 1, y0 + c - 1, 3 * c, 3 * c, 'rx');
      const hx = 260, hc = 22;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) s += `<rect class="${i === 1 && j === 2 ? 'rg hl' : 'rg'}" x="${hx + j * hc}" y="${y0 + 22 + i * hc}" width="${hc - 2}" height="${hc - 2}"/>`;
      s += FK.R(hx + 2 * hc - 1, y0 + 22 + hc - 1, hc, hc, 'rx');
      s += FK.A(x0 + 5 * c + 4, y0 + 2 * c, hx + 2 * hc, y0 + 22 + 1.5 * hc, 'rx', 8);
      s += T(x0 + n * c / 2, 24, '영상과 수용 영역(3×3)', { c: 'em' }) + T(hx + 2.5 * hc, 44, '은닉 유닛(특징 맵)', { c: 'em' });
      const K = [[0.4, 1.7, 0.9], [2.3, -2.1, 4.0], [-1.4, 0.7, 2.1]];
      s += MF.numgrid(430, 70, 34, K.map((r) => r.map(String)), { s: 12 }) + T(481, 60, '커널(가중치 9개)', { c: 'em' });
      s += T(290, 205, 'z = ReLU(wᵀx + w₀)', { c: 'lb' });
      return FK.fig(560, 220, '수용 영역과 커널', s,
        R`은닉 유닛 하나는 영상의 $3\times3$ 패치(수용 영역)의 화소 9개만 받아 가중합에 ReLU를 씌웁니다. 화소마다 하나씩인 가중치 9개가 커널이며, 따로 편향 $w_0$이 하나 있습니다. 패치가 커널과 닮을수록 $\mathbf w^T\mathbf x$가 커집니다.`);
    },
    // 10.2.2 weight sharing in 1-D: 6 connections, 2 parameters
    share1d() {
      const xi = [60, 120, 180, 240], hy = 60, iy = 170;
      let s = '';
      const hx = [90, 150, 210];
      hx.forEach((x, j) => {
        s += MF.link(xi[j], iy, x, hy, 15, 15, 'ld', 7) + MF.link(xi[j + 1], iy, x, hy, 15, 15, 'rx', 7);
      });
      xi.forEach((x, i) => { s += MF.nd(x, iy, `x${'₁₂₃₄'[i]}`, 15); });
      hx.forEach((x, j) => { s += MF.nd(x, hy, `z${'₁₂₃'[j]}`, 15); });
      s += T(150, 26, '특징 맵', { c: 'em' }) + T(150, 212, '입력', { c: 'em' });
      s += legend(330, 90, [['ld', '가중치 w₁ (세 번 공유)'], ['rx', '가중치 w₂ (세 번 공유)']]);
      s += T(330, 150, 'z_j = w₁x_j + w₂x_{j+1}', { a: 'start', c: 'em' }) + T(330, 174, '연결 6개, 독립 모수 2개', { a: 'start' });
      return FK.fig(560, 222, '1차원 합성곱의 가중치 공유', s,
        R`폭 2인 커널을 입력 네 개에 미끄러뜨리면 은닉 유닛 세 개가 모두 같은 두 가중치를 씁니다. 굵기가 같은 선은 같은 가중치입니다. 입력을 한 칸 옮기면 $z_j$도 한 칸 옮겨지는 것이 평행이동 등변성입니다.`);
    },
    // 10.2.2 a 3×3 image convolved with a 2×2 filter (symbolic)
    conv3x3() {
      const I = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']], K = [['j', 'k'], ['l', 'm']];
      let s = MF.numgrid(20, 50, 40, I, { hl: (i, j) => i < 2 && j < 2 }) + MF.numgrid(190, 70, 40, K);
      const O = [['aj+bk+dl+em', 'bj+ck+el+fm'], ['dj+ek+gl+hm', 'ej+fk+hl+im']];
      O.forEach((row, i) => row.forEach((v, j) => {
        s += `<rect class="${i === 0 && j === 0 ? 'rg hl' : 'rg'}" x="${330 + j * 112}" y="${50 + i * 60}" width="108" height="56"/>` + T(330 + j * 112 + 54, 50 + i * 60 + 32, v, { s: 11.5 });
      }));
      s += T(162, 115, '*', { c: 'em', s: 20 }) + T(300, 115, '=', { c: 'em', s: 20 });
      s += T(80, 36, '영상 I', { c: 'em' }) + T(230, 56, '필터 K', { c: 'em' }) + T(442, 36, '특징 맵 C', { c: 'em' });
      return FK.fig(560, 180, '3×3 영상과 2×2 필터의 합성곱', s,
        R`칠한 $2\times2$ 패치 $\begin{pmatrix}a&b\\d&e\end{pmatrix}$와 필터의 원소별 곱을 더한 것이 $C(0,0)=aj+bk+dl+em$입니다. 필터를 한 칸씩 옮기며 반복하면 $(3-2+1)\times(3-2+1)$ 특징 맵이 나옵니다.`);
    },
    // 10.2.2 edge detection with the two hand-made filters
    edges() {
      const n = 16, img = scene(n);
      const V = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], H = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]];
      const cv = conv2(img, V), ch = conv2(img, H);
      const c = 9.5;
      let s = MF.pix(22, 34, c, img, { max: 1, gray: true }) + MF.pix(22 + 180, 34 + c, c, cv, { max: 2.2 }) + MF.pix(22 + 360, 34 + c, c, ch, { max: 2.2 });
      s += T(98, 24, '(a) 원래 영상', { c: 'em' }) + T(278, 24, '(b) 세로 모서리 필터', { c: 'em' }) + T(458, 24, '(c) 가로 모서리 필터', { c: 'em' });
      s += T(278, 210, '[−1 0 1] 세 줄', { s: 11 }) + T(458, 210, '[−1 0 1]ᵀ 세 줄', { s: 11 });
      return FK.fig(560, 222, '고정 필터로 모서리 검출', s,
        R`(b)는 가로로 갈 때 밝아지는 곳(양수)과 어두워지는 곳(음수)이 서로 다른 색으로 나옵니다. 색이 진할수록 절댓값이 큽니다. (c)는 위아래 방향의 변화만 잡아 원판과 사각형의 위아래 경계가 드러납니다. 밝기가 일정한 곳은 두 필터 모두 0입니다. 출력은 가장자리가 한 칸씩 줄어 $14\times14$입니다.`);
    },
    // 10.2.2 convolution vs cross-correlation of 1-D signals
    xcorr() {
      const f = (x) => (x >= 0 && x <= 1 ? 1 : 0), g = (x) => (x >= 0 && x <= 1 ? 1 - x : 0);
      const integ = (h) => { let s = 0; const N = 800; for (let k = 0; k < N; k++) { const y = -2 + (4 * (k + 0.5)) / N; s += h(y); } return (s * 4) / N; };
      const convf = (x) => integ((y) => f(y) * g(x - y)), corr = (x) => integ((y) => f(y) * g(y + x));
      return FK.G2(560, 210, '합성곱과 교차상관', [
        { w: 200, h: 210, x: [-1.2, 2.2], y: [-0.1, 1.25], title: 'f(상자)와 g(내리막)', m: [22, 8, 22, 18], xt: [[0, '0'], [1, '1']], yt: [], c: [{ f, c: 'ld', n: 600 }, { f: g, c: 'rx', n: 600 }],
          extra: (X, Y) => T(X(0.5), Y(1.1), 'f', { c: 'lb' }) + T(X(0.1), Y(0.55), 'g', { a: 'end', c: 'rl' }) },
        { w: 180, h: 210, ox: 200, x: [-1.2, 2.2], y: [-0.05, 0.6], title: '합성곱 (f∗g)(x)', m: [22, 8, 22, 14], xt: [[0, '0'], [1, '1'], [2, '2']], yt: [], c: [{ f: convf, c: 'ld', n: 200 }] },
        { w: 180, h: 210, ox: 380, x: [-2.2, 1.2], y: [-0.05, 0.6], title: '교차상관 (f⋆g)(x)', m: [22, 8, 22, 14], xt: [[-1, '−1'], [0, '0'], [1, '1']], yt: [], c: [{ f: corr, c: 'rx', n: 200 }] },
      ], R`합성곱 $(f*g)(x)=\int f(y)g(x-y)\,dy$는 $g$를 뒤집어 밀고, 교차상관 $(f\star g)(x)=\int f(y)g(y+x)\,dy$는 뒤집지 않고 밉니다. 그래서 두 결과는 서로 좌우가 뒤집힌 모양입니다. 딥러닝의 “합성곱”은 교차상관이지만, 커널을 학습하므로 차이가 없습니다.`);
    },
    // 10.2.3 zero padding of a 4×4 image
    padding() {
      const g = Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => (i === 0 || j === 0 || i === 5 || j === 5 ? '0' : `X${i}${j}`)));
      let s = MF.numgrid(30, 30, 34, g, { hl: (i, j) => !(i === 0 || j === 0 || i === 5 || j === 5), s: 11 });
      s += FK.R(29, 29, 3 * 34, 3 * 34, 'rx') + T(250, 44, '4×4 영상 + 0 한 겹(P = 1) → 6×6', { a: 'start', c: 'em' });
      s += T(250, 76, '3×3 필터(M = 3):', { a: 'start' });
      s += T(250, 100, '• 패딩 없음: 4 − 3 + 1 = 2 → 2×2', { a: 'start' });
      s += T(250, 124, '• P = 1: 4 + 2 − 3 + 1 = 4 → 4×4 (같은 합성곱)', { a: 'start' });
      s += T(250, 160, '같은 합성곱의 패딩: P = (M − 1)/2', { a: 'start', c: 'lb' });
      s += T(250, 184, '가장자리 화소도 창의 중심이 될 수 있음', { a: 'start' });
      return FK.fig(560, 240, '0 패딩', s,
        R`영상 둘레에 0을 $P$겹 두르면 출력이 $(J+2P-M+1)\times(K+2P-M+1)$이 됩니다. 테두리의 창(선으로 표시)은 모서리 화소 $X_{11}$을 중심으로 삼습니다. 평균을 뺀 영상에서는 0이 평균 세기를 뜻합니다.`);
    },
    // 10.2.4 stride 2
    stride() {
      const c = 24, x0 = 24, y0 = 34;
      let s = '';
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) s += `<rect class="rg" x="${x0 + j * c}" y="${y0 + i * c}" width="${c - 2}" height="${c - 2}"/>`;
      [[0, 0, 'ld'], [0, 2, 'rx'], [0, 4, 'vl']].forEach(([i, j, cl]) => { s += FK.R(x0 + j * c - 1, y0 + i * c - 1 + (cl === 'rx' ? 2 : 0), 3 * c, 3 * c, cl); });
      const ox = 300, oc = 36;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += `<rect class="${i === 0 ? 'rg hl' : 'rg'}" x="${ox + j * oc}" y="${y0 + 30 + i * oc}" width="${oc - 2}" height="${oc - 2}"/>`;
      s += T(x0 + 3.5 * c, 24, '입력 7×7, 필터 3×3', { c: 'em' }) + T(ox + 1.5 * oc, 50, '출력 3×3', { c: 'em' });
      s += FK.A(x0 + 7 * c + 8, y0 + 3.5 * c, ox - 10, y0 + 30 + 1.5 * oc, 'ax', 8);
      s += T(ox + 3 * oc + 14, 110, '⌊(7 − 3)/2⌋ + 1 = 3', { a: 'start', c: 'lb' }) + T(ox + 3 * oc + 14, 134, '보폭 1이면 5×5', { a: 'start' });
      return FK.fig(560, 220, '보폭 2 합성곱', s,
        R`필터를 두 칸씩 건너뛰며 놓습니다(윗줄의 세 창). 창이 겹치는 열은 있지만 출력 개수는 한 변에 $\lfloor(J+2P-M)/S\rfloor+1=3$개로 보폭 1일 때(5개)보다 줄어듭니다.`);
    },
    // 10.2.5 multi-channel filter and several output channels
    multichan() {
      const sheet = (x, y, w, h, cls) => FK.R(x, y, w, h, cls) + FK.R(x, y, w, h, 'sv');
      let s = '';
      ['R', 'G', 'B'].forEach((ch, k) => { s += sheet(30 + 14 * (2 - k), 40 + 14 * (2 - k), 110, 110, k === 0 ? 'rg hl' : 'rg'); });
      ['R', 'G', 'B'].forEach((ch, k) => { s += T(30 + 14 * (2 - k) + 110 - 7, 40 + 14 * (2 - k) + 110 - 3, ch, { c: 'em', s: 11 }); });
      s += FK.R(60, 80, 30, 30, 'rx') + T(98, 204, '입력 J×K×C (C = 3)', { c: 'em' });
      [0, 1, 2].forEach((k) => { s += sheet(215 + 6 * (2 - k), 70 + 6 * (2 - k), 36, 36, 'bm'); });
      s += T(240, 150, '필터 M×M×C = 3×3×3', { c: 'em' }) + T(240, 168, '가중치 27 + 편향 1', { s: 11 });
      [0, 1, 2, 3].forEach((k) => { s += sheet(390 + 12 * k, 50 + 12 * k, 90, 90, k === 0 ? 'rg hl' : 'rg'); });
      s += T(465, 204, '출력 C_OUT개 채널', { c: 'em' }) + T(465, 222, '필터 텐서 M×M×C×C_OUT', { s: 11 });
      s += FK.A(152, 95, 205, 95, 'ax', 7) + FK.A(270, 95, 382, 95, 'ax', 7);
      return FK.fig(560, 232, '다채널 합성곱', s,
        R`$M\times M\times C$ 필터 하나는 세 채널의 패치(선으로 표시)와 곱해 **모두 더한** 값 하나를 위치마다 내어 특징 맵 한 장을 만듭니다. 필터를 $C_{\text{OUT}}$개 두면 출력 채널이 $C_{\text{OUT}}$개이고 모수는 $(M^2C+1)C_{\text{OUT}}$개입니다.`);
    },
    // 10.2.5 1×1 convolution changes the number of channels
    conv1x1() {
      let s = '';
      const block = (x, y, w, h, d, lab, hl) => {
        let o = '';
        for (let k = d - 1; k >= 0; k--) o += FK.R(x + 8 * k, y - 8 * k, w, h, hl && k === 0 ? 'rg hl' : 'rg') + FK.R(x + 8 * k, y - 8 * k, w, h, 'sv');
        return o + T(x + w / 2 + 4 * d, y + h + 20, lab, { c: 'em' });
      };
      s += block(30, 70, 100, 100, 6, 'h × w × C (C = 6)');
      s += FK.R(62, 102, 12, 12, 'rx');
      s += T(245, 60, '화소마다 채널 벡터 a ∈ ℝᶜ', { c: 'lb' }) + T(245, 84, '→ W a + b (W: C_OUT × C)', { c: 'lb' });
      s += FK.A(190, 120, 320, 120, 'rx', 8) + T(255, 142, '1×1 필터 C_OUT개', { s: 11 });
      s += block(360, 80, 100, 100, 2, 'h × w × C_OUT (C_OUT = 2)');
      return FK.fig(560, 222, '1×1 합성곱', s,
        R`한 화소 위치(선으로 표시)의 채널 값 $C$개에 같은 가중치 행렬을 곱해 $C_{\text{OUT}}$개로 바꿉니다. 공간 크기 $h\times w$는 그대로이고 채널 수만 바뀝니다. 풀링·보폭 합성곱이 공간 해상도를 줄인다면 1×1 합성곱은 깊이(채널 수)를 줄입니다.`);
    },
    // 10.2.6 max and average pooling of example 7
    maxpool() {
      const A = [[2, 6, 1, 0], [4, 3, 8, 2], [5, 0, 1, 7], [9, 1, 3, 3]];
      const isMax = (i, j) => { const bi = i - (i % 2), bj = j - (j % 2); const m = Math.max(A[bi][bj], A[bi][bj + 1], A[bi + 1][bj], A[bi + 1][bj + 1]); return A[i][j] === m; };
      let s = MF.numgrid(24, 40, 38, A.map((r) => r.map(String)), { hl: isMax });
      s += FK.L(24 + 76 - 1, 40, 24 + 76 - 1, 40 + 152, 'vl') + FK.L(24, 40 + 76 - 1, 24 + 152, 40 + 76 - 1, 'vl');
      s += MF.numgrid(250, 58, 44, [['6', '8'], ['9', '7']], { hl: () => true }) + MF.numgrid(400, 58, 44, [['3.75', '2.75'], ['3.75', '3.5']], { s: 11 });
      s += FK.A(186, 116, 240, 100, 'ax', 7) + FK.A(186, 124, 392, 148, 'ax', 7);
      s += T(100, 28, '특징 맵 4×4', { c: 'em' }) + T(294, 48, '최대 풀링', { c: 'em' }) + T(444, 48, '평균 풀링', { c: 'em' });
      s += T(372, 176, '2×2 창, 보폭 2 → 2×2 (모수 없음)', { s: 11 });
      return FK.fig(560, 205, '최대 풀링과 평균 풀링', s,
        R`굵은 선으로 나눈 $2\times2$ 블록마다 최댓값(칠한 칸) 또는 평균을 남깁니다. 최대 풀링은 특징이 있는지와 그 세기를 보존하고, 블록 안의 정확한 위치는 버립니다.`);
    },
    // 10.2.7 effective receptive field grows with depth (Bishop Fig. 10.9)
    recfield() {
      const rows = [[7, 190], [5, 120], [3, 50]], dx = 58, cx = 280;
      const pos = rows.map(([n, y]) => Array.from({ length: n }, (_, i) => [cx + (i - (n - 1) / 2) * dx, y]));
      let s = '';
      const on = (l, i) => (l === 2 ? i === 1 : l === 1 ? i >= 1 && i <= 3 : i >= 1 && i <= 5);
      for (let l = 1; l < 3; l++) pos[l].forEach(([x, y], i) => {
        [-1, 0, 1].forEach((d) => {
          const k = i + 1 + d; if (k < 0 || k >= pos[l - 1].length) return;
          const [u, v] = pos[l - 1][k];
          s += FK.L(x, y + 11, u, v - 11, on(l, i) && on(l - 1, k) ? 'ld' : 'dm');
        });
      });
      pos.forEach((r, l) => r.forEach(([x, y], i) => { s += FK.C(x, y, 11, on(l, i) ? 'ldh' : 'sp'); }));
      s += T(40, 194, '입력', { a: 'start', c: 'em' }) + T(40, 124, '1층', { a: 'start', c: 'em' }) + T(40, 54, '2층', { a: 'start', c: 'em' });
      s += T(470, 54, '유닛 1개', { a: 'start' }) + T(470, 124, '3개에 의존', { a: 'start' }) + T(470, 194, '5개에 의존', { a: 'start' });
      return FK.fig(560, 215, '깊이에 따라 커지는 수용 영역', s,
        R`폭 3인 필터를 두 층 쌓으면 맨 위 유닛은 가운데 층 3개, 입력 5개에 의존합니다(채운 점과 굵은 선). 층마다 $M-1=2$씩 넓어져 $L$층이면 $L(M-1)+1$입니다.`);
    },
    // 10.2.7 CNN pipeline: conv, pool, conv, pool, fully connected
    cnnpipe() {
      let s = '';
      const stack = (x, y, sz, d, lab, sub) => {
        let o = '';
        for (let k = d - 1; k >= 0; k--) o += FK.R(x + 5 * k, y - 5 * k, sz, sz, k === 0 ? 'rg hl' : 'rg') + FK.R(x + 5 * k, y - 5 * k, sz, sz, 'sv');
        return o + T(x + sz / 2 + 2.5 * d, 196, lab, { s: 11, c: 'em' }) + T(x + sz / 2 + 2.5 * d, 212, sub, { s: 10.5 });
      };
      s += FK.R(14, 72, 64, 64, 'rg') + FK.R(14, 72, 64, 64, 'sv') + T(46, 110, '2', { s: 30, c: 'em' }) + T(46, 196, '입력', { s: 11, c: 'em' }) + T(46, 212, '28×28×1', { s: 10.5 });
      s += stack(108, 84, 58, 4, '합성곱 5×5', '24×24×n₁');
      s += stack(208, 100, 38, 4, '최대 풀링', '12×12×n₁');
      s += stack(290, 108, 28, 5, '합성곱 5×5', '8×8×n₂');
      s += stack(368, 116, 18, 5, '최대 풀링', '4×4×n₂');
      for (let k = 0; k < 6; k++) s += FK.C(450, 64 + k * 20, 6, 'sp');
      for (let k = 0; k < 4; k++) s += FK.C(505, 74 + k * 26, 7, k === 1 ? 'ldh' : 'sp');
      s += T(450, 196, '완전연결', { s: 11, c: 'em' }) + T(505, 196, '출력 10', { s: 11, c: 'em' }) + T(478, 212, '펼침 → 은닉 → 소프트맥스', { s: 10.5 });
      [[82, 110, 104, 110], [178, 110, 204, 112], [252, 112, 286, 114], [326, 114, 364, 116], [400, 112, 440, 112], [460, 112, 494, 112]].forEach(([a, b, c2, d]) => { s += FK.A(a, b, c2, d, 'ax', 6); });
      return FK.fig(560, 222, '합성곱 신경망의 전형적인 흐름', s,
        R`숫자 영상 $28\times28$에 $5\times5$ 유효 합성곱($28-5+1=24$), $2\times2$ 최대 풀링(12), 다시 합성곱(8)과 풀링(4)을 거친 뒤 펼쳐서 완전연결층으로 분류합니다. 공간 크기는 줄고 채널은 늘며, 마지막 완전연결층이 영상 전체의 정보를 모읍니다.`);
    },
    // 10.2.8 ILSVRC top-5 error of the winners
    ilsvrc() {
      const yrs = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], err = [28.2, 25.8, 16.4, 11.7, 6.7, 3.57, 2.99, 2.25];
      return G({ w: 560, h: 240, x: [2009.4, 2017.6], y: [0, 34], label: 'ILSVRC 우승 모델의 top-5 오류율', m: [14, 14, 22, 40],
        xt: yrs.map((y) => [y, String(y)]), yt: [[5, '5'], [10, '10'], [20, '20'], [30, '30']], hg: [5.1],
        extra: (X, Y) => yrs.map((y, i) => FK.R(X(y) - 17, Y(err[i]), 34, Y(0) - Y(err[i]), y === 2012 ? 'rxh' : y < 2012 ? 'bm' : 'ldh') + T(X(y), Y(err[i]) - 5, String(err[i]), { s: 11 })).join('')
          + T(X(2016.4), Y(5.1) - 6, '사람 약 5%', { c: 'rl' }) + T(X(2010.5), Y(12), '수작업 특징', { s: 11 }) + T(X(2017.5), Y(32), 'top-5 오류율(%)', { a: 'end', c: 'em' }) + T(X(2012), Y(16.4) - 20, 'AlexNet', { c: 'rl' }),
        cap: R`2012년 AlexNet(가운데 막대)이 수작업 특징 기반 방법(왼쪽 두 막대)의 약 26%를 16.4%로 끌어내린 뒤 CNN이 해마다 기록을 경신해 사람 수준(점선, 약 5%)을 넘었습니다. 교재의 AlexNet 15.3%는 추가 자료를 쓴 제출의 값입니다.` });
    },
    // 10.2.8 VGG-16 stages
    vgg() {
      const st = [[224, 64, 2], [112, 128, 2], [56, 256, 3], [28, 512, 3], [14, 512, 3]];
      let s = '', x = 18;
      st.forEach(([r, c, n], i) => {
        const h = 30 + r * 0.62, w = 6 + Math.log2(c) * 1.6;
        for (let k = 0; k < n; k++) { s += FK.R(x, 120 - h / 2, w, h, 'rg hl') + FK.R(x, 120 - h / 2, w, h, 'sv'); x += w + 3; }
        s += T(x - (w + 3) * n / 2, 120 + h / 2 + 16, `${r}²×${c}`, { s: 10.5, c: 'em' }) + T(x - (w + 3) * n / 2, 120 + h / 2 + 30, `합성곱 ${n}개`, { s: 10 });
        const ph = 30 + (r / 2) * 0.62;
        s += FK.R(x + 2, 120 - ph / 2, 5, ph, 'rxh'); x += 16;
      });
      [4096, 4096, 1000].forEach((u, i) => { const h = i < 2 ? 70 : 40; s += FK.R(x, 120 - h / 2, 12, h, 'bm') + FK.R(x, 120 - h / 2, 12, h, 'sv'); s += T(x + 6, 120 - h / 2 - 6, String(u), { s: 10 }); x += 22; });
      s += T(x + 4, 124, '소프트맥스', { a: 'start', s: 11 });
      s += T(18, 24, '입력 224×224×3', { a: 'start', c: 'em' }) + T(430, 24, '7×7×512 = 25,088 → 완전연결', { a: 'middle', c: 'em' });
      return FK.fig(560, 240, 'VGG-16의 구조', s,
        R`합성곱층(모두 $3\times3$, 보폭 1, 같은 패딩, ReLU)을 두세 개씩 묶은 다섯 단계 사이에 $2\times2$ 최대 풀링(가는 막대)이 들어가 해상도가 절반씩 줄고($224\to7$), 채널은 $64\to512$로 늘어납니다. 끝의 완전연결층 세 개($4096,4096,1000$)에 모수의 대부분이 있습니다. 막대 높이는 해상도, 폭은 채널 수를 나타냅니다.`);
    },
  });
})();
