/* 의료 인공지능 본문 그림의 공용 도구: 고정 난수, 선형계 풀이, 다항식 적합, 등고선, 화소 격자, 신경망 노드.
   fig-NN.js가 window.MF로 가져다 씁니다. 색은 core/style.css의 .fig 클래스가 정하므로 밝은/어두운 모드가 모두 맞습니다. */
(function () {
  const FK = window.FK;
  const f1 = FK.f1;
  // same numbers on every load (mulberry32)
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // standard normal draw (Box–Muller)
  function normal(r) { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
  // Gaussian elimination with partial pivoting
  function solve(A, b) {
    const n = b.length, M = A.map((row, i) => row.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    return x;
  }
  const inv = (A) => { const n = A.length; const cols = A.map((_, j) => solve(A, A.map((__, i) => (i === j ? 1 : 0)))); return A.map((_, i) => cols.map((c) => c[i])); };
  // least squares polynomial of order M with the L2 penalty (λ/2)||w||² (Bishop 1.4)
  function polyfit(xs, ts, M, lam = 0) {
    const phi = (x) => Array.from({ length: M + 1 }, (_, j) => x ** j);
    const P = xs.map(phi);
    const A = Array.from({ length: M + 1 }, (_, i) => Array.from({ length: M + 1 }, (_, j) => P.reduce((s, p) => s + p[i] * p[j], 0) + (i === j ? lam : 0)));
    const b = Array.from({ length: M + 1 }, (_, i) => P.reduce((s, p, n) => s + p[i] * ts[n], 0));
    const w = solve(A, b);
    return { w, f: (x) => phi(x).reduce((s, v, j) => s + v * w[j], 0) };
  }
  const SIN = (x) => Math.sin(2 * Math.PI * x);
  // the tutorial data: x evenly spaced on [0,1], t = sin(2πx) + Gaussian noise (sd 0.3)
  function sinData(N, seed = 7, sd = 0.3, even = true) {
    const r = rng(seed), xs = [], ts = [];
    for (let n = 0; n < N; n++) { const x = even ? (N === 1 ? 0.5 : n / (N - 1)) : r(); xs.push(x); ts.push(SIN(x) + sd * normal(r)); }
    return { xs, ts };
  }
  const rms = (f, xs, ts) => Math.sqrt(xs.reduce((s, x, n) => s + (f(x) - ts[n]) ** 2, 0) / xs.length);
  // contour lines of f on a grid (marching squares); returns svg paths in data coordinates for G's inner(X, Y)
  function contour(f, xr, yr, levels, n = 70, cls = 'dm') {
    return (X, Y) => {
      const [x0, x1] = xr, [y0, y1] = yr, nx = n, ny = n;
      const gx = (i) => x0 + ((x1 - x0) * i) / nx, gy = (j) => y0 + ((y1 - y0) * j) / ny;
      const V = [];
      for (let i = 0; i <= nx; i++) { V.push([]); for (let j = 0; j <= ny; j++) V[i].push(f(gx(i), gy(j))); }
      let s = '';
      levels.forEach((lv, li) => {
        let d = '';
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const c = [[gx(i), gy(j), V[i][j]], [gx(i + 1), gy(j), V[i + 1][j]], [gx(i + 1), gy(j + 1), V[i + 1][j + 1]], [gx(i), gy(j + 1), V[i][j + 1]]];
          const pts = [];
          for (let e = 0; e < 4; e++) {
            const a = c[e], b = c[(e + 1) % 4];
            if ((a[2] - lv) * (b[2] - lv) < 0) { const t = (lv - a[2]) / (b[2] - a[2]); pts.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); }
          }
          for (let k = 0; k + 1 < pts.length; k += 2) d += `M${f1(X(pts[k][0]))},${f1(Y(pts[k][1]))}L${f1(X(pts[k + 1][0]))},${f1(Y(pts[k + 1][1]))}`;
        }
        s += `<path class="${typeof cls === 'function' ? cls(li) : cls}" d="${d}"/>`;
      });
      return s;
    };
  }
  // pixel grid: g[row][col]; value v ≥ 0 drawn in the ink colour, v < 0 in the second colour, opacity |v| (scale by o.max)
  function pix(x0, y0, cell, g, o = {}) {
    const mx = o.max || Math.max(1e-9, ...g.flat().map(Math.abs));
    let s = '';
    g.forEach((row, i) => row.forEach((v, j) => {
      const a = Math.min(1, Math.abs(v) / mx);
      const cls = v >= 0 ? (o.pos || 'vlh') : (o.neg || 'rxh');
      const g = Math.round(255 * Math.min(1, Math.max(0, v / mx)));
      // o.gray: a photograph, drawn in fixed grey levels so bright stays bright in both themes
      const st = o.gray ? `fill:rgb(${g},${g},${g})` : `fill-opacity:${(o.floor || 0) + (1 - (o.floor || 0)) * a}`;
      s += `<rect class="${o.gray ? '' : cls}" x="${f1(x0 + j * cell)}" y="${f1(y0 + i * cell)}" width="${f1(cell - (o.gap || 0) + (o.gray ? 0.5 : 0))}" height="${f1(cell - (o.gap || 0) + (o.gray ? 0.5 : 0))}" style="${st}"/>`;
    }));
    if (o.frame !== false) s += `<rect class="dm" x="${f1(x0)}" y="${f1(y0)}" width="${f1(cell * g[0].length)}" height="${f1(cell * g.length)}"/>`;
    return s;
  }
  // numbers in a grid of boxes (small worked examples: convolution, pooling, unpooling)
  function numgrid(x0, y0, cell, g, o = {}) {
    let s = '';
    g.forEach((row, i) => row.forEach((v, j) => {
      const hl = o.hl && o.hl(i, j);
      s += `<rect class="${hl ? 'rg hl' : 'rg'}" x="${f1(x0 + j * cell)}" y="${f1(y0 + i * cell)}" width="${f1(cell - 2)}" height="${f1(cell - 2)}"/>`;
      s += FK.T(x0 + j * cell + (cell - 2) / 2, y0 + i * cell + (cell - 2) / 2 + 4, v, { c: hl ? 'em' : undefined, s: o.s });
    }));
    return s;
  }
  // network node with a label
  const nd = (x, y, label, r = 16, cls = 'nd') => FK.C(x, y, r, cls) + (label ? FK.T(x, y + 4, label, { c: 'em' }) : '');
  // arrow between two nodes of radius r
  function link(x1, y1, x2, y2, r1 = 16, r2 = 16, c = 'ax', h = 6) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    return FK.A(x1 + r1 * Math.cos(a), y1 + r1 * Math.sin(a), x2 - r2 * Math.cos(a), y2 - r2 * Math.sin(a), c, h);
  }
  // box with a label (block diagrams)
  const box = (x, y, w, h, label, cls = 'bm', tc) => FK.R(x, y, w, h, cls) + FK.T(x + w / 2, y + h / 2 + 4, label, { c: tc || 'em' });
  // ellipse contours of ½(w−c)ᵀH(w−c) for H = R diag(a,b) Rᵀ (rotation th radians): exact curves at the given levels
  function ellipses(c, a, b, th, levels, cls = 'dm') {
    return (X, Y) => levels.map((lv, i) => {
      const ra = Math.sqrt((2 * lv) / a), rb = Math.sqrt((2 * lv) / b);
      let d = '';
      for (let k = 0; k <= 96; k++) {
        const t = (2 * Math.PI * k) / 96, u = ra * Math.cos(t), v = rb * Math.sin(t);
        const x = c[0] + u * Math.cos(th) - v * Math.sin(th), y = c[1] + u * Math.sin(th) + v * Math.cos(th);
        d += `${k ? 'L' : 'M'}${f1(X(x))},${f1(Y(y))}`;
      }
      return `<path class="${typeof cls === 'function' ? cls(i) : cls}" d="${d}Z"/>`;
    }).join('');
  }
  // polyline through data points [x,y] inside G's inner/extra
  const poly = (X, Y, pts, cls = 'ld') => `<path class="${cls}" d="${pts.map((p, k) => `${k ? 'L' : 'M'}${f1(X(p[0]))},${f1(Y(p[1]))}`).join('')}"/>`;
  const dots = (X, Y, pts, open) => pts.map(([x, y]) => FK.dot(X, Y, x, y, open)).join('');
  window.MF = { rng, normal, solve, inv, polyfit, SIN, sinData, rms, contour, pix, numgrid, nd, link, box, ellipses, poly, dots };
})();
