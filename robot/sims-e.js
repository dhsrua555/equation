/* 로봇공학 시뮬레이션 E — 중간고사 1 범위에 새로 넣은 단원: 움직이는 좌표계(원판 위의 벌레, 5단원), 오일러 각 짐벌과 짐벌 록(7단원).
   그리는 틀은 core/simkit.js. 3차원은 원점 둘레를 도는 정사영 카메라(SimKit.cam)이고, 빈 곳을 끌면 시점이 돕니다. */
(function () {
  const SK = window.SimKit;
  if (!SK) return;
  const S = (window.SITE_SIMS = window.SITE_SIMS || {});
  const { V, M } = SK;
  const PI = Math.PI, TAU = 2 * PI;
  const rad = (d) => (d * PI) / 180, deg = (r) => (r * 180) / PI;

  // ======================================================================================
  // 움직이는 좌표계: 돌아가는 원판 위를 반지름 방향으로 기어가는 벌레
  // ======================================================================================
  S.bugdisk = {
    title: '움직이는 좌표계: 원판 위의 벌레',
    ch: 'ch05', k: 'W4.2',
    desc: '원판이 $\\Omega$(필요하면 $\\dot\\Omega$로 빨라지며)로 돌고, 원판에 붙은 {b}의 $\\hat y_b$ 반지름을 따라 벌레가 빠르기 $\\dot s$로 기어갑니다. 벌레의 속도 $v=\\dot s\\hat y_b+\\omega\\times r$와 가속도 $a=2\\omega\\times v_{\\text{rel}}+\\dot\\omega\\times r+\\omega\\times(\\omega\\times r)$의 각 항을 화살표로 보여 주고, 고정 좌표계에서 본 벌레의 길을 그립니다.',
    tries: [
      '‘가속도’ 보기에서 $\\dot\\Omega=0$이면 화살표가 코리올리(앞쪽)와 구심(중심 쪽) 둘뿐입니다(5단원 예제 3).',
      '기는 빠르기를 0으로 하면 코리올리 항이 사라지고 구심 항만 남습니다 — 원판에 붙은 점의 가속도입니다.',
      '돌림을 반대(음수)로 하면 코리올리 항도 반대쪽을 향합니다. 늘 “그 자리 바닥이 움직이는 방향”입니다.',
      '$\\dot\\Omega$를 키우면 접선 항이 생기고, 고정 좌표계의 나선이 점점 촘촘해집니다.',
    ],
    mount(stage) {
      const st = SK.canvas(stage, { ratio: 0.58, min: 270, max: 440, label: '원판 위의 벌레' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const P = { W0: 1.5, v: 0.12, Wd: 0, t: 0, play: false, view: 'vel', trail: [] };
      const Tend = () => 0.95 / Math.max(P.v, 1e-3);
      const state = () => {
        const t = P.t, W = P.W0 + P.Wd * t, th = P.W0 * t + 0.5 * P.Wd * t * t, s = P.v * t;
        const xb = [Math.cos(th), Math.sin(th)], yb = [-Math.sin(th), Math.cos(th)];
        return { t, W, th, s, xb, yb, pos: [s * yb[0], s * yb[1]] };
      };
      const box = [-1.25, 2.55, -1.25, 1.25];
      st.draw = (ctx, w, h, C) => {
        const Mp = SK.fitMap(w, h, box, 12), X = Mp.X, Y = Mp.Y, k = Mp.s;
        const q = state();
        // disk with spokes that turn with it
        ctx.fillStyle = SK.alpha(C.blue, 0.07); ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(X(0), Y(0), k, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = C.faint; ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) { const a = q.th + (i * PI) / 4; SK.line(ctx, X(0), Y(0), X(Math.cos(a)), Y(Math.sin(a))); }
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = C.ink3; SK.line(ctx, X(0), Y(0), X(q.yb[0]), Y(q.yb[1])); ctx.restore();
        SK.arrow(ctx, X(0), Y(0), X(0.32 * q.xb[0]), Y(0.32 * q.xb[1]), C.x, 2, 8);
        SK.arrow(ctx, X(0), Y(0), X(0.32 * q.yb[0]), Y(0.32 * q.yb[1]), C.y, 2, 8);
        SK.text(ctx, 'x̂_b', X(0.42 * q.xb[0]), Y(0.42 * q.xb[1]), { c: C.x, s: 11.5, w: 600, a: 'center', halo: C.paper });
        SK.text(ctx, 'ŷ_b', X(0.42 * q.yb[0]), Y(0.42 * q.yb[1]), { c: C.y, s: 11.5, w: 600, a: 'center', halo: C.paper });
        // fixed-frame trail of the bug
        if (P.trail.length > 1) {
          ctx.strokeStyle = C.acc; ctx.lineWidth = 1.6; ctx.beginPath();
          P.trail.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke();
        }
        const b = q.pos, B = [X(b[0]), Y(b[1])];
        const vec = (d, sc, col, lab, dy = 0) => {
          const E = [X(b[0] + sc * d[0]), Y(b[1] + sc * d[1])];
          SK.arrow(ctx, B[0], B[1], E[0], E[1], col, 2.4, 9);
          if (Math.hypot(E[0] - B[0], E[1] - B[1]) > 12) SK.text(ctx, lab, E[0] + 6, E[1] + dy, { c: col, s: 11.5, w: 600, halo: C.paper });
        };
        const W = q.W, s = q.s;
        if (P.view !== 'acc') {
          const kv = 0.8;
          const vr = V.sc(q.yb, P.v), vt = V.sc(q.xb, -W * s);
          vec(vr, kv, C.blue, 'ṡ ŷ_b', -8); vec(vt, kv, C.acc, 'ω × r', 8); vec(V.add(vr, vt), kv, C.ink, 'v', 0);
        }
        if (P.view !== 'vel') {
          const ka = 0.35;
          const cor = V.sc(q.xb, -2 * W * P.v), tan = V.sc(q.xb, -P.Wd * s), cen = V.sc(q.yb, -W * W * s);
          vec(cor, ka, C.bad, '코리올리', -8); vec(tan, ka, C.mid, '접선', 10); vec(cen, ka, C.ok, '구심', 0);
          vec(V.add(V.add(cor, tan), cen), ka, C.ink2, 'a', -10);
        }
        SK.dot(ctx, B[0], B[1], 6, C.paper3, C.ink, 2);
        // legend on the right
        const lx = X(1.45);
        SK.text(ctx, `Ω = ${W.toFixed(2)} rad/s`, lx, Y(1.0), { c: C.ink2, s: 12, w: 600 });
        SK.text(ctx, `s = ${s.toFixed(2)} m,  ṡ = ${P.v.toFixed(2)} m/s`, lx, Y(0.8), { c: C.ink2, s: 12 });
        SK.text(ctx, '주황 곡선: 고정 좌표계에서 본 길', lx, Y(0.5), { c: C.accInk, s: 11 });
        SK.text(ctx, '점선: 원판 위의 길 (반지름)', lx, Y(0.32), { c: C.ink3, s: 11 });
      };
      const report = () => {
        const q = state(), W = q.W, s = q.s;
        const vt = W * s, cor = 2 * W * P.v, tan = P.Wd * s, cen = W * W * s;
        out.innerHTML = `<div class="row"><span>${SK.tex(`v=\\dot s\\,\\hat y_b-\\Omega s\\,\\hat x_b,\\quad\\lVert v\\rVert=\\sqrt{${P.v.toFixed(2)}^2+${vt.toFixed(2)}^2}=${Math.hypot(P.v, vt).toFixed(3)}\\ \\text{m/s}`)}</span></div>
          <div class="row"><span>${SK.tex(`a=\\underbrace{-2\\Omega\\dot s\\,\\hat x_b}_{\\text{코리올리 }${cor.toFixed(2)}}\\ \\underbrace{-\\dot\\Omega s\\,\\hat x_b}_{\\text{접선 }${tan.toFixed(2)}}\\ \\underbrace{-\\Omega^2s\\,\\hat y_b}_{\\text{구심 }${cen.toFixed(2)}},\\quad\\lVert a\\rVert=${Math.hypot(cor + tan, cen).toFixed(3)}\\ \\text{m/s}^2`)}</span></div>
          <div class="sim-note">벌레는 원판 위에서 곧게(${SK.tex('\\ddot s=0')}) 기지만, 바깥으로 갈수록 바닥이 빨리 움직이므로 앞으로 밀어 주는 코리올리 항이 필요합니다.</div>`;
      };
      const reset = () => { P.t = 0; P.trail = [[0, 0]]; st.req(); report(); };
      const loop = SK.loop(stage, (dt) => {
        if (!P.play) return false;
        P.t += dt; if (P.t > Tend()) { P.t = 0; P.trail = [[0, 0]]; }
        P.trail.push(state().pos); if (P.trail.length > 2000) P.trail.shift();
        st.now(); report(); return true;
      });
      const pb = SK.btn(ctrl, '▶ 움직이기', () => { P.play = !P.play; pb.textContent = P.play ? '❚❚ 멈추기' : '▶ 움직이기'; if (P.play) loop.start(); }, 'primary');
      SK.btn(ctrl, '처음으로', reset);
      SK.seg(ctrl, { label: '보기', options: [['vel', '속도'], ['acc', '가속도'], ['both', '둘 다']], value: P.view, on: (v) => { P.view = v; st.req(); } });
      SK.slider(ctrl2, { label: '돌림 Ω₀', min: -3, max: 3, step: 0.1, value: P.W0, fmt: (v) => `${v.toFixed(1)} rad/s`, on: (v) => { P.W0 = v; reset(); } });
      SK.slider(ctrl2, { label: '기는 빠르기 v', min: 0, max: 0.3, step: 0.01, value: P.v, fmt: (v) => `${v.toFixed(2)} m/s`, on: (v) => { P.v = v; reset(); } });
      SK.slider(ctrl2, { label: '돌림 가속 dΩ/dt', min: 0, max: 1, step: 0.05, value: P.Wd, fmt: (v) => `${v.toFixed(2)} rad/s²`, on: (v) => { P.Wd = v; reset(); } });
      reset();
      // start at a moment where the bug is half way out, so the first frame already shows the terms
      P.t = 0.5 * Tend();
      for (let i = 1; i <= 120; i++) { const save = P.t; P.t = (save * i) / 120; P.trail.push(state().pos); P.t = save; }
      st.req(); report();
    },
  };

  // ======================================================================================
  // 오일러 각 짐벌: 세 관절 각에서 회전 행렬로, 역문제와 짐벌 록
  // ======================================================================================
  S.gimbal = {
    title: '오일러 각 짐벌과 짐벌 록',
    ch: 'ch07', k: 'B.1a',
    desc: '세 회전 관절을 이은 카메라 짐벌입니다. **ZYX**(관절 축 $\\hat z,\\hat y,\\hat x$, 렌즈는 $\\hat x_3$) 또는 **ZXZ**(축 $\\hat z,\\hat x,\\hat z$, 렌즈는 $\\hat z_3$)를 고르고 세 각을 바꾸면 고리와 카메라가 돌며 $R=\\mathrm{Rot}(\\text{축 1},\\alpha)\\mathrm{Rot}(\\text{축 2},\\beta)\\mathrm{Rot}(\\text{축 3},\\gamma)$가 나옵니다. 아래에는 그 $R$에서 역문제로 되찾은 각(해가 둘, 또는 짐벌 록의 한 매개변수 가족)을 보여 줍니다.',
    tries: [
      'ZYX에서 β를 90°로 두고 α와 γ를 같은 양만큼 함께 바꿔 보세요. 축 1과 축 3이 겹쳐 있어 α − γ가 같으면 카메라 자세가 그대로입니다(7단원 예제 4).',
      'β = 45°에서 역문제의 두 해를 확인하세요: (α, β, γ)와 (α ± 180°, 180° − β, γ ± 180°)가 같은 R을 줍니다.',
      'ZXZ로 바꾸면 영 자세(β = 0) 자체가 특이점입니다. β를 0에서 조금 움직여 해가 둘로 갈라지는 것을 보세요.',
      '2025년 기출의 짐벌: ZXZ에서 α = −60°, β = 90°, γ = 30°로 두면 시험지의 R₁₂가 나옵니다. 시험지는 관절 3의 축을 −ẑ로 그렸으므로 그 관절 각은 −30°(−π/6)입니다.',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.62, min: 290, max: 470, label: '오일러 각 짐벌' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const cam = SK.cam({ yaw: 0.62, pitch: 0.36 });
      const P = { mode: arg === 'zxz' ? 'zxz' : 'zyx', a: 30, b: 40, c: 20 };
      const E = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
      const axes = () => (P.mode === 'zyx' ? ['z', 'y', 'x'] : ['z', 'x', 'z']);
      const lensAxis = () => (P.mode === 'zyx' ? 'x' : 'z');
      const Rs = () => {
        const ax = axes();
        const R1 = M.rot(E[ax[0]], rad(P.a)), R2 = M.rot(E[ax[1]], rad(P.b)), R3 = M.rot(E[ax[2]], rad(P.c));
        return { R1, R12: M.mul(R1, R2), R: M.mul(M.mul(R1, R2), R3) };
      };
      const ringPts = (c0, n, r) => { // circle of radius r around unit axis n through c0
        const t = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
        const e1 = V.unit(V.cross(n, t)), e2 = V.cross(n, e1);
        const pts = []; for (let k = 0; k <= 72; k++) { const u = (TAU * k) / 72; pts.push(V.add(c0, V.add(V.sc(e1, r * Math.cos(u)), V.sc(e2, r * Math.sin(u))))); }
        return pts;
      };
      const poly3 = (ctx, pts, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => { const q = cam.P(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke(); };
      st.draw = (ctx, w, h, C) => {
        cam.s = Math.min(w, h) * 0.255; cam.cx = w / 2; cam.cy = h / 2 + 14;
        const { R1, R12, R } = Rs();
        const ax = axes();
        const a1 = E[ax[0]], a2 = M.mv(R1, E[ax[1]]), a3 = M.mv(R12, E[ax[2]]);
        const lock = Math.abs(V.dot(a1, a3)) > 0.995;
        SK.axes3(ctx, cam, { R: M.I(3), p: [0, 0, 0] }, 1.7, C, { faint: true, w: 1.2, head: 6, labels: ['x₀', 'y₀', 'z₀'] });
        const axisLine = (a, col, len, lab) => {
          ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = col; ctx.lineWidth = 1.4;
          const A0 = cam.P(V.sc(a, -len)), A1 = cam.P(V.sc(a, len)); SK.line(ctx, A0[0], A0[1], A1[0], A1[1]); ctx.restore();
          SK.text(ctx, lab, A1[0] + 6, A1[1] - 6, { c: col, s: 11.5, w: 600, halo: C.paper });
        };
        const c1 = lock ? C.bad : C.ink2, c3 = lock ? C.bad : C.blue2;
        axisLine(a1, c1, 1.95, '축 1 (α)'); axisLine(a2, C.ink3, 1.6, '축 2 (β)'); axisLine(a3, c3, 1.35, '축 3 (γ)');
        poly3(ctx, ringPts([0, 0, 0], a1, 1.45), c1, 2.4);
        poly3(ctx, ringPts([0, 0, 0], a2, 1.12), C.ink3, 2.2);
        poly3(ctx, ringPts([0, 0, 0], a3, 0.82), c3, 2.4);
        // markers that show each ring's own rotation
        const mark = (Rk, ref, r, col) => { const p = cam.P(V.sc(M.mv(Rk, ref), r)); SK.dot(ctx, p[0], p[1], 4.5, col, C.paper3, 1.5); };
        const perp = (n) => (Math.abs(n[2]) < 0.9 ? V.unit(V.cross(n, [0, 0, 1])) : [1, 0, 0]);
        mark(R1, perp(E[ax[0]]), 1.45, c1); mark(R12, perp(E[ax[1]]), 1.12, C.ink2); mark(R, perp(E[ax[2]]), 0.82, c3);
        // camera: body frame and lens
        SK.axes3(ctx, cam, { R, p: [0, 0, 0] }, 0.62, C, { labels: ['x₃', 'y₃', 'z₃'], w: 2.2, head: 8 });
        const lens = M.mv(R, E[lensAxis()]), L0 = cam.P([0, 0, 0]), L1 = cam.P(V.sc(lens, 1.05));
        SK.arrow(ctx, L0[0], L0[1], L1[0], L1[1], C.acc, 3.2, 12);
        SK.text(ctx, '렌즈', L1[0] + 8, L1[1], { c: C.accInk, s: 12, w: 700, halo: C.paper });
        if (lock) SK.text(ctx, '짐벌 록: 축 1과 축 3이 겹침', w / 2, 18, { c: C.bad, s: 13, w: 700, a: 'center', halo: C.paper });
        SK.text(ctx, '빈 곳을 끌면 시점이 돕니다', 12, h - 12, { c: C.ink3, s: 11 });
      };
      const inverse = (R) => {
        const d = (x) => `${deg(x).toFixed(1)}^\\circ`;
        if (P.mode === 'zyx') {
          const r31 = R[2][0];
          if (Math.abs(Math.abs(r31) - 1) < 1e-6) {
            const g = r31 < 0 ? Math.atan2(R[0][1], R[1][1]) : -Math.atan2(R[0][1], R[1][1]);
            return `\\beta=${r31 < 0 ? '90' : '-90'}^\\circ\\ (\\text{짐벌 록}):\\ \\gamma${r31 < 0 ? '-' : '+'}\\alpha=${d(g)}\\ \\text{만 정해짐}`;
          }
          const c = Math.hypot(R[0][0], R[1][0]);
          const b1 = Math.atan2(-r31, c), a1 = Math.atan2(R[1][0], R[0][0]), g1 = Math.atan2(R[2][1], R[2][2]);
          const b2 = Math.atan2(-r31, -c), a2 = Math.atan2(-R[1][0], -R[0][0]), g2 = Math.atan2(-R[2][1], -R[2][2]);
          return `(\\alpha,\\beta,\\gamma)=(${d(a1)},${d(b1)},${d(g1)})\\ \\text{또는}\\ (${d(a2)},${d(b2)},${d(g2)})`;
        }
        const r33 = R[2][2];
        if (Math.abs(Math.abs(r33) - 1) < 1e-6) {
          const g = Math.atan2(R[1][0], R[0][0]);
          return `\\beta=${r33 > 0 ? '0' : '180'}^\\circ\\ (\\text{짐벌 록}):\\ \\alpha${r33 > 0 ? '+' : '-'}\\gamma=${d(g)}\\ \\text{만 정해짐}`;
        }
        const s = Math.hypot(R[0][2], R[1][2]);
        const b1 = Math.atan2(s, r33), a1 = Math.atan2(R[0][2], -R[1][2]), g1 = Math.atan2(R[2][0], R[2][1]);
        const b2 = Math.atan2(-s, r33), a2 = Math.atan2(-R[0][2], R[1][2]), g2 = Math.atan2(-R[2][0], -R[2][1]);
        return `(\\alpha,\\beta,\\gamma)=(${d(a1)},${d(b1)},${d(g1)})\\ \\text{또는}\\ (${d(a2)},${d(b2)},${d(g2)})`;
      };
      const report = () => {
        const { R } = Rs();
        const ax = axes(), nm = (a) => `\\hat ${a}`;
        out.innerHTML = `<div class="row"><span>${SK.tex(`R=\\mathrm{Rot}(${nm(ax[0])},${P.a}^\\circ)\\,\\mathrm{Rot}(${nm(ax[1])},${P.b}^\\circ)\\,\\mathrm{Rot}(${nm(ax[2])},${P.c}^\\circ)=${SK.texMat(R, 3)}`, true)}</span></div>
          <div class="row"><span>역문제: ${SK.tex(inverse(R))}</span></div>
          <div class="sim-note">렌즈 방향(${P.mode === 'zyx' ? '첫째' : '셋째'} 열) ${SK.tex(SK.texVec(M.mv(R, E[lensAxis()]), 3))} — 셋째 관절은 렌즈 축 둘레로만 돌려 렌즈 방향을 바꾸지 않습니다.</div>`;
      };
      let sl = [];
      const build = () => {
        ctrl2.innerHTML = '';
        sl = [
          SK.slider(ctrl2, { label: '관절 1 α', min: -180, max: 180, step: 1, value: P.a, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.a = v; st.req(); report(); } }),
          SK.slider(ctrl2, { label: '관절 2 β', min: -180, max: 180, step: 1, value: P.b, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.b = v; st.req(); report(); } }),
          SK.slider(ctrl2, { label: '관절 3 γ', min: -180, max: 180, step: 1, value: P.c, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.c = v; st.req(); report(); } }),
        ];
      };
      const setAll = (a, b, c) => { P.a = a; P.b = b; P.c = c; sl[0].set(a, true); sl[1].set(b, true); sl[2].set(c, true); st.req(); report(); };
      const modeSeg = SK.seg(ctrl, { label: '축 순서', options: [['zyx', 'ZYX (렌즈 x̂)'], ['zxz', 'ZXZ (렌즈 ẑ)']], value: P.mode, on: (v) => { P.mode = v; st.req(); report(); } });
      SK.btn(ctrl, '영 자세', () => setAll(0, 0, 0));
      SK.btn(ctrl, '짐벌 록', () => setAll(P.a, P.mode === 'zyx' ? 90 : 0, P.c));
      SK.btn(ctrl, '2025 기출', () => { modeSeg.set('zxz', true); P.mode = 'zxz'; setAll(-60, 90, 30); });
      build(); report();
      const orb = SK.orbit(st, cam, () => st.req());
      SK.drag(st, { pick: (x, y) => orb.pick(x, y), move: (h, x, y) => orb.move(h, x, y) });
    },
  };
})();
