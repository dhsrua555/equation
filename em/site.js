/* 분야 설정 — Équation 공학수학 (Kreyszig, Advanced Engineering Mathematics 10판) */
(function () {
  window.SITE = {
    field: 'em',
    key: 'equation-em-v1',
    name: 'Équation 공학수학',
    title: 'Équation 공학수학',
    wordmark: 'ÉQUATION',
    sub: 'Engineering Mathematics',
    parts: {
      A: { name: '상미분방정식', en: 'Ordinary Differential Equations', desc: '1계부터 연립 ODE, 급수해, 라플라스 변환까지. 공학수학 1의 중심입니다.' },
      B: { name: '선형대수 · 벡터 미적분', en: 'Linear Algebra & Vector Calculus', desc: '행렬과 고유값, 그리고 기울기·발산·회전과 적분 정리.' },
      C: { name: '푸리에 해석 · 편미분방정식', en: 'Fourier Analysis & PDEs', desc: '주기함수의 분해와 파동·열·라플라스 방정식.' },
      D: { name: '복소해석', en: 'Complex Analysis', desc: '해석함수, 코시 적분, 로랑 급수와 유수 정리, 등각사상과 퍼텐셜 이론.' },
    },
    secSource: (sec) => (sec.p ? `Kreyszig 10판 · ${sec.p}쪽` : ''),
    about: 'Kreyszig, <em>Advanced Engineering Mathematics</em> (10판)의 장 구성을 따라 정리한 공학수학 시험 대비 노트입니다. 각 단원의 ‘Kreyszig Ch.’ 표기가 교재의 장 번호입니다.',
    text: {
      refLabel: '교재',
      secChip: 'Kreyszig ',
      secFilter: 'Kreyszig 절',
      unitCaps: 'Chapter',
      unitsCaps: 'The chapters',
      unitsWord: 'chapters',
      howTitle: '읽고, 풀고, 시험처럼 점검하기',
      howLede: '한 단원은 개념 정리 → 연습문제 → 모의고사 순서로 공부하도록 짜여 있습니다. 틀린 문제는 오답노트에 자동으로 모입니다.',
      howLearn: '정의와 풀이법을 시험에 나오는 형태로 정리했습니다. 핵심 공식 상자마다 증명이 연결되어 있고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다. 단답형은 <code>3/2</code>, <code>2*pi</code>, <code>1+2i</code>처럼 식으로 입력합니다.',
      catLede: '그림은 각 단원을 대표하는 곡선입니다. 방향장, 감쇠진동, 상평면, 베셀 함수, 계단 응답 등 단원에서 직접 다루는 함수를 그렸습니다.',
      examLede: '중간·기말고사 범위에 맞춘 시간 제한 시험입니다. 제출하면 자동 채점과 단원별 분석을 보여줍니다.',
      proofLede: '단원에 나오는 공식과 정리 {proofs}개의 증명을 모았습니다. 공식 이름, 사람 이름, 영어 용어로 검색할 수 있습니다. 예: 라플라스 합성곱, 코시, Green, 파세발, 고유값.',
      proofPlaceholder: '찾을 공식이나 정리 (예: 매개변수 변환법, residue)',
      inputHelp: '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 자연상수 <code>e</code>, 제곱근 <code>sqrt(3)</code>, 허수 <code>i</code>를 쓸 수 있습니다.</p><p>예: <code>2*pi*i</code>, <code>1-e^(-1)</code>, <code>(-2+2i)/3</code></p>',
    },
  };
})();
