/* 로봇공학 시뮬레이션 A — 형상: 4절·5절 링크(자유도), 2R 팔의 C-공간(토러스), 자동차의 비홀로노믹 구속.
   그리는 틀은 core/simkit.js(window.SimKit), 등록은 window.SITE_SIMS. 단위는 화면과 무관한 길이(m로 읽어도 됨). */
(function () {
  const SK = window.SimKit;
  if (!SK) return;
  const S = (window.SITE_SIMS = window.SITE_SIMS || {});
  const PI = Math.PI, TAU = 2 * PI;
  const deg = (r) => (r * 180) / PI;
  const wrap = (a) => ((((a + PI) % TAU) + TAU) % TAU) - PI;
  // circle–circle intersection: the point on the left (side = +1) or right (−1) of the line p → q
  function meet(p, r1, q, r2, side) {
    const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy);
    if (d < 1e-9 || d > r1 + r2 + 1e-12 || d < Math.abs(r1 - r2) - 1e-12) return null;
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
    const mx = p[0] + (a * dx) / d, my = p[1] + (a * dy) / d;
    return [mx - (side * h * dy) / d, my + (side * h * dx) / d];
  }

  // ======================================================================================
  // 4절 링크와 5절 링크: 숫자 몇 개를 정해야 모양이 정해지는가
  // ======================================================================================
  S.fourbar = {
    title: '링크 기구의 자유도: 4절과 5절',
    ch: 'ch01', k: '2.2a',
    desc: '바닥에 고정된 두 핀 사이를 링크로 이은 평면 기구입니다. 4절 링크는 크랭크 각 하나만 정하면 나머지가 모두 정해지고(자유도 1), 5절 링크는 두 각을 정해야 합니다(자유도 2). 그뤼블러 공식의 숫자가 손끝의 느낌으로 어떻게 나타나는지 확인해 보세요.',
    tries: [
      '4절 링크에서 크랭크 끝(주황 점)을 끌어 보세요. 연결봉과 흔들대가 혼자 따라오고, 연결봉 위의 점은 늘 같은 곡선(연결봉 곡선)만 지납니다 — 자유도 1.',
      '링크 길이를 바꿔 그라스호프 조건 $s+l\\le p+q$가 깨지게 해 보세요. 크랭크가 한 바퀴를 못 돌고 양 끝에서 되돌아옵니다.',
      '‘조립 바꾸기’를 누르면 같은 크랭크 각에서 다른 모양이 나옵니다. 고리 조건의 해가 둘이라는 뜻입니다.',
      '5절 링크로 바꿔 끝점 P를 끌어 보세요. 평면의 넓은 영역을 자유롭게 움직입니다 — 두 모터 각 $\\theta_1,\\theta_2$가 모두 필요합니다.',
    ],
    mount(stage, arg) {
      const st = SK.canvas(stage, { ratio: 0.6, min: 280, max: 470, label: '평면 링크 기구' });
      const ctrl = SK.panel(stage);
      const ctrl2 = SK.panel(stage);
      const out = SK.out(stage);
      const P = { mode: arg === 'five' ? 'five' : 'four', a: 1, b: 2.6, c: 2.2, d: 2.8, th: 1.0, side: 1, dir: 1, play: false,
        five: { d: 1.6, a1: 1.3, b1: 1.9, a2: 1.3, b2: 1.9, p: [0.8, 2.3] } };
      let reach = null; // five-bar reachable grid (recomputed when lengths change)

      const pose4 = (th, side) => {
        const A = [P.a * Math.cos(th), P.a * Math.sin(th)], O4 = [P.d, 0];
        const B = meet(A, P.b, O4, P.c, side);
        return B ? { A, B, O4 } : null;
      };
      const coupler = (A, B) => { // a point riding on the coupler: halfway along it and lifted to one side
        const ex = B[0] - A[0], ey = B[1] - A[1];
        return [A[0] + 0.5 * ex - 0.45 * ey, A[1] + 0.5 * ey + 0.45 * ex];
      };
      const grashof = () => {
        const L = [P.a, P.b, P.c, P.d].slice().sort((x, y) => x - y);
        const s = L[0], l = L[3], pq = L[1] + L[2];
        const ok = s + l <= pq + 1e-9;
        let type = '';
        if (!ok) type = '삼중 흔들대 — 어느 링크도 한 바퀴를 못 돈다';
        else if (Math.abs(s + l - pq) < 1e-6) type = '변환점 기구 — 모든 링크가 한 줄로 설 수 있다';
        else if (s === P.a) type = '크랭크-흔들대 — 크랭크가 한 바퀴 돈다';
        else if (s === P.d) type = '이중 크랭크 — 두 링크가 모두 한 바퀴 돈다';
        else type = '이중 흔들대 — 연결봉만 한 바퀴 돈다';
        return { ok, s, l, pq, type };
      };
      // five-bar: elbows bend outward
      const pose5 = (p) => {
        const F = P.five, O1 = [0, 0], O2 = [F.d, 0];
        const A = meet(O1, F.a1, p, F.b1, 1), C = meet(O2, F.a2, p, F.b2, -1);
        return A && C ? { O1, O2, A, C, p } : null;
      };
      const reachGrid = () => {
        const F = P.five, pts = [];
        const R = Math.max(F.a1 + F.b1, F.a2 + F.b2);
        for (let x = -R; x <= F.d + R; x += 0.12) for (let y = -R; y <= R; y += 0.12) if (pose5([x, y])) pts.push([x, y]);
        reach = pts;
      };
      let bx = null; // bounds of everything the four-bar can draw (pivots, crank circle, both coupler curves)
      const box = () => {
        if (P.mode === 'five') { const F = P.five, R = Math.max(F.a1 + F.b1, F.a2 + F.b2); return [-R * 0.75, F.d + R * 0.75, -R * 0.55, R + 0.2]; }
        if (bx && bx.key === `${P.a},${P.b},${P.c},${P.d}`) return bx.b;
        let x0 = -P.a, x1 = Math.max(P.d, P.a), y0 = -P.a, y1 = P.a;
        const add = (p) => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); };
        for (let k = 0; k < 180; k++) [-1, 1].forEach((sd) => { const g = pose4((TAU * k) / 180, sd); if (g) { add(g.B); add(coupler(g.A, g.B)); } });
        const m = 0.12 * Math.max(x1 - x0, y1 - y0) + 0.25;
        bx = { key: `${P.a},${P.b},${P.c},${P.d}`, b: [x0 - m, x1 + m, y0 - m - 0.3, y1 + m] };
        return bx.b;
      };

      st.draw = (ctx, w, h, C) => {
        const Mp = SK.fitMap(w, h, box(), 22);
        const X = Mp.X, Y = Mp.Y;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const ground = (x, y) => { // pinned base: a small triangle with hatching
          ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2; ctx.fillStyle = C.paper2;
          ctx.beginPath(); ctx.moveTo(X(x), Y(y)); ctx.lineTo(X(x) - 11, Y(y) + 17); ctx.lineTo(X(x) + 11, Y(y) + 17); ctx.closePath(); ctx.fill(); ctx.stroke();
          for (let k = -14; k <= 10; k += 6) SK.line(ctx, X(x) + k, Y(y) + 23, X(x) + k + 5, Y(y) + 17);
          SK.line(ctx, X(x) - 15, Y(y) + 17, X(x) + 15, Y(y) + 17);
        };
        const link = (p, q, col, wd) => { ctx.strokeStyle = col; ctx.lineWidth = wd; SK.line(ctx, X(p[0]), Y(p[1]), X(q[0]), Y(q[1])); };
        const pin = (p, col) => SK.dot(ctx, X(p[0]), Y(p[1]), 5, C.paper3, col, 2);
        if (P.mode === 'four') {
          // coupler curves of both assemblies
          [-1, 1].forEach((sd) => {
            ctx.strokeStyle = sd === P.side ? SK.alpha(C.acc, 0.85) : C.faint; ctx.lineWidth = sd === P.side ? 1.6 : 1.1;
            ctx.setLineDash(sd === P.side ? [] : [4, 4]);
            ctx.beginPath(); let pen = false;
            for (let k = 0; k <= 360; k++) {
              const g = pose4((TAU * k) / 360, sd);
              if (!g) { pen = false; continue; }
              const q = coupler(g.A, g.B);
              if (pen) ctx.lineTo(X(q[0]), Y(q[1])); else { ctx.moveTo(X(q[0]), Y(q[1])); pen = true; }
            }
            ctx.stroke(); ctx.setLineDash([]);
          });
          // crank circle
          ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
          ctx.beginPath(); ctx.arc(X(0), Y(0), P.a * Mp.s, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
          ground(0, 0); ground(P.d, 0);
          ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.setLineDash([2, 5]); SK.line(ctx, X(0), Y(0), X(P.d), Y(0)); ctx.setLineDash([]);
          const g = pose4(P.th, P.side);
          if (g) {
            const q = coupler(g.A, g.B);
            ctx.fillStyle = SK.alpha(C.blue, 0.12); ctx.strokeStyle = C.blue; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(X(g.A[0]), Y(g.A[1])); ctx.lineTo(X(g.B[0]), Y(g.B[1])); ctx.lineTo(X(q[0]), Y(q[1])); ctx.closePath(); ctx.fill(); ctx.stroke();
            link([0, 0], g.A, C.acc, 6); link(g.A, g.B, C.blue, 6); link(g.O4, g.B, C.ink2, 6);
            pin([0, 0], C.ink2); pin(g.O4, C.ink2); pin(g.B, C.ink2);
            SK.dot(ctx, X(g.A[0]), Y(g.A[1]), 8, C.acc, C.paper3, 2);
            SK.dot(ctx, X(q[0]), Y(q[1]), 4.5, C.ink, null);
            const lab = (p, s, dx, dy) => SK.text(ctx, s, X(p[0]) + dx, Y(p[1]) + dy, { c: C.ink2, s: 12, w: 600, a: 'center', halo: C.paper });
            lab([P.a / 2 * Math.cos(P.th), P.a / 2 * Math.sin(P.th)], 'a', -12, -10);
            lab([(g.A[0] + g.B[0]) / 2, (g.A[1] + g.B[1]) / 2], 'b', 0, 14);
            lab([(g.O4[0] + g.B[0]) / 2, (g.O4[1] + g.B[1]) / 2], 'c', 12, 0);
            lab([P.d / 2, 0], 'd', 0, 12);
            SK.text(ctx, `θ = ${deg(wrap(P.th)).toFixed(0)}°`, X(0) + 14, Y(0) - 14, { c: C.accInk, s: 12, w: 600, halo: C.paper });
          }
        } else {
          if (!reach) reachGrid();
          ctx.fillStyle = SK.alpha(C.blue, 0.13);
          ctx.beginPath(); // one path, so overlapping cells do not darken each other
          reach.forEach(([x, y]) => ctx.rect(X(x) - 0.07 * Mp.s, Y(y) - 0.07 * Mp.s, 0.14 * Mp.s, 0.14 * Mp.s));
          ctx.fill();
          const F = P.five;
          ground(0, 0); ground(F.d, 0);
          ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.setLineDash([2, 5]); SK.line(ctx, X(0), Y(0), X(F.d), Y(0)); ctx.setLineDash([]);
          const g = pose5(F.p);
          if (g) {
            link(g.O1, g.A, C.acc, 6); link(g.O2, g.C, C.acc, 6); link(g.A, g.p, C.blue, 6); link(g.C, g.p, C.blue, 6);
            pin(g.O1, C.ink2); pin(g.O2, C.ink2); pin(g.A, C.ink2); pin(g.C, C.ink2);
            SK.dot(ctx, X(g.p[0]), Y(g.p[1]), 8, C.blue, C.paper3, 2);
            SK.text(ctx, 'P', X(g.p[0]) + 12, Y(g.p[1]) - 10, { c: C.blue, s: 13, w: 700, halo: C.paper });
            const t1 = Math.atan2(g.A[1], g.A[0]), t2 = Math.atan2(g.C[1], g.C[0] - F.d);
            SK.text(ctx, `θ₁ = ${deg(t1).toFixed(0)}°`, X(0) - 18, Y(0) + 34, { c: C.accInk, s: 12, w: 600, a: 'center', halo: C.paper });
            SK.text(ctx, `θ₂ = ${deg(t2).toFixed(0)}°`, X(F.d) + 18, Y(0) + 34, { c: C.accInk, s: 12, w: 600, a: 'center', halo: C.paper });
          }
          SK.text(ctx, '푸른 영역: P가 닿을 수 있는 곳', 12, h - 14, { c: C.ink3, s: 11.5 });
        }
      };

      const report = () => {
        if (P.mode === 'four') {
          const G = grashof();
          out.innerHTML = `<div class="row"><span>그뤼블러: ${SK.tex('N=4,\\ J=4,\\ \\text{dof}=3(4-1-4)+4=1')}</span></div>
            <div class="row"><span>그라스호프: 가장 짧은 링크 + 가장 긴 링크 ${SK.tex(`s+l=${G.s.toFixed(2)}+${G.l.toFixed(2)}=${(G.s + G.l).toFixed(2)}`)} ${G.ok ? '≤' : '>'} 나머지 둘 ${SK.tex(`p+q=${G.pq.toFixed(2)}`)}</span></div>
            <div class="row"><b>${G.type}</b></div>`;
        } else {
          out.innerHTML = `<div class="row"><span>그뤼블러: ${SK.tex('N=5,\\ J=5,\\ \\text{dof}=3(5-1-5)+5=2')}</span></div>
            <div class="row"><span>끝점 P의 위치 두 숫자 ↔ 모터 각 두 개 ${SK.tex('(\\theta_1,\\theta_2)')}. 둘 중 하나만 정하면 P는 한 곡선 위를 움직일 수 있습니다.</span></div>`;
        }
      };
      const loop = SK.loop(stage, (dt) => {
        if (!P.play || P.mode !== 'four') return false;
        let nt = P.th + P.dir * 1.3 * dt;
        if (!pose4(nt, P.side)) { P.dir *= -1; P.side *= -1; nt = P.th; } // a rocking crank turns back and the linkage passes to the other assembly
        P.th = nt; st.now();
        return true;
      });

      // controls
      const modeSeg = SK.seg(ctrl, { label: '기구', options: [['four', '4절 링크'], ['five', '5절 링크']], value: P.mode, on: (v) => { P.mode = v; P.play = false; loop.stop(); playBtn.textContent = '▶ 돌리기'; build(); st.req(); report(); } });
      const playBtn = SK.btn(ctrl, '▶ 돌리기', () => { if (P.mode !== 'four') return; P.play = !P.play; playBtn.textContent = P.play ? '❚❚ 멈추기' : '▶ 돌리기'; if (P.play) loop.start(); else loop.stop(); });
      const flipBtn = SK.btn(ctrl, '조립 바꾸기', () => { if (pose4(P.th, -P.side)) { P.side *= -1; st.req(); } });
      void modeSeg;
      const build = () => {
        ctrl2.innerHTML = '';
        playBtn.style.display = flipBtn.style.display = P.mode === 'four' ? '' : 'none';
        const fix = () => { // keep the crank angle at a feasible pose after a length change
          if (pose4(P.th, P.side)) return;
          for (let k = 1; k <= 180; k++) for (const s of [1, -1]) { const t = P.th + s * k * PI / 180; if (pose4(t, P.side)) { P.th = t; return; } }
        };
        if (P.mode === 'four') {
          [['a', '크랭크 a'], ['b', '연결봉 b'], ['c', '흔들대 c'], ['d', '바닥 d']].forEach(([k, lab]) =>
            SK.slider(ctrl2, { label: lab, min: 0.5, max: 4, step: 0.05, value: P[k], fmt: (v) => v.toFixed(2), on: (v) => { P[k] = v; fix(); st.req(); report(); } }));
        } else {
          SK.slider(ctrl2, { label: '아래 링크', min: 0.6, max: 2, step: 0.05, value: P.five.a1, fmt: (v) => v.toFixed(2), on: (v) => { P.five.a1 = P.five.a2 = v; reach = null; st.req(); } });
          SK.slider(ctrl2, { label: '위 링크', min: 0.8, max: 2.6, step: 0.05, value: P.five.b1, fmt: (v) => v.toFixed(2), on: (v) => { P.five.b1 = P.five.b2 = v; reach = null; st.req(); } });
        }
      };
      build(); report();

      SK.drag(st, {
        pick(x, y) {
          const Mp = SK.fitMap(st.w, st.h, box(), 22);
          if (P.mode === 'four') {
            const A = [P.a * Math.cos(P.th), P.a * Math.sin(P.th)];
            if (Math.hypot(x - Mp.X(A[0]), y - Mp.Y(A[1])) < 22) return 'A';
            const r = Math.hypot(Mp.ix(x), Mp.iy(y));
            return Math.abs(r - P.a) * Mp.s < 26 ? 'A' : null;
          }
          const p = P.five.p;
          return Math.hypot(x - Mp.X(p[0]), y - Mp.Y(p[1])) < 26 ? 'P' : null;
        },
        start() { if (P.play) { P.play = false; loop.stop(); playBtn.textContent = '▶ 돌리기'; } },
        move(hd, x, y) {
          const Mp = SK.fitMap(st.w, st.h, box(), 22);
          const wx = Mp.ix(x), wy = Mp.iy(y);
          if (hd === 'A') {
            const t = Math.atan2(wy, wx);
            if (pose4(t, P.side)) P.th = t;
            else if (pose4(t, -P.side)) { /* stay at the toggle position rather than jump */ }
          } else if (pose5([wx, wy])) P.five.p = [wx, wy];
          st.req();
        },
      });
    },
  };

  // ======================================================================================
  // 2R 팔의 C-공간: 작업 공간의 장애물이 C-공간에서 어떻게 보이는가, 토러스로 감기
  // ======================================================================================
  S.cspace = {
    title: '2R 팔의 C-공간과 장애물',
    ch: 'ch02', k: '2.3a',
    desc: '왼쪽은 팔이 사는 작업 공간, 오른쪽은 두 관절각 $(\\theta_1,\\theta_2)$의 C-공간입니다. 팔의 자세 하나가 오른쪽의 점 하나이고, 장애물에 부딪히는 자세들은 오른쪽에서 색칠된 영역(C-장애물)이 됩니다. 두 각은 모두 한 바퀴 돌면 제자리라 정사각형의 위아래·좌우 변이 붙어 토러스가 됩니다.',
    tries: [
      '오른쪽 정사각형에서 점을 끌어 보세요. 팔이 따라 움직이고, 색칠된 영역에 들어가면 팔이 장애물과 부딪힙니다.',
      '점을 오른쪽 끝 밖으로 계속 끌면 왼쪽 끝에서 다시 나타납니다 — $\\theta=\\pi$와 $-\\pi$는 같은 자세입니다.',
      '왼쪽에서 장애물(원)을 끌어 옮기면 오른쪽 C-장애물의 모양이 바뀝니다. 작은 원 하나가 C-공간에서는 긴 띠가 되기도 합니다.',
      '‘토러스로 보기’를 켜고 끌어 돌려 보세요. 정사각형의 네 변이 붙은 도넛 위에 같은 장애물이 그려집니다.',
    ],
    mount(stage) {
      const row = SK.el('div', 'sim-row');
      stage.appendChild(row);
      const ws = SK.canvas(row, { ratio: 0.92, min: 260, max: 420, label: '작업 공간' });
      const cs = SK.canvas(row, { ratio: 0.92, min: 260, max: 420, label: 'C-공간' });
      const ctrl = SK.panel(stage);
      const out = SK.out(stage);
      const P = { L1: 1, L2: 0.8, th: [-0.35, 1.75], obs: [{ x: 1.15, y: 0.95, r: 0.26 }, { x: -1.0, y: 1.0, r: 0.32 }, { x: 0.25, y: -1.25, r: 0.28 }], torus: false, trail: [] };
      const N = 150;
      let grid = null; // Uint8Array: 0 free, k+1 = hit obstacle k
      const segHit = (ax, ay, bx, by, o) => {
        const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
        let t = L2 ? ((o.x - ax) * dx + (o.y - ay) * dy) / L2 : 0;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(ax + t * dx - o.x, ay + t * dy - o.y) < o.r + 0.035;
      };
      const fk = (t1, t2) => { const e = [P.L1 * Math.cos(t1), P.L1 * Math.sin(t1)]; return [e, [e[0] + P.L2 * Math.cos(t1 + t2), e[1] + P.L2 * Math.sin(t1 + t2)]]; };
      const hitAt = (t1, t2) => {
        const [e, p] = fk(t1, t2);
        for (let k = 0; k < P.obs.length; k++) { const o = P.obs[k]; if (segHit(0, 0, e[0], e[1], o) || segHit(e[0], e[1], p[0], p[1], o)) return k + 1; }
        return 0;
      };
      const compute = () => {
        grid = new Uint8Array(N * N);
        for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) grid[j * N + i] = hitAt(-PI + ((i + 0.5) * TAU) / N, -PI + ((j + 0.5) * TAU) / N);
        img = null;
      };
      let img = null;
      const obsCol = (C, k) => [C.acc, C.blue, C.bad][k % 3];
      const gridImage = (C) => {
        if (img) return img;
        const cv = document.createElement('canvas'); cv.width = N; cv.height = N;
        const g = cv.getContext('2d'), id = g.createImageData(N, N);
        const rgb = [C.acc, C.blue, C.bad].map((c) => { const m = /^#([0-9a-f]{6})$/i.exec(c); const n = m ? parseInt(m[1], 16) : 0x888888; return [n >> 16, (n >> 8) & 255, n & 255]; });
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const v = grid[j * N + i], o = ((N - 1 - j) * N + i) * 4; // θ2 grows upward
          if (v) { const c = rgb[(v - 1) % 3]; id.data[o] = c[0]; id.data[o + 1] = c[1]; id.data[o + 2] = c[2]; id.data[o + 3] = 120; }
        }
        g.putImageData(id, 0, 0);
        img = cv; return img;
      };
      compute();
      const wsBox = () => { const R = P.L1 + P.L2 + 0.25; return [-R, R, -R, R]; };
      const csMap = (w, h) => { const s = Math.min(w, h) - 70; const ox = (w - s) / 2 + 8, oy = (h - s) / 2 + 6; return { s, ox, oy, X: (t) => ox + ((t + PI) / TAU) * s, Y: (t) => oy + s - ((t + PI) / TAU) * s, it: (x) => -PI + ((x - ox) / s) * TAU, jt: (y) => -PI + ((oy + s - y) / s) * TAU }; };
      const cam = SK.cam({ yaw: 0.6, pitch: 0.75 });
      const torusPt = (a, b) => { const R = 1, r = 0.42; return [(R + r * Math.cos(b)) * Math.cos(a), (R + r * Math.cos(b)) * Math.sin(a), r * Math.sin(b)]; };

      ws.draw = (ctx, w, h, C) => {
        const M = SK.fitMap(w, h, wsBox(), 16), X = M.X, Y = M.Y;
        // reachable annulus
        ctx.fillStyle = SK.alpha(C.blue, 0.07);
        ctx.beginPath(); ctx.arc(X(0), Y(0), (P.L1 + P.L2) * M.s, 0, TAU); ctx.arc(X(0), Y(0), Math.abs(P.L1 - P.L2) * M.s, 0, TAU, true); ctx.fill();
        ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.arc(X(0), Y(0), (P.L1 + P.L2) * M.s, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(X(0), Y(0), Math.abs(P.L1 - P.L2) * M.s, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        P.obs.forEach((o, k) => { const c = obsCol(C, k); ctx.fillStyle = SK.alpha(c, 0.28); ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(o.x), Y(o.y), o.r * M.s, 0, TAU); ctx.fill(); ctx.stroke(); });
        // tip trail
        if (P.trail.length > 1) {
          ctx.strokeStyle = SK.alpha(C.ink3, 0.6); ctx.lineWidth = 1.2; ctx.beginPath();
          P.trail.forEach(([a, b], i) => { const p = fk(a, b)[1]; if (i) ctx.lineTo(X(p[0]), Y(p[1])); else ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.stroke();
        }
        const hit = hitAt(P.th[0], P.th[1]);
        const [e, p] = fk(P.th[0], P.th[1]);
        const armC = hit ? C.bad : C.ink;
        ctx.lineCap = 'round'; ctx.strokeStyle = armC; ctx.lineWidth = 7; SK.line(ctx, X(0), Y(0), X(e[0]), Y(e[1])); ctx.lineWidth = 6; SK.line(ctx, X(e[0]), Y(e[1]), X(p[0]), Y(p[1]));
        SK.dot(ctx, X(0), Y(0), 6, C.paper3, armC, 2); SK.dot(ctx, X(e[0]), Y(e[1]), 6, C.paper3, armC, 2); SK.dot(ctx, X(p[0]), Y(p[1]), 7, C.acc, C.paper3, 2);
        SK.text(ctx, `θ₁ ${deg(P.th[0]).toFixed(0)}°`, X(0) + 10, Y(0) + 16, { c: C.ink2, s: 11.5, halo: C.paper });
        SK.text(ctx, `θ₂ ${deg(P.th[1]).toFixed(0)}°`, X(e[0]) + 10, Y(e[1]) + 16, { c: C.ink2, s: 11.5, halo: C.paper });
        SK.text(ctx, '작업 공간', 12, 16, { c: C.ink3, s: 11.5, w: 600 });
        if (hit) SK.text(ctx, '충돌!', w - 12, 16, { c: C.bad, s: 12.5, w: 700, a: 'right' });
      };
      cs.draw = (ctx, w, h, C) => {
        if (P.torus) {
          cam.s = Math.min(w, h) * 0.33; cam.cx = w / 2; cam.cy = h / 2 + 6;
          const f = cam.basis().f;
          // wireframe, back first
          const lines = [];
          for (let i = 0; i < 24; i++) { const a = (TAU * i) / 24; const pts = []; for (let k = 0; k <= 40; k++) pts.push(torusPt(a, (TAU * k) / 40)); lines.push(pts); }
          for (let j = 0; j < 12; j++) { const b = (TAU * j) / 12; const pts = []; for (let k = 0; k <= 72; k++) pts.push(torusPt((TAU * k) / 72, b)); lines.push(pts); }
          ctx.lineWidth = 1;
          lines.forEach((pts) => { for (let k = 1; k < pts.length; k++) { const a = cam.P(pts[k - 1]), b = cam.P(pts[k]); const front = (a[2] + b[2]) / 2 > -0.1; ctx.strokeStyle = front ? C.faint : SK.alpha(C.ink3, 0.08); SK.line(ctx, a[0], a[1], b[0], b[1]); } });
          // obstacle samples on the visible side
          const step = 3;
          for (let j = 0; j < N; j += step) for (let i = 0; i < N; i += step) {
            const v = grid[j * N + i]; if (!v) continue;
            const a = -PI + ((i + 0.5) * TAU) / N, b = -PI + ((j + 0.5) * TAU) / N;
            const nrm = [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)];
            const vis = nrm[0] * f[0] + nrm[1] * f[1] + nrm[2] * f[2];
            const q = cam.P(torusPt(a, b));
            ctx.fillStyle = SK.alpha(obsCol(C, v - 1), vis > 0 ? 0.75 : 0.12);
            ctx.fillRect(q[0] - 1.6, q[1] - 1.6, 3.2, 3.2);
          }
          if (P.trail.length > 1) {
            ctx.strokeStyle = SK.alpha(C.ink, 0.55); ctx.lineWidth = 1.4; ctx.beginPath();
            P.trail.forEach(([a, b], i) => { const q = cam.P(torusPt(a, b)); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke();
          }
          const q = cam.P(torusPt(P.th[0], P.th[1]));
          SK.dot(ctx, q[0], q[1], 7, hitAt(P.th[0], P.th[1]) ? C.bad : C.ink, C.paper3, 2);
          SK.text(ctx, 'C-공간 = 토러스 T² (끌어서 돌리기)', 12, 16, { c: C.ink3, s: 11.5, w: 600 });
          return;
        }
        const m = csMap(w, h);
        ctx.fillStyle = C.paper3; ctx.fillRect(m.ox, m.oy, m.s, m.s);
        ctx.imageSmoothingEnabled = false; ctx.drawImage(gridImage(C), m.ox, m.oy, m.s, m.s); ctx.imageSmoothingEnabled = true;
        ctx.strokeStyle = C.ruleS; ctx.lineWidth = 1; ctx.strokeRect(m.ox, m.oy, m.s, m.s);
        ctx.strokeStyle = C.faint; [-PI / 2, 0, PI / 2].forEach((t) => { SK.line(ctx, m.X(t), m.oy, m.X(t), m.oy + m.s); SK.line(ctx, m.ox, m.Y(t), m.ox + m.s, m.Y(t)); });
        // identification marks: single arrows on the vertical edges, double on the horizontal ones
        const chev = (x, y, dir, n) => { for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * 7; ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5; ctx.beginPath(); if (dir === 'up') { ctx.moveTo(x - 5, y + o + 3); ctx.lineTo(x, y + o - 3); ctx.lineTo(x + 5, y + o + 3); } else { ctx.moveTo(x + o - 3, y - 5); ctx.lineTo(x + o + 3, y); ctx.lineTo(x + o - 3, y + 5); } ctx.stroke(); } };
        chev(m.ox, m.oy + m.s / 2, 'up', 1); chev(m.ox + m.s, m.oy + m.s / 2, 'up', 1);
        chev(m.ox + m.s / 2, m.oy, 'right', 2); chev(m.ox + m.s / 2, m.oy + m.s, 'right', 2);
        const tick = (s) => s;
        SK.text(ctx, '−π', m.ox, m.oy + m.s + 14, { c: C.ink3, s: 11, a: 'center' }); SK.text(ctx, 'π', m.ox + m.s, m.oy + m.s + 14, { c: C.ink3, s: 11, a: 'center' });
        SK.text(ctx, tick('θ₁'), m.ox + m.s / 2, m.oy + m.s + 16, { c: C.ink2, s: 12, w: 600, a: 'center' });
        SK.text(ctx, 'π', m.ox - 8, m.oy, { c: C.ink3, s: 11, a: 'right' }); SK.text(ctx, '−π', m.ox - 8, m.oy + m.s, { c: C.ink3, s: 11, a: 'right' });
        SK.text(ctx, 'θ₂', m.ox - 10, m.oy + m.s / 2, { c: C.ink2, s: 12, w: 600, a: 'right' });
        if (P.trail.length > 1) {
          ctx.strokeStyle = SK.alpha(C.ink, 0.5); ctx.lineWidth = 1.3; ctx.beginPath();
          P.trail.forEach(([a, b], i) => { const x = m.X(a), y = m.Y(b); if (i && Math.abs(a - P.trail[i - 1][0]) < PI && Math.abs(b - P.trail[i - 1][1]) < PI) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
        }
        const hit = hitAt(P.th[0], P.th[1]);
        SK.dot(ctx, m.X(P.th[0]), m.Y(P.th[1]), 7, hit ? C.bad : C.ink, C.paper3, 2);
        SK.text(ctx, 'C-공간 (θ₁, θ₂)', 12, 16, { c: C.ink3, s: 11.5, w: 600 });
      };
      const report = () => {
        const hit = hitAt(P.th[0], P.th[1]);
        let free = 0; for (let k = 0; k < grid.length; k++) if (!grid[k]) free++;
        out.innerHTML = `<div class="row"><span>자세 ${SK.tex(`(\\theta_1,\\theta_2)=(${deg(P.th[0]).toFixed(0)}^\\circ,\\ ${deg(P.th[1]).toFixed(0)}^\\circ)`)}</span>${SK.badge(!hit, '자유 공간', '충돌 — C-장애물 안')}</div>
          <div class="row"><span>C-공간에서 장애물이 차지하는 비율: <b>${(100 - (100 * free) / grid.length).toFixed(1)}%</b> (작업 공간에서는 작은 원 세 개)</span></div>`;
      };
      const push = () => { P.trail.push([P.th[0], P.th[1]]); if (P.trail.length > 600) P.trail.shift(); };
      const redraw = () => { ws.req(); cs.req(); report(); };

      SK.check(ctrl, '토러스로 보기', false, (v) => { P.torus = v; cs.req(); });
      SK.btn(ctrl, '자취 지우기', () => { P.trail = []; ws.req(); cs.req(); });
      SK.slider(ctrl, { label: '링크 1', min: 0.5, max: 1.3, step: 0.05, value: P.L1, fmt: (v) => v.toFixed(2), on: (v) => { P.L1 = v; compute(); redraw(); } });
      SK.slider(ctrl, { label: '링크 2', min: 0.3, max: 1.2, step: 0.05, value: P.L2, fmt: (v) => v.toFixed(2), on: (v) => { P.L2 = v; compute(); redraw(); } });
      report();

      let moving = null, recompute = 0;
      SK.drag(ws, {
        pick(x, y) {
          const M = SK.fitMap(ws.w, ws.h, wsBox(), 16);
          const [e, p] = fk(P.th[0], P.th[1]);
          if (Math.hypot(x - M.X(p[0]), y - M.Y(p[1])) < 16) return 'tip';
          for (let k = 0; k < P.obs.length; k++) { const o = P.obs[k]; if (Math.hypot(M.ix(x) - o.x, M.iy(y) - o.y) < o.r + 0.05) return 'o' + k; }
          if (Math.hypot(x - M.X(e[0]), y - M.Y(e[1])) < 16) return 'elbow';
          const wx = M.ix(x), wy = M.iy(y), t = Math.hypot(wx, wy);
          if (t < P.L1 + 0.1) return 'elbow';
          return null;
        },
        move(hd, x, y) {
          const M = SK.fitMap(ws.w, ws.h, wsBox(), 16);
          const wx = M.ix(x), wy = M.iy(y);
          if (hd === 'elbow') { P.th[0] = Math.atan2(wy, wx); push(); }
          else if (hd === 'tip') {
            let r = Math.hypot(wx, wy); const rmax = P.L1 + P.L2 - 1e-6, rmin = Math.abs(P.L1 - P.L2) + 1e-6;
            r = Math.max(rmin, Math.min(rmax, r));
            const c2 = (r * r - P.L1 * P.L1 - P.L2 * P.L2) / (2 * P.L1 * P.L2);
            const t2 = (P.th[1] >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, c2)));
            const t1 = Math.atan2(wy, wx) - Math.atan2(P.L2 * Math.sin(t2), P.L1 + P.L2 * Math.cos(t2));
            P.th = [wrap(t1), wrap(t2)]; push();
          } else { const k = +hd.slice(1); P.obs[k].x = wx; P.obs[k].y = wy; moving = k; clearTimeout(recompute); recompute = setTimeout(() => { compute(); redraw(); }, 30); }
          redraw();
        },
        end() { if (moving != null) { compute(); redraw(); moving = null; } },
      });
      const orb = SK.orbit(cs, cam, () => cs.req());
      SK.drag(cs, {
        pick(x, y) {
          if (P.torus) return orb.pick(x, y);
          const m = csMap(cs.w, cs.h);
          return x >= m.ox - 10 && x <= m.ox + m.s + 10 && y >= m.oy - 10 && y <= m.oy + m.s + 10 ? 'pt' : null;
        },
        start(hd, x, y) { if (hd === 'pt') this.move(hd, x, y); },
        move(hd, x, y) {
          if (hd === 'orbit') { orb.move(hd, x, y); return; }
          const m = csMap(cs.w, cs.h);
          P.th = [wrap(m.it(x)), wrap(m.jt(y))]; push(); redraw();
        },
      });
    },
  };

  // ======================================================================================
  // 비홀로노믹 구속: 옆으로는 못 가지만 평행 주차는 된다
  // ======================================================================================
  S.car = {
    title: '구르는 바퀴와 평행 주차',
    ch: 'ch02', k: '2.4',
    desc: '자동차(또는 구르는 동전)는 바퀴가 옆으로 미끄러지지 않아서 매 순간 앞뒤로만 움직일 수 있습니다. 속도의 세 방향(앞뒤, 옆, 회전) 가운데 옆 방향이 막혀 있는데도, 앞뒤 운동과 방향 바꾸기를 섞으면 결국 어떤 위치와 방향에도 닿습니다. 형상이 아니라 속도를 묶는 **비홀로노믹 구속**입니다.',
    tries: [
      '‘앞으로’와 ‘뒤로’를 누르고 있는 동안 조향 막대를 움직여 보세요. 차는 언제나 자기가 향한 방향(화살표)으로만 갑니다.',
      '‘평행 주차’를 눌러 보세요. 옆으로 한 번도 미끄러지지 않고 옆 칸으로 옮겨 갑니다.',
      '흔적을 보면 앞뒤-좌우 조합 네 번이 옆 방향의 작은 이동을 만듭니다(리 괄호). 조향을 크게 할수록 한 번에 많이 옮겨 갑니다.',
    ],
    mount(stage) {
      const st = SK.canvas(stage, { ratio: 0.55, min: 260, max: 420, label: '평면 위의 자동차' });
      const ctrl = SK.panel(stage);
      const out = SK.out(stage);
      const L = 0.5; // wheelbase
      const P = { x: -1.6, y: 0, phi: 0, steer: 0, v: 0, trail: [], script: null };
      const box = [-3.6, 3.6, -1.7, 1.9];
      st.draw = (ctx, w, h, C) => {
        const M = SK.fitMap(w, h, box, 12), X = M.X, Y = M.Y;
        SK.grid(ctx, M, box, 0.5, C.faint);
        // parking slots
        ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]);
        [[-2.4, -0.45, 1.6, 0.9], [-2.4, 0.65, 1.6, 0.9]].forEach(([x, y, ww, hh]) => ctx.strokeRect(X(x), Y(y + hh), ww * M.s, hh * M.s));
        ctx.setLineDash([]);
        if (P.trail.length > 1) {
          ctx.strokeStyle = SK.alpha(C.acc, 0.8); ctx.lineWidth = 1.6; ctx.beginPath();
          P.trail.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke();
        }
        // body
        const c = Math.cos(P.phi), s = Math.sin(P.phi);
        const corner = (u, v) => [P.x + u * c - v * s, P.y + u * s + v * c];
        const body = [corner(-0.18, -0.2), corner(0.68, -0.2), corner(0.68, 0.2), corner(-0.18, 0.2)];
        ctx.fillStyle = SK.alpha(C.blue, 0.18); ctx.strokeStyle = C.blue; ctx.lineWidth = 1.6;
        ctx.beginPath(); body.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.closePath(); ctx.fill(); ctx.stroke();
        const wheel = (u, v, ang) => { const p = corner(u, v), cc = Math.cos(P.phi + ang), ss = Math.sin(P.phi + ang); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineCap = 'butt'; SK.line(ctx, X(p[0] - 0.09 * cc), Y(p[1] - 0.09 * ss), X(p[0] + 0.09 * cc), Y(p[1] + 0.09 * ss)); ctx.lineCap = 'round'; };
        wheel(0, -0.2, 0); wheel(0, 0.2, 0); wheel(L, -0.2, P.steer); wheel(L, 0.2, P.steer);
        // allowed velocity direction and the forbidden sideways one
        SK.arrow(ctx, X(P.x), Y(P.y), X(P.x + 0.55 * c), Y(P.y + 0.55 * s), C.ok, 2.2, 9);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = C.bad; ctx.lineWidth = 1.5; SK.line(ctx, X(P.x - 0.4 * s), Y(P.y + 0.4 * c), X(P.x + 0.4 * s), Y(P.y - 0.4 * c)); ctx.setLineDash([]);
        SK.text(ctx, '✕ 옆으로는 못 감', X(P.x - 0.45 * s), Y(P.y + 0.45 * c), { c: C.bad, s: 11, a: 'center', halo: C.paper });
        SK.dot(ctx, X(P.x), Y(P.y), 4, C.ink, null);
      };
      const report = () => {
        out.innerHTML = `<div class="row"><span>형상 ${SK.tex(`q=(x,y,\\phi)=(${P.x.toFixed(2)},\\ ${P.y.toFixed(2)},\\ ${deg(wrap(P.phi)).toFixed(0)}^\\circ)`)}</span></div>
          <div class="row"><span>구속(뒷바퀴 축이 옆으로 미끄러지지 않음): ${SK.tex('\\dot x\\sin\\phi-\\dot y\\cos\\phi=0')} — 속도에 대한 식 하나, 적분되지 않음</span></div>`;
      };
      const step = (dt) => {
        if (P.script) {
          const s = P.script; s.t += dt;
          while (s.k < s.seq.length && s.t > s.seq[s.k][2]) { s.t -= s.seq[s.k][2]; s.k++; }
          if (s.k >= s.seq.length) { P.script = null; P.v = 0; steer.set(0, true); P.steer = 0; report(); return false; }
          P.v = s.seq[s.k][0]; P.steer = s.seq[s.k][1]; steer.set(deg(P.steer), true);
        }
        if (!P.v) { report(); return !!P.script; }
        const sub = 4;
        for (let i = 0; i < sub; i++) {
          const d = dt / sub;
          P.x += P.v * Math.cos(P.phi) * d; P.y += P.v * Math.sin(P.phi) * d; P.phi += ((P.v * Math.tan(P.steer)) / L) * d;
        }
        P.x = Math.max(box[0] + 0.3, Math.min(box[1] - 0.3, P.x)); P.y = Math.max(box[2] + 0.3, Math.min(box[3] - 0.3, P.y));
        P.trail.push([P.x, P.y]); if (P.trail.length > 1500) P.trail.shift();
        st.now(); report();
        return true;
      };
      const loop = SK.loop(stage, step);
      const hold = (b, v) => {
        const on = (e) => { e.preventDefault(); P.script = null; P.v = v; loop.start(); };
        const off = () => { if (!P.script) P.v = 0; };
        b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
      };
      hold(SK.btn(ctrl, '◀ 뒤로', () => {}), -0.6);
      hold(SK.btn(ctrl, '앞으로 ▶', () => {}, 'primary'), 0.6);
      const steer = SK.slider(ctrl, { label: '조향각', min: -35, max: 35, step: 1, value: 0, fmt: (v) => `${v.toFixed(0)}°`, on: (v) => { P.steer = (v * PI) / 180; st.req(); } });
      SK.btn(ctrl, '평행 주차', () => {
        P.x = -1.6; P.y = 0; P.phi = 0; P.trail = [];
        const a = 0.55;
        P.script = { t: 0, k: 0, seq: [[0.6, a, 1.15], [0.6, -a, 1.15], [-0.6, a, 1.15], [-0.6, -a, 1.15]] };
        loop.start();
      });
      SK.btn(ctrl, '처음으로', () => { P.script = null; P.v = 0; P.x = -1.6; P.y = 0; P.phi = 0; P.trail = []; steer.set(0); st.req(); report(); });
      report();
    },
  };
})();
