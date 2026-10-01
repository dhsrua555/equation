/* 로봇공학 그림 — 1·2단원과 5–14단원의 설명을 돕는 그림(관절 종류, 표현의 특이점, 각속도, 로드리게스 공식, 좌표계의 곱,
   트위스트의 뜻, 렌치, 지수곱을 끝 관절부터 쌓기, 야코비안의 열, 특이 자세, 뉴턴-랩슨, 질량 행렬, 사다리꼴 속도, 경유점).
   그리는 도구는 core/figkit.js(FK). 각도는 수학 방향(반시계, y 위)으로 받습니다. */
(function () {
  const { fig, L, A, T, R, C, P, f1, G, G2, legend } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  const PI = Math.PI;
  const poly = (pts, cls) => P('M' + pts.map((p) => `${f1(p[0])},${f1(p[1])}`).join('L') + 'Z', cls);
  const link = (x1, y1, x2, y2) => L(x1, y1, x2, y2, 'th') + C(x1, y1, 5, 'jt') + C(x2, y2, 5, 'jt');
  const arc = (x, y, r, a0, a1, cls = 'dm') => {
    const p = (a) => [x + r * Math.cos(rad(a)), y - r * Math.sin(rad(a))];
    const [xa, ya] = p(a0), [xb, yb] = p(a1);
    return `<path class="${cls}" d="M${f1(xa)},${f1(ya)}A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f1(xb)},${f1(yb)}"/>`;
  };
  const pr = (cx, cy, s) => (p) => [cx + s * (p[0] + 0.42 * p[1]), cy - s * (p[2] + 0.3 * p[1])];
  // planar 2R arm in screen coordinates: base (bx,by), lengths in px, angles in degrees
  const arm2 = (bx, by, l1, l2, t1, t2) => {
    const e = [bx + l1 * Math.cos(rad(t1)), by - l1 * Math.sin(rad(t1))], p = [e[0] + l2 * Math.cos(rad(t1 + t2)), e[1] - l2 * Math.sin(rad(t1 + t2))];
    return { e, p, svg: link(bx, by, ...e) + link(...e, ...p) };
  };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 01 — the six common joints and their degrees of freedom
    rJoints() {
      const cell = (i, body, name, f) => { const x = 50 + i * 100; return body(x, 92) + T(x, 168, name, { c: 'em', s: 12 }) + T(x, 186, `f = ${f}`, { s: 11.5 }); };
      const Rj = (x, y) => L(x - 34, y + 18, x, y, 'th') + L(x, y, x + 34, y - 14, 'th') + C(x, y, 8, 'jt') + C(x, y, 2.5, 'dotf') + arc(x, y, 18, 40, 140, 'ld');
      const Pj = (x, y) => R(x - 38, y + 4, 76, 8, 'bm') + R(x - 14, y - 14, 28, 18, 'bm2') + L(x, y - 14, x, y - 34, 'th') + A(x - 6, y + 22, x + 22, y + 22, 'ld', 7) + A(x + 6, y + 22, x - 22, y + 22, 'ld', 7);
      const Hj = (x, y) => { let s = L(x, y - 36, x, y + 30, 'gd'); for (let k = -30; k < 26; k += 9) s += L(x - 10, y + k, x + 10, y + k + 5, 'vl'); return s + A(x + 18, y - 6, x + 18, y - 26, 'ld', 7) + arc(x, y + 20, 14, 200, 340, 'ld'); };
      const Cj = (x, y) => R(x - 36, y - 4, 72, 8, 'bm') + R(x - 14, y - 12, 28, 24, 'bm2') + A(x - 10, y + 24, x + 16, y + 24, 'ld', 7) + arc(x + 30, y, 12, 120, 420, 'ld');
      const Uj = (x, y) => L(x - 30, y, x + 30, y, 'gd') + L(x, y - 30, x, y + 30, 'gd') + C(x, y, 7, 'jt') + arc(x - 22, y, 9, 60, 300, 'ld') + arc(x, y - 22, 9, -30, 210, 'ld');
      const Sj = (x, y) => P(`M${x - 26},${y + 4}A26,26 0 0 0 ${x + 26},${y + 4}`, 'gd') + C(x, y, 17, 'bm2') + L(x, y, x + 22, y - 30, 'th') + arc(x, y, 30, 100, 170, 'ld') + arc(x, y, 30, 10, 60, 'ld');
      return fig(600, 200, '관절의 종류와 자유도: 회전 R, 병진 P, 나사 H는 1, 원통 C와 유니버설 U는 2, 구면 S는 3',
        cell(0, Rj, '회전 R', 1) + cell(1, Pj, '병진 P', 1) + cell(2, Hj, '나사 H', 1) + cell(3, Cj, '원통 C', 2) + cell(4, Uj, '유니버설 U', 2) + cell(5, Sj, '구면 S', 3),
        '관절이 허락하는 상대 운동의 수가 $f$입니다. 평면 기구의 링크 사이 자유도는 3이므로 관절 하나가 $3-f$개, 공간에서는 $6-f$개의 구속을 줍니다. 나사 관절은 돌면서 축 방향으로 정해진 비율(피치)만큼 나가므로 회전과 병진이 묶여 자유도 1입니다.');
    },
    // 02 — latitude and longitude on a sphere: the coordinates break down at the poles
    rLatLong() {
      const cx = 170, cy = 120, r = 88;
      let s = C(cx, cy, r, 'sp');
      for (const lat of [-60, -30, 0, 30, 60]) { const y = cy - r * Math.sin(rad(lat)), w = r * Math.cos(rad(lat)); s += `<ellipse class="dm" cx="${cx}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * 0.22)}"/>`; }
      for (const lon of [0, 30, 60, 90, 120, 150]) { const w = r * Math.sin(rad(lon)); s += `<ellipse class="dm" cx="${cx}" cy="${cy}" rx="${f1(Math.abs(w))}" ry="${r}"/>`; }
      s += C(cx, cy - r, 4, 'dotf') + T(cx + 10, cy - r - 4, '북극: 경도가 정해지지 않음', { a: 'start', s: 11.5 });
      // two neighbouring points near the pole with longitudes far apart
      const q1 = [cx - 14, cy - r + 9], q2 = [cx + 13, cy - r + 10];
      s += C(...q1, 3, 'jt') + C(...q2, 3, 'jt') + L(...q1, ...q2, 'rx') + T(cx + 10, cy - r + 14, '가까운 두 점(빨강)도 경도는 180° 차이', { a: 'start', s: 11 });
      return fig(560, 230, '구면의 위도·경도 좌표: 극에서 경도가 정해지지 않는 표현의 특이점',
        s + T(410, 70, '명시적 표현 (위도, 경도)', { c: 'em', s: 12 }) + T(410, 92, '수 2개, 극에서 특이', { s: 11.5 }) +
        T(410, 140, '암시적 표현 x² + y² + z² = 1', { c: 'em', s: 12 }) + T(410, 162, '수 3개 + 구속 1개, 특이점 없음', { s: 11.5 }),
        '극 근처의 두 점은 실제로 아주 가깝지만 경도는 크게 다를 수 있고, 극에서는 경도가 아예 정해지지 않습니다. 이것은 구면 자체가 아니라 **좌표**의 결함이라 표현의 특이점이라 부릅니다. 구면 전체를 특이점 없이 덮는 좌표 두 개짜리 표현은 없습니다.');
    },
    // 06 — angular velocity: every point moves on a circle about the axis, ṗ = ω × p
    rAngVel() {
      const p = pr(250, 150, 80);
      const w = [0, 0, 1], pt = [1.1, 0, 0.55];
      let s = '';
      for (let k = 0; k < 64; k++) { const a = (2 * PI * k) / 64, b = (2 * PI * (k + 1)) / 64; s += L(...p([1.1 * Math.cos(a), 1.1 * Math.sin(a), 0.55]), ...p([1.1 * Math.cos(b), 1.1 * Math.sin(b), 0.55]), 'dm'); }
      s += `<ellipse class="bm2" cx="${f1(p([0, 0, 0.1])[0])}" cy="${f1(p([0, 0, 0.1])[1])}" rx="60" ry="24"/>`;
      s += L(...p([0, 0, -0.6]), ...p([0, 0, 0]), 'dm ds') + A(...p([0, 0, 0]), ...p(w.map((v) => v * 1.4)), 'vl', 9) + T(...p([0.08, 0, 1.45]), 'ω = ω̂ θ̇', { a: 'start', c: 'it' });
      s += L(...p([0, 0, 0.55]), ...p(pt), 'dm ds') + C(...p(pt), 4, 'dotf') + T(p(pt)[0] + 8, p(pt)[1] + 16, 'p', { a: 'start', c: 'it' });
      s += A(...p(pt), ...p([1.1, 0.75, 0.55]), 'rx', 9) + T(p([1.1, 0.8, 0.55])[0] + 6, p([1.1, 0.8, 0.55])[1] - 4, 'ṗ = ω × p', { a: 'start', c: 'it' });
      s += A(...p([0, 0, 0]), ...p(pt), 'ld', 7);
      return fig(560, 250, '각속도: 물체의 모든 점이 축 둘레의 원을 그리고, 점 p의 속도는 ω × p',
        s,
        '물체가 단위 축 $\\hat\\omega$ 둘레로 $\\dot\\theta$의 빠르기로 돌면 각속도는 $\\omega=\\hat\\omega\\dot\\theta$이고, 원점에서 $p$인 점은 축에 수직인 원 위를 $\\dot p=\\omega\\times p$로 움직입니다. 속도의 크기는 축까지의 거리 × $\\dot\\theta$. 회전 행렬의 열(물체 축)도 같은 식으로 움직여 $\\dot R=[\\omega]R$이 됩니다.');
    },
    // 06 — Rodrigues' formula from geometry: split p along the axis and across it
    rRodrigues() {
      const cx = 170, cy = 130, r = 82;
      const th = 70, pp = [cx + r, cy], pr2 = [cx + r * Math.cos(rad(th)), cy - r * Math.sin(rad(th))], wx = [cx, cy - r];
      let s = C(cx, cy, r, 'dm') + C(cx, cy, 3.5, 'jt') + T(cx - 8, cy + 16, '축 ω̂ (화면 밖으로)', { a: 'end', s: 11 });
      s += A(cx, cy, ...pp, 'ld', 8) + T(pp[0] + 6, pp[1] + 14, 'p⊥', { a: 'start', c: 'it' });
      s += A(cx, cy, ...wx, 'gd', 8) + T(wx[0] - 6, wx[1] - 6, 'ω̂ × p', { a: 'end', c: 'it' });
      s += A(cx, cy, ...pr2, 'rx', 8) + arc(cx, cy, 30, 0, th, 'rx') + T(cx + 36, cy - 18, 'θ', { a: 'start', c: 'it' });
      s += L(...pr2, pr2[0], cy, 'dm ds') + L(...pr2, cx, pr2[1], 'dm ds') + T(pr2[0] + 8, pr2[1] - 4, 'cos θ p⊥ + sin θ (ω̂ × p)', { a: 'start', s: 11.5 });
      const q = pr(440, 150, 70);
      let t = A(...q([0, 0, 0]), ...q([0, 0, 1.4]), 'vl', 8) + T(...q([0.1, 0, 1.45]), 'ω̂', { a: 'start', c: 'it' });
      t += A(...q([0, 0, 0]), ...q([1, 0, 0.9]), 'ld', 8) + T(...q([1.05, 0, 1.0]), 'p', { a: 'start', c: 'it' });
      t += L(...q([0, 0, 0.9]), ...q([1, 0, 0.9]), 'dm ds') + T(...q([-0.1, 0, 0.9]), 'p∥ = ω̂ω̂ᵀp', { a: 'end', s: 11 }) + T(...q([0.5, 0, 0.72]), 'p⊥', { s: 11, c: 'it' });
      return fig(580, 250, '로드리게스 공식의 기하: 축 방향 성분은 그대로, 축에 수직인 성분만 평면에서 θ만큼 돈다',
        s + t,
        '오른쪽: $p$를 축 방향 성분 $p_\\parallel=\\hat\\omega\\hat\\omega^Tp$와 수직 성분 $p_\\perp=p-p_\\parallel$로 나눕니다. 왼쪽(축을 위에서 본 모습): 회전은 $p_\\perp$만 $p_\\perp$와 $\\hat\\omega\\times p$가 이루는 평면에서 돌립니다. 그래서 $Rp=p_\\parallel+\\cos\\theta\\,p_\\perp+\\sin\\theta\\,\\hat\\omega\\times p$이고, $[\\hat\\omega]^2p=-p_\\perp$를 넣으면 로드리게스 공식이 됩니다.');
    },
    // 07 — composing frames: T_sb then T_bc gives T_sc
    rHomog() {
      const fr = (x, y, a, nm) => { const c = Math.cos(rad(a)), s2 = Math.sin(rad(a)); return A(x, y, x + 34 * c, y - 34 * s2, 'vl', 7) + A(x, y, x - 34 * s2, y - 34 * c, 'vl', 7) + C(x, y, 3, 'jt') + T(x - 8, y + 16, nm, { a: 'end', c: 'em' }); };
      const S = [90, 190], B = [280, 110], Cc = [450, 160];
      const curve = (p, q, bend, cls) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2 - bend; return P(`M${p[0]},${p[1]}Q${mx},${my} ${q[0]},${q[1]}`, cls); };
      return fig(560, 230, '좌표계의 곱: {s}에서 본 {b}의 자세 T_sb와 {b}에서 본 {c}의 자세 T_bc를 곱하면 T_sc',
        fr(...S, 0, '{s}') + fr(...B, 30, '{b}') + fr(...Cc, -20, '{c}') +
        curve(S, B, 40, 'ld') + T(170, 100, 'T_{sb}', { c: 'it' }) + curve(B, Cc, 40, 'ld') + T(370, 98, 'T_{bc}', { c: 'it' }) +
        curve(S, Cc, -60, 'rx') + T(270, 222, 'T_{sc} = T_{sb} T_{bc}', { c: 'it' }),
        '아래첨자 지우기: $T_{sb}T_{bc}=T_{sc}$. 행렬 $T_{sb}$는 {b}의 원점 위치 $p_{sb}$와 축 방향 $R_{sb}$를 {s}에서 적은 것이고, {c}에서 좌표 $x_c$인 점은 {s}에서 $T_{sb}T_{bc}x_c$입니다. 곱의 순서를 바꾸면 다른 자세가 됩니다.');
    },
    // 07 — what v_s means: the velocity of the body point that is at the {s} origin right now
    rTwistVs() {
      const u = 52, ox = 110, oy = 170;
      const W = (x, y) => [ox + u * x, oy - u * y];
      const q = W(3, 0), O = W(0, 0), Bo = W(4, 0);
      return fig(560, 240, '평면에서 본 트위스트: 점 q 둘레로 도는 물체, v_s는 {s} 원점에 겹친 물체 점의 속도, v_b는 {b} 원점의 속도',
        `<ellipse class="bm2" cx="${f1(W(2.4, 0.3)[0])}" cy="${f1(W(2.4, 0.3)[1])}" rx="${2.9 * u}" ry="${1.5 * u}"/>` +
        C(...q, 4, 'dotf') + T(q[0] - 6, q[1] + 18, 'q (회전 중심)', { s: 11 }) + arc(...q, 26, 30, 150, 'ld') + A(q[0] - 22, q[1] - 15, q[0] - 25, q[1] - 7, 'ld', 6) + T(q[0], q[1] - 34, 'ω = 2', { s: 11 }) +
        A(...O, O[0] + 30, O[1], 'vl', 7) + A(...O, O[0], O[1] - 30, 'vl', 7) + T(O[0] - 8, O[1] + 16, '{s}', { a: 'end', c: 'em' }) +
        A(...O, ...W(0, -1.2), 'rx', 9) + T(W(0, -1.2)[0] + 8, W(0, -1.2)[1], 'v_s = ω × (0 − q) = (0, −6)', { a: 'start', s: 11.5 }) +
        A(...Bo, Bo[0] + 30, Bo[1], 'vl', 7) + A(...Bo, Bo[0], Bo[1] - 30, 'vl', 7) + T(Bo[0] + 8, Bo[1] + 16, '{b}', { a: 'start', c: 'em' }) +
        A(...Bo, ...W(4, 0.9), 'ld', 9) + T(W(4, 0.9)[0] + 8, W(4, 0.9)[1], 'v_b = (0, 2)', { a: 'start', s: 11.5 }),
        '7단원 예제 2의 상황입니다. 물체가 $q=(3,0)$ 둘레로 각속도 2로 돕니다. 물체를 넓게 펼쳤다고 상상하면 지금 {s}의 원점과 겹친 물체 점이 있고, 그 점의 속도 $\\omega\\times(0-q)=(0,-6)$이 $v_s$입니다. {b}의 원점 $(4,0)$은 $(0,2)$로 움직이므로 $v_b=(0,2)$. 둘은 같은 강체 운동을 다른 점에서 잰 것입니다.');
    },
    // 08 — a wrench: the moment of a force depends on the reference point
    rWrench() {
      const O = [90, 190], Bp = [330, 190], r = [250, 90];
      return fig(560, 230, '렌치: 점 r에 작용하는 힘 f와 원점에 대한 모멘트 m = r × f. 기준점을 힘의 작용선 위로 옮기면 모멘트가 0',
        A(...O, O[0] + 36, O[1], 'vl', 7) + A(...O, O[0], O[1] - 36, 'vl', 7) + T(O[0] - 8, O[1] + 16, '{a}', { a: 'end', c: 'em' }) +
        A(...O, ...r, 'dm', 7) + T((O[0] + r[0]) / 2 + 4, (O[1] + r[1]) / 2 - 10, 'r', { a: 'end', c: 'it' }) +
        C(...r, 4, 'dotf') + A(...r, r[0] + 70, r[1] + 70, 'rx', 10) + T(r[0] + 78, r[1] + 66, 'f', { a: 'start', c: 'it' }) +
        L(r[0] - 70, r[1] - 70, r[0] + 110, r[1] + 110, 'dm ds') + T(r[0] - 64, r[1] - 72, '작용선', { a: 'start', s: 11 }) +
        arc(...O, 30, 60, 160, 'ld') + T(O[0] - 12, O[1] - 44, 'm_a = r × f', { a: 'end', c: 'it' }) +
        A(...Bp, Bp[0] + 36, Bp[1], 'vl', 7) + A(...Bp, Bp[0], Bp[1] - 36, 'vl', 7) + T(Bp[0] + 8, Bp[1] + 16, '{b}: 작용선 위 → m_b = 0', { a: 'start', s: 11.5 }),
        '렌치 $\\mathcal F_a=(m_a,f_a)$는 힘과 그 힘이 기준점에 대해 만드는 모멘트를 묶은 것입니다. 같은 힘이라도 기준점이 바뀌면 모멘트가 바뀌고, 기준점이 작용선 위에 있으면 모멘트는 0입니다(8단원 예제 4). 좌표 변환은 $\\mathcal F_b=[\\mathrm{Ad}_{T_{ab}}]^T\\mathcal F_a$.');
    },
    // 09 — why the PoE formula uses zero-position axes: move the last joint first
    rPoeStack() {
      const L1 = 46, L2 = 36, L3 = 26;
      const panel = (bx, t1, t2, t3, title, ghost) => {
        const by = 170;
        const j2 = [bx + L1 * Math.cos(rad(t1)), by - L1 * Math.sin(rad(t1))];
        const j3 = [j2[0] + L2 * Math.cos(rad(t1 + t2)), j2[1] - L2 * Math.sin(rad(t1 + t2))];
        const tip = [j3[0] + L3 * Math.cos(rad(t1 + t2 + t3)), j3[1] - L3 * Math.sin(rad(t1 + t2 + t3))];
        const g = ghost ? L(bx, by, bx + L1 + L2 + L3, by, 'dm ds') : '';
        return g + link(bx, by, ...j2) + link(...j2, ...j3) + link(...j3, ...tip) + C(...tip, 3, 'dotf') + T(bx + 60, 212, title, { s: 11.5 });
      };
      return fig(600, 228, '지수곱 공식을 끝 관절부터 쌓기: 영 자세에서 θ₃, θ₂, θ₁을 차례로 돌린다',
        panel(24, 0, 0, 0, '① 영 자세 M', false) + panel(172, 0, 0, 50, '② 관절 3을 돌림', true) + panel(320, 0, 35, 50, '③ 이어서 관절 2', true) + panel(468, 30, 35, 50, '④ 이어서 관절 1', true) +
        T(300, 24, '관절 i를 돌릴 때 그보다 안쪽 관절(1 … i−1)은 아직 영 자세 → 관절 i의 축 = 영 자세의 축 S_i', { s: 11.5 }),
        '끝 관절 3부터 돌리면, 관절 3을 돌리는 동안 관절 1, 2는 영 자세에 있으므로 관절 3의 축은 영 자세의 $\\mathcal S_3$ 그대로입니다. 다음에 관절 2를 돌리면 관절 2보다 바깥 부분(관절 3과 끝점) 전체가 강체처럼 $e^{[\\mathcal S_2]\\theta_2}$만큼 움직이는데, 관절 2의 축은 관절 3의 운동과 무관하므로 역시 영 자세의 $\\mathcal S_2$입니다. 그래서 공식의 모든 축이 영 자세에서 적은 것입니다.');
    },
    // 10 — the two Jacobian columns of a 2R arm as velocities about joint 1 and joint 2
    rJacCols() {
      const a = arm2(150, 200, 110, 80, 20, 75), b = [150, 200];
      const dir = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy); return [dy / n, -dx / n]; }; // a quarter turn counter-clockwise on paper (screen y points down)
      const d1 = dir(b, a.p), d2 = dir(a.e, a.p), L1n = Math.hypot(a.p[0] - b[0], a.p[1] - b[1]), L2n = Math.hypot(a.p[0] - a.e[0], a.p[1] - a.e[1]);
      const k = 0.35;
      return fig(560, 250, '2R 팔의 야코비안 열: J₁은 원점 둘레, J₂는 팔꿈치 둘레로 끝점이 도는 속도',
        a.svg + L(...b, ...a.p, 'dm ds') + L(...a.e, ...a.p, 'dm ds') + C(...a.p, 4, 'dotf') +
        A(...a.p, a.p[0] + d1[0] * k * L1n, a.p[1] + d1[1] * k * L1n, 'rx', 9) + T(a.p[0] + d1[0] * k * L1n - 4, a.p[1] + d1[1] * k * L1n - 8, 'J₁ (θ̇₁ = 1)', { a: 'end', s: 11.5 }) +
        A(...a.p, a.p[0] + d2[0] * k * L2n, a.p[1] + d2[1] * k * L2n, 'ld', 9) + T(a.p[0] + d2[0] * k * L2n + 6, a.p[1] + d2[1] * k * L2n + 14, 'J₂ (θ̇₂ = 1)', { a: 'start', s: 11.5 }) +
        T(b[0] - 8, b[1] + 18, '관절 1', { a: 'end', s: 11 }) + T(a.e[0] + 10, a.e[1] + 14, '관절 2', { a: 'start', s: 11 }),
        '열 $J_1$은 관절 1만 단위 속도로 돌 때의 끝점 속도로, 원점에서 끝점까지의 선분(점선)에 수직이고 크기는 그 길이입니다. $J_2$는 팔꿈치에서 끝점까지의 선분에 수직입니다. 두 열이 나란해지는 순간(팔을 펴거나 완전히 접음)이 특이점입니다.');
    },
    // 11 — singular postures of a planar arm
    rSingular() {
      const p1 = arm2(40, 120, 70, 60, 20, 0), p2 = arm2(250, 120, 70, 60, 20, 180);
      const ar = (p, ang, cls) => A(p[0], p[1], p[0] + 34 * Math.cos(rad(ang)), p[1] - 34 * Math.sin(rad(ang)), cls, 8);
      const j3 = [420, 150], j3b = [470, 150], j3c = [520, 150];
      return fig(600, 210, '평면 팔의 특이 자세: 팔을 곧게 폄, 완전히 접음, 3R 팔의 세 관절이 한 직선',
        p1.svg + ar(p1.p, 20, 'rx') + ar(p1.p, 110, 'ld') + T(p1.p[0] + 8, p1.p[1] + 26, '팔 방향 ✕', { a: 'start', s: 11 }) + T(110, 190, 'θ₂ = 0: 곧게 폄', { s: 11.5 }) +
        p2.svg + ar(p2.p, 20, 'rx') + T(300, 190, 'θ₂ = π: 완전히 접음', { s: 11.5 }) +
        link(370, 150, ...j3) + link(...j3, ...j3b) + link(...j3b, ...j3c) + A(...j3c, j3c[0] + 34, j3c[1], 'rx', 8) + A(...j3c, j3c[0], j3c[1] - 34, 'ld', 8) +
        T(470, 190, '3R: 세 관절이 한 직선', { s: 11.5 }),
        '빨간 화살표 방향(팔이 놓인 방향)으로는 관절을 어떻게 움직여도 끝점 속도를 낼 수 없습니다. 거꾸로 그 방향으로 미는 힘은 링크가 받쳐 관절 토크가 필요 없습니다. 파란 방향(팔에 수직)은 여전히 움직일 수 있어 계수가 하나 줄었을 뿐입니다.');
    },
    // 12 — Newton–Raphson in one dimension: follow the tangent line to its zero
    rNewton() {
      const f = (t) => Math.cos(t) - 0.5, df = (t) => -Math.sin(t);
      const t0 = 0.4, t1 = t0 - f(t0) / df(t0), t2 = t1 - f(t1) / df(t1);
      const tan = (t) => (x) => f(t) + df(t) * (x - t);
      return G({
        w: 560, h: 260, x: [0, 1.8], y: [-0.55, 0.55], xl: 'θ', yl: 'cos θ − 0.5',
        xt: [[0.4, 'θ⁰'], [Math.PI / 3, '']], yt: [[0.5, '0.5'], [-0.5, '−0.5']],
        c: [{ f, c: 'ld' }, { f: tan(t0), c: 'rx', a: 0.2, b: t1 + 0.08 }, { f: tan(t1), c: 'rx', a: t2 - 0.1, b: t1 + 0.05 }],
        extra: (X, Y) => [[t0, f(t0)], [t1, f(t1)], [t2, f(t2)]].map(([x, y]) => `<circle class="dotf" cx="${f1(X(x))}" cy="${f1(Y(y))}" r="3"/>` + L(X(x), Y(0), X(x), Y(y), 'dm ds')).join('') +
          T(X(t1) + 6, Y(0) - 8, 'θ¹', { a: 'start' }) + T(X(t2) - 4, Y(0) + 16, 'θ² ≈ π/3', { a: 'end' }),
        label: '뉴턴-랩슨: 접선이 0이 되는 곳으로 건너가기를 되풀이',
        cap: '$\\cos\\theta=0.5$를 $\\theta^0=0.4$에서 풉니다. 현재 점의 접선(빨강)이 0과 만나는 곳이 다음 추정입니다: $\\theta^1=1.481$, $\\theta^2=1.069$, $\\theta^3=1.0473$, $\\theta^4=1.04720$ (참값 $\\pi/3$). 해에서 멀면 크게 빗나가기도 하지만, 가까워지면 오차가 매번 대략 제곱으로 줄어듭니다.',
      });
    },
    // 13 — the 2R mass matrix entries as functions of θ2 (m1 = m2 = L1 = L2 = 1)
    rMassPlot() {
      return G({
        w: 560, h: 250, x: [-PI, PI], y: [-0.4, 5.4], xl: 'θ₂', ax0: 0,
        xt: [[-PI, '−π'], [-PI / 2, '−π/2'], [PI / 2, 'π/2'], [PI, 'π']], yt: [[1, '1'], [2, '2'], [3, '3'], [5, '5']],
        c: [{ f: (t) => 3 + 2 * Math.cos(t), c: 'ld' }, { f: (t) => 1 + Math.cos(t), c: 'rx' }, { f: () => 1, c: 'dm' }],
        extra: (X, Y) => legend(X(-PI) + 12, Y(5.2) + 4, [['ld', 'm₁₁ = 3 + 2cos θ₂'], ['rx', 'm₁₂ = 1 + cos θ₂'], ['dm', 'm₂₂ = 1']]),
        label: '2R 팔의 질량 행렬 성분이 팔꿈치 각 θ₂에 따라 바뀌는 모습',
        cap: '13단원 예제 1에서 $m_1=m_2=L_1=L_2=1$. 첫 관절이 느끼는 관성 $m_{11}$은 팔을 펼 때($\\theta_2=0$) 5로 가장 크고, 완전히 접으면 1로 줄어듭니다. 결합 항 $m_{12}$가 0이 아니면 한 관절의 가속에 다른 관절의 토크가 필요합니다.',
      });
    },
    // 14 — the trapezoidal velocity profile
    rTrapezoid() {
      const v = 1.25, a = 2.5, T0 = (a + v * v) / (v * a), ta = v / a;
      const sd = (t) => (t < ta ? a * t : t < T0 - ta ? v : Math.max(0, a * (T0 - t)));
      return G({
        w: 560, h: 230, x: [0, T0 * 1.08], y: [0, v * 1.3], xl: 't', yl: 'ṡ',
        xt: [[ta, 'v/a'], [T0 - ta, 'T − v/a'], [T0, 'T']], yt: [[v, 'v']], hg: [v],
        c: [{ f: sd, c: 'ld', a: 0, b: T0 }],
        extra: (X, Y) => `<path class="fl" d="M${f1(X(0))},${f1(Y(0))}L${f1(X(ta))},${f1(Y(v))}L${f1(X(T0 - ta))},${f1(Y(v))}L${f1(X(T0))},${f1(Y(0))}Z"/>`,
        t: [[ta * 0.42, v * 0.62, '기울기 a', { a: 'end' }], [T0 / 2, v * 0.45, '넓이 = 1 (s: 0 → 1)'], [T0 - ta * 0.42, v * 0.62, '기울기 −a', { a: 'start' }]],
        label: '사다리꼴 속도: 가속 a로 v까지, 등속, 같은 a로 감속',
        cap: '$\\dot s(t)$ 아래 넓이가 전체 이동량 $s(T)=1$입니다. 넓이 $=v(T-\\frac va)=1$에서 $T=\\frac{a+v^2}{va}$. 등속 구간이 생기려면 $v^2/a\\le1$이어야 하고, $v^2/a=1$이면 삼각형 속도가 됩니다.',
      });
    },
    // 14 — cubic segments through via points
    rVia() {
      const vias = [[0, 0, 0], [1, 1, 0.6], [2.2, 0.4, -0.5], [3, 1.2, 0]];
      const seg = (j) => (t) => {
        const [T0, b0, d0] = vias[j], [T1, b1, d1] = vias[j + 1], D = T1 - T0, u = t - T0;
        const a2 = (3 * b1 - 3 * b0 - 2 * d0 * D - d1 * D) / (D * D), a3 = (2 * b0 + (d0 + d1) * D - 2 * b1) / (D * D * D);
        return b0 + d0 * u + a2 * u * u + a3 * u * u * u;
      };
      return G({
        w: 560, h: 230, x: [0, 3.2], y: [-0.3, 1.5], xl: 't', yl: 'β(t)',
        xt: [[1, 'T₁'], [2.2, 'T₂'], [3, 'T₃']], yt: [[1, '1']],
        c: [0, 1, 2].map((j) => ({ f: seg(j), a: vias[j][0], b: vias[j + 1][0], c: j % 2 ? 'rx' : 'ld' })),
        extra: (X, Y) => vias.map(([t, b, d]) => `<circle class="dotf" cx="${f1(X(t))}" cy="${f1(Y(b))}" r="3.4"/>` + L(X(t - 0.18), Y(b - 0.18 * d), X(t + 0.18), Y(b + 0.18 * d), 'vl')).join(''),
        label: '경유점을 지나는 3차 다항식 조각들: 경유점에서 위치와 기울기(속도)를 맞춘다',
        cap: '경유점(점)마다 정한 속도(짧은 선의 기울기)를 양쪽 구간이 같이 쓰므로 위치와 속도가 이어집니다. 구간마다 3차식의 계수 네 개가 양 끝의 위치·속도 네 조건으로 정해집니다(14단원 §9.3의 공식). 가속도는 경유점에서 끊길 수 있습니다.',
      });
    },
  });
})();
