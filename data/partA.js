/* Part A — 상미분방정식 (Kreyszig Ch.1–6) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push(
  // ───────────────────────── 01
  {
    n: 1, part: 'A', title: '1계 상미분방정식', en: 'First-Order ODEs', ref: 'Kreyszig Ch.1', plot: 'slope',
    fig: R`$y'=x-y$의 방향장과 해곡선`,
    tagline: R`변수분리, 완전미분, 선형, 베르누이. 네 가지 꼴을 알아보는 눈이 풀이의 절반입니다.`,
    summary: R`1계 ODE $y'=f(x,y)$를 푸는 표준 기법과 모델링, 그리고 해의 존재·유일성을 다룹니다. 문제를 보자마자 어떤 꼴인지 판별하는 것이 핵심입니다.`,
    goals: [
      R`변수분리형·완전형·선형·베르누이형을 판별하고 풀 수 있다`,
      R`적분인자 $F(x)$, $F^*(y)$를 구해 완전형으로 바꿀 수 있다`,
      R`냉각·혼합·성장 문제를 ODE로 세울 수 있다`,
      R`존재·유일성 정리의 조건을 확인할 수 있다`,
    ],
    sections: [
      { title: '기본 개념과 방향장', body: R`
상미분방정식(ODE)은 미지함수 $y(x)$와 그 도함수 사이의 관계식입니다. 가장 높은 도함수의 차수가 방정식의 **계(order)**이며, 1계 ODE는 보통 $F(x,y,y')=0$ 또는 양함수 꼴 $y'=f(x,y)$로 씁니다.

- **일반해**: 임의상수 $c$를 포함한 해, 즉 해곡선의 족
- **특수해**: $c$에 구체적인 값을 넣은 해
- **초기값 문제(IVP)**: $y'=f(x,y),\ y(x_0)=y_0$. 초기조건이 $c$를 정합니다.

방향장(direction field)은 평면의 각 점에 기울기 $f(x,y)$인 짧은 선분을 그린 그림이고, 해곡선은 이 선분들에 접하며 지나갑니다. 단원 표지 그림은 $y'=x-y$의 방향장과 해곡선 $y=x-1+ce^{-x}$입니다.

:::tip 해 검산하기
구한 해를 원래 방정식에 대입해 보는 것이 시험에서 가장 확실한 검산입니다. 초기조건도 함께 확인하세요.
:::
` },
      { title: '변수분리형과 동차형 치환', body: R`
$y'=f(x)g(y)$처럼 $x$의 함수와 $y$의 함수의 곱으로 쓰이면 양변을 분리해 적분합니다.

:::key 변수분리와 동차형 치환
$$\frac{dy}{dx}=f(x)g(y)\;\Rightarrow\;\int\frac{dy}{g(y)}=\int f(x)\,dx+c$$
$$y'=f\!\left(\tfrac{y}{x}\right),\quad u=\tfrac{y}{x}\;\Rightarrow\;y'=u+xu',\quad \frac{du}{f(u)-u}=\frac{dx}{x}$$
:::

두 번째 줄은 **동차형**입니다. 우변이 $y/x$만의 함수이면 $u=y/x$로 치환해 변수분리형으로 바꿉니다.

:::ex 예제 1
$y'=-2xy,\ y(0)=1$을 푸세요.
---
$\dfrac{dy}{y}=-2x\,dx$ 이므로 $\ln|y|=-x^2+c^*$, 즉 $y=ce^{-x^2}$. $y(0)=1$에서 $c=1$.
$$y=e^{-x^2}$$
:::

:::warn 나눗셈으로 잃는 해
$g(y)$로 나누기 전에 $g(y)=0$을 만족하는 상수해를 따로 적어 두세요. 예를 들어 $y'=y^2$에서는 $y\equiv0$도 해입니다.
:::
` },
      { title: '완전미분방정식과 적분인자', body: R`
$M(x,y)\,dx+N(x,y)\,dy=0$의 좌변이 어떤 함수 $u(x,y)$의 전미분 $du=u_x\,dx+u_y\,dy$와 같으면 **완전(exact)**하다고 하고, 해는 $u(x,y)=c$입니다.

:::key 완전성 조건과 적분인자
$$M\,dx+N\,dy=0\text{이 완전}\;\iff\;\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}$$
$$F(x)=\exp\!\int R\,dx,\qquad R=\frac{1}{N}\Big(\frac{\partial M}{\partial y}-\frac{\partial N}{\partial x}\Big)$$
$$F^*(y)=\exp\!\int R^*\,dy,\qquad R^*=\frac{1}{M}\Big(\frac{\partial N}{\partial x}-\frac{\partial M}{\partial y}\Big)$$
:::

풀이 순서는 다음과 같습니다.

1. $M_y=N_x$인지 확인한다.
2. $u=\int M\,dx+k(y)$로 놓는다.
3. $u_y=N$에서 $k'(y)$를 구하고 적분한다.
4. 해는 $u(x,y)=c$이다.

완전하지 않으면 적분인자 $F$를 곱합니다. $R$이 $x$만의 함수이면 $F(x)$, $R^*$가 $y$만의 함수이면 $F^*(y)$를 씁니다.

:::ex 예제 2
$(2xy+3)\,dx+(x^2-1)\,dy=0$을 푸세요.
---
$M_y=2x=N_x$이므로 완전합니다. $u=\int(2xy+3)\,dx=x^2y+3x+k(y)$. $u_y=x^2+k'=x^2-1$에서 $k=-y$.
$$x^2y+3x-y=c$$
:::
` },
      { title: '선형 ODE와 베르누이 방정식', body: R`
$y'+p(x)y=r(x)$ 꼴을 **선형** 1계 ODE라고 합니다. 양변에 $e^{h}$ ($h=\int p\,dx$)를 곱하면 좌변이 $(e^{h}y)'$이 되어 바로 적분됩니다.

:::key 선형 ODE의 해 공식
$$y'+p(x)y=r(x)\;\Rightarrow\;y=e^{-h}\Big(\int e^{h}r\,dx+c\Big),\qquad h=\int p\,dx$$
$$\text{베르누이 } y'+py=gy^{a}\ (a\ne0,1):\quad u=y^{1-a},\qquad u'+(1-a)pu=(1-a)g$$
:::

:::ex 예제 3
$y'-y=e^{2x}$의 일반해를 구하세요.
---
$p=-1$이므로 $h=-x$. $y=e^{x}\Big(\int e^{-x}e^{2x}\,dx+c\Big)=e^{x}(e^{x}+c)$.
$$y=e^{2x}+ce^{x}$$
:::

로지스틱 방정식 $y'=Ay-By^2$는 $a=2$인 베르누이 방정식입니다. $u=1/y$로 두면 $u'+Au=B$가 되어 $y=\dfrac{1}{B/A+ce^{-At}}$를 얻고, $t\to\infty$일 때 $y\to A/B$로 수렴합니다.

:::warn 표준형부터
해 공식은 $y'$의 계수가 1일 때만 성립합니다. $xy'+2y=x^3$이라면 먼저 $x$로 나눠 $p=2/x$, $r=x^2$으로 만드세요.
:::
` },
      { title: '모델링: 성장, 냉각, 혼합', body: R`
공학 문제는 대부분 “변화율 = 들어오는 양 − 나가는 양” 한 줄에서 시작합니다.

:::key 대표 모델
$$y'=ky\;\Rightarrow\;y=y_0e^{kt},\qquad t_{1/2}=\frac{\ln2}{|k|}$$
$$T'=-k(T-T_A)\;\Rightarrow\;T=T_A+(T_0-T_A)e^{-kt}$$
$$\text{혼합: } y'=(\text{유입률})(\text{유입 농도})-(\text{유출률})\frac{y}{V}$$
:::

- 뉴턴의 냉각 법칙에서 $T_A$는 주변 온도입니다. 두 시점의 온도가 주어지면 $e^{-k\Delta t}$를 먼저 구하면 계산이 짧아집니다.
- RL 회로 $LI'+RI=E(t)$도 선형 1계 ODE입니다. 직류 전원이면 $I\to E/R$로 수렴합니다.

:::ex 예제 4 (혼합)
1000 L 탱크에 처음에는 순수한 물이 있다. 농도 0.05 kg/L인 소금물이 10 L/min로 들어오고, 잘 섞인 물이 같은 속도로 나간다. 소금의 양 $y(t)$는?
---
$y'=10(0.05)-10\cdot\dfrac{y}{1000}=0.5-0.01y$, $y(0)=0$. 선형(또는 변수분리)으로 풀면
$$y=50\big(1-e^{-0.01t}\big)$$
충분히 시간이 지나면 탱크 농도가 유입 농도와 같아져 50 kg에 수렴합니다.
:::
` },
      { title: '해의 존재와 유일성', body: R`
모든 IVP가 해를 가지거나, 해가 하나뿐인 것은 아닙니다.

:::thm 존재·유일성 정리
$f(x,y)$가 초기점 $(x_0,y_0)$을 포함하는 직사각형 $R$에서 연속이고 $|f|\le K$이면, IVP $y'=f(x,y),\ y(x_0)=y_0$는 $|x-x_0|<\alpha$에서 해를 가집니다($\alpha=\min(a,\,b/K)$). 여기에 $\partial f/\partial y$도 $R$에서 연속이면 그 해는 유일합니다.
:::

예를 들어 $y'=\sqrt{|y|},\ y(0)=0$은 $y\equiv0$과 $y=x^2/4\ (x\ge0)$을 모두 해로 가집니다. $\partial f/\partial y$가 $y=0$에서 발산하기 때문입니다.

:::tip 시험 포인트
“해가 유일한가?”를 물으면 초기점 근처에서 $f$와 $\partial f/\partial y$의 연속성을 확인합니다. 정리의 조건은 충분조건이므로, 조건이 깨졌다고 해서 해가 반드시 여러 개인 것은 아닙니다.
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`다음 중 완전미분방정식은?`,
        choices: [R`$y\,dx-x\,dy=0$`, R`$(x^2+y)\,dx+(y^2-2x)\,dy=0$`, R`$(2x+y)\,dx+(x+2y)\,dy=0$`, R`$2y\,dx+x\,dy=0$`], ans: 2,
        hint: R`각 보기에서 $\partial M/\partial y$와 $\partial N/\partial x$를 비교하세요.`,
        sol: R`
각 보기의 $(M_y,\,N_x)$는 $(1,-1)$, $(1,-2)$, $(1,1)$, $(2,1)$입니다. 같은 것은 ③뿐이며, 이때 $u=x^2+xy+y^2$이므로 해는 $x^2+xy+y^2=c$입니다.` },
      { type: 'num', lv: 1, q: R`$y'=2xy,\ y(0)=3$일 때 $y(1)$의 값은?`, ans: '3*e', ansTex: R`3e\approx 8.155`,
        hint: R`$\dfrac{dy}{y}=2x\,dx$로 변수분리합니다.`,
        sol: R`
$\ln|y|=x^2+c^*$에서 $y=Ce^{x^2}$. $y(0)=C=3$이므로 $y=3e^{x^2}$, $y(1)=3e\approx8.155$.` },
      { type: 'num', lv: 1, q: R`$y'+2y=4,\ y(0)=0$일 때 $y(\ln 2)$의 값은?`, ans: '3/2', ansTex: R`\tfrac32`,
        sol: R`
$h=2x$, $y=e^{-2x}\big(\int4e^{2x}dx+c\big)=2+ce^{-2x}$. $y(0)=0$에서 $c=-2$이므로 $y=2-2e^{-2x}$.
$$y(\ln2)=2-2\cdot\tfrac14=\tfrac32$$` },
      { type: 'mc', lv: 2, q: R`$(e^{x+y}+ye^{y})\,dx+(xe^{y}-1)\,dy=0$을 완전형으로 만드는 적분인자는?`,
        choices: [R`$e^{-y}$`, R`$e^{y}$`, R`$e^{-x}$`, R`$1/x$`], ans: 0,
        hint: R`$R^*=\frac{1}{M}(N_x-M_y)$가 $y$만의 함수인지 보세요.`,
        sol: R`
$M_y=e^{x+y}+e^{y}+ye^{y}$, $N_x=e^{y}$.
$$R^*=\frac{N_x-M_y}{M}=\frac{-(e^{x+y}+ye^{y})}{e^{x+y}+ye^{y}}=-1\;\Rightarrow\;F^*=e^{-y}$$
곱하면 $(e^{x}+y)\,dx+(x-e^{-y})\,dy=0$이 완전해지고, 해는 $e^{x}+xy+e^{-y}=c$입니다.` },
      { type: 'open', lv: 2, q: R`베르누이 방정식 $y'+y=y^2,\ y(0)=\tfrac12$을 푸세요.`,
        hint: R`$a=2$이므로 $u=y^{-1}$로 치환합니다.`,
        sol: R`
$u=y^{-1}$이면 $u'=-y^{-2}y'$. 방정식을 $y^2$으로 나누면 $y^{-2}y'+y^{-1}=1$, 즉 $-u'+u=1$.
$$u'-u=-1\;\Rightarrow\;u=1+ce^{x}$$
$y=\dfrac{1}{1+ce^{x}}$이고 $y(0)=\tfrac12$에서 $c=1$.
$$y=\frac{1}{1+e^{x}}$$
검산: $y'=-\dfrac{e^{x}}{(1+e^{x})^2}$, $y^2-y=\dfrac{1-(1+e^{x})}{(1+e^{x})^2}=-\dfrac{e^{x}}{(1+e^{x})^2}$ ✓` },
      { type: 'num', lv: 2, q: R`실내 온도 20°C인 방에 90°C 커피를 두었더니 10분 뒤 60°C가 되었다. 뉴턴의 냉각 법칙을 따를 때 20분 뒤의 온도(°C)는?`, ans: '300/7', ansTex: R`\tfrac{300}{7}\approx42.86`,
        hint: R`$T-20=70e^{-kt}$에서 $e^{-10k}$을 먼저 구하세요.`,
        sol: R`
$T=20+70e^{-kt}$. $t=10$에서 $40=70e^{-10k}$이므로 $e^{-10k}=\tfrac47$.
$$T(20)=20+70\Big(\tfrac47\Big)^2=20+\tfrac{160}{7}=\tfrac{300}{7}\approx42.86$$` },
      { type: 'num', lv: 2, q: R`소금 100 kg이 녹아 있는 1000 L 탱크에 순수한 물이 10 L/min로 들어가고, 섞인 물이 같은 속도로 나간다. 소금이 50 kg이 되는 시각(분)은?`, ans: '100*ln(2)', ansTex: R`100\ln2\approx69.3`,
        sol: R`
$y'=-10\cdot\dfrac{y}{1000}=-0.01y$, $y(0)=100$이므로 $y=100e^{-0.01t}$. $100e^{-0.01t}=50$에서 $t=100\ln2\approx69.3$분.` },
      { type: 'mc', lv: 3, q: R`초기값 문제 $y'=3y^{2/3},\ y(0)=0$에 대한 설명으로 옳은 것은?`,
        choices: [R`해가 없다`, R`해는 $y\equiv0$ 하나뿐이다`, R`해가 정확히 두 개이다`, R`해가 무수히 많다`], ans: 3,
        hint: R`$y=x^3$을 대입해 보고, $\partial f/\partial y$가 $y=0$에서 어떤지 보세요.`,
        sol: R`
$y\equiv0$과 $y=x^3$ 모두 해입니다($y'=3x^2=3(x^3)^{2/3}$). 더 나아가 임의의 $a\ge0$에 대해
$$y=\begin{cases}0,&x\le a\\(x-a)^3,&x>a\end{cases}$$
도 해이므로 해는 무수히 많습니다. $f_y=2y^{-1/3}$이 $y=0$에서 연속이 아니어서 유일성 정리를 적용할 수 없는 경우입니다.` },
      { type: 'open', lv: 3, q: R`$2\sin(y^2)\,dx+xy\cos(y^2)\,dy=0,\ y(2)=\sqrt{\pi/2}$를 푸세요.`,
        hint: R`$R=\frac1N(M_y-N_x)$를 계산해 보세요.`,
        sol: R`
$M_y=4y\cos(y^2)$, $N_x=y\cos(y^2)$이므로 완전하지 않습니다.
$$R=\frac{M_y-N_x}{N}=\frac{3y\cos(y^2)}{xy\cos(y^2)}=\frac3x\;\Rightarrow\;F(x)=x^3$$
곱하면 $2x^3\sin(y^2)\,dx+x^4y\cos(y^2)\,dy=0$이고 $u=\tfrac12x^4\sin(y^2)$입니다. 따라서 $x^4\sin(y^2)=c$. 초기조건에서 $c=16\sin(\pi/2)=16$.
$$x^4\sin(y^2)=16$$` },
      { type: 'num', lv: 2, q: R`$y'=\dfrac{y}{x}+1\ (x>0),\ y(1)=1$일 때 $y(e)$의 값은?`, ans: '2*e', ansTex: R`2e\approx5.437`,
        hint: R`$u=y/x$로 치환하거나, 선형 ODE $y'-y/x=1$로 보세요.`,
        sol: R`
$u=y/x$이면 $u+xu'=u+1$, $u'=1/x$, $u=\ln x+c$. 따라서 $y=x\ln x+cx$이고 $y(1)=c=1$.
$$y(e)=e\cdot1+e=2e$$` },
    ],
  },
  // ───────────────────────── 02
  {
    n: 2, part: 'A', title: '2계·고계 선형 ODE', en: 'Second- and Higher-Order Linear ODEs', ref: 'Kreyszig Ch.2–3', plot: 'damped',
    fig: R`감쇠비 $\zeta=0.04,\dots,0.39$의 자유 감쇠 진동`,
    tagline: R`특성방정식 하나로 동차해를, 미정계수법과 매개변수 변환법으로 특수해를 구합니다.`,
    summary: R`$y''+p y'+q y=r(x)$의 일반해는 동차해와 특수해의 합입니다. 상수계수·오일러-코시 방정식, 론스키안, 미정계수법, 매개변수 변환법, 진동 모델까지 공학수학 1의 가장 큰 단원입니다.`,
    goals: [
      R`특성방정식의 세 경우(실근·중근·복소근)로 동차해를 쓸 수 있다`,
      R`오일러-코시 방정식의 보조방정식을 세울 수 있다`,
      R`미정계수법의 수정 규칙과 매개변수 변환법 공식을 쓸 수 있다`,
      R`감쇠·공진을 판별하고 질량-스프링과 RLC 회로를 대응시킬 수 있다`,
    ],
    sections: [
      { title: '선형 방정식과 중첩 원리', body: R`
표준형은 $y''+p(x)y'+q(x)y=r(x)$이고, $r\equiv0$이면 동차입니다. 동차 선형 방정식의 두 해의 일차결합도 해라는 것이 **중첩 원리**입니다.

- 일차독립인 두 해 $y_1,y_2$를 **기저**라 하고, 일반해는 $y=c_1y_1+c_2y_2$입니다.
- 초기값 문제는 $y(x_0)=K_0,\ y'(x_0)=K_1$ 두 조건으로 $c_1,c_2$를 정합니다.

한 해 $y_1$을 알면 $y_2=uy_1$로 두어 나머지 해를 구할 수 있습니다.

:::key 계수 내림법
$$y_2=y_1\int U\,dx,\qquad U=\frac{1}{y_1^{2}}\,e^{-\int p\,dx}$$
:::

:::warn 비선형·비동차에는 중첩 불가
$y''+y'^2=0$ 같은 비선형 방정식이나 $r(x)\ne0$인 비동차 방정식에서는 해의 합이 해가 되지 않습니다.
:::
` },
      { title: '상수계수 동차 방정식', body: R`
$y''+ay'+by=0$에 $y=e^{\lambda x}$를 넣으면 **특성방정식** $\lambda^2+a\lambda+b=0$을 얻습니다. 판별식 $a^2-4b$의 부호에 따라 세 경우로 나뉩니다.

:::key 특성방정식의 세 경우
| 경우 | 근 | 일반해 |
|---|---|---|
| $a^2-4b>0$ | 서로 다른 실근 $\lambda_1,\lambda_2$ | $c_1e^{\lambda_1x}+c_2e^{\lambda_2x}$ |
| $a^2-4b=0$ | 중근 $\lambda=-a/2$ | $(c_1+c_2x)e^{-ax/2}$ |
| $a^2-4b<0$ | 복소근 $-\tfrac a2\pm i\omega$ | $e^{-ax/2}(A\cos\omega x+B\sin\omega x)$ |

여기서 $\omega=\sqrt{b-a^2/4}$.
:::

:::ex 예제 1
$y''+2y'+5y=0,\ y(0)=1,\ y'(0)=-1$을 푸세요.
---
$\lambda^2+2\lambda+5=0$에서 $\lambda=-1\pm2i$. $y=e^{-x}(A\cos2x+B\sin2x)$.
$y(0)=A=1$, $y'(0)=-A+2B=-1$에서 $B=0$.
$$y=e^{-x}\cos2x$$
:::
` },
      { title: '오일러-코시 방정식', body: R`
$x^2y''+axy'+by=0$은 $y=x^m$을 대입해 풉니다. $x^m$을 약분하면 **보조방정식**이 나옵니다.

:::key 오일러-코시 방정식
$$x^2y''+axy'+by=0,\qquad m^2+(a-1)m+b=0$$
| 경우 | 일반해 |
|---|---|
| 서로 다른 실근 $m_1,m_2$ | $c_1x^{m_1}+c_2x^{m_2}$ |
| 중근 $m=\tfrac{1-a}{2}$ | $(c_1+c_2\ln x)\,x^{m}$ |
| 복소근 $\mu\pm i\nu$ | $x^{\mu}\big[A\cos(\nu\ln x)+B\sin(\nu\ln x)\big]$ |
:::

:::ex 예제 2
$x^2y''-3xy'+13y=0$의 일반해를 구하세요.
---
$m^2+(-3-1)m+13=m^2-4m+13=0$에서 $m=2\pm3i$.
$$y=x^2\big[A\cos(3\ln x)+B\sin(3\ln x)\big]$$
:::

:::warn 보조방정식의 계수
$e^{\lambda x}$일 때와 달리 일차항 계수가 $a-1$입니다. 1을 빼는 것을 잊으면 전부 틀립니다.
:::
` },
      { title: '론스키안과 일차독립', body: R`
두 해가 일차독립인지는 론스키 행렬식으로 판정합니다.

:::key 론스키안
$$W(y_1,y_2)=\begin{vmatrix}y_1&y_2\\y_1'&y_2'\end{vmatrix}=y_1y_2'-y_2y_1',\qquad W(x)=c\,e^{-\int p\,dx}\ (\text{아벨 공식})$$
:::

$p,q$가 구간 $I$에서 연속일 때, 동차 방정식의 두 해 $y_1,y_2$가 일차종속일 필요충분조건은 $I$의 어떤 점에서 $W=0$인 것입니다. 아벨 공식에서 보듯 $W$는 항상 0이거나 한 번도 0이 되지 않습니다.

예를 들어 $W(e^{\lambda_1x},e^{\lambda_2x})=(\lambda_2-\lambda_1)e^{(\lambda_1+\lambda_2)x}$이므로 $\lambda_1\ne\lambda_2$이면 두 지수함수는 독립입니다.
` },
      { title: '비동차 방정식: 미정계수법', body: R`
비동차 방정식의 일반해는 $y=y_h+y_p$입니다. $r(x)$가 지수·다항식·삼각함수와 그 곱이면 $y_p$의 꼴을 추측해 계수를 정합니다.

:::key 미정계수법 표와 규칙
| $r(x)$의 항 | $y_p$의 꼴 |
|---|---|
| $ke^{\gamma x}$ | $Ce^{\gamma x}$ |
| $kx^n$ | $K_nx^n+\cdots+K_1x+K_0$ |
| $k\cos\omega x$ 또는 $k\sin\omega x$ | $K\cos\omega x+M\sin\omega x$ |
| $ke^{\alpha x}\cos\omega x$ 또는 $\sin$ | $e^{\alpha x}(K\cos\omega x+M\sin\omega x)$ |

- **수정 규칙**: 고른 꼴이 동차해이면 $x$를 곱한다 (특성방정식의 중근이면 $x^2$)
- **합 규칙**: $r$이 여러 항의 합이면 항마다 $y_p$를 구해 더한다
:::

:::ex 예제 3 (수정 규칙)
$y''+3y'+2.25y=-10e^{-1.5x}$의 일반해를 구하세요.
---
특성방정식 $(\lambda+1.5)^2=0$의 중근이 $-1.5$이므로 $e^{-1.5x}$와 $xe^{-1.5x}$가 모두 동차해입니다. 따라서 $y_p=Cx^2e^{-1.5x}$.
대입하면 $2Ce^{-1.5x}=-10e^{-1.5x}$, $C=-5$.
$$y=(c_1+c_2x-5x^2)e^{-1.5x}$$
:::
` },
      { title: '매개변수 변환법', body: R`
$r(x)$가 $\sec x$, $\ln x$, $e^{x}/x$처럼 미정계수법 표에 없으면 매개변수 변환법을 씁니다. 어떤 연속함수 $r$에도 적용됩니다.

:::key 매개변수 변환법
$$y_p=-y_1\int\frac{y_2\,r}{W}\,dx+y_2\int\frac{y_1\,r}{W}\,dx,\qquad W=y_1y_2'-y_2y_1'$$
:::

:::ex 예제 4
$y''+y=\sec x$의 특수해를 구하세요.
---
$y_1=\cos x$, $y_2=\sin x$, $W=1$.
$$y_p=-\cos x\int\sin x\sec x\,dx+\sin x\int\cos x\sec x\,dx=\cos x\ln|\cos x|+x\sin x$$
:::

:::warn 표준형 확인
$x^2y''+\cdots=r(x)$ 꼴이면 $x^2$으로 나눈 뒤의 우변 $r(x)/x^2$을 공식에 넣어야 합니다.
:::
` },
      { title: '진동과 전기회로', body: R`
질량-스프링-감쇠기는 $my''+cy'+ky=F(t)$로, RLC 직렬회로는 $LI''+RI'+\tfrac1CI=E'(t)$로 모델링됩니다. 두 식은 $m\leftrightarrow L$, $c\leftrightarrow R$, $k\leftrightarrow 1/C$로 정확히 대응합니다.

:::key 감쇠와 공진
$$\omega_0=\sqrt{k/m},\qquad c^2>4mk:\ \text{과감쇠},\quad c^2=4mk:\ \text{임계감쇠},\quad c^2<4mk:\ \text{부족감쇠}$$
$$\text{부족감쇠: } y=e^{-\alpha t}(A\cos\omega^*t+B\sin\omega^*t),\quad \alpha=\frac{c}{2m},\ \omega^*=\sqrt{\frac km-\frac{c^2}{4m^2}}$$
$$\text{공진 } (c=0,\ \omega=\omega_0):\quad my''+ky=F_0\cos\omega_0t\ \Rightarrow\ y_p=\frac{F_0}{2m\omega_0}\,t\sin\omega_0t$$
:::

감쇠가 없는데 입력 진동수가 고유진동수와 같으면 진폭이 $t$에 비례해 커집니다(공진). 두 진동수가 가까우면 **맥놀이(beat)**가 생깁니다. 감쇠가 있으면 정상상태 진폭은 유한하며
$$C^*(\omega)=\frac{F_0}{\sqrt{m^2(\omega_0^2-\omega^2)^2+\omega^2c^2}}$$
입니다.
` },
      { title: '고계 선형 ODE', body: R`
$n$계 상수계수 방정식도 같은 방법으로 풉니다. 특성다항식의 근마다 기저 함수를 하나씩 얻습니다.

- 단근 $\lambda$: $e^{\lambda x}$
- $m$중근 $\lambda$: $e^{\lambda x},\ xe^{\lambda x},\ \dots,\ x^{m-1}e^{\lambda x}$
- 복소근 쌍 $\alpha\pm i\beta$: $e^{\alpha x}\cos\beta x,\ e^{\alpha x}\sin\beta x$ (중복이면 $x^k$를 곱함)

:::ex 예제 5
$y'''-3y''+3y'-y=0$의 일반해는?
---
특성다항식 $\lambda^3-3\lambda^2+3\lambda-1=(\lambda-1)^3$이므로 $\lambda=1$이 삼중근입니다.
$$y=(c_1+c_2x+c_3x^2)e^{x}$$
:::

론스키안은 $n\times n$ 행렬식으로, 미정계수법과 매개변수 변환법도 같은 방식으로 확장됩니다.
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$y''-4y'+4y=0$의 일반해는?`,
        choices: [R`$c_1e^{2x}+c_2e^{-2x}$`, R`$(c_1+c_2x)e^{2x}$`, R`$e^{2x}(c_1\cos x+c_2\sin x)$`, R`$c_1e^{2x}+c_2e^{4x}$`], ans: 1,
        sol: R`$\lambda^2-4\lambda+4=(\lambda-2)^2=0$에서 중근 $\lambda=2$이므로 $y=(c_1+c_2x)e^{2x}$.` },
      { type: 'num', lv: 1, q: R`$y''+9y=0,\ y(0)=2,\ y'(0)=3$일 때 $y(\pi/6)$의 값은?`, ans: '1', ansTex: R`1`,
        sol: R`$y=A\cos3x+B\sin3x$. $A=2$, $3B=3$에서 $B=1$. $y(\pi/6)=2\cos\frac\pi2+\sin\frac\pi2=1$.` },
      { type: 'num', lv: 2, q: R`$y''-y'-2y=0,\ y(0)=3,\ y'(0)=0$일 때 $y(\ln2)$의 값은?`, ans: '5', ansTex: R`5`,
        sol: R`
$\lambda^2-\lambda-2=(\lambda-2)(\lambda+1)$이므로 $y=Ae^{2x}+Be^{-x}$. $A+B=3$, $2A-B=0$에서 $A=1$, $B=2$.
$$y(\ln2)=e^{2\ln2}+2e^{-\ln2}=4+1=5$$` },
      { type: 'mc', lv: 2, q: R`$x^2y''-3xy'+4y=0\ (x>0)$의 일반해는?`,
        choices: [R`$c_1x^2+c_2x^{-2}$`, R`$(c_1+c_2\ln x)\,x^2$`, R`$c_1x+c_2x^4$`, R`$x^2\big(c_1\cos(\ln x)+c_2\sin(\ln x)\big)$`], ans: 1,
        hint: R`보조방정식은 $m^2+(a-1)m+b=0$입니다.`,
        sol: R`$m^2+(-3-1)m+4=(m-2)^2=0$에서 중근 $m=2$. 따라서 $y=(c_1+c_2\ln x)x^2$.` },
      { type: 'mc', lv: 2, q: R`$y''-3y'+2y=4e^{x}$의 특수해 $y_p$로 가정해야 할 꼴은?`,
        choices: [R`$Ce^{x}$`, R`$Cxe^{x}$`, R`$Cx^2e^{x}$`, R`$Ce^{2x}$`], ans: 1,
        sol: R`
특성근은 $1,2$이므로 $e^{x}$가 동차해입니다(단근). 수정 규칙에 따라 $x$를 한 번 곱해 $y_p=Cxe^{x}$로 둡니다.
대입하면 $C\big[(2+x)-3(1+x)+2x\big]e^{x}=-Ce^{x}=4e^{x}$이므로 $C=-4$, $y_p=-4xe^{x}$.` },
      { type: 'num', lv: 2, q: R`$y''+4y=8x^2$의 다항식 특수해 $y_p$에 대해 $y_p(2)$의 값은?`, ans: '7', ansTex: R`7`,
        sol: R`
$y_p=Ax^2+Bx+C$를 대입: $2A+4(Ax^2+Bx+C)=8x^2$. $A=2$, $B=0$, $2A+4C=0$에서 $C=-1$.
$y_p=2x^2-1$이므로 $y_p(2)=7$.` },
      { type: 'open', lv: 3, q: R`매개변수 변환법으로 $y''-2y'+y=\dfrac{e^{x}}{x}\ (x>0)$의 일반해를 구하세요.`,
        hint: R`$y_1=e^{x}$, $y_2=xe^{x}$, $W=e^{2x}$입니다.`,
        sol: R`
동차해의 기저는 $y_1=e^{x}$, $y_2=xe^{x}$이고 $W=e^{2x}$.
$$y_p=-e^{x}\int\frac{xe^{x}\cdot e^{x}/x}{e^{2x}}dx+xe^{x}\int\frac{e^{x}\cdot e^{x}/x}{e^{2x}}dx=-xe^{x}+xe^{x}\ln x$$
$-xe^{x}$는 동차해에 흡수되므로
$$y=(c_1+c_2x)e^{x}+xe^{x}\ln x$$` },
      { type: 'num', lv: 2, q: R`$m=2$, $k=8$인 질량-스프링계가 임계감쇠가 되는 감쇠계수 $c$는?`, ans: '8', ansTex: R`8`,
        sol: R`임계감쇠 조건 $c^2=4mk=64$에서 $c=8$.` },
      { type: 'mc', lv: 2, q: R`$y''+16y=8\cos4t$의 특수해는?`,
        choices: [R`$t\sin4t$`, R`$\tfrac12t\cos4t$`, R`$\tfrac12\sin4t$`, R`$2t\sin4t$`], ans: 0,
        hint: R`$\omega=\omega_0=4$인 공진입니다.`,
        sol: R`
공진이므로 $y_p=t(K\cos4t+M\sin4t)$. 공식 $y_p=\dfrac{F_0}{2m\omega_0}t\sin\omega_0t=\dfrac{8}{8}t\sin4t$.
검산: $y_p''=8\cos4t-16t\sin4t$이므로 $y_p''+16y_p=8\cos4t$ ✓` },
      { type: 'num', lv: 3, q: R`$y'''-y'=0,\ y(0)=2,\ y'(0)=0,\ y''(0)=2$일 때 $y(\ln3)$의 값은?`, ans: '10/3', ansTex: R`\tfrac{10}{3}`,
        sol: R`
$\lambda^3-\lambda=\lambda(\lambda-1)(\lambda+1)$이므로 $y=c_1+c_2e^{x}+c_3e^{-x}$.
$c_1+c_2+c_3=2$, $c_2-c_3=0$, $c_2+c_3=2$에서 $c_2=c_3=1$, $c_1=0$. $y=2\cosh x$.
$$y(\ln3)=3+\tfrac13=\tfrac{10}{3}$$` },
      { type: 'num', lv: 1, q: R`$W(e^{x},\,e^{-x})$의 값은?`, ans: '-2', ansTex: R`-2`,
        sol: R`$W=e^{x}\cdot(-e^{-x})-e^{-x}\cdot e^{x}=-2$. 0이 아니므로 두 함수는 일차독립입니다.` },
    ],
  },
  // ───────────────────────── 03
  {
    n: 3, part: 'A', title: '연립 ODE와 상평면', en: 'Systems of ODEs, Phase Plane', ref: 'Kreyszig Ch.4', plot: 'phase',
    fig: R`$y_1'=-0.18y_1-y_2,\ y_2'=y_1-0.18y_2$의 궤적 (안정 나선점)`,
    tagline: R`고유값이 곧 해입니다. 대각합과 행렬식만 보고 임계점의 종류를 말할 수 있어야 합니다.`,
    summary: R`$\mathbf y'=A\mathbf y$를 고유값 문제로 풀고, 상평면에서 임계점을 마디점·안장점·중심·나선점으로 분류합니다. 비선형계는 야코비 행렬로 선형화합니다.`,
    goals: [
      R`$n$계 ODE를 1계 연립 ODE로 바꿀 수 있다`,
      R`실수·복소수·중복 고유값의 경우 일반해를 쓸 수 있다`,
      R`$p=\tr A$, $q=\det A$로 임계점의 종류와 안정성을 판정할 수 있다`,
      R`비선형계를 임계점에서 선형화할 수 있다`,
    ],
    sections: [
      { title: '연립 ODE와 행렬 표기', body: R`
여러 미지함수가 얽힌 방정식은 벡터 $\mathbf y=(y_1,\dots,y_n)^T$로 묶어 $\mathbf y'=A\mathbf y+\mathbf g(t)$로 씁니다. 고계 ODE도 1계 연립으로 바꿀 수 있습니다.

:::key n계 ODE → 1계 연립
$$y_1=y,\quad y_2=y',\quad\dots,\quad y_n=y^{(n-1)}$$
$$y_1'=y_2,\ \dots,\ y_{n-1}'=y_n,\ y_n'=F(t,y_1,\dots,y_n)$$
:::

:::ex 예제 1
질량-스프링계 $my''+cy'+ky=0$을 연립 ODE로 쓰세요.
---
$y_1=y$, $y_2=y'$로 두면
$$\mathbf y'=\begin{pmatrix}0&1\\-k/m&-c/m\end{pmatrix}\mathbf y$$
:::
` },
      { title: '고유값 방법', body: R`
$\mathbf y=\mathbf x e^{\lambda t}$를 대입하면 $A\mathbf x=\lambda\mathbf x$, 즉 고유값 문제가 됩니다.

:::key 고유값 방법
$$\mathbf y=c_1\mathbf x^{(1)}e^{\lambda_1t}+\cdots+c_n\mathbf x^{(n)}e^{\lambda_nt}\qquad(\text{독립인 고유벡터가 } n\text{개일 때})$$
$$\text{중복 고유값(고유벡터 1개): }\ \mathbf y^{(2)}=\mathbf x\,te^{\lambda t}+\mathbf u\,e^{\lambda t},\qquad (A-\lambda I)\mathbf u=\mathbf x$$
:::

- **복소 고유값** $\lambda=\alpha\pm i\beta$: $\mathbf x e^{\lambda t}$의 실수부와 허수부가 두 개의 실수해입니다.
- 초기조건은 $\mathbf y(0)=c_1\mathbf x^{(1)}+\cdots$로 연립일차방정식을 풀어 맞춥니다.

:::ex 예제 2
$\mathbf y'=\begin{pmatrix}-3&1\\1&-3\end{pmatrix}\mathbf y$의 일반해를 구하세요.
---
$(\lambda+3)^2-1=0$에서 $\lambda_1=-2$, $\lambda_2=-4$. 고유벡터는 각각 $(1,1)^T$, $(1,-1)^T$.
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{-2t}+c_2\begin{pmatrix}1\\-1\end{pmatrix}e^{-4t}$$
:::
` },
      { title: '임계점의 분류와 안정성', body: R`
$\mathbf y'=A\mathbf y$ ($\det A\ne0$)의 임계점은 원점 하나이고, 그 종류는 고유값으로 정해집니다. 계산할 때는 고유값 대신 $p=\lambda_1+\lambda_2=\tr A$, $q=\lambda_1\lambda_2=\det A$, $\Delta=p^2-4q$를 쓰면 빠릅니다.

:::key 임계점의 종류
| 종류 | 조건 | 고유값 |
|---|---|---|
| 마디점 (node) | $q>0,\ \Delta\ge0$ | 부호가 같은 실근 |
| 안장점 (saddle) | $q<0$ | 부호가 다른 실근 |
| 중심 (center) | $p=0,\ q>0$ | 순허수 |
| 나선점 (spiral) | $p\ne0,\ \Delta<0$ | 실수부가 0이 아닌 복소근 |

| 안정성 | 조건 |
|---|---|
| 안정하고 끌어당김 | $p<0,\ q>0$ |
| 안정 | $p\le0,\ q>0$ |
| 불안정 | $p>0$ 또는 $q<0$ |
:::

:::fig pq
:::

:::tip 시험 포인트
고유값을 끝까지 구하지 않아도 됩니다. $\tr A$와 $\det A$를 적고 표에 대입하면 종류와 안정성을 한 줄로 답할 수 있습니다.
:::
` },
      { title: '비선형계의 선형화', body: R`
비선형계 $\mathbf y'=\mathbf f(\mathbf y)$의 임계점 $\mathbf f(\mathbf y_0)=\mathbf 0$ 근처에서는 야코비 행렬 $J=\big[\partial f_i/\partial y_j\big]_{\mathbf y_0}$로 선형화합니다.

선형화한 계의 임계점이 마디점·안장점·나선점이면 원래 비선형계도 같은 종류와 안정성을 가집니다. **중심만은 예외**로, 비선형 항 때문에 나선점으로 바뀔 수 있습니다.

:::ex 예제 3 (진자)
$\theta''+k\sin\theta=0\ (k>0)$의 임계점 $(0,0)$과 $(\pi,0)$을 분류하세요.
---
$y_1=\theta$, $y_2=\theta'$로 두면 $y_1'=y_2$, $y_2'=-k\sin y_1$.
$$J=\begin{pmatrix}0&1\\-k\cos y_1&0\end{pmatrix}$$
$(0,0)$: $p=0$, $q=k>0$ → 중심(진자가 흔들리는 상태). $(\pi,0)$: $q=-k<0$ → 안장점(거꾸로 선 불안정 평형).
감쇠 $-cy_2$를 더하면 $(0,0)$의 $p=-c<0$이 되어 안정 나선점이 됩니다.
:::
` },
      { title: '비동차 연립 ODE', body: R`
$\mathbf y'=A\mathbf y+\mathbf g$의 해는 $\mathbf y=\mathbf y^{(h)}+\mathbf y^{(p)}$입니다.

- **미정계수법**: $\mathbf g=\mathbf u e^{kt}$이고 $k$가 고유값이 아니면 $\mathbf y^{(p)}=\mathbf v e^{kt}$로 두고 $(kI-A)\mathbf v=\mathbf u$를 풉니다. $k$가 고유값이면 $\mathbf v_1te^{kt}+\mathbf v_2e^{kt}$로 둡니다.
- **대각화**: $A=XDX^{-1}$이면 $\mathbf y=X\mathbf z$로 두어 $\mathbf z'=D\mathbf z+X^{-1}\mathbf g$, 서로 분리된 1계 방정식들로 만듭니다.

:::ex 예제 4
$\mathbf y'=\begin{pmatrix}-3&1\\1&-3\end{pmatrix}\mathbf y+\begin{pmatrix}1\\0\end{pmatrix}e^{t}$의 특수해를 구하세요.
---
$k=1$은 고유값($-2,-4$)이 아니므로 $\mathbf y^{(p)}=\mathbf v e^{t}$. $(I-A)\mathbf v=(1,0)^T$에서
$$\begin{pmatrix}4&-1\\-1&4\end{pmatrix}\mathbf v=\begin{pmatrix}1\\0\end{pmatrix}\;\Rightarrow\;\mathbf v=\frac1{15}\begin{pmatrix}4\\1\end{pmatrix}$$
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$y''+3y'+2y=0$을 $y_1=y$, $y_2=y'$로 두어 $\mathbf y'=A\mathbf y$로 쓸 때 $A$는?`,
        choices: [R`$\begin{pmatrix}0&1\\-2&-3\end{pmatrix}$`, R`$\begin{pmatrix}0&1\\-3&-2\end{pmatrix}$`, R`$\begin{pmatrix}1&0\\-2&-3\end{pmatrix}$`, R`$\begin{pmatrix}0&-2\\1&-3\end{pmatrix}$`], ans: 0,
        sol: R`$y_1'=y_2$, $y_2'=y''=-2y_1-3y_2$이므로 $A=\begin{pmatrix}0&1\\-2&-3\end{pmatrix}$.` },
      { type: 'mc', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}1&2\\2&1\end{pmatrix}\mathbf y$의 임계점 (0,0)의 종류는?`,
        choices: [R`안정한 마디점`, R`안장점 (불안정)`, R`중심`, R`불안정한 나선점`], ans: 1,
        sol: R`$q=\det A=1-4=-3<0$이므로 안장점입니다. 실제로 고유값은 $3,-1$입니다.` },
      { type: 'mc', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}0&1\\-4&0\end{pmatrix}\mathbf y$의 임계점 (0,0)은?`,
        choices: [R`중심 (안정하지만 끌어당기지 않음)`, R`안정한 나선점`, R`안장점`, R`불안정한 마디점`], ans: 0,
        sol: R`$p=0$, $q=4>0$이므로 중심입니다. 고유값 $\pm2i$, 궤적은 원점을 도는 타원입니다.` },
      { type: 'mc', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}-1&-2\\2&-1\end{pmatrix}\mathbf y$의 임계점 (0,0)은?`,
        choices: [R`불안정한 나선점`, R`안정한 마디점`, R`안정하고 끌어당기는 나선점`, R`중심`], ans: 2,
        sol: R`$p=-2<0$, $q=1+4=5>0$, $\Delta=4-20<0$. 복소 고유값 $-1\pm2i$이므로 안정하고 끌어당기는 나선점입니다.` },
      { type: 'open', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}2&1\\1&2\end{pmatrix}\mathbf y,\ \mathbf y(0)=\begin{pmatrix}3\\1\end{pmatrix}$을 푸세요.`,
        sol: R`
$(\lambda-2)^2-1=0$에서 $\lambda=3$ (고유벡터 $(1,1)^T$), $\lambda=1$ (고유벡터 $(1,-1)^T$).
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{3t}+c_2\begin{pmatrix}1\\-1\end{pmatrix}e^{t}$$
$c_1+c_2=3$, $c_1-c_2=1$에서 $c_1=2$, $c_2=1$.
$$y_1=2e^{3t}+e^{t},\qquad y_2=2e^{3t}-e^{t}$$` },
      { type: 'num', lv: 2, q: R`$\mathbf y'=\begin{pmatrix}-3&1\\1&-3\end{pmatrix}\mathbf y,\ \mathbf y(0)=\begin{pmatrix}2\\0\end{pmatrix}$일 때 $y_2(\ln2)$의 값은?`, ans: '3/16', ansTex: R`\tfrac{3}{16}`,
        sol: R`
일반해 $\mathbf y=c_1(1,1)^Te^{-2t}+c_2(1,-1)^Te^{-4t}$. $c_1+c_2=2$, $c_1-c_2=0$에서 $c_1=c_2=1$.
$y_2=e^{-2t}-e^{-4t}$이므로 $y_2(\ln2)=\tfrac14-\tfrac1{16}=\tfrac3{16}$.` },
      { type: 'mc', lv: 3, q: R`감쇠 진자 $y_1'=y_2,\ y_2'=-\sin y_1-0.5y_2$의 임계점 $(\pi,0)$은?`,
        choices: [R`안장점`, R`안정한 나선점`, R`중심`, R`안정한 마디점`], ans: 0,
        sol: R`
$J=\begin{pmatrix}0&1\\-\cos y_1&-0.5\end{pmatrix}$에서 $y_1=\pi$이면 $J=\begin{pmatrix}0&1\\1&-0.5\end{pmatrix}$, $q=-1<0$이므로 안장점입니다(거꾸로 선 진자).` },
      { type: 'num', lv: 2, q: R`$A=\begin{pmatrix}3&-2\\4&-1\end{pmatrix}$의 고유값을 $\alpha\pm i\beta\ (\beta>0)$라 할 때 $\beta$는?`, ans: '2', ansTex: R`2`,
        sol: R`$\lambda^2-2\lambda+(-3+8)=\lambda^2-2\lambda+5=0$에서 $\lambda=1\pm2i$. $\beta=2$이고, $p=2>0$이므로 불안정한 나선점입니다.` },
      { type: 'open', lv: 3, q: R`$\mathbf y'=\begin{pmatrix}1&1\\-1&3\end{pmatrix}\mathbf y$의 일반해를 구하고 임계점의 종류를 말하세요.`,
        hint: R`고유값이 중근이고 고유벡터가 하나뿐입니다.`,
        sol: R`
$\lambda^2-4\lambda+4=0$에서 $\lambda=2$ (중근). $A-2I=\begin{pmatrix}-1&1\\-1&1\end{pmatrix}$이므로 고유벡터는 $\mathbf x=(1,1)^T$ 하나뿐.
$(A-2I)\mathbf u=\mathbf x$에서 $-u_1+u_2=1$, 예를 들어 $\mathbf u=(0,1)^T$.
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{2t}+c_2\left[\begin{pmatrix}1\\1\end{pmatrix}t+\begin{pmatrix}0\\1\end{pmatrix}\right]e^{2t}$$
$p=4>0$, $\Delta=0$이므로 불안정한 (퇴화) 마디점입니다.` },
      { type: 'mc', lv: 2, q: R`$y_1'=y_2,\ y_2'=y_1-y_1^3$의 임계점에 대한 설명으로 옳은 것은?`,
        choices: [R`원점은 중심, $(\pm1,0)$은 안장점`, R`원점은 안장점, $(\pm1,0)$은 선형화하면 중심`, R`임계점은 원점 하나뿐이며 안장점이다`, R`세 임계점 모두 안정한 나선점이다`], ans: 1,
        sol: R`
$y_2=0$, $y_1-y_1^3=0$에서 임계점은 $(0,0)$, $(\pm1,0)$. $J=\begin{pmatrix}0&1\\1-3y_1^2&0\end{pmatrix}$.
원점: $q=-1<0$ → 안장점. $(\pm1,0)$: $J=\begin{pmatrix}0&1\\-2&0\end{pmatrix}$, $p=0$, $q=2$ → 선형화하면 중심.` },
    ],
  },
  // ───────────────────────── 04
  {
    n: 4, part: 'A', title: '급수해와 특수함수', en: 'Series Solutions, Special Functions', ref: 'Kreyszig Ch.5', plot: 'bessel',
    fig: R`베셀 함수 $J_0,\dots,J_4$ ($0\le x\le22$)`,
    tagline: R`계수가 변수인 방정식은 급수로 풉니다. 르장드르와 베셀이 그 대표입니다.`,
    summary: R`거듭제곱급수 방법과 프로베니우스 방법으로 변수계수 ODE를 풀고, 그 결과로 르장드르 다항식과 베셀 함수, 감마 함수를 다룹니다.`,
    goals: [
      R`급수를 대입하고 지수를 옮겨 점화식을 세울 수 있다`,
      R`수렴반경의 하한을 특이점까지의 거리로 말할 수 있다`,
      R`결정방정식을 세우고 프로베니우스의 세 경우를 구분할 수 있다`,
      R`르장드르 다항식의 직교성과 베셀 함수의 항등식을 쓸 수 있다`,
    ],
    sections: [
      { title: '거듭제곱급수 방법', body: R`
$y=\sum_{m=0}^{\infty}a_mx^m$을 대입하고, 모든 합을 같은 거듭제곱 $x^s$로 맞춘 뒤 계수를 0으로 두면 **점화식**이 나옵니다.

:::key 지수 옮기기
$$y'=\sum_{s=0}^\infty (s+1)a_{s+1}x^{s},\qquad y''=\sum_{s=0}^\infty (s+2)(s+1)a_{s+2}x^{s}$$
:::

:::ex 예제 1
$y''+y=0$을 거듭제곱급수로 푸세요.
---
$\sum\big[(s+2)(s+1)a_{s+2}+a_s\big]x^s=0$이므로 $a_{s+2}=-\dfrac{a_s}{(s+2)(s+1)}$.
짝수 계수는 $a_0$에서, 홀수 계수는 $a_1$에서 결정되어
$$y=a_0\Big(1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots\Big)+a_1\Big(x-\frac{x^3}{3!}+\cdots\Big)=a_0\cos x+a_1\sin x$$
:::

$P(x)y''+Q(x)y'+R(x)y=0$에서 $P(x_0)\ne0$인 점을 **보통점**이라고 합니다. 보통점 주위의 급수해는 $x_0$에서 가장 가까운 특이점(복소평면 포함)까지의 거리 이상의 수렴반경을 가집니다.

:::warn 수렴반경
$1+x^2=0$처럼 실근이 없어도 복소 특이점 $\pm i$까지의 거리 1이 수렴반경을 제한합니다.
:::
` },
      { title: '르장드르 방정식', body: R`
$(1-x^2)y''-2xy'+n(n+1)y=0$에 급수를 대입하면
$$a_{s+2}=-\frac{(n-s)(n+s+1)}{(s+2)(s+1)}\,a_s$$
를 얻습니다. $n$이 음이 아닌 정수이면 $s=n$에서 계수가 0이 되어 한쪽 급수가 다항식으로 끝납니다. $P_n(1)=1$이 되도록 맞춘 것이 **르장드르 다항식**입니다.

:::key 르장드르 다항식
$$P_n(x)=\frac{1}{2^nn!}\frac{d^n}{dx^n}\big(x^2-1\big)^n\qquad(\text{로드리게스 공식})$$
$$P_0=1,\quad P_1=x,\quad P_2=\tfrac12(3x^2-1),\quad P_3=\tfrac12(5x^3-3x)$$
$$\int_{-1}^{1}P_mP_n\,dx=\begin{cases}0,&m\ne n\\[2pt] \dfrac{2}{2n+1},&m=n\end{cases}$$
:::

직교성 덕분에 $[-1,1]$의 함수를 $f=\sum a_mP_m$으로 전개할 수 있고, 계수는 $a_m=\frac{2m+1}{2}\int_{-1}^{1}fP_m\,dx$입니다(푸리에-르장드르 급수).
` },
      { title: '프로베니우스 방법', body: R`
$x=0$이 **정칙 특이점**이면, 즉 방정식을 $x^2y''+xb(x)y'+c(x)y=0$ ($b,c$는 해석적) 꼴로 쓸 수 있으면 $y=x^r\sum a_mx^m$ 꼴의 해가 있습니다.

:::key 결정방정식과 세 경우
$$r(r-1)+b_0r+c_0=0,\qquad b_0=b(0),\ c_0=c(0)$$
| 경우 | 두 번째 해 |
|---|---|
| $r_1-r_2$가 정수가 아님 | $y_2=x^{r_2}\sum A_mx^m$ |
| 중근 $r_1=r_2=r$ | $y_2=y_1\ln x+x^{r}\sum_{m\ge1}A_mx^m$ |
| $r_1-r_2$가 양의 정수 | $y_2=ky_1\ln x+x^{r_2}\sum A_mx^m$ ($k$는 0일 수도 있음) |
:::

:::ex 예제 2
$4xy''+2y'+y=0$의 결정방정식 근과 해를 구하세요.
---
양변에 $x/4$를 곱하면 $x^2y''+\tfrac12xy'+\tfrac x4y=0$이므로 $b_0=\tfrac12$, $c_0=0$.
결정방정식 $r(r-1)+\tfrac12r=0$에서 $r=0,\ \tfrac12$ (차가 정수가 아님). 급수를 계산하면
$$y_1=\cos\sqrt x,\qquad y_2=\sin\sqrt x$$
:::
` },
      { title: '감마 함수와 베셀 방정식', body: R`
:::key 감마 함수
$$\Gamma(\nu)=\int_0^\infty e^{-t}t^{\nu-1}dt,\qquad \Gamma(\nu+1)=\nu\Gamma(\nu),\qquad \Gamma(n+1)=n!,\qquad \Gamma\big(\tfrac12\big)=\sqrt\pi$$
:::

**베셀 방정식** $x^2y''+xy'+(x^2-\nu^2)y=0$의 결정방정식 근은 $r=\pm\nu$이고, 첫 번째 해가 제1종 베셀 함수입니다.

:::key 베셀 함수
$$J_\nu(x)=\sum_{m=0}^{\infty}\frac{(-1)^m\,x^{2m+\nu}}{2^{2m+\nu}\,m!\,\Gamma(\nu+m+1)},\qquad J_0(x)=1-\frac{x^2}{4}+\frac{x^4}{64}-\cdots$$
$$(x^\nu J_\nu)'=x^\nu J_{\nu-1},\qquad (x^{-\nu}J_\nu)'=-x^{-\nu}J_{\nu+1}$$
$$J_{\nu-1}+J_{\nu+1}=\frac{2\nu}{x}J_\nu,\qquad J_{\nu-1}-J_{\nu+1}=2J_\nu'$$
$$J_{1/2}=\sqrt{\frac{2}{\pi x}}\sin x,\qquad J_{-1/2}=\sqrt{\frac{2}{\pi x}}\cos x$$
:::

- $\nu$가 정수가 아니면 일반해는 $c_1J_\nu+c_2J_{-\nu}$입니다.
- $\nu=n$이 정수이면 $J_{-n}=(-1)^nJ_n$이 되어 독립이 아니므로 제2종 베셀 함수 $Y_n$을 써서 $c_1J_n+c_2Y_n$으로 씁니다. $Y_n$은 $x\to0$에서 발산합니다.
` },
      { title: '풀이 전략 정리', body: R`
| 상황 | 방법 |
|---|---|
| 전개점이 보통점 | 거듭제곱급수 $\sum a_mx^m$ |
| 전개점이 정칙 특이점 | 프로베니우스 $x^r\sum a_mx^m$ |
| $(1-x^2)y''-2xy'+n(n+1)y=0$ | 르장드르: 유계인 해는 $P_n$ |
| $x^2y''+xy'+(x^2-\nu^2)y=0$ | 베셀: $J_\nu,\ Y_\nu$ |

:::tip 시험 포인트
점화식으로 처음 몇 개의 계수를 정확히 구하는 문제가 가장 많습니다. $s=0$, $s=1$처럼 작은 지수는 합의 시작 인덱스가 서로 다를 수 있으니 따로 적어 확인하세요.
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$(x^2-4)y''+xy'+y=0$을 $x=0$ 주위에서 거듭제곱급수로 풀 때 보장되는 수렴반경의 최솟값은?`,
        choices: [R`$1$`, R`$2$`, R`$4$`, R`$\infty$`], ans: 1,
        sol: R`특이점은 $x^2-4=0$의 근 $x=\pm2$입니다. 원점에서 가장 가까운 특이점까지의 거리가 2이므로 $R\ge2$.` },
      { type: 'mc', lv: 2, q: R`에어리 방정식 $y''=xy$에 $y=\sum a_mx^m$을 대입해 얻는 점화식은? ($s\ge1$)`,
        choices: [R`$a_{s+2}=\dfrac{a_{s-1}}{(s+2)(s+1)}$`, R`$a_{s+2}=-\dfrac{a_{s}}{(s+2)(s+1)}$`, R`$a_{s+2}=\dfrac{a_{s+1}}{s+2}$`, R`$a_{s+2}=\dfrac{s\,a_{s}}{(s+2)(s+1)}$`], ans: 0,
        sol: R`
$y''=\sum(s+2)(s+1)a_{s+2}x^s$, $xy=\sum a_{s-1}x^s$. $s=0$에서 $2a_2=0$, $s\ge1$에서 $(s+2)(s+1)a_{s+2}=a_{s-1}$.` },
      { type: 'num', lv: 2, q: R`$y''-2xy'+4y=0,\ y(0)=1,\ y'(0)=0$의 급수해는 다항식이 된다. $y(1)$의 값은?`, ans: '-1', ansTex: R`-1`,
        hint: R`점화식은 $a_{s+2}=\dfrac{(2s-4)a_s}{(s+2)(s+1)}$입니다.`,
        sol: R`
$x^s$의 계수: $(s+2)(s+1)a_{s+2}-2sa_s+4a_s=0$. $a_0=1$, $a_1=0$이면 $a_2=-2$, $a_4=0$, 이후 짝수 계수는 모두 0.
$y=1-2x^2$ (에르미트 다항식의 상수배)이므로 $y(1)=-1$.` },
      { type: 'mc', lv: 1, q: R`르장드르 다항식 $P_2(x)$는?`,
        choices: [R`$\tfrac12(3x^2-1)$`, R`$\tfrac12(5x^3-3x)$`, R`$3x^2-1$`, R`$\tfrac12(x^2-1)$`], ans: 0,
        sol: R`로드리게스 공식: $P_2=\dfrac{1}{8}\dfrac{d^2}{dx^2}(x^2-1)^2=\dfrac18(12x^2-4)=\tfrac12(3x^2-1)$. $P_2(1)=1$로 확인됩니다.` },
      { type: 'num', lv: 2, q: R`$\displaystyle\int_{-1}^{1}\big[P_3(x)\big]^2dx$의 값은?`, ans: '2/7', ansTex: R`\tfrac27`,
        sol: R`직교성 공식 $\int_{-1}^1P_n^2dx=\dfrac{2}{2n+1}$에 $n=3$을 넣으면 $\dfrac27$.` },
      { type: 'mc', lv: 2, q: R`$2x^2y''+3xy'-(1+x)y=0$의 결정방정식의 근은?`,
        choices: [R`$\tfrac12,\ -1$`, R`$1,\ -\tfrac12$`, R`$0,\ \tfrac12$`, R`$1$ (중근)`], ans: 0,
        sol: R`
2로 나누면 $x^2y''+\tfrac32xy'-\tfrac{1+x}{2}y=0$이므로 $b_0=\tfrac32$, $c_0=-\tfrac12$.
$r(r-1)+\tfrac32r-\tfrac12=0\iff 2r^2+r-1=0\iff r=\tfrac12,\,-1$. 차 $\tfrac32$는 정수가 아니므로 두 해 모두 프로베니우스 급수입니다.` },
      { type: 'mc', lv: 2, q: R`$J_{1/2}(x)$와 같은 것은?`,
        choices: [R`$\sqrt{\tfrac{2}{\pi x}}\sin x$`, R`$\sqrt{\tfrac{2}{\pi x}}\cos x$`, R`$\dfrac{\sin x}{x}$`, R`$\sqrt{\tfrac{\pi}{2x}}\sin x$`], ans: 0,
        sol: R`급수에 $\nu=\tfrac12$와 $\Gamma(m+\tfrac32)$를 넣어 정리하면 $\sin x$의 테일러 급수가 나와 $J_{1/2}=\sqrt{2/(\pi x)}\,\sin x$입니다.` },
      { type: 'num', lv: 2, q: R`$\Gamma\big(\tfrac52\big)$의 값은?`, ans: '3*sqrt(pi)/4', ansTex: R`\tfrac{3\sqrt\pi}{4}\approx1.329`,
        sol: R`$\Gamma(\tfrac52)=\tfrac32\Gamma(\tfrac32)=\tfrac32\cdot\tfrac12\Gamma(\tfrac12)=\tfrac34\sqrt\pi$.` },
      { type: 'open', lv: 3, q: R`$xy''+y'-y=0$에 프로베니우스 방법을 적용해 결정방정식, 첫 번째 해 $y_1$, 두 번째 해의 꼴을 구하세요.`,
        sol: R`
$x$를 곱하면 $x^2y''+xy'-xy=0$이므로 $b_0=1$, $c_0=0$. 결정방정식 $r(r-1)+r=r^2=0$, 중근 $r=0$.
$y=\sum a_mx^m$을 대입하면 $xy''+y'=\sum m^2a_mx^{m-1}$, $y=\sum a_{m-1}x^{m-1}$이므로
$$m^2a_m=a_{m-1}\;\Rightarrow\;a_m=\frac{a_0}{(m!)^2},\qquad y_1=\sum_{m=0}^\infty\frac{x^m}{(m!)^2}$$
중근이므로 두 번째 해는 $y_2=y_1\ln x+\sum_{m\ge1}A_mx^m$ 꼴입니다.` },
      { type: 'mc', lv: 3, q: R`$\dfrac{d}{dx}\big[xJ_1(x)\big]$와 같은 것은?`,
        choices: [R`$xJ_0(x)$`, R`$-xJ_2(x)$`, R`$J_0(x)$`, R`$-J_1(x)$`], ans: 0,
        sol: R`항등식 $(x^\nu J_\nu)'=x^\nu J_{\nu-1}$에 $\nu=1$을 넣으면 $(xJ_1)'=xJ_0$.` },
    ],
  },
  // ───────────────────────── 05
  {
    n: 5, part: 'A', title: '라플라스 변환', en: 'Laplace Transforms', ref: 'Kreyszig Ch.6', plot: 'laplace',
    fig: R`2계 시스템의 단위계단 응답 ($\zeta=0.08,\dots,1.6$)`,
    tagline: R`미분방정식을 대수방정식으로 바꿉니다. 계단 입력과 충격 입력을 가장 자연스럽게 다루는 도구입니다.`,
    summary: R`변환표와 두 이동정리, 도함수의 변환, 단위계단함수·델타함수, 합성곱으로 초기값 문제와 적분방정식을 풉니다. 부분분수 분해가 계산의 대부분을 차지합니다.`,
    goals: [
      R`기본 변환표와 $s$-이동·$t$-이동 정리를 쓸 수 있다`,
      R`초기값 문제를 보조방정식 $Y(s)$로 풀 수 있다`,
      R`구간별 함수를 $u(t-a)$로 쓰고 변환할 수 있다`,
      R`합성곱 정리로 역변환과 적분방정식을 풀 수 있다`,
    ],
    sections: [
      { title: '정의와 기본 변환', body: R`
$$F(s)=\mathcal L(f)=\int_0^\infty e^{-st}f(t)\,dt$$
$f$가 구간별 연속이고 $|f(t)|\le Me^{kt}$이면 $s>k$에서 변환이 존재합니다. $\mathcal L$은 선형입니다.

:::key 기본 변환표
| $f(t)$ | $F(s)$ | $f(t)$ | $F(s)$ |
|---|---|---|---|
| $1$ | $\dfrac1s$ | $e^{at}$ | $\dfrac{1}{s-a}$ |
| $t^n$ | $\dfrac{n!}{s^{n+1}}$ | $t^a\ (a>0)$ | $\dfrac{\Gamma(a+1)}{s^{a+1}}$ |
| $\cos\omega t$ | $\dfrac{s}{s^2+\omega^2}$ | $\sin\omega t$ | $\dfrac{\omega}{s^2+\omega^2}$ |
| $\cosh at$ | $\dfrac{s}{s^2-a^2}$ | $\sinh at$ | $\dfrac{a}{s^2-a^2}$ |
:::

:::key s-이동 (제1이동정리)
$$\mathcal L\{e^{at}f(t)\}=F(s-a),\qquad \mathcal L^{-1}\{F(s-a)\}=e^{at}f(t)$$
:::

예를 들어 $\mathcal L\{e^{-2t}\cos3t\}=\dfrac{s+2}{(s+2)^2+9}$입니다.
` },
      { title: '도함수의 변환과 초기값 문제', body: R`
:::key 도함수와 적분의 변환
$$\mathcal L(f')=sF-f(0),\qquad \mathcal L(f'')=s^2F-sf(0)-f'(0)$$
$$\mathcal L\Big\{\int_0^t f(\tau)\,d\tau\Big\}=\frac{F(s)}{s}$$
:::

초기값 문제는 세 단계로 풉니다.

1. 양변을 변환해 $Y(s)$에 대한 **보조방정식**을 세운다(초기조건이 자동으로 들어감).
2. $Y(s)$에 대해 풀고 부분분수로 분해한다.
3. 표를 거꾸로 읽어 $y(t)$를 얻는다.

:::ex 예제 1
$y''-y=t,\ y(0)=1,\ y'(0)=1$을 푸세요.
---
$(s^2Y-s-1)-Y=\dfrac1{s^2}$에서
$$Y=\frac{s+1}{s^2-1}+\frac{1}{s^2(s^2-1)}=\frac{1}{s-1}+\Big(\frac{1}{s^2-1}-\frac{1}{s^2}\Big)$$
$$y=e^{t}+\sinh t-t$$
:::
` },
      { title: '부분분수와 역변환', body: R`
- 서로 다른 일차인수 $(s-a)$: $\dfrac{A}{s-a}$, 계수는 가림법(cover-up)으로 $A=\big[(s-a)F(s)\big]_{s=a}$
- 반복 인수 $(s-a)^m$: $\dfrac{A_m}{(s-a)^m}+\cdots+\dfrac{A_1}{s-a}$, 역변환은 $\dfrac{t^{k-1}}{(k-1)!}e^{at}$
- 기약 이차인수: 완전제곱 $(s-\alpha)^2+\beta^2$으로 고쳐 $e^{\alpha t}\cos\beta t$, $e^{\alpha t}\sin\beta t$

:::ex 예제 2
$\mathcal L^{-1}\Big\{\dfrac{s+3}{s^2+4s+13}\Big\}$을 구하세요.
---
분모를 $(s+2)^2+9$로, 분자를 $(s+2)+1$로 고치면
$$\frac{s+2}{(s+2)^2+9}+\frac13\cdot\frac{3}{(s+2)^2+9}\;\Rightarrow\;e^{-2t}\Big(\cos3t+\tfrac13\sin3t\Big)$$
:::
` },
      { title: '단위계단함수와 t-이동', body: R`
단위계단함수 $u(t-a)$는 $t<a$에서 0, $t>a$에서 1입니다. 스위치를 켜는 순간을 표현합니다.

:::key t-이동 (제2이동정리)
$$\mathcal L\{f(t-a)u(t-a)\}=e^{-as}F(s),\qquad \mathcal L\{u(t-a)\}=\frac{e^{-as}}{s}$$
$$\text{다른 꼴: }\ \mathcal L\{g(t)u(t-a)\}=e^{-as}\,\mathcal L\{g(t+a)\}$$
:::

구간별 함수는 “새 식 − 옛 식”에 계단을 곱해 더합니다. $0<t<a$에서 $f_1$, $t>a$에서 $f_2$이면 $f=f_1+(f_2-f_1)u(t-a)$.

:::ex 예제 3
$f(t)=t\ (0<t<1)$, $f(t)=1\ (t>1)$의 라플라스 변환은?
---
$f=t-(t-1)u(t-1)$이므로 $F(s)=\dfrac1{s^2}-\dfrac{e^{-s}}{s^2}$.
:::

:::warn 흔한 실수
$\mathcal L\{t\,u(t-1)\}\ne e^{-s}/s^2$입니다. $t=(t-1)+1$로 고쳐야 $e^{-s}\big(\tfrac1{s^2}+\tfrac1s\big)$가 됩니다.
:::
` },
      { title: '디랙 델타와 충격 응답', body: R`
$\delta(t-a)$는 $t=a$에서 넓이 1인 순간적인 충격입니다. $\int_0^\infty g(t)\delta(t-a)\,dt=g(a)$이고
$$\mathcal L\{\delta(t-a)\}=e^{-as}$$
입니다.

:::ex 예제 4
$y''+3y'+2y=\delta(t-1),\ y(0)=y'(0)=0$을 푸세요.
---
$(s^2+3s+2)Y=e^{-s}$에서 $Y=e^{-s}\Big(\dfrac1{s+1}-\dfrac1{s+2}\Big)$.
$$y=u(t-1)\big(e^{-(t-1)}-e^{-2(t-1)}\big)$$
충격 전에는 정지해 있다가 $t=1$에 튕겨진 뒤 감쇠합니다.
:::
` },
      { title: '합성곱과 적분방정식', body: R`
:::key 합성곱 정리
$$(f*g)(t)=\int_0^t f(\tau)g(t-\tau)\,d\tau,\qquad \mathcal L(f*g)=F(s)G(s)$$
:::

곱으로 된 $H(s)=F(s)G(s)$의 역변환은 각각의 역변환을 합성곱하면 됩니다. 합성곱은 교환법칙이 성립하므로 적분이 쉬운 쪽을 $t-\tau$에 넣으세요.

:::ex 예제 5
$\mathcal L^{-1}\Big\{\dfrac{1}{(s^2+\omega^2)^2}\Big\}$을 구하세요.
---
$\dfrac{1}{s^2+\omega^2}$의 역변환은 $\dfrac{\sin\omega t}{\omega}$이므로
$$\frac{1}{\omega^2}\int_0^t\sin\omega\tau\,\sin\omega(t-\tau)\,d\tau=\frac{1}{2\omega^3}\big(\sin\omega t-\omega t\cos\omega t\big)$$
:::

$y(t)=f(t)+\int_0^t y(\tau)k(t-\tau)\,d\tau$ 꼴의 **적분방정식**은 양변을 변환하면 $Y=F+YK$가 되어 대수적으로 풀립니다.
` },
      { title: 's-미분·적분과 주기함수', body: R`
:::key 기타 성질
$$\mathcal L\{tf(t)\}=-F'(s),\qquad \mathcal L\Big\{\frac{f(t)}{t}\Big\}=\int_s^\infty F(\sigma)\,d\sigma$$
$$\text{주기 } p:\quad \mathcal L(f)=\frac{1}{1-e^{-ps}}\int_0^p e^{-st}f(t)\,dt$$
:::

예를 들어 $\mathcal L\{t\cos\omega t\}=-\dfrac{d}{ds}\dfrac{s}{s^2+\omega^2}=\dfrac{s^2-\omega^2}{(s^2+\omega^2)^2}$입니다. 공진 문제에서 $t\sin\omega t$, $t\cos\omega t$ 꼴이 이 성질로 나옵니다.

:::tip 시험 포인트
라플라스 문제는 거의 항상 부분분수에서 점수가 갈립니다. 분해한 뒤 통분해 원래 식이 되는지 확인하는 30초가 가장 값진 검산입니다.
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$\mathcal L\{t^2e^{3t}\}$는?`,
        choices: [R`$\dfrac{2}{(s-3)^3}$`, R`$\dfrac{2}{(s+3)^3}$`, R`$\dfrac{1}{(s-3)^2}$`, R`$\dfrac{6}{(s-3)^4}$`], ans: 0,
        sol: R`$\mathcal L(t^2)=2/s^3$에 $s$-이동을 적용하면 $\dfrac{2}{(s-3)^3}$.` },
      { type: 'mc', lv: 1, q: R`$\mathcal L^{-1}\Big\{\dfrac{s+1}{s^2+2s+5}\Big\}$는?`,
        choices: [R`$e^{t}\cos2t$`, R`$e^{-t}\sin2t$`, R`$e^{-t}\cos2t$`, R`$\tfrac12e^{-t}\sin2t$`], ans: 2,
        sol: R`$s^2+2s+5=(s+1)^2+4$이므로 $\dfrac{s+1}{(s+1)^2+2^2}$, 역변환은 $e^{-t}\cos2t$.` },
      { type: 'num', lv: 2, q: R`라플라스 변환으로 $y''+3y'+2y=0,\ y(0)=1,\ y'(0)=0$을 풀 때 $y(\ln2)$의 값은?`, ans: '3/4', ansTex: R`\tfrac34`,
        sol: R`
$(s^2Y-s)+3(sY-1)+2Y=0$에서 $Y=\dfrac{s+3}{(s+1)(s+2)}=\dfrac{2}{s+1}-\dfrac{1}{s+2}$.
$y=2e^{-t}-e^{-2t}$이므로 $y(\ln2)=1-\tfrac14=\tfrac34$.` },
      { type: 'mc', lv: 2, q: R`$\mathcal L\{t\,u(t-1)\}$는?`,
        choices: [R`$\dfrac{e^{-s}}{s^2}$`, R`$e^{-s}\Big(\dfrac{1}{s^2}+\dfrac1s\Big)$`, R`$e^{-s}\Big(\dfrac{1}{s^2}-\dfrac1s\Big)$`, R`$\dfrac{1}{s^2}-\dfrac{e^{-s}}{s}$`], ans: 1,
        sol: R`$t=(t-1)+1$이므로 $t\,u(t-1)=(t-1)u(t-1)+u(t-1)$. 변환하면 $e^{-s}\big(\tfrac1{s^2}+\tfrac1s\big)$.` },
      { type: 'num', lv: 2, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{e^{-2s}}{s^2}\Big\}$일 때 $f(5)$의 값은?`, ans: '3', ansTex: R`3`,
        sol: R`$f(t)=(t-2)u(t-2)$이므로 $f(5)=3$.` },
      { type: 'open', lv: 2, q: R`$y''+y=\delta(t-\pi),\ y(0)=0,\ y'(0)=1$을 풀고 해의 모양을 설명하세요.`,
        sol: R`
$(s^2+1)Y-1=e^{-\pi s}$에서 $Y=\dfrac{1}{s^2+1}+\dfrac{e^{-\pi s}}{s^2+1}$.
$$y=\sin t+u(t-\pi)\sin(t-\pi)=\sin t-u(t-\pi)\sin t$$
즉 $0<t<\pi$에서 $y=\sin t$, $t>\pi$에서 $y=0$. $t=\pi$에서 속도가 $-1$인 물체를 크기 1의 충격이 정확히 멈춰 세웁니다.` },
      { type: 'num', lv: 2, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{1}{s(s^2+1)}\Big\}$일 때 $f(\pi)$의 값은?`, ans: '2', ansTex: R`2`,
        hint: R`적분의 변환 $\mathcal L\{\int_0^t g\}=G/s$를 쓰세요.`,
        sol: R`$\dfrac1s\cdot\dfrac1{s^2+1}$이므로 $f=\int_0^t\sin\tau\,d\tau=1-\cos t$, $f(\pi)=2$.` },
      { type: 'mc', lv: 2, q: R`$\mathcal L\{t\sin\omega t\}$는?`,
        choices: [R`$\dfrac{s^2-\omega^2}{(s^2+\omega^2)^2}$`, R`$\dfrac{\omega}{(s^2+\omega^2)^2}$`, R`$-\dfrac{2\omega s}{(s^2+\omega^2)^2}$`, R`$\dfrac{2\omega s}{(s^2+\omega^2)^2}$`], ans: 3,
        sol: R`$\mathcal L\{tf\}=-F'(s)$이고 $F=\dfrac{\omega}{s^2+\omega^2}$이므로 $-F'=\dfrac{2\omega s}{(s^2+\omega^2)^2}$.` },
      { type: 'open', lv: 3, q: R`적분방정식 $y(t)=t+\displaystyle\int_0^t y(\tau)\sin(t-\tau)\,d\tau$를 푸세요.`,
        sol: R`
우변의 적분은 $y*\sin t$이므로 변환하면 $Y=\dfrac1{s^2}+\dfrac{Y}{s^2+1}$.
$$Y\cdot\frac{s^2}{s^2+1}=\frac1{s^2}\;\Rightarrow\;Y=\frac{s^2+1}{s^4}=\frac1{s^2}+\frac1{s^4}$$
$$y=t+\frac{t^3}{6}$$` },
      { type: 'num', lv: 3, q: R`$f(t)=\mathcal L^{-1}\Big\{\dfrac{1}{(s-1)(s-2)(s-3)}\Big\}$일 때 $f(\ln2)$의 값은?`, ans: '1', ansTex: R`1`,
        sol: R`
가림법: $s=1$에서 $\tfrac12$, $s=2$에서 $-1$, $s=3$에서 $\tfrac12$. $f=\tfrac12e^{t}-e^{2t}+\tfrac12e^{3t}$.
$$f(\ln2)=1-4+4=1$$` },
    ],
  }
  );
})();
