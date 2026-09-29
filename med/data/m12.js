/* 12 규제 II — Bishop 9.4–9.6 (p.270–281), 강의 Ch09 s.22–34 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 12, part: 'C', title: '규제 II: 파라미터 공유, 잔차 연결, 모델 평균', en: 'Regularization II', ref: 'Bishop §9.4–9.6', plot: 'doubledescent',
    fig: R`이중 하강: 시험 오차가 줄었다가 보간 임계점(점선)에서 치솟은 뒤 다시 감소`,
    tagline: R`가중치를 묶고(공유), 길을 건너뛰고(잔차), 여러 모델을 평균한다(앙상블·드롭아웃).`,
    summary: R`규제의 두 번째 묶음입니다. **파라미터 공유**(CNN의 가중치 공유)와 가중치가 군집을 이루도록 하는 **소프트 가중치 공유**(가우시안 혼합 사전분포), 매우 깊은 망의 **산산조각 난 기울기** 문제를 푸는 **잔차 연결**과 그 “여러 깊이의 경로 앙상블” 해석, 그리고 **모델 평균**: 위원회 오차 $E_{\text{COM}}=E_{\text{AV}}/M$(무상관 가정)과 $E_{\text{COM}}\le E_{\text{AV}}$, 배깅과 부스팅, 지수적으로 많은 부분망의 근사 평균인 **드롭아웃**과 추론 방법(몬테카를로 드롭아웃, 가중치 척도 조정)을 다룹니다.`,
    goals: [
      R`하드 가중치 공유와 소프트 가중치 공유를 구분하고 혼합 가우시안 규제항과 그 기울기를 쓸 수 있다`,
      R`산산조각 난 기울기 문제와 잔차 블록 $\mathbf z_l=F_l(\mathbf z_{l-1})+\mathbf z_{l-1}$의 효과를 설명할 수 있다`,
      R`잔차망을 펼쳐 여러 깊이 경로의 합으로 쓰고, ReLU 앞에 더하는 설계를 설명할 수 있다`,
      R`위원회 오차 $E_{\text{COM}}=\frac1ME_{\text{AV}}$와 $E_{\text{COM}}\le E_{\text{AV}}$를 증명할 수 있다`,
      R`배깅(부트스트랩)과 부스팅(순차·가중)을 비교할 수 있다`,
      R`드롭아웃의 학습·추론 절차(마스크, $\rho$, MC 드롭아웃, 가중치 $\times\rho$)를 설명할 수 있다`,
    ],
    secTitles: { '9.4': '파라미터 공유', '9.5': '잔차 연결', '9.6': '모델 평균', '9.6b': '드롭아웃' },
    sections: [
      { k: '9.4', label: '9.4', p: '270', src: '슬라이드 22–24', title: '파라미터 공유와 소프트 가중치 공유', body: R`
**가중치(파라미터) 공유**: 가중치들을 그룹으로 묶어 그룹 안에서 **같은 값**을 쓰도록 강제합니다(공유 값은 자료에서 학습). 독립 파라미터 수가 연결 수보다 적어지고, 흔히 자료의 알려진 **불변성**을 표현하는 귀납적 편향이 됩니다. 합성곱 신경망(CNN)에서 널리 씁니다. 기울기는 공유된 가중치들의 기울기를 더하면 되고, 실제로는 자동 미분이 처리합니다. 단, 제약의 형태를 **미리** 정할 수 있는 문제에만 적용됩니다.
:::fig share1d
:::

위 그림처럼 합성곱층에서는 같은 커널이 모든 위치에서 공유되며(연결 6개에 독립 모수 2개), 자세한 내용은 13단원에서 다룹니다[[ch13:10.2b|합성곱 연산과 평행이동 등변성.]].

**소프트 가중치 공유**(Nowlan & Hinton, 1992): 정확히 같게 강제하는 대신, 가중치들이 **비슷한 값의 군집**을 이루도록 유도합니다. 가중치 감쇠가 “모든 가중치를 0이라는 한 값으로” 끄는 가우시안 사전분포였다면, 여기서는 **혼합 가우시안**을 사전분포로 씁니다. 군집 중심 $\mu_j$, 분산 $\sigma_j^2$, 혼합 계수 $\pi_j$도 함께 학습합니다.

:::key 소프트 가중치 공유
$$p(\mathbf w)=\prod_i\Big\{\sum_{j=1}^K\pi_j\mathcal N(w_i\mid\mu_j,\sigma_j^2)\Big\}$$
$$\Omega(\mathbf w)=-\sum_i\ln\Big(\sum_{j=1}^K\pi_j\mathcal N(w_i\mid\mu_j,\sigma_j^2)\Big),\qquad \widetilde E(\mathbf w)=E(\mathbf w)+\lambda\Omega(\mathbf w)$$
책임도(사후확률) $\gamma_j(w_i)=\dfrac{\pi_j\mathcal N(w_i\mid\mu_j,\sigma_j^2)}{\sum_k\pi_k\mathcal N(w_i\mid\mu_k,\sigma_k^2)}$를 쓰면
$$\frac{\partial\widetilde E}{\partial w_i}=\frac{\partial E}{\partial w_i}+\lambda\sum_j\gamma_j(w_i)\frac{w_i-\mu_j}{\sigma_j^2},\qquad \frac{\partial\widetilde E}{\partial\mu_j}=\lambda\sum_i\gamma_j(w_i)\frac{\mu_j-w_i}{\sigma_j^2}$$
:::

:::fig softshare
:::

- 규제항은 각 가중치를 **가장 그럴듯한 군집 중심 쪽으로** 끌어당기고(그 군집의 책임도에 비례하는 힘), 중심 $\mu_j$는 책임도로 가중한 가중치들의 평균 쪽으로 움직입니다.
- 분산은 $\sigma_j^2=\exp(\xi_j)$, 혼합 계수는 $\pi_j=\operatorname{softmax}(\eta)_j$로 매개화해 제약 없이 경사하강합니다: $\partial\widetilde E/\partial\eta_j=\lambda\sum_i\{\pi_j-\gamma_j(w_i)\}$ → $\pi_j$는 평균 책임도로 수렴.
- **하이브리드 모델**(Lasserre, Bishop & Minka, 2006): 생성 모델(레이블 없는 자료도 사용)과 판별 모델(레이블 자료)의 파라미터를 소프트하게 묶어, 레이블 자료가 부족할 때 두 장점을 결합합니다.
` },
      { k: '9.5', label: '9.5', p: '274', src: '슬라이드 25–29', title: '잔차 연결', body: R`
깊이를 늘리면 표현력과 일반화가 크게 좋아질 수 있습니다. 배치 정규화와 신중한 초기화가 기울기 소실·폭발을 줄여 주지만, 그래도 **매우 깊은 망은 학습이 어렵습니다.**

**산산조각 난 기울기(shattered gradients).** ReLU 망은 깊이에 따라 선형 영역의 수가 지수적으로 늘고, 그 결과 오차 기울기에 **불연속**이 폭증합니다. 입력 하나·출력 하나인 망의 야코비안(입력에 대한 출력의 미분)을 그려 보면, 2층 망은 매끄럽지만 25층 망은 잡음처럼 요동칩니다. 앞쪽 층 파라미터를 아주 조금 바꿔도 기울기가 크게 바뀌므로, 기울기가 매끄럽게 변한다고 가정하는 경사 기반 최적화가 비효율적이 됩니다.
:::fig shattered
:::

:::key 잔차 연결
각 층(함수) $F_l$의 출력에 입력을 다시 더합니다.
$$\mathbf z_1=F_1(\mathbf x)+\mathbf x,\qquad \mathbf z_2=F_2(\mathbf z_1)+\mathbf z_1,\qquad \mathbf y=F_3(\mathbf z_2)+\mathbf z_2$$
$F_l(\mathbf z_{l-1})=\mathbf z_l-\mathbf z_{l-1}$ — 각 블록은 항등 사상과 원하는 출력의 **잔차**(필요한 변화량)만 배웁니다. 차원이 다르면 $\mathbf z_l=F_l(\mathbf z_{l-1})+\mathbf W\mathbf z_{l-1}$.
:::

- $F_l$의 파라미터가 작으면 블록이 **항등 변환**을 쉽게 표현합니다.
- 건너뛰는 연결이 정보와 기울기의 **직통 경로**가 되어, 잔차망의 기울기는 입력·파라미터의 작은 변화에 덜 민감합니다(51층 + 잔차 연결의 야코비안이 매끄러움). 오차 곡면도 훨씬 **매끄러워집니다**(56층 망의 시각화, Li et al. 2017).
- 배치 정규화와 함께 쓰면 **수백 층**의 망도 효과적으로 학습됩니다(ResNet, He et al. 2015).

**펼친 관점.** 세 블록을 대입하면
$$\mathbf y=F_3\big(F_2(F_1(\mathbf x)+\mathbf x)+F_1(\mathbf x)+\mathbf x\big)+F_2\big(F_1(\mathbf x)+\mathbf x\big)+F_1(\mathbf x)+\mathbf x$$
즉 **여러 깊이의 부분망이 병렬로** 작동하는 앙상블과 비슷합니다. 깊은 경로 → 높은 표현력, 얕은 경로 → 쉬운 기울기 전파와 매끄러운 최적화.
:::fig respaths
:::

:::fig residual
:::

**설계.** 선형층과 ReLU가 번갈아 나오는 망에서 (a) “Linear → ReLU → +”로 두면 더해지는 값이 ReLU 출력이라 항상 **음이 아니어서** 표현의 유연성이 줄어듭니다. 그래서 (b) “ReLU → Linear → +”처럼 **최종 ReLU 앞에서 더하는** 설계를 더 많이 씁니다.
:::fig resdesign
:::
` },
      { k: '9.6', label: '9.6', p: '277', src: '슬라이드 30–31', title: '모델 평균: 앙상블, 배깅, 부스팅', body: R`
하나의 최선 모델을 고르는 대신 여러 모델의 예측을 결합하면(위원회, **앙상블**) 흔히 일반화가 좋아집니다. 확률 모델이면 예측분포를 평균합니다: $p(y\mid\mathbf x)=\frac1L\sum_{l=1}^Lp_l(y\mid\mathbf x)$.

평균은 **분산을 줄여** 성능을 높입니다 — 모델마다의 예측 오차가 서로 부분적으로 상쇄되기 때문입니다(편향-분산 분해에서 분산 항). 단점은 여러 모델을 학습·평가해야 하는 **계산 비용**입니다.

:::key 위원회 오차
참 함수 $h(\mathbf x)$, 모델 $y_m(\mathbf x)=h(\mathbf x)+\epsilon_m(\mathbf x)$ ($m=1,\dots,M$), 위원회 $y_{\text{COM}}=\frac1M\sum_my_m$에 대해
$$E_{\text{AV}}=\frac1M\sum_{m=1}^M\E_{\mathbf x}\big[\epsilon_m(\mathbf x)^2\big],\qquad E_{\text{COM}}=\E_{\mathbf x}\Big[\Big\{\frac1M\sum_{m=1}^M\epsilon_m(\mathbf x)\Big\}^2\Big]$$
오차가 평균 0이고 서로 **무상관**이면 $E_{\text{COM}}=\dfrac1ME_{\text{AV}}$. 가정 없이도 항상 $E_{\text{COM}}\le E_{\text{AV}}$.
:::

:::fig committee
:::

:::ex 예제 1 — 상관된 위원회
오차의 분산이 모두 $v$(평균 0)이고 쌍마다 상관계수가 $\rho$인 모델 $M$개의 평균에 대해 $E_{\text{COM}}=\{\rho+(1-\rho)/M\}E_{\text{AV}}$를 보이고, $\rho=0.2$, $M=4$일 때 비율을 구하세요.
---
$E_{\text{COM}}=\frac1{M^2}\E\big[(\sum_m\epsilon_m)^2\big]=\frac1{M^2}\big(\sum_m\E[\epsilon_m^2]+\sum_{m\ne l}\E[\epsilon_m\epsilon_l]\big)=\frac1{M^2}\{Mv+M(M-1)\rho v\}=\Big(\frac1M+\frac{M-1}M\rho\Big)v$, 그리고 $E_{\text{AV}}=v$이므로 $\rho+\frac{1-\rho}M$. $\rho=0.2$, $M=4$: $0.2+0.8/4=0.4$.
:::

실제로는 모델들의 오차가 **강하게 상관**되어 있어 $1/M$만큼 줄지는 않지만, 위원회가 개별 모델의 평균보다 나빠지지는 않습니다. 효과적인 앙상블에는 모델들이 서로 **다른 오차**를 내는 **다양성**이 필요합니다.

**배깅**(bootstrap aggregation, Breiman 1996): 원래 자료 $N$개에서 **복원 추출**로 $N$개를 뽑아 부트스트랩 자료를 $L$개 만듭니다(어떤 점은 여러 번, 어떤 점은 빠짐). 각 자료로 모델을 따로 학습하고 예측을 평균합니다. (다른 방법: 같은 자료로 구조가 다른 모델들을 학습)
:::fig bootstrap
:::

**부스팅**(Freund & Schapire, 1996): 모델들을 **순차적으로** 학습합니다. 앞선 분류기가 **틀린 예제에 더 큰 가중치**를 주어 다음 분류기를 학습하고, 최종 예측은 **가중 다수결**로 결합합니다. 기본 분류기가 무작위보다 조금만 나아도 좋은 결과를 낼 수 있습니다[[@ml:ch08:10.2b|AdaBoost: 매 라운드 오차 ≤ ½ − γ이면 훈련 오차 ≤ exp(−2γ²T).]].

| | 배깅 | 부스팅 |
|---|---|---|
| 학습 순서 | 독립(병렬) | 순차 |
| 다양성의 원천 | 부트스트랩 자료 | 오분류 예제의 가중치 증가 |
| 결합 | 평균 | 가중 다수결 |
` },
      { k: '9.6b', label: '9.6.1', p: '279', src: '슬라이드 32–33', title: '드롭아웃', body: R`
**드롭아웃**(Srivastava et al., 2014)은 널리 쓰이고 계산이 싼 규제로, 개별 모델을 따로 학습하지 않고 **지수적으로 많은 신경망에 대한 근사적 모델 평균**으로 해석됩니다.

:::fig dropout
:::

:::key 드롭아웃
**학습**: 예제를 넣을 때마다 입력·은닉 노드(출력 제외)를 무작위로 제거합니다. 노드 $i$의 활성에 마스크 $R_i\in\{0,1\}$ (확률 $\rho$로 1)을 곱하는 것과 같고, 보통 은닉 $\rho=0.5$, 입력 $\rho=0.8$. 비출력 노드가 $M$개면 부분망은 $2^M$개이고, 모두 **파라미터를 공유**합니다.
**추론**: 정확한 평균 $p(y\mid\mathbf x)=\sum_Rp(R)p(y\mid\mathbf x,R)$은 계산 불가 →
(1) **몬테카를로 드롭아웃**: 마스크를 10–20개 정도 뽑아 예측을 평균
(2) 마스크 없는 **전체 망**을 쓰되, 학습 때 확률 $\rho$로 존재하던 노드의 **나가는 가중치에 $\rho$를 곱해** 각 노드로의 입력 기댓값을 학습 때와 맞춤
:::

- 기존 앙상블은 각 망을 독립적으로 수렴할 때까지 학습하지만, 드롭아웃의 부분망들은 매개변수를 공유하고 그중 극히 일부만 학습 중에 등장합니다 → 훨씬 효율적.
- 특정 뉴런에 지나치게 의존하지 못하게 하여 **공적응**(co-adaptation)과 과도한 특화를 줄입니다.
- 베이지안 관점: 모든 $2^M$개 모델을 사후확률로 가중 평균하는 대신 **같은 가중치**로 평균하는 근사.
- 대가: 갱신이 매우 잡음이 많아 학습이 오래 걸리고, 오차가 원래 잡음이 많아 최적화가 잘 되는지 확인하기 어렵습니다.
- 최소제곱 선형회귀에서 드롭아웃은 변형된 이차 규제와 같습니다.

:::note 역드롭아웃 (구현 관행)
많은 프레임워크는 학습 때 남은 활성에 $1/\rho$를 곱하고(inverted dropout) 추론 때는 아무것도 하지 않습니다. 기댓값을 맞춘다는 점에서 추론 시 $\times\rho$와 같은 효과입니다.
:::
` },
    ],
    problems: [
      { sec: '9.4', type: 'mc', lv: 1, q: R`하드 가중치 공유가 모델 복잡도를 줄이는 방식은?`,
        choices: [R`가중치를 0으로 만든다`, R`여러 가중치가 같은 값을 쓰도록 강제해 독립 파라미터 수를 줄인다`, R`학습률을 줄인다`, R`노드를 무작위로 제거한다`], ans: 1,
        sol: R`CNN의 합성곱 필터가 대표적입니다.` },
      { sec: '9.4', type: 'mc', lv: 2, q: R`소프트 가중치 공유의 사전분포는?`,
        choices: [R`평균 0인 단일 가우시안`, R`중심·분산·혼합 계수도 학습하는 혼합 가우시안`, R`라플라스 분포`, R`균등분포`], ans: 1,
        sol: R`가중치들이 여러 군집을 이루도록 유도합니다.` },
      { sec: '9.4', type: 'num', lv: 2, q: R`두 성분 $\pi_1=\pi_2=0.5$, $\mu_1=0$, $\mu_2=1$, $\sigma_1=\sigma_2=1$인 혼합에서 $w=0.5$의 책임도 $\gamma_1(w)$는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$w=0.5$는 두 중심에서 같은 거리이므로 $\mathcal N(0.5\mid0,1)=\mathcal N(0.5\mid1,1)$, $\gamma_1=0.5$.` },
      { sec: '9.4', type: 'num', lv: 3, q: R`위 문제에서 $\lambda=1$일 때 $w=0.5$에 대한 규제항의 기울기 $\lambda\sum_j\gamma_j(w)\frac{w-\mu_j}{\sigma_j^2}$는?`, ans: '0', ansTex: R`0`,
        sol: R`$0.5\cdot0.5+0.5\cdot(-0.5)=0$ — 두 중심이 같은 힘으로 반대 방향으로 당깁니다.` },
      { sec: '9.5', type: 'mc', lv: 1, q: R`잔차 블록에서 $F_l$이 학습하는 것은?`,
        choices: [R`원하는 출력 전체`, R`입력과 원하는 출력의 차이(잔차) $\mathbf z_l-\mathbf z_{l-1}$`, R`입력의 역함수`, R`배치 통계`], ans: 1,
        sol: R`$F_l(\mathbf z_{l-1})=\mathbf z_l-\mathbf z_{l-1}$.` },
      { sec: '9.5', type: 'mc', lv: 1, q: R`매우 깊은 망에서 앞 층 파라미터의 작은 변화가 기울기를 크게 바꾸는 현상은?`,
        choices: [R`기울기 소실`, R`산산조각 난 기울기(shattered gradients)`, R`내부 공변량 이동`, R`이중 하강`], ans: 1,
        sol: R`Balduzzi et al. (2017). 잔차 연결이 이를 완화합니다.` },
      { sec: '9.5', type: 'num', lv: 2, q: R`잔차 블록 $L$개를 펼치면 각 블록마다 “$F_l$을 거침/건너뜀”의 선택이 있다. $L=3$이면 서로 다른 경로는 몇 개인가?`, ans: '8', ansTex: R`2^3=8`,
        sol: R`블록마다 두 갈래이므로 $2^L$. 펼친 식의 항(항등 경로 $\mathbf x$ 포함)이 이 경로들에 대응합니다.` },
      { sec: '9.5', type: 'mc', lv: 2, q: R`잔차를 최종 ReLU 앞에서 더하는 설계를 선호하는 이유는?`,
        choices: [R`계산이 빨라서`, R`ReLU 뒤에서 더하면 더해지는 값이 항상 음이 아니라 표현 유연성이 줄어서`, R`파라미터가 줄어서`, R`배치 정규화가 필요 없어서`], ans: 1,
        sol: R`양수와 음수 변화를 모두 표현하려면 ReLU 앞에서 더해야 합니다.` },
      { sec: '9.6', type: 'num', lv: 1, q: R`오차가 평균 0이고 무상관인 모델 5개의 평균 오차가 $E_{\text{AV}}=0.2$일 때 위원회 오차는?`, ans: '0.04', ansTex: R`0.04`,
        sol: R`$E_{\text{COM}}=E_{\text{AV}}/M=0.2/5$.` },
      { sec: '9.6', type: 'num', lv: 3, q: R`두 모델의 오차 $\epsilon_1,\epsilon_2$가 $\E[\epsilon_1^2]=\E[\epsilon_2^2]=1$, $\E[\epsilon_1\epsilon_2]=0.6$이면 $E_{\text{COM}}$은?`, ans: '0.8', ansTex: R`0.8`,
        sol: R`$\frac14\E[(\epsilon_1+\epsilon_2)^2]=\frac14(1+1+1.2)=0.8$. $E_{\text{AV}}=1$이므로 줄긴 하지만 무상관일 때의 $0.5$보다 훨씬 덜 줄어듭니다.` },
      { sec: '9.6', type: 'num', lv: 2, q: R`$N$개에서 복원 추출로 $N$개를 뽑을 때 특정 점이 한 번도 뽑히지 않을 확률은 $N\to\infty$에서? (소수 넷째 자리)`, ans: 'e^(-1)', ansTex: R`e^{-1}\approx0.3679`,
        sol: R`$(1-1/N)^N\to e^{-1}$. 부트스트랩 자료는 원래 자료의 약 63.2%만 포함합니다.` },
      { sec: '9.6', type: 'mc', lv: 1, q: R`부스팅의 특징이 아닌 것은?`,
        choices: [R`모델을 순차적으로 학습`, R`앞 모델이 틀린 예제에 더 큰 가중치`, R`가중 다수결로 결합`, R`부트스트랩 자료로 독립 학습`], ans: 3,
        sol: R`독립 학습은 배깅의 특징입니다.` },
      { sec: '9.6b', type: 'num', lv: 1, q: R`비출력 노드가 20개인 망에서 드롭아웃이 암묵적으로 다루는 부분망의 수는?`, ans: '2^20', ansTex: R`2^{20}=1{,}048{,}576`,
        sol: R`각 노드가 있거나 없거나 — $2^M$.` },
      { sec: '9.6b', type: 'num', lv: 2, q: R`은닉 노드가 $\rho=0.5$로 유지되도록 학습했다. 추론 시 전체 망을 쓸 때 학습된 나가는 가중치 $w=1.6$은 얼마로 바꿔야 하는가?`, ans: '0.8', ansTex: R`0.8`,
        sol: R`나가는 가중치에 $\rho$를 곱합니다: $1.6\times0.5$.` },
      { sec: '9.6b', type: 'mc', lv: 1, q: R`드롭아웃이 적용되지 않는 노드는?`,
        choices: [R`입력 노드`, R`은닉 노드`, R`출력 노드`, R`모두 적용된다`], ans: 2,
        sol: R`입력($\rho\approx0.8$)과 은닉($\rho\approx0.5$)에는 적용하고 출력에는 적용하지 않습니다.` },
      { sec: '9.6b', type: 'mc', lv: 2, q: R`몬테카를로 드롭아웃에 대한 설명으로 옳은 것은?`,
        choices: [R`학습 때만 쓰는 기법이다`, R`추론 때 무작위 마스크 몇 개(10–20개)로 예측해 평균한다`, R`가중치에 $\rho$를 곱한다`, R`모든 $2^M$개 마스크를 평균한다`], ans: 1,
        sol: R`정확한 합은 계산 불가이므로 표본 평균으로 근사합니다. 예측의 불확실성 추정에도 쓰입니다.` },
      { sec: '9.6', type: 'open', lv: 3, q: R`위원회 $y_{\text{COM}}=\frac1M\sum_my_m$, $y_m=h+\epsilon_m$에 대해 (i) 오차가 평균 0이고 무상관이면 $E_{\text{COM}}=\frac1ME_{\text{AV}}$, (ii) 가정 없이 $E_{\text{COM}}\le E_{\text{AV}}$임을 증명하세요.`, proof: true,
        sol: R`
(i) $E_{\text{COM}}=\frac1{M^2}\E\big[(\sum_m\epsilon_m)^2\big]=\frac1{M^2}\big(\sum_m\E[\epsilon_m^2]+\sum_{m\ne l}\E[\epsilon_m\epsilon_l]\big)$. 무상관이면 교차항이 0이므로 $=\frac1{M^2}\sum_m\E[\epsilon_m^2]=\frac1ME_{\text{AV}}$.
(ii) 코시-슈바르츠(또는 $x^2$의 볼록성, 옌센)로 각 $\mathbf x$에서 $\big(\frac1M\sum_m\epsilon_m\big)^2\le\frac1M\sum_m\epsilon_m^2$. 양변의 기댓값을 취하면 $E_{\text{COM}}\le E_{\text{AV}}$.`,
        rubric: R`
- 제곱 전개와 교차항
- 무상관 가정 사용
- 점별 부등식(볼록성)과 기댓값` },
    ],
  });
})();
