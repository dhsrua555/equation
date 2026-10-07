/* 로봇공학 그림 — 중간고사 1 범위에 새로 넣은 단원(5 움직이는 좌표계, 7 오일러 각, 8 동차 변환, 9 D-H)과 10단원의 SO(3) 공.
   그리는 도구는 core/figkit.js(FK). 각도는 수학 방향(반시계, y 위)으로 받고 화면 좌표(y 아래)로 바꿉니다.
   3차원 스케치는 사투영 pr(cx, cy, s): x 오른쪽, y 오른쪽 위(뒤), z 위. */
(function () {
  const { fig, L, A, T, C, P, f1 } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  const pr = (cx, cy, s) => (p) => [cx + s * (p[0] + 0.42 * p[1]), cy - s * (p[2] + 0.3 * p[1])];
  const path = (pts, cls) => P('M' + pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L'), cls);
  // planar frame at (x,y), x axis at math angle a
  const frame = (x, y, a, len, sx, sy, cls = 'vl') => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return A(x, y, x + len * c, y - len * s, cls, 8) + A(x, y, x - len * s, y - len * c, cls, 8) + C(x, y, 2.8, 'jt') +
      T(x + (len + 11) * c, y - (len + 11) * s + 4, sx, { c: 'it' }) + T(x - (len + 11) * s, y - (len + 11) * c + 4, sy, { c: 'it' });
  };
  const arc = (x, y, r, a0, a1, cls = 'dm') => {
    const p = (a) => [x + r * Math.cos(rad(a)), y - r * Math.sin(rad(a))];
    const [xa, ya] = p(a0), [xb, yb] = p(a1);
    return `<path class="${cls}" d="M${f1(xa)},${f1(ya)}A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f1(xb)},${f1(yb)}"/>`;
  };
  // curved arrow (counter-clockwise from a0 to a1, degrees) around (x,y)
  const spin = (x, y, r, a0, a1, cls = 'rx') => {
    const p = (a) => [x + r * Math.cos(rad(a)), y - r * Math.sin(rad(a))];
    const [xb, yb] = p(a1 - 10), [xc, yc] = p(a1);
    return arc(x, y, r, a0, a1 - 6, cls) + A(xb, yb, xc, yc, cls, 8);
  };
  // circle of radius r around the axis spanned by e1, e2 (unit vectors), projected
  const ring = (q, c0, e1, e2, r, cls, n = 72) => {
    const pts = [];
    for (let k = 0; k <= n; k++) { const t = (2 * Math.PI * k) / n; pts.push(q([0, 1, 2].map((i) => c0[i] + r * (Math.cos(t) * e1[i] + Math.sin(t) * e2[i])))); }
    return path(pts, cls);
  };
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const sc = (a, k) => a.map((v) => v * k);

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 05 — a point written in a moving frame
    rMovingFrame() {
      const s0 = [70, 196], ob = [318, 128], p = [404, 44];
      let s = `<ellipse class="bm2" cx="372" cy="104" rx="118" ry="56" transform="rotate(-24 372 104)"/>`;
      s += T(470, 160, '움직이는 물체', { s: 11.5 });
      s += frame(...s0, 0, 46, 'x_s', 'y_s') + T(s0[0] - 10, s0[1] + 16, '{s}', { a: 'end', c: 'em' });
      s += A(s0[0], s0[1], ob[0] - 4, ob[1] + 1, 'dm', 8) + T(190, 178, 'o_b', { c: 'it' });
      s += frame(...ob, 24, 40, 'x_b', 'y_b', 'vl') + T(ob[0] + 30, ob[1] + 32, '{b}', { a: 'start', c: 'em' });
      s += A(...ob, p[0] - 4, p[1] + 2, 'ld', 8) + T(352, 78, 'r', { c: 'it' });
      s += C(...p, 4.5, 'dotf') + T(p[0] + 8, p[1] - 6, 'p', { a: 'start', c: 'it' });
      s += spin(...ob, 22, 200, 330, 'rx') + T(ob[0] - 30, ob[1] + 30, 'ω', { c: 'it' });
      return fig(560, 230, '움직이는 좌표계: 점 p는 {b}의 원점 o_b와 {b}의 축으로 적은 r의 합',
        s,
        '$p=o_b+x\\hat x_b+y\\hat y_b+z\\hat z_b$. {b}가 각속도 $\\omega$로 도는 동안 미분하면 축의 미분 $\\dot{\\hat x}_b=\\omega\\times\\hat x_b$ 때문에 $\\omega\\times r$ 항이 생겨 $v_p=v_o+v_{\\text{rel}}+\\omega\\times r$입니다.');
    },
    // 05 — the bug on the spinning disk: velocity and acceleration terms
    rBugDisk() {
      const R = 98, ang = 105, sb = 62;
      const panel = (cx, cy, acc) => {
        const yb = [Math.cos(rad(ang)), -Math.sin(rad(ang))], xb = [Math.cos(rad(ang - 90)), -Math.sin(rad(ang - 90))];
        const bug = [cx + sb * yb[0], cy + sb * yb[1]];
        let s = C(cx, cy, R, 'sp') + C(cx, cy, 3, 'jt');
        s += L(cx, cy, cx + (R - 4) * yb[0], cy + (R - 4) * yb[1], 'dm ds');
        if (!acc) s += A(cx, cy, cx + 34 * xb[0], cy + 34 * xb[1], 'vl', 7) + T(cx + 46 * xb[0], cy + 46 * xb[1] + 4, 'x_b', { c: 'it' });
        s += spin(cx, cy, R + 12, 205, 250, 'rx') + T(cx - R + 2, cy + R - 14, 'Ω', { c: 'it' });
        s += C(...bug, 6, 'bm') + C(bug[0] + 3 * yb[0], bug[1] + 3 * yb[1], 2.4, 'dotf');
        if (!acc) {
          // the path traced in the fixed frame (Archimedean spiral) up to the bug
          const pts = [];
          for (let k = 0; k <= 60; k++) { const u = k / 60, r = sb * u, a = ang - (1 - u) * 230; pts.push([cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))]); }
          s += path(pts, 'dm ds');
          const v1 = [bug[0] + 38 * yb[0], bug[1] + 38 * yb[1]], v2 = [bug[0] - 54 * xb[0], bug[1] - 54 * xb[1]];
          s += A(...bug, ...v1, 'ld', 8) + T(v1[0] - 8, v1[1] + 2, 'ṡ ŷ_b', { a: 'end', c: 'it' });
          s += A(...bug, ...v2, 'rx', 8) + T(cx - R - 6, v2[1] + 8, '−Ωs x̂_b', { a: 'end', c: 'it' });
          s += A(...bug, v1[0] - 54 * xb[0], v1[1] - 54 * xb[1], 'vl', 8) + T(v1[0] - 54 * xb[0] - 6, v1[1] - 54 * xb[1] - 4, 'v', { a: 'end', c: 'it' });
          s += T(cx, cy + R + 32, '속도: 기기 + 휩쓸림', { c: 'em', s: 12 });
        } else {
          const a1 = [bug[0] - 46 * xb[0], bug[1] - 46 * xb[1]], a2 = [bug[0] - 52 * yb[0], bug[1] - 52 * yb[1]];
          s += A(...bug, ...a1, 'rx', 8) + T(cx - R + 8, a1[1] - 14, '코리올리', { a: 'end', s: 11.5 }) + T(cx - R + 2, a1[1] + 4, '−2Ωṡ x̂_b', { a: 'end', s: 11.5 });
          s += A(...bug, ...a2, 'ld', 8) + T((bug[0] + a2[0]) / 2 + 10, (bug[1] + a2[1]) / 2 + 6, '구심 −Ω²s ŷ_b', { a: 'start', s: 11.5 });
          s += T(cx, cy + R + 32, '가속도 (ṡ, Ω 일정)', { c: 'em', s: 12 });
        }
        return s;
      };
      return fig(580, 278, '돌아가는 원판 위의 벌레: 왼쪽은 속도의 두 성분과 고정 좌표계에서 본 나선 궤적, 오른쪽은 코리올리 항과 구심 항',
        panel(176, 132, false) + panel(452, 132, true),
        '{b}는 원판에 붙어 함께 돌고 벌레는 $\\hat y_b$를 따라 기어갑니다(점선은 고정 좌표계에서 본 벌레의 길 — 아르키메데스 나선). 속도는 $\\dot s\\hat y_b-\\Omega s\\hat x_b$, 기는 빠르기와 원판의 회전이 일정하면 가속도는 코리올리 $-2\\Omega\\dot s\\,\\hat x_b$(앞쪽)와 구심 $-\\Omega^2s\\,\\hat y_b$(중심 쪽)만 남습니다.');
    },
    // 07 — the ZYX gimbal at its zero position and in gimbal lock
    rGimbal() {
      const panel = (cx, lock) => {
        const q = pr(cx, 132, 62);
        const Ry = (v) => (lock ? [v[2], v[1], -v[0]] : v); // Rot(y, 90°)
        const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], O = [0, 0, 0];
        let s = '';
        // joint axes (dashed) with labels
        const ax = (d, lab, cls, len = 1.75) => L(...q(sc(d, -len)), ...q(sc(d, len)), cls + ' ds') + A(...q(sc(d, len - 0.25)), ...q(sc(d, len)), cls, 7) + T(...add(q(sc(d, len + 0.1)), [6, -4]), lab, { a: 'start', s: 11.5 });
        s += ax(Z, '축 1 (α)', 'dm');
        s += ax(Y, '축 2 (β)', 'dm', 1.9);
        s += ax(Ry(X), lock ? '축 3 (γ) — 축 1과 겹침' : '축 3 (γ)', lock ? 'rx' : 'dm', lock ? 1.35 : 1.6);
        // rings: outer around z, middle around y, inner around (rotated) x
        s += ring(q, O, X, Y, 1.3, 'gd');
        s += ring(q, O, X, Z, 1.02, 'gd');
        s += ring(q, O, Ry(Y), Ry(Z), 0.74, lock ? 'rx' : 'ld');
        // camera body with its lens along axis 3
        const lens = Ry(X), c0 = sc(lens, 0.25);
        s += L(...q(sc(lens, -0.18)), ...q(sc(lens, 0.42)), 'th') + C(...q(c0), 7, 'bm') + A(...q(sc(lens, 0.3)), ...q(sc(lens, 0.62)), 'vl', 7);
        s += T(cx, 268, lock ? 'β = 90°: 짐벌 록' : '영 자세 (α = β = γ = 0)', { c: 'em', s: 12 });
        return s;
      };
      return fig(580, 280, 'ZYX 짐벌: 바깥 고리는 축 1(ẑ), 가운데 고리는 축 2(ŷ), 안쪽 고리와 카메라는 축 3(x̂) 둘레로 돈다. β = 90°이면 축 3이 축 1과 나란해진다',
        panel(150, false) + panel(430, true),
        '영 자세(왼쪽)에서 세 관절 축은 서로 수직입니다. 가운데 관절이 $\\beta=90°$ 돌면(오른쪽) 안쪽 고리의 축이 바깥 고리의 축과 겹쳐, $\\alpha$와 $\\gamma$가 같은 축 둘레의 회전이 됩니다. 이때 카메라는 그 축에 수직인 방향으로는 순간적으로 돌 수 없습니다.');
    },
    // 07 — roll, pitch, yaw of an aircraft: front, side and top views
    rRPY() {
      const dotAxis = (x, y, into) => C(x, y, 7, 'sp') + (into ? L(x - 4, y - 4, x + 4, y + 4, 'vl') + L(x - 4, y + 4, x + 4, y - 4, 'vl') : C(x, y, 2.2, 'dotf'));
      const panel = (cx, kind) => {
        const cy = 98;
        let s = '';
        if (kind === 'roll') { // front view: wings left-right, fin up, x out of the page
          s += L(cx - 70, cy, cx + 70, cy, 'th') + C(cx, cy, 13, 'bm') + L(cx, cy - 13, cx, cy - 36, 'th') + L(cx - 22, cy - 4, cx + 22, cy - 4, 'gd');
          s += dotAxis(cx, cy, false) + T(cx, cy + 76, 'x̂ (기수, 화면 밖)', { s: 11 });
          s += spin(cx, cy, 54, 200, 340, 'rx') + T(cx, 204, '롤 γ — 기수 축 x̂ 둘레', { c: 'em', s: 12 }) + T(cx, 22, '앞에서 본 모습', { s: 11 });
        } else if (kind === 'pitch') { // side view: nose to the right, y into the page
          s += P(`M${cx - 70},${cy}L${cx + 58},${cy}Q${cx + 74},${cy} ${cx + 66},${cy + 6}L${cx - 70},${cy + 6}Z`, 'bm') + L(cx - 66, cy, cx - 72, cy - 30, 'th') + L(cx - 6, cy + 3, cx + 14, cy + 3, 'gd');
          s += A(cx + 72, cy + 3, cx + 92, cy + 3, 'vl', 7) + T(cx + 94, cy - 6, 'x̂', { a: 'start', c: 'it' });
          s += A(cx, cy + 3, cx, cy + 36, 'vl', 7) + T(cx + 6, cy + 46, 'ẑ (아래)', { a: 'start', s: 11 });
          s += dotAxis(cx, cy + 3, true) + T(cx - 16, cy + 26, 'ŷ (날개, 화면 안)', { a: 'end', s: 11 });
          s += spin(cx, cy + 3, 50, 20, 160, 'rx') + T(cx, 204, '피치 β — 날개 축 ŷ 둘레', { c: 'em', s: 12 }) + T(cx, 22, '옆에서 본 모습', { s: 11 });
        } else { // top view: nose to the right, wings up-down, z into the page (down)
          s += L(cx - 70, cy, cx + 66, cy, 'th') + P(`M${cx + 10},${cy}L${cx - 14},${cy - 62}L${cx - 26},${cy - 62}L${cx - 12},${cy}L${cx - 26},${cy + 62}L${cx - 14},${cy + 62}Z`, 'bm') + L(cx - 60, cy - 18, cx - 60, cy + 18, 'th');
          s += A(cx + 66, cy, cx + 96, cy, 'vl', 7) + T(cx + 98, cy - 6, 'x̂', { a: 'start', c: 'it' });
          s += dotAxis(cx + 28, cy, true) + T(cx + 4, cy + 50, 'ẑ (아래, 화면 안)', { a: 'start', s: 11 });
          s += spin(cx + 28, cy, 30, 100, 240, 'rx') + T(cx, 204, '요 α — 수직축 ẑ 둘레', { c: 'em', s: 12 }) + T(cx, 22, '위에서 본 모습', { s: 11 });
        }
        return s;
      };
      return fig(600, 216, '비행기의 롤(기수 축 x̂ 둘레), 피치(날개 축 ŷ 둘레), 요(수직축 ẑ 둘레)',
        panel(96, 'roll') + panel(292, 'pitch') + panel(490, 'yaw'),
        'XYZ 롤-피치-요: 고정 축 $\\hat x$ 둘레로 $\\gamma$(롤), $\\hat y$ 둘레로 $\\beta$(피치), $\\hat z$ 둘레로 $\\alpha$(요)를 차례로 돌린 방향은 $\\mathrm{Rot}(\\hat z,\\alpha)\\mathrm{Rot}(\\hat y,\\beta)\\mathrm{Rot}(\\hat x,\\gamma)$ — ZYX 오일러 각과 같은 행렬입니다. 비행기에서는 $\\hat x$를 기수, $\\hat y$를 오른쪽 날개, $\\hat z$를 아래로 잡는 경우가 많습니다.');
    },
    // 08 — a chain of frames: compose along a path, invert edges walked backwards
    rFrameChain() {
      const S = [86, 156], Cm = [258, 50], O = [450, 128], B = [282, 198];
      const ctl = (p, q2, bend) => { const mx = (p[0] + q2[0]) / 2, my = (p[1] + q2[1]) / 2, dx = q2[0] - p[0], dy = q2[1] - p[1], n = Math.hypot(dx, dy); return [mx + (bend * dy) / n, my - (bend * dx) / n]; };
      const curve = (p, q2, bend, cls, head) => {
        const [mx, my] = ctl(p, q2, bend);
        const t = 0.9, x = (1 - t) * (1 - t) * p[0] + 2 * (1 - t) * t * mx + t * t * q2[0], y = (1 - t) * (1 - t) * p[1] + 2 * (1 - t) * t * my + t * t * q2[1];
        return P(`M${f1(p[0])},${f1(p[1])}Q${f1(mx)},${f1(my)} ${f1(x)},${f1(y)}`, cls) + A(x, y, q2[0], q2[1], head, 9);
      };
      let s = '';
      s += frame(...S, 0, 30, 'x', 'y') + T(S[0] - 8, S[1] + 22, '{s} 고정', { a: 'end', c: 'em' });
      s += A(...Cm, Cm[0] + 30, Cm[1], 'vl', 7) + A(...Cm, Cm[0], Cm[1] + 30, 'vl', 7) + C(...Cm, 2.8, 'jt') + T(Cm[0] + 40, Cm[1] + 4, 'x', { c: 'it' }) + T(Cm[0] + 6, Cm[1] + 42, 'z (아래를 봄)', { a: 'start', s: 10.5 }) + T(Cm[0] - 10, Cm[1] - 8, '{c} 카메라', { a: 'end', c: 'em' });
      s += frame(...O, 90, 26, 'x', 'y') + T(O[0] + 14, O[1] + 22, '{o} 물체', { a: 'start', c: 'em' });
      s += frame(...B, 0, 26, 'x', 'y') + T(B[0] - 8, B[1] + 20, '{b} 로봇', { a: 'end', c: 'em' });
      s += curve([S[0] + 14, S[1] - 20], [Cm[0] - 14, Cm[1] + 6], -22, 'ld', 'ld') + T(140, 80, 'T_{sc}', { c: 'it' });
      s += curve([Cm[0] + 40, Cm[1] + 14], [O[0] - 18, O[1] - 16], -22, 'ld', 'ld') + T(388, 66, 'T_{co}', { c: 'it' });
      s += curve([S[0] + 18, S[1] + 10], [B[0] - 18, B[1] - 4], 18, 'ld', 'ld') + T(160, 206, 'T_{sb}', { c: 'it' });
      s += curve([B[0] + 34, B[1] - 6], [O[0] - 10, O[1] + 12], 20, 'rx ds', 'rx') + T(400, 196, 'T_{bo} = T_{sb}⁻¹ T_{sc} T_{co}', { a: 'middle', c: 'rl' });
      return fig(560, 226, '좌표계 사슬: 로봇에서 본 물체 T_bo는 T_sb를 거꾸로, T_sc와 T_co를 앞으로 지나는 길',
        s,
        '$T_{bo}=T_{sb}^{-1}\\,T_{sc}\\,T_{co}$ — 화살표 방향으로 지나면 그대로, 거꾸로 지나면 역행렬. 아래첨자가 $b\\,s\\,|\\,s\\,c\\,|\\,c\\,o$로 맞물리는지 확인하면 순서를 틀리지 않습니다.');
    },
    // 09 — two skew joint axes, their common normal and the four D-H parameters
    rDHFrames() {
      const q = pr(150, 258, 74);
      const al = 40, ph = 38, a = 2.4, d = 1.5;
      const zi = [0, -Math.sin(rad(al)), Math.cos(rad(al))], xi = [Math.cos(rad(ph)), Math.sin(rad(ph)) * Math.cos(rad(al)), Math.sin(rad(ph)) * Math.sin(rad(al))];
      const Oi1 = [0, 0, 0], Fa = [a, 0, 0], Oi = add(Fa, sc(zi, d));
      let s = '';
      s += L(...q([0, 0, -0.9]), ...q([0, 0, 2.9]), 'gd') + T(...add(q([0, 0, 3.0]), [0, -4]), '축 i−1', { s: 11.5 });
      s += L(...q(add(Fa, sc(zi, -1.1))), ...q(add(Fa, sc(zi, 2.9))), 'gd') + T(...add(q(add(Fa, sc(zi, 3.0))), [4, -4]), '축 i', { a: 'start', s: 11.5 });
      s += L(...q(add(Fa, [0, 0, -0.4])), ...q(add(Fa, [0, 0, 1.6])), 'dm ds');
      s += L(...q(Oi1), ...q(Fa), 'rx') + T(...add(q([a / 2, 0, 0]), [0, 16]), 'a_{i−1}', { c: 'rl' });
      // frame {i-1}
      s += A(...q(Oi1), ...q([0, 0, 1.0]), 'vl', 8) + T(...add(q([0, 0, 1.05]), [-10, 2]), 'ẑ_{i−1}', { a: 'end', c: 'it' });
      s += A(...q(Oi1), ...q([1.0, 0, 0]), 'vl', 8) + T(...add(q([0.55, 0, 0]), [0, -8]), 'x̂_{i−1}', { c: 'it' });
      s += C(...q(Oi1), 3.5, 'jt') + T(...add(q(Oi1), [-8, 16]), '{i−1}', { a: 'end', c: 'em' });
      // twist alpha between the dashed parallel of z_{i-1} and z_i, around x
      const arcA = []; for (let k = 0; k <= 16; k++) { const t = (k / 16) * rad(al); arcA.push(q(add(Fa, [0, -0.55 * Math.sin(t), 0.55 * Math.cos(t)]))); }
      s += path(arcA, 'rx') + T(...add(q(add(Fa, [0, 0, 0.42])), [8, 2]), 'α_{i−1}', { a: 'start', c: 'rl' });
      // offset d along z_i and frame {i}
      s += L(...q(Fa), ...q(Oi), 'ld') + T(...add(q(add(Fa, sc(zi, d / 2))), [-10, 4]), 'd_i', { a: 'end', c: 'lb' });
      s += A(...q(Oi), ...q(add(Oi, sc(zi, 0.95))), 'vl', 8) + T(...add(q(add(Oi, sc(zi, 1.0))), [8, 0]), 'ẑ_i', { a: 'start', c: 'it' });
      s += A(...q(Oi), ...q(add(Oi, sc(xi, 1.0))), 'vl', 8) + T(...add(q(add(Oi, sc(xi, 1.1))), [6, 4]), 'x̂_i', { a: 'start', c: 'it' });
      s += L(...q(Oi), ...q(add(Oi, [1.0, 0, 0])), 'dm ds');
      const arcP = []; for (let k = 0; k <= 16; k++) { const t = (k / 16) * rad(ph); arcP.push(q(add(Oi, add(sc([1, 0, 0], 0.65 * Math.cos(t)), sc([0, Math.cos(rad(al)), Math.sin(rad(al))], 0.65 * Math.sin(t)))))); }
      s += path(arcP, 'rx') + T(...add(q(add(Oi, [0.8, 0.2, 0.1])), [10, 10]), 'φ_i', { a: 'start', c: 'rl' });
      s += C(...q(Oi), 3.5, 'jt') + T(...add(q(Oi), [-10, -6]), '{i}', { a: 'end', c: 'em' });
      return fig(580, 322, 'D-H 매개변수: 공통 수선의 길이 a, 그 둘레의 꼬임 α, 축 i를 따른 오프셋 d, 축 i 둘레의 관절 각 φ',
        s,
        '꼬인 두 관절 축 사이의 **공통 수선**(주황)이 {i−1}의 $\\hat x_{i-1}$입니다. $a_{i-1}$은 그 길이, $\\alpha_{i-1}$은 $\\hat x_{i-1}$ 둘레로 $\\hat z_{i-1}$(점선으로 옮겨 그림)에서 $\\hat z_i$까지의 각, $d_i$는 공통 수선의 끝에서 {i}의 원점까지 축 $i$를 따른 거리, $\\phi_i$는 $\\hat z_i$ 둘레로 $\\hat x_{i-1}$(점선)에서 $\\hat x_i$까지의 각입니다.');
    },
    // 10 — SO(3) as the solid ball of radius pi
    rSO3Ball() {
      const cx = 190, cy = 126, Rr = 100;
      const q = pr(cx, cy, 58);
      let s = C(cx, cy, Rr, 'sp') + `<ellipse class="dm ds" cx="${cx}" cy="${cy}" rx="${Rr}" ry="${Rr * 0.3}"/>`;
      s += A(...q([0, 0, 0]), ...q([0, 0, 1.25]), 'dm', 7) + T(...add(q([0, 0, 1.32]), [6, 0]), 'z', { a: 'start', c: 'it' });
      s += A(...q([0, 0, 0]), ...q([1.4, 0, 0]), 'dm', 7) + T(...add(q([1.45, 0, 0]), [4, 12]), 'x', { a: 'start', c: 'it' });
      s += A(...q([0, 0, 0]), ...q([0, 1.6, 0]), 'dm', 7) + T(...add(q([0, 1.7, 0]), [4, 0]), 'y', { a: 'start', c: 'it' });
      s += C(cx, cy, 3.5, 'jt') + T(cx - 8, cy + 18, 'I', { a: 'end', c: 'it' });
      const r = [0.6, -0.5, 0.95];
      s += A(...q([0, 0, 0]), ...q(r), 'ld', 9) + C(...q(r), 4, 'dotf') + T(...add(q(r), [8, -4]), 'r = ω̂θ', { a: 'start', c: 'lb' });
      // an antipodal pair on the surface
      const u = [Math.cos(rad(35)), 0, Math.sin(rad(35))];
      const P1 = [cx + Rr * u[0], cy - Rr * u[2]], P2 = [cx - Rr * u[0], cy + Rr * u[2]];
      s += L(...P1, ...P2, 'rx ds') + C(...P1, 4.5, 'doto') + C(...P2, 4.5, 'doto') + T(P1[0] + 8, P1[1] - 4, 'ω̂π', { a: 'start', c: 'rl' }) + T(P2[0] - 8, P2[1] + 14, '−ω̂π', { a: 'end', c: 'rl' });
      const tx = 330;
      s += T(tx, 64, '반지름 π인 공 = SO(3)', { a: 'start', c: 'em', s: 12.5 });
      s += T(tx, 92, '방향 = 회전축 ω̂', { a: 'start', s: 12 }) + T(tx, 114, '원점까지 거리 = 회전각 θ', { a: 'start', s: 12 });
      s += T(tx, 136, '원점 = 항등 회전 I', { a: 'start', s: 12 }) + T(tx, 158, '안쪽 (θ < π): 점 하나 = 회전 하나', { a: 'start', s: 12 });
      s += T(tx, 180, '겉면 (θ = π): 맞은편 두 점이 같은 회전', { a: 'start', s: 12, c: 'rl' });
      return fig(560, 250, '지수 좌표로 본 SO(3): 반지름 π인 공, 겉면의 맞은편 두 점은 같은 회전',
        s,
        '행렬 로그로 얻은 $r=\\hat\\omega\\theta$($0\\le\\theta\\le\\pi$)를 찍으면 모든 회전이 공 안에 들어옵니다. 안쪽에서는 일대일이고, 겉면에서만 $\\hat\\omega\\pi$와 $-\\hat\\omega\\pi$가 같은 회전입니다. 어떤 회전이 공의 한 영역에 들어가는지 물으면 이 점을 찍어 봅니다.');
    },
  });
})();
