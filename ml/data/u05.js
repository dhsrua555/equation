/* 05 VC 차원 — UML 6장, 강의 노트 “PAC Learnability of Threshold Functions via ERM” (Lemma 6.1), “A Proof of the Sauer–Shelah–Perles Lemma” (Lemma 6.10) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'A', title: 'VC 차원과 학습의 기본 정리', en: 'The VC-Dimension', ref: 'UML 6장', plot: 'vcgrowth',
    fig: R`로그 눈금으로 그린 성장 함수: 모든 레이블링 2^m(굵은 선과 점)과 VC 차원 d = 1, …, 6일 때 사우어 보조정리의 다항식 상한`,
    tagline: R`무한 클래스도 배울 수 있습니다. 중요한 것은 가설의 개수가 아니라, 몇 개의 점까지 모든 레이블링을 만들어 낼 수 있느냐입니다.`,
    summary: R`유한 클래스 정리는 $\ln\lvert\cH\rvert$에 기대므로 무한 클래스에는 쓸 수 없습니다. 그런데 실수 위의 **임계 함수** 클래스는 무한인데도 $m\ge\ln(2/\delta)/\varepsilon$개로 PAC 학습됩니다. 차이를 재는 척도가 **VC 차원** — $\cH$가 **분쇄**(shatter)할 수 있는 가장 큰 점 집합의 크기 — 입니다. 공짜 점심은 없다 정리에서 VC 차원이 무한이면 학습할 수 없고, 반대로 유한하면 **사우어 보조정리**로 성장 함수가 $2^m$ 대신 $(em/d)^d$로 다항식처럼 자라 균등수렴이 성립합니다. 이로써 이진 분류의 **학습의 기본 정리**가 완성됩니다: 균등수렴 ⇔ 불가지 PAC ⇔ PAC ⇔ 유한 VC 차원. 강의 노트는 사우어 보조정리를 $\lvert\cH_C\rvert\le\lvert\{B\subseteq C:\cH\text{가 }B\text{를 분쇄}\}\rvert$라는 더 강한 명제의 귀납법으로 증명합니다.`,
    goals: [
      R`임계 함수 클래스가 $m\ge\ln(2/\delta)/\varepsilon$에서 PAC 학습됨을 “경계 근처 구간을 놓칠 확률”로 증명할 수 있다`,
      R`제한 $\cH_C$, 분쇄, VC 차원, 성장 함수를 정의하고 구간·직사각형·유한 클래스의 VC 차원을 구할 수 있다`,
      R`VC 차원이 무한이면 PAC 학습가능하지 않음을 공짜 점심은 없다 정리로 보일 수 있다`,
      R`사우어 보조정리를 분쇄되는 부분집합의 개수에 대한 귀납법으로 증명할 수 있다`,
      R`학습의 기본 정리의 네 동치와 정량적 표본 복잡도를 쓸 수 있다`,
    ],
    secTitles: { '6.1': '임계 함수', '6.2': 'VC 차원', '6.3': '예', '6.4': '기본 정리', '6.5': '사우어 보조정리', '6.5b': '균등수렴' },
    sections: [
      { k: '6.1', p: 67, src: '강의 노트 · Lemma 6.1', title: '무한 클래스도 학습할 수 있다: 임계 함수', body: R`
$\cH=\{h_a(x)=\one[x<a]:a\in\mathbb R\}$ — 어떤 점 $a$보다 왼쪽이면 1, 오른쪽이면 0 — 은 가설이 실수만큼 많은 무한 클래스입니다. 그래도 학습됩니다.

:::key 임계 함수 클래스의 표본 복잡도
실현가능 설정에서 임계 함수 클래스는 ERM으로 PAC 학습가능하고
$$m_\cH(\varepsilon,\delta)\le\left\lceil\frac{\ln(2/\delta)}{\varepsilon}\right\rceil.$$
:::

:::hand 강의 노트 — 경계 근처를 놓쳐야만 실패한다
참 임계값을 $a^\star$라 하고, $a_0<a^\star<a_1$을 $\Prob(a_0<X<a^\star)=\varepsilon$, $\Prob(a^\star\le X<a_1)=\varepsilon$이 되게 잡습니다(한쪽 질량이 $\varepsilon$ 이하이면 그쪽 끝을 $\mp\infty$로 둡니다).

$b_0=\max\{x_i:y_i=1\}$, $b_1=\min\{x_i:y_i=0\}$이라 하면 오차 0인 ERM은 $b_0<a_S\le b_1$인 $a_S$를 고릅니다. $b_0\ge a_0$이고 $b_1\le a_1$이면 $a_S\in(a_0,a_1]$이라 $h_S$와 $h_{a^\star}$가 다른 곳은 $(a_0,a_1)$ 안의 한쪽 구간뿐이고 오차는 $\varepsilon$ 이하입니다. 대우를 취하면
$$\Prob(L_\cD(h_S)>\varepsilon)\le\Prob(b_0<a_0)+\Prob(b_1>a_1).$$
$b_0<a_0$은 “표본 $m$개가 모두 $(a_0,a^\star)$를 피함”이므로 확률 $(1-\varepsilon)^m\le e^{-\varepsilon m}$. 다른 쪽도 같아서 실패 확률 $\le2e^{-\varepsilon m}\le\delta\iff m\ge\ln(2/\delta)/\varepsilon$.
:::

:::note 분포에 원자가 있을 때
$\Prob(a_0<X<a^\star)=\varepsilon$을 정확히 맞추는 $a_0$이 없을 수 있습니다(한 점에 질량이 몰린 경우). 그때는 질량이 $\varepsilon$ **이상**이 되는 가장 가까운 $a_0$을 잡으면 “그 구간을 피할 확률 $\le(1-\varepsilon)^m$”과 “그 구간 밖의 오차 $\le\varepsilon$”이 함께 성립합니다. 교재와 노트는 이 세부를 생략했습니다.
:::
` },
      { k: '6.2', p: 68, title: 'VC 차원', body: R`
임계 함수의 경우 “가설이 몇 개냐”가 아니라 “표본 위에서 몇 가지로 다르게 행동하느냐”가 중요했습니다.

:::def 제한, 분쇄, VC 차원
- $C=\{c_1,\dots,c_m\}\subseteq\cX$에 대한 **제한**: $\cH_C=\{(h(c_1),\dots,h(c_m)):h\in\cH\}\subseteq\{0,1\}^m$.
- $\cH$가 $C$를 **분쇄**(shatter)한다: $\cH_C=\{0,1\}^{\lvert C\rvert}$, 즉 $C$ 위의 $2^{\lvert C\rvert}$가지 레이블링을 모두 만든다.
- **VC 차원** $\VC(\cH)$: $\cH$가 분쇄하는 집합의 최대 크기. 임의로 큰 집합을 분쇄하면 $\infty$.
:::

공짜 점심은 없다 정리의 증명은 사실 “$\cH$가 크기 $2m$인 집합을 분쇄한다”는 것만 썼습니다. 그래서

:::key VC 차원이 무한이면 PAC 학습 불가
$\cH$가 크기 $2m$인 집합을 분쇄하면, 표본 $m$개로는 (공짜 점심은 없다 정리의 의미에서) 학습할 수 없다. 특히 $\VC(\cH)=\infty$이면 $\cH$는 PAC 학습가능하지 않다.
:::

:::tip VC 차원을 보이는 두 단계
$\VC(\cH)=d$를 보이려면 (1) 크기 $d$인 집합 **하나를** 찾아 분쇄됨을 보이고, (2) 크기 $d+1$인 **모든** 집합이 분쇄되지 않음을 보입니다. (1)은 존재, (2)는 전칭입니다. 흔한 실수는 (1)에서 “모든 $d$개 집합”을 보이려 하거나 (2)에서 “어떤 $d+1$개 집합”이 안 된다고 끝내는 것입니다.
:::
` },
      { k: '6.3', p: 70, title: 'VC 차원의 예', body: R`
| 클래스 | VC 차원 | 이유 |
|---|---|---|
| 임계 함수 $\one[x<a]$ | 1 | 한 점은 분쇄. 두 점 $c_1<c_2$의 $(0,1)$은 불가 |
| 구간 $\one[a\le x\le b]$ | 2 | 두 점 분쇄. 세 점 $c_1<c_2<c_3$의 $(1,0,1)$은 불가 |
| 축에 나란한 직사각형 ($\mathbb R^2$) | 4 | 마름모꼴 네 점 분쇄. 다섯 점이면 가장 왼쪽·오른쪽·위·아래 점을 1로 두고 남은 점을 0으로 둔 레이블링 불가 |
| 유한 클래스 | $\le\log_2\lvert\cH\rvert$ | 분쇄하려면 $2^{\lvert C\rvert}\le\lvert\cH\rvert$ |
| $\{\lceil\sin(\theta x)\rceil\}$ | $\infty$ | 모수 하나로 임의의 점 집합 분쇄 |

:::ex 예제 — 직사각형의 다섯 점
$\mathbb R^2$의 임의의 다섯 점이 축에 나란한 직사각형으로 분쇄되지 않는 이유는?
---
다섯 점 중 $x$좌표가 가장 작은 점, 가장 큰 점, $y$좌표가 가장 작은 점, 가장 큰 점을 고릅니다(겹칠 수 있어 많아야 4개). 이 점들에 1, 나머지 적어도 한 점 $c$에 0을 준 레이블링을 생각합니다. 1인 점들을 모두 담는 직사각형은 $x$·$y$ 범위를 모두 덮으므로 다섯 점을 담는 가장 작은 직사각형을 포함하고, $c$도 그 안에 있어 1로 표시됩니다. 모순.
:::

:::warn 모수의 개수와 VC 차원
많은 클래스에서 VC 차원 ≈ 모수 개수이지만(이산화 기법의 직관), 늘 그렇지는 않습니다. $\lceil\sin(\theta x)\rceil$은 모수가 하나인데 VC 차원이 무한입니다. VC 차원은 “자유도”가 아니라 “조합적 풍부함”입니다.
:::
` },
      { k: '6.4', p: 72, title: '학습의 기본 정리', body: R`
:::key 학습의 기본 정리
$\cH$가 $\cX\to\{0,1\}$ 함수의 클래스이고 손실이 0–1 손실이면 다음은 동치다.
1. $\cH$는 균등수렴 성질을 가진다.
2. ERM은 $\cH$에 대한 성공적인 불가지 PAC 학습기이다.
3. $\cH$는 불가지 PAC 학습가능하다.
4. $\cH$는 PAC 학습가능하다.
5. ERM은 $\cH$에 대한 성공적인 PAC 학습기이다.
6. $\VC(\cH)<\infty$.
:::

순환 증명: 1⇒2(4단원), 2⇒3, 3⇒4, 2⇒5, 5⇒4는 정의에서 바로, 4⇒6은 앞 절의 “VC 차원이 무한이면 PAC 학습 불가”, 6⇒1이 남은 일이고 이것이 사우어 보조정리와 다음 절의 정리입니다.

**정량적 형태.** $\VC(\cH)=d<\infty$이면 절대 상수 $C_1,C_2$가 있어
$$C_1\frac{d+\ln(1/\delta)}{\varepsilon^2}\le m_\cH^{\text{불가지}}(\varepsilon,\delta),\ m^{\mathrm{UC}}_\cH(\varepsilon,\delta)\le C_2\frac{d+\ln(1/\delta)}{\varepsilon^2},$$
$$C_1\frac{d+\ln(1/\delta)}{\varepsilon}\le m_\cH^{\text{실현}}(\varepsilon,\delta)\le C_2\frac{d\ln(1/\varepsilon)+\ln(1/\delta)}{\varepsilon}.$$
유한 클래스의 $\ln\lvert\cH\rvert$ 자리에 $d$가 들어간 모양입니다(증명은 교재 28장).

:::warn 이진 분류에서만
이 동치는 0–1 손실의 이진 분류에 대한 것입니다. 일반 손실에서는 학습가능한데 균등수렴하지 않는 클래스도 있습니다(12–13단원의 볼록 학습 문제에서 다시 만남).
:::
` },
      { k: '6.5', p: 73, src: '강의 노트 · Lemma 6.10', title: '사우어 보조정리', body: R`
:::def 성장 함수
$$\tau_\cH(m)=\max_{C\subseteq\cX,\ \lvert C\rvert=m}\lvert\cH_C\rvert$$
크기 $m$인 집합 위에서 $\cH$가 만들 수 있는 레이블링의 최대 개수. 분쇄하면 $2^m$.
:::

:::key 사우어 보조정리
$\VC(\cH)\le d<\infty$이면 모든 $m$에 대해
$$\tau_\cH(m)\le\sum_{i=0}^d\binom mi,\qquad\text{특히 }m>d+1\text{이면}\quad\tau_\cH(m)\le\left(\frac{em}d\right)^d.$$
:::

VC 차원을 넘는 순간 성장이 지수에서 다항식으로 꺾입니다(표지 그림). 핵심은 더 강한 명제입니다.

:::hand 강의 노트 — 분쇄되는 부분집합 세기
**보조정리.** 모든 유한 $C$에 대해 $\lvert\cH_C\rvert\le\lvert\{B\subseteq C:\cH\text{가 }B\text{를 분쇄}\}\rvert$.

이것이면 충분합니다: $\VC\le d$이므로 분쇄되는 $B$는 크기 $\le d$이고, 그런 부분집합은 $\sum_{i\le d}\binom mi$개.

**$\lvert C\rvert$에 대한 귀납법.** $C=\emptyset$이면 양변 1(공집합은 늘 분쇄됨). $C=\{c_1,\dots,c_m\}$, $C'=\{c_2,\dots,c_m\}$로 두고
$$Y_0=\{(y_2,\dots,y_m):(0,y_2,\dots,y_m)\in\cH_C\text{ 또는 }(1,y_2,\dots,y_m)\in\cH_C\},$$
$$Y_1=\{(y_2,\dots,y_m):\text{두 패턴이 모두 }\cH_C\text{에 있음}\}.$$
그러면 $\lvert\cH_C\rvert=\lvert Y_0\rvert+\lvert Y_1\rvert$ (두 번 나오는 패턴은 두 번 셈).

- $Y_0=\cH_{C'}$이므로 귀납 가정으로 $\lvert Y_0\rvert\le\#\{B\subseteq C':\cH\text{가 분쇄}\}=\#\{B\subseteq C:c_1\notin B,\ \cH\text{가 분쇄}\}$.
- $\cH'=\{h\in\cH:\exists h'\in\cH,\ h'$는 $C'$에서 $h$와 같고 $c_1$에서 다름$\}$이라 하면 $Y_1=\cH'_{C'}$. 귀납 가정으로 $\lvert Y_1\rvert\le\#\{B\subseteq C':\cH'\text{가 분쇄}\}$.
- $\cH'$가 $B\subseteq C'$를 분쇄하면 $\cH$는 $B\cup\{c_1\}$을 분쇄합니다(짝 $h,h'$로 $c_1$의 값을 마음대로 고름). 따라서 $\lvert Y_1\rvert\le\#\{B\subseteq C:c_1\in B,\ \cH\text{가 분쇄}\}$.

두 집합은 $c_1$의 포함 여부로 나뉜 서로소이므로 합이 $\#\{B\subseteq C:\cH\text{가 분쇄}\}$.
:::

:::note 노트의 한 곳을 바로잡습니다
강의 노트는 “$\cH'$가 $B$를 분쇄 $\iff$ $\cH$가 $B\cup\{c_1\}$을 분쇄”를 동치로 적었지만, **역방향은 일반적으로 거짓**입니다. 예: $C=\{c_1,c_2\}$, $\cH=\{(0,0),(1,1)\}$(순서대로 $c_1,c_2$의 값)이면 $\cH$는 $\{c_1\}$을 분쇄하지만, $c_2$에서 같고 $c_1$에서 다른 짝이 없어 $\cH'=\emptyset$이고 $\cH'$는 $\emptyset$조차 분쇄하지 못합니다. 증명에 필요한 것은 **정방향**(단사 $B\mapsto B\cup\{c_1\}$)뿐이므로 결론은 그대로입니다.
:::
` },
      { k: '6.5b', p: 75, title: '성장 함수가 작으면 균등수렴한다', body: R`
:::key 성장 함수의 균등수렴 상한
모든 $\cD$와 $\delta\in(0,1)$에 대해 확률 $1-\delta$ 이상으로($S\sim\cD^m$) 모든 $h\in\cH$에서
$$\lvert L_\cD(h)-L_S(h)\rvert\le\frac{4+\sqrt{\ln\tau_\cH(2m)}}{\delta\sqrt{2m}}.$$
:::

증명은 “유령 표본” $S'$를 하나 더 뽑아 $L_\cD(h)$를 $L_{S'}(h)$로 바꾸고, $S\cup S'$의 $2m$개 점 위에서 $\cH$가 $\tau_\cH(2m)$가지로만 행동한다는 것을 이용해 유한 클래스처럼 합집합 상한을 쓰는 것입니다(교재 6.5.2의 별표 절).

**기본 정리의 마지막 고리(6⇒1).** $\VC=d$이면 사우어로 $\tau_\cH(2m)\le(2em/d)^d$이므로 상한이
$$\frac{4+\sqrt{d\ln(2em/d)}}{\delta\sqrt{2m}}\xrightarrow{m\to\infty}0,$$
즉 균등수렴이 성립합니다. 이 상한은 $\delta$가 분모에 $1/\delta$로 들어가 거칠지만, 정성적 결론(유한 VC ⇒ 균등수렴)에는 충분합니다. 정량적 형태의 $\ln(1/\delta)$는 더 정교한 논증(28장)에서 나옵니다.
` },
    ],
    problems: [
      { sec: '6.1', type: 'num', lv: 1, q: R`임계 함수 클래스에서 $\varepsilon=0.02$, $\delta=0.01$일 때 상한 $\lceil\ln(2/\delta)/\varepsilon\rceil$은?`, ans: '265', ansTex: R`\lceil50\ln200\rceil=265`,
        sol: R`$\ln200=5.298$, $\div0.02=264.9$이므로 265.` },
      { sec: '6.1', type: 'mc', lv: 2, q: R`임계 함수 증명에서 실패 확률이 $2(1-\varepsilon)^m$으로 눌리는 이유는?`,
        choices: [R`가설이 두 개뿐이므로`, R`실패하려면 표본이 참 경계 양쪽의 질량 $\varepsilon$ 구간 중 하나를 통째로 피해야 하므로`, R`호프딩 부등식`, R`VC 차원이 2이므로`], ans: 1,
        sol: R`한 구간을 $m$개 모두 피할 확률이 $(1-\varepsilon)^m$이고 구간이 둘이라 합집합 상한으로 2배입니다.` },
      { sec: '6.2', type: 'mc', lv: 1, q: R`$\VC(\cH)=3$을 보이기 위해 필요한 것은?`,
        choices: [R`모든 3점 집합이 분쇄되고, 어떤 4점 집합이 분쇄되지 않음`, R`어떤 3점 집합이 분쇄되고, 모든 4점 집합이 분쇄되지 않음`, R`어떤 3점 집합이 분쇄되고, 어떤 4점 집합이 분쇄되지 않음`, R`$\lvert\cH\rvert=8$`], ans: 1,
        sol: R`하한은 존재(분쇄되는 집합 하나), 상한은 전칭(크기 $d+1$인 모든 집합이 분쇄 안 됨)입니다.` },
      { sec: '6.3', type: 'num', lv: 1, q: R`$\mathbb R$ 위의 구간 클래스 $\{\one[a\le x\le b]\}$의 VC 차원은?`, ans: '2', ansTex: R`2`,
        sol: R`두 점은 네 레이블링 모두 가능(빈 구간 포함). 세 점 $c_1<c_2<c_3$에서 $(1,0,1)$은 구간이 $c_1,c_3$을 담으면 $c_2$도 담으므로 불가.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`$\mathbb R$ 위에서 “구간 두 개의 합집합” 클래스 $\{\one[x\in[a_1,b_1]\cup[a_2,b_2]]\}$의 VC 차원은?`, ans: '4', ansTex: R`4`,
        sol: R`4점은 1인 점들이 최대 두 덩어리이므로 모두 가능. 5점 $c_1<\dots<c_5$의 $(1,0,1,0,1)$은 1의 덩어리가 3개라 불가. 일반적으로 구간 $k$개의 합집합은 $2k$.` },
      { sec: '6.3', type: 'num', lv: 1, q: R`$\lvert\cH\rvert=100$인 유한 클래스의 VC 차원의 상한 $\lfloor\log_2100\rfloor$은?`, ans: '6', ansTex: R`6`,
        sol: R`$d$점을 분쇄하려면 $2^d\le100$, $d\le6.64$이므로 $d\le6$.` },
      { sec: '6.5', type: 'num', lv: 2, q: R`$\VC(\cH)=2$일 때 사우어 보조정리가 주는 $\tau_\cH(10)$의 상한 $\sum_{i=0}^2\binom{10}i$는?`, ans: '56', ansTex: R`1+10+45=56`,
        sol: R`$\binom{10}0+\binom{10}1+\binom{10}2=1+10+45=56$. 모든 레이블링 $2^{10}=1024$에 비해 훨씬 작습니다.` },
      { sec: '6.5', type: 'num', lv: 2, q: R`구간 클래스(VC 2)가 서로 다른 10개 점 위에서 실제로 만드는 레이블링 수는? (빈 레이블링 포함)`, ans: '56', ansTex: R`1+10+\binom{10}2=56`,
        sol: R`1로 표시되는 점들은 연속한 덩어리여야 합니다. 빈 것 1가지, 덩어리 $[i,j]$는 $\binom{10}2+10=55$가지, 합 56. 사우어 상한과 같아 이 경우 상한이 정확합니다.` },
      { sec: '6.5', type: 'mc', lv: 3, q: R`사우어 보조정리의 귀납 증명에서 $\lvert Y_1\rvert\le\#\{B\subseteq C:c_1\in B,\ \cH\text{가 분쇄}\}$를 얻을 때 필요한 것은?`,
        choices: [R`$\cH$가 $B\cup\{c_1\}$을 분쇄하면 $\cH'$가 $B$를 분쇄한다`, R`$\cH'$가 $B$를 분쇄하면 $\cH$가 $B\cup\{c_1\}$을 분쇄한다`, R`$Y_0=\cH_{C'}$`, R`$\cH'=\cH$`], ans: 1,
        sol: R`귀납 가정으로 $\lvert Y_1\rvert\le\#\{B:\cH'\text{가 }B\text{를 분쇄}\}$이고, 정방향 함의로 $B\mapsto B\cup\{c_1\}$이 “$\cH$가 분쇄하는 $c_1$ 포함 집합”으로 가는 단사가 됩니다. 역방향은 필요 없고 일반적으로 거짓입니다.` },
      { sec: '6.4', type: 'mc', lv: 2, q: R`이진 분류 0–1 손실에서 학습의 기본 정리의 동치에 **들어 있지 않은** 것은?`,
        choices: [R`균등수렴`, R`불가지 PAC 학습가능`, R`$\lvert\cH\rvert<\infty$`, R`$\VC(\cH)<\infty$`], ans: 2,
        sol: R`유한 클래스는 충분조건일 뿐입니다. 임계 함수처럼 무한이지만 VC 차원이 유한한 클래스도 학습가능합니다.` },
      { sec: '6.5b', type: 'mc', lv: 2, q: R`VC 차원이 $d$일 때 성장 함수 상한 $\frac{4+\sqrt{\ln\tau_\cH(2m)}}{\delta\sqrt{2m}}$이 $m\to\infty$에서 0으로 가는 이유는?`,
        choices: [R`$\tau_\cH(2m)=2^{2m}$이므로`, R`사우어로 $\ln\tau_\cH(2m)\le d\ln(2em/d)$라 분자가 $\sqrt{\ln m}$ 정도로만 자라므로`, R`$\delta\to0$이므로`, R`호프딩 부등식의 지수 꼬리 때문에`], ans: 1,
        sol: R`분자 $\sim\sqrt{d\ln m}$, 분모 $\sim\sqrt m$이라 비가 0으로 갑니다. 분쇄된다면($2^{2m}$) 분자가 $\sqrt{2m\ln2}$로 자라 0으로 가지 않습니다.` },
      { sec: '6.3', type: 'open', lv: 2, proof: true, q: R`$\mathbb R^2$의 축에 나란한 직사각형 분류기 클래스의 VC 차원이 4임을 증명하세요.`,
        sol: R`
**$\ge4$.** 네 점 $(1,0),(-1,0),(0,1),(0,-1)$을 잡습니다. 1로 표시할 부분집합 $P$가 주어지면, $P$의 점들만 담는 직사각형이 있습니다: 각 점은 한 축 방향으로 “바깥쪽 끝”이므로, $P$의 점들의 좌표 범위로 만든 가장 작은 직사각형은 $P$ 밖의 점을 담지 않습니다($P=\emptyset$이면 빈 직사각형). 따라서 16가지 모두 가능.
**$\le4$.** 임의의 다섯 점 $C$에서 $x$최소·$x$최대·$y$최소·$y$최대인 점(많아야 4개)을 1, 그 밖의 점 $c$를 0으로 둔 레이블링을 봅니다. 1인 점들을 담는 직사각형은 $C$의 $x$범위와 $y$범위를 모두 덮으므로 $c$도 담아 1로 표시합니다. 이 레이블링이 불가능하므로 다섯 점 집합은 분쇄되지 않습니다.`,
        rubric: R`
- 네 점 집합 제시와 모든 부분집합 실현 논증 — 4점
- 임의의 다섯 점에서 극점 선택 — 3점
- 남은 점이 포함됨을 보여 모순 — 3점` },
      { sec: '6.5', type: 'open', lv: 3, proof: true, q: R`$\lvert\cH_C\rvert\le\lvert\{B\subseteq C:\cH\text{가 }B\text{를 분쇄}\}\rvert$를 $\lvert C\rvert$에 대한 귀납법으로 증명하고, 이로부터 사우어 보조정리 $\tau_\cH(m)\le\sum_{i=0}^d\binom mi$를 이끌어 내세요.`,
        sol: R`
기저: $C=\emptyset$이면 $\lvert\cH_C\rvert=1$, 분쇄되는 부분집합은 $\emptyset$ 하나.
단계: $C'=C\setminus\{c_1\}$, $Y_0$, $Y_1$을 정의하면 $\lvert\cH_C\rvert=\lvert Y_0\rvert+\lvert Y_1\rvert$.
$Y_0=\cH_{C'}$ → 귀납 가정으로 $\le\#\{B\subseteq C:c_1\notin B,\text{분쇄}\}$.
$\cH'$(짝이 있는 가설)에 대해 $Y_1=\cH'_{C'}$ → 귀납 가정으로 $\le\#\{B\subseteq C':\cH'\text{가 분쇄}\}$. $\cH'$가 $B$를 분쇄하면, $B$의 각 레이블링을 실현하는 $h\in\cH'$와 그 짝 $h'$가 $c_1$에서 0과 1을 모두 주므로 $\cH$가 $B\cup\{c_1\}$을 분쇄. 이 대응은 단사라 $\le\#\{B\subseteq C:c_1\in B,\text{분쇄}\}$.
두 경우를 더하면 결론. 사우어: $\VC\le d$이면 분쇄되는 $B$는 크기 $\le d$이고 그런 $B\subseteq C$는 $\sum_{i\le d}\binom mi$개. $C$에 대해 최대를 취하면 $\tau_\cH(m)$의 상한.`,
        rubric: R`
- 기저와 $\lvert\cH_C\rvert=\lvert Y_0\rvert+\lvert Y_1\rvert$ — 2점
- $Y_0$ 상한 — 2점
- $\cH'$ 정의, $Y_1=\cH'_{C'}$, 정방향 함의와 단사 — 4점
- 사우어 보조정리로의 결론 — 2점` },
    ],
  });
})();
