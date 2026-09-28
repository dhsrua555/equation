/* 개념 정리 — 02 확률, 가능도, 베이즈 추론 (1주차 수요일 슬라이드 14–34, 2주차 월요일 필기, Problem Set 1 문제 2).
   확률을 처음 배우는 사람도 읽을 수 있게 직관부터 쓰고, 증명은 공리에서 한 단계씩, 끝에 전공자용 보충을 붙였습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 2,
    summary: R`불확실성을 숫자로 다루는 언어인 확률을 공리부터 세우고, 자료에서 모수를 추정하는 두 관점을 비교합니다. **최대가능도(MLE)**는 “관측된 자료를 가장 그럴듯하게 만드는 모수”를 고르고, **베이즈 추론**은 모수에 대한 믿음(사전분포)을 자료로 고쳐 사후분포를 얻습니다. 사후분포의 꼭대기인 **MAP**은 “자료 적합 손실 + 규제”의 최소화와 같아서, 머신러닝의 규제가 확률에서 어디서 오는지 보여 줍니다. 수업에서는 기침-감기, 동전, 아마존 판매자 예제를 풀었습니다. 마지막 절은 Problem Set 1의 문제 2(가우시안 평균의 MAP = 릿지, 수축 계수, 편향-분산 분해)를 끝까지 다룹니다.`,
    goals: [
      R`확률의 공리에서 여사건·포함배제·단조성을 증명할 수 있다`,
      R`전확률 법칙과 베이즈 정리로 사후확률을 계산하고, 조건의 방향을 구별할 수 있다`,
      R`기댓값과 분산의 성질(선형성, 독립일 때 분산의 합, $\Var(\bar X)=\sigma^2/n$)을 쓸 수 있다`,
      R`베르누이·가우시안 자료의 MLE를 로그가능도로 유도할 수 있다`,
      R`베타 사전분포와 베르누이 가능도에서 사후분포·MAP·사후평균을 구할 수 있다`,
      R`MAP이 “음의 로그가능도 + 음의 로그사전분포”의 최소화임을 보이고, 가우시안 사전분포가 $L_2$ 규제가 됨을 설명할 수 있다`,
      R`MSE = 편향² + 분산을 증명하고, 수축 추정량의 편향·분산·MSE를 계산할 수 있다`,
    ],
    sections: [
      { k: '2.1', src: 'W1 수 · 슬라이드 14–15', title: '확률의 공리와 기본 성질', body: R`
:::idea 쉽게 말하면
확률은 “전체 중 얼마만큼”을 재는 **넓이** 같은 것입니다. 가능한 결과 전체(표본공간 $\Omega$)의 넓이를 1로 두고, 사건 $E$(결과들의 모임)의 넓이를 $P(E)$라 부릅니다. 넓이라면 당연히 성립할 세 가지 — 음수가 아니고, 전체는 1이고, 겹치지 않는 조각들의 넓이는 더해진다 — 를 **공리**로 삼고, 나머지는 전부 이 세 가지에서 증명합니다.
:::

표본공간 $\Omega$의 사건 $E$에 수 $P(E)$를 주는 규칙이 다음 세 공리를 만족하면 확률입니다.

:::def 확률의 공리
1. $0\le P(E)\le1$
2. $P(\Omega)=1$
3. 서로소인 사건열 $E_1,E_2,\dots$ ($E_i\cap E_j=\varnothing$, $i\ne j$)에 대해 $P\big(\bigcup_iE_i\big)=\sum_iP(E_i)$
:::

예: 주사위 하나를 던지면 $\Omega=\{1,\dots,6\}$, 각 눈의 확률 $\tfrac16$. 사건 “짝수” $E=\{2,4,6\}$은 서로소인 세 조각의 합이므로 공리 3에서 $P(E)=\tfrac36$.

공리만으로 다음 성질들이 모두 나옵니다.

:::key 확률의 기본 성질
$$P(\varnothing)=0,\qquad P(E^c)=1-P(E),\qquad E\subset F\Rightarrow P(E)\le P(F)$$
$$P(E\cup F)=P(E)+P(F)-P(E\cap F)$$
증가하는 사건열 $E_1\subset E_2\subset\cdots$이면 $P\big(\bigcup_nE_n\big)=\lim_nP(E_n)$, 감소하는 사건열이면 $P\big(\bigcap_nE_n\big)=\lim_nP(E_n)$ (확률의 연속성).
:::

### 공리에서 증명하기

- **여사건.** $E$와 $E^c$는 서로소이고 합집합이 $\Omega$이므로 공리 2, 3에서 $1=P(\Omega)=P(E)+P(E^c)$. 특히 $E=\Omega$로 두면 $P(\varnothing)=0$.
- **단조성.** $E\subset F$이면 $F=E\cup(F\setminus E)$ (서로소)이므로 $P(F)=P(E)+P(F\setminus E)\ge P(E)$ (공리 1).
- **포함배제.** $E\cup F=E\cup(F\setminus E)$ (서로소), $F=(E\cap F)\cup(F\setminus E)$ (서로소). 두 식에 공리 3을 쓰면 $P(E\cup F)=P(E)+P(F\setminus E)$, $P(F\setminus E)=P(F)-P(E\cap F)$. 대입하면 끝.
- **연속성.** 증가하는 사건열이면 “새로 추가된 부분” $D_1=E_1$, $D_n=E_n\setminus E_{n-1}$은 서로소이고 $\bigcup E_n=\bigcup D_n$, $E_n=D_1\cup\dots\cup D_n$. 공리 3에서 $P(\bigcup E_n)=\sum_{k=1}^\infty P(D_k)=\lim_n\sum_{k=1}^nP(D_k)=\lim_nP(E_n)$. 감소하는 경우는 여사건을 취하면 증가하는 경우가 됩니다.

:::tip 서로소로 쪼개기
거의 모든 증명은 “사건을 서로소인 조각으로 쪼갠 뒤 공리 3을 쓴다”입니다. 예를 들어 $E\cup F=E\cup(F\setminus E)$, $F=(E\cap F)\cup(F\setminus E)$.
:::

:::ex 예제 1 — 주사위 두 개
주사위 두 개를 던질 때 적어도 한 개가 6일 확률은?
---
여사건 “둘 다 6이 아님”의 확률이 $\tfrac56\cdot\tfrac56=\tfrac{25}{36}$이므로 $1-\tfrac{25}{36}=\tfrac{11}{36}\approx0.306$. 포함배제로도 $\tfrac16+\tfrac16-\tfrac1{36}=\tfrac{11}{36}$. 그냥 $\tfrac16+\tfrac16$로 더하면 “둘 다 6”을 두 번 센 것입니다.
:::

### 더 깊이: 왜 셀 수 있는 합까지 요구하나

공리 3을 유한개가 아니라 **가산 무한개**의 합까지 요구하는 것이 극한(연속성)을 가능하게 합니다. 연속 확률변수의 $P(X\le x)=\lim P(X\le x+1/n)$ 같은 계산이 모두 이것에 기댑니다. 또 모든 부분집합에 확률을 줄 수는 없어서(실수 구간에서는 역설이 생김), 엄밀한 이론에서는 사건들의 모임을 $\sigma$-대수로 제한합니다. 이 과목에서는 “생각할 수 있는 사건에는 모두 확률이 있다”고 봐도 충분합니다.
` },
      { k: '2.2', src: 'W1 수 · 슬라이드 16, W2 월 필기', title: '조건부 확률, 전확률 법칙, 베이즈 정리', body: R`
:::idea 쉽게 말하면
**조건부 확률** $P(F\mid E)$는 “$E$가 일어났다는 것을 알게 된 뒤의 $F$의 확률”입니다. $E$를 안 순간 세계가 $E$로 좁아지므로, $E$ 안에서 $F$가 차지하는 비율을 다시 재면 됩니다: $P(E\cap F)/P(E)$.
**베이즈 정리**는 조건의 방향을 뒤집는 공식입니다. 의사가 아는 것은 “감기면 기침할 확률”인데 환자에게 필요한 것은 “기침하는데 감기일 확률”입니다.
:::

$P(E)>0$일 때 **조건부 확률**은 $P(F\mid E)=\dfrac{P(E\cap F)}{P(E)}$입니다. 양변에 $P(E)$를 곱하면 **곱셈 규칙** $P(E\cap F)=P(E)P(F\mid E)$가 됩니다. $E_1,\dots,E_N$($N$은 무한도 가능)이 $\Omega$의 분할(서로소이고 합집합이 $\Omega$)이면

:::key 베이즈 정리
$$P(F)=\sum_{i}P(E_i)P(F\mid E_i)\qquad(\text{전확률 법칙})$$
$$P(E_i\mid F)=\frac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$$
:::

**증명.** $F=\bigcup_i(F\cap E_i)$이고 조각들이 서로소이므로 공리 3과 곱셈 규칙에서 $P(F)=\sum_iP(F\cap E_i)=\sum_iP(E_i)P(F\mid E_i)$. 정의에서 $P(E_i\mid F)=P(E_i\cap F)/P(F)=P(F\mid E_i)P(E_i)/P(F)$이고 분모에 전확률 법칙을 넣으면 됩니다.

수업 필기의 해석: $F$가 **관측되었다고 할 때** $E_i$의 확률을 새로 고치는 공식입니다. $P(F\mid E_i)$는 **가능도**, $P(E_i)$는 **사전확률**, 분모 $P(F)$는 **증거**(evidence), 좌변이 **사후확률**입니다.

**독립.** $P(E\cap F)=P(E)P(F)$이면 독립이고, 이때 $P(F\mid E)=P(F)$입니다. 동전 두 개를 던져 $E$=첫째가 앞면, $F$=둘째가 앞면이면 $P(E\cap F)=\tfrac14=P(E)P(F)$, $P(F\mid E)=\tfrac12$.

:::warn 독립과 서로소는 다르다
서로소($E\cap F=\varnothing$)인 두 사건은 확률이 양수이면 **절대 독립이 아닙니다**. $E$가 일어나면 $F$는 절대 일어나지 않는다는 강한 정보를 주기 때문입니다: $P(F\mid E)=0\ne P(F)$.
:::

:::ex 예제 2 — 기침과 감기 (수업 필기)
$Y=1$은 병(감기)에 걸림, $X=1$은 기침. 사전확률 $P(Y=1)=0.1$, 가능도 $P(X=1\mid Y=1)=0.8$, $P(X=1\mid Y=0)=0.2$. 기침을 할 때 병에 걸렸을 확률 $P(Y=1\mid X=1)$은?
---
전확률: $P(X=1)=0.8\times0.1+0.2\times0.9=0.08+0.18=0.26$.
베이즈: $P(Y=1\mid X=1)=\dfrac{0.08}{0.26}\approx0.3077$.
“감기면 기침할 확률”은 0.8이지만 “기침하면 감기일 확률”은 약 31%입니다. 사전확률 0.1이 작기 때문입니다.
:::

**사람 수로 세어 보기.** 1000명이 있다고 하면 감기 환자 100명 중 80명이 기침, 건강한 900명 중 180명이 기침합니다. 기침하는 260명 중 감기는 80명, 즉 $80/260\approx31\%$. 베이즈 정리는 이 표를 식으로 쓴 것입니다.

| | 기침 $X=1$ | 기침 안 함 $X=0$ | 합 |
|---|---|---|---|
| 감기 $Y=1$ | 80 | 20 | 100 |
| 건강 $Y=0$ | 180 | 720 | 900 |
| 합 | 260 | 740 | 1000 |

같은 표에서 기침을 **안 할 때** 감기일 확률은 $20/740\approx0.027$로, 사전확률 0.1보다 작아집니다.

:::warn 조건의 방향
$P(X=1\mid Y=1)$과 $P(Y=1\mid X=1)$은 전혀 다른 양입니다. 시험에서 “무엇이 주어졌을 때”인지 먼저 표시하고 계산하세요. 의료 인공지능 과목의 암 검사 예제도 같은 구조입니다[[@med:ch03:2.1b|유병률 1%, 민감도 90%, 위양성률 3%에서 양성일 때 암일 확률은 약 23%.]].
:::

### 더 깊이: 비율 형태와 조건부 독립

두 가설의 사후확률 비는 $\dfrac{P(Y=1\mid X)}{P(Y=0\mid X)}=\dfrac{P(X\mid Y=1)}{P(X\mid Y=0)}\cdot\dfrac{P(Y=1)}{P(Y=0)}$ — **사후 오즈 = 가능도비 × 사전 오즈**입니다. 증거 $P(X)$가 약분되어 계산이 쉽고, 로그를 취하면 5단원 로지스틱 회귀의 로그 오즈가 됩니다[[ch05:5.1|로그 오즈(로짓)를 선형함수로 놓는 것이 로지스틱 회귀.]]. 증상이 여러 개 $X_1,X_2$이고 병이 주어지면 서로 독립이라고 가정하면(**조건부 독립**) 가능도비가 곱해집니다 — 나이브 베이즈 분류기의 가정입니다.
` },
      { k: '2.3', src: 'W1 수 · 슬라이드 17–21', title: '확률변수와 분포', body: R`
:::idea 쉽게 말하면
**확률변수**는 무작위 실험의 결과에 **숫자를 붙이는 규칙**입니다. “동전 세 번 던진 결과”는 (앞,앞,뒤) 같은 기호지만, “앞면의 개수” $X$는 2라는 숫자입니다. 숫자가 되면 평균을 내고, 흩어진 정도를 재고, 그래프를 그릴 수 있습니다.
:::

**확률변수**는 함수 $X:\Omega\to\mathbb R$입니다. 동전을 3번 던져 앞면의 개수를 세면 $\omega=(H,H,T)$일 때 $X(\omega)=2$입니다.

- 누적분포함수(CDF) $F(x)=P(X\le x)$, 꼬리함수 $G(x)=1-F(x)=P(X>x)$
- **이산** 확률변수: 확률질량함수 $p(x_i)=P(X=x_i)$, $F(x)=\sum_{x_i\le x}p(x_i)$
- **연속** 확률변수: 확률밀도함수 $f$가 있어 $P(X\le x)=\int_{-\infty}^xf(t)\,dt$
- **모수**(parameter): 분포를 결정하는 값. 베르누이 분포의 $p$, 정규분포의 $\mu,\sigma^2$

연속 확률변수에서 $f(x)$ 자체는 확률이 아니라 **밀도**입니다(1보다 클 수 있음). 한 점의 확률은 $P(X=x)=0$이고, 구간의 확률이 넓이 $\int_a^bf$입니다.

:::note 표기
$p(x\mid\theta)$처럼 세로줄 뒤에 모수를 쓰면 “모수가 $\theta$일 때 $x$의 분포”라는 뜻입니다. 베이즈 관점에서는 $\theta$도 확률변수로 봅니다.
:::

### 이 과목에 나오는 분포

| 분포 | 값 | 확률(밀도) | 평균 | 분산 |
|---|---|---|---|---|
| 베르누이 $\operatorname{Bern}(\theta)$ | $0,1$ | $\theta^x(1-\theta)^{1-x}$ | $\theta$ | $\theta(1-\theta)$ |
| 이항 $\operatorname{Bin}(n,\theta)$ | $0,\dots,n$ | $\binom nx\theta^x(1-\theta)^{n-x}$ | $n\theta$ | $n\theta(1-\theta)$ |
| 푸아송 $\operatorname{Poi}(\lambda)$ | $0,1,2,\dots$ | $e^{-\lambda}\lambda^x/x!$ | $\lambda$ | $\lambda$ |
| 균등 $U(a,b)$ | $[a,b]$ | $\frac1{b-a}$ | $\frac{a+b}2$ | $\frac{(b-a)^2}{12}$ |
| 정규 $\N(\mu,\sigma^2)$ | $\mathbb R$ | $\frac1{\sqrt{2\pi\sigma^2}}e^{-(x-\mu)^2/(2\sigma^2)}$ | $\mu$ | $\sigma^2$ |
| 베타 $\operatorname{Beta}(a,b)$ | $[0,1]$ | $\frac{\theta^{a-1}(1-\theta)^{b-1}}{B(a,b)}$ | $\frac a{a+b}$ | $\frac{ab}{(a+b)^2(a+b+1)}$ |

### 기댓값과 분산

**기댓값**(평균) $\E[X]=\sum_xx\,p(x)$ 또는 $\int xf(x)\,dx$는 분포의 무게중심, **분산** $\Var(X)=\E[(X-\E X)^2]$은 평균에서 흩어진 정도의 제곱 평균입니다. 뒤 단원(초기화의 분산 계산, SGD의 분산, 편향-분산 분해)에서 계속 쓰는 성질을 모아 둡니다.

:::key 기댓값과 분산의 성질
- 선형성: $\E[aX+bY+c]=a\E X+b\E Y+c$ (독립 필요 없음)
- $\Var(X)=\E[X^2]-(\E X)^2$, $\ \Var(aX+b)=a^2\Var(X)$
- $X,Y$가 독립이면 $\E[XY]=\E X\,\E Y$이고 $\Var(X+Y)=\Var X+\Var Y$
- $X_1,\dots,X_n$이 i.i.d.이고 분산 $\sigma^2$이면 표본평균 $\bar X=\frac1n\sum X_i$에 대해 $\E\bar X=\E X_1$, $\Var(\bar X)=\sigma^2/n$
:::

**증명의 핵심.** $\Var X=\E[X^2-2X\E X+(\E X)^2]=\E X^2-2(\E X)^2+(\E X)^2$ (선형성). $\Var(X+Y)=\Var X+\Var Y+2\Cov(X,Y)$이고 $\Cov(X,Y)=\E[XY]-\E X\E Y$가 독립이면 0. 표본평균은 $\Var(\frac1n\sum X_i)=\frac1{n^2}\sum\Var X_i=\frac{n\sigma^2}{n^2}$.

:::ex 예제 3 — 표본평균은 얼마나 흔들리나
공정한 동전을 100번 던져 앞면 비율 $\bar X$를 잰다. $\bar X$의 평균과 표준편차는?
---
$X_i\sim\operatorname{Bern}(0.5)$, $\Var X_i=0.25$. $\E\bar X=0.5$, $\Var\bar X=0.25/100=0.0025$, 표준편차 $0.05$. 자료를 4배로 늘리면 표준편차는 절반($1/\sqrt n$ 비율)이 됩니다. 미니배치를 키울 때 기울기 잡음이 줄어드는 원리와 같습니다[[ch10:10.2|미니배치 기울기의 분산은 배치 크기에 반비례.]].
:::

### 더 깊이: 여러 확률변수

두 확률변수는 **결합분포** $p(x,y)$로 기술합니다. 주변분포는 $p(x)=\sum_yp(x,y)$ (연속이면 적분), 조건부분포는 $p(y\mid x)=p(x,y)/p(x)$, 독립은 $p(x,y)=p(x)p(y)$. 3단원의 엔트로피·상호정보량은 이 분포들의 함수입니다. 연속 벡터 $x\in\mathbb R^d$의 **다변량 정규분포** $\N(\mu,\Sigma)$의 밀도는 $\frac1{(2\pi)^{d/2}\lvert\Sigma\rvert^{1/2}}\exp\!\big(-\frac12(x-\mu)^T\Sigma^{-1}(x-\mu)\big)$이고, $\Sigma=\tau^2I$이면 $-\log$ 밀도가 $\frac1{2\tau^2}\lVert x-\mu\rVert^2+$상수 — 2.6절 릿지 규제의 출처입니다.
` },
      { k: '2.4', src: 'W1 수 · 슬라이드 22–24, W2 월 필기', title: '가능도와 최대가능도 추정', body: R`
:::idea 쉽게 말하면
동전을 10번 던져 앞면이 7번 나왔습니다. 이 동전의 앞면 확률 $\theta$는 얼마라고 보는 게 가장 그럴듯할까요? $\theta=0.1$이라면 7번 나오기가 매우 어렵고, $\theta=0.7$이면 꽤 자연스럽습니다. **“관측된 자료가 나올 확률”을 $\theta$의 함수로 보고, 그것이 가장 큰 $\theta$를 고르는 것**이 최대가능도 추정입니다.
:::

**가능도**는 같은 식 $p(x\mid\theta)$를 **보는 방향**을 바꾼 것입니다(수업 필기).

- $p(x\mid\theta)$: $\theta$를 고정하고 $x$의 함수로 봄 → 확률(밀도)
- $L(\theta;x)=p(x\mid\theta)$: 관측값 $x$를 고정하고 $\theta$의 함수로 봄 → 가능도

예: $P(X=1\mid\theta)=\theta$. 공정한 동전이면 $\theta=\tfrac12$을 넣어 확률 $\tfrac12$을 얻고, $x=1$을 관측했다면 $L(\theta;x=1)=\theta$라는 $\theta$의 함수가 됩니다. 가능도는 $\theta$에 대한 확률분포가 아닙니다($\int L\,d\theta\ne1$일 수 있음).

$X_1,\dots,X_n$이 i.i.d.이면 독립이므로 결합확률이 곱이 되어 $L(\theta)=\prod_{i=1}^np(x_i\mid\theta)$이고, 이를 최대로 하는 $\hat\theta$가 **최대가능도 추정량**(MLE)입니다. 곱을 합으로 바꾸기 위해 $\log L$을 최대로 합니다($\log$는 증가함수라 최대점이 같습니다). 실용적인 이유도 있습니다: 0.1을 1000번 곱하면 컴퓨터에서 0이 되지만 로그의 합은 $-2302.6$으로 멀쩡합니다.

:::key 베르누이 MLE
$x_i\in\{0,1\}$, $P(X_i=1)=\theta$, $S=\sum_ix_i$이면
$$L(\theta)=\theta^{S}(1-\theta)^{n-S},\qquad \ell(\theta)=S\log\theta+(n-S)\log(1-\theta)$$
$$\ell'(\theta)=\frac{S}{\theta}-\frac{n-S}{1-\theta}=0\ \Rightarrow\ \hat\theta_{\text{MLE}}=\frac Sn=\frac1n\sum_{i=1}^nx_i$$
:::

필기에서는 $\ell'=0$에서 $S(1-\theta)=(n-S)\theta$, 즉 $S=n\theta$를 얻었습니다. $\ell''(\theta)=-S/\theta^2-(n-S)/(1-\theta)^2<0$이라 이 점이 최대점입니다. $p(x\mid\theta)=\theta^x(1-\theta)^{1-x}$라는 한 줄 표기가 $x=1$이면 $\theta$, $x=0$이면 $1-\theta$가 되는 것을 확인하세요 — 로지스틱 회귀의 가능도에서 같은 표기를 씁니다[[ch05:5.3|$p(y_i\mid x_i,w)=p^{y_i}(1-p)^{1-y_i}$.]].

### 가우시안 자료의 MLE

$X_i\sim\N(\mu,\sigma^2)$ i.i.d.이면
$$\ell(\mu,\sigma^2)=\sum_{i=1}^n\log\Big(\frac1{\sqrt{2\pi\sigma^2}}e^{-(x_i-\mu)^2/(2\sigma^2)}\Big)=-\frac n2\log(2\pi\sigma^2)-\frac1{2\sigma^2}\sum_{i=1}^n(x_i-\mu)^2.$$
$\mu$에 대해 미분: $\frac1{\sigma^2}\sum(x_i-\mu)=0$이므로 $\hat\mu=\bar x$ (표본평균). $\sigma^2$에 대해 미분: $-\frac n{2\sigma^2}+\frac1{2\sigma^4}\sum(x_i-\mu)^2=0$이므로 $\hat\sigma^2=\frac1n\sum(x_i-\bar x)^2$.
$\mu$에 대한 부분은 **제곱오차합의 최소화**입니다. 1단원의 최소제곱이 “가우시안 잡음의 MLE”인 이유가 이것입니다[[ch04:4.1|선형회귀의 확률적 해석.]].

:::ex 예제 4 — 가우시안 MLE
자료 $2,4,4,6$을 $\N(\mu,\sigma^2)$로 보고 MLE를 구하세요.
---
$\hat\mu=16/4=4$, $\hat\sigma^2=\frac{4+0+0+4}4=2$. (불편 추정량은 $n-1$로 나눈 $8/3$입니다. 아래 참고.)
:::

:::warn 극단적인 자료
동전을 세 번 던져 모두 앞면이면 $\hat\theta_{\text{MLE}}=1$, 즉 “앞으로도 항상 앞면”이라는 과신이 생깁니다. 사전분포를 넣는 베이즈 추론·MAP이 이 문제를 완화합니다.
:::

### 더 깊이: MLE의 성질

- **불변성.** $\hat\theta$가 MLE이면 $g(\hat\theta)$가 $g(\theta)$의 MLE입니다(예: 표준편차의 MLE는 $\sqrt{\hat\sigma^2}$).
- **편향.** $\E[\hat\sigma^2_{\text{MLE}}]=\frac{n-1}n\sigma^2$이라 분산을 조금 과소추정합니다[[@med:ch04:2.3b|최대가능도의 편향과 보정.]]. 편향이 무엇이고 왜 꼭 나쁘지만은 않은지는 2.8절에서 봅니다.
- **점근 성질.** 자료가 많아지면 MLE는 참값으로 수렴하고(일치성) 대략 정규분포를 따르며, 분산이 가능한 최소(크라메르-라오 하한)에 다가갑니다.
- **KL과의 관계.** $\frac1n\ell(\theta)$를 최대화하는 것은 “자료의 경험분포에서 모델분포로의 KL 발산”을 최소화하는 것과 같습니다[[ch03:3.5|교차 엔트로피 = 엔트로피 + KL.]].
` },
      { k: '2.5', src: 'W1 수 · 슬라이드 25–28, W2 월 필기', title: '베이즈 추론: 사전분포에서 사후분포로', body: R`
:::idea 쉽게 말하면
MLE는 “$\theta$는 하나의 정해진 값이고, 그 값을 맞힌다”는 태도입니다. 베이즈 관점은 “$\theta$를 모르니까, 모르는 정도를 **확률분포로** 표현하자”입니다. 자료를 보기 전의 믿음(사전분포)에 자료가 주는 증거(가능도)를 곱하면 자료를 본 뒤의 믿음(사후분포)이 됩니다. 새 자료가 오면 지금의 사후분포를 다음의 사전분포로 삼아 또 고치면 됩니다.
:::

베이즈 관점에서는 모수 $\theta$도 확률변수이고, 자료를 보기 전의 믿음을 **사전분포** $p(\theta)$로 둡니다.
$$p(\theta\mid x)=\frac{p(x,\theta)}{p(x)}=\frac{p(x\mid\theta)\,p(\theta)}{p(x)}=\frac{p(x\mid\theta)\,p(\theta)}{\int p(x\mid\theta)p(\theta)\,d\theta}$$
사후분포 $\propto$ 가능도 $\times$ 사전분포이고, 분모 $p(x)$(증거)는 $\theta$와 무관한 정규화 상수입니다. 2.2절의 베이즈 정리에서 분할 $\{E_i\}$를 연속적인 $\theta$로, 합을 적분으로 바꾼 것입니다.

:::def 베타분포와 베타함수
$$\operatorname{Beta}(\theta\mid a,b)=\frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)}\theta^{a-1}(1-\theta)^{b-1},$$
$$B(a,b)=\int_0^1t^{a-1}(1-t)^{b-1}dt=\frac{\Gamma(a)\Gamma(b)}{\Gamma(a+b)}$$
$\operatorname{Beta}(1,1)$은 $[0,1]$ 위의 균등분포입니다. 평균은 $\frac{a}{a+b}$, 최빈값은 $\frac{a-1}{a+b-2}$ ($a,b>1$).
:::

감마함수 $\Gamma(z)=\int_0^\infty t^{z-1}e^{-t}dt$는 계승의 확장이라 양의 정수에서 $\Gamma(m)=(m-1)!$입니다. 그래서 정수 $a,b$이면 $B(a,b)=\frac{(a-1)!(b-1)!}{(a+b-1)!}$로 손으로 계산됩니다. 예: $\int_0^1\theta^3(1-\theta)^2d\theta=B(4,3)=\frac{3!\,2!}{6!}=\frac1{60}$.

:::key 베타 사후분포
베르누이 자료($S$번 성공, $n-S$번 실패)와 균등 사전분포 $p(\theta)=1$ ($0\le\theta\le1$)이면
$$\begin{aligned}p(\theta\mid D)&=\frac{\Gamma(n+2)}{\Gamma(S+1)\Gamma(n-S+1)}\theta^{S}(1-\theta)^{n-S}\\&=\operatorname{Beta}(\theta\mid S+1,\,n-S+1)\end{aligned}$$
사전분포가 $\operatorname{Beta}(a,b)$이면 사후분포는 $\operatorname{Beta}(a+S,\ b+n-S)$.
:::

:::hand 수업 필기 — 정규화 상수 구하기
$p(\theta\mid D)\propto\theta^S(1-\theta)^{n-S}=:q(\theta)$. 정규화 상수 $Z=\int_0^1\theta^S(1-\theta)^{n-S}d\theta$는 베타함수에서 $a-1=S$, $b-1=n-S$로 둔 것이므로
$$Z=B(S+1,n-S+1)=\frac{\Gamma(S+1)\Gamma(n-S+1)}{\Gamma(n+2)}.$$
따라서 $p(\theta\mid D)=q(\theta)/Z$가 위의 베타분포입니다. 사전분포와 사후분포가 같은 꼴(베타)이므로 베타분포는 베르누이 가능도의 **켤레 사전분포**입니다.
:::

### 사전분포 = 미리 본 가상의 자료

사전분포 $\operatorname{Beta}(a,b)$와 사후분포 $\operatorname{Beta}(a+S,b+n-S)$를 비교하면, $a-1$은 “미리 본 성공 횟수”, $b-1$은 “미리 본 실패 횟수”처럼 행동합니다(**가상 관측**). 사후평균을 정리하면
$$\E[\theta\mid D]=\frac{a+S}{a+b+n}=\underbrace{\frac{a+b}{a+b+n}}_{\text{사전의 무게}}\cdot\frac a{a+b}+\underbrace{\frac n{a+b+n}}_{\text{자료의 무게}}\cdot\frac Sn$$
— 사전평균과 MLE의 **가중평균**이고, 자료가 많아질수록($n\to\infty$) 자료 쪽 무게가 1로 가서 MLE와 같아집니다.

:::fig betapost
:::

:::ex 예제 5 — 순차적 갱신
균등 사전분포에서 동전을 던져 앞, 앞, 뒤가 나왔다. 한 번에 갱신한 결과와 한 번씩 갱신한 결과를 비교하세요.
---
한 번에: $S=2$, $n=3$이므로 $\operatorname{Beta}(3,2)$.
한 번씩: $\operatorname{Beta}(1,1)\xrightarrow{\text{앞}}\operatorname{Beta}(2,1)\xrightarrow{\text{앞}}\operatorname{Beta}(3,1)\xrightarrow{\text{뒤}}\operatorname{Beta}(3,2)$. 같습니다. i.i.d. 자료에서는 가능도가 곱이라 순서와 나누는 방법에 상관없이 같은 사후분포가 나옵니다. 사후평균 $3/5=0.6$, 최빈값 $2/3$.
:::

### 더 깊이: 켤레가 아닐 때

사전분포와 가능도가 켤레가 아니면 분모의 적분 $p(x)$를 손으로 못 구합니다. 그래서 마르코프 연쇄 몬테카를로(MCMC)로 사후분포에서 표본을 뽑거나, 사후분포를 간단한 분포로 근사(변분 추론)합니다. 신경망의 가중치에 대해 완전한 사후분포를 구하는 것은 대개 불가능해서, 실전에서는 사후분포의 꼭대기 하나(MAP)만 구하는 경우가 많습니다 — 다음 절입니다[[@med:ch06:2.6c|완전 베이지안 머신러닝과 그 어려움.]].
` },
      { k: '2.6', src: 'W1 수 · 슬라이드 29–31, W2 월 필기', title: 'MAP 추정: 가능도 + 사전분포', body: R`
:::idea 쉽게 말하면
사후분포 전체를 들고 다니기 번거로우면, 사후분포에서 **가장 높은 곳 하나**만 골라 추정값으로 씁니다. 이것이 MAP입니다. 로그를 취하면 “자료를 잘 설명하는 정도”와 “사전 믿음에 맞는 정도”를 더한 점수를 최대화하는 문제가 되고, 머신러닝 언어로는 **손실 + 규제**의 최소화입니다.
:::

사후분포 전체 대신 그 최빈값 하나를 추정값으로 쓰는 것이 **MAP**(maximum a posteriori)입니다. $p(x)$는 $\theta$와 무관하고 $\log$는 증가함수이므로(필기: $2x+5$처럼 증가함수를 씌우거나 상수를 더해도 최대점은 그대로)

:::key MAP 추정
$$\begin{aligned}\hat\theta_{\text{MAP}}&=\argmax_\theta\log p(\theta\mid x)=\argmax_\theta\big[\log p(x\mid\theta)+\log p(\theta)\big]\\&=\argmin_\theta\big[\underbrace{-\log p(x\mid\theta)}_{\text{자료 적합 손실}}\ \underbrace{-\log p(\theta)}_{\text{규제}}\big]\end{aligned}$$
$\theta\sim\N(0,\tau^2I)$이면 $-\log p(\theta)=\dfrac{1}{2\tau^2}\lVert\theta\rVert_2^2+\text{상수}$ → $L_2$ 규제(릿지).
:::

**한 줄씩.** (1) $p(\theta\mid x)=p(x\mid\theta)p(\theta)/p(x)$의 $\argmax$는 분모 $p(x)$와 무관하므로 $\argmax p(x\mid\theta)p(\theta)$. (2) $\log$가 증가함수이므로 $\argmax\log(\cdot)=\argmax\log p(x\mid\theta)+\log p(\theta)$. (3) 부호를 바꾸면 $\argmax$가 $\argmin$.

MLE는 $\argmax\log p(x\mid\theta)$로 사전분포를 쓰지 않습니다. MAP은 사전분포를 쓸 수 있고, 그 사전분포가 곧 규제항이 됩니다[[ch04:4.3|릿지 회귀 $\tfrac12f(\beta)+\tfrac\lambda2\lVert\beta\rVert^2$는 가우시안 오차 + 가우시안 사전분포의 MAP입니다.]]. 라플라스 사전분포 $p(\theta)\propto e^{-\lvert\theta\rvert/b}$를 쓰면 $-\log p=\lvert\theta\rvert/b$ → $L_1$ 규제(라쏘)가 됩니다.

:::ex 예제 6 — 동전 10번, 앞면 7번 (수업 필기)
(1) MLE (2) 사전분포 $\operatorname{Beta}(2,2)$(“공정한 동전일 것 같다”)로 MAP을 구하세요.
---
(1) $P(D\mid\theta)=\theta^7(1-\theta)^3$, $\hat\theta_{\text{MLE}}=7/10=0.7$.
(2) $P(\theta\mid D)\propto\theta^7(1-\theta)^3\cdot\theta^{2-1}(1-\theta)^{2-1}=\theta^8(1-\theta)^4$ → $\operatorname{Beta}(9,5)$. 최빈값 $\frac{9-1}{9+5-2}=\frac8{12}\approx0.667$.
사전분포가 추정값을 $0.5$ 쪽으로 당깁니다.
:::

위 그림(2.5절)의 세 곡선이 이 예제입니다. 사후평균은 $9/14\approx0.643$으로 MAP과 또 조금 다릅니다 — 분포가 비대칭이면 최빈값과 평균이 다릅니다.

:::tip 베타-베르누이 MAP 공식
사전분포 $\operatorname{Beta}(a,b)$, $n$번 중 $S$번 성공이면 $\hat\theta_{\text{MAP}}=\dfrac{S+a-1}{n+a+b-2}$. $a=b=1$(균등)이면 MLE와 같아집니다.
:::

**유도.** $\log p(\theta\mid D)=(S+a-1)\log\theta+(n-S+b-1)\log(1-\theta)+$상수. 미분해 0으로 두면 $\frac{S+a-1}\theta=\frac{n-S+b-1}{1-\theta}$, 즉 $(S+a-1)(1-\theta)=(n-S+b-1)\theta$에서 위 공식. 베르누이 MLE 유도에서 $S\to S+a-1$, $n\to n+a+b-2$로 바꾼 것과 같습니다.

### 더 깊이: MAP의 약점

MAP은 편리하지만 **모수를 바꾸면(재매개화) 값이 변합니다**. 밀도는 변수 변환 때 야코비안이 곱해지기 때문입니다. 예컨대 $\theta$ 대신 로짓 $\log\frac\theta{1-\theta}$에 대해 균등 사전분포를 두면 MAP이 달라집니다. 사후평균이나 사후분포 전체는 이런 문제가 적습니다. 또 MAP은 불확실성(분포의 폭)을 버리므로 2.7절처럼 자료 양이 다른 두 대상을 비교할 때는 사후분포 전체를 쓰는 편이 낫습니다.
` },
      { k: '2.7', src: 'W1 수 · 슬라이드 32–34, W2 월 필기', title: '예제: 어느 판매자에게 살까', body: R`
:::idea 쉽게 말하면
별점 4.5(리뷰 1000개)와 별점 5.0(리뷰 2개) 중 어디서 사겠습니까? 대부분 앞의 가게를 고릅니다. 리뷰 2개짜리 5.0은 “운이 좋았을 수도” 있기 때문입니다. 베이즈 추론은 이 상식을 숫자로 만듭니다.
:::

K. P. Murphy의 예제입니다. 같은 가격의 물건을 두 판매자가 팝니다. 판매자 1은 긍정 90·부정 10, 판매자 2는 긍정 2·부정 0 리뷰를 받았습니다.

- **MLE로 보면** $\hat\theta_1=0.9$, $\hat\theta_2=1.0$ → 판매자 2가 낫다는 결론. 리뷰 두 개로 “완벽”하다고 믿는 과신입니다.
- **베이즈로 보면**(필기) 신뢰도 $\theta_1,\theta_2$에 균등 사전분포 $\operatorname{Beta}(1,1)$을 두어
$$p(\theta_1\mid D_1)=\operatorname{Beta}(91,11),\qquad p(\theta_2\mid D_2)=\operatorname{Beta}(3,1).$$
두 사후분포는 독립이므로
$$\begin{aligned}P(\theta_1>\theta_2\mid D_1,D_2)&=\iint\mathbb 1\{\theta_1>\theta_2\}\operatorname{Beta}(\theta_1\mid91,11)\\&\qquad\times\operatorname{Beta}(\theta_2\mid3,1)\,d\theta_1d\theta_2\approx0.71.\end{aligned}$$
(수치적분으로 계산하면 $0.713$.) 따라서 **판매자 1**에게 사는 것이 낫습니다. 사후평균도 $91/102\approx0.89$ 대 $3/4=0.75$입니다.

:::fig sellers
:::

### 이 적분을 손으로 정확히 풀기

$\operatorname{Beta}(3,1)$의 밀도는 $3t^2$이고 누적분포는 $P(\theta_2\le t)=t^3$입니다. $\theta_1$을 고정하면 $P(\theta_2<\theta_1\mid\theta_1)=\theta_1^3$이므로
$$P(\theta_1>\theta_2)=\E\big[\theta_1^3\big],\qquad \theta_1\sim\operatorname{Beta}(91,11).$$
베타분포의 모멘트 $\E[\theta^k]=\frac{B(a+k,b)}{B(a,b)}=\prod_{j=0}^{k-1}\frac{a+j}{a+b+j}$를 쓰면
$$\E[\theta_1^3]=\frac{91}{102}\cdot\frac{92}{103}\cdot\frac{93}{104}\approx0.7126.$$
수업의 “약 0.71”이 정확히 이 값입니다(수치적분과 일치).

:::idea 핵심
자료가 적을수록 사후분포가 넓습니다. $\operatorname{Beta}(3,1)$은 $\theta_2$가 1 근처일 수도, 0.5 근처일 수도 있다는 불확실성을 그대로 담고 있고, 베이즈 추론은 그 불확실성까지 비교합니다.
:::

### 더 깊이: 몬테카를로로 풀기

적분이 복잡하면 표본으로 추정합니다. $\theta_1^{(s)}\sim\operatorname{Beta}(91,11)$, $\theta_2^{(s)}\sim\operatorname{Beta}(3,1)$를 $S$쌍 뽑아 $\theta_1^{(s)}>\theta_2^{(s)}$인 비율을 세면 $P(\theta_1>\theta_2)$의 불편추정량이고, 표준오차는 약 $\sqrt{0.71\cdot0.29/S}$ — $S=10^4$이면 $\pm0.005$ 정도입니다. 베이지안 딥러닝에서 “사후분포에서 가중치를 여러 번 뽑아 예측을 평균”하는 것이 같은 발상입니다.
` },
      { k: '2.8', src: 'Problem Set 1 · 문제 2', title: '가우시안 평균의 MAP: 수축과 편향-분산 분해', body: R`
:::idea 쉽게 말하면
측정값 $X_1,\dots,X_n$이 참값 $\theta$ 주변에 흩어져 있을 때 가장 자연스러운 추정은 평균 $\bar X$입니다. 그런데 “$\theta$는 아마 0 근처일 것”이라는 사전 믿음이 있으면, MAP은 $\bar X$를 0 쪽으로 **조금 끌어당긴**(수축한) 값을 냅니다. 끌어당기면 평균적으로 조금 빗나가지만(편향), 대신 덜 흔들립니다(분산 감소). 둘을 합친 전체 오차(MSE)는 오히려 줄 수 있습니다. 이것이 규제가 과적합을 줄이는 이유의 가장 단순한 모형입니다.
:::

### 설정

$X_1,\dots,X_n$이 독립이고 $X_i\sim\N(\theta,1)$ (분산 1은 알고, 평균 $\theta$는 모름). 사전분포는 $\theta\sim\N(0,\tau^2)$, $\tau^2>0$.

### (1) MAP = 릿지

사후분포 $\propto$ 가능도 $\times$ 사전분포이므로
$$\begin{aligned}\log p(\theta\mid X)&=\sum_{i=1}^n\log\Big(\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\Big)+\log\Big(\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}\Big)+C\\&=-\frac12\sum_{i=1}^n(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C'.\end{aligned}$$
$\theta$와 무관한 상수를 버리고 $-2$를 곱하면 최대화가 최소화로 바뀝니다.

:::key 가우시안 MAP은 릿지
$$\hat\theta_{\text{MAP}}=\argmin_\theta\Big[\sum_{i=1}^n(X_i-\theta)^2+\lambda\theta^2\Big],\qquad\lambda=\frac1{\tau^2}$$
해는 $\hat\theta_{\text{MAP}}=\dfrac{\sum_iX_i}{n+\lambda}=a\bar X$, 수축 계수 $a=\dfrac n{n+1/\tau^2}=\dfrac{n\tau^2}{n\tau^2+1}\in(0,1)$.
:::

**풀이.** $g(\theta)=\sum(X_i-\theta)^2+\lambda\theta^2$을 미분하면 $g'(\theta)=-2\sum(X_i-\theta)+2\lambda\theta=-2\sum X_i+2(n+\lambda)\theta$. $g''=2(n+\lambda)>0$이라 볼록이므로 $g'=0$의 해 $\theta=\sum X_i/(n+\lambda)$가 최솟점입니다. $\sum X_i=n\bar X$를 쓰면 $\hat\theta=\frac n{n+\lambda}\bar X$.

**해석.**
- $\tau^2\to\infty$ (사전 믿음이 거의 없음): $a\to1$, MAP → MLE $\bar X$.
- $\tau^2\to0$ (0이라고 굳게 믿음): $a\to0$, 자료를 무시하고 0.
- $n\to\infty$ (자료가 많음): $a\to1$. 자료가 사전 믿음을 이깁니다.
- 가능도와 사전분포가 모두 가우시안이라 사후분포도 가우시안 $\N\big(a\bar X,\ \frac1{n+1/\tau^2}\big)$이고, 대칭이므로 MAP = 사후평균입니다. 정밀도(분산의 역수)가 더해진다: $\frac1{\sigma_{\text{post}}^2}=n+\frac1{\tau^2}$.

### (2) 편향-분산 분해

추정량 $\hat\theta$(자료의 함수라서 확률변수)의 좋고 나쁨을 **평균제곱오차** $\mathrm{MSE}=\E[(\hat\theta-\theta)^2]$로 잽니다. 기댓값은 $\theta$를 고정했을 때 자료의 분포에 대해 취합니다.

:::key 편향-분산 분해
$$\E\big[(\hat\theta-\theta)^2\big]=\big(\E[\hat\theta]-\theta\big)^2+\Var(\hat\theta)=\text{편향}^2+\text{분산}$$
:::

**증명.** $\hat\theta-\theta=(\hat\theta-\E\hat\theta)+(\E\hat\theta-\theta)$로 쪼개어 제곱합니다. 둘째 괄호 $b=\E\hat\theta-\theta$는 **상수**입니다.
$$\E(\hat\theta-\theta)^2=\E(\hat\theta-\E\hat\theta)^2+2b\,\E(\hat\theta-\E\hat\theta)+b^2.$$
가운데 항은 $\E(\hat\theta-\E\hat\theta)=\E\hat\theta-\E\hat\theta=0$이라 사라지고, 첫 항은 분산의 정의입니다. ∎

### (3) 수축 추정량의 편향·분산·MSE

$\E\bar X=\theta$, $\Var\bar X=1/n$ (2.3절)이므로 $\hat\theta=a\bar X$에 대해
$$\text{편향}=a\theta-\theta=-(1-a)\theta=-\frac{\theta}{n\tau^2+1},\qquad \Var(\hat\theta)=\frac{a^2}n=\frac{n\tau^4}{(n\tau^2+1)^2},$$
$$\mathrm{MSE}(\hat\theta_{\text{MAP}})=\frac{\theta^2}{(n\tau^2+1)^2}+\frac{n\tau^4}{(n\tau^2+1)^2}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}.$$
비교 대상인 MLE $\bar X$는 편향 0, 분산 $1/n$, MSE $1/n$.

:::ex 예제 7 — 수치로 비교하기
$n=4$, $\tau^2=0.5$일 때 수축 계수, 그리고 참값이 $\theta=0,1,2$일 때 MAP과 MLE의 MSE를 비교하세요.
---
$a=\frac{4(0.5)}{4(0.5)+1}=\frac23$. 분산 $a^2/n=\frac{4/9}4=\frac19$, 편향² $(1-a)^2\theta^2=\frac{\theta^2}9$.
- $\theta=0$: MAP $\frac19\approx0.111$ < MLE $0.25$
- $\theta=1$: MAP $\frac29\approx0.222$ < MLE $0.25$
- $\theta=2$: MAP $\frac59\approx0.556$ > MLE $0.25$

MAP이 이기는 조건: $\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}<\frac1n\iff n\theta^2+n^2\tau^4<n^2\tau^4+2n\tau^2+1\iff\theta^2<2\tau^2+\frac1n$. 여기서는 $\theta^2<1.25$.
:::

:::fig shrinkmse
:::

:::warn 편향이 0이면 최선이 아니다
“불편추정량이 좋다”는 직관은 반만 맞습니다. 판단 기준이 MSE라면 약간의 편향을 받아들이고 분산을 크게 줄이는 편이 나을 수 있습니다. 릿지·가중치 감쇠·드롭아웃 같은 규제가 모두 이 거래입니다[[ch04:4.3|릿지의 $\lambda$가 편향과 분산을 맞바꾸는 손잡이입니다.]].
:::

### 더 깊이: 제임스-스타인 현상

차원이 $d\ge3$이면 놀라운 일이 생깁니다. $X\sim\N(\theta,I_d)$ 하나를 관측할 때, 어떤 $\theta$에서도 MSE가 $X$보다 작은 추정량 $\big(1-\frac{d-2}{\lVert X\rVert^2}\big)X$가 존재합니다(제임스-스타인). 즉 고차원에서는 “아무 사전 정보 없이” 수축만 해도 표본평균을 **모든 $\theta$에서** 이길 수 있습니다. 파라미터가 수백만 개인 신경망에서 규제가 거의 항상 도움이 되는 이유에 대한 한 가지 직관입니다.
` },
    ],
  });
})();
