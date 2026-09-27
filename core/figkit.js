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
  // label text; "R_A" or "σ_{max}" puts the part after _ in a subscript
  function T(x, y, s, o = {}) {
    const cls = o.c ? ` class="${o.c}"` : '';
    const sz = o.s ? ` font-size="${o.s}"` : '';
    const str = String(s), re = /_(\{([^}]*)\}|[^\s_{]+)/g;
    let body = '', last = 0, down = false, m;
    const plain = (t) => { if (t) { body += down ? `<tspan dy="-3">${esc(t)}</tspan>` : esc(t); down = false; } };
    while ((m = re.exec(str))) {
      plain(str.slice(last, m.index));
      body += `<tspan dy="${down ? 0 : 3}" font-size="0.78em">${esc(m[2] != null ? m[2] : m[1])}</tspan>`;
      down = true; last = re.lastIndex;
    }
    plain(str.slice(last));
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
  window.FK = { fig, L, A, A2, T, R, C, P, ground, wall, pin, roller, dist, dim, dimv, mom, fn, area, f1 };
})();
