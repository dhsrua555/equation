/* 20 LSTM과 RNN의 응용 — 본문 그림 (9주차 수요일 슬라이드 20–22, 26–32를 다시 그림) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const box = (x, y, w, h, t, sub, hl) => FK.R(x, y, w, h, hl ? 'bm2' : 'bm') + FK.T(x + w / 2, y + (sub ? h / 2 - 1 : h / 2 + 4), t, { s: 11, c: 'em' }) + (sub ? FK.T(x + w / 2, y + h / 2 + 12, sub, { s: 10 }) : '');
  const up = (x1, y1, x2, y2) => FK.A(x1, y1, x2, y2, 'ax', 7);
  const node = (x, y, t) => FK.C(x, y, 10, 'nd') + FK.T(x, y + 4, t, { c: 'em' });

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 20.1 the LSTM cell (slides 20–21)
    lstmcell() {
      const yc = 70, yg = 170, yb = 236;
      let s = FK.R(95, 45, 380, 210, 'bm');
      // cell path on top: c_{t-1} → ×f → + → c_t
      s += FK.A(30, yc, 189, yc, 'ld') + node(200, yc, '×') + FK.A(210, yc, 269, yc, 'ld') + node(280, yc, '+') + FK.A(290, yc, 522, yc, 'ld')
        + FK.T(30, yc - 8, 'c_{t−1}', { a: 'start', c: 'it' }) + FK.T(528, yc + 4, 'c_t', { a: 'start', c: 'it' });
      // gradient highway above the cell
      s += FK.A(520, 30, 40, 30, 'rx', 8) + FK.T(280, 22, '역전파: 셀 경로에는 f만 곱해진다', { s: 11, c: 'rl' });
      // gates
      const G = [['f', 'σ', 180], ['i', 'σ', 235], ['g', 'tanh', 285], ['o', 'σ', 340]];
      G.forEach(([t, a, x]) => { s += box(x, yg, 40, 34, t, a, t === 'g') + up(x + 20, yb, x + 20, yg + 36); });
      s += up(200, yg, 200, yc + 11);
      s += node(280, 120, '×') + up(255, yg, 273, 129) + up(305, yg, 287, 129) + up(280, 110, 280, yc + 11);
      // tanh(c_t) and the output gate
      s += up(420, yc, 420, 104) + box(398, 106, 44, 24, 'tanh') + up(420, 130, 420, 159) + node(420, yg, '×') + up(380, yg + 12, 410, yg + 4)
        + FK.A(430, yg, 522, yg, 'ld') + FK.T(528, yg + 4, 'h_t', { a: 'start', c: 'it' });
      // inputs: h_{t-1} and x_t stacked and multiplied by W
      s += FK.L(150, yb, 360, yb, 'ld') + FK.A(30, yb, 139, yb, 'ld') + node(150, yb, 'W') + FK.A(150, 292, 150, yb + 11, 'ld')
        + FK.T(30, yb - 8, 'h_{t−1}', { a: 'start', c: 'it' }) + FK.T(160, 290, 'x_t', { a: 'start', c: 'it' });
      return FK.fig(560, 300, 'LSTM 셀', s,
        R`LSTM 셀(슬라이드 20–21). 아래에서 $h_{t-1}$과 $x_t$를 쌓아 $W$를 곱하고, 네 갈래에 $\sigma,\sigma,\tanh,\sigma$를 적용해 $f,i,g,o$를 만듭니다(채운 상자 $g$는 게이트가 아닌 후보). 위쪽의 셀 경로에서 $c_{t-1}$은 $f$와 곱해지고(×) $i\odot g$가 더해져(+) $c_t$가 되며, $\tanh(c_t)$에 $o$를 곱한 것이 $h_t$입니다. 빨간 화살표: 역전파 때 셀 경로를 따라서는 $f$만 곱해집니다.`);
    },
    // 20.4 the language model unrolled: training feeds the true tokens, inference feeds back its own samples (slides 28–31)
    lmunroll() {
      const IN = ['<SOS>', 'A', 'Man', 'is', 'holding'], OUT = ['A', 'Man', 'is', 'holding', 'a'];
      let s = FK.T(280, 18, '학습: 칸마다 교차 엔트로피를 더한다', { s: 11, c: 'rl' });
      IN.forEach((w, k) => {
        const x = 30 + k * 104, cx = x + 40;
        s += box(x, 112, 80, 32, 'LSTM') + up(cx, 206, cx, 146) + up(cx, 112, cx, 62)
          + FK.T(cx, 222, w, { s: 11 }) + FK.T(cx, 50, OUT[k], { s: 11, c: 'em' }) + FK.T(cx, 236, 'x_' + k, { s: 10, c: 'it' }) + FK.T(cx, 34, 'x̂_' + (k + 1), { s: 10, c: 'it' });
        if (k < 4) {
          s += FK.A(x + 80, 128, x + 102, 128, 'ld', 7);
          const g = x + 92, nx = cx + 104;
          s += FK.P(`M${cx + 14},56 C${g},56 ${g},200 ${nx - 16},200`, 'dm ds') + FK.A(nx - 20, 200, nx - 6, 200, 'dm', 6);
        }
      });
      s += FK.T(30, 262, '학습: 아래 칸의 입력은 정답 토큰 (교사 강요)', { a: 'start', s: 11 })
        + FK.T(30, 278, '추론: 점선처럼 뽑은 토큰을 다음 입력으로 되먹이고 <EOS>에서 멈춘다', { a: 'start', s: 11, c: 'lb' });
      return FK.fig(560, 290, '언어 모델의 학습과 추론', s,
        R`LSTM 언어 모델을 시간으로 펼친 그림(슬라이드 28–31). 칸 $t$는 토큰 $x_{t-1}$을 읽고 다음 토큰의 점수 $\hat x_t$를 냅니다. 학습 때는 아래 칸에 정답 토큰을 넣고(교사 강요) 모든 칸의 교차 엔트로피를 더하며, 추론 때는 칸마다 뽑은 토큰(탐욕 또는 샘플링)을 점선을 따라 다음 칸의 입력으로 되먹이고 <EOS>를 뽑으면 멈춥니다.`);
    },
    // 20.5 encoder–decoder translation (slide 32)
    encdec() {
      const EN = ['He', 'loved', 'to', 'eat', '.'], DIN = ['NULL', 'Er', 'liebte', 'zu', 'essen'], DOUT = ['Er', 'liebte', 'zu', 'essen', '.'];
      let s = FK.T(122, 28, '인코더', { c: 'em' }) + FK.T(445, 28, '디코더 (언어 모델)', { c: 'em' });
      EN.forEach((w, k) => {
        const x = 16 + k * 50, cx = x + 18;
        s += box(x, 104, 36, 30, '') + up(cx, 176, cx, 136) + FK.T(cx, 192, w, { s: 11 });
        if (k < 4) s += FK.A(x + 36, 119, x + 49, 119, 'ld', 6);
      });
      s += FK.A(252, 119, 279, 119, 'ld', 6) + node(290, 119, 's') + FK.A(300, 119, 327, 119, 'ld', 6);
      DIN.forEach((w, k) => {
        const x = 330 + k * 46, cx = x + 17;
        s += box(x, 104, 34, 30, '') + up(cx, 176, cx, 136) + up(cx, 104, cx, 66) + FK.T(cx, 192, w, { s: 10 }) + FK.T(cx, 56, DOUT[k], { s: 10, c: 'em' });
        if (k < 4) s += FK.A(x + 34, 119, x + 45, 119, 'ld', 6);
      });
      s += FK.T(445, 214, '입력: 정답을 한 칸 민 열', { s: 10 }) + FK.T(445, 42, '출력: 칸마다 소프트맥스', { s: 10 })
        + FK.T(122, 214, '입력 문장을 끝까지 읽는다', { s: 10 }) + FK.T(290, 150, '요약', { s: 10, c: 'lb' });
      return FK.fig(560, 228, '인코더-디코더 번역', s,
        R`인코더-디코더 번역(슬라이드 32). 인코더 LSTM이 “He loved to eat .”를 끝까지 읽은 마지막 상태 $\mathbf s$를 디코더의 시작 상태로 넘기고, 디코더는 NULL에서 출발하는 언어 모델로 “Er liebte zu essen .”를 한 단어씩 냅니다. 인코더 자리에 CNN을 두고 $\mathbf s$ 대신 이미지 특성을 넘기면 이미지 캡셔닝이 됩니다.`);
    },
    // 20.1 the stacked weight matrix W of an LSTM (slide 19)
    lstmstack() {
      const NM = ['i', 'f', 'o', 'g'], ACT = ['σ', 'σ', 'σ', 'tanh'];
      let s = FK.R(30, 30, 160, 160, 'bm');
      for (let k = 1; k < 4; k++) s += FK.L(30, 30 + 40 * k, 190, 30 + 40 * k, 'dm ds');
      s += FK.L(120, 30, 120, 190, 'dm ds');
      NM.forEach((n, k) => { s += FK.T(24, 54 + 40 * k, n, { a: 'end', c: 'it' }) + FK.T(75, 54 + 40 * k, 'U_' + n, { s: 11 }) + FK.T(155, 54 + 40 * k, 'W_' + n, { s: 11 }); });
      s += FK.T(110, 22, 'W: 4h × (h+d)', { c: 'em' }) + FK.T(75, 206, '앞 상태에 곱함', { s: 10 }) + FK.T(155, 206, '입력에 곱함', { s: 10 });
      s += FK.T(208, 114, '×', { s: 20, c: 'em' });
      s += FK.R(226, 60, 26, 100, 'bm') + FK.L(226, 110, 252, 110, 'dm ds') + FK.T(239, 52, '(h_{t−1}; x_t)', { s: 10 })
        + FK.T(239, 86, 'h', { s: 11 }) + FK.T(239, 140, 'x', { s: 11 }) + FK.T(239, 176, '(h+d)', { s: 10 });
      s += FK.T(272, 114, '=', { s: 20, c: 'em' });
      s += FK.R(292, 30, 26, 160, 'bm');
      for (let k = 1; k < 4; k++) s += FK.L(292, 30 + 40 * k, 318, 30 + 40 * k, 'dm ds');
      s += FK.T(305, 22, '4h', { s: 11 });
      NM.forEach((n, k) => {
        const y = 50 + 40 * k;
        s += FK.A(320, y, 372, y, 'ld', 6) + FK.R(374, y - 14, 50, 28, ACT[k] === 'tanh' ? 'bm2' : 'bm') + FK.T(399, y + 4, ACT[k], { c: 'em' })
          + FK.A(426, y, 468, y, 'ld', 6) + FK.T(478, y + 4, n, { a: 'start', c: 'it' });
      });
      s += FK.T(399, 206, '활성화', { s: 10 }) + FK.T(480, 206, '각 h개', { s: 10 });
      return FK.fig(560, 220, 'LSTM의 W 행렬', s,
        R`슬라이드 19의 그림. 행렬 $W\in\mathbb R^{4h\times(h+d)}$에 쌓은 벡터 $(h_{t-1};x_t)$를 한 번 곱하면 길이 $4h$의 벡터가 나옵니다. 위에서부터 $h$개씩 자른 네 토막에 $\sigma,\sigma,\sigma,\tanh$를 적용한 것이 $i,f,o,g$입니다. $W$의 각 토막은 왼쪽 $h$열($U$, $h_{t-1}$에 곱함)과 오른쪽 $d$열($W$, $x_t$에 곱함)로 나뉩니다.`);
    },
    // 20.3 one slot of the RNN language model (slides 26–27)
    lmstep() {
      const cells = (x, y, hot, n = 8) => { let c = ''; for (let k = 0; k < n; k++) c += FK.R(x + 16 * k, y, 16, 16, k === hot ? 'bm2' : 'bm'); return c; };
      let s = FK.T(200, 330, '<SOS>', { c: 'em' }) + FK.A(200, 320, 200, 292, 'ax', 7)
        + cells(136, 272, 2) + FK.T(290, 280, 'x_t ∈ R^n', { a: 'start', s: 11 }) + FK.T(290, 294, '원-핫 부호화', { a: 'start', s: 10 })
        + FK.A(200, 270, 200, 238, 'ax', 7) + FK.T(188, 258, 'W_e', { a: 'end', c: 'lb' })
        + FK.R(150, 218, 100, 18, 'bm') + FK.T(290, 228, 'z_t ∈ R^d', { a: 'start', s: 11 }) + FK.T(290, 242, '연속 단어 임베딩', { a: 'start', s: 10 })
        + FK.A(200, 216, 200, 170, 'ax', 7)
        + FK.R(150, 138, 100, 32, 'bm2') + FK.T(200, 159, 'LSTM', { c: 'em' })
        + FK.A(60, 154, 148, 154, 'ld', 7) + FK.T(30, 150, 'h_{t−1}', { c: 'it', s: 11 }) + FK.T(30, 166, 'c_{t−1}', { c: 'it', s: 11 })
        + FK.A(252, 154, 340, 154, 'ld', 7) + FK.T(348, 150, 'h_t', { a: 'start', c: 'it', s: 11 }) + FK.T(348, 166, 'c_t', { a: 'start', c: 'it', s: 11 }) + FK.T(348, 182, '다음 칸으로', { a: 'start', s: 10 })
        + FK.A(200, 136, 200, 100, 'ax', 7)
        + FK.R(150, 82, 100, 18, 'bm') + FK.T(290, 92, 'h_t ∈ R^d', { a: 'start', s: 11 }) + FK.T(290, 106, '연속 출력 임베딩', { a: 'start', s: 10 })
        + FK.A(200, 80, 200, 50, 'ax', 7) + FK.T(188, 70, 'W_d', { a: 'end', c: 'lb' })
        + cells(136, 30, 4) + FK.T(290, 38, 'x̂_{t+1} ∈ R^n', { a: 'start', s: 11 }) + FK.T(290, 52, '분류층 (소프트맥스)', { a: 'start', s: 10 })
        + FK.A(200, 28, 200, 14, 'ax', 6) + FK.T(200, 8, '"A"', { c: 'em', s: 11 });
      return FK.fig(560, 344, 'RNN 언어 모델의 한 칸', s,
        R`슬라이드 26–27의 한 칸. 토큰을 원-핫 $x_t$로 바꾸고, $W_e$로 연속 임베딩 $z_t=W_ex_t+b_e$로 옮겨 LSTM에 넣습니다. LSTM이 낸 $h_t$에 $W_d$를 곱해 어휘 전체의 점수 $\hat x_{t+1}=W_dh_t+b_d$를 얻고, 소프트맥스 뒤 가장 큰 칸이 다음 토큰입니다(여기서는 &lt;SOS&gt; 다음의 “A”). $h_t,c_t$는 옆으로 다음 칸에 넘어갑니다.`);
    },
    // 20.4 greedy vs probabilistic decoding (slide 30); the probabilities are an illustrative example
    sampling() {
      const p = [0.45, 0.25, 0.15, 0.08, 0.05, 0.02];
      const panel = (x0, greedy) => {
        let s = FK.L(x0, 180, x0 + 6 * 34 + 6, 180, 'ax');
        p.forEach((v, k) => {
          const h = v * 300, x = x0 + 6 + k * 34;
          s += FK.R(x, 180 - h, 24, h, greedy && k === 0 ? 'bm2' : 'bm') + FK.T(x + 12, 176 - h, v.toFixed(2), { s: 10 }) + FK.T(x + 12, 196, String(k + 1), { s: 10 });
        });
        return s;
      };
      let s = panel(30, true) + panel(310, false);
      s += FK.T(130, 22, '탐욕 (결정적)', { c: 'em' }) + FK.T(130, 38, 'x_t = argmax S(x_t)', { s: 11, c: 'it' })
        + FK.A(60, 52, 60, 62, 'rx', 5) + FK.T(130, 214, '늘 1번 토큰', { s: 11, c: 'rl' })
        + FK.T(410, 22, '확률적', { c: 'em' }) + FK.T(410, 38, 'x_t ~ S(x_t)', { s: 11, c: 'it' })
        + FK.T(410, 214, '확률대로 뽑는다 (0.45로 1번, 0.25로 2번 …)', { s: 11, c: 'lb' });
      return FK.fig(560, 226, '탐욕 디코딩과 확률적 샘플링', s,
        R`슬라이드 30. 한 칸이 낸 점수 $S(x_t)$(소프트맥스 확률, 막대 높이)에서 다음 토큰을 고르는 두 방법입니다. 탐욕은 항상 가장 높은 막대(채운 막대)를 고르고, 확률적 방법은 막대의 높이에 비례한 확률로 고릅니다. 수치는 설명을 위한 예입니다.`);
    },
    // 20.5 image captioning = CNN encoder + LSTM decoder (slide 34)
    caption() {
      const IN = ['<SOS>', 'man', 'in', 'black'], OUT = ['man', 'in', 'black', 'shirt'];
      let s = FK.R(14, 70, 70, 56, 'bm') + FK.T(49, 94, '이미지', { c: 'em' }) + FK.T(49, 112, 'x', { c: 'it' })
        + FK.A(86, 98, 108, 98, 'ld', 6) + FK.R(110, 70, 74, 56, 'bm2') + FK.T(147, 94, 'CNN', { c: 'em' }) + FK.T(147, 112, 'g_φ', { c: 'it' })
        + FK.A(186, 98, 208, 98, 'ld', 6) + FK.R(210, 82, 18, 32, 'bm') + FK.T(219, 134, '특성', { s: 10 })
        + FK.A(230, 98, 258, 98, 'ld', 6);
      IN.forEach((w, k) => {
        const x = 260 + k * 68, cx = x + 24;
        s += FK.R(x, 80, 48, 36, 'bm2') + FK.T(cx, 102, 'LSTM', { s: 11, c: 'em' }) + FK.A(cx, 170, cx, 118, 'ax', 6) + FK.A(cx, 80, cx, 44, 'ax', 6)
          + FK.T(cx, 186, w, { s: 11 }) + FK.T(cx, 34, OUT[k], { s: 11, c: 'em' });
        if (k < 3) s += FK.A(x + 48, 98, x + 68, 98, 'ld', 6);
      });
      s += FK.T(534, 102, '…', { s: 18 }) + FK.T(534, 34, 'guitar .', { s: 10 })
        + FK.T(150, 24, '1. 시각 패턴 인식 (CNN)', { s: 11, c: 'rl' })
        + FK.T(400, 210, '2. 이미지를 조건으로 문장 생성 (RNN)', { s: 11, c: 'lb' });
      return FK.fig(560, 222, '이미지 캡셔닝', s,
        R`슬라이드 34. $f_\theta\big(y\mid g_\phi(x)\big)$: CNN $g_\phi$가 이미지에서 시각 특성을 뽑고(1), 그 특성을 시작 상태로 받은 LSTM이 <SOS>부터 한 단어씩 문장을 냅니다(2). 슬라이드의 예 문장은 “man in black shirt is playing guitar.”입니다. 사진은 옮기지 않고 입력 → 출력 흐름만 그렸습니다.`);
    },
  });
})();
