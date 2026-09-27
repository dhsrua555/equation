/* 공학수학 본문 그림: 콘텐츠에서 ":::fig 이름"으로 부릅니다. */
(function () {
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
