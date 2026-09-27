/* 02 PAC 학습과 불가지 PAC — UML 3장, 강의 노트 “Bayes Optimality under 0–1 Loss”, “Bayes Optimality for Probabilistic Label Predictors”, Exercise 1 (혼합 L1–L2 손실) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 2, part: 'A', title: 'PAC 학습: 실현가능에서 불가지로', en: 'A Formal Learning Model', ref: 'UML 3장', plot: 'bayes',
    fig: R`조건부 확률 η(x) = P(y=1 | x)의 여러 모양과, 그 아래의 베이즈 오차 min{η(x), 1−η(x)}`,
    tagline: R`“확률적으로 근사적으로 맞다.” 레이블에 잡음이 있으면 오차 0은 목표가 될 수 없고, 가설 클래스 안의 최선과 겨루는 것이 목표가 됩니다.`,
    summary: R`1단원의 결론을 **PAC 학습가능성**으로 정의합니다. 모든 $\varepsilon,\delta$와 모든 실현가능한 분포에 대해 $m\ge m_\cH(\varepsilon,\delta)$개의 표본이면 확률 $1-\delta$ 이상으로 오차 $\varepsilon$ 이하를 내는 학습기가 있어야 합니다. 이어서 레이블이 $x$로 정해진다는 가정을 버리고 $(x,y)$의 결합분포 $\cD$를 쓰는 **불가지 PAC**로 넓힙니다. 이때 최선의 예측기는 **베이즈 최적 분류기** $f_\cD(x)=\one[\Prob(y=1\mid x)\ge\tfrac12]$이지만 $\cD$를 모르므로, 목표는 $\min_{h\in\cH}L_\cD(h)+\varepsilon$입니다. 마지막으로 손실함수 $\ell(h,z)$를 일반화해 회귀와 다중 클래스까지 같은 틀에 넣습니다. 강의 노트에서는 베이즈 최적성을 0–1 손실, 확률적 예측기, 혼합 $L_1$–$L_2$ 손실에 대해 각각 “점마다 최소화” 논법으로 증명했습니다.`,
    goals: [
      R`PAC 학습가능성과 표본 복잡도 $m_\cH(\varepsilon,\delta)$를 양화사 순서까지 정확히 쓸 수 있다`,
      R`실현가능 PAC와 불가지 PAC의 차이(분포, 목표, 비교 대상)를 설명할 수 있다`,
      R`베이즈 최적 분류기가 0–1 손실에서 최적임을 조건부 위험의 점별 비교로 증명할 수 있다`,
      R`확률적 예측기 $h:\cX\to[0,1]$와 손실 $\lvert h(x)-y\rvert$에서도 결정적 베이즈 규칙이 최적임을 보일 수 있다`,
      R`혼합 손실 $\alpha\lvert t-y\rvert+(1-\alpha)(t-y)^2$의 베이즈 최적 예측기를 구간 사영으로 구할 수 있다`,
    ],
    secTitles: { '3.1': 'PAC 학습', '3.2': '불가지 PAC', '3.2b': '일반 손실', '3.2c': '베이즈 최적', '3.2d': '확률적 예측기' },
    sections: [
      { k: '3.1', p: 43, title: 'PAC 학습가능성', body: R`
1단원의 유한 클래스 정리는 두 모수 $\varepsilon$(정확도), $\delta$(신뢰도)로 표본 수를 정했습니다. 이를 가설 클래스의 성질로 정의합니다.

:::def PAC 학습가능성 (실현가능 설정)
가설 클래스 $\cH$가 **PAC 학습가능**하다는 것은 함수 $m_\cH:(0,1)^2\to\mathbb N$과 학습 알고리즘 $A$가 있어서 다음이 성립하는 것이다.

모든 $\varepsilon,\delta\in(0,1)$, 모든 분포 $\cD$(정의역 위), 모든 레이블 함수 $f:\cX\to\{0,1\}$에 대해 **실현가능성**이 성립하면, $m\ge m_\cH(\varepsilon,\delta)$개의 i.i.d. 표본으로 $A$를 돌렸을 때 확률 $1-\delta$ 이상(표본의 무작위성에 대해)으로
$$L_{\cD,f}\big(A(S)\big)\le\varepsilon.$$
:::

**표본 복잡도**는 이 성질을 만족하는 가장 작은 $m_\cH$로 정의합니다. 양화사의 순서가 핵심입니다: $m_\cH$는 $\varepsilon,\delta$에만 기대고 **$\cD$와 $f$에는 기대지 않습니다**. 어떤 분포가 와도 같은 표본 수로 충분해야 합니다.

:::key 유한 클래스는 PAC 학습가능
유한 가설 클래스는 PAC 학습가능하고
$$m_\cH(\varepsilon,\delta)\le\left\lceil\frac{\ln(\lvert\cH\rvert/\delta)}{\varepsilon}\right\rceil.$$
학습기는 ERM으로 충분하다.
:::

:::note 이름의 두 층
**P**robably(확률 $1-\delta$) **A**pproximately(오차 $\varepsilon$) **C**orrect. 1단원 끝에서 본 두 층이 그대로 정의에 들어가 있습니다.
:::
` },
      { k: '3.2', p: 45, title: '실현가능성을 버리기: 불가지 PAC', body: R`
현실에서는 같은 $x$에 다른 레이블이 붙기도 합니다(같은 색·단단함의 파파야도 맛이 다를 수 있음). 그래서 $\cD$를 $\cX\times\cY$ 위의 **결합분포**로 바꿉니다. $x$의 주변분포 $\cD_x$와 조건부 분포 $\cD((x,y)\mid x)$로 나눠 생각할 수 있습니다.

$$L_\cD(h):=\Prob_{(x,y)\sim\cD}[h(x)\ne y],\qquad L_S(h)=\frac1m\lvert\{i:h(x_i)\ne y_i\}\rvert.$$

:::def 불가지 PAC 학습가능성
$\cH$가 **불가지(agnostic) PAC 학습가능**하다는 것은 $m_\cH:(0,1)^2\to\mathbb N$과 $A$가 있어서, 모든 $\varepsilon,\delta\in(0,1)$와 $\cX\times\cY$ 위의 **모든** 분포 $\cD$에 대해 $m\ge m_\cH(\varepsilon,\delta)$이면 확률 $1-\delta$ 이상으로
$$L_\cD\big(A(S)\big)\le\min_{h'\in\cH}L_\cD(h')+\varepsilon.$$
:::

실현가능하면 $\min_{h'}L_\cD(h')=0$이라 PAC 정의로 돌아갑니다. 불가지 설정의 목표는 “오차가 작다”가 아니라 **“클래스 안의 최선보다 $\varepsilon$ 이상 나쁘지 않다”**입니다. 잡음이 많은 문제에서는 최선도 오차가 클 수 있기 때문입니다.

:::warn 비교 대상은 베이즈 최적이 아니다
불가지 PAC는 $\cH$ 안의 최선과 겨룹니다. $\cH$ 밖의 모든 함수(베이즈 최적 분류기 포함)와 겨루는 것은 사전 지식 없이 불가능하다는 것이 4단원의 공짜 점심은 없다 정리입니다.
:::
` },
      { k: '3.2b', p: 47, title: '일반 손실함수로 넓히기', body: R`
회귀나 다중 클래스 문제도 같은 틀에 넣기 위해 예제 공간을 $\cZ$($=\cX\times\cY$ 또는 그 밖의 집합)로 두고 손실함수를 일반화합니다.

:::def 손실함수와 위험
손실함수 $\ell:\cH\times\cZ\to\mathbb R_+$에 대해
$$L_\cD(h):=\E_{z\sim\cD}\big[\ell(h,z)\big],\qquad L_S(h):=\frac1m\sum_{i=1}^m\ell(h,z_i).$$
:::

| 문제 | $\cY$ | 손실 $\ell(h,(x,y))$ |
|---|---|---|
| 이진·다중 분류 | 유한 집합 | 0–1 손실 $\one[h(x)\ne y]$ |
| 회귀 | $\mathbb R$ | 제곱 손실 $(h(x)-y)^2$ |
| 확률 예측 | $\{0,1\}$ | 절대 손실 $\lvert h(x)-y\rvert$ ($h(x)\in[0,1]$) |

:::key 일반 손실의 불가지 PAC
$\cH$가 $\cZ$와 손실 $\ell$에 대해 불가지 PAC 학습가능하다는 것은 $m_\cH$와 $A$가 있어 모든 $\varepsilon,\delta\in(0,1)$와 $\cZ$ 위의 모든 $\cD$에 대해 $m\ge m_\cH(\varepsilon,\delta)$이면 확률 $1-\delta$ 이상으로
$$L_\cD\big(A(S)\big)\le\min_{h'\in\cH}L_\cD(h')+\varepsilon.$$
:::

강의 노트는 이 정의에 필요한 가정을 따로 적어 둡니다: 표본은 i.i.d.이고($S\sim\cD^m$), $z\mapsto\ell(h,z)$가 가측이어서 $L_\cD(h)$가 잘 정의되며, ERM의 동점은 고정된 규칙으로 깨서 $A(S)$가 $S$의 함수가 됩니다. 시험 답안에서 “정의에 따라”라고 쓸 때 이 가정들이 조용히 쓰이고 있습니다.
` },
      { k: '3.2c', p: 46, src: '강의 노트 · Exercise 3.7', title: '베이즈 최적 분류기', body: R`
$\cD$를 안다면 무엇이 최선일까요? $\eta(x):=\Prob(y=1\mid x)$(조건부 확률)라 두면 답은 간단합니다.

:::key 베이즈 최적 분류기
$$f_\cD(x)=\begin{cases}1&\eta(x)\ge\tfrac12\\0&\text{그 밖}\end{cases}\qquad\Longrightarrow\qquad L_\cD(f_\cD)\le L_\cD(g)\quad\text{(모든 분류기 }g:\cX\to\{0,1\}\text{)}$$
최소 위험(베이즈 위험)은 $L_\cD(f_\cD)=\E_x\big[\min\{\eta(x),1-\eta(x)\}\big]$.
:::

:::hand 강의 노트 — 점마다 비교하기
조건부 기댓값의 탑 성질로 $L_\cD(g)=\E\big[\Prob(g(X)\ne Y\mid X)\big]$. $X=x$를 고정하면 $g(x)$는 0 또는 1이므로

- $g(x)=1$이면 틀릴 확률은 $\Prob(Y=0\mid X=x)=1-\eta(x)$,
- $g(x)=0$이면 틀릴 확률은 $\eta(x)$.

어느 쪽이든 $\Prob(g(X)\ne Y\mid X=x)\ge\min\{\eta(x),1-\eta(x)\}$이고, $f_\cD$는 바로 작은 쪽을 고르므로 등호가 성립합니다. 모든 $x$에서 $f_\cD$가 이기므로 $X$에 대해 기댓값을 취해도 이깁니다.
:::

:::ex 예제 1
$x\in\{a,b,c\}$가 각각 확률 $0.5,0.3,0.2$이고 $\eta(a)=0.9$, $\eta(b)=0.4$, $\eta(c)=0.5$. 베이즈 분류기와 베이즈 위험은?
---
$f_\cD(a)=1$, $f_\cD(b)=0$, $f_\cD(c)=1$($\ge\tfrac12$이므로; 0을 골라도 위험은 같음).
위험 $=0.5\cdot0.1+0.3\cdot0.4+0.2\cdot0.5=0.05+0.12+0.10=0.27$.
:::
` },
      { k: '3.2d', p: 51, src: '강의 노트 · Exercise 3.8, Exercise 1', title: '확률적 예측기와 혼합 손실', body: R`
예측기가 $h:\cX\to[0,1]$이고 “확률 $h(x)$로 1을 내놓는다”고 해석하면, 무작위 출력이 $y$와 다를 확률은 $\lvert h(x)-y\rvert$입니다($y=1$이면 $1-h(x)$, $y=0$이면 $h(x)$). 무작위성을 허용하면 더 나아질까요?

:::key 확률적 예측기의 베이즈 최적성
손실 $\ell(h,(x,y))=\lvert h(x)-y\rvert$에서 모든 $h:\cX\to[0,1]$에 대해 $L_\cD(f_\cD)\le L_\cD(h)$. 무작위 예측은 결정적 베이즈 규칙을 이기지 못한다.
:::

$x$를 고정하고 $t=h(x)$로 두면 조건부 위험은 $\phi_x(t)=\eta(1-t)+(1-\eta)t=\eta+t(1-2\eta)$로 **$t$의 일차함수**입니다. 일차함수의 최솟값은 구간 끝점에서 나오므로 $t\in\{0,1\}$ 중 하나 — 결정적 규칙 — 가 최적입니다.

강의 노트의 Exercise 1은 두 손실을 섞습니다. $\alpha\in[0,1]$에 대해
$$\ell_\alpha(t,y)=\alpha\lvert t-y\rvert+(1-\alpha)(t-y)^2.$$

:::key 혼합 손실의 베이즈 최적 예측기
$\alpha\in[0,1)$이면
$$h_\alpha(x)=\Pi_{[0,1]}\!\left(\frac{2\eta(x)-\alpha}{2(1-\alpha)}\right)=\begin{cases}0&\eta(x)\le\alpha/2\\[2pt]\dfrac{2\eta(x)-\alpha}{2(1-\alpha)}&\alpha/2<\eta(x)<1-\alpha/2\\[4pt]1&\eta(x)\ge1-\alpha/2\end{cases}$$
이고, $\alpha=1$이면 $h_1(x)=\one[\eta(x)\ge\tfrac12]$. 여기서 $\Pi_{[0,1]}(z)=\min\{1,\max\{0,z\}\}$.
:::

양 끝이 두 극단입니다. $\alpha=0$(제곱 손실)이면 $h_0=\eta$ — **조건부 평균**을 그대로 말하는 것이 최선이고, $\alpha=1$(절대 손실)이면 반올림한 결정적 규칙이 최선입니다. 그 사이에서는 $\eta$가 극단에 가까우면 0이나 1로 “잘라 내고”, 중간이면 $\eta$를 늘여서 말합니다.

:::ex 예제 2
$\alpha=\tfrac12$, $\eta(x)=0.7$일 때 $h_\alpha(x)$는?
---
$\frac{2(0.7)-0.5}{2(0.5)}=0.9$이고 $[0,1]$ 안이므로 $h_\alpha(x)=0.9$. 조건부 위험 $\phi(t)=\eta+(\alpha-2\eta)t+(1-\alpha)t^2=0.7-0.9t+0.5t^2$의 꼭짓점 $t=0.9$와 같습니다.
:::
` },
    ],
    problems: [
      { sec: '3.1', type: 'mc', lv: 1, q: R`PAC 학습가능성의 정의에서 표본 복잡도 $m_\cH(\varepsilon,\delta)$가 **기대지 않는** 것은?`,
        choices: [R`정확도 $\varepsilon$`, R`신뢰도 $\delta$`, R`분포 $\cD$와 레이블 함수 $f$`, R`가설 클래스 $\cH$`], ans: 2,
        sol: R`$m_\cH$는 클래스마다 정해지는 함수로 $\varepsilon,\delta$만 입력받습니다. 모든 실현가능한 $(\cD,f)$에 대해 같은 표본 수로 충분해야 합니다.` },
      { sec: '3.1', type: 'num', lv: 1, q: R`$\lvert\cH\rvert=3^{10}$, $\varepsilon=0.1$, $\delta=0.1$인 실현가능 설정에서 유한 클래스 상한 $\lceil\ln(\lvert\cH\rvert/\delta)/\varepsilon\rceil$은?`, ans: '133', ansTex: R`\lceil 10(10\ln3+\ln10)\rceil=133`,
        sol: R`$10\ln3=10.986$, $\ln10=2.303$, 합 $13.289$, $\div0.1=132.9$이므로 133.` },
      { sec: '3.2', type: 'mc', lv: 2, q: R`불가지 PAC 학습에서 학습기가 보장해야 하는 것은?`,
        choices: [R`$L_\cD(A(S))\le\varepsilon$`, R`$L_\cD(A(S))\le L_\cD(f_\cD)+\varepsilon$ ($f_\cD$는 베이즈 최적)`, R`$L_\cD(A(S))\le\min_{h\in\cH}L_\cD(h)+\varepsilon$`, R`$L_S(A(S))=0$`], ans: 2,
        sol: R`비교 대상은 클래스 안의 최선입니다. 실현가능하면 첫째 보기로 줄어듭니다. 베이즈 최적과의 비교는 사전 지식 없이는 불가능합니다.` },
      { sec: '3.2', type: 'mc', lv: 2, q: R`결합분포 $\cD$에서 $\Prob(y=1\mid x)=0.8$인 점들로만 이루어진 문제(모든 $x$에서 같음)가 있다. $\cH$가 상수 분류기 $\{h\equiv0,h\equiv1\}$일 때 $\min_{h\in\cH}L_\cD(h)$는?`,
        choices: [R`0`, R`0.2`, R`0.5`, R`0.8`], ans: 1,
        sol: R`$h\equiv1$의 위험은 $\Prob(y=0)=0.2$, $h\equiv0$은 0.8. 레이블 잡음 때문에 최선도 0.2이고, 불가지 PAC는 이 0.2에 $\varepsilon$ 이내로 다가가는 것을 요구합니다.` },
      { sec: '3.2b', type: 'mc', lv: 1, q: R`예측 $h(x)=2.5$, 정답 $y=4$일 때 제곱 손실과 0–1 손실은?`,
        choices: [R`$2.25$와 $1$`, R`$1.5$와 $1$`, R`$2.25$와 $0$`, R`$6.25$와 $1$`], ans: 0,
        sol: R`$(2.5-4)^2=2.25$, $h(x)\ne y$이므로 0–1 손실은 1. 회귀에서 0–1 손실은 거의 항상 1이라 쓸모가 없습니다.` },
      { sec: '3.2c', type: 'num', lv: 2, q: R`$x\in\{a,b\}$가 각각 확률 $0.6,0.4$이고 $\eta(a)=0.3$, $\eta(b)=0.85$일 때 베이즈 위험은?`, ans: '0.24', ansTex: R`0.6(0.3)+0.4(0.15)=0.24`,
        sol: R`$\E[\min\{\eta,1-\eta\}]=0.6\cdot0.3+0.4\cdot0.15=0.18+0.06=0.24$.` },
      { sec: '3.2c', type: 'num', lv: 2, q: R`위 문제에서 늘 1을 내놓는 분류기의 위험에서 베이즈 위험을 빼면?`, ans: '0.24', ansTex: R`0.48-0.24=0.24`,
        sol: R`$h\equiv1$의 위험 $=\E[1-\eta]=0.6(0.7)+0.4(0.15)=0.42+0.06=0.48$. 차이는 $0.24$로, $a$에서 잘못 고른 대가 $0.6(0.7-0.3)$입니다.` },
      { sec: '3.2d', type: 'mc', lv: 2, q: R`손실 $\lvert h(x)-y\rvert$에서 $\eta(x)=0.6$인 점의 조건부 위험 $\phi(t)=\eta+t(1-2\eta)$를 최소로 하는 $t\in[0,1]$는?`,
        choices: [R`$t=0$`, R`$t=0.6$`, R`$t=1$`, R`모든 $t$`], ans: 2,
        sol: R`$1-2\eta=-0.2<0$이라 $\phi$는 감소함수이므로 $t=1$. $\eta$를 그대로 말하는 $t=0.6$은 $\phi=0.48$로 $t=1$의 $0.4$보다 나쁩니다.` },
      { sec: '3.2d', type: 'num', lv: 2, q: R`혼합 손실에서 $\alpha=0.4$, $\eta(x)=0.5$일 때 베이즈 최적 예측값 $h_\alpha(x)$는?`, ans: '0.5', ansTex: R`\tfrac{1-0.4}{1.2}=0.5`,
        sol: R`$\frac{2(0.5)-0.4}{2(0.6)}=\frac{0.6}{1.2}=0.5$. $\eta=\tfrac12$은 대칭점이라 모든 $\alpha<1$에서 $\tfrac12$입니다.` },
      { sec: '3.2d', type: 'num', lv: 3, q: R`혼합 손실에서 $\alpha=0.6$일 때 $h_\alpha(x)=1$이 되는 $\eta(x)$의 최솟값은?`, ans: '0.7', ansTex: R`1-\alpha/2=0.7`,
        sol: R`$\frac{2\eta-\alpha}{2(1-\alpha)}\ge1\iff2\eta\ge2-\alpha\iff\eta\ge1-\alpha/2=0.7$.` },
      { sec: '3.2c', type: 'open', lv: 2, proof: true, q: R`$\eta(x)=\Prob(Y=1\mid X=x)$라 할 때 베이즈 분류기 $f_\cD(x)=\one[\eta(x)\ge\tfrac12]$가 모든 분류기 $g:\cX\to\{0,1\}$보다 0–1 위험이 작거나 같음을 증명하고, 베이즈 위험이 $\E[\min\{\eta(X),1-\eta(X)\}]$임을 보이세요.`,
        sol: R`
탑 성질로 $L_\cD(g)=\E[\one\{g(X)\ne Y\}]=\E\big[\Prob(g(X)\ne Y\mid X)\big]$.
$x$를 고정: $g(x)=1$이면 $\Prob(g(X)\ne Y\mid X=x)=1-\eta(x)$, $g(x)=0$이면 $\eta(x)$. 따라서 조건부 오차 $\ge\min\{\eta(x),1-\eta(x)\}$.
$f_\cD$는 $\eta\ge\tfrac12$일 때 1을 골라 $1-\eta=\min$, $\eta<\tfrac12$일 때 0을 골라 $\eta=\min$을 얻습니다. 즉 $\Prob(f_\cD(X)\ne Y\mid X=x)=\min\{\eta(x),1-\eta(x)\}\le\Prob(g(X)\ne Y\mid X=x)$.
모든 $x$에서 성립하므로 기댓값을 취하면 $L_\cD(f_\cD)=\E[\min\{\eta,1-\eta\}]\le L_\cD(g)$.`,
        rubric: R`
- 탑 성질로 조건부 오차의 기댓값 표현 — 3점
- $g(x)$의 두 경우와 하한 $\min\{\eta,1-\eta\}$ — 3점
- $f_\cD$가 등호를 이룸 — 2점
- 기댓값으로 결론과 베이즈 위험 식 — 2점` },
      { sec: '3.2d', type: 'open', lv: 3, proof: true, q: R`$\alpha\in[0,1)$에 대해 손실 $\ell_\alpha(t,y)=\alpha\lvert t-y\rvert+(1-\alpha)(t-y)^2$ ($t\in[0,1]$, $y\in\{0,1\}$)의 베이즈 최적 예측기가 $\Pi_{[0,1]}\big((2\eta(x)-\alpha)/(2(1-\alpha))\big)$임을 유도하세요.`,
        sol: R`
$x$를 고정하고 $\eta=\eta(x)$. $t\in[0,1]$이면 $\lvert t-1\rvert=1-t$, $\lvert t\rvert=t$이므로
$$\phi(t)=\E[\ell_\alpha(t,Y)\mid X=x]=\alpha\big[\eta(1-t)+(1-\eta)t\big]+(1-\alpha)\big[\eta(1-t)^2+(1-\eta)t^2\big].$$
정리하면 $\eta(1-t)+(1-\eta)t=\eta+t(1-2\eta)$, $\eta(1-t)^2+(1-\eta)t^2=\eta-2\eta t+t^2$이므로
$$\phi(t)=\eta+(\alpha-2\eta)t+(1-\alpha)t^2.$$
$\alpha<1$이면 볼록 이차식이고 $\phi'(t)=\alpha-2\eta+2(1-\alpha)t=0\iff t^\ast=\frac{2\eta-\alpha}{2(1-\alpha)}$.
볼록 이차식을 구간 $[0,1]$에서 최소로 하는 점은 꼭짓점을 구간에 사영한 점입니다(꼭짓점이 왼쪽 밖이면 $\phi$는 $[0,1]$에서 증가해 $t=0$, 오른쪽 밖이면 감소해 $t=1$). 점마다 조건부 위험을 최소로 하므로 기댓값도 최소 — 베이즈 최적입니다.`,
        rubric: R`
- 조건부 위험을 $\eta$로 전개 — 3점
- $\phi(t)=\eta+(\alpha-2\eta)t+(1-\alpha)t^2$로 정리 — 3점
- 꼭짓점과 구간 사영 논증 — 3점
- 점별 최소 ⇒ 전체 최소 — 1점` },
    ],
  });
})();
