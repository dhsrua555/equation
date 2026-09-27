/* 로봇공학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다. 그리는 도구는 core/figkit.js(FK)입니다. */
(function () {
  const { fig, L, A, T, R, C, P, ground, pin, dim, dimv, mom, fn, f1 } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  // a link from (x1,y1) to (x2,y2) with revolute joints drawn at both ends
  const link = (x1, y1, x2, y2) => L(x1, y1, x2, y2, 'th') + C(x1, y1, 5, 'jt') + C(x2, y2, 5, 'jt');
  // planar frame: origin, angle (math degrees, y up), axis length, subscript
  const frame = (x, y, a, len, sub) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return A(x, y, x + len * c, y - len * s, 'vl', 8) + A(x, y, x - len * s, y - len * c, 'vl', 8) +
      T(x + (len + 12) * c, y - (len + 12) * s + 4, 'x_' + sub, { c: 'it' }) + T(x - (len + 12) * s, y - (len + 12) * c + 4, 'y_' + sub, { c: 'it' });
  };
  // arc marking an angle at (x,y) from a0 to a1 (math degrees)
  const arc = (x, y, r, a0, a1, cls = 'dm') => {
    const p = (a) => [x + r * Math.cos(rad(a)), y - r * Math.sin(rad(a))];
    const [xa, ya] = p(a0), [xb, yb] = p(a1);
    return `<path class="${cls}" d="M${f1(xa)},${f1(ya)}A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f1(xb)},${f1(yb)}"/>`;
  };
  // a planar friction cone at contact (x,y) around inward normal angle n (math deg), half-angle al, length len
  const cone = (x, y, n, al, len) => {
    const e = (a) => [x + len * Math.cos(rad(a)), y - len * Math.sin(rad(a))];
    const [x1, y1] = e(n - al), [x2, y2] = e(n + al);
    return P(`M${f1(x)},${f1(y)}L${f1(x1)},${f1(y1)}L${f1(x2)},${f1(y2)}Z`, 'fl2') + L(x, y, x1, y1, 'ld') + L(x, y, x2, y2, 'ld');
  };
  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // r01 — a coin on a table: three points with fixed distances, or one point and an angle
    rCoin() {
      const pa = [150, 92], pb = [222, 100], pc = [172, 160];
      const cx = 420, cy = 120, th = 30;
      return fig(560, 230, '탁자 위의 동전: 왼쪽은 세 점 A, B, C의 좌표 6개와 거리 구속 3개, 오른쪽은 한 점의 위치 (x, y)와 각 θ',
        C(185, 122, 72, 'sp') + L(...pa, ...pb, 'dm ds') + L(...pb, ...pc, 'dm ds') + L(...pc, ...pa, 'dm ds') +
        [pa, pb, pc].map((q) => C(q[0], q[1], 4, 'jt')).join('') + T(pa[0] - 10, pa[1] - 6, 'A', { c: 'it' }) + T(pb[0] + 10, pb[1] - 6, 'B', { c: 'it' }) + T(pc[0] - 4, pc[1] + 20, 'C', { c: 'it' }) +
        T(185, 222, '좌표 6개 − 거리 구속 3개 = 3', { s: 11 }) +
        C(cx, cy, 72, 'sp') + frame(cx, cy, th, 56, 'b') + L(cx, cy, cx + 90, cy, 'dm ds') + arc(cx, cy, 30, 0, th) + T(cx + 40, cy - 8, 'θ', { c: 'it' }) +
        A(290, 180, 330, 180, 'vl', 7) + A(290, 180, 290, 140, 'vl', 7) + T(336, 184, 'x', { a: 'start', c: 'it' }) + T(290, 132, 'y', { c: 'it' }) + C(cx, cy, 3.5, 'jt') + T(cx - 10, cy + 20, '(x, y)', { a: 'end', s: 12 }) +
        T(cx, 222, '(x, y, θ): 독립 좌표 3개', { s: 11 }),
        '평면 위 강체는 자유도 3. 세 점의 좌표 여섯 개 사이에 거리가 일정하다는 독립 구속이 세 개 있기 때문입니다. 물체에 좌표계를 붙이면 원점의 위치 두 개와 방향각 하나로 같은 정보를 담습니다.');
    },
    // r01 — planar four-bar linkage: N = 4 links (ground included), J = 4 revolute joints
    rFourBar() {
      const O1 = [140, 200], O4 = [420, 200], Pa = [185, 95], Pb = [370, 70];
      return fig(560, 240, '평면 4절 링크: 고정 링크(바닥)를 포함해 링크 4개, 회전 관절 4개. 그뤼블러 공식으로 자유도 1',
        L(100, 200, 460, 200, 'dm ds') + pin(...O1) + pin(...O4) + link(...O1, ...Pa) + link(...Pa, ...Pb) + link(...Pb, ...O4) +
        T(152, 146, 'L_1', { a: 'end', c: 'it' }) + T(280, 72, 'L_2', { c: 'it' }) + T(404, 136, 'L_3', { a: 'start', c: 'it' }) + T(280, 192, 'L_4 (바닥)', { c: 'it' }) +
        arc(...O1, 34, 0, 67) + T(O1[0] + 42, O1[1] - 22, 'θ_1', { c: 'it' }) +
        T(Pa[0] - 12, Pa[1] - 8, '관절 2', { a: 'end', s: 11 }) + T(Pb[0] + 10, Pb[1] - 8, '관절 3', { a: 'start', s: 11 }) + T(O1[0] - 16, O1[1] + 8, '관절 1', { a: 'end', s: 11 }) + T(O4[0] + 16, O4[1] + 8, '관절 4', { a: 'start', s: 11 }),
        '$N=4$, $J=4$, 관절마다 $f_i=1$: $3(4-1-4)+4=1$. 크랭크 각 $\\theta_1$ 하나를 정하면 나머지 모양이 정해집니다(조립 방식을 고른 뒤). 닫힌 고리 조건 두 개가 네 관절각 사이에 걸려 있습니다.');
    },
    // r01 — a parallelogram linkage with a redundant middle crank: Grübler says 0 but it moves
    rParallel() {
      const g = [140, 280, 420], v = [60, -110], v2 = [-32, -121];
      const top = g.map((x) => [x + v[0], 200 + v[1]]), top2 = g.map((x) => [x + v2[0], 200 + v2[1]]);
      return fig(560, 240, '가운데에 같은 길이의 크랭크를 하나 더 단 평행사변형 링크: 그뤼블러 공식은 자유도 0이지만 실제로는 움직인다',
        L(100, 200, 470, 200, 'dm ds') + g.map((x) => pin(x, 200)).join('') +
        top2.map((t, i) => L(g[i], 200, t[0], t[1], 'gd ds')).join('') + L(top2[0][0], top2[0][1], top2[2][0], top2[2][1], 'gd ds') +
        top.map((t, i) => link(g[i], 200, t[0], t[1])).join('') + L(top[0][0], top[0][1], top[2][0], top[2][1], 'th') +
        T(360, 72, '연결 막대', { s: 11 }) + T(290, 232, 'N = 5, J = 6 → 3(5 − 1 − 6) + 6 = 0', { s: 12 }),
        '세 크랭크가 길이와 간격이 모두 같아 가운데 크랭크가 주는 구속 두 개가 나머지 구속에서 이미 따라 나옵니다(독립이 아님). 그뤼블러 공식은 구속이 독립이라고 가정하므로 이런 특수한 치수에서 자유도를 적게 셉니다. 점선은 조금 움직인 모습입니다.');
    },
    // r02 — C-space of a 2R arm: a square with opposite edges glued is a torus
    rTorus() {
      const x0 = 250, y0 = 40, s = 150;
      const mark = (x1, y1, x2, y2, n) => { let o = ''; for (let k = 0; k < n; k++) { const t = 0.46 + 0.06 * k; o += A(x1 + (x2 - x1) * (t - 0.05), y1 + (y2 - y1) * (t - 0.05), x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 'ld', 9); } return o; };
      return fig(560, 240, '2R 팔의 C-공간: 두 관절각 (θ₁, θ₂)의 정사각형에서 마주 보는 변을 붙이면 토러스가 된다',
        pin(80, 190) + link(80, 190, 140, 110) + link(140, 110, 215, 128) + arc(80, 190, 26, 0, 53) + T(114, 178, 'θ_1', { c: 'it' }) + arc(140, 110, 22, -13, 53) + T(170, 102, 'θ_2', { c: 'it' }) +
        R(x0, y0, s, s, 'bm2') + mark(x0, y0 + s, x0 + s, y0 + s, 1) + mark(x0, y0, x0 + s, y0, 1) + mark(x0, y0 + s, x0, y0, 2) + mark(x0 + s, y0 + s, x0 + s, y0, 2) +
        T(x0 + s / 2, y0 + s + 20, 'θ_1 : 0 → 2π', { s: 12 }) + T(x0 - 8, y0 + s / 2, 'θ_2', { a: 'end', c: 'it' }) +
        `<ellipse class="gd" cx="480" cy="115" rx="62" ry="36"/>` + P('M452,113Q480,128 508,113', 'gd') + P('M458,117Q480,106 502,117', 'gd') + T(480, 176, 'T² = S¹ × S¹', { s: 12 }) + T(424, 118, '=', { s: 18 }),
        '같은 화살표끼리 붙입니다: 위아래 변을 붙이면 원기둥, 원기둥의 두 끝 원을 붙이면 토러스. $\\theta_1=0$과 $2\\pi$는 같은 자세이므로 정사각형의 가장자리는 실제 경계가 아닙니다.');
    },
    // r02 — workspace of a planar 2R arm with L1 > L2: an annulus
    rWorkspace() {
      const cx = 280, cy = 125, L1 = 70, L2 = 40;
      return fig(560, 250, '평면 2R 팔(L₁ > L₂)의 작업 공간: 반지름 L₁ − L₂에서 L₁ + L₂ 사이의 고리',
        `<circle class="fl2" cx="${cx}" cy="${cy}" r="${L1 + L2}"/><circle class="bm" cx="${cx}" cy="${cy}" r="${L1 - L2}"/>` +
        `<circle class="gd" cx="${cx}" cy="${cy}" r="${L1 + L2}"/>` + pin(cx, cy, 0.8) +
        link(cx, cy, cx + L1 * Math.cos(rad(35)), cy - L1 * Math.sin(rad(35))) + link(cx + L1 * Math.cos(rad(35)), cy - L1 * Math.sin(rad(35)), cx + L1 * Math.cos(rad(35)) + L2 * Math.cos(rad(95)), cy - L1 * Math.sin(rad(35)) - L2 * Math.sin(rad(95))) +
        L(cx, cy, cx - (L1 + L2), cy, 'dm') + T(cx - (L1 + L2) / 2 - 16, cy - 6, 'L₁ + L₂', { s: 11 }) + L(cx, cy, cx + (L1 - L2) * Math.cos(rad(-60)), cy - (L1 - L2) * Math.sin(rad(-60)), 'dm') + T(cx + 26, cy + 40, 'L₁ − L₂', { a: 'start', s: 11 }),
        '끝점까지의 거리 $\\sqrt{x^2+y^2}$는 팔을 곧게 폈을 때 $L_1+L_2$, 완전히 접었을 때 $L_1-L_2$입니다. 관절 제한이 없으면 그 사이의 모든 점에 닿고, 경계 안쪽의 점에는 팔꿈치 위·아래 두 자세로 닿습니다.');
    },
    // r03 — a square object held by four frictionless point contacts arranged like a pinwheel
    rNails() {
      const cx = 280, cy = 125, h = 70, l1 = 42, l2 = 30, l3 = -42, l4 = -30;
      const nail = (x, y, dx, dy, lab) => A(x - 40 * dx, y - 40 * dy, x - 3 * dx, y - 3 * dy, 'rx') + T(x - 50 * dx + (dy ? 14 : 0), y - 50 * dy + (dx ? -8 : 4), lab, { c: 'rl' });
      return fig(560, 250, '정사각형 물체를 마찰 없는 점 접촉 네 개(못)가 바람개비 모양으로 누른다. ℓᵢ는 각 접촉이 물체 중심선에서 떨어진 거리',
        R(cx - h, cy - h, 2 * h, 2 * h, 'bm2') + L(cx - h - 20, cy, cx + h + 20, cy, 'dm ds') + L(cx, cy - h - 20, cx, cy + h + 20, 'dm ds') + C(cx, cy, 3, 'jt') +
        nail(cx + l1, cy - h, 0, 1, 'f_1') + nail(cx + h, cy - l2, -1, 0, 'f_2') + nail(cx + l3, cy + h, 0, -1, 'f_3') + nail(cx - h, cy - l4, 1, 0, 'f_4') +
        T(cx + l1 / 2, cy - h + 14, 'ℓ_1', { c: 'it', s: 11 }) + T(cx + h - 14, cy - l2 / 2 + 4, 'ℓ_2', { c: 'it', s: 11 }) + T(cx + l3 / 2, cy + h - 6, 'ℓ_3', { c: 'it', s: 11 }) + T(cx - h + 14, cy - l4 / 2 + 4, 'ℓ_4', { c: 'it', s: 11 }) +
        A(70, 225, 110, 225, 'vl', 7) + A(70, 225, 70, 185, 'vl', 7) + T(116, 229, 'x', { a: 'start', c: 'it' }) + T(70, 177, 'y', { c: 'it' }),
        '각 접촉은 물체를 법선 방향으로 밀기만 할 수 있습니다($x_i\\ge0$). 위의 $f_1$은 중심보다 오른쪽($\\ell_1>0$), 아래의 $f_3$은 왼쪽($\\ell_3<0$)을 누르므로 둘이 함께 시계 방향 모멘트를, $f_2$와 $f_4$는 반시계 방향 모멘트를 낼 수 있습니다.');
    },
    // r03 — positive span in the plane: three vectors whose convex hull misses / contains the origin
    rHull() {
      const pan = (ox, vs, ok) => {
        const sc = 60, X = (v) => ox + sc * v[0], Y = (v) => 125 - sc * v[1];
        return (ok ? P('M' + vs.map((v) => f1(X(v)) + ',' + f1(Y(v))).join('L') + 'Z', 'fl2') : P('M' + vs.map((v) => f1(X(v)) + ',' + f1(Y(v))).join('L') + 'Z', 'fl')) +
          L(ox - 100, 125, ox + 100, 125, 'ax') + L(ox, 25, ox, 225, 'ax') + vs.map((v, i) => A(ox, 125, X(v), Y(v), 'ld') + T(X(v) + (v[0] >= 0 ? 10 : -10), Y(v) + (v[1] > 0 ? -6 : 16), 'a_' + (i + 1), { a: v[0] >= 0 ? 'start' : 'end', c: 'lb' })).join('') + C(ox, 125, 3, 'jt');
      };
      return fig(560, 250, '평면의 세 벡터: 왼쪽은 볼록 껍질이 원점을 안에 담지 못해 양의 결합으로 만들 수 없는 방향이 있고, 오른쪽은 원점을 안에 담아 모든 방향을 만든다',
        pan(140, [[1, 0], [0, 1], [-1, 1]], false) + A(140, 125, 140 + 50, 125 + 55, 'rx') + T(196, 196, 'b (불가능)', { a: 'start', c: 'rl', s: 11 }) +
        pan(420, [[1, 0], [0, 1], [-1, -1]], true) + T(140, 244, '원점이 껍질 밖 → 양의 생성 ≠ ℝ²', { s: 11 }) + T(420, 244, '원점이 껍질 안 → 양의 생성 = ℝ²', { s: 11 }),
        '열벡터들의 양의 결합 $\\sum k_ia_i$ ($k_i\\ge0$)가 모든 $b$를 만들려면 볼록 껍질 $\\mathrm{conv}\\{a_i\\}$가 원점 주위의 작은 원판을 품어야 합니다. 왼쪽에서는 아래쪽을 향하는 $b$를 어떤 양의 결합으로도 만들 수 없습니다.');
    },
    // r04 — Coulomb friction cone at a point contact
    rCone() {
      const x = 280, y = 180, al = 30;
      return fig(560, 240, '점 접촉의 마찰 원뿔: 법선에서 반각 α = tan⁻¹μ 안에 있는 힘은 미끄러지지 않고 전달된다',
        R(80, y, 400, 40, 'bm') + cone(x, y, 90, al, 150) + A(x, y + 60, x, y + 4, 'dm', 7) +
        A(x, y, x + 150 * Math.sin(rad(18)), y - 150 * Math.cos(rad(18)), 'rx') + T(x + 52, y - 150, 'f (안쪽: 붙음)', { a: 'start', c: 'rl', s: 11 }) +
        P(`M${x},${y}L${f1(x - 140 * Math.sin(rad(48)))},${f1(y - 140 * Math.cos(rad(48)))}`, 'gd ds') + T(x - 112, y - 104, 'f′ (바깥: 미끄럼)', { a: 'end', s: 11 }) +
        L(x, y, x, y - 170, 'dm ds') + arc(x, y, 60, 90, 90 - al) + T(x + 14, y - 66, 'α', { a: 'start', c: 'it' }) + arc(x, y, 60, 90, 90 + al) + T(x - 14, y - 66, 'α', { a: 'end', c: 'it' }) +
        T(x + 6, y - 176, 'n', { a: 'start', c: 'it' }) + T(140, 208, '물체', { s: 11 }) + T(x + 70, y - 10, '마찰 원뿔 (반각 α)', { a: 'start', c: 'lb', s: 11 }),
        '힘을 법선 성분 $f_n$과 접선 성분 $f_t$로 나누면 붙어 있을 조건은 $\\lvert f_t\\rvert\\le\\mu f_n$, 즉 힘과 법선 사이의 각이 $\\alpha=\\tan^{-1}\\mu$ 이하. $\\mu=0$이면 원뿔이 법선 한 줄로 좁아집니다.');
    },
    // r04 — a disk of radius r squeezed by two frictional contacts at opposite ends
    rTwoContact() {
      const cx = 280, cy = 118, r = 100, al = 26;
      return fig(560, 250, '반지름 r 원판을 양 끝의 마찰 접촉 두 개가 잡는다. 각 접촉의 마찰 원뿔 모서리 ê₁…ê₄로 접촉력을 나타낸다',
        C(cx, cy, r, 'bm2') + cone(cx - r, cy, 0, al, 55) + cone(cx + r, cy, 180, al, 55) + L(cx - r, cy, cx + r, cy, 'gd ds') +
        T(cx - r + 60, cy - 28, 'e_1', { a: 'start', c: 'lb' }) + T(cx - r + 60, cy + 36, 'e_2', { a: 'start', c: 'lb' }) + T(cx + r - 60, cy + 36, 'e_3', { a: 'end', c: 'lb' }) + T(cx + r - 60, cy - 28, 'e_4', { a: 'end', c: 'lb' }) +
        A(cx - r - 60, cy, cx - r - 4, cy, 'rx') + T(cx - r - 64, cy + 4, 'f_a', { a: 'end', c: 'rl' }) + A(cx + r + 60, cy, cx + r + 4, cy, 'rx') + T(cx + r + 64, cy + 4, 'f_b', { a: 'start', c: 'rl' }) +
        dim(cx - r, cx + r, cy + r + 18, '2r', { below: true, c: 'it' }) + arc(cx - r, cy, 30, -al, al) + T(cx - r + 30, cy - 18, '2α', { a: 'start', c: 'it', s: 11 }),
        '$\\hat e_1=(1,\\mu)$, $\\hat e_2=(1,-\\mu)$은 왼쪽 접촉, $\\hat e_3=(-1,-\\mu)$, $\\hat e_4=(-1,\\mu)$은 오른쪽 접촉의 원뿔 모서리입니다(크기는 정규화하지 않음). 두 접촉을 잇는 선이 두 원뿔 안에 있습니다.');
    },
    // r04 — Nguyen: equilateral triangle held at two edge points whose line of sight lies inside both cones
    rNguyen() {
      const b = [[170, 215], [390, 215], [280, 215 - 220 * Math.sin(rad(60))]];
      const yc = 150, xl = 170 + (215 - yc) / Math.tan(rad(60)), xr = 390 - (215 - yc) / Math.tan(rad(60)), al = 45;
      return fig(560, 240, '정삼각형의 두 변을 마찰 계수 μ = 1인 두 손가락이 잡는다. 두 접촉을 잇는 선(점선)이 두 마찰 원뿔 안에 있어 힘 닫힘이다',
        P(`M${b.map((q) => f1(q[0]) + ',' + f1(q[1])).join('L')}Z`, 'bm2') + cone(xl, yc, -30, al, 70) + cone(xr, yc, 210, al, 70) + L(xl, yc, xr, yc, 'gd ds') +
        A(xl, yc, xl + 60 * Math.cos(rad(-30)), yc + 60 * Math.sin(rad(30)), 'vl', 7) + A(xr, yc, xr + 60 * Math.cos(rad(210)), yc - 60 * Math.sin(rad(210)), 'vl', 7) +
        T(xl - 10, yc - 6, '1', { a: 'end', c: 'it' }) + T(xr + 10, yc - 6, '2', { a: 'start', c: 'it' }) + T(280, 232, '선분이 원뿔 안 ⇔ 법선과 선분의 각 30° < α', { s: 11 }),
        '변의 법선은 수평선과 30°를 이룹니다. $\\alpha=\\tan^{-1}\\mu>30°$, 즉 $\\mu>\\tan30°=0.577$이면 두 접촉이 서로를 원뿔 안에서 “봅니다”. 이때 두 손가락이 선을 따라 서로 미는 내력을 만들 수 있고, 그것이 힘 닫힘의 열쇠입니다.');
    },
    // r05 — fixed frame {s} and body frame {b}; the columns of R_sb are b's axes written in s
    rFrames() {
      return fig(560, 230, '고정 좌표계 {s}와 물체 좌표계 {b}: 회전 행렬 R_sb의 열은 {b}의 단위 축을 {s}에서 쓴 것이다',
        frame(110, 190, 0, 80, 's') + T(96, 204, '{s}', { a: 'end', s: 12 }) + A(110, 190, 350, 110, 'dm', 8) + T(230, 142, 'p', { c: 'it' }) +
        frame(350, 110, 35, 80, 'b') + T(338, 134, '{b}', { a: 'end', s: 12 }) + L(350, 110, 450, 110, 'dm ds') + arc(350, 110, 44, 0, 35) + T(400, 100, 'θ', { a: 'start', c: 'it' }) +
        C(110, 190, 4, 'jt') + C(350, 110, 4, 'jt'),
        '$\\hat z$ 축 둘레로 $\\theta$만큼 돈 {b}의 축은 {s}에서 $\\hat x_b=(\\cos\\theta,\\sin\\theta,0)$, $\\hat y_b=(-\\sin\\theta,\\cos\\theta,0)$, $\\hat z_b=(0,0,1)$. 이 세 열을 나란히 놓은 것이 $R_{sb}=\\mathrm{Rot}(\\hat z,\\theta)$입니다.');
    },
    // r07 — screw axis through q with direction s; a point moves on a helix of pitch h
    rScrew() {
      const y0 = 130, x0 = 60, x1 = 500;
      let hx = '';
      for (let t = 0; t <= 4 * Math.PI; t += 0.1) { const x = 120 + (t / (4 * Math.PI)) * 300, y = y0 - 50 * Math.cos(t), front = Math.sin(t) > 0; hx += (t ? 'L' : 'M') + f1(x) + ',' + f1(y); }
      return fig(560, 240, '나사 축: 점 q를 지나고 방향이 s인 축 둘레로 돌면서 축 방향으로 미끄러진다. 한 바퀴에 2πh만큼 나아간다',
        L(x0, y0, x1, y0, 'gd ds') + A(420, y0, 480, y0, 'vl', 9) + T(484, y0 - 8, 's', { a: 'start', c: 'it' }) + C(170, y0, 4, 'jt') + T(170, y0 + 20, 'q', { c: 'it' }) +
        P(hx, 'cv') + C(120, y0 - 50, 4, 'jt') + C(420, y0 - 50, 4, 'jt') + dim(120, 270, y0 - 70, '2πh', { c: 'it' }) +
        mom(90, y0, 22, 140, -140, 'rx') + T(80, y0 - 30, 'ω', { a: 'end', c: 'rl' }) + T(300, 222, 'S = (s, −s × q + hs)', { s: 12 }),
        '나사 축 $\\mathcal S=(\\omega,v)$는 단위 회전 속도 $\\omega=\\hat s$와, 원점을 지나는 점의 속도 $v=-\\hat s\\times q+h\\hat s$로 이루어집니다. $h=0$이면 순수 회전, 회전이 없으면($\\omega=0$) 순수 병진입니다.');
    },
    // r09 — planar 3R arm at its zero configuration with {s} and {b}
    rThreeR() {
      const y = 150, j = [90, 230, 350], e = 440;
      return fig(560, 240, '평면 3R 팔의 영 자세: 관절 축은 모두 종이에서 나오는 방향(ẑ), 링크 길이 L₁, L₂, L₃',
        pin(j[0], y) + link(j[0], y, j[1], y) + link(j[1], y, j[2], y) + L(j[2], y, e, y, 'th') + C(e, y, 4, 'jt') +
        link(j[0], y, j[0] + 140 * Math.cos(rad(40)), y - 140 * Math.sin(rad(40))).replace(/class="th"/, 'class="gd ds"') +
        A(j[0], y, j[0], y - 70, 'vl', 8) + T(j[0] - 8, y - 74, 'y_s', { a: 'end', c: 'it' }) + T(j[0] - 16, y + 34, '{s}', { a: 'end', s: 12 }) +
        A(e, y, e + 60, y, 'vl', 8) + A(e, y, e, y - 60, 'vl', 8) + T(e + 64, y + 4, 'x_b', { a: 'start', c: 'it' }) + T(e + 8, y - 60, 'y_b', { a: 'start', c: 'it' }) + T(e + 10, y + 22, '{b}', { a: 'start', s: 12 }) +
        dim(j[0], j[1], y + 40, 'L_1', { below: true, c: 'it' }) + dim(j[1], j[2], y + 40, 'L_2', { below: true, c: 'it' }) + dim(j[2], e, y + 40, 'L_3', { below: true, c: 'it' }) +
        T(j[0] + 110, y - 110, 'θ₁만 돌린 모습', { a: 'start', s: 11 }),
        '영 자세의 끝점 좌표계 $M$은 $\\{s\\}$에서 $x$축으로 $L_1+L_2+L_3$만큼 떨어져 있습니다. 관절 $i$의 나사 축은 $\\omega_i=(0,0,1)$, $q_i$는 관절의 위치이므로 $v_i=-\\omega_i\\times q_i$입니다.');
    },
    // r10–r13 — planar 2R arm with joint angles and end-effector position
    rTwoR() {
      const O = [150, 210], L1 = 140, L2 = 100, t1 = 35, t2 = 65;
      const J = [O[0] + L1 * Math.cos(rad(t1)), O[1] - L1 * Math.sin(rad(t1))], E = [J[0] + L2 * Math.cos(rad(t1 + t2)), J[1] - L2 * Math.sin(rad(t1 + t2))];
      return fig(560, 240, '평면 2R 팔: 관절각 θ₁(바닥에서), θ₂(첫 링크에서 잰 상대각), 끝점 (x, y)',
        pin(...O) + link(...O, ...J) + link(...J, ...E) + C(...E, 4, 'jt') + L(O[0], O[1], O[0] + 200, O[1], 'dm ds') + L(J[0], J[1], J[0] + 70 * Math.cos(rad(t1)), J[1] - 70 * Math.sin(rad(t1)), 'dm ds') +
        arc(...O, 40, 0, t1) + T(O[0] + 48, O[1] - 12, 'θ_1', { a: 'start', c: 'it' }) + arc(...J, 34, t1, t1 + t2) + T(J[0] + 30, J[1] - 30, 'θ_2', { a: 'start', c: 'it' }) +
        T((O[0] + J[0]) / 2 + 8, (O[1] + J[1]) / 2 + 18, 'L_1', { a: 'start', c: 'it' }) + T((J[0] + E[0]) / 2 - 10, (J[1] + E[1]) / 2, 'L_2', { a: 'end', c: 'it' }) +
        T(E[0] + 10, E[1] - 6, '(x, y)', { a: 'start', s: 12 }) + A(60, 225, 100, 225, 'vl', 7) + A(60, 225, 60, 185, 'vl', 7) + T(106, 229, 'x', { a: 'start', c: 'it' }) + T(60, 177, 'y', { c: 'it' }),
        '$x=L_1\\cos\\theta_1+L_2\\cos(\\theta_1+\\theta_2)$, $y=L_1\\sin\\theta_1+L_2\\sin(\\theta_1+\\theta_2)$. 둘째 관절각은 첫 링크에 대해 잰 상대각이라, 둘째 링크의 절대 방향은 $\\theta_1+\\theta_2$입니다.');
    },
    // r11 — manipulability ellipses of a 2R arm at two configurations
    rManip() {
      const L1 = 120, L2 = 90;
      const draw = (ox, oy, t1, t2, k) => {
        const a1 = rad(t1), a12 = rad(t1 + t2);
        const J = [[-L1 * Math.sin(a1) - L2 * Math.sin(a12), -L2 * Math.sin(a12)], [L1 * Math.cos(a1) + L2 * Math.cos(a12), L2 * Math.cos(a12)]];
        const a = J[0][0] ** 2 + J[0][1] ** 2, b = J[0][0] * J[1][0] + J[0][1] * J[1][1], c = J[1][0] ** 2 + J[1][1] ** 2;
        const tr = a + c, det = a * c - b * b, l1 = tr / 2 + Math.sqrt(tr * tr / 4 - det), l2 = Math.max(tr / 2 - Math.sqrt(tr * tr / 4 - det), 0);
        const ang = Math.atan2(l1 - a, b) * 180 / Math.PI;
        const Jx = ox + L1 * Math.cos(a1), Jy = oy - L1 * Math.sin(a1), Ex = Jx + L2 * Math.cos(a12), Ey = Jy - L2 * Math.sin(a12);
        return pin(ox, oy, 0.8) + link(ox, oy, Jx, Jy) + link(Jx, Jy, Ex, Ey) +
          `<ellipse class="cv" cx="${f1(Ex)}" cy="${f1(Ey)}" rx="${f1(k * Math.sqrt(l1))}" ry="${f1(Math.max(k * Math.sqrt(l2), 1.5))}" transform="rotate(${f1(-ang)} ${f1(Ex)} ${f1(Ey)})"/>`;
      };
      return fig(560, 250, '2R 팔의 조작성 타원: 관절 속도의 단위 원이 끝점 속도의 타원으로 옮겨진다. 팔을 거의 편 오른쪽 자세에서는 타원이 납작하다',
        draw(110, 200, 50, 90, 0.35) + draw(330, 200, 30, 12, 0.35) + T(150, 236, 'θ₂ = 90°: 둥근 타원', { s: 11 }) + T(420, 236, 'θ₂ ≈ 0: 특이점 근처, 납작한 타원', { s: 11 }),
        '끝점 속도 $\\dot x=J\\dot\\theta$에서 $\\lVert\\dot\\theta\\rVert=1$인 관절 속도가 만드는 끝점 속도는 타원 $\\dot x^T(JJ^T)^{-1}\\dot x=1$입니다. 축의 길이는 $JJ^T$ 고윳값의 제곱근이고, 팔을 곧게 펴면($\\theta_2\\to0$) 팔 방향 속도를 낼 수 없어 타원이 선분으로 납작해집니다.');
    },
    // r12 — two inverse-kinematics solutions of the 2R arm (elbow up and elbow down)
    rElbow() {
      const O = [180, 190], L1 = 150, L2 = 120, E = [390, 110];
      const dx = E[0] - O[0], dy = O[1] - E[1], d2 = dx * dx + dy * dy, c2 = (d2 - L1 * L1 - L2 * L2) / (2 * L1 * L2), s2 = Math.sqrt(1 - c2 * c2);
      const sol = (s) => { const t2 = Math.atan2(s * s2, c2), t1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2)); return [O[0] + L1 * Math.cos(t1), O[1] - L1 * Math.sin(t1)]; };
      const Ja = sol(1), Jb = sol(-1);
      return fig(560, 240, '같은 끝점 (x, y)에 닿는 2R 팔의 두 자세: 팔꿈치가 원점-끝점 선분 아래(θ₂ > 0)와 위(θ₂ < 0)',
        pin(...O) + link(...O, ...Ja) + link(...Ja, ...E) + L(O[0], O[1], Jb[0], Jb[1], 'gd ds') + L(Jb[0], Jb[1], E[0], E[1], 'gd ds') + C(...Jb, 5, 'sp') + C(...E, 5, 'jt') +
        L(O[0], O[1], E[0], E[1], 'dm') + T(E[0] + 10, E[1] - 6, '(x, y)', { a: 'start', s: 12 }) + T(Ja[0] + 8, Ja[1] + 20, 'θ₂ > 0 (아래)', { a: 'start', s: 11 }) + T(Jb[0] - 8, Jb[1] - 10, 'θ₂ < 0 (위)', { a: 'end', s: 11 }) +
        T((O[0] + E[0]) / 2 + 30, (O[1] + E[1]) / 2 + 26, 'r = √(x² + y²)', { a: 'start', s: 11 }),
        '코사인 법칙으로 $\\cos\\theta_2=\\dfrac{x^2+y^2-L_1^2-L_2^2}{2L_1L_2}$가 정해지고, $\\sin\\theta_2=\\pm\\sqrt{1-\\cos^2\\theta_2}$의 부호가 두 해를 가릅니다. 끝점이 작업 공간 경계에 있으면 두 해가 하나로 겹칩니다.');
    },
    // r14 — speed profiles ṡ(t) of cubic, quintic and trapezoidal time scalings (T = 1)
    rScaling() {
      const ox = 90, oy = 200, sx = 360, sy = 70;
      const cub = (t) => 6 * t - 6 * t * t, qui = (t) => 30 * t * t - 60 * t ** 3 + 30 * t ** 4;
      const v = 1.5, a = v * v / (v - 1), tr = (t) => (t < v / a ? a * t : t > 1 - v / a ? a * (1 - t) : v);
      const path = (f) => { let d = ''; for (let i = 0; i <= 100; i++) { const t = i / 100; d += (i ? 'L' : 'M') + f1(ox + sx * t) + ',' + f1(oy - sy * f(t)); } return d; };
      return fig(560, 250, '시간 스케일링의 속도 ṡ(t) (T = 1): 3차 다항식, 5차 다항식, 사다리꼴',
        L(ox, oy, ox + sx + 20, oy, 'ax') + L(ox, oy, ox, oy - 150, 'ax') + P(path(cub), 'cv') + P(path(qui), 'rx') + P(path(tr), 'gd') +
        T(ox + sx + 24, oy + 4, 't', { a: 'start', c: 'it' }) + T(ox - 6, oy - 150, 'ṡ', { a: 'end', c: 'it' }) + T(ox + sx, oy + 18, 'T', { c: 'it' }) + T(ox, oy + 18, '0', {}) +
        T(ox + sx / 2 + 6, oy - sy * 1.5 - 8, '3차: 최대 1.5/T', { a: 'start', c: 'lb', s: 11 }) + T(ox + sx / 2 + 6, oy - sy * 1.875 - 6, '5차: 최대 1.875/T', { a: 'start', c: 'rl', s: 11 }) + T(ox + 28, oy - sy * 1.5 - 6, '사다리꼴', { a: 'start', s: 11 }),
        '세 곡선 아래 넓이는 모두 1(경로를 처음부터 끝까지 감). 3차는 양 끝의 가속도가 0이 아니어서 출발·정지 순간 가속도가 튀고, 5차는 가속도까지 0에서 시작해 부드럽지만 최대 속도가 더 큽니다. 사다리꼴은 등가속-등속-등감속입니다.');
    },
  });
})();
