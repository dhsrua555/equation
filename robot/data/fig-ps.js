/* 로봇공학 그림 — 과제 풀이 Problem Set #1(교재 연습문제 2.10, 2.19, 2.26)과 #3(3.1/3.16, 3.20).
   교재 그림을 그대로 옮기지 않고 세기에 필요한 링크·관절·치수만 남겨 다시 그렸습니다. 그리는 도구는 core/figkit.js(FK). */
(function () {
  const { fig, L, A, T, C, P, R, f1, torus } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  const pr = (cx, cy, s) => (p) => [cx + s * (p[0] + 0.42 * p[1]), cy - s * (p[2] + 0.3 * p[1])];
  const poly = (pts, cls) => P('M' + pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L') + 'Z', cls);
  const bar = (p, q, cls = 'th') => L(p[0], p[1], q[0], q[1], cls);
  const pin = (p) => C(p[0], p[1], 3.6, 'jt');
  const hatch = (x1, y1, x2, y2, side = 1) => { // hatched ground segment, hatches on one side
    let s = L(x1, y1, x2, y2, 'gd'); const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 7));
    const dx = (x2 - x1) / n, dy = (y2 - y1) / n, len = Math.hypot(dx, dy), nx = (-dy / len) * 6 * side, ny = (dx / len) * 6 * side;
    for (let k = 0; k <= n; k++) { const x = x1 + k * dx, y = y1 + k * dy; s += L(x, y, x + nx - dx * 0.5, y + ny - dy * 0.5, 'ht'); }
    return s;
  };
  const gpin = (p) => P(`M${f1(p[0])},${f1(p[1])}L${f1(p[0] - 7)},${f1(p[1] + 11)}L${f1(p[0] + 7)},${f1(p[1] + 11)}Z`, 'sp') + hatch(p[0] - 11, p[1] + 11, p[0] + 11, p[1] + 11) + pin(p);
  const pmark = (p, q) => { // a small prismatic-joint box in the middle of a member
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    return `<rect class="bm2" x="${f1(mx - 7)}" y="${f1(my - 4)}" width="14" height="8" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(mx)} ${f1(my)})"/>`;
  };
  const frame3 = (q, o, ex, ey, ez, len, names, cls = 'vl') => {
    const add = (a, b, k) => a.map((v, i) => v + k * b[i]);
    const O = q(o);
    let s = C(...O, 3, 'jt');
    [[ex, names[0]], [ey, names[1]], [ez, names[2]]].forEach(([e, n]) => { const E = q(add(o, e, len)), Lb = q(add(o, e, len * 1.22)); s += A(...O, ...E, cls, 8) + T(Lb[0], Lb[1] + 4, n, { c: 'it' }); });
    return s;
  };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // PS1 · 2.10 — the four planar mechanisms of MR Fig. 2.19, redrawn as link–joint sketches
    fp1Mech() {
      let s = '';
      // (a) seven revolute joints, two ternary plates
      {
        const m = (x, y) => [12 + (x - 78) * 0.4, 46 + (y - 255) * 0.4];
        const G1 = m(78, 535), P1 = m(125, 325), P2 = m(155, 537), P3 = m(248, 435), P4 = m(256, 255), P5 = m(428, 385), G2 = m(425, 500);
        s += poly([P1, P2, P3], 'bm2') + poly([P3, P5, G2], 'bm2');
        s += bar(G1, P1) + L(...P2, ...P4, 'th ds') + bar(P4, P5);
        [P1, P2, P3, P4, P5].forEach((p) => { s += pin(p); });
        s += gpin(G1) + gpin(G2) + T(80, 200, '(a) R 7개', { c: 'em', s: 11.5 });
      }
      // (b) two PPR chains holding a plate
      {
        const m = (x, y) => [158 + (x - 480) * 0.333, 30 + (y - 100) * 0.333];
        s += hatch(...m(490, 105), ...m(900, 105), -1) + hatch(...m(490, 540), ...m(900, 540), 1);
        s += R(...m(500, 113), 33, 8, 'bm') + bar(m(540, 121), m(540, 450), 'th');
        s += R(...m(785, 520), 33, 8, 'bm') + bar(m(833, 520), m(833, 190), 'th');
        s += poly([m(600, 285), m(715, 215), m(780, 320), m(665, 390)], 'bm2');
        s += bar(m(540, 340), m(660, 342), 'gd') + pin(m(660, 342)) + R(m(540, 340)[0] - 4, m(540, 340)[1] - 5, 8, 10, 'bm');
        s += bar(m(833, 265), m(718, 265), 'gd') + pin(m(718, 265)) + R(m(833, 265)[0] - 4, m(833, 265)[1] - 5, 8, 10, 'bm');
        s += A(...m(510, 150), ...m(570, 150), 'ld', 6) + A(...m(800, 495), ...m(860, 495), 'ld', 6);
        s += T(230, 200, '(b) R 2 + P 4', { c: 'em', s: 11.5 });
      }
      // (c) sliders, two parallelograms, a long rod and a ground triangle
      {
        const m = (x, y) => [306 + (x - 60) * 0.29, 40 + (y - 110) * 0.29];
        const S1 = m(85, 255), A1 = m(165, 155), B1 = m(275, 180), C1 = m(195, 285), top = m(265, 125), bot = m(325, 385), D1 = m(310, 325), E1 = m(358, 230), F1 = m(462, 247), G1 = m(413, 343), H1 = m(505, 318);
        s += hatch(...m(55, 230), ...m(115, 285), -1) + R(S1[0] - 5, S1[1] - 4, 10, 8, 'bm');
        s += hatch(...m(290, 400), ...m(360, 400), 1) + R(bot[0] - 5, bot[1] - 4, 10, 8, 'bm');
        s += bar(S1, A1, 'gd') + bar(A1, B1, 'gd') + bar(B1, C1, 'gd') + bar(C1, S1, 'gd');
        s += L(...top, ...bot, 'th');
        s += bar(D1, E1, 'gd') + bar(E1, F1, 'gd') + bar(F1, G1, 'gd') + bar(G1, D1, 'gd') + bar(F1, H1, 'gd') + bar(G1, H1, 'gd');
        [S1, A1, B1, C1, bot, D1, E1, F1, G1].forEach((p) => { s += pin(p); });
        s += hatch(...m(530, 290), ...m(530, 350), 1) + pin(H1);
        s += T(386, 200, '(c) P 2 + R 16', { c: 'em', s: 11.5 });
      }
      // (d) a truss between two walls, prismatic joints in nine members
      {
        const x0 = 470, x1 = 590, yT = 70, yB = 140, xs = [x0, x0 + 40, x0 + 80, x1];
        s += hatch(x0, yT - 22, x0, yB + 22, -1) + hatch(x1, yT - 22, x1, yB + 22, 1);
        for (let i = 0; i < 3; i++) {
          s += bar([xs[i], yT], [xs[i + 1], yT], 'gd') + pmark([xs[i], yT], [xs[i + 1], yT]);
          s += bar([xs[i], yB], [xs[i + 1], yB], 'gd') + pmark([xs[i], yB], [xs[i + 1], yB]);
          s += bar([xs[i], yB], [xs[i + 1], yT], 'gd') + pmark([xs[i], yB], [xs[i + 1], yT]);
        }
        s += bar([xs[1], yT], [xs[1], yB], 'gd') + bar([xs[2], yT], [xs[2], yB], 'gd');
        xs.forEach((x) => { s += pin([x, yT]) + pin([x, yB]); });
        s += T(530, 200, '(d) P 9 + R 18', { c: 'em', s: 11.5 });
      }
      return fig(600, 212, '교재 그림 2.19의 네 평면 기구를 링크와 관절만 남겨 다시 그림',
        s,
        '(a) 삼각판 두 개를 포함한 링크 5개와 회전 관절 7개. (b) 바닥 레일 위의 T자 슬라이더와 그 위를 미끄러지는 팔(P 둘)이 판을 핀(R)으로 잡는 사슬 둘. (c) 왼쪽·아래 슬라이더, 평행사변형 둘, 긴 막대, 바닥 핀의 삼각형 — 한 핀에 링크 셋이 모이는 곳이 많습니다. (d) 상자 표시가 병진 관절인 트러스(병진 관절이 있는 막대는 링크 둘).');
    },
    // PS1 · 2.19 — the dual-arm robot holding a box that slides on the table
    fp1Dual() {
      let s = '';
      s += poly([[120, 196], [470, 196], [520, 150], [170, 150]], 'rg') + T(500, 190, '탁자', { a: 'end', s: 11 });
      const Rj = [300, 126];
      s += P(`M${Rj[0] - 9},${Rj[1] + 12}L${Rj[0] + 9},${Rj[1] + 12}`, 'gd') + L(Rj[0] - 10, Rj[1] + 12, Rj[0] - 14, Rj[1] + 18, 'ht') + L(Rj[0], Rj[1] + 12, Rj[0] - 4, Rj[1] + 18, 'ht') + L(Rj[0] + 10, Rj[1] + 12, Rj[0] + 6, Rj[1] + 18, 'ht');
      s += R(Rj[0] - 12, Rj[1] - 8, 24, 16, 'bm') + T(Rj[0] + 18, Rj[1] + 4, 'R (허리)', { a: 'start', s: 11 });
      const S1 = [214, 34], S2 = [386, 34];
      s += poly([S1, S2, [Rj[0] + 6, Rj[1] - 8], [Rj[0] - 6, Rj[1] - 8]], 'bm2');
      const E1 = [170, 92], E2 = [430, 92], W1 = [252, 166], W2 = [348, 166];
      s += L(...S1, ...E1, 'th') + L(...E1, ...W1, 'th') + L(...S2, ...E2, 'th') + L(...E2, ...W2, 'th');
      s += R(262, 158, 76, 16, 'bm') + T(300, 170, '상자', { s: 11 });
      [[S1, 'S'], [S2, 'S'], [W1, 'S'], [W2, 'S']].forEach(([p, n]) => { s += C(p[0], p[1], 6, 'sp') + T(p[0] + (p[0] < 300 ? -10 : 10), p[1] - 6, n, { a: p[0] < 300 ? 'end' : 'start', c: 'em', s: 11 }); });
      [E1, E2].forEach((p) => { s += C(p[0], p[1], 5, 'jt') + T(p[0] + (p[0] < 300 ? -10 : 10), p[1] + 4, 'R', { a: p[0] < 300 ? 'end' : 'start', c: 'em', s: 11 }); });
      s += A(282, 186, 318, 186, 'ld', 6) + A(318, 186, 282, 186, 'ld', 6) + T(300, 210, '탁자 위에서 x, y, 회전 (f = 3)', { s: 11 });
      return fig(600, 216, '두 팔 로봇이 탁자 위의 상자를 단단히 잡고 있다: 팔마다 S-R-S, 몸통은 바닥에 R',
        s,
        '손–상자–손은 한 덩어리(링크 하나)이고, 상자 바닥과 탁자 사이는 평면 관절($f=3$)입니다. 링크: 바닥, 몸통, 위팔 2, 아래팔 2, 손+상자 → $N=7$. 관절: R 3, S 4, 평면 1 → $J=8$.');
    },
    // PS1 · 2.26 — the 2R arm with link lengths 2 and 1: C-space (torus) vs workspace (annulus)
    fp1Work() {
      const cx = 170, cy = 116, k = 30;
      let s = `<path class="fl2" d="M${cx - 3 * k},${cy}A${3 * k},${3 * k} 0 1 0 ${cx + 3 * k},${cy}A${3 * k},${3 * k} 0 1 0 ${cx - 3 * k},${cy}ZM${cx - k},${cy}A${k},${k} 0 1 1 ${cx + k},${cy}A${k},${k} 0 1 1 ${cx - k},${cy}Z" fill-rule="evenodd"/>`;
      s += C(cx, cy, 3 * k, 'dm') + C(cx, cy, k, 'dm');
      const t1 = 40, t2 = 70, e = [cx + 2 * k * Math.cos(rad(t1)), cy - 2 * k * Math.sin(rad(t1))], p = [e[0] + k * Math.cos(rad(t1 + t2)), e[1] - k * Math.sin(rad(t1 + t2))];
      s += L(cx, cy, ...e, 'th') + L(...e, ...p, 'th') + C(cx, cy, 5, 'jt') + C(...e, 5, 'jt') + C(...p, 4, 'dotf');
      s += T((cx + e[0]) / 2 + 8, (cy + e[1]) / 2 + 14, '2', { a: 'start', c: 'it' }) + T((e[0] + p[0]) / 2 - 6, (e[1] + p[1]) / 2 - 2, '1', { a: 'end', c: 'it' });
      s += A(cx, cy, cx - 3 * k * Math.cos(rad(30)), cy + 3 * k * Math.sin(rad(30)), 'dm', 7) + T(cx - 52, cy + 34, 'r = 3', { s: 11 });
      s += A(cx, cy, cx + k * Math.cos(rad(-60)), cy - k * Math.sin(rad(-60)), 'dm', 7) + T(cx + 22, cy + 30, 'r = 1', { a: 'start', s: 11 });
      s += T(cx, cy + 3 * k + 22, '작업 공간: 1 ≤ r ≤ 3인 고리', { c: 'em', s: 12 });
      // torus sketch for the C-space
      const tx = 440, ty = 112;
      s += torus(tx, ty, 64, 27, { l1: 'θ_1', l2: 'θ_2' });
      s += T(tx, cy + 3 * k + 22, 'C-공간: 토러스 T² = S¹ × S¹', { c: 'em', s: 12 });
      return fig(600, 240, '2R 팔(링크 길이 2, 1): 끝점이 닿는 작업 공간은 고리, 관절 각의 C-공간은 토러스',
        s,
        '끝점까지의 거리 $\\sqrt{5+4\\cos\\theta_2}$는 1에서 3 사이이고 $\\theta_1$이 방향을 정하므로 작업 공간은 고리입니다. 반면 C-공간은 두 관절 각 $(\\theta_1,\\theta_2)$ 전체로, 각각이 원이라 토러스입니다. 고리 안의 한 점에는 C-공간의 두 점(팔꿈치 위·아래)이 대응합니다.');
    },
    // PS3 · 3.1 / 3.16 — the frames {s}, {a}, {b}
    fp3Frames() {
      const q = pr(104, 180, 74);
      let s = frame3(q, [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.8, ['x_s', 'y_s', 'z_s'], 'dm') + T(...q([0, 0, 0]).map((v, i) => v + (i ? 18 : -10)), '{s}', { a: 'end', c: 'em' });
      s += L(...q([0, 0, 0]), ...q([3, 0, 0]), 'dm ds') + L(...q([0, 0, 0]), ...q([0, 2, 0]), 'dm ds');
      s += frame3(q, [3, 0, 0], [0, 0, 1], [-1, 0, 0], [0, -1, 0], 1.0, ['x_a', 'y_a', 'z_a'], 'ld') + T(...q([3, 0, 0]).map((v, i) => v + (i ? 20 : 10)), '{a} (3, 0, 0)', { a: 'start', c: 'em' });
      s += frame3(q, [0, 2, 0], [1, 0, 0], [0, 0, -1], [0, 1, 0], 1.0, ['x_b', 'y_b', 'z_b'], 'rx') + T(...q([0, 2, 0]).map((v, i) => v + (i ? -34 : -6)), '{b} (0, 2, 0)', { c: 'em' });
      return fig(460, 250, '{s}에서 본 {a}(x_a = ẑ_s, y_a = −x̂_s)와 {b}(x_b = x̂_s, y_b = −ẑ_s). 원점은 3.16의 값',
        s,
        '셋째 축은 외적으로: $\\hat z_a=\\hat x_a\\times\\hat y_a=-\\hat y_s$, $\\hat z_b=\\hat x_b\\times\\hat y_b=\\hat y_s$. 연습문제 3.1은 방향만, 3.16은 원점 $(3,0,0)$, $(0,2,0)$까지 씁니다.');
    },
    // PS3 · 3.20 — the high-wheel bicycle, side view
    fp3Bike() {
      const g = 196, k = 34, ax = 120, bx = 380; // ground line, r in px, wheel centres
      const a = [ax, g - k], b = [bx, g - 2 * k];
      let s = L(40, g, 560, g, 'gd');
      s += C(...a, k, 'sp') + C(...b, 2 * k, 'sp') + L(...a, ...b, 'th') + C(...a, 3, 'jt') + C(...b, 3, 'jt');
      const fr = (p, nm) => A(...p, p[0], p[1] - 30, 'vl', 7) + A(...p, p[0] + 30, p[1], 'vl', 7) + C(p[0], p[1], 6, 'sp') + C(p[0], p[1], 2, 'dotf') + T(p[0] + 4, p[1] - 36, 'ŷ', { c: 'it' }) + T(p[0] + 36, p[1] + 4, 'ẑ', { a: 'start', c: 'it' }) + T(p[0] - 10, p[1] + 18, nm, { a: 'end', c: 'em' });
      s += fr(a, '{a}') + fr(b, '{b}');
      const top = [bx, g - 4 * k];
      s += A(...top, top[0], top[1] - 26, 'vl', 7) + A(...top, top[0] + 26, top[1], 'vl', 7) + C(...top, 3, 'jt') + T(top[0] + 32, top[1] + 4, 'ẑ', { a: 'start', c: 'it' }) + T(top[0] - 8, top[1] - 8, '{c} 꼭대기', { a: 'end', c: 'em' });
      s += `<path class="rx" d="M${bx + 2 * k * Math.cos(rad(60))},${g - 2 * k - 2 * k * Math.sin(rad(60))}A${2 * k},${2 * k} 0 0 1 ${bx + 2 * k},${g - 2 * k}"/>` + A(bx + 2 * k * Math.cos(rad(8)), g - 2 * k - 2 * k * Math.sin(rad(8)), bx + 2 * k, g - 2 * k + 4, 'rx', 8) + T(bx + 2 * k + 8, g - 3 * k, 'θ', { a: 'start', c: 'rl' });
      s += A(470, g + 16, 540, g + 16, 'ld', 8) + T(505, g + 30, '앞으로 2rθ', { s: 11 });
      s += T(ax, g + 16, 'r', { c: 'it' }) + T(bx - 2 * k - 10, g - k, '2r', { a: 'end', c: 'it' }) + T((ax + bx) / 2, (a[1] + b[1]) / 2 - 10, 'L', { c: 'it' });
      return fig(600, 236, '하이휠 자전거(옆에서 본 모습): 뒷바퀴 반지름 r, 앞바퀴 2r, 두 중심 사이 L. x̂는 화면 밖(바퀴 축)',
        s,
        '{a}, {b}는 바퀴 중심에서 바퀴와 함께 돌고({c}도 앞바퀴에 붙어 꼭대기에서 출발), $\\hat x$는 바퀴 축 방향(화면 밖)입니다. 앞바퀴가 $\\theta$ 돌면 자전거는 $2r\\theta$ 나아가고 뒷바퀴는 $2\\theta$ 돕니다. {c}는 바퀴 축 방향으로 $D$만큼 떨어져 있어 이 그림에서는 보이지 않습니다.');
    },
  });
})();
