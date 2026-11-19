/* 23 생성 모델: 최대가능도, ELBO, VAE — 본문 그림 (11주차 월요일 슬라이드 1–22, 11주차 수요일 슬라이드 18–72와 필기를 새로 그림) */
(function () {
  const R = String.raw;
  const FK = window.FK;
  const box = (x, y, w, h, t, sub, hl) => FK.R(x, y, w, h, hl ? 'bm2' : 'bm') + FK.T(x + w / 2, y + (sub ? h / 2 - 1 : h / 2 + 4), t, { s: 11, c: 'em' }) + (sub ? FK.T(x + w / 2, y + h / 2 + 12, sub, { s: 10 }) : '');
  const cell = (x, y, w, v) => `<rect x="${x}" y="${y}" width="${w}" height="${w}" style="fill:var(--denim);fill-opacity:${v.toFixed(2)};stroke:var(--ink-3);stroke-width:.5"/>`;

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 23.1 raster order of an autoregressive image model and the PixelCNN mask (W11 Mon slides 10–11)
    pixelorder() {
      const n = 6, c = 26, ox = 30, oy = 34, cur = 2 * n + 3;
      let s = FK.T(ox + n * c / 2, 22, '왼쪽 위에서부터 한 줄씩', { s: 10 });
      for (let k = 0; k < n * n; k++) {
        const i = Math.floor(k / n), j = k % n;
        s += cell(ox + j * c, oy + i * c, c, k < cur ? 0.3 : k === cur ? 0.85 : 0.03);
      }
      s += FK.T(ox + 3.5 * c, oy + 2.5 * c + 5, 'x_i', { s: 11, c: 'em' });
      s += FK.P(`M${ox + 6},${oy + 13}H${ox + n * c - 6}L${ox + 6},${oy + c + 13}H${ox + n * c - 6}`, 'dm ds');
      // legend
      const lx = 214;
      s += cell(lx, 40, 14, 0.3) + FK.T(lx + 22, 52, '이미 만든 픽셀 (조건)', { a: 'start', s: 10 })
        + cell(lx, 64, 14, 0.85) + FK.T(lx + 22, 76, '지금 만드는 픽셀', { a: 'start', s: 10 })
        + cell(lx, 88, 14, 0.03) + FK.T(lx + 22, 100, '아직 없는 픽셀', { a: 'start', s: 10 })
        + FK.T(lx, 136, 'p(x) = p(x_1) p(x_2 | x_1) ⋯ p(x_n | x_<n)', { a: 'start', s: 11, c: 'it' });
      // PixelCNN mask
      const mx = 434, my = 40, mc = 28, mask = [1, 1, 1, 1, 0, 0, 0, 0, 0];
      s += FK.T(mx + 1.5 * mc, 26, '마스크 합성곱 3×3', { s: 10, c: 'em' });
      mask.forEach((v, k) => {
        const i = Math.floor(k / 3), j = k % 3;
        s += cell(mx + j * mc, my + i * mc, mc, v ? 0.3 : 0.03) + FK.T(mx + j * mc + 14, my + i * mc + 18, String(v), { s: 11, c: k === 4 ? 'em' : '' });
      });
      s += FK.T(mx + 1.5 * mc, my + 104, '가운데와 뒤쪽은 0', { s: 10 }) + FK.T(mx + 1.5 * mc, my + 120, '앞쪽 문맥만 본다', { s: 10 });
      return FK.fig(560, 200, '자기회귀 모델의 픽셀 순서', s,
        R`자기회귀 이미지 모델(PixelRNN·PixelCNN, 11주차 월요일 슬라이드 10–11)의 생성 순서. 픽셀을 왼쪽 위에서부터 한 줄씩 늘어놓고, 픽셀 $x_i$를 이미 만든 픽셀 $\mathbf x_{<i}$에 조건화한 분포에서 뽑습니다. PixelCNN은 가운데와 그 뒤의 가중치를 $0$으로 가린 마스크 합성곱(오른쪽)으로 문맥 영역만 보게 해서 학습 때는 모든 픽셀을 한 번에 계산하지만, 생성은 여전히 픽셀 하나씩입니다.`);
    },
    // 23.2 a latent variable model: a simple z is mapped by a network onto the thin set of valid data (W11 Mon slides 15–25)
    latentgen() {
      let s = '';
      [44, 30, 16].forEach((r, k) => { s += `<circle cx="96" cy="112" r="${r}" style="fill:var(--denim);fill-opacity:${(0.1 + 0.1 * k).toFixed(2)};stroke:var(--ink-3);stroke-width:.6"/>`; });
      const zs = [[80, 100], [112, 96], [92, 128], [108, 122]];
      zs.forEach(([x, y]) => { s += `<circle class="dotf" cx="${x}" cy="${y}" r="3"/>`; });
      s += FK.T(96, 184, 'z ~ N(0, I)', { s: 11, c: 'it' }) + FK.T(96, 200, '잠재 공간 (d차원)', { s: 10 });
      s += FK.A(160, 112, 270, 112, 'ld', 8) + FK.T(215, 102, '디코더 (신경망)', { s: 10, c: 'em' }) + FK.T(215, 130, 'x = f_θ(z)', { s: 10, c: 'it' });
      s += FK.R(290, 24, 250, 168, 'bm');
      s += FK.P('M306,160 C350,60 420,170 470,90 S520,50 528,60', 'th') + FK.P('M306,160 C350,60 420,170 470,90 S520,50 528,60', 'ld');
      const xs = [[331, 115], [388, 116], [452, 109], [497, 72]];
      xs.forEach(([x, y]) => { s += `<circle class="dotf" cx="${x}" cy="${y}" r="3.2"/>`; });
      s += FK.T(415, 44, '데이터 공간 (D차원, D ≫ d)', { s: 10 }) + FK.T(415, 182, '유효한 이미지는 얇은 일부분', { s: 10, c: 'lb' });
      return FK.fig(560, 210, '잠재 변수 모델의 생성', s,
        R`잠재 변수 모델(11주차 월·수요일 슬라이드 15–25). 픽셀 공간 $\mathbb R^D$ 대부분은 잡음이고 유효한 이미지는 얇은 일부분(굵은 곡선)에 모여 있습니다. 낮은 차원 $d\ll D$의 간단한 분포 $\mathbf z\sim\mathcal N(\mathbf 0,I)$에서 뽑은 점을 신경망 디코더 $f_\theta$로 데이터 공간에 보내면, 그 일부분 위의 점이 만들어집니다.`);
    },
    // 23.3 an autoencoder and its reconstruction loss (W11 Wed slides 37–41)
    autoenc() {
      let s = '';
      s += box(20, 60, 56, 70, 'x', '입력');
      s += FK.P('M88,52 L196,78 L196,112 L88,138 Z', 'bm') + FK.T(142, 99, '인코더', { s: 11, c: 'em' });
      s += box(206, 76, 40, 38, 'z', '', true) + FK.T(226, 132, '병목 (d차원)', { s: 10 });
      s += FK.P('M256,78 L364,52 L364,138 L256,112 Z', 'bm') + FK.T(310, 99, '디코더', { s: 11, c: 'em' });
      s += box(376, 60, 56, 70, 'x̂', '복원');
      s += FK.P('M48,134 V170 H404 V134', 'rx ds') + FK.T(222, 188, '손실', { a: 'end', s: 11, c: 'rl' }) + FK.T(230, 188, '‖x − x̂‖²', { a: 'start', s: 11, c: 'rl' });
      s += FK.T(496, 82, '정답 표시가', { s: 10 }) + FK.T(496, 98, '필요 없다', { s: 10 }) + FK.T(496, 118, '(자기 지도)', { s: 10 });
      return FK.fig(560, 200, '오토인코더', s,
        R`오토인코더(11주차 수요일 슬라이드 37–41). 인코더가 입력 $\mathbf x$를 작은 잠재 벡터 $\mathbf z$로 줄이고, 디코더가 $\mathbf z$에서 $\hat{\mathbf x}$를 복원합니다. 손실은 복원 오차 $\lVert\mathbf x-\hat{\mathbf x}\rVert^2$뿐이라 정답 표시가 필요 없습니다. 병목이 있어야 항등 함수를 그대로 외우지 못하고 자료의 요약을 배웁니다.`);
    },
    // 23.5 log p(x) = ELBO + KL(q‖p(z|x)) on the two-state example of the section
    elbogap() {
      const Y = (v) => 40 + -v * 170;
      let s = FK.P(`M60,${Y(0)}V${Y(-1.05)}`, 'ax');
      [[0, '0'], [-0.5, '−0.5'], [-1, '−1.0']].forEach(([v, t]) => { s += FK.L(56, Y(v), 64, Y(v), 'ax') + FK.T(50, Y(v) + 4, t, { a: 'end', s: 10 }); });
      s += FK.L(70, Y(-0.693), 520, Y(-0.693), 'dm ds') + FK.T(522, Y(-0.693) - 6, 'log p(x) = −0.693', { a: 'end', s: 10, c: 'em' });
      // q uniform
      s += FK.L(110, Y(-0.916), 230, Y(-0.916), 'ld') + FK.T(170, Y(-0.916) + 18, 'ELBO = −0.916', { s: 10, c: 'lb' })
        + FK.A2(240, Y(-0.693), 240, Y(-0.916), 'rx', 6) + FK.T(248, Y(-0.805) + 4, 'KL(q ‖ p(z|x)) = 0.223', { a: 'start', s: 10, c: 'rl' })
        + FK.T(170, 24, 'q = (1/2, 1/2)', { s: 11, c: 'it' }) + FK.T(170, 230, '사후분포와 다르면 틈이 있다', { s: 10 });
      // q = posterior
      s += FK.L(380, Y(-0.693), 500, Y(-0.693), 'ld') + FK.T(440, Y(-0.693) + 18, 'ELBO = log p(x)', { s: 10, c: 'lb' })
        + FK.T(440, 24, 'q = p(z|x) = (0.8, 0.2)', { s: 11, c: 'it' }) + FK.T(440, 230, '사후분포와 같으면 틈이 0', { s: 10 });
      return FK.fig(560, 240, 'ELBO와 KL 틈', s,
        R`23.5절 예제의 두 상태 모델($p(z)=\tfrac12$, $p(x\mid z{=}1)=0.8$, $p(x\mid z{=}2)=0.2$)에서 본 $\log p(x)=\mathrm{ELBO}(q)+\KL(q\,\|\,p(z\mid x))$. 왼쪽: $q$가 균등이면 ELBO가 $\log p(x)$보다 $0.223$만큼 낮고, 그 틈이 사후분포와의 KL입니다. 오른쪽: $q$를 사후분포 $(0.8,0.2)$로 고르면 틈이 사라져 ELBO가 $\log p(x)$와 같아집니다.`);
    },
    // 23.6 the one-dimensional KL(N(μ, σ²) ‖ N(0, 1)) against σ² for μ = 0 and μ = 1
    gausskl() {
      const kl = (mu) => (v) => 0.5 * (v + mu * mu - 1 - Math.log(v));
      return FK.G({ w: 560, h: 230, x: [0, 4], y: [0, 2], m: [14, 20, 26, 40], label: '가우시안 KL의 모양',
        xl: 'σ²', yl: 'KL', xt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], yt: [[0.5, '0.5'], [1, '1'], [1.5, '1.5']],
        c: [
          { f: kl(0), a: 0.02, c: 'ld' },
          { f: kl(1), a: 0.02, c: 'rx' },
        ],
        extra: (X, Y) => FK.dot(X, Y, 1, 0) + FK.dot(X, Y, 1, 0.5, true),
        t: [[3.3, 0.95, 'μ = 0', { a: 'start', c: 'lb' }], [3.3, 1.62, 'μ = 1', { a: 'start', c: 'rl' }],
          [1.08, 0.12, '최소: σ² = 1에서 0', { a: 'start', s: 10 }], [1.08, 0.6, 'σ² = 1에서 ½μ²', { a: 'start', s: 10 }]],
        cap: R`1차원 $\KL(\N(\mu,\sigma^2)\,\|\,\N(0,1))=\tfrac12(\sigma^2+\mu^2-1-\log\sigma^2)$를 $\sigma^2$에 대해 그린 것입니다. $\sigma^2=1$에서 최소이고 그 값이 $\tfrac12\mu^2$이며, $\mu=0$, $\sigma^2=1$일 때만 $0$입니다. $\sigma^2\to0$이면 $-\log\sigma^2$ 때문에 무한히 커져서 인코더가 분산을 $0$으로 줄이지 못하게 합니다.` });
    },
    // 23.7 the VAE forward pass with the reparameterization z = μ + σ ⊙ ε and where gradients flow (W11 Wed slide 68, notes)
    reparam() {
      let s = '';
      s += box(16, 92, 44, 40, 'x');
      s += FK.A(60, 112, 84, 112, 'ld', 7) + box(88, 88, 72, 48, '인코더', 'φ');
      s += FK.A(160, 102, 196, 80, 'ld', 7) + FK.A(160, 122, 196, 144, 'ld', 7)
        + box(200, 64, 44, 30, 'μ', '', true) + box(200, 130, 44, 30, 'σ', '', true);
      s += FK.C(300, 112, 18, 'nd') + FK.T(300, 117, '+ ⊙', { s: 10, c: 'em' })
        + FK.A(244, 79, 284, 102, 'ld', 7) + FK.A(244, 145, 284, 122, 'ld', 7)
        + FK.A(300, 196, 300, 132, 'dm', 7) + FK.T(300, 212, 'ε ~ N(0, I)', { s: 11, c: 'it' }) + FK.T(300, 228, '밖에서 뽑는 잡음', { s: 10 });
      s += FK.T(300, 76, 'z = μ + σ ⊙ ε', { s: 11, c: 'it' });
      s += FK.A(318, 112, 346, 112, 'ld', 7) + box(350, 88, 72, 48, '디코더', 'θ');
      s += FK.A(422, 112, 446, 112, 'ld', 7) + box(450, 92, 44, 40, 'x̂');
      s += FK.T(472, 160, 'R = ½‖x − x̂‖²', { s: 11, c: 'rl' });
      s += FK.P('M472,170 C460,250 320,250 300,140', 'rx ds') + FK.A(282, 138, 246, 152, 'rx', 7) + FK.A(282, 98, 246, 84, 'rx', 7)
        + FK.T(400, 238, '기울기는 z를 지나 μ, σ로', { s: 10, c: 'rl' });
      s += FK.T(222, 30, 'KL(q ‖ N(0, I))', { s: 10, c: 'it' }) + FK.A(222, 38, 222, 62, 'dm', 6) + FK.T(222, 16, 'μ, σ에 직접 걸리는 항', { s: 10 });
      return FK.fig(560, 250, '재매개변수화와 기울기의 길', s,
        R`VAE의 순전파와 재매개변수화(11주차 수요일 슬라이드 68, 필기). 인코더가 $\mu_\phi(\mathbf x)$, $\sigma_\phi(\mathbf x)$를 내고, 잡음 $\varepsilon\sim\N(\mathbf 0,I)$를 밖에서 뽑아 $\mathbf z=\mu+\sigma\odot\varepsilon$를 만든 뒤 디코더가 $\hat{\mathbf x}=f_\theta(\mathbf z)$를 냅니다. 무작위성이 $\varepsilon$에만 있으므로 손실 $R$의 기울기가 $\mathbf z$를 지나 $\mu$와 $\sigma$, 곧 $\phi$까지 흐릅니다(점선). KL 항은 $\mu$, $\sigma$에 직접 걸립니다.`);
    },
  });
})();
