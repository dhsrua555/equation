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
