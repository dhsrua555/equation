/* 10 푸리에 해석 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, stems, dot, legend, Si, J, P, simpson, piT, PI } = window.EMG;
  const sq = (x) => { const u = ((x % (2 * PI)) + 3 * PI) % (2 * PI) - PI; return u > 0 ? 1 : u < 0 ? -1 : 0; };
  const piTicks = (vals, d) => vals.map((v) => [v, piT(v, d)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 11.1 square wave and its first partial sums
    f10sq() {
      const S = (N) => (x) => { let s = 0; for (let n = 1; n <= 2 * N - 1; n += 2) s += Math.sin(n * x) / n; return (4 / PI) * s; };
      return G({
        x: [-PI - 0.15, PI + 0.15], y: [-1.55, 1.55], h: 260,
        xt: piTicks([-PI, -PI / 2, PI / 2, PI], 2), yt: [[1, 'k'], [-1, '−k']], xl: 'x',
        c: [
          { pts: [[-PI, -1], [0, -1], null, [0, 1], [PI, 1]], c: 'vl' },
          { f: S(1), c: 'dm' }, { f: S(2), c: 'rx' }, { f: S(3), c: 'ld' },
        ],
        extra: (X, Y) => legend(X(0.55), Y(-0.55), [['vl', 'f(x) (사각파)'], ['dm', 'S_1 = (4k/π) sin x'], ['rx', 'S_2'], ['ld', 'S_3']]) + dot(X, Y, 0, 0) + dot(X, Y, PI, 0) + dot(X, Y, -PI, 0),
        label: '사각파와 푸리에 부분합 S1, S2, S3',
        cap: R`사각파($k=1$)와 부분합 $S_1,S_2,S_3$. 항이 늘수록 부분합이 파형에 달라붙지만, 불연속점 $x=0,\pm\pi$에서는 모든 부분합이 도약의 평균 0을 지납니다(점).`,
      });
    },
    // 11.2 half-wave rectifier
    f10rect() {
      const u = (t) => Math.max(Math.sin(t), 0);
      const S = (t) => 1 / PI + 0.5 * Math.sin(t) - (2 / PI) * (Math.cos(2 * t) / 3 + Math.cos(4 * t) / 15);
      return G({
        x: [-2 * PI - 0.2, 2 * PI + 0.2], y: [-0.25, 1.2], h: 200,
        xt: piTicks([-2 * PI, -PI, PI, 2 * PI], 1), yt: [[1, 'E']], xl: 't',
        c: [{ f: u, c: 'vl', n: 600 }, { f: S, c: 'ld', n: 600 }],
        extra: (X, Y) => legend(X(-PI + 0.25), Y(1.0), [['vl', 'u(t)'], ['ld', '상수 + 3개 항']]),
        label: '반파 정류기 출력과 푸리에 부분합',
        cap: R`반파 정류기의 출력 $u(t)$ ($E=1$, $\omega=1$)와 급수의 앞부분 $\frac E\pi+\frac E2\sin t-\frac{2E}{\pi}\big(\frac{\cos2t}{1\cdot3}+\frac{\cos4t}{3\cdot5}\big)$. 몇 항만으로도 모양이 잡힙니다.`,
      });
    },
    // 11.2 triangle and its even / odd periodic extensions
    f10ext() {
      const L0 = 1;
      const tri = (x) => { const u = ((x % 2) + 2) % 2; const v = u > 1 ? 2 - u : u; return v <= 0.5 ? 2 * v : 2 * (1 - v); };
      const odd = (x) => { const u = (((x + 1) % 2) + 2) % 2 - 1; return u >= 0 ? tri(u) : -tri(-u); };
      const cosS = (x) => 0.5 - (16 / (PI * PI)) * (Math.cos((2 * PI * x) / L0) / 4 + Math.cos((6 * PI * x) / L0) / 36);
      const sinS = (x) => (8 / (PI * PI)) * (Math.sin((PI * x) / L0) - Math.sin((3 * PI * x) / L0) / 9);
      const base = { w: 560, h: 112, x: [-2.1, 2.1], m: [18, 16, 20, 34] };
      return G2(560, 360, '삼각형 함수의 우함수 확장과 기함수 확장', [
        Object.assign({}, base, { oy: 0, y: [-0.2, 1.15], title: '주어진 함수 (0 < x < L)', xt: [[0.5, 'L/2'], [1, 'L']], yt: [[1, 'k']],
          c: [{ pts: [[0, 0], [0.5, 1], [1, 0]], c: 'vl' }] }),
        Object.assign({}, base, { oy: 118, y: [-0.2, 1.15], title: '(a) 우함수 확장, 주기 2L → 코사인 급수', xt: [[-2, '−2L'], [-1, '−L'], [1, 'L'], [2, '2L']],
          c: [{ f: tri, c: 'vl', n: 400 }, { f: cosS, c: 'ld', n: 400 }] }),
        Object.assign({}, base, { oy: 236, h: 124, y: [-1.15, 1.15], title: '(b) 기함수 확장, 주기 2L → 사인 급수', xt: [[-2, '−2L'], [-1, '−L'], [1, 'L'], [2, '2L']],
          c: [{ f: odd, c: 'vl', n: 400 }, { f: sinS, c: 'ld', n: 400 }] }),
      ], R`같은 삼각형 함수(검은 선)를 두 방식으로 주기 확장한 모습과 각 급수의 처음 두 항(파란 선). 우함수 확장은 $\cos\frac{2\pi x}L,\cos\frac{6\pi x}L,\dots$만, 기함수 확장은 $\sin\frac{\pi x}L,\sin\frac{3\pi x}L,\dots$만 남습니다.`);
    },
    // 11.3 input and steady-state output
    f10forced() {
      const k = 9.1, c = 0.1;
      const y = (t) => {
        let s = 0;
        for (let n = 1; n <= 31; n += 2) {
          const b = 4 / (n * PI), D = (k - n * n) ** 2 + (c * n) ** 2;
          s += (-c * n * b / D) * Math.cos(n * t) + ((k - n * n) * b / D) * Math.sin(n * t);
        }
        return s;
      };
      return G({
        x: [0, 4 * PI], y: [-1.6, 2.5], h: 250,
        xt: piTicks([PI, 2 * PI, 3 * PI, 4 * PI], 1), yt: [[1, '1'], [-1, '−1']], xl: 't',
        c: [{ f: sq, c: 'dm', n: 800 }, { f: y, c: 'ld', n: 800 }],
        extra: (X, Y) => legend(X(0.25), Y(2.35), [['dm', '입력 r(t) (사각파)'], ['ld', '정상상태 출력 y(t)']]),
        label: '사각파 입력과 정상상태 응답',
        cap: R`$y''+0.1y'+9.1y=r(t)$에서 입력(회색)은 진동수 1의 사각파인데, 출력(파란 선)은 한 주기 $2\pi$ 동안 거의 세 번 흔들립니다. 입력의 3번째 고조파가 고유진동수 $\sqrt{9.1}\approx3$과 공진하기 때문입니다.`,
      });
    },
    // 11.4 sawtooth partial sums
    f10saw() {
      const S = (N) => (x) => { let s = 0; for (let n = 1; n <= N; n++) s += ((n % 2 ? 1 : -1) * Math.sin(n * x)) / n; return PI + 2 * s; };
      return G({
        x: [-PI - 0.1, PI + 0.1], y: [-0.6, 7.2], h: 250,
        xt: piTicks([-PI, -PI / 2, PI / 2, PI], 2), yt: [[PI, 'π'], [2 * PI, '2π']], xl: 'x',
        c: [{ pts: [[-PI, 0], [PI, 2 * PI]], c: 'vl' }, { f: S(3), c: 'rx', n: 500 }, { f: S(20), c: 'ld', n: 900 }],
        extra: (X, Y) => legend(X(-PI + 0.15), Y(6.6), [['vl', 'f(x) = x + π'], ['rx', 'S_3'], ['ld', 'S_20']]) + dot(X, Y, PI, PI) + dot(X, Y, -PI, PI),
        label: '톱니파와 부분합 S3, S20',
        cap: R`톱니파 $f(x)=x+\pi$와 부분합 $S_3$, $S_{20}$. $N=20$이면 제곱 오차는 $E^*\approx0.61$로 작지만, 끝점 $\pm\pi$ 근처에는 깁스 현상의 물결이 남습니다. 끝점에서 부분합의 값은 도약의 평균 $\pi$입니다.`,
      });
    },
    // 11.5 eigenfunctions of y'' + λy = 0, y(0) = 0, y'(π) = 0
    f10sl() {
      const f = (m) => (x) => Math.sin(((2 * m - 1) * x) / 2);
      return G({
        x: [0, PI + 0.05], y: [-1.2, 1.2], h: 210,
        xt: piTicks([PI / 2, PI], 2), yt: [[1, '1'], [-1, '−1']], xl: 'x',
        c: [{ f: f(1), c: 'ld' }, { f: f(2), c: 'rx' }, { f: f(3), c: 'vl' }],
        extra: (X, Y) => legend(X(0.12), Y(-0.62), [['ld', 'sin(x/2), λ = 1/4'], ['rx', 'sin(3x/2), λ = 9/4'], ['vl', 'sin(5x/2), λ = 25/4']]),
        label: '한쪽 고정, 한쪽 자유 경계조건의 고유함수',
        cap: R`$y(0)=0$, $y'(\pi)=0$을 만족하는 고유함수. 모두 $x=0$에서 0이고 $x=\pi$에서 기울기가 0(봉우리나 골)입니다. 서로 다른 두 함수의 곱을 $[0,\pi]$에서 적분하면 0입니다.`,
      });
    },
    // 11.6 Fourier–Legendre series of sin πx
    f10leg() {
      const a1 = 3 / PI, a3 = -1.15824;
      return G({
        x: [-1.05, 1.05], y: [-1.25, 1.25], h: 220,
        xt: [[-1, '−1'], [-0.5, '−0.5'], [0.5, '0.5'], [1, '1']], yt: [[1, '1'], [-1, '−1']], xl: 'x',
        c: [{ f: (x) => Math.sin(PI * x), c: 'vl' }, { f: (x) => a1 * x, c: 'dm' }, { f: (x) => a1 * x + a3 * P(3, x), c: 'rx' },
          { f: (x) => a1 * x + a3 * P(3, x) + 0.21929 * P(5, x), c: 'ld' }],
        extra: (X, Y) => legend(X(0.12), Y(-0.45), [['vl', 'sin πx'], ['dm', '1항 (P_1)'], ['rx', '2항 (P_1, P_3)'], ['ld', '3항 (P_1, P_3, P_5)']]),
        label: 'sin πx의 푸리에-르장드르 부분합',
        cap: R`$\sin\pi x\approx0.955P_1-1.158P_3+0.219P_5$. 세 항이면 사인 곡선과 거의 겹칩니다(파란 선과 검은 선).`,
      });
    },
    // 11.6 Fourier–Bessel series of 1 − x²
    f10fb() {
      const lam = [2.404826, 5.520078, 8.653728], a = [1.1080, -0.1398, 0.0455];
      const S = (N) => (x) => { let s = 0; for (let m = 0; m < N; m++) s += a[m] * J(0, lam[m] * x); return s; };
      return G({
        x: [0, 1.03], y: [-0.1, 1.15], h: 210,
        xt: [[0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1 = R']], yt: [[1, '1']], xl: 'x',
        c: [{ f: (x) => 1 - x * x, c: 'vl' }, { f: S(1), c: 'rx', n: 160 }, { f: S(3), c: 'ld', n: 160 }],
        extra: (X, Y) => legend(X(0.56), Y(1.04), [['vl', '1 − x²'], ['rx', '1항 1.108 J_{0}(2.405x)'], ['ld', '3항']]),
        label: '1 − x²의 푸리에-베셀 부분합',
        cap: R`$1-x^2$을 $J_0(\alpha_{0,m}x)$로 전개한 부분합. 첫 항만으로도 비슷하고, 세 항이면 그림에서 구별하기 어렵습니다.`,
      });
    },
    // 11.7 rectangular wave of growing period and its amplitude spectrum
    f10spec() {
      const rows = [2, 4, 8];
      const ps = [];
      rows.forEach((Lh, i) => {
        const pulse = (x) => { const u = (((x + Lh) % (2 * Lh)) + 2 * Lh) % (2 * Lh) - Lh; return Math.abs(u) < 1 ? 1 : 0; };
        const top = 2 / Lh;
        const pts = [[0, 1 / Lh]];
        for (let n = 1; (n * PI) / Lh <= 11; n++) { const w = (n * PI) / Lh; pts.push([w, (2 / Lh) * Math.sin(w) / w]); }
        ps.push({ ox: 0, oy: i * 104, w: 250, h: 100, m: [18, 10, 18, 22], x: [-9, 9], y: [-0.2, 1.3], title: `2L = ${2 * Lh}`,
          xt: [[-1, ''], [1, ''], [-8, '−8'], [8, '8']], noY: false, c: [{ f: pulse, c: 'vl', n: 900 }] });
        ps.push({ ox: 262, oy: i * 104, w: 298, h: 100, m: [18, 12, 18, 18], x: [0, 11.2], y: [-0.3 * top, 1.12 * top], title: `진폭 스펙트럼 aₙ (2L = ${2 * Lh})`,
          xt: [[PI, 'π'], [2 * PI, '2π'], [3 * PI, '3π']], xl: 'wₙ',
          c: [{ f: (w) => (w === 0 ? top : (top * Math.sin(w)) / w), c: 'dm ds', a: 0.001 }],
          extra: (X, Y) => stems(X, Y, pts) });
      });
      return G2(560, 314, '주기를 늘린 사각파와 진폭 스펙트럼', ps,
        R`폭 2인 펄스를 주기 $2L=4,8,16$으로 반복한 파형(왼쪽)과 푸리에 계수 $a_n$을 $w_n=n\pi/L$ 위치에 찍은 스펙트럼(오른쪽). 주기가 두 배가 될 때마다 점의 간격 $\pi/L$은 절반이 되고, 점들은 곡선 $\frac2L\frac{\sin w}{w}$(점선) 위에 점점 촘촘해집니다. $L\to\infty$이면 점들이 연속적인 함수, 곧 푸리에 적분의 $A(w)$가 됩니다.`);
    },
    // 11.7 sine integral and its integrand
    f10si() {
      const extrema = [PI, 2 * PI, 3 * PI];
      return G({
        x: [-4 * PI - 0.3, 4 * PI + 0.3], y: [-2.1, 2.2], h: 260,
        xt: piTicks([-4 * PI, -3 * PI, -2 * PI, -PI, PI, 2 * PI, 3 * PI, 4 * PI], 1), yt: [[PI / 2, 'π/2'], [1, '1'], [-1, '−1'], [-PI / 2, '−π/2']], xl: 'u',
        hg: [PI / 2, -PI / 2],
        c: [{ f: (u) => (u === 0 ? 1 : Math.sin(u) / u), c: 'rx', n: 700 }, { f: Si, c: 'ld', n: 700 }],
        extra: (X, Y) => extrema.map((u) => `<line class="dm ds" x1="${X(u)}" y1="${Y(0)}" x2="${X(u)}" y2="${Y(Si(u))}"/>` + dot(X, Y, u, Si(u))).join('') +
          legend(X(-4 * PI + 0.2), Y(1.95), [['ld', 'Si(u)'], ['rx', '피적분함수 sin u / u']]),
        label: '사인 적분 Si(u)와 피적분함수',
        cap: R`$\operatorname{Si}(u)=\int_0^u\frac{\sin w}{w}dw$(파란 선)와 피적분함수(주황). 피적분함수의 부호가 바뀌는 $u=\pi,2\pi,3\pi,\dots$에서 $\operatorname{Si}$는 극대·극소가 되고(점), 진폭이 줄어들며 $\pi/2$로 다가갑니다. 첫 극대 $\operatorname{Si}(\pi)\approx1.852$가 가장 높습니다.`,
      });
    },
    // 11.7 truncated Fourier integral of the pulse: Gibbs phenomenon
    f10gibbs() {
      const I = (a) => (x) => (Si(a * (x + 1)) - Si(a * (x - 1))) / PI;
      const ps = [8, 16, 32].map((a, i) => ({ ox: i * 187, w: 187, h: 190, m: [20, 8, 22, 26], x: [-2, 2], y: [-0.2, 1.25], title: `a = ${a}`,
        xt: [[-1, '−1'], [1, '1']], yt: i === 0 ? [[1, '1']] : [[1, '']], hg: [1],
        c: [{ pts: [[-2, 0], [-1, 0], null, [-1, 1], [1, 1], null, [1, 0], [2, 0]], c: 'dm' }, { f: I(a), c: 'ld', n: 700 }] }));
      return G2(561, 190, '유한한 상한 a로 자른 푸리에 적분', ps,
        R`$\frac2\pi\int_0^a\frac{\cos wx\sin w}{w}dw=\frac1\pi\big[\operatorname{Si}(a(x+1))-\operatorname{Si}(a(x-1))\big]$. $a$가 커지면 물결이 불연속점 $x=\pm1$ 쪽으로 좁혀질 뿐, 첫 봉우리의 높이(약 1.09)는 줄지 않습니다. 이것이 깁스 현상입니다.`);
    },
    // 11.9 a transform pair: the pulse and its spectrum
    f10pair() {
      const c = Math.sqrt(2 / PI);
      return G2(560, 200, '사각 펄스와 그 푸리에 변환', [
        { w: 230, h: 200, m: [20, 8, 22, 26], x: [-2.4, 2.4], y: [-0.3, 1.25], title: 'f(x)', xt: [[-1, '−1'], [1, '1']], yt: [[1, '1']], xl: 'x',
          c: [{ pts: [[-2.4, 0], [-1, 0], null, [-1, 1], [1, 1], null, [1, 0], [2.4, 0]], c: 'vl' }] },
        { ox: 240, w: 320, h: 200, m: [20, 10, 22, 30], x: [-13, 13], y: [-0.3, 0.9], title: 'f̂(w) = √(2/π) · sin w / w', ax0: -0.28, hg: [0], xt: piTicks([-3 * PI, -2 * PI, -PI, PI, 2 * PI, 3 * PI], 1), yt: [[c, '0.80']], xl: 'w',
          c: [{ f: (w) => (w === 0 ? c : (c * Math.sin(w)) / w), c: 'ld', n: 500 }] },
      ], R`폭 2인 사각 펄스(왼쪽)의 푸리에 변환(오른쪽). 시간(공간) 영역에서 좁고 모서리가 날카로운 신호일수록 변환은 넓게 퍼지고 $1/w$처럼 천천히 줄어듭니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
