/* 분야 설정 — Équation 동역학 (2026-1) · 교재 Beer, Johnston, Mazurek, Cornwell & Eisenberg, Vector Mechanics for Engineers 9판 · 수업 필기와 Lagrangian Dynamics 수업 자료 · 역학 묶음 */
(function () {
  window.SITE = {
    field: 'dyn',
    key: 'equation-dyn-v1',
    name: '동역학',
    title: 'Équation 동역학',
    parts: {
      A: { name: '질점의 동역학', en: 'Dynamics of Particles', desc: '질점의 운동학, 뉴턴 제2법칙, 각운동량과 중심력, 일과 에너지, 충격량과 충돌. 교재 11–13장.' },
      B: { name: '변분법과 라그랑주 역학', en: 'Variational & Lagrangian Mechanics', desc: '범함수의 극값과 오일러-라그랑주 방정식, 일반화 좌표로 쓰는 운동 방정식. 수업 자료 Lagrangian Dynamics 장과 4월 1일·6일 필기(중간고사 범위).' },
      C: { name: '질점계와 강체', en: 'Systems of Particles & Rigid Bodies', desc: '질점계와 질량 중심, 강체의 평면 운동학과 회전 좌표계, 평면 운동의 운동 방정식, 일·에너지와 충격량·운동량, 관성 텐서와 3차원 운동. 교재 14–18장(질점계는 중간, 강체는 기말고사 범위).' },
    },
    secSource: (sec) => [sec.p ? `B&J p.${sec.p}` : '', sec.src || ''].filter(Boolean).join(' · '),
    about: '차은혁 교수님의 「동역학」(2026년 1학기) 수업 필기(3월 4일–6월 8일)와 수업 자료로 받은 Lagrangian Dynamics 장(6장, 변분법과 라그랑주 역학)을 따라 정리한 시험 대비 노트입니다. 교재는 Beer, Johnston, Mazurek, Cornwell & Eisenberg, <em>Vector Mechanics for Engineers: Statics and Dynamics</em> 9판이고, 절 번호와 쪽수는 교재를 따릅니다. 수업 필기를 따라간 절과 유도에는 ‘수업 필기’ 표시를 붙였습니다. 설명·예제·문제는 새로 썼고, 과제 문제는 싣지 않았습니다.',
    text: {
      refLabel: '교재',
      secChip: 'B&J ',
      secFilter: 'B&J 절',
      handChip: '수업 필기',
      howTitle: '좌표를 고르고, 자유물체도를 그리고, 법칙 하나를 고르기',
      howLede: '동역학 문제의 절반은 좌표계 선택입니다. 직교·법선-접선·극좌표 중 무엇을 쓸지, 뉴턴 법칙·에너지·운동량·라그랑주 방정식 중 무엇이 가장 짧은지 먼저 정하세요. 각 단원은 그 선택의 기준을 정리합니다.',
      howLearn: '수업 필기의 순서를 따라 정의·유도·예제를 정리했습니다. 필기에서 건너뛴 단계는 채웠고, 필기끼리 기호 규약이 다른 곳은 표시했습니다. 유도 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형 유도 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 문제에 적힌 단위로 <code>4.9</code>, <code>2*9.81*sin(pi/6)</code>, <code>sqrt(2*9.81*3)</code>처럼 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 위치·속도·가속도 곡선, 포물선 궤적, 퍼텐셜 우물, 충돌 전후의 속도, 사이클로이드, 코리올리 편향, 관성 타원체를 그렸습니다.',
      examLede: '중간고사(3월 4일–4월 20일 필기: 질점 동역학과 라그랑주 역학)와 기말고사(4월 27일–6월 8일 필기: 강체 동역학) 범위의 시간 제한 시험입니다. 기말고사는 필기에 적힌 대로 75분 10문제 형식입니다.',
      proofLede: '수업 필기와 교재의 공식 {proofs}개의 유도를 모았습니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: 코리올리, Euler-Lagrange, 평행축, 반발 계수, 타격 중심, 관성 텐서, 구름.',
      proofPlaceholder: '찾을 공식 (예: 코리올리, 평행축 정리, 반발 계수)',
      inputHelp: '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 제곱근 <code>sqrt(3)</code>, 삼각함수 <code>sin(pi/6)</code>, 거듭제곱 <code>2^5</code>를 쓸 수 있습니다. 각은 라디안입니다.</p><p>예: <code>2/3*9.81*sin(pi/6)</code>, <code>sqrt(2*9.81*1.2)</code></p>',
    },
  };
})();
