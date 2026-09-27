/* 기초 수학 — 증명 */
window.EM = window.EM || { chapters: [], exams: [], proofs: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01 미분과 근사
  { ch: 'ch01', id: 'mvt', title: '평균값 정리', keys: ['평균값 정리'],
    tags: 'mean value theorem rolle 롤 평균값 정리 최대 최소 정리',
    stmt: R`$f$가 $[a,b]$에서 연속, $(a,b)$에서 미분가능하면 $f(b)-f(a)=f'(\xi)(b-a)$인 $\xi\in(a,b)$가 있다.`,
    body: R`
**롤의 정리부터.** $f(a)=f(b)$라 합시다. 닫힌 구간의 연속함수는 최댓값과 최솟값을 가집니다(최대·최소 정리). 둘 다 양 끝에서만 나온다면 $f$는 상수이고 아무 $\xi$에서나 $f'(\xi)=0$입니다. 아니면 최대나 최소가 안쪽 점 $\xi$에서 나오고, 그 점에서 $f'(\xi)=0$입니다: 예를 들어 최대라면 $h>0$일 때 $\frac{f(\xi+h)-f(\xi)}{h}\le0$, $h<0$일 때 $\ge0$이므로 극한은 0입니다.

**일반적인 경우.** 할선을 빼서 양 끝 값을 맞춥니다.
$$g(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a)$$
$g(a)=g(b)=0$이므로 롤의 정리로 $g'(\xi)=f'(\xi)-\dfrac{f(b)-f(a)}{b-a}=0$인 $\xi$가 있습니다.` },
  { ch: 'ch01', id: 'mvt-uses', title: '평균값 정리의 세 가지 결론', keys: ['평균값 정리의 세 가지 쓰임'],
    tags: 'constant function monotone lipschitz 상수함수 증가함수 립시츠 평균값',
    stmt: R`구간에서 $f'\equiv0$이면 상수, $\lvert f'\rvert\le M$이면 $\lvert f(x)-f(y)\rvert\le M\lvert x-y\rvert$, $f'>0$이면 증가한다.`,
    body: R`
구간의 두 점 $x<y$에 평균값 정리를 쓰면 $f(y)-f(x)=f'(\xi)(y-x)$, $x<\xi<y$입니다.
1. $f'\equiv0$이면 오른쪽이 0이라 $f(y)=f(x)$. 두 점이 임의이므로 $f$는 상수입니다.
2. $\lvert f(y)-f(x)\rvert=\lvert f'(\xi)\rvert\,\lvert y-x\rvert\le M\lvert y-x\rvert$.
3. $f'(\xi)>0$이고 $y-x>0$이므로 $f(y)>f(x)$.

구간이어야 한다는 조건이 필요합니다. $f(x)=\operatorname{sign}x$는 $x\ne0$에서 $f'=0$이지만 상수가 아닙니다. 정의역이 두 조각으로 나뉘어 있기 때문입니다.` },
  { ch: 'ch01', id: 'taylor-lagrange', title: '테일러 정리의 라그랑주 나머지항', keys: ['나머지항이 있는 테일러 정리'],
    tags: 'taylor theorem lagrange remainder 테일러 라그랑주 나머지항 롤',
    stmt: R`$f$가 $n+1$번 미분가능하면 $a$와 $x$ 사이의 $\xi$에 대해 $f(x)=T_n(x)+\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}$.`,
    body: R`
$x\ne a$를 고정하고 상수 $K$를 $f(x)=T_n(x)+K(x-a)^{n+1}$이 되도록 정합니다. $K=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}$임을 보이면 됩니다. 변수 $t$의 함수
$$\varphi(t)=f(t)-T_n(t)-K(t-a)^{n+1}$$
를 생각합니다. $T_n$은 $a$에서 $f$와 $n$계 도함수까지 모두 같으므로
$$\varphi(a)=\varphi'(a)=\cdots=\varphi^{(n)}(a)=0$$
이고, $K$를 고른 방법에 의해 $\varphi(x)=0$입니다.

$\varphi(a)=\varphi(x)=0$이므로 롤의 정리로 $a$와 $x$ 사이에 $\varphi'(x_1)=0$인 $x_1$이 있습니다. 다시 $\varphi'(a)=\varphi'(x_1)=0$이므로 그 사이에 $\varphi''(x_2)=0$인 $x_2$가 있습니다. 이렇게 $n+1$번 반복하면 $a$와 $x$ 사이에 $\varphi^{(n+1)}(\xi)=0$인 $\xi$가 있습니다.

그런데 $T_n$은 $n$차 다항식이라 $T_n^{(n+1)}=0$이고 $\dfrac{d^{n+1}}{dt^{n+1}}(t-a)^{n+1}=(n+1)!$이므로
$$0=\varphi^{(n+1)}(\xi)=f^{(n+1)}(\xi)-K\,(n+1)!$$
곧 $K=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}$입니다. $n=0$이면 평균값 정리 그대로입니다.` },
  // ───── 02 적분의 도구
  { ch: 'ch02', id: 'ftc', title: '미적분의 기본정리', keys: ['미적분의 기본정리'],
    tags: 'fundamental theorem of calculus antiderivative 기본정리 원시함수 적분 미분',
    stmt: R`$f$가 연속이면 $F(x)=\int_a^xf(t)\,dt$에 대해 $F'=f$이고, $G'=f$이면 $\int_a^bf=G(b)-G(a)$.`,
    body: R`
**1부.** $h>0$이면
$$\frac{F(x+h)-F(x)}{h}=\frac1h\int_x^{x+h}f(t)\,dt$$
적분의 평균값 정리(연속함수의 적분은 최솟값×길이와 최댓값×길이 사이이고, 중간값 정리로 그 사이의 값이 함숫값으로 나온다)로 이것은 어떤 $c\in[x,x+h]$에서의 $f(c)$와 같습니다. $h\to0$이면 $c\to x$이고 $f$가 연속이므로 극한은 $f(x)$입니다. $h<0$도 같습니다.

**2부.** $F'=f=G'$이므로 $(F-G)'=0$이고, 평균값 정리의 결론[[ch01:1.2|평균값 정리: 도함수가 0이면 상수.]]에 의해 $F-G$는 상수 $C$입니다. $F(a)=0$이므로 $C=-G(a)$, 따라서 $\int_a^bf=F(b)=G(b)-G(a)$.` },
  { ch: 'ch02', id: 'leibniz', title: '적분 기호 속 미분', keys: ['적분 기호 속 미분 (라이프니츠 규칙)'],
    tags: 'leibniz integral rule differentiation under the integral sign feynman 라이프니츠 적분 미분 순서',
    stmt: R`$g$, $g_x$가 연속이면 $\dfrac{d}{dx}\displaystyle\int_a^xg(x,t)\,dt=g(x,x)+\int_a^xg_x(x,t)\,dt$.`,
    sketch: R`구간이 고정된 경우를 먼저 보이고, 변수 끝점은 두 변수 함수의 연쇄법칙으로 처리합니다.`,
    body: R`
**구간이 고정된 경우.** $I(x)=\int_a^bg(x,t)\,dt$에 대해, 각 $t$에서 평균값 정리를 쓰면
$$\frac{I(x+h)-I(x)}{h}=\int_a^b\frac{g(x+h,t)-g(x,t)}{h}\,dt=\int_a^bg_x(x+\theta_th,\,t)\,dt\qquad(0<\theta_t<1)$$
$g_x$는 닫힌 직사각형에서 연속이라 **균등연속**이므로, $h\to0$일 때 피적분함수가 $t$에 대해 한꺼번에 $g_x(x,t)$로 다가갑니다. 따라서 극한과 적분을 바꿀 수 있어 $I'(x)=\int_a^bg_x(x,t)\,dt$입니다.

**끝점이 변하는 경우.** $\Phi(u,v)=\int_a^vg(u,t)\,dt$라 두면 $\Phi_v=g(u,v)$(기본정리), $\Phi_u=\int_a^vg_u(u,t)\,dt$(위의 결과)입니다. 구하는 것은 $\frac{d}{dx}\Phi(x,x)$이고 연쇄법칙으로
$$\frac{d}{dx}\Phi(x,x)=\Phi_u+\Phi_v=\int_a^xg_x(x,t)\,dt+g(x,x)$$` },
  { ch: 'ch02', id: 'gaussian', title: '가우스 적분', keys: ['가우스 적분'],
    tags: 'gaussian integral polar coordinates normal distribution 가우스 적분 극좌표 정규분포',
    stmt: R`$\displaystyle\int_{-\infty}^\infty e^{-x^2}dx=\sqrt\pi$.`,
    body: R`
먼저 수렴합니다: $\lvert x\rvert\ge1$이면 $e^{-x^2}\le e^{-\lvert x\rvert}$이고 이것의 적분은 유한합니다(비교 판정). 이제 $I_R=\int_{-R}^Re^{-x^2}dx$라 하면
$$I_R^2=\iint_{[-R,R]^2}e^{-(x^2+y^2)}\,dx\,dy$$
피적분함수가 양수이므로 정사각형을 안팎의 원판으로 끼울 수 있습니다: 반지름 $R$인 원판 $D_R\subset[-R,R]^2\subset D_{\sqrt2R}$. 원판 위의 적분은 극좌표($dx\,dy=r\,dr\,d\theta$)로
$$\iint_{D_\rho}e^{-(x^2+y^2)}dx\,dy=\int_0^{2\pi}\!\!\int_0^\rho e^{-r^2}r\,dr\,d\theta=\pi\big(1-e^{-\rho^2}\big)$$
따라서 $\pi(1-e^{-R^2})\le I_R^2\le\pi(1-e^{-2R^2})$이고 $R\to\infty$이면 양쪽이 모두 $\pi$로 가므로 $I^2=\pi$, $I=\sqrt\pi$입니다.` },
  // ───── 03 수열과 급수
  { ch: 'ch03', id: 'geometric', title: '등비급수의 합', keys: ['등비급수'],
    tags: 'geometric series sum 등비급수 공비 부분합',
    stmt: R`$\sum_{k=0}^{n-1}r^k=\dfrac{1-r^n}{1-r}$ $(r\ne1)$이고, $\lvert r\rvert<1$일 때만 $\sum_{k=0}^\infty r^k=\dfrac1{1-r}$로 수렴한다.`,
    body: R`
$S_n=1+r+\cdots+r^{n-1}$이라 하면 $rS_n=r+r^2+\cdots+r^n$이고, 빼면 가운데 항이 모두 지워져 $(1-r)S_n=1-r^n$입니다.

$\lvert r\rvert<1$이면 $r^n\to0$이므로 $S_n\to\dfrac1{1-r}$. $\lvert r\rvert\ge1$이면 항 $r^k$의 절댓값이 1 이상이라 0으로 가지 않으므로 $n$번째 항 판정으로 발산합니다.` },
  { ch: 'ch03', id: 'nth-term', title: '수렴하는 급수의 항은 0으로 간다', keys: [R`$n$번째 항 판정`],
    tags: 'nth term test divergence harmonic series 발산 판정 조화급수',
    stmt: R`$\sum a_k$가 수렴하면 $a_k\to0$이다. 조화급수 $\sum\frac1k$는 발산한다.`,
    body: R`
부분합 $S_n$이 $S$로 수렴하면 $a_n=S_n-S_{n-1}\to S-S=0$입니다.

조화급수는 항을 두 배씩 묶으면 발산이 보입니다.
$$1+\frac12+\Big(\frac13+\frac14\Big)+\Big(\frac15+\cdots+\frac18\Big)+\cdots\ge1+\frac12+\frac12+\frac12+\cdots$$
$2^{m-1}+1$번째부터 $2^m$번째까지의 $2^{m-1}$개 항은 각각 $\frac1{2^m}$ 이상이라 합이 $\frac12$ 이상이기 때문입니다. 따라서 $S_{2^m}\ge1+\frac m2\to\infty$.` },
  { ch: 'ch03', id: 'ratio-test', title: '비율 판정법', keys: ['비율 판정법과 근 판정법'],
    tags: 'ratio test root test absolute convergence 비율 판정 근 판정 절대수렴 등비급수 비교',
    stmt: R`$\lvert a_{k+1}/a_k\rvert\to L$이면 $L<1$일 때 $\sum a_k$는 절대수렴, $L>1$일 때 발산한다.`,
    body: R`
**$L<1$.** $L<q<1$인 $q$를 하나 고릅니다. 극한의 정의로 어떤 $N$ 이후 $\lvert a_{k+1}\rvert\le q\lvert a_k\rvert$이고, 따라서
$$\lvert a_{N+m}\rvert\le q^m\lvert a_N\rvert$$
오른쪽은 공비 $q<1$인 등비급수의 항이라 합이 유한하고, 비교 판정으로 $\sum\lvert a_k\rvert$가 수렴합니다. 앞의 유한 개 항은 수렴에 영향을 주지 않습니다.

**$L>1$.** 어떤 $N$ 이후 $\lvert a_{k+1}\rvert\ge\lvert a_k\rvert$이므로 항의 절댓값이 $\lvert a_N\rvert>0$ 아래로 내려가지 않아 0으로 가지 않고, 급수는 발산합니다.

근 판정도 같은 방식입니다: $\lvert a_k\rvert^{1/k}\le q<1$이면 $\lvert a_k\rvert\le q^k$.` },
  { ch: 'ch03', id: 'radius', title: '수렴반지름 공식', keys: ['수렴반지름'],
    tags: 'radius of convergence power series cauchy hadamard 수렴반지름 거듭제곱급수 비율',
    stmt: R`$\lvert a_k/a_{k+1}\rvert\to R$이면 $\sum a_k(x-x_0)^k$는 $\lvert x-x_0\rvert<R$에서 절대수렴하고 $\lvert x-x_0\rvert>R$에서 발산한다.`,
    body: R`
$x$를 고정하고 $b_k=a_k(x-x_0)^k$에 비율 판정[[ch03:3.2|비율 판정법: 비의 극한이 1보다 작으면 절대수렴.]]을 씁니다.
$$\left\lvert\frac{b_{k+1}}{b_k}\right\rvert=\left\lvert\frac{a_{k+1}}{a_k}\right\rvert\lvert x-x_0\rvert\to\frac{\lvert x-x_0\rvert}{R}$$
이 극한이 1보다 작으면, 곧 $\lvert x-x_0\rvert<R$이면 절대수렴하고, 1보다 크면 발산합니다. $\lvert x-x_0\rvert=R$에서는 극한이 1이라 이 판정으로는 알 수 없고 급수마다 따로 확인해야 합니다.

비의 극한이 없을 때는 근 판정을 쓰면 $\frac1R=\limsup\lvert a_k\rvert^{1/k}$(코시-아다마르 공식)이 같은 역할을 합니다.` },
  { ch: 'ch03', id: 'euler-formula', title: '오일러 공식', keys: ['오일러 공식'],
    tags: 'euler formula complex exponential de moivre 오일러 공식 복소지수 드무아브르',
    stmt: R`모든 실수 $\theta$에 대해 $e^{i\theta}=\cos\theta+i\sin\theta$.`,
    body: R`
복소수 $z$에 대해 $e^z=\sum\frac{z^k}{k!}$로 정의하면, 실수 경우와 같은 비율 판정으로 모든 $z$에서 절대수렴합니다. 절대수렴하는 급수는 항의 순서를 바꾸거나 나누어 더해도 합이 같으므로, 짝수 차와 홀수 차 항을 따로 모을 수 있습니다. $i^{2m}=(-1)^m$, $i^{2m+1}=(-1)^mi$이므로
$$e^{i\theta}=\sum_{m=0}^\infty\frac{(-1)^m\theta^{2m}}{(2m)!}+i\sum_{m=0}^\infty\frac{(-1)^m\theta^{2m+1}}{(2m+1)!}=\cos\theta+i\sin\theta$$
두 급수가 각각 $\cos$와 $\sin$의 매클로린 급수이고, 그 급수들이 모든 실수에서 원래 함수로 수렴한다는 것은 나머지항이 $\frac{\lvert\theta\rvert^{n+1}}{(n+1)!}\to0$이라는 데서 나옵니다.` },
  // ───── 04 다변수 미적분
  { ch: 'ch04', id: 'chain-rule', title: '다변수 연쇄법칙', keys: ['다변수 연쇄법칙'],
    tags: 'chain rule jacobian composition backpropagation 연쇄법칙 야코비 합성 역전파',
    stmt: R`$\mathbf g$가 $\mathbf x$에서, $\mathbf f$가 $\mathbf g(\mathbf x)$에서 미분가능하면 $D(\mathbf f\circ\mathbf g)(\mathbf x)=D\mathbf f(\mathbf g(\mathbf x))\,D\mathbf g(\mathbf x)$.`,
    body: R`
미분가능하다는 것은 선형 근사의 오차가 $o$라는 뜻입니다[[ch04:4.1|전미분과 선형 근사.]]. $A=D\mathbf g(\mathbf x)$, $B=D\mathbf f(\mathbf y)$, $\mathbf y=\mathbf g(\mathbf x)$라 쓰면
$$\mathbf g(\mathbf x+\mathbf h)=\mathbf y+A\mathbf h+\boldsymbol\epsilon_1(\mathbf h),\qquad \mathbf f(\mathbf y+\mathbf k)=\mathbf f(\mathbf y)+B\mathbf k+\boldsymbol\epsilon_2(\mathbf k)$$
이고 $\lVert\boldsymbol\epsilon_1(\mathbf h)\rVert/\lVert\mathbf h\rVert\to0$, $\lVert\boldsymbol\epsilon_2(\mathbf k)\rVert/\lVert\mathbf k\rVert\to0$입니다. 둘째 식에 $\mathbf k=A\mathbf h+\boldsymbol\epsilon_1$을 넣으면
$$\mathbf f(\mathbf g(\mathbf x+\mathbf h))=\mathbf f(\mathbf y)+BA\,\mathbf h+\underbrace{B\boldsymbol\epsilon_1(\mathbf h)+\boldsymbol\epsilon_2(\mathbf k)}_{\text{나머지}}$$
나머지가 $o(\lVert\mathbf h\rVert)$임을 보이면 됩니다. 첫 항은 $\lVert B\boldsymbol\epsilon_1\rVert\le\lVert B\rVert\lVert\boldsymbol\epsilon_1\rVert=o(\lVert\mathbf h\rVert)$. 둘째 항은 $\lVert\mathbf k\rVert\le\lVert A\rVert\lVert\mathbf h\rVert+\lVert\boldsymbol\epsilon_1\rVert\le C\lVert\mathbf h\rVert$이므로 $\lVert\boldsymbol\epsilon_2(\mathbf k)\rVert=o(\lVert\mathbf k\rVert)=o(\lVert\mathbf h\rVert)$. 따라서 $\mathbf f\circ\mathbf g$의 미분은 $BA$입니다.` },
  { ch: 'ch04', id: 'taylor2', title: '2차 테일러 전개', keys: ['2차 테일러 전개'],
    tags: 'second order taylor expansion hessian quadratic approximation 2차 테일러 헤시안 이차 근사',
    stmt: R`$f$가 $C^2$이면 $f(\mathbf x+\mathbf h)=f(\mathbf x)+\nabla f\cdot\mathbf h+\tfrac12\mathbf h^{\mathsf T}H\mathbf h+o(\lVert\mathbf h\rVert^2)$.`,
    body: R`
$g(t)=f(\mathbf x+t\mathbf h)$라 둡니다. 연쇄법칙으로
$$g'(t)=\sum_i f_{x_i}(\mathbf x+t\mathbf h)\,h_i,\qquad g''(t)=\sum_{i,j}f_{x_ix_j}(\mathbf x+t\mathbf h)\,h_ih_j=\mathbf h^{\mathsf T}H(\mathbf x+t\mathbf h)\,\mathbf h$$
한 변수 테일러 정리[[ch01:1.3|라그랑주 나머지항.]]를 $n=1$로 쓰면 어떤 $\theta\in(0,1)$에서
$$f(\mathbf x+\mathbf h)=g(1)=g(0)+g'(0)+\tfrac12g''(\theta)=f(\mathbf x)+\nabla f\cdot\mathbf h+\tfrac12\mathbf h^{\mathsf T}H(\mathbf x+\theta\mathbf h)\mathbf h$$
$H$가 연속이므로 $H(\mathbf x+\theta\mathbf h)=H(\mathbf x)+E(\mathbf h)$, $\lVert E(\mathbf h)\rVert\to0$이고, $\lvert\mathbf h^{\mathsf T}E\mathbf h\rvert\le\lVert E\rVert\lVert\mathbf h\rVert^2=o(\lVert\mathbf h\rVert^2)$입니다.` },
  { ch: 'ch04', id: 'hessian-test', title: '헤시안에 의한 극값 판정', keys: ['헤시안과 극값 판정'],
    tags: 'second derivative test hessian positive definite saddle 극값 판정 헤시안 양의 정부호 안장점',
    stmt: R`$\nabla f(\mathbf x)=\mathbf 0$이고 $H(\mathbf x)$가 양의 정부호이면 $\mathbf x$는 극소점이다. 부정부호이면 안장점이다.`,
    body: R`
$H$가 대칭이므로 고유값 $\lambda_1\le\cdots\le\lambda_n$이 실수이고, 모든 $\mathbf h$에 대해 $\mathbf h^{\mathsf T}H\mathbf h\ge\lambda_1\lVert\mathbf h\rVert^2$입니다(직교 고유기저로 전개하면 $\sum\lambda_ic_i^2\ge\lambda_1\sum c_i^2$).

**양의 정부호.** $\lambda_1>0$입니다. 2차 테일러 전개[[ch04:4.3|2차 테일러 전개.]]에서 1차 항이 0이므로
$$f(\mathbf x+\mathbf h)-f(\mathbf x)=\tfrac12\mathbf h^{\mathsf T}H\mathbf h+o(\lVert\mathbf h\rVert^2)\ge\tfrac12\lambda_1\lVert\mathbf h\rVert^2-\tfrac14\lambda_1\lVert\mathbf h\rVert^2>0$$
($\mathbf h\ne\mathbf 0$이 충분히 작아 $o$ 항의 크기가 $\tfrac14\lambda_1\lVert\mathbf h\rVert^2$ 이하일 때). 따라서 극소입니다. 음의 정부호는 $-f$에 같은 논리를 씁니다.

**부정부호.** $\lambda_1<0<\lambda_n$이면 고유벡터 $\mathbf v_1$ 방향으로 $f(\mathbf x+t\mathbf v_1)-f(\mathbf x)=\tfrac12\lambda_1t^2+o(t^2)<0$, $\mathbf v_n$ 방향으로는 $>0$이라 극값이 아닙니다.

**두 변수의 $D$ 판정.** $2\times2$ 대칭행렬의 고유값의 곱은 $\det H=D$, 합은 $f_{xx}+f_{yy}$입니다. $D>0$이면 두 고유값의 부호가 같고 그 부호는 $f_{xx}$의 부호와 같으며, $D<0$이면 부호가 다릅니다.` },
  // ───── 05 해석의 도구
  { ch: 'ch05', id: 'lipschitz-mvt', title: '도함수의 상한과 립시츠 조건', keys: ['립시츠 조건'],
    tags: 'lipschitz condition derivative bound mean value 립시츠 평균값 정리 상한',
    stmt: R`구간에서 $\lvert f'\rvert\le L$이면 $f$는 립시츠 상수 $L$을 갖는다. 거꾸로 미분가능한 립시츠 함수는 $\lvert f'\rvert\le L$이다.`,
    body: R`
평균값 정리로 $\lvert f(x)-f(y)\rvert=\lvert f'(\xi)\rvert\,\lvert x-y\rvert\le L\lvert x-y\rvert$.

거꾸로, 립시츠이면 $\left\lvert\dfrac{f(x+h)-f(x)}{h}\right\rvert\le L$이고 $h\to0$의 극한을 취하면 $\lvert f'(x)\rvert\le L$입니다. 따라서 미분가능한 함수에서는 “립시츠 상수 $L$” $\iff$ “$\sup\lvert f'\rvert\le L$”이고, 가장 작은 립시츠 상수는 $\sup\lvert f'\rvert$입니다.` },
  { ch: 'ch05', id: 'gronwall', title: '그론월 부등식', keys: ['그론월 부등식'],
    tags: 'gronwall inequality uniqueness stability lipschitz 그론월 유일성 안정성 립시츠 지수',
    stmt: R`$u\ge0$ 연속, $u(x)\le u_0+L\int_{x_0}^xu(s)\,ds$ ($x\ge x_0$)이면 $u(x)\le u_0e^{L(x-x_0)}$.`,
    body: R`
오른쪽을 $v(x)=u_0+L\int_{x_0}^xu(s)\,ds$라 하면 $u\le v$이고 기본정리로 $v'=Lu\le Lv$입니다. 적분인자 $e^{-L(x-x_0)}$를 곱하면
$$\big(v\,e^{-L(x-x_0)}\big)'=(v'-Lv)\,e^{-L(x-x_0)}\le0$$
이므로 $v\,e^{-L(x-x_0)}$은 감소하고, $x=x_0$에서의 값이 $u_0$이므로 $v(x)\le u_0e^{L(x-x_0)}$. 따라서 $u\le v\le u_0e^{L(x-x_0)}$입니다.

**미분방정식에 쓰기.** $y_1,y_2$가 $y'=f(x,y)$의 해이고 $f$가 $y$에 대해 립시츠 상수 $L$을 가지면, 적분형으로 써서 빼고 삼각부등식을 쓰면
$$\lvert y_1(x)-y_2(x)\rvert\le\lvert y_1(x_0)-y_2(x_0)\rvert+L\int_{x_0}^x\lvert y_1(s)-y_2(s)\rvert\,ds$$
그론월 부등식으로 $\lvert y_1-y_2\rvert\le\lvert y_1(x_0)-y_2(x_0)\rvert e^{L(x-x_0)}$. 초기값이 같으면 두 해는 같습니다.` },
  { ch: 'ch05', id: 'contraction', title: '축소 사상 정리', keys: ['축소 사상 정리'],
    tags: 'contraction mapping banach fixed point iteration 축소 사상 바나흐 고정점 반복',
    stmt: R`$g:I\to I$ ($I$ 닫힌 구간)가 립시츠 상수 $L<1$이면 고정점이 유일하게 있고, 모든 반복 $x_{n+1}=g(x_n)$이 그리로 수렴한다.`,
    body: R`
$\lvert x_{n+1}-x_n\rvert=\lvert g(x_n)-g(x_{n-1})\rvert\le L\lvert x_n-x_{n-1}\rvert\le\cdots\le L^n\lvert x_1-x_0\rvert$입니다. $m>n$이면 삼각부등식과 등비급수[[ch03:3.1|등비급수의 합.]]로
$$\lvert x_m-x_n\rvert\le\big(L^n+\cdots+L^{m-1}\big)\lvert x_1-x_0\rvert\le\frac{L^n}{1-L}\lvert x_1-x_0\rvert\to0$$
따라서 $(x_n)$은 코시 수열이고 수렴합니다. 극한을 $x^*$라 하면 $I$가 닫혀 있으므로 $x^*\in I$, $g$가 연속이므로 $x_{n+1}=g(x_n)$에서 $x^*=g(x^*)$.

고정점이 둘 $x^*,y^*$라면 $\lvert x^*-y^*\rvert=\lvert g(x^*)-g(y^*)\rvert\le L\lvert x^*-y^*\rvert$이고 $L<1$이므로 $x^*=y^*$입니다. 위 부등식에서 $m\to\infty$로 보내면 오차 추정 $\lvert x^*-x_n\rvert\le\dfrac{L^n}{1-L}\lvert x_1-x_0\rvert$도 얻습니다.` },
  { ch: 'ch05', id: 'cauchy-schwarz', title: '코시-슈바르츠 부등식', keys: ['코시-슈바르츠 부등식'],
    tags: 'cauchy schwarz inequality inner product discriminant 코시 슈바르츠 내적 판별식',
    stmt: R`내적공간에서 $\lvert\langle\mathbf u,\mathbf v\rangle\rvert\le\lVert\mathbf u\rVert\lVert\mathbf v\rVert$.`,
    body: R`
$\mathbf v=\mathbf 0$이면 양쪽이 0입니다. 아니면 모든 실수 $t$에 대해
$$0\le\lVert\mathbf u-t\mathbf v\rVert^2=\lVert\mathbf u\rVert^2-2t\langle\mathbf u,\mathbf v\rangle+t^2\lVert\mathbf v\rVert^2$$
$t$에 대한 이차식이 음수가 되지 않으려면 판별식이 0 이하여야 합니다.
$$4\langle\mathbf u,\mathbf v\rangle^2-4\lVert\mathbf u\rVert^2\lVert\mathbf v\rVert^2\le0$$
등호는 어떤 $t$에서 $\mathbf u=t\mathbf v$일 때, 곧 두 벡터가 평행할 때만 성립합니다. 합과 적분 형태는 각각 $\langle\mathbf a,\mathbf b\rangle=\sum a_kb_k$, $\langle f,g\rangle=\int fg$로 두면 됩니다.` },
  { ch: 'ch05', id: 'jensen', title: '젠센 부등식', keys: ['젠센 부등식'],
    tags: 'jensen inequality convex function expectation KL divergence 젠센 볼록 기댓값',
    stmt: R`$\varphi$가 볼록, $w_k\ge0$, $\sum w_k=1$이면 $\varphi\big(\sum w_kx_k\big)\le\sum w_k\varphi(x_k)$.`,
    body: R`
항의 개수 $n$에 대한 귀납법입니다. $n=2$는 볼록함수의 정의 그대로입니다: $\varphi\big(wx_1+(1-w)x_2\big)\le w\varphi(x_1)+(1-w)\varphi(x_2)$.

$n$에서 성립한다고 하고 $n+1$개를 봅니다. $w_{n+1}<1$이라 하고 $s=1-w_{n+1}=\sum_{k\le n}w_k$라 두면
$$\sum_{k=1}^{n+1}w_kx_k=s\underbrace{\sum_{k=1}^n\frac{w_k}{s}x_k}_{=:\ y}+w_{n+1}x_{n+1}$$
두 점의 경우로 $\varphi(\cdots)\le s\,\varphi(y)+w_{n+1}\varphi(x_{n+1})$이고, 가중치 $\frac{w_k}{s}$의 합이 1이므로 귀납 가정으로 $\varphi(y)\le\sum_{k\le n}\frac{w_k}{s}\varphi(x_k)$. 합치면 $\varphi\big(\sum w_kx_k\big)\le\sum_{k\le n+1}w_k\varphi(x_k)$입니다.` },
  { ch: 'ch05', id: 'uniform-limit', title: '균등수렴하면 연속성과 적분이 보존된다', keys: ['균등수렴과 그 효과'],
    tags: 'uniform convergence continuity integral interchange limit epsilon 균등수렴 연속 적분 극한 교환',
    stmt: R`연속함수 $f_n$이 $f$로 균등수렴하면 $f$는 연속이고 $\int_a^bf_n\to\int_a^bf$.`,
    body: R`
$\varepsilon>0$을 잡고 $\sup\lvert f_n-f\rvert<\varepsilon/3$인 $n$을 하나 고정합니다. $f_n$이 $x_0$에서 연속이므로 $\lvert x-x_0\rvert<\delta$이면 $\lvert f_n(x)-f_n(x_0)\rvert<\varepsilon/3$. 그러면
$$\lvert f(x)-f(x_0)\rvert\le\lvert f(x)-f_n(x)\rvert+\lvert f_n(x)-f_n(x_0)\rvert+\lvert f_n(x_0)-f(x_0)\rvert<\varepsilon$$
이므로 $f$는 연속입니다(“$\varepsilon/3$ 논법”). 점별수렴이면 첫째와 셋째 항을 **같은** $n$으로 동시에 누를 수 없어서 이 논법이 깨집니다.

적분은 더 간단합니다.
$$\left\lvert\int_a^bf_n-\int_a^bf\right\rvert\le\int_a^b\lvert f_n-f\rvert\le(b-a)\sup\lvert f_n-f\rvert\to0$$` },
  { ch: 'ch05', id: 'm-test', title: '바이어슈트라스 M-판정', keys: ['바이어슈트라스 M-판정'],
    tags: 'weierstrass m test uniform convergence series 바이어슈트라스 균등수렴 급수',
    stmt: R`$\lvert u_k(x)\rvert\le M_k$이고 $\sum M_k<\infty$이면 $\sum u_k(x)$는 균등수렴한다.`,
    body: R`
각 $x$에서 $\sum\lvert u_k(x)\rvert\le\sum M_k$이므로 급수는 절대수렴하고, 합을 $S(x)$라 합니다. 부분합 $S_n$과의 차이는
$$\lvert S(x)-S_n(x)\rvert=\Big\lvert\sum_{k>n}u_k(x)\Big\rvert\le\sum_{k>n}M_k$$
오른쪽은 $x$와 무관하고 수렴하는 급수의 꼬리라 $n\to\infty$일 때 0으로 갑니다. 따라서 $\sup_x\lvert S-S_n\rvert\to0$, 곧 균등수렴입니다.` },
  );
})();
