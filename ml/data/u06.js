/* 06 비균등 학습가능성, SRM, MDL — UML 7장, 강의 노트 “Notes on Nonuniform Learnability and SRM” (Thm 7.2–7.3), “Proof of Theorem 7.4”, “Proof of Theorem 7.5”, “A Derivation of the Countable-Class SRM Rule” (7.3), “Proof of Lemma 7.6 and Theorem 7.7” */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 6, part: 'A', title: '비균등 학습가능성: SRM과 MDL', en: 'Nonuniform Learnability', ref: 'UML 7장', plot: 'srm',
    fig: R`차수 n이 커질수록 줄어드는 경험적 위험(점)과, 표본 수에 따라 달라지는 “경험적 위험 + 복잡도 벌점” 곡선`,
    tagline: R`표본 수가 비교 대상 가설에 따라 달라져도 된다고 하면, VC 차원이 무한인 클래스도 배울 수 있습니다. 대가는 “단순한 가설을 먼저 믿는 것”입니다.`,
    summary: R`PAC 학습에서는 표본 수가 $\varepsilon,\delta$에만 기댔습니다. **비균등 학습가능성**은 비교 대상 가설 $h$에 따라 표본 수 $m(\varepsilon,\delta,h)$가 달라지는 것을 허용합니다. 이진 분류에서 비균등 학습가능한 클래스는 정확히 **불가지 PAC 학습가능한 클래스의 가산 합집합**입니다. 학습기는 **구조적 위험 최소화**(SRM): $\cH=\bigcup_n\cH_n$에 가중치 $w(n)$을 주고, 신뢰도 예산 $\delta$를 $\delta w(n)$씩 나눠 쓴 동시 상한 $L_\cD(h)\le L_S(h)+\varepsilon_{n}(m,w(n)\delta)$를 최소로 합니다. 가산 클래스에서 가설마다 가중치를 주고 $w(h)=2^{-\lvert h\rvert}$(설명 길이)로 두면 **최소 기술 길이**(MDL) 규칙과 **오컴의 면도날** 상한이 나오며, 가중치의 합이 1 이하라는 것은 **크래프트 부등식**이 보장합니다.`,
    goals: [
      R`비균등 학습가능성을 정의하고 PAC 학습가능성과의 차이(표본 수가 $h$에 기댐)를 설명할 수 있다`,
      R`가중치 $w(n)$으로 신뢰도를 나누는 동시 상한(정리 7.4)을 합집합 상한으로 증명할 수 있다`,
      R`SRM이 비균등 학습기임을 “$\varepsilon/2$ 두 번” 논법으로 증명할 수 있다`,
      R`다항식 부호 분류기의 VC 차원이 $n+1$이고 전체 합집합은 비균등 학습가능함을 보일 수 있다`,
      R`크래프트 부등식을 증명하고 MDL 상한 $L_S(h)+\sqrt{(\lvert h\rvert+\ln(2/\delta))/(2m)}$을 유도할 수 있다`,
    ],
    secTitles: { '7.1': '정의', '7.1b': '특징', '7.2': 'SRM', '7.2b': '다항식 예', '7.3': 'MDL', '7.4': '일치성' },
    sections: [
      { k: '7.1', p: 83, title: '비균등 학습가능성', body: R`
:::def 비균등 학습가능성
$\cH$가 **비균등 학습가능**(nonuniformly learnable)하다는 것은 학습 알고리즘 $A$와 함수 $m^{\mathrm{NUL}}_\cH:(0,1)^2\times\cH\to\mathbb N$이 있어, 모든 $\varepsilon,\delta\in(0,1)$, 모든 $h\in\cH$, 모든 분포 $\cD$에 대해 $m\ge m^{\mathrm{NUL}}_\cH(\varepsilon,\delta,h)$이면 확률 $1-\delta$ 이상으로
$$L_\cD\big(A(S)\big)\le L_\cD(h)+\varepsilon.$$
:::

불가지 PAC는 “$\min_hL_\cD(h)+\varepsilon$”, 즉 **모든 $h$와 동시에** 같은 표본 수로 겨룹니다. 비균등은 $h$마다 겨루되 **$h$가 복잡할수록 표본이 더 필요해도 됩니다**. 이 한 가지 차이로 학습가능한 클래스가 넓어집니다.

:::warn 양화사를 한 번 더
PAC: $\exists m(\varepsilon,\delta)\ \forall\cD\ \forall h$. 비균등: $\forall h\ \exists m(\varepsilon,\delta,h)\ \forall\cD$. 분포에 대해서는 여전히 균등합니다 — 다른 것은 $h$의 위치뿐입니다. 분포에 기대는 것까지 허용하면 7.4절의 일치성이 됩니다.
:::
` },
      { k: '7.1b', p: 84, src: '강의 노트 · Theorem 7.2–7.3', title: '비균등 학습가능성의 특징', body: R`
:::key 비균등 학습가능성의 특징
이진 분류의 클래스 $\cH$가 비균등 학습가능할 필요충분조건은 $\cH$가 불가지 PAC 학습가능한 클래스들의 가산 합집합 $\cH=\bigcup_{n\in\mathbb N}\cH_n$으로 쓰이는 것이다. 특히 각 $\cH_n$이 균등수렴하는 가산 합집합은 비균등 학습가능하다(정리 7.3).
:::

:::hand 강의 노트 — 두 방향
**(⇐)** 각 $\cH_n$이 불가지 PAC 학습가능하면 기본 정리로 균등수렴하고, 다음 절의 SRM이 비균등 학습기가 됩니다(정리 7.3).

**(⇒)** $A$와 $m^{\mathrm{NUL}}$이 있다고 하고 $\cH_n:=\{h\in\cH:m^{\mathrm{NUL}}(\tfrac18,\tfrac17,h)\le n\}$로 둡니다. 모든 $h$의 $m^{\mathrm{NUL}}(\tfrac18,\tfrac17,h)$는 자연수이므로 $\cH=\bigcup_n\cH_n$. $\cH_n$에서 실현가능한 분포(어떤 $h^\star\in\cH_n$이 $L_\cD(h^\star)=0$)이면, $m=n$개 표본으로 확률 $\tfrac67$ 이상 $L_\cD(A(S))\le\tfrac18$입니다. 만약 $\VC(\cH_n)=\infty$라면 $\cH_n$은 크기 $2n$인 집합을 분쇄하고, 공짜 점심은 없다 정리의 구성(그 집합 위의 레이블링들은 모두 $\cH_n$ 안에 있어 실현가능)에서 확률 $\tfrac17$ 이상으로 오차 $\ge\tfrac18$ — 모순. 그러므로 $\VC(\cH_n)<\infty$이고 기본 정리로 불가지 PAC 학습가능합니다.
:::

:::note 노트의 (⇒)에서 조심할 점
공짜 점심은 없다 정리는 “확률 $\ge\tfrac17$로 $L\ge\tfrac18$”이고 가정은 “확률 $\ge\tfrac67$로 $L\le\tfrac18$”입니다. $L=\tfrac18$에 확률이 몰리면 두 명제가 함께 참일 수 있어 그대로는 모순이 아닙니다. 교재도 같은 상수를 쓰지만, 엄밀히는 $\varepsilon<\tfrac18$, $\delta<\tfrac17$(예: $\tfrac1{10}$, $\tfrac18$)로 $\cH_n$을 정의하면 $\Prob(L\ge\tfrac18)\le\Prob(L>\tfrac1{10})\le\tfrac18<\tfrac17$이 되어 모순이 깔끔해집니다.
:::
` },
      { k: '7.2', p: 85, src: '강의 노트 · Theorem 7.4, 7.5', title: '구조적 위험 최소화', body: R`
$\cH=\bigcup_n\cH_n$이고 $\cH_n$이 균등수렴 표본 복잡도 $m^{\mathrm{UC}}_{\cH_n}$을 가진다고 합시다.

:::def 가중치와 클래스별 오차 반지름
- **가중치 함수** $w:\mathbb N\to[0,1]$, $\sum_nw(n)\le1$. 표준 예: $w(n)=\dfrac6{\pi^2n^2}$($\sum1/n^2=\pi^2/6$).
- $\varepsilon_n(m,\delta):=\min\{\varepsilon\in(0,1):m^{\mathrm{UC}}_{\cH_n}(\varepsilon,\delta)\le m\}$ — 표본 $m$개와 신뢰도 $\delta$로 $\cH_n$에서 보장되는 가장 작은 오차.
- $n(h):=\min\{n:h\in\cH_n\}$.
:::

:::key SRM 동시 상한
모든 $\delta\in(0,1)$와 $\cD$에 대해 확률 $1-\delta$ 이상으로, **모든 $n$과 모든 $h\in\cH_n$에서 동시에**
$$\lvert L_\cD(h)-L_S(h)\rvert\le\varepsilon_n\big(m,w(n)\delta\big).$$
따라서 모든 $h\in\cH$에서 $L_\cD(h)\le L_S(h)+\min_{n:h\in\cH_n}\varepsilon_n(m,w(n)\delta)$.
:::

증명은 신뢰도 예산을 나눠 쓰는 것입니다: 클래스 $\cH_n$마다 실패 확률을 $\delta_n=w(n)\delta$ 이하로 두면 전체 실패 확률은 합집합 상한으로 $\sum_n\delta_n\le\delta$.

:::def SRM 규칙
$$A(S)\in\argmin_{h\in\cH}\Big[L_S(h)+\varepsilon_{n(h)}\big(m,w(n(h))\delta\big)\Big]$$
경험적 위험에 **클래스에 따른 복잡도 벌점**을 더해 최소화합니다.
:::

:::key SRM의 비균등 학습 보장
각 $\cH_n$이 균등수렴하고 $w(n)=6/(\pi^2n^2)$이면 SRM은 비균등 학습기이고
$$m^{\mathrm{NUL}}_\cH(\varepsilon,\delta,h)\le m^{\mathrm{UC}}_{\cH_{n(h)}}\!\left(\frac\varepsilon2,\frac{6\delta}{(\pi n(h))^2}\right).$$
:::

증명은 불가지 PAC의 “$\varepsilon/2$ 두 번”과 같습니다. 동시 상한이 성립하는 사건 위에서
$$L_\cD(A(S))\le L_S(A(S))+\varepsilon_{n(A(S))}\le L_S(h)+\varepsilon_{n(h)}\le L_\cD(h)+2\varepsilon_{n(h)}\le L_\cD(h)+\varepsilon.$$
가운데 부등호가 SRM의 정의, 마지막은 표본 수 조건으로 $\varepsilon_{n(h)}(m,w(n(h))\delta)\le\varepsilon/2$인 것입니다.

:::tip 가중치의 의미
$w(n)$이 크면(앞쪽 클래스) 벌점이 작습니다. SRM은 “앞쪽 클래스를 더 믿는” 사전 지식을 표현합니다. 대가는 뒤쪽 클래스의 가설과 겨룰 때 $\ln(1/w(n))\approx2\ln n$만큼 표본이 더 드는 것입니다.
:::
` },
      { k: '7.2b', p: 86, src: '강의 노트 · 7장 예', title: '예: 다항식 부호 분류기', body: R`
$\cH_n=\{x\mapsto\sign(p(x)):p\text{는 차수 }\le n\text{인 실계수 다항식}\}$ ($\cX=\mathbb R$), $\cH=\bigcup_n\cH_n$.

:::key 다항식 분류기의 VC 차원
$\VC(\cH_n)=n+1$이고 $\VC(\cH)=\infty$. 따라서 $\cH$는 PAC 학습가능하지 않지만 비균등 학습가능하다.
:::

:::hand 강의 노트 — 두 방향의 증명
**하한.** 서로 다른 $x_1<\dots<x_{n+1}$과 임의의 $y_i\in\{\pm1\}$에 대해, 라그랑주 보간으로 $p(x_i)=y_i$인 차수 $\le n$ 다항식이 있습니다. $y_i\ne0$이므로 $\sign(p(x_i))=y_i$. 분쇄.

**상한.** $x_1<\dots<x_{n+2}$에 번갈아 가는 레이블 $+1,-1,+1,\dots$을 주면, 실현하는 $p$는 이웃한 점마다 부호가 바뀌므로 중간값 정리로 서로소인 구간 $(x_i,x_{i+1})$마다 근이 하나씩, 합해 $n+1$개의 서로 다른 근을 가집니다. 차수 $\le n$인 0이 아닌 다항식은 근이 $n$개 이하이므로 $p\equiv0$이어야 하는데, 그러면 $\sign(p(x_i))$가 $\pm1$일 수 없습니다. 분쇄 불가.

**합집합.** $\cH_{m-1}$이 $m$점을 분쇄하므로 $\VC(\cH)\ge m$(모든 $m$). 각 $\cH_n$은 VC 유한이라 불가지 PAC 학습가능, 특징 정리로 $\cH$는 비균등 학습가능합니다.
:::

:::note $\sign(0)$의 약속
노트는 $p\equiv0$이면 실현할 수 없다고 적었습니다. $\sign(0)$을 $+1$로 정하는 관례에서도 번갈아 가는 레이블의 $-1$은 실현할 수 없으므로 결론은 같습니다.
:::
` },
      { k: '7.3', p: 89, src: '강의 노트 · 7.3, Lemma 7.6, Theorem 7.7', title: '최소 기술 길이와 오컴의 면도날', body: R`
$\cH$가 **가산**이면 $\cH=\bigcup_n\{h_n\}$ — 한원소 클래스들의 합집합으로 봅니다. 한원소 클래스의 균등수렴은 호프딩 그대로입니다: $m^{\mathrm{UC}}_{\{h\}}(\varepsilon,\delta)=\lceil\ln(2/\delta)/(2\varepsilon^2)\rceil$, 따라서 $\varepsilon_n(m,\delta)=\sqrt{\ln(2/\delta)/(2m)}$.

:::key 가산 클래스의 SRM 규칙
가중치 $w:\cH\to[0,1]$, $\sum_hw(h)\le1$에 대해 확률 $1-\delta$ 이상으로 모든 $h\in\cH$에서
$$L_\cD(h)\le L_S(h)+\sqrt{\frac{-\ln w(h)+\ln(2/\delta)}{2m}},$$
그리고 SRM은 이 우변을 최소로 하는 $h$를 고른다.
:::

$\ln\frac2{w(h)\delta}=-\ln w(h)+\ln\frac2\delta$를 $\varepsilon_n(m,w(n)\delta)$에 넣은 것입니다.

**설명 언어.** 각 가설을 이진 문자열 $d(h)\in\{0,1\}^\ast$로 적고 길이를 $\lvert h\rvert$라 합니다. 어떤 문자열도 다른 문자열의 접두사가 아니면 **접두사 없는**(prefix-free) 언어라 합니다.

:::key 크래프트 부등식
$S\subseteq\{0,1\}^\ast$가 접두사 없는 집합이면 $\displaystyle\sum_{\sigma\in S}2^{-\lvert\sigma\rvert}\le1$.
:::

:::hand 강의 노트 — 동전 던지기로 증명
공정한 동전을 무한히 던져 수열 $\omega$를 만들고, 문자열 $\sigma$에 대해 사건 $A_\sigma$ = “$\omega$가 $\sigma$로 시작함”이라 합니다. $\Prob(A_\sigma)=2^{-\lvert\sigma\rvert}$. 접두사 없음이면 $\sigma\ne\sigma'$에서 $A_\sigma\cap A_{\sigma'}=\emptyset$(둘 다로 시작하려면 하나가 다른 것의 접두사여야 함). 서로소 사건들의 확률의 합은 합집합의 확률이므로 1 이하입니다.
:::

:::key 오컴 상한
접두사 없는 설명 언어가 주어지면, 확률 $1-\delta$ 이상으로 모든 $h\in\cH$에서
$$L_\cD(h)\le L_S(h)+\sqrt{\frac{\lvert h\rvert+\ln(2/\delta)}{2m}}.$$
:::

$w(h)=2^{-\lvert h\rvert}$는 크래프트로 가중치 조건을 만족하고, $-\ln w(h)=\lvert h\rvert\ln2\le\lvert h\rvert$입니다. 이 상한을 최소로 하는 규칙이 **최소 기술 길이**(MDL)이고, “경험적 위험이 같다면 짧게 설명되는 가설을 택하라”는 오컴의 면도날의 정량적 형태입니다.
` },
      { k: '7.4', p: 92, title: '일치성과 학습가능성의 위계', body: R`
분포에 대한 균등성까지 버리면 **일치성**(consistency)이 됩니다: 표본 수가 $\varepsilon,\delta,h$와 **$\cD$에도** 기대도 됩니다.

$$\text{PAC 학습가능}\ \subsetneq\ \text{비균등 학습가능}\ \subsetneq\ \text{일치 학습가능}.$$

- 다항식 분류기 전체는 비균등이지만 PAC가 아닙니다.
- **외우기**(Memorize) 알고리즘 — 표본에 나온 $x$는 그 레이블(여러 번이면 다수결)을, 처음 보는 $x$는 기본값 0을 내놓음 — 은 $\cX$가 가산이면 모든 함수의 클래스에 대해 일치 학습기입니다. 그러나 모든 함수의 클래스는 비균등 학습가능하지 않으므로(가산 합집합으로 쓰면 어떤 $\cH_n$은 무한 VC) 둘째 포함이 진부분입니다.

:::warn 일치성이 약한 이유
일치성은 “언젠가는 수렴한다”만 말하고, 지금 가진 표본으로 얼마나 좋은지 **분포를 모르면 알 수 없습니다**. 외우기 알고리즘이 일치 학습기라는 사실은 일치성만으로는 실용적 보장이 거의 없음을 보여 줍니다.
:::

:::note 공짜 점심은 없다, 다시
비균등 학습은 모든 가산 합집합 클래스를 다룰 수 있지만, 공짜 점심은 없다 정리를 우회하지는 못합니다. 가중치 $w$를 정하는 순간 “어떤 가설을 먼저 믿을지”라는 사전 지식을 넣은 것이고, 뒤쪽 가설과 겨루려면 그만큼 표본이 더 듭니다.
:::
` },
    ],
    problems: [
      { sec: '7.1', type: 'mc', lv: 1, q: R`비균등 학습가능성에서 표본 수 $m^{\mathrm{NUL}}$이 의존할 수 있는 것은?`,
        choices: [R`$\varepsilon,\delta$만`, R`$\varepsilon,\delta,h$`, R`$\varepsilon,\delta,h,\cD$`, R`$\cD$만`], ans: 1,
        sol: R`비균등 학습가능성은 비교 대상 $h$에 따라 표본 수가 달라져도 되지만, 분포에 대해서는 균등합니다. $\cD$까지 허용하면 일치성입니다.` },
      { sec: '7.2', type: 'num', lv: 1, q: R`가중치 $w(n)=6/(\pi^2n^2)$에서 $w(1)$은? (소수 넷째 자리)`, ans: '6/pi^2', ansTex: R`6/\pi^2\approx0.6079`,
        sol: R`$6/\pi^2\approx0.6079$. 첫 클래스가 신뢰도 예산의 약 61%를 받습니다.` },
      { sec: '7.2', type: 'num', lv: 2, q: R`$\delta=0.1$, $w(n)=6/(\pi^2n^2)$일 때 클래스 $n=5$에 배정되는 실패 확률 $w(5)\delta$는? (소수 다섯째 자리)`, ans: '0.6/(25*pi^2)', ansTex: R`\tfrac{0.6}{25\pi^2}\approx0.00243`,
        sol: R`$w(5)=6/(25\pi^2)\approx0.02432$, 곱하면 $\approx0.00243$.` },
      { sec: '7.2', type: 'mc', lv: 2, q: R`SRM의 보장 증명에서 $L_S(A(S))+\varepsilon_{n(A(S))}\le L_S(h)+\varepsilon_{n(h)}$가 성립하는 이유는?`,
        choices: [R`동시 상한`, R`SRM 규칙이 이 목적함수를 최소로 하므로`, R`$n(A(S))\le n(h)$이므로`, R`호프딩 부등식`], ans: 1,
        sol: R`$A(S)$는 벌점을 더한 목적함수의 최소점입니다. $n(A(S))$와 $n(h)$의 크기 관계는 알 수 없고 필요도 없습니다.` },
      { sec: '7.2b', type: 'num', lv: 1, q: R`차수가 3 이하인 다항식의 부호 분류기 클래스 $\cH_3$의 VC 차원은?`, ans: '4', ansTex: R`4`,
        sol: R`$\VC(\cH_n)=n+1=4$.` },
      { sec: '7.2b', type: 'mc', lv: 2, q: R`다항식 분류기 전체 $\cH=\bigcup_n\cH_n$에 대해 옳은 것은?`,
        choices: [R`VC 차원이 유한하므로 PAC 학습가능하다`, R`VC 차원이 무한이라 PAC 학습가능하지 않지만 비균등 학습가능하다`, R`비균등 학습가능하지도 않다`, R`$\cH$는 비가산이라 SRM을 쓸 수 없다`], ans: 1,
        sol: R`$\cH$ 자체는 비가산이어도 **가산 개 클래스의 합집합**이면 됩니다. 각 $\cH_n$이 VC 유한이므로 특징 정리가 적용됩니다.` },
      { sec: '7.3', type: 'num', lv: 2, q: R`접두사 없는 코드 $\{0,10,110,111\}$의 크래프트 합 $\sum2^{-\lvert\sigma\rvert}$은?`, ans: '1', ansTex: R`\tfrac12+\tfrac14+\tfrac18+\tfrac18=1`,
        sol: R`$\frac12+\frac14+\frac18+\frac18=1$. 등호는 코드가 “꽉 찬” 이진 트리의 잎들일 때입니다.` },
      { sec: '7.3', type: 'mc', lv: 2, q: R`$\{0,01,11\}$에 대한 설명으로 옳은 것은?`,
        choices: [R`접두사 없는 집합이고 크래프트 합은 1`, R`0이 01의 접두사라 접두사 없는 집합이 아니다`, R`크래프트 합이 1을 넘으므로 접두사 없는 집합이다`, R`길이가 서로 달라서 접두사 없는 집합이다`], ans: 1,
        sol: R`“0”은 “01”의 접두사입니다. 크래프트 합은 $\frac12+\frac14+\frac14=1$이지만, 크래프트 부등식은 접두사 없는 집합의 **필요조건**일 뿐 충분조건이 아닙니다.` },
      { sec: '7.3', type: 'num', lv: 2, q: R`MDL 상한에서 $\lvert h\rvert=100$비트, $m=5000$, $\delta=0.05$일 때 벌점 $\sqrt{(\lvert h\rvert+\ln(2/\delta))/(2m)}$은? (소수 넷째 자리)`, ans: 'sqrt((100+ln(40))/10000)', ansTex: R`\sqrt{103.69/10^4}\approx0.1018`,
        sol: R`$\ln40=3.689$. $\sqrt{103.689/10000}\approx0.1018$.` },
      { sec: '7.4', type: 'mc', lv: 2, q: R`외우기 알고리즘에 대해 옳은 것은?`,
        choices: [R`모든 함수의 클래스에 대한 PAC 학습기이다`, R`가산 정의역에서 모든 함수의 클래스에 대한 일치 학습기이지만, 그 클래스는 비균등 학습가능하지 않다`, R`비균등 학습기이다`, R`VC 차원이 유한한 클래스에서만 동작한다`], ans: 1,
        sol: R`일치성은 분포별로 “언젠가” 수렴하면 되므로 외우기로 충분합니다. 이것이 PAC ⊊ 비균등 ⊊ 일치의 두 번째 진포함의 예입니다.` },
      { sec: '7.2', type: 'open', lv: 2, proof: true, q: R`$\cH=\bigcup_n\cH_n$이고 각 $\cH_n$이 균등수렴하며 $\sum_nw(n)\le1$일 때, 확률 $1-\delta$ 이상으로 모든 $n$과 모든 $h\in\cH_n$에서 $\lvert L_\cD(h)-L_S(h)\rvert\le\varepsilon_n(m,w(n)\delta)$임을 증명하세요.`,
        sol: R`
$n$을 고정하고 $\delta_n=w(n)\delta$. $\varepsilon_n$의 정의로 $m^{\mathrm{UC}}_{\cH_n}(\varepsilon_n(m,\delta_n),\delta_n)\le m$이므로 균등수렴 성질에서 사건 $E_n=\{S:\forall h\in\cH_n,\lvert L_\cD(h)-L_S(h)\rvert\le\varepsilon_n(m,\delta_n)\}$의 확률은 $\ge1-\delta_n$.
$E=\bigcap_nE_n$이라 하면 합집합 상한으로 $\Prob(E^c)=\Prob(\bigcup_nE_n^c)\le\sum_n\Prob(E_n^c)\le\sum_nw(n)\delta\le\delta$.
$E$ 위에서는 정의에 의해 모든 $n$, 모든 $h\in\cH_n$에서 부등식이 동시에 성립합니다.`,
        rubric: R`
- $\varepsilon_n$의 정의로 각 $E_n$의 확률 $\ge1-w(n)\delta$ — 4점
- 교집합 사건과 가산 합집합 상한 — 4점
- 동시 성립 결론 — 2점` },
      { sec: '7.3', type: 'open', lv: 2, proof: true, q: R`크래프트 부등식을 증명하고, 이를 이용해 접두사 없는 설명 언어에 대한 오컴 상한 $L_\cD(h)\le L_S(h)+\sqrt{(\lvert h\rvert+\ln(2/\delta))/(2m)}$을 유도하세요. (가산 클래스의 가중 상한은 써도 됩니다.)`,
        sol: R`
**크래프트.** 공정한 동전의 무한 수열 $\omega$에서 $A_\sigma$ = “$\omega$가 $\sigma$로 시작”. $\Prob(A_\sigma)=2^{-\lvert\sigma\rvert}$. 접두사 없음이면 서로 다른 $\sigma,\sigma'$에 대해 $A_\sigma\cap A_{\sigma'}=\emptyset$. 따라서 $\sum_\sigma2^{-\lvert\sigma\rvert}=\Prob(\bigcup A_\sigma)\le1$.
**오컴.** $w(h)=2^{-\lvert h\rvert}$로 두면 크래프트로 $\sum_hw(h)\le1$. 가산 클래스 가중 상한에서 확률 $1-\delta$ 이상으로 $L_\cD(h)\le L_S(h)+\sqrt{(-\ln w(h)+\ln(2/\delta))/(2m)}$. $-\ln w(h)=\lvert h\rvert\ln2\le\lvert h\rvert$이고 제곱근은 증가함수이므로 결론.`,
        rubric: R`
- 원기둥 사건과 확률 $2^{-\lvert\sigma\rvert}$ — 3점
- 접두사 없음 ⇒ 서로소, 합 ≤ 1 — 3점
- 가중치 대입과 $\ln2<1$ — 4점` },
    ],
  });
})();
