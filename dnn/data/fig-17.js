/* 17 보편 근사 정리 — 본문 그림. 8주차 수요일(10/21) 필기 첫 쪽의 그림과, 가파른 시그모이드로 쌓은 계단 근사입니다. */
(function () {
  const R = String.raw;
  const FK = window.FK;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 17.1 approximation / generalization / optimization errors (W8 Wed notes p.1)
    errsplit() {
      const pt = (x, y, t, o) => FK.C(x, y, 5, 'jt') + FK.T(x + (o.dx || 0), y + (o.dy || 0), t, o);
      let body = FK.R(24, 34, 344, 176, 'bm')
        + FK.T(36, 54, '가설 클래스 F', { a: 'start', c: 'em' }) + FK.T(36, 70, '(예: 은닉층 하나, 뉴런 N개)', { a: 'start', s: 10 });
      body += FK.A(96, 176, 186, 128, 'ld', 8) + FK.A(196, 122, 340, 82, 'ld', 8) + FK.A(352, 78, 470, 62, 'rx', 9);
      body += pt(90, 180, 'f_alg', { dx: -2, dy: 20, c: 'it' }) + pt(192, 124, 'f̂_n', { dx: 0, dy: 22, c: 'it' })
        + pt(346, 80, 'f_F', { dx: -4, dy: 24, c: 'it' }) + pt(478, 60, 'f*', { dx: 0, dy: 24, c: 'it' });
      body += FK.T(122, 140, '최적화', { s: 11 }) + FK.T(270, 92, '일반화', { s: 11 }) + FK.T(412, 54, '근사', { s: 11, c: 'rl' });
      body += FK.P('M440,128 L466,128 C470,128 470,100 476,100 L494,100 C500,100 500,128 504,128 L530,128', 'ld') + FK.T(485, 148, '이상적 목표', { s: 11, c: 'em' });
      body += FK.T(280, 236, '알고리즘 출력 → 경험적 위험 최소화 → 클래스 안의 최선 → 목표', { s: 11 });
      return FK.fig(560, 250, '근사·일반화·최적화 오차', body,
        R`필기 첫 쪽의 그림을 다시 그린 것입니다. 상자는 우리가 고른 망 구조로 만들 수 있는 함수 전체(가설 클래스 $\mathcal F$)이고, 정말 원하는 함수 $f^*$(이상적 목표)는 보통 상자 밖에 있습니다. 실제로 얻는 함수 $f_{\mathrm{alg}}$에서 $f^*$까지의 거리는 세 조각입니다: 경사하강법이 경험적 위험의 최소점 $\hat f_n$에 못 미친 만큼(최적화), 유한한 자료로 고른 $\hat f_n$이 클래스 안의 최선 $f_{\mathcal F}$보다 나쁜 만큼(일반화), 클래스의 최선조차 목표에 못 미치는 만큼(근사). 이 단원은 마지막 화살표를 다룹니다.`);
    },
    // 17.3 dense vs not dense (W8 Wed notes p.2: a closed curve, a red dotted curve around it, a blue point)
    dense() {
      const blob = (cx, cy) => { let d = ''; for (let k = 0; k <= 60; k++) { const t = (2 * Math.PI * k) / 60, r = 92 + 9 * Math.sin(3 * t + 0.5) + 6 * Math.cos(2 * t); d += (k ? 'L' : 'M') + FK.f1(cx + 1.15 * r * Math.cos(t)) + ',' + FK.f1(cy + 0.85 * r * Math.sin(t)); } return d + 'Z'; };
      const inb = (x, y, cx, cy) => { const a = Math.atan2((y - cy) / 0.85, (x - cx) / 1.15), t = a, r = 92 + 9 * Math.sin(3 * t + 0.5) + 6 * Math.cos(2 * t); return Math.hypot((x - cx) / 1.15, (y - cy) / 0.85) < r - 6; };
      const [lx, ly] = [140, 128], [rx, ry] = [420, 128];
      let s = FK.P(blob(lx, ly), 'bm') + FK.P(blob(rx, ry), 'bm');
      // left: a grid of points of D fills X (every disc of radius 20 holds one)
      const fx = 168, fy = 104;
      for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) {
        const x = lx + i * 17 + (j % 2 ? 8 : 0) + 3 * Math.sin(5 * i + j), y = ly + j * 15 + 3 * Math.cos(3 * j + i);
        if (inb(x, y, lx, ly)) s += FK.C(FK.f1(x), FK.f1(y), 1.8, 'dotf');
      }
      s += FK.C(fx, fy, 22, 'rx') + FK.C(fx, fy, 3.5, 'jt') + FK.T(fx + 6, fy - 26, 'f', { c: 'it', a: 'start' }) + FK.T(fx + 27, fy + 4, 'ε', { c: 'rl', a: 'start' });
      s += FK.T(lx, 244, '조밀한 D: 어느 f의 둘레에도 D의 원소가 있다', { c: 'em' });
      // right: D' is a line (a closed subspace); a disc around f misses it
      s += FK.L(rx - 90, ry + 70, rx + 90, ry - 50, 'vl') + FK.T(rx + 70, ry - 62, "D′", { c: 'it' });
      const px = rx - 30, py = ry - 40;
      s += FK.C(px, py, 22, 'rx') + FK.C(px, py, 3.5, 'jt') + FK.T(px + 6, py - 26, 'f', { c: 'it', a: 'start' }) + FK.T(px + 27, py + 4, 'ε', { c: 'rl', a: 'start' });
      s += FK.T(rx, 244, '조밀하지 않은 D′: 원판이 D′에 닿지 않는다', { c: 'em' });
      s += FK.T(lx, 22, '공간 X', { c: 'em' }) + FK.T(rx, 22, '공간 X', { c: 'em' });
      return FK.fig(560, 256, '조밀한 집합과 조밀하지 않은 집합', s,
        R`왼쪽은 필기 그림을 다시 그린 것입니다: 닫힌 곡선 안이 공간 $X$이고, 점들이 부분집합 $D$입니다. $f$를 중심으로 반지름 $\varepsilon$인 원판(붉은 원)을 아무리 작게 잡아도 $D$의 점이 들어 있으면 $D$는 $X$에서 조밀합니다. 오른쪽의 직선 $D'$은 이 조건을 만족하지 못합니다. $f$에서 $D'$까지의 거리보다 작은 $\varepsilon$을 고르면 원판 안에 $D'$의 점이 없기 때문입니다. 직선은 닫혀 있어서 $\overline{D'}=D'\ne X$입니다.`);
    },
    // 17.6 a continuous function and staircases of steep logistic sigmoids, N = 6 and N = 24
    stair() {
      const f = (x) => 0.2 + 0.6 * x + 0.15 * Math.sin(7 * x);
      const s = (z) => 1 / (1 + Math.exp(-z));
      const G = (N, lam) => (x) => { let v = f(0); for (let j = 1; j <= N; j++) v += (f(j / N) - f((j - 1) / N)) * s(lam * (x - (j - 0.5) / N)); return v; };
      return FK.G({ w: 560, h: 250, x: [0, 1], y: [0, 1.05], m: [14, 110, 26, 40], label: '시그모이드 계단 근사',
        xl: 'x', xt: [[0, '0'], [0.5, '0.5'], [1, '1']], yt: [[0.5, '0.5'], [1, '1']],
        c: [
          { f: G(6, 150), c: 'rx' },
          { f: G(24, 600), c: 'vl' },
          { f, c: 'ld' },
        ],
        t: [[1.02, 0.86, 'f(x)', { a: 'start', c: 'em' }], [1.02, 0.7, 'N = 6', { a: 'start', c: 'rl' }], [1.02, 0.56, 'N = 24', { a: 'start' }]],
        cap: R`연속 함수 $f$(굵은 선)를 $[0,1]$을 $N$칸으로 나눈 점 $x_j=j/N$의 값으로 계단처럼 따라갑니다: $G_N(x)=f(0)+\sum_{j=1}^N\big(f(x_j)-f(x_{j-1})\big)\sigma\big(\lambda(x-m_j)\big)$, $m_j$는 칸의 가운데, $\sigma$는 가파르게 만든($\lambda$가 큰) 로지스틱 함수입니다. 은닉 뉴런 하나가 계단 하나를 만들고, $N$을 늘리면 최대 오차가 줄어듭니다. 보편 근사 정리는 이런 근사가 $n$차원에서도 언제나 가능함을 보장하지만, 이 격자 방식은 차원마다 칸이 곱해져 뉴런이 $N^n$개쯤 필요합니다(18단원).`,
      });
    },
  });
})();
