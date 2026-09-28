/* 16 복소해석과 퍼텐셜 이론 — 본문 그림 (em/figs.js의 EMG로 그립니다) */
(function () {
  const { G, G2, dot, PI } = window.EMG;
  const FK = window.FK;
  const rng = (a, b, n) => Array.from({ length: n }, (_, k) => a + ((b - a) * k) / (n - 1));
  const arc = (r, a0, a1, cx = 0, cy = 0, n = 80) => rng(a0, a1, n + 1).map((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 18.1 potentials in an angular region and between coaxial cylinders
    f16plates() {
      const al = (2 * PI) / 3;
      return G2(560, 230, '간단한 퍼텐셜', [
        { w: 280, h: 230, x: [-1.7, 2.1], y: [-0.3, 2.58], title: '(a) 각 α = 2π/3인 두 판', axes: false, m: [22, 8, 8, 8],
          c: rng(0, al, 7).slice(1, 6).map((t) => ({ pts: [[0, 0], [2 * Math.cos(t), 2 * Math.sin(t)]], c: 'ld' })).concat([0.5, 1, 1.5].map((r) => ({ pts: arc(r, 0, al), c: 'rx ds' })), [{ pts: [[0, 0], [2, 0]], c: 'vl' }, { pts: [[0, 0], [2 * Math.cos(al), 2 * Math.sin(al)]], c: 'vl' }]),
          extra: (X, Y) => FK.T(X(1.9), Y(0) + 14, 'Φ = 0', { a: 'end', c: 'em' }) + FK.T(X(2 * Math.cos(al)) - 4, Y(2 * Math.sin(al)) + 4, 'Φ = V₀', { a: 'end', c: 'em' }) },
        { ox: 280, w: 280, h: 230, x: [-2.84, 2.84], y: [-2.1, 2.2], title: '(b) 동축 원통', axes: false, m: [22, 8, 8, 8],
          c: [1.2, 1.6].map((r) => ({ pts: arc(r, 0, 2 * PI), c: 'ld' })).concat(rng(0, 2 * PI, 13).slice(0, 12).map((t) => ({ pts: [[0.8 * Math.cos(t), 0.8 * Math.sin(t)], [2 * Math.cos(t), 2 * Math.sin(t)]], c: 'rx ds' })), [{ pts: arc(0.8, 0, 2 * PI), c: 'vl' }, { pts: arc(2, 0, 2 * PI), c: 'vl' }]) },
      ], R`실선은 등퍼텐셜선, 점선은 힘선입니다. (a) $\Phi=\frac{V_0}\alpha\operatorname{Arg}z$: 등퍼텐셜선은 원점에서 나가는 반직선, 힘선은 원호. (b) $\Phi=a\ln r+b$: 등퍼텐셜선은 동심원, 힘선은 반직선. 두 경우 복소 퍼텐셜은 $\operatorname{Ln}z$의 상수배이고, 실수부와 허수부의 역할만 바뀝니다.`);
    },
    // 18.1 a pair of opposite line charges: two orthogonal families of circles
    f16pair() {
      const c = 1, ks = [0.25, 0.45, 0.7], ts = [-2.2, -1.1, -0.45, 0.45, 1.1, 2.2];
      const eq = [];
      ks.forEach((k) => { const cx = (c * (1 + k * k)) / (1 - k * k), r = (2 * c * k) / (1 - k * k); eq.push(arc(r, 0, 2 * PI, cx, 0, 120), arc(r, 0, 2 * PI, -cx, 0, 120)); });
      const fl = ts.map((t) => arc(Math.hypot(c, t), 0, 2 * PI, 0, t, 200));
      return G({
        w: 460, h: 260, x: [-3.3, 3.3], y: [-1.85, 1.85], axes: false, m: [8, 8, 8, 8], label: '두 선전하의 퍼텐셜',
        c: eq.map((p) => ({ pts: p, c: 'ld' })).concat([{ pts: [[0, -1.85], [0, 1.85]], c: 'ld' }, { pts: [[-3.3, 0], [3.3, 0]], c: 'rx ds' }], fl.map((p) => ({ pts: p, c: 'rx ds' }))),
        extra: (X, Y) => dot(X, Y, 1, 0) + dot(X, Y, -1, 0) + FK.T(X(1), Y(0) + 16, '+', { c: 'em' }) + FK.T(X(-1), Y(0) + 16, '−', { c: 'em' }),
        cap: R`$z=\pm c$에 크기가 같고 부호가 반대인 선전하가 있을 때 $F=K\big[\operatorname{Ln}(z-c)-\operatorname{Ln}(z+c)\big]$. 등퍼텐셜선 $\big|\frac{z-c}{z+c}\big|=$상수는 아폴로니우스 원(실선, 가운데 세로선 포함)이고, 힘선은 $\pm c$를 지나는 원호(점선)입니다. 두 원족은 모든 점에서 직교합니다.`,
      });
    },
    // 18.3 mixed problem: insulated segment, isotherms are hyperbolas, heat flows along ellipses
    f16heat() {
      const Z = (u, v) => [Math.sin(u) * Math.cosh(v), Math.cos(u) * Math.sinh(v)];
      const us = rng(-PI / 2, PI / 2, 9).slice(1, 8), vs = [0.35, 0.7, 1.05, 1.4];
      return G({
        w: 460, h: 240, x: [-3.2, 3.2], y: [-0.35, 2.88], axes: false, m: [8, 8, 8, 8], label: '단열 구간이 있는 반평면의 온도',
        c: us.map((u) => ({ pts: rng(0, 2.2, 60).map((v) => Z(u, v)), c: 'ld' })).concat(vs.map((v) => ({ pts: rng(-PI / 2, PI / 2, 80).map((u) => Z(u, v)), c: 'rx ds' })), [{ pts: [[-3.2, 0], [-1, 0]], c: 'vl' }, { pts: [[1, 0], [3.2, 0]], c: 'vl' }, { pts: [[-1, 0], [1, 0]], c: 'dm ds' }]),
        extra: (X, Y) => FK.T(X(-2.1), Y(0) + 16, 'T = 0°', { c: 'em' }) + FK.T(X(2.1), Y(0) + 16, 'T = 100°', { c: 'em' }) + FK.T(X(0), Y(0) + 16, '단열', { c: 'rl' }) + dot(X, Y, -1, 0, true) + dot(X, Y, 1, 0, true),
        cap: R`$x\lt -1$은 0°, $x>1$은 100°, 그 사이 $-1\lt x\lt 1$은 단열된 반평면. $w=\arcsin z$가 반평면을 띠 $-\frac\pi2\lt u\lt \frac\pi2$로 보내므로 $T=50+\frac{100}\pi\operatorname{Re}\arcsin z$. 등온선(실선)은 초점이 $\pm1$인 쌍곡선, 열 흐름선(점선)은 같은 초점의 타원이고, 열은 단열 구간을 가로지르지 않고 타원을 따라 뜨거운 쪽에서 찬 쪽으로 흐릅니다.`,
      });
    },
    // 18.4 flow around a cylinder and flow in a 60° corner
    f16flow() {
      const psis = [0.2, 0.5, 0.9, 1.4, 2.0];
      const stream = (psi, sg) => rng(0.01, PI - 0.01, 200).map((t) => { const s = Math.sin(t), r = (psi / s + Math.sqrt((psi * psi) / (s * s) + 4)) / 2; return [r * Math.cos(t), sg * r * Math.sin(t)]; }).filter((p) => Math.abs(p[0]) < 3.6);
      const corner = (psi) => rng(0.005, PI / 3 - 0.005, 200).map((t) => { const r = Math.cbrt(psi / Math.sin(3 * t)); return [r * Math.cos(t), r * Math.sin(t)]; }).filter((p) => Math.hypot(p[0], p[1]) < 3);
      return G2(560, 240, '이상 유체의 흐름', [
        { w: 300, h: 240, x: [-3.3, 3.3], y: [-2.45, 2.55], title: '(a) 원기둥을 지나는 흐름 F = z + 1/z', axes: false, m: [22, 6, 6, 6],
          c: psis.map((p) => ({ pts: stream(p, 1), c: 'ld' })).concat(psis.map((p) => ({ pts: stream(p, -1), c: 'ld' })), [{ pts: [[-3.3, 0], [-1, 0]], c: 'ld' }, { pts: [[1, 0], [3.3, 0]], c: 'ld' }, { pts: arc(1, 0, 2 * PI, 0, 0, 120), c: 'vl' }]),
          extra: (X, Y) => dot(X, Y, 1, 0, true) + dot(X, Y, -1, 0, true) + FK.A(X(-3.1), Y(2.1), X(-2.4), Y(2.1), 'rx', 7) },
        { ox: 300, w: 260, h: 240, x: [-0.2, 2.4], y: [-0.2, 2.1], title: '(b) 60° 모서리 F = z³', axes: false, m: [22, 6, 6, 6],
          c: [0.3, 1, 2.2, 4].map((p) => ({ pts: corner(p), c: 'ld' })).concat([{ pts: [[0, 0], [2.4, 0]], c: 'vl' }, { pts: [[0, 0], [1.2, 1.2 * Math.sqrt(3)]], c: 'vl' }]),
          extra: (X, Y) => dot(X, Y, 0, 0, true) },
      ], R`유선 $\Psi=$상수. (a) $\Psi=\big(r-\frac1r\big)\sin\theta$에서 $\Psi=0$이 단위원과 실수축이므로 원이 벽 역할을 합니다. 빈 점 $z=\pm1$이 정체점이고, 멀리서는 속력 1의 균일 흐름입니다. (b) $\Psi=r^3\sin3\theta$에서 $\Psi=0$인 두 반직선 $\theta=0$, $\frac\pi3$이 벽이 되어, 흐름이 $60^\circ$ 모서리를 돌아 나갑니다. 모서리 꼭짓점이 정체점입니다.`);
    },
    // 18.5 Dirichlet problem in the unit disk: level curves of 1/2 − (1/2) r² cos 2θ
    f16poisson() {
      const cs = [0.1, 0.25, 0.4, 0.6, 0.75, 0.9];
      const lev = (c) => { const k = 1 - 2 * c, out = []; // x² − y² = k inside the unit disk
        if (Math.abs(k) < 1e-9) return [[[-0.7071, -0.7071], [0.7071, 0.7071]], [[-0.7071, 0.7071], [0.7071, -0.7071]]];
        const a = Math.sqrt(Math.abs(k)), tmax = Math.acosh(Math.sqrt((1 + Math.abs(k)) / (2 * Math.abs(k))));
        [1, -1].forEach((s) => out.push(rng(-tmax, tmax, 80).map((t) => (k > 0 ? [s * a * Math.cosh(t), a * Math.sinh(t)] : [a * Math.sinh(t), s * a * Math.cosh(t)]))));
        return out; };
      const curves = [];
      cs.forEach((c) => lev(c).forEach((p) => curves.push({ pts: p, c: c < 0.5 ? 'ld' : 'rx' })));
      return G({
        w: 420, h: 260, x: [-1.9, 1.9], y: [-1.12, 1.18], axes: false, m: [8, 8, 8, 8], label: '원판의 디리클레 문제',
        c: [{ pts: arc(1, 0, 2 * PI, 0, 0, 160), c: 'vl' }].concat(curves),
        extra: (X, Y) => dot(X, Y, 0, 0) + FK.T(X(0) + 6, Y(0) - 6, '½', { a: 'start', c: 'em' }) + FK.T(X(1.05), Y(0) + 4, '0', { a: 'start', c: 'em' }) + FK.T(X(0), Y(1.05) - 2, '1', { c: 'em' }),
        cap: R`경계값 $\sin^2\theta$ (오른쪽·왼쪽 끝에서 0, 위아래 끝에서 1)의 조화 확장 $\Phi=\frac12-\frac12r^2\cos2\theta=\frac12-\frac12(x^2-y^2)$의 등고선. 파랑은 $\Phi\lt \frac12$, 주황은 $\Phi>\frac12$이고 모두 쌍곡선입니다. 중심의 값 $\frac12$은 경계의 평균이고, 최댓값·최솟값은 경계에만 있습니다.`,
      });
    },
  });
  function R(s, ...v) { return String.raw(s, ...v); }
})();
