/* 추가 연습문제 — 04 급수해와 특수함수 (Kreyszig 5.1–5.5). 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 4,
    secTitles: { '5.1': '거듭제곱급수', '5.2': '르장드르', '5.3': '프로베니우스', '5.4': '베셀 Jν', '5.5': '베셀 Yν' },
    secs: ['5.1', '5.1', '5.1', '5.2', '5.2', '5.3', '5.4', '5.4', '5.3', '5.4'],
    problems: [
      { sec: '5.1', type: 'num', lv: 1, q: R`$y'=2xy,\ y(0)=1$의 거듭제곱급수 해에서 $x^4$의 계수는?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$x^s$ 계수: $(s+1)a_{s+1}=2a_{s-1}$. $a_1=0$, $a_2=a_0=1$, $a_4=\frac{2a_2}{4}=\tfrac12$. 해는 $e^{x^2}=1+x^2+\tfrac{x^4}2+\cdots$.` },
      { sec: '5.1', type: 'num', lv: 2, q: R`$y''=y,\ y(0)=1,\ y'(0)=0$의 거듭제곱급수 해에서 $x^6$의 계수는?`, ans: '1/720', ansTex: R`\tfrac1{720}`,
        sol: R`$a_{s+2}=\dfrac{a_s}{(s+2)(s+1)}$, $a_0=1$이면 $a_{2n}=\dfrac1{(2n)!}$. 해는 $\cosh x$이고 $a_6=\tfrac1{720}$.` },
      { sec: '5.1', type: 'num', lv: 2, q: R`$y''+x^2y=0,\ y(0)=1,\ y'(0)=0$의 거듭제곱급수 해에서 $x^4$의 계수는?`, ans: '-1/12', ansTex: R`-\tfrac1{12}`,
        sol: R`$(s+2)(s+1)a_{s+2}+a_{s-2}=0$. $s=0$: $a_2=0$, $s=2$: $12a_4+a_0=0$에서 $a_4=-\tfrac1{12}$.` },
      { sec: '5.1', type: 'mc', lv: 1, q: R`$(1+x^2)y''+y=0$을 $x=0$ 주위에서 풀 때 보장되는 수렴반경의 최솟값은?`,
        choices: [R`$\tfrac12$`, R`$1$`, R`$\sqrt2$`, R`$\infty$`], ans: 1,
        sol: R`$1+x^2=0$의 근 $\pm i$가 특이점이고 원점에서 거리 1입니다. 실수축에는 특이점이 없어도 반경은 1로 제한됩니다.` },
      { sec: '5.1', type: 'num', lv: 2, q: R`$(x^2+9)y''-y=0$을 $x_0=4$ 중심 거듭제곱급수로 풀 때 보장되는 수렴반경의 최솟값은?`, ans: '5', ansTex: R`5`,
        sol: R`특이점 $\pm3i$까지의 거리 $|4-3i|=5$.` },
      { sec: '5.2', type: 'num', lv: 1, q: R`$P_3(\tfrac12)$의 값은?`, ans: '-7/16', ansTex: R`-\tfrac7{16}`,
        sol: R`$P_3=\tfrac12(5x^3-3x)$에 넣으면 $\tfrac12\big(\tfrac58-\tfrac32\big)=-\tfrac7{16}$.` },
      { sec: '5.2', type: 'num', lv: 2, q: R`$P_4(0)$의 값은?`, ans: '3/8', ansTex: R`\tfrac38`,
        sol: R`$P_4=\tfrac18(35x^4-30x^2+3)$이므로 $P_4(0)=\tfrac38$.` },
      { sec: '5.2', type: 'num', lv: 2, q: R`$x^2=a_0P_0+a_1P_1+a_2P_2$로 전개할 때 $a_2$는?`, ans: '2/3', ansTex: R`\tfrac23`,
        sol: R`$P_2=\tfrac12(3x^2-1)$에서 $x^2=\tfrac23P_2+\tfrac13P_0$. ($a_1=0$)` },
      { sec: '5.2', type: 'mc', lv: 2, q: R`르장드르 다항식의 대칭성으로 옳은 것은?`,
        choices: [R`$P_n(-x)=P_n(x)$`, R`$P_n(-x)=-P_n(x)$`, R`$P_n(-x)=(-1)^nP_n(x)$`, R`$P_n(-x)=P_{n+1}(x)$`], ans: 2,
        sol: R`$P_n$은 $n$이 짝수이면 짝수 차수 항만, 홀수이면 홀수 차수 항만 가집니다(로드리게스 공식에서 $(x^2-1)^n$을 $n$번 미분).` },
      { sec: '5.2', type: 'num', lv: 3, q: R`$\displaystyle\int_{-1}^{1}x^3P_3(x)\,dx$의 값은?`, ans: '4/35', ansTex: R`\tfrac4{35}`,
        sol: R`$x^3=\tfrac25P_3+\tfrac35P_1$. 직교성으로 $\int x^3P_3=\tfrac25\int P_3^2=\tfrac25\cdot\tfrac27=\tfrac4{35}$.` },
      { sec: '5.3', type: 'mc', lv: 2, q: R`$x^2y''+xy'+(x^2-\tfrac14)y=0$의 결정방정식의 근은 프로베니우스의 어느 경우인가?`,
        choices: [R`차가 정수가 아닌 서로 다른 근 (경우 1)`, R`중근 (경우 2)`, R`차가 정수인 근 (경우 3)`, R`복소수 근`], ans: 2,
        sol: R`$r^2-\tfrac14=0$에서 $r=\pm\tfrac12$, 차가 1입니다. 경우 3이지만 이 방정식은 로그 항 없이 $J_{1/2}$, $J_{-1/2}$로 풀립니다($k=0$인 경우).` },
      { sec: '5.3', type: 'mc', lv: 2, q: R`$x=0$이 정칙 특이점인 방정식은?`,
        choices: [R`$x^2y''+xy'+y=0$`, R`$x^3y''+y=0$`, R`$y''+xy=0$`, R`$x^4y''+xy'+y=0$`], ans: 0,
        sol: R`①은 $b=1$, $c=1$로 해석적이라 정칙 특이점. ②는 $c(x)=1/x$, ④는 $b(x)=1/x^2$이라 비정칙. ③은 $x=0$이 보통점입니다.` },
      { sec: '5.3', type: 'num', lv: 2, q: R`$2xy''+(1+x)y'-2y=0$의 결정방정식의 큰 근은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$\frac x2$를 곱하면 $x^2y''+x\cdot\frac{1+x}2y'-xy=0$, $b_0=\tfrac12$, $c_0=0$. $r(r-1)+\tfrac12r=0$에서 $r=0,\tfrac12$.` },
      { sec: '5.3', type: 'open', lv: 3, q: R`프로베니우스 방법으로 $xy''+2y'+xy=0$을 풀어 두 해가 $\dfrac{\sin x}{x}$, $\dfrac{\cos x}{x}$임을 보이세요.`,
        sol: R`
$x$를 곱하면 $x^2y''+2xy'+x^2y=0$, $b_0=2$, $c_0=0$. 결정방정식 $r^2+r=0$에서 $r=0,-1$ (차가 정수).
$y=\sum a_mx^{m+r}$를 넣으면 $(m+r)(m+r+1)a_m=-a_{m-2}$.
- $r=0$: $a_m=-\dfrac{a_{m-2}}{m(m+1)}$, $a_0=1$이면 $1-\dfrac{x^2}{3!}+\dfrac{x^4}{5!}-\cdots=\dfrac{\sin x}x$.
- $r=-1$: $(m-1)m\,a_m=-a_{m-2}$. $m=1$에서 $0=0$이라 막히지 않으므로 로그 항이 필요 없고, $a_0=1$, $a_1=0$이면 $x^{-1}\big(1-\frac{x^2}{2!}+\cdots\big)=\dfrac{\cos x}x$.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`$J_{-1/2}(\pi)$의 값은?`, ans: '-sqrt(2)/pi', ansTex: R`-\tfrac{\sqrt2}{\pi}\approx-0.450`,
        sol: R`$J_{-1/2}(x)=\sqrt{\dfrac2{\pi x}}\cos x$이므로 $\sqrt{\dfrac{2}{\pi^2}}\cdot(-1)=-\dfrac{\sqrt2}\pi$.` },
      { sec: '5.4', type: 'mc', lv: 2, q: R`$J_2(x)$를 $J_0$, $J_1$로 나타내면?`,
        choices: [R`$\dfrac2xJ_1-J_0$`, R`$J_0-\dfrac2xJ_1$`, R`$2J_1'$`, R`$\dfrac1xJ_1+J_0$`], ans: 0,
        sol: R`$J_{\nu-1}+J_{\nu+1}=\dfrac{2\nu}{x}J_\nu$에 $\nu=1$을 넣으면 $J_0+J_2=\dfrac2xJ_1$.` },
      { sec: '5.4', type: 'mc', lv: 2, q: R`$\displaystyle\int_0^a xJ_0(x)\,dx$와 같은 것은?`,
        choices: [R`$aJ_1(a)$`, R`$J_1(a)$`, R`$a^2J_0(a)$`, R`$-aJ_1(a)$`], ans: 0,
        sol: R`$(xJ_1)'=xJ_0$이므로 적분하면 $\big[xJ_1\big]_0^a=aJ_1(a)$.` },
      { sec: '5.4', type: 'num', lv: 3, q: R`$J_{3/2}(\pi/2)$의 값은?`, ans: '4/pi^2', ansTex: R`\tfrac4{\pi^2}\approx0.405`,
        hint: R`$J_{-1/2}+J_{3/2}=\frac1xJ_{1/2}$를 쓰세요.`,
        sol: R`
$J_{3/2}=\dfrac1xJ_{1/2}-J_{-1/2}$. $x=\pi/2$에서 $J_{1/2}=\sqrt{\dfrac{4}{\pi^2}}\sin\dfrac\pi2=\dfrac2\pi$, $J_{-1/2}=\dfrac2\pi\cos\dfrac\pi2=0$.
$J_{3/2}(\pi/2)=\dfrac{2/\pi}{\pi/2}=\dfrac4{\pi^2}$.` },
      { sec: '5.4', type: 'mc', lv: 2, q: R`$x^2y''+xy'+(x^2-4)y=0$의 일반해는?`,
        choices: [R`$c_1J_2+c_2J_{-2}$`, R`$c_1J_2+c_2Y_2$`, R`$c_1J_4+c_2Y_4$`, R`$c_1J_2+c_2J_{1/2}$`], ans: 1,
        sol: R`$\nu=2$인 베셀 방정식. $\nu$가 정수이면 $J_{-2}=J_2$라 독립이 아니므로 $Y_2$를 씁니다.` },
      { sec: '5.4', type: 'mc', lv: 3, q: R`$x^2y''+xy'+(4x^2-1)y=0$의 일반해는?`,
        choices: [R`$c_1J_1(2x)+c_2Y_1(2x)$`, R`$c_1J_2(x)+c_2Y_2(x)$`, R`$c_1J_1(x/2)+c_2Y_1(x/2)$`, R`$c_1J_{1/2}(2x)+c_2J_{-1/2}(2x)$`], ans: 0,
        sol: R`$z=2x$로 두면 $xy'=zu'$, $x^2y''=z^2u''$이므로 $z^2u''+zu'+(z^2-1)u=0$, 즉 $\nu=1$인 베셀 방정식.` },
      { sec: '5.5', type: 'mc', lv: 1, q: R`원판 문제에서 원점($x=0$)에서 유계인 해만 원할 때 $c_1J_0(x)+c_2Y_0(x)$의 계수는?`,
        choices: [R`$c_2=0$`, R`$c_1=0$`, R`$c_1=c_2$`, R`제한 없음`], ans: 0,
        sol: R`$Y_0(x)$는 $x\to0$에서 $\ln x$처럼 $-\infty$로 발산하므로 유계인 해는 $c_2=0$일 때뿐입니다.` },
    ],
  });
})();
