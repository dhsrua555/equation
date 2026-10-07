/* 역학 그림 도구: 보, 지점, 하중 화살표, 치수선, 모멘트 화살표를 SVG 문자열로 만듭니다.
   분야의 figs.js가 window.SITE_FIGS에 그림을 등록할 때 씁니다. 색은 core/style.css의 .fig 클래스가 정합니다. */
(function () {
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const HEAD = { ld: 'ldh', rx: 'rxh', dm: 'dmh', ax: 'axh', gd: 'axh', vl: 'vlh', th: 'axh' };

  function fig(w, h, label, body, cap) {
    return `<figure class="fig"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${body}</svg>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  }
  const L = (x1, y1, x2, y2, c = 'gd') => `<line class="${c}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
  function head(x1, y1, x2, y2, c, h) {
    const a = Math.atan2(y2 - y1, x2 - x1), w = h * 0.42;
    const bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
    return `<path class="${HEAD[c] || 'ldh'}" d="M${f1(x2)},${f1(y2)}L${f1(bx - w * Math.sin(a))},${f1(by + w * Math.cos(a))}L${f1(bx + w * Math.sin(a))},${f1(by - w * Math.cos(a))}Z"/>`;
  }
  // arrow from (x1,y1) to (x2,y2), head at the end
  function A(x1, y1, x2, y2, c = 'ld', h = 9) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    return L(x1, y1, x2 - (h * 0.6) * Math.cos(a), y2 - (h * 0.6) * Math.sin(a), c) + head(x1, y1, x2, y2, c, h);
  }
  const A2 = (x1, y1, x2, y2, c = 'dm', h = 7) => A((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, c, h) + A((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, c, h);
  // label text; "R_A" or "σ_{max}" puts the part after _ in a subscript (a bare subscript stops at a space or at | , ; : = ) ]).
  // Combining hats and dots (x̂, θ̇, ω̂) are drawn as separate accents centred over the letter: the label fonts
  // have no Greek, so a combining mark would otherwise land in a fallback font beside the letter.
  // g: glyph, w: advance (em; pinned with textLength when `fit`, since fonts disagree), up: raise above the baseline (em)
  const uc = String.fromCharCode;
  const ACC = {
    [uc(0x302)]: { g: uc(0x2c6), w: 0.34, fit: true, up: 0 }, // hat → spacing circumflex
    [uc(0x307)]: { g: '.', w: 0.27, fit: false, up: 0.6 }, // dot → a raised full stop (the spacing dot is a hairline in some fonts)
    [uc(0x308)]: { g: uc(0xa8), w: 0.34, fit: true, up: 0 }, // diaeresis
  };
  const wid = (ch) => /[ilj.,:;'|!]/.test(ch) ? 0.3 : /[mwMWωΩ]/.test(ch) ? 0.74 : /[A-Z]/.test(ch) ? 0.64 : /[ftr]/.test(ch) ? 0.38 : 0.54;
  function T(x, y, s, o = {}) {
    const cls = o.c ? ` class="${o.c}"` : '';
    const sz = o.s ? ` font-size="${o.s}"` : '';
    const fs = o.s || (/\bit\b/.test(o.c || '') ? 13 : 12);
    const str = String(s), re = /_(\{([^}]*)\}|[^\s_{|,;:=)\]]+)/g;
    let body = '', cur = 0, pdx = 0, last = 0, m;
    // emit text whose baseline sits `off` px below the label's baseline, at relative size k
    const out = (t, off, k, tl) => {
      if (!t) return;
      const a = (tl ? ` textLength="${f1(tl)}" lengthAdjust="spacingAndGlyphs"` : '') + (off !== cur ? ` dy="${f1(off - cur)}"` : '') + (pdx ? ` dx="${f1(pdx)}"` : '') + (k !== 1 ? ` font-size="${k}em"` : '');
      body += a ? `<tspan${a}>${esc(t)}</tspan>` : esc(t);
      cur = off; pdx = 0;
    };
    const run = (t, off, k) => {
      const em = fs * k;
      let buf = '';
      // precomposed letters (ŷ, ẑ, ṡ) are split too, since the italic font lacks most of them
      const chars = [...t].flatMap((c) => { const d = c.normalize('NFD'); return d.length === 2 && ACC[d[1]] && c.codePointAt(0) < 0x2000 ? [...d] : [c]; });
      for (const ch of chars) {
        if (!ACC[ch]) { buf += ch; continue; }
        const b = [...buf].pop() || ' ';
        out(buf, off, k); buf = '';
        const ac = ACC[ch], wb = wid(b) * em, wa = ac.w * em, up = (ac.up + (/[A-Zbdfhkltβδζθλξφψ]/.test(b) ? 0.2 : 0)) * em;
        pdx = -(wb + wa) / 2; out(ac.g, off - up, k, ac.fit ? wa : 0); pdx = (wb - wa) / 2;
      }
      out(buf, off, k);
    };
    while ((m = re.exec(str))) {
      run(str.slice(last, m.index), 0, 1);
      run(m[2] != null ? m[2] : m[1], 3, 0.78);
      last = re.lastIndex;
    }
    run(str.slice(last), 0, 1);
    return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.a || 'middle'}"${cls}${sz}>${body}</text>`;
  }
  const R = (x, y, w, h, c = 'bm') => `<rect class="${c}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"/>`;
  const C = (cx, cy, r, c = 'sp') => `<circle class="${c}" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}"/>`;
  const P = (d, c = 'gd') => `<path class="${c}" d="${d}"/>`;
  // hatched ground under y from x1 to x2
  function ground(x1, x2, y, down = true) {
    let s = L(x1, y, x2, y, 'gd');
    for (let x = x1 + 4; x <= x2; x += 8) s += down ? L(x, y, x - 6, y + 7, 'ht') : L(x, y, x + 6, y - 7, 'ht');
    return s;
  }
  // fixed wall: vertical line at x from y1 to y2, hatch on the side away from the member
  function wall(x, y1, y2, side = 'left') {
    let s = L(x, y1, x, y2, 'gd');
    const d = side === 'left' ? -7 : 7;
    for (let y = y1 + 4; y <= y2; y += 8) s += L(x, y, x + d, y + 6, 'ht');
    return s;
  }
  // pin support whose apex touches (x,y)
  function pin(x, y, s = 1) {
    const h = 16 * s, w = 11 * s;
    return P(`M${f1(x)},${f1(y)}L${f1(x - w)},${f1(y + h)}L${f1(x + w)},${f1(y + h)}Z`, 'sp') + C(x, y, 2.6 * s, 'jt') + ground(x - w - 5, x + w + 5, y + h);
  }
  // roller support whose top touches (x,y)
  function roller(x, y, s = 1) {
    const h = 12 * s, w = 10 * s, r = 3.4 * s;
    return P(`M${f1(x)},${f1(y)}L${f1(x - w)},${f1(y + h)}L${f1(x + w)},${f1(y + h)}Z`, 'sp') + C(x - w / 2, y + h + r, r, 'sp') + C(x + w / 2, y + h + r, r, 'sp') + ground(x - w - 5, x + w + 5, y + h + 2 * r);
  }
  // uniformly (h1 = h2) or linearly varying distributed load acting down on a beam top at y
  function dist(x1, x2, y, h1, h2 = h1, n = 0, c = 'ld') {
    const k = n || Math.max(3, Math.round((x2 - x1) / 22));
    let s = '';
    for (let i = 0; i <= k; i++) {
      const x = x1 + ((x2 - x1) * i) / k, h = h1 + ((h2 - h1) * i) / k;
      if (h > 5) s += A(x, y - h, x, y, c, 7);
    }
    return s + L(x1, y - h1, x2, y - h2, c);
  }
  // horizontal dimension line with end ticks, label above (or below with o.below)
  function dim(x1, x2, y, label, o = {}) {
    return L(x1, y - 5, x1, y + 5, 'dm') + L(x2, y - 5, x2, y + 5, 'dm') + A2(x1, y, x2, y, 'dm', 6) + (label ? T((x1 + x2) / 2, o.below ? y + 15 : y - 5, label, { c: o.c, s: o.s }) : '');
  }
  function dimv(x, y1, y2, label, o = {}) {
    return L(x - 5, y1, x + 5, y1, 'dm') + L(x - 5, y2, x + 5, y2, 'dm') + A2(x, y1, x, y2, 'dm', 6) + (label ? T(o.left ? x - 7 : x + 7, (y1 + y2) / 2 + 4, label, { a: o.left ? 'end' : 'start', c: o.c, s: o.s }) : '');
  }
  // circular arrow for a couple: centre, radius, start/end angles in degrees (math sense, y up), head at the end
  function mom(cx, cy, r, a0, a1, c = 'ld') {
    const pt = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1), [xb, yb] = pt(a1 - Math.sign(a1 - a0) * 12);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
    return `<path class="${c}" d="M${f1(x0)},${f1(y0)}A${f1(r)},${f1(r)} 0 ${large} ${sweep} ${f1(xb)},${f1(yb)}"/>` + head(xb, yb, x1, y1, c, 8);
  }
  // polyline of y = f(x) in plot coordinates: X = x0 + sx·x, Y = y0 − sy·f(x)
  function fn(x0, y0, sx, sy, f, a, b, n = 80) {
    let d = '';
    for (let k = 0; k <= n; k++) {
      const x = a + ((b - a) * k) / n, y = f(x);
      if (!isFinite(y)) continue;
      d += `${d ? 'L' : 'M'}${f1(x0 + sx * x)},${f1(y0 - sy * y)}`;
    }
    return d;
  }
  // filled area between y = f(x) and the axis, same mapping as fn
  function area(x0, y0, sx, sy, f, a, b, n = 80) {
    return `M${f1(x0 + sx * a)},${f1(y0)}` + fn(x0, y0, sx, sy, f, a, b, n).replace(/^M/, 'L') + `L${f1(x0 + sx * b)},${f1(y0)}Z`;
  }
  // ---- function graphs (moved from em/figs.js so every field can plot): G one panel, G2 several ----
  let UID = 0;
  // one graph panel. o: x:[a,b], y:[c,d], w,h (panel size), ox,oy (offset), m:[top,right,bottom,left],
  // xt/yt: [[value,label]], xl/yl: axis names, hg/vg: dashed guide values, c: curves [{f|pts, a, b, n, c}],
  // t: labels [[x,y,text,{a,c,s}]], extra(X,Y): raw svg in data coordinates, title: small caption above the panel
  function Gp(o) {
    const W = o.w || 560, H = o.h || 250, ox = o.ox || 0, oy = o.oy || 0;
    const [mt, mr, mb, ml] = o.m || [14, 18, 24, 34];
    const [xa, xb] = o.x, [ya, yb] = o.y;
    const X = (x) => ox + ml + ((x - xa) / (xb - xa)) * (W - ml - mr);
    const Y = (y) => oy + mt + ((yb - y) / (yb - ya)) * (H - mt - mb);
    const id = 'emg' + (++UID);
    const ax0 = o.ax0 != null ? o.ax0 : (ya <= 0 && yb >= 0 ? 0 : ya);
    const ay0 = o.ay0 != null ? o.ay0 : (xa <= 0 && xb >= 0 ? 0 : xa);
    let s = `<defs><clipPath id="${id}"><rect x="${f1(X(xa))}" y="${f1(Y(yb) - 3)}" width="${f1(X(xb) - X(xa))}" height="${f1(Y(ya) - Y(yb) + 6)}"/></clipPath></defs>`;
    (o.hg || []).forEach((v) => { s += L(X(xa), Y(v), X(xb), Y(v), 'dm ds'); });
    (o.vg || []).forEach((v) => { s += L(X(v), Y(ya), X(v), Y(yb), 'dm ds'); });
    if (o.axes !== false) s += L(X(xa), Y(ax0), X(xb), Y(ax0), 'ax') + (o.noY ? '' : L(X(ay0), Y(ya), X(ay0), Y(yb), 'ax'));
    (o.xt || []).forEach(([v, lab]) => { s += L(X(v), Y(ax0) - 3, X(v), Y(ax0) + 3, 'ax') + (lab !== '' ? T(X(v), Y(ax0) + 15, lab) : ''); });
    (o.yt || []).forEach(([v, lab]) => { s += L(X(ay0) - 3, Y(v), X(ay0) + 3, Y(v), 'ax') + (lab !== '' ? T(X(ay0) - 6, Y(v) + 4, lab, { a: 'end' }) : ''); });
    if (o.xl) s += T(X(xb) - 2, Y(ax0) - 7, o.xl, { a: 'end' });
    if (o.yl) s += T(X(ay0) + 6, Y(yb) + 9, o.yl, { a: 'start' });
    if (o.title) s += T(ox + W / 2, oy + 11, o.title, { c: 'em' });
    let g = '';
    (o.c || []).forEach((cv) => {
      let d = '';
      if (cv.pts) {
        let pen = false;
        cv.pts.forEach((p) => {
          if (!p) { pen = false; return; }
          d += (pen ? 'L' : 'M') + f1(X(p[0])) + ',' + f1(Y(p[1])); pen = true;
        });
      } else {
        const a = cv.a != null ? cv.a : xa, b = cv.b != null ? cv.b : xb, n = cv.n || 320;
        const lim = (yb - ya) * 1.5;
        let pen = false;
        for (let k = 0; k <= n; k++) {
          const x = a + ((b - a) * k) / n, y = cv.f(x);
          if (!isFinite(y) || y > yb + lim || y < ya - lim) { pen = false; continue; }
          d += (pen ? 'L' : 'M') + f1(X(x)) + ',' + f1(Y(y)); pen = true;
        }
      }
      g += `<path class="${cv.c || 'ld'}" d="${d}"/>`;
    });
    s += `<g clip-path="url(#${id})">${g}${o.inner ? o.inner(X, Y) : ''}</g>`;
    if (o.extra) s += o.extra(X, Y);
    (o.t || []).forEach(([x, y, str, opt]) => { s += T(X(x), Y(y), str, opt || {}); });
    return s;
  }
  const G = (o) => fig(o.w || 560, o.h || 250, o.label || '', Gp(o), o.cap);
  // several panels in one figure: G2(W, H, label, [panel options...], cap)
  const G2 = (W, H, label, ps, cap) => fig(W, H, label, ps.map(Gp).join(''), cap);
  // stems (spectra, sequences) and dots drawn in data coordinates inside extra/inner
  const stems = (X, Y, pts, c = 'ld') => pts.map(([x, y]) => L(X(x), Y(0), X(x), Y(y), c) + `<circle class="dotf" cx="${f1(X(x))}" cy="${f1(Y(y))}" r="2.6"/>`).join('');
  const dot = (X, Y, x, y, open) => `<circle class="${open ? 'doto' : 'dotf'}" cx="${f1(X(x))}" cy="${f1(Y(y))}" r="3"/>`;
  // wire-frame torus seen from above at a slant (k: sine of the view elevation), tube-centre radius R, tube radius r.
  // The loop around the hole (o.l1, on top) and one loop around the tube (o.l2, front right) are drawn bold and labelled.
  function torus(cx, cy, R, r, o = {}) {
    const k = o.k || 0.42, c = Math.sqrt(1 - k * k), TAU = 2 * Math.PI;
    const pt = (ph, ps) => { const w = R + r * Math.cos(ps); return [cx + w * Math.cos(ph), cy - (w * Math.sin(ph) * k + r * Math.sin(ps) * c)]; };
    const loop = (f, cls, n = 72) => `<path class="${cls}" d="M${Array.from({ length: n + 1 }, (_, i) => f((TAU * i) / n).map(f1).join(',')).join('L')}"/>`;
    let s = '';
    for (let i = 0; i < 12; i++) s += loop((t) => pt((TAU * i) / 12, t), 'dm', 36);
    s += loop((t) => pt(t, Math.PI), 'dm') + loop((t) => pt(t, 0), 'gd');
    s += loop((t) => pt(t, Math.PI / 2), 'rx') + loop((t) => pt(-Math.PI / 3, t), 'ld', 36);
    const p1 = pt(Math.PI, Math.PI / 2), p2 = pt(-Math.PI / 3, 0);
    if (o.l1) s += T(p1[0] - 6, p1[1] - 6, o.l1, { a: 'end', c: 'rl' });
    if (o.l2) s += T(p2[0] + 8, p2[1] + 12, o.l2, { a: 'start', c: 'lb' });
    return s;
  }
  // legend rows at a pixel position: [[line class, text], ...]
  const legend = (px, py, items) => items.map(([c, t], i) => L(px, py + i * 16 - 4, px + 20, py + i * 16 - 4, c) + T(px + 26, py + i * 16, t, { a: 'start' })).join('');
  window.FK = { fig, L, A, A2, T, R, C, P, ground, wall, pin, roller, dist, dim, dimv, mom, fn, area, f1, Gp, G, G2, stems, dot, legend, torus };
})();
