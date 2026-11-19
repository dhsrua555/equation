/* 23 생성 모델: 최대가능도, ELBO, VAE — 11주차 월요일 슬라이드 1–22와 필기(생성 모델링, 자기회귀 모델, 잠재 변수 모델, 최대가능도와 KL), 11주차 수요일 슬라이드 18–72와 필기(오토인코더, ELBO, VAE, 재매개변수화) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 23, part: 'I', title: '생성 모델: 최대가능도, ELBO, VAE', en: 'Generative Models: Maximum Likelihood, ELBO, VAE', ref: 'W11 월 · 슬라이드 1–22 · W11 수 · 슬라이드 18–72', plot: 'elbo',
    fig: R`모형 z ~ N(0, 1), x | z ~ N(z, 1)에서 x = 2를 관측했을 때, q = N(m, s²)의 평균 m에 따른 ELBO. 가로선이 log p(x) ≈ −2.27이고, 진짜 사후분포의 분산 s² = 0.5를 쓴 굵은 곡선만 m = 1에서 이 선에 닿는다. 다른 분산(가는 선, s² = 0.09, 0.25, 1)은 늘 그 아래에 머문다`,
    tagline: R`자료의 분포를 배우는 생성 모델을 다룹니다. 자기회귀 모델은 곱셈 규칙으로 $p(\mathbf x)$를 정확히 쓰고, 잠재 변수 모델은 적분 때문에 하한 ELBO를 최대화하며, VAE는 세 분포를 가우시안으로 정해 ELBO를 제곱 오차와 KL의 닫힌 식으로 바꾸고 재매개변수화로 학습합니다.`,
    summary: R`11주차 월요일은 생성 모델링의 두 목표(밀도 추정과 표본 생성), 자기회귀 모델(PixelRNN·PixelCNN), 잠재 변수 모델을 소개하고, 필기로 최대가능도가 $\KL(p_{data}\,\|\,p_\theta)$의 최소화임을 큰 수의 법칙과 $H(p,q)=\KL(p\,\|\,q)+H(p)$로 보였습니다. 11주차 수요일은 오토인코더를 거쳐 젠센 부등식으로 ELBO $\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$를 유도하고, VAE의 세 가정 아래 복원 항이 제곱 오차, KL 항이 $\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$가 됨을 보인 뒤, 재매개변수화 $\mathbf z=\mu+\sigma\odot\varepsilon$로 인코더까지 기울기를 보냈습니다. 수업에서 ‘나중에’로 미룬 가우시안 KL의 닫힌 형태는 1차원부터 증명을 실었습니다.`,
    goals: [
      R`생성 모델의 두 목표를 설명하고, 자기회귀 분해로 결합확률과 로그 가능도를 계산하며, PixelCNN의 학습과 생성 비용의 차이를 설명할 수 있다`,
      R`잠재 변수 모델의 주변 가능도와 사후분포를 쓰고, 이산 잠재 변수에서 직접 계산하며, 연속인 경우 무엇이 어려운지 설명할 수 있다`,
      R`오토인코더의 손실을 쓰고 선형 오토인코더의 복원과 손실을 계산하며, 오토인코더만으로 생성이 어려운 이유를 설명할 수 있다`,
      R`큰 수의 법칙과 $H(p,q)=\KL(p\,\|\,q)+H(p)$로 최대가능도가 $\KL(p_{data}\,\|\,p_\theta)$의 최소화임을 보일 수 있다`,
      R`젠센 부등식으로 ELBO를 유도하고, 틈이 $\KL(q\,\|\,p(\mathbf z\mid\mathbf x))$임을 보이며 이산 예에서 계산할 수 있다`,
      R`VAE의 세 가정을 쓰고, 가우시안 디코더가 제곱 오차를 주며 $\KL(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I))=\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$임을 증명할 수 있다`,
      R`재매개변수화 $\mathbf z=\mu+\sigma\odot\varepsilon$의 평균, 분산, $\partial\mathbf z/\partial\mu$, $\partial\mathbf z/\partial\sigma$를 구하고 한 표본 기울기를 계산할 수 있다`,
    ],
    secTitles: { '23.1': '자기회귀 모델', '23.2': '잠재 변수 모델', '23.3': '오토인코더', '23.4': '최대가능도와 KL', '23.5': 'ELBO', '23.6': 'VAE의 가정', '23.7': '재매개변수화' },
    sections: [
      { k: '23.1', src: 'W11 월 · 슬라이드 2–13', title: '생성 모델링과 자기회귀 모델', body: R`
:::idea 쉽게 말하면
생성 모델은 자료를 만든 분포 $p_{data}$를 흉내 내는 분포 $p_\theta$를 배웁니다. 잘 배웠다면 $p_\theta$에서 새 표본을 뽑을 수 있고, 주어진 $\mathbf x$가 얼마나 그럴듯한지 확률로 잴 수도 있습니다. 문제는 이미지 하나가 수천 차원의 벡터라 분포를 통째로 쓰기 어렵다는 것이고, 자기회귀 모델은 확률의 곱셈 규칙으로 이것을 한 차원씩 쪼갭니다.
:::

**판별 모델과 생성 모델.** 지금까지의 분류기는 입력 $\mathbf x$가 주어졌을 때 표시 $y$의 분포 $p(y\mid\mathbf x)$를 배우는 판별 모델이었습니다. 생성 모델은 표시 없이 $\mathbf x$들만 받아 $\mathbf x$ 자체의 분포 $p(\mathbf x)$를 배웁니다. 목표는 둘입니다. 하나는 **밀도 추정**으로 새 $\mathbf x$에 확률 $p_\theta(\mathbf x)$를 매기는 것이고, 다른 하나는 **표본 생성**으로 $p_\theta$에서 새 $\mathbf x$를 뽑는 것입니다.

생성 모델은 $p_\theta(\mathbf x)$를 식으로 계산할 수 있는지에 따라 나뉩니다. 자기회귀 모델은 정확히 계산할 수 있고, VAE는 하한만 계산할 수 있으며, GAN처럼 표본만 뽑고 밀도는 쓰지 않는 모델도 있습니다. 이 단원은 앞의 두 가지를 다룹니다.

:::key 자기회귀 분해
$\mathbf x=(x_1,\dots,x_D)$의 분포는 곱셈 규칙으로 언제나
$$p(\mathbf x)=\prod_{i=1}^Dp(x_i\mid x_1,\dots,x_{i-1})=\prod_{i=1}^Dp(x_i\mid\mathbf x_{<i})$$
로 쓸 수 있다. 자기회귀 모델은 각 조건부 분포 $p_\theta(x_i\mid\mathbf x_{<i})$를 신경망으로 나타내고, 로그 가능도 $\log p_\theta(\mathbf x)=\sum_i\log p_\theta(x_i\mid\mathbf x_{<i})$를 최대화해 학습한다.
:::

**PixelRNN과 PixelCNN.** 이미지에서는 픽셀을 왼쪽 위에서부터 한 줄씩 늘어놓아 순서를 정합니다. 픽셀 값은 $0$부터 $255$까지의 정수이므로 각 조건부는 $256$개 값에 대한 소프트맥스입니다. PixelRNN은 앞의 픽셀들을 LSTM으로 읽어 문맥을 요약하고, PixelCNN은 가운데와 그 뒤의 가중치를 $0$으로 가린 **마스크 합성곱**으로 앞쪽 픽셀만 보게 합니다. 학습 때는 모든 픽셀의 값이 이미 자료에 있으므로 PixelCNN은 $D$개 조건부를 한 번에 계산할 수 있습니다. 하지만 생성할 때는 $x_i$를 뽑아야 $x_{i+1}$의 문맥이 생기므로 두 모델 모두 $D$번을 차례로 계산해야 합니다.

:::fig pixelorder
:::

:::ex 예제 1 — 세 픽셀의 확률
이진 픽셀 세 개에서 $p(x_1=1)=0.6$, $p(x_2=0\mid x_1=1)=0.5$, $p(x_3=0\mid x_1=1,x_2=0)=0.8$일 때 $p(1,0,0)$은?
---
곱셈 규칙으로 $p(1,0,0)=p(x_1=1)\,p(x_2=0\mid x_1=1)\,p(x_3=0\mid x_1=1,x_2=0)=0.6\cdot0.5\cdot0.8=0.24$입니다. 로그 가능도는 세 항의 합 $\ln0.6+\ln0.5+\ln0.8\approx-1.427=\ln0.24$입니다.
:::

:::ex 예제 2 — 생성에 드는 걸음 수
$32\times32$ 컬러 이미지를 채널 값 하나씩 자기회귀로 만들면 신경망을 몇 번 차례로 계산해야 하는가?
---
값이 $32\cdot32\cdot3=3072$개이고 각 값이 앞의 값들을 문맥으로 쓰므로 $3072$번입니다. 학습 때 PixelCNN이 한 번의 순전파로 $3072$개 조건부를 모두 얻는 것과 대조됩니다.
:::

### 더 깊이

곱셈 규칙은 어떤 분포에서나 성립하므로 자기회귀 분해 자체는 근사가 아닙니다. 이진 픽셀 $D$개의 결합분포를 표로 적으면 독립 매개변수가 $2^D-1$개이고, 조건부를 모두 표로 적어도 $1+2+\dots+2^{D-1}=2^D-1$개로 같습니다. 자기회귀 모델이 쓸 만한 이유는 분해가 아니라, 모든 조건부가 한 신경망의 매개변수를 함께 쓴다는 데 있습니다.
` },
      { k: '23.2', src: 'W11 월 · 슬라이드 15–22 · W11 수 · 슬라이드 23–35', title: '잠재 변수 모델', body: R`
:::idea 쉽게 말하면
고양이 사진은 픽셀이 수만 개여도 실제로는 자세, 털 색, 조명 같은 몇 가지 요인으로 정해집니다. 잠재 변수 모델은 이 요인을 보이지 않는 변수 $\mathbf z$로 두고, 먼저 $\mathbf z$를 뽑은 뒤 $\mathbf z$에서 $\mathbf x$를 만듭니다. 뽑기는 쉽지만, 주어진 $\mathbf x$의 확률을 구하려면 그 $\mathbf x$를 만들 수 있는 모든 $\mathbf z$를 더해야 해서 어렵습니다.
:::

**얇은 일부분.** $D$차원 픽셀 공간에서 아무 점이나 고르면 거의 언제나 잡음입니다. 자연 이미지는 그 안의 얇은 일부분에 모여 있고, 그 위의 점은 훨씬 적은 수의 요인으로 움직입니다. 그래서 낮은 차원 $d\ll D$의 변수 $\mathbf z$에서 출발해 신경망으로 데이터 공간에 보내는 모델이 자연스럽습니다.

:::key 잠재 변수 모델
잠재 변수 $\mathbf z\in\mathbb R^d$의 사전분포 $p(\mathbf z)$(보통 $\N(\mathbf 0,I)$)와 디코더 $p_\theta(\mathbf x\mid\mathbf z)$로
$$p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)\,p(\mathbf z)\,d\mathbf z$$
를 정한다. 표본은 $\mathbf z\sim p(\mathbf z)$, $\mathbf x\sim p_\theta(\mathbf x\mid\mathbf z)$로 차례로 뽑는다. 사후분포는 $p_\theta(\mathbf z\mid\mathbf x)=p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/p_\theta(\mathbf x)$이다.
:::

:::fig latentgen
:::

**무엇이 어려운가.** 뽑기는 두 단계를 차례로 하면 되므로 쉽습니다. 어려운 것은 적분 $p_\theta(\mathbf x)$입니다. $\mathbf z$가 유한 개의 값만 가지면 적분이 합이 되고(가우시안 혼합 모델이 이 경우입니다), $\mathbf z$가 연속이고 디코더가 신경망이면 닫힌 형태가 없습니다. 사후분포 $p_\theta(\mathbf z\mid\mathbf x)$도 분모에 $p_\theta(\mathbf x)$가 있어 계산할 수 없습니다. 가장 단순한 방법은 몬테카를로 근사
$$p_\theta(\mathbf x)\approx\frac1K\sum_{k=1}^Kp_\theta(\mathbf x\mid\mathbf z_k),\qquad\mathbf z_k\sim p(\mathbf z)$$
인데, 높은 차원에서는 사전분포에서 뽑은 $\mathbf z_k$ 대부분이 $\mathbf x$를 거의 설명하지 못해 $p_\theta(\mathbf x\mid\mathbf z_k)\approx0$이 되고, 아주 많은 $K$가 필요합니다. 23.5절은 $\mathbf x$를 보고 그럴듯한 $\mathbf z$만 고르는 분포 $q(\mathbf z\mid\mathbf x)$로 이 문제를 돌아갑니다.

:::ex 예제 3 — 이산 잠재 변수
$z\in\{1,2\}$, $p(z=1)=0.3$, $p(x=1\mid z=1)=0.9$, $p(x=1\mid z=2)=0.2$일 때 $p(x=1)$과 $p(z=1\mid x=1)$은?
---
$p(x=1)=0.3\cdot0.9+0.7\cdot0.2=0.27+0.14=0.41$. 베이즈 정리로 $p(z=1\mid x=1)=0.27/0.41\approx0.659$입니다. $z$가 두 값뿐이라 적분이 두 항의 합이지만, $\mathbf z$가 연속이고 차원이 높으면 이 합이 계산할 수 없는 적분이 됩니다.
:::
` },
      { k: '23.3', src: 'W11 수 · 슬라이드 36–47', title: '오토인코더와 생성', body: R`
:::idea 쉽게 말하면
오토인코더는 입력을 작은 코드로 줄였다가 다시 살려 내는 법을 배웁니다. 코드가 입력보다 작으므로 그대로 외울 수 없고, 복원에 필요한 요약만 남기게 됩니다. 정답 표시가 없어도 되는 것이 장점이지만, 코드가 어떤 분포를 따르는지 모르기 때문에 디코더만 떼어 새 이미지를 만들기는 어렵습니다.
:::

**구조.** 인코더 $g_\phi:\mathbb R^D\to\mathbb R^d$가 $\mathbf z=g_\phi(\mathbf x)$를 내고, 디코더 $f_\theta:\mathbb R^d\to\mathbb R^D$가 $\hat{\mathbf x}=f_\theta(\mathbf z)$로 복원합니다. $d<D$인 $\mathbf z$를 병목이라 부릅니다.

:::key 오토인코더 손실
자료 $\mathbf x_1,\dots,\mathbf x_N$에 대해
$$\min_{\phi,\theta}\ \frac1N\sum_{i=1}^N\big\lVert\mathbf x_i-f_\theta(g_\phi(\mathbf x_i))\big\rVert^2$$
을 푼다. 손실에 입력만 있으므로 표시가 필요 없다(자기 지도 학습).
:::

:::fig autoenc
:::

**선형 오토인코더.** 인코더와 디코더가 모두 선형이고 $d=1$, $g(\mathbf x)=\mathbf w^T\mathbf x$, $f(z)=z\mathbf w$ ($\lVert\mathbf w\rVert=1$)이면 복원은 $\mathbf x$를 $\mathbf w$ 방향으로 정사영한 것이고, 손실은 $\lVert\mathbf x\rVert^2-(\mathbf w^T\mathbf x)^2$입니다. 이 합을 최소화하는 것은 $\sum_i(\mathbf w^T\mathbf x_i)^2$를 최대화하는 것, 곧 주성분 분석(PCA)의 첫 방향을 찾는 것과 같습니다. 비선형 오토인코더는 이것을 곡면으로 넓힌 것으로 볼 수 있습니다.

:::ex 예제 4 — 한 방향으로 줄이기
$\mathbf w=\frac1{\sqrt2}(1,1)$, $\mathbf x=(3,1)$일 때 선형 오토인코더의 코드, 복원, 손실은?
---
$z=\mathbf w^T\mathbf x=\frac4{\sqrt2}=2\sqrt2$, $\hat{\mathbf x}=z\mathbf w=(2,2)$, 손실 $\lVert(3,1)-(2,2)\rVert^2=1+1=2$입니다. 공식으로도 $\lVert\mathbf x\rVert^2-z^2=10-8=2$입니다.
:::

**쓰임과 한계.** 학습된 인코더는 표시가 적은 문제에서 특징 추출기로 쓰입니다. 인코더 뒤에 분류기를 붙여 적은 표시로 미세 조정하는 식입니다. 그러면 디코더로 새 이미지를 만들 수 있을까요? 디코더에 넣을 $\mathbf z$를 어디서 뽑을지 모른다는 것이 문제입니다. 학습 자료의 코드는 코드 공간의 일부에만 흩어져 있고, 그 사이의 점을 넣으면 의미 없는 출력이 나올 수 있습니다. 코드의 분포를 $\N(\mathbf 0,I)$ 같은 정해진 분포에 맞추도록 학습하는 것이 VAE입니다(23.6절).
` },
      { k: '23.4', src: 'W11 월 · 슬라이드 22 · 필기', title: '최대가능도는 KL 최소화다', body: R`
:::idea 쉽게 말하면
최대가능도는 ‘가지고 있는 자료에 가장 높은 확률을 주는 매개변수’를 고르는 방법입니다. 자료가 많아지면 이것은 모형 분포 $p_\theta$를 진짜 분포 $p_{data}$에 KL 발산의 뜻으로 가장 가깝게 맞추는 것과 같아집니다. 생성 모델을 최대가능도로 학습하는 이유가 여기 있습니다.
:::

:::hand 수업 필기 — 최대가능도에서 KL로
자료 $\mathbf x_1,\dots,\mathbf x_N\sim p_{data}$가 독립이면
$$\theta^*=\argmax_\theta\prod_{i=1}^Np_\theta(\mathbf x_i)=\argmax_\theta\frac1N\sum_{i=1}^N\log p_\theta(\mathbf x_i).$$
큰 수의 법칙으로 $N\to\infty$이면 $\frac1N\sum_i\log p_\theta(\mathbf x_i)\to\E_{p_{data}}[\log p_\theta(\mathbf x)]$이므로
$$\theta^*\approx\argmin_\theta\E_{p_{data}}[-\log p_\theta(\mathbf x)]=\argmin_\theta H(p_{data},p_\theta)=\argmin_\theta\big[\KL(p_{data}\,\|\,p_\theta)+H(p_{data})\big].$$
$H(p_{data})$는 $\theta$와 무관하므로 마지막 식은 $\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$입니다.
:::

:::key 최대가능도와 KL
교차 엔트로피는 $H(p,q)=\KL(p\,\|\,q)+H(p)$로 나뉘므로, 자료가 많을 때 최대가능도 추정은
$$\argmax_\theta\frac1N\sum_{i=1}^N\log p_\theta(\mathbf x_i)\ \approx\ \argmin_\theta\KL(p_{data}\,\|\,p_\theta)$$
이다. $\KL\ge0$이고 $p_\theta=p_{data}$일 때만 $0$이므로, 모형이 충분히 풍부하면 최적의 $p_\theta$는 $p_{data}$다.
:::

교차 엔트로피의 분해와 $\KL\ge0$은 3단원에서 다루었습니다[[ch03:3.5|교차 엔트로피.]]. 분류에서 교차 엔트로피 손실을 쓰는 것도 같은 이야기를 $p(y\mid\mathbf x)$에 적용한 것입니다.

:::ex 예제 5 — 동전의 최대가능도
동전을 $10$번 던져 앞면이 $7$번 나왔다. 모형 $p_\theta(1)=\theta$의 최대가능도 추정값은? 또 $p_{data}(1)=0.7$일 때 $\theta=0.5$의 $\KL(p_{data}\,\|\,p_\theta)$와 교차 엔트로피는?
---
로그 가능도 $7\ln\theta+3\ln(1-\theta)$를 미분한 $\frac7\theta-\frac3{1-\theta}=0$에서 $\theta^*=0.7$입니다. $\KL=0.7\ln\frac{0.7}{0.5}+0.3\ln\frac{0.3}{0.5}\approx0.2355-0.1532=0.0823$이고 $H(p_{data})=-0.7\ln0.7-0.3\ln0.3\approx0.6109$이므로, 그 합 $0.6931=\ln2$가 교차 엔트로피 $-0.7\ln0.5-0.3\ln0.5$와 같습니다.
:::

### 더 깊이

왜 $\KL(p_{data}\,\|\,p_\theta)$이고 반대 방향 $\KL(p_\theta\,\|\,p_{data})$가 아닐까요? 반대 방향은 $\E_{p_\theta}[\log p_{data}]$를 계산해야 하는데 $p_{data}$의 밀도는 모릅니다. 앞 방향은 $p_{data}$에서 뽑은 표본만 있으면 되므로 자료로 계산할 수 있습니다. 앞 방향 KL은 $p_{data}>0$인 곳에서 $p_\theta\approx0$이면 크게 벌을 주므로, 최대가능도로 학습한 모형은 자료가 있는 곳을 빠짐없이 덮으려 합니다.
` },
      { k: '23.5', src: 'W11 수 · 슬라이드 48–57 · 필기', title: 'ELBO: 젠센 부등식으로 만든 하한', body: R`
:::idea 쉽게 말하면
잠재 변수 모델의 $\log p_\theta(\mathbf x)$는 적분 때문에 직접 계산할 수 없습니다. 대신 $\mathbf x$를 보고 $\mathbf z$를 추측하는 분포 $q_\phi(\mathbf z\mid\mathbf x)$를 하나 끼워 넣으면, 젠센 부등식으로 계산 가능한 하한을 얻습니다. 이 하한이 ELBO(evidence lower bound)이고, 하한과 참값의 차이는 $q_\phi$가 진짜 사후분포에서 얼마나 먼지를 재는 KL입니다.
:::

:::hand 수업 필기 — 젠센 부등식으로 하한 만들기
$q_\phi(\mathbf z\mid\mathbf x)>0$인 아무 분포를 곱하고 나누면
$$\log p_\theta(\mathbf x)=\log\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z=\log\E_{q_\phi(\mathbf z\mid\mathbf x)}\Big[\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big].$$
$\log$는 오목하므로 젠센 부등식 $\log\E[Y]\ge\E[\log Y]$로
$$\log p_\theta(\mathbf x)\ge\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]+\E_{q_\phi}\Big[\log\frac{p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big]=\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z)).$$
필기는 첫째 항 옆에 $\lVert\hat{\mathbf x}-\mathbf x\rVert^2$로 바뀐다는 화살표를, 둘째 항의 $p(\mathbf z)$ 옆에 $\N(\mathbf 0,I)$를 적어 23.6절의 가정을 미리 표시했습니다.
:::

:::key ELBO
아무 분포 $q_\phi(\mathbf z\mid\mathbf x)$에 대해
$$\log p_\theta(\mathbf x)\ \ge\ \mathrm{ELBO}=\E_{q_\phi(\mathbf z\mid\mathbf x)}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$$
이고, 틈은 정확히 $\log p_\theta(\mathbf x)-\mathrm{ELBO}=\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p_\theta(\mathbf z\mid\mathbf x))\ge0$이다. 첫째 항은 복원 항, 둘째 항은 $q_\phi$를 사전분포 쪽으로 당기는 정규화 항이다.
:::

:::fig elbogap
:::

**학습 목표** (슬라이드 57). 로그 가능도 대신 ELBO를 자료 전체에서 최대화합니다.
$$\max_{\theta,\phi}\ \frac1N\sum_{i=1}^N\Big(\E_{q_\phi(\mathbf z\mid\mathbf x^{(i)})}[\log p_\theta(\mathbf x^{(i)}\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x^{(i)})\,\|\,p(\mathbf z))\Big)$$
$\theta$로 올리면 하한 아래의 $\log p_\theta(\mathbf x)$가 함께 올라가고, $\phi$로 올리면 $\log p_\theta(\mathbf x)$는 그대로이므로 틈, 곧 사후분포와의 KL이 줄어듭니다. 하나의 목표로 모형 학습과 사후분포 근사를 함께 하는 셈입니다.

:::ex 예제 6 — 두 상태에서 틈 재기
$z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.8$, $p(x\mid z=2)=0.2$일 때 $\log p(x)$, 균등한 $q$의 ELBO, 그 틈은?
---
$p(x)=\frac12(0.8+0.2)=0.5$이므로 $\log p(x)=\ln0.5\approx-0.693$. 균등한 $q$이면 $\mathrm{ELBO}=\sum_zq(z)\ln\frac{p(x,z)}{q(z)}=\frac12\ln\frac{0.4}{0.5}+\frac12\ln\frac{0.1}{0.5}\approx\frac12(-0.223-1.609)=-0.916$이고, 틈은 $0.223$입니다. 사후분포가 $(0.8,0.2)$이므로 $\KL(q\,\|\,p(z\mid x))=\frac12\ln\frac{0.5}{0.8}+\frac12\ln\frac{0.5}{0.2}\approx0.223$으로 틈과 같습니다.
:::
` },
      { k: '23.6', src: 'W11 수 · 슬라이드 58–67 · 필기', title: 'VAE의 가정, 가우시안 디코더, 가우시안 KL', body: R`
:::idea 쉽게 말하면
ELBO의 두 항을 실제로 계산하려면 세 분포의 꼴을 정해야 합니다. VAE는 셋 다 가우시안으로 정합니다. 그러면 복원 항은 오토인코더의 제곱 오차가 되고, KL 항은 인코더가 낸 평균과 분산의 간단한 식이 됩니다. 결국 VAE는 ‘코드가 $\N(\mathbf 0,I)$를 닮도록 벌을 받는 오토인코더’입니다.
:::

:::hand 수업 필기 — VAE의 가정
$\mathbf x\in\mathbb R^D$, $\mathbf z\in\mathbb R^d$로 두고 세 가지를 가정합니다. 사전분포 $p(\mathbf z)=\N(\mathbf 0,I)$, 인코더 $q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$ ($\Sigma_\phi$는 대각), 디코더 $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$.

이를 ELBO에 넣으면 최소화할 목표가 (상수를 빼고 전체에 $2$를 곱해)
$$\sum_{i=1}^N\Big(\frac1{\tau^2}\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2+\tr\Sigma_\phi(\mathbf x_i)+\lVert\mu_\phi(\mathbf x_i)\rVert^2-\log\det\Sigma_\phi(\mathbf x_i)\Big)\qquad(3)$$
이 됩니다. 필기는 KL의 닫힌 형태를 ‘나중에’로 미뤘고, 아래 핵심과 증명에서 채웁니다.
:::

:::key VAE의 세 가정
$p(\mathbf z)=\N(\mathbf 0,I)$, $q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\diag(\sigma_\phi^2(\mathbf x)))$, $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$. 인코더 신경망은 $\mathbf x$에서 $\mu_\phi,\sigma_\phi\in\mathbb R^d$를, 디코더 신경망은 $\mathbf z$에서 평균 $f_\theta(\mathbf z)\in\mathbb R^D$를 낸다.
:::

**복원 항.** 가우시안 밀도에 로그를 취하면 제곱 오차가 나옵니다.

:::key 가우시안 디코더와 L2 손실
$p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$이면
$$-\log p_\theta(\mathbf x\mid\mathbf z)=\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$$
이므로, $\tau$를 고정하면 복원 항을 최대화하는 것은 제곱 오차 $\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$를 최소화하는 것과 같다.
:::

**KL 항.** 두 분포가 모두 가우시안이라 KL이 닫힌 식으로 나옵니다.

:::key 가우시안 KL의 닫힌 형태
$$\KL\big(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I)\big)=\frac12\big(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma\big).$$
$\Sigma=\diag(\sigma_1^2,\dots,\sigma_d^2)$이면 $\frac12\sum_{k=1}^d(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$이다.
:::

:::fig gausskl
:::

두 결과를 합치면 한 자료의 음의 ELBO는 $\frac1{2\tau^2}\E_{q_\phi}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$에 상수를 더한 것이고, $2$를 곱해 상수를 버리면 필기의 식 (3)입니다. KL 항은 $\mu$를 $\mathbf 0$으로, $\sigma_k^2$을 $1$로 당기고, $-\log\sigma_k^2$ 때문에 분산이 $0$으로 줄어드는 것을 막습니다. 분산이 $0$이면 VAE는 보통의 오토인코더가 되어 코드 사이에 빈 곳이 생깁니다.

:::ex 예제 7 — 1차원 KL
$d=1$에서 $\KL(\N(1,1)\,\|\,\N(0,1))$과 $\KL(\N(0,e)\,\|\,\N(0,1))$은?
---
첫째는 $\frac12(1+1-1-\ln1)=\frac12$입니다. 분산이 $1$이고 평균만 움직이면 $\frac12\mu^2$입니다. 둘째는 $\frac12(e+0-1-\ln e)=\frac{e-2}2\approx0.359$입니다.
:::

:::ex 예제 8 — 가우시안 디코더의 손실
$D=2$, $\tau^2=1$, $\mathbf x=(1,2)$, $f_\theta(\mathbf z)=(1,0)$일 때 $-\log p_\theta(\mathbf x\mid\mathbf z)$는?
---
$\frac12\lVert(0,2)\rVert^2+\frac22\ln(2\pi)=2+\ln(2\pi)\approx3.838$입니다. 상수 $\ln(2\pi)$는 $\theta$와 무관하므로 학습에는 제곱 오차 $4$의 절반만 영향을 줍니다.
:::

### 더 깊이

$\tau^2$은 두 항의 무게를 정합니다. $\tau^2$이 작으면 복원 항의 $\frac1{2\tau^2}$이 커져 VAE가 오토인코더처럼 선명하게 복원하지만 코드가 사전분포에서 멀어지고, $\tau^2$이 크면 KL 항이 이겨 코드가 $\N(\mathbf 0,I)$에 붙고 복원이 흐려집니다. 극단적으로는 $q_\phi(\mathbf z\mid\mathbf x)=p(\mathbf z)$가 되어 코드가 $\mathbf x$에 대한 정보를 전혀 담지 않을 수도 있습니다. 구현에서 손실을 ‘제곱 오차 $+\,\beta\cdot$KL’로 쓰는 것은 이 무게를 $\beta$ 하나로 조절하는 것입니다.
` },
      { k: '23.7', src: 'W11 수 · 슬라이드 68–72 · 필기', title: '재매개변수화 기법', body: R`
:::idea 쉽게 말하면
ELBO의 복원 항은 $\mathbf z\sim q_\phi$에 대한 기댓값이라 $\mathbf z$를 뽑아서 근사합니다. 그런데 ‘뽑기’는 미분할 수 있는 연산이 아니어서 기울기가 인코더까지 가지 못합니다. 무작위성을 바깥의 표준 정규 잡음 $\varepsilon$으로 옮기고 $\mathbf z=\mu+\sigma\odot\varepsilon$로 쓰면, $\mathbf z$가 $\mu$, $\sigma$의 평범한 함수가 되어 역전파가 됩니다.
:::

:::hand 수업 필기 — 뽑기를 지나는 미분
복원 손실을 $R(\theta,\phi)=\frac12\lVert f_\theta(\mathbf z)-\mathbf x\rVert^2$, $\mathbf z\sim q_\phi(\mathbf z\mid\mathbf x)$로 둡니다. $\partial R/\partial\theta$는 디코더를 따라 바로 계산되지만, $\partial R/\partial\phi$는 $\mathbf z$가 $\phi$에서 ‘뽑혀’ 나왔으므로 연쇄법칙을 쓸 수 없습니다.

1차원에서 $z=\mu+\sigma\varepsilon$, $\varepsilon\sim\N(0,1)$로 쓰면 $\E[z]=\mu+\sigma\E[\varepsilon]=\mu$, $\Var(z)=\sigma^2\Var(\varepsilon)=\sigma^2$이므로 $z\sim\N(\mu,\sigma^2)$로 같은 분포이고, 이제 $z$는 $\mu$와 $\sigma$의 미분 가능한 함수입니다.
:::

:::key 재매개변수화
$\varepsilon\sim\N(\mathbf 0,I)$를 $\phi$와 무관하게 뽑고 $\mathbf z=\mu_\phi(\mathbf x)+\sigma_\phi(\mathbf x)\odot\varepsilon$로 두면 $\mathbf z\sim\N(\mu_\phi,\diag(\sigma_\phi^2))$이고
$$\frac{\partial\mathbf z}{\partial\mu}=I,\qquad\frac{\partial\mathbf z}{\partial\sigma}=\diag(\varepsilon),\qquad\nabla_\phi\E_{q_\phi}[R(\mathbf z)]=\E_\varepsilon\big[\nabla_\phi R(\mu_\phi+\sigma_\phi\odot\varepsilon)\big].$$
기울기는 가우시안의 매개변수 $\mu$, $\sigma$를 따라 흐르고, 잡음 $\varepsilon$은 상수로 취급된다(슬라이드 68).
:::

:::fig reparam
:::

**한 번의 학습 단계.** 자료 $\mathbf x$마다 (1) 인코더로 $\mu_\phi(\mathbf x)$, $\sigma_\phi(\mathbf x)$를 계산하고, (2) $\varepsilon\sim\N(\mathbf 0,I)$를 뽑아 $\mathbf z=\mu+\sigma\odot\varepsilon$를 만들고, (3) 디코더로 $f_\theta(\mathbf z)$를 계산해 손실 $\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac12\sum_k(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$를 구한 뒤, (4) 역전파로 $\theta$와 $\phi$를 함께 갱신합니다. 기댓값은 보통 $\varepsilon$ 하나로 근사하며, 이 근사는 편향이 없습니다.

:::ex 예제 9 — 한 표본의 기울기
$f(z)=z^2$, $\mu=1$, $\sigma=2$, 뽑힌 잡음 $\varepsilon=0.5$일 때 $z$, $\partial f/\partial\mu$, $\partial f/\partial\sigma$는?
---
$z=1+2\cdot0.5=2$. 연쇄법칙으로 $\frac{\partial f}{\partial\mu}=2z\cdot1=4$, $\frac{\partial f}{\partial\sigma}=2z\cdot\varepsilon=2$입니다. 기댓값으로 확인하면 $\E[z^2]=\mu^2+\sigma^2$이므로 참 기울기는 $(2\mu,2\sigma)=(2,4)$이고, $\E_\varepsilon[2z]=2\mu$, $\E_\varepsilon[2z\varepsilon]=2\sigma$로 한 표본 기울기의 평균이 참 기울기와 같습니다.
:::

**생성과 잠재 공간** (슬라이드 69–72). 학습이 끝나면 인코더는 두고 $\mathbf z\sim\N(\mathbf 0,I)$를 뽑아 $f_\theta(\mathbf z)$를 내면 새 표본이 됩니다. KL 항 덕분에 코드가 원점 근처를 빈틈없이 채우므로, 두 코드 사이를 직선으로 움직이면 출력이 매끄럽게 바뀌고, $\mathbf z$의 한 좌표를 바꾸면 얼굴 방향이나 표정 같은 한 가지 성질만 바뀌는 경우가 많습니다($\Sigma_\phi$가 대각이라는 가정이 좌표들을 따로 쓰도록 돕습니다). 다만 제곱 오차는 여러 그럴듯한 출력의 평균 쪽으로 기울어서 VAE의 표본은 흐려지기 쉽습니다.
` },
    ],
    problems: [
      // 23.1
      { sec: '23.1', type: 'mc', lv: 1, q: R`세 변수 $\mathbf x=(x_1,x_2,x_3)$의 분포를 아무 가정 없이 자기회귀로 분해한 것은?`,
        choices: [R`$p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)$`, R`$p(x_1)\,p(x_2)\,p(x_3)$`, R`$p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_2)$`, R`$p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)$`], ans: 0,
        sol: R`곱셈 규칙을 차례로 쓰면 첫째입니다. 둘째는 독립을, 셋째는 $x_3$이 $x_2$에만 의존한다는 마르코프 가정을 더한 것이고, 넷째는 $p(x_1)$이 빠져 $\mathbf x$의 분포가 아닙니다.` },
      { sec: '23.1', type: 'num', lv: 1, q: R`$p(x_1=1)=0.5$, $p(x_2=1\mid x_1=1)=0.4$, $p(x_3=0\mid x_1=1,x_2=1)=0.1$일 때 $p(x_1=1,x_2=1,x_3=0)$은?`, ans: '0.02', ansTex: R`0.5\cdot0.4\cdot0.1=0.02`,
        sol: R`자기회귀 분해로 $0.5\cdot0.4\cdot0.1=0.02$입니다.` },
      { sec: '23.1', type: 'num', lv: 2, q: R`이진 픽셀 $D=4$개의 결합분포를 아무 가정 없이 표로 적을 때 필요한 독립 매개변수의 수는?`, ans: '15', ansTex: R`2^4-1=15`,
        sol: R`$2^4=16$칸의 확률은 합이 $1$이라 하나가 나머지로 정해지므로 $15$개입니다. 조건부를 표로 적어도 $1+2+4+8=15$개로 같아서, 분해만으로는 매개변수가 줄지 않습니다.` },
      { sec: '23.1', type: 'num', lv: 1, q: R`$28\times28$ 흑백 이미지를 픽셀 하나씩 자기회귀로 생성할 때 신경망을 차례로 계산하는 횟수는?`, ans: '784', ansTex: R`28^2=784`,
        sol: R`픽셀마다 앞의 픽셀들을 문맥으로 쓰므로 $28\cdot28=784$번입니다.` },
      { sec: '23.1', type: 'mc', lv: 2, q: R`PixelCNN에 대한 설명으로 옳은 것은?`,
        choices: [R`학습 때는 마스크 합성곱으로 모든 조건부를 한 번에 계산하지만, 생성은 픽셀 하나씩 차례로 한다`, R`생성할 때도 모든 픽셀을 한 번에 뽑을 수 있다`, R`마스크는 가운데 픽셀을 보도록 열어 두어야 조건부가 맞다`, R`로그 가능도를 계산할 수 없어 하한을 최대화한다`], ans: 0,
        sol: R`학습 때는 모든 픽셀 값이 자료에 있어 조건부를 동시에 계산할 수 있지만, 생성 때는 $x_i$를 뽑아야 다음 문맥이 생깁니다. 가운데 픽셀을 보면 자기 자신을 보고 맞히는 것이 되고, 자기회귀 모델은 로그 가능도를 정확히 계산합니다.` },
      // 23.2
      { sec: '23.2', type: 'mc', lv: 1, q: R`잠재 변수 모델 $p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z$에서 ($\mathbf z$가 연속이고 디코더가 신경망일 때) 일반적으로 어려운 것은?`,
        choices: [R`$\mathbf z\sim p(\mathbf z)$를 뽑기`, R`주어진 $\mathbf z$에서 $\mathbf x$를 뽑기`, R`$p_\theta(\mathbf x)$와 사후분포 $p_\theta(\mathbf z\mid\mathbf x)$를 계산하기`, R`디코더 $f_\theta(\mathbf z)$를 계산하기`], ans: 2,
        sol: R`뽑기는 두 단계를 차례로 하면 되지만, $p_\theta(\mathbf x)$는 모든 $\mathbf z$에 대한 적분이라 닫힌 형태가 없고, 사후분포는 분모에 그 적분이 있습니다.` },
      { sec: '23.2', type: 'num', lv: 1, q: R`$z\in\{1,2\}$, $p(z=1)=0.4$, $p(x=1\mid z=1)=0.5$, $p(x=1\mid z=2)=0.1$일 때 $p(x=1)$은?`, ans: '0.26', ansTex: R`0.4\cdot0.5+0.6\cdot0.1=0.26`,
        sol: R`$0.4\cdot0.5+0.6\cdot0.1=0.2+0.06=0.26$입니다.` },
      { sec: '23.2', type: 'num', lv: 2, q: R`위 문제의 모델에서 사후확률 $p(z=1\mid x=1)$은?`, ans: '10/13', ansTex: R`\frac{0.2}{0.26}=\frac{10}{13}\approx0.769`,
        sol: R`베이즈 정리로 $p(z=1\mid x=1)=\frac{p(x=1\mid z=1)p(z=1)}{p(x=1)}=\frac{0.2}{0.26}=\frac{10}{13}\approx0.769$입니다.` },
      { sec: '23.2', type: 'num', lv: 2, q: R`$p(z=1)=p(z=2)=\frac12$, $x\mid z=1\sim\N(0,1)$, $x\mid z=2\sim\N(2,1)$인 가우시안 혼합에서 $x=1$의 밀도 $p(x)$는? (식으로 입력해도 됩니다)`, ans: 'e^(-1/2)/sqrt(2*pi)', ansTex: R`\frac1{\sqrt{2\pi}}e^{-1/2}\approx0.242`,
        sol: R`$x=1$은 두 성분의 평균에서 모두 거리 $1$이라 $p(x\mid z)=\frac1{\sqrt{2\pi}}e^{-1/2}$로 같습니다. 따라서 $p(x)=\frac12\cdot\frac{e^{-1/2}}{\sqrt{2\pi}}+\frac12\cdot\frac{e^{-1/2}}{\sqrt{2\pi}}=\frac{e^{-1/2}}{\sqrt{2\pi}}\approx0.242$입니다.` },
      { sec: '23.2', type: 'open', lv: 3, proof: true, q: R`잠재 변수 모델의 몬테카를로 추정량 $\hat p_K=\frac1K\sum_{k=1}^Kp_\theta(\mathbf x\mid\mathbf z_k)$ ($\mathbf z_k\sim p(\mathbf z)$ 독립)에 대해 (1) $\E[\hat p_K]=p_\theta(\mathbf x)$임을 보이시오. (2) $\Var(\hat p_K)=\frac1K\Var_{p(\mathbf z)}[p_\theta(\mathbf x\mid\mathbf z)]$임을 보이시오. (3) 예제 3의 모델($p(z=1)=0.3$, $p(x=1\mid z=1)=0.9$, $p(x=1\mid z=2)=0.2$)에서 $x=1$, $K=1$일 때 이 분산을 구하시오.`,
        sol: R`**(1)** $Y_k=p_\theta(\mathbf x\mid\mathbf z_k)$로 두면 $\E[Y_k]=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z=p_\theta(\mathbf x)$이고, 기댓값의 선형성으로 $\E[\hat p_K]=\frac1K\sum_k\E[Y_k]=p_\theta(\mathbf x)$.
**(2)** $Y_k$들이 독립이고 분포가 같으므로 $\Var(\hat p_K)=\frac1{K^2}\sum_k\Var(Y_k)=\frac1K\Var(Y_1)$.
**(3)** $Y$는 확률 $0.3$으로 $0.9$, $0.7$로 $0.2$. $\E[Y]=0.41$, $\E[Y^2]=0.3\cdot0.81+0.7\cdot0.04=0.271$이므로 $\Var(Y)=0.271-0.1681=0.1029$. 평균 $0.41$에 비해 표준편차 $0.32$가 커서, 높은 차원에서는 이 비가 훨씬 나빠집니다.` },
      // 23.3
      { sec: '23.3', type: 'mc', lv: 1, q: R`오토인코더를 학습할 때 필요한 자료는?`,
        choices: [R`입력 $\mathbf x$들만`, R`입력과 표시의 쌍 $(\mathbf x,y)$`, R`각 입력에 맞는 코드 $\mathbf z$의 정답`, R`사전분포에서 뽑은 $\mathbf z$들`], ans: 0,
        sol: R`손실 $\lVert\mathbf x-f_\theta(g_\phi(\mathbf x))\rVert^2$에는 입력만 들어가므로 표시가 필요 없습니다(자기 지도 학습).` },
      { sec: '23.3', type: 'num', lv: 2, q: R`$\mathbf w=\frac15(3,4)$, $\mathbf x=(2,1)$일 때 선형 오토인코더($z=\mathbf w^T\mathbf x$, $\hat{\mathbf x}=z\mathbf w$)의 복원 손실 $\lVert\mathbf x-\hat{\mathbf x}\rVert^2$은?`, ans: '1', ansTex: R`\lVert(0.8,-0.6)\rVert^2=1`,
        sol: R`$z=\frac{6+4}5=2$, $\hat{\mathbf x}=(1.2,1.6)$, 차이 $(0.8,-0.6)$의 제곱합은 $0.64+0.36=1$. 공식 $\lVert\mathbf x\rVert^2-z^2=5-4=1$과 같습니다.` },
      { sec: '23.3', type: 'mc', lv: 2, q: R`오토인코더의 코드 차원이 입력 차원 이상($d\ge D$)이면 어떤 문제가 있는가?`,
        choices: [R`항등 함수를 배워 손실이 $0$이 될 수 있어, 쓸모 있는 요약을 배운다는 보장이 없다`, R`학습이 불가능하다`, R`자동으로 생성 모델이 된다`, R`반드시 PCA와 같은 해가 된다`], ans: 0,
        sol: R`병목이 없으면 인코더와 디코더가 입력을 그대로 넘기기만 해도 손실이 $0$입니다. 병목이 있어야 자료의 구조를 요약하도록 강제됩니다.` },
      { sec: '23.3', type: 'mc', lv: 2, q: R`학습된 보통의 오토인코더에서 디코더만 떼어 새 이미지를 만들기 어려운 주된 이유는?`,
        choices: [R`코드 $\mathbf z$의 분포를 몰라 디코더에 넣을 $\mathbf z$를 어디서 뽑을지 정할 수 없다`, R`디코더가 미분 불가능하다`, R`디코더의 입력 차원이 출력 차원보다 크다`, R`손실이 제곱 오차이기 때문이다`], ans: 0,
        sol: R`학습 자료의 코드는 코드 공간의 일부에만 흩어져 있고 그 분포가 정해져 있지 않습니다. VAE는 KL 항으로 코드의 분포를 $\N(\mathbf 0,I)$에 맞춰 이 문제를 풉니다.` },
      { sec: '23.3', type: 'open', lv: 3, proof: true, quiz: true, q: R`$\lVert\mathbf w\rVert=1$인 선형 오토인코더 $z=\mathbf w^T\mathbf x$, $\hat{\mathbf x}=z\mathbf w$에 대해 (1) $\lVert\mathbf x-\hat{\mathbf x}\rVert^2=\lVert\mathbf x\rVert^2-(\mathbf w^T\mathbf x)^2$임을 보이시오. (2) $\sum_i\lVert\mathbf x_i-\hat{\mathbf x}_i\rVert^2$을 최소화하는 $\mathbf w$가 $C=\sum_i\mathbf x_i\mathbf x_i^T$의 가장 큰 고윳값의 단위 고유벡터임을 보이시오. (3) 자료 $\mathbf x_1=(3,1)$, $\mathbf x_2=(1,3)$에서 최적의 $\mathbf w$와 최소 손실을 구하시오.`,
        sol: R`**(1)** $\lVert\mathbf x-z\mathbf w\rVert^2=\lVert\mathbf x\rVert^2-2z\,\mathbf w^T\mathbf x+z^2\lVert\mathbf w\rVert^2=\lVert\mathbf x\rVert^2-2z^2+z^2=\lVert\mathbf x\rVert^2-z^2$.
**(2)** 합은 $\sum_i\lVert\mathbf x_i\rVert^2-\sum_i(\mathbf w^T\mathbf x_i)^2=\text{상수}-\mathbf w^TC\mathbf w$이므로 $\mathbf w^TC\mathbf w$를 최대화하면 됩니다. $C$는 대칭이라 $C=Q\Lambda Q^T$로 쓰고 $\mathbf a=Q^T\mathbf w$ ($\lVert\mathbf a\rVert=1$)로 두면 $\mathbf w^TC\mathbf w=\sum_k\lambda_ka_k^2\le\lambda_{\max}\sum_ka_k^2=\lambda_{\max}$이고, 등호는 $\mathbf w$가 $\lambda_{\max}$의 고유벡터일 때입니다.
**(3)** $C=\begin{pmatrix}10&6\\6&10\end{pmatrix}$의 고윳값은 $16$($\frac1{\sqrt2}(1,1)$)과 $4$($\frac1{\sqrt2}(1,-1)$). 최적 $\mathbf w=\frac1{\sqrt2}(1,1)$, 최소 손실 $=\lVert\mathbf x_1\rVert^2+\lVert\mathbf x_2\rVert^2-16=20-16=4$.`,
        rubric: R`- (1) 전개와 $\lVert\mathbf w\rVert=1$의 사용 — 3점
- (2) $\mathbf w^TC\mathbf w$ 최대화로 바꾸고 고윳값 분해로 상한과 등호 조건 — 4점
- (3) $C$, 고윳값, 최적 $\mathbf w$와 손실 $4$ — 3점` },
      // 23.4
      { sec: '23.4', type: 'mc', lv: 1, q: R`교차 엔트로피 $H(p,q)=-\E_p[\log q]$를 나눈 것으로 옳은 것은?`,
        choices: [R`$\KL(p\,\|\,q)+H(p)$`, R`$\KL(q\,\|\,p)+H(q)$`, R`$\KL(p\,\|\,q)-H(p)$`, R`$H(p)+H(q)$`], ans: 0,
        sol: R`$-\E_p[\log q]=\E_p[\log\frac pq]-\E_p[\log p]=\KL(p\,\|\,q)+H(p)$입니다.` },
      { sec: '23.4', type: 'num', lv: 2, q: R`$\KL(\mathrm{Bern}(0.8)\,\|\,\mathrm{Bern}(0.5))$은? (자연로그, 식으로 입력해도 됩니다)`, ans: '0.8*ln(1.6)+0.2*ln(0.4)', ansTex: R`0.8\ln1.6+0.2\ln0.4\approx0.193`,
        sol: R`$0.8\ln\frac{0.8}{0.5}+0.2\ln\frac{0.2}{0.5}\approx0.3760-0.1833=0.193$입니다.` },
      { sec: '23.4', type: 'num', lv: 1, q: R`동전을 $20$번 던져 앞면이 $6$번 나왔을 때 $p_\theta(1)=\theta$의 최대가능도 추정값은?`, ans: '0.3', ansTex: R`6/20=0.3`,
        sol: R`로그 가능도 $6\ln\theta+14\ln(1-\theta)$의 도함수 $\frac6\theta-\frac{14}{1-\theta}=0$에서 $\theta=0.3$입니다.` },
      { sec: '23.4', type: 'num', lv: 2, q: R`$p_{data}=\mathrm{Bern}(0.7)$, $p_\theta=\mathrm{Bern}(0.9)$의 교차 엔트로피 $H(p_{data},p_\theta)$는? (자연로그, 식으로 입력해도 됩니다)`, ans: '-0.7*ln(0.9)-0.3*ln(0.1)', ansTex: R`-0.7\ln0.9-0.3\ln0.1\approx0.7645`,
        sol: R`$-0.7\ln0.9-0.3\ln0.1\approx0.0738+0.6908=0.7645$. $H(p_{data})\approx0.6109$이므로 $\KL(p_{data}\,\|\,p_\theta)\approx0.1537$이고, 합이 교차 엔트로피와 같습니다.` },
      { sec: '23.4', type: 'mc', lv: 2, q: R`최대가능도가 줄이는 것이 $\KL(p_{data}\,\|\,p_\theta)$이고, 반대 방향 $\KL(p_\theta\,\|\,p_{data})$를 학습 목표로 쓰지 않는 이유로 알맞은 것은?`,
        choices: [R`반대 방향은 $p_{data}$의 밀도 값이 필요하지만 우리에게는 표본만 있다`, R`반대 방향은 항상 $0$이다`, R`KL은 대칭이라 두 방향이 같다`, R`반대 방향은 음수가 될 수 있다`], ans: 0,
        sol: R`$\KL(p_\theta\,\|\,p_{data})=\E_{p_\theta}[\log p_\theta-\log p_{data}]$에는 $\log p_{data}$가 들어 있어 계산할 수 없습니다. KL은 대칭이 아니고 늘 $0$ 이상입니다.` },
      { sec: '23.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`독립 표본 $\mathbf x_1,\dots,\mathbf x_N\sim p_{data}$와 모형 $p_\theta$에 대해 (1) $\argmax_\theta\prod_ip_\theta(\mathbf x_i)=\argmax_\theta\frac1N\sum_i\log p_\theta(\mathbf x_i)$임을 이유와 함께 보이시오. (2) 큰 수의 법칙을 써서 $N\to\infty$일 때 이 목표가 $-H(p_{data},p_\theta)$로 수렴함을 보이시오. (3) $H(p,q)=\KL(p\,\|\,q)+H(p)$를 보이고, 최대가능도가 $\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$에 해당함을 결론지으시오.`,
        sol: R`**(1)** $\log$는 순증가 함수이므로 $\argmax$를 바꾸지 않고, $\log\prod_i=\sum_i\log$. 양수 $\frac1N$을 곱해도 $\argmax$는 같습니다.
**(2)** $Y_i=\log p_\theta(\mathbf x_i)$는 독립이고 분포가 같으며 평균이 $\E_{p_{data}}[\log p_\theta(\mathbf x)]$이므로(이 기댓값이 유한하다고 가정), 큰 수의 법칙으로 $\frac1N\sum_iY_i\to\E_{p_{data}}[\log p_\theta(\mathbf x)]=-H(p_{data},p_\theta)$.
**(3)** $H(p,q)=-\E_p[\log q]=\E_p[\log\frac pq]-\E_p[\log p]=\KL(p\,\|\,q)+H(p)$. 따라서 $\argmax_\theta(-H(p_{data},p_\theta))=\argmin_\theta[\KL(p_{data}\,\|\,p_\theta)+H(p_{data})]=\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$이고, 마지막 등호는 $H(p_{data})$가 $\theta$와 무관하기 때문입니다.`,
        rubric: R`- (1) $\log$의 단조성과 곱을 합으로 — 2점
- (2) 독립·같은 분포와 큰 수의 법칙, 교차 엔트로피로 쓰기 — 4점
- (3) 분해의 증명과 $H(p_{data})$가 상수라는 결론 — 4점` },
      // 23.5
      { sec: '23.5', type: 'mc', lv: 1, q: R`ELBO를 유도할 때 쓰는 부등식은?`,
        choices: [R`$\log\E[Y]\ge\E[\log Y]$ (젠센, $\log$가 오목)`, R`$\log\E[Y]\le\E[\log Y]$`, R`코시-슈바르츠 부등식`, R`마르코프 부등식`], ans: 0,
        sol: R`$\log$가 오목하므로 젠센 부등식은 $\log\E[Y]\ge\E[\log Y]$이고, $Y=p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/q(\mathbf z\mid\mathbf x)$에 쓰면 하한이 나옵니다.` },
      { sec: '23.5', type: 'num', lv: 2, q: R`$z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.6$, $p(x\mid z=2)=0.2$일 때 균등한 $q$의 틈 $\log p(x)-\mathrm{ELBO}$는? (자연로그, 식으로 입력해도 됩니다)`, ans: '0.5*ln(4/3)', ansTex: R`\tfrac12\ln\tfrac43\approx0.144`,
        sol: R`$p(x)=0.4$이므로 $\log p(x)=\ln0.4\approx-0.916$. $\mathrm{ELBO}=\frac12\ln\frac{0.3}{0.5}+\frac12\ln\frac{0.1}{0.5}=\frac12\ln0.12\approx-1.060$이고 틈은 $0.144$입니다. 사후분포 $(0.75,0.25)$와의 $\KL=\frac12\ln\frac{0.5}{0.75}+\frac12\ln\frac{0.5}{0.25}=\frac12\ln\frac43$으로 같습니다.` },
      { sec: '23.5', type: 'mc', lv: 2, q: R`$\log p_\theta(\mathbf x)-\mathrm{ELBO}(q_\phi)$와 같은 것은?`,
        choices: [R`$\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$`, R`$\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$`, R`$\KL(p_\theta(\mathbf z\mid\mathbf x)\,\|\,q_\phi(\mathbf z\mid\mathbf x))$`, R`언제나 $0$`], ans: 0,
        sol: R`$\log p_\theta(\mathbf x)=\E_q[\log\frac{p_\theta(\mathbf x,\mathbf z)}{q}]+\E_q[\log\frac q{p_\theta(\mathbf z\mid\mathbf x)}]$이고 둘째 항이 $q$에서 진짜 사후분포로의 KL입니다. 둘째 보기의 KL은 ELBO 안에 들어 있는 항입니다.` },
      { sec: '23.5', type: 'mc', lv: 2, q: R`$\theta$를 고정하고 ELBO를 $\phi$에 대해 최대화하면 어떤 일이 일어나는가?`,
        choices: [R`$\log p_\theta(\mathbf x)$는 그대로이고 $q_\phi$가 사후분포에 가까워진다`, R`$\log p_\theta(\mathbf x)$가 커진다`, R`사전분포 $p(\mathbf z)$가 바뀐다`, R`틈이 커진다`], ans: 0,
        sol: R`$\log p_\theta(\mathbf x)=\mathrm{ELBO}+\KL(q_\phi\,\|\,p_\theta(\mathbf z\mid\mathbf x))$에서 왼쪽은 $\phi$와 무관하므로, ELBO가 커지면 KL이 같은 만큼 줄어듭니다.` },
      { sec: '23.5', type: 'num', lv: 1, q: R`$z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.6$, $p(x\mid z=2)=0.2$일 때 사후확률 $p(z=1\mid x)$는?`, ans: '0.75', ansTex: R`\frac{0.3}{0.4}=0.75`,
        sol: R`$p(z=1\mid x)=\frac{0.5\cdot0.6}{0.5\cdot0.6+0.5\cdot0.2}=\frac{0.3}{0.4}=0.75$입니다. $q$를 이 분포로 고르면 ELBO가 $\log p(x)$와 같아집니다.` },
      { sec: '23.5', type: 'open', lv: 3, proof: true, quiz: true, q: R`잠재 변수 모델 $p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z$와 분포 $q(\mathbf z\mid\mathbf x)$에 대해 (1) 필요한 가정을 밝히고 젠센 부등식으로 $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$를 유도하시오. (2) 틈이 $\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$임을 보이고 등호 조건을 쓰시오. (3) $z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.9$, $p(x\mid z=2)=0.1$에서 균등한 $q$의 ELBO와 틈을 구하시오.`,
        sol: R`**(1)** 가정: $p_\theta(\mathbf x,\mathbf z)>0$인 곳에서 $q(\mathbf z\mid\mathbf x)>0$. 그러면 $p_\theta(\mathbf x)=\int q\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q}\,d\mathbf z=\E_q\big[\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q}\big]$이고, $\log$가 오목하므로 젠센으로 $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]+\E_q[\log\frac{p(\mathbf z)}q]=\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$.
**(2)** $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)=p_\theta(\mathbf z\mid\mathbf x)p_\theta(\mathbf x)$이므로 $\mathrm{ELBO}=\E_q[\log\frac{p_\theta(\mathbf z\mid\mathbf x)p_\theta(\mathbf x)}q]=\log p_\theta(\mathbf x)-\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$. KL은 $0$ 이상이고 $q=p_\theta(\mathbf z\mid\mathbf x)$일 때만 $0$이므로 그때 등호입니다.
**(3)** $p(x)=0.5$, $\log p(x)=\ln0.5\approx-0.693$. $\mathrm{ELBO}=\frac12\ln\frac{0.45}{0.5}+\frac12\ln\frac{0.05}{0.5}=\frac12\ln0.09\approx-1.204$, 틈 $=\ln\frac53\approx0.511$. 사후분포 $(0.9,0.1)$와의 $\KL=\frac12\ln\frac{0.5}{0.9}+\frac12\ln\frac{0.5}{0.1}=\frac12\ln\frac{25}9=\ln\frac53$으로 같습니다.`,
        rubric: R`- (1) $q>0$ 가정, 곱하고 나누기, 젠센, 두 항으로 나누기 — 4점
- (2) 베이즈 규칙으로 틈이 KL임과 등호 조건 — 3점
- (3) ELBO와 틈의 계산 — 3점` },
      // 23.6
      { sec: '23.6', type: 'mc', lv: 1, q: R`VAE의 가정이 아닌 것은?`,
        choices: [R`$p(\mathbf z)=\N(\mathbf 0,I)$`, R`$q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$, $\Sigma_\phi$는 대각`, R`$p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$`, R`$p(\mathbf z)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$`], ans: 3,
        sol: R`사전분포는 $\mathbf x$와 무관한 $\N(\mathbf 0,I)$로 고정되고, $\mathbf x$에 의존하는 $\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$는 인코더(근사 사후분포)입니다.` },
      { sec: '23.6', type: 'num', lv: 1, q: R`$\KL(\N(1,2)\,\|\,\N(0,1))$은? ($\N(\mu,\sigma^2)$ 표기, 식으로 입력해도 됩니다)`, ans: '0.5*(2-ln(2))', ansTex: R`\tfrac12(2+1-1-\ln2)\approx0.653`,
        sol: R`$\frac12(\sigma^2+\mu^2-1-\ln\sigma^2)=\frac12(2+1-1-\ln2)=\frac12(2-\ln2)\approx0.653$입니다.` },
      { sec: '23.6', type: 'num', lv: 2, q: R`$d=2$에서 $\mu=(1,0)$, $\Sigma=\diag(1,4)$일 때 $\KL(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I))$는? (식으로 입력해도 됩니다)`, ans: '2-ln(2)', ansTex: R`\tfrac12(5+1-2-\ln4)=2-\ln2\approx1.307`,
        sol: R`$\tr\Sigma=5$, $\lVert\mu\rVert^2=1$, $\log\det\Sigma=\ln4$이므로 $\frac12(5+1-2-\ln4)=2-\ln2\approx1.307$입니다. 좌표별로 $\frac12(1+1-1-0)+\frac12(4+0-1-\ln4)$를 더해도 같습니다.` },
      { sec: '23.6', type: 'num', lv: 2, q: R`$D=3$, $\tau^2=2$, $\mathbf x=(1,1,1)$, $f_\theta(\mathbf z)=(1,-1,1)$일 때 $-\log p_\theta(\mathbf x\mid\mathbf z)$는? (자연로그, 식으로 입력해도 됩니다)`, ans: '1+1.5*ln(4*pi)', ansTex: R`\tfrac{4}{4}+\tfrac32\ln(4\pi)\approx4.797`,
        sol: R`$\frac1{2\tau^2}\lVert(0,2,0)\rVert^2=\frac44=1$, $\frac D2\ln(2\pi\tau^2)=\frac32\ln(4\pi)\approx3.797$. 합은 약 $4.797$입니다.` },
      { sec: '23.6', type: 'open', lv: 3, proof: true, quiz: true, q: R`(1) $d=1$에서 $\KL(\N(\mu,\sigma^2)\,\|\,\N(0,1))=\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$를 증명하시오. (2) 이를 써서 $\Sigma$가 대각일 때 $\KL(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I))=\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$임을 보이시오. (3) $\mu$를 고정할 때 1차원 KL을 최소로 하는 $\sigma^2$과 그 최솟값을 구하시오.`,
        sol: R`**(1)** $q=\N(\mu,\sigma^2)$, $p=\N(0,1)$이면 $\log q(z)=-\frac12\log(2\pi\sigma^2)-\frac{(z-\mu)^2}{2\sigma^2}$, $\log p(z)=-\frac12\log(2\pi)-\frac{z^2}2$. $\E_q[(z-\mu)^2]=\sigma^2$, $\E_q[z^2]=\sigma^2+\mu^2$이므로 $\KL=\E_q[\log q-\log p]=-\frac12\log\sigma^2-\frac12+\frac12(\sigma^2+\mu^2)$.
**(2)** 대각이면 $q$와 $p$가 모두 좌표마다 독립인 곱이라 로그가 합으로 나뉘고, $\KL=\sum_k\KL(\N(\mu_k,\sigma_k^2)\,\|\,\N(0,1))=\frac12\sum_k(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$. $\sum_k\sigma_k^2=\tr\Sigma$, $\sum_k\mu_k^2=\lVert\mu\rVert^2$, $\sum_k\log\sigma_k^2=\log\det\Sigma$이므로 주어진 식입니다.
**(3)** $\frac{\partial}{\partial\sigma^2}\KL=\frac12(1-\frac1{\sigma^2})=0$에서 $\sigma^2=1$이고, 이차 도함수 $\frac1{2\sigma^4}>0$이라 최소. 최솟값은 $\frac12\mu^2$입니다.`,
        rubric: R`- (1) 두 로그 밀도와 $\E_q[z^2]=\sigma^2+\mu^2$를 써서 정리 — 4점
- (2) 독립 좌표의 합으로 나누고 대각합·행렬식으로 쓰기 — 3점
- (3) $\sigma^2=1$과 최솟값 $\frac12\mu^2$ — 3점` },
      { sec: '23.6', type: 'open', lv: 2, proof: true, quiz: true, q: R`$p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$ ($\mathbf x\in\mathbb R^D$)일 때 (1) $-\log p_\theta(\mathbf x\mid\mathbf z)=\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$를 유도하시오. (2) $\tau$가 고정되면 $\theta$에 대한 최적화가 제곱 오차 최소화와 같음을 설명하시오. (3) $\tau^2$을 작게 하면 ELBO에서 어느 항의 비중이 커지는지 쓰시오.`,
        sol: R`**(1)** 밀도는 $(2\pi\tau^2)^{-D/2}\exp(-\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2)$이고 로그에 $-1$을 곱하면 주어진 식입니다.
**(2)** 둘째 항은 $\theta$와 무관한 상수이고 첫째 항은 제곱 오차에 양수 $\frac1{2\tau^2}$을 곱한 것이라, 최소점이 같습니다.
**(3)** 음의 ELBO는 $\frac1{2\tau^2}\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\KL$에 상수를 더한 것이므로, $\tau^2$이 작으면 복원 항의 비중이 커져 오토인코더에 가까워집니다.`,
        rubric: R`- (1) 가우시안 밀도의 로그 — 4점
- (2) 상수항과 양의 배수 — 3점
- (3) 복원 항의 비중 — 3점` },
      // 23.7
      { sec: '23.7', type: 'mc', lv: 1, q: R`$\varepsilon\sim\N(0,1)$, $\sigma>0$일 때 $z=\mu+\sigma\varepsilon$의 분포는?`,
        choices: [R`$\N(\mu,\sigma^2)$`, R`$\N(\mu,\sigma)$`, R`$\N(0,\sigma^2)$`, R`$\N(\mu,1)$`], ans: 0,
        sol: R`가우시안의 선형 변환은 가우시안이고, $\E[z]=\mu$, $\Var(z)=\sigma^2$입니다($\N(\mu,\sigma^2)$은 분산 표기).` },
      { sec: '23.7', type: 'num', lv: 1, q: R`$\mu=1$, $\sigma=0.5$, 뽑힌 잡음 $\varepsilon=-2$일 때 $z=\mu+\sigma\varepsilon$은?`, ans: '0', ansTex: R`1+0.5\cdot(-2)=0`,
        sol: R`$1+0.5\cdot(-2)=0$입니다.` },
      { sec: '23.7', type: 'num', lv: 2, q: R`$f(z)=z^2$, $z=\mu+\sigma\varepsilon$에서 $\mu=2$, $\sigma=1$, $\varepsilon=1$일 때 $\partial f/\partial\sigma$는?`, ans: '6', ansTex: R`2z\varepsilon=2\cdot3\cdot1=6`,
        sol: R`$z=3$이고 $\frac{\partial f}{\partial\sigma}=f'(z)\frac{\partial z}{\partial\sigma}=2z\cdot\varepsilon=6$입니다.` },
      { sec: '23.7', type: 'mc', lv: 2, q: R`VAE에서 재매개변수화가 필요한 이유로 가장 알맞은 것은?`,
        choices: [R`$\mathbf z$를 $q_\phi$에서 직접 뽑으면 $\mathbf z$가 $\phi$의 미분 가능한 함수가 아니어서 복원 항의 기울기를 $\phi$로 전할 수 없다`, R`KL 항을 닫힌 식으로 계산할 수 없어서`, R`디코더의 기울기 $\partial R/\partial\theta$를 계산할 수 없어서`, R`사전분포를 학습하기 위해서`], ans: 0,
        sol: R`KL 항은 닫힌 식이라 $\mu$, $\sigma$로 바로 미분되고, $\theta$의 기울기도 문제없습니다. 막히는 것은 뽑기를 지나 $\phi$로 가는 복원 항의 기울기입니다.` },
      { sec: '23.7', type: 'num', lv: 2, q: R`$R=\frac12(x-wz)^2$, $z=\mu+\sigma\varepsilon$에서 $x=3$, $w=1$, $\mu=1$, $\sigma=1$, $\varepsilon=1$일 때 $\partial R/\partial\sigma$는?`, ans: '-1', ansTex: R`-(x-wz)\,w\,\varepsilon=-1`,
        sol: R`$z=2$, $\frac{\partial R}{\partial z}=-(x-wz)w=-1$, $\frac{\partial z}{\partial\sigma}=\varepsilon=1$이므로 $-1$입니다. $\sigma$를 키우면 이 표본에서는 손실이 줄어듭니다.` },
      { sec: '23.7', type: 'open', lv: 3, proof: true, quiz: true, q: R`$\varepsilon\sim\N(0,1)$, $z=\mu+\sigma\varepsilon$ ($\sigma>0$)에 대해 (1) $\E[z]=\mu$, $\Var(z)=\sigma^2$임을 보이시오. (2) $\partial z/\partial\mu$, $\partial z/\partial\sigma$를 구하고, 미분 가능한 $f$에 대해 $\frac{\partial}{\partial\mu}\E[f(z)]=\E[f'(z)]$, $\frac{\partial}{\partial\sigma}\E[f(z)]=\E[f'(z)\varepsilon]$임을 설명하시오(미분과 기댓값의 순서를 바꿀 수 있다고 가정). (3) $f(z)=z^2$일 때 두 식의 양변을 직접 계산해 확인하시오.`,
        sol: R`**(1)** 기댓값의 선형성으로 $\E[z]=\mu+\sigma\E[\varepsilon]=\mu$, $\Var(z)=\sigma^2\Var(\varepsilon)=\sigma^2$.
**(2)** $\frac{\partial z}{\partial\mu}=1$, $\frac{\partial z}{\partial\sigma}=\varepsilon$. 기댓값이 $\varepsilon$의 분포로 쓰여 $\mu$, $\sigma$와 무관하므로 $\frac{\partial}{\partial\mu}\E_\varepsilon[f(\mu+\sigma\varepsilon)]=\E_\varepsilon[f'(z)\cdot1]$, $\frac{\partial}{\partial\sigma}\E_\varepsilon[f(\mu+\sigma\varepsilon)]=\E_\varepsilon[f'(z)\varepsilon]$.
**(3)** $\E[z^2]=\mu^2+\sigma^2$이므로 왼쪽은 $2\mu$와 $2\sigma$. 오른쪽은 $\E[2z]=2\mu$, $\E[2z\varepsilon]=2\mu\E[\varepsilon]+2\sigma\E[\varepsilon^2]=2\sigma$로 같습니다.`,
        rubric: R`- (1) 평균과 분산 — 2점
- (2) 두 편도함수와 기댓값이 $\varepsilon$의 분포로 쓰인다는 핵심 — 5점
- (3) $f=z^2$의 확인 — 3점` },
    ],
  });
})();
