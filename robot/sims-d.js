/* 로봇공학 시뮬레이션 D — 평면 팔의 속도·힘·운동: 야코비안과 조작성 타원, 뉴턴-랩슨 역기구학, 2R 팔의 동역학과 제어, 궤적의 시간 스케일링. */
(function () {
  const SK = window.SimKit;
  if (!SK) return;
  const S = (window.SITE_SIMS = window.SITE_SIMS || {});
  const { M } = SK;
  const PI = Math.PI, TAU = 2 * PI;
  const deg = (r) => (r * 180) / PI;
  const wrap = (a) => ((((a + PI) % TAU) + TAU) % TAU) - PI;
  // planar n-link arm
  const fkN = (L, th) => { const pts = [[0, 0]]; let a = 0, x = 0, y = 0; th.forEach((t, i) => { a += t; x += L[i] * Math.cos(a); y += L[i] * Math.sin(a); pts.push([x, y]); }); return pts; };
  const jacN = (L, th) => { // 2 × n linear-velocity Jacobian of the tip
    const n = th.length, J = [Array(n).fill(0), Array(n).fill(0)];
    let a = 0; const ang = th.map((t) => (a += t));
    for (let i = 0; i < n; i++) for (let k = i; k < n; k++) { J[0][i] -= L[k] * Math.sin(ang[k]); J[1][i] += L[k] * Math.cos(ang[k]); }
    return J;
  };
  const ik2 = (L1, L2, x, y, up) => { // analytic 2R inverse kinematics; null when out of reach
    const c2 = (x * x + y * y - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    if (c2 > 1 + 1e-12 || c2 < -1 - 1e-12) return null;
    const t2 = (up ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, c2)));
    return [Math.atan2(y, x) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2)), t2];
  };
  // J^T (J J^T + λI)^{-1}: the pseudo-inverse, kept finite at a singularity by a tiny λ
  const pinv = (J, lam = 1e-9) => { const A = M.mul(J, M.T(J)); A[0][0] += lam; A[1][1] += lam; return M.mul(M.T(J), M.inv2(A)); };
  function drawArm(ctx, X, Y, pts, col, wd, C, o = {}) {
    ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = wd;
    if (o.dash) ctx.setLineDash(o.dash);
    for (let i = 1; i < pts.length; i++) SK.line(ctx, X(pts[i - 1][0]), Y(pts[i - 1][1]), X(pts[i][0]), Y(pts[i][1]));
    ctx.setLineDash([]);
    if (!o.noJoints) pts.forEach((p, i) => { if (i < pts.length - 1) SK.dot(ctx, X(p[0]), Y(p[1]), wd > 4 ? 5.5 : 3.5, C.paper3, col, 2); });
  }
  function base(ctx, X, Y, C) {
    ctx.fillStyle = C.paper2; ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0) - 12, Y(0) + 18); ctx.lineTo(X(0) + 12, Y(0) + 18); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  function ellipse(ctx, X, Y, cx, cy, a, b, ang, col, fill) {
    ctx.beginPath();
    for (let k = 0; k <= 64; k++) { const t = (TAU * k) / 64, x = cx + a * Math.cos(t) * Math.cos(ang) - b * Math.sin(t) * Math.sin(ang), y = cy + a * Math.cos(t) * Math.sin(ang) + b * Math.sin(t) * Math.cos(ang); if (k) ctx.lineTo(X(x), Y(y)); else ctx.moveTo(X(x), Y(y)); }
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.stroke();
  }

  // ======================================================================================
  // 야코비안: 관절 속도 → 끝점 속도, 끝점 힘 → 관절 토크, 조작성 타원과 특이점
  // ======================================================================================
  S.jacobian = {
    title: '야코비안: 속도 타원, 힘 타원, 특이점',
    ch: 'ch11', k: '5.4',
    desc: '평면 2R 팔의 끝점에서 야코비안 $J(\\theta)$를 봅니다. **속도** 모드에서는 관절 속도 $\\dot\\theta$가 만드는 끝점 속도 $J\\dot\\theta$(두 열의 합)와, 크기 1인 모든 관절 속도가 만드는 **조작성 타원**을 그립니다. **힘** 모드에서는 끝점이 내는 힘 $f$에 필요한 관절 토크 $\\tau=J^Tf$와 **힘 타원**을 봅니다. 배경의 진한 고리일수록 $\\lvert\\det J\\rvert$가 큽니다.',
    tries: [
      '끝점(주황)을 끌어 팔을 곧게 펴 보세요($\\theta_2\\to0$). 속도 타원이 납작해져 선분이 되고, 팔 방향으로는 속도를 낼 수 없습니다 — 특이점.',
      '같은 자세에서 힘 모드로 바꾸면 힘 타원은 반대로 팔 방향으로 길게 늘어납니다. 펴진 팔은 그 방향의 힘을 토크 없이 버팁니다.',
      '$\\theta_2=\\pm90^\\circ$ 근처에서 $\\lvert\\det J\\rvert=L_1L_2\\lvert\\sin\\theta_2\\rvert$와 타원의 넓이가 가장 큽니다.',
      '속도 모드에서 θ̇₁만 주면 끝점은 원점 둘레의 원에 접하는 방향으로, θ̇₂만 주면 팔꿈치 둘레의 원에 접하는 방향으로 움직입니다(야코비안의 두 열).',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.7, min: 300, max: 520, label: '2R 팔의 야코비안' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const P = { mode: arg === 'force' ? 'force' : 'vel', L: [1, 0.8], th: [0.35, 1.3], dth: [0.6, 0.4], f: [0.0, -0.8], ell: true };
      const box = () => { const R = P.L[0] + P.L[1] + 0.35; return [-R, R, -R * 0.7, R + 0.25]; };
      const vs = 0.6, fs = 0.5; // world length per unit speed / force
      st.draw = (ctx, w, h, C) => {
        const Mp = SK.fitMap(w, h, box(), 12), X = Mp.X, Y = Mp.Y, [L1, L2] = P.L;
        // |det J| rings
        const r0 = Math.abs(L1 - L2), r1 = L1 + L2;
        for (let k = 0; k < 40; k++) {
          const ra = r0 + ((r1 - r0) * k) / 40, rb = r0 + ((r1 - r0) * (k + 1)) / 40, rm = (ra + rb) / 2;
          const c2 = (rm * rm - L1 * L1 - L2 * L2) / (2 * L1 * L2), s2 = Math.sqrt(Math.max(0, 1 - c2 * c2));
          ctx.fillStyle = SK.alpha(C.blue, 0.03 + 0.17 * s2);
          ctx.beginPath(); ctx.arc(X(0), Y(0), rb * Mp.s, 0, TAU); ctx.arc(X(0), Y(0), ra * Mp.s, 0, TAU, true); ctx.fill();
        }
        base(ctx, X, Y, C);
        const pts = fkN(P.L, P.th), J = jacN(P.L, P.th), tip = pts[2], A = M.mul(J, M.T(J));
        const [[l1, v1], [l2]] = M.eig2(A), ang = Math.atan2(v1[1], v1[0]);
        drawArm(ctx, X, Y, pts, C.ink, 7, C);
        if (P.mode === 'vel') {
          if (P.ell) ellipse(ctx, X, Y, tip[0], tip[1], vs * Math.sqrt(l1), Math.max(vs * Math.sqrt(Math.max(l2, 0)), 0.003), ang, C.acc, SK.alpha(C.acc, 0.12));
          const c1 = [J[0][0] * P.dth[0], J[1][0] * P.dth[0]], c2 = [J[0][1] * P.dth[1], J[1][1] * P.dth[1]], v = [c1[0] + c2[0], c1[1] + c2[1]];
          ctx.setLineDash([4, 4]);
          SK.arrow(ctx, X(tip[0]), Y(tip[1]), X(tip[0] + vs * c1[0]), Y(tip[1] + vs * c1[1]), C.accInk, 1.8, 8);
          SK.arrow(ctx, X(tip[0] + vs * c1[0]), Y(tip[1] + vs * c1[1]), X(tip[0] + vs * v[0]), Y(tip[1] + vs * v[1]), C.blue2, 1.8, 8);
          ctx.setLineDash([]);
          SK.arrow(ctx, X(tip[0]), Y(tip[1]), X(tip[0] + vs * v[0]), Y(tip[1] + vs * v[1]), C.ok, 3, 11);
          SK.text(ctx, 'J₁θ̇₁', X(tip[0] + vs * c1[0] * 0.5) - 10, Y(tip[1] + vs * c1[1] * 0.5) - 12, { c: C.accInk, s: 11.5, w: 600, halo: C.paper });
          SK.text(ctx, 'v = Jθ̇', X(tip[0] + vs * v[0]) + 10, Y(tip[1] + vs * v[1]) + 16, { c: C.ok, s: 12, w: 700, halo: C.paper });
        } else {
          if (P.ell) { const a = Math.min(fs / Math.sqrt(Math.max(l2, 1e-6)), 4), b = fs / Math.sqrt(l1); ellipse(ctx, X, Y, tip[0], tip[1], b, a, ang, C.blue, SK.alpha(C.blue, 0.1)); }
          SK.arrow(ctx, X(tip[0]), Y(tip[1]), X(tip[0] + fs * P.f[0]), Y(tip[1] + fs * P.f[1]), C.bad, 3, 11);
          SK.dot(ctx, X(tip[0] + fs * P.f[0]), Y(tip[1] + fs * P.f[1]), 6, C.paper3, C.bad, 2);
          SK.text(ctx, 'f (끌어서 바꾸기)', X(tip[0] + fs * P.f[0]) + 10, Y(tip[1] + fs * P.f[1]) + 12, { c: C.bad, s: 11.5, w: 600, halo: C.paper });
          const tau = [J[0][0] * P.f[0] + J[1][0] * P.f[1], J[0][1] * P.f[0] + J[1][1] * P.f[1]];
          [[pts[0], tau[0], 'τ₁'], [pts[1], tau[1], 'τ₂']].forEach(([p, t, n]) => {
            const r = 22, a1 = Math.max(-1, Math.min(1, t / 2)) * 4.2;
            if (Math.abs(a1) > 0.03) { ctx.strokeStyle = C.accInk; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), r, -0.4, -0.4 - a1, a1 > 0); ctx.stroke(); }
            SK.text(ctx, `${n} = ${t.toFixed(2)}`, X(p[0]) + 26, Y(p[1]) - 18, { c: C.accInk, s: 12, w: 700, halo: C.paper });
          });
        }
        SK.dot(ctx, X(tip[0]), Y(tip[1]), 8, C.acc, C.paper3, 2);
        if (Math.abs(Math.sin(P.th[1])) < 0.08) SK.text(ctx, '특이점 근처!', 12, 16, { c: C.bad, s: 13, w: 700 });
      };
      const report = () => {
        const J = jacN(P.L, P.th), A = M.mul(J, M.T(J)), [[l1], [l2]] = M.eig2(A), det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
        const mu1 = l2 > 1e-10 ? Math.sqrt(l1 / l2) : Infinity;
        let html = `<div class="row"><span>${SK.tex(`\\theta=(${deg(P.th[0]).toFixed(0)}^\\circ,\\ ${deg(P.th[1]).toFixed(0)}^\\circ),\\quad J=${SK.texMat(J, 2)}`)}</span>
          <span>${SK.tex(`\\det J=L_1L_2\\sin\\theta_2=${det.toFixed(3)}`)}</span></div>
          <div class="row"><span>${SK.tex(`JJ^T`)}의 고윳값 ${SK.tex(`${l1.toFixed(3)},\\ ${Math.max(l2, 0).toFixed(3)}`)}</span><span>${SK.tex(`\\mu_1=\\sqrt{\\lambda_{\\max}/\\lambda_{\\min}}=${isFinite(mu1) ? mu1.toFixed(2) : '\\infty'}`)}</span><span>${SK.tex(`\\mu_3=\\sqrt{\\det JJ^T}=${Math.abs(det).toFixed(3)}`)}</span></div>`;
        if (P.mode === 'force') {
          const tau = [J[0][0] * P.f[0] + J[1][0] * P.f[1], J[0][1] * P.f[0] + J[1][1] * P.f[1]];
          html += `<div class="row"><span>${SK.tex(`\\tau=J^Tf=${SK.texMat([[J[0][0], J[1][0]], [J[0][1], J[1][1]]], 2)}${SK.texMat([[P.f[0]], [P.f[1]]], 2)}=${SK.texMat([[tau[0]], [tau[1]]], 2)}`)}</span></div>`;
        } else {
          const v = [J[0][0] * P.dth[0] + J[0][1] * P.dth[1], J[1][0] * P.dth[0] + J[1][1] * P.dth[1]];
          html += `<div class="row"><span>${SK.tex(`v=J\\dot\\theta=${SK.texMat([[v[0]], [v[1]]], 2)}`)} — 초록 화살표, 점선은 두 열의 기여</span></div>`;
        }
        out.innerHTML = html;
      };
      const build = () => {
        ctrl2.innerHTML = '';
        if (P.mode === 'vel') {
          SK.slider(ctrl2, { label: 'θ̇₁', min: -1, max: 1, step: 0.01, value: P.dth[0], on: (v) => { P.dth[0] = v; st.req(); report(); } });
          SK.slider(ctrl2, { label: 'θ̇₂', min: -1, max: 1, step: 0.01, value: P.dth[1], on: (v) => { P.dth[1] = v; st.req(); report(); } });
        }
        SK.slider(ctrl2, { label: 'L₁', min: 0.4, max: 1.4, step: 0.05, value: P.L[0], on: (v) => { P.L[0] = v; st.req(); report(); } });
        SK.slider(ctrl2, { label: 'L₂', min: 0.3, max: 1.4, step: 0.05, value: P.L[1], on: (v) => { P.L[1] = v; st.req(); report(); } });
      };
      SK.seg(ctrl, { label: '보기', options: [['vel', '속도'], ['force', '힘']], value: P.mode, on: (v) => { P.mode = v; build(); st.req(); report(); } });
      SK.check(ctrl, '타원', true, (v) => { P.ell = v; st.req(); });
      SK.btn(ctrl, '팔 곧게 펴기', () => { P.th[1] = 0.02; st.req(); report(); });
      build(); report();
      SK.drag(st, {
        pick(x, y) {
          const Mp = SK.fitMap(st.w, st.h, box(), 12), pts = fkN(P.L, P.th), tip = pts[2];
          if (P.mode === 'force' && Math.hypot(x - Mp.X(tip[0] + fs * P.f[0]), y - Mp.Y(tip[1] + fs * P.f[1])) < 14) return 'f';
          if (Math.hypot(x - Mp.X(tip[0]), y - Mp.Y(tip[1])) < 18) return 'tip';
          if (Math.hypot(x - Mp.X(pts[1][0]), y - Mp.Y(pts[1][1])) < 18) return 'elbow';
          return null;
        },
        move(hd, x, y) {
          const Mp = SK.fitMap(st.w, st.h, box(), 12), wx = Mp.ix(x), wy = Mp.iy(y);
          if (hd === 'f') { const tip = fkN(P.L, P.th)[2]; P.f = [(wx - tip[0]) / fs, (wy - tip[1]) / fs]; }
          else if (hd === 'elbow') P.th[0] = Math.atan2(wy, wx);
          else {
            const R = Math.hypot(wx, wy), rmax = P.L[0] + P.L[1] - 1e-4, rmin = Math.abs(P.L[0] - P.L[1]) + 1e-4, k = Math.max(rmin, Math.min(rmax, R)) / (R || 1);
            const s = ik2(P.L[0], P.L[1], wx * k, wy * k, P.th[1] >= 0);
            if (s) P.th = s;
          }
          st.req(); report();
        },
      });
    },
  };

  // ======================================================================================
  // 역기구학: 해석해 두 개와 뉴턴-랩슨 반복, 여유 팔의 영공간 운동
  // ======================================================================================
  S.ik = {
    title: '역기구학: 뉴턴-랩슨 한 걸음씩',
    ch: 'ch12', k: '6.2',
    desc: '목표점(×)에 끝점을 보내는 관절각을 찾습니다. **2R** 모드에서는 코사인 법칙으로 얻는 두 해(흐린 팔: 팔꿈치 위·아래)와, 지금 자세에서 출발하는 **뉴턴-랩슨** 반복 $\\theta^{k+1}=\\theta^k+J^{-1}(x_d-f(\\theta^k))$를 한 걸음씩 비교합니다. **3R** 모드는 관절이 하나 남는 여유 팔이라 해가 무한히 많고, 의사역행렬 $J^\\dagger$를 씁니다.',
    tries: [
      '‘한 걸음’을 몇 번 눌러 보세요. 표의 오차가 0.1 → 0.01 → 0.0001처럼 자릿수가 두 배씩 줄어듭니다(2차 수렴).',
      '팔(관절)을 끌어 출발 자세를 바꾸고 다시 풀면, 어느 해(팔꿈치 위·아래)로 수렴하는지가 출발점에 따라 달라집니다.',
      '목표를 작업 공간 밖으로 끌면 해석해가 사라지고, 뉴턴-랩슨은 가장 가까운 곳에서 팔을 편 채 멈춥니다.',
      '3R 모드에서 ‘끝 링크 방향 φ’를 움직이면 끝점은 목표에 그대로 있고 팔만 접힙니다 — 야코비안의 영공간 방향의 운동입니다.',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.6, min: 280, max: 460, label: '역기구학' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const P = { mode: arg === '3r' ? '3r' : '2r', L: [1, 0.8], th: [-0.4, 0.3], th0: null, target: [0.6, 1.2], hist: [], ghosts: [], phi: 1.2 };
      const box = () => { const R = P.L.reduce((a, b) => a + b, 0) + 0.3; return [-R, R, -R * 0.55, R]; };
      const err = () => { const p = fkN(P.L, P.th).pop(); return [P.target[0] - p[0], P.target[1] - p[1]]; };
      const setMode = (m) => {
        P.mode = m;
        if (m === '2r') { P.L = [1, 0.8]; P.th = [0.1, 1.2]; P.target = [0.6, 1.2]; }
        else { P.L = [1, 0.7, 0.5]; P.th = [0.2, 0.5, 0.4]; P.target = [0.9, 1.0]; }
        P.hist = []; P.ghosts = []; P.th0 = P.th.slice(); build(); st.req(); report();
      };
      const nrStep = () => {
        const e = err(), J = jacN(P.L, P.th);
        let d;
        if (P.mode === '2r') { const det = J[0][0] * J[1][1] - J[0][1] * J[1][0]; d = Math.abs(det) < 1e-9 ? M.mv(pinv(J), e) : M.mv(M.inv2(J), e); }
        else d = M.mv(pinv(J), e);
        const n = Math.hypot(...d); if (n > 1.5) d = d.map((v) => (v * 1.5) / n); // keep a step near a singularity on the screen
        P.ghosts.push(P.th.slice());
        P.th = P.th.map((t, i) => wrap(t + d[i]));
        P.hist.push(Math.hypot(...err()));
      };
      let anim = null;
      const loop = SK.loop(stage, (dt) => {
        if (!anim) return false;
        anim.t += dt;
        if (anim.t > 0.45) { anim.t = 0; nrStep(); st.now(); report(); if (Math.hypot(...err()) < 1e-10 || P.hist.length >= 12) { anim = null; return false; } }
        return true;
      });
      st.draw = (ctx, w, h, C) => {
        const Mp = SK.fitMap(w, h, box(), 12), X = Mp.X, Y = Mp.Y, R = P.L.reduce((a, b) => a + b, 0);
        ctx.fillStyle = SK.alpha(C.blue, 0.06); ctx.beginPath(); ctx.arc(X(0), Y(0), R * Mp.s, 0, TAU); if (P.mode === '2r') ctx.arc(X(0), Y(0), Math.abs(P.L[0] - P.L[1]) * Mp.s, 0, TAU, true); ctx.fill();
        base(ctx, X, Y, C);
        if (P.mode === '2r') [true, false].forEach((up) => { const s = ik2(P.L[0], P.L[1], P.target[0], P.target[1], up); if (s) drawArm(ctx, X, Y, fkN(P.L, s), SK.alpha(C.acc, 0.45), 4, C, { dash: [6, 5] }); });
        P.ghosts.forEach((g, i) => drawArm(ctx, X, Y, fkN(P.L, g), SK.alpha(C.ink3, 0.18 + (0.25 * i) / Math.max(1, P.ghosts.length)), 3, C, { noJoints: true }));
        if (P.ghosts.length) {
          ctx.strokeStyle = C.blue2; ctx.lineWidth = 1.5; ctx.beginPath();
          [...P.ghosts, P.th].forEach((g, i) => { const p = fkN(P.L, g).pop(); if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.stroke();
          [...P.ghosts, P.th].forEach((g, i) => { const p = fkN(P.L, g).pop(); SK.text(ctx, String(i), X(p[0]) + 7, Y(p[1]) - 8, { c: C.blue2, s: 10.5, w: 600, halo: C.paper }); });
        }
        const pts = fkN(P.L, P.th);
        drawArm(ctx, X, Y, pts, C.ink, 7, C);
        SK.dot(ctx, X(pts[pts.length - 1][0]), Y(pts[pts.length - 1][1]), 7, C.acc, C.paper3, 2);
        const [tx, ty] = P.target; ctx.strokeStyle = C.bad; ctx.lineWidth = 2.6;
        SK.line(ctx, X(tx) - 9, Y(ty) - 9, X(tx) + 9, Y(ty) + 9); SK.line(ctx, X(tx) - 9, Y(ty) + 9, X(tx) + 9, Y(ty) - 9);
        SK.text(ctx, '목표', X(tx) + 12, Y(ty) - 10, { c: C.bad, s: 12, w: 700, halo: C.paper });
        if (P.mode === '2r') SK.text(ctx, '흐린 점선 팔: 해석해(팔꿈치 위·아래)', 12, h - 12, { c: C.ink3, s: 11 });
      };
      const report = () => {
        const e = Math.hypot(...err());
        const rows = P.hist.map((v, i) => `<span class="mono">${i + 1}: ${v.toExponential(2)}</span>`).join('');
        let html = `<div class="row"><span>${SK.tex(`\\theta=(${P.th.map((t) => `${deg(t).toFixed(1)}^\\circ`).join(',\\ ')})`)}</span><span>오차 ${SK.tex(`\\lVert x_d-f(\\theta)\\rVert=${e.toExponential(2)}`)}</span></div>`;
        if (P.hist.length) html += `<div class="row"><span>반복마다 오차:</span>${rows}</div>`;
        if (P.mode === '2r') {
          const a = ik2(P.L[0], P.L[1], P.target[0], P.target[1], true), b = ik2(P.L[0], P.L[1], P.target[0], P.target[1], false);
          html += `<div class="row"><span>해석해: ${a ? SK.tex(`(${deg(a[0]).toFixed(1)}^\\circ,\\ ${deg(a[1]).toFixed(1)}^\\circ),\\ (${deg(b[0]).toFixed(1)}^\\circ,\\ ${deg(b[1]).toFixed(1)}^\\circ)`) : '없음 — 목표가 작업 공간 밖'}</span></div>`;
        } else {
          const J = jacN(P.L, P.th), Jp = pinv(J), N = M.mul(Jp, J).map((r, i) => r.map((v, k) => (i === k ? 1 : 0) - v));
          const nv = N.map((r) => r[2]), nn = Math.hypot(...nv) || 1;
          html += `<div class="row"><span>${SK.tex(`J^\\dagger=J^T(JJ^T)^{-1}=${SK.texMat(Jp, 2)}`)}</span><span>영공간 방향 ${SK.tex(`(I-J^\\dagger J)\\,e_3\\propto${SK.texVec(nv.map((v) => v / nn), 2)}`)}</span></div>`;
        }
        out.innerHTML = html;
      };
      const build = () => {
        ctrl2.innerHTML = '';
        if (P.mode === '3r') SK.slider(ctrl2, { label: '끝 링크 방향 φ', min: -180, max: 180, step: 1, value: deg(P.phi), fmt: (v) => `${v.toFixed(0)}°`, on: (v) => {
          // self-motion: keep the tip on the target, turn the last link to φ and solve the first two joints for the wrist
          const ph = (v * PI) / 180, wx = P.target[0] - P.L[2] * Math.cos(ph), wy = P.target[1] - P.L[2] * Math.sin(ph);
          const s = ik2(P.L[0], P.L[1], wx, wy, P.th[1] >= 0) || ik2(P.L[0], P.L[1], wx, wy, P.th[1] < 0);
          if (s) { P.phi = ph; P.th = [s[0], s[1], wrap(ph - s[0] - s[1])]; P.ghosts = []; P.hist = []; st.req(); report(); }
        } });
        else SK.btn(ctrl2, '해석해로 보내기(팔꿈치 위)', () => { const s = ik2(P.L[0], P.L[1], P.target[0], P.target[1], true); if (s) { P.th = s; P.ghosts = []; P.hist = []; st.req(); report(); } });
      };
      SK.seg(ctrl, { label: '팔', options: [['2r', '2R'], ['3r', '3R 여유 팔']], value: P.mode, on: setMode });
      SK.btn(ctrl, '한 걸음', () => { anim = null; nrStep(); st.req(); report(); }, 'primary');
      SK.btn(ctrl, '수렴할 때까지', () => { anim = { t: 0.45 }; loop.start(); });
      SK.btn(ctrl, '출발 자세로', () => { anim = null; if (P.th0) P.th = P.th0.slice(); P.ghosts = []; P.hist = []; st.req(); report(); });
      setMode(P.mode);
      SK.drag(st, {
        pick(x, y) {
          const Mp = SK.fitMap(st.w, st.h, box(), 12);
          if (Math.hypot(x - Mp.X(P.target[0]), y - Mp.Y(P.target[1])) < 16) return 't';
          const pts = fkN(P.L, P.th);
          for (let i = pts.length - 1; i >= 1; i--) if (Math.hypot(x - Mp.X(pts[i][0]), y - Mp.Y(pts[i][1])) < 16) return 'j' + (i - 1);
          return null;
        },
        start() { anim = null; },
        move(hd, x, y) {
          const Mp = SK.fitMap(st.w, st.h, box(), 12), wx = Mp.ix(x), wy = Mp.iy(y);
          if (hd === 't') { P.target = [wx, wy]; }
          else { // turn joint i so that its link points at the cursor
            const i = +hd.slice(1), pts = fkN(P.L, P.th), p = pts[i];
            const before = P.th.slice(0, i).reduce((a, b) => a + b, 0);
            P.th[i] = wrap(Math.atan2(wy - p[1], wx - p[0]) - before);
            P.th0 = P.th.slice();
          }
          P.ghosts = []; P.hist = []; st.req(); report();
        },
      });
    },
  };

  // ======================================================================================
  // 2R 팔의 동역학: τ = M(θ)θ̈ + c(θ, θ̇) + g(θ), 자유 운동과 제어
  // ======================================================================================
  S.dynamics = {
    title: '2R 팔의 동역학과 제어',
    ch: 'ch13', k: '8.1',
    desc: '13단원 예제 1의 팔(링크 끝에 점질량 $m_1,m_2$)을 운동 방정식 $\\tau=M(\\theta)\\ddot\\theta+c(\\theta,\\dot\\theta)+g(\\theta)$ 그대로 적분합니다(룽게-쿠타 4차). 토크를 주지 않으면 이중 진자처럼 흔들리고, 제어 모드에서는 흐린 목표 자세로 팔을 보냅니다. 팔을 끌어 놓으면 그 자세에서 다시 출발합니다.',
    tries: [
      '‘토크 0’에서 ‘쌍둥이 팔’을 켜 보세요. 처음 각이 0.001 rad만 다른 두 팔이 몇 초 뒤 전혀 다르게 움직입니다. 그래도 에너지 E는 일정합니다.',
      '‘PD’로 목표에 보내면 중력 때문에 목표보다 조금 아래에서 멈춥니다(정상 상태 오차). ‘PD + 중력 보상’은 g(θ)를 더해 이 오차를 없앱니다.',
      '‘계산 토크’는 M, c, g를 모두 써서 두 관절이 서로 간섭하지 않고 같은 빠르기로 목표에 갑니다.',
      '팔을 수평으로 펴서 놓고 아래 행렬 M(θ)를 보세요. θ₂를 바꾸면 m₁₁이 바뀝니다 — 팔을 펼수록 첫 관절이 무겁습니다.',
    ],
    mount(stage) {
      const st = SK.canvas(stage, { ratio: 0.55, min: 280, max: 430, label: '2R 팔의 동역학' });
      const pl = SK.canvas(stage, { ratio: 0.22, min: 110, max: 170, label: '관절각의 시간 그래프' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const P = { m: [1, 1], L: [1, 1], g: 9.81, b: 0, mode: 'free', twin: false, q: [0.4, 0.6], dq: [0, 0], q2: [0.401, 0.6], dq2: [0, 0], qd: [PI / 4, PI / 3], t: 0, run: true, hist: [], drag: false, E0: null, tau: [0, 0] };
      const dyn = (q, dq) => {
        const [m1, m2] = P.m, [L1, L2] = P.L, c2 = Math.cos(q[1]), s2 = Math.sin(q[1]);
        const M11 = m1 * L1 * L1 + m2 * (L1 * L1 + 2 * L1 * L2 * c2 + L2 * L2), M12 = m2 * (L1 * L2 * c2 + L2 * L2), M22 = m2 * L2 * L2;
        const cv = [-m2 * L1 * L2 * s2 * (2 * dq[0] * dq[1] + dq[1] * dq[1]), m2 * L1 * L2 * s2 * dq[0] * dq[0]];
        const gv = [(m1 + m2) * L1 * P.g * Math.cos(q[0]) + m2 * P.g * L2 * Math.cos(q[0] + q[1]), m2 * P.g * L2 * Math.cos(q[0] + q[1])];
        return { Mm: [[M11, M12], [M12, M22]], cv, gv };
      };
      const control = (q, dq, d) => {
        if (P.mode === 'free') return [0, 0];
        const e = [wrap(P.qd[0] - q[0]), wrap(P.qd[1] - q[1])];
        if (P.mode === 'ct') { const a = [25 * e[0] - 10 * dq[0], 25 * e[1] - 10 * dq[1]]; return [d.Mm[0][0] * a[0] + d.Mm[0][1] * a[1] + d.cv[0] + d.gv[0], d.Mm[1][0] * a[0] + d.Mm[1][1] * a[1] + d.cv[1] + d.gv[1]]; }
        const pd = [40 * e[0] - 10 * dq[0], 25 * e[1] - 6 * dq[1]];
        return P.mode === 'pdg' ? [pd[0] + d.gv[0], pd[1] + d.gv[1]] : pd;
      };
      const acc = (q, dq, out2) => {
        const d = dyn(q, dq), tau = control(q, dq, d);
        if (out2) out2.tau = tau;
        const rhs = [tau[0] - d.cv[0] - d.gv[0] - P.b * dq[0], tau[1] - d.cv[1] - d.gv[1] - P.b * dq[1]];
        return M.mv(M.inv2(d.Mm), rhs);
      };
      const rk4 = (q, dq, h) => {
        const k1v = acc(q, dq), k1x = dq;
        const q2 = [q[0] + (h / 2) * k1x[0], q[1] + (h / 2) * k1x[1]], d2 = [dq[0] + (h / 2) * k1v[0], dq[1] + (h / 2) * k1v[1]];
        const k2v = acc(q2, d2), k2x = d2;
        const q3 = [q[0] + (h / 2) * k2x[0], q[1] + (h / 2) * k2x[1]], d3 = [dq[0] + (h / 2) * k2v[0], dq[1] + (h / 2) * k2v[1]];
        const k3v = acc(q3, d3), k3x = d3;
        const q4 = [q[0] + h * k3x[0], q[1] + h * k3x[1]], d4 = [dq[0] + h * k3v[0], dq[1] + h * k3v[1]];
        const k4v = acc(q4, d4), k4x = d4;
        return [[0, 1].map((i) => q[i] + (h / 6) * (k1x[i] + 2 * k2x[i] + 2 * k3x[i] + k4x[i])), [0, 1].map((i) => dq[i] + (h / 6) * (k1v[i] + 2 * k2v[i] + 2 * k3v[i] + k4v[i]))];
      };
      const energy = (q, dq) => {
        const d = dyn(q, dq), K = 0.5 * (dq[0] * (d.Mm[0][0] * dq[0] + d.Mm[0][1] * dq[1]) + dq[1] * (d.Mm[1][0] * dq[0] + d.Mm[1][1] * dq[1]));
        const y1 = P.L[0] * Math.sin(q[0]), y2 = y1 + P.L[1] * Math.sin(q[0] + q[1]);
        return K + P.m[0] * P.g * y1 + P.m[1] * P.g * y2;
      };
      const trails = [[], []];
      const step = (dt) => {
        if (!P.run || P.drag) return true;
        const h = 1 / 500, n = Math.max(1, Math.round(dt / h));
        for (let i = 0; i < n; i++) {
          [P.q, P.dq] = rk4(P.q, P.dq, h);
          if (P.twin && P.mode === 'free') [P.q2, P.dq2] = rk4(P.q2, P.dq2, h);
          P.t += h;
        }
        const o = {}; acc(P.q, P.dq, o); P.tau = o.tau;
        P.hist.push([P.t, P.q[0], P.q[1]]); while (P.hist.length && P.t - P.hist[0][0] > 8) P.hist.shift();
        const tip = (q) => { const p = fkN(P.L, q); return p[2]; };
        trails[0].push(tip(P.q)); if (trails[0].length > 260) trails[0].shift();
        if (P.twin && P.mode === 'free') { trails[1].push(tip(P.q2)); if (trails[1].length > 260) trails[1].shift(); } else trails[1] = [];
        st.now(); pl.now(); report();
        return true;
      };
      const loop = SK.loop(stage, step);
      const box = [-2.3, 2.3, -2.25, 2.25];
      st.draw = (ctx, w, h, C) => {
        const Mp = SK.fitMap(w, h, box, 10), X = Mp.X, Y = Mp.Y;
        ctx.strokeStyle = C.faint; ctx.lineWidth = 1; SK.line(ctx, X(-2.2), Y(0), X(2.2), Y(0));
        SK.text(ctx, P.g ? '중력 ↓' : '중력 없음(수평면)', 12, 16, { c: C.ink3, s: 11.5, w: 600 });
        trails.forEach((tr, k) => {
          if (tr.length < 2) return;
          ctx.strokeStyle = SK.alpha(k ? C.blue : C.acc, 0.7); ctx.lineWidth = 1.4; ctx.beginPath();
          tr.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke();
        });
        if (P.mode !== 'free') drawArm(ctx, X, Y, fkN(P.L, P.qd), SK.alpha(C.ok, 0.6), 4, C, { dash: [6, 5] });
        base(ctx, X, Y, C);
        if (P.twin && P.mode === 'free') { const p2 = fkN(P.L, P.q2); drawArm(ctx, X, Y, p2, SK.alpha(C.blue, 0.75), 5, C); SK.dot(ctx, X(p2[1][0]), Y(p2[1][1]), 4 + 3 * P.m[0], C.blue, null); SK.dot(ctx, X(p2[2][0]), Y(p2[2][1]), 4 + 3 * P.m[1], C.blue, null); }
        const p = fkN(P.L, P.q);
        drawArm(ctx, X, Y, p, C.ink, 6, C);
        SK.dot(ctx, X(p[1][0]), Y(p[1][1]), 4 + 3 * P.m[0], C.acc, C.ink, 1.5);
        SK.dot(ctx, X(p[2][0]), Y(p[2][1]), 4 + 3 * P.m[1], C.acc, C.ink, 1.5);
        if (P.mode !== 'free') SK.text(ctx, '초록 점선: 목표(끝을 끌어 옮기기)', 12, h - 12, { c: C.ink3, s: 11 });
        else SK.text(ctx, '팔을 끌어 놓으면 그 자세에서 출발', 12, h - 12, { c: C.ink3, s: 11 });
      };
      pl.draw = (ctx, w, h, C) => {
        const pad = 26, t1 = P.t, t0 = t1 - 8;
        const X = (t) => pad + ((t - t0) / 8) * (w - pad - 8), Y = (a) => h / 2 - (a / PI) * (h / 2 - 12);
        ctx.strokeStyle = C.faint; ctx.lineWidth = 1; SK.line(ctx, pad, Y(0), w - 8, Y(0)); SK.line(ctx, pad, Y(PI), w - 8, Y(PI)); SK.line(ctx, pad, Y(-PI), w - 8, Y(-PI));
        SK.text(ctx, 'π', pad - 6, Y(PI), { c: C.ink3, s: 10.5, a: 'right' }); SK.text(ctx, '0', pad - 6, Y(0), { c: C.ink3, s: 10.5, a: 'right' }); SK.text(ctx, '−π', pad - 6, Y(-PI), { c: C.ink3, s: 10.5, a: 'right' });
        [[1, C.acc, 'θ₁'], [2, C.blue2, 'θ₂']].forEach(([k, col, n]) => {
          ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); let pen = false, last = null;
          P.hist.forEach((r) => { const a = wrap(r[k]); if (pen && Math.abs(a - last) < PI) ctx.lineTo(X(r[0]), Y(a)); else ctx.moveTo(X(r[0]), Y(a)); pen = true; last = a; });
          ctx.stroke();
          if (P.mode !== 'free') { ctx.setLineDash([4, 4]); ctx.strokeStyle = SK.alpha(col, 0.7); SK.line(ctx, pad, Y(wrap(P.qd[k - 1])), w - 8, Y(wrap(P.qd[k - 1]))); ctx.setLineDash([]); }
          SK.text(ctx, n, w - 14, Y(wrap(P.q[k - 1])) - 8, { c: col, s: 11.5, w: 700, a: 'right', halo: C.paper });
        });
        SK.text(ctx, '지난 8초', pad + 4, 10, { c: C.ink3, s: 10.5 });
      };
      const report = () => {
        const d = dyn(P.q, P.dq), E = energy(P.q, P.dq);
        out.innerHTML = `<div class="row"><span>${SK.tex(`M(\\theta)=${SK.texMat(d.Mm, 2)}`)}</span><span>${SK.tex(`c=${SK.texMat([[d.cv[0]], [d.cv[1]]], 2)}`)}</span><span>${SK.tex(`g=${SK.texMat([[d.gv[0]], [d.gv[1]]], 2)}`)}</span><span>${SK.tex(`\\tau=${SK.texMat([[P.tau[0]], [P.tau[1]]], 2)}`)}</span></div>
          <div class="row"><span>에너지 ${SK.tex(`E=\\mathcal K+\\mathcal P=${E.toFixed(3)}`)} J${P.mode === 'free' && !P.b && P.E0 != null ? ` (처음과의 차이 ${(E - P.E0).toExponential(1)})` : ''}</span><span>t = ${P.t.toFixed(1)} s</span></div>`;
      };
      const reset = (q) => { P.q = q.slice(); P.dq = [0, 0]; P.q2 = [q[0] + 0.001, q[1]]; P.dq2 = [0, 0]; P.E0 = energy(P.q, P.dq); trails[0] = []; trails[1] = []; };
      SK.seg(ctrl, { label: '토크', options: [['free', '토크 0'], ['pd', 'PD'], ['pdg', 'PD + 중력 보상'], ['ct', '계산 토크']], value: P.mode, on: (v) => { P.mode = v; P.E0 = energy(P.q, P.dq); twin.el.style.display = v === 'free' ? '' : 'none'; st.req(); report(); } });
      const run = SK.btn(ctrl, '❚❚ 멈추기', () => { P.run = !P.run; run.textContent = P.run ? '❚❚ 멈추기' : '▶ 계속'; if (P.run) loop.start(); });
      SK.btn(ctrl, '처음 자세로', () => { reset([0.4, 0.6]); P.t = 0; P.hist = []; st.req(); pl.req(); report(); });
      const twin = SK.check(ctrl, '쌍둥이 팔(0.001 rad 차이)', false, (v) => { P.twin = v; P.q2 = [P.q[0] + 0.001, P.q[1]]; P.dq2 = P.dq.slice(); trails[1] = []; });
      SK.slider(ctrl2, { label: 'm₁', min: 0.2, max: 3, step: 0.1, value: 1, fmt: (v) => `${v.toFixed(1)} kg`, on: (v) => { P.m[0] = v; P.E0 = energy(P.q, P.dq); } });
      SK.slider(ctrl2, { label: 'm₂', min: 0.2, max: 3, step: 0.1, value: 1, fmt: (v) => `${v.toFixed(1)} kg`, on: (v) => { P.m[1] = v; P.E0 = energy(P.q, P.dq); } });
      SK.slider(ctrl2, { label: '관절 마찰 b', min: 0, max: 2, step: 0.05, value: 0, on: (v) => { P.b = v; } });
      SK.check(ctrl2, '중력', true, (v) => { P.g = v ? 9.81 : 0; P.E0 = energy(P.q, P.dq); });
      reset(P.q); report();
      loop.start();
      SK.drag(st, {
        pick(x, y) {
          const Mp = SK.fitMap(st.w, st.h, box, 10);
          if (P.mode !== 'free') { const pd = fkN(P.L, P.qd)[2]; if (Math.hypot(x - Mp.X(pd[0]), y - Mp.Y(pd[1])) < 16) return 'goal'; }
          const p = fkN(P.L, P.q);
          if (Math.hypot(x - Mp.X(p[2][0]), y - Mp.Y(p[2][1])) < 18) return 'tip';
          if (Math.hypot(x - Mp.X(p[1][0]), y - Mp.Y(p[1][1])) < 18) return 'elbow';
          return null;
        },
        start(hd) { if (hd !== 'goal') P.drag = true; },
        move(hd, x, y) {
          const Mp = SK.fitMap(st.w, st.h, box, 10), wx = Mp.ix(x), wy = Mp.iy(y);
          if (hd === 'goal') { const R = Math.min(Math.hypot(wx, wy), 1.999), k = R / (Math.hypot(wx, wy) || 1), s = ik2(1, 1, wx * k, wy * k, true); if (s) P.qd = s; }
          else if (hd === 'elbow') { reset([Math.atan2(wy, wx), P.q[1]]); }
          else { const R = Math.min(Math.hypot(wx, wy), 1.999), k = R / (Math.hypot(wx, wy) || 1), s = ik2(1, 1, wx * k, wy * k, P.q[1] >= 0); if (s) reset(s); }
          st.req(); report();
        },
        end() { P.drag = false; P.E0 = energy(P.q, P.dq); },
      });
    },
  };

  // ======================================================================================
  // 궤적 생성: 경로 × 시간 스케일링
  // ======================================================================================
  S.trajectory = {
    title: '궤적: 경로와 시간 스케일링',
    ch: 'ch14', k: '9.2a',
    desc: '2R 팔을 출발점(○)에서 도착점(◎)으로 보냅니다. 경로는 **관절 공간의 직선**(관절각을 일정 비율로 보간) 또는 **작업 공간의 직선**(끝점이 곧게, 관절각은 역기구학), 시간 스케일링은 3차·5차 다항식과 사다리꼴 중에서 고릅니다. 아래 그래프는 $s(t)$, $\\dot s(t)$, $\\ddot s(t)$입니다.',
    tries: [
      '관절 공간 직선과 작업 공간 직선을 번갈아 골라 끝점이 지나는 길(점선/실선)을 비교해 보세요.',
      '3차 다항식은 양 끝에서 가속도 $\\ddot s$가 0이 아닌 값으로 갑자기 시작합니다. 5차로 바꾸면 가속도도 0에서 시작합니다.',
      '사다리꼴에서 속도 비 vT를 2에 가깝게 하면 등속 구간이 사라져 삼각형 속도가 됩니다(vT = 2).',
      '도착점을 출발점의 반대편으로 끌어 작업 공간 직선이 원점 근처(안쪽 경계)를 지나게 해 보세요. 역기구학이 실패하는 구간이 생깁니다.',
    ],
    mount(stage) {
      const st = SK.canvas(stage, { ratio: 0.52, min: 260, max: 420, label: '2R 팔의 궤적' });
      const pl = SK.canvas(stage, { ratio: 0.3, min: 150, max: 220, label: '시간 스케일링 그래프' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const L = [1, 0.8];
      const P = { a: [1.35, 0.35], b: [-0.6, 1.25], path: 'joint', sc: 'cubic', T: 3, vT: 1.5, t: 0, play: false };
      const scale = (t) => {
        const T = P.T, u = Math.max(0, Math.min(1, t / T));
        if (P.sc === 'cubic') return [3 * u * u - 2 * u ** 3, (6 * u - 6 * u * u) / T, (6 - 12 * u) / (T * T)];
        if (P.sc === 'quintic') return [10 * u ** 3 - 15 * u ** 4 + 6 * u ** 5, (30 * u * u - 60 * u ** 3 + 30 * u ** 4) / T, (60 * u - 180 * u * u + 120 * u ** 3) / (T * T)];
        const v = P.vT / T, a = (v * v) / (v * T - 1), ta = v / a, tt = Math.max(0, Math.min(T, t));
        if (tt < ta) return [0.5 * a * tt * tt, a * tt, a];
        if (tt <= T - ta) return [v * tt - (v * v) / (2 * a), v, 0];
        const r = T - tt; return [1 - 0.5 * a * r * r, a * r, -a];
      };
      const thA = () => ik2(L[0], L[1], P.a[0], P.a[1], true), thB = () => ik2(L[0], L[1], P.b[0], P.b[1], true);
      const at = (s) => {
        if (P.path === 'joint') { const A = thA(), B = thB(); if (!A || !B) return null; let d1 = wrap(B[0] - A[0]), d2 = B[1] - A[1]; return [A[0] + s * d1, A[1] + s * d2]; }
        return ik2(L[0], L[1], P.a[0] + s * (P.b[0] - P.a[0]), P.a[1] + s * (P.b[1] - P.a[1]), true);
      };
      const box = [-2.0, 2.0, -0.9, 2.0];
      const tipPath = (mode) => { const save = P.path; P.path = mode; const pts = []; for (let k = 0; k <= 80; k++) { const q = at(k / 80); pts.push(q ? fkN(L, q)[2] : null); } P.path = save; return pts; };
      st.draw = (ctx, w, h, C) => {
        const Mp = SK.fitMap(w, h, box, 10), X = Mp.X, Y = Mp.Y;
        ctx.fillStyle = SK.alpha(C.blue, 0.06); ctx.beginPath(); ctx.arc(X(0), Y(0), 1.8 * Mp.s, 0, TAU); ctx.arc(X(0), Y(0), 0.2 * Mp.s, 0, TAU, true); ctx.fill();
        ['joint', 'task'].forEach((m) => {
          const pts = tipPath(m);
          ctx.strokeStyle = m === P.path ? C.acc : SK.alpha(C.ink3, 0.6); ctx.lineWidth = m === P.path ? 2.2 : 1.2; ctx.setLineDash(m === P.path ? [] : [5, 5]);
          ctx.beginPath(); let pen = false; pts.forEach((p) => { if (!p) { pen = false; return; } if (pen) ctx.lineTo(X(p[0]), Y(p[1])); else { ctx.moveTo(X(p[0]), Y(p[1])); pen = true; } }); ctx.stroke(); ctx.setLineDash([]);
        });
        base(ctx, X, Y, C);
        const q = at(scale(P.t)[0]);
        if (q) drawArm(ctx, X, Y, fkN(L, q), C.ink, 7, C);
        else SK.text(ctx, '이 구간은 역기구학 해가 없음!', w / 2, 16, { c: C.bad, s: 12.5, w: 700, a: 'center' });
        SK.dot(ctx, X(P.a[0]), Y(P.a[1]), 8, C.paper3, C.ink, 2.2);
        SK.dot(ctx, X(P.b[0]), Y(P.b[1]), 8, C.paper3, C.acc, 2.2); SK.dot(ctx, X(P.b[0]), Y(P.b[1]), 3.5, C.acc, null);
        SK.text(ctx, '출발', X(P.a[0]) + 12, Y(P.a[1]) + 12, { c: C.ink2, s: 11.5, w: 600, halo: C.paper });
        SK.text(ctx, '도착', X(P.b[0]) + 12, Y(P.b[1]) - 12, { c: C.accInk, s: 11.5, w: 600, halo: C.paper });
        SK.text(ctx, '실선: 지금 경로 · 점선: 다른 경로', 12, h - 12, { c: C.ink3, s: 11 });
      };
      pl.draw = (ctx, w, h, C) => {
        const T = P.T, n = 3, gap = 10, pw = (w - 16 - gap * (n - 1)) / n;
        const series = [['s(t)', 0, C.ink], ['ṡ(t)', 1, C.acc], ['s̈(t)', 2, C.blue2]];
        series.forEach(([name, k, col], i) => {
          const x0 = 8 + i * (pw + gap), y0 = 20, ph = h - 34;
          const vals = []; for (let j = 0; j <= 120; j++) vals.push(scale((T * j) / 120)[k]);
          let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals); if (hi - lo < 1e-9) hi = lo + 1;
          const X = (t) => x0 + (t / T) * pw, Y = (v) => y0 + ph - ((v - lo) / (hi - lo)) * ph;
          ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, pw, ph); SK.line(ctx, x0, Y(0), x0 + pw, Y(0));
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); vals.forEach((v, j) => { const x = X((T * j) / 120), y = Y(v); if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
          ctx.strokeStyle = C.bad; ctx.lineWidth = 1.2; SK.line(ctx, X(P.t), y0, X(P.t), y0 + ph);
          SK.text(ctx, name, x0 + 4, 9, { c: col, s: 11.5, w: 700 });
          SK.text(ctx, `최대 ${Math.max(...vals.map(Math.abs)).toFixed(2)}`, x0 + pw, 9, { c: C.ink3, s: 10.5, a: 'right' });
        });
      };
      const report = () => {
        const T = P.T;
        let f = '';
        if (P.sc === 'cubic') f = `s=3(t/T)^2-2(t/T)^3,\\ \\dot s_{\\max}=\\tfrac{3}{2T}=${(1.5 / T).toFixed(3)},\\ \\lvert\\ddot s\\rvert_{\\max}=\\tfrac{6}{T^2}=${(6 / T / T).toFixed(3)}`;
        else if (P.sc === 'quintic') f = `s=10(t/T)^3-15(t/T)^4+6(t/T)^5,\\ \\dot s_{\\max}=\\tfrac{15}{8T}=${(15 / 8 / T).toFixed(3)},\\ \\lvert\\ddot s\\rvert_{\\max}=\\tfrac{10}{\\sqrt3T^2}=${(10 / Math.sqrt(3) / T / T).toFixed(3)}`;
        else { const v = P.vT / T, a = (v * v) / (v * T - 1); f = `v=${v.toFixed(3)},\\ a=\\tfrac{v^2}{vT-1}=${a.toFixed(3)},\\ T=\\tfrac{a+v^2}{va}=${((a + v * v) / (v * a)).toFixed(2)}\\ \\text{s},\\ \\text{등속 구간 }${Math.max(0, T - 2 * v / a).toFixed(2)}\\ \\text{s}`; }
        out.innerHTML = `<div class="row"><span>${SK.tex(f)}</span></div><div class="row"><span>${SK.tex(`t=${P.t.toFixed(2)}\\ \\text{s},\\ s=${scale(P.t)[0].toFixed(3)}`)}</span><span>경로: ${P.path === 'joint' ? SK.tex('\\theta(s)=\\theta_{\\text{start}}+s(\\theta_{\\text{end}}-\\theta_{\\text{start}})') : SK.tex('x(s)=x_{\\text{start}}+s(x_{\\text{end}}-x_{\\text{start}})') + ', 관절각은 역기구학'}</span></div>`;
      };
      const loop = SK.loop(stage, (dt) => {
        if (!P.play) return false;
        P.t += dt; if (P.t > P.T + 0.6) P.t = 0;
        tS.set(Math.min(P.t, P.T), true); st.now(); pl.now(); report(); return true;
      });
      SK.seg(ctrl, { label: '경로', options: [['joint', '관절 공간 직선'], ['task', '작업 공간 직선']], value: P.path, on: (v) => { P.path = v; st.req(); report(); } });
      SK.seg(ctrl, { label: '시간 스케일링', options: [['cubic', '3차'], ['quintic', '5차'], ['trap', '사다리꼴']], value: P.sc, on: (v) => { P.sc = v; vS.el.style.display = v === 'trap' ? '' : 'none'; st.req(); pl.req(); report(); } });
      const pb = SK.btn(ctrl, '▶ 움직이기', () => { P.play = !P.play; pb.textContent = P.play ? '❚❚ 멈추기' : '▶ 움직이기'; if (P.play) { if (P.t >= P.T) P.t = 0; loop.start(); } }, 'primary');
      SK.slider(ctrl2, { label: '걸리는 시간 T', min: 1, max: 6, step: 0.1, value: P.T, fmt: (v) => `${v.toFixed(1)} s`, on: (v) => { P.T = v; P.t = Math.min(P.t, v); tS.input.max = v; st.req(); pl.req(); report(); } });
      const tS = SK.slider(ctrl2, { label: '시각 t', min: 0, max: P.T, step: 0.01, value: 0, fmt: (v) => `${v.toFixed(2)} s`, on: (v) => { P.t = v; st.req(); pl.req(); report(); } });
      const vS = SK.slider(ctrl2, { label: '속도 비 vT', min: 1.05, max: 2, step: 0.01, value: P.vT, on: (v) => { P.vT = v; st.req(); pl.req(); report(); } });
      vS.el.style.display = 'none';
      report();
      SK.drag(st, {
        pick(x, y) { const Mp = SK.fitMap(st.w, st.h, box, 10); if (Math.hypot(x - Mp.X(P.b[0]), y - Mp.Y(P.b[1])) < 16) return 'b'; if (Math.hypot(x - Mp.X(P.a[0]), y - Mp.Y(P.a[1])) < 16) return 'a'; return null; },
        move(hd, x, y) {
          const Mp = SK.fitMap(st.w, st.h, box, 10); let wx = Mp.ix(x), wy = Mp.iy(y);
          const r = Math.hypot(wx, wy), k = Math.max(0.21, Math.min(1.79, r)) / (r || 1); wx *= k; wy *= k;
          P[hd] = [wx, wy]; st.req(); pl.req(); report();
        },
      });
    },
  };
})();
