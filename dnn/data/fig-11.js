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
    // 11.1–11.3 activation histograms layer by layer (slides 17–25). Computed, not drawn: for a very wide layer the
    // pre-activation z is Gaussian with variance v_l, v_{l+1} = D·σ_w²·E[φ(z)²]; the histogram is the law of φ(z) cut into bins.
    inithist() {
      const D = 4096, NB = 40, W = 2 / NB;
      const erf = (x) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
      const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
      const m2tanh = (v) => { let s = 0; const sd = Math.sqrt(v), n = 4000, a = -8 * sd, h = (16 * sd) / n; for (let i = 0; i <= n; i++) { const z = a + i * h; s += (i === 0 || i === n ? 0.5 : 1) * Math.tanh(z) ** 2 * Math.exp(-z * z / (2 * v)) / Math.sqrt(2 * Math.PI * v) * h; } return s; };
      const cases = [
        { name: 'tanh 0.01×', act: 'tanh', sw: 0.01 }, { name: 'tanh 0.05×', act: 'tanh', sw: 0.05 }, { name: 'tanh Xavier', act: 'tanh', sw: 1 / Math.sqrt(D) },
        { name: 'ReLU Xavier', act: 'relu', sw: 1 / Math.sqrt(D) }, { name: 'ReLU He', act: 'relu', sw: Math.sqrt(2 / D) },
      ];
      const stats = (c) => {
        const out = []; let v = D * c.sw * c.sw; // input x ~ randn: E[x²] = 1
        for (let l = 0; l < 6; l++) {
          const s = Math.sqrt(v), bins = new Array(NB).fill(0);
          let mean, std;
          if (c.act === 'tanh') {
            const m2 = m2tanh(v); mean = 0; std = Math.sqrt(m2);
            for (let i = 0; i < NB; i++) { const a = -1 + i * W, b = a + W; bins[i] = Phi(b >= 1 ? 40 : Math.atanh(b) / s) - Phi(a <= -1 ? -40 : Math.atanh(a) / s); }
            v = D * c.sw * c.sw * m2;
          } else {
            mean = s / Math.sqrt(2 * Math.PI); const m2 = v / 2; std = Math.sqrt(m2 - mean * mean);
            bins[NB / 2] += 0.5; // all the mass at exactly 0
            for (let i = NB / 2; i < NB; i++) { const a = i * W - 1, b = a + W; bins[i] += Phi(b / s) - Phi(a / s) - (i === NB / 2 ? 0 : 0); }
            v = D * c.sw * c.sw * m2;
          }
          out.push({ bins, mean, std });
        }
        return out;
      };
      const cw = 80, ch = 44, x0 = 96, y0 = 34, rh = 70;
      let body = '';
      for (let l = 0; l < 6; l++) body += FK.T(x0 + l * cw + cw / 2 - 4, 16, '층 ' + (l + 1), { c: 'em' });
      cases.forEach((c, r) => {
        const st = stats(c), oy = y0 + r * rh;
        body += FK.T(4, oy + ch / 2 + 4, c.name, { a: 'start', c: 'lb' });
        st.forEach((s, l) => {
          const ox = x0 + l * cw, mx = c.act === 'relu' ? 2.5 * Math.max(...s.bins.filter((_, i) => i !== NB / 2)) : Math.max(...s.bins);
          s.bins.forEach((p, i) => { const h = Math.min(ch, (p / mx) * ch); if (h > 0.3) body += FK.R(ox + 2 + (i * (cw - 14)) / NB, oy + ch - h, (cw - 14) / NB + 0.2, h, 'fl2'); });
          body += FK.L(ox + 2, oy + ch, ox + cw - 12, oy + ch, 'ax') + FK.L(ox + 2 + (cw - 14) / 2, oy + ch, ox + 2 + (cw - 14) / 2, oy + ch + 3, 'ax')
            + FK.T(ox + 2, oy + ch + 11, '−1', { a: 'start', s: 8 }) + FK.T(ox + cw - 12, oy + ch + 11, '1', { a: 'end', s: 8 })
            + FK.T(ox + (cw - 10) / 2, oy + ch + 22, 'std=' + s.std.toFixed(2), { s: 10 });
        });
      });
      return FK.fig(590, y0 + 5 * rh, '층별 활성화의 히스토그램', body,
        R`슬라이드 17–25의 실험(은닉 4096개, 6층, 입력 randn, 가로축 $-1$에서 $1$)을 층별 활성화의 분포로 그린 것입니다. 폭이 매우 넓은 층에서는 입력 합 $z$가 평균 0, 분산 $v_\ell$인 정규분포이고 $v_{\ell+1}=D_{in}\sigma_w^2\,\E[\varphi(z)^2]$이므로, 난수를 돌리지 않고 이 식으로 계산했습니다(아래의 std는 슬라이드에 적힌 값과 거의 같습니다). 막대 높이는 칸마다 가장 높은 막대를 기준으로 맞췄습니다. **tanh 0.01배**: 층마다 0 주변으로 좁아져 소멸. **tanh 0.05배**: $\pm1$ 양끝에 몰려 포화. **Xavier**: 모든 층에서 종 모양이 유지됨. **ReLU + Xavier**: 점점 0으로 무너짐. **ReLU + He**: 어느 층에서나 모양과 크기가 거의 같음. ReLU 줄의 0 위치 막대는 $z<0$인 값이 모두 0이 되어 쌓인 것이라, 칸 높이에서 잘라 그렸습니다.`);
    },
  });
})();
