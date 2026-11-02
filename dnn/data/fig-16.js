/* 16 CNN 아키텍처와 현저성 지도 — 본문 그림. 수치는 6주차 수요일 슬라이드의 값입니다. */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const box = (x, y, w, h, t, sub, hl) => FK.R(x, y, w, h, hl ? 'bm2' : 'bm') + FK.T(x + w / 2, y + (sub ? h / 2 - 1 : h / 2 + 4), t, { s: 11, c: 'em' }) + (sub ? FK.T(x + w / 2, y + h / 2 + 12, sub, { s: 10 }) : '');
  const up = (x1, y1, x2, y2) => FK.A(x1, y1, x2, y2, 'ax', 7);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 16.1 ImageNet top-5 error by year (slides 3–4, 43)
    imagenet() {
      const D = [['2010', 28.2, '', 0], ['2011', 25.8, '', 0], ['2012', 16.4, '8층', 1], ['2013', 11.7, '8층', 1], ['2014', 7.3, '19층', 1], ['2014', 6.7, '22층', 1], ['2015', 3.6, '152층', 1]];
      const names = ['Lin', 'Sanchez', 'AlexNet', 'ZFNet', 'VGG', 'GoogLeNet', 'ResNet'];
      const x0 = 60, y0 = 210, sx = 66, sy = 5.6;
      let body = FK.L(x0 - 10, y0, x0 + 7 * sx, y0, 'ax') + FK.L(x0 - 10, y0, x0 - 10, y0 - 30 * sy, 'ax');
      [0, 10, 20, 30].forEach((v) => { body += FK.L(x0 - 14, y0 - v * sy, x0 - 10, y0 - v * sy, 'ax') + FK.T(x0 - 18, y0 - v * sy + 4, String(v), { a: 'end', s: 10 }); });
      D.forEach(([yr, e, layers, cnn], k) => {
        const x = x0 + k * sx;
        body += FK.R(x, y0 - e * sy, 40, e * sy, cnn ? 'bm2' : 'bm') + FK.T(x + 20, y0 - e * sy - 6, e.toFixed(1), { s: 11, c: 'em' })
          + FK.T(x + 20, y0 + 15, yr, { s: 10 }) + FK.T(x + 20, y0 + 29, names[k], { s: 10, c: cnn ? 'lb' : '' }) + (layers ? FK.T(x + 20, y0 - e * sy - 20, layers, { s: 10, c: 'rl' }) : '');
      });
      body += FK.L(x0 + 2 * sx - 13, y0 + 4, x0 + 2 * sx - 13, y0 - 30 * sy, 'dm ds') + FK.T(x0 + 2 * sx - 7, y0 - 28 * sy, 'CNN →', { a: 'start', s: 11, c: 'lb' })
        + FK.T(x0 - 44, y0 - 15 * sy, '%', { s: 11 });
      return FK.fig(560, 250, 'ImageNet top-5 오류율', body,
        R`ImageNet 분류 대회의 top-5 오류율(%). 2012년 AlexNet부터 CNN이 쓰였고(점선 오른쪽), 층이 깊어질수록(막대 위의 층 수) 오류가 줄었습니다. 2015년 ResNet의 3.6%는 사람의 오류(약 5%)보다 낮습니다.`);
    },
    // 16.5 naive inception vs inception with 1×1 bottlenecks (slides 33–40)
    inception() {
      const col = (ox, bottle) => {
        const w = 62, gap = 6, xs = [0, 1, 2, 3].map((k) => ox + k * (w + gap));
        let s = box(ox + 60, 214, 160, 26, '이전 층 28×28×256') + box(ox + 60, 14, 160, 26, bottle ? '이어 붙이기 → 28×28×480' : '이어 붙이기 → 28×28×672');
        const main = bottle ? [['1×1', '128'], ['3×3', '192'], ['5×5', '96'], ['1×1', '64']] : [['1×1', '128'], ['3×3', '192'], ['5×5', '96'], ['풀링', '3×3']];
        xs.forEach((x, k) => {
          s += box(x, 80, w, 38, main[k][0], main[k][1], bottle && k === 3);
          if (bottle && (k === 1 || k === 2)) s += box(x, 150, w, 34, '1×1', '64', true) + up(x + w / 2, 214, x + w / 2, 184) + up(x + w / 2, 150, x + w / 2, 118);
          else if (bottle && k === 3) s += box(x, 150, w, 34, '풀링', '3×3') + up(x + w / 2, 214, x + w / 2, 184) + up(x + w / 2, 150, x + w / 2, 118);
          else s += up(x + w / 2, 214, x + w / 2, 118);
          s += up(x + w / 2, 80, x + w / 2, 40);
        });
        return s;
      };
      const body = col(0, false) + col(290, true)
        + FK.T(140, 268, '단순: 1,089,536개', { c: 'rl' }) + FK.T(430, 268, '병목: 346,112개', { c: 'lb' });
      return FK.fig(560, 280, '단순 인셉션 모듈과 병목 인셉션 모듈', body,
        R`(왼쪽) 단순 모듈은 네 갈래를 나란히 계산해 이어 붙이므로 풀링 갈래의 256채널까지 더해져 672채널이 됩니다. (오른쪽) $3\times3$·$5\times5$ 앞과 풀링 뒤에 $1\times1$ 합성곱(64, 채운 상자)을 넣으면 출력이 480채널로 줄고, 가중치(편향 제외)가 약 32%로 줄어듭니다. 박스의 아래 숫자는 필터 개수입니다.`);
    },
    // 16.6 plain layers, a residual block, and the bottleneck block (slides 48–50)
    resblock() {
      const stack = (x, labels, w = 104) => labels.map(([t, sub], k) => box(x, 190 - k * 62, w, 34, t, sub)).join('');
      const plain = stack(20, [['합성곱', '3×3, 64'], ['합성곱', '3×3, 64']]) + up(72, 252, 72, 224) + up(72, 190, 72, 162) + up(72, 128, 72, 92) + FK.T(72, 266, 'x', { c: 'it' }) + FK.T(72, 84, 'H(x)', { c: 'it' })
        + FK.T(72, 22, '단순 층', { c: 'em' });
      const ox = 210;
      const res = stack(ox, [['합성곱', '3×3, 64'], ['합성곱', '3×3, 64']]) + up(ox + 52, 252, ox + 52, 224) + up(ox + 52, 190, ox + 52, 162)
        + up(ox + 52, 128, ox + 52, 106) + FK.C(ox + 52, 96, 10, 'nd') + FK.T(ox + 52, 100, '+', { c: 'em' }) + up(ox + 52, 86, ox + 52, 62)
        + FK.P(`M${ox + 52},252 C${ox + 150},252 ${ox + 150},96 ${ox + 62},96`, 'ld') + FK.T(ox + 132, 180, '항등', { c: 'lb', a: 'start' })
        + FK.T(ox + 52, 266, 'x', { c: 'it' }) + FK.T(ox + 52, 54, 'F(x) + x', { c: 'it' }) + FK.T(ox + 52, 22, '잔차 블록', { c: 'em' });
      const bx = 410;
      const bott = [['1×1, 64', 210], ['3×3, 64', 160], ['1×1, 256', 110]].map(([t, y]) => box(bx, y, 104, 30, t)).join('')
        + up(bx + 52, 252, bx + 52, 240) + up(bx + 52, 210, bx + 52, 190) + up(bx + 52, 160, bx + 52, 140) + up(bx + 52, 110, bx + 52, 92) + FK.C(bx + 52, 82, 10, 'nd') + FK.T(bx + 52, 86, '+', { c: 'em' })
        + FK.P(`M${bx + 52},252 C${bx + 146},252 ${bx + 146},82 ${bx + 62},82`, 'ld') + FK.T(bx + 52, 266, '256채널', { s: 11 }) + FK.T(bx + 52, 22, '병목 블록', { c: 'em' })
        + FK.T(bx + 52, 50, '256 → 64 → 256', { s: 11, c: 'rl' });
      return FK.fig(560, 280, '단순 층, 잔차 블록, 병목 잔차 블록', plain + res + bott,
        R`(왼쪽) 단순 층은 원하는 사상 $H(x)$를 직접 배웁니다. (가운데) 잔차 블록은 층들이 $F(x)$만 배우고 입력 $x$를 지름길로 더해 $F(x)+x$를 냅니다. $F=0$이면 항등사상이고, 역전파의 기울기는 지름길로 곧장 흐릅니다. (오른쪽) 병목 블록은 $1\times1$로 채널을 256에서 64로 줄였다가 다시 256으로 늘립니다.`);
    },
    // 16.2 AlexNet stage by stage (slides 7–18): block height ~ spatial size, filled blocks are the fully connected layers; the band shows where the parameters are
    alexnet() {
      const S = [['입력', 227, 3, '227²×3', ''], ['Conv1', 55, 96, '55²×96', '11×11 s4'], ['Pool1', 27, 96, '27²×96', '3×3 s2'], ['Conv2', 27, 256, '27²×256', '5×5 p2'],
        ['Pool2', 13, 256, '13²×256', '3×3 s2'], ['Conv3–5', 13, 256, '13²×256', '3×3 p1'], ['Pool3', 6, 256, '6²×256', '3×3 s2'],
        ['FC6', 0, 4096, '4096', ''], ['FC7', 0, 4096, '4096', ''], ['FC8', 0, 1000, '1000', '클래스']];
      const cy = 96;
      const dim = S.map(([, n, c]) => n ? [10 + 4 * Math.log2(c), 14 + 7.7 * Math.sqrt(n)] : [10, 2 * Math.sqrt(c)]);
      let body = '';
      S.forEach(([nm, n, c, sz, k], i) => {
        const x = 30 + i * 55, [w, h] = dim[i];
        body += FK.R(x - w / 2, cy - h / 2, w, h, n ? 'bm' : 'bm2') + FK.T(x, 20, nm, { s: 10, c: 'em' }) + FK.T(x, 178, sz, { s: 9 }) + (k ? FK.T(x, 191, k, { s: 9, c: 'lb' }) : '');
        if (i < S.length - 1) body += FK.A(x + w / 2 + 2, cy, 30 + (i + 1) * 55 - dim[i + 1][0] / 2 - 2, cy, 'ax', 6);
      });
      const tot = 62378344, x0 = 40, W = 480;
      let x = x0;
      [['', 3747200, 'bm'], ['FC6 60.5%', 37752832, 'bm2'], ['FC7 26.9%', 16781312, 'bm2'], ['', 4097000, 'bm2']].forEach(([t, v, cl]) => {
        const w = (W * v) / tot;
        body += FK.R(x, 218, w, 18, cl) + (t ? FK.T(x + w / 2, 231, t, { s: 10 }) : '');
        x += w;
      });
      body += FK.T(280, 210, '매개변수 62,378,344개의 자리', { s: 11, c: 'em' })
        + FK.T(x0, 250, '← 합성곱 다섯 층 6.0%', { s: 10, a: 'start' }) + FK.T(x0 + W, 250, 'FC8 6.6% →', { s: 10, a: 'end' });
      return FK.fig(560, 258, 'AlexNet의 단계별 크기와 매개변수', body,
        R`위: 단계마다의 출력 크기(아래 숫자, $55^2\times96$은 $55\times55\times96$)와 커널(s는 보폭, p는 패딩). 상자의 높이는 가로·세로 크기를, 너비는 채널 수를 대략 나타내고, 칠한 상자가 완전연결층입니다. 가로·세로는 $227\to55\to27\to13\to6$으로 줄고 채널은 늘어납니다. 아래: 매개변수의 94%가 FC6–FC8에 있습니다(슬라이드 7–18).`);
    },
    // 16.4 receptive field of stacked 3×3 (here 1D, width 3) layers without padding: 3 → 5 → 7 (slide 25)
    receptive() {
      const X = (i) => 60 + i * 36, rows = [[210, 0, 6], [155, 1, 5], [100, 2, 4], [45, 3, 3]];
      let body = '';
      rows.slice(1).forEach(([y, a, b], r) => {
        const yb = rows[r][0];
        for (let i = a; i <= b; i++) for (let d = -1; d <= 1; d++) body += FK.L(X(i), y + 9, X(i + d), yb - 9, r === 1 && i === 3 ? 'ld' : 'dm');
      });
      rows.forEach(([y, a, b], r) => { for (let i = a; i <= b; i++) body += FK.C(X(i), y, 9, r === 3 || (r === 2 && i === 3) ? 'jt' : 'nd'); });
      body += FK.dim(X(0), X(6), 236, '', {}) + FK.T(X(3), 254, '3층 위 한 칸이 보는 입력 7칸', { s: 11, c: 'em' })
        + FK.T(310, 49, '3층: 입력 7칸 = 7×7 한 층', { a: 'start', c: 'em' })
        + FK.T(310, 104, '2층: 입력 5칸 = 5×5 한 층', { a: 'start' }) + FK.T(310, 159, '1층: 입력 3칸', { a: 'start' }) + FK.T(310, 214, '입력', { a: 'start' })
        + FK.T(310, 236, '가중치: 3×3 세 층 27C², 7×7 한 층 49C²', { a: 'start', s: 11, c: 'lb' });
      return FK.fig(560, 262, '작은 필터를 쌓을 때의 수용 영역', body,
        R`보폭 1, 크기 3인 필터를 한 층 지날 때마다 한 칸이 보는 입력 범위(수용 영역)가 양쪽으로 한 칸씩, 모두 2칸 넓어집니다: $3\to5\to7$. 굵은 선은 2층 가운데 칸이 보는 1층의 세 칸입니다. 2차원에서는 $3\times3$ 두 층이 $5\times5$, 세 층이 $7\times7$ 한 층과 같은 범위를 보면서 가중치는 $27C^2<49C^2$로 적고 ReLU는 세 번 들어갑니다(채널 $C$, 편향 제외).`);
    },
  });
})();

