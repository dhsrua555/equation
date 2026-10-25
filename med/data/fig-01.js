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
    // 0.1 EEG through the sleep stages (slide 5, redrawn with synthetic waves: sums of sinusoids in each band)
    eegsleep() {
      const r = MF.rng(21);
      const band = (fa, fb, k) => { const c = Array.from({ length: k }, () => [fa + (fb - fa) * r(), 2 * Math.PI * r()]); return (t) => c.reduce((s, [f, p]) => s + Math.sin(2 * Math.PI * f * t + p), 0) / Math.sqrt(k); };
      const g = (t, c, w) => Math.exp(-(((t - c) / w) ** 2));
      const x0 = 112, x1 = 548, dur = 5, X = (t) => x0 + ((x1 - x0) * t) / dur;
      const aw = band(14, 24, 6), aw2 = band(8, 12, 3), s1 = band(4, 7, 4), s1b = band(14, 22, 4), s2 = band(3, 8, 4), s3 = band(0.5, 2, 4), s3b = band(4, 8, 3);
      const rows = [
        ['깨어 있음', '빠르고 낮은 파', 30, (t) => 2.2 * aw(t) + 1.4 * aw2(t)],
        ['1단계', '세타파 4–7 Hz', 88, (t) => 6 * s1(t) + 1.6 * s1b(t)],
        ['2단계', '수면방추·K복합', 158, (t) => 4 * s2(t) + 7 * g(t, 1.5, 0.3) * Math.sin(2 * Math.PI * 13 * t) + 24 * g(t, 3.3, 0.07) - 18 * g(t, 3.55, 0.13)],
        ['3단계', '서파 0.5–2 Hz', 228, (t) => 15 * s3(t) + 2.5 * s3b(t)],
      ];
      let s = '';
      rows.forEach(([n, b, y, f]) => {
        let d = '';
        for (let k = 0; k <= 1000; k++) { const t = (k / 1000) * dur; d += `${k ? 'L' : 'M'}${FK.f1(X(t))},${FK.f1(y - f(t))}`; }
        s += `<path class="ld" style="stroke-width:1.1" d="${d}"/>` + T(100, y - 2, n, { a: 'end', c: 'em' }) + T(100, y + 13, b, { a: 'end', s: 10.5 });
      });
      s += FK.P(`M${FK.f1(X(1.05))},${158 - 15}V${158 - 20}H${FK.f1(X(1.95))}V${158 - 15}`, 'rx') + T(X(1.5), 158 - 25, '수면방추 (11–15 Hz)', { c: 'rl', s: 10.5 });
      s += T(X(3.75), 158 - 20, 'K복합', { a: 'start', c: 'rl', s: 10.5 });
      s += FK.L(X(4), 268, X(5), 268, 'vl') + T(X(4.5), 282, '1초', { s: 10.5 });
      return FK.fig(560, 288, '수면 단계별 뇌파', s,
        R`슬라이드의 뇌파 그림을 합성 파형으로 다시 그렸습니다. 잠이 깊어질수록 파가 느려지고 커집니다. 1단계는 4–7 Hz의 **세타파**(theta wave), 2단계는 11–15 Hz로 잠깐 빨라지는 **수면방추**(sleep spindle)와 크게 한 번 출렁이는 **K복합**(K-complex), 3단계(**서파 수면**, slow-wave sleep)는 0.5–2 Hz의 크고 느린 **서파**가 특징입니다. 맨 위 줄은 슬라이드에 이름이 없는데, 깨어 있을 때의 빠르고 진폭이 낮은 파형입니다(강의 밖 설명). 1차원 신호에서는 이렇게 **주파수와 진폭**이 정보입니다.`);
    },
    // 0.1 MyHealthway (slide 8): collect with consent → gateway/hub → use where the person chooses
    healthway() {
      let s = '';
      const src = [['의료기관 진료정보', '진료기록·처방·검사·영상'], ['개인 건강정보', '맥박·혈당·생활습관·운동'], ['공공기관 정보', '건강보험·예방접종·환경']];
      const use = [['내 건강정보 내 의사에게', '다른 병원과 진료기록 공유'], ['내 건강 스스로 챙기기', '운동·투약 관리, 혈압·혈당 측정'], ['내 건강정보 내 손 안에', '가족 건강기록, 검사결과 해석']];
      s += T(88, 14, '수집 가능 데이터', { c: 'lb' }) + T(472, 14, '활용 서비스', { c: 'lb' });
      src.forEach(([a, b], i) => { const y = 24 + i * 56; s += FK.R(8, y, 160, 46, 'bm') + T(88, y + 19, a, { c: 'em' }) + T(88, y + 36, b, { s: 10.5 }) + FK.A(170, y + 23, 222, 104 + (i - 1) * 18, 'ax', 6); });
      s += FK.C(280, 104, 56, 'bm2') + T(280, 92, 'GATEWAY', { c: 'em' }) + T(280, 109, '네트워크 허브', { c: 'em' }) + T(280, 125, '참여 기관 인증', { s: 10.5 });
      s += T(280, 34, '본인 동의로 수집 → 본인 선택으로 활용', { c: 'rl', s: 11 });
      use.forEach(([a, b], i) => { const y = 24 + i * 56; s += FK.A(338, 104 + (i - 1) * 18, 390, y + 23, 'ax', 6) + FK.R(392, y, 160, 46, 'bm') + T(472, y + 19, a, { c: 'em' }) + T(472, y + 36, b, { s: 10.5 }); });
      s += FK.R(8, 198, 544, 30, 'rg') + T(280, 218, '요소기술: EHR 표준화 · 데이터 전송 · 개인인증 · 보안(블록체인) · 5G·웨어러블 · 클라우드 · 인공지능', { s: 11 });
      return FK.fig(560, 236, '마이 헬스웨이', s,
        R`보건복지부의 마이 헬스웨이(건강정보 고속도로) 구성안을 다시 그렸습니다. 병원, 개인 기기, 공공기관에 흩어진 건강정보를 **본인 동의**로 모아 인증 관문(게이트웨이)과 네트워크 허브로 잇고, 본인이 고른 서비스로 보냅니다. 기관마다 형식이 다른 기록을 모으려면 **EHR 표준화**가 먼저 필요하고, 인공지능은 이 구조를 받치는 요소기술 중 하나입니다.`);
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
    // 0.3 market size: slide 20's yearly bars (read off its axis, 십억 달러) and the constant-growth curve at CAGR 41.8 %
    market() {
      const yrs = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
      const read = [1.6, 2.2, 3.9, 5.3, 9.0, 15.8, 23.9, 35.0, 49.2, 68.6, 94.6, 130.9, 181.7];
      const v = (y) => 15.8 * Math.pow(1.418, y - 2023);
      return FK.G({ w: 560, h: 230, x: [2017.3, 2030.7], y: [0, 200], label: '의료 AI 시장 전망', m: [16, 14, 22, 40],
        xt: yrs.filter((y) => y % 2 === 0).map((y) => [y, `’${String(y).slice(2)}`]), yt: [[50, '50'], [100, '100'], [150, '150'], [200, '200']],
        extra: (X, Y) => yrs.map((y, i) => FK.R(X(y) - 13, Y(read[i]), 26, Y(0) - Y(read[i]), y === 2023 || y === 2030 ? 'rxh' : 'bm')).join('')
          + MF.poly(X, Y, Array.from({ length: 36 }, (_, k) => [2023 + k / 5, v(2023 + k / 5)]), 'vl ds')
          + T(X(2023), Y(read[5]) - 6, '158억', { s: 11, c: 'rl' }) + T(X(2030), Y(read[12]) - 6, '1,817억 달러', { s: 11, c: 'rl', a: 'end' })
          + T(X(2019.5), Y(170), '연평균 성장률 41.8%', { c: 'em' }) + T(X(2019.5), Y(150), '(달러, Markets & Markets)', { s: 11 }),
        cap: R`막대는 슬라이드의 연도별 막대를 눈금으로 읽은 값(단위 십억 달러, 2024년부터는 전망)이고, 점선은 2023년 15.8에서 해마다 41.8%씩(1.418배) 일정하게 자랄 때의 곡선입니다. 끝점이 $15.8\times1.418^7\approx182$로 2030년 전망 1,817억 달러와 맞고, 그 사이의 전망 막대도 곡선과 거의 겹칩니다. 산업별로는 의료·헬스케어가 금융 다음으로 큰 AI 시장입니다.` });
    },
    // 0.3 AI market by industry, 2023 vs 2030 forecast (slide 20; values read off the slide's bar chart, 십억 달러)
    marketfield() {
      const f = [['금융', 26, 187], ['의료/헬스케어', 16, 182], ['유통', 20, 161], ['제조', 16, 138], ['자동차/교통', 11, 124], ['정부·국방', 12, 120], ['통신', 13, 105], ['IT', 9, 79], ['에너지/유틸리티', 8, 79], ['미디어/엔터', 8, 74], ['기타', 7, 59], ['농업', 3, 38]];
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
    // 0.3 medical AI market by application, 2023 vs 2030 forecast (slide 21; the numbers printed on its bars, 억 달러)
    marketsub() {
      const f = [['환자 데이터·리스크 분석', 29, 305], ['정밀의학', 22, 278], ['생활습관 관리·웨어러블', 17, 233], ['신약 개발', 17, 209], ['의학 연구', 20, 202], ['의료 영상·진단', 20, 182], ['진료·병원 관리', 13, 167], ['로봇 수술·지원', 10, 149], ['기타', 10, 93]];
      let s = '';
      const X = (v) => 150 + v, y0 = 14;
      f.forEach(([n, a, b], i) => {
        const y = y0 + i * 22, hl = n === '의료 영상·진단';
        s += T(142, y + 13, n, { a: 'end', s: 10.5, c: hl ? 'em' : undefined });
        s += FK.R(150, y + 2, X(b) - 150, 10, hl ? 'rxh' : 'bm') + FK.R(150, y + 12, X(a) - 150, 6, 'vlh');
        s += T(X(b) + 6, y + 13, `${a} → ${b} (×${(b / a).toFixed(1)})`, { a: 'start', s: 10 });
      });
      s += FK.L(150, y0, 150, y0 + 9 * 22, 'ax');
      s += FK.R(330, 222, 20, 8, 'bm') + T(356, 230, "’30 전망", { a: 'start', s: 11 }) + FK.R(430, 224, 20, 5, 'vlh') + T(456, 230, "’23", { a: 'start', s: 11 });
      return FK.fig(560, 238, '분야별 의료 AI 시장 전망', s,
        R`단위는 억 달러이고 슬라이드의 막대 위 숫자 그대로입니다. 긴 막대가 2030년 전망, 짧은 막대가 2023년, 괄호는 몇 배로 커지는지입니다. 아홉 분야를 더하면 2023년 158, 2030년 1,818로 앞 그림의 전체 시장(158억 → 1,817억 달러)과 맞습니다. 칠한 막대가 이 과목이 주로 다루는 의료 영상·진단입니다.`);
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
      const tiers = [['수용 불가 위험 → 금지', '실시간 원격 생체인식(법 집행), 행동 조작·취약성 악용, 무작위 얼굴 수집 DB', 'rxh'], ['고위험 → 사람의 감독 의무', '의료·교육 등 공공서비스, 선거, 핵심 인프라, 자율주행', 'fl2'], ['그 밖의 위험', '투명성 의무 등 상대적으로 가벼운 규제', 'fl']];
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
