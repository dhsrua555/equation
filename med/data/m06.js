/* 06 베이지안 확률 — Bishop 2.6 (p.54–58), 강의 Ch02 s.40–44 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 6, part: 'B', title: '베이지안 확률과 규제', en: 'Bayesian Probabilities', ref: 'Bishop §2.6', plot: 'posterior',
    fig: R`자료가 쌓일수록 평균에 대한 사후분포가 좁아지는 모습`,
    tagline: R`사후 ∝ 가능도 × 사전. 가우시안 사전분포로 MAP을 구하면 그것이 바로 L2 규제입니다.`,
    summary: R`확률의 두 해석(빈도, 믿음의 정도)을 다시 정리하고, 모수 $\mathbf w$에 사전분포를 두어 자료로 사후분포를 얻는 **베이지안 추정**을 다룹니다. MLE가 작은 자료에서 과신하는 문제(동전 세 번 모두 앞면 → 앞면 확률 1)를 사전분포가 완화합니다. 사후확률을 최대로 하는 **MAP** 추정은 음의 로그 사후분포 = 자료 적합 항 + 규제 항 + 정규화 항으로 분해되고, 영평균 가우시안 사전분포를 고르면 정확히 $L_2$ 규제가 됩니다. 완전한 베이지안 예측은 사후분포로 모든 모수를 평균내지만 고차원 적분이 비싸서, 딥러닝은 보통 “최대가능도 + 규제”로 근사합니다.`,
    goals: [
      R`사전·사후확률, 가능도, 증거의 의미를 말하고 베이즈 정리로 사후분포를 쓸 수 있다`,
      R`MLE가 작은 자료에서 과신하는 이유와 베이지안 추론이 이를 완화하는 방식을 설명할 수 있다`,
      R`$-\ln p(\mathbf w\mid\mathcal D)$를 세 항으로 분해하고 가우시안 사전분포에서 $L_2$ 규제를 유도할 수 있다`,
      R`규제 계수 $\lambda$와 잡음·사전분포 분산의 관계 $\lambda=\sigma^2/s^2$를 유도할 수 있다`,
      R`완전 베이지안 예측분포 $\int p(t\mid x,\mathbf w)p(\mathbf w\mid\mathcal D)d\mathbf w$와 그 한계를 설명할 수 있다`,
    ],
    secTitles: { '2.6': '모수와 사후분포', '2.6b': 'MAP과 규제', '2.6c': '베이지안 ML' },
    sections: [
      { k: '2.6', label: '2.6–2.6.1', p: '54', src: '슬라이드 41–42', title: '모수의 불확실성과 사후분포', body: R`
확률에는 서로 보완하는 두 해석이 있습니다.
- **빈도주의**: 반복 가능한 무작위 사건의 장기 빈도
- **베이지안**: 미지량에 대한 **불확실성** 또는 **믿음의 정도**

**베이지안 추론**은 관측 자료로 사전 믿음을 갱신합니다: **사전확률**(자료를 보기 전의 믿음) → **사후확률**(자료를 본 뒤 갱신된 믿음).

**MLE와의 차이.** MLE는 작은 자료에서 지나치게 확신에 찬 결론을 냅니다. 예: 동전을 세 번 던져 모두 앞면이면 MLE는 앞면 확률을 1로 추정하고 앞으로 모든 던지기가 앞면이라고 예측합니다. 베이지안 추론은 관측을 **사전 지식**과 결합해 더 현실적이고 덜 극단적인 추정을 냅니다.

:::key 베이지안 모수 추정
MLE는 가능도 $p(\mathcal D\mid\mathbf w)$를 최대화해 **하나의** 추정값 $\mathbf w_{\text{ML}}$을 낸다(다른 훈련 자료면 다른 추정값 → 추정에 내재한 불확실성). 베이지안 추론은 자료를 보기 전 모수에 사전분포 $p(\mathbf w)$를 두고 베이즈 정리로 갱신한다:
$$p(\mathbf w\mid\mathcal D)=\frac{p(\mathcal D\mid\mathbf w)\,p(\mathbf w)}{p(\mathcal D)},\qquad \text{사후}\propto\text{가능도}\times\text{사전}$$
:::

$p(\mathcal D)=\int p(\mathcal D\mid\mathbf w)p(\mathbf w)\,d\mathbf w$는 사후분포를 정규화합니다. 가능도 $p(\mathcal D\mid\mathbf w)$는 $\mathbf w$의 함수로서는 확률분포가 아니며 적분이 1일 필요가 없습니다.

:::ex 예제 1 — 세 번 연속 앞면
균등 사전분포 $p(\mu)=1$ ($0\le\mu\le1$)에서 앞면 3번을 관측했을 때 사후분포와 사후평균은?
---
$p(\mathcal D\mid\mu)=\mu^3$이므로 사후분포 $\propto\mu^3$, 정규화하면 $4\mu^3$ (베타분포 $\operatorname{Beta}(4,1)$). 사후평균 $\int_0^14\mu^4d\mu=\frac45=0.8$. MLE의 극단값 1보다 덜 극단적이고, 자료가 쌓이면 사후분포가 좁아지며 참값으로 모입니다[[@dnn:ch02:2.5|베르누이 가능도 + 베타 사전분포 → 베타 사후분포.]].
:::

:::fig coinpost
:::
` },
      { k: '2.6b', label: '2.6.2', p: '56', src: '슬라이드 43', title: 'MAP 추정과 규제', body: R`
베이지안 학습에서 사후확률을 최대로 하는 모수가 **MAP**(maximum a posteriori) 추정입니다. 자료를 본 뒤 **가장 그럴듯한** 모수 값을 고릅니다. 사후확률 최대화는 음의 로그 사후확률 최소화와 같습니다.

:::key MAP과 L2 규제
$$-\ln p(\mathbf w\mid\mathcal D)=\underbrace{-\ln p(\mathcal D\mid\mathbf w)}_{\text{자료 적합}}\ \underbrace{-\ln p(\mathbf w)}_{\text{규제}}\ \underbrace{+\ln p(\mathcal D)}_{\text{정규화}}$$
영평균 가우시안 사전분포 $p(\mathbf w\mid s)=\prod_{i=0}^M\N(w_i\mid0,s^2)=\prod_{i=0}^M\Big(\frac1{2\pi s^2}\Big)^{1/2}\exp\Big\{-\frac{w_i^2}{2s^2}\Big\}$이면
$$-\ln p(\mathbf w\mid\mathcal D)=-\ln p(\mathcal D\mid\mathbf w)+\frac1{2s^2}\sum_{i=0}^Mw_i^2+\text{const}$$
가우시안 잡음 회귀에서는 $E(\mathbf w)=\frac1{2\sigma^2}\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}^2+\frac1{2s^2}\mathbf w^T\mathbf w$.
:::

:::fig mapprior
:::

:::ex 예제 2 — 가중치 하나의 MAP
가능도가 $w$에 대해 $\N(w\mid w_{\text{ML}},v)$ 모양($w_{\text{ML}}=1.6$, $v=0.35$)이고 사전분포가 $\N(w\mid0,s^2)$, $s^2=0.5$일 때 $w_{\text{MAP}}$은?
---
$-\ln(\text{사후})=\frac{(w-w_{\text{ML}})^2}{2v}+\frac{w^2}{2s^2}+\text{const}$를 미분해 0으로 두면 $\frac{w-w_{\text{ML}}}v+\frac w{s^2}=0$,
$$w_{\text{MAP}}=\frac{w_{\text{ML}}/v}{1/v+1/s^2}=\frac{s^2}{s^2+v}\,w_{\text{ML}}=\frac{0.5}{0.85}\times1.6\approx0.941.$$
정밀도(분산의 역수)로 가중한 평균이며, 사전분포의 평균 0 쪽으로 $\frac{s^2}{s^2+v}$배 줄어듭니다(위 그림의 값).
:::

양변에 $\sigma^2$을 곱하면 $\frac12\sum\{y-t\}^2+\frac\lambda2\mathbf w^T\mathbf w$, **$\lambda=\sigma^2/s^2$**. 즉 1장의 $L_2$ 규제는 “가중치가 0 근처에 있을 것”이라는 **사전분포의 MAP 추정**입니다. 사전분포가 좁을수록($s$ 작을수록), 잡음이 클수록($\sigma$ 클수록) 규제가 셉니다. 정규화 항 $\ln p(\mathcal D)$는 $\mathbf w$와 무관해 최적화에 영향이 없습니다.
` },
      { k: '2.6c', label: '2.6.3', p: '57', src: '슬라이드 44', title: '완전 베이지안 머신러닝', body: R`
MAP은 가장 그럴듯한 모수 **하나**만 고르므로 **부분적으로만** 베이지안입니다. 완전한 베이지안 접근은 모수에 대한 사후분포 **전체**를 유지하고, 예측할 때 가능한 모든 모수 값을 사후확률로 가중 평균합니다.

:::key 베이지안 예측분포
$$p(t\mid x,\mathcal D)=\int p(t\mid x,\mathbf w)\,p(\mathbf w\mid\mathcal D)\,d\mathbf w$$
:::

:::fig predictive
:::

- 예측의 불확실성에 모수 추정의 불확실성까지 반영됩니다(자료가 적은 곳에서는 예측분포가 넓어짐).
- 그러나 고차원 모수 공간에서의 적분은 계산 비용이 커서 완전한 베이지안 추론은 **비현실적**입니다(신경망은 모수가 수백만~수십억 개).
- 그래서 현대의 대규모 딥러닝은 보통 **최대가능도 + 규제**를 효과적인 근사로 씁니다. 드롭아웃을 여러 모델의 평균으로 보는 관점도 이 근사의 일종입니다[[ch12:9.6|드롭아웃은 모든 가능한 부분 신경망을 같은 가중치로 평균내는 근사.]].
` },
    ],
    problems: [
      { sec: '2.6', type: 'mc', lv: 1, q: R`동전을 세 번 던져 모두 앞면일 때 MLE의 문제로 옳은 것은?`,
        choices: [R`앞면 확률을 0.5로 추정한다`, R`앞면 확률을 1로 추정해 과신한다`, R`추정할 수 없다`, R`사전분포가 필요 없다`], ans: 1,
        sol: R`$\hat\mu=3/3=1$. 앞으로 모두 앞면이라는 극단적 예측. 사전분포가 이를 완화합니다.` },
      { sec: '2.6', type: 'num', lv: 2, q: R`균등 사전분포에서 앞면 3번 관측 후 사후평균은?`, ans: '0.8', ansTex: R`\tfrac45`,
        sol: R`사후 $4\mu^3$, 평균 $\int_0^14\mu^4d\mu=4/5$.` },
      { sec: '2.6', type: 'num', lv: 2, q: R`균등 사전분포에서 앞면 3번, 뒷면 1번 관측 후 사후평균은?`, ans: '4/6', ansTex: R`\tfrac23`,
        sol: R`사후 $\propto\mu^3(1-\mu)$ ($\operatorname{Beta}(4,2)$), 평균 $\frac{4}{6}$. MLE는 $\frac34$.` },
      { sec: '2.6', type: 'mc', lv: 1, q: R`“사후 ∝ 가능도 × 사전”에서 생략된 것은?`,
        choices: [R`손실함수`, R`$\mathbf w$와 무관한 정규화 상수 $p(\mathcal D)$`, R`학습률`, R`규제항`], ans: 1,
        sol: R`$p(\mathcal D)=\int p(\mathcal D\mid\mathbf w)p(\mathbf w)d\mathbf w$는 $\mathbf w$의 함수가 아닙니다.` },
      { sec: '2.6b', type: 'mc', lv: 2, q: R`MAP 추정의 음의 로그 사후분포에서 “규제 항”에 해당하는 것은?`,
        choices: [R`$-\ln p(\mathcal D\mid\mathbf w)$`, R`$-\ln p(\mathbf w)$`, R`$\ln p(\mathcal D)$`, R`$\ln p(\mathbf w\mid\mathcal D)$`], ans: 1,
        sol: R`음의 로그 사전분포가 규제 항입니다.` },
      { sec: '2.6b', type: 'num', lv: 2, q: R`잡음 분산 $\sigma^2=0.04$, 사전분포 분산 $s^2=2$일 때 대응하는 $L_2$ 규제 계수 $\lambda$는?`, ans: '0.02', ansTex: R`0.02`,
        sol: R`$\lambda=\sigma^2/s^2=0.04/2=0.02$.` },
      { sec: '2.6b', type: 'mc', lv: 2, q: R`사전분포를 더 좁게(분산 $s^2$을 작게) 하면 MAP 추정은?`,
        choices: [R`규제가 약해진다`, R`규제가 강해져 가중치가 0 쪽으로 더 줄어든다`, R`MLE와 같아진다`, R`변화 없다`], ans: 1,
        sol: R`$\lambda=\sigma^2/s^2$가 커집니다. $s\to\infty$(평평한 사전분포)이면 MLE.` },
      { sec: '2.6b', type: 'mc', lv: 3, q: R`각 가중치에 라플라스 사전분포 $p(w_i)\propto\exp(-\lvert w_i\rvert/b)$를 두면 MAP은 어떤 규제가 되는가?`,
        choices: [R`$L_2$`, R`$L_1$ (라쏘)`, R`드롭아웃`, R`조기 종료`], ans: 1,
        sol: R`$-\ln p(\mathbf w)=\frac1b\sum\lvert w_i\rvert+$상수.` },
      { sec: '2.6c', type: 'mc', lv: 1, q: R`MAP을 “부분적으로만 베이지안”이라 부르는 이유는?`,
        choices: [R`사전분포를 쓰지 않아서`, R`사후분포 전체 대신 가장 그럴듯한 모수 하나만 쓰기 때문`, R`가능도를 쓰지 않아서`, R`적분을 너무 많이 해서`], ans: 1,
        sol: R`완전 베이지안은 사후분포 전체로 예측을 평균냅니다.` },
      { sec: '2.6c', type: 'mc', lv: 2, q: R`딥러닝에서 완전한 베이지안 추론 대신 “최대가능도 + 규제”를 쓰는 주된 이유는?`,
        choices: [R`베이지안이 항상 성능이 나빠서`, R`고차원 모수 공간의 적분 비용이 너무 커서`, R`사전분포를 정의할 수 없어서`, R`가능도를 계산할 수 없어서`], ans: 1,
        sol: R`$\int p(t\mid x,\mathbf w)p(\mathbf w\mid\mathcal D)d\mathbf w$를 수백만 차원에서 계산하기 어렵습니다.` },
      { sec: '2.6b', type: 'open', lv: 2, q: R`가우시안 잡음 회귀에서 사전분포 $\prod_i\N(w_i\mid0,s^2)$를 두면 MAP 추정이 $\frac12\sum\{y(x_n,\mathbf w)-t_n\}^2+\frac\lambda2\lVert\mathbf w\rVert^2$의 최소화와 같고 $\lambda=\sigma^2/s^2$임을 보이세요.`,
        sol: R`
$-\ln p(\mathbf w\mid\mathcal D)=-\ln p(\mathbf t\mid\mathbf w)-\ln p(\mathbf w)+\ln p(\mathcal D)$.
$-\ln p(\mathbf t\mid\mathbf w)=\frac1{2\sigma^2}\sum\{y-t\}^2+c_1$, $-\ln p(\mathbf w)=\frac1{2s^2}\sum w_i^2+c_2$. $\ln p(\mathcal D)$와 상수는 $\mathbf w$와 무관.
따라서 MAP은 $\frac1{2\sigma^2}\sum\{y-t\}^2+\frac1{2s^2}\lVert\mathbf w\rVert^2$의 최소점이고, $\sigma^2$을 곱하면 $\frac12\sum\{y-t\}^2+\frac{\sigma^2}{2s^2}\lVert\mathbf w\rVert^2$ — 양의 상수배는 최소점을 바꾸지 않습니다. $\lambda=\sigma^2/s^2$.` },
    ],
  });
})();
