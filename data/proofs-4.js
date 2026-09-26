/* 증명 — 08 벡터 미분, 09 벡터 적분 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 08
  { ch: 'ch08', id: 'dot', title: '내적의 코사인 공식', keys: ['내적과 정사영'],
    tags: 'dot product inner product cosine law 내적 코사인 법칙 각',
    stmt: R`$\mathbf a\cdot\mathbf b=a_1b_1+a_2b_2+a_3b_3=|\mathbf a||\mathbf b|\cos\gamma$.`,
    body: R`
$\mathbf a$, $\mathbf b$, $\mathbf a-\mathbf b$가 만드는 삼각형에 코사인 법칙을 쓰면
$$|\mathbf a-\mathbf b|^2=|\mathbf a|^2+|\mathbf b|^2-2|\mathbf a||\mathbf b|\cos\gamma$$
좌변을 성분으로 전개하면 $\sum(a_i-b_i)^2=|\mathbf a|^2+|\mathbf b|^2-2\sum a_ib_i$. 두 식을 비교하면 $\sum a_ib_i=|\mathbf a||\mathbf b|\cos\gamma$. 여기서 $|\mathbf a\cdot\mathbf b|\le|\mathbf a||\mathbf b|$ (코시–슈바르츠 부등식)도 바로 나옵니다.` },
  { ch: 'ch08', id: 'cross', title: '외적의 크기와 삼중곱의 부피', keys: ['내적·외적·삼중곱'],
    tags: 'cross product magnitude triple product volume lagrange identity 외적 크기 삼중곱 부피 라그랑주 항등식',
    stmt: R`$|\mathbf a\times\mathbf b|=|\mathbf a||\mathbf b|\sin\gamma$이고 $\mathbf a\times\mathbf b$는 $\mathbf a$, $\mathbf b$에 수직이다. $|\mathbf a\cdot(\mathbf b\times\mathbf c)|$는 평행육면체의 부피이다.`,
    body: R`
성분으로 전개하면 라그랑주 항등식 $|\mathbf a\times\mathbf b|^2=|\mathbf a|^2|\mathbf b|^2-(\mathbf a\cdot\mathbf b)^2$이 확인됩니다. 따라서
$$|\mathbf a\times\mathbf b|^2=|\mathbf a|^2|\mathbf b|^2(1-\cos^2\gamma)=|\mathbf a|^2|\mathbf b|^2\sin^2\gamma$$
$\mathbf a\cdot(\mathbf a\times\mathbf b)$는 첫째 행과 둘째 행이 모두 $\mathbf a$인 행렬식이라 0이므로 수직입니다.

삼중곱 $\mathbf a\cdot(\mathbf b\times\mathbf c)$는 행렬식을 첫째 행으로 전개한 것과 같습니다. 부피 = 밑면 넓이 × 높이이고, 밑면(평행사변형 $\mathbf b,\mathbf c$)의 넓이는 $|\mathbf b\times\mathbf c|$, 높이는 $\mathbf a$의 법선 방향 성분 $|\mathbf a|\,|\cos\varphi|$이므로 부피는 $|\mathbf a\cdot(\mathbf b\times\mathbf c)|$입니다.` },
  { ch: 'ch08', id: 'curvature', title: '곡률 공식', keys: ['곡선의 기본량'],
    tags: 'curvature arc length unit tangent 곡률 호의 길이 단위접선',
    stmt: R`$\kappa=\left|\dfrac{d\mathbf u}{ds}\right|=\dfrac{|\mathbf r'\times\mathbf r''|}{|\mathbf r'|^3}$, $s=\displaystyle\int|\mathbf r'|\,dt$.`,
    body: R`
호의 길이는 짧은 현의 길이 $|\mathbf r(t+\Delta t)-\mathbf r(t)|\approx|\mathbf r'|\Delta t$를 더한 극한이므로 $s=\int|\mathbf r'|\,dt$이고 $\dfrac{ds}{dt}=|\mathbf r'|=v$입니다.

$\mathbf r'=v\mathbf u$를 미분하면 $\dfrac{d\mathbf u}{dt}=v\dfrac{d\mathbf u}{ds}$이므로
$$\mathbf r''=v'\mathbf u+v^2\frac{d\mathbf u}{ds}$$
$\mathbf u\times\mathbf u=\mathbf 0$이므로 $\mathbf r'\times\mathbf r''=v^3\,\mathbf u\times\dfrac{d\mathbf u}{ds}$. $\mathbf u\cdot\mathbf u=1$을 미분하면 $\mathbf u\perp\dfrac{d\mathbf u}{ds}$이므로 $\Big|\mathbf u\times\dfrac{d\mathbf u}{ds}\Big|=\kappa$. 따라서 $|\mathbf r'\times\mathbf r''|=v^3\kappa$.` },
  { ch: 'ch08', id: 'directional', title: '방향도함수와 기울기의 의미', keys: ['기울기와 방향도함수'],
    tags: 'directional derivative gradient maximum rate normal level surface 방향도함수 기울기 최대 증가율 법선 등위면',
    stmt: R`$D_{\mathbf b}f=\dfrac{\mathbf b\cdot\nabla f}{|\mathbf b|}$이고, 최대 증가율은 $\nabla f$ 방향으로 $|\nabla f|$이며, $\nabla f$는 등위면 $f=c$에 수직이다.`,
    body: R`
단위벡터 $\mathbf b$에 대해 $g(t)=f(\mathbf p+t\mathbf b)$라 두면 방향도함수는 $g'(0)$이고, 연쇄법칙으로
$$g'(0)=f_xb_1+f_yb_2+f_zb_3=\mathbf b\cdot\nabla f$$
$\mathbf b$가 단위벡터가 아니면 $\mathbf b/|\mathbf b|$를 씁니다.

$\mathbf b\cdot\nabla f=|\nabla f|\cos\theta\le|\nabla f|$이고, 등호는 $\theta=0$, 즉 $\mathbf b$가 $\nabla f$ 방향일 때입니다.

등위면 위의 곡선 $\mathbf r(t)$에서 $f(\mathbf r(t))=c$이므로 미분하면 $\nabla f\cdot\mathbf r'(t)=0$. 곡면 위의 모든 접선벡터와 수직이므로 $\nabla f$는 법선벡터입니다.` },
  { ch: 'ch08', id: 'curlgrad', title: R`$\operatorname{curl}\nabla f=\mathbf 0$과 $\operatorname{div}\operatorname{curl}\mathbf v=0$`, keys: ['발산과 회전'],
    tags: 'curl of gradient divergence of curl identity 회전 발산 항등식',
    stmt: R`2계 편도함수가 연속이면 $\operatorname{curl}(\nabla f)=\mathbf 0$, $\operatorname{div}(\operatorname{curl}\mathbf v)=0$.`,
    body: R`
$\operatorname{curl}\nabla f$의 첫 성분은 $\partial_y f_z-\partial_z f_y=f_{zy}-f_{yz}=0$ (혼합편미분의 순서 교환). 나머지 성분도 같습니다.
$$\operatorname{div}\operatorname{curl}\mathbf v=\partial_x(v_{3,y}-v_{2,z})+\partial_y(v_{1,z}-v_{3,x})+\partial_z(v_{2,x}-v_{1,y})$$
전개하면 $v_{3,yx}-v_{3,xy}$, $v_{2,xz}-v_{2,zx}$, $v_{1,zy}-v_{1,yz}$ 세 쌍이 모두 상쇄되어 0입니다.` },
  { ch: 'ch08', id: 'rigid', title: R`강체 회전 속도장의 회전은 $2\boldsymbol\omega$`, keys: ['발산과 회전'],
    tags: 'rigid body rotation angular velocity curl 강체 회전 각속도',
    stmt: R`$\mathbf v=\boldsymbol\omega\times\mathbf r$ ($\boldsymbol\omega$ 상수)이면 $\operatorname{curl}\mathbf v=2\boldsymbol\omega$, $\operatorname{div}\mathbf v=0$.`,
    body: R`
$$\mathbf v=\boldsymbol\omega\times\mathbf r=(\omega_2z-\omega_3y,\ \omega_3x-\omega_1z,\ \omega_1y-\omega_2x)$$
회전의 첫 성분은 $\partial_y(\omega_1y-\omega_2x)-\partial_z(\omega_3x-\omega_1z)=\omega_1+\omega_1=2\omega_1$이고, 나머지도 같아 $2\boldsymbol\omega$. 각 성분이 자기 변수를 포함하지 않으므로 발산은 0입니다. 회전이 "소용돌이의 세기"라는 해석이 여기서 나옵니다.` },
  { ch: 'ch08', id: 'product', title: '곱의 미분 공식', keys: ['곱의 미분 공식'],
    tags: 'product rule gradient divergence curl identity 곱의 미분 기울기 발산 회전',
    stmt: R`$\nabla(fg)=f\nabla g+g\nabla f$, $\nabla\cdot(f\mathbf v)=f\nabla\cdot\mathbf v+\mathbf v\cdot\nabla f$, $\nabla\times(f\mathbf v)=\nabla f\times\mathbf v+f\nabla\times\mathbf v$.`,
    body: R`
모두 성분별 곱의 미분법입니다.
- $(fg)_x=fg_x+gf_x$ 등.
- $\sum_i\partial_i(fv_i)=\sum_i\big(f\,\partial_iv_i+v_i\,\partial_if\big)=f\,\operatorname{div}\mathbf v+\mathbf v\cdot\nabla f$.
- 회전의 첫 성분: $\partial_y(fv_3)-\partial_z(fv_2)=f(v_{3,y}-v_{2,z})+(f_yv_3-f_zv_2)$. 앞 괄호는 $(\nabla\times\mathbf v)_1$, 뒤 괄호는 $(\nabla f\times\mathbf v)_1$입니다.` },
  // ───── 09
  { ch: 'ch09', id: 'line-integral', title: '선적분 공식과 매개변수에 대한 불변성', keys: ['선적분'],
    tags: 'line integral work arc length parametrization orientation 선적분 일 호의 길이 매개변수화 방향',
    stmt: R`$\int_C\mathbf F\cdot d\mathbf r=\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt$와 $\int_Cf\,ds=\int_a^bf(\mathbf r(t))|\mathbf r'(t)|\,dt$는 같은 방향의 다른 매개변수화에서도 값이 같고, 방향을 바꾸면 첫 적분만 부호가 바뀐다.`,
    body: R`
선적분은 곡선을 잘게 나눈 변위 $\Delta\mathbf r\approx\mathbf r'(t)\Delta t$와 힘의 내적을 더한 극한이므로 첫 공식이 됩니다. 호의 길이 요소는 $ds=|\mathbf r'|\,dt$입니다(8단원 곡률 증명).

**매개변수 불변성.** $t=\phi(\tau)$, $\phi'>0$으로 바꾼 $\tilde{\mathbf r}(\tau)=\mathbf r(\phi(\tau))$에서 $\tilde{\mathbf r}'=\mathbf r'(\phi)\phi'$이므로 치환적분으로
$$\int\mathbf F(\tilde{\mathbf r})\cdot\tilde{\mathbf r}'\,d\tau=\int\mathbf F(\mathbf r(\phi))\cdot\mathbf r'(\phi)\,\phi'\,d\tau=\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt$$
$\phi'<0$(방향 반대)이면 적분 구간이 뒤집혀 부호가 바뀝니다. $\int f\,ds$에는 $|\tilde{\mathbf r}'|=|\mathbf r'||\phi'|$가 들어가 절댓값 때문에 부호가 바뀌지 않습니다.` },
  { ch: 'ch09', id: 'pathind', title: '퍼텐셜과 경로 독립', keys: ['경로 독립'],
    tags: 'path independence potential conservative gradient line integral 경로 독립 퍼텐셜 보존장 선적분',
    stmt: R`$\mathbf F=\nabla f$이면 $\int_A^B\mathbf F\cdot d\mathbf r=f(B)-f(A)$. 거꾸로 선적분이 경로에 무관하면 $\mathbf F$는 기울기장이다. 경로 독립은 모든 닫힌 경로의 적분이 0인 것과 같다.`,
    body: R`
연쇄법칙으로 $\dfrac{d}{dt}f(\mathbf r(t))=\nabla f\cdot\mathbf r'(t)$이므로
$$\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt=f(\mathbf r(b))-f(\mathbf r(a))$$

**역.** 경로에 무관하면 $f(\mathbf x)=\int_A^{\mathbf x}\mathbf F\cdot d\mathbf r$이 잘 정의됩니다. $\mathbf x$까지 간 뒤 $x$축 방향 선분으로 $h$만큼 더 가는 경로를 쓰면
$$f(x+h,y,z)-f(x,y,z)=\int_x^{x+h}F_1(t,y,z)\,dt$$
이므로 $f_x=F_1$. 같은 방법으로 $f_y=F_2$, $f_z=F_3$.

**닫힌 경로.** $A$에서 $B$로 가는 두 경로 $C_1$, $C_2$에 대해 $C_1$과 거꾸로 간 $C_2$를 이으면 닫힌 경로이고, 그 적분은 $\int_{C_1}-\int_{C_2}$입니다.` },
  { ch: 'ch09', id: 'curlzero', title: '단순연결 영역에서 회전이 0이면 경로 독립', keys: ['경로 독립'],
    tags: 'simply connected curl zero irrotational conservative 단순연결 비회전 보존장',
    sketch: R`스토크스 정리를 쓰며, 단순연결 영역에서는 모든 단순닫힌곡선이 영역 안의 곡면의 경계가 된다는 사실을 이용합니다.`,
    stmt: R`단순연결 영역에서 $\operatorname{curl}\mathbf F=\mathbf 0$이면 $\mathbf F$의 선적분은 경로에 무관하다.`,
    body: R`
영역 안의 닫힌 곡선 $C$는 영역 안의 어떤 곡면 $S$의 경계입니다. 스토크스 정리로
$$\oint_C\mathbf F\cdot d\mathbf r=\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=0$$
앞 증명에 의해 경로 독립입니다.

**단순연결이 필요한 이유.** $\mathbf F=\Big(\dfrac{-y}{x^2+y^2},\dfrac{x}{x^2+y^2}\Big)$는 원점 밖에서 $\partial_xF_2-\partial_yF_1=0$이지만, 단위원 $\mathbf r=(\cos t,\sin t)$에서 $\mathbf F\cdot\mathbf r'=1$이라 적분은 $2\pi$입니다. 단위원이 감싸는 원판은 원점(구멍)을 포함하므로 스토크스 정리를 쓸 수 없습니다.` },
  { ch: 'ch09', id: 'green', title: '그린 정리', keys: ['그린 정리'],
    tags: 'green theorem plane double integral line integral 그린 정리 평면 이중적분',
    sketch: R`영역이 $x$방향과 $y$방향으로 모두 단순한 경우를 증명합니다. 일반 영역은 이런 조각으로 나누면 안쪽 경계의 적분이 서로 상쇄됩니다.`,
    stmt: R`$\displaystyle\iint_R\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)dx\,dy=\oint_C\big(F_1\,dx+F_2\,dy\big)$ ($C$는 반시계 방향).`,
    body: R`
$R=\{a\le x\le b,\ u(x)\le y\le v(x)\}$로 쓰면
$$\iint_R\frac{\partial F_1}{\partial y}\,dy\,dx=\int_a^b\big[F_1(x,v(x))-F_1(x,u(x))\big]dx$$
경계를 반시계로 돌면 아래 곡선 $y=u(x)$는 $a\to b$, 위 곡선 $y=v(x)$는 $b\to a$ 방향이고, 세로 변에서는 $dx=0$입니다. 따라서
$$\oint_CF_1\,dx=\int_a^bF_1(x,u(x))\,dx-\int_a^bF_1(x,v(x))\,dx=-\iint_R\frac{\partial F_1}{\partial y}\,dx\,dy$$
$R$을 $\{c\le y\le d,\ p(y)\le x\le q(y)\}$로 써서 같은 계산을 하면 $\oint_CF_2\,dy=\iint_R\dfrac{\partial F_2}{\partial x}\,dx\,dy$. 두 식을 더하면 정리입니다.` },
  { ch: 'ch09', id: 'area', title: '그린 정리의 넓이 공식과 야코비안', keys: ['그린 정리', '이중적분의 변수변환'],
    tags: 'area formula green jacobian polar coordinates change of variables 넓이 공식 야코비안 극좌표 변수변환',
    stmt: R`$A=\dfrac12\displaystyle\oint_C(x\,dy-y\,dx)$. 또 극좌표에서 $dx\,dy=r\,dr\,d\theta$.`,
    body: R`
그린 정리에서 $F_1=-\tfrac y2$, $F_2=\tfrac x2$로 두면 $\partial_xF_2-\partial_yF_1=\tfrac12+\tfrac12=1$이므로 $\iint_R1\,dx\,dy=\tfrac12\oint(x\,dy-y\,dx)$.

변수변환 $(u,v)\mapsto(x,y)$에서 작은 직사각형 $du\times dv$는 변 $\mathbf x_u\,du$, $\mathbf x_v\,dv$인 평행사변형으로 옮겨지고, 넓이는 $\Big|\det\dfrac{\partial(x,y)}{\partial(u,v)}\Big|du\,dv$입니다. 극좌표 $x=r\cos\theta$, $y=r\sin\theta$에서
$$\det\begin{pmatrix}\cos\theta&-r\sin\theta\\ \sin\theta&r\cos\theta\end{pmatrix}=r$$` },
  { ch: 'ch09', id: 'surface-area', title: '면적 요소와 법선벡터', keys: ['면적분', '곡면의 법선벡터'],
    tags: 'surface area element normal vector flux parametric surface sphere 면적 요소 법선 유량 매개변수 곡면 구면',
    stmt: R`매개변수 곡면의 면적 요소는 $dA=|\mathbf r_u\times\mathbf r_v|\,du\,dv$이다. 그래프 $z=f(x,y)$이면 $\mathbf N=(-f_x,-f_y,1)$, 반지름 $a$인 구면이면 $dA=a^2\sin\phi\,d\phi\,d\theta$.`,
    body: R`
매개변수 영역의 작은 직사각형 $du\times dv$는 곡면 위에서 변이 $\mathbf r_u\,du$, $\mathbf r_v\,dv$인 평행사변형과 거의 같고, 그 넓이는 $|\mathbf r_u\times\mathbf r_v|\,du\,dv$입니다. 유량은 $\mathbf F\cdot\mathbf n\,dA=\mathbf F\cdot\dfrac{\mathbf N}{|\mathbf N|}|\mathbf N|\,du\,dv=\mathbf F\cdot\mathbf N\,du\,dv$.

**그래프.** $\mathbf r=(x,y,f(x,y))$이면 $\mathbf r_x=(1,0,f_x)$, $\mathbf r_y=(0,1,f_y)$이고 $\mathbf r_x\times\mathbf r_y=(-f_x,-f_y,1)$.

**구면.** $\mathbf r=a(\sin\phi\cos\theta,\ \sin\phi\sin\theta,\ \cos\phi)$이면
$$\mathbf r_\phi\times\mathbf r_\theta=a^2\sin\phi\,(\sin\phi\cos\theta,\ \sin\phi\sin\theta,\ \cos\phi)$$
크기는 $a^2\sin\phi$이고 방향은 바깥쪽입니다.` },
  { ch: 'ch09', id: 'divergence', title: '발산 정리 (가우스)', keys: ['발산 정리 (가우스)'],
    tags: 'divergence theorem gauss flux volume 발산 정리 가우스 유량 부피',
    sketch: R`영역이 세 좌표 방향 모두로 단순한 경우를 증명합니다. 일반 영역은 이런 조각으로 나누면 맞닿은 면의 유량이 상쇄됩니다.`,
    stmt: R`$\displaystyle\iiint_T\operatorname{div}\mathbf F\,dV=\oiint_S\mathbf F\cdot\mathbf n\,dA$ ($\mathbf n$은 바깥 법선).`,
    body: R`
세 성분을 따로 보이면 되므로 $\displaystyle\iiint_T\frac{\partial F_3}{\partial z}\,dV=\oiint_SF_3\,n_3\,dA$를 보입니다. $T=\{(x,y)\in R,\ g(x,y)\le z\le h(x,y)\}$로 쓰면
$$\iiint_T\frac{\partial F_3}{\partial z}\,dV=\iint_R\big[F_3(x,y,h)-F_3(x,y,g)\big]dx\,dy$$
- 윗면 $z=h$: 바깥(위쪽) 법선 $\mathbf N=(-h_x,-h_y,1)$이므로 $\iint F_3n_3\,dA=\iint_RF_3(x,y,h)\,dx\,dy$.
- 아랫면 $z=g$: 바깥(아래쪽) 법선 $\mathbf N=(g_x,g_y,-1)$이므로 $-\iint_RF_3(x,y,g)\,dx\,dy$.
- 옆면: 수직이므로 $n_3=0$.

합이 좌변과 같습니다. $x$, $y$ 성분도 같은 방법으로 보이고 더하면 정리입니다.` },
  { ch: 'ch09', id: 'stokes', title: '스토크스 정리', keys: ['스토크스 정리'],
    tags: 'stokes theorem curl circulation surface boundary 스토크스 정리 회전 순환 경계',
    sketch: R`곡면이 그래프 $z=f(x,y)$인 경우를 그린 정리로 증명합니다. $\mathbf F=(F_1,0,0)$ 성분만 보이며 나머지 성분도 같습니다.`,
    stmt: R`$\displaystyle\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=\oint_C\mathbf F\cdot d\mathbf r$ (방향은 오른손 법칙).`,
    body: R`
$S: z=f(x,y)$, $(x,y)\in R$, 위쪽 법선 $\mathbf N=(-f_x,-f_y,1)$이고 $C$는 $R$의 경계 $C^*$ 위로 올라간 곡선입니다. $\mathbf F=(F_1,0,0)$이면 $\operatorname{curl}\mathbf F=(0,\ \partial_zF_1,\ -\partial_yF_1)$이므로
$$\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=\iint_R\big(-F_{1,z}f_y-F_{1,y}\big)\,dx\,dy$$
오른쪽: $\oint_CF_1\,dx=\oint_{C^*}G\,dx$, $G(x,y)=F_1(x,y,f(x,y))$. 그린 정리로 $\oint_{C^*}G\,dx=-\iint_RG_y\,dx\,dy$이고 연쇄법칙으로 $G_y=F_{1,y}+F_{1,z}f_y$. 두 식이 같습니다.` },
  );
})();
