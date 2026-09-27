/* 02 확률, 가능도, 베이즈 추론 — 1주차 수요일 s.14–34, 2주차 월요일 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 2, part: 'A', title: '확률, 가능도, 베이즈 추론', en: 'Probability, Likelihood, Bayesian Inference', ref: 'W1 수 · s.14–34, W2 월 필기', plot: 'beta',
    fig: R`앞면 확률 0.7인 동전을 던질수록 좁아지는 베타 사후분포`,
    tagline: R`가능도를 최대로 하면 MLE, 사전분포를 곱해 최대로 하면 MAP. 로그를 씌우면 MAP은 “자료 적합 + 규제”가 됩니다.`,
    summary: R`확률의 공리에서 조건부 확률·전확률 법칙·베이즈 정리를 끌어내고, 확률변수와 분포를 정리합니다. 가능도 $L(\theta;x)=p(x\mid\theta)$를 최대로 하는 **MLE**, 사전분포를 곱해 사후분포를 구하는 **베이즈 추론**, 사후분포의 최빈값인 **MAP**을 차례로 다룹니다. 수업 필기에서 베르누이 MLE $\hat\theta=\frac1n\sum x_i$, 균등 사전분포의 사후분포 $\operatorname{Beta}(S+1,n-S+1)$, MAP에서 가우시안 사전분포가 $L_2$ 규제가 되는 과정을 유도했고, 기침-감기, 동전, 아마존 판매자 예제를 풀었습니다.`,
    goals: [
      R`확률의 공리에서 여사건·포함배제·단조성 등 기본 성질을 증명할 수 있다`,
      R`전확률 법칙과 베이즈 정리로 사후확률을 계산하고 사전·가능도·증거를 구분할 수 있다`,
      R`i.i.d. 가능도를 세우고 로그를 씌워 베르누이 MLE를 유도할 수 있다`,
      R`균등(베타) 사전분포에서 사후분포가 베타분포임을 정규화 상수까지 보일 수 있다`,
      R`MAP과 MLE의 차이를 설명하고, 가우시안 사전분포가 $L_2$ 규제가 됨을 보일 수 있다`,
    ],
    secTitles: { '2.1': '확률의 공리', '2.2': '조건부·베이즈', '2.3': '확률변수', '2.4': 'MLE', '2.5': '베이즈 추론', '2.6': 'MAP', '2.7': '아마존 예제' },
    sections: [
      { k: '2.1', src: 'W1 수 · 슬라이드 14–15', title: '확률의 공리와 기본 성질', body: R`
표본공간 $\Omega$의 사건 $E$에 수 $P(E)$를 주는 규칙이 다음 세 공리를 만족하면 확률입니다.

:::def 확률의 공리
1. $0\le P(E)\le1$
2. $P(\Omega)=1$
3. 서로소인 사건열 $E_1,E_2,\dots$ ($E_i\cap E_j=\varnothing$, $i\ne j$)에 대해 $P\big(\bigcup_iE_i\big)=\sum_iP(E_i)$
:::

공리만으로 다음 성질들이 모두 나옵니다.

:::key 확률의 기본 성질
$$P(\varnothing)=0,\qquad P(E^c)=1-P(E),\qquad E\subset F\Rightarrow P(E)\le P(F)$$
$$P(E\cup F)=P(E)+P(F)-P(E\cap F)$$
증가하는 사건열 $E_1\subset E_2\subset\cdots$이면 $P\big(\bigcup_nE_n\big)=\lim_nP(E_n)$, 감소하는 사건열이면 $P\big(\bigcap_nE_n\big)=\lim_nP(E_n)$ (확률의 연속성).
:::

:::tip 서로소로 쪼개기
거의 모든 증명은 “사건을 서로소인 조각으로 쪼갠 뒤 공리 3을 쓴다”입니다. 예를 들어 $E\cup F=E\cup(F\setminus E)$, $F=(E\cap F)\cup(F\setminus E)$.
:::
` },
      { k: '2.2', src: 'W1 수 · 슬라이드 16, W2 월 필기', title: '조건부 확률, 전확률 법칙, 베이즈 정리', body: R`
$P(E)>0$일 때 **조건부 확률**은 $P(F\mid E)=\dfrac{P(E\cap F)}{P(E)}$입니다. $E_1,\dots,E_N$($N$은 무한도 가능)이 $\Omega$의 분할(서로소이고 합집합이 $\Omega$)이면

:::key 베이즈 정리
$$P(F)=\sum_{i}P(E_i)P(F\mid E_i)\qquad(\text{전확률 법칙})$$
$$P(E_i\mid F)=\frac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$$
:::

수업 필기의 해석: $F$가 **관측되었다고 할 때** $E_i$의 확률을 새로 고치는 공식입니다. $P(F\mid E_i)$는 **가능도**, $P(E_i)$는 **사전확률**, 분모 $P(F)$는 **증거**(evidence), 좌변이 **사후확률**입니다.

**독립.** $P(E\cap F)=P(E)P(F)$이면 독립이고, 이때 $P(F\mid E)=P(F)$입니다. 동전 두 개를 던져 $E$=첫째가 앞면, $F$=둘째가 앞면이면 $P(E\cap F)=\tfrac14=P(E)P(F)$, $P(F\mid E)=\tfrac12$.

:::ex 예제 1 — 기침과 감기 (수업 필기)
$Y=1$은 병(감기)에 걸림, $X=1$은 기침. 사전확률 $P(Y=1)=0.1$, 가능도 $P(X=1\mid Y=1)=0.8$, $P(X=1\mid Y=0)=0.2$. 기침을 할 때 병에 걸렸을 확률 $P(Y=1\mid X=1)$은?
---
전확률: $P(X=1)=0.8\times0.1+0.2\times0.9=0.08+0.18=0.26$.
베이즈: $P(Y=1\mid X=1)=\dfrac{0.08}{0.26}\approx0.3077$.
“감기면 기침할 확률”은 0.8이지만 “기침하면 감기일 확률”은 약 31%입니다. 사전확률 0.1이 작기 때문입니다.
:::

:::warn 조건의 방향
$P(X=1\mid Y=1)$과 $P(Y=1\mid X=1)$은 전혀 다른 양입니다. 시험에서 “무엇이 주어졌을 때”인지 먼저 표시하고 계산하세요. 의료 인공지능 과목의 암 검사 예제도 같은 구조입니다[[@med:ch03:2.1b|유병률 1%, 민감도 90%, 위양성률 3%에서 양성일 때 암일 확률은 약 23%.]].
:::
` },
      { k: '2.3', src: 'W1 수 · 슬라이드 17–21', title: '확률변수와 분포', body: R`
**확률변수**는 함수 $X:\Omega\to\mathbb R$입니다. 동전을 3번 던져 앞면의 개수를 세면 $\omega=(H,H,T)$일 때 $X(\omega)=2$입니다.

- 누적분포함수(CDF) $F(x)=P(X\le x)$, 꼬리함수 $G(x)=1-F(x)=P(X>x)$
- **이산** 확률변수: 확률질량함수 $p(x_i)=P(X=x_i)$, $F(x)=\sum_{x_i\le x}p(x_i)$
- **연속** 확률변수: 확률밀도함수 $f$가 있어 $P(X\le x)=\int_{-\infty}^xf(t)\,dt$
- **모수**(parameter): 분포를 결정하는 값. 베르누이 분포의 $p$, 정규분포의 $\mu,\sigma^2$

:::note 표기
$p(x\mid\theta)$처럼 세로줄 뒤에 모수를 쓰면 “모수가 $\theta$일 때 $x$의 분포”라는 뜻입니다. 베이즈 관점에서는 $\theta$도 확률변수로 봅니다.
:::
` },
      { k: '2.4', src: 'W1 수 · 슬라이드 22–24, W2 월 필기', title: '가능도와 최대가능도 추정', body: R`
**가능도**는 같은 식 $p(x\mid\theta)$를 **보는 방향**을 바꾼 것입니다(수업 필기).

- $p(x\mid\theta)$: $\theta$를 고정하고 $x$의 함수로 봄 → 확률(밀도)
- $L(\theta;x)=p(x\mid\theta)$: 관측값 $x$를 고정하고 $\theta$의 함수로 봄 → 가능도

예: $P(X=1\mid\theta)=\theta$. 공정한 동전이면 $\theta=\tfrac12$을 넣어 확률 $\tfrac12$을 얻고, $x=1$을 관측했다면 $L(\theta;x=1)=\theta$라는 $\theta$의 함수가 됩니다.

$X_1,\dots,X_n$이 i.i.d.이면 $L(\theta)=\prod_{i=1}^np(x_i\mid\theta)$이고, 이를 최대로 하는 $\hat\theta$가 **최대가능도 추정량**(MLE)입니다. 곱을 합으로 바꾸기 위해 $\log L$을 최대로 합니다($\log$는 증가함수라 최대점이 같습니다).

:::key 베르누이 MLE
$x_i\in\{0,1\}$, $P(X_i=1)=\theta$, $S=\sum_ix_i$이면
$$L(\theta)=\theta^{S}(1-\theta)^{n-S},\qquad \ell(\theta)=S\log\theta+(n-S)\log(1-\theta)$$
$$\ell'(\theta)=\frac{S}{\theta}-\frac{n-S}{1-\theta}=0\ \Rightarrow\ \hat\theta_{\text{MLE}}=\frac Sn=\frac1n\sum_{i=1}^nx_i$$
:::

필기에서는 $\ell'=0$에서 $S(1-\theta)=(n-S)\theta$, 즉 $S=n\theta$를 얻었습니다. $\ell''(\theta)=-S/\theta^2-(n-S)/(1-\theta)^2<0$이라 이 점이 최대점입니다.

:::warn 극단적인 자료
동전을 세 번 던져 모두 앞면이면 $\hat\theta_{\text{MLE}}=1$, 즉 “앞으로도 항상 앞면”이라는 과신이 생깁니다. 사전분포를 넣는 베이즈 추론·MAP이 이 문제를 완화합니다.
:::
` },
      { k: '2.5', src: 'W1 수 · 슬라이드 25–28, W2 월 필기', title: '베이즈 추론: 사전분포에서 사후분포로', body: R`
베이즈 관점에서는 모수 $\theta$도 확률변수이고, 자료를 보기 전의 믿음을 **사전분포** $p(\theta)$로 둡니다.
$$p(\theta\mid x)=\frac{p(x,\theta)}{p(x)}=\frac{p(x\mid\theta)\,p(\theta)}{p(x)}=\frac{p(x\mid\theta)\,p(\theta)}{\int p(x\mid\theta)p(\theta)\,d\theta}$$
사후분포 $\propto$ 가능도 $\times$ 사전분포이고, 분모 $p(x)$(증거)는 $\theta$와 무관한 정규화 상수입니다.

:::def 베타분포와 베타함수
$$\operatorname{Beta}(\theta\mid a,b)=\frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)}\theta^{a-1}(1-\theta)^{b-1},\qquad B(a,b)=\int_0^1t^{a-1}(1-t)^{b-1}dt=\frac{\Gamma(a)\Gamma(b)}{\Gamma(a+b)}$$
$\operatorname{Beta}(1,1)$은 $[0,1]$ 위의 균등분포입니다. 평균은 $\frac{a}{a+b}$, 최빈값은 $\frac{a-1}{a+b-2}$ ($a,b>1$).
:::

:::key 베타 사후분포
베르누이 자료($S$번 성공, $n-S$번 실패)와 균등 사전분포 $p(\theta)=1$ ($0\le\theta\le1$)이면
$$p(\theta\mid D)=\frac{\Gamma(n+2)}{\Gamma(S+1)\Gamma(n-S+1)}\theta^{S}(1-\theta)^{n-S}=\operatorname{Beta}(\theta\mid S+1,\,n-S+1)$$
사전분포가 $\operatorname{Beta}(a,b)$이면 사후분포는 $\operatorname{Beta}(a+S,\ b+n-S)$.
:::

:::hand 수업 필기 — 정규화 상수 구하기
$p(\theta\mid D)\propto\theta^S(1-\theta)^{n-S}=:q(\theta)$. 정규화 상수 $Z=\int_0^1\theta^S(1-\theta)^{n-S}d\theta$는 베타함수에서 $a-1=S$, $b-1=n-S$로 둔 것이므로
$$Z=B(S+1,n-S+1)=\frac{\Gamma(S+1)\Gamma(n-S+1)}{\Gamma(n+2)}.$$
따라서 $p(\theta\mid D)=q(\theta)/Z$가 위의 베타분포입니다. 사전분포와 사후분포가 같은 꼴(베타)이므로 베타분포는 베르누이 가능도의 **켤레 사전분포**입니다.
:::
` },
      { k: '2.6', src: 'W1 수 · 슬라이드 29–31, W2 월 필기', title: 'MAP 추정: 가능도 + 사전분포', body: R`
사후분포 전체 대신 그 최빈값 하나를 추정값으로 쓰는 것이 **MAP**(maximum a posteriori)입니다. $p(x)$는 $\theta$와 무관하고 $\log$는 증가함수이므로(필기: $2x+5$처럼 증가함수를 씌우거나 상수를 더해도 최대점은 그대로)

:::key MAP 추정
$$\hat\theta_{\text{MAP}}=\argmax_\theta\log p(\theta\mid x)=\argmax_\theta\big[\log p(x\mid\theta)+\log p(\theta)\big]=\argmin_\theta\big[\underbrace{-\log p(x\mid\theta)}_{\text{자료 적합 손실}}\ \underbrace{-\log p(\theta)}_{\text{규제}}\big]$$
$\theta\sim\N(0,\tau^2I)$이면 $-\log p(\theta)=\dfrac{1}{2\tau^2}\lVert\theta\rVert_2^2+\text{상수}$ → $L_2$ 규제(릿지).
:::

MLE는 $\argmax\log p(x\mid\theta)$로 사전분포를 쓰지 않습니다. MAP은 사전분포를 쓸 수 있고, 그 사전분포가 곧 규제항이 됩니다[[ch04:4.3|릿지 회귀 $\tfrac12f(\beta)+\tfrac\lambda2\lVert\beta\rVert^2$는 가우시안 오차 + 가우시안 사전분포의 MAP입니다.]].

:::ex 예제 2 — 동전 10번, 앞면 7번 (수업 필기)
(1) MLE (2) 사전분포 $\operatorname{Beta}(2,2)$(“공정한 동전일 것 같다”)로 MAP을 구하세요.
---
(1) $P(D\mid\theta)=\theta^7(1-\theta)^3$, $\hat\theta_{\text{MLE}}=7/10=0.7$.
(2) $P(\theta\mid D)\propto\theta^7(1-\theta)^3\cdot\theta^{2-1}(1-\theta)^{2-1}=\theta^8(1-\theta)^4$ → $\operatorname{Beta}(9,5)$. 최빈값 $\frac{9-1}{9+5-2}=\frac8{12}\approx0.667$.
사전분포가 추정값을 $0.5$ 쪽으로 당깁니다.
:::

:::tip 베타-베르누이 MAP 공식
사전분포 $\operatorname{Beta}(a,b)$, $n$번 중 $S$번 성공이면 $\hat\theta_{\text{MAP}}=\dfrac{S+a-1}{n+a+b-2}$. $a=b=1$(균등)이면 MLE와 같아집니다.
:::
` },
      { k: '2.7', src: 'W1 수 · 슬라이드 32–34, W2 월 필기', title: '예제: 어느 판매자에게 살까', body: R`
K. P. Murphy의 예제입니다. 같은 가격의 물건을 두 판매자가 팝니다. 판매자 1은 긍정 90·부정 10, 판매자 2는 긍정 2·부정 0 리뷰를 받았습니다.

- **MLE로 보면** $\hat\theta_1=0.9$, $\hat\theta_2=1.0$ → 판매자 2가 낫다는 결론. 리뷰 두 개로 “완벽”하다고 믿는 과신입니다.
- **베이즈로 보면**(필기) 신뢰도 $\theta_1,\theta_2$에 균등 사전분포 $\operatorname{Beta}(1,1)$을 두어
$$p(\theta_1\mid D_1)=\operatorname{Beta}(91,11),\qquad p(\theta_2\mid D_2)=\operatorname{Beta}(3,1).$$
두 사후분포는 독립이므로
$$P(\theta_1>\theta_2\mid D_1,D_2)=\iint\mathbb 1\{\theta_1>\theta_2\}\operatorname{Beta}(\theta_1\mid91,11)\operatorname{Beta}(\theta_2\mid3,1)\,d\theta_1d\theta_2\approx0.71.$$
(수치적분으로 계산하면 $0.713$.) 따라서 **판매자 1**에게 사는 것이 낫습니다. 사후평균도 $91/102\approx0.89$ 대 $3/4=0.75$입니다.

:::idea 핵심
자료가 적을수록 사후분포가 넓습니다. $\operatorname{Beta}(3,1)$은 $\theta_2$가 1 근처일 수도, 0.5 근처일 수도 있다는 불확실성을 그대로 담고 있고, 베이즈 추론은 그 불확실성까지 비교합니다.
:::
` },
    ],
    problems: [
      { sec: '2.1', type: 'mc', lv: 1, q: R`확률의 공리만으로 $P(E\cup F)=P(E)+P(F)-P(E\cap F)$를 보일 때 가장 먼저 쓰는 분해는?`,
        choices: [R`$E\cup F=E\cup(F\setminus E)$, $F=(E\cap F)\cup(F\setminus E)$ (서로소 분해)`, R`$E\cup F=E\cap F$`, R`$P(E\cup F)=P(E)P(F)$`, R`$E\cup F=(E^c\cap F^c)^c$만 사용`], ans: 0,
        sol: R`두 식 모두 서로소 분해이므로 공리 3에서 $P(E\cup F)=P(E)+P(F\setminus E)$, $P(F)=P(E\cap F)+P(F\setminus E)$. 빼면 결과가 나옵니다.` },
      { sec: '2.1', type: 'num', lv: 1, q: R`$P(E)=0.5$, $P(F)=0.4$, $P(E\cap F)=0.1$일 때 $P(E^c\cap F^c)$는?`, ans: '0.2', ansTex: R`0.2`,
        sol: R`$P(E\cup F)=0.5+0.4-0.1=0.8$. 드모르간으로 $E^c\cap F^c=(E\cup F)^c$이므로 $1-0.8=0.2$.` },
      { sec: '2.2', type: 'num', lv: 1, q: R`기침-감기 예제에서 $P(Y=1)=0.1$, $P(X=1\mid Y=1)=0.8$, $P(X=1\mid Y=0)=0.2$일 때 $P(X=1)$은?`, ans: '0.26', ansTex: R`0.26`,
        sol: R`전확률: $0.8(0.1)+0.2(0.9)=0.26$.` },
      { sec: '2.2', type: 'num', lv: 2, q: R`같은 예제에서 기침을 **하지 않을 때** 병에 걸렸을 확률 $P(Y=1\mid X=0)$은? (소수 넷째 자리까지)`, ans: '0.02/0.74', ansTex: R`\tfrac{0.02}{0.74}\approx0.0270`,
        sol: R`$P(X=0\mid Y=1)=0.2$, $P(X=0)=1-0.26=0.74$. $P(Y=1\mid X=0)=\dfrac{0.2\times0.1}{0.74}=\dfrac{0.02}{0.74}\approx0.027$.` },
      { sec: '2.2', type: 'mc', lv: 1, q: R`베이즈 정리 $P(E_i\mid F)=\dfrac{P(F\mid E_i)P(E_i)}{P(F)}$에서 **증거**(evidence)에 해당하는 것은?`,
        choices: [R`$P(F\mid E_i)$`, R`$P(E_i)$`, R`$P(F)$`, R`$P(E_i\mid F)$`], ans: 2,
        sol: R`$P(F\mid E_i)$ 가능도, $P(E_i)$ 사전확률, $P(F)=\sum_jP(F\mid E_j)P(E_j)$ 증거(정규화 상수), $P(E_i\mid F)$ 사후확률.` },
      { sec: '2.4', type: 'num', lv: 1, q: R`베르누이 자료 $1,0,1,1,0,1,1,1$의 MLE $\hat\theta$는?`, ans: '6/8', ansTex: R`0.75`,
        sol: R`$S=6$, $n=8$, $\hat\theta=S/n=0.75$.` },
      { sec: '2.4', type: 'mc', lv: 2, q: R`$X_1,\dots,X_n\overset{iid}{\sim}\operatorname{Poisson}(\lambda)$, $p(x\mid\lambda)=e^{-\lambda}\lambda^x/x!$의 MLE는?`,
        choices: [R`$\bar x$`, R`$\bar x^2$`, R`$1/\bar x$`, R`$\max_ix_i$`], ans: 0,
        sol: R`$\ell(\lambda)=-n\lambda+(\sum x_i)\log\lambda-\sum\log x_i!$, $\ell'=-n+\sum x_i/\lambda=0$에서 $\hat\lambda=\bar x$. $\ell''=-\sum x_i/\lambda^2<0$.` },
      { sec: '2.4', type: 'mc', lv: 2, q: R`가능도 대신 로그가능도를 최대로 해도 되는 가장 정확한 이유는?`,
        choices: [R`로그가능도가 항상 볼록이라서`, R`$\log$가 순증가함수라 최대점의 위치가 같아서`, R`가능도는 음수가 될 수 있어서`, R`로그를 씌우면 모수가 바뀌어서`], ans: 1,
        sol: R`$\log$는 순증가이므로 $L(\theta_1)<L(\theta_2)\iff\log L(\theta_1)<\log L(\theta_2)$. 덤으로 곱이 합이 되어 미분이 쉽고, 아주 작은 수의 곱에서 생기는 언더플로도 막습니다.` },
      { sec: '2.5', type: 'mc', lv: 2, q: R`균등 사전분포에서 베르누이 자료 $n=10$, $S=7$일 때 사후분포는?`,
        choices: [R`$\operatorname{Beta}(7,3)$`, R`$\operatorname{Beta}(8,4)$`, R`$\operatorname{Beta}(9,5)$`, R`$\operatorname{Beta}(7,10)$`], ans: 1,
        sol: R`$\operatorname{Beta}(S+1,n-S+1)=\operatorname{Beta}(8,4)$. $\operatorname{Beta}(9,5)$는 사전분포가 $\operatorname{Beta}(2,2)$일 때입니다.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`$\int_0^1\theta^3(1-\theta)^2\,d\theta$의 값은?`, ans: '1/60', ansTex: R`\tfrac1{60}`,
        sol: R`$B(4,3)=\dfrac{\Gamma(4)\Gamma(3)}{\Gamma(7)}=\dfrac{3!\,2!}{6!}=\dfrac{12}{720}=\dfrac1{60}$.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`균등 사전분포, 앞면 $S=3$, 뒷면 $1$일 때 사후평균 $E[\theta\mid D]$는?`, ans: '4/6', ansTex: R`\tfrac23`,
        sol: R`사후분포 $\operatorname{Beta}(4,2)$, 평균 $\frac{4}{4+2}=\frac23$. (라플라스의 계승 규칙 $\frac{S+1}{n+2}$.)` },
      { sec: '2.6', type: 'num', lv: 2, q: R`사전분포 $\operatorname{Beta}(3,3)$에서 동전 10번 중 앞면 8번일 때 $\hat\theta_{\text{MAP}}$는?`, ans: '10/14', ansTex: R`\tfrac57\approx0.714`,
        sol: R`사후분포 $\operatorname{Beta}(3+8,3+2)=\operatorname{Beta}(11,5)$. 최빈값 $\frac{11-1}{11+5-2}=\frac{10}{14}=\frac57$. MLE $0.8$보다 0.5 쪽입니다.` },
      { sec: '2.6', type: 'mc', lv: 2, q: R`MAP 추정에서 사전분포 $\theta\sim\N(0,\tau^2I)$가 만드는 규제항은?`,
        choices: [R`$\lVert\theta\rVert_1/\tau$`, R`$\lVert\theta\rVert_2^2/(2\tau^2)$`, R`$\tau^2\lVert\theta\rVert_2^2$`, R`규제항이 생기지 않는다`], ans: 1,
        sol: R`$-\log p(\theta)=\frac{1}{2\tau^2}\lVert\theta\rVert_2^2+\frac d2\log(2\pi\tau^2)$. 상수는 최적화에 영향이 없습니다. 사전분포가 좁을수록($\tau$ 작을수록) 규제가 셉니다. (라플라스 사전분포를 쓰면 $L_1$이 됩니다.)` },
      { sec: '2.7', type: 'mc', lv: 2, q: R`아마존 예제에서 균등 사전분포를 쓰면 판매자 2(긍정 2, 부정 0)의 사후분포는?`,
        choices: [R`$\operatorname{Beta}(2,0)$`, R`$\operatorname{Beta}(3,1)$`, R`$\operatorname{Beta}(2,1)$`, R`$\operatorname{Beta}(1,3)$`], ans: 1,
        sol: R`$\operatorname{Beta}(S+1,n-S+1)=\operatorname{Beta}(3,1)$, 밀도 $3\theta^2$. 판매자 1은 $\operatorname{Beta}(91,11)$.` },
      { sec: '2.7', type: 'num', lv: 3, q: R`$\theta_2\sim\operatorname{Beta}(3,1)$(밀도 $3t^2$)이고 $\theta_1$이 확률 1로 $0.9$라고 가정하면 $P(\theta_1>\theta_2)$는?`, ans: '0.729', ansTex: R`0.9^3=0.729`,
        sol: R`$P(\theta_2<0.9)=\int_0^{0.9}3t^2dt=0.9^3=0.729$. 실제로는 $\theta_1$도 분포를 가져 약 $0.71$이 됩니다.` },
      { sec: '2.4', type: 'open', lv: 2, proof: true, q: R`i.i.d. 베르누이 자료 $x_1,\dots,x_n$에서 MLE가 $\hat\theta=\frac1n\sum x_i$임을 유도하세요. 최대임을 확인하는 단계와 $S=0$ 또는 $S=n$인 경우도 설명하세요.`,
        sol: R`
$p(x_i\mid\theta)=\theta^{x_i}(1-\theta)^{1-x_i}$이므로 $L(\theta)=\prod_i\theta^{x_i}(1-\theta)^{1-x_i}=\theta^S(1-\theta)^{n-S}$, $S=\sum x_i$.
$0<\theta<1$에서 $\ell(\theta)=S\log\theta+(n-S)\log(1-\theta)$, $\ell'(\theta)=\frac S\theta-\frac{n-S}{1-\theta}$.
$\ell'=0\iff S(1-\theta)=(n-S)\theta\iff S=n\theta$, 즉 $\hat\theta=S/n$.
$\ell''(\theta)=-\frac S{\theta^2}-\frac{n-S}{(1-\theta)^2}<0$ ($0<S<n$)이므로 오목, 유일한 최대점입니다.
$S=0$이면 $L=(1-\theta)^n$이 $[0,1]$에서 감소해 $\hat\theta=0$, $S=n$이면 $L=\theta^n$이 증가해 $\hat\theta=1$. 모두 $S/n$과 같습니다.`,
        rubric: R`
- 가능도의 곱 꼴과 $\theta^S(1-\theta)^{n-S}$ — 3점
- 로그가능도와 도함수, 정류점 $S/n$ — 4점
- 이계도함수로 최대 확인 — 2점
- 경계 경우 — 1점` },
      { sec: '2.6', type: 'open', lv: 2, proof: true, q: R`MAP 추정량이 $\argmin_\theta\big[-\log p(x\mid\theta)-\log p(\theta)\big]$임을 보이고, 선형회귀 $y=X\beta+\varepsilon$, $\varepsilon\sim\N(0,\sigma^2I)$, $\beta\sim\N(0,\tau^2I)$일 때 MAP이 릿지 회귀가 됨을 보이세요.`,
        sol: R`
$p(\theta\mid x)=p(x\mid\theta)p(\theta)/p(x)$이고 $p(x)$는 $\theta$와 무관하므로 $\argmax_\theta p(\theta\mid x)=\argmax_\theta p(x\mid\theta)p(\theta)$. $\log$가 순증가라 $=\argmax[\log p(x\mid\theta)+\log p(\theta)]=\argmin[-\log p(x\mid\theta)-\log p(\theta)]$.

회귀에서 $-\log p(y\mid\beta)=\frac1{2\sigma^2}\lVert y-X\beta\rVert^2+c_1$, $-\log p(\beta)=\frac1{2\tau^2}\lVert\beta\rVert^2+c_2$. 따라서
$$\hat\beta_{\text{MAP}}=\argmin_\beta\frac1{2\sigma^2}\lVert y-X\beta\rVert^2+\frac1{2\tau^2}\lVert\beta\rVert^2=\argmin_\beta\tfrac12\lVert y-X\beta\rVert^2+\tfrac\lambda2\lVert\beta\rVert^2,\quad\lambda=\frac{\sigma^2}{\tau^2}.$$
(양변에 $\sigma^2$을 곱해도 최소점은 같습니다.) 이것이 릿지 회귀이고 해는 $(X^TX+\lambda I)^{-1}X^Ty$입니다.`,
        rubric: R`
- 증거 $p(x)$ 제거와 로그의 단조성 — 3점
- 두 음의 로그밀도 계산 — 4점
- $\lambda=\sigma^2/\tau^2$로 릿지 목적함수 도출 — 3점` },
    ],
  });
})();
