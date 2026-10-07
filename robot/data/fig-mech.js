/* 로봇공학 그림 — 기구 도감과 본문의 기구 그림. 평면 닫힌 사슬(4절, 크랭크-슬라이더, 5절, 스티븐슨 6절, 3-RRR),
   공간 기구(구면 4절과 후크 조인트, 스튜어트-고프, 3-UPU), 직렬 팔(RP, 3R, 스탠퍼드형 RRP, RRR, PUMA형 6R, UR5, SRS),
   바퀴 달린 기구(자동차, 이동 로봇 위의 팔), 진자와 수레, 겹친 관절, 4절 링크의 고리 조건, 기출 문제 1(2023·2024)의 기구.
   기구마다 그리는 함수 D.이름(원점, 축척, full)을 두어 도감의 한 장짜리 그림과 예제의 모음 그림이 같은 모양을 씁니다.
   기하는 수학 좌표(y 위)로 계산하고 map으로 화면에 옮깁니다. 관절 기호: 축이 화면 안에 놓인 회전 관절은 작은 원기둥(둥근 직사각형),
   화면 밖을 향하는 회전 관절은 점 찍힌 원, 구면 관절은 색칠한 공, 유니버설 관절은 십자 원, 병진 관절은 통에 끼운 막대. */
(function () {
  const { fig, L, A, A2, T, R, C, P, f1, pin, ground, mom } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const map = (o, k) => (p) => [o[0] + k * p[0], o[1] - k * p[1]]; // math coordinates (y up) → screen
  const pol = (p, r, d) => [p[0] + r * Math.cos(rad(d)), p[1] + r * Math.sin(rad(d))]; // math coordinates
  const spol = (p, r, d) => [p[0] + r * Math.cos(rad(d)), p[1] - r * Math.sin(rad(d))]; // screen point, math angle
  const mid = (p, q, t = 0.5) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const ang = (p, q) => deg(Math.atan2(q[1] - p[1], q[0] - p[0])); // math angle of a math-coordinate segment
  const sang = (p, q) => deg(Math.atan2(p[1] - q[1], q[0] - p[0])); // math angle of a screen segment
  const add = (p, d) => [p[0] + d[0], p[1] + d[1]];
  const poly = (pts, cls) => P('M' + pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L') + 'Z', cls);
  const path = (pts, cls) => P('M' + pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L'), cls);
  const bar = (p, q, cls = 'th') => L(p[0], p[1], q[0], q[1], cls);
  const jt = (p, r = 4.5) => C(p[0], p[1], r, 'jt');
  const link = (p, q, r) => bar(p, q) + jt(p, r) + jt(q, r);
  const tx = (p, s, o = {}) => T(p[0], p[1], s, Object.assign({ s: 11 }, o));
  const ell = (c, rx, ry, cls, rot = 0) => `<ellipse class="${cls}" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx)}" ry="${f1(ry)}"${rot ? ` transform="rotate(${f1(-rot)} ${f1(c[0])} ${f1(c[1])})"` : ''}/>`;
  // circle–circle intersection in math coordinates; side +1 takes the point to the left of p→q
  const cc = (p, r1, q, r2, side = 1) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy);
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
    return [p[0] + (a * dx) / d - (side * h * dy) / d, p[1] + (a * dy) / d + (side * h * dx) / d];
  };
  // arc at screen point c from math angle a0 to a1
  const arc = (c, r, a0, a1, cls = 'dm') => {
    const [xa, ya] = spol(c, r, a0), [xb, yb] = spol(c, r, a1);
    return `<path class="${cls}" d="M${f1(xa)},${f1(ya)}A${f1(r)},${f1(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f1(xb)},${f1(yb)}"/>`;
  };
  // part of an ellipse (screen centre c, radii rx, ry) from parameter a0 to a1 (degrees, math sense), optionally with a head at a1
  const earc = (c, rx, ry, a0, a1, cls = 'rx', head = true) => {
    const at = (a) => [c[0] + rx * Math.cos(rad(a)), c[1] - ry * Math.sin(rad(a))];
    const n = 24, pts = [];
    for (let i = 0; i <= n; i++) pts.push(at(a0 + ((a1 - a0) * i) / n));
    return head ? path(pts.slice(0, n - 1), cls) + A(...pts[n - 3], ...pts[n], cls, 8) : path(pts, cls);
  };
  // rectangle of length len along math angle d, width w, centred at screen point c
  const rrect = (c, len, w, d, cls = 'sp', r = 0) =>
    `<rect class="${cls}" x="${f1(c[0] - len / 2)}" y="${f1(c[1] - w / 2)}" width="${f1(len)}" height="${f1(w)}"${r ? ` rx="${r}"` : ''} transform="rotate(${f1(-d)} ${f1(c[0])} ${f1(c[1])})"/>`;
  // joint symbols (screen)
  const cyl = (c, d, len = 22, w = 12) => rrect(c, len, w, d, 'sp', 3) + L(...spol(c, len / 2 - 4, d + 180), ...spol(c, len / 2 - 4, d), 'dm'); // revolute, axis in the page
  const out = (c, r = 7) => C(c[0], c[1], r, 'sp') + C(c[0], c[1], 2.2, 'vlh'); // revolute, axis out of the page
  const ball = (c, r = 7) => C(c[0], c[1], r, 'bm2') + C(c[0] - r * 0.32, c[1] - r * 0.32, r * 0.3, 'sp'); // spherical
  const ujt = (c, r = 6) => C(c[0], c[1], r, 'sp') + L(c[0] - r + 1.5, c[1], c[0] + r - 1.5, c[1], 'vl') + L(c[0], c[1] - r + 1.5, c[0], c[1] + r - 1.5, 'vl'); // universal
  // prismatic leg: a sleeve from p over the fraction t, a rod sliding out of it to q
  const tele = (p, q, t = 0.55, w = 9) => {
    const d = sang(p, q), e = mid(p, q, t), len = Math.hypot(e[0] - p[0], e[1] - p[1]);
    return bar(mid(p, q, t - 0.15), q, 'th') + rrect(mid(p, e), len, w, d, 'sp', 2);
  };
  // ground pin whose base points along math angle d (away from the mechanism)
  const opin = (p, d, s = 1) => {
    const u = [Math.cos(rad(d)), -Math.sin(rad(d))], n = [Math.sin(rad(d)), Math.cos(rad(d))];
    const b = [p[0] + 15 * s * u[0], p[1] + 15 * s * u[1]], w = 9 * s;
    let g = poly([p, [b[0] + w * n[0], b[1] + w * n[1]], [b[0] - w * n[0], b[1] - w * n[1]]], 'sp') + L(b[0] + (w + 4) * n[0], b[1] + (w + 4) * n[1], b[0] - (w + 4) * n[0], b[1] - (w + 4) * n[1], 'gd');
    for (let t = -1; t <= 1.01; t += 0.5) { const q = [b[0] + t * (w + 2) * n[0], b[1] + t * (w + 2) * n[1]]; g += L(q[0], q[1], q[0] + 6 * u[0] - 3 * n[0], q[1] + 6 * u[1] - 3 * n[1], 'ht'); }
    return g + jt(p, 3.8 * s);
  };
  // hatched band under a fixed body: top edge from x1 to x2 at y
  const fixed = (x1, x2, y) => ground(x1, x2, y);
  // small numbered tag (link number)
  const tag = (p, s) => C(p[0], p[1], 7.5, 'sp') + T(p[0], p[1] + 3.8, s, { s: 10 });
  // two-prong gripper at screen point p pointing along math angle d
  const grip = (p, d, s = 1) => {
    const n = d + 90, a = spol(p, 7 * s, n), b = spol(p, 7 * s, n + 180);
    return bar(a, b, 'gd') + bar(a, spol(a, 10 * s, d), 'gd') + bar(b, spol(b, 10 * s, d), 'gd');
  };

  // ---------------------------------------------------------------- mechanisms: D.name(o, k, full) → svg
  // o: screen position of the first ground pin (or the base), k: pixels per unit length, full: draw every label
  const D = {
    // planar four-bar: ground pins O2 (driven crank) and O4
    four(o, k, full) {
      const m = map(o, k), A0 = pol([0, 0], 1.5, 70), B0 = cc(A0, 3.4, [4, 0], 2.6, 1);
      const [a, b, c, d] = [[0, 0], A0, B0, [4, 0]].map(m), sc = full ? 1 : 0.8;
      let s = L(a[0] - 14, a[1], d[0] + 14, d[1], 'dm ds') + pin(...a, sc) + pin(...d, sc) + link(a, b) + link(b, c) + link(c, d) + mom(a[0], a[1], 13, 150, 92, 'rx');
      s += tx(add(mid(a, b, 0.62), [-10, 4]), '크랭크', { a: 'end' }) + tx(add(mid(b, c), [0, -10]), '연결봉') + tx(add(mid(c, d), [9, 4]), '흔들대', { a: 'start' });
      if (full) s += tx(add(mid(a, d), [0, 30]), '바닥(고정 링크)') + tx(add(a, [-22, 4]), 'O₂', { a: 'end', c: 'it' }) + tx(add(d, [22, 4]), 'O₄', { a: 'start', c: 'it' }) + tx(add(b, [-8, -8]), 'A', { a: 'end', c: 'it' }) + tx(add(c, [8, -8]), 'B', { a: 'start', c: 'it' });
      return s;
    },
    // slider-crank: crank O–A, connecting rod A–B, slider B on a rail through O
    slider(o, k, full) {
      const m = map(o, k), A0 = pol([0, 0], 1.1, 60), B0 = [A0[0] + Math.sqrt(9 - A0[1] * A0[1]), 0];
      const [a, b, c] = [[0, 0], A0, B0].map(m), bw = Math.max(0.95 * k, 30), bh = Math.max(0.6 * k, 18), yr = c[1] + bh / 2, sc = full ? 1 : 0.8;
      let s = pin(...a, sc) + ground(c[0] - 1.3 * k, c[0] + 1.3 * k, yr) + R(c[0] - bw / 2, c[1] - bh / 2, bw, bh, 'bm2') + link(a, b) + link(b, c) + mom(a[0], a[1], 13, 160, 100, 'rx');
      s += A2(c[0] - bw / 2 - 2, yr + 18, c[0] + bw / 2 + 2, yr + 18, 'ld', 6) + tx([c[0] + bw / 2 + 10, yr + 22], 'P', { a: 'start', c: 'it' });
      s += tx(add(mid(a, b, 0.62), [-10, 4]), '크랭크', { a: 'end' }) + tx(add(mid(b, c, 0.42), [0, 18]), '연결봉') + tx([c[0], c[1] - bh / 2 - 7], '슬라이더');
      if (full) s += tx(add(a, [-20, 4]), 'O', { a: 'end', c: 'it' }) + tx(add(b, [-8, -8]), 'A', { a: 'end', c: 'it' }) + tx(add(c, [bw / 2 + 6, -4]), 'B', { a: 'start', c: 'it' }) + tx([c[0] - 1.3 * k - 6, yr + 4], '레일(바닥)', { a: 'end' });
      return s;
    },
    // five-bar: two driven ground pins, two two-link arms meeting at P
    five(o, k, full) {
      const m = map(o, k), A1 = pol([0, 0], 1.5, 115), A2p = pol([2, 0], 1.5, 65), E0 = cc(A1, 2.3, A2p, 2.3, 1);
      const [a, b, c, d, e] = [[0, 0], A1, E0, A2p, [2, 0]].map(m), sc = full ? 1 : 0.8;
      let s = L(a[0] - 14, a[1], e[0] + 14, e[1], 'dm ds') + pin(...a, sc) + pin(...e, sc) + link(a, b) + link(b, c) + link(c, d) + link(d, e) + C(c[0], c[1], 3.6, 'dotf');
      s += mom(a[0], a[1], 19, 165, 120, 'rx') + mom(e[0], e[1], 19, 15, 60, 'rx') + tx(add(c, [0, -12]), '끝점 P');
      if (full) s += tx(add(a, [-16, 32]), '모터 1') + tx(add(e, [16, 32]), '모터 2') + tx(add(mid(a, e), [0, 32]), '바닥');
      return s;
    },
    // Stephenson six-bar: ternary ground (A, D, F) and ternary coupler (B, C, E) share no joint
    steph(o, k, full) {
      const m = map(o, k), Ap = [0, 0], Dp = [2.6, 0], Fp = [5.2, 0], Bp = pol(Ap, 1.1, 75);
      const Cp = cc(Bp, 2.6, Dp, 1.9, 1), Ep = pol(Cp, 1.3, ang(Bp, Cp) + 70), Gp = cc(Ep, 2.4, Fp, 2.2, 1);
      const [a, b, c, d, e, f, g] = [Ap, Bp, Cp, Dp, Ep, Fp, Gp].map(m);
      let s = [a, d, f].map((p) => pin(...p)).join('') + L(a[0], a[1], f[0], f[1], 'dm ds');
      s += poly([b, c, e], 'bm2') + bar(a, b) + bar(c, d) + bar(e, g) + bar(g, f) + [a, b, c, d, e, f, g].map((p) => jt(p)).join('');
      s += mom(a[0], a[1], 19, 150, 100, 'rx');
      if (full) {
        s += tag(add(mid(a, d), [0, 34]), '1') + tag(add(mid(a, b), [-14, 0]), '2') + tag([(b[0] + c[0] + e[0]) / 3, (b[1] + c[1] + e[1]) / 3 + 2], '3') + tag(add(mid(c, d), [14, 4]), '4') + tag(add(mid(e, g), [4, -13]), '5') + tag(add(mid(g, f), [15, 0]), '6');
      }
      return s;
    },
    // planar 3-RRR parallel robot: three R-R-R legs from the ground to a moving triangle
    rrr3(o, k, full) {
      const m = map(o, k), Pc = [0, 0.1], legs = [90, 210, 330];
      const B = legs.map((t) => pol([0, 0], 2.6, t)), V = legs.map((t) => pol(Pc, 0.75, t + 20)), E = B.map((b, i) => cc(b, 1.7, V[i], 1.6, 1));
      const [b, v, e] = [B.map(m), V.map(m), E.map(m)];
      let s = poly(v, 'bm2') + b.map((p, i) => opin(p, legs[i]) + bar(p, e[i]) + bar(e[i], v[i]) + jt(e[i])).join('') + v.map((p) => jt(p)).join('') + C(...m(Pc), 2.6, 'dotf');
      if (full) s += tx(add(m(Pc), [26, 34]), '움직이는 판', { a: 'start' }) + L(m(Pc)[0] + 4, m(Pc)[1] + 4, m(Pc)[0] + 24, m(Pc)[1] + 26, 'dm') + tx(add(mid(b[0], e[0]), [10, 4]), '다리 (R-R-R)', { a: 'start' }) + tx(add(b[1], [0, 36]), '바닥에 고정된 핀');
      return s;
    },
    // spherical four-bar: four revolute axes through one point O; the links move on a sphere around O
    sphere(c, Rr, full) {
      const A3 = [[-0.80, -0.32], [-0.30, 0.80], [0.66, 0.52], [0.80, -0.36]].map(([x, y]) => [x, y, -Math.sqrt(1 - x * x - y * y)]);
      const scr = (v, r = Rr) => [c[0] + r * v[0], c[1] - r * v[1]];
      const slerp = (p, q, t) => { const w = Math.acos(p[0] * q[0] + p[1] * q[1] + p[2] * q[2]), a = Math.sin((1 - t) * w) / Math.sin(w), b = Math.sin(t * w) / Math.sin(w); return [0, 1, 2].map((i) => a * p[i] + b * q[i]); };
      const gc = (p, q) => Array.from({ length: 31 }, (_, i) => scr(slerp(p, q, i / 30)));
      let s = C(c[0], c[1], Rr, 'fl') + C(c[0], c[1], Rr, 'dm ds') + ell(c, Rr, Rr * 0.26, 'dm ds');
      A3.forEach((v) => { s += L(c[0], c[1], ...scr(v, Rr * 1.28), 'dm ds'); });
      s += path(gc(A3[3], A3[0]), 'th ds') + path(gc(A3[0], A3[1]), 'th') + path(gc(A3[1], A3[2]), 'th') + path(gc(A3[2], A3[3]), 'th');
      A3.forEach((v, i) => { const p = scr(v), d = deg(Math.atan2(v[1], v[0])); s += cyl(p, d, 18, 11); if (full) s += tx(add(scr(v, Rr * 1.42), [0, 4]), `축 ${i + 1}`, { s: 10.5 }); });
      s += C(c[0], c[1], 3.2, 'dotf') + tx(add(c, [10, 14]), 'O', { a: 'start', c: 'it' });
      if (full) s += tx(add(scr(slerp(A3[3], A3[0], 0.5), Rr), [0, 22]), '바닥(고정)');
      return s;
    },
    // Hooke (universal) joint in an oblique view: the input yoke holds the cross arm along z, the output yoke the arm along y
    hooke(c, sc, full) {
      const pr = (p) => [c[0] + sc * (p[0] + 0.66 * p[1]), c[1] - sc * (p[2] + 0.46 * p[1])];
      const a = 0.4, b = 0.6, Ls = 1.7, be = rad(26), u = [Math.cos(be), 0, -Math.sin(be)];
      const mul = (p, k) => p.map((v) => v * k), plus = (p, q) => p.map((v, i) => v + q[i]);
      const zt = [0, 0, a], zb = [0, 0, -a], yt = [0, a, 0], yb = [0, -a, 0], yt2 = plus(yt, mul(u, b)), yb2 = plus(yb, mul(u, b));
      const S = (p, q, cls) => bar(pr(p), pr(q), cls);
      let s = S([-Ls - 0.3, 0, 0], [0.7, 0, 0], 'dm ds') + S(mul(u, -0.7), mul(u, Ls + 0.3), 'dm ds');
      s += S(yt, yt2) + S(yt2, yb2) + S(yt, yb, 'gd'); // output yoke's far prong first
      s += S([-Ls, 0, 0], [-b, 0, 0]) + S([-b, 0, -a], [-b, 0, a]) + S([-b, 0, a], zt) + S([-b, 0, -a], zb) + S(zt, zb, 'gd');
      s += S(yb, yb2) + S(mul(u, b), mul(u, Ls));
      s += [zt, zb, yt, yb].map((p) => jt(pr(p), 3.6)).join('') + C(...pr([0, 0, 0]), 2.8, 'dotf');
      if (full) s += tx(add(pr([-1.25, 0, 0]), [0, -10]), '입력 축') + tx(add(pr(mul(u, 1.35)), [6, 22]), '출력 축', { a: 'start' }) + tx(add(pr(zt), [8, -8]), '십자', { a: 'start' });
      return s;
    },
    // Stewart–Gough platform: six U-P-S legs between a base and a top plate (seen from slightly above)
    stewart(c, Rb, H, full) {
      const ry = 0.3, rt = 0.58;
      const at = (cx, cy, r, b) => [cx + r * Math.cos(rad(b)), cy + r * ry * Math.sin(rad(b))];
      const bb = [17, 43, 137, 163, 257, 283], tb = [-17, 77, 103, 197, 223, 317];
      const base = bb.map((b) => at(c[0], c[1], Rb, b)), top = tb.map((b) => at(c[0], c[1] - H, Rb * rt, b));
      const leg = (i) => tele(base[i], top[i], 0.52, 8) + ujt(base[i], 5) + ball(top[i], 5);
      const back = [0, 3, 4, 5], front = [1, 2]; // legs ending on the far half of the plate go behind it
      let s = ell([c[0], c[1] + 7], Rb + 8, (Rb + 8) * ry, 'rg') + ell(c, Rb + 8, (Rb + 8) * ry, 'rg') + ell(c, Rb + 8, (Rb + 8) * ry, 'gd');
      s += L(c[0] - Rb - 8, c[1], c[0] - Rb - 8, c[1] + 7, 'gd') + L(c[0] + Rb + 8, c[1], c[0] + Rb + 8, c[1] + 7, 'gd') + earc([c[0], c[1] + 7], Rb + 8, (Rb + 8) * ry, 180, 360, 'gd', false);
      s += back.map(leg).join('') + ell([c[0], c[1] - H], Rb * rt + 9, (Rb * rt + 9) * ry, 'bm2') + front.map(leg).join('');
      if (full) {
        const i = 3, bp = base[i], tp = top[i], mp = mid(bp, tp, 0.45);
        s += tx(add(bp, [-10, 6]), 'U', { a: 'end', c: 'em' }) + tx(add(mp, [-10, 4]), 'P', { a: 'end', c: 'em' }) + tx(add(tp, [-10, 2]), 'S', { a: 'end', c: 'em' });
        s += tx([c[0] + Rb * rt + 16, c[1] - H + 4], '판', { a: 'start' }) + tx([c[0] + Rb + 14, c[1] + 4], '바닥', { a: 'start' });
      }
      return s;
    },
    // 3-UPU: three legs, a universal joint at each end and a prismatic joint in the middle
    upu3(c, Rb, H, full) {
      const ry = 0.3, rt = 0.62;
      const at = (cx, cy, r, b) => [cx + r * Math.cos(rad(b)), cy + r * ry * Math.sin(rad(b))];
      const ang3 = [90, 210, 330], base = ang3.map((b) => at(c[0], c[1], Rb, b)), top = ang3.map((b) => at(c[0], c[1] - H, Rb * rt, b));
      const leg = (i) => tele(base[i], top[i], 0.52, 8) + ujt(base[i], 5.5) + ujt(top[i], 5.5);
      let s = ell([c[0], c[1] + 7], Rb + 10, (Rb + 10) * ry, 'rg') + ell(c, Rb + 10, (Rb + 10) * ry, 'rg') + ell(c, Rb + 10, (Rb + 10) * ry, 'gd');
      s += L(c[0] - Rb - 10, c[1], c[0] - Rb - 10, c[1] + 7, 'gd') + L(c[0] + Rb + 10, c[1], c[0] + Rb + 10, c[1] + 7, 'gd') + earc([c[0], c[1] + 7], Rb + 10, (Rb + 10) * ry, 180, 360, 'gd', false);
      s += leg(1) + leg(2) + ell([c[0], c[1] - H], Rb * rt + 12, (Rb * rt + 12) * ry, 'bm2') + leg(0);
      if (full) {
        const bp = base[0], tp = top[0], mp = mid(bp, tp, 0.45);
        s += tx(add(bp, [12, 4]), 'U', { a: 'start', c: 'em' }) + tx(add(mp, [10, 4]), 'P', { a: 'start', c: 'em' }) + tx(add(tp, [12, 10]), 'U', { a: 'start', c: 'em' });
        s += tx([c[0] + Rb * rt + 20, c[1] - H + 4], '판', { a: 'start' }) + tx([c[0] + Rb + 16, c[1] + 4], '바닥', { a: 'start' });
      }
      return s;
    },
    // six-revolute arm with a spherical wrist (PUMA type), side view
    puma(o, k, full) {
      const m = map(o, k), S0 = [0, 1.75], E0 = pol(S0, 1.6, 38), W0 = pol(E0, 1.5, -16), hd = -16 - 42;
      const [b, s0, e0, w0] = [[0, 0], S0, E0, W0].map(m), j1 = m([0, 0.42]), j4 = mid(e0, w0, 0.58), j6 = spol(w0, 0.45 * k, hd), g = spol(w0, 0.78 * k, hd);
      const cw = Math.max(16, 0.42 * k), cl = Math.max(22, 0.55 * k);
      let s = fixed(b[0] - 0.8 * k, b[0] + 0.8 * k, b[1]) + L(b[0], b[1] + 4, b[0], s0[1] - 0.55 * k, 'dm ds');
      s += L(...spol(e0, 0.2 * k, -16 + 180), ...spol(w0, 0.75 * k, -16), 'dm ds') + L(...spol(w0, 0.35 * k, hd + 180), ...spol(w0, 1.05 * k, hd), 'dm ds');
      s += bar(b, s0) + bar(s0, e0) + bar(e0, w0) + bar(w0, g) + grip(g, hd, full ? 1 : 0.8);
      s += cyl(j1, 90, cl, cw) + out(s0, 8) + out(e0, 8) + cyl(j4, -16, cl * 0.9, cw * 0.9) + out(w0, 7) + cyl(j6, hd, cl * 0.8, cw * 0.85);
      const nb = (p, d, n) => tx(add(spol(p, 15, d), [0, 4]), n, { c: 'lb', s: 11 });
      s += nb(j1, 180, '1') + nb(s0, 150, '2') + nb(e0, 100, '3') + nb(j4, 75, '4') + nb(w0, 60, '5') + nb(j6, hd - 90, '6');
      if (full) s += L(w0[0] + 6, w0[1] - 6, w0[0] + 40, w0[1] - 40, 'dm') + tx([w0[0] + 42, w0[1] - 42], '손목 중심: 축 4, 5, 6이 만나는 점', { a: 'start' });
      return s;
    },
    // seven-dof S-R-S arm (shoulder sphere, elbow revolute, wrist sphere) with its elbow circle
    srs(o, k, full) {
      const m = map(o, k), S0 = [0, 2.2], E0 = [0.75, 0.9], W0 = [2.4, 1.45], Hd = pol(W0, 0.55, 18);
      const [s0, e0, w0, hd] = [S0, E0, W0, Hd].map(m);
      const u = [w0[0] - s0[0], w0[1] - s0[1]], lu = Math.hypot(...u), t = ((e0[0] - s0[0]) * u[0] + (e0[1] - s0[1]) * u[1]) / (lu * lu);
      const F = [s0[0] + t * u[0], s0[1] + t * u[1]], r = Math.hypot(e0[0] - F[0], e0[1] - F[1]), dp = sang(F, e0);
      const tw = 0.62 * k, tl = s0[0] - 10 - tw;
      let s = R(tl, s0[1] - 0.5 * k, tw, 2.3 * k, 'rg') + R(tl, s0[1] - 0.5 * k, tw, 2.3 * k, 'gd') + tx([tl + tw / 2, s0[1] + 1.8 * k + 18], '몸통(고정)');
      s += (full ? L(...s0, ...w0, 'dm ds') + ell(F, r, r * 0.3, 'rx ds', dp) : '') + bar(s0, e0) + bar(e0, w0) + bar(w0, hd) + grip(hd, 18);
      s += ball(s0, 10) + out(e0, 8) + ball(w0, 9);
      s += tx(add(s0, [6, -16]), full ? '어깨 S (3)' : '어깨 S', { a: 'start' }) + tx(add(e0, [12, 18]), full ? '팔꿈치 R (1)' : '팔꿈치 R', { a: 'start' }) + tx(add(w0, [4, -16]), full ? '손목 S (3)' : '손목 S', { a: 'start' });
      const top = spol(F, r, dp + 180);
      if (full) s += tx(add(top, [14, 2]), '어깨·손목을 고정해도', { a: 'start', s: 10.5 }) + tx(add(top, [14, 17]), '팔꿈치는 이 원 위를 돈다', { a: 'start', s: 10.5 });
      return s;
    },
    // Stanford-type RRP arm: column about the vertical (θ1), shoulder about a horizontal axis (θ2), sliding boom (s)
    stanford(o, k, full) {
      const m = map(o, k), S0 = [0, 2.0], bd = 18, Hd = pol(S0, 2.7, bd), s0 = m(S0), hd = m(Hd), b = m([0, 0]);
      let s = fixed(b[0] - 0.8 * k, b[0] + 0.8 * k, b[1]) + R(b[0] - 0.22 * k, s0[1] + 0.15 * k, 0.44 * k, b[1] - s0[1] - 0.15 * k, 'rg') + R(b[0] - 0.22 * k, s0[1] + 0.15 * k, 0.44 * k, b[1] - s0[1] - 0.15 * k, 'gd');
      s += L(b[0], b[1] + 4, b[0], s0[1] - 0.9 * k, 'dm ds') + earc(m([0, 1.25]), 0.42 * k, 0.13 * k, 200, 340, 'rx') + tx(add(m([0.45, 1.25]), [6, 10]), 'θ₁', { a: 'start', c: 'rl' });
      s += rrect(spol(s0, 0.5 * k, bd), 1.3 * k, 0.36 * k, bd, 'sp', 3) + bar(spol(s0, 0.95 * k, bd), hd) + grip(hd, bd) + out(s0, 9);
      s += mom(s0[0], s0[1], 0.62 * k, 150, 112, 'rx') + tx(add(s0, [-0.62 * k - 4, -0.36 * k]), 'θ₂', { a: 'end', c: 'rl' });
      const n = [Math.cos(rad(bd + 90)), -Math.sin(rad(bd + 90))], o1 = [s0[0] + 0.62 * k * n[0], s0[1] + 0.62 * k * n[1]], o2 = [hd[0] + 0.62 * k * n[0], hd[1] + 0.62 * k * n[1]];
      s += A2(...o1, ...o2, 'dm', 6) + tx(add(mid(o1, o2), [0, -6]), 's', { c: 'it' });
      if (full) s += tx(add(s0, [-0.3 * k - 6, 0.55 * k]), '어깨 축 x̂_b', { a: 'end', s: 10.5 }) + tx(add(s0, [-0.3 * k - 6, 0.55 * k + 14]), '(화면 밖)', { a: 'end', s: 10.5 }) + tx(add(spol(s0, 2.0 * k, bd), [8, 22]), '병진 관절: ŷ_b 방향', { s: 10.5 }) + A(b[0] - 1.25 * k, b[1] - 4, b[0] - 1.25 * k, b[1] - 0.8 * k, 'vl', 7) + tx([b[0] - 1.25 * k, b[1] - 0.8 * k - 6], 'ẑ_s', { c: 'it' });
      return s;
    },
    // spatial RRR elbow arm: vertical joint 1, horizontal joints 2 and 3 (side view)
    rrr(o, k, full) {
      const m = map(o, k), J2 = [0, 1.4], t2 = 40, t3 = -60, J3 = pol(J2, 1.6, t2), Tp = pol(J3, 1.3, t2 + t3);
      const [b, j2, j3, tp] = [[0, 0], J2, J3, Tp].map(m), j1 = m([0, 0.45]);
      let s = fixed(b[0] - 0.8 * k, b[0] + 0.8 * k, b[1]) + L(b[0], b[1] + 4, b[0], j2[1] - 0.8 * k, 'dm ds') + L(j2[0], j2[1], j2[0] + 3.1 * k, j2[1], 'dm ds') + L(...j3, ...spol(j3, 0.9 * k, t2), 'dm ds');
      s += bar(b, j2) + bar(j2, j3) + bar(j3, tp) + C(tp[0], tp[1], 4, 'dotf') + cyl(j1, 90, 22, 15) + out(j2, 8) + out(j3, 8);
      s += arc(j2, 0.75 * k, 0, t2, 'rx') + tx(spol(j2, 0.75 * k + 12, t2 / 2), 'θ₂', { c: 'rl' }) + arc(j3, 0.62 * k, t2 + t3, t2, 'rx') + tx(add(spol(j3, 0.62 * k + 12, t2 + t3 / 2), [4, 4]), 'θ₃', { a: 'start', c: 'rl' });
      s += earc(m([0, 0.92]), 0.38 * k, 0.12 * k, 200, 340, 'rx') + tx(add(m([0.4, 0.92]), [6, 10]), 'θ₁', { a: 'start', c: 'rl' });
      s += tx(add(mid(j2, j3), [-8, -8]), 'L₂', { a: 'end', c: 'it' }) + tx(add(mid(j3, tp), [8, -6]), 'L₃', { a: 'start', c: 'it' });
      if (full) s += tx(add(j1, [-16, 4]), '1', { a: 'end', c: 'lb' }) + tx(add(j2, [-12, -10]), '2', { a: 'end', c: 'lb' }) + tx(add(j3, [-6, -14]), '3', { c: 'lb' }) + tx([j2[0] + 3.1 * k, j2[1] + 16], '영 자세', { a: 'end', s: 10.5 });
      return s;
    },
    // planar RP arm (top view): base revolute θ1 about ẑ, then a prismatic joint θ2 along the arm
    rp(o, k, full) {
      const m = map(o, k), d = 35, L0 = 2.0, th2 = 0.9, O0 = m([0, 0]), tip = m(pol([0, 0], L0 + th2, d));
      let s = L(O0[0], O0[1], O0[0] + 3.4 * k, O0[1], 'dm ds') + C(...m([L0, 0]), 4, 'doto') + tx(add(m([L0, 0]), [0, 18]), '영 자세의 끝점 (L₀, 0)', { s: 10.5 });
      s += bar(spol(O0, 1.1 * k, d), tip) + rrect(spol(O0, 0.8 * k, d), 1.6 * k, 0.34 * k, d, 'sp', 3) + C(tip[0], tip[1], 4, 'dotf') + opin(O0, 225) + out(O0, 7);
      s += arc(O0, 0.85 * k, 0, d, 'rx') + tx(spol(O0, 0.85 * k + 12, d / 2), 'θ₁', { a: 'start', c: 'rl' });
      const n = [Math.cos(rad(d + 90)), -Math.sin(rad(d + 90))], o1 = [O0[0] + 0.5 * k * n[0], O0[1] + 0.5 * k * n[1]], o2 = [tip[0] + 0.5 * k * n[0], tip[1] + 0.5 * k * n[1]];
      s += A2(...o1, ...o2, 'dm', 6) + tx(add(mid(o1, o2), [-10, -6]), 'L₀ + θ₂', { a: 'end', c: 'it' });
      if (full) s += tx(add(spol(O0, 1.75 * k, d), [12, 16]), '병진 관절 θ₂', { a: 'start', s: 10.5 }) + tx(add(tip, [8, -6]), '끝점', { a: 'start', s: 10.5 });
      return s;
    },
    // planar 3R arm in a bent pose with its three relative joint angles
    threeR(o, k, full) {
      const m = map(o, k), Ls = [1.6, 1.2, 0.9], th = [22, 52, -62];
      const J = [[0, 0]]; let a = 0;
      th.forEach((t, i) => { a += t; J.push(pol(J[i], Ls[i], a)); });
      const p = J.map(m);
      let s = L(p[0][0], p[0][1], p[0][0] + 1.3 * k, p[0][1], 'dm ds') + pin(...p[0]) + link(p[0], p[1]) + link(p[1], p[2]) + bar(p[2], p[3]) + jt(p[2]) + C(p[3][0], p[3][1], 4, 'dotf');
      let acc = 0;
      th.forEach((t, i) => {
        const r = 0.5 * k;
        if (i) s += L(...p[i], ...spol(p[i], 0.85 * k, acc), 'dm ds');
        s += arc(p[i], r, Math.min(acc, acc + t), Math.max(acc, acc + t), 'rx') + tx(add(spol(p[i], r + 12, acc + t / 2), [0, 4]), `θ${'₁₂₃'[i]}`, { c: 'rl' });
        acc += t;
      });
      s += tx(add(mid(p[0], p[1], 0.6), [-4, -10]), 'L₁', { a: 'end', c: 'it' }) + tx(add(mid(p[1], p[2]), [-10, 0]), 'L₂', { a: 'end', c: 'it' }) + tx(add(mid(p[2], p[3]), [6, 18]), 'L₃', { c: 'it' });
      if (full) s += tx(add(p[3], [10, 12]), '끝점 (x, y)', { a: 'start' });
      return s;
    },
    // UR5 at its zero configuration (MR Example 4.5), drawn in an oblique view
    ur5(c, sc, full) {
      const W1 = 0.109, W2 = 0.082, L1 = 0.425, L2 = 0.392, H1 = 0.089, H2 = 0.095;
      const pr = (p) => [c[0] + sc * (p[0] + 0.62 * p[1]), c[1] - sc * (p[2] + 0.42 * p[1])];
      const q = [[0, 0, -0.05], [0, 0, H1], [L1, 0, H1], [L1 + L2, 0, H1], [L1 + L2, W1, H1], [L1 + L2, W1, H1 - H2]];
      const pts = [[0, 0, -0.16], [0, 0, H1], [L1, 0, H1], [L1 + L2, 0, H1], [L1 + L2, W1, H1], [L1 + L2, W1, H1 - H2], [L1 + L2, W1 + W2, H1 - H2]];
      const ax = ['z', 'y', 'y', 'y', 'z', 'y'], ad = { z: 90, y: deg(Math.atan2(0.42, 0.62)) };
      const b = pr([0, 0, -0.16]);
      let s = fixed(b[0] - 34, b[0] + 34, b[1]);
      for (let i = 0; i + 1 < pts.length; i++) s += bar(pr(pts[i]), pr(pts[i + 1]));
      q.forEach((p, i) => { s += cyl(pr(p), ad[ax[i]], 24, 14); });
      const e = pr(pts[6]);
      s += grip(e, ad.y, 0.9);
      const lab = [[-16, 4, 'end'], [-12, -12, 'end'], [0, -16, 'middle'], [-14, -10, 'end'], [12, -6, 'start'], [-14, 12, 'end']];
      q.forEach((p, i) => { const [dx, dy, a] = lab[i]; s += tx(add(pr(p), [dx, dy]), String(i + 1), { a, c: 'lb' }); });
      if (full) {
        s += tx(add(mid(pr(pts[1]), pr(pts[2])), [0, 20]), 'L₁ = 0.425', { s: 10.5 }) + tx(add(mid(pr(pts[2]), pr(pts[3])), [0, 20]), 'L₂ = 0.392', { s: 10.5 });
        s += tx([c[0] + 150, c[1] + 46], '축 1, 5: 수직', { a: 'start', s: 10.5 }) + tx([c[0] + 150, c[1] + 62], '축 2, 3, 4, 6: 서로 평행한 수평축', { a: 'start', s: 10.5 });
      }
      return s;
    },
    // kinematic car (top view): rear-axle point (x, y), heading φ, steering angle ψ
    car(o, k, full) {
      const ph = 20, ps = 26, wb = 2.4, tr = 0.72, Pr = o;
      const h = (r, d = ph) => spol(Pr, r * k, d);
      const side = (p, s) => spol(p, s * tr * k, ph + 90);
      let s = L(Pr[0], Pr[1], Pr[0] + 3.4 * k, Pr[1], 'dm ds') + rrect(h(1.15), 3.4 * k, 1.8 * k, ph, 'bm2', 8);
      const fa = h(wb);
      s += rrect(side(Pr, 1), 0.75 * k, 0.26 * k, ph, 'jt', 2) + rrect(side(Pr, -1), 0.75 * k, 0.26 * k, ph, 'jt', 2) + bar(side(Pr, 1), side(Pr, -1), 'gd');
      s += rrect(side(fa, 1), 0.75 * k, 0.26 * k, ph + ps, 'jt', 2) + rrect(side(fa, -1), 0.75 * k, 0.26 * k, ph + ps, 'jt', 2) + bar(side(fa, 1), side(fa, -1), 'gd');
      s += L(...fa, ...spol(fa, 0.9 * k, ph), 'dm ds') + arc(fa, 0.75 * k, ph, ph + ps, 'rx') + tx(add(spol(fa, 0.75 * k + 12, ph + ps / 2), [2, 2]), 'ψ', { a: 'start', c: 'rl' });
      s += A(...Pr, ...h(1.25), 'ld', 9) + tx(add(h(1.25), [2, -8]), 'v', { c: 'it' }) + C(Pr[0], Pr[1], 3.6, 'dotf');
      s += arc(Pr, 0.8 * k, 0, ph, 'dm') + tx(add(spol(Pr, 0.8 * k + 12, ph / 2), [2, 4]), 'φ', { a: 'start', c: 'it' }) + tx(add(Pr, [-10, 20]), '(x, y)', { a: 'end' });
      const sd = spol(Pr, 1.45 * k, ph - 90);
      s += A(...Pr, ...sd, 'rx', 8) + tx(add(sd, [6, 12]), '✕ 옆으로는 못 움직임', { a: 'start', c: 'rl', s: 10.5 });
      if (full) s += tx(add(side(fa, -1), [28, 16]), '앞바퀴(조향)', { a: 'start', s: 10.5 }) + tx(add(side(Pr, 1), [-14, -8]), '뒷바퀴', { a: 'end', s: 10.5 });
      return s;
    },
    // a planar 2R arm on a mobile base (top view)
    mobile(o, k, full) {
      const ph = 15, Bc = o, sh = spol(Bc, 0.55 * k, ph);
      const corner = (a, b) => spol(spol(Bc, a * k, ph), b * k, ph + 90);
      let s = rrect(Bc, 2.4 * k, 1.5 * k, ph, 'rg', 6) + rrect(Bc, 2.4 * k, 1.5 * k, ph, 'gd', 6);
      [[0.75, 0.86], [0.75, -0.86], [-0.75, 0.86], [-0.75, -0.86]].forEach(([a, b]) => { s += rrect(corner(a, b), 0.55 * k, 0.2 * k, ph, 'jt', 2); });
      s += C(Bc[0], Bc[1], 3.4, 'dotf') + tx(add(Bc, [0, 0.75 * k + 40]), '차체: 위치 (x, y), 방향 φ');
      const e = spol(sh, 1.5 * k, ph + 55), p = spol(e, 1.1 * k, ph + 55 + 65);
      s += L(...sh, ...spol(sh, 0.9 * k, ph), 'dm ds') + link(sh, e) + link(e, p) + C(p[0], p[1], 3.6, 'dotf');
      s += arc(sh, 0.45 * k, ph, ph + 55, 'rx') + tx(add(spol(sh, 0.45 * k + 12, ph + 28), [4, 4]), 'θ₁', { a: 'start', c: 'rl' });
      s += L(...e, ...spol(e, 0.7 * k, ph + 55), 'dm ds') + arc(e, 0.4 * k, ph + 55, ph + 120, 'rx') + tx(add(spol(e, 0.4 * k + 12, ph + 88), [0, 4]), 'θ₂', { a: 'end', c: 'rl' });
      if (full) s += tx(add(p, [-8, -8]), '손끝', { a: 'end', s: 10.5 });
      return s;
    },
    // spherical pendulum (a) and the same pendulum hung from a cart on a straight rail (b)
    pend(o, k, full) {
      const [ax, ay] = o, r = 1.6 * k, pv = [ax, ay], ms = spol(pv, r, -62);
      let s = ground(ax - 40, ax + 40, ay, false) + C(pv[0], pv[1], 3, 'jt');
      s += `<path class="dm ds" d="M${f1(ax - r)},${f1(ay)}A${f1(r)},${f1(r)} 0 0 0 ${f1(ax + r)},${f1(ay)}"/>` + earc([ax, ay + r * 0.55], r * Math.cos(Math.asin(0.55)), r * 0.2, 180, 360, 'dm ds', false);
      s += bar(pv, ms, 'gd') + C(ms[0], ms[1], 8, 'bm2') + tx([ax, ay + r + 30], '(a) 구면 진자: 질점은 구면 위', { c: 'em', s: 11 });
      const bx = ax + 3.3 * k, cy = ay, cw = 1.0 * k, cart = [bx, cy + 0.42 * k], pv2 = [bx, cy + 0.7 * k], ms2 = spol(pv2, 1.05 * k, -62);
      s += ground(bx - 1.9 * k, bx + 1.9 * k, cy, false) + R(cart[0] - cw / 2, cy + 0.12 * k, cw, 0.58 * k, 'bm2') + C(cart[0] - cw * 0.28, cy + 0.06 * k, 0.1 * k, 'jt') + C(cart[0] + cw * 0.28, cy + 0.06 * k, 0.1 * k, 'jt');
      s += bar(pv2, ms2, 'gd') + C(pv2[0], pv2[1], 3, 'jt') + C(ms2[0], ms2[1], 8, 'bm2') + A2(bx - 1.3 * k, cy - 14, bx + 1.3 * k, cy - 14, 'ld', 6) + tx([bx + 1.3 * k + 6, cy - 10], 'x', { a: 'start', c: 'it' });
      s += tx([bx, ay + r + 30], '(b) 레일 위 수레에 매단 진자', { c: 'em', s: 11 });
      return s;
    },
    // several links on one pin: top view (a) and the pin seen edge-on (b)
    pinStack(o, n, full) {
      const c = o, angs = n === 3 ? [200, 330, 90] : [200, 300, 30, 110];
      let s = angs.map((a, i) => bar(c, spol(c, 70, a)) + jt(spol(c, 70, a), 4) + tx(add(spol(c, 88, a), [0, 4]), `링크 ${i + 1}`, { s: 10.5 })).join('') + C(c[0], c[1], 7, 'jt') + C(c[0], c[1], 2.4, 'vlh');
      s += tx([c[0], c[1] + 112], '(a) 위에서 본 핀', { c: 'em', s: 11 });
      const sx = c[0] + 230, sy = c[1] - 10, gap = 13, h = gap * n;
      for (let i = 0; i < n; i++) { const y = sy - h / 2 + i * gap + 3; const right = i % 2 === 0; s += R(right ? sx - 8 : sx - 92, y, 100, 7, 'bm2') + tx([right ? sx + 98 : sx - 98, y + 7], `링크 ${i + 1}`, { a: right ? 'start' : 'end', s: 10.5 }); }
      s += R(sx - 3, sy - h / 2 - 8, 6, h + 14, 'sp') + tx([sx, c[1] + 112], '(b) 옆에서 본 핀: 판이 겹겹이 끼워짐', { c: 'em', s: 11 });
      return s;
    },
    // four-bar closure: link vectors L1…L4 around the loop and the joint angles θ1…θ4 between consecutive links
    loop4(o, k, full) {
      const m = map(o, k), J1 = [4, 0], P1 = pol(J1, 2.2, 100), J4 = [0, 0], P2 = cc(P1, 3.0, J4, 2.0, -1);
      const pts = [J1, P1, P2, J4], p = pts.map(m), dirs = [];
      for (let i = 0; i < 4; i++) dirs.push(ang(pts[i], pts[(i + 1) % 4]));
      let s = pin(...p[0]) + pin(...p[3]);
      for (let i = 0; i < 4; i++) { const a = p[i], b = p[(i + 1) % 4]; s += bar(a, b, i === 3 ? 'gd' : 'th'); }
      s += p.map((q) => jt(q)).join('');
      const nm = ['L₁', 'L₂', 'L₃', 'L₄'];
      for (let i = 0; i < 4; i++) {
        const a = p[i], b = p[(i + 1) % 4], d = sang(a, b), nrm = [Math.cos(rad(d - 90)), -Math.sin(rad(d - 90))], off = 13;
        const a2 = [mid(a, b, 0.3)[0] + off * nrm[0], mid(a, b, 0.3)[1] + off * nrm[1]], b2 = [mid(a, b, 0.7)[0] + off * nrm[0], mid(a, b, 0.7)[1] + off * nrm[1]];
        s += A(...a2, ...b2, 'ld', 8) + tx(add(mid(a2, b2), [nrm[0] * 14, nrm[1] * 14 + 4]), nm[i], { c: 'it' });
      }
      const nth = ['θ₁', 'θ₂', 'θ₃', 'θ₄'];
      for (let i = 0; i < 4; i++) {
        const inc = dirs[(i + 3) % 4], outd = dirs[i], q = p[i];
        let a0 = inc, a1 = outd; while (a1 < a0) a1 += 360;
        const rr = (i === 3 ? 0.66 : 0.42) * k;
        s += L(...q, ...spol(q, 0.75 * k, inc), 'dm ds') + arc(q, rr, a0, a1, 'rx') + tx(add(spol(q, rr + 13, (a0 + a1) / 2), [0, 4]), nth[i], { c: 'rl' });
      }
      return s;
    },
    // uniform ellipsoid with semi-axes R, r, r
    ellipsoid(c, Rr, rr) {
      let s = ell(c, Rr, rr, 'sp') + ell(c, rr * 0.38, rr, 'dm ds') + earc(c, rr * 0.38, rr, -90, 90, 'gd', false) + L(c[0] - Rr, c[1], c[0] + Rr, c[1], 'dm ds');
      s += A(...c, c[0] + Rr, c[1], 'vl', 7) + tx([c[0] + Rr / 2, c[1] - 6], 'R', { c: 'it' }) + A(...c, c[0], c[1] - rr, 'vl', 7) + tx([c[0] - 6, c[1] - rr / 2], 'r', { a: 'end', c: 'it' }) + A(...c, c[0] - 0.3 * rr, c[1] + 0.55 * rr, 'vl', 7) + tx([c[0] - 0.3 * rr - 6, c[1] + 0.55 * rr + 4], 'r', { a: 'end', c: 'it' });
      return s;
    },
    // 4×RP camera stand: a plate on four telescopic legs, each hinged at the plate (R) and resting on the floor
    stand4(c, full) {
      const rx = 52, ry = 13, th = 14, fy = c[1] + 120;
      let s = poly([[c[0] - 112, fy + 28], [c[0] + 84, fy + 28], [c[0] + 118, fy - 24], [c[0] - 78, fy - 24]], 'rg');
      const legA = [150, 30, 210, 330];
      const att = legA.map((a) => [c[0] + rx * Math.cos(rad(a)), c[1] + th + ry * Math.sin(rad(-a))]);
      const foot = legA.map((a) => [c[0] + 92 * Math.cos(rad(a)), fy + 20 * Math.sin(rad(-a))]);
      const leg = (i) => tele(att[i], foot[i], 0.55, 8) + cyl(att[i], sang(c, att[i]) + 90, 14, 9) + C(foot[i][0], foot[i][1], 3, 'dotf');
      s += leg(0) + leg(1) + R(c[0] - rx, c[1], 2 * rx, th, 'sp') + ell([c[0], c[1] + th], rx, ry, 'sp') + ell(c, rx, ry, 'bm2') + leg(2) + leg(3);
      s += R(c[0] - 13, c[1] - 24, 26, 17, 'jt') + C(c[0] + 13, c[1] - 15, 6, 'sp');
      if (full) { const p = att[3], f = foot[3], mpt = mid(p, f, 0.5); s += tx(add(p, [14, -2]), 'R', { a: 'start', c: 'em' }) + tx(add(mpt, [10, 4]), 'P', { a: 'start', c: 'em' }) + tx(add(foot[2], [-6, 16]), '발: 바닥에 점 접촉', { a: 'start', s: 10.5 }); }
      return s;
    },
    // one leg of the 2023 three-leg parallel mechanism in its vertical plane, and the 120° layout seen from above
    leg3(o, k, full) {
      const m = map(o, k);
      const Sl = [-2.6, 0.2], Ra = [-2.6, 0.42], El = [-3.35, 1.75], Sp = [-0.85, 3.4], Mb = mid(El, Sp, 0.46), Hb = [0, 1.35], Hj = [-0.5, 1.35];
      let s = ground(m([-4, 0])[0], m([1.1, 0])[0], m([0, 0])[1]) + R(m([-0.07, 0])[0], m([0, 3.0])[1], 0.14 * k, 3.0 * k, 'rg') + L(...m([0, 3.0]), ...m([0, 3.9]), 'dm ds');
      s += R(m([-3.0, 0])[0], m([0, 0.42])[1], 0.8 * k, 0.42 * k, 'bm2') + A2(...m([-3.1, -0.3]), ...m([-2.1, -0.3]), 'ld', 6) + tx(add(m([-2.6, -0.3]), [0, 16]), 'P', { c: 'em' });
      s += R(m([-0.5, 0])[0], m([0, 1.5])[1], 1.0 * k, 0.3 * k, 'bm2') + A2(...m([0.42, 1.0]), ...m([0.42, 1.9]), 'ld', 6) + tx(add(m([0.42, 1.45]), [10, 4]), 'P', { a: 'start', c: 'em' });
      s += ell(m([0, 3.45]), 1.0 * k, 0.16 * k, 'bm2') + tx(add(m([1.0, 3.45]), [8, 4]), '판', { a: 'start' });
      s += bar(m(Ra), m(El)) + bar(m(El), m(Sp)) + bar(m(Mb), m(Hj));
      s += out(m(Ra), 7) + out(m(El), 7) + out(m(Mb), 7) + out(m(Hj), 7) + ball(m(Sp), 8);
      s += tx(add(m(Ra), [-12, 4]), 'R', { a: 'end', c: 'em' }) + tx(add(m(El), [-12, 4]), 'R', { a: 'end', c: 'em' }) + tx(add(m(Mb), [-6, -12]), 'R', { a: 'end', c: 'em' }) + tx(add(m(Hj), [-4, 20]), 'R', { c: 'em' }) + tx(add(m(Sp), [-10, -10]), 'S', { a: 'end', c: 'em' });
      if (full) s += tx(add(m(mid(Ra, El)), [-10, 2]), 'a', { a: 'end', c: 'it' }) + tx(add(m(mid(Mb, Sp)), [-8, -6]), 'b', { a: 'end', c: 'it' }) + tx(add(m(mid(Mb, Hj)), [4, 14]), 'c', { a: 'start', c: 'it' }) + tx(add(m([0, 2.3]), [8, 4]), '기둥', { a: 'start', s: 10.5 });
      // top view: three radial rails 120° apart around the column
      const tc = m([2.35, 2.55]), tr = 1.0 * k;
      s += C(tc[0], tc[1], 6, 'bm2');
      [90, 210, 330].forEach((a) => { const e = spol(tc, tr, a); s += L(...spol(tc, 8, a), ...e, 'gd') + rrect(spol(tc, tr * 0.62, a), 12, 9, a, 'bm2'); });
      s += tx([tc[0], tc[1] + tr * 0.5 + 22], '위에서 본 모습', { s: 10.5 });
      return s;
    },
    // an upright tumbler, bottom centre (x, y); screw: threads on the lid, a hole and a logo
    tumb(x, y, s = 1, screw = true) {
      const w = 30 * s, hb = 70 * s, hl = 17 * s, top = y - hb;
      let g = R(x - w / 2, top, w, hb, 'rg') + R(x - w / 2, top, w, hb, 'gd') + R(x - w / 2 + 1, top - hl, w - 2, hl, 'bm2') + ell([x, top - hl], w / 2 - 1, 4 * s, 'sp');
      if (screw) {
        for (let i = 0; i < 3; i++) g += L(x - w / 2 + 1, top - 3 * s - i * 4.5 * s, x + w / 2 - 1, top - 5 * s - i * 4.5 * s, 'dm');
        g += ell([x + 5 * s, top - hl], 4 * s, 1.8 * s, 'vlh') + path([[x - 7 * s, top + 44 * s], [x - 7 * s, top + 26 * s], [x + 6 * s, top + 26 * s], [x - 7 * s, top + 35 * s], [x + 4 * s, top + 35 * s]], 'ld');
      }
      return g;
    },
  };
  window.SITE_MECH = D;

  // ---------------------------------------------------------------- figures
  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 01 예제 1 — the five mechanisms side by side
    rMechZoo() {
      let s = D.four([40, 158], 34) + D.slider([248, 158], 33) + D.five([470, 158], 34);
      s += tx([108, 205], '(a) 평면 4절 링크', { c: 'em', s: 11.5 }) + tx([310, 205], '(b) 크랭크-슬라이더', { c: 'em', s: 11.5 }) + tx([504, 205], '(c) 평면 5절 링크', { c: 'em', s: 11.5 });
      s += D.puma([110, 390], 44) + D.stewart([440, 384], 92, 104, true);
      s += tx([160, 428], '(d) 6R 직렬 팔 (번호는 관절)', { c: 'em', s: 11.5 }) + tx([440, 428], '(e) 스튜어트-고프 플랫폼 (다리 여섯)', { c: 'em', s: 11.5 });
      return fig(600, 440, '예제 1의 다섯 기구: (a) 평면 4절 링크, (b) 크랭크-슬라이더, (c) 평면 5절 링크, (d) 6R 직렬 팔, (e) 스튜어트-고프 플랫폼',
        s,
        '(a)–(c)는 평면 기구로, 핀은 회전 관절이고 (b)의 슬라이더만 병진 관절입니다. 주황 화살표는 모터가 도는 관절입니다. (d)는 바닥에서 손끝까지 한 줄로 이어진 열린 사슬, (e)는 바닥과 판을 다리 여섯 개가 함께 잡는 병렬 기구로, 다리마다 아래가 유니버설(U), 가운데가 늘어나는 병진(P), 위가 구면(S) 관절입니다.');
    },
    mSlider() {
      return fig(560, 210, '크랭크-슬라이더: 바닥 핀 O에서 도는 크랭크, 연결봉, 레일 위의 슬라이더',
        D.slider([150, 138], 62, true),
        '크랭크가 돌면 연결봉이 슬라이더를 레일 위에서 왕복시킵니다. 관절은 회전 관절 셋(O, A, B)과 슬라이더–레일 사이의 병진 관절 하나이고, 레일은 바닥과 한 링크입니다. 엔진의 피스톤–크랭크축이 이 기구입니다.');
    },
    mFiveBar() {
      return fig(560, 236, '평면 5절 링크: 바닥 핀 두 개에 모터가 있고, 두 팔이 끝점 P에서 만난다',
        D.five([228, 186], 52, true),
        '바닥을 포함해 링크 다섯 개가 회전 관절 다섯 개로 한 고리를 이룹니다. 두 모터 각을 모두 정해야 끝점 P의 위치가 정해지므로, 평면에서 P를 마음대로 옮기는 2자유도 기구가 됩니다.');
    },
    mStephenson() {
      return fig(560, 250, '스티븐슨 6절 링크: 링크 여섯 개, 회전 관절 일곱 개. 핀을 셋 가진 두 링크(바닥 1, 삼각판 3)가 서로 직접 이어지지 않는다',
        D.steph([130, 196], 56, true),
        '번호는 링크입니다. 바닥 1과 삼각판 3이 핀을 셋씩 가진 링크이고 둘은 관절을 공유하지 않습니다(공유하면 와트 6절 링크). 크랭크 2를 돌리면 4절 링크 1–2–3–4가 움직이고, 삼각판의 셋째 꼭짓점이 링크 5와 6을 끌고 다닙니다.');
    },
    m3RRR() {
      return fig(560, 270, '평면 3-RRR 병렬 로봇: 바닥의 세 핀에서 나온 R-R-R 다리 셋이 가운데 삼각판을 잡는다',
        D.rrr3([280, 140], 44, true),
        '다리마다 링크 2개와 회전 관절 3개(바닥–링크, 링크–링크, 링크–판)가 있습니다. 바닥 쪽 관절 셋에 모터를 달면 판의 위치 $(x,y)$와 방향 $\\phi$를 모두 정할 수 있습니다.');
    },
    mSpherical() {
      return fig(600, 250, '구면 4절 링크(왼쪽): 네 회전축이 한 점 O에서 만나고 링크는 O를 중심으로 하는 구면 위에서 움직인다. 오른쪽은 같은 원리의 후크(유니버설) 조인트',
        D.sphere([150, 122], 82, true) + D.hooke([450, 118], 72, true) + tx([150, 244], '(a) 구면 4절 링크', { c: 'em', s: 11.5 }) + tx([440, 244], '(b) 후크 조인트', { c: 'em', s: 11.5 }),
        '(a) 굵은 호가 링크, 점선 호가 바닥이고 작은 원기둥이 회전 관절입니다. 네 축(점선)이 모두 O를 지나므로 모든 점이 O 중심의 구면 위에 머뭅니다 — 평면 기구처럼 $m=3$으로 셉니다. (b) 입력 축, 십자의 두 팔, 출력 축의 네 회전축이 십자의 중심에서 만나는 구면 4절 링크입니다. 비스듬한 두 축 사이로 회전을 전달합니다.');
    },
    mStewart() {
      return fig(560, 250, '스튜어트-고프 플랫폼: 바닥과 판을 길이가 바뀌는 다리 여섯 개가 잇는다. 다리마다 U(아래)–P(가운데)–S(위)',
        D.stewart([280, 196], 118, 128, true),
        '다리는 아래 막대와 위 막대 두 링크로 되어 있고 위 막대가 아래 막대 속으로 미끄러집니다(병진 관절). 여섯 다리의 길이를 정하면 판의 위치와 방향 여섯 개가 정해집니다. 비행 시뮬레이터의 운동 장치가 이 기구입니다.');
    },
    m3UPU() {
      return fig(560, 240, '3-UPU 병렬 기구: 바닥과 판을 다리 셋이 잇고, 다리마다 양 끝은 유니버설 관절, 가운데는 병진 관절',
        D.upu3([280, 188], 120, 122, true),
        '다리 하나는 아래 막대와 위 막대 두 링크입니다. 유니버설 관절은 두 축 둘레로만 돌 수 있어(구면 관절보다 1 적음) 판의 움직임이 스튜어트-고프 플랫폼보다 많이 제한됩니다.');
    },
    mPuma() {
      return fig(560, 250, 'PUMA형 6R 팔(옆모습): 허리 1, 어깨 2, 팔꿈치 3, 손목 4·5·6. 손목의 세 축이 한 점(손목 중심)에서 만난다',
        D.puma([140, 222], 62, true),
        '점 찍힌 원은 축이 화면 밖을 향하는 회전 관절, 원기둥은 축이 화면 안에 놓인 회전 관절, 점선은 관절 축입니다. 앞 세 관절이 손목 중심의 위치를, 손목 세 관절이 손의 방향을 정합니다(16단원 역기구학).');
    },
    mSRS(opt) {
      return fig(560, 240, 'S-R-S 팔(사람 팔 모형): 어깨 구면 관절, 팔꿈치 회전 관절, 손목 구면 관절. 괄호 안은 관절의 자유도',
        D.srs([170, 214], 62, opt !== 'bare'),
        '어깨와 손목의 위치가 정해져도 팔꿈치는 어깨–손목 선(점선) 둘레의 원 위를 돌 수 있습니다. 손의 자세(6)를 바꾸지 않고 남는 이 움직임 하나가 7자유도 팔의 여유 자유도입니다.');
    },
    mStanford() {
      return fig(560, 250, '스탠퍼드형 RRP 팔(옆모습): 기둥이 수직축 둘레로 θ₁, 어깨가 수평축 둘레로 θ₂ 돌고, 팔이 자기 방향으로 s만큼 미끄러진다',
        D.stanford([170, 222], 62, true),
        '어깨에 붙인 {b}는 기둥과 함께 $\\hat z_s$ 둘레로, 그리고 어깨 축 $\\hat x_b$ 둘레로 돕니다. 그래서 각속도가 $\\omega=\\dot\\theta_1\\hat z_s+\\dot\\theta_2\\hat x_b$로 더해지고, 손끝은 팔을 따라 $s\\hat y_b$에 있습니다.');
    },
    mRRR() {
      return fig(560, 230, '공간 RRR 팔(팔꿈치형, 옆모습): 관절 1은 수직축, 관절 2·3은 서로 평행한 수평축(화면 밖)',
        D.rrr([150, 210], 62, true),
        '관절 1이 팔 전체를 수직축 둘레로 돌리고, 관절 2(어깨)와 3(팔꿈치)이 팔을 세운 수직 평면 안에서 굽힙니다. 영 자세(점선)에서 팔은 수평으로 $L_2+L_3$만큼 뻗습니다.');
    },
    mRP() {
      return fig(560, 230, '평면 RP 팔(위에서 본 모습): 바닥 회전 관절 θ₁ 위에서 팔이 자기 방향으로 θ₂만큼 늘어난다',
        D.rp([150, 180], 70, true),
        '영 자세에서 끝점은 $(L_0,0)$이고, 병진 관절이 팔을 $L_0+\\theta_2$로 늘린 뒤 바닥 관절이 $\\theta_1$만큼 돌립니다. 끝점은 극좌표 $\\big((L_0+\\theta_2)\\cos\\theta_1,\\ (L_0+\\theta_2)\\sin\\theta_1\\big)$입니다.');
    },
    mThreeR() {
      return fig(560, 230, '평면 3R 팔: 관절각 θ₁(바닥에서), θ₂, θ₃(앞 링크의 연장선에서 잰 상대각), 링크 길이 L₁, L₂, L₃',
        D.threeR([150, 200], 70, true),
        '세 관절 축이 모두 화면에 수직이라 팔은 평면 안에서만 움직입니다. 끝점의 위치 $(x,y)$와 방향 $\\phi=\\theta_1+\\theta_2+\\theta_3$를 정하는 3자유도 팔입니다.');
    },
    mUR5() {
      return fig(560, 230, 'UR5의 영 자세(교재 예제 4.5의 치수, 단위 m): 관절 1–6과 링크',
        D.ur5([150, 150], 360, true),
        '원기둥이 관절이고 그 긴 방향이 관절 축입니다. 어깨·팔꿈치·손목 1(관절 2, 3, 4)의 축이 서로 평행해 팔이 한 평면 안에서 굽혀지고, 관절 1과 5는 수직축입니다. 13단원 시뮬레이션에서 관절을 직접 돌려 볼 수 있습니다.');
    },
    mCar() {
      return fig(560, 240, '자동차(위에서 본 모습): 뒤축 가운데 (x, y), 진행 방향 φ, 앞바퀴 조향각 ψ',
        D.car([170, 128], 58, true),
        '형상은 $(x,y,\\phi)$ 세 수이지만 바퀴가 옆으로 미끄러지지 않아 뒤축 가운데의 속도는 늘 진행 방향을 향합니다($\\dot x\\sin\\phi-\\dot y\\cos\\phi=0$). 속도 구속이 있어도 갈 수 있는 형상은 줄지 않는 비홀로노믹 구속의 대표입니다.');
    },
    mMobile2R() {
      return fig(560, 250, '평면 이동 로봇 위의 2R 팔(위에서 본 모습): 차체의 (x, y, φ)와 두 관절각 θ₁, θ₂',
        D.mobile([230, 140], 58, true),
        '차체는 평면의 강체라 위치 둘과 방향 하나, 팔은 관절각 둘을 더합니다. 형상을 정하는 수는 $3+2=5$개입니다.');
    },
    mPendulum() {
      return fig(560, 230, '구면 진자(왼쪽)와 레일 위 수레에 매단 구면 진자(오른쪽)',
        D.pend([140, 36], 70, true),
        '(a) 막대 길이가 일정하므로 질점은 고정점 중심의 구면 위에만 있습니다. (b) 수레가 레일을 따라 움직이는 위치 $x$ 하나가 더해집니다.');
    },
    mPin3() {
      return fig(560, 230, '평면 기구의 핀 하나에 링크 세 개가 함께 끼워진 모습',
        D.pinStack([140, 96], 3),
        '세 링크가 같은 핀 둘레로 돌지만, 관절은 언제나 링크 두 개 사이의 상대 운동입니다. 옆에서 보면 판이 핀에 겹겹이 끼워져 이웃한 판끼리 서로 돕니다.');
    },
    mPin4() {
      return fig(560, 236, '평면 기구의 핀 하나에 링크 네 개가 함께 끼워진 모습',
        D.pinStack([140, 98], 4),
        '링크마다 핀 둘레의 방향각이 하나씩 있고, 그중 하나를 기준으로 잡으면 나머지 상대각이 관절 변수입니다.');
    },
    rLoop4() {
      return fig(560, 244, '4절 링크의 고리: 링크 벡터 L₁…L₄를 차례로 더하면 0, 관절각 θ₁…θ₄는 앞 링크의 연장선에서 다음 링크까지 잰 각',
        D.loop4([150, 180], 62, true),
        '관절 1(오른쪽 핀)에서 출발해 $L_1, L_2, L_3$을 지나 바닥 링크 $L_4$로 돌아옵니다. 각 링크의 방향은 $\\theta_1$, $\\theta_1+\\theta_2$, $\\theta_1+\\theta_2+\\theta_3$, $\\theta_1+\\cdots+\\theta_4$이고, 한 바퀴를 돌아 처음 방향($\\hat x$)으로 오므로 네 각의 합이 $2\\pi$입니다.');
    },
    mStand4() {
      return fig(560, 230, '4×RP 카메라 받침대: 판에 회전 관절(R)로 달린 다리 넷이 저마다 늘어나고(P), 발은 바닥에 닿아 있다',
        D.stand4([280, 44], true),
        '다리 하나는 위 막대와 아래 막대 두 링크입니다. 발과 바닥의 접촉을 어떻게 볼지(미끄러지는 점 접촉이면 구속 하나, 미끄러지지 않으면 구면 관절)에 따라 자유도가 달라집니다.');
    },
    mLeg3() {
      return fig(560, 260, '2023년 문제 1(c)의 병렬 기구: 다리 하나(한 수직 평면 안의 닫힌 고리)와 위에서 본 120° 배치',
        D.leg3([330, 214], 46, true),
        '슬라이더(P)–링크 $a$–링크 $b$와, $b$의 중간에서 허브로 가는 링크 $c$가 한 평면 안에서 고리를 이룹니다. 허브는 가운데 기둥을 따라 오르내리고(P), $b$의 끝은 판과 구면 관절(S)로 이어집니다.');
    },
    // 2023 P1 — ellipsoid, 4×RP camera stand, three-leg parallel mechanism
    fm23Mech() {
      let s = D.ellipsoid([92, 116], 76, 34) + tx([92, 236], '(a) 타원체 (반축 R, r, r)', { c: 'em', s: 11 });
      s += D.stand4([268, 52], true) + tx([268, 236], '(b) 4×RP 카메라 받침대', { c: 'em', s: 11 });
      s += D.leg3([508, 196], 33, true) + tx([500, 236], '(c) 병렬 기구의 다리 하나와 배치', { c: 'em', s: 11 });
      return fig(640, 248, '2023년 문제 1의 세 대상: 균일한 타원체, 다리 넷이 RP 사슬인 카메라 받침대, 평면 닫힌 고리 다리 셋으로 된 병렬 기구',
        s,
        '(b) 다리마다 판에 회전 관절(R), 다리 안에 병진 관절(P)이 있고 발은 바닥에 닿아 있습니다. (c) 다리 하나: 반지름 방향 레일 위의 슬라이더(P), 링크 $a$, 링크 $b$, 그리고 $b$의 중간에서 가운데 허브로 가는 링크 $c$가 한 수직 평면 안에서 닫힌 고리를 이룹니다. 허브는 기둥을 따라 오르내리고(P), $b$의 끝은 판과 구면 관절(S)로 이어집니다. 이런 다리 셋이 120° 간격으로 놓입니다.');
    },
    // 2024 P1 — two tumblers, the dual-arm robot unscrewing the lid (with the camera of (d)), the tumbler on a table (e, f)
    fm24Tumbler() {
      let s = D.tumb(52, 200, 1, true) + D.tumb(132, 200, 1, false);
      s += L(132, 92, 132, 214, 'dm ds') + earc([132, 122], 21, 6, 200, 520, 'rx') + A2(106, 96, 106, 132, 'rx', 6);
      s += tx([52, 222], '(a) 나사 뚜껑', { c: 'em', s: 10.5 }) + tx([52, 236], '로고·구멍', { s: 10.5 }) + tx([132, 222], '(b) 매끈한 뚜껑', { c: 'em', s: 10.5 }) + tx([132, 236], '무늬 없음', { s: 10.5 });
      // (c)(d): torso fixed above, two S-R-S arms, the tumbler held between the hands
      const c = [322, 196], a = 18, rot = (dx) => [c[0] + dx * Math.cos(rad(a)), c[1] - dx * Math.sin(rad(a))];
      s += poly([[262, 40], [382, 40], [370, 96], [274, 96]], 'rg') + poly([[262, 40], [382, 40], [370, 96], [274, 96]], 'gd') + ground(262, 382, 40, false) + tx([322, 74], '몸통(고정)', { s: 10.5 });
      const bt = rot(-46);
      s += `<g transform="rotate(${90 - a} ${f1(bt[0])} ${f1(bt[1])})">${D.tumb(bt[0], bt[1], 1, true)}</g>`;
      const g1 = rot(-28), g2 = rot(33), S1 = [272, 52], S2 = [372, 52], E1 = [232, 128], E2 = [412, 108], W1 = add(g1, [-12, -20]), W2 = add(g2, [8, -24]);
      s += bar(S1, E1) + bar(E1, W1) + bar(W1, g1, 'gd') + bar(S2, E2) + bar(E2, W2) + bar(W2, g2, 'gd');
      s += ball(S1, 8) + out(E1, 7) + ball(W1, 7) + ball(S2, 8) + out(E2, 7) + ball(W2, 7);
      s += tx(add(S1, [-12, 4]), 'S', { a: 'end', c: 'em' }) + tx(add(E1, [-12, 4]), 'R', { a: 'end', c: 'em' }) + tx(add(W1, [-12, 2]), 'S', { a: 'end', c: 'em' }) + tx(add(S2, [12, 4]), 'S', { a: 'start', c: 'em' }) + tx(add(E2, [12, 4]), 'R', { a: 'start', c: 'em' }) + tx(add(W2, [12, 0]), 'S', { a: 'start', c: 'em' });
      const cam = (p) => R(p[0] - 11, p[1] - 7, 22, 14, 'jt') + C(p[0] - 11, p[1], 4.5, 'sp');
      const com = rot(-11), cm = [456, 96], dir = [com[0] - cm[0], com[1] - cm[1]];
      s += cam(cm) + L(cm[0] - 11, cm[1], com[0] + 0.35 * dir[0], com[1] + 0.35 * dir[1], 'dm ds') + C(com[0], com[1], 3, 'dotf') + tx([cm[0], cm[1] - 14], '카메라 (d)', { s: 10.5 });
      s += tx([322, 236], '(c) 뚜껑을 여는 두 팔 로봇, (d) 시선', { c: 'em', s: 10.5 });
      // (e)(f): the tumbler standing on a table, an oblique and a level line of sight through its centre of mass
      s += poly([[486, 214], [606, 214], [634, 188], [514, 188]], 'rg') + poly([[486, 214], [606, 214], [634, 188], [514, 188]], 'gd') + D.tumb(556, 202, 0.92, true);
      const cg = [556, 202 - 0.92 * 35], c1 = [606, 104], c2 = [606, cg[1]];
      s += cam(c1) + L(c1[0] - 11, c1[1], cg[0] - 0.5 * (c1[0] - cg[0]), cg[1] + 0.5 * (cg[1] - c1[1]), 'dm ds') + cam(c2) + L(c2[0] - 11, c2[1], 500, cg[1], 'dm ds') + C(cg[0], cg[1], 3, 'dotf');
      s += tx([c1[0], c1[1] - 14], '(e)', { s: 10.5 }) + tx([c2[0], c2[1] - 14], '(f)', { s: 10.5 });
      s += tx([560, 236], '(e)(f) 탁자 위에 선 텀블러', { c: 'em', s: 10.5 });
      return fig(640, 248, '2024년 문제 1: 두 가지 텀블러, 뚜껑을 여는 두 팔 로봇과 카메라 시선, 탁자 위에 선 텀블러와 두 가지 시선',
        s,
        '(a) 몸통의 로고로 축 둘레 회전도 구별되고, 뚜껑은 나사로 돌면서 올라갑니다. (b) 무늬가 없어 축 둘레 회전은 구별되지 않고, 뚜껑은 축을 따라 돌고 미끄러질 수 있습니다. (c) 몸통이 고정된 로봇의 두 팔(어깨 S, 팔꿈치 R, 손목 S)이 각각 텀블러 몸통과 뚜껑을 단단히 잡습니다. (d) 텀블러의 질량 중심(점)이 고정된 카메라의 시선 위에 있어야 합니다. (e)(f) 텀블러 바닥이 탁자에 닿아 있고, 시선이 (e) 비스듬하거나 (f) 탁자와 나란합니다(팔은 (c)와 같아 생략).');
    },
  });
})();
