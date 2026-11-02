/* 06 소프트맥스 회귀 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G2 } = FK;
  const sm = (z, T) => { const m = Math.max(...z), e = z.map((v) => Math.exp((v - m) / T)), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 6.1 / 6.4 softmax of the same logits at three temperatures
    softtemp() {
      const z = [2, 1, 0.1];
      const panel = (ox, T) => {
        const p = sm(z, T);
        return { ox, w: 186.7, h: 200, x: [0.3, 3.7], y: [0, 1.05], title: 'T = ' + T, m: [22, 8, 22, 26], yt: [[0.5, '0.5'], [1, '1']], xt: [[1, '클래스 1'], [2, '2'], [3, '3']], noY: false,
          extra: (X, Y) => p.map((v, k) => FK.R(X(k + 1) - 16, Y(v), 32, Y(0) - Y(v), 'fl2') + FK.T(X(k + 1), Y(v) - 4, v.toFixed(2), { c: 'em' })).join('') };
      };
      return G2(560, 200, '온도에 따른 소프트맥스', [panel(0, 0.5), panel(186.7, 1), panel(373.4, 2)],
        R`같은 로짓 $z=(2,\,1,\,0.1)$에 $\softmax(z/T)$를 적용했습니다. 온도 $T$가 작으면 가장 큰 로짓에 확률이 몰리고(argmax에 가까움), 크면 균등분포 쪽으로 퍼집니다. $T=1$이 보통의 소프트맥스입니다. 어느 경우든 순서(1 > 2 > 3)는 바뀌지 않습니다.`);
    },
    // 6.2 the iris-style worked example: scores, softmax, one-hot label
    softpipe() {
      const z = [1.71, -0.44, -0.18], p = (() => { const e = z.map(Math.exp), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); })();
      const bar = (X, Y, v, k, c) => { const y0 = Y(0), y1 = Y(v), t = Math.min(y0, y1); return FK.R(X(k + 1) - 16, t, 32, Math.abs(y1 - y0), c) + FK.T(X(k + 1), v >= 0 ? t - 4 : y0 - 4, v.toFixed(2), { c: 'em' }); };
      const lab = [[1, '클래스 1'], [2, '2'], [3, '3']];
      const panel = (ox, title, vals, y, c) => ({ ox, w: 186.7, h: 210, x: [0.3, 3.7], y, title, m: [26, 8, 22, 26], ax0: y[0] < 0 ? y[0] : undefined, yt: [[0, '0'], [1, '1']].filter((t) => y[0] < t[0] + 1e-9 && t[0] <= y[1]), xt: lab,
        extra: (X, Y) => (y[0] < 0 ? FK.L(X(0.3), Y(0), X(3.7), Y(0), 'ax') : '') + vals.map((v, k) => bar(X, Y, v, k, c)).join('') });
      return G2(560, 210, '점수, 소프트맥스, 정답', [panel(0, '점수 z = Wx', z, [-1, 2.4], 'fl2'), panel(186.7, '확률 p = softmax(z)', p, [0, 1.15], 'fl2'), panel(373.4, '정답 y (원-핫)', [1, 0, 0], [0, 1.15], 'fl')],
        R`$C=3$ 클래스, 입력 $x\in\mathbb R^4$의 예(본문의 계산). 가운데 열은 $W\in\mathbb R^{3\times4}$이 만든 점수 $z=(1.71,-0.44,-0.18)$이고, 소프트맥스는 이를 합이 1인 확률 $p\approx(0.789,0.092,0.119)$로 바꿉니다(큰 점수가 확률을 더 크게 가져갑니다). 정답이 클래스 1이면 $y=(1,0,0)$이고 손실은 $-\log p_1\approx0.237$입니다.`);
    },
  });
})();
