/* 추가 연습문제 — 05 라플라스 변환 (Kreyszig 6.1–6.7). 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 5,
    secTitles: { '6.1': '정의·s-이동', '6.2': '도함수·IVP', '6.3': '계단·t-이동', '6.4': '델타·부분분수', '6.5': '합성곱', '6.6': '변환의 미분·적분', '6.7': '연립 ODE' },
    secs: ['6.1', '6.1', '6.2', '6.3', '6.3', '6.4', '6.5', '6.6', '6.5', '6.4'],
    problems: [
      { sec: '6.1', type: 'num', lv: 1, q: R`$F(s)=\mathcal L\{3t^2-2e^{-t}\}$일 때 $F(1)$은?`, ans: '5', ansTex: R`5`,
        sol: R`$F=\dfrac{6}{s^3}-\dfrac{2}{s+1}$이므로 $F(1)=6-1=5$.` },
      { sec: '6.1', type: 'mc', lv: 1, q: R`$\mathcal L\{\cosh2t\}$는?`,
        choices: [R`$\dfrac{s}{s^2+4}$`, R`$\dfrac{s}{s^2-4}$`, R`$\dfrac{2}{s^2-4}$`, R`$\dfrac{1}{s-2}$`], ans: 1,
        sol: R`$\cosh2t=\tfrac12(e^{2t}+e^{-2t})$이므로 $\tfrac12\Big(\dfrac1{s-2}+\dfrac1{s+2}\Big)=\dfrac{s}{s^2-4}$.` },
      { sec: '6.1', type: 'num', lv: 2, q: R`$F(s)=\mathcal L\{e^{2t}\sin3t\}$일 때 $F(2)$는?`, ans: '1/3', ansTex: R`\tfrac13`,
        sol: R`$s$-이동으로 $F=\dfrac{3}{(s-2)^2+9}$, $F(2)=\tfrac39=\tfrac13$.` },
      { sec: '6.1', type: 'num', lv: 2, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{4}{s^2+6s+13}\Big\}$일 때 $f(\pi/4)$는?`, ans: '2*e^(-3*pi/4)', ansTex: R`2e^{-3\pi/4}\approx0.190`,
        sol: R`$s^2+6s+13=(s+3)^2+4$이므로 $\dfrac{2\cdot2}{(s+3)^2+2^2}\to2e^{-3t}\sin2t$. $f(\pi/4)=2e^{-3\pi/4}$.` },
      { sec: '6.1', type: 'num', lv: 2, q: R`$F(s)=\mathcal L\{\sin^2t\}$일 때 $F(1)$은?`, ans: '2/5', ansTex: R`\tfrac25`,
        sol: R`$\sin^2t=\tfrac12(1-\cos2t)$이므로 $F=\tfrac12\Big(\dfrac1s-\dfrac{s}{s^2+4}\Big)$, $F(1)=\tfrac12\big(1-\tfrac15\big)=\tfrac25$.` },
      { sec: '6.1', type: 'mc', lv: 2, q: R`$\mathcal L\{\sqrt t\}$는?`,
        choices: [R`$\dfrac{\sqrt\pi}{2s^{3/2}}$`, R`$\dfrac{1}{s^{3/2}}$`, R`$\dfrac{\sqrt\pi}{s^{1/2}}$`, R`$\dfrac{2}{\sqrt\pi\,s^{3/2}}$`], ans: 0,
        sol: R`$\mathcal L(t^a)=\dfrac{\Gamma(a+1)}{s^{a+1}}$, $\Gamma(\tfrac32)=\tfrac{\sqrt\pi}2$.` },
      { sec: '6.2', type: 'num', lv: 1, q: R`$y'-y=1,\ y(0)=0$을 라플라스 변환으로 풀 때 $y(\ln3)$은?`, ans: '2', ansTex: R`2`,
        sol: R`$(s-1)Y=\dfrac1s$, $Y=\dfrac1{s-1}-\dfrac1s$, $y=e^t-1$. $y(\ln3)=2$.` },
      { sec: '6.2', type: 'num', lv: 2, q: R`$y''+4y'+3y=0,\ y(0)=3,\ y'(0)=-5$일 때 $y(\ln2)$는?`, ans: '9/8', ansTex: R`\tfrac98`,
        sol: R`
$(s^2+4s+3)Y=3s+7$. $Y=\dfrac{3s+7}{(s+1)(s+3)}=\dfrac{2}{s+1}+\dfrac{1}{s+3}$.
$y=2e^{-t}+e^{-3t}$, $y(\ln2)=1+\tfrac18=\tfrac98$.` },
      { sec: '6.2', type: 'num', lv: 2, q: R`$y''+y=2t,\ y(0)=0,\ y'(0)=0$일 때 $y(\pi)$는?`, ans: '2*pi', ansTex: R`2\pi`,
        sol: R`$(s^2+1)Y=\dfrac2{s^2}$, $Y=2\Big(\dfrac1{s^2}-\dfrac1{s^2+1}\Big)$, $y=2t-2\sin t$. $y(\pi)=2\pi$.` },
      { sec: '6.2', type: 'mc', lv: 2, q: R`$y''-2y'+y=e^t,\ y(0)=1,\ y'(0)=0$의 보조방정식은?`,
        choices: [R`$(s^2-2s+1)Y-s+2=\dfrac1{s-1}$`, R`$(s^2-2s+1)Y-s-2=\dfrac1{s-1}$`, R`$(s^2-2s+1)Y=\dfrac1{s-1}+s$`, R`$(s^2-2s+1)Y-s=\dfrac1{s-1}$`], ans: 0,
        sol: R`$\mathcal L(y'')=s^2Y-s$, $-2\mathcal L(y')=-2(sY-1)=-2sY+2$. 합하면 $(s^2-2s+1)Y-s+2$.` },
      { sec: '6.2', type: 'open', lv: 3, q: R`라플라스 변환으로 $y''-3y'+2y=4e^{3t},\ y(0)=0,\ y'(0)=0$을 푸세요.`,
        sol: R`
$(s^2-3s+2)Y=\dfrac4{s-3}$이므로 $Y=\dfrac{4}{(s-1)(s-2)(s-3)}$.
가림법: $s=1$에서 $\frac{4}{(-1)(-2)}=2$, $s=2$에서 $\frac4{(1)(-1)}=-4$, $s=3$에서 $\frac4{(2)(1)}=2$.
$$y=2e^{t}-4e^{2t}+2e^{3t}$$
검산: $y(0)=0$, $y'(0)=2-8+6=0$ ✓` },
      { sec: '6.3', type: 'num', lv: 2, q: R`$f(t)=1\ (0<t<2)$, $f(t)=0\ (t>2)$의 라플라스 변환 $F(s)$에 대해 $F(1)$은?`, ans: '1-e^(-2)', ansTex: R`1-e^{-2}`,
        sol: R`$f=1-u(t-2)$이므로 $F=\dfrac{1-e^{-2s}}{s}$, $F(1)=1-e^{-2}$.` },
      { sec: '6.3', type: 'mc', lv: 2, q: R`$\mathcal L\{(t-1)^2u(t-1)\}$은?`,
        choices: [R`$\dfrac{2e^{-s}}{s^3}$`, R`$\dfrac{e^{-s}}{s^3}$`, R`$e^{-s}\Big(\dfrac2{s^3}-\dfrac2{s^2}+\dfrac1s\Big)$`, R`$\dfrac{2}{(s-1)^3}$`], ans: 0,
        sol: R`이미 $f(t-1)u(t-1)$ 꼴($f=t^2$)이므로 $e^{-s}\cdot\dfrac2{s^3}$.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{se^{-\pi s}}{s^2+1}\Big\}$일 때 $f(2\pi)$는?`, ans: '-1', ansTex: R`-1`,
        sol: R`$f=u(t-\pi)\cos(t-\pi)=-u(t-\pi)\cos t$. $f(2\pi)=-1$.` },
      { sec: '6.3', type: 'num', lv: 3, q: R`$y'+2y=u(t-1),\ y(0)=1$일 때 $y(2)$는?`, ans: 'e^(-4)+(1-e^(-2))/2', ansTex: R`e^{-4}+\tfrac12(1-e^{-2})\approx0.451`,
        sol: R`
$(s+2)Y=1+\dfrac{e^{-s}}s$. $\dfrac{1}{s(s+2)}=\tfrac12\Big(\dfrac1s-\dfrac1{s+2}\Big)$.
$y=e^{-2t}+\tfrac12u(t-1)\big(1-e^{-2(t-1)}\big)$, $y(2)=e^{-4}+\tfrac12(1-e^{-2})$.` },
      { sec: '6.3', type: 'open', lv: 3, q: R`$y''+y=r(t),\ y(0)=y'(0)=0$, $r(t)=1\ (0<t<\pi)$, $r(t)=0\ (t>\pi)$을 풀고 $t>\pi$에서의 해를 쓰세요.`,
        sol: R`
$r=1-u(t-\pi)$, $Y=\dfrac{1-e^{-\pi s}}{s(s^2+1)}$. $\dfrac1{s(s^2+1)}\leftrightarrow1-\cos t$.
$$y=(1-\cos t)-u(t-\pi)\big(1-\cos(t-\pi)\big)=1-\cos t-u(t-\pi)(1+\cos t)$$
$0<t<\pi$: $y=1-\cos t$. $t>\pi$: $y=-2\cos t$ (입력이 꺼진 뒤 진폭 2로 자유진동).` },
      { sec: '6.4', type: 'num', lv: 2, q: R`$y''+4y=\delta(t-\pi),\ y(0)=y'(0)=0$일 때 $y(5\pi/4)$는?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$Y=\dfrac{e^{-\pi s}}{s^2+4}$, $y=\tfrac12u(t-\pi)\sin2(t-\pi)=\tfrac12u(t-\pi)\sin2t$. $y(5\pi/4)=\tfrac12\sin\tfrac{5\pi}2=\tfrac12$.` },
      { sec: '6.4', type: 'num', lv: 2, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{s+5}{s^2+s-2}\Big\}$일 때 $f(\ln2)$는?`, ans: '15/4', ansTex: R`\tfrac{15}4`,
        sol: R`$s^2+s-2=(s-1)(s+2)$. 가림법: $s=1$에서 $\tfrac63=2$, $s=-2$에서 $\tfrac{3}{-3}=-1$. $f=2e^t-e^{-2t}$, $f(\ln2)=4-\tfrac14$.` },
      { sec: '6.4', type: 'num', lv: 3, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{1}{s(s+1)^2}\Big\}$일 때 $f(1)$은?`, ans: '1-2/e', ansTex: R`1-\tfrac2e\approx0.264`,
        sol: R`
$\dfrac1{s(s+1)^2}=\dfrac As+\dfrac B{s+1}+\dfrac C{(s+1)^2}$: $A=1$, $C=\frac1s\big|_{s=-1}=-1$, $s^2$ 계수에서 $A+B=0$이라 $B=-1$.
$f=1-e^{-t}-te^{-t}$, $f(1)=1-\tfrac2e$.` },
      { sec: '6.5', type: 'num', lv: 2, q: R`$(e^{t}*e^{-t})(t)$의 $t=\ln2$에서의 값은?`, ans: '3/4', ansTex: R`\tfrac34`,
        sol: R`$\int_0^te^{\tau}e^{-(t-\tau)}d\tau=e^{-t}\cdot\dfrac{e^{2t}-1}2=\sinh t$. $\sinh(\ln2)=\tfrac12(2-\tfrac12)=\tfrac34$.` },
      { sec: '6.5', type: 'num', lv: 2, q: R`합성곱으로 $f(t)=\mathcal L^{-1}\Big\{\dfrac{1}{s^2(s-1)}\Big\}$을 구할 때 $f(1)$은?`, ans: 'e-2', ansTex: R`e-2\approx0.718`,
        sol: R`$\dfrac1{s^2}\cdot\dfrac1{s-1}\leftrightarrow t*e^t=\int_0^t\tau e^{t-\tau}d\tau=e^t-t-1$. $f(1)=e-2$.` },
      { sec: '6.5', type: 'open', lv: 3, q: R`적분방정식 $y(t)=\sin t+2\displaystyle\int_0^ty(\tau)\cos(t-\tau)\,d\tau$를 푸세요.`,
        sol: R`
변환하면 $Y=\dfrac1{s^2+1}+2Y\dfrac{s}{s^2+1}$, 즉 $Y\big(s^2+1-2s\big)=1$.
$$Y=\frac1{(s-1)^2}\quad\Longrightarrow\quad y=te^{t}$$` },
      { sec: '6.6', type: 'num', lv: 2, q: R`$F(s)=\mathcal L\{t\cos2t\}$일 때 $F(1)$은?`, ans: '-3/25', ansTex: R`-\tfrac3{25}`,
        sol: R`$F=-\dfrac{d}{ds}\dfrac{s}{s^2+4}=\dfrac{s^2-4}{(s^2+4)^2}$, $F(1)=\dfrac{-3}{25}$.` },
      { sec: '6.6', type: 'mc', lv: 3, q: R`$\mathcal L^{-1}\Big\{\ln\dfrac{s+1}{s-1}\Big\}$은?`,
        choices: [R`$\dfrac{2\sinh t}{t}$`, R`$\dfrac{2\cosh t}{t}$`, R`$2t\sinh t$`, R`$\dfrac{\sinh t}{2t}$`], ans: 0,
        sol: R`$F'=\dfrac1{s+1}-\dfrac1{s-1}$이고 $\mathcal L\{tf\}=-F'=\dfrac1{s-1}-\dfrac1{s+1}\leftrightarrow e^t-e^{-t}$. 따라서 $f=\dfrac{2\sinh t}{t}$.` },
      { sec: '6.7', type: 'num', lv: 3, q: R`$y_1'=y_2,\ y_2'=y_1,\ y_1(0)=1,\ y_2(0)=0$을 라플라스 변환으로 풀 때 $y_1(\ln3)$은?`, ans: '5/3', ansTex: R`\tfrac53`,
        sol: R`$sY_1-1=Y_2$, $sY_2=Y_1$에서 $Y_1=\dfrac{s}{s^2-1}$, $y_1=\cosh t$. $\cosh(\ln3)=\tfrac12(3+\tfrac13)=\tfrac53$.` },
      { sec: '6.7', type: 'open', lv: 2, q: R`라플라스 변환으로 $y_1'=-y_2,\ y_2'=y_1,\ y_1(0)=1,\ y_2(0)=0$을 푸세요.`,
        sol: R`
$sY_1-1=-Y_2$, $sY_2=Y_1$. 둘째 식을 첫째에 넣으면 $s^2Y_2-1=-Y_2$, $Y_2=\dfrac1{s^2+1}$, $Y_1=\dfrac{s}{s^2+1}$.
$$y_1=\cos t,\qquad y_2=\sin t$$` },
    ],
  });
})();
