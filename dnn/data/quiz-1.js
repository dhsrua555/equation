/* 퀴즈풀이 — Problem Set 1 (M1407.0012, 홍영준 교수, Due Date: N/A 연습용).
   문제는 원문을 우리말로 옮겼고, 풀이·핵심 포인트·자주 하는 실수는 새로 썼습니다. 탭은 core/app.js의 viewQuiz가 그립니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.quizzes = EM.quizzes || [];
(function () {
  const R = String.raw;
  EM.quizzes.push({
    id: 'ps1', mark: 'Q', title: 'Problem Set 1', short: 'PS1',
    meta: 'M1407.0012 · 홍영준 교수 · Due Date N/A (연습용) · 시험이 이 유형으로 나옵니다',
    intro: R`
네 문제 모두 **증명·유도형**입니다. 계산 결과보다 **각 단계의 근거**가 점수를 가릅니다. 답안을 쓸 때 공통으로 지킬 것:

:::tip 답안 작성의 공통 원칙
1. **정의부터 쓴다.** 문제의 기호($D_{JS}$, $m$, 사후분포, 라그랑지안, $g(x)=\min_yf$)를 식으로 먼저 적으면 반은 끝납니다.
2. **쓰는 정리의 이름과 조건을 밝힌다.** “KL의 비음성(깁스 부등식, 등호 $\iff$ 두 분포가 같음)”, “$\log$는 증가함수”, “상보성 조건”처럼.
3. **동치(⇔)는 두 방향을 따로** 보인다.
4. **부등식을 옮길 때 무엇에 대해 최대·최소를 취하는지** 한 줄씩 적는다.
5. **마지막에 검산**한다: 원문제 값 = 쌍대 값, 극한($\tau^2\to\infty$이면 MLE)처럼 알려진 경우와 맞는지.
:::
`,
    problems: [
      { id: 'p1', label: '문제 1', title: '젠센-섀넌 발산의 세 성질', where: '정보이론', secs: ['ch03:3.3', 'ch03:3.6'],
        body: R`
:::def 문제
같은 확률공간 위의 두 확률분포 $p$, $q$에 대해 젠센-섀넌(JS) 발산을
$$D_{JS}(p\Vert q)=\frac12D_{KL}(p\Vert m)+\frac12D_{KL}(q\Vert m),\qquad m=\frac12(p+q)$$
로 정의한다. 다음을 증명하시오.
(i) 비음성: $D_{JS}(p\Vert q)\ge0$.
(ii) 구별 불가능한 것의 동일성: $D_{JS}(p\Vert q)=0\iff p=q$.
(iii) 대칭성: $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$.
:::

:::key 핵심 포인트
- 세 성질 모두 **KL 발산의 성질 하나**(깁스 부등식)로 풀립니다: $D_{KL}(a\Vert b)\ge0$, 등호 $\iff a=b$. 이 정리와 **등호 조건**을 정확히 쓸 수 있어야 합니다.
- **$m$이 확률분포이고 KL이 유한함**을 먼저 확인합니다. $p(x)\gt0$이면 $m(x)\ge\frac12p(x)\gt0$이라 $D_{KL}(p\Vert m)$의 분모가 0이 되지 않습니다. (반면 $D_{KL}(p\Vert q)$는 무한대일 수 있습니다.)
- (ii)의 ($\Rightarrow$)는 “**음이 아닌** 두 수의 합이 0이면 **각각** 0”이 핵심 한 줄입니다.
- (iii)은 $m=\frac12(p+q)$가 $p$와 $q$에 대해 **대칭**이라는 것만 보이면 됩니다.
- 덤: $0\le D_{JS}\le\log2$, 그리고 $D_{JS}=H(m)-\frac{H(p)+H(q)}2$.
:::

:::ex 풀이
깁스 부등식을 먼저 증명해 두면 나머지는 몇 줄입니다. 직접 써 본 뒤 펼치세요.
---
**준비 1: $m$은 확률분포.** $m(x)=\frac12\{p(x)+q(x)\}\ge0$이고 $\sum_xm(x)=\frac12(1+1)=1$ (연속이면 적분).

**준비 2: KL이 유한.** $p(x)\gt0$인 $x$에서 $m(x)\ge\frac12p(x)\gt0$이므로 $\frac{p(x)}{m(x)}\le2$, 따라서 $D_{KL}(p\Vert m)=\sum_{p(x)\gt0}p(x)\log\frac{p(x)}{m(x)}\le\log2\lt\infty$. $q$도 같습니다.

**준비 3: 깁스 부등식.** 두 분포 $a,b$ ($a(x)\gt0\Rightarrow b(x)\gt0$)에 대해 $\log t\le t-1$ (등호 $\iff t=1$)을 $t=\frac{b(x)}{a(x)}$에 쓰면
$$-D_{KL}(a\Vert b)=\sum_{a(x)\gt0}a(x)\log\frac{b(x)}{a(x)}\le\sum_{a(x)\gt0}a(x)\Big(\frac{b(x)}{a(x)}-1\Big)=\sum_{a(x)\gt0}b(x)-1\le0.$$
등호는 $a(x)\gt0$인 모든 $x$에서 $b(x)=a(x)$이고 $\sum_{a\gt0}b=1$일 때, 즉 $a=b$일 때뿐입니다.

**(i)** 준비 3에서 $D_{KL}(p\Vert m)\ge0$, $D_{KL}(q\Vert m)\ge0$이므로
$$D_{JS}(p\Vert q)=\tfrac12D_{KL}(p\Vert m)+\tfrac12D_{KL}(q\Vert m)\ge0.$$

**(ii)** ($\Leftarrow$) $p=q$이면 $m=\frac12(p+p)=p=q$이므로 $D_{KL}(p\Vert m)=D_{KL}(p\Vert p)=0$, $D_{KL}(q\Vert m)=0$, 따라서 $D_{JS}=0$.
($\Rightarrow$) $D_{JS}=0$이라 하자. 두 항 $\frac12D_{KL}(p\Vert m)$, $\frac12D_{KL}(q\Vert m)$은 (i)에서 음이 아니고 합이 0이므로 **둘 다 0**. 깁스 부등식의 등호 조건에서 $p=m$이고 $q=m$. 그러므로 $p=q$.

**(iii)** $m=\frac12(p+q)=\frac12(q+p)$는 $p,q$의 순서와 무관합니다. 따라서
$$D_{JS}(q\Vert p)=\tfrac12D_{KL}(q\Vert m)+\tfrac12D_{KL}(p\Vert m)=D_{JS}(p\Vert q).\qquad\blacksquare$$

**검산 예.** $p=(\frac12,\frac12)$, $q=(\frac14,\frac34)$이면 $m=(\frac38,\frac58)$, $D_{JS}\approx0.0338$ (자연로그) — 0과 $\log2\approx0.693$ 사이. 받침이 겹치지 않는 $p=(1,0)$, $q=(0,1)$이면 $D_{JS}=\log2$(최댓값)인데 $D_{KL}(p\Vert q)=\infty$입니다.
:::

:::warn 자주 하는 실수
- $D_{JS}$를 $\frac12\{D_{KL}(p\Vert q)+D_{KL}(q\Vert p)\}$(제프리스 발산)로 착각하는 것. JS는 **평균 분포 $m$에 대한** KL입니다.
- (ii)에서 한 방향만 쓰는 것, 또는 “KL이 0이면 같다”를 **근거 없이** 쓰는 것(등호 조건을 인용해야 함).
- 연속 분포에서는 “$p=q$”가 “거의 모든 곳에서 같다”라는 뜻임을 빼먹는 것(한 문장 덧붙이면 충분).
:::
` },
      { id: 'p2', label: '문제 2', title: '가우시안 평균의 MAP: 릿지, 수축, 편향-분산', where: '확률과 베이즈 추론', secs: ['ch02:2.4', 'ch02:2.6', 'ch02:2.8', 'ch04:4.3'],
        body: R`
:::def 문제
$X_1,\dots,X_n$이 독립이고 $X_i\sim\N(\theta,1)$ ($i=1,\dots,n$)이다. 분산 1은 알고 $\theta$는 모른다. 사전분포는 $\theta\sim\N(0,\tau^2)$, $\tau^2\gt0$. 아래의 기댓값은 $\theta$가 주어졌을 때 $(X_1,\dots,X_n)$의 표본분포에 대해 취한다.

**1.** $\theta$의 MAP 추정량을 유도하고, 릿지 문제
$$\hat\theta_{\text{MAP}}=\argmin_\theta\sum_{i=1}^n(X_i-\theta)^2+\lambda\theta^2,\qquad\lambda=\frac1{\tau^2}$$
의 해와 같음을 보이시오.

**2.** 표본평균 $\bar X=\frac1n\sum_{i=1}^nX_i$로 $\hat\theta_{\text{MAP}}=a\bar X$로 나타내고, 수축 계수 $a$를 $n$과 $\tau^2$의 함수로 구하시오.

**3.** 임의의 추정량 $\hat\theta$에 대해 $\E(\hat\theta-\theta)^2=\big(\E[\hat\theta]-\theta\big)^2+\Var(\hat\theta)$를 증명하시오. 이를 $\hat\theta=\hat\theta_{\text{MAP}}$에 적용해 편향, 분산, MSE를 구하시오. (힌트: $\hat\theta-\theta=\hat\theta-\E[\hat\theta]+\E[\hat\theta]-\theta$로 쓰고 제곱을 전개.)
:::

:::key 핵심 포인트
- **MAP = 사후분포의 최대점 = “음의 로그가능도 + 음의 로그사전분포”의 최소점.** 증거 $p(X)$와 정규화 상수는 $\theta$와 무관해서 버립니다. $\log$가 증가함수라 argmax가 보존된다는 근거를 적습니다.
- **사후분포 식은 세 단계로 세웁니다:** 베이즈 정리로 $p(\theta\mid X)\propto p(X\mid\theta)\,p(\theta)$ → 독립이라 $p(X\mid\theta)=\prod_ip(X_i\mid\theta)$ → 정규밀도 공식에 $(\mu,\sigma^2)=(\theta,1)$, 사전분포는 $(0,\tau^2)$를 넣기.
- 가우시안 가능도 → 제곱오차, 가우시안 사전분포 → $L_2$ 벌점. 음의 로그 사후분포 $\frac12\sum(X_i-\theta)^2+\frac1{2\tau^2}\theta^2$에 **2를 곱해도** 최소점은 같으므로, 곱하면 문제의 릿지 꼴($\lambda=1/\tau^2$)이 됩니다.
- 최소점은 도함수 = 0, 그리고 **2계 도함수 $2(n+\lambda)\gt0$로 최소임을 확인**합니다.
- 수축 계수 $a=\frac{n\tau^2}{n\tau^2+1}\in(0,1)$: 사전분포의 평균 0 쪽으로 당깁니다. 극한 확인: $\tau^2\to\infty$(정보 없는 사전분포) 또는 $n\to\infty$이면 $a\to1$(MLE $\bar X$), $\tau^2\to0$이면 $\hat\theta\to0$.
- 분해의 핵심은 **교차항이 0**인 이유: $\E[\hat\theta]-\theta$는 **상수**라 밖으로 빠지고, $\E[\hat\theta-\E\hat\theta]=0$.
- 기댓값은 $\theta$를 **고정**하고 $X$에 대해 취합니다(베이지안 기댓값이 아님). $\E\bar X=\theta$, $\Var\bar X=\frac1n$, $\Var(a\bar X)=a^2\Var\bar X$.
:::

:::ex 풀이
세 부분이 이어집니다. 1의 결과가 2의 입력, 2의 결과가 3의 입력입니다.
---
**1. MAP 유도.** 베이즈 정리로 $p(\theta\mid X)\propto p(X\mid\theta)\,p(\theta)$. 독립성으로 가능도는 곱이므로
$$p(\theta\mid X)\propto\prod_{i=1}^n\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\cdot\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}.$$

:::note 이 식은 어디서 나왔나: 세 조각을 차례로 끼우기
이 한 줄에는 세 가지 사실이 들어 있습니다. ①과 ②는 02단원에서 증명한 것이고, ③은 공식에 값을 넣는 계산입니다.

**① 베이즈 정리 → 비례식(∝).** 모수가 연속일 때의 베이즈 정리는
$$p(\theta\mid X)=\frac{p(X\mid\theta)\,p(\theta)}{p(X)},\qquad p(X)=\int p(X\mid\theta)\,p(\theta)\,d\theta.$$
분모 $p(X)$는 $\theta$를 적분해서 없앤 값이라 **$\theta$가 바뀌어도 변하지 않는 양수**입니다. 모든 $\theta$에서 같은 수로 나누면 어느 $\theta$에서 가장 큰지는 그대로이므로, 분모를 떼고 “비례한다(∝)”로 씁니다. 자세히: [[ch02:2.5|연속 모수의 베이즈 정리]] (이산판은 [[ch02:2.2|베이즈 정리]])

**② 독립 → 곱.** 여기서 $X$는 자료 전체 $(X_1,\dots,X_n)$이므로 $p(X\mid\theta)$는 결합밀도 $p(X_1,\dots,X_n\mid\theta)$입니다. $\theta$가 주어지면 $X_i$들이 서로 독립이므로 결합밀도가 하나씩의 밀도의 곱으로 갈라집니다:
$$p(X_1,\dots,X_n\mid\theta)=p(X_1\mid\theta)\,p(X_2\mid\theta)\cdots p(X_n\mid\theta)=\prod_{i=1}^np(X_i\mid\theta).$$
사건 두 개에서 독립의 정의 $P(E\cap F)=P(E)P(F)$를 $n$개로 늘린 것입니다. 자세히: [[ch02:2.4|i.i.d. 자료의 가능도는 곱]]

**③ 정규분포 밀도에 값 넣기.** $\N(\mu,\sigma^2)$의 밀도는
$$f(x)=\frac1{\sqrt{2\pi\sigma^2}}\,e^{-(x-\mu)^2/(2\sigma^2)}$$
입니다(자세히: [[ch02:2.3|분포 표의 정규분포]]). 문제의 두 분포는 이 공식의 $x,\mu,\sigma^2$ 자리에 다른 것을 넣은 것뿐입니다.

| | 분포 | $x$ 자리 | $\mu$ 자리 | $\sigma^2$ 자리 | 넣은 결과 |
|---|---|---|---|---|---|
| 가능도 한 개 | $X_i\mid\theta\sim\N(\theta,1)$ | $X_i$ | $\theta$ | $1$ | $\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}$ |
| 사전분포 | $\theta\sim\N(0,\tau^2)$ | $\theta$ | $0$ | $\tau^2$ | $\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}$ |

첫 줄은 $\sigma^2=1$이라 $\sqrt{2\pi\cdot1}=\sqrt{2\pi}$, 지수의 분모는 $2\cdot1=2$가 됩니다. 둘째 줄은 $\mu=0$이라 $(\theta-0)^2=\theta^2$입니다. 사전분포에서는 **$\theta$가 변수 $x$의 자리**에 들어간다는 점이 헷갈리기 쉬운 곳입니다.

**합치기.** ②의 곱에 ③의 첫 줄을 $n$번, ①의 $p(\theta)$에 ③의 둘째 줄을 넣으면 위의 식이 됩니다.

**다음 줄(로그)로 가는 법.** 로그의 두 규칙 $\log(ab)=\log a+\log b$ (곱 → 합)와 $\log e^{u}=u$를 한 인수씩 쓰면
$$\log\Big(\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\Big)=-\frac12\log(2\pi)-\frac{(X_i-\theta)^2}2,$$
$$\log\Big(\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}\Big)=-\frac12\log(2\pi\tau^2)-\frac{\theta^2}{2\tau^2}.$$
$n$개를 더한 뒤 $\theta$가 없는 항 $-\frac n2\log(2\pi)$, $-\frac12\log(2\pi\tau^2)$, 그리고 ①에서 뗀 $-\log p(X)$를 모두 상수 $C$로 모으면 아래 식입니다. $\sigma^2$를 남겨 둔 채 같은 계산을 한 것이 [[ch02:2.4|가우시안 MLE의 로그가능도]]입니다.
:::

로그를 취하면($\theta$와 무관한 항은 상수 $C$로 모음)
$$\log p(\theta\mid X)=-\frac12\sum_{i=1}^n(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C.$$
$\log$는 증가함수이므로 $\hat\theta_{\text{MAP}}=\argmax_\theta p(\theta\mid X)=\argmax_\theta\log p(\theta\mid X)$. 양의 상수 $2$를 곱하고 부호를 바꾸면
$$\hat\theta_{\text{MAP}}=\argmin_\theta\Big[\sum_{i=1}^n(X_i-\theta)^2+\frac1{\tau^2}\theta^2\Big],$$
즉 $\lambda=1/\tau^2$인 릿지 문제입니다.

**2. 수축 계수.** $g(\theta)=\sum_i(X_i-\theta)^2+\lambda\theta^2$라 하면
$$g'(\theta)=-2\sum_iX_i+2n\theta+2\lambda\theta=0\ \Rightarrow\ \hat\theta=\frac{\sum_iX_i}{n+\lambda}=\frac{n}{n+\lambda}\bar X$$
$$g''(\theta)=2(n+\lambda)\gt0.$$
$g$가 강볼록이라 이 정류점이 유일한 최소점입니다. $\lambda=1/\tau^2$를 넣으면
$$a=\frac n{n+1/\tau^2}=\frac{n\tau^2}{n\tau^2+1}.$$

**3. 편향-분산 분해.** $\mu=\E[\hat\theta]$ (상수)라 하면
$$\E(\hat\theta-\theta)^2=\E\big[(\hat\theta-\mu)+(\mu-\theta)\big]^2=\E(\hat\theta-\mu)^2+2(\mu-\theta)\,\E[\hat\theta-\mu]+(\mu-\theta)^2.$$
$\E[\hat\theta-\mu]=\mu-\mu=0$이므로 가운데 항이 사라져 $\E(\hat\theta-\theta)^2=\Var(\hat\theta)+(\E[\hat\theta]-\theta)^2$. $\blacksquare$

**MAP에 적용.** $\E\bar X=\theta$, $\Var\bar X=\frac1n$ (독립이고 분산 1)이므로
$$\text{편향}=\E[a\bar X]-\theta=(a-1)\theta=-\frac{\theta}{n\tau^2+1},\qquad \text{분산}=a^2\cdot\frac1n=\frac{n\tau^4}{(n\tau^2+1)^2},$$
$$\text{MSE}=\frac{\theta^2}{(n\tau^2+1)^2}+\frac{n\tau^4}{(n\tau^2+1)^2}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}.$$

**해석과 검산.** MLE $\bar X$의 MSE는 $\frac1n$ (편향 0). MAP이 더 나을 필요충분조건은 $\theta^2\lt2\tau^2+\frac1n$: 참값이 사전분포가 믿는 0 근처일 때 편향을 조금 감수하고 분산을 크게 줄입니다. 예: $n=4$, $\tau^2=\frac12$이면 $a=\frac23$; $\bar X=1.2$이면 $\hat\theta_{\text{MAP}}=0.8$; 참값 $\theta=1$이면 MSE $=\frac29\approx0.222\lt\frac14$.
:::

:::warn 자주 하는 실수
- $\log p(\theta\mid X)$에서 정규화 상수·증거를 버릴 때 **왜 버려도 되는지**(θ와 무관) 안 쓰는 것.
- $\lambda$를 $\frac1{2\tau^2}$로 쓰는 것: 목적함수의 앞 계수(½을 붙였는지)에 따라 달라집니다. 문제의 릿지 꼴은 $\sum(X_i-\theta)^2+\lambda\theta^2$이라 $\lambda=\frac1{\tau^2}$.
- $\Var(a\bar X)=a\Var\bar X$로 계산하는 것($a^2$이 맞음).
- 교차항이 0인 이유를 “기댓값이 0이라서”로만 쓰고, **$\E[\hat\theta]-\theta$가 상수**라는 점을 빼먹는 것.
- 기댓값을 $\theta$에 대해서도 취하는 것. 여기서는 $\theta$가 고정된 참값입니다.
:::
` },
      { id: 'p3', label: '문제 3', title: '두 점 하드 마진 SVM의 쌍대 문제', where: '서포트 벡터 머신', secs: ['ch07:7.3', 'ch07:7.4', 'ch07:7.5', 'ch07:7.6'],
        body: R`
:::def 문제
2차원 자료 $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$.

**1.** 원문제
$$\min_{w,b}\ \frac12\lVert w\rVert^2\qquad\text{s.t. }y_i(w^Tx_i+b)\ge1,\ i=1,2$$
의 라그랑지안을 승수 $\alpha_1,\alpha_2\ge0$으로 쓰고, $w$, $b$에 대해 최소화해 $\alpha_1,\alpha_2$에 대한 쌍대 문제를 유도하시오. 최적 승수를 구하시오.

**2.** 최적 승수로 최적 $w$와 $b$를 복원하시오.

**3.** 분리 초평면 $w^Tx+b=0$을 쓰고 마진을 구하시오.
:::

:::key 핵심 포인트
- **라그랑지안의 부호:** 제약을 $1-y_i(w^Tx_i+b)\le0$ 꼴로 바꾼 뒤 $\alpha_i\ge0$을 곱해 **더합니다**:
$L(w,b,\alpha)=\frac12\lVert w\rVert^2+\sum_i\alpha_i\{1-y_i(w^Tx_i+b)\}$.
- **정류 조건 두 개**를 외워 둡니다: $\nabla_wL=0\Rightarrow w=\sum_i\alpha_iy_ix_i$, $\partial L/\partial b=0\Rightarrow\sum_i\alpha_iy_i=0$. 두 번째는 쌍대 문제의 **등식 제약**이 됩니다.
- 쌍대 함수의 일반형: $g(\alpha)=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$. 여기서 $x_1=0$이라 $x_2^Tx_2=8$ 항 하나만 남습니다.
- **$b$는 $\alpha_i\gt0$인 점(서포트 벡터)에서** $y_i(w^Tx_i+b)=1$로 구합니다(상보성 조건).
- **마진** $=\frac1{\lVert w\rVert}$ (초평면에서 가장 가까운 점까지의 거리). 두 마진 경계 사이의 폭은 $\frac2{\lVert w\rVert}$ — 어느 쪽을 묻는지 확인하고 둘 다 적어 두면 안전합니다.
- **검산 두 가지:** 원문제 값 $\frac12\lVert w\rVert^2$ = 쌍대 값 $g(\alpha^*)$ (강한 쌍대성), 그리고 기하학적으로 초평면이 두 점의 **수직이등분선**인지.
:::

:::ex 풀이
두 점이면 둘 다 서포트 벡터가 되고, 초평면은 두 점을 잇는 선분의 수직이등분선입니다. 그 직관과 계산이 맞는지 보세요.
---
**1. 라그랑지안.** $y_1(w^Tx_1+b)=-b$, $y_2(w^Tx_2+b)=2w_1+2w_2+b$이므로
$$L=\frac12(w_1^2+w_2^2)+\alpha_1(1+b)+\alpha_2(1-2w_1-2w_2-b),\qquad\alpha_1,\alpha_2\ge0.$$
$w,b$에 대해 최소화(정류 조건):
$$\frac{\partial L}{\partial w_1}=w_1-2\alpha_2=0,\quad \frac{\partial L}{\partial w_2}=w_2-2\alpha_2=0\ \Rightarrow\ w=(2\alpha_2,\,2\alpha_2)$$
$$\frac{\partial L}{\partial b}=\alpha_1-\alpha_2=0.$$
($L$은 $w$에 대해 볼록 이차식이라 정류점이 최소점. $b$에 대해서는 일차라 $\alpha_1\ne\alpha_2$이면 $\inf_b L=-\infty$가 되므로 쌍대 문제의 제약으로 $\alpha_1=\alpha_2$가 들어갑니다.)
대입하면 $\frac12\lVert w\rVert^2=4\alpha_2^2$, $-2w_1-2w_2=-8\alpha_2$이고 $b$항은 $(\alpha_1-\alpha_2)b=0$이므로
$$g(\alpha)=\alpha_1+\alpha_2-4\alpha_2^2.$$
**쌍대 문제:** $\max_\alpha\ \alpha_1+\alpha_2-4\alpha_2^2$ s.t. $\alpha_1=\alpha_2$, $\alpha_1,\alpha_2\ge0$.
$\alpha_1=\alpha_2=\alpha$로 두면 $h(\alpha)=2\alpha-4\alpha^2$, $h'(\alpha)=2-8\alpha=0\Rightarrow\alpha=\frac14\ (\ge0)$, $h''=-8\lt0$이라 최대. $\alpha_1^*=\alpha_2^*=\frac14$, 쌍대 값 $g^*=\frac12-\frac14=\frac14$.

**2. 복원.** $w^*=(2\alpha_2^*,2\alpha_2^*)=(\frac12,\frac12)$ (일반식 $\sum\alpha_iy_ix_i=\frac14(-1)(0,0)+\frac14(+1)(2,2)$와 같음).
$\alpha_2^*\gt0$이므로 상보성에서 $y_2(w^Tx_2+b)=1$: $\frac12\cdot2+\frac12\cdot2+b=1\Rightarrow b^*=-1$. 확인: $x_1$에서 $y_1(w^Tx_1+b)=-(0-1)=1$ ✓ (역시 서포트 벡터).

**3. 초평면과 마진.** $\frac12x_1+\frac12x_2-1=0$, 즉 $x_1+x_2=2$. $\lVert w^*\rVert=\frac1{\sqrt2}$이므로
$$\text{마진}=\frac1{\lVert w^*\rVert}=\sqrt2\quad(\text{두 경계 사이 폭 }\tfrac2{\lVert w^*\rVert}=2\sqrt2).$$
**검산.** 원문제 값 $\frac12\lVert w^*\rVert^2=\frac14=g^*$ (강한 쌍대성). 두 점 사이 거리 $2\sqrt2$의 절반이 $\sqrt2$이고, 중점 $(1,1)$이 $x_1+x_2=2$ 위에 있으며 법선 $(1,1)$이 두 점을 잇는 방향과 평행 — 수직이등분선이 맞습니다.
:::

:::warn 자주 하는 실수
- 라그랑지안에서 제약의 부호를 거꾸로 써서 $\alpha\le0$이 나오는 것.
- $\partial L/\partial b=0$에서 나온 $\sum\alpha_iy_i=0$을 쌍대 문제의 제약으로 **쓰지 않는** 것.
- $b$를 서포트 벡터가 아닌 점(또는 부등식)에서 구하는 것. 반드시 $\alpha_i\gt0$인 점에서 등식으로.
- 마진을 $\lVert w\rVert$나 $\frac2{\lVert w\rVert}$와 혼동하는 것. 정의를 한 줄 적고 답하세요.
:::
` },
      { id: 'p4', label: '문제 4', title: '최대-최소 부등식과 반례', where: '서포트 벡터 머신 · 쌍대성', secs: ['ch07:7.4', 'ch07:7.7'],
        body: R`
:::def 문제
공집합이 아닌 집합 $X$, $Y$와 함수 $f:X\times Y\to\mathbb R$에 대해 최대-최소 부등식
$$\max_{x\in X}\min_{y\in Y}f(x,y)\ \le\ \min_{y\in Y}\max_{x\in X}f(x,y)$$
를 증명하시오. 등호가 성립하지 않는 반례를 제시하시오.
:::

:::key 핵심 포인트
- **보조 함수 두 개를 정의**합니다: $g(x)=\min_{y}f(x,y)$ (행의 최소), $h(y)=\max_{x}f(x,y)$ (열의 최대).
- 핵심 부등식 한 줄: **모든** $x',y'$에 대해 $g(x')\le f(x',y')\le h(y')$.
- 그다음 **한 번에 하나씩** 최적화합니다. 왼쪽이 $y'$와 무관하니 먼저 오른쪽에서 $\min_{y'}$, 그다음 오른쪽이 $x'$와 무관하니 왼쪽에서 $\max_{x'}$.
- 최대·최소가 존재하지 않는 경우에도 $\sup$, $\inf$로 **같은 논리**가 성립한다고 한 줄 덧붙입니다.
- 반례는 **유한한 표**가 가장 안전합니다. 행의 최소들 중 최대와 열의 최대들 중 최소를 직접 계산해 보여 줍니다.
- 의미: SVM에서 쌍대 값 $d^*=\max_\alpha\min_wL\le\min_w\max_\alpha L=p^*$ (**약한 쌍대성**)이 바로 이 부등식입니다. 등호(강한 쌍대성)는 안장점이 있을 때 성립합니다.
:::

:::ex 풀이
“가장 나쁜 경우 중 가장 좋은 것”은 “가장 좋은 경우 중 가장 나쁜 것”을 넘을 수 없다는 뜻입니다. 두 게임 참가자를 떠올리면 쉽습니다.
---
**증명.** $g(x)=\min_{y\in Y}f(x,y)$, $h(y)=\max_{x\in X}f(x,y)$로 둡니다. 임의의 $x'\in X$, $y'\in Y$를 고정하면 최소·최대의 정의에서
$$g(x')=\min_yf(x',y)\le f(x',y')\le\max_xf(x,y')=h(y').$$
(1) $x'$를 고정한 채 이 부등식이 **모든** $y'$에서 성립하므로 $g(x')$는 $\{h(y'):y'\in Y\}$의 하계이고, 따라서 $g(x')\le\min_{y'}h(y')$.
(2) 이제 (1)이 **모든** $x'$에서 성립하므로 $\min_{y'}h(y')$는 $\{g(x'):x'\in X\}$의 상계이고, 따라서
$$\max_{x'}g(x')\le\min_{y'}h(y'),\quad\text{즉}\quad\max_x\min_yf(x,y)\le\min_y\max_xf(x,y).\qquad\blacksquare$$
최대·최소가 존재하지 않으면 $\min,\max$를 $\inf,\sup$로 바꿔 같은 논증으로 $\sup_x\inf_yf\le\inf_y\sup_xf$.

**반례.** $X=Y=\{0,1\}$, $f(x,y)=(x-y)^2$:

| $f(x,y)$ | $y=0$ | $y=1$ | 행의 최소 $g(x)$ |
|---|---|---|---|
| $x=0$ | 0 | 1 | 0 |
| $x=1$ | 1 | 0 | 0 |
| 열의 최대 $h(y)$ | 1 | 1 | |

$\max_xg(x)=0$, $\min_yh(y)=1$이므로 $0\lt1$ — 등호가 성립하지 않습니다. (어느 칸도 “그 행에서 최소이면서 그 열에서 최대”인 안장점이 아니기 때문입니다.)
:::

:::warn 자주 하는 실수
- 양변에 동시에 $\max$와 $\min$을 “적용”하는 것. 어떤 변수를 고정하고 어떤 변수에 대해 최적화하는지 **순서대로** 적어야 합니다.
- 반례에서 $\max\min$과 $\min\max$ 중 하나를 잘못 계산하는 것. 표를 그리면 실수가 없습니다.
- 반례로 등호가 성립하는 함수(예: 안장점이 있는 $f(x,y)=x^2-y^2$)를 드는 것.
:::
` },
    ],
  });
})();
