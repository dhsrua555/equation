/* 02 2계·고계 선형 ODE — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, legend, PI } = window.EMG;
  const FK = window.FK;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2.4 the three damping cases (m = 4, k = 100, y(0) = 0.2, y'(0) = 0)
    f02damp() {
      const over = (t) => 0.26667 * Math.exp(-2.5 * t) - 0.06667 * Math.exp(-10 * t);
      const crit = (t) => (0.2 + t) * Math.exp(-5 * t);
      const under = (t) => Math.exp(-t) * (0.2 * Math.cos(4.899 * t) + 0.0408 * Math.sin(4.899 * t));
      const env = 0.2041;
      return G({
        x: [0, 4], y: [-0.2, 0.24], h: 240,
        xt: [[1, '1'], [2, '2'], [3, '3'], [4, '4 s']], yt: [[0.2, '0.2'], [0.1, '0.1'], [-0.1, '−0.1']], xl: 't', yl: 'y (m)',
        c: [{ f: (t) => env * Math.exp(-t), c: 'dm ds' }, { f: (t) => -env * Math.exp(-t), c: 'dm ds' },
          { f: under, c: 'ld', n: 500 }, { f: over, c: 'rx' }, { f: crit, c: 'vl' }],
        extra: (X, Y) => legend(X(2.05), Y(0.215), [['rx', '과감쇠 c = 50'], ['vl', '임계감쇠 c = 40'], ['ld', '부족감쇠 c = 8'], ['dm ds', '포락선 ±0.204e⁻ᵗ']]),
        label: '감쇠의 세 경우',
        cap: R`$4y''+cy'+100y=0$, $y(0)=0.2$, $y'(0)=0$. 과감쇠(주황)와 임계감쇠(검은 선)는 진동 없이 0으로 가고, 임계감쇠가 가장 빨리 평형에 가깝게 붙습니다. 부족감쇠(파란 선)는 포락선 $\pm Ce^{-t}$(점선) 사이에서 진동하며 줄어듭니다.`,
      });
    },
    // 2.8 amplification and phase lag (m = 1, k = 1)
    f02amp() {
      const cs = [0.25, 0.5, 1, 2];
      const A = (c) => (w) => 1 / Math.sqrt((1 - w * w) ** 2 + (w * c) ** 2);
      const eta = (c) => (w) => { const v = Math.atan2(w * c, 1 - w * w); return v; };
      return G2(560, 230, '증폭률과 위상 지연', [
        { w: 290, h: 230, x: [0, 2.2], y: [0, 4.4], title: '증폭률 C*/F₀', xt: [[1, 'ω₀ = 1'], [2, '2']], yt: [[1, '1'], [2, '2'], [4, '4']], xl: 'ω', m: [20, 10, 24, 26],
          c: cs.map((c, i) => ({ f: A(c), c: i === 0 ? 'ld' : i === 3 ? 'rx' : 'dm', n: 400 })),
          t: [[1.08, 4.1, 'c = 1/4', { a: 'start' }], [1.12, 2.05, 'c = 1/2', { a: 'start' }], [1.2, 0.95, 'c = 1', { a: 'start' }], [0.3, 0.55, 'c = 2', { a: 'start' }]] },
        { ox: 300, w: 260, h: 230, x: [0, 2.2], y: [0, PI + 0.2], title: '위상 지연 η', xt: [[1, '1'], [2, '2']], yt: [[PI / 2, 'π/2'], [PI, 'π']], xl: 'ω', hg: [PI / 2], m: [20, 10, 24, 30],
          c: [{ pts: [[0, 0], [1, 0], null, [1, PI], [2.2, PI]], c: 'dm ds' }].concat(cs.map((c, i) => ({ f: eta(c), c: i === 0 ? 'ld' : i === 3 ? 'rx' : 'dm', n: 400 }))),
          t: [[1.9, 2.55, 'c = 2', { a: 'end' }], [1.35, 2.95, 'c = 1/4', { a: 'start' }]] },
      ], R`$m=1$, $k=1$ ($\omega_0=1$)일 때 입력 진폭에 대한 출력 진폭의 비 $C^*/F_0$와 위상 지연 $\eta$. 감쇠가 작을수록 봉우리가 높고 $\omega_0$에 가까우며, $c^2\ge2mk$ ($c\ge\sqrt2$)이면 봉우리가 없습니다. 위상 지연은 항상 $\omega=\omega_0$에서 $\pi/2$이고, 감쇠가 0이면 $\omega_0$에서 0에서 $\pi$로 뛰어오릅니다(점선).`);
    },
    // 2.8 beats and resonance
    f02beats() {
      const w0 = 1, w = 0.9, F = 1;
      const beat = (t) => ((2 * F) / (w0 * w0 - w * w)) * Math.sin(((w0 + w) * t) / 2) * Math.sin(((w0 - w) * t) / 2);
      const envB = (t) => ((2 * F) / (w0 * w0 - w * w)) * Math.sin(((w0 - w) * t) / 2);
      return G2(560, 200, '맥놀이와 공진', [
        { w: 280, h: 200, x: [0, 130], y: [-12, 12], title: '(a) 맥놀이: ω = 0.9, ω₀ = 1', ax0: -12, hg: [0], xt: [[31.4, '10π'], [62.8, '20π'], [125.7, '40π']], xl: 't', m: [20, 8, 18, 14],
          c: [{ f: envB, c: 'dm ds' }, { f: (t) => -envB(t), c: 'dm ds' }, { f: beat, c: 'ld', n: 1400 }] },
        { ox: 290, w: 270, h: 200, x: [0, 40], y: [-22, 22], title: '(b) 공진: yₚ = (F₀/2mω₀) t sin ω₀t', ax0: -22, hg: [0], xt: [[10, '10'], [20, '20'], [30, '30']], xl: 't', m: [20, 8, 18, 14],
          c: [{ f: (t) => t / 2, c: 'dm ds' }, { f: (t) => -t / 2, c: 'dm ds' }, { f: (t) => (t / 2) * Math.sin(t), c: 'rx', n: 800 }] },
      ], R`(a) 입력 진동수가 고유진동수에 가까우면 빠른 진동의 진폭이 느린 주기로 오르내립니다(악기를 조율할 때 듣는 소리). (b) 정확히 같으면 진폭이 $t$에 비례해 한없이 커집니다(점선은 $\pm\frac{F_0}{2m\omega_0}t$).`);
    },
    // 2.9 transient and steady-state current
    f02rlc() {
      const a = 0.9592, b = 8.2214, c1 = -12.1951, c2 = 11.236;
      const Ip = (t) => a * Math.cos(50 * t) + b * Math.sin(50 * t);
      const I = (t) => c1 * Math.exp(-40 * t) + c2 * Math.exp(-80 * t) + Ip(t);
      return G({
        x: [0, 0.3], y: [-10, 14], h: 240,
        xt: [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3 s']], yt: [[8.28, '8.28'], [-8.28, '−8.28']], xl: 't', yl: 'I (A)', hg: [8.28, -8.28],
        c: [{ f: Ip, c: 'rx ds', n: 600 }, { f: I, c: 'ld', n: 600 }],
        extra: (X, Y) => legend(X(0.12), Y(13.2), [['ld', '전류 I(t) (과도 상태 포함)'], ['rx ds', '정상상태 전류 Iₚ(t)']]),
        label: 'RLC 회로의 과도 전류와 정상상태 전류',
        cap: R`$R=12\ \Omega$, $L=0.1$ H, $C=\frac1{320}$ F, $E=100\sin50t$ V, $I(0)=0$, $Q(0)=0$. 지수항 $e^{-40t}$, $e^{-80t}$이 0.1초쯤 지나면 사라지고 전류는 진폭 약 8.28 A의 정상상태 진동이 됩니다.`,
      });
    },
    // 2.5 potential between concentric spheres
    f02pot() {
      return G({
        x: [0.9, 2.1], y: [-10, 112], h: 200, ax0: 0, ay0: 0.9,
        xt: [[1, '1'], [1.5, '1.5'], [2, '2']], yt: [[100, '100'], [50, '50'], [33.3, '33.3']], xl: 'r', hg: [33.3], vg: [1.5],
        c: [{ f: (r) => 200 / r - 100, c: 'ld', a: 1, b: 2 }, { pts: [[1, 100], [2, 0]], c: 'dm ds' }],
        extra: (X, Y) => legend(X(1.35), Y(100), [['ld', 'v(r) = 200/r − 100'], ['dm ds', '평행판이라면 (직선)']]),
        label: '동심구 사이의 퍼텐셜',
        cap: R`반지름 1에서 100 V, 2에서 0 V인 동심구 사이의 퍼텐셜. 평행판 사이처럼 직선이 아니라 안쪽 구 근처에서 빨리 떨어지므로, 가운데 $r=1.5$에서 50 V가 아니라 약 33.3 V입니다.`,
      });
    },
    // 3.3 beam deflection: simply supported and cantilever under uniform load
    f02beam() {
      const W = 560, H = 200, x0 = 30, Lp = 220, yb = 80, amp = 38;
      const ss = (u) => u ** 4 - 2 * u ** 3 + u; // ×(f0 L^4 / 24EI), max 5/16 at u = 1/2
      const cant = (u) => (u ** 4 - 4 * u ** 3 + 6 * u * u) / 3; // ×(f0 L^4 / 24EI)/3, tip = 1
      let s = '';
      // simply supported
      s += FK.dist(x0, x0 + Lp, yb - 4, 22, 22, 9);
      s += FK.R(x0, yb - 4, Lp, 8, 'bm') + FK.pin(x0, yb + 4) + FK.roller(x0 + Lp, yb + 4);
      s += FK.P(FK.fn(x0, yb, Lp, -amp / (5 / 16), ss, 0, 1), 'ld');
      s += FK.T(x0 + Lp / 2, yb + 104, '(A) 단순지지: 양 끝 y = y″ = 0') + FK.T(x0 + Lp / 2, yb + amp + 16, 'y_{max} = 5f₀L⁴/384EI', { c: 'em' });
      // cantilever
      const x1 = 318;
      s += FK.wall(x1, yb - 30, yb + 30, 'left') + FK.dist(x1, x1 + Lp, yb - 4, 22, 22, 9) + FK.R(x1, yb - 4, Lp, 8, 'bm');
      s += FK.P(FK.fn(x1, yb, Lp, -amp * 1.4, cant, 0, 1), 'ld');
      s += FK.T(x1 + Lp / 2, yb + 104, '(C) 외팔보: 고정단 y = y′ = 0') + FK.T(x1 + Lp / 2, yb + 120, '자유단 y″ = y‴ = 0') + FK.T(x1 + Lp - 4, yb + amp * 1.4 + 14, 'y(L) = f₀L⁴/8EI', { a: 'end', c: 'em' });
      return FK.fig(W, H, '균일 하중을 받는 보의 처짐', s,
        R`균일 분포하중 $f_0$를 받는 보의 처짐 곡선(파란 선, 크게 과장). 같은 4계 방정식 $EIy^{(4)}=f_0$라도 경계조건이 달라 모양과 최대 처짐이 다릅니다. 아래쪽을 $y$의 양의 방향으로 잡았습니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
