/* 로봇공학 그림 — 파지(3·4단원, 보충 노트 Grasp Statics)와 Problem Set #2(교재 연습문제 12.15–12.20).
   그리는 도구는 core/figkit.js(FK). 각도는 수학 방향(반시계, y 위)으로 받고 화면 좌표(y 아래)로 바꿉니다. */
(function () {
  const { fig, L, A, T, R, C, P, f1 } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  const dir = (a) => [Math.cos(rad(a)), -Math.sin(rad(a))]; // math angle → screen direction
  const poly = (pts, cls) => P('M' + pts.map((p) => `${f1(p[0])},${f1(p[1])}`).join('L') + 'Z', cls);
  // friction cone at (x,y): axis = inward normal (math deg), half-angle al, length len
  const wedge = (x, y, ax, al, len, cls = 'fl2') => {
    const a = dir(ax - al), b = dir(ax + al);
    const pts = [[x, y]];
    for (let k = 0; k <= 12; k++) { const d = dir(ax - al + (2 * al * k) / 12); pts.push([x + len * d[0], y + len * d[1]]); }
    return poly(pts, cls) + L(x, y, x + len * a[0], y + len * a[1], 'ld') + L(x, y, x + len * b[0], y + len * b[1], 'ld');
  };
  // a finger pushing along the inward normal n (math deg): the disc sits outside, the arrow ends at the contact
  const finger = (x, y, n, r = 8) => { const d = dir(n); return C(x - r * d[0], y - r * d[1], r, 'sp') + C(x, y, 2.6, 'jt'); };
  const push = (x, y, n, len = 30, cls = 'rx') => { const d = dir(n); return A(x - (len + 18) * d[0], y - (len + 18) * d[1], x - 18 * d[0], y - 18 * d[1], cls, 8); };
  const thick = (x1, y1, x2, y2) => `<line class="rx" style="stroke-width:5;stroke-linecap:round" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
  const arc = (x, y, r, a0, a1, cls = 'dm') => {
    const p = (a) => [x + r * Math.cos(rad(a)), y - r * Math.sin(rad(a))];
    const [xa, ya] = p(a0), [xb, yb] = p(a1);
    return `<path class="${cls}" d="M${f1(xa)},${f1(ya)}A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f1(xb)},${f1(yb)}"/>`;
  };
  // cabinet projection for the small 3-D sketches (x right, y back-right, z up)
  const pr = (cx, cy, s) => (p) => [cx + s * (p[0] + 0.45 * p[1]), cy - s * (p[2] + 0.32 * p[1])];

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 03 — the three contact models
    rContactModels() {
      const y = 112, body = (cx) => R(cx - 80, y, 160, 62, 'rg') + L(cx - 80, y, cx + 80, y, 'gd');
      const a = 100, b = 300, c = 500;
      return fig(600, 228, '세 가지 접촉 모델: 마찰 없는 점 접촉, 마찰이 있는 점 접촉, 소프트 핑거',
        body(a) + body(b) + body(c) +
        finger(a, y, -90, 11) + push(a, y, -90, 40) + T(a, 200, 'f = x n̂,  x ≥ 0', { s: 11.5 }) + T(a, 22, '마찰 없는 점 접촉', { c: 'em', s: 12 }) +
        wedge(b, y, -90, 31, 56) + finger(b, y, -90, 11) + A(b - 24, y - 60, b - 6, y - 14, 'rx', 8) + arc(b, y, 30, -90, -59) + T(b + 18, y + 40, 'α', { c: 'it' }) +
        T(b, 200, '원뿔 안의 힘: |f_t| ≤ μ f_n', { s: 11.5 }) + T(b, 22, '마찰 점 접촉 (α = tan⁻¹μ)', { c: 'em', s: 12 }) +
        wedge(c, y, -90, 31, 56) + finger(c, y, -90, 11) + A(c, y - 52, c, y - 22, 'rx', 8) +
        P(`M${c - 22},${y - 34}A22,7 0 1 0 ${c + 22},${y - 34}`, 'ld') + A(c + 18, y - 30, c + 24, y - 35, 'ld', 7) + T(c + 30, y - 40, 'τ', { a: 'start', c: 'it' }) +
        T(c, 200, '+ 법선 둘레 비틀림 |τ| ≤ γ f_n', { s: 11.5 }) + T(c, 22, '소프트 핑거', { c: 'em', s: 12 }),
        '마찰이 없으면 손끝은 면에 수직으로 **밀기만** 합니다. 마찰이 있으면 법선 둘레의 원뿔(반각 $\\alpha=\\tan^{-1}\\mu$) 안의 어떤 방향으로도 밀 수 있고, 손끝이 넓게 눌리는 소프트 핑거는 법선 둘레로 비트는 모멘트도 냅니다.');
    },
    // 03 — form closure, force closure, and a grasp that is force closure but not form closure
    rClosures() {
      const sq = (cx, cy) => R(cx - 56, cy - 42, 112, 84, 'bm');
      const a = 100, b = 300, cy = 108;
      const ca = [[a, cy - 42, -90], [a + 56, cy, 180], [a, cy + 42, 90], [a - 56, cy, 0]];
      const cb = [[b + 30, cy - 42, -90], [b + 56, cy + 22, 180], [b - 30, cy + 42, 90], [b - 56, cy - 22, 0]];
      const tri = [[440, 160], [560, 160], [500, 56]];
      const pA = [470, 108], pB = [530, 108];
      return fig(600, 230, '형상 닫힘과 힘 닫힘: 법선이 한 점에 모이면 돌 수 있고, 엇갈리면 꼼짝 못 하며, 마찰에 기대면 힘 닫힘이지만 형상 닫힘은 아니다',
        sq(a, cy) + ca.map(([x, y, n]) => finger(x, y, n) + push(x, y, n, 22)).join('') + arc(a, cy, 20, 120, 400, 'ld') + A(a + 19.1, cy - 8.3, a + 15.3, cy - 12.9, 'ld', 7) +
        T(a, 200, '(a) 법선이 모두 중심을 지남', { s: 11.5 }) + T(a, 218, '→ 중심 둘레로 돌 수 있다', { s: 11.5 }) +
        sq(b, cy) + cb.map(([x, y, n]) => finger(x, y, n) + push(x, y, n, 22)).join('') +
        T(b, 200, '(b) 법선이 바람개비처럼 엇갈림', { s: 11.5 }) + T(b, 218, '→ 형상 닫힘 = 힘 닫힘', { s: 11.5 }) +
        poly(tri, 'bm') + wedge(...pA, -30, 34, 34) + wedge(...pB, 210, 34, 34) + finger(...pA, -30, 7) + finger(...pB, 210, 7) +
        A(500, 120, 500, 156, 'ld', 8) + T(510, 150, 'mg', { a: 'start', c: 'it' }) +
        T(500, 200, '(c) 마찰 접촉 두 개', { s: 11.5 }) + T(500, 218, '→ 힘 닫힘, 형상 닫힘은 아님', { s: 11.5 }),
        '(a) 네 법선이 한 점을 지나면 그 점 둘레의 작은 회전을 아무 접촉도 막지 못합니다. (b) 엇갈리게 놓으면 어떤 운동도 막힙니다(마찰 없는 접촉에서는 형상 닫힘과 힘 닫힘이 같습니다). (c) 마찰 원뿔 덕분에 어떤 외력이든 버틸 접촉력이 있지만(힘 닫힘), 손가락이 충분히 세게 누르지 못하면 미끄러져 빠집니다.');
    },
    // 03 — the four wrench columns of the rectangle grasp as vertices of a tetrahedron
    rTetra() {
      const L1 = pr(150, 140, 62), L2 = pr(440, 140, 62);
      const axes = (p) => A(...p([0, 0, 0]), ...p([1.45, 0, 0]), 'dm', 6) + A(...p([0, 0, 0]), ...p([0, 1.7, 0]), 'dm', 6) + A(...p([0, 0, 0]), ...p([0, 0, 1.25]), 'dm', 6) +
        T(...p([1.62, 0, 0]), 'f_x', { s: 11, c: 'it' }) + T(...p([0, 1.9, 0]), 'f_y', { s: 11, c: 'it' }) + T(...p([0, 0, 1.38]), 'm', { s: 11, c: 'it' });
      const tet = (p, V) => {
        const E = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
        return poly([p(V[0]), p(V[1]), p(V[2])], 'fl') + poly([p(V[0]), p(V[2]), p(V[3])], 'fl') + E.map(([i, j]) => L(...p(V[i]), ...p(V[j]), 'ld')).join('') + V.map((v) => C(...p(v), 3.2, 'jt')).join('');
      };
      const Va = [[0, -1, -0.5], [-1, 0, 0.5], [0, 1, -0.5], [1, 0, 0.5]], Vb = [[0, -1, 0], [-1, 0, 0], [0, 1, 0], [1, 0, 0]];
      return fig(600, 262, '마찰 없는 네 접촉의 렌치 열 네 개를 꼭짓점으로 하는 사면체: 원점을 품으면 힘 닫힘, 납작해지면 아님',
        axes(L1) + tet(L1, Va) + C(...L1([0, 0, 0]), 3.5, 'dotf') + T(150, 250, '오프셋이 엇갈림: 원점이 사면체 안 → 힘 닫힘', { s: 11.5 }) +
        axes(L2) + tet(L2, Vb) + C(...L2([0, 0, 0]), 3.5, 'dotf') + T(440, 250, '오프셋 0: 사면체가 평면으로 납작 → 순수 모멘트 ✗', { s: 11.5 }),
        '3단원 예제 1의 직사각형에서 $\\ell_1=\\ell_2=0.5$, $\\ell_3=\\ell_4=-0.5$로 두면 네 열 $(0,-1,-0.5)$, $(-1,0,0.5)$, $(0,1,-0.5)$, $(1,0,0.5)$의 합이 0이라 원점이 사면체의 무게중심에 있습니다. 모든 $\\ell_i=0$이면 네 점이 $m=0$ 평면에 놓여 사면체가 정사각형으로 납작해지고, 원점은 그 “안”이 아니라 경계 위입니다.');
    },
    // 03 — form closure from velocity constraints: half-planes a_i·q ≥ 0
    rHalfspace() {
      const one = (cx, cy, angs, title, sub) => {
        let s = '';
        angs.forEach((a) => { const d = dir(a), n = [-d[1], d[0]]; s += L(cx - 70 * n[0], cy - 70 * n[1], cx + 70 * n[0], cy + 70 * n[1], 'dm ds') + A(cx, cy, cx + 52 * d[0], cy + 52 * d[1], 'rx', 8); });
        return s + C(cx, cy, 3, 'jt') + T(cx, 206, title, { s: 11.5 }) + T(cx, 222, sub, { s: 11.5 });
      };
      // allowed region for the second panel: q with a_i·q ≥ 0 for a at 60°, 90°, 120° → the wedge between 30° and 150°
      const cx2 = 420, cy2 = 112;
      const wedgeOK = poly([[cx2, cy2], [cx2 + 75 * Math.cos(rad(30)), cy2 - 75 * Math.sin(rad(30))], [cx2 + 75 * Math.cos(rad(60)), cy2 - 75 * Math.sin(rad(60))], [cx2, cy2 - 75], [cx2 + 75 * Math.cos(rad(120)), cy2 - 75 * Math.sin(rad(120))], [cx2 + 75 * Math.cos(rad(150)), cy2 - 75 * Math.sin(rad(150))]], 'fl2');
      return fig(600, 232, '접촉의 속도 구속 a_i·q ≥ 0: 반평면들의 공통부분이 원점뿐이면 형상 닫힘',
        one(150, 112, [90, 210, 330], '세 벡터가 평면을 양으로 생성', '→ 공통부분 = {0}: 움직일 수 없음') +
        wedgeOK + one(cx2, cy2, [60, 90, 120], '모두 한쪽에 몰림', '→ 색칠한 방향으로 빠져나감'),
        '접촉 $i$에서 물체가 손끝 쪽으로 파고들지 않을 조건은 $a_i^Tq\\ge0$ ($q=(v_x,v_y,\\omega)$, $a_i$는 그 접촉의 렌치 열)입니다. 빨간 벡터 하나가 점선 한쪽의 반평면을 허락합니다. 왼쪽처럼 벡터들이 원점을 둘러싸면 모든 반평면의 공통부분이 원점뿐이라 움직일 수 없고, 오른쪽처럼 한쪽에 몰리면 색칠한 방향의 운동이 남습니다. 렌치 열의 양의 생성 조건(힘 닫힘)과 똑같은 조건입니다(그림은 2차원으로 줄인 모습).');
    },
    // 04 — the four cases in the proof of Nguyen's theorem
    rNguyenCases() {
      const panel = (cx, t1, t2, title, ok) => {
        const p1 = [cx - 52, 96], p2 = [cx + 52, 96];
        return L(p1[0], p1[1] - 46, p1[0], p1[1] + 46, 'gd') + L(p2[0], p2[1] - 46, p2[0], p2[1] + 46, 'gd') +
          wedge(...p1, t1, 24, 44) + wedge(...p2, t2, 24, 44) + L(...p1, ...p2, ok ? 'cv' : 'cv2') + C(...p1, 3, 'jt') + C(...p2, 3, 'jt') +
          T(cx, 172, title, { s: 11 }) + T(cx, 190, ok ? '힘 닫힘 ✓' : '힘 닫힘 아님', { s: 11.5, c: ok ? 'lb' : 'rl' });
      };
      return fig(640, 206, '응우옌 정리 증명의 네 경우: 두 접촉을 잇는 선분과 두 마찰 원뿔의 관계',
        panel(80, 8, 172, '(i) 두 원뿔 모두 안', true) + panel(240, 8, 140, '(ii) 한 원뿔 안에만', false) +
        panel(400, 38, 218, '(iii) 둘 다 밖, 반대쪽', false) + panel(560, 38, 142, '(iv) 둘 다 밖, 같은 쪽', false),
        '선분이 두 원뿔 모두의 안쪽에 있을 때(i)만 두 손가락이 선분을 따라 서로 미는 내력이 생깁니다. (ii)–(iv)에서는 한쪽 원뿔이 선분 방향의 힘을 낼 수 없어, 어떤 방향의 모멘트나 힘을 버틸 수 없습니다(볼록 껍질 판정으로 확인).');
    },
    // 04 — Li et al.: three frictional contacts, the plane S through them, and how a cone can meet a plane
    rLiPlane() {
      const p = pr(150, 160, 70);
      const S = [[-1.5, -0.6, 0], [1.6, -0.6, 0], [1.6, 1.9, 0], [-1.5, 1.9, 0]];
      const c = [[-0.9, 0, 0], [1.0, 0.2, 0], [0.1, 1.4, 0]];
      const ins = (cx, cy, a, title) => { // side view: a cone (apex up) and the plane through its apex at angle a
        const d1 = [cx - 30, cy + 46], d2 = [cx + 30, cy + 46];
        return poly([[cx, cy], d1, d2], 'fl2') + L(cx, cy, ...d1, 'ld') + L(cx, cy, ...d2, 'ld') +
          L(cx - 44 * Math.cos(rad(a)), cy + 44 * Math.sin(rad(a)), cx + 44 * Math.cos(rad(a)), cy - 44 * Math.sin(rad(a)), 'vl') + C(cx, cy, 2.6, 'jt') + T(cx, cy + 66, title, { s: 10.5 });
      };
      return fig(600, 250, '리의 정리: 세 마찰 접촉이 정하는 평면 S, 원뿔과 평면이 만나는 세 가지 경우',
        poly(S.map(p), 'fl') + poly(S.map(p), 'dm') + poly(c.map(p), 'dm ds') +
        c.map((q) => C(...p(q), 3.4, 'jt')).join('') +
        c.map((q, i) => { const o = p(q), w = [[8, 24], [172, 22], [214, 22]][i]; return wedge(...o, w[0], w[1], 30); }).join('') +
        A(...p([1.75, 1.6, 0]), ...p([1.75, 1.6, 0.9]), 'vl', 7) + T(...p([1.95, 1.6, 0.95]), 'N', { c: 'it' }) + T(...p([-1.3, 1.75, 0]), 'S', { c: 'it' }) +
        ins(380, 52, 90, '평면 원뿔') + ins(470, 52, 90 - 33, '선') + ins(560, 52, 10, '점') +
        T(470, 196, '원뿔 ∩ 평면 S', { s: 11.5 }),
        '세 접촉이 한 직선 위에 있지 않으면 평면 $S$ 하나를 정합니다. 각 원뿔이 $S$를 **평면 원뿔**(쐐기)로 자르고, 그 평면 파지가 평면 힘 닫힘이면 공간 파지도 힘 닫힘이며 그 역도 성립합니다. 원뿔이 $S$와 선이나 점에서만 만나면 그 접촉은 평면 안의 힘을 거의 못 내므로 힘 닫힘이 될 수 없습니다.');
    },

    // ---------------- Problem Set #2 ----------------
    // 12.15: the 4 × 4 square turned 45° with five frictionless contacts, and where a sixth contact helps
    fps1215() {
      const s = 34, r2 = Math.SQRT2;
      const sq = (cx, cy) => {
        const V = (u, v) => [cx + s * ((u - v) / r2), cy - s * ((u + v) / r2)];
        let g = poly([V(2, -2), V(2, 2), V(-2, 2), V(-2, -2)], 'bm');
        for (let k = -1; k <= 1; k++) g += L(...V(k, -2), ...V(k, 2), 'dm') + L(...V(-2, k), ...V(2, k), 'dm');
        return { g, W: (x, y) => [cx + s * x, cy - s * y] };
      };
      const A1 = sq(150, 140), B1 = sq(430, 140);
      const ct = [[r2, r2, 225, 'f₁'], [-r2, r2, 315, 'f₂'], [-1.5 * r2, -0.5 * r2, 45, 'f₃'], [-r2, -r2, 45, 'f₄'], [r2, -r2, 135, 'f₅']];
      const lbl = (q, n) => { const d = [Math.cos(rad(n)), -Math.sin(rad(n))]; return [q[0] - 52 * d[0], q[1] - 52 * d[1] + 4]; };
      let a = A1.g + A(...A1.W(0, 0), ...A1.W(0.9, 0), 'vl', 6) + A(...A1.W(0, 0), ...A1.W(0, 0.9), 'vl', 6);
      ct.forEach(([x, y, n, nm]) => { const q = A1.W(x, y); a += finger(...q, n, 7) + push(...q, n, 20) + T(...lbl(q, n), nm, { s: 12, c: 'it' }); });
      let b = B1.g;
      // half of each edge, from the midpoint toward the next vertex counter-clockwise
      const half = [[[r2, r2], [0, 2 * r2]], [[-r2, r2], [-2 * r2, 0]], [[-r2, -r2], [0, -2 * r2]], [[r2, -r2], [2 * r2, 0]]];
      half.forEach(([p, q]) => { const P1 = B1.W(...p), P2 = B1.W(...q); b += thick(P1[0], P1[1], P2[0], P2[1]); });
      b += arc(430, 140, 24, -60, 200, 'rx') + A(430 + 24 * Math.cos(rad(200)) - 2.2, 140 - 24 * Math.sin(rad(200)) - 6, 430 + 24 * Math.cos(rad(200)), 140 - 24 * Math.sin(rad(200)), 'rx', 7);
      return fig(580, 290, '연습문제 12.15: 45° 돌린 4×4 정사각형과 마찰 없는 접촉 다섯 개, 여섯째 접촉이 힘 닫힘을 만드는 위치',
        a + T(150, 282, '(a) 다섯 접촉: 모멘트를 한쪽으로만 낸다', { s: 11.5 }) + b + T(430, 282, '(b) 굵은 선: 반시계 모멘트를 내는 위치', { s: 11.5 }),
        '(a) $f_1,f_2,f_4,f_5$는 변의 가운데를 눌러 작용선이 중심을 지나므로 모멘트가 0이고, $f_3$만 시계 방향 모멘트 $-\\sqrt2$를 냅니다. (b) 여섯째 접촉이 **반시계** 모멘트를 내면 힘 닫힘이 됩니다: 각 변에서 가운데부터 반시계 방향 다음 꼭짓점까지의 반(가운데와 꼭짓점은 제외).');
    },
    // 12.17: the L-shaped object, contact 1 on the left side at height x and contact 2 in the inner corner
    fps1217() {
      const u = 50;
      const Lsh = (ox, oy) => { const W = (x, y) => [ox + u * x, oy - u * y]; return { W, g: poly([W(0, 0), W(2, 0), W(2, 1), W(1, 1), W(1, 2), W(0, 2)], 'bm') }; };
      const pan = (ox, mu2, x, title, sub) => {
        const { W, g } = Lsh(ox, 150);
        const c1 = W(0, x), c2 = W(1, 1);
        let s = g + wedge(...c1, 0, 45, 34) + finger(...c1, 0, 7);
        if (mu2 > 0) s += wedge(...c2, 180, 45, 30) + wedge(...c2, 270, 45, 30);
        else s += A(c2[0] + 30, c2[1], c2[0] + 3, c2[1], 'rx', 7) + A(c2[0], c2[1] - 30, c2[0], c2[1] - 3, 'rx', 7);
        s += C(...c2, 3, 'jt') + T(c1[0] - 12, c1[1] + 4, '1', { a: 'end', s: 12, c: 'em' }) + T(c2[0] + 8, c2[1] - 12, '2', { a: 'start', s: 12, c: 'em' });
        if (x !== null) s += L(...c1, ...c2, 'cv');
        return s + T(ox + u, 182, title, { s: 11.5 }) + T(ox + u, 198, sub, { s: 11 });
      };
      const { W } = Lsh(420, 150);
      return fig(600, 210, '연습문제 12.17: L자 물체, 왼쪽 면의 접촉 1(높이 x)과 안쪽 모서리의 접촉 2',
        pan(40, 1, 1, '(a) μ₁ = μ₂ = 1, x = L', '선분이 두 원뿔 안 → 힘 닫힘') +
        pan(230, 0, 1, '(b) μ₂ = 0, x = L', '선분이 원뿔의 경계 → 아님') +
        Lsh(420, 150).g + thick(...W(0, 0.03), ...W(0, 0.97)) + C(...W(1, 1), 3, 'jt') +
        A(W(1, 1)[0] + 30, W(1, 1)[1], W(1, 1)[0] + 3, W(1, 1)[1], 'rx', 7) + A(W(1, 1)[0], W(1, 1)[1] - 30, W(1, 1)[0], W(1, 1)[1] - 3, 'rx', 7) +
        L(...W(0, 0.45), ...W(1, 1), 'cv') + T(W(0, 0.5)[0] - 8, W(0, 0.5)[1], '0 < x < L', { a: 'end', s: 11 }) +
        T(470, 182, '(c) μ₂ = 0', { s: 11.5 }) + T(470, 198, '굵은 구간이 답', { s: 11 }),
        '안쪽 모서리의 손가락은 두 면을 함께 누르므로, 마찰이 없어도 왼쪽($-\\hat x$)과 아래쪽($-\\hat y$) 사이 90°의 어느 방향으로든 밀 수 있습니다. 마찰 계수 1이면 두 면의 45° 원뿔이 합쳐져 반평면이 됩니다. 접촉 1은 $\\pm45°$ 원뿔입니다.');
    },
    // 12.18: the square with f1 (friction), f2 and f3 (frictionless); the three lines of action must meet
    fps1218() {
      const u = 170, ox = 120, oy = 222;
      const W = (x, y) => [ox + u * (x + 0.5), oy - u * y];
      const c = 0.25, h = 0.5, P0 = W(0, 0), Pc = W(c, 1), Ph = W(0.5, h), Pm = W(c, h);
      const al = Math.atan(c / h) * 180 / Math.PI;
      return fig(460, 250, '연습문제 12.18: 정사각형과 세 접촉, f₂와 f₃의 작용선이 만나는 점을 f₁이 겨냥해야 한다',
        poly([W(-0.5, 0), W(0.5, 0), W(0.5, 1), W(-0.5, 1)], 'bm') +
        wedge(...P0, 90, 30, 70) + finger(...P0, 90, 8) + finger(...Pc, -90, 8) + push(...Pc, -90, 22) + finger(...Ph, 180, 8) + push(...Ph, 180, 22) +
        L(Pc[0], Pc[1], Pm[0], Pm[1] + 28, 'dm ds') + L(Ph[0], Ph[1], Pm[0] - 28, Pm[1], 'dm ds') + L(...P0, ...Pm, 'cv') + C(...Pm, 4, 'dotf') +
        arc(...P0, 46, 90, 90 - al) + T(P0[0] + 50, P0[1] - 40, 'tan⁻¹(c/h)', { a: 'start', s: 11 }) +
        T(Pm[0] + 8, Pm[1] - 8, '(c, h)', { a: 'start', s: 11.5 }) + T(P0[0] - 18, P0[1] + 14, 'f₁ (μ)', { a: 'end', s: 12, c: 'it' }) +
        T(Pc[0] + 12, Pc[1] - 26, 'f₂', { a: 'start', s: 12, c: 'it' }) + T(Ph[0] + 30, Ph[1] - 8, 'f₃', { a: 'start', s: 12, c: 'it' }) +
        T(ox + u + 92, 70, 'c = 1/4, h = 1/2', { s: 12 }) + T(ox + u + 92, 92, '→ μ > c/h = 1/2', { s: 12, c: 'em' }),
        '외력 없이 세 접촉력이 서로 버티려면(내력) 세 힘의 작용선이 한 점에서 만나야 합니다(세 힘의 평형). $f_2$는 $x=c$의 연직선, $f_3$은 $y=h$의 수평선 위에 있으므로 $f_1$은 원점에서 $(c,h)$를 향해야 하고, 그 방향이 마찰 원뿔 **안쪽**에 있어야 합니다: $\\tan^{-1}(c/h)\\lt\\tan^{-1}\\mu$.');
    },
    // 12.19: (a) the triangle with A, B (μ = 1) and C; (b) the house with A, B frictionless and C with a cone of half-angle β
    fps1219() {
      const u = 46;
      const Wa = (x, y) => [150 + u * x, 186 - u * y], Wb = (x, y) => [440 + u * x, 186 - u * y];
      const A_ = Wa(-1, 1), B_ = Wa(1, 1), C_ = Wa(0, 0);
      const Ab = Wb(-1, 2), Bb = Wb(1, 2), Cb = Wb(0, 0);
      return fig(600, 240, '연습문제 12.19: (a) 삼각형, A·B는 μ = 1, C는 마찰 없음 (b) 집 모양, A·B는 마찰 없음, C는 반각 β의 원뿔',
        poly([Wa(-2, 0), Wa(2, 0), Wa(0, 2)], 'bm') + wedge(...A_, -45, 45, 36) + wedge(...B_, 225, 45, 36) + finger(...A_, -45, 7) + finger(...B_, 225, 7) +
        finger(...C_, 90, 7) + push(...C_, 90, 20) + L(...A_, ...B_, 'dm ds') +
        T(A_[0] - 12, A_[1] - 6, 'A', { a: 'end', c: 'em' }) + T(B_[0] + 12, B_[1] - 6, 'B', { a: 'start', c: 'em' }) + T(C_[0] + 10, C_[1] + 16, 'C', { a: 'start', c: 'em' }) +
        T(150, 230, '(a) 원뿔의 모서리가 연직·수평', { s: 11.5 }) +
        poly([Wb(-2, 0), Wb(2, 0), Wb(2, 1), Wb(0, 3), Wb(-2, 1)], 'bm') + finger(...Ab, -45, 7) + push(...Ab, -45, 20) + finger(...Bb, 225, 7) + push(...Bb, 225, 20) +
        wedge(...Cb, 90, 22, 44) + finger(...Cb, 90, 7) + arc(...Cb, 30, 90, 68) + T(Cb[0] + 12, Cb[1] - 34, 'β', { a: 'start', c: 'it' }) +
        T(Ab[0] - 12, Ab[1] - 6, 'A', { a: 'end', c: 'em' }) + T(Bb[0] + 12, Bb[1] - 6, 'B', { a: 'start', c: 'em' }) + T(Cb[0] - 10, Cb[1] + 16, 'C', { a: 'end', c: 'em' }) +
        T(440, 230, '(b) 지붕의 법선은 45° 아래 안쪽', { s: 11.5 }),
        '(a) A와 B의 원뿔(반각 45°)의 모서리는 연직과 수평입니다. 수평 모서리끼리 마주 밀고(점선), 연직 모서리 둘이 누르는 것을 C가 받치면 외력 없이 모두 버팁니다. (b) A와 B의 힘을 더하면 연직 아래 방향이라 C가 연직 위로 받치면 됩니다. 연직 방향은 원뿔의 **축**이라 $\\beta\\gt0$이기만 하면 원뿔 안입니다.');
    },
    // 12.20: an odd regular polygon held by two fingers on edges, and with one finger on a vertex
    fps1220() {
      const n = 5, R0 = 78;
      const V = (cx, cy) => Array.from({ length: n }, (_, k) => { const a = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n; return [cx + R0 * Math.cos(a), cy - R0 * Math.sin(a)]; });
      const p1 = V(150, 128), p2 = V(430, 128);
      // (a) a contact on the bottom edge and the bisector line toward the upper-right edge
      const c1 = [p1[0][0] + 0.35 * (p1[1][0] - p1[0][0]), p1[0][1]], th = 90 - 180 / (2 * n), d = dir(th);
      const e = [p1[2], p1[3]]; // the upper-right edge (vertex 2 → 3)
      const ex = e[1][0] - e[0][0], ey = e[1][1] - e[0][1], den = d[0] * ey - d[1] * ex;
      const s = ((e[0][0] - c1[0]) * ey - (e[0][1] - c1[1]) * ex) / den, c2 = [c1[0] + s * d[0], c1[1] + s * d[1]];
      const n2 = 90 + 360 * 2 / n; // inward normal of that edge (math deg)
      const half = 180 / (2 * n) + 4;
      return fig(580, 250, '연습문제 12.20: 홀수 정n각형(그림은 n = 5)을 두 손가락으로 잡기',
        poly(p1, 'bm') + wedge(...c1, 90, half, 46) + wedge(...c2, n2, half, 46) + L(...c1, ...c2, 'cv') + finger(...c1, 90, 7) + finger(...c2, n2, 7) +
        A(c1[0], c1[1], c1[0], c1[1] - 40, 'vl', 7) + T(c1[0] - 6, c1[1] - 44, 'n̂₁', { a: 'end', s: 11 }) +
        T(150, 232, '(a) 변끼리: 법선이 π/n 어긋남 → μ > tan(π/2n)', { s: 11.5 }) +
        poly(p2, 'bm') + C(430, 128 - R0 - 9, 9, 'sp') + finger((p2[0][0] + p2[1][0]) / 2, p2[0][1], 90, 7) + L(430, 128 - R0, (p2[0][0] + p2[1][0]) / 2, p2[0][1], 'cv') +
        T(430, 232, '(b) 꼭짓점과 마주 보는 변: 선분 = 두 법선 → μ > 0', { s: 11.5 }),
        '홀수 정다각형에는 평행한 변의 쌍이 없어, 가장 마주 보는 두 변의 안쪽 법선도 정반대에서 $\\pi/n$만큼 어긋납니다. 두 법선을 반씩 나눠 맞추는 선분이 가장 유리하므로 원뿔 반각이 $\\pi/(2n)$보다 커야 합니다(a). 둥근 손끝이 꼭짓점에 닿으면 접촉 법선을 꼭짓점의 두 변 법선 사이에서 고를 수 있어, 마주 보는 변의 법선과 일직선으로 맞출 수 있습니다(b).');
    },
  });
})();
