/* 21 어텐션과 트랜스포머 — 본문 그림 (10주차 월요일 슬라이드 64–66, 63·68, 70, 72–77을 다시 그림) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const box = (x, y, w, h, t, sub, hl) => FK.R(x, y, w, h, hl ? 'bm2' : 'bm') + FK.T(x + w / 2, y + (sub ? h / 2 - 1 : h / 2 + 4), t, { s: 11, c: 'em' }) + (sub ? FK.T(x + w / 2, y + h / 2 + 12, sub, { s: 10 }) : '');
  const up = (x1, y1, x2, y2) => FK.A(x1, y1, x2, y2, 'ax', 7);
  const node = (x, y, t, r = 12) => FK.C(x, y, r, 'nd') + FK.T(x, y + 4, t, { c: 'em' });

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 21.4 the general attention layer (slides 64–65): alignment → softmax → mul + add
    attnflow() {
      const rows = [70, 115, 160];
      let s = FK.T(58, 56, '입력 벡터들', { s: 10 });
      s += FK.R(30, 16, 56, 28, 'bm2') + FK.T(58, 34, 'h', { c: 'em' }) + FK.T(100, 12, '질의 벡터', { a: 'start', s: 10 })
        + FK.P('M86,30 H125 V179', 'ld');
      s += FK.T(172, 34, '점수', { s: 10 }) + FK.T(222, 52, 'e_{i} = h·x_{i}/√D', { s: 10, c: 'it' });
      rows.forEach((y, i) => {
        const cy = y + 14;
        s += box(30, y, 56, 28, 'x_' + i) + FK.A(86, y + 9, 158, y + 9, 'ld', 6) + FK.A(125, y + 19, 159, y + 19, 'ld', 6)
          + node(172, cy, 'e_' + i, 14) + FK.A(186, cy, 224, cy, 'ld', 6)
          + FK.A(295, cy, 339, cy, 'ld', 6) + box(340, y, 44, 28, 'a_' + i) + FK.A(384, cy, 429, 115, 'ld', 6)
          + FK.P(`M30,${cy}H14`, 'dm ds');
      });
      s += box(225, 60, 70, 140, 'softmax') + FK.T(362, 56, '가중치 (합 1)', { s: 10 })
        + box(430, 100, 70, 30, 'mul + add', '', true) + FK.A(500, 115, 530, 115, 'ld', 7) + FK.T(536, 119, 'c', { a: 'start', c: 'it' })
        + FK.P('M14,84 V236 H465 V152', 'dm ds') + FK.A(465, 160, 465, 132, 'dm', 7)
        + FK.T(240, 228, '같은 입력을 가중 평균에 다시 쓴다', { s: 10 });
      return FK.fig(560, 250, '어텐션 층의 계산 흐름', s,
        R`일반 어텐션 층(슬라이드 64–65). 입력 벡터 $\mathbf x_i$마다 질의 $\mathbf h$와의 점수 $e_i=\mathbf h\cdot\mathbf x_i/\sqrt D$(정렬)를 구하고, 소프트맥스로 합이 $1$인 가중치 $a_i$로 바꾼 뒤, 같은 입력 $\mathbf x_i$를 $a_i$로 가중해 더한 것(mul + add)이 맥락 벡터 $\mathbf c$입니다(점선).`);
    },
    // 21.5 shapes of self-attention (slides 63, 68)
    attnshape() {
      let s = FK.T(280, 22, '입력 X에서 투영해 만든다', { s: 10 }) + FK.T(280, 40, 'Q = XW_{q},  K = XW_{k},  V = XW_{v}', { s: 11, c: 'it' });
      s += FK.R(30, 60, 44, 96, 'bm') + FK.T(52, 112, 'Q', { c: 'em' }) + FK.T(52, 174, 'N×D_{k}', { s: 10 })
        + FK.T(88, 112, '×', { s: 14 })
        + FK.R(104, 86, 96, 44, 'bm') + FK.T(152, 112, 'Kᵀ', { c: 'em' }) + FK.T(152, 146, 'D_{k}×N', { s: 10 })
        + FK.A(212, 108, 248, 108, 'ld', 7) + FK.T(230, 94, 'softmax', { s: 10 }) + FK.T(230, 126, '÷√D_{k}', { s: 10 })
        + FK.R(256, 60, 96, 96, 'bm') + FK.R(256, 96, 96, 14, 'bm2') + FK.T(304, 78, 'A', { c: 'em' }) + FK.T(304, 174, 'N×N', { s: 10 })
        + FK.T(368, 112, '×', { s: 14 })
        + FK.R(384, 60, 44, 96, 'bm') + FK.T(406, 112, 'V', { c: 'em' }) + FK.T(406, 174, 'N×D_{v}', { s: 10 })
        + FK.T(446, 112, '=', { s: 14 })
        + FK.R(462, 60, 44, 96, 'bm2') + FK.T(484, 112, 'Y', { c: 'em' }) + FK.T(484, 174, 'N×D_{v}', { s: 10 });
      s += FK.A(304, 196, 304, 114, 'ax', 6) + FK.T(304, 212, '행 하나 = 질의 하나의 가중치 (합 1)', { s: 10, c: 'lb' });
      return FK.fig(560, 224, '셀프 어텐션의 행렬 모양', s,
        R`셀프 어텐션의 모양(슬라이드 63·68). 입력 $X$에서 $Q,K,V$를 만들고, $QK^T/\sqrt{D_k}$의 행마다 소프트맥스한 $A\in\mathbb R^{N\times N}$으로 $V$를 섞어 $Y=AV$를 얻습니다. $A$의 한 행(색칠한 띠)이 질의 하나가 $N$개의 값에 주는 가중치이고 합이 $1$입니다. 출력의 행 수는 질의 수 $N$과 같습니다.`);
    },
    // 21.6 the causal mask (slide 70)
    maskmat() {
      const cell = (ox, oy, j, i, lo, t) => FK.R(ox + i * 30, oy + j * 30, 30, 30, lo ? 'bm2' : 'bm') + FK.T(ox + i * 30 + 15, oy + j * 30 + 19, t, { s: 10, c: lo ? 'em' : '' });
      let s = FK.T(115, 30, '점수 + 마스크', { s: 11, c: 'em' }) + FK.T(405, 30, '소프트맥스 뒤의 A', { s: 11, c: 'em' }) + FK.T(115, 48, 'i →', { s: 10, c: 'it' }) + FK.T(405, 48, 'i →', { s: 10, c: 'it' })
        + FK.T(24, 135, 'j ↓', { s: 10, c: 'it' });
      for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) {
        const lo = i <= j;
        s += cell(40, 56, j, i, lo, lo ? 'e' : '−∞') + cell(330, 56, j, i, lo, lo ? (j === 0 ? '1' : 'a') : '0');
      }
      s += FK.A(205, 131, 300, 131, 'ld', 8) + FK.T(252, 122, 'softmax', { s: 10 })
        + FK.T(115, 224, '미래 (i > j)의 점수는 −∞', { s: 10, c: 'rl' }) + FK.T(405, 224, '각 행의 합 = 1, 위쪽 삼각은 0', { s: 10 });
      return FK.fig(560, 240, '마스크 셀프 어텐션', s,
        R`마스크 셀프 어텐션(슬라이드 70). 행 $j$는 질의 $j$, 열 $i$는 키 $i$입니다. $i>j$인 미래 칸의 점수를 $-\infty$로 가리면(왼쪽) 소프트맥스 뒤에 그 칸의 가중치가 $e^{-\infty}=0$이 되어 $A$가 아래삼각행렬이 되고(오른쪽), 대각이 남으므로 각 행의 합은 $1$입니다. 첫 행은 자기 자신에게 가중치 $1$을 줍니다.`);
    },
    // 21.7 the encoder block (slides 72–77)
    encblock() {
      const X = 160, W = 180, cx = 250;
      let s = '';
      s += FK.P('M96,40 H404 V238 H96 Z', 'dm ds') + FK.T(412, 134, 'N×', { a: 'start', c: 'em' }) + FK.T(412, 152, '블록을 쌓는다', { a: 'start', s: 10 });
      s += box(X, 50, W, 26, 'Add & Norm') + box(X, 92, W, 36, 'Feed Forward', '', true) + box(X, 138, W, 26, 'Add & Norm')
        + box(X, 176, W, 42, 'Multi-Head Attention', '', true) + box(X, 292, W, 26, 'Input Embedding');
      s += FK.A(cx, 326, cx, 319, 'ax', 7) + FK.T(cx, 340, '입력 토큰 x (n×d)', { s: 11 })
        + FK.A(cx, 292, cx, 263, 'ax', 7) + node(cx, 250, '+', 11) + FK.T(175, 268, '위치 부호화', { s: 11 }) + FK.A(112, 250, 238, 250, 'ld', 7)
        + FK.A(cx, 239, cx, 219, 'ax', 7) + FK.A(cx, 176, cx, 165, 'ax', 7) + FK.A(cx, 138, cx, 129, 'ax', 7) + FK.A(cx, 92, cx, 77, 'ax', 7)
        + FK.A(cx, 50, cx, 20, 'ax', 8) + FK.T(cx, 12, 'h (n×d)', { s: 11, c: 'it' });
      // skip connections around the two sub-layers
      s += FK.P(`M${cx},228 H128 V151`, 'ld') + FK.A(128, 151, X - 2, 151, 'ld', 7)
        + FK.P(`M${cx},133 H112 V63`, 'ld') + FK.A(112, 63, X - 2, 63, 'ld', 7);
      return FK.fig(560, 350, '트랜스포머 인코더 블록', s,
        R`트랜스포머 인코더 블록(슬라이드 72–77). 입력 토큰을 임베딩하고 위치 부호화를 더한 뒤, 멀티헤드 어텐션에 스킵 연결을 더해 LayerNorm하고($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{Attn})$), 이어서 위치별 FF에 스킵 연결을 더해 LayerNorm합니다($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{FF})$). 점선 안의 블록은 입출력이 $n\times d$로 같아서 $N$번 쌓을 수 있습니다.`);
    },
    // 21.1 first-word conditioning vs shortcut (slides 36–41)
    capcond() {
      const cx = [214, 284, 354, 424];
      const panel = (y, short) => {
        let s = FK.T(10, y + 12, short ? '지름길: 매 칸의 입력에 이미지 특성 v를 더한다' : '첫 단어 방식: 이미지 특성 v는 첫 칸에만 들어간다', { a: 'start', s: 11, c: 'em' });
        s += box(8, y + 60, 44, 28, '이미지') + FK.A(52, y + 74, 74, y + 74, 'ld', 7) + box(76, y + 60, 40, 28, 'CNN') + FK.A(116, y + 74, 136, y + 74, 'ld', 7)
          + box(138, y + 60, 40, 28, 'v', '', true);
        const outs = short ? ['Man', 'in', '…', '⟨eos⟩'] : ['⟨sos⟩', 'Man', 'in', '⟨eos⟩'];
        const ins = short ? ['⟨sos⟩', 'Man', 'in', 'guitar'] : ['', '⟨sos⟩', 'Man', 'in'];
        cx.forEach((x, k) => {
          s += FK.R(x, y + 44, 56, 60, 'bm') + FK.T(x + 28, y + 78, 'LSTM', { s: 11, c: 'em' }) + FK.T(x + 28, y + 28, outs[k], { s: 10 }) + FK.A(x + 28, y + 44, x + 28, y + 33, 'ax', 6);
          if (k < 3) s += FK.A(x + 56, y + 74, cx[k + 1], y + 74, 'ld', 6);
          if (ins[k]) s += FK.T(x + (short ? 18 : 28), y + 132, ins[k], { s: 10 }) + FK.A(x + (short ? 18 : 28), y + 120, x + (short ? 18 : 28), y + 106, 'ax', 6);
        });
        s += FK.A(190, y + 74, cx[0], y + 74, 'ld', 6);
        if (short) {
          s += FK.P(`M158,${y + 90} V${y + 112} H${cx[3] + 40}`, 'rx');
          cx.forEach((x) => { s += FK.A(x + 40, y + 112, x + 40, y + 106, 'rx', 6); });
          s += FK.T(550, y + 12, 'v → 칸 t: 거리 1', { a: 'end', s: 10, c: 'lb' });
        } else {
          s += FK.T(550, y + 12, 'v → 칸 t: t걸음', { a: 'end', s: 10, c: 'rl' });
        }
        return s;
      };
      const s = panel(0, false) + panel(160, true) + FK.P('M8,156 H552', 'dm ds');
      return FK.fig(560, 316, '이미지 조건화: 첫 단어와 지름길', s,
        R`이미지 조건화의 두 방식(슬라이드 36–41). 위: 이미지 특성 $\mathbf v$를 ‘첫 단어’로 LSTM에 한 번만 먹이므로 뒤의 칸으로 갈수록 $\mathbf v$까지의 경로가 길어집니다. 아래: 같은 $\mathbf v$를 모든 칸의 입력에 연결(지름길)해 의존 거리가 $1$입니다. 각 칸의 위는 소프트맥스가 내는 다음 단어이고 아래는 입력 단어입니다.`);
    },
    // 21.2 attention-based captioning loop (slides 47–51)
    capattn() {
      const grid = (x, y, n, c, fn) => { let g = ''; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) g += `<rect x="${x + j * c}" y="${y + i * c}" width="${c}" height="${c}" style="fill:var(--denim);fill-opacity:${fn(i, j).toFixed(2)};stroke:var(--ink-3);stroke-width:.5"/>`; return g; };
      let s = FK.T(60, 28, '특성 지도 x', { s: 11, c: 'em' }) + grid(20, 36, 4, 20, () => 0.12) + FK.T(68, 130, '14×14×512', { s: 10, a: 'start' });
      s += FK.A(100, 76, 132, 76, 'ld', 7) + box(134, 60, 56, 32, 'f_{att}', '', true) + FK.A(190, 76, 262, 76, 'ld', 7) + FK.T(226, 68, 'softmax', { s: 10 });
      s += FK.T(302, 28, '어텐션 α', { s: 11, c: 'em' }) + grid(262, 36, 4, 20, (i, j) => 0.08 + 0.8 * Math.exp(-((i - 1.2) ** 2 + (j - 2) ** 2) / 1.4)) + FK.T(346, 86, '합 1', { a: 'start', s: 10 });
      s += FK.P('M60,118 V176 H290', 'ld') + node(302, 176, '×', 11) + FK.A(302, 118, 302, 164, 'ld', 7) + FK.A(313, 176, 388, 176, 'ld', 7) + FK.T(350, 168, 'z', { c: 'it' });
      s += FK.R(390, 144, 64, 80, 'bm') + FK.T(422, 188, 'LSTM', { s: 11, c: 'em' }) + FK.A(422, 144, 422, 96, 'ax', 7) + box(388, 70, 68, 24, 'softmax') + FK.A(422, 70, 422, 44, 'ax', 7) + FK.T(422, 36, 'ŷ_{t+1}', { c: 'it' });
      s += box(300, 205, 62, 24, 'W_{emb}') + FK.A(362, 217, 388, 217, 'ld', 7) + FK.A(331, 262, 331, 231, 'ax', 7) + FK.T(331, 276, 'y_{t}', { c: 'it' });
      s += FK.A(454, 184, 500, 184, 'ld', 6) + FK.T(506, 188, 'h_{t}', { a: 'start', c: 'it' }) + FK.P('M476,184 V250 H162 V94', 'dm ds') + FK.A(162, 112, 162, 94, 'dm', 7) + FK.T(318, 270, 'h_{t-1}: 다음 걸음의 질의', { a: 'end', s: 10, c: 'lb' });
      s += FK.T(434, 122, '걸음 t마다 반복', { s: 10, c: 'it', a: 'start' });
      return FK.fig(560, 290, '어텐션 캡셔닝의 걸음', s,
        R`소프트 어텐션 캡셔닝의 한 걸음(슬라이드 47–51). 특성 지도 $\mathbf x$와 직전 은닉 상태 $\mathbf h_{t-1}$로 $f_{att}$가 칸마다 점수를 내고, 소프트맥스로 합이 $1$인 어텐션 $\alpha^{(t)}$를 만듭니다. $\mathbf x$를 $\alpha^{(t)}$로 가중해 더한 요약 $\mathbf z^{(t)}$가 단어 임베딩 $W_{emb}\mathbf y_t$와 함께 LSTM에 들어가고, 출력 $\mathbf h_t$가 다음 걸음의 질의가 됩니다. 칸의 색 진하기는 가중치입니다.`);
    },
    // 21.2 soft vs hard attention maps (slides 42, 53): synthetic grids, not the paper's photos
    attnmaps() {
      const words = ['bird', 'flying', 'over', 'body', 'water'];
      const ctr = [[2.6, 3], [3.2, 3], [2.4, 2.2], [4, 3.6], [5, 3]]; // (row, col) of the focus
      const sg = [1.1, 1.8, 1.8, 2, 1.4];
      const cell = 9, n = 7, ox = 160, gap = 80;
      const hc = (x, y, v) => `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:var(--denim);fill-opacity:${v.toFixed(2)};stroke:var(--ink-3);stroke-width:.4"/>`;
      let s = FK.T(10, 62, '소프트', { a: 'start', s: 11, c: 'em' }) + FK.T(10, 76, '(가중 평균)', { a: 'start', s: 10 }) + FK.T(10, 158, '하드', { a: 'start', s: 11, c: 'em' }) + FK.T(10, 172, '(한 칸 선택)', { a: 'start', s: 10 });
      s += FK.T(ox - 78 + 31, 30, '균일', { s: 10 });
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += hc(ox - 78 + j * cell, 38 + i * cell, 0.3);
      words.forEach((w, k) => {
        const x0 = ox + k * gap, w2 = [];
        let sum = 0;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = Math.exp(-((i - ctr[k][0]) ** 2 + (j - ctr[k][1]) ** 2) / (2 * sg[k] ** 2)); w2.push(v); sum += v; }
        const mx = Math.max(...w2);
        let best = 0;
        w2.forEach((v, q) => { if (v === mx) best = q; });
        s += FK.T(x0 + n * cell / 2, 30, w, { s: 11, c: 'em' });
        w2.forEach((v, q) => { const i = Math.floor(q / n), j = q % n; s += hc(x0 + j * cell, 38 + i * cell, 0.06 + 0.94 * v / mx) + hc(x0 + j * cell, 134 + i * cell, q === best ? 0.95 : 0.04); });
      });
      s += FK.T(280, 222, '칸이 진할수록 큰 가중치. 소프트는 합이 1인 가중치로 모든 칸을 섞고,', { s: 10 }) + FK.T(280, 236, '하드는 한 칸만 고른다', { s: 10 });
      return FK.fig(560, 246, '소프트와 하드 어텐션 지도', s,
        R`소프트 어텐션과 하드 어텐션의 어텐션 지도(슬라이드 42, 53)를 격자 $7\times7$로 단순화해 다시 그린 도식입니다(사진 위의 실제 지도가 아니라 가상의 값). 왼쪽 ‘균일’은 어텐션이 없는 경우(모든 칸이 같은 가중치)입니다. 소프트는 단어(bird, flying, over, body, water)마다 가중치의 분포가 다른 위치로 옮겨 가고, 하드는 같은 분포에서 한 칸만 골라 그 칸의 특성을 그대로 씁니다.`);
    },
    // 21.3 squeeze-and-excitation block (slide 54)
    senet() {
      const slices = (x, y, w, h, n, op) => { let g = ''; for (let k = n - 1; k >= 0; k--) g += `<rect x="${x + k * 6}" y="${y - k * 6}" width="${w}" height="${h}" style="fill:var(--denim);fill-opacity:${op(k).toFixed(2)};stroke:var(--ink-2);stroke-width:1"/>`; return g; };
      const bar = (x, y, w, n, op) => { let g = ''; for (let k = 0; k < n; k++) g += `<rect x="${x + k * w / n}" y="${y}" width="${w / n}" height="12" style="fill:var(--camel);fill-opacity:${op(k).toFixed(2)};stroke:var(--ink-2);stroke-width:.8"/>`; return g; };
      const w = [0.9, 0.2, 0.7, 0.35, 0.95, 0.1];
      let s = slices(18, 100, 56, 56, 6, () => 0.14) + FK.T(60, 178, 'U (H×W×C)', { s: 10 }) + FK.T(60, 196, '특성 지도', { s: 10 });
      s += FK.A(104, 80, 140, 60, 'ld', 7) + FK.T(188, 38, 'squeeze', { s: 11, c: 'em' }) + bar(150, 54, 76, 6, () => 0.3) + FK.T(188, 82, 's (1×1×C)', { s: 10 });
      s += FK.A(228, 60, 258, 60, 'ld', 7) + FK.T(274, 38, 'excitation', { s: 11, c: 'em' }) + bar(262, 54, 28, 3, () => 0.3) + FK.T(276, 82, 'C/r', { s: 10 });
      s += FK.A(292, 60, 322, 60, 'ld', 7) + bar(326, 54, 76, 6, (k) => w[k]) + FK.T(364, 82, 'w (0~1, 독립)', { s: 10 });
      s += FK.T(188, 104, '전역 평균 풀링', { s: 10 }) + FK.T(276, 104, 'FC · ReLU', { s: 10 }) + FK.T(364, 104, 'FC · 시그모이드', { s: 10 });
      s += FK.P('M404,66 H440 V140', 'ld') + FK.A(440, 134, 440, 142, 'ld', 6) + node(440, 154, '×', 11) + FK.P('M82,128 H428', 'dm ds') + FK.A(420, 128, 430, 128, 'dm', 6);
      s += FK.A(452, 154, 480, 154, 'ld', 7) + slices(484, 150, 40, 40, 6, (k) => 0.08 + 0.8 * w[k]) + FK.T(504, 208, 'Ũ', { c: 'it' }) + FK.T(504, 224, '채널마다 × w_{c}', { s: 10 });
      s += FK.T(250, 144, '그대로 지나가는 U', { s: 10 });
      return FK.fig(560, 234, '스퀴즈-익사이트 블록', s,
        R`스퀴즈-익사이트(SE) 블록(슬라이드 54). 특성 지도 $U$를 전역 평균 풀링으로 채널당 숫자 하나 $\mathbf s\in\mathbb R^C$로 줄이고(squeeze), 병목 MLP($C\to C/r\to C$)와 시그모이드로 채널별 가중치 $\mathbf w$를 만든(excitation) 뒤, 원래 $U$의 채널 $c$에 $w_c$를 곱해(scale) 같은 크기의 $\tilde U$를 냅니다. $\mathbf w$의 값은 합이 $1$일 필요가 없습니다(막대 칸의 진하기는 가상의 값).`);
    },
    // 21.3 one model for all data (slide 61)
    onemodel() {
      const ins = ['이미지', '점군', '소리', '언어'], outs = ['물체', '움직임', '의미', '깊이'];
      let s = box(215, 70, 130, 64, '단일 모델', '어텐션', true);
      ins.forEach((t, k) => { const y = 14 + k * 50; s += box(20, y, 96, 30, t) + FK.A(116, y + 15, 213, 102, 'ld', 7); });
      outs.forEach((t, k) => { const y = 14 + k * 50; s += box(444, y, 96, 30, t) + FK.A(347, 102, 442, y + 15, 'ld', 7); });
      s += FK.T(280, 170, '자료 형태를 가정하지 않는다', { s: 10 });
      return FK.fig(560, 214, '하나의 모델로 여러 자료와 과제', s,
        R`여러 자료(이미지·점군·소리·언어)를 하나의 신경망에 넣어 여러 과제(물체 검출·움직임·의미 분할·깊이)를 내는 범용 모델의 목표(슬라이드 61). 이를 위한 요구는 입력을 격자나 사슬로 가정하지 않고 벡터의 모음으로만 다루는 것이고, 어텐션이 그런 연산입니다.`);
    },
    // 21.5 cross-attention with M queries and separate keys / values (slides 66–67)
    crossattn() {
      const cell = 32, gy = 30;
      let s = FK.T(28, 20, '입력 x', { s: 10 }) + FK.T(110, 20, '키 k | 값 v', { s: 10 }) + FK.T(201, 20, '질의 q', { s: 10 }) + FK.T(273, 20, 'e_{j,i} = q_{j}·k_{i}/√D', { s: 10, c: 'it' }) + FK.T(428, 20, 'A (행마다 합 1)', { s: 10 }) + FK.T(532, 20, '출력 y', { s: 10 });
      for (let j = 0; j < 3; j++) {
        const y = gy + 3 + j * cell;
        s += box(10, y, 36, 26, 'x_' + j) + FK.A(46, y + 13, 70, y + 13, 'ld', 6) + FK.R(70, y, 40, 26, 'bm') + FK.R(110, y, 40, 26, 'bm2') + FK.T(90, y + 17, 'k_' + j, { s: 11, c: 'em' }) + FK.T(130, y + 17, 'v_' + j, { s: 11, c: 'em' })
          + box(185, y, 32, 26, 'q_' + j) + box(513, y, 38, 26, 'y_' + j);
        for (let i = 0; i < 3; i++) s += FK.R(225 + i * cell, gy + j * cell, cell, cell, 'bm') + FK.T(225 + i * cell + 16, gy + j * cell + 20, 'e', { s: 10, c: 'it' }) + FK.R(380 + i * cell, gy + j * cell, cell, cell, 'bm2') + FK.T(380 + i * cell + 16, gy + j * cell + 20, 'a', { s: 10, c: 'it' });
      }
      s += FK.A(217, 63, 224, 63, 'ld', 5);
      ['k_0', 'k_1', 'k_2'].forEach((t, i) => { s += FK.T(225 + i * cell + 16, 142, t, { s: 10 }); });
      s += FK.P('M90,128 V168 H273', 'dm ds') + FK.A(273, 168, 273, 148, 'dm', 7) + FK.T(180, 162, 'k', { s: 10, c: 'it' });
      s += FK.A(321, 78, 378, 78, 'ld', 7) + FK.T(350, 68, 'softmax', { s: 10 });
      s += FK.A(476, 78, 511, 78, 'ld', 7) + FK.T(494, 68, '×V', { s: 10 });
      s += FK.P('M130,128 V198 H494 V88', 'dm ds') + FK.A(494, 100, 494, 84, 'dm', 7) + FK.T(260, 192, 'v', { s: 10, c: 'it' });
      s += FK.T(280, 222, '질의 q는 밖에서 오고(교차), 입력 x에서 만들면 셀프 어텐션', { s: 10 });
      return FK.fig(560, 234, '질의가 여러 개인 교차 어텐션', s,
        R`질의가 $M$개이고 키·값이 따로 있는 일반 어텐션 층(슬라이드 66–67). 입력 $\mathbf x_i$에서 키 $\mathbf k_i=\mathbf x_iW_k$와 값 $\mathbf v_i=\mathbf x_iW_v$를 만들고, 질의 $\mathbf q_j$마다 점수 $e_{j,i}=\mathbf q_j\cdot\mathbf k_i/\sqrt D$(행)를 구해 행마다 소프트맥스하면 $A$이며, 출력 $\mathbf y_j=\sum_ia_{j,i}\mathbf v_i$입니다. 질의를 같은 입력 $\mathbf x$에서 $\mathbf q=\mathbf xW_q$로 만들면 셀프 어텐션입니다.`);
    },
    // 21.6 positional encodings, computed (slides 69, 77)
    posenc() {
      const d = 16, T = 32;
      const pe = (t, r) => { const k = r >> 1, w = 1 / Math.pow(10000, 2 * k / d); return r % 2 === 0 ? Math.sin(w * t) : Math.cos(w * t); };
      const hm = (x, y, w, h, v) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:var(${v >= 0 ? '--denim' : '--camel'});fill-opacity:${(Math.abs(v) * 0.9 + 0.04).toFixed(2)};stroke:none"/>`;
      let s = FK.T(10, 16, '이진수: 비트마다 주기가 2배', { a: 'start', s: 11, c: 'em' });
      for (let t = 0; t < 16; t++) for (let b = 0; b < 4; b++) { const bit = (t >> (3 - b)) & 1; s += `<rect x="${24 + t * 11}" y="${28 + b * 11}" width="11" height="11" style="fill:var(--denim);fill-opacity:${bit ? 0.6 : 0.05};stroke:var(--ink-3);stroke-width:.4"/>`; }
      s += FK.T(21, 55, '비트', { s: 10, a: 'end' }) + FK.T(24, 86, '0', { s: 10 }) + FK.T(24 + 15 * 11 + 5, 86, '15', { s: 10 }) + FK.T(110, 98, '위치 t', { s: 10 });
      s += FK.T(290, 16, '사인 부호화 p(t), d=16 (위: 빠른 쌍)', { a: 'start', s: 11, c: 'em' });
      for (let r = 0; r < d; r++) for (let t = 0; t < T; t++) s += hm(290 + t * 8, 28 + r * 5.5, 8, 5.5, pe(t, r));
      s += FK.T(280, 55, '차원', { s: 10, a: 'end' }) + FK.T(290, 126, '0', { s: 10 }) + FK.T(290 + 31 * 8 + 4, 126, '31', { s: 10 }) + FK.T(420, 138, '위치 t', { s: 10 });
      const x0 = 40, y0 = 205, sx = 7.6, sy = 34;
      s += FK.P(`M${x0},${y0} H${x0 + 64 * sx}`, 'ax') + FK.T(x0 - 6, y0 + 4, '0', { s: 10, a: 'end' }) + FK.T(x0 + 64 * sx / 2, y0 + 56, '위치 t', { s: 10 });
      ['cv', 'rx', 'vl'].forEach((c, k) => {
        const w = 1 / Math.pow(10000, 2 * k / d);
        let d2 = '';
        for (let t = 0; t <= 64; t += 0.25) d2 += (t ? 'L' : 'M') + (x0 + t * sx).toFixed(1) + ',' + (y0 - sy * Math.sin(w * t)).toFixed(1);
        s += FK.P(d2, c);
      });
      s += FK.T(x0 + 64 * sx + 8, y0 - 22, 'sin t', { a: 'start', s: 10, c: 'lb' }) + FK.T(x0 + 64 * sx + 8, y0 - 2, 'sin(t/3.2)', { a: 'start', s: 10 }) + FK.T(x0 + 64 * sx + 8, y0 + 14, 'sin(t/10)', { a: 'start', s: 10 });
      s += FK.T(40, 164, '쌍 번호가 클수록 느리게 변하고, 위치마다 벡터 전체가 다르다', { a: 'start', s: 10 });
      return FK.fig(560, 270, '위치 부호화', s,
        R`위치 부호화(슬라이드 69, 77). 왼쪽 위: $0$~$15$의 이진수 4비트. 오른쪽 아래 비트일수록 빨리 뒤집히고 왼쪽으로 갈수록 주기가 두 배가 됩니다. 오른쪽 위: $d=16$일 때 $\mathbf p(t)=(\sin\omega_kt,\cos\omega_kt)_k$의 값을 $t=0,\dots,31$에 대해 계산한 것(파랑 $+$, 갈색 $-$)이며 위쪽 쌍일수록 빠릅니다. 아래: $k=0,1,2$인 세 쌍의 $\sin\omega_kt$ 곡선으로 $\omega_k=1,\ 1/3.16,\ 1/10$이어서 주기가 점점 길어집니다.`);
    },
    // 21.7 scaled dot-product attention and multi-head attention (slide 71)
    mha() {
      let s = '';
      const b = (x, y, w, h, t, hl) => box(x, y, w, h, t, '', hl);
      s += b(36, 38, 108, 24, 'MatMul') + b(36, 78, 108, 24, 'SoftMax') + b(36, 118, 108, 24, 'Mask (선택)') + b(36, 158, 108, 24, 'Scale') + b(36, 198, 108, 24, 'MatMul');
      [[78, 62], [118, 102], [158, 142], [198, 182]].forEach(([a, c]) => { s += FK.A(90, a, 90, c + 1, 'ax', 6); });
      s += FK.A(90, 38, 90, 14, 'ax', 7) + FK.A(70, 252, 70, 224, 'ax', 6) + FK.A(110, 252, 110, 224, 'ax', 6) + FK.P('M158,252 V50 H146', 'ld') + FK.A(152, 50, 145, 50, 'ld', 6);
      s += FK.T(70, 268, 'Q', { c: 'it' }) + FK.T(110, 268, 'K', { c: 'it' }) + FK.T(158, 268, 'V', { c: 'it' });
      s += FK.T(90, 292, '스케일 점곱 어텐션', { s: 11, c: 'em' });
      const x0 = 300;
      [[6, -6], [3, -3]].forEach(([dx, dy]) => { s += FK.R(x0 + 30 + dx, 118 + dy, 150, 52, 'bm'); });
      s += FK.R(x0 + 30, 118, 150, 52, 'bm2') + FK.T(x0 + 105, 140, '스케일 점곱', { s: 11, c: 'em' }) + FK.T(x0 + 105, 156, '어텐션', { s: 11, c: 'em' }) + FK.T(x0 + 198, 112, 'h', { a: 'start', c: 'it' });
      s += b(x0 + 55, 74, 100, 26, 'Concat') + b(x0 + 55, 30, 100, 26, 'Linear', true) + FK.A(x0 + 105, 118, x0 + 105, 101, 'ax', 6) + FK.A(x0 + 105, 74, x0 + 105, 57, 'ax', 6) + FK.A(x0 + 105, 30, x0 + 105, 8, 'ax', 7);
      [0, 1, 2].forEach((k) => {
        const cx = x0 + 52 + k * 53;
        s += FK.R(cx - 18, 192, 44, 24, 'bm') + FK.R(cx - 20, 194, 44, 24, 'bm') + b(cx - 22, 196, 44, 24, 'Linear') + FK.A(cx, 252, cx, 222, 'ax', 6) + FK.A(cx, 196, x0 + 52 + k * 53 * 0.9 + 8, 172, 'ax', 6);
      });
      s += FK.T(x0 + 52, 268, 'Q', { c: 'it' }) + FK.T(x0 + 105, 268, 'K', { c: 'it' }) + FK.T(x0 + 158, 268, 'V', { c: 'it' }) + FK.T(x0 + 105, 292, '멀티헤드 어텐션', { s: 11, c: 'em' });
      s += FK.P('M146,30 L' + (x0 + 28) + ',116', 'dm ds') + FK.P('M146,232 L' + (x0 + 28) + ',172', 'dm ds');
      return FK.fig(560, 304, '스케일 점곱 어텐션과 멀티헤드', s,
        R`스케일 점곱 어텐션과 멀티헤드 어텐션(슬라이드 71, Vaswani 외 논문의 그림을 다시 그림). 왼쪽: $QK^T$(MatMul) → Scale($\div\sqrt{D_k}$) → Mask(선택) → SoftMax → $V$와 MatMul. 오른쪽: $V,K,Q$마다 헤드별 Linear 층(투영)을 지나 왼쪽의 어텐션을 $h$번 병렬로 하고, 헤드의 출력을 Concat해 마지막 Linear($W_o$)에 넣습니다.`);
    },
    // 21.8 normalization axes: BN vs LN (slide 79)
    lncube() {
      const n = 4, c = 17, dx = 7, dy = -7;
      // generic 4x4x4 oblique cube: i = channel (x), j = H/W (y, down), k = batch (depth)
      const P2 = (ox, oy, i, j, k) => [ox + i * c + k * dx, oy + j * c + k * dy];
      const draw = (ox, oy, litF, litT, litR) => {
        let s = '';
        const poly = (pts, on) => `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L')}Z" style="${on ? 'fill:var(--denim);fill-opacity:.55' : 'fill:var(--paper-2)'};stroke:var(--ink-3);stroke-width:.6"/>`;
        const oyd = oy + n * 0; // k offset keeps the front face at (ox, oy + ...)
        for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const j = 0; s += poly([P2(ox, oyd, i, j, k + 1), P2(ox, oyd, i + 1, j, k + 1), P2(ox, oyd, i + 1, j, k), P2(ox, oyd, i, j, k)], litT(i, k)); }
        for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { const i = n; s += poly([P2(ox, oyd, i, j, k), P2(ox, oyd, i, j + 1, k), P2(ox, oyd, i, j + 1, k + 1), P2(ox, oyd, i, j, k + 1)], litR(j, k)); }
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += poly([P2(ox, oyd, i, j, 0), P2(ox, oyd, i + 1, j, 0), P2(ox, oyd, i + 1, j + 1, 0), P2(ox, oyd, i, j + 1, 0)], litF(i, j));
        return s;
      };
      const oy = 62;
      const defs = [
        { ox: 36, t: 'BN', f: (i) => i === 3, tp: (i) => i === 3, r: () => true, ax: 'H,W', d: '채널마다 (N, H, W)를 모은다' },
        { ox: 214, t: 'LN (CNN)', f: () => true, tp: (i, k) => k === 0, r: (j, k) => k === 0, ax: 'H,W', d: '샘플마다 (C, H, W)를 모은다' },
        { ox: 392, t: 'LN (트랜스포머)', f: (i, j) => j === 3, tp: () => false, r: (j, k) => j === 3 && k === 0, ax: 'Seq len', d: '토큰마다 C만 모은다' },
      ];
      let s = '';
      defs.forEach((D) => {
        s += FK.T(D.ox + 50, 24, D.t, { s: 11, c: 'em' }) + draw(D.ox, oy, D.f, D.tp, D.r);
        s += FK.T(D.ox + 34, oy + n * c + 18, 'C', { s: 11, c: 'it' }) + FK.T(D.ox + n * c + 36, oy - 18, 'N', { s: 11, c: 'it' }) + FK.T(D.ox - 8, oy + 36, D.ax, { s: 10, a: 'end' }) + FK.T(D.ox + 50, oy + n * c + 40, D.d, { s: 10 });
      });
      return FK.fig(560, 186, '정규화하는 축: BN과 LN', s,
        R`정규화 통계를 모으는 칸(파랑)을 상자 $N\times C\times(H,W$ 또는 Seq\_len$)$ 위에 나타낸 도식(슬라이드 79). BN은 채널 하나의 모든 샘플과 위치를, CNN의 LN은 샘플 하나의 모든 채널과 위치를, 트랜스포머의 LN은 샘플 하나의 토큰 하나의 모든 채널만 모읍니다.`);
    },
  });
})();
