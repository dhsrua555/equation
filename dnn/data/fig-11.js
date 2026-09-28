/* 11 가중치 초기화 — 본문 그림 (슬라이드 실험의 층별 표준편차) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const { G2, dot, legend } = FK;
  const L6 = (a) => a.map((v, i) => [i + 1, v]);
  const S = {
    small: [0.49, 0.29, 0.18, 0.11, 0.07, 0.05],
    big: [0.87, 0.85, 0.85, 0.85, 0.85, 0.85],
    xav: [0.63, 0.49, 0.41, 0.36, 0.32, 0.30],
    rx: [0.58, 0.41, 0.30, 0.21, 0.15, 0.10],
    he: [0.83, 0.83, 0.83, 0.81, 0.81, 0.81],
  };
  const dots = (X, Y, a, open) => L6(a).map(([x, y]) => dot(X, Y, x, y, open)).join('');

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    initstd() {
      const base = { w: 280, h: 230, x: [0.5, 6.5], y: [0, 1], xl: '층', xt: [1, 2, 3, 4, 5, 6].map((v) => [v, String(v)]), yt: [[0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']], m: [22, 8, 20, 32] };
      return G2(560, 230, '초기화에 따른 층별 활성화의 표준편차', [
        Object.assign({}, base, { title: '(a) tanh 신경망', c: [{ pts: L6(S.big), c: 'rx' }, { pts: L6(S.xav), c: 'ld' }, { pts: L6(S.small), c: 'dm ds' }],
          extra: (X, Y) => dots(X, Y, S.big) + dots(X, Y, S.xav) + dots(X, Y, S.small, true) + legend(X(3.2), Y(0.26), [['rx', '0.05·randn (포화)'], ['ld', 'Xavier'], ['dm ds', '0.01·randn (소멸)']]) }),
        Object.assign({}, base, { ox: 280, title: '(b) ReLU 신경망', c: [{ pts: L6(S.he), c: 'ld' }, { pts: L6(S.rx), c: 'dm ds' }],
          extra: (X, Y) => dots(X, Y, S.he) + dots(X, Y, S.rx, true) + legend(X(3.2), Y(0.36), [['ld', 'He √(2/D_in)'], ['dm ds', 'Xavier (0으로 무너짐)']]) }),
      ], R`슬라이드의 실험(은닉 4096개, 6층, 입력 randn)에서 층마다 잰 활성화의 표준편차입니다. (a) tanh: $0.01$배로 작게 두면 층마다 줄어 0으로, $0.05$배로 크게 두면 $\pm1$에 몰려 포화(표준편차 0.85에서 멈춤), Xavier는 적당히 유지. (b) ReLU: Xavier는 층마다 줄어들고, He 초기화는 모든 층에서 거의 같은 값을 유지합니다.`);
    },
  });
})();
