/* 분야 설정 — Équation 기계 학습: 데이터 마이닝과 기계 학습 (2026-1, 김경수 교수) · 교재 Shalev-Shwartz & Ben-David, Understanding Machine Learning · 인공지능 묶음 */
(function () {
  window.SITE = {
    field: 'ml',
    key: 'equation-ml-v1',
    name: '기계 학습',
    title: 'Équation 기계 학습',
    parts: {
      A: { name: '학습의 이론적 기초', en: 'Foundations', desc: 'ERM과 PAC 학습, 균등수렴, 공짜 점심은 없다 정리, VC 차원, 비균등 학습가능성과 SRM·MDL. 교재 2–7장.' },
      B: { name: '이론에서 알고리즘으로', en: 'From Theory to Algorithms', desc: '선형 예측기와 부스팅, 볼록 학습 문제, 규제와 안정성, 확률적 경사하강법, SVM, 커널 방법. 교재 9–10장, 12–16장.' },
      C: { name: '더 넓은 학습 문제', en: 'Beyond Binary Classification', desc: '다중 클래스와 순위, 결정 트리, 온라인 학습, 군집화, 차원 축소. 교재 17–18장, 21–23장(기말 범위).' },
    },
    // the "§" chip and the section headline: textbook page, then the lecture note if the section follows one
    secSource: (sec) => [sec.p ? `UML p.${sec.p}` : '', sec.src || ''].filter(Boolean).join(' · '),
    about: '김경수 교수님의 「데이터 마이닝과 기계 학습」(2026년 1학기)을 따라 정리한 시험 대비 노트입니다. 교재는 Shalev-Shwartz & Ben-David, <em>Understanding Machine Learning: From Theory to Algorithms</em>(2014, 줄여서 UML)이고, 절 번호와 쪽수는 교재를 따릅니다. 교수님이 올려 주신 증명 노트를 따라간 증명에는 ‘강의 노트’ 표시를 붙였습니다. 설명·예제·문제는 새로 썼습니다.',
    text: {
      refLabel: '교재',
      secChip: 'UML ',
      secFilter: 'UML 절',
      handChip: '강의 노트',
      howTitle: '정리를 읽고, 증명을 재현하고, 시험처럼 점검하기',
      howLede: '이 과목은 정의를 정확히 쓰고 정리를 증명하는 것이 곧 시험입니다. 개념 정리에서 정의와 핵심 정리를 읽고, 증명 페이지에서 같은 논리를 처음부터 따라간 뒤, 증명형 서술 문제로 스스로 재현해 보세요.',
      howLearn: '교재 절 순서대로 정의·정리·예제를 정리했습니다. 강의 노트의 증명은 생략된 단계를 채웠고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 증명형 서술 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 <code>ln(20)/0.1</code>, <code>2^5</code>, <code>7/8</code>처럼 식으로 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 표본 수에 따라 줄어드는 오차 상한, 분쇄되는 점, 사우어 보조정리의 성장 함수, 퍼셉트론의 경계, AdaBoost의 지수 손실, 힌지 손실, SGD의 경로, 결정 트리의 불순도, 가중 다수결의 가중치, k-평균의 군집, 주성분을 그렸습니다.',
      examLede: '중간고사(교재 2–7장, 9–16장)와 기말고사(17–23장) 범위의 시간 제한 시험입니다. 증명 문항은 채점 기준을 보고 직접 채점합니다.',
      proofLede: '교재와 강의 노트에 나오는 정리 {proofs}개의 증명을 모았습니다. ‘강의 노트’ 표시는 교수님의 증명 노트를 따라간 것입니다. 정리 이름이나 영어 용어로 검색할 수 있습니다. 예: Hoeffding, Sauer, No-Free-Lunch, SRM, AdaBoost, stability, SGD, representer, Kraft.',
      proofPlaceholder: '찾을 정리 (예: 공짜 점심, VC, 안정성, 가중 다수결)',
      inputHelp: '<p>분수 <code>7/8</code>, 자연로그 <code>ln(2)</code>, 거듭제곱 <code>2^5</code>, 제곱근 <code>sqrt(2)</code>, 자연상수 <code>e</code>를 쓸 수 있습니다.</p><p>예: <code>ln(200)/0.05</code>, <code>1-e^(-2)</code>, <code>2*ln(40)/0.01</code></p>',
    },
    macros: {
      '\\VC': '\\operatorname{VCdim}', '\\Ldim': '\\operatorname{Ldim}', '\\ERM': '\\mathrm{ERM}', '\\SRM': '\\mathrm{SRM}',
      '\\cH': '\\mathcal{H}', '\\cX': '\\mathcal{X}', '\\cY': '\\mathcal{Y}', '\\cZ': '\\mathcal{Z}', '\\cD': '\\mathcal{D}', '\\cA': '\\mathcal{A}',
      '\\Prob': '\\mathbb{P}', '\\one': '\\mathbb{1}',
    },
  };
})();
