/* 15 트랜스포머 — 본문 그림 (강의 Ch12 슬라이드의 도식을 다시 그림) */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const T = FK.T;
  const up = (x1, y1, x2, y2, c = 'ax') => FK.A(x1, y1, x2, y2, c, 7);
  const bx = (x, y, w, h, label, cls = 'bm', s) => FK.R(x, y, w, h, cls) + T(x + w / 2, y + h / 2 + 4, label, { c: 'em', s });

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 12.1.5 one attention head: data flow (slide 17) and the matrix shapes of Y = Softmax[QKᵀ/√D_k] V (slide 16)
    attnflow() {
      let s = '';
      // left: information flow, bottom to top
      s += T(140, 268, 'X', { c: 'it' }) + up(140, 256, 140, 242) + FK.L(70, 242, 210, 242, 'gd');
      [[70, 'W_q', 'Q'], [140, 'W_k', 'K'], [210, 'W_v', 'V']].forEach(([x, w, q]) => {
        s += up(x, 242, x, 230) + bx(x - 28, 202, 56, 28, w, 'bm2') + T(x + 10, 192, q, { c: 'it', a: 'start' });
      });
      s += up(70, 202, 70, 184) + up(140, 202, 140, 184) + up(210, 202, 210, 58);
      s += bx(40, 156, 130, 28, 'QKᵀ  (N×N)') + up(105, 156, 105, 142);
      s += bx(40, 114, 130, 28, '÷ √D_k') + up(105, 114, 105, 100);
      s += bx(40, 72, 130, 28, 'softmax (행마다)') + up(105, 72, 105, 58);
      s += bx(40, 30, 200, 28, '× V') + up(140, 30, 140, 12) + T(150, 16, 'Y', { c: 'it', a: 'start' });
      // right: shapes
      const y0 = 70;
      s += FK.R(300, y0, 100, 100, 'bm') + FK.R(300, y0 + 26, 100, 12, 'bm2') + FK.R(300, y0, 100, 100, 'sv')
        + T(415, y0 + 54, '×', { c: 'em', s: 16 })
        + FK.R(428, y0, 44, 100, 'bm') + FK.R(446, y0, 10, 100, 'bm2') + FK.R(428, y0, 44, 100, 'sv')
        + T(487, y0 + 54, '=', { c: 'em', s: 16 })
        + FK.R(502, y0, 44, 100, 'bm') + FK.R(520, y0 + 26, 10, 12, 'bm2') + FK.R(502, y0, 44, 100, 'sv')
        + T(350, y0 + 120, 'Softmax[QKᵀ/√D_k]', { s: 11 }) + T(350, y0 + 136, 'N×N', { s: 11 })
        + T(450, y0 + 120, 'V', { c: 'it' }) + T(450, y0 + 136, 'N×D_v', { s: 11 })
        + T(524, y0 + 120, 'Y', { c: 'it' }) + T(524, y0 + 136, 'N×D_v', { s: 11 })
        + T(423, 40, '출력 한 칸 = 가중치 한 행 · V의 한 열', { s: 11, c: 'lb' });
      return FK.fig(560, 278, '어텐션 머리 하나의 계산', s,
        R`(왼쪽) 머리 하나의 정보 흐름(슬라이드 17). $\mathbf X$를 세 행렬 $\mathbf W^{(q)},\mathbf W^{(k)},\mathbf W^{(v)}$(그림의 $W_q,W_k,W_v$)로 투영해 $\mathbf Q,\mathbf K,\mathbf V$를 만들고, $\mathbf Q\mathbf K^T$를 $\sqrt{D_k}$로 나눈 뒤 행마다 소프트맥스를 취해 $\mathbf V$에 곱합니다. (오른쪽) 크기: $N\times N$ 가중치 행렬의 칠한 행과 $\mathbf V$의 칠한 열의 내적이 $\mathbf Y$의 칠한 칸입니다(슬라이드 16).`);
    },
    // 12.1.6–12.1.7 a transformer layer (slide 20) and multi-head attention (slide 19)
    mhalayer() {
      let s = '';
      // left: transformer layer
      s += T(125, 296, 'X', { c: 'it' }) + up(125, 284, 125, 262)
        + bx(50, 228, 150, 34, '멀티헤드 셀프 어텐션', 'bm2', 11) + up(125, 228, 125, 206)
        + bx(50, 180, 150, 26, 'add & norm') + up(125, 180, 125, 150)
        + FK.C(125, 165, 3, 'jt') + T(112, 169, 'Z', { c: 'it', a: 'end' })
        + bx(50, 122, 150, 28, 'MLP (위치별)') + up(125, 122, 125, 98)
        + bx(50, 72, 150, 26, 'add & norm') + up(125, 72, 125, 48) + T(125, 40, 'X̃', { c: 'it' });
      s += FK.P('M125,276 L222,276 L222,193', 'ld') + FK.A(222, 193, 202, 193, 'ld', 7)
        + FK.P('M125,165 L222,165 L222,85', 'ld') + FK.A(222, 85, 202, 85, 'ld', 7) + T(230, 236, '잔차', { a: 'start', s: 11, c: 'lb' });
      // right: multi-head attention
      const heads = [[300, 'H_1'], [380, 'H_2'], [500, 'H_H']];
      s += T(415, 296, 'X', { c: 'it' }) + up(415, 284, 415, 272) + FK.L(300, 272, 500, 272, 'gd');
      heads.forEach(([x, h]) => {
        s += up(x, 272, x, 250) + bx(x - 36, 216, 72, 34, '셀프 어텐션', 'bm2', 10) + T(x + 40, 212, h, { c: 'it', a: 'start', s: 11 }) + up(x, 216, x < 415 ? 400 : 430, 178);
      });
      s += T(440, 238, '…', { c: 'em' })
        + bx(340, 150, 150, 28, 'concat  N×HD_{v}', 'bm', 11) + up(415, 150, 415, 128)
        + bx(340, 100, 150, 28, '× W_o  HD_{v}×D', 'bm', 11) + up(415, 100, 415, 74)
        + T(415, 66, 'Y  (N×D)', { c: 'it' }) + T(415, 26, '멀티헤드 어텐션', { c: 'em' }) + T(125, 16, '트랜스포머 층', { c: 'em' });
      return FK.fig(560, 304, '트랜스포머 층과 멀티헤드 어텐션', s,
        R`(왼쪽) 트랜스포머 층(슬라이드 20): 멀티헤드 셀프 어텐션 뒤에 잔차 연결과 층 정규화(add & norm), 그다음 토큰마다 같은 MLP와 또 한 번의 add & norm. $\mathbf Z=\operatorname{LayerNorm}[\mathbf Y(\mathbf X)+\mathbf X]$, $\widetilde{\mathbf X}=\operatorname{LayerNorm}[\operatorname{MLP}[\mathbf Z]+\mathbf Z]$. (오른쪽) 머리 $H$개가 각자의 투영으로 어텐션을 계산하고, 결과를 이어 붙여($N\times HD_v$) $\mathbf W^{(o)}$로 $N\times D$로 되돌립니다(슬라이드 19).`);
    },
    // 12.1.9 sinusoidal positional encoding: components of different wavelengths, read off at two positions (slide 25)
    posenc() {
      const D = 12, Lc = 30, rows = [0, 2, 4, 6, 8, 10], n = 6, m = 27;
      const om = (i) => Math.pow(Lc, -i / D);
      const c = rows.map((i, k) => ({ f: (x) => 2.6 * k + Math.sin(om(i) * x), c: k % 2 ? 'rx' : 'ld' }));
      return FK.G({ w: 560, h: 290, x: [-4, 44], y: [-1.4, 2.6 * 5 + 1.4], m: [14, 14, 26, 46], label: '사인파 위치 부호화의 성분', axes: false,
        xt: [], yt: [], c,
        extra: (X, Y) => {
          let s = FK.L(X(0), Y(-1.4), X(44), Y(-1.4), 'ax') + T(X(44), Y(-1.4) + 16, '위치 n', { a: 'end' });
          [[n, 'n'], [m, 'm']].forEach(([p, lab]) => {
            s += FK.L(X(p), Y(-1.4), X(p), Y(2.6 * 5 + 1.3), 'dm ds') + T(X(p), Y(-1.4) + 16, lab, { c: 'it' });
            rows.forEach((i, k) => { s += FK.dot(X, Y, p, 2.6 * k + Math.sin(om(i) * p)); });
          });
          rows.forEach((i, k) => { s += T(X(-1), Y(2.6 * k) + 4, `r_{·,${i}}`, { a: 'end', c: 'it' }); });
          return s;
        },
        cap: R`$D=12$, $L=30$일 때 짝수 성분 $r_{ni}=\sin(n/L^{i/D})$를 위치 $n$에 대해 그렸습니다(홀수 성분은 같은 주파수의 코사인). 아래 성분일수록 빨리, 위로 갈수록 천천히 진동합니다. 세로 점선의 점들을 위에서 아래로 읽은 값이 그 위치의 부호화 벡터이며, 위치마다 조합이 달라 위치를 구별하는 지문이 됩니다(슬라이드 25).` });
    },
    // 12.2.1 Word2Vec training strategies (slide 29)
    w2v() {
      let s = '';
      const ctxL = [[30, 'x_n−2'], [80, 'x_n−1'], [170, 'x_n+1'], [220, 'x_n+2']];
      const tok = (x, y, lab) => FK.R(x, y, 50, 24, 'bm') + T(x + 25, y + 16, lab, { c: 'it', s: 11 });
      ctxL.forEach(([y, lab]) => { s += tok(30, y, lab) + up(82, y + 12, 166, 140); });
      s += FK.R(168, 100, 24, 80, 'bm2') + T(180, 92, 'v', { c: 'it' }) + up(194, 140, 236, 140) + tok(238, 128, 'x_n');
      s += tok(300, 128, 'x_n') + up(352, 140, 390, 140) + FK.R(392, 100, 24, 80, 'bm2') + T(404, 92, 'v', { c: 'it' });
      ctxL.forEach(([y, lab]) => { s += up(418, 140, 476, y + 12) + tok(478, y, lab); });
      s += T(150, 14, 'CBOW: 주변 단어 → 가운데 단어', { c: 'em' }) + T(415, 14, '스킵그램: 가운데 단어 → 주변 단어', { c: 'em' });
      return FK.fig(560, 260, 'Word2Vec의 두 학습 방법', s,
        R`(왼쪽) CBOW는 주변 단어들의 원-핫 벡터로 가운데 단어 $\mathbf x_n$을 예측하고, (오른쪽) 스킵그램은 가운데 단어로 주변 단어들을 예측합니다. 가운데의 칠한 막대 $\mathbf v$가 은닉층, 곧 학습되는 임베딩입니다. 정답이 텍스트 자체에서 나오므로 자기 지도 학습입니다(슬라이드 29).`);
    },
    // 12.2.5 encoder–decoder RNN for translation (slides 38–39)
    rnn() {
      let s = '';
      const enc = [70, 140, 210], dec = [300, 370, 440, 510], cy = 105, w = 44, h = 30;
      const cell = (x) => FK.R(x - w / 2, cy - h / 2, w, h, 'bm2') + T(x, cy + 4, 'w', { c: 'it' });
      s += T(18, cy + 4, 'z_0', { c: 'it' }) + up(30, cy, enc[0] - w / 2 - 1, cy);
      [...enc, ...dec].forEach((x, i, a) => { s += cell(x); if (i < a.length - 1) s += up(x + w / 2, cy, a[i + 1] - w / 2 - 1, cy); });
      s += T((enc[2] + dec[0]) / 2, cy - 8, 'z*', { c: 'it' });
      ['I', 'am', 'happy'].forEach((t, i) => { s += up(enc[i], 150, enc[i], cy + h / 2 + 1) + T(enc[i], 166, t, { s: 11 }); });
      ['⟨start⟩', 'Ik', 'ben', 'gelukkig'].forEach((t, i) => { s += up(dec[i], 150, dec[i], cy + h / 2 + 1) + T(dec[i], 166, t, { s: 11, c: i ? '' : 'rl' }); });
      ['Ik', 'ben', 'gelukkig', '⟨stop⟩'].forEach((t, i) => {
        s += up(dec[i], cy - h / 2, dec[i], 60) + T(dec[i], 50, t, { s: 11, c: i === 3 ? 'rl' : 'lb' });
        if (i < 3) s += FK.P(`M${dec[i] + 8},56 C${dec[i] + 40},56 ${dec[i + 1] - 40},152 ${dec[i + 1] - 12},158`, 'dm ds');
      });
      s += FK.L(enc[0] - 22, 186, enc[2] + 22, 186, 'dm') + T(enc[1], 202, '인코더', { c: 'em' })
        + FK.L(dec[0] - 22, 186, dec[3] + 22, 186, 'dm') + T((dec[1] + dec[2]) / 2, 202, '디코더 (자기회귀)', { c: 'em' });
      return FK.fig(560, 212, '기계 번역용 인코더–디코더 RNN', s,
        R`모든 칸이 같은 모수 $\mathbf w$를 쓰는 RNN을 시간 방향으로 펼친 그림입니다. 인코더는 “I am happy”를 읽어 은닉 상태 $\mathbf z^*$ 하나로 압축하고, 디코더는 ⟨start⟩에서 시작해 단어를 하나씩 내며, 낸 단어를 다음 칸의 입력으로 되먹입니다(점선). ⟨stop⟩이 나오면 멈춥니다. 원문 전체가 $\mathbf z^*$ 하나를 지나야 하는 것이 병목입니다(슬라이드 39).`);
    },
    // 12.3.1 the causal mask (slide 47)
    causalmask() {
      const rows = ['I', 'swam', 'across', 'the', 'river'], cols = ['⟨start⟩', 'I', 'swam', 'across', 'the'];
      const x0 = 150, y0 = 36, c = 40;
      let s = '';
      rows.forEach((r, i) => cols.forEach((_, j) => { s += FK.R(x0 + j * c, y0 + i * c, c, c, j > i ? 'bm2' : 'bm') + (j > i ? T(x0 + j * c + c / 2, y0 + i * c + c / 2 + 4, '0', { s: 11 }) : ''); }));
      s += FK.R(x0, y0 + 2 * c, 3 * c, c, 'th');
      rows.forEach((r, i) => { s += T(x0 - 8, y0 + i * c + c / 2 + 4, r, { a: 'end', s: 11, c: i === 2 ? 'lb' : '' }); });
      cols.forEach((t, j) => { s += T(x0 + j * c + c / 2, y0 + 5 * c + 16, t, { s: 9 }); });
      s += T(x0 - 8, y0 - 10, '출력 ↓', { a: 'end', s: 11 }) + T(x0 + 2.5 * c, y0 + 5 * c + 34, '입력 →', { s: 11 });
      s += T(375, 80, '칠한 칸: 미래 토큰', { a: 'start', c: 'em' }) + T(375, 98, '점수에 −∞를 더해 가중치 0', { a: 'start', s: 11 })
        + T(375, 136, '굵은 테두리: “across”를 예측하는 행', { a: 'start', s: 11, c: 'lb' }) + T(375, 154, '⟨start⟩, I, swam만 볼 수 있음', { a: 'start', s: 11 });
      return FK.fig(560, 280, '인과 마스크', s,
        R`“I swam across the river …”를 학습할 때의 마스크 행렬. 입력은 한 칸 밀려 ⟨start⟩로 시작하고, 행 $n$(출력)은 열 $m\le n$(입력)만 참고합니다. 칠한 위쪽 삼각형은 미래라서 어텐션 가중치를 0으로 둡니다. 그래서 서열 전체를 한 번에 병렬로 학습해도 각 위치는 정답을 미리 보지 못합니다(슬라이드 47).`);
    },
    // 12.3.2 temperature: logits (2, 1, 0) at T = 0.5, 1, 2
    temperature() {
      const a = [2, 1, 0];
      const p = (Tt) => { const e = a.map((v) => Math.exp(v / Tt)), z = e.reduce((u, v) => u + v, 0); return e.map((v) => v / z); };
      const panel = (Tt, ox) => ({ ox, w: 186, h: 210, x: [0.4, 3.6], y: [0, 1], title: `T = ${Tt}`, m: [22, 8, 24, 30],
        xt: [[1, '1'], [2, '2'], [3, '3']], yt: ox ? [] : [[0.5, '0.5'], [1, '1']], noY: !!ox,
        extra: (X, Y) => p(Tt).map((v, k) => FK.R(X(k + 0.75), Y(v), X(k + 1.25) - X(k + 0.75), Y(0) - Y(v), Tt === 1 ? 'bm2' : 'bm') + T(X(k + 1), Y(v) - 4, v.toFixed(2), { s: 10 })).join('') });
      return FK.G2(560, 210, '온도에 따른 다음 토큰 분포', [panel(0.5, 0), panel(1, 187), panel(2, 374)],
        R`로짓 $(2,1,0)$을 $y_i=\exp(a_i/T)/\sum_j\exp(a_j/T)$로 바꾼 분포. 온도가 낮으면($T=0.5$) 가장 큰 토큰에 몰려 보수적이고, 높으면($T=2$) 평평해져 다양해집니다. $T\to0$이면 탐욕 탐색, $T\to\infty$이면 균등분포입니다.`);
    },
    // 12.3 the three transformer language models (slides 45, 52, 55)
    tfarch() {
      let s = '';
      const col = (x0, title, layer, inp, out) => {
        const cx = x0 + 70;
        return T(cx, 18, title, { c: 'em' }) + T(cx, 250, inp, { s: 11 }) + up(cx, 238, cx, 222)
          + bx(x0, 196, 140, 26, '임베딩 + 위치 부호화', 'bm', 10) + up(cx, 196, cx, 172)
          + bx(x0, 130, 140, 42, layer, 'bm2', 11) + up(cx, 130, cx, 106)
          + bx(x0 + 40, 82, 60, 24, 'LSM', 'bm', 11) + up(cx, 82, cx, 62) + T(cx, 52, out, { s: 11, c: 'lb' });
      };
      s += col(6, '(a) 인코더 (BERT)', '트랜스포머 층 × L', '⟨class⟩ x_1 … x_N', 'c, y_1 … y_N');
      s += col(160, '(b) 디코더 (GPT)', '마스크된 층 × L', '⟨start⟩ x_1 … x_N', 'y_1 … y_N+1');
      const e0 = 314, d0 = 450, ew = 96, dw = 104;
      s += T(434, 18, '(c) 인코더–디코더', { c: 'em' })
        + T(e0 + ew / 2, 250, 'X', { c: 'it' }) + up(e0 + ew / 2, 238, e0 + ew / 2, 222) + bx(e0, 196, ew, 26, '임베딩 + PE', 'bm', 10) + up(e0 + ew / 2, 196, e0 + ew / 2, 172)
        + bx(e0, 130, ew, 42, '셀프 어텐션 × L', 'bm2', 10) + FK.L(e0 + ew / 2, 130, e0 + ew / 2, 100, 'ld') + T(e0 + ew / 2 - 8, 112, 'Z', { c: 'it', a: 'end' })
        + T(d0 + dw / 2, 250, '⟨start⟩, Y', { s: 11 }) + up(d0 + dw / 2, 238, d0 + dw / 2, 222) + bx(d0, 196, dw, 26, '임베딩 + PE', 'bm', 10) + up(d0 + dw / 2, 196, d0 + dw / 2, 172)
        + bx(d0, 130, dw, 42, '교차 어텐션 × L', 'bm2', 10) + up(d0 + dw / 2, 130, d0 + dw / 2, 106)
        + bx(d0 + dw / 2 - 30, 82, 60, 24, 'LSM', 'bm', 11) + up(d0 + dw / 2, 82, d0 + dw / 2, 62) + T(d0 + dw / 2, 52, 'Y_N', { s: 11, c: 'lb' })
        + FK.P(`M${e0 + ew / 2},100 L${e0 + ew / 2},92 L${e0 + ew + 20},92 L${e0 + ew + 20},151`, 'ld') + FK.A(e0 + ew + 20, 151, d0 - 2, 151, 'ld', 7)
        + T(e0 + ew + 22, 86, 'K, V', { s: 10, c: 'lb', a: 'start' });
      return FK.fig(560, 260, '트랜스포머 언어 모델의 세 구조', s,
        R`(a) 인코더(BERT): 마스크 없는 층으로 양방향 문맥 표현을 만들고, ⟨class⟩ 위치의 출력 $\mathbf c$로 분류합니다. (b) 디코더(GPT): 인과 마스크가 있는 층으로 위치마다 다음 토큰 분포를 냅니다. (c) 인코더–디코더: 인코더 출력 $\mathbf Z$가 디코더의 교차 어텐션에 키와 값으로 들어가고, 디코더는 출력을 하나씩 생성해 되먹입니다(슬라이드 45, 52, 55). LSM은 위치마다 같은 선형층 + 소프트맥스입니다.`);
    },
    // 12.3.5 LoRA (slide 59)
    lora() {
      let s = '';
      s += bx(20, 60, 50, 100, 'X', 'bm') + T(45, 176, 'N×D', { s: 11 })
        + up(72, 96, 136, 62) + up(72, 124, 136, 158)
        + T(126, 50, '×', { s: 13 }) + bx(140, 26, 60, 60, 'W_0', 'bm') + T(170, 102, 'D×D (얼림)', { s: 11 })
        + T(126, 172, '×', { s: 13 }) + bx(140, 138, 18, 64, 'A', 'bm2', 11) + T(149, 218, 'D×R', { s: 10 })
        + T(170, 172, '×', { s: 13 }) + bx(182, 162, 64, 18, 'B', 'bm2', 11) + T(214, 198, 'R×D', { s: 10 })
        + up(204, 56, 318, 102) + up(250, 170, 318, 118)
        + FK.C(330, 110, 11, 'nd') + T(330, 114, '+', { c: 'em' }) + up(342, 110, 376, 110)
        + FK.R(378, 60, 60, 100, 'bm') + T(408, 100, 'XW_0', { c: 'em', s: 11 }) + T(408, 116, '+', { s: 11 }) + T(408, 132, 'XAB', { c: 'em', s: 11 }) + T(408, 176, 'N×D', { s: 11 })
        + T(460, 70, 'Ŵ = W_0 + AB', { a: 'start', c: 'em' })
        + T(460, 100, '학습: A, B만', { a: 'start', s: 11, c: 'lb' }) + T(460, 118, '모수 2DR', { a: 'start', s: 11 })
        + T(460, 136, '(전체는 D²)', { a: 'start', s: 11 }) + T(460, 154, 'R ≪ D', { a: 'start', s: 11 });
      return FK.fig(560, 228, 'LoRA', s,
        R`사전 학습 가중치 $\mathbf W_0$는 얼려 두고, 얇은 두 행렬 $\mathbf A\in\mathbb R^{D\times R}$, $\mathbf B\in\mathbb R^{R\times D}$(칠한 상자)만 학습합니다. 출력은 $\mathbf X\mathbf W_0+\mathbf X\mathbf A\mathbf B$이고, 갱신 $\mathbf A\mathbf B$의 계수는 $R$ 이하입니다. 학습 모수는 $D^2$ 대신 $2DR$개입니다(슬라이드 59).`);
    },
    // 12.4.1 vision transformer for classification (slide 66)
    vit() {
      let s = '';
      // the image cut into a 4×4 grid of patches
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += FK.R(18 + j * 21, 168 + i * 21, 18, 18, (i * 3 + j * 5) % 4 === 0 ? 'rg hl' : 'rg');
      s += T(58, 268, '영상 → 16 패치', { s: 11 }) + up(106, 210, 236, 226);
      const cols = [[200, '⟨class⟩'], [280, '패치 1'], [360, '패치 2'], [510, '패치 16']];
      cols.forEach(([x, lab], k) => {
        if (k) s += bx(x - 32, 226, 64, 22, '펴기', 'bm', 10) + up(x, 226, x, 210);
        else s += T(x, 241, lab, { s: 11 }) + up(x, 230, x, 210);
        s += bx(x - 36, 172, 72, 38, k ? 'E·vec + r_n' : 'emb + r_0', 'bm', 10) + up(x, 172, x, 137);
        if (k) s += T(x, 262, lab, { s: 10 });
      });
      s += T(437, 192, '…', { c: 'em' })
        + bx(164, 97, 380, 40, '트랜스포머 인코더 (L층)', 'bm2') + up(200, 97, 200, 76)
        + bx(172, 52, 56, 24, 'LSM', 'bm', 11) + up(200, 52, 200, 32) + T(200, 24, 'c (클래스)', { c: 'lb', s: 11 })
        + T(420, 64, '학습된 위치 임베딩 r_n', { s: 11 }) + T(420, 80, '을 패치마다 더함', { s: 11 });
      return FK.fig(560, 276, '비전 트랜스포머', s,
        R`영상을 겹치지 않는 패치로 자르고(여기서는 16개), 패치마다 펴서 선형 임베딩 $\mathbf E$로 $D$차원 토큰을 만든 뒤 학습된 위치 임베딩 $\mathbf r_n$을 더합니다. 맨 앞의 ⟨class⟩ 토큰 출력에 LSM을 붙여 클래스 $\mathbf c$를 냅니다(슬라이드 66). $224\times224$ 영상을 $16\times16$ 패치로 자르면 토큰은 196개입니다.`);
    },
    // 12.4.2 vector quantization: the worked example (left) and a codebook of four vectors (right)
    vq() {
      const cb = [[0, 0], [1, 1], [2, 0]], xp = [1.2, 0.4];
      const left = { w: 270, h: 240, x: [-0.6, 2.6], y: [-0.7, 1.7], m: [22, 8, 22, 26], title: '(a) 예제 17의 코드북', xt: [[1, '1'], [2, '2']], yt: [[1, '1']],
        c: [{ pts: [[1, -0.7], [1, 0]], c: 'dm ds' }, { pts: [[1, 0], [-0.6, 1.6]], c: 'dm ds' }, { pts: [[1, 0], [2.6, 1.6]], c: 'dm ds' }],
        extra: (X, Y) => cb.map(([u, v], k) => FK.C(X(u), Y(v), 7, 'sv') + FK.dot(X, Y, u, v) + T(X(u) + 10, Y(v) - 8, `c_${k + 1}`, { a: 'start', c: 'it' })).join('')
          + FK.L(X(xp[0]), Y(xp[1]), X(1), Y(1), 'ld') + FK.dot(X, Y, xp[0], xp[1], true) + T(X(xp[0]) + 8, Y(xp[1]) + 14, 'x', { a: 'start', c: 'it' }) };
      const r = MF.rng(15), C4 = [[-1, -0.6], [1.1, -0.9], [0.1, 1.0], [1.6, 1.1]], pts = [];
      C4.forEach(([u, v]) => { for (let k = 0; k < 9; k++) pts.push([u + 0.38 * MF.normal(r), v + 0.32 * MF.normal(r)]); });
      const near = ([u, v]) => C4.reduce((b, c, k) => ((u - c[0]) ** 2 + (v - c[1]) ** 2 < (u - C4[b][0]) ** 2 + (v - C4[b][1]) ** 2 ? k : b), 0);
      const right = { ox: 280, w: 280, h: 240, x: [-2, 2.7], y: [-1.9, 2], m: [22, 8, 22, 18], title: '(b) K = 4: 가장 가까운 대표로', xt: [], yt: [], axes: false,
        extra: (X, Y) => pts.map((p) => { const k = near(p); return FK.L(X(p[0]), Y(p[1]), X(C4[k][0]), Y(C4[k][1]), 'dm') + FK.dot(X, Y, p[0], p[1], k % 2 === 1); }).join('')
          + C4.map(([u, v], k) => FK.C(X(u), Y(v), 8, 'sv') + T(X(u) + 11, Y(v) - 9, `${k + 1}`, { a: 'start', c: 'em' })).join('') };
      return FK.G2(560, 240, '벡터 양자화', [left, right],
        R`(a) 점선은 세 코드북 벡터의 영역 경계(수직이등분선)입니다. $\mathbf x=(1.2,0.4)$는 $\mathbf c_2$의 영역에 있어 토큰 2가 됩니다. (b) 연속 벡터(점)마다 가장 가까운 코드북 벡터(동그라미)로 선을 그었습니다. 벡터는 그 번호 1–4 하나로 바뀌고, 자기회귀 트랜스포머는 이 번호의 서열을 단어처럼 모델링합니다.`);
    },
    // 12.3.2 beam search with beam width B = 2 over the vocabulary {A, B, C} (교재 텍스트, 예제 12와 같은 생각)
    beam() {
      let s = '';
      const node = (x, y, lab, p, keep, w = 84) => FK.R(x - w / 2, y - 13, w, 26, keep ? 'bm2' : 'bm') + T(x, y + 4, `${lab}  ${p}`, { s: 11, c: keep ? 'em' : '' });
      const edge = (x1, y1, x2, y2, q, keep) => FK.L(x1, y1, x2, y2, keep ? 'ld' : 'dm ds') + T((x1 + x2) / 2, (y1 + y2) / 2 - 5, q, { s: 10 });
      s += FK.R(14, 112, 72, 26, 'bm') + T(50, 129, '⟨start⟩', { s: 11 });
      [[55, 'A', '0.5', 1], [125, 'B', '0.4', 1], [195, 'C', '0.1', 0]].forEach(([y, l, p, k]) => { s += edge(86, 125, 158, y, p, k) + node(200, y, l, p, k, 76); });
      [[25, 55, 'A A', '0.25', '0.5', 1], [80, 55, 'A C', '0.15', '0.3', 0], [150, 125, 'B A', '0.36', '0.9', 1], [205, 125, 'B B', '0.02', '0.05', 0]].forEach(([y, y0, l, p, q, k]) => { s += edge(238, y0, 316, y, q, k) + node(360, y, l, p, k); });
      s += T(200, 232, '1단계: 3개 중 2개 남김', { s: 10 }) + T(360, 232, '2단계: 후보 B² = 4개 중 2개', { s: 10 });
      s += T(418, 40, '빔 너비 B = 2', { a: 'start', c: 'em' })
        + T(418, 66, '가설마다 상위 2개 토큰', { a: 'start', s: 11 }) + T(418, 82, '→ 서열 확률 상위 2개만', { a: 'start', s: 11 })
        + T(418, 124, '탐욕: A → A', { a: 'start', s: 11, c: 'rl' }) + T(418, 140, '확률 0.25', { a: 'start', s: 11 })
        + T(418, 176, '빔: B → A', { a: 'start', s: 11, c: 'lb' }) + T(418, 192, '확률 0.36', { a: 'start', s: 11 });
      return FK.fig(560, 244, '빔 탐색', s,
        R`빔 너비 $B=2$, 어휘 $\{A,B,C\}$인 빔 탐색입니다. 칠한 상자는 남긴 가설, 흰 상자는 버린 후보이고, 상자 안의 수는 서열 전체의 확률(조건부 확률의 곱), 선 위의 수는 그 단계의 조건부 확률입니다. 첫 단계에서 $A$와 $B$를 남기고, 둘째 단계에서는 가설마다 상위 두 토큰을 붙인 후보 $B^2=4$개 중 확률이 큰 둘만 남깁니다. 탐욕 탐색은 첫 단계의 최선 $A$를 고른 뒤 $(A,A)=0.25$에 머물지만, 빔 탐색은 첫 단계에서 2등이던 $B$를 살려 두어 $(B,A)=0.36$을 찾습니다.`);
    },
    // 12.4.2 raster-scan order and autoregressive image generation (교재 그림 12.23–12.24를 다시 그림)
    raster() {
      let s = '';
      const c = 38, a0 = 36, b0 = 330, y0 = 34;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const n = 4 * i + j + 1;
        s += FK.R(a0 + j * c, y0 + i * c, c, c, 'bm') + T(a0 + j * c + c / 2, y0 + i * c + 16, String(n), { s: 11 });
        s += FK.R(b0 + j * c, y0 + i * c, c, c, n < 7 ? 'rg hl' : 'bm') + (n < 7 ? FK.R(b0 + j * c, y0 + i * c, c, c, 'sv') : '');
      }
      for (let i = 0; i < 4; i++) {
        const y = y0 + i * c + c - 8;
        s += FK.A(a0 + 6, y, a0 + 4 * c - 6, y, 'ld', 6);
      }
      s += FK.R(b0 + 2 * c, y0 + c, c, c, 'th') + T(b0 + 2.5 * c, y0 + 1.5 * c + 5, '?', { c: 'em', s: 14 });
      s += T(a0 + 2 * c, 20, '(a) 래스터 주사 순서', { c: 'em' }) + T(b0 + 2 * c, 20, '(b) 한 화소씩 생성', { c: 'em' })
        + T(b0 + 2 * c, y0 + 4 * c + 22, 'x_7 ~ p(x_7 | x_1, …, x_6)', { c: 'it' })
        + T(a0 + 2 * c, y0 + 4 * c + 22, 'p(x) = ∏ p(x_n | x_1, …, x_n−1)', { c: 'it', s: 12 });
      return FK.fig(560, 222, '래스터 주사와 자기회귀 영상 생성', s,
        R`(a) 래스터 주사: 첫 행을 왼쪽에서 오른쪽으로 지난 뒤 다음 행으로 내려가며 화소에 번호 $1,\dots,16$을 붙입니다. 이 순서를 정하면 영상의 분포를 $p(\mathbf x_1,\dots,\mathbf x_N)=\prod_np(\mathbf x_n\mid\mathbf x_1,\dots,\mathbf x_{n-1})$로 쓸 수 있습니다. (b) 생성도 이 순서대로 합니다. 칠한 여섯 칸은 이미 뽑은 화소이고, 굵은 칸(7번)은 앞 여섯 화소에 조건화한 분포에서 뽑을 차례입니다.`);
    },
    // 12.1 dynamic attention (slides 5–6): the same word "bank" spreads its attention differently in two sentences
    dynattn() {
      const rows = [
        { y: 92, toks: [['I', 0.03], ['swam', 0.22], ['across', 0.05], ['the', 0.02], ['river', 0.4], ['to', 0.02], ['get', 0.04], ['to', 0.02], ['the', 0.03], ['other', 0.07], ['bank', 0.1]] },
        { y: 204, toks: [['I', 0.03], ['walked', 0.06], ['across', 0.03], ['the', 0.02], ['road', 0.07], ['to', 0.02], ['get', 0.08], ['cash', 0.45], ['from', 0.05], ['the', 0.04], ['bank', 0.15]] },
      ];
      let s = '';
      rows.forEach(({ y, toks }, r) => {
        const ws = toks.map(([t]) => 10 + 6.6 * t.length), tot = ws.reduce((a, b) => a + b, 0) + 5 * (toks.length - 1);
        let x = (560 - tot) / 2;
        const cx = toks.map((_, k) => { const c = x + ws[k] / 2; x += ws[k] + 5; return c; });
        const bx = cx[cx.length - 1];
        toks.forEach(([t, a], k) => {
          if (k < toks.length - 1) {
            const d = bx - cx[k], h = 22 + 0.3 * d;
            s += `<path class="ld" style="stroke-width:${FK.f1(0.6 + 9 * a)};stroke-opacity:${FK.f1(0.35 + 1.5 * a)}" d="M${FK.f1(bx - 4)},${y} Q${FK.f1((bx + cx[k]) / 2)},${FK.f1(y - h)} ${FK.f1(cx[k])},${y}"/>`;
          }
          s += FK.R(cx[k] - ws[k] / 2, y, ws[k], 22, a >= 0.2 ? 'rg hl' : k === toks.length - 1 ? 'bm2' : 'bm') + T(cx[k], y + 15, t, { s: 11, c: k === toks.length - 1 ? 'rl' : a >= 0.2 ? 'em' : '' })
            + T(cx[k], y + 35, a.toFixed(2), { s: 9, c: a >= 0.2 ? 'lb' : '' });
        });
        s += T(14, y - 52, r ? '문장 2' : '문장 1', { a: 'start', c: 'em' });
      });
      return FK.fig(560, 246, '같은 단어, 다른 어텐션', s,
        R`두 문장에서 마지막 단어 bank를 새로 표현할 때 다른 토큰에 주는 어텐션 가중치 $a_{nm}$입니다(선의 굵기와 상자 아래 수, 설명을 위한 예시 값으로 합은 1). 문장 1에서는 swam과 river에, 문장 2에서는 cash에 가중치가 몰립니다. 가중치는 학습 뒤 고정된 연결이 아니라 입력 문장마다 새로 계산되므로, 같은 bank가 문장 1에서는 “강둑”, 문장 2에서는 “은행” 쪽의 표현을 얻습니다. 멀리 떨어진 단어도 선 하나로 바로 이어지므로 장거리 의존성을 잡을 수 있습니다(슬라이드 5–6).`);
    },
    // 12.1 contextual embedding (slide 7): a fixed word vector vs. the vector of "bank" after self-attention in "river bank"
    ctxemb() {
      const W = [['nature', 5.6, 8.4], ['river', 7.6, 7.5], ['water', 8.2, 5.6], ['money', 0.6, 3.1], ['deposit', 1.6, 1.6], ['withdraw', 2.6, 0.9]];
      const b0 = [4.4, 4.6], b1 = [6.7, 6.5];
      const panel = (ox, title, moved) => ({ ox, w: 280, h: 250, x: [0, 10], y: [0, 10], m: [22, 10, 22, 26], title, xt: [[5, '5'], [10, '10']], yt: [[5, '5'], [10, '10']],
        extra: (X, Y) => W.map(([t, u, v]) => FK.dot(X, Y, u, v) + T(X(u) + 6, Y(v) - 6, t, { a: 'start', s: 11 })).join('')
          + (moved
            ? FK.dot(X, Y, b0[0], b0[1], true) + T(X(b0[0]) + 6, Y(b0[1]) + 14, '원래 자리', { a: 'start', s: 10 }) + FK.A(X(b0[0]) + 3, Y(b0[1]) - 3, X(b1[0]) - 3, Y(b1[1]) + 3, 'ld ds', 7)
              + FK.dot(X, Y, b1[0], b1[1], true) + T(X(b1[0]) - 8, Y(b1[1]) + 4, 'bank', { a: 'end', c: 'rl' })
            : FK.dot(X, Y, b0[0], b0[1], true) + T(X(b0[0]) + 6, Y(b0[1]) - 6, 'bank', { a: 'start', c: 'rl' })) });
      return FK.G2(560, 250, '문맥 임베딩', [panel(0, '(a) 문맥 없는 단어 임베딩', false), panel(280, '(b) 셀프 어텐션 뒤 (river bank)', true)],
        R`(a) 단어마다 벡터 하나를 고정해 주는 보통의 단어 임베딩에서는 bank가 돈 쪽 단어(money, deposit, withdraw)와 강 쪽 단어(river, water, nature) 사이 어중간한 곳에 놓입니다. 두 뜻이 한 벡터에 섞여 있기 때문입니다. (b) “river bank” 문장에서 셀프 어텐션을 거친 bank의 문맥 임베딩은 river와 water 쪽으로 옮겨 갑니다. “financial bank” 문장이었다면 money 쪽으로 옮겨 갔을 것입니다. 좌표는 개념을 보이려고 2차원에 그린 예시입니다(슬라이드 7).`);
    },
    // 12.1.9 heat map of the sinusoidal position-encoding vectors (slide 25, right panel), one column per position
    posheat() {
      const D = 48, Lc = 30, N = 100, cw = 4.4, ch = 3.6, x0 = 66, y0 = 34, Q = 6, f1 = FK.f1;
      const r = (n, i) => (i % 2 ? Math.cos(n / Math.pow(Lc, (i - 1) / D)) : Math.sin(n / Math.pow(Lc, i / D)));
      // one path per sign and shade level keeps the 4,800 cells to a dozen elements
      const P = {};
      for (let i = 0; i < D; i++) for (let n = 0; n < N; n++) {
        const v = r(n, i), k = Math.round(Math.abs(v) * Q);
        if (!k) continue;
        const key = (v > 0 ? 'vlh' : 'rxh') + k;
        P[key] = (P[key] || '') + `M${f1(x0 + n * cw)},${f1(y0 + i * ch)}h${cw}v${ch}h-${cw}z`;
      }
      let s = Object.entries(P).map(([key, d]) => `<path class="${key.slice(0, 3)}" style="fill-opacity:${f1((+key.slice(3)) / Q * 100) / 100}" d="${d}"/>`).join('');
      s += FK.R(x0, y0, N * cw, D * ch, 'sv') + FK.R(x0 + 12 * cw, y0 - 3, cw, D * ch + 6, 'sv') + T(x0 + 12.5 * cw, y0 - 9, 'r_12', { c: 'it', s: 12 });
      [0, 20, 40, 60, 80, 100].forEach((n) => { s += FK.L(x0 + n * cw, y0 + D * ch, x0 + n * cw, y0 + D * ch + 4, 'ax') + T(x0 + n * cw, y0 + D * ch + 17, String(n), { s: 11 }); });
      s += T(x0 + N * cw, y0 + D * ch + 34, '위치 n →', { a: 'end', s: 11 }) + T(x0 - 8, y0 + 9, 'i = 0', { a: 'end', s: 11 }) + T(x0 - 8, y0 + D * ch, 'i = 47', { a: 'end', s: 11 })
        + T(x0 - 8, y0 + (D * ch) / 2 + 4, '차원 i ↓', { a: 'end', s: 11 });
      s += FK.R(x0 + N * cw + 12, y0 + 20, 12, 12, 'vlh') + T(x0 + N * cw + 28, y0 + 30, '+1', { a: 'start', s: 11 })
        + FK.R(x0 + N * cw + 12, y0 + 44, 12, 12, 'rxh') + T(x0 + N * cw + 28, y0 + 54, '−1', { a: 'start', s: 11 });
      return FK.fig(560, 250, '위치 부호화 벡터의 열지도', s,
        R`$D=48$, $L=30$일 때 처음 100개 위치의 사인파 위치 부호화를 열지도로 그렸습니다(슬라이드 25는 $D=100$, $L=30$으로 200개 위치). 세로 한 줄이 위치 $n$ 하나의 벡터 $\mathbf r_n$이고(굵은 테두리는 $\mathbf r_{12}$), 양수와 음수를 서로 다른 색으로, 절댓값이 클수록 진하게 칠했습니다. 위쪽 행(작은 $i$)은 위치에 따라 빠르게, 아래쪽 행은 아주 천천히 바뀝니다. 그래서 어느 두 줄도 무늬가 같지 않아 위치가 구별되고(유일), 모든 값이 $[-1,1]$ 안에 있으며(유계), 위치가 더 길어져도 같은 식으로 계속 만들 수 있습니다.`);
    },
    // 12.2.3–12.2.4 graphical models of the sequence models (slides 33, 35–36)
    seqgm() {
      const rN = 14, f1 = FK.f1;
      const node = (x, y, lab, obs = true) => FK.C(x, y, rN, obs ? 'bm2' : 'nd') + T(x, y + 4, lab, { c: 'it', s: 12 });
      const link = (x1, y1, x2, y2) => MF.link(x1, y1, x2, y2, rN, rN, 'ax', 6);
      // curved arrow above a row of nodes, from the node at x1 to the node at x2
      const arc = (x1, x2, y, h) => {
        const a = [x1 + 0.34 * rN, y - 0.94 * rN], b = [x2 - 0.34 * rN, y - 0.94 * rN], c = [(x1 + x2) / 2, y - h];
        const tx = b[0] - c[0], ty = b[1] - c[1], l = Math.hypot(tx, ty);
        return FK.P(`M${f1(a[0])},${f1(a[1])} Q${f1(c[0])},${f1(c[1])} ${f1(b[0])},${f1(b[1])}`, 'ax') + FK.A(b[0] - (8 * tx) / l, b[1] - (8 * ty) / l, b[0], b[1], 'ax', 6);
      };
      let s = '';
      // (a) bag of words
      const xa = [45, 105, 165, 225];
      xa.forEach((x, k) => { s += node(x, 70, `x_${k + 1}`); });
      s += T(135, 20, '(a) 단어 주머니', { c: 'em' }) + T(135, 118, 'p(x_1, …, x_N) = ∏ p(x_n)', { c: 'it', s: 12 });
      // (b) full autoregressive factorization
      const xb = [325, 385, 445, 505];
      xb.forEach((x, k) => { s += node(x, 80, `x_${k + 1}`); if (k) s += link(xb[k - 1], 80, x, 80); });
      s += arc(xb[0], xb[2], 80, 46) + arc(xb[1], xb[3], 80, 46) + arc(xb[0], xb[3], 80, 80);
      s += T(415, 20, '(b) 자기회귀 분해 (근사 없음)', { c: 'em' }) + T(415, 118, 'p(x_n | x_1, …, x_n−1)', { c: 'it', s: 12 });
      // (c) trigram: second-order Markov
      const xc = [35, 87, 139, 191, 243];
      xc.forEach((x, k) => { s += node(x, 222, `x_${k + 1}`); if (k) s += link(xc[k - 1], 222, x, 222); if (k > 1) s += arc(xc[k - 2], x, 222, 44); });
      s += T(135, 160, '(c) 트라이그램 (2차 마르코프)', { c: 'em' }) + T(135, 262, 'p(x_n | x_n−1, x_n−2)', { c: 'it', s: 12 });
      // (d) hidden Markov model
      const xd = [[325, 'z_1', 'x_1'], [385, 'z_2', 'x_2'], [445, 'z_3', 'x_3'], [515, 'z_N', 'x_N']];
      xd.forEach(([x, z, o], k) => {
        s += node(x, 198, z, false) + node(x, 248, o) + link(x, 198, x, 248);
        if (k && k < 3) s += link(xd[k - 1][0], 198, x, 198);
      });
      s += FK.L(445 + rN, 198, 470, 198, 'ax') + T(480, 202, '…', { c: 'em' }) + FK.A(490, 198, 515 - rN, 198, 'ax', 6);
      s += T(415, 160, '(d) 은닉 마르코프 모델', { c: 'em' }) + T(415, 284, 'p(z_n | z_n−1) p(x_n | z_n)', { c: 'it', s: 12 });
      s += FK.L(280, 14, 280, 286, 'dm ds') + FK.L(10, 140, 550, 140, 'dm ds');
      return FK.fig(560, 292, '서열 모델의 그래프 모형', s,
        R`화살표는 “이 변수가 저 변수의 조건부 분포에 들어간다”는 뜻이고, 칠한 원은 관측되는 토큰, 흰 원은 잠재 상태입니다. (a) 단어 주머니: 연결선이 하나도 없어 단어들이 서로 독립이고 순서가 무시됩니다. (b) 자기회귀 분해: 각 단어에 앞의 모든 단어에서 화살표가 들어옵니다. 곱의 규칙만 쓴 정확한 분해지만 조건부 표가 서열 길이에 대해 지수적으로 커집니다. (c) 트라이그램: 바로 앞 두 단어에서만 화살표가 들어와 표가 작아지는 대신 창 밖의 정보는 버립니다. (d) HMM: 잠재 상태의 사슬 $\mathbf z_1\to\mathbf z_2\to\cdots$가 과거를 요약하고 관측 $\mathbf x_n$은 $\mathbf z_n$에서만 나옵니다. 먼 관측의 정보는 사슬을 여러 번 거쳐야 하므로 점점 흐려집니다(슬라이드 33, 35–36).`);
    },
    // 12.3.2 token probabilities along beam-search text and human text (slide 49, after Holtzman et al. 2019)
    beamhuman() {
      const r = MF.rng(49), beam = [], human = [];
      for (let n = 0; n <= 100; n++) {
        const dip = [22, 23, 47, 48, 71, 96].includes(n);
        beam.push([n, dip ? 0.72 + 0.12 * r() : 0.96 + 0.035 * r()]);
        const u = r(), w = r();
        human.push([n, u < 0.3 ? 0.55 + 0.45 * w : 0.3 * Math.pow(w, 1.5)]);
      }
      return FK.G({ w: 560, h: 240, x: [0, 100], y: [0, 1.05], m: [24, 112, 40, 40], label: '빔 탐색과 사람이 쓴 글의 토큰 확률', title: '각 위치에서 쓰인 토큰이 모델 분포에서 가진 확률',
        xt: [[0, '0'], [20, '20'], [40, '40'], [60, '60'], [80, '80'], [100, '100']], yt: [[0.5, '0.5'], [1, '1']],
        c: [{ pts: human, c: 'rx' }, { pts: beam, c: 'ld' }],
        extra: (X, Y) => FK.legend(X(100) + 14, Y(0.85), [['ld', '빔 탐색'], ['rx', '사람의 글']]) + T(X(50), Y(0) + 32, '토큰 위치 (생성 단계)', { s: 11 }),
        cap: R`같은 학습된 언어 모델에 같은 첫 문장을 주고, 빔 탐색이 이어 쓴 글과 사람이 실제로 이어 쓴 글에서 각 위치의 토큰이 모델의 다음 토큰 분포에서 가졌던 확률을 비교한 그래프입니다(슬라이드 49, 원 그림은 Holtzman 등 2019, 교재 그림 12.17; 여기 값은 모양을 본뜬 예시). 빔 탐색은 거의 매번 확률이 1에 가까운 토큰만 고르지만, 사람의 글은 확률이 낮은 토큰을 자주 씁니다. 사람은 “가장 그럴듯한 단어”만 고르지 않으므로, 확률이 큰 쪽만 고르는 탐욕·빔 탐색은 사람 글보다 단조롭고 같은 말을 되풀이하기 쉽습니다. 그래서 다양성을 주는 표본 추출(top-$K$, top-$p$, 온도)을 씁니다.` });
    },
    // 12.4.4 VALL-E: text prompt tokens + acoustic prompt tokens → transformer → speech tokens → audio decoder (slide 75)
    valle() {
      let s = '';
      const wave = (cx, cy, n, a) => {
        let w = '';
        for (let k = 0; k < n; k++) { const h = a * (0.2 + 0.8 * Math.abs(Math.sin(k * 1.7) * Math.cos(k * 0.37))); w += FK.L(cx + (k - (n - 1) / 2) * 4, cy - h, cx + (k - (n - 1) / 2) * 4, cy + h, 'gd'); }
        return w;
      };
      const tok = (x, y, cls) => FK.R(x - 8, y, 16, 16, cls);
      s += bx(30, 120, 500, 30, '트랜스포머', 'bm2');
      [50, 85, 120, 155, 190].forEach((x) => { s += tok(x, 166, 'bm') + up(x, 166, x, 151); });
      [245, 280, 315].forEach((x) => { s += tok(x, 166, 'rg hl') + up(x, 166, x, 151) + up(x, 202, x, 183); });
      s += T(120, 200, '텍스트 프롬프트 토큰', { s: 11 }) + T(120, 215, '(무엇을 말할지)', { s: 10, c: 'lb' })
        + bx(228, 202, 104, 26, '이산 토크나이저', 'bm', 11) + up(280, 244, 280, 229) + wave(280, 252, 13, 7)
        + T(280, 276, '음향 프롬프트: 새 화자의 몇 초 (누구 목소리로)', { s: 10, c: 'lb' });
      [370, 405, 440, 475, 510].forEach((x) => { s += up(x, 120, x, 103) + tok(x, 86, 'rg hl') + up(x, 86, x, 71); });
      s += bx(358, 45, 164, 26, '오디오 디코더', 'bm', 11) + up(440, 45, 440, 32) + wave(440, 20, 21, 9) + T(352, 24, '합성 음성', { a: 'end', s: 11 })
        + T(30, 60, '출력: 음성 토큰을 하나씩 생성', { a: 'start', s: 11, c: 'em' }) + T(30, 78, '(학습 때는 목표 음성 토큰을 맞힘)', { a: 'start', s: 11 });
      return FK.fig(560, 284, 'VALL-E의 구조', s,
        R`트랜스포머 기반 음성 합성(TTS) VALL-E의 큰 구조입니다(위치 부호화와 선형 투영은 생략, 슬라이드 75). 입력 서열은 말할 내용을 정하는 텍스트 토큰(흰 칸)과, 화자의 짧은 음성(음향 프롬프트)을 이산 토크나이저(벡터 양자화 코드북)로 바꾼 음성 토큰(칠한 칸)을 이어 붙인 것입니다. 트랜스포머는 이 둘에 조건화해 출력 음성 토큰을 자기회귀로 하나씩 만들고(학습 때는 같은 화자의 목표 음성 토큰을 맞히도록 학습), 오디오 디코더가 같은 코드북으로 토큰을 다시 파형으로 바꿉니다. 많은 화자로 학습해 두면 추론 때 새 화자의 몇 초짜리 음성만으로 그 목소리를 흉내 냅니다.`);
    },
  });
})();
