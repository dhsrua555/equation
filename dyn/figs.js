/* 동역학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다. 그리는 도구는 core/figkit.js(FK)입니다. */
(function () {
  const { fig, L, A, T, R, C, P, ground, wall, pin, roller, dist, dim, dimv, mom, fn, area } = window.FK;
  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // d01 — dependent motion: block A on a rope over a fixed pulley, the rope wraps a movable pulley that carries B
    dPulley() {
      return fig(560, 260, '고정 도르래와 움직도르래로 이어진 두 블록 A와 B: 줄 길이가 일정해 x_A + 2x_B가 일정',
        ground(120, 440, 30, false) +
        C(200, 60, 22, 'sp') + C(200, 60, 3, 'jt') + L(200, 30, 200, 38, 'gd') +
        L(178, 60, 178, 190, 'gd') + R(160, 190, 36, 30, 'bm2') + T(178, 210, 'A') +
        L(222, 60, 222, 132, 'gd') + C(242, 132, 20, 'sp') + C(242, 132, 3, 'jt') + L(262, 132, 262, 30, 'gd') +
        L(242, 132, 242, 170, 'gd') + R(222, 170, 40, 30, 'bm2') + T(242, 190, 'B') +
        A(330, 30, 330, 190, 'dm') + T(336, 110, 'x_A', { a: 'start', c: 'it' }) +
        A(380, 30, 380, 132, 'dm') + T(386, 80, 'x_B', { a: 'start', c: 'it' }) +
        T(460, 120, 'x_A + 2x_B = 일정', { a: 'middle', c: 'lb' }) + T(460, 144, 'v_A = −2v_B', { a: 'middle' }),
        '줄의 길이는 $x_A$ + (움직도르래 양쪽의 $2x_B$) + 도르래에 감긴 일정한 길이입니다. 시간에 대해 미분하면 속도와 가속도의 관계가 나옵니다(아래 방향을 양으로).');
    },
    // d02 — a curved path with the tangent and normal unit vectors, the osculating circle and its centre
    dNT() {
      const Cx = 290, Cy = 250, Rr = 160, pt = (d) => [Cx + Rr * Math.cos((d * Math.PI) / 180), Cy - Rr * Math.sin((d * Math.PI) / 180)];
      const [ax, ay] = pt(160), [bx, by] = pt(35), [px, py] = pt(120);
      const tx = Math.sin((120 * Math.PI) / 180), ty = Math.cos((120 * Math.PI) / 180), nx = (Cx - px) / Rr, ny = (Cy - py) / Rr;
      const path = `M${(ax - 90 * Math.sin((160 * Math.PI) / 180)).toFixed(1)},${(ay - 90 * Math.cos((160 * Math.PI) / 180)).toFixed(1)}L${ax.toFixed(1)},${ay.toFixed(1)}A${Rr},${Rr} 0 0 1 ${bx.toFixed(1)},${by.toFixed(1)}`;
      return fig(560, 260, '곡선 경로 위의 질점, 접선 단위벡터 e_t와 법선 단위벡터 e_n, 곡률 중심 C와 곡률 반지름 ρ',
        P(path, 'cv') + C(px, py, 5, 'dotf') +
        A(px, py, px + 70 * tx, py + 70 * ty, 'ld') + T(px + 76 * tx, py + 76 * ty - 6, 'e_t', { a: 'start', c: 'lb' }) +
        A(px, py, px + 58 * nx, py + 58 * ny, 'rx') + T(px + 60 * nx + 8, py + 60 * ny + 4, 'e_n', { a: 'start', c: 'rl' }) +
        L(px + 58 * nx, py + 58 * ny, Cx, Cy, 'dm ds') + C(Cx, Cy, 3, 'dotf') + T(Cx + 8, Cy + 4, 'C (곡률 중심)', { a: 'start' }) +
        T((px + Cx) / 2 - 12, (py + Cy) / 2 + 12, 'ρ', { a: 'end', c: 'it' }) +
        T(px - 10, py - 12, 'P', { a: 'end' }) + T(bx + 6, by, '경로', { a: 'start' }),
        '$e_t$는 운동 방향의 접선, $e_n$은 경로가 휘어 들어가는 쪽(곡률 중심 쪽)을 가리킵니다. 곡률 반지름 $\\rho$는 그 점에서 경로에 가장 잘 맞는 원의 반지름입니다.');
    },
    // d02 — polar coordinates: position r e_r, unit vectors e_r and e_theta
    dPolar() {
      const O = [90, 210], th = 0.62, r = 250, P0 = [O[0] + r * Math.cos(th), O[1] - r * Math.sin(th)];
      const er = [Math.cos(th), -Math.sin(th)], et = [-Math.sin(th), -Math.cos(th)];
      return fig(560, 250, '극좌표: 원점 O에서 질점까지 반지름 r과 각 θ, 단위벡터 e_r(바깥)과 e_θ(θ가 느는 방향)',
        A(O[0], O[1], 520, O[1], 'ax') + A(O[0], O[1], O[0], 20, 'ax') + T(524, O[1] + 4, 'x', { a: 'start', c: 'it' }) + T(O[0] - 6, 24, 'y', { a: 'end', c: 'it' }) +
        L(O[0], O[1], P0[0], P0[1], 'gd') + C(P0[0], P0[1], 5, 'dotf') +
        P(`M${O[0] + 60},${O[1]}A60,60 0 0 0 ${O[0] + 60 * Math.cos(th)},${O[1] - 60 * Math.sin(th)}`, 'dm') + T(O[0] + 70, O[1] - 18, 'θ', { a: 'start', c: 'it' }) +
        T(O[0] + 0.5 * r * Math.cos(th) - 6, O[1] - 0.5 * r * Math.sin(th) - 8, 'r', { a: 'end', c: 'it' }) +
        A(P0[0], P0[1], P0[0] + 60 * er[0], P0[1] + 60 * er[1], 'ld') + T(P0[0] + 66 * er[0], P0[1] + 66 * er[1], 'e_r', { a: 'start', c: 'lb' }) +
        A(P0[0], P0[1], P0[0] + 60 * et[0], P0[1] + 60 * et[1], 'rx') + T(P0[0] + 64 * et[0] - 4, P0[1] + 64 * et[1], 'e_θ', { a: 'end', c: 'rl' }),
        '$e_r$과 $e_\\theta$는 질점을 따라 돌아서 시간에 따라 방향이 바뀝니다. 그래서 $\\mathbf r=r\\mathbf e_r$을 미분하면 단위벡터의 도함수 항이 생깁니다.');
    },
    // d03 — a box pulled by a rope at angle theta: free-body diagram
    dBoxPull() {
      return fig(560, 240, '각 θ로 기운 줄로 끄는 상자의 자유물체도: 무게, 수직항력, 마찰력, 장력',
        ground(60, 500, 170) + R(200, 100, 110, 70, 'bm') + C(255, 135, 3, 'jt') +
        A(310, 135, 310 + 110 * Math.cos(0.5), 135 - 110 * Math.sin(0.5), 'ld') + T(420, 72, 'T', { a: 'start', c: 'lb' }) +
        P('M360,135A50,50 0 0 0 354,111', 'dm') + L(310, 135, 380, 135, 'dm ds') + T(370, 128, 'θ', { a: 'start', c: 'it' }) +
        A(255, 135, 255, 222, 'ld') + T(263, 216, 'mg', { a: 'start', c: 'lb' }) +
        A(255, 170, 255, 110, 'rx') + T(244, 112, 'N', { a: 'end', c: 'rl' }) +
        A(230, 172, 160, 172, 'rx') + T(156, 164, 'f = μN', { a: 'end', c: 'rl' }) +
        A(80, 60, 130, 60, 'ax') + A(80, 60, 80, 20, 'ax') + T(134, 64, 'x', { a: 'start', c: 'it' }) + T(80, 14, 'y', { c: 'it' }) +
        A(330, 205, 400, 205, 'vl') + T(404, 209, 'a', { a: 'start', c: 'it' }),
        '수직항력은 상자가 바닥을 누르는 만큼만 생깁니다. 줄이 위로 당기면 $N$이 $mg$보다 작아지고 마찰력도 줄어듭니다.');
    },
    // d03 — a car on a banked curve: weight, normal force, friction, and the centre of the curve
    dBanked() {
      const th = (25 * Math.PI) / 180, cx = 300, cy = 150, s = Math.sin(th), c = Math.cos(th);
      const road = `M${cx - 190 * c},${cy + 190 * s}L${cx + 150 * c},${cy - 150 * s}`;
      return fig(560, 250, '경사각 θ로 기울인 곡선 도로 위의 차: 무게, 도로에 수직인 수직항력, 도로면을 따르는 마찰력, 곡선의 중심 쪽 가속도',
        P(road, 'th') + L(cx - 190 * c, cy + 190 * s, cx + 150 * c, cy + 190 * s, 'dm ds') +
        P(`M${cx + 60 - 190 * c},${cy + 190 * s}A60,60 0 0 0 ${cx - 190 * c + 60 * c},${cy + 190 * s - 60 * s}`, 'dm') + T(cx - 190 * c + 66, cy + 190 * s - 10, 'θ', { a: 'start', c: 'it' }) +
        `<g transform="rotate(${-25} ${cx} ${cy})">${R(cx - 30, cy - 34, 60, 34, 'bm2')}</g>` + C(cx, cy - 17 * c, 3, 'jt') +
        A(cx, cy - 17, cx, cy + 70, 'ld') + T(cx + 8, cy + 64, 'mg', { a: 'start', c: 'lb' }) +
        A(cx - 4, cy - 10, cx - 4 - 90 * s, cy - 10 - 90 * c, 'rx') + T(cx - 4 - 94 * s - 6, cy - 10 - 94 * c, 'N', { a: 'end', c: 'rl' }) +
        A(cx + 8 * c, cy - 8 * s + 4, cx + 8 * c - 70 * c, cy - 8 * s + 4 + 70 * s, 'rx') + T(cx - 70, cy + 44, 'f', { a: 'end', c: 'rl' }) +
        A(cx + 60, cy - 90, cx - 40, cy - 90, 'vl') + T(cx - 44, cy - 94, 'a_n = v²/ρ (곡선 중심 쪽)', { a: 'end' }),
        '곡선의 중심은 왼쪽(도로가 낮은 쪽)입니다. 속력이 설계 속력보다 크면 마찰력이 도로면을 따라 아래로, 작으면 위로 작용합니다(그림은 빠른 경우).');
    },
    // d04 — an elliptic orbit about a focus, with two equal-area sectors
    dOrbit() {
      const a = 170, b = 110, cx = 290, cy = 125, e = Math.sqrt(1 - (b * b) / (a * a)), fx = cx - a * e;
      const pt = (t) => [cx + a * Math.cos(t), cy - b * Math.sin(t)];
      const sector = (t0, t1) => { let d = `M${fx},${cy}`; for (let i = 0; i <= 20; i++) { const [x, y] = pt(t0 + ((t1 - t0) * i) / 20); d += `L${x.toFixed(1)},${y.toFixed(1)}`; } return d + 'Z'; };
      // area swept from the left focus between parameters t0..t1 is (ab/2)[t + e sin t] — pick the near-side width with the same area as the far side
      const kep = (t) => t + e * Math.sin(t), farA = kep(0.3) - kep(-0.3);
      let lo = 0, hi = 1.5; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; (kep(Math.PI + m) - kep(Math.PI - m) < farA ? (lo = m) : (hi = m)); }
      const wNear = (lo + hi) / 2;
      return fig(560, 250, '초점에 태양이 있는 타원 궤도와 같은 시간 동안 쓸고 지나간 넓이가 같은 두 부채꼴',
        `<ellipse class="cv" cx="${cx}" cy="${cy}" rx="${a}" ry="${b}" fill="none"/>` +
        P(sector(Math.PI - wNear, Math.PI + wNear), 'fl2') + P(sector(-0.3, 0.3), 'fl2') +
        C(fx, cy, 7, 'dotf') + T(fx, cy + 24, '중심력의 원점 (초점)', {}) +
        T(cx - a - 8, cy + 4, '가까운 점: 빠르다', { a: 'end' }) + T(cx + a + 8, cy + 4, '먼 점: 느리다', { a: 'start' }),
        '중심력에서는 $r^2\\dot\\theta$가 일정해 같은 시간에 쓸고 지나가는 넓이가 같습니다(케플러 제2법칙). 그래서 초점에 가까운 곳에서 빨리 움직입니다.');
    },
    // d05 — a pendulum released from rest at angle theta_1 below the horizontal ceiling, swinging to the bottom
    dPendulum() {
      const O = [230, 40], l = 170, t1 = (30 * Math.PI) / 180, P1 = [O[0] - l * Math.cos(t1), O[1] + l * Math.sin(t1)], P2 = [O[0], O[1] + l];
      return fig(560, 250, '천장의 점 O에 매단 길이 l의 진자를 천장과 각 θ₁인 위치에서 놓아 가장 낮은 점까지 흔들림',
        ground(120, 340, O[1], false) + C(O[0], O[1], 3, 'jt') +
        L(O[0], O[1], P1[0], P1[1], 'gd') + C(P1[0], P1[1], 9, 'bm2') + L(O[0], O[1], P2[0], P2[1], 'gd ds') + C(P2[0], P2[1], 9, 'bm2') +
        P(`M${P1[0]},${P1[1]}A${l},${l} 0 0 0 ${P2[0]},${P2[1]}`, 'dm ds') +
        P(`M${O[0] - 50},${O[1]}A50,50 0 0 0 ${O[0] - 50 * Math.cos(t1)},${O[1] + 50 * Math.sin(t1)}`, 'dm') + T(O[0] - 62, O[1] + 20, 'θ₁', { a: 'end', c: 'it' }) +
        T(P1[0] - 14, P1[1] + 4, '1 (정지)', { a: 'end' }) + T(P2[0] + 16, P2[1] + 4, '2', { a: 'start' }) + T(O[0] + 8, O[1] + l / 2, 'l', { a: 'start', c: 'it' }) +
        A(P2[0] + 40, P2[1], P2[0] + 100, P2[1], 'ld') + T(P2[0] + 104, P2[1] + 4, 'v₂', { a: 'start', c: 'lb' }) +
        dimv(420, P1[1], P2[1], 'h = l(1 − sin θ₁)') + L(P1[0] + 12, P1[1], 420, P1[1], 'dm ds') + L(P2[0] + 12, P2[1], 420, P2[1], 'dm ds'),
        '장력은 늘 속도에 수직이라 일을 하지 않습니다. 중력이 한 일 $mgh$가 운동에너지가 됩니다.');
    },
    // d06 — direct central impact: velocities before and after along the line of impact
    dImpact() {
      const row = (y, a, b, va, vb, lab) => C(170, y, 22, 'bm2') + C(330, y, 18, 'bm2') + T(170, y + 4, 'A') + T(330, y + 4, 'B') +
        (va ? A(196, y, 196 + va, y, 'ld') : '') + (vb ? A(352, y, 352 + vb, y, 'rx') : '') + T(60, y + 4, lab, { a: 'start' }) +
        (va ? T(196 + va + 4, y - 8, a, { a: 'start', c: 'lb' }) : '') + (vb ? T(352 + vb + 4, y - 8, b, { a: 'start', c: 'rl' }) : '');
      return fig(560, 200, '정면 충돌 전후: 충돌 전 v_A > v_B로 다가가고, 충돌 후 v_B′ ≥ v_A′로 멀어짐',
        row(50, 'v_A', 'v_B', 70, 25, '충돌 전') + row(140, 'v_A′', 'v_B′', 30, 60, '충돌 후') +
        L(100, 95, 500, 95, 'dm ds') + T(500, 90, '충돌선', { a: 'end', s: 11 }),
        '두 물체가 주고받는 충격력은 크기가 같고 방향이 반대라 운동량의 합이 보존됩니다. 반발 계수 $e$는 멀어지는 상대 속도와 다가가는 상대 속도의 비입니다.');
    },
    // d06 — oblique impact on a fixed smooth wall
    dOblique() {
      return fig(560, 230, '매끄러운 고정 벽에 비스듬히 부딪히는 공: 벽에 수직인 성분만 반발 계수로 줄고, 벽을 따르는 성분은 그대로',
        wall(380, 30, 210, 'right') + L(380, 120, 150, 120, 'dm ds') + T(150, 114, 'n (충돌선)', { a: 'start', s: 11 }) +
        C(365, 120, 14, 'bm2') + A(200, 30, 352, 112, 'ld') + T(206, 26, 'v', { a: 'start', c: 'lb' }) +
        A(352, 128, 230, 206, 'rx') + T(224, 214, 'v′', { a: 'end', c: 'rl' }) +
        P('M300,120A60,60 0 0 1 311.4,88', 'dm') + T(292, 104, 'α', { a: 'end', c: 'it' }) +
        T(430, 70, 'v′_n = e v_n', { a: 'start' }) + T(430, 94, 'v′_t = v_t', { a: 'start' }),
        '마찰이 없으면 벽이 주는 충격력은 법선 방향뿐이라 접선 성분은 변하지 않습니다. 튕겨 나간 공은 법선과 더 큰 각을 이룹니다($e<1$).');
    },
    // d07 — the optimal path q*(t) and varied paths q* + eps*eta with the same end points
    dVariation() {
      const x0 = 70, x1 = 490, y0 = 190, qs = (s) => 60 * Math.sin(Math.PI * s * 0.9) + 20 * s, eta = (s) => Math.sin(2 * Math.PI * s) * Math.sin(Math.PI * s) * 60;
      const path = (eps) => { let d = ''; for (let i = 0; i <= 80; i++) { const s = i / 80; d += `${i ? 'L' : 'M'}${(x0 + (x1 - x0) * s).toFixed(1)},${(y0 - qs(s) - eps * eta(s)).toFixed(1)}`; } return d; };
      return fig(560, 240, '양 끝이 고정된 최적 경로 q*(t)와 그 주위의 변분 경로 q* + εη(t)',
        A(x0, y0 + 20, x1 + 30, y0 + 20, 'ax') + T(x1 + 34, y0 + 24, 't', { a: 'start', c: 'it' }) +
        [-0.6, -0.3, 0.3, 0.6].map((e) => P(path(e), 'gd ds')).join('') + P(path(0), 'cv') +
        C(x0, y0 - qs(0), 4, 'dotf') + C(x1, y0 - qs(1), 4, 'dotf') +
        T(x0, y0 + 38, 't₀', {}) + T(x1, y0 + 38, 't_f', {}) + L(x0, y0 + 16, x0, y0 + 24, 'dm') + L(x1, y0 + 16, x1, y0 + 24, 'dm') +
        T(290, 60, 'q*(t)', { c: 'lb' }) + T(400, 190, 'q* + εη', { a: 'start' }) + T(x0 - 8, y0 - qs(0), 'q(t₀) 고정', { a: 'end', s: 11 }) + T(x1 + 8, y0 - qs(1) - 6, 'q(t_f) 고정', { a: 'start', s: 11 }),
        '변분 $\\eta(t)$는 양 끝에서 0이라 모든 비교 경로가 같은 끝점을 지납니다. 최적 경로에서는 $\\varepsilon$에 대한 적분값의 도함수가 $\\varepsilon=0$에서 0입니다.');
    },
    // d08 — a bead on a hoop spinning about its vertical diameter
    dHoop() {
      const cx = 240, cy = 130, r = 90, th = (40 * Math.PI) / 180, bx = cx + r * Math.sin(th), by = cy + r * Math.cos(th);
      return fig(560, 260, '연직 지름을 축으로 각속도 ω로 도는 원형 고리 위의 구슬, 가장 낮은 점에서 잰 각 θ',
        L(cx, 20, cx, 245, 'gd ds') + `<circle class="cv" cx="${cx}" cy="${cy}" r="${r}" fill="none"/>` +
        mom(cx, 28, 18, 200, -20, 'ld') + T(cx + 26, 26, 'ω', { a: 'start', c: 'lb' }) +
        L(cx, cy, bx, by, 'dm') + C(bx, by, 7, 'bm2') + T(bx + 10, by + 4, 'm', { a: 'start' }) +
        P(`M${cx},${cy + 40}A40,40 0 0 0 ${cx + 40 * Math.sin(th)},${cy + 40 * Math.cos(th)}`, 'dm') + T(cx + 12, cy + 56, 'θ', { a: 'start', c: 'it' }) +
        T(cx - 50, cy - 10, 'r', { a: 'middle', c: 'it' }) + L(cx, cy, cx - 90, cy, 'dm') +
        L(bx, by, cx, by, 'dm ds') + T((bx + cx) / 2, by + 16, 'r sin θ', {}) +
        A(470, 60, 470, 110, 'ld') + T(478, 100, 'g', { a: 'start', c: 'it' }),
        '구슬은 고리를 따라 $\\theta$ 방향으로만 움직이고(자유도 1), 고리와 함께 축을 중심으로 반지름 $r\\sin\\theta$의 원을 돕니다.');
    },
    // d08 — a cart on a rail tied to a wall by a spring, with a pendulum hanging from the cart
    dCartPend() {
      const x = 250, y = 70, l = 120, th = (28 * Math.PI) / 180;
      return fig(560, 240, '벽에 스프링으로 이어진 수레와 수레에 매달린 진자: 일반화 좌표 x와 θ',
        wall(60, 40, 110, 'left') + L(60, 104, 520, 104, 'gd') +
        P(`M60,${y}` + [...Array(12)].map((_, i) => `L${(60 + (x - 30 - 60) * (i + 1) / 12).toFixed(1)},${y + (i % 2 ? -8 : 8)}`).join('') + `L${x - 30},${y}`, 'gd') +
        R(x - 30, y - 18, 60, 36, 'bm') + C(x - 16, y + 25, 7, 'sp') + C(x + 16, y + 25, 7, 'sp') +
        L(x, y, x + l * Math.sin(th), y + l * Math.cos(th), 'gd') + C(x + l * Math.sin(th), y + l * Math.cos(th), 9, 'bm2') +
        L(x, y, x, y + l + 10, 'dm ds') + P(`M${x},${y + 45}A45,45 0 0 0 ${x + 45 * Math.sin(th)},${y + 45 * Math.cos(th)}`, 'dm') + T(x + 8, y + 64, 'θ', { a: 'start', c: 'it' }) +
        T(x, y + 4, 'M', {}) + T(x + l * Math.sin(th) + 14, y + l * Math.cos(th) + 4, 'm', { a: 'start' }) + T(150, y - 16, 'k', { c: 'it' }) +
        A(60, 222, x, 222, 'dm') + T((60 + x) / 2, 216, 'x (스프링이 늘어나지 않을 때 0)', {}),
        '좌표 $(x,\\theta)$ 두 개가 계의 형상을 완전히 정하고 서로 독립입니다. 진자 추의 위치는 $(x+l\\sin\\theta,\\ -l\\cos\\theta)$로 두 좌표의 함수입니다.');
    },
    // d09 — a bar AB sliding with A on the floor and B on the wall; instantaneous centre C
    dLadder() {
      const O = [120, 210], l = 220, th = (35 * Math.PI) / 180, Ax = O[0] + l * Math.sin(th), By = O[1] - l * Math.cos(th);
      return fig(560, 250, '바닥을 따라 미끄러지는 끝 A와 벽을 따라 미끄러지는 끝 B를 가진 막대, 두 속도에 수직인 선의 교점이 순간 중심 C',
        ground(O[0], 520, O[1]) + wall(O[0], 20, O[1], 'left') +
        L(O[0], By, Ax, O[1], 'th') + C(O[0], By, 4, 'jt') + C(Ax, O[1], 4, 'jt') +
        T(O[0] + 10, By - 6, 'B', { a: 'start' }) + T(Ax + 6, O[1] + 16, 'A', { a: 'start' }) +
        A(Ax, O[1] - 8, Ax + 70, O[1] - 8, 'ld') + T(Ax + 74, O[1] - 4, 'v_A', { a: 'start', c: 'lb' }) +
        A(O[0] + 8, By, O[0] + 8, By + 60, 'ld') + T(O[0] + 14, By + 50, 'v_B', { a: 'start', c: 'lb' }) +
        L(O[0], By, Ax, By, 'dm ds') + L(Ax, O[1], Ax, By, 'dm ds') + C(Ax, By, 5, 'dotf') + T(Ax + 8, By - 6, 'C (순간 중심)', { a: 'start', c: 'rl' }) +
        P(`M${O[0]},${By + 50}A50,50 0 0 0 ${O[0] + 50 * Math.sin(th)},${By + 50 * Math.cos(th)}`, 'dm') + T(O[0] + 10, By + 66, 'θ', { a: 'start', c: 'it' }) +
        T((O[0] + Ax) / 2 - 10, (By + O[1]) / 2 - 8, 'l', { a: 'end', c: 'it' }),
        '$A$의 속도는 수평, $B$의 속도는 연직이므로 각 점에서 속도에 수직인 선을 그으면 $C$에서 만납니다. 그 순간 막대는 $C$를 중심으로 도는 것처럼 움직입니다.');
    },
    // d10 — a rotating arm (frame oxy) with a collar sliding outward: relative velocity and Coriolis acceleration
    dCoriolis() {
      const O = [110, 200], th = (30 * Math.PI) / 180, L0 = 360, r = 230, P0 = [O[0] + r * Math.cos(th), O[1] - r * Math.sin(th)];
      const u = [Math.cos(th), -Math.sin(th)], n = [-Math.sin(th), -Math.cos(th)];
      return fig(560, 240, '각속도 Ω로 도는 팔과 팔을 따라 바깥으로 미끄러지는 고리: 상대 속도, 끌림 속도, 코리올리 가속도의 방향',
        A(O[0] - 20, O[1], 520, O[1], 'ax') + T(524, O[1] + 4, 'X', { a: 'start', c: 'it' }) +
        L(O[0], O[1], O[0] + L0 * u[0], O[1] + L0 * u[1], 'th') + C(O[0], O[1], 4, 'jt') + mom(O[0], O[1], 30, 10, 80, 'ld') + T(O[0] + 20, O[1] - 38, 'Ω', { a: 'start', c: 'lb' }) +
        `<g transform="rotate(-30 ${P0[0]} ${P0[1]})">${R(P0[0] - 12, P0[1] - 8, 24, 16, 'bm2')}</g>` +
        A(P0[0], P0[1], P0[0] + 70 * u[0], P0[1] + 70 * u[1], 'ld') + T(P0[0] + 76 * u[0], P0[1] + 76 * u[1] + 4, '(ṙ)_oxy', { a: 'start', c: 'lb' }) +
        A(P0[0], P0[1], P0[0] + 60 * n[0], P0[1] + 60 * n[1], 'rx') + T(P0[0] + 64 * n[0] - 4, P0[1] + 64 * n[1], 'Ω × r', { a: 'end', c: 'rl' }) +
        A(P0[0] - 30 * n[0] + 30 * u[0], P0[1] - 30 * n[1] + 30 * u[1], P0[0] - 30 * n[0] + 30 * u[0] + 50 * n[0], P0[1] - 30 * n[1] + 30 * u[1] + 50 * n[1], 'vl') +
        T(P0[0] - 30 * n[0] + 40 * u[0] + 4, P0[1] - 30 * n[1] + 40 * u[1] + 16, '2Ω × (ṙ)_oxy', { a: 'start' }) +
        T(O[0] + 0.45 * r * u[0], O[1] + 0.45 * r * u[1] + 18, 'r', { c: 'it' }) + T(O[0] - 8, O[1] + 16, 'O', { a: 'end' }),
        '팔과 함께 도는 틀에서 고리는 팔을 따라 곧게 움직이지만, 고정된 틀에서 보면 그 곧은 운동의 방향이 돌기 때문에 옆 방향 가속도 $2\\Omega\\times(\\dot{\\mathbf r})_{oxy}$가 더해집니다.');
    },
    // d11 — a disk rolling down an incline: weight, normal force, static friction up the slope
    dRollIncline() {
      const th = (25 * Math.PI) / 180, s = Math.sin(th), c = Math.cos(th), x0 = 60, y0 = 220, L0 = 440, r = 42;
      const tx = x0 + L0 * c, ty = y0 - L0 * s; // top of the slope
      const Px = tx - 250 * c, Py = ty + 250 * s, Cx = Px - r * s, Cy = Py - r * c;
      return fig(560, 250, '경사각 θ인 면을 미끄러지지 않고 굴러 내려가는 원판: 무게, 수직항력, 경사면을 따라 위로 작용하는 정지 마찰력',
        P(`M${x0},${y0}L${tx},${y0}L${tx},${ty}Z`, 'bm') +
        C(Cx, Cy, r, 'bm2') + C(Cx, Cy, 3, 'jt') +
        A(Cx, Cy, Cx, Cy + 80, 'ld') + T(Cx + 8, Cy + 74, 'mg', { a: 'start', c: 'lb' }) +
        A(Px, Py, Px - 70 * s, Py - 70 * c, 'rx') + T(Px - 74 * s - 4, Py - 74 * c, 'N', { a: 'end', c: 'rl' }) +
        A(Px, Py, Px + 60 * c, Py - 60 * s, 'rx') + T(Px + 64 * c, Py - 64 * s - 6, 'f', { a: 'start', c: 'rl' }) +
        A(Cx - (r + 34) * s + 20 * c, Cy - (r + 34) * c - 20 * s, Cx - (r + 34) * s - 50 * c, Cy - (r + 34) * c + 50 * s, 'vl') + T(Cx - (r + 34) * s - 56 * c, Cy - (r + 34) * c + 50 * s + 4, 'a_G', { a: 'end', c: 'it' }) +
        mom(Cx, Cy, r + 14, 60, 150, 'vl') + T(Cx - 10, Cy - r - 20, 'α', { c: 'it' }) +
        P(`M${x0 + 60},${y0}A60,60 0 0 0 ${x0 + 60 * c},${y0 - 60 * s}`, 'dm') + T(x0 + 68, y0 - 10, 'θ', { a: 'start', c: 'it' }),
        '접촉점이 순간 중심이라 $a_G=r\\alpha$입니다. 마찰력은 원판을 회전시키는 유일한 힘이라 경사면 위쪽을 향하고, 미끄러지지 않으면 일을 하지 않습니다.');
    },
    // d11 — a slender rod pinned at one end, released from rest horizontally
    dPinRod() {
      const x0 = 120, y0 = 110, L0 = 300;
      return fig(560, 220, '한 끝 P가 핀으로 고정된 수평 막대를 정지 상태에서 놓은 순간: 무게, 핀 반력, 각가속도',
        wall(x0 - 16, 70, 150, 'left') + L(x0 - 16, y0, x0, y0, 'gd') + R(x0, y0 - 7, L0, 14, 'bm') + C(x0, y0, 5, 'jt') +
        A(x0 + L0 / 2, y0, x0 + L0 / 2, y0 + 70, 'ld') + T(x0 + L0 / 2 + 8, y0 + 64, 'mg', { a: 'start', c: 'lb' }) + C(x0 + L0 / 2, y0, 3, 'dotf') + T(x0 + L0 / 2, y0 - 14, 'G', {}) +
        A(x0, y0 + 60, x0, y0 + 10, 'rx') + T(x0 + 8, y0 + 54, 'R_y', { a: 'start', c: 'rl' }) +
        mom(x0, y0, 60, 30, -30, 'vl') + T(x0 + 70, y0 + 42, 'α', { a: 'start', c: 'it' }) +
        T(x0 - 8, y0 - 14, 'P', { a: 'end' }) + dim(x0, x0 + L0, 190, 'L'),
        '놓는 순간 $\\omega=0$이라 구심 가속도가 없어 핀의 수평 반력은 0입니다. 핀에 대한 모멘트 식 하나로 $\\alpha$가 나옵니다.');
    },
    // d13 — eccentric impact: two bodies touching at C, common normal n and tangent t, contact-point velocities
    dEccentric() {
      const Cx = 280, Cy = 130;
      return fig(560, 260, '두 강체 A와 B의 편심 충돌: 접촉점 C, 공통 법선(충돌선) n과 접선 t, 충돌 전 접촉점의 속도',
        `<ellipse class="bm2" cx="${Cx - 95}" cy="${Cy - 10}" rx="100" ry="62" transform="rotate(-20 ${Cx - 95} ${Cy - 10})"/>` +
        `<ellipse class="bm" cx="${Cx + 90}" cy="${Cy + 20}" rx="92" ry="58" transform="rotate(25 ${Cx + 90} ${Cy + 20})"/>` +
        L(Cx - 200, Cy, Cx + 220, Cy, 'dm ds') + T(Cx + 222, Cy + 4, 'n (충돌선)', { a: 'start', s: 11 }) +
        L(Cx, 20, Cx, 240, 'dm ds') + T(Cx + 6, 28, 't', { a: 'start', c: 'it' }) +
        C(Cx, Cy, 4, 'jt') + T(Cx + 8, Cy - 8, 'C', { a: 'start' }) +
        C(Cx - 110, Cy - 20, 3, 'dotf') + T(Cx - 110, Cy - 30, 'G_A', {}) + C(Cx + 100, Cy + 30, 3, 'dotf') + T(Cx + 100, Cy + 46, 'G_B', {}) +
        A(Cx - 70, Cy + 50, Cx - 6, Cy + 6, 'ld') + T(Cx - 76, Cy + 64, 'v_A (접촉점)', { a: 'end', c: 'lb' }) +
        A(Cx + 70, Cy - 60, Cx + 6, Cy - 6, 'rx') + T(Cx + 76, Cy - 64, 'v_B (접촉점)', { a: 'start', c: 'rl' }) +
        T(60, 30, 'A', { c: 'lb' }) + T(470, 230, 'B', { c: 'rl' }),
        '충격력은 공통 법선 방향으로만 작용합니다(마찰 무시). 반발 계수는 질량 중심이 아니라 **접촉점**의 법선 방향 속도로 정의합니다.');
    },
    // d14 — dumbbell of two unit masses at (1,1,0) and (-1,-1,0) with its principal axes (oblique projection)
    dDumbbell() {
      const O = [280, 140], s = 70, pr = (x, y, z) => [O[0] + s * (y - 0.55 * x), O[1] - s * (z - 0.35 * x)];
      const [ax, ay] = pr(1, 1, 0), [bx, by] = pr(-1, -1, 0);
      const ln = (p, q, c) => { const [x1, y1] = pr(...p), [x2, y2] = pr(...q); return L(x1, y1, x2, y2, c); };
      const ar = (q, c) => { const [x2, y2] = pr(...q); return A(O[0], O[1], x2, y2, c); };
      const tp = (p, s2, o) => { const [x, y] = pr(...p); return T(x, y, s2, o); };
      return fig(560, 280, '원점에 대칭인 두 단위 질량 (1,1,0), (−1,−1,0)과 세 주축: 막대 방향(1,1,0), 수직 방향(1,−1,0), z축',
        ar([2, 0, 0], 'ax') + ar([0, 2.4, 0], 'ax') + ar([0, 0, 1.7], 'ax') + tp([2.15, 0, 0], 'x', { a: 'end', c: 'it' }) + tp([0, 2.5, 0.05], 'y', { a: 'start', c: 'it' }) + tp([0, 0.1, 1.75], 'z', { a: 'start', c: 'it' }) +
        L(ax, ay, bx, by, 'th') + C(ax, ay, 8, 'bm2') + C(bx, by, 8, 'bm2') + T(ax - 14, ay + 22, '(1, 1, 0)', { a: 'end' }) + T(bx - 12, by - 8, '(−1, −1, 0)', { a: 'end' }) +
        ln([-1.6, -1.6, 0], [1.6, 1.6, 0], 'ld ds') + tp([1.75, 1.85, 0], 'λ = 0', { a: 'start', c: 'lb' }) +
        ln([1.4, -1.4, 0], [-1.4, 1.4, 0], 'rx ds') + tp([-1.45, 1.5, 0.12], 'λ = 4', { a: 'start', c: 'rl' }) +
        tp([0, -0.15, 1.55], 'λ = 4', { a: 'end', c: 'rl' }),
        '막대 방향으로 돌리면 두 질량이 축 위에 있어 관성 모멘트가 0이고, 막대에 수직인 두 방향은 모두 $2m\\cdot(\\sqrt2)^2=4$입니다. $x$, $y$ 축은 주축이 아니라 곱관성 모멘트가 생깁니다.');
    },
    // d15 — a dumbbell fixed to a vertical shaft at angle alpha, spinning with omega; bearings A and B
    dTiltRod() {
      const cx = 280, cy = 140, l = 90, al = (30 * Math.PI) / 180;
      const p1 = [cx + l * Math.sin(al), cy - l * Math.cos(al)], p2 = [cx - l * Math.sin(al), cy + l * Math.cos(al)];
      return fig(560, 290, '연직축에 각 α로 고정된 아령이 각속도 ω로 돈다: 위아래 베어링 A와 B가 받는 동적 반력',
        L(cx, 14, cx, 262, 'th') + R(cx - 12, 22, 24, 14, 'sp') + R(cx - 12, 222, 24, 14, 'sp') + T(cx - 18, 34, 'A', { a: 'end' }) + T(cx - 18, 234, 'B', { a: 'end' }) +
        L(p1[0], p1[1], p2[0], p2[1], 'gd') + C(p1[0], p1[1], 9, 'bm2') + C(p2[0], p2[1], 9, 'bm2') + T(p1[0] + 12, p1[1], 'm', { a: 'start' }) + T(p2[0] - 12, p2[1] + 4, 'm', { a: 'end' }) +
        P(`M${cx},${cy - 50}A50,50 0 0 1 ${cx + 50 * Math.sin(al)},${cy - 50 * Math.cos(al)}`, 'dm') + T(cx + 12, cy - 56, 'α', { a: 'start', c: 'it' }) +
        mom(cx, 262, 20, 200, -20, 'ld') + T(cx + 28, 262, 'ω', { a: 'start', c: 'lb' }) +
        A(cx + 14, 29, cx + 70, 29, 'rx') + T(cx + 74, 33, 'R_A', { a: 'start', c: 'rl' }) + A(cx - 14, 229, cx - 70, 229, 'rx') + T(cx - 74, 220, 'R_B', { a: 'end', c: 'rl' }) +
        T(cx + l * Math.sin(al) / 2 + 8, cy - l * Math.cos(al) / 2 + 12, 'l', { a: 'start', c: 'it' }) + dimv(470, 29, 229, 'd'),
        '질량 중심은 축 위에 있어 정적으로는 균형이지만, 돌리면 두 질량의 구심력이 짝힘을 만들어 축이 기울어지려 합니다. 베어링은 크기가 같고 방향이 반대인 반력으로 이 모멘트를 받으며, 반력의 방향은 막대와 함께 돕니다.');
    },
    // d15 — a disk on a horizontal axle pinned at O, rolling on the floor while the axle turns about the vertical
    dRollAxle() {
      const O = [120, 110], G = [380, 110], r = 70;
      return fig(560, 250, '원점 O에 핀으로 이어진 수평 축의 끝에 달린 원판이 바닥을 미끄러지지 않고 구르며 축이 연직축 둘레로 돈다',
        L(O[0], 30, O[0], 200, 'gd ds') + C(O[0], O[1], 5, 'jt') + L(O[0], O[1], G[0], G[1], 'th') +
        `<ellipse class="bm2" cx="${G[0]}" cy="${G[1]}" rx="18" ry="${r}"/>` + ground(60, 520, G[1] + r) +
        A(G[0], G[1] + r, G[0], G[1] + r - 50, 'rx') + T(G[0] + 8, G[1] + r - 40, 'N', { a: 'start', c: 'rl' }) +
        A(G[0] + 26, G[1], G[0] + 26, G[1] + 50, 'ld') + T(G[0] + 32, G[1] + 46, 'mg', { a: 'start', c: 'lb' }) +
        A(G[0] + 30, G[1] - 10, G[0] + 90, G[1] - 10, 'ld') + T(G[0] + 94, G[1] - 6, 'ω₁ (자전)', { a: 'start', c: 'lb' }) +
        mom(O[0], 36, 20, 200, -20, 'vl') + T(O[0] + 28, 30, 'Ω (공전)', { a: 'start' }) +
        T(O[0] - 10, O[1] + 4, 'O', { a: 'end' }) + T(G[0] - 24, G[1] - 8, 'G', { a: 'end' }) + dim(O[0], G[0], 150, 'L') + dimv(G[0] + 60, G[1], G[1] + r, 'r'),
        '구름 조건 $v_G=r\\omega_1=L\\Omega$. 축과 함께 도는 틀에서 각운동량은 일정하지만, 틀이 $\\Omega$로 돌기 때문에 $\\boldsymbol\\Omega\\times\\mathbf H_O$만큼의 모멘트가 필요하고, 그것을 바닥의 수직항력이 추가로 제공합니다.');
    },
  });
})();
