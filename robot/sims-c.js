/* 로봇공학 시뮬레이션 C — 강체 운동과 정기구학(3차원): 회전(축-각, 앞곱·뒷곱), 나사 운동, 지수곱 정기구학(평면 3R, UR5).
   3차원은 원점 둘레를 도는 정사영 카메라(SimKit.cam)로 그리고, 빈 곳을 끌면 시점이 돕니다. */
(function () {
  const SK = window.SimKit;
  if (!SK) return;
  const S = (window.SITE_SIMS = window.SITE_SIMS || {});
  const { V, M } = SK;
  const PI = Math.PI, TAU = 2 * PI;
  const rad = (d) => (d * PI) / 180, deg = (r) => (r * 180) / PI;
  const axisFrom = (az, el) => [Math.cos(rad(el)) * Math.cos(rad(az)), Math.cos(rad(el)) * Math.sin(rad(az)), Math.sin(rad(el))];
  const T4 = (R, p) => [[R[0][0], R[0][1], R[0][2], p[0]], [R[1][0], R[1][1], R[1][2], p[1]], [R[2][0], R[2][1], R[2][2], p[2]], [0, 0, 0, 1]];

  // a box (half sizes hs) at pose T, offset c in the body frame; only faces turned to the camera are drawn
  function box3(ctx, cam, T, hs, c, fill, stroke, alpha = 1) {
    const R = M.R(T), p = [T[0][3], T[1][3], T[2][3]], f = cam.basis().f;
    const corner = (sx, sy, sz) => M.app(T, [c[0] + sx * hs[0], c[1] + sy * hs[1], c[2] + sz * hs[2]]);
    const faces = [[[1, 0, 0], [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[-1, 0, 0], [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]],
      [[0, 1, 0], [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]]], [[0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]],
      [[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]], [[0, 0, -1], [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]]]];
    void p;
    faces.forEach(([nb, cs]) => {
      const nw = M.mv(R, nb), d = nw[0] * f[0] + nw[1] * f[1] + nw[2] * f[2];
      if (d <= 0) return;
      ctx.beginPath();
      cs.forEach((s, i) => { const q = cam.P(corner(...s)); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
      ctx.globalAlpha = alpha * (0.35 + 0.5 * d); ctx.fillStyle = fill; ctx.fill();
      ctx.globalAlpha = alpha; ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }
  function floor(ctx, cam, C, n = 4, step = 0.5, z = 0, cx = 0, cy = 0) {
    ctx.strokeStyle = C.faint; ctx.lineWidth = 1;
    for (let k = -n; k <= n; k++) {
      const a = cam.P([cx + k * step, cy - n * step, z]), b = cam.P([cx + k * step, cy + n * step, z]); SK.line(ctx, a[0], a[1], b[0], b[1]);
      const c = cam.P([cx - n * step, cy + k * step, z]), d = cam.P([cx + n * step, cy + k * step, z]); SK.line(ctx, c[0], c[1], d[0], d[1]);
    }
  }
  const seg3 = (ctx, cam, a, b) => { const A = cam.P(a), B = cam.P(b); SK.line(ctx, A[0], A[1], B[0], B[1]); };

  // ======================================================================================
  // 회전: 축과 각(지수 좌표), 앞곱과 뒷곱
  // ======================================================================================
  S.rotation = {
    title: '회전 행렬: 축-각과 곱하는 순서',
    ch: 'ch06', k: '3.2.3a',
    desc: '상자에 붙은 물체 좌표계 {b}를 돌립니다. **축과 각** 모드에서는 단위 축 $\\hat\\omega$ 둘레로 $\\theta$만큼 돌린 회전 $e^{[\\hat\\omega]\\theta}$(로드리게스 공식)를, **곱하는 순서** 모드에서는 같은 90° 회전을 고정 좌표계 축 둘레로(앞곱) 또는 물체 좌표계 축 둘레로(뒷곱) 적용해 결과를 비교합니다. 빈 곳을 끌면 시점이 돕니다.',
    tries: [
      '축과 각 모드에서 θ를 움직이면 세 축의 끝이 축 $\\hat\\omega$에 수직인 원을 그립니다. 축 위의 점만 움직이지 않습니다.',
      '축을 $\\hat\\omega=\\frac1{\\sqrt3}(1,1,1)$ 근처(방위 45°, 고도 35°)로 두고 θ = 120°로 하면 x→y→z→x로 축이 돌아갑니다(6단원 예제 2).',
      '곱하는 순서 모드에서 ‘ẑ +90°’ 다음 ‘x̂ +90°’를, 앞곱과 뒷곱으로 각각 해 보세요(5단원 예제 2). 결과 행렬이 다릅니다.',
      '오른쪽 행렬의 대각합 tr R = 1 + 2cos θ를 확인해 보세요. 행렬 로그는 여기서 θ를 되찾습니다.',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.62, min: 280, max: 470, label: '3차원 회전' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const cam = SK.cam({ yaw: 0.72, pitch: 0.42 });
      const P = { mode: arg === 'compose' ? 'compose' : 'axis', az: 45, el: 35.26, th: 70, R: M.I(3), anim: null, ops: [], frame: 's', play: false };
      const curR = () => (P.mode === 'axis' ? M.rot(axisFrom(P.az, P.el), rad(P.th)) : P.anim ? P.anim.R : P.R);
      st.draw = (ctx, w, h, C) => {
        cam.s = Math.min(w, h) * 0.36; cam.cx = w / 2; cam.cy = h / 2 + 10;
        floor(ctx, cam, C, 3, 0.5, -0.6);
        const I = { R: M.I(3), p: [0, 0, 0] };
        SK.axes3(ctx, cam, I, 1.35, C, { faint: true, labels: ['x_s', 'y_s', 'z_s'].map((s) => s.replace('_s', 'ₛ')), w: 1.4, head: 7 });
        const R = curR();
        box3(ctx, cam, T4(R, [0, 0, 0]), [0.55, 0.34, 0.16], [0, 0, 0], C.acc, C.ink2, 0.5);
        // rotation axis (over the box, so it stays visible)
        let ax = null;
        if (P.mode === 'axis') ax = axisFrom(P.az, P.el);
        else if (P.anim) ax = P.anim.axisW;
        if (ax) {
          ctx.save(); ctx.strokeStyle = C.accInk; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]); seg3(ctx, cam, V.sc(ax, -1.6), V.sc(ax, 1.6)); ctx.restore();
          const a = cam.P([0, 0, 0]), b = cam.P(V.sc(ax, 1.6));
          SK.arrow(ctx, a[0], a[1], b[0], b[1], C.acc, 2.6, 11);
          SK.text(ctx, 'ω̂', b[0] + 8, b[1] - 8, { c: C.accInk, s: 14, w: 700, halo: C.paper });
        }
        // arcs swept by the axis tips (axis mode)
        if (P.mode === 'axis' && Math.abs(P.th) > 0.5) {
          const w0 = axisFrom(P.az, P.el);
          [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((e, k) => {
            ctx.strokeStyle = SK.alpha([C.x, C.y, C.z][k], 0.55); ctx.lineWidth = 1.2; ctx.beginPath();
            for (let i = 0; i <= 48; i++) { const q = cam.P(M.mv(M.rot(w0, (rad(P.th) * i) / 48), e)); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
            ctx.stroke();
          });
        }
        SK.axes3(ctx, cam, { R, p: [0, 0, 0] }, 1, C, { labels: ['x_b', 'y_b', 'z_b'].map((s) => s.replace('_b', 'ᵦ')), w: 2.6, head: 10 });
        SK.text(ctx, '빈 곳을 끌면 시점이 돕니다', 12, h - 12, { c: C.ink3, s: 11 });
      };
      const fmtOp = (o) => `\\mathrm{Rot}(\\hat ${o.ax},${o.d}^\\circ)`;
      const report = () => {
        const R = curR();
        let html = '';
        if (P.mode === 'axis') {
          const w = axisFrom(P.az, P.el), th = rad(P.th), tr = R[0][0] + R[1][1] + R[2][2];
          html += `<div class="row"><span>${SK.tex(`\\hat\\omega=${SK.texVec(w, 3)},\\quad\\theta=${P.th.toFixed(0)}^\\circ`)}</span><span>${SK.tex(`\\operatorname{tr}R=${tr.toFixed(3)}=1+2\\cos\\theta`)}</span></div>
            <div class="row"><span>${SK.tex(`R=e^{[\\hat\\omega]\\theta}=I+\\sin\\theta\\,[\\hat\\omega]+(1-\\cos\\theta)[\\hat\\omega]^2=${SK.texMat(R, 3)}`, true)}</span></div>
            <div class="sim-note">지수 좌표 ${SK.tex(`\\hat\\omega\\theta=${SK.texVec(V.sc(w, th), 3)}`)} — 세 수로 회전 하나를 적습니다.</div>`;
        } else {
          const f = P.ops.length ? P.ops.reduce((s, o) => (o.pre ? `${fmtOp(o)}\\,${s}` : `${s}\\,${fmtOp(o)}`), '') : 'I';
          html += `<div class="row"><span>${SK.tex(`R=${f.replace(/^\\,|\\,$/g, '')}=${SK.texMat(R, 2)}`, true)}</span></div>
            <div class="sim-note">앞곱(왼쪽에 곱함) = 고정 좌표계 {s}의 축 둘레, 뒷곱(오른쪽에 곱함) = 지금 물체 좌표계 {b}의 축 둘레. ${SK.tex('R')}의 열은 {s}에서 본 ${SK.tex('\\hat x_b,\\hat y_b,\\hat z_b')}입니다.</div>`;
        }
        out.innerHTML = html;
      };
      const loop = SK.loop(stage, (dt) => {
        if (P.mode === 'axis' && P.play) { P.th += 60 * dt; if (P.th > 180) P.th -= 360; thS.set(P.th, true); st.now(); report(); return true; }
        if (P.anim) {
          const a = P.anim; a.t = Math.min(1, a.t + dt / 0.7);
          const e = 1 - Math.pow(1 - a.t, 3), Rr = M.rot(a.axis, a.ang * e);
          a.R = a.pre ? M.mul(Rr, a.R0) : M.mul(a.R0, Rr);
          if (a.t >= 1) { P.R = a.R; P.anim = null; }
          st.now(); report();
          return !!P.anim;
        }
        return false;
      });
      let thS = null;
      const build = () => {
        ctrl2.innerHTML = '';
        if (P.mode === 'axis') {
          SK.slider(ctrl2, { label: '축의 방위각', min: -180, max: 180, step: 1, value: P.az, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.az = v; st.req(); report(); } });
          SK.slider(ctrl2, { label: '축의 고도', min: -90, max: 90, step: 0.5, value: P.el, fmt: (v) => `${v.toFixed(1)}°`, on: (v) => { P.el = v; st.req(); report(); } });
          thS = SK.slider(ctrl2, { label: '회전각 θ', min: -180, max: 180, step: 1, value: P.th, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.th = v; st.req(); report(); } });
          const pb = SK.btn(ctrl2, '▶ 돌리기', () => { P.play = !P.play; pb.textContent = P.play ? '❚❚ 멈추기' : '▶ 돌리기'; if (P.play) loop.start(); });
        } else {
          const fr = SK.seg(ctrl2, { label: '축을 읽는 좌표계', options: [['s', '고정 {s} · 앞곱'], ['b', '물체 {b} · 뒷곱']], value: P.frame, on: (v) => { P.frame = v; } });
          void fr;
          [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]].forEach(([n, e]) => SK.btn(ctrl2, `${n}̂ +90°`, () => {
            if (P.anim) { P.R = P.anim.R; P.anim = null; }
            const pre = P.frame === 's';
            P.ops.push({ ax: n, d: 90, pre });
            P.anim = { t: 0, axis: e, ang: PI / 2, pre, R0: P.R, R: P.R, axisW: pre ? e : M.mv(P.R, e) };
            loop.start();
          }));
          SK.btn(ctrl2, '초기화', () => { P.R = M.I(3); P.ops = []; P.anim = null; st.req(); report(); });
        }
      };
      SK.seg(ctrl, { label: '모드', options: [['axis', '축과 각'], ['compose', '곱하는 순서']], value: P.mode, on: (v) => { P.mode = v; P.play = false; P.anim = null; build(); st.req(); report(); } });
      build(); report();
      const orb = SK.orbit(st, cam, () => st.req());
      SK.drag(st, { pick: (x, y) => orb.pick(x, y), move: (h, x, y) => orb.move(h, x, y) });
    },
  };

  // ======================================================================================
  // 나사 운동: 축 둘레로 돌며 축 방향으로 미끄러지기, e^{[S]θ}
  // ======================================================================================
  S.screw = {
    title: '나사 운동과 행렬 지수',
    ch: 'ch08', k: '3.3.3a',
    desc: '나사 축(방향 $\\hat s$, 축 위의 점 $q$, 피치 $h$)을 따라 상자를 $\\theta$만큼 움직입니다. 상자는 축 둘레로 $\\theta$ 돌면서 축 방향으로 $h\\theta$ 미끄러지고, 그 결과가 동차 변환 $T=e^{[\\mathcal S]\\theta}T_0$입니다. 회색 상자가 처음 자세, 주황 곡선이 상자 원점이 지나는 나선입니다.',
    tries: [
      '피치 h = 0이면 상자는 축 둘레의 원을 그립니다(순수 회전). h를 키우면 나선이 늘어납니다.',
      '‘순수 병진’을 켜면 축의 방향으로만 움직입니다 — ω = 0, 피치는 무한대인 나사입니다.',
      '축 위의 점 q를 옮겨 보세요. 같은 방향·같은 각이라도 축의 위치에 따라 도착 자세가 다릅니다. 행렬의 회전 부분은 그대로이고 위치 부분만 바뀝니다.',
      'θ를 360°로 하면 회전 부분은 I로 돌아오고 위치는 축 방향으로 2πh만큼만 옮겨 갑니다.',
    ],
    mount(stage) {
      const st = SK.canvas(stage, { ratio: 0.62, min: 280, max: 470, label: '나사 운동' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const cam = SK.cam({ yaw: 0.65, pitch: 0.38 });
      const P = { az: 90, el: 90, qx: 0.4, qy: 0, h: 0.12, th: 150, trans: false, play: false };
      const T0 = T4(M.I(3), [1.0, 0, 0.1]);
      const screw = () => {
        const s = axisFrom(P.az, P.el), q = [P.qx, P.qy, 0];
        if (P.trans) return { S: [0, 0, 0, ...s], s, q };
        const v = V.add(V.sc(V.cross(s, q), -1), V.sc(s, P.h));
        return { S: [...s, ...v], s, q };
      };
      st.draw = (ctx, w, h, C) => {
        cam.s = Math.min(w, h) * 0.36; cam.cx = w / 2; cam.cy = h / 2 + 10; cam.target = [P.qx * 0.6, P.qy * 0.6, 0.35];
        floor(ctx, cam, C, 3, 0.5, 0);
        SK.axes3(ctx, cam, { R: M.I(3), p: [0, 0, 0] }, 0.6, C, { faint: true, w: 1.3, head: 6, labels: ['x', 'y', 'z'] });
        const { S: Sc, s, q } = screw();
        const th = P.trans ? P.th / 180 : rad(P.th);
        // the axis
        ctx.save(); ctx.strokeStyle = C.accInk; ctx.lineWidth = 1.6; ctx.setLineDash([7, 5]);
        seg3(ctx, cam, V.add(q, V.sc(s, -1.6)), V.add(q, V.sc(s, 1.8))); ctx.restore();
        const qa = cam.P(q), qb = cam.P(V.add(q, V.sc(s, 0.8)));
        SK.arrow(ctx, qa[0], qa[1], qb[0], qb[1], C.acc, 2.6, 10);
        SK.dot(ctx, qa[0], qa[1], 4.5, C.acc, C.paper3, 1.5);
        SK.text(ctx, 'q', qa[0] - 10, qa[1] + 12, { c: C.accInk, s: 13, w: 700, halo: C.paper });
        SK.text(ctx, 'ŝ', qb[0] + 8, qb[1] - 6, { c: C.accInk, s: 14, w: 700, halo: C.paper });
        // helix of the box origin
        const p0 = [T0[0][3], T0[1][3], T0[2][3]];
        const path = (t1, dash, col) => {
          ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = dash ? 1 : 2; if (dash) ctx.setLineDash([3, 4]);
          ctx.beginPath();
          for (let i = 0; i <= 120; i++) { const T = M.exp6(Sc, (t1 * i) / 120), r = cam.P(M.app(T, p0)); if (i) ctx.lineTo(r[0], r[1]); else ctx.moveTo(r[0], r[1]); }
          ctx.stroke(); ctx.restore();
        };
        if (!P.trans) path(TAU, true, SK.alpha(C.acc, 0.5));
        path(th, false, C.acc);
        box3(ctx, cam, T0, [0.22, 0.14, 0.09], [0, 0, 0], C.ink3, C.ink3, 0.35);
        const T = M.mul(M.exp6(Sc, th), T0);
        box3(ctx, cam, T, [0.22, 0.14, 0.09], [0, 0, 0], C.blue2, C.ink, 0.85);
        SK.axes3(ctx, cam, T, 0.42, C, { w: 2, head: 7 });
        SK.text(ctx, '빈 곳을 끌면 시점이 돕니다', 12, h - 12, { c: C.ink3, s: 11 });
      };
      const report = () => {
        const { S: Sc, s, q } = screw();
        const th = P.trans ? P.th / 180 : rad(P.th);
        const T = M.exp6(Sc, th);
        const thTxt = P.trans ? `\\theta=${th.toFixed(2)}` : `\\theta=${P.th.toFixed(0)}^\\circ=${th.toFixed(2)}\\ \\text{rad}`;
        out.innerHTML = `<div class="row"><span>${SK.tex(`\\mathcal S=\\begin{bmatrix}\\omega\\\\v\\end{bmatrix}=${SK.texVec(Sc, 2)}`)}</span><span>${P.trans ? '순수 병진: ' + SK.tex('\\omega=0,\\ v=\\hat s') : SK.tex(`v=-\\hat s\\times q+h\\hat s,\\ q=${SK.texVec(q, 2)},\\ h=${P.h.toFixed(2)}`)}</span></div>
          <div class="row"><span>${SK.tex(`${thTxt}:\\quad e^{[\\mathcal S]\\theta}=${SK.texMat(T, 2)}`, true)}</span></div>
          <div class="sim-note">${P.trans ? '' : `축 방향 이동 ${SK.tex(`h\\theta=${(P.h * th).toFixed(3)}`)}, 회전 ${SK.tex(`\\theta`)} — 위치 부분은 ${SK.tex('G(\\theta)v')}입니다. `}상자는 ${SK.tex('T=e^{[\\mathcal S]\\theta}T_0')}로 움직였습니다(앞곱: 축을 {s}에서 읽음). 방향 ${SK.tex(`\\hat s=${SK.texVec(s, 2)}`)}.</div>`;
      };
      const loop = SK.loop(stage, (dt) => {
        if (!P.play) return false;
        P.th += 50 * dt; if (P.th > 360) P.th = 0; thS.set(P.th, true); st.now(); report(); return true;
      });
      SK.slider(ctrl, { label: '축의 방위각', min: -180, max: 180, step: 1, value: P.az, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.az = v; st.req(); report(); } });
      SK.slider(ctrl, { label: '축의 고도', min: -90, max: 90, step: 1, value: P.el, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.el = v; st.req(); report(); } });
      SK.slider(ctrl, { label: '점 q의 x', min: -1, max: 1, step: 0.05, value: P.qx, fmt: (v) => v.toFixed(2), on: (v) => { P.qx = v; st.req(); report(); } });
      SK.slider(ctrl, { label: '점 q의 y', min: -1, max: 1, step: 0.05, value: P.qy, fmt: (v) => v.toFixed(2), on: (v) => { P.qy = v; st.req(); report(); } });
      SK.slider(ctrl2, { label: '피치 h', min: -0.3, max: 0.3, step: 0.01, value: P.h, fmt: (v) => v.toFixed(2), on: (v) => { P.h = v; st.req(); report(); } });
      const thS = SK.slider(ctrl2, { label: 'θ', min: 0, max: 360, step: 1, value: P.th, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.th = v; st.req(); report(); } });
      const pb = SK.btn(ctrl2, '▶ 돌리기', () => { P.play = !P.play; pb.textContent = P.play ? '❚❚ 멈추기' : '▶ 돌리기'; if (P.play) loop.start(); });
      SK.check(ctrl2, '순수 병진', false, (v) => { P.trans = v; st.req(); report(); });
      report();
      const orb = SK.orbit(st, cam, () => st.req());
      SK.drag(st, { pick: (x, y) => orb.pick(x, y), move: (h, x, y) => orb.move(h, x, y) });
    },
  };

  // ======================================================================================
  // 지수곱 정기구학: 평면 3R과 UR5
  // ======================================================================================
  const UR = { W1: 0.109, W2: 0.082, L1: 0.425, L2: 0.392, H1: 0.089, H2: 0.095 };
  const ARMS = {
    planar: (() => {
      const L = [1, 0.8, 0.5];
      return {
        name: '평면 3R', n: 3,
        S: [[0, 0, 1, 0, 0, 0], [0, 0, 1, 0, -L[0], 0], [0, 0, 1, 0, -(L[0] + L[1]), 0]],
        q: [[0, 0, 0], [L[0], 0, 0], [L[0] + L[1], 0, 0]],
        pts: [[0, 0, 0], [L[0], 0, 0], [L[0] + L[1], 0, 0], [L[0] + L[1] + L[2], 0, 0]],
        Mh: T4(M.I(3), [L[0] + L[1] + L[2], 0, 0]),
        cam: { yaw: -PI / 2, pitch: 1.15 }, scale: 0.5, view: 1.45, center: [1.1, 0, 0], init: [30, 40, -50], floorStep: 0.5,
      };
    })(),
    ur5: (() => {
      const { W1, W2, L1, L2, H1, H2 } = UR;
      return {
        name: 'UR5 (6R)', n: 6,
        S: [[0, 0, 1, 0, 0, 0], [0, 1, 0, -H1, 0, 0], [0, 1, 0, -H1, 0, L1], [0, 1, 0, -H1, 0, L1 + L2], [0, 0, -1, -W1, L1 + L2, 0], [0, 1, 0, H2 - H1, 0, L1 + L2]],
        q: [[0, 0, 0], [0, 0, H1], [L1, 0, H1], [L1 + L2, 0, H1], [L1 + L2, W1, H1], [L1 + L2, W1, H1 - H2]],
        pts: [[0, 0, 0], [0, 0, H1], [L1, 0, H1], [L1 + L2, 0, H1], [L1 + L2, W1, H1], [L1 + L2, W1, H1 - H2], [L1 + L2, W1 + W2, H1 - H2]],
        Mh: [[-1, 0, 0, L1 + L2], [0, 0, 1, W1 + W2], [0, 1, 0, H1 - H2], [0, 0, 0, 1]],
        cam: { yaw: -PI / 2 + 0.75, pitch: 0.42 }, scale: 0.25, view: 0.5, center: [0.38, 0.1, 0.12], init: [0, -30, 60, -30, -90, 0], floorStep: 0.2,
      };
    })(),
  };
  S.poe = {
    title: '지수곱 정기구학: 관절마다 나사 하나',
    ch: 'ch09', k: '4.1.1',
    desc: '영 자세에서의 끝점 자세 $M$과 관절의 나사 축 $\\mathcal S_i$만 알면, 관절각을 넣어 $T(\\theta)=e^{[\\mathcal S_1]\\theta_1}\\cdots e^{[\\mathcal S_n]\\theta_n}M$을 계산합니다. 막대를 움직이면 팔과 아래의 행렬이 함께 바뀝니다. ‘끝 관절부터 쌓기’로 공식이 왜 영 자세의 축을 쓰는지 볼 수 있습니다.',
    tries: [
      '평면 3R에서 θ₃만 움직여 보세요. 행렬의 위치 부분이 끝 링크 길이 0.5의 원을 그립니다.',
      '‘끝 관절부터 쌓기’를 켜고 k를 0부터 올려 보세요. k = 1은 마지막 관절만 돌린 모습(나머지 0), k = n이 전체 곱입니다. 앞 관절이 돌 때 뒤쪽 축이 함께 실려 가므로, 뒤쪽 축은 영 자세의 것을 쓰면 됩니다.',
      'UR5로 바꿔 θ₂(어깨)를 움직여 보세요. 영 자세(흐린 팔)의 나사 축 S₂ = (0, 1, 0, −H₁, 0, 0)은 그대로이고, 현재 축(주황)만 따라 움직입니다.',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.62, min: 280, max: 480, label: '지수곱 정기구학' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const P = { arm: arg === 'ur5' ? 'ur5' : 'planar', th: [], k: 0, stack: false, ghost: true };
      let A = null;
      const cam = SK.cam({});
      const load = (key) => {
        P.arm = key; A = ARMS[key]; P.th = A.init.slice(); P.k = A.n; P.stack = false;
        cam.yaw = A.cam.yaw; cam.pitch = A.cam.pitch; cam.target = A.center;
        build(); st.req(); report();
      };
      const effTh = () => P.th.map((t, i) => (P.stack && i < A.n - P.k ? 0 : t));
      const chain = (th) => { const Ts = [M.I(4)]; for (let i = 0; i < A.n; i++) Ts.push(M.mul(Ts[i], M.exp6(A.S[i], rad(th[i])))); return Ts; };
      st.draw = (ctx, w, h, C) => {
        cam.s = (Math.min(w, h) * 0.46) / A.view; cam.cx = w / 2; cam.cy = h / 2 + 10;
        floor(ctx, cam, C, A.n === 6 ? 5 : 4, A.floorStep, 0, Math.round(A.center[0] / A.floorStep) * A.floorStep, Math.round(A.center[1] / A.floorStep) * A.floorStep);
        SK.axes3(ctx, cam, { R: M.I(3), p: [0, 0, 0] }, A.n === 6 ? 0.18 : 0.45, C, { faint: true, w: 1.3, head: 6, labels: ['x', 'y', 'z'] });
        const drawArm = (th, faint) => {
          const Ts = chain(th);
          ctx.lineCap = 'round';
          for (let j = 1; j < A.pts.length; j++) {
            const a = cam.P(M.app(Ts[Math.min(j, A.n)], A.pts[j - 1])), b = cam.P(M.app(Ts[Math.min(j, A.n)], A.pts[j]));
            ctx.strokeStyle = faint ? SK.alpha(C.ink3, 0.35) : C.ink; ctx.lineWidth = faint ? 4 : 7; SK.line(ctx, a[0], a[1], b[0], b[1]);
          }
          for (let i = 0; i < A.n; i++) {
            const o = cam.P(M.app(Ts[i], A.q[i]));
            if (!faint) {
              const wv = M.mv(M.R(Ts[i]), A.S[i].slice(0, 3)), c0 = M.app(Ts[i], A.q[i]);
              const a1 = cam.P(V.add(c0, V.sc(wv, -A.scale * 0.35))), a2 = cam.P(V.add(c0, V.sc(wv, A.scale * 0.45)));
              ctx.strokeStyle = C.acc; ctx.lineWidth = 2; SK.line(ctx, a1[0], a1[1], o[0], o[1]); SK.arrow(ctx, o[0], o[1], a2[0], a2[1], C.acc, 2, 7);
            }
            SK.dot(ctx, o[0], o[1], faint ? 3.5 : 5.5, faint ? C.paper3 : C.paper3, faint ? SK.alpha(C.ink3, 0.5) : C.accInk, 2);
            if (!faint) SK.text(ctx, `${i + 1}`, o[0] - 10, o[1] - 10, { c: C.accInk, s: 11.5, w: 700, halo: C.paper });
          }
          if (!faint) {
            const T = M.mul(Ts[A.n], A.Mh);
            SK.axes3(ctx, cam, T, A.n === 6 ? 0.12 : 0.3, C, { w: 2.2, head: 7, name: '{b}' });
          }
        };
        if (P.ghost) drawArm(P.th.map(() => 0), true);
        if (P.stack && P.k < A.n) drawArm(P.th, true);
        drawArm(effTh(), false);
        SK.text(ctx, '흐린 팔: 영 자세' + (P.stack && P.k < A.n ? ' · 목표 자세' : '') + ' · 주황: 관절 축(현재)', 12, h - 12, { c: C.ink3, s: 11 });
      };
      const report = () => {
        const th = effTh(), T = M.mul(chain(th)[A.n], A.Mh);
        const prod = (P.stack ? A.S.map((_, i) => i).filter((i) => i >= A.n - P.k) : A.S.map((_, i) => i)).map((i) => `e^{[\\mathcal S_${i + 1}]\\theta_${i + 1}}`).join('') || 'I\\,';
        out.innerHTML = `<div class="row"><span>${SK.tex(`T(\\theta)=${prod}M=${SK.texMat(T, 3)}`, true)}</span></div>
          <div class="row"><span>${SK.tex(`M=${SK.texMat(A.Mh, 3)}`)}</span><span>${A.S.map((s, i) => SK.tex(`\\mathcal S_${i + 1}=${SK.texVec(s, 3)}`)).join('<br>')}</span></div>
          <div class="sim-note">${A.n === 6 ? `UR5 치수(교재 예제 4.5): ${SK.tex(`W_1=${UR.W1},\\ W_2=${UR.W2},\\ L_1=${UR.L1},\\ L_2=${UR.L2},\\ H_1=${UR.H1},\\ H_2=${UR.H2}`)} m.` : '링크 길이 1, 0.8, 0.5. 모든 축이 ẑ라 나사 축의 v는 (0, −x, 0) 꼴입니다.'}</div>`;
      };
      let kS = null;
      const build = () => {
        ctrl2.innerHTML = '';
        P.th.forEach((t, i) => SK.slider(ctrl2, { label: `θ${'₁₂₃₄₅₆'[i]}`, min: -180, max: 180, step: 1, value: t, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.th[i] = v; st.req(); report(); } }));
        SK.btn(ctrl2, '영 자세', () => { P.th = P.th.map(() => 0); build(); st.req(); report(); });
        SK.check(ctrl2, '영 자세 겹쳐 보기', P.ghost, (v) => { P.ghost = v; st.req(); });
        SK.check(ctrl2, '끝 관절부터 쌓기', P.stack, (v) => { P.stack = v; kS.el.style.display = v ? '' : 'none'; st.req(); report(); });
        kS = SK.slider(ctrl2, { label: '적용한 관절 수 k', min: 0, max: A.n, step: 1, value: P.k, fmt: (v) => v.toFixed(0), on: (v) => { P.k = v; st.req(); report(); } });
        kS.el.style.display = P.stack ? '' : 'none';
      };
      SK.seg(ctrl, { label: '로봇', options: [['planar', '평면 3R'], ['ur5', 'UR5 (6R)']], value: P.arm, on: (v) => load(v) });
      load(P.arm);
      const orb = SK.orbit(st, cam, () => st.req());
      SK.drag(st, { pick: (x, y) => orb.pick(x, y), move: (h, x, y) => orb.move(h, x, y) });
    },
  };
})();
