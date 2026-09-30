/* 실전 모의고사 V — 공학수학2 강의 PPT 「선형대수학」(17단원)과 Homework #1 유형(10단원). 연습문제와 겹치지 않는 문항. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push({
    id: 'x5', roman: 'V', kind: '중간고사형 · 공학수학 2 (강의 PPT)', title: '선형대수학 강의와 과제 유형', scopeText: '17단원 · 10단원(과제형)',
    desc: '강의 PPT의 벡터공간·선형사상·내적과 근사에서 12문항, 과제 3·5번과 같은 푸리에 급수 문항 2개. 정의를 번호대로 확인하는 답안 쓰기를 연습합니다.',
    minutes: 75, plot: 'bestapprox',
    problems: [
      { ch: 'ch17', type: 'mc', lv: 1, pts: 6, q: R`$M_{2,2}(\mathbb R)$의 부분공간인 것은?`,
        choices: [R`$\{A:\operatorname{tr}A=0\}$`, R`$\{A:\det A=0\}$`, R`$\{A:A^2=A\}$`, R`$\{A:a_{11}=1\}$`], ans: 0,
        sol: R`대각합은 선형이므로 $\operatorname{tr}A=0$인 행렬은 영행렬을 포함하고 덧셈·상수곱에 닫혀 있습니다. $\det$은 선형이 아니어서 $\operatorname{diag}(1,0)+\operatorname{diag}(0,1)=I$처럼 닫힘이 깨지고, $A^2=A$는 $2I$에서, $a_{11}=1$은 영행렬에서 깨집니다.` },
      { ch: 'ch17', type: 'num', lv: 2, pts: 6, q: R`$W=\{p\in\mathcal P_3(\mathbb R):p(0)=0,\ p'(0)=0\}$의 차원은?`, ans: '2', ansTex: R`2`,
        sol: R`$p=a+bx+cx^2+dx^3$에서 $a=b=0$이므로 $W=\operatorname{span}\{x^2,x^3\}$, 차원 2.` },
      { ch: 'ch17', type: 'mc', lv: 2, pts: 6, q: R`$L:\mathbb R^3\to\mathbb R^2$, $L(x,y,z)=(x-y,\ y-z)$에 대해 옳은 것은?`,
        choices: [R`$\dim\ker L=1$이고 $L$은 전사이다`, R`$\dim\ker L=0$이고 $L$은 단사이다`, R`$\dim\ker L=2$이다`, R`$\operatorname{im}L$은 1차원이다`], ans: 0,
        sol: R`$L=0\iff x=y=z$이므로 $\ker L=\operatorname{span}\{(1,1,1)\}$ (차원 1). 차원정리로 $\dim\operatorname{im}L=3-1=2$, 즉 $\operatorname{im}L=\mathbb R^2$ (전사).` },
      { ch: 'ch17', type: 'mc', lv: 2, pts: 6, q: R`$L:\mathbb R^2\to\mathbb R^2$가 선형이고 $L(1,2)=(3,0)$, $L(0,1)=(1,1)$이면 $L(2,1)$은?`,
        choices: [R`$(3,\ -3)$`, R`$(6,\ 1)$`, R`$(5,\ 2)$`, R`$(3,\ 3)$`], ans: 0,
        sol: R`$(2,1)=2(1,2)-3(0,1)$이므로 선형확장정리로 $L(2,1)=2(3,0)-3(1,1)=(3,\ -3)$.` },
      { ch: 'ch17', type: 'mc', lv: 2, pts: 6, q: R`$\mathcal P_2(\mathbb R)$에서 $\langle p,q\rangle=p(0)q(0)+p(1)q(1)$이 내적이 **아닌** 이유를 보여 주는 $p$는?`,
        choices: [R`$p(x)=x^2-x$`, R`$p(x)=1$`, R`$p(x)=x$`, R`$p(x)=x^2+1$`], ans: 0,
        sol: R`$p=x(x-1)\ne0$인데 $\langle p,p\rangle=p(0)^2+p(1)^2=0$이라 양정이 깨집니다. 점이 3개($0,1,2$)이면 2차 이하 다항식에서 내적이 됩니다.` },
      { ch: 'ch17', type: 'num', lv: 1, pts: 5, q: R`$C[0,1]$에 $\langle f,g\rangle=\int_0^1fg\,dx$를 줄 때 $\|x\|^2$은?`, ans: '1/3', ansTex: R`\tfrac13`,
        sol: R`$\int_0^1x^2dx=\frac13$.` },
      { ch: 'ch17', type: 'num', lv: 2, pts: 5, q: R`$C[0,1]$의 정적분 내적 $\int_0^1fg\,dx$에서 $x+c$가 상수함수 $1$과 직교하도록 하는 $c$는?`, ans: '-1/2', ansTex: R`-\tfrac12`,
        sol: R`$\int_0^1(x+c)\,dx=\frac12+c=0$이므로 $c=-\frac12$. 그람-슈미트로 $x$에서 $1$ 방향 성분 $\frac{\langle x,1\rangle}{\|1\|^2}=\frac12$을 뺀 것입니다.` },
      { ch: 'ch17', type: 'open', lv: 3, pts: 10, q: R`$C[0,1]$에 $\langle f,g\rangle=\int_0^1fg\,dx$를 준다.
(1) $\{1,\ x-\frac12\}$가 $\mathcal P_1(\mathbb R)$의 직교기저임을 보이시오.
(2) $x^2$에 가장 가까운 1차 이하 다항식 $w$를 구하고, $x^2-w$가 $1$과 $x$에 모두 직교함을 확인하시오.`,
        rubric: R`
- (1) 내적 0과 기저(개수 = 차원) — 3점
- (2) 계수 $\frac13$과 $1$ — 4점
- $w=x-\frac16$ — 1점
- 직교 확인 — 2점`,
        sol: R`
**(1)** $\langle1,x-\frac12\rangle=\frac12-\frac12=0$. 두 원소는 영이 아닌 직교집합이라 독립이고, $\dim\mathcal P_1=2$이므로 기저입니다.
**(2)** $\|1\|^2=1$, $\|x-\frac12\|^2=\int_0^1(x-\frac12)^2dx=\frac1{12}$. $\langle x^2,1\rangle=\frac13$, $\langle x^2,x-\frac12\rangle=\frac14-\frac16=\frac1{12}$이므로
$$w=\frac13\cdot1+\frac{1/12}{1/12}\Big(x-\frac12\Big)=x-\frac16.$$
확인: $\int_0^1(x^2-x+\frac16)\,dx=\frac13-\frac12+\frac16=0$, $\int_0^1x(x^2-x+\frac16)\,dx=\frac14-\frac13+\frac1{12}=0$ ✓. 오차는 $\|x^2-w\|^2=\frac1{180}$.` },
      { ch: 'ch17', type: 'open', lv: 3, pts: 10, q: R`내적공간 $V$에서 (1) 영벡터를 포함하지 않는 직교집합은 일차독립임을 증명하고, (2) $\{v_1,\dots,v_m\}$이 정규직교이면 모든 $v\in V$에 대해 $\sum_{i=1}^m\lvert\langle v,v_i\rangle\rvert^2\le\|v\|^2$ (베셀 부등식)임을 증명하시오.`,
        rubric: R`
- (1) 일차결합과 $v_j$의 내적, $a_j\|v_j\|^2=0$ — 4점
- (2) $w=\sum\langle v,v_i\rangle v_i$에 대해 $v-w\perp v_j$ — 3점
- 피타고라스로 $\|v\|^2=\|w\|^2+\|v-w\|^2$와 $\|w\|^2=\sum\lvert\langle v,v_i\rangle\rvert^2$ — 3점`,
        sol: R`
**(1)** $\sum a_iv_i=0$과 $v_j$의 내적을 취하면 직교성으로 $a_j\|v_j\|^2=0$, $v_j\ne0$이므로 $a_j=0$.
**(2)** $w=\sum_i\langle v,v_i\rangle v_i$로 두면 $\langle v-w,v_j\rangle=\langle v,v_j\rangle-\langle v,v_j\rangle=0$이라 $v-w\perp w$. 피타고라스로 $\|v\|^2=\|w\|^2+\|v-w\|^2\ge\|w\|^2$이고, 서로 직교하는 항의 피타고라스와 $\|v_i\|=1$로 $\|w\|^2=\sum\lvert\langle v,v_i\rangle\rvert^2$. $\blacksquare$` },
      { ch: 'ch17', type: 'num', lv: 2, pts: 6, q: R`$f(x)=\lvert x\rvert$에 가장 가까운 $\operatorname{span}\{1,\cos x,\sin x\}$ ($[-\pi,\pi]$의 정적분 내적)의 원소를 $a_0+a_1\cos x+b_1\sin x$라 할 때 $a_1$은?`, ans: '-4/pi', ansTex: R`-\tfrac4\pi`,
        sol: R`$a_1=\frac{\langle\lvert x\rvert,\cos x\rangle}{\|\cos x\|^2}=\frac1\pi\int_{-\pi}^{\pi}\lvert x\rvert\cos x\,dx=\frac2\pi\int_0^\pi x\cos x\,dx=\frac2\pi\big[x\sin x+\cos x\big]_0^\pi=\frac2\pi(-2)=-\frac4\pi$.` },
      { ch: 'ch17', type: 'mc', lv: 2, pts: 5, q: R`다음 중 옳은 것은?`,
        choices: [R`베셀 부등식은 모든 정규직교집합에서 성립하고, 파세발 항등식은 (완비) 정규직교기저에서 성립한다`, R`정적분 내적을 준 $C[-\pi,\pi]$는 힐베르트 공간이다`, R`파세발 항등식에서 $a_0^2$ 앞의 계수는 1이다`, R`직교기저에서 정사영의 계수는 $\langle v,v_i\rangle$이다`], ans: 0,
        sol: R`$C[-\pi,\pi]$는 완비가 아니고, 파세발 항등식은 $\frac1\pi\int f^2=2a_0^2+\sum(a_n^2+b_n^2)$이며, 직교기저의 계수는 $\frac{\langle v,v_i\rangle}{\|v_i\|^2}$입니다.` },
      { ch: 'ch17', type: 'mc', lv: 1, pts: 5, q: R`기수에 대한 설명으로 옳은 것은?`,
        choices: [R`$\lvert\mathbb Q\rvert=\lvert\mathbb N\rvert$이고 $\lvert\mathbb R\rvert\ne\lvert\mathbb N\rvert$`, R`$\lvert\mathbb Q\rvert=\lvert\mathbb R\rvert$`, R`짝수 전체는 $\mathbb N$보다 기수가 작다`, R`$(0,1)$은 $\mathbb R$보다 기수가 작다`], ans: 0,
        sol: R`$\mathbb Q$는 가산, $\mathbb R$은 비가산(대각선 논법). 짝수 전체와 $\mathbb N$은 $n\mapsto2n$, $(0,1)$과 $\mathbb R$은 $\tan(\pi(x-\frac12))$로 기수가 같습니다.` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 12, q: R`$f(x)=\lvert x\rvert$ ($-\pi\lt x\lt\pi$, 주기 $2\pi$)의 푸리에 급수를 구하고, 그 결과를 이용해 $\sum_{n=1}^\infty\frac1{n^2}=\frac{\pi^2}6$임을 보이시오. 대입하는 점에서 급수가 수렴하는 값의 근거도 쓰시오.`,
        rubric: R`
- $a_0=\frac\pi2$, $a_n=\frac{2((-1)^n-1)}{\pi n^2}$, $b_n=0$ — 4점
- 확장이 연속이라 $x=0$에서 0으로 수렴 — 3점
- 홀수 항의 합 $\frac{\pi^2}8$ — 2점
- 짝수 항 처리로 $\zeta(2)=\frac{\pi^2}6$ — 3점`,
        sol: R`
$\lvert x\rvert=\frac\pi2-\frac4\pi\sum_{m=1}^\infty\frac{\cos(2m-1)x}{(2m-1)^2}$. 주기 확장(삼각파)은 연속이고 구간별로 매끄러우므로 $x=0$에서 급수는 $f(0)=0$으로 수렴하고, $\sum\frac1{(2m-1)^2}=\frac{\pi^2}8$. $\zeta(2)=\frac{\pi^2}8+\frac14\zeta(2)$에서 $\zeta(2)=\frac{\pi^2}6$.` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 12, q: R`주기 $2\pi$인 $f(x)=a_0+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$에 대하여 $y''+2y'+y=f(x)$의 일반해를 구하시오.`,
        rubric: R`
- 동차해 $(c_1+c_2x)e^{-x}$ (중근) — 3점
- 상수항 $a_0$ — 1점
- $n$번째 항의 연립방정식 — 3점
- $A_n,B_n$ (분모 $(n^2+1)^2$) — 4점
- 일반해로 정리 — 1점`,
        sol: R`
**동차해.** $\lambda^2+2\lambda+1=(\lambda+1)^2$이므로 중근 $-1$: $y_h=(c_1+c_2x)e^{-x}$.
**상수항.** $C=a_0$.
**$n$번째 항.** $y_n=A_n\cos nx+B_n\sin nx$를 넣으면 $(1-n^2)A_n+2nB_n=a_n$, $-2nA_n+(1-n^2)B_n=b_n$. 행렬식은 $(1-n^2)^2+4n^2=(n^2+1)^2$이므로
$$A_n=\frac{(1-n^2)a_n-2nb_n}{(n^2+1)^2},\qquad B_n=\frac{2na_n+(1-n^2)b_n}{(n^2+1)^2}.$$
$$y=(c_1+c_2x)e^{-x}+a_0+\sum_{n=1}^\infty(A_n\cos nx+B_n\sin nx)$$` },
    ],
  });
})();
