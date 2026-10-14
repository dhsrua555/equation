/* 논리 지도 — 05 로지스틱 회귀. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 5,
    easy: R`
이 단원의 질문은 “이 메일은 스팸인가?”처럼 답이 예/아니오 둘뿐인 문제에서, 답을 **확률**로 내놓는 방법입니다. “스팸일 확률 0.9”라고 말할 수 있으면 답뿐 아니라 얼마나 확신하는지도 알 수 있습니다.

핵심 아이디어는 확률을 실수 전체로 펼치는 것입니다. 확률 $p$는 0과 1 사이에 갇혀 있지만, **오즈**(odds) $p/(1-p)$는 0부터 무한대까지, 거기에 로그를 씌운 **로그 오즈**는 음의 무한대부터 무한대까지 갑니다. 그래서 로그 오즈를 특성들의 가중합 $w^Tx$로 두고 거꾸로 풀면 모델 $p=\sigma(w^Tx)$가 나옵니다. **시그모이드** $\sigma$는 아무 점수나 받아 0과 1 사이의 확률로 눌러 주는 S자 함수입니다.

가중치 $w$는 실제 정답에 높은 확률을 주도록 고릅니다(최대가능도). 정답에 준 확률들의 곱에 $-\log$를 씌우면 손실, 곧 **이진 교차 엔트로피**(binary cross-entropy)가 되고, 그 기울기는 놀랄 만큼 단순한 $\sum_i(\sigma(w^Tx_i)-y_i)x_i$, 곧 “(예측 − 정답) × 입력”입니다. 다만 선형회귀와 달리 기울기를 0으로 두고 한 번에 푸는 공식이 없어서, 경사하강법으로 조금씩 내려갑니다.

그렇게 내려가도 괜찮을까요? 기울기를 한 번 더 미분한 헤시안이 양의 준정부호라서 손실은 **볼록**(그릇 하나 모양)이고, 경사하강법이 국소 최소에 갇히지 않습니다. 단, 자료가 초평면으로 완벽히 나뉘면 바닥이 무한히 멀어 가중치가 끝없이 커지므로 규제를 더해 막습니다. 로지스틱 회귀는 시그모이드 하나를 가진 뉴런 하나라서, 신경망의 가장 작은 부품이기도 합니다.`,
    easyEn: R`
This unit asks how to answer a yes-or-no question, such as “is this email spam?”, with a **probability**. If we can say “spam with probability 0.9”, we learn not only the answer but also how sure we are.

The key idea is to stretch a probability over the whole real line. A probability $p$ is trapped between 0 and 1, but the **odds** $p/(1-p)$ run from 0 to infinity, and their logarithm, the **log-odds**, runs from minus infinity to infinity. So we set the log-odds equal to a weighted sum of the features, $w^Tx$, and solving back gives the model $p=\sigma(w^Tx)$. The **sigmoid** $\sigma$ is an S-shaped function that takes any score and squeezes it into a probability between 0 and 1.

The weights $w$ are chosen so that the true labels receive high probability (maximum likelihood). Putting $-\log$ on the product of the probabilities given to the true labels yields the loss, the **binary cross-entropy**, and its gradient is surprisingly simple: $\sum_i(\sigma(w^Tx_i)-y_i)x_i$, that is, “(prediction − label) × input”. Unlike linear regression, though, there is no formula that solves gradient $=0$ in one shot, so we walk downhill step by step with gradient descent.

Is walking downhill safe? Differentiating the gradient once more gives a Hessian that is positive semidefinite, so the loss is **convex** (a single bowl) and gradient descent cannot get stuck in a local minimum. One catch: if a hyperplane separates the data perfectly, the bottom lies infinitely far away and the weights grow without end, so we add regularization to stop it. Logistic regression is a single neuron with one sigmoid, which makes it the smallest building block of a neural network.`,
    nodes: [
      { id: 'odds', role: 'def', k: '5.1', t: R`확률 → 오즈 → 로그 오즈`, en: R`Probability → odds → log-odds`,
        d: R`확률 $p\in[0,1]$를 오즈 $p/(1-p)\in[0,\infty)$로, 다시 로그를 씌워 실수 전체로 펼칩니다. 실수 전체를 쓰는 선형식과 짝지을 준비입니다.`,
        dEn: R`Stretch the probability $p\in[0,1]$ into the odds $p/(1-p)\in[0,\infty)$, then take the log to cover the whole real line. This prepares a partner for a linear expression, which also ranges over all reals.` },
      { id: 'sig', role: 'tool', k: '5.1', at: ':::def 로짓과 로지스틱', t: R`시그모이드 $\sigma(z)$`, en: R`The sigmoid $\sigma(z)$`,
        d: R`로짓의 역함수로, 아무 실수나 $(0,1)$의 확률로 되돌립니다. 성질 $\sigma'=\sigma(1-\sigma)$는 뒤의 기울기·헤시안 계산에 그대로 쓰입니다.`,
        dEn: R`The inverse of the logit: it turns any real number back into a probability in $(0,1)$. Its property $\sigma'=\sigma(1-\sigma)$ is used directly in the gradient and the Hessian later on.` },
      { id: 'model', role: 'def', k: '5.2', t: R`모델 $p=\sigma(w^Tx)$`, en: R`Model $p=\sigma(w^Tx)$`,
        d: R`레이블 1의 로그 오즈를 선형식 $w^Tx$로 두고 시그모이드로 거꾸로 풀면 확률이 나옵니다. 남은 일은 자료에서 $w$를 배우는 것입니다.`,
        dEn: R`Set the log-odds of label 1 equal to the linear expression $w^Tx$ and undo the log-odds with the sigmoid to get a probability. What remains is to learn $w$ from the data.` },
      { id: 'bound', role: 'idea', k: '5.2', at: '**결정 경계.**', t: R`결정 경계 $w^Tx=0$`, en: R`Decision boundary $w^Tx=0$`,
        d: R`$p=\frac12$인 곳은 초평면 $w^Tx=0$이고, 확률이 같은 점들도 그와 평행한 초평면에 놓입니다. $x_j$가 1 늘면 오즈는 $e^{w_j}$배입니다.`,
        dEn: R`The set where $p=\frac12$ is the hyperplane $w^Tx=0$, and points of equal probability lie on hyperplanes parallel to it. Raising $x_j$ by 1 multiplies the odds by $e^{w_j}$.` },
      { id: 'nll', role: 'step', k: '5.3', t: R`가능도 → 교차 엔트로피`, en: R`Likelihood → cross-entropy`,
        d: R`정답에 준 확률을 모두 곱한 가능도를 최대화합니다. $-\log$를 씌우면 최소화할 손실, 이진 교차 엔트로피가 됩니다.`,
        dEn: R`Maximize the likelihood, the product of the probabilities given to the true labels. Taking $-\log$ turns it into a loss to minimize: the binary cross-entropy.` },
      { id: 'grad', role: 'res', k: '5.4', t: R`기울기 $\sum_i(\sigma(z_i)-y_i)x_i$`, en: R`Gradient $\sum_i(\sigma(z_i)-y_i)x_i$`,
        d: R`연쇄법칙으로 미분하면 $\sigma'$이 약분되어 “(예측 − 정답) × 입력”만 남습니다. 선형회귀의 기울기와 같은 모양이고, 경사하강법의 한 걸음이 됩니다.`,
        dEn: R`Differentiating with the chain rule, $\sigma'$ cancels and only “(prediction − label) × input” remains. It has the same shape as the linear-regression gradient and drives each step of gradient descent.` },
      { id: 'nocf', role: 'lim', k: '5.4', at: ':::warn 닫힌 해가 없습니다', t: R`닫힌 해가 없다`, en: R`No closed-form solution`,
        d: R`기울기 $=0$은 $w$에 대한 비선형 방정식이라 한 번에 푸는 공식이 없고, 경사하강법(또는 뉴턴법)으로 내려갑니다. 그 길이 정말 바닥에 닿는지가 5.5절의 물음입니다.`,
        dEn: R`Gradient $=0$ is a nonlinear equation in $w$ with no one-shot formula, so we walk down with gradient descent (or Newton’s method). Whether that walk really reaches the bottom is the question of Section 5.5.` },
      { id: 'convex', role: 'res', k: '5.5', t: R`헤시안 $X^TSX\succeq0$: 볼록`, en: R`Hessian $X^TSX\succeq0$: convex`,
        d: R`기울기를 한 번 더 미분하면 $X^TSX$이고 $v^TX^TSXv=\sum_is_i(x_i^Tv)^2\ge0$. 손실이 그릇 하나 모양(볼록)이라 경사하강법이 국소 최소에 갇히지 않습니다.`,
        dEn: R`Differentiating the gradient once more gives $X^TSX$, and $v^TX^TSXv=\sum_is_i(x_i^Tv)^2\ge0$. The loss is a single bowl (convex), so gradient descent cannot get stuck in a local minimum.` },
      { id: 'sep', role: 'lim', k: '5.5', at: ':::warn 선형 분리 가능한 자료', t: R`분리 가능하면 해가 없다`, en: R`Separable data: no finite optimum`,
        d: R`자료가 초평면으로 완벽히 나뉘면 $\lVert w\rVert\to\infty$로 손실이 0에 다가가기만 합니다. 규제 $\frac\lambda2\lVert w\rVert^2$을 더하면 해가 유일해집니다.`,
        dEn: R`If a hyperplane separates the data perfectly, the loss only approaches 0 as $\lVert w\rVert\to\infty$. Adding the regularizer $\frac\lambda2\lVert w\rVert^2$ makes the solution unique.` },
    ],
    rows: [['odds', 'sig'], ['model'], ['bound', 'nll'], ['grad'], ['nocf', 'convex'], [null, 'sep']],
    edges: [
      ['odds', 'model', R`로그 오즈 = 선형식`, R`log-odds = linear`],
      ['sig', 'model', R`거꾸로 풀기`, R`solve back`],
      ['model', 'bound', R`경계는 어디?`, R`where is the boundary?`],
      ['model', 'nll', R`$w$를 배우려면`, R`to learn $w$`],
      ['nll', 'grad', R`연쇄법칙으로 미분`, R`chain rule`],
      ['grad', 'nocf', R`0으로 풀면?`, R`solve for zero?`],
      ['grad', 'convex', R`한 번 더 미분`, R`differentiate again`],
      ['convex', 'sep', R`바닥이 없을 때`, R`if no bottom exists`],
    ],
  });
})();
