/* 분야 설정 — Équation 고체역학 (2026-1, 오정훈 교수) · 교재 Beer, Johnston, DeWolf & Mazurek, Mechanics of Materials 7판 · 역학 묶음 */
(function () {
  window.SITE = {
    field: 'solid',
    key: 'equation-solid-v1',
    name: '고체역학',
    title: 'Équation 고체역학',
    parts: {
      A: { name: '힘, 응력, 변형', en: 'Stress, Strain & Axial Loading', desc: '정역학 복습, 응력과 변형률의 정의, 재료의 응력-변형률 거동, 축하중 부재와 부정정·열응력. 교재 1–2장.' },
      B: { name: '비틀림과 굽힘', en: 'Torsion & Bending', desc: '원형 축의 비틀림, 전단력·굽힘 모멘트 선도, 굽힘 응력, 보의 전단 응력과 전단 흐름, 처짐과 중첩. 교재 3–6장, 9장.' },
      C: { name: '응력 상태, 파손, 좌굴', en: 'Stress States, Failure & Stability', desc: '응력·변형률 변환과 모어 원, 조합 하중과 압력 용기, 일반화된 훅 법칙과 파손 이론, 기둥의 좌굴. 교재 7–8장, 10장.' },
    },
    secSource: (sec) => [sec.p ? `B&J p.${sec.p}` : '', sec.src || ''].filter(Boolean).join(' · '),
    about: '오정훈 교수님의 「고체역학」(2026년 1학기) 강의 슬라이드(Lecture 0–12)를 따라 정리한 시험 대비 노트입니다. 교재는 Beer, Johnston, DeWolf & Mazurek, <em>Mechanics of Materials</em> 7판이고, 절 번호와 쪽수는 교재를 따릅니다. 슬라이드의 흐름을 따른 절에는 ‘강의 슬라이드’ 표시를 붙였습니다. 설명·예제·문제는 새로 썼고, 과제 문제는 싣지 않았습니다.',
    text: {
      refLabel: '교재',
      secChip: 'B&J ',
      secFilter: 'B&J 절',
      handChip: '강의 슬라이드',
      howTitle: '자유물체도에서 시작해 응력, 변형률, 변위로',
      howLede: '고체역학의 문제는 늘 같은 네 단계입니다. 힘(자유물체도와 평형) → 응력(단면 위의 힘의 세기) → 변형률(재료 법칙) → 변위(적합 조건). 단원마다 이 사슬의 어느 고리를 다루는지 먼저 확인하세요.',
      howLearn: '교재 절 순서대로 정의·공식·예제를 정리했습니다. 공식 상자마다 유도가 연결되어 있고, 유도 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형 유도 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 단위 없이 문제에 적힌 단위로 <code>12.5</code>, <code>3*pi/4</code>, <code>40/(pi*0.02^2)</code>처럼 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 응력-변형률 곡선, 비틀림 응력 분포, 전단력·굽힘 모멘트 선도, 처짐 곡선, 모어 원, 파손 곡면, 좌굴 모드를 그렸습니다.',
      examLede: '중간고사(Lecture 0–7, 교재 1–5장·굽힘 응력)와 기말고사(Lecture 7–12) 범위의 시간 제한 시험입니다. 서술형은 채점 기준을 보고 직접 채점합니다.',
      proofLede: '단원에 나오는 공식 {proofs}개의 유도를 모았습니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: 비틀림 공식, 굽힘 공식, VQ/It, 모어 원, 오일러 좌굴, 폰 미제스, E와 G의 관계.',
      proofPlaceholder: '찾을 공식 (예: 굽힘 공식, 전단 흐름, 모어 원)',
      inputHelp: '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 제곱근 <code>sqrt(3)</code>, 거듭제곱 <code>2^5</code>, 지수 표기 <code>2e-3</code>를 쓸 수 있습니다. 단위는 문제에 적힌 대로 맞춰 숫자만 넣습니다.</p><p>예: <code>40e3/(pi*0.01^2)/1e6</code>, <code>sqrt(50^2+30^2)</code></p>',
    },
  };
})();
