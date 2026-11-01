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
  });
})();
