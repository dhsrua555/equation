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
