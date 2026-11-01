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
      E: { name: '합성곱 신경망', en: 'Convolutional Networks', desc: '완전연결층의 한계, 합성곱·풀링·출력 크기 공식, 이동 등변성, AlexNet·VGG·GoogLeNet·ResNet의 크기와 매개변수 계산, 잔차 연결의 기울기, 현저성 지도. 5주차 월요일(3)–6주차 수요일.',
        descEn: 'Limits of fully connected layers, convolution, pooling and the output size formula, translation equivariance, sizes and parameter counts of AlexNet, VGG, GoogLeNet, and ResNet, the gradient through residual connections, saliency maps. Week 5 Monday (3) – Week 6 Wednesday.' },
      F: { name: '근사와 일반화', en: 'Approximation & Generalization', desc: '측도·노름 공간·조밀성, 판별 함수와 Cybenko의 보편 근사 정리, 바론 클래스와 차원에 무관한 근사율 C²/N(Maurey 보조정리), 모집단·경험적 위험과 라데마허 복잡도. 8주차 수요일–9주차 월요일.',
        descEn: 'Measures, normed spaces and density, discriminatory functions and Cybenko’s universal approximation theorem, the Barron class and the dimension-free rate C²/N (Maurey’s lemma), population and empirical risk and Rademacher complexity. Week 8 Wednesday – Week 9 Monday.' },
      G: { name: '순환 신경망', en: 'Recurrent Networks', desc: '순차 데이터와 바닐라 RNN, 시간 역전파(BPTT)와 두 단계 RNN의 기울기, 기울기 폭발·소실과 잘라내기, LSTM의 게이트와 기울기 흐름, 언어 모델·기계 번역·이미지 캡셔닝. 9주차 수요일.',
        descEn: 'Sequence data and the vanilla RNN, backpropagation through time (BPTT) and the gradients of a two-step RNN, exploding and vanishing gradients and clipping, the gates and gradient flow of the LSTM, language models, machine translation, and image captioning. Week 9 Wednesday.' },
    },
    // what the "§" chip and the section headline say about the source of a section
    secSource: (sec) => {
      if (!sec.src) return "";
      // bilingual: "W1 수 · 슬라이드 3–5, W2 월 필기" → "Lecture W1 Wed · slides 3–5, W2 Mon notes"
      const s = sec.src.replace(/실습 코드/g, "Practice code").replace(/문제 (\d)/g, "Problem $1").replace(/월/g, "Mon").replace(/수/g, "Wed").replace(/슬라이드/g, "slides").replace(/필기/g, "notes").replace(/보충/g, "supplement").replace(/종합/g, "combined");
      return /^(Problem Set|Practice code)/.test(s) ? s : `Lecture ${s}`;
    },
    about: '홍영준 교수님의 「심층 신경망의 수학적 기초」(2026년 2학기) 1–9주차 강의 슬라이드와 수업 중 필기, 실습 코드, 그리고 Problem Set 1·Quiz 1을 따라 정리한 시험 대비 노트입니다. 절마다 해당 강의(주차·요일·슬라이드 번호)를 적었고, 필기로 풀어 주신 증명은 ‘강의 필기’ 표시와 함께 빠진 단계를 채워 실었습니다.',
    aboutEn: 'Exam-prep notes following the Week 1–9 lecture slides, in-class notes, and practice code of Prof. Youngjoon Hong’s “Mathematical Foundations of Deep Neural Networks” (Fall 2026), together with Problem Set 1 and Quiz 1. Each section names its lecture (week, day, slide numbers), and the proofs worked out by hand in class appear with the “lecture notes” mark, with the missing steps filled in.',
    text: {
      refLabel: '강의',
      secChip: '§',
      secFilter: '절',
      handChip: '강의 필기',
      extraChip: '판서에 없는 증명',
      howTitle: '증명을 따라가고, 풀고, 시험처럼 점검하기',
      howLede: '이 과목은 유도와 증명이 곧 시험 문제입니다. 개념 정리의 필기 상자로 유도를 따라가고, 증명 페이지에서 같은 논리를 처음부터 다시 쓴 뒤, 증명형 서술 문제로 스스로 재현해 보세요.',
      howLearn: '강의 순서대로 정의·정리·유도를 정리했습니다. 필기로 푸신 증명은 빠진 단계까지 채웠고, 증명 {proofs}개는 따로 검색할 수 있습니다.',
      howPractice: '객관식·단답형은 바로 채점되고, 증명형 서술 문제는 모범 답안과 채점 기준을 보고 스스로 채점합니다. 단답형은 35/69, 1/(1+e^(-2)), ln(2)처럼 식으로 입력합니다.',
      catLede: '그림은 단원을 대표하는 곡선입니다. 회귀선의 회전, 베타 사후분포, 이진 엔트로피, 릿지 적합, 시그모이드, 마진, 활성화 함수, 계산 그래프, SGD 경로, 초기화, 학습률 스케줄, 하강 보조정리의 이차 상한, 나쁜 조건수에서의 모멘텀 경로, 합성곱(이동 평균), ImageNet 오류율, 가파른 시그모이드의 계단 근사, 무작위 N항 평균의 오차와 B²/N, 야코비안 곱의 폭발과 소실, LSTM 셀 경로가 지키는 기울기를 그렸습니다.',
      examLede: '1–5주차 범위의 시간 제한 시험입니다. Problem Set 1과 같은 유형의 증명 모의고사도 있습니다. 유도·증명 문항은 채점 기준을 보고 직접 채점합니다.',
      proofLede: '강의에 나온 정리와 유도 {proofs}개의 증명을 모았습니다. ‘강의 필기’ 표시는 교수님이 수업 중에 손으로 풀어 주신 증명이고, ‘판서에 없는 증명’은 슬라이드에 결과만 나오거나 수업에서 증명하지 않은 공식을 시험 대비로 증명한 것입니다. 공식 이름이나 영어 용어로 검색할 수 있습니다. 예: KL, Jensen, descent lemma, Xavier, push-through.',
      proofPlaceholder: '찾을 정리나 유도 (예: 정규방정식, Hessian, dual)',
      quizNav: '퀴즈풀이',
      quizLede: '수업에서 받은 Problem Set 1의 네 문제와 Quiz 1(9월 30일)의 두 문제를 문제 → **핵심 포인트** → 풀이 → 자주 하는 실수 순서로 정리했습니다. 시험이 이 유형으로 나오므로, 핵심 포인트를 읽고 직접 답안을 써 본 뒤 풀이를 펼쳐 비교하세요. 문제마다 위에는 개념이 있는 단원으로, 아래에는 같은 유형의 연습문제로 가는 링크가 있고, 맨 아래에 단원별 퀴즈 대비 연습문제를 모았습니다. 9주차 수요일 필기의 두 단계 RNN 기울기 유도 옆에 ‘Quiz 2 (11/04)’ 표시가 있어, 19단원에 같은 유형의 퀴즈 대비 문제를 따로 마련했습니다.',
    },
    // English for the prose above (bilingual): the Korean stays behind the KO toggle
    textEn: {
      howTitle: 'Follow the proofs, solve, and check yourself as in an exam',
      howLede: 'In this course, derivations and proofs are the exam problems. Follow the derivations with the class-notes boxes in the concept summaries, rewrite the same logic from scratch on the proof pages, and reproduce it yourself with the proof-type written problems.',
      howLearn: 'Definitions, theorems, and derivations are organized in lecture order. Proofs worked out by hand in class are completed down to the missing steps, and the {proofs} proofs can be searched separately.',
      howPractice: 'Multiple-choice and short-answer problems are graded immediately; proof-type written problems are self-graded against a model answer and a rubric. Enter short answers as expressions, such as 35/69, 1/(1+e^(-2)), ln(2).',
      howExam: 'Check your exam readiness with {exams} timed mock exams and custom mock exams drawn from the units you choose.',
      catLede: 'Each figure is a curve that represents its unit: the rotation of a regression line, a beta posterior, the binary entropy, a ridge fit, the sigmoid, the margin, activation functions, a computational graph, SGD paths, initialization, learning rate schedules, the quadratic upper bound of the descent lemma, momentum paths under a bad condition number, convolution as a moving average, the ImageNet error, a staircase of steep sigmoids, the error of random N-term averages against B²/N, products of Jacobians that explode or vanish, and the gradient kept by the LSTM cell path.',
      examLede: 'Timed exams covering Weeks 1–5, including a proof mock exam of the same type as Problem Set 1. Derivation and proof problems are self-graded with the rubric.',
      examsPageLede: 'There are {exams} mock exams matched to the exam range, plus custom mock exams. Once you start, the timer runs, and your answers are submitted automatically when time is up. Written problems are self-graded after submission, using the model solution and the rubric.',
      proofLede: 'The proofs of the {proofs} theorems and derivations from the lectures. The “lecture notes” mark indicates proofs the professor worked out by hand in class; “판서에 없는 증명” (not in the lecture notes) marks formulas the slides only state or the class did not prove, proved here for the exam. Search by formula name or English term, e.g., KL, Jensen, descent lemma, Xavier, push-through.',
      quizLede: 'The four problems of Problem Set 1 and the two problems of Quiz 1 (Sep. 30) from class, arranged as problem → **key points** → solution → common mistakes. The exam comes in this format, so read the key points, write your own answer, and then open the solution to compare. Each problem links above to the units with the concepts and below to practice problems of the same type, and the quiz-prep practice problems by unit are collected at the bottom. The two-step RNN gradient derivation in the Week 9 Wednesday notes is marked “Quiz 2 (11/04)”, so Unit 19 has its own quiz-prep problems of that type.',
    },
    // 같은 네트워크의 분야(공학수학·의료 인공지능·기초 수학)로 가는 링크는 core/net.js와 net-index.js가 풀어 줍니다.
  };
})();
