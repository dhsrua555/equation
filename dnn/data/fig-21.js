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
        + FK.A(cx, 292, cx, 263, 'ax', 7) + node(cx, 250, '+', 11) + FK.T(70, 254, '위치 부호화', { s: 11 }) + FK.A(112, 250, 238, 250, 'ld', 7)
        + FK.A(cx, 239, cx, 219, 'ax', 7) + FK.A(cx, 176, cx, 165, 'ax', 7) + FK.A(cx, 138, cx, 129, 'ax', 7) + FK.A(cx, 92, cx, 77, 'ax', 7)
        + FK.A(cx, 50, cx, 20, 'ax', 8) + FK.T(cx, 12, 'h (n×d)', { s: 11, c: 'it' });
      // skip connections around the two sub-layers
      s += FK.P(`M${cx},228 H128 V151`, 'ld') + FK.A(128, 151, X - 2, 151, 'ld', 7)
        + FK.P(`M${cx},133 H112 V63`, 'ld') + FK.A(112, 63, X - 2, 63, 'ld', 7);
      return FK.fig(560, 350, '트랜스포머 인코더 블록', s,
        R`트랜스포머 인코더 블록(슬라이드 72–77). 입력 토큰을 임베딩하고 위치 부호화를 더한 뒤, 멀티헤드 어텐션에 스킵 연결을 더해 LayerNorm하고($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{Attn})$), 이어서 위치별 FF에 스킵 연결을 더해 LayerNorm합니다($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{FF})$). 점선 안의 블록은 입출력이 $n\times d$로 같아서 $N$번 쌓을 수 있습니다.`);
    },
  });
})();
