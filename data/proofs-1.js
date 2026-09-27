/* 증명 — 01 1계 ODE, 02 2계·고계 선형 ODE */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'separable', title: '변수분리형 풀이의 정당성', keys: ['변수분리와 동차형 치환'],
    tags: 'separable variables 변수분리 연쇄법칙 chain rule',
    stmt: R`$g(y)\,y'=f(x)$의 해는 $\displaystyle\int g(y)\,dy=\int f(x)\,dx+c$를 만족한다.`,
    body: R`
$G$를 $g$의 원시함수, 곧 $G'(y)=g(y)$인 함수라 합시다. $y=y(x)$가 해일 때 연쇄법칙으로
$$\frac{d}{dx}G(y(x))=G'(y)\,y'=g(y)\,y'=f(x)$$
양변을 $x$로 적분하면 $G(y(x))=\int f(x)\,dx+c$, 곧 $\int g(y)\,dy=\int f(x)\,dx+c$입니다.

거꾸로 이 관계를 만족하는 미분가능한 $y(x)$는 같은 계산을 거꾸로 따라가 $g(y)\,y'=f(x)$를 만족합니다. $dy$와 $dx$를 양변으로 갈라 놓는 계산은 이 연쇄법칙을 줄여 쓴 것입니다.

$y'=f(x)\,h(y)$ 꼴이면 $h(y)\ne0$인 곳에서 $g=1/h$로 두어 $\int\frac{dy}{h(y)}=\int f(x)\,dx+c$를 얻습니다. $h(y_0)=0$인 상수해 $y\equiv y_0$은 이 나눗셈에서 빠지므로 따로 확인해야 합니다.` },
  { ch: 'ch01', id: 'homog', title: '동차형 방정식의 치환 $u=y/x$', keys: ['변수분리와 동차형 치환'],
    tags: 'homogeneous substitution 동차형 치환',
    stmt: R`$y'=f(y/x)$에서 $u=y/x$로 두면 $\dfrac{du}{f(u)-u}=\dfrac{dx}{x}$로 변수분리된다.`,
    body: R`
$y=ux$를 곱의 미분법으로 미분하면 $y'=u+xu'$입니다. 방정식에 넣으면
$$u+xu'=f(u)\quad\Longrightarrow\quad xu'=f(u)-u$$
$f(u)-u\ne0$이면 양변을 $x\big(f(u)-u\big)$로 나누어 $\dfrac{u'}{f(u)-u}=\dfrac1x$, 즉 변수분리형이 됩니다.

$f(u_0)=u_0$인 상수 $u_0$가 있으면 $y=u_0x$도 해이므로 따로 적어야 합니다.` },
  { ch: 'ch01', id: 'exact', title: '완전성 조건 $M_y=N_x$', keys: ['완전성 조건과 적분인자'],
    tags: 'exact equation total differential potential 완전미분 전미분 슈바르츠',
    stmt: R`직사각형 영역에서 $M,N$과 그 1계 편도함수가 연속일 때, $M\,dx+N\,dy$가 어떤 $u$의 전미분일 필요충분조건은 $\dfrac{\partial M}{\partial y}=\dfrac{\partial N}{\partial x}$이다.`,
    body: R`
**필요조건.** $M=u_x$, $N=u_y$이면 $M_y=u_{xy}$, $N_x=u_{yx}$입니다. 2계 편도함수가 연속이면 혼합편미분의 순서를 바꿀 수 있으므로(슈바르츠 정리) $M_y=N_x$.

**충분조건.** $M_y=N_x$라 하고
$$u(x,y)=\int_{x_0}^{x}M(s,y)\,ds+k(y)$$
로 두면 $u_x=M$입니다. $y$로 미분하면
$$u_y=\int_{x_0}^{x}M_y(s,y)\,ds+k'(y)=\int_{x_0}^{x}N_x(s,y)\,ds+k'(y)=N(x,y)-N(x_0,y)+k'(y)$$
$k(y)=\int_{y_0}^{y}N(x_0,t)\,dt$로 고르면 $u_y=N$입니다. 따라서 $du=M\,dx+N\,dy$이고, 해곡선을 따라 $du=0$이므로 해는 $u(x,y)=c$입니다.` },
  { ch: 'ch01', id: 'intfactor', title: '적분인자 $F(x)$, $F^*(y)$의 공식', keys: ['완전성 조건과 적분인자'],
    tags: 'integrating factor 적분인자',
    stmt: R`$R=\frac1N(M_y-N_x)$가 $x$만의 함수이면 $F(x)=\exp\int R\,dx$를 곱한 식은 완전하다. $R^*=\frac1M(N_x-M_y)$가 $y$만의 함수이면 $F^*(y)=\exp\int R^*\,dy$도 마찬가지이다.`,
    body: R`
$F\,M\,dx+F\,N\,dy=0$의 완전성 조건은 $(FM)_y=(FN)_x$입니다. $F$가 $x$만의 함수이면 $F_y=0$이므로
$$FM_y=F'N+FN_x\quad\Longrightarrow\quad\frac{F'}{F}=\frac1N\big(M_y-N_x\big)=R$$
$R$이 $x$만의 함수이면 이 식은 $F$에 대한 변수분리형이고 $\ln|F|=\int R\,dx$, 즉 $F=\exp\int R\,dx$가 조건을 만족합니다.

$F^*(y)$일 때는 $F^*_x=0$이므로 $F^{*\prime}M+F^*M_y=F^*N_x$, 즉 $\dfrac{F^{*\prime}}{F^*}=\dfrac1M(N_x-M_y)=R^*$입니다.` },
  { ch: 'ch01', id: 'linear', title: '선형 ODE의 해 공식', keys: ['선형 ODE의 해 공식'],
    tags: 'linear first order integrating factor 선형 해공식 적분인자',
    stmt: R`$y'+p(x)y=r(x)$의 일반해는 $y=e^{-h}\Big(\displaystyle\int e^{h}r\,dx+c\Big)$, $h=\int p\,dx$이다.`,
    body: R`
$h'=p$이므로 곱의 미분법에서
$$\big(e^{h}y\big)'=e^{h}y'+h'e^{h}y=e^{h}\big(y'+py\big)=e^{h}r$$
양변을 적분하면 $e^{h}y=\int e^{h}r\,dx+c$이고, $e^{-h}$를 곱하면 공식이 됩니다.

모든 해가 이 식을 만족해야 하므로(위 계산은 가역적) 이것이 일반해입니다. $e^{h}$는 이 방정식을 완전형으로 만드는 적분인자 $F(x)$이기도 합니다.` },
  { ch: 'ch01', id: 'bernoulli', title: '베르누이 방정식의 선형화', keys: ['선형 ODE의 해 공식'],
    tags: 'bernoulli logistic 베르누이 로지스틱',
    stmt: R`$y'+py=gy^{a}\ (a\ne0,1)$에서 $u=y^{1-a}$는 $u'+(1-a)pu=(1-a)g$를 만족한다.`,
    body: R`
$u=y^{1-a}$를 미분하면 $u'=(1-a)y^{-a}y'$입니다. 방정식에서 $y'=gy^{a}-py$를 넣으면
$$u'=(1-a)y^{-a}\big(gy^{a}-py\big)=(1-a)\big(g-py^{1-a}\big)=(1-a)g-(1-a)pu$$
정리하면 $u'+(1-a)pu=(1-a)g$로 $u$에 대한 선형 방정식입니다.

로지스틱 방정식 $y'=Ay-By^2$는 $p=-A$, $g=-B$, $a=2$인 경우라 $u=1/y$가 $u'+Au=B$를 만족합니다.` },
  { ch: 'ch01', id: 'cooling', title: '뉴턴 냉각 법칙의 해와 반감기', keys: ['대표 모델'],
    tags: 'newton cooling exponential decay half-life 냉각 반감기 지수 감소',
    stmt: R`$T'=-k(T-T_A)$, $T(0)=T_0$의 해는 $T=T_A+(T_0-T_A)e^{-kt}$이다. 또 $y'=ky\ (k<0)$의 반감기는 $\ln2/|k|$이다.`,
    body: R`
$w=T-T_A$로 두면 $T_A$가 상수이므로 $w'=T'=-kw$입니다. 변수분리하면 $w=w_0e^{-kt}$이고 $w_0=T_0-T_A$. 되돌리면 공식입니다.

반감기: $y_0e^{kt}=\tfrac12y_0$에서 $kt=-\ln2$, 따라서 $t=\ln2/|k|$. 반감기는 처음 양 $y_0$와 무관합니다.` },
  { ch: 'ch01', id: 'picard', title: '존재·유일성 정리 (피카르 반복)', keys: ['존재·유일성 정리'],
    tags: 'existence uniqueness picard lipschitz iteration 존재 유일성 피카르 립시츠',
    sketch: R`표준 증명의 핵심 단계를 보입니다. $\partial f/\partial y$가 연속이면 평균값 정리로 립시츠 조건 $|f(x,y)-f(x,z)|\le L|y-z|$이 성립한다는 사실을 씁니다.`,
    stmt: R`직사각형 $R$에서 $f$와 $\partial f/\partial y$가 연속이고 $|f|\le K$이면, IVP $y'=f(x,y)$, $y(x_0)=y_0$는 $|x-x_0|\le\alpha=\min(a,b/K)$에서 유일한 해를 가진다.`,
    body: R`
IVP는 적분방정식 $y(x)=y_0+\displaystyle\int_{x_0}^{x}f(t,y(t))\,dt$와 같습니다(양변을 미분하면 원래 식).

**반복열.** $y_0(x)\equiv y_0$, $y_{n+1}(x)=y_0+\displaystyle\int_{x_0}^{x}f(t,y_n(t))\,dt$로 정의합니다. $|y_{n+1}-y_0|\le K|x-x_0|\le K\alpha\le b$이므로 모든 $y_n$이 $R$ 안에 머뭅니다.

**수렴.** 립시츠 조건으로 귀납하면
$$|y_{n+1}(x)-y_n(x)|\le\frac{KL^{n}|x-x_0|^{n+1}}{(n+1)!}$$
우변의 합은 수렴하므로($e^{L\alpha}$ 꼴) $y_n$은 고르게 수렴하고, 극한 $y$는 적분방정식을 만족합니다.

**유일성.** 두 해 $y,z$에 대해 $w=|y-z|\le M$이라 하면 $w(x)\le L\Big|\displaystyle\int_{x_0}^{x}w\,dt\Big|$. 이 부등식을 $n$번 반복하면
$$w(x)\le M\frac{\big(L|x-x_0|\big)^{n}}{n!}\xrightarrow{n\to\infty}0$$
이므로 $y=z$입니다.` },
  // ───── 02
  { ch: 'ch02', id: 'superposition', title: '중첩 원리와 일반해의 구조', keys: ['동차 선형 ODE의 기본 정리 (교재 Theorem 1)', '비동차 ODE의 일반해 (교재 Theorem 2)'],
    tags: 'superposition linear homogeneous nonhomogeneous 중첩 선형 동차 비동차 일반해',
    stmt: R`동차 선형 방정식의 해의 일차결합은 해이다. 비동차 방정식의 모든 해는 $y=y_h+y_p$ 꼴이다.`,
    body: R`
$L[y]=y''+py'+qy$라 두면 미분의 선형성에서
$$L[c_1y_1+c_2y_2]=c_1L[y_1]+c_2L[y_2]$$
$L[y_1]=L[y_2]=0$이면 좌변도 0입니다.

$L[y_p]=r$인 특수해가 있을 때, 임의의 해 $y$에 대해 $L[y-y_p]=r-r=0$이므로 $y-y_p$는 동차해 $y_h$입니다. 따라서 모든 해는 $y_h+y_p$ 꼴입니다. 반면 $L[y_1+y_2]=2r\ne r$이므로 비동차 방정식의 해끼리 더하면 해가 되지 않습니다.` },
  { ch: 'ch02', id: 'reduction', title: '계수 내림법 공식', keys: ['계수 내림법'],
    tags: 'reduction of order 계수 내림법 두 번째 해',
    stmt: R`$y_1$이 $y''+py'+qy=0$의 해이면 $y_2=y_1\displaystyle\int U\,dx$, $U=\dfrac1{y_1^2}e^{-\int p\,dx}$도 해이고 $y_1$과 일차독립이다.`,
    body: R`
$y_2=uy_1$을 대입합니다. $y_2'=u'y_1+uy_1'$, $y_2''=u''y_1+2u'y_1'+uy_1''$이므로
$$u''y_1+u'\big(2y_1'+py_1\big)+u\big(y_1''+py_1'+qy_1\big)=0$$
마지막 괄호는 $y_1$이 해이므로 0입니다. $U=u'$로 두면
$$U'+\Big(\frac{2y_1'}{y_1}+p\Big)U=0\quad\Longrightarrow\quad\ln|U|=-2\ln|y_1|-\int p\,dx$$
즉 $U=\dfrac1{y_1^2}e^{-\int p\,dx}$. $U>0$이므로 $u=\int U\,dx$는 상수가 아니고, $y_2/y_1=u$가 상수가 아니라 두 해는 독립입니다.` },
  { ch: 'ch02', id: 'charcases', title: '특성방정식의 중근과 복소근', keys: ['특성방정식의 세 경우'],
    tags: 'characteristic equation double root complex root euler formula 특성방정식 중근 복소근 오일러 공식',
    stmt: R`$y''+ay'+by=0$에서 중근 $\lambda=-a/2$이면 $xe^{\lambda x}$도 해이고, 복소근 $-\tfrac a2\pm i\omega$이면 $e^{-ax/2}\cos\omega x$, $e^{-ax/2}\sin\omega x$가 해이다.`,
    body: R`
$y=e^{\lambda x}$를 넣으면 $(\lambda^2+a\lambda+b)e^{\lambda x}$이므로 특성근이면 해입니다.

**중근.** $a^2=4b$, $\lambda=-a/2$. $y=xe^{\lambda x}$를 넣으면
$$y''+ay'+by=x(\lambda^2+a\lambda+b)e^{\lambda x}+(2\lambda+a)e^{\lambda x}=0$$
두 괄호가 모두 0이기 때문입니다($2\lambda+a=0$).

**복소근.** $\lambda=\alpha\pm i\omega$, $\alpha=-a/2$. 오일러 공식으로 복소해
$$e^{\lambda x}=e^{\alpha x}(\cos\omega x+i\sin\omega x)$$
를 얻습니다. 계수가 실수이므로 $L[\Re y]=\Re L[y]=0$, $L[\Im y]=\Im L[y]=0$이고, 실수부와 허수부가 각각 실해입니다. 둘의 비가 $\tan\omega x$로 상수가 아니므로 독립입니다.` },
  { ch: 'ch02', id: 'eulercauchy', title: '오일러-코시 방정식의 보조방정식', keys: ['오일러-코시 방정식'],
    tags: 'euler cauchy auxiliary equation 오일러 코시 보조방정식 로그',
    stmt: R`$x^2y''+axy'+by=0$에 $y=x^m$을 넣으면 $m^2+(a-1)m+b=0$을 얻는다. 중근이면 $x^m\ln x$도 해이다.`,
    body: R`
$y'=mx^{m-1}$, $y''=m(m-1)x^{m-2}$이므로
$$x^2y''+axy'+by=\big[m(m-1)+am+b\big]x^m=\big[m^2+(a-1)m+b\big]x^m$$

**중근** $m=\tfrac{1-a}{2}$: 표준형에서 $p=a/x$이므로 계수 내림법의 $U=x^{-2m}e^{-a\ln x}=x^{-2m-a}=x^{-1}$ ($2m=1-a$). $u=\ln x$이므로 $y_2=x^m\ln x$.

**복소근** $\mu\pm i\nu$: $x^{i\nu}=e^{i\nu\ln x}=\cos(\nu\ln x)+i\sin(\nu\ln x)$의 실수부와 허수부가 해입니다.

다른 방법: $x=e^{t}$로 두면 $xy'=\dot y$, $x^2y''=\ddot y-\dot y$이므로 방정식은 상수계수 $\ddot y+(a-1)\dot y+by=0$이 되고, 세 경우가 그대로 옮겨집니다.` },
  { ch: 'ch02', id: 'wronskian', title: '아벨 공식과 론스키안 판정', keys: ['론스키안'],
    tags: 'wronskian abel linear independence 론스키안 아벨 일차독립 종속',
    stmt: R`두 해의 론스키안은 $W=c\,e^{-\int p\,dx}$이고, 두 해가 일차종속일 필요충분조건은 어떤 점에서 $W=0$인 것이다.`,
    body: R`
$W'=(y_1y_2'-y_2y_1')'=y_1y_2''-y_2y_1''$. $y_i''=-py_i'-qy_i$를 넣으면 $q$ 항이 지워져
$$W'=-p\,(y_1y_2'-y_2y_1')=-pW\quad\Longrightarrow\quad W=c\,e^{-\int p\,dx}$$
지수함수는 0이 아니므로 $W$는 항상 0이거나 한 번도 0이 아닙니다.

**종속 ⇒ $W=0$.** $y_2=ky_1$이면 $W=y_1\cdot ky_1'-ky_1\cdot y_1'=0$.

**W=0 ⇒ 종속.** $W(x_0)=0$이면 연립방정식 $c_1y_1(x_0)+c_2y_2(x_0)=0$, $c_1y_1'(x_0)+c_2y_2'(x_0)=0$의 계수 행렬식이 0이라 자명하지 않은 해 $(c_1,c_2)$가 있습니다. $y=c_1y_1+c_2y_2$는 $y(x_0)=y'(x_0)=0$인 해이고, 유일성 정리에 의해 $y\equiv0$. 즉 종속입니다.` },
  { ch: 'ch02', id: 'varparam', title: '매개변수 변환법 공식', keys: ['매개변수 변환법'],
    tags: 'variation of parameters 매개변수 변환법 론스키안 크래머',
    stmt: R`$y_p=-y_1\displaystyle\int\frac{y_2r}{W}dx+y_2\int\frac{y_1r}{W}dx$는 $y''+py'+qy=r$의 해이다.`,
    body: R`
$y_p=u_1y_1+u_2y_2$로 두고 조건 하나를 덧붙입니다: $u_1'y_1+u_2'y_2=0$. 그러면
$$y_p'=u_1y_1'+u_2y_2',\qquad y_p''=u_1'y_1'+u_2'y_2'+u_1y_1''+u_2y_2''$$
방정식에 넣으면 $y_1,y_2$가 동차해이므로 $u_1,u_2$ 항이 모두 사라지고
$$u_1'y_1'+u_2'y_2'=r$$
두 식을 연립해 크래머 공식으로 풀면 (계수 행렬식이 $W\ne0$)
$$u_1'=\frac{\begin{vmatrix}0&y_2\\r&y_2'\end{vmatrix}}{W}=-\frac{y_2r}{W},\qquad u_2'=\frac{\begin{vmatrix}y_1&0\\y_1'&r\end{vmatrix}}{W}=\frac{y_1r}{W}$$
적분하면 공식입니다.` },
  { ch: 'ch02', id: 'modrule', title: '미정계수법의 수정 규칙', keys: ['미정계수법 표와 규칙'],
    tags: 'undetermined coefficients modification rule operator 미정계수법 수정 규칙 연산자',
    stmt: R`$y''+ay'+by=ke^{\gamma x}$에서 $\gamma$가 특성방정식의 단근이면 $y_p=Cxe^{\gamma x}$, 중근이면 $y_p=Cx^2e^{\gamma x}$ 꼴의 해가 있다.`,
    body: R`
특성다항식 $P(\lambda)=\lambda^2+a\lambda+b$와 미분연산자 $D$로 방정식은 $P(D)y=ke^{\gamma x}$이고, $P(D)e^{\gamma x}=P(\gamma)e^{\gamma x}$입니다. 또 $(D-\gamma)(x^ne^{\gamma x})=nx^{n-1}e^{\gamma x}$입니다.

- $P(\gamma)\ne0$: $y_p=\dfrac{k}{P(\gamma)}e^{\gamma x}$.
- 단근: $P(\lambda)=(\lambda-\gamma)(\lambda-\mu)$, $\mu\ne\gamma$. $P(D)(xe^{\gamma x})=(D-\mu)e^{\gamma x}=(\gamma-\mu)e^{\gamma x}$이므로 $C=\dfrac{k}{\gamma-\mu}$.
- 중근: $P(D)=(D-\gamma)^2$, $(D-\gamma)^2(x^2e^{\gamma x})=(D-\gamma)(2xe^{\gamma x})=2e^{\gamma x}$이므로 $C=\dfrac k2$.

동차해에는 $P(D)$가 0을 돌려주어 우변을 만들 수 없으므로 $x$를 곱해야 합니다. 삼각함수 우변은 $\gamma=i\omega$로 두고 같은 논리를 씁니다.` },
  { ch: 'ch02', id: 'damping', title: '감쇠의 세 경우', keys: ['자유진동: 감쇠의 세 경우'],
    tags: 'damping overdamped critical underdamped 과감쇠 임계감쇠 부족감쇠 질량 스프링',
    stmt: R`$my''+cy'+ky=0$은 $c^2>4mk$이면 과감쇠, $c^2=4mk$이면 임계감쇠, $c^2<4mk$이면 $e^{-\alpha t}(A\cos\omega^*t+B\sin\omega^*t)$ 꼴의 감쇠 진동이다.`,
    body: R`
특성방정식 $m\lambda^2+c\lambda+k=0$의 근은
$$\lambda=\frac{-c\pm\sqrt{c^2-4mk}}{2m}=-\alpha\pm\frac{\sqrt{c^2-4mk}}{2m},\qquad\alpha=\frac{c}{2m}$$
- $c^2>4mk$: $\sqrt{c^2-4mk}<c$이므로 두 근 모두 음의 실수. 진동 없이 감소합니다.
- $c^2=4mk$: 중근 $-\alpha$. $y=(c_1+c_2t)e^{-\alpha t}$.
- $c^2<4mk$: $\lambda=-\alpha\pm i\omega^*$, $\omega^*=\dfrac{\sqrt{4mk-c^2}}{2m}=\sqrt{\dfrac km-\dfrac{c^2}{4m^2}}$. 복소근의 경우로 감쇠 진동입니다.` },
  { ch: 'ch02', id: 'resonance', title: '공진 해와 정상상태 진폭', keys: ['감쇠와 공진'],
    tags: 'resonance amplitude forced oscillation steady state 공진 진폭 강제진동 정상상태',
    stmt: R`$my''+ky=F_0\cos\omega_0t$ ($\omega_0^2=k/m$)의 특수해는 $\dfrac{F_0}{2m\omega_0}t\sin\omega_0t$이다. 감쇠가 있으면 정상상태 진폭은 $\dfrac{F_0}{\sqrt{m^2(\omega_0^2-\omega^2)^2+\omega^2c^2}}$이다.`,
    body: R`
**공진.** $y=t\sin\omega_0t$이면 $y''=2\omega_0\cos\omega_0t-\omega_0^2t\sin\omega_0t$이고, $k=m\omega_0^2$이므로
$$my''+ky=2m\omega_0\cos\omega_0t$$
따라서 $\dfrac{F_0}{2m\omega_0}t\sin\omega_0t$가 특수해입니다.

**감쇠 진폭.** 복소 입력 $F_0e^{i\omega t}$에 $y=Ae^{i\omega t}$를 넣으면 $(k-m\omega^2+ic\omega)A=F_0$.
$$|A|=\frac{F_0}{\big|m(\omega_0^2-\omega^2)+ic\omega\big|}=\frac{F_0}{\sqrt{m^2(\omega_0^2-\omega^2)^2+\omega^2c^2}}$$
실제 입력 $F_0\cos\omega t=\Re(F_0e^{i\omega t})$의 응답은 $\Re(Ae^{i\omega t})$이고 진폭은 $|A|$입니다. 동차해는 $e^{-ct/2m}$으로 사라지므로 이것이 정상상태 진폭입니다.` },
  { ch: 'ch02', id: 'multiroot', title: R`중복근에서 $x^ke^{\lambda x}$가 해인 이유`, keys: ['고계 상수계수 방정식'],
    tags: 'higher order multiple root operator 고계 중복근 연산자',
    stmt: R`상수계수 방정식 $P(D)y=0$에서 $\lambda_0$가 특성다항식의 $m$중근이면 $x^ke^{\lambda_0x}$ ($k=0,\dots,m-1$)는 해이다.`,
    body: R`
$P(\lambda)=(\lambda-\lambda_0)^mQ(\lambda)$이고, 상수계수 연산자는 서로 교환되므로 $P(D)=Q(D)(D-\lambda_0)^m$입니다.
$$(D-\lambda_0)\big(x^ke^{\lambda_0x}\big)=kx^{k-1}e^{\lambda_0x}+\lambda_0x^ke^{\lambda_0x}-\lambda_0x^ke^{\lambda_0x}=kx^{k-1}e^{\lambda_0x}$$
$(D-\lambda_0)$를 적용할 때마다 $x$의 차수가 하나씩 내려가므로, $k<m$이면 $m$번 적용한 결과는 0입니다. 따라서 $P(D)(x^ke^{\lambda_0x})=0$.` },
  );
})();
