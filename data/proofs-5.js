/* 증명 — 10 푸리에 해석, 11 편미분방정식 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 10
  { ch: 'ch10', id: 'orthogonality', title: '삼각함수계의 직교성', keys: ['푸리에 계수 (주기 2L)'],
    tags: 'orthogonality trigonometric system 직교성 삼각함수계',
    stmt: R`$m,n\ge1$일 때 $\displaystyle\int_{-L}^{L}\cos\frac{m\pi x}{L}\cos\frac{n\pi x}{L}dx=\int_{-L}^{L}\sin\frac{m\pi x}{L}\sin\frac{n\pi x}{L}dx=\begin{cases}0&m\ne n\\L&m=n\end{cases}$이고, $\cos$과 $\sin$의 곱의 적분은 항상 0이다.`,
    body: R`
정수 $k\ne0$이면 $\cos\frac{k\pi x}{L}$은 $[-L,L]$에서 정확히 $|k|$주기를 돌므로 적분이 0입니다. 곱을 합으로 바꾸면
$$\cos A\cos B=\tfrac12\big[\cos(A-B)+\cos(A+B)\big],\qquad \sin A\sin B=\tfrac12\big[\cos(A-B)-\cos(A+B)\big]$$
$A=\frac{m\pi x}L$, $B=\frac{n\pi x}L$로 두면 $m\ne n$일 때 두 항 모두 적분이 0입니다. $m=n$이면 $\cos(A-B)=1$만 남아 $\tfrac12\cdot2L=L$.

$\cos\cdot\sin$은 기함수이므로 대칭 구간에서 적분이 0입니다.` },
  { ch: 'ch10', id: 'euler-coeff', title: '푸리에 계수의 오일러 공식', keys: ['푸리에 계수 (주기 2L)'],
    tags: 'euler formulas fourier coefficients 오일러 공식 푸리에 계수',
    sketch: R`급수가 수렴하고 항별 적분이 가능하다고(예: 고른 수렴) 가정하고 계수를 구합니다.`,
    stmt: R`$f=a_0+\sum(a_n\cos\frac{n\pi x}L+b_n\sin\frac{n\pi x}L)$이면 $a_0=\frac1{2L}\int f$, $a_n=\frac1L\int f\cos\frac{n\pi x}L$, $b_n=\frac1L\int f\sin\frac{n\pi x}L$ (적분 구간 $[-L,L]$).`,
    body: R`
양변을 $[-L,L]$에서 적분하면 삼각함수 항은 모두 0이므로 $\int f\,dx=2La_0$.

양변에 $\cos\frac{m\pi x}L$을 곱해 적분하면 직교성에 의해 $n=m$인 코사인 항만 남습니다.
$$\int_{-L}^Lf\cos\frac{m\pi x}{L}\,dx=a_m\cdot L$$
사인을 곱하면 같은 방법으로 $b_m$이 나옵니다. 급수의 "좌표"를 내적으로 뽑아내는 것과 같습니다.` },
  { ch: 'ch10', id: 'convergence', title: '푸리에 급수의 수렴 정리', keys: ['푸리에 계수 (주기 2L)', '수렴 정리 (교재 Theorem 1)'],
    tags: 'convergence dirichlet kernel riemann lebesgue jump average 수렴 정리 디리클레 핵 리만 르베그 불연속 평균',
    sketch: R`디리클레 핵과 리만–르베그 보조정리를 이용한 증명의 개요입니다 ($L=\pi$).`,
    stmt: R`$f$가 구간별 연속이고 각 점에서 좌우 미분계수가 있으면, 푸리에 급수는 각 점에서 $\tfrac12\big[f(x^+)+f(x^-)\big]$로 수렴한다.`,
    body: R`
부분합에 계수 공식을 넣고 정리하면
$$S_N(x)=\frac1\pi\int_{-\pi}^{\pi}f(x+t)D_N(t)\,dt,\qquad D_N(t)=\frac12+\sum_{k=1}^N\cos kt=\frac{\sin\big((N+\tfrac12)t\big)}{2\sin(t/2)}$$
$\int_0^\pi D_N\,dt=\frac\pi2$이므로
$$S_N(x)-\frac{f(x^+)+f(x^-)}2=\frac1\pi\int_0^\pi\big[f(x+t)-f(x^+)\big]D_N\,dt+\frac1\pi\int_{-\pi}^0\big[f(x+t)-f(x^-)\big]D_N\,dt$$
첫 적분을 $\int_0^\pi g(t)\sin\big((N+\tfrac12)t\big)dt$, $g(t)=\dfrac{f(x+t)-f(x^+)}{2\sin(t/2)}$로 쓰면, 오른쪽 미분계수가 있어 $g$는 $t\to0^+$에서 유계입니다. 리만–르베그 보조정리(적분가능한 $g$에 대해 $\int g(t)\sin\lambda t\,dt\to0$)에 의해 0으로 갑니다. 둘째 적분도 같습니다.` },
  { ch: 'ch10', id: 'evenodd', title: '우함수·기함수와 반구간 전개', keys: ['우함수·기함수 급수'],
    tags: 'even odd function half-range expansion cosine sine series 우함수 기함수 반구간 전개',
    stmt: R`$f$가 우함수이면 $b_n=0$, $a_0=\frac1L\int_0^Lf$, $a_n=\frac2L\int_0^Lf\cos\frac{n\pi x}L$. 기함수이면 $a_n=0$, $b_n=\frac2L\int_0^Lf\sin\frac{n\pi x}L$.`,
    body: R`
대칭 구간에서 기함수의 적분은 0이고, 우함수의 적분은 $2\int_0^L$입니다.
- $f$ 우함수: $f\cos$는 우함수, $f\sin$은 기함수이므로 $b_n=0$이고 $a_n=\frac1L\cdot2\int_0^Lf\cos$.
- $f$ 기함수: $f\cos$가 기함수라 $a_0=a_n=0$, $f\sin$은 우함수라 $b_n=\frac2L\int_0^Lf\sin$.

$(0,L)$에서만 주어진 $f$를 우함수로 확장하면 위 첫째 경우가 되어 코사인 반구간 전개를, 기함수로 확장하면 사인 반구간 전개를 얻습니다. 확장한 함수의 적분에는 원래 $f$만 들어가므로 공식이 $(0,L)$ 위의 적분으로 쓰입니다.` },
  { ch: 'ch10', id: 'complex-form', title: '복소 푸리에 계수', keys: ['복소 형식과 파세발 항등식'],
    tags: 'complex fourier series coefficient 복소 푸리에 급수 계수',
    stmt: R`$c_n=\dfrac1{2L}\displaystyle\int_{-L}^Lf(x)e^{-in\pi x/L}dx$이고 $c_0=a_0$, $c_n=\tfrac12(a_n-ib_n)$, $c_{-n}=\overline{c_n}$ ($f$ 실수).`,
    body: R`
$\theta=\frac{n\pi x}L$로 두고 $\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2$, $\sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}$를 넣으면
$$a_n\cos\theta+b_n\sin\theta=\frac{a_n-ib_n}{2}e^{i\theta}+\frac{a_n+ib_n}{2}e^{-i\theta}$$
따라서 $c_n=\frac12(a_n-ib_n)$, $c_{-n}=\frac12(a_n+ib_n)$. 오일러 공식에 넣어 확인하면
$$\frac1{2L}\int f\,e^{-i\theta}dx=\frac1{2L}\int f\cos\theta\,dx-\frac{i}{2L}\int f\sin\theta\,dx=\frac{a_n-ib_n}2$$
$\int_{-L}^Le^{i(m-n)\pi x/L}dx=2L\delta_{mn}$ (직교성)을 쓰면 급수에서 직접 $c_n$을 뽑을 수도 있습니다.` },
  { ch: 'ch10', id: 'parseval', title: '파세발 항등식', keys: ['복소 형식과 파세발 항등식'],
    tags: 'parseval identity energy bessel inequality 파세발 항등식 에너지',
    sketch: R`급수를 곱해 항별로 적분할 수 있다고 가정합니다(제곱적분가능한 $f$에서는 실제로 성립).`,
    stmt: R`$2a_0^2+\displaystyle\sum_{n=1}^\infty(a_n^2+b_n^2)=\frac1L\int_{-L}^Lf^2\,dx$.`,
    body: R`
$f^2=f\cdot\big(a_0+\sum(a_n\cos+b_n\sin)\big)$를 적분하고 계수 공식을 쓰면
$$\int_{-L}^Lf^2dx=a_0\int f+\sum\Big(a_n\int f\cos+b_n\int f\sin\Big)=a_0\cdot2La_0+\sum\big(a_n\cdot La_n+b_n\cdot Lb_n\big)$$
양변을 $L$로 나누면 항등식입니다. 기하학적으로는 직교 기저에서의 피타고라스 정리입니다. 부분합만 쓰면 등호 대신 $\le$가 성립하는데(베셀 부등식), 이 때문에 $a_n,b_n\to0$입니다.` },
  { ch: 'ch10', id: 'fourier-integral', title: '푸리에 적분 공식의 유도', keys: ['푸리에 적분', '존재 조건 (교재 Theorem 1)'],
    tags: 'fourier integral limit period to infinity 푸리에 적분 주기 무한대',
    sketch: R`$L\to\infty$ 극한을 형식적으로 취하는 유도입니다. $\int|f|\,dx<\infty$를 가정합니다.`,
    stmt: R`$f(x)=\displaystyle\int_0^\infty\big[A(w)\cos wx+B(w)\sin wx\big]dw$, $A=\frac1\pi\int f(v)\cos wv\,dv$, $B=\frac1\pi\int f(v)\sin wv\,dv$.`,
    body: R`
주기 $2L$로 자른 $f_L$의 급수에서 $w_n=\frac{n\pi}L$, $\Delta w=\frac\pi L$로 쓰면
$$f_L(x)=\frac1{2L}\int_{-L}^Lf\,dv+\frac1\pi\sum_{n=1}^\infty\Big[\cos w_nx\int_{-L}^Lf(v)\cos w_nv\,dv+\sin w_nx\int_{-L}^Lf(v)\sin w_nv\,dv\Big]\Delta w$$
$L\to\infty$이면 첫 항은 $\frac1{2L}\int|f|\to0$이고, 합은 $w$에 대한 리만합이므로 적분 $\int_0^\infty\cdots dw$가 됩니다. 이것이 공식이며, 불연속점에서의 수렴값은 급수와 같이 좌우 극한의 평균입니다.` },
  { ch: 'ch10', id: 'ft-props', title: '푸리에 변환의 미분·이동·합성곱 성질', keys: ['푸리에 변환 (Kreyszig 규약)'],
    tags: 'fourier transform derivative shift convolution 푸리에 변환 미분 이동 합성곱',
    stmt: R`$\mathcal F\{f'\}=iw\hat f$, $\mathcal F\{f(x-a)\}=e^{-iwa}\hat f$, $\mathcal F\{f*g\}=\sqrt{2\pi}\,\hat f\hat g$.`,
    body: R`
**미분.** 부분적분하고 $f\to0$ ($|x|\to\infty$)을 쓰면
$$\int f'e^{-iwx}dx=\Big[fe^{-iwx}\Big]_{-\infty}^{\infty}+iw\int fe^{-iwx}dx=iw\sqrt{2\pi}\,\hat f$$

**이동.** $u=x-a$로 치환하면 $\int f(x-a)e^{-iwx}dx=e^{-iwa}\int f(u)e^{-iwu}du$.

**합성곱.** $(f*g)(x)=\int f(p)g(x-p)\,dp$를 변환하고 $q=x-p$로 치환하면
$$\frac1{\sqrt{2\pi}}\iint f(p)g(q)e^{-iw(p+q)}dp\,dq=\frac1{\sqrt{2\pi}}\big(\sqrt{2\pi}\hat f\big)\big(\sqrt{2\pi}\hat g\big)=\sqrt{2\pi}\,\hat f\hat g$$` },
  { ch: 'ch10', id: 'gaussian', title: '가우스 함수의 푸리에 변환', keys: ['푸리에 변환 (Kreyszig 규약)'],
    tags: 'gaussian fourier transform completing square 가우스 함수 푸리에 변환 완전제곱',
    stmt: R`$a>0$이면 $\mathcal F\{e^{-ax^2}\}=\dfrac1{\sqrt{2a}}e^{-w^2/(4a)}$.`,
    body: R`
지수를 완전제곱합니다.
$$-ax^2-iwx=-a\Big(x+\frac{iw}{2a}\Big)^2-\frac{w^2}{4a}$$
적분 경로를 실수축에서 $\Im z=w/2a$인 평행선으로 옮겨도 값이 같으므로(피적분함수가 해석적이고 양 끝에서 빠르게 사라짐, 13단원 코시 정리)
$$\int_{-\infty}^{\infty}e^{-a(x+iw/2a)^2}dx=\int_{-\infty}^\infty e^{-ax^2}dx=\sqrt{\frac\pi a}$$
따라서 $\hat f=\dfrac1{\sqrt{2\pi}}\sqrt{\dfrac\pi a}\,e^{-w^2/4a}=\dfrac1{\sqrt{2a}}e^{-w^2/(4a)}$. 가우스 함수는 변환해도 가우스 함수입니다.` },
  { ch: 'ch10', id: 'min-square-error', title: '푸리에 부분합이 제곱 오차를 최소로 한다', keys: ['최소 제곱 오차 (교재 Theorem 1)'],
    tags: 'minimum square error approximation trigonometric polynomial best 최소 제곱 오차 근사 삼각다항식',
    stmt: R`차수 $N$ 삼각다항식 $F=A_0+\sum_{n\le N}(A_n\cos nx+B_n\sin nx)$ 중 $E=\int_{-\pi}^{\pi}(f-F)^2dx$를 최소로 하는 것은 계수가 푸리에 계수일 때이고, 최솟값은 $E^*=\int f^2-\pi\big[2a_0^2+\sum(a_n^2+b_n^2)\big]$이다.`,
    body: R`
$E=\int f^2-2\int fF+\int F^2$. 직교성으로 $\int F^2=\pi\big[2A_0^2+\sum(A_n^2+B_n^2)\big]$, 오일러 공식으로 $\int fF=\pi\big[2A_0a_0+\sum(A_na_n+B_nb_n)\big]$. 따라서 계수가 푸리에 계수일 때의 값 $E^*$를 빼면
$$E-E^*=\pi\Big[2(A_0-a_0)^2+\sum_{n=1}^N\big((A_n-a_n)^2+(B_n-b_n)^2\big)\Big]\ge0$$
이고 등호는 $A_n=a_n$, $B_n=b_n$일 때뿐입니다. 이것은 내적공간에서 정사영이 최선 근사라는 정리의 한 경우입니다.` },
  { ch: 'ch10', id: 'sl-orthogonality', title: '스투름–리우빌 고유함수의 직교성', keys: ['고유함수의 직교성 (교재 Theorem 1)'],
    tags: 'sturm liouville orthogonality eigenfunction weight self-adjoint 스투름 리우빌 직교성 고유함수 가중함수 자기수반',
    stmt: R`스투름–리우빌 문제의 서로 다른 고유값 $\lambda_m\ne\lambda_n$에 대응하는 고유함수는 $\int_a^b r\,y_my_n\,dx=0$을 만족한다.`,
    body: R`
두 방정식 $(py_m')'+(q+\lambda_mr)y_m=0$에 $y_n$을, $(py_n')'+(q+\lambda_nr)y_n=0$에 $y_m$을 곱해 빼면 $q$ 항이 지워지고
$$(\lambda_m-\lambda_n)\,r\,y_my_n=y_m(py_n')'-y_n(py_m')'=\Big[p\,(y_my_n'-y_ny_m')\Big]'$$
$a$에서 $b$까지 적분하면
$$(\lambda_m-\lambda_n)\int_a^br\,y_my_n\,dx=\Big[p\,(y_my_n'-y_ny_m')\Big]_a^b$$
**경계항이 0인 이유.** $x=b$에서 두 함수 모두 $l_1y+l_2y'=0$을 만족합니다. $l_2\ne0$이면 $y'=-\frac{l_1}{l_2}y$라 괄호가 $-\frac{l_1}{l_2}(y_my_n-y_ny_m)=0$, $l_2=0$이면 $y_m(b)=y_n(b)=0$. $x=a$도 같습니다. $p(a)=0$이면(특이 문제) 그 끝의 항은 조건 없이 0이고, $p(a)=p(b)$와 주기 조건이면 두 끝의 항이 상쇄됩니다.

$\lambda_m\ne\lambda_n$이므로 적분이 0입니다. 행렬에서 대칭행렬의 고유벡터가 직교하는 증명과 같은 구조입니다.` },
  { ch: 'ch10', id: 'gen-coeff', title: '일반화된 푸리에 계수 공식', keys: ['일반화된 푸리에 급수'],
    tags: 'generalized fourier series coefficient fourier legendre fourier bessel 일반화된 푸리에 급수 계수 르장드르 베셀',
    sketch: R`급수가 수렴하고 항별 적분이 가능하다고 가정합니다.`,
    stmt: R`직교계 $\{y_m\}$ (가중함수 $r$)에 대해 $f=\sum a_my_m$이면 $a_m=\dfrac{(f,y_m)}{\|y_m\|^2}$.`,
    body: R`
양변과 $y_n$의 가중 내적을 취하면 직교성 때문에 한 항만 남습니다.
$$(f,y_n)=\sum_ma_m(y_m,y_n)=a_n(y_n,y_n)=a_n\|y_n\|^2$$
르장드르 다항식은 $r=1$, $\|P_m\|^2=\frac2{2m+1}$이므로 $a_m=\frac{2m+1}2\int_{-1}^1fP_m\,dx$.
베셀 함수 $J_n(k_{n,m}x)$는 $r=x$, $\|J_n(k_{n,m}x)\|^2=\frac{R^2}2J_{n+1}^2(\alpha_{n,m})$이므로 푸리에–베셀 계수 공식이 나옵니다.` },
  // ───── 11
  { ch: 'ch11', id: 'classify', title: '2계 PDE 분류와 특성선', keys: ['2계 선형 PDE의 분류'],
    tags: 'classification characteristics hyperbolic parabolic elliptic normal form 분류 특성선 쌍곡형 포물형 타원형 표준형',
    sketch: R`분류가 무엇을 뜻하는지 특성선으로 설명하는 개요입니다.`,
    stmt: R`$Au_{xx}+2Bu_{xy}+Cu_{yy}=F$의 특성곡선은 $A\,dy^2-2B\,dx\,dy+C\,dx^2=0$을 만족하며, 실수 특성선 족의 개수(2, 1, 0)가 $AC-B^2<0$, $=0$, $>0$에 대응한다.`,
    body: R`
$\dfrac{dy}{dx}=m$으로 두면 특성방정식은 $Am^2-2Bm+C=0$이고, 판별식은 $4(B^2-AC)$입니다.
- $AC-B^2<0$: 서로 다른 실근 두 개 → 특성선 족 두 개. 두 족을 새 좌표 $v,z$로 잡으면 표준형 $u_{vz}=\cdots$ (쌍곡형).
- $AC-B^2=0$: 중근 → 특성선 족 한 개 (포물형).
- $AC-B^2>0$: 실근 없음 → 실수 특성선이 없고 라플라스 방정식 꼴로 바뀝니다 (타원형).

예: $c^2u_{xx}-u_{tt}=0$이면 $A=c^2$, $B=0$, $C=-1$이고 특성방정식 $c^2dt^2-dx^2=0$에서 특성선 $x\pm ct=$상수를 얻습니다. 달랑베르 해의 변수 $v,z$가 바로 이것입니다.` },
  { ch: 'ch11', id: 'wave-sep', title: '진동하는 현의 변수분리 해', keys: ['진동하는 현'],
    tags: 'wave equation separation of variables eigenfunction vibrating string 파동방정식 변수분리 고유함수 현',
    stmt: R`$u_{tt}=c^2u_{xx}$, $u(0,t)=u(L,t)=0$의 해는 $\sum(B_n\cos\lambda_nt+B_n^*\sin\lambda_nt)\sin\frac{n\pi x}L$이고 $B_n=\frac2L\int_0^Lf\sin\frac{n\pi x}L$, $B_n^*=\frac{2}{cn\pi}\int_0^Lg\sin\frac{n\pi x}L$.`,
    body: R`
$u=F(x)G(t)$를 넣으면 $FG''=c^2F''G$, 즉
$$\frac{F''}{F}=\frac{G''}{c^2G}=k$$
좌변은 $x$만, 우변은 $t$만의 함수이므로 상수입니다. $F''=kF$, $F(0)=F(L)=0$에서
- $k=\mu^2>0$: $F=Ae^{\mu x}+Be^{-\mu x}$, 경계조건에서 $A=B=0$.
- $k=0$: $F=ax+b$, 역시 0.
- $k=-p^2<0$: $F=A\cos px+B\sin px$. $F(0)=0$에서 $A=0$, $F(L)=0$에서 $\sin pL=0$, 즉 $p=\frac{n\pi}L$.

그러면 $G''+\lambda_n^2G=0$, $\lambda_n=\frac{cn\pi}L$이고 $G=B_n\cos\lambda_nt+B_n^*\sin\lambda_nt$. 중첩한 해에 초기조건을 넣으면
$$\sum B_n\sin\frac{n\pi x}{L}=f,\qquad \sum B_n^*\lambda_n\sin\frac{n\pi x}{L}=g$$
사인 반구간 전개의 계수 공식에서 $B_n$과 $B_n^*\lambda_n=\frac2L\int g\sin$, 즉 $B_n^*=\frac{2}{cn\pi}\int_0^Lg\sin\frac{n\pi x}L\,dx$.` },
  { ch: 'ch11', id: 'dalembert', title: '달랑베르 해의 유도', keys: ['달랑베르 해 (무한한 현)'],
    tags: 'dalembert solution characteristics traveling wave 달랑베르 특성선 진행파',
    stmt: R`$u_{tt}=c^2u_{xx}$, $u(x,0)=f$, $u_t(x,0)=g$의 해는 $u=\frac12\big[f(x+ct)+f(x-ct)\big]+\frac1{2c}\int_{x-ct}^{x+ct}g(s)\,ds$.`,
    body: R`
$v=x+ct$, $z=x-ct$로 바꾸면 연쇄법칙으로
$$u_{xx}=u_{vv}+2u_{vz}+u_{zz},\qquad u_{tt}=c^2\big(u_{vv}-2u_{vz}+u_{zz}\big)$$
이므로 $u_{tt}-c^2u_{xx}=-4c^2u_{vz}=0$. 적분하면 $u=\phi(x+ct)+\psi(x-ct)$.

초기조건: $\phi+\psi=f$, $c\phi'-c\psi'=g$. 둘째 식을 적분하면 $\phi-\psi=\frac1c\int_{x_0}^xg\,ds+k$. 연립하면
$$\phi(x)=\frac f2+\frac1{2c}\int_{x_0}^xg\,ds+\frac k2,\qquad \psi(x)=\frac f2-\frac1{2c}\int_{x_0}^xg\,ds-\frac k2$$
$\phi(x+ct)+\psi(x-ct)$에 넣으면 상수 $k$가 지워지고 공식이 됩니다.` },
  { ch: 'ch11', id: 'heat', title: '열방정식 해의 유도와 정상상태', keys: ['막대의 열전도 (양 끝 0°)'],
    tags: 'heat equation separation steady state insulated 열방정식 변수분리 정상상태 단열',
    stmt: R`$u_t=c^2u_{xx}$, $u(0,t)=u(L,t)=0$, $u(x,0)=f$의 해는 $\sum B_n\sin\frac{n\pi x}Le^{-\lambda_n^2t}$. 끝 온도가 $T_1,T_2$이면 정상상태는 일차함수이고, 단열된 끝이면 평균 온도로 수렴한다.`,
    body: R`
$u=F(x)G(t)$로 두면 $\dfrac{F''}{F}=\dfrac{G'}{c^2G}=-p^2$. 공간 부분은 현과 같아 $F=\sin\frac{n\pi x}L$이고, 시간 부분은 $G'=-c^2p^2G$에서 $G=e^{-\lambda_n^2t}$. 초기조건 $\sum B_n\sin\frac{n\pi x}L=f$에서 $B_n$은 사인 계수입니다.

**끝 온도가 0이 아닐 때.** 정상상태 $U$는 $U''=0$, $U(0)=T_1$, $U(L)=T_2$이므로 $U=T_1+(T_2-T_1)\frac xL$. $w=u-U$는 양 끝 0인 열방정식을 만족하고 초기값은 $f-U$이므로 위 해로 풀리며, $w\to0$입니다.

**단열된 끝** $u_x=0$: $F'(0)=F'(L)=0$에서 $F=\cos\frac{n\pi x}L$ ($n=0$ 포함). $n\ge1$ 항은 지수적으로 사라지고 $A_0=\frac1L\int_0^Lf\,dx$만 남습니다.` },
  { ch: 'ch11', id: 'dirichlet', title: '직사각형 디리클레 문제의 해', keys: ['직사각형의 디리클레 문제'],
    tags: 'laplace equation dirichlet problem rectangle sinh 라플라스 방정식 디리클레 직사각형',
    stmt: R`$0<x<a$, $0<y<b$에서 $\nabla^2u=0$, 윗변 $u=f(x)$, 나머지 변 $u=0$이면 $u=\sum A_n^*\sin\frac{n\pi x}a\sinh\frac{n\pi y}a$, $A_n^*=\frac{2}{a\sinh(n\pi b/a)}\int_0^af\sin\frac{n\pi x}a\,dx$.`,
    body: R`
$u=F(x)G(y)$에서 $\dfrac{F''}{F}=-\dfrac{G''}{G}=-p^2$. $F(0)=F(a)=0$에서 $F=\sin\frac{n\pi x}a$, $p=\frac{n\pi}a$. $G''=p^2G$, $G(0)=0$에서 $G=\sinh\frac{n\pi y}a$.

중첩한 해에 윗변 조건을 넣으면
$$\sum_n\Big[A_n^*\sinh\frac{n\pi b}{a}\Big]\sin\frac{n\pi x}{a}=f(x)$$
대괄호가 $f$의 사인 반구간 계수 $\frac2a\int_0^af\sin\frac{n\pi x}a\,dx$이므로 공식이 나옵니다. 여러 변에 경계값이 있으면 변마다 이런 문제를 풀어 더합니다(중첩).` },
  { ch: 'ch11', id: 'polar-laplacian', title: '극좌표 라플라시안', keys: ['직사각형의 디리클레 문제'],
    tags: 'polar coordinates laplacian chain rule 극좌표 라플라시안 연쇄법칙',
    stmt: R`$\nabla^2u=u_{rr}+\dfrac1ru_r+\dfrac1{r^2}u_{\theta\theta}$.`,
    body: R`
$r=\sqrt{x^2+y^2}$, $\theta=\arctan(y/x)$에서 $r_x=\cos\theta$, $r_y=\sin\theta$, $\theta_x=-\frac{\sin\theta}r$, $\theta_y=\frac{\cos\theta}r$. 연쇄법칙으로
$$u_x=u_r\cos\theta-u_\theta\frac{\sin\theta}{r}$$
한 번 더 미분하면
$$u_{xx}=u_{rr}\cos^2\theta-\frac{2u_{r\theta}\sin\theta\cos\theta}{r}+\frac{u_{\theta\theta}\sin^2\theta}{r^2}+\frac{u_r\sin^2\theta}{r}+\frac{2u_\theta\sin\theta\cos\theta}{r^2}$$
$u_{yy}$는 $\sin$과 $\cos$을 바꾸고 교차항의 부호를 뒤집은 식입니다. 더하면 $\sin^2+\cos^2=1$로 교차항이 모두 지워져 공식이 됩니다.` },
  );
})();
