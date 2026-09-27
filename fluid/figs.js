/* 유체역학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다. 그리는 도구는 core/figkit.js(FK)입니다. */
(function () {
  const { fig, L, A, T, R, C, P, ground, wall, pin, roller, dist, dim, dimv, mom, fn, area } = window.FK;
  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // f01 — Couette flow: fixed lower plate, upper plate moving at V, linear velocity profile
    fCouette() {
      const x0 = 150, y0 = 190, h = 130;
      let arrows = '';
      for (let i = 1; i <= 6; i++) { const y = y0 - (h * i) / 7, u = (200 * i) / 7; arrows += A(x0, y, x0 + u, y, 'ld', 7); }
      return fig(560, 240, '두 평판 사이의 쿠에트 유동: 아래 판은 정지, 위 판은 속도 V로 움직이고 속도 분포는 직선',
        ground(80, 480, y0) + R(90, y0 - h - 10, 380, 10, 'bm2') + A(470, y0 - h - 20, 520, y0 - h - 20, 'ld') + T(524, y0 - h - 16, 'V', { a: 'start', c: 'lb' }) +
        L(x0, y0, x0, y0 - h, 'gd') + L(x0, y0, x0 + 200, y0 - h, 'cv') + arrows +
        T(x0 + 210, y0 - h + 16, 'u = V y / h', { a: 'start', c: 'lb' }) + dimv(60, y0 - h, y0, 'h', { left: true }) +
        A(x0 - 40, y0 - 10, x0 - 40, y0 - 50, 'ax') + T(x0 - 44, y0 - 54, 'y', { a: 'end', c: 'it' }) +
        T(x0 + 120, y0 + 30, '고정 판 (미끄러짐 없음: u = 0)', { s: 11 }) + T(300, y0 - h - 26, '움직이는 판 (u = V)', { s: 11 }),
        '유체는 벽에 붙어 벽과 같은 속도로 움직입니다(미끄러짐 없음 조건). 속도 기울기 $du/dy=V/h$가 일정하므로 전단 응력 $\\tau=\\mu V/h$도 두께 방향으로 일정합니다.');
    },
    // f01 — capillary rise in a small tube
    fCapillary() {
      const cx = 280, wl = 190, R0 = 22, hh = 90;
      return fig(560, 250, '가는 유리관 속 물의 모세관 상승: 접촉각 θ, 상승 높이 h, 관 반지름 R',
        P(`M80,${wl}L480,${wl}L480,235L80,235Z`, 'fl2') + L(80, wl, 480, wl, 'gd') +
        L(cx - R0 - 4, 20, cx - R0 - 4, 225, 'th') + L(cx + R0 + 4, 20, cx + R0 + 4, 225, 'th') +
        P(`M${cx - R0},${wl - hh + 6}Q${cx},${wl - hh + 18} ${cx + R0},${wl - hh + 6}L${cx + R0},235L${cx - R0},235Z`, 'fl2') +
        P(`M${cx - R0},${wl - hh + 6}Q${cx},${wl - hh + 18} ${cx + R0},${wl - hh + 6}`, 'cv') +
        dimv(cx + 70, wl - hh + 12, wl, 'h') + L(cx + R0 + 4, wl - hh + 12, cx + 70, wl - hh + 12, 'dm ds') +
        dim(cx - R0, cx + R0, 14, '2R') +
        A(cx - R0 + 2, wl - hh + 6, cx - R0 + 2, wl - hh - 34, 'ld', 7) + T(cx - R0 - 8, wl - hh - 30, 'Y', { a: 'end', c: 'lb' }) +
        T(cx - 60, wl - hh + 30, 'θ', { a: 'end', c: 'it' }) + T(120, wl - 8, '수면', { s: 11 }),
        '둘레 $2\\pi R$를 따라 작용하는 표면장력의 연직 성분 $2\\pi RY\\cos\\theta$가 올라온 물기둥의 무게 $\\rho g\\pi R^2h$를 받칩니다.');
    },
    // f02 — U-tube mercury manometer attached to a water pipe A
    fManometer() {
      const px = 120, py = 70, xL = 220, xR = 320, yB = 210, y1 = 150, y2 = 100;
      return fig(560, 250, '물이 흐르는 관 A에 연결한 수은 U자관 마노미터: 관 중심에서 수은 경계면까지 0.4 m, 수은 높이 차 0.25 m, 오른쪽은 대기',
        `<circle class="bm" cx="${px}" cy="${py}" r="28"/>` + T(px, py + 5, 'A', {}) +
        P(`M${px + 20},${py - 8}L${xL - 8},${py - 8}L${xL - 8},${yB + 8}Q${(xL + xR) / 2},${yB + 30} ${xR + 8},${yB + 8}L${xR + 8},30`, 'gd') +
        P(`M${px + 20},${py + 8}L${xL + 8},${py + 8}L${xL + 8},${yB - 8}Q${(xL + xR) / 2},${yB + 10} ${xR - 8},${yB - 8}L${xR - 8},30`, 'gd') +
        P(`M${xL - 8},${py + 8}L${xL + 8},${py + 8}L${xL + 8},${y1}L${xL - 8},${y1}Z`, 'fl') +
        P(`M${xL - 8},${y1}L${xL + 8},${y1}L${xL + 8},${yB - 8}Q${(xL + xR) / 2},${yB + 10} ${xR - 8},${yB - 8}L${xR - 8},${y2}L${xR + 8},${y2}L${xR + 8},${yB + 8}Q${(xL + xR) / 2},${yB + 30} ${xL - 8},${yB + 8}Z`, 'fl2') +
        L(xL - 14, y1, xR + 60, y1, 'dm ds') + L(xR - 14, y2, xR + 60, y2, 'dm ds') + L(px, py, xL - 20, py, 'dm ds') +
        dimv(xL - 40, py, y1, '0.4 m', { left: true }) + dimv(xR + 50, y2, y1, '0.25 m') +
        T(xL + 30, (py + y1) / 2 + 30, '물', { a: 'start' }) + T((xL + xR) / 2, yB + 4, '수은', {}) + T(xR + 14, 26, '대기 (p = 0 계기압)', { a: 'start', s: 11 }),
        '같은 유체 안에서 같은 높이의 점은 압력이 같습니다. 왼쪽 경계면에서 출발해 수은을 따라 오른쪽 경계면 높이로 가면 압력이 같고, 거기서 대기까지 수은 기둥을 올라갑니다.');
    },
    // f03 — hydrostatic pressure on an inclined plane gate: linear distribution, resultant through the center of pressure
    fPlaneGate() {
      const sy = 40, th = (55 * Math.PI) / 180, s0 = 60, s1 = 190, ox = 150;
      const pt = (s) => [ox + s * Math.cos(th), sy + s * Math.sin(th)], nrm = [Math.sin(th), -Math.cos(th)];
      const [ax, ay] = pt(s0), [bx, by] = pt(s1), k = 0.45;
      const pa = s0 * Math.sin(th) * k, pb = s1 * Math.sin(th) * k;
      const tip = (s, p) => { const [x, y] = pt(s); return [x + p * nrm[0], y + p * nrm[1]]; };
      const [ta, tb] = [tip(s0, pa), tip(s1, pb)];
      let arrows = '';
      for (let i = 0; i <= 6; i++) { const s = s0 + ((s1 - s0) * i) / 6, p = s * Math.sin(th) * k, [x, y] = pt(s), [tx, ty] = tip(s, p); arrows += A(tx, ty, x, y, 'ld', 7); }
      const scg = (s0 + s1) / 2, scp = scg + 12, [gx, gy] = pt(scg), [cx, cy] = pt(scp);
      return fig(560, 260, '기울어진 평판 수문에 작용하는 정수압: 깊이에 비례하는 분포, 합력은 도심보다 아래의 압력 중심을 지난다',
        P(`M60,${sy}L${bx + 60},${sy}L${bx + 60},245L${ox},245L${ox},${sy}Z`, 'fl') + L(60, sy, 520, sy, 'gd') + T(520, sy - 6, '수면', { a: 'end', s: 11 }) +
        L(ox, sy, ox + 230 * Math.cos(th), sy + 230 * Math.sin(th), 'dm ds') + L(ax, ay, bx, by, 'th') +
        P(`M${ax},${ay}L${ta[0]},${ta[1]}L${tb[0]},${tb[1]}L${bx},${by}Z`, 'fl2') + arrows +
        C(gx, gy, 4, 'jt') + T(gx - 10, gy + 4, 'CG', { a: 'end' }) + C(cx, cy, 4, 'dotf') + T(cx - 10, cy + 12, 'CP', { a: 'end', c: 'rl' }) +
        A(cx + 70 * nrm[0], cy + 70 * nrm[1], cx, cy, 'rx', 10) + T(cx + 76 * nrm[0], cy + 76 * nrm[1], 'F = γ h_cg A', { a: 'start', c: 'rl' }) +
        P(`M${ox + 40},${sy}A40,40 0 0 1 ${ox + 40 * Math.cos(th)},${sy + 40 * Math.sin(th)}`, 'dm') + T(ox + 46, sy + 22, 'θ', { a: 'start', c: 'it' }) +
        L(gx, gy, 470, gy, 'dm ds') + dimv(470, sy, gy, 'h_cg'),
        '압력이 깊이에 따라 커지므로 합력의 작용점(압력 중심)은 도심보다 깊은 쪽에 있습니다. 그 거리는 $I_{xx}\\sin\\theta/(h_{cg}A)$로 깊어질수록 도심에 가까워집니다.');
    },
    // f03 — quarter-circle gate: horizontal force on the vertical projection, vertical force = weight of water above
    fCurved() {
      const Ox = 150, Oy = 50, Rr = 150, Cx = Ox + Rr, By = Oy + Rr;
      const xh = Ox + Rr * (1 - Math.sqrt(1 - 4 / 9)), xv = Cx - (4 * Rr) / (3 * Math.PI), yv = Oy + Math.sqrt(Rr * Rr - (Cx - xv) ** 2);
      return fig(560, 250, '사분원 곡면 수문(오른쪽이 저수지): 수평력은 연직 투영면의 힘, 연직력은 곡면 위 물의 무게',
        P(`M${Ox},${Oy}A${Rr},${Rr} 0 0 0 ${Cx},${By}L520,${By}L520,${Oy}Z`, 'fl') +
        P(`M${Ox},${Oy}A${Rr},${Rr} 0 0 0 ${Cx},${By}L${Cx},${Oy}Z`, 'fl2') +
        P(`M${Ox},${Oy}A${Rr},${Rr} 0 0 0 ${Cx},${By}`, 'th') + L(40, Oy, 520, Oy, 'gd') + ground(Cx, 520, By) +
        L(Cx, Oy, Cx, By, 'dm ds') + C(Cx, Oy, 3.5, 'jt') + T(Cx + 8, Oy + 16, 'O (원의 중심)', { a: 'start', s: 11 }) +
        A(xh + 90, Oy + (2 * Rr) / 3, xh + 4, Oy + (2 * Rr) / 3, 'ld') + T(xh + 96, Oy + (2 * Rr) / 3 + 4, 'F_H', { a: 'start', c: 'lb' }) +
        A(xv, Oy + 8, xv, yv - 4, 'ld') + T(xv + 6, Oy + 26, 'F_V', { a: 'start', c: 'lb' }) +
        T(440, Oy + 60, '물', { s: 12 }) + dimv(Ox - 24, Oy, By, 'R', { left: true }) + T(Ox - 6, Oy - 6, '수면', { a: 'end', s: 11 }),
        '연직 투영면($R\\times b$)의 정수압이 수평력(수면 아래 $2R/3$에 작용), 곡면과 수면 사이 물(진한 부분)의 무게가 연직력입니다. 원호에서는 모든 압력이 중심 $O$를 향하므로 합력도 $O$를 지납니다.');
    },
    // f04 — a heeled floating barge: G, the shifted centre of buoyancy B', metacentre M above G
    fMeta() {
      const cx = 280, cy = 130, w = 200, h = 80, ang = -12;
      return fig(560, 250, '기울어진 바지선: 무게중심 G, 옮겨 간 부력 중심 B′, 부력의 작용선이 중심선과 만나는 메타센터 M',
        P(`M60,${cy + 8}L500,${cy + 8}L500,240L60,240Z`, 'fl') + L(60, cy + 8, 500, cy + 8, 'gd') +
        `<g transform="rotate(${ang} ${cx} ${cy})">${R(cx - w / 2, cy - h / 2, w, h, 'bm2')}${L(cx, cy - 90, cx, cy + 60, 'dm ds')}${C(cx, cy - 12, 4, 'jt')}${T(cx - 8, cy - 8, 'G', { a: 'end' })}${C(cx, cy + 22, 3.5, 'sp')}${T(cx - 8, cy + 30, 'B', { a: 'end' })}${C(cx, cy - 70, 4, 'dotf')}${T(cx + 8, cy - 74, 'M', { a: 'start', c: 'rl' })}</g>` +
        C(cx - 14.6, cy + 26, 4, 'dotf') + T(cx - 22, cy + 40, 'B′', { a: 'end', c: 'lb' }) +
        A(cx - 14.6, cy + 26, cx - 14.6, cy - 56, 'ld') + T(cx - 22, cy - 30, 'F_B', { a: 'end', c: 'lb' }) +
        A(cx - 2.5, cy - 11.7, cx - 2.5, cy + 62, 'rx') + T(cx + 4, cy + 74, 'W', { a: 'start', c: 'rl' }) +
        T(cx + 150, cy - 50, 'GM > 0 → 되돌리는 우력 (안정)', { a: 'start', s: 11 }),
        '배가 기울면 잠긴 부분의 모양이 바뀌어 부력 중심이 $B\'$로 옮겨 갑니다. 부력의 작용선이 중심선과 만나는 점 $M$이 무게중심 $G$보다 위에 있으면 무게와 부력이 되돌리는 우력을 만듭니다.');
    },
    // f04 — rigid rotation: paraboloid free surface in a rotating cylinder
    fParaboloid() {
      const cx = 280, R0 = 120, top = 60, bot = 230, z0 = 170, hh = 80;
      let d = `M${cx - R0},${z0 - hh / 2}`;
      for (let i = -40; i <= 40; i++) { const r = (i / 40) * R0; d += `L${(cx + r).toFixed(1)},${(z0 - hh / 2 - hh * (r * r) / (R0 * R0) + hh).toFixed(1)}`; }
      const surf = (r) => z0 + hh / 2 - (hh * r * r) / (R0 * R0);
      let fill = `M${cx - R0},${bot}L${cx - R0},${surf(-R0)}`;
      for (let i = -40; i <= 40; i++) { const r = (i / 40) * R0; fill += `L${(cx + r).toFixed(1)},${surf(r).toFixed(1)}`; }
      fill += `L${cx + R0},${bot}Z`;
      let line = '';
      for (let i = -40; i <= 40; i++) { const r = (i / 40) * R0; line += `${i === -40 ? 'M' : 'L'}${(cx + r).toFixed(1)},${surf(r).toFixed(1)}`; }
      return fig(560, 260, '각속도 Ω로 도는 원통 속 물의 자유 표면: 포물면, 가운데는 내려가고 가장자리는 올라간다',
        P(fill, 'fl') + P(line, 'cv') + L(cx - R0, top, cx - R0, bot, 'th') + L(cx + R0, top, cx + R0, bot, 'th') + L(cx - R0, bot, cx + R0, bot, 'th') +
        L(cx, top - 20, cx, bot + 10, 'dm ds') + mom(cx, top - 10, 18, 200, -20, 'ld') + T(cx + 26, top - 12, 'Ω', { a: 'start', c: 'lb' }) +
        L(cx - R0 - 10, z0, cx + R0 + 60, z0, 'dm ds') + T(cx + R0 + 64, z0 + 4, '정지 수면', { a: 'start', s: 11 }) +
        dimv(cx + R0 + 30, surf(R0), surf(0), 'Ω²R²/2g'),
        '자유 표면은 $z=z_0+\\Omega^2r^2/(2g)$의 포물면입니다. 물의 부피가 변하지 않으므로 가운데는 정지 수면보다 $\\Omega^2R^2/(4g)$ 내려가고 가장자리는 같은 만큼 올라갑니다.');
    },
    // f05 — fixed control volume around a converging duct: inlet 1, outlet 2, outward normals
    fCV() {
      const x1 = 130, x2 = 420, t1 = 60, b1 = 190, t2 = 100, b2 = 150;
      const top = `M${x1 - 50},${t1}L${x1},${t1}C${x1 + 120},${t1} ${x2 - 120},${t2} ${x2},${t2}L${x2 + 50},${t2}`;
      const bot = `M${x1 - 50},${b1}L${x1},${b1}C${x1 + 120},${b1} ${x2 - 120},${b2} ${x2},${b2}L${x2 + 50},${b2}`;
      let ins = '', outs = '';
      for (let i = 1; i <= 4; i++) { const y = t1 + ((b1 - t1) * i) / 5; ins += A(x1 - 46, y, x1 - 8, y, 'ld', 7); }
      for (let i = 1; i <= 3; i++) { const y = t2 + ((b2 - t2) * i) / 4; outs += A(x2 + 6, y, x2 + 70, y, 'ld', 7); }
      return fig(560, 250, '수축하는 관을 둘러싼 고정 검사 체적: 입구 1로 유체가 들어오고 출구 2로 나가며, 검사면의 바깥 법선 n은 입구에서 상류, 출구에서 하류를 향한다',
        P(top + `L${x2 + 50},${b2}L${x2},${b2}C${x2 - 120},${b2} ${x1 + 120},${b1} ${x1},${b1}L${x1 - 50},${b1}Z`, 'fl') + P(top, 'th') + P(bot, 'th') +
        P(`M${x1},${t1 + 4}C${x1 + 120},${t1 + 4} ${x2 - 120},${t2 + 4} ${x2},${t2 + 4}L${x2},${b2 - 4}C${x2 - 120},${b2 - 4} ${x1 + 120},${b1 - 4} ${x1},${b1 - 4}Z`, 'gd ds') +
        ins + outs + A(x1, 34, x1 - 36, 34, 'vl', 8) + T(x1 - 40, 38, 'n', { a: 'end', c: 'it' }) + A(x2, 76, x2 + 36, 76, 'vl', 8) + T(x2 + 40, 80, 'n', { a: 'start', c: 'it' }) +
        L(x1, 30, x1, t1, 'dm') + L(x2, 70, x2, t2, 'dm') +
        T(x1, 222, '1: A_1, V_1, ρ_1', { s: 12 }) + T(x2 + 10, 182, '2: A_2, V_2, ρ_2', { s: 12 }) +
        T((x1 + x2) / 2, 132, '검사 체적 CV', { s: 12 }) + T((x1 + x2) / 2 + 10, 204, '검사면 CS (점선)', { s: 11, c: 'lb' }),
        '입구에서는 속도가 법선과 반대 방향이라 $\\mathbf V\\cdot\\mathbf n<0$(유입), 출구에서는 같은 방향이라 $\\mathbf V\\cdot\\mathbf n>0$(유출)입니다. 벽에서는 $\\mathbf V\\cdot\\mathbf n=0$이라 유량이 없습니다.');
    },
    // f06 — a free jet turned through angle θ by a fixed curved vane; the vane's support supplies Fx and Fy
    fVane() {
      const cx = 300, R0 = 80, cy = 170 - R0, th = (60 * Math.PI) / 180;
      const pt = (r, p) => [cx + r * Math.sin(p), cy + r * Math.cos(p)];
      let arc = (r) => { let s = ''; for (let i = 0; i <= 24; i++) { const [x, y] = pt(r, (th * i) / 24); s += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } return s; };
      const [ex, ey] = pt(R0 - 5, th), dir = [Math.cos(th), -Math.sin(th)];
      const [vx, vy] = pt(R0 + 4, th / 2);
      return fig(560, 260, '고정된 곡면 날개가 속도 V인 물줄기의 방향을 각 θ만큼 바꾼다. 날개를 붙잡는 받침이 힘 F_x, F_y를 가한다',
        R(60, 158, 50, 24, 'bm2') + P(`M110,160L${cx},160` + arc(R0 - 10).replace('M', 'L') + `L${ex + 90 * dir[0] - 5 * Math.sin(th)},${ey + 90 * dir[1] - 5 * Math.cos(th)}L${ex + 90 * dir[0] + 5 * Math.sin(th)},${ey + 90 * dir[1] + 5 * Math.cos(th)}` +
          (() => { let s = ''; for (let i = 24; i >= 0; i--) { const [x, y] = pt(R0, (th * i) / 24); s += 'L' + x.toFixed(1) + ',' + y.toFixed(1); } return s; })() + `L110,170Z`, 'fl2') +
        P(arc(R0 + 4), 'th') + L(vx, vy + 6, vx, 235, 'gd') + ground(vx - 40, vx + 40, 235) +
        A(150, 140, 210, 140, 'ld') + T(180, 132, 'V', { c: 'lb' }) + A(ex + 30 * dir[0] - 22, ey + 30 * dir[1] - 14, ex + 80 * dir[0] - 22, ey + 80 * dir[1] - 14, 'ld') + T(ex + 60 * dir[0] - 40, ey + 60 * dir[1] - 18, 'V', { c: 'lb' }) +
        A(vx + 60, 205, vx + 10, 205, 'rx') + T(vx + 64, 209, 'F_x', { a: 'start', c: 'rl' }) + A(vx - 30, 222, vx - 30, 185, 'rx') + T(vx - 36, 214, 'F_y', { a: 'end', c: 'rl' }) +
        L(ex, ey, ex + 70, ey, 'dm ds') + T(ex + 44, ey - 10, 'θ', { c: 'it' }) + T(84, 196, '노즐', { s: 11 }),
        '물줄기는 대기 중에 있어 압력이 0(계기압)이고, 마찰을 무시하면 속력 $V$가 변하지 않습니다. 날개에 가해지는 힘은 받침이 날개에 주는 힘 $F_x,F_y$와 크기가 같고 방향이 반대입니다.');
    },
    // f07 — reservoir, pipe and free jet with the energy grade line (EGL) and hydraulic grade line (HGL)
    fEGL() {
      const zs = 50, y0 = 210, xp0 = 150, xp1 = 480, hv = 34, hf = 70;
      return fig(560, 260, '저수조에서 관을 지나 대기로 나가는 물: 에너지선(EGL)은 마찰로 하류로 갈수록 내려가고, 수력 기울기선(HGL)은 그보다 속도 수두만큼 아래에 있다',
        P(`M40,${zs}L${xp0},${zs}L${xp0},${y0 - 8}L${xp1},${y0 - 8}L${xp1},${y0 + 8}L${xp0},${y0 + 8}L${xp0},245L40,245Z`, 'fl') +
        L(40, zs, xp0, zs, 'gd') + L(40, 20, 40, 245, 'th') + L(40, 245, xp0, 245, 'th') + L(xp0, 20, xp0, y0 - 8, 'th') + L(xp0, y0 + 8, xp0, 245, 'th') +
        L(xp0, y0 - 8, xp1, y0 - 8, 'gd') + L(xp0, y0 + 8, xp1, y0 + 8, 'gd') + A(xp1 + 4, y0, xp1 + 50, y0 + 6, 'ld') +
        L(xp0, zs + 6, xp1, y0 - hv, 'cv') + L(xp0, zs + 6 + hv, xp1, y0, 'cv2') +
        L(xp0, zs, 540, zs, 'dm ds') + dimv(520, zs, y0 - hv, 'h_f', { c: 'it' }) + dimv(xp1 + 22, y0 - hv, y0, 'V²/2g', { c: 'it' }) +
        T(xp0 + 90, zs + 26, 'EGL', { c: 'lb' }) + T(xp0 + 90, zs + hv + 62, 'HGL', { c: 'rl' }) + T(96, 150, '저수조', { s: 11 }) + T(300, y0 + 26, '관 (길이 L, 지름 d)', { s: 11 }),
        'EGL은 $p/\\gamma+V^2/2g+z$, HGL은 $p/\\gamma+z$입니다. 저수조 수면에서 EGL은 수면 높이이고, 관을 따라 마찰 손실 $h_f$만큼 내려갑니다. 대기로 나가는 끝에서 계기압이 0이므로 HGL은 관 중심선과 만납니다.');
    },
    // f07 — top view of a two-arm lawn sprinkler: jets leave tangentially at radius R while the arms turn at ω
    fSprinkler() {
      const cx = 280, cy = 130, Rr = 110;
      return fig(560, 260, '위에서 본 두 팔 스프링클러: 물이 중심으로 들어와 반지름 R의 두 끝에서 팔에 대해 속도 V로 뿜어 나가고, 팔은 ω로 돈다',
        L(cx - Rr, cy, cx + Rr, cy, 'th') + L(cx + Rr, cy, cx + Rr, cy - 16, 'th') + L(cx - Rr, cy, cx - Rr, cy + 16, 'th') + C(cx, cy, 9, 'jt') +
        A(cx + Rr, cy - 18, cx + Rr, cy - 70, 'ld') + T(cx + Rr + 8, cy - 58, 'V (팔에 대해)', { a: 'start', c: 'lb', s: 11 }) +
        A(cx - Rr, cy + 18, cx - Rr, cy + 70, 'ld') + T(cx - Rr - 8, cy + 62, 'V', { a: 'end', c: 'lb' }) +
        mom(cx, cy, 44, 120, -20, 'rx') + T(cx + 12, cy - 52, 'ω', { c: 'rl' }) +
        dim(cx, cx + Rr, cy + 30, 'R', { below: true }) + T(cx - 60, cy - 10, 'Q 유입', { s: 11 }),
        '분출 방향이 팔과 수직이면 땅에 대한 분출 속도의 접선 성분은 $V-R\\omega$입니다. 각운동량 방정식에서 축의 토크 $T=\\rho Q R(V-R\\omega)$이고, 마찰이 없으면 $T=0$이 되어 $\\omega=V/R$로 돕니다.');
    },
    // f07 — Venturi tube with two piezometers: the throat piezometer stands lower by Δh
    fVenturi() {
      const yc = 170, r1 = 44, r2 = 20, xa = 60, xb = 180, xc = 260, xd = 300, xe = 480;
      const rad = (x) => (x <= xb ? r1 : x <= xc ? r1 + ((r2 - r1) * (x - xb)) / (xc - xb) : x <= xd ? r2 : Math.min(r1, r2 + ((r1 - r2) * (x - xd)) / (xe - 20 - xd)));
      let top = '', bot = '';
      for (let x = xa; x <= xe; x += 5) { top += (top ? 'L' : 'M') + x + ',' + (yc - rad(x)).toFixed(1); bot += (bot ? 'L' : 'M') + x + ',' + (yc + rad(x)).toFixed(1); }
      const p1 = 120, p2 = (xc + xd) / 2, h1 = 50, h2 = 110;
      return fig(560, 250, '벤투리관: 넓은 단면 1과 좁은 목 2에 꽂은 두 피에조미터의 수면 차 Δh가 압력 차를 보여 준다',
        P(top + bot.replace('M', 'L').split('L').filter(Boolean).reverse().map((s) => 'L' + s).join('') + 'Z', 'fl') + P(top, 'th') + P(bot, 'th') +
        L(p1 - 6, h1, p1 - 6, yc - r1, 'gd') + L(p1 + 6, h1, p1 + 6, yc - r1, 'gd') + R(p1 - 6, h1, 12, yc - r1 - h1, 'fl2') +
        L(p2 - 6, h1 - 10, p2 - 6, yc - r2, 'gd') + L(p2 + 6, h1 - 10, p2 + 6, yc - r2, 'gd') + R(p2 - 6, h2, 12, yc - r2 - h2, 'fl2') +
        L(p1 + 6, h1, p2 + 80, h1, 'dm ds') + L(p2 + 6, h2, p2 + 80, h2, 'dm ds') + dimv(p2 + 70, h1, h2, 'Δh') +
        A(xa + 6, yc, xa + 56, yc, 'ld') + A(p2 - 20, yc, p2 + 24, yc, 'ld') +
        T(p1, yc + r1 + 18, '1', { c: 'it' }) + T(p2, yc + r2 + 18, '2 (목)', { s: 12 }) + T(xa + 30, yc - 10, 'V_1', { c: 'lb' }) + T(p2 + 2, yc - 8, 'V_2', { c: 'lb' }),
        '목에서 속도가 빨라지는 만큼 압력이 떨어집니다. 연속 방정식 $V_1=\\beta^2V_2$와 베르누이 식을 함께 쓰면 $\\Delta p=\\tfrac12\\rho V_2^2(1-\\beta^4)$입니다. 목 뒤의 넓어지는 부분은 천천히 넓혀 손실을 줄입니다.');
    },
    // f08 — mass fluxes through an elemental box (x faces shown; y faces alike)
    fBox() {
      const x0 = 200, y0 = 50, s = 130, ya = y0 + 0.36 * s, xv = x0 + 0.72 * s;
      return fig(560, 250, '크기 dx × dy인 작은 검사 체적: 왼쪽 면으로 ρu dy가 들어오고 오른쪽 면으로 [ρu + ∂(ρu)/∂x dx] dy가 나간다',
        R(x0, y0, s, s, 'bm2') + A(x0 - 110, ya, x0 - 4, ya, 'ld') + A(x0 + s + 4, ya, x0 + s + 110, ya, 'ld') +
        A(xv, y0 + s + 52, xv, y0 + s + 4, 'rx') + A(xv, y0 - 4, xv, y0 - 44, 'rx') +
        T(x0 - 58, ya - 10, 'ρu', { c: 'lb' }) + T(x0 + s + 60, ya - 10, 'ρu + ∂(ρu)/∂x dx', { c: 'lb', s: 12 }) +
        T(xv + 10, y0 + s + 44, 'ρv', { a: 'start', c: 'rl' }) + T(xv + 10, y0 - 28, 'ρv + ∂(ρv)/∂y dy', { a: 'start', c: 'rl', s: 12 }) +
        dim(x0, x0 + s, y0 + s + 14, 'dx', { below: true, c: 'it' }) + dimv(x0 - 14, y0, y0 + s, 'dy', { left: true, c: 'it' }) + T(x0 + s / 2, y0 + s / 2 + 4, 'ρ, 안의 질량 ρ dx dy', { s: 11 }),
        '나가는 질량 유량에서 들어오는 질량 유량을 빼면 $\\big[\\partial(\\rho u)/\\partial x+\\partial(\\rho v)/\\partial y\\big]dx\\,dy$입니다. 이것이 상자 안 질량의 감소율 $-\\partial\\rho/\\partial t\\,dx\\,dy$와 같다는 것이 연속 방정식입니다.');
    },
    // f09 — two streamlines ψ1, ψ2: the volume flow between them (per unit depth) is ψ2 − ψ1
    fStreamFn() {
      const f1 = (x) => 170 - 30 * Math.sin((x - 60) / 110), f2 = (x) => 100 - 45 * Math.sin((x - 60) / 110);
      return fig(560, 240, '두 유선 ψ = ψ_1과 ψ = ψ_2 사이를 지나는 단위 깊이당 체적 유량은 ψ_2 − ψ_1이다',
        P(fn(0, 0, 1, -1, f1, 60, 500), 'cv') + P(fn(0, 0, 1, -1, f2, 60, 500), 'cv') +
        L(300, f1(300), 300, f2(300), 'dm ds') + A(250, (f1(250) + f2(250)) / 2, 300, (f1(300) + f2(300)) / 2, 'ld') + A(420, (f1(420) + f2(420)) / 2, 470, (f1(470) + f2(470)) / 2, 'ld') +
        T(505, f1(500) + 4, 'ψ_1', { a: 'start', c: 'it' }) + T(505, f2(500) + 4, 'ψ_2', { a: 'start', c: 'it' }) +
        T(306, (f1(300) + f2(300)) / 2 + 30, 'Q = ψ_2 − ψ_1', { a: 'start', c: 'lb', s: 12 }) + T(80, 222, '유선 위에서 ψ는 일정: 유선을 가로지르는 흐름이 없다', { a: 'start', s: 11 }),
        '두 유선 사이를 잇는 아무 곡선을 따라 $d\\psi=u\\,dy-v\\,dx$를 적분하면 그 곡선을 지나는 유량이 됩니다. 어떤 곡선을 골라도 같으므로 유선 사이의 유량은 $\\psi_2-\\psi_1$로 정해집니다. 유선이 좁아지는 곳에서는 속도가 빠릅니다.');
    },
    // f09 — flow between plates: Couette (moving top), Poiseuille (pressure gradient), and their sum
    fPlates() {
      const yb = 200, yt = 60, H = yt - yb;
      const prof = (ox, f, c) => { let d = ''; for (let i = 0; i <= 30; i++) { const e = i / 30; d += (i ? 'L' : 'M') + (ox + f(e)).toFixed(1) + ',' + (yb + H * e).toFixed(1); } return P(d, c); };
      const frame = (ox) => L(ox - 10, yb, ox + 130, yb, 'th') + L(ox - 10, yt, ox + 130, yt, 'th') + L(ox, yb, ox, yt, 'dm');
      return fig(560, 250, '두 평판 사이의 정확해: 위 판이 움직이는 쿠에트 유동(직선), 압력 기울기로 흐르는 푸아죄유 유동(포물선), 둘의 합',
        frame(40) + prof(40, (e) => 110 * e, 'cv') + A(120, yt - 12, 165, yt - 12, 'ld') + T(172, yt - 8, 'U', { a: 'start', c: 'lb' }) + T(100, 232, '쿠에트', { s: 12 }) +
        frame(220) + prof(220, (e) => 440 * e * (1 - e), 'cv') + T(280, 232, '푸아죄유 (dp/dx < 0)', { s: 12 }) +
        frame(400) + prof(400, (e) => 55 * e + 300 * e * (1 - e), 'cv') + A(480, yt - 12, 525, yt - 12, 'ld') + T(460, 232, '합', { s: 12 }) +
        T(210, 136, '+', { s: 20 }) + T(390, 136, '=', { s: 20 }),
        '나비에-스토크스 식이 이 흐름에서는 $\\mu\\,d^2u/dy^2=dp/dx$ 하나로 줄고, 선형이라 두 해를 더해도 해입니다. 압력 기울기가 반대($dp/dx>0$)면 포물선이 뒤집혀 아래 판 근처에서 역류가 생길 수 있습니다.');
    },
    // f11 — force balance on a coaxial fluid cylinder of radius r in a horizontal pipe
    fPipeElem() {
      const x1 = 150, x2 = 400, yc = 125, Rp = 80, rr = 42;
      return fig(560, 250, '수평관 속 반지름 r, 길이 dx인 동축 물 기둥: 왼쪽 면에 p, 오른쪽 면에 p + dp, 옆면에 전단 τ',
        L(60, yc - Rp, 500, yc - Rp, 'th') + L(60, yc + Rp, 500, yc + Rp, 'th') + L(60, yc, 500, yc, 'dm ds') +
        R(x1, yc - rr, x2 - x1, 2 * rr, 'bm2') +
        A(x1 - 50, yc - 12, x1 - 4, yc - 12, 'ld') + T(x1 - 54, yc - 8, 'p', { a: 'end', c: 'it' }) +
        A(x2 + 50, yc - 12, x2 + 4, yc - 12, 'ld') + T(x2 + 54, yc - 8, 'p + dp', { a: 'start', c: 'it' }) +
        A(330, yc - rr - 8, 230, yc - rr - 8, 'rx') + T(280, yc - rr - 16, 'τ', { c: 'rl' }) + A(330, yc + rr + 8, 230, yc + rr + 8, 'rx') +
        dimv(x1 + 30, yc, yc - rr, 'r', { c: 'it' }) + dimv(528, yc, yc - Rp, 'R', { c: 'it', left: true }) + dim(x1, x2, yc + Rp + 22, 'dx', { c: 'it', below: false }) +
        A(80, yc + Rp - 20, 120, yc + Rp - 20, 'vl', 7) + T(124, yc + Rp - 16, '흐름', { a: 'start', s: 11 }),
        '압력 차가 기둥을 밀고 옆면의 전단이 붙잡습니다: $-\\dfrac{dp}{dx}\\pi r^2=\\tau\\,2\\pi r$. 그래서 전단 응력은 중심에서 0이고 반지름에 비례해 벽에서 가장 큽니다. 이 결과는 층류와 난류 모두에서 성립합니다.');
    },
    // f12 — sudden expansion: jet from the small pipe, eddies in the corners, control volume for the Borda–Carnot loss
    fExpansion() {
      const yc = 125, r1 = 36, r2 = 80, xs = 220;
      return fig(560, 250, '급확대관: 작은 관(단면 1)에서 나온 분류가 큰 관으로 퍼지고, 모서리에는 소용돌이가 생긴다. 점선은 손실을 구할 검사 체적',
        L(40, yc - r1, xs, yc - r1, 'th') + L(40, yc + r1, xs, yc + r1, 'th') + L(xs, yc - r1, xs, yc - r2, 'th') + L(xs, yc + r1, xs, yc + r2, 'th') +
        L(xs, yc - r2, 520, yc - r2, 'th') + L(xs, yc + r2, 520, yc + r2, 'th') +
        P(`M${xs},${yc - r1}C${xs + 60},${yc - r1} ${xs + 120},${yc - r2 + 6} ${xs + 190},${yc - r2}`, 'dm ds') + P(`M${xs},${yc + r1}C${xs + 60},${yc + r1} ${xs + 120},${yc + r2 - 6} ${xs + 190},${yc + r2}`, 'dm ds') +
        mom(xs + 34, yc - r2 + 20, 13, 40, 320, 'rx') + mom(xs + 34, yc + r2 - 20, 13, -40, -320, 'rx') +
        A(70, yc, 130, yc, 'ld') + A(440, yc, 480, yc, 'ld') + T(100, yc - 8, 'V_1', { c: 'lb' }) + T(460, yc - 8, 'V_2', { c: 'lb' }) +
        P(`M${xs + 2},${yc - r2 + 3}L${xs + 250},${yc - r2 + 3}L${xs + 250},${yc + r2 - 3}L${xs + 2},${yc + r2 - 3}Z`, 'gd ds') +
        T(xs - 6, yc - r2 + 16, 'p_1', { a: 'end', c: 'it' }) + T(xs + 254, yc - r2 + 16, 'p_2', { a: 'start', c: 'it' }) +
        T(120, yc + r1 + 22, 'A_1', { c: 'it' }) + T(400, yc + r2 + 20, 'A_2', { c: 'it' }),
        '확대부의 벽(점선 상자의 왼쪽 면)에 작용하는 압력은 실험적으로 분류의 압력 $p_1$과 거의 같습니다. 이것을 운동량 방정식에 넣고 에너지 방정식과 비교하면 손실 $h_m=(V_1-V_2)^2/2g$를 얻습니다.');
    },
    // f13 — boundary layer on a flat plate: δ(x) grows like √x while laminar, jumps and grows faster after transition
    fBLplate() {
      const x0 = 70, y0 = 200, xt = 300, xe = 520;
      const d = (x) => (x < x0 ? 0 : x < xt ? 3.2 * Math.sqrt(x - x0) : 3.2 * Math.sqrt(xt - x0) + 0.62 * Math.pow(x - xt, 0.86) + 8 * (1 - Math.exp(-(x - xt) / 12)));
      let edge = '';
      for (let x = x0; x <= xe; x += 4) edge += (edge ? 'L' : 'M') + x + ',' + (y0 - d(x)).toFixed(1);
      const prof = (x, turb) => {
        const h = d(x); let s = '';
        for (let i = 0; i <= 20; i++) { const e = i / 20, u = turb ? Math.pow(e, 1 / 7) : 2 * e - e * e; s += (i ? 'L' : 'M') + (x + 44 * u).toFixed(1) + ',' + (y0 - h * e).toFixed(1); }
        return P(s + `L${x + 44},${y0 - h - 12}`, 'cv') + L(x, y0, x, y0 - h - 12, 'dm');
      };
      let inflow = '';
      for (let i = 0; i < 5; i++) inflow += A(20, y0 - 20 - 30 * i, 58, y0 - 20 - 30 * i, 'ld', 7);
      return fig(560, 250, '평판 위 경계층: 층류 구간에서는 두께가 √x에 비례해 자라고, 천이 뒤 난류 경계층은 더 두껍고 빠르게 자란다',
        L(x0, y0, 540, y0, 'th') + ground(x0, 540, y0 + 1) + P(edge, 'gd ds') + inflow + T(24, 34, 'U', { a: 'start', c: 'lb' }) +
        prof(160, false) + prof(250, false) + prof(420, true) +
        A(xt, 60, xt, y0 - d(xt) - 6, 'dm', 6) + T(xt, 54, '천이 Re_x ≈ 5×10⁵', { s: 11 }) +
        T(180, y0 + 30, '층류: δ ∝ √x', { s: 11 }) + T(440, y0 + 30, '난류: δ ∝ x^(6/7)', { s: 11 }) + T(505, y0 - d(505) - 8, 'δ(x)', { a: 'end', c: 'it' }),
        '경계층 밖의 흐름은 벽의 존재를 거의 느끼지 않습니다. 층류 속도 분포는 둥글고, 난류는 섞임 때문에 벽 근처까지 빠르다가 벽에서 급히 0이 되어 벽 전단이 큽니다.');
    },
    // f13 — separation on a surface in an adverse pressure gradient: profiles lose their slope at the wall, then reverse
    fSeparation() {
      const wall = (x) => 200 - 60 * Math.exp(-Math.pow((x - 200) / 90, 2));
      let w = '';
      for (let x = 30; x <= 540; x += 5) w += (w ? 'L' : 'M') + x + ',' + wall(x).toFixed(1);
      const prof = (x, k) => {
        const y0 = wall(x), h = 44; let s = '';
        for (let i = 0; i <= 24; i++) { const e = i / 24, u = (2 * e - e * e) + k * e * Math.pow(1 - e, 2) * 2.2; s += (i ? 'L' : 'M') + (x + 40 * u).toFixed(1) + ',' + (y0 - h * e).toFixed(1); }
        return P(s, 'cv') + L(x, y0, x, y0 - h - 4, 'dm');
      };
      return fig(560, 250, '역압력 기울기에서의 박리: 하류로 갈수록 벽 근처 속도 분포의 기울기가 줄고, 기울기가 0인 박리점 S 뒤에서 역류가 생긴다',
        P(w, 'th') + prof(150, 0.6) + prof(250, 0) + prof(318, -0.91) + prof(390, -1.9) +
        C(318, wall(318), 3.5, 'jt') + T(318, wall(318) + 20, 'S', { c: 'it' }) +
        P(`M318,${wall(318) - 2}C360,${wall(318) - 40} 430,${wall(430) - 60} 520,${wall(520) - 70}`, 'dm ds') +
        mom(430, wall(430) - 22, 14, 20, 300, 'rx') + T(110, 40, 'dp/dx < 0 (가속)', { s: 11 }) + T(360, 40, 'dp/dx > 0 (감속)', { s: 11 }) + T(470, wall(470) - 6, '역류', { s: 11 }),
        '벽에서 경계층 방정식은 $\\mu\\,\\partial^2u/\\partial y^2\\big\\rvert_w=dp/dx$입니다. 압력이 하류로 오르면($dp/dx>0$) 벽 근처 유체가 먼저 멈추고, 벽 전단이 0이 되는 점에서 흐름이 벽을 떠납니다.');
    },
    // f14 — blunt vs streamlined body of the same thickness: wide separated wake against a thin one
    fWake() {
      const yc = 120, r = 34;
      const wake = (x0, w0, w1, len) => P(`M${x0},${yc - w0}C${x0 + len * 0.4},${yc - w1} ${x0 + len * 0.8},${yc - w1} ${x0 + len},${yc - w1}L${x0 + len},${yc + w1}C${x0 + len * 0.8},${yc + w1} ${x0 + len * 0.4},${yc + w1} ${x0},${yc + w0}Z`, 'fl2');
      const foil = (x0, c, t) => { let u = '', l = ''; for (let i = 0; i <= 30; i++) { const s = i / 30, y = 5 * t * (0.2969 * Math.sqrt(s) - 0.126 * s - 0.3516 * s * s + 0.2843 * s ** 3 - 0.1036 * s ** 4) * c; u += (i ? 'L' : 'M') + (x0 + s * c).toFixed(1) + ',' + (yc - y).toFixed(1); l = 'L' + (x0 + s * c).toFixed(1) + ',' + (yc + y).toFixed(1) + l; } return P(u + l + 'Z', 'bm'); };
      return fig(560, 240, '같은 두께의 원기둥과 유선형 물체: 원기둥 뒤에는 박리로 넓은 후류가 생기고, 유선형 물체 뒤의 후류는 얇다',
        wake(90 + r - 4, r * 0.95, r * 1.25, 150) + C(90, yc, r, 'bm') + mom(160, yc - 22, 10, 30, 300, 'rx') + mom(160, yc + 22, 10, -30, -300, 'rx') +
        wake(460, 3, 6, 80) + foil(310, 150, 0.45) +
        A(20, yc - 60, 60, yc - 60, 'ld') + T(24, yc - 68, 'U', { a: 'start', c: 'lb' }) +
        T(150, 208, '원기둥: 압력 항력이 대부분 (C_D ≈ 1.2)', { s: 11 }) + T(400, 208, '유선형: 마찰 항력이 대부분 (C_D ≈ 0.1)', { s: 11 }),
        '항력은 표면 압력의 합(압력 항력)과 벽 전단의 합(마찰 항력)입니다. 뭉툭한 물체는 박리로 뒤쪽 압력이 회복되지 않아 압력 항력이 크고, 유선형 물체는 뒤쪽이 천천히 좁아져 박리를 막습니다.');
    },
    // f14 — airfoil at angle of attack α: lift perpendicular to the stream, drag parallel
    fAirfoil() {
      const x0 = 170, yc = 140, c = 240, al = (8 * Math.PI) / 180;
      let u = '', l = '';
      for (let i = 0; i <= 40; i++) {
        const s = i / 40, t = 5 * 0.12 * (0.2969 * Math.sqrt(s) - 0.126 * s - 0.3516 * s * s + 0.2843 * s ** 3 - 0.1036 * s ** 4), cam = 0.04 * (s < 0.4 ? (2 * 0.4 * s - s * s) / 0.16 : (1 - 0.8 + 2 * 0.4 * s - s * s) / 0.36);
        const rot = (px, py) => [x0 + (px * Math.cos(al) + py * Math.sin(al)) * c, yc + (px * Math.sin(al) - py * Math.cos(al)) * c];
        const [ux, uy] = rot(s, cam + t), [lx, ly] = rot(s, cam - t);
        u += (i ? 'L' : 'M') + ux.toFixed(1) + ',' + uy.toFixed(1); l = 'L' + lx.toFixed(1) + ',' + ly.toFixed(1) + l;
      }
      const ac = [x0 + 0.25 * c * Math.cos(al), yc + 0.25 * c * Math.sin(al)];
      return fig(560, 250, '받음각 α의 날개 단면: 양력 L은 자유 흐름에 수직, 항력 D는 나란하다',
        P(u + l + 'Z', 'bm2') + L(x0 - 40 * Math.cos(al), yc - 40 * Math.sin(al), x0 + 1.15 * c * Math.cos(al), yc + 1.15 * c * Math.sin(al), 'dm ds') + L(x0, yc, x0 + 1.15 * c, yc, 'dm ds') +
        T(x0 + 1.15 * c + 4, yc + 4, 'U 방향', { a: 'start', s: 11 }) + T(x0 + 0.9 * c, yc + 22, 'α', { c: 'it' }) +
        A(30, yc, 110, yc, 'ld') + T(40, yc - 8, 'U', { a: 'start', c: 'lb' }) +
        A(ac[0], ac[1], ac[0], ac[1] - 110, 'rx') + T(ac[0] + 8, ac[1] - 96, 'L', { a: 'start', c: 'rl' }) +
        A(ac[0], ac[1], ac[0] + 50, ac[1], 'rx') + T(ac[0] + 54, ac[1] - 6, 'D', { a: 'start', c: 'rl' }) + T(x0 + c * 0.55, yc + 60, '시위 길이 c', { s: 11 }),
        '양력 $L=C_L\\tfrac12\\rho U^2A_p$, 항력 $D=C_D\\tfrac12\\rho U^2A_p$ ($A_p$: 날개 평면 넓이). 얇은 날개 이론에서 $C_L\\approx2\\pi\\sin\\alpha$이고, 받음각이 약 15°를 넘으면 윗면에서 박리가 일어나 양력이 급히 떨어집니다(실속).');
    },
    // f15 — streamlines past a circular cylinder without and with clockwise circulation (marching-squares contours of ψ)
    fCylCirc() {
      const sc = 40;
      const panel = (ox, oy, K) => {
        const psi = (x, y) => { const r2 = x * x + y * y; return r2 < 1 ? NaN : y * (1 - 1 / r2) + 0.5 * K * Math.log(r2); };
        const nx = 66, ny = 48, x0 = -3, y0 = -2.2, dx = 6 / nx, dy = 4.4 / ny;
        const X = (x) => (ox + (x + 3) * sc).toFixed(1), Y = (y) => (oy + (2.2 - y) * sc).toFixed(1);
        const g = [];
        for (let i = 0; i <= nx; i++) { g[i] = []; for (let j = 0; j <= ny; j++) g[i][j] = psi(x0 + i * dx, y0 + j * dy); }
        let d = '';
        for (let k = -8; k <= 8; k++) {
          const lv = k * 0.3;
          for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
            const v = [g[i][j], g[i + 1][j], g[i + 1][j + 1], g[i][j + 1]];
            if (v.some(isNaN)) continue;
            const px = [i, i + 1, i + 1, i].map((q) => x0 + q * dx), py = [j, j, j + 1, j + 1].map((q) => y0 + q * dy), pts = [];
            for (let e = 0; e < 4; e++) {
              const a = v[e] - lv, b = v[(e + 1) % 4] - lv;
              if (a < 0 !== b < 0) { const t = a / (a - b); pts.push([px[e] + t * (px[(e + 1) % 4] - px[e]), py[e] + t * (py[(e + 1) % 4] - py[e])]); }
            }
            for (let q = 0; q + 1 < pts.length; q += 2) d += `M${X(pts[q][0])},${Y(pts[q][1])}L${X(pts[q + 1][0])},${Y(pts[q + 1][1])}`;
          }
        }
        const stag = K ? [210, 330] : [180, 0];
        return `<path class="cv" style="stroke-width:1.1" d="${d}"/>` + C(+X(0), +Y(0), sc, 'bm') +
          stag.map((a) => C(+X(Math.cos((a * Math.PI) / 180)), +Y(Math.sin((a * Math.PI) / 180)), 3.5, 'jt')).join('');
      };
      return fig(560, 250, '원기둥을 지나는 퍼텐셜 유동의 유선: 왼쪽은 순환이 없어 위아래가 대칭, 오른쪽은 시계 방향 순환이 더해져 정체점(점)이 아래로 내려가고 위쪽 흐름이 빨라진다',
        panel(12, 12, 0) + panel(308, 12, 1) + T(132, 244, '순환 없음: 양력 0', { s: 11 }) + T(428, 244, '시계 방향 순환 Γ: 양력 ρUΓ (위)', { s: 11 }) +
        A(20, 26, 56, 26, 'ld', 7) + T(60, 30, 'U', { a: 'start', c: 'lb' }),
        '왼쪽: $\\psi=U\\sin\\theta\\,(r-a^2/r)$. 오른쪽: 여기에 선 와류를 더한 $\\psi=U\\sin\\theta\\,(r-a^2/r)+K\\ln(r/a)$, $K=Ua$. 정체점은 $\\sin\\theta=-K/(2Ua)$인 $\\theta=210°,330°$로 옮겨 갑니다. 원기둥 표면은 두 경우 모두 $\\psi=0$인 유선입니다.');
    },
    // f15 — pressure coefficient on a cylinder: potential theory 1 − 4 sin²θ against a sketch of subcritical measurements
    fCylCp() {
      const ox = 80, oy = 36, sx = 2.3, sy = 38;
      const X = (t) => ox + t * sx, Y = (c) => oy + (1 - c) * sy;
      const pot = (t) => 1 - 4 * Math.sin((t * Math.PI) / 180) ** 2;
      const exp = (t) => { const z = pot(Math.min(t, 90)) + 1.2; return -1.2 + 0.25 * Math.log(1 + Math.exp(z / 0.25)); };
      let dp = '', de = '';
      for (let t = 0; t <= 180; t += 2) { dp += (t ? 'L' : 'M') + X(t).toFixed(1) + ',' + Y(pot(t)).toFixed(1); de += (t ? 'L' : 'M') + X(t).toFixed(1) + ',' + Y(exp(t)).toFixed(1); }
      let ticks = '';
      [0, 45, 90, 135, 180].forEach((t) => { ticks += L(X(t), Y(-3), X(t), Y(-3) + 5, 'dm') + T(X(t), Y(-3) + 18, t + '°', { s: 11 }); });
      [1, 0, -1, -2, -3].forEach((c) => { ticks += L(ox - 5, Y(c), ox, Y(c), 'dm') + T(ox - 9, Y(c) + 4, String(c).replace('-', '−'), { a: 'end', s: 11 }); });
      return fig(560, 250, '원기둥 표면의 압력 계수: 퍼텐셜 이론 1 − 4 sin²θ는 앞뒤가 대칭이지만, 실제(아임계 층류 박리)는 약 80° 뒤에서 낮은 압력이 회복되지 않는다',
        L(ox, Y(1), ox, Y(-3), 'ax') + L(ox, Y(0), X(180), Y(0), 'ax') + L(ox, Y(-3), X(180), Y(-3), 'ax') + ticks +
        P(dp, 'cv') + P(de, 'rx') + T(X(90), Y(-3) - 8, '퍼텐셜 이론', { c: 'lb', s: 11 }) + T(X(150), Y(-1.2) - 10, '실험 (개략)', { c: 'rl', s: 11 }) +
        T(ox - 40, Y(-1), 'C_p', { c: 'it' }) + T(X(90), Y(-3) + 36, 'θ (앞 정체점부터)', { s: 11 }),
        '퍼텐셜 유동에서는 뒤쪽 압력이 앞쪽과 똑같이 회복되어 알짜 항력이 0입니다(달랑베르의 역설). 실제로는 경계층이 역압력 기울기에서 박리하여 뒤쪽이 낮은 압력으로 남고, 그 차이가 압력 항력입니다.');
    },
  });
})();
