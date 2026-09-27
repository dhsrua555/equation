/* 12 학습률 스케줄과 배치 정규화 — 4주차 월요일(2) s.27–44, 4주차 수요일(1) 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 12, part: 'C', title: '학습률 스케줄과 배치 정규화', en: 'Learning-Rate Schedules & Batch Normalization', ref: 'W4 월(2) · s.27–44, W4 수 필기', plot: 'schedule',
    fig: R`선형 워밍업 뒤의 학습률 스케줄: 계단, 선형, 역제곱근, 코사인(굵은 선)`,
    tagline: R`학습률은 처음에 크게, 나중에 작게. 배치 정규화는 층마다 평균 0·분산 1로 맞추되 $\gamma,\beta$로 다시 자유를 줍니다.`,
    summary: R`학습률이 너무 크면 손실이 발산하고 너무 작으면 느립니다. 계단·코사인·선형·역제곱근 감소와 선형 워밍업으로 두 장점을 함께 얻습니다. **배치 정규화**(BN)는 미니배치의 특성별 평균·분산으로 활성화를 정규화한 뒤 학습 가능한 $\gamma,\beta$로 크기와 위치를 되돌립니다. 테스트 때는 학습 중 누적한 이동평균을 써서 BN이 선형(아핀) 연산이 되고 앞 층과 합칠 수 있습니다. 필기에서 공변량 이동과 내부 공변량 이동(ICS)을 정의했고, BN의 효과를 ICS 감소로 볼지 손실 곡면의 평활화로 볼지에 대한 논의를 다룹니다.`,
    goals: [
      R`학습 곡선을 보고 학습률의 크기를 판단하고, 주요 학습률 스케줄의 식을 쓸 수 있다`,
      R`BN의 학습 시 계산(평균·분산·정규화·$\gamma,\beta$)과 각 텐서의 크기를 쓸 수 있다`,
      R`$\gamma=\sqrt{\sigma^2+\varepsilon}$, $\beta=\mu$이면 항등함수가 됨을 보일 수 있다`,
      R`테스트 시 이동평균을 쓰는 이유와, BN을 앞의 완전연결층에 합치는 식을 유도할 수 있다`,
      R`공변량 이동과 내부 공변량 이동을 정의하고 BN의 이론적 정당화에 대한 두 견해를 설명할 수 있다`,
    ],
    secTitles: { '12.1': '학습률', '12.2': '스케줄', '12.3': 'BN 학습 시', '12.4': 'BN 추론 시', '12.5': 'BN의 효과와 ICS' },
    sections: [
      { k: '12.1', src: 'W4 월(2) · 슬라이드 27–28', title: '학습률과 학습 곡선', body: R`
SGD, 모멘텀 SGD, Adagrad, RMSProp, Adam 모두 **학습률**을 초매개변수로 가집니다. 슬라이드의 손실-에폭 곡선 네 개:
- (a) 매우 높은 학습률: 손실이 폭발
- (b) 낮은 학습률: 천천히 꾸준히 감소
- (c) 높은 학습률: 빨리 떨어지다가 높은 값에서 정체
- (d) 좋은 학습률

학습률의 오름차순은 **b < d < c < a**입니다. 처음에는 높은 학습률로 빨리 내려가고, 나중에는 낮은 학습률로 정밀하게 내려가면 두 장점을 모두 얻습니다 → 학습률 감소. 필기: 그릇 모양 손실에서 학습률이 크면 벽을 오가며 진동하다가, 학습률을 줄이면 바닥으로 내려앉습니다.
` },
      { k: '12.2', src: 'W4 월(2) · 슬라이드 29–32, W4 수 필기', title: '학습률 감소 스케줄', body: R`
:::key 학습률 스케줄
초기 학습률 $\alpha_0$, 전체 에폭(또는 반복) 수 $T$일 때
- **계단**(step): 정해진 시점에 곱해 줄임. 예: ResNet은 에폭 30, 60, 90에서 $\times0.1$
- **코사인**: $\alpha_t=\dfrac12\alpha_0\Big(1+\cos\dfrac{t\pi}{T}\Big)$
- **선형**: $\alpha_t=\alpha_0\Big(1-\dfrac tT\Big)$
- **역제곱근**: $\alpha_t=\alpha_0/\sqrt t$
- **선형 워밍업**: 처음 약 5000번 반복 동안 0에서 선형으로 증가 (초기의 큰 학습률로 손실이 폭발하는 것을 막음)
:::

코사인 스케줄은 $t=0$에서 $\alpha_0$, $t=T/2$에서 $\alpha_0/2$, $t=T$에서 0이고, 시작과 끝 부근에서 천천히 변합니다(Loshchilov & Hutter, SGDR, 2017). 워밍업은 큰 배치로 학습할 때 특히 중요합니다(Goyal et al., 2017).
` },
      { k: '12.3', src: 'W4 월(2) · 슬라이드 33–36 필기', title: '배치 정규화: 학습 시', body: R`
“평균 0, 분산 1인 활성화를 원하면? **그냥 그렇게 만들어라.**” 한 층의 활성화 배치를 특성(차원)마다 정규화합니다.
$$\hat x^{(k)}=\frac{x^{(k)}-\E[x^{(k)}]}{\sqrt{\Var[x^{(k)}]}}$$
이 연산은 미분 가능하므로 역전파가 됩니다.

:::key 배치 정규화 (학습 시)
입력 $x\in\mathbb R^{N\times D}$ ($N$: 배치 크기, $D$: 특성 차원, MNIST면 $D=784$). 학습 가능한 $\gamma,\beta\in\mathbb R^D$.
$$\mu_j=\frac1N\sum_{i=1}^Nx_{ij},\qquad \sigma_j^2=\frac1N\sum_{i=1}^N(x_{ij}-\mu_j)^2\qquad(\text{크기 }D)$$
$$\hat x_{ij}=\frac{x_{ij}-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}},\qquad y_{ij}=\gamma_j\hat x_{ij}+\beta_j\qquad(\text{크기 }N\times D)$$
$\gamma_j=\sqrt{\sigma_j^2+\varepsilon}$, $\beta_j=\mu_j$로 학습하면 항등함수를 되찾는다.
:::

- $\varepsilon$(예: $10^{-5}$)은 분산이 0일 때 나눗셈을 막습니다(필기).
- 정규화만 하면 모든 층이 강제로 평균 0·분산 1이 되어 표현력이 줄 수 있습니다. $\gamma,\beta$가 필요하면 원래 분포로 되돌릴 자유를 줍니다. 그래서 **BN은 신경망의 표현력을 바꾸지 않습니다.**
- 필기: 배치가 $N=100$개, 특성이 $D=784$개이면 평균과 분산을 각각 784개 계산합니다.
` },
      { k: '12.4', src: 'W4 월(2) · 슬라이드 37–42 필기', title: '배치 정규화: 테스트 시와 합치기', body: R`
추론 때는 배치가 작거나 $N=1$일 수도 있어 배치 통계량을 쓸 수 없습니다. 학습 중에 누적한 **이동평균**으로 바꿉니다.

:::key 배치 정규화 (추론 시)
학습 중 (모멘텀 $m$):
$$\mu^{\text{run}}\leftarrow m\,\mu^{\text{run}}+(1-m)\,\mu_{\text{batch}},\qquad (\sigma^2)^{\text{run}}\leftarrow m\,(\sigma^2)^{\text{run}}+(1-m)\,\sigma^2_{\text{batch}}$$
테스트 시: $\hat x_{ij}=\dfrac{x_{ij}-\mu_j^{\text{run}}}{\sqrt{(\sigma_j^2)^{\text{run}}+\varepsilon}}$, $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$.
모든 값이 상수이므로 BN은 채널별 아핀변환 $y_{ij}=a_jx_{ij}+b_j$가 된다:
$$a_j=\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}},\qquad b_j=\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}.$$
:::

**앞 층과 합치기(fusing).** 완전연결층 $x=Wu+c$ 다음에 BN이 오면
$$y=\diag(a)(Wu+c)+b_{\text{BN}}=\underbrace{\diag(a)W}_{W'}u+\underbrace{\diag(a)c+b_{\text{BN}}}_{c'},$$
여기서 $b_{\text{BN}}=(b_1,\dots,b_D)$는 위의 BN 절편입니다. 슬라이드는 이를 “$W'=\diag(a)W$, $b'=\diag(a)b+b$”로 적었는데, 앞의 $b$는 FC층의 편향, 뒤의 $b$는 BN의 절편 $b_j$입니다. 합치면 **추론 비용이 0**입니다.

**위치.** 보통 완전연결층이나 합성곱층 **다음, 비선형 활성화 앞**에 넣습니다: FC → BN → tanh → FC → BN → tanh → ….

:::fig bnln
` },
      { k: '12.5', src: 'W4 월(2) · 슬라이드 40–44, W4 수(1) 필기', title: 'BN의 효과와 내부 공변량 이동', body: R`
**효과**(슬라이드 41–42)
- 깊은 신경망을 **훨씬** 쉽게 학습, 기울기 흐름 개선
- 더 큰 학습률 허용·빠른 수렴: 스케일 불변성과 안정된 기울기로 발산 위험이 줄고, 같은 학습률에서도 초기 수렴이 빠름
- 초기화에 덜 민감: Xavier/He가 조금 부정확해도 BN이 다시 중심을 맞추고 크기를 조절
- 학습 중 규제 효과(미니배치 통계량의 잡음)
- 테스트 시 추가 비용 0 (합치기)

:::key 배치 정규화의 스케일 불변성
BN 앞의 가중치를 $\alpha>0$배 해도 출력이 같다: $\mathrm{BN}\big((\alpha W)u\big)=\mathrm{BN}(Wu)$ ($\varepsilon\to0$일 때). 또 $\nabla_{\alpha W}L=\frac1\alpha\nabla_WL$이라 가중치가 커지면 유효 학습률이 자동으로 작아진다.
:::

**정리(슬라이드 43).** BN은 층마다 정규화를 (대략) 강제하며 매우 깊은 신경망 학습에 필수이지만 **이론적 정당화는 약합니다.** 배치 크기가 더 중요한 초매개변수가 되고, ResNet 학습에는 BN이 필요합니다.

:::hand 수업 필기 — 공변량 이동과 내부 공변량 이동
① **공변량 이동**: 지도학습에서 $P(X,Y)=P(Y\mid X)P(X)$. $P_{\text{train}}(X)\ne P_{\text{test}}(X)$이지만 $P_{\text{train}}(Y\mid X)=P_{\text{test}}(Y\mid X)$인 상황. 입력 분포는 바뀌지만 관계는 그대로입니다.

② **내부 공변량 이동**(ICS): $\ell$번째 층 $z^{(\ell)}=W^{(\ell)}h^{(\ell-1)}+b^{(\ell)}$, $h^{(\ell)}=f(z^{(\ell)})$. 학습 중 파라미터가 계속 바뀌므로 **같은 훈련 자료에 대해서도** 입력 $h^{(\ell-1)}$의 분포가 최적화 단계마다 달라질 수 있습니다: $P_t(h^{(\ell-1)})\ne P_{t+1}(h^{(\ell-1)})$. BN이 ICS를 해결하는가(?)
:::

**이론적 정당화(슬라이드 44)**
- 원래 가설(Ioffe & Szegedy, 2015): BN ⇒ ICS 감소 ⇒ 학습 개선
- 실험(Santurkar et al., 2018): BN이 측정된 ICS를 **줄이지 않는데도** 학습은 일관되게 좋아짐 (BN ⇏ ICS 감소, 그러나 BN ⇒ 학습 개선)
- 대안 설명: BN ⇒ **손실 곡면이 매끈해짐** ⇒ 최적화가 쉬워짐 ⇒ 학습 개선. 13단원의 $\beta$-매끄러움과 연결됩니다[[ch13:13.2|$\beta$가 작을수록 더 큰 학습률 $\eta<2/\beta$를 쓸 수 있습니다.]].
` },
    ],
    problems: [
      { sec: '12.1', type: 'mc', lv: 1, q: R`손실이 빠르게 줄다가 높은 값에서 평평해졌다. 학습률에 대한 가장 적절한 판단은?`,
        choices: [R`학습률이 너무 낮다`, R`학습률이 높다 — 감소 스케줄이 필요하다`, R`학습률이 적당하다`, R`손실이 발산한다`], ans: 1,
        sol: R`슬라이드의 (c) 곡선입니다. 초기에는 좋지만 바닥 근처에서 진동하므로 학습률을 줄여야 합니다.` },
      { sec: '12.2', type: 'num', lv: 1, q: R`코사인 스케줄 $\alpha_t=\frac12\alpha_0(1+\cos\frac{t\pi}T)$에서 $\alpha_0=0.1$, $T=100$, $t=25$일 때 $\alpha_t$는? (소수 넷째 자리)`, ans: '0.05*(1+cos(pi/4))', ansTex: R`0.05\big(1+\tfrac{\sqrt2}2\big)\approx0.0854`,
        sol: R`$\cos(\pi/4)=\frac{\sqrt2}2\approx0.7071$, $0.05\times1.7071\approx0.0854$.` },
      { sec: '12.2', type: 'num', lv: 1, q: R`계단 스케줄(에폭 30, 60, 90에서 $\times0.1$), $\alpha_0=0.1$일 때 에폭 75의 학습률은?`, ans: '0.001', ansTex: R`10^{-3}`,
        sol: R`30에서 $0.01$, 60에서 $0.001$, 90 전이므로 $0.001$.` },
      { sec: '12.2', type: 'num', lv: 2, q: R`선형 스케줄 $\alpha_t=\alpha_0(1-t/T)$에서 $\alpha_0=0.2$, $T=50$일 때 $t=40$의 학습률은?`, ans: '0.04', ansTex: R`0.04`,
        sol: R`$0.2(1-0.8)=0.04$.` },
      { sec: '12.3', type: 'num', lv: 2, q: R`한 특성의 미니배치 값이 $(1,3,5,7)$, $\varepsilon=0$, $\gamma=2$, $\beta=1$일 때 값 $7$의 BN 출력은? (소수 넷째 자리)`, ans: '2*3/sqrt(5)+1', ansTex: R`\tfrac{6}{\sqrt5}+1\approx3.6833`,
        sol: R`$\mu=4$, $\sigma^2=\frac{9+1+1+9}4=5$. $\hat x=3/\sqrt5$, $y=2\cdot3/\sqrt5+1\approx3.6833$. (분산은 $N$으로 나눕니다.)` },
      { sec: '12.3', type: 'mc', lv: 1, q: R`입력 $x\in\mathbb R^{N\times D}$의 BN에서 $\mu$, $\gamma$, $y$의 크기는?`,
        choices: [R`$N$, $N$, $N\times D$`, R`$D$, $D$, $N\times D$`, R`$D$, $N$, $D$`, R`$N\times D$, $D$, $D$`], ans: 1,
        sol: R`특성마다 하나씩(크기 $D$) 평균·분산·$\gamma$·$\beta$를 두고, 출력은 입력과 같은 $N\times D$.` },
      { sec: '12.3', type: 'mc', lv: 2, q: R`BN에 학습 가능한 $\gamma,\beta$를 두는 이유는?`,
        choices: [R`정규화를 더 강하게 하려고`, R`필요하면 원래 평균·분산을 되찾을 수 있게 하려고(표현력 유지)`, R`분산이 0이 되지 않게 하려고`, R`추론을 빠르게 하려고`], ans: 1,
        sol: R`$\gamma=\sqrt{\sigma^2+\varepsilon}$, $\beta=\mu$이면 항등함수입니다. $\varepsilon$이 나눗셈을 보호합니다.` },
      { sec: '12.4', type: 'num', lv: 2, q: R`추론 시 BN에서 $\gamma=2$, $\beta=1$, $\mu^{\text{run}}=3$, $(\sigma^2)^{\text{run}}=4$, $\varepsilon=0$이면 아핀 계수 $b=\beta-\gamma\mu/\sqrt{\sigma^2}$는?`, ans: '-2', ansTex: R`-2`,
        sol: R`$a=2/2=1$, $b=1-2\cdot3/2=-2$. 즉 $y=x-2$.` },
      { sec: '12.4', type: 'num', lv: 2, q: R`이동평균 $\mu^{\text{run}}\leftarrow0.9\mu^{\text{run}}+0.1\mu_{\text{batch}}$, 초깃값 0, 배치 평균이 매번 10이면 3번 갱신 후 $\mu^{\text{run}}$은?`, ans: '2.71', ansTex: R`10(1-0.9^3)=2.71`,
        sol: R`$1,\ 1.9,\ 2.71$. 일반적으로 $10(1-0.9^t)$로 10에 다가갑니다.` },
      { sec: '12.4', type: 'mc', lv: 2, q: R`FC층 $x=Wu+c$ 뒤에 추론 모드 BN($y=\diag(a)x+b_{\text{BN}}$)이 있을 때 합친 편향 $c'$은?`,
        choices: [R`$c+b_{\text{BN}}$`, R`$\diag(a)c+b_{\text{BN}}$`, R`$\diag(a)(c+b_{\text{BN}})$`, R`$b_{\text{BN}}$`], ans: 1,
        sol: R`$\diag(a)(Wu+c)+b_{\text{BN}}=\diag(a)Wu+\diag(a)c+b_{\text{BN}}$.` },
      { sec: '12.5', type: 'mc', lv: 2, q: R`Santurkar et al.(2018)의 실험 결과로 옳은 것은?`,
        choices: [R`BN은 ICS를 줄이고 그래서 학습이 좋아진다`, R`BN은 측정된 ICS를 줄이지 않지만 학습은 개선되며, 손실 곡면을 매끈하게 한다는 설명이 제시됨`, R`BN은 학습을 방해한다`, R`BN은 테스트 성능만 높인다`], ans: 1,
        sol: R`원래 가설(ICS 감소)이 실험으로 지지되지 않았고, 대안 설명이 손실 곡면의 평활화입니다.` },
      { sec: '12.5', type: 'mc', lv: 1, q: R`공변량 이동(covariate shift)의 정의로 옳은 것은?`,
        choices: [R`$P(Y\mid X)$가 바뀌고 $P(X)$는 같다`, R`$P_{\text{train}}(X)\ne P_{\text{test}}(X)$이지만 $P(Y\mid X)$는 같다`, R`레이블이 바뀐다`, R`모델 파라미터가 바뀐다`], ans: 1,
        sol: R`입력 분포만 바뀌고 입력-출력 관계는 그대로인 상황입니다(필기).` },
      { sec: '12.5', type: 'num', lv: 3, q: R`BN 바로 앞의 가중치를 $W\to3W$로 바꾸면 ($\varepsilon=0$) $\nabla_{3W}L$은 $\nabla_WL$의 몇 배인가?`, ans: '1/3', ansTex: R`\tfrac13`,
        sol: R`출력이 같으므로 $L(3W)=L(W)$. $\tilde W=3W$로 보면 $L_{\text{new}}(\tilde W)=L(\tilde W/3)$, $\nabla_{\tilde W}L_{\text{new}}=\frac13\nabla_WL$.` },
      { sec: '12.3', type: 'open', lv: 2, proof: true, q: R`BN의 학습 시 출력 $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$에 대해 (1) 배치 안에서 $\hat x_{\cdot j}$의 평균이 0, 분산이 $\sigma_j^2/(\sigma_j^2+\varepsilon)$임을 보이고 (2) $\gamma_j=\sqrt{\sigma_j^2+\varepsilon}$, $\beta_j=\mu_j$이면 $y_{ij}=x_{ij}$임을 보이세요.`,
        sol: R`
(1) $\frac1N\sum_i\hat x_{ij}=\frac{\frac1N\sum_ix_{ij}-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}=0$. 분산: $\frac1N\sum_i\hat x_{ij}^2=\frac{\frac1N\sum_i(x_{ij}-\mu_j)^2}{\sigma_j^2+\varepsilon}=\frac{\sigma_j^2}{\sigma_j^2+\varepsilon}\approx1$.
(2) $y_{ij}=\sqrt{\sigma_j^2+\varepsilon}\cdot\frac{x_{ij}-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}+\mu_j=x_{ij}$.
따라서 BN 층은 필요하면 항등함수가 될 수 있어 신경망의 표현력을 줄이지 않습니다.`,
        rubric: R`
- 평균 0 — 3점
- 분산 — 3점
- 항등함수 복원 — 4점` },
      { sec: '12.4', type: 'open', lv: 2, proof: true, q: R`추론 모드 BN이 아핀변환 $y_j=a_jx_j+b_j$임을 보이고 $a_j,b_j$를 구하세요. 이어서 FC층 $x=Wu+c$와 합친 층 $y=W'u+c'$의 $W',c'$을 구하세요.`,
        sol: R`
$y_j=\gamma_j\frac{x_j-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}+\beta_j=\underbrace{\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}}}_{a_j}x_j+\underbrace{\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}}_{b_j}$. 추론 때 $\mu,\sigma^2$은 이동평균 상수이므로 아핀입니다.
벡터로 $y=\diag(a)x+b$. $x=Wu+c$를 넣으면 $y=\diag(a)Wu+(\diag(a)c+b)$이므로 $W'=\diag(a)W$ (행 $j$에 $a_j$를 곱함), $c'=\diag(a)c+b$.`,
        rubric: R`
- $a_j,b_j$ 계산 — 5점
- 합친 층의 $W'$, $c'$ — 5점` },
    ],
  });
})();