/* 16 보충 그림: 깊이와 오차 곡선(슬라이드 45–46, 51), GoogLeNet 전체 구조(슬라이드 41–42), 현저성 계산 흐름(슬라이드 53–55) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  // schematic learning curve: error decays to a floor, which drops after the learning rate is cut at t = 3.2
  const curve = (start, floor, tau) => Array.from({ length: 61 }, (_, k) => { const t = k / 10; const fl = t < 3.2 ? floor : floor * 0.62; return [t, fl + (start - fl) * Math.exp(-t / tau)]; });
  const panelOpt = { x: [0, 6], y: [0, 20], xl: '', yl: '오차 (%)', xt: [[0, '0'], [2, '2'], [4, '4'], [6, '6']], yt: [[0, '0'], [10, '10'], [20, '20']] };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 16.6 plain networks get worse with depth even on the training set; residual networks do not (slides 45–46, 51)
    depthfail() {
      const P = (ox, title, series) => Object.assign({ ox, w: 280, h: 230, title, m: [26, 10, 34, 36] }, panelOpt, {
        c: series.map(([pts, c]) => ({ pts, c })),
        extra: (X, Y) => FK.legend(X(2.9), Y(19), series.map(([pts, c, lab]) => [c, lab])) });
      return FK.G2(560, 230, '층을 쌓았더니 오차가 늘었다', [
        P(0, '(a) 일반 망 (CIFAR-10)', [[curve(20, 11, 0.7), 'ld', '56층 시험'], [curve(18, 6, 0.7), 'rx', '20층 시험'], [curve(18, 8.5, 0.8), 'ld ds', '56층 훈련'], [curve(16, 3, 0.7), 'rx ds', '20층 훈련']]),
        P(280, '(b) 잔차 망', [[curve(20, 8, 0.7), 'rx', '20층 시험'], [curve(20, 6, 0.7), 'ld', '110층 시험'], [curve(16, 3, 0.7), 'rx ds', '20층 훈련'], [curve(16, 1, 0.7), 'ld ds', '110층 훈련']])],
        R`슬라이드 45–46, 51의 곡선을 모양만 본떠 새로 그린 개념도입니다(수치는 보기용). (a) 단순히 쌓은 망은 56층이 20층보다 **시험** 오차뿐 아니라 **훈련** 오차(점선)도 높습니다. 과적합이 아니라 최적화가 어려운 것입니다. (b) 잔차 연결을 넣으면 깊을수록(110층) 훈련·시험 오차가 모두 낮습니다. 가로축은 반복 횟수(×10⁴)이고, 오차가 갑자기 내려가는 곳은 학습률을 줄인 시점입니다.`);
    },
    // 16.5 GoogLeNet as a whole: conv stem, nine inception modules in three groups, global pooling, one linear layer (slides 41–42)
    googlenet() {
      const blk = (x, w, t, sub, c) => FK.R(x, 70, w, 76, c || 'bm') + FK.T(x + w / 2, 104, t, { s: 11, c: 'em' }) + (sub ? FK.T(x + w / 2, 120, sub, { s: 10 }) : '');
      let b = blk(6, 92, '합성곱 줄기', '7×7, 3×3')
        + FK.T(52, 134, '+ 풀링', { s: 10 })
        + blk(112, 76, '인셉션', '3a, 3b', 'bm2') + blk(202, 18, '', '', 'bm') + blk(234, 112, '인셉션', '4a, 4b, 4c, 4d, 4e', 'bm2') + blk(360, 18, '', '', 'bm')
        + blk(392, 76, '인셉션', '5a, 5b', 'bm2') + blk(482, 34, '', '', 'bm');
      b += FK.T(211, 160, '풀링', { s: 10 }) + FK.T(369, 160, '풀링', { s: 10 }) + FK.T(499, 160, '평균', { s: 10 }) + FK.T(499, 174, '풀링', { s: 10 })
        + FK.T(530, 104, '선형', { s: 10, a: 'start' }) + FK.T(530, 120, '+ 소프트맥스', { s: 9, a: 'start' });
      b += FK.T(300, 30, '입력 224×224×3 → 합성곱 줄기 → 인셉션 9개 → 전역 평균 풀링 → 선형 → 클래스', { s: 11, c: 'em' })
        + FK.T(300, 214, '큰 완전연결층이 없어 매개변수가 AlexNet의 약 1/12', { s: 11, c: 'lb' });
      for (const [x1, x2] of [[98, 112], [188, 202], [220, 234], [346, 360], [378, 392], [468, 482], [516, 528]]) b += FK.A(x1, 108, x2, 108, 'ax', 5);
      return FK.fig(560, 228, 'GoogLeNet의 전체 구조', b,
        R`슬라이드 41–42의 구조를 요약한 도식입니다. 초반은 단순한 합성곱층 몇 개(줄기)이고, 위쪽은 인셉션 모듈을 쌓되 가끔 풀링으로 다운샘플링합니다. 끝은 전역 평균 풀링과 선형층 하나라 AlexNet식의 거대한 완전연결층이 없고, 22층인데도 매개변수가 AlexNet의 약 12분의 1입니다. 모듈 묶음의 개수는 원 논문의 구성(3a–3b, 4a–4e, 5a–5b)을 따랐습니다.`);
    },
    // 16.7 saliency: forward pass to the class score, backward pass to the pixels (slides 53–55)
    saliency() {
      const names = ['I', 'F(1)', 'F(2)', '⋯', 'F(L−1)', 'F(L)'];
      const xs = [40, 130, 220, 310, 400, 490];
      let b = '';
      xs.forEach((x, k) => { b += FK.R(x - 28, 84, 56, 40, k === 0 ? 'bm2' : 'bm') + FK.T(x, 108, names[k], { c: 'em' }); });
      for (let k = 0; k < 5; k++) b += FK.A(xs[k] + 30, 96, xs[k + 1] - 30, 96, 'ax', 7) + FK.A(xs[k + 1] - 30, 114, xs[k] + 30, 114, 'rx', 7);
      b += FK.T(40, 66, '이미지', { s: 11 }) + FK.T(466, 66, '점수', { s: 11 }) + FK.T(496, 66, 'S_{c}', { s: 11 })
        + FK.T(330, 40, '순전파: 이미지 → 클래스 점수', { c: 'em', a: 'end' }) + FK.T(336, 40, 'S_{c}(I)', { c: 'em', a: 'start' })
        + FK.T(270, 162, '역전파: 점수에서 시작해 입력 화소까지 연쇄법칙', { c: 'rl' });
      b += FK.T(85, 138, '∂F(1)/∂I', { s: 10 }) + FK.T(175, 138, '∂F(2)/∂F(1)', { s: 10 }) + FK.T(445, 138, '∂F(L)/∂F(L−1)', { s: 10 })
        + FK.T(270, 192, '∂S_{c}/∂I = ∂F(L)/∂F(L−1) ⋯ ∂F(2)/∂F(1) · ∂F(1)/∂I', { c: 'lb' })
        + FK.T(150, 212, '|∂S_{c}/∂I|', { s: 11, a: 'start' }) + FK.T(222, 212, '를 화소마다 그린 것이 현저성 지도', { s: 11, a: 'start' });
      return FK.fig(560, 224, '현저성 지도의 계산 흐름', b,
        R`슬라이드 53–55의 도식입니다. 이미지 $I$가 층 $F^{(1)},\dots,F^{(L)}$를 지나 클래스 점수 $S_{c}(I)$가 됩니다(순전파, 위). 같은 연쇄법칙을 거꾸로 적용해 점수에서 입력 화소까지 기울기 $\frac{\partial S_{c}}{\partial I}$를 구합니다(역전파, 아래). 가중치는 고정하고 입력에 대한 기울기만 구하는 점이 학습과 다릅니다.`);
    },
  });
})();
