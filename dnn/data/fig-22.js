/* 22 선형 어텐션과 비전 트랜스포머 — 본문 그림 (10주차 수요일 필기·슬라이드 13–27, 11주차 월요일 필기를 새로 그림) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const box = (x, y, w, h, t, sub, hl) => FK.R(x, y, w, h, hl ? 'bm2' : 'bm') + FK.T(x + w / 2, y + (sub ? h / 2 - 1 : h / 2 + 4), t, { s: 11, c: 'em' }) + (sub ? FK.T(x + w / 2, y + h / 2 + 12, sub, { s: 10 }) : '');
  const cell = (x, y, w, v) => `<rect x="${x}" y="${y}" width="${w}" height="${w}" style="fill:var(--denim);fill-opacity:${v.toFixed(2)};stroke:var(--ink-3);stroke-width:.5"/>`;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 22.2 softmax attention builds the N×N matrix; linear attention builds S and Z once (W10 Wed notes on slide 12)
    linattn() {
      let s = FK.T(20, 20, '소프트맥스 어텐션', { a: 'start', s: 11, c: 'em' });
      s += FK.R(20, 32, 24, 72, 'bm') + FK.T(32, 72, 'Q', { c: 'em' }) + FK.T(32, 118, 'N×d', { s: 10 })
        + FK.T(56, 72, '×', { s: 14 })
        + FK.R(68, 56, 72, 24, 'bm') + FK.T(104, 72, 'Kᵀ', { c: 'em' }) + FK.T(104, 94, 'd×N', { s: 10 })
        + FK.A(146, 68, 176, 68, 'ld', 7)
        + FK.R(182, 32, 72, 72, 'bm2') + FK.T(218, 72, 'A', { c: 'em' }) + FK.T(218, 118, 'N×N', { s: 10 })
        + FK.T(266, 72, '×', { s: 14 })
        + FK.R(278, 32, 24, 72, 'bm') + FK.T(290, 72, 'V', { c: 'em' }) + FK.T(290, 118, 'N×d_v', { s: 10 })
        + FK.T(314, 72, '=', { s: 14 })
        + FK.R(326, 32, 24, 72, 'bm') + FK.T(338, 72, 'V̂', { c: 'em' })
        + FK.T(368, 62, 'N×N 행렬을 통째로 만든다', { a: 'start', s: 10 }) + FK.T(368, 80, '시간·메모리 O(N²)', { a: 'start', s: 10, c: 'rl' });
      s += FK.T(20, 148, '선형 어텐션', { a: 'start', s: 11, c: 'em' });
      s += FK.R(20, 172, 72, 24, 'bm') + FK.T(56, 188, 'φ(K)ᵀ', { s: 11, c: 'em' }) + FK.T(56, 212, 'r×N', { s: 10 })
        + FK.T(104, 188, '×', { s: 14 })
        + FK.R(116, 160, 24, 72, 'bm') + FK.T(128, 200, 'V', { c: 'em' }) + FK.T(128, 246, 'N×d_v', { s: 10 })
        + FK.T(152, 188, '=', { s: 14 })
        + FK.R(164, 172, 24, 24, 'bm2') + FK.T(176, 188, 'S', { c: 'em' }) + FK.T(176, 212, 'r×d_v', { s: 10 })
        + FK.R(204, 172, 10, 24, 'bm2') + FK.T(209, 212, 'Z', { c: 'em' })
        + FK.A(222, 184, 250, 184, 'ld', 7)
        + box(256, 166, 150, 36, 'Sᵀφ(q_i) / φ(q_i)ᵀZ', '', true)
        + FK.T(326, 220, '질의마다', { a: 'end', s: 10 }) + FK.T(332, 220, 'O(r d_v)', { a: 'start', s: 10 })
        + FK.T(420, 178, 'S와 Z는 한 번만 만든다', { a: 'start', s: 10 }) + FK.T(420, 196, '시간·메모리 O(N)', { a: 'start', s: 10, c: 'lb' });
      return FK.fig(560, 256, '소프트맥스 어텐션과 선형 어텐션의 계산 순서', s,
        R`계산 순서의 차이(10주차 수요일 필기). 위: 소프트맥스 어텐션은 $QK^T$를 행마다 정규화한 $N\times N$ 행렬 $A$를 먼저 만들고 $V$를 곱하므로 시간과 메모리가 $N^2$에 비례합니다. 아래: 유사도를 $\phi(\mathbf q)^T\phi(\mathbf k)$로 바꾸면 결합법칙으로 $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T\in\mathbb R^{r\times d_v}$와 $Z=\sum_j\phi(\mathbf k_j)\in\mathbb R^r$를 한 번만 만들고, 질의마다 $S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$로 출력을 얻습니다. $N\times N$ 행렬이 생기지 않습니다.`);
    },
    // 22.3 which entries share one mean and variance (W10 Wed notes on slide 13), B = 2, C = 2, H = 1, W = 2
    normgroups() {
      const val = [[[1, 3], [5, 7]], [[9, 11], [13, 15]]]; // [sample][channel][position]
      const sets = [
        (b, c) => c === 0,
        (b) => b === 0,
        (b, c, p) => b === 0 && p === 0,
      ];
      const heads = [['BN', '채널 하나 · 모든 샘플과 위치'], ['LN (CNN)', '샘플 하나 · 모든 채널과 위치'], ['LN (트랜스포머)', '토큰 하나 · 모든 특징']];
      const stats = [['μ = 6, σ² = 17', '1 → (1−6)/√17'], ['μ = 4, σ² = 5', '1 → (1−4)/√5'], ['μ = 3, σ² = 4', '(1, 5) → (−1, 1)']];
      let s = '';
      heads.forEach(([t, sub], k) => {
        const ox = 12 + k * 184, cx = ox + 84;
        s += FK.T(cx, 18, t, { s: 11, c: 'em' }) + FK.T(cx, 34, sub, { s: 10 });
        [0, 1].forEach((b) => {
          const y0 = 52 + b * 70;
          s += FK.T(ox + 28, y0 + 31, b ? 'x⁽²⁾' : 'x⁽¹⁾', { s: 11, c: 'it' });
          [0, 1].forEach((c) => [0, 1].forEach((p) => {
            const x = ox + 56 + p * 30, y = y0 + c * 30, on = sets[k](b, c, p);
            s += cell(x, y, 30, on ? 0.34 : 0.04) + FK.T(x + 15, y + 19, String(val[b][c][p]), { s: 11, c: on ? 'em' : '' });
          }));
          s += FK.T(ox + 124, y0 + 19, 'c1', { a: 'start', s: 10 }) + FK.T(ox + 124, y0 + 49, 'c2', { a: 'start', s: 10 });
        });
        s += FK.T(cx, 212, stats[k][0], { s: 10, c: 'lb' }) + FK.T(cx, 228, stats[k][1], { s: 10 });
      });
      s += FK.T(280, 250, '칸의 가로 = 공간 위치 2개, 세로 = 채널 2개. 색칠한 칸이 같은 평균·분산을 쓴다', { s: 10 });
      return FK.fig(560, 258, '세 가지 정규화가 묶는 칸', s,
        R`필기의 예($B=2$, $C=2$, $H=1$, $W=2$)에서 같은 평균과 분산을 쓰는 칸을 색칠했습니다. BN은 채널 1을 두 샘플과 두 위치에서 모아 $\{1,3,9,11\}$, CNN의 LN은 샘플 1의 모든 칸 $\{1,3,5,7\}$, 트랜스포머의 LN은 토큰(위치) 하나의 특징 $\{1,5\}$를 씁니다. 아래 줄은 그 묶음의 평균과 분산, 값 $1$(또는 토큰 $(1,5)$)이 정규화된 결과입니다($\varepsilon=0$, $\gamma=1$, $\beta=0$).`);
    },
    // 22.4 the ViT pipeline, eqs. (1)–(4) of slide 22
    vitpipe() {
      let s = '';
      s += FK.R(20, 150, 84, 84, 'bm') + FK.P('M48,150V234M76,150V234M20,178H104M20,206H104', 'dm') + FK.T(62, 252, '이미지를 P×P 패치로', { s: 10 });
      s += FK.A(108, 192, 140, 192, 'ld', 7) + box(146, 174, 64, 36, 'E', '선형 사상');
      s += FK.A(214, 192, 236, 192, 'ld', 7);
      const tok = ['cls', '1', '2', '3', '…', 'N'];
      tok.forEach((t, i) => {
        const x = 242 + i * 40;
        s += FK.R(x, 180, 32, 26, i ? 'bm' : 'bm2') + FK.T(x + 16, 197, t, { s: i ? 11 : 10, c: 'em' }) + FK.A(x + 16, 178, x + 16, 152, 'ax', 6);
      });
      s += FK.T(360, 226, '+ E_pos', { s: 10, c: 'it' }) + FK.T(360, 242, '위치 임베딩을 더한 N+1개 토큰', { s: 10 });
      s += FK.R(236, 64, 244, 84, 'bm') + FK.T(358, 82, '트랜스포머 인코더 × L', { s: 11, c: 'em' })
        + FK.T(358, 106, "z'_ℓ = MSA(LN(z_ℓ−1)) + z_ℓ−1", { s: 10, c: 'it' }) + FK.T(358, 128, "z_ℓ = MLP(LN(z'_ℓ)) + z'_ℓ", { s: 10, c: 'it' });
      s += FK.A(258, 64, 258, 44, 'ax', 6) + box(232, 14, 52, 28, 'LN') + FK.A(284, 28, 306, 28, 'ld', 7) + box(310, 14, 84, 28, 'MLP 헤드')
        + FK.A(394, 28, 416, 28, 'ld', 7) + FK.T(422, 32, '클래스', { a: 'start', s: 11, c: 'em' })
        + FK.T(150, 30, '클래스 토큰의 출력만', { s: 10 }) + FK.T(150, 46, 'y = LN(z⁰_L)', { s: 10, c: 'it' });
      return FK.fig(560, 262, '비전 트랜스포머의 흐름', s,
        R`ViT의 흐름(슬라이드 15–22의 식 (1)–(4)를 다시 그림). 이미지를 $P\times P$ 패치 $N$개로 잘라 펼치고 선형 사상 $E$로 $D$차원 토큰을 만든 뒤, 맨 앞에 학습되는 클래스 토큰(cls)을 붙이고 위치 임베딩 $E_{pos}$를 더합니다(식 1). 인코더 블록 $L$개는 각 하위 층 앞에 LN, 뒤에 잔차를 둡니다(식 2–3). 마지막 층의 클래스 토큰 출력 $\mathbf z_L^0$에 LN을 한 $\mathbf y$(식 4)만 MLP 헤드로 보내 분류합니다.`);
    },
    // 22.5 GELU against ReLU (slide 23), with the minimum near x = −0.75
    gelu() {
      const Phi = (x) => { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; };
      return FK.G({ w: 560, h: 250, x: [-3, 3], y: [-0.5, 3], m: [14, 20, 26, 40], label: 'GELU와 ReLU',
        xt: [[-2, '−2'], [-1, '−1'], [1, '1'], [2, '2']], yt: [[1, '1'], [2, '2']],
        c: [
          { f: (x) => Math.max(0, x), c: 'vl ds' },
          { f: (x) => x * Phi(x), c: 'ld' },
        ],
        extra: (X, Y) => FK.dot(X, Y, -0.752, -0.170) + FK.dot(X, Y, 1, 0.841, true),
        t: [[2.05, 2.62, 'ReLU', { a: 'end' }], [2.2, 1.75, 'GELU = xΦ(x)', { a: 'start', c: 'lb' }],
          [-0.75, -0.38, '최솟값 ≈ −0.17 (x ≈ −0.75)', { a: 'middle', s: 10 }], [1.1, 0.62, '(1, 0.841)', { a: 'start', s: 10 }]],
        cap: R`GELU $x\Phi(x)$(실선)와 ReLU(점선). $\Phi$는 표준 정규분포의 누적분포함수입니다. 큰 양수에서는 $\Phi\approx1$이라 $x$와 같고, 큰 음수에서는 $\Phi\approx0$이라 $0$으로 갑니다. ReLU와 달리 모든 점에서 미분 가능하고, 음수 쪽에 최솟값 약 $-0.17$($x\approx-0.75$)의 작은 골이 있습니다(필기가 동그라미 친 부분).` });
    },
    // 22.7 global versus windowed self-attention on an 8×8 token grid with M = 4 (slide 27, W11 Mon notes)
    wmsa() {
      const n = 8, c = 17, M = 4, qi = 2, qj = 5;
      let s = '';
      [0, 1].forEach((k) => {
        const ox = 56 + k * 272, oy = 44;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const same = Math.floor(i / M) === Math.floor(qi / M) && Math.floor(j / M) === Math.floor(qj / M);
          const v = i === qi && j === qj ? 0.85 : k === 0 || same ? 0.3 : 0.03;
          s += cell(ox + j * c, oy + i * c, c, v);
        }
        if (k === 1) s += FK.P(`M${ox + M * c},${oy}V${oy + n * c}M${ox},${oy + M * c}H${ox + n * c}M${ox},${oy}H${ox + n * c}V${oy + n * c}H${ox}Z`, 'vl');
        s += FK.T(ox + (qj + 0.5) * c, oy + (qi + 0.5) * c + 4, 'q', { s: 10, c: 'em' });
      });
      s += FK.T(124, 26, '전역 어텐션: 모든 토큰과', { s: 11, c: 'em' }) + FK.T(396, 26, '윈도우 어텐션: 같은 창 안에서만', { s: 11, c: 'em' })
        + FK.T(124, 202, '쌍의 수 N² = 4096', { s: 10 }) + FK.T(396, 202, '쌍의 수 (N/M²)·M⁴ = NM² = 1024', { s: 10 })
        + FK.T(124, 220, '2N²C', { s: 10, c: 'rl' }) + FK.T(396, 220, '2NM²C', { s: 10, c: 'lb' });
      return FK.fig(560, 232, '전역 어텐션과 윈도우 어텐션', s,
        R`토큰 $N=8\times8=64$개, 창 $M\times M=4\times4$로 그린 도식입니다. 왼쪽: 전역 셀프 어텐션에서는 질의 q가 $N$개 토큰 모두와 점수를 계산하므로 쌍이 $N^2$개입니다. 오른쪽: 윈도우 어텐션(Swin의 W-MSA)은 굵은 선으로 나눈 창 안의 $M^2$개 토큰끼리만 어텐션하므로 창 $N/M^2$개 각각에서 $(M^2)^2$쌍, 모두 $NM^2$쌍입니다. 강의의 $56\times56$, $M=7$에서는 창이 $64$개이고 쌍의 수가 $64$배 줄어듭니다.`);
    },
  });
})();
