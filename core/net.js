/* Équation 네트워크: 분야 목록. 허브(index.html)와 모든 분야 페이지가 읽습니다.
   분야 사이의 제목·링크 색인(NET.index, NET.links)은 tools/netindex.sh가 core/net-index.js로 만듭니다.
   분야는 모두 같은 Équation의 한 부분이라 따로 이름(브랜드)을 두지 않습니다. 저장 키(key)는 예전 값을 그대로 둡니다. 바꾸면 풀이 기록이 사라집니다. */
(function () {
  const NET = window.NET = window.NET || {};
  NET.mark = 'ÉQUATION';
  NET.name = 'Équation';
  NET.groups = [
    { id: 'base', name: '기초', en: 'Foundations', fr: 'Fondements', desc: '모든 분야가 말없이 가져다 쓰는 미적분과 해석학의 도구.' },
    { id: 'eng', name: '공학', en: 'Engineering', fr: 'Ingénierie', desc: '미분방정식, 선형대수, 벡터 미적분, 푸리에 해석, 복소해석.' },
    { id: 'mech', name: '역학', en: 'Mechanics', fr: 'Mécanique', desc: '힘과 운동, 변형과 흐름을 방정식으로: 고체·동역학·유체, 그리고 로봇.' },
    { id: 'ai', name: '인공지능', en: 'Artificial Intelligence', fr: 'Intelligence artificielle', desc: '확률과 최적화로 읽는 머신러닝과 신경망.' },
  ];
  NET.fields = [
    {
      id: 'base', group: 'base', short: '기초 수학', tiny: '기초', name: '기초 수학', en: 'Foundations of Calculus & Analysis',
      path: 'base/', key: 'equation-base-v1', plot: 'taylor', live: true,
      desc: '테일러 정리, 평균값 정리, 급수의 수렴, 다변수 연쇄법칙, 립시츠 조건처럼 다른 분야가 전제로 깔고 쓰는 개념을 한곳에 모았습니다.',
    },
    {
      id: 'em', group: 'eng', short: '공학수학', tiny: '공학수학', name: '공학수학', en: 'Engineering Mathematics',
      path: 'em/', key: 'equation-em-v1', plot: 'slope', live: true,
      desc: 'Kreyszig 10판 1–18장: 상미분방정식, 선형대수·벡터 미적분, 푸리에 해석·편미분방정식, 복소해석과 등각사상.',
    },
    {
      id: 'solid', group: 'mech', short: '고체역학', tiny: '고체', name: '고체역학', en: 'Mechanics of Materials',
      path: 'solid/', key: 'equation-solid-v1', plot: 'ssCurve', live: true,
      desc: 'Beer & Johnston 재료역학 1–10장: 응력과 변형률, 축하중과 열응력, 비틀림, 굽힘과 전단, 보의 처짐, 모어 원, 압력 용기, 파손 이론, 좌굴.',
    },
    {
      id: 'dyn', group: 'mech', short: '동역학', tiny: '동역학', name: '동역학', en: 'Dynamics',
      path: 'dyn/', key: 'equation-dyn-v1', plot: 'dyCycloid', live: true,
      desc: 'Beer & Johnston 벡터 역학 11–18장과 라그랑주 역학: 질점의 운동, 에너지와 운동량, 충돌, 변분법, 강체의 평면 운동, 코리올리 가속도, 관성 텐서.',
    },
    {
      id: 'fluid', group: 'mech', short: '유체역학', tiny: '유체', name: '유체역학', en: 'Fluid Mechanics',
      path: 'fluid/', key: 'equation-fluid-v1', plot: 'flCylinder', live: true,
      desc: 'White 유체역학 1–8장: 정수압과 부력, 레이놀즈 수송 정리, 베르누이, 나비에-스토크스, 차원 해석, 관 유동, 경계층, 항력, 퍼텐셜 유동.',
    },
    {
      id: 'robot', group: 'mech', short: '로봇공학', tiny: '로봇', name: '로봇공학입문', en: 'Introduction to Robotics',
      path: 'robot/', key: 'equation-robot-v1', plot: 'rbWorkspace', live: true,
      desc: 'Lynch & Park, Modern Robotics: 자유도와 C-공간, 파지와 힘 닫힘, 회전과 강체 운동, 지수곱 정기구학, 야코비안, 역기구학, 동역학, 궤적 생성.',
    },
    {
      id: 'ml', group: 'ai', short: '기계 학습', tiny: '기계학습', name: '데이터 마이닝과 기계 학습', en: 'Machine Learning: Theory & Algorithms',
      path: 'ml/', key: 'equation-ml-v1', plot: 'vcgrowth', live: true,
      desc: 'Shalev-Shwartz & Ben-David 교재 2–23장: PAC 학습과 VC 차원, SRM, 부스팅, 볼록 학습과 SGD, 규제와 안정성, SVM과 커널, 결정 트리, 온라인 학습, 군집화, 차원 축소.',
    },
    {
      id: 'dnn', group: 'ai', short: '심층 신경망', tiny: '신경망', name: '심층 신경망의 수학적 기초', en: 'Mathematics of Deep Neural Networks',
      path: 'dnn/', key: 'reseau-dnn-v1', plot: 'descent', live: true,
      desc: '1–5주차: 회귀·확률·정보이론(JS 발산), MAP과 편향-분산, 로지스틱·소프트맥스·SVM과 쌍대성, 역전파·초기화·배치 정규화, 하강 보조정리와 SGD 수렴, 모멘텀·AdaGrad·RMSProp·Adam.',
    },
    {
      id: 'med', group: 'ai', short: '의료 인공지능', tiny: '의료 AI', name: '의료 인공지능 및 소프트웨어 시스템', en: 'Medical AI & Software Systems',
      path: 'med/', key: 'diagnostic-medai-v1', plot: 'roc', live: true,
      desc: 'Bishop 딥러닝 교재 1·2·7·8·9장: 확률과 베이즈 정리, 가우시안과 최대가능도, 정보이론, 경사하강법과 Adam, 정규화, 역전파, 규제.',
    },
  ];
})();
