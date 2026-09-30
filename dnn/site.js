/* 분야 설정 — Équation 심층 신경망: 심층 신경망의 수학적 기초 (2026-2, 홍영준 교수) · 인공지능 묶음 */
(function () {
  window.SITE = {
    field: 'dnn',
    bilingual: true, // 서술은 영어로 쓰고 한국어 원문은 KO 버튼으로 (data/en-*.js)
    key: 'reseau-dnn-v1',
    name: '심층 신경망',
    title: 'Équation 심층 신경망',
    parts: {
      A: { name: '회귀·확률·정보', en: 'Regression, Probability, Information', desc: '정규방정식과 경사하강법, MLE·베이즈·MAP, 엔트로피와 KL, 릿지와 커널 릿지 회귀. 1–2주차.',
        descEn: 'The normal equations and gradient descent, MLE, Bayes, and MAP, entropy and KL, ridge and kernel ridge regression. Weeks 1–2.' },
      B: { name: '선형 분류', en: 'Linear Classifiers', desc: '로지스틱 회귀의 볼록성, 소프트맥스 회귀의 기울기, 서포트 벡터 머신의 마진과 쌍대 문제. 3주차 월요일.',
        descEn: 'Convexity of logistic regression, the gradient of softmax regression, the margin and dual problem of support vector machines. Week 3 Monday.' },
      C: { name: '신경망과 학습', en: 'Neural Networks & Training', desc: '다층 퍼셉트론, 역전파, SGD와 미니배치, 활성화 함수, 초기화, 학습률 스케줄과 배치 정규화. 3–4주차.',
        descEn: 'Multilayer perceptrons, backpropagation, SGD and minibatches, activation functions, initialization, learning rate schedules and batch normalization. Weeks 3–4.' },
      D: { name: '최적화', en: 'Optimization', desc: '테일러 전개와 하강 보조정리, 경사하강법의 감소 조건, 확률적 경사하강 보조정리와 O(1/√T) 수렴, 나쁜 조건수와 모멘텀·네스테로프, AdaGrad·RMSProp·Adam. 4주차 수요일–5주차 월요일.',
        descEn: 'Taylor expansion and the descent lemma, the decrease condition of gradient descent, the stochastic gradient descent lemma and O(1/√T) convergence, bad condition numbers and momentum/Nesterov, AdaGrad, RMSProp, Adam. Week 4 Wednesday – Week 5 Monday.' },
    },
    // what the "§" chip and the section headline say about the source of a section
    secSource: (sec) => {
      if (!sec.src) return "";
      // bilingual: "W1 수 · 슬라이드 3–5, W2 월 필기" → "Lecture W1 Wed · slides 3–5, W2 Mon notes"
      const s = sec.src.replace(/문제 (\d)/g, "Problem $1").replace(/월/g, "Mon").replace(/수/g, "Wed").replace(/슬라이드/g, "slides").replace(/필기/g, "notes").replace(/보충/g, "supplement").replace(/종합/g, "combined");
      return /^Problem Set/.test(s) ? s : `Lecture ${s}`;
    },
    about: '홍영준 교수님의 「심층 신경망의 수학적 기초」(2026년 2학기) 1–5주차 강의 슬라이드와 수업 중 필기, 그리고 Problem Set 1을 따라 정리한 시험 대비 노트입니다. 절마다 해당 강의(주차·요일·슬라이드 번호)를 적었고, 필기로 풀어 주신 증명은 ‘강의 필기’ 표시와 함께 빠진 단계를 채워 실었습니다.',
    aboutEn: 'Exam-prep notes following the Week 1–5 lecture slides and in-class notes of Prof. Youngjoon Hong’s “Mathematical Foundations of Deep Neural Networks” (Fall 2026), together with Problem Set 1. Each section names its lecture (week, day, slide numbers), and the proofs worked out by hand in class appear with the “lecture notes” mark, with the missing steps filled in.',
    text: {
      refLabel: '강의',
      secChip: '§',
      secFilter: '절',
      handChip: '강의 필기',
      howTitle: '증명을 따라가고, 풀고, 시험처럼 점검하기',
      howLede: '이 과목은 유도와 증명이 곧 시험 문제입니다. 개념 정리의 필기 상자로 유도를 따라가고, 증명 페이지에서 같은 논리를 처음부터 다시 쓴 뒤, 증명형 서술 문제로 스스로 재현해 보세요.',
      howLearn: '강의 순서대로 정의·정리·유도를 정리했습니다. 필기로 푸신 증명은 빠진 단계까지 채웠고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 증명형 서술 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 35/69, 1/(1+e^(-2)), ln(2)처럼 식으로 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 회귀선의 회전, 베타 사후분포, 이진 엔트로피, 릿지 적합, 시그모이드, 마진, 활성화 함수, 계산 그래프, SGD 경로, 초기화, 학습률 스케줄, 하강 보조정리의 이차 상한, 나쁜 조건수에서의 모멘텀 경로를 그렸습니다.',
      examLede: '1–5주차 범위의 시간 제한 시험입니다. Problem Set 1과 같은 유형의 증명 모의고사도 있습니다. 유도·증명 문항은 채점 기준을 보고 직접 채점합니다.',
      proofLede: '강의에 나온 정리와 유도 {proofs}개의 증명을 모았습니다. ‘강의 필기’ 표시는 교수님이 수업 중에 손으로 풀어 주신 증명입니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: KL, Jensen, descent lemma, Xavier, push-through.',
      proofPlaceholder: '찾을 정리나 유도 (예: 정규방정식, Hessian, dual)',
      quizNav: '퀴즈풀이',
      quizLede: '수업에서 받은 Problem Set 1의 네 문제를 문제 → **핵심 포인트** → 풀이 → 자주 하는 실수 순서로 정리했습니다. 시험이 이 유형으로 나오므로, 핵심 포인트를 읽고 직접 답안을 써 본 뒤 풀이를 펼쳐 비교하세요. 문제마다 위에는 개념이 있는 단원으로, 아래에는 같은 유형의 연습문제로 가는 링크가 있고, 맨 아래에 단원별 퀴즈 대비 연습문제를 모았습니다.',
    },
    // English for the prose above (bilingual): the Korean stays behind the KO toggle
    textEn: {
      howTitle: 'Follow the proofs, solve, and check yourself as in an exam',
      howLede: 'In this course, derivations and proofs are the exam problems. Follow the derivations with the class-notes boxes in the concept summaries, rewrite the same logic from scratch on the proof pages, and reproduce it yourself with the proof-type written problems.',
      howLearn: 'Definitions, theorems, and derivations are organized in lecture order. Proofs worked out by hand in class are completed down to the missing steps, and the {proofs} proofs can be searched separately.',
      howPractice: 'Multiple-choice and short-answer problems are graded immediately; proof-type written problems are self-graded against a model answer and a rubric. Enter short answers as expressions, such as 35/69, 1/(1+e^(-2)), ln(2).',
      howExam: 'Check your exam readiness with {exams} timed mock exams and custom mock exams drawn from the units you choose.',
      catLede: 'Each figure is a curve that represents its unit: the rotation of a regression line, a beta posterior, the binary entropy, a ridge fit, the sigmoid, the margin, activation functions, a computational graph, SGD paths, initialization, learning rate schedules, the quadratic upper bound of the descent lemma, and momentum paths under a bad condition number.',
      examLede: 'Timed exams covering Weeks 1–5, including a proof mock exam of the same type as Problem Set 1. Derivation and proof problems are self-graded with the rubric.',
      examsPageLede: 'There are {exams} mock exams matched to the exam range, plus custom mock exams. Once you start, the timer runs, and your answers are submitted automatically when time is up. Written problems are self-graded after submission, using the model solution and the rubric.',
      proofLede: 'The proofs of the {proofs} theorems and derivations from the lectures. The “lecture notes” mark indicates proofs the professor worked out by hand in class. Search by formula name or English term, e.g., KL, Jensen, descent lemma, Xavier, push-through.',
      quizLede: 'The four problems of Problem Set 1 from class, arranged as problem → **key points** → solution → common mistakes. The exam comes in this format, so read the key points, write your own answer, and then open the solution to compare. Each problem links above to the units with the concepts and below to practice problems of the same type, and the quiz-prep practice problems by unit are collected at the bottom.',
    },
    // 같은 네트워크의 분야(공학수학·의료 인공지능·기초 수학)로 가는 링크는 core/net.js와 net-index.js가 풀어 줍니다.
  };
})();
