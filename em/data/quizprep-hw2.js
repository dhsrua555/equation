/* 과제형 연습문제 — Homework #2(푸리에 해석, 교재 11.5–11.10)와 같은 유형을 10단원에 덧붙입니다.
   manifest의 맨 끝에 두어 기존 문제 번호(저장된 풀이 기록)가 바뀌지 않게 합니다. 수치는 perl로 검산했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({ n: 10, problems: [
    // HW2-1: 푸리에-르장드르 급수
    { sec: '11.6', type: 'mc', lv: 1, quiz: 'hw2-p1', q: R`푸리에-르장드르 계수 $a_m=c_m\int_{-1}^1f(x)P_m(x)\,dx$에서 상수 $c_m$은?`,
      choices: [R`$\dfrac{2m+1}2$`, R`$\dfrac2{2m+1}$`, R`$\dfrac12$`, R`$2m+1$`], ans: 0,
      sol: R`계수 = 내적 ÷ 노름제곱이고 $\|P_m\|^2=\int_{-1}^1P_m^2dx=\frac2{2m+1}$이므로 $c_m=\frac{2m+1}2$. $\frac2{2m+1}$은 노름제곱 자체입니다.` },
    { sec: '11.6', type: 'num', lv: 1, quiz: 'hw2-p1', q: R`$x^3=\alpha P_3(x)+\beta P_1(x)$로 쓸 때 $\alpha$는? ($P_3=\frac12(5x^3-3x)$)`, ans: '2/5', ansTex: R`\tfrac25`,
      sol: R`$P_3=\frac12(5x^3-3x)$를 $x^3$에 대해 풀면 $x^3=\frac{2P_3+3x}5=\frac25P_3+\frac35P_1$. 검산: $x=1$에서 $\frac25+\frac35=1$ ✓.` },
    { sec: '11.6', type: 'num', lv: 2, quiz: 'hw2-p1', q: R`$e^x$의 $[-1,1]$에서의 푸리에-르장드르 계수 $a_1$은?`, ans: '3/e', ansTex: R`\tfrac3e\approx1.1036`,
      hint: R`$a_1=\frac32\int_{-1}^1xe^x\,dx$, 부분적분.`,
      sol: R`$\int xe^xdx=(x-1)e^x$이므로 $a_1=\frac32\big[(x-1)e^x\big]_{-1}^1=\frac32\big(0-(-2e^{-1})\big)=\frac3e\approx1.1036$. 참고로 $a_0=\frac12\int_{-1}^1e^xdx=\sinh1$. 다항식이 아니므로 급수는 끝나지 않습니다.` },
    { sec: '11.6', type: 'open', lv: 2, quiz: 'hw2-p1', q: R`$f(x)=(1+x)^3$의 푸리에-르장드르 급수를 (a) $P_0,\dots,P_3$의 일차결합으로, (b) 계수 공식 $a_m=\frac{2m+1}2\int_{-1}^1fP_m\,dx$로 구하고 두 결과가 같음을 확인하시오.`,
      hint: R`$(1+x)^3=1+3x+3x^2+x^3$. (b)에서는 짝수 $m$에 짝수 부분 $1+3x^2$, 홀수 $m$에 홀수 부분 $3x+x^3$만 남습니다.`,
      sol: R`
**(a)** $x^2=\frac23P_2+\frac13P_0$, $x^3=\frac25P_3+\frac35P_1$이므로
$$1+3x+3x^2+x^3=P_0+3P_1+\big(2P_2+P_0\big)+\Big(\frac25P_3+\frac35P_1\Big)=2P_0+\frac{18}5P_1+2P_2+\frac25P_3.$$
**(b)** $a_0=\frac12\int(1+3x^2)dx=\frac12(2+2)=2$, $a_1=\frac32\int(3x+x^3)x\,dx=\frac32\big(2+\frac25\big)=\frac{18}5$,
$a_2=\frac54\int(1+3x^2)(3x^2-1)dx=\frac54\int(9x^4-1)dx=\frac54\big(\frac{18}5-2\big)=2$,
$a_3=\frac74\int(3x+x^3)(5x^3-3x)dx=\frac74\int(5x^6+12x^4-9x^2)dx=\frac74\big(\frac{10}7+\frac{24}5-6\big)=\frac74\cdot\frac8{35}=\frac25$, $m\ge4$이면 직교성으로 $a_m=0$.
**검산** $x=1$: $2+\frac{18}5+2+\frac25=8=2^3$ ✓, $x=-1$: $2-\frac{18}5+2-\frac25=0$ ✓.`,
      rubric: R`
- (a) $x^2$, $x^3$을 르장드르 다항식으로 바꿈 — 3점
- (b) 계수 공식과 대칭으로 네 계수 계산 — 4점
- $m\ge4$에서 0인 이유 — 1점
- 검산 또는 두 방법의 일치 확인 — 2점` },
    { sec: '11.6', type: 'open', lv: 3, proof: true, quiz: 'hw2-p1', q: R`$f$가 $n$차 다항식이면 (1) 푸리에-르장드르 계수가 $m\gt n$에서 모두 0이고 급수가 $f$와 정확히 같으며, (2) “$f$를 $P_0,\dots,P_n$의 일차결합으로 쓰는 방법”과 “계수 공식으로 적분하는 방법”이 같은 계수를 줌을 증명하시오.`,
      sol: R`
$\deg P_k=k$이므로 $P_0,\dots,P_n$은 일차독립이고(최고차항 비교), 개수가 $\dim\mathcal P_n=n+1$이므로 $\mathcal P_n$의 기저입니다. 그래서 $f=\sum_{k=0}^nc_kP_k$인 $c_k$가 유일하게 존재합니다(첫째 방법).
양변과 $P_m$의 내적을 취하면 직교성으로 $\langle f,P_m\rangle=\sum_kc_k\langle P_k,P_m\rangle=c_m\|P_m\|^2$ ($m\le n$), 곧 $c_m=\frac{\langle f,P_m\rangle}{\|P_m\|^2}=a_m$ — 둘째 방법의 계수와 같습니다.
$m\gt n$이면 $P_m$은 $P_0,\dots,P_n$과 모두 직교하므로 $\langle f,P_m\rangle=0$, $a_m=0$. 따라서 급수 $\sum a_mP_m=\sum_{k\le n}c_kP_k=f$입니다. $\blacksquare$`,
      rubric: R`
- $P_0,\dots,P_n$이 $\mathcal P_n$의 기저임(독립 + 차원) — 3점
- 내적을 취해 $c_m=a_m$ — 4점
- $m\gt n$에서 $a_m=0$ — 3점` },
    // HW2-2(1): 스투름-리우빌 문제
    { sec: '11.5', type: 'mc', lv: 1, quiz: 'hw2-p2a', q: R`$y''-2y'+(\lambda+1)y=0$을 스투름-리우빌 꼴 $[py']'+[q+\lambda r]y=0$으로 쓸 때 가중함수 $r(x)$는?`,
      choices: [R`$e^{-2x}$`, R`$e^{2x}$`, R`$1$`, R`$e^{x}$`], ans: 0,
      sol: R`$p=e^{\int(-2)dx}=e^{-2x}$를 곱하면 $[e^{-2x}y']'+[e^{-2x}+\lambda e^{-2x}]y=0$이므로 $r=ph=e^{-2x}$. 고유함수 $e^x\sin n\pi x$는 이 가중함수에 대해 직교합니다.` },
    { sec: '11.5', type: 'open', lv: 2, quiz: 'hw2-p2a', q: R`(교재 11.5 #13) $y''+8y'+(\lambda+16)y=0$, $y(0)=0$, $y(\pi)=0$의 고유값과 고유함수를 구하고 직교성을 확인하시오. 먼저 스투름-리우빌 꼴로 쓰시오.`,
      hint: R`특성근은 $\mu=-4\pm\sqrt{-\lambda}$. 또는 $y=e^{-4x}u$로 치환.`,
      sol: R`
**꼴.** $p=e^{\int8dx}=e^{8x}$를 곱하면 $[e^{8x}y']'+[16e^{8x}+\lambda e^{8x}]y=0$: $p=e^{8x}$, $q=16e^{8x}$, $r=e^{8x}$.
**세 경우.** $\mu^2+8\mu+\lambda+16=0$에서 $\mu=-4\pm\sqrt{-\lambda}$.
- $\lambda=-k^2\lt0$: $y=e^{-4x}(c_1e^{kx}+c_2e^{-kx})$, $y(0)=0$에서 $y=2c_1e^{-4x}\sinh kx$, $y(\pi)=0$에서 $c_1=0$.
- $\lambda=0$: $y=(c_1+c_2x)e^{-4x}$, 두 조건에서 $c_1=c_2=0$.
- $\lambda=k^2\gt0$: $y=e^{-4x}(A\cos kx+B\sin kx)$, $A=0$, $\sin k\pi=0$에서 $k=n$.

$$\lambda_n=n^2,\qquad y_n=e^{-4x}\sin nx\quad(n=1,2,\dots)$$
**직교성.** $\int_0^\pi e^{8x}\,e^{-4x}\sin mx\,e^{-4x}\sin nx\,dx=\int_0^\pi\sin mx\sin nx\,dx=0$ ($m\ne n$).`,
      rubric: R`
- 스투름-리우빌 꼴과 $p,q,r$ — 2점
- $\lambda\lt0$, $\lambda=0$에서 자명해 — 3점
- $\lambda\gt0$에서 고유값·고유함수 — 3점
- 가중함수로 직교성 확인 — 2점` },
    { sec: '11.5', type: 'open', lv: 3, quiz: 'hw2-p2a', q: R`$x^2y''+xy'+\lambda y=0$ ($1\le x\le e^\pi$), $y(1)=0$, $y(e^\pi)=0$을 스투름-리우빌 꼴로 쓰고 고유값·고유함수를 구한 뒤, 가중함수에 대한 직교성을 확인하시오.`,
      hint: R`$x$로 나누면 $(xy')'+\frac\lambda xy=0$. $x=e^t$로 두면 상수계수 방정식.`,
      sol: R`
$x$로 나누면 $xy''+y'=(xy')'$이므로 $(xy')'+\lambda\cdot\frac1xy=0$: $p=x$, $q=0$, $r=\frac1x\gt0$.
$x=e^t$ ($0\le t\le\pi$)로 두면 $x\frac{dy}{dx}=\frac{dy}{dt}$, $x^2y''+xy'=\frac{d^2y}{dt^2}$이므로 $\ddot y+\lambda y=0$, $y(t=0)=0$, $y(t=\pi)=0$.
- $\lambda\lt0$: $y=c_1x^k+c_2x^{-k}$ ($\lambda=-k^2$), 두 조건에서 0. $\lambda=0$: $y=c_1+c_2\ln x$, 두 조건에서 0.
- $\lambda=k^2\gt0$: $y=A\cos(k\ln x)+B\sin(k\ln x)$, $A=0$, $\sin k\pi=0$에서 $k=n$.

$$\lambda_n=n^2,\qquad y_n=\sin(n\ln x)\quad(n=1,2,\dots)$$
**직교성.** $t=\ln x$, $dt=\frac{dx}x$로 $\int_1^{e^\pi}\frac1x\sin(m\ln x)\sin(n\ln x)\,dx=\int_0^\pi\sin mt\sin nt\,dt=0$ ($m\ne n$).`,
      rubric: R`
- 스투름-리우빌 꼴, $r=\frac1x$ — 2점
- 치환 $x=e^t$ 또는 오일러-코시 해법 — 2점
- 세 경우와 고유값·고유함수 — 4점
- 가중 직교성 — 2점` },
    // HW2-2(2)(3): 푸리에 적분으로 정적분 보이기
    { sec: '11.7', type: 'open', lv: 2, quiz: 'hw2-p2b', q: R`(교재 11.7 #2) 다음을 보이시오.
$$\int_0^\infty\frac{\sin\pi w\,\sin xw}{1-w^2}\,dw=\begin{cases}\frac\pi2\sin x&0\le x\le\pi\\0&x\gt\pi\end{cases}$$`,
      hint: R`$\sin xw$이므로 사인 적분. $f(x)=\sin x$ ($0\lt x\lt\pi$), $0$ ($x\gt\pi$).`,
      sol: R`
$f(x)=\sin x$ ($0\le x\le\pi$), $0$ ($x\gt\pi$)을 기함수로 확장하면 연속이고(양 끝에서 $\sin0=\sin\pi=0$) 구간별로 매끄럽고 절대 적분 가능합니다.
$$B(w)=\frac2\pi\int_0^\pi\sin v\sin wv\,dv=\frac1\pi\int_0^\pi\big[\cos(w-1)v-\cos(w+1)v\big]dv=\frac1\pi\Big[\frac{\sin(w-1)\pi}{w-1}-\frac{\sin(w+1)\pi}{w+1}\Big].$$
$\sin(w\mp1)\pi=-\sin w\pi$이므로 $B(w)=\frac{\sin\pi w}\pi\Big(\frac1{w+1}-\frac1{w-1}\Big)=\frac2\pi\cdot\frac{\sin\pi w}{1-w^2}$.
확장이 연속이므로 모든 $x\ge0$에서 $f(x)=\frac2\pi\int_0^\infty\frac{\sin\pi w\sin xw}{1-w^2}dw$, 양변에 $\frac\pi2$를 곱하면 끝. ($w=1$은 겉보기 특이점, 극한 $\frac\pi2$.)`,
      rubric: R`
- 사인 적분과 $f$의 선택 — 2점
- $B(w)$ 계산 — 5점
- 연속성으로 $x=0$, $x=\pi$까지 성립함 — 2점
- $\frac\pi2$ 정리 — 1점` },
    { sec: '11.7', type: 'open', lv: 3, quiz: 'hw2-p2b', q: R`(교재 11.7 #5) 다음을 보이시오. 특히 $x=1$에서의 값을 설명하시오.
$$\int_0^\infty\frac{\sin w-w\cos w}{w^2}\sin xw\,dw=\begin{cases}\frac\pi2x&0\lt x\lt1\\\frac\pi4&x=1\\0&x\gt1\end{cases}$$`,
      sol: R`
$f(x)=x$ ($0\lt x\lt1$), $0$ ($x\gt1$)의 사인 적분입니다. 부분적분으로
$$\int_0^1v\sin wv\,dv=\Big[-\frac{v\cos wv}w\Big]_0^1+\frac1w\int_0^1\cos wv\,dv=\frac{\sin w-w\cos w}{w^2},\qquad B(w)=\frac2\pi\cdot\frac{\sin w-w\cos w}{w^2}.$$
연속점에서는 $\int_0^\infty\frac{\sin w-w\cos w}{w^2}\sin xw\,dw=\frac\pi2f(x)$. $x=1$에서는 $f(1^-)=1$, $f(1^+)=0$으로 도약하므로 적분은 평균 $\frac12$을 나타내고 값은 $\frac\pi2\cdot\frac12=\frac\pi4$입니다. ($x=0$은 기함수 확장이 연속이라 0.)`,
      rubric: R`
- $B(w)$의 부분적분 — 4점
- 연속점에서의 등식 — 3점
- $x=1$에서 좌우 평균으로 $\frac\pi4$ — 3점` },
    { sec: '11.7', type: 'open', lv: 2, quiz: 'hw2-p2c', q: R`(교재 11.7 #1) 푸리에 적분 (교재 식 (5))을 써서 다음을 보이시오.
$$\int_0^\infty\frac{\cos xw+w\sin xw}{1+w^2}\,dw=\begin{cases}0&x\lt0\\\pi/2&x=0\\\pi e^{-x}&x\gt0\end{cases}$$`,
      hint: R`코사인과 사인이 모두 있으므로 일반 푸리에 적분. $f(x)=0$ ($x\lt0$), $e^{-x}$ ($x\gt0$).`,
      sol: R`
$f(x)=0$ ($x\lt0$), $e^{-x}$ ($x\gt0$)로 두면 절대 적분 가능하고 구간별로 매끄럽습니다. 라플라스 적분으로
$$A(w)=\frac1\pi\int_0^\infty e^{-v}\cos wv\,dv=\frac1{\pi(1+w^2)},\qquad B(w)=\frac1\pi\int_0^\infty e^{-v}\sin wv\,dv=\frac w{\pi(1+w^2)}.$$
따라서 연속점에서 $f(x)=\frac1\pi\int_0^\infty\frac{\cos xw+w\sin xw}{1+w^2}dw$, 곧 적분 $=\pi f(x)$: $x\lt0$이면 0, $x\gt0$이면 $\pi e^{-x}$. $x=0$에서는 $f(0^-)=0$, $f(0^+)=1$의 평균 $\frac12$이므로 $\frac\pi2$.`,
      rubric: R`
- $f$의 선택과 일반 푸리에 적분 — 2점
- $A(w)$, $B(w)$ — 4점
- 세 경우의 값, 특히 $x=0$의 평균 — 4점` },
    { sec: '11.7', type: 'num', lv: 2, quiz: 'hw2-p2c', q: R`$\displaystyle\int_0^\infty\frac{w^3\sin xw}{w^4+4}\,dw=\frac\pi2e^{-x}\cos x$ ($x\gt0$)를 이용해 $\displaystyle\int_0^\infty\frac{w^3\sin w}{w^4+4}\,dw$의 값을 구하시오.`, ans: 'pi/2*e^(-1)*cos(1)', ansTex: R`\tfrac\pi2e^{-1}\cos1\approx0.3122`,
      sol: R`$x=1\gt0$은 연속점이므로 그대로 넣어 $\frac\pi2e^{-1}\cos1\approx0.31222$. (수치적분으로도 $0.312221$.)` },
    { sec: '11.7', type: 'mc', lv: 2, quiz: 'hw2-p2c', q: R`$\displaystyle\int_0^\infty\frac{w^3\sin xw}{w^4+4}\,dw$의 값은 $x\lt0$에서 무엇인가?`,
      choices: [R`$-\frac\pi2e^{x}\cos x$`, R`$\frac\pi2e^{-x}\cos x$`, R`$0$`, R`$\frac\pi2e^{x}\cos x$`], ans: 0,
      sol: R`적분은 $x$에 대해 기함수입니다($\sin(-x)w=-\sin xw$). 곧 $e^{-x}\cos x$ ($x\gt0$)의 **기함수 확장**을 나타내므로 $x\lt0$에서 $-\frac\pi2e^{-(-x)}\cos(-x)=-\frac\pi2e^{x}\cos x$. $x=0$에서는 0(도약의 평균)입니다.` },
    // HW2-2(4)(5): 푸리에 변환을 적분으로
    { sec: '11.9', type: 'open', lv: 2, quiz: 'hw2-p2d', q: R`(교재 11.9 #7) $f(x)=x$ ($0\lt x\lt a$), $0$ (그 밖)의 푸리에 변환을 적분으로 구하시오.`,
      hint: R`$\int xe^{-iwx}dx$를 부분적분. $\frac1{-iw}=\frac iw$.`,
      sol: R`
$$\int_0^axe^{-iwx}dx=\Big[\frac{x\,e^{-iwx}}{-iw}\Big]_0^a+\frac1{iw}\int_0^ae^{-iwx}dx=\frac{ia}we^{-iaw}+\frac{e^{-iaw}-1}{w^2}.$$
따라서 ($w\ne0$)
$$\hat f(w)=\frac{(1+iaw)e^{-iaw}-1}{\sqrt{2\pi}\,w^2},\qquad\hat f(0)=\frac{a^2}{2\sqrt{2\pi}}.$$
검산: $a=1$, $w=0.8$에서 수치적분과 공식 모두 $0.168673-0.099730i$.`,
      rubric: R`
- 정의와 부분적분 — 5점
- 정리된 결과 — 3점
- $w=0$의 값 — 2점` },
    { sec: '11.9', type: 'open', lv: 2, quiz: 'hw2-p2d', q: R`(교재 11.9 #2) $f(x)=e^{2ix}$ ($-1\lt x\lt1$), $0$ (그 밖)의 푸리에 변환을 적분으로 구하시오.`,
      sol: R`
$$\hat f(w)=\frac1{\sqrt{2\pi}}\int_{-1}^1e^{i(2-w)x}dx=\frac1{\sqrt{2\pi}}\cdot\frac{e^{i(2-w)}-e^{-i(2-w)}}{i(2-w)}=\frac1{\sqrt{2\pi}}\cdot\frac{2\sin(2-w)}{2-w}=\sqrt{\frac2\pi}\,\frac{\sin(w-2)}{w-2}$$
($w=2$에서는 $\sqrt{2/\pi}$). 상수 펄스의 변환 $\sqrt{\frac2\pi}\frac{\sin w}w$를 $w$축으로 2만큼 옮긴 것입니다($e^{iax}$를 곱하면 변환이 $a$만큼 이동, 표 III #7).`,
      rubric: R`
- 지수를 합쳐 적분 — 5점
- 오일러 공식으로 실수형 정리 — 3점
- $w=2$의 값 또는 이동 해석 — 2점` },
    { sec: '11.9', type: 'open', lv: 2, quiz: 'hw2-p2e', q: R`삼각형 펄스 $f(x)=1-\lvert x\rvert$ ($\lvert x\rvert\lt1$), $0$ (그 밖)의 푸리에 변환을 구하시오.`,
      hint: R`우함수라 $\hat f=\sqrt{\frac2\pi}\int_0^1(1-x)\cos wx\,dx$.`,
      sol: R`
우함수이므로 사인 부분은 0이고
$$\hat f(w)=\sqrt{\frac2\pi}\int_0^1(1-x)\cos wx\,dx=\sqrt{\frac2\pi}\Big(\Big[\frac{(1-x)\sin wx}w\Big]_0^1+\frac1w\int_0^1\sin wx\,dx\Big)=\sqrt{\frac2\pi}\,\frac{1-\cos w}{w^2}.$$
$w=0$에서는 $\frac1{\sqrt{2\pi}}$ (넓이 1). 검산: 상수 펄스의 변환 $\sqrt{\frac2\pi}\frac{\sin w}w$에서 $\lvert x\rvert$ 펄스의 변환 $\sqrt{\frac2\pi}\frac{w\sin w+\cos w-1}{w^2}$을 빼도 같은 결과(선형성).`,
      rubric: R`
- 우함수로 코사인 적분만 남김 — 3점
- 부분적분 — 5점
- $w=0$ 또는 검산 — 2점` },
    { sec: '11.9', type: 'mc', lv: 1, quiz: 'hw2-p2e', q: R`실수값 **우함수** $f$의 푸리에 변환 $\hat f(w)$에 대해 옳은 것은?`,
      choices: [R`실수값이고 $w$의 우함수이다`, R`순허수이고 $w$의 기함수이다`, R`실수값이고 $w$의 기함수이다`, R`일반적으로 실수부와 허수부가 모두 있다`], ans: 0,
      sol: R`$e^{-iwx}=\cos wx-i\sin wx$에서 $f\sin wx$는 기함수라 적분이 0이므로 $\hat f(w)=\sqrt{\frac2\pi}\int_0^\infty f\cos wx\,dx=\hat f_c(w)$: 실수이고 $\cos$ 때문에 $w$의 우함수입니다. 실수값 기함수이면 순허수 기함수가 됩니다.` },
    // HW2-3: 변환표 증명
    { sec: '11.8', type: 'num', lv: 1, quiz: 'hw2-p3a', q: R`$\mathcal F_c\big(e^{-x^2/2}\big)$의 $w=2$에서의 값은?`, ans: 'e^(-2)', ansTex: R`e^{-2}\approx0.1353`,
      sol: R`표 I #4: $\mathcal F_c(e^{-x^2/2})=e^{-w^2/2}$이므로 $e^{-2}\approx0.1353$.` },
    { sec: '11.8', type: 'open', lv: 3, proof: true, quiz: 'hw2-p3a', q: R`$\mathcal F_c\big(e^{-x^2/2}\big)=e^{-w^2/2}$을 이용하여 표 I의 5번 $\mathcal F_c\big(e^{-ax^2}\big)=\frac1{\sqrt{2a}}e^{-w^2/(4a)}$ ($a\gt0$)을 증명하시오.`,
      hint: R`$x=\frac t{\sqrt{2a}}$로 치환.`,
      sol: R`
$x=\frac t{\sqrt{2a}}$로 두면 $ax^2=\frac{t^2}2$, $dx=\frac{dt}{\sqrt{2a}}$이고 $x$와 $t$의 범위는 모두 $[0,\infty)$:
$$\sqrt{\frac2\pi}\int_0^\infty e^{-ax^2}\cos wx\,dx=\frac1{\sqrt{2a}}\sqrt{\frac2\pi}\int_0^\infty e^{-t^2/2}\cos\Big(\frac w{\sqrt{2a}}t\Big)dt=\frac1{\sqrt{2a}}\,\mathcal F_c\big(e^{-t^2/2}\big)\Big(\frac w{\sqrt{2a}}\Big)=\frac1{\sqrt{2a}}e^{-w^2/(4a)}.\ \blacksquare$$`,
      rubric: R`
- 치환과 적분 범위·$dx$ — 4점
- 표 I #4를 새 변수 $\frac w{\sqrt{2a}}$에서 씀 — 4점
- 지수 $\frac{w^2}{4a}$로 정리 — 2점` },
    { sec: '11.8', type: 'open', lv: 3, proof: true, quiz: 'hw2-p3b', q: R`표 I의 5번 $\mathcal F_c(e^{-ax^2})=\frac1{\sqrt{2a}}e^{-w^2/(4a)}$과 $\mathcal F_s\{f'\}=-w\,\mathcal F_c\{f\}$를 이용하여 표 II의 9번
$$\mathcal F_s\big(xe^{-ax^2}\big)=\frac{w}{(2a)^{3/2}}e^{-w^2/(4a)}\qquad(a\gt0)$$
을 증명하시오.`,
      sol: R`
$f=e^{-ax^2}$는 연속, 절대 적분 가능, $f'=-2axe^{-ax^2}$은 연속, $x\to\infty$에서 $f\to0$이므로 공식을 쓸 수 있습니다.
$$\mathcal F_s\big\{-2axe^{-ax^2}\big\}=-w\cdot\frac1{\sqrt{2a}}e^{-w^2/(4a)}\ \Longrightarrow\ \mathcal F_s\big(xe^{-ax^2}\big)=\frac w{2a}\cdot\frac1{\sqrt{2a}}e^{-w^2/(4a)}=\frac w{(2a)^{3/2}}e^{-w^2/(4a)}.\ \blacksquare$$
$a=\frac12$이면 표 II #8의 $we^{-w^2/2}$가 됩니다.`,
      rubric: R`
- 공식의 조건 확인 — 2점
- $f'$의 계산과 공식 적용 — 5점
- 선형성으로 상수 정리 — 3점` },
    { sec: '11.9', type: 'open', lv: 3, proof: true, quiz: 'hw2-p3c', q: R`(1) $\hat g(w)=\mathcal F(g)$이면 $\mathcal F\big(e^{iax}g(x)\big)=\hat g(w-a)$임을 보이고, (2) 이를 이용해 표 III의 1번으로부터 7번
$$\mathcal F\big(e^{iax}\ (-b\lt x\lt b),\ 0\ (\text{그 밖})\big)=\sqrt{\frac2\pi}\,\frac{\sin b(w-a)}{w-a}$$
을 증명하시오.`,
      sol: R`
**(1)** $\mathcal F(e^{iax}g)=\frac1{\sqrt{2\pi}}\int e^{iax}g(x)e^{-iwx}dx=\frac1{\sqrt{2\pi}}\int g(x)e^{-i(w-a)x}dx=\hat g(w-a)$.
**(2)** $g=1$ ($\lvert x\rvert\lt b$), $0$ (그 밖)이면 표 III #1로 $\hat g(w)=\sqrt{\frac2\pi}\frac{\sin bw}w$이고, 주어진 함수는 $e^{iax}g(x)$이므로 (1)에 의해 $\sqrt{\frac2\pi}\frac{\sin b(w-a)}{w-a}$. $\blacksquare$
(표 III #1 자체는 $\frac1{\sqrt{2\pi}}\int_{-b}^be^{-iwx}dx=\frac1{\sqrt{2\pi}}\cdot\frac{2\sin bw}w$로 바로 나옵니다.)`,
      rubric: R`
- 이동 정리 — 4점
- 표 III #1 확인 또는 인용 — 2점
- 적용과 정리 — 4점` },
    { sec: '11.9', type: 'open', lv: 3, proof: true, quiz: 'hw2-p3c', q: R`$\mathcal F\big(e^{-a\lvert x\rvert}\big)=\sqrt{\frac2\pi}\,\frac a{a^2+w^2}$ ($a\gt0$)을 보이고, 역변환 공식을 이용해 표 III의 3번 $\mathcal F\Big(\frac1{x^2+a^2}\Big)=\sqrt{\frac\pi2}\,\frac{e^{-a\lvert w\rvert}}a$를 증명하시오.`,
      hint: R`우함수 $g$와 $G=\mathcal F(g)$에 대해 $\mathcal F(G)=g$ (변환 쌍의 대칭).`,
      sol: R`
**변환.** 우함수이므로 $\mathcal F(e^{-a\lvert x\rvert})=\sqrt{\frac2\pi}\int_0^\infty e^{-ax}\cos wx\,dx=\sqrt{\frac2\pi}\frac a{a^2+w^2}$ (라플라스 적분).
**대칭.** $g=e^{-a\lvert x\rvert}$는 연속, 구간별로 매끄럽고 절대 적분 가능하므로 역변환이 성립합니다: $g(x)=\frac1{\sqrt{2\pi}}\int G(w)e^{iwx}dw$, $G(w)=\sqrt{\frac2\pi}\frac a{a^2+w^2}$. $x$와 $w$의 이름을 바꾸고 $x\to-x$로 두면
$$\mathcal F(G)(w)=\frac1{\sqrt{2\pi}}\int G(x)e^{-iwx}dx=g(-w)=e^{-a\lvert w\rvert}.$$
선형성으로 $\mathcal F\Big(\frac1{x^2+a^2}\Big)=\frac1a\sqrt{\frac\pi2}\,\mathcal F(G)=\sqrt{\frac\pi2}\frac{e^{-a\lvert w\rvert}}a$. $\blacksquare$`,
      rubric: R`
- $e^{-a\lvert x\rvert}$의 변환 — 3점
- 역변환 공식의 조건과 변수 교환 — 4점
- 상수 정리 — 3점` },
  ] });
})();
