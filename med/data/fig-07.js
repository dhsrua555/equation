/* 07 심층 신경망 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const { G, G2, legend } = FK;
  const sg = (a) => 1 / (1 + Math.exp(-a));

  // tiny 1–3–1 tanh network fitted by Adam at first use (seeded, so the picture never changes)
  const fitCache = {};
  function fit1d(key, target) {
    if (fitCache[key]) return fitCache[key];
    const N = 50, xs = Array.from({ length: N }, (_, n) => -1 + (2 * n + 1) / N), ts = xs.map(target);
    let best = null;
    for (let seed = 1; seed <= 6; seed++) {
      const r = MF.rng(seed * 97 + key.length);
      // p = [w1,w2,w3, b1,b2,b3, v1,v2,v3, c]
      const p = [0, 1, 2].map(() => 2.5 * MF.normal(r)).concat([0, 1, 2].map(() => MF.normal(r)), [0, 1, 2].map(() => 0.5 * MF.normal(r)), [0]);
      const m = p.map(() => 0), v = p.map(() => 0);
      const lr = 0.03, b1 = 0.9, b2 = 0.999;
      let loss = 0;
      for (let it = 1; it <= 4000; it++) {
        const g = p.map(() => 0); loss = 0;
        xs.forEach((x, n) => {
          const z = [0, 1, 2].map((j) => Math.tanh(p[j] * x + p[3 + j]));
          const y = p[9] + z.reduce((s, zj, j) => s + p[6 + j] * zj, 0);
          const e = y - ts[n]; loss += e * e / N;
          const d = (2 * e) / N;
          g[9] += d;
          for (let j = 0; j < 3; j++) {
            g[6 + j] += d * z[j];
            const dz = d * p[6 + j] * (1 - z[j] * z[j]);
            g[j] += dz * x; g[3 + j] += dz;
          }
        });
        for (let i = 0; i < p.length; i++) {
          m[i] = b1 * m[i] + (1 - b1) * g[i]; v[i] = b2 * v[i] + (1 - b2) * g[i] * g[i];
          p[i] -= (lr * (m[i] / (1 - b1 ** it))) / (Math.sqrt(v[i] / (1 - b2 ** it)) + 1e-8);
        }
      }
      if (!best || loss < best.loss) best = { loss, p: p.slice() };
    }
    const p = best.p;
    return (fitCache[key] = {
      xs, ts, loss: best.loss,
      y: (x) => p[9] + [0, 1, 2].reduce((s, j) => s + p[6 + j] * Math.tanh(p[j] * x + p[3 + j]), 0),
      part: (j) => (x) => Math.tanh(p[j] * x + p[3 + j]),
    });
  }

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 6.2 two-layer network diagram (Bishop Fig. 6.9)
    mlp2() {
      const X0 = 80, X1 = 285, X2 = 490;
      const inp = [[X0, 60, 'x_D'], [X0, 150, 'x_1']], hid = [[X1, 60, 'z_M'], [X1, 150, 'z_1']], out = [[X2, 80, 'y_K'], [X2, 170, 'y_1']];
      const b0 = [X0, 222], z0 = [X1, 222];
      let s = '';
      [...inp, b0].forEach(([x, y]) => hid.forEach(([u, v]) => { s += MF.link(x, y, u, v, 17, 17); }));
      [...hid, z0].forEach(([x, y]) => out.forEach(([u, v]) => { s += MF.link(x, y, u, v, 17, 17); }));
      [...inp, ...hid, ...out].forEach(([x, y, l]) => { s += MF.nd(x, y, '', 17) + FK.T(x, y + 5, l, { c: 'em' }); });
      s += FK.C(b0[0], b0[1], 12, 'ldh') + FK.C(z0[0], z0[1], 12, 'ldh');
      s += FK.T(b0[0] - 26, b0[1] + 5, 'x_0 = 1', { a: 'end' }) + FK.T(z0[0] + 20, z0[1] + 20, 'z_0 = 1', { a: 'start' });
      [[X0, 108], [X1, 108], [X2, 128]].forEach(([x, y]) => { s += FK.T(x, y, '⋮', { c: 'em' }); });
      s += FK.T(X0, 26, '입력', { c: 'em' }) + FK.T(X1, 26, '은닉 유닛', { c: 'em' }) + FK.T(X2, 26, '출력', { c: 'em' });
      s += FK.T(180, 48, 'w⁽¹⁾_{MD}', { c: 'lb' }) + FK.T(150, 236, 'w⁽¹⁾_{10}', { c: 'lb' }) + FK.T(392, 58, 'w⁽²⁾_{KM}', { c: 'rl' }) + FK.T(410, 226, 'w⁽²⁾_{10}', { c: 'rl' });
      return FK.fig(560, 250, '2층 신경망의 구조', s,
        R`화살표는 순전파의 방향입니다. 채운 점 $x_0=1$, $z_0=1$에서 나가는 가중치가 편향 $w_{j0}^{(1)}$, $w_{k0}^{(2)}$입니다. 입력 쪽 가중치 층 $\mathbf W^{(1)}$과 출력 쪽 가중치 층 $\mathbf W^{(2)}$ 두 개가 있으므로 2층 신경망입니다.`);
    },
    // 6.2.2 universal approximation with three tanh hidden units (Bishop Fig. 6.10)
    univapprox() {
      const cases = [
        ['sq', (x) => x * x, 'f(x) = x²', [-1.25, 1.25]],
        ['sin', (x) => Math.sin(Math.PI * x), 'f(x) = sin πx', [-1.25, 1.25]],
        ['abs', (x) => Math.abs(x), 'f(x) = |x|', [-1.25, 1.25]],
        ['step', (x) => (x < 0 ? 0 : 1), 'f(x) = H(x) (계단)', [-1.25, 1.25]],
      ];
      const ps = cases.map(([key, f, title, yr], i) => {
        const F = fit1d(key, f);
        return {
          w: 280, h: 190, ox: (i % 2) * 280, oy: Math.floor(i / 2) * 190, x: [-1, 1], y: yr, m: [22, 10, 20, 26], title,
          xt: [[-1, '−1'], [0, '0'], [1, '1']], yt: [],
          c: [0, 1, 2].map((j) => ({ f: F.part(j), c: 'dm ds' })).concat([{ f: F.y, c: 'ld' }]),
          inner: (X, Y) => MF.dots(X, Y, F.xs.filter((_, k) => k % 2 === 0).map((x) => [x, f(x)])),
        };
      });
      return G2(560, 380, '은닉 유닛 세 개로 네 함수를 근사', ps,
        R`$(-1,1)$에서 고르게 뽑은 50개 점(그림에는 절반만 표시)에 tanh 은닉 유닛 3개와 선형 출력을 가진 2층망을 제곱오차로 학습했습니다. 굵은 선이 망의 출력, 점선 세 개가 은닉 유닛의 출력 $z_j=\tanh(a_j)$입니다. 망은 이 셋에 가중치 $w_{kj}^{(2)}$를 곱해 더하고 편향을 더합니다. 매끄러운 함수는 거의 완벽히, 꺾인 점과 계단은 둥글게 근사합니다.`);
    },
    // 6.2.3 hidden-unit activation functions (Bishop Fig. 6.12)
    acts() {
      const al = 0.1;
      const fs = [
        ['tanh', Math.tanh], ['hard tanh', (a) => Math.max(-1, Math.min(1, a))], ['softplus', (a) => Math.log(1 + Math.exp(a))],
        ['ReLU', (a) => Math.max(0, a)], ['leaky ReLU (α = 0.1)', (a) => Math.max(0, a) + al * Math.min(0, a)], ['절댓값 |a|', Math.abs],
      ];
      const ps = fs.map(([t, f], i) => ({
        w: 186, h: 170, ox: (i % 3) * 186, oy: Math.floor(i / 3) * 170, x: [-3, 3], y: [-2.6, 3], m: [22, 8, 18, 22], title: t,
        xt: [[-2.5, '−2.5'], [2.5, '2.5']], yt: [[2.5, '2.5'], [-2.5, '−2.5']], hg: [], c: [{ f, c: 'ld' }],
      }));
      return G2(558, 340, '여러 가지 활성화 함수', ps,
        R`윗줄은 포화하는 함수(tanh, hard tanh)와 매끄러운 ReLU(softplus), 아랫줄은 ReLU 계열입니다. tanh와 hard tanh는 입력이 크면 평평해져 기울기가 0이 되고, ReLU 계열은 $a\gt0$에서 기울기 1을 유지합니다. leaky ReLU와 절댓값 함수는 $a\lt0$에서도 기울기가 0이 아닙니다.`);
    },
    // derivatives of the activations: vanishing gradients of the sigmoidal ones
    actderiv() {
      return G({ w: 560, h: 230, x: [-6, 6], y: [-0.08, 1.12], xl: 'a', label: '활성화 함수의 도함수', m: [12, 14, 22, 30],
        xt: [[-5, '−5'], [-2.5, '−2.5'], [0, '0'], [2.5, '2.5'], [5, '5']], yt: [[0.25, '0.25'], [1, '1']], hg: [0.25, 1],
        c: [{ f: (a) => sg(a) * (1 - sg(a)), c: 'ld' }, { f: (a) => 1 - Math.tanh(a) ** 2, c: 'rx' }, { pts: [[-6, 0], [0, 0], null, [0, 1], [6, 1]], c: 'vl ds' }],
        extra: (X, Y) => legend(X(-5.8), Y(0.95), [['ld', 'σ′(a) = σ(1 − σ), 최대 1/4'], ['rx', 'tanh′(a) = 1 − tanh²a, 최대 1'], ['vl ds', 'ReLU′(a): 0 또는 1']]),
        cap: R`시그모이드와 tanh의 도함수는 $\lvert a\rvert$가 커지면 지수적으로 0에 가까워집니다($\sigma'(5)\approx0.0066$). 층마다 이런 인수가 곱해지면 앞쪽 층의 기울기가 사라집니다. ReLU의 도함수는 양수 쪽에서 계속 1입니다.` });
    },
    // 6.3 depth multiplies linear pieces: the tent map composed with itself
    sawtooth() {
      const tent = (x) => (x < 0.5 ? 2 * x : 2 - 2 * x);
      const comp = (L) => (x) => { let v = x; for (let k = 0; k < L; k++) v = tent(v); return v; };
      const pts = (L) => Array.from({ length: 2 ** L + 1 }, (_, k) => [k / 2 ** L, comp(L)(k / 2 ** L)]);
      const ps = [1, 2, 3].map((L, i) => ({
        w: 186, h: 170, ox: i * 186, x: [0, 1], y: [-0.05, 1.12], m: [24, 10, 20, 22], title: `${L}층 (ReLU ${2 * L}개): 조각 ${2 ** L}개`,
        xt: [[0, '0'], [0.5, '½'], [1, '1']], yt: [[1, '1']], c: [{ pts: pts(L), c: 'ld' }],
        inner: (X, Y) => MF.dots(X, Y, pts(L).filter((_, k) => k > 0 && k < 2 ** L), true),
      }));
      return G2(558, 170, '깊이에 따라 늘어나는 선형 조각', ps,
        R`$g(x)=2\,\ReLU(x)-4\,\ReLU(x-\tfrac12)$는 $[0,1]$을 한 번 접는 삼각형 함수입니다. 층마다 $g$를 한 번 더 합성하면 조각 수가 $2,4,8,\dots,2^L$으로 두 배씩 늘어납니다(빈 점이 꺾인 점). 같은 톱니를 은닉층 하나로 만들려면 은닉 유닛이 $2^L-1$개 필요합니다.`);
    },
    // 6.3.2 distributed representation: 3 units, 8 combinations
    distrep() {
      const names = ['안경', '모자', '수염'];
      let s = FK.T(66, 30, '은닉 유닛', { c: 'em' }) + FK.T(330, 30, '가능한 얼굴 8가지 = 켜짐/꺼짐의 조합', { c: 'em' });
      names.forEach((n, r) => { s += FK.T(66, 72 + r * 40, n, { c: 'em' }); });
      for (let c = 0; c < 8; c++) {
        const x = 150 + c * 50;
        s += FK.T(x, 190, `#${c + 1}`);
        names.forEach((_, r) => {
          const on = (c >> (2 - r)) & 1;
          s += FK.C(x, 67 + r * 40, 11, on ? 'ldh' : 'sp');
        });
      }
      s += FK.L(120, 45, 120, 175, 'dm');
      return FK.fig(560, 205, '분산 표현', s,
        R`세 유닛이 각각 한 속성(안경·모자·수염)의 유무를 나타내면 채운 점(켜짐)과 빈 점(꺼짐)의 조합으로 $2^3=8$가지 얼굴을 나타냅니다. 조합마다 유닛을 하나씩 두면(한 유닛 = 한 특징) 8개가 필요합니다. 유닛 $M$개로 최대 $2^M$가지를 나타내는 것이 분산 표현의 지수적 용량입니다.`);
    },
    // 6.3.3 autoencoder with a bottleneck
    autoenc() {
      const L0 = [45, 85, 125, 165, 205], L1 = [105, 145];
      let s = '';
      L0.forEach((y) => L1.forEach((v) => { s += MF.link(90, y, 280, v, 13, 14); }));
      L1.forEach((y) => L0.forEach((v) => { s += MF.link(280, y, 470, v, 14, 13); }));
      L0.forEach((y, i) => { s += MF.nd(90, y, '', 13) + FK.T(90, y + 4, `x_${i + 1}`, { s: 11 }); });
      L1.forEach((y, i) => { s += MF.nd(280, y, '', 14) + FK.T(280, y + 4, `z_${i + 1}`, { s: 11 }); });
      L0.forEach((y, i) => { s += MF.nd(470, y, '', 13) + FK.T(470, y + 4, `x̂_${i + 1}`, { s: 11 }); });
      s += FK.T(90, 20, '입력 x', { c: 'em' }) + FK.T(280, 80, '병목(표현)', { c: 'lb' }) + FK.T(470, 20, '출력 x̂ ≈ x', { c: 'em' });
      s += FK.T(280, 236, '목표 = 입력 → 레이블이 필요 없음', { c: 'rl' });
      return FK.fig(560, 250, '오토인코더', s,
        R`입력 다섯 개를 은닉 유닛 두 개로 압축했다가 다시 펼쳐 입력을 복원하도록 학습합니다. 좁은 은닉층을 지나야 하므로 망은 자료의 핵심 구조를 담은 압축 표현을 배우고, 그 표현을 다른 과제(분류 등)에 씁니다.`);
    },
    // 6.3.4 transfer learning (Bishop Fig. 6.13)
    transfer() {
      const row = (y, img, outs, frozen) => {
        let s = MF.box(12, y + 8, 70, 44, img, 'sp');
        for (let k = 0; k < 5; k++) {
          const x = 110 + k * 64, h = k < 3 ? 60 : 44, fresh = frozen && k >= 3;
          s += fresh ? FK.R(x, y + 30 - h / 2, 30, h, 'bm') + FK.R(x, y + 30 - h / 2, 30, h, 'rx') : FK.R(x, y + 30 - h / 2, 30, h, 'rg hl') + FK.R(x, y + 30 - h / 2, 30, h, 'sv');
          s += FK.A(x - 24, y + 30, x - 4, y + 30, 'ax', 6);
        }
        s += FK.A(110 + 4 * 64 + 34, y + 30, 110 + 4 * 64 + 58, y + 30, 'ax', 6);
        outs.forEach((o, i) => { s += FK.T(446, y + 18 + i * 16, o, { a: 'start' }); });
        return s;
      };
      let s = FK.T(12, 16, '(a) 자료가 많은 과제: 일상 사물 분류', { a: 'start', c: 'em' }) + row(22, '자연 영상', ['나무', '고양이', '개'], false);
      s += FK.T(12, 118, '(b) 자료가 적은 과제: 피부 병변 분류', { a: 'start', c: 'em' }) + row(124, '병변 영상', ['암', '정상'], true);
      s += FK.R(110, 212, 30, 14, 'rg hl') + FK.R(110, 212, 30, 14, 'sv') + FK.T(146, 223, '(a)의 자료로 학습한 층', { a: 'start' }) + FK.R(320, 212, 30, 14, 'bm') + FK.R(320, 212, 30, 14, 'rx') + FK.T(356, 223, '새로 학습하는 뒤쪽 층', { a: 'start' });
      return FK.fig(560, 235, '전이 학습', s,
        R`(a)에서 자연 영상으로 학습한 망의 앞쪽 층(일반적인 저수준 특징)을 (b)로 복사하고, 과제에 특화된 뒤쪽 층만 병변 자료로 다시 학습합니다. 자료가 더 많으면 더 많은 층을, 또는 작은 학습률로 전체를 미세조정합니다.`);
    },
    // 6.3.5 contrastive learning on the unit hypersphere (Bishop Fig. 6.14)
    contrast() {
      const cx = 150, cy = 125, r = 95;
      const at = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
      const A = at(62), P = at(40), N1 = at(160), N2 = at(250), N3 = at(-35);
      let s = FK.C(cx, cy, r, 'sv') + FK.C(cx, cy, 2, 'vlh');
      s += FK.A(P[0], P[1], A[0] + 6, A[1] + 8, 'ld', 8) + FK.A(A[0], A[1], P[0] - 2, P[1] - 9, 'ld', 8);
      [N1, N2, N3].forEach((N) => {
        const dx = N[0] - A[0], dy = N[1] - A[1], d = Math.hypot(dx, dy);
        s += FK.A(N[0], N[1], N[0] + (22 * dx) / d, N[1] + (22 * dy) / d, 'rx', 7);
      });
      s += FK.C(A[0], A[1], 6, 'vlh') + FK.C(P[0], P[1], 6, 'ldh') + [N1, N2, N3].map((N) => FK.C(N[0], N[1], 6, 'rxh')).join('');
      s += FK.T(A[0] - 8, A[1] - 12, 'f(x) 기준', { a: 'end', c: 'em' }) + FK.T(P[0] + 10, P[1] - 4, 'f(x⁺) 양성', { a: 'start', c: 'lb' });
      s += FK.T(N1[0] - 10, N1[1] - 8, 'f(x⁻)', { a: 'end', c: 'rl' }) + FK.T(N2[0] + 12, N2[1] + 14, 'f(x⁻)', { a: 'start', c: 'rl' }) + FK.T(N3[0] + 10, N3[1] + 14, 'f(x⁻)', { a: 'start', c: 'rl' });
      const tx = 300;
      s += FK.T(tx, 40, '양성 쌍을 만드는 법', { a: 'start', c: 'em' });
      s += FK.T(tx, 64, '• 인스턴스 판별: 같은 영상 + 증강', { a: 'start' });
      s += FK.T(tx, 86, '  (회전, 평행이동, 색 변화)', { a: 'start' });
      s += FK.T(tx, 110, '• 지도 대조 학습: 같은 클래스의', { a: 'start' });
      s += FK.T(tx, 132, '  다른 영상', { a: 'start' });
      s += FK.T(tx, 156, '• CLIP: 영상과 그 캡션', { a: 'start' });
      s += FK.T(tx, 190, '음성 쌍: 짝이 아닌 나머지', { a: 'start', c: 'em' });
      return FK.fig(560, 240, '대조 학습의 임베딩', s,
        R`표현을 $\lVert\mathbf f_{\mathbf w}(\mathbf x)\rVert=1$로 정규화하면 모든 점이 단위 (초)구 위에 놓이고 내적이 코사인 유사도가 됩니다. InfoNCE 손실은 기준과 양성 예를 서로 끌어당기고(가운데 두 화살표), 음성 예를 기준에서 밀어냅니다(바깥 화살표).`);
    },
    // 6.3.6 general feed-forward topology (Bishop Fig. 6.15)
    dag() {
      const P = { x1: [70, 60], x2: [70, 190], z1: [210, 125], z2: [350, 60], z3: [350, 190], y1: [490, 60], y2: [490, 190] };
      const E = [['x1', 'z1'], ['x2', 'z1'], ['x1', 'z2'], ['z1', 'z2'], ['z1', 'z3'], ['z2', 'y1'], ['z2', 'y2'], ['z3', 'y2']];
      let s = E.map(([a, b]) => MF.link(P[a][0], P[a][1], P[b][0], P[b][1], 18, 18)).join('');
      s += FK.P(`M${P.x2[0] + 14},${P.x2[1] + 12} Q280,262 ${P.y2[0] - 14},${P.y2[1] + 12}`, 'ax') + FK.A(P.y2[0] - 40, P.y2[1] + 26, P.y2[0] - 15, P.y2[1] + 13, 'ax', 6);
      Object.entries(P).forEach(([k, [x, y]]) => { s += MF.nd(x, y, k.replace(/(\d)/, '_$1'), 18); });
      s += FK.T(70, 22, '입력', { c: 'em' }) + FK.T(490, 22, '출력', { c: 'em' });
      return FK.fig(560, 250, '일반적인 피드포워드 망', s,
        R`층 구분이 없어도 닫힌 순환만 없으면 됩니다. 각 유닛은 조상 $\mathcal A(k)$에서 오는 값으로 $z_k=h\big(\sum_{j\in\mathcal A(k)}w_{kj}z_j+b_k\big)$를 계산합니다. 예: $\mathcal A(z_2)=\{x_1,z_1\}$, $\mathcal A(y_2)=\{z_2,z_3,x_2\}$ (아래의 곡선은 층을 건너뛰는 연결).`);
    },
    // 6.4.1 / 2.3.4 Gaussian conditional distribution around the network output
    regprob() {
      const y = (x) => 0.2 + 0.9 * x + 0.35 * Math.sin(2.4 * x);
      const r = MF.rng(11), pts = Array.from({ length: 22 }, (_, k) => { const x = 0.1 + (2.8 * k) / 21; return [x, y(x) + 0.28 * MF.normal(r)]; });
      const x0 = 1.9, s = 0.28, sc = 0.55;
      const dens = (t) => Math.exp(-((t - y(x0)) ** 2) / (2 * s * s));
      return G({ w: 560, h: 260, x: [0, 3.1], y: [-0.4, 3.4], xl: 'x', yl: 't', label: '목표값의 조건부 가우시안 분포', m: [12, 16, 22, 62],
        xt: [[x0, 'x₀']], yt: [[y(x0), 'y(x₀,w)']], vg: [x0],
        c: [{ f: y, c: 'ld' }],
        inner: (X, Y) => MF.dots(X, Y, pts),
        extra: (X, Y) => {
          let d = '';
          for (let k = 0; k <= 80; k++) { const t = y(x0) - 3.2 * s + (6.4 * s * k) / 80; d += `${k ? 'L' : 'M'}${FK.f1(X(x0 + sc * dens(t)))},${FK.f1(Y(t))}`; }
          return FK.P(d, 'rx') + FK.dimv(X(x0 + 0.62), Y(y(x0) + s), Y(y(x0) - s), '2σ', { c: 'rl' }) + FK.T(X(x0 + sc) + 6, Y(y(x0) + 0.9), 'p(t|x₀, w)', { a: 'start', c: 'rl' }) + FK.T(X(2.95), Y(y(2.95)) - 10, 'y(x, w)', { a: 'end', c: 'lb' });
        },
        cap: R`목표값 $t$는 망의 출력 $y(x,\mathbf w)$를 평균으로, $\sigma^2$을 분산으로 하는 가우시안을 따른다고 가정합니다. $x_0$에서 옆으로 그린 곡선이 $p(t\mid x_0,\mathbf w)=\N(t\mid y(x_0,\mathbf w),\sigma^2)$이고, 폭 $2\sigma$ 안에 자료점 대부분이 놓입니다. 이 가정의 음의 로그가능도가 제곱오차합입니다.` });
    },
    // 6.4.2 cross-entropy vs squared error for a sigmoid output, target t = 1
    celoss() {
      const ce = (a) => -Math.log(sg(a)), se = (a) => 0.5 * (sg(a) - 1) ** 2;
      return G2(560, 230, '시그모이드 출력의 두 오차함수', [
        { w: 280, h: 230, x: [-6, 4], y: [-0.2, 6.2], xl: 'a', title: '오차 E (t = 1)', m: [22, 10, 22, 26], xt: [[-5, '−5'], [0, '0']], yt: [[2, '2'], [4, '4']],
          c: [{ f: ce, c: 'ld' }, { f: se, c: 'rx' }],
          extra: (X, Y) => legend(X(-1.2), Y(5.6), [['ld', '교차 엔트로피'], ['rx', '제곱오차']]) },
        { w: 280, h: 230, ox: 280, x: [-6, 4], y: [-0.05, 1.08], xl: 'a', title: '|∂E/∂a| (t = 1)', m: [22, 10, 22, 26], xt: [[-5, '−5'], [0, '0']], yt: [[0.5, '0.5'], [1, '1']],
          c: [{ f: (a) => 1 - sg(a), c: 'ld' }, { f: (a) => (1 - sg(a)) * sg(a) * (1 - sg(a)), c: 'rx' }] },
      ], R`정답이 $t=1$인데 사전활성 $a$가 크게 음수이면(확신에 찬 오답) 교차 엔트로피는 크게 벌하고 기울기 $\lvert y-t\rvert\approx1$도 큽니다. 제곱오차는 오차가 $\frac12$ 이하로 묶이고, 기울기 $\lvert(y-t)y(1-y)\rvert$가 $\sigma'(a)$ 때문에 거의 0이라 학습이 멈춥니다.`);
    },
  });
})();
