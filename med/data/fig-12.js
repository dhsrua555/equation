/* 12 규제 II — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const T = FK.T;
  const N = (m, s2) => (x) => Math.exp(-((x - m) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);

  // derivative dy/dx of a random 1-input ReLU network (forward mode), He init, optional residual blocks
  function jac(depth, width, residual, seed) {
    const r = MF.rng(seed);
    const W = [], b = [];
    for (let l = 0; l < depth; l++) {
      const nin = l === 0 ? 1 : width, nout = l === depth - 1 ? 1 : width;
      W.push(Array.from({ length: nout }, () => Array.from({ length: nin }, () => MF.normal(r) * Math.sqrt(2 / nin) * (residual && l > 0 && l < depth - 1 ? 0.35 : 1))));
      b.push(Array.from({ length: nout }, () => 0.1 * MF.normal(r)));
    }
    return (x) => {
      let z = [x], dz = [1];
      for (let l = 0; l < depth; l++) {
        const a = W[l].map((row, i) => row.reduce((s, w, j) => s + w * z[j], b[l][i]));
        const da = W[l].map((row) => row.reduce((s, w, j) => s + w * dz[j], 0));
        if (l === depth - 1) return da[0];
        let nz = a.map((v) => Math.max(0, v)), ndz = da.map((v, i) => (a[i] > 0 ? v : 0));
        if (residual && l > 0) { nz = nz.map((v, i) => v + z[i]); ndz = ndz.map((v, i) => v + dz[i]); }
        z = nz; dz = ndz;
      }
      return dz[0];
    };
  }

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 9.4 soft weight sharing: mixture prior and its regularizer
    softshare() {
      const comp = [[0.5, -0.6, 0.02], [0.3, 0, 0.004], [0.2, 0.7, 0.03]];
      const p = (w) => comp.reduce((s, [pi, m, v]) => s + pi * N(m, v)(w), 0);
      const r = MF.rng(9), ws = [];
      comp.forEach(([pi, m, v]) => { for (let k = 0; k < Math.round(pi * 40); k++) ws.push(m + Math.sqrt(v) * MF.normal(r)); });
      return G2(560, 210, '소프트 가중치 공유', [
        { w: 280, h: 210, x: [-1.2, 1.2], y: [0, 3.2], xl: 'w', title: '혼합 가우시안 사전분포 p(w)', m: [22, 10, 22, 16], xt: [[-0.6, 'μ₁'], [0, 'μ₂'], [0.7, 'μ₃']], yt: [], c: [{ f: p, c: 'ld' }],
          inner: (X, Y) => ws.map((w) => FK.L(X(w), Y(0), X(w), Y(0.18), 'rx')).join('') },
        { w: 280, h: 210, ox: 280, x: [-1.2, 1.2], y: [-1.5, 6], xl: 'w', title: '규제항 −ln p(w)', m: [22, 10, 22, 16], xt: [[-0.6, 'μ₁'], [0, 'μ₂'], [0.7, 'μ₃']], yt: [], c: [{ f: (w) => -Math.log(p(w)), c: 'rx' }, { f: (w) => w * w * 4 - 1, c: 'dm ds' }],
          extra: (X, Y) => T(X(0.95), Y(3.6), '가중치 감쇠', { s: 10.5, a: 'end' }) },
      ], R`왼쪽: 세 군집($\mu_1,\mu_2,\mu_3$)으로 된 혼합 가우시안 사전분포와, 이 규제로 학습한 가중치들(아래 짧은 선)이 군집 중심 근처로 모인 모습. 오른쪽: 규제항 $\Omega(w)=-\ln p(w)$는 골짜기가 셋이라 각 가중치를 **가장 가까운 군집 중심** 쪽으로 끌어당깁니다. 가중치 감쇠(점선)는 모든 가중치를 0 하나로만 끌어당깁니다.`);
    },
    // 9.4 weight sharing in a small CNN: 6×6 input, 3×3 convolution, 2×2 pooling, fully connected
    share2d() {
      const c = 20;
      const grid = (x, y, n, hl) => { let o = ''; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o += FK.R(x + j * c, y + i * c, c - 2, c - 2, hl(i, j) ? 'rg hl' : 'rg'); return o; };
      const cam = (x, y, w, h) => `<rect class="rxh" x="${x}" y="${y}" width="${w}" height="${h}" style="fill-opacity:0.42"/>`;
      const ix = 20, iy = 40, fx = 200, fy = 60, px = 320, py = 80;
      // input: patch A (rows 0–2, cols 0–2) and patch B (rows 2–4, cols 3–5) go through the same 3×3 filter
      let s = grid(ix, iy, 6, (i, j) => i < 3 && j < 3) + cam(ix + 3 * c, iy + 2 * c, 3 * c - 2, 3 * c - 2);
      s += FK.R(ix, iy, 3 * c - 2, 3 * c - 2, 'sv') + FK.R(ix + 3 * c, iy + 2 * c, 3 * c - 2, 3 * c - 2, 'sv');
      // feature map 4×4: unit (0,0) from patch A, unit (2,3) from patch B
      s += FK.L(ix + 3 * c - 2, iy, fx, fy, 'dm') + FK.L(ix + 3 * c - 2, iy + 3 * c - 2, fx, fy + c - 2, 'dm');
      s += FK.L(ix + 6 * c - 2, iy + 2 * c, fx + 3 * c, fy + 2 * c, 'rx') + FK.L(ix + 6 * c - 2, iy + 5 * c - 2, fx + 3 * c, fy + 3 * c - 2, 'rx');
      s += grid(fx, fy, 4, (i, j) => i === 0 && j === 0) + cam(fx + 3 * c, fy + 2 * c, c - 2, c - 2);
      // 2×2 max pooling: each output takes the largest of a 2×2 block
      s += FK.L(fx + 2 * c - 2, fy, px, py, 'dm') + FK.L(fx + 2 * c - 2, fy + 2 * c - 2, px, py + c - 2, 'dm');
      s += grid(px, py, 2, (i, j) => i === 0 && j === 0) + cam(px + c, py + c, c - 2, c - 2);
      // fully connected output
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([i, j]) => { s += FK.L(px + j * c + 9, py + i * c + 9, 440, 99, 'ax'); });
      s += FK.C(440, 99, 11, 'nd');
      s += T(ix + 3 * c, 182, '입력 6×6', { c: 'em' }) + T(fx + 2 * c, 182, '특징 맵 4×4', { c: 'em' }) + T(px + c, 182, '풀링 2×2', { c: 'em' }) + T(440, 182, '완전연결', { c: 'em' });
      s += T(ix + 3 * c, 198, '3×3 패치 두 개', { s: 10.5 }) + T(fx + 2 * c, 198, '같은 3×3 필터', { s: 10.5 }) + T(px + c, 198, '2×2 최대 풀링', { s: 10.5 }) + T(440, 198, '출력', { s: 10.5 });
      s += T(280, 226, '독립 모수: 공유하면 10개 (가중치 9 + 편향 1), 공유하지 않으면 16 × 10 = 160개', { s: 11 });
      return FK.fig(560, 236, 'CNN의 가중치 공유', s,
        R`$6\times6$ 영상에 $3\times3$ 필터를 한 칸씩 미끄러뜨리면 $6-3+1=4$이므로 $4\times4$ 특징 맵이 나옵니다. 파란 패치와 주황 패치는 위치가 다르지만 **같은 9개 가중치**로 가중합되어 각각 특징 맵의 파란·주황 유닛이 됩니다. 그래서 이 층의 독립 모수는 가중치 9개와 편향 1개뿐입니다. 이어서 $2\times2$ 최대 풀링이 블록마다 가장 큰 값을 골라 $2\times2$로 줄이고, 완전연결층이 넷을 모아 출력을 냅니다.`);
    },
    // 9.5 error surfaces without and with residual connections (contour sketch after Li et al. 2017, Bishop Fig. 9.14)
    losssurf() {
      const rough = (x, y) => 0.3 * (x * x + y * y) + 0.35 * Math.sin(3.1 * x + 0.4) * Math.cos(2.7 * y) + 0.25 * Math.sin(5.3 * x - 2.1 * y) + 0.2 * Math.cos(4.6 * y + 1.7 * x) + 0.12 * Math.sin(7 * x) * Math.sin(6 * y);
      const smooth = (x, y) => 0.3 * (x * x + y * y) + 0.04 * x * (x * x + y * y);
      const cls = (li) => (li < 3 ? 'ld' : 'dm');
      const P = (f, lv, t, ox, extra) => ({ w: 280, h: 240, ox, x: [-2, 2], y: [-2, 2], title: t, m: [22, 36, 10, 36], xt: [], yt: [], axes: false,
        inner: MF.contour(f, [-2, 2], [-2, 2], lv, 80, cls), extra: (X, Y) => FK.R(X(-2), Y(2), X(2) - X(-2), Y(-2) - Y(2), 'dm') + (extra ? extra(X, Y) : '') });
      return G2(560, 240, '잔차 연결과 오차 곡면', [
        P(rough, [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.8, 1.1, 1.5, 2], '잔차 연결 없음 (56층)', 0),
        P(smooth, [0.04, 0.12, 0.25, 0.42, 0.62, 0.86, 1.15, 1.5, 1.9], '잔차 연결 있음', 280, (X, Y) => FK.dot(X, Y, 0, 0)),
      ], R`교재 그림 9.14는 56층 망의 오차 곡면을 매개변수 공간의 두 방향으로 자른 단면을 입체로 그린 것입니다(Li et al., 2017). 여기서는 같은 모양을 등고선 개념도로 다시 그렸습니다(진한 선일수록 낮은 오차). 잔차 연결이 없으면(왼쪽) 작은 골짜기와 봉우리가 어지럽게 흩어져 기울기가 자리마다 크게 달라지고, 경사하강이 엉뚱한 골짜기에 갇히거나 튀기 쉽습니다. 같은 망에 잔차 연결을 넣으면(오른쪽) 곡면이 바닥(점) 하나인 매끄러운 그릇 모양이 되어 기울기를 따라 내려가기만 하면 됩니다.`);
    },
    // 9.5 residual network unravelled into parallel paths (Bishop Fig. 9.15)
    resunroll() {
      const r1 = 30, r2 = 78, rx = 120, r4 = 162, r5 = 208, bot = 228, bus = 56;
      const blk = (x, y, t) => FK.R(x, y - 12, 54, 24, 'bm2') + FK.R(x, y - 12, 54, 24, 'sv') + T(x + 27, y + 4, t, { s: 11, c: 'em' });
      const plus = (x, y) => FK.C(x, y, 8, 'sp') + T(x, y + 4, '+', { s: 11, c: 'em' });
      const lab = (x, y, t) => T(x + 10, y - 10, t, { a: 'start', s: 10.5 });
      let s = T(20, rx + 4, 'x', { c: 'em' }) + FK.L(28, rx, bus, rx, 'ax') + FK.L(bus, r1, bus, bot, 'ax');
      [r1, r2, r4, r5].forEach((y) => { s += FK.A(bus, y, 80, y, 'ax', 6) + blk(80, y, 'F₁'); });
      // rows 1 and 4: F₁(x) + x = z₁ → F₂ → + z₁ = z₂
      [r1, r4].forEach((y) => {
        s += FK.A(134, y, 152, y, 'ax', 6) + plus(160, y) + FK.L(bus, y + 20, 160, y + 20, 'ax') + FK.A(160, y + 20, 160, y + 8, 'ax', 6) + lab(160, y, 'z₁');
        s += FK.A(168, y, 182, y, 'ax', 6) + blk(182, y, 'F₂') + FK.A(236, y, 256, y, 'ax', 6) + plus(264, y) + lab(264, y, 'z₂');
      });
      // rows 2 and 5: F₁(x) + x = z₁, fed up into the plus above
      [[r2, r1, rx], [r5, r4, bot]].forEach(([y, yu, yd]) => {
        s += FK.A(134, y, 256, y, 'ax', 6) + plus(264, y) + lab(264, y, 'z₁') + FK.A(264, y - 8, 264, yu + 8, 'ax', 6);
        s += FK.L(bus, yd, 264, yd, 'ax') + FK.A(264, yd, 264, y + 8, 'ax', 6);
      });
      // top branch F₃(z₂), lower branch z₂, summed into y
      s += FK.A(272, r1, 288, r1, 'ax', 6) + blk(288, r1, 'F₃') + FK.L(342, r1, 400, r1, 'ax') + FK.A(400, r1, 400, rx - 8, 'ax', 6) + T(371, r1 - 6, 'F₃(z₂)', { s: 10.5 });
      s += FK.L(272, r4, 400, r4, 'ax') + FK.A(400, r4, 400, rx + 8, 'ax', 6);
      s += plus(400, rx) + FK.A(408, rx, 440, rx, 'ax', 6) + T(448, rx + 4, 'y', { a: 'start', c: 'em' }) + T(540, rx + 28, 'y = F₃(z₂) + z₂', { a: 'end', s: 10.5 });
      return FK.fig(560, 240, '펼친 잔차망', s,
        R`세 블록짜리 잔차망을 펼친 그림(교재 그림 9.15)입니다. 맨 위 줄은 $F_3(\mathbf z_2)$를, 아래 두 줄은 $\mathbf z_2=F_2(\mathbf z_1)+\mathbf z_1$을 계산하고, 오른쪽 덧셈이 $\mathbf y=F_3(\mathbf z_2)+\mathbf z_2$를 만듭니다. 이름이 같은 블록은 같은 함수(같은 가중치)라 실제 계산량이 늘지는 않으며, 펼친 그림은 입력에서 출력까지 블록을 0개부터 3개까지 지나는 여러 경로가 **나란히 계산되어 더해지는** 구조를 보여 줍니다. 깊은 경로는 표현력을, 얕은 경로(맨 아래 $\mathbf x$ 직통까지)는 쉬운 기울기 전파를 맡습니다.`);
    },
    // 9.5 shattered gradients: derivative of the network output w.r.t. its input
    shattered() {
      const xs = Array.from({ length: 241 }, (_, k) => -2 + (4 * k) / 240);
      const cases = [[2, false, '2층'], [25, false, '25층'], [51, true, '51층 + 잔차 연결']];
      const ps = cases.map(([d, res, t], i) => {
        const J = jac(d, 24, res, 40 + i), ys = xs.map(J), lo = Math.min(...ys), hi = Math.max(...ys), pad = 0.08 * (hi - lo || 1);
        return { w: 186, h: 170, ox: i * 186, x: [-2, 2], y: [lo - pad, hi + pad], title: t, m: [22, 6, 18, 6], xt: [], yt: [], axes: false,
          c: [{ pts: xs.map((x, k) => [x, ys[k]]), c: i === 1 ? 'rx' : 'ld' }], extra: (X, Y) => FK.L(X(-2), Y(lo - pad), X(2), Y(lo - pad), 'ax') };
      });
      return G2(558, 170, '산산조각 난 기울기', ps,
        R`무작위로 초기화한(He 초기화) 입력 하나·출력 하나인 ReLU망의 도함수 $dy/dx$를 입력 $x\in[-2,2]$에 대해 그렸습니다. 2층망은 몇 번 꺾이는 계단 모양이지만, 25층망은 잡음처럼 요동칩니다(산산조각 난 기울기). 잔차 연결을 넣은 51층망은 더 깊은데도 도함수가 훨씬 매끄럽습니다.`);
    },
    // 9.5 residual design: where to add relative to ReLU
    resdesign() {
      const blk = (x, y, w, t, cls) => FK.R(x, y, w, 26, cls) + FK.R(x, y, w, 26, 'sv') + T(x + w / 2, y + 17, t, { s: 11, c: 'em' });
      const plus = (x, y) => FK.C(x, y, 8, 'sp') + T(x, y + 4, '+', { s: 11, c: 'em' });
      const row = (y, a, b, ca, cb, lab) => {
        let s = FK.A(20, y + 13, 44, y + 13, 'ax', 6) + blk(46, y, 80, a, ca) + FK.A(128, y + 13, 150, y + 13, 'ax', 6) + blk(152, y, 80, b, cb) + FK.A(234, y + 13, 252, y + 13, 'ax', 6) + plus(260, y + 13);
        s += FK.P(`M32,${y + 13} V${y - 8} H260 V${y + 3}`, 'ax') + T(300, y + 17, lab, { a: 'start', s: 11 });
        return s;
      };
      let s = row(30, 'Linear', 'ReLU', 'bm', 'bm2', '(a) 더하는 값 F(z) ≥ 0: 표현이 한쪽으로만') + row(110, 'ReLU', 'Linear', 'bm2', 'bm', '(b) 마지막 ReLU 앞에서 더함: 양·음 모두 가능');
      return FK.fig(560, 160, '잔차 블록의 설계', s,
        R`(a)는 블록이 ReLU 출력(항상 $\ge0$)을 더하므로 $\mathbf z$가 층마다 커지기만 할 수 있어 유연성이 줄어듭니다. 그래서 (b)처럼 비선형성 뒤에 선형층을 두어 더해지는 변화량이 양수와 음수 모두 될 수 있게 하는 설계를 더 많이 씁니다.`);
    },
    // 9.5 unrolled residual network: number of paths of each length
    respaths() {
      const L = 10, C = (n, k) => { let v = 1; for (let i = 1; i <= k; i++) v = (v * (n - i + 1)) / i; return v; };
      const pts = Array.from({ length: L + 1 }, (_, k) => [k, C(L, k)]);
      return G({ w: 560, h: 210, x: [-0.6, 10.6], y: [0, 270], xl: 'k', yl: '경로 수', label: '잔차망의 경로', m: [14, 16, 22, 34], xt: pts.map(([k]) => [k, String(k)]), yt: [[126, '126'], [252, '252']],
        extra: (X, Y) => pts.map(([k, c]) => FK.R(X(k) - 13, Y(c), 26, Y(0) - Y(c), k === 5 ? 'rxh' : 'ldh')).join(''),
        cap: R`잔차 블록 $L$개를 펼치면 각 블록을 “지나거나 건너뛰는” 선택마다 경로가 하나씩 생겨 모두 $2^L$개입니다. $L=10$이면 1,024개이고, 블록 $k$개를 지나는 경로가 $\binom{10}k$개라 대부분이 중간 깊이입니다. 얕은 경로는 기울기를 쉽게 전하고, 깊은 경로는 표현력을 줍니다.` });
    },
    // 9.6 committee error for correlated models
    committee() {
      const Ms = Array.from({ length: 20 }, (_, k) => k + 1);
      const f = (rho) => (M) => rho + (1 - rho) / M;
      return G({ w: 560, h: 220, x: [1, 20], y: [0, 1.05], xl: '모델 수 M', yl: 'E_COM / E_AV', label: '위원회의 오차', m: [14, 16, 22, 34], xt: [1, 5, 10, 15, 20].map((v) => [v, String(v)]), yt: [[0.3, '0.3'], [0.6, '0.6'], [1, '1']],
        c: [0, 0.3, 0.6].map((rho, i) => ({ f: f(rho), c: ['ld', 'rx', 'vl'][i] })),
        inner: (X, Y) => MF.dots(X, Y, Ms.map((M) => [M, f(0)(M)])),
        extra: (X, Y) => legend(X(11), Y(0.95), [['ld', '무상관 ρ = 0: 1/M'], ['rx', '상관 ρ = 0.3'], ['vl', '상관 ρ = 0.6']]),
        cap: R`오차의 분산이 같고 쌍마다 상관계수가 $\rho$이면 $E_{\text{COM}}=\{\rho+(1-\rho)/M\}E_{\text{AV}}$입니다. 무상관이면 $1/M$로 줄지만, 상관이 있으면 $\rho$ 아래로는 내려가지 않습니다. 그래서 앙상블에는 서로 **다른 오차**를 내는 다양한 모델이 필요합니다.` });
    },
    // 9.6 bootstrap data sets
    bootstrap() {
      const r = MF.rng(6), n = 8;
      let s = T(60, 30, '원래 자료', { c: 'em' });
      for (let i = 0; i < n; i++) s += FK.R(130 + i * 44, 14, 38, 26, 'rg') + FK.R(130 + i * 44, 14, 38, 26, 'sv') + T(149 + i * 44, 32, String(i + 1), { c: 'em' });
      for (let b = 0; b < 3; b++) {
        const pick = Array.from({ length: n }, () => 1 + Math.floor(r() * n)).sort((a, c) => a - c);
        const y = 64 + b * 44;
        s += T(60, y + 18, `부트스트랩 ${b + 1}`, { c: 'em' });
        pick.forEach((v, i) => { s += FK.R(130 + i * 44, y, 38, 26, 'bm2') + FK.R(130 + i * 44, y, 38, 26, 'sv') + T(149 + i * 44, y + 18, String(v)); });
        const miss = Array.from({ length: n }, (_, k) => k + 1).filter((k) => !pick.includes(k));
        s += T(490, y + 18, `빠짐: ${miss.join(', ') || '없음'}`, { a: 'start', s: 10.5 });
      }
      return FK.fig(560, 200, '부트스트랩 자료', s,
        R`원래 자료 $N=8$개에서 **복원 추출**로 8개씩 뽑은 세 벌입니다. 어떤 점은 여러 번 뽑히고 어떤 점은 빠집니다(한 점이 빠질 확률은 $(1-1/N)^N\approx e^{-1}\approx0.37$). 벌마다 모델을 따로 학습해 예측을 평균하는 것이 배깅입니다.`);
    },
    // 9.6.1 dropout sub-networks
    dropout() {
      const layers = [[3, 40], [4, 110], [3, 180]];
      const draw = (ox, drop) => {
        let s = '';
        const pos = layers.map(([n, x]) => Array.from({ length: n }, (_, i) => [ox + x * 0.62, 40 + (i - (n - 1) / 2) * 38 + 60]));
        for (let l = 0; l < 2; l++) pos[l].forEach((p, i) => pos[l + 1].forEach((q, j) => { if (!drop[l][i] && !drop[l + 1][j]) s += MF.link(p[0], p[1], q[0], q[1], 11, 11, 'ax', 5); }));
        pos.forEach((col, l) => col.forEach(([x, y], i) => { s += drop[l][i] ? FK.C(x, y, 11, 'dm ds') : FK.C(x, y, 11, 'nd'); }));
        return s;
      };
      const full = [[0, 0, 0], [0, 0, 0, 0], [0, 0, 0]];
      let s = draw(10, full) + draw(200, [[0, 1, 0], [1, 0, 0, 1], [0, 0, 0]]) + draw(390, [[1, 0, 0], [0, 1, 1, 0], [0, 0, 0]]);
      s += T(60, 200, '전체 망', { c: 'em' }) + T(250, 200, '부분망 1', { c: 'em' }) + T(440, 200, '부분망 2', { c: 'em' });
      return FK.fig(560, 212, '드롭아웃', s,
        R`학습 때 예제마다 입력·은닉 노드를 무작위로 지웁니다(점선 원, 출력 노드는 지우지 않음). 비출력 노드가 $M$개이면 부분망이 $2^M$개이고 모두 가중치를 공유합니다. 추론 때는 전체 망을 쓰고, 확률 $\rho$로 남던 노드의 나가는 가중치에 $\rho$를 곱해 입력의 기댓값을 맞춥니다.`);
    },
  });
})();
