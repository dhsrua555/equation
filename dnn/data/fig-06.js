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
  });
})();
