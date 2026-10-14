/* 논리 지도 — 04 확률적 회귀, 규제, 커널. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 형식은 map-01.js와 같습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 4,
    easy: R`
1단원에서는 ‘제곱오차가 작을수록 좋은 직선’이라고 그냥 정했습니다. 이 단원은 먼저 그 선택의 이유를 확률로 밝힙니다. 측정값이 참값에 종 모양(정규분포)의 잡음이 더해진 것이라고 가정하면, 자료를 가장 그럴듯하게 만드는 직선이 바로 제곱오차를 가장 작게 하는 직선입니다. 곧 **최소제곱 = 최대가능도**입니다.

특성을 $x,x^2,\dots,x^M$으로 늘린 **다항회귀**도 계수에 대해서는 선형이라 같은 방법으로 풉니다. 그런데 차수가 너무 높으면 곡선이 점들을 잡음까지 그대로 외워, 훈련 자료에는 완벽하지만 점 사이에서는 크게 출렁입니다. 이것이 **과적합**(overfitting)이고, 우리가 원하는 것은 새 자료에서의 성능(일반화)입니다.

처방은 **규제**, 곧 계수가 커지면 벌점을 주는 것입니다. 제곱 벌점을 주는 **릿지**(ridge)의 해 $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$는 언제나 하나로 정해지고, 2단원의 말로는 ‘계수는 0 근처일 것’이라는 가우시안 사전분포의 MAP입니다. 절댓값 벌점을 주는 **라쏘**(lasso)는 일부 계수를 정확히 0으로 만듭니다.

마지막은 더 휜 모델입니다. 점을 고차원 특성으로 올리면 직선으로 못 가르던 것도 가를 수 있지만, 차원이 너무 크면 계산할 수 없습니다. **커널 트릭**은 계산에 두 점의 내적, 곧 유사도 $K(x,z)$만 필요하다는 점을 이용해 고차원 좌표를 만들지 않습니다. 릿지를 특성공간에서 풀고 **푸시스루 항등식**으로 역행렬을 자료 수 크기로 바꾸면, 예측은 ‘새 점이 각 훈련점과 얼마나 비슷한가’의 가중합 $f^*(x)=K(x,X)(\lambda I+K)^{-1}y$가 됩니다. 다만 자료가 수백만 개면 이 $n\times n$ 행렬도 감당하기 어려워, 특성 자체를 학습하는 신경망이 쓰이게 됩니다.`,
    easyEn: R`
In Unit 1 we simply declared that the line with the smallest squared error is best. This unit first gives the reason in terms of probability. If each measurement is the true value plus bell-shaped (normal) noise, the line that makes the data most plausible is exactly the line with the smallest squared error: **least squares = maximum likelihood**.

**Polynomial regression**, which extends the features to $x,x^2,\dots,x^M$, is still linear in its coefficients and is solved the same way. But if the degree is too high, the curve memorizes the points noise and all: it is perfect on the training data yet swings wildly between the points. This is **overfitting**; what we want is performance on new data (generalization).

The remedy is **regularization**: a penalty on large coefficients. The solution of **ridge** regression, which uses a squared penalty, $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$, is always unique, and in the language of Unit 2 it is the MAP under a Gaussian prior saying “the coefficients are probably near 0”. The **lasso**, which uses an absolute-value penalty, sets some coefficients exactly to 0.

Last come more flexible, curved models. Lifting points to high-dimensional features can separate what no straight line could, but when the dimension is too large the computation becomes impossible. The **kernel trick** uses the fact that only inner products of two points, their similarity $K(x,z)$, are needed, so the high-dimensional coordinates are never built. Solving ridge in the feature space and using the **push-through identity** to shrink the inverse to the size of the data set, the prediction becomes a weighted sum of how similar the new point is to each training point: $f^*(x)=K(x,X)(\lambda I+K)^{-1}y$. With millions of data points even this $n\times n$ matrix is too large, which is why neural networks, which learn the features themselves, came into use.`,
    nodes: [
      { id: 'lse', role: 'view', k: '4.1', t: R`최소제곱 = 가우시안 MLE`, en: R`Least squares = Gaussian MLE`,
        d: R`잡음을 $\N(0,\sigma^2)$로 가정하면 로그가능도가 $-f(\beta)/(2\sigma^2)+$상수라, 가능도 최대 = 제곱오차 최소입니다. 1단원의 손실이 확률로 정당화됩니다.`,
        dEn: R`Assuming noise $\N(0,\sigma^2)$, the log-likelihood is $-f(\beta)/(2\sigma^2)+$const, so maximizing the likelihood = minimizing the squared error. The loss of Unit 1 is justified by probability.` },
      { id: 'overfit', role: 'lim', k: '4.2', t: R`다항회귀와 과적합`, en: R`Polynomial regression overfits`,
        d: R`특성을 $1,x,\dots,x^M$으로 늘려도 $\beta$에 대해 선형이라 같은 식으로 풉니다. 그러나 $M=9$이면 점 10개를 정확히 지나며 점 사이에서 출렁입니다. 차수는 검증 오차로 고릅니다.`,
        dEn: R`Extending the features to $1,x,\dots,x^M$ keeps the model linear in $\beta$, so the same formula solves it. But with $M=9$ the curve passes exactly through the 10 points and swings between them. The degree is chosen by validation error.` },
      { id: 'reg', role: 'fix', k: '4.3', t: R`규제: 계수에 벌점`, en: R`Regularization: a size penalty`,
        d: R`과적합된 계수는 수만·수십만 단위로 큽니다. $J=\frac12f(\beta)+\frac\lambda2\sum_j\lvert\beta_j\rvert^q$로 크기에 벌점을 주고, $\lambda$가 자료와 단순함 사이의 손잡이입니다.`,
        dEn: R`Overfitted coefficients run into the tens or hundreds of thousands. $J=\frac12f(\beta)+\frac\lambda2\sum_j\lvert\beta_j\rvert^q$ penalizes their size, and $\lambda$ is the knob between trusting the data and preferring simplicity.` },
      { id: 'ridge', role: 'res', k: '4.3', at: '### 릿지 해의 유도', t: R`릿지 해`, en: R`The ridge solution`,
        d: R`1단원처럼 미분해 0으로 두면 $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$. $\lambda>0$이면 $\lambda I+X^TX$가 양의 정부호라 항상 가역이고 해가 유일합니다.`,
        dEn: R`Differentiating and setting to zero as in Unit 1 gives $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$. For $\lambda>0$, $\lambda I+X^TX$ is positive definite, so it is always invertible and the solution is unique.` },
      { id: 'rmap', role: 'view', k: '4.3', at: '### 확률적 해석', t: R`릿지 = 가우시안 MAP`, en: R`Ridge = Gaussian MAP`,
        d: R`사전분포 $\beta\sim\N(0,\tau^2I)$의 MAP이 $\lambda=\sigma^2/\tau^2$인 릿지입니다(2단원). 사전분포가 좁을수록 규제가 셉니다.`,
        dEn: R`The MAP under the prior $\beta\sim\N(0,\tau^2I)$ is ridge with $\lambda=\sigma^2/\tau^2$ (Unit 2). The narrower the prior, the stronger the regularization.` },
      { id: 'lasso', role: 'alt', k: '4.3', at: '### 라쏘와 희소성', t: R`라쏘: 정확히 0으로`, en: R`Lasso: exact zeros`,
        d: R`$q=1$ 벌점은 일부 계수를 정확히 0으로 만듭니다. 1차원 해는 연성 임계값 $\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$이고, 릿지는 $z/(1+\lambda)$로 줄이기만 합니다.`,
        dEn: R`The $q=1$ penalty sets some coefficients exactly to 0. In one dimension the solution is the soft threshold $\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$, while ridge only shrinks, to $z/(1+\lambda)$.` },
      { id: 'kt', role: 'tool', k: '4.4', t: R`커널 트릭`, en: R`The kernel trick`,
        d: R`점을 고차원 특성 $\varphi(x)$로 올리면 선형모델도 휜 경계를 그립니다. 계산에 내적 $K(x,z)=\varphi(x)^T\varphi(z)$만 필요하면 $\varphi$를 만들지 않아도 됩니다.`,
        dEn: R`Lifting points to high-dimensional features $\varphi(x)$ lets a linear model draw curved boundaries. If only inner products $K(x,z)=\varphi(x)^T\varphi(z)$ are needed, $\varphi$ never has to be built.` },
      { id: 'push', role: 'tool', k: '4.5', t: R`푸시스루 항등식`, en: R`The push-through identity`,
        d: R`특성공간에서 릿지를 풀면 $d\times d$ 역행렬이 남습니다. $(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$로 이를 $n\times n$ 역행렬로 바꿉니다.`,
        dEn: R`Solving ridge in the feature space leaves a $d\times d$ inverse. $(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$ turns it into an $n\times n$ inverse.` },
      { id: 'krr', role: 'res', k: '4.5', at: ':::key 커널 릿지 회귀', t: R`커널 릿지 회귀`, en: R`Kernel ridge regression`,
        d: R`$f^*(x)=K(x,X)(\lambda I+K)^{-1}y=\sum_i\alpha_i^*K(x,x_i)$, 곧 새 점과 훈련점들의 유사도의 가중합입니다. $\alpha$로 푸는 두 번째 유도와 두 점 예제($35/69$)로 확인합니다.`,
        dEn: R`$f^*(x)=K(x,X)(\lambda I+K)^{-1}y=\sum_i\alpha_i^*K(x,x_i)$, a weighted sum of the new point's similarities to the training points. A second derivation in $\alpha$ and the two-point example ($35/69$) confirm it.` },
      { id: 'kex', role: 'ex', k: '4.6', t: R`커널의 예`, en: R`Examples of kernels`,
        d: R`선형·다항·가우시안 커널은 두 점의 유사도를 잽니다. 그람 행렬은 $c^TKc=\lVert\varphi(X)c\rVert^2\ge0$이라 $\lambda I+K$가 항상 가역입니다.`,
        dEn: R`Linear, polynomial and Gaussian kernels measure how similar two points are. The Gram matrix satisfies $c^TKc=\lVert\varphi(X)c\rVert^2\ge0$, so $\lambda I+K$ is always invertible.` },
    ],
    rows: [['lse'], ['overfit'], ['reg'], ['ridge'], ['rmap', 'lasso', 'kt'], [null, null, 'push'], [null, null, 'krr'], [null, null, 'kex']],
    edges: [
      ['lse', 'overfit', R`특성을 늘리면`, R`add more features`],
      ['overfit', 'reg', R`막으려면`, R`to prevent it`],
      ['reg', 'ridge', R`$q=2$로 풀면`, R`solve with $q=2$`],
      ['ridge', 'rmap', R`확률로 보면`, R`as probability`],
      ['ridge', 'lasso', R`$q=1$이면`, R`with $q=1$`],
      ['ridge', 'kt', R`특성을 올리면`, R`lift the features`],
      ['kt', 'push', R`특성공간의 릿지`, R`ridge in feature space`],
      ['push', 'krr', R`커널로 쓰면`, R`write it with kernels`],
      ['krr', 'kex', R`어떤 커널을?`, R`which kernels?`],
    ],
  });
})();
