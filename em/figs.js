/* 공학수학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다.
   여기에는 함수 그래프 도구(window.EMG)와 공용 그림을 두고, 단원별 그림은 data/fig-XX.js가 등록합니다. */
(function () {
  const { fig, L, T, f1 } = window.FK;
  const { Gp, G, G2, stems, dot, legend } = window.FK;

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
