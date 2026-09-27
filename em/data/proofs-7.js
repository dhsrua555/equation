/* 증명 — 11 편미분방정식 보충, 15 등각사상, 16 퍼텐셜 이론 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01·02 (보충)
  { ch: 'ch01', id: 'euler-method', title: '오일러 방법의 오차', keys: ['오일러 방법'],
    tags: 'euler method error local global truncation taylor numerical 오일러 방법 오차 수치해법 테일러',
    stmt: R`해 $y$가 두 번 연속 미분가능하고 $f$가 $y$에 대해 립시츠 조건을 만족하면, 오일러 방법 $y_{n+1}=y_n+hf(x_n,y_n)$의 한 걸음 오차는 $O(h^2)$, 고정된 구간 $[x_0,X]$에서의 전체 오차는 $O(h)$이다.`,
    body: R`
**증명에 쓰는 도구 세 가지.**
- **$O(h^p)$ 기호**: $h\to0$일 때 크기가 $Ch^p$ 이하로 줄어드는 양입니다($C$는 $h$와 무관한 상수). 오차가 $O(h)$이면 $h$를 반으로 줄일 때 오차도 대략 반, $O(h^2)$이면 대략 4분의 1이 됩니다. [[@base:ch01:1.1|O 기호.]]
- **나머지항이 있는 테일러 정리**(미적분학): $y$가 두 번 미분가능하면 $x$와 $x+h$ 사이의 어떤 점 $\xi$(크사이)에서 $y(x+h)=y(x)+hy'(x)+\tfrac12h^2y''(\xi)$가 성립합니다. 앞의 두 항이 접선으로 어림한 값이고, 마지막 항은 곡선이 휘어서 생기는 차이입니다. 평균값 정리 $y(x+h)=y(x)+hy'(\xi)$를 한 차수 늘린 것입니다. [[@base:ch01:1.3|테일러 정리와 나머지항.]]
- **립시츠 조건**(1.7절): $\lvert f(x,y)-f(x,z)\rvert\le L\lvert y-z\rvert$. $y$ 값이 $\delta$만큼 틀려도 기울기 $f$는 많아야 $L\delta$만큼만 틀린다는 뜻입니다. $\lvert f_y\rvert\le L$이면 평균값 정리로 성립합니다. [[@base:ch05:5.1|립시츠 조건과 그론월 부등식.]]

**한 걸음 오차.** 정확한 해에 테일러 정리를 쓰고 $y'=f(x,y)$를 대입하면
$$y(x_{n+1})=y(x_n)+hf\big(x_n,y(x_n)\big)+\frac{h^2}{2}y''(\xi_n)$$
오일러 방법은 앞의 두 항만 쓰므로, 정확한 값에서 출발한 한 걸음의 오차는 $\tfrac12h^2y''(\xi_n)$입니다. 구간에서 $\lvert y''\rvert\le M$이면 그 크기는 $\tfrac12Mh^2$ 이하, 곧 $O(h^2)$입니다.

**전체 오차.** 실제 계산은 앞 걸음들의 오차를 안고 출발합니다. $e_n=y(x_n)-y_n$이라 하고 위 식에서 오일러 식을 빼면
$$e_{n+1}=e_n+h\big[f(x_n,y(x_n))-f(x_n,y_n)\big]+\frac{h^2}{2}y''(\xi_n)$$
대괄호에 립시츠 조건을 쓰면
$$\lvert e_{n+1}\rvert\le(1+hL)\lvert e_n\rvert+\frac{M}{2}h^2$$
한 걸음마다 이전 오차는 많아야 $(1+hL)$배로 불어나고, 새 오차가 $\tfrac12Mh^2$ 이하로 더해집니다. $e_0=0$에서 $N=(X-x_0)/h$번 반복하면 등비급수의 합으로
$$\lvert e_N\rvert\le\frac{M}{2}h^2\cdot\frac{(1+hL)^N-1}{hL}\le\frac{Mh}{2L}\left(e^{L(X-x_0)}-1\right)$$
마지막 단계에서는 $1+u\le e^u$에서 나오는 $(1+hL)^N\le e^{hLN}=e^{L(X-x_0)}$을 썼습니다. 오른쪽은 ($h$와 무관한 상수)$\times h$이므로 전체 오차는 $O(h)$입니다.

직관적으로는 $N$번 걸으면서 한 번에 $O(h^2)$씩 쌓여 $N\cdot O(h^2)=O(h)$가 되는 것이고, 립시츠 조건은 쌓인 오차가 걸음마다 폭주하지 않고 $e^{L(X-x_0)}$배 안에 머문다는 것을 보장합니다.

그래서 $h$를 반으로 줄이면 전체 오차도 대략 반으로 줄어듭니다. 개량 오일러 방법과 룽게-쿠타 방법은 테일러 전개의 더 높은 차수 항까지 맞춰서 전체 오차를 각각 $O(h^2)$, $O(h^4)$로 줄입니다.` },
  { ch: 'ch01', id: 'orthogonal-traj', title: '직교 궤적의 미분방정식', keys: ['직교 궤적 구하기'],
    tags: 'orthogonal trajectories slope perpendicular family of curves 직교 궤적 곡선족 기울기 수직',
    stmt: R`곡선족이 ODE $y'=f(x,y)$를 만족하면 그 직교 궤적은 $\tilde y'=-1/f(x,\tilde y)$를 만족한다.`,
    body: R`
점 $(x,y)$를 지나는 곡선족의 곡선의 접선 방향은 $(1,f)$입니다. 같은 점을 지나는 다른 곡선이 이와 직교하려면 접선 방향 $(1,\tilde y')$와의 내적이 0이어야 합니다.
$$1\cdot1+f\cdot\tilde y'=0\quad\Longrightarrow\quad\tilde y'=-\frac1{f(x,y)}$$
기울기로 말하면 $m_1m_2=-1$입니다.

**$c$를 먼저 소거하는 이유.** 곡선족 $G(x,y,c)=0$을 미분한 식에는 보통 $c$가 남는데, 직교 조건은 **각 점에서의** 기울기로 써야 하므로 $c$를 $x,y$로 바꿔 소거해야 합니다. 그래야 $f$가 점 $(x,y)$만의 함수가 됩니다.

**$f=0$인 점.** 곡선족의 접선이 수평이면 궤적은 수직이 되므로 $\frac{dx}{dy}=0$으로 따로 다룹니다.` },
  { ch: 'ch02', id: 'rlc', title: 'RLC 회로의 방정식과 정상상태 전류', keys: ['RLC 회로와 역학계의 대응'],
    tags: 'rlc circuit kirchhoff steady state current impedance reactance resonance analogy RLC 회로 키르히호프 정상상태 임피던스 리액턴스',
    stmt: R`$LI''+RI'+I/C=E'(t)$이고, $E=E_0\sin\omega t$일 때 정상상태 전류의 진폭은 $I_0=E_0/\sqrt{R^2+S^2}$, $S=\omega L-\frac1{\omega C}$이다.`,
    body: R`
**방정식.** 키르히호프 전압 법칙: 각 소자의 전압 강하의 합 = 기전력. 저항 $RI$, 인덕터 $LI'$, 콘덴서 $Q/C$ ($Q=\int I\,dt$).
$$LI'+RI+\frac1C\int I\,dt=E(t)$$
미분하면 $LI''+RI'+\frac1CI=E'(t)$. $Q'=I$로 쓰면 $LQ''+RQ'+\frac1CQ=E(t)$. 이것은 $my''+cy'+ky=F(t)$와 같은 꼴이므로 $m\leftrightarrow L$, $c\leftrightarrow R$, $k\leftrightarrow1/C$가 대응합니다.

**정상상태.** $E'=\omega E_0\cos\omega t$이므로 $I_p=a\cos\omega t+b\sin\omega t$로 두고 대입합니다. $\cos\omega t$의 계수는 $\omega\big[(\tfrac1{\omega C}-\omega L)a+Rb\big]$, $\sin\omega t$의 계수는 $\omega\big[(\tfrac1{\omega C}-\omega L)b-Ra\big]$이므로 $S=\omega L-\frac1{\omega C}$로 쓰면
$$-Sa+Rb=E_0,\qquad Ra+Sb=0$$
풀면 $a=\dfrac{-E_0S}{R^2+S^2}$, $b=\dfrac{E_0R}{R^2+S^2}$. 진폭 $I_0=\sqrt{a^2+b^2}=\dfrac{E_0}{\sqrt{R^2+S^2}}$이고 $I_p=I_0\sin(\omega t-\theta)$, $\tan\theta=\dfrac{-a}{b}=\dfrac SR$.

$\sqrt{R^2+S^2}$을 **임피던스**라 하며, $S=0$ ($\omega=1/\sqrt{LC}$)일 때 최소가 되어 전류가 최대(공진)입니다.` },
  // ───── 09 (보충)
  { ch: 'ch09', id: 'green-identities', title: '그린 항등식과 라플라스 방정식의 해의 유일성', keys: ['그린 항등식과 유일성'],
    tags: 'green identities first second uniqueness dirichlet laplace harmonic divergence theorem 그린 항등식 유일성 디리클레 라플라스 조화함수',
    stmt: R`$\iiint(f\nabla^2g+\nabla f\cdot\nabla g)\,dV=\oiint f\,\partial g/\partial n\,dA$이고, 라플라스 방정식의 디리클레 문제의 해는 유일하다.`,
    body: R`
**제1 항등식.** $\mathbf F=f\nabla g$에 곱의 미분 공식을 쓰면
$$\operatorname{div}(f\nabla g)=f\nabla^2g+\nabla f\cdot\nabla g$$
발산 정리에서 $\mathbf F\cdot\mathbf n=f\,\nabla g\cdot\mathbf n=f\dfrac{\partial g}{\partial n}$이므로 제1 항등식이 나옵니다.

**제2 항등식.** $f$와 $g$의 역할을 바꾼 식을 빼면 $\nabla f\cdot\nabla g$ 항이 소거됩니다.

**조화함수가 경계에서 0이면 0이다.** $\nabla^2f=0$, $S$ 위에서 $f=0$일 때 제1 항등식에 $g=f$를 넣으면
$$\iiint_T|\nabla f|^2\,dV=\oiint_Sf\frac{\partial f}{\partial n}\,dA=0$$
$|\nabla f|^2\ge0$이 연속이므로 $T$에서 $\nabla f=\mathbf 0$, 즉 $f$는 상수이고 경계값이 0이므로 $f\equiv0$.

**유일성.** 두 해 $f_1,f_2$가 같은 경계값을 가지면 $f=f_1-f_2$는 조화함수이고 경계에서 0이므로 $f\equiv0$.` },
  // ───── 11 (보충)
  { ch: 'ch11', id: 'superposition', title: '중첩 원리', keys: ['중첩 원리 (교재 Theorem 1)'],
    tags: 'superposition principle linear homogeneous pde 중첩 원리 선형 동차',
    stmt: R`$u_1,u_2$가 선형 동차 PDE의 해이면 $c_1u_1+c_2u_2$도 해이다.`,
    body: R`
선형 동차 PDE는 선형 미분연산자 $L$로 $L[u]=0$ 꼴로 쓸 수 있습니다. 예: 열방정식은 $L[u]=u_t-c^2u_{xx}$.

편미분은 선형이므로 $L[c_1u_1+c_2u_2]=c_1L[u_1]+c_2L[u_2]=0+0=0$.

**무한급수로 확장할 때의 조건.** 변수분리 해를 무한히 더한 $u=\sum u_n$이 해가 되려면 급수가 수렴하고, 필요한 계수까지 항별 미분이 허용되어야 합니다(예: 도함수 급수가 고르게 수렴). 교재의 풀이들은 이 조건을 가정하고 진행합니다.` },
  { ch: 'ch11', id: 'heat-infinite', title: '무한 막대의 열방정식 해 (가우스 핵)', keys: ['무한 막대의 열방정식'],
    tags: 'heat equation infinite rod fourier integral gaussian kernel 무한 막대 열방정식 푸리에 적분 가우스 핵',
    stmt: R`$u_t=c^2u_{xx}$ ($-\infty<x<\infty$), $u(x,0)=f(x)$의 해는 $u=\dfrac1{2c\sqrt{\pi t}}\displaystyle\int_{-\infty}^\infty f(v)\,e^{-(x-v)^2/(4c^2t)}dv$.`,
    body: R`
**변수분리.** $u=F(x)G(t)$를 넣으면 $F''+p^2F=0$, $\dot G+c^2p^2G=0$. 경계가 없으므로 $p$는 모든 양수가 허용되고
$$u(x,t;p)=\big(A(p)\cos px+B(p)\sin px\big)e^{-c^2p^2t}$$
**합 대신 적분으로 중첩합니다.**
$$u(x,t)=\int_0^\infty\big(A(p)\cos px+B(p)\sin px\big)e^{-c^2p^2t}\,dp$$
$t=0$에서 이것이 $f$의 푸리에 적분이어야 하므로 $A(p)=\frac1\pi\int f(v)\cos pv\,dv$, $B(p)=\frac1\pi\int f(v)\sin pv\,dv$. 대입하면 $\cos px\cos pv+\sin px\sin pv=\cos p(x-v)$이므로
$$u=\frac1\pi\int_{-\infty}^\infty f(v)\Big[\int_0^\infty e^{-c^2p^2t}\cos\big(p(x-v)\big)\,dp\Big]dv$$
**안쪽 적분.** $\int_0^\infty e^{-s^2}\cos2bs\,ds=\frac{\sqrt\pi}2e^{-b^2}$에서 $s=cp\sqrt t$, $b=\frac{x-v}{2c\sqrt t}$로 치환하면
$$\int_0^\infty e^{-c^2p^2t}\cos p(x-v)\,dp=\frac{\sqrt\pi}{2c\sqrt t}\exp\Big(-\frac{(x-v)^2}{4c^2t}\Big)$$
이를 넣고 $\frac1\pi\cdot\frac{\sqrt\pi}{2c\sqrt t}=\frac1{2c\sqrt{\pi t}}$로 정리하면 결과가 나옵니다.`,
    sketch: R`푸리에 적분으로 초기조건을 전개하고, 적분 순서를 바꿔 가우스 적분을 계산합니다.` },
  { ch: 'ch11', id: 'membrane-rect', title: '직사각형 막의 고유진동과 이중 푸리에 급수', keys: ['직사각형 막의 고유진동'],
    tags: 'rectangular membrane double fourier series eigenfrequency separation 직사각형 막 이중 푸리에 급수 고유진동수 변수분리',
    stmt: R`경계가 고정된 $a\times b$ 막의 해는 $\sin\frac{m\pi x}a\sin\frac{n\pi y}b$ 모드의 중첩이고 $\lambda_{mn}=c\pi\sqrt{m^2/a^2+n^2/b^2}$.`,
    body: R`
$u_{tt}=c^2(u_{xx}+u_{yy})$에 $u=F(x,y)G(t)$를 넣으면
$$\ddot G+\lambda^2G=0,\qquad F_{xx}+F_{yy}+\nu^2F=0\quad(\lambda=c\nu)$$
다시 $F=H(x)Q(y)$로 나누면 $H''+k^2H=0$, $Q''+p^2Q=0$, $p^2=\nu^2-k^2$.

**경계조건.** $H(0)=H(a)=0$에서 $k=\frac{m\pi}a$, $H=\sin\frac{m\pi x}a$. $Q(0)=Q(b)=0$에서 $p=\frac{n\pi}b$. 따라서
$$\nu^2=\Big(\frac{m\pi}a\Big)^2+\Big(\frac{n\pi}b\Big)^2,\qquad\lambda_{mn}=c\pi\sqrt{\frac{m^2}{a^2}+\frac{n^2}{b^2}}$$
**초기조건.** $u(x,y,0)=f$이려면 $f=\sum\sum B_{mn}\sin\frac{m\pi x}a\sin\frac{n\pi y}b$. 직교성 $\int_0^a\sin\frac{m\pi x}a\sin\frac{m'\pi x}a\,dx=\frac a2\delta_{mm'}$을 $x$, $y$에 각각 쓰면
$$B_{mn}=\frac4{ab}\int_0^b\!\!\int_0^af\sin\frac{m\pi x}a\sin\frac{n\pi y}b\,dx\,dy$$
$u_t(x,y,0)=g$에서는 같은 식에 $g$를 넣고 $\lambda_{mn}$으로 나눈 것이 $B^*_{mn}$입니다.` },
  { ch: 'ch11', id: 'membrane-circ', title: '원형 막: 베셀 방정식과 푸리에-베셀 계수', keys: ['원형 막'],
    tags: 'circular membrane drum bessel J0 fourier bessel radial 원형 막 북 베셀 푸리에 베셀',
    stmt: R`반지름 $R$인 원형 막의 축대칭 진동은 $J_0(\alpha_mr/R)$ 모드의 중첩이고 $\lambda_m=c\alpha_m/R$.`,
    body: R`
축대칭이면 극좌표 라플라시안에서 $\theta$ 항이 없어져 $u_{tt}=c^2\big(u_{rr}+\frac1ru_r\big)$.

$u=W(r)G(t)$를 넣으면 $\ddot G+(ck)^2G=0$이고
$$W''+\frac1rW'+k^2W=0$$
$s=kr$로 두면 $\frac{d^2W}{ds^2}+\frac1s\frac{dW}{ds}+W=0$, 0차 베셀 방정식입니다. 해 $J_0(s)$와 $Y_0(s)$ 중 $Y_0$는 $r=0$에서 발산하므로 $W=J_0(kr)$.

**경계조건** $u(R,t)=0$: $J_0(kR)=0$, 즉 $kR=\alpha_m$ ($J_0$의 $m$번째 양의 영점). $\lambda_m=ck_m=\frac{c\alpha_m}R$.

**초기조건** $f(r)=\sum A_mJ_0(k_mr)$. 베셀 함수는 스투름-리우빌 문제의 고유함수이므로 가중함수 $r$에 대해 직교하고
$$\int_0^Rr\,J_0(k_mr)J_0(k_nr)\,dr=\begin{cases}0&m\ne n\\ \frac{R^2}2J_1^2(\alpha_m)&m=n\end{cases}$$
양변에 $rJ_0(k_nr)$을 곱해 적분하면 $A_m=\dfrac2{R^2J_1^2(\alpha_m)}\displaystyle\int_0^Rrf(r)J_0(k_mr)\,dr$.` },
  { ch: 'ch11', id: 'sphere-dirichlet', title: '구의 디리클레 문제: 르장드르 방정식의 등장', keys: ['구의 디리클레 문제 (축대칭)'],
    tags: 'sphere dirichlet problem legendre polynomial spherical laplace axisymmetric 구 디리클레 르장드르 구면좌표',
    stmt: R`축대칭 경계값 $f(\phi)$에 대한 구 내부의 퍼텐셜은 $u=\sum A_n(r/R)^nP_n(\cos\phi)$, $A_n=\frac{2n+1}2\int_0^\pi fP_n(\cos\phi)\sin\phi\,d\phi$.`,
    body: R`
구면좌표에서 방위각 $\theta$에 무관하면 라플라스 방정식은
$$\frac{\partial}{\partial r}\Big(r^2\frac{\partial u}{\partial r}\Big)+\frac1{\sin\phi}\frac{\partial}{\partial\phi}\Big(\sin\phi\frac{\partial u}{\partial\phi}\Big)=0$$
$u=G(r)H(\phi)$로 분리하면 공통 상수 $k$에 대해
$$(r^2G')'=kG,\qquad\frac1{\sin\phi}(\sin\phi H')'+kH=0$$
**각 방정식.** $w=\cos\phi$로 바꾸면 $(1-w^2)H''-2wH'+kH=0$. 르장드르 방정식이고 $w=\pm1$ (극)에서 유계인 해는 $k=n(n+1)$일 때의 $P_n(w)$뿐입니다.

**반지름 방정식.** $r^2G''+2rG'-n(n+1)G=0$은 오일러-코시 방정식이고 해는 $r^n$, $r^{-(n+1)}$. 안쪽에서는 원점에서 유계인 $r^n$, 바깥쪽에서는 무한대에서 0으로 가는 $r^{-(n+1)}$을 고릅니다.

**경계조건.** $r=R$에서 $f(\phi)=\sum A_nP_n(\cos\phi)$. 직교성 $\int_{-1}^1P_mP_n\,dw=\frac2{2n+1}\delta_{mn}$과 $dw=-\sin\phi\,d\phi$로 계수 공식이 나옵니다.` },
  // ───── 15
  { ch: 'ch15', id: 'conformality', title: '해석함수의 등각성', keys: ['등각성과 확대율'],
    tags: 'conformal mapping angle preserving analytic critical point magnification jacobian 등각 사상 각 보존 임계점 확대율 야코비안',
    stmt: R`$f$가 해석적이고 $f'(z_0)\ne0$이면 $w=f(z)$는 $z_0$에서 각의 크기와 방향을 보존한다. 확대율은 $|f'(z_0)|$, 넓이 확대율은 $|f'(z_0)|^2$이다.`,
    body: R`
$z_0$를 지나는 매끄러운 곡선 $z(t)$ ($z(t_0)=z_0$)의 접선은 $\dot z(t_0)$입니다. 상 곡선 $w(t)=f(z(t))$의 접선은 연쇄법칙으로
$$\dot w(t_0)=f'(z_0)\,\dot z(t_0)$$
$f'(z_0)\ne0$이므로 $\arg\dot w=\arg f'(z_0)+\arg\dot z$. 즉 $z_0$에서 나가는 **모든** 곡선의 접선이 같은 각 $\arg f'(z_0)$만큼 회전합니다. 두 곡선의 접선 사이의 각은 차이이므로 크기와 방향이 그대로 보존됩니다.

**확대율.** $|\dot w|=|f'(z_0)||\dot z|$이므로 짧은 선분의 길이는 $|f'(z_0)|$배가 됩니다.

**넓이.** 사상 $(x,y)\mapsto(u,v)$의 야코비안은 코시-리만 방정식으로
$$u_xv_y-u_yv_x=u_x^2+v_x^2=|f'(z)|^2$$
**임계점.** $f'(z_0)=\dots=f^{(k-1)}(z_0)=0\ne f^{(k)}(z_0)$이면 $f(z)-f(z_0)\approx a(z-z_0)^k$이므로 각이 $k$배가 되어 등각이 아닙니다. $z^2$이 원점에서 직각을 평각으로 만드는 이유입니다.` },
  { ch: 'ch15', id: 'lft-basic', title: '1차 분수변환의 도함수, 역변환, 분해', keys: ['1차 분수변환'],
    tags: 'linear fractional transformation mobius inverse derivative decomposition inversion 1차 분수변환 뫼비우스 역변환 반전',
    stmt: R`$w=\frac{az+b}{cz+d}$ ($ad-bc\ne0$)은 $w'=\frac{ad-bc}{(cz+d)^2}\ne0$이고, 역변환 $z=\frac{dw-b}{-cw+a}$도 1차 분수변환이며, 평행이동·회전확대·반전의 합성이다.`,
    body: R`
**도함수.** 몫의 미분법으로
$$w'=\frac{a(cz+d)-c(az+b)}{(cz+d)^2}=\frac{ad-bc}{(cz+d)^2}$$
$ad-bc\ne0$이므로 $z=-d/c$를 뺀 모든 점에서 $w'\ne0$, 즉 등각입니다. $ad-bc=0$이면 $w'\equiv0$이라 상수함수가 됩니다.

**역변환.** $w(cz+d)=az+b$를 $z$에 대해 풀면 $z(cw-a)=b-dw$, $z=\dfrac{dw-b}{-cw+a}$. 계수의 행렬식 $da-bc$가 같으므로 역시 1차 분수변환입니다.

**분해.** $c=0$이면 $w=\frac adz+\frac bd$ (회전·확대 후 평행이동). $c\ne0$이면
$$\frac ac-\frac{ad-bc}{c}\cdot\frac1{cz+d}=\frac{a(cz+d)-(ad-bc)}{c(cz+d)}=\frac{c(az+b)}{c(cz+d)}=w$$
이므로 $z\mapsto cz+d\mapsto\frac1{cz+d}\mapsto\frac ac-\frac{ad-bc}c\cdot(\cdot)$의 합성입니다. 행렬 $\begin{pmatrix}a&b\\c&d\end{pmatrix}$의 곱이 변환의 합성에 대응합니다.` },
  { ch: 'ch15', id: 'lft-circles', title: '1차 분수변환은 원과 직선을 원과 직선으로 옮긴다', keys: ['원과 직선 (교재 Theorem 1)'],
    tags: 'mobius circles lines inversion 1/z circle to circle 1차 분수변환 원 직선 반전',
    stmt: R`1차 분수변환은 원과 직선의 모임을 원과 직선의 모임으로 옮긴다.`,
    body: R`
앞 증명의 분해에 의해 평행이동, 회전·확대, 반전 $w=1/z$ 각각에 대해 보이면 됩니다. 앞의 둘은 도형을 합동·닮음으로 옮기므로 분명합니다.

**반전.** 원과 직선은 모두
$$A(x^2+y^2)+Bx+Cy+D=0\qquad(A=0\text{이면 직선})$$
꼴입니다. $z=1/w$이면 $x=\dfrac u{u^2+v^2}$, $y=\dfrac{-v}{u^2+v^2}$, $x^2+y^2=\dfrac1{u^2+v^2}$. 대입하고 $u^2+v^2$을 곱하면
$$A+Bu-Cv+D(u^2+v^2)=0$$
다시 같은 꼴입니다. 따라서 원·직선은 원·직선으로 갑니다. 특히 $D=0$ (원점을 지나는 원이나 직선)이면 상은 직선이고, $A=0$ (직선)이면 상은 원점을 지나는 원 또는 직선입니다.` },
  { ch: 'ch15', id: 'lft-fixed', title: '1차 분수변환의 고정점은 많아야 두 개', keys: ['고정점 (교재 Theorem 2)'],
    tags: 'fixed points mobius at most two identity 고정점 1차 분수변환 항등사상',
    stmt: R`항등사상이 아닌 1차 분수변환은 고정점을 많아야 두 개 가진다. 세 점을 고정하는 1차 분수변환은 항등사상이다.`,
    body: R`
$f(z)=z$는 $az+b=z(cz+d)$, 즉
$$cz^2+(d-a)z-b=0$$
- $c\ne0$이면 2차방정식이므로 근은 많아야 2개입니다.
- $c=0$이면 $(d-a)z=b$. $d\ne a$이면 유한한 고정점 1개(그리고 $\infty$도 고정되어 모두 2개)이고, $d=a$, $b\ne0$이면 평행이동으로 $\infty$만 고정합니다.
- 세 계수가 모두 0 ($c=0$, $d=a$, $b=0$)이면 $f(z)=z$, 항등사상입니다.

따라서 확장된 평면에서 서로 다른 세 점을 고정하면 방정식이 항등적으로 성립해야 하므로 항등사상입니다.` },
  { ch: 'ch15', id: 'three-points', title: '세 점과 상으로 1차 분수변환이 유일하게 정해진다', keys: ['세 점으로 정해지는 1차 분수변환'],
    tags: 'cross ratio three points unique mobius transformation 교차비 세 점 유일성 1차 분수변환',
    stmt: R`서로 다른 $z_1,z_2,z_3$을 서로 다른 $w_1,w_2,w_3$으로 보내는 1차 분수변환은 오직 하나이고, 교차비 등식으로 주어진다.`,
    body: R`
**존재.** 다음 함수를 생각합니다.
$$T(z)=\frac{z-z_1}{z-z_3}\cdot\frac{z_2-z_3}{z_2-z_1}$$
$T$는 1차 분수변환이고 $T(z_1)=0$, $T(z_2)=1$, $T(z_3)=\infty$. 같은 방법으로 $S(w)$를 만들면 $S(w_1)=0$, $S(w_2)=1$, $S(w_3)=\infty$. 그러면
$$w=S^{-1}\big(T(z)\big)$$
는 1차 분수변환의 합성이므로 1차 분수변환이고 $z_k\mapsto w_k$입니다. $S(w)=T(z)$가 교재의 공식 그대로입니다. 어떤 점이 $\infty$이면 극한을 취해 그 점이 든 인수를 1로 바꿉니다.

**유일성.** $f,g$가 모두 조건을 만족하면 $g^{-1}\circ f$는 $z_1,z_2,z_3$을 고정하므로 앞의 고정점 정리에 의해 항등사상, 즉 $f=g$.` },
  { ch: 'ch15', id: 'basic-maps', title: R`$e^z$, $z^n$, $\sin z$가 옮기는 영역`, keys: ['기본 함수의 사상'],
    tags: 'exponential map strip half plane sector sin z hyperbola ellipse 지수함수 사상 띠 반평면 부채꼴 쌍곡선 타원',
    stmt: R`$e^z$는 띠 $0<y<\pi$를, $z^n$은 부채꼴 $0<\arg z<\pi/n$을 위쪽 반평면으로 보내고, $\sin z$는 수직선을 쌍곡선, 수평선을 타원으로 보낸다.`,
    body: R`
**$e^z$.** $w=e^xe^{iy}$이므로 $|w|=e^x$, $\arg w=y$. 수평선 $y=c$는 반직선 $\arg w=c$로, 수직선 $x=c$는 원 $|w|=e^c$로 갑니다. $0<y<\pi$이면 $0<\arg w<\pi$, 즉 위쪽 반평면 전체를 덮고, $x$가 실수 전체를 돌므로 $|w|$도 $(0,\infty)$ 전체를 덮습니다.

**$z^n$.** $z=re^{i\theta}$이면 $w=r^ne^{in\theta}$. 편각이 $n$배가 되므로 $0<\theta<\pi/n$은 $0<\arg w<\pi$로 갑니다.

**$\sin z$.** 덧셈정리로
$$\sin(x+iy)=\sin x\cosh y+i\cos x\sinh y$$
$x=c$ ($\sin c\cos c\ne0$)이면 $\dfrac{u^2}{\sin^2c}-\dfrac{v^2}{\cos^2c}=\cosh^2y-\sinh^2y=1$, 쌍곡선입니다. $y=k\ne0$이면 $\dfrac{u^2}{\cosh^2k}+\dfrac{v^2}{\sinh^2k}=1$, 타원입니다. 경계 $x=\pm\frac\pi2$는 $u=\pm\cosh y$, $v=0$으로 가므로 $[1,\infty)$와 $(-\infty,-1]$이 됩니다.` },
  // ───── 16
  { ch: 'ch16', id: 'complex-potential', title: '켤레 조화함수의 존재와 등퍼텐셜선·힘선의 직교성', keys: ['복소 퍼텐셜'],
    tags: 'complex potential conjugate harmonic equipotential lines of force orthogonal 복소 퍼텐셜 켤레 조화함수 등퍼텐셜선 힘선 직교',
    stmt: R`단순연결 영역의 조화함수 $\Phi$에는 $F=\Phi+i\Psi$가 해석적이 되는 $\Psi$가 있고, $\Phi=$상수와 $\Psi=$상수인 곡선은 직교한다.`,
    body: R`
**존재.** 코시-리만 방정식 $\Psi_x=-\Phi_y$, $\Psi_y=\Phi_x$를 만족하는 $\Psi$를 선적분으로 정의합니다.
$$\Psi(x,y)=\int_{(x_0,y_0)}^{(x,y)}\big(-\Phi_y\,dx+\Phi_x\,dy\big)$$
경로 독립 조건은 $\dfrac{\partial(-\Phi_y)}{\partial y}=\dfrac{\partial\Phi_x}{\partial x}$, 즉 $\Phi_{xx}+\Phi_{yy}=0$으로, $\Phi$가 조화함수라서 성립합니다(단순연결 영역). 따라서 $\Psi$는 잘 정의되고 $F=\Phi+i\Psi$는 코시-리만 방정식을 만족하므로 해석적입니다.

**직교성.** $\nabla\Phi\cdot\nabla\Psi=\Phi_x\Psi_x+\Phi_y\Psi_y=\Phi_x(-\Phi_y)+\Phi_y\Phi_x=0$. 등고선은 기울기에 수직이므로 $F'\ne0$인 곳에서 두 곡선족은 직교합니다. (또는 $F$가 등각이고 $w$평면의 직선 $u=$상수, $v=$상수가 직교하기 때문이라고 봐도 됩니다.)` },
  { ch: 'ch16', id: 'harmonic-conformal', title: '등각사상은 조화성을 보존한다', keys: ['등각사상에서의 조화함수 (교재 Theorem 1)'],
    tags: 'harmonic function invariance under conformal mapping laplacian chain rule 조화함수 등각사상 불변 라플라시안',
    stmt: R`$\Phi^*$가 조화함수이고 $w=f(z)$가 해석적이면 $\Phi(x,y)=\Phi^*(u(x,y),v(x,y))$도 조화함수이다. 실제로 $\nabla^2_z\Phi=|f'(z)|^2\,\nabla^2_w\Phi^*$.`,
    body: R`
**방법 1 (교재).** 원판처럼 단순연결인 작은 영역에서 $\Phi^*$는 해석함수 $F^*(w)$의 실수부입니다(앞의 증명). 해석함수의 합성 $F(z)=F^*(f(z))$는 해석적이므로 그 실수부 $\Phi=\Phi^*(u,v)$는 조화함수입니다.

**방법 2 (직접 계산).** 연쇄법칙으로
$$\Phi_{xx}=\Phi^*_{uu}u_x^2+2\Phi^*_{uv}u_xv_x+\Phi^*_{vv}v_x^2+\Phi^*_uu_{xx}+\Phi^*_vv_{xx}$$
$\Phi_{yy}$도 같은 꼴입니다. 더하고 코시-리만 방정식을 쓰면
- $u_x^2+u_y^2=v_x^2+v_y^2=|f'|^2$
- $u_xv_x+u_yv_y=u_xv_x-v_xu_x=0$
- $\nabla^2u=\nabla^2v=0$

이므로 $\nabla^2\Phi=|f'(z)|^2(\Phi^*_{uu}+\Phi^*_{vv})=0$.` },
  { ch: 'ch16', id: 'flow-potential', title: '비회전·비압축 흐름의 복소 퍼텐셜과 속도', keys: ['복소 퍼텐셜과 유속'],
    tags: 'ideal fluid flow irrotational incompressible velocity potential stream function streamlines 유체 흐름 비회전 비압축 속도 퍼텐셜 유선 유량함수',
    stmt: R`흐름이 비회전·비압축이고 영역이 단순연결이면 해석함수 $F=\Phi+i\Psi$가 있어 $V=\overline{F'(z)}$이고, $\Psi=$상수가 유선이다.`,
    body: R`
$\mathbf V=(V_1,V_2)$.

**비회전** $\partial_xV_2-\partial_yV_1=0$: 단순연결 영역에서 선적분 $\int V_1dx+V_2dy$가 경로에 무관하므로 $\mathbf V=\nabla\Phi$인 속도 퍼텐셜 $\Phi$가 있습니다.

**비압축** $\partial_xV_1+\partial_yV_2=0$: $\Phi_{xx}+\Phi_{yy}=0$, 즉 $\Phi$는 조화함수입니다.

따라서 켤레 조화함수 $\Psi$가 있어 $F=\Phi+i\Psi$가 해석적입니다. $F'=\Phi_x+i\Psi_x=\Phi_x-i\Phi_y$ (코시-리만)이므로
$$\overline{F'(z)}=\Phi_x+i\Phi_y=V_1+iV_2=V$$
**유선.** $\nabla\Psi\perp\nabla\Phi=\mathbf V$이므로 속도는 $\Psi=$상수인 곡선에 접합니다. 즉 그 곡선이 유체 입자의 경로입니다. 벽(고체 경계)은 유체가 가로지를 수 없으므로 반드시 유선이어야 하고, 그래서 원기둥 흐름에서 단위원이 $\Psi=0$이 되도록 $F$를 고릅니다.` },
  { ch: 'ch16', id: 'poisson', title: '푸아송 적분 공식의 유도', keys: ['푸아송 적분 공식'],
    tags: 'poisson integral formula disk dirichlet problem fourier series poisson kernel 푸아송 적분 공식 원판 디리클레 푸아송 핵',
    stmt: R`원판 $r<R$의 조화함수는 $\Phi(r,\theta)=a_0+\sum(r/R)^n(a_n\cos n\theta+b_n\sin n\theta)$이고, 이것을 합하면 푸아송 핵 $\frac{R^2-r^2}{R^2-2Rr\cos(\theta-\alpha)+r^2}$을 가진 적분이 된다.`,
    body: R`
**급수 형태.** 원판에서 $\Phi=\Re F$, $F$는 해석적이므로 테일러 급수 $F=\sum c_nz^n$ ($c_n=\alpha_n-i\beta_n$)으로 쓸 수 있습니다. $z^n=r^ne^{in\theta}$이므로
$$\Phi=\Re F=\alpha_0+\sum_{n\ge1}r^n(\alpha_n\cos n\theta+\beta_n\sin n\theta)$$
$r=R$에서 이것이 경계값의 푸리에 급수여야 하므로 $a_n=R^n\alpha_n$, $b_n=R^n\beta_n$. 대입하면 급수 형태가 나옵니다.

**적분 형태.** 푸리에 계수 $a_n=\frac1\pi\int_0^{2\pi}\Phi(R,\alpha)\cos n\alpha\,d\alpha$ 등을 넣고 $\cos n\theta\cos n\alpha+\sin n\theta\sin n\alpha=\cos n(\theta-\alpha)$를 쓰면 ($\rho=r/R<1$이면 고른 수렴이라 합과 적분을 바꿀 수 있음)
$$\Phi(r,\theta)=\frac1{2\pi}\int_0^{2\pi}\Phi(R,\alpha)\Big[1+2\sum_{n\ge1}\rho^n\cos n(\theta-\alpha)\Big]d\alpha$$
$q=\rho e^{i(\theta-\alpha)}$로 두면 괄호는 $\Re\Big(1+\dfrac{2q}{1-q}\Big)=\Re\dfrac{1+q}{1-q}=\dfrac{1-\rho^2}{1-2\rho\cos(\theta-\alpha)+\rho^2}$. 분자·분모에 $R^2$을 곱하면 푸아송 핵입니다.`,
    sketch: R`경계값의 푸리에 급수를 조화함수 $r^n\cos n\theta$, $r^n\sin n\theta$로 연장하고, 기하급수로 합해 핵을 얻습니다.` },
  { ch: 'ch16', id: 'mean-max', title: '평균값 성질, 최대 원리, 디리클레 문제의 유일성', keys: ['평균값 성질과 최대 원리'],
    tags: 'mean value property maximum modulus principle maximum principle harmonic uniqueness dirichlet 평균값 성질 최대 절댓값 원리 최대 원리 유일성',
    stmt: R`해석함수와 조화함수는 원 중심의 값이 원 위의 평균값과 같다. 상수가 아니면 $|F|$와 $\Phi$는 내부에서 최댓값을 갖지 않으며, 디리클레 문제의 해는 유일하다.`,
    body: R`
**평균값 성질.** 코시 적분 공식에서 $C:z=z_0+re^{i\alpha}$, $dz=ire^{i\alpha}d\alpha$로 두면
$$F(z_0)=\frac1{2\pi i}\int_0^{2\pi}\frac{F(z_0+re^{i\alpha})}{re^{i\alpha}}\,ire^{i\alpha}\,d\alpha=\frac1{2\pi}\int_0^{2\pi}F(z_0+re^{i\alpha})\,d\alpha$$
조화함수 $\Phi$는 원판 근처에서 $\Re F$이므로 실수부를 취하면 $\Phi$의 평균값 성질이 됩니다.

**최대 절댓값 원리.** $|F|$가 내부 점 $z_0$에서 최댓값 $M$을 가진다고 합시다. 작은 $r$에 대해
$$M=|F(z_0)|\le\frac1{2\pi}\int_0^{2\pi}|F(z_0+re^{i\alpha})|\,d\alpha\le M$$
등호가 성립하려면 연속함수 $|F|$가 그 원 위에서 모두 $M$이어야 합니다. 모든 작은 $r$에 대해 그러므로 $z_0$ 주변 원판에서 $|F|\equiv M$. 절댓값이 일정한 해석함수는 상수이고(코시-리만), 영역이 연결되어 있으므로 $F$는 전체에서 상수입니다.

**조화함수의 최대 원리.** $\Phi=\Re F$이면 $|e^F|=e^\Phi$. $\Phi$의 내부 최댓값은 $|e^F|$의 내부 최댓값이므로 $e^F$, 따라서 $\Phi$가 상수입니다. 최솟값은 $-\Phi$에 적용합니다.

**유일성.** 두 해 $\Phi_1,\Phi_2$의 차 $\Phi_1-\Phi_2$는 조화함수이고 경계에서 0입니다. 최댓값과 최솟값이 모두 경계에서, 즉 0이므로 $\Phi_1\equiv\Phi_2$.` },
  );
})();
