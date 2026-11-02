/* 19 순환 신경망과 시간 역전파 — 본문 그림. 기호는 9주차 수요일 슬라이드 6(펼친 RNN)과 슬라이드 9 뒤 필기(두 단계 RNN)를 따릅니다. */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const node = (x, y, label, r = 17) => FK.C(x, y, r, 'nd') + FK.T(x, y + 4, label, { c: 'em' });
  const edge = (x1, y1, x2, y2, c = 'ax') => FK.A(x1, y1, x2, y2, c, 7);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 19.2 folded and unrolled vanilla RNN (slide 6 notation: U recurrent, W input, W_out output)
    rnnunroll() {
      let body = '';
      // folded
      body += FK.R(40, 106, 64, 40, 'bm2') + FK.T(72, 131, 'h', { c: 'em' })
        + FK.R(46, 196, 52, 30, 'bm') + FK.T(72, 216, 'x_t') + FK.R(46, 24, 52, 30, 'bm') + FK.T(72, 44, 'ŷ_t')
        + edge(72, 196, 72, 146) + edge(72, 106, 72, 54)
        + FK.P('M104,118 C150,100 150,152 106,136', 'gd') + FK.A(112, 138, 105, 135, 'ax', 7)
        + FK.T(150, 128, 'U', { c: 'lb' }) + FK.T(84, 175, 'W', { c: 'lb' }) + FK.T(90, 84, 'W_out', { c: 'lb', a: 'start' })
        + FK.T(72, 254, '접은 그림', { s: 11 });
      body += FK.T(196, 130, '=', { s: 20, c: 'em' });
      // unrolled
      const X = [300, 400, 500];
      body += node(232, 126, 'h_0') + FK.T(232, 160, '= 0', { s: 11 });
      X.forEach((x, k) => {
        const t = k + 1;
        body += node(x, 211, `x_${t}`) + node(x, 126, `h_${t}`) + node(x, 41, `ŷ_${t}`)
          + edge(x, 194, x, 143) + edge(x, 109, x, 58)
          + FK.T(x + 12, 172, 'W', { c: 'lb', a: 'start' }) + FK.T(x + 12, 88, 'W_out', { c: 'lb', a: 'start' });
        const px = k ? X[k - 1] : 232;
        body += edge(px + 17, 126, x - 17, 126) + FK.T((px + x) / 2, 118, 'U', { c: 'lb' });
      });
      body += FK.T(400, 254, '펼친 그림: 시점마다 같은 가중치', { s: 11 });
      return FK.fig(560, 264, '접은 RNN과 펼친 RNN', body,
        R`(왼쪽) RNN은 은닉 상태 $\mathbf h$가 자기 자신으로 돌아오는 고리를 가진 망입니다. (오른쪽) 고리를 시간 방향으로 펼치면 같은 칸이 시점마다 복사된 사슬이 됩니다. 슬라이드 6의 표기로 $\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b)$, $\hat{\mathbf y}_t=\mathbf W^{out}\mathbf h_t$, $\mathbf h_0=\mathbf 0$이고, 모든 시점이 **같은** $\mathbf U$, $\mathbf W$, $\mathbf W^{out}$을 씁니다.`);
    },
    // 19.4 the two-step computational graph of the handwritten notes, with the three paths from W to the loss
    rnn2step() {
      const body = [
        edge(77, 125, 163, 125), edge(197, 125, 343, 125),
        edge(180, 205, 180, 142), edge(360, 205, 360, 142),
        edge(180, 108, 180, 72), edge(360, 108, 360, 72),
        edge(197, 55, 253, 55), edge(377, 55, 433, 55),
        FK.A(258, 215, 192, 140, 'ld', 8), FK.A(282, 215, 348, 140, 'ld', 8),
        node(60, 125, 'h_0'), node(180, 125, 'h_1'), node(360, 125, 'h_2'),
        node(180, 222, 'X_1'), node(360, 222, 'X_2'), node(180, 55, 'Y_1'), node(360, 55, 'Y_2'),
        node(270, 55, 'L_1'), node(450, 55, 'L_2'), node(270, 228, 'W'),
        FK.T(120, 117, 'W', { c: 'lb' }), FK.T(270, 117, 'W', { c: 'lb' }),
        FK.T(168, 178, 'U', { c: 'lb', a: 'end' }), FK.T(372, 178, 'U', { c: 'lb', a: 'start' }),
        FK.T(168, 94, 'V', { c: 'lb', a: 'end' }), FK.T(372, 94, 'V', { c: 'lb', a: 'start' }),
        FK.T(205, 100, '①', { c: 'rl' }), FK.T(386, 100, '② ③', { c: 'rl', a: 'start' }), FK.T(270, 145, '③', { c: 'rl' }),
        FK.T(510, 125, 'L = L_1 + L_2', { c: 'em', a: 'end' }),
      ].join('');
      return FK.fig(560, 256, '두 단계 RNN의 계산 그래프와 W의 세 경로', body,
        R`필기의 두 단계 RNN: $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$, $L_t=\frac12(Y_t-Z_t)^2$. 아래의 $W$에서 나온 두 화살표는 $W$가 두 시점에서 **같이** 쓰인다는 뜻입니다. $W$가 손실에 닿는 경로는 셋입니다: ① $W\to h_1\to Y_1\to L_1$, ② $W\to h_2\to Y_2\to L_2$ (직접), ③ $W\to h_1\to h_2\to Y_2\to L_2$ (시간을 가로질러). $\partial L/\partial W$는 이 세 경로의 연쇄법칙 곱을 더한 것입니다.`);
    },
    // 19.3 truncated BPTT: hidden states go forward through the whole sequence, gradients only inside the last window
    tbptt() {
      let body = '';
      const n = 14, x0 = 30, dx = 37;
      for (let k = 0; k < n; k++) {
        const x = x0 + k * dx;
        body += FK.R(x, 96, 22, 34, k >= 9 ? 'bm2' : 'bm');
        if (k) body += edge(x - 15, 113, x, 113);
      }
      body += edge(x0 + (n - 1) * dx + 22, 113, x0 + n * dx + 8, 113);
      body += FK.R(x0 + 9 * dx - 8, 82, 5 * dx + 1, 62, 'dm ds')
        + FK.T(x0 + 11.5 * dx, 72, '최근 k걸음만 역전파', { c: 'rl' })
        + FK.A(x0, 168, x0 + n * dx, 168, 'ax', 8) + FK.T(x0 + 4.5 * dx, 186, '순전파: 은닉 상태를 처음부터 계속 넘긴다', { s: 11 })
        + FK.A(x0 + n * dx - 6, 150, x0 + 9 * dx - 8, 150, 'rx', 8) + FK.T(x0 + 11.5 * dx, 162, '역전파', { c: 'rl', s: 11 })
        + FK.T(x0 + 9 * dx - 14, 58, '첫 상태는 상수로 넘겨받음', { s: 11, a: 'end' }) + FK.L(x0 + 9 * dx - 14, 62, x0 + 9 * dx - 4, 96, 'dm');
      return FK.fig(560, 200, '잘린 시간 역전파', body,
        R`잘린 BPTT(슬라이드 9). 은닉 상태는 순서열 처음부터 끝까지 앞으로 넘기지만(아래 화살표), 손실과 역전파는 최근 $k$걸음의 덩어리(점선 상자) 안에서만 계산합니다. 덩어리의 첫 상태 $h_{t_0}$은 앞 덩어리에서 넘겨받은 상수로 다루므로, 그보다 앞으로 가는 기울기 경로는 잘립니다.`);
    },
    // 19.1 the five input/output structures (slides 2–3)
    rnnshapes() {
      const P = [[[0], 1, [0], 'one to one', '보통의 망'], [[0], 3, [0, 1, 2], 'one to many', '이미지 → 설명문'], [[0, 1, 2], 3, [2], 'many to one', '동영상 분류'],
        [[0, 1, 2], 5, [2, 3, 4], 'many to many', '번역 (지연형)'], [[0, 1, 2], 3, [0, 1, 2], 'many to many', '동영상 분할 (동기형)']];
      const sp = 26, gap = 40;
      let x0 = 38, s = '';
      P.forEach(([ins, nh, outs, name, ex]) => {
        const cx = (k) => x0 + k * sp + 10;
        for (let k = 0; k < nh; k++) {
          s += FK.R(cx(k) - 10, 88, 20, 18, 'bm2');
          if (k) s += FK.A(cx(k - 1) + 10, 97, cx(k) - 10, 97, 'ld', 5);
        }
        ins.forEach((k) => { s += FK.R(cx(k) - 10, 150, 20, 18, 'bm') + FK.A(cx(k), 150, cx(k), 108, 'ax', 5); });
        outs.forEach((k) => { s += FK.R(cx(k) - 10, 28, 20, 18, 'bm') + FK.A(cx(k), 88, cx(k), 48, 'ax', 5); });
        const mid = x0 + (nh * sp - 6) / 2;
        s += FK.T(mid, 192, name, { s: 11, c: 'em' }) + FK.T(mid, 207, ex, { s: 10 });
        x0 += nh * sp + gap;
      });
      s += FK.T(4, 20, '출력', { s: 10, a: 'start' }) + FK.T(4, 82, '은닉', { s: 10, a: 'start' }) + FK.T(4, 144, '입력', { s: 10, a: 'start' });
      return FK.fig(620, 220, 'RNN의 다섯 가지 입출력 구조', s,
        R`슬라이드 2–3의 다섯 구조. 아래 칸이 입력, 가운데가 은닉 상태(오른쪽 화살표로 이어져 상태가 시간을 따라 넘어갑니다), 위 칸이 출력입니다. 지연형 many to many는 입력을 다 읽은 뒤(시점 $1\text{–}3$) 출력을 내기 시작합니다(시점 $4\text{–}6$). 동기형은 시점마다 입력 하나에 출력 하나입니다.`);
    },
    // 19.5 the multi-cell RNN with one output at the end (slides 10, 13 and notes)
    rnnchain() {
      const X = [60, 160, 260, 400], L = ['h_0', 'h_1', 'h_2', 'h_{L−1}'];
      let s = '';
      X.forEach((x, k) => { s += FK.C(x, 80, 18, 'nd') + FK.T(x, 84, L[k], { c: 'em', s: 11 }); });
      s += FK.C(500, 80, 18, 'nd') + FK.T(500, 84, 'h_L', { c: 'em' }) + FK.T(330, 84, '· · ·', { s: 16 });
      [[60, 160, 'u_1'], [160, 260, 'u_2'], [400, 500, 'u_L']].forEach(([a, b, u]) => {
        const m = (a + b) / 2;
        s += FK.A(a + 18, 80, b - 18, 80, 'ld', 7) + FK.T(m, 70, 'q', { c: 'lb' }) + FK.A(m, 160, m, 92, 'ax', 7) + FK.T(m, 176, u, { c: 'it' });
      });
      s += FK.A(260 + 18, 80, 300, 80, 'ld', 7) + FK.A(360, 80, 400 - 18, 80, 'ld', 7);
      s += FK.A(500, 62, 500, 30, 'ax', 7) + FK.T(500, 20, 'f_θ(X) = A h_L + b', { c: 'em' })
        + FK.T(280, 130, '같은 q가 매 걸음 쓰인다', { s: 11, c: 'rl' }) + FK.T(60, 110, '= 0', { s: 11 });
      return FK.fig(560, 190, '여러 단계 RNN', s,
        R`여러 셀 RNN(슬라이드 10, 13과 필기). $h_0=0$에서 시작해 $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$를 되풀이하고, 마지막 상태 $h_L$에서 $f_\theta(X)=Ah_L+b$를 냅니다. 순환 매개변수 $\tilde\theta$는 모든 $q$에 같이 들어가므로 $\partial\mathcal L/\partial\tilde\theta=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta}$처럼 걸음마다의 기여를 더합니다.`);
    },
    // 19.6 gradient clipping on a cliff (slide 15)
    clipfig() {
      const curve = (x) => `M${x},44 C${x + 18},96 ${x + 32},120 ${x + 70},120 L${x + 108},120 C${x + 124},120 ${x + 128},60 ${x + 140},30 L${x + 230},30`;
      let s = FK.P(curve(20), 'ax') + FK.P(curve(300), 'ax');
      // left panel: start on the wall, one huge step leaves the valley
      s += FK.C(148, 68, 4, 'sp') + FK.A(144, 66, 30, 50, 'rx', 8) + FK.T(150, 162, '‖g‖이 너무 커서', { s: 11, c: 'rl' }) + FK.T(150, 177, '계곡 밖으로 튄다', { s: 11, c: 'rl' })
        + FK.T(150, 205, '클리핑 없음', { c: 'em' });
      // right panel: same gradient direction, length capped at v
      s += FK.C(428, 68, 4, 'sp') + FK.A(426, 69, 400, 110, 'gd', 8) + FK.T(430, 162, '길이를 v로 줄여', { s: 11, c: 'lb' }) + FK.T(430, 177, '방향만 따른다', { s: 11, c: 'lb' })
        + FK.T(430, 205, '클리핑 있음', { c: 'em' });
      s += FK.T(150, 24, 'J(w)', { s: 11, c: 'it' }) + FK.T(430, 24, 'J(w)', { s: 11, c: 'it' })
        + FK.T(250, 135, 'w', { s: 11, c: 'it' }) + FK.T(530, 135, 'w', { s: 11, c: 'it' });
      return FK.fig(560, 220, '기울기 잘라내기의 효과', s,
        R`슬라이드 15의 손실면 그림을 1차원 단면으로 다시 그린 것입니다. 계곡 옆의 가파른 절벽에서는 $\lVert g\rVert$가 아주 커서(왼쪽) 한 걸음에 계곡 밖으로 튀어 나가 학습이 망가집니다. 오른쪽은 $g\leftarrow\min(1,v/\lVert g\rVert)g$로 걸음 길이를 문턱 $v$ 이하로 줄입니다. 방향은 그대로이므로 계곡 쪽으로 내려가되 걸음이 짧습니다.`);
    },
  });
})();
