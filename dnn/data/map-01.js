/* 논리 지도 — 01 선형회귀와 정규방정식. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다.
   한국어(t·d·easy)와 영어(en·dEn·easyEn)를 함께 적습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 1,
    easy: R`
이 단원은 질문 하나로 시작합니다. 점들이 평면에 흩어져 있을 때, 그 점들을 가장 잘 대표하는 직선은 어느 것일까요?

먼저 ‘가장 잘’을 숫자로 바꿉니다. 각 점이 직선에서 세로로 얼마나 떨어져 있는지(잔차)를 제곱해서 모두 더한 값, 곧 **제곱오차합**이 작을수록 좋은 직선이라고 정합니다. 그러면 질문은 ‘이 값을 가장 작게 만드는 계수 $\beta$는 무엇인가’라는 최소화 문제가 됩니다.

제곱오차합은 그릇 모양이라, 바닥에서는 어느 방향으로도 기울기가 0입니다. 벡터 미분 공식 두 개로 기울기를 계산해 0으로 두면 **정규방정식** $X^TX\beta=X^Ty$가 나오고, 이 방정식을 풀면 가장 좋은 직선이 한 번에 나옵니다. 그 해가 언제 존재하고 왜 정말 최소인지 확인하고, 그림으로는 ‘$y$를 평면에 수직으로 내린 발(정사영)’이라는 것도 봅니다.

마지막으로 같은 바닥을 다른 길로 찾습니다. 방정식을 한 번에 푸는 대신 기울기 반대 방향으로 조금씩 내려가는 **경사하강법**입니다. 걸음(학습률)이 너무 크면 발산한다는 한계까지 보고 나면, 뒤의 단원들이 왜 SGD·모멘텀·Adam으로 나아가는지가 보입니다.`,
    easyEn: R`
This unit starts from a single question. When points are scattered on a plane, which line represents them best?

First we turn “best” into a number. Square how far each point lies above or below the line (its residual) and add these up; the smaller this **sum of squared errors**, the better the line. The question then becomes a minimization problem: which coefficients $\beta$ make this number as small as possible?

The sum of squared errors is bowl-shaped, and at the bottom of a bowl the slope is zero in every direction. Computing the gradient with two vector-derivative formulas and setting it to zero gives the **normal equations** $X^TX\beta=X^Ty$, and solving them produces the best line in one shot. We then check when this solution exists and why it really is the minimum, and see it as a picture: the fitted values are the foot of the perpendicular dropped from $y$ onto a plane (an orthogonal projection).

Finally we reach the same bottom by another road. Instead of solving the equations at once, **gradient descent** walks downhill a little at a time, against the gradient. Once we see its limit (a step, the learning rate, that is too large makes it diverge), it becomes clear why later units move on to SGD, momentum, and Adam.`,
    nodes: [
      { id: 'model', role: 'def', k: '1.1', t: R`선형모델 $y=X\beta+\varepsilon$`, en: R`Linear model $y=X\beta+\varepsilon$`,
        d: R`자료 $n$개의 식을 행렬 한 줄로 모읍니다. 찾을 것은 계수 벡터 $\beta$이고, 설계행렬 $X$의 첫 열 1은 절편을 위한 것입니다.`,
        dEn: R`Collect the $n$ data equations into one matrix equation. The unknown is the coefficient vector $\beta$; the first column of ones in the design matrix $X$ carries the intercept.` },
      { id: 'sse', role: 'def', k: '1.1', at: '### 점수 매기기', t: R`점수: 제곱오차합 $f(\beta)$`, en: R`Score: sum of squared errors $f(\beta)$`,
        d: R`‘가장 잘 맞는다’를 ‘$f(\beta)=\lVert y-X\beta\rVert^2$이 가장 작다’로 정합니다. 이제 문제는 함수 하나의 최소화입니다.`,
        dEn: R`“Fits best” is defined as “$f(\beta)=\lVert y-X\beta\rVert^2$ is smallest”. The problem is now the minimization of a single function.` },
      { id: 'grad', role: 'tool', k: '1.2', t: R`벡터 미분 공식`, en: R`Vector derivative formulas`,
        d: R`여러 변수 함수의 바닥에서는 기울기가 0입니다. 그 기울기를 계산할 두 공식 $\nabla_\beta(\beta^Tm)=m$, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$를 준비합니다.`,
        dEn: R`At the bottom of a function of several variables the gradient vanishes. We prepare the two formulas that compute it: $\nabla_\beta(\beta^Tm)=m$ and $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$.` },
      { id: 'normal', role: 'res', k: '1.3', t: R`정규방정식 $X^TX\beta=X^Ty$`, en: R`Normal equations $X^TX\beta=X^Ty$`,
        d: R`$f$를 전개하고 두 공식으로 미분해 0으로 두면 나오는, 이 단원의 중심 결과입니다. $X^TX$가 가역이면 $\hat\beta=(X^TX)^{-1}X^Ty$.`,
        dEn: R`Expand $f$, differentiate it with the two formulas, and set the result to zero: this is the central result of the unit. If $X^TX$ is invertible, $\hat\beta=(X^TX)^{-1}X^Ty$.` },
      { id: 'check', role: 'check', k: '1.3', at: '### 두 가지 확인', t: R`해가 있고, 최소인가`, en: R`Does it exist, is it a minimum?`,
        d: R`$X^TX$가 가역 $\iff$ $X$의 열이 일차독립. 헤시안 $2X^TX\succeq0$이라 $f$가 볼록하므로, 기울기가 0인 점은 전역 최솟점입니다.`,
        dEn: R`$X^TX$ is invertible $\iff$ the columns of $X$ are linearly independent. The Hessian $2X^TX\succeq0$ makes $f$ convex, so a point where the gradient vanishes is a global minimizer.` },
      { id: 'proj', role: 'idea', k: '1.3', at: '### 기하학적 의미', t: R`정사영으로 보기`, en: R`The projection picture`,
        d: R`정규방정식은 ‘잔차가 $X$의 모든 열과 직교한다’는 뜻입니다. $\hat y$는 $y$를 열공간에 수직으로 내린 발이고, 피타고라스 정리만으로도 최소임이 보입니다.`,
        dEn: R`The normal equations say that the residual is orthogonal to every column of $X$. $\hat y$ is the foot of the perpendicular from $y$ to the column space, and the Pythagorean theorem alone shows that it is the minimum.` },
      { id: 'ml', role: 'view', k: '1.4', t: R`머신러닝 관점`, en: R`The machine-learning view`,
        d: R`모델·손실·학습의 세 요소로 다시 읽습니다. 손실은 그릇 모양이고, 바닥을 찾는 길은 둘입니다: 한 번에 푸는 정규방정식과 조금씩 내려가는 경사하강법.`,
        dEn: R`Read the same story as model, loss, and training. The loss is bowl-shaped, and there are two roads to its bottom: the normal equations in one shot, or gradient descent step by step.` },
      { id: 'gd', role: 'alt', k: '1.5', t: R`경사하강법`, en: R`Gradient descent`,
        d: R`역행렬 없이 기울기 $-2X^T(y-X\beta)$의 반대 방향으로 한 걸음씩 갑니다. 모델이 선형이 아니어도 그대로 통해 신경망 학습의 기본이 됩니다.`,
        dEn: R`Without any inverse, step against the gradient $-2X^T(y-X\beta)$ again and again. It works even when the model is not linear, which makes it the basis of training neural networks.` },
      { id: 'lim', role: 'lim', k: '1.5', at: '### 학습률의 한계', t: R`학습률의 한계`, en: R`The limit on the learning rate`,
        d: R`$\alpha<2/\lambda_{\max}(X^TX)$를 넘으면 발산하고, 조건수가 크면 느립니다. 이 약점이 10단원(SGD)과 14단원(모멘텀·Adam)으로 이어집니다.`,
        dEn: R`Beyond $\alpha<2/\lambda_{\max}(X^TX)$ it diverges, and with a large condition number it is slow. These weaknesses lead to Unit 10 (SGD) and Unit 14 (momentum, Adam).` },
    ],
    rows: [['model'], ['sse', 'grad'], ['normal'], ['check', 'proj', 'ml'], [null, null, 'gd'], [null, null, 'lim']],
    edges: [
      ['model', 'sse', R`‘가장 잘’을 점수로`, R`“best” as a score`],
      ['sse', 'normal', R`기울기를 0으로`, R`set the gradient to 0`],
      ['grad', 'normal', R`두 공식 대입`, R`plug in both formulas`],
      ['normal', 'check', R`정말 최소인가?`, R`truly a minimum?`],
      ['normal', 'proj', R`그림으로 보면`, R`as a picture`],
      ['normal', 'ml', R`머신러닝 말로`, R`in ML terms`],
      ['ml', 'gd', R`한 번에 대신 조금씩`, R`step by step instead`],
      ['gd', 'lim', R`걸음이 크면?`, R`steps too big?`],
    ],
  });
})();
