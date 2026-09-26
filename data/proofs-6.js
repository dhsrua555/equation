/* 증명 — 12 복소함수, 13 복소적분, 14 급수와 유수 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 12
  { ch: 'ch12', id: 'polar', title: '극형식의 곱셈, 드무아브르 공식, 거듭제곱근', keys: ['극형식과 드무아브르'],
    tags: 'polar form de moivre roots triangle inequality 극형식 드무아브르 거듭제곱근 삼각부등식',
    stmt: R`$z_1z_2=r_1r_2e^{i(\theta_1+\theta_2)}$, $z^n=r^ne^{in\theta}$이고 $z$의 $n$제곱근은 $\sqrt[n]r\,e^{i(\theta+2k\pi)/n}$ ($k=0,\dots,n-1$)이다. 또 $|z_1+z_2|\le|z_1|+|z_2|$.`,
    body: R`
삼각함수의 덧셈정리로
$$z_1z_2=r_1r_2\big[(\cos\theta_1\cos\theta_2-\sin\theta_1\sin\theta_2)+i(\sin\theta_1\cos\theta_2+\cos\theta_1\sin\theta_2)\big]=r_1r_2\big[\cos(\theta_1+\theta_2)+i\sin(\theta_1+\theta_2)\big]$$
귀납적으로 $z^n=r^n(\cos n\theta+i\sin n\theta)$.

**거듭제곱근.** $w=\rho e^{i\varphi}$가 $w^n=z$를 만족하려면 $\rho^n=r$이고 $n\varphi=\theta+2k\pi$. 따라서 $\varphi=\frac{\theta+2k\pi}n$이고, $k$와 $k+n$은 같은 점을 주므로 서로 다른 근은 $k=0,\dots,n-1$의 $n$개입니다.

**삼각부등식.** $|z_1+z_2|^2=|z_1|^2+|z_2|^2+2\Re(z_1\bar z_2)\le|z_1|^2+|z_2|^2+2|z_1||z_2|=(|z_1|+|z_2|)^2$.` },
  { ch: 'ch12', id: 'cr-necessary', title: '코시–리만 방정식 (필요조건)', keys: ['코시–리만 방정식'],
    tags: 'cauchy riemann equations necessary analytic derivative 코시 리만 필요조건 해석함수 도함수',
    stmt: R`$f=u+iv$가 $z_0$에서 미분 가능하면 그 점에서 $u_x=v_y$, $u_y=-v_x$이고 $f'=u_x+iv_x$.`,
    body: R`
도함수의 극한은 $\Delta z\to0$의 방향에 무관해야 합니다.

실수축 방향 $\Delta z=\Delta x$:
$$f'(z_0)=\lim\frac{\Delta u+i\Delta v}{\Delta x}=u_x+iv_x$$
허수축 방향 $\Delta z=i\Delta y$:
$$f'(z_0)=\lim\frac{\Delta u+i\Delta v}{i\Delta y}=-iu_y+v_y$$
두 값의 실수부와 허수부를 비교하면 $u_x=v_y$, $v_x=-u_y$.` },
  { ch: 'ch12', id: 'cr-sufficient', title: '코시–리만 방정식 (충분조건)', keys: ['코시–리만 방정식'],
    tags: 'cauchy riemann sufficient continuous partial derivatives 코시 리만 충분조건 편도함수 연속',
    stmt: R`$u,v$의 1계 편도함수가 연속이고 코시–리만 방정식을 만족하면 $f=u+iv$는 미분 가능하다.`,
    body: R`
편도함수가 연속이면 $u,v$는 전미분 가능합니다.
$$\Delta u=u_x\Delta x+u_y\Delta y+\varepsilon_1|\Delta z|,\qquad \Delta v=v_x\Delta x+v_y\Delta y+\varepsilon_2|\Delta z|\qquad(\varepsilon_i\to0)$$
$u_y=-v_x$, $v_y=u_x$를 넣으면
$$\Delta u+i\Delta v=u_x(\Delta x+i\Delta y)+iv_x(\Delta x+i\Delta y)+(\varepsilon_1+i\varepsilon_2)|\Delta z|$$
$\Delta z=\Delta x+i\Delta y$로 나누면 $\dfrac{\Delta f}{\Delta z}=u_x+iv_x+(\varepsilon_1+i\varepsilon_2)\dfrac{|\Delta z|}{\Delta z}$이고, 마지막 항의 크기는 $|\varepsilon_1+i\varepsilon_2|\to0$이므로 $f'=u_x+iv_x$가 존재합니다.` },
  { ch: 'ch12', id: 'cr-polar', title: '극좌표 코시–리만 방정식', keys: ['코시–리만 방정식'],
    tags: 'cauchy riemann polar form 코시 리만 극좌표',
    stmt: R`$u_r=\dfrac1rv_\theta$, $v_r=-\dfrac1ru_\theta$.`,
    body: R`
$x=r\cos\theta$, $y=r\sin\theta$에서 연쇄법칙으로
$$u_r=u_x\cos\theta+u_y\sin\theta,\qquad u_\theta=r(-u_x\sin\theta+u_y\cos\theta)$$
$v$도 같습니다. 직교좌표 코시–리만 방정식 $v_x=-u_y$, $v_y=u_x$를 쓰면
$$v_\theta=r(-v_x\sin\theta+v_y\cos\theta)=r(u_y\sin\theta+u_x\cos\theta)=ru_r$$
$$v_r=v_x\cos\theta+v_y\sin\theta=-u_y\cos\theta+u_x\sin\theta=-\frac1ru_\theta$$` },
  { ch: 'ch12', id: 'harmonic', title: '해석함수의 실수부·허수부는 조화함수', keys: ['코시–리만 방정식'],
    tags: 'harmonic function conjugate laplace equation 조화함수 켤레 라플라스',
    stmt: R`$f=u+iv$가 해석적이면 $\nabla^2u=\nabla^2v=0$이고, 단순연결 영역의 조화함수 $u$는 켤레 조화함수 $v$를 가진다.`,
    body: R`
해석함수는 무한 번 미분 가능하므로(13단원 도함수 공식) 2계 편도함수가 연속입니다. 코시–리만 방정식을 미분하면
$$u_{xx}=v_{yx},\qquad u_{yy}=-v_{xy}$$
혼합편미분의 순서를 바꿀 수 있으므로 $u_{xx}+u_{yy}=0$. $v$도 같습니다.

**켤레 조화함수.** $v_x=-u_y$, $v_y=u_x$를 만족하는 $v$를 찾는 것은 $-u_y\,dx+u_x\,dy$가 전미분인지의 문제입니다. 완전성 조건 $\partial_y(-u_y)=\partial_x(u_x)$는 곧 $\nabla^2u=0$이므로, 단순연결 영역에서는 $v$가 존재합니다(1단원 완전미분, 9단원 경로 독립).` },
  { ch: 'ch12', id: 'exp', title: '복소 지수·삼각함수의 성질', keys: ['기본 초월함수'],
    tags: 'complex exponential euler formula cosine sine hyperbolic periodic 복소 지수함수 오일러 공식 삼각함수 주기',
    stmt: R`$e^z=e^x(\cos y+i\sin y)$는 전평면에서 해석적이고 $(e^z)'=e^z$, $e^{z_1+z_2}=e^{z_1}e^{z_2}$, $e^z\ne0$, 주기 $2\pi i$이다. 또 $\cos z=\cos x\cosh y-i\sin x\sinh y$, $\sin z=\sin x\cosh y+i\cos x\sinh y$.`,
    body: R`
$u=e^x\cos y$, $v=e^x\sin y$는 $u_x=e^x\cos y=v_y$, $u_y=-e^x\sin y=-v_x$를 만족하므로 해석적이고 $(e^z)'=u_x+iv_x=e^z$.

지수법칙은 실수 지수법칙과 삼각함수 덧셈정리(= 극형식의 곱셈)에서 나옵니다. $|e^z|=e^x>0$이므로 0이 되지 않고, $\cos$, $\sin$의 주기 $2\pi$ 때문에 $e^{z+2\pi i}=e^z$.

$iz=-y+ix$이므로 $e^{iz}=e^{-y}(\cos x+i\sin x)$, $e^{-iz}=e^{y}(\cos x-i\sin x)$. 더해서 2로 나누면
$$\cos z=\cos x\,\frac{e^{y}+e^{-y}}2-i\sin x\,\frac{e^{y}-e^{-y}}2=\cos x\cosh y-i\sin x\sinh y$$
$\sin z=\frac{e^{iz}-e^{-iz}}{2i}$도 같은 계산입니다. $|\cos z|^2=\cos^2x+\sinh^2y$라 $y\to\infty$에서 유계가 아닙니다.` },
  { ch: 'ch12', id: 'log', title: '복소 로그와 일반 거듭제곱', keys: ['로그와 거듭제곱'],
    tags: 'complex logarithm principal value general power i^i 복소 로그 주값 일반 거듭제곱',
    stmt: R`$e^w=z$ ($z\ne0$)의 해는 $w=\ln|z|+i\arg z$ (무한히 많음)이고, $z^c=e^{c\ln z}$이다.`,
    body: R`
$w=u+iv$로 두면 $e^w=e^ue^{iv}$이고, 이것이 $z=|z|e^{i\arg z}$와 같으려면 크기와 편각을 각각 맞춰야 합니다.
$$e^u=|z|\ \Rightarrow\ u=\ln|z|,\qquad v=\arg z=\Arg z+2n\pi$$
따라서 $\ln z=\ln|z|+i\arg z$. 정의상 $e^{\ln z}=z$이지만, $\ln(e^z)$는 $z+2n\pi i$ 중 하나입니다.

$z^c=e^{c\ln z}$는 $\ln z$의 선택에 따라 값이 여러 개입니다. 예: $i^i=e^{i\ln i}=e^{i\cdot i(\pi/2+2n\pi)}=e^{-\pi/2-2n\pi}$.

$\Ln(z_1z_2)\ne\Ln z_1+\Ln z_2$인 예: $z_1=z_2=-1$이면 좌변은 $\Ln1=0$, 우변은 $2\pi i$.` },
  // ───── 13
  { ch: 'ch13', id: 'basic-integral', title: R`$\oint(z-z_0)^m\,dz$의 계산`, keys: ['가장 중요한 적분'],
    tags: 'basic contour integral circle 1/z 기본 적분 원',
    stmt: R`$\displaystyle\oint_{|z-z_0|=\rho}(z-z_0)^m\,dz=2\pi i\ (m=-1)$, $0\ (m\ne-1$인 정수$)$.`,
    body: R`
$z=z_0+\rho e^{it}$ ($0\le t\le2\pi$)로 두면 $dz=i\rho e^{it}dt$이므로
$$\oint(z-z_0)^mdz=\int_0^{2\pi}\rho^me^{imt}\,i\rho e^{it}\,dt=i\rho^{m+1}\int_0^{2\pi}e^{i(m+1)t}dt$$
$m=-1$이면 피적분함수가 1이라 $2\pi i$. $m\ne-1$이면 $e^{i(m+1)t}$가 정확히 $|m+1|$주기를 돌아 적분이 0입니다. $m\ge0$이면 코시 정리로도, $m\le-2$이면 원시함수 $\frac{(z-z_0)^{m+1}}{m+1}$이 한 값 함수라는 점으로도 설명됩니다.` },
  { ch: 'ch13', id: 'ml', title: 'ML 부등식', keys: ['가장 중요한 적분'],
    tags: 'ML inequality estimate bound ML 부등식 적분 추정',
    stmt: R`$C$ 위에서 $|f|\le M$이고 $C$의 길이가 $L$이면 $\Big|\displaystyle\int_Cf\,dz\Big|\le ML$.`,
    body: R`
복소수값 함수 $g$에 대해 $\big|\int g\,dt\big|\le\int|g|\,dt$입니다. ($\int g=Re^{i\alpha}$라 두면 $R=\int\Re(e^{-i\alpha}g)\,dt\le\int|g|\,dt$.) 따라서
$$\Big|\int_Cf\,dz\Big|=\Big|\int_a^bf(z(t))z'(t)\,dt\Big|\le\int_a^b|f||z'|\,dt\le M\int_a^b|z'|\,dt=ML$$` },
  { ch: 'ch13', id: 'cauchy-thm', title: '코시 적분 정리', keys: ['코시 적분 정리'],
    tags: 'cauchy integral theorem green goursat 코시 적분 정리 그린 구르사',
    sketch: R`$f'$이 연속이라는 가정 아래 그린 정리로 증명합니다(코시의 원래 증명). 이 가정 없이 증명한 것이 구르사 정리입니다.`,
    stmt: R`$f$가 단순연결 영역 $D$에서 해석적이면 $D$ 안의 모든 단순닫힌경로 $C$에 대해 $\oint_Cf\,dz=0$.`,
    body: R`
$f\,dz=(u+iv)(dx+i\,dy)=(u\,dx-v\,dy)+i(v\,dx+u\,dy)$입니다. 그린 정리를 각각 적용하면 ($R$은 $C$의 내부)
$$\oint_C(u\,dx-v\,dy)=\iint_R(-v_x-u_y)\,dx\,dy,\qquad \oint_C(v\,dx+u\,dy)=\iint_R(u_x-v_y)\,dx\,dy$$
코시–리만 방정식 $u_y=-v_x$, $u_x=v_y$에 의해 두 피적분함수가 모두 0입니다.` },
  { ch: 'ch13', id: 'deformation', title: '경로 변형 원리', keys: ['코시 적분 정리'],
    tags: 'deformation of path multiply connected 경로 변형 다중연결',
    stmt: R`$C_2$가 $C_1$ 안에 있고 $f$가 두 경로 사이의 고리 영역(과 경로 위)에서 해석적이면 $\oint_{C_1}f\,dz=\oint_{C_2}f\,dz$ (같은 방향).`,
    body: R`
두 경로를 선분 두 개로 이어 고리 영역을 단순연결인 두 조각으로 자릅니다. 각 조각의 경계를 따라 코시 정리를 쓰고 더하면, 자른 선분은 양 방향으로 한 번씩 지나므로 적분이 상쇄되어
$$\oint_{C_1}f\,dz-\oint_{C_2}f\,dz=0$$
($C_2$는 바깥 경계와 반대 방향으로 돌기 때문에 빼기). 특이점 여러 개를 감싸는 경로도 같은 방법으로 특이점마다의 작은 원들의 합으로 바꿀 수 있습니다.` },
  { ch: 'ch13', id: 'cauchy-formula', title: '코시 적분 공식', keys: ['코시 적분 공식'],
    tags: 'cauchy integral formula 코시 적분 공식',
    stmt: R`$f$가 $C$ 위와 내부에서 해석적이고 $z_0$가 $C$ 내부이면 $f(z_0)=\dfrac1{2\pi i}\displaystyle\oint_C\frac{f(z)}{z-z_0}dz$.`,
    body: R`
$\frac{f(z)}{z-z_0}$는 $z_0$ 밖에서 해석적이므로 경로 변형 원리로 $C$를 작은 원 $|z-z_0|=\rho$로 바꿀 수 있습니다.
$$\oint\frac{f(z)}{z-z_0}dz=f(z_0)\oint\frac{dz}{z-z_0}+\oint\frac{f(z)-f(z_0)}{z-z_0}dz=2\pi i\,f(z_0)+I$$
ML 부등식으로
$$|I|\le\frac{\max_{|z-z_0|=\rho}|f(z)-f(z_0)|}{\rho}\cdot2\pi\rho=2\pi\max|f(z)-f(z_0)|\xrightarrow{\rho\to0}0$$
($f$의 연속성). 좌변과 $2\pi if(z_0)$는 $\rho$와 무관하므로 $I=0$입니다.` },
  { ch: 'ch13', id: 'derivative-formula', title: '해석함수의 도함수 공식', keys: ['도함수 공식'],
    tags: 'derivative formula higher derivatives infinitely differentiable 도함수 공식 무한 번 미분',
    sketch: R`$n=1$을 보이고, 같은 계산을 반복하면(귀납법) 일반 $n$이 됩니다.`,
    stmt: R`$f^{(n)}(z_0)=\dfrac{n!}{2\pi i}\displaystyle\oint_C\frac{f(z)}{(z-z_0)^{n+1}}dz$. 특히 해석함수는 무한 번 미분 가능하다.`,
    body: R`
코시 적분 공식으로
$$\frac{f(z_0+\Delta)-f(z_0)}{\Delta}=\frac1{2\pi i}\oint_C\frac{f(z)}{(z-z_0-\Delta)(z-z_0)}dz$$
이것과 $\frac1{2\pi i}\oint\frac{f(z)}{(z-z_0)^2}dz$의 차는
$$\frac{\Delta}{2\pi i}\oint_C\frac{f(z)}{(z-z_0-\Delta)(z-z_0)^2}dz$$
$z_0$에서 $C$까지의 거리를 $d$, $C$ 위에서 $|f|\le M$이라 하면 ML 부등식으로 크기가 $\frac{|\Delta|ML}{2\pi(d-|\Delta|)d^2}\to0$입니다. 따라서 $f'(z_0)=\frac1{2\pi i}\oint\frac{f}{(z-z_0)^2}dz$.

이 식의 우변도 $z_0$에 대해 같은 방법으로 미분할 수 있으므로 $f''$이 존재하고, 반복하면 모든 계의 도함수가 존재합니다.` },
  { ch: 'ch13', id: 'liouville', title: '코시 부등식과 리우빌 정리', keys: ['도함수 공식'],
    tags: 'cauchy inequality liouville theorem entire bounded fundamental theorem of algebra 코시 부등식 리우빌 정함수 유계 대수학의 기본정리',
    stmt: R`반지름 $r$인 원 위에서 $|f|\le M$이면 $|f^{(n)}(z_0)|\le\dfrac{n!M}{r^n}$. 유계인 정함수는 상수이다.`,
    body: R`
도함수 공식과 ML 부등식에서
$$|f^{(n)}(z_0)|\le\frac{n!}{2\pi}\cdot\frac{M}{r^{n+1}}\cdot2\pi r=\frac{n!M}{r^n}$$

**리우빌.** 정함수가 모든 곳에서 $|f|\le M$이면 임의의 $r$에 대해 $|f'(z_0)|\le M/r$입니다. $r\to\infty$로 보내면 $f'(z_0)=0$이고, $z_0$는 아무 점이나 되므로 $f$는 상수입니다.

응용: 다항식 $p$가 근이 없다면 $1/p$는 유계인 정함수가 되어 상수여야 하므로 모순입니다. 이것이 대수학의 기본정리의 한 증명입니다.` },
  // ───── 14
  { ch: 'ch14', id: 'ratio', title: '수렴반경의 비 공식', keys: ['수렴반경'],
    tags: 'radius of convergence ratio test power series 수렴반경 비판정법 멱급수',
    stmt: R`$\lim|a_n/a_{n+1}|=R$이 존재하면 $\sum a_n(z-z_0)^n$은 $|z-z_0|<R$에서 수렴, $>R$에서 발산한다.`,
    body: R`
비판정법을 항의 절댓값에 적용합니다.
$$\left|\frac{a_{n+1}(z-z_0)^{n+1}}{a_n(z-z_0)^n}\right|=\left|\frac{a_{n+1}}{a_n}\right||z-z_0|\to\frac{|z-z_0|}{R}$$
이 극한이 1보다 작으면 절대수렴, 크면 항이 0으로 가지 않아 발산합니다.

항별로 미분한 급수 $\sum na_n(z-z_0)^{n-1}$의 비는 $\frac{n}{n+1}\left|\frac{a_n}{a_{n+1}}\right|\to R$이므로 수렴반경이 같습니다.` },
  { ch: 'ch14', id: 'taylor', title: '테일러 정리: 해석함수는 멱급수로 전개된다', keys: ['테일러 정리', '기본 매클로린 급수', '수렴반경'],
    tags: 'taylor theorem analytic power series expansion geometric series 테일러 정리 해석함수 멱급수 전개 등비급수',
    stmt: R`$f$가 $|z-z_0|<r$에서 해석적이면 그 원판에서 $f(z)=\sum\frac{f^{(n)}(z_0)}{n!}(z-z_0)^n$이 성립한다. 따라서 수렴반경은 가장 가까운 특이점까지의 거리 이상이다.`,
    body: R`
$|z-z_0|<r'<r$인 원 $C$를 잡고 코시 적분 공식을 씁니다. $C$ 위의 $w$에 대해 $q=\frac{z-z_0}{w-z_0}$, $|q|<1$이므로
$$\frac1{w-z}=\frac1{w-z_0}\cdot\frac1{1-q}=\sum_{n=0}^\infty\frac{(z-z_0)^n}{(w-z_0)^{n+1}}$$
이 급수는 $C$ 위에서 고르게 수렴하므로 항별 적분이 가능하고
$$f(z)=\frac1{2\pi i}\oint_C\frac{f(w)}{w-z}dw=\sum_{n=0}^\infty(z-z_0)^n\cdot\frac1{2\pi i}\oint_C\frac{f(w)}{(w-z_0)^{n+1}}dw=\sum\frac{f^{(n)}(z_0)}{n!}(z-z_0)^n$$
(마지막은 도함수 공식). $r$은 특이점을 만나기 전까지 얼마든지 키울 수 있습니다.

기본 급수: $e^z$는 모든 계의 도함수가 $e^z$라 계수가 $\frac1{n!}$. $\frac1{1-z}$는 등비급수. $\sin z$, $\cos z$는 $e^{\pm iz}$의 급수를 더하고 빼서 얻습니다.` },
  { ch: 'ch14', id: 'laurent', title: '로랑 급수와 계수 $b_1$', keys: ['로랑 급수'],
    tags: 'laurent series annulus principal part coefficient 로랑 급수 고리 영역 주요부 계수',
    sketch: R`고리 영역에서의 코시 적분 공식을 두 개의 등비급수로 전개하는 증명의 핵심입니다.`,
    stmt: R`고리 영역 $r_2<|z-z_0|<r_1$에서 해석적인 $f$는 $\sum a_n(z-z_0)^n+\sum b_n(z-z_0)^{-n}$으로 전개되고 $b_n=\frac1{2\pi i}\oint f(w)(w-z_0)^{n-1}dw$. 특히 $b_1=\frac1{2\pi i}\oint_Cf\,dz$.`,
    body: R`
경로 변형(자르기)을 쓰면 고리 안의 $z$에 대해 바깥 원 $C_1$, 안쪽 원 $C_2$ (둘 다 반시계)로
$$f(z)=\frac1{2\pi i}\oint_{C_1}\frac{f(w)}{w-z}dw-\frac1{2\pi i}\oint_{C_2}\frac{f(w)}{w-z}dw$$
- $C_1$ 위에서는 $|z-z_0|<|w-z_0|$이라 테일러 정리와 같은 전개로 $\sum a_n(z-z_0)^n$.
- $C_2$ 위에서는 $|w-z_0|<|z-z_0|$이므로
$$-\frac1{w-z}=\frac1{(z-z_0)-(w-z_0)}=\sum_{n=1}^\infty\frac{(w-z_0)^{n-1}}{(z-z_0)^n}$$
이를 넣고 항별 적분하면 $b_n$ 공식이 나옵니다. $n=1$이면 $b_1=\frac1{2\pi i}\oint f\,dw$.

어떤 방법으로 구하든 수렴하는 로랑 급수는 하나뿐입니다(급수에 $(z-z_0)^{-k-1}$을 곱해 적분하면 기본 적분에 의해 계수가 하나만 남음). 그래서 등비급수로 구한 전개가 곧 로랑 급수입니다.` },
  { ch: 'ch14', id: 'zeros-poles', title: '영점의 위수와 극의 위수', keys: [],
    tags: 'zero order pole order removable singularity 영점 위수 극 제거가능 특이점',
    stmt: R`$f$가 $z_0$에서 $n$위 영점을 가지면 $1/f$는 $z_0$에서 $n$위 극을 가진다.`,
    body: R`
테일러 전개에서 처음 $n$개 계수가 0이므로 $f(z)=(z-z_0)^ng(z)$, $g$는 해석적이고 $g(z_0)=\frac{f^{(n)}(z_0)}{n!}\ne0$입니다. $g$는 연속이라 $z_0$ 근처에서 0이 아니고, $1/g$는 해석적이며 $1/g(z_0)\ne0$입니다.
$$\frac1f=\frac{1}{(z-z_0)^n}\cdot\frac1{g(z)}=\frac{1}{(z-z_0)^n}\Big(c_0+c_1(z-z_0)+\cdots\Big),\qquad c_0\ne0$$
주요부의 최고차가 $(z-z_0)^{-n}$이므로 $n$위 극입니다. 같은 이유로 $\frac{h}{f}$ ($h(z_0)\ne0$)도 $n$위 극입니다.` },
  { ch: 'ch14', id: 'residue-thm', title: '유수 정리', keys: ['유수 계산과 유수 정리'],
    tags: 'residue theorem contour integral 유수 정리 닫힌 경로 적분',
    stmt: R`$f$가 $C$ 위와 내부에서 유한 개의 특이점 $z_1,\dots,z_k$를 제외하고 해석적이면 $\oint_Cf\,dz=2\pi i\sum_j\Res_{z=z_j}f$.`,
    body: R`
경로 변형 원리로 $C$를 각 특이점 주위의 작은 원 $C_j$들의 합으로 바꿉니다.
$$\oint_Cf\,dz=\sum_j\oint_{C_j}f\,dz$$
$C_j$ 위에서 $f$는 $z_j$ 중심 로랑 급수로 쓰이고, 항별 적분하면 기본 적분 $\oint(z-z_j)^mdz$에 의해 $b_1(z-z_j)^{-1}$ 항만 $2\pi i\,b_1$을 남깁니다. 따라서 $\oint_{C_j}f\,dz=2\pi i\Res_{z_j}f$이고, 더하면 정리입니다.` },
  { ch: 'ch14', id: 'residue-formulas', title: '유수 계산 공식', keys: ['유수 계산과 유수 정리'],
    tags: 'residue formula simple pole higher order pole p/q\' 유수 공식 단순극 고위 극',
    stmt: R`$m$위 극에서 $\Res f=\frac1{(m-1)!}\lim\frac{d^{m-1}}{dz^{m-1}}\big[(z-z_0)^mf\big]$. 단순극이면 $\lim(z-z_0)f$, $f=p/q$ ($q$의 단순 영점)이면 $p(z_0)/q'(z_0)$.`,
    body: R`
$m$위 극에서 로랑 급수는
$$f=\frac{b_m}{(z-z_0)^m}+\cdots+\frac{b_1}{z-z_0}+a_0+a_1(z-z_0)+\cdots$$
$(z-z_0)^m$을 곱하면 해석함수
$$(z-z_0)^mf=b_m+\cdots+b_1(z-z_0)^{m-1}+a_0(z-z_0)^m+\cdots$$
가 되고, 구하는 $b_1$은 이 테일러 급수의 $(z-z_0)^{m-1}$ 계수이므로 $\frac1{(m-1)!}\times$($m-1$계 도함수의 $z_0$에서의 값)입니다.

$m=1$이면 $b_1=\lim(z-z_0)f$. $f=p/q$, $q(z_0)=0\ne q'(z_0)$이면
$$(z-z_0)\frac{p}{q}=\frac{p(z)}{\big(q(z)-q(z_0)\big)/(z-z_0)}\to\frac{p(z_0)}{q'(z_0)}$$` },
  { ch: 'ch14', id: 'real-integrals', title: '유수로 실적분 계산하기: 세 유형의 근거', keys: ['실적분의 세 유형'],
    tags: 'real integral residue semicircle jordan lemma trigonometric improper fourier 실적분 유수 반원 조르당 보조정리 삼각함수 이상적분',
    stmt: R`삼각함수 적분은 단위원으로, 유리함수의 이상적분과 푸리에형 적분은 위쪽 반원으로 닫아 유수 정리로 계산할 수 있다.`,
    body: R`
**유형 1.** $z=e^{i\theta}$이면 $\theta$가 $0\to2\pi$일 때 $z$는 단위원을 반시계로 한 바퀴 돌고, $dz=iz\,d\theta$, $\cos\theta=\frac{z+z^{-1}}2$, $\sin\theta=\frac{z-z^{-1}}{2i}$. 적분이 단위원 위의 복소적분이 되므로 원 안의 유수만 셉니다.

**유형 2.** 선분 $[-R,R]$과 위쪽 반원 $S_R$로 닫습니다. $R$이 크면 위쪽 반평면의 극이 모두 안에 있으므로 전체 적분은 $2\pi i\sum\Res$. $\deg q\ge\deg p+2$이면 큰 $|z|$에서 $|f|\le k/|z|^2$이라
$$\Big|\int_{S_R}f\,dz\Big|\le\frac{k}{R^2}\cdot\pi R\to0$$
따라서 $\int_{-R}^Rf\,dx\to2\pi i\sum\Res$.

**유형 3.** $f(z)e^{isz}$ ($s>0$)를 씁니다. 위쪽 반평면에서 $|e^{isz}|=e^{-sy}\le1$이므로 $\deg q\ge\deg p+2$면 유형 2와 같고, $\deg q=\deg p+1$이면 조르당 보조정리를 씁니다. $[0,\pi/2]$에서 $\sin\theta\ge\frac{2\theta}\pi$이므로
$$\int_0^\pi e^{-sR\sin\theta}d\theta\le2\int_0^{\pi/2}e^{-2sR\theta/\pi}d\theta<\frac{\pi}{sR}$$
따라서 $\big|\int_{S_R}\big|\le\frac kR\cdot R\cdot\frac\pi{sR}\to0$. 실수축 위에서 $e^{isx}=\cos sx+i\sin sx$이므로 결과의 실수부가 코사인 적분, 허수부가 사인 적분입니다.` },
  );
})();
