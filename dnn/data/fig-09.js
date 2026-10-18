/* 09 역전파 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const node = (x, y, label, r = 20) => FK.C(x, y, r, 'nd') + FK.T(x, y + 4, label, { c: 'em' });
  const edge = (x1, y1, x2, y2) => FK.A(x1, y1, x2, y2, 'ax', 7);

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
  });
})();
