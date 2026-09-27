/* 분야 설정 — Équation 의료 인공지능: 의료 인공지능 및 소프트웨어 시스템 (2026-2, 이재성 교수, Bishop & Bishop 교재) · 인공지능 묶음 */
(function () {
  window.SITE = {
    field: 'med',
    key: 'diagnostic-medai-v1',
    name: '의료 인공지능',
    title: 'Équation 의료 인공지능',
    parts: {
      A: { name: '도입', en: 'Introduction', desc: '의료 데이터와 의료 AI의 응용, 그리고 곡선 적합으로 보는 딥러닝의 기본 개념(교재 1장).' },
      B: { name: '확률', en: 'Probabilities', desc: '합·곱의 규칙과 베이즈 정리, 확률밀도와 가우시안, 최대가능도, 밀도의 변환, 정보이론, 베이지안 추론(교재 2장).' },
      C: { name: '학습', en: 'Training', desc: '경사하강법과 적응형 옵티마이저, 정규화(normalization), 역전파, 그리고 규제(regularization)(교재 7–9장).' },
    },
    secSource: (sec) => [sec.p ? `Bishop p.${sec.p}` : '', sec.src || ''].filter(Boolean).join(' · '),
    about: '이재성 교수님의 「의료 인공지능 및 소프트웨어 시스템」(2026년 2학기) 강의 슬라이드와 교재 Bishop & Bishop, <em>Deep Learning: Foundations and Concepts</em>(2024)의 1·2·7·8·9장을 따라 정리한 시험 대비 노트입니다. 절마다 교재 쪽수를 적었고, 설명·예제·문제는 새로 썼습니다.',
    text: {
      refLabel: '교재',
      secChip: 'Bishop ',
      secFilter: 'Bishop 절',
      howTitle: '읽고, 풀고, 시험처럼 점검하기',
      howLede: '한 단원은 개념 정리 → 연습문제 → 모의고사 순서로 공부하도록 짜여 있습니다. 교재의 절 번호를 그대로 따르므로 책과 나란히 보기 좋습니다. 틀린 문제는 오답노트에 모입니다.',
      howLearn: '교재 절 순서대로 정의·공식·예제를 정리했습니다. 핵심 공식 상자마다 유도가 연결되어 있고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다. 단답형은 90/387, 1/(1+e^(-1)), ln(2)처럼 식으로 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 심전도, 다항식 적합, 선별검사의 ROC 곡선, 가우시안, 밀도의 변환, 좁아지는 사후분포, 모멘텀, 정규화, 역전파, 라쏘와 릿지, 이중 하강을 그렸습니다.',
      examLede: '중간고사 범위(교재 1·2·7·8·9장)의 시간 제한 시험입니다. 제출하면 자동 채점과 단원별 분석을 보여줍니다.',
      proofLede: '교재와 슬라이드에 나오는 공식 {proofs}개의 유도를 모았습니다. 교재 연습문제에 해당하는 유도는 따로 표시했습니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: Bayes, 편향, Jensen, momentum, Adam, 역전파, weight decay.',
      proofPlaceholder: '찾을 공식이나 유도 (예: 베이즈, MLE 편향, 역전파)',
      handChip: '교재 연습문제',
    },
    // 같은 네트워크의 분야(공학수학·심층 신경망·기초 수학)로 가는 링크는 core/net.js와 net-index.js가 풀어 줍니다.
  };
})();
