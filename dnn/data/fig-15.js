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
  });
})();
