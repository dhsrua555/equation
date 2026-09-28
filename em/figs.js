/* 공학수학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다.
   여기에는 함수 그래프 도구(window.EMG)와 공용 그림을 두고, 단원별 그림은 data/fig-XX.js가 등록합니다. */
(function () {
  const { fig, L, T, f1 } = window.FK;
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
  // legend rows at a pixel position: [[line class, text], ...]
  const legend = (px, py, items) => items.map(([c, t], i) => L(px, py + i * 16 - 4, px + 20, py + i * 16 - 4, c) + T(px + 26, py + i * 16, t, { a: 'start' })).join('');

  // ---- special functions for plotting ----
  let siTab = null;
  function Si(u) {
    const h = 0.01, n = 16000;
    if (!siTab) {
      siTab = new Float64Array(n + 1);
      const g = (w) => (w === 0 ? 1 : Math.sin(w) / w);
      let acc = 0;
      for (let k = 1; k <= n; k++) { const a = (k - 1) * h; acc += (h / 6) * (g(a) + 4 * g(a + h / 2) + g(a + h)); siTab[k] = acc; }
    }
    const s = Math.sign(u), v = Math.abs(u);
    if (v >= n * h) return s * (Math.PI / 2 - Math.cos(v) / v - Math.sin(v) / (v * v));
    const k = Math.floor(v / h), r = v / h - k;
    return s * (siTab[k] + r * (siTab[k + 1] - siTab[k]));
  }
  // Bessel J_n(x) = (1/π)∫_0^π cos(nτ − x sin τ) dτ (Simpson)
  function J(n, x) {
    const m = 96, h = Math.PI / m;
    let s = 0;
    for (let k = 0; k <= m; k++) { const t = k * h, w = k === 0 || k === m ? 1 : k % 2 ? 4 : 2; s += w * Math.cos(n * t - x * Math.sin(t)); }
    return (s * h) / 3 / Math.PI;
  }
  // Legendre P_n(x) by the three-term recurrence
  function P(n, x) {
    let p0 = 1, p1 = x;
    if (n === 0) return 1;
    for (let k = 1; k < n; k++) { const p2 = ((2 * k + 1) * x * p1 - k * p0) / (k + 1); p0 = p1; p1 = p2; }
    return p1;
  }
  // Simpson integral of f on [a,b]
  function simpson(f, a, b, m = 400) {
    const h = (b - a) / m;
    let s = f(a) + f(b);
    for (let k = 1; k < m; k++) s += (k % 2 ? 4 : 2) * f(a + k * h);
    return (s * h) / 3;
  }
  const PI = Math.PI;
  const piT = (v, d = 1) => { // tick labels in multiples of π/d
    const q = Math.round((v * d) / PI);
    if (q === 0) return '0';
    const num = q / d;
    if (Number.isInteger(num)) return (num === 1 ? '' : num === -1 ? '−' : String(num).replace('-', '−')) + 'π';
    return (q < 0 ? '−' : '') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + 'π/' + d;
  };
  window.EMG = { G, G2, Gp, stems, dot, legend, Si, J, P, simpson, piT, PI };

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    pq() {
      const X = (p) => 280 + 60 * p;
      const Y = (q) => 200 - 40 * q;
      let d = '';
      for (let p = -4; p <= 4.001; p += 0.25) d += `${d ? 'L' : 'M'}${X(p).toFixed(1)},${Y((p * p) / 4).toFixed(1)}`;
      return `<figure class="fig"><svg viewBox="0 0 560 290" role="img" aria-label="trace-determinant 평면에서 임계점의 분류">
        <rect class="rg" x="40" y="${Y(0)}" width="490" height="${Y(-1.6) - Y(0)}"/>
        <line class="ax" x1="40" y1="${Y(0)}" x2="530" y2="${Y(0)}"/><line class="ax" x1="${X(0)}" y1="14" x2="${X(0)}" y2="270"/>
        <path class="cv" d="${d}"/>
        <line class="cv2" x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="22"/>
        <text x="524" y="${Y(0) - 8}" text-anchor="end">p = tr A</text>
        <text x="${X(0) + 8}" y="24">q = det A</text>
        <text class="em" x="${X(-1.3)}" y="${Y(2.7)}" text-anchor="middle">안정 나선점</text>
        <text class="em" x="${X(1.3)}" y="${Y(2.7)}" text-anchor="middle">불안정 나선점</text>
        <text class="em" x="${X(-3.1)}" y="${Y(0.9)}" text-anchor="middle">안정 마디점</text>
        <text class="em" x="${X(3.1)}" y="${Y(0.9)}" text-anchor="middle">불안정 마디점</text>
        <text class="em" x="${X(0) + 8}" y="${Y(3.6)}">중심 (p = 0)</text>
        <text class="em" x="${X(0)}" y="${Y(-0.9)}" text-anchor="middle">안장점 (q &lt; 0)</text>
        <text x="${X(3.3)}" y="${Y(3.3)}" text-anchor="end">Δ = p² − 4q = 0</text>
      </svg><figcaption>고유값의 합 $p$와 곱 $q$만으로 원점의 종류가 결정됩니다. 포물선 위쪽은 복소 고유값(나선), 아래쪽은 실수 고유값(마디)입니다.</figcaption></figure>`;
    },
  });
})();
