/* 추가 연습문제 — 02 2계·고계 선형 ODE (Kreyszig 2.1–3.3). 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 2,
    secTitles: { '2.1': '동차 2계', '2.2': '상수계수', '2.3': '미분연산자', '2.4': '자유진동', '2.5': '오일러-코시', '2.6': '론스키안', '2.7': '미정계수법', '2.8': '강제진동', '2.9': '전기회로', '2.10': '매개변수 변환법', '3.2': '고계 상수계수', '3.3': '고계 비동차' },
    secs: ['2.2', '2.2', '2.2', '2.5', '2.7', '2.7', '2.10', '2.4', '2.8', '3.2', '2.6'],
    problems: [
      { sec: '2.1', type: 'mc', lv: 2, q: R`$y_1=x$가 $x^2y''-xy'+y=0\ (x>0)$의 해일 때, 계수 내림법으로 얻는 두 번째 해는?`,
        choices: [R`$x\ln x$`, R`$x^2$`, R`$\dfrac1x$`, R`$xe^{x}$`], ans: 0,
        sol: R`표준형에서 $p=-\frac1x$. $U=\dfrac1{x^2}e^{\int dx/x}=\dfrac1x$, $u=\ln x$이므로 $y_2=x\ln x$. (보조방정식 $(m-1)^2=0$의 중근)` },
      { sec: '2.1', type: 'mc', lv: 1, q: R`$y''+y=0$의 해 공간의 기저가 되는 쌍은?`,
        choices: [R`$\cos x,\ 2\cos x$`, R`$\sin x,\ -\sin x$`, R`$\cos x,\ \sin x$`, R`$e^{x},\ e^{-x}$`], ans: 2,
        sol: R`기저는 일차독립인 두 해여야 합니다. ①②는 서로 상수배, ④는 $y''-y=0$의 해입니다.` },
      { sec: '2.2', type: 'num', lv: 1, q: R`$y''-9y=0,\ y(0)=2,\ y'(0)=0$일 때 $y\big(\tfrac{\ln2}{3}\big)$는?`, ans: '5/2', ansTex: R`\tfrac52`,
        sol: R`$y=Ae^{3x}+Be^{-3x}$, $A+B=2$, $A-B=0$에서 $A=B=1$. $y=e^{\ln2}+e^{-\ln2}=2+\tfrac12$.` },
      { sec: '2.2', type: 'num', lv: 2, q: R`$y''+4y'+4y=0,\ y(0)=2,\ y'(0)=-3$일 때 $y(1)$은?`, ans: '3*e^(-2)', ansTex: R`3e^{-2}\approx0.406`,
        sol: R`중근 $-2$. $y=(2+c_2x)e^{-2x}$, $y'(0)=c_2-4=-3$에서 $c_2=1$. $y(1)=3e^{-2}$.` },
      { sec: '2.2', type: 'num', lv: 2, q: R`$y''-2y'+10y=0,\ y(0)=1,\ y'(0)=1$일 때 $y(\pi/3)$는?`, ans: '-e^(pi/3)', ansTex: R`-e^{\pi/3}\approx-2.849`,
        sol: R`$\lambda=1\pm3i$. $y=e^x(A\cos3x+B\sin3x)$, $A=1$, $y'(0)=A+3B=1$에서 $B=0$. $y(\pi/3)=e^{\pi/3}\cos\pi=-e^{\pi/3}$.` },
      { sec: '2.2', type: 'mc', lv: 2, q: R`$e^{-x}$, $e^{3x}$를 기저로 갖는 상수계수 방정식은?`,
        choices: [R`$y''-2y'-3y=0$`, R`$y''+2y'-3y=0$`, R`$y''-3y'-2y=0$`, R`$y''+2y'+3y=0$`], ans: 0,
        sol: R`특성근이 $-1,3$이므로 $(\lambda+1)(\lambda-3)=\lambda^2-2\lambda-3$.` },
      { sec: '2.3', type: 'num', lv: 1, q: R`$(D^2+3D+2)\,e^{2x}=k\,e^{2x}$일 때 $k$는? ($D=d/dx$)`, ans: '12', ansTex: R`12`,
        sol: R`$P(D)e^{\gamma x}=P(\gamma)e^{\gamma x}$이므로 $k=P(2)=4+6+2=12$.` },
      { sec: '2.4', type: 'num', lv: 1, q: R`질량 2 kg, 스프링 상수 50 N/m인 비감쇠 진동의 주기(초)는?`, ans: '2*pi/5', ansTex: R`\tfrac{2\pi}5\approx1.257`,
        sol: R`$\omega_0=\sqrt{k/m}=5$, 주기 $T=2\pi/\omega_0=2\pi/5$.` },
      { sec: '2.4', type: 'num', lv: 2, q: R`무게 9.8 N인 물체를 달면 0.1 m 늘어나는 스프링에 질량 2 kg을 매달았다. 고유각진동수 $\omega_0$ (rad/s)는?`, ans: '7', ansTex: R`7`,
        sol: R`훅의 법칙으로 $k=9.8/0.1=98$ N/m. $\omega_0=\sqrt{98/2}=7$.` },
      { sec: '2.4', type: 'mc', lv: 2, q: R`$y''+6y'+5y=0$이 나타내는 운동은?`,
        choices: [R`과감쇠`, R`임계감쇠`, R`부족감쇠`, R`비감쇠`], ans: 0,
        sol: R`$\lambda=-1,-5$ (서로 다른 음의 실근)이므로 진동 없이 감쇠하는 과감쇠입니다. ($c^2=36>4mk=20$)` },
      { sec: '2.4', type: 'num', lv: 2, q: R`$y''+2y'+26y=0$의 감쇠 진동의 각진동수 $\omega^*$는?`, ans: '5', ansTex: R`5`,
        sol: R`$\lambda=-1\pm5i$이므로 $y=e^{-t}(A\cos5t+B\sin5t)$, $\omega^*=5$.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`$x^2y''-2y=0,\ y(1)=3,\ y'(1)=0$일 때 $y(2)$는?`, ans: '5', ansTex: R`5`,
        sol: R`$m^2-m-2=0$에서 $m=2,-1$. $y=c_1x^2+c_2x^{-1}$, $c_1+c_2=3$, $2c_1-c_2=0$에서 $c_1=1$, $c_2=2$. $y(2)=4+1=5$.` },
      { sec: '2.5', type: 'mc', lv: 2, q: R`$x^2y''+5xy'+4y=0\ (x>0)$의 일반해는?`,
        choices: [R`$\dfrac{c_1+c_2\ln x}{x^2}$`, R`$c_1x^2+c_2x^{-2}$`, R`$c_1x^{-1}+c_2x^{-4}$`, R`$x^{-2}\big(c_1\cos(\ln x)+c_2\sin(\ln x)\big)$`], ans: 0,
        sol: R`$m^2+(5-1)m+4=(m+2)^2=0$, 중근 $m=-2$.` },
      { sec: '2.5', type: 'num', lv: 3, q: R`$x^2y''+xy'+9y=0,\ y(1)=0,\ y'(1)=3$일 때 $y(e^{\pi/6})$는?`, ans: '1', ansTex: R`1`,
        sol: R`$m^2+9=0$에서 $y=A\cos(3\ln x)+B\sin(3\ln x)$. $A=0$, $y'(1)=3B=3$에서 $B=1$. $y=\sin(3\ln x)$이고 $3\cdot\frac\pi6=\frac\pi2$이므로 1.` },
      { sec: '2.6', type: 'num', lv: 1, q: R`$W(e^{2x},\,xe^{2x})$의 $x=\ln2$에서의 값은?`, ans: '16', ansTex: R`16`,
        sol: R`$W=e^{2x}(e^{2x}+2xe^{2x})-xe^{2x}\cdot2e^{2x}=e^{4x}$. $e^{4\ln2}=16$.` },
      { sec: '2.6', type: 'num', lv: 2, q: R`$y''+\dfrac2xy'+q(x)y=0$의 두 해의 론스키안이 $W(1)=3$이면 $W(2)$는?`, ans: '3/4', ansTex: R`\tfrac34`,
        sol: R`아벨 공식 $W=ce^{-\int2/x\,dx}=\dfrac{c}{x^2}$. $c=3$이므로 $W(2)=\tfrac34$. $q$를 몰라도 됩니다.` },
      { sec: '2.7', type: 'num', lv: 2, q: R`$y''+y=2e^{x},\ y(0)=0,\ y'(0)=0$일 때 $y(\pi)$는?`, ans: '1+e^pi', ansTex: R`1+e^{\pi}`,
        sol: R`$y_p=e^x$. $y=A\cos x+B\sin x+e^x$, $A+1=0$, $B+1=0$. $y=-\cos x-\sin x+e^x$, $y(\pi)=1+e^\pi$.` },
      { sec: '2.7', type: 'mc', lv: 2, q: R`$y''+4y=3\sin2x$의 특수해로 가정할 꼴은?`,
        choices: [R`$K\cos2x+M\sin2x$`, R`$x(K\cos2x+M\sin2x)$`, R`$x^2(K\cos2x+M\sin2x)$`, R`$Ke^{2x}$`], ans: 1,
        sol: R`$\cos2x$, $\sin2x$가 동차해(특성근 $\pm2i$)이므로 수정 규칙으로 $x$를 곱합니다. 계산하면 $y_p=-\tfrac34x\cos2x$.` },
      { sec: '2.7', type: 'num', lv: 2, q: R`$y''-y'-2y=10\cos x$의 특수해 $y_p=K\cos x+M\sin x$에서 $y_p(0)$은?`, ans: '-3', ansTex: R`-3`,
        sol: R`대입하면 $\cos$: $-3K-M=10$, $\sin$: $K-3M=0$. $K=-3$, $M=-1$이므로 $y_p(0)=K=-3$.` },
      { sec: '2.7', type: 'open', lv: 2, q: R`$y''+2y'+y=e^{-x}$의 일반해를 구하세요.`,
        sol: R`
특성근은 $-1$ (중근)이므로 $e^{-x}$, $xe^{-x}$가 모두 동차해입니다. 수정 규칙으로 $y_p=Cx^2e^{-x}$.
$(D+1)^2(x^2e^{-x})=2e^{-x}$이므로 $C=\tfrac12$.
$$y=\Big(c_1+c_2x+\frac{x^2}2\Big)e^{-x}$$` },
      { sec: '2.8', type: 'num', lv: 2, q: R`$y''+9y=16\cos t,\ y(0)=0,\ y'(0)=0$일 때 $y(\pi/3)$은?`, ans: '3', ansTex: R`3`,
        sol: R`$y_p=\dfrac{16}{9-1}\cos t=2\cos t$. $y=A\cos3t+B\sin3t+2\cos t$에서 $A=-2$, $B=0$. $y=2\cos t-2\cos3t$, $y(\pi/3)=1+2=3$.` },
      { sec: '2.8', type: 'num', lv: 3, q: R`$y''+2y'+5y=10\cos t$의 정상상태 진폭은?`, ans: 'sqrt(5)', ansTex: R`\sqrt5\approx2.236`,
        sol: R`$C^*=\dfrac{F_0}{\sqrt{(\omega_0^2-\omega^2)^2+\omega^2c^2}}=\dfrac{10}{\sqrt{(5-1)^2+4}}=\dfrac{10}{\sqrt{20}}=\sqrt5$ ($m=1$).` },
      { sec: '2.8', type: 'num', lv: 3, q: R`$y''+2y'+5y=\cos\omega t$의 정상상태 진폭이 최대가 되는 $\omega$는?`, ans: 'sqrt(3)', ansTex: R`\sqrt3`,
        hint: R`진폭의 분모 $(\omega_0^2-\omega^2)^2+\omega^2c^2$을 최소로 만드세요.`,
        sol: R`$g(\omega^2)=(5-\omega^2)^2+4\omega^2$을 $\omega^2$으로 미분하면 $-2(5-\omega^2)+4=0$, $\omega^2=3$. 일반식 $\omega_{\max}^2=\omega_0^2-\dfrac{c^2}{2m^2}=5-2=3$과 같습니다.` },
      { sec: '2.9', type: 'mc', lv: 1, q: R`RLC 회로 $LI''+RI'+\dfrac1CI=E'(t)$와 질량-스프링계 $my''+cy'+ky=F$를 대응시킬 때 스프링 상수 $k$에 해당하는 것은?`,
        choices: [R`$L$`, R`$R$`, R`$\dfrac1C$`, R`$E$`], ans: 2,
        sol: R`$m\leftrightarrow L$, $c\leftrightarrow R$, $k\leftrightarrow1/C$, $F\leftrightarrow E'$.` },
      { sec: '2.9', type: 'num', lv: 2, q: R`$L=0.5$ H, $C=0.02$ F인 LC 회로의 고유각진동수 (rad/s)는?`, ans: '10', ansTex: R`10`,
        sol: R`$LI''+\frac1CI=0$에서 $\omega_0=\dfrac1{\sqrt{LC}}=\dfrac1{\sqrt{0.01}}=10$.` },
      { sec: '2.10', type: 'open', lv: 3, q: R`매개변수 변환법으로 $y''+y=\tan x$의 일반해를 구하세요.`,
        sol: R`
$y_1=\cos x$, $y_2=\sin x$, $W=1$.
$$\int\sin x\tan x\,dx=\int(\sec x-\cos x)\,dx=\ln|\sec x+\tan x|-\sin x,\qquad \int\cos x\tan x\,dx=-\cos x$$
$y_p=-\cos x\big(\ln|\sec x+\tan x|-\sin x\big)+\sin x(-\cos x)=-\cos x\ln|\sec x+\tan x|$.
$$y=c_1\cos x+c_2\sin x-\cos x\ln|\sec x+\tan x|$$` },
      { sec: '2.10', type: 'mc', lv: 3, q: R`$y''-4y'+4y=\dfrac{e^{2x}}{x^2}\ (x>0)$의 특수해는?`,
        choices: [R`$-e^{2x}\ln x$`, R`$e^{2x}\ln x$`, R`$-xe^{2x}\ln x$`, R`$\dfrac{e^{2x}}{x}$`], ans: 0,
        sol: R`
$y_1=e^{2x}$, $y_2=xe^{2x}$, $W=e^{4x}$. $y_p=-e^{2x}\int\frac{dx}{x}+xe^{2x}\int\frac{dx}{x^2}=-e^{2x}\ln x-e^{2x}$.
$-e^{2x}$는 동차해이므로 버리면 $y_p=-e^{2x}\ln x$.` },
      { sec: '3.2', type: 'num', lv: 2, q: R`$y'''-3y''+3y'-y=0,\ y(0)=1,\ y'(0)=2,\ y''(0)=3$일 때 $y(1)$은?`, ans: '2*e', ansTex: R`2e`,
        sol: R`$(\lambda-1)^3$이므로 $y=(c_1+c_2x+c_3x^2)e^x$. $c_1=1$, $c_1+c_2=2$, $c_1+2c_2+2c_3=3$에서 $c_2=1$, $c_3=0$. $y=(1+x)e^x$, $y(1)=2e$.` },
      { sec: '3.2', type: 'mc', lv: 2, q: R`$y''''-y=0$의 일반해는?`,
        choices: [R`$c_1e^x+c_2e^{-x}+c_3\cos x+c_4\sin x$`, R`$(c_1+c_2x+c_3x^2+c_4x^3)e^x$`, R`$c_1e^x+c_2e^{-x}+c_3xe^x+c_4xe^{-x}$`, R`$c_1\cos x+c_2\sin x+c_3x\cos x+c_4x\sin x$`], ans: 0,
        sol: R`$\lambda^4-1=(\lambda-1)(\lambda+1)(\lambda^2+1)$이므로 근은 $\pm1$, $\pm i$.` },
      { sec: '3.2', type: 'num', lv: 1, q: R`$W(1,\,x,\,x^2)$은?`, ans: '2', ansTex: R`2`,
        sol: R`$\det\begin{pmatrix}1&x&x^2\\0&1&2x\\0&0&2\end{pmatrix}=2$ (삼각행렬).` },
      { sec: '3.3', type: 'num', lv: 3, q: R`$y'''+y'=2,\ y(0)=y'(0)=y''(0)=0$일 때 $y(\pi/2)$는?`, ans: 'pi-2', ansTex: R`\pi-2\approx1.142`,
        sol: R`
$\lambda(\lambda^2+1)$이므로 상수가 동차해 → $y_p=Cx$, $C=2$. $y=c_1+c_2\cos x+c_3\sin x+2x$.
$c_1+c_2=0$, $c_3+2=0$, $-c_2=0$에서 $y=2x-2\sin x$. $y(\pi/2)=\pi-2$.` },
    ],
  });
})();
