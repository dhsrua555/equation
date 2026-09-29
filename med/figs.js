/* SVG figures used from the notes as ":::fig name". Colours come from CSS classes so both themes work. */
(function () {
  const F = {};
  const node = (x, y, label, r = 20) => `<circle class="nd" cx="${x}" cy="${y}" r="${r}"/><text class="em" x="${x}" y="${y + 4}" text-anchor="middle">${label}</text>`;
  const arrow = (x1, y1, x2, y2, cls = 'ax arr') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ah)"/>`;
  const defs = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ahp" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;

  // probability tree of the cancer screening example
  F.screening = () => `<figure class="fig"><svg viewBox="0 0 600 270" role="img" aria-label="의료 검사 예제의 확률 나무">${defs}
    <text class="em" x="30" y="139">10,000명</text>
    ${arrow(100, 130, 200, 70)}${arrow(100, 140, 200, 200)}
    <text class="em" x="210" y="74">암 C=1: 100명</text><text x="120" y="88">1/100</text>
    <text class="em" x="210" y="204">정상 C=0: 9,900명</text><text x="120" y="190">99/100</text>
    ${arrow(330, 64, 420, 30)}${arrow(330, 76, 420, 104)}${arrow(360, 196, 440, 164)}${arrow(360, 208, 440, 240)}
    <text class="fw" x="430" y="34">양성 90명 (민감도 90%)</text><text x="430" y="110">음성 10명 (위음성)</text>
    <text class="fw" x="450" y="168">양성 297명 (위양성 3%)</text><text x="450" y="244">음성 9,603명 (특이도 97%)</text>
  </svg><figcaption>양성은 모두 $90+297=387$명이고 그중 실제 암 환자는 90명이므로 $p(C=1\\mid T=1)=90/387\\approx0.23$입니다. 유병률(사전확률)이 낮으면 위양성이 양성의 대부분을 차지합니다.</figcaption></figure>`;

  // counts n_ij in a grid (sum and product rules)
  F.grid = () => {
    let s = '';
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) s += `<rect class="${i === 3 && j === 1 ? 'rg hl' : 'rg'}" x="${150 + i * 56}" y="${40 + j * 50}" width="52" height="46"/>`;
    return `<figure class="fig"><svg viewBox="0 0 560 250" role="img" aria-label="결합 빈도 격자">${s}
      <text class="em" x="${150 + 3 * 56 + 26}" y="${40 + 50 + 28}" text-anchor="middle">n_ij</text>
      <text x="${150 + 3 * 56 + 26}" y="228" text-anchor="middle">x_i</text><text x="120" y="118" text-anchor="end">y_j</text>
      <text x="${150 + 3 * 56 + 26}" y="30" text-anchor="middle">열의 합 c_i</text><text x="440" y="118">행의 합 r_j</text>
    </svg><figcaption>$N$번 시행에서 $X=x_i,\\ Y=y_j$가 함께 나온 횟수가 $n_{ij}$입니다. $p(x_i,y_j)=n_{ij}/N$, $p(x_i)=c_i/N$, $p(y_j\\mid x_i)=n_{ij}/c_i$에서 합의 규칙과 곱의 규칙이 나옵니다.</figcaption></figure>`;
  };

  // entropy / mutual information Venn diagram
  F.venn = () => `<figure class="fig"><svg viewBox="0 0 560 250" role="img" aria-label="엔트로피와 상호정보량의 벤 다이어그램">
    <circle class="cv" cx="220" cy="125" r="95" fill="none"/><circle class="cv2 ring" cx="340" cy="125" r="95" fill="none"/>
    <text class="em" x="160" y="130" text-anchor="middle">H[x|y]</text><text class="em" x="280" y="130" text-anchor="middle">I[x,y]</text><text class="em" x="400" y="130" text-anchor="middle">H[y|x]</text>
    <text x="150" y="22" text-anchor="middle">H[x]</text><text x="410" y="22" text-anchor="middle">H[y]</text>
    <text x="280" y="244" text-anchor="middle">H[x,y] = 두 원의 합집합</text>
  </svg><figcaption>왼쪽 원이 $\\mathrm H[x]$, 오른쪽 원이 $\\mathrm H[y]$. 겹친 부분이 상호정보량 $\\mathrm I[x,y]$이고, 합집합 전체가 결합 엔트로피 $\\mathrm H[x,y]$입니다.</figcaption></figure>`;

  // error backpropagation at a hidden unit
  F.delta = () => `<figure class="fig"><svg viewBox="0 0 560 230" role="img" aria-label="은닉 유닛 j에서의 오차 역전파">${defs}
    ${node(70, 115, 'z_i')}${node(260, 115, 'z_j')}${node(470, 50, 'δ_k')}${node(470, 180, 'δ_1')}
    ${arrow(92, 115, 236, 115)}${arrow(282, 105, 448, 58)}${arrow(282, 125, 448, 172)}
    ${arrow(446, 70, 290, 110, 'cv2 arr')}${arrow(446, 166, 290, 124, 'cv2 arr')}
    <text x="160" y="104" text-anchor="middle">w_ji</text><text x="370" y="66" text-anchor="middle">w_kj</text>
    <text class="bw" x="260" y="160" text-anchor="middle">δ_j = h′(a_j) Σ w_kj δ_k</text>
    <text x="470" y="115" text-anchor="middle">⋮</text>
  </svg><figcaption>검은 화살표는 순전파($a_j=\\sum_iw_{ji}z_i$), 색 화살표는 오차의 역전파입니다. 은닉 유닛의 오차는 다음 층 오차의 가중합에 활성화 함수의 기울기를 곱한 것입니다.</figcaption></figure>`;

  // batch normalization vs layer normalization axes
  F.bnln = () => {
    const grid = (x0, y0, hl) => {
      let s = '';
      for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) s += `<rect class="${hl(i, j) ? 'rg hl' : 'rg'}" x="${x0 + j * 30}" y="${y0 + i * 26}" width="28" height="24"/>`;
      return s;
    };
    return `<figure class="fig"><svg viewBox="0 0 560 230" role="img" aria-label="배치 정규화와 층 정규화가 평균을 내는 방향">
      ${grid(60, 50, (i) => i === 1)}${grid(340, 50, (i, j) => j === 2)}
      <text x="120" y="36" text-anchor="middle">미니배치 →</text><text x="400" y="36" text-anchor="middle">미니배치 →</text>
      <text x="50" y="118" text-anchor="end">은닉 유닛</text><text x="330" y="118" text-anchor="end">은닉 유닛</text>
      <text class="em" x="120" y="205" text-anchor="middle">BatchNorm: 유닛마다 배치 전체로</text>
      <text class="em" x="400" y="205" text-anchor="middle">LayerNorm: 샘플마다 유닛 전체로</text>
    </svg><figcaption>칠한 칸이 평균·분산 하나를 계산하는 데 쓰이는 값들입니다. BN은 은닉 유닛마다 미니배치에 걸쳐, LN은 샘플마다 은닉 유닛에 걸쳐 통계량을 구합니다.</figcaption></figure>`;
  };

  // chain of residual blocks
  F.residual = () => {
    const block = (x, lab) => `<rect class="rg hl" x="${x}" y="95" width="80" height="44" rx="8"/><text class="em" x="${x + 40}" y="122" text-anchor="middle">${lab}</text>`;
    const plus = (x) => `<circle class="nd" cx="${x}" cy="117" r="12"/><text class="em" x="${x}" y="122" text-anchor="middle">+</text>`;
    const skip = (x1, x2) => `<path class="cv" d="M ${x1} 117 L ${x1} 60 L ${x2} 60 L ${x2} 103" fill="none" marker-end="url(#ah)"/>`;
    return `<figure class="fig"><svg viewBox="0 0 600 200" role="img" aria-label="잔차 연결 블록">${defs}
      <text class="em" x="18" y="122">x</text>
      ${arrow(34, 117, 70, 117)}${block(70, 'F₁')}${arrow(150, 117, 186, 117)}${plus(198)}${skip(52, 198)}
      ${arrow(210, 117, 246, 117)}${block(246, 'F₂')}${arrow(326, 117, 362, 117)}${plus(374)}${skip(228, 374)}
      ${arrow(386, 117, 422, 117)}${block(422, 'F₃')}${arrow(502, 117, 538, 117)}${plus(550)}${skip(404, 550)}
      ${arrow(562, 117, 590, 117)}<text x="228" y="160">z₁</text><text x="404" y="160">z₂</text><text class="em" x="580" y="160">y</text>
    </svg><figcaption>$z_1=F_1(x)+x$, $z_2=F_2(z_1)+z_1$, $y=F_3(z_2)+z_2$. 각 블록은 입력에 더할 **변화량** $F_\\ell(z_{\\ell-1})=z_\\ell-z_{\\ell-1}$만 배웁니다.</figcaption></figure>`;
  };

  window.SITE_FIGS = F;
})();
