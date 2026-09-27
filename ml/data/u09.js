/* 09 볼록 학습 문제 — UML 12장, 강의 노트 “Smoothness inequality” (Eq. 12.5), “Claim 12.9” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 9, part: 'B', title: '볼록 학습 문제: 볼록성, 립시츠성, 매끄러움', en: 'Convex Learning Problems', ref: 'UML 12장', plot: 'convex',
    fig: R`볼록함수(굵은 선)는 모든 접선 위에 있고 모든 현 아래에 있습니다`,
    tagline: R`볼록이면 국소 최소가 곧 전역 최소입니다. 그러나 학습가능하려면 볼록성만으로는 모자라고, 립시츠성이나 매끄러움과 유계성이 함께 필요합니다.`,
    summary: R`ERM이 계산하기 쉬운 문제를 찾습니다. 가설 클래스가 볼록 집합이고 손실이 $w$의 볼록함수이면 ERM은 **볼록 최적화**이고, 국소 최소가 전역 최소입니다. 그러나 볼록성은 학습가능성을 보장하지 않습니다: 유계가 아닌 선형 회귀는 두 분포를 구별하지 못해 실패합니다. 추가 조건 두 가지 — 손실의 **립시츠성**($\lvert f(w)-f(v)\rvert\le\rho\lVert w-v\rVert$) 또는 **매끄러움**(기울기가 $\beta$-립시츠) — 과 가설의 **유계성** $\lVert w\rVert\le B$를 더한 **볼록-립시츠-유계**, **볼록-매끄러움-유계** 문제는 13–14장에서 학습가능함이 증명됩니다. 매끄러움은 이차 상한 $f(v)\le f(w)+\langle\nabla f(w),v-w\rangle+\frac\beta2\lVert v-w\rVert^2$와 자기 유계성 $\lVert\nabla f\rVert^2\le2\beta f$를 줍니다. 볼록하지 않은 0–1 손실은 **대리 손실**(힌지)로 바꿉니다.`,
    goals: [
      R`볼록 집합·볼록함수를 정의하고, 미분가능한 볼록함수가 접선 위에 있음을 쓸 수 있다`,
      R`$f(w)=g(\langle w,x\rangle+b)$ 꼴에서 볼록성·립시츠 상수·매끄러움 상수를 구할 수 있다`,
      R`매끄러움의 이차 상한(12.5)을 적분과 코시–슈바르츠로 증명할 수 있다`,
      R`음이 아닌 $\beta$-매끄러운 함수의 자기 유계성 $\lVert\nabla f\rVert^2\le2\beta f$를 유도할 수 있다`,
      R`볼록성만으로 학습가능하지 않은 예를 설명하고, 볼록-립시츠-유계 문제를 정의할 수 있다`,
      R`힌지 손실이 0–1 손실의 볼록 상한임을 보이고 오차 분해에 최적화 오차 항을 더할 수 있다`,
    ],
    secTitles: { '12.1': '볼록성', '12.1b': '립시츠성', '12.1c': '매끄러움', '12.2': '볼록 학습 문제', '12.3': '대리 손실' },
    sections: [
      { k: '12.1', p: 156, title: '볼록성', body: R`
:::def 볼록 집합과 볼록함수
- $C$가 **볼록**: $u,v\in C$, $\alpha\in[0,1]$이면 $\alpha u+(1-\alpha)v\in C$.
- $f:C\to\mathbb R$이 **볼록**: $f(\alpha u+(1-\alpha)v)\le\alpha f(u)+(1-\alpha)f(v)$. 동치로 에피그래프 $\{(w,\beta):f(w)\le\beta\}$가 볼록 집합.
:::

:::key 볼록함수의 1차 조건
미분가능한 $f$가 볼록일 필요충분조건은 모든 $w,u$에서
$$f(u)\ge f(w)+\langle\nabla f(w),u-w\rangle.$$
따라서 $\nabla f(w)=0$이면 $w$는 전역 최소점이고, 볼록함수의 국소 최소점은 모두 전역 최소점이다.
:::

**만드는 규칙.**
- 1변수 $g$가 두 번 미분가능하면 $g$ 볼록 $\iff g''\ge0$. 예: $x^2$, $e^x$, $\ln(1+e^x)$.
- $g$가 볼록이면 $f(w)=g(\langle w,x\rangle+y)$도 볼록(선형사상과의 합성). 예: 제곱 손실 $(\langle w,x\rangle-y)^2$, 로지스틱 손실.
- 볼록함수들의 **최댓값**과 **음이 아닌 가중합**은 볼록. 예: 힌지 손실 $\max\{0,1-y\langle w,x\rangle\}$.

:::note 헤시안으로 보기
다변수에서는 헤시안이 양의 준정부호인 것이 볼록성과 같습니다[[@base:ch04:4.3|$\nabla^2f\succeq0$ ⇔ 볼록.]]. 로지스틱 손실의 헤시안이 $X^\top SX\succeq0$인 것이 그 예입니다.
:::
` },
      { k: '12.1b', p: 160, title: '립시츠성', body: R`
:::def 립시츠성
$f:\mathbb R^d\to\mathbb R^k$가 $C$ 위에서 **$\rho$-립시츠**: 모든 $w_1,w_2\in C$에서 $\lVert f(w_1)-f(w_2)\rVert\le\rho\lVert w_1-w_2\rVert$.
:::

1변수 미분가능 함수는 $\lvert f'\rvert\le\rho$이면 $\rho$-립시츠입니다(평균값 정리)[[@base:ch05:5.1|립시츠 조건과 도함수의 한계.]].

| 함수 | 립시츠 상수 | 비고 |
|---|---|---|
| $\lvert x\rvert$ | 1 | 미분 불가능해도 립시츠 |
| $\ln(1+e^x)$ | 1 | 도함수 $=\sigma(x)\in(0,1)$ |
| $x^2$ | 없음 ($\mathbb R$ 위) | $[-B,B]$ 위에서는 $2B$ |
| $\langle v,w\rangle+b$ ($w$의 함수) | $\lVert v\rVert$ | 코시–슈바르츠 |

:::key 합성의 립시츠 상수
$g_1$이 $\rho_1$-립시츠, $g_2$가 $\rho_2$-립시츠이면 $g_1\circ g_2$는 $\rho_1\rho_2$-립시츠. 특히 $g$가 $\rho$-립시츠이면 $f(w)=g(\langle w,x\rangle+b)$는 $\rho\lVert x\rVert$-립시츠.
:::

예: 절대 손실 $\lvert\langle w,x\rangle-y\rvert$는 $\lVert x\rVert\le\rho$이면 $\rho$-립시츠. 로지스틱 손실 $\ln(1+e^{-y\langle w,x\rangle})$도 $\lVert x\rVert$-립시츠.
` },
      { k: '12.1c', p: 162, src: '강의 노트 · Eq. (12.5), Claim 12.9', title: '매끄러움', body: R`
:::def 매끄러움
미분가능한 $f:\mathbb R^d\to\mathbb R$이 **$\beta$-매끄러움**: 기울기가 $\beta$-립시츠, 즉 $\lVert\nabla f(v)-\nabla f(w)\rVert\le\beta\lVert v-w\rVert$.
:::

:::key 매끄러움의 이차 상한
$f$가 $\beta$-매끄러우면 모든 $v,w$에서
$$f(v)\le f(w)+\langle\nabla f(w),v-w\rangle+\frac\beta2\lVert v-w\rVert^2.$$
:::

:::hand 강의 노트 — 선분 위의 적분
$\gamma(t)=w+t(v-w)$, $\phi(t)=f(\gamma(t))$. 연쇄법칙으로 $\phi'(t)=\langle\nabla f(\gamma(t)),v-w\rangle$이고 미적분의 기본정리로
$$f(v)-f(w)=\int_0^1\langle\nabla f(\gamma(t)),v-w\rangle dt=\langle\nabla f(w),v-w\rangle+\int_0^1\langle\nabla f(\gamma(t))-\nabla f(w),v-w\rangle dt.$$
코시–슈바르츠와 매끄러움으로 적분 안은 $\le\beta t\lVert v-w\rVert^2$이고 $\int_0^1t\,dt=\tfrac12$.
:::

볼록이면 아래로 $f(v)\ge f(w)+\langle\nabla f(w),v-w\rangle$이므로, **볼록이고 매끄러운 함수는 1차 근사와의 차이가 $0$과 $\frac\beta2\lVert v-w\rVert^2$ 사이**에 끼입니다.

:::key 자기 유계성
$f\ge0$이고 $\beta$-매끄러우면 $\lVert\nabla f(w)\rVert^2\le2\beta f(w)$.
:::

이차 상한에 $v=w-\frac1\beta\nabla f(w)$를 넣으면 $f(v)\le f(w)-\frac1{2\beta}\lVert\nabla f(w)\rVert^2$이고, $f(v)\ge0$이므로 결론. 손실이 작은 곳에서는 기울기도 작다는 뜻 — 13·14장의 “낙관적” 상한의 열쇠입니다.

:::key 선형 합성의 매끄러움
$g:\mathbb R\to\mathbb R$이 $\beta$-매끄러우면 $f(w)=g(\langle w,x\rangle+b)$는 $\beta\lVert x\rVert^2$-매끄럽다.
:::

$\nabla f(w)=g'(\langle w,x\rangle+b)x$이므로 $\lVert\nabla f(v)-\nabla f(w)\rVert=\lvert g'(\cdot)-g'(\cdot)\rvert\lVert x\rVert\le\beta\lvert\langle v-w,x\rangle\rvert\lVert x\rVert\le\beta\lVert x\rVert^2\lVert v-w\rVert$. 예: 제곱 손실 $(\langle w,x\rangle-y)^2$은 $2\lVert x\rVert^2$-매끄러움, 로지스틱 손실은 $\frac14\lVert x\rVert^2$-매끄러움($g''=\sigma(1-\sigma)\le\frac14$).

:::note 심층 신경망 과목의 하강 보조정리
같은 이차 상한이 경사하강법 한 걸음의 감소량을 주는 하강 보조정리입니다[[@dnn:ch13:13.3|$\beta$-매끄러움에서 $f(w-\eta\nabla f)\le f(w)-\eta(1-\frac{\beta\eta}2)\lVert\nabla f\rVert^2$.]].
:::
` },
      { k: '12.2', p: 163, title: '볼록 학습 문제와 학습가능성', body: R`
:::def 볼록 학습 문제
학습 문제 $(\cH,\cZ,\ell)$이 **볼록**: $\cH$가 볼록 집합이고 모든 $z$에서 $\ell(\cdot,z)$가 볼록함수. 이때 $L_S(w)$도 볼록이라 ERM은 볼록 최적화 문제다.
:::

그러나 **볼록성만으로는 학습가능하지 않습니다.** 1차원 제곱 손실 회귀 $\ell(w,(x,y))=(wx-y)^2$, $\cH=\mathbb R$에서 두 분포를 생각합니다: $\cD_1$은 확률 $\mu$로 $(1,0)$, $1-\mu$로 $(\mu,-1)$; $\cD_2$는 늘 $(\mu,-1)$. $\mu$가 작으면 $m$개 표본이 모두 $(\mu,-1)$일 확률이 두 분포 모두에서 99% 이상이라 학습기는 둘을 구별하지 못하고, 출력 $\hat w$가 $-1/(2\mu)$보다 작으면 $\cD_1$에서, 크면 $\cD_2$에서 크게 실패합니다(교재 예 12.8). 유계 $\lvert w\rvert\le1$을 더해도 입력이 $1/\mu$처럼 커질 수 있으면 같은 논법이 통합니다(예 12.9).

:::key 볼록-립시츠-유계 문제
$(\cH,\cZ,\ell)$이 매개변수 $\rho,B$의 **볼록-립시츠-유계** 문제: $\cH$가 볼록이고 $\lVert w\rVert\le B$ ($\forall w\in\cH$), 모든 $z$에서 $\ell(\cdot,z)$가 볼록이고 $\rho$-립시츠.

**볼록-매끄러움-유계** 문제: $\cH$가 볼록이고 $\lVert w\rVert\le B$, 모든 $z$에서 $\ell(\cdot,z)$가 볼록, 음이 아니며, $\beta$-매끄러움.
:::

예: $\lVert x\rVert\le\rho$, $\lVert w\rVert\le B$인 절대 손실 회귀는 볼록-립시츠-유계. $\lVert x\rVert^2\le\beta/2$인 제곱 손실 회귀는 볼록-매끄러움-유계. 두 부류는 13장(규제)과 14장(SGD)에서 학습가능함이 증명됩니다.

:::warn 5단원 기본 정리와의 차이
이진 분류에서는 학습가능 ⇔ 균등수렴이었습니다. 볼록 학습 문제에서는 균등수렴하지 않지만 학습가능한 예가 있어(교재 13장 연습문제 2 “Learnability without Uniform Convergence”), 균등수렴이 아닌 **안정성**이라는 다른 도구가 필요합니다.
:::
` },
      { k: '12.3', p: 167, title: '대리 손실함수', body: R`
반공간의 0–1 손실 $\one[y\ne\sign\langle w,x\rangle]$은 $w$에 대해 볼록이 아니고, 이 ERM은 일반적으로 계산이 어렵습니다(NP-어려움). 그래서 0–1 손실을 위에서 누르는 볼록함수로 바꿉니다.

:::key 힌지 손실은 0–1 손실의 볼록 상한
$$\ell^{\mathrm{hinge}}(w,(x,y))=\max\{0,1-y\langle w,x\rangle\}\ \ge\ \one[y\langle w,x\rangle\le0].$$
힌지 손실은 $w$의 볼록함수이고 $\lVert x\rVert$-립시츠이다.
:::

$y\langle w,x\rangle\le0$이면 힌지 $\ge1$, $>0$이면 힌지 $\ge0$. 볼록성은 “볼록함수(상수 0과 아핀 함수)들의 최댓값”에서 옵니다.

대리 손실의 ERM 출력 $A(S)$에 대해 오차가 셋으로 나뉩니다.
$$L^{0-1}_\cD(A(S))\le L^{\mathrm{hinge}}_\cD(A(S))\le\underbrace{\min_{w\in\cH}L^{\mathrm{hinge}}_\cD(w)}_{\text{근사}}+\underbrace{\varepsilon_{\mathrm{est}}}_{\text{추정}},$$
그리고 $\min L^{\mathrm{hinge}}\ge\min L^{0-1}$ 사이의 간격이 **최적화 오차**(대리 손실을 쓴 대가)입니다.

:::tip 마진의 함수로 보기
0–1, 힌지, 로지스틱 손실은 모두 마진 $z=y\langle w,x\rangle$의 감소함수입니다: $\one[z\le0]$, $\max\{0,1-z\}$, $\ln(1+e^{-z})$. 표지 그림은 15단원에서 다시 이 셋을 겹쳐 그립니다.
:::
` },
    ],
    problems: [
      { sec: '12.1', type: 'mc', lv: 1, q: R`다음 중 볼록함수가 **아닌** 것은?`,
        choices: [R`$e^x$`, R`$\ln(1+e^{-x})$`, R`$\sqrt{\lvert x\rvert}$`, R`$\max\{0,1-x\}$`], ans: 2,
        sol: R`$\sqrt{\lvert x\rvert}$는 0 근처에서 현이 그래프 아래로 내려갑니다(예: $x=0,1$의 중점에서 $\sqrt{0.5}\approx0.707>0.5$). 나머지는 $g''\ge0$이거나 볼록함수의 최대입니다.` },
      { sec: '12.1', type: 'mc', lv: 2, q: R`미분가능한 볼록함수 $f$에서 $\nabla f(w_0)=0$일 때 옳은 것은?`,
        choices: [R`$w_0$는 국소 최소일 수도, 안장점일 수도 있다`, R`$w_0$는 전역 최소점이다`, R`$f$는 강볼록이다`, R`$w_0$가 유일한 최소점이다`], ans: 1,
        sol: R`1차 조건 $f(u)\ge f(w_0)+\langle0,u-w_0\rangle=f(w_0)$. 유일성은 강볼록이어야 보장됩니다.` },
      { sec: '12.1b', type: 'num', lv: 1, q: R`$\lVert x\rVert=3$일 때 로지스틱 손실 $w\mapsto\ln(1+e^{-y\langle w,x\rangle})$의 립시츠 상수(최소)는?`, ans: '3', ansTex: R`1\cdot\lVert x\rVert=3`,
        sol: R`$\ln(1+e^{-z})$는 1-립시츠(도함수 절댓값 $<1$), 선형 합성으로 $\lVert x\rVert=3$배.` },
      { sec: '12.1b', type: 'mc', lv: 2, q: R`$\mathbb R$ 위의 $f(x)=x^2$에 대해 옳은 것은?`,
        choices: [R`2-립시츠이다`, R`립시츠가 아니지만 $[-B,B]$ 위에서는 $2B$-립시츠이다`, R`1-립시츠이다`, R`립시츠이면서 매끄럽지 않다`], ans: 1,
        sol: R`$\lvert f'(x)\rvert=2\lvert x\rvert$가 유계가 아닙니다. 유계 구간에서는 평균값 정리로 $2B$. $f$는 2-매끄럽습니다($f'$가 2-립시츠).` },
      { sec: '12.1c', type: 'num', lv: 2, q: R`$\lVert x\rVert=2$일 때 제곱 손실 $w\mapsto(\langle w,x\rangle-y)^2$의 매끄러움 상수 $\beta\lVert x\rVert^2$은?`, ans: '8', ansTex: R`2\cdot4=8`,
        sol: R`$g(a)=(a-y)^2$는 2-매끄러움($g''=2$). 합성하면 $2\lVert x\rVert^2=8$.` },
      { sec: '12.1c', type: 'num', lv: 2, q: R`$f\ge0$이 $\beta=4$-매끄럽고 $f(w)=0.5$이면 $\lVert\nabla f(w)\rVert$의 상한은?`, ans: '2', ansTex: R`\sqrt{2\cdot4\cdot0.5}=2`,
        sol: R`자기 유계성 $\lVert\nabla f\rVert^2\le2\beta f=4$, 따라서 $\le2$.` },
      { sec: '12.1c', type: 'num', lv: 2, q: R`$f(w)=w^2$ (1차원, $\beta=2$)에서 $w=1$, $v=3$일 때 이차 상한 $f(w)+f'(w)(v-w)+\frac\beta2(v-w)^2$의 값은?`, ans: '9', ansTex: R`1+2\cdot2+4=9`,
        sol: R`$1+2(2)+\frac22\cdot4=9=f(3)$. 이차함수에서는 상한이 등호입니다.` },
      { sec: '12.2', type: 'mc', lv: 2, q: R`볼록 학습 문제에 대한 설명으로 옳은 것은?`,
        choices: [R`볼록이면 언제나 학습가능하다`, R`볼록이면 ERM이 볼록 최적화라 계산은 쉽지만, 학습가능성에는 립시츠/매끄러움과 유계성 같은 추가 조건이 필요하다`, R`볼록 학습 문제는 균등수렴한다`, R`0–1 손실의 반공간 학습은 볼록 학습 문제다`], ans: 1,
        sol: R`예 12.8·12.9가 볼록성(과 유계성)만으로는 부족함을 보입니다. 0–1 손실은 볼록이 아닙니다.` },
      { sec: '12.3', type: 'num', lv: 1, q: R`마진 $y\langle w,x\rangle=0.3$일 때 힌지 손실과 0–1 손실의 차이는?`, ans: '0.7', ansTex: R`0.7-0`,
        sol: R`힌지 $=\max\{0,0.7\}=0.7$, 0–1 손실 0(맞힘). 마진이 1 미만이면 맞혀도 힌지는 벌점을 줍니다.` },
      { sec: '12.3', type: 'mc', lv: 2, q: R`대리 손실을 쓸 때 생기는 오차 항으로 **새로 더해지는** 것은?`,
        choices: [R`근사 오차`, R`추정 오차`, R`최적화 오차 (대리 손실의 최선과 0–1 손실의 최선의 차이)`, R`베이즈 오차`], ans: 2,
        sol: R`계산 가능성을 얻는 대가로 “참 목표(0–1)”와 “푼 목표(힌지)” 사이의 간격이 생깁니다.` },
      { sec: '12.1c', type: 'open', lv: 2, proof: true, q: R`$f$가 미분가능하고 $\nabla f$가 $\beta$-립시츠이면 $f(v)\le f(w)+\langle\nabla f(w),v-w\rangle+\frac\beta2\lVert v-w\rVert^2$임을 증명하세요.`,
        sol: R`
$\phi(t)=f(w+t(v-w))$. 연쇄법칙 $\phi'(t)=\langle\nabla f(w+t(v-w)),v-w\rangle$, 기본정리로 $f(v)-f(w)=\int_0^1\phi'(t)dt$.
$\langle\nabla f(w),v-w\rangle$를 빼고 더하면 $f(v)-f(w)=\langle\nabla f(w),v-w\rangle+\int_0^1\langle\nabla f(w+t(v-w))-\nabla f(w),v-w\rangle dt$.
코시–슈바르츠와 립시츠성: 적분 안 $\le\lVert\nabla f(w+t(v-w))-\nabla f(w)\rVert\lVert v-w\rVert\le\beta t\lVert v-w\rVert^2$.
$\int_0^1\beta t\lVert v-w\rVert^2dt=\frac\beta2\lVert v-w\rVert^2$.`,
        rubric: R`
- 선분 매개화와 연쇄법칙 — 3점
- 기본정리와 1차 항 분리 — 3점
- 코시–슈바르츠·립시츠로 $\beta t\lVert v-w\rVert^2$ — 3점
- 적분 계산 — 1점` },
      { sec: '12.1c', type: 'open', lv: 2, proof: true, q: R`$g:\mathbb R\to\mathbb R$이 미분가능하고 $\beta$-매끄러우면 $f(w)=g(\langle w,x\rangle+b)$가 $\beta\lVert x\rVert^2$-매끄러움을 증명하세요.`,
        sol: R`
연쇄법칙: $h(w)=\langle w,x\rangle+b$, $Dh(w)[u]=\langle u,x\rangle$이므로 $Df(w)[u]=g'(h(w))\langle u,x\rangle$, 즉 $\nabla f(w)=g'(\langle w,x\rangle+b)\,x$.
$\lVert\nabla f(v)-\nabla f(w)\rVert=\lvert g'(\langle v,x\rangle+b)-g'(\langle w,x\rangle+b)\rvert\,\lVert x\rVert$.
$g'$가 $\beta$-립시츠: $\le\beta\lvert\langle v-w,x\rangle\rvert\,\lVert x\rVert$ ($b$ 상쇄).
코시–슈바르츠: $\le\beta\lVert v-w\rVert\lVert x\rVert^2$.`,
        rubric: R`
- 기울기 $g'(\cdot)x$ 계산 — 3점
- 차이의 노름과 $g'$의 립시츠성 — 4점
- 코시–슈바르츠로 결론 — 3점` },
    ],
  });
})();
