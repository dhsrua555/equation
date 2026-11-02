/* 17 보편 근사 정리 — 8주차 수요일(10/21) 필기 1–7쪽 (Universal approximation theorem, Cybenko 1989).
   필기 7–9쪽의 바론 클래스는 18단원에서 10/26 필기와 함께 다룹니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 17, part: 'F', title: '보편 근사 정리', en: 'Universal Approximation Theorem', ref: 'W8 수 필기', plot: 'uat',
    fig: R`보편 근사 정리: 굵은 곡선(연속 함수)을 가파른 시그모이드 $N=4,8,16$개를 더한 계단이 점점 가깝게 따라간다`,
    tagline: R`은닉층 하나에 시그모이드 뉴런을 충분히 많이 두면 $[0,1]^n$ 위의 어떤 연속 함수든 원하는 만큼 가깝게 흉내 낼 수 있습니다. 측도·노름·조밀성이라는 말을 차례로 익히고, 한-바나흐 정리와 리스 표현 정리를 빌려 Cybenko(1989)의 귀류법 증명을 끝까지 따라갑니다.`,
    summary: R`실제로 얻는 신경망과 정말 원하는 함수 사이의 오차를 **근사·일반화·최적화** 세 조각으로 나누고, 그 가운데 근사 오차를 다룹니다. 질문은 “은닉층 하나짜리 망 $G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)$로 연속 함수를 얼마든지 가깝게 만들 수 있는가”입니다. 이를 정확히 말하려고 **측도**(부호 측도, 보렐 집합), **노름 공간** $C(I_n)$과 최대 노름, **조밀성**을 정의합니다. 핵심 성질은 **판별 함수**: 모든 뉴런과의 적분이 0인 측도는 0뿐이라는 것이고, 연속 시그모이드가 이 성질을 가집니다(보조정리 1). 증명은 귀류법입니다. 망들의 모임 $U$가 조밀하지 않다면 한-바나흐 따름정리(보조정리 3)가 $U$ 위에서 0인 유계 선형 범함수를 주고, **리스 표현 정리**가 그것을 0이 아닌 측도 $\mu$에 대한 적분으로 바꿉니다(보조정리 4). 그런데 모든 뉴런과 $\mu$의 적분이 0이므로 판별성에 의해 $\mu=0$ — 모순입니다(보조정리 5, **Cybenko 정리**). 마지막으로 이 정리가 뉴런 수·학습 가능성에 대해서는 아무것도 말하지 않는다는 점을 짚고 18단원으로 넘어갑니다.`,
    goals: [
      R`이상적 목표, 가설 클래스 안의 최선, 경험적 위험의 최소점, 알고리즘의 출력을 구분하고 근사·일반화·최적화 오차가 각각 무엇인지 말할 수 있다`,
      R`측도의 두 공리, 보렐 집합, 부호 측도와 $\mu=0$의 뜻을 설명하고 디랙 측도·밀도가 있는 측도에 대한 적분을 계산할 수 있다`,
      R`$C(K)$가 선형 공간이고 최대 노름 $\lVert f\rVert_\infty$가 노름임을 보이고, 조밀성을 $\varepsilon$으로 정의하고 닫힘으로 바꿔 말할 수 있다`,
      R`시그모이드와 판별 함수를 정의하고, 보편 근사 정리의 진술을 “모든 $x$에서 $\varepsilon$ 이내”라는 뜻으로 정확히 쓸 수 있다`,
      R`한-바나흐 따름정리(보조정리 3)와 리스 표현 정리로 보조정리 4를 증명할 수 있다`,
      R`보조정리 5와 Cybenko 정리를 귀류법으로 증명하고, 이 정리가 말하지 않는 것(뉴런 수, 가중치를 찾는 법, 일반화)을 설명할 수 있다`,
    ],
    secTitles: { '17.1': '세 가지 오차', '17.2': '측도', '17.3': '노름과 조밀성', '17.4': '시그모이드와 판별', '17.5': '한-바나흐·리스', '17.6': 'Cybenko 정리' },
    sections: [
      { k: '17.1', src: 'W8 수 필기 1쪽', title: '세 가지 오차와 근사 문제', body: R`
:::idea 쉽게 말하면
우리가 손에 쥐는 신경망과 정말 원하는 함수 사이의 거리는 세 조각으로 나뉩니다. (1) 고른 **망 구조가 애초에** 그 함수를 흉내 낼 수 있는가(근사), (2) 유한한 자료로 고른 함수가 **처음 보는 자료에도** 통하는가(일반화), (3) 경사하강법이 **실제로** 그 함수를 찾아냈는가(최적화). 지금까지는 (3)을 주로 보았고, 이 단원과 18단원은 (1)과 (2)를 수학으로 답합니다.
:::

필기의 첫 쪽에는 상자 하나와 화살표 셋이 있습니다(아래 그림). 상자는 우리가 고른 망 구조로 만들 수 있는 함수 전체, 곧 **가설 클래스** $\mathcal F$입니다(예: 은닉층 하나에 뉴런 $N$개인 망 전체). 상자 밖의 “Ideal target”은 정말 맞히고 싶은 함수 $f^*$이고, 필기는 그 옆에 펄스 모양의 함수를 그려 두었습니다. 세 화살표에는 opt, gen, app이라는 이름이 붙어 있습니다.

:::fig errsplit
:::

자료가 분포 $P$에서 나오고 손실이 $\ell$일 때, 함수 $f$의 **위험**(모집단 위험)과 **경험적 위험**은
$$\mathcal R(f)=\E_{(X,Y)\sim P}\big[\ell(Y,f(X))\big],\qquad\widehat{\mathcal R}_n(f)=\frac1n\sum_{i=1}^n\ell(y_i,f(x_i))$$
입니다[[ch18:18.6|모집단 위험과 경험적 위험은 18.6절에서 자세히 다룹니다.]]. 네 함수를 구분합니다: 모든 함수 가운데 위험이 가장 작은 $f^*$, 클래스 안에서 위험이 가장 작은 $f_{\mathcal F}=\argmin_{f\in\mathcal F}\mathcal R(f)$, 자료로 고를 수 있는 경험적 위험의 최소점 $\hat f_n=\argmin_{f\in\mathcal F}\widehat{\mathcal R}_n(f)$, 그리고 알고리즘(예: SGD)이 실제로 내놓은 $f_{\mathrm{alg}}\in\mathcal F$.

:::key 오차 분해
$$\begin{aligned}\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)=\ &\underbrace{\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)}_{\text{최적화 오차}}+\underbrace{\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})}_{\text{일반화 오차}}\\&+\underbrace{\mathcal R(f_{\mathcal F})-\mathcal R(f^*)}_{\text{근사 오차}}\end{aligned}$$
근사 오차와 일반화 오차는 $0$ 이상이다($f_{\mathcal F}$, $f^*$가 각각의 범위에서 최소이므로).
:::

세 항은 서로 다른 질문이고, 이 과목의 단원들이 하나씩 맡습니다.

| 오차 | 질문 | 다루는 곳 |
|---|---|---|
| 근사 | 망 구조가 목표를 흉내 낼 수 있나? | 이 단원(가능하다), 18.1–18.5절(얼마나 빨리) |
| 일반화 | 유한한 자료의 최선이 모집단에서도 좋은가? | 18.6–18.7절(라데마허 복잡도) |
| 최적화 | 알고리즘이 경험적 위험의 최소점에 닿았나? | 13–14단원(하강 보조정리, SGD, Adam) |

같은 분해가 기계 학습 분야에서는 근사 오차와 추정 오차로 나옵니다[[@ml:ch04:5.2|오차 분해: 근사 오차와 추정 오차.]]. 클래스를 키우면(뉴런을 늘리면) 근사 오차는 줄어들 수만 있지만, 같은 자료로 더 많은 함수 가운데 골라야 하므로 일반화 오차는 커질 수 있습니다. 편향-분산 분해와 같은 줄다리기입니다[[ch02:2.8|가우시안 평균의 MAP과 편향-분산 분해.]].

:::ex 예제 1 — 세 오차 계산
어떤 문제에서 $\mathcal R(f^*)=0.05$, $\mathcal R(f_{\mathcal F})=0.08$, $\mathcal R(\hat f_n)=0.12$, $\mathcal R(f_{\mathrm{alg}})=0.15$이다. 세 오차와 전체 초과 위험은?
---
근사 $0.08-0.05=0.03$, 일반화 $0.12-0.08=0.04$, 최적화 $0.15-0.12=0.03$. 합은 $0.10=\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)$입니다. 이 경우 가장 큰 몫은 일반화 오차이므로, 뉴런을 늘리기보다 자료를 늘리거나 규제를 거는 편이 먼저입니다.
:::

### 더 깊이

최적화 오차 $\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)$은 **음수일 수도** 있습니다. $\hat f_n$은 경험적 위험을 최소로 할 뿐 모집단 위험까지 최소로 하는 것은 아니므로, 덜 최적화된 $f_{\mathrm{alg}}$가 우연히(또는 일찍 멈추기 같은 암묵적 규제 덕분에) 모집단에서 더 나을 수 있습니다. 반면 근사 오차와 일반화 오차는 정의상 $0$ 이상입니다.
` },
      { k: '17.2', src: 'W8 수 필기 1쪽', title: '측도·보렐 집합·부호 측도', body: R`
:::idea 쉽게 말하면
**측도**는 집합의 크기를 재는 자입니다. 길이·넓이·부피·확률이 모두 측도입니다. **부호 측도**는 음수도 허용한 크기로, 양전하와 음전하가 섞인 전하 분포처럼 두 측도의 차입니다. 이 단원에서 측도가 필요한 이유는 하나입니다: 연속 함수에 수를 대응시키는 선형 규칙을 “어떤 측도에 대한 적분”으로 나타내기 위해서입니다(17.5절).
:::

:::hand 수업 필기 — 측도의 정의
음이 아닌 측도(nonnegative measure)는
$$\mu(\varnothing)=0,\qquad\mu\Big(\bigcup_{j=1}^\infty A_j\Big)=\sum_{j=1}^\infty\mu(A_j)\quad(A_j\text{가 서로소일 때})$$
를 만족한다. $K$의 **보렐 집합**은 $K$의 열린 부분집합을 모두 포함하고, $K$ 안에서의 여집합과 가산 합집합에 대해 닫힌 가장 작은 모임을 이룬다. 부호 측도(signed measure)는 부호가 있는 측도이다. $\mu=0$은 모든 집합 $A$에 대해 $\mu(A)=0$이라는 뜻이다.
:::

:::key 측도와 부호 측도
**측도** $\mu$: 보렐 집합마다 $[0,\infty]$의 값을 주고, $\mu(\varnothing)=0$이며 서로소인 $A_1,A_2,\dots$에 대해 $\mu\big(\bigcup_jA_j\big)=\sum_j\mu(A_j)$ (가산 가법성).
**유한 부호 측도**: 값이 실수(음수 허용)이고 같은 두 공리를 만족한다. 언제나 두 유한 측도의 차 $\mu=\mu^+-\mu^-$로 쓸 수 있다.
$$\mu=0\iff\mu(A)=0\ \ (\text{모든 보렐 집합 }A),\qquad\int f\,d\mu=\int f\,d\mu^+-\int f\,d\mu^-.$$
:::

**보렐 집합**은 열린 집합에서 출발해 여집합과 가산 합집합을 몇 번이고 되풀이해 얻는 집합들입니다. 닫힌 집합(열린 집합의 여집합), 한 점, 구간, 반공간, 초평면이 모두 들어 있습니다. “모든 부분집합”이 아니라 보렐 집합에만 크기를 주는 이유는, 모든 부분집합에 가산 가법성을 지키며 길이를 주는 것이 불가능하기 때문입니다. 공학에서 만나는 집합은 모두 보렐 집합이라고 생각해도 됩니다.

세 가지 예를 기억하면 충분합니다.
- **르베그 측도**(길이): $[0,1]$에서 $\lambda([a,b])=b-a$, 그리고 $\int f\,d\lambda=\int_0^1f(x)\,dx$ (보통의 적분).
- **디랙 측도** $\delta_p$: $p\in A$이면 $\delta_p(A)=1$, 아니면 $0$. 적분은 함숫값 하나 $\int f\,d\delta_p=f(p)$.
- **밀도가 있는 측도**: $\mu(A)=\int_Ag(x)\,dx$. $g$가 음수일 수 있으면 부호 측도이고, $\int f\,d\mu=\int f(x)g(x)\,dx$.

이 단원 내내 $I_n=[0,1]^n$ (단위 정육면체)이고, $M(I_n)$은 $I_n$ 위의 유한 부호 (정칙) 보렐 측도의 모임입니다. 예를 들어 $\delta_{0.2}-\delta_{0.7}$은 $M(I_1)$의 원소이고, $\int f\,d(\delta_{0.2}-\delta_{0.7})=f(0.2)-f(0.7)$입니다.

:::ex 예제 2 — 부호 측도에 대한 적분
$[0,1]$ 위의 $\mu=2\delta_0-\delta_{1/2}+\lambda$ ($\lambda$는 길이)에 대해 $f(x)=x^2$의 적분 $\int f\,d\mu$와 $\mu([0,1])$을 구하세요.
---
$\int f\,d\mu=2f(0)-f(\tfrac12)+\int_0^1x^2dx=0-\tfrac14+\tfrac13=\tfrac1{12}$, $\mu([0,1])=2-1+1=2$. 한편 $f(x)=x^3$이면 $0-\tfrac18+\tfrac14=\tfrac18$입니다. 함수마다 적분값이 다르고, 어느 하나가 $0$이라고 $\mu=0$인 것은 아닙니다.
:::

:::warn “적분이 0”과 “측도가 0”은 다르다
$\mu=0$은 **모든** 보렐 집합에서 $\mu(A)=0$이라는 강한 조건입니다. 예를 들어 $\mu=\delta_{0.2}-\delta_{0.7}$은 $\mu([0,1])=0$이고 $\int f\,d\mu=0$인 연속 함수도 많지만($f(0.2)=f(0.7)$이면 됨) $\mu(\{0.2\})=1$이므로 $\mu\ne0$입니다. 거꾸로, **모든** 연속 함수 $f$에 대해 $\int f\,d\mu=0$이면 $\mu=0$입니다(리스 표현 정리의 유일성, 17.5절). 판별 함수의 정의(17.4절)는 이 사이 어딘가 — “모든 뉴런과의 적분이 0” — 에서 $\mu=0$을 끌어내는 성질입니다.
:::

### 더 깊이

“정칙”(regular)은 측도가 열린 집합과 닫힌(컴팩트) 집합으로 안팎에서 근사된다는 기술적 조건입니다. $I_n$처럼 컴팩트한 거리 공간 위의 유한 보렐 측도는 자동으로 정칙이므로 이 단원에서는 신경 쓰지 않아도 됩니다. 부호 측도를 $\mu^+-\mu^-$로 쓰는 방법 가운데 겹치는 부분이 없는 표준적인 것을 조르당 분해라 하고, $\lvert\mu\rvert=\mu^++\mu^-$를 전변동이라 합니다. $\big\lvert\int f\,d\mu\big\rvert\le\lVert f\rVert_\infty\lvert\mu\rvert(I_n)$가 성립합니다.
` },
      { k: '17.3', src: 'W8 수 필기 2쪽', title: '선형 공간·노름·조밀성', body: R`
:::idea 쉽게 말하면
함수도 벡터처럼 더하고 실수배할 수 있습니다. 두 함수 사이의 거리를 “가장 크게 벌어진 곳의 차이”로 재면, “망이 함수를 근사한다”는 말을 정확한 부등식으로 쓸 수 있습니다. 어떤 모임이 **조밀**하다는 것은 그 모임 안에 어떤 목표에든 원하는 만큼 가까운 원소가 있다는 뜻입니다 — 유리수가 실수 안에서 조밀한 것처럼요.
:::

:::hand 수업 필기 — 선형 공간, 노름 공간, 조밀
- 실 선형 공간(벡터 공간)은 원소끼리 더하고 실수를 곱할 수 있으며 보통의 벡터 공간 규칙을 따르는 집합이다. 예: $C(K)=\{f:K\to\mathbb R\ :\ f\text{는 연속}\}$. $f,g\in C(K)$, $a,b\in\mathbb R$이면 $af+bg\in C(K)$이고 $(af+bg)(x)=af(x)+bg(x)$.
- 노름 선형 공간은 함수 $\lVert\cdot\rVert:X\to[0,\infty)$가 붙은 선형 공간 $X$로, $\lVert u\rVert=0\iff u=0$, $\lVert cu\rVert=\lvert c\rvert\lVert u\rVert$, $\lVert u+v\rVert\le\lVert u\rVert+\lVert v\rVert$를 만족한다.
- 조밀: 부분집합 $D\subseteq X$가 $X$에서 조밀하다는 것은 $\forall f\in X$, $\forall\varepsilon>0$에 대해 $\lVert f-g\rVert<\varepsilon$인 $g\in D$가 있다는 것이다.
:::

:::key 최대 노름과 조밀성
$K$가 컴팩트이면 $C(K)$의 **최대 노름**은 $\lVert f\rVert_\infty=\max_{x\in K}\lvert f(x)\rvert$ (연속 함수는 컴팩트 집합에서 최댓값을 가진다).
$$D\text{가 }X\text{에서 조밀}\iff\forall f\in X,\ \forall\varepsilon>0,\ \exists g\in D:\ \lVert f-g\rVert<\varepsilon\iff\overline D=X.$$
$C(K)$에서 $\lVert f-g\rVert_\infty<\varepsilon$은 $\lvert f(x)-g(x)\rvert<\varepsilon$ ($\forall x\in K$)과 같다.
:::

최대 노름이 노름의 세 조건을 만족하는지 확인해 봅시다. $\lVert f\rVert_\infty=0$이면 모든 점에서 $f(x)=0$입니다. $\lVert cf\rVert_\infty=\max\lvert c\rvert\lvert f(x)\rvert=\lvert c\rvert\lVert f\rVert_\infty$입니다. 삼각부등식은 점마다 $\lvert f(x)+g(x)\rvert\le\lvert f(x)\rvert+\lvert g(x)\rvert\le\lVert f\rVert_\infty+\lVert g\rVert_\infty$이고, 좌변의 최댓값을 취하면 됩니다[[@em:ch17:3.1c|노름과 노름공간.]].

**닫힘**(closure) $\overline D$는 $D$의 원소들로 만든 수열의 극한으로 닿을 수 있는 모든 점입니다. 위 정의의 $\varepsilon$ 조건은 “$f$에 수렴하는 $D$의 수열이 있다”와 같으므로, 조밀하다는 것은 $\overline D=X$와 같습니다. 필기의 그림은 닫힌 곡선(공간 $X$)을 붉은 점선(조밀한 $D$)이 빈틈없이 따라가고, 파란 점(아무 원소)에 $D$의 원소가 얼마든지 가까이 있는 모습입니다. 또 $U$가 선형 부분공간이면 $\overline U$도 선형 부분공간입니다(증명 페이지).

:::fig dense
:::

최대 노름으로 수렴하는 것은 **균등수렴**과 같습니다[[@base:ch05:5.3|균등수렴.]]. 그래서 “$C(I_n)$에서 조밀하다”는 말은 가장 강한 뜻의 근사입니다: 오차 $\varepsilon$이 **정의역의 모든 점에서 한꺼번에** 지켜집니다. 잘 알려진 예가 바이어슈트라스 정리(다항식은 $C([a,b])$에서 조밀하다)이고, 삼각다항식으로 주기 함수를 근사하는 것도 같은 종류입니다[[@em:ch10:11.4|삼각다항식에 의한 근사.]]. 보편 근사 정리는 다항식 자리에 신경망을 넣은 정리입니다.

:::ex 예제 3 — 최대 노름 계산
$[0,1]$에서 $f(x)=x$, $g(x)=x^2$의 거리 $\lVert f-g\rVert_\infty$를 구하세요.
---
$h(x)=x-x^2\ge0$이고 $h'(x)=1-2x=0$에서 $x=\tfrac12$. $h(\tfrac12)=\tfrac14$, 양 끝에서 $0$이므로 $\lVert f-g\rVert_\infty=\tfrac14$입니다.
:::

:::warn 노름이 다르면 “가깝다”도 다르다
$g_k(x)=x^k$ ($[0,1]$)은 제곱적분 노름으로는 $\lVert g_k\rVert_2=\big(\int_0^1x^{2k}dx\big)^{1/2}=\frac1{\sqrt{2k+1}}\to0$이라 $0$에 가까워지지만, 최대 노름으로는 $\lVert g_k\rVert_\infty=g_k(1)=1$이라 전혀 가까워지지 않습니다. 보편 근사 정리는 최대 노름(균등) 근사이고, 18단원의 바론 정리는 제곱적분 노름 근사입니다. 어떤 노름의 이야기인지 늘 확인하세요.
:::

### 더 깊이

**조밀**과 **진부분공간**은 서로 배타적이지 않습니다. 다항식 전체는 $C([0,1])$의 진부분공간이지만($e^x$는 다항식이 아님) 조밀합니다. 그래서 17.5절의 보조정리 3은 “$U\ne X$”가 아니라 “$U$가 조밀하지 않다($\overline U\ne X$)”를 가정합니다.
` },
      { k: '17.4', src: 'W8 수 필기 3–4쪽', title: '시그모이드와 판별 함수', body: R`
:::idea 쉽게 말하면
보이고 싶은 것은 은닉층 하나짜리 망 $G(x)=\sum_j\alpha_j\sigma(w_j^Tx+\theta_j)$들의 모임이 $C(I_n)$에서 조밀하다는 것입니다. 열쇠는 **판별성**: 뉴런 $\sigma(w^Tx+\theta)$ 하나하나를 측도를 재는 탐침으로 보면, 0이 아닌 측도는 어떤 탐침에든 반드시 걸린다는 성질입니다. 모든 탐침에 0으로 보이는 측도는 0뿐입니다.
:::

:::hand 수업 필기 — 목표와 두 정의
**목표: 보편 근사 정리(UAT)를 어떻게 보일까?**
정리. $\sigma$를 임의의 연속 시그모이드 함수라 하자. 그러면
$$G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j),\qquad w_j\in\mathbb R^n,\ \alpha_j,\theta_j\in\mathbb R$$
꼴의 유한합들은 $C(I_n)$에서 조밀하다.

정의. 함수 $\sigma:\mathbb R\to[0,1]$이 $\sigma\in C^1(\mathbb R)$이고 $\lim_{x\to-\infty}\sigma(x)=0$, $\lim_{x\to\infty}\sigma(x)=1$이면 **시그모이드**라 한다.

정의. $\mu\in M(I_n)$ (부호 보렐 측도)라 하자. 함수 $\sigma$가 다음을 만족하면 측도 $\mu$에 대해 **판별적**(discriminatory)이라 한다.
$$\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0\quad\forall w\in\mathbb R^n,\ \forall\theta\in\mathbb R\ \Longrightarrow\ \mu=0$$

보조정리 1. 연속 시그모이드 함수는 모든 $\mu\in M(I_n)$에 대해 판별적이다. (증명은 수업에서 생략)
:::

:::key 시그모이드와 판별 함수
**시그모이드**: $\sigma:\mathbb R\to\mathbb R$, $\displaystyle\lim_{t\to-\infty}\sigma(t)=0$, $\displaystyle\lim_{t\to\infty}\sigma(t)=1$.
**판별 함수**: 모든 $\mu\in M(I_n)$에 대해
$$\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0\ \ (\forall w\in\mathbb R^n,\ \forall\theta\in\mathbb R)\ \Longrightarrow\ \mu=0.$$
**보조정리 1**: 연속 시그모이드는 판별 함수다.
:::

:::warn 필기의 시그모이드 정의는 필요보다 강하다
필기는 $\sigma\in C^1$과 값의 범위 $[0,1]$까지 요구했지만, Cybenko의 정리에는 **연속**이고 양 끝 극한이 $0$과 $1$이기만 하면 충분합니다(연속성은 $G$가 $C(I_n)$에 들어가기 위해 필요합니다). 보조정리 1 자체는 유계이고 측정가능한 시그모이드(예: 계단 함수 $H$)에서도 성립합니다. 로지스틱 함수 $s(t)=\frac1{1+e^{-t}}$은 두 정의를 모두 만족합니다[[ch05:5.1|오즈, 로짓, 시그모이드.]]. $\tanh$는 극한이 $\pm1$이라 정의에 맞지 않지만 $\tanh t=2s(2t)-1$이고, 상수는 $w=0$인 뉴런 $s(\theta)$로 만들 수 있으므로 $\tanh$ 망이 만드는 함수의 모임은 로지스틱 망과 같습니다.
:::

**판별성의 그림.** 뉴런을 가파르게 만들면($\sigma(\lambda(w^Tx+\theta))$, $\lambda\to\infty$) 반공간 $\{w^Tx+\theta>0\}$에서 $1$, 반대쪽에서 $0$인 계단이 됩니다. 그러니 판별적이라는 것은 대략 “모든 반공간에서 크기가 $0$인 측도는 $0$뿐”이라는 말입니다. 모든 방향의 단면 정보로 물체를 복원하는 CT 촬영과 비슷한 생각입니다. 보조정리 1의 증명(증명 페이지, 판서에 없는 증명)은 이 극한으로 반공간을 얻고, 반공간에서 $0$이면 측도의 푸리에 변환이 $0$이 되어 측도가 $0$임을 보입니다[[@em:ch10:11.9|푸리에 변환.]].

:::ex 예제 4 — 점 두 개짜리 측도는 들킨다
$n=1$, $\mu=\delta_a-\delta_b$ ($a\ne b$, $a,b\in[0,1]$)에 대해 로지스틱 함수 $s$로 $\int s(wx+\theta)\,d\mu\ne0$인 $w,\theta$를 찾으세요.
---
$\int s(wx+\theta)\,d\mu=s(wa+\theta)-s(wb+\theta)$. $w=1$, $\theta=0$이면 $s(a)-s(b)$이고 $s$는 순증가하므로 $a\ne b$에서 $0$이 아닙니다. 따라서 이 $\mu$는 “모든 뉴런과의 적분이 0”이라는 조건을 만족하지 못하고, 판별성의 정의와 모순 없이 $\mu\ne0$입니다.
:::

판별적이지 **않은** 함수의 예도 보면 정의가 분명해집니다. 항등함수 $\sigma(t)=t$(시그모이드가 아님)로 만든 뉴런은 1차 함수 $wx+\theta$뿐입니다. $n=1$에서 $\mu=\delta_0-2\delta_{1/2}+\delta_1$을 잡으면
$$\int(wx+\theta)\,d\mu=\theta-2\Big(\frac w2+\theta\Big)+(w+\theta)=0\qquad(\forall w,\theta)$$
인데 $\mu\ne0$입니다. 실제로 1차 함수의 합은 1차 함수라 $x^2$을 근사할 수 없고, 이 $\mu$가 바로 그 “빈 방향”을 잡아내는 측도입니다($\int x^2d\mu=0-\frac12+1=\frac12\ne0$).

### 더 깊이

시그모이드가 아닌 활성화 함수도 보편 근사를 합니다. Leshno·Lin·Pinkus·Schocken(1993)은 연속 활성화 함수에 대해 “은닉층 하나짜리 망이 조밀하다 $\iff$ $\sigma$가 다항식이 아니다”를 보였고, 그래서 ReLU 망도 보편 근사기입니다[[ch10:10.4|활성화 함수 다시 보기.]]. 다항식 활성화가 안 되는 이유는 위의 항등함수 예와 같습니다: 차수가 $k$인 다항식 $\sigma$로 만든 망은 차수 $k$ 이하의 다항식만 만듭니다.
` },
      { k: '17.5', src: 'W8 수 필기 4–5쪽', title: '한-바나흐 따름정리와 리스 표현 정리', body: R`
:::idea 쉽게 말하면
조밀하지 않은 부분공간 $U$가 있으면, $U$의 모든 원소에는 $0$을 내놓지만 전체 공간에서는 $0$이 아닌 “측정 장치”(유계 선형 범함수)를 만들 수 있습니다(한-바나흐). 그리고 $C(K)$ 위의 그런 장치는 하나도 빠짐없이 어떤 측도에 대한 적분입니다(리스). 둘을 합치면: 조밀하지 않으면 $U$의 모든 함수와 적분이 $0$인, $0$이 아닌 측도가 있습니다(보조정리 4).
:::

**선형 범함수**는 공간의 원소에 실수를 대응시키는 선형 사상 $L:X\to\mathbb R$이고, $\lvert L(f)\rvert\le C\lVert f\rVert$인 상수 $C$가 있으면 **유계**입니다(유계 $\iff$ 연속). $C([0,1])$에서의 예: 한 점에서의 값 $f\mapsto f(0.3)$ ($\lvert f(0.3)\rvert\le\lVert f\rVert_\infty$), 적분 $f\mapsto\int_0^1f(x)\,dx$, 두 점의 차 $f\mapsto f(0)-f(1)$. 모두 측도에 대한 적분 $\int f\,d\delta_{0.3}$, $\int f\,d\lambda$, $\int f\,d(\delta_0-\delta_1)$으로 쓸 수 있다는 점을 눈여겨보세요.

:::hand 수업 필기 — 보조정리 3과 4
**보조정리 3.** $U$가 노름 선형 공간 $X$의 조밀하지 않은 선형 부분공간이면, $X$ 위의 유계 선형 범함수 $L$이 있어 $X$에서 $L\ne0$이고 $L|_U=0$이다. (증명 생략)

**보조정리 4.** $U$가 $C(I_n)$의 조밀하지 않은 선형 부분공간이면, 측도 $\mu\in M(I_n)$가 있어 $\int_{I_n}h\,d\mu=0$ ($\forall h\in U$)이다.

(증명) 보조정리 3에서 $X=C(I_n)$으로 두면, 유계 선형 범함수 $L:C(I_n)\to\mathbb R$이 있어 $C(I_n)$에서 $L\ne0$이고 $L|_U=0$이다.
:::

:::key 리스 표현 정리 (RRT)
$K\subset\mathbb R^n$이 컴팩트이고 $F$가 $C(K)$ 위의 유계 선형 범함수이면, $K$ 위의 유한 부호 측도 $\mu$가 **유일하게** 있어
$$F(f)=\int_Kf(x)\,d\mu(x)\qquad\forall f\in C(K).$$
$F$가 양(positive: $f\ge0\Rightarrow F(f)\ge0$)이면 $\mu$는 음이 아닌 측도다.
:::

:::hand 수업 필기 — 리스 표현 정리를 써서 보조정리 4 마무리
**사실 (R.R.T.)** $K$: $\mathbb R^n$의 컴팩트 집합, $C(K)$: $K$ 위의 연속 함수. 정리: $F$가 $C(K)$ 위의 유계 선형 범함수이면 $K$ 위의 유일한 유한 부호 측도 $\mu$가 있어 $F(f)=\int_Kf(x)\,d\mu(x)$, $\forall f\in C(K)$. 곧 $L$이 $C(K)$ 위의 양의 선형 범함수이면 $L(f)=\int_Kf(x)\,d\mu(x)$인 $K$ 위의 $\mu$가 있다.

$C(I_n)$ 위의 유계 선형 범함수에 R.R.T.를 쓰면 $\mu\in M(I_n)$가 있어 $L(f)=\int_{I_n}f\,d\mu$, $\forall f\in C(I_n)$. 특히 모든 $h\in U$에 대해 $L(h)=\int_{I_n}h\,d\mu=0$이고, 보조정리가 증명된다.
:::

:::key 보조정리 3·4
**보조정리 3** (한-바나흐 따름정리): 노름 공간 $X$의 선형 부분공간 $U$가 조밀하지 않으면($\overline U\ne X$) $L\ne0$이고 $L|_U=0$인 유계 선형 범함수 $L$이 있다.
**보조정리 4**: $U$가 $C(I_n)$의 조밀하지 않은 선형 부분공간이면 $\mu\ne0$인 $\mu\in M(I_n)$가 있어
$$\int_{I_n}h\,d\mu=0\qquad\forall h\in U.$$
:::

보조정리 4의 증명을 한 줄로 이으면 이렇습니다. 보조정리 3의 $L$을 리스 표현 정리로 $L(f)=\int f\,d\mu$라 쓰면, $h\in U$에서 $\int h\,d\mu=L(h)=0$이고, $L\ne0$이므로 $L(f_0)\ne0$인 $f_0$이 있어 $\int f_0\,d\mu\ne0$, 곧 $\mu\ne0$입니다.

:::warn 필기에서 고쳐 읽을 두 곳
(1) 보조정리 4의 진술에 **$\mu\ne0$**이 빠져 있습니다. $\mu=0$은 언제나 $\int h\,d\mu=0$을 만족하므로 이 조건이 없으면 보조정리는 아무 말도 하지 않습니다. 필기가 증명에서 $L\ne0$에 동그라미를 친 이유가 바로 $\mu\ne0$을 얻기 위해서입니다. (2) 마지막 줄의 “$L(f)=\int_{I_n}h\,d\mu=0$”은 $L(h)$입니다.
:::

**보조정리 3이 왜 참인가**(증명 페이지에 자세히). $\overline U$ 밖의 점 $f_0$을 고르면 $\overline U$가 닫혀 있으므로 거리 $d=\inf_{u\in\overline U}\lVert f_0-u\rVert$가 양수입니다. $u+tf_0$ ($u\in\overline U$)에 $td$를 주는 범함수는 $\overline U$에서 $0$, $f_0$에서 $d\ne0$이고 $\lvert td\rvert\le\lVert u+tf_0\rVert$로 유계입니다. 이것을 노름 한계를 지키며 $X$ 전체로 넓혀 주는 것이 **한-바나흐 정리**입니다. 조밀하면 이것이 불가능합니다: 유계 $L$이 $U$에서 $0$이면 연속성 때문에 $\overline U=X$ 전체에서 $0$입니다.

:::ex 예제 5 — 부분공간을 소멸시키는 측도 찾기
$X=C([0,1])$의 부분공간 $U=\{f:\ f(0)=f(1)\}$이 조밀하지 않음을 보이고, 보조정리 4의 $\mu$를 하나 찾으세요.
---
$L(f)=f(0)-f(1)$은 $\lvert L(f)\rvert\le2\lVert f\rVert_\infty$인 유계 선형 범함수이고 $U$에서 $0$, $f(x)=x$에서 $-1\ne0$입니다. $U$의 원소 $g$는 모두 $\lvert(f-g)(0)-(f-g)(1)\rvert=1$이므로 $\lVert f-g\rVert_\infty\ge\frac12$ — $f(x)=x$에 $\frac12$보다 가까이 갈 수 없어 조밀하지 않습니다. $\mu=\delta_0-\delta_1$이면 $\int h\,d\mu=h(0)-h(1)=0$ ($h\in U$)이고 $\mu\ne0$입니다. 이 $\mu$가 **부호** 측도라는 점이 중요합니다. 음이 아닌 측도만으로는 이런 부분공간을 다 잡을 수 없습니다.
:::
` },
      { k: '17.6', src: 'W8 수 필기 6–7쪽', title: 'Cybenko 정리의 증명', body: R`
:::idea 쉽게 말하면
귀류법입니다. 망들의 모임 $U$가 조밀하지 않다고 가정하면, 보조정리 4가 $U$의 모든 함수에 “보이지 않는” $0$ 아닌 측도 $\mu$를 줍니다. 그런데 뉴런 하나짜리 망 $\sigma(w^Tx+\theta)$도 $U$에 있으니 $\mu$는 모든 뉴런에 보이지 않고, 판별성 때문에 $\mu=0$이어야 합니다. 모순이므로 $U$는 조밀합니다.
:::

:::hand 수업 필기 — 보조정리 5와 Cybenko 정리
**보조정리 5.** $\sigma$를 임의의 연속 판별 함수라 하자. 그러면
$$G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j),\qquad w_j\in\mathbb R^n,\ \alpha_j,\theta_j\in\mathbb R$$
꼴의 유한합들은 $C(I_n)$에서 조밀하다.

(증명) $\sigma$가 연속이므로 $U=\big\{G:\ G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)\big\}$는 $C(I_n)$의 선형 부분공간이다. 귀류법으로 보인다. $U$가 $C(I_n)$에서 조밀하지 않다고 가정하자. 보조정리 4에 의해 측도 $\mu\in M(I_n)$가 있어 $\int_{I_n}h\,d\mu=0$, $\forall h\in U$.
$$\Rightarrow\ \sum_{j=1}^N\alpha_j\int_{I_n}\sigma(w_j^Tx+\theta_j)\,d\mu=0\quad\forall w_j\in\mathbb R^n,\ \alpha_j,\theta_j\in\mathbb R$$
$$\Rightarrow\ \int_{I_n}\sigma(w^Tx+\theta)\,d\mu=0\quad\forall w\in\mathbb R^n,\ \theta\in\mathbb R.$$
$\sigma$가 판별적이라는 것을 쓰면 $\mu=0$. 모순. ↯

**정리 (Cybenko, 1989).** $\sigma$를 임의의 연속 시그모이드라 하자. $G(x)=\sum\alpha_j\sigma(w_j^Tx+\theta_j)$들은 $C(I_n)$에서 조밀하다. (UAT)
:::

:::key 보편 근사 정리 (Cybenko 1989)
$\sigma$가 연속 시그모이드이면, 모든 $f\in C(I_n)$와 $\varepsilon>0$에 대해 $N\in\mathbb N$과 $w_j\in\mathbb R^n$, $\alpha_j,\theta_j\in\mathbb R$가 있어
$$\Big\lvert f(x)-\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)\Big\rvert<\varepsilon\qquad\forall x\in I_n.$$
(보조정리 1 + 보조정리 5)
:::

증명의 각 단계를 짚어 봅니다.
- **$U$가 선형 부분공간인 이유.** 두 유한합을 더하면 뉴런을 이어 붙인 유한합이고, 실수배는 $\alpha_j$만 바꿉니다. $\alpha=0$이면 $0$ 함수입니다. 그리고 $\sigma$가 연속이라 각 $G$가 연속이므로 $U\subseteq C(I_n)$입니다. **$\sigma$의 연속성이 쓰이는 곳은 여기**입니다.
- **둘째 줄에서 셋째 줄로.** 첫 식은 모든 $N$과 계수에 대해 성립하므로 $N=1$, $\alpha_1=1$로 두면 뉴런 하나 $\sigma(w^Tx+\theta)$에 대한 식이 나옵니다.
- **모순.** 보조정리 4가 준 것은 $\mu\ne0$인 측도(17.5절의 수정)이므로, $\mu=0$과 정면으로 부딪힙니다.

:::warn 무엇을 부정하는가: $U\ne C(I_n)$이 아니라 $\overline U\ne C(I_n)$
“$U$가 조밀하다”의 부정은 “**닫힘** $\overline U$가 $C(I_n)$ 전체가 아니다”입니다. 유한합들의 모임 $U$ 자체는 보통 $C(I_n)$ 전체가 아니므로 “$U\ne C(I_n)$”을 가정해서는 아무것도 나오지 않습니다(다항식이 조밀하지만 전부는 아닌 것과 같음). 보조정리 3의 한-바나흐 구성도 $\overline U$ 밖의 점 $f_0$과의 양의 거리를 씁니다. 필기의 증명은 보조정리 4를 “조밀하지 않다”는 가정에 그대로 걸었으므로 옳고, 닫힘은 보조정리 3 안에서 쓰입니다.
:::

**한 차원에서 직접 만들어 보기.** 정리는 존재만 말하지만 $n=1$에서는 망을 손으로 지을 수 있습니다. $[0,1]$을 $N$칸으로 나눈 점 $x_j=\frac jN$, 칸의 가운데 $m_j$에 대해
$$G_N(x)=f(0)+\sum_{j=1}^N\big(f(x_j)-f(x_{j-1})\big)\,\sigma\big(\lambda(x-m_j)\big)$$
로 두면 $\lambda$가 클 때 뉴런 하나가 계단 하나가 되어 $f$를 계단으로 따라갑니다(아래 그림). $f$가 균등연속이므로 $N$을 늘리면 최대 오차가 $0$으로 갑니다.

:::fig stair
:::

:::ex 예제 6 — 계단 근사에 필요한 뉴런 수
$f(x)=x$를 위의 계단으로 근사하되 $\sigma$를 계단 함수 $H$로 두자($\lambda\to\infty$의 극한). 최대 오차를 $N$으로 나타내고, 오차를 $0.01$ 이하로 만드는 가장 작은 $N$을 구하세요.
---
$x\in[m_j,m_{j+1})$에서 $G_N(x)=x_j=\frac jN$이고, 이 구간에서 $\lvert x-\frac jN\rvert$의 상한은 양 끝 $m_j=x_j-\frac1{2N}$, $m_{j+1}=x_j+\frac1{2N}$에서 $\frac1{2N}$입니다(양 끝 구간도 같음). 따라서 최대 오차는 $\frac1{2N}$이고, $\frac1{2N}\le0.01\iff N\ge50$. 같은 격자 방식을 $n$차원 정육면체에 쓰면 칸이 $N^n$개라 뉴런도 그만큼 필요합니다 — $n=10$이면 $50^{10}$개입니다.
:::

### 더 깊이

정리가 **말하지 않는 것**을 분명히 해 둡시다.
- **뉴런이 몇 개 필요한가.** 존재만 보장하고 $N$에 대한 정보는 없습니다. 위 예제처럼 일반적인 연속 함수에는 차원에 따라 지수적으로 많은 뉴런이 필요할 수 있습니다. 18단원의 **바론 정리**는 푸리에 변환이 적당히 작은 함수에 대해 차원과 무관한 속도 $C^2/N$을 줍니다[[ch18:18.2|바론 정리와 차원의 저주.]].
- **가중치를 어떻게 찾는가.** 존재 증명(귀류법)이라 구성법이 없고, 손실이 볼록하지 않아 경사하강법이 그 가중치에 닿는다는 보장도 없습니다(최적화 오차, 13–14단원).
- **유한한 자료로 배울 수 있는가.** 일반화 오차는 별개의 문제입니다(18.7절).
- **어디서 근사하는가.** 컴팩트 집합 위에서만입니다. $I_n$ 대신 임의의 컴팩트 $K\subset\mathbb R^n$이어도 되지만, $\mathbb R$ 전체에서 $f(x)=x$를 균등 근사할 수는 없습니다($G$는 유계 함수의 유한합이라 유계).
- **깊이.** 이 정리는 넓이(은닉층 하나의 뉴런 수)에 관한 것입니다. 층을 쌓는 것의 이점은 다른 질문입니다[[ch08:8.5|층을 쌓는 이유: 비선형 임베딩.]].
` },
    ],
    problems: [
      { sec: '17.1', type: 'mc', lv: 1, q: R`가설 클래스 $\mathcal F$를 은닉 뉴런을 늘려 더 큰 클래스로 바꿀 때, **늘어날 수 없는** 것은?`,
        choices: [R`근사 오차 $\mathcal R(f_{\mathcal F})-\mathcal R(f^*)$`, R`일반화 오차 $\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})$`, R`최적화 오차 $\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)$`, R`경험적 위험 최소점의 모집단 위험 $\mathcal R(\hat f_n)$`], ans: 0,
        sol: R`큰 클래스는 원래 클래스를 포함하므로 그 안의 최선 $f_{\mathcal F}$의 위험은 같거나 작아집니다. 나머지는 자료와 알고리즘에 달려 있어 커질 수 있습니다. 특히 일반화 오차는 고를 함수가 많아질수록 커지기 쉽습니다.` },
      { sec: '17.1', type: 'num', lv: 1, q: R`$\mathcal R(f^*)=0.05$, $\mathcal R(f_{\mathcal F})=0.08$, $\mathcal R(\hat f_n)=0.12$, $\mathcal R(f_{\mathrm{alg}})=0.15$일 때 일반화 오차는?`, ans: '0.04', ansTex: R`0.04`,
        sol: R`$\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})=0.12-0.08=0.04$. 근사 오차 $0.03$, 최적화 오차 $0.03$과 더하면 전체 초과 위험 $0.10$입니다.` },
      { sec: '17.1', type: 'open', lv: 2, q: R`오차 분해의 세 항 가운데 근사 오차와 일반화 오차는 언제나 $0$ 이상이지만 최적화 오차 $\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)$은 음수일 수 있습니다. 이유를 각각 설명하세요.`,
        sol: R`$f^*$는 모든 함수 가운데 위험이 최소이므로 $\mathcal R(f_{\mathcal F})\ge\mathcal R(f^*)$, $f_{\mathcal F}$는 $\mathcal F$ 안에서 위험이 최소이고 $\hat f_n\in\mathcal F$이므로 $\mathcal R(\hat f_n)\ge\mathcal R(f_{\mathcal F})$입니다. 그러나 $\hat f_n$은 **경험적** 위험을 최소로 하는 함수일 뿐 모집단 위험 $\mathcal R$을 최소로 하지 않으므로, $\mathcal F$의 다른 원소 $f_{\mathrm{alg}}$가 $\mathcal R$이 더 작을 수 있습니다(예: 일찍 멈춘 SGD가 과적합을 덜 함).`,
        rubric: R`- 근사 오차가 음이 아닌 이유 — 1점
- 일반화 오차가 음이 아닌 이유($\hat f_n\in\mathcal F$) — 1점
- $\hat f_n$이 경험적 위험만 최소로 한다는 점 — 2점` },
      { sec: '17.2', type: 'mc', lv: 1, q: R`측도 $\mu$가 **반드시** 만족하는 것은?`,
        choices: [R`$\mu(A\cap B)=\mu(A)\mu(B)$`, R`$A,B$가 서로소이면 $\mu(A\cup B)=\mu(A)+\mu(B)$`, R`$\mu(A^c)=1-\mu(A)$`, R`모든 점 $x$에 대해 $\mu(\{x\})>0$`], ans: 1,
        sol: R`가산 가법성에서 $A_1=A$, $A_2=B$, 나머지를 $\varnothing$으로 두면 $\mu(\varnothing)=0$과 함께 유한 가법성이 나옵니다. 곱의 성질은 독립성, $1-\mu(A)$는 전체 크기가 1인 확률 측도에만 해당하고, 길이 측도는 한 점에서 $0$입니다.` },
      { sec: '17.2', type: 'num', lv: 2, q: R`$[0,1]$ 위의 부호 측도 $\mu=2\delta_0-\delta_{1/2}+3\lambda$ ($\lambda$는 길이)에 대해 $\int_0^1x\,d\mu(x)$는?`, ans: '1', ansTex: R`1`,
        sol: R`$2\cdot0-\frac12+3\int_0^1x\,dx=-\frac12+\frac32=1$.` },
      { sec: '17.2', type: 'mc', lv: 2, q: R`$[0,1]$ 위의 $\mu=\delta_{0.2}-\delta_{0.7}$에 대해 옳은 것은?`,
        choices: [R`$\mu([0,1])=0$이므로 $\mu=0$이다`, R`$\mu(\{0.2\})=1$이므로 $\mu\ne0$이다`, R`값이 음수가 되므로 부호 측도가 아니다`, R`모든 연속 함수 $f$에 대해 $\int f\,d\mu=0$이다`], ans: 1,
        sol: R`$\mu=0$은 모든 보렐 집합에서 $0$이어야 합니다. $\int f\,d\mu=f(0.2)-f(0.7)$은 $f(x)=x$에서 $-0.5\ne0$입니다.` },
      { sec: '17.2', type: 'open', lv: 2, q: R`$[0,1]$ 위의 부호 측도 $\mu=\delta_0-2\delta_{1/2}+\delta_1$에 대해 (1) $\mu([0,1])$, (2) $\int x\,d\mu$, (3) $\int x^2d\mu$를 구하고, $\mu\ne0$인데도 적분이 $0$인 함수가 많다는 점을 설명하세요.`,
        sol: R`(1) $1-2+1=0$. (2) $0-2\cdot\frac12+1=0$. (3) $0-2\cdot\frac14+1=\frac12$. 따라서 상수와 1차 함수는 모두 적분이 $0$이지만 $x^2$은 아닙니다. $\mu(\{1/2\})=-2\ne0$이므로 $\mu\ne0$입니다. 몇몇 함수와의 적분이 $0$인 것만으로는 측도가 $0$이라 할 수 없고, 측도를 $0$으로 확정하려면 충분히 많은 함수(예: 모든 연속 함수, 또는 판별 함수의 모든 뉴런)가 필요합니다.`,
        rubric: R`- 세 값의 계산 — 3점
- $\mu\ne0$의 근거 — 1점
- 함수 몇 개로는 측도가 정해지지 않는다는 설명 — 1점` },
      { sec: '17.3', type: 'num', lv: 1, q: R`$[0,1]$에서 $f(x)=x$, $g(x)=x^2$일 때 $\lVert f-g\rVert_\infty$는?`, ans: '1/4', ansTex: R`\tfrac14`,
        sol: R`$x-x^2$의 최댓값은 $x=\frac12$에서 $\frac14$입니다.` },
      { sec: '17.3', type: 'num', lv: 2, q: R`$[0,1]$에서 $g(x)=x^4$의 제곱적분 노름 $\lVert g\rVert_2=\big(\int_0^1g(x)^2dx\big)^{1/2}$은? (최대 노름은 $1$이다)`, ans: '1/3', ansTex: R`\tfrac13`,
        sol: R`$\int_0^1x^8dx=\frac19$이므로 $\lVert g\rVert_2=\frac13$. 일반적으로 $\lVert x^k\rVert_2=\frac1{\sqrt{2k+1}}\to0$이지만 $\lVert x^k\rVert_\infty=1$이라, 노름에 따라 가까움이 다릅니다.` },
      { sec: '17.3', type: 'mc', lv: 2, q: R`최대 노름을 준 $C([0,1])$에서 **조밀한** 부분집합은?`,
        choices: [R`다항식 전체`, R`$\{f:\ f(0)=0\}$`, R`상수 함수 전체`, R`$\{f:\ \lVert f\rVert_\infty\le1\}$`], ans: 0,
        sol: R`바이어슈트라스 정리. $f(0)=0$인 함수들은 $f\equiv1$에 $1$보다 가까이 갈 수 없고(점 $0$에서 차이가 $1$), 상수는 $f(x)=x$에 $\frac12$보다 가까이 못 가며, 노름이 1 이하인 함수는 $f\equiv3$에 $2$보다 가까이 못 갑니다.` },
      { sec: '17.3', type: 'open', lv: 2, proof: true, q: R`$K$가 컴팩트일 때 $\lVert f\rVert_\infty=\max_{x\in K}\lvert f(x)\rvert$가 $C(K)$의 노름임을 세 조건을 하나씩 확인해 보이세요.`,
        sol: R`최댓값은 연속 함수 $\lvert f\rvert$가 컴팩트 집합에서 가지므로 잘 정의되고 $0$ 이상입니다.
**(i)** $\lVert f\rVert_\infty=0\Rightarrow$ 모든 $x$에서 $\lvert f(x)\rvert\le0$, 곧 $f=0$. 역은 자명합니다.
**(ii)** $\lVert cf\rVert_\infty=\max_x\lvert c\rvert\lvert f(x)\rvert=\lvert c\rvert\max_x\lvert f(x)\rvert$.
**(iii)** 각 $x$에서 $\lvert f(x)+g(x)\rvert\le\lvert f(x)\rvert+\lvert g(x)\rvert\le\lVert f\rVert_\infty+\lVert g\rVert_\infty$. 우변이 $x$와 무관하므로 좌변의 최댓값을 취해도 성립합니다.`,
        rubric: R`- 최댓값의 존재(컴팩트성) — 1점
- 세 조건 각각 — 1점씩
- 삼각부등식에서 점마다 → 최댓값의 순서 — 1점` },
      { sec: '17.3', type: 'open', lv: 3, proof: true, q: R`노름 공간 $X$의 선형 부분공간 $U$의 닫힘 $\overline U$(=$U$의 수열의 극한 전체)도 선형 부분공간임을 보이고, “$U$가 조밀하다 $\iff\overline U=X$”를 설명하세요.`,
        sol: R`$f,g\in\overline U$이면 $u_k\to f$, $v_k\to g$인 $u_k,v_k\in U$가 있습니다. $au_k+bv_k\in U$이고
$$\lVert(au_k+bv_k)-(af+bg)\rVert\le\lvert a\rvert\lVert u_k-f\rVert+\lvert b\rvert\lVert v_k-g\rVert\to0$$
이므로 $af+bg\in\overline U$. $0\in U\subseteq\overline U$입니다.
조밀성의 정의 “모든 $f$와 $\varepsilon$에 대해 $\lVert f-g\rVert<\varepsilon$인 $g\in U$가 있다”에서 $\varepsilon=\frac1k$로 두면 $f$에 수렴하는 $U$의 수열을 얻으므로 $f\in\overline U$, 곧 $\overline U=X$. 거꾸로 $f\in\overline U$이면 수렴하는 수열의 뒷부분이 $\varepsilon$ 안에 들어오므로 조밀합니다.`,
        rubric: R`- 두 수열과 선형결합의 수렴(삼각부등식) — 3점
- 조밀 ⇒ 닫힘이 전체 — 1점
- 닫힘이 전체 ⇒ 조밀 — 1점` },
      { sec: '17.4', type: 'mc', lv: 1, q: R`이 단원의 정의에 따른 **시그모이드**는?`,
        choices: [R`$\tanh t$`, R`$\frac1{1+e^{-t}}$`, R`$\max(0,t)$`, R`$\sin t$`], ans: 1,
        sol: R`$t\to-\infty$에서 $0$, $t\to\infty$에서 $1$이어야 합니다. $\tanh$는 $-1$과 $1$, ReLU는 발산, $\sin$은 극한이 없습니다. 다만 $\tanh t=2s(2t)-1$이라 $\tanh$ 망도 같은 함수 모임을 만듭니다.` },
      { sec: '17.4', type: 'num', lv: 2, q: R`항등 활성화 $\sigma(t)=t$와 $[0,1]$ 위의 $\mu=\delta_0-2\delta_{1/2}+\delta_1$에 대해, $w=3$, $\theta=-1$일 때 $\int\sigma(wx+\theta)\,d\mu(x)$는?`, ans: '0', ansTex: R`0`,
        sol: R`$(-1)-2\big(\frac32-1\big)+(3-1)=-1-1+2=0$. 모든 $w,\theta$에서 $0$인데 $\mu\ne0$이므로 항등함수는 판별 함수가 아니고, 1차 함수의 합으로는 $x^2$을 근사할 수 없습니다.` },
      { sec: '17.4', type: 'open', lv: 2, q: R`로지스틱 함수 $s$와 $[0,1]$ 위의 $\mu=\delta_a-\delta_b$ ($a\ne b$)에 대해 $\int s(wx+\theta)\,d\mu\ne0$인 $w,\theta$가 있음을 보이세요. 이것이 판별성의 정의와 어떻게 맞물리는지 설명하세요.`,
        sol: R`$\int s(wx+\theta)\,d\mu=s(wa+\theta)-s(wb+\theta)$. $w=1$, $\theta=0$이면 $s(a)-s(b)$이고 $s'(t)=s(t)(1-s(t))>0$이라 $s$는 순증가하므로 $a\ne b$에서 $0$이 아닙니다. 판별성은 “모든 $w,\theta$에서 적분이 0이면 $\mu=0$”이고, 대우로 “$\mu\ne0$이면 적분이 0이 아닌 뉴런이 있다”입니다. 이 $\mu\ne0$에 대해 그런 뉴런을 실제로 찾은 것입니다.`,
        rubric: R`- 적분을 두 함숫값의 차로 계산 — 1점
- 순증가로 $0$이 아님을 보임 — 2점
- 판별성의 대우와 연결 — 1점` },
      { sec: '17.4', type: 'open', lv: 3, quiz: true, proof: true, q: R`$\sigma$가 연속 시그모이드일 때, $\lambda\to\infty$이면 $\sigma(\lambda t)$가 $t>0$에서 $1$, $t<0$에서 $0$, $t=0$에서 $\sigma(0)$으로 수렴함을 보이고, 이 수렴이 $t=0$ 근처에서 균등하지 않은 이유를 설명하세요. 이 극한이 판별성의 증명에서 하는 역할은?`,
        sol: R`$t>0$이면 $\lambda t\to\infty$이므로 $\sigma(\lambda t)\to1$, $t<0$이면 $\lambda t\to-\infty$이므로 $\to0$, $t=0$이면 $\sigma(0)$ 그대로입니다. 극한 함수가 $t=0$에서 불연속인데 각 $\sigma(\lambda\cdot)$는 연속이므로, 연속 함수의 균등 극한은 연속이라는 사실에 비추어 수렴이 균등할 수 없습니다(실제로 $t=\frac1\lambda$에서 $\sigma(1)$이 남음).
역할: $\sigma\big(\lambda(w^Tx+\theta)+\varphi\big)$의 적분이 모두 $0$이라는 가정에서, 유계 수렴 정리로 극한을 적분 안으로 넣어 반공간 $\{w^Tx+\theta>0\}$과 초평면의 측도에 관한 식 $\mu(H^+)+\sigma(\varphi)\mu(\Pi)=0$을 얻습니다. 이로부터 모든 반공간·초평면의 측도가 $0$임을 끌어냅니다.`,
        rubric: R`- 세 경우의 극한 — 2점
- 균등수렴이 아닌 이유 — 1점
- 반공간의 측도로 바꾸는 역할(유계 수렴) — 2점` },
      { sec: '17.5', type: 'mc', lv: 2, q: R`$C([0,1])$ 위의 **유계 선형 범함수**는?`,
        choices: [R`$f\mapsto f(0.3)$`, R`$f\mapsto f(0.3)^2$`, R`$f\mapsto\lVert f\rVert_\infty$`, R`$f\mapsto f'(0.3)$`], ans: 0,
        sol: R`$f(0.3)$은 선형이고 $\lvert f(0.3)\rvert\le\lVert f\rVert_\infty$로 유계이며, 리스 표현으로는 $\int f\,d\delta_{0.3}$입니다. 제곱과 노름은 선형이 아니고, 연속 함수가 미분가능하다는 보장이 없어 $f'(0.3)$은 $C([0,1])$ 전체에서 정의되지 않습니다.` },
      { sec: '17.5', type: 'num', lv: 2, q: R`$L(f)=f(0)-f(1)$을 리스 표현 $\int f\,d\mu$로 쓸 때 $\mu=\delta_0-\delta_1$이다. $f(x)=e^x$이면 $L(f)$는?`, ans: '1-e', ansTex: R`1-e`,
        sol: R`$e^0-e^1=1-e\approx-1.718$.` },
      { sec: '17.5', type: 'mc', lv: 2, q: R`다항식 전체 $P$는 $C([0,1])$의 진부분공간이다. 보조정리 3에 대해 옳은 것은?`,
        choices: [R`$P\ne C([0,1])$이므로 $P$에서 $0$이고 $L\ne0$인 유계 $L$이 있다`, R`$P$는 조밀하므로 $P$에서 $0$인 유계 선형 범함수는 $L=0$뿐이다`, R`$P$는 닫혀 있으므로 보조정리 3을 그대로 쓸 수 있다`, R`보조정리 3은 무한차원 공간에서는 성립하지 않는다`], ans: 1,
        sol: R`유계 $L$은 연속이라, 조밀한 $P$에서 $0$이면 극한을 취해 $\overline P=C([0,1])$ 전체에서 $0$입니다. 보조정리 3은 “진부분공간”이 아니라 “조밀하지 않음”을 가정해야 합니다.` },
      { sec: '17.5', type: 'open', lv: 3, quiz: true, proof: true, q: R`보조정리 3과 리스 표현 정리를 써서 보조정리 4 — $U$가 $C(I_n)$의 조밀하지 않은 선형 부분공간이면 $\int_{I_n}h\,d\mu=0$ ($\forall h\in U$)인 $\mu\ne0$, $\mu\in M(I_n)$가 있다 — 를 증명하세요.`,
        sol: R`**1단계.** $X=C(I_n)$ (최대 노름)에 보조정리 3을 쓰면 $L\ne0$, $L|_U=0$인 유계 선형 범함수 $L$이 있습니다.
**2단계.** $I_n$은 컴팩트이므로 리스 표현 정리에 의해 $L(f)=\int_{I_n}f\,d\mu$ ($\forall f\in C(I_n)$)인 유한 부호 측도 $\mu\in M(I_n)$가 있습니다.
**3단계.** $h\in U$이면 $\int h\,d\mu=L(h)=0$.
**4단계.** $L\ne0$이므로 $L(f_0)\ne0$인 $f_0$이 있고, $\int f_0\,d\mu=L(f_0)\ne0$이므로 $\mu\ne0$입니다($\mu=0$이면 모든 적분이 $0$).`,
        rubric: R`- 보조정리 3의 적용(노름 공간이 $C(I_n)$) — 1점
- 리스 표현 정리의 조건(컴팩트, 유계)과 결론 — 2점
- $U$에서 적분이 0 — 1점
- $\mu\ne0$의 근거 — 2점` },
      { sec: '17.5', type: 'open', lv: 2, q: R`$U=\{f\in C([0,1]):\ \int_0^1f(x)\,dx=0\}$이 조밀하지 않음을 보이고, 보조정리 4가 말하는 $\mu$를 하나 쓰세요.`,
        sol: R`$L(f)=\int_0^1f\,dx$는 $\lvert L(f)\rvert\le\lVert f\rVert_\infty$인 유계 선형 범함수이고 $U$에서 $0$입니다. $g\in U$이면 $1=\int_0^1(1-g)\,dx\le\lVert1-g\rVert_\infty$이므로 상수 $1$에 $1$보다 가까이 갈 수 없어 조밀하지 않습니다. $\mu=\lambda$(길이 측도)이면 $\int h\,d\lambda=0$ ($h\in U$)이고 $\lambda\ne0$입니다.`,
        rubric: R`- 유계 선형 범함수 $L$과 $L|_U=0$ — 1점
- 조밀하지 않음(거리의 하한) — 2점
- $\mu=\lambda$ — 1점` },
      { sec: '17.6', type: 'mc', lv: 1, q: R`보편 근사 정리(Cybenko)가 **보장하는** 것은?`,
        choices: [R`모든 $f\in C(I_n)$와 $\varepsilon>0$에 대해, 모든 $x\in I_n$에서 $\varepsilon$ 이내인 은닉층 하나짜리 망이 있다`, R`필요한 뉴런 수는 $N\le1/\varepsilon$이다`, R`경사하강법이 그 가중치를 찾는다`, R`$\mathbb R^n$ 전체에서 균등하게 근사된다`], ans: 0,
        sol: R`존재 정리입니다. 뉴런 수(18단원의 바론 정리가 일부 답함), 최적화, 정의역 전체로의 확장은 말하지 않습니다. $G$는 유계라 $\mathbb R$ 전체에서 $f(x)=x$를 균등 근사할 수 없습니다.` },
      { sec: '17.6', type: 'mc', lv: 2, q: R`보조정리 5의 증명에서 $\sigma$의 **연속성**이 쓰이는 곳은?`,
        choices: [R`$U$의 원소가 $C(I_n)$에 들어가 $U$가 $C(I_n)$의 부분공간이 되게 하는 곳`, R`보조정리 4로 측도를 얻는 곳`, R`$N=1$, $\alpha_1=1$로 두는 곳`, R`$\mu=0$에서 모순을 얻는 곳`], ans: 0,
        sol: R`보조정리 4는 $C(I_n)$의 부분공간에 대한 정리이므로 각 $G$가 연속이어야 합니다. 판별성은 별도의 가정입니다.` },
      { sec: '17.6', type: 'num', lv: 2, q: R`$[0,1]$에서 $f(x)=x$를 계단 함수 뉴런 $N$개의 계단 $G_N$으로 근사하면 최대 오차가 $\frac1{2N}$이다. 최대 오차를 $0.01$ 이하로 하는 가장 작은 $N$은?`, ans: '50', ansTex: R`50`,
        sol: R`$\frac1{2N}\le0.01\iff N\ge50$. 같은 격자를 $n$차원에 쓰면 $50^n$개가 필요해 차원이 커질수록 뉴런 수가 지수적으로 늘어납니다.` },
      { sec: '17.6', type: 'open', lv: 3, quiz: true, proof: true, q: R`보조정리 4와 판별성을 써서 보조정리 5 — $\sigma$가 연속 판별 함수이면 $\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)$들이 $C(I_n)$에서 조밀하다 — 를 귀류법으로 증명하세요. 무엇을 부정하는지 정확히 쓰세요.`,
        sol: R`**부분공간.** $U$를 그런 유한합 전체라 하면 합과 실수배에 닫혀 있고($N$을 늘려 이어 붙임), $\sigma$가 연속이므로 $U\subseteq C(I_n)$인 선형 부분공간입니다.
**가정(부정).** $U$가 조밀하지 않다, 곧 $\overline U\ne C(I_n)$. ($U\ne C(I_n)$이 아님에 주의.)
**보조정리 4.** $\mu\ne0$, $\mu\in M(I_n)$가 있어 $\int h\,d\mu=0$ ($\forall h\in U$).
**뉴런 하나.** $h(x)=\sigma(w^Tx+\theta)$ ($N=1$, $\alpha_1=1$)도 $U$에 있으므로 $\int\sigma(w^Tx+\theta)\,d\mu=0$ ($\forall w,\theta$).
**모순.** $\sigma$가 판별적이므로 $\mu=0$. $\mu\ne0$과 모순이므로 $U$는 조밀합니다.`,
        rubric: R`- $U$가 $C(I_n)$의 선형 부분공간(연속성 사용) — 2점
- 올바른 부정($\overline U\ne C(I_n)$) — 1점
- 보조정리 4로 $\mu\ne0$ — 1점
- 뉴런 하나로 줄이기 — 1점
- 판별성으로 모순 — 1점` },
      { sec: '17.6', type: 'open', lv: 2, quiz: true, q: R`보편 근사 정리가 있는데도 실제 신경망 학습이 실패할 수 있는 이유를 17.1절의 오차 분해를 써서 세 가지로 설명하세요.`,
        sol: R`(1) **근사**: 정리는 어떤 유한 $N$이 존재한다고만 말하므로, 실제로 쓴 $N$이 부족하면 근사 오차가 남습니다(필요한 $N$은 차원에 따라 매우 클 수 있음). (2) **일반화**: 충분히 큰 망이라도 유한한 자료로 고른 $\hat f_n$은 모집단에서 나쁠 수 있습니다(과적합). (3) **최적화**: 손실이 볼록하지 않아 SGD가 $\hat f_n$에 닿지 못하고 국소 최소·안장점에 머물 수 있습니다. 정리는 이 세 가지 중 첫째의 “가능성”만 보장합니다.`,
        rubric: R`- 근사: 존재만, $N$ 미지 — 1점
- 일반화 — 1점
- 최적화 — 1점` },
    ],
  });
})();
