/* 분야 설정 — Équation 공학수학 (Kreyszig, Advanced Engineering Mathematics 10판 + 공학수학2 강의 PPT) */
(function () {
  window.SITE = {
    field: 'em',
    key: 'equation-em-v1',
    name: '공학수학',
    title: 'Équation 공학수학',
    parts: {
      // 강의 PPT를 따로 정리한 단원(17)은 시험 범위라 맨 앞에 둡니다.
      L: { name: '강의 · 선형대수학', en: 'Lecture Slides · Linear Algebra', desc: '공학수학2 강의 PPT「선형대수학」(44쪽)을 슬라이드 순서대로 풀어 쓴 단원. 벡터공간, 선형사상, 내적과 근사까지. 시험은 이 PPT에서 나올 가능성이 큽니다.' },
      A: { name: '상미분방정식', en: 'Ordinary Differential Equations', desc: '1계부터 연립 ODE, 급수해, 라플라스 변환까지. 공학수학 1의 중심입니다.' },
      B: { name: '선형대수 · 벡터 미적분', en: 'Linear Algebra & Vector Calculus', desc: '행렬과 고유값, 그리고 기울기·발산·회전과 적분 정리.' },
      C: { name: '푸리에 해석 · 편미분방정식', en: 'Fourier Analysis & PDEs', desc: '주기함수의 분해와 파동·열·라플라스 방정식.' },
      D: { name: '복소해석', en: 'Complex Analysis', desc: '해석함수, 코시 적분, 로랑 급수와 유수 정리, 등각사상과 퍼텐셜 이론.' },
    },
    // 머리말의 바로가기: 강의 PPT 단원
    nav: [{ label: '선형대수 강의', route: 'ch17', title: '공학수학2 강의 PPT 「선형대수학」 정리 (17단원)' }],
    secSource: (sec) => (sec.slides ? `강의 PPT · 슬라이드 ${sec.slides}` : sec.p ? `Kreyszig 10판 · ${sec.p}쪽` : ''),
    about: 'Kreyszig, <em>Advanced Engineering Mathematics</em> (10판)의 장 구성을 따라 정리한 공학수학 시험 대비 노트입니다. 각 단원의 ‘Kreyszig Ch.’ 표기가 교재의 장 번호입니다. 17단원은 공학수학2 강의 PPT 「선형대수학」을 슬라이드 순서대로 정리했고, 퀴즈풀이에는 Homework #1(선형대수학·푸리에 급수)과 #2(푸리에 해석)의 풀이가 있습니다. 고난이도 탭에는 교재 7·8·11장 연습문제 가운데 어려운 29문제의 풀이가 있습니다.',
    text: {
      refLabel: '교재',
      secChip: 'Kreyszig ',
      secFilter: 'Kreyszig 절',
      unitCaps: 'Chapter',
      unitsCaps: 'The chapters',
      unitsWord: 'chapters',
      howTitle: '읽고, 풀고, 시험처럼 점검하기',
      howLede: '한 단원은 개념 정리 → 연습문제 → 모의고사 순서로 공부하도록 짜여 있습니다. 틀린 문제는 오답노트에 자동으로 모입니다. 공학수학2 시험 대비는 17단원(강의 PPT 선형대수학)과 퀴즈풀이(과제 1·2)부터 보고, 실력을 다지려면 고난이도 탭으로 가세요.',
      howLearn: '정의와 풀이법을 시험에 나오는 형태로 정리했습니다. 핵심 공식 상자마다 증명이 연결되어 있고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다. 단답형은 <code>3/2</code>, <code>2*pi</code>, <code>1+2i</code>처럼 식으로 입력합니다.',
      catLede: '그림은 각 단원을 대표하는 곡선입니다. 방향장, 감쇠진동, 상평면, 베셀 함수, 계단 응답, 그리고 강의 PPT의 sin x 최선 근사처럼 단원에서 직접 다루는 함수를 그렸습니다.',
      examLede: '중간·기말고사 범위에 맞춘 시간 제한 시험입니다. 강의 PPT 선형대수학과 과제 유형을 묶은 모의고사도 있습니다. 제출하면 자동 채점과 단원별 분석을 보여줍니다.',
      proofLede: '단원에 나오는 공식과 정리 {proofs}개의 증명을 모았습니다. 공식 이름, 사람 이름, 영어 용어로 검색할 수 있습니다. 예: 라플라스 합성곱, 코시, Green, 파세발, 고유값, 차원정리, 최선 근사.',
      proofPlaceholder: '찾을 공식이나 정리 (예: 매개변수 변환법, residue)',
      inputHelp: '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 자연상수 <code>e</code>, 제곱근 <code>sqrt(3)</code>, 허수 <code>i</code>를 쓸 수 있습니다.</p><p>예: <code>2*pi*i</code>, <code>1-e^(-1)</code>, <code>(-2+2i)/3</code></p>',
      quizNav: '퀴즈풀이',
      quizLede: '공학수학2 과제 두 개(Homework #1 다섯 문제, Homework #2 아홉 문항)를 문제 → **핵심 포인트** → 풀이 → 자주 하는 실수 순서로 정리했습니다. 핵심 포인트를 읽고 직접 답안을 써 본 뒤 풀이를 펼쳐 비교하세요. 문제마다 위에는 개념이 있는 단원(17단원 강의 PPT, 10단원 푸리에 해석)으로, 아래에는 같은 유형의 연습문제로 가는 링크가 있습니다.',
      hardNav: '고난이도',
      hardLede: '교재(Kreyszig 10판) 7장 선형대수, 8장 고유값 문제, 11장 푸리에 해석의 연습문제 가운데 **증명·프로젝트형이거나 요령이 필요한** 문제 29개를 골랐습니다. 과제에 나온 문제는 뺐습니다. 문제마다 **핵심 포인트**(어디서 막히는지, 어떤 도구를 쓰는지)를 먼저 읽고 직접 풀어 본 뒤 풀이를 펼치세요. 마지막 **함정**은 채점에서 자주 깎이는 부분입니다. 별 개수는 상대적인 난도입니다.',
    },
  };
})();
