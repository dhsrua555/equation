/* 논리 지도 — 10 SGD·미니배치·활성화 함수. 단원 첫머리의 쉬운 요약(easy)과 생각의 흐름을 그린 지도(nodes·rows·edges).
   일부만 보고 걸어도 되나 → 불편성과 분산 $\Sigma/B$ → 미니배치 SGD → 역전파의 눈으로 본 활성화 함수의 순서입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 10,
    easy: R`
경사하강법은 한 걸음마다 “어느 쪽이 내리막인가”를 묻습니다. 그런데 손실은 자료 하나하나의 손실을 평균한 값 $f=\frac1N\sum f_i$라서, 정확한 답을 얻으려면 매번 자료 전체를 훑어야 합니다. 자료가 백만 개라면 한 걸음에 백만 번의 계산이 듭니다. 이 단원은 “일부만 보고 걸어도 되는가?”라는 질문에 답합니다.

답은 여론조사와 같습니다. 무작위로 고른 작은 묶음(**미니배치**, minibatch)의 기울기는 평균을 내면 정확한 기울기와 같습니다: $\E[\nabla\tilde f]=\nabla f$. 이런 성질을 가진 추정을 **불편추정량**(unbiased estimator)이라 합니다. 다른 점은 흔들림(분산)뿐이고, 배치 크기 $B$를 키우면 분산이 $1/B$로 줄어듭니다. 한 걸음은 조금 부정확해도 훨씬 싸므로 같은 시간에 훨씬 많이 걸을 수 있습니다.

그래서 실제 훈련은 **미니배치 SGD**의 반복입니다. 미니배치를 뽑고 → 순전파로 손실을 재고 → 역전파로 기울기를 구하고 → 기울기 반대쪽으로 파라미터를 조금 옮깁니다.

후반부는 활성화 함수를 역전파의 눈으로 다시 봅니다. 기울기는 층마다 활성화의 **도함수**와 곱해지므로, 도함수가 0에 가까운 구간(**포화**, saturation)이 많거나 출력이 한쪽 부호로만 나오면 학습이 더뎌집니다. 시그모이드는 두 가지 모두 약점이 있고, tanh는 0 중심 문제를, ReLU는 포화 문제를 덜어 주지만 ReLU에는 ‘죽은 ReLU’라는 새 약점이 있습니다. ReLU를 지나면 신호의 세기(2차 모멘트)가 절반쯤 줄어든다는 점은 11단원의 초기화로 이어집니다.`,
    easyEn: R`
Gradient descent asks at every step “which way is downhill?”. But the loss is the average of the per-sample losses, $f=\frac1N\sum f_i$, so the exact answer needs a sweep of the whole dataset every time. With a million data points, one step costs a million computations. This unit answers the question “may we step after looking at only part of the data?”.

The answer is the same as for an opinion poll. The gradient of a small group drawn at random (a **minibatch**) equals the exact gradient on average: $\E[\nabla\tilde f]=\nabla f$. An estimate with this property is called an **unbiased estimator**. The only difference is the wobble (the variance), and it shrinks like $1/B$ as the batch size $B$ grows. Each step is a little less accurate but far cheaper, so we can take far more steps in the same time.

So real training is a loop of **minibatch SGD**: draw a minibatch → measure the loss with a forward pass → get the gradient with backpropagation → move the parameters a little against the gradient.

The second half looks at activation functions again, through the eyes of backpropagation. At every layer the gradient is multiplied by the activation's **derivative**, so learning slows down when the derivative is near 0 over large regions (**saturation**) or when the outputs have only one sign. The sigmoid is weak on both counts; tanh eases the zero-centering problem and ReLU the saturation problem, but ReLU brings a new weakness, the “dead ReLU”. That passing through ReLU roughly halves the signal's strength (its second moment) leads on to initialization in Unit 11.`,
    nodes: [
      { id: 'full', role: 'q', k: '10.1', t: R`전체 기울기는 비싸다`, en: R`The full gradient is costly`,
        d: R`손실이 표본별 손실의 평균 $f=\frac1N\sum f_i$라, 정확한 기울기를 한 번 구하려면 자료 전체를 훑어야 합니다. 일부만 보고 걸어도 될까요?`,
        dEn: R`The loss is the mean of the per-sample losses, $f=\frac1N\sum f_i$, so one exact gradient takes a sweep of the whole dataset. May we step after looking at only part of it?` },
      { id: 'unbiased', role: 'res', k: '10.1', at: ':::key 미니배치', t: R`평균은 정확: 불편성`, en: R`Right on average: unbiased`,
        d: R`전체·확률적·미니배치 기울기를 비교합니다. 무작위로 뽑으면 표본 하나나 미니배치의 기울기도 기댓값이 전체 기울기입니다: $\E[\nabla\tilde f]=\nabla f$.`,
        dEn: R`Full-batch, stochastic and minibatch gradients compared. Drawn at random, the gradient of one sample or of a minibatch has the full gradient as its expectation: $\E[\nabla\tilde f]=\nabla f$.` },
      { id: 'epoch', role: 'ex', k: '10.1', at: '**에폭.**', t: R`에폭과 한 걸음의 비용`, en: R`Epochs and the cost of a step`,
        d: R`자료 1000개를 100개씩 나누면 한 에폭에 10번 갱신합니다. 표본 하나에 $1\,\mu s$, 자료 $10^6$개라면 1초에 배치 GD는 1걸음, $B=100$ 미니배치는 1만 걸음을 갑니다.`,
        dEn: R`With 1000 data points in minibatches of 100, one epoch makes 10 updates. At $1\,\mu s$ per sample and $10^6$ data points, in one second batch GD takes 1 step and a $B=100$ minibatch 10,000 steps.` },
      { id: 'var', role: 'res', k: '10.2', t: R`분산은 $\Sigma/B$로 준다`, en: R`Variance shrinks like $\Sigma/B$`,
        d: R`차이는 분산뿐입니다. 복원추출이면 공분산이 $\Sigma/B$라 배치를 4배 키우면 잡음의 표준편차가 절반이 되고, 비복원이면 $\frac{N-B}{N-1}$이 더 곱해집니다.`,
        dEn: R`The only difference is the variance. With replacement the covariance is $\Sigma/B$, so a 4× larger batch halves the noise's standard deviation; without replacement an extra factor $\frac{N-B}{N-1}$ appears.` },
      { id: 'algo', role: 'app', k: '10.3', t: R`미니배치 SGD 알고리즘`, en: R`The minibatch SGD algorithm`,
        d: R`뽑기 → 순전파 → 역전파(9단원) → 갱신 $\theta\leftarrow\theta-\eta g$를 반복합니다. 실제로는 에폭마다 자료를 섞고 $B$개씩 잘라 씁니다.`,
        dEn: R`Repeat: draw → forward pass → backpropagation (Unit 9) → update $\theta\leftarrow\theta-\eta g$. In practice the data are shuffled every epoch and cut into batches of $B$.` },
      { id: 'deriv', role: 'view', k: '10.4', t: R`활성화를 도함수로 보기`, en: R`Activations via derivatives`,
        d: R`역전파에서 기울기는 층마다 활성화의 도함수와 곱해집니다. 그래서 좋은 활성화는 포화(도함수 ≈ 0)가 적고 출력이 0 중심인 것입니다.`,
        dEn: R`In backpropagation the gradient is multiplied by the activation's derivative at every layer. So a good activation saturates little (derivative ≈ 0) and has zero-centered outputs.` },
      { id: 'sig', role: 'lim', k: '10.4', at: '**시그모이드**', t: R`시그모이드: 두 약점`, en: R`Sigmoid: two weaknesses`,
        d: R`$\sigma'\le\frac14$이고 $\lvert z\rvert$가 크면 거의 0이라 신호가 사라집니다. 출력이 늘 양수라 다음 층 한 뉴런의 가중치 기울기 부호가 모두 같아져 지그재그로 갑니다.`,
        dEn: R`$\sigma'\le\frac14$, and it is nearly 0 for large $\lvert z\rvert$, so the signal dies. Its outputs are always positive, so the weight gradients of a next-layer neuron all share one sign and the path zigzags.` },
      { id: 'tanh', role: 'fix', k: '10.4', at: '**tanh**', t: R`tanh: 0 중심`, en: R`tanh: zero-centered`,
        d: R`출력이 $[-1,1]$에서 0을 중심으로 대칭이라 두 번째 약점은 사라집니다. 그러나 포화 구간에서 기울기가 0인 문제는 그대로입니다.`,
        dEn: R`Its outputs lie in $[-1,1]$, symmetric about 0, so the second weakness is gone. But the gradient is still 0 in the saturated regions.` },
      { id: 'relu', role: 'fix', k: '10.4', at: '**ReLU**', t: R`ReLU: 포화 없음`, en: R`ReLU: no saturation`,
        d: R`양수 구간에서 포화가 없고 계산이 쉬워 실전의 기본값입니다. 대신 음수 입력에서 기울기가 0이라 ‘죽은 ReLU’가 생길 수 있습니다(처방: 작은 양의 편향, Leaky ReLU).`,
        dEn: R`No saturation on the positive side and cheap to compute: the default in practice. But the gradient is 0 for negative inputs, so “dead ReLUs” can occur (remedy: a small positive bias, Leaky ReLU).` },
      { id: 'he', role: 'lim', k: '10.4', at: '### 더 깊이: 기울기 흐름과 초기화의 연결', t: R`신호 절반 → 초기화`, en: R`Signal halves → initialization`,
        d: R`ReLU는 뉴런 절반쯤이 꺼져 층마다 신호의 2차 모멘트가 절반이 됩니다. 이를 보정하는 He 초기화 $\Var(w)=2/D_{\text{in}}$이 11단원으로 이어집니다.`,
        dEn: R`About half of the ReLU neurons are off, so each layer halves the signal's second moment. The He initialization $\Var(w)=2/D_{\text{in}}$ that compensates for this leads on to Unit 11.` },
    ],
    rows: [['full'], ['unbiased'], ['epoch', 'var'], ['algo'], ['deriv'], ['sig', 'tanh', 'relu'], [null, null, 'he']],
    edges: [
      ['full', 'unbiased', R`무작위로 일부만`, R`a random part only`],
      ['unbiased', 'epoch', R`얼마나 싼가`, R`how cheap?`],
      ['unbiased', 'var', R`흔들림은?`, R`how noisy?`],
      ['epoch', 'algo', R`에폭마다 반복`, R`repeat every epoch`],
      ['var', 'algo', R`배치 크기 고르기`, R`choose the batch size`],
      ['algo', 'deriv', R`역전파에 곱해지는 $\sigma'$`, R`the $\sigma'$ in backprop`],
      ['deriv', 'sig'],
      ['deriv', 'tanh'],
      ['deriv', 'relu'],
      ['relu', 'he', R`신호 크기는?`, R`signal size?`],
    ],
  });
})();
