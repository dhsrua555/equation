/* 분야 설정 — Équation 기초 수학: 다른 분야가 전제로 깔고 쓰는 미적분·해석학의 도구 */
(function () {
  window.SITE = {
    field: 'base',
    key: 'equation-base-v1',
    name: '기초 수학',
    title: 'Équation 기초 수학',
    parts: {
      A: { name: '한 변수 미적분', en: 'Single-Variable Calculus', desc: 'O 기호와 평균값 정리, 테일러 정리, 그리고 적분의 도구. 오차를 말하는 언어입니다.' },
      B: { name: '수열과 급수', en: 'Sequences & Series', desc: '등비급수와 수렴 판정, 거듭제곱급수의 수렴반지름, 테일러 급수와 오일러 공식.' },
      C: { name: '다변수 미적분 · 해석의 도구', en: 'Several Variables & Analysis', desc: '편미분과 연쇄법칙, 헤시안, 립시츠 조건과 부등식, 균등수렴.' },
    },
    secSource: (sec) => (sec.src ? sec.src : ''),
    about: '공학수학과 인공지능 분야가 따로 설명하지 않고 가져다 쓰는 미적분·해석학의 개념을 모은 노트입니다. 절마다 끝에 ‘이 개념을 쓰는 곳’이 있어, 다른 분야의 어느 절이 이 개념에 기대는지 바로 따라갈 수 있습니다.',
    text: {
      refLabel: '범위',
      secChip: '§',
      secFilter: '절',
      unitCaps: 'Unit',
      unitsCaps: 'The units',
      unitsWord: 'units',
      howTitle: '짧게 읽고, 바로 쓰고, 쓰이는 곳으로 건너가기',
      howLede: '한 절은 개념 하나입니다. 정의와 핵심 공식, 예제 한두 개로 끝나고, 절 끝의 ‘이 개념을 쓰는 곳’에서 공학수학·인공지능의 해당 절로 넘어갈 수 있습니다.',
      howLearn: '다른 분야의 증명과 풀이가 말없이 쓰는 도구를 정의부터 정리했습니다. 핵심 공식 상자마다 증명이 붙어 있고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다. 단답형은 <code>1/6</code>, <code>sqrt(pi)/2</code>, <code>e^2</code>, <code>ln(2)</code>처럼 식으로 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 사인 곡선에 다가가는 테일러 다항식, 리만 합, 수렴하는 부분합, 안장점의 등고선, 립시츠 원뿔을 그렸습니다.',
      examLede: '다섯 단원을 고르게 묻는 점검 시험입니다. 다른 분야를 시작하기 전에 도구가 손에 붙었는지 확인하세요.',
      proofLede: '기초 도구 {proofs}개의 증명을 모았습니다. 이름이나 영어 용어로 검색할 수 있습니다. 예: 평균값, Taylor, Cauchy-Schwarz, Jensen, Lipschitz.',
      proofPlaceholder: '찾을 정리 (예: 테일러, ratio test, 그론월)',
      inputHelp: '<p>분수 <code>1/6</code>, 원주율 <code>pi</code>, 자연상수 <code>e</code>, 제곱근 <code>sqrt(3)</code>, 로그 <code>ln(2)</code>를 쓸 수 있습니다.</p><p>예: <code>sqrt(pi)/2</code>, <code>1-e^(-1)</code>, <code>ln(3)</code></p>',
    },
  };
})();
