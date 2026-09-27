/* 분야 설정 — Équation 로봇공학 (2026-2 로봇공학입문, 진행 중) · 교재 Lynch & Park, Modern Robotics · 역학 묶음 */
(function () {
  window.SITE = {
    field: 'robot',
    key: 'equation-robot-v1',
    name: '로봇공학',
    title: 'Équation 로봇공학',
    parts: {
      A: { name: '형상과 파지', en: 'Configuration & Grasping', desc: '자유도와 그뤼블러 공식, C-공간의 위상과 표현, 마찰 없는 점 접촉과 힘 닫힘, 마찰 원뿔과 응우옌 정리. 교재 2장, 12.2절(2–3주차 강의).' },
      B: { name: '강체 운동', en: 'Rigid-Body Motions', desc: '회전 행렬과 SO(3), 각속도와 지수 좌표, 동차 변환과 트위스트, 나사 운동과 렌치. 교재 3장.' },
      C: { name: '기구학과 동역학', en: 'Kinematics & Dynamics', desc: '지수곱 정기구학, 야코비안과 정역학, 특이점과 조작성, 역기구학, 라그랑주 동역학, 궤적 생성. 교재 4–6장, 8–9장.' },
    },
    secSource: (sec) => [sec.p ? `MR p.${sec.p}` : '', sec.src || ''].filter(Boolean).join(' · '),
    about: '「로봇공학입문」(2026년 2학기)을 교재 Lynch & Park, <em>Modern Robotics: Mechanics, Planning, and Control</em>(2017, 줄여서 MR)을 따라 정리한 노트입니다. 2–3주차 강의 자료(자유도와 그뤼블러 공식, 파지와 힘 닫힘)를 따른 절에는 ‘강의 자료’ 표시를 붙였고, 그 뒤 단원은 교재 순서를 앞서 정리한 예습용입니다. 설명·예제·문제는 새로 썼습니다.',
    text: {
      refLabel: '교재',
      secChip: 'MR ',
      secFilter: 'MR 절',
      handChip: '강의 자료',
      howTitle: '세고, 표현하고, 곱하기',
      howLede: '로봇의 수학은 세 층입니다. 자유도를 세고(그뤼블러), 강체의 자세를 행렬과 지수 좌표로 표현하고, 관절마다 지수 행렬을 곱해 끝점의 위치와 속도를 얻습니다. 앞 단원의 표현이 뒤 단원의 계산 도구가 됩니다.',
      howLearn: '교재 절 순서대로 정의·공식·예제를 정리했습니다. 강의에서 다룬 절은 슬라이드의 흐름을 따랐고, 공식 상자마다 유도가 연결되어 있습니다. 유도 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형 유도 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 <code>6</code>, <code>atan(0.5)</code>, <code>sqrt(2)/2</code>처럼 식으로 입력합니다. 각은 라디안입니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 링크 기구, 토러스 위의 C-공간, 마찰 원뿔, 회전하는 좌표축, 나선 운동, 2R 팔의 작업 공간, 조작성 타원, 궤적의 시간 스케일링을 그렸습니다.',
      examLede: '강의가 진행 중이라 중간고사(교재 2–3장, 12.2절)와 기말고사(4–6장, 8–9장) 범위를 교재 순서로 추정해 만든 시간 제한 시험입니다. 범위가 공지되면 맞춰 고치세요.',
      proofLede: '교재의 공식과 정리 {proofs}개의 유도를 모았습니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: Grübler, force closure, Nguyen, Rodrigues, adjoint, product of exponentials, Jacobian, manipulability.',
      proofPlaceholder: '찾을 공식 (예: 그뤼블러, 로드리게스, 수반 행렬)',
      inputHelp: '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 제곱근 <code>sqrt(3)</code>, 삼각함수 <code>cos(pi/3)</code>, 역탄젠트 <code>atan(1/2)</code>를 쓸 수 있습니다. 각은 라디안입니다.</p><p>예: <code>pi/2</code>, <code>2*cos(pi/6)</code></p>',
    },
  };
})();
