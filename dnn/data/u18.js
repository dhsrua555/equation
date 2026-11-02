/* 18 바론 정리와 일반화 — 8주차 수요일 필기 7–9쪽(바론 클래스의 예비), 9주차 월요일(10/26) 필기 1–9쪽
   (바론 정리, Maurey 보조정리, 헤비사이드의 볼록 껍질, 정리의 완성, 모집단·경험적 위험, 라데마허 복잡도) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 18, part: 'F', title: '바론 정리와 일반화', en: 'Barron’s Theorem & Generalization', ref: 'W8 수 · W9 월 필기', plot: 'barron',
    fig: R`Maurey 보조정리: 볼록 껍질의 한 점을 무작위 표본 $N$개의 평균으로 근사할 때의 제곱 오차(점)는 평균적으로 굵은 곡선 $B^2/N$ 아래에 있고, 하나하나는 그 위아래로 흩어진다`,
    tagline: R`푸리에 진폭의 1차 모멘트가 $C$ 이하인 함수는 은닉 뉴런 $N$개로 평균 제곱 오차 $4C^2/N$ 근처까지 근사됩니다. 식에 차원 $d$가 없습니다. 무작위로 뽑은 $N$개의 평균이 분산 $1/N$로 모인다는 Maurey의 논법이 핵심이고, 같은 무작위성의 생각이 라데마허 복잡도로 일반화 오차 $O(1/\sqrt n)$를 줍니다.`,
    summary: R`17단원의 보편 근사 정리는 근사가 **가능하다**는 것만 말하고 뉴런이 몇 개 필요한지는 말하지 않습니다. 이 단원은 푸리에 변환으로 정의한 **바론 클래스** $\Gamma_C$의 함수에 대해, 은닉층 하나짜리 망이 뉴런 $N$개로 평균 제곱 오차 $c/N$ ($c>4C^2$)을 얻는다는 **바론 정리**를 증명합니다. 증명은 (1) 힐베르트 공간에서 볼록 껍질의 점을 원소 $N$개의 평균으로 $B^2/N$까지 근사하는 **Maurey 보조정리**(무작위 뽑기와 교차항 소거), (2) $f-f(0)$이 높이 $2C$ 이하인 헤비사이드 능선 함수들의 볼록 껍질에 있다는 **바론의 보조정리**(푸리에 역변환, 확률측도 $\Lambda$, 코사인 능선의 계단 근사), (3) 헤비사이드를 기울기가 큰 시그모이드로 바꾸기의 세 단계입니다. 후반부는 **일반화**로 넘어가 모집단 위험과 경험적 위험, 근사·일반화·최적화의 세 갈래 분해를 정리하고, **라데마허 복잡도**로 둘의 차이가 $2\operatorname{Rad}_n+O(1/\sqrt n)$임과 노름이 유계인 선형 클래스의 $Q/\sqrt n$을 보입니다. 필기의 조건 “$c>4C_1$”은 $c>4C^2$으로, 칠판의 $1/\sqrt{2n}$은 정확한 확률 한계로 바로잡습니다.`,
    goals: [
      R`이 단원의 푸리에 변환 규약을 쓰고, 바론 클래스 $\Gamma_C$를 정의하며 그 함수가 $C$-립시츠임을 보일 수 있다`,
      R`바론 정리를 정확히 진술하고(조건 $c>4C^2$, 정규화된 평균 제곱 오차), 격자 근사의 $\varepsilon^{-d}$와 비교해 차원의 저주를 설명할 수 있다`,
      R`Maurey 보조정리를 무작위 뽑기, 교차항 소거, 확률적 방법, 삼각 부등식으로 증명할 수 있다`,
      R`바론의 보조정리의 증명 흐름(푸리에 역변환, 위상 $\kappa$, 확률측도 $\Lambda$, 코사인 능선의 계단 근사)을 설명하고 높이 $2C$가 어디서 오는지 말할 수 있다`,
      R`두 보조정리와 $\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$로 정리 1을 완성하고, 필요한 뉴런 수를 계산할 수 있다`,
      R`모집단 위험과 경험적 위험을 정의하고, 초과 위험을 최적화·일반화·근사의 세 항으로 나누는 부등식을 증명할 수 있다`,
      R`라데마허 복잡도를 정의하고 작은 클래스에서 계산하며, 대칭화로 $2\operatorname{Rad}_n$ 한계를, 선형 클래스에서 $Q/\sqrt n$을 증명할 수 있다`,
    ],
    secTitles: { '18.1': '바론 클래스', '18.2': '바론 정리', '18.3': 'Maurey 보조정리', '18.4': '헤비사이드의 볼록 껍질', '18.5': '정리의 완성', '18.6': '위험과 일반화', '18.7': '라데마허 복잡도' },
    sections: [
      { k: '18.1', src: 'W8 수 필기 7–8쪽, W9 월 필기 1쪽', title: '푸리에 변환과 바론 클래스', body: R`
:::idea 쉽게 말하면
함수가 얼마나 “울퉁불퉁한지”를 주파수로 잴 수 있습니다. 푸리에 변환 $\hat f(\xi)$는 함수 안에 주파수 $\xi$인 물결이 얼마나 들어 있는지를 알려 줍니다. **바론 클래스**는 진폭 $|\hat f(\xi)|$에 주파수의 크기 $|2\pi\xi|$를 곱해 모두 더한 값이 유한한 함수, 곧 빠르게 출렁이는 성분이 많지 않은 함수들의 모임입니다. 18.2절의 정리는 이런 함수를 은닉층 하나짜리 신경망으로 **차원과 무관한 속도**로 근사할 수 있다고 말합니다.
:::

**푸리에 변환** (W8 수 필기 7쪽, W9 월 필기 1쪽). $f\in L^1(\mathbb R^d)$, 곧 $\int_{\mathbb R^d}|f(x)|\,dx<\infty$인 함수에 대해
$$\hat f(\xi)=\int_{\mathbb R^d}f(x)\,e^{-2\pi i\,\xi^Tx}\,dx,\qquad\xi\in\mathbb R^d.$$
$\hat f$도 적분가능하면($\hat f\in L^1$) 역변환 $f(x)=\int_{\mathbb R^d}\hat f(\xi)\,e^{2\pi i\,\xi^Tx}\,d\xi$로 되돌아옵니다. 지수에 $2\pi$를 넣는 이 규약에서는 역변환에 앞 계수가 없고, $\nabla f$의 변환이 $2\pi i\,\xi\,\hat f(\xi)$입니다[[@em:ch10:11.9|공학수학의 푸리에 변환은 계수 1/√(2π)와 e^(−iwx)를 쓰는 다른 규약입니다. 주파수를 w = 2πξ로 바꾸어 읽으면 같은 내용입니다.]].

**예비: 소볼레프 공간** (W8 수 필기 7쪽). 필기는 먼저
$$f\in H^s(\mathbb R^d)\iff\int_{\mathbb R^d}|\hat f(\xi)|^2(1+|\xi|^2)^s\,d\xi<\infty$$
를 적었습니다. 미분 한 번이 $\hat f$에 $2\pi i\xi$를 곱하는 것이므로, 무게 $(1+|\xi|^2)^s$는 “$s$번 미분해도 제곱적분이 유한하다”를 주파수 쪽에서 말한 것입니다. 바론 클래스는 이 생각에서 제곱의 적분($L^2$)을 절댓값의 적분($L^1$)으로, 무게를 $|\xi|$ 한 번으로 바꾼 것입니다.

:::key 바론 클래스
$C>0$에 대해
$$\Gamma_C:=\Big\{f\in L^1(\mathbb R^d):\ \lVert\hat f\rVert_{L^1(\mathbb R^d)}<\infty,\ \int_{\mathbb R^d}|2\pi\xi|\,|\hat f(\xi)|\,d\xi<C\Big\}.$$
$f\in\Gamma_C$이면 모든 $x,y$에서 $|f(x)-f(y)|\le C|x-y|$이다.
:::

필기는 이 상수를 $C_1$이라 적었습니다. 이 단원에서는 $C$로 씁니다.

**무엇을 재는가.** $\int|2\pi\xi||\hat f(\xi)|d\xi$는 기울기 $\nabla f$의 푸리에 진폭 $|2\pi i\xi\hat f(\xi)|$를 모두 더한 것입니다. 역변환에서 $f(x)-f(y)=\int\hat f(\xi)\big(e^{2\pi i\xi^Tx}-e^{2\pi i\xi^Ty}\big)d\xi$이고 $|e^{iu}-e^{iv}|\le|u-v|$이므로
$$|f(x)-f(y)|\le\int|\hat f(\xi)|\,2\pi|\xi^T(x-y)|\,d\xi\le|x-y|\int|2\pi\xi||\hat f(\xi)|\,d\xi\le C|x-y|.$$
곧 바론 클래스의 함수는 $C$-립시츠입니다[[@base:ch05:5.1|립시츠 조건.]]. 고주파 성분은 $|\xi|$가 커서 무게가 크므로, 빠르게 출렁이는 함수일수록 $C$가 커집니다.

:::ex 예제 1 — 가우시안의 바론 상수
$d=1$에서 $f(x)=e^{-\pi x^2}$의 푸리에 변환은 $\hat f(\xi)=e^{-\pi\xi^2}$입니다. $\int|2\pi\xi||\hat f(\xi)|d\xi$를 구하고, $f$가 어떤 $C$에 대해 $\Gamma_C$에 드는지 말하세요.
---
대칭성으로 $\int_{-\infty}^{\infty}2\pi|\xi|e^{-\pi\xi^2}d\xi=2\int_0^\infty2\pi\xi e^{-\pi\xi^2}d\xi=2\big[-e^{-\pi\xi^2}\big]_0^\infty=2$. $\hat f$도 적분가능하므로($\int e^{-\pi\xi^2}d\xi=1$) $C>2$인 모든 $C$에 대해 $f\in\Gamma_C$입니다. 실제로 $|f'(x)|=2\pi|x|e^{-\pi x^2}$의 최댓값은 $\sqrt{2\pi}e^{-1/2}\approx1.52$로, 립시츠 상수의 상한 2 아래에 있습니다.
:::

**정의역이 공 안일 때** (W8 수 필기 8쪽). 신경망을 실제로 쓰는 곳은 단위 공 같은 유계 영역 $\Omega$입니다. $\Omega$ 위에서만 정의된 $f$에는 푸리에 변환이 없으므로, $\mathbb R^d$ 전체로 **연장**한 함수 $f_e$ ($f_e|_\Omega=f$)의 변환을 씁니다. 연장은 무수히 많으므로 그중 가장 좋은 것을 고릅니다:
$$B^s(\Omega)=\Big\{f:\Omega\to\mathbb C\ :\ \lVert f\rVert_{B^s(\Omega)}:=\inf_{f_e|_\Omega=f}\int_{\mathbb R^d}(1+|\xi|)^s|\hat f_e(\xi)|\,d\xi<\infty\Big\}.$$
필기의 그림에서 파란 구간이 $\Omega$, 그 위의 빨간 곡선이 $f$, 밖의 초록 선이 연장한 부분입니다(“$f$의 extension 중에서 $\Omega$에서는 $f$와 같다”). 밖을 급하게 꺾어 이으면 고주파가 생겨 적분이 커지므로, 하한은 가장 부드럽게 이어 붙인 연장이 정합니다. $|2\pi\xi|\le2\pi(1+|\xi|)$이므로 $\lVert f\rVert_{B^1(\Omega)}$이 작으면 (좋은 연장에 대해) 바론 상수도 작습니다.

:::fig extend
:::

:::warn 필기의 기호
필기는 $\Gamma_{C_1}$, $C_1$처럼 아래첨자를 붙였다 뗐다 했습니다. 같은 상수이고, 이 단원은 $C$로 통일합니다. $|\xi|$는 유클리드 노름 $\lVert\xi\rVert_2$입니다.
:::

### 더 깊이

$\lVert\hat f\rVert_{L^1}<\infty$는 역변환 공식이 모든 점에서 성립하게 해 주고(이때 $f$는 연속), 18.4절의 증명이 $f(x)-f(0)$을 적분 하나로 쓰는 데 쓰입니다. 바론 클래스에 들지 않는 예로, 구간의 지시함수 $\mathbf 1_{[-1,1]}$은 $\hat f(\xi)=\frac{\sin2\pi\xi}{\pi\xi}$가 $1/|\xi|$ 정도로만 줄어 $\int|\xi||\hat f|d\xi=\infty$입니다. 이런 함수도 $L^2$에서는 신경망으로 근사할 수 있지만, 18.2절의 속도는 보장되지 않습니다.
` },
      { k: '18.2', src: 'W8 수 필기 8–9쪽, W9 월 필기 1·4쪽', title: '바론 정리와 차원의 저주', body: R`
:::idea 쉽게 말하면
바론 클래스의 함수라면 은닉 뉴런 $N$개로 평균 제곱 오차를 $\frac cN$ 아래로 만들 수 있고, $c$는 $4C^2$보다 조금만 크면 됩니다. 놀라운 점은 이 식에 **입력 차원 $d$가 없다**는 것입니다. 공간을 격자로 잘게 나누는 고전적 근사는 차원이 커지면 필요한 칸 수가 지수적으로 늘어나는데(차원의 저주), 바론 함수에는 그런 일이 일어나지 않습니다.
:::

:::key 바론 정리 (정리 1)
$\sigma:\mathbb R\to\mathbb R$가 시그모이드이고 $f\in\Gamma_C$ ($C>0$)라 하자. 단위 공을 $B_1^d:=\{x\in\mathbb R^d:\lVert x\rVert\le1\}$이라 하면, 모든 $c>4C^2$과 $N\in\mathbb N$에 대해 은닉 뉴런이 $N$개인 신경망 $\Phi_N$이 있어
$$\frac1{|B_1^d|}\int_{B_1^d}|f(x)-\Phi_N(x)|^2\,dx\le\frac cN.$$
$\Phi_N(x)=f(0)+\sum_{i=1}^N\frac{\gamma_i}N\,\sigma(\langle a_i,x\rangle+b_i)$, $|\gamma_i|\le2C$의 꼴로 고를 수 있다.
:::

$|B_1^d|$은 단위 공의 부피이므로 좌변은 공 위에서의 **평균** 제곱 오차입니다. 시그모이드는 17.4절의 정의(연속이고 $-\infty$에서 0, $+\infty$에서 1로 가는 함수)를 따릅니다[[ch17:17.4|시그모이드와 판별 함수.]].

:::hand 수업 필기 — 정리 1 (W8 수 9쪽, W9 월 1쪽)
“Let $\sigma:\mathbb R\to\mathbb R$ sigmoid and let $f\in\Gamma_{C_1}$ for some $C_1>0$. Denote by $B_1^d:=\{x\in\mathbb R^d:\lVert x\rVert\le1\}$ the unit ball. Then, for every $c>4C_1^2$ and $N\in\mathbb N$, $\exists$ a NN $\Phi=f_N$ w/ $N$ neurons s.t. $\frac1{|B_1^d|}\int_{B_1^d}|f(x)-\Phi(x)|^2dx\le\frac cN$.”
그 아래에 파란 글씨로 “(curse of dimensionality)”라고 적었습니다.
:::

:::warn 조건은 c > 4C²
10월 26일 필기의 정리 1은 “$c>4C_1$”로 적혀 있지만, 같은 날 증명의 끝(18.5절)은 $\frac{4C_1^2}N$을 얻고, 10월 21일 필기도 $4C_1^2$입니다. 증명에서 Maurey 보조정리에 $B=2C$를 넣어 $B^2=4C^2$이 나오므로 **옳은 조건은 $c>4C^2$**입니다. 또 18.5절 필기의 마지막 식은 $\int_{B_1^d}$ 앞에 $\frac1{|B_1^d|}$을 빠뜨렸는데, 증명에 쓰는 노름 $\lVert\cdot\rVert_{L^2_\circ}$가 정규화되어 있으므로 정리처럼 **평균**으로 읽어야 합니다.
:::

**차원의 저주** (W9 월 필기 1쪽). 비교를 위해 격자 근사를 봅시다. $[0,1]^d$를 한 변이 $h$인 작은 정육면체로 나누고 칸마다 상수를 쓰면, $L$-립시츠 함수의 오차는 $L\sqrt d\,h$ 이하이지만 칸 수가 $h^{-d}$입니다. 오차 $\varepsilon$을 원하면 $h\approx\varepsilon$이므로 매개변수가 대략 $\varepsilon^{-d}$개 필요합니다. 일반적으로 매끄러움이 $s$인 함수를 고정된 기저 $N$개로 근사하는 방법은 오차가 $N^{-s/d}$ 정도로만 줄어, $d$가 크면 사실상 줄지 않습니다.

| 목표 RMS 오차 $\varepsilon=0.1$ | $d=1$ | $d=10$ | $d=100$ |
|---|---|---|---|
| 격자 칸 수 $\varepsilon^{-d}$ | $10$ | $10^{10}$ | $10^{100}$ |
| 바론: 뉴런 수 $\approx4C^2/\varepsilon^2$ | $400C^2$ | $400C^2$ | $400C^2$ |

바론 정리의 평균 제곱 오차 $\frac cN$의 제곱근, 곧 RMS 오차는 $\sqrt{c/N}$이므로 $\varepsilon$을 얻는 데 $N\approx c/\varepsilon^2$개면 되고, 이는 $d$와 무관합니다. 신경망이 고차원 입력(이미지는 $d$가 수만)에서도 통하는 이유에 대한 이론적 실마리 가운데 하나입니다.

:::warn 대가는 C에 숨어 있다
$d$가 식에 없다고 해서 고차원이 공짜는 아닙니다. 같은 모양의 함수도 차원이 커지면 바론 상수 $C$가 커질 수 있습니다(예: $d$차원 가우시안 $e^{-\pi|x|^2}$의 $\int|2\pi\xi||\hat f|d\xi$는 대략 $\sqrt{2\pi d}$). 또 정리는 그런 신경망이 **존재**한다는 것이지, 경사하강법이 그것을 **찾는다**는 보장은 아닙니다(17.1절의 최적화 오차).
:::

**증명의 설계** (W9 월 필기 4쪽). 필기는 “이 보조정리(Maurey)는 $\Gamma_{C_1}$의 각 함수가 신경망들의 **볼록 껍질**에 속함을 보이면 정리 1을 보일 수 있음을 시사한다”고 적었습니다. 증명은 세 단계입니다.
1. **Maurey 보조정리** (18.3절): 노름이 $B$ 이하인 원소들의 볼록 껍질(의 폐포)에 있는 점은 그 원소 $N$개의 평균으로 제곱 오차 $\frac{B^2}N$ 근처까지 근사된다.
2. **바론의 보조정리** (18.4절): $f-f(0)$은 높이가 $2C$ 이하인 헤비사이드 능선 함수들의 볼록 껍질의 폐포에 있다.
3. **완성** (18.5절): 1에 $B=2C$를 넣고, 헤비사이드를 기울기가 큰 시그모이드로 바꾼다.

:::ex 예제 2 — 필요한 뉴런 수
$C=1$인 바론 함수를 단위 공에서 평균 제곱 오차 $0.01$ 이하로 근사할 때, 정리 1이 보장하는 가장 작은 $N$은?
---
$c>4$인 $c$를 골라 $\frac cN\le0.01$, 곧 $N\ge100c$이면 됩니다. $c$는 4보다 조금만 크면 되므로($c=4.01$) $N=401$이면 되고, $N=400$이면 $c\le4$여야 하므로 정리로는 보장되지 않습니다. 따라서 $N=401$. 차원 $d$는 계산에 들어가지 않습니다.
:::
` },
      { k: '18.3', src: 'W9 월 필기 1–4쪽', title: 'Maurey 보조정리: 볼록 껍질과 무작위 표본', body: R`
:::idea 쉽게 말하면
볼록 껍질 안의 점 $f^*=\sum_j\alpha_jh_j$는 꼭짓점들의 가중 평균입니다. 가중치 $\alpha_j$를 확률로 보고 꼭짓점을 $N$번 **무작위로 뽑아** 평균하면, 그 평균의 기댓값은 $f^*$이고 흩어짐(분산)은 $\frac1N$배로 줄어듭니다. 미니배치 기울기의 분산이 배치 크기에 반비례하는 것과 같은 원리입니다[[ch10:10.2|미니배치 평균의 분산은 1/B배.]]. 그러면 오차가 $\frac{B^2}N$ 이하인 뽑기 결과가 적어도 하나는 있습니다.
:::

**볼록 껍질** (W9 월 필기 1쪽). 집합 $G$의 볼록 껍질은 $G$의 원소들의 볼록 결합 전체입니다:
$$\operatorname{co}(G):=\Big\{\sum_{j=1}^n\alpha_jx_j\ :\ n\in\mathbb N,\ x_j\in G,\ \alpha_j\ge0,\ \sum_j\alpha_j=1\Big\}.$$
$\overline{\operatorname{co}}(G)$는 그 **폐포**, 곧 $\operatorname{co}(G)$의 원소들로 얼마든지 가깝게 근사되는 점 전체입니다[[@robot:ch03|볼록 집합과 볼록 껍질(로봇공학의 파지 단원).]]. 필기는 $\alpha_j>0$으로 적었는데, 0인 항은 빼면 되므로 같은 집합입니다. 힐베르트 공간은 내적이 있고 완비인 공간이며, 여기서는 $\mathbb R^m$이나 18.4절의 $L^2_\circ(B_1^d)$처럼 길이와 각을 잴 수 있는 공간으로 생각하면 충분합니다[[@em:ch17:3.2d|힐베르트 공간.]].

:::key Maurey 보조정리 (보조정리 1)
$H$가 힐베르트 공간이고 $G\subset H$의 모든 원소가 $\lVert g\rVert_H\le B$를 만족한다고 하자. $f\in\overline{\operatorname{co}}(G)$이면 모든 $N\in\mathbb N$과 $c>B^2$에 대해 $g_1,\dots,g_N\in G$가 있어
$$\Big\lVert f-\frac1N\sum_{i=1}^Ng_i\Big\rVert_H^2\le\frac cN.$$
:::

:::hand 수업 필기 — 증명 (W9 월 2–3쪽)
$\varepsilon>0$과 $N\in\mathbb N$을 고정합니다. $f\in\overline{\operatorname{co}}(G)$이므로 합이 1인 계수 $\alpha_1,\dots,\alpha_m\in[0,1]$과 원소 $h_1,\dots,h_m\in G$가 있어 $f^*=\sum_{j=1}^m\alpha_jh_j$가 $\lVert f-f^*\rVert_H<\varepsilon$을 만족합니다.

**주장.** 각각 $\{h_1,\dots,h_m\}$에 속하는 $g_1,\dots,g_N$이 있어
$$\Big\lVert f^*-\frac1N\sum_{i=1}^Ng_i\Big\rVert_H^2\le\frac{B^2}N.\qquad(3)$$
$\varepsilon$은 임의이므로 이 주장이 증명을 끝냅니다(마지막 단계).

**무작위로 뽑기.** $X_1,\dots,X_N$을 $\mathbb P[X_i=h_j]=\alpha_j$ ($j=1,\dots,m$)인 독립 동일 분포 확률변수라 하면 $\E[X_i]=\sum_j\mathbb P(X_i=h_j)\,h_j=\sum_j\alpha_jh_j=f^*$.

**전개.** $f^*=\frac1N\sum_{j=1}^Nf^*$로 쓰고 $\big\lVert\sum_iv_i\big\rVert^2=\sum_i\lVert v_i\rVert^2+\sum_{i\ne j}\langle v_i,v_j\rangle$을 쓰면
$$\begin{aligned}\E\Big\lVert f^*-\frac1N\sum_{j=1}^NX_j\Big\rVert^2&=\E\Big\lVert\frac1N\sum_{j=1}^N(f^*-X_j)\Big\rVert^2\\&=\frac1{N^2}\E\Big[\sum_{j=1}^N\lVert f^*-X_j\rVert^2+\sum_{i\ne j}\langle f^*-X_i,f^*-X_j\rangle\Big].\end{aligned}$$

**교차항은 0.** $i\ne j$이면 독립성에서 $\E\langle X_i,X_j\rangle=\langle\E X_i,\E X_j\rangle=\lVert f^*\rVert^2$이므로
$$\E\langle f^*-X_i,f^*-X_j\rangle=\lVert f^*\rVert^2-\langle f^*,\E X_j\rangle-\langle\E X_i,f^*\rangle+\E\langle X_i,X_j\rangle=0.$$

**한 항으로.** 남은 $N$개 항은 분포가 같고 $\E\langle f^*,X_1\rangle=\lVert f^*\rVert^2$, $\lVert X_1\rVert\le B$이므로
$$\begin{aligned}\E\Big\lVert f^*-\frac1N\sum_jX_j\Big\rVert^2&=\frac1N\E\lVert f^*-X_1\rVert^2=\frac1N\E\big[\lVert f^*\rVert^2-2\langle f^*,X_1\rangle+\lVert X_1\rVert^2\big]\\&=\frac1N\big(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2\big)\le\frac{B^2}N.\end{aligned}$$
기댓값이 $\frac{B^2}N$ 이하이므로 $\lVert f^*-\frac1N\sum_jX_j(\omega)\rVert^2\le\frac{B^2}N$인 결과 $\omega$가 적어도 하나 있고, $g_i:=X_i(\omega)$로 두면 (3)입니다.

**마무리 (삼각 부등식).**
$$\Big\lVert f-\frac1N\sum_ig_i\Big\rVert_H\le\lVert f-f^*\rVert_H+\Big\lVert f^*-\frac1N\sum_ig_i\Big\rVert_H\le\varepsilon+\frac B{\sqrt N}<\sqrt{\frac cN}.$$
$c>B^2$이라 $\sqrt{c/N}-B/\sqrt N>0$이고, $\varepsilon$을 그보다 작게 잡으면 마지막 부등호가 성립합니다. 제곱하면 $\lVert f-\frac1N\sum_ig_i\rVert_H^2\le\frac cN$. ∎
:::

**왜 교차항이 사라지나.** 필기의 빨간 표시처럼 이 증명의 핵심은 $f^*-X_i$들이 **평균이 0이고 서로 독립**이라는 것입니다. 그래서 합의 제곱 노름의 기댓값이 각 항의 제곱 노름의 기댓값의 합이 되고(분산의 덧셈), $N$개를 평균하면 $N^2$으로 나누어 $\frac1N$배가 남습니다. $\E\langle X_i,X_j\rangle=\langle\E X_i,\E X_j\rangle$은 $X_i,X_j$가 유한 개의 값만 가지므로 $\sum_{k,l}\alpha_k\alpha_l\langle h_k,h_l\rangle=\big\langle\sum_k\alpha_kh_k,\sum_l\alpha_lh_l\big\rangle$로 직접 확인됩니다.

**확률적 방법.** “기댓값이 $a$ 이하이면 값이 $a$ 이하인 경우가 적어도 하나 있다”는 논법입니다. 모든 경우에 $a$보다 크면 평균도 $a$보다 클 것이기 때문입니다. 무작위성은 존재를 보이는 도구일 뿐, 보조정리 자체는 결정론적인 명제입니다.

:::fig maurey
:::

:::ex 예제 3 — 평면에서 확인하기
$H=\mathbb R^2$, $G=\{h_1,h_2\}=\{(1,0),(0,1)\}$ ($B=1$), $f^*=\frac12h_1+\frac12h_2=(\frac12,\frac12)$일 때 $\E\lVert f^*-\frac1N\sum_jX_j\rVert^2$을 직접 구해 증명의 식과 비교하세요.
---
$N$번 가운데 $h_1$이 뽑힌 횟수를 $K\sim\operatorname{Bin}(N,\frac12)$라 하면 평균은 $(\frac KN,1-\frac KN)$이고, $f^*$와의 차의 제곱 노름은 $2(\frac KN-\frac12)^2$입니다. $\Var(\frac KN)=\frac1{4N}$이므로 기댓값은 $\frac1{2N}$. 증명의 식 $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)=\frac1N(1-\frac12)=\frac1{2N}$과 정확히 같고, 상한 $\frac{B^2}N=\frac1N$보다 작습니다.
:::

:::warn c > B²인 이유
엄격한 부등식은 폐포 때문에 생긴 여유 $\varepsilon$을 흡수하기 위한 것입니다. $f$가 폐포가 아니라 $\operatorname{co}(G)$ 자체에 있으면 $\varepsilon=0$으로 두어 $c=B^2$도 됩니다. 또 증명은 실제로 더 좋은 $\frac{B^2-\lVert f^*\rVert^2}N$을 줍니다.
:::

### 더 깊이

이 보조정리는 Maurey가 처음 보였고 Jones(1992)와 Barron(1993)이 신경망 근사에 썼습니다. 내적의 전개(교차항 소거)를 썼으므로 힐베르트 공간이라는 것이 중요하고, 일반적인 노름 공간에서는 같은 속도가 나오지 않을 수 있습니다. 또 이 논법은 근사 함수를 **$G$의 원소 $N$개의 평균**으로 주므로, $G$를 “뉴런 하나가 만드는 함수들”로 잡으면 곧바로 은닉 뉴런이 $N$개인 신경망이 됩니다. 이것이 18.4–18.5절의 방향입니다.
` },
      { k: '18.4', src: 'W9 월 필기 4–7쪽', title: '헤비사이드 함수의 볼록 껍질', body: R`
:::idea 쉽게 말하면
Maurey 보조정리를 쓰려면 $f$가 “뉴런 하나짜리 함수”들의 볼록 껍질에 있다는 것을 보여야 합니다. 푸리에 역변환은 $f$를 코사인 물결들의 **가중 평균**(적분)으로 씁니다. 가중치를 확률측도로 바꾸면 이것은 볼록 결합의 극한이고, 각 코사인 물결은 한 방향으로만 변하는 1차원 함수라서 **계단(헤비사이드) 함수**의 볼록 결합으로 근사됩니다. 계단 높이의 합이 2를 넘지 않는 것이 $2C$의 출처입니다.
:::

**헤비사이드 능선 함수의 모임** (W9 월 필기 4쪽). $\mathbf 1_{\mathbb R_+}(t)$를 $t\ge0$이면 1, $t<0$이면 0인 헤비사이드 함수라 하고
$$G_C:=\big\{x\in B_1^d\mapsto\gamma\,\mathbf 1_{\mathbb R_+}(\langle a,x\rangle+b)\ :\ a\in\mathbb R^d,\ b\in\mathbb R,\ |\gamma|\le2C\big\}$$
로 둡니다. 원소 하나는 초평면 $\langle a,x\rangle+b=0$의 한쪽에서 $\gamma$, 다른 쪽에서 0인 “절벽” 하나, 곧 활성화 함수가 계단 함수인 **뉴런 하나**입니다.

**노름.** 공 위의 함수에는 정규화된 $L^2$ 노름을 씁니다:
$$\lVert g\rVert_{L^2_\circ(B_1^d)}:=\Big(\frac1{|B_1^d|}\int_{B_1^d}|g(x)|^2dx\Big)^{1/2}.$$
$L^2_\circ(B_1^d)$는 내적 $\langle g,h\rangle=\frac1{|B_1^d|}\int_{B_1^d}gh\,dx$를 가진 힐베르트 공간이고, 상수 1의 노름이 1입니다. 그러므로 $g\in G_C$이면 $\lVert g\rVert_{L^2_\circ}\le|\gamma|\le2C$입니다.

:::key 바론의 보조정리 (보조정리 2)
$d\in\mathbb N$, $C>0$, $f\in\Gamma_C$이면
$$f|_{B_1^d}-f(0)\in\overline{\operatorname{co}}(G_C)$$
이다. 폐포는 노름 $\lVert\cdot\rVert_{L^2_\circ(B_1^d)}$에 대해 취한다. (Barron, 1993)
:::

:::hand 수업 필기 — 증명의 스케치 (W9 월 5–7쪽)
$f\in\Gamma_C$이므로 $f,\hat f\in L^1(\mathbb R^d)$이고, 역변환에서
$$\begin{aligned}f(x)-f(0)&=\int_{\mathbb R^d}\hat f(\xi)\big(e^{2\pi i\langle x,\xi\rangle}-1\big)d\xi\\&=\int_{\mathbb R^d}|\hat f(\xi)|\big(e^{2\pi i\langle x,\xi\rangle+i\kappa(\xi)}-e^{i\kappa(\xi)}\big)d\xi.\end{aligned}$$
여기서 $\kappa(\xi)$는 $\hat f(\xi)$의 위상, 곧 $\hat f(\xi)=|\hat f(\xi)|e^{i\kappa(\xi)}$입니다. $f$가 실숫값이므로 실수부만 남아
$$\begin{aligned}f(x)-f(0)&=\int_{\mathbb R^d}|\hat f(\xi)|\big(\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)\big)d\xi\\&=\int_{\mathbb R^d}\frac{\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)}{|2\pi\xi|}\,|2\pi\xi||\hat f(\xi)|\,d\xi.\end{aligned}$$
새 측도 $\Lambda$를 밀도 $d\Lambda(\xi)=\frac1C|2\pi\xi||\hat f(\xi)|\,d\xi$로 정의하면 $\Lambda$는 $\mathbb R^d$ 위의 확률측도이고(아래 주의 참고)
$$f(x)-f(0)=C\int_{\mathbb R^d}q_x(\xi)\,d\Lambda(\xi),\qquad q_x(\xi):=\frac{\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)}{|2\pi\xi|}.\qquad(5)$$
이 적분을 격자 $\theta\in\frac1n\mathbb Z^d$ 위의 합 $C\sum_\theta q_x(\theta)\Lambda(I_\theta)$로 근사합니다($I_\theta$는 $\theta$를 품는 작은 정육면체). $\Lambda(I_\theta)\ge0$이고 합이 1이므로 이 합은 함수 $x\mapsto Cq_x(\theta)$들의 **볼록 결합**입니다. 필기의 그림: 원래의 적분 $f(x)-f(0)$ ← 근사 → 볼록 결합.
:::

:::fig lattice
:::

:::warn 필기의 Λ와 “conti. even”
$\Gamma_C$의 정의는 $\int|2\pi\xi||\hat f|d\xi<C$ (엄격한 부등식)이므로 밀도를 $C$로 나누면 전체 질량이 1보다 **작습니다**. 고치는 방법은 $C_f:=\int|2\pi\xi||\hat f(\xi)|d\xi<C$로 나누는 것입니다($C_f=0$이면 $f$는 상수라 할 일이 없습니다). 그러면 $\Lambda$는 확률측도이고 (5)의 앞 계수가 $C_f$가 되며, 아래에서 얻는 높이 $2C_f$는 $2C$ 이하라서 그대로 $G_C$에 들어갑니다. 필기가 $q$ 옆에 적은 “conti., even”은 맞는 말입니다. $f$가 실숫값이면 $\hat f(-\xi)=\overline{\hat f(\xi)}$라 $\kappa(-\xi)=-\kappa(\xi)$이고, 따라서 $q_x(-\xi)=q_x(\xi)$입니다.
:::

**빠진 단계: 코사인 능선을 계단으로** (판서에 없는 부분). 필기의 스케치는 $f-f(0)$이 함수 $x\mapsto C_fq_x(\xi)$들의 볼록 결합의 극한임을 보였습니다. 이제 각 $x\mapsto q_x(\xi)$가 높이 2 이하인 헤비사이드 능선들의 볼록 껍질(의 폐포)에 있음을 보이면 됩니다. $\xi\ne0$을 고정하고 $\omega=\xi/|\xi|$, $t=\langle x,\omega\rangle$로 두면 $\lVert x\rVert\le1$에서 $t\in[-1,1]$이고
$$q_x(\xi)=\varphi(t),\qquad\varphi(t):=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}.$$
$\varphi$는 한 방향 $\omega$로만 변하는 **능선 함수**이고 $\varphi(0)=0$, $|\varphi'(t)|=|\sin(2\pi|\xi|t+\kappa)|\le1$입니다. 그래서 공 위에서 $|q_x(\xi)|=|\varphi(t)|\le|t|\le1$이기도 합니다.

**계단 근사.** $t_k=\frac kK$ ($k=0,\dots,K$)로 두고
$$\varphi(t)\approx\sum_{k=1}^K\Delta_k^+\,\mathbf 1_{\mathbb R_+}(t-t_k)+\sum_{k=1}^K\Delta_k^-\,\mathbf 1_{\mathbb R_+}(-t-t_k),\qquad\Delta_k^\pm:=\varphi(\pm t_k)-\varphi(\pm t_{k-1})$$
로 근사합니다. $t_k\le t<t_{k+1}$이면 첫 합은 망원합 $\varphi(t_k)-\varphi(0)=\varphi(t_k)$이고 둘째 합은 0이며, $t<0$이면 반대입니다. $\varphi$가 1-립시츠이므로 오차는 모든 $t\in[-1,1]$에서 $\frac1K$ 이하입니다. 각 항은 $\mathbf 1_{\mathbb R_+}(\langle\pm\omega,x\rangle-t_k)$ 꼴의 헤비사이드 능선이고, 높이의 절댓값의 합은
$$V:=\sum_k|\Delta_k^+|+\sum_k|\Delta_k^-|\le\int_{-1}^1|\varphi'(t)|\,dt\le2.$$
따라서 계단 함수는 $\sum\frac{|\Delta|}V\cdot\big(V\operatorname{sign}(\Delta)\,\mathbf 1_{\mathbb R_+}(\cdots)\big)$, 곧 높이가 $V\le2$인 능선들의 볼록 결합입니다. 앞 계수 $C_f$를 곱하면 높이가 $2C_f\le2C$로 $G_C$에 들어가고, 균등 오차 $\frac{C_f}K$는 $L^2_\circ$ 오차의 상한이므로 $K\to\infty$에서 $x\mapsto C_fq_x(\xi)\in\overline{\operatorname{co}}(G_C)$입니다.

:::fig barronstep
:::

**폐포로 마무리.** 리만 합 대신 18.3절과 같은 무작위 뽑기를 쓰면 세부가 간단합니다. $\xi_1,\dots,\xi_n$을 $\Lambda$에서 독립으로 뽑으면 각 $x$에서 $\E[C_fq_x(\xi_i)]=f(x)-f(0)$이고 $|C_fq_x|\le C_f$이므로, 18.3절의 계산 그대로
$$\E\Big\lVert(f-f(0))-\frac1n\sum_{i=1}^nC_fq_\cdot(\xi_i)\Big\rVert_{L^2_\circ}^2\le\frac{C_f^2}n\to0.$$
각 평균 $\frac1n\sum_iC_fq_\cdot(\xi_i)$는 $\overline{\operatorname{co}}(G_C)$의 원소들의 볼록 결합이라 다시 $\overline{\operatorname{co}}(G_C)$에 있고(닫힌 볼록 집합), 그 극한인 $f-f(0)$도 그 안에 있습니다. ∎

**높이 2C의 의미.** 계단 높이의 합은 능선 $\varphi$의 전체 변동 $\int|\varphi'|$ 이하이고, 기울기가 1 이하인 $\varphi$가 길이 2인 구간 $[-1,1]$ 위에서 움직이므로 2입니다. 공의 반지름이 $r$이면 이 값이 $2r$가 되어, 바론의 원래 정리의 상수 $(2rC)^2$이 나옵니다.
` },
      { k: '18.5', src: 'W9 월 필기 7–8쪽', title: '정리 1의 완성: 은닉층 하나의 신경망', body: R`
:::idea 쉽게 말하면
이제 조각을 맞춥니다. 보조정리 2로 $f-f(0)$은 높이 $2C$ 이하인 계단 뉴런들의 볼록 껍질(의 폐포)에 있고, 보조정리 1에 $B=2C$를 넣으면 그 뉴런 $N$개의 평균으로 평균 제곱 오차 $\frac{4C^2}N$ 근처까지 갑니다. 마지막으로 계단 함수는 기울기를 아주 크게 한 시그모이드와 거의 같으므로, 계단 뉴런을 시그모이드 뉴런으로 바꾸면 보통의 은닉층 하나짜리 신경망이 됩니다.
:::

:::hand 수업 필기 — 정리 1의 완성 (W9 월 7–8쪽)
$f\in\Gamma_{C_1}$. 보조정리 2에 의해 $f|_{B_1^d}-f(0)\in\overline{\operatorname{co}}(G_{C_1})$.
모든 $g\in G_{C_1}$에 대해 $\lVert g\rVert_{L^2_\circ(B_1^d)}\le2C_1$이므로, 보조정리 1을 $H=L^2_\circ(B_1^d)$로 쓰면 모든 $N\in\mathbb N$에 대해 $|r_i|<2C_1$이 있어
$$\int_{B_1^d}\Big|f(x)-f(0)-\sum_{i=1}^Nr_i\mathbf 1_{\mathbb R_+}(\langle a_i,x\rangle+b_i)\Big|^2\le\frac{4C_1^2}N.$$
그리고 “$\sigma(\lambda x)\to\mathbf 1_{\mathbb R_+}(x)$”이므로
$$\int_{B_1^d}\Big|f(x)-f(0)-\sum_{i=1}^Nr_i\,\sigma(\langle a_i,x\rangle+b_i)\Big|^2dx\le\frac{4C_1^2}N,$$
곧 은닉층 하나짜리 신경망(“1 layer NN”)으로 근사됩니다.
:::

:::warn 필기의 식을 바로 읽기
세 가지를 고쳐 읽어야 합니다. (1) 보조정리 1이 주는 근사는 **평균** $\frac1N\sum_ig_i$이므로 계수는 $r_i=\frac{\gamma_i}N$, $|\gamma_i|\le2C$입니다(곧 $|r_i|\le\frac{2C}N$). (2) 폐포 때문에 오른쪽은 $\frac{4C^2}N$ 그 자체가 아니라 “임의의 $c>4C^2$에 대해 $\frac cN$”입니다. (3) 적분은 $\frac1{|B_1^d|}$로 정규화된 평균입니다(18.2절).
:::

**시그모이드에서 헤비사이드로** (W9 월 필기 8쪽). 필기의 따옴표 친 한 줄을 정확히 쓰면 다음과 같습니다.

:::key 시그모이드에서 헤비사이드로
$\sigma$가 시그모이드이면 $\lambda\to\infty$일 때 $t\ne0$에서 $\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$이다. 따라서 $a\ne0$이면
$$\big\lVert\sigma\big(\lambda(\langle a,\cdot\rangle+b)\big)-\mathbf 1_{\mathbb R_+}(\langle a,\cdot\rangle+b)\big\rVert_{L^2_\circ(B_1^d)}\to0\qquad(\lambda\to\infty).$$
:::

$t>0$이면 $\lambda t\to+\infty$이므로 $\sigma(\lambda t)\to1$, $t<0$이면 $\to0$입니다. 어긋나는 점 $\langle a,x\rangle+b=0$은 초평면이라 부피가 0이고, $|\sigma-\mathbf 1_{\mathbb R_+}|\le1$로 유계이므로 지배수렴정리에서 적분도 0으로 갑니다. 수렴은 초평면 근처에서 균등하지 않지만, 어긋남이 큰 띠의 부피가 $\lambda$가 커질수록 줄어들어 $L^2$ 오차는 사라집니다. ($a=0$인 원소는 상수 $\gamma\mathbf 1_{\mathbb R_+}(b)$이므로 $b\ne0$으로 고쳐 써서 같은 논법을 씁니다.)

**마무리.** $c>4C^2$이 주어지면 $4C^2<c'<c$인 $c'$를 골라 헤비사이드 판에서 평균 제곱 오차 $\le\frac{c'}N$을 얻습니다. 뉴런 $N$개를 모두 시그모이드로 바꾸어 생기는 추가 RMS 오차는 삼각 부등식으로 많아야 $\sum_i\frac{|\gamma_i|}N\big\lVert\sigma(\lambda\,\cdot)-\mathbf 1_{\mathbb R_+}(\cdot)\big\rVert\le2C\max_i\lVert\cdots\rVert$이고, $\lambda$를 크게 하면 이를 $\sqrt{c/N}-\sqrt{c'/N}$보다 작게 할 수 있습니다. 이렇게 얻은
$$\Phi_N(x)=f(0)+\sum_{i=1}^N\frac{\gamma_i}N\,\sigma\big(\lambda\langle a_i,x\rangle+\lambda b_i\big)$$
는 은닉 뉴런 $N$개, 출력 편향 $f(0)$인 **은닉층 하나짜리 신경망**이고 평균 제곱 오차가 $\frac cN$ 이하입니다[[ch08:8.6|다층 퍼셉트론.]].

:::ex 예제 4 — 뉴런 수와 출력 가중치
$C=\frac12$일 때 평균 제곱 오차를 $0.001$ 이하로 보장하는 정리 1의 최소 뉴런 수와, 그때 출력 가중치 $\frac{\gamma_i}N$의 절댓값의 합의 상한은?
---
$4C^2=1$이므로 $c>1$이고 $\frac cN\le0.001\iff N\ge1000c$. $c$를 1보다 조금 크게 잡으면 $N=1001$이 최소입니다. 출력 가중치의 절댓값의 합은 $\sum_i\frac{|\gamma_i|}N\le2C=1$로 $N$과 무관합니다.
:::

**무엇이 보장되고 무엇이 아닌가.** 정리 1은 17.1절의 세 오차 가운데 **근사 오차**에 관한 것입니다. 은닉층 하나, 뉴런 $N$개로 평균 제곱 근사 오차가 $O(C^2/N)$인 망이 존재합니다. 출력 가중치의 합 $\sum_i|\gamma_i|/N\le2C$가 유계라는 점은 18.7절의 일반화 한계와 이어집니다. 반면 안쪽 가중치 $\lambda a_i$는 $\lambda\to\infty$로 커질 수 있고, 학습이 이 망을 찾는다는 보장도 없습니다[[ch17:17.1|근사·일반화·최적화의 세 오차.]].
` },
      { k: '18.6', src: 'W9 월 필기 8쪽', title: '일반화: 모집단 위험과 경험적 위험', body: R`
:::idea 쉽게 말하면
근사 이론은 “클래스 안에 좋은 함수가 **있는가**”를 묻습니다. 그러나 실제로는 데이터 $n$개만 보고 함수를 고르므로, 학습 데이터에 잘 맞는 함수가 **처음 보는 데이터**에서도 잘 맞는지가 따로 문제입니다. 앞의 것을 모집단 위험, 뒤의 것을 경험적 위험으로 재고, 둘의 차이를 다스리는 것이 일반화의 문제입니다.
:::

**설정** (W9 월 필기 8쪽). 입력 $x\in\mathbb R^d$, 출력 $y\in\mathcal Y$이고, 학습 데이터 $\{(x_i,y_i)\}_{i=1}^n$은 미지의 분포 $P$에서 독립으로 뽑혔습니다. 손실 $\ell(y,f(x))$ (예: 제곱 오차, 교차 엔트로피)로 예측의 나쁨을 잽니다. 우리가 원하는 것은 예측 오차를 최소화하는 $f$입니다.

:::key 모집단 위험과 경험적 위험
$$R(f):=\E_{(X,Y)\sim P}\big[\ell(Y,f(X))\big],\qquad\hat R_n(f):=\frac1n\sum_{i=1}^n\ell(y_i,f(x_i)).$$
$R$을 **모집단 위험**, $\hat R_n$을 **경험적 위험**이라 한다. 원하는 것은 $\argmin_{f\in\mathcal F}R(f)$이지만 $P$를 모르므로 $\argmin_{f\in\mathcal F}\hat R_n(f)$ (경험적 위험 최소화, ERM)를 푼다.
:::

필기는 두 argmin을 나란히 적고 각각 “population risk”, “empirical risk”라고 붙였습니다. 고정된 $f$ 하나에 대해서는 $\E\hat R_n(f)=R(f)$이고 큰 수의 법칙으로 $\hat R_n(f)\to R(f)$입니다. 문제는 $\hat R_n$을 **최소화하도록 고른** $\hat f$에서는 $\hat R_n(\hat f)$가 $R(\hat f)$보다 낙관적으로 작아진다는 것입니다(과적합)[[ch04:4.2|다항회귀와 과적합.]]. 그래서 함수 하나가 아니라 클래스 전체에 걸친 차이 $\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|$를 다스려야 합니다[[@ml:ch03:4.1b|균등수렴 성질.]].

:::key 위험의 세 갈래 분해
$f_{\mathcal F}=\argmin_{\mathcal F}R$, $\hat f=\argmin_{\mathcal F}\hat R_n$, 학습 알고리즘이 낸 $\tilde f\in\mathcal F$, 모든 함수에 대한 최소 위험 $R^*=\inf_fR(f)$에 대해
$$R(\tilde f)-R^*\le\underbrace{\hat R_n(\tilde f)-\hat R_n(\hat f)}_{\text{최적화}}+\underbrace{2\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|}_{\text{일반화}}+\underbrace{R(f_{\mathcal F})-R^*}_{\text{근사}}.$$
:::

**증명.** 다섯 개의 괄호로 나누면
$$\begin{aligned}R(\tilde f)-R^*&=\big[R(\tilde f)-\hat R_n(\tilde f)\big]+\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+\big[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})\big]\\&\quad+\big[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})\big]+\big[R(f_{\mathcal F})-R^*\big].\end{aligned}$$
첫째와 넷째 괄호는 각각 $\sup_f|R-\hat R_n|$ 이하이고, 셋째는 $\hat f$가 $\hat R_n$의 최소점이므로 0 이하입니다. ∎

17.1절 그림의 세 화살표(opt, gen, app)가 이 세 항입니다. 근사 오차는 17단원과 18.2–18.5절이, 일반화 오차는 18.7절이, 최적화 오차는 13–14단원(경사하강법과 SGD의 수렴)이 다룹니다[[ch17:17.1|세 가지 오차.]].

:::ex 예제 5 — 경험적 위험 계산
제곱 손실 $\ell(y,\hat y)=(y-\hat y)^2$, 자료 $(x,y)=(0,1),(1,1),(2,5)$에서 $f(x)=2x$의 경험적 위험은?
---
예측값이 $0,2,4$이고 오차가 $1,-1,1$이므로 $\hat R_3(f)=\frac{1+1+1}3=1$.
:::
` },
      { k: '18.7', src: 'W9 월 필기 9쪽', title: '라데마허 복잡도와 일반화 한계', body: R`
:::idea 쉽게 말하면
클래스 $\mathcal F$가 얼마나 “풍부한지”를 재는 방법이 있습니다. 데이터에 **동전 던지기로 만든 가짜 꼬리표** $\xi_i=\pm1$을 붙이고, 클래스 안의 함수가 그 무작위 꼬리표와 얼마나 잘 맞출 수 있는지(상관)를 봅니다. 아무 잡음이나 잘 따라가는 클래스는 학습 데이터에 과적합하기 쉽고, 경험적 위험과 모집단 위험의 차이도 큽니다. 이 상관의 기댓값이 **라데마허 복잡도**입니다.
:::

:::key 라데마허 복잡도
독립 동일 분포인 확률변수 $\xi_1,\dots,\xi_n$이 $\mathbb P(\xi_i=1)=\mathbb P(\xi_i=-1)=\frac12$이면 **라데마허 확률변수**라 한다. 함수 클래스 $\mathcal F$와 표본 $z_1,\dots,z_n$에 대해
$$\operatorname{Rad}_n(\mathcal F):=\E\Big[\sup_{f\in\mathcal F}\frac1n\sum_{i=1}^n\xi_if(z_i)\Big].$$
기댓값은 $\xi$와 (표본이 무작위이면) $z$ 모두에 대해 취한다. 표본 $S$를 고정하고 $\xi$에 대해서만 취한 것을 경험적 라데마허 복잡도 $\widehat{\operatorname{Rad}}_S(\mathcal F)$라 한다.
:::

**두 극단.** 함수가 하나뿐이면($\mathcal F=\{f\}$) $\E\sum_i\xi_if(z_i)=0$이므로 복잡도는 0입니다. 서로 다른 $n$개 점에서 모든 부호 패턴 $\pm1$을 만들 수 있는 클래스라면, 어떤 $\xi$에도 $f(z_i)=\xi_i$인 $f$를 골라 $\frac1n\sum_i\xi_i^2=1$을 얻으므로 복잡도는 1입니다($|f|\le1$인 클래스에서 가능한 최댓값. 아래 일반화 한계는 값이 $[0,1]$인 함수에 쓰므로 이 극단은 부호 $\pm1$을 내는 클래스 이야기입니다). 실제 클래스는 그 사이에 있고, 보통 $n$이 커질수록 줄어듭니다.

:::key 라데마허 일반화 한계
$\mathcal F$의 함수가 $[0,1]$에 값을 가지고 $z_1,\dots,z_n$이 독립 동일 분포이면
$$\E\Big[\sup_{f\in\mathcal F}\Big(\E f(z)-\frac1n\sum_{i=1}^nf(z_i)\Big)\Big]\le2\operatorname{Rad}_n(\mathcal F)$$
이고, 확률 $1-\delta$ 이상으로
$$\sup_{f\in\mathcal F}\Big|\frac1n\sum_{i=1}^nf(z_i)-\E f(z)\Big|\le2\operatorname{Rad}_n(\mathcal F)+\sqrt{\frac{\log(2/\delta)}{2n}}.$$
:::

$f$ 자리에 손실 $z=(x,y)\mapsto\ell(y,f(x))$를 넣으면 18.6절의 $\sup_f|R(f)-\hat R_n(f)|$에 대한 한계가 됩니다.

:::hand 수업 필기 (W9 월 9쪽)
“Random variables $\xi_1,\dots,\xi_n$ are called Rademacher r.v. if they are i.i.d. and $\mathbb P(\xi_i=1)=\mathbb P(\xi_i=-1)=\frac12$. Define the Rademacher complexity of $\mathcal F$ by $\operatorname{Rad}_n(\mathcal F)=\E\big(\sup_{f\in\mathcal F}\frac1n\sum_{i=1}^n\xi_if(z_i)\big)$.”
신경망 클래스 $\mathcal F=\{f_\theta:f_\theta=\sum_j\beta_j\sigma(w_j^Tx)\}$에 대해
$$\sup_{f\in\mathcal F}\Big|\frac1n\sum_{i=1}^nf(x_i)-\E[f]\Big|\le2\operatorname{Rad}(\mathcal F)+\frac1{\sqrt{2n}},\qquad\operatorname{Rad}(\mathcal F)\le\frac Q{\sqrt n}\ \ (\lVert f\rVert\le Q),$$
따라서 차이는 $O\big(\frac1{\sqrt n}\big)$.
:::

:::warn 칠판의 1/√(2n)은 무엇인가
칠판의 식은 위의 정확한 정리를 줄인 것입니다. 둘째 항은 “확률 $1-\delta$ 이상으로”에 붙는 $\sqrt{\log(2/\delta)/(2n)}$에서 로그 인수를 뗀 것이고, 함수값이 $[0,1]$ 안에 있다는(유계라는) 가정이 필요합니다. 이 항은 표본 하나를 바꿀 때 $\sup$이 많아야 $\frac1n$ 변한다는 데서 오는 집중 부등식(McDiarmid)의 몫이며, 중요한 것은 두 항 모두 $\frac1{\sqrt n}$의 속도라는 점입니다. 또 “$\lVert f\rVert\le Q$이면 $Q/\sqrt n$”의 $Q$는 어떤 노름으로 재느냐에 따라 뜻이 달라집니다(아래).
:::

**대칭화: 왜 2Rad인가** (판서에 없는 증명). 같은 분포에서 따로 뽑은 “유령 표본” $z_1',\dots,z_n'$을 생각하면 $\E f(z)=\E\frac1n\sum_if(z_i')$이므로
$$\E\sup_f\Big(\E f-\frac1n\sum_if(z_i)\Big)\le\E\sup_f\frac1n\sum_i\big(f(z_i')-f(z_i)\big).$$
$z_i$와 $z_i'$를 맞바꾸어도 분포가 같으므로 각 차 $f(z_i')-f(z_i)$에 부호 $\xi_i$를 곱해도 기댓값은 그대로이고, 상한을 둘로 나누면
$$\le\E\sup_f\frac1n\sum_i\xi_if(z_i')+\E\sup_f\frac1n\sum_i(-\xi_i)f(z_i)=2\operatorname{Rad}_n(\mathcal F).$$
첫 부등식은 $\sup$ 안의 기댓값을 밖으로 꺼낸 것($\sup\E\le\E\sup$)이고, 자세한 증명은 증명 페이지에 있습니다.

:::key 노름이 유계인 선형 클래스
$\lVert x_i\rVert\le1$ ($i=1,\dots,n$)이고 $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$이면 $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le\frac Q{\sqrt n}$이다.
:::

**계산.** 코시-슈바르츠로 $\sup$을 구하고 젠센 부등식($\E Z\le\sqrt{\E Z^2}$)과 $\E\xi_i\xi_j=0$ ($i\ne j$)을 쓰면
$$\widehat{\operatorname{Rad}}_S(\mathcal F_Q)=\frac1n\E\sup_{\lVert w\rVert\le Q}\Big\langle w,\sum_i\xi_ix_i\Big\rangle=\frac Qn\E\Big\lVert\sum_i\xi_ix_i\Big\rVert\le\frac Qn\sqrt{\sum_i\lVert x_i\rVert^2}\le\frac Q{\sqrt n}.$$
18.3절의 교차항 소거와 같은 계산입니다[[@base:ch05:5.2|코시-슈바르츠와 젠센 부등식.]].

**신경망 클래스.** 은닉층 하나짜리 ReLU 망 $f(x)=\sum_j\beta_j\ReLU(w_j^Tx)$에서 $\lVert x\rVert\le1$이고 $\sum_j|\beta_j|\lVert w_j\rVert\le Q$이면 $\operatorname{Rad}_n\le\frac{2Q}{\sqrt n}$입니다. 증명에는 립시츠 함수를 씌워도 복잡도가 늘지 않는다는 축약 보조정리(Ledoux–Talagrand)가 필요해 여기서는 결과만 적습니다. 상수와 노름의 정의는 교재마다 다르므로, 칠판의 “$\lVert f\rVert\le Q$이면 $Q/\sqrt n$”은 이런 종류의 결과를 요약한 것으로 읽어야 합니다. 바론 정리의 망은 출력 가중치의 합이 $2C$ 이하이지만 안쪽 가중치 $\lambda a_i$가 커지므로, 이 노름으로 재면 $Q$가 커질 수 있습니다.

:::ex 예제 6 — 두 함수의 라데마허 복잡도
두 점 $z_1,z_2$를 고정하고 $\mathcal F=\{f_1,f_2\}$, $(f_1(z_1),f_1(z_2))=(1,0)$, $(f_2(z_1),f_2(z_2))=(0,1)$일 때 $\widehat{\operatorname{Rad}}_S(\mathcal F)$는?
---
$\sup_f\frac12\sum_i\xi_if(z_i)=\frac12\max(\xi_1,\xi_2)$. 네 경우 $(\xi_1,\xi_2)$ 가운데 $(-1,-1)$일 때만 최댓값이 $-1$이고 나머지 셋은 $1$이므로 $\E\max(\xi_1,\xi_2)=\frac{3-1}4=\frac12$. 따라서 $\widehat{\operatorname{Rad}}_S=\frac14$.
:::

**근사와 일반화를 함께.** 은닉 뉴런 $N$개의 망을 데이터 $n$개로 학습하면 대략 근사 오차는 $\frac{C^2}N$, 일반화 오차는 $\frac Q{\sqrt n}$ 정도입니다. 뉴런을 늘리면 근사는 좋아지지만 $Q$가 커지면 일반화 한계가 나빠질 수 있다는 것이 편향-분산 균형의 신경망 판입니다[[ch02:2.8|편향-분산 분해.]]. 다만 실제의 과매개변수 신경망에서는 이 단순한 균형이 그대로 관찰되지 않는다는 점도 알려져 있으므로, 이 한계들은 “왜 되는가”에 대한 출발점으로 보는 것이 좋습니다.

### 더 깊이

McDiarmid 부등식: 독립 확률변수의 함수 $\Phi(z_1,\dots,z_n)$이 한 좌표를 바꿀 때 많아야 $c_i$만큼 변하면 $\mathbb P(\Phi-\E\Phi\ge t)\le\exp\big(-2t^2/\sum_ic_i^2\big)$입니다. $\Phi=\sup_f(\E f-\frac1n\sum_if(z_i))$는 $c_i=\frac1n$이므로 $t=\sqrt{\log(2/\delta)/(2n)}$에서 확률이 $\frac\delta2$가 되고, 반대쪽 $\sup_f(\frac1n\sum_if(z_i)-\E f)$에도 같은 논법($-\mathcal F$의 라데마허 복잡도는 같음)을 써서 합치면 key의 둘째 식이 나옵니다. 호프딩 부등식의 일반화입니다[[@ml:ch03:4.2|측도 집중: 호프딩 부등식.]].
` },
    ],
    problems: [
      { sec: '18.1', type: 'mc', lv: 1, q: R`이 단원(필기)의 푸리에 변환 규약은?`,
        choices: [R`$\hat f(\xi)=\int_{\mathbb R^d}f(x)e^{-2\pi i\xi^Tx}dx$`, R`$\hat f(\xi)=\frac1{\sqrt{2\pi}}\int_{\mathbb R}f(x)e^{-i\xi x}dx$만 쓴다`, R`$\hat f(\xi)=\int_{\mathbb R^d}f(x)e^{2\pi i\xi^Tx}dx$`, R`$\hat f(\xi)=\int_{\mathbb R^d}f(x)\cos(\xi^Tx)dx$`], ans: 0,
        sol: R`지수에 $2\pi$가 들어가는 규약입니다. 이때 역변환 $f(x)=\int\hat f(\xi)e^{2\pi i\xi^Tx}d\xi$에 앞 계수가 없고, $\nabla f$의 변환은 $2\pi i\xi\hat f(\xi)$입니다.` },
      { sec: '18.1', type: 'num', lv: 2, q: R`$d=1$에서 $f(x)=e^{-\pi x^2}$, $\hat f(\xi)=e^{-\pi\xi^2}$일 때 $\int_{-\infty}^\infty|2\pi\xi||\hat f(\xi)|\,d\xi$는?`, ans: '2', ansTex: R`2`,
        sol: R`$2\int_0^\infty2\pi\xi e^{-\pi\xi^2}d\xi=2\big[-e^{-\pi\xi^2}\big]_0^\infty=2$. 따라서 $C>2$이면 $f\in\Gamma_C$.` },
      { sec: '18.1', type: 'mc', lv: 2, q: R`$f\in\Gamma_C$에 대해 항상 참인 것은?`,
        choices: [R`모든 $x,y$에서 $|f(x)-f(y)|\le C|x-y|$`, R`$f$는 유계인 집합 밖에서 0이다`, R`$|\xi|>C$이면 $\hat f(\xi)=0$`, R`$f\in\Gamma_{C/2}$이기도 하다`], ans: 0,
        sol: R`역변환과 $|e^{iu}-e^{iv}|\le|u-v|$에서 $|f(x)-f(y)|\le|x-y|\int|2\pi\xi||\hat f|d\xi\le C|x-y|$. 가우시안처럼 지지집합이 유계가 아니거나 모든 주파수를 가진 함수도 $\Gamma_C$에 들 수 있습니다.` },
      { sec: '18.1', type: 'open', lv: 2, proof: true, q: R`$f\in\Gamma_C$이면 모든 $x,y\in\mathbb R^d$에서 $|f(x)-f(y)|\le C|x-y|$임을 보이세요. $\hat f\in L^1$이라 역변환이 모든 점에서 성립한다고 써도 됩니다.`,
        sol: R`역변환에서 $f(x)-f(y)=\int\hat f(\xi)\big(e^{2\pi i\xi^Tx}-e^{2\pi i\xi^Ty}\big)d\xi$.
단위원 위의 두 점 사이의 현의 길이는 호의 길이 이하이므로 $|e^{iu}-e^{iv}|\le|u-v|$. $u=2\pi\xi^Tx$, $v=2\pi\xi^Ty$를 넣고 코시-슈바르츠로 $|\xi^T(x-y)|\le|\xi||x-y|$를 쓰면
$$|f(x)-f(y)|\le\int|\hat f(\xi)|\,2\pi|\xi||x-y|\,d\xi=|x-y|\int|2\pi\xi||\hat f(\xi)|d\xi\le C|x-y|.$$`,
        rubric: R`- 역변환으로 차를 적분 하나로 쓰기 — 1점
- $|e^{iu}-e^{iv}|\le|u-v|$ — 1점
- 코시-슈바르츠와 바론 조건으로 마무리 — 1점` },
      { sec: '18.1', type: 'mc', lv: 1, q: R`$\lVert f\rVert_{B^s(\Omega)}=\inf\int(1+|\xi|)^s|\hat f_e(\xi)|d\xi$의 하한(inf)은 무엇에 대해 취하는가?`,
        choices: [R`$\Omega$에서 $f$와 같은 $\mathbb R^d$ 위의 모든 연장 $f_e$`, R`$\Omega$ 안의 모든 점 $x$`, R`모든 주파수 $\xi$`, R`모든 차수 $s$`], ans: 0,
        sol: R`$\Omega$에서만 정의된 $f$는 푸리에 변환이 없으므로, $f_e|_\Omega=f$인 연장들 가운데 가중 진폭의 합이 가장 작은 것을 씁니다.` },
      { sec: '18.2', type: 'num', lv: 1, q: R`$C=1$인 바론 함수를 단위 공에서 평균 제곱 오차 $0.01$ 이하로 근사할 때, 정리 1이 보장하는 가장 작은 뉴런 수 $N$은?`, ans: '401', ansTex: R`401`,
        sol: R`$c>4C^2=4$이고 $\frac cN\le0.01\iff N\ge100c$. $c$를 4보다 조금 크게 잡으면 $N=401$이면 되고, $N=400$은 $c\le4$를 요구하므로 보장되지 않습니다.` },
      { sec: '18.2', type: 'mc', lv: 2, q: R`정리 1의 조건이 $c\ge4C^2$이 아니라 $c>4C^2$인 이유로 가장 알맞은 것은?`,
        choices: [R`보조정리 1이 폐포의 원소를 다루고, 헤비사이드를 시그모이드로 바꾸는 단계에도 여유가 필요해서`, R`$d$가 클 때를 대비해서`, R`$4C^2/N$이 정수가 아닐 수 있어서`, R`시그모이드가 0과 1 사이의 값만 가져서`], ans: 0,
        sol: R`Maurey 보조정리는 $f\in\overline{\operatorname{co}}(G)$의 근사점 $f^*$와의 거리 $\varepsilon$을 흡수하려고 $c>B^2$을 씁니다. 18.5절에서는 $4C^2<c'<c$인 $c'$로 헤비사이드 판을 얻고 남은 여유로 시그모이드로 바꾼 오차를 흡수합니다.` },
      { sec: '18.2', type: 'num', lv: 2, q: R`$[0,1]^{10}$을 한 변이 $0.1$인 정육면체로 나누는 격자의 칸 수는?`, ans: '10^10', ansTex: R`10^{10}`,
        sol: R`한 축에 10칸, 10개 축이므로 $10^{10}$칸. 칸마다 상수를 쓰는 근사는 매개변수가 이만큼 필요하지만, 바론 정리의 뉴런 수 $\approx4C^2/\varepsilon^2$에는 $d$가 없습니다.` },
      { sec: '18.2', type: 'mc', lv: 2, q: R`“바론 정리의 근사율은 차원 $d$와 무관하다”의 올바른 해석은?`,
        choices: [R`상한 $c/N$에 $d$가 직접 나타나지 않지만, 바론 상수 $C$가 $d$에 따라 커질 수 있다`, R`어떤 차원에서도 같은 신경망을 그대로 쓸 수 있다`, R`경사하강법이 $d$와 무관한 시간에 수렴한다`, R`필요한 학습 데이터 수가 $d$와 무관하다`], ans: 0,
        sol: R`정리는 근사 오차의 **존재** 결과이고 $d$는 상수 $C$ 안에 숨을 수 있습니다(가우시안의 $C\approx\sqrt{2\pi d}$). 최적화나 일반화에 대해서는 말하지 않습니다.` },
      { sec: '18.3', type: 'num', lv: 2, q: R`$H=\mathbb R^2$, $G=\{(1,0),(0,1)\}$, $f^*=(\frac12,\frac12)$이고 $X_1,\dots,X_N$이 $G$에서 각각 확률 $\frac12$로 독립으로 뽑힐 때, $N=10$이면 $\E\lVert f^*-\frac1N\sum_jX_j\rVert^2$은?`, ans: '1/20', ansTex: R`\frac1{20}`,
        sol: R`$\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)=\frac1{10}(1-\frac12)=\frac1{20}$. 직접 계산해도 $2\Var(K/N)=2\cdot\frac1{4N}=\frac1{20}$ ($K\sim\operatorname{Bin}(10,\frac12)$).` },
      { sec: '18.3', type: 'open', lv: 3, quiz: true, proof: true, q: R`Maurey 보조정리를 증명하세요: 힐베르트 공간 $H$의 부분집합 $G$의 원소가 모두 $\lVert g\rVert\le B$이고 $f\in\overline{\operatorname{co}}(G)$이면, 모든 $N$과 $c>B^2$에 대해 $\lVert f-\frac1N\sum_{i=1}^Ng_i\rVert^2\le\frac cN$인 $g_1,\dots,g_N\in G$가 있다.`,
        sol: R`**근사점.** $\varepsilon>0$에 대해 $f^*=\sum_{j=1}^m\alpha_jh_j$ ($h_j\in G$, $\alpha_j\ge0$, $\sum\alpha_j=1$), $\lVert f-f^*\rVert<\varepsilon$.
**무작위 뽑기.** $X_1,\dots,X_N$ i.i.d., $\mathbb P(X_i=h_j)=\alpha_j$. 그러면 $\E X_i=f^*$.
**분산 계산.** $\E\lVert f^*-\frac1N\sum_jX_j\rVert^2=\frac1{N^2}\big[\sum_j\E\lVert f^*-X_j\rVert^2+\sum_{i\ne j}\E\langle f^*-X_i,f^*-X_j\rangle\big]$. 독립이라 $\E\langle X_i,X_j\rangle=\lVert f^*\rVert^2$이고 교차항은 $\lVert f^*\rVert^2-\lVert f^*\rVert^2-\lVert f^*\rVert^2+\lVert f^*\rVert^2=0$. 남은 것은 $\frac1N\E\lVert f^*-X_1\rVert^2=\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)\le\frac{B^2}N$.
**존재.** 기댓값이 $\frac{B^2}N$ 이하이므로 어떤 결과 $\omega$에서 $\lVert f^*-\frac1N\sum_jX_j(\omega)\rVert^2\le\frac{B^2}N$. $g_i=X_i(\omega)\in G$.
**삼각 부등식.** $\lVert f-\frac1N\sum g_i\rVert\le\varepsilon+\frac B{\sqrt N}$. $c>B^2$이므로 $\varepsilon<\frac{\sqrt c-B}{\sqrt N}$로 잡으면 $<\sqrt{c/N}$, 제곱해 $\le\frac cN$.`,
        rubric: R`- 폐포에서 근사점 $f^*$를 잡기 — 1점
- 분포 $\mathbb P(X_i=h_j)=\alpha_j$와 $\E X_i=f^*$ — 2점
- 제곱 노름의 전개와 교차항이 0임(독립성) — 3점
- $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)\le\frac{B^2}N$ — 2점
- 확률적 방법(존재) — 1점
- 삼각 부등식과 $c>B^2$로 $\varepsilon$ 흡수 — 1점` },
      { sec: '18.3', type: 'mc', lv: 2, q: R`Maurey 보조정리의 증명에서 $i\ne j$일 때 $\E\langle f^*-X_i,f^*-X_j\rangle=0$인 이유는?`,
        choices: [R`$X_i,X_j$가 독립이고 둘 다 평균이 $f^*$여서`, R`$h_1,\dots,h_m$이 서로 직교해서`, R`$\lVert X_i\rVert\le B$여서`, R`$N$이 충분히 커서`], ans: 0,
        sol: R`독립이면 $\E\langle X_i,X_j\rangle=\langle\E X_i,\E X_j\rangle=\lVert f^*\rVert^2$이고, 네 항이 $\lVert f^*\rVert^2(1-1-1+1)=0$으로 상쇄됩니다. $h_j$의 직교성은 필요 없습니다.` },
      { sec: '18.3', type: 'num', lv: 1, q: R`노름이 3 이하인 원소들의 볼록 껍질에 있는 $f^*$를 무작위 표본 100개의 평균으로 근사할 때, 증명이 주는 기대 제곱 오차의 상한 $B^2/N$은?`, ans: '9/100', ansTex: R`0.09`,
        sol: R`$B^2/N=9/100=0.09$. 실제 값은 $\frac{9-\lVert f^*\rVert^2}{100}$ 이하입니다.` },
      { sec: '18.4', type: 'mc', lv: 1, q: R`$G_C$의 원소는 어떤 꼴인가?`,
        choices: [R`$x\mapsto\gamma\,\mathbf 1_{\mathbb R_+}(\langle a,x\rangle+b)$, $|\gamma|\le2C$`, R`$x\mapsto\gamma\,\sigma(\langle a,x\rangle+b)$, $|\gamma|\le C$`, R`$x\mapsto\cos(2\pi\langle\xi,x\rangle)$`, R`$x\mapsto\gamma\lVert x\rVert$, $|\gamma|\le2C$`], ans: 0,
        sol: R`높이가 $2C$ 이하인 헤비사이드 능선 함수, 곧 계단 활성화를 쓴 뉴런 하나입니다. 정규화된 노름으로 $\lVert g\rVert_{L^2_\circ}\le|\gamma|\le2C$.` },
      { sec: '18.4', type: 'open', lv: 3, proof: true, q: R`$\xi\ne0$, $\kappa\in\mathbb R$을 고정하고 $\varphi(t)=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}$ ($t\in[-1,1]$)라 하자.
1. $\varphi(0)=0$, $|\varphi'(t)|\le1$임을 보이세요.
2. $t_k=k/K$에 대해 $\sum_{k=1}^K\Delta_k^+\mathbf 1_{\mathbb R_+}(t-t_k)+\sum_{k=1}^K\Delta_k^-\mathbf 1_{\mathbb R_+}(-t-t_k)$ ($\Delta_k^\pm=\varphi(\pm t_k)-\varphi(\pm t_{k-1})$)이 $[-1,1]$에서 $\varphi$와 $\frac1K$ 이내임을 보이세요.
3. 이 계단 함수가 높이의 절댓값이 2 이하인 헤비사이드 함수들의 볼록 결합임을 보이세요.`,
        sol: R`1. $\varphi(0)=\frac{\cos\kappa-\cos\kappa}{2\pi|\xi|}=0$, $\varphi'(t)=-\sin(2\pi|\xi|t+\kappa)$이므로 $|\varphi'|\le1$.
2. $t_k\le t<t_{k+1}$ ($t\ge0$)이면 첫 합은 $\sum_{j\le k}\Delta_j^+=\varphi(t_k)-\varphi(0)=\varphi(t_k)$, 둘째 합의 항은 $-t-t_j<0$이라 0. 평균값 정리로 $|\varphi(t)-\varphi(t_k)|\le|t-t_k|\le\frac1K$. $t<0$은 대칭적으로 같습니다($t=0$이면 두 합 모두 0).
3. $V=\sum_k|\Delta_k^+|+\sum_k|\Delta_k^-|\le\int_{-1}^1|\varphi'|dt\le2$. 계단 함수 $=\sum\frac{|\Delta|}V\big(V\operatorname{sign}(\Delta)\mathbf 1_{\mathbb R_+}(\cdots)\big)$이고 가중치 $\frac{|\Delta|}V\ge0$의 합이 1, 각 함수의 높이는 $V\le2$. ($V=0$이면 0 함수, 곧 $\gamma=0$.)`,
        rubric: R`- $\varphi(0)=0$과 $|\varphi'|\le1$ — 2점
- 망원합으로 계단 함수의 값 계산 — 2점
- 1-립시츠로 오차 $\le1/K$ — 2점
- 전체 변동 $\le2$와 볼록 결합으로 다시 쓰기 — 4점` },
      { sec: '18.4', type: 'mc', lv: 2, q: R`필기는 밀도 $\frac1C|2\pi\xi||\hat f(\xi)|$로 $\Lambda$를 정의하고 확률측도라고 했다. 무엇이 문제이고 어떻게 고치는가?`,
        choices: [R`$\int|2\pi\xi||\hat f|<C$이면 전체 질량이 1보다 작다 — $C_f=\int|2\pi\xi||\hat f|$로 나누면 된다`, R`밀도가 음수일 수 있다 — 절댓값을 씌우면 된다`, R`$\xi=0$에서 밀도가 정의되지 않는다 — 원점을 빼면 된다`, R`문제없다 — $\Gamma_C$의 정의상 언제나 질량이 정확히 1이다`], ans: 0,
        sol: R`$\Gamma_C$는 엄격한 부등식으로 정의되므로 질량은 $C_f/C<1$입니다. $C_f$로 나누면 확률측도가 되고, 앞 계수 $C_f\le C$ 덕분에 높이 한계 $2C_f\le2C$는 그대로입니다.` },
      { sec: '18.4', type: 'num', lv: 2, q: R`$\varphi(t)=t$ ($t\in[-1,1]$)를 한쪽에 $K=4$칸씩 계단으로 근사할 때(본문의 공식), 오차의 상한 $\sup_t|\varphi(t)-\text{계단}(t)|$은?`, ans: '1/4', ansTex: R`\frac14`,
        sol: R`$\varphi$가 1-립시츠이므로 오차는 $|t-t_k|<\frac1K=\frac14$이고, $t$가 다음 칸 직전으로 갈 때 $\frac14$에 한없이 가까워지므로 상한은 $\frac14$. 높이의 합은 $V=\int_{-1}^1|\varphi'|=2$로 한계에 꼭 닿습니다.` },
      { sec: '18.5', type: 'mc', lv: 1, q: R`$\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$는 $t=0$에서 성립하지 않을 수 있는데도, 시그모이드로 바꾼 망의 $L^2$ 오차가 헤비사이드 판의 오차로 가는 이유는?`,
        choices: [R`어긋나는 곳이 부피 0인 초평면뿐이고 $|\sigma-\mathbf 1_{\mathbb R_+}|\le1$로 유계라서(지배수렴)`, R`시그모이드가 계단 함수와 정확히 같아서`, R`수렴이 공 전체에서 균등해서`, R`$\lambda$를 작게 잡기 때문에`], ans: 0,
        sol: R`점별 수렴이 부피 0인 집합 밖에서 성립하고 차가 유계이므로 지배수렴정리에서 $L^2$ 수렴합니다. 초평면 근처에서는 균등하지 않습니다.` },
      { sec: '18.5', type: 'num', lv: 2, q: R`$C=\frac12$인 바론 함수를 평균 제곱 오차 $0.001$ 이하로 근사할 때, 정리 1이 보장하는 최소 뉴런 수는?`, ans: '1001', ansTex: R`1001`,
        sol: R`$4C^2=1$, $c>1$, $N\ge1000c$. $c$를 1보다 조금 크게 잡으면 $N=1001$.` },
      { sec: '18.5', type: 'open', lv: 2, quiz: true, q: R`필기의 식 $\int_{B_1^d}\big|f(x)-f(0)-\sum_{i=1}^Nr_i\mathbf 1_{\mathbb R_+}(\langle a_i,x\rangle+b_i)\big|^2\le\frac{4C_1^2}N$ ($|r_i|<2C_1$)을 보조정리 1의 결론과 맞게 바로잡고, 최종 신경망 $\Phi_N$을 쓰세요. 출력 가중치의 절댓값의 합은 얼마 이하인가요?`,
        sol: R`보조정리 1은 $g_i=\gamma_i\mathbf 1_{\mathbb R_+}(\langle a_i,\cdot\rangle+b_i)\in G_C$의 **평균**을 주므로 $r_i=\frac{\gamma_i}N$, $|\gamma_i|\le2C$입니다. 오른쪽은 임의의 $c>4C^2$에 대해 $\frac cN$이고, 왼쪽은 $\frac1{|B_1^d|}$로 정규화된 평균입니다:
$$\frac1{|B_1^d|}\int_{B_1^d}\Big|f(x)-f(0)-\frac1N\sum_{i=1}^N\gamma_i\mathbf 1_{\mathbb R_+}(\langle a_i,x\rangle+b_i)\Big|^2dx\le\frac cN.$$
헤비사이드를 $\sigma(\lambda\,\cdot)$로 바꾸면 $\Phi_N(x)=f(0)+\sum_i\frac{\gamma_i}N\sigma(\lambda\langle a_i,x\rangle+\lambda b_i)$. 출력 가중치의 절댓값의 합은 $\sum_i\frac{|\gamma_i|}N\le2C$.`,
        rubric: R`- 계수 $r_i=\gamma_i/N$, $|\gamma_i|\le2C$ — 2점
- 오른쪽을 $c/N$ ($c>4C^2$)으로, 왼쪽을 정규화된 평균으로 — 2점
- $\Phi_N$과 출력 가중치 합 $\le2C$ — 2점` },
      { sec: '18.6', type: 'num', lv: 1, q: R`제곱 손실, 자료 $(0,1),(1,1),(2,5)$에서 $f(x)=2x$의 경험적 위험 $\hat R_3(f)$는?`, ans: '1', ansTex: R`1`,
        sol: R`예측값 $0,2,4$, 오차 $1,-1,1$이므로 $\frac{1+1+1}3=1$.` },
      { sec: '18.6', type: 'open', lv: 3, quiz: true, proof: true, q: R`$f_{\mathcal F}=\argmin_{\mathcal F}R$, $\hat f=\argmin_{\mathcal F}\hat R_n$, $\tilde f\in\mathcal F$, $R^*=\inf_fR(f)$일 때
$$R(\tilde f)-R^*\le\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+2\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|+\big[R(f_{\mathcal F})-R^*\big]$$
임을 증명하고, 세 항의 이름과 이를 다루는 단원을 말하세요.`,
        sol: R`$R(\tilde f)-R^*=[R(\tilde f)-\hat R_n(\tilde f)]+[\hat R_n(\tilde f)-\hat R_n(\hat f)]+[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})]+[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})]+[R(f_{\mathcal F})-R^*]$ (가운데 항들이 상쇄되는 항등식).
첫째·넷째는 각각 $\le\sup_f|R-\hat R_n|$, 셋째는 $\hat f$가 $\hat R_n$의 최소점이라 $\le0$. 따라서 주어진 부등식.
이름: 최적화 오차(13–14단원, 경사하강법·SGD), 일반화 오차(18.7절, 라데마허), 근사 오차(17단원, 18.2–18.5절).`,
        rubric: R`- 다섯 괄호의 항등식 — 2점
- 첫째·넷째를 $\sup$으로, 셋째를 0 이하로 — 2점
- 세 항의 이름과 연결 — 1점` },
      { sec: '18.6', type: 'mc', lv: 2, q: R`고정된 $f$에 대해서는 $\E\hat R_n(f)=R(f)$인데, ERM 해 $\hat f$에서 $\hat R_n(\hat f)$가 $R(\hat f)$보다 작게 나오기 쉬운 이유는?`,
        choices: [R`$\hat f$가 바로 그 데이터에서 $\hat R_n$을 최소화하도록 골라졌기 때문`, R`손실이 음수일 수 있어서`, R`$n$이 커서`, R`$P$가 정규분포가 아니어서`], ans: 0,
        sol: R`$\hat f$는 데이터에 의존하므로 $\E\hat R_n(\hat f)=R(\hat f)$가 성립하지 않습니다. 실제로 $\E\hat R_n(\hat f)\le\E\hat R_n(f_{\mathcal F})=R(f_{\mathcal F})\le R(\hat f)$ 쪽으로 치우칩니다. 그래서 $\sup_f|R-\hat R_n|$를 다스립니다.` },
      { sec: '18.7', type: 'num', lv: 2, q: R`두 점에서 값이 $(1,0)$인 $f_1$과 $(0,1)$인 $f_2$로 이루어진 $\mathcal F=\{f_1,f_2\}$의 경험적 라데마허 복잡도는?`, ans: '1/4', ansTex: R`\frac14`,
        sol: R`$\frac12\E\max(\xi_1,\xi_2)=\frac12\cdot\frac{1+1+1-1}4=\frac14$.` },
      { sec: '18.7', type: 'mc', lv: 1, q: R`(가) 함수 하나뿐인 클래스 $\{f\}$와 (나) 서로 다른 $n$개 점에서 모든 부호 패턴 $\pm1$을 만드는 클래스의 라데마허 복잡도는?`,
        choices: [R`(가) 0, (나) 1`, R`(가) 1, (나) 0`, R`(가) $\frac12$, (나) 1`, R`(가) 0, (나) $\frac12$`], ans: 0,
        sol: R`(가) $\E\sum\xi_if(z_i)=0$. (나) 어떤 $\xi$에도 $f(z_i)=\xi_i$를 골라 $\frac1n\sum\xi_i^2=1$.` },
      { sec: '18.7', type: 'open', lv: 3, quiz: true, proof: true, q: R`대칭화로 $\E\big[\sup_{f\in\mathcal F}\big(\E f(z)-\frac1n\sum_{i=1}^nf(z_i)\big)\big]\le2\operatorname{Rad}_n(\mathcal F)$을 증명하세요. 유령 표본 $z_1',\dots,z_n'$을 쓰세요.`,
        sol: R`**유령 표본.** $\E f(z)=\E'\frac1n\sum_if(z_i')$이므로 $\sup_f(\E f-\hat\E_nf)=\sup_f\E'\big[\frac1n\sum_i(f(z_i')-f(z_i))\big]\le\E'\sup_f\frac1n\sum_i(f(z_i')-f(z_i))$ ($\sup\E\le\E\sup$). 양변에 $\E$를 취합니다.
**부호 넣기.** $z_i\leftrightarrow z_i'$를 맞바꾸어도 결합 분포가 같으므로 $(f(z_i')-f(z_i))_i$와 $(\xi_i(f(z_i')-f(z_i)))_i$는 (어떤 고정된 $\xi$에 대해서도) 같은 분포입니다. 따라서 기댓값에 $\xi$를 넣어도 됩니다.
**나누기.** $\sup_f\sum_i\xi_i(f(z_i')-f(z_i))\le\sup_f\sum_i\xi_if(z_i')+\sup_f\sum_i(-\xi_i)f(z_i)$. $-\xi$도 라데마허이므로 두 기댓값이 모두 $\operatorname{Rad}_n(\mathcal F)$. 합해서 $2\operatorname{Rad}_n(\mathcal F)$.`,
        rubric: R`- 유령 표본으로 $\E f$를 쓰고 $\sup\E\le\E\sup$ — 3점
- 맞바꿈 대칭으로 부호 $\xi_i$ 넣기 — 3점
- $\sup$을 둘로 나누고 $-\xi$의 대칭성 — 2점` },
      { sec: '18.7', type: 'open', lv: 3, quiz: true, proof: true, q: R`$\lVert x_i\rVert\le1$이고 $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$일 때 $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le Q/\sqrt n$임을 증명하세요.`,
        sol: R`$\sup_{\lVert w\rVert\le Q}\frac1n\sum_i\xi_i\langle w,x_i\rangle=\frac1n\sup_{\lVert w\rVert\le Q}\langle w,v\rangle$, $v=\sum_i\xi_ix_i$. 코시-슈바르츠로 이 값은 $\frac Qn\lVert v\rVert$ ($w=Qv/\lVert v\rVert$에서 등호).
젠센(제곱근은 오목): $\E\lVert v\rVert\le\sqrt{\E\lVert v\rVert^2}$. $\E\lVert v\rVert^2=\sum_{i,j}\E[\xi_i\xi_j]\langle x_i,x_j\rangle=\sum_i\lVert x_i\rVert^2\le n$ ($\E\xi_i\xi_j=0$, $i\ne j$).
따라서 $\widehat{\operatorname{Rad}}_S\le\frac Qn\sqrt n=\frac Q{\sqrt n}$.`,
        rubric: R`- 코시-슈바르츠로 $\sup$ 계산 — 2점
- 젠센 부등식 — 1점
- 교차항 소거로 $\E\lVert v\rVert^2=\sum\lVert x_i\rVert^2$ — 2점` },
      { sec: '18.7', type: 'num', lv: 2, q: R`칠판의 $\operatorname{Rad}\le Q/\sqrt n$에서 $Q=2$일 때 $\operatorname{Rad}\le0.05$가 보장되는 가장 작은 $n$은?`, ans: '1600', ansTex: R`1600`,
        sol: R`$\frac2{\sqrt n}\le0.05\iff\sqrt n\ge40\iff n\ge1600$. 오차를 절반으로 줄이려면 데이터가 네 배 필요합니다($1/\sqrt n$의 속도).` },
    ],
  });
})();
