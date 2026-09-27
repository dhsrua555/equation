/* 추가 연습문제 — 01 1계 ODE (Kreyszig 1.1–1.7). 교재 문제를 옮긴 것이 아니라 같은 유형으로 새로 만든 문제입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.more = EM.more || [];
(function () {
  const R = String.raw;
  EM.more.push({
    n: 1,
    secTitles: { '1.1': '기본 개념', '1.2': '방향장·오일러 방법', '1.3': '변수분리형', '1.4': '완전미분·적분인자', '1.5': '선형·베르누이', '1.6': '직교 궤적', '1.7': '존재·유일성' },
    secs: ['1.4', '1.3', '1.5', '1.4', '1.5', '1.3', '1.3', '1.7', '1.4', '1.3'],
    problems: [
      { sec: '1.1', type: 'mc', lv: 1, q: R`$y'''+(y')^2=\sin x$의 계와 선형 여부는?`,
        choices: [R`3계 선형`, R`3계 비선형`, R`2계 비선형`, R`1계 선형`], ans: 1,
        sol: R`가장 높은 도함수가 $y'''$이므로 3계이고, $(y')^2$ 항 때문에 비선형입니다.` },
      { sec: '1.1', type: 'num', lv: 1, q: R`$y=ce^{-3x}$는 $y'+3y=0$의 일반해이다. $y(0)=5$일 때 $y(\ln2)$는?`, ans: '5/8', ansTex: R`\tfrac58`,
        sol: R`$c=5$이므로 $y(\ln2)=5e^{-3\ln2}=5\cdot2^{-3}=\tfrac58$.` },
      { sec: '1.1', type: 'num', lv: 1, q: R`$y'=\cos\pi x,\ y(0)=1$일 때 $y(\tfrac12)$는?`, ans: '1+1/pi', ansTex: R`1+\tfrac1\pi\approx1.318`,
        sol: R`적분하면 $y=\dfrac{\sin\pi x}{\pi}+1$. $y(\tfrac12)=1+\dfrac1\pi$.` },
      { sec: '1.1', type: 'num', lv: 2, q: R`반감기가 1600년인 방사성 물질이 800년 뒤에 처음 양의 몇 배가 남는가?`, ans: '1/sqrt(2)', ansTex: R`\tfrac{1}{\sqrt2}\approx0.707`,
        sol: R`$y=y_0(\tfrac12)^{t/1600}$이므로 $t=800$에서 $(\tfrac12)^{1/2}=\tfrac1{\sqrt2}$.` },
      { sec: '1.2', type: 'num', lv: 2, q: R`오일러 방법($h=0.1$)으로 $y'=y,\ y(0)=1$을 두 단계 계산한 $y_2$는?`, ans: '1.21', ansTex: R`1.21`,
        sol: R`$y_{n+1}=y_n+hy_n=1.1y_n$이므로 $y_1=1.1$, $y_2=1.21$. 참값 $e^{0.2}\approx1.2214$보다 조금 작습니다.` },
      { sec: '1.2', type: 'num', lv: 2, q: R`오일러 방법($h=0.5$)으로 $y'=x+y,\ y(0)=0$의 $y(1)$ 근삿값을 구하세요.`, ans: '0.25', ansTex: R`0.25`,
        sol: R`$y_1=0+0.5(0+0)=0$, $y_2=0+0.5(0.5+0)=0.25$. 참값은 $e-2\approx0.718$이라 큰 간격에서는 오차가 큽니다.` },
      { sec: '1.2', type: 'mc', lv: 1, q: R`$y'=x^2+y^2$의 방향장에서 기울기가 1인 점들이 이루는 곡선(등경사선)은?`,
        choices: [R`직선 $y=x$`, R`원 $x^2+y^2=1$`, R`포물선 $y=x^2$`, R`쌍곡선 $xy=1$`], ans: 1,
        sol: R`기울기 $f(x,y)=1$인 곳은 $x^2+y^2=1$, 단위원입니다.` },
      { sec: '1.3', type: 'num', lv: 1, q: R`$y'=y^2,\ y(0)=1$일 때 $y(\tfrac12)$는?`, ans: '2', ansTex: R`2`,
        sol: R`$-\dfrac1y=x+c$, $c=-1$이므로 $y=\dfrac1{1-x}$. $y(\tfrac12)=2$. 해는 $x=1$에서 발산합니다.` },
      { sec: '1.3', type: 'num', lv: 1, q: R`$y'=1+y^2,\ y(0)=0$일 때 $y(\pi/4)$는?`, ans: '1', ansTex: R`1`,
        sol: R`$\arctan y=x+c$, $c=0$이므로 $y=\tan x$. $y(\pi/4)=1$.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`$y'=\dfrac{x}{y},\ y(0)=2\ (y>0)$일 때 $y(\sqrt5)$는?`, ans: '3', ansTex: R`3`,
        sol: R`$y\,dy=x\,dx$에서 $y^2-x^2=c=4$. $y=\sqrt{x^2+4}$이므로 $y(\sqrt5)=3$.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`$y'=-2xy^2,\ y(0)=1$일 때 $y(2)$는?`, ans: '1/5', ansTex: R`\tfrac15`,
        sol: R`$\dfrac{dy}{y^2}=-2x\,dx$에서 $\dfrac1y=x^2+c$, $c=1$. $y=\dfrac1{x^2+1}$, $y(2)=\tfrac15$.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`$xy'=x+2y\ (x>0),\ y(1)=1$일 때 $y(2)$는?`, ans: '6', ansTex: R`6`,
        hint: R`$u=y/x$로 치환하면 $xu'=1+u$입니다.`,
        sol: R`
$y'=1+2\frac yx$. $u=y/x$면 $u+xu'=1+2u$, $\dfrac{du}{1+u}=\dfrac{dx}x$, $1+u=Cx$. 따라서 $y=Cx^2-x$이고 $y(1)=C-1=1$에서 $C=2$.
$y(2)=8-2=6$.` },
      { sec: '1.3', type: 'num', lv: 3, q: R`토리첼리 법칙 $h'=-k\sqrt h$를 따르는 물탱크의 수위가 4 m에서 1 m가 되는 데 5분 걸렸다. 처음부터 탱크가 완전히 비는 시각(분)은?`, ans: '10', ansTex: R`10`,
        sol: R`$\dfrac{dh}{\sqrt h}=-k\,dt$에서 $2\sqrt h=2\sqrt{h_0}-kt$, 즉 $\sqrt h$가 시간에 대해 일차로 줄어듭니다. $\sqrt h$가 2에서 1로 5분 걸렸으므로 0이 되는 것은 10분입니다.` },
      { sec: '1.3', type: 'num', lv: 2, q: R`세균 수가 $y'=ky$를 따르고 3시간마다 2배가 된다. 3배가 되는 데 걸리는 시간(시간)은?`, ans: '3*ln(3)/ln(2)', ansTex: R`\tfrac{3\ln3}{\ln2}\approx4.755`,
        sol: R`$k=\dfrac{\ln2}{3}$. $e^{kt}=3$에서 $t=\dfrac{\ln3}{k}=\dfrac{3\ln3}{\ln2}\approx4.755$.` },
      { sec: '1.4', type: 'mc', lv: 1, q: R`$(3x^2y+2)\,dx+(x^3+y)\,dy=0$의 일반해는?`,
        choices: [R`$x^3y+2x+\tfrac{y^2}2=c$`, R`$x^3y+2x+y^2=c$`, R`$3x^2y+2x+\tfrac{y^2}2=c$`, R`$x^3y+\tfrac{y^2}{2}=c$`], ans: 0,
        sol: R`$M_y=3x^2=N_x$로 완전. $u=\int(3x^2y+2)dx=x^3y+2x+k(y)$, $u_y=x^3+k'=x^3+y$에서 $k=\tfrac{y^2}2$.` },
      { sec: '1.4', type: 'num', lv: 2, q: R`$(y\cos x+2xe^{y})\,dx+(\sin x+x^2e^{y}-1)\,dy=0$의 해를 $u(x,y)=c$로 쓸 때 ($u$에 상수항 없음), $y(1)=0$을 만족하는 $c$는?`, ans: '1', ansTex: R`1`,
        sol: R`
$M_y=\cos x+2xe^y=N_x$로 완전. $u=\int M\,dx=y\sin x+x^2e^y+k(y)$, $u_y=\sin x+x^2e^y+k'=N$에서 $k=-y$.
$u=y\sin x+x^2e^y-y$이고 $u(1,0)=1$이므로 $c=1$.` },
      { sec: '1.4', type: 'mc', lv: 3, q: R`$y\,dx-x\,dy=0$의 적분인자가 **아닌** 것은?`,
        choices: [R`$\dfrac1{x^2}$`, R`$\dfrac1{y^2}$`, R`$\dfrac1{xy}$`, R`$\dfrac1{x+y}$`], ans: 3,
        sol: R`
$\frac1{x^2}$: $\frac{y}{x^2}dx-\frac1xdy=-d(y/x)$. $\frac1{y^2}$: $d(x/y)$. $\frac1{xy}$: $\frac{dx}x-\frac{dy}y=d\ln|x/y|$.
$\frac1{x+y}$을 곱하면 $M_y=\frac{x}{(x+y)^2}$, $N_x=\frac{-y}{(x+y)^2}$로 같지 않습니다.` },
      { sec: '1.4', type: 'open', lv: 2, q: R`적분인자를 구해 $(x^2+y^2+x)\,dx+xy\,dy=0$을 푸세요.`,
        sol: R`
$M_y=2y$, $N_x=y$. $R=\dfrac{M_y-N_x}{N}=\dfrac{y}{xy}=\dfrac1x$이므로 $F=x$.
$(x^3+xy^2+x^2)\,dx+x^2y\,dy=0$은 완전하고 ($2xy=2xy$)
$$u=\frac{x^4}4+\frac{x^2y^2}2+\frac{x^3}3=c$$` },
      { sec: '1.5', type: 'num', lv: 1, q: R`$y'+\dfrac yx=2\ (x>0),\ y(1)=0$일 때 $y(2)$는?`, ans: '3/2', ansTex: R`\tfrac32`,
        sol: R`$e^{h}=x$이므로 $(xy)'=2x$, $xy=x^2+c$, $c=-1$. $y=x-\dfrac1x$, $y(2)=\tfrac32$.` },
      { sec: '1.5', type: 'num', lv: 2, q: R`$y'+y\tan x=\sin2x,\ y(0)=1$일 때 $y(\pi/3)$는?`, ans: '1', ansTex: R`1`,
        sol: R`
$h=\int\tan x\,dx=-\ln\cos x$, $e^{h}=\dfrac1{\cos x}$. $y=\cos x\Big(\int\dfrac{2\sin x\cos x}{\cos x}dx+c\Big)=\cos x(c-2\cos x)$.
$y(0)=c-2=1$에서 $c=3$. $y=3\cos x-2\cos^2x$, $y(\pi/3)=\tfrac32-\tfrac12=1$.` },
      { sec: '1.5', type: 'num', lv: 2, q: R`로지스틱 방정식 $y'=y(1-y),\ y(0)=\tfrac12$일 때 $y(\ln3)$은?`, ans: '3/4', ansTex: R`\tfrac34`,
        sol: R`베르누이 치환 $u=1/y$로 $u'+u=1$, $u=1+ce^{-t}$, $c=1$. $y=\dfrac1{1+e^{-t}}$, $y(\ln3)=\dfrac1{1+1/3}=\tfrac34$.` },
      { sec: '1.5', type: 'num', lv: 2, q: R`RL 회로에서 $L=0.1$ H, $R=5\ \Omega$, $E=12$ V, $I(0)=0$이다. $t=\dfrac{\ln2}{50}$ 초에서의 전류(A)는?`, ans: '1.2', ansTex: R`1.2`,
        sol: R`$0.1I'+5I=12$, 즉 $I'+50I=120$. $I=2.4\big(1-e^{-50t}\big)$. $t=\frac{\ln2}{50}$이면 $e^{-50t}=\tfrac12$이므로 $I=1.2$.` },
      { sec: '1.5', type: 'open', lv: 3, q: R`베르누이 방정식 $y'+\dfrac yx=xy^2$의 일반해를 구하세요.`,
        sol: R`
$a=2$, $u=y^{-1}$: $u'-\dfrac ux=-x$. 적분인자 $\dfrac1x$로 $\Big(\dfrac ux\Big)'=-1$, $u=x(c-x)$.
$$y=\frac{1}{cx-x^2}$$
검산: $D=cx-x^2$이면 $y'+\frac yx=\dfrac{-(c-2x)+(c-x)}{D^2}=\dfrac{x}{D^2}=xy^2$ ✓` },
      { sec: '1.5', type: 'num', lv: 3, q: R`100 L 탱크에 소금 10 kg이 녹아 있다. 농도 0.2 kg/L 소금물이 5 L/min로 들어오고 같은 속도로 나간다. 소금이 15 kg이 되는 시각(분)은?`, ans: '20*ln(2)', ansTex: R`20\ln2\approx13.86`,
        sol: R`$y'=5(0.2)-5\dfrac{y}{100}=1-\dfrac y{20}$, $y(0)=10$. $y=20-10e^{-t/20}$. $y=15$이면 $e^{-t/20}=\tfrac12$, $t=20\ln2$.` },
      { sec: '1.6', type: 'mc', lv: 2, q: R`포물선족 $y=cx^2$의 직교 궤적은?`,
        choices: [R`타원족 $x^2+2y^2=C$`, R`쌍곡선족 $x^2-2y^2=C$`, R`원족 $x^2+y^2=C$`, R`직선족 $y=Cx$`], ans: 0,
        sol: R`$c=y/x^2$를 소거하면 $y'=\dfrac{2y}{x}$. 직교 궤적은 $y'=-\dfrac{x}{2y}$이므로 $2y\,dy=-x\,dx$, $x^2+2y^2=C$.` },
      { sec: '1.6', type: 'mc', lv: 1, q: R`원점 중심 원족 $x^2+y^2=c$의 직교 궤적은?`,
        choices: [R`원점을 지나는 직선들`, R`$x$축에 평행한 직선들`, R`쌍곡선족 $xy=C$`, R`포물선족 $y=Cx^2$`], ans: 0,
        sol: R`$y'=-\dfrac xy$이므로 직교 궤적은 $y'=\dfrac yx$, 즉 $y=Cx$ (원점을 지나는 직선).` },
      { sec: '1.7', type: 'num', lv: 2, q: R`$y'=1+y^2,\ y(0)=0$에 대해 직사각형 $|x|<5,\ |y|<3$에서 존재 정리가 보장하는 구간 $|x|<\alpha$의 $\alpha$는?`, ans: '0.3', ansTex: R`0.3`,
        sol: R`$K=\max|1+y^2|=10$, $\alpha=\min(a,\,b/K)=\min(5,\,0.3)=0.3$. 실제 해 $\tan x$는 $|x|<\pi/2$에서 존재하므로 정리의 구간은 보수적입니다.` },
      { sec: '1.7', type: 'mc', lv: 2, q: R`존재·유일성 정리로 유일한 해가 보장되는 초기값 문제는?`,
        choices: [R`$y'=\sqrt y,\ y(0)=0$`, R`$y'=y^{1/3},\ y(0)=0$`, R`$y'=xy^2,\ y(1)=2$`, R`$y'=\dfrac1x,\ y(0)=1$`], ans: 2,
        sol: R`③은 $f=xy^2$와 $f_y=2xy$가 모든 곳에서 연속입니다. ①②는 $y=0$에서 $f_y$가 발산하고, ④는 $x=0$에서 $f$가 정의되지 않습니다.` },
    ],
  });
})();
