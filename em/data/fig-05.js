/* 05 라플라스 변환 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, legend, PI } = window.EMG;
  const u = (t) => (t > 0 ? 1 : 0);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 6.3 switching and shifting with the unit step
    f05step() {
      const T = 2 * PI + 2.3;
      const base = { w: 186, h: 150, x: [0, T], y: [-5.8, 5.8], m: [20, 6, 18, 14], xt: [[2, '2'], [PI, 'π'], [2 * PI, '2π']], xl: 't' };
      return G2(558, 150, '단위계단함수로 끄고 켜기와 이동', [
        Object.assign({}, base, { title: '(A) f(t) = 5 sin t', c: [{ f: (t) => 5 * Math.sin(t), c: 'ld', n: 300 }] }),
        Object.assign({}, base, { ox: 186, title: '(B) f(t) u(t − 2)', c: [{ f: (t) => 5 * Math.sin(t) * u(t - 2), c: 'ld', n: 600 }] }),
        Object.assign({}, base, { ox: 372, title: '(C) f(t − 2) u(t − 2)', c: [{ f: (t) => 5 * Math.sin(t - 2) * u(t - 2), c: 'ld', n: 600 }] }),
      ], R`(B)는 $t=2$ 전에는 꺼 두었다가 그때부터 원래 함수를 켜는 것이고, (C)는 함수 전체를 오른쪽으로 2만큼 옮긴 것입니다. $t$-이동 정리 $\mathcal L\{f(t-2)u(t-2)\}=e^{-2s}F(s)$는 (C)에 대한 공식입니다.`);
    },
    // 6.3 RC circuit and a single rectangular wave
    f05rc() {
      const i = (t) => Math.exp(-(t - 1)) * u(t - 1) - Math.exp(-(t - 3)) * u(t - 3);
      return G2(560, 190, 'RC 회로에 가한 사각 펄스와 전류', [
        { w: 270, h: 190, x: [0, 6], y: [-0.2, 1.3], title: '입력 전압 v(t)', xt: [[1, 'a'], [3, 'b']], yt: [[1, 'V₀']], xl: 't', m: [20, 8, 20, 26],
          c: [{ pts: [[0, 0], [1, 0], null, [1, 1], [3, 1], null, [3, 0], [6, 0]], c: 'vl' }] },
        { ox: 290, w: 270, h: 190, x: [0, 6], y: [-1.15, 1.15], title: '전류 i(t)', xt: [[1, 'a'], [3, 'b']], yt: [[1, 'V₀/R'], [-1, '−V₀/R']], xl: 't', m: [20, 8, 20, 40],
          c: [{ f: i, c: 'ld', n: 800 }] },
      ], R`$RC=1$, $a=1$, $b=3$. 전압이 켜지는 순간 전류가 $V_0/R$로 뛰었다가 콘덴서가 충전되며 줄고, 전압이 꺼지는 순간 반대 방향으로 뛰었다가 방전되며 0으로 돌아갑니다.`);
    },
    // 6.4 damped system driven by a sinusoid for a finite time
    f05burst() {
      const y = (t) => (t < PI
        ? -2 * Math.cos(2 * t) - Math.sin(2 * t) + Math.exp(-t) * (2 * Math.cos(t) + 4 * Math.sin(t))
        : (1 + Math.exp(PI)) * Math.exp(-t) * (2 * Math.cos(t) + 4 * Math.sin(t)));
      const r = (t) => (t < PI ? 10 * Math.sin(2 * t) : 0);
      return G({
        x: [0, 3 * PI], y: [-3.2, 3.2], h: 220,
        xt: [[PI, 'π'], [2 * PI, '2π'], [3 * PI, '3π']], yt: [[2, '2'], [-2, '−2']], xl: 't',
        c: [{ f: (t) => r(t) / 5, c: 'dm', n: 600 }, { f: y, c: 'ld', n: 600 }],
        extra: (X, Y) => legend(X(4.1), Y(2.9), [['dm', '외력 r(t) (1/5로 축소)'], ['ld', '응답 y(t)']]),
        label: '일정 시간만 작용하는 사인파 외력과 응답',
        cap: R`$y''+2y'+2y=r(t)$, $r=10\sin2t$ ($0\lt t\lt\pi$), 이후 0, $y(0)=y'(0)=0$. 외력이 있는 동안 진동이 자라다가, 외력이 끊긴 뒤에는 감쇠 때문에 빠르게 0으로 갑니다.`,
      });
    },
    // 6.4 square wave, shorter pulses and the hammerblow
    f05imp() {
      const f = (x) => (x < 0 ? 0 : 1 / 3 - Math.exp(-x) / 2 + Math.exp(-3 * x) / 6);
      const sq = (t) => f(t - 1) - f(t - 3);
      const pulse = (k) => (t) => (f(t - 1) - f(t - 1 - k)) / k;
      const ham = (t) => (t < 1 ? 0 : (Math.exp(-(t - 1)) - Math.exp(-3 * (t - 1))) / 2);
      return G2(560, 200, '사각파 응답과 충격 응답', [
        { w: 270, h: 200, x: [0, 7], y: [-0.05, 1.15], title: '(a) 사각파 입력 u(t−1) − u(t−3)', xt: [[1, '1'], [3, '3'], [5, '5'], [7, '7']], yt: [[1, '1'], [0.27, '0.27']], xl: 't', m: [20, 8, 20, 30],
          c: [{ pts: [[0, 0], [1, 0], null, [1, 1], [3, 1], null, [3, 0], [7, 0]], c: 'dm' }, { f: sq, c: 'ld', n: 500 }] },
        { ox: 290, w: 270, h: 200, x: [0, 7], y: [-0.01, 0.23], title: '(b) 넓이 1인 펄스 → δ(t − 1)', xt: [[1, '1'], [3, '3'], [5, '5'], [7, '7']], yt: [[0.19, '0.19']], xl: 't', m: [20, 8, 20, 30],
          c: [{ f: pulse(2), c: 'dm', n: 500 }, { f: pulse(1), c: 'dm ds', n: 500 }, { f: pulse(0.3), c: 'rx', n: 500 }, { f: ham, c: 'ld', n: 500 }],
          extra: (X, Y) => legend(X(3.6), Y(0.21), [['dm', '폭 2'], ['dm ds', '폭 1'], ['rx', '폭 0.3'], ['ld', 'δ (충격)']]) },
      ], R`$y''+4y'+3y=r(t)$, $y(0)=y'(0)=0$. (a) 사각파가 끝난 뒤에도 속도가 남아 있어 응답은 $t\approx3.07$에서 최대입니다. (b) 넓이(충격량)를 1로 유지하며 펄스를 좁히면 응답이 망치로 친 응답 $\frac12\big(e^{-(t-1)}-e^{-3(t-1)}\big)u(t-1)$로 다가갑니다.`);
    },
    // 6.7 two tanks
    f05tank() {
      const y1 = (t) => 50 - (55 / 3) * Math.exp(-0.06 * t) - (95 / 3) * Math.exp(-0.12 * t);
      const y2 = (t) => 50 - 55 * Math.exp(-0.06 * t) + 95 * Math.exp(-0.12 * t);
      return G({
        x: [0, 100], y: [0, 95], h: 220, xt: [[20.7, '20.7'], [50, '50'], [100, '100 min']], yt: [[50, '50'], [90, '90']], xl: 't', hg: [50], vg: [20.7],
        c: [{ f: y1, c: 'ld' }, { f: y2, c: 'rx' }],
        extra: (X, Y) => legend(X(62), Y(86), [['ld', 'T1의 소금 y₁'], ['rx', 'T2의 소금 y₂']]),
        label: '두 탱크 혼합 문제의 소금 양',
        cap: R`두 탱크의 소금 양. $y_2$는 평형값 50 아래로 내려갔다가(최솟값 약 42 kg, $t\approx20.7$분) 다시 올라가고, 그 순간 $y_1=y_2$가 되어 이후에는 T1이 더 많습니다. 둘 다 유입 농도 0.5 kg/L에 해당하는 50 kg으로 갑니다.`,
      });
    },
    // 6.7 two masses on three springs
    f05mass() {
      const y1 = (t) => 0.5 * (Math.cos(t) + Math.cos(Math.sqrt(3) * t));
      const y2 = (t) => 0.5 * (Math.cos(t) - Math.cos(Math.sqrt(3) * t));
      return G({
        x: [0, 30], y: [-1.15, 1.75], h: 230, xt: [[10, '10'], [20, '20'], [30, '30']], yt: [[1, '1'], [-1, '−1']], xl: 't',
        c: [{ f: y1, c: 'ld', n: 800 }, { f: y2, c: 'rx', n: 800 }],
        extra: (X, Y) => legend(X(0.6), Y(1.66), [['ld', 'y₁ (위 물체)'], ['rx', 'y₂ (아래 물체)']]),
        label: '스프링 세 개로 연결된 두 물체',
        cap: R`$k=1$, $y_1(0)=1$, $y_2(0)=0$, 초기 속도 0. 두 물체의 운동은 느린 모드 $\cos t$(같은 방향)와 빠른 모드 $\cos\sqrt3\,t$(반대 방향)의 겹침입니다. 두 진동수의 비가 무리수라 운동 전체는 주기적이지 않습니다.`,
      });
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
