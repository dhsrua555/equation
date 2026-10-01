/* 로봇공학 시뮬레이션 B — 파지: 평면 파지 실험실(힘 닫힘 판정, 외력에 맞서는 접촉력, 과제 문제 배치)과 마찰 원뿔.
   힘 닫힘은 “접촉 렌치 열들의 계수가 3이고 모든 성분이 양수인 k로 Ak = 0”을 선형 계획법으로 판정합니다(SimKit.closure). */
(function () {
  const SK = window.SimKit;
  if (!SK) return;
  const S = (window.SITE_SIMS = window.SITE_SIMS || {});
  const PI = Math.PI, TAU = 2 * PI, R2 = Math.SQRT2, R3 = Math.sqrt(3);
  const deg = (r) => (r * 180) / PI;
  const unit = (v) => { const n = Math.hypot(v[0], v[1]) || 1; return [v[0] / n, v[1] / n]; };

  // ---------- polygon geometry (vertices counter-clockwise) ----------
  function poly(verts) {
    const n = verts.length;
    const edges = verts.map((a, i) => {
      const b = verts[(i + 1) % n], d = unit([b[0] - a[0], b[1] - a[1]]);
      return { a, b, d, n: [-d[1], d[0]], len: Math.hypot(b[0] - a[0], b[1] - a[1]) };
    });
    const reflex = verts.map((_, i) => { const e1 = edges[(i - 1 + n) % n].d, e2 = edges[i].d; return e1[0] * e2[1] - e1[1] * e2[0] < -1e-9; });
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    verts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    return { verts, edges, reflex, box: [x0, x1, y0, y1], size: Math.max(x1 - x0, y1 - y0) };
  }
  const posOf = (G, c) => (c.v != null ? G.verts[c.v] : [G.edges[c.e].a[0] + c.t * (G.edges[c.e].b[0] - G.edges[c.e].a[0]), G.edges[c.e].a[1] + c.t * (G.edges[c.e].b[1] - G.edges[c.e].a[1])]);
  // directions a contact can push along: the normal (frictionless) or the two edges of its friction cone; a concave corner pushes on both faces
  function dirsOf(G, c) {
    const faces = c.v != null ? [G.edges[(c.v - 1 + G.verts.length) % G.verts.length], G.edges[c.v]] : [G.edges[c.e]];
    const out = [];
    faces.forEach((f) => {
      if (!(c.mu > 0)) out.push(f.n);
      else { out.push(unit([f.n[0] + c.mu * f.d[0], f.n[1] + c.mu * f.d[1]])); out.push(unit([f.n[0] - c.mu * f.d[0], f.n[1] - c.mu * f.d[1]])); }
    });
    return out;
  }
  const inwardOf = (G, c) => (c.v != null ? unit([G.edges[(c.v - 1 + G.verts.length) % G.verts.length].n[0] + G.edges[c.v].n[0], G.edges[(c.v - 1 + G.verts.length) % G.verts.length].n[1] + G.edges[c.v].n[1]]) : G.edges[c.e].n);
  const wrench = (r, u) => [u[0], u[1], r[0] * u[1] - r[1] * u[0]];
  function regular(n) {
    const v = [];
    for (let k = 0; k < n; k++) { const a = -PI / 2 - PI / n + (TAU * k) / n; v.push([Math.cos(a), Math.sin(a)]); }
    return v;
  }

  // ---------- presets: unit examples and the problem-set grasps (MR Exercises 12.15–12.20) ----------
  const PRESETS = {
    nails4: { name: '못 네 개 (마찰 없음)', verts: [[-1, -0.6], [1, -0.6], [1, 0.6], [-1, 0.6]],
      contacts: [{ e: 2, t: 0.3, mu: 'g', name: '1' }, { e: 1, t: 0.85 / 1.2, mu: 'g', name: '2' }, { e: 0, t: 0.35, mu: 'g', name: '3' }, { e: 3, t: 0.8 / 1.2, mu: 'g', name: '4' }],
      main: { label: '모든 접촉의 μ', min: 0, max: 1, step: 0.01, value: 0 } },
    tri2: { name: '정삼각형, 두 손가락', verts: [[-1, 0], [1, 0], [0, R3]],
      contacts: [{ e: 2, t: (R3 - 0.6) / R3, mu: 'g', name: '1' }, { e: 1, t: 0.6 / R3, mu: 'g', name: '2' }],
      main: { label: '두 접촉의 μ', min: 0, max: 1.2, step: 0.01, value: 0.7 } },
    ps1215: { name: '과제 1 · 연습문제 12.15 (정사각형, 마찰 없는 접촉 5개)', verts: [[2 * R2, 0], [0, 2 * R2], [-2 * R2, 0], [0, -2 * R2]],
      contacts: [{ e: 0, t: 0.5, mu: 'g', name: 'f₁' }, { e: 1, t: 0.5, mu: 'g', name: 'f₂' }, { e: 2, t: 0.25, mu: 'g', name: 'f₃' }, { e: 2, t: 0.5, mu: 'g', name: 'f₄' }, { e: 3, t: 0.5, mu: 'g', name: 'f₅' }],
      main: { label: '모든 접촉의 μ', min: 0, max: 1, step: 0.01, value: 0 } },
    ps1217: { name: '과제 2 · 연습문제 12.17 (L자 물체, 두 마찰 접촉)', verts: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]],
      contacts: [{ e: 5, t: 0.5, mu: 1, name: '1' }, { v: 3, mu: 'g', name: '2' }],
      main: { label: '접촉 2의 μ', min: 0, max: 1.5, step: 0.01, value: 1 },
      extra: [{ label: '접촉 1의 높이 x (L = 1)', min: 0.05, max: 1.95, step: 0.01, value: 1, apply: (v, P) => { const c = P.contacts[0]; c.e = 5; c.v = null; c.t = (2 - v) / 2; }, read: (P) => { const c = P.contacts[0]; return c.e === 5 && c.v == null ? 2 - 2 * c.t : null; } }] },
    ps1218: { name: '과제 3 · 연습문제 12.18 (정사각형, 접촉 3개)', verts: [[-0.5, 0], [0.5, 0], [0.5, 1], [-0.5, 1]],
      contacts: [{ e: 0, t: 0.5, mu: 'g', name: 'f₁' }, { e: 2, t: 0.25, mu: 0, name: 'f₂' }, { e: 1, t: 0.5, mu: 0, name: 'f₃' }],
      main: { label: 'f₁의 μ', min: 0, max: 1.5, step: 0.01, value: 0.4 },
      extra: [
        { label: 'c (f₂의 위치)', min: -0.45, max: 0.45, step: 0.01, value: 0.25, apply: (v, P) => { const c = P.contacts[1]; c.e = 2; c.t = 0.5 - v; }, read: (P) => (P.contacts[1].e === 2 ? 0.5 - P.contacts[1].t : null) },
        { label: 'h (f₃의 높이)', min: 0.05, max: 0.95, step: 0.01, value: 0.5, apply: (v, P) => { const c = P.contacts[2]; c.e = 1; c.t = v; }, read: (P) => (P.contacts[2].e === 1 ? P.contacts[2].t : null) },
      ] },
    ps1219a: { name: '과제 4(a) · 연습문제 12.19(a) (삼각형)', verts: [[-2, 0], [2, 0], [0, 2]],
      contacts: [{ e: 2, t: 0.5, mu: 'g', name: 'A' }, { e: 1, t: 0.5, mu: 'g', name: 'B' }, { e: 0, t: 0.5, mu: 0, name: 'C' }],
      main: { label: 'A, B의 μ', min: 0, max: 1.5, step: 0.01, value: 1 } },
    ps1219b: { name: '과제 4(b) · 연습문제 12.19(b) (집 모양)', verts: [[-2, 0], [2, 0], [2, 1], [0, 3], [-2, 1]],
      contacts: [{ e: 3, t: 0.5, mu: 0, name: 'A' }, { e: 2, t: 0.5, mu: 0, name: 'B' }, { e: 0, t: 0.5, mu: 'g', name: 'C' }],
      main: { label: 'C의 원뿔 반각 β', min: 0, max: 80, step: 1, value: 20, fmt: (v) => `${v.toFixed(0)}°`, toMu: (v) => Math.tan((v * PI) / 180) } },
    ps1220: { name: '과제 5 · 연습문제 12.20 (정n각형, 두 손가락)', n: 5,
      build(P) {
        const n = P.n, v = regular(n), G = poly(v);
        const c1 = { e: 0, t: 0.35, mu: 'g', name: '1' }, p1 = posOf(G, c1), a = PI / 2 - PI / (2 * n), d = [Math.cos(a), Math.sin(a)];
        let best = null;
        G.edges.forEach((E, j) => { // ray p1 + s d against edge j
          const ex = E.b[0] - E.a[0], ey = E.b[1] - E.a[1], den = d[0] * ey - d[1] * ex;
          if (Math.abs(den) < 1e-12 || j === 0) return;
          const s = ((E.a[0] - p1[0]) * ey - (E.a[1] - p1[1]) * ex) / den, t = ((E.a[0] - p1[0]) * d[1] - (E.a[1] - p1[1]) * d[0]) / den;
          if (s > 1e-6 && t > 0 && t < 1 && (!best || s < best.s)) best = { s, e: j, t };
        });
        P.verts = v;
        P.contacts = [c1, { e: best.e, t: best.t, mu: 'g', name: '2' }];
      },
      main: { label: '두 접촉의 μ', min: 0, max: 1, step: 0.005, value: 0.3, fmt: (v) => v.toFixed(3) },
      extra: [{ label: '변의 수 n (홀수)', min: 3, max: 15, step: 2, value: 5, fmt: (v) => v.toFixed(0), rebuild: true, apply: (v, P) => { P.n = v; } }] },
  };
  const PRESET_ORDER = ['nails4', 'tri2', 'ps1215', 'ps1217', 'ps1218', 'ps1219a', 'ps1219b', 'ps1220'];

  S.grasp = {
    title: '평면 파지 실험실: 힘 닫힘',
    ch: 'ch03', k: '12.2.3',
    desc: '물체의 테두리에 손가락(접촉)을 놓고 마찰 계수를 바꾸며 **힘 닫힘**인지 바로 확인합니다. 마찰 없는 접촉은 법선 방향 렌치 하나, 마찰 접촉은 마찰 원뿔의 두 모서리 렌치를 열로 만들고, “계수 3이고 모든 성분이 양수인 $k$로 $Ak=0$”을 선형 계획법으로 판정합니다. 가운데 기준점의 손잡이를 끌면 외력을 걸 수 있고, 그 외력을 버티는 데 필요한 접촉력(가장 작은 합)이 화살표로 나타납니다. 과제 문제의 배치도 골라 볼 수 있습니다.',
    tries: [
      '‘못 네 개’에서 접촉을 테두리를 따라 끌어 보세요. 네 법선이 한 점을 지나게 하면(모두 가운데로) 순수 모멘트를 못 버텨 힘 닫힘이 깨집니다.',
      '‘버틸 수 없는 외력 걸어 보기’를 누르면, 힘 닫힘이 아닐 때 어떤 외력이 물체를 빼내는지 보여 줍니다.',
      '‘정삼각형, 두 손가락’에서 μ를 0.58(= tan 30°) 아래로 내려 보세요. 두 접촉을 잇는 선(응우옌 선)이 원뿔 밖으로 나가며 힘 닫힘이 깨집니다.',
      '과제 1(12.15)에서 ‘접촉 추가’로 여섯째 접촉을 넣고 테두리를 따라 옮겨 보세요. 힘 닫힘이 되는 곳이 각 변의 절반씩입니다.',
      '과제 2(12.17)에서 접촉 2의 μ를 0으로 하고 x를 1보다 조금 내려 보세요. 과제의 (b)와 (c)가 그대로 보입니다.',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.62, min: 300, max: 500, label: '평면 파지' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const ctrl3 = SK.panel(stage);
      const out = SK.out(stage);
      const mat = SK.out(stage, 'sim-mat');
      const P = { key: PRESETS[arg] ? arg : 'nails4', verts: null, contacts: [], gmu: 0, n: 5, sel: -1, ext: [0, 0], mext: 0, show: { cone: true, lines: false, internal: false } };
      let G = null, res = null, sliders = [];
      const muOf = (c) => (c.mu === 'g' ? P.gmu : c.mu);
      const load = (key) => {
        const pr = PRESETS[key];
        P.key = key; P.sel = -1; P.ext = [0, 0]; P.mext = 0;
        P.gmu = pr.main.toMu ? pr.main.toMu(pr.main.value) : pr.main.value;
        if (pr.build) { P.n = pr.n; pr.build(P); } else { P.verts = pr.verts.map((v) => v.slice()); P.contacts = pr.contacts.map((c) => Object.assign({}, c)); }
        G = poly(P.verts);
        buildCtrl();
        solve();
      };
      const cols = () => {
        const list = [];
        P.contacts.forEach((c, i) => { const r = posOf(G, c); dirsOf(G, Object.assign({}, c, { mu: muOf(c) })).forEach((u) => list.push({ i, u, r, w: wrench(r, u) })); });
        return list;
      };
      // an external wrench no grasp force can answer (Farkas): any y with y·a ≥ 0 for every column a.
      // The candidates are the face normals of the cone of columns (cross products of two columns) and the axes.
      const escape = (C) => {
        const Wc = C.map((c) => c.w), E = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], cand = E.slice();
        Wc.forEach((a, i) => { for (let j = i + 1; j < Wc.length; j++) cand.push(SK.V.cross(a, Wc[j])); E.forEach((e) => cand.push(SK.V.cross(a, e))); });
        let best = null;
        cand.forEach((u0) => {
          const n = Math.hypot(...u0);
          if (n < 1e-9) return;
          [1, -1].forEach((s) => {
            const u = u0.map((v) => (s * v) / n);
            let mn = Infinity;
            Wc.forEach((a) => { mn = Math.min(mn, (u[0] * a[0] + u[1] * a[1] + u[2] * a[2]) / (Math.hypot(...a) || 1)); });
            if (mn >= -1e-9 && (!best || mn > best.mn + 1e-12)) best = { mn, u };
          });
        });
        return best ? best.u : null;
      };
      const solve = () => {
        const C = cols();
        const cl = SK.closure(C.map((c) => c.w), 3);
        let ans = null;
        const we = [P.ext[0], P.ext[1], P.mext];
        if (C.length && (we[0] || we[1] || we[2])) {
          const A = [0, 1, 2].map((r) => C.map((c) => c.w[r]));
          const lp = SK.lp(A, we.map((v) => -v), C.map(() => 1));
          ans = lp.status === 'optimal' ? lp.x : 'none';
        }
        res = { C, cl, load: ans };
        st.req(); report();
      };
      const box = () => { const b = G.box, m = G.size * 0.3; return [b[0] - m, b[1] + m, b[2] - m, b[3] + m]; };

      st.draw = (ctx, w, h, Cc) => {
        if (!G || !res) return;
        const M = SK.fitMap(w, h, box(), 10), X = M.X, Y = M.Y, sz = G.size;
        // body
        ctx.fillStyle = Cc.paper2; ctx.strokeStyle = Cc.ink; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
        ctx.beginPath(); P.verts.forEach((v, i) => (i ? ctx.lineTo(X(v[0]), Y(v[1])) : ctx.moveTo(X(v[0]), Y(v[1])))); ctx.closePath(); ctx.fill(); ctx.stroke();
        // reference frame (moments are taken about it)
        SK.arrow(ctx, X(0), Y(0), X(0) + 26, Y(0), Cc.x, 1.6, 7); SK.arrow(ctx, X(0), Y(0), X(0), Y(0) - 26, Cc.y, 1.6, 7);
        const C = res.C;
        // lines of action
        if (P.show.lines) {
          ctx.save(); ctx.setLineDash([5, 5]); ctx.lineWidth = 1;
          C.forEach((c) => { ctx.strokeStyle = SK.alpha(Cc.blue, 0.55); SK.line(ctx, X(c.r[0] - 3 * sz * c.u[0]), Y(c.r[1] - 3 * sz * c.u[1]), X(c.r[0] + 3 * sz * c.u[0]), Y(c.r[1] + 3 * sz * c.u[1])); });
          ctx.restore();
        }
        // Nguyen line for two frictional contacts
        const fr = P.contacts.filter((c) => muOf(c) > 0);
        if (P.contacts.length === 2 && fr.length === 2) {
          const a = posOf(G, P.contacts[0]), b = posOf(G, P.contacts[1]);
          ctx.strokeStyle = res.cl.closure ? Cc.ok : Cc.bad; ctx.lineWidth = 2; ctx.setLineDash([7, 5]); SK.line(ctx, X(a[0]), Y(a[1]), X(b[0]), Y(b[1])); ctx.setLineDash([]);
        }
        // cones / normals and fingers
        P.contacts.forEach((c, i) => {
          const r = posOf(G, c), n = inwardOf(G, c), mu = muOf(c), sel = i === P.sel;
          const L = sz * 0.2;
          if (P.show.cone) {
            const faces = c.v != null ? [G.edges[(c.v - 1 + P.verts.length) % P.verts.length], G.edges[c.v]] : [G.edges[c.e]];
            faces.forEach((f) => {
              if (mu > 0) {
                const al = Math.atan(mu), a0 = Math.atan2(f.n[1], f.n[0]);
                ctx.fillStyle = SK.alpha(Cc.acc, 0.22); ctx.strokeStyle = SK.alpha(Cc.acc, 0.9); ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(X(r[0]), Y(r[1]));
                for (let k = 0; k <= 16; k++) { const t = a0 - al + (2 * al * k) / 16; ctx.lineTo(X(r[0] + L * Math.cos(t)), Y(r[1] + L * Math.sin(t))); }
                ctx.closePath(); ctx.fill(); ctx.stroke();
              } else SK.arrow(ctx, X(r[0]), Y(r[1]), X(r[0] + L * 0.8 * f.n[0]), Y(r[1] + L * 0.8 * f.n[1]), SK.alpha(Cc.acc, 0.95), 1.8, 8);
            });
          }
          const fc = [r[0] - n[0] * sz * 0.055, r[1] - n[1] * sz * 0.055];
          SK.dot(ctx, X(fc[0]), Y(fc[1]), sz * 0.05 * M.s, sel ? SK.alpha(Cc.acc, 0.45) : SK.alpha(Cc.ink3, 0.28), sel ? Cc.acc : Cc.ink2, sel ? 2.4 : 1.4);
          SK.dot(ctx, X(r[0]), Y(r[1]), 3.5, Cc.ink, null);
          SK.text(ctx, c.name, X(r[0] - n[0] * sz * 0.16), Y(r[1] - n[1] * sz * 0.16), { c: sel ? Cc.accInk : Cc.ink, s: 13, w: 700, a: 'center', halo: Cc.paper });
        });
        // contact forces answering the external load (or the internal squeeze)
        const fscale = sz * 0.22;
        const drawForces = (x, col) => {
          const per = P.contacts.map(() => [0, 0]);
          C.forEach((c, j) => { per[c.i][0] += x[j] * c.u[0]; per[c.i][1] += x[j] * c.u[1]; });
          per.forEach((f, i) => { const r = posOf(G, P.contacts[i]); if (Math.hypot(f[0], f[1]) > 1e-6) SK.arrow(ctx, X(r[0] - fscale * f[0]), Y(r[1] - fscale * f[1]), X(r[0]), Y(r[1]), col, 3, 11); });
        };
        if (Array.isArray(res.load)) drawForces(res.load, Cc.ok);
        else if (P.show.internal && res.cl.k && res.cl.closure) { const s = 1 / Math.max(...res.cl.k); drawForces(res.cl.k.map((v) => v * s), Cc.blue2); }
        // external load at the reference point
        const ex = P.ext;
        if (Math.hypot(ex[0], ex[1]) > 1e-6) SK.arrow(ctx, X(0), Y(0), X(fscale * ex[0]), Y(fscale * ex[1]), res.load === 'none' ? Cc.bad : Cc.blue, 3, 11);
        if (Math.abs(P.mext) > 1e-6) {
          const rr = sz * 0.12 * M.s, sgn = Math.sign(P.mext), a0 = -0.3, a1 = a0 + sgn * Math.min(Math.abs(P.mext) / sz, 1) * 4.6;
          ctx.strokeStyle = res.load === 'none' ? Cc.bad : Cc.blue; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(X(0), Y(0), rr, -a0, -a1, sgn > 0); ctx.stroke();
          const ex2 = X(0) + rr * Math.cos(a1), ey2 = Y(0) - rr * Math.sin(a1);
          SK.arrow(ctx, ex2 + 6 * sgn * Math.sin(a1), ey2 + 6 * sgn * Math.cos(a1), ex2, ey2, res.load === 'none' ? Cc.bad : Cc.blue, 2.4, 9);
        }
        SK.dot(ctx, X(fscale * ex[0]), Y(fscale * ex[1]), 6, Cc.paper3, Cc.blue, 2);
        SK.text(ctx, '외력 손잡이', X(fscale * ex[0]) + 10, Y(fscale * ex[1]) - 10, { c: Cc.ink3, s: 10.5, halo: Cc.paper });
        SK.text(ctx, res.cl.closure ? '힘 닫힘 ✓' : '힘 닫힘 아님 ✗', 12, 16, { c: res.cl.closure ? Cc.ok : Cc.bad, s: 13, w: 700 });
        if (res.load === 'none') SK.text(ctx, '이 외력은 버틸 수 없음', 12, 34, { c: Cc.bad, s: 12, w: 600 });
      };

      const report = () => {
        const { C, cl, load } = res;
        const nf = P.contacts.filter((c) => !(muOf(c) > 0)).length, nr = P.contacts.length - nf;
        let html = `<div class="row">${SK.badge(cl.closure, '힘 닫힘', '힘 닫힘 아님')}<span>접촉 ${P.contacts.length}개(마찰 없음 ${nf}, 마찰 ${nr}) → 렌치 열 ${C.length}개, ${SK.tex(`\\operatorname{rank}A=${cl.rank}`)}</span></div>`;
        if (cl.rank < 3) html += `<div class="row"><span>계수가 3보다 작아 어떤 방향의 렌치(모멘트나 힘)를 아예 만들 수 없습니다.</span></div>`;
        else if (!cl.closure) html += `<div class="row"><span>계수는 3이지만 모든 성분이 양수인 ${SK.tex('k')}로 ${SK.tex('Ak=0')}을 만들 수 없습니다 — 열들의 볼록 껍질이 원점을 안에 품지 못합니다(원점이 경계 위 또는 밖).</span></div>`;
        else html += `<div class="row"><span>외력 없이 서로 밀어 붙이는 내력 ${SK.tex('Ak=0,\\ k>0')}이 있습니다. ‘내력 보기’를 켜면 그 접촉력이 보입니다.</span></div>`;
        if (P.contacts.length === 2 && P.contacts.every((c) => muOf(c) > 0)) {
          const a = posOf(G, P.contacts[0]), b = posOf(G, P.contacts[1]), d = unit([b[0] - a[0], b[1] - a[1]]);
          const ang = (c, v) => { const n = inwardOf(G, c); return deg(Math.acos(Math.max(-1, Math.min(1, n[0] * v[0] + n[1] * v[1])))); };
          const g1 = ang(P.contacts[0], d), g2 = ang(P.contacts[1], [-d[0], -d[1]]);
          html += `<div class="row"><span>응우옌: 두 접촉을 잇는 선과 법선의 각 ${SK.tex(`${g1.toFixed(1)}^\\circ,\\ ${g2.toFixed(1)}^\\circ`)} vs 원뿔 반각 ${SK.tex(`\\alpha=\\tan^{-1}\\mu=${deg(Math.atan(muOf(P.contacts[0]))).toFixed(1)}^\\circ`)}</span></div>`;
        }
        if (P.key === 'ps1220') html += `<div class="row"><span>정${P.n}각형의 최소 마찰 계수 ${SK.tex(`\\mu_{\\min}=\\tan\\frac{\\pi}{2n}=${Math.tan(PI / (2 * P.n)).toFixed(3)}`)}</span></div>`;
        if (load === 'none') html += `<div class="row"><b style="color:var(--bad)">외력 ${SK.tex(`(${P.ext[0].toFixed(2)},\\ ${P.ext[1].toFixed(2)},\\ m=${P.mext.toFixed(2)})`)}을 버틸 접촉력이 없습니다 — 물체가 움직입니다.</b></div>`;
        else if (Array.isArray(load)) html += `<div class="row"><span>외력 ${SK.tex(`(${P.ext[0].toFixed(2)},\\ ${P.ext[1].toFixed(2)},\\ m=${P.mext.toFixed(2)})`)}을 버티는 접촉력(초록, 크기의 합이 가장 작은 해): 합 ${SK.tex(`\\sum x_i=${load.reduce((s, v) => s + v, 0).toFixed(2)}`)}</span></div>`;
        out.innerHTML = html;
        // the matrix and its reduced row echelon form
        if (C.length && C.length <= 12) {
          const A = [0, 1, 2].map((r) => C.map((c) => c.w[r]));
          const rr = SK.M.rref(A);
          const firstI = rr.rank === 3 && rr.pivots.join() === '0,1,2';
          mat.innerHTML = `<div class="row"><span>${SK.tex(`A=${SK.texMat(A, 2)}`)}</span></div>
            <div class="row"><span>${SK.tex(`${firstI ? '[\\,I\\ \\ S\\,]' : '\\mathrm{rref}(A)'}=${SK.texMat(rr.R, 2)}`)}</span></div>
            <div class="sim-note">열 순서: ${C.map((c) => P.contacts[c.i].name).join(', ')} (마찰 접촉은 원뿔 모서리 두 열). 열의 크기(정규화)는 판정에 영향이 없습니다. ${firstI && C.length > 3 ? '열이 4개인 경우: S의 성분이 모두 음수이면 힘 닫힘입니다.' : ''}</div>`;
        } else mat.innerHTML = '';
      };

      const buildCtrl = () => {
        const pr = PRESETS[P.key];
        ctrl2.innerHTML = ''; ctrl3.innerHTML = ''; sliders = [];
        const m = pr.main;
        SK.slider(ctrl2, { label: m.label, min: m.min, max: m.max, step: m.step, value: m.value, fmt: m.fmt || ((v) => v.toFixed(2)), on: (v) => { P.gmu = m.toMu ? m.toMu(v) : v; solve(); } });
        (pr.extra || []).forEach((x) => {
          const s = SK.slider(ctrl2, { label: x.label, min: x.min, max: x.max, step: x.step, value: x.value, fmt: x.fmt || ((v) => v.toFixed(2)), on: (v) => { x.apply(v, P); if (x.rebuild) { pr.build(P); G = poly(P.verts); P.sel = -1; } solve(); selRow(); } });
          sliders.push({ x, s });
        });
        SK.btn(ctrl3, '접촉 추가', () => {
          const e = G.edges.reduce((bi, E, i, arr) => (E.len > arr[bi].len ? i : bi), 0);
          P.contacts.push({ e, t: 0.62, mu: 0, name: `+${P.contacts.length + 1}` }); P.sel = P.contacts.length - 1; solve(); selRow();
        });
        SK.btn(ctrl3, '버틸 수 없는 외력 걸어 보기', () => {
          const u = escape(res.C);
          if (!u) { P.ext = [0, 0]; P.mext = 0; solve(); flash('지금 배치는 힘 닫힘이라 버티지 못할 외력이 없습니다'); return; }
          const s = 1 / Math.max(Math.hypot(u[0], u[1]), Math.abs(u[2]) / (G.size / 2), 1e-9);
          P.ext = [u[0] * s, u[1] * s]; P.mext = u[2] * s; mom.set(P.mext, true); solve();
        });
        SK.btn(ctrl3, '외력 지우기', () => { P.ext = [0, 0]; P.mext = 0; mom.set(0, true); solve(); });
        const mom = SK.slider(ctrl3, { label: '외부 모멘트 m', min: -2 * G.size / 2, max: 2 * G.size / 2, step: 0.01, value: 0, fmt: (v) => v.toFixed(2), on: (v) => { P.mext = v; solve(); } });
        SK.check(ctrl3, '원뿔·법선', P.show.cone, (v) => { P.show.cone = v; st.req(); });
        SK.check(ctrl3, '작용선', P.show.lines, (v) => { P.show.lines = v; st.req(); });
        SK.check(ctrl3, '내력 보기', P.show.internal, (v) => { P.show.internal = v; st.req(); });
        selRow();
      };
      let selBox = null;
      const selRow = () => {
        if (selBox) selBox.remove();
        selBox = SK.el('div', 'sim-ctrl');
        ctrl3.after(selBox);
        const c = P.contacts[P.sel];
        if (!c) { selBox.innerHTML = '<span class="sim-note">접촉을 끌어 테두리를 따라 옮기세요. 누르면 선택되어 마찰을 바꾸거나 지울 수 있습니다.</span>'; return; }
        selBox.appendChild(SK.el('span', 'sim-note', `선택: <b>${c.name}</b>`));
        SK.seg(selBox, { label: '이 접촉', options: [['0', '마찰 없음'], ['g', '마찰 있음 (위 μ)']], value: c.mu === 'g' ? 'g' : '0', on: (v) => { c.mu = v === 'g' ? 'g' : 0; solve(); } });
        SK.btn(selBox, '이 접촉 지우기', () => { P.contacts.splice(P.sel, 1); P.sel = -1; solve(); selRow(); });
      };
      let flashT = 0;
      const flash = (msg) => { const n = SK.el('div', 'sim-note', msg); out.prepend(n); clearTimeout(flashT); flashT = setTimeout(() => n.remove(), 2600); };

      SK.select(ctrl, { label: '배치', options: PRESET_ORDER.map((k) => [k, PRESETS[k].name]), value: P.key, on: (v) => load(v) });
      load(P.key);

      // dragging: contacts slide along the boundary (and snap into concave corners); the load handle sets the external force
      SK.drag(st, {
        pick(x, y) {
          const M = SK.fitMap(st.w, st.h, box(), 10), sz = G.size, fs = sz * 0.22;
          if (Math.hypot(x - M.X(fs * P.ext[0]), y - M.Y(fs * P.ext[1])) < 13) return 'ext';
          let best = -1, bd = 22;
          P.contacts.forEach((c, i) => {
            const r = posOf(G, c), n = inwardOf(G, c), fc = [r[0] - n[0] * sz * 0.055, r[1] - n[1] * sz * 0.055];
            const d = Math.min(Math.hypot(x - M.X(r[0]), y - M.Y(r[1])), Math.hypot(x - M.X(fc[0]), y - M.Y(fc[1])));
            if (d < bd) { bd = d; best = i; }
          });
          return best >= 0 ? best : null;
        },
        start(hd) { if (hd !== 'ext') { P.sel = hd; selRow(); st.req(); } },
        move(hd, x, y) {
          const M = SK.fitMap(st.w, st.h, box(), 10), wx = M.ix(x), wy = M.iy(y);
          if (hd === 'ext') { const fs = G.size * 0.22; P.ext = [wx / fs, wy / fs]; solve(); return; }
          const c = P.contacts[hd];
          let best = null;
          G.edges.forEach((E, i) => {
            const ex = E.b[0] - E.a[0], ey = E.b[1] - E.a[1];
            let t = ((wx - E.a[0]) * ex + (wy - E.a[1]) * ey) / (ex * ex + ey * ey);
            t = Math.max(0.03, Math.min(0.97, t));
            const px = E.a[0] + t * ex, py = E.a[1] + t * ey, d = Math.hypot(px - wx, py - wy);
            if (!best || d < best.d) best = { d, e: i, t };
          });
          let snapped = false;
          G.reflex.forEach((rf, v) => { if (rf && !snapped && Math.hypot(M.X(G.verts[v][0]) - x, M.Y(G.verts[v][1]) - y) < 12) { c.v = v; c.e = null; snapped = true; } });
          if (!snapped) { c.v = null; c.e = best.e; c.t = best.t; }
          sliders.forEach(({ x: xx, s }) => { const v = xx.read ? xx.read(P) : null; if (v != null) s.set(v, true); });
          solve();
        },
      });
    },
  };

  // ======================================================================================
  // 마찰 원뿔: 손끝의 힘과 빗면 위의 상자
  // ======================================================================================
  S.cone = {
    title: '마찰 원뿔: 미끄러지는가, 버티는가',
    ch: 'ch04', k: '12.2.1',
    desc: '쿨롱 마찰에서 접촉력은 법선과 이루는 각 $\\beta$가 원뿔의 반각 $\\alpha=\\tan^{-1}\\mu$ 이하일 때만 미끄러지지 않고 전달됩니다. 손끝으로 상자를 비스듬히 눌러 보거나, 빗면을 기울여 상자가 언제 미끄러지기 시작하는지 보세요.',
    tries: [
      '손끝 모드에서 힘 화살표 끝을 끌어 기울여 보세요. 화살표가 원뿔 밖으로 나가는 순간 손끝이 미끄러집니다.',
      '같은 기울기에서 더 세게 눌러도(화살표를 길게) 결과는 같습니다 — 판정은 크기가 아니라 방향(각 β)으로 정해집니다.',
      '빗면 모드에서 기울기 φ를 올려 보세요. 필요한 받침힘(위쪽 화살표)이 원뿔의 모서리를 넘는 φ = α에서 상자가 미끄러집니다(안식각).',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.55, min: 260, max: 420, label: '마찰 원뿔' });
      const ctrl = SK.panel(stage);
      const out = SK.out(stage);
      const P = { mode: arg === 'slope' ? 'slope' : 'push', mu: 0.5, f: [0.35, -1], phi: 0.3, s: 0, v: 0 };
      const box = [-2.2, 2.2, -1.1, 1.5];
      const loop = SK.loop(stage, (dt) => {
        if (P.mode !== 'slope') return false;
        const a = 9.81 * (Math.sin(P.phi) - P.mu * Math.cos(P.phi)) * 0.12;
        if (a <= 0 && P.v <= 0) { P.v = 0; return false; }
        P.v = Math.max(0, P.v + a * dt); P.s += P.v * dt;
        if (P.s > 1.5) { P.s = -1.2; }
        st.now(); return true;
      });
      st.draw = (ctx, w, h, C) => {
        const M = SK.fitMap(w, h, box, 12), X = M.X, Y = M.Y;
        const al = Math.atan(P.mu);
        if (P.mode === 'push') {
          // floor and block
          ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2; SK.line(ctx, X(-2.1), Y(-0.6), X(2.1), Y(-0.6));
          for (let x = -2.1; x < 2.1; x += 0.15) SK.line(ctx, X(x), Y(-0.6), X(x - 0.1), Y(-0.7));
          ctx.fillStyle = C.paper2; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.fillRect(X(-1), Y(0.4), 2 * M.s, M.s); ctx.strokeRect(X(-1), Y(0.4), 2 * M.s, M.s);
          // cone below the contact (into the block): axis = inward normal (0, −1)
          const r = [0, 0.4], L = 0.9;
          ctx.fillStyle = SK.alpha(C.acc, 0.2); ctx.strokeStyle = C.acc; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(X(r[0]), Y(r[1])); ctx.lineTo(X(r[0] - L * Math.sin(al)), Y(r[1] - L * Math.cos(al))); ctx.arc(X(r[0]), Y(r[1]), L * M.s, PI / 2 + al, PI / 2 - al, true); ctx.closePath(); ctx.fill(); ctx.stroke();
          const fn = -P.f[1], ft = P.f[0], ok = fn > 0 && Math.abs(ft) <= P.mu * fn + 1e-12;
          const k = 0.85, tail = [r[0] - k * P.f[0], r[1] - k * P.f[1]];
          // the finger pushes along f and ends at the contact
          ctx.setLineDash([4, 4]); ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2;
          SK.line(ctx, X(tail[0]), Y(tail[1]), X(r[0]), Y(tail[1])); SK.line(ctx, X(r[0]), Y(tail[1]), X(r[0]), Y(r[1])); ctx.setLineDash([]);
          SK.dot(ctx, X(tail[0]), Y(tail[1]), 12, SK.alpha(C.ink3, 0.25), C.ink2, 1.4);
          SK.arrow(ctx, X(tail[0]), Y(tail[1]), X(r[0]), Y(r[1]), ok ? C.ok : C.bad, 3, 12);
          SK.text(ctx, 'f', X(tail[0]) - 16, Y(tail[1]), { c: ok ? C.ok : C.bad, s: 14, w: 700, a: 'center', halo: C.paper });
          SK.text(ctx, `f_t = ${Math.abs(ft).toFixed(2)}`, X((tail[0] + r[0]) / 2), Y(tail[1]) - 12, { c: C.ink2, s: 11.5, a: 'center', halo: C.paper });
          SK.text(ctx, `f_n = ${fn.toFixed(2)}`, X(r[0]) + 8, Y((tail[1] + r[1]) / 2), { c: C.ink2, s: 11.5, halo: C.paper });
          SK.text(ctx, `원뿔 반각 α = ${deg(al).toFixed(1)}°`, X(r[0]) + 10, Y(r[1] - L) + 6, { c: C.accInk, s: 11.5, w: 600, halo: C.paper2 });
          if (!ok && fn > 0) SK.arrow(ctx, X(r[0]), Y(r[1] + 0.08), X(r[0] + Math.sign(ft) * 0.45), Y(r[1] + 0.08), C.bad, 2, 8);
        } else {
          const ph = P.phi, c = Math.cos(ph), s = Math.sin(ph);
          const toW = (u, v) => [-1.8 + u * c - v * s, -0.7 + u * s + v * c]; // incline frame: u along the slope (up), v normal
          ctx.fillStyle = SK.alpha(C.ink3, 0.12); ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5;
          const q0 = toW(0, 0), q1 = toW(4.2, 0);
          ctx.beginPath(); ctx.moveTo(X(q0[0]), Y(q0[1])); ctx.lineTo(X(q1[0]), Y(q1[1])); ctx.lineTo(X(q1[0]), Y(q0[1])); ctx.closePath(); ctx.fill(); ctx.stroke();
          SK.text(ctx, `φ = ${deg(ph).toFixed(1)}°`, X(q0[0]) + 52, Y(q0[1]) - 10, { c: C.ink2, s: 12, w: 600 });
          const u0 = 2.4 - P.s;
          const corners = [toW(u0 - 0.45, 0), toW(u0 + 0.45, 0), toW(u0 + 0.45, 0.6), toW(u0 - 0.45, 0.6)];
          ctx.fillStyle = C.paper2; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); corners.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.closePath(); ctx.fill(); ctx.stroke();
          const r = toW(u0, 0), L = 0.85, n = [-s, c];
          // cone around the slope normal, opening into the box
          const a0 = Math.atan2(n[1], n[0]);
          ctx.fillStyle = SK.alpha(C.acc, 0.2); ctx.strokeStyle = C.acc; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(X(r[0]), Y(r[1]));
          for (let k = 0; k <= 16; k++) { const t = a0 - al + (2 * al * k) / 16; ctx.lineTo(X(r[0] + L * Math.cos(t)), Y(r[1] + L * Math.sin(t))); }
          ctx.closePath(); ctx.fill(); ctx.stroke();
          const g = toW(u0, 0.3);
          SK.arrow(ctx, X(g[0]), Y(g[1]), X(g[0]), Y(g[1] - 0.75), C.blue, 2.4, 10);
          SK.text(ctx, 'mg', X(g[0]) + 10, Y(g[1] - 0.6), { c: C.blue, s: 12.5, w: 700, halo: C.paper2 });
          const ok = ph <= al + 1e-9;
          SK.arrow(ctx, X(r[0]), Y(r[1]), X(r[0]), Y(r[1] + 0.75), ok ? C.ok : C.bad, 2.6, 10);
          SK.text(ctx, '필요한 받침힘', X(r[0]) - 8, Y(r[1] + 0.85), { c: ok ? C.ok : C.bad, s: 11.5, w: 600, a: 'right', halo: C.paper });
        }
      };
      const report = () => {
        const al = Math.atan(P.mu);
        if (P.mode === 'push') {
          const fn = -P.f[1], ft = P.f[0], be = deg(Math.atan2(Math.abs(ft), fn));
          const ok = fn > 0 && Math.abs(ft) <= P.mu * fn + 1e-12;
          out.innerHTML = `<div class="row">${fn <= 0 ? SK.badge(false, '', '당길 수 없음 — 손끝이 떨어짐') : SK.badge(ok, '붙어 있음', '미끄러짐')}
            <span>${SK.tex(`\\lvert f_t\\rvert=${Math.abs(ft).toFixed(2)}\\ ${ok ? '\\le' : '>'}\\ \\mu f_n=${(P.mu * Math.max(fn, 0)).toFixed(2)}`)}</span>
            <span>${SK.tex(`\\beta=${fn > 0 ? be.toFixed(1) : '—'}^\\circ,\\ \\alpha=\\tan^{-1}${P.mu.toFixed(2)}=${deg(al).toFixed(1)}^\\circ`)}</span></div>`;
        } else {
          const ok = P.phi <= al + 1e-9;
          out.innerHTML = `<div class="row">${SK.badge(ok, '정지', '미끄러짐')}<span>${SK.tex(`\\tan\\phi=${Math.tan(P.phi).toFixed(3)}\\ ${ok ? '\\le' : '>'}\\ \\mu=${P.mu.toFixed(2)}`)}</span>
            <span>받침힘은 ${SK.tex('-mg')}(연직 위)이고 빗면 법선과 각 ${SK.tex('\\phi')}를 이룹니다. ${SK.tex('\\phi\\le\\alpha')}이면 원뿔 안.</span></div>`;
        }
      };
      SK.seg(ctrl, { label: '모드', options: [['push', '손끝으로 누르기'], ['slope', '빗면 위 상자']], value: P.mode, on: (v) => { P.mode = v; P.s = 0; P.v = 0; slope.el.style.display = v === 'slope' ? '' : 'none'; st.req(); report(); if (v === 'slope') loop.start(); } });
      SK.slider(ctrl, { label: '마찰 계수 μ', min: 0, max: 1.2, step: 0.01, value: P.mu, on: (v) => { P.mu = v; st.req(); report(); if (P.mode === 'slope') loop.start(); } });
      const slope = SK.slider(ctrl, { label: '빗면 기울기 φ', min: 0, max: 50, step: 0.5, value: deg(P.phi), fmt: (v) => `${v.toFixed(1)}°`, on: (v) => { P.phi = (v * PI) / 180; if (P.phi <= Math.atan(P.mu)) { P.v = 0; P.s = 0; } st.req(); report(); loop.start(); } });
      slope.el.style.display = P.mode === 'slope' ? '' : 'none';
      report();
      SK.drag(st, {
        pick(x, y) {
          if (P.mode !== 'push') return null;
          const M = SK.fitMap(st.w, st.h, box, 12), tail = [-0.85 * P.f[0], 0.4 - 0.85 * P.f[1]];
          return Math.hypot(x - M.X(tail[0]), y - M.Y(tail[1])) < 26 ? 'f' : null;
        },
        move(hd, x, y) {
          const M = SK.fitMap(st.w, st.h, box, 12), wx = M.ix(x), wy = M.iy(y);
          let f = [-wx / 0.85, -(wy - 0.4) / 0.85];
          const n = Math.hypot(f[0], f[1]); if (n > 1.35) f = [(f[0] * 1.35) / n, (f[1] * 1.35) / n];
          P.f = f; st.req(); report();
        },
      });
    },
  };
})();
