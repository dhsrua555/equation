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
  });
})();
