/* 09 역전파 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const node = (x, y, label, r = 20) => FK.C(x, y, r, 'nd') + FK.T(x, y + 4, label, { c: 'em' });
  const edge = (x1, y1, x2, y2) => FK.A(x1, y1, x2, y2, 'ax', 7);
  // CSS sets .fig text to 12px, so a big glyph needs an inline style
  const big = (x, y, s, px, c = 'em') => FK.T(x, y, s, { c }).replace('<text ', `<text style="font-size:${px}px" `);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 9.6 forward values and backward gradients of a 2–2–1 ReLU network
    mlpback() {
      const body = [
        edge(80, 70, 218, 70), edge(80, 70, 218, 155), edge(80, 160, 218, 75), edge(80, 160, 218, 160),
        edge(262, 70, 380, 108), edge(262, 160, 380, 122), edge(422, 115, 488, 115),
        node(60, 70, 'x₁'), node(60, 160, 'x₂'), node(240, 70, 'h₁'), node(240, 160, 'h₂'), node(400, 115, 'y'), node(510, 115, 'L'),
        FK.T(60, 40, '1', { c: 'lb' }), FK.T(60, 198, '2', { c: 'lb' }),
        FK.T(240, 36, 'a₁ = −0.5 → h₁ = 0', { c: 'lb' }), FK.T(240, 202, 'a₂ = 0.5 → h₂ = 0.5', { c: 'lb' }),
        FK.T(400, 85, 'y = −0.5', { c: 'lb' }), FK.T(510, 85, 'L = 1.125', { c: 'lb' }),
        FK.T(400, 150, '∂L/∂y = −1.5', { c: 'rl' }), FK.T(240, 52, 'δ₁ = 0 (꺼짐)', { c: 'rl' }), FK.T(240, 218, 'δ₂ = 1.5', { c: 'rl' }),
      ].join('');
      return FK.fig(560, 230, '작은 신경망의 순전파와 역전파', body,
        R`$x=(1,2)$, $W_1=\begin{pmatrix}0.5&-0.5\\1&0\end{pmatrix}$, $b_1=(0,-0.5)$, ReLU, $W_2=(1\ \ {-1})$, $b_2=0$, 손실 $\tfrac12(y-1)^2$. 위쪽 값이 순전파, 아래쪽 값이 역전파입니다. 첫 은닉 뉴런은 $a_1<0$이라 꺼져 있어($h_1=0$) 역전파에서도 기울기가 지나가지 못합니다.`);
    },
    // 9.4 the four gate patterns with the slide's numbers (W4 Mon(1) slide 84): forward values above, gradients below
    gates() {
      const P = [
        ['덧셈 게이트', '기울기 분배기', '+', [['3', '2'], ['4', '2']], ['7', '2'], '상류 2를 그대로 둘 다에'],
        ['곱셈 게이트', '입력 교환기', '×', [['2', '15'], ['3', '10']], ['6', '5'], '5·3 = 15, 5·2 = 10'],
        ['복사 게이트', '기울기 덧셈기', '', null, null, '4 + 2 = 6'],
        ['최댓값 게이트', '기울기 라우터', 'max', [['4', '0'], ['5', '9']], ['5', '9'], '이긴 쪽에만 9'],
      ];
      let body = '';
      P.forEach(([t1, t2, op, ins, out, rule], k) => {
        const ox = 8 + k * 138;
        body += FK.T(ox + 65, 20, t1, { c: 'em' }) + FK.T(ox + 65, 36, t2, { s: 11, c: 'lb' }) + FK.T(ox + 65, 214, rule, { s: 11 });
        if (!ins) { // copy: one value used twice
          body += FK.C(ox + 14, 120, 3, 'jt') + FK.L(ox + 14, 120, ox + 56, 120, 'gd') + FK.C(ox + 58, 120, 4, 'jt')
            + FK.A(ox + 60, 118, ox + 124, 66, 'ax', 7) + FK.A(ox + 60, 122, ox + 124, 174, 'ax', 7)
            + FK.T(ox + 30, 112, 'x', { c: 'fw' }) + FK.T(ox + 30, 138, '6', { c: 'bw' })
            + FK.T(ox + 112, 56, 'x', { c: 'fw' }) + FK.T(ox + 122, 88, '4', { c: 'bw' })
            + FK.T(ox + 112, 196, 'x', { c: 'fw' }) + FK.T(ox + 122, 164, '2', { c: 'bw' });
          return;
        }
        const gx = ox + 72, gy = 120;
        body += node(gx, gy, op, op === 'max' ? 21 : 18);
        [70, 170].forEach((y, i) => {
          body += FK.C(ox + 12, y, 3, 'jt') + edge(ox + 12, y, gx - 17, gy + (i ? 10 : -10))
            + FK.T(ox + 6, y - 8, ins[i][0], { c: 'fw', a: 'start' }) + FK.T(ox + 6, y + 18, ins[i][1], { c: 'bw', a: 'start' });
        });
        body += edge(gx + (op === 'max' ? 21 : 18), gy, ox + 130, gy) + FK.T(ox + 112, gy - 8, out[0], { c: 'fw' }) + FK.T(ox + 112, gy + 20, out[1], { c: 'bw' });
      });
      body += FK.T(268, 240, '선 위: 순전파 값', { c: 'fw', a: 'end' }) + FK.T(292, 240, '선 아래: 역전파 기울기 ∂L/∂(·)', { c: 'bw', a: 'start' });
      return FK.fig(560, 250, '게이트별 기울기 흐름', body,
        R`슬라이드 84의 네 가지 노드. 선 위의 수는 순전파 값, 선 아래의 수는 역전파로 돌아온 기울기 $\partial L/\partial(\cdot)$입니다. 덧셈은 상류 기울기를 그대로 나눠 주고, 곱셈은 **상대편** 입력값을 곱해 보내며, 두 곳에 쓰인 변수는 돌아온 기울기를 더하고, 최댓값은 이긴 입력(5)에만 기울기를 보냅니다.`);
    },
    // 9.1 one neuron: inputs, weights, net input, activation, output (slide 52); red arrows are the way gradients go back
    neuron() {
      const ys = [44, 92, 140, 206], lab = ['x_1', 'x_2', 'x_3', 'x_n'], wl = ['w_{1j}', 'w_{2j}', 'w_{3j}', 'w_{nj}'];
      const cx = 268, cy = 125, r = 26;
      let body = '';
      ys.forEach((y, i) => {
        const dx = 156 - cx, dy = y - cy, n = Math.hypot(dx, dy), px = cx + (r * dx) / n, py = cy + (r * dy) / n;
        body += FK.C(32, y, 13, 'nd') + FK.T(32, y + 4, lab[i], { c: 'em' }) + FK.A(45, y, 100, y, 'ld', 7)
          + FK.R(100, y - 12, 56, 24, 'bm') + FK.T(128, y + 4, wl[i]) + FK.A(156, y, px, py, 'ld', 7)
          + FK.A(px + 1, py + 7, 158, y + 7, 'rx', 7);
      });
      body += FK.T(32, 174, '⋮') + FK.T(128, 174, '⋮')
        + FK.C(cx, cy, r, 'nd') + big(cx, cy + 8, 'Σ', 24)
        + FK.A(cx + r, cy, 360, cy, 'ld', 7) + FK.A(358, cy + 9, cx + r + 2, cy + 9, 'rx', 7) + FK.T(318, cy - 8, 'net_j', { c: 'lb' })
        + FK.R(360, cy - 24, 64, 48, 'bm2') + big(392, cy + 8, 'φ', 24)
        + FK.A(424, cy, 520, cy, 'ld', 7) + FK.A(518, cy + 9, 426, cy + 9, 'rx', 7) + FK.T(480, cy - 8, 'o_j', { c: 'lb' })
        + FK.A(392, 206, 392, cy + 26, 'ld', 7) + FK.T(392, 224, '임계값 θ_j')
        + FK.T(32, 16, '입력') + FK.T(128, 16, '가중치') + FK.T(268, 76, '순입력의 합') + FK.T(392, 80, '활성화 함수 φ') + FK.T(480, 160, '출력(활성화)', { s: 11 })
        + FK.A(380, 256, 420, 256, 'ld', 7) + FK.T(428, 260, '순전파', { a: 'start', s: 11 }) + FK.A(520, 256, 480, 256, 'rx', 7) + FK.T(528, 260, '역전파', { a: 'start', s: 11 });
      return FK.fig(600, 268, '뉴런 하나와 역전파의 방향', body,
        R`슬라이드 52의 뉴런. 입력 $x_i$에 가중치 $w_{ij}$를 곱해 더한 $\mathrm{net}_j=\sum_iw_{ij}x_i$가 활성화 함수 $\varphi$(임계값 $\theta_j$)를 지나 출력 $o_j$가 됩니다(순전파). 역전파는 같은 화살표를 **거꾸로**(아래쪽 되돌아오는 화살표) 따라가며 $\varphi$의 국소 기울기, 가중치의 국소 기울기를 차례로 곱합니다.`);
    },
    // 9.1 gradient descent on a bowl: steps shrink with the slope, the loss falls fast and then slowly (slides 50–51)
    gdsteps() {
      const a = 0.3, th = [-2.6];
      for (let k = 0; k < 8; k++) th.push(th[k] * (1 - 2 * a));
      const f = (x) => x * x;
      const L = th.map((t, k) => [k, f(t)]);
      return FK.G2(560, 230, '경사하강법의 걸음과 손실', [
        { w: 280, h: 230, x: [-3.1, 3.1], y: [0, 8.5], xl: 'θ', yl: 'L', xt: [[-2, '−2'], [0, '0'], [2, '2']], yt: [], m: [22, 10, 22, 22], title: '(a) 그릇 위의 걸음',
          c: [{ f, c: 'ld' }, { pts: th.slice(0, 7).map((t) => [t, f(t)]), c: 'dm' }],
          extra: (X, Y) => th.slice(0, 7).map((t, k) => FK.dot(X, Y, t, f(t)) + (k < 2 ? FK.T(X(t) - 7, Y(f(t)) + (k ? 14 : -6), 'θ_' + k, { a: 'end', s: 11 }) : '')).join('') },
        { w: 280, h: 230, ox: 280, x: [-0.4, 8.6], y: [0, 7.4], xl: 'k', yl: 'L', xt: [[0, '0'], [2, '2'], [4, '4'], [6, '6'], [8, '8']], yt: [], m: [22, 10, 22, 22], title: '(b) 반복마다의 손실',
          c: [{ pts: L, c: 'ld' }],
          extra: (X, Y) => L.map(([k, v]) => FK.dot(X, Y, k, v)).join('') + FK.T(X(3.4), Y(2.6), '처음엔 빨리, 나중엔 천천히', { a: 'start', s: 11 }) },
      ], R`$L(\theta)=\theta^2$, 학습률 $\alpha=0.3$, $\theta^0=-2.6$에서 $\theta^{k+1}=\theta^k-\alpha\nabla L(\theta^k)=0.4\,\theta^k$로 걸은 예입니다(예시로 정한 값). (a) 기울기가 클수록 걸음이 길고, 바닥에 다가갈수록 기울기와 함께 걸음이 줄어듭니다. (b) 그래서 손실은 처음에 빨리, 뒤에는 천천히 줄고, $k\ge N$ 또는 $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$이면 멈춥니다.`);
    },
    // 9.2 upstream, local and downstream gradient at one node (slides 65–68)
    localgrad() {
      const cx = 330, cy = 125, r = 80;
      const edge = (px, py, key) => { const dx = px - cx, dy = py - cy, n = Math.hypot(dx, dy); return [cx + (r * dx) / n, cy + (r * dy) / n]; };
      let body = FK.C(cx, cy, r, 'nd') + big(cx, cy + 12, 'f', 36);
      [[180, 52, 'x', -1], [180, 198, 'y', 1]].forEach(([px, py, nm, sg]) => {
        const [ex, ey] = edge(px, py);
        const ux = (ex - px), uy = (ey - py), n = Math.hypot(ux, uy), nx = -uy / n, ny = ux / n, o = 9;
        body += FK.A(px, py, ex, ey, 'ax', 8) + FK.A(ex + nx * o * sg, ey + ny * o * sg, px + nx * o * sg, py + ny * o * sg, 'rx', 8) + FK.T(px - 10, py + 4, nm, { c: 'it', a: 'end' });
      });
      body += FK.T(cx, cy - 46, '국소 기울기', { c: 'rl', s: 11 }) + FK.T(cx, cy - 30, '∂z/∂x', { c: 'rl' }) + FK.T(cx, cy + 56, '∂z/∂y', { c: 'rl' })
        + FK.A(cx + r, cy, 545, cy, 'ax', 8) + FK.T(554, cy + 4, 'z', { c: 'it', a: 'start' })
        + FK.A(543, cy + 10, cx + r + 2, cy + 10, 'rx', 8) + FK.T(cx + r + 14, cy + 32, '상류 기울기 ∂L/∂z', { c: 'rl', a: 'start' })
        + FK.T(6, 28, '하류: ∂L/∂x = ∂L/∂z · ∂z/∂x', { a: 'start', c: 'rl' }) + FK.T(6, 234, '하류: ∂L/∂y = ∂L/∂z · ∂z/∂y', { a: 'start', c: 'rl' })
        + FK.T(480, 64, '하류 = 상류 × 국소', { c: 'em' });
      return FK.fig(600, 244, '노드 하나의 상류·국소·하류 기울기', body,
        R`슬라이드 65–68의 노드 $f$ (입력 $x,y$, 출력 $z$). 노드는 자기 입력과 출력만으로 **국소 기울기** $\partial z/\partial x,\ \partial z/\partial y$를 계산할 수 있습니다. 뒤에서 **상류 기울기** $\partial L/\partial z$가 들어오면(되돌아오는 화살표) 각 입력 쪽으로 보내는 **하류 기울기**는 상류 × 국소입니다. 이 한 줄을 모든 노드에서 되풀이하는 것이 역전파입니다.`);
    },
    // 9.5 backprop through an element-wise ReLU on a 4-vector and the sparse Jacobian behind it (slides 87–88)
    vecrelu() {
      const col = (x, y0, vals, c) => vals.map((v, i) => FK.T(x, y0 + i * 22, v, { c, s: 14 })).join('') + FK.L(x - 18, y0 - 15, x - 18, y0 + 3 * 22 + 6, 'gd') + FK.L(x + 18, y0 - 15, x + 18, y0 + 3 * 22 + 6, 'gd');
      const X = ['1', '−2', '3', '−1'], Y = ['1', '0', '3', '0'], U = ['4', '−1', '5', '9'], D = ['4', '0', '5', '0'];
      let body = FK.T(60, 20, '입력 x', { c: 'em' }) + FK.T(320, 20, '출력 y', { c: 'em' }) + FK.T(60, 150, '∂L/∂x', { c: 'em' }) + FK.T(320, 150, '∂L/∂y', { c: 'em' })
        + col(60, 46, X, 'fw') + col(320, 46, Y, 'fw') + col(60, 176, D, 'bw') + col(320, 176, U, 'bw')
        + FK.R(130, 46, 120, 60, 'bm2') + FK.T(190, 72, 'max(0, x)', { c: 'em' }) + FK.T(190, 92, '성분별', { s: 11 })
        + FK.A(84, 74, 128, 74, 'ax', 7) + FK.A(252, 74, 296, 74, 'ax', 7)
        + FK.R(120, 176, 140, 60, 'bm') + FK.T(190, 202, '마스크 [1, 0, 1, 0]를', { s: 11 }) + FK.T(190, 220, '성분별로 곱함', { s: 11 })
        + FK.A(296, 206, 262, 206, 'rx', 7) + FK.A(118, 206, 84, 206, 'rx', 7);
      // sparse Jacobian
      const mx = 408, my = 50, cs = 30;
      body += FK.T(mx + 2 * cs, 20, '야코비안 ∂y/∂x', { c: 'em' });
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const on = i === j && X[i][0] !== '−';
        body += FK.R(mx + j * cs, my + i * cs, cs - 2, cs - 2, on ? 'rg hl' : 'rg') + FK.T(mx + j * cs + cs / 2 - 1, my + i * cs + cs / 2 + 3, on ? '1' : '0', { c: on ? 'em' : '' });
      }
      body += FK.T(mx + 2 * cs, my + 4 * cs + 18, '대각선, 나머지는 항상 0', { s: 11 }) + FK.T(mx + 2 * cs, my + 4 * cs + 34, '= diag(1, 0, 1, 0)', { s: 11 })
        + FK.T(mx + 2 * cs, 232, '야코비안을 만들지 않고', { c: 'rl', s: 11 }) + FK.T(mx + 2 * cs, 248, '성분별 곱으로 처리', { c: 'rl', s: 11 });
      return FK.fig(560, 256, '성분별 ReLU의 벡터 역전파', body,
        R`슬라이드 87–88의 예. 위쪽 수는 순전파: $x=(1,-2,3,-1)\mapsto y=\max(0,x)=(1,0,3,0)$. 아래쪽 수는 역전파: 상류 $\partial L/\partial y=(4,-1,5,9)$가 들어오면 $x_i>0$인 자리(1번, 3번)만 통과하고 나머지는 0이 되어 $\partial L/\partial x=(4,0,5,0)$. 야코비안 $\partial y/\partial x$는 대각행렬 $\mathrm{diag}(1,0,1,0)$이라 **희소**하므로, 행렬을 만들어 곱하는 대신 마스크를 성분별로 곱합니다.`);
    },
  });
})();
