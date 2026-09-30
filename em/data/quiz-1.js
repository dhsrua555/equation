/* 퀴즈풀이 — 공학수학2 Homework #1 (선형대수학, 푸리에 급수).
   문제는 과제지 원문을 옮겼고(3번은 교재 문제의 함수를 덧붙임), 핵심 포인트·풀이·자주 하는 실수는 새로 썼습니다.
   탭은 core/app.js의 viewQuiz가 그립니다. secs는 문제의 개념이 있는 절, 같은 유형의 연습문제는 quiz: 'hw1-pN'. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.quizzes = EM.quizzes || [];
(function () {
  const R = String.raw;
  EM.quizzes.push({
    id: 'hw1', mark: 'H', title: 'Homework #1', short: 'HW1',
    meta: '공학수학2 · 선형대수학, 푸리에 급수 · 다섯 문제',
    intro: R`
첫 과제는 **선형대수학(1–2번)**과 **푸리에 급수(3–5번)** 두 덩어리입니다. 강의 PPT의 결론 “푸리에 계수 = 삼각함수 직교기저에 대한 정사영의 좌표”(17단원 §3.2 ③)가 두 덩어리를 잇습니다.

:::tip 답안 작성의 공통 원칙
1. **확인·증명 문제는 정의의 조건을 번호대로** 쓴다. 내적이면 성질 1–4, 직교집합이면 “서로 다른 모든 쌍”의 내적.
2. **적분은 대칭부터.** $[-1,1]$, $[-\pi,\pi]$처럼 대칭인 구간에서는 기함수의 적분이 0이라는 것을 먼저 쓰고 지운다.
3. **직교기저인지 확인한 뒤** 계수 = 내적 ÷ 노름제곱.
4. **급수에 점을 대입할 때는** 그 점에서 급수가 무엇으로 수렴하는지(연속점이면 함숫값, 불연속점이면 좌우 평균) 근거를 한 줄 쓴다.
5. 마지막에 **검산**한다: 수치 대입, 특수한 경우, 차원 세기.
:::
`,
    problems: [
      { id: 'p1', label: '문제 1', title: '행렬의 대각합 내적', where: '선형대수학 · 내적', secs: ['ch17:3.1', 'ch17:3.1b', 'ch06:7.9b'],
        body: R`
:::def 문제
$M_{m,n}(\mathbb R)$에서 정의된 다음 함수가 내적이 됨을 확인하시오. (단, $\operatorname{tr}$은 대각합(trace)을 뜻함.)
$$\langle A,B\rangle:=\operatorname{tr}(AB^t)$$
:::

:::key 핵심 포인트
- 내적의 **네 성질**(17단원 §3.1 ①)을 하나씩: (1) 첫 자리의 덧셈 (2) 첫 자리의 상수배 (3) 대칭 ($\mathbb F=\mathbb R$이라 켤레가 필요 없음) (4) 양정.
- 계산의 열쇠는 **성분으로 풀어 쓰기**입니다. $AB^t$는 $m\times m$이고 $(AB^t)_{ii}=\sum_{j=1}^na_{ij}b_{ij}$이므로
$$\operatorname{tr}(AB^t)=\sum_{i=1}^m\sum_{j=1}^na_{ij}b_{ij}.$$
즉 행렬을 $mn$개의 성분을 늘어놓은 벡터로 보고 **점곱**한 것입니다.
- 성분 없이도 됩니다: 대각합의 선형성 $\operatorname{tr}(X+Y)=\operatorname{tr}X+\operatorname{tr}Y$, $\operatorname{tr}(cX)=c\operatorname{tr}X$와 $\operatorname{tr}(X^t)=\operatorname{tr}X$.
- 양정은 “$\ge0$”과 “$A\ne0$이면 $\gt0$” **두 부분**을 모두 써야 합니다.
:::

:::ex 풀이
대각합의 성질과 성분 공식 중 편한 쪽을 쓰면 됩니다. 양정은 성분으로 보이는 것이 가장 깔끔합니다.
---
$A=(a_{ij})$, $B=(b_{ij})$, $C\in M_{m,n}(\mathbb R)$, $c\in\mathbb R$이라 하자. $AB^t$는 $m\times m$ 행렬이고
$$(AB^t)_{ii}=\sum_{j=1}^na_{ij}(B^t)_{ji}=\sum_{j=1}^na_{ij}b_{ij}\quad\Longrightarrow\quad\langle A,B\rangle=\sum_{i=1}^m\sum_{j=1}^na_{ij}b_{ij}.$$

**(1) 첫 자리의 덧셈.** 행렬 곱의 분배법칙과 대각합의 선형성으로
$$\langle A+B,C\rangle=\operatorname{tr}\big((A+B)C^t\big)=\operatorname{tr}(AC^t+BC^t)=\operatorname{tr}(AC^t)+\operatorname{tr}(BC^t)=\langle A,C\rangle+\langle B,C\rangle.$$

**(2) 첫 자리의 상수배.** $\langle cA,B\rangle=\operatorname{tr}(cAB^t)=c\operatorname{tr}(AB^t)=c\langle A,B\rangle$.

**(3) 대칭성.** 정사각행렬 $X$에 대해 $\operatorname{tr}(X^t)=\operatorname{tr}X$ (대각성분이 같음)이고 $(AB^t)^t=BA^t$이므로
$$\langle B,A\rangle=\operatorname{tr}(BA^t)=\operatorname{tr}\big((AB^t)^t\big)=\operatorname{tr}(AB^t)=\langle A,B\rangle.$$
체가 $\mathbb R$이므로 $\overline{\langle A,B\rangle}=\langle A,B\rangle$, 즉 성질 3이 성립한다.

**(4) 양정.**
$$\langle A,A\rangle=\operatorname{tr}(AA^t)=\sum_{i=1}^m\sum_{j=1}^na_{ij}^2\ge0.$$
$A\ne0$이면 어떤 $a_{kl}\ne0$이 있어 $\langle A,A\rangle\ge a_{kl}^2\gt0$. $A=0$이면 $\langle A,A\rangle=0$.

(1)–(4)에 의해 $\langle A,B\rangle=\operatorname{tr}(AB^t)$는 $M_{m,n}(\mathbb R)$의 내적이다. $\blacksquare$

**검산 예.** $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$이면 $AB^t=\begin{pmatrix}2&1\\4&3\end{pmatrix}$, 대각합 $5$. 성분 공식으로도 $1\cdot0+2\cdot1+3\cdot1+4\cdot0=5$ ✓.
:::

:::warn 자주 하는 실수
- $\operatorname{tr}(AB^t)=\operatorname{tr}A\cdot\operatorname{tr}B$로 쓰는 것. 대각합은 곱에 대해 쪼개지지 **않습니다**. 게다가 $m\ne n$이면 $A$ 자체의 대각합이 정의되지 않습니다.
- (4)에서 $\operatorname{tr}(AA^t)\ge0$만 쓰고 “$A\ne0$이면 양수”를 빠뜨리는 것.
- 대칭성에서 $\operatorname{tr}(XY)=\operatorname{tr}(YX)$를 쓸 때 크기를 확인하지 않는 것. $\operatorname{tr}(BA^t)$와 $\operatorname{tr}(A^tB)$는 크기가 다른 행렬($m\times m$, $n\times n$)의 대각합이지만 값은 같습니다. 전치를 쓰는 위의 논법이 가장 안전합니다.
- 복소 행렬에 그대로 쓰는 것. 복소수이면 $\operatorname{tr}(AB^t)$는 양정이 깨지고, 켤레를 붙인 $\operatorname{tr}(A\overline{B}^t)$가 내적입니다.
:::

### 더 알아보기
이 내적이 주는 노름 $\|A\|=\sqrt{\sum a_{ij}^2}$를 **프로베니우스 노름**이라 합니다. 또 $M_{n,n}(\mathbb R)$에서 대칭행렬과 반대칭행렬은 이 내적으로 서로 직교합니다. $S^t=S$, $K^t=-K$이면 $\langle S,K\rangle=\operatorname{tr}(SK^t)=-\operatorname{tr}(SK)$이고, 동시에 대칭성으로 $\langle S,K\rangle=\langle K,S\rangle=\operatorname{tr}(KS^t)=\operatorname{tr}(KS)=\operatorname{tr}(SK)$이므로 $\langle S,K\rangle=0$입니다.
` },
      { id: 'p2', label: '문제 2', title: '르장드르 다항식, 정규직교기저, cos x의 최선 근사', where: '선형대수학 · 직교성과 근사', secs: ['ch17:3.1b', 'ch17:3.2', 'ch17:3.2b', 'ch04:5.2'],
        body: R`
:::def 문제
$[-1,1]$에서 정의된 연속함수 전체의 집합 $V$에 대하여, 내적을 다음과 같이 정의하였을 때 이어지는 물음에 답하시오.
$$\langle f,g\rangle:=\int_{-1}^1f(x)g(x)\,dx$$
(1) 다음 집합이 직교집합임을 보이시오.
$$S=\Big\{1,\ x,\ \frac12\big(3x^2-1\big)\Big\}$$
(2) 위 결과를 이용하여 $\mathcal P_2(\mathbb R)\le V$의 정규직교기저를 하나 찾으시오.
(3) $\cos x$에 가장 가까운 2차다항식을 구하시오.
:::

:::key 핵심 포인트
- (1) 직교집합 = **서로 다른 모든 쌍**의 내적이 0. 쌍은 3개입니다. 대칭 구간이므로 **기함수의 적분은 0**을 먼저 씁니다: $1\cdot x$와 $x\cdot\frac12(3x^2-1)$은 기함수입니다.
- (2) 두 단계: ① $S$가 $\mathcal P_2$의 **기저**임(직교집합이면 일차독립, 원소 3개 = $\dim\mathcal P_2$) ② 각 원소를 **노름으로 나누기**. 노름제곱은 $2,\ \frac23,\ \frac25$.
- (3) “가장 가까운” = 이 내적이 주는 거리 $\|\cos x-p\|=\big(\int_{-1}^1(\cos x-p)^2dx\big)^{1/2}$를 최소로 하는 $p\in\mathcal P_2$ = **최선 근사 정리**의 정사영(17단원 §3.2 ②). (2)의 정규직교기저로 $w=\sum\langle\cos x,e_i\rangle e_i$.
- 필요한 적분은 두 개: $\int_{-1}^1\cos x\,dx=2\sin1$, $\int_{-1}^1x^2\cos x\,dx=4\cos1-2\sin1$.
- 답은 **정확한 값**($\sin1$, $\cos1$로)으로 쓰고 소수 근삿값을 덧붙입니다: $w(x)\approx0.99656-0.46526x^2$.
:::

:::ex 풀이
(1)은 대칭, (2)는 “독립 + 개수 = 차원”, (3)은 정사영 공식입니다. 직접 써 본 뒤 펼치세요.
---
$P_2(x)=\frac12(3x^2-1)$로 줄여 씁니다.

**(1)** 세 쌍의 내적을 계산한다.
- $\langle1,x\rangle=\int_{-1}^1x\,dx=0$ (기함수).
- $\langle x,P_2\rangle=\frac12\int_{-1}^1(3x^3-x)\,dx=0$ (기함수).
- $\langle1,P_2\rangle=\frac12\int_{-1}^1(3x^2-1)\,dx=\frac12\big[x^3-x\big]_{-1}^1=\frac12(0-0)=0$.

서로 다른 모든 쌍이 직교하므로 $S$는 직교집합이다.

**(2)** $S$의 원소는 모두 영이 아니므로, 직교집합은 일차독립이라는 정리(17단원 §3.2 ①)에 의해 $S$는 일차독립이다. $S\subseteq\mathcal P_2(\mathbb R)$이고 $\dim\mathcal P_2(\mathbb R)=3=\lvert S\rvert$이므로 $S$는 $\mathcal P_2(\mathbb R)$의 (직교)기저이다. 노름을 구하면
$$\|1\|^2=\int_{-1}^11\,dx=2,\qquad\|x\|^2=\int_{-1}^1x^2dx=\frac23,\qquad\|P_2\|^2=\frac14\int_{-1}^1(9x^4-6x^2+1)\,dx=\frac14\Big(\frac{18}5-4+2\Big)=\frac25.$$
각 원소를 노름으로 나누면 정규직교기저
$$\beta=\{e_0,e_1,e_2\}=\Big\{\frac1{\sqrt2},\ \sqrt{\frac32}\,x,\ \sqrt{\frac52}\cdot\frac12(3x^2-1)\Big\}=\Big\{\frac{\sqrt2}2,\ \frac{\sqrt6}2x,\ \frac{\sqrt{10}}4(3x^2-1)\Big\}.$$

**(3)** $\mathcal P_2(\mathbb R)$는 $V$의 유한차원 부분공간이고 $\beta$가 정규직교기저이므로, 최선 근사 정리에 의해 $\cos x$에 가장 가까운 2차다항식은 정사영
$$w=\langle\cos x,e_0\rangle e_0+\langle\cos x,e_1\rangle e_1+\langle\cos x,e_2\rangle e_2$$
이고 유일하다. 직교기저로 쓰면 $w=\frac{\langle\cos x,1\rangle}{\|1\|^2}+\frac{\langle\cos x,x\rangle}{\|x\|^2}x+\frac{\langle\cos x,P_2\rangle}{\|P_2\|^2}P_2$와 같다.

필요한 적분:
- $\langle\cos x,1\rangle=\int_{-1}^1\cos x\,dx=2\sin1$.
- $\langle\cos x,x\rangle=0$ ($x\cos x$는 기함수).
- 부분적분 두 번으로 $\int x^2\cos x\,dx=x^2\sin x+2x\cos x-2\sin x$이므로 $\int_{-1}^1x^2\cos x\,dx=2(\sin1+2\cos1-2\sin1)=4\cos1-2\sin1$. 따라서
$$\langle\cos x,P_2\rangle=\frac12\Big(3(4\cos1-2\sin1)-2\sin1\Big)=6\cos1-4\sin1.$$

계수는 $\frac{2\sin1}2=\sin1$, $0$, $\frac{6\cos1-4\sin1}{2/5}=15\cos1-10\sin1$이므로
$$w(x)=\sin1+(15\cos1-10\sin1)\cdot\frac12(3x^2-1)=\Big(6\sin1-\frac{15}2\cos1\Big)+\Big(\frac{45}2\cos1-15\sin1\Big)x^2.$$
수치로는 $w(x)\approx0.99656-0.46526x^2$.

**검산.** (i) $\cos x$가 우함수라 $x$의 계수가 0인 것이 맞습니다. (ii) $\cos x-w$는 $1$과 직교해야 합니다: $\int_{-1}^1w\,dx=2\big(6\sin1-\frac{15}2\cos1\big)+\frac23\big(\frac{45}2\cos1-15\sin1\big)=2\sin1=\int_{-1}^1\cos x\,dx$ ✓. (iii) 테일러 다항식 $1-\frac{x^2}2$와 비슷하지만 같지 않습니다. 구간 전체의 제곱 오차는 $\int_{-1}^1(\cos x-w)^2dx\approx1.8\times10^{-5}$로, 테일러의 $\approx3.7\times10^{-4}$보다 약 20배 작습니다.
:::

:::fig f17cosfit
:::

:::warn 자주 하는 실수
- (1)에서 $\langle1,P_2\rangle$을 빠뜨리는 것. 기함수가 아니라서 **직접 적분**해야 하는 유일한 쌍입니다.
- (2)에서 “직교집합이다”만 쓰고 **기저**임(개수 = 차원, 또는 생성)을 보이지 않는 것. 문제는 $\mathcal P_2$의 기저를 요구합니다.
- (2)에서 $\|P_2\|^2$을 $\frac12\int(3x^2-1)^2dx$로 계산하는 것. 계수 $\frac12$도 제곱해서 $\frac14$입니다.
- (3)에서 정규화하지 않은 기저에 $\langle v,v_i\rangle v_i$를 쓰는 것, 또는 직교가 아닌 $\{1,x,x^2\}$에 계수 공식을 쓰는 것.
- (3)에서 테일러 다항식 $1-\frac{x^2}2$를 답으로 쓰는 것. “가장 가까운”은 이 **내적의 거리**로 잽니다.
:::
` },
      { id: 'p3', label: '문제 3', title: '푸리에 급수로 ζ(2) = π²/6 보이기', where: '푸리에 급수 · 반구간 전개', secs: ['ch10:11.1', 'ch10:11.2', 'ch10:11.4', 'ch17:3.2d'],
        body: R`
:::def 문제
다음 각 함수의 푸리에 급수를 구하고, 그 결과를 이용하여 다음 식이 성립함을 보이시오.
$$\zeta(2)=\sum_{n=1}^\infty\frac1{n^2}=\frac{\pi^2}6$$
(a) 교재 11장 2절, Example 6 — “삼각형” 함수 $f(x)=\frac{2k}Lx$ ($0\lt x\lt\frac L2$), $f(x)=\frac{2k}L(L-x)$ ($\frac L2\lt x\lt L$)의 반구간 전개
(b) 교재 11장 2절 연습문제 11번 — $f(x)=x^2$ ($-1\lt x\lt1$), 주기 $p=2$
:::

:::key 핵심 포인트
- 전략은 **푸리에 급수 → 수렴하는 점에 대입 → 급수 정리**. 대입할 점은 급수가 $\sum\frac1{n^2}$ 꼴(또는 홀수 항만)이 되는 곳입니다: (a) 사인 급수는 $x=\frac L2$, 코사인 급수는 $x=0$; (b)는 $x=1$.
- **대입의 근거**: 두 함수 모두 주기 확장이 **연속이고 구간별로 매끄러우므로** 급수가 모든 점에서 $f(x)$로 수렴합니다(교재 11.1의 수렴 정리). 불연속점이면 좌우 평균으로 수렴하므로 반드시 확인합니다.
- (a)는 홀수 항의 합 $\sum_{n\text{ 홀수}}\frac1{n^2}=\frac{\pi^2}8$을 줍니다. $\zeta(2)$로 가는 한 줄: 짝수 항은 $\sum\frac1{(2m)^2}=\frac14\zeta(2)$이므로 $\zeta(2)=\frac{\pi^2}8+\frac14\zeta(2)$.
- (b)는 $a_n=\frac{4(-1)^n}{n^2\pi^2}$이고, $x=1$에서 $\cos n\pi=(-1)^n$이 부호를 없애 바로 $\zeta(2)$가 나옵니다.
- 17단원의 관점: 푸리에 계수는 직교기저 $\{1,\cos\frac{n\pi x}L,\sin\frac{n\pi x}L\}$에 대한 좌표(내적 ÷ 노름제곱)이고, 파세발 항등식으로도 같은 결과를 얻습니다(§3.2 ④).
:::

:::ex 풀이
(a)는 교재 예제의 계산을 따라가 두 반구간 전개 중 하나에 대입하고, (b)는 우함수의 코사인 급수입니다.
---
**(a) 삼각형 함수.** $f$는 $0\lt x\lt L$에서 주어진 함수이므로 반구간 전개를 한다(주기 $2L$).

*코사인 급수(우함수 확장).* $a_0=\frac1L\int_0^Lf\,dx=\frac1L\cdot\frac{kL}2=\frac k2$ (삼각형의 넓이 $\frac{kL}2$).
$$a_n=\frac2L\Big[\int_0^{L/2}\frac{2k}Lx\cos\frac{n\pi x}Ldx+\int_{L/2}^L\frac{2k}L(L-x)\cos\frac{n\pi x}Ldx\Big]=\frac{4k}{n^2\pi^2}\Big(2\cos\frac{n\pi}2-\cos n\pi-1\Big).$$
괄호는 $n$이 홀수이면 $0$, $n=4,8,\dots$이면 $2-1-1=0$, $n=2,6,10,\dots$이면 $-2-1-1=-4$. 따라서
$$f(x)=\frac k2-\frac{16k}{\pi^2}\Big(\frac1{2^2}\cos\frac{2\pi x}L+\frac1{6^2}\cos\frac{6\pi x}L+\frac1{10^2}\cos\frac{10\pi x}L+\cdots\Big).$$

*사인 급수(기함수 확장).* 같은 방법으로 $b_n=\frac{8k}{n^2\pi^2}\sin\frac{n\pi}2$이므로
$$f(x)=\frac{8k}{\pi^2}\Big(\frac1{1^2}\sin\frac{\pi x}L-\frac1{3^2}\sin\frac{3\pi x}L+\frac1{5^2}\sin\frac{5\pi x}L-\cdots\Big).$$

*수렴.* 두 확장 모두 연속이고 구간별로 매끄러우므로 각 급수는 모든 $x$에서 (확장된) $f(x)$로 수렴한다.

*$\zeta(2)$.* 사인 급수에 $x=\frac L2$를 넣는다. $f(\frac L2)=k$이고, $n$이 홀수일 때 $\sin\frac{n\pi}2=(-1)^{(n-1)/2}$가 급수의 부호 $(-1)^{(n-1)/2}$와 곱해져 모든 항이 $+$가 된다:
$$k=\frac{8k}{\pi^2}\Big(1+\frac1{3^2}+\frac1{5^2}+\cdots\Big)\ \Longrightarrow\ \sum_{m=1}^\infty\frac1{(2m-1)^2}=\frac{\pi^2}8.$$
(코사인 급수에 $x=0$을 넣어도 $0=\frac k2-\frac{16k}{\pi^2}\cdot\frac14\sum_{m\text{ 홀수}}\frac1{m^2}$에서 같은 식이 나온다.)
$\zeta(2)$는 $p=2\gt1$인 $p$-급수라 수렴하고 항이 양수이므로 홀수 항과 짝수 항으로 나누어 더할 수 있다:
$$\zeta(2)=\sum_{n\text{ 홀수}}\frac1{n^2}+\sum_{m=1}^\infty\frac1{(2m)^2}=\frac{\pi^2}8+\frac14\zeta(2)\ \Longrightarrow\ \frac34\zeta(2)=\frac{\pi^2}8\ \Longrightarrow\ \zeta(2)=\frac{\pi^2}6.$$

**(b) $f(x)=x^2$, $-1\lt x\lt1$, $p=2$ ($L=1$).** $f$는 우함수이므로 $b_n=0$이고
$$a_0=\frac12\int_{-1}^1x^2dx=\frac13,\qquad a_n=\int_{-1}^1x^2\cos n\pi x\,dx=2\int_0^1x^2\cos n\pi x\,dx.$$
부분적분으로 $\int_0^1x\sin n\pi x\,dx=\Big[-\frac{x\cos n\pi x}{n\pi}\Big]_0^1+\frac1{n\pi}\int_0^1\cos n\pi x\,dx=-\frac{(-1)^n}{n\pi}$이고
$$\int_0^1x^2\cos n\pi x\,dx=\Big[\frac{x^2\sin n\pi x}{n\pi}\Big]_0^1-\frac2{n\pi}\int_0^1x\sin n\pi x\,dx=\frac{2(-1)^n}{n^2\pi^2}.$$
따라서 $a_n=\frac{4(-1)^n}{n^2\pi^2}$이고
$$x^2=\frac13+\frac4{\pi^2}\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos n\pi x\qquad(-1\le x\le1).$$

*수렴.* 주기 2로 확장한 함수는 $x=\pm1$에서도 연속($f(1^-)=f(-1^+)=1$)이고 구간별로 매끄러우므로 급수는 $[-1,1]$의 모든 점에서 $x^2$로 수렴한다.

*$\zeta(2)$.* $x=1$을 넣으면 $\cos n\pi=(-1)^n$이라 $(-1)^n(-1)^n=1$:
$$1=\frac13+\frac4{\pi^2}\sum_{n=1}^\infty\frac1{n^2}\ \Longrightarrow\ \zeta(2)=\frac{\pi^2}4\cdot\frac23=\frac{\pi^2}6.\qquad\blacksquare$$

**덤.** $x=0$을 넣으면 $0=\frac13+\frac4{\pi^2}\sum\frac{(-1)^n}{n^2}$에서 $1-\frac1{2^2}+\frac1{3^2}-\cdots=\frac{\pi^2}{12}$.
:::

:::fig f10ext
:::

:::warn 자주 하는 실수
- **대입하는 점에서의 수렴값을 확인하지 않는 것.** 예를 들어 $f(x)=x$ ($-\pi\lt x\lt\pi$)의 급수에 $x=\pi$를 넣으면 급수는 $\pi$가 아니라 좌우 평균 $0$으로 수렴합니다. (a), (b)는 확장이 연속이라 안전하다는 것을 **써야** 합니다.
- (a)에서 홀수 항의 합 $\frac{\pi^2}8$에서 멈추는 것. $\zeta(2)$까지 가는 짝수 항 처리($\frac14\zeta(2)$)가 문제의 요구입니다.
- (b)에서 $a_0$를 $\int_{-1}^1x^2dx=\frac23$으로 쓰는 것. 교재의 $a_0$는 **평균값** $\frac1{2L}\int_{-L}^Lf\,dx$입니다.
- 주기 $p=2L$에서 $\cos\frac{n\pi x}L$ 대신 $\cos nx$를 쓰는 것($L=1$이면 $\cos n\pi x$).
:::
` },
      { id: 'p4', label: '문제 4', title: '0 < x < π/2에서 1을 cos nx들로 나타내기', where: '푸리에 급수 · 확장의 선택', secs: ['ch10:11.2', 'ch17:3.2'],
        body: R`
:::def 문제
$0\lt x\lt\frac\pi2$에서 $1$을 $\cos nx$ ($n=1,2,3,\dots$)들의 합으로 나타내시오. 즉, 다음 식을 만족하는 계수 $a_n$을 구하시오.
$$1=\sum_{n=1}^\infty a_n\cos nx\qquad\Big(0\lt x\lt\frac\pi2\Big)$$
:::

:::key 핵심 포인트
- 걸림돌은 **상수항이 없다**는 것($n\ge1$)입니다. $(0,\frac\pi2)$에서만 1이면 되고 $(\frac\pi2,\pi)$에서는 **아무 함수나** 골라도 되므로, 그 자유를 **평균이 0**이 되도록 씁니다.
- 가장 자연스러운 선택: $g(x)=1$ ($0\lt x\lt\frac\pi2$), $g(x)=-1$ ($\frac\pi2\lt x\lt\pi$). 그러면 $a_0=\frac1\pi\int_0^\pi g\,dx=0$.
- 이 $g$를 $(-\pi,\pi)$로 **우함수 확장**(주기 $2\pi$)하면 사인 항이 없어지고 코사인 급수(반구간 전개)만 남습니다: $a_n=\frac2\pi\int_0^\pi g\cos nx\,dx$.
- 결과는 $a_n=\frac4{n\pi}\sin\frac{n\pi}2$: 짝수 $n$은 0, 홀수는 $\pm\frac4{n\pi}$가 번갈아 나옵니다.
- 수렴: 확장된 $g$는 $(0,\frac\pi2)$에서 연속이고 구간별로 매끄러우므로 그 구간의 모든 점에서 급수의 합이 $g(x)=1$입니다.
:::

:::ex 풀이
어떻게 확장하느냐가 문제의 전부입니다. 확장을 먼저 정하고 계수를 계산하세요.
---
**확장.** $(0,\pi)$에서
$$g(x)=\begin{cases}1&0\lt x\lt\frac\pi2\\-1&\frac\pi2\lt x\lt\pi\end{cases}$$
로 두고, $g$를 우함수로 확장해 주기 $2\pi$인 함수로 만든다. 우함수이므로 푸리에 급수는 코사인 급수이고
$$a_0=\frac1\pi\int_0^\pi g\,dx=\frac1\pi\Big(\frac\pi2-\frac\pi2\Big)=0.$$

**계수.** $n\ge1$에 대해
$$a_n=\frac2\pi\Big[\int_0^{\pi/2}\cos nx\,dx-\int_{\pi/2}^\pi\cos nx\,dx\Big]=\frac2\pi\Big[\frac{\sin\frac{n\pi}2}n-\Big(0-\frac{\sin\frac{n\pi}2}n\Big)\Big]=\frac4{n\pi}\sin\frac{n\pi}2.$$
즉 $a_{2m}=0$, $a_{2m-1}=\frac{4(-1)^{m+1}}{(2m-1)\pi}$이고
$$1=\frac4\pi\Big(\cos x-\frac13\cos3x+\frac15\cos5x-\frac17\cos7x+\cdots\Big)\qquad\Big(0\lt x\lt\frac\pi2\Big).$$

**수렴의 근거.** 확장된 $g$는 구간별로 매끄럽고, 불연속점은 $x=\pm\frac\pi2$ (주기 $2\pi$마다)뿐이다. 따라서 $0\lt x\lt\frac\pi2$의 모든 점에서 급수는 $g(x)=1$로 수렴한다. (불연속점 $x=\frac\pi2$에서는 좌우 평균 $0$으로 수렴하는데, 실제로 홀수 $n$에서 $\cos\frac{n\pi}2=0$이라 급수의 값이 0입니다 ✓.)

**검산.** 우함수 확장은 $x=0$에서도 연속이므로 급수에 $x=0$을 넣어도 1이어야 합니다: $\frac4\pi\big(1-\frac13+\frac15-\cdots\big)=\frac4\pi\cdot\frac\pi4=1$ (라이프니츠 급수) ✓.

**답이 하나뿐인가?** 아닙니다. $(\frac\pi2,\pi)$에서 $\int_{\pi/2}^\pi h\,dx=-\frac\pi2$인 함수 $h$라면 무엇이든 $a_0=0$이 되어 다른 계수열을 줍니다. 위의 선택($h=-1$)은 $g(\pi-x)=-g(x)$, 즉 $x=\frac\pi2$에 대해 **반대칭**이라 짝수 번째 계수가 모두 0이 되는 가장 간단한 답입니다. 답안에는 “이런 확장을 택했다”는 것을 밝히면 됩니다.
:::

:::warn 자주 하는 실수
- $(0,\frac\pi2)$만 보고 반주기 $\frac\pi2$로 반구간 전개하는 것. 그러면 $\cos2nx$ 급수와 **상수항 $a_0=1$**이 나와 문제의 조건(상수항 없이 $\cos nx$)에 맞지 않습니다.
- $(0,\pi)$ 전체에서 $g=1$로 확장하는 것. 그 코사인 급수는 상수 $1$ 하나뿐($a_0=1$, $a_n=0$)이라 $n\ge1$ 항만으로는 나타낼 수 없습니다.
- 사인 급수(기함수 확장)를 쓰는 것. 문제는 **코사인**들의 합을 요구합니다.
- $\sin\frac{n\pi}2$의 값을 $n$에 따라 정리하지 않고 두는 것. 짝수 항이 0이라는 것까지 밝히면 좋습니다.
:::
` },
      { id: 'p5', label: '문제 5', title: '주기적 외력을 받는 2계 ODE의 일반해', where: '푸리에 급수 · 강제진동', secs: ['ch10:11.3', 'ch02:2.7', 'ch17:2.2', 'ch17:2.5'],
        body: R`
:::def 문제
주기가 $2\pi$인 함수 $f(x)$의 푸리에 급수
$$f(x)=a_0+\sum_{n=1}^\infty\big(a_n\cos nx+b_n\sin nx\big)$$
에 대하여, 다음 상미분방정식의 일반해를 구하시오.
$$y''+3y'+2y=f(x)$$
:::

:::key 핵심 포인트
- **일반해 = 동차해 + 특수해** (선형성, 17단원 §2.2 예제 2). 동차해는 특성방정식 $\lambda^2+3\lambda+2=(\lambda+1)(\lambda+2)=0$에서 $c_1e^{-x}+c_2e^{-2x}$.
- 특수해는 **항마다** 구해 더합니다(중첩 원리). $\cos nx$, $\sin nx$는 $D^2$의 고유벡터라서 $L=D^2+3D+2$가 $\operatorname{span}\{\cos nx,\sin nx\}$를 자기 자신으로 보냅니다. 그래서 $y_n=A_n\cos nx+B_n\sin nx$를 넣으면 $2\times2$ 연립방정식 하나로 끝납니다.
- 분모 $(2-n^2)^2+9n^2=(n^2+1)(n^2+4)$는 **0이 되지 않습니다**(특성근이 순허수가 아님) → 공진이 없습니다.
- 상수항은 $2y=a_0$에서 $y=\frac{a_0}2$.
- 동차해는 $x\to\infty$에서 사라지므로, 푸리에 급수 부분이 주기 $2\pi$인 **정상상태 응답**입니다.
:::

:::ex 풀이
$n$번째 항 $a_n\cos nx+b_n\sin nx$에 대한 특수해를 먼저 구하고 모두 더합니다.
---
**동차해.** $y_h=c_1e^{-x}+c_2e^{-2x}$ ($c_1,c_2$는 임의의 상수).

**상수항.** 상수 $y=C$를 넣으면 $2C=a_0$이므로 $y_0=\frac{a_0}2$.

**$n$번째 항 ($n\ge1$).** $y_n=A_n\cos nx+B_n\sin nx$로 두면 $y_n'=-nA_n\sin nx+nB_n\cos nx$, $y_n''=-n^2y_n$이므로
$$y_n''+3y_n'+2y_n=\big[(2-n^2)A_n+3nB_n\big]\cos nx+\big[-3nA_n+(2-n^2)B_n\big]\sin nx.$$
이것이 $a_n\cos nx+b_n\sin nx$와 같으려면
$$\begin{cases}(2-n^2)A_n+3nB_n=a_n\\-3nA_n+(2-n^2)B_n=b_n\end{cases}$$
계수행렬식이 $D_n=(2-n^2)^2+9n^2=n^4+5n^2+4=(n^2+1)(n^2+4)\gt0$이므로 크래머 공식으로
$$A_n=\frac{(2-n^2)a_n-3nb_n}{(n^2+1)(n^2+4)},\qquad B_n=\frac{3na_n+(2-n^2)b_n}{(n^2+1)(n^2+4)}.$$

**일반해.** 중첩 원리로
$$y=c_1e^{-x}+c_2e^{-2x}+\frac{a_0}2+\sum_{n=1}^\infty\frac{\big[(2-n^2)a_n-3nb_n\big]\cos nx+\big[3na_n+(2-n^2)b_n\big]\sin nx}{(n^2+1)(n^2+4)}.$$

**검산 ($f=\cos x$).** $a_1=1$이고 나머지가 0이면 $A_1=\frac1{2\cdot5}=\frac1{10}$, $B_1=\frac3{10}$. $y_p=\frac1{10}\cos x+\frac3{10}\sin x$는 $y_p''=-y_p$이므로 $y_p''+3y_p'+2y_p=y_p+3y_p'=\big(\frac1{10}+\frac9{10}\big)\cos x+\big(\frac3{10}-\frac3{10}\big)\sin x=\cos x$ ✓.

**복소 지수로 보는 방법.** $p(\lambda)=\lambda^2+3\lambda+2$이면 $L[e^{inx}]=p(in)e^{inx}$이므로 $e^{inx}$ 항의 응답은 $\frac{e^{inx}}{p(in)}$이고, $p(in)=(2-n^2)+3in$, $\lvert p(in)\rvert^2=(n^2+1)(n^2+4)$. 위의 $A_n,B_n$은 이것의 실수부·허수부를 정리한 것입니다.

**급수의 수렴에 대하여.** $\lvert A_n\rvert,\lvert B_n\rvert\le\frac{C(\lvert a_n\rvert+\lvert b_n\rvert)}{n^2}$ 꼴이므로 특수해의 급수는 $f$의 급수보다 훨씬 빨리 수렴합니다. $f$의 주기 확장이 연속이고 구간별로 매끄러우면 $\sum(\lvert a_n\rvert+\lvert b_n\rvert)\lt\infty$라서 $y_p$, $y_p'$, $y_p''$의 급수가 모두 고르게 수렴하고, 항별로 미분해 대입한 것이 정당화됩니다.
:::

:::warn 자주 하는 실수
- 동차해를 빠뜨리고 특수해만 쓰는 것. “일반해”는 $c_1e^{-x}+c_2e^{-2x}$를 포함해야 합니다.
- 상수항을 $a_0$로 두는 것. $L[C]=2C$이므로 $\frac{a_0}2$입니다.
- $y_n$을 $A_n\cos nx$만으로 두는 것. $3y'$ 때문에 코사인과 사인이 섞이므로 두 항이 모두 필요합니다.
- 분모가 0이 될 수 있는지(공진) 확인하지 않는 것. 이 방정식은 감쇠($3y'$)가 있어 공진이 없지만, $y''+n_0^2y=f$처럼 감쇠가 없으면 $n=n_0$ 항에서 분모가 0이 되어 다른 꼴의 해가 필요합니다[[ch10:11.3|강제진동에서 공진하는 고조파.]].
:::
` },
    ],
  });
})();
