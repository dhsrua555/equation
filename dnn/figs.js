/* SVG figures used from the notes as ":::fig name". Colours come from CSS classes so both themes work. */
(function () {
  const F = {};
  const node = (x, y, label, r = 20) => `<circle class="nd" cx="${x}" cy="${y}" r="${r}"/><text class="em" x="${x}" y="${y + 4}" text-anchor="middle">${label}</text>`;
  const arrow = (x1, y1, x2, y2) => `<line class="ax arr" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ah)"/>`;
  const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ahp" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;

  // entropy / mutual information Venn diagram
  F.venn = () => `<figure class="fig"><svg viewBox="0 0 560 250" role="img" aria-label="엔트로피와 상호정보량의 벤 다이어그램">
    <circle class="cv" cx="220" cy="125" r="95" fill="none"/><circle class="cv2 ring" cx="340" cy="125" r="95" fill="none"/>
    <text class="em" x="160" y="130" text-anchor="middle">H(X|Y)</text>
    <text class="em" x="280" y="130" text-anchor="middle">I(X;Y)</text>
    <text class="em" x="400" y="130" text-anchor="middle">H(Y|X)</text>
    <text x="150" y="22" text-anchor="middle">H(X)</text><text x="410" y="22" text-anchor="middle">H(Y)</text>
    <text x="280" y="244" text-anchor="middle">H(X,Y) = 두 원의 합집합</text>
  </svg><figcaption>왼쪽 원이 $H(X)$, 오른쪽 원이 $H(Y)$. 겹친 부분이 상호정보량 $I(X;Y)$이고, 합집합 전체가 결합 엔트로피 $H(X,Y)$입니다.</figcaption></figure>`;

  // distance from a point to a hyperplane
  F.distance = () => `<figure class="fig"><svg viewBox="0 0 560 280" role="img" aria-label="점에서 초평면까지의 거리">${defs}
    <line class="cv" x1="70" y1="250" x2="470" y2="40"/>
    <text x="478" y="44">H: wᵀx + b = 0</text>
    <circle class="dotf" cx="330" cy="215" r="5"/><text class="em" x="340" y="232">x</text>
    <circle class="dotf" cx="262" cy="147" r="5"/><text class="em" x="226" y="140">x_p</text>
    <line class="cv2" x1="330" y1="215" x2="264" y2="149" stroke-dasharray="5 4"/>
    <text x="304" y="176">d = αw</text>
    ${arrow(150, 208, 196, 254)}<text x="200" y="262">w (법선)</text>
    <path class="ax" d="M 250 153 L 256 159 L 262 153" fill="none"/>
  </svg><figcaption>$\mathbf x_p=\mathbf x-\mathbf d$가 평면 위에 있고 $\mathbf d$는 법선 $\mathbf w$와 평행합니다. 여기서 $\alpha=(\mathbf w^T\mathbf x+b)/\mathbf w^T\mathbf w$가 나오고 거리는 $\lvert\mathbf w^T\mathbf x+b\rvert/\lVert\mathbf w\rVert_2$입니다.</figcaption></figure>`;

  // maximum margin picture
  F.margin = () => `<figure class="fig"><svg viewBox="0 0 560 290" role="img" aria-label="최대 마진 초평면과 서포트 벡터">
    <line class="cv" x1="120" y1="270" x2="440" y2="20"/>
    <line class="ax" x1="60" y1="235" x2="380" y2="-15" stroke-dasharray="6 5"/>
    <line class="ax" x1="180" y1="305" x2="500" y2="55" stroke-dasharray="6 5"/>
    <text x="330" y="40">H₊: wᵀx + b = 1</text><text x="452" y="96">H₋: wᵀx + b = −1</text><text x="448" y="30">H₀</text>
    ${[[150, 70], [110, 120], [200, 40], [95, 175], [170, 105]].map(([x, y]) => `<circle class="dotf" cx="${x}" cy="${y}" r="5"/>`).join('')}
    ${[[400, 200], [360, 250], [450, 150], [420, 250], [470, 210]].map(([x, y]) => `<circle class="doto" cx="${x}" cy="${y}" r="5"/>`).join('')}
    <circle class="sv" cx="226" cy="98" r="10"/><circle class="dotf" cx="226" cy="98" r="5"/>
    <circle class="sv" cx="330" cy="174" r="10"/><circle class="doto" cx="330" cy="174" r="5"/>
    <line class="cv2" x1="226" y1="98" x2="260" y2="140"/><line class="cv2" x1="296" y1="132" x2="330" y2="174"/>
    <text class="em" x="236" y="152">1/‖w‖</text><text class="em" x="316" y="140">1/‖w‖</text>
    <text x="60" y="30">y = +1 (P)</text><text x="430" y="285">y = −1 (N)</text>
  </svg><figcaption>서포트 벡터(동그라미 친 점)는 $\mathbf w^T\mathbf x+b=\pm1$ 위에 있고, 결정 평면 $H_0$에서 각각 $1/\lVert\mathbf w\rVert$ 떨어져 있습니다. 마진 전체 폭은 $2/\lVert\mathbf w\rVert$입니다.</figcaption></figure>`;

  // computational graph for f = (x + y) z
  F.graph1 = () => `<figure class="fig"><svg viewBox="0 0 560 230" role="img" aria-label="f = (x+y)z의 계산 그래프">${defs}
    ${node(60, 50, 'x')}${node(60, 120, 'y')}${node(60, 195, 'z')}
    ${node(230, 85, '+', 22)}${node(400, 140, '×', 22)}${node(510, 140, 'f')}
    ${arrow(80, 55, 208, 80)}${arrow(80, 115, 208, 92)}${arrow(252, 95, 378, 132)}${arrow(80, 192, 378, 146)}${arrow(422, 140, 488, 140)}
    <text class="fw" x="120" y="52">−2</text><text class="fw" x="120" y="112">5</text><text class="fw" x="120" y="185">−4</text>
    <text class="fw" x="300" y="100">q = 3</text><text class="fw" x="440" y="130">−12</text>
    <text class="bw" x="120" y="72">−4</text><text class="bw" x="120" y="132">−4</text><text class="bw" x="200" y="205">3</text>
    <text class="bw" x="300" y="122">−4</text><text class="bw" x="440" y="160">1</text>
  </svg><figcaption>위쪽 숫자는 순전파 값, 아래쪽 숫자는 역전파로 얻은 $\partial f/\partial(\cdot)$입니다. 곱셈 노드는 기울기를 서로 바꿔 보냅니다.</figcaption></figure>`;

  // sigmoid neuron graph with forward and backward values
  F.graph2 = () => `<figure class="fig"><svg viewBox="0 0 640 260" role="img" aria-label="시그모이드 뉴런의 계산 그래프">${defs}
    ${node(40, 30, 'w₀', 17)}${node(40, 85, 'x₀', 17)}${node(40, 150, 'w₁', 17)}${node(40, 205, 'x₁', 17)}${node(40, 250 - 10, 'w₂', 15)}
    ${node(130, 58, '×', 17)}${node(130, 178, '×', 17)}${node(215, 118, '+', 17)}${node(290, 150, '+', 17)}
    ${node(360, 150, '·−1', 19)}${node(435, 150, 'exp', 19)}${node(510, 150, '+1', 19)}${node(590, 150, '1/x', 19)}
    ${arrow(57, 34, 114, 52)}${arrow(57, 83, 114, 64)}${arrow(57, 154, 114, 172)}${arrow(57, 203, 114, 184)}
    ${arrow(147, 64, 199, 110)}${arrow(147, 172, 199, 126)}${arrow(232, 124, 274, 144)}${arrow(55, 238, 274, 156)}
    ${arrow(307, 150, 340, 150)}${arrow(379, 150, 415, 150)}${arrow(454, 150, 490, 150)}${arrow(529, 150, 570, 150)}
    <text class="fw" x="62" y="22">2</text><text class="fw" x="62" y="99">−1</text><text class="fw" x="62" y="146">−3</text><text class="fw" x="62" y="222">−2</text><text class="fw" x="150" y="245">−3</text>
    <text class="fw" x="160" y="76">−2</text><text class="fw" x="160" y="168">6</text><text class="fw" x="238" y="112">4</text><text class="fw" x="306" y="140">1</text>
    <text class="fw" x="382" y="138">−1</text><text class="fw" x="456" y="138">0.37</text><text class="fw" x="530" y="138">1.37</text><text class="fw" x="612" y="138">0.73</text>
    <text class="bw" x="62" y="42">−0.20</text><text class="bw" x="62" y="115">0.40</text><text class="bw" x="62" y="164">−0.40</text><text class="bw" x="62" y="238">−0.60</text><text class="bw" x="150" y="258">0.20</text>
    <text class="bw" x="160" y="94">0.20</text><text class="bw" x="160" y="200">0.20</text><text class="bw" x="238" y="140">0.20</text><text class="bw" x="306" y="172">0.20</text>
    <text class="bw" x="382" y="172">−0.20</text><text class="bw" x="456" y="172">−0.53</text><text class="bw" x="530" y="172">−0.53</text><text class="bw" x="612" y="172">1.00</text>
  </svg><figcaption>$f(\mathbf w,\mathbf x)=1/(1+e^{-(w_0x_0+w_1x_1+w_2)})$. 위쪽 숫자는 순전파 값, 아래쪽 숫자는 역전파 기울기입니다. $+,\ -1$배, $\exp$, $+1$, $1/x$ 노드를 묶으면 시그모이드 게이트 하나가 되고 그 국소 기울기는 $\sigma(1-\sigma)=0.73\times0.27\approx0.20$입니다.</figcaption></figure>`;

  // batch normalization vs layer normalization axes
  F.bnln = () => {
    const grid = (x0, y0, hl) => {
      let s = '';
      for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) s += `<rect class="${hl(i, j) ? 'rg hl' : 'rg'}" x="${x0 + j * 30}" y="${y0 + i * 26}" width="28" height="24"/>`;
      return s;
    };
    return `<figure class="fig"><svg viewBox="0 0 560 230" role="img" aria-label="배치 정규화와 층 정규화가 평균을 내는 방향">
      ${grid(60, 50, (i) => i === 1)}${grid(340, 50, (i, j) => j === 2)}
      <text x="120" y="36" text-anchor="middle">미니배치 (N개) →</text><text x="400" y="36" text-anchor="middle">미니배치 (N개) →</text>
      <text x="50" y="118" text-anchor="end">특성</text><text x="330" y="118" text-anchor="end">특성</text>
      <text class="em" x="120" y="205" text-anchor="middle">BatchNorm: 한 특성을 배치 전체로 평균</text>
      <text class="em" x="400" y="205" text-anchor="middle">LayerNorm: 한 샘플을 특성 전체로 평균</text>
    </svg><figcaption>칠한 칸이 평균·분산 하나를 계산하는 데 쓰이는 값들입니다. BN은 특성마다(D개), LN은 샘플마다(N개) 통계량을 구합니다.</figcaption></figure>`;
  };

  window.SITE_FIGS = F;
})();
