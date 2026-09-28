/* 11 편미분방정식 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, J, PI } = window.EMG;
  const FK = window.FK;
  const f1 = FK.f1;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  // erf (Abramowitz–Stegun 7.1.26)
  const erf = (x) => { const s = Math.sign(x), t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const circ = (r, cx = 0, cy = 0, n = 120) => rng(0, 2 * PI, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 12.2 forces on a small portion of the string
    f11string() {
      const u = (x) => 0.9 * Math.sin((PI * x) / 4) + 0.12 * Math.sin((PI * x) / 2), du = (x) => 0.9 * (PI / 4) * Math.cos((PI * x) / 4) + 0.12 * (PI / 2) * Math.cos((PI * x) / 2);
      const xp = 0.55, xq = 1.3, P = [xp, u(xp)], Q = [xq, u(xq)];
      const dir = (x, s) => { const d = du(x), l = Math.hypot(1, d); return [s / l, (s * d) / l]; };
      const tp = dir(xp, -0.55), tq = dir(xq, 0.55);
      return G({
        w: 520, h: 230, x: [-0.2, 4.3], y: [-0.25, 1.45], xt: [[xp, 'x'], [xq, 'x + Δx'], [4, 'L']], xl: '', yl: 'u', m: [10, 10, 22, 14], label: '현의 작은 조각에 작용하는 힘',
        c: [{ f: u, a: 0, b: 4, c: 'vl' }, { f: u, a: xp, b: xq, c: 'ld' }, { pts: [[xp, P[1]], [xp + 0.6, P[1]]], c: 'dm ds' }, { pts: [[xq, Q[1]], [xq + 0.6, Q[1]]], c: 'dm ds' }, { pts: [[xp, 0], P], c: 'dm ds' }, { pts: [[xq, 0], Q], c: 'dm ds' }],
        extra: (X, Y) => FK.A(X(P[0]), Y(P[1]), X(P[0] + tp[0]), Y(P[1] + tp[1]), 'rx', 9) + FK.A(X(Q[0]), Y(Q[1]), X(Q[0] + tq[0]), Y(Q[1] + tq[1]), 'rx', 9)
          + dot(X, Y, P[0], P[1]) + dot(X, Y, Q[0], Q[1]) + FK.T(X(P[0]) + 4, Y(P[1]) + 16, 'P', { a: 'start', c: 'em' }) + FK.T(X(Q[0]) + 2, Y(Q[1]) + 16, 'Q', { a: 'start', c: 'em' })
          + FK.T(X(P[0] + tp[0]) - 4, Y(P[1] + tp[1]) + 4, 'T₁', { a: 'end', c: 'rl' }) + FK.T(X(Q[0] + tq[0]) + 4, Y(Q[1] + tq[1]) - 2, 'T₂', { a: 'start', c: 'rl' })
          + FK.T(X(xp + 0.42), Y(P[1]) - 4, 'α', { c: 'it' }) + FK.T(X(xq + 0.45), Y(Q[1]) + 14, 'β', { c: 'it' }),
        cap: R`길이 $\Delta x$인 조각(파란 부분). 현이 굽힘에 저항하지 않으므로 장력은 곡선에 접합니다. 수평 성분 $T_1\cos\alpha=T_2\cos\beta=T$는 같고, 수직 성분의 차 $T_2\sin\beta-T_1\sin\alpha$가 조각의 질량 $\rho\Delta x$ × 가속도가 됩니다. $\tan\alpha$, $\tan\beta$는 $x$와 $x+\Delta x$에서의 기울기 $u_x$입니다.`,
      });
    },
    // 12.3 normal modes of the string
    f11modes() {
      const panel = (n, ox, oy) => ({
        ox, oy, w: 280, h: 95, x: [-0.04, 1.04], y: [-1.25, 1.25], axes: false, m: [16, 8, 4, 8], title: n === 1 ? 'n = 1 (기본 모드)' : `n = ${n}`,
        c: [{ pts: [[0, 0], [1, 0]], c: 'dm' }, { f: (x) => Math.sin(n * PI * x), a: 0, b: 1, c: 'ld' }, { f: (x) => -Math.sin(n * PI * x), a: 0, b: 1, c: 'ld ds' }],
        extra: (X, Y) => rng(0, 1, n + 1).map((x, k) => dot(X, Y, x, 0, k > 0 && k < n)).join(''),
      });
      return G2(560, 190, '현의 정규 모드', [panel(1, 0, 0), panel(2, 280, 0), panel(3, 0, 95), panel(4, 280, 95)],
        R`$u_n=(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt)\sin\frac{n\pi x}L$의 모양. 실선과 점선은 진동의 양 끝 모습입니다. $n$번째 모드는 양 끝 외에 $n-1$개의 **마디**(속이 빈 점, 움직이지 않는 점)를 가지고 진동수는 $\frac{cn}{2L}$, 곧 기본진동수의 $n$배입니다.`);
    },
    // 12.3 string plucked at L/3: two travelling halves
    f11pluck() {
      const a = 1 / 3, f = (x) => (x <= a ? x / a : (1 - x) / (1 - a));
      const fs = (x) => { const y = ((x % 2) + 2) % 2; return y <= 1 ? f(y) : -f(2 - y); };
      const ts = [0, 1 / 6, 1 / 3, 1 / 2, 2 / 3, 1];
      const lab = ['t = 0', 't = L/6c', 't = L/3c', 't = L/2c', 't = 2L/3c', 't = L/c'];
      const ps = ts.map((t, i) => ({
        ox: (i % 3) * 186.7, oy: Math.floor(i / 3) * 105, w: 186.7, h: 105, x: [-0.04, 1.04], y: [-1.15, 1.15], axes: false, m: [16, 6, 4, 6], title: lab[i],
        c: [{ pts: [[0, 0], [1, 0]], c: 'dm' }, { f: (x) => 0.5 * fs(x - t), a: 0, b: 1, c: 'rx ds' }, { f: (x) => 0.5 * fs(x + t), a: 0, b: 1, c: 'dm ds' }, { f: (x) => 0.5 * (fs(x - t) + fs(x + t)), a: 0, b: 1, n: 400, c: 'ld' }],
      }));
      return G2(560, 210, '가운데가 아닌 곳을 퉁긴 현', ps,
        R`$x=L/3$에서 높이 1로 퉁긴 현($g=0$)의 운동 $u=\frac12\big[f^*(x-ct)+f^*(x+ct)\big]$ ($f^*$: 주기 $2L$인 홀 확장). 파란 선이 현, 주황 점선이 오른쪽으로, 회색 점선이 왼쪽으로 가는 절반 높이의 파동입니다. 모서리가 둥글어지지 않고 그대로 움직이며, $t=L/c$에 뒤집힌 모양이 되고 $t=2L/c$에 처음으로 돌아옵니다.`);
    },
    // 12.4 characteristics and domain of dependence; a bump splitting in two
    f11char() {
      const x0 = 1.2, t0 = 1.0, c = 1;
      const bump = (x) => 1 / (1 + x * x);
      return G2(560, 220, '특성선과 달랑베르 해', [
        { w: 270, h: 220, x: [-0.6, 3.0], y: [-0.25, 1.6], title: '(a) xt 평면의 특성선', xl: 'x', yl: 't', xt: [[x0 - c * t0, 'x − ct'], [x0 + c * t0, 'x + ct']], m: [22, 10, 22, 14],
          c: [{ pts: [[x0 - c * t0, 0], [x0 + c * t0, 0], [x0, t0], [x0 - c * t0, 0]], c: 'fl2' }, { pts: [[x0 - c * t0 - 0.3, -0.3], [x0 + 0.5, t0 + 0.5]], c: 'rx' }, { pts: [[x0 + c * t0 + 0.3, -0.3], [x0 - 0.5, t0 + 0.5]], c: 'rx' }, { pts: [[x0 - c * t0, 0], [x0 + c * t0, 0]], c: 'ld' }],
          extra: (X, Y) => dot(X, Y, x0, t0) + FK.T(X(x0) + 8, Y(t0) + 4, '(x, t)', { a: 'start', c: 'em' }) + FK.T(X(x0 + 0.5) + 2, Y(t0 + 0.5) + 12, 'x − ct = 상수', { a: 'start', c: 'rl' }) + FK.T(X(x0 - 0.5) - 2, Y(t0 + 0.5) + 12, 'x + ct = 상수', { a: 'end', c: 'rl' }) + FK.T(X(x0), Y(0) - 8, '의존 구간', { c: 'lb' }) },
        { ox: 290, w: 270, h: 220, x: [-5, 5], y: [-0.1, 1.15], title: '(b) f = 1/(1 + x²), g = 0', xl: 'x', xt: [[-2, '−2'], [2, '2']], m: [22, 10, 22, 10],
          c: [{ f: bump, c: 'dm ds' }, { f: (x) => 0.5 * (bump(x + 2) + bump(x - 2)), c: 'ld' }, { f: (x) => 0.5 * (bump(x + 4) + bump(x - 4)), c: 'rx' }],
          extra: (X, Y) => FK.T(X(0.3), Y(1.0) - 2, 't = 0', { a: 'start' }) + FK.T(X(2), Y(0.55) - 4, 'ct = 2', { c: 'lb' }) + FK.T(X(4), Y(0.55) - 4, 'ct = 4', { c: 'rl' }) },
      ], R`(a) 점 $(x,t)$의 값은 그 점에서 거꾸로 그은 두 특성선 $x\pm ct=$상수가 $x$축과 만드는 구간 $[x-ct,\ x+ct]$ 위의 초기값만으로 정해집니다. (b) 초기 변위는 높이가 절반인 두 봉우리로 나뉘어 모양을 유지한 채 속력 $c$로 양쪽으로 갑니다.`);
    },
    // 12.6 heat in a bar: ends at 0 vs insulated ends
    f11heat() {
      const f = (x) => x * (PI - x);
      const u0 = (x, t) => { if (t === 0) return f(x); let s = 0; for (let n = 1; n < 60; n += 2) s += (8 / (PI * n * n * n)) * Math.sin(n * x) * Math.exp(-n * n * t); return s; };
      const ui = (x, t) => { if (t === 0) return f(x); let s = (PI * PI) / 6; for (let k = 1; k < 200; k++) s -= (Math.cos(2 * k * x) * Math.exp(-4 * k * k * t)) / (k * k); return s; };
      const cls = ['vl', 'ld', 'rx', 'dm ds', 'ld ds'];
      const base = { w: 280, h: 220, x: [0, PI], y: [-0.1, 2.7], xt: [[PI / 2, 'π/2'], [PI, 'π']], yt: [[1, '1'], [2, '2']], xl: 'x', m: [22, 12, 20, 22] };
      const ta = [0, 0.1, 0.5, 1, 2], tb = [0, 0.05, 0.2, 1];
      return G2(560, 220, '막대의 온도 변화', [
        Object.assign({}, base, { title: '(a) 양 끝 0°', c: ta.map((t, i) => ({ f: (x) => u0(x, t), a: 0, b: PI, n: 160, c: cls[i] })), extra: (X, Y) => FK.T(X(PI / 2) + 4, Y(u0(PI / 2, 0)) - 6, 't = 0', { a: 'start' }) + FK.T(X(PI / 2), Y(u0(PI / 2, 2)) - 6, 't = 2', { c: 'em' }) }),
        Object.assign({}, base, { ox: 280, title: '(b) 양 끝 단열', hg: [(PI * PI) / 6], c: tb.map((t, i) => ({ f: (x) => ui(x, t), a: 0, b: PI, n: 160, c: cls[i] })), extra: (X, Y) => FK.T(X(PI) - 4, Y((PI * PI) / 6) - 6, '평균 π²/6', { a: 'end', c: 'em' }) }),
      ], R`처음 온도 $f(x)=x(\pi-x)$, $c=1$. (a) 양 끝을 0°로 유지하면 $u=\frac8\pi\sum_{n\text{ 홀수}}\frac{\sin nx}{n^3}e^{-n^2t}$이고, 시각 $t=0,\ 0.1,\ 0.5,\ 1,\ 2$에서 첫 항 모양($\sin x$)을 유지하며 0으로 식습니다. (b) 양 끝을 단열하면 열이 빠져나가지 못해 $t=0,\ 0.05,\ 0.2,\ 1$을 거치며 평균 온도 $\pi^2/6$ (가로 점선)으로 고르게 됩니다.`);
    },
    // 12.7 infinite bar: a Gaussian spreads; two half-bars at different temperatures
    f11gauss() {
      const ts = [0, 0.25, 1, 4], cls = ['vl', 'ld', 'rx', 'dm ds'];
      const g = (x, t) => Math.exp(-(x * x) / (1 + 4 * t)) / Math.sqrt(1 + 4 * t);
      const st = (x, t) => (t === 0 ? (x > 0 ? 1 : 0) : 0.5 * (1 + erf(x / (2 * Math.sqrt(t)))));
      const ts2 = [0, 0.1, 0.5, 2];
      return G2(560, 220, '무한 막대의 열전도', [
        { w: 280, h: 220, x: [-5, 5], y: [-0.05, 1.12], title: '(a) f = e^(−x²): 퍼지는 가우스 곡선', xl: 'x', yt: [[1, '1']], xt: [[-4, '−4'], [4, '4']], m: [22, 10, 20, 18], c: ts.map((t, i) => ({ f: (x) => g(x, t), n: 240, c: cls[i] })),
          extra: (X, Y) => FK.T(X(0.4), Y(1.0), 't = 0', { a: 'start' }) + FK.T(X(3.2), Y(0.3) - 2, 't = 4', { a: 'start', c: 'em' }) },
        { ox: 280, w: 280, h: 220, x: [-3, 3], y: [-0.08, 1.12], title: '(b) 1°와 0°인 반무한 막대를 맞붙임', xl: 'x', yt: [[0.5, '½'], [1, '1']], xt: [[-2, '−2'], [2, '2']], m: [22, 10, 20, 18], hg: [0.5],
          c: [{ pts: [[-3, 0], [0, 0], [0, 1], [3, 1]], c: 'vl' }].concat(ts2.slice(1).map((t, i) => ({ f: (x) => st(x, t), n: 240, c: cls[i + 1] }))),
          extra: (X, Y) => FK.T(X(-2.8), Y(0.08) - 4, 't = 0: 계단', { a: 'start' }) + FK.T(X(0.9), Y(st(0.9, 2)) + 16, 't = 2', { a: 'start', c: 'em' }) },
      ], R`$c=1$. (a) $u=\frac1{\sqrt{1+4t}}\exp\big(-\frac{x^2}{1+4t}\big)$, $t=0,\ 0.25,\ 1,\ 4$. 봉우리는 낮아지고 넓어지지만 곡선 아래 넓이(총열량)는 변하지 않습니다. (b) $u=\frac12\big[1+\operatorname{erf}\frac{x}{2\sqrt t}\big]$, $t=0.1,\ 0.5,\ 2$. 이음매 $x=0$의 온도는 처음 순간부터 줄곧 두 온도의 평균 $\frac12$입니다.`);
    },
    // 12.9 square membrane: sign pattern and nodal lines of a few eigenfunctions
    f11membrane() {
      const N = 30;
      const cells = (F) => (X, Y) => {
        let s = '';
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
          const x = (i + 0.5) / N, y = (j + 0.5) / N, v = F(x, y), o = Math.min(1, Math.abs(v)) * 0.55;
          if (o < 0.02) continue;
          s += `<rect shape-rendering="crispEdges" class="${v > 0 ? 'ldh' : 'rxh'}" style="fill-opacity:${o.toFixed(2)}" x="${f1(X(i / N))}" y="${f1(Y((j + 1) / N))}" width="${f1(X(1 / N) - X(0) + 0.6)}" height="${f1(Y(0) - Y(1 / N) + 0.6)}"/>`;
        }
        return s;
      };
      const S = (m, n) => (x, y) => Math.sin(m * PI * x) * Math.sin(n * PI * y);
      const modes = [
        ['u₁₁', S(1, 1), []], ['u₁₂', S(1, 2), [[[0, 0.5], [1, 0.5]]]], ['u₂₁', S(2, 1), [[[0.5, 0], [0.5, 1]]]],
        ['u₂₂', S(2, 2), [[[0, 0.5], [1, 0.5]], [[0.5, 0], [0.5, 1]]]], ['u₁₂ + u₂₁', (x, y) => 0.6 * (S(1, 2)(x, y) + S(2, 1)(x, y)), [[[0, 1], [1, 0]]]], ['u₁₂ − u₂₁', (x, y) => 0.6 * (S(1, 2)(x, y) - S(2, 1)(x, y)), [[[0, 0], [1, 1]]]],
      ];
      const ps = modes.map(([t, F, lines], i) => ({
        ox: (i % 3) * 186.7, oy: Math.floor(i / 3) * 150, w: 186.7, h: 150, x: [0, 1], y: [0, 1], axes: false, m: [20, 30, 6, 30], title: t,
        c: [{ pts: [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]], c: 'vl' }].concat(lines.map((p) => ({ pts: p, c: 'vl ds' }))),
        extra: cells(F),
      }));
      return G2(560, 300, '정사각형 막의 고유함수', ps,
        R`$a=b=1$인 막의 모드 $F_{mn}=\sin m\pi x\sin n\pi y$의 부호(파랑 +, 주황 −)와 마디선(점선). $u_{12}$와 $u_{21}$은 진동수가 같으므로(축퇴) 둘을 더하거나 빼도 같은 진동수의 모드이고, 그때 마디선은 대각선이 됩니다. $\sin\pi x\sin2\pi y+B\sin2\pi x\sin\pi y=2\sin\pi x\sin\pi y\,(\cos\pi y+B\cos\pi x)$에서 $B=\pm1$인 경우입니다.`);
    },
    // 12.10 radial modes of the circular drum
    f11drum() {
      const al = [2.4048, 5.5201, 8.6537], cls = ['ld', 'rx', 'vl'];
      const disk = (m, ox) => ({
        ox, oy: 0, w: 110, h: 220, x: [-1.15, 1.15], y: [-2.19, 2.19], axes: false, m: [22, 4, 4, 4], title: `m = ${m + 1}`,
        c: [{ pts: circ(1), c: 'vl' }].concat(al.slice(0, m).map((z) => ({ pts: circ(z / al[m]), c: 'vl ds' }))),
        extra: (X, Y) => { const signs = []; let s = 1; const rs = [0].concat(al.slice(0, m).map((z) => z / al[m]), [1]); for (let k = 0; k <= m; k++) { const r = (rs[k] + rs[k + 1]) / 2; signs.push(FK.T(X(k === 0 ? 0 : r), Y(0) + 4, s > 0 ? '+' : '−', { c: s > 0 ? 'lb' : 'rl' })); s = -s; } return signs.join(''); },
      });
      return G2(560, 220, '원형 막의 반지름 대칭 모드', [
        { w: 230, h: 220, x: [0, 1.05], y: [-0.5, 1.1], title: '(a) J₀(α_m r / R)', xl: 'r/R', xt: [[0.5, '0.5'], [1, '1']], yt: [[1, '1']], m: [22, 10, 20, 18], c: al.map((z, i) => ({ f: (r) => J(0, z * r), a: 0, b: 1, n: 200, c: cls[i] })),
          extra: (X, Y) => FK.T(X(0.3), Y(J(0, al[0] * 0.3)) - 6, 'm = 1', { a: 'start', c: 'lb' }) + FK.T(X(0.6), Y(J(0, al[1] * 0.6)) + 16, 'm = 2', { c: 'rl' }) + FK.T(X(0.46), Y(J(0, al[2] * 0.46)) - 6, 'm = 3', { c: 'em' }) },
        disk(0, 230), disk(1, 340), disk(2, 450),
      ], R`(a) $m$번째 모드의 반지름 방향 모양 $J_0(\alpha_mr/R)$ ($\alpha_1\approx2.405$, $\alpha_2\approx5.520$, $\alpha_3\approx8.654$). 모두 $r=R$에서 0입니다. (b) 위에서 본 모습. $m$번째 모드는 $m-1$개의 원형 마디선(점선)을 가지고, 이웃한 고리는 반대 방향으로 움직입니다. $m=2$의 마디선은 $r=\frac{\alpha_1}{\alpha_2}R\approx0.436R$입니다.`);
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
