/* 고체역학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다. 그리는 도구는 core/figkit.js(FK)입니다. */
(function () {
  const { fig, L, A, T, R, C, P, ground, wall, pin, roller, dist, dim, dimv, mom, fn, area } = window.FK;
  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // s01 — forklift: weights, wheel reactions, distances from the front axle
    sForklift() {
      return fig(560, 250, '지게차의 자유물체도: 차체 무게, 화물 무게, 앞바퀴와 뒷바퀴 반력',
        ground(40, 520, 200) +
        R(110, 112, 210, 56, 'bm') + L(335, 60, 335, 196, 'th') + L(335, 160, 425, 160, 'th') + R(345, 104, 70, 56, 'bm2') +
        C(140, 182, 18, 'sp') + C(300, 182, 18, 'sp') +
        A(210, 118, 210, 158, 'ld') + T(218, 140, '12 kN', { a: 'start', c: 'lb' }) +
        A(380, 110, 380, 150, 'ld') + T(424, 132, '5 kN', { a: 'start', c: 'lb' }) +
        A(140, 240, 140, 204, 'rx') + T(148, 238, 'R_B', { a: 'start', c: 'rl' }) +
        A(300, 240, 300, 204, 'rx') + T(308, 236, 'R_A', { a: 'start', c: 'rl' }) +
        L(140, 46, 140, 100, 'dm ds') + L(210, 46, 210, 112, 'dm ds') + L(300, 46, 300, 160, 'dm ds') + L(380, 46, 380, 100, 'dm ds') +
        dim(140, 210, 46, '0.7 m') + dim(210, 300, 46, '0.9 m') + dim(300, 380, 46, '0.8 m') +
        T(122, 214, 'B', { a: 'end' }) + T(282, 214, 'A', { a: 'end' }),
        '앞바퀴 축 $A$에 대한 모멘트 식 하나로 뒷바퀴 반력 $R_B$가 나옵니다. 반력은 바퀴 두 개의 합력으로 그렸습니다.');
    },
    // s01 — boom AB and rod BC carrying a load at B (3-4-5 geometry)
    sBracket() {
      return fig(560, 260, '벽에 핀으로 연결된 수평 붐 AB와 경사 막대 BC, B에 30 kN',
        wall(80, 36, 222, 'left') + L(80, 180, 240, 180, 'th') + L(240, 180, 80, 60, 'th') +
        C(80, 180, 4, 'jt') + C(240, 180, 4, 'jt') + C(80, 60, 4, 'jt') +
        A(240, 186, 240, 228, 'ld') + T(248, 214, '30 kN', { a: 'start', c: 'lb' }) +
        T(92, 198, 'A', { a: 'start' }) + T(250, 172, 'B', { a: 'start' }) + T(92, 54, 'C', { a: 'start' }) +
        dim(80, 240, 244, '0.8 m') + dimv(46, 60, 180, '0.6 m', { left: true }),
        '$AB$와 $BC$는 두 끝이 핀이고 중간에 하중이 없으므로 2력 부재입니다. 힘은 부재 축을 따라서만 작용합니다.');
    },
    // s02 — an axially loaded bar cut by an oblique plane: normal and shear resultants on the cut
    sOblique() {
      return fig(560, 210, '축하중을 받는 봉을 기울어진 면으로 자른 왼쪽 조각과 절단면의 수직력, 전단력',
        P('M60,70L232.7,70L267.3,130L60,130Z', 'bm') + P('M232.7,70L460,70L460,130L267.3,130Z', 'gd ds') +
        A(60, 100, 14, 100, 'ld') + T(20, 90, 'P', { c: 'lb' }) +
        L(250, 100, 330, 100, 'dm ds') + P('M290,100A40,40 0 0 0 284.6,80', 'dm') + T(300, 94, 'θ', { a: 'start', c: 'it' }) +
        A(250, 100, 305.4, 68, 'ld') + T(312, 64, 'F = P cos θ', { a: 'start', c: 'lb' }) +
        A(250, 100, 275, 143.3, 'rx') + T(282, 160, 'V = P sin θ', { a: 'start', c: 'rl' }) +
        T(140, 160, '단면적 A_0', {}) + T(365, 160, '경사면 넓이 A_0 / cos θ', { a: 'start' }),
        '경사면의 법선이 봉의 축과 각 $\\theta$를 이룹니다. 왼쪽 조각의 평형에서 경사면이 받는 힘은 법선 성분 $P\\cos\\theta$와 면을 따르는 성분 $P\\sin\\theta$입니다.');
    },
    // s03 — a small square element before (dashed) and after deformation (exaggerated)
    sStrainEl() {
      return fig(560, 250, '변형 전 정사각형 요소(점선)와 변형 후의 평행사변형',
        P('M160,210L280,210L280,90L160,90Z', 'gd ds') +
        P('M180,200L318,185.6L339.6,53.6L201.6,68Z', 'bm2') +
        L(180, 200, 330, 200, 'dm ds') + L(180, 200, 180, 50, 'dm ds') +
        P('M230,200A50,50 0 0 0 229.7,194.8', 'rx') + T(238, 196, 'α', { a: 'start', c: 'it' }) +
        P('M180,150A50,50 0 0 1 187.7,150.6', 'rx') + T(186, 140, 'β', { a: 'start', c: 'it' }) +
        A(160, 210, 180, 200, 'vl', 7) + T(150, 226, 'A → A′ (u, v)', { a: 'start' }) +
        T(318, 206, 'B′', { a: 'start' }) + T(196, 60, 'D′', { a: 'end' }) + T(282, 222, 'B') + T(152, 88, 'D', { a: 'end' }) +
        T(380, 110, 'α ≈ ∂v/∂x', { a: 'start' }) + T(380, 132, 'β ≈ ∂u/∂y', { a: 'start' }) + T(380, 160, 'γ_xy = α + β', { a: 'start', c: 'lb' }) +
        T(380, 182, 'ε_x ≈ ∂u/∂x', { a: 'start' }) + T(380, 204, 'ε_y ≈ ∂v/∂y', { a: 'start' }),
        '변위장 $(u,v)$가 요소를 옮기고, 늘리고, 비틉니다. 변의 길이 비율의 변화가 수직 변형률, 원래 직각이던 각의 감소 $\\alpha+\\beta$가 전단 변형률입니다(그림은 크게 과장).');
    },
    // s04 — annotated stress-strain diagram of a mild steel, with an unloading path
    sSScurve() {
      return fig(560, 250, '연강의 응력-변형률 선도: 비례 한도, 항복, 변형 경화, 극한 강도, 넥킹, 파단, 하중 제거',
        A(60, 214, 530, 214, 'ax') + A(60, 214, 60, 20, 'ax') + T(534, 218, 'ε', { a: 'start', c: 'it' }) + T(52, 24, 'σ', { a: 'end', c: 'it' }) +
        P('M60,214L80,110L88,114L150,112C200,100 280,52 360,50C410,50 450,62 470,80', 'cv') +
        L(465, 75, 475, 85, 'vl') + L(465, 85, 475, 75, 'vl') +
        P('M260,62L229.6,214', 'rx ds') +
        L(60, 110, 80, 110, 'dm ds') + T(56, 114, 'σ_Y', { a: 'end' }) + L(60, 50, 360, 50, 'dm ds') + T(56, 54, 'σ_U', { a: 'end' }) +
        T(86, 104, '항복', { a: 'start' }) + T(120, 132, '항복 고원', { a: 'middle' }) + T(275, 130, '변형 경화', { a: 'start' }) +
        T(360, 40, '극한 강도', {}) + T(420, 100, '넥킹', { a: 'start' }) + T(480, 76, '파단', { a: 'start' }) +
        dim(60, 229.6, 232, '영구 변형', { s: 11 }) + dim(229.6, 260, 232, '회복', { s: 11 }),
        '하중을 빼면 처음 기울기 $E$와 평행한 직선을 따라 내려와 영구 변형이 남습니다. 넥킹 뒤 공칭 응력이 줄어드는 것은 단면이 줄기 때문이고, 진응력은 계속 증가합니다.');
    },
    // s05 — rigid bar BDE hung from two links of different materials, load at E
    sLinks() {
      return fig(560, 250, '강체 막대 BDE를 알루미늄 링크 AB와 강철 링크 CD가 매단 구조, E에 24 kN',
        ground(90, 150, 70, false) + ground(210, 270, 40, false) +
        L(120, 70, 120, 160, 'th') + L(240, 40, 240, 160, 'th') + R(100, 154, 310, 12, 'bm') +
        C(120, 70, 4, 'jt') + C(240, 40, 4, 'jt') + C(120, 160, 4, 'jt') + C(240, 160, 4, 'jt') +
        A(400, 170, 400, 222, 'ld') + T(408, 204, '24 kN', { a: 'start', c: 'lb' }) +
        T(110, 84, 'A', { a: 'end' }) + T(110, 150, 'B', { a: 'end' }) + T(250, 56, 'C', { a: 'start' }) + T(250, 150, 'D', { a: 'start' }) + T(414, 150, 'E', { a: 'start' }) +
        T(300, 88, 'CD: 강철, 600 mm², 0.4 m', { a: 'start' }) + T(300, 110, 'AB: 알루미늄, 500 mm², 0.3 m', { a: 'start' }) +
        dim(120, 240, 238, '0.3 m') + dim(240, 400, 238, '0.4 m'),
        '막대는 강체라 $B$, $D$, $E$의 처짐이 한 직선 위에 있습니다. 두 링크의 늘어남이 이 직선을 정합니다.');
    },
    // s05 — three bars meeting at one joint (statically indeterminate)
    sThreeBar() {
      return fig(560, 240, '천장에서 한 점으로 모이는 세 봉, 가운데 봉과 양쪽 봉이 각 θ를 이룸',
        ground(150, 410, 40, false) +
        L(280, 40, 280, 190, 'th') + L(193.4, 40, 280, 190, 'th') + L(366.6, 40, 280, 190, 'th') +
        C(280, 190, 4.5, 'jt') + A(280, 196, 280, 232, 'ld') + T(290, 226, 'P', { a: 'start', c: 'lb' }) +
        P('M280,130A60,60 0 0 1 250,138', 'dm') + T(262, 124, 'θ', { a: 'middle', c: 'it' }) +
        T(288, 100, '1', { a: 'start' }) + T(222, 100, '2', { a: 'end' }) + T(340, 100, '2', { a: 'start' }) +
        dimv(430, 40, 190, 'L', { }),
        '세 봉의 재료와 단면이 같습니다. 미지수(봉력 3개, 대칭으로 2개)가 평형 식(2개, 대칭으로 1개)보다 많아 변형의 적합 조건이 필요합니다.');
    },
    // s06 — a shaft fixed at the left, twisted by T at the right: a surface line tilts by gamma, the end turns by phi
    sShaft() {
      const c = 50, cy = 130, x0 = 110, x1 = 420, ph = 35 * Math.PI / 180, yB = cy - c * Math.sin(ph);
      return fig(560, 230, '왼쪽이 고정된 원형 축의 오른쪽 끝에 토크 T: 표면의 직선이 γ만큼 기울고 끝단이 φ만큼 회전',
        wall(x0, 60, 200, 'left') +
        L(x0, cy - c, x1, cy - c, 'gd') + L(x0, cy + c, x1, cy + c, 'gd') +
        `<ellipse class="bm" cx="${x1}" cy="${cy}" rx="14" ry="${c}"/>` +
        L(x0, cy, x1, cy, 'dm ds') + L(x0, cy, x1 + 2, yB, 'ld') +
        L(x1, cy, x1 + 11.5, cy, 'gd') + L(x1, cy, x1 + 14 * Math.cos(ph), yB, 'gd') +
        P(`M${x0 + 90},${cy}A90,90 0 0 0 ${x0 + 90 * Math.cos(Math.atan((cy - yB) / (x1 - x0)))},${cy - 90 * Math.sin(Math.atan((cy - yB) / (x1 - x0)))}`, 'rx') + T(x0 + 98, cy - 6, 'γ', { a: 'start', c: 'it' }) +
        T(x1 + 16, yB - 4, 'B′', { a: 'start' }) + T(x1 + 16, cy + 14, 'B', { a: 'start' }) + T(x0 + 6, cy + 16, 'A', { a: 'start' }) +
        T(x1 - 8, cy - 26, 'φ', { a: 'end', c: 'it' }) +
        A(x1 + 20, cy, x1 + 90, cy, 'ld') + A(x1 + 20, cy, x1 + 76, cy, 'ld') + T(x1 + 92, cy - 8, 'T', { a: 'start', c: 'lb' }) +
        dim(x0, x1, 212, 'L') + dimv(x1 + 110, cy - c, cy, 'c'),
        '표면의 선분 $AB$는 비틀린 뒤 $AB\'$가 됩니다. 호 $BB\'$의 길이를 두 방법으로 쓰면 $L\\gamma=c\\phi$입니다. 토크는 오른손 법칙의 이중 화살표로 그렸습니다.');
    },
    // s06 — thin-walled closed section: constant shear flow around the centerline
    sThinTube() {
      const pts = [[150, 60], [410, 60], [410, 190], [150, 190]];
      const arrows = [[190, 60, 330, 60], [410, 90, 410, 160], [370, 190, 230, 190], [150, 160, 150, 90]];
      return fig(560, 250, '얇은 폐단면: 벽 두께 t, 중심선이 둘러싼 넓이 A, 벽을 따라 일정한 전단 흐름 q',
        R(144, 54, 272, 142, 'bm') + R(156, 66, 248, 118, 'sp') + R(150, 60, 260, 130, 'fl2') +
        `<polygon class="dm ds" points="${pts.map((p) => p.join(',')).join(' ')}"/>` +
        arrows.map(([a, b, c2, d]) => A(a, b, c2, d, 'rx')).join('') +
        T(280, 132, 'A (중심선이 둘러싼 넓이)', {}) + T(280, 38, 'q = τ t', { c: 'rl' }) +
        dimv(446, 54, 66, 't') +
        L(416, 54, 450, 54, 'dm') + L(416, 66, 450, 66, 'dm'),
        '벽 두께가 달라도 전단 흐름 $q=\\tau t$는 벽을 따라 일정합니다. 그래서 전단 응력은 벽이 얇은 곳에서 가장 큽니다.');
    },
    // s07 — sign convention: positive V and M on the two faces of a cut
    sSignVM() {
      return fig(560, 200, '보를 자른 두 면에서 양의 전단력 V와 양의 굽힘 모멘트 M의 방향',
        R(60, 90, 140, 30, 'bm') + R(360, 90, 140, 30, 'bm') +
        A(214, 70, 214, 130, 'ld') + T(222, 134, 'V', { a: 'start', c: 'lb' }) +
        A(346, 140, 346, 80, 'ld') + T(338, 78, 'V', { a: 'end', c: 'lb' }) +
        mom(200, 105, 44, -50, 50, 'rx') + T(236, 58, 'M', { a: 'start', c: 'rl' }) +
        mom(360, 105, 44, 230, 130, 'rx') + T(324, 58, 'M', { a: 'end', c: 'rl' }) +
        T(130, 150, '왼쪽 조각', {}) + T(430, 150, '오른쪽 조각', {}) +
        T(130, 188, '오른쪽 면: V는 아래, M은 반시계', { s: 11 }) + T(430, 188, '왼쪽 면: V는 위, M은 시계', { s: 11 }),
        '양의 굽힘 모멘트는 보를 아래로 오목하게(처지게) 휘고, 양의 전단력은 왼쪽 조각을 오른쪽 조각보다 위로 밀어 올리려 합니다. 방향이 면에 따라 바뀌는 것은 $V$와 $M$이 응력(텐서)의 합력이기 때문입니다.');
    },
    // s07 — beam with a partial uniform load and a point load, with its shear and moment diagrams
    sSFD() {
      const x0 = 90, s = 50, X = (x) => x0 + s * x;
      const vY = 175, vs = 3, mY = 318, ms = 2.5;
      const V = (x) => (x < 4 ? 12 - 3 * x : x < 6 ? 0 : -12);
      const M = (x) => (x <= 4 ? 12 * x - 1.5 * x * x : x <= 6 ? 24 : 24 - 12 * (x - 6));
      return fig(560, 350, '부분 등분포하중과 집중하중을 받는 단순보, 그 아래 전단력 선도와 굽힘 모멘트 선도',
        R(X(0), 52, 400, 10, 'bm') + pin(X(0), 62, 0.8) + roller(X(8), 62, 0.8) +
        dist(X(0), X(4), 52, 28, 28, 9) + T(X(2), 18, '3 kN/m', { c: 'lb' }) +
        A(X(6), 16, X(6), 51, 'ld') + T(X(6) + 8, 22, '12 kN', { a: 'start', c: 'lb' }) +
        T(X(0) - 14, 66, 'A', { a: 'end' }) + T(X(8) + 14, 66, 'B', { a: 'start' }) +
        T(X(0) - 8, 110, '12 kN', { a: 'end', c: 'rl' }) + T(X(8) + 8, 110, '12 kN', { a: 'start', c: 'rl' }) +
        L(X(0), vY, X(8), vY, 'ax') + T(X(0) - 12, vY + 4, 'V', { a: 'end', c: 'it' }) +
        P(`M${X(0)},${vY}` + fn(x0, vY, s, vs, V, 0, 3.999, 40).replace(/^M/, 'L') + `L${X(4)},${vY}L${X(6)},${vY}L${X(6)},${vY + 36}L${X(8)},${vY + 36}L${X(8)},${vY}Z`, 'fl2') +
        P(fn(x0, vY, s, vs, V, 0, 3.999, 40) + `L${X(4)},${vY}L${X(6)},${vY}L${X(6)},${vY + 36}L${X(8)},${vY + 36}L${X(8)},${vY}`, 'cv') + L(X(0), vY, X(0), vY - 36, 'cv') +
        T(X(0) + 6, vY - 40, '+12', { a: 'start' }) + T(X(7), vY + 52, '−12', {}) + T(X(4) + 4, vY - 6, 'V = 0', { a: 'start' }) +
        L(X(0), mY, X(8), mY, 'ax') + T(X(0) - 12, mY + 4, 'M', { a: 'end', c: 'it' }) +
        P(area(x0, mY, s, ms, M, 0, 8, 160), 'fl2') + P(fn(x0, mY, s, ms, M, 0, 8, 160), 'cv') +
        T(X(5), mY - 68, '24 kN·m', { c: 'lb' }) + L(X(4), vY + 60, X(4), mY, 'dm ds') + L(X(6), vY + 60, X(6), mY, 'dm ds') +
        T(X(2), mY + 18, '포물선', {}) + T(X(7), mY + 18, '직선', {}),
        '분포하중 구간에서 $V$는 기울기 $-w$의 직선, $M$은 포물선입니다. $V=0$인 구간 $4\\le x\\le6$에서 $M$이 최대로 일정합니다(순수 굽힘).');
    },
    // s08 — a beam segment bent into an arc about O, and the linear stress distribution through the depth
    sBendDef() {
      const O = [170, 20], pt = (r, t) => [O[0] + r * Math.sin(t), O[1] + r * Math.cos(t)], d2 = (Math.PI / 180) * 24;
      const arc = (r, a, b) => { const [x0, y0] = pt(r, a), [x1, y1] = pt(r, b); return `M${x0.toFixed(1)},${y0.toFixed(1)}A${r},${r} 0 0 ${a < b ? 0 : 1} ${x1.toFixed(1)},${y1.toFixed(1)}`; };
      const [ax, ay] = pt(125, -d2), [bx, by] = pt(175, -d2), [cx2, cy2] = pt(125, d2), [dx, dy] = pt(175, d2);
      const body = `M${ax.toFixed(1)},${ay.toFixed(1)}` + arc(125, -d2, d2).replace(/^M[^A]*/, '') + `L${dx.toFixed(1)},${dy.toFixed(1)}` + arc(175, d2, -d2).replace(/^M[^A]*/, '') + 'Z';
      const y0 = 140, h = 60, xs = 430, sm = 46;
      return fig(560, 240, '굽힌 보 조각: 곡률 중심 O, 중립면, 위는 압축 아래는 인장인 선형 응력 분포',
        P(body, 'bm2') + P(arc(150, -d2, d2), 'gd ds') +
        L(O[0], O[1], ax, ay, 'dm ds') + L(O[0], O[1], cx2, cy2, 'dm ds') + C(O[0], O[1], 3, 'jt') + T(O[0] + 8, O[1] + 4, 'O', { a: 'start' }) +
        T(O[0] - 4, 88, 'ρ', { a: 'end', c: 'it' }) + T(O[0], pt(150, 0)[1] + 16, '중립면', { s: 11 }) +
        T(O[0], pt(125, 0)[1] - 6, '압축 (줄어듦)', { s: 11 }) + T(O[0], pt(175, 0)[1] + 16, '인장 (늘어남)', { s: 11 }) +
        mom(bx - 20, by - 25, 22, 250, 110, 'ld') + mom(dx + 20, dy - 25, 22, -70, 70, 'ld') + T(bx - 46, by - 50, 'M', { a: 'end', c: 'lb' }) + T(dx + 46, dy - 50, 'M', { a: 'start', c: 'lb' }) +
        L(xs, y0 - 10, xs, y0 + h + 10, 'ax') + L(xs - 60, y0 + h / 2, xs + 70, y0 + h / 2, 'dm ds') + T(xs + 72, y0 + h / 2 + 4, '중립축', { a: 'start', s: 11 }) +
        P(`M${xs},${y0}L${xs - sm},${y0}L${xs},${y0 + h / 2}Z`, 'fl2') + P(`M${xs},${y0 + h}L${xs + sm},${y0 + h}L${xs},${y0 + h / 2}Z`, 'fl2') +
        L(xs - sm, y0, xs + sm, y0 + h, 'cv') + A(xs, y0, xs - sm, y0, 'ld', 7) + A(xs, y0 + h, xs + sm, y0 + h, 'ld', 7) +
        T(xs - sm - 4, y0 + 4, '−σ_m', { a: 'end', c: 'lb' }) + T(xs + sm + 4, y0 + h + 4, '+σ_m', { a: 'start', c: 'lb' }) + T(xs, y0 + h + 34, 'σ_x = −My/I', {}),
        '양의 굽힘 모멘트에서 보는 위로 오목하게 휩니다. 중립면의 길이는 그대로이고, 위 섬유는 줄고 아래 섬유는 늘어 변형률과 응력이 깊이에 선형입니다.');
    },
    // s08 — T-section: centroid, neutral axis, and the bending stress distribution for M = 3 kN·m
    sTbeam() {
      const k = 1.6, yb = 200, cyN = yb - 67.78 * k;
      return fig(560, 240, 'T형 단면의 도심과 중립축, M = 3 kN·m일 때 굽힘 응력 분포',
        R(120, 40, 160, 32, 'bm') + R(184, 72, 32, 128, 'bm') +
        L(96, cyN, 300, cyN, 'dm ds') + T(92, cyN + 4, '중립축', { a: 'end', s: 11 }) +
        dim(120, 280, 26, '100') + dimv(300, 40, 72, '20') + dimv(232, 72, 200, '80') + dim(184, 216, 218, '20', { below: true }) +
        dimv(104, cyN, yb, '67.8', { left: true }) +
        L(430, 34, 430, 206, 'ax') + L(430, cyN, 520, cyN, 'dm ds') +
        P(`M430,40L${430 - 30.76 * 1.4},40L430,${cyN}Z`, 'fl2') + P(`M430,200L${430 + 64.71 * 1.4},200L430,${cyN}Z`, 'fl2') +
        L(430 - 30.76 * 1.4, 40, 430 + 64.71 * 1.4, 200, 'cv') +
        T(430 - 30.76 * 1.4 - 4, 44, '−30.8', { a: 'end', c: 'lb' }) + T(430 + 64.71 * 1.4 - 4, 218, '+64.7 MPa', { a: 'end', c: 'lb' }),
        '중립축은 단면의 도심을 지나므로 플랜지 쪽으로 치우칩니다. 도심에서 먼 아래 끝의 인장 응력이 가장 큽니다(단위 mm).');
    },
    // s09 — shear stress over a rectangle (parabola) and over an I-section (flat web, jump into the flanges)
    sTauDist() {
      const rect = R(60, 40, 60, 160, 'bm') + L(40, 120, 250, 120, 'dm ds') +
        P('M150,40' + [...Array(41)].map((_, i) => { const y = -80 + 4 * i; return `L${(150 + 72 * (1 - (y / 80) ** 2)).toFixed(1)},${(120 + y).toFixed(1)}`; }).join('') + 'L150,200Z', 'fl2') +
        L(150, 34, 150, 206, 'ax') + T(226, 124, 'τ_max = 3V/2A', { a: 'start', c: 'lb' }) + T(90, 222, '직사각형', {});
      const tw = (y) => (Math.abs(y) <= 65 ? 38.09 - (31.71 - 38.09) * 0 - (38.09 - 31.71) * (y / 65) ** 2 : 2.11 * (75 - Math.abs(y)) / 10);
      let d = 'M420,45';
      for (let i = 0; i <= 150; i++) { const y = -75 + i; d += `L${(420 + 2.2 * tw(y)).toFixed(1)},${(120 + y).toFixed(1)}`; }
      const ibeam = R(310, 45, 60, 10, 'bm') + R(335, 55, 10, 130, 'bm') + R(310, 185, 60, 10, 'bm') + L(300, 120, 540, 120, 'dm ds') +
        P(d + 'L420,195Z', 'fl2') + L(420, 38, 420, 202, 'ax') +
        T(510, 124, 'τ_max', { a: 'start', c: 'lb' }) + T(495, 60, '플랜지로 넘어가며 급감', { a: 'middle', s: 11 }) + T(340, 222, 'I형 단면', {});
      return fig(560, 235, '직사각형 단면의 포물선 전단 응력 분포와 I형 단면의 전단 응력 분포', rect + ibeam,
        '직사각형은 중립축에서 평균의 1.5배. I형은 웹이 전단력의 대부분을 거의 균일하게 받고, 플랜지로 넘어가면 폭 $t$가 커져 $\\tau$가 갑자기 작아집니다.');
    },
    // s10 — cantilever with a tip load: the elastic curve, tip deflection and tip slope
    sElastic() {
      const x0 = 90, Lp = 380, s = 60;
      const v = (x) => -(x * x * (3 - x)) / 2; // normalised: v(1) = -1
      return fig(560, 230, '끝에 하중을 받는 외팔보의 처짐 곡선, 끝 처짐과 끝 기울기',
        wall(x0, 40, 140, 'left') + R(x0, 64, Lp, 10, 'gd ds') +
        P(fn(x0, 69, Lp, s, (t) => v(t), 0, 1, 80), 'cv') +
        A(x0 + Lp, 69 + s - 50, x0 + Lp, 69 + s - 4, 'ld') + T(x0 + Lp + 8, 69 + s - 30, 'P', { a: 'start', c: 'lb' }) +
        L(x0 + Lp, 69, x0 + Lp, 69 + s, 'dm ds') + dimv(x0 + Lp + 30, 69, 69 + s, 'v_max') +
        L(x0 + Lp - 110, 69 + s - 1.5 * 110 / Lp * s, x0 + Lp + 20, 69 + s + 1.5 * 20 / Lp * s, 'rx ds') + T(x0 + Lp - 120, 69 + s + 24, 'θ = PL²/2EI', { a: 'end', c: 'rl' }) +
        A(x0, 190, x0 + 60, 190, 'ax') + A(x0, 190, x0, 150, 'ax') + T(x0 + 64, 194, 'x', { a: 'start', c: 'it' }) + T(x0, 144, 'v', { c: 'it' }) +
        T(x0 - 6, 88, 'v = 0, v′ = 0', { a: 'end', s: 11 }) + dim(x0, x0 + Lp, 210, 'L'),
        '고정단에서는 처짐과 기울기가 모두 0이고, 자유단에서는 모멘트와 전단력이 하중으로 정해집니다. 곡선은 $EIv\'\'=M(x)$를 두 번 적분해 얻습니다(처짐은 크게 과장).');
    },
    // s11 — a cantilevered round shaft with a rigid arm: the force at C becomes shear, torque and bending at A
    sCombined() {
      return fig(560, 250, '벽에 고정된 원형 축 AB와 B에 붙은 강체 팔 BC, C에 수직력 P',
        wall(90, 60, 190, 'left') +
        P('M90,110L330,110L330,150L90,150Z', 'bm') + `<ellipse class="bm" cx="330" cy="130" rx="9" ry="20"/>` +
        P('M330,122L440,178L440,190L330,138Z', 'bm2') +
        A(440, 186, 440, 238, 'ld') + T(448, 226, 'P = 800 N', { a: 'start', c: 'lb' }) +
        C(100, 110, 3.5, 'dotf') + T(104, 100, 'H', { a: 'start' }) +
        T(84, 170, 'A', { a: 'end' }) + T(328, 98, 'B', { a: 'middle' }) + T(450, 176, 'C', { a: 'start' }) +
        dim(90, 330, 36, '0.25 m') + L(330, 42, 330, 108, 'dm ds') + L(90, 42, 90, 58, 'dm ds') +
        T(392, 140, '0.3 m', { a: 'start', s: 11 }) + T(210, 136, 'd = 40 mm', {}),
        '$C$의 힘을 축 끝 $B$로 옮기면 힘 $P$와 비틀림 모멘트 $P\\cdot BC$가 되고, 고정단 쪽 단면에서는 굽힘 모멘트 $P\\cdot AB$가 더해집니다. 점 $H$는 고정단 가까이 축의 윗면입니다.');
    },
    // s11 — a loaded cantilever whose tip rests on the middle of a simply supported beam
    sBeamOnBeam() {
      return fig(560, 240, '등분포하중을 받는 외팔보 AB의 끝 B가 짧은 받침을 거쳐 단순보 CD의 가운데를 누름',
        wall(80, 34, 104, 'left') + R(80, 64, 200, 10, 'bm') + dist(80, 280, 64, 26, 26, 9) + T(180, 26, 'w = 6 kN/m', { c: 'lb' }) +
        L(280, 74, 280, 150, 'th') + C(280, 74, 3.5, 'jt') + C(280, 150, 3.5, 'jt') + T(290, 88, 'B', { a: 'start' }) + T(70, 60, 'A', { a: 'end' }) +
        R(80, 150, 400, 10, 'bm2') + pin(80, 160, 0.8) + roller(480, 160, 0.8) + T(68, 166, 'C', { a: 'end' }) + T(494, 166, 'D', { a: 'start' }) +
        dim(80, 280, 212, '2 m') + dim(80, 480, 232, '4 m'),
        '두 보가 $B$에서 주고받는 힘 $R$을 미지수로 두고, 외팔보 끝의 처짐과 단순보 가운데의 처짐이 같다는 적합 조건을 씁니다(받침은 강체).');
    },
    // s12 — Mohr's circle for sigma_x = 60, sigma_y = -20, tau_xy = 30 MPa (B&J convention: X at (sigma_x, -tau_xy), tau up)
    sMohr() {
      const k = 2.4, ox = 200, oy = 150, S = (s) => ox + k * s, Tq = (t) => oy - k * t;
      const cx = S(20), r = 50 * k;
      const X = [S(60), Tq(-30)], Y = [S(-20), Tq(30)];
      const a1 = Math.atan2(oy - X[1], X[0] - cx); // screen-angle of CX (negative: below)
      return fig(560, 300, '모어 원: 중심 C(20, 0), 반지름 50 MPa, 점 X(60, −30)와 Y(−20, 30), 주응력 70과 −30',
        A(90, oy, 520, oy, 'ax') + A(ox, 280, ox, 18, 'ax') + T(524, oy + 4, 'σ', { a: 'start', c: 'it' }) + T(ox + 8, 22, 'τ', { a: 'start', c: 'it' }) +
        C(cx, oy, r, 'cv') + L(X[0], X[1], Y[0], Y[1], 'ld') + C(X[0], X[1], 4, 'dotf') + C(Y[0], Y[1], 4, 'dotf') + C(cx, oy, 3, 'dotf') +
        T(X[0] + 8, X[1] + 16, 'X (σ_x, −τ_xy)', { a: 'start', c: 'lb' }) + T(Y[0] - 8, Y[1] - 8, 'Y (σ_y, τ_xy)', { a: 'end', c: 'lb' }) + T(cx, oy + 18, 'C', {}) +
        C(cx + r, oy, 3.5, 'dotf') + C(cx - r, oy, 3.5, 'dotf') + T(cx + r + 6, oy - 8, 'σ_1 = 70', { a: 'start', c: 'rl' }) + T(cx - r - 6, oy - 8, 'σ_2 = −30', { a: 'end', c: 'rl' }) +
        L(cx, oy, cx, oy - r, 'dm ds') + T(cx + 6, oy - r - 6, 'τ_max = R = 50', { a: 'start', c: 'rl' }) +
        P(`M${cx + 42},${oy}A42,42 0 0 1 ${cx + 42 * Math.cos(a1)},${oy - 42 * Math.sin(a1)}`, 'rx') + T(cx + 50, oy + 22, '2θ_p', { a: 'start', c: 'rl' }),
        '지름 $XY$를 반시계로 $2\\theta_p=36.9°$ 돌리면 가로축과 만나 주응력 점이 됩니다. 요소도 같은 방향으로 $\\theta_p=18.4°$ 돌리면 주평면입니다. 원의 꼭대기가 면내 최대 전단 응력입니다(단위 MPa).');
    },
    // s12 — the wedge used to derive the transformation equations
    sWedge() {
      return fig(560, 240, '평면 응력 요소를 경사면으로 자른 쐐기: 경사면의 법선 x′가 x축과 각 θ',
        P('M150,200L150,60L310,200Z', 'bm') +
        A(148, 130, 100, 130, 'ld') + T(96, 124, 'σ_x ΔA cos θ', { a: 'end', c: 'lb', s: 11 }) +
        A(144, 100, 144, 160, 'rx') + T(96, 176, 'τ_xy ΔA cos θ', { a: 'end', c: 'rl', s: 11 }) +
        A(230, 202, 230, 244, 'ld') + T(238, 236, 'σ_y ΔA sin θ', { a: 'start', c: 'lb', s: 11 }) +
        A(260, 208, 200, 208, 'rx') + T(196, 228, 'τ_xy ΔA sin θ', { a: 'end', c: 'rl', s: 11 }) +
        A(230, 130, 276, 77, 'ld') + T(282, 74, 'σ_x′ ΔA', { a: 'start', c: 'lb' }) +
        A(230, 130, 177, 84, 'rx') + T(172, 82, 'τ_x′y′ ΔA', { a: 'end', c: 'rl' }) +
        T(236, 176, 'ΔA', { a: 'start' }) + P('M150,90A30,30 0 0 0 172.6,79.7', 'dm') + T(158, 108, 'θ', { a: 'start', c: 'it' }),
        '경사면의 넓이를 $\\Delta A$라 하면 세로면은 $\\Delta A\\cos\\theta$, 밑면은 $\\Delta A\\sin\\theta$입니다. $x\'$, $y\'$ 방향의 힘 평형에서 변환 공식이 나옵니다.');
    },
    // s13 — thin cylinder: a wall element with hoop and axial stress, and the half-cylinder free body
    sVessel() {
      const cy = 120;
      return fig(560, 250, '얇은 원통 압력 용기: 벽 요소의 원주 응력과 축 응력, 반원통의 자유물체도',
        P(`M60,${cy - 60}L230,${cy - 60}A22,60 0 0 1 230,${cy + 60}L60,${cy + 60}A22,60 0 0 1 60,${cy - 60}Z`, 'bm') +
        `<ellipse class="gd ds" cx="230" cy="${cy}" rx="22" ry="60"/>` +
        R(128, cy - 14, 30, 28, 'sp') +
        A(143, cy - 16, 143, cy - 48, 'ld') + A(143, cy + 16, 143, cy + 48, 'ld') + T(150, cy - 40, 'σ_1', { a: 'start', c: 'lb' }) +
        A(160, cy, 196, cy, 'rx') + A(126, cy, 90, cy, 'rx') + T(198, cy - 6, 'σ_2', { a: 'start', c: 'rl' }) +
        T(145, cy + 84, '원통 벽의 요소', {}) +
        P(`M340,${cy + 60}A60,60 0 0 1 460,${cy + 60}L448,${cy + 60}A48,48 0 0 0 352,${cy + 60}Z`, 'bm') +
        [0.18, 0.34, 0.5, 0.66, 0.82].map((f) => { const a = Math.PI * (1 - f), x = 400 + 26 * Math.cos(a), y = cy + 60 - 26 * Math.sin(a), x2 = 400 + 46 * Math.cos(a), y2 = cy + 60 - 46 * Math.sin(a); return A(x, y, x2, y2, 'ld', 7); }).join('') +
        A(346, cy + 64, 346, cy + 100, 'rx') + A(454, cy + 64, 454, cy + 100, 'rx') + T(462, cy + 96, 'σ_1 t Δx', { a: 'start', c: 'rl' }) +
        T(400, cy + 48, 'p', { c: 'lb' }) + dim(352, 448, cy + 118, '2r') + T(400, cy - 12, '반원통 (길이 Δx)', {}),
        '반원통의 수직 평형: 압력의 합력 $p(2r\\Delta x)$를 두 벽 단면의 힘 $2\\sigma_1t\\Delta x$가 받아 $\\sigma_1=pr/t$. 축방향은 끝판의 압력 $p\\pi r^2$을 둘레 벽 $2\\pi rt$가 받아 $\\sigma_2=pr/2t$입니다.');
    },
    // s14 — yield loci in the (sigma_a, sigma_b) plane: Tresca hexagon inside the von Mises ellipse
    sYieldLoci() {
      const o = [280, 130], k = 80, X = (s) => o[0] + k * s, Y = (s) => o[1] - k * s;
      let el = '';
      for (let i = 0; i <= 120; i++) { const t = (2 * Math.PI * i) / 120, a = Math.cos(t) - Math.sin(t) / Math.sqrt(3), b = Math.cos(t) + Math.sin(t) / Math.sqrt(3); el += `${i ? 'L' : 'M'}${X(a).toFixed(1)},${Y(b).toFixed(1)}`; }
      const hex = [[1, 0], [1, 1], [0, 1], [-1, 0], [-1, -1], [0, -1]].map(([a, b], i) => `${i ? 'L' : 'M'}${X(a)},${Y(b)}`).join('') + 'Z';
      return fig(560, 270, '주응력 평면에서 트레스카 육각형과 폰 미제스 타원',
        A(X(-1.6), o[1], X(1.7), o[1], 'ax') + A(o[0], Y(-1.45), o[0], Y(1.5), 'ax') + T(X(1.72), o[1] + 4, 'σ_a', { a: 'start', c: 'it' }) + T(o[0] + 6, Y(1.48), 'σ_b', { a: 'start', c: 'it' }) +
        P(el + 'Z', 'fl') + P(el, 'cv') + P(hex, 'ld') +
        T(X(1) + 4, o[1] + 16, 'σ_Y', { a: 'start' }) + T(o[0] - 6, Y(1) - 4, 'σ_Y', { a: 'end' }) + T(X(-1) - 4, o[1] + 16, '−σ_Y', { a: 'end' }) +
        T(X(1.18), Y(1.28), '폰 미제스', { a: 'start', c: 'lb' }) + T(X(0.55), Y(0.62), '트레스카', { a: 'end', c: 'lb' }) +
        L(X(0.577), Y(-0.577), X(-0.577), Y(0.577), 'dm ds') + T(X(0.62), Y(-0.66), '순수 전단 선', { a: 'start', s: 11 }),
        '두 기준은 단축 응력(축 위의 네 점)과 등이축 응력(1사분면·3사분면 꼭짓점)에서 같고, 순수 전단($\\sigma_b=-\\sigma_a$)에서 가장 다릅니다: 트레스카 $\\tau_Y=\\sigma_Y/2$, 폰 미제스 $\\sigma_Y/\\sqrt3$.');
    },
    // s15 — four end conditions, their first buckled shapes and effective lengths
    sEndCond() {
      const top = 50, bot = 210, H = bot - top, cols = [
        { x: 80, name: '핀-핀', le: 'L_e = L', f: (s) => Math.sin(Math.PI * s), fixB: false, fixT: false, free: false },
        { x: 210, name: '고정-자유', le: 'L_e = 2L', f: (s) => 1 - Math.cos((Math.PI * s) / 2), fixB: true, fixT: false, free: true },
        { x: 340, name: '고정-고정', le: 'L_e = 0.5L', f: (s) => 0.5 * (1 - Math.cos(2 * Math.PI * s)), fixB: true, fixT: true, free: false },
        { x: 470, name: '고정-핀', le: 'L_e ≈ 0.7L', f: (s) => { const k = 4.4934; return (Math.sin(k * s) / k - Math.cos(k * s) + 1 - s) / 1.3983; }, fixB: true, fixT: false, free: false },
      ];
      const shape = (c) => { let d = ''; for (let i = 0; i <= 60; i++) { const s = i / 60; d += `${i ? 'L' : 'M'}${(c.x + 28 * c.f(s)).toFixed(1)},${(bot - H * s).toFixed(1)}`; } return d; };
      return fig(560, 270, '끝 조건이 다른 네 기둥의 첫 좌굴 모양과 유효 길이',
        cols.map((c) => L(c.x, top, c.x, bot, 'gd ds') + P(shape(c), 'cv') +
          (c.fixB ? ground(c.x - 20, c.x + 20, bot) : pin(c.x, bot, 0.7)) +
          (c.fixT ? ground(c.x - 20, c.x + 20, top, false) : c.free ? '' : `<g transform="translate(0,0)">${L(c.x - 12, top, c.x + 12, top, 'gd')}${C(c.x, top, 2.5, 'jt')}</g>`) +
          A(c.x + (c.free ? 28 : 0), top - 34, c.x + (c.free ? 28 : 0), top - 4, 'ld') +
          T(c.x, bot + 34, c.name, {}) + T(c.x, bot + 52, c.le, { c: 'lb' })).join('') +
        T(24, top - 24, 'P', { c: 'lb' }),
        '유효 길이 $L_e$는 좌굴 모양에서 변곡점 사이(사인 곡선 반 파장)의 길이입니다. $P_{cr}=\\pi^2EI/L_e^2$이므로 양끝을 고정하면 핀-핀의 네 배를 견딥니다.');
    },
    // s02 — plane stress element with positive sigma_x, sigma_y, tau_xy
    sElement() {
      const x0 = 220, y0 = 70, s = 120, cx = x0 + s / 2, cy = y0 + s / 2;
      return fig(560, 260, '양의 방향으로 그린 평면 응력 요소: 수직 응력과 전단 응력',
        R(x0, y0, s, s, 'bm') +
        A(x0 + s + 2, cy, x0 + s + 50, cy, 'ld') + T(x0 + s + 56, cy + 4, 'σ_x', { a: 'start', c: 'lb' }) +
        A(x0 - 2, cy, x0 - 50, cy, 'ld') +
        A(cx, y0 - 2, cx, y0 - 46, 'ld') + T(cx + 8, y0 - 34, 'σ_y', { a: 'start', c: 'lb' }) +
        A(cx, y0 + s + 2, cx, y0 + s + 46, 'ld') +
        A(x0 + s + 10, y0 + s - 14, x0 + s + 10, y0 + 14, 'rx') + T(x0 + s + 16, y0 + 30, 'τ_xy', { a: 'start', c: 'rl' }) +
        A(x0 - 10, y0 + 14, x0 - 10, y0 + s - 14, 'rx') +
        A(x0 + 14, y0 - 10, x0 + s - 14, y0 - 10, 'rx') + T(x0 + s - 10, y0 - 16, 'τ_yx', { a: 'start', c: 'rl' }) +
        A(x0 + s - 14, y0 + s + 10, x0 + 14, y0 + s + 10, 'rx') +
        A(80, 220, 130, 220, 'ax') + A(80, 220, 80, 170, 'ax') + T(136, 224, 'x', { a: 'start', c: 'it' }) + T(80, 162, 'y', { c: 'it' }),
        '양의 면(바깥 법선이 $+x$, $+y$)에서는 양의 방향, 음의 면에서는 음의 방향을 가리키는 성분이 양수입니다. 모멘트 평형에서 $\\tau_{xy}=\\tau_{yx}$입니다.');
    },
  });
})();
