/* 퀴즈풀이 — 공학수학2 Homework #2 (푸리에 해석, 교재 11.5–11.10).
   문제는 과제지 원문을 옮겼고(2–3번은 과제지가 가리키는 교재 문제를 한국어로 적음), 핵심 포인트·풀이·자주 하는 실수는 새로 썼습니다.
   secs는 문제의 개념이 있는 절, 같은 유형의 연습문제는 quiz: 'hw2-pN' (quizprep-hw2.js). 수치는 perl로 검산했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.quizzes = EM.quizzes || [];
(function () {
  const R = String.raw;
  EM.quizzes.push({
    id: 'hw2', mark: 'H', title: 'Homework #2', short: 'HW2',
    meta: '공학수학2 · 푸리에 해석(교재 11.5–11.10) · 세 문제, 아홉 문항',
    intro: R`
두 번째 과제는 푸리에 해석의 뒷부분입니다. **1번**은 삼각함수 대신 르장드르 다항식을 직교기저로 쓰는 급수, **2번**은 교재 연습문제 다섯 개(스투름-리우빌 문제 1, 푸리에 적분 2, 푸리에 변환 2), **3번**은 변환표의 세 줄을 증명하는 문제입니다. 2번과 3번은 문항마다 따로 정리했습니다.

세 문제를 꿰는 생각은 하나입니다. **직교하는 함수들에 대한 좌표는 내적 ÷ 노름제곱**(17단원 §3.2)이고, 주기가 무한대로 가면 그 좌표가 진동수 $w$의 함수, 곧 푸리에 적분의 $A(w)$, $B(w)$와 변환 $\hat f(w)$가 됩니다.

:::tip 답안 작성의 공통 원칙
1. **규약을 먼저 적는다.** 이 과목(Kreyszig)의 변환은
$$\hat f_c(w)=\sqrt{\tfrac2\pi}\int_0^\infty f(x)\cos wx\,dx,\qquad\hat f_s(w)=\sqrt{\tfrac2\pi}\int_0^\infty f(x)\sin wx\,dx,\qquad\hat f(w)=\tfrac1{\sqrt{2\pi}}\int_{-\infty}^\infty f(x)e^{-iwx}dx.$$
상수 $\sqrt{2/\pi}$, $1/\sqrt{2\pi}$와 지수의 부호가 틀리면 답 전체가 틀립니다.
2. **고유값 문제는 세 경우**($\lambda\lt0$, $\lambda=0$, $\lambda\gt0$)를 모두 처리한다.
3. **정적분을 푸리에 적분으로 보이는 문제**는 ① 피적분함수의 $\cos xw$/$\sin xw$로 코사인·사인 적분 중 하나를 고르고 ② 오른쪽 값으로 $f$를 정하고 ③ $A(w)$ 또는 $B(w)$를 계산하고 ④ 존재 정리의 조건과 **불연속점의 값(좌우 평균)**을 확인한다.
4. **변환 계산은 대칭부터.** 우함수면 사인 부분이 0, 기함수면 코사인 부분이 0. $w=0$처럼 식이 $\frac00$이 되는 점은 따로 쓴다.
5. **증명에서 극한을 바꾸는 곳**(적분 기호 아래 미분, 항별 적분)에는 근거(적분 가능한 지배 함수)를 한 줄 쓴다.
:::
`,
    problems: [
      { id: 'p1', label: '문제 1', title: '1 + x + x² + x³ + x⁴의 푸리에-르장드르 급수', where: '직교급수 · 푸리에-르장드르 급수', secs: ['ch10:11.6', 'ch10:11.5', 'ch04:5.2', 'ch17:3.2'],
        body: R`
:::def 문제
$n=0,1,2,3,4$일 때의 르장드르 다항식 $P_n(x)$를 적고, $f(x)=1+x+x^2+x^3+x^4$의 푸리에-르장드르 급수를 다음 두 가지 방법으로 구하시오.

(a) $f(x)$를 $P_0(x),P_1(x),P_2(x),P_3(x),P_4(x)$의 일차결합으로 나타내어

(b) 적분으로 정의된 내적을 이용하여 (교재 참조)
:::

:::key 핵심 포인트
- 다섯 개의 르장드르 다항식:
$$P_0=1,\qquad P_1=x,\qquad P_2=\tfrac12(3x^2-1),$$
$$P_3=\tfrac12(5x^3-3x),\qquad P_4=\tfrac18(35x^4-30x^2+3).$$
로드리게스 공식 $P_n=\frac1{2^nn!}\frac{d^n}{dx^n}(x^2-1)^n$이나 점화식 $(n+1)P_{n+1}=(2n+1)xP_n-nP_{n-1}$로 만들 수 있고, $P_n(1)=1$로 검산합니다.
- **(a)** 높은 차수부터 거꾸로 풉니다. $x^4$를 $P_4$로 바꾸면 $x^2$과 상수가 남고, 그것을 다시 $P_2$, $P_0$으로 바꿉니다. 결과만 모으면
$$x^2=\tfrac13\big(2P_2+P_0\big),\qquad x^3=\tfrac15\big(2P_3+3P_1\big),\qquad x^4=\tfrac1{35}\big(8P_4+20P_2+7P_0\big).$$
- **(b)** 내적 $\langle f,g\rangle=\int_{-1}^1fg\,dx$에서 $\|P_m\|^2=\frac2{2m+1}$이므로 (교재 §11.6)
$$a_m=\frac{\langle f,P_m\rangle}{\|P_m\|^2}=\frac{2m+1}2\int_{-1}^1f(x)P_m(x)\,dx.$$
$P_m$은 $m$이 짝수면 우함수, 홀수면 기함수이므로 **짝수 $m$에는 $f$의 짝수 부분 $1+x^2+x^4$만, 홀수 $m$에는 홀수 부분 $x+x^3$만** 남습니다. 필요한 적분은 $\int_{-1}^1x^kdx=\frac2{k+1}$ ($k$ 짝수)뿐입니다.
- **두 방법이 같은 답을 주는 이유**: $\{P_0,\dots,P_4\}$는 4차 이하 다항식 공간 $\mathcal P_4$의 직교기저이고, 기저에 대한 좌표는 유일합니다(17단원 §3.2 ①의 직교기저에 대한 전개). 또 $m\ge5$이면 $P_m$이 4차 이하의 모든 다항식과 직교하므로 $a_m=0$, 곧 **급수가 다섯 항에서 끝나고 $f$와 정확히 같습니다.**
:::

:::ex 풀이
(a)는 다항식 나눗셈처럼 위에서부터, (b)는 대칭으로 지울 항을 먼저 지우고 적분합니다.
---
**르장드르 다항식.**
$$P_0=1,\qquad P_1=x,\qquad P_2=\tfrac12(3x^2-1),$$
$$P_3=\tfrac12(5x^3-3x),\qquad P_4=\tfrac18(35x^4-30x^2+3).$$
(로드리게스 공식으로 $P_4$ 확인: $(x^2-1)^4=x^8-4x^6+6x^4-4x^2+1$을 네 번 미분하면 $1680x^4-1440x^2+144$이고, $2^4\cdot4!=384$로 나누면 $\frac{35x^4-30x^2+3}8$.)

**(a) 일차결합으로.** $1=P_0$, $x=P_1$이고, 각 $P_n$의 식을 최고차항에 대해 풀면
- $x^2=\frac{2P_2+1}3=\frac23P_2+\frac13P_0$
- $x^3=\frac{2P_3+3x}5=\frac25P_3+\frac35P_1$
- $x^4=\frac{8P_4+30x^2-3}{35}=\frac8{35}P_4+\frac67x^2-\frac3{35}=\frac8{35}P_4+\frac47P_2+\Big(\frac27-\frac3{35}\Big)P_0=\frac8{35}P_4+\frac47P_2+\frac15P_0$

$P_n$별로 모으면
- $P_0$: $1+\frac13+\frac15=\frac{23}{15}$, $P_1$: $1+\frac35=\frac85$, $P_2$: $\frac23+\frac47=\frac{26}{21}$, $P_3$: $\frac25$, $P_4$: $\frac8{35}$

$$f(x)=\frac{23}{15}P_0(x)+\frac85P_1(x)+\frac{26}{21}P_2(x)+\frac25P_3(x)+\frac8{35}P_4(x).$$

**(b) 내적으로.** $a_m=\frac{2m+1}2\int_{-1}^1fP_m\,dx$이고 대칭인 구간에서 기함수의 적분은 0이다.
- $a_0=\frac12\int_{-1}^1(1+x^2+x^4)\,dx=\frac12\Big(2+\frac23+\frac25\Big)=\frac{23}{15}$
- $a_1=\frac32\int_{-1}^1(x+x^3)\,x\,dx=\frac32\Big(\frac23+\frac25\Big)=\frac32\cdot\frac{16}{15}=\frac85$
- $a_2=\frac52\int_{-1}^1(1+x^2+x^4)\cdot\frac{3x^2-1}2\,dx=\frac54\int_{-1}^1\big(-1+2x^2+2x^4+3x^6\big)dx=\frac54\Big(-2+\frac43+\frac45+\frac67\Big)=\frac54\cdot\frac{104}{105}=\frac{26}{21}$
- $a_3=\frac72\int_{-1}^1(x+x^3)\cdot\frac{5x^3-3x}2\,dx=\frac74\int_{-1}^1\big(-3x^2+2x^4+5x^6\big)dx=\frac74\Big(-2+\frac45+\frac{10}7\Big)=\frac74\cdot\frac8{35}=\frac25$
- $a_4$: $1=P_0$와 $x^2=\frac13(2P_2+P_0)$은 $P_4$와 직교하므로 $x^4$항만 남는다.
$$a_4=\frac92\int_{-1}^1x^4\cdot\frac{35x^4-30x^2+3}8\,dx=\frac9{16}\Big(\frac{70}9-\frac{60}7+\frac65\Big)=\frac9{16}\cdot\frac{128}{315}=\frac8{35}$$
- $m\ge5$: $f\in\mathcal P_4=\operatorname{span}\{P_0,\dots,P_4\}$이고 $P_m$은 $P_0,\dots,P_4$와 직교하므로 $a_m=\langle f,P_m\rangle/\|P_m\|^2=0$.

따라서 푸리에-르장드르 급수는 (a)와 같은 유한합이다.
$$1+x+x^2+x^3+x^4=\frac{23}{15}P_0+\frac85P_1+\frac{26}{21}P_2+\frac25P_3+\frac8{35}P_4\qquad(-1\le x\le1)$$

**검산.** $P_n(1)=1$이므로 $x=1$에서 $\frac{161+168+130+42+24}{105}=\frac{525}{105}=5=f(1)$ ✓. $P_n(-1)=(-1)^n$이므로 $x=-1$에서 $\frac{161-168+130-42+24}{105}=1=f(-1)$ ✓. 최고차항: $\frac8{35}\cdot\frac{35}8=1$ ✓.
:::

:::fig f10hw2leg
:::

:::warn 자주 하는 실수
- (b)에서 $\frac{2m+1}2$를 빠뜨리는 것. 그러면 $a_0=\frac{46}{15}$처럼 노름제곱 배만큼 틀립니다. 계수 = 내적 **÷ 노름제곱**입니다.
- (a)에서 $x^4$를 바꾼 뒤 남은 $\frac67x^2$을 다시 $P_2$, $P_0$으로 바꾸지 않는 것.
- (b)에서 대칭을 쓰지 않고 열 개 남짓한 항을 모두 적분하다가 계산 실수를 하는 것.
- “급수”이니 $a_5,a_6,\dots$도 있다고 쓰거나, 근거 없이 다섯 항에서 멈추는 것. **$m\ge5$이면 직교성 때문에 0**이라고 한 줄 써야 합니다.
:::

### 더 알아보기: 부분합은 최선 근사
부분합 $S_N=\sum_{m=0}^Na_mP_m$은 $f$를 $\mathcal P_N$에 정사영한 것이므로, $N$차 이하 다항식 중 $\int_{-1}^1(f-p)^2dx$를 가장 작게 하는 다항식입니다(17단원 §3.2 ②). 예를 들어 $f$에 가장 가까운 2차다항식은
$$S_2=\frac{23}{15}+\frac85x+\frac{26}{21}\cdot\frac{3x^2-1}2=\frac{32}{35}+\frac85x+\frac{13}7x^2$$
로, 테일러식으로 잘라 낸 $1+x+x^2$과 다릅니다. 이 내적으로 재면 $x^3$에 가장 가까운 1차식은 $\frac35x$, $x^4$에 가장 가까운 2차식은 $\frac67x^2-\frac3{35}$이고, 이것들을 $1+x+x^2$에 더하면 같은 $S_2$가 나옵니다.
` },
      { id: 'p2a', label: '문제 2-1', title: 'y″ − 2y′ + (λ + 1)y = 0의 고유값과 고유함수', where: '교재 11.5 #12 · 스투름-리우빌 문제', secs: ['ch10:11.5', 'ch02:2.2'],
        body: R`
:::def 문제
(교재 11.5절 연습문제 12) 고유값과 고유함수를 구하고 직교성을 확인하시오. 먼저 연습문제 6을 이용해 방정식을 스투름-리우빌 꼴 $[py']'+[q+\lambda r]y=0$으로 쓰시오.
$$y''-2y'+(\lambda+1)y=0,\qquad y(0)=0,\quad y(1)=0$$
:::

:::key 핵심 포인트
- **스투름-리우빌 꼴로**: $y''+fy'+(g+\lambda h)y=0$이면 $p=e^{\int f\,dx}$를 곱해 $q=pg$, $r=ph$(연습문제 6). 여기서는 $f=-2$, $g=h=1$이므로 $p=q=r=e^{-2x}$:
$$\big[e^{-2x}y'\big]'+\big[e^{-2x}+\lambda e^{-2x}\big]y=0.$$
- 왜 바꾸는가: **가중함수 $r=e^{-2x}$**가 직교성의 내적을 정해 주기 때문입니다. 고유함수는 $\int_0^1y_my_n\,dx$가 아니라 $\int_0^1e^{-2x}y_my_n\,dx$에 대해 직교합니다.
- 특성방정식 $\mu^2-2\mu+(\lambda+1)=0$의 근 $\mu=1\pm\sqrt{-\lambda}$. $\lambda$의 부호로 세 경우를 나눕니다. $\lambda\le0$이면 자명한 해뿐이고, $\lambda=k^2\gt0$이면 $y=e^x(A\cos kx+B\sin kx)$.
- 답: $\lambda_n=n^2\pi^2$, $y_n=e^x\sin n\pi x$ ($n=1,2,\dots$). 가중 내적에서 $e^{-2x}\cdot e^x\cdot e^x=1$이라 직교성이 $\int_0^1\sin m\pi x\sin n\pi x\,dx=0$으로 바뀝니다.
:::

:::ex 풀이
세 경우를 차례로 확인하고, 마지막에 가중 내적을 계산합니다.
---
**스투름-리우빌 꼴.** $p=e^{\int(-2)dx}=e^{-2x}$를 곱하면 $p'=-2p$이므로 $e^{-2x}(y''-2y')=\big[e^{-2x}y'\big]'$이고
$$\big[e^{-2x}y'\big]'+\big[e^{-2x}+\lambda e^{-2x}\big]y=0,\qquad p=e^{-2x},\ q=e^{-2x},\ r=e^{-2x}\gt0.$$
경계조건 $y(0)=0$, $y(1)=0$은 $k_2=l_2=0$인 경우다.

특성방정식 $\mu^2-2\mu+(\lambda+1)=0$에서 $\mu=1\pm\sqrt{-\lambda}$.

**$\lambda\lt0$.** $\lambda=-k^2$ ($k\gt0$)이면 $\mu=1\pm k$이고 $y=e^x\big(c_1e^{kx}+c_2e^{-kx}\big)$. $y(0)=c_1+c_2=0$이므로 $y=c_1e^x(e^{kx}-e^{-kx})=2c_1e^x\sinh kx$. $y(1)=2c_1e\sinh k=0$이고 $\sinh k\ne0$이므로 $c_1=0$. 자명한 해뿐이다.

**$\lambda=0$.** $\mu=1$ (중근)이고 $y=(c_1+c_2x)e^x$. $y(0)=c_1=0$, $y(1)=c_2e=0$에서 $c_2=0$. 자명한 해뿐이다.

**$\lambda\gt0$.** $\lambda=k^2$ ($k\gt0$)이면 $\mu=1\pm ik$이고 $y=e^x(A\cos kx+B\sin kx)$. $y(0)=A=0$. $y(1)=Be\sin k=0$에서 $B\ne0$이려면 $\sin k=0$, 곧 $k=n\pi$ ($n=1,2,\dots$).

따라서
$$\lambda_n=n^2\pi^2,\qquad y_n(x)=e^x\sin n\pi x\qquad(n=1,2,3,\dots)$$
(상수배는 자유).

**직교성.** 가중함수 $r=e^{-2x}$에 대해 $m\ne n$이면
$$(y_m,y_n)=\int_0^1e^{-2x}\,e^x\sin m\pi x\,e^x\sin n\pi x\,dx=\int_0^1\sin m\pi x\sin n\pi x\,dx=\frac12\int_0^1\big[\cos(m-n)\pi x-\cos(m+n)\pi x\big]dx=0$$
($m\pm n$은 0이 아닌 정수이므로 $\sin(m\pm n)\pi=0$). 스투름-리우빌 정리(교재 11.5 Theorem 1)가 보장하는 대로 직교한다. 덧붙여 $\|y_n\|^2=\int_0^1\sin^2n\pi x\,dx=\frac12$이므로 $\sqrt2\,e^x\sin n\pi x$는 정규직교계다.

**검산.** $y=e^x\sin\pi x$이면 $y'=e^x(\sin\pi x+\pi\cos\pi x)$, $y''=e^x\big((1-\pi^2)\sin\pi x+2\pi\cos\pi x\big)$이고
$$y''-2y'+(\pi^2+1)y=e^x\big[(1-\pi^2-2+\pi^2+1)\sin\pi x+(2\pi-2\pi)\cos\pi x\big]=0\ ✓$$
:::

:::idea 더 짧은 길: y = eˣu로 치환
$y=e^xu$로 두면 $y'=e^x(u+u')$, $y''=e^x(u+2u'+u'')$이므로
$$y''-2y'+(\lambda+1)y=e^x\big(u''+\lambda u\big).$$
문제는 $u''+\lambda u=0$, $u(0)=u(1)=0$이 되어 §11.5 예제 1과 같은 계산으로 $\lambda=n^2\pi^2$, $u=\sin n\pi x$입니다. 가중함수 $e^{-2x}$는 바로 이 치환의 $e^x$ 두 개를 지우는 역할을 합니다.
:::

:::warn 자주 하는 실수
- **가중함수 없이** $\int_0^1y_my_n\,dx$로 직교성을 확인하는 것. 예를 들어 $\int_0^1e^{2x}\sin\pi x\sin2\pi x\,dx\approx-0.514\ne0$이라 “직교하지 않는다”는 틀린 결론이 나옵니다.
- $p=e^{-2x}$를 곱한 뒤 $q$, $r$에도 $p$를 곱해야 한다는 것을 잊고 $r=1$로 쓰는 것.
- $\lambda\lt0$, $\lambda=0$의 경우를 빼먹는 것. 채점에서 가장 자주 깎이는 부분입니다.
- 근을 $\mu=-1\pm\cdots$로 잘못 구해 $e^{-x}\sin n\pi x$로 쓰는 것. $y'$의 계수가 $-2$이므로 실수부는 $+1$입니다.
- $n=0$을 넣는 것. $\sin0=0$이라 고유함수가 아닙니다.
:::
` },
      { id: 'p2b', label: '문제 2-2', title: '코사인 적분으로 보이는 정적분 (cos x 한 봉우리)', where: '교재 11.7 #4 · 푸리에 코사인 적분', secs: ['ch10:11.7'],
        body: R`
:::def 문제
(교재 11.7절 연습문제 4) 적분이 주어진 함수를 나타냄을 보이시오.
$$\int_0^\infty\frac{\cos\frac{\pi w}2}{1-w^2}\cos xw\,dw=\begin{cases}\dfrac\pi2\cos x&0\lt\lvert x\rvert\lt\dfrac\pi2\\[4pt]0&\lvert x\rvert\ge\dfrac\pi2\end{cases}$$
:::

:::key 핵심 포인트
- **어느 표현인가**: 피적분함수에 $\cos xw$만 있으므로 **푸리에 코사인 적분**
$$f(x)=\int_0^\infty A(w)\cos xw\,dw,\qquad A(w)=\frac2\pi\int_0^\infty f(v)\cos wv\,dv.$$
- **어떤 함수인가**: 값을 $\frac\pi2$로 나눈 것, 곧 $f(x)=\cos x$ ($\lvert x\rvert\lt\frac\pi2$), $0$ ($\lvert x\rvert\ge\frac\pi2$). 우함수이고 한 봉우리 모양입니다.
- $A(w)$는 곱을 합으로 $\cos v\cos wv=\frac12[\cos(1-w)v+\cos(1+w)v]$ 바꿔 적분하고, $\sin\big(\frac\pi2\pm\frac{\pi w}2\big)=\cos\frac{\pi w}2$를 쓰면
$$A(w)=\frac2\pi\cdot\frac{\cos\frac{\pi w}2}{1-w^2}.$$
- 그러면 $f(x)=\frac2\pi\int_0^\infty\frac{\cos\frac{\pi w}2}{1-w^2}\cos xw\,dw$이고, 양변에 $\frac\pi2$를 곱하면 끝입니다.
- **값을 확인할 점**: $f$는 $\lvert x\rvert=\frac\pi2$에서도 연속($\cos\frac\pi2=0$)이므로 푸리에 적분은 **모든 $x$에서** $f(x)$입니다. $w=1$은 겉보기 특이점일 뿐 극한이 $\frac\pi4$로 유한합니다.
:::

:::ex 풀이
$f$를 정하고 $A(w)$를 계산한 뒤, 존재 정리로 등호를 정당화합니다.
---
$$f(x)=\begin{cases}\cos x&\lvert x\rvert\lt\frac\pi2\\0&\lvert x\rvert\ge\frac\pi2\end{cases}$$
로 두자. $f$는 우함수이고, 연속이며 구간별로 매끄럽고, $\int_{-\infty}^\infty\lvert f\rvert dx=2\lt\infty$이다.

**$A(w)$ ($w\ne1$).**
$$A(w)=\frac2\pi\int_0^{\pi/2}\cos v\cos wv\,dv=\frac1\pi\int_0^{\pi/2}\big[\cos(1-w)v+\cos(1+w)v\big]dv=\frac1\pi\left[\frac{\sin\frac{(1-w)\pi}2}{1-w}+\frac{\sin\frac{(1+w)\pi}2}{1+w}\right].$$
$\sin\big(\frac\pi2-\frac{\pi w}2\big)=\sin\big(\frac\pi2+\frac{\pi w}2\big)=\cos\frac{\pi w}2$이므로
$$A(w)=\frac1\pi\cos\frac{\pi w}2\Big(\frac1{1-w}+\frac1{1+w}\Big)=\frac2\pi\cdot\frac{\cos\frac{\pi w}2}{1-w^2}.$$
**$w=1$.** $A(1)=\frac2\pi\int_0^{\pi/2}\cos^2v\,dv=\frac2\pi\cdot\frac\pi4=\frac12$이고, 위 식의 $w\to1$ 극한도 로피탈 정리로 $\frac2\pi\cdot\frac{(\pi/2)\sin(\pi/2)}{2}=\frac12$이므로 같은 식이 $w=1$에서도 (극한으로) 성립한다.

**결론.** 푸리에 적분의 존재 정리(교재 11.7 Theorem 1)에 의해, $f$가 연속인 모든 점에서
$$f(x)=\int_0^\infty A(w)\cos xw\,dw=\frac2\pi\int_0^\infty\frac{\cos\frac{\pi w}2}{1-w^2}\cos xw\,dw.$$
$f$는 모든 점에서 연속이므로 양변에 $\frac\pi2$를 곱하면
$$\int_0^\infty\frac{\cos\frac{\pi w}2}{1-w^2}\cos xw\,dw=\frac\pi2f(x)=\begin{cases}\frac\pi2\cos x&\lvert x\rvert\lt\frac\pi2\\0&\lvert x\rvert\ge\frac\pi2\end{cases}\qquad\blacksquare$$
(문제는 $0\lt\lvert x\rvert$로 적었지만 $x=0$에서도 성립하여 $\int_0^\infty\frac{\cos(\pi w/2)}{1-w^2}dw=\frac\pi2$이다.)

**수치 검산.** 상한을 $400$으로 잘라 수치적분하면 $x=0.5$에서 $1.378502$ (참값 $\frac\pi2\cos0.5=1.378503$), $x=2$에서 $-0.000007$ (참값 0).
:::

:::fig f10hw2ci
:::

:::warn 자주 하는 실수
- $f$를 $\frac\pi2\cos x$로 잡고 계산해 마지막에 $\frac\pi2$를 한 번 더 곱하는 것. **값 = (상수) × $f$** 에서 상수를 어디서 나눌지 처음에 정해 두세요.
- 곱을 합으로 바꿀 때 $\cos(1-w)v$와 $\cos(w-1)v$를 다른 것으로 보고 부호를 틀리는 것(코사인은 우함수라 같습니다). 반면 $\frac{\sin((1-w)\pi/2)}{1-w}$에서 분모와 분자의 부호는 같이 움직여야 합니다.
- $w=1$에서 분모가 0이라 “적분이 발산한다”고 쓰는 것. 분자도 0이 되어 피적분함수는 유한합니다.
- $\lvert x\rvert=\frac\pi2$에서 좌우 평균을 따지는 것. $f$가 거기서 연속이라 평균을 쓸 필요가 없습니다(평균을 써도 0으로 같음).
:::
` },
      { id: 'p2c', label: '문제 2-3', title: '사인 적분으로 보이는 정적분 (e⁻ˣ cos x)', where: '교재 11.7 #6 · 푸리에 사인 적분', secs: ['ch10:11.7', 'ch10:11.8'],
        body: R`
:::def 문제
(교재 11.7절 연습문제 6) 적분이 주어진 함수를 나타냄을 보이시오.
$$\int_0^\infty\frac{w^3\sin xw}{w^4+4}\,dw=\frac\pi2e^{-x}\cos x\qquad(x\gt0)$$
:::

:::key 핵심 포인트
- $\sin xw$이므로 **푸리에 사인 적분**, $f(x)=e^{-x}\cos x$ ($x\gt0$)를 기함수로 확장한 것입니다.
$$f(x)=\int_0^\infty B(w)\sin xw\,dw,\qquad B(w)=\frac2\pi\int_0^\infty f(v)\sin wv\,dv.$$
- $B(w)$의 열쇠는 곱을 합으로: $\cos v\sin wv=\frac12\big[\sin(w+1)v+\sin(w-1)v\big]$와 라플라스 적분(§11.7 예제 2)
$$\int_0^\infty e^{-v}\sin sv\,dv=\frac{s}{1+s^2}\qquad(s\text{는 모든 실수}).$$
- 두 분모의 곱이 깔끔하게 $(w^2+2w+2)(w^2-2w+2)=(w^2+2)^2-4w^2=w^4+4$, 분자의 합은 $2w^3$입니다.
- **왜 $x\gt0$만인가**: 기함수 확장은 $x=0$에서 $-1$에서 $1$로 뛰므로 적분은 $x=0$에서 평균 $0$을 나타냅니다. $x\lt0$에서는 $-\frac\pi2e^{x}\cos x$입니다.
:::

:::ex 풀이
$B(w)$를 구하면 나머지는 2-2와 같습니다.
---
$f(x)=e^{-x}\cos x$ ($x\gt0$)로 두고 기함수로 확장한다. $\lvert f\rvert\le e^{-\lvert x\rvert}$이므로 절대 적분 가능하고, 확장은 $x=0$을 빼면 연속이며 구간별로 매끄럽다.

**$B(w)$.** 곱을 합으로 바꾸면
$$\int_0^\infty e^{-v}\cos v\sin wv\,dv=\frac12\int_0^\infty e^{-v}\big[\sin(w+1)v+\sin(w-1)v\big]dv=\frac12\left[\frac{w+1}{1+(w+1)^2}+\frac{w-1}{1+(w-1)^2}\right].$$
분모는 $1+(w\pm1)^2=w^2\pm2w+2$이고 그 곱은 $(w^2+2)^2-(2w)^2=w^4+4$. 통분한 분자는
$$(w+1)(w^2-2w+2)+(w-1)(w^2+2w+2)=(w^3-w^2+2)+(w^3+w^2-2)=2w^3.$$
따라서
$$\int_0^\infty e^{-v}\cos v\sin wv\,dv=\frac{w^3}{w^4+4},\qquad B(w)=\frac2\pi\cdot\frac{w^3}{w^4+4}.$$

**결론.** 존재 정리에 의해 $f$가 연속인 점, 곧 $x\gt0$에서
$$e^{-x}\cos x=\int_0^\infty B(w)\sin xw\,dw=\frac2\pi\int_0^\infty\frac{w^3\sin xw}{w^4+4}\,dw$$
이고, 양변에 $\frac\pi2$를 곱하면
$$\int_0^\infty\frac{w^3\sin xw}{w^4+4}\,dw=\frac\pi2e^{-x}\cos x\qquad(x\gt0)\qquad\blacksquare$$

**참고.** $x=0$에서는 $\sin0=0$이라 적분이 0이고, 이는 도약 $-1\to1$의 평균과 맞는다. 피적분함수는 $w\to\infty$에서 $\frac{\sin xw}w$처럼 줄어 절대수렴하지는 않지만(조건수렴), 존재 정리는 그대로 적용된다.

**수치 검산.** $\frac{w^3}{w^4+4}=\frac1w-\frac4{w(w^4+4)}$와 $\int_0^\infty\frac{\sin xw}w\,dw=\frac\pi2$를 써서 절대수렴하는 적분으로 바꿔 계산하면 $x=1$에서 $0.312221$, 참값 $\frac\pi2e^{-1}\cos1=0.312221$ ✓.
:::

:::warn 자주 하는 실수
- 코사인 적분을 쓰는 것. 결과 식에 $\sin xw$가 있으면 사인 적분입니다.
- 곱을 합으로 바꾸는 공식의 부호: $\cos A\sin B=\frac12[\sin(A+B)-\sin(A-B)]$이므로 $\cos v\sin wv=\frac12[\sin(w+1)v-\sin(1-w)v]=\frac12[\sin(w+1)v+\sin(w-1)v]$. 둘째 항을 $\sin(1-w)v$로 쓰고 부호를 놓치기 쉽습니다.
- 라플라스 적분을 $\frac1{1+s^2}$로 쓰는 것. 사인은 $\frac s{1+s^2}$, 코사인이 $\frac1{1+s^2}$입니다.
- “$x\gt0$”의 이유(기함수 확장의 불연속)를 설명하지 않는 것.
:::
` },
      { id: 'p2d', label: '문제 2-4', title: '(−a, a)에서 eˣ인 함수의 푸리에 변환', where: '교재 11.9 #5 · 푸리에 변환 (적분으로)', secs: ['ch10:11.9'],
        body: R`
:::def 문제
(교재 11.9절 연습문제 5) 다음 함수의 푸리에 변환을 (11.10절 표 III을 쓰지 않고) 구하시오. 풀이 과정을 보이시오.
$$f(x)=\begin{cases}e^x&-a\lt x\lt a\\0&\text{그 밖}\end{cases}$$
:::

:::key 핵심 포인트
- 정의에 그대로 넣습니다: $\hat f(w)=\frac1{\sqrt{2\pi}}\int_{-a}^ae^xe^{-iwx}dx=\frac1{\sqrt{2\pi}}\int_{-a}^ae^{(1-iw)x}dx$.
- 지수를 하나로 합치면 실수 지수처럼 적분됩니다: $\int e^{cx}dx=\frac{e^{cx}}c$ ($c=1-iw\ne0$).
- 결과
$$\hat f(w)=\frac{e^{(1-iw)a}-e^{-(1-iw)a}}{\sqrt{2\pi}\,(1-iw)}=\sqrt{\frac2\pi}\,\frac{\sinh\big((1-iw)a\big)}{1-iw}.$$
- $f$는 우함수도 기함수도 아니므로 $\hat f$는 일반적으로 **복소수**입니다. 실수부·허수부로 정리할 수도 있습니다.
:::

:::ex 풀이
지수를 합쳐 한 번에 적분합니다.
---
$f$는 유계이고 유한 구간 밖에서 0이므로 절대 적분 가능하고, 변환이 존재한다.
$$\hat f(w)=\frac1{\sqrt{2\pi}}\int_{-a}^ae^xe^{-iwx}dx=\frac1{\sqrt{2\pi}}\int_{-a}^ae^{(1-iw)x}dx=\frac1{\sqrt{2\pi}}\left[\frac{e^{(1-iw)x}}{1-iw}\right]_{-a}^{a}$$
$1-iw\ne0$ (실수부가 1)이므로 모든 실수 $w$에서
$$\hat f(w)=\frac{e^{(1-iw)a}-e^{-(1-iw)a}}{\sqrt{2\pi}\,(1-iw)}=\frac{e^{a}e^{-iaw}-e^{-a}e^{iaw}}{\sqrt{2\pi}\,(1-iw)}.$$
$\sinh z=\frac{e^z-e^{-z}}2$로 쓰면 $\hat f(w)=\sqrt{\frac2\pi}\,\frac{\sinh(a-iaw)}{1-iw}$.

**실수부·허수부.** $\sinh(a-iaw)=\sinh a\cos aw-i\cosh a\sin aw$이고 $\frac1{1-iw}=\frac{1+iw}{1+w^2}$이므로
$$\hat f(w)=\sqrt{\frac2\pi}\,\frac{\big(\sinh a\cos aw+w\cosh a\sin aw\big)+i\big(w\sinh a\cos aw-\cosh a\sin aw\big)}{1+w^2}.$$

**검산.** ① $w=0$: $\hat f(0)=\frac1{\sqrt{2\pi}}\int_{-a}^ae^xdx=\frac{e^a-e^{-a}}{\sqrt{2\pi}}$이고 공식도 같다 ✓. ② 수치: $a=1$, $w=0.7$에서 직접 수치적분과 공식 모두 $0.853950-0.195396i$ ✓. ③ 표 III의 6번($e^{\alpha x}$, $b\lt x\lt c$)에 $\alpha=1$, $b=-a$, $c=a$를 넣은 것과 같다.
:::

:::warn 자주 하는 실수
- 지수 부호를 $e^{+iwx}$로 쓰는 것. 변환은 $e^{-iwx}$, 역변환이 $e^{+iwx}$입니다.
- 분모를 $1+iw$로 쓰는 것. $e^x\cdot e^{-iwx}=e^{(1-iw)x}$입니다.
- $\frac1{\sqrt{2\pi}}$를 빠뜨리거나 $\sqrt{\frac2\pi}$와 섞는 것. $\sqrt{\frac2\pi}$는 $\sinh$로 묶을 때 나오는 $2$를 합친 결과입니다.
- 우함수처럼 코사인 부분만 계산하는 것. $e^x$는 대칭이 없습니다.
:::
` },
      { id: 'p2e', label: '문제 2-5', title: '(−1, 1)에서 |x|인 함수의 푸리에 변환', where: '교재 11.9 #9 · 푸리에 변환 (우함수)', secs: ['ch10:11.9', 'ch10:11.8'],
        body: R`
:::def 문제
(교재 11.9절 연습문제 9) 다음 함수의 푸리에 변환을 (11.10절 표 III을 쓰지 않고) 구하시오. 풀이 과정을 보이시오.
$$f(x)=\begin{cases}\lvert x\rvert&-1\lt x\lt1\\0&\text{그 밖}\end{cases}$$
:::

:::key 핵심 포인트
- $f$는 **우함수**: $e^{-iwx}=\cos wx-i\sin wx$에서 사인 부분의 적분은 0이고, 코사인 부분은 $2\int_0^1$입니다.
$$\hat f(w)=\frac2{\sqrt{2\pi}}\int_0^1x\cos wx\,dx=\sqrt{\frac2\pi}\int_0^1x\cos wx\,dx.$$
즉 우함수의 푸리에 변환은 코사인 변환과 같습니다.
- 부분적분 한 번: $\int_0^1x\cos wx\,dx=\frac{\sin w}w+\frac{\cos w-1}{w^2}$.
- 결과 $\hat f(w)=\sqrt{\frac2\pi}\,\frac{w\sin w+\cos w-1}{w^2}$ ($w\ne0$), $\hat f(0)=\frac1{\sqrt{2\pi}}$. 실수값 우함수입니다.
:::

:::ex 풀이
대칭으로 반으로 줄이고 부분적분합니다.
---
$f$는 유계이고 $[-1,1]$ 밖에서 0이므로 변환이 존재한다. $e^{-iwx}=\cos wx-i\sin wx$이고 $f(x)\sin wx$는 기함수, $f(x)\cos wx$는 우함수이므로
$$\hat f(w)=\frac1{\sqrt{2\pi}}\int_{-1}^1\lvert x\rvert\cos wx\,dx-\frac i{\sqrt{2\pi}}\int_{-1}^1\lvert x\rvert\sin wx\,dx=\frac2{\sqrt{2\pi}}\int_0^1x\cos wx\,dx.$$
**$w\ne0$.** $u=x$, $dv=\cos wx\,dx$로 부분적분하면
$$\int_0^1x\cos wx\,dx=\Big[\frac{x\sin wx}w\Big]_0^1-\frac1w\int_0^1\sin wx\,dx=\frac{\sin w}w+\frac{\cos w-1}{w^2}.$$
따라서
$$\hat f(w)=\sqrt{\frac2\pi}\left(\frac{\sin w}w+\frac{\cos w-1}{w^2}\right)=\sqrt{\frac2\pi}\,\frac{w\sin w+\cos w-1}{w^2}.$$
**$w=0$.** $\hat f(0)=\frac1{\sqrt{2\pi}}\int_{-1}^1\lvert x\rvert dx=\frac1{\sqrt{2\pi}}$. 위 식의 극한도 $w\sin w+\cos w-1=\frac{w^2}2+O(w^4)$이므로 $\sqrt{\frac2\pi}\cdot\frac12=\frac1{\sqrt{2\pi}}$로 같다(연속).

**검산.** $w=1.3$에서 직접 수치적분 $0.245562$, 공식 $0.245562$ ✓. 또 같은 구간의 상수 1의 변환 $\sqrt{\frac2\pi}\frac{\sin w}w$에서 이 결과를 빼면 삼각형 $1-\lvert x\rvert$의 변환 $\sqrt{\frac2\pi}\frac{1-\cos w}{w^2}$이 나오는데, 이것은 따로 계산한 값과 일치한다(선형성).
:::

:::warn 자주 하는 실수
- $\lvert x\rvert$를 $x$로 두고 $\int_{-1}^1$을 계산해 0을 얻는 것. 절댓값 때문에 $[-1,0]$과 $[0,1]$을 나누거나 대칭을 써야 합니다.
- 부분적분의 부호: $-\frac1w\int_0^1\sin wx\,dx=-\frac1w\cdot\frac{1-\cos w}w=\frac{\cos w-1}{w^2}$.
- $w=0$을 따로 쓰지 않는 것. 식이 $\frac00$ 꼴이 되므로 값(또는 극한)을 적어 주는 것이 좋습니다.
- 우함수인데 답에 허수부가 남아 있는 것. 우함수의 변환은 실수, 기함수의 변환은 순허수입니다.
:::
` },
      { id: 'p3a', label: '문제 3-1', title: 'e^(−x²/2)의 코사인 변환은 자기 자신', where: '교재 11.10 표 I #4 · 코사인 변환', secs: ['ch10:11.8', 'ch10:11.9'],
        body: R`
:::def 문제
(교재 11.10절 표 I의 4번) 다음을 증명하시오.
$$\mathcal F_c\big(e^{-x^2/2}\big)=e^{-w^2/2}$$
:::

:::key 핵심 포인트
- 보일 것: $I(w)=\int_0^\infty e^{-x^2/2}\cos wx\,dx=\sqrt{\frac\pi2}\,e^{-w^2/2}$. 그러면 $\hat f_c=\sqrt{\frac2\pi}I(w)=e^{-w^2/2}$.
- **방법 1 (미분방정식)**: $I$를 $w$로 미분하고 부분적분하면 $I'(w)=-wI(w)$. 이 1계 ODE의 해는 $I(w)=I(0)e^{-w^2/2}$이고, $I(0)$은 가우스 적분 $\int_0^\infty e^{-x^2/2}dx=\sqrt{\frac\pi2}$.
- 적분 기호 아래에서 미분하는 근거: $\big\lvert\frac\partial{\partial w}\big(e^{-x^2/2}\cos wx\big)\big\rvert=\lvert x\sin wx\rvert e^{-x^2/2}\le xe^{-x^2/2}$이고 이것이 $w$와 무관하게 적분 가능($\int_0^\infty xe^{-x^2/2}dx=1$).
- **방법 2 (거듭제곱급수)**: $\cos wx$를 급수로 펼쳐 항별 적분하면 $\int_0^\infty x^{2k}e^{-x^2/2}dx=(2k-1)!!\sqrt{\frac\pi2}$이고, $\frac{(2k-1)!!}{(2k)!}=\frac1{2^kk!}$이라 $e^{-w^2/2}$의 급수가 나옵니다.
:::

:::ex 풀이
가우스 적분을 먼저 준비하고, 방법 1로 증명합니다. 방법 2는 확인용입니다.
---
**보조정리 (가우스 적분).** $G=\int_{-\infty}^\infty e^{-x^2/2}dx$라 하면 극좌표로
$$G^2=\int_{-\infty}^\infty\int_{-\infty}^\infty e^{-(x^2+y^2)/2}dx\,dy=\int_0^{2\pi}\int_0^\infty e^{-r^2/2}r\,dr\,d\theta=2\pi\cdot\Big[-e^{-r^2/2}\Big]_0^\infty=2\pi.$$
$G\gt0$이므로 $G=\sqrt{2\pi}$이고, 우함수이므로 $\int_0^\infty e^{-x^2/2}dx=\sqrt{\frac\pi2}$.

**증명 (방법 1).** $I(w)=\int_0^\infty e^{-x^2/2}\cos wx\,dx$로 두자. 피적분함수의 $w$-편도함수는 $-xe^{-x^2/2}\sin wx$이고, 그 절댓값은 $w$와 무관한 적분 가능한 함수 $xe^{-x^2/2}$ 이하이므로 적분 기호 아래에서 미분할 수 있다:
$$I'(w)=-\int_0^\infty xe^{-x^2/2}\sin wx\,dx.$$
$u=\sin wx$, $dv=xe^{-x^2/2}dx$ ($v=-e^{-x^2/2}$)로 부분적분하면
$$\int_0^\infty xe^{-x^2/2}\sin wx\,dx=\Big[-e^{-x^2/2}\sin wx\Big]_0^\infty+w\int_0^\infty e^{-x^2/2}\cos wx\,dx=0+wI(w).$$
따라서 $I'(w)=-wI(w)$이다. 그러면
$$\frac d{dw}\Big(e^{w^2/2}I(w)\Big)=e^{w^2/2}\big(I'(w)+wI(w)\big)=0$$
이므로 $e^{w^2/2}I(w)$는 상수이고 그 값은 $I(0)=\sqrt{\frac\pi2}$이다. 곧 $I(w)=\sqrt{\frac\pi2}\,e^{-w^2/2}$이고
$$\mathcal F_c\big(e^{-x^2/2}\big)=\sqrt{\frac2\pi}\,I(w)=\sqrt{\frac2\pi}\sqrt{\frac\pi2}\,e^{-w^2/2}=e^{-w^2/2}.\qquad\blacksquare$$

**방법 2 (거듭제곱급수).** $J_k=\int_0^\infty x^{2k}e^{-x^2/2}dx$라 하면 부분적분($u=x^{2k-1}$, $dv=xe^{-x^2/2}dx$)으로 $J_k=(2k-1)J_{k-1}$, $J_0=\sqrt{\frac\pi2}$이므로 $J_k=(2k-1)!!\sqrt{\frac\pi2}$ ($(2k-1)!!=1\cdot3\cdots(2k-1)$, $(-1)!!=1$). $\sum_k\frac{\lvert wx\rvert^{2k}}{(2k)!}e^{-x^2/2}=\cosh(wx)\,e^{-x^2/2}$이 적분 가능하므로 항별 적분이 허용되고, $(2k)!=(2k-1)!!\cdot2^kk!$이므로
$$I(w)=\sum_{k=0}^\infty\frac{(-1)^kw^{2k}}{(2k)!}J_k=\sqrt{\frac\pi2}\sum_{k=0}^\infty\frac{(-1)^k}{k!}\Big(\frac{w^2}2\Big)^k=\sqrt{\frac\pi2}\,e^{-w^2/2}.$$

**수치 검산.** $w=1.5$에서 $\sqrt{2/\pi}\int_0^{40}e^{-x^2/2}\cos1.5x\,dx=0.3246525$, $e^{-1.125}=0.3246525$ ✓.
:::

:::fig f10hw2gauss
:::

:::warn 자주 하는 실수
- 근거 없이 적분 기호 아래에서 미분하는 것. 지배 함수 $xe^{-x^2/2}$를 한 줄 적으면 됩니다.
- 부분적분의 경계항 $\big[-e^{-x^2/2}\sin wx\big]_0^\infty$를 확인하지 않는 것($x=0$에서 $\sin0=0$, $x\to\infty$에서 $e^{-x^2/2}\to0$).
- $I(0)$을 $\sqrt{2\pi}$로 쓰는 것. 그것은 $(-\infty,\infty)$의 적분이고, $(0,\infty)$는 그 절반인 $\sqrt{\pi/2}$입니다.
- 제곱을 완성한 뒤 $x+iw$를 실수 변수처럼 치환하고 끝내는 것($-\frac{x^2}2-iwx=-\frac{(x+iw)^2}2-\frac{w^2}2$). 적분 경로를 실수축에서 허수부가 $w$인 직선으로 옮기는 것이므로 코시 적분 정리로 정당화해야 합니다[[ch13:14.2|코시 적분 정리: 해석함수의 닫힌 경로 적분은 0.]].
:::
` },
      { id: 'p3b', label: '문제 3-2', title: 'x·e^(−x²/2)의 사인 변환 = w·e^(−w²/2)', where: '교재 11.10 표 II #8 · 사인 변환', secs: ['ch10:11.8'],
        body: R`
:::def 문제
(교재 11.10절 표 II의 8번) 다음을 증명하시오.
$$\mathcal F_s\big(xe^{-x^2/2}\big)=we^{-w^2/2}$$
:::

:::key 핵심 포인트
- **방법 1 (도함수 공식)**: 교재 11.8의 $\mathcal F_s\{f'\}=-w\,\mathcal F_c\{f\}$를 $f=e^{-x^2/2}$에 쓰면, $f'=-xe^{-x^2/2}$이고 $\mathcal F_c\{f\}=e^{-w^2/2}$(문제 3-1)이므로 바로 나옵니다.
- 공식의 조건 확인: $f$가 연속, 절대 적분 가능, $f'$이 구간별 연속, $x\to\infty$에서 $f\to0$.
- **방법 2 (직접)**: 3-1의 부분적분에서 이미 $\int_0^\infty xe^{-x^2/2}\sin wx\,dx=wI(w)=w\sqrt{\frac\pi2}e^{-w^2/2}$을 얻었습니다.
- 결과적으로 $xe^{-x^2/2}$는 **사인 변환에 대해 자기 자신**입니다($e^{-x^2/2}$가 코사인 변환에 대해 그렇듯이).
:::

:::ex 풀이
도함수 공식 한 줄이 핵심이고, 조건을 확인하는 것이 증명의 절반입니다.
---
**방법 1.** $f(x)=e^{-x^2/2}$ ($x\ge0$)는 연속이고, $\int_0^\infty\lvert f\rvert dx=\sqrt{\frac\pi2}\lt\infty$, $f'(x)=-xe^{-x^2/2}$은 연속, $x\to\infty$에서 $f\to0$이다. 따라서 교재 11.8 Theorem 1의
$$\mathcal F_s\{f'(x)\}=-w\,\mathcal F_c\{f(x)\}$$
를 쓸 수 있다. (증명은 부분적분: $\sqrt{\frac2\pi}\int_0^\infty f'\sin wx\,dx=\sqrt{\frac2\pi}\big[f\sin wx\big]_0^\infty-w\sqrt{\frac2\pi}\int_0^\infty f\cos wx\,dx$, 경계항은 0.) 문제 3-1의 $\mathcal F_c\{e^{-x^2/2}\}=e^{-w^2/2}$을 넣으면
$$\mathcal F_s\big\{-xe^{-x^2/2}\big\}=-w\,e^{-w^2/2}.$$
사인 변환은 선형이므로 양변에 $-1$을 곱하면
$$\mathcal F_s\big(xe^{-x^2/2}\big)=we^{-w^2/2}.\qquad\blacksquare$$

**방법 2 (직접 계산).** 문제 3-1의 부분적분에서
$$\int_0^\infty xe^{-x^2/2}\sin wx\,dx=w\int_0^\infty e^{-x^2/2}\cos wx\,dx=w\sqrt{\frac\pi2}\,e^{-w^2/2}$$
이므로 $\mathcal F_s\big(xe^{-x^2/2}\big)=\sqrt{\frac2\pi}\cdot w\sqrt{\frac\pi2}\,e^{-w^2/2}=we^{-w^2/2}$.

**수치 검산.** $w=1.5$에서 $\sqrt{2/\pi}\int_0^{40}xe^{-x^2/2}\sin1.5x\,dx=0.4869787$, $1.5e^{-1.125}=0.4869787$ ✓.
:::

:::warn 자주 하는 실수
- 공식을 $\mathcal F_s\{f'\}=w\,\mathcal F_c\{f\}$로 부호를 틀리는 것. 코사인 쪽이 $\mathcal F_c\{f'\}=w\mathcal F_s\{f\}-\sqrt{\frac2\pi}f(0)$이고, 사인 쪽은 $-w\mathcal F_c\{f\}$입니다.
- $f'=-xe^{-x^2/2}$의 **음의 부호**를 잊는 것. 그러면 답이 $-we^{-w^2/2}$가 됩니다.
- 공식을 쓰면서 조건($f\to0$, 연속성)을 확인하지 않는 것.
- 문제 3-1의 결과를 증명 없이 “표에서” 가져오는 것. 이 과제에서는 3-1을 먼저 증명했으니 “문제 3-1에 의해”라고 쓰면 됩니다.
:::
` },
      { id: 'p3c', label: '문제 3-3', title: 'e^(−ax²)의 푸리에 변환', where: '교재 11.10 표 III #9 · 푸리에 변환', secs: ['ch10:11.9', 'ch10:11.8'],
        body: R`
:::def 문제
(교재 11.10절 표 III의 9번) 다음을 증명하시오.
$$\mathcal F\big(e^{-ax^2}\big)=\frac1{\sqrt{2a}}\,e^{-w^2/(4a)}\qquad(a\gt0)$$
:::

:::key 핵심 포인트
- **방법 1 (우함수 + 척도 바꾸기)**: $e^{-ax^2}$는 우함수라 $\hat f(w)=\frac2{\sqrt{2\pi}}\int_0^\infty e^{-ax^2}\cos wx\,dx$. $x=\frac t{\sqrt{2a}}$로 치환하면 $e^{-t^2/2}$의 적분, 곧 문제 3-1의 $I\big(\frac w{\sqrt{2a}}\big)$가 됩니다.
- **방법 2 (미분방정식)**: $f'=-2axf$를 변환하면 $\mathcal F\{f'\}=iw\hat f$와 $\mathcal F\{xf\}=i\hat f'$에서 $\hat f'=-\frac w{2a}\hat f$. 초기값 $\hat f(0)=\frac1{\sqrt{2\pi}}\sqrt{\frac\pi a}=\frac1{\sqrt{2a}}$.
- 검산: $a=\frac12$이면 $\mathcal F(e^{-x^2/2})=e^{-w^2/2}$로 표 I #4와 같습니다. $a$가 크면(좁은 함수) 변환은 넓어집니다.
:::

:::ex 풀이
방법 1은 3-1을 그대로 다시 쓰고, 방법 2는 3-1과 독립된 증명입니다.
---
**방법 1.** $f(x)=e^{-ax^2}$는 절대 적분 가능하므로 변환이 존재한다. $e^{-iwx}=\cos wx-i\sin wx$이고 $f(x)\sin wx$는 기함수, $f(x)\cos wx$는 우함수이므로
$$\hat f(w)=\frac1{\sqrt{2\pi}}\int_{-\infty}^\infty e^{-ax^2}\cos wx\,dx=\frac2{\sqrt{2\pi}}\int_0^\infty e^{-ax^2}\cos wx\,dx.$$
$x=\frac t{\sqrt{2a}}$로 치환하면 $ax^2=\frac{t^2}2$, $dx=\frac{dt}{\sqrt{2a}}$, $wx=\frac w{\sqrt{2a}}t$이므로
$$\int_0^\infty e^{-ax^2}\cos wx\,dx=\frac1{\sqrt{2a}}\int_0^\infty e^{-t^2/2}\cos\Big(\frac w{\sqrt{2a}}t\Big)dt=\frac1{\sqrt{2a}}\,I\Big(\frac w{\sqrt{2a}}\Big)=\frac1{\sqrt{2a}}\sqrt{\frac\pi2}\,e^{-w^2/(4a)}$$
(문제 3-1의 $I(s)=\sqrt{\frac\pi2}e^{-s^2/2}$에 $s^2=\frac{w^2}{2a}$). $\frac2{\sqrt{2\pi}}\sqrt{\frac\pi2}=1$이므로
$$\mathcal F\big(e^{-ax^2}\big)=\frac1{\sqrt{2a}}\,e^{-w^2/(4a)}.\qquad\blacksquare$$

**방법 2.** 두 가지 연산 공식을 준비한다.
- $f$는 연속이고 $\lvert x\rvert\to\infty$에서 0, $f'=-2axe^{-ax^2}$은 절대 적분 가능하므로 교재 11.9 Theorem 3에 의해 $\mathcal F\{f'\}=iw\hat f$.
- $\frac\partial{\partial w}\big(f(x)e^{-iwx}\big)=-ixf(x)e^{-iwx}$의 절댓값은 $\lvert x\rvert e^{-ax^2}$ 이하이고 이것이 적분 가능하므로 적분 기호 아래에서 미분하여 $\hat f'(w)=\frac1{\sqrt{2\pi}}\int(-ix)fe^{-iwx}dx=-i\,\mathcal F\{xf\}$, 곧 $\mathcal F\{xf\}=i\hat f'(w)$.

$f'=-2axf$의 양변을 변환하면
$$iw\hat f(w)=-2a\cdot i\hat f'(w)\quad\Longrightarrow\quad\hat f'(w)=-\frac w{2a}\hat f(w).$$
3-1과 같이 $\frac d{dw}\big(e^{w^2/(4a)}\hat f\big)=0$이므로 $\hat f(w)=\hat f(0)e^{-w^2/(4a)}$. 초기값은 $x=\frac t{\sqrt{2a}}$ 치환과 가우스 적분으로
$$\hat f(0)=\frac1{\sqrt{2\pi}}\int_{-\infty}^\infty e^{-ax^2}dx=\frac1{\sqrt{2\pi}}\cdot\frac{\sqrt{2\pi}}{\sqrt{2a}}=\frac1{\sqrt{2a}}.$$
따라서 $\mathcal F(e^{-ax^2})=\frac1{\sqrt{2a}}e^{-w^2/(4a)}$. $\blacksquare$

**검산.** ① $a=\frac12$: $\frac1{\sqrt1}e^{-w^2/2}$로 문제 3-1과 일치. ② 수치: $a=2$, $w=2.5$에서 직접 수치적분 $0.2289167$, 공식 $\frac12e^{-25/32}=0.2289167$ ✓. ③ 역변환하면 다시 $e^{-ax^2}$이 되는지: $\frac1{\sqrt{2a}}e^{-w^2/(4a)}$은 $a'=\frac1{4a}$인 가우스 함수에 상수를 곱한 것이고, 우함수에서는 역변환과 변환이 같으므로 같은 공식을 한 번 더 쓰면 $\frac1{\sqrt{2a}}\cdot\frac1{\sqrt{2a'}}e^{-x^2/(4a')}=e^{-ax^2}$ ✓ (변환 쌍의 대칭).
:::

:::warn 자주 하는 실수
- 지수를 $e^{-w^2/(2a)}$나 $e^{-w^2/4a^2}$으로 쓰는 것. 치환 $s=\frac w{\sqrt{2a}}$의 제곱은 $\frac{w^2}{2a}$이고, 그 절반이 $\frac{w^2}{4a}$입니다.
- 앞의 상수를 $\frac1{\sqrt{2\pi}}\sqrt{\frac\pi a}$까지 쓰고 $\frac1{\sqrt{2a}}$로 정리하지 않거나, $\sqrt{\frac\pi a}$로 틀리는 것.
- 방법 2에서 $\mathcal F\{xf\}=i\hat f'$의 $i$를 빠뜨리는 것. 그러면 $\hat f'=+\frac w{2a}\hat f$가 되어 발산하는 답이 나옵니다(검산: 변환은 $w\to\infty$에서 0이어야 함).
- 표 I #5(코사인 변환)와 같은 식이라 그것을 인용하고 끝내는 것. 우함수에서 $\hat f=\hat f_c$라는 연결을 한 줄 써야 합니다.
:::
` },
    ],
  });
})();
