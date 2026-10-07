/* 로봇공학 그림 — 기출 풀이(중간고사 1, 2023–2025). 시험지 그림을 그대로 옮기지 않고 풀이에 필요한 모양·치수·접촉만 남겨 다시 그렸습니다.
   그리는 도구는 core/figkit.js(FK). 좌표는 문제의 좌표(단위 길이)로 쓰고 W(x, y)로 화면에 옮깁니다. */
(function () {
  const { fig, L, A, T, C, P, f1 } = window.FK;
  const rad = (d) => (d * Math.PI) / 180;
  const S2 = Math.SQRT2, S3 = Math.sqrt(3);
  const map = (x0, y0, k) => (x, y) => [x0 + k * x, y0 - k * y];
  const poly = (W, pts, cls) => P('M' + pts.map((p) => W(...p).map(f1).join(',')).join('L') + 'Z', cls);
  const line = (W, p, q, cls) => L(...W(...p), ...W(...q), cls);
  const push = (W, p, d, len, cls = 'rx') => { // arrow ending at contact p, pointing along d (unit, problem coords), drawn len px long
    const [x, y] = W(...p), n = Math.hypot(d[0], d[1]), ux = d[0] / n, uy = -d[1] / n;
    return A(x - ux * (len + 4), y - uy * (len + 4), x - ux * 4, y - uy * 4, cls, 8) + C(x, y, 3.2, 'dotf');
  };
  const arcPath = (W, c, r, a0, a1, n = 40) => { const pts = []; for (let k = 0; k <= n; k++) { const a = rad(a0 + ((a1 - a0) * k) / n); pts.push(W(c[0] + r * Math.cos(a), c[1] + r * Math.sin(a))); } return pts; };
  const pathOf = (pts) => 'M' + pts.map((p) => p.map(f1).join(',')).join('L');
  const dotAx = (x, y, into) => C(x, y, 6, 'sp') + (into ? L(x - 3.5, y - 3.5, x + 3.5, y + 3.5, 'vl') + L(x - 3.5, y + 3.5, x + 3.5, y - 3.5, 'vl') : C(x, y, 2, 'dotf'));

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 2023 P2 — tangram shapes: square, sailboat, arrow (exam arrangement) and a new arrangement
    fm23Tangram() {
      const k = 40, piece = (W, pts, lab, fr) => { const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]); return poly(W, pts, fr ? 'bm2' : 'rg') + P('M' + pts.map((p) => W(...p).map(f1).join(',')).join('L') + 'Z', 'gd') + T(...W(...c).map((v, i) => v + (i ? 4 : 0)), lab, { s: 10.5 }); };
      let s = '';
      // (a) square
      {
        const by = 160, W = map(140, by, k), r = S2;
        s += piece(W, [[-r, 2 * r], [r, 2 * r], [0, r]], '①') + piece(W, [[r, 2 * r], [r, 0], [0, r]], '②');
        s += piece(W, [[-r, r], [-r / 2, r / 2], [-r / 2, 3 * r / 2], [-r, 2 * r]], '③') + piece(W, [[-r / 2, r / 2], [0, r], [-r / 2, 3 * r / 2]], '④');
        s += piece(W, [[0, 0], [r / 2, r / 2], [0, r], [-r / 2, r / 2]], '⑤', true) + piece(W, [[0, 0], [r, 0], [r / 2, r / 2]], '⑥') + piece(W, [[-r, 0], [0, 0], [-r, r]], '⑦');
        s += push(W, [0, 2 * r], [0, -1], 22) + T(...W(0.15, 2 * r).map((v, i) => v + (i ? -16 : 0)), 'a', { a: 'start', c: 'rl' });
        s += push(W, [r, r], [-1, 0], 22) + T(...W(r, r).map((v, i) => v + (i ? -8 : 10)), 'b', { a: 'start', c: 'rl' });
        s += L(...W(-r - 0.12, 0.2), ...W(-r - 0.12, 2 * r - 0.2), 'rx ds') + push(W, [-r, 1.3], [1, 0], 20) + T(...W(-r, 1.3).map((v, i) => v + (i ? -8 : -26)), 'c?', { a: 'end', c: 'rl' });
        s += T(140, by + 44, '(a) 정사각형', { c: 'em', s: 11.5 });
      }
      // (b) sailboat
      {
        const by = 160, W = map(410, by, k * 0.82), r = S2;
        s += piece(W, [[-2, 1], [0, 1], [0, 3]], '①') + piece(W, [[0, 1], [r, 1], [0, 1 + r]], '⑦') + piece(W, [[0, 1 + r], [r, 1], [r, 1 + 2 * r]], '②');
        s += piece(W, [[-2, 1], [-1, 1], [0, 0], [-1, 0]], '③') + piece(W, [[-1, 1], [0, 1], [0, 0]], '④') + piece(W, [[0, 0], [1, 0], [1, 1], [0, 1]], '⑤', true) + piece(W, [[1, 0], [1, 1], [2, 1]], '⑥');
        s += push(W, [-1, 2], [1, -1], 20) + T(...W(-1, 2).map((v, i) => v + (i ? -10 : -16)), 'a', { a: 'end', c: 'rl' });
        s += push(W, [r, 1 + r], [-1, 0], 20) + T(...W(r, 1 + r).map((v, i) => v + (i ? -8 : 8)), 'b', { a: 'start', c: 'rl' });
        const cx = 0.55, [px, py] = W(cx, 0);
        s += A(px, py, px - 14, py - 20, 'ld', 7) + A(px, py, px + 14, py - 20, 'ld', 7) + C(px, py, 3.2, 'dotf') + T(px + 4, py + 14, 'c = (x, 0), μ', { s: 10.5 });
        s += T(410, by + 44, '(b) 돛단배', { c: 'em', s: 11.5 });
      }
      // (c) arrow, exam arrangement
      {
        const by = 360, W = map(140, by, k * 0.82);
        s += piece(W, [[-2, 2], [-1, 2], [-1, 3]], '④') + piece(W, [[-1, 2], [0, 2], [0, 3], [-1, 3]], '⑤', true) + piece(W, [[0, 2], [0, 3], [1, 2]], '⑥') + piece(W, [[0, 3], [1, 3], [2, 2], [1, 2]], '③') + piece(W, [[-1, 3], [1, 3], [0, 4]], '⑦');
        s += piece(W, [[-1, 0], [1, 0], [-1, 2]], '①') + piece(W, [[-1, 2], [1, 2], [1, 0]], '②');
        s += push(W, [-1, 3], [1, -1], 18) + push(W, [1, 3], [-1, -1], 18) + push(W, [0.3, 0], [0, 1], 16, 'ld');
        s += T(...W(0.3, 0).map((v, i) => v + (i ? 16 : 10)), 'c: ① (μ = 0)', { a: 'start', s: 10.5 });
        s += T(140, by + 44, '(c) 시험지 배치: 불가능', { c: 'em', s: 11.5 });
      }
      // (c') new arrangement
      {
        const by = 360, W = map(410, by, k * 0.82);
        s += piece(W, [[-2, 2], [0, 2], [0, 4]], '①') + piece(W, [[0, 2], [2, 2], [0, 4]], '②');
        s += piece(W, [[-1, 0], [-1, 2], [0, 1]], '⑦') + piece(W, [[-1, 0], [0, 0], [0, 1]], '④') + piece(W, [[0, 0], [1, 0], [1, 1], [0, 1]], '⑤', true) + piece(W, [[-1, 2], [0, 2], [1, 1], [0, 1]], '③') + piece(W, [[0, 2], [1, 2], [1, 1]], '⑥');
        s += push(W, [-1, 3], [1, -1], 18) + push(W, [1, 3], [-1, -1], 18);
        const [px, py] = W(0.5, 0);
        s += A(px, py, px - 10, py - 20, 'ld', 7) + A(px, py, px + 10, py - 20, 'ld', 7) + C(px, py, 3.2, 'dotf');
        s += L(...W(0.05, -0.15), ...W(0.95, -0.15), 'rx') + T(...W(0.5, 0).map((v, i) => v + (i ? 16 : 0)), '0 < x < 1', { c: 'rl', s: 10.5 });
        s += T(410, by + 44, "(c) 새 배치: ⑤를 아래로", { c: 'em', s: 11.5 });
      }
      return fig(560, 420, '탱그램 모양 넷: (a) 정사각형, (b) 돛단배, (c) 화살표의 시험지 배치와 새 배치. 짙은 조각 ⑤만 마찰이 있다',
        s,
        '(a) 마찰 없는 접촉 a, b, c 셋으로는 어디에 c를 두어도 힘 닫힘이 아닙니다. (b) c가 마찰 있는 ⑤에 있어 $\\mu\\gt\\frac{x+\\sqrt2}{1+\\sqrt2}$이면 힘 닫힘. (c) 시험지의 배치에서 아래 변은 마찰 없는 ①이라 불가능하고, 화살촉을 ①②로 만들고 ⑤를 화살대 아래에 두면 $0\\lt x\\lt1$ 전체에서 힘 닫힘($\\mu=0.5$).');
    },
    // 2023 P4 — Yaskawa MPX3500 in its zero configuration (side view), with the D-H frames
    fm23Mpx() {
      const k = 54, W = map(84, 240, k), iz = 1 / S2;
      let s = L(...W(-1.1, -0.15), ...W(6.7, -0.15), 'gd');
      for (let x = -1.0; x <= 1.0; x += 0.16) s += L(...W(x, -0.15), ...W(x - 0.12, -0.32), 'ht');
      s += L(...W(0, 0), ...W(0, 2), 'th') + L(...W(0, 2), ...W(4, 2), 'th') + L(...W(4, 2), ...W(5, 1), 'th') + L(...W(5, 1), ...W(6, 1), 'th');
      s += `<rect class="bm" x="${f1(W(0, 1.45)[0] - 15)}" y="${f1(W(0, 1.45)[1])}" width="30" height="${f1(0.45 * k)}"/>`;
      s += C(...W(0, 2), 13, 'bm') + C(...W(2, 2), 13, 'bm');
      s += `<rect class="bm" x="${f1(W(2.9, 2)[0])}" y="${f1(W(2.9, 2)[1] - 11)}" width="${f1(0.7 * k)}" height="22"/>`;
      const m5 = W(4.5, 1.5);
      s += `<rect class="bm" x="${f1(m5[0] - 19)}" y="${f1(m5[1] - 10)}" width="38" height="20" transform="rotate(45 ${f1(m5[0])} ${f1(m5[1])})"/>`;
      s += `<rect class="bm" x="${f1(W(5.2, 1)[0])}" y="${f1(W(5.2, 1)[1] - 10)}" width="${f1(0.5 * k)}" height="20"/>`;
      s += T(...W(-0.38, 1.18), 'θ₁', { a: 'end', c: 'it' }) + T(...W(-0.34, 2.36), 'θ₂', { a: 'end', c: 'it' }) + T(...W(1.62, 2.4), 'θ₃', { a: 'end', c: 'it' }) + T(...W(3.25, 2.42), 'θ₄', { c: 'it' }) + T(...W(4.95, 1.72), 'θ₅', { a: 'start', c: 'it' }) + T(...W(5.45, 1.38), 'θ₆', { c: 'it' });
      const dimH = (x1, x2, y, lab) => A(...W((x1 + x2) / 2, y), ...W(x1, y), 'dm', 6) + A(...W((x1 + x2) / 2, y), ...W(x2, y), 'dm', 6) + T(...W((x1 + x2) / 2, y).map((v, i) => v + (i ? -6 : 0)), lab, { s: 11.5 });
      const dimV = (x, y1, y2, lab) => A(...W(x, (y1 + y2) / 2), ...W(x, y1), 'dm', 6) + A(...W(x, (y1 + y2) / 2), ...W(x, y2), 'dm', 6) + T(...W(x, (y1 + y2) / 2).map((v, i) => v + (i ? 4 : -6)), lab, { a: 'end', s: 11.5 });
      s += dimH(0, 2, 3.05, '2L') + dimH(2, 4, 3.05, '2L') + dimH(4, 5, 3.05, 'L') + dimH(5, 6, 3.05, 'L');
      s += dimV(-1.15, 0, 1, 'L') + dimV(-1.15, 1, 2, 'L') + dimV(6.55, 1, 2, 'L');
      // arrow helper: origin p (problem coords), direction d (screen-math), label and label offset
      const ar = (p, d, lab, off, cls, len = 34) => { const O = W(...p), E = [O[0] + len * d[0], O[1] - len * d[1]]; return A(...O, ...E, cls, 7) + T(E[0] + off[0], E[1] + off[1], lab, { a: off[0] < 0 ? 'end' : off[0] > 0 ? 'start' : 'middle', c: cls === 'rx' ? 'rl' : 'it' }); };
      const out = (p, dx, dy, lab, cls) => { const O = W(...p); return dotAx(O[0] + dx, O[1] + dy, false) + T(O[0] + dx + (dx < 0 ? -9 : 9), O[1] + dy + 4, lab, { a: dx < 0 ? 'end' : 'start', c: cls === 'rx' ? 'rl' : 'it' }); };
      // given {3}–{6}
      s += ar([2, 2], [0, 1], 'x₃', [6, 0], 'vl') + ar([2, 2], [-1, 0], 'y₃', [0, -9], 'vl') + out([2, 2], 18, 22, 'z₃', 'vl');
      s += ar([4, 2], [1, 0], 'z₄', [0, -9], 'vl') + ar([4, 2], [0, -1], 'y₄', [-7, 4], 'vl') + out([4, 2], -20, 22, 'x₄', 'vl');
      s += ar([5, 1], [iz, -iz], 'z₅', [6, 6], 'vl') + ar([5, 1], [-iz, -iz], 'y₅', [-6, 8], 'vl') + out([5, 1], -28, 2, 'x₅', 'vl');
      s += ar([6, 1], [1, 0], 'z₆', [0, -9], 'vl') + ar([6, 1], [0, -1], 'y₆', [7, 4], 'vl') + out([6, 1], 18, 18, 'x₆', 'vl');
      // derived {0}–{2} (the answer)
      s += ar([0, 0], [1, 0], 'z₀', [0, -9], 'rx') + ar([0, 0], [0, -1], 'y₀', [7, 6], 'rx', 26) + out([0, 0], -22, -14, 'x₀', 'rx');
      s += ar([0, 2], [0, 1], 'z₁', [6, 0], 'rx', 30) + ar([0, 2], [-1, 0], 'x₁ = x₂', [0, -9], 'rx') + out([0, 2], 20, -20, 'y₁, z₂', 'rx');
      s += T(...W(-0.3, -0.5), '{0} (바닥)', { a: 'end', c: 'rl', s: 11 }) + T(...W(-0.7, 2.62), '{1},{2}', { a: 'end', c: 'rl', s: 11 });
      return fig(500, 300, '야스카와 MPX3500의 영 자세(옆모습). 검은 좌표계는 주어진 {3}–{6}, 주황은 거꾸로 되짚은 {0}–{2}',
        s,
        '⊙는 화면 밖(관절 2·3의 축 방향, 바깥 좌표의 $-\\hat y$)입니다. {1}, {2}의 원점은 관절 2의 축 위 $(0,0,2L)$에서 겹치며 $\\hat x_1=\\hat x_2$는 뒤쪽($-\\hat x$), $\\hat z_1$은 위, $\\hat y_1$과 $\\hat z_2$는 화면 밖, $\\hat y_2$는 아래입니다. {0}은 바닥 $(0,0,0)$에서 $\\hat z_0$가 앞(팔 방향)으로 누운 좌표계입니다.');
    },
    // 2024 P2 — the SNU gate model: (a) four contacts, (b) two contacts and where a third can go, (c) the redesigned gate
    fm24Gate() {
      const k = 14.2, base = 262;
      const st = (s, t) => [(t - s) / S2, (s + t) / S2]; // local arm coordinates → problem coordinates
      const body = (W, arch) => {
        let s = '';
        const sq = (x, y, w, h, cls = 'rg') => poly(W, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], cls) + P('M' + [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => W(...p).map(f1).join(',')).join('L') + 'Z', 'gd');
        const r = 2 * S2;
        [0, 2 * S2, 4 * S2, 7 * S2, 9 * S2].forEach((y) => { s += sq(0, y, r, r); });
        s += sq(0, 6 * S2, r, S2) + sq(-r, 9 * S2, r, r);
        if (!arch) {
          s += sq(r, 4 * S2, r, r) + sq(r, 7 * S2, r, r);
          const rq = (pts) => poly(W, pts.map((p) => st(...p)), 'rg') + P('M' + pts.map((p) => W(...st(...p)).map(f1).join(',')).join('L') + 'Z', 'gd');
          s += rq([[0, 0], [2, 0], [2, 2]]) + rq([[2, 0], [4, 0], [4, 2], [2, 2]]) + rq([[4, 0], [6, 0], [6, 2], [4, 2]]) + rq([[4, -2], [6, -2], [6, 0], [4, 0]]) + rq([[4, -4], [6, -4], [6, -2], [4, -2]]);
        } else {
          const q1 = arcPath(W, [r, 4 * S2], r, 0, 90), q2 = arcPath(W, [r, 7 * S2], r, 0, 90);
          s += P(pathOf([W(r, 4 * S2), ...q1]) + 'Z', 'rg') + P(pathOf([W(r, 4 * S2), ...q1]) + 'Z', 'gd');
          s += P(pathOf([W(r, 7 * S2), ...q2]) + 'Z', 'rg') + P(pathOf([W(r, 7 * S2), ...q2]) + 'Z', 'gd');
          const arc = arcPath(W, [-r, 0], r, 0, 180);
          const outline = [W(0, 0), ...arc, W(...st(6, -4)), W(...st(6, 2)), W(...st(2, 2))];
          s += P(pathOf(outline) + 'Z', 'rg') + P(pathOf(outline) + 'Z', 'gd');
          s += line(W, st(4, 0), st(4, 2), 'gd') + line(W, st(4, 0), st(6, 0), 'gd') + line(W, st(6, -2), st(4.42, -2), 'gd');
        }
        return s;
      };
      let s = '';
      // (a)
      {
        const W = map(122, base, k);
        s += body(W, false);
        s += push(W, [2 * S2, S2], [-1, 0], 20) + T(...W(2 * S2, S2).map((v, i) => v + (i ? -6 : 6)), 'P₁', { a: 'start', c: 'rl' });
        s += push(W, [S2, 0], [0, 1], 20) + T(...W(S2, 0).map((v, i) => v + (i ? 14 : 8)), 'P₂', { a: 'start', c: 'rl' });
        s += push(W, [-S2, S2], [1, 1], 20) + T(...W(-S2, S2).map((v, i) => v + (i ? 16 : -4)), 'P₃', { a: 'end', c: 'rl' });
        s += push(W, [-S2, 3 * S2], [-1, -1], 20) + T(...W(-S2, 3 * S2).map((v, i) => v + (i ? -14 : 10)), 'P₄', { a: 'start', c: 'rl' });
        s += A(...W(-0.3, 5.2), ...W(-1.6, 6.5), 'ld', 8) + T(...W(-1.7, 6.6).map((v, i) => v + (i ? -2 : -2)), '빠져나감', { a: 'end', c: 'lb', s: 10.5 });
        s += T(100, base + 34, '(a) 힘 닫힘 아님', { c: 'em', s: 11.5 });
      }
      // (b)
      {
        const W = map(334, base, k);
        s += body(W, false);
        const hi = (p, q) => L(...W(...p), ...W(...q), 'rx') + `<line class="rx" style="stroke-width:5;stroke-opacity:.5" x1="${f1(W(...p)[0])}" y1="${f1(W(...p)[1])}" x2="${f1(W(...q)[0])}" y2="${f1(W(...q)[1])}"/>`;
        s += hi([-2 * S2 + 0.1, 11 * S2], [2 * S2 - 0.1, 11 * S2]) + hi([2 * S2 + 0.1, 9 * S2], [4 * S2 - 0.1, 9 * S2]) + hi([2 * S2 + 0.1, 6 * S2], [4 * S2 - 0.1, 6 * S2]) + hi(st(6, 0.1), st(6, 1.9));
        s += push(W, [4 * S2, 8 * S2], [-1, 0], 20) + T(...W(4 * S2, 8 * S2).map((v, i) => v + (i ? -8 : 6)), 'Pₐ', { a: 'start', c: 'rl' });
        const pb = st(4, 0);
        s += push(W, pb, [-1, 1], 18) + push(W, pb, [1, 1], 18) + T(...W(...pb).map((v, i) => v + (i ? 18 : -6)), 'P_b', { a: 'end', c: 'rl' });
        s += T(320, base + 34, '(b) 셋째 접촉: 굵은 변', { c: 'em', s: 11.5 });
      }
      // (c)
      {
        const W = map(540, base, k);
        s += body(W, true);
        const r = 2 * S2, P1 = [-r, r], P2 = [r + 2, 7 * S2 + 2], P3 = [-S2, 11 * S2], Q = [-S2, 4 * S2];
        s += line(W, P3, Q, 'dm ds') + line(W, [r, 7 * S2], Q, 'dm ds') + line(W, P1, Q, 'ld');
        const [px, py] = W(...P1);
        s += A(px, py, px + 16, py - 32, 'ld', 8);
        s += push(W, P2, [-1, -1], 18) + T(...W(...P2).map((v, i) => v + (i ? -6 : 6)), 'P₂', { a: 'start', c: 'rl' });
        s += push(W, P3, [0, -1], 18) + T(...W(...P3).map((v, i) => v + (i ? -16 : 6)), 'P₃', { a: 'start', c: 'rl' });
        s += C(px, py, 3.2, 'dotf') + T(px - 3, py + 18, 'P₁', { a: 'end', c: 'rl' });
        s += C(...W(...Q), 3, 'jt') + T(...W(...Q).map((v, i) => v + (i ? 4 : -8)), 'Q', { a: 'end', c: 'it' });
        s += T(px - 14, py - 44, '기울기 1/2', { a: 'end', c: 'lb', s: 10.5 }) + L(px - 12, py - 40, px + 6, py - 14, 'dm');
        s += T(520, base + 34, '(c) μ > 1/2', { c: 'em', s: 11.5 });
      }
      return fig(640, 312, '서울대 정문 모형: (a) 마찰 없는 접촉 넷, (b) 접촉 둘과 셋째 접촉이 놓일 수 있는 곳, (c) 아치 모형의 세 힘',
        s,
        '(a) $P_1$–$P_4$로는 모형이 왼쪽 위로 빠져나갈 수 있습니다. (b) $P_b$는 L자 팔의 오목한 모서리라 두 면을 함께 밉니다. 셋째 마찰 없는 접촉은 굵은 선(맨 윗변, 오른쪽 두 정사각형의 윗변, 팔 끝 면의 위쪽 절반) 어디에 두어도 힘 닫힘이 됩니다. (c) $P_3$과 $P_2$의 작용선이 만나는 점 $Q$를 향해 $P_1$이 밀어야 하므로 그 방향과 법선의 각 $\\tan^{-1}\\frac12$보다 마찰각이 커야 합니다.');
    },
    // 2024 P4 — Canadarm2 schematic in its zero configuration, with D-H frames
    fm24Canadarm() {
      const a = 1, c = 1.15, d = 3.6, k = 52;
      const proj = (X, Y, Z) => [86 + k * (Y - 0.55 * X), 196 - k * (Z - 0.32 * X)];
      const seg = (p, q, cls) => L(...proj(...p), ...proj(...q), cls);
      let s = `<rect class="bm" x="${f1(proj(0, 0, -0.5)[0] - 16)}" y="${f1(proj(0, 0, -0.5)[1])}" width="32" height="26"/>`;
      // links
      s += seg([0, 0, -0.5], [0, 0, 0], 'th') + seg([0, 0, 0], [a, 0, 0], 'th') + seg([a, 0, 0], [a, 0, c], 'th') + seg([a, 0, c], [a, d, c], 'th') + seg([a, d, c], [a, 2 * d, c], 'th') + seg([a, 2 * d, c], [a, 2 * d, 2 * c], 'th') + seg([a, 2 * d, 2 * c], [2 * a, 2 * d, 2 * c], 'th');
      // joint axes (dashed) and joint bodies
      const ax = (p, dir, len, lab, dx = 6, dy = -4) => { const q = p.map((v, i) => v + len * dir[i]), r = p.map((v, i) => v - len * dir[i]); return seg(r, q, 'dm ds') + C(...proj(...p), 6, 'bm') + T(...proj(...q).map((v, i) => v + (i ? dy : dx)), lab, { a: 'start', c: 'it' }); };
      s += ax([0, 0, 0], [0, 0, 1], 0.6, 'θ₁') + ax([a, 0, 0], [1, 0, 0], 0.55, 'θ₂', -14, 14) + ax([a, 0, c], [0, 0, 1], 0.55, 'θ₃') + ax([a, d, c], [0, 0, 1], 0.55, 'θ₄') + ax([a, 2 * d, c], [0, 0, 1], 0.55, 'θ₅', 10, 50) + ax([a, 2 * d, 2 * c], [-1, 0, 0], 0.5, 'θ₆', 6, -4) + ax([2 * a, 2 * d, 2 * c], [0, 0, 1], 0.55, 'θ₇');
      // dimension labels
      s += T(...proj(a / 2, 0, 0).map((v, i) => v + (i ? 14 : -4)), 'a', { c: 'it' }) + T(...proj(a, 0, c / 2).map((v, i) => v + (i ? 0 : -10)), 'c', { a: 'end', c: 'it' });
      s += T(...proj(a, d / 2, c).map((v, i) => v + (i ? -8 : 0)), 'd', { c: 'it' }) + T(...proj(a, 1.5 * d, c).map((v, i) => v + (i ? -8 : 0)), 'd', { c: 'it' });
      s += T(...proj(a, 2 * d, 1.5 * c).map((v, i) => v + (i ? 0 : 10)), 'c', { a: 'start', c: 'it' }) + T(...proj(1.5 * a, 2 * d, 2 * c).map((v, i) => v + (i ? -10 : 0)), 'a', { c: 'it' });
      // world axes
      const O = [470, 196];
      s += A(...O, O[0], O[1] - 32, 'vl', 7) + T(O[0] + 5, O[1] - 36, 'Z (z₀)', { a: 'start', c: 'it' });
      s += A(...O, O[0] + 34, O[1], 'vl', 7) + T(O[0] + 38, O[1] + 4, 'Y (y₀)', { a: 'start', c: 'it' });
      s += A(...O, O[0] - 0.55 * 34, O[1] + 0.32 * 34, 'vl', 7) + T(O[0] - 24, O[1] + 24, 'X (x₀, 앞)', { a: 'end', c: 'it' });
      return fig(560, 236, '캐나담2의 영 자세(앞쪽 X가 왼쪽 아래로 보이는 사투영): 관절 1·3·4·5·7은 수직축, 2·6은 앞뒤(X) 축',
        s,
        '관절 1과 2의 축은 만나고(관절 2는 X축 위 $a$ 앞), 관절 3은 그 위 $c$, 긴 팔 $d$ 두 개를 지나 관절 4·5, 다시 $c$ 위에 관절 6, 앞으로 $a$에 관절 7이 있습니다. 축 3·4·5가 평행해 공통 수선을 긴 팔의 높이에 잡을 수 있습니다.');
    },
    // 2025 P1 — the table seen from above, the grasp points and the frame {T}
    fm25Table() {
      const cx = 190, cy = 128, R = 70;
      let s = C(cx, cy, R, 'rg') + C(cx, cy, R, 'gd');
      const pts = [[0, 'A'], [120, 'B'], [240, 'C']];
      pts.forEach(([a, n]) => {
        const p = [cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a))], o = [cx + (R + 38) * Math.cos(rad(a)), cy - (R + 38) * Math.sin(rad(a))];
        s += L(cx, cy, ...p, 'dm ds') + C(...o, 15, 'sp') + T(o[0], o[1] + 4, '로봇', { s: 10 });
        const sh1 = [o[0] - 13 * Math.sin(rad(a)), o[1] - 13 * Math.cos(rad(a))], sh2 = [o[0] + 13 * Math.sin(rad(a)), o[1] + 13 * Math.cos(rad(a))];
        s += L(...sh1, ...p, 'th') + L(...sh2, ...p, 'th') + C(...p, 4, 'dotf') + T(p[0] + 10 * Math.cos(rad(a + 40)), p[1] - 10 * Math.sin(rad(a + 40)) + 4, n, { c: 'em' });
      });
      s += A(cx, cy, cx + 40, cy, 'vl', 8) + A(cx, cy, cx, cy - 40, 'vl', 8) + C(cx, cy, 3, 'jt') + T(cx + 44, cy + 14, 'x̂_T', { c: 'it' }) + T(cx + 6, cy - 44, 'ŷ_T', { a: 'start', c: 'it' }) + T(cx - 10, cy + 16, '{T}', { a: 'end', c: 'em' });
      s += T(400, 70, 'p_{T} = (p_{A} + p_{B} + p_{C}) / 3', { a: 'start', s: 12 }) + T(400, 96, 'x̂_{T} ∥ p_{A} − p_{T}', { a: 'start', s: 12 }) + T(400, 122, 'ŷ_{T} ∥ p_{B} − p_{C}', { a: 'start', s: 12 }) + T(400, 148, 'ẑ_{T} = x̂_{T} × ŷ_{T}', { a: 'start', s: 12 });
      return fig(600, 258, '위에서 본 탁자: 세 로봇이 두 팔로 120° 간격의 A, B, C를 잡는다',
        s,
        '팔마다 S-R-S 사슬이므로 여섯 팔이 탁자를 잡습니다. A, B, C의 무게 중심이 탁자 중심이고, A를 향하는 방향과 C에서 B로 향하는 방향이 탁자 좌표계의 두 축입니다.');
    },
    // 2025 P2(b) — the exponential-coordinate ball with the shaded wedge x ≥ 0, y ≥ 0 and the given rotation
    fm25Ball() {
      const cx = 210, cy = 128, k = 30, R = Math.PI; // ball radius π in problem units
      const proj = (x, y, z) => [cx + k * (y - 0.5 * x), cy - k * (z - 0.35 * x)];
      const pp = (pts) => 'M' + pts.map((p) => proj(...p).map(f1).join(',')).join('L');
      let s = C(cx, cy, R * k * 1.0, 'sp');
      // wedge faces: half disks in the x–z plane (x ≥ 0) and y–z plane (y ≥ 0)
      const half = (e) => { const pts = [[0, 0, -R]]; for (let i = 0; i <= 40; i++) { const a = -90 + (180 * i) / 40; pts.push([e[0] * R * Math.cos(rad(a)), e[1] * R * Math.cos(rad(a)), R * Math.sin(rad(a))]); } return pts; };
      s += P(pp(half([1, 0])) + 'Z', 'fl2') + P(pp(half([0, 1])) + 'Z', 'fl2');
      for (const az of [0, 30, 60, 90]) { const pts = []; for (let i = 0; i <= 40; i++) { const a = -90 + (180 * i) / 40; pts.push([R * Math.cos(rad(a)) * Math.cos(rad(az)), R * Math.cos(rad(a)) * Math.sin(rad(az)), R * Math.sin(rad(a))]); } s += P(pp(pts), az % 90 ? 'dm' : 'ld'); }
      { const pts = []; for (let i = 0; i <= 30; i++) { const az = (90 * i) / 30; pts.push([R * Math.cos(rad(az)), R * Math.sin(rad(az)), 0]); } s += P(pp(pts), 'ld'); }
      s += A(...proj(0, 0, 0), ...proj(1.9, 0, 0), 'vl', 7) + T(...proj(2.05, 0, 0).map((v, i) => v + (i ? 10 : -4)), 'x', { a: 'end', c: 'it' });
      s += A(...proj(0, 0, 0), ...proj(0, 1.9, 0), 'vl', 7) + T(...proj(0, 2.05, 0).map((v, i) => v + (i ? 12 : 0)), 'y', { c: 'it' });
      s += A(...proj(0, 0, 0), ...proj(0, 0, 1.9), 'vl', 7) + T(...proj(0, 0, 2.05).map((v, i) => v + (i ? 0 : 8)), 'z', { a: 'start', c: 'it' });
      const r = [1.209, -1.209, -1.209];
      s += L(...proj(0, 0, 0), ...proj(...r), 'rx ds') + C(...proj(...r), 4.5, 'doto') + T(...proj(...r).map((v, i) => v + (i ? 14 : -6)), 'r = (2π/3√3)(1, −1, −1)', { a: 'end', c: 'rl', s: 11 });
      s += T(cx + R * k + 18, 60, '색칠한 쐐기: x ≥ 0, y ≥ 0', { a: 'start', c: 'lb', s: 12 }) + T(cx + R * k + 18, 86, '‖r‖ = 2π/3 < π → 안쪽의 점 하나', { a: 'start', s: 12 }) + T(cx + R * k + 18, 112, 'y < 0 → 쐐기 밖', { a: 'start', c: 'rl', s: 12 });
      return fig(600, 256, '지수 좌표의 공(반지름 π)과 쐐기 x ≥ 0, y ≥ 0. 주어진 회전은 y < 0인 쪽에 있다',
        s,
        '$R$의 행렬 로그는 $\\theta=\\frac{2\\pi}3$, $\\hat\\omega=\\frac1{\\sqrt3}(1,-1,-1)$이므로 $r=\\hat\\omega\\theta$는 공의 안쪽($\\lVert r\\rVert\\lt\\pi$)에 있고 맞은편 점을 볼 필요가 없습니다. $y$ 성분이 음수라 쐐기에 들어가지 않습니다.');
    },
    // 2025 P3 — (a) the octagon with four offset frictionless contacts, (c) the umbrella
    fm25Grasp() {
      let s = '';
      { // octagon: side 2, frame axes along the diagonals
        const k = 26, cx = 140, cy = 128, ap = 1 + S2, l = 0.5;
        const B = (u, v) => { const x = (u - v) / S2, y = (u + v) / S2; return [cx + k * x, cy - k * y]; }; // body (diagonal) coords → screen
        const oct = []; for (let i = 0; i < 8; i++) { const a = rad(22.5 + 45 * i), rr = ap / Math.cos(rad(22.5)); oct.push([cx + k * rr * Math.cos(a), cy - k * rr * Math.sin(a)]); }
        s += P('M' + oct.map((p) => p.map(f1).join(',')).join('L') + 'Z', 'rg') + P('M' + oct.map((p) => p.map(f1).join(',')).join('L') + 'Z', 'gd');
        s += L(...B(-4.2, 0), ...B(4.2, 0), 'dm ds') + L(...B(0, -4.2), ...B(0, 4.2), 'dm ds');
        s += A(...B(0, 0), ...B(1.2, 0), 'vl', 7) + A(...B(0, 0), ...B(0, 1.2), 'vl', 7) + T(...B(1.45, 0), 'x', { c: 'it' }) + T(...B(0, 1.45), 'y', { c: 'it' });
        const f = (u, v, du, dv, lab) => { const P0 = B(u, v), d = [(du - dv) / S2, -(du + dv) / S2]; return A(P0[0] - 26 * d[0], P0[1] - 26 * d[1], P0[0] - 3 * d[0], P0[1] - 3 * d[1], 'rx', 8) + C(...P0, 3, 'dotf') + T(P0[0] - 36 * d[0], P0[1] - 36 * d[1] + 4, lab, { c: 'rl' }); };
        s += f(-ap, -l, 1, 0, 'f₁') + f(-l, -ap, 0, 1, 'f₂') + f(ap, l, -1, 0, 'f₃') + f(l, ap, 0, -1, 'f₄');
        s += T(cx, 250, '(a) 정팔각형, 엇갈림 l', { c: 'em', s: 11.5 });
      }
      { // umbrella
        const k = 10.5, W = map(430, 204, k);
        const canopy = [...arcPath(W, [0, 7], 10, 30, 150)];
        s += P(pathOf(canopy) + 'Z', 'rg') + P(pathOf(canopy) + 'Z', 'gd');
        s += poly(W, [[-1, 0], [1, 0], [1, 12], [-1, 12]], 'rg') + P('M' + [[-1, 0], [-1, 12]].map((p) => W(...p).map(f1).join(',')).join('L'), 'gd') + P('M' + [[1, 0], [1, 12]].map((p) => W(...p).map(f1).join(',')).join('L'), 'gd');
        const outer = arcPath(W, [2, 0], 3, 180, 360), inner = arcPath(W, [2, 0], 1, 360, 180);
        s += P(pathOf([...outer, ...inner]) + 'Z', 'rg') + P(pathOf([...outer, ...inner]) + 'Z', 'gd');
        const P1 = [2 + 3 / S2, -3 / S2], P2 = [-1, 3], P3 = [5, 7 + 5 * S3];
        s += line(W, [2, 0], P2, 'dm ds') + line(W, P3, P2, 'dm ds');
        s += push(W, P1, [-1, 1], 18) + T(...W(...P1).map((v, i) => v + (i ? 4 : 16)), 'P₁', { a: 'start', c: 'rl' });
        s += push(W, P2, [1, 0], 18) + T(...W(...P2).map((v, i) => v + (i ? -8 : -24)), 'P₂', { a: 'end', c: 'rl' });
        const [x3, y3] = W(...P3), n3 = 240;
        const e1 = [Math.cos(rad(n3 - 30)), -Math.sin(rad(n3 - 30))], e2 = [Math.cos(rad(n3 + 30)), -Math.sin(rad(n3 + 30))];
        s += P(`M${f1(x3)},${f1(y3)}L${f1(x3 + 40 * e1[0])},${f1(y3 + 40 * e1[1])}L${f1(x3 + 40 * e2[0])},${f1(y3 + 40 * e2[1])}Z`, 'fl2') + C(x3, y3, 3.2, 'dotf') + T(x3 + 8, y3 - 6, 'P₃ (μ = 1/√3)', { a: 'start', c: 'rl' });
        s += C(...W(...P2), 4.5, 'doto');
        s += T(430, 250, '(c) 우산: 세 작용선이 P₂에서 만남', { c: 'em', s: 11.5 });
      }
      return fig(600, 262, '(a) 마찰 없는 네 접촉으로 잡은 정팔각형, (c) 우산 모양과 세 접촉',
        s,
        '(a) 마주 보는 두 힘이 대각선에서 $l$만큼 엇갈려 짝힘을 만들므로 $l\\gt0$이면 힘 닫힘입니다. (c) $P_1$의 힘은 갈고리 중심을 지나 $P_2$를 향하고, $P_3$에서 $P_2$로 가는 방향은 $P_3$의 마찰 원뿔(반각 30°) 안에 있어 세 힘으로 내력을 만들 수 있습니다.');
    },
  });
})();
