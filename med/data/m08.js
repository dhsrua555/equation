/* 08 경사하강법 — Bishop 7.1–7.3 (p.210–224), 강의 Ch07 s.2–21 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 8, part: 'C', title: '경사하강법과 옵티마이저', en: 'Gradient Descent Optimization', ref: 'Bishop §7.1–7.3', plot: 'momentum',
    fig: R`좁은 골짜기에서 보통의 경사하강법은 지그재그로(가는 선), 모멘텀은 미끄러지듯(굵은 선) 내려감`,
    tagline: R`오차 곡면에서 −∇E 방향으로. 미니배치로 싸게, 모멘텀으로 관성을, AdaGrad·RMSProp·Adam으로 파라미터마다 다른 학습률을.`,
    summary: R`경사하강법은 신경망 학습의 핵심 최적화 알고리즘으로, 역전파로 구한 기울기의 반대 방향으로 파라미터를 반복 갱신합니다. 다만 최종 목표는 훈련오차 최소화가 아니라 일반화입니다. 오차 곡면과 정류점, 배치·확률적·미니배치 경사하강법과 에폭, 대칭 깨기를 위한 무작위 초기화(Xavier·He), 학습률이 수렴에 미치는 영향과 곡률이 다른 방향의 진동, **모멘텀**(유효 학습률 $\eta/(1-\mu)$)과 네스테로프 모멘텀, 학습률 스케줄, 그리고 적응형 옵티마이저 **AdaGrad·RMSProp·Adam**(편향 보정 포함)을 다룹니다.`,
    goals: [
      R`$\delta E\simeq\delta\mathbf w^T\nabla E$에서 경사하강법의 방향을 설명하고 정류점을 정의할 수 있다`,
      R`배치·확률적·미니배치 경사하강법의 갱신식·장단점과 에폭, 미니배치 알고리즘을 쓸 수 있다`,
      R`대칭 깨기의 필요성과 Xavier·He 초기화의 분산을 말할 수 있다`,
      R`모멘텀 갱신식과 유효 학습률 $\eta/(1-\mu)$를 유도하고 네스테로프 모멘텀과 비교할 수 있다`,
      R`선형·거듭제곱·지수 학습률 스케줄을 계산할 수 있다`,
      R`AdaGrad, RMSProp, Adam의 갱신식과 Adam의 편향 보정 이유를 설명할 수 있다`,
    ],
    secTitles: { '7.1': '오차 곡면', '7.2': '배치·SGD·미니배치', '7.2b': '초기화', '7.3': '학습률과 수렴', '7.3b': '모멘텀', '7.3c': '학습률 스케줄', '7.3d': 'AdaGrad·RMSProp·Adam' },
    sections: [
      { k: '7.1', label: '7.1', p: '210', src: '슬라이드 2–4', title: '오차 곡면', body: R`
경사하강법은 오차함수를 줄이기 위해 **음의 기울기 방향**으로 파라미터를 반복 갱신합니다. 기울기는 **역전파**로 효율적으로 계산합니다(10단원). 오차함수는 흔히 최대가능도에서 오지만, 궁극적 목표는 훈련오차가 아니라 보지 못한 자료에 대한 **일반화**입니다.

가중치 공간에서 $\mathbf w$에서 $\mathbf w+\delta\mathbf w$로 작게 움직이면
$$\delta E\simeq\delta\mathbf w^T\nabla E(\mathbf w).$$
- **정류점**(국소 최소 $\mathbf w_A$, 전역 최소 $\mathbf w_B$ 등): $\nabla E(\mathbf w)=0$
- 오차를 줄이려면 $-\nabla E(\mathbf w)$ 방향으로 작게 움직입니다 → **경사하강법**
:::fig errsurf
:::

:::note 국소 이차 근사 (교재 7.1.1)
최소점 $\mathbf w^\star$ 근처에서 $E(\mathbf w)\simeq E(\mathbf w^\star)+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$ ($\nabla E(\mathbf w^\star)=0$).[[@base:ch04:4.3|다변수 테일러 전개와 헤시안: 최소점 근처의 이차 근사.]] 헤시안 $\mathbf H$의 고유벡터 $\mathbf u_i$ 방향으로 등고선이 타원이고, 고윳값 $\lambda_i$가 클수록(곡률이 클수록) 그 방향 축이 짧습니다. $\mathbf H$가 양의 정부호이면 극소입니다[[@em:ch07:8.4|이차형식의 주축 변환.]].
:::
` },
      { k: '7.2', label: '7.2–7.2.4', p: '213', src: '슬라이드 5–10', title: '배치, 확률적, 미니배치 경사하강법', body: R`
:::key 배치·확률적 경사하강법
$$\text{배치:}\quad\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\eta\nabla E(\mathbf w^{(\tau-1)})$$
$$E(\mathbf w)=\sum_{n=1}^NE_n(\mathbf w),\qquad \text{SGD:}\quad\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\eta\nabla E_n(\mathbf w^{(\tau-1)})$$
$\eta$: 학습률. 미니배치 SGD: $\mathbf w\leftarrow\mathbf w-\eta\nabla E_{n:n+B-1}(\mathbf w)$.
:::

**배치 경사하강법**(최급강하): 매 갱신 후 새 $\mathbf w^{(\tau)}$에서 기울기를 다시 계산하는데, $\nabla E$를 구하려면 **훈련 자료 전체**를 처리해야 합니다. 자료가 많으면 극도로 비효율적입니다.

**확률적 경사하강법**(SGD, 온라인 경사하강법): 독립 관측의 최대가능도 오차는 자료점마다의 항의 합이므로, **한 번에 한 점**으로 갱신합니다.
- 한 번 전체를 훑는 것이 **에폭**(epoch)입니다.
- SGD는 자료의 **중복**을 훨씬 효율적으로 다룹니다(같은 자료를 두 번 복사해도 배치 GD는 계산만 두 배).
- **국소 최소에서 탈출**하기 쉽습니다: 전체 자료의 정류점이 개별 자료점의 정류점은 대개 아니기 때문입니다.

:::key 확률적 경사하강법 (Algorithm 7.1)
입력: 훈련 자료 $n\in\{1,\dots,N\}$, 자료점마다의 오차 $E_n(\mathbf w)$, 학습률 $\eta$, 초기 가중치 $\mathbf w$. 출력: 최종 가중치 $\mathbf w$.
1. $n\leftarrow1$
2. 반복: $\mathbf w\leftarrow\mathbf w-\eta\nabla E_n(\mathbf w)$ (가중치 갱신), $n\leftarrow n+1\ (\mathrm{mod}\ N)$ (자료를 순서대로 돌기)
3. 수렴할 때까지 반복하고 $\mathbf w$를 반환
:::

:::ex 예제 1 — 한 에폭의 SGD
자료 $(x_n,t_n)=(1,2),(2,3)$, 모델 $y=wx$, $E_n=\frac12(wx_n-t_n)^2$, $w=0$, $\eta=0.1$로 SGD를 한 에폭(두 번 갱신) 돌리면? 같은 학습률의 배치 경사하강법 한 단계와 비교하세요.
---
$\nabla E_n=(wx_n-t_n)x_n$. 첫 점: $(0-2)\cdot1=-2$ → $w=0.2$. 둘째 점: $(0.2\cdot2-3)\cdot2=-5.2$ → $w=0.72$.
배치: $\nabla E=\sum_n(0-t_n)x_n=-2-6=-8$ → $w=0.8$. 최적값은 $w^\star=\frac{\sum t_nx_n}{\sum x_n^2}=\frac85=1.6$. SGD는 둘째 갱신에서 이미 바뀐 $w$의 기울기를 쓴다는 점이 배치와 다릅니다.
:::

**미니배치**: 표본 하나(매우 잡음 많은 기울기)나 전체 자료 대신 **작은 부분집합**으로 기울기를 계산하는 실용적 변형입니다.
- 참 기울기를 더 잘 추정하면서 계산 효율을 유지합니다.
- 편향을 피하고 수렴을 돕기 위해 미니배치를 만들기 전에 자료를 **무작위로 섞습니다**.
- 배치 크기는 기울기 정확도와 계산 효율의 균형이며, 하드웨어 최적화를 위해 **2의 거듭제곱**을 선호합니다.
- 미니배치를 써도 흔히 그냥 “SGD”라 부릅니다.

**Algorithm 7.2 (미니배치 SGD).** 입력: 훈련 자료 $n\in\{1,\dots,N\}$, 배치 크기 $B$, 미니배치 오차 $E_{n:n+B-1}(\mathbf w)$, 학습률 $\eta$, 초기 가중치 $\mathbf w$.
1. $n\leftarrow1$
2. 반복: $\mathbf w\leftarrow\mathbf w-\eta\nabla E_{n:n+B-1}(\mathbf w)$, $n\leftarrow n+B$; $n>N$이면 자료를 섞고 $n\leftarrow1$
3. 수렴할 때까지. $\mathbf w$ 반환.

등고선 그림: 배치는 매끈하게, 확률적은 심하게 지그재그로, 미니배치는 그 사이로 최소점에 다가갑니다. 기울기의 분산에 대한 수학적 분석은 심층 신경망 과목에 있습니다[[@dnn:ch10:10.2|i.i.d. 미니배치 기울기의 공분산은 $\Sigma/B$.]].
:::fig sgdpaths
:::
` },
      { k: '7.2b', label: '7.2.5', p: '216', src: '슬라이드 11–12', title: '파라미터 초기화', body: R`
초기화는 학습 속도와 최종 성능 모두에 영향을 줍니다.
- **대칭 깨기**: 모든 가중치를 같은 값으로 두면 같은 입력을 받는 뉴런들이 똑같은 함수를 배워 중복됩니다. 그래서 가중치를 **무작위**(균등 또는 가우시안)로 초기화합니다.
- **분포**: 가중치는 보통 균등분포 $w\sim U[-\epsilon,\epsilon]$ 또는 가우시안 $w\sim\N(0,\epsilon^2)$에서 뽑으며, $\epsilon$의 크기를 정하는 규칙이 아래의 초기화 방법들입니다.
- **크기**도 중요합니다. 초기화가 나쁘면 층을 지나며 활성화와 기울기가 줄어들거나(**기울기 소실**) 지나치게 커집니다(**기울기 폭발**).

:::key He 초기화와 Xavier 초기화
입력 유닛 $n_{\text{in}}$개, 출력 유닛 $n_{\text{out}}$개인 층에서
| | Xavier | He |
|---|---|---|
| 제안 | Glorot & Bengio (2010) | He et al. (2015) |
| 분산 | $2/(n_{\text{in}}+n_{\text{out}})$ | $2/n_{\text{in}}$ |
| 대상 | 시그모이드, tanh | ReLU, Leaky ReLU, ELU |
| 크기 | 더 작음 | 더 큼 |
| 요즘 | 깊은 ReLU망에는 덜 씀 | 널리 씀 |
:::

Xavier는 층을 지나도 활성화의 분산이 대략 일정하게 유지되도록 하고, He는 ReLU가 음수 절반을 0으로 만드는 것을 보정해 분산을 2배로 합니다. 유도는 심층 신경망 과목에 있습니다[[@dnn:ch11:11.3|$\E[\max(0,z)^2]=\frac12\E[z^2]$에서 $\sigma^2=2/D_{in}$.]].
:::fig initscale
:::

:::ex 예제 2 — 초기화 표준편차 계산
입력 유닛 $n_{\text{in}}=512$, 출력 유닛 $n_{\text{out}}=256$인 층에서 Xavier와 He 초기화의 가우시안 표준편차는? 균등분포 $U[-\epsilon,\epsilon]$로 같은 분산을 내려면 $\epsilon$은?
---
Xavier: $\sigma^2=\frac2{512+256}=\frac1{384}$, $\sigma\approx0.0510$. He: $\sigma^2=\frac2{512}$, $\sigma=0.0625$.
$U[-\epsilon,\epsilon]$의 분산은 $\epsilon^2/3$이므로 $\epsilon=\sqrt{3}\sigma$: Xavier $\epsilon\approx0.0884$, He $\epsilon\approx0.1083$.
:::
` },
      { k: '7.3', label: '7.3', p: '218', src: '슬라이드 14', title: '학습률과 수렴', body: R`
학습률 $\eta$는 보폭을 정합니다. **너무 크면 진동하거나 발산**하고, **너무 작으면 수렴이 매우 느립니다.** 효율적인 학습을 위해 적절한 학습률 선택이 결정적입니다.

오차 곡면의 곡률이 방향마다 다르면(가늘고 긴 골짜기), 기울기가 최소점을 곧바로 가리키지 않아 경사하강법이 **좁은 골짜기를 가로질러 진동**합니다. 그 결과 최적점을 향한 진행이 매우 느려, 보폭이 고정된 경사하강법은 비효율적입니다.
:::fig lrzigzag
:::

:::note 곡률과 학습률의 상한
이차 근사에서 고유방향 $\mathbf u_i$의 성분은 $(1-\eta\lambda_i)$배씩 줄어듭니다. 모든 방향이 수렴하려면 $\eta<2/\lambda_{\max}$이고, 수렴 속도는 가장 완만한 방향($\lambda_{\min}$)이 정합니다. 곡률 비 $\lambda_{\max}/\lambda_{\min}$이 크면 느립니다 — 모멘텀과 적응형 학습률, 입력 정규화가 필요한 이유입니다.
:::
` },
      { k: '7.3b', label: '7.3.1', p: '220', src: '슬라이드 15–16', title: '모멘텀', body: R`
가중치 공간의 움직임에 **관성**을 더해 진동을 부드럽게 합니다.

:::key 모멘텀
$$\Delta\mathbf w^{(\tau-1)}=-\eta\nabla E\big(\mathbf w^{(\tau-1)}\big)+\mu\,\Delta\mathbf w^{(\tau-2)},\qquad \mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}+\Delta\mathbf w^{(\tau-1)}$$
$\mu$: 모멘텀 매개변수($0\le\mu\le1$, 보통 $0.9$). 곡률이 낮은(기울기가 거의 일정한) 영역에서
$$\Delta\mathbf w=-\eta\nabla E\{1+\mu+\mu^2+\cdots\}=-\frac\eta{1-\mu}\nabla E\qquad(\text{유효 학습률 }\eta/(1-\mu))$$
:::

- **완만한 영역**: 연속된 갱신이 **누적**되어 최소점으로 더 빨리 움직입니다($\mu=0.9$이면 10배).
- **곡률이 큰 영역**(경사하강법이 진동하는 곳): 연속된 모멘텀 기여가 서로 **상쇄**되어 유효 학습률이 $\eta$에 가깝습니다.
- 대가: 정해야 할 초매개변수 $\mu$가 하나 늘어납니다.
:::fig momvec
:::

:::fig momeffect
:::

:::ex 예제 3 — 모멘텀 두 단계
$E(w)=\frac12w^2$, $w^{(0)}=1$, $\eta=0.5$, $\mu=0.9$, $\Delta w^{(-1)}=0$일 때 $w^{(1)}$, $w^{(2)}$는? 모멘텀이 없으면?
---
$\nabla E=w$. $\Delta w^{(0)}=-0.5\cdot1+0=-0.5$, $w^{(1)}=0.5$. $\Delta w^{(1)}=-0.5\cdot0.5+0.9\cdot(-0.5)=-0.7$, $w^{(2)}=-0.2$ — 최소점 0을 지나쳤습니다.
모멘텀 없이: $w^{(1)}=0.5$, $w^{(2)}=0.25$. 곡률이 큰(여기서는 $\eta\lambda=0.5$) 방향에서는 관성이 오히려 지나침을 만들고, 이후 반대 부호의 기울기가 쌓인 속도를 상쇄합니다.
:::

**네스테로프 모멘텀**: 이전 모멘텀으로 먼저 한 걸음 가 본 **그 위치에서** 기울기를 계산합니다(“앞을 보는” 기울기).
$$\Delta\mathbf w^{(\tau-1)}=-\eta\nabla E\big(\mathbf w^{(\tau-1)}+\mu\Delta\mathbf w^{(\tau-2)}\big)+\mu\Delta\mathbf w^{(\tau-2)}$$
배치 경사하강법에서 수렴 속도를 높이는 데 효과적입니다.
` },
      { k: '7.3c', label: '7.3.2', p: '222', src: '슬라이드 17', title: '학습률 스케줄', body: R`
$\eta$가 매우 작으면 느리고, 너무 크면 불안정합니다. 실제로는 **처음에 큰 $\eta$**를 쓰고 **시간에 따라 줄이면** 가장 좋은 결과를 얻습니다. 그러면 학습률이 단계 번호 $\tau$의 함수가 됩니다: $\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\eta^{(\tau-1)}\nabla E_n(\mathbf w^{(\tau-1)})$.

:::key 학습률 스케줄
$$\text{선형: }\eta^{(\tau)}=\Big(1-\frac\tau K\Big)\eta^{(0)}+\frac\tau K\eta^{(K)}$$
$$\text{거듭제곱: }\eta^{(\tau)}=\eta^{(0)}\Big(1+\frac\tau s\Big)^c\qquad \text{지수: }\eta^{(\tau)}=\eta^{(0)}c^{\tau/s}$$
:::

선형 스케줄은 $K$단계 동안 $\eta^{(0)}$에서 $\eta^{(K)}$로 줄고 이후 일정합니다. 거듭제곱($c<0$)·지수($0<c<1$)는 계속 감소합니다. **학습 곡선을 관찰**해 오차가 적당한 속도로 줄어드는지 확인해야 합니다(슬라이드: 검증 손실이 초반에 요동치다 정체).
:::fig lrsched
:::

:::ex 예제 4 — 스케줄 계산
$\eta^{(0)}=0.1$일 때 $\tau=20$에서 (a) 선형 $K=100$, $\eta^{(K)}=0.001$ (b) 거듭제곱 $s=10$, $c=-0.5$ (c) 지수 $s=10$, $c=0.5$의 학습률은?
---
(a) $(1-0.2)\cdot0.1+0.2\cdot0.001=0.0802$. (b) $0.1\cdot(1+2)^{-0.5}=0.1/\sqrt3\approx0.0577$. (c) $0.1\cdot0.5^{2}=0.025$.
:::
` },
      { k: '7.3d', label: '7.3.3', p: '223', src: '슬라이드 18–21', title: 'AdaGrad, RMSProp, Adam', body: R`
최적 학습률은 오차 곡면의 **국소 곡률**에 달렸고, 곡률은 파라미터 방향마다 다릅니다. **적응형 옵티마이저**는 파라미터마다 다른 학습률을 쓰고 학습 중에 자동으로 조절합니다. ($\delta$는 0으로 나누는 것을 막는 작은 상수, 예: $10^{-8}$)

:::key AdaGrad, RMSProp, Adam
**AdaGrad**: 기울기 제곱을 누적
$$r_i^{(\tau)}=r_i^{(\tau-1)}+\Big(\frac{\partial E}{\partial w_i}\Big)^2,\qquad w_i^{(\tau)}=w_i^{(\tau-1)}-\frac\eta{\sqrt{r_i^{(\tau)}}+\delta}\frac{\partial E}{\partial w_i}$$
**RMSProp**: 누적합 대신 지수가중 이동평균 ($0<\beta<1$, 보통 $0.9$)
$$r_i^{(\tau)}=\beta r_i^{(\tau-1)}+(1-\beta)\Big(\frac{\partial E}{\partial w_i}\Big)^2,\qquad w_i^{(\tau)}=w_i^{(\tau-1)}-\frac\eta{\sqrt{r_i^{(\tau)}}+\delta}\frac{\partial E}{\partial w_i}$$
**Adam**: 모멘텀 + RMSProp, 영 초기화 편향 보정
$$s_i^{(\tau)}=\beta_1s_i^{(\tau-1)}+(1-\beta_1)\frac{\partial E}{\partial w_i},\qquad r_i^{(\tau)}=\beta_2r_i^{(\tau-1)}+(1-\beta_2)\Big(\frac{\partial E}{\partial w_i}\Big)^2$$
$$\hat s_i^{(\tau)}=\frac{s_i^{(\tau)}}{1-\beta_1^\tau},\qquad \hat r_i^{(\tau)}=\frac{r_i^{(\tau)}}{1-\beta_2^\tau},\qquad w_i^{(\tau)}=w_i^{(\tau-1)}-\eta\frac{\hat s_i^{(\tau)}}{\sqrt{\hat r_i^{(\tau)}}+\delta}$$
보통 $\beta_1=0.9$, $\beta_2=0.99$ (교재·슬라이드; Adam 원 논문은 $0.999$).
:::

- **AdaGrad**: 큰 기울기를 반복해서 받은 파라미터는 유효 학습률이 점점 작아집니다 → 곡률이 큰 방향에서 학습률을 더 빨리 줄이는 것으로 해석됩니다. 한계: 처음부터 누적하므로 학습이 진행될수록 갱신이 지나치게 작아져 학습이 사실상 멈출 수 있습니다.
- **RMSProp**: 오래된 기울기를 지수적으로 잊어 이 문제를 해결합니다.
- **Adam**: 1차 모멘트(모멘텀) $s$와 2차 모멘트 $r$을 함께 씁니다. 둘 다 0에서 시작하므로 초기에는 0 쪽으로 편향되는데, $1/(1-\beta^\tau)$로 보정합니다($\tau$가 커지면 보정 인수 → 1). 가장 널리 쓰이는 옵티마이저입니다.
:::fig adaptive
:::

:::fig adambias
:::

:::ex 예제 5 — Adam의 첫 단계
$\beta_1=0.9$, $\beta_2=0.99$, $\eta=0.001$, $\delta\approx0$에서 첫 기울기가 $\partial E/\partial w_i=g$일 때 $w_i$의 변화량은?
---
$s^{(1)}=0.1g$, $r^{(1)}=0.01g^2$. 보정: $\hat s^{(1)}=\frac{0.1g}{1-0.9}=g$, $\hat r^{(1)}=\frac{0.01g^2}{1-0.99}=g^2$. 갱신량 $-\eta\frac g{\sqrt{g^2}}=-\eta\operatorname{sign}(g)=\mp0.001$. 기울기의 크기와 무관하게 첫 걸음은 $\eta$입니다. 보정하지 않으면 $-\eta\frac{0.1g}{\sqrt{0.01g^2}}=-\eta\operatorname{sign}(g)$로 우연히 같지만, $\beta_1^2\ne\beta_2$이면 달라집니다(예: $\beta_2=0.999$이면 약 $3.16$배 큰 걸음).
:::
` },
    ],
    problems: [
      { sec: '7.1', type: 'num', lv: 1, q: R`$\nabla E(\mathbf w)=(2,-1)$, $\delta\mathbf w=(0.1,0.3)$일 때 1차 근사 $\delta E\simeq\delta\mathbf w^T\nabla E$는?`, ans: '-0.1', ansTex: R`-0.1`,
        sol: R`$0.1\cdot2+0.3\cdot(-1)=0.2-0.3=-0.1$. 오차가 약간 줄어드는 방향입니다.` },
      { sec: '7.1', type: 'mc', lv: 1, q: R`정류점의 정의는?`,
        choices: [R`$E(\mathbf w)=0$`, R`$\nabla E(\mathbf w)=0$`, R`$\mathbf w=0$`, R`$\nabla^2E=0$`], ans: 1,
        sol: R`기울기가 0인 점. 국소 최소·최대·안장점이 모두 포함됩니다.` },
      { sec: '7.2', type: 'mc', lv: 1, q: R`배치 경사하강법이 자료가 많을 때 비효율적인 이유는?`,
        choices: [R`학습률이 없어서`, R`매 갱신마다 훈련 자료 전체로 기울기를 계산해야 해서`, R`국소 최소에서 탈출해서`, R`기울기가 부정확해서`], ans: 1,
        sol: R`한 걸음에 $N$개 전부를 처리해야 합니다.` },
      { sec: '7.2', type: 'mc', lv: 2, q: R`SGD가 국소 최소에서 탈출하기 쉬운 이유로 교재가 든 것은?`,
        choices: [R`학습률이 커서`, R`전체 자료의 정류점이 개별 자료점의 정류점은 대개 아니라서`, R`기울기가 항상 0이 아니어서`, R`모멘텀이 있어서`], ans: 1,
        sol: R`$\nabla E=0$이어도 $\nabla E_n\ne0$이라 계속 움직입니다.` },
      { sec: '7.2', type: 'num', lv: 1, q: R`$N=1024$, 배치 크기 $B=32$이면 한 에폭의 갱신 횟수는?`, ans: '32', ansTex: R`32`,
        sol: R`$1024/32=32$.` },
      { sec: '7.2', type: 'mc', lv: 1, q: R`미니배치를 만들기 전에 자료를 무작위로 섞는 이유는?`,
        choices: [R`계산을 빠르게 하려고`, R`편향을 피하고 수렴을 돕기 위해`, R`배치 크기를 2의 거듭제곱으로 만들려고`, R`과적합을 일으키려고`], ans: 1,
        sol: R`정렬된 자료(예: 클래스별)로 연속 갱신하면 기울기가 한쪽으로 치우칩니다.` },
      { sec: '7.2b', type: 'num', lv: 1, q: R`$n_{\text{in}}=300$, $n_{\text{out}}=100$인 층의 Xavier 초기화 분산은?`, ans: '0.005', ansTex: R`\tfrac{2}{400}=0.005`,
        sol: R`$2/(300+100)$.` },
      { sec: '7.2b', type: 'num', lv: 1, q: R`같은 층을 ReLU와 함께 쓸 때 He 초기화 분산은? (소수 다섯째 자리)`, ans: '2/300', ansTex: R`\tfrac2{300}\approx0.00667`,
        sol: R`$2/n_{\text{in}}=2/300$.` },
      { sec: '7.2b', type: 'mc', lv: 1, q: R`모든 가중치를 같은 값으로 초기화하면 안 되는 이유는?`,
        choices: [R`기울기가 폭발해서`, R`같은 입력을 받는 뉴런들이 똑같은 함수를 배워 중복되기 때문(대칭)`, R`손실이 음수가 되어서`, R`He 초기화와 같아져서`], ans: 1,
        sol: R`대칭 깨기를 위해 무작위 초기화가 필요합니다.` },
      { sec: '7.3b', type: 'num', lv: 1, q: R`모멘텀 $\mu=0.9$일 때 완만한 영역의 유효 학습률은 $\eta$의 몇 배인가?`, ans: '10', ansTex: R`10`,
        sol: R`$1/(1-\mu)=1/0.1=10$.` },
      { sec: '7.3b', type: 'num', lv: 2, q: R`1차원에서 $\eta=0.1$, $\mu=0.5$, 기울기가 항상 $2$이고 $\Delta w^{(0)}=0$일 때 세 번째 갱신량 $\Delta w^{(3)}$은? ($\Delta w^{(\tau)}=-\eta g+\mu\Delta w^{(\tau-1)}$)`, ans: '-0.35', ansTex: R`-0.35`,
        sol: R`$\Delta w^{(1)}=-0.2$, $\Delta w^{(2)}=-0.2-0.1=-0.3$, $\Delta w^{(3)}=-0.2-0.15=-0.35$. 극한은 $-0.2/(1-0.5)=-0.4$.` },
      { sec: '7.3b', type: 'mc', lv: 2, q: R`네스테로프 모멘텀이 보통 모멘텀과 다른 점은?`,
        choices: [R`모멘텀을 쓰지 않는다`, R`이전 모멘텀으로 먼저 이동한 위치에서 기울기를 계산한다`, R`학습률을 매번 바꾼다`, R`기울기를 제곱한다`], ans: 1,
        sol: R`$\nabla E(\mathbf w^{(\tau-1)}+\mu\Delta\mathbf w^{(\tau-2)})$ — “앞을 보는” 기울기.` },
      { sec: '7.3c', type: 'num', lv: 2, q: R`지수 스케줄 $\eta^{(\tau)}=\eta^{(0)}c^{\tau/s}$에서 $\eta^{(0)}=0.1$, $c=0.5$, $s=1000$이면 $\tau=3000$의 학습률은?`, ans: '0.0125', ansTex: R`0.0125`,
        sol: R`$0.1\times0.5^3=0.0125$.` },
      { sec: '7.3c', type: 'num', lv: 2, q: R`선형 스케줄에서 $\eta^{(0)}=0.1$, $\eta^{(K)}=0.001$, $K=100$일 때 $\tau=50$의 학습률은?`, ans: '0.0505', ansTex: R`0.0505`,
        sol: R`$(1-0.5)(0.1)+0.5(0.001)=0.05+0.0005=0.0505$.` },
      { sec: '7.3d', type: 'num', lv: 2, q: R`AdaGrad에서 한 파라미터의 기울기가 $3,4$로 두 번 나왔다($r^{(0)}=0$, $\delta\approx0$). 둘째 갱신의 유효 학습률 $\eta/\sqrt{r^{(2)}}$는 $\eta$의 몇 배인가?`, ans: '1/5', ansTex: R`\tfrac15`,
        sol: R`$r^{(2)}=9+16=25$, $\sqrt{25}=5$.` },
      { sec: '7.3d', type: 'num', lv: 3, q: R`Adam에서 첫 단계($\tau=1$)의 기울기가 $g$이고 $s^{(0)}=r^{(0)}=0$이면 편향 보정된 $\hat s^{(1)}$은? ($g=0.4$, $\beta_1=0.9$)`, ans: '0.4', ansTex: R`\hat s^{(1)}=g=0.4`,
        sol: R`$s^{(1)}=0.1g=0.04$, $\hat s^{(1)}=0.04/(1-0.9)=0.4=g$. 보정하지 않으면 10배 작게 출발합니다.` },
      { sec: '7.3d', type: 'mc', lv: 2, q: R`RMSProp이 AdaGrad의 어떤 문제를 해결하는가?`,
        choices: [R`학습률이 너무 커지는 문제`, R`기울기 제곱을 처음부터 누적해 갱신이 지나치게 작아지는 문제`, R`모멘텀이 없는 문제`, R`초기화 문제`], ans: 1,
        sol: R`지수가중 이동평균으로 오래된 기울기를 잊습니다.` },
      { sec: '7.3d', type: 'mc', lv: 1, q: R`Adam의 두 구성 요소는?`,
        choices: [R`드롭아웃 + 배치 정규화`, R`모멘텀(1차 모멘트) + RMSProp(2차 모멘트)`, R`AdaGrad + 네스테로프`, R`SGD + 가중치 감쇠`], ans: 1,
        sol: R`$s$는 기울기의 이동평균, $r$은 기울기 제곱의 이동평균입니다.` },
      { sec: '7.3b', type: 'open', lv: 2, q: R`모멘텀 갱신식 $\Delta\mathbf w^{(\tau)}=-\eta\nabla E+\mu\Delta\mathbf w^{(\tau-1)}$에서 기울기가 일정하면 갱신량이 $-\frac\eta{1-\mu}\nabla E$로 수렴함을 보이고, 곡률이 큰 골짜기에서 모멘텀이 진동을 줄이는 이유를 설명하세요.`,
        sol: R`
기울기 $\mathbf g$가 일정하면 $\Delta^{(\tau)}=-\eta\mathbf g(1+\mu+\cdots+\mu^{\tau-1})+\mu^\tau\Delta^{(0)}$. $0\le\mu<1$이면 $\tau\to\infty$에서 $-\eta\mathbf g\sum_{k\ge0}\mu^k=-\frac{\eta}{1-\mu}\mathbf g$.
골짜기를 가로지르는 방향에서는 기울기 부호가 매 단계 바뀌므로 $\mu\Delta^{(\tau-1)}$ 항이 현재 기울기 항과 반대 부호가 되어 서로 상쇄됩니다. 반면 골짜기를 따라 내려가는 방향은 부호가 일정해 누적됩니다. 그래서 진동은 줄고 진행은 빨라집니다.` },
      { sec: '7.3d', type: 'open', lv: 3, q: R`Adam의 1차 모멘트 $s^{(\tau)}=\beta_1s^{(\tau-1)}+(1-\beta_1)g^{(\tau)}$, $s^{(0)}=0$에서 기울기가 매번 같은 값 $g$이면 $s^{(\tau)}=(1-\beta_1^\tau)g$임을 보이고, 편향 보정 $\hat s=s/(1-\beta_1^\tau)$의 의미를 설명하세요.`,
        sol: R`
귀납: $s^{(1)}=(1-\beta_1)g$. $s^{(\tau-1)}=(1-\beta_1^{\tau-1})g$이면 $s^{(\tau)}=\beta_1(1-\beta_1^{\tau-1})g+(1-\beta_1)g=(1-\beta_1^\tau)g$.
일반적으로 $s^{(\tau)}=(1-\beta_1)\sum_{k=1}^\tau\beta_1^{\tau-k}g^{(k)}$이고 가중치 합이 $1-\beta_1^\tau<1$이라, 0 초기화 때문에 초기에 0 쪽으로 편향됩니다. $\hat s=s/(1-\beta_1^\tau)$로 나누면 가중치 합이 1인 가중평균이 되어(위 예에서 $\hat s=g$) 편향이 사라집니다. $\tau\to\infty$이면 보정 인수는 1.` },
    ],
  });
})();
