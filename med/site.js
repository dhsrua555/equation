/* 분야 설정 — Équation 의료 인공지능: 의료 인공지능 및 소프트웨어 시스템 (2026-2, 이재성 교수, Bishop & Bishop 교재) · 인공지능 묶음 */
(function () {
  // 2026-09-29: 교재 6장이 새 07단원으로 들어오면서 옛 07–11단원이 08–12단원이 되었습니다.
  // 이 브라우저에 저장된 진도·시험 기록의 단원 번호(ch07–ch11)를 한 번만 옮깁니다.
  try {
    const K = 'diagnostic-medai-v1', FLAG = K + ':renum-2026-09-29';
    if (!localStorage.getItem(FLAG)) {
      const raw = localStorage.getItem(K);
      if (raw) localStorage.setItem(K, raw.replace(/\bch(0[7-9]|1[01])\b/g, (_, n) => 'ch' + String(+n + 1).padStart(2, '0')));
      localStorage.setItem(FLAG, '1');
    }
  } catch (e) { /* storage unavailable */ }
  window.SITE = {
    field: 'med',
    key: 'diagnostic-medai-v1',
    name: '의료 인공지능',
    title: 'Équation 의료 인공지능',
    parts: {
      A: { name: '도입', en: 'Introduction', desc: '의료 데이터와 의료 AI의 응용, 그리고 곡선 적합으로 보는 딥러닝의 기본 개념(교재 1장).' },
      B: { name: '확률', en: 'Probabilities', desc: '합·곱의 규칙과 베이즈 정리, 확률밀도와 가우시안, 최대가능도, 밀도의 변환, 정보이론, 베이지안 추론(교재 2장).' },
      C: { name: '신경망과 학습', en: 'Networks & Training', desc: '다층 신경망과 활성화 함수, 표현 학습, 출력과 오차함수의 짝(교재 6장), 경사하강법과 적응형 옵티마이저, 정규화(normalization), 역전파, 규제(regularization)(교재 7–9장).' },
      D: { name: '합성곱 신경망', en: 'Convolutional Networks', desc: '합성곱·패딩·보폭·풀링과 LeNet·AlexNet·VGG, 학습된 CNN의 해석(Grad-CAM, 적대적 공격), 물체 검출(IoU, 비최대 억제), 의미 분할(전치 합성곱, U-net), 스타일 전이(교재 10장).' },
    },
    secSource: (sec) => [sec.p ? `Bishop p.${sec.p}` : '', sec.src || ''].filter(Boolean).join(' · '),
    about: '이재성 교수님의 「의료 인공지능 및 소프트웨어 시스템」(2026년 2학기) 강의 슬라이드와 교재 Bishop & Bishop, <em>Deep Learning: Foundations and Concepts</em>(2024)의 1·2·6·7·8·9·10장을 따라 정리한 시험 대비 노트입니다. 슬라이드의 수식은 모두 옮겨 유도까지 달았고, 슬라이드의 그래프와 도식은 새로 그렸습니다. 절마다 교재 쪽수를 적었고, 설명·예제·문제는 새로 썼습니다.',
    text: {
      refLabel: '교재',
      secChip: 'Bishop ',
      secFilter: 'Bishop 절',
      howTitle: '읽고, 풀고, 시험처럼 점검하기',
      howLede: '한 단원은 개념 정리 → 연습문제 → 모의고사 순서로 공부하도록 짜여 있습니다. 교재의 절 번호를 그대로 따르므로 책과 나란히 보기 좋습니다. 틀린 문제는 오답노트에 모입니다.',
      howLearn: '교재 절 순서대로 정의·공식·예제를 정리했습니다. 핵심 공식 상자마다 유도가 연결되어 있고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형은 모범 풀이와 비교해 스스로 채점합니다. 단답형은 90/387, 1/(1+e^(-1)), ln(2)처럼 식으로 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 심전도, 다항식 적합, 선별검사의 ROC 곡선, 가우시안, 밀도의 변환, 좁아지는 사후분포, tanh 은닉 유닛의 합, 모멘텀, 정규화, 역전파, 라쏘와 릿지, 이중 하강, 가보르 필터, U-net을 그렸습니다.',
      examLede: '교재 1·2·6·7·8·9·10장 범위의 시간 제한 시험입니다. 제출하면 자동 채점과 단원별 분석을 보여줍니다.',
      proofLede: '교재와 슬라이드에 나오는 공식 {proofs}개의 유도를 모았습니다. 교재 연습문제에 해당하는 유도는 따로 표시했습니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: Bayes, 편향, Jensen, momentum, Adam, 역전파, weight decay, softmax, 합성곱, IoU.',
      proofPlaceholder: '찾을 공식이나 유도 (예: 베이즈, MLE 편향, 역전파)',
      handChip: '교재 연습문제',
    },
    // 같은 네트워크의 분야(공학수학·심층 신경망·기초 수학)로 가는 링크는 core/net.js와 net-index.js가 풀어 줍니다.
  };
})();
