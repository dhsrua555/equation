/* 개념 정리 — 05 라플라스 변환 (Kreyszig 10판 6장, §6.1–6.9). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 5,
    summary: R`라플라스 변환은 **미분방정식을 대수방정식으로** 바꿉니다. 초기조건이 처음부터 들어가므로 일반해를 거치지 않고 IVP의 답이 바로 나오고, 스위치를 켜고 끄는 입력(단위계단함수)과 순간 충격(디랙 델타)을 자연스럽게 다룹니다. 계산의 대부분은 **변환표, 두 이동정리, 부분분수**이고, 합성곱 정리로 적분방정식과 “입력 * 충격 응답”이라는 선형계의 구조를 봅니다.`,
    goals: [
      R`정의로 기본 변환을 구하고, 존재 조건을 말할 수 있다`,
      R`$s$-이동·$t$-이동 정리와 도함수·적분의 변환을 유도하고 쓸 수 있다`,
      R`초기값 문제를 보조방정식 $Y(s)$로 풀 수 있다`,
      R`구간별 함수를 $u(t-a)$로 쓰고 변환·역변환할 수 있다`,
      R`델타 함수 입력의 응답을 구하고 부분분수를 능숙하게 할 수 있다`,
      R`합성곱 정리로 역변환과 적분방정식을 풀 수 있다`,
      R`변환의 미분·적분, 주기함수, 변수계수 ODE, 연립 ODE에 라플라스 변환을 쓸 수 있다`,
    ],
    sections: [
      { k: '6.1', p: '204', title: '라플라스 변환, 선형성, s-이동', body: R`
라플라스 변환은 함수에 적분을 포함한 과정을 적용해 새 함수로 바꾸는 방법입니다. 공학자에게 기본적으로 중요하므로 성질을 꼼꼼히 익혀야 합니다. 응용(ODE 풀이)은 다음 절부터입니다. (라플라스의 이름이 붙었지만, 실용적인 기법을 만든 것은 한 세기 뒤의 전기 기술자 헤비사이드였습니다.)

:::def 라플라스 변환
$$F(s)=\mathcal L(f)=\int_0^\infty e^{-st}f(t)\,dt$$
$f(t)$는 $t\ge0$에서 정의된 원함수, $F(s)$는 변환(상함수)입니다. 역변환은 $f=\mathcal L^{-1}(F)$.
:::

- 적분이 존재(유한)한다고 가정합니다. 응용에서는 대개 그렇고, 조건은 이 절 끝에서 봅니다.
- $F(s)=\int_0^\infty k(s,t)f(t)\,dt$ 꼴의 **적분 변환**이고, $k(s,t)=e^{-st}$를 **핵**이라 합니다.
- 표기: 원함수는 $t$의 함수이고 소문자, 변환은 $s$의 함수이고 같은 글자의 대문자입니다($y(t)\leftrightarrow Y(s)$). $\mathcal L^{-1}(\mathcal L(f))=f$, $\mathcal L(\mathcal L^{-1}(F))=F$.

### 정의로 구하기

:::ex 예제 1 (상수와 지수함수)
$\mathcal L(1)$과 $\mathcal L(e^{at})$를 구하세요.
---
**$f=1$.** 이상적분은 유한 구간 적분의 극한으로 계산합니다.
$$\mathcal L(1)=\int_0^\infty e^{-st}dt=\lim_{T\to\infty}\Big[-\frac1se^{-st}\Big]_0^T=\lim_{T\to\infty}\Big(-\frac1se^{-sT}+\frac1s\Big)=\frac1s\qquad(s>0)$$
앞으로 $\big[-\frac1se^{-st}\big]_0^\infty=\frac1s$처럼 줄여 씁니다.

**$f=e^{at}$.** $s-a>0$이면
$$\mathcal L(e^{at})=\int_0^\infty e^{-st}e^{at}dt=\Big[\frac{e^{-(s-a)t}}{-(s-a)}\Big]_0^\infty=\frac1{s-a}$$
:::

하나하나 정의로 계산할 필요는 없습니다. 몇 가지 일반 성질로 알려진 변환에서 새 변환을 얻을 수 있고, 그중 으뜸이 선형성입니다.

:::thm 선형성 (교재 §6.1 Theorem 1)
변환이 존재하는 $f$, $g$와 상수 $a$, $b$에 대해 $\mathcal L\{af+bg\}=a\mathcal L(f)+b\mathcal L(g)$.
:::

적분이 선형이므로 $\int_0^\infty e^{-st}(af+bg)\,dt=a\int e^{-st}f\,dt+b\int e^{-st}g\,dt$입니다. 예를 들어 $\cosh at=\frac12(e^{at}+e^{-at})$, $\sinh at=\frac12(e^{at}-e^{-at})$에서
$$\mathcal L(\cosh at)=\frac12\Big(\frac1{s-a}+\frac1{s+a}\Big)=\frac s{s^2-a^2},\qquad\mathcal L(\sinh at)=\frac12\Big(\frac1{s-a}-\frac1{s+a}\Big)=\frac a{s^2-a^2}$$

:::ex 예제 2 (코사인과 사인)
$\mathcal L(\cos\omega t)$와 $\mathcal L(\sin\omega t)$를 부분적분으로 유도하세요.
---
$L_c=\mathcal L(\cos\omega t)$, $L_s=\mathcal L(\sin\omega t)$로 둡니다. 부분적분에서 적분 없는 부분은 위끝 $\infty$에서 0이므로
$$L_c=\Big[\frac{e^{-st}}{-s}\cos\omega t\Big]_0^\infty-\frac\omega s\int_0^\infty e^{-st}\sin\omega t\,dt=\frac1s-\frac\omega sL_s$$
$$L_s=\Big[\frac{e^{-st}}{-s}\sin\omega t\Big]_0^\infty+\frac\omega s\int_0^\infty e^{-st}\cos\omega t\,dt=\frac\omega sL_c$$
둘째 식을 첫째에 넣으면 $L_c\big(1+\frac{\omega^2}{s^2}\big)=\frac1s$, 곧 $L_c=\frac{s}{s^2+\omega^2}$. 그러면 $L_s=\frac{\omega}{s^2+\omega^2}$입니다. (복소수로는 $\mathcal L(e^{i\omega t})=\frac1{s-i\omega}=\frac{s+i\omega}{s^2+\omega^2}$의 실수부·허수부로 한 번에 얻습니다.)
:::

**거듭제곱.** $\mathcal L(t^n)=\frac{n!}{s^{n+1}}$은 귀납법으로 보입니다. $n=0$이면 예제 1입니다. $n$에서 성립한다고 하면 부분적분으로
$$\mathcal L(t^{n+1})=\Big[-\frac1se^{-st}t^{n+1}\Big]_0^\infty+\frac{n+1}s\int_0^\infty e^{-st}t^n\,dt=\frac{n+1}s\cdot\frac{n!}{s^{n+1}}=\frac{(n+1)!}{s^{n+2}}$$
정수가 아닌 $a>0$이면 $st=x$로 치환해
$$\mathcal L(t^a)=\int_0^\infty e^{-x}\Big(\frac xs\Big)^a\frac{dx}s=\frac1{s^{a+1}}\int_0^\infty e^{-x}x^a\,dx=\frac{\Gamma(a+1)}{s^{a+1}}$$
입니다(적분 안이 $x^{a-1}$이 아니라 $x^a$라서 $\Gamma(a+1)$)[[ch04:5.4|감마 함수 $\Gamma(\nu+1)=\nu\Gamma(\nu)$.]]. 정수이면 $\Gamma(n+1)=n!$로 앞의 식과 일치합니다.

:::key 기본 변환표
| $f(t)$ | $F(s)$ | $f(t)$ | $F(s)$ |
|---|---|---|---|
| $1$ | $\dfrac1s$ | $e^{at}$ | $\dfrac{1}{s-a}$ |
| $t^n$ | $\dfrac{n!}{s^{n+1}}$ | $t^a\ (a>0)$ | $\dfrac{\Gamma(a+1)}{s^{a+1}}$ |
| $\cos\omega t$ | $\dfrac{s}{s^2+\omega^2}$ | $\sin\omega t$ | $\dfrac{\omega}{s^2+\omega^2}$ |
| $\cosh at$ | $\dfrac{s}{s^2-a^2}$ | $\sinh at$ | $\dfrac{a}{s^2-a^2}$ |
:::

### s-이동: 변환에서 s를 s − a로

$f$의 변환을 알면 $e^{at}f(t)$의 변환은 바로 나옵니다.

:::key s-이동 (제1이동정리)
$$\mathcal L\{e^{at}f(t)\}=F(s-a),\qquad \mathcal L^{-1}\{F(s-a)\}=e^{at}f(t)$$
:::

**증명.** 정의의 $s$ 자리에 $s-a$를 넣으면
$$F(s-a)=\int_0^\infty e^{-(s-a)t}f(t)\,dt=\int_0^\infty e^{-st}\big[e^{at}f(t)\big]dt=\mathcal L\{e^{at}f(t)\}$$
$F(s)$가 $s>k$에서 존재하면 이 적분은 $s-a>k$에서 존재합니다. ($F(s-a)$의 $-a$와 $e^{at}$의 $+a$ 부호에 주의!)

$t$ 영역에서 $e^{at}$를 곱하면 $s$ 영역에서 $a$만큼 이동합니다. 감쇠진동 $e^{at}\cos\omega t\leftrightarrow\frac{s-a}{(s-a)^2+\omega^2}$, $e^{at}\sin\omega t\leftrightarrow\frac{\omega}{(s-a)^2+\omega^2}$가 이 정리의 대표 응용이고, 역변환할 때는 분모를 **완전제곱**해서 $(s-a)^2+\omega^2$ 꼴로 만듭니다.

:::ex 예제 3
(a) $\mathcal L\{3-2e^{4t}+\sin2t\}$, (b) $\mathcal L\{e^{-2t}\cos3t\}$
---
(a) 선형성: $\dfrac3s-\dfrac2{s-4}+\dfrac2{s^2+4}$.
(b) $\mathcal L(\cos3t)=\frac s{s^2+9}$에서 $s\to s+2$: $\dfrac{s+2}{(s+2)^2+9}$.
:::

:::ex 예제 4 (완전제곱으로 역변환)
$\mathcal L^{-1}\Big\{\dfrac{2s+34}{s^2+4s+229}\Big\}$를 구하세요.
---
분모를 완전제곱하면 $s^2+4s+229=(s+2)^2+225=(s+2)^2+15^2$. 분자도 $s+2$가 보이도록 $2s+34=2(s+2)+30=2(s+2)+2\cdot15$로 고칩니다. 역변환의 선형성과 $s$-이동으로
$$\mathcal L^{-1}\Big\{2\frac{s+2}{(s+2)^2+15^2}+2\frac{15}{(s+2)^2+15^2}\Big\}=e^{-2t}\big(2\cos15t+2\sin15t\big)$$
진폭이 $e^{-2t}$로 줄어드는 감쇠진동입니다.
:::

### 변환의 존재와 유일성

실제로는 ODE의 해를 대입해 확인할 수 있으니 큰 문제는 아니지만, 기본 사실은 알아 둡니다. $f$가 너무 빨리 커지지만 않으면 변환이 존재합니다. 곧 어떤 상수 $M$, $k$에 대해
$$|f(t)|\le Me^{kt}\qquad(t\ge0)$$
인 **증가 제한**을 만족하면 됩니다(“지수 차수”라고도 하지만, 지수가 $kt^2$ 같은 것이 아니라 반드시 $kt$라는 점이 중요). 연속일 필요는 없고 **구간별 연속**이면 충분합니다. 유한 구간을 유한 개의 부분 구간으로 나누어 각 부분 구간 안에서 연속이고 양 끝에서 유한한 극한을 가지면 구간별 연속입니다. 불연속은 유한한 도약뿐이고, 응용에는 이것으로 충분합니다.

:::thm 존재 정리 (교재 §6.1 Theorem 3)
$f$가 $t\ge0$의 모든 유한 구간에서 구간별 연속이고 증가 제한을 만족하면 $\mathcal L(f)$는 모든 $s>k$에서 존재합니다.
:::

**증명.** 구간별 연속이라 $e^{-st}f$는 유한 구간에서 적분 가능하고, $s>k$이면
$$|\mathcal L(f)|\le\int_0^\infty|f(t)|e^{-st}dt\le\int_0^\infty Me^{kt}e^{-st}dt=\frac M{s-k}$$
로 유한합니다.[[@base:ch02:2.3|이상적분의 수렴과 비교 판정: 증가 제한이 변환의 존재를 보장하는 이유.]]

증가 제한은 쉽게 확인됩니다: $\cosh t<e^t$, $t^n\le n!e^t$ ($\frac{t^n}{n!}$은 $e^t$의 매클로린 급수의 한 항). 반면 $e^{t^2}$은 어떤 $M$, $k$로도 만족하지 않습니다(로그를 취하면 $t^2\le\ln M+kt$가 결국 깨짐). 정리의 조건은 충분조건이지 필요조건은 아닙니다(예: $t^{-1/2}$은 0에서 유계가 아니지만 변환 $\sqrt{\pi/s}$가 있음).

**유일성.** 변환이 존재하면 하나로 정해집니다. 거꾸로 두 함수의 변환이 같으면 두 함수는 길이가 양수인 구간에서 다를 수 없습니다(고립된 점에서만 다를 수 있음). 그래서 역변환은 본질적으로 유일하고, 연속함수끼리는 완전히 같습니다. 이것이 **표를 거꾸로 읽어도 되는** 근거입니다.

푸리에 변환은 $e^{-st}$ 대신 $e^{-iwx}$를 쓰고 $-\infty$부터 적분하는 형제 변환입니다[[ch10:11.9|푸리에 변환.]].
` },
      { k: '6.2', p: '211', title: '도함수와 적분의 변환, 초기값 문제', body: R`
라플라스 변환은 ODE와 초기값 문제를 푸는 방법입니다. 핵심 아이디어는 **함수에 대한 미적분 연산을 변환에 대한 대수 연산으로** 바꾸는 것입니다. 대략 $f(t)$를 미분하면 $\mathcal L(f)$에 $s$를 곱하고, 적분하면 $s$로 나눕니다. 곱셈을 덧셈으로 바꿔 계산을 쉽게 한 로그와 같은 발상입니다.

:::thm 도함수의 변환 (교재 §6.2 Theorem 1, 2)
$f$가 $t\ge0$에서 연속이고 증가 제한을 만족하며 $f'$이 모든 유한 구간에서 구간별 연속이면 $\mathcal L(f')=s\mathcal L(f)-f(0)$입니다. 일반적으로 $f,\dots,f^{(n-1)}$이 연속이고 증가 제한을 만족하며 $f^{(n)}$이 구간별 연속이면
$$\mathcal L\big(f^{(n)}\big)=s^n\mathcal L(f)-s^{n-1}f(0)-s^{n-2}f'(0)-\cdots-f^{(n-1)}(0)$$
:::

**증명.** $f'$이 연속이면 부분적분으로
$$\mathcal L(f')=\int_0^\infty e^{-st}f'\,dt=\Big[e^{-st}f(t)\Big]_0^\infty+s\int_0^\infty e^{-st}f\,dt$$
증가 제한 때문에 $s>k$이면 위끝에서 0이고, 아래끝이 $-f(0)$을 주며, 마지막 적분이 $\mathcal L(f)$입니다. $f'$이 구간별 연속이면 연속인 조각마다 나누어 같은 계산을 합니다. 2계는 이 식을 $f'$에 쓰고 대입합니다.
$$\mathcal L(f'')=s\mathcal L(f')-f'(0)=s\big[s\mathcal L(f)-f(0)\big]-f'(0)=s^2\mathcal L(f)-sf(0)-f'(0)$$
같은 대입을 반복하면(귀납법) $n$계 공식입니다.

:::ex 예제 1 (공진 항의 변환)
$f(t)=t\sin\omega t$의 변환을 2계 도함수 공식으로 구하세요.
---
$f(0)=0$, $f'=\sin\omega t+\omega t\cos\omega t$이므로 $f'(0)=0$, $f''=2\omega\cos\omega t-\omega^2t\sin\omega t$입니다. 양변을 변환하면
$$\mathcal L(f'')=\frac{2\omega s}{s^2+\omega^2}-\omega^2\mathcal L(f)=s^2\mathcal L(f)$$
이므로 $(s^2+\omega^2)\mathcal L(f)=\frac{2\omega s}{s^2+\omega^2}$, 곧
$$\mathcal L(t\sin\omega t)=\frac{2\omega s}{(s^2+\omega^2)^2}$$
같은 방법으로 $f=\cos\omega t$에 쓰면 $s^2\mathcal L(f)-s=-\omega^2\mathcal L(f)$에서 $\mathcal L(\cos\omega t)=\frac{s}{s^2+\omega^2}$를 세 번째 방법으로 얻습니다.
:::

### 적분의 변환

미분과 적분, 곱셈과 나눗셈이 서로 역연산이니 $f$의 적분은 $\mathcal L(f)$를 $s$로 나누는 것에 대응할 것입니다.

:::key 도함수와 적분의 변환
$$\mathcal L(f')=sF-f(0),\qquad \mathcal L(f'')=s^2F-sf(0)-f'(0)$$
$$\mathcal L\Big\{\int_0^t f(\tau)\,d\tau\Big\}=\frac{F(s)}{s}$$
:::

**증명.** $g(t)=\int_0^tf(\tau)\,d\tau$로 두면 $|g(t)|\le\int_0^tMe^{k\tau}d\tau\le\frac Mke^{kt}$ ($k>0$)이라 $g$도 증가 제한을 만족하고, $g'=f$ (불연속점 제외), $g(0)=0$입니다. 도함수 공식에서 $\mathcal L(f)=\mathcal L(g')=s\mathcal L(g)-0$이므로 $\mathcal L(g)=\frac{F}{s}$.

:::ex 예제 2 (적분 정리로 역변환)
$\mathcal L^{-1}\Big\{\dfrac1{s(s^2+\omega^2)}\Big\}$와 $\mathcal L^{-1}\Big\{\dfrac1{s^2(s^2+\omega^2)}\Big\}$를 구하세요.
---
$\frac1{s^2+\omega^2}\leftrightarrow\frac{\sin\omega t}\omega$이므로 $s$로 한 번 나누면 적분 한 번:
$$\mathcal L^{-1}\Big\{\frac1{s(s^2+\omega^2)}\Big\}=\int_0^t\frac{\sin\omega\tau}{\omega}d\tau=\frac{1-\cos\omega t}{\omega^2}$$
한 번 더:
$$\mathcal L^{-1}\Big\{\frac1{s^2(s^2+\omega^2)}\Big\}=\int_0^t\frac{1-\cos\omega\tau}{\omega^2}d\tau=\frac1{\omega^2}\Big(t-\frac{\sin\omega t}{\omega}\Big)$$
부분분수로도 같은 답을 얻습니다. 이렇게 여러 길로 풀리는 것이 전형적입니다.
:::

### 미분방정식과 초기값 문제

$$y''+ay'+by=r(t),\qquad y(0)=K_0,\quad y'(0)=K_1\qquad(a,b\text{ 상수})$$
를 풉니다. $r(t)$는 역학계나 회로에 가한 입력(구동력)이고 $y(t)$는 출력(응답)입니다.

**1단계: 보조방정식.** 도함수 공식으로 양변을 변환합니다($Y=\mathcal L(y)$, $R=\mathcal L(r)$).
$$\big[s^2Y-sy(0)-y'(0)\big]+a\big[sY-y(0)\big]+bY=R(s)$$
$Y$ 항을 모으면 **보조방정식**
$$(s^2+as+b)Y=(s+a)y(0)+y'(0)+R(s)$$
**2단계: 대수로 풀기.** **전달함수** $Q(s)=\dfrac1{s^2+as+b}$로 나누면
$$Y(s)=\big[(s+a)y(0)+y'(0)\big]Q(s)+R(s)Q(s)$$
초기값이 0이면 $Y=RQ$, 곧 $Q=\frac{\mathcal L(\text{출력})}{\mathcal L(\text{입력})}$이라 전달함수라 부릅니다. $Q$는 입력이나 초기조건과 무관하고 $a,b$에만 의존합니다. $Q$의 분모는 특성다항식 그 자체입니다[[ch02:2.3|미분연산자 $P(D)$와 특성다항식.]].

**3단계: 역변환.** $Y$를 (대개 부분분수로) 표에서 역변환을 찾을 수 있는 항들의 합으로 나누고 $y=\mathcal L^{-1}(Y)$를 얻습니다.

:::ex 예제 3 (기본 3단계)
$y''+y=2t$, $y(0)=0$, $y'(0)=3$을 푸세요.
---
**1단계.** $s^2Y-0-3+Y=\dfrac2{s^2}$, 곧 $(s^2+1)Y=3+\dfrac2{s^2}$.
**2단계.** $Q=\frac1{s^2+1}$이고
$$Y=\frac3{s^2+1}+\frac2{s^2(s^2+1)}=\frac3{s^2+1}+2\Big(\frac1{s^2}-\frac1{s^2+1}\Big)=\frac1{s^2+1}+\frac2{s^2}$$
**3단계.** $y=\sin t+2t$.
검산: $y''=-\sin t$이므로 $y''+y=2t$ ✓, $y(0)=0$ ✓, $y'(0)=1+2=3$ ✓.
:::

:::ex 예제 4 (고전적 방법과 비교)
$y''-3y'+2y=4$, $y(0)=1$, $y'(0)=0$
---
$(s^2Y-s)-3(sY-1)+2Y=\dfrac4s$에서 $(s-1)(s-2)Y=s-3+\dfrac4s=\dfrac{s^2-3s+4}{s}$.
가림법으로 부분분수: $Y=\dfrac2s-\dfrac2{s-1}+\dfrac1{s-2}$.
$$y=2-2e^t+e^{2t}$$
검산: $y(0)=1$, $y'(0)=-2+2=0$ ✓. 고전적 방법(동차해 + 미정계수법)과 같은 답이지만, 상수 두 개를 따로 구하는 단계가 없습니다[[ch02:2.7|미정계수법.]].
:::

:::ex 예제 5 (§2.4의 감쇠 진동을 다시 풀기)
$4y''+8y'+100y=0$, $y(0)=0.2$, $y'(0)=0$
---
$4(s^2Y-0.2s)+8(sY-0.2)+100Y=0$이므로 $(s^2+2s+25)Y=0.2(s+2)$. 완전제곱하면
$$Y=\frac{0.2(s+2)}{(s+1)^2+24}=0.2\frac{s+1}{(s+1)^2+24}+\frac{0.2}{\sqrt{24}}\cdot\frac{\sqrt{24}}{(s+1)^2+24}$$
$s$-이동으로 $y=e^{-t}\big(0.2\cos\sqrt{24}\,t+0.0408\sin\sqrt{24}\,t\big)$, §2.4 예제 2(III)와 같은 답을 더 적은 계산으로 얻습니다.
:::

**라플라스 방법의 장점.**
1. 비동차 ODE를 풀 때 동차 ODE를 먼저 풀 필요가 없습니다(예제 3).
2. 초기값이 자동으로 처리됩니다(예제 3–5).
3. 복잡한 입력 $r(t)$ (불연속, 일정 시간만 작용, 충격)을 아주 효율적으로 다룹니다(다음 절들).

:::ex 예제 6 (이동된 데이터 문제)
$y''+y=2t$, $y(\pi)=2\pi$, $y'(\pi)=3$을 푸세요.
---
초기조건이 $t=0$이 아니라 $t_0=\pi$에서 주어졌습니다. $t=\tilde t+\pi$로 두면 $\tilde y(\tilde t)=y(t)$는
$$\tilde y''+\tilde y=2(\tilde t+\pi),\qquad\tilde y(0)=2\pi,\quad\tilde y'(0)=3$$
를 만족합니다. 보조방정식은 $(s^2+1)\tilde Y-2\pi s-3=\frac2{s^2}+\frac{2\pi}s$이고, $\frac{2\pi}{s(s^2+1)}=2\pi\big(\frac1s-\frac s{s^2+1}\big)$, $\frac2{s^2(s^2+1)}=\frac2{s^2}-\frac2{s^2+1}$을 쓰면
$$\tilde Y=\frac{2\pi s+3}{s^2+1}+\frac2{s^2}-\frac2{s^2+1}+\frac{2\pi}s-\frac{2\pi s}{s^2+1}=\frac1{s^2+1}+\frac2{s^2}+\frac{2\pi}s$$
따라서 $\tilde y=\sin\tilde t+2\tilde t+2\pi$. $\tilde t=t-\pi$를 넣으면 $\sin(t-\pi)=-\sin t$이므로
$$y=2t-\sin t$$
검산: $y(\pi)=2\pi$, $y'(\pi)=2-\cos\pi=3$ ✓.
:::

PDE도 한 변수에 대해 라플라스 변환하면 ODE가 됩니다[[ch11:12.12|라플라스 변환에 의한 PDE 풀이.]].
` },
      { k: '6.3', p: '217', title: '단위계단함수와 t-이동', body: R`
이 절과 다음 절이 라플라스 방법이 응용에서 진짜 힘을 보이고 2장의 고전적 방법보다 뛰어난 이유입니다. 두 보조 함수, **단위계단함수** $u(t-a)$와 **디랙 델타** $\delta(t-a)$ (§6.4) 덕분에 공학적으로 중요한 복잡한 우변—한 번의 파형, 불연속이거나 잠시만 작용하는 입력, 사인·코사인이 아닌 주기 입력, 망치로 치는 것 같은 충격—을 다룰 수 있습니다.

### 단위계단함수

**단위계단함수**(헤비사이드 함수) $u(t-a)$ ($a\ge0$)는 $t<a$에서 0, $t>a$에서 1이고 $t=a$에서 크기 1만큼 뜁니다. 정의로 변환을 구하면, $t<a$에서 0이라 적분이 $t=a$부터 시작하므로
$$\mathcal L\{u(t-a)\}=\int_a^\infty e^{-st}dt=\Big[-\frac{e^{-st}}s\Big]_{t=a}^\infty=\frac{e^{-as}}s\qquad(s>0)$$
입니다. “꺼짐”과 “켜짐”으로 이루어진 역학적 구동력이나 기전력을 위해 맞춤 제작된 “공학 함수”입니다. 함수에 $u(t-a)$를 곱해 여러 효과를 만들 수 있습니다.

- $f(t)u(t-2)$: $t<2$에서는 꺼 두었다가 $t=2$부터 켭니다.
- $f(t-2)u(t-2)$: $f$ 전체를 오른쪽으로 2만큼 **옮깁니다**(음의 $t$에서 $f=0$이라 할 때).
- $k[u(t-1)-2u(t-4)+u(t-6)]$: 계단 여러 개로 만든 파형. 무한히 많이 쓰면 음의 반파를 잘라 내는 정류기 같은 주기 파형도 만듭니다.

:::fig f05step
:::

### t-이동: f(t)에서 t를 t − a로

$s$-이동이 $F(s)$와 $F(s-a)=\mathcal L\{e^{at}f\}$의 관계였다면, 두 번째 이동정리는 $f(t)$와 $f(t-a)$의 관계입니다. 단위계단함수는 도구일 뿐이고, 다른 함수와 함께 쓰려면 이 정리가 필요합니다.

:::key t-이동 (제2이동정리)
$$\mathcal L\{f(t-a)u(t-a)\}=e^{-as}F(s),\qquad \mathcal L\{u(t-a)\}=\frac{e^{-as}}{s}$$
$$\text{다른 꼴: }\ \mathcal L\{g(t)u(t-a)\}=e^{-as}\,\mathcal L\{g(t+a)\}$$
:::

**증명.** 오른쪽에 정의를 쓰고(적분변수를 $\tau$로) $e^{-as}$를 안으로 넣으면
$$e^{-as}F(s)=\int_0^\infty e^{-s(\tau+a)}f(\tau)\,d\tau$$
$\tau+a=t$로 치환하면 $d\tau=dt$이고 아래끝이 $a$로 바뀝니다(주의!).
$$e^{-as}F(s)=\int_a^\infty e^{-st}f(t-a)\,dt$$
라플라스 변환이 되려면 0부터 적분해야 하는데, 피적분함수에 $u(t-a)$를 곱하면 0에서 $a$까지는 0이므로
$$e^{-as}F(s)=\int_0^\infty e^{-st}f(t-a)u(t-a)\,dt=\mathcal L\{f(t-a)u(t-a)\}$$
(여기서 $u(t-a)$가 나타나는 이유가 보입니다.) 다른 꼴은 $f(t-a)=g(t)$, 곧 $f(t)=g(t+a)$로 두면 나옵니다. $f(t)$를 $f(t-a)$ 꼴로 고치기 불편할 때 편리합니다.

**$s$ 영역에서 $e^{-as}$를 곱하는 것 = 시간 지연**입니다.

**구간별 함수 쓰기.** “새 식 − 옛 식”에 계단을 곱해 더합니다. $0<t<a$에서 $f_1$, $t>a$에서 $f_2$이면 $f=f_1+(f_2-f_1)u(t-a)$.

:::ex 예제 1
$f(t)=t\ (0<t<1)$, $f(t)=1\ (t>1)$의 라플라스 변환은?
---
$f=t+(1-t)u(t-1)=t-(t-1)u(t-1)$이므로 $F(s)=\dfrac1{s^2}-\dfrac{e^{-s}}{s^2}$.
:::

:::ex 예제 2 (세 조각으로 된 함수)
$$f(t)=\begin{cases}1 & 0<t<2\\ t-1 & 2<t<4\\ 0 & t>4\end{cases}$$
를 단위계단함수로 쓰고 변환하세요.
---
**1단계: 계단함수로.** 경계마다 “새 식 − 옛 식”을 더하면
$$f=1+\big[(t-1)-1\big]u(t-2)+\big[0-(t-1)\big]u(t-4)=1+(t-2)u(t-2)-(t-1)u(t-4)$$
($t=2$에서는 $1\to1$로 연속, $t=4$에서는 $3\to0$으로 뜁니다.)

**2단계: 변환.** 둘째 항은 이미 $f(t-2)u(t-2)$ 꼴이라 $e^{-2s}\frac1{s^2}$. 셋째 항은 다른 꼴을 써서 $e^{-4s}\mathcal L\{(t+4)-1\}=e^{-4s}\mathcal L\{t+3\}$.
$$F(s)=\frac1s+\frac{e^{-2s}}{s^2}-e^{-4s}\Big(\frac1{s^2}+\frac3s\Big)$$
:::

:::warn 흔한 실수
$\mathcal L\{t\,u(t-1)\}\ne e^{-s}/s^2$입니다. $t=(t-1)+1$로 고쳐야 $e^{-s}\big(\tfrac1{s^2}+\tfrac1s\big)$가 됩니다.
:::

:::ex 예제 3 (두 이동정리를 함께: 한 주기만 켜진 사인파)
$\mathcal L^{-1}\Big\{\dfrac{2(1-e^{-\pi s})}{s^2+4}+\dfrac{e^{-3s}}{(s+2)^2}\Big\}$를 구하세요.
---
지수 인자가 없으면 $\frac2{s^2+4}\leftrightarrow\sin2t$이고, $\frac1{s^2}\leftrightarrow t$에 $s$-이동을 쓰면 $\frac1{(s+2)^2}\leftrightarrow te^{-2t}$입니다. $t$-이동으로
$$f=\sin2t-\sin\big(2(t-\pi)\big)u(t-\pi)+(t-3)e^{-2(t-3)}u(t-3)$$
$\sin(2t-2\pi)=\sin2t$이므로 앞의 두 항은 $t>\pi$에서 상쇄됩니다. 따라서 $f$는 $0<t<\pi$에서 $\sin2t$ (한 주기만 켜진 사인파), $\pi<t<3$에서 0, $t>3$에서 $(t-3)e^{-2(t-3)}$입니다.
:::

:::ex 예제 4 (RC 회로와 사각 펄스)
저항 $R$, 콘덴서 $C$인 회로에 시각 $a$부터 $b$까지만 전압 $V_0$을 건다($a<b$). 처음에 전류와 전하가 0일 때 전류 $i(t)$는?
---
입력은 $V_0[u(t-a)-u(t-b)]$이고, 모델은 적분-미분방정식
$$Ri(t)+\frac{q(t)}C=Ri(t)+\frac1C\int_0^ti(\tau)\,d\tau=V_0\big[u(t-a)-u(t-b)\big]$$
입니다. 적분의 변환과 계단함수의 변환으로 보조방정식은
$$RI(s)+\frac{I(s)}{sC}=\frac{V_0}{s}\big(e^{-as}-e^{-bs}\big)\quad\Longrightarrow\quad I(s)=F(s)\big(e^{-as}-e^{-bs}\big),\quad F(s)=\frac{V_0/R}{s+1/(RC)}$$
$\mathcal L^{-1}(F)=\frac{V_0}Re^{-t/(RC)}$이므로 $t$-이동으로
$$i(t)=\frac{V_0}{R}\Big[e^{-(t-a)/(RC)}u(t-a)-e^{-(t-b)/(RC)}u(t-b)\Big]$$
곧 $t<a$에서 0, $a<t<b$에서 $K_1e^{-t/(RC)}$, $t>b$에서 $(K_1-K_2)e^{-t/(RC)}$ ($K_1=\frac{V_0}Re^{a/(RC)}$, $K_2=\frac{V_0}{R}e^{b/(RC)}$)입니다. 전압이 꺼지는 순간 전류가 음수로 뛰는 것은 콘덴서가 방전되기 때문입니다.
:::

:::fig f05rc
:::

:::ex 예제 5 (늦게 켜지는 입력)
$y'+2y=u(t-1)$, $y(0)=0$ (1초 뒤에 켜지는 RC 회로)
---
$(s+2)Y=\dfrac{e^{-s}}s$, $Y=e^{-s}\cdot\dfrac1{s(s+2)}=e^{-s}\cdot\dfrac12\Big(\dfrac1s-\dfrac1{s+2}\Big)$.
$e^{-s}$가 없는 부분의 역변환 $\frac12(1-e^{-2t})$에 $t\to t-1$과 $u(t-1)$을 적용합니다.
$$y=\tfrac12u(t-1)\big(1-e^{-2(t-1)}\big)$$
$t<1$에서는 0이고, 그 뒤 1/2로 다가갑니다. 회로 모델은 2장과 같습니다[[ch02:2.9|RLC 회로 모델.]].
:::
` },
      { k: '6.4', p: '225', title: '짧은 충격, 디랙 델타, 부분분수', body: R`
비행기의 “딱딱한” 착륙, 망치로 친 기계, 큰 파도 한 번을 맞은 배, 라켓에 맞은 공처럼, 아주 짧은 시간에 힘이 작용하는 **충격적** 현상이 많습니다. 이것을 디랙 델타로 모델링하고 라플라스 변환으로 효과적으로 풉니다.

### 충격과 디랙 델타

$$f_k(t-a)=\begin{cases}1/k & a\le t\le a+k\\ 0 & \text{그 밖}\end{cases}$$
는 $t=a$부터 $a+k$까지 크기 $1/k$로 작용하는 힘을 나타냅니다($k>0$ 작음). 역학에서 힘을 작용 시간에 대해 적분한 것을 **충격량**이라 하고, $f_k$의 충격량은 넓이 1입니다.
$$I_k=\int_0^\infty f_k(t-a)\,dt=\int_a^{a+k}\frac1k\,dt=1$$
$k\to0$의 극한을 **디랙 델타**(단위 충격 함수) $\delta(t-a)=\lim_{k\to0}f_k(t-a)$라 합니다.

:::key 디랙 델타
$$\delta(t-a)=\lim_{k\to0}f_k,\qquad\int_0^\infty g(t)\,\delta(t-a)\,dt=g(a)\ (\text{거르기 성질}),\qquad\mathcal L\{\delta(t-a)\}=e^{-as}$$
:::

$\delta$는 미적분의 보통 함수가 아닙니다. 극한에서 “$t=a$에서 $\infty$, 그 밖에서 0이면서 적분이 1”이 되는데, 한 점을 빼고 0인 보통 함수의 적분은 0이어야 하기 때문입니다. 그래서 **일반화 함수**(분포)라 부르며, 적분 속에서만 뜻을 가집니다. 그래도 충격 문제에서는 보통 함수처럼 다루는 것이 편리합니다. 연속함수 $g$에 대한 **거르기 성질**(shifting이 아니라 sifting)은 넓이 1인 좁은 펄스가 $g$의 한 점 값을 골라낸다는 뜻입니다.

**변환.** $f_k=\frac1k[u(t-a)-u(t-(a+k))]$이므로
$$\mathcal L\{f_k(t-a)\}=\frac1{ks}\big[e^{-as}-e^{-(a+k)s}\big]=e^{-as}\frac{1-e^{-ks}}{ks}$$
$k\to0$이면 로피탈 정리로(분자·분모를 $k$로 미분하면 $se^{-ks}$와 $s$) 분수가 1로 가므로 $\mathcal L\{\delta(t-a)\}=e^{-as}$로 정의합니다. 계단함수의 “도함수”로 볼 수 있습니다($\mathcal L\{u(t-a)\}=\frac{e^{-as}}s$에 $s$를 곱함).

초기조건이 0인 계에 $\delta(t)$를 넣으면 $Y=Q(s)$, 즉 전달함수의 역변환 $q(t)=\mathcal L^{-1}(Q)$가 **충격 응답**입니다. 다음 절에서 모든 입력의 응답이 이것으로 표현됩니다.

:::ex 예제 1 (사각파를 받는 감쇠계)
$y''+4y'+3y=r(t)=u(t-1)-u(t-3)$, $y(0)=0$, $y'(0)=0$의 응답을 구하세요.
---
보조방정식 $s^2Y+4sY+3Y=\frac1s(e^{-s}-e^{-3s})$에서
$$Y=F(s)\big(e^{-s}-e^{-3s}\big),\qquad F(s)=\frac1{s(s+1)(s+3)}=\frac{1/3}{s}-\frac{1/2}{s+1}+\frac{1/6}{s+3}$$
(가림법: $s=0$에서 $\frac13$, $s=-1$에서 $\frac1{(-1)(2)}$, $s=-3$에서 $\frac1{(-3)(-2)}$.) $f=\mathcal L^{-1}(F)=\frac13-\frac12e^{-t}+\frac16e^{-3t}$이므로 $t$-이동으로
$$y=f(t-1)u(t-1)-f(t-3)u(t-3)=\begin{cases}0 & 0<t<1\\ \frac13-\frac12e^{-(t-1)}+\frac16e^{-3(t-1)} & 1<t<3\\ -\frac12\big(e^{-(t-1)}-e^{-(t-3)}\big)+\frac16\big(e^{-3(t-1)}-e^{-3(t-3)}\big) & t>3\end{cases}$$
입력이 꺼진 $t=3$에서도 속도가 남아 있어서 응답은 조금 더 올라가 $t\approx3.07$에서 최대가 된 뒤 0으로 감쇠합니다.
:::

:::ex 예제 2 (망치로 친 응답)
예제 1의 사각파를 $t=1$에서의 단위 충격 $\delta(t-1)$로 바꾸면?
---
$(s^2+4s+3)Y=e^{-s}$이므로
$$Y=\frac{e^{-s}}{(s+1)(s+3)}=\frac12\Big(\frac1{s+1}-\frac1{s+3}\Big)e^{-s}\quad\Longrightarrow\quad y=\frac12\big(e^{-(t-1)}-e^{-3(t-1)}\big)u(t-1)$$
$t=1$에서 속도가 순간적으로 1이 되고(위치는 연속), $t=1+\frac12\ln3$에서 최대 약 0.19에 이릅니다. 넓이 1을 유지하며 펄스를 점점 좁히면 응답이 이 곡선으로 다가갑니다.
:::

:::fig f05imp
:::

:::ex 예제 3 (진동하는 계를 치기)
$y''+4y=\delta(t-\pi)$, $y(0)=1$, $y'(0)=0$
---
$(s^2+4)Y=s+e^{-\pi s}$, $Y=\dfrac s{s^2+4}+e^{-\pi s}\dfrac1{s^2+4}$.
$$y=\cos2t+\tfrac12u(t-\pi)\sin2(t-\pi)=\cos2t+\tfrac12u(t-\pi)\sin2t$$
$t=\pi$에서 속도가 순간적으로 1 증가하고, 이후 진폭이 $\sqrt{1+\frac14}$로 커집니다. 치는 순간의 위상에 따라 진폭이 커지거나 줄어듭니다(공진과 관련[[ch02:2.8|강제진동과 공진.]]).
:::

:::ex 예제 4 (4단자 RLC 회로망의 충격 응답)
$R=40\ \Omega$, $L=1$ H, $C=\frac{1}{10400}$ F인 RLC 회로의 콘덴서 양단 전압 $v(t)$를 출력으로 잰다. 입력이 $t=0$의 단위 충격 $\delta(t)$이고 처음에 전류와 전하가 0일 때 $v(t)$는?
---
$i=q'$이므로 $Li'+Ri+\frac qC=Lq''+Rq'+\frac qC=\delta(t)$, 곧 $q''+40q'+10400q=\delta(t)$. 보조방정식은
$$(s^2+40s+10400)Q=1,\qquad Q=\frac1{(s+20)^2+100^2}$$
$s$-이동으로 $q=\frac1{100}e^{-20t}\sin100t$이고
$$v=\frac qC=104\,e^{-20t}\sin100t\ \ [\text{V}]$$
회로가 “울렸다가” 감쇠하는 모습입니다. 측정 장치의 충격 응답은 그 장치의 특성(고유진동수와 감쇠)을 그대로 보여 줍니다.
:::

### 부분분수 더 보기

보조방정식의 해는 대개 다항식의 몫 $Y=\frac{F(s)}{G(s)}$로 나오므로, 부분분수로 나누면 표와 $s$-이동으로 역변환할 수 있는 항들의 합이 됩니다(**헤비사이드 전개**).

:::key 부분분수 분해
- 단순 일차인수 $(s-a)$: $\dfrac{A}{s-a}$, 가림법 $A=\big[(s-a)F(s)\big]_{s=a}$ → $Ae^{at}$
- 반복 인수 $(s-a)^m$: $\dfrac{A_m}{(s-a)^m}+\cdots+\dfrac{A_1}{s-a}$, $A_{m-k}=\dfrac1{k!}\dfrac{d^k}{ds^k}\big[(s-a)^mF\big]_{s=a}$ → $\dfrac{t^{k-1}}{(k-1)!}e^{at}$
- 기약 이차인수: 완전제곱 $(s-\alpha)^2+\beta^2$으로 고쳐 $e^{\alpha t}\cos\beta t$, $e^{\alpha t}\sin\beta t$
:::

반복 인수의 역변환을 풀어 쓰면 $\frac{A_2}{(s-a)^2}+\frac{A_1}{s-a}\leftrightarrow(A_2t+A_1)e^{at}$, $\frac{A_3}{(s-a)^3}+\frac{A_2}{(s-a)^2}+\frac{A_1}{s-a}\leftrightarrow\big(\frac12A_3t^2+A_2t+A_1\big)e^{at}$입니다. 반복되는 복소 인수(공진)는 다음 절의 합성곱으로 다룹니다.

:::ex 예제 5 (반복 인수)
$\mathcal L^{-1}\Big\{\dfrac{2s+1}{(s-1)^2(s+2)}\Big\}$
---
$s=-2$: $\frac{-3}{9}=-\frac13$. $(s-1)^2$의 계수: $A_2=\big[\frac{2s+1}{s+2}\big]_{s=1}=1$, $A_1=\frac{d}{ds}\big[\frac{2s+1}{s+2}\big]_{s=1}=\frac{3}{(s+2)^2}\Big|_{s=1}=\frac13$.
$$f=te^t+\tfrac13e^t-\tfrac13e^{-2t}$$
검산: $s=0$에서 원식 $\frac12$, 분해식 $1-\frac13-\frac16=\frac12$ ✓
:::

:::ex 예제 6 (복소 인수)
$\mathcal L^{-1}\Big\{\dfrac{s+3}{s^2+4s+13}\Big\}$
---
분모를 $(s+2)^2+9$로, 분자를 $(s+2)+1$로 고치면
$$\frac{s+2}{(s+2)^2+9}+\frac13\cdot\frac{3}{(s+2)^2+9}\;\Rightarrow\;e^{-2t}\Big(\cos3t+\tfrac13\sin3t\Big)$$
:::

:::ex 예제 7 (반복되지 않는 복소 인수: 잠시 작용하는 사인파 외력)
$y''+2y'+2y=r(t)$, $r=10\sin2t$ ($0<t<\pi$), $r=0$ ($t>\pi$), $y(0)=y'(0)=0$을 푸세요.
---
$r=10\sin2t\,[1-u(t-\pi)]$이고 $\sin2t$의 주기가 $\pi$라 $\sin2(t-\pi)=\sin2t$이므로 $\mathcal L(r)=\frac{20}{s^2+4}(1-e^{-\pi s})$. 따라서
$$Y=\frac{20\,(1-e^{-\pi s})}{(s^2+4)(s^2+2s+2)}$$
**부분분수.** 반복되지 않는 복소 인수 두 개이므로 $\frac{20}{(s^2+4)(s^2+2s+2)}=\frac{As+B}{s^2+4}+\frac{Ms+N}{s^2+2s+2}$로 두고, 공통분모를 곱해 $s^3,s^2,s,s^0$의 계수를 비교하면
$$0=A+M,\quad0=2A+B+N,\quad0=2A+2B+4M,\quad20=2B+4N$$
에서 $A=-2$, $B=-2$, $M=2$, $N=6$. 역변환하면($s^2+2s+2=(s+1)^2+1$, $2s+6=2(s+1)+4$)
$$g(t)=-2\cos2t-\sin2t+e^{-t}(2\cos t+4\sin t)$$
**답.** $0<t<\pi$에서 $y=g(t)$. $t>\pi$에서는 $t$-이동으로 $y=g(t)-g(t-\pi)$이고, 주기성 $\cos2(t-\pi)=\cos2t$ 때문에 삼각함수 항이 상쇄되며 $\cos(t-\pi)=-\cos t$, $\sin(t-\pi)=-\sin t$이므로
$$y=\big(1+e^{\pi}\big)e^{-t}\big(2\cos t+4\sin t\big)\qquad(t>\pi)$$
$t=\pi$에서 두 식의 값($-2-2e^{-\pi}$)이 이어집니다. 외력이 사라진 뒤에는 감쇠 때문에 진동이 빠르게 0으로 갑니다.
:::

:::fig f05burst
:::
` },
      { k: '6.5', p: '232', title: '합성곱과 적분방정식', body: R`
합성곱은 **변환의 곱**에 관한 것입니다. 변환의 합은 문제가 없지만($\mathcal L(f+g)=\mathcal L(f)+\mathcal L(g)$), ODE와 적분방정식에서는 $\mathcal L(f)\mathcal L(g)$가 자주 나오고 그 원함수가 필요합니다. $fg$일 것 같지만 틀렸습니다. 예를 들어 $f=e^t$, $g=1$이면 $fg=e^t$라 $\mathcal L(fg)=\frac1{s-1}$이지만 $\mathcal L(f)\mathcal L(g)=\frac1{s(s-1)}$입니다. 정답이 합성곱입니다.

:::key 합성곱 정리
$$(f*g)(t)=\int_0^t f(\tau)g(t-\tau)\,d\tau,\qquad \mathcal L(f*g)=F(s)G(s)$$
:::

**증명.** 적분변수를 구별해 $F(s)=\int_0^\infty e^{-s\tau}f(\tau)\,d\tau$, $G(s)=\int_0^\infty e^{-sp}g(p)\,dp$로 씁니다. $G$에서 $p=t-\tau$ ($\tau$는 우선 고정)로 치환하면 $t$는 $\tau$부터 $\infty$까지 변하고
$$G(s)=\int_\tau^\infty e^{-s(t-\tau)}g(t-\tau)\,dt=e^{s\tau}\int_\tau^\infty e^{-st}g(t-\tau)\,dt$$
$F$와 $G$의 적분변수는 독립이므로 $G$를 $F$의 적분 안에 넣으면 $e^{-s\tau}e^{s\tau}$가 상쇄되어
$$F(s)G(s)=\int_0^\infty f(\tau)\int_\tau^\infty e^{-st}g(t-\tau)\,dt\,d\tau$$
적분 영역은 $t\tau$ 평면의 $0\le\tau\le t$ 부분입니다. 가정 아래 적분 순서를 바꿀 수 있으므로, 먼저 $\tau$를 0부터 $t$까지, 다음에 $t$를 0부터 $\infty$까지 적분하면
$$F(s)G(s)=\int_0^\infty e^{-st}\Big[\int_0^tf(\tau)g(t-\tau)\,d\tau\Big]dt=\mathcal L(f*g)$$

:::ex 예제 1 (지수함수와 1)
$H(s)=\dfrac1{s(s-a)}$의 원함수는?
---
$\frac1{s-a}\leftrightarrow e^{at}$, $\frac1s\leftrightarrow1$이므로
$$h(t)=e^{at}*1=\int_0^te^{a\tau}\cdot1\,d\tau=\frac1a\big(e^{at}-1\big)$$
검산: $\mathcal L(h)=\frac1a\big(\frac1{s-a}-\frac1s\big)=\frac1a\cdot\frac{a}{s(s-a)}$ ✓.
:::

:::ex 예제 2 (반복되는 복소 인수)
$H(s)=\dfrac1{(s^2+\omega^2)^2}$의 원함수는?
---
$\frac1{s^2+\omega^2}\leftrightarrow\frac{\sin\omega t}\omega$이므로 곱을 합으로 바꾸는 공식 $\sin A\sin B=\frac12[\cos(A-B)-\cos(A+B)]$를 써서
$$h=\frac{\sin\omega t}{\omega}*\frac{\sin\omega t}{\omega}=\frac1{\omega^2}\int_0^t\sin\omega\tau\sin\omega(t-\tau)\,d\tau=\frac1{2\omega^2}\int_0^t\big[\cos(2\omega\tau-\omega t)-\cos\omega t\big]d\tau$$
$$=\frac1{2\omega^2}\Big[\frac{\sin\omega t}{\omega}-t\cos\omega t\Big]=\frac{\sin\omega t-\omega t\cos\omega t}{2\omega^3}$$
:::

**대수적 성질.** 정의에서 거의 바로
$$f*g=g*f,\qquad f*(g_1+g_2)=f*g_1+f*g_2,\qquad(f*g)*v=f*(g*v),\qquad f*0=0$$
이 나옵니다(교환·분배·결합). 그래서 적분이 쉬운 쪽을 $t-\tau$에 넣으세요. 그러나 수의 곱셈과 다른 점도 있습니다.
- $f*1\ne f$: 예를 들어 $t*1=\int_0^t\tau\,d\tau=\frac{t^2}2$.
- $f*f\ge0$이 아닐 수 있습니다: 예제 2에서 $\omega=1$이면 $\sin t*\sin t=\frac12(\sin t-t\cos t)$로 음수가 되는 구간이 있습니다.

:::ex 예제 3 (공진을 합성곱으로)
비감쇠 공진 $y''+\omega_0^2y=K\sin\omega_0t$, $y(0)=y'(0)=0$을 푸세요.
---
보조방정식 $s^2Y+\omega_0^2Y=\frac{K\omega_0}{s^2+\omega_0^2}$에서 $Y=\frac{K\omega_0}{(s^2+\omega_0^2)^2}$. 예제 2에서
$$y=K\omega_0\cdot\frac{\sin\omega_0t-\omega_0t\cos\omega_0t}{2\omega_0^3}=\frac{K}{2\omega_0^2}\big(\sin\omega_0t-\omega_0t\cos\omega_0t\big)$$
둘째 항이 $t$에 비례해 한없이 커집니다. 공진이면 이런 항이 반드시 생깁니다(§2.8).
:::

### 비동차 선형 ODE에의 응용

$y''+ay'+by=r(t)$의 보조방정식의 해는 $Y=[(s+a)y(0)+y'(0)]Q+RQ$였습니다. 첫 항의 역변환은 어렵지 않고(판별식에 따라 지수함수 둘, $(c_1+c_2t)e^{-at/2}$, 또는 감쇠 진동), 흥미로운 것은 $RQ$입니다. 초기값이 0이면 $Y=RQ$이므로 합성곱 정리로
$$y(t)=(r*q)(t)=\int_0^tq(t-\tau)\,r(\tau)\,d\tau,\qquad q=\mathcal L^{-1}(Q)\ (\text{충격 응답})$$
**응답 = 입력 * 충격 응답.** 과거의 각 순간 $\tau$에 들어온 입력 $r(\tau)$가 경과 시간 $t-\tau$만큼의 충격 응답으로 퍼져 더해진다는 뜻입니다. 매개변수 변환법의 적분 공식과 같은 것입니다[[ch02:2.10|매개변수 변환법.]][[@base:ch02:2.1|적분 기호 속 미분으로 합성곱 꼴의 해를 직접 검산하기.]]. 푸리에 변환에도 같은 합성곱 정리가 있습니다[[ch10:11.9|푸리에 변환의 합성곱 정리.]].

:::ex 예제 4 (사각파 응답을 합성곱으로)
§6.4 예제 1의 $y''+4y'+3y=u(t-1)-u(t-3)$, $y(0)=y'(0)=0$을 합성곱으로 푸세요.
---
$Q=\frac1{(s+1)(s+3)}=\frac12\big(\frac1{s+1}-\frac1{s+3}\big)$이므로 $q(t)=\frac12(e^{-t}-e^{-3t})$. 적분의 한 원시함수는
$$\int q(t-\tau)\cdot1\,d\tau=\frac12e^{-(t-\tau)}-\frac16e^{-3(t-\tau)}$$
이제 **중요한 점**: $r(\tau)=1$은 $1<\tau<3$에서만이므로 적분 구간을 조심해야 합니다.
- $t<1$: 적분이 0.
- $1<t<3$: $\tau=1$부터 $t$까지. $y=\big(\frac12-\frac16\big)-\big(\frac12e^{-(t-1)}-\frac16e^{-3(t-1)}\big)=\frac13-\frac12e^{-(t-1)}+\frac16e^{-3(t-1)}$.
- $t>3$: $\tau=1$부터 3까지. $y=\frac12\big(e^{-(t-3)}-e^{-(t-1)}\big)-\frac16\big(e^{-3(t-3)}-e^{-3(t-1)}\big)$.

부분분수로 푼 §6.4의 답과 같습니다.
:::

### 적분방정식

미지함수 $y(t)$가 적분 안에(그리고 밖에도) 나타나는 방정식을 **적분방정식**이라 합니다. 적분이 합성곱 꼴이면 변환으로 풀 수 있습니다. 적분 위끝이 변수이면 **볼테라** 적분방정식, 상수이면 **프레드홀름** 적분방정식이라 하고, $y$가 적분 밖에도 있으면 “제2종”입니다.

:::ex 예제 5
$y(t)=t-\displaystyle\int_0^t(t-\tau)\,y(\tau)\,d\tau$
---
적분은 $y*t$이므로 $Y=\dfrac1{s^2}-\dfrac{Y}{s^2}$. $Y\big(1+\frac1{s^2}\big)=\frac1{s^2}$, $Y=\dfrac1{s^2+1}$.
$$y=\sin t$$
미분해서 확인하면 $y''=-y$, $y(0)=0$, $y'(0)=1$과 같은 문제입니다.
:::

:::ex 예제 6 (지수 핵)
$y(t)=1+\displaystyle\int_0^te^{t-\tau}y(\tau)\,d\tau$를 푸세요.
---
적분은 $y*e^t$이므로 $Y=\frac1s+\frac{Y}{s-1}$. $Y\cdot\frac{s-2}{s-1}=\frac1s$에서
$$Y=\frac{s-1}{s(s-2)}=\frac{1/2}{s}+\frac{1/2}{s-2}\quad\Longrightarrow\quad y=\frac12\big(1+e^{2t}\big)$$
검산: $y(0)=1$ ✓. 양변을 미분하면 $y'=y+\int_0^te^{t-\tau}y\,d\tau=y+(y-1)=2y-1$이고, $y=\frac12(1+e^{2t})$는 이것을 만족합니다.
:::
` },
      { k: '6.6', p: '238', title: '변환의 미분과 적분, 변수계수 ODE', body: R`
변환과 역변환을 구하는 방법은 놀랄 만큼 다양합니다. 정의에 의한 적분, 선형성(§6.1), 두 이동(§6.1, 6.3), 합성곱(§6.5), 함수의 미분·적분(§6.2)을 보았고, 이 절에서는 조금 덜 중요한 연산, 곧 **변환 $F(s)$를 미분·적분**하는 것과 그에 대응하는 $f(t)$의 연산을 봅니다. 이것으로 계수가 변수인 몇몇 ODE를 풉니다.

### 변환의 미분

$f$가 존재 정리의 조건을 만족하면 $F(s)=\int_0^\infty e^{-st}f\,dt$를 적분 기호 속에서 $s$로 미분할 수 있고, $\frac{\partial}{\partial s}e^{-st}=-te^{-st}$이므로
$$F'(s)=-\int_0^\infty e^{-st}tf(t)\,dt\qquad\Longrightarrow\qquad\mathcal L\{tf(t)\}=-F'(s),\quad\mathcal L^{-1}\{F'(s)\}=-tf(t)$$
**변환을 미분하는 것은 함수에 $t$를 곱하는 것**에 대응합니다.

:::key 기타 성질
$$\mathcal L\{tf(t)\}=-F'(s),\qquad \mathcal L\Big\{\frac{f(t)}{t}\Big\}=\int_s^\infty F(\sigma)\,d\sigma$$
$$\text{주기 } p:\quad \mathcal L(f)=\frac{1}{1-e^{-ps}}\int_0^p e^{-st}f(t)\,dt$$
:::

:::ex 예제 1 (공진에서 나오는 세 공식)
$\dfrac1{(s^2+\beta^2)^2}$, $\dfrac{s}{(s^2+\beta^2)^2}$, $\dfrac{s^2}{(s^2+\beta^2)^2}$의 원함수를 구하세요.
---
$\mathcal L(\sin\beta t)=\frac{\beta}{s^2+\beta^2}$를 미분하면(연쇄법칙 주의)
$$\mathcal L(t\sin\beta t)=\frac{2\beta s}{(s^2+\beta^2)^2}\quad\Longrightarrow\quad\frac{s}{(s^2+\beta^2)^2}\leftrightarrow\frac{t\sin\beta t}{2\beta}$$
$\mathcal L(\cos\beta t)=\frac{s}{s^2+\beta^2}$를 미분하면
$$\mathcal L(t\cos\beta t)=-\frac{(s^2+\beta^2)-2s^2}{(s^2+\beta^2)^2}=\frac{s^2-\beta^2}{(s^2+\beta^2)^2}$$
여기에 $\frac1\beta\mathcal L(\sin\beta t)=\frac{1}{s^2+\beta^2}=\frac{s^2+\beta^2}{(s^2+\beta^2)^2}$를 더하고 빼면 분자가 $2s^2$ 또는 $2\beta^2$이 되므로
$$\frac{s^2}{(s^2+\beta^2)^2}\leftrightarrow\frac{\sin\beta t+\beta t\cos\beta t}{2\beta},\qquad\frac1{(s^2+\beta^2)^2}\leftrightarrow\frac{\sin\beta t-\beta t\cos\beta t}{2\beta^3}$$
마지막 것은 §6.5 예제 2와 같습니다.
:::

### 변환의 적분

$f$가 존재 정리의 조건을 만족하고 $t\to0^+$에서 $f(t)/t$의 극한이 있으면($s>k$)
$$\int_s^\infty F(\sigma)\,d\sigma=\int_s^\infty\Big[\int_0^\infty e^{-\sigma t}f(t)\,dt\Big]d\sigma=\int_0^\infty f(t)\Big[\int_s^\infty e^{-\sigma t}d\sigma\Big]dt=\int_0^\infty e^{-st}\frac{f(t)}{t}\,dt$$
(가정 아래 적분 순서를 바꿀 수 있고, $\int_s^\infty e^{-\sigma t}d\sigma=\frac{e^{-st}}t$). 곧 **변환을 적분하는 것은 함수를 $t$로 나누는 것**입니다.

:::ex 예제 2 (로그의 역변환)
$\mathcal L^{-1}\Big\{\ln\Big(1+\dfrac{\omega^2}{s^2}\Big)\Big\}$
---
$F=\ln(s^2+\omega^2)-\ln s^2$을 미분하면 $F'=\frac{2s}{s^2+\omega^2}-\frac2s$. 역변환하면 $\mathcal L^{-1}(F')=2\cos\omega t-2=-tf(t)$이므로
$$f(t)=\frac{2(1-\cos\omega t)}{t}$$
**다른 풀이.** $G(s)=\frac{2s}{s^2+\omega^2}-\frac2s$로 두면 $g=2(\cos\omega t-1)$이고, $F(s)=-\int_s^\infty G\,d\sigma$ ($s$가 아래끝이라 음의 부호)이므로 $f=-\frac{g}{t}$로 같은 답입니다.
:::

:::ex 예제 3
$\mathcal L^{-1}\Big\{\ln\dfrac{s+1}{s-1}\Big\}$
---
$F'=\frac1{s+1}-\frac1{s-1}$이므로 $-tf=e^{-t}-e^t$.
$$f=\frac{e^t-e^{-t}}{t}=\frac{2\sinh t}{t}$$
미분하면 표에 있는 꼴이 되는 $F$는 이렇게 풉니다.
:::

### 주기함수

주기 $p$인 $f$는 $\int_0^\infty=\sum_{n=0}^\infty\int_{np}^{(n+1)p}$로 나누고 각 구간에서 $t=\tau+np$로 치환하면
$$\mathcal L(f)=\sum_{n=0}^\infty e^{-nps}\int_0^pe^{-s\tau}f(\tau)\,d\tau=\frac{1}{1-e^{-ps}}\int_0^pe^{-st}f(t)\,dt$$
입니다(등비급수 $\sum e^{-nps}=\frac1{1-e^{-ps}}$).

:::ex 예제 4 (톱니파)
주기 1인 톱니파 $f(t)=t$ ($0<t<1$)
---
$\int_0^1te^{-st}dt=\frac{1-e^{-s}}{s^2}-\frac{e^{-s}}s$이므로
$$F=\frac1{1-e^{-s}}\Big(\frac{1-e^{-s}}{s^2}-\frac{e^{-s}}s\Big)=\frac1{s^2}-\frac{e^{-s}}{s(1-e^{-s})}$$
:::

### 계수가 변수인 특수한 ODE

$\mathcal L(y')=sY-y(0)$에 변환의 미분을 쓰면
$$\mathcal L(ty')=-\frac{d}{ds}\big[sY-y(0)\big]=-Y-s\frac{dY}{ds},\qquad\mathcal L(ty'')=-\frac{d}{ds}\big[s^2Y-sy(0)-y'(0)\big]=-2sY-s^2\frac{dY}{ds}+y(0)$$
입니다. 그래서 ODE의 계수가 $at+b$ 꼴이면 보조방정식이 $Y$에 대한 **1계 ODE**가 되어 원래 2계 ODE보다 간단할 수 있습니다. 계수가 $at^2+bt+c$ 꼴이면 2계 ODE가 되므로, 이 방법은 꽤 특수한 ODE에만 잘 통합니다. 대표적인 것이 라게르 방정식입니다.

:::ex 예제 5 (라게르 방정식과 라게르 다항식)
$ty''+(1-t)y'+ny=0$ ($n=0,1,2,\dots$)의 해를 구하세요.
---
위 공식들로 변환하면
$$\Big[-2sY-s^2\frac{dY}{ds}+y(0)\Big]+\big[sY-y(0)\big]-\Big[-Y-s\frac{dY}{ds}\Big]+nY=0$$
정리하면 $(s-s^2)\frac{dY}{ds}+(n+1-s)Y=0$. 변수분리하고 부분분수로 적분하면(적분상수 0)
$$\frac{dY}{Y}=-\frac{n+1-s}{s-s^2}ds=\Big(\frac{n}{s-1}-\frac{n+1}{s}\Big)ds\quad\Longrightarrow\quad Y=\frac{(s-1)^n}{s^{n+1}}$$
$l_n=\mathcal L^{-1}(Y)$가 **로드리게스 공식** $l_n(t)=\frac{e^t}{n!}\frac{d^n}{dt^n}\big(t^ne^{-t}\big)$로 주어지는 **라게르 다항식**임을 보입니다. $\mathcal L(t^ne^{-t})=\frac{n!}{(s+1)^{n+1}}$이고 $t^ne^{-t}$의 $n-1$계까지의 도함수가 $t=0$에서 0이므로 $\mathcal L\big\{\frac{d^n}{dt^n}(t^ne^{-t})\big\}=\frac{n!s^n}{(s+1)^{n+1}}$. $e^t$를 곱하는 것은 $s$-이동 $s\to s-1$이고 $n!$로 나누면 $\frac{(s-1)^n}{s^{n+1}}=Y$ ✓. 예를 들어 $l_1=1-t$, $l_2=1-2t+\frac12t^2$입니다.
:::
` },
      { k: '6.7', p: '242', title: '연립 ODE', body: R`
라플라스 변환은 연립 ODE에도 쓸 수 있습니다. 상수계수 1계 선형계
$$y_1'=a_{11}y_1+a_{12}y_2+g_1(t),\qquad y_2'=a_{21}y_1+a_{22}y_2+g_2(t)$$
를 성분마다 변환하면($Y_j=\mathcal L(y_j)$, $G_j=\mathcal L(g_j)$) **보조 연립방정식**
$$(a_{11}-s)Y_1+a_{12}Y_2=-y_1(0)-G_1(s),\qquad a_{21}Y_1+(a_{22}-s)Y_2=-y_2(0)-G_2(s)$$
을 얻습니다. 벡터로 쓰면 $(A-sI)\mathbf Y=-\mathbf y(0)-\mathbf G$, 곧
$$(sI-A)\mathbf Y=\mathbf y(0)+\mathbf G(s)$$
입니다. 이 **연립 일차방정식**을 소거법이나 크래머 공식으로 풀고 역변환합니다[[ch03:4.6|고유값 방법으로 푸는 비동차 연립 ODE.]][[ch06:7.7|크래머 공식.]]. 4장에서 따로 구했던 고유값과 고유벡터가 자동으로 나타납니다.

:::ex 예제 1 (간단한 동차계)
$y_1'=-2y_1+y_2$, $y_2'=y_1-2y_2$, $y_1(0)=1$, $y_2(0)=0$
---
$(s+2)Y_1-Y_2=1$, $-Y_1+(s+2)Y_2=0$. 둘째 식에서 $Y_2=\frac{Y_1}{s+2}$, 첫째에 넣으면
$$Y_1=\frac{s+2}{(s+1)(s+3)}=\frac12\Big(\frac1{s+1}+\frac1{s+3}\Big),\qquad Y_2=\frac12\Big(\frac1{s+1}-\frac1{s+3}\Big)$$
$$y_1=\tfrac12(e^{-t}+e^{-3t}),\qquad y_2=\tfrac12(e^{-t}-e^{-3t})$$
고유값 $-1,-3$과 고유벡터 $(1,1)^T$, $(1,-1)^T$가 그대로 보입니다[[ch03:4.3|고유값 방법.]].
:::

:::ex 예제 2 (유입이 있는 두 탱크)
각 100 L인 탱크 T1, T2가 있다. T1에는 처음에 순수한 물, T2에는 소금 90 kg이 녹아 있다. 바깥에서 농도 0.5 kg/L인 소금물이 8 L/min로 T1에 들어오고, T1에서 T2로 9 L/min, T2에서 T1으로 1 L/min가 흐르며, T2에서 8 L/min가 밖으로 나간다(두 탱크의 물의 양은 일정). 소금의 양 $y_1(t)$, $y_2(t)$를 구하세요.
---
**모델.** 변화율 = 유입 − 유출.
$$y_1'=\underbrace{8(0.5)}_{4}+\frac{1}{100}y_2-\frac{9}{100}y_1,\qquad y_2'=\frac{9}{100}y_1-\frac{9}{100}y_2$$
$y_1(0)=0$, $y_2(0)=90$.

**보조 연립방정식.**
$$(s+0.09)Y_1-0.01Y_2=\frac4s,\qquad-0.09Y_1+(s+0.09)Y_2=90$$
계수 행렬식은 $(s+0.09)^2-0.0009=(s+0.06)(s+0.12)$입니다. 크래머 공식으로 풀고 부분분수로 나누면
$$Y_1=\frac{4.9s+0.36}{s(s+0.06)(s+0.12)}=\frac{50}{s}-\frac{55/3}{s+0.06}-\frac{95/3}{s+0.12},\qquad Y_2=\frac{90s^2+8.1s+0.36}{s(s+0.06)(s+0.12)}=\frac{50}s-\frac{55}{s+0.06}+\frac{95}{s+0.12}$$
**해.**
$$y_1=50-\tfrac{55}3e^{-0.06t}-\tfrac{95}3e^{-0.12t},\qquad y_2=50-55e^{-0.06t}+95e^{-0.12t}$$
**해석.** 둘 다 50 kg (유입 농도 0.5 kg/L × 100 L)으로 갑니다. $y_1$은 단조 증가하지만 $y_2$는 처음에 빠르게 줄다가 평형값 아래로 내려가 $t\approx20.7$분에 최소(약 42 kg)가 되고 다시 50으로 올라갑니다. 최소인 순간 $y_2'=0.09(y_1-y_2)=0$, 곧 $y_1=y_2$이고 그 뒤로는 T1의 소금이 더 많습니다. 고유값 $-0.06$, $-0.12$는 4장의 방법으로 $A$에서 구한 것과 같습니다.
:::

:::fig f05tank
:::

### 2계 연립: 스프링으로 연결된 두 물체

2계 이상의 연립 ODE도 같은 방법으로 풉니다. 질량 1인 두 물체가 스프링 상수 $k$인 스프링 세 개로 위, 가운데, 아래에 연결되어 있고 감쇠는 없다고 합시다. $y_1$, $y_2$를 정적 평형 위치에서의 변위(아래가 양)라 하면, 위 물체에는 위 스프링의 힘 $-ky_1$과 가운데 스프링의 힘 $k(y_2-y_1)$ (가운데 스프링의 알짜 길이 변화가 $y_2-y_1$), 아래 물체에는 $-k(y_2-y_1)$과 아래 스프링의 힘 $-ky_2$가 작용합니다. 뉴턴 법칙으로
$$y_1''=-ky_1+k(y_2-y_1),\qquad y_2''=-k(y_2-y_1)-ky_2$$

:::ex 예제 3 (두 물체의 운동)
$y_1(0)=1$, $y_2(0)=0$, $y_1'(0)=y_2'(0)=0$일 때 운동을 구하세요.
---
보조 연립방정식은
$$(s^2+2k)Y_1-kY_2=s,\qquad-kY_1+(s^2+2k)Y_2=0$$
둘째 식에서 $Y_2=\frac{kY_1}{s^2+2k}$를 첫째에 넣고 $(s^2+2k)^2-k^2=(s^2+k)(s^2+3k)$를 쓰면
$$Y_1=\frac{s(s^2+2k)}{(s^2+k)(s^2+3k)}=\frac12\Big(\frac{s}{s^2+k}+\frac{s}{s^2+3k}\Big),\qquad Y_2=\frac{ks}{(s^2+k)(s^2+3k)}=\frac12\Big(\frac{s}{s^2+k}-\frac{s}{s^2+3k}\Big)$$
$$y_1=\tfrac12\big(\cos\sqrt k\,t+\cos\sqrt{3k}\,t\big),\qquad y_2=\tfrac12\big(\cos\sqrt k\,t-\cos\sqrt{3k}\,t\big)$$
감쇠가 없으므로 각 물체의 운동은 조화 진동의 겹침이고, “느린” 진동 $\cos\sqrt kt$ (두 물체가 같은 방향으로 움직이는 **정규 모드**)와 “빠른” 진동 $\cos\sqrt{3k}t$ (반대 방향으로 움직이는 모드)로 이루어집니다. 초기조건을 $y_1(0)=y_2(0)=1$로 잡으면 느린 모드만, $y_1(0)=-y_2(0)=1$로 잡으면 빠른 모드만 나타납니다.
:::

:::fig f05mass
:::
` },
      { k: '6.8', label: '6.8–6.9', p: '248', title: '일반 공식과 변환표', body: R`
교재 6.8절의 일반 공식을 한 표로 모았습니다. 시험에서는 이 표와 6.1절의 기본 변환표만 있으면 거의 모든 문제가 풀립니다.

| 성질 | $f(t)$ | $F(s)$ |
|---|---|---|
| 정의 | $f(t)$ | $\int_0^\infty e^{-st}f\,dt$ |
| 선형성 | $af+bg$ | $aF+bG$ |
| $s$-이동 | $e^{at}f(t)$ | $F(s-a)$ |
| $t$-이동 | $f(t-a)u(t-a)$ | $e^{-as}F(s)$ |
| 미분 | $f'$ | $sF-f(0)$ |
| 2계 미분 | $f''$ | $s^2F-sf(0)-f'(0)$ |
| $n$계 미분 | $f^{(n)}$ | $s^nF-s^{n-1}f(0)-\cdots-f^{(n-1)}(0)$ |
| 적분 | $\int_0^tf\,d\tau$ | $F/s$ |
| 합성곱 | $f*g$ | $FG$ |
| $t$ 곱하기 | $tf$ | $-F'$ |
| $t$로 나누기 | $f/t$ | $\int_s^\infty F\,d\sigma$ |
| 델타 | $\delta(t-a)$ | $e^{-as}$ |
| 주기 $p$ | $f$ | $\frac{1}{1-e^{-ps}}\int_0^pe^{-st}f\,dt$ |

**자주 쓰는 역변환.**
- $\dfrac{1}{(s-a)^n}\leftrightarrow\dfrac{t^{n-1}}{(n-1)!}e^{at}$
- $\dfrac{1}{(s-a)(s-b)}\leftrightarrow\dfrac{e^{at}-e^{bt}}{a-b}$, $\ \dfrac{s}{(s-a)(s-b)}\leftrightarrow\dfrac{ae^{at}-be^{bt}}{a-b}$
- $\dfrac{1}{s(s^2+\omega^2)}\leftrightarrow\dfrac{1-\cos\omega t}{\omega^2}$, $\ \dfrac{1}{s^2(s^2+\omega^2)}\leftrightarrow\dfrac{\omega t-\sin\omega t}{\omega^3}$ (적분 정리)
- $\dfrac{1}{(s^2+\omega^2)^2}\leftrightarrow\dfrac{\sin\omega t-\omega t\cos\omega t}{2\omega^3}$, $\ \dfrac{s}{(s^2+\omega^2)^2}\leftrightarrow\dfrac{t\sin\omega t}{2\omega}$ (공진)
- $\dfrac1{\sqrt s}\leftrightarrow\dfrac1{\sqrt{\pi t}}$, $\ \dfrac{e^{-k\sqrt s}}{s}$ 같은 무리 함수의 역변환은 교재 6.9절 표(오차함수·베셀 함수가 나옴)를 참고합니다.

:::tip 시험 포인트
라플라스 문제는 거의 항상 부분분수에서 점수가 갈립니다. 분해한 뒤 $s=0$ 같은 값을 넣어 원래 식과 같은지 확인하는 30초가 가장 값진 검산입니다.
:::
` },
    ],
  });
})();
