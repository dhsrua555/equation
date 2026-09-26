/* Part D — 복소해석 (Kreyszig Ch.13–16) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push(
  // ───────────────────────── 12
  {
    n: 12, part: 'D', title: '복소수와 해석함수', en: 'Complex Numbers, Analytic Functions', ref: 'Kreyszig Ch.13', plot: 'conformal',
    fig: R`w = z²이 직교 격자를 포물선 격자로 옮기는 모습`,
    tagline: R`코시–리만 방정식 두 줄이 복소 미분 가능성의 전부입니다.`,
    summary: R`복소수의 극형식과 거듭제곱근, 복소함수의 도함수와 해석성, 코시–리만 방정식과 조화함수, 지수·삼각·로그 함수와 일반 거듭제곱을 다룹니다.`,
    goals: [
      R`극형식으로 곱셈·거듭제곱·거듭제곱근을 계산할 수 있다`,
      R`코시–리만 방정식으로 해석성을 판정하고 도함수를 구할 수 있다`,
      R`조화함수의 켤레 조화함수를 구할 수 있다`,
      R`$e^z$, $\sin z$, $\Ln z$, $z^c$의 값을 계산할 수 있다`,
    ],
    sections: [
      { title: '복소수와 극형식', body: R`
$z=x+iy$의 켤레는 $\bar z=x-iy$, 절댓값은 $|z|=\sqrt{x^2+y^2}$이고 $z\bar z=|z|^2$입니다. 나눗셈은 분모의 켤레를 곱해 계산합니다.

극형식 $z=r(\cos\theta+i\sin\theta)=re^{i\theta}$에서 $r=|z|$, $\theta=\arg z$입니다. 편각은 $2\pi$의 정수배만큼 여러 값을 가지며, $(-\pi,\pi]$에서 고른 값이 주편각 $\Arg z$입니다.

:::key 극형식과 드무아브르
$$z_1z_2=r_1r_2\,e^{i(\theta_1+\theta_2)},\qquad z^n=r^ne^{in\theta},\qquad |z_1+z_2|\le|z_1|+|z_2|$$
$$\sqrt[n]{z}=\sqrt[n]{r}\;e^{i(\theta+2k\pi)/n},\qquad k=0,1,\dots,n-1$$
:::

:::ex 예제 1
$z^3=8i$의 근을 모두 구하세요.
---
$8i=8e^{i\pi/2}$이므로 $z=2e^{i(\pi/6+2k\pi/3)}$.
$$z=\sqrt3+i,\qquad -\sqrt3+i,\qquad -2i$$
세 근은 반지름 2인 원 위에 정삼각형을 이룹니다.
:::

:::warn 주편각
$\Arg z$는 $(-\pi,\pi]$에서 고릅니다. $1-i$의 주편각은 $7\pi/4$가 아니라 $-\pi/4$입니다. $\arctan(y/x)$만 쓰면 사분면을 틀리기 쉬우니 점의 위치를 먼저 그려 보세요.
:::
` },
      { title: '복소함수와 도함수', body: R`
$w=f(z)=u(x,y)+iv(x,y)$. 도함수는 실수와 같은 꼴로 정의하지만
$$f'(z_0)=\lim_{\Delta z\to0}\frac{f(z_0+\Delta z)-f(z_0)}{\Delta z}$$
에서 $\Delta z$가 **모든 방향**에서 0으로 갈 때 같은 극한을 가져야 합니다. 이 조건이 실수 미분보다 훨씬 강합니다.

영역 $D$의 모든 점에서 미분 가능하면 $f$는 $D$에서 **해석적(analytic)**입니다. 합·곱·몫·합성의 미분 법칙은 실수와 같습니다.

:::ex 예제 2
$f(z)=\bar z$는 미분 가능한가?
---
$\dfrac{\overline{\Delta z}}{\Delta z}$는 $\Delta z$가 실수축을 따라오면 1, 허수축을 따라오면 $-1$입니다. 극한이 존재하지 않으므로 어디에서도 미분 불가능합니다.
:::
` },
      { title: '코시–리만 방정식', body: R`
:::key 코시–리만 방정식
$$u_x=v_y,\qquad u_y=-v_x,\qquad f'(z)=u_x+iv_x=v_y-iu_y$$
$$\text{극좌표: }\ u_r=\frac1rv_\theta,\qquad v_r=-\frac1ru_\theta$$
:::

$u,v$의 1계 편도함수가 연속이고 코시–리만 방정식을 만족하면 $f$는 해석적입니다. 해석함수의 실수부와 허수부는 모두 라플라스 방정식 $\nabla^2u=0$을 만족하는 **조화함수**이며, $v$를 $u$의 **켤레 조화함수**라고 합니다.

:::ex 예제 3
$u=x^2-y^2+y$의 켤레 조화함수 $v$와 $f$를 구하세요.
---
$v_y=u_x=2x$에서 $v=2xy+h(x)$. $v_x=2y+h'=-u_y=2y-1$이므로 $h=-x$.
$$v=2xy-x,\qquad f=z^2-iz$$
:::
` },
      { title: '지수함수와 삼각·쌍곡선 함수', body: R`
:::key 기본 초월함수
$$e^{z}=e^{x}(\cos y+i\sin y),\qquad |e^z|=e^{x},\qquad e^{z+2\pi i}=e^{z}$$
$$\cos z=\frac{e^{iz}+e^{-iz}}{2},\qquad \sin z=\frac{e^{iz}-e^{-iz}}{2i}$$
$$\cos z=\cos x\cosh y-i\sin x\sinh y,\qquad \sin z=\sin x\cosh y+i\cos x\sinh y$$
:::

- $e^z$는 0이 되지 않고, 주기 $2\pi i$를 가집니다.
- $\cosh z=\cos(iz)$, $\sinh z=-i\sin(iz)$로 삼각함수와 쌍곡선함수가 이어집니다.

:::ex 예제 4
$e^z=1+i$를 푸세요.
---
$|e^z|=e^x=\sqrt2$에서 $x=\tfrac12\ln2$. $y=\arg(1+i)=\tfrac\pi4+2n\pi$.
$$z=\tfrac12\ln2+i\Big(\tfrac\pi4+2n\pi\Big)$$
:::

:::warn 유계가 아니다
실수에서와 달리 복소 $\sin z$, $\cos z$는 유계가 아닙니다. $\cos(iy)=\cosh y$는 $y\to\infty$에서 한없이 커집니다.
:::
` },
      { title: '로그와 일반 거듭제곱', body: R`
:::key 로그와 거듭제곱
$$\ln z=\ln|z|+i\arg z=\Ln z+2n\pi i,\qquad \Ln z=\ln|z|+i\Arg z$$
$$z^c=e^{c\ln z}\qquad(\text{주값: } e^{c\Ln z})$$
:::

$\ln z$는 무한히 많은 값을 가지며 서로 $2\pi i$의 정수배만큼 다릅니다. 예를 들어 $\Ln(-3)=\ln3+i\pi$입니다. $e^{\ln z}=z$는 항상 성립하지만 $\ln(e^z)=z+2n\pi i$입니다.

:::ex 예제 5
$2^{\,i}$의 주값은?
---
$2^i=e^{i\Ln2}=e^{i\ln2}=\cos(\ln2)+i\sin(\ln2)\approx0.769+0.639i$.
:::

:::warn 로그 법칙
$\Ln(z_1z_2)=\Ln z_1+\Ln z_2$는 일반적으로 성립하지 않습니다. 편각의 합이 $(-\pi,\pi]$를 벗어나면 $2\pi i$만큼 차이가 납니다.
:::
` },
    ],
    problems: [
      { type: 'num', lv: 1, q: R`$|(3+4i)(1-i)|$의 값은?`, ans: '5*sqrt(2)', ansTex: R`5\sqrt2\approx7.071`,
        sol: R`$|z_1z_2|=|z_1||z_2|=5\cdot\sqrt2$.` },
      { type: 'mc', lv: 1, q: R`$-1-i$의 주편각 $\Arg(-1-i)$는?`,
        choices: [R`$5\pi/4$`, R`$3\pi/4$`, R`$-3\pi/4$`, R`$-\pi/4$`], ans: 2,
        sol: R`제3사분면의 점이고 $(-\pi,\pi]$에서 골라야 하므로 $-3\pi/4$. ($5\pi/4$는 같은 방향이지만 범위를 벗어남)` },
      { type: 'num', lv: 2, q: R`$(1+i)^8$의 값은?`, ans: '16', ansTex: R`16`,
        sol: R`$1+i=\sqrt2e^{i\pi/4}$이므로 $(1+i)^8=16e^{2\pi i}=16$.` },
      { type: 'mc', lv: 2, q: R`다음 중 $z^3=-8$의 근은?`,
        choices: [R`$2$`, R`$1+i\sqrt3$`, R`$-1+i\sqrt3$`, R`$2i$`], ans: 1,
        sol: R`$-8=8e^{i\pi}$이므로 근은 $2e^{i(\pi+2k\pi)/3}$: $1+i\sqrt3$, $-2$, $1-i\sqrt3$. $-1+i\sqrt3=2e^{2\pi i/3}$은 세제곱하면 $8$입니다.` },
      { type: 'mc', lv: 2, q: R`다음 중 전평면에서 해석적인 함수는?`,
        choices: [R`$\bar z$`, R`$x^2+iy^2$`, R`$e^{x}(\cos y+i\sin y)$`, R`$|z|^2$`], ans: 2,
        sol: R`③은 $e^z$입니다: $u_x=e^x\cos y=v_y$, $u_y=-e^x\sin y=-v_x$. ②는 $u_x=2x$, $v_y=2y$라 직선 $y=x$ 위에서만 코시–리만 조건을 만족하므로 해석적이지 않습니다.` },
      { type: 'open', lv: 2, q: R`$u=x^3-3xy^2$가 조화함수임을 보이고, 켤레 조화함수 $v$와 해석함수 $f=u+iv$를 구하세요.`,
        sol: R`
$u_{xx}=6x$, $u_{yy}=-6x$이므로 $\nabla^2u=0$.
$v_y=u_x=3x^2-3y^2$에서 $v=3x^2y-y^3+h(x)$. $v_x=6xy+h'=-u_y=6xy$이므로 $h$는 상수.
$$v=3x^2y-y^3,\qquad f=z^3$$` },
      { type: 'num', lv: 2, q: R`$\big|e^{\,2+i\pi/3}\big|$의 값은?`, ans: 'e^2', ansTex: R`e^2\approx7.389`,
        sol: R`$|e^{x+iy}|=e^x$이므로 $e^2$. 허수부는 크기에 영향을 주지 않습니다.` },
      { type: 'mc', lv: 2, q: R`$\Ln i$의 값은?`,
        choices: [R`$\pi/2$`, R`$i\pi/2$`, R`$1+i\pi/2$`, R`$i\pi$`], ans: 1,
        sol: R`$|i|=1$, $\Arg i=\pi/2$이므로 $\Ln i=\ln1+i\tfrac\pi2=\tfrac{i\pi}{2}$.` },
      { type: 'num', lv: 3, q: R`$i^{\,i}$의 주값은?`, ans: 'e^(-pi/2)', ansTex: R`e^{-\pi/2}\approx0.2079`,
        sol: R`$i^i=e^{i\Ln i}=e^{i\cdot i\pi/2}=e^{-\pi/2}$. 놀랍게도 실수입니다. (모든 값은 $e^{-\pi/2-2n\pi}$)` },
      { type: 'num', lv: 3, q: R`$\cos z=2$를 만족하는 순허수 $z=iy\ (y>0)$에서 $y$의 값은?`, ans: 'ln(2+sqrt(3))', ansTex: R`\ln(2+\sqrt3)\approx1.317`,
        sol: R`$\cos(iy)=\cosh y=2$. $e^y+e^{-y}=4$에서 $e^y=2+\sqrt3$이므로 $y=\ln(2+\sqrt3)$.` },
      { type: 'num', lv: 2, q: R`$f=u+iv$, $u=x^2-y^2$, $v=2xy$일 때 $f'(1+i)$는? (복소수로 입력, 예: 3-2i)`, ans: '2+2i', ansTex: R`2+2i`,
        sol: R`$f'=u_x+iv_x=2x+2iy=2z$이므로 $f'(1+i)=2+2i$. ($f=z^2$)` },
    ],
  },
  // ───────────────────────── 13
  {
    n: 13, part: 'D', title: '복소적분', en: 'Complex Integration', ref: 'Kreyszig Ch.14', plot: 'contour',
    fig: R`특이점을 둘러싼 적분경로들`,
    tagline: R`해석적인 곳에서는 적분이 0, 특이점을 감싸면 2πi가 나옵니다.`,
    summary: R`복소 선적분의 정의와 계산, 코시 적분 정리, 코시 적분 공식과 도함수 공식을 다룹니다. 다음 단원의 유수 정리로 가는 다리입니다.`,
    goals: [
      R`매개변수화로 복소 선적분을 계산할 수 있다`,
      R`코시 적분 정리의 조건을 확인하고 적용할 수 있다`,
      R`코시 적분 공식과 도함수 공식으로 닫힌 경로 적분을 계산할 수 있다`,
      R`리우빌 정리 등 결과들을 설명할 수 있다`,
    ],
    sections: [
      { title: '복소 선적분', body: R`
경로 $C: z(t),\ a\le t\le b$ 위의 적분은 매개변수로 계산합니다.
$$\int_Cf(z)\,dz=\int_a^bf(z(t))\,z'(t)\,dt$$

:::key 가장 중요한 적분
$$\oint_{|z-z_0|=\rho}(z-z_0)^m\,dz=\begin{cases}2\pi i,&m=-1\\0,&m\ne-1\ (\text{정수})\end{cases}$$
$$\text{ML 부등식: }\ \Big|\int_Cf\,dz\Big|\le ML\qquad(|f|\le M\ \text{on}\ C,\ L=C\text{의 길이})$$
:::

$f$가 단순연결 영역에서 해석적이고 $F'=f$이면 $\int_{z_0}^{z_1}f\,dz=F(z_1)-F(z_0)$로 실수처럼 계산됩니다.

:::ex 예제 1
$\int_C\Re z\,dz$를 0에서 $1+2i$까지 (a) 직선, (b) 실수축을 따라 1까지 간 뒤 위로 올라가는 경로로 계산하세요.
---
(a) $z=(1+2i)t$: $\int_0^1t(1+2i)\,dt=\tfrac12+i$.
(b) $\int_0^1t\,dt+\int_0^2 1\cdot i\,dt=\tfrac12+2i$.
답이 다릅니다. $\Re z$는 해석적이지 않아 적분이 경로에 따라 달라집니다.
:::
` },
      { title: '코시 적분 정리', body: R`
:::thm 코시 적분 정리
$f$가 단순연결 영역 $D$에서 해석적이면, $D$ 안의 모든 단순닫힌경로 $C$에 대해 $\oint_Cf(z)\,dz=0$.
:::

- 적분이 경로에 무관해집니다.
- **경로 변형 원리**: 특이점을 지나지 않는 한 경로를 연속적으로 변형해도 적분값은 같습니다. 복잡한 경로는 특이점 주위의 작은 원으로 바꾸어 계산하세요.
- 다중연결 영역에서는 바깥 경로의 적분 = 안쪽 경로들의 적분의 합 (같은 방향).

예: $\oint_{|z|=1}e^z\,dz=0$, $\oint_{|z|=2}\dfrac{dz}{z-3}=0$ (특이점 $z=3$이 바깥).

:::warn 조건 확인
$\oint_{|z|=1}\dfrac{dz}{z}=2\pi i\ne0$입니다. $1/z$는 원점에서 해석적이지 않으므로 정리의 조건을 만족하지 않습니다.
:::
` },
      { title: '코시 적분 공식', body: R`
:::key 코시 적분 공식
$$f(z_0)=\frac{1}{2\pi i}\oint_C\frac{f(z)}{z-z_0}\,dz\qquad(z_0\text{는 }C\text{ 내부},\ f\text{는 }C\text{ 위와 내부에서 해석적})$$
:::

해석함수의 값은 경계에서의 값만으로 완전히 결정됩니다. 계산할 때는 피적분함수를 $\dfrac{f(z)}{z-z_0}$ 꼴로 나누고, $C$ 안에 있는 특이점만 분모에 남깁니다.

:::ex 예제 2
$\displaystyle\oint_{|z-2i|=2}\frac{dz}{z^2+4}$를 구하세요.
---
특이점 $\pm2i$ 중 원 안에 있는 것은 $2i$뿐입니다. $\dfrac{1}{z^2+4}=\dfrac{1/(z+2i)}{z-2i}$이므로 $f(z)=\dfrac1{z+2i}$.
$$2\pi i\cdot f(2i)=2\pi i\cdot\frac{1}{4i}=\frac\pi2$$
:::

특이점이 여러 개 들어 있으면 부분분수로 나누거나, 특이점마다 작은 원으로 경로를 쪼갭니다.
` },
      { title: '도함수 공식과 그 결과', body: R`
:::key 도함수 공식
$$f^{(n)}(z_0)=\frac{n!}{2\pi i}\oint_C\frac{f(z)}{(z-z_0)^{n+1}}\,dz\qquad\Longleftrightarrow\qquad\oint_C\frac{f(z)}{(z-z_0)^{n+1}}dz=\frac{2\pi i}{n!}f^{(n)}(z_0)$$
:::

해석함수는 한 번 미분 가능하면 몇 번이든 미분 가능합니다. 실함수와 가장 다른 점입니다.

:::ex 예제 3
$\displaystyle\oint_{|z|=1}\frac{\cos z}{z^3}\,dz$를 구하세요.
---
$f=\cos z$, $n=2$: $\dfrac{2\pi i}{2!}f''(0)=\pi i\cdot(-\cos0)=-\pi i$.
:::

- **코시 부등식**: $|f^{(n)}(z_0)|\le\dfrac{n!M}{r^n}$ (반지름 $r$인 원 위에서 $|f|\le M$)
- **리우빌 정리**: 전평면에서 해석적(정함수)이고 유계이면 상수함수
- **모레라 정리**: 연속이고 모든 닫힌 경로의 적분이 0이면 해석적

:::tip 시험 포인트
피적분함수를 $\dfrac{f(z)}{(z-z_0)^{n+1}}$ 꼴로 만드는 것이 전부입니다. 분모에서 $C$ 안의 특이점만 남기고 나머지는 $f(z)$에 넣으세요.
:::
` },
    ],
    problems: [
      { type: 'mc', lv: 1, q: R`$\displaystyle\oint_{|z|=1}\frac{dz}{z}$의 값은? (반시계 방향)`,
        choices: [R`$0$`, R`$2\pi i$`, R`$\pi i$`, R`$-2\pi i$`], ans: 1,
        sol: R`$z=e^{it}$이면 $\int_0^{2\pi}\dfrac{ie^{it}}{e^{it}}dt=2\pi i$.` },
      { type: 'num', lv: 1, q: R`$\displaystyle\oint_{|z|=3}z^2\,dz$의 값은?`, ans: '0', ansTex: R`0`,
        sol: R`$z^2$은 정함수이므로 코시 적분 정리에 의해 0.` },
      { type: 'num', lv: 2, q: R`$\displaystyle\int_0^{1+i}z^2\,dz$의 값은? (복소수로 입력)`, ans: '(-2+2i)/3', ansTex: R`\tfrac{-2+2i}{3}`,
        sol: R`$z^2$은 해석적이므로 경로와 무관: $\dfrac{(1+i)^3}{3}=\dfrac{1+3i-3-i}{3}=\dfrac{-2+2i}{3}$.` },
      { type: 'num', lv: 2, q: R`$\displaystyle\oint_{|z|=3}\frac{e^z}{z-2}\,dz$의 값은?`, ans: '2*pi*i*e^2', ansTex: R`2\pi ie^2`,
        sol: R`$z_0=2$가 원 안에 있으므로 코시 적분 공식에서 $2\pi i\,e^2$.` },
      { type: 'mc', lv: 2, q: R`$\displaystyle\oint_{|z|=1}\frac{dz}{z-2}$의 값은?`,
        choices: [R`$2\pi i$`, R`$\pi i$`, R`$-2\pi i$`, R`$0$`], ans: 3,
        sol: R`특이점 $z=2$가 원 밖에 있으므로 피적분함수는 원 안에서 해석적입니다. 코시 적분 정리에 의해 0.` },
      { type: 'num', lv: 2, q: R`$\displaystyle\oint_{|z|=1}\frac{e^{2z}}{z^4}\,dz$의 값은?`, ans: '8*pi*i/3', ansTex: R`\tfrac{8\pi i}{3}`,
        sol: R`$f=e^{2z}$, $n=3$: $\dfrac{2\pi i}{3!}f'''(0)=\dfrac{2\pi i}{6}\cdot8=\dfrac{8\pi i}{3}$.` },
      { type: 'open', lv: 3, q: R`$\displaystyle\oint_C\frac{dz}{z^2+1}$을 (a) $C:|z|=2$, (b) $C:|z-i|=1$에 대해 각각 구하세요.`,
        sol: R`
부분분수: $\dfrac1{z^2+1}=\dfrac1{2i}\Big(\dfrac1{z-i}-\dfrac1{z+i}\Big)$.
(a) 두 특이점 $\pm i$가 모두 안에 있으므로 $\dfrac1{2i}(2\pi i-2\pi i)=0$.
(b) $z=i$만 안에 있으므로 $\dfrac1{2i}\cdot2\pi i=\pi$.` },
      { type: 'mc', lv: 2, q: R`리우빌 정리의 내용으로 옳은 것은?`,
        choices: [R`유계인 정함수는 상수함수이다`, R`모든 정함수는 유계이다`, R`$\sin z$는 유계인 정함수이다`, R`정함수의 도함수는 항상 유계이다`], ans: 0,
        sol: R`리우빌 정리: 전평면에서 해석적이고 유계인 함수는 상수입니다. 그래서 상수가 아닌 $\sin z$는 유계일 수 없습니다.` },
      { type: 'num', lv: 3, q: R`$\displaystyle\oint_{|z|=2}\frac{z}{(z-1)(z-3)}\,dz$의 값은?`, ans: '-pi*i', ansTex: R`-\pi i`,
        sol: R`$z=1$만 원 안에 있습니다. $f(z)=\dfrac{z}{z-3}$로 두면 $2\pi i\,f(1)=2\pi i\cdot\dfrac{1}{-2}=-\pi i$.` },
      { type: 'num', lv: 2, q: R`단위원을 반시계 방향으로 도는 $\displaystyle\oint_{|z|=1}\bar z\,dz$의 값은?`, ans: '2*pi*i', ansTex: R`2\pi i`,
        hint: R`$\bar z$는 해석적이지 않으므로 직접 매개변수화하세요.`,
        sol: R`$z=e^{it}$이면 $\bar z=e^{-it}$, $dz=ie^{it}dt$. $\int_0^{2\pi}e^{-it}ie^{it}dt=2\pi i$. (단위원 위에서 $\bar z=1/z$이기도 합니다.)` },
    ],
  },
  // ───────────────────────── 14
  {
    n: 14, part: 'D', title: '급수와 유수 적분', en: 'Series, Residue Integration', ref: 'Kreyszig Ch.15–16', plot: 'residue',
    fig: R`실수축과 반원으로 닫은 적분경로`,
    tagline: R`로랑 급수의 한 계수 b₁이 닫힌 경로 적분 전체를 결정합니다.`,
    summary: R`멱급수와 수렴반경, 테일러·로랑 급수, 특이점의 분류, 유수 정리, 그리고 유수로 실적분을 계산하는 세 가지 유형을 다룹니다. 복소해석 시험의 마지막 대문제로 가장 자주 나옵니다.`,
    goals: [
      R`수렴반경을 계수 또는 특이점까지의 거리로 구할 수 있다`,
      R`주어진 고리 영역에서 로랑 급수를 전개할 수 있다`,
      R`특이점을 분류하고 유수를 계산할 수 있다`,
      R`삼각함수 적분, 이상적분, 푸리에형 적분을 유수로 계산할 수 있다`,
    ],
    sections: [
      { title: '멱급수와 수렴반경', body: R`
멱급수 $\sum a_n(z-z_0)^n$은 원판 $|z-z_0|<R$에서 수렴하고 바깥에서 발산합니다. 수렴 원판 안에서는 항별로 미분·적분할 수 있고 수렴반경은 그대로입니다.

:::key 수렴반경
$$R=\lim_{n\to\infty}\left|\frac{a_n}{a_{n+1}}\right|\qquad(\text{극한이 존재할 때}),\qquad \frac1R=\limsup_{n\to\infty}\sqrt[n]{|a_n|}$$
:::

예: $\sum\dfrac{z^n}{n!}$은 $R=\infty$, $\sum z^n$은 $R=1$, $\sum n!\,z^n$은 $R=0$.
` },
      { title: '테일러 급수', body: R`
$f$가 $z_0$에서 해석적이면 테일러 급수 $f(z)=\sum\dfrac{f^{(n)}(z_0)}{n!}(z-z_0)^n$으로 전개되고, 수렴반경은 $z_0$에서 가장 가까운 특이점까지의 거리입니다.

:::key 기본 매클로린 급수
$$\frac1{1-z}=\sum_{n=0}^\infty z^n\ \ (|z|<1),\qquad e^z=\sum_{n=0}^\infty\frac{z^n}{n!}$$
$$\sin z=\sum_{n=0}^\infty\frac{(-1)^nz^{2n+1}}{(2n+1)!},\qquad \cos z=\sum_{n=0}^\infty\frac{(-1)^nz^{2n}}{(2n)!},\qquad \Ln(1+z)=\sum_{n=1}^\infty\frac{(-1)^{n+1}z^n}{n}$$
:::

예를 들어 $\dfrac1{1+z^2}=\sum(-1)^nz^{2n}$의 수렴반경은 1입니다. 실수축에서는 아무 문제가 없어 보이지만 특이점 $\pm i$가 반경을 제한합니다.
` },
      { title: '로랑 급수', body: R`
고리 영역 $r<|z-z_0|<R$에서 해석적인 함수는 음의 거듭제곱까지 포함한 로랑 급수로 전개됩니다.

:::key 로랑 급수
$$f(z)=\sum_{n=0}^{\infty}a_n(z-z_0)^n+\sum_{n=1}^{\infty}\frac{b_n}{(z-z_0)^n},\qquad b_1=\frac{1}{2\pi i}\oint_Cf(z)\,dz$$
:::

음의 거듭제곱 부분을 **주요부**라고 합니다. 같은 함수라도 고리 영역이 다르면 급수가 달라집니다. 실제 계산에서는 적분 공식 대신 등비급수 $\frac1{1-w}=\sum w^n$을 $|w|<1$이 되도록 적용합니다.

:::ex 예제 1
$\dfrac1{1-z}$를 $|z|>1$에서 전개하세요.
---
$|1/z|<1$이 되도록 $\dfrac1{1-z}=-\dfrac1z\cdot\dfrac{1}{1-1/z}$로 씁니다.
$$\frac1{1-z}=-\sum_{n=0}^\infty\frac{1}{z^{n+1}}=-\frac1z-\frac1{z^2}-\cdots$$
:::

또 $e^{1/z}=\sum_{n=0}^\infty\dfrac{1}{n!\,z^n}$ ($|z|>0$)은 주요부가 무한히 긴 예입니다.
` },
      { title: '특이점과 영점', body: R`
고립 특이점은 로랑 급수의 주요부로 분류합니다.

| 주요부 | 종류 | 예 ($z=0$) |
|---|---|---|
| 없음 | 제거가능 특이점 | $\dfrac{\sin z}{z}$ |
| 유한 개, 최고차 $b_m$ | $m$위 극 | $\dfrac1{z^2}$ |
| 무한 개 | 진성 특이점 | $e^{1/z}$ |

$f(z_0)=f'(z_0)=\cdots=f^{(n-1)}(z_0)=0\ne f^{(n)}(z_0)$이면 $z_0$는 $n$위 영점입니다. $f$가 $n$위 영점을 가지면 $1/f$는 그 점에서 $n$위 극을 가집니다.

:::tip 극의 위수 빨리 찾기
$\dfrac{g(z)}{h(z)}$에서 $g(z_0)\ne0$이면 극의 위수는 $h$의 영점의 위수입니다. 분자도 0이면 급수로 전개해 약분한 뒤 판단하세요.
:::
` },
      { title: '유수와 유수 정리', body: R`
유수 $\Res_{z=z_0}f$는 로랑 급수의 계수 $b_1$입니다.

:::key 유수 계산과 유수 정리
$$\Res_{z=z_0}f=\lim_{z\to z_0}(z-z_0)f(z)=\frac{p(z_0)}{q'(z_0)}\qquad(\text{단순극},\ f=p/q)$$
$$\Res_{z=z_0}f=\frac{1}{(m-1)!}\lim_{z\to z_0}\frac{d^{m-1}}{dz^{m-1}}\Big[(z-z_0)^mf(z)\Big]\qquad(m\text{위 극})$$
$$\oint_Cf(z)\,dz=2\pi i\sum_{C\text{ 내부}}\Res f$$
:::

진성 특이점에서는 로랑 급수를 직접 전개해 $b_1$을 읽습니다.

:::ex 예제 2
$\displaystyle\oint_{|z|=2}\frac{4-3z}{z^2-z}\,dz$를 구하세요.
---
단순극 $z=0,1$이 모두 원 안에 있습니다. $\Res_{0}=\dfrac{4}{0-1}=-4$, $\Res_{1}=\dfrac{4-3}{1}=1$.
$$2\pi i(-4+1)=-6\pi i$$
:::
` },
      { title: '유수로 실적분 계산하기', body: R`
:::key 실적분의 세 유형
$$\int_0^{2\pi}F(\cos\theta,\sin\theta)\,d\theta=\oint_{|z|=1}F\Big(\frac{z+z^{-1}}2,\frac{z-z^{-1}}{2i}\Big)\frac{dz}{iz}$$
$$\int_{-\infty}^{\infty}f(x)\,dx=2\pi i\sum_{\Im z_j>0}\Res_{z=z_j}f\qquad(f=p/q,\ \deg q\ge\deg p+2)$$
$$\int_{-\infty}^{\infty}f(x)\cos sx\,dx=\Re\Big[2\pi i\sum_{\Im z_j>0}\Res\,f(z)e^{isz}\Big],\quad \sin sx\ \text{이면}\ \Im\qquad(s>0,\ \deg q\ge\deg p+1)$$
:::

- 유형 1은 단위원 **안**의 극만, 유형 2·3은 **위쪽 반평면**의 극만 셉니다.
- 유형 2·3은 실수축과 큰 반원으로 닫은 경로를 쓰고, 반원 위의 적분이 $R\to\infty$에서 0이 되는 것을 이용합니다.

:::ex 예제 3
$\displaystyle\int_0^{2\pi}\frac{d\theta}{\sqrt2-\cos\theta}$를 구하세요.
---
$z=e^{i\theta}$로 두면 $\oint\dfrac{dz/(iz)}{\sqrt2-\frac12(z+z^{-1})}=\oint\dfrac{-2\,dz}{i(z^2-2\sqrt2z+1)}$.
근 $z=\sqrt2\pm1$ 중 단위원 안에 있는 것은 $\sqrt2-1$. 유수는 $\dfrac{-2}{i(2z-2\sqrt2)}\Big|_{z=\sqrt2-1}=\dfrac{-2}{-2i}=\dfrac1i$.
$$2\pi i\cdot\frac1i=2\pi$$
:::

:::ex 예제 4
$\displaystyle\int_{-\infty}^{\infty}\frac{dx}{1+x^2}$을 유수로 구하세요.
---
위쪽 반평면의 극은 $z=i$, 유수 $\dfrac{1}{2i}$. 따라서 $2\pi i\cdot\dfrac1{2i}=\pi$.
:::
` },
    ],
    problems: [
      { type: 'num', lv: 1, q: R`$\displaystyle\sum_{n=0}^\infty\frac{n+1}{3^n}z^n$의 수렴반경은?`, ans: '3', ansTex: R`3`,
        sol: R`$\left|\dfrac{a_n}{a_{n+1}}\right|=\dfrac{n+1}{3^n}\cdot\dfrac{3^{n+1}}{n+2}=\dfrac{3(n+1)}{n+2}\to3$.` },
      { type: 'num', lv: 2, q: R`$\dfrac{1}{z^2+4}$의 $z_0=1$ 중심 테일러 급수의 수렴반경은?`, ans: 'sqrt(5)', ansTex: R`\sqrt5\approx2.236`,
        sol: R`특이점 $\pm2i$까지의 거리는 $|1-2i|=\sqrt5$로 같습니다. 따라서 $R=\sqrt5$.` },
      { type: 'mc', lv: 2, q: R`$\dfrac{1-\cos z}{z^4}$의 $z=0$은 어떤 특이점인가?`,
        choices: [R`제거가능 특이점`, R`1위 극`, R`2위 극`, R`진성 특이점`], ans: 2,
        sol: R`$1-\cos z=\dfrac{z^2}{2}-\dfrac{z^4}{24}+\cdots$이므로 $\dfrac{1-\cos z}{z^4}=\dfrac{1}{2z^2}-\dfrac1{24}+\cdots$. 주요부의 최고차가 $z^{-2}$이므로 2위 극.` },
      { type: 'num', lv: 2, q: R`$\Res_{z=0}\dfrac{e^z}{z^3}$의 값은?`, ans: '1/2', ansTex: R`\tfrac12`,
        sol: R`$\dfrac{e^z}{z^3}=\dfrac1{z^3}+\dfrac1{z^2}+\dfrac{1}{2z}+\cdots$에서 $b_1=\tfrac12$.` },
      { type: 'num', lv: 2, q: R`$\Res_{z=i}\dfrac{1}{z^2+1}$의 값은? (복소수로 입력)`, ans: '-i/2', ansTex: R`-\tfrac i2`,
        sol: R`단순극이므로 $\dfrac{p}{q'}=\dfrac{1}{2z}\Big|_{z=i}=\dfrac1{2i}=-\dfrac i2$.` },
      { type: 'num', lv: 2, q: R`$\displaystyle\oint_{|z|=2}\frac{3z+2}{z(z-1)}\,dz$의 값은?`, ans: '6*pi*i', ansTex: R`6\pi i`,
        sol: R`$\Res_0=\dfrac{2}{-1}=-2$, $\Res_1=\dfrac{5}{1}=5$. 합 3이므로 $6\pi i$.` },
      { type: 'num', lv: 3, q: R`$\displaystyle\int_0^{2\pi}\frac{d\theta}{5-4\cos\theta}$의 값은?`, ans: '2*pi/3', ansTex: R`\tfrac{2\pi}{3}`,
        sol: R`
$z=e^{i\theta}$: $\oint\dfrac{dz/(iz)}{5-2(z+z^{-1})}=\oint\dfrac{dz}{-i(2z-1)(z-2)}$. 단위원 안의 극은 $z=\tfrac12$.
유수 $\dfrac{1}{-i\cdot2\cdot(\frac12-2)}=\dfrac{1}{3i}$, 적분값 $2\pi i\cdot\dfrac{1}{3i}=\dfrac{2\pi}{3}$. (공식 $\dfrac{2\pi}{\sqrt{a^2-b^2}}$과 일치)` },
      { type: 'num', lv: 3, q: R`$\displaystyle\int_{-\infty}^{\infty}\frac{dx}{(x^2+1)^2}$의 값은?`, ans: 'pi/2', ansTex: R`\tfrac\pi2`,
        sol: R`
$z=i$는 2위 극. $\Res=\dfrac{d}{dz}(z+i)^{-2}\Big|_{z=i}=-2(2i)^{-3}=\dfrac{-2}{-8i}=\dfrac1{4i}$.
$$2\pi i\cdot\frac{1}{4i}=\frac\pi2$$` },
      { type: 'open', lv: 3, q: R`$f(z)=\dfrac{1}{(z-1)(z-2)}$를 고리 영역 $1<|z|<2$에서 로랑 급수로 전개하세요.`,
        sol: R`
부분분수 $f=\dfrac1{z-2}-\dfrac1{z-1}$.
$|z|<2$이므로 $\dfrac{1}{z-2}=-\dfrac12\cdot\dfrac{1}{1-z/2}=-\sum_{n=0}^\infty\dfrac{z^n}{2^{n+1}}$.
$|z|>1$이므로 $-\dfrac{1}{z-1}=-\dfrac1z\cdot\dfrac1{1-1/z}=-\sum_{n=0}^\infty\dfrac1{z^{n+1}}$.
$$f(z)=-\sum_{n=0}^\infty\frac{z^n}{2^{n+1}}-\sum_{n=1}^\infty\frac{1}{z^n}$$` },
      { type: 'num', lv: 3, q: R`$\displaystyle\int_{-\infty}^{\infty}\frac{\cos2x}{x^2+9}\,dx$의 값은?`, ans: 'pi*e^(-6)/3', ansTex: R`\tfrac{\pi}{3}e^{-6}`,
        sol: R`$\dfrac{e^{2iz}}{z^2+9}$의 위쪽 극 $3i$에서 유수 $\dfrac{e^{-6}}{6i}$. $2\pi i\cdot\dfrac{e^{-6}}{6i}=\dfrac{\pi e^{-6}}{3}$ (실수이므로 그대로 실수부).` },
    ],
  }
  );
})();
