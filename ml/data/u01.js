/* 01 학습의 첫걸음: 통계적 학습의 틀과 ERM — UML 2장, 강의 노트 “Realizability, Consistent Learners, and the Misleading Samples Bound” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 1, part: 'A', title: '학습의 첫걸음: ERM과 유한 가설 클래스', en: 'A Gentle Start', ref: 'UML 2장', plot: 'finite',
    fig: R`가설 클래스의 크기 |H|가 10, 100, 1000, 10⁶일 때 표본 수 m에 따라 줄어드는 오차 상한 ε = ln(|H|/δ)/m`,
    tagline: R`훈련 오차를 0으로 만드는 것은 쉽습니다. 가설 클래스를 먼저 정해 두어야 그 0이 참 오차에 대해 무언가를 말해 줍니다.`,
    summary: R`학습 문제를 **정의역** $\cX$, **레이블 집합** $\cY$, 분포 $\cD$, 레이블 함수 $f$로 적고, 학습기의 성공을 **참 위험** $L_{\cD,f}(h)=\Prob_{x\sim\cD}[h(x)\ne f(x)]$로 잽니다. 학습기가 볼 수 있는 것은 표본 $S$뿐이라 **경험적 위험** $L_S(h)$를 최소로 하는 **ERM**을 쓰는데, 아무 함수나 허용하면 표본을 외우기만 하는 예측기가 과적합합니다. 그래서 미리 **가설 클래스** $\cH$를 정하는 **귀납적 편향**이 필요하고, $\cH$가 유한하고 실현가능하면 $m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon$개의 표본으로 확률 $1-\delta$ 이상 $L_{\cD,f}(h_S)\le\varepsilon$입니다. 강의 노트는 이 증명의 첫 단계인 “실패 사건 ⊆ 오도 표본의 합집합”을 실현가능성과 **일관성**을 구분해 엄밀하게 적었습니다.`,
    goals: [
      R`정의역·레이블·분포·레이블 함수·참 위험·경험적 위험을 기호로 정확히 쓸 수 있다`,
      R`외우기 예측기로 ERM이 과적합하는 예를 만들고 참 위험을 계산할 수 있다`,
      R`실현가능성 가정과 일관 학습기의 차이를 반례로 설명할 수 있다`,
      R`나쁜 가설과 오도 표본을 정의하고 실패 사건이 오도 표본의 합집합에 포함됨을 보일 수 있다`,
      R`합집합 상한과 $1-\varepsilon\le e^{-\varepsilon}$로 유한 클래스의 표본 복잡도 $\ln(\lvert\cH\rvert/\delta)/\varepsilon$을 유도할 수 있다`,
    ],
    secTitles: { '2.1': '학습의 틀', '2.2': 'ERM과 과적합', '2.3': '귀납적 편향', '2.3b': '오도 표본', '2.3c': '유한 클래스' },
    sections: [
      { k: '2.1', p: 33, title: '통계적 학습의 틀', body: R`
열대 과일 가게에서 파파야가 맛있는지를 **색**과 **단단함** 두 값만 보고 맞히는 문제를 생각합니다. 이 장면을 수학으로 옮기면 다음과 같습니다.

:::def 학습 문제의 구성 요소
- **정의역** $\cX$: 예측할 대상의 집합. 보통 특징 벡터 $x\in\mathbb R^d$로 적습니다. 파파야라면 $x=(\text{색},\text{단단함})\in[0,1]^2$.
- **레이블 집합** $\cY$: 이 장에서는 $\{0,1\}$(맛없음/맛있음).
- **훈련 자료** $S=((x_1,y_1),\dots,(x_m,y_m))$: 학습기가 받는 유일한 입력.
- **학습기의 출력**: 예측 규칙 $h:\cX\to\cY$. 가설(hypothesis) 또는 분류기라고도 부릅니다. $A(S)$로 적습니다.
- **자료 생성 모형**: $x$는 알 수 없는 분포 $\cD$에서 뽑히고, 정답은 알 수 없는 **레이블 함수** $f:\cX\to\cY$가 정합니다: $y_i=f(x_i)$.
:::

학습기는 $\cD$도 $f$도 모릅니다. 그래도 성공을 재는 기준은 둘 다에 달려 있습니다.

:::key 참 위험
$$L_{\cD,f}(h):=\Prob_{x\sim\cD}\big[h(x)\ne f(x)\big]=\cD\big(\{x:h(x)\ne f(x)\}\big)$$
새 예제 하나를 $\cD$에서 뽑았을 때 $h$가 틀릴 확률입니다. 일반화 오차, 참 오차라고도 부릅니다.
:::

:::note 표기 한 가지
$\cD(A)$는 “$x\sim\cD$일 때 $x\in A$일 확률”입니다. $A$를 함수 $\pi:\cX\to\{0,1\}$의 1이 되는 집합 $\{x:\pi(x)=1\}$으로 보면 $\Prob_{x\sim\cD}[\pi(x)]$로 쓰기도 합니다. 교재는 두 표기를 섞어 씁니다.
:::
` },
      { k: '2.2', p: 35, title: 'ERM과 과적합', body: R`
학습기는 $\cD$와 $f$를 모르므로 참 위험을 계산할 수 없습니다. 대신 표본 위의 오차를 잽니다.

:::key 경험적 위험과 ERM
$$L_S(h):=\frac{\lvert\{i\in[m]:h(x_i)\ne y_i\}\rvert}{m}$$
$L_S(h)$를 최소로 하는 $h$를 고르는 규칙을 **경험적 위험 최소화**(Empirical Risk Minimization, ERM)라 합니다.
:::

$L_S$는 “표본이 보여 준 세계”에서의 오차이고, $L_{\cD,f}$는 “실제 세계”의 오차입니다. 둘이 가깝다는 보장이 없으면 ERM은 위험합니다.

:::ex 예제 1 — 외우기 예측기
$\cD$는 한 변이 2인 정사각형 $[0,2]^2$(넓이 4) 위의 균등분포이고, $f(x)=1$은 가운데의 한 변이 1인 정사각형(넓이 1) 안일 때뿐입니다. 표본 $S$를 받으면
$$h_S(x)=\begin{cases}y_i&\text{어떤 }i\text{에 대해 }x=x_i\\0&\text{그 밖}\end{cases}$$
를 내놓는 학습기의 경험적 위험과 참 위험은?
---
표본점에서는 정답을 그대로 내놓으므로 $L_S(h_S)=0$. ERM이 고를 수 있는 최선의 값입니다.
그런데 연속분포에서 새 $x$가 유한 개의 표본점 중 하나와 같을 확률은 0이므로, 거의 모든 $x$에서 $h_S(x)=0$입니다. $h_S$가 틀리는 곳은 가운데 정사각형 전체이고 확률은 $1/4$. 따라서 $L_{\cD,f}(h_S)=\tfrac14$.
표본이 아무리 많아도 이 값은 줄지 않습니다. 훈련 오차는 완벽하지만 아무것도 배우지 않았습니다. 이것이 **과적합**입니다.
:::

:::warn 무엇이 잘못되었나
ERM 자체가 아니라 “어떤 함수든 고를 수 있다”는 자유가 문제입니다. 다음 절의 처방은 ERM을 미리 정한 함수 집합 안으로 제한하는 것입니다.
:::
` },
      { k: '2.3', p: 36, title: '귀납적 편향: 가설 클래스로 ERM 제한하기', body: R`
표본을 보기 **전에** 예측기의 후보를 모은 집합 $\cH\subseteq\cY^{\cX}$를 정해 둡니다. 이를 **가설 클래스**라 하고, 그 안에서 ERM을 합니다.

:::key 가설 클래스 위의 ERM
$$\ERM_\cH(S)\in\argmin_{h\in\cH}L_S(h)$$
동점이면 미리 정한 규칙(예: 번호가 가장 작은 것)으로 하나를 고릅니다. 이렇게 해야 출력 $h_S$가 $S$의 함수로 잘 정의됩니다.
:::

이 제한을 **귀납적 편향**(inductive bias)이라 부릅니다. 파파야 예에서 “맛있는 파파야는 색과 단단함 평면의 축에 나란한 직사각형 안에 있다”고 믿고 $\cH$를 직사각형 분류기들로 정하는 것이 그 예입니다. 제한이 셀수록 과적합은 줄지만, 참 $f$에서 멀어질 위험(편향)은 커집니다. 이 줄다리기는 5장에서 **근사 오차**와 **추정 오차**로 정식화합니다.

이 장의 분석에는 두 가정이 필요합니다.

:::def 실현가능성과 i.i.d. 가정
- **실현가능성**(realizability): $L_{\cD,f}(h^\star)=0$인 $h^\star\in\cH$가 있다.
- **i.i.d.**: 표본의 $x_1,\dots,x_m$은 $\cD$에서 서로 독립으로 뽑히고 $y_i=f(x_i)$. 이를 $S\sim\cD^m$으로 적습니다.
:::

실현가능성에서 $h^\star$는 확률 1로 모든 표본점에서 맞히므로 $L_S(h^\star)=0$이고, 따라서 ERM의 출력도 $L_S(h_S)=0$입니다. 이 “따라서”가 무엇에 기대는지가 다음 절의 주제입니다.
` },
      { k: '2.3b', p: 37, src: '강의 노트 · Eq. (2.7)', title: '나쁜 가설과 오도 표본', body: R`
$\varepsilon\in(0,1)$을 정확도 기준으로 정합니다. 실패란 $L_{\cD,f}(h_S)>\varepsilon$인 것입니다.

:::def 나쁜 가설, 오도 표본
$$\cH_B:=\{h\in\cH:L_{\cD,f}(h)>\varepsilon\},\qquad M:=\{S|_x\in\cX^m:\exists h\in\cH_B,\ L_S(h)=0\}$$
$S|_x=(x_1,\dots,x_m)$은 표본의 입력 부분이고 레이블은 $y_i=f(x_i)$로 정해집니다. $M$은 “어떤 나쁜 가설이 표본에서는 완벽해 보이는” 표본들입니다.
:::

:::hand 강의 노트 — 실현가능성만으로는 부족합니다
실현가능성은 $L_S(h^\star)=0$인 $h^\star$가 **있다**는 것만 말합니다. 학습기가 그것을 찾는다는 보장은 없습니다. 예: $\cH=\{h_0\equiv0,\ h_1\equiv1\}$, $f\equiv0$이면 $h_0$이 실현하지만, 표본을 무시하고 늘 $h_1$을 내놓는 학습기는 모든 표본에서 $L_S(h_S)=1$입니다.

그래서 학습기에 조건을 붙입니다. 학습기 $A$가 $\cH$에 대해 **일관**(consistent)이라는 것은, $L_S(h)=0$인 $h\in\cH$가 있는 모든 표본 $S$에서 $L_S(A(S))=0$인 것입니다. ERM은 일관입니다. **실현가능성 + 일관성**이면 확률 1로 $L_S(h_S)=0$입니다.
:::

:::key 오도 표본 포함 관계
실현가능하고 학습기가 일관이면
$$\{S|_x:L_{\cD,f}(h_S)>\varepsilon\}\subseteq M=\bigcup_{h\in\cH_B}\{S|_x:L_S(h)=0\},$$
따라서 $\cD^m\big(\{S|_x:L_{\cD,f}(h_S)>\varepsilon\}\big)\le\cD^m\Big(\bigcup_{h\in\cH_B}\{S|_x:L_S(h)=0\}\Big)$.
:::

포함 관계의 요지: 실패하면 $h_S$ 자신이 나쁜 가설이면서 $L_S(h_S)=0$이므로, 그 표본은 바로 오도 표본입니다. 합집합 표현은 $M$의 정의 “$\exists h\in\cH_B$”를 집합으로 옮긴 것입니다.
` },
      { k: '2.3c', p: 39, title: '유한 가설 클래스는 PAC로 배울 수 있다', body: R`
합집합의 확률은 확률의 합을 넘지 않습니다(**합집합 상한**, union bound). 나쁜 가설 하나 $h\in\cH_B$가 표본 전체를 맞힐 확률은 각 점에서 맞힐 확률 $1-L_{\cD,f}(h)<1-\varepsilon$의 $m$제곱입니다.

$$\cD^m\big(\{S|_x:L_S(h)=0\}\big)=\prod_{i=1}^m\Prob_{x_i\sim\cD}[h(x_i)=f(x_i)]=\big(1-L_{\cD,f}(h)\big)^m\le(1-\varepsilon)^m\le e^{-\varepsilon m}.$$

마지막 부등호는 모든 실수 $t$에서 $1-t\le e^{-t}$이기 때문입니다(볼록함수 $e^{-t}$는 $t=0$의 접선 $1-t$ 위에 있음). 합집합 상한과 합치면
$$\cD^m\big(\{S|_x:L_{\cD,f}(h_S)>\varepsilon\}\big)\le\lvert\cH_B\rvert e^{-\varepsilon m}\le\lvert\cH\rvert e^{-\varepsilon m}.$$

:::key 유한 가설 클래스의 표본 복잡도
$\cH$가 유한하고 실현가능하며 $\delta,\varepsilon\in(0,1)$일 때
$$m\ge\frac{\ln(\lvert\cH\rvert/\delta)}{\varepsilon}$$
이면, 모든 $\cD,f$에 대해 확률 $1-\delta$ 이상으로 모든 ERM 가설이 $L_{\cD,f}(h_S)\le\varepsilon$을 만족한다.
:::

:::ex 예제 2 — 숫자로 읽기
$\lvert\cH\rvert=2^{20}$(약 백만 개의 규칙), $\varepsilon=0.01$, $\delta=0.05$이면 필요한 표본 수는?
---
$m\ge\dfrac{\ln(2^{20}/0.05)}{0.01}=100\,(20\ln2+\ln20)\approx100\,(13.86+3.00)=1686$. 가설이 백만 개라도 표본 수는 $\ln\lvert\cH\rvert$에 비례하므로 약 1700개면 충분합니다.
:::

:::tip 식을 읽는 법
$\varepsilon$(정확도)은 $1/\varepsilon$으로, $\delta$(신뢰도)와 $\lvert\cH\rvert$(복잡도)는 로그로 들어갑니다. 정확도를 10배 높이는 것은 표본을 10배 늘려야 하지만, 가설을 10배 늘리는 것은 $\ln10\approx2.3$을 더할 뿐입니다. 이 비대칭이 이후 모든 표본 복잡도 식의 모양입니다.
:::

:::note 확률과 근사의 두 층
결론은 “**확률적으로**(1−δ) **근사적으로**(ε) 맞다”입니다. 표본이 우연히 나쁠 수 있으니 확실성은 줄 수 없고, 유한한 표본으로는 $f$를 정확히 복원할 수 없으니 오차 0도 줄 수 없습니다. 이 두 층이 다음 단원의 PAC(Probably Approximately Correct) 정의입니다.
:::
` },
    ],
    problems: [
      { sec: '2.1', type: 'mc', lv: 1, q: R`참 위험 $L_{\cD,f}(h)$에 대한 설명으로 옳은 것은?`,
        choices: [R`표본 $S$에서 $h$가 틀린 비율이다`, R`$\cD$에서 새로 뽑은 $x$에서 $h(x)\ne f(x)$일 확률이다`, R`$\cH$ 안에서 가장 작은 경험적 위험이다`, R`학습기가 직접 계산해 최소로 만들 수 있는 양이다`], ans: 1,
        sol: R`$L_{\cD,f}(h)=\Prob_{x\sim\cD}[h(x)\ne f(x)]$. 학습기는 $\cD$와 $f$를 모르므로 계산할 수 없고, 표본에서 계산하는 것은 $L_S(h)$입니다.` },
      { sec: '2.1', type: 'num', lv: 1, q: R`$\cD$는 $[0,1]$ 위의 균등분포, $f(x)=\one[x<0.3]$, $h(x)=\one[x<0.45]$일 때 $L_{\cD,f}(h)$는?`, ans: '0.15', ansTex: R`0.15`,
        sol: R`두 함수가 다른 곳은 $0.3\le x<0.45$이고 그 확률은 길이 $0.15$입니다.` },
      { sec: '2.2', type: 'num', lv: 1, q: R`표본 10개 중 $h$가 3개를 틀렸다. $L_S(h)$는?`, ans: '0.3', ansTex: R`0.3`,
        sol: R`$L_S(h)=\lvert\{i:h(x_i)\ne y_i\}\rvert/m=3/10$.` },
      { sec: '2.2', type: 'num', lv: 2, q: R`예제 1과 같은 외우기 예측기에서 $\cD$가 $[0,3]^2$ 위의 균등분포이고 $f=1$인 영역이 넓이 2인 원판이라면 $L_{\cD,f}(h_S)$는?`, ans: '2/9', ansTex: R`\tfrac29`,
        sol: R`$h_S$는 표본점(확률 0) 밖에서 늘 0이므로 $f=1$인 영역 전체에서 틀립니다. 확률은 $2/9$. 표본을 늘려도 줄지 않습니다.` },
      { sec: '2.2', type: 'mc', lv: 2, q: R`예제 1의 외우기 예측기가 보여 주는 것은?`,
        choices: [R`ERM은 언제나 참 위험을 최소로 한다`, R`$L_S(h_S)=0$이어도 $L_{\cD,f}(h_S)$는 클 수 있다`, R`표본이 충분히 많으면 외우기 예측기도 일반화한다`, R`경험적 위험은 참 위험의 불편추정량이 아니다`], ans: 1,
        sol: R`훈련 오차가 0이지만 참 위험은 $1/4$로 남습니다. 넷째 보기: **고정된** $h$에 대해서는 $\E_S[L_S(h)]=L_{\cD,f}(h)$로 불편이지만, $h_S$처럼 $S$에 따라 고른 가설에는 이 등식이 성립하지 않습니다. 문제의 핵심은 둘째 보기입니다.` },
      { sec: '2.3', type: 'mc', lv: 2, q: R`실현가능성 가정에 대한 설명으로 옳은 것은?`,
        choices: [R`모든 $h\in\cH$에 대해 $L_{\cD,f}(h)=0$이다`, R`$L_{\cD,f}(h^\star)=0$인 $h^\star\in\cH$가 있고, 이때 확률 1로 $L_S(h^\star)=0$이다`, R`ERM의 출력은 언제나 $h^\star$이다`, R`표본이 i.i.d.라는 가정이다`], ans: 1,
        sol: R`$h^\star$는 $\cD$-거의 모든 $x$에서 $f$와 같으므로 표본점 $m$개에서도 확률 1로 맞힙니다. ERM의 출력은 $L_S=0$인 **어떤** 가설이고 $h^\star$와 다를 수 있습니다.` },
      { sec: '2.3b', type: 'mc', lv: 2, q: R`$\cH=\{h_0\equiv0,h_1\equiv1\}$, $f\equiv0$이고 학습기 $A$가 늘 $h_1$을 내놓는다. 옳은 것은?`,
        choices: [R`실현가능하지 않다`, R`$A$는 $\cH$에 대해 일관이다`, R`실현가능하지만 $L_S(A(S))=1$이므로 “실현가능하면 $L_S(h_S)=0$”은 학습기 조건 없이 성립하지 않는다`, R`$A$는 ERM이다`], ans: 2,
        sol: R`$h_0$이 실현합니다. $L_S(h_0)=0$인 가설이 있는데도 $A$는 $L_S=1$인 $h_1$을 내므로 일관이 아니고 ERM도 아닙니다. 강의 노트의 Lemma 1이 바로 이 반례입니다.` },
      { sec: '2.3c', type: 'num', lv: 2, q: R`실현가능한 유한 클래스 $\lvert\cH\rvert=1000$, $\varepsilon=0.05$, $\delta=0.01$일 때 유한 클래스 정리가 보장하는 최소 표본 수 $\lceil\ln(\lvert\cH\rvert/\delta)/\varepsilon\rceil$은?`, ans: '231', ansTex: R`\lceil 20\ln(10^5)\rceil=231`,
        sol: R`$\ln(1000/0.01)=\ln10^5=11.513$. $11.513/0.05=230.26$이므로 $m=231$.` },
      { sec: '2.3c', type: 'num', lv: 2, q: R`나쁜 가설 하나($L_{\cD,f}(h)=0.1$)가 독립 표본 20개를 모두 맞힐 확률 $(1-0.1)^{20}$은? (소수 넷째 자리)`, ans: '0.9^20', ansTex: R`0.9^{20}\approx0.1216`,
        sol: R`$(0.9)^{20}\approx0.1216$. 상한 $e^{-0.1\cdot20}=e^{-2}\approx0.1353$보다 조금 작습니다.` },
      { sec: '2.3c', type: 'mc', lv: 3, q: R`유한 클래스 정리에서 표본 수를 그대로 두고 정확도 기준을 $\varepsilon$에서 $\varepsilon/2$로 엄격하게 하면서 같은 $\delta$를 유지하려면 표본을 대략 몇 배로 늘려야 하나?`,
        choices: [R`$\sqrt2$배`, R`2배`, R`4배`, R`$\ln2$만큼 더하면 된다`], ans: 1,
        sol: R`$m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon$에서 $\varepsilon$이 분모에 1제곱으로 있으므로 2배입니다. (불가지 설정에서는 $1/\varepsilon^2$이라 4배가 됩니다 — 3단원.)` },
      { sec: '2.3b', type: 'open', lv: 2, proof: true, q: R`실현가능성과 학습기의 일관성을 가정하고, $\{S|_x:L_{\cD,f}(h_S)>\varepsilon\}\subseteq\bigcup_{h\in\cH_B}\{S|_x:L_S(h)=0\}$임을 증명하세요. 두 가정이 각각 어디에 쓰이는지 밝히세요.`,
        sol: R`
$S|_x$가 왼쪽 집합에 속한다고 합시다: $L_{\cD,f}(h_S)>\varepsilon$. 그러면 정의에 의해 $h_S\in\cH_B$.
**실현가능성**: $L_{\cD,f}(h^\star)=0$인 $h^\star\in\cH$가 있고, $y_i=f(x_i)$이며 $h^\star=f$가 $\cD$-거의 어디서나 성립하므로 확률 1로 $L_S(h^\star)=0$.
**일관성**: $L_S=0$인 가설이 $\cH$에 있으므로 $L_S(h_S)=0$.
따라서 $h:=h_S$는 $h\in\cH_B$이고 $L_S(h)=0$, 즉 $S|_x\in\{S|_x:L_S(h)=0\}$ ⊆ 오른쪽 합집합. (측도 0인 예외 표본은 확률 계산에 영향이 없습니다.)`,
        rubric: R`
- $h_S\in\cH_B$ 도출 — 2점
- 실현가능성으로 $L_S(h^\star)=0$ (확률 1) — 3점
- 일관성으로 $L_S(h_S)=0$ — 3점
- 합집합의 원소임을 결론 — 2점` },
      { sec: '2.3c', type: 'open', lv: 2, proof: true, q: R`유한하고 실현가능한 $\cH$에서 $m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon$이면 확률 $1-\delta$ 이상으로 $L_{\cD,f}(h_S)\le\varepsilon$임을 증명하세요.`,
        sol: R`
포함 관계와 합집합 상한으로 $\cD^m(L_{\cD,f}(h_S)>\varepsilon)\le\sum_{h\in\cH_B}\cD^m(L_S(h)=0)$.
고정된 $h\in\cH_B$에 대해 i.i.d.이므로 $\cD^m(L_S(h)=0)=\prod_i\Prob[h(x_i)=f(x_i)]=(1-L_{\cD,f}(h))^m\le(1-\varepsilon)^m\le e^{-\varepsilon m}$.
따라서 실패 확률 $\le\lvert\cH_B\rvert e^{-\varepsilon m}\le\lvert\cH\rvert e^{-\varepsilon m}$.
$m\ge\ln(\lvert\cH\rvert/\delta)/\varepsilon\iff\varepsilon m\ge\ln(\lvert\cH\rvert/\delta)\iff\lvert\cH\rvert e^{-\varepsilon m}\le\delta$. 그러므로 실패 확률 $\le\delta$.`,
        rubric: R`
- 포함 관계 + 합집합 상한 — 3점
- 독립성으로 $(1-L)^m$, $1-\varepsilon\le e^{-\varepsilon}$ — 4점
- $m$ 조건을 $\le\delta$로 바꾸는 계산 — 3점` },
    ],
  });
})();
