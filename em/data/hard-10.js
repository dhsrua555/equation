/* 고난이도 문제 풀이 — Kreyszig 10판 11장(10단원) 연습문제 가운데 어려운 문제.
   과제(Homework #1, #2)에 나온 문제는 빼고 골랐습니다. 문제는 교재 문제를 한국어로 옮겼고(번호는 교재 그대로),
   핵심 포인트·풀이·함정은 새로 썼습니다. 계수와 변환은 perl 수치적분으로 검산했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.hard = EM.hard || [];
(function () {
  const R = String.raw;
  EM.hard.push({
    id: 'k11', mark: '11', title: '11장 · 푸리에 해석', short: '11장',
    meta: 'Kreyszig 10판 11장 연습문제 · 11문제 (과제에 나온 문제 제외)',
    intro: R`
11장의 어려운 문제는 대부분 **계산을 피하는 요령**을 묻습니다. 적분을 처음부터 다시 하기 전에 아래를 먼저 떠올리세요.

:::tip 11장 어려운 문제의 도구
1. **이미 아는 급수를 재활용**: $x$, $\lvert x\rvert$, $x^2$, 사각파의 급수와 치환($x\to\pi-x$, $x\to ax$), 선형결합으로 새 급수를 만듭니다.
2. **계수 감소 속도 = 매끄러움**: 도약이 있으면 $1/n$, 꺾임이면 $1/n^2$, 2계 도함수의 도약이면 $1/n^3$.
3. **파세발 항등식** $2a_0^2+\sum(a_n^2+b_n^2)=\frac1\pi\int_{-\pi}^{\pi}f^2dx$로 급수의 합과 정적분을 동시에 얻습니다.
4. **도함수 공식의 전제 조건**: $\mathcal F\{f'\}=iw\hat f$는 $f$가 **연속**일 때만. 도약이 있으면 보정항이 붙습니다.
:::
`,
    problems: [
      { id: 'p1', label: '11.1 #22', title: '급수만 보고 함수 알아맞히기', where: '교재 11.1 #22 · 푸리에 급수 · ★★', secs: ['ch10:11.1', 'ch10:11.2'],
        body: R`
:::def 문제
(교재 11.1절 연습문제 22) 다음 급수가 나타내는 $f(x)$ ($-\pi\lt x\lt\pi$)를 추측하고, 오일러 공식으로 확인하시오.
(a) $2\big(\sin x+\frac13\sin3x+\frac15\sin5x+\cdots\big)-2\big(\frac12\sin2x+\frac14\sin4x+\frac16\sin6x+\cdots\big)$
(b) $\frac12+\frac4{\pi^2}\big(\cos x+\frac19\cos3x+\frac1{25}\cos5x+\cdots\big)$
(c) $\frac23\pi^2+4\big(\cos x-\frac14\cos2x+\frac19\cos3x-\frac1{16}\cos4x+\cdots\big)$
:::

:::key 핵심 포인트
- 먼저 **모양**을 읽습니다: 사인만 → 기함수, 코사인만 → 우함수. 계수가 $1/n$이면 도약이 있고, $1/n^2$이면 연속이지만 꺾임이 있습니다.
- 기본 급수 세 개를 기억하면 충분합니다($-\pi\lt x\lt\pi$):
$$x=2\sum_{n=1}^\infty\frac{(-1)^{n+1}}n\sin nx,\qquad\lvert x\rvert=\frac\pi2-\frac4\pi\sum_{n\text{ 홀수}}\frac{\cos nx}{n^2},$$
$$x^2=\frac{\pi^2}3+4\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos nx.$$
- (a)는 홀수 항 $+$, 짝수 항 $-$ → $(-1)^{n+1}$; (b)는 $\lvert x\rvert$ 급수의 일차식; (c)는 $x^2$ 급수의 부호를 뒤집고 상수를 옮긴 것.
:::

:::ex 풀이
추측 → 오일러 공식으로 계수 확인 → 한 점에서 수치 확인.
---
**(a)** 계수는 $n$이 홀수면 $\frac2n$, 짝수면 $-\frac2n$, 곧 $b_n=\frac{2(-1)^{n+1}}n$. 기함수이고 $1/n$로 줄어드니 도약이 있는 함수다. 추측 $f(x)=x$.
확인: $b_n=\frac1\pi\int_{-\pi}^{\pi}x\sin nx\,dx=\frac2\pi\Big[-\frac{x\cos nx}n\Big]_0^\pi+\frac2{n\pi}\int_0^\pi\cos nx\,dx=-\frac{2\cos n\pi}n=\frac{2(-1)^{n+1}}n$ ✓.

**(b)** 우함수, 계수 $\frac4{\pi^2n^2}$ (홀수 $n$). $\lvert x\rvert$의 급수에서 $\sum_{\text{홀수}}\frac{\cos nx}{n^2}=\frac\pi4\Big(\frac\pi2-\lvert x\rvert\Big)$이므로
$$\frac12+\frac4{\pi^2}\cdot\frac\pi4\Big(\frac\pi2-\lvert x\rvert\Big)=\frac12+\frac12-\frac{\lvert x\rvert}\pi=1-\frac{\lvert x\rvert}\pi.$$
확인: $a_0=\frac1\pi\int_0^\pi\big(1-\frac x\pi\big)dx=\frac12$ ✓, $a_n=\frac2\pi\int_0^\pi\big(1-\frac x\pi\big)\cos nx\,dx=\frac{2(1-(-1)^n)}{\pi^2n^2}$, 곧 홀수 $n$에서 $\frac4{\pi^2n^2}$ ✓.

**(c)** 우함수, 계수 $\frac{4(-1)^{n+1}}{n^2}$ — $x^2$ 급수의 계수 $\frac{4(-1)^n}{n^2}$에 $-1$을 곱한 것이다. 따라서 $f=c-x^2$ 꼴이고 상수항 $c-\frac{\pi^2}3=\frac{2\pi^2}3$에서 $c=\pi^2$:
$$f(x)=\pi^2-x^2.$$
확인: $a_0=\frac1\pi\int_0^\pi(\pi^2-x^2)dx=\pi^2-\frac{\pi^2}3=\frac{2\pi^2}3$ ✓.

**수치 확인.** $x=0.7$에서 부분합(2만 항)은 (a) $0.69995$, (b) $0.777183=1-\frac{0.7}\pi$, (c) $9.379604=\pi^2-0.49$ ✓. $x=0$을 넣으면 (b)는 $\frac12+\frac4{\pi^2}\cdot\frac{\pi^2}8=1$ ✓.
:::

:::warn 함정
- (a)를 $\sum\frac2n\sin nx$ (모든 항 $+$)로 읽는 것. 그것은 $\pi-x$ ($0\lt x\lt2\pi$)의 급수입니다.
- (b)에서 상수 $\frac12$을 $a_0$이 아니라 $\frac{a_0}2$로 생각하는 것. Kreyszig의 $a_0$은 평균값이므로 $a_0=\frac12$.
- 급수의 값을 $x=\pm\pi$에서 그대로 쓰는 것. (a)는 $\pm\pi$에서 도약의 평균 0으로 수렴합니다.
:::
` },
      { id: 'p2', label: '11.1 #25', title: '푸리에 계수의 감소 속도 1/n, 1/n², 1/n³ 증명', where: '교재 11.1 #25 · 푸리에 계수 · ★★★', secs: ['ch10:11.1', 'ch10:11.4'],
        body: R`
:::def 문제
(교재 11.1절 연습문제 25) 푸리에 계수의 크기는 $f$가 불연속이면 $1/n$, $f$는 연속이지만 $f'$이 불연속이면 $1/n^2$, $f$와 $f'$은 연속이지만 $f''$이 불연속이면 $1/n^3$ 정도인 것으로 보인다. 예로 확인하고, 오일러 공식을 부분적분하여 증명하시오. 실용적 의미는 무엇인가?
:::

:::key 핵심 포인트
- 주기 $2\pi$로 확장한 $f$가 점 $x_k$에서 도약 $J_k=f(x_k^+)-f(x_k^-)$를 갖는다고 합시다. 매끄러운 조각마다 부분적분하면 **경계항이 도약만 남깁니다**:
$$a_n=-\frac1{n\pi}\sum_kJ_k\sin nx_k-\frac1n\,b_n(f'),\qquad b_n=\frac1{n\pi}\sum_kJ_k\cos nx_k+\frac1n\,a_n(f').$$
- 도약이 있으면 첫 항 때문에 $1/n$. 도약이 없으면 $a_n=-\frac{b_n(f')}n$, $b_n=\frac{a_n(f')}n$ — **미분할 때마다 $n$을 하나씩 얻습니다.**
- 같은 식을 $f'$, $f''$에 다시 적용하면 $1/n^2$, $1/n^3$.
:::

:::ex 풀이
부분적분 공식을 유도하고 반복 적용합니다.
---
**설정.** $f$는 주기 $2\pi$이고 구간별로 매끄러워서($f$, $f'$이 구간별 연속), 한 주기 안의 점 $x_1\lt\cdots\lt x_r$을 빼면 미분 가능하다고 하자. $J_k=f(x_k^+)-f(x_k^-)$.

**부분적분.** 각 조각 $(x_k,x_{k+1})$에서 $\int f\cos nx\,dx=\Big[\frac{f\sin nx}n\Big]-\frac1n\int f'\sin nx\,dx$이다. 조각들을 한 주기에 걸쳐 더하면, 점 $x_k$에서 왼쪽 조각의 끝값 $f(x_k^-)$와 오른쪽 조각의 시작값 $f(x_k^+)$가 반대 부호로 만나므로 경계항의 합은 $\frac1n\sum_k\big(f(x_k^-)-f(x_k^+)\big)\sin nx_k=-\frac1n\sum_kJ_k\sin nx_k$. 따라서
$$a_n=\frac1\pi\int_{-\pi}^{\pi}f\cos nx\,dx=-\frac1{n\pi}\sum_kJ_k\sin nx_k-\frac1n\cdot\frac1\pi\int_{-\pi}^{\pi}f'\sin nx\,dx.$$
같은 방식으로 $b_n=\frac1{n\pi}\sum_kJ_k\cos nx_k+\frac1n\cdot\frac1\pi\int f'\cos nx\,dx$.

**결론.** $\big\lvert\frac1\pi\int f'\sin nx\,dx\big\rvert\le\frac1\pi\int_{-\pi}^{\pi}\lvert f'\rvert dx=:M$이므로
1. 도약이 있으면 $\lvert a_n\rvert,\lvert b_n\rvert\le\frac{\sum\lvert J_k\rvert/\pi+M}n$ — **$1/n$ 정도**(도약 항은 일반적으로 상쇄되지 않음).
2. $f$가 연속이면(모든 $J_k=0$) $a_n=-\frac{b_n(f')}n$, $b_n=\frac{a_n(f')}n$. $f'$이 도약을 가지면 1을 $f'$에 적용해 $f'$의 계수가 $O(1/n)$이므로 $f$의 계수는 **$O(1/n^2)$**.
3. $f$, $f'$이 모두 연속이고 $f''$이 도약을 가지면 같은 논리를 두 번 써서 **$O(1/n^3)$**. $\blacksquare$

**예.**
| 함수 ($-\pi\lt x\lt\pi$) | 매끄러움 | 계수 |
|---|---|---|
| 사각파 ($\pm1$) | 도약 | $b_n=\frac4{\pi n}$ (홀수) |
| $\lvert x\rvert$ | 연속, 꺾임 | $a_n=-\frac4{\pi n^2}$ (홀수) |
| $x(\pi^2-x^2)$ | $f$, $f'$ 연속, $f''$ 도약 | $b_n=\frac{12(-1)^{n+1}}{n^3}$ |

마지막 예를 공식으로 검산하면: $f''=-6x$는 $x=\pi$에서 $-6\pi\to6\pi$로 도약 $J=12\pi$, $f'''=-6$이라 $a_n(f''')=0$. 따라서 $b_n(f'')=\frac{12\pi\cos n\pi}{n\pi}=\frac{12(-1)^n}n$, $a_n(f')=-\frac{b_n(f'')}n$, $b_n(f)=\frac{a_n(f')}n=\frac{12(-1)^{n+1}}{n^3}$ ✓ (수치적분: $b_1=12$, $b_2=-1.5$, $b_3=0.4444$).

**실용적 의미.** 매끄러운 함수일수록 적은 항으로 잘 근사됩니다(오차가 빨리 줄어듦). 거꾸로 측정한 계수가 $1/n$로 줄면 신호에 도약이 있다는 뜻입니다. 또 계수가 $1/n^3$ 정도면 급수를 항별로 한 번 미분해도 고르게 수렴합니다(강제진동의 해를 급수로 쓸 때 필요).
:::

:::warn 함정
- 부분적분 경계항을 $[-\pi,\pi]$ 양 끝에서만 계산하는 것. 구간 **안쪽**의 도약점에서도 경계항이 생기고, 그것이 $1/n$의 원인입니다.
- “$f$가 $[-\pi,\pi]$에서 연속”과 “주기 확장이 연속”을 혼동하는 것. $f(x)=x$는 구간 안에서 연속이지만 확장은 $\pm\pi$에서 도약하므로 계수가 $1/n$입니다.
- 감소 속도를 상계로만 쓰고 “정확히 $1/n$”이라고 단정하는 것. 도약 항이 특정 $n$에서 0이 될 수 있습니다(사각파의 짝수 $n$).
:::
` },
      { id: 'p3', label: '11.2 #30', title: 'x → π − x 치환으로 반구간 전개 재활용하기', where: '교재 11.2 #26, #27, #30 · 반구간 전개 · ★★★', secs: ['ch10:11.2'],
        body: R`
:::def 문제
(교재 11.2절 연습문제 27, 30, 26)
(27) $f(x)=\frac\pi2$ ($0\lt x\lt\frac\pi2$), $f(x)=\pi-x$ ($\frac\pi2\lt x\lt\pi$)의 (a) 푸리에 코사인 급수, (b) 푸리에 사인 급수를 구하시오.
(30) 27번의 답으로부터 26번 $g(x)=x$ ($0\lt x\lt\frac\pi2$), $g(x)=\frac\pi2$ ($\frac\pi2\lt x\lt\pi$)의 두 반구간 전개를 **적분하지 않고** 얻으시오.
:::

:::key 핵심 포인트
- 그래프를 그리면 $g$는 $f$를 $x=\frac\pi2$에 대해 좌우로 뒤집은 것: $g(x)=f(\pi-x)$.
- $\cos n(\pi-x)=(-1)^n\cos nx$, $\sin n(\pi-x)=(-1)^{n+1}\sin nx$. 그래서 **계수에 부호만** 붙습니다.
$$a_n^{(g)}=(-1)^na_n^{(f)},\qquad b_n^{(g)}=(-1)^{n+1}b_n^{(f)}.$$
- 정당화: $f$의 우함수(기함수) 주기 확장 $F$에 대해 $F(\pi-x)$도 우함수(기함수)이고 주기 $2\pi$이며 $(0,\pi)$에서 $g$와 같습니다. 곧 $g$의 확장 그 자체입니다.
:::

:::ex 풀이
27번을 적분으로 한 번 풀고, 26번은 치환으로 얻은 뒤 계수 하나를 직접 검산합니다.
---
**(27a) 코사인 급수.** $a_0=\frac1\pi\Big(\frac\pi2\cdot\frac\pi2+\frac12\big(\frac\pi2\big)^2\Big)=\frac{3\pi}8$. $n\ge1$이면
$$\int_0^{\pi/2}\frac\pi2\cos nx\,dx=\frac\pi{2n}\sin\frac{n\pi}2,$$
$$\int_{\pi/2}^{\pi}(\pi-x)\cos nx\,dx=-\frac\pi{2n}\sin\frac{n\pi}2+\frac{\cos\frac{n\pi}2-\cos n\pi}{n^2}$$
(둘째는 $u=\pi-x$, $dv=\cos nx\,dx$로 부분적분). 더하면 사인항이 지워져
$$a_n=\frac2\pi\cdot\frac{\cos\frac{n\pi}2-(-1)^n}{n^2}$$
$$a_1=\frac2\pi,\quad a_2=-\frac1\pi,\quad a_3=\frac2{9\pi},\quad a_4=0,\quad a_5=\frac2{25\pi},\quad a_6=-\frac1{9\pi},\ \dots$$
**(27b) 사인 급수.** 같은 방식으로 $\int_0^{\pi/2}\frac\pi2\sin nx\,dx=\frac\pi{2n}\big(1-\cos\frac{n\pi}2\big)$, $\int_{\pi/2}^{\pi}(\pi-x)\sin nx\,dx=\frac\pi{2n}\cos\frac{n\pi}2+\frac1{n^2}\sin\frac{n\pi}2$이므로
$$b_n=\frac2\pi\Big(\frac\pi{2n}+\frac{\sin\frac{n\pi}2}{n^2}\Big)=\frac1n+\frac{2\sin\frac{n\pi}2}{\pi n^2}.$$

**(30) 26번으로 옮기기.** $(0,\pi)$에서 $g(x)=f(\pi-x)$이다($0\lt x\lt\frac\pi2$이면 $\pi-x\in(\frac\pi2,\pi)$라 $f(\pi-x)=x$, 나머지도 같다). $f$의 우함수 주기 확장 $F_c$는 $F_c(x)=a_0+\sum a_n\cos nx$이고, $G(x)=F_c(\pi-x)$는
- 주기 $2\pi$이고, $G(-x)=F_c(\pi+x)=F_c(-\pi-x)=F_c(\pi-x)=G(x)$ (우함수 + 주기)이므로 **우함수**,
- $(0,\pi)$에서 $g$와 같다.

곧 $G$는 $g$의 우함수 확장이고 그 급수는
$$G(x)=a_0+\sum a_n\cos(n\pi-nx)=\frac{3\pi}8+\sum_{n=1}^\infty(-1)^na_n\cos nx.$$
따라서 26번의 코사인 급수 계수는 $(-1)^na_n=\frac2\pi\cdot\frac{(-1)^n\cos\frac{n\pi}2-1}{n^2}$:
$$g(x)=\frac{3\pi}8-\frac2\pi\Big(\cos x+\frac{\cos3x}9+\frac{\cos5x}{25}+\cdots\Big)-\frac1\pi\Big(\cos2x+\frac{\cos6x}9+\cdots\Big).$$
사인 급수도 같은 논리(기함수 확장 $F_s$에 대해 $F_s(\pi-x)$는 기함수)로 $(-1)^{n+1}b_n$:
$$g(x)=\sum_{n=1}^\infty\Big(\frac{(-1)^{n+1}}n+\frac{2\sin\frac{n\pi}2}{\pi n^2}\Big)\sin nx.$$

**검산.** ① 직접 적분: $a_1^{(g)}=\frac2\pi\Big(\int_0^{\pi/2}x\cos x\,dx+\frac\pi2\int_{\pi/2}^\pi\cos x\,dx\Big)=\frac2\pi\Big(\frac\pi2-1-\frac\pi2\Big)=-\frac2\pi$ ✓. ② $x=0$: $g(0)=0$이어야 하는데 $\frac{3\pi}8-\frac2\pi\cdot\frac{\pi^2}8-\frac1\pi\cdot\frac{\pi^2}8=\frac{3\pi}8-\frac\pi4-\frac\pi8=0$ ✓. ③ 수치적분으로 $n=1,\dots,8$의 모든 계수가 위 식과 일치.
:::

:::warn 함정
- 26번을 처음부터 다시 적분하는 것. 문제의 뜻은 **대칭을 이용하라**입니다.
- $\sin n(\pi-x)$를 $(-1)^n\sin nx$로 쓰는 것. $\sin(n\pi-nx)=\sin n\pi\cos nx-\cos n\pi\sin nx=-(-1)^n\sin nx$.
- $a_0$에도 $(-1)^0=1$이 곱해진다는 것(평균값은 그대로)을 놓치는 것. 두 함수의 넓이는 같습니다.
- 치환한 급수가 **$g$의 반구간 전개**라는 근거(확장의 우함수·기함수 성질)를 빼는 것.
:::
` },
      { id: 'p4', label: '11.2 #18', title: '반파 정류기 V₀cos 100πt의 푸리에 급수', where: '교재 11.2 #18 · 임의 주기의 급수 · ★★', secs: ['ch10:11.2', 'ch10:11.1'],
        body: R`
:::def 문제
(교재 11.2절 연습문제 18, 정류기) 전압 $v(t)=V_0\cos100\pi t$를 음의 반주기를 잘라 내는 반파 정류기에 통과시킨 함수의 푸리에 급수를 구하시오.
:::

:::key 핵심 포인트
- 주기 $p=\frac1{50}$ s. 변수 $\theta=100\pi t$로 바꾸면 주기 $2\pi$인 $f(\theta)=V_0\max(\cos\theta,0)$ — **우함수**라 코사인 급수.
- $\cos\theta\cos n\theta=\frac12[\cos(n-1)\theta+\cos(n+1)\theta]$로 적분. $n=1$은 따로($\cos^2$).
- 지름길: $\max(\cos\theta,0)=\frac12(\cos\theta+\lvert\cos\theta\rvert)$이고 전파 정류 $\lvert\cos\theta\rvert$의 급수를 알면 바로 나옵니다.
:::

:::ex 풀이
$\theta$ 변수에서 계수를 구하고 $t$로 되돌립니다.
---
$\theta=100\pi t$이면 $f(\theta)=V_0\cos\theta$ ($\lvert\theta\rvert\lt\frac\pi2$), $0$ ($\frac\pi2\lt\lvert\theta\rvert\lt\pi$), 주기 $2\pi$, 우함수.

$a_0=\frac1{2\pi}\int_{-\pi/2}^{\pi/2}V_0\cos\theta\,d\theta=\frac{V_0}\pi$, $\quad a_1=\frac1\pi\int_{-\pi/2}^{\pi/2}V_0\cos^2\theta\,d\theta=\frac{V_0}\pi\cdot\frac\pi2=\frac{V_0}2.$

$n\ge2$이면
$$a_n=\frac{2V_0}\pi\int_0^{\pi/2}\cos\theta\cos n\theta\,d\theta=\frac{V_0}\pi\left[\frac{\sin\frac{(n-1)\pi}2}{n-1}+\frac{\sin\frac{(n+1)\pi}2}{n+1}\right].$$
- $n$이 홀수($\ge3$)이면 $n\pm1$이 짝수라 두 사인이 0 → $a_n=0$.
- $n=2k$이면 $\sin\frac{(2k-1)\pi}2=(-1)^{k+1}$, $\sin\frac{(2k+1)\pi}2=(-1)^k$이므로 $a_{2k}=\frac{V_0}\pi(-1)^{k+1}\Big(\frac1{2k-1}-\frac1{2k+1}\Big)=\frac{2V_0}\pi\cdot\frac{(-1)^{k+1}}{4k^2-1}$.

$\theta=100\pi t$로 되돌리면
$$v_{\text{정류}}(t)=\frac{V_0}\pi+\frac{V_0}2\cos100\pi t+\frac{2V_0}\pi\Big(\frac{\cos200\pi t}3-\frac{\cos400\pi t}{15}+\frac{\cos600\pi t}{35}-+\cdots\Big).$$

**지름길로 검산.** 전파 정류는 $\lvert\cos\theta\rvert=\frac2\pi+\frac4\pi\sum_{k\ge1}\frac{(-1)^{k+1}}{4k^2-1}\cos2k\theta$이므로
$$\frac{\cos\theta+\lvert\cos\theta\rvert}2=\frac1\pi+\frac12\cos\theta+\frac2\pi\sum_{k\ge1}\frac{(-1)^{k+1}}{4k^2-1}\cos2k\theta$$
로 위와 같다 ✓. (수치적분: $a_2=0.21221V_0$, $a_4=-0.04244V_0$, $a_6=0.01819V_0$.)

**해석.** 직류 성분 $\frac{V_0}\pi\approx0.318V_0$, 기본파 50 Hz의 진폭 $\frac{V_0}2$, 그리고 짝수 고조파(100, 200, 300 Hz …)만 남습니다. 정류기 뒤의 필터는 이 고조파를 걸러 직류만 남기도록 설계합니다.
:::

:::warn 함정
- 변수를 바꾸지 않고 $t$로 적분하면서 주기 $2L=\frac1{50}$의 $L$을 잘못 넣는 것. $\theta$로 바꾸면 계산이 §11.1과 같아집니다.
- $n=1$을 일반식에 넣어 $\frac{\sin0}0$을 만드는 것. $n=1$은 따로 계산합니다.
- $\sin$ 반파 정류(교재 예제)의 답을 그대로 쓰는 것. 코사인이라 우함수이고, 사인항이 없습니다.
:::
` },
      { id: 'p5', label: '11.3 #15', title: '감쇠 진동 y″ + cy′ + y = t(π² − t²)의 정상상태', where: '교재 11.3 #15 · 강제진동 · ★★★', secs: ['ch10:11.3', 'ch02:2.8'],
        body: R`
:::def 문제
(교재 11.3절 연습문제 15) $c\gt0$, 스프링 상수 $k=1$일 때 $y''+cy'+y=r(t)$의 정상상태 진동을 구하시오. 단 $r(t)=t(\pi^2-t^2)$ ($-\pi\lt t\lt\pi$), $r(t+2\pi)=r(t)$. $r(t)$의 그래프도 그리시오.
:::

:::key 핵심 포인트
- $r$은 기함수이고 $r$, $r'$의 주기 확장이 연속이라 계수가 $1/n^3$으로 빨리 줄어듭니다: $b_n=\frac{12(-1)^{n+1}}{n^3}$.
- 항마다 $y_n=A_n\cos nt+B_n\sin nt$를 넣어 $2\times2$ 연립방정식을 풉니다. $D_n=(1-n^2)^2+c^2n^2$:
$$A_n=\frac{-cn\,b_n}{D_n},\qquad B_n=\frac{(1-n^2)\,b_n}{D_n}.$$
- **$n=1$이 고유진동수와 같다**($k=1$): $D_1=c^2$이라 $A_1=-\frac{12}c$, $B_1=0$. 감쇠가 작으면 이 항이 압도하고, 위상이 입력보다 90° 늦습니다.
:::

:::ex 풀이
입력의 급수 → 항별 응답 → 해석 순서로 풉니다.
---
**입력의 급수.** $r$은 기함수라 $a_n=0$이고
$$b_n=\frac2\pi\int_0^\pi(\pi^2t-t^3)\sin nt\,dt=\frac{12(-1)^{n+1}}{n^3}$$
(부분적분 세 번; 또는 앞 문제의 계수 감소 공식). 따라서 $r(t)=12\big(\sin t-\frac{\sin2t}8+\frac{\sin3t}{27}-+\cdots\big)$.

**항별 응답.** $y_n=A_n\cos nt+B_n\sin nt$를 $y''+cy'+y=b_n\sin nt$에 넣으면 $y_n''=-n^2y_n$이므로
$$\big[(1-n^2)A_n+cnB_n\big]\cos nt+\big[-cnA_n+(1-n^2)B_n\big]\sin nt=b_n\sin nt.$$
$(1-n^2)A_n+cnB_n=0$, $-cnA_n+(1-n^2)B_n=b_n$을 풀면($D_n=(1-n^2)^2+c^2n^2\gt0$)
$$A_n=\frac{-cn\,b_n}{D_n},\qquad B_n=\frac{(1-n^2)\,b_n}{D_n}.$$
**정상상태 해.**
$$y(t)=\sum_{n=1}^\infty\frac{12(-1)^{n+1}}{n^3\big[(1-n^2)^2+c^2n^2\big]}\Big(-cn\cos nt+(1-n^2)\sin nt\Big).$$
처음 두 항은 ($b_1=12$, $b_2=-1.5$)
$$y=-\frac{12}c\cos t+\frac{3c\cos2t+4.5\sin2t}{9+4c^2}+\cdots$$
이고, 각 고조파의 진폭 $C_n=\sqrt{A_n^2+B_n^2}=\frac{\lvert b_n\rvert}{\sqrt{D_n}}$은 $C_1=\frac{12}c$, $C_2=\frac{1.5}{\sqrt{9+4c^2}}$, $C_3=\frac{12/27}{\sqrt{64+9c^2}}$.

**해석.** $c=0.5$이면 $C_1=24$, $C_2\approx0.47$, $C_3\approx0.055$. 입력에서 기본파의 진폭은 12인데 출력은 24로 두 배이고, 나머지 고조파는 오히려 줄었습니다. 고유진동수 $\sqrt k=1$이 입력의 기본파와 정확히 같기 때문입니다. 출력은 거의 $-\frac{12}c\cos t$, 곧 입력 $12\sin t$보다 위상이 $\frac\pi2$ 늦은 순수한 코사인입니다. $c\to0$이면 진폭이 $\frac{12}c\to\infty$ (공진).

**검산.** $c=0.5$에서 4000항까지 더한 $y$로 $y''+cy'+y-r$을 $t=1$, $t=-2$에서 계산하면 $10^{-13}$ 이하 ✓.
:::

:::fig fhdss
:::

:::warn 함정
- $n=1$에서 분모 $1-n^2=0$을 보고 “공진으로 해가 없다”고 하는 것. 감쇠 $c\gt0$가 있으면 $D_1=c^2\ne0$이라 유한합니다.
- $A_n$, $B_n$을 사인 입력에 맞춰 풀면서 코사인 방정식의 우변을 $b_n$으로 두는 것. 입력에 코사인항이 없으므로 그 식의 우변은 0입니다.
- 일반해(동차해 포함)를 답으로 쓰는 것. 정상상태는 $t\to\infty$에서 남는 주기해, 곧 특수해의 급수만입니다.
:::
` },
      { id: 'p6', label: '11.4 #12', title: '파세발 항등식으로 ζ(4), 홀수 항의 합, ∫cos⁶x 구하기', where: '교재 11.4 #11–15 · 파세발 항등식 · ★★', secs: ['ch10:11.4', 'ch17:3.2d'],
        body: R`
:::def 문제
(교재 11.4절 연습문제 12–15) 파세발 항등식을 이용하여 다음을 보이시오.
(12) $1+\frac1{2^4}+\frac1{3^4}+\cdots=\frac{\pi^4}{90}$ (11.1절 14번 $f=x^2$ 이용)
(13) $1+\frac1{3^4}+\frac1{5^4}+\cdots=\frac{\pi^4}{96}$ (11.1절 17번의 삼각파 이용)
(14), (15) $\int_{-\pi}^{\pi}\cos^4x\,dx=\frac{3\pi}4$, $\int_{-\pi}^{\pi}\cos^6x\,dx=\frac{5\pi}8$
:::

:::key 핵심 포인트
- Kreyszig의 파세발 항등식($a_0$은 평균값):
$$2a_0^2+\sum_{n=1}^\infty(a_n^2+b_n^2)=\frac1\pi\int_{-\pi}^{\pi}f(x)^2dx.$$
- (12) $x^2$의 계수 $a_0=\frac{\pi^2}3$, $a_n=\frac{4(-1)^n}{n^2}$를 넣으면 $\sum\frac{16}{n^4}$이 나옵니다.
- (13) 삼각파 $\pi-\lvert x\rvert$의 계수 $\frac4{\pi n^2}$ (홀수 $n$).
- (14), (15)는 거꾸로: **적분을 구하려고** 파세발을 씁니다. $\cos^3x=\frac34\cos x+\frac14\cos3x$이므로 $\int\cos^6=\int(\cos^3)^2=\pi\big(\frac9{16}+\frac1{16}\big)$.
:::

:::ex 풀이
세 경우 모두 계수의 제곱합과 $\frac1\pi\int f^2$을 계산합니다.
---
**(12)** $f=x^2$: $a_0=\frac{\pi^2}3$, $a_n=\frac{4(-1)^n}{n^2}$, $b_n=0$. 오른쪽은 $\frac1\pi\int_{-\pi}^{\pi}x^4dx=\frac{2\pi^4}5$. 따라서
$$\frac{2\pi^4}9+16\sum_{n=1}^\infty\frac1{n^4}=\frac{2\pi^4}5$$
$$\Longrightarrow\ \sum_{n=1}^\infty\frac1{n^4}=\frac1{16}\Big(\frac25-\frac29\Big)\pi^4=\frac1{16}\cdot\frac{8}{45}\pi^4=\frac{\pi^4}{90}\approx1.0823232.$$

**(13)** 11.1절 17번의 함수는 $f(x)=\pi-\lvert x\rvert$ (꼭짓점 $(0,\pi)$인 삼각파)로 $a_0=\frac\pi2$, $a_n=\frac4{\pi n^2}$ (홀수 $n$), 나머지 0. 오른쪽은 $\frac2\pi\int_0^\pi(\pi-x)^2dx=\frac{2\pi^2}3$. 따라서
$$\frac{\pi^2}2+\frac{16}{\pi^2}\sum_{n\text{ 홀수}}\frac1{n^4}=\frac{2\pi^2}3\ \Longrightarrow\ \sum_{n\text{ 홀수}}\frac1{n^4}=\frac{\pi^2}{16}\cdot\frac{\pi^2}6=\frac{\pi^4}{96}\approx1.0146780.$$
(일관성: 홀수 항 = 전체 − 짝수 항 $=\frac{\pi^4}{90}\big(1-\frac1{16}\big)=\frac{\pi^4}{96}$ ✓.)

**(14)** $\cos^2x=\frac12+\frac12\cos2x$ ($a_0=\frac12$, $a_2=\frac12$)이므로
$$\frac1\pi\int_{-\pi}^{\pi}\cos^4x\,dx=2\cdot\frac14+\frac14=\frac34\ \Longrightarrow\ \int_{-\pi}^{\pi}\cos^4x\,dx=\frac{3\pi}4.$$
**(15)** $\cos^3x=\frac34\cos x+\frac14\cos3x$ ($\cos3x=4\cos^3x-3\cos x$에서)이므로
$$\frac1\pi\int_{-\pi}^{\pi}\cos^6x\,dx=\Big(\frac34\Big)^2+\Big(\frac14\Big)^2=\frac{10}{16}\ \Longrightarrow\ \int_{-\pi}^{\pi}\cos^6x\,dx=\frac{5\pi}8.$$
($\cos^6x$를 직접 $\frac1{32}(10+15\cos2x+6\cos4x+\cos6x)$로 펼쳐 적분해도 $\frac{10}{32}\cdot2\pi=\frac{5\pi}8$ ✓.)
:::

:::warn 함정
- $a_0$의 계수 2를 빠뜨리는 것. Kreyszig처럼 $a_0$이 평균값이면 $2a_0^2$, 다른 교재처럼 상수항이 $\frac{a_0}2$이면 $\frac{a_0^2}2$입니다. 규약을 확인하세요.
- 파세발 항등식에 $\int_0^\pi$를 쓰는 것. 한 주기 전체 $\int_{-\pi}^{\pi}$입니다(우함수면 $2\int_0^\pi$).
- (15)에서 $\cos^6x$의 급수를 파세발에 넣는 것. 그러면 $\int\cos^{12}$가 나옵니다. **제곱해서 $\cos^6$이 되는 함수** $\cos^3x$의 계수를 써야 합니다.
:::
` },
      { id: 'p7', label: '11.6 #14', title: '에르미트 다항식: 생성함수, 직교성, 미분방정식', where: '교재 11.6 #14 (TEAM PROJECT) · 직교다항식 · ★★★', secs: ['ch10:11.6', 'ch10:11.5'],
        body: R`
:::def 문제
(교재 11.6절 연습문제 14) 에르미트 다항식을 $He_0=1$, $He_n(x)=(-1)^ne^{x^2/2}\dfrac{d^n}{dx^n}\big(e^{-x^2/2}\big)$ ($n=1,2,\dots$)로 정의한다.
(a) $He_1=x$, $He_2=x^2-1$, $He_3=x^3-3x$, $He_4=x^4-6x^2+3$임을 보이시오.
(b) **생성함수** $e^{tx-t^2/2}=\sum_{n=0}^\infty a_n(x)t^n$에서 $He_n(x)=n!\,a_n(x)$임을 보이시오.
(c) 생성함수를 $x$로 미분하여 $He_n'(x)=nHe_{n-1}(x)$를 보이시오.
(d) 에르미트 다항식은 $-\infty\lt x\lt\infty$에서 가중함수 $r(x)=e^{-x^2/2}$에 대해 직교함을 보이시오. 왜 가중함수가 필요한가?
(e) $He_n'(x)=xHe_n(x)-He_{n+1}(x)$를 보이고, (c)와 함께 $y=He_n$이 $y''-xy'+ny=0$을 만족함을 보이시오. 또 $w=e^{-x^2/4}y$가 베버 방정식 $w''+\big(n+\frac12-\frac14x^2\big)w=0$의 해임을 보이시오.
:::

:::key 핵심 포인트
- 정의에서 바로 나오는 점화식 (e) $He_{n+1}=xHe_n-He_n'$로 (a)를 빠르게 계산합니다.
- (b)의 열쇠: $tx-\frac{t^2}2=\frac{x^2}2-\frac{(x-t)^2}2$. 그러면 $e^{tx-t^2/2}=e^{x^2/2}e^{-(x-t)^2/2}$이고, $t$로 미분하는 것은 $x$로 미분하는 것과 부호만 다릅니다.
- (d) $m\lt n$이면 $\int x^ke^{-x^2/2}He_n\,dx=0$ ($k\lt n$)만 보이면 충분($He_m$은 $m$차 다항식). 부분적분 $k$번.
- (e) 두 점화식을 합치면 2계 ODE. 교재 인쇄본의 식 (23)은 부호가 어긋나 있으니 $y''-xy'+ny=0$으로 확인합니다.
:::

:::ex 풀이
(e)의 첫 식을 먼저 증명해 (a)에 쓰고, (b)–(d), 마지막으로 ODE를 유도합니다.
---
**(e) 앞부분과 (a).** $g=e^{-x^2/2}$라 하면 $He_n=(-1)^ne^{x^2/2}g^{(n)}$. 곱의 미분으로
$$He_n'=(-1)^n\big(xe^{x^2/2}g^{(n)}+e^{x^2/2}g^{(n+1)}\big)$$
$$=xHe_n-(-1)^{n+1}e^{x^2/2}g^{(n+1)}=xHe_n-He_{n+1}.$$
곧 $He_{n+1}=xHe_n-He_n'$. $He_0=1$에서 차례로
$$He_1=x,\qquad He_2=x\cdot x-1=x^2-1,$$
$$He_3=x(x^2-1)-2x=x^3-3x,\qquad He_4=x(x^3-3x)-(3x^2-3)=x^4-6x^2+3.$$

**(b)** $tx-\frac{t^2}2=\frac{x^2}2-\frac{(x-t)^2}2$이므로 $G(x,t)=e^{tx-t^2/2}=e^{x^2/2}\,g(x-t)$. $t$에 대한 매클로린 계수는 $a_n(x)=\frac1{n!}\frac{\partial^nG}{\partial t^n}\Big|_{t=0}$이고, $\frac\partial{\partial t}g(x-t)=-g'(x-t)$이므로 $\frac{\partial^n}{\partial t^n}g(x-t)=(-1)^ng^{(n)}(x-t)$. 따라서
$$n!\,a_n(x)=e^{x^2/2}(-1)^ng^{(n)}(x)=He_n(x).\qquad\blacksquare$$

**(c)** $\frac{\partial G}{\partial x}=tG$이므로 $\sum a_n'(x)t^n=\sum a_{n-1}(x)t^n$, 곧 $a_n'=a_{n-1}$ ($a_{-1}=0$). $He_n=n!a_n$을 넣으면 $\frac{He_n'}{n!}=\frac{He_{n-1}}{(n-1)!}$, 곧 $He_n'=nHe_{n-1}$. $\blacksquare$ (검산: $He_4'=4x^3-12x=4He_3$ ✓)

**(d)** $m\lt n$이라 하자. $He_m$은 $m$차 다항식이므로 $k\lt n$인 모든 $k$에 대해
$$I_k=\int_{-\infty}^\infty x^ke^{-x^2/2}He_n\,dx=(-1)^n\int_{-\infty}^\infty x^kg^{(n)}(x)\,dx=0$$
을 보이면 된다. 부분적분을 $k$번 하면 경계항은 (다항식)×$g^{(j)}$ 꼴이고 $g^{(j)}=(\text{다항식})e^{-x^2/2}\to0$ ($\lvert x\rvert\to\infty$)이라 모두 0이다. 남는 것은 상수 × $\int g^{(n-k)}dx=$ 상수 × $\big[g^{(n-k-1)}\big]_{-\infty}^\infty=0$ ($n-k-1\ge0$). 따라서 $\int e^{-x^2/2}He_mHe_n\,dx=0$. $\blacksquare$
**가중함수가 필요한 이유**: 무한 구간에서 다항식의 곱 $He_mHe_n$은 적분이 발산합니다. $e^{-x^2/2}$처럼 빨리 0으로 가는 가중함수가 있어야 내적이 정의됩니다. (덤: $\int e^{-x^2/2}He_n^2dx=n!\sqrt{2\pi}$, 수치적분으로 $n=3,4$에서 확인.)

**(e) ODE.** $He_{n+1}=xHe_n-He_n'$을 미분하면 $He_{n+1}'=He_n+xHe_n'-He_n''$. 왼쪽은 (c)에 의해 $(n+1)He_n$이므로
$$(n+1)He_n=He_n+xHe_n'-He_n''\ \Longrightarrow\ He_n''-xHe_n'+nHe_n=0.$$
**베버 방정식.** $y=e^{x^2/4}w$를 넣으면 $y'=e^{x^2/4}\big(w'+\frac x2w\big)$, $y''=e^{x^2/4}\big(w''+xw'+(\frac12+\frac{x^2}4)w\big)$이고
$$y''-xy'+ny=e^{x^2/4}\Big[w''+\Big(n+\frac12-\frac{x^2}4\Big)w\Big]=0.$$
따라서 $w=e^{-x^2/4}He_n$은 베버 방정식의 해다(양자역학의 조화진동자 파동함수와 같은 꼴). $\blacksquare$
:::

:::fig fhdherm
:::

:::warn 함정
- (b)에서 매클로린 계수를 $x$에 대한 미분으로 쓰는 것. 생성함수는 **$t$**에 대한 급수입니다. 지수의 완전제곱이 $t$-미분을 $x$-미분으로 바꿔 줍니다.
- (d)에서 $He_m$과 $He_n$을 모두 펼쳐 적분하려는 것. “$m$차 다항식은 $x^k$ ($k\le m\lt n$)의 일차결합” 한 줄로 충분합니다.
- 교재의 다른 정의 $H_n^*=(-1)^ne^{x^2}\frac{d^n}{dx^n}e^{-x^2}$ (물리학자 규약)과 섞는 것. 가중함수와 ODE의 계수가 달라집니다.
:::
` },
      { id: 'p8', label: '11.7 #14', title: '푸리에 적분의 척도 변환과 x·f(x), x²·f(x)의 표현', where: '교재 11.7 #14 (PROJECT) · 푸리에 적분 · ★★★', secs: ['ch10:11.7'],
        body: R`
:::def 문제
(교재 11.7절 연습문제 14) (a) 푸리에 코사인 적분 $f(x)=\int_0^\infty A(w)\cos xw\,dw$, $A(w)=\frac2\pi\int_0^\infty f(v)\cos wv\,dv$에서 다음을 보이시오.
$$\text{(a1) }f(ax)=\frac1a\int_0^\infty A\Big(\frac wa\Big)\cos xw\,dw\quad(a\gt0),$$
$$\text{(a2) }xf(x)=\int_0^\infty B^*(w)\sin xw\,dw,\quad B^*=-\frac{dA}{dw},$$
$$\text{(a3) }x^2f(x)=\int_0^\infty A^*(w)\cos xw\,dw,\quad A^*=-\frac{d^2A}{dw^2}.$$
(b) 7번($f=1$, $0\lt x\lt1$)의 결과에 (a3)을 적용하여 8번($f=x^2$, $0\lt x\lt1$)을 푸시오.
(c) $f=1$ ($0\lt x\lt a$), $0$ ($x\gt a$)에 대해 (a2)를 확인하시오.
(d) 푸리에 사인 적분에 대한 비슷한 공식을 구하시오.
:::

:::key 핵심 포인트
- (a1)은 적분변수 치환 $w'=aw$ 한 줄.
- (a2), (a3)은 $A(w)$를 **$w$로 미분**: $\frac{d}{dw}\cos wv=-v\sin wv$이므로 $-A'(w)=\frac2\pi\int_0^\infty vf(v)\sin wv\,dv$ — 정확히 $xf(x)$의 **사인** 적분 계수. 두 번 미분하면 $x^2f(x)$의 코사인 적분 계수.
- 적분 기호 아래 미분의 근거: $xf$, $x^2f$가 절대 적분 가능.
- (d) 사인 적분이면 미분할 때 사인이 코사인으로: $xf(x)$의 코사인 적분 계수는 $+B'(w)$.
:::

:::ex 풀이
(a)를 증명하고, (b), (c)에서 직접 적분한 결과와 비교합니다.
---
**(a1)** $f(ax)=\int_0^\infty A(w)\cos(axw)\,dw$에서 $w'=aw$로 치환하면 $dw=\frac{dw'}a$이고 $f(ax)=\frac1a\int_0^\infty A\big(\frac{w'}a\big)\cos xw'\,dw'$. $\blacksquare$

**(a2)** $\int_0^\infty\lvert vf(v)\rvert dv\lt\infty$이면 적분 기호 아래에서 미분할 수 있고
$$A'(w)=\frac2\pi\int_0^\infty f(v)\frac{\partial}{\partial w}\cos wv\,dv=-\frac2\pi\int_0^\infty vf(v)\sin wv\,dv.$$
오른쪽의 $\frac2\pi\int_0^\infty\big(vf(v)\big)\sin wv\,dv$는 함수 $xf(x)$의 푸리에 사인 적분 계수 $B^*(w)$이므로 $B^*=-A'$이고 $xf(x)=\int_0^\infty B^*(w)\sin xw\,dw$. $\blacksquare$

**(a3)** 한 번 더 미분하면($x^2f$ 절대 적분 가능) $A''(w)=-\frac2\pi\int_0^\infty v^2f(v)\cos wv\,dv$이고, 이것의 $-1$배가 $x^2f(x)$의 코사인 적분 계수 $A^*$. $\blacksquare$

**(b)** 7번: $A(w)=\frac2\pi\int_0^1\cos wv\,dv=\frac2\pi\cdot\frac{\sin w}w$. 미분하면
$$\Big(\frac{\sin w}w\Big)'=\frac{w\cos w-\sin w}{w^2},\qquad\Big(\frac{\sin w}w\Big)''=\frac{-w^2\sin w-2w\cos w+2\sin w}{w^3}$$
이므로 (a3)에 의해 8번의 계수는
$$A^*(w)=-A''(w)=\frac2\pi\cdot\frac{w^2\sin w+2w\cos w-2\sin w}{w^3},$$
$$x^2=\int_0^\infty A^*(w)\cos xw\,dw\qquad(0\lt x\lt1).$$
**직접 검산**: $\frac2\pi\int_0^1v^2\cos wv\,dv=\frac2\pi\Big(\frac{\sin w}w+\frac{2\cos w}{w^2}-\frac{2\sin w}{w^3}\Big)$ — 같다 ✓ (수치: $w=0.7$에서 $0.181911$).
$x=1$에서는 도약 $1\to0$이라 적분은 $\frac12$을 나타냅니다.

**(c)** $A(w)=\frac2\pi\cdot\frac{\sin aw}w$이므로 $-A'(w)=\frac2\pi\cdot\frac{\sin aw-aw\cos aw}{w^2}$. 직접: $\frac2\pi\int_0^av\sin wv\,dv=\frac2\pi\Big[-\frac{v\cos wv}w+\frac{\sin wv}{w^2}\Big]_0^a=\frac2\pi\cdot\frac{\sin aw-aw\cos aw}{w^2}$ ✓.

**(d) 사인 적분의 대응 공식.** $f(x)=\int_0^\infty B(w)\sin xw\,dw$이면
$$f(ax)=\frac1a\int_0^\infty B\Big(\frac wa\Big)\sin xw\,dw,\qquad xf(x)=\int_0^\infty\frac{dB}{dw}\cos xw\,dw,$$
$$x^2f(x)=\int_0^\infty\Big(-\frac{d^2B}{dw^2}\Big)\sin xw\,dw.$$
가운데 식의 부호가 $+$인 것은 $\frac d{dw}\sin wv=+v\cos wv$이기 때문.
:::

:::warn 함정
- (a2)를 “$xf$의 코사인 적분”으로 쓰는 것. 코사인을 $w$로 미분하면 사인이 나오므로 $xf$는 **사인** 적분입니다. 실제로 $f$가 우함수면 $xf$는 기함수.
- (b)에서 몫의 미분을 두 번 하다 부호를 틀리는 것. 직접 적분한 결과와 반드시 비교하세요.
- 조건(절대 적분 가능성) 없이 적분 기호 아래에서 미분하는 것. $f=1$ ($0\lt x\lt1$)처럼 유계 구간에서만 0이 아니면 언제나 괜찮습니다.
:::
` },
      { id: 'p9', label: '11.8 #7', title: '코사인·사인 변환의 존재 여부와 Γ(1/2) = √π', where: '교재 11.8 #7, #8, #14 · 코사인·사인 변환 · ★★★', secs: ['ch10:11.8', 'ch10:11.7'],
        body: R`
:::def 문제
(교재 11.8절 연습문제 7, 8, 14)
(7) $x^{-1}\sin x$ ($0\lt x\lt\infty$)의 푸리에 코사인 변환은 존재하는가? $x^{-1}\cos x$는? 이유를 대시오.
(8) $f(x)=k=$ 상수 ($0\lt x\lt\infty$)의 푸리에 코사인 변환은 존재하는가? 사인 변환은?
(14) 11.10절 표 II의 2번 $\mathcal F_s(1/\sqrt x)=1/\sqrt w$와 4번 $\mathcal F_s(x^{a-1})=\sqrt{\frac2\pi}\,\frac{\Gamma(a)}{w^a}\sin\frac{a\pi}2$ ($0\lt a\lt1$)를 이용하여 $\Gamma(\frac12)=\sqrt\pi$를 증명하시오.
:::

:::key 핵심 포인트
- 존재 정리(절대 적분 가능 + 구간별 연속)는 **충분조건**일 뿐입니다. $\frac{\sin x}x$는 절대 적분 가능하지 않지만 이상적분은 (조건)수렴합니다.
- (7) 곱을 합으로: $\frac{\sin x\cos wx}x=\frac{\sin(1+w)x+\sin(1-w)x}{2x}$와 디리클레 적분 $\int_0^\infty\frac{\sin kx}xdx=\frac\pi2\operatorname{sgn}k$.
- $\frac{\cos x}x$는 $x=0$ 근처에서 $\frac1x$처럼 커져 **코사인 변환의 적분이 0에서 발산**. 그러나 사인 변환은 $\sin wx\approx wx$가 특이성을 지워 존재합니다.
- (14) 4번에 $a=\frac12$를 넣고 2번과 비교 — 한 줄.
:::

:::ex 풀이
각 적분이 수렴하는지 $x\to0$과 $x\to\infty$ 두 끝에서 따로 봅니다.
---
**(7) $x^{-1}\sin x$: 존재한다.** $x\to0$에서 $\frac{\sin x}x\to1$이라 문제없고, $x\to\infty$에서는
$$\int_0^\infty\frac{\sin x}x\cos wx\,dx=\frac12\int_0^\infty\frac{\sin(1+w)x}x\,dx+\frac12\int_0^\infty\frac{\sin(1-w)x}x\,dx$$
$$=\frac\pi4\big[\operatorname{sgn}(1+w)+\operatorname{sgn}(1-w)\big]$$
(디리클레 적분, 조건수렴). $w\ge0$이면 $0\le w\lt1$에서 $\frac\pi2$, $w=1$에서 $\frac\pi4$, $w\gt1$에서 0. 따라서
$$\mathcal F_c\Big(\frac{\sin x}x\Big)=\sqrt{\frac2\pi}\cdot\frac\pi2=\sqrt{\frac\pi2}\ (0\le w\lt1),\qquad0\ (w\gt1)$$
— 표 I의 10번($a=1$)과 같다. (수치: $w=0.5$에서 $\int_0^{4000}\approx1.57081$.) $\frac{\sin x}x$는 $\int_0^\infty\big\lvert\frac{\sin x}x\big\rvert dx=\infty$라 존재 정리의 조건은 깨지지만 변환은 존재한다.

**$x^{-1}\cos x$: 코사인 변환은 존재하지 않는다.** $x\to0^+$에서 $\frac{\cos x\cos wx}x\approx\frac1x$이고 $\int_0^1\frac{dx}x=\infty$. (반면 사인 변환은 $\frac{\cos x\sin wx}x\to w$로 유계라 존재하며, 표 II의 11번 $\sqrt{\frac\pi2}\,u(w-1)$.)

**(8) 둘 다 존재하지 않는다.** $\int_0^b\cos wx\,dx=\frac{\sin wb}w$, $\int_0^b\sin wx\,dx=\frac{1-\cos wb}w$는 $b\to\infty$에서 극한이 없다(진동). 근본적으로 상수는 $(0,\infty)$에서 적분 가능하지 않다. (델타 함수를 쓰는 일반화된 의미로는 정의할 수 있지만, 이 과목의 변환으로는 없다.)

**(14)** 4번에 $a=\frac12$를 넣으면 $x^{a-1}=x^{-1/2}$이고 $\sin\frac\pi4=\frac1{\sqrt2}$이므로
$$\mathcal F_s\big(x^{-1/2}\big)=\sqrt{\frac2\pi}\cdot\frac{\Gamma(\frac12)}{\sqrt w}\cdot\frac1{\sqrt2}=\frac{\Gamma(\frac12)}{\sqrt\pi\,\sqrt w}.$$
2번은 같은 변환이 $\frac1{\sqrt w}$이라고 하므로 $\frac{\Gamma(1/2)}{\sqrt\pi}=1$, 곧 $\Gamma\big(\frac12\big)=\sqrt\pi$. $\blacksquare$
**교차 검산**: $\Gamma(\frac12)=\int_0^\infty t^{-1/2}e^{-t}dt$에서 $t=u^2$이면 $2\int_0^\infty e^{-u^2}du=\sqrt\pi$ (가우스 적분) ✓.
:::

:::warn 함정
- “절대 적분 가능하지 않으니 변환이 없다”고 단정하는 것. 존재 정리는 충분조건이고, $\frac{\sin x}x$는 반례입니다.
- $\frac{\cos x}x$의 문제를 $x\to\infty$에서 찾는 것. 무한대 쪽은 디리클레 적분처럼 수렴하고, 문제는 $x=0$입니다.
- (7)에서 $w=1$의 값을 $\frac\pi2$나 0으로 쓰는 것. 두 sgn 중 하나가 0이 되어 $\frac\pi4$(도약의 평균)입니다.
:::
` },
      { id: 'p10', label: '11.9 #17', title: '도함수 공식 𝓕{f′} = iw f̂는 언제 통하는가', where: '교재 11.9 #9, #11, #12, #17 · 푸리에 변환 · ★★★', secs: ['ch10:11.9'],
        body: R`
:::def 문제
(교재 11.9절 연습문제 12, 17)
(12) $f(x)=xe^{-x}$ ($x\gt0$), $0$ ($x\lt0$)의 푸리에 변환을 본문의 식 (9) $\mathcal F\{f'\}=iw\mathcal F\{f\}$와 표 III의 5번($e^{-x}$, $x\gt0$)으로 구하시오. 힌트: $xe^{-x}$와 $e^{-x}$를 함께 생각하라.
(17) 11번($f=-1$ ($-1\lt x\lt0$), $1$ ($0\lt x\lt1$), 그 밖 0)을 9번($f=\lvert x\rvert$ ($-1\lt x\lt1$), 그 밖 0)의 결과와 식 (9)로 풀 수 있겠다는 생각은 어디서 나오는가? 이것이 통하는가?
:::

:::key 핵심 포인트
- 식 (9)의 전제: $f$가 **연속**이고 $\lvert x\rvert\to\infty$에서 0, $f'$이 절대 적분 가능.
- (12) $f=xe^{-x}u(x)$는 $x=0$에서 연속($f(0)=0$)이므로 통합니다. $f'=e^{-x}u(x)-f$를 변환하면 $(1+iw)\hat f=\frac1{\sqrt{2\pi}(1+iw)}$.
- (17) 9번의 $\lvert x\rvert$를 미분하면 11번의 부호 함수 — 그래서 떠오르는 생각. 그러나 9번의 함수는 $x=\pm1$에서 **도약**($\lvert x\rvert$가 1에서 0으로)하므로 식 (9)는 그대로 통하지 않습니다.
- 도약 $J_k$가 있으면 부분적분의 경계항이 남아
$$\mathcal F\{f'\}=iw\hat f-\frac1{\sqrt{2\pi}}\sum_kJ_ke^{-iwx_k}.$$
:::

:::ex 풀이
(12)는 공식이 통하는 경우, (17)은 통하지 않는 경우와 그 보정입니다.
---
**(12)** $f=xe^{-x}u(x)$는 연속이고 $f\to0$, $f'=(1-x)e^{-x}$ ($x\gt0$), $0$ ($x\lt0$)은 절대 적분 가능하다($x=0$에서 $f'$의 도약은 상관없다). 따라서 $\mathcal F\{f'\}=iw\hat f$. 한편 $f'=e^{-x}u(x)-f$이고 표 III 5번($a=1$)에서 $\mathcal F\{e^{-x}u(x)\}=\frac1{\sqrt{2\pi}(1+iw)}$이므로
$$iw\hat f=\frac1{\sqrt{2\pi}(1+iw)}-\hat f\ \Longrightarrow\ \hat f(w)=\frac1{\sqrt{2\pi}\,(1+iw)^2}.$$
검산: 직접 $\int_0^\infty xe^{-(1+iw)x}dx=\frac1{(1+iw)^2}$ ✓ (수치: $w=0.9$에서 $0.023137-0.219192i$).

**(17) 아이디어의 출처.** $f_9=\lvert x\rvert$ ($\lvert x\rvert\lt1$)의 도함수는 $x\ne0,\pm1$에서 $-1$ ($x\lt0$), $1$ ($x\gt0$), 0 (밖) — 정확히 $f_{11}$이다. 그래서 $\hat f_{11}=iw\hat f_9$을 기대하게 된다.

**통하는가?** 직접 구하면
$$\hat f_9=\sqrt{\frac2\pi}\,\frac{w\sin w+\cos w-1}{w^2},$$
$$\hat f_{11}=\frac1{\sqrt{2\pi}}\Big[\frac{1-e^{-iw}}{iw}-\frac{e^{iw}-1}{iw}\Big]=-i\sqrt{\frac2\pi}\,\frac{1-\cos w}w.$$
그런데
$$iw\hat f_9=i\sqrt{\frac2\pi}\,\frac{w\sin w+\cos w-1}w=-i\sqrt{\frac2\pi}\,\frac{1-\cos w}w+i\sqrt{\frac2\pi}\sin w\ \ne\ \hat f_{11}.$$
**통하지 않는다.** 차이 $i\sqrt{\frac2\pi}\sin w$는 $f_9$가 연속이 아니어서 생긴다: $f_9$는 $x=-1$에서 $0\to1$ (도약 $+1$), $x=1$에서 $1\to0$ (도약 $-1$).

**보정 공식.** $\int_{-1}^1f_9'e^{-iwx}dx=\big[f_9e^{-iwx}\big]_{-1^+}^{1^-}+iw\int_{-1}^1f_9e^{-iwx}dx$에서 경계항은 $e^{-iw}-e^{iw}=-2i\sin w$. 따라서
$$\hat f_{11}=iw\hat f_9-\frac{2i\sin w}{\sqrt{2\pi}}=iw\hat f_9-i\sqrt{\frac2\pi}\sin w\ ✓.$$
일반적으로 점 $x_k$에서 도약 $J_k$가 있으면 $\mathcal F\{f'\}=iw\hat f-\frac1{\sqrt{2\pi}}\sum_kJ_ke^{-iwx_k}$이고, 이 문제는 $J=+1$ ($x=-1$), $J=-1$ ($x=1$)인 경우다. (수치: $w=0.9$에서 세 식 모두 $-0.335457i$.)
:::

:::warn 함정
- (17)에서 “$f_{11}=f_9'$이니 $\hat f_{11}=iw\hat f_9$”라고 쓰고 끝내는 것. 공식의 **전제 조건**을 확인하는 것이 문제의 핵심입니다.
- (12)에서 $f'$의 $x=0$ 도약 때문에 공식이 안 된다고 하는 것. 연속이어야 하는 것은 $f$이고, $f'$은 절대 적분 가능하면 됩니다.
- 보정항의 부호: 도약 $J_k=f(x_k^+)-f(x_k^-)$이고 공식은 $-\sum J_ke^{-iwx_k}$입니다.
:::
` },
      { id: 'p11', label: '11.9 #23', title: '8점 이산 푸리에 변환: 푸리에 행렬 F₈과 그 역행렬', where: '교재 11.9 #23, #24, #25 · 이산 푸리에 변환 · ★★', secs: ['ch10:11.9'],
        body: R`
:::def 문제
(교재 11.9절 연습문제 23–25)
(23) 표본 8개인 신호에 대해 $w=e^{-2\pi i/8}=\frac{1-i}{\sqrt2}$임을 보이고, 제곱하여 확인하시오. (교재 인쇄본의 지수는 $-\frac{2\pi i}8$로 읽습니다.)
(24) 표본 8개에 대한 푸리에 행렬 $F_8$을 구체적으로 쓰시오.
(25) $F_8$의 역행렬을 구하고, 8개 표본의 신호를 변환했다가 되돌려 확인하시오.
:::

:::key 핵심 포인트
- $w=w_8=e^{-i\pi/4}=\cos\frac\pi4-i\sin\frac\pi4=\frac{1-i}{\sqrt2}$, $w^2=-i=w_4$, $w^4=-1$, $w^8=1$.
- $F_8=[w^{nk}]$의 성분은 지수 $nk$를 **8로 나눈 나머지**만 보면 됩니다. 8가지 값 $w^0,\dots,w^7$만 나옵니다.
- 역행렬 $F_8^{-1}=\frac18\overline{F_8}$: $(\overline{F}F)_{jk}=\sum_n w^{n(k-j)}$은 $j=k$이면 8, 아니면 등비합이라 0.
- 확인용 신호는 계산이 쉬운 것: $(1,1,1,1,0,0,0,0)$이면 $\hat f_n=\sum_{k=0}^3w^{nk}=\frac{1-w^{4n}}{1-w^n}$.
:::

:::ex 풀이
$w$의 거듭제곱표 → 행렬 → 역행렬 → 예제 신호.
---
**(23)** $w=e^{-2\pi i/8}=\cos\frac\pi4-i\sin\frac\pi4=\frac{1-i}{\sqrt2}$. 제곱: $w^2=\frac{(1-i)^2}2=\frac{1-2i-1}2=-i=e^{-2\pi i/4}$ ✓ ($w_8^2=w_4$).

**(24)** 거듭제곱은
$$w^0=1,\ w^1=\tfrac{1-i}{\sqrt2},\ w^2=-i,\ w^3=-\tfrac{1+i}{\sqrt2},\ w^4=-1,\ w^5=\tfrac{-1+i}{\sqrt2},\ w^6=i,\ w^7=\tfrac{1+i}{\sqrt2}.$$
$F_8=[w^{nk}]$ ($n,k=0,\dots,7$)에서 지수 $nk\bmod8$은
$$\begin{pmatrix}0&0&0&0&0&0&0&0\\0&1&2&3&4&5&6&7\\0&2&4&6&0&2&4&6\\0&3&6&1&4&7&2&5\\0&4&0&4&0&4&0&4\\0&5&2&7&4&1&6&3\\0&6&4&2&0&6&4&2\\0&7&6&5&4&3&2&1\end{pmatrix}$$
이고, 각 칸에 위의 $w^{(\cdot)}$ 값을 넣은 것이 $F_8$이다. 예를 들어 제 2행($n=2$)은 $(1,-i,-1,i,1,-i,-1,i)$로 $F_4$의 행이 두 번 반복된다.

**(25) 역행렬.** $(\overline{F_8}F_8)_{jk}=\sum_{n=0}^7\overline w^{\,jn}w^{nk}=\sum_{n=0}^7\big(w^{k-j}\big)^n$. $j=k$이면 8. $j\ne k$이면 $r=w^{k-j}\ne1$, $r^8=1$이라 $\frac{1-r^8}{1-r}=0$. 따라서 $\overline{F_8}F_8=8I$이고
$$F_8^{-1}=\frac18\,\overline{F_8},\qquad\overline{F_8}=[\overline w^{\,nk}]\ (\text{위 표의 }w^m\text{을 켤레로}).$$
**예제 신호.** $\mathbf f=(1,1,1,1,0,0,0,0)$이면 $\hat f_n=\sum_{k=0}^3w^{nk}$.
- $n=0$: 4.
- $n$ 짝수($2,4,6$): $w^{4n}=1$이고 $w^n\ne1$이라 $\frac{1-w^{4n}}{1-w^n}=0$.
- $n$ 홀수: $w^{4n}=-1$이라 $\hat f_n=\frac2{1-w^n}$. 계산하면 $\hat f_1=1-(1+\sqrt2)i$, $\hat f_3=1-(\sqrt2-1)i$, $\hat f_5=\overline{\hat f_3}$, $\hat f_7=\overline{\hat f_1}$.
$$\hat{\mathbf f}=\big(4,\ 1-(1+\sqrt2)i,\ 0,\ 1-(\sqrt2-1)i,\ 0,\ 1+(\sqrt2-1)i,\ 0,\ 1+(1+\sqrt2)i\big).$$
실수 신호라 $\hat f_{8-n}=\overline{\hat f_n}$ 대칭이 있다.

**되돌리기.** $f_k=\frac18\sum_n\hat f_n\overline w^{\,nk}$.
- $k=0$: $\frac18(4+1+1+1+1)=1$ ✓ (허수부는 켤레 쌍끼리 상쇄).
- $k=4$: $\overline w^{\,4n}=(-1)^n$이므로 $\frac18\big(4-(1+1+1+1)\big)=0$ ✓.
:::

:::warn 함정
- $w=e^{-i/4}$ (인쇄본)를 그대로 계산하는 것. 8점 DFT의 $w$는 $e^{-2\pi i/8}$이고, 제곱해서 $-i$가 되는지로 확인합니다.
- 역행렬을 $\overline{F_8}$ 그대로(또는 $\frac18F_8$)로 쓰는 것. **켤레**와 **$\frac1N$**이 모두 필요합니다.
- 지수를 8로 나눈 나머지로 줄이지 않고 $w^{49}$ 같은 값을 따로 계산하는 것. $w^{49}=w^1$입니다.
:::
` },
    ],
  });
})();
