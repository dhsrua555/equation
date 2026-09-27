/* Équation 네트워크: 분야 목록. 허브(index.html)와 모든 분야 페이지가 읽습니다.
   분야 사이의 제목·링크 색인(NET.index, NET.links)은 tools/netindex.sh가 core/net-index.js로 만듭니다. */
(function () {
  const NET = window.NET = window.NET || {};
  NET.mark = 'ÉQUATION';
  NET.name = 'Équation';
  NET.groups = [
    { id: 'base', name: '기초', en: 'Foundations', desc: '모든 분야가 말없이 가져다 쓰는 미적분과 해석학의 도구.' },
    { id: 'eng', name: '공학', en: 'Engineering', desc: '미분방정식, 선형대수, 벡터 미적분, 푸리에 해석, 복소해석.' },
    { id: 'ai', name: '인공지능', en: 'Artificial Intelligence', fr: 'Intelligence artificielle', desc: '확률과 최적화로 읽는 머신러닝과 신경망.' },
  ];
  NET.fields = [
    {
      id: 'base', group: 'base', short: '기초 수학', tiny: '기초', name: '기초 수학', mark: 'FONDEMENTS', en: 'Foundations of Calculus & Analysis',
      path: 'base/', key: 'equation-base-v1', plot: 'taylor', live: true,
      desc: '테일러 정리, 평균값 정리, 급수의 수렴, 다변수 연쇄법칙, 립시츠 조건처럼 다른 분야가 전제로 깔고 쓰는 개념을 한곳에 모았습니다.',
    },
    {
      id: 'em', group: 'eng', short: '공학수학', tiny: '공학수학', name: '공학수학', mark: 'ÉQUATION', en: 'Engineering Mathematics',
      path: 'em/', key: 'equation-em-v1', plot: 'slope', live: true,
      desc: 'Kreyszig 10판 1–18장: 상미분방정식, 선형대수·벡터 미적분, 푸리에 해석·편미분방정식, 복소해석과 등각사상.',
    },
    {
      id: 'dnn', group: 'ai', short: '심층 신경망', tiny: '신경망', name: '심층 신경망의 수학적 기초', mark: 'RÉSEAU', en: 'Mathematics of Deep Neural Networks',
      path: 'dnn/', key: 'reseau-dnn-v1', plot: 'descent', live: true,
      desc: '회귀·확률·정보이론, 로지스틱·소프트맥스·SVM, 역전파·초기화·배치 정규화, 하강 보조정리.',
    },
    {
      id: 'med', group: 'ai', short: '의료 인공지능', tiny: '의료 AI', name: '의료 인공지능 및 소프트웨어 시스템', mark: 'DIAGNOSTIC', en: 'Medical AI & Software Systems',
      path: 'med/', key: 'diagnostic-medai-v1', plot: 'roc', live: true,
      desc: 'Bishop 딥러닝 교재 1·2·7·8·9장: 확률과 베이즈 정리, 가우시안과 최대가능도, 정보이론, 경사하강법과 Adam, 정규화, 역전파, 규제.',
    },
  ];
})();
