/* 분야 설정 — Équation 유체역학 (2025-2) · 교재 Frank M. White, Fluid Mechanics 7판 · 역학 묶음 */
(function () {
  window.SITE = {
    field: 'fluid',
    key: 'equation-fluid-v1',
    name: '유체역학',
    title: 'Équation 유체역학',
    parts: {
      A: { name: '유체의 성질과 정수역학', en: 'Properties & Fluid Statics', desc: '연속체, 점성과 표면장력, 정수압 분포와 마노미터, 잠긴 면의 힘, 부력과 안정성, 강체 운동. 교재 1–2장.' },
      B: { name: '검사체적과 미분 해석', en: 'Integral & Differential Analysis', desc: '레이놀즈 수송 정리, 질량·운동량·에너지 보존, 베르누이 방정식, 연속 방정식과 나비에-스토크스 방정식, 유동 함수와 정확해. 교재 3–4장.' },
      C: { name: '차원 해석과 점성 유동', en: 'Similitude & Viscous Flow', desc: '파이 정리와 모형 실험, 관 유동과 마찰 계수, 부차 손실과 관로 계통, 경계층, 항력과 양력, 퍼텐셜 유동. 교재 5–8장.' },
    },
    secSource: (sec) => (sec.p ? `White 7판 p.${sec.p}` : ''),
    about: '「유체역학」(2025년 2학기)을 교재 Frank M. White, <em>Fluid Mechanics</em> 7판(2011)의 1–8장 순서로 정리한 시험 대비 노트입니다. 이 과목은 강의 자료가 없어 교재의 절 번호와 쪽수를 그대로 따릅니다. 설명·예제·문제는 새로 썼고, 교재의 연습문제는 싣지 않았습니다.',
    text: {
      refLabel: '교재',
      secChip: 'White ',
      secFilter: 'White 절',
      howTitle: '검사체적을 그리고, 보존 법칙 하나를 적용하기',
      howLede: '유체역학의 거의 모든 계산은 “어떤 검사체적에, 어떤 보존 법칙을, 어떤 가정으로” 적용하느냐로 정해집니다. 단원마다 가정(정상, 비압축, 비점성, 완전 발달)이 어디서 들어가는지 표시했습니다.',
      howLearn: '교재 절 순서대로 정의·공식·예제를 정리했습니다. 공식 상자마다 유도가 연결되어 있고, 유도 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 서술형 유도 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 문제에 적힌 단위로 <code>9790*2.5</code>, <code>sqrt(2*9.81*4)</code>, <code>64/1500</code>처럼 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 점성 전단, 정수압 분포, 부력 중심, 제트, 베르누이 수두, 포아죄유 분포, 무디 선도, 경계층 두께, 항력 계수, 원기둥 주위의 유선을 그렸습니다.',
      examLede: '중간고사(교재 1–4장)와 기말고사(5–8장) 범위의 시간 제한 시험입니다. 서술형은 채점 기준을 보고 직접 채점합니다.',
      proofLede: '교재의 공식 {proofs}개의 유도를 모았습니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: Bernoulli, Reynolds transport, Navier-Stokes, Poiseuille, Buckingham, Blasius, Kutta-Joukowski.',
      proofPlaceholder: '찾을 공식 (예: 베르누이, 포아죄유, 파이 정리)',
      inputHelp: '<p>분수 <code>3/2</code>, 원주율 <code>pi</code>, 제곱근 <code>sqrt(3)</code>, 거듭제곱 <code>2^5</code>, 지수 표기 <code>1.8e-5</code>, 상용로그 <code>log10(2)</code>를 쓸 수 있습니다. 단위는 문제에 적힌 대로 맞춰 숫자만 넣습니다.</p><p>예: <code>998*9.81*3</code>, <code>0.3164/40000^0.25</code></p>',
    },
  };
})();
