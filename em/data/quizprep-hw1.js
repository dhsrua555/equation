/* 과제형 연습문제 — Homework #1의 3–5번(푸리에 급수)과 같은 유형을 10단원에 덧붙입니다.
   manifest의 맨 끝에 두어 기존 문제 번호(저장된 풀이 기록)가 바뀌지 않게 합니다. 1–2번 유형은 17단원(more-17.js)에 있습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({ n: 10, problems: [
    // HW1-3: 급수에 점을 대입해 급수의 합 구하기
    { sec: '11.2', type: 'open', lv: 3, proof: true, quiz: 'hw1-p3', q: R`$f(x)=\lvert x\rvert$ ($-\pi\lt x\lt\pi$, 주기 $2\pi$)의 푸리에 급수를 구하고, 이를 이용해 $\sum_{m=1}^\infty\frac1{(2m-1)^2}=\frac{\pi^2}8$과 $\sum_{n=1}^\infty\frac1{n^2}=\frac{\pi^2}6$을 보이시오.`,
      hint: R`우함수라 코사인 급수입니다. 확장이 연속인 점 $x=0$에 대입하세요.`,
      sol: R`
우함수이므로 $b_n=0$, $a_0=\frac1\pi\int_0^\pi x\,dx=\frac\pi2$, $a_n=\frac2\pi\int_0^\pi x\cos nx\,dx=\frac2\pi\cdot\frac{(-1)^n-1}{n^2}$ (홀수 $n$이면 $-\frac4{\pi n^2}$, 짝수이면 0).
$$\lvert x\rvert=\frac\pi2-\frac4\pi\Big(\cos x+\frac{\cos3x}{3^2}+\frac{\cos5x}{5^2}+\cdots\Big)$$
주기 확장(삼각파)은 연속이고 구간별로 매끄러우므로 모든 점에서 수렴합니다. $x=0$을 넣으면 $0=\frac\pi2-\frac4\pi\sum_{m}\frac1{(2m-1)^2}$, 즉 $\sum\frac1{(2m-1)^2}=\frac{\pi^2}8$.
$\zeta(2)=\sum_{\text{홀수}}+\sum\frac1{(2m)^2}=\frac{\pi^2}8+\frac14\zeta(2)$이므로 $\zeta(2)=\frac{\pi^2}6$.`,
      rubric: R`
- 계수 $a_0=\frac\pi2$, $a_n$ (홀짝 구분) — 4점
- 수렴의 근거(확장이 연속) — 2점
- $x=0$ 대입으로 홀수 항의 합 — 2점
- 짝수 항 처리로 $\zeta(2)$ — 2점` },
    { sec: '11.4', type: 'open', lv: 3, quiz: 'hw1-p3', q: R`$f(x)=x$ ($-\pi\lt x\lt\pi$)의 푸리에 급수 $2\sum_{n=1}^\infty\frac{(-1)^{n+1}}n\sin nx$에 $x=\pi$를 대입해 $\zeta(2)$를 얻으려 하면 왜 안 되는지 설명하고, 파세발 항등식으로 $\zeta(2)=\frac{\pi^2}6$을 보이시오.`,
      sol: R`
**대입이 안 되는 이유.** 주기 확장은 $x=\pi$에서 $f(\pi^-)=\pi$, $f(\pi^+)=-\pi$로 불연속이라 급수는 좌우 평균 $0$으로 수렴합니다. 실제로 $\sin n\pi=0$이라 급수의 값은 0이고, $\zeta(2)$에 대한 정보가 없습니다. 게다가 이 급수는 $\frac1n$ 꼴이라 $\frac1{n^2}$이 나오지도 않습니다.
**파세발.** $a_0=a_n=0$, $b_n=\frac{2(-1)^{n+1}}n$이므로 $\frac1\pi\int_{-\pi}^{\pi}x^2dx=\frac{2\pi^2}3=\sum b_n^2=4\zeta(2)$, 따라서 $\zeta(2)=\frac{\pi^2}6$. 파세발은 점별 수렴이 아니라 제곱평균 수렴만 쓰므로 불연속이 있어도 됩니다.`,
      rubric: R`
- 불연속점에서 좌우 평균으로 수렴함을 지적 — 3점
- 파세발 항등식을 정확히 씀($a_0$ 계수 포함) — 3점
- $\zeta(2)=\frac{\pi^2}6$ — 2점` },
    { sec: '11.2', type: 'num', lv: 2, quiz: 'hw1-p3', q: R`$x^2=\frac13+\frac4{\pi^2}\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos n\pi x$ ($-1\le x\le1$)에 $x=0$을 넣어 얻는 $\sum_{n=1}^\infty\frac{(-1)^{n+1}}{n^2}=1-\frac1{2^2}+\frac1{3^2}-\cdots$의 값은?`, ans: 'pi^2/12', ansTex: R`\tfrac{\pi^2}{12}`,
      sol: R`$0=\frac13+\frac4{\pi^2}\sum\frac{(-1)^n}{n^2}$이므로 $\sum\frac{(-1)^{n+1}}{n^2}=\frac{\pi^2}{12}$. $x=0$은 연속점이라 대입해도 됩니다.` },
    // HW1-4: 확장을 골라 원하는 꼴의 급수 만들기
    { sec: '11.2', type: 'num', lv: 2, quiz: 'hw1-p4', q: R`$0\lt x\lt\frac\pi2$에서 $1=\sum_{n=1}^\infty a_n\cos nx$가 되도록 $(\frac\pi2,\pi)$에서 $-1$로 확장해 얻은 계수 $a_n=\frac4{n\pi}\sin\frac{n\pi}2$에서 $a_3$은?`, ans: '-4/(3*pi)', ansTex: R`-\tfrac4{3\pi}\approx-0.4244`,
      sol: R`$\sin\frac{3\pi}2=-1$이므로 $a_3=-\frac4{3\pi}$.` },
    { sec: '11.2', type: 'mc', lv: 2, quiz: 'hw1-p4', q: R`$0\lt x\lt\frac\pi2$에서 $1=\sum_{n\ge1}a_n\cos nx$ (상수항 없음)로 나타내려고 $1$을 $(0,\pi)$ 위의 함수 $g$로 늘려 우함수 확장한다. $g$가 반드시 만족해야 하는 조건은?`,
      choices: [R`$\int_0^\pi g\,dx=0$ (평균이 0)`, R`$g$가 $(0,\pi)$에서 연속`, R`$g(\pi-x)=g(x)$`, R`$g$가 기함수`], ans: 0,
      sol: R`코사인 급수의 상수항은 $a_0=\frac1\pi\int_0^\pi g\,dx$이므로, 상수항이 없으려면 평균이 0이어야 합니다. $g(\pi-x)=-g(x)$ (반대칭)이면 평균이 0이면서 짝수 번째 계수까지 0이 되어 가장 간단한 답이 나옵니다. 연속일 필요는 없습니다(점프가 있어도 $(0,\frac\pi2)$ 안에서만 수렴하면 됨).` },
    { sec: '11.2', type: 'open', lv: 3, quiz: 'hw1-p4', q: R`$0\lt x\lt\frac\pi2$에서 $1=\sum_{n=1}^\infty b_n\sin nx$가 되는 계수 $b_n$을 하나 구하시오. ($\frac\pi2\lt x\lt\pi$에서의 값은 자유롭게 정해도 된다.) 짝수 번째 계수가 모두 0이 되도록 확장을 고르시오.`,
      hint: R`사인 급수이므로 기함수 확장을 합니다. $(\frac\pi2,\pi)$를 어떻게 채우면 짝수 번째 항이 사라질까요? $x=\frac\pi2$에 대해 대칭인 확장 $g(\pi-x)=g(x)$을 생각해 보세요.`,
      sol: R`
$(0,\pi)$ 전체에서 $g=1$로 두면 $g(\pi-x)=g(x)$ ($\frac\pi2$에 대해 대칭)이고, 기함수 확장은 사각파입니다.
$$b_n=\frac2\pi\int_0^\pi\sin nx\,dx=\frac2\pi\cdot\frac{1-\cos n\pi}n=\begin{cases}\frac4{n\pi}&n\text{ 홀수}\\0&n\text{ 짝수}\end{cases}$$
$$1=\frac4\pi\Big(\sin x+\frac{\sin3x}3+\frac{\sin5x}5+\cdots\Big)\qquad\Big(0\lt x\lt\frac\pi2\Big)$$
사각파는 $(0,\pi)$에서 연속이라 그 안에서 급수가 1로 수렴합니다. ($(\frac\pi2,\pi)$를 0으로 채우는 등 다른 선택도 가능하지만 짝수 항이 남습니다.) 과제 4번과 짝을 이루는 문제입니다: 코사인이면 **반대칭**, 사인이면 **대칭**으로 $\frac\pi2$ 너머를 채우면 짝수 항이 사라집니다.`,
      rubric: R`
- 확장의 선택과 기함수 확장 — 3점
- $b_n$ 계산 (홀짝) — 3점
- 수렴 구간의 근거 — 2점` },
    // HW1-5: 주기적 외력을 받는 ODE
    { sec: '11.3', type: 'open', lv: 3, quiz: 'hw1-p5', q: R`주기 $2\pi$인 $f(x)=a_0+\sum_{n=1}^\infty(a_n\cos nx+b_n\sin nx)$에 대하여 $y''+4y'+3y=f(x)$의 일반해를 구하시오.`,
      sol: R`
**동차해.** $\lambda^2+4\lambda+3=(\lambda+1)(\lambda+3)=0$에서 $y_h=c_1e^{-x}+c_2e^{-3x}$.
**상수항.** $3C=a_0$에서 $\frac{a_0}3$.
**$n$번째 항.** $y_n=A_n\cos nx+B_n\sin nx$를 넣으면 $(3-n^2)A_n+4nB_n=a_n$, $-4nA_n+(3-n^2)B_n=b_n$. 행렬식 $(3-n^2)^2+16n^2=(n^2+1)(n^2+9)$이므로
$$A_n=\frac{(3-n^2)a_n-4nb_n}{(n^2+1)(n^2+9)},\qquad B_n=\frac{4na_n+(3-n^2)b_n}{(n^2+1)(n^2+9)}.$$
$$y=c_1e^{-x}+c_2e^{-3x}+\frac{a_0}3+\sum_{n=1}^\infty(A_n\cos nx+B_n\sin nx)$$`,
      rubric: R`
- 동차해 — 2점
- 상수항 $\frac{a_0}3$ — 1점
- $n$번째 항의 연립방정식 — 3점
- $A_n$, $B_n$ — 3점
- 일반해로 정리 — 1점` },
    { sec: '11.3', type: 'num', lv: 2, quiz: 'hw1-p5', q: R`$y''+3y'+2y=\cos x$의 정상상태 해(주기해) $A\cos x+B\sin x$의 진폭 $\sqrt{A^2+B^2}$은?`, ans: '1/sqrt(10)', ansTex: R`\tfrac1{\sqrt{10}}\approx0.3162`,
      sol: R`$A=\frac{(2-1)\cdot1}{2\cdot5}=\frac1{10}$, $B=\frac{3\cdot1}{10}=\frac3{10}$이므로 진폭 $\sqrt{\frac1{100}+\frac9{100}}=\frac1{\sqrt{10}}$. $\frac1{\lvert p(i)\rvert}=\frac1{\lvert1+3i\rvert}$과 같습니다.` },
    { sec: '11.3', type: 'mc', lv: 3, quiz: 'hw1-p5', q: R`$y''+9y=f(x)$이고 $f(x)=\sum_{n=1}^\infty b_n\sin nx$에서 $b_3\ne0$일 때 옳은 것은?`,
      choices: [R`$n=3$ 항에서 공진이 일어나 특수해에 $x\cos3x$ 꼴의 항이 생긴다`, R`모든 항이 $\frac{b_n}{9-n^2}\sin nx$로 풀린다`, R`동차해에 $e^{-3x}$가 들어 있다`, R`$b_3$ 항은 특수해에 영향을 주지 않는다`], ans: 0,
      sol: R`특성근 $\pm3i$라 $\sin3x$는 동차해입니다. $n=3$에서 분모 $9-n^2=0$이므로 $y=Cx\cos3x$ 꼴로 찾으면 $y''+9y=-6C\sin3x=b_3\sin3x$, $C=-\frac{b_3}6$ — 진폭이 $x$에 비례해 커지는 공진입니다. $n\ne3$인 항만 $\frac{b_n}{9-n^2}\sin nx$입니다.` },
  ] });
})();
