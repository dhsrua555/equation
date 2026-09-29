/* 01 의료 데이터와 의료 인공지능 — 본문 그림 */
(function () {
  const R = String.raw;
  const FK = window.FK, MF = window.MF;
  const T = FK.T;
  const box = (x, y, w, h, cls) => FK.R(x, y, w, h, cls) + FK.R(x, y, w, h, 'sv');

  window.SITE_FIGS = Object.assign(window.SITE_FIGS || {}, {
    // 0.1 shapes of medical data
    datashape() {
      let s = '';
      // 1-D signal
      const ecg = (t) => { const u = t - Math.floor(t); return 0.9 * Math.exp(-((u - 0.4) ** 2) / 0.0004) - 0.2 * Math.exp(-((u - 0.44) ** 2) / 0.0004) + 0.25 * Math.exp(-((u - 0.68) ** 2) / 0.004) + 0.1 * Math.exp(-((u - 0.18) ** 2) / 0.002); };
      let d = ''; for (let k = 0; k <= 200; k++) { const t = k / 200 * 2.4; d += `${k ? 'L' : 'M'}${FK.f1(20 + k * 0.62)},${FK.f1(90 - 42 * ecg(t))}`; }
      s += FK.P(d, 'ld') + FK.L(20, 100, 144, 100, 'ax') + T(82, 124, '1D 신호', { c: 'em' }) + T(82, 142, 'ECG·EEG·EMG (시간)', { s: 11 });
      // 2-D image
      const img = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) => Math.max(0, 1 - ((i - 4.5) ** 2 + (j - 4.5) ** 2) / 24) * (0.6 + 0.4 * ((i + j) % 3 === 0))));
      s += MF.pix(170, 40, 6.4, img, { max: 1, gray: true }) + T(202, 124, '2D 영상', { c: 'em' }) + T(202, 142, 'X선, 단면 영상', { s: 11 });
      // 3-D volume
      for (let k = 3; k >= 0; k--) s += box(262 + 7 * k, 50 - 7 * k, 50, 50, k === 0 ? 'rg hl' : 'rg');
      s += T(304, 124, '3D 볼륨', { c: 'em' }) + T(304, 142, 'CT·MRI (복셀)', { s: 11 });
      // 4-D
      [0, 1, 2].forEach((k) => { for (let q = 2; q >= 0; q--) s += box(360 + k * 34 + 4 * q, 58 - 4 * q, 26, 26, q === 0 ? 'rg hl' : 'rg'); });
      s += FK.A(360, 104, 460, 104, 'ax', 6) + T(410, 124, '4D = 3D + 시간', { c: 'em' }) + T(410, 142, '심장 CT, 동적 PET', { s: 11 });
      // table
      const rows = [['환자', '진단', '투약'], ['A', 'I10', '…'], ['B', 'E11', '…']];
      rows.forEach((r, i) => r.forEach((v, j) => { s += FK.R(478 + j * 26, 40 + i * 20, 26, 20, i === 0 ? 'rg hl' : 'rg') + FK.R(478 + j * 26, 40 + i * 20, 26, 20, 'sv') + T(491 + j * 26, 54 + i * 20, v, { s: 10 }); }));
      s += T(517, 124, '표·텍스트', { c: 'em' }) + T(517, 142, 'EMR·PHR', { s: 11 });
      return FK.fig(560, 156, '의료 데이터의 모양', s,
        R`신호는 시간 축 하나, 영상은 공간 격자, CT·MRI는 3차원 격자(복셀), 여기에 시간이 더해지면 4차원입니다. 기록은 표와 텍스트입니다. 자료의 모양이 쓸 모델을 정합니다: 격자 자료에는 합성곱 신경망(13단원)이 알맞습니다.`);
    },
    // 0.2 PACS: acquire, store, view
    pacs() {
      let s = '';
      ['CT', 'MRI', '초음파'].forEach((m, i) => { s += box(20, 26 + i * 52, 86, 38, 'rg') + T(63, 50 + i * 52, m, { c: 'em' }); s += FK.A(110, 45 + i * 52, 214, 98, 'ld', 7); });
      s += box(220, 70, 110, 60, 'rg hl') + T(275, 96, 'PACS 서버', { c: 'em' }) + T(275, 114, '저장(DICOM)', { s: 11 });
      ['판독실', '병동·외래', '원격판독(집)'].forEach((m, i) => { s += FK.A(334, 100, 426, 45 + i * 52, 'ld', 7); s += box(430, 26 + i * 52, 110, 38, 'rg') + T(485, 50 + i * 52, m, { c: 'em' }); });
      s += T(63, 182, '획득', { c: 'rl' }) + T(275, 182, '저장', { c: 'rl' }) + T(485, 182, '조회', { c: 'rl' });
      return FK.fig(560, 194, 'PACS', s,
        R`영상 장비에서 **획득**한 영상을 서버에 **저장**하고, 병원 어디서나(네트워크가 닿으면 집에서도) **조회**합니다. 필름이 사라지고 영상이 디지털 자료로 쌓이면서 의료 빅데이터와 AI 학습의 재료가 되었습니다.`);
    },
    // 0.3 market size: 2023 → 2030 at CAGR 41.8 %
    market() {
      const yrs = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
      const v = (y) => 15.8 * Math.pow(1.418, y - 2023);
      return FK.G({ w: 560, h: 230, x: [2017.3, 2030.7], y: [0, 200], label: '의료 AI 시장 전망', m: [16, 14, 22, 40],
        xt: yrs.filter((y) => y % 2 === 0).map((y) => [y, `’${String(y).slice(2)}`]), yt: [[50, '50'], [100, '100'], [150, '150'], [200, '200']],
        extra: (X, Y) => yrs.map((y) => FK.R(X(y) - 13, Y(v(y)), 26, Y(0) - Y(v(y)), y === 2023 || y === 2030 ? 'rxh' : 'bm')).join('')
          + T(X(2023), Y(v(2023)) - 6, '158억', { s: 11, c: 'rl' }) + T(X(2030), Y(v(2030)) - 6, '1,817억 달러', { s: 11, c: 'rl', a: 'end' })
          + T(X(2019.5), Y(170), '연평균 성장률 41.8%', { c: 'em' }) + T(X(2019.5), Y(150), '(달러, Markets & Markets)', { s: 11 }),
        cap: R`막대는 연평균 성장률 41.8%로 계산한 값입니다(슬라이드의 연도별 막대와 거의 같음). 2023년 약 158억 달러에서 해마다 약 1.42배씩 커져 2030년 약 1,817억 달러로 전망됩니다($15.8\times1.418^7\approx182$). 산업별로는 의료·헬스케어가 금융 다음으로 큰 AI 시장입니다.` });
    },
    // 0.3 AI market by industry, 2023 vs 2030 forecast (slide 20; values read off the slide's bar chart, 십억 달러)
    marketfield() {
      const f = [['금융', 27, 188], ['의료/헬스케어', 16, 182], ['유통', 21, 162], ['제조', 17, 140], ['자동차/교통', 8, 125], ['정부·국방', 8, 122], ['통신', 13, 106], ['IT', 6, 80], ['에너지/유틸리티', 4, 80], ['미디어/엔터', 3, 75], ['기타', 3, 59], ['농업', 2, 39]];
      let s = '';
      const X = (v) => 130 + v * 1.9, y0 = 16;
      f.forEach(([n, a, b], i) => {
        const y = y0 + i * 17, hl = n === '의료/헬스케어';
        s += T(122, y + 11, n, { a: 'end', s: 10.5, c: hl ? 'em' : undefined });
        s += FK.R(130, y + 1, X(b) - 130, 8, hl ? 'rxh' : 'bm') + FK.R(130, y + 9, X(a) - 130, 5, 'vlh');
        s += T(X(b) + 5, y + 10, String(b), { a: 'start', s: 10 });
      });
      s += FK.L(130, y0, 130, y0 + 12 * 17, 'ax');
      s += FK.R(470, 150, 20, 8, 'bm') + T(496, 158, "’30 전망", { a: 'start', s: 11 }) + FK.R(470, 168, 20, 5, 'vlh') + T(496, 174, "’23", { a: 'start', s: 11 });
      return FK.fig(560, 230, '산업별 AI 시장 전망', s,
        R`단위는 십억 달러이고, 슬라이드의 막대그래프(Markets & Markets, 하나증권)를 눈금으로 읽은 근삿값입니다. 긴 막대가 2030년 전망, 짧은 막대가 2023년이며 의료/헬스케어(칠한 막대)는 금융 다음으로 커서 2023년 약 16에서 2030년 약 182(1,817억 달러)로 커질 것으로 봅니다.`);
    },
    // 0.4 low-count PET: noise falls as 1/sqrt(counts)
    petnoise() {
      const r = MF.rng(3);
      const prof = (x) => 20 + 60 * Math.exp(-((x - 0.3) ** 2) / 0.004) + 35 * Math.exp(-((x - 0.65) ** 2) / 0.01);
      const pois = (lam) => { // normal approximation to a Poisson draw
        return Math.max(0, lam + Math.sqrt(lam) * MF.normal(r));
      };
      const xs = Array.from({ length: 80 }, (_, k) => k / 79);
      const full = xs.map((x) => [x, pois(prof(x) * 10) / 10]);
      const low = xs.map((x) => [x, pois(prof(x))]);
      return FK.G2(560, 210, '촬영 시간과 잡음', [
        { w: 280, h: 210, x: [0, 1], y: [0, 110], title: '전체 촬영(계수 100%)', m: [22, 10, 20, 30], xt: [], yt: [[50, '50'], [100, '100']], c: [{ f: prof, c: 'dm ds' }, { pts: full, c: 'ld' }] },
        { w: 280, h: 210, ox: 280, x: [0, 1], y: [0, 110], title: '10% 촬영', m: [22, 10, 20, 30], xt: [], yt: [[50, '50'], [100, '100']], c: [{ f: prof, c: 'dm ds' }, { pts: low, c: 'rx' }] },
      ], R`점선은 참 방사능 분포의 한 단면입니다. PET의 검출 계수는 포아송 분포라 표준편차가 $\sqrt{\text{계수}}$이고, 상대 잡음은 $1/\sqrt{\text{계수}}$입니다. 계수를 10%로 줄이면 상대 잡음이 $\sqrt{10}\approx3.2$배가 됩니다. 딥러닝 잡음 제거는 이 영상을 전체 촬영 수준으로 복원해 **촬영 시간이나 방사선량**을 줄입니다.`);
    },
    // 0.5 EU AI act risk tiers
    euai() {
      const tiers = [['수용 불가 위험 → 금지', '실시간 원격 생체인식(법 집행), 인간 행동 조작, 무작위 얼굴 수집 DB', 'rxh'], ['고위험 → 사람의 감독 의무', '의료·교육 등 공공서비스, 선거, 핵심 인프라, 자율주행', 'fl2'], ['그 밖의 위험', '투명성 의무 등 상대적으로 가벼운 규제', 'fl']];
      let s = '';
      tiers.forEach(([t, d, c], i) => {
        const w = 180 + i * 120, x = 280 - w / 2, y = 20 + i * 56;
        s += FK.P(`M${x + 20},${y}h${w - 40}l20,48h${-w}z`, c) + FK.P(`M${x + 20},${y}h${w - 40}l20,48h${-w}z`, 'sv');
        s += T(280, y + 20, t, { c: 'em' }) + T(280, y + 38, d, { s: 10.5 });
      });
      return FK.fig(560, 200, 'EU 인공지능법의 위험 등급', s,
        R`세계 첫 AI법(2024년 5월 승인)은 위험이 클수록 강하게 규제합니다. 의료는 **고위험**에 속해 사람의 감독이 의무입니다.`);
    },
  });
})();
