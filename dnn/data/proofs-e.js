/* 증명 — 보강: Problem Set 1(문제 1–4)의 정리, 기댓값·분산의 성질, 5주차 월요일 필기(가변 보폭 SGD, 조건수, 모멘텀, 네스테로프, AdaGrad, RMSProp, Adam).
   src가 있는 항목은 수업 중 필기로 증명한 것입니다. Problem Set의 정리는 제목에 표시했습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 02
  { ch: 'ch02', id: 'expvar', title: '기댓값과 분산의 성질', keys: ['기댓값과 분산의 성질'],
    tags: 'expectation variance linearity independence sample mean 기댓값 분산 선형성 독립 표본평균',
    stmt: R`(i) $\E[aX+bY+c]=a\E X+b\E Y+c$ (ii) $\Var X=\E X^2-(\E X)^2$, $\Var(aX+b)=a^2\Var X$ (iii) $X,Y$ 독립이면 $\E[XY]=\E X\E Y$, $\Var(X+Y)=\Var X+\Var Y$ (iv) i.i.d.이고 분산 $\sigma^2$이면 $\Var(\bar X)=\sigma^2/n$.`,
    body: R`
이산 확률변수로 씁니다(연속이면 합을 적분으로).
**(i)** $\E[aX+bY+c]=\sum_{x,y}(ax+by+c)p(x,y)=a\sum_xx\sum_yp(x,y)+b\sum_yy\sum_xp(x,y)+c=a\E X+b\E Y+c$ (주변분포 $\sum_yp(x,y)=p(x)$). 독립은 필요 없습니다.
**(ii)** $\mu=\E X$. $\Var X=\E[(X-\mu)^2]=\E[X^2-2\mu X+\mu^2]=\E X^2-2\mu^2+\mu^2=\E X^2-\mu^2$ ((i) 사용). $\Var(aX+b)=\E[(aX+b-a\mu-b)^2]=a^2\E[(X-\mu)^2]$.
**(iii)** 독립이면 $p(x,y)=p(x)p(y)$이므로 $\E[XY]=\sum_{x,y}xyp(x)p(y)=\big(\sum_xxp(x)\big)\big(\sum_yyp(y)\big)$. $\Var(X+Y)=\E[(X-\E X+Y-\E Y)^2]=\Var X+\Var Y+2\Cov(X,Y)$, $\Cov(X,Y)=\E[XY]-\E X\E Y=0$.
**(iv)** (iii)을 $n$개로 반복하면 $\Var\sum X_i=\sum\Var X_i=n\sigma^2$, (ii)로 $\Var(\frac1n\sum X_i)=\frac{n\sigma^2}{n^2}=\frac{\sigma^2}n$.`,
    note: R`(iv)는 미니배치 기울기의 분산이 $1/B$로 줄어드는 이유(10.2절), 초기화의 분산 계산(11.2절), 편향-분산 분해(2.8절)에서 모두 씁니다.` },
  { ch: 'ch02', id: 'mapridge', title: '가우시안 평균의 MAP은 릿지다 (Problem Set 1 문제 2)', keys: ['가우시안 MAP은 릿지'],
    tags: 'MAP ridge Gaussian prior shrinkage posterior 가우시안 사전분포 릿지 수축 Problem Set',
    stmt: R`$X_1,\dots,X_n\overset{iid}{\sim}\N(\theta,1)$, $\theta\sim\N(0,\tau^2)$이면 $\hat\theta_{\text{MAP}}=\argmin_\theta\sum(X_i-\theta)^2+\lambda\theta^2$ ($\lambda=1/\tau^2$)이고 $\hat\theta_{\text{MAP}}=a\bar X$, $a=\frac{n\tau^2}{n\tau^2+1}$. 사후분포는 $\N\big(a\bar X,\frac1{n+1/\tau^2}\big)$.`,
    body: R`
**MAP의 꼴.** 베이즈 정리로 $p(\theta\mid X)\propto p(X\mid\theta)p(\theta)=\prod_i\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\cdot\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}$. 로그를 취하면
$$\log p(\theta\mid X)=-\frac12\sum_i(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C\qquad(C\text{는 }\theta\text{와 무관}).$$
$\log$가 순증가이므로 사후밀도의 최대점 = 로그의 최대점. $-2$를 곱하면 최대화가 최소화로: $\argmin_\theta\sum(X_i-\theta)^2+\frac1{\tau^2}\theta^2$.
**풀이.** $g(\theta)=\sum(X_i-\theta)^2+\lambda\theta^2$는 $g''=2(n+\lambda)>0$인 이차함수. $g'(\theta)=-2\sum X_i+2(n+\lambda)\theta=0$에서 $\theta=\frac{n\bar X}{n+\lambda}=\frac{n\tau^2}{n\tau^2+1}\bar X$.
**사후분포.** 지수부 $-\frac12\big[(n+\lambda)\theta^2-2n\bar X\theta\big]+C$를 완전제곱하면 $-\frac{n+\lambda}2(\theta-a\bar X)^2+C'$. 가우시안 $\N\big(a\bar X,\frac1{n+\lambda}\big)$이고, 대칭이므로 MAP = 사후평균 = $a\bar X$.`,
    note: R`일반 선형모델 $y=X\beta+\varepsilon$, $\varepsilon\sim\N(0,\sigma^2I)$, $\beta\sim\N(0,\tau^2I)$로 넓히면 $\lambda=\sigma^2/\tau^2$인 릿지 $(\lambda I+X^TX)^{-1}X^Ty$ (4.3절). 문제 2는 $X$가 1로 된 열 하나, $\sigma^2=1$인 경우입니다.` },
  { ch: 'ch02', id: 'biasvar', title: '편향-분산 분해와 수축 추정량의 MSE (Problem Set 1 문제 2)', keys: ['편향-분산 분해'],
    tags: 'bias variance decomposition MSE mean squared error shrinkage estimator 편향 분산 평균제곱오차 수축',
    stmt: R`임의의 추정량 $\hat\theta$에 대해 $\E(\hat\theta-\theta)^2=(\E\hat\theta-\theta)^2+\Var(\hat\theta)$. 특히 $\hat\theta=a\bar X$ ($X_i\sim\N(\theta,1)$ i.i.d.)의 편향은 $(a-1)\theta$, 분산 $a^2/n$, MSE $(1-a)^2\theta^2+a^2/n$.`,
    body: R`
$b=\E\hat\theta-\theta$는 확률변수가 아닌 **상수**입니다(기댓값은 참값 $\theta$를 고정한 표본분포에 대해). $\hat\theta-\theta=(\hat\theta-\E\hat\theta)+b$로 쪼개어
$$\E(\hat\theta-\theta)^2=\E(\hat\theta-\E\hat\theta)^2+2b\,\E(\hat\theta-\E\hat\theta)+b^2.$$
가운데 항: $\E(\hat\theta-\E\hat\theta)=\E\hat\theta-\E\hat\theta=0$. 첫 항은 $\Var(\hat\theta)$의 정의. 따라서 $\mathrm{MSE}=b^2+\Var\hat\theta$.
**수축 추정량.** $\E\bar X=\theta$, $\Var\bar X=1/n$ (i.i.d.). $\E[a\bar X]=a\theta$ → 편향 $(a-1)\theta$; $\Var(a\bar X)=a^2/n$. MSE $=(1-a)^2\theta^2+\frac{a^2}n$. $a=\frac{n\tau^2}{n\tau^2+1}$을 넣으면 $1-a=\frac1{n\tau^2+1}$이고 $\mathrm{MSE}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}$.`,
    note: R`$\bar X$ (MLE)의 MSE $1/n$보다 작을 필요충분조건은 $\theta^2<2\tau^2+\frac1n$. 편향을 조금 받아들이고 분산을 줄이는 거래가 규제의 핵심입니다.` },
  // ───── 03
  { ch: 'ch03', id: 'jsdiv', title: '젠센-섀넌 발산의 성질 (Problem Set 1 문제 1)', keys: ['JS 발산의 성질'],
    tags: 'Jensen Shannon divergence JS symmetric nonnegative identity bounded log 2 mixture mutual information 젠센 섀넌 발산 대칭 비음성',
    stmt: R`$m=\frac12(p+q)$, $D_{JS}(p\Vert q)=\frac12\KL(p\Vert m)+\frac12\KL(q\Vert m)$에 대해 (i) $D_{JS}\ge0$ (ii) $D_{JS}=0\iff p=q$ (iii) $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$ (iv) $D_{JS}\le\log2$, 등호는 $p,q$의 받침이 서로소일 때.`,
    body: R`
**준비.** $m\ge0$, $\sum_xm(x)=\frac12+\frac12=1$이라 $m$은 확률분포. $p(x)>0$이면 $m(x)\ge\frac12p(x)>0$이므로 $\KL(p\Vert m)$은 분모가 0이 되는 항이 없어 유한합니다($q$도 같음). Theorem 1: $\KL(a\Vert b)\ge0$이고 등호 $\iff a=b$.
**(i)** 두 KL이 모두 $\ge0$이므로 그 평균도 $\ge0$.
**(ii)** ($\Leftarrow$) $p=q\Rightarrow m=p\Rightarrow\KL(p\Vert m)=\KL(q\Vert m)=0$. ($\Rightarrow$) $D_{JS}=0$이면 음이 아닌 두 수의 합이 0이라 둘 다 0: $\KL(p\Vert m)=0$, $\KL(q\Vert m)=0$. Theorem 1의 등호 조건으로 $p=m=q$.
**(iii)** $m$이 $p,q$에 대해 대칭이므로 순서를 바꾸면 두 항의 순서만 바뀝니다.
**(iv)** $p(x)>0$에서 $\frac{p(x)}{m(x)}=\frac{2p(x)}{p(x)+q(x)}\le2$, 등호는 $q(x)=0$. 따라서 $\KL(p\Vert m)\le\sum_{p>0}p\log2=\log2$ (등호 $\iff$ $p>0$인 곳에서 $q=0$). 대칭으로 $\KL(q\Vert m)\le\log2$. 평균 $\le\log2$, 등호는 모든 $x$에서 $p(x)q(x)=0$.`,
    note: R`엔트로피로 쓰면 $D_{JS}=H(m)-\frac{H(p)+H(q)}2$ (엔트로피의 오목성 = 비음성). 공정한 동전 $Z$로 $p$ 또는 $q$에서 뽑은 $X$에 대해 $D_{JS}(p\Vert q)=I(X;Z)\le H(Z)=\log2$. $\sqrt{D_{JS}}$는 거리 함수입니다.` },
  // ───── 07
  { ch: 'ch07', id: 'maxmin', title: '최대-최소 부등식과 반례 (Problem Set 1 문제 4)', keys: ['최대-최소 부등식'],
    tags: 'max min inequality minimax weak duality saddle point counterexample 최대 최소 부등식 약한 쌍대성 안장점 반례',
    stmt: R`공집합이 아닌 $X,Y$와 $f:X\times Y\to\mathbb R$에 대해 $\max_{x\in X}\min_{y\in Y}f(x,y)\le\min_{y\in Y}\max_{x\in X}f(x,y)$ (없으면 $\sup\inf\le\inf\sup$). 등호는 일반적으로 성립하지 않는다.`,
    body: R`
$g(x)=\min_yf(x,y)$, $h(y)=\max_xf(x,y)$. 임의의 $x'\in X$, $y'\in Y$에 대해
$$g(x')=\min_yf(x',y)\le f(x',y')\le\max_xf(x,y')=h(y').$$
따라서 $g(x')\le h(y')$가 **모든 쌍** $(x',y')$에서 성립합니다.
1. $x'$를 고정하고 $y'$에 대해 최소를 취해도 부등식 유지: $g(x')\le\min_{y'}h(y')$.
2. 오른쪽은 이제 상수이므로 $x'$에 대해 최대를 취해도 유지: $\max_{x'}g(x')\le\min_{y'}h(y')$. ∎
**반례.** $X=Y=\{0,1\}$, $f(x,y)=(x-y)^2$. 모든 $x$에서 $\min_yf=f(x,x)=0$이라 좌변 $0$. 모든 $y$에서 $\max_xf=1$ ($x\ne y$)이라 우변 $1$. $0<1$.`,
    note: R`안장점 $(x^*,y^*)$ ($f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$)이 있으면 등호. SVM에서 $x\to\alpha$, $y\to(w,b)$, $f\to L_p$로 바꾼 것이 약한 쌍대성이고, 볼록-오목 구조 때문에 등호(강한 쌍대성)가 됩니다.` },
  // ───── 13
  { ch: 'ch13', id: 'varstep', title: '가변 보폭 SGD의 수렴', keys: ['가변 보폭 SGD의 수렴'], src: '강의 필기 · W5 월',
    tags: 'SGD variable step size convergence tower property telescoping 1/sqrt T stochastic gradient 확률적 경사하강 가변 보폭 탑 성질 망원급수',
    stmt: R`$f=\frac1n\sum f_i$가 $L$-매끄럽고 하한 $f_*$를 가지며, $x_{t+1}=x_t-\eta_tg_t$, $\E[g_t\mid x_t]=\nabla f(x_t)$, $\E[\lVert g_t\rVert^2\mid x_t]\le G$이면 $\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2\le\dfrac{f(x_1)-f_*+\frac{LG}2\sum_t\eta_t^2}{\sum_t\eta_t}$.`,
    body: R`
**한 걸음.** $L$-매끄러움(하강 보조정리)에 $x_{t+1}-x_t=-\eta_tg_t$를 넣으면
$$f(x_{t+1})\le f(x_t)-\eta_t\langle\nabla f(x_t),g_t\rangle+\frac{L\eta_t^2}2\lVert g_t\rVert^2.$$
**조건부 기댓값** $\E_t=\E[\cdot\mid x_t]$: $x_t$의 함수는 상수로 빠지고 불편성으로 $\E_t\langle\nabla f(x_t),g_t\rangle=\lVert\nabla f(x_t)\rVert^2$. 둘째 모멘트 상한으로
$$\E_tf(x_{t+1})\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G.$$
**탑 성질** $\E[\E_t[Z]]=\E[Z]$로 전체 기댓값을 취하고 재배열: $\eta_t\E\lVert\nabla f(x_t)\rVert^2\le\E f(x_t)-\E f(x_{t+1})+\frac L2\eta_t^2G$.
**망원급수.** $t=1,\dots,T$로 더하면 $\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\le f(x_1)-\E f(x_{T+1})+\frac{LG}2\sum_t\eta_t^2\le f(x_1)-f_*+\frac{LG}2\sum_t\eta_t^2$.
**최솟값.** 왼쪽 $\ge\big(\min_t\E\lVert\nabla f(x_t)\rVert^2\big)\sum_t\eta_t$. $\sum_t\eta_t>0$으로 나누면 끝.`,
    note: R`고정 보폭 $\eta$: $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$. 최적 $\eta^*=\sqrt{\frac{2(f(x_1)-f_*)}{LGT}}$에서 $\sqrt{\frac{2(f(x_1)-f_*)LG}T}=O(1/\sqrt T)$. $\sum\eta_t=\infty$, $\sum\eta_t^2<\infty$ (예: $\eta_t\propto1/t$)이면 오른쪽이 0으로 갑니다.` },
  // ───── 14
  { ch: 'ch14', id: 'condgd', title: '조건수와 경사하강법의 속도', keys: ['조건수와 경사하강법'], src: '강의 필기 · W5 월',
    tags: 'condition number ill conditioned quadratic gradient descent zigzag Hessian eigenvalue 조건수 이차함수 경사하강법 지그재그',
    stmt: R`$f(x)=\frac12x^THx$ ($H\succ0$, 고윳값 $\lambda_{\min}\le\dots\le\lambda_{\max}$)에 GD $x_{t+1}=x_t-\alpha Hx_t$를 쓰면 고유방향 성분이 $(1-\alpha\lambda_i)^t$배가 된다. 수렴 $\iff0<\alpha<2/\lambda_{\max}$, 최적의 고정 $\alpha$에서 축소율은 $\frac{\kappa-1}{\kappa+1}$ ($\kappa=\lambda_{\max}/\lambda_{\min}$). 수업의 예 $H=\diag(1,100)$에서는 $x_{1,t+1}=(1-\alpha)x_{1,t}$, $x_{2,t+1}=(1-100\alpha)x_{2,t}$.`,
    body: R`
$H=Q\Lambda Q^T$ (직교 $Q$). $u_t=Q^Tx_t$이면 $u_{t+1}=Q^T(I-\alpha H)Qu_t=(I-\alpha\Lambda)u_t$, 즉 $u_{t+1,i}=(1-\alpha\lambda_i)u_{t,i}$. 수업의 예는 $H$가 이미 대각이라 $Q=I$.
**수렴.** 모든 초기값에서 $u_t\to0$ $\iff$ 모든 $i$에서 $\lvert1-\alpha\lambda_i\rvert<1$ $\iff$ $0<\alpha\lambda_i<2$ $\iff$ $\alpha<2/\lambda_{\max}$.
**최적 고정 학습률.** $\phi(\alpha)=\max_i\lvert1-\alpha\lambda_i\rvert=\max(\lvert1-\alpha\lambda_{\min}\rvert,\lvert1-\alpha\lambda_{\max}\rvert)$. 첫째는 $\alpha\le1/\lambda_{\min}$에서 감소, 둘째는 $\alpha\ge1/\lambda_{\max}$에서 증가하므로 최소는 $1-\alpha\lambda_{\min}=\alpha\lambda_{\max}-1$, $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$. 값 $\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\kappa-1}{\kappa+1}$.
**수업 수치.** $\alpha=0.019$: $x_1$ 축소율 $0.981$, $x_2$는 $-0.9$ (부호가 번갈아 바뀌는 진동). $(-5,-1)\to(-4.905,0.9)\to(-4.812,-0.81)\to(-4.720,0.729)$.`,
    note: R`오차를 $1/e$로 줄이는 데 약 $\frac{\kappa}{2}$걸음. 최적 모멘텀은 이것을 $\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ (약 $\frac{\sqrt\kappa}2$걸음)로 바꿉니다.` },
  { ch: 'ch14', id: 'heavyball', title: '모멘텀의 두 형태와 펼친 식', keys: ['모멘텀 (heavy ball)', '모멘텀의 펼친 식'], src: '강의 필기 · W5 월',
    tags: 'momentum heavy ball velocity exponential moving average unroll effective learning rate 모멘텀 속도 지수 가중합 유효 학습률',
    stmt: R`$v_{t+1}=\rho v_t-\alpha\nabla f(x_t)$, $x_{t+1}=x_t+v_{t+1}$, $v_0=0$은 $x_{t+1}=x_t-\alpha\nabla f(x_t)+\rho(x_t-x_{t-1})$ ($x_{-1}=x_0$)와 같고, $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}\nabla f(x_k)$. 기울기가 일정($g$)하면 $v_t\to-\frac\alpha{1-\rho}g$.`,
    body: R`
**두 형태.** $x_{t+1}=x_t+v_{t+1}$에서 $v_{t+1}=x_{t+1}-x_t$, 따라서 $v_t=x_t-x_{t-1}$ ($t\ge1$; $v_0=0$은 $x_{-1}=x_0$과 같음). 속도 식에 넣으면 $x_{t+1}-x_t=\rho(x_t-x_{t-1})-\alpha\nabla f(x_t)$.
**펼친 식(귀납법).** $g_k=\nabla f(x_k)$. $t=1$: $v_1=-\alpha g_0$. $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}g_k$이면 $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k=0}^{t-1}\rho^{t-k}g_k+g_t\big)=-\alpha\sum_{k=0}^t\rho^{t-k}g_k$. 필기의 $v_2=-\alpha(\rho g_0+g_1)$, $v_3=-\alpha(\rho^2g_0+\rho g_1+g_2)$가 이것입니다.
**유효 학습률.** $g_k=g$이면 $v_t=-\alpha g\frac{1-\rho^t}{1-\rho}\to-\frac\alpha{1-\rho}g$.`,
    note: R`부호가 번갈아 바뀌는 기울기 $g_k=(-1)^kg$이면 $\lvert v_t\rvert\le\frac{\alpha(1+\rho^t)}{1+\rho}\lvert g\rvert$ — 진동 방향은 오히려 감쇠됩니다. 이것이 좁은 골짜기에서 모멘텀이 도움이 되는 이유입니다.` },
  { ch: 'ch14', id: 'nesterovpf', title: '네스테로프 모멘텀의 “앞 지점” 형태', keys: ['네스테로프 모멘텀'], src: '강의 필기 · W5 월',
    tags: 'Nesterov momentum look ahead accelerated gradient 네스테로프 모멘텀 앞 지점 가속',
    stmt: R`$v_{t+1}=\rho v_t-\alpha\nabla f(x_t+\rho v_t)$, $x_{t+1}=x_t+v_{t+1}$은 $y_t=x_t+\rho v_t$로 두면 $x_{t+1}=y_t-\alpha\nabla f(y_t)$ (앞 지점에서의 GD 한 걸음)이다. 수업 예($f=\frac{x^2}2$, $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$)에서 모멘텀은 $-0.9$, 네스테로프는 $-0.72$.`,
    body: R`
$x_{t+1}=x_t+v_{t+1}=x_t+\rho v_t-\alpha\nabla f(x_t+\rho v_t)=y_t-\alpha\nabla f(y_t)$.
**수치.** $y_t=1+0.9(-2)=-0.8$. 모멘텀: $v_{t+1}=-1.8-0.1f'(1)=-1.9$, $x_{t+1}=-0.9$. 네스테로프: $v_{t+1}=-1.8-0.1f'(-0.8)=-1.8+0.08=-1.72$, $x_{t+1}=1-1.72=-0.72$ ($=y_t-0.1y_t=-0.72$).
**해석.** 두 방법 모두 관성 $-1.8$로 최솟점 0을 지나칩니다. 모멘텀은 출발점 $x_t=1$의 기울기(양수)로 더 왼쪽으로 밀고, 네스테로프는 도착할 곳 $y_t=-0.8$의 기울기(음수)로 되돌려 0에 더 가깝습니다.`,
    note: R`코드에서는 $\tilde x_t=x_t+\rho v_t$를 저장 변수로 바꿔 $v_{t+1}=\rho v_t-\alpha\nabla f(\tilde x_t)$, $\tilde x_{t+1}=\tilde x_t-\rho v_t+(1+\rho)v_{t+1}$로 써서 기울기를 한 번만 계산합니다.` },
  { ch: 'ch14', id: 'adagradpf', title: 'AdaGrad의 좌표별 걸음', keys: ['AdaGrad'], src: '강의 필기 · W5 월',
    tags: 'AdaGrad adaptive learning rate per coordinate accumulated squared gradient 적응형 학습률 누적 제곱',
    stmt: R`$A_t=A_{t-1}+g_t\odot g_t$ ($A_0=0$), $x_{t,j}=x_{t-1,j}-\frac{\alpha}{\sqrt{A_{t,j}}}g_{t,j}$ ($\varepsilon$ 무시)에서 (i) 첫걸음은 모든 좌표에서 크기 $\alpha$ (ii) 한 좌표의 기울기를 모두 $c>0$배 해도 걸음이 같다 (iii) 기울기 크기가 일정하면 $t$번째 걸음은 $\alpha/\sqrt t$.`,
    body: R`
$A_{t,j}=\sum_{k=1}^tg_{k,j}^2$.
**(i)** $t=1$: $\frac{\alpha g_{1,j}}{\sqrt{g_{1,j}^2}}=\alpha\operatorname{sign}(g_{1,j})$. 수업 예 $g_1=(0.1,10)$, $\alpha=0.01$: GD는 $(-0.001,-0.1)$, AdaGrad는 $(-0.01,-0.01)$.
**(ii)** 좌표 $j$의 모든 $g_{k,j}$를 $cg_{k,j}$로 바꾸면 $\sqrt{A_{t,j}}$도 $c$배라 비율이 같습니다 — 좌표마다 단위(스케일)에 무관한 걸음.
**(iii)** $\lvert g_{k,j}\rvert=c$이면 $A_{t,j}=tc^2$, 걸음 $\frac{\alpha c}{\sqrt tc}=\frac\alpha{\sqrt t}$ — 계속 줄어듭니다.`,
    note: R`(iii)이 비볼록 문제에서 “학습이 너무 일찍 멈추는” AdaGrad의 단점이고, RMSProp이 이를 고칩니다.` },
  { ch: 'ch14', id: 'rmsproppf', title: 'RMSProp의 지수이동평균', keys: ['RMSProp'],
    tags: 'RMSProp exponential moving average squared gradient decay rate 지수이동평균 감쇠율',
    stmt: R`$z_t=\beta z_{t-1}+(1-\beta)g_t\odot g_t$, $z_0=0$이면 $z_t=(1-\beta)\sum_{k=1}^t\beta^{t-k}g_k\odot g_k$. 기울기가 일정($g$)하면 $z_t=(1-\beta^t)g\odot g\to g\odot g$이고 걸음 $\alpha\frac{g}{\sqrt{z_t}}\to\alpha\operatorname{sign}(g)$ — 크기가 줄지 않는다.`,
    body: R`
펼친 식은 14.2절 모멘텀과 같은 귀납법($z_1=(1-\beta)g_1^2$, $z_t=\beta z_{t-1}+(1-\beta)g_t^2$). 일정한 $g$이면 $z_t=(1-\beta)g^2\sum_{k=0}^{t-1}\beta^k=(1-\beta^t)g^2$. $t\to\infty$이면 $g^2$이라 걸음 크기 $\alpha$.
가중치 $(1-\beta)\beta^{t-k}$는 $k$가 과거일수록 지수적으로 작아지고 합이 $1-\beta^t\le1$이라, 대략 최근 $\frac1{1-\beta}$개 기울기의 제곱 평균입니다. AdaGrad의 $A_t=\sum g_k^2$ (무게가 모두 1, 합이 $t$로 발산)와 달리 **오래된 기울기를 잊어** 유효 학습률이 0으로 가지 않습니다.`,
    note: R`슬라이드의 $\lVert\nabla f(x)\rVert_2^2$ 표기는 코드(dx * dx)처럼 성분별 제곱으로 읽어야 합니다. 스칼라 노름으로는 좌표별 학습률이 생기지 않습니다.` },
  { ch: 'ch14', id: 'adampf', title: 'Adam의 편향 보정과 첫걸음', keys: ['Adam', 'Adam의 편향 보정'],
    tags: 'Adam bias correction first moment second moment exponential moving average step size sign 편향 보정 1차 모멘트 2차 모멘트',
    stmt: R`$m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $m_0=0$이면 $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$이고, $\E g_k=\bar g$ (모든 $k$)이면 $\E m_t=(1-\beta_1^t)\bar g$. 따라서 $\hat m_t=m_t/(1-\beta_1^t)$는 불편. 편향 보정된 Adam의 첫걸음은 $\alpha\operatorname{sign}(g_1)$ ($\epsilon$ 무시)이고, 보정이 없으면 $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$ (기본값에서 약 $3.16\alpha$).`,
    body: R`
**펼치기.** $m_1=(1-\beta_1)g_1$; $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$에 귀납 가정을 넣으면 $(1-\beta_1)\big(\sum_{k<t}\beta_1^{t-k}g_k+g_t\big)$.
**기댓값.** $\E m_t=(1-\beta_1)\bar g\sum_{k=1}^t\beta_1^{t-k}=(1-\beta_1)\bar g\cdot\frac{1-\beta_1^t}{1-\beta_1}=(1-\beta_1^t)\bar g$. 같은 계산으로 $\E m_{2,t}=(1-\beta_2^t)\overline{g^2}$.
**첫걸음.** $t=1$: $\hat m_1=\frac{(1-\beta_1)g_1}{1-\beta_1}=g_1$, $\hat m_2=\frac{(1-\beta_2)g_1^2}{1-\beta_2}=g_1^2$. 걸음 $\alpha\frac{g_1}{\sqrt{g_1^2}}=\alpha\operatorname{sign}(g_1)$ (성분별).
**보정이 없으면** $\alpha\frac{(1-\beta_1)g_1}{\sqrt{(1-\beta_2)g_1^2}}=\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha\operatorname{sign}(g_1)$. $\beta_1=0.9$, $\beta_2=0.999$이면 $\frac{0.1}{0.0316}\approx3.16$배.`,
    note: R`$\hat m_1/\sqrt{\hat m_2}$는 “기울기 평균 ÷ 기울기 RMS”라 성분별로 대략 $[-1,1]$에 있어, Adam의 걸음은 대략 $\alpha$ 이하로 제한됩니다. 기본값 $\beta_1=0.9$, $\beta_2=0.999$, $\alpha=10^{-3}$ 또는 $5\times10^{-4}$.` },
  );
})();
