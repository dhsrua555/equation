/* 논리 지도 — 06 소프트맥스 회귀. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 6,
    easy: R`
앞 단원의 로지스틱 회귀는 답이 둘인 문제만 다뤘습니다. 이 단원의 질문은 붓꽃 세 품종이나 숫자 0–9처럼 답이 **셋 이상**일 때, 각 클래스에 확률을 어떻게 나눠 줄 것인가입니다.

방법은 심사위원이 후보마다 점수를 매기는 것과 같습니다. 클래스마다 가중치 $w_k$를 두어 점수 $z_k=w_k^Tx$를 매기고, **소프트맥스**(softmax) $p_k=e^{z_k}/\sum_je^{z_j}$로 점수를 확률로 바꿉니다. 지수함수로 모두 양수로 만든 뒤 합으로 나누어 합이 1이 되게 하는 것입니다. 점수가 1 높으면 확률은 $e\approx2.7$배이고, 모든 점수에 같은 수를 더해도 확률은 그대로라 점수의 **차이**만 중요합니다. 클래스가 둘이면 정확히 로지스틱 회귀로 돌아갑니다.

학습은 로지스틱과 같은 길을 갑니다. 정답을 **원-핫**(one-hot) 벡터로 쓰면 가능도에 정답 클래스의 확률만 남고, $-\log$를 취하면 **교차 엔트로피**(cross-entropy) 손실이 됩니다. 몫의 미분과 연쇄법칙으로 기울기를 구하면 다시 “(예측 확률 − 원-핫 정답) × 입력”, 곧 $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$입니다. 역전파에서 “소프트맥스 + 교차 엔트로피” 층의 기울기가 $p-y$인 이유가 여기에 있습니다.

손실은 볼록이라 경사하강법이 전역 최솟값으로 갑니다. 다만 모든 클래스의 가중치를 같이 옮겨도 확률이 같아서 평평한 방향이 남고, 규제 없이는 최소점이 하나로 정해지지 않습니다. 또 점수가 크면 $e^{1000}$처럼 넘치므로 가장 큰 점수를 빼고 계산합니다. 소프트맥스는 “가장 큰 점수 고르기(argmax)”를 부드럽게 만든 것이라, 어텐션의 가중치도 이 함수로 만듭니다.`,
    easyEn: R`
Logistic regression in the previous unit handled only questions with two answers. This unit asks how to share out probabilities among the classes when there are **three or more** answers, such as three species of iris or the digits 0–9.

It works like judges scoring candidates. Each class gets its own weights $w_k$ and a score $z_k=w_k^Tx$, and the **softmax** $p_k=e^{z_k}/\sum_je^{z_j}$ turns the scores into probabilities: the exponential makes every score positive, and dividing by the sum makes them add up to 1. A score higher by 1 means a probability $e\approx2.7$ times larger, and adding the same number to every score leaves the probabilities unchanged, so only the **differences** between scores matter. With two classes we are back exactly at logistic regression.

Training follows the same road as in logistic regression. Writing the true label as a **one-hot** vector leaves only the probability of the true class in the likelihood, and taking $-\log$ gives the **cross-entropy** loss. Computing the gradient with the quotient rule and the chain rule gives once again “(predicted probabilities − one-hot label) × input”, that is, $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$. This is why a “softmax + cross-entropy” layer passes the gradient $p-y$ back in backpropagation.

The loss is convex, so gradient descent heads for the global minimum. But moving the weights of all classes together leaves the probabilities unchanged, so a flat direction remains, and without regularization the minimizer is not unique. Large scores also overflow, as $e^{1000}$ does, so we subtract the largest score before computing. Softmax is a smoothed version of “pick the largest score” (argmax), and attention weights are made with this same function.`,
    nodes: [
      { id: 'scores', role: 'def', k: '6.1', t: R`클래스마다 점수 $z=Wx$`, en: R`A score per class, $z=Wx$`,
        d: R`클래스 $C$개마다 가중치 $w_k$를 두고 점수 $z_k=w_k^Tx$를 매깁니다. 로지스틱 회귀의 점수 하나를 $C$개로 늘린 것으로, 행렬곱 한 번입니다.`,
        dEn: R`Give each of the $C$ classes a weight vector $w_k$ and a score $z_k=w_k^Tx$. This extends the single score of logistic regression to $C$ scores, computed by one matrix product.` },
      { id: 'softmax', role: 'def', k: '6.1', at: ':::key 소프트맥스 함수', t: R`소프트맥스: 점수 → 확률`, en: R`Softmax: scores → probabilities`,
        d: R`지수 $e^{z_k}$로 모두 양수로 만들고 합으로 나눠 합이 1인 확률 $p_k$로 바꿉니다. 점수가 1 높으면 확률은 $e$배입니다.`,
        dEn: R`Make every score positive with $e^{z_k}$ and divide by the sum to get probabilities $p_k$ that add up to 1. A score higher by 1 means a probability $e$ times larger.` },
      { id: 'diff', role: 'view', k: '6.1', at: '**상수를 더해도 같은 이유.**', t: R`차이만 중요, $C=2$면 로지스틱`, en: R`Shift invariance; $C=2$ is logistic`,
        d: R`모든 점수에 같은 상수를 더해도 확률은 그대로입니다. 그래서 $C=2$이면 $w_1-w_2$ 하나만 남아 5단원의 로지스틱 회귀가 됩니다.`,
        dEn: R`Adding the same constant to every score leaves the probabilities unchanged. So for $C=2$ only $w_1-w_2$ matters, and we are back at the logistic regression of Unit 5.` },
      { id: 'ce', role: 'step', k: '6.2', t: R`원-핫 → 교차 엔트로피`, en: R`One-hot → cross-entropy`,
        d: R`정답을 원-핫으로 쓰면 가능도에 정답 클래스의 확률만 남습니다. $-\log$를 취하면 손실 $J=-\sum_i\sum_ky_{ik}\log p_k(x_i)$, 곧 교차 엔트로피입니다.`,
        dEn: R`Writing labels one-hot leaves only the probability of the true class in the likelihood. Taking $-\log$ gives the loss $J=-\sum_i\sum_ky_{ik}\log p_k(x_i)$, the cross-entropy.` },
      { id: 'grad', role: 'res', k: '6.3', t: R`기울기 $(p-y)x^T$`, en: R`Gradient $(p-y)x^T$`,
        d: R`몫의 미분으로 $\partial p_k/\partial z_m=p_k(\delta_{km}-p_m)$, 연쇄법칙과 $\sum_ky_{ik}=1$로 $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$. 로지스틱과 같은 “(예측 − 정답) × 입력”입니다.`,
        dEn: R`The quotient rule gives $\partial p_k/\partial z_m=p_k(\delta_{km}-p_m)$; the chain rule and $\sum_ky_{ik}=1$ then give $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$, the same “(prediction − label) × input” as in logistic regression.` },
      { id: 'jac', role: 'view', k: '6.3', at: '**야코비안으로 한 번에.**', t: R`야코비안으로 한 번에`, en: R`All at once with the Jacobian`,
        d: R`$\partial p/\partial z=\diag(p)-pp^T$를 쓰면 $\nabla_z\ell=p-y$가 한 줄에 나옵니다. 역전파에서 “소프트맥스 + 교차 엔트로피” 층의 기울기가 $p-y$인 이유입니다.`,
        dEn: R`With $\partial p/\partial z=\diag(p)-pp^T$, the result $\nabla_z\ell=p-y$ comes out in one line. This is why a “softmax + cross-entropy” layer passes back $p-y$ in backpropagation.` },
      { id: 'cvx', role: 'check', k: '6.4', t: R`볼록: 헤시안 $\succeq0$`, en: R`Convex: Hessian $\succeq0$`,
        d: R`한 표본 손실의 $z$에 대한 헤시안 $\diag(p)-pp^T$는 양의 준정부호이고, $z$가 $W$의 선형함수라 $J$는 볼록합니다. 경사하강법이 전역 최솟값으로 갑니다.`,
        dEn: R`The Hessian of one sample’s loss with respect to $z$, $\diag(p)-pp^T$, is positive semidefinite, and $z$ is linear in $W$, so $J$ is convex. Gradient descent heads for the global minimum.` },
      { id: 'flat', role: 'lim', k: '6.4', at: '**헤시안 식의 뜻.**', t: R`평평한 방향 → 규제`, en: R`A flat direction → regularize`,
        d: R`$v^T(\diag(p)-pp^T)v$는 분산이라 $v=c\mathbf 1$이면 0 — 모든 점수를 같이 올리는 평행이동 방향입니다. 그래서 최소점이 유일하지 않고, 규제가 그 방향을 막습니다.`,
        dEn: R`$v^T(\diag(p)-pp^T)v$ is a variance, which is 0 for $v=c\mathbf 1$: the shift that raises all scores together. So the minimizer is not unique, and regularization blocks that direction.` },
      { id: 'lse', role: 'view', k: '6.4', at: '### 더 깊이: 로그-합-지수는', t: R`LSE = 부드러운 최댓값`, en: R`LSE is a soft maximum`,
        d: R`$\max_jz_j\le\log\sum_je^{z_j}\le\max_jz_j+\log C$이고 LSE의 기울기가 바로 소프트맥스입니다. 소프트맥스는 argmax를 부드럽게 만든 것으로, 어텐션 가중치도 이것으로 만듭니다.`,
        dEn: R`$\max_jz_j\le\log\sum_je^{z_j}\le\max_jz_j+\log C$, and the gradient of LSE is exactly the softmax. Softmax is a smoothed argmax, and attention weights are made with it too.` },
    ],
    rows: [['scores'], ['softmax'], ['diff', 'ce'], ['grad'], ['jac', 'cvx'], ['flat', 'lse']],
    edges: [
      ['scores', 'softmax', R`합이 1인 확률로`, R`into probabilities`],
      ['softmax', 'diff', R`상수를 더하면?`, R`add a constant?`],
      ['softmax', 'ce', R`$W$를 배우려면`, R`to learn $W$`],
      ['ce', 'grad', R`몫의 미분 + 연쇄법칙`, R`quotient + chain rule`],
      ['grad', 'jac', R`한 번에 보면`, R`all at once`],
      ['grad', 'cvx', R`한 번 더 미분`, R`differentiate again`],
      ['cvx', 'flat', R`평평한 방향?`, R`flat direction?`],
      ['cvx', 'lse', R`LSE로 보면`, R`as LSE`],
    ],
  });
})();
