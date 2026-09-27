/* 04 확률밀도와 가우시안 분포 — Bishop 2.2–2.3 (p.32–42), 강의 Ch02 s.12–26 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 4, part: 'B', title: '확률밀도와 가우시안 분포', en: 'Densities, Expectations, the Gaussian', ref: 'Bishop §2.2–2.3', plot: 'gauss',
    fig: R`평균과 분산이 다른 가우시안 밀도들`,
    tagline: R`표본평균과 표본분산이 가우시안의 최대가능도 해입니다. 다만 분산의 MLE는 평균을 추정값으로 쓴 탓에 (N−1)/N만큼 작게 나옵니다.`,
    summary: R`연속 변수는 한 점의 확률이 0이므로 확률밀도로 다룹니다. 밀도·누적분포·결합밀도, 대표적인 분포(균등, 지수, 라플라스, 디랙 델타로 쓴 경험분포), 기댓값·분산·공분산을 정리한 뒤 가우시안 분포 $\N(x\mid\mu,\sigma^2)$의 성질과 1·2차 모멘트를 봅니다. i.i.d. 자료의 가능도와 로그가능도에서 **최대가능도 해** $\mu_{\text{ML}}=\bar x$, $\sigma^2_{\text{ML}}=\frac1N\sum(x_n-\bar x)^2$을 얻고, 분산 추정량의 **편향** $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$과 보정을 다룹니다. 마지막으로 선형회귀를 “목표값이 가우시안”이라는 확률모델로 보면 MLE가 제곱오차합 최소화와 같아집니다.`,
    goals: [
      R`확률밀도와 누적분포의 관계, 결합밀도에서의 합·곱·베이즈 규칙을 쓸 수 있다`,
      R`기댓값·분산·공분산의 정의와 $\Var[x]=\E[x^2]-\E[x]^2$를 쓸 수 있다`,
      R`가우시안의 평균·2차 모멘트·분산과 정밀도를 말할 수 있다`,
      R`가우시안 로그가능도를 미분해 $\mu_{\text{ML}}$, $\sigma^2_{\text{ML}}$을 유도할 수 있다`,
      R`$\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$를 증명하고 불편 추정량을 쓸 수 있다`,
      R`선형회귀의 확률적 해석에서 MLE = 제곱오차합 최소화, $\sigma^2_{\text{ML}}=$평균제곱잔차임을 보일 수 있다`,
    ],
    secTitles: { '2.2': '확률밀도', '2.2b': '기댓값·공분산', '2.3': '가우시안·MLE', '2.3b': 'MLE의 편향', '2.3c': '선형회귀' },
    sections: [
      { k: '2.2', label: '2.2–2.2.1', p: '32', src: '슬라이드 13–15', title: '확률밀도와 대표 분포', body: R`
연속 변수는 정확히 한 값을 관측할 확률이 사실상 0이므로 점 확률 대신 **확률밀도함수**(PDF)로 기술합니다.

:::key 확률밀도와 누적분포
$$p(x\in(a,b))=\int_a^bp(x)\,dx,\qquad p(x)\ge0,\qquad \int_{-\infty}^\infty p(x)\,dx=1$$
$$P(z)=\int_{-\infty}^zp(x)\,dx\ (\text{CDF}),\qquad P'(x)=p(x)$$
:::

$p(x)$는 확률이 아니라 **밀도**이므로 1보다 클 수 있습니다(예: 폭이 0.5인 균등분포의 밀도는 2). 작은 구간의 확률이 $p(x)\delta x$입니다.

**여러 변수.** 결합밀도 $p(\mathbf x)=p(x_1,\dots,x_D)$, $p(\mathbf x)\ge0$, $\int p(\mathbf x)d\mathbf x=1$.
- 합의 규칙 $p(\mathbf x)=\int p(\mathbf x,\mathbf y)\,d\mathbf y$, 곱의 규칙 $p(\mathbf x,\mathbf y)=p(\mathbf y\mid\mathbf x)p(\mathbf x)$
- 베이즈 규칙 $p(\mathbf y\mid\mathbf x)=\dfrac{p(\mathbf x\mid\mathbf y)p(\mathbf y)}{p(\mathbf x)}$, $p(\mathbf x)=\int p(\mathbf x\mid\mathbf y)p(\mathbf y)\,d\mathbf y$

**대표 분포.**
| 분포 | 밀도 |
|---|---|
| 균등 $[c,d]$ | $1/(d-c)$ |
| 지수 | $p(x\mid\lambda)=\lambda\exp(-\lambda x)$, $x\ge0$ |
| 라플라스 | $p(x\mid\mu,\gamma)=\dfrac1{2\gamma}\exp\Big(-\dfrac{\lvert x-\mu\rvert}\gamma\Big)$ |
| 경험분포 | $p(x\mid\mathcal D)=\dfrac1N\sum_{n=1}^N\delta(x-x_n)$ |

디랙 델타 $p(x\mid\mu)=\delta(x-\mu)$는 한 점에 모든 질량이 몰린 “분포”이고, 경험분포는 관측점마다 $1/N$씩 질량을 둔 것입니다.
` },
      { k: '2.2b', label: '2.2.2', p: '34', src: '슬라이드 16–17', title: '기댓값, 분산, 공분산', body: R`
:::key 기댓값과 분산
$$\E[f]=\sum_xp(x)f(x)\quad\text{또는}\quad\int p(x)f(x)\,dx,\qquad \E[f]\simeq\frac1N\sum_{n=1}^Nf(x_n)$$
$$\Var[f]=\E\big[(f(x)-\E[f(x)])^2\big]=\E[f(x)^2]-\E[f(x)]^2,\qquad \Var[x]=\E[x^2]-\E[x]^2$$
$$\Cov[x,y]=\E_{x,y}\big[\{x-\E[x]\}\{y-\E[y]\}\big]=\E_{x,y}[xy]-\E[x]\E[y]$$
:::

- **기댓값**은 확률로 가중한 평균입니다. 유한한 표본으로는 표본평균으로 근사합니다($N\to\infty$이면 정확).
- $\E_x[f(x,y)]$처럼 한 변수에 대해서만 평균내면 결과는 **$y$의 함수**입니다.
- **조건부 기댓값** $\E_x[f\mid y]=\sum_xp(x\mid y)f(x)$ (또는 적분).
- **분산**은 평균 주변의 퍼짐, **공분산**은 두 변수가 함께 변하는 정도입니다. 독립이면 $\Cov=0$ (역은 일반적으로 성립하지 않음).
- 벡터: $\Cov[\mathbf x,\mathbf y]=\E_{\mathbf x,\mathbf y}\big[\{\mathbf x-\E\mathbf x\}\{\mathbf y^T-\E\mathbf y^T\}\big]=\E[\mathbf x\mathbf y^T]-\E[\mathbf x]\E[\mathbf y^T]$, 그리고 $\Cov[\mathbf x]\equiv\Cov[\mathbf x,\mathbf x]$ (성분들 사이의 공분산 행렬).
` },
      { k: '2.3', label: '2.3–2.3.2', p: '36', src: '슬라이드 19–23', title: '가우시안 분포와 최대가능도', body: R`
:::key 가우시안 분포
$$\N(x\mid\mu,\sigma^2)=\frac1{(2\pi\sigma^2)^{1/2}}\exp\Big\{-\frac1{2\sigma^2}(x-\mu)^2\Big\}>0,\qquad \int_{-\infty}^\infty\N(x\mid\mu,\sigma^2)dx=1$$
$$\E[x]=\mu,\qquad \E[x^2]=\mu^2+\sigma^2,\qquad \Var[x]=\sigma^2,\qquad \beta=1/\sigma^2\ (\text{정밀도})$$
:::

- $\mu$는 중심(위치), $\sigma^2$은 퍼짐. 대칭이라 **평균과 최빈값**(밀도가 가장 높은 값)이 모두 $\mu$입니다. 폭은 대략 $2\sigma$.
- **밀도 추정**은 유한한 자료로 분포를 추정하는 일이며, 무한히 많은 분포가 같은 자료를 설명할 수 있어 본질적으로 **불량 설정**(ill-posed) 문제입니다. 가우시안 같은 분포 가정이 유일하고 다루기 쉬운 해를 줍니다.

**가능도.** 관측 $\mathbf x=(x_1,\dots,x_N)$이 모수를 모르는 가우시안에서 i.i.d.로 나왔다면, 주어진 $(\mu,\sigma^2)$에서 자료가 나올 확률(밀도)은
$$p(\mathbf x\mid\mu,\sigma^2)=\prod_{n=1}^N\N(x_n\mid\mu,\sigma^2).$$
이를 모수의 함수로 본 것이 **가능도 함수**이고, 모수가 자료를 얼마나 잘 설명하는지를 잽니다.

**최대가능도(MLE).** 실제로는 **로그가능도**를 최대화합니다: 로그는 단조증가라 최대점의 위치가 같고, 곱이 합이 되어 유도가 쉽고, 작은 확률의 곱에서 생기는 **언더플로**를 막습니다.

:::key 가우시안의 최대가능도 해
$$\ln p(\mathbf x\mid\mu,\sigma^2)=-\frac1{2\sigma^2}\sum_{n=1}^N(x_n-\mu)^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi)$$
$$\mu_{\text{ML}}=\frac1N\sum_{n=1}^Nx_n\ (\text{표본평균}),\qquad \sigma^2_{\text{ML}}=\frac1N\sum_{n=1}^N(x_n-\mu_{\text{ML}})^2\ (\text{표본분산})$$
:::

$\mu$에 대해 미분하면 $\frac1{\sigma^2}\sum(x_n-\mu)=0$, 즉 $\mu_{\text{ML}}=\bar x$ ($\sigma^2$와 무관). 이를 넣고 $\sigma^2$에 대해 미분하면 $\frac1{2\sigma^4}\sum(x_n-\bar x)^2-\frac N{2\sigma^2}=0$.
` },
      { k: '2.3b', label: '2.3.3', p: '39', src: '슬라이드 24–25', title: '최대가능도의 편향과 보정', body: R`
MLE 추정량은 관측 자료의 함수라 표본에 따라 달라집니다. 같은 참 가우시안에서 뽑은 작은 자료(점 2개)마다 MLE로 가우시안을 맞추면 평균은 참값 주위에 흩어지지만, 분산은 **체계적으로 작게** 나옵니다.

:::key 최대가능도의 편향
$$\E[\mu_{\text{ML}}]=\mu,\qquad \E[\sigma^2_{\text{ML}}]=\Big(\frac{N-1}N\Big)\sigma^2$$
참 평균 $\mu$를 알면 $\hat\sigma^2=\frac1N\sum(x_n-\mu)^2$은 불편($\E[\hat\sigma^2]=\sigma^2$). 모르면 보정한
$$\tilde\sigma^2=\frac N{N-1}\sigma^2_{\text{ML}}=\frac1{N-1}\sum_{n=1}^N(x_n-\mu_{\text{ML}})^2$$
이 불편 추정량이다.
:::

- 편향의 원인: 분산을 참 평균이 아니라 **자료에 맞춘 평균** $\mu_{\text{ML}}$ 기준으로 재므로, 편차 제곱합이 가능한 한 작아지는 쪽으로 치우칩니다($\sum(x_n-c)^2$은 $c=\bar x$에서 최소).
- $N$이 크면 편향은 사라집니다. 가우시안처럼 단순한 모델은 보정이 쉽지만 신경망처럼 복잡한 모델은 어렵습니다.
- MLE의 편향은 **과적합과 밀접**합니다: 모델이 자료에 너무 잘 맞춰져 불확실성(분산)을 과소평가합니다.
` },
      { k: '2.3c', label: '2.3.4', p: '40', src: '슬라이드 26', title: '선형회귀의 확률적 해석', body: R`
목표값이 입력에 조건부로 가우시안이라고 가정합니다: 평균은 모델의 예측 $y(x,\mathbf w)$, 분산은 관측 잡음 $\sigma^2$.
$$p(t\mid x,\mathbf w,\sigma^2)=\N\big(t\mid y(x,\mathbf w),\sigma^2\big),\qquad \mathbf w:\ \text{다항식 계수}$$

:::key 선형회귀의 최대가능도
i.i.d. 자료의 로그가능도
$$\ln p(\mathbf t\mid\mathbf x,\mathbf w,\sigma^2)=-\frac1{2\sigma^2}\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi)$$
- $\mathbf w$에 대한 MLE ⇔ 제곱오차합 $E(\mathbf w)=\frac12\sum\{y(x_n,\mathbf w)-t_n\}^2$ 최소화
- 잡음 분산의 MLE는 평균제곱잔차: $\sigma^2_{\text{ML}}=\frac1N\sum_{n=1}^N\{y(x_n,\mathbf w_{\text{ML}})-t_n\}^2$
- 예측이 점 추정이 아닌 **분포**가 된다: $p(t\mid x,\mathbf w_{\text{ML}},\sigma^2_{\text{ML}})=\N\big(t\mid y(x,\mathbf w_{\text{ML}}),\sigma^2_{\text{ML}}\big)$
:::

1장에서 “그냥” 골랐던 제곱오차합이 가우시안 잡음 가정의 결과임을 보여 줍니다. 심층 신경망 과목에서도 같은 결론(LSE = MLE)을 다룹니다[[@dnn:ch04:4.1|$\log p=-n\log(\sqrt{2\pi}\sigma)-\sum(y_i-h_i)^2/2\sigma^2$.]].
` },
    ],
    problems: [
      { sec: '2.2', type: 'mc', lv: 1, q: R`확률밀도함수 $p(x)$에 대해 옳지 **않은** 것은?`,
        choices: [R`$p(x)\ge0$`, R`$\int p(x)dx=1$`, R`$p(x)\le1$이어야 한다`, R`$P'(x)=p(x)$`], ans: 2,
        sol: R`밀도는 1을 넘을 수 있습니다. 예: $[0,0.5]$ 균등분포의 밀도는 2.` },
      { sec: '2.2', type: 'num', lv: 1, q: R`지수분포 $p(x\mid\lambda)=\lambda e^{-\lambda x}$ ($\lambda=2$)에서 $P(x\le1)$은? (소수 넷째 자리)`, ans: '1-e^(-2)', ansTex: R`1-e^{-2}\approx0.8647`,
        sol: R`$\int_0^12e^{-2x}dx=1-e^{-2}$.` },
      { sec: '2.2', type: 'num', lv: 2, q: R`라플라스 분포 $p(x\mid\mu,\gamma)=\frac1{2\gamma}e^{-\lvert x-\mu\rvert/\gamma}$에서 $\mu=0$, $\gamma=1$일 때 $x=0$의 밀도값은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$\frac1{2}e^0=0.5$. 슬라이드 그림에서 라플라스 곡선이 $x=1$($\mu=1$)에서 0.5로 뾰족하게 솟은 이유입니다.` },
      { sec: '2.2b', type: 'num', lv: 1, q: R`$x\in\{0,1,2\}$, $p=(0.2,0.5,0.3)$일 때 $\Var[x]$는?`, ans: '0.49', ansTex: R`0.49`,
        sol: R`$\E x=0.5+0.6=1.1$, $\E x^2=0.5+1.2=1.7$, $\Var=1.7-1.21=0.49$.` },
      { sec: '2.2b', type: 'mc', lv: 2, q: R`$\E_x[f(x,y)]$는 무엇의 함수인가?`,
        choices: [R`$x$`, R`$y$`, R`상수`, R`$x$와 $y$`], ans: 1,
        sol: R`$x$에 대해 적분(합)했으므로 남는 변수는 $y$입니다.` },
      { sec: '2.2b', type: 'num', lv: 2, q: R`$\E[x]=2$, $\E[y]=3$, $\E[xy]=7$이면 $\Cov[x,y]$는?`, ans: '1', ansTex: R`1`,
        sol: R`$\E[xy]-\E[x]\E[y]=7-6=1$.` },
      { sec: '2.3', type: 'num', lv: 1, q: R`$x\sim\N(\mu=3,\sigma^2=4)$일 때 $\E[x^2]$은?`, ans: '13', ansTex: R`13`,
        sol: R`$\mu^2+\sigma^2=9+4=13$.` },
      { sec: '2.3', type: 'num', lv: 1, q: R`$\N(x\mid0,1)$의 $x=0$에서의 밀도값은? (소수 넷째 자리)`, ans: '1/sqrt(2*pi)', ansTex: R`\tfrac1{\sqrt{2\pi}}\approx0.3989`,
        sol: R`$(2\pi)^{-1/2}\approx0.3989$.` },
      { sec: '2.3', type: 'num', lv: 2, q: R`자료 $(2,4,6,8)$에 가우시안을 MLE로 맞출 때 $\sigma^2_{\text{ML}}$은?`, ans: '5', ansTex: R`5`,
        sol: R`$\bar x=5$, 편차제곱 $9+1+1+9=20$, $20/4=5$.` },
      { sec: '2.3b', type: 'num', lv: 2, q: R`같은 자료의 불편 분산 추정량 $\tilde\sigma^2$은?`, ans: '20/3', ansTex: R`\tfrac{20}{3}\approx6.667`,
        sol: R`$\frac{N}{N-1}\sigma^2_{\text{ML}}=\frac43\times5=\frac{20}3$.` },
      { sec: '2.3b', type: 'num', lv: 2, q: R`참 분산이 $\sigma^2=9$일 때 $N=3$개 표본의 $\sigma^2_{\text{ML}}$의 기댓값은?`, ans: '6', ansTex: R`6`,
        sol: R`$\frac{N-1}N\sigma^2=\frac23\times9=6$.` },
      { sec: '2.3b', type: 'mc', lv: 2, q: R`$\sigma^2_{\text{ML}}$이 아래로 편향되는 이유는?`,
        choices: [R`로그를 씌워서`, R`편차를 참 평균 대신 자료에서 추정한 평균 $\mu_{\text{ML}}$ 기준으로 재서`, R`자료가 가우시안이 아니라서`, R`$N$이 커서`], ans: 1,
        sol: R`$\sum(x_n-c)^2$은 $c=\bar x$에서 최소이므로 참 평균 기준보다 항상 작거나 같습니다.` },
      { sec: '2.3c', type: 'mc', lv: 2, q: R`$p(t\mid x,\mathbf w,\sigma^2)=\N(t\mid y(x,\mathbf w),\sigma^2)$에서 $\mathbf w$의 MLE와 같은 것은?`,
        choices: [R`절댓값 오차합 최소화`, R`제곱오차합 최소화`, R`$\sigma^2$ 최대화`, R`최대 오차 최소화`], ans: 1,
        sol: R`로그가능도에서 $\mathbf w$가 들어간 항은 $-\frac1{2\sigma^2}\sum(y-t)^2$뿐입니다.` },
      { sec: '2.3c', type: 'num', lv: 2, q: R`회귀 잔차가 $(0.5,-1,0.5,0)$일 때 잡음 분산의 MLE $\sigma^2_{\text{ML}}$은?`, ans: '0.375', ansTex: R`0.375`,
        sol: R`$\frac14(0.25+1+0.25+0)=0.375$.` },
      { sec: '2.3', type: 'open', lv: 2, q: R`i.i.d. 가우시안 자료의 로그가능도를 쓰고, 이를 최대화하는 $\mu_{\text{ML}}$과 $\sigma^2_{\text{ML}}$을 유도하세요.`,
        sol: R`
$\ln p=-\frac1{2\sigma^2}\sum(x_n-\mu)^2-\frac N2\ln\sigma^2-\frac N2\ln2\pi$.
$\partial/\partial\mu=\frac1{\sigma^2}\sum(x_n-\mu)=0\Rightarrow\mu_{\text{ML}}=\frac1N\sum x_n$.
$v=\sigma^2$: $\partial/\partial v=\frac1{2v^2}\sum(x_n-\mu_{\text{ML}})^2-\frac N{2v}=0\Rightarrow v=\frac1N\sum(x_n-\mu_{\text{ML}})^2$. (두 방정식을 동시에 풀되 $\mu$ 방정식이 $\sigma$와 무관하므로 순서대로 풀 수 있습니다.)` },
      { sec: '2.3b', type: 'open', lv: 3, q: R`$x_1,\dots,x_N$이 i.i.d. $\N(\mu,\sigma^2)$일 때 $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$임을 증명하세요.`,
        sol: R`
$\sum(x_n-\bar x)^2=\sum x_n^2-N\bar x^2$. $\E[x_n^2]=\mu^2+\sigma^2$, $\E[\bar x^2]=\Var[\bar x]+(\E\bar x)^2=\frac{\sigma^2}N+\mu^2$ (독립이라 $\Var\bar x=\sigma^2/N$).
$\E\sum(x_n-\bar x)^2=N(\mu^2+\sigma^2)-N(\frac{\sigma^2}N+\mu^2)=(N-1)\sigma^2$. $N$으로 나누면 $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$.` },
    ],
  });
})();
