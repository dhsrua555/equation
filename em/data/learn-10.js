/* 개념 정리 — 10 푸리에 해석 (Kreyszig 10판 11장, §11.1–11.10). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 10,
    summary: R`교재 11장은 세 덩어리입니다. 주기함수를 사인·코사인으로 분해하는 **푸리에 급수**(§11.1–11.4), 삼각함수 대신 다른 직교함수계를 쓰는 **스투름-리우빌 전개**(§11.5–11.6), 주기가 없는 함수를 다루는 **푸리에 적분과 변환**(§11.7–11.9)입니다. 세 덩어리 모두 “직교 기저에 내적으로 사영한다”는 한 가지 아이디어로 묶입니다.`,
    goals: [
      R`오일러 공식으로 푸리에 계수를 구하고 불연속점에서의 수렴값을 말할 수 있다`,
      R`주기 $2L$, 우함수·기함수, 반구간 전개를 상황에 맞게 고를 수 있다`,
      R`주기적 외력을 푸리에 급수로 나누어 정상상태 응답을 구하고, 어느 고조파가 공진하는지 판단할 수 있다`,
      R`푸리에 부분합이 제곱 오차를 최소로 하는 근사임을 설명하고 베셀 부등식·파세발 항등식을 쓸 수 있다`,
      R`스투름-리우빌 문제의 고유함수가 가중 직교함을 알고 일반화된 푸리에 계수를 구할 수 있다`,
      R`푸리에 적분, 사인 적분과 깁스 현상, 코사인·사인 변환, 푸리에 변환과 DFT·FFT의 정의와 성질을 쓸 수 있다`,
    ],
    sections: [
      { k: '11.1', p: '474', title: '푸리에 급수', body: R`
**왜 필요한가.** 공학에서 만나는 주기 신호(엔진의 진동, 교류 전압, 톱니파)는 대부분 사인파 하나로 표현되지 않고, 불연속점도 있습니다. 테일러 급수는 매끄러운 함수에만 쓸 수 있지만 푸리에 급수는 불연속인 주기함수도 표현합니다. 아이디어는 복잡한 파형을 진동수가 $1,2,3,\dots$배인 순수한 사인·코사인의 합으로 분해하는 것입니다. 이렇게 나누어 두면 미분방정식의 외력(§11.3), 함수의 근사(§11.4), 편미분방정식의 풀이(12장)를 모두 “사인파 하나씩” 처리하고 더하면 됩니다.

### 주기함수

:::def 주기함수
모든 $x$에 대해(몇몇 점에서 정의되지 않는 것은 허용)
$$f(x+p)=f(x)$$
를 만족하는 양수 $p$가 있으면 $f$를 **주기함수**, $p$를 **주기**라고 합니다. 양의 주기 가운데 가장 작은 것을 **기본주기**라고 합니다.
:::

- 그래프는 길이 $p$인 아무 구간에서의 그래프를 좌우로 반복해 붙인 모양입니다.
- $p$가 주기이면 $f(x+2p)=f\big((x+p)+p\big)=f(x+p)=f(x)$이므로 $2p$도 주기이고, 같은 방법으로 모든 $np$ ($n=1,2,\dots$)가 주기입니다.
- $f$, $g$가 주기 $p$를 가지면 일차결합 $af+bg$도 주기 $p$를 가집니다.
- $\tan x$는 $x=\pm\frac\pi2,\pm\frac{3\pi}2,\dots$에서 정의되지 않지만 주기 $\pi$인 주기함수입니다. 반면 $x$, $x^2$, $e^x$, $\cosh x$, $\ln x$는 주기함수가 아닙니다.

### 삼각함수계와 삼각급수

:::def 삼각함수계
주기 $2\pi$인 **삼각함수계**는
$$1,\ \cos x,\ \sin x,\ \cos2x,\ \sin2x,\ \dots,\ \cos nx,\ \sin nx,\ \dots$$
입니다. $\cos nx$의 기본주기는 $2\pi/n$이지만 $2\pi$도 주기이므로 모두 주기 $2\pi$를 공유합니다. 이들의 일차결합
$$a_0+\sum_{n=1}^{\infty}\big(a_n\cos nx+b_n\sin nx\big)$$
을 **삼각급수**라고 합니다. 각 항이 주기 $2\pi$이므로 급수가 수렴하면 그 합도 주기 $2\pi$인 함수입니다.
:::

이제 문제를 거꾸로 세웁니다. 주기 $2\pi$인 함수 $f$가 먼저 주어졌을 때, $f$를 나타내는 삼각급수의 계수는 무엇이어야 할까요? 답은 **오일러 공식**입니다.
$$a_0=\frac1{2\pi}\int_{-\pi}^{\pi}f(x)\,dx,\qquad a_n=\frac1\pi\int_{-\pi}^{\pi}f(x)\cos nx\,dx,\qquad b_n=\frac1\pi\int_{-\pi}^{\pi}f(x)\sin nx\,dx$$
이 계수로 만든 급수를 $f$의 **푸리에 급수**, 계수를 **푸리에 계수**라고 합니다. $a_0$는 한 주기에서의 **평균값**입니다. 아래 상자는 다음 절에서 쓸 주기 $2L$ 형태이고, $L=\pi$로 두면 위 식이 됩니다.

:::key 푸리에 계수 (주기 2L)
$$f(x)=a_0+\sum_{n=1}^{\infty}\Big(a_n\cos\frac{n\pi x}{L}+b_n\sin\frac{n\pi x}{L}\Big)$$
$$a_0=\frac1{2L}\int_{-L}^{L}f\,dx,\qquad a_n=\frac1L\int_{-L}^{L}f\cos\frac{n\pi x}{L}\,dx,\qquad b_n=\frac1L\int_{-L}^{L}f\sin\frac{n\pi x}{L}\,dx$$
:::

### 기본 예제: 사각파

공식을 유도하기 전에 한 번 써 봅시다. 다른 함수의 계수도 모두 이 예제와 같은 방식으로 계산합니다.

:::ex 예제 1 (주기적인 사각파)
주기 $2\pi$인 함수
$$f(x)=\begin{cases}-k & -\pi<x<0\\ \ \ k & 0<x<\pi\end{cases},\qquad f(x+2\pi)=f(x)$$
의 푸리에 급수를 구하고, 부분합의 모양을 관찰하세요. 이런 파형은 기계계에 걸리는 외력이나 회로의 기전력으로 자주 나옵니다. 점 하나에서의 값은 적분에 영향을 주지 않으므로 $x=0,\pm\pi$에서의 값은 정하지 않아도 됩니다.
---
**$a_0$.** 한 주기에서 위쪽 넓이 $k\pi$와 아래쪽 넓이 $-k\pi$가 상쇄되므로 적분하지 않아도 $a_0=0$입니다.

**$a_n$.** $f$가 두 식으로 주어지므로 적분을 두 구간으로 나눕니다.
$$a_n=\frac1\pi\Big[\int_{-\pi}^{0}(-k)\cos nx\,dx+\int_0^{\pi}k\cos nx\,dx\Big]=\frac1\pi\Big[-k\,\frac{\sin nx}{n}\Big|_{-\pi}^{0}+k\,\frac{\sin nx}{n}\Big|_{0}^{\pi}\Big]=0$$
$\sin nx$는 $x=-\pi,0,\pi$에서 모두 0이기 때문입니다. 코사인 항이 하나도 없는 급수, 곧 **사인 급수**가 됩니다.

**$b_n$.**
$$b_n=\frac1\pi\Big[\int_{-\pi}^{0}(-k)\sin nx\,dx+\int_0^{\pi}k\sin nx\,dx\Big]=\frac1\pi\Big[k\,\frac{\cos nx}{n}\Big|_{-\pi}^{0}-k\,\frac{\cos nx}{n}\Big|_{0}^{\pi}\Big]$$
$\cos(-\alpha)=\cos\alpha$, $\cos0=1$을 쓰면
$$b_n=\frac{k}{n\pi}\big[\cos0-\cos n\pi-\cos n\pi+\cos0\big]=\frac{2k}{n\pi}\big(1-\cos n\pi\big)$$
$\cos n\pi=(-1)^n$이므로 $1-\cos n\pi$는 $n$이 홀수이면 2, 짝수이면 0입니다. 따라서 $b_1=\frac{4k}{\pi}$, $b_2=0$, $b_3=\frac{4k}{3\pi}$, $b_4=0$, $b_5=\frac{4k}{5\pi},\dots$이고
$$f(x)=\frac{4k}{\pi}\Big(\sin x+\frac13\sin3x+\frac15\sin5x+\cdots\Big)$$

**관찰.**
- 부분합 $S_1=\frac{4k}\pi\sin x$, $S_2=\frac{4k}\pi(\sin x+\frac13\sin3x)$, …는 항이 늘수록 사각파에 가까워집니다(아래 그림). 연속인 사인 곡선들의 합이 불연속 함수를 흉내 내는 셈입니다.
- 불연속점 $x=0,\pm\pi$에서는 모든 부분합이 0입니다. 0은 왼쪽 극한 $-k$와 오른쪽 극한 $k$의 평균이고, 이것은 아래 수렴 정리가 말하는 일반적인 현상입니다.
- 계수는 $1/n$로 천천히 줄어듭니다. 도약(불연속)을 만들어 내려면 높은 진동수 성분이 많이 필요하기 때문입니다.
- $x=\frac\pi2$를 넣으면 $f=k$, $\sin\frac{n\pi}2=1,0,-1,0,1,\dots$이므로
$$k=\frac{4k}\pi\Big(1-\frac13+\frac15-\frac17+\cdots\Big)\quad\Longrightarrow\quad 1-\frac13+\frac15-\frac17+\cdots=\frac\pi4$$
1673년 라이프니츠가 기하적으로 얻은 급수입니다. 푸리에 급수에 특정한 점을 대입하면 이처럼 상수항 급수의 합을 얻을 수 있습니다.
:::

:::fig f10sq
:::

### 오일러 공식은 어디서 오는가: 직교성

계수 공식의 열쇠는 삼각함수계의 **직교성**입니다. 벡터의 내적이 0이면 수직이듯, 함수의 곱을 한 주기에서 적분한 값이 0이면 “직교한다”고 부릅니다.

:::thm 삼각함수계의 직교성 (교재 Theorem 1)
삼각함수계는 $-\pi\le x\le\pi$에서 (주기성 때문에 길이 $2\pi$인 어느 구간에서나) 직교합니다. 정수 $m,n$에 대해
$$\int_{-\pi}^{\pi}\cos nx\cos mx\,dx=0\ \ (n\ne m),\qquad \int_{-\pi}^{\pi}\sin nx\sin mx\,dx=0\ \ (n\ne m),\qquad \int_{-\pi}^{\pi}\sin nx\cos mx\,dx=0$$
이고, 마지막 식은 $n=m$일 때도 성립합니다.
:::

곱을 합으로 바꾸는 공식을 쓰면 바로 보입니다.
$$\cos nx\cos mx=\tfrac12\big[\cos(n+m)x+\cos(n-m)x\big],\qquad \sin nx\sin mx=\tfrac12\big[\cos(n-m)x-\cos(n+m)x\big]$$
0이 아닌 정수 $j$에 대해 $\int_{-\pi}^{\pi}\cos jx\,dx=0$이고, $n\ne m$이면 $n\pm m$이 모두 0이 아니므로 두 적분이 0입니다. 또 $\sin nx\cos mx=\tfrac12[\sin(n+m)x+\sin(n-m)x]$이고 $\int_{-\pi}^{\pi}\sin jx\,dx=0$은 $j=0$을 포함한 **모든** 정수 $j$에 대해 성립하므로, 세 번째 식에는 예외가 없습니다. 같은 함수끼리의 적분은 $\int_{-\pi}^{\pi}\cos^2nx\,dx=\int_{-\pi}^{\pi}\sin^2nx\,dx=\pi$ ($n\ge1$), $\int_{-\pi}^{\pi}1\,dx=2\pi$입니다. 벡터로 치면 “길이의 제곱”입니다.

**계수의 유도.** $f$가 급수로 나타나고 항별 적분이 허용된다고 합시다.

1. 양변을 $-\pi$에서 $\pi$까지 적분하면 사인·코사인 항의 적분은 모두 0이므로 $\int_{-\pi}^{\pi}f\,dx=2\pi a_0$. 이것이 $a_0$ 공식입니다.
2. 양변에 $\cos mx$ ($m\ge1$ 고정)를 곱해 적분합니다.
$$\int_{-\pi}^{\pi}f\cos mx\,dx=a_0\underbrace{\int_{-\pi}^{\pi}\cos mx\,dx}_{0}+\sum_{n=1}^{\infty}\Big(a_n\underbrace{\int_{-\pi}^{\pi}\cos nx\cos mx\,dx}_{n=m\text{일 때만 }\pi}+b_n\underbrace{\int_{-\pi}^{\pi}\sin nx\cos mx\,dx}_{0}\Big)=\pi a_m$$
무한급수가 통째로 한 항으로 줄어듭니다. $\pi$로 나누면 $a_m$ 공식입니다.
3. $\sin mx$를 곱해 적분하면 같은 방식으로 $\int f\sin mx\,dx=\pi b_m$.

이 성질은 벡터의 “수직”과 같은 역할을 합니다. 내적을 $\langle f,g\rangle=\int_{-\pi}^{\pi}fg\,dx$로 정의하면 삼각함수계는 직교 기저가 되고, 계수는 각 기저 방향으로의 성분(사영)입니다[[ch06:7.9c|내적공간의 직교 기저와 정사영. 푸리에 계수 공식은 정사영 공식 $\langle f,\phi\rangle/\|\phi\|^2$ 그 자체입니다.]]. 3차원 벡터 $\mathbf v$의 $x$성분을 $\mathbf v\cdot\mathbf i$로 뽑아내는 것과 똑같습니다.

### 수렴과 합

푸리에 급수로 나타낼 수 있는 함수의 범위는 놀랄 만큼 넓습니다. 조건을 말하려면 한쪽 극한과 한쪽 미분계수가 필요합니다.

- **왼쪽 극한** $f(x_0-0)=\lim_{h\to0^+}f(x_0-h)$, **오른쪽 극한** $f(x_0+0)=\lim_{h\to0^+}f(x_0+h)$.
- **왼쪽 미분계수** $\lim_{h\to0^+}\dfrac{f(x_0-h)-f(x_0-0)}{-h}$, **오른쪽 미분계수** $\lim_{h\to0^+}\dfrac{f(x_0+h)-f(x_0+0)}{h}$. 연속인 점에서는 $f(x_0\mp0)=f(x_0)$입니다.

예를 들어 $f(x)=x^2$ ($x<1$), $f(x)=x/2$ ($x>1$)이면 $f(1-0)=1$, $f(1+0)=\tfrac12$이고, 왼쪽 미분계수는 2, 오른쪽 미분계수는 $\tfrac12$입니다. 점프가 있어도 양쪽 조각이 각각 매끄러우면 한쪽 미분계수는 존재합니다.

:::thm 수렴 정리 (교재 Theorem 2)
주기 $2\pi$인 $f$가 한 주기에서 구간별 연속이고 각 점에서 좌미분계수와 우미분계수를 가지면, 푸리에 급수는 수렴하고 그 합은 연속점에서 $f(x)$, 불연속점에서 좌우 극한의 평균 $\tfrac12\big[f(x^-)+f(x^+)\big]$입니다.
:::

**왜 수렴하는가 (매끄러운 경우).** 완전한 증명은 어렵지만, $f$가 연속이고 $f'$, $f''$도 연속인 경우에는 수렴만큼은 쉽게 보일 수 있습니다. $a_n$을 부분적분하면
$$a_n=\frac1\pi\int_{-\pi}^{\pi}f\cos nx\,dx=\underbrace{\Big[\frac{f\sin nx}{n\pi}\Big]_{-\pi}^{\pi}}_{0}-\frac1{n\pi}\int_{-\pi}^{\pi}f'\sin nx\,dx$$
이고, 한 번 더 부분적분하면
$$a_n=\underbrace{\Big[\frac{f'\cos nx}{n^2\pi}\Big]_{-\pi}^{\pi}}_{0}-\frac1{n^2\pi}\int_{-\pi}^{\pi}f''\cos nx\,dx$$
경계항은 $\sin n\pi=0$과 $f'$의 주기성·연속성 때문에 사라집니다. $|f''|\le M$이고 $|\cos nx|\le1$이므로
$$|a_n|\le\frac1{n^2\pi}\cdot2\pi M=\frac{2M}{n^2},\qquad\text{같은 방법으로 }|b_n|\le\frac{2M}{n^2}$$
따라서 푸리에 급수의 각 항의 절댓값은 수렴하는 급수 $|a_0|+2M\big(1+1+\frac1{2^2}+\frac1{2^2}+\frac1{3^2}+\cdots\big)$의 대응하는 항보다 작고, 비교판정법으로 급수가 수렴합니다. (합이 정확히 $f$라는 것까지 보이려면 더 깊은 도구가 필요합니다. 이 판정은 바이어슈트라스 판정법이라 고른 수렴까지 주고, 위에서 가정한 항별 적분도 정당화합니다[[ch14:15.5|바이어슈트라스 M-판정법과 고른 수렴, 항별 적분.]].)

사각파(예제 1)는 $x=0$에서 왼쪽 극한 $-k$, 오른쪽 극한 $k$를 가지므로 평균은 0이고, 실제로 $x=0$에서 급수의 모든 항이 0이었습니다. 정리와 정확히 일치합니다.

:::ex 예제 2 (반쪽 경사)
$f(x)=0\ (-\pi<x<0)$, $f(x)=x\ (0<x<\pi)$, 주기 $2\pi$의 푸리에 급수를 구하고 $\sum_{m=1}^\infty\frac{1}{(2m-1)^2}$을 계산하세요.
---
$a_0=\frac1{2\pi}\int_0^\pi x\,dx=\frac\pi4$.
$a_n=\frac1\pi\int_0^\pi x\cos nx\,dx=\frac1\pi\Big[\frac{x\sin nx}{n}+\frac{\cos nx}{n^2}\Big]_0^\pi=\frac{\cos n\pi-1}{\pi n^2}$ → 짝수 $n$이면 0, 홀수 $n$이면 $-\frac{2}{\pi n^2}$.
$b_n=\frac1\pi\int_0^\pi x\sin nx\,dx=\frac1\pi\Big[-\frac{x\cos nx}{n}+\frac{\sin nx}{n^2}\Big]_0^\pi=-\frac{\cos n\pi}{n}=\frac{(-1)^{n+1}}{n}$.
$$f(x)=\frac\pi4-\frac2\pi\Big(\cos x+\frac{\cos3x}{9}+\frac{\cos5x}{25}+\cdots\Big)+\Big(\sin x-\frac{\sin2x}2+\frac{\sin3x}3-\cdots\Big)$$
$x=\pi$는 불연속점($f(\pi^-)=\pi$, $f(-\pi^+)=0$)이므로 급수는 평균 $\frac\pi2$로 수렴합니다. 사인항은 모두 0, $\cos(2m-1)\pi=-1$이므로
$$\frac\pi2=\frac\pi4+\frac2\pi\sum\frac1{(2m-1)^2}\ \Longrightarrow\ \sum_{m=1}^\infty\frac1{(2m-1)^2}=\frac{\pi^2}8$$
:::

:::ex 예제 3 (계수 계산 요령)
$f(x)=|x|\ (-\pi<x<\pi)$의 푸리에 급수는?
---
우함수이므로 $b_n=0$ (다음 절). $a_0=\frac1\pi\int_0^\pi x\,dx=\frac\pi2$, $a_n=\frac2\pi\int_0^\pi x\cos nx\,dx=\frac{2(\cos n\pi-1)}{\pi n^2}$.
$$|x|=\frac\pi2-\frac4\pi\Big(\cos x+\frac{\cos3x}{9}+\frac{\cos5x}{25}+\cdots\Big)$$
$|x|$는 연속이므로 계수가 $1/n^2$로 빨리 줄고, 불연속인 예제 1·2의 사인항은 $1/n$로 천천히 줍니다. **불연속이 있으면 계수가 느리게 감소한다**는 것은 일반적인 사실입니다. 위의 부분적분 논증을 거꾸로 읽으면, 함수가 한 번 더 매끄러울 때마다 계수에 $1/n$이 하나씩 더 붙습니다.
:::

:::tip 시험 포인트
$\int x\cos nx\,dx=\frac{x\sin nx}{n}+\frac{\cos nx}{n^2}$, $\int x\sin nx\,dx=-\frac{x\cos nx}{n}+\frac{\sin nx}{n^2}$ 두 개를 외워 두고, $\sin n\pi=0$, $\cos n\pi=(-1)^n$을 바로 대입하세요. 계산의 8할이 이것입니다.
:::

:::warn a₀의 정의
교재는 $a_0$를 평균값 $\frac1{2L}\int f$로 둡니다. $\frac{a_0}2$를 첫 항으로 쓰는 교재·강의도 많으니, 계수 공식과 급수의 첫 항을 한 세트로 기억하세요.
:::
` },
      { k: '11.2', p: '483', title: '임의의 주기, 우함수·기함수, 반구간 전개', body: R`
이 절은 앞 절의 기본 틀을 세 방향으로 넓힙니다.

1. **주기 $2L$**: $x$축의 눈금만 바꾸면 주기 $2\pi$의 결과를 그대로 씁니다.
2. **간단히 하기**: 우함수이면 코사인 항만(**푸리에 코사인 급수**), 기함수이면 사인 항만(**푸리에 사인 급수**) 남습니다.
3. **반구간 전개**: $0<x<L$에서만 주어진 함수를 코사인만 있는 급수나 사인만 있는 급수로 나타냅니다.

### 1. 주기 2π에서 주기 2L로

실제 주기함수의 주기는 $2\pi$가 아닌 경우가 대부분입니다. 주기를 $p=2L$로 쓰는 이유는 12장에서 $L$이 바이올린 현의 길이, 막대의 길이가 되기 때문입니다.

$f$의 주기가 $2L$이면 새 변수
$$v=\frac{\pi x}{L}\qquad\Big(x=\frac{L}{\pi}v\Big)$$
를 도입합니다. $x=\pm L$이 $v=\pm\pi$에 대응하므로 $f$는 $v$의 함수로서 주기 $2\pi$이고, 앞 절의 공식을 그대로 쓸 수 있습니다.
$$a_n=\frac1\pi\int_{-\pi}^{\pi}f\Big(\frac L\pi v\Big)\cos nv\,dv$$
이제 적분변수를 다시 $x$로 바꿉니다. $dv=\frac\pi L\,dx$이고 $v=\pm\pi$는 $x=\pm L$이므로
$$a_n=\frac1\pi\int_{-L}^{L}f(x)\cos\frac{n\pi x}{L}\cdot\frac{\pi}{L}\,dx=\frac1L\int_{-L}^{L}f(x)\cos\frac{n\pi x}{L}\,dx$$
$dx$의 $\frac\pi L$이 앞의 $\frac1\pi$를 $\frac1L$로 바꿉니다. $a_0$, $b_n$도 같은 방식이고, 이것이 앞 절 Key 상자의 공식입니다. 한 주기 길이 $2L$인 구간이면 $[0,2L]$처럼 어디서 적분해도 됩니다.

:::ex 예제 1 (주기 4의 펄스열)
$$f(x)=\begin{cases}0 & -2<x<-1\\ k & -1<x<1\\ 0 & 1<x<2\end{cases},\qquad p=2L=4,\ L=2$$
의 푸리에 급수를 구하세요.
---
$$a_0=\frac1{4}\int_{-1}^{1}k\,dx=\frac k2,\qquad a_n=\frac12\int_{-1}^{1}k\cos\frac{n\pi x}{2}dx=\frac k2\Big[\frac{2}{n\pi}\sin\frac{n\pi x}{2}\Big]_{-1}^{1}=\frac{2k}{n\pi}\sin\frac{n\pi}{2}$$
$\sin\frac{n\pi}2$는 $n=1,2,3,4,\dots$에 대해 $1,0,-1,0,\dots$이므로 $n$이 짝수이면 $a_n=0$, $n=1,5,9,\dots$이면 $a_n=\frac{2k}{n\pi}$, $n=3,7,11,\dots$이면 $a_n=-\frac{2k}{n\pi}$입니다. $f$가 우함수라 $f\sin\frac{n\pi x}2$가 기함수이므로 $b_n=0$입니다.
$$f(x)=\frac k2+\frac{2k}{\pi}\Big(\cos\frac{\pi x}2-\frac13\cos\frac{3\pi x}2+\frac15\cos\frac{5\pi x}2-\cdots\Big)$$
**검산.** $x=0$을 넣으면 앞 절의 라이프니츠 급수 때문에 $\frac k2+\frac{2k}\pi\cdot\frac\pi4=k$로 $f(0)=k$와 일치합니다.
:::

:::ex 예제 2 (척도만 바꾸기)
주기 4인 사각파 $f=-k\ (-2<x<0)$, $f=k\ (0<x<2)$의 급수를 적분하지 않고 구하세요.
---
$L=2$이므로 $v=\frac{\pi x}2$로 두면 $f$는 $v$에 대해 앞 절 예제 1의 사각파입니다. 그 급수에서 $x$ 자리에 $v=\frac{\pi x}{2}$를 넣으면
$$f(x)=\frac{4k}{\pi}\Big(\sin\frac{\pi x}{2}+\frac13\sin\frac{3\pi x}{2}+\frac15\sin\frac{5\pi x}{2}+\cdots\Big)$$
계수는 그대로이고 진동수만 바뀝니다. 공식으로 직접 적분해 보면 같은 답이 나옵니다.
:::

:::ex 예제 3 (반파 정류기)
사인 전압 $E\sin\omega t$가 음의 부분을 잘라 내는 반파 정류기를 통과한 출력
$$u(t)=\begin{cases}0 & -L<t<0\\ E\sin\omega t & 0<t<L\end{cases},\qquad p=2L=\frac{2\pi}{\omega},\ L=\frac\pi\omega$$
의 푸리에 급수를 구하세요.
---
**$a_0$.** 한 주기 중 앞 절반은 0이므로
$$a_0=\frac{\omega}{2\pi}\int_0^{\pi/\omega}E\sin\omega t\,dt=\frac{\omega}{2\pi}\cdot E\Big[-\frac{\cos\omega t}{\omega}\Big]_0^{\pi/\omega}=\frac{\omega}{2\pi}\cdot\frac{2E}{\omega}=\frac E\pi$$
직류 성분(평균)이 $E/\pi\approx0.318E$라는 뜻입니다.

**$a_n$.** $\sin A\cos B=\tfrac12[\sin(A+B)+\sin(A-B)]$로 곱을 합으로 바꾸면
$$a_n=\frac\omega\pi\int_0^{\pi/\omega}E\sin\omega t\cos n\omega t\,dt=\frac{\omega E}{2\pi}\int_0^{\pi/\omega}\big[\sin(1+n)\omega t+\sin(1-n)\omega t\big]dt$$
$n=1$이면 $\int_0^{\pi/\omega}\sin2\omega t\,dt=0$이라 $a_1=0$입니다. $n\ge2$이면
$$a_n=\frac{\omega E}{2\pi}\Big[-\frac{\cos(1+n)\omega t}{(1+n)\omega}-\frac{\cos(1-n)\omega t}{(1-n)\omega}\Big]_0^{\pi/\omega}=\frac{E}{2\pi}\Big(\frac{1-\cos(1+n)\pi}{1+n}+\frac{1-\cos(1-n)\pi}{1-n}\Big)$$
$n$이 홀수이면 $1\pm n$이 짝수라 $\cos(1\pm n)\pi=1$이므로 $a_n=0$입니다. $n$이 짝수이면 $\cos(1\pm n)\pi=-1$이므로
$$a_n=\frac{E}{2\pi}\Big(\frac{2}{1+n}+\frac{2}{1-n}\Big)=\frac{E}{2\pi}\cdot\frac{4}{1-n^2}=-\frac{2E}{(n-1)(n+1)\pi}\qquad(n=2,4,\dots)$$

**$b_n$.** $b_1=\frac\omega\pi\int_0^{\pi/\omega}E\sin^2\omega t\,dt=\frac\omega\pi\cdot E\cdot\frac{\pi}{2\omega}=\frac E2$. $n\ge2$이면 $\sin\omega t\sin n\omega t=\tfrac12[\cos(n-1)\omega t-\cos(n+1)\omega t]$의 반주기 적분이 0이라 $b_n=0$입니다.
$$u(t)=\frac E\pi+\frac E2\sin\omega t-\frac{2E}{\pi}\Big(\frac{\cos2\omega t}{1\cdot3}+\frac{\cos4\omega t}{3\cdot5}+\frac{\cos6\omega t}{5\cdot7}+\cdots\Big)$$
**구조로 이해하기.** $u=\frac E2\big(\sin\omega t+|\sin\omega t|\big)$입니다. $\frac E2\sin\omega t$가 사인 항 하나를 만들고, 나머지 $\frac E2|\sin\omega t|$ (전파 정류 파형의 절반)는 우함수라 코사인 항과 상수만 만듭니다. 계산 결과에서 사인 항이 하나뿐이었던 이유입니다.
:::

:::fig f10rect
:::

### 2. 우함수와 기함수로 계산 줄이기

$f(-x)=f(x)$이면 **우함수**(그래프가 $y$축에 대칭), $f(-x)=-f(x)$이면 **기함수**(원점에 대칭)입니다. 정적분은 부호 있는 넓이이므로
$$\int_{-L}^{L}g\,dx=2\int_0^Lg\,dx\ \ (g\text{ 우함수}),\qquad \int_{-L}^{L}h\,dx=0\ \ (h\text{ 기함수})$$
입니다. 곱의 홀짝은 부호의 곱처럼 계산합니다(우×우=우, 우×기=기, 기×기=우). $\cos$는 우함수, $\sin$은 기함수이므로

- $f$가 우함수이면 $f\sin\frac{n\pi x}L$은 기함수 → $b_n=0$, 그리고 $f\cos\frac{n\pi x}L$은 우함수라 적분을 $2\int_0^L$로 바꿉니다.
- $f$가 기함수이면 $f\cos\frac{n\pi x}L$은 기함수 → $a_0=a_n=0$, $f\sin\frac{n\pi x}L$은 우함수입니다.

:::key 우함수·기함수 급수
$$f\ \text{우함수}:\ f=a_0+\sum a_n\cos\frac{n\pi x}{L},\qquad a_0=\frac1L\int_0^Lf\,dx,\quad a_n=\frac2L\int_0^Lf\cos\frac{n\pi x}{L}\,dx$$
$$f\ \text{기함수}:\ f=\sum b_n\sin\frac{n\pi x}{L},\qquad b_n=\frac2L\int_0^Lf\sin\frac{n\pi x}{L}\,dx$$
:::

앞의 예제에 적용하면, 예제 1의 펄스열은 우함수라 계산 없이도 코사인 급수이고, 앞 절의 사각파와 예제 2는 기함수라 사인 급수입니다.

:::thm 합과 상수배 (교재 Theorem 1)
$f_1+f_2$의 푸리에 계수는 $f_1$, $f_2$의 대응하는 계수의 합이고, $cf$의 계수는 $f$의 계수의 $c$배입니다.
:::

적분이 선형이라서 당연하지만 쓸모가 큽니다. 복잡한 함수를 이미 아는 급수들의 합으로 쪼갤 수 있기 때문입니다.

:::ex 예제 4 (톱니파)
$f(x)=x+\pi\ (-\pi<x<\pi)$, $f(x+2\pi)=f(x)$의 푸리에 급수는?
---
$f=f_1+f_2$, $f_1=x$, $f_2=\pi$로 나눕니다. 상수 $f_2$의 계수는 상수항 $\pi$ 하나뿐이므로, $f$의 계수는 $a_0=\pi$를 빼면 $f_1$의 계수와 같습니다. $f_1$은 기함수이므로 $a_n=0$이고
$$b_n=\frac2\pi\int_0^\pi x\sin nx\,dx=\frac2\pi\Big[-\frac{x\cos nx}{n}+\frac{\sin nx}{n^2}\Big]_0^\pi=-\frac2n\cos n\pi=\frac{2(-1)^{n+1}}{n}$$
$$f(x)=\pi+2\Big(\sin x-\frac12\sin2x+\frac13\sin3x-\frac14\sin4x+\cdots\Big)$$
부분합의 모양은 §11.4의 그림에 있습니다.
:::

:::ex 예제 5 (주기 2)
$f(x)=|x|\ (-1<x<1)$, 주기 2의 푸리에 급수는?
---
$L=1$, 우함수. $a_0=\int_0^1x\,dx=\tfrac12$, $a_n=2\int_0^1x\cos n\pi x\,dx=\dfrac{2(\cos n\pi-1)}{n^2\pi^2}$.
$$|x|=\frac12-\frac4{\pi^2}\Big(\cos\pi x+\frac{\cos3\pi x}9+\cdots\Big)$$
앞 절의 예제 3에서 $x\to\pi x$로 바꾸고 $\frac1\pi$배 한 것과 같습니다.
:::

### 3. 반구간 전개

막대의 온도나 늘어진 현의 모양처럼 함수가 $0<x<L$에서만 주어지는(그리고 거기서만 물리적 의미가 있는) 경우가 많습니다. 이것을 푸리에 급수로 나타내려면 먼저 주기함수로 **확장**해야 하는데, 두 가지 좋은 선택이 있습니다.

- **우함수 확장**: $(-L,0)$에는 $f(-x)$를 채워 $y$축 대칭으로 만들고 주기 $2L$로 반복합니다 → 코사인 급수(위 Key의 우함수 공식).
- **기함수 확장**: $(-L,0)$에는 $-f(-x)$를 채워 원점 대칭으로 만들고 주기 $2L$로 반복합니다 → 사인 급수(기함수 공식).

주기 $L$로 그냥 반복해도 급수는 얻지만 사인과 코사인이 섞입니다. 두 확장은 모두 주기가 $2L$이고, $f$는 주기의 절반에서만 주어지므로 **반구간 전개**라고 부릅니다. 두 급수는 $0<x<L$에서는 같은 $f$를 나타내고, 그 밖에서는 서로 다른 확장을 나타냅니다.

| 확장 | 결과 | 쓰이는 곳 |
|---|---|---|
| 우함수 확장 (주기 $2L$) | 코사인 반구간 전개 | 양 끝이 단열된 막대 |
| 기함수 확장 (주기 $2L$) | 사인 반구간 전개 | 양 끝이 고정된 현, 양 끝 0°인 막대 |

어느 확장을 고르는지는 $f$가 아니라 **경계조건**이 정합니다[[ch11:12.3|양 끝이 고정된 현은 사인 반구간 전개로, 초기 변위의 계수가 바로 $B_n$입니다.]][[ch11:12.6|양 끝 0°인 막대는 사인 전개, 단열된 막대는 코사인 전개로 풉니다.]]. 사인 급수의 모든 항은 $x=0,L$에서 0이므로 끝이 고정된 현에 맞고, 코사인 급수의 모든 항은 $x=0,L$에서 기울기가 0이므로 열이 드나들지 않는 끝에 맞습니다.

:::ex 예제 6 (삼각형과 두 반구간 전개)
가운데를 잡아당긴 현의 모양
$$f(x)=\begin{cases}\dfrac{2k}{L}x & 0<x<\dfrac L2\\[2mm] \dfrac{2k}{L}(L-x) & \dfrac L2<x<L\end{cases}$$
의 두 반구간 전개를 구하세요.
---
**(a) 우함수 확장 (코사인 급수).** 넓이가 밑변 $L$, 높이 $k$인 삼각형이므로 $a_0=\frac1L\cdot\frac{kL}2=\frac k2$. 다음으로
$$a_n=\frac2L\cdot\frac{2k}{L}\Big[\int_0^{L/2}x\cos\frac{n\pi x}{L}dx+\int_{L/2}^{L}(L-x)\cos\frac{n\pi x}{L}dx\Big]$$
첫 적분을 부분적분하면
$$\int_0^{L/2}x\cos\frac{n\pi x}{L}dx=\frac{L}{n\pi}x\sin\frac{n\pi x}{L}\Big|_0^{L/2}-\frac{L}{n\pi}\int_0^{L/2}\sin\frac{n\pi x}{L}dx=\frac{L^2}{2n\pi}\sin\frac{n\pi}2+\frac{L^2}{n^2\pi^2}\Big(\cos\frac{n\pi}2-1\Big)$$
둘째 적분도 같은 방법으로
$$\int_{L/2}^{L}(L-x)\cos\frac{n\pi x}{L}dx=-\frac{L^2}{2n\pi}\sin\frac{n\pi}2-\frac{L^2}{n^2\pi^2}\Big(\cos n\pi-\cos\frac{n\pi}2\Big)$$
더하면 사인 항이 상쇄되고
$$a_n=\frac{4k}{L^2}\cdot\frac{L^2}{n^2\pi^2}\Big(2\cos\frac{n\pi}2-\cos n\pi-1\Big)=\frac{4k}{n^2\pi^2}\Big(2\cos\frac{n\pi}2-\cos n\pi-1\Big)$$
괄호는 $n$이 홀수이면 $0+1-1=0$, $n=4,8,\dots$이면 $2-1-1=0$, $n=2,6,10,\dots$이면 $-2-1-1=-4$입니다. 따라서 $a_2=-\frac{16k}{2^2\pi^2}$, $a_6=-\frac{16k}{6^2\pi^2},\dots$만 남고
$$f(x)=\frac k2-\frac{16k}{\pi^2}\Big(\frac1{2^2}\cos\frac{2\pi x}{L}+\frac1{6^2}\cos\frac{6\pi x}{L}+\frac1{10^2}\cos\frac{10\pi x}{L}+\cdots\Big)$$

**(b) 기함수 확장 (사인 급수).** 같은 방식으로 부분적분하면 이번에는 코사인 항이 상쇄되고
$$b_n=\frac{8k}{n^2\pi^2}\sin\frac{n\pi}2\quad\Longrightarrow\quad f(x)=\frac{8k}{\pi^2}\Big(\frac1{1^2}\sin\frac{\pi x}{L}-\frac1{3^2}\sin\frac{3\pi x}{L}+\frac1{5^2}\sin\frac{5\pi x}{L}-\cdots\Big)$$
두 급수 모두 계수가 $1/n^2$로 줄어듭니다. 두 확장이 모두 연속(꺾인 점만 있음)이기 때문입니다. (b)는 12장에서 가운데를 튕긴 현의 진동을 푸는 데 그대로 쓰입니다.
:::

:::fig f10ext
:::

:::ex 예제 7 (같은 함수, 다른 전개)
$f(x)=x\ (0<x<L)$의 코사인 반구간 전개와 사인 반구간 전개를 구하세요.
---
**코사인** (우함수 확장 = 삼각파): $a_0=\frac L2$, $a_n=\frac2L\int_0^Lx\cos\frac{n\pi x}L dx=\dfrac{2L(\cos n\pi-1)}{n^2\pi^2}$.
$$x=\frac L2-\frac{4L}{\pi^2}\Big(\cos\frac{\pi x}L+\frac19\cos\frac{3\pi x}L+\cdots\Big)$$
**사인** (기함수 확장 = 톱니파): $b_n=\frac2L\int_0^Lx\sin\frac{n\pi x}Ldx=\dfrac{2L(-1)^{n+1}}{n\pi}$.
$$x=\frac{2L}\pi\Big(\sin\frac{\pi x}L-\frac12\sin\frac{2\pi x}L+\cdots\Big)$$
같은 $f$라도 확장이 다르면 급수가 다릅니다. 코사인 쪽은 확장이 연속이라 $1/n^2$, 사인 쪽은 $x=L$에서 도약이 생겨 $1/n$로 감소합니다.
:::

:::warn 깁스 현상
불연속점 근처에서 부분합은 항 수를 늘려도 약 9%(도약 크기의 약 0.09배) 넘쳐 오르는 봉우리를 가집니다. 봉우리는 좁아질 뿐 사라지지 않습니다.[[@base:ch05:5.3|균등수렴: 불연속함수의 푸리에 급수는 균등수렴할 수 없다.]] 단원 표지 그림에서 사각파 부분합의 모서리 봉우리가 그것입니다. 9%라는 숫자가 어디서 나오는지는 §11.7의 사인 적분에서 계산합니다.
:::
` },
      { k: '11.3', p: '492', title: '강제진동', body: R`
2장에서는 외력이 $\cos\omega t$ 하나일 때 공진을 보았습니다[[ch02:2.8|$my''+cy'+ky=F_0\cos\omega t$의 정상상태 진폭 공식과 공진.]]. 질량 $m$, 감쇠 상수 $c$, 스프링 상수 $k$인 계의 변위 $y(t)$는
$$my''+cy'+ky=r(t)$$
를 따르고, 전기 쪽 대응물은 RLC 회로 $LI''+RI'+\frac1CI=E'(t)$입니다[[ch02:2.9|RLC 회로와 질량-스프링계의 대응.]]. 감쇠가 있고($c>0$) 외력이 사인파 하나이면 정상상태 해는 외력과 **같은 진동수**의 조화진동입니다. 그런데 실제 외력은 사각파·톱니파처럼 주기적이지만 사인파가 아닌 경우가 많습니다. 이때 정상상태 해는 외력의 진동수와 그 **정수배 진동수**를 가진 조화진동들의 겹침이고, 그중 하나가 계의 공진 진동수에 가까우면 그 성분이 응답 전체를 지배할 수 있습니다. 푸리에 급수가 이것을 정확히 보여 줍니다.

### 방법

1. 외력 $r(t)$를 푸리에 급수로 나눈다.
2. 각 성분 $a_n\cos nt$ (또는 $b_n\sin nt$)에 대한 정상상태 응답을 미정계수법으로 구한다[[ch02:2.7|미정계수법. 입력 $\sin nt$에 대해 $y_p=A_n\cos nt+B_n\sin nt$.]].
3. 방정식이 선형이므로 응답들을 더한다(중첩 원리).

### 한 성분에 대한 정상상태 응답

$m=1$로 두고 $y''+cy'+ky=a_n\cos nt$를 풉니다. $y_n=A_n\cos nt+B_n\sin nt$로 놓으면
$$y_n'=-nA_n\sin nt+nB_n\cos nt,\qquad y_n''=-n^2\big(A_n\cos nt+B_n\sin nt\big)$$
이고, 방정식에 넣어 $\cos nt$와 $\sin nt$의 계수를 비교하면
$$(k-n^2)A_n+cn\,B_n=a_n,\qquad -cn\,A_n+(k-n^2)B_n=0$$
이 연립방정식을 풀면
$$A_n=\frac{(k-n^2)\,a_n}{D_n},\qquad B_n=\frac{cn\,a_n}{D_n},\qquad D_n=(k-n^2)^2+(cn)^2$$
입니다. 진폭은
$$C_n=\sqrt{A_n^2+B_n^2}=\frac{|a_n|}{\sqrt{D_n}}=\frac{|a_n|}{\sqrt{(k-n^2)^2+(cn)^2}}$$
입력이 $b_n\sin nt$이면 $A_n=-\frac{cn\,b_n}{D_n}$, $B_n=\frac{(k-n^2)b_n}{D_n}$이고 진폭 공식은 같습니다. 분모는 $n^2$이 $k$ (고유진동수 $\omega_0=\sqrt k$의 제곱)에 가까울 때 작아지고, 그때 감쇠 $c$가 작을수록 진폭이 커집니다.

**왜 더해도 되는가.** $y=y_1+y_2+\cdots$를 방정식에 넣고 항별로 미분할 수 있으면, 각 $y_n$이 자기 성분을 만들어 내므로 합은 $r(t)$의 급수 전체를 만듭니다. $C_n$은 $|a_n|/n^2$ 정도로 빠르게 줄어들기 때문에 미분한 급수도 잘 수렴하고, 항별 미분이 정당화됩니다[[ch14:15.5|고른 수렴과 항별 미분.]].

:::ex 예제 1 (삼각파 외력과 3배 진동수 공진)
$y''+0.05y'+9y=r(t)$이고 $r(t)=\frac\pi2-|t|\ (-\pi<t<\pi)$, $r(t+2\pi)=r(t)$입니다. 정상상태 해를 구하고 어느 성분이 지배하는지 판단하세요.
---
**외력의 급수.** $r$은 우함수이므로 코사인 급수입니다. $a_0=\frac1\pi\int_0^\pi(\frac\pi2-t)\,dt=\frac1\pi\big(\frac{\pi^2}2-\frac{\pi^2}2\big)=0$이고
$$a_n=\frac2\pi\int_0^\pi\Big(\frac\pi2-t\Big)\cos nt\,dt=-\frac2\pi\int_0^\pi t\cos nt\,dt=-\frac2\pi\cdot\frac{\cos n\pi-1}{n^2}=\frac{2\big(1-(-1)^n\big)}{\pi n^2}$$
이므로 홀수 $n$에서만 $a_n=\frac{4}{\pi n^2}$이고
$$r(t)=\frac4\pi\Big(\cos t+\frac1{9}\cos3t+\frac1{25}\cos5t+\cdots\Big)$$
**성분별 응답.** $k=9$, $c=0.05$를 진폭 공식에 넣으면

| $n$ | $a_n$ | $D_n=(9-n^2)^2+(0.05n)^2$ | $C_n$ |
|---|---|---|---|
| 1 | 1.2732 | 64.0025 | 0.1592 |
| 3 | 0.1415 | 0.0225 | 0.9431 |
| 5 | 0.0509 | 256.06 | 0.0032 |
| 7 | 0.0260 | 1600.1 | 0.0006 |

입력에서는 $n=3$ 성분이 기본 성분의 $\frac19$밖에 안 되지만, $3^2=9=k$라서 $D_3$가 거의 0입니다. 그래서 출력에서는 $C_3$가 $C_1$의 약 6배로 가장 큽니다. $n=3$에서는 $k-n^2=0$이므로 $A_3=0$, $B_3=\frac{0.15\cdot a_3}{0.0225}\approx0.943$이고
$$y\approx0.943\sin3t+0.159\cos(t-\delta_1)+\cdots$$
입력의 $\cos3t$ 성분보다 위상이 정확히 $90^\circ$ 늦은 진동이 나타납니다(정확한 공진에서의 위상 지연). 감쇠 $c$를 절반으로 줄이면 $C_3$는 거의 두 배가 됩니다.
:::

:::ex 예제 2 (사각파 외력)
$y''+0.1y'+9.1y=r(t)$, $r$은 $\pm1$ 사각파 $r=\frac4\pi\big(\sin t+\frac{\sin3t}3+\frac{\sin5t}5+\cdots\big)$입니다. 어느 성분이 응답을 지배하는가?
---
$b_n=\frac4{n\pi}$ (홀수 $n$)이므로
- $n=1$: $C_1=\dfrac{4/\pi}{\sqrt{8.1^2+0.1^2}}\approx0.157$
- $n=3$: $C_3=\dfrac{4/(3\pi)}{\sqrt{0.1^2+0.3^2}}\approx1.34$
- $n=5$: $C_5=\dfrac{4/(5\pi)}{\sqrt{15.9^2+0.5^2}}\approx0.016$

입력의 기본진동수(1)는 고유진동수 $\sqrt{9.1}\approx3.02$와 멀지만, 3번째 고조파가 거의 공진하여 응답은 주로 진동수 3으로 흔들립니다(아래 그림). 입력에서는 가장 작았던 성분이 출력에서는 가장 큽니다.
:::

:::fig f10forced
:::

**없는 고조파는 공진하지 않는다.** 사각파와 삼각파처럼 반주기 대칭($r(t+\pi)=-r(t)$)인 파형에는 홀수 고조파만 있습니다. 그래서 같은 외력이라도 고유진동수가 $\omega_0=4$ ($k=16$)이면 $n=4$ 성분이 아예 없으므로 공진 증폭이 일어나지 않습니다. 설계에서는 고유진동수를 외력에 **실제로 들어 있는** 고조파에서 멀리 두면 됩니다.

:::tip 시험 포인트
공학수학 2 과제·시험의 단골입니다. 외력의 푸리에 급수 → 성분별 $y_p$ → 합. 공진에 가까운 $n$ (즉 $n^2\approx k$)을 먼저 찾으면 답의 모양을 예상할 수 있습니다. 진폭 공식 $C_n=|a_n|/\sqrt{(k-n^2)^2+(cn)^2}$은 $m=1$일 때입니다. $m\ne1$이면 양변을 $m$으로 나누고 시작하세요.
:::
` },
      { k: '11.4', p: '495', title: '삼각다항식에 의한 근사', body: R`
푸리에 급수는 미분방정식뿐 아니라 **근사 이론**에서도 중요합니다. 실제 계산에서는 무한급수를 끝까지 더할 수 없으므로, 차수 $N$을 고정하고
$$F(x)=A_0+\sum_{n=1}^N(A_n\cos nx+B_n\sin nx)$$
꼴의 **삼각다항식** 중 $f$에 “가장 가까운” 것을 찾아야 합니다. 푸리에 급수의 $N$번째 부분합이 그 답일까요?

### 오차를 무엇으로 잴까

$|f(x)-F(x)|$의 최댓값으로 재면, $f$에 도약이 있을 때 도약 근처에서 오차가 크게 나올 수밖에 없어 전체적으로 좋은 근사도 나쁘게 평가됩니다. 그래서 구간 전체에서의 어긋남을 재는 **제곱 오차**를 씁니다.
$$E=\int_{-\pi}^{\pi}\big(f-F\big)^2dx\ \ \ge0$$

### 최소 제곱 오차의 유도

$(f-F)^2=f^2-2fF+F^2$이므로
$$E=\int_{-\pi}^{\pi}f^2dx-2\int_{-\pi}^{\pi}fF\,dx+\int_{-\pi}^{\pi}F^2dx$$
- $F^2$를 전개하면 직교성 때문에 $\cos^2nx$, $\sin^2nx$의 적분($=\pi$)과 상수의 적분($=2\pi$)만 남습니다: $\int F^2dx=\pi\big(2A_0^2+A_1^2+\cdots+A_N^2+B_1^2+\cdots+B_N^2\big)$.
- $\int fF\,dx$에는 $\int f\cos nx\,dx=\pi a_n$, $\int f\sin nx\,dx=\pi b_n$, $\int f\,dx=2\pi a_0$이 나오므로 $\int fF\,dx=\pi\big(2A_0a_0+\sum(A_na_n+B_nb_n)\big)$.

따라서
$$E=\int_{-\pi}^{\pi}f^2dx-2\pi\Big[2A_0a_0+\sum_{n=1}^N(A_na_n+B_nb_n)\Big]+\pi\Big[2A_0^2+\sum_{n=1}^N(A_n^2+B_n^2)\Big]$$
여기에 $A_n=a_n$, $B_n=b_n$을 넣은 값을 $E^*$라 하면
$$E^*=\int_{-\pi}^{\pi}f^2dx-\pi\Big[2a_0^2+\sum_{n=1}^N(a_n^2+b_n^2)\Big]$$
이고, 두 식을 빼면 적분이 사라지고 완전제곱만 남습니다.
$$E-E^*=\pi\Big\{2(A_0-a_0)^2+\sum_{n=1}^N\big[(A_n-a_n)^2+(B_n-b_n)^2\big]\Big\}\ \ge0$$
등호는 모든 계수가 푸리에 계수와 같을 때만 성립합니다.

:::thm 최소 제곱 오차 (교재 Theorem 1)
$E$가 최소가 될 필요충분조건은 $F$의 계수가 $f$의 푸리에 계수인 것이며, 최솟값은
$$E^*=\int_{-\pi}^{\pi}f^2\,dx-\pi\Big[2a_0^2+\sum_{n=1}^N\big(a_n^2+b_n^2\big)\Big]$$
입니다.
:::

즉 푸리에 부분합은 차수 $N$ 삼각다항식 중 최선의 근사이고, $N$을 늘리면 괄호에 양수가 더해지므로 $E^*$는 늘지 않습니다. 이것은 “부분공간 위로의 정사영이 가장 가까운 점”이라는 기하적 사실과 같습니다[[ch06:7.9c|정규직교기저 $\{v_1,\dots,v_m\}$에 대한 정사영 $w=\sum\langle v,v_i\rangle v_i$는 부분공간에서 $v$에 가장 가까운 벡터입니다.]]. 또 하나의 중요한 결론: $N$을 늘려도 이미 구한 계수는 바뀌지 않습니다. 직교 기저라서 새 방향이 옛 방향과 간섭하지 않기 때문입니다(직교하지 않는 다항식 $1,x,x^2,\dots$로 최소제곱 근사를 하면 차수를 올릴 때마다 모든 계수가 바뀝니다).

### 베셀 부등식과 파세발 항등식

$E^*\ge0$이 모든 $N$에 대해 성립하므로 $N\to\infty$로 보내면 **베셀 부등식**이 나오고, 삼각함수계는 “빠진 방향이 없는”(완비) 계라서 실제로는 등호, 곧 **파세발 항등식**이 성립합니다. 이 절 끝의 복소 형식도 함께 정리해 둡니다. 오일러 공식 $\cos nx=\frac{e^{inx}+e^{-inx}}2$, $\sin nx=\frac{e^{inx}-e^{-inx}}{2i}$를 급수에 넣으면 $a_n\cos nx+b_n\sin nx=c_ne^{inx}+c_{-n}e^{-inx}$ ($c_n=\frac12(a_n-ib_n)$, $c_{-n}=\overline{c_n}$)이 되어 양쪽으로 무한한 합 하나로 합쳐집니다.

:::key 복소 형식과 파세발 항등식
$$\text{베셀: } 2a_0^2+\sum_{n=1}^\infty(a_n^2+b_n^2)\le\frac1\pi\int_{-\pi}^{\pi}f^2\,dx,\qquad \text{파세발: 등호}$$
$$\text{복소 형식: } f=\sum_{n=-\infty}^{\infty}c_ne^{inx},\quad c_n=\frac1{2\pi}\int_{-\pi}^{\pi}f\,e^{-inx}dx=\tfrac12(a_n-ib_n)$$
:::

복소 계수에 대해 파세발 항등식은 $\sum_{n=-\infty}^{\infty}|c_n|^2=\frac1{2\pi}\int_{-\pi}^{\pi}|f|^2dx$로 더 대칭적인 모양이 됩니다. 한 주기 동안의 평균 “에너지”가 각 진동수 성분의 에너지의 합이라는 뜻입니다(§11.9의 스펙트럼 해석).

:::ex 예제 1 (톱니파의 최소 제곱 오차)
$f(x)=x+\pi\ (-\pi<x<\pi)$를 차수 $N$ 삼각다항식으로 근사할 때 최소 제곱 오차 $E^*$를 $N$의 함수로 구하세요.
---
§11.2 예제 4에서 $a_0=\pi$, $a_n=0$, $b_n=\frac{2(-1)^{n+1}}{n}$이므로 $b_n^2=\frac4{n^2}$입니다. 또 $\int_{-\pi}^{\pi}(x+\pi)^2dx=\frac{(2\pi)^3}{3}=\frac{8\pi^3}3$.
$$E^*=\frac{8\pi^3}{3}-\pi\Big(2\pi^2+4\sum_{n=1}^N\frac1{n^2}\Big)=\frac{2\pi^3}{3}-4\pi\sum_{n=1}^N\frac1{n^2}$$

| $N$ | 1 | 2 | 3 | 5 | 10 | 20 | 50 | 100 | 1000 |
|---|---|---|---|---|---|---|---|---|---|
| $E^*$ | 8.105 | 4.963 | 3.567 | 2.279 | 1.196 | 0.613 | 0.249 | 0.125 | 0.013 |

$\sum_{n>N}\frac1{n^2}\approx\frac1N$이므로 $E^*\approx\frac{4\pi}{N}$ 정도로 줄어듭니다. 도약이 있는 함수라 느린 편입니다. $|x|$처럼 연속인 함수는 계수가 $1/n^2$이라 $E^*$가 $1/N^3$ 정도로 훨씬 빨리 줄어듭니다.

$N\to\infty$에서 $E^*\to0$ (파세발)이므로 $4\pi\sum\frac1{n^2}=\frac{2\pi^3}{3}$, 곧
$$\sum_{n=1}^\infty\frac1{n^2}=\frac{\pi^2}{6}$$
:::

:::fig f10saw
:::

그림에서 보듯 $N=20$이면 제곱 오차는 작지만 불연속점 $\pm\pi$ 근처에는 물결이 남습니다. $f$의 값 자체와 부분합의 최대 차이는 거기서 도약의 절반($\pi$)에 가깝습니다. 제곱 오차는 이 좁은 영역의 기여를 작게 평가하므로 이 둘은 모순이 아닙니다.

:::ex 예제 2 (파세발로 급수의 합 구하기)
$x^2=\frac{\pi^2}3+4\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos nx\ (-\pi\le x\le\pi)$를 이용해 $\sum\frac1{n^4}$을 구하세요.
---
$a_0=\frac{\pi^2}3$, $a_n=\frac{4(-1)^n}{n^2}$, $b_n=0$. 파세발 항등식의 오른쪽은 $\frac1\pi\int_{-\pi}^{\pi}x^4dx=\frac{2\pi^4}{5}$이므로
$$2\cdot\frac{\pi^4}{9}+16\sum_{n=1}^\infty\frac1{n^4}=\frac{2\pi^4}5\ \Longrightarrow\ 16\sum\frac1{n^4}=\frac{2\pi^4}{5}-\frac{2\pi^4}{9}=\frac{8\pi^4}{45}\ \Longrightarrow\ \sum_{n=1}^\infty\frac1{n^4}=\frac{\pi^4}{90}$$
:::

:::ex 예제 3 (복소 계수)
$f(x)=x\ (-\pi<x<\pi)$의 복소 푸리에 계수를 구하고 복소 형식의 파세발 항등식을 확인하세요.
---
$c_0=\frac1{2\pi}\int x\,dx=0$. $n\ne0$이면 부분적분으로
$$c_n=\frac1{2\pi}\int_{-\pi}^{\pi}xe^{-inx}dx=\frac1{2\pi}\Big[\frac{xe^{-inx}}{-in}\Big]_{-\pi}^{\pi}+\frac1{2\pi in}\int_{-\pi}^{\pi}e^{-inx}dx=\frac{i(-1)^n}{n}$$
($e^{\mp in\pi}=(-1)^n$, 둘째 적분은 0.) 실수 계수 $b_n=\frac{2(-1)^{n+1}}n$와 비교하면 $c_n=-\frac{i}{2}b_n$ ✓. $|c_n|^2=\frac1{n^2}$이므로
$$\sum_{n\ne0}\frac1{n^2}=\frac1{2\pi}\int_{-\pi}^{\pi}x^2dx=\frac{\pi^2}3\ \Longrightarrow\ \sum_{n=1}^\infty\frac1{n^2}=\frac{\pi^2}6$$
실수 형식에서와 같은 결과입니다.
:::

:::tip 과제·시험 포인트
$\sum1/n^2=\pi^2/6$, $\sum1/n^4=\pi^4/90$처럼 급수의 합을 묻는 문제는 대부분 (1) 특정 점을 대입하거나 (2) 파세발 항등식을 쓰는 두 방법 중 하나로 풉니다. 파세발을 쓸 때는 $a_0$ 앞의 계수 2를 빠뜨리지 마세요($a_0$가 평균값으로 정의되었기 때문입니다).
:::
` },
      { k: '11.5', p: '498', title: '스투름-리우빌 문제와 직교함수', body: R`
푸리에 급수가 잘 작동한 이유는 삼각함수계가 **직교**하기 때문이었습니다. 그렇다면 다른 직교함수계—르장드르 다항식, 베셀 함수—로도 급수를 만들 수 있을까요? 답은 “그렇다”이고, 그 틀이 스투름-리우빌 문제입니다. 핵심은 “이런 꼴의 고유값 문제의 해(고유함수)는 자동으로 직교한다”는 정리입니다. 그러면 직교성을 함수마다 따로 계산할 필요 없이, 방정식을 이 꼴로 쓰기만 하면 됩니다.

:::def 스투름-리우빌 문제
구간 $a\le x\le b$에서
$$\big[p(x)y'\big]'+\big[q(x)+\lambda r(x)\big]y=0$$
과 경계조건 $k_1y(a)+k_2y'(a)=0$, $l_1y(b)+l_2y'(b)=0$을 함께 푸는 문제입니다($k_1,k_2$ 중 적어도 하나, $l_1,l_2$ 중 적어도 하나는 0이 아님). $\lambda$는 매개변수입니다. $y\equiv0$ 말고 해가 존재하는 $\lambda$를 **고유값**, 그 해를 **고유함수**라 합니다.
:::

이것은 구간의 두 끝점에서 조건을 주는 **경계값 문제**입니다. 초기값 문제와 달리 경계값 문제는 해가 없거나 여러 개일 수 있고, $y\equiv0$은 모든 $\lambda$에 대해 자명한 해입니다. 우리가 찾는 것은 자명하지 않은 해가 생기는 특별한 $\lambda$들입니다.

:::ex 예제 1 (진동하는 현: 삼각함수가 고유함수)
$y''+\lambda y=0$, $y(0)=0$, $y(\pi)=0$의 고유값과 고유함수를 구하세요.
---
$p=r=1$, $q=0$, $a=0$, $b=\pi$, $k_1=l_1=1$, $k_2=l_2=0$인 스투름-리우빌 문제입니다. $\lambda$의 부호에 따라 나눕니다.

- $\lambda=-\nu^2<0$: 일반해 $y=c_1e^{\nu x}+c_2e^{-\nu x}$. $y(0)=c_1+c_2=0$, $y(\pi)=c_1e^{\nu\pi}+c_2e^{-\nu\pi}=0$에서 $c_1(e^{\nu\pi}-e^{-\nu\pi})=0$이므로 $c_1=c_2=0$. 고유함수가 아닙니다.
- $\lambda=0$: $y=c_1+c_2x$, 두 조건에서 $c_1=c_2=0$.
- $\lambda=\nu^2>0$: $y=A\cos\nu x+B\sin\nu x$. $y(0)=A=0$, $y(\pi)=B\sin\nu\pi=0$. $B\ne0$이려면 $\sin\nu\pi=0$, 곧 $\nu=1,2,3,\dots$

따라서 고유값은 $\lambda=\nu^2=1,4,9,16,\dots$, 고유함수는 $y=\sin\nu x$ ($\nu=1,2,\dots$, 상수배는 자유)입니다. 양 끝을 고정한 현을 조금 늘였다 놓으면 변위 $u(x,t)$의 공간 부분이 이 문제를 풉니다(12장). 푸리에 급수의 삼각함수계가 바로 이 문제의 해라는 점이 중요합니다.
:::

일반적으로 $p,q,r,p'$이 실수값 연속함수이고 $r$이 구간에서 한 부호(예: $r>0$)를 가지면, 스투름-리우빌 문제의 **고유값은 모두 실수**이고 무한히 많습니다. 고유값이 진동수나 에너지처럼 물리량과 연결되는 경우가 많으니 실수라는 것은 자연스러운 기대입니다.

### 직교함수

:::def 가중 직교와 노름
$$(y_m,y_n)=\int_a^b r(x)\,y_m(x)y_n(x)\,dx=0\ (m\ne n),\qquad \|y_m\|=\sqrt{(y_m,y_m)}=\sqrt{\int_a^b r\,y_m^2\,dx}$$
가중함수 $r(x)>0$을 곱한 내적으로 직교성을 잽니다. 모든 노름이 1이면 **정규직교**이고, 크로네커 델타로 $(y_m,y_n)=\delta_{mn}$ ($m=n$이면 1, 아니면 0)이라 씁니다. $r\equiv1$이면 그냥 “직교”라 합니다.
:::

예를 들어 $y_m=\sin mx$ ($m=1,2,\dots$)는 $-\pi\le x\le\pi$에서 직교하고($m\ne n$이면 $\int\sin mx\sin nx\,dx=0$), 노름은 $\|y_m\|^2=\int_{-\pi}^{\pi}\sin^2mx\,dx=\pi$이므로 $\|y_m\|=\sqrt\pi$입니다. 노름으로 나눈
$$\frac{\sin x}{\sqrt\pi},\ \frac{\sin2x}{\sqrt\pi},\ \frac{\sin3x}{\sqrt\pi},\ \dots$$
는 정규직교계입니다.

:::thm 고유함수의 직교성 (교재 Theorem 1)
$p,q,r,p'$이 실수값 연속함수이고 $r>0$이면, 서로 다른 고유값에 대응하는 고유함수는 가중함수 $r$에 대해 직교합니다. $p(a)=0$이면 $a$에서의 경계조건을, $p(b)=0$이면 $b$에서의 경계조건을 빼고 대신 해가 유계일 것을 요구할 수 있습니다(특이 문제). $p(a)=p(b)$이면 주기 경계조건 $y(a)=y(b)$, $y'(a)=y'(b)$도 됩니다. 또한 고유값은 모두 실수입니다.
:::

### 왜 직교하는가

$y_m$, $y_n$이 각각 고유값 $\lambda_m\ne\lambda_n$의 고유함수라 하면
$$(py_m')'+(q+\lambda_mr)y_m=0,\qquad (py_n')'+(q+\lambda_nr)y_n=0$$
첫 식에 $y_n$, 둘째 식에 $y_m$을 곱해 빼면 $q$ 항이 사라지고
$$(\lambda_m-\lambda_n)\,r\,y_my_n=y_m(py_n')'-y_n(py_m')'=\big[p\,(y_n'y_m-y_m'y_n)\big]'$$
마지막 등호는 오른쪽을 미분해 보면 확인됩니다($p\,y_n'y_m'$ 항이 상쇄). $a$에서 $b$까지 적분하면
$$(\lambda_m-\lambda_n)\int_a^b r\,y_my_n\,dx=\Big[p\,(y_n'y_m-y_m'y_n)\Big]_a^b$$
이제 경계조건으로 오른쪽이 0임을 보이면 됩니다. 예를 들어 $x=a$에서 $k_1y_n+k_2y_n'=0$, $k_1y_m+k_2y_m'=0$이고 $k_2\ne0$이면, 첫 식에 $y_m(a)$, 둘째 식에 $y_n(a)$를 곱해 빼면 $k_2\big(y_n'y_m-y_m'y_n\big)(a)=0$입니다. ($k_2=0$이면 $k_1\ne0$이고 $y_m(a)=y_n(a)=0$이라 바로 0.) $x=b$도 같습니다. $p(a)=0$이면 경계조건 없이도 $a$에서의 항이 0이고, $p(a)=p(b)$이면 주기 조건으로 두 끝의 항이 상쇄됩니다. $\lambda_m\ne\lambda_n$이므로 적분이 0, 곧 직교입니다.

이 정리는 실대칭행렬의 서로 다른 고유값의 고유벡터가 직교하는 것과 같은 구조입니다[[ch07:8.3|실대칭행렬: 고유값은 실수, 서로 다른 고유값의 고유벡터는 직교.]]. 미분연산자 $L[y]=-(py')'-qy$가 경계조건 아래에서 “대칭”(자기수반)이기 때문입니다. 위의 경계항이 0이라는 것이 바로 $(L[y_m],y_n)=(y_m,L[y_n])$라는 대칭성입니다.

:::ex 예제 2 (한쪽 고정, 한쪽 자유)
$y''+\lambda y=0$, $y(0)=0$, $y'(\pi)=0$의 고유값과 고유함수는?
---
$p=r=1$, $q=0$. $\lambda\le0$이면 예제 1과 같은 이유로 $y\equiv0$. $\lambda=k^2>0$이면 $y=A\cos kx+B\sin kx$, $y(0)=0$에서 $A=0$, $y'(\pi)=Bk\cos k\pi=0$에서 $k=\tfrac12,\tfrac32,\tfrac52,\dots$
$$\lambda_m=\Big(\frac{2m-1}{2}\Big)^2,\qquad y_m=\sin\frac{(2m-1)x}{2}\qquad(m=1,2,\dots)$$
한쪽이 고정되고 한쪽이 자유로운 막대의 진동 모드입니다. 정리에 의해 이들은 $[0,\pi]$에서 서로 직교합니다. 예를 들어 $\int_0^\pi\sin\frac x2\sin\frac{3x}2dx=\frac12\int_0^\pi(\cos x-\cos2x)\,dx=0$ ✓.
:::

:::fig f10sl
:::

:::ex 예제 3 (주기 경계조건)
$y''+\lambda y=0$, $y(-\pi)=y(\pi)$, $y'(-\pi)=y'(\pi)$의 고유값과 고유함수는?
---
$p=1$이라 $p(-\pi)=p(\pi)$이므로 주기 스투름-리우빌 문제입니다. $\lambda<0$이면 지수함수는 주기 조건을 만족하지 못해 $y\equiv0$. $\lambda=0$이면 $y=c_1+c_2x$에서 $c_2=0$, 곧 상수 $y=1$이 고유함수. $\lambda=\nu^2>0$이면 $y=A\cos\nu x+B\sin\nu x$이고 $y(-\pi)=y(\pi)$에서 $2B\sin\nu\pi=0$, $y'(-\pi)=y'(\pi)$에서 $2A\nu\sin\nu\pi=0$. $A,B$가 모두 0이 아니려면 $\sin\nu\pi=0$, 곧 $\nu=n=1,2,\dots$이고 이때 $A,B$는 **둘 다 자유**입니다.

고유값 $n^2$마다 고유함수가 $\cos nx$, $\sin nx$ 두 개씩 있고, 이들을 모두 모은 것이 $1,\cos x,\sin x,\cos2x,\dots$—정확히 삼각함수계입니다. 같은 고유값에 속한 $\cos nx$와 $\sin nx$의 직교성은 정리가 보장하지 않지만(정리는 서로 다른 고유값만 다룸), 직접 계산하면 역시 직교합니다.
:::

:::ex 예제 4 (르장드르 다항식)
르장드르 방정식 $(1-x^2)y''-2xy'+n(n+1)y=0$을 스투름-리우빌 꼴로 쓰세요.
---
$(1-x^2)y''-2xy'=\big[(1-x^2)y'\big]'$이므로 $p=1-x^2$, $q=0$, $r=1$, $\lambda=n(n+1)$. $p(\pm1)=0$이라 경계조건 없이 “유계인 해”를 요구하는 특이 문제이고, 그 고유함수가 $P_n$입니다. 따라서 $\int_{-1}^1P_mP_n\,dx=0\ (m\ne n)$[[ch04:5.2|르장드르 다항식과 그 직교성·노름 $\frac2{2n+1}$.]].
:::

:::ex 예제 5 (베셀 함수)
$x^2y''+xy'+(k^2x^2-n^2)y=0$ ($0\le x\le R$, $y(R)=0$)을 스투름-리우빌 꼴로 쓰세요.
---
$x$로 나누면 $(xy')'+\big(-\frac{n^2}x+k^2x\big)y=0$. $p=x$, $q=-n^2/x$, $r=x$, $\lambda=k^2$. 해는 $J_n(kx)$이고 $y(R)=0$에서 $kR$이 $J_n$의 영점 $\alpha_{n,m}$이어야 합니다. $p(0)=0$이라 $x=0$에서는 경계조건 대신 유계 조건을 씁니다. 가중함수가 $x$인 것이 원형 영역의 넓이 요소 $r\,dr$에서 온다는 점을 기억하세요[[ch04:5.4|베셀 방정식과 $J_n$.]][[ch11:12.10|원형 막의 진동에서 이 고유함수가 반지름 방향 모양이 됩니다.]].
:::

### 스투름-리우빌 꼴로 바꾸는 법

$y''+f(x)y'+\big(g(x)+\lambda h(x)\big)y=0$ 꼴이면 $p=e^{\int f\,dx}$를 곱합니다. $p'=fp$이므로 $py''+fpy'=(py')'$가 되어
$$(py')'+\big(pg+\lambda\,ph\big)y=0,\qquad q=pg,\quad r=ph$$
를 얻습니다. $y''$의 계수가 1이 아니면 먼저 나누세요.

- **에르미트**: $y''-2xy'+2ny=0$. $f=-2x$이므로 $p=e^{-x^2}$, $\big(e^{-x^2}y'\big)'+2n\,e^{-x^2}y=0$ → $r=e^{-x^2}$, $\lambda=2n$ (구간 $-\infty<x<\infty$).
- **체비쇼프**: $(1-x^2)y''-xy'+n^2y=0$. $1-x^2$으로 나누면 $f=\frac{-x}{1-x^2}$, $p=e^{\frac12\ln(1-x^2)}=\sqrt{1-x^2}$, $\big(\sqrt{1-x^2}\,y'\big)'+\frac{n^2}{\sqrt{1-x^2}}y=0$ → $r=\frac1{\sqrt{1-x^2}}$.
- **라게르**: $xy''+(1-x)y'+ny=0$. $x$로 나누면 $f=\frac1x-1$, $p=xe^{-x}$, $\big(xe^{-x}y'\big)'+ne^{-x}y=0$ → $r=e^{-x}$ ($0<x<\infty$).

그래서 에르미트 다항식은 가중함수 $e^{-x^2}$, 체비쇼프 다항식은 $\frac1{\sqrt{1-x^2}}$, 라게르 다항식은 $e^{-x}$에 대해 직교합니다.

:::tip 과제 포인트
“주어진 방정식을 스투름-리우빌 꼴로 쓰고 $p,q,r,\lambda$를 말하라”는 형태가 자주 나옵니다. $y''$의 계수를 $P$라 할 때 적분인자 $\frac1P e^{\int Q/P\,dx}$를 곱하면 항상 이 꼴로 만들 수 있습니다. 고유값 문제에서는 $\lambda<0$, $\lambda=0$, $\lambda>0$ 세 경우를 모두 확인하는 것이 채점 포인트입니다.
:::
` },
      { k: '11.6', p: '504', title: '직교급수와 일반화된 푸리에 급수', body: R`
정규직교(또는 직교) 함수계 $y_0,y_1,\dots$가 가중함수 $r$에 대해 $a\le x\le b$에서 직교하고, $f$가
$$f(x)=\sum_{m=0}^{\infty}a_my_m(x)=a_0y_0+a_1y_1+a_2y_2+\cdots$$
로 나타난다고 합시다. 이것을 **직교급수**(직교전개, 일반화된 푸리에 급수)라 하고, $y_m$이 스투름-리우빌 문제의 고유함수이면 **고유함수 전개**라 합니다. 계수는 **푸리에 상수**라 부릅니다.

### 계수 공식의 유도

§11.1과 똑같이 합니다. 양변에 $r(x)y_n(x)$ ($n$ 고정)를 곱하고 $a$에서 $b$까지 적분하되, 항별 적분이 허용된다고 합시다(예: 고른 수렴).
$$(f,y_n)=\int_a^b rfy_n\,dx=\sum_{m=0}^{\infty}a_m\int_a^b ry_my_n\,dx=\sum_{m=0}^\infty a_m(y_m,y_n)$$
직교성 때문에 $m=n$인 항만 남아 $(f,y_n)=a_n\|y_n\|^2$입니다. 노름이 0이 아니면 나눌 수 있습니다.

:::key 일반화된 푸리에 급수
$$f=\sum_{m=0}^\infty a_my_m,\qquad a_m=\frac{(f,y_m)}{\|y_m\|^2}=\frac{1}{\|y_m\|^2}\int_a^b r\,f\,y_m\,dx$$
$$\text{푸리에-르장드르: } a_m=\frac{2m+1}{2}\int_{-1}^1f\,P_m\,dx$$
$$\text{푸리에-베셀: } a_m=\frac{2}{R^2J_{n+1}^2(\alpha_{n,m})}\int_0^Rx\,f(x)\,J_n\Big(\frac{\alpha_{n,m}}{R}x\Big)dx$$
:::

이 공식은 §11.1의 오일러 공식과 그 유도 원리(직교성)를 그대로 일반화한 것입니다.

### 푸리에-르장드르 급수

르장드르 다항식은 §11.5 예제 4의 특이 스투름-리우빌 문제의 고유함수이고, 가중함수는 $r=1$, 노름은
$$\|P_m\|^2=\int_{-1}^1P_m^2\,dx=\frac{2}{2m+1}$$
입니다(증명은 로드리게스 공식을 쓰는 까다로운 계산). 그래서 계수가 $\frac{2m+1}2\int_{-1}^1fP_m\,dx$입니다. $P_0=1$, $P_1=x$, $P_2=\frac12(3x^2-1)$, $P_3=\frac12(5x^3-3x)$, $P_5=\frac18(63x^5-70x^3+15x)$.

:::ex 예제 1 (sin πx의 전개)
$f(x)=\sin\pi x$를 $-1\le x\le1$에서 푸리에-르장드르 급수로 전개하세요.
---
**어느 계수가 0인가.** $\sin\pi x$는 기함수이고 $P_m$은 $m$이 짝수이면 우함수, 홀수이면 기함수입니다. 짝수 $m$이면 $fP_m$이 기함수라 적분이 0이므로 **홀수 번째 계수만** 남습니다.

**$a_1$.** 부분적분으로
$$a_1=\frac32\int_{-1}^1x\sin\pi x\,dx=\frac32\cdot2\int_0^1x\sin\pi x\,dx=3\Big[-\frac{x\cos\pi x}{\pi}+\frac{\sin\pi x}{\pi^2}\Big]_0^1=\frac3\pi\approx0.95493$$
나머지도 같은 방식(또는 수치적분)으로 구하면
$$\sin\pi x=0.95493P_1(x)-1.15824P_3(x)+0.21929P_5(x)-0.01664P_7(x)+0.00068P_9(x)-\cdots$$
**왜 $a_3$가 가장 큰가.** $\sin\pi x$는 $[-1,1]$에서 $x=\pm\frac12$에 봉우리가 있고 끝점 $\pm1$에서 다시 0으로 내려옵니다. 직선 $P_1$은 이렇게 휘어 내려오는 모양을 전혀 만들 수 없고, 3차 모양 $P_3$가 그 휨을 담당합니다. 실제로 $x=1$에서 $0.955-1.158+0.219-\cdots\approx0$이 되려면 $P_3$ 계수가 커야 합니다. 세 항의 합은 사인 곡선과 그림에서 구별이 어려울 만큼 가깝습니다.
:::

:::fig f10leg
:::

:::ex 예제 2 (|x|의 2차 근사)
$f(x)=|x|$를 $[-1,1]$에서 $P_0,P_2$까지 전개하세요.
---
$|x|$는 우함수라 홀수 $m$의 계수는 0. $a_0=\frac12\int_{-1}^1|x|dx=\frac12$.
$a_2=\frac52\int_{-1}^1|x|\cdot\frac{3x^2-1}2dx=\frac52\cdot2\cdot\frac12\int_0^1(3x^3-x)dx=\frac52\cdot\frac14=\frac58$.
$$|x|\approx\frac12+\frac58P_2(x)=\frac{15x^2+3}{16}$$
이것은 2차 이하 다항식 중 $\int_{-1}^1(f-p)^2dx$를 최소로 하는 다항식입니다. 다항식 공간으로의 정사영과 같은 계산입니다[[ch06:7.9c|정사영이 최선 근사인 이유와 $e^x$의 2차 근사 예제.]].
:::

### 푸리에-베셀 급수

원형 막의 진동(§12.10)처럼 원대칭인 문제에서 쓰는 급수입니다. 세 단계로 만듭니다.

**1단계: 베셀 방정식을 스투름-리우빌 꼴로.** $J_n(\tilde x)$은 $\tilde x^2\ddot J_n+\tilde x\dot J_n+(\tilde x^2-n^2)J_n=0$ (점은 $\tilde x$에 대한 미분)을 만족합니다. $\tilde x=kx$로 두면 연쇄법칙으로 $\dot J_n=J_n'/k$, $\ddot J_n=J_n''/k^2$이고 앞의 두 항에서 $k$가 약분되어
$$x^2J_n''(kx)+xJ_n'(kx)+(k^2x^2-n^2)J_n(kx)=0$$
$x$로 나누고 $\big(xJ_n'(kx)\big)'=xJ_n''(kx)+J_n'(kx)$를 쓰면
$$\big[xJ_n'(kx)\big]'+\Big(-\frac{n^2}{x}+\lambda x\Big)J_n(kx)=0,\qquad\lambda=k^2$$
곧 $p=x$, $q=-\frac{n^2}x$, $r=x$입니다. ($q$가 0에서 불연속이지만 직교성 증명에는 지장이 없습니다.)

**2단계: 직교성.** $p(0)=0$이므로 §11.5의 정리에 의해, $x=R$에서 0이 되는 해들
$$J_n(kR)=0\ \Longrightarrow\ kR=\alpha_{n,m},\quad k_{n,m}=\frac{\alpha_{n,m}}R\quad(m=1,2,\dots)$$
는 서로 직교합니다. $\alpha_{n,m}$은 $J_n$의 $m$번째 양의 영점이고, $J_n$은 무한히 많은 영점을 가집니다($J_0$: 2.405, 5.520, 8.654, 11.792, …).

:::thm 베셀 함수의 직교성 (교재 §11.6 Theorem 1)
각각의 고정된 $n\ge0$에 대해 $J_n(k_{n,1}x),J_n(k_{n,2}x),\dots$는 $0\le x\le R$에서 가중함수 $x$에 대해 직교합니다.
$$\int_0^R x\,J_n(k_{n,m}x)J_n(k_{n,j}x)\,dx=0\qquad(j\ne m)$$
:::

**3단계: 급수.** $f(x)=\sum_{m=1}^\infty a_mJ_n(k_{n,m}x)$의 계수는 위 Key의 푸리에-베셀 공식이고, 분모는 노름
$$\|J_n(k_{n,m}x)\|^2=\int_0^RxJ_n^2(k_{n,m}x)\,dx=\frac{R^2}{2}J_{n+1}^2(\alpha_{n,m})$$
에서 옵니다(증명 생략).

:::ex 예제 3 (1 − x²의 푸리에-베셀 전개)
$R=1$, $n=0$으로 $f(x)=1-x^2$을 $J_0(\lambda x)$ ($\lambda=\alpha_{0,m}$)로 전개하세요.
---
계수는 $a_m=\dfrac{2}{J_1^2(\lambda)}\displaystyle\int_0^1x(1-x^2)J_0(\lambda x)\,dx$입니다. 베셀 함수의 미분 공식 $\big[x^\nu J_\nu(x)\big]'=x^\nu J_{\nu-1}(x)$[[ch04:5.4|베셀 함수의 도함수 공식 $(x^\nu J_\nu)'=x^\nu J_{\nu-1}$.]]에서 $\big[xJ_1(\lambda x)\big]'=\lambda xJ_0(\lambda x)$, $\big[x^2J_2(\lambda x)\big]'=\lambda x^2J_1(\lambda x)$입니다.

**첫 부분적분** ($u=1-x^2$, $dv=xJ_0(\lambda x)dx$, $v=\frac1\lambda xJ_1(\lambda x)$):
$$\int_0^1(1-x^2)xJ_0(\lambda x)\,dx=\underbrace{\Big[\frac{(1-x^2)xJ_1(\lambda x)}{\lambda}\Big]_0^1}_{0}+\frac2\lambda\int_0^1x^2J_1(\lambda x)\,dx$$
**두 번째 공식으로**: $\int_0^1x^2J_1(\lambda x)\,dx=\frac1\lambda\big[x^2J_2(\lambda x)\big]_0^1=\frac{J_2(\lambda)}\lambda$. 따라서
$$a_m=\frac{2}{J_1^2(\lambda)}\cdot\frac{2J_2(\lambda)}{\lambda^2}=\frac{4J_2(\lambda)}{\lambda^2J_1^2(\lambda)}$$
수치값($J_2=\frac{2}{\lambda}J_1-J_0$이고 $J_0(\lambda)=0$이므로 $J_2(\lambda)=\frac2\lambda J_1(\lambda)$)을 넣으면
$$1-x^2=1.1081J_0(2.405x)-0.1398J_0(5.520x)+0.0455J_0(8.654x)-0.0210J_0(11.792x)+\cdots$$
사실 $J_2(\lambda)=\frac2\lambda J_1(\lambda)$를 넣으면 $a_m=\frac{8}{\lambda^3J_1(\lambda)}$로 더 간단해집니다.
:::

:::fig f10fb
:::

:::ex 예제 4 (가중함수가 필요한 이유)
$J_0(\alpha_{0,1}x)$와 $J_0(\alpha_{0,2}x)$가 $[0,1]$에서 가중함수 $x$로 직교하는 이유는?
---
둘 다 §11.5 예제 5의 스투름-리우빌 문제($n=0$, $R=1$)의 고유함수이고 고유값 $\alpha_{0,1}^2\ne\alpha_{0,2}^2$이 다르기 때문입니다. 가중함수 없이 $\int_0^1J_0(\alpha_{0,1}x)J_0(\alpha_{0,2}x)dx$는 0이 아닙니다.
:::

### 평균 제곱 수렴과 완비성

일반화된 푸리에 급수는 보통 점마다가 아니라 **노름으로**(평균 제곱으로) 수렴한다고 말합니다. 부분합 $s_k=\sum_{m=0}^ka_my_m$에 대해
$$\lim_{k\to\infty}\|s_k-f\|^2=\lim_{k\to\infty}\int_a^b r(x)\big[s_k(x)-f(x)\big]^2dx=0$$
이면 급수가 $f$를 나타낸다고 합니다. §11.4의 제곱 오차를 가중함수까지 넣어 일반화한 것입니다.

**베셀 부등식의 유도.** $y_m$이 정규직교라 하면 $a_m=(f,y_m)$이고
$$\int_a^b r(s_k-f)^2dx=\underbrace{\int_a^b rs_k^2dx}_{\sum a_m^2}-2\underbrace{\int_a^b rfs_k\,dx}_{\sum a_m^2}+\int_a^b rf^2dx=\|f\|^2-\sum_{m=0}^ka_m^2\ \ge0$$
왼쪽이 음이 아니므로(가중함수가 양수!) 모든 $k$에 대해 $\sum_{m=0}^ka_m^2\le\|f\|^2$이고, 왼쪽은 위로 유계인 증가수열이라 $k\to\infty$에서도
$$\sum_{m=0}^\infty a_m^2\le\|f\|^2\qquad\text{(베셀 부등식)}$$

**완비성.** 정규직교계가 함수 집합 $S$에서 **완비**(complete)라는 것은, $S$의 모든 $f$를 $a_0y_0+\cdots+a_ky_k$로 노름에서 원하는 만큼 가깝게 근사할 수 있다는 뜻입니다. 이때 위 계산에서 오차가 0으로 가므로 등호, 곧 **파세발 등식**
$$\sum_{m=0}^\infty a_m^2=\|f\|^2=\int_a^b r(x)f(x)^2dx$$
이 성립합니다(직교계이면 왼쪽이 $\sum a_m^2\|y_m\|^2$).

:::thm 완비성 (교재 §11.6 Theorem 2)
$y_0,y_1,\dots$가 $S$에서 완비인 정규직교계이면, $S$의 함수 $f$가 모든 $y_m$과 직교할 때 $\|f\|=0$입니다. 특히 $f$가 연속이면 $f\equiv0$입니다.
:::

$f$가 모든 $y_m$과 직교하면 모든 $a_m=0$이므로 파세발 등식에서 $\|f\|^2=0$입니다. $r>0$이고 $f$가 연속이면 $\int rf^2=0$에서 $f\equiv0$입니다. 거꾸로 말하면, 완비계에는 “빠진 방향”이 없습니다. 힐베르트 공간에서 본 파세발 항등식이 바로 이것입니다[[ch06:7.9c|힐베르트 공간과 베셀 부등식·파세발 항등식.]].

:::tip 시험 포인트
가중함수를 빠뜨리는 실수가 가장 많습니다. 르장드르는 $r=1$, 베셀은 $r=x$, 에르미트는 $r=e^{-x^2}$입니다. 계수를 구할 때는 분모의 노름 제곱($\frac2{2m+1}$, $\frac{R^2}2J_{n+1}^2$)도 함께 챙기세요.
:::
` },
      { k: '11.7', p: '510', title: '푸리에 적분', body: R`
푸리에 급수는 주기함수나 유한 구간에서만 관심 있는 함수에 강력합니다. 그런데 많은 문제는 **주기가 없고 $x$축 전체에서 정의된** 함수를 다룹니다. 한 번만 치는 펄스, 한쪽으로 영원히 감쇠하는 신호가 그렇습니다. 이런 함수에 푸리에 급수의 방법을 넓히는 것이 **푸리에 적분**입니다. 아이디어는 “주기를 무한대로 보내면 급수가 적분이 된다”입니다. 먼저 구체적인 함수로 무슨 일이 생기는지 보고, 일반적인 경우로 넘어갑니다.

### 주기를 늘려 보기: 사각파의 스펙트럼

폭 2인 펄스를 주기 $2L$ ($L>1$)로 반복한 사각파
$$f_L(x)=\begin{cases}0 & -L<x<-1\\ 1 & -1<x<1\\ 0 & 1<x<L\end{cases}$$
를 생각합니다. $L\to\infty$이면 이웃 펄스가 무한히 멀어져 펄스 하나만 남은 비주기 함수 $f(x)$ ($|x|<1$에서 1, 나머지에서 0)가 됩니다.

$f_L$은 우함수라 $b_n=0$이고, §11.2의 공식으로
$$a_0=\frac1{2L}\int_{-1}^{1}dx=\frac1L,\qquad a_n=\frac1L\int_{-1}^{1}\cos\frac{n\pi x}{L}dx=\frac2L\int_0^1\cos\frac{n\pi x}Ldx=\frac2L\cdot\frac{\sin(n\pi/L)}{n\pi/L}$$
입니다. $w_n=\frac{n\pi}{L}$으로 쓰면 $a_n=\frac2L\frac{\sin w_n}{w_n}$입니다. 계수의 크기 $|a_n|$은 진동수 $w_n$인 성분의 최대 진폭이므로, 점 $(w_n,a_n)$들을 **진폭 스펙트럼**이라 합니다.

- 점들은 모두 곡선 $\frac2L\frac{\sin w}{w}$ 위에 있고, 간격은 $\Delta w=\frac\pi L$입니다.
- $2L=4,8,16$이면 곡선의 한 “반파”(길이 $\pi$) 안에 들어가는 점이 1, 3, 7개로 늘어납니다. $2L=2^k$이면 $2^{k-1}-1$개입니다.
- 주기가 커지면 점들은 $w$축 위에서 점점 촘촘해지고(결국 조밀해지고), 높이는 $\frac2L$ 배율 때문에 0으로 줄어듭니다.

:::fig f10spec
:::

점들의 “높이” 대신 “밀도”를 보면 극한이 살아남습니다. 이것이 다음 유도의 핵심입니다.

### 급수에서 적분으로

이제 일반적인 주기 $2L$ 함수 $f_L$의 급수에서 $L\to\infty$로 보냅니다.
$$f_L(x)=a_0+\sum_{n=1}^\infty\big(a_n\cos w_nx+b_n\sin w_nx\big),\qquad w_n=\frac{n\pi}{L}$$
오일러 공식의 적분변수를 $v$로 써서 계수를 넣으면
$$f_L(x)=\frac1{2L}\int_{-L}^{L}f_L(v)\,dv+\frac1L\sum_{n=1}^\infty\Big[\cos w_nx\int_{-L}^{L}f_L(v)\cos w_nv\,dv+\sin w_nx\int_{-L}^{L}f_L(v)\sin w_nv\,dv\Big]$$
진동수 간격 $\Delta w=w_{n+1}-w_n=\frac{\pi}{L}$을 쓰면 $\frac1L=\frac{\Delta w}{\pi}$이므로
$$f_L(x)=\frac1{2L}\int_{-L}^{L}f_L\,dv+\frac1\pi\sum_{n=1}^\infty\Big[(\cos w_nx)\,\Delta w\int_{-L}^{L}f_L(v)\cos w_nv\,dv+(\sin w_nx)\,\Delta w\int_{-L}^{L}f_L(v)\sin w_nv\,dv\Big]$$
이 식은 아무리 큰 유한한 $L$에서도 정확합니다. 이제 $L\to\infty$로 보내고, 극한 함수 $f$가 **절대 적분 가능**하다고 가정합니다.
$$\int_{-\infty}^{\infty}|f(x)|\,dx=\lim_{a\to-\infty}\int_a^0|f|\,dx+\lim_{b\to\infty}\int_0^b|f|\,dx<\infty$$
그러면

- 첫 항은 $\big|\frac1{2L}\int f_L\big|\le\frac1{2L}\int|f|\to0$으로 사라집니다(평균값이 0으로).
- $\Delta w=\frac\pi L\to0$이므로 $\sum(\cdots)\Delta w$는 $w$에 대한 리만 합처럼 보이고, $0$에서 $\infty$까지의 적분이 될 것으로 기대됩니다.

$$f(x)=\frac1\pi\int_0^\infty\Big[\cos wx\int_{-\infty}^{\infty}f(v)\cos wv\,dv+\sin wx\int_{-\infty}^{\infty}f(v)\sin wv\,dv\Big]dw$$
안쪽 적분을 $A(w)$, $B(w)$로 이름 붙이면 다음 표현을 얻습니다. 진동수 $w$가 이제 $\frac{n\pi}L$의 배수로 제한되지 않고 **모든 양수 값**을 가집니다.

:::key 푸리에 적분
$$f(x)=\int_0^\infty\big[A(w)\cos wx+B(w)\sin wx\big]dw$$
$$A(w)=\frac1\pi\int_{-\infty}^{\infty}f(v)\cos wv\,dv,\qquad B(w)=\frac1\pi\int_{-\infty}^{\infty}f(v)\sin wv\,dv$$
:::

이 유도는 결과를 **짐작하게** 할 뿐 증명은 아닙니다. 무한 구간에서 리만 합의 극한이 곧 적분이라는 보장이 없기 때문입니다. 성립 조건은 다음 정리가 줍니다.

:::thm 존재 조건 (교재 Theorem 1)
$f$가 모든 유한 구간에서 구간별 연속이고 좌우 미분계수를 가지며 $\int_{-\infty}^\infty|f|\,dx$가 수렴하면, 푸리에 적분은 연속점에서 $f(x)$, 불연속점에서 좌우 극한의 평균을 나타냅니다.
:::

§11.1의 수렴 정리와 조건·결론이 거의 같고, 주기성 대신 절대 적분 가능성이 들어갔습니다. 푸리에 적분의 주된 쓰임은 무한 영역의 미분방정식(§12.7)이지만, 다음 예제처럼 **정적분을 계산**하거나 적분으로 정의된 함수를 이해하는 데도 쓰입니다.

### 사각 펄스: 사인 적분, 디리클레 불연속 인자, 깁스 현상

:::ex 예제 1 (단일 펄스)
$$f(x)=\begin{cases}1 & |x|<1\\ 0 & |x|>1\end{cases}$$
(a) 푸리에 적분 표현을 구하고, (b) 이로부터 얻는 정적분을 정리하고, (c) 적분 상한을 유한한 $a$에서 끊은 근사가 어떻게 행동하는지 설명하세요.
---
**(a) 표현.** 정의대로 적분하면
$$A(w)=\frac1\pi\int_{-\infty}^{\infty}f(v)\cos wv\,dv=\frac1\pi\int_{-1}^{1}\cos wv\,dv=\frac1\pi\Big[\frac{\sin wv}{w}\Big]_{-1}^{1}=\frac{2\sin w}{\pi w}$$
$$B(w)=\frac1\pi\int_{-1}^{1}\sin wv\,dv=0\qquad(\text{피적분함수가 기함수})$$
따라서
$$f(x)=\frac2\pi\int_0^\infty\frac{\cos wx\,\sin w}{w}\,dw$$
$A(w)$는 앞의 스펙트럼 그림에서 점들이 올라앉아 있던 곡선 $\frac{\sin w}{w}$와 같은 모양입니다. 급수의 이산 스펙트럼이 적분의 연속 스펙트럼으로 바뀐 것입니다.

**(b) 디리클레 불연속 인자.** $x=\pm1$은 불연속점이고 좌우 극한의 평균은 $\frac{1+0}2=\frac12$입니다. 위 식과 정리 1에서 양변에 $\frac\pi2$를 곱하면
$$\int_0^\infty\frac{\cos wx\,\sin w}{w}\,dw=\begin{cases}\pi/2 & 0\le x<1\\ \pi/4 & x=1\\ 0 & x>1\end{cases}$$
($x<0$은 피적분함수가 $x$에 대해 우함수이므로 $|x|$로 판단합니다.) 매개변수 $x$가 1을 지나는 순간 적분값이 $\frac\pi2$에서 0으로 뚝 떨어지므로 이 적분을 **디리클레 불연속 인자**라고 부릅니다. 연속함수들의 적분이 불연속 함수를 만든다는 점이 푸리에 급수 때와 같습니다.

특히 $x=0$이면
$$\int_0^\infty\frac{\sin w}{w}\,dw=\frac\pi2$$
입니다. $\frac{\sin w}w$는 초등함수로 된 부정적분이 없어서 미적분의 방법으로는 이 값을 구할 수 없는데, 푸리에 적분이 공짜로 줍니다. (이 적분은 $\int_0^\infty\frac{|\sin w|}{w}dw=\infty$라 절대수렴하지 않고, 양·음 넓이가 번갈아 상쇄되며 조건수렴합니다.)

**(c) 사인 적분과 유한 상한 근사.** 위 적분의 상한을 $u$로 둔 함수
$$\operatorname{Si}(u)=\int_0^u\frac{\sin w}{w}\,dw$$
를 **사인 적분**이라 합니다. (b)의 결과는 $\operatorname{Si}(u)\to\frac\pi2$ ($u\to\infty$)라는 뜻입니다. 성질을 정리하면

- 피적분함수가 우함수이므로 $\operatorname{Si}$는 기함수: $\operatorname{Si}(-u)=-\operatorname{Si}(u)$.
- $\operatorname{Si}'(u)=\frac{\sin u}{u}$가 $u=\pi,2\pi,3\pi,\dots$에서 부호를 바꾸므로 거기서 극대·극소가 번갈아 나타나고, 물결의 크기가 줄어들며 $\frac\pi2$ 주위로 수렴합니다.
- 가장 높은 곳은 첫 극대 $\operatorname{Si}(\pi)\approx1.8519$로, 극한 $\frac\pi2\approx1.5708$보다 약 18% 높습니다.

:::fig f10si
:::

푸리에 급수에서 부분합이 근사 곡선이었듯, 푸리에 적분에서는 상한 $\infty$를 유한한 $a$로 바꾼
$$\frac2\pi\int_0^a\frac{\cos wx\,\sin w}{w}\,dw$$
가 $f(x)$의 근사입니다. 이것을 사인 적분으로 나타내 봅시다. 곱을 합으로 바꾸면 $\sin w\cos wx=\frac12\big[\sin(w+wx)+\sin(w-wx)\big]$이므로
$$\frac2\pi\int_0^a\frac{\cos wx\,\sin w}{w}\,dw=\frac1\pi\int_0^a\frac{\sin\big((1+x)w\big)}{w}\,dw+\frac1\pi\int_0^a\frac{\sin\big((1-x)w\big)}{w}\,dw$$
첫 적분에서 $t=(1+x)w$로 치환하면 $\frac{dw}w=\frac{dt}t$이고 $0\le w\le a$는 $0\le t\le(x+1)a$에 대응하므로 $\operatorname{Si}\big((x+1)a\big)$가 됩니다. 둘째 적분에서 $t=(1-x)w$로 치환하면 $\operatorname{Si}\big((1-x)a\big)=-\operatorname{Si}\big((x-1)a\big)$입니다($\operatorname{Si}$가 기함수). 따라서
$$\frac2\pi\int_0^a\frac{\cos wx\,\sin w}{w}\,dw=\frac1\pi\operatorname{Si}\big(a[x+1]\big)-\frac1\pi\operatorname{Si}\big(a[x-1]\big)$$

**깁스 현상.** 이 식이 모든 것을 설명합니다. $x=1$ 근처를 봅시다. $a$가 크면 첫 항은 $\frac1\pi\operatorname{Si}(2a)\approx\frac12$로 거의 상수이고, 둘째 항 $-\frac1\pi\operatorname{Si}\big(a[x-1]\big)$이 $x$가 1을 지날 때 $+\frac12$에서 $-\frac12$로 넘어가는 모양을 만듭니다. 그 모양은 사인 적분 곡선을 가로로 $\frac1a$배 압축한 것 그대로입니다. 그래서

- $a$를 키워도 물결의 **높이는 그대로**이고, 위치만 불연속점 쪽으로 $\frac1a$에 비례해 좁혀집니다.
- 가장 높은 봉우리는 $a(x-1)=-\pi$, 곧 $x=1-\frac\pi a$에서 생기고 높이는 약 $\frac12+\frac1\pi\operatorname{Si}(\pi)\approx0.5+0.5895=1.0895$입니다.
- 즉 도약 크기 1의 약 **9%만큼 넘쳐 오르고**, 이 넘침은 $a\to\infty$에서도 사라지지 않습니다.

푸리에 급수의 부분합에서 본 깁스 현상(§11.2)도 같은 원리이고 같은 9%입니다.
:::

:::fig f10gibbs
:::

### 푸리에 코사인 적분과 사인 적분

푸리에 급수가 우함수·기함수에서 간단해졌듯이 푸리에 적분도 그렇습니다.

- $f$가 **우함수**이면 $B(w)$의 피적분함수 $f(v)\sin wv$가 기함수라 $B=0$이고, $A(w)$의 피적분함수는 우함수라 적분을 $2\int_0^\infty$로 바꿉니다.
$$f(x)=\int_0^\infty A(w)\cos wx\,dw,\qquad A(w)=\frac2\pi\int_0^\infty f(v)\cos wv\,dv\qquad\text{(푸리에 코사인 적분)}$$
- $f$가 **기함수**이면 $A=0$이고
$$f(x)=\int_0^\infty B(w)\sin wx\,dw,\qquad B(w)=\frac2\pi\int_0^\infty f(v)\sin wv\,dv\qquad\text{(푸리에 사인 적분)}$$

$x>0$에서만 주어진 함수는 반구간 전개처럼 우함수로 확장해 코사인 적분을, 기함수로 확장해 사인 적분을 쓸 수 있습니다. 두 표현은 $x>0$에서는 같은 $f$를 나타냅니다.

:::ex 예제 2 (라플라스 적분)
$f(x)=e^{-kx}\ (x>0,\ k>0)$의 코사인 적분과 사인 적분 표현을 구하고, 이로부터 두 정적분(라플라스 적분)의 값을 구하세요.
---
**(a) 코사인 적분.** $A(w)=\frac2\pi\int_0^\infty e^{-kv}\cos wv\,dv$입니다. 부분적분을 두 번 하거나 미분해서 확인하면
$$\int e^{-kv}\cos wv\,dv=\frac{e^{-kv}}{k^2+w^2}\big(w\sin wv-k\cos wv\big)$$
입니다(오른쪽을 미분하면 $e^{-kv}\cos wv$). $v=0$에서 값은 $-\frac{k}{k^2+w^2}$, $v\to\infty$에서는 지수 인자 때문에 0이므로
$$A(w)=\frac2\pi\cdot\frac{k}{k^2+w^2},\qquad e^{-kx}=\frac{2k}\pi\int_0^\infty\frac{\cos wx}{k^2+w^2}\,dw\quad(x>0)$$
따라서
$$\int_0^\infty\frac{\cos wx}{k^2+w^2}\,dw=\frac{\pi}{2k}e^{-kx}\qquad(x>0,\ k>0)$$
**검산**: $x=0$이면 왼쪽은 $\frac1k\arctan\frac wk\Big|_0^\infty=\frac{\pi}{2k}$로 오른쪽과 같습니다(우함수 확장 $e^{-k|x|}$는 $x=0$에서 연속이라 등식이 $x=0$에서도 성립).

**(b) 사인 적분.** 같은 방법으로
$$\int e^{-kv}\sin wv\,dv=-\frac{e^{-kv}}{k^2+w^2}\big(k\sin wv+w\cos wv\big)$$
이고 $v=0$에서 $-\frac{w}{k^2+w^2}$, $v\to\infty$에서 0이므로
$$B(w)=\frac2\pi\cdot\frac{w}{k^2+w^2},\qquad \int_0^\infty\frac{w\sin wx}{k^2+w^2}\,dw=\frac\pi2e^{-kx}\qquad(x>0,\ k>0)$$
$x=0$에서는 왼쪽이 0인데 $f(0^+)=1$입니다. 기함수 확장은 $x=0$에서 $-1$에서 $1$로 도약하므로 평균 0이 맞고, 정리 1과 일치합니다.

이런 정적분은 보통의 적분법으로는 구하기 어렵습니다. 복소해석의 유수로도 같은 값을 얻습니다[[ch14:16.4|유수로 계산하는 푸리에형 실적분.]].
:::

:::tip 시험 포인트
“푸리에 적분 표현을 구하고, 이를 이용해 정적분 $\int_0^\infty\cdots dw$의 값을 구하라”가 전형적인 출제 형태입니다. (1) $A$, $B$ 계산 → (2) 표현식 → (3) 특정 $x$ 대입, 불연속점이면 **평균값**. 세 번째 단계에서 불연속점 처리를 빠뜨리지 마세요.
:::
` },
      { k: '11.8', p: '518', title: '푸리에 코사인·사인 변환', body: R`
**적분 변환**은 주어진 함수를 적분을 통해 다른 변수의 새 함수로 바꾸는 연산입니다. 6장의 라플라스 변환이 대표적이고, 공학에서 그다음으로 중요한 것이 푸리에 변환입니다. 쓰는 이유는 같습니다. 미분을 **대수 연산**으로 바꾸어 미분방정식을 쉽게 만들기 때문입니다. 이 절에서는 실수값인 두 변환(코사인·사인)을, 다음 절에서 복소 변환을 다룹니다.

### 푸리에 적분에서 변환으로

우함수 $f$의 푸리에 코사인 적분은 $f(x)=\int_0^\infty A(w)\cos wx\,dw$, $A(w)=\frac2\pi\int_0^\infty f(v)\cos wv\,dv$였습니다. 여기서 $A(w)=\sqrt{\frac2\pi}\,\hat f_c(w)$로 이름을 바꾸고 $v$를 $x$로 쓰면
$$\hat f_c(w)=\sqrt{\frac\pi2}A(w)=\sqrt{\frac2\pi}\int_0^\infty f(x)\cos wx\,dx,\qquad f(x)=\sqrt{\frac2\pi}\int_0^\infty\hat f_c(w)\cos wx\,dw$$
가 됩니다. 상수 $\frac2\pi$를 두 식에 $\sqrt{\frac2\pi}$씩 **대칭으로** 나눈 것이 전부입니다. 사인 쪽도 $B(w)=\sqrt{\frac2\pi}\hat f_s(w)$로 두면 같은 모양이 됩니다.

:::def 코사인·사인 변환
$$\hat f_c(w)=\sqrt{\frac2\pi}\int_0^\infty f(x)\cos wx\,dx,\qquad f(x)=\sqrt{\frac2\pi}\int_0^\infty\hat f_c(w)\cos wx\,dw$$
$$\hat f_s(w)=\sqrt{\frac2\pi}\int_0^\infty f(x)\sin wx\,dx,\qquad f(x)=\sqrt{\frac2\pi}\int_0^\infty\hat f_s(w)\sin wx\,dw$$
:::

왼쪽 식이 **변환**, 오른쪽 식이 **역변환**입니다. 기호로 $\mathcal F_c(f)=\hat f_c$, $\mathcal F_s(f)=\hat f_s$, 역변환은 $\mathcal F_c^{-1}$, $\mathcal F_s^{-1}$로 씁니다. $f$가 양의 $x$축에서 절대 적분 가능하고 모든 유한 구간에서 구간별 연속이면 두 변환이 존재합니다.

:::ex 예제 1 (유한한 구간의 상수)
$f(x)=k\ (0<x<a)$, $f(x)=0\ (x>a)$의 코사인·사인 변환을 구하세요.
---
$$\hat f_c(w)=\sqrt{\frac2\pi}\,k\int_0^a\cos wx\,dx=\sqrt{\frac2\pi}\,k\,\frac{\sin aw}{w},\qquad \hat f_s(w)=\sqrt{\frac2\pi}\,k\int_0^a\sin wx\,dx=\sqrt{\frac2\pi}\,k\,\frac{1-\cos aw}{w}$$
$a\to\infty$로 보낸 $f\equiv k$ ($0<x<\infty$)는 변환이 **없습니다**. $\int_0^\infty\cos wx\,dx$가 수렴하지 않고 진동하기 때문이고, 근본적으로는 $f$가 절대 적분 가능하지 않기 때문입니다.
:::

:::ex 예제 2 (지수함수의 코사인 변환)
$\mathcal F_c(e^{-x})$를 구하세요.
---
§11.7 예제 2의 부정적분($k=1$)을 쓰면
$$\mathcal F_c(e^{-x})=\sqrt{\frac2\pi}\int_0^\infty e^{-x}\cos wx\,dx=\sqrt{\frac2\pi}\Big[\frac{e^{-x}(w\sin wx-\cos wx)}{1+w^2}\Big]_0^\infty=\sqrt{\frac2\pi}\,\frac{1}{1+w^2}$$
:::

### 선형성과 도함수의 변환

무엇을 얻었을까요? 기호만 바꾼 것 같지만, 이 변환들은 라플라스 변환처럼 미분을 대수 연산으로 바꾸는 **연산 성질**을 가집니다. 먼저 적분이 선형이므로
$$\mathcal F_c(af+bg)=a\mathcal F_c(f)+b\mathcal F_c(g),\qquad \mathcal F_s(af+bg)=a\mathcal F_s(f)+b\mathcal F_s(g)$$

:::thm 도함수의 코사인·사인 변환 (교재 §11.8 Theorem 1)
$f$가 연속이고 $x$축에서 절대 적분 가능하며, $f'$이 모든 유한 구간에서 구간별 연속이고 $x\to\infty$에서 $f\to0$이면
$$\mathcal F_c\{f'\}=w\,\mathcal F_s\{f\}-\sqrt{\tfrac2\pi}\,f(0),\qquad \mathcal F_s\{f'\}=-w\,\mathcal F_c\{f\}$$
:::

증명은 부분적분 한 번입니다.
$$\mathcal F_c\{f'\}=\sqrt{\frac2\pi}\int_0^\infty f'\cos wx\,dx=\sqrt{\frac2\pi}\Big[f\cos wx\Big]_0^\infty+w\sqrt{\frac2\pi}\int_0^\infty f\sin wx\,dx=-\sqrt{\frac2\pi}f(0)+w\mathcal F_s\{f\}$$
$$\mathcal F_s\{f'\}=\sqrt{\frac2\pi}\Big[f\sin wx\Big]_0^\infty-w\sqrt{\frac2\pi}\int_0^\infty f\cos wx\,dx=0-w\mathcal F_c\{f\}$$
($x\to\infty$에서 $f\to0$이라 경계항이 사라지고, $x=0$에서는 $\cos0=1$, $\sin0=0$.) 이 공식을 두 번 쓰면 2계 도함수의 변환이 나옵니다.
$$\mathcal F_c\{f''\}=w\,\mathcal F_s\{f'\}-\sqrt{\tfrac2\pi}f'(0)=-w^2\hat f_c-\sqrt{\tfrac2\pi}f'(0),\qquad \mathcal F_s\{f''\}=-w\,\mathcal F_c\{f'\}=-w^2\hat f_s+\sqrt{\tfrac2\pi}\,wf(0)$$
그래서 반무한 영역 $x\ge0$의 PDE에서 **경계에서 $u$가 주어지면 사인 변환**, **$u_x$가 주어지면 코사인 변환**을 씁니다. 필요한 경계값이 정확히 그 변환의 공식에 나타나기 때문입니다[[ch11:12.7|반무한 막대의 열전도를 사인 변환으로 푸는 방법.]]. 라플라스 변환이 초기값을 끌어들이는 것과 같은 원리입니다[[ch05:6.2|$\mathcal L(f'')=s^2F-sf(0)-f'(0)$.]].

:::ex 예제 3 (연산 공식으로 변환 구하기)
$f(x)=e^{-ax}\ (a>0)$의 코사인 변환을 적분하지 않고 구하세요.
---
미분하면 $(e^{-ax})''=a^2e^{-ax}$, 곧 $a^2f=f''$입니다. 양변의 코사인 변환을 취하고 선형성과 2계 도함수 공식을 쓰면($f'(0)=-a$)
$$a^2\mathcal F_c(f)=\mathcal F_c(f'')=-w^2\mathcal F_c(f)-\sqrt{\tfrac2\pi}f'(0)=-w^2\mathcal F_c(f)+a\sqrt{\tfrac2\pi}$$
따라서 $(a^2+w^2)\mathcal F_c(f)=a\sqrt{\frac2\pi}$, 곧
$$\mathcal F_c(e^{-ax})=\sqrt{\frac2\pi}\,\frac{a}{a^2+w^2}$$
:::

:::ex 예제 4 (사인 변환도 같은 방법으로)
$f(x)=e^{-ax}\ (a>0)$의 사인 변환은?
---
$f(0)=1$이므로 사인 변환의 2계 도함수 공식에서 $a^2\hat f_s=-w^2\hat f_s+\sqrt{\frac2\pi}\,w$, 곧
$$\hat f_s=\sqrt{\frac2\pi}\frac{w}{a^2+w^2}$$
§11.7 예제 2의 $B(w)$에 $\sqrt{\pi/2}$를 곱한 것과 같습니다 ✓.
:::

**자주 쓰는 변환 쌍** (교재 §11.10의 표에서 발췌)

| $f(x)$ ($x>0$) | $\hat f_c(w)$ | $\hat f_s(w)$ |
|---|---|---|
| $1$ ($0<x<a$), $0$ (그 밖) | $\sqrt{\frac2\pi}\frac{\sin aw}{w}$ | $\sqrt{\frac2\pi}\frac{1-\cos aw}{w}$ |
| $e^{-ax}$ ($a>0$) | $\sqrt{\frac2\pi}\frac{a}{a^2+w^2}$ | $\sqrt{\frac2\pi}\frac{w}{a^2+w^2}$ |
| $e^{-x^2/2}$ | $e^{-w^2/2}$ | — |
| $xe^{-x^2/2}$ | — | $we^{-w^2/2}$ |

가우스 함수 $e^{-x^2/2}$는 코사인 변환이 자기 자신이라는 특별한 성질을 가집니다(다음 절에서 유도).
` },
      { k: '11.9', p: '522', title: '푸리에 변환, 이산·고속 푸리에 변환', body: R`
앞 절의 두 변환은 실수값이지만 우함수·기함수 성질에 기대고 $x>0$에서만 정의됩니다. 이 절에서는 $x$축 전체의 함수를 한 번에 다루는 복소 변환, **푸리에 변환**을 복소 푸리에 적분에서 얻습니다. 그리고 컴퓨터에서 쓰는 이산 버전(DFT)과 그 빠른 계산법(FFT)을 봅니다.

### 푸리에 적분의 복소 형식

실수 푸리에 적분에 $A$, $B$를 넣으면
$$f(x)=\frac1\pi\int_0^\infty\int_{-\infty}^{\infty}f(v)\big[\cos wv\cos wx+\sin wv\sin wx\big]dv\,dw$$
코사인의 덧셈정리로 괄호는 $\cos(wx-wv)$이므로
$$f(x)=\frac1\pi\int_0^\infty\Big[\int_{-\infty}^{\infty}f(v)\cos(wx-wv)\,dv\Big]dw$$
대괄호 안의 적분을 $F(w)$라 하면, $\cos(wx-wv)$가 $w$의 우함수이고 $v$에 대해 적분하므로 $F$도 $w$의 우함수입니다. 따라서 $\int_0^\infty F\,dw=\frac12\int_{-\infty}^\infty F\,dw$이고
$$f(x)=\frac1{2\pi}\int_{-\infty}^{\infty}\Big[\int_{-\infty}^{\infty}f(v)\cos(wx-wv)\,dv\Big]dw$$
한편 코사인을 사인으로 바꾼 적분 $G(w)=\int f(v)\sin(wx-wv)\,dv$는 $w$의 기함수이므로
$$\frac1{2\pi}\int_{-\infty}^{\infty}\Big[\int_{-\infty}^{\infty}f(v)\sin(wx-wv)\,dv\Big]dw=0$$
입니다. 앞의 식에 이 식의 $i$배를 더하고 오일러 공식 $\cos\theta+i\sin\theta=e^{i\theta}$를 쓰면 **복소 푸리에 적분**을 얻습니다.
$$f(x)=\frac1{2\pi}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}f(v)\,e^{iw(x-v)}\,dv\,dw$$

### 푸리에 변환과 역변환

지수를 곱으로 나누면 $e^{iw(x-v)}=e^{-iwv}e^{iwx}$이므로
$$f(x)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}\Big[\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}f(v)e^{-iwv}dv\Big]e^{iwx}dw$$
대괄호 안의 함수가 $f$의 **푸리에 변환** $\hat f(w)$이고, 바깥 식이 **역변환**입니다. 기호로 $\hat f=\mathcal F(f)$, $f=\mathcal F^{-1}(\hat f)$.

:::key 푸리에 변환 (Kreyszig 규약)
$$\hat f(w)=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}f(x)e^{-iwx}dx,\qquad f(x)=\frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\hat f(w)e^{iwx}dw$$
$$\mathcal F\{f'\}=iw\,\hat f,\qquad \mathcal F\{f*g\}=\sqrt{2\pi}\,\hat f\,\hat g,\qquad \mathcal F\{e^{-ax^2}\}=\frac1{\sqrt{2a}}e^{-w^2/(4a)}$$
:::

:::thm 푸리에 변환의 존재 (교재 §11.9 Theorem 1)
$f$가 $x$축에서 절대 적분 가능하고 모든 유한 구간에서 구간별 연속이면 푸리에 변환 $\hat f(w)$가 존재합니다.
:::

:::ex 예제 1 (사각 펄스의 변환)
$f(x)=1\ (|x|<1)$, $f(x)=0$ (그 밖)의 푸리에 변환을 구하세요.
---
$$\hat f(w)=\frac1{\sqrt{2\pi}}\int_{-1}^{1}e^{-iwx}dx=\frac1{\sqrt{2\pi}}\Big[\frac{e^{-iwx}}{-iw}\Big]_{-1}^{1}=\frac1{\sqrt{2\pi}}\cdot\frac{e^{iw}-e^{-iw}}{iw}$$
오일러 공식에서 $e^{iw}-e^{-iw}=(\cos w+i\sin w)-(\cos w-i\sin w)=2i\sin w$이므로 $i$가 약분되어
$$\hat f(w)=\sqrt{\frac2\pi}\,\frac{\sin w}{w}$$
$f$가 우함수라 변환이 실수이고, §11.8의 코사인 변환($a=1$)과 같습니다.
:::

:::fig f10pair
:::

:::ex 예제 2 (한쪽으로 감쇠하는 지수함수)
$f(x)=e^{-ax}\ (x>0)$, $f(x)=0\ (x<0)$ ($a>0$)의 푸리에 변환은?
---
$$\hat f(w)=\frac1{\sqrt{2\pi}}\int_0^\infty e^{-ax}e^{-iwx}dx=\frac1{\sqrt{2\pi}}\Big[\frac{e^{-(a+iw)x}}{-(a+iw)}\Big]_{x=0}^{\infty}=\frac{1}{\sqrt{2\pi}\,(a+iw)}$$
$x\to\infty$에서 $|e^{-(a+iw)x}|=e^{-ax}\to0$입니다. $f$가 우함수도 기함수도 아니므로 변환은 **복소수값**이고, 크기는 $|\hat f|=\frac1{\sqrt{2\pi}\sqrt{a^2+w^2}}$입니다.
:::

:::ex 예제 3 (양쪽 지수함수)
$f(x)=e^{-|x|}$의 푸리에 변환은?
---
$\int_0^\infty e^{-x}e^{-iwx}dx=\frac1{1+iw}$, $\int_{-\infty}^0e^{x}e^{-iwx}dx=\frac1{1-iw}$. 합은 $\frac{(1-iw)+(1+iw)}{1+w^2}=\frac{2}{1+w^2}$이므로 $\hat f=\sqrt{\frac2\pi}\frac1{1+w^2}$. 뾰족한 모서리가 있는 함수는 변환이 $1/w^2$로 느리게 줄어듭니다. 예제 2의 결과와 그 좌우 뒤집기의 합이라 보아도 됩니다.
:::

### 물리적 의미: 스펙트럼과 에너지

역변환 $f(x)=\frac1{\sqrt{2\pi}}\int\hat f(w)e^{iwx}dw$는 $f$를 **모든 진동수**의 사인 진동의 겹침으로 나타낸 것입니다(**스펙트럼 표현**). 빛이 여러 색(진동수)의 겹침인 광학에서 온 이름입니다. $\hat f(w)$는 진동수 $w$ 근처 성분의 세기를 재는 **스펙트럼 밀도**이고, 진동과 관련된 문제에서 $\int_{-\infty}^\infty|\hat f(w)|^2dw$는 계의 **총에너지**로 해석됩니다. 왜 제곱인지 조화진동자로 확인해 봅시다.

질량-스프링계 $my''+ky=0$에 $y'$을 곱하면 $my'y''+kyy'=0$, 적분하면
$$\tfrac12mv^2+\tfrac12ky^2=E_0\ (\text{상수}),\qquad v=y'$$
운동에너지와 위치에너지의 합이 총에너지 $E_0$입니다. 일반해를 복소 형식으로 $y=c_1e^{i\omega_0x}+\overline{c_1}e^{-i\omega_0x}$ ($\omega_0^2=k/m$)로 쓰고 $A=c_1e^{i\omega_0x}$, $B=\overline{c_1}e^{-i\omega_0x}$라 하면 $y=A+B$, $v=i\omega_0(A-B)$입니다. $m\omega_0^2=k$, $i^2=-1$을 쓰면
$$E_0=\tfrac12m(i\omega_0)^2(A-B)^2+\tfrac12k(A+B)^2=\tfrac12k\big[(A+B)^2-(A-B)^2\big]=2kAB=2k|c_1|^2$$
에너지는 **진폭의 제곱**에 비례합니다. 해가 푸리에 급수로 나타나는 주기적인 계라면 에너지는 $\sum|c_n|^2$처럼 이산적인 진동수들의 기여의 합(**이산 스펙트럼**)이 되고(§11.4의 복소 파세발), 적분으로 나타나는 계라면 $\int|\hat f(w)|^2dw$가 됩니다. 구간 $[a,b]$에서의 $\int_a^b|\hat f|^2dw$는 그 진동수 대역이 총에너지에 기여하는 몫입니다.

### 선형성, 도함수의 변환

적분이 선형이므로 $\mathcal F(af+bg)=a\mathcal F(f)+b\mathcal F(g)$입니다. 미분방정식에 쓰일 핵심은 **미분이 $iw$ 곱하기로 바뀐다**는 성질입니다.

:::thm 도함수의 푸리에 변환 (교재 §11.9 Theorem 3)
$f$가 연속이고 $|x|\to\infty$에서 $f\to0$이며 $f'$이 절대 적분 가능하면
$$\mathcal F\{f'(x)\}=iw\,\mathcal F\{f(x)\},\qquad \mathcal F\{f''(x)\}=-w^2\mathcal F\{f(x)\}$$
:::

부분적분하면
$$\mathcal F\{f'\}=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}f'e^{-iwx}dx=\frac1{\sqrt{2\pi}}\Big[f\,e^{-iwx}\Big]_{-\infty}^{\infty}+\frac{iw}{\sqrt{2\pi}}\int_{-\infty}^{\infty}f\,e^{-iwx}dx=0+iw\,\mathcal F\{f\}$$
($|e^{-iwx}|=1$이고 $f\to0$이라 경계항이 0.) 두 번 쓰면 $(iw)^2=-w^2$. 무한 영역의 미분방정식이 대수방정식으로 바뀌는 이유입니다[[ch11:12.7|무한 막대의 열방정식을 푸리에 변환으로 풀면 가우스 핵이 나옵니다.]].

거꾸로 $\hat f$를 $w$로 미분하면 $\hat f'(w)=\frac1{\sqrt{2\pi}}\int(-ix)f\,e^{-iwx}dx=-i\,\mathcal F\{xf\}$이므로
$$\mathcal F\{xf(x)\}=i\,\frac{d\hat f}{dw}$$
입니다. “$x$를 곱하면 변환을 미분”하는 쌍대 공식입니다.

:::ex 예제 4 (가우스 함수의 변환)
$f(x)=e^{-ax^2}$ ($a>0$)의 푸리에 변환을 구하세요.
---
$f'=-2ax\,f$입니다. 양변을 변환하고 위의 두 공식을 쓰면
$$iw\,\hat f=-2a\,\mathcal F\{xf\}=-2a\cdot i\,\hat f'(w)\ \Longrightarrow\ \hat f'(w)=-\frac{w}{2a}\hat f(w)$$
변수분리형 ODE이므로 $\hat f(w)=\hat f(0)e^{-w^2/(4a)}$. 초기값은 가우스 적분 $\int_{-\infty}^{\infty}e^{-ax^2}dx=\sqrt{\pi/a}$[[@base:ch02:2.3|가우스 적분 $\int e^{-x^2}dx=\sqrt\pi$를 극좌표 이중적분으로 구하는 방법.]]에서
$$\hat f(0)=\frac1{\sqrt{2\pi}}\sqrt{\frac\pi a}=\frac1{\sqrt{2a}}\qquad\Longrightarrow\qquad\mathcal F\{e^{-ax^2}\}=\frac1{\sqrt{2a}}e^{-w^2/(4a)}$$
가우스 함수의 변환은 다시 가우스 함수입니다. $a=\frac12$이면 $\mathcal F\{e^{-x^2/2}\}=e^{-w^2/2}$로 자기 자신입니다. 또 $a$가 크면(좁은 함수) 변환은 폭이 넓어집니다. 한쪽에서 좁을수록 다른 쪽에서 넓다는 **불확정성**의 수학적 형태입니다.
:::

:::ex 예제 5 (도함수 공식의 응용)
$\mathcal F\{xe^{-x^2}\}$를 구하세요.
---
$xe^{-x^2}=-\frac12\big(e^{-x^2}\big)'$이므로 도함수 공식과 예제 4($a=1$)에서
$$\mathcal F\{xe^{-x^2}\}=-\frac12\,iw\,\mathcal F\{e^{-x^2}\}=-\frac{iw}{2}\cdot\frac1{\sqrt2}e^{-w^2/4}=-\frac{iw}{2\sqrt2}e^{-w^2/4}$$
기함수의 변환이라 순허수입니다.
:::

### 합성곱

두 함수의 **합성곱**을
$$h(x)=(f*g)(x)=\int_{-\infty}^{\infty}f(p)g(x-p)\,dp=\int_{-\infty}^{\infty}f(x-p)g(p)\,dp$$
로 정의합니다. 라플라스 변환의 합성곱(§6.5)과 목적이 같지만 적분 구간이 $(-\infty,\infty)$입니다[[ch05:6.5|라플라스 변환의 합성곱 정리 $\mathcal L(f*g)=FG$.]].

:::thm 합성곱 정리 (교재 §11.9 Theorem 4)
$f$, $g$가 구간별 연속이고 유계이며 $x$축에서 절대 적분 가능하면
$$\mathcal F(f*g)=\sqrt{2\pi}\,\mathcal F(f)\,\mathcal F(g)$$
:::

정의를 쓰고 적분 순서를 바꾼 뒤 $x-p=q$로 치환합니다.
$$\mathcal F(f*g)=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}f(p)g(x-p)e^{-iwx}\,dx\,dp=\frac1{\sqrt{2\pi}}\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}f(p)g(q)e^{-iw(p+q)}\,dq\,dp$$
이중적분이 두 적분의 곱으로 갈라지고
$$\mathcal F(f*g)=\frac1{\sqrt{2\pi}}\Big[\int f(p)e^{-iwp}dp\Big]\Big[\int g(q)e^{-iwq}dq\Big]=\frac1{\sqrt{2\pi}}\big[\sqrt{2\pi}\hat f\big]\big[\sqrt{2\pi}\hat g\big]=\sqrt{2\pi}\,\hat f\,\hat g$$
양변에 역변환을 취하면 $\sqrt{2\pi}$와 $\frac1{\sqrt{2\pi}}$가 상쇄되어
$$(f*g)(x)=\int_{-\infty}^{\infty}\hat f(w)\hat g(w)e^{iwx}\,dw$$
입니다. 12장에서 열방정식의 해를 초기 온도와 가우스 핵의 합성곱으로 쓸 때 이 공식을 씁니다.

### 이산 푸리에 변환 (DFT)

지금까지는 $f$가 구간 전체에서 주어져 적분할 수 있다고 가정했습니다. 그런데 실제 신호(통신, 시계열, 시뮬레이션)는 **등간격 점에서의 값**만 있는 경우가 대부분입니다. 이때는 적분 대신 합을 쓰는 이산 푸리에 해석이 필요합니다.

주기 $2\pi$인 $f$를 $0\le x<2\pi$의 $N$개 점
$$x_k=\frac{2\pi k}{N},\qquad k=0,1,\dots,N-1$$
에서 **샘플링**했다고 합시다($f_k=f(x_k)$). 이 점들에서 $f$와 일치하는(**보간하는**) 복소 삼각다항식
$$q(x)=\sum_{n=0}^{N-1}c_ne^{inx},\qquad q(x_k)=f_k\quad(k=0,\dots,N-1)$$
의 계수를 구합니다. §11.1에서 직교성을 적분으로 썼다면 여기서는 **합의 직교성**을 씁니다. $q(x_k)=f_k$에 $e^{-imx_k}$를 곱하고 $k$에 대해 더한 뒤 합의 순서를 바꾸면
$$\sum_{k=0}^{N-1}f_ke^{-imx_k}=\sum_{n=0}^{N-1}c_n\sum_{k=0}^{N-1}\big[e^{i(n-m)2\pi/N}\big]^k$$
대괄호를 $r$이라 하면, $n=m$일 때 $r=1$이라 안쪽 합은 $N$이고, $n\ne m$일 때는 $r\ne1$, $r^N=e^{i(n-m)2\pi}=1$이므로 등비급수 공식으로 $\sum_{k=0}^{N-1}r^k=\frac{1-r^N}{1-r}=0$입니다. 결국 오른쪽은 $c_mN$만 남아
$$c_n=\frac1N\sum_{k=0}^{N-1}f_ke^{-inx_k}$$
FFT에서 문제 크기를 반씩 줄여 가며 계산하므로 $\frac1N$을 떼어 낸 것을 **이산 푸리에 변환**으로 정의합니다.

$$\hat f_n=Nc_n=\sum_{k=0}^{N-1}f_ke^{-inx_k}=\sum_{k=0}^{N-1}f_k\,w^{nk},\qquad w=w_N=e^{-2\pi i/N}$$

벡터로 쓰면 $\hat{\mathbf f}=F_N\mathbf f$이고 **푸리에 행렬** $F_N=[w^{nk}]$ ($n,k=0,\dots,N-1$)입니다. $\hat{\mathbf f}$는 신호의 **주파수 스펙트럼**입니다.

**역변환.** $\overline{F_N}=[\overline w^{\,nk}]$라 하면 $F_N\overline{F_N}=\overline{F_N}F_N=NI$, 따라서 $F_N^{-1}=\frac1N\overline{F_N}$입니다. $F_N\overline{F_N}$의 $(j,k)$ 성분은 $W=w^j\overline w^{\,k}$에 대해 $\sum_{l=0}^{N-1}W^l$인데, $j=k$이면 $W=1$이라 $N$, $j\ne k$이면 $W^N=1$, $W\ne1$이라 등비합이 0입니다. 앞의 합의 직교성과 같은 계산입니다.

:::ex 예제 6 (N = 4 DFT)
$\mathbf f=(1,2,0,1)$의 DFT를 구하고 역변환으로 되돌려 확인하세요.
---
$N=4$이면 $w=e^{-i\pi/2}=-i$이고 $F_4=[(-i)^{nk}]$입니다.
$$F_4=\begin{bmatrix}1&1&1&1\\1&-i&-1&i\\1&-1&1&-1\\1&i&-1&-i\end{bmatrix},\qquad \hat{\mathbf f}=F_4\mathbf f$$
$\hat f_0=1+2+0+1=4$, $\hat f_1=1+2(-i)+0\cdot(-1)+1\cdot i=1-i$, $\hat f_2=1-2+0-1=-2$, $\hat f_3=1+2i+0-i=1+i$.
$$\hat{\mathbf f}=(4,\ 1-i,\ -2,\ 1+i)$$
실수 신호의 DFT는 $\hat f_{N-n}=\overline{\hat f_n}$ 대칭을 가집니다($\hat f_3=\overline{\hat f_1}$).

**검산(역변환).** $f_k=\frac14\sum_n\hat f_n\,i^{nk}$. 예를 들어 $k=1$: $\frac14\big[4+(1-i)i+(-2)(-1)+(1+i)(-i)\big]=\frac14\big[4+(1+i)+2+(1-i)\big]=2$ ✓.
:::

**앨리어싱.** 샘플 점에서는 $e^{i(n+N)x_k}=e^{inx_k}e^{2\pi ik}=e^{inx_k}$이므로 진동수 $n$과 $n+N$을 **구별할 수 없습니다**. 너무 적은 점에서 샘플링하면 높은 진동수가 낮은 진동수로 둔갑하는 현상이고, 영화에서 돌아가는 바퀴가 천천히 또는 거꾸로 도는 것처럼 보이는 것이 그 예입니다. 그래서 $N/2$보다 훨씬 작은 $n$만 믿을 수 있고, 실제로는 $N$을 크게 잡습니다.

### 고속 푸리에 변환 (FFT)

DFT를 정의대로 계산하면 $\hat f_n$ 하나에 곱셈이 $N$번, 전체에 $O(N^2)$번 필요합니다. 샘플이 1000개만 되어도 수백만 번입니다. **FFT**는 $N=2^p$로 잡고 푸리에 행렬의 구조를 이용해 이를 $O(N\log_2N)$으로 줄입니다. $N=1000$이면 약 $1000/\log_21000\approx100$배 빨라집니다.

**반으로 나누기.** $N=2M$이면 $w_N^2=e^{-4\pi i/(2M)}=e^{-2\pi i/M}=w_M$입니다. 신호를 짝수 번째 $\mathbf f_{ev}=(f_0,f_2,\dots,f_{N-2})$와 홀수 번째 $\mathbf f_{od}=(f_1,f_3,\dots,f_{N-1})$로 나누면
$$\hat f_n=\sum_{k=0}^{M-1}w_N^{2kn}f_{2k}+\sum_{k=0}^{M-1}w_N^{(2k+1)n}f_{2k+1}=\sum_{k=0}^{M-1}w_M^{kn}f_{ev,k}+w_N^n\sum_{k=0}^{M-1}w_M^{kn}f_{od,k}$$
두 합은 크기 $M$인 DFT $\hat{\mathbf f}_{ev}=F_M\mathbf f_{ev}$, $\hat{\mathbf f}_{od}=F_M\mathbf f_{od}$의 성분입니다. 또 $w_N^M=e^{-\pi i}=-1$이므로 $n+M$에서는 둘째 항의 부호만 바뀝니다.
$$\hat f_n=\hat f_{ev,n}+w_N^n\hat f_{od,n},\qquad \hat f_{n+M}=\hat f_{ev,n}-w_N^n\hat f_{od,n}\qquad(n=0,\dots,M-1)$$
크기 $N$ 문제 하나가 크기 $N/2$ 문제 두 개와 곱셈 $N/2$번으로 바뀝니다. $N=2^p$이면 이 분할을 $p-1$번 되풀이해 크기 2 문제들까지 내려가므로 전체 곱셈은 약 $\frac N2\log_2N$번입니다.

:::ex 예제 7 (N = 4 FFT)
예제 6의 $\mathbf f=(1,2,0,1)$을 FFT로 계산하세요.
---
$M=2$, $w_2=-1$이라 $F_2=\begin{bmatrix}1&1\\1&-1\end{bmatrix}$입니다. $\mathbf f_{ev}=(1,0)$, $\mathbf f_{od}=(2,1)$이므로
$$\hat{\mathbf f}_{ev}=(1+0,\ 1-0)=(1,1),\qquad \hat{\mathbf f}_{od}=(2+1,\ 2-1)=(3,1)$$
$w_4=-i$를 써서 합치면
$$\hat f_0=1+3=4,\quad \hat f_1=1+(-i)\cdot1=1-i,\quad \hat f_2=1-3=-2,\quad \hat f_3=1-(-i)\cdot1=1+i$$
예제 6과 같습니다. 곱셈은 $w_4$를 곱하는 한 번뿐입니다.
:::

**변환표(§11.10).** 교재 끝의 표에 코사인·사인·푸리에 변환 쌍이 정리되어 있습니다. 시험에는 아래 정도를 외워 두거나 유도할 수 있으면 충분합니다.

| $f(x)$ | $\hat f(w)$ |
|---|---|
| $1$ ($-b<x<b$), $0$ (그 밖) | $\sqrt{\frac2\pi}\frac{\sin bw}{w}$ |
| $e^{-ax}$ ($x>0$), $0$ ($x<0$) | $\frac{1}{\sqrt{2\pi}(a+iw)}$ |
| $e^{-a\lvert x\rvert}$ | $\sqrt{\frac2\pi}\frac{a}{a^2+w^2}$ |
| $e^{-ax^2}$ | $\frac1{\sqrt{2a}}e^{-w^2/(4a)}$ |
| $\frac1{x^2+a^2}$ | $\sqrt{\frac\pi2}\frac{e^{-a\lvert w\rvert}}{a}$ |

마지막 줄은 셋째 줄에 역변환을 적용한 것입니다(변환 쌍의 대칭성).

:::warn 규약 차이
$\sqrt{2\pi}$의 위치와 지수의 부호는 교재마다 다릅니다(공학 교재는 $\int f e^{-i\omega t}dt$를 많이 씀). 강의의 규약을 확인하고 상수 인자를 맞추세요. 합성곱 정리의 $\sqrt{2\pi}$도 규약에 따라 1이 되기도 합니다.
:::
` },
    ],
  });
})();
