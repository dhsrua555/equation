/* 증명 — Part B: 05 로지스틱 회귀, 06 소프트맥스 회귀, 07 SVM */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 05
  { ch: 'ch05', id: 'sigmoid', title: '로짓과 시그모이드, 시그모이드의 도함수', keys: ['시그모이드의 성질'],
    tags: 'sigmoid logistic logit inverse derivative odds 시그모이드 로지스틱 로짓 역함수 도함수 오즈',
    stmt: R`$\sigma(z)=\frac1{1+e^{-z}}$는 $\operatorname{logit}(p)=\log\frac p{1-p}$의 역함수이고, $\sigma(-z)=1-\sigma(z)$, $\sigma'(z)=\sigma(z)(1-\sigma(z))\le\frac14$.`,
    body: R`
**역함수.** $z=\log\frac p{1-p}$이면 $e^z=\frac p{1-p}$, $e^z(1-p)=p$, $p(1+e^z)=e^z$, 따라서 $p=\frac{e^z}{1+e^z}=\frac1{1+e^{-z}}=\sigma(z)$. 거꾸로 $\operatorname{logit}(\sigma(z))=\log\frac{1/(1+e^{-z})}{e^{-z}/(1+e^{-z})}=\log e^z=z$.

**대칭.** $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}=\frac1{e^z+1}=\sigma(-z)$.

**도함수.** $\sigma(z)=(1+e^{-z})^{-1}$을 연쇄법칙으로 미분하면
$$\sigma'(z)=\frac{e^{-z}}{(1+e^{-z})^2}=\frac1{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)\big(1-\sigma(z)\big).$$
$s=\sigma(z)\in(0,1)$에 대해 $s(1-s)=\frac14-(s-\frac12)^2\le\frac14$, 등호는 $s=\frac12$ ($z=0$).` },
  { ch: 'ch05', id: 'lrnll', title: '로지스틱 회귀의 음의 로그가능도 정리', keys: ['로지스틱 회귀의 음의 로그가능도'], src: '강의 필기 · W3 월',
    tags: 'logistic regression negative log likelihood cross entropy 로지스틱 회귀 음의 로그가능도 교차 엔트로피',
    stmt: R`$P(y_i=1\mid x_i,w)=\sigma(w^Tx_i)$, $y_i\in\{0,1\}$이면
$$-\log L(w)=-\sum_i\big[y_i\log\sigma(z_i)+(1-y_i)\log(1-\sigma(z_i))\big]=\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i,\quad z_i=w^Tx_i.$$`,
    body: R`
**가능도.** 베르누이 분포를 한 식으로 쓰면 $p(y_i\mid x_i,w)=\sigma(z_i)^{y_i}(1-\sigma(z_i))^{1-y_i}$ ($y_i=1$이면 첫 인수, $0$이면 둘째 인수만 남음). 독립이므로 $L=\prod_ip(y_i\mid x_i,w)$이고
$$-\log L=-\sum_i\big[y_i\log\sigma(z_i)+(1-y_i)\log(1-\sigma(z_i))\big].$$

**정리(필기).** $\sigma(z)=\frac1{1+e^{-z}}$, $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}$에서
$$-\log\sigma(z)=\log(1+e^{-z}),\qquad -\log(1-\sigma(z))=-\log e^{-z}+\log(1+e^{-z})=z+\log(1+e^{-z}).$$
대입하면
$$-\log L=\sum_iy_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i+\sum_i(1-y_i)\log(1+e^{-z_i}).$$
첫 합과 셋째 합의 계수를 더하면 $y_i+(1-y_i)=1$이므로 $-\log L=\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i$.`,
    note: R`레이블을 $t_i\in\{1,-1\}$로 쓰면 같은 손실이 $\sum_i\log(1+e^{-t_iz_i})$ 한 줄이 됩니다($t_i=2y_i-1$). SVM의 힌지 손실 $\max(0,1-t_iz_i)$와 비교되는 꼴입니다.` },
  { ch: 'ch05', id: 'lrgrad', title: '로지스틱 손실의 기울기', keys: ['로지스틱 손실의 기울기'], src: '강의 필기 · W3 월',
    tags: 'logistic regression gradient descent derivative 로지스틱 기울기 경사하강',
    stmt: R`$J(w)=\sum_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i$의 기울기는 $\nabla J=\sum_i\big(\sigma(w^Tx_i)-y_i\big)x_i$.`,
    body: R`
$z_i=w^Tx_i$이면 $\nabla_wz_i=x_i$. 연쇄법칙으로
$$\nabla_w\log(1+e^{-z_i})=\frac{-e^{-z_i}}{1+e^{-z_i}}\,x_i=-\big(1-\sigma(z_i)\big)x_i,\qquad \nabla_w(1-y_i)z_i=(1-y_i)x_i.$$
더하면 $\big[-1+\sigma(z_i)+1-y_i\big]x_i=(\sigma(z_i)-y_i)x_i$. 합을 취하면 결과입니다.

**다른 경로(필기).** 표본 손실 $l_i=-[y_i\log p_i+(1-y_i)\log(1-p_i)]$, $p_i=\sigma(z_i)$에서
$$\frac{\partial l_i}{\partial z_i}=-\frac{y_i}{p_i}\sigma'(z_i)+\frac{1-y_i}{1-p_i}\sigma'(z_i)=-y_i(1-p_i)+(1-y_i)p_i=p_i-y_i,$$
($\sigma'=p_i(1-p_i)$) 이므로 $\nabla_wl_i=(p_i-y_i)x_i$.` },
  { ch: 'ch05', id: 'lrhess', title: '로지스틱 손실의 헤시안과 볼록성', keys: ['로지스틱 손실의 헤시안'], src: '강의 필기 · W3 월',
    tags: 'logistic regression Hessian convex positive semidefinite 로지스틱 헤시안 볼록 양의 준정부호',
    stmt: R`$\nabla^2J(w)=\sum_i\sigma(z_i)(1-\sigma(z_i))x_ix_i^T=X^TSX$이고 이는 양의 준정부호이다. 따라서 $J$는 볼록이고, $\nabla J(w^*)=0$인 $w^*$는 전역 최소점이다.`,
    body: R`
**헤시안.** $\nabla J=\sum_i(\sigma(z_i)-y_i)x_i$의 $k$번째 성분 $\sum_i(\sigma(z_i)-y_i)x_{ik}$를 $w_l$로 미분하면 $\frac{\partial\sigma(z_i)}{\partial w_l}=\sigma'(z_i)x_{il}$이므로
$$\frac{\partial^2J}{\partial w_l\partial w_k}=\sum_i\sigma'(z_i)x_{ik}x_{il}\quad\Longrightarrow\quad\nabla^2J=\sum_i\sigma'(z_i)x_ix_i^T.$$
행렬로 쓰면 $X^TSX$, $X$의 $i$번째 행이 $x_i^T$, $S=\diag(s_1,\dots,s_N)$, $s_i=\sigma(z_i)(1-\sigma(z_i))$ (필기의 $\sum_ix_is_ix_i^T=X^TSX$).

**양의 준정부호(필기).** 임의의 $v$에 대해
$$v^T\nabla^2Jv=(Xv)^TS(Xv)=\sum_is_i(x_i^Tv)^2\ge0,\qquad s_i\in(0,\tfrac14].$$

**볼록성.** $u,w$에 대해 $g(t)=J(w+t(u-w))$로 두면 $g''(t)=(u-w)^T\nabla^2J(\cdot)(u-w)\ge0$이라 $g$는 볼록이고, $g(1)\ge g(0)+g'(0)$, 즉
$$J(u)\ge J(w)+\nabla J(w)^T(u-w).$$
$\nabla J(w^*)=0$이면 모든 $u$에서 $J(u)\ge J(w^*)$입니다.`,
    note: R`$S$의 대각성분이 모두 양수이므로 $X$의 열이 일차독립이면 $X^TSX\succ0$ (순볼록)입니다. 그래도 자료가 선형 분리 가능하면 최소점 자체가 존재하지 않습니다(손실의 하한 0에 도달하지 못함). 헤시안이 양의 정부호라는 것은 “최소점이 있다면 유일”하다는 뜻일 뿐입니다.` },
  { ch: 'ch05', id: 'lrcontour', title: '확률 등고선은 서로 평행한 초평면', keys: ['시그모이드의 성질'],
    tags: 'decision boundary contour hyperplane logistic 결정 경계 등고선 초평면',
    stmt: R`$0<c<1$에 대해 $\{x:\sigma(w^Tx)=c\}=\{x:w^Tx=\log\frac c{1-c}\}$. 특히 $c=\frac12$이면 결정 경계 $w^Tx=0$이다.`,
    body: R`
$\sigma$는 순증가($\sigma'>0$)라 일대일이고 역함수가 logit입니다. 따라서 $\sigma(w^Tx)=c\iff w^Tx=\operatorname{logit}(c)$. 우변은 상수이므로 법선이 $w$로 같은 초평면들이고, $c$가 달라지면 평행이동만 됩니다. $\operatorname{logit}(\frac12)=0$.` },

  // ───── 06
  { ch: 'ch06', id: 'softjac', title: '소프트맥스의 야코비안', keys: ['소프트맥스 손실의 기울기'],
    tags: 'softmax Jacobian derivative quotient rule 소프트맥스 야코비안 도함수',
    stmt: R`$p_k=\dfrac{e^{z_k}}{\sum_je^{z_j}}$이면 $\dfrac{\partial p_k}{\partial z_m}=p_k(\delta_{km}-p_m)$, 즉 야코비안은 $\diag(p)-pp^T$.`,
    body: R`
$Z=\sum_je^{z_j}$, $\dfrac{\partial Z}{\partial z_m}=e^{z_m}$, $\dfrac{\partial e^{z_k}}{\partial z_m}=\delta_{km}e^{z_k}$. 몫의 미분법으로
$$\frac{\partial p_k}{\partial z_m}=\frac{\delta_{km}e^{z_k}\,Z-e^{z_k}\,e^{z_m}}{Z^2}=\delta_{km}\frac{e^{z_k}}Z-\frac{e^{z_k}}Z\cdot\frac{e^{z_m}}Z=\delta_{km}p_k-p_kp_m.$$
$(k,m)$ 성분을 모으면 $\diag(p)-pp^T$.

**가중치에 대해.** $z_l=w_l^Tx$이므로 $\partial z_l/\partial w_{mn}=\delta_{lm}x_n$이고
$$\frac{\partial p_k}{\partial w_{mn}}=\sum_l\frac{\partial p_k}{\partial z_l}\frac{\partial z_l}{\partial w_{mn}}=(\delta_{km}p_k-p_kp_m)x_n$$
(슬라이드 17의 식).`,
    note: R`$\diag(p)-pp^T$의 행 합은 $p_k-p_k\sum_mp_m=0$입니다. 모든 로짓에 같은 값을 더해도 확률이 변하지 않는다는 사실의 미분 버전입니다.` },
  { ch: 'ch06', id: 'softgrad', title: '소프트맥스 교차 엔트로피의 기울기', keys: ['소프트맥스 손실의 기울기', '소프트맥스 교차 엔트로피 손실'],
    tags: 'softmax cross entropy gradient one-hot 소프트맥스 교차 엔트로피 기울기 원핫',
    stmt: R`$J(W)=-\sum_i\sum_ky_{ik}\log p_k(x_i,W)$ (원-핫 $y_i$)이면 $\dfrac{\partial J}{\partial w_{mn}}=-\sum_i\big(y_{im}-p_m(x_i,W)\big)x_{in}$, 즉 $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$.`,
    body: R`
한 표본에 대해 $\frac{\partial}{\partial w_{mn}}\log p_k=\frac1{p_k}\frac{\partial p_k}{\partial w_{mn}}=\frac1{p_k}(\delta_{km}p_k-p_kp_m)x_n=(\delta_{km}-p_m)x_n$. 따라서
$$\frac{\partial J}{\partial w_{mn}}=-\sum_i\sum_ky_{ik}(\delta_{km}-p_m)x_{in}=-\sum_i\Big(y_{im}-p_m\sum_ky_{ik}\Big)x_{in}=-\sum_i(y_{im}-p_m)x_{in}.$$
마지막에 원-핫 조건 $\sum_ky_{ik}=1$을 썼습니다. $(m,n)$ 성분을 모으면 $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$ ($C\times d$ 행렬).`,
    note: R`$C=2$이면 $p_1=\sigma((w_1-w_2)^Tx)$이고, 이 식은 로지스틱 회귀의 기울기 $\sum(\sigma-y)x$와 같아집니다.` },
  { ch: 'ch06', id: 'softshift', title: '소프트맥스의 평행이동 불변성과 이진 경우', keys: ['소프트맥스 함수'],
    tags: 'softmax shift invariance logistic binary overparameterization 평행이동 불변 로지스틱',
    stmt: R`모든 $k$에 대해 $z_k\to z_k+c$이어도 $\softmax(z)$는 같다. 특히 $C=2$이면 $p_1=\sigma(z_1-z_2)$이다.`,
    body: R`
$$\frac{e^{z_k+c}}{\sum_je^{z_j+c}}=\frac{e^ce^{z_k}}{e^c\sum_je^{z_j}}=\frac{e^{z_k}}{\sum_je^{z_j}}.$$
$C=2$: $p_1=\frac{e^{z_1}}{e^{z_1}+e^{z_2}}$의 분자·분모를 $e^{z_1}$로 나누면 $\frac1{1+e^{-(z_1-z_2)}}=\sigma(z_1-z_2)$.

가중치로는 모든 $w_k$에 같은 $v$를 더하면 $z_k$에 $v^Tx$가 더해지므로 모델이 같습니다. 규제 없는 소프트맥스 회귀의 최소점이 유일하지 않은 이유이며, 수치 계산에서는 $c=-\max_jz_j$를 더해 오버플로를 막습니다.` },
  { ch: 'ch06', id: 'softconvex', title: '소프트맥스 교차 엔트로피는 볼록', keys: ['소프트맥스 교차 엔트로피 손실'],
    tags: 'softmax convex Hessian variance 소프트맥스 볼록 헤시안 분산',
    stmt: R`한 표본의 손실 $\ell(z)=-\log p_y(z)$의 헤시안은 $\nabla_z^2\ell=\diag(p)-pp^T\succeq0$이고, 따라서 $J(W)$는 $W$에 대해 볼록이다.`,
    body: R`
$\ell(z)=-z_y+\log\sum_je^{z_j}$이므로 $\nabla_z\ell=p-e_y$ ($e_y$는 원-핫), $\nabla_z^2\ell=\frac{\partial p}{\partial z}=\diag(p)-pp^T$ (야코비안 증명).
임의의 $v$에 대해
$$v^T(\diag(p)-pp^T)v=\sum_kp_kv_k^2-\Big(\sum_kp_kv_k\Big)^2=\E_p[V^2]-(\E_p[V])^2=\Var_p(V)\ge0,$$
여기서 $V$는 확률 $p_k$로 값 $v_k$를 갖는 확률변수입니다. $\ell$은 $z$에 대해 볼록이고 $z=Wx$는 $W$의 선형함수이므로 합성 $\ell(Wx)$도 $W$에 대해 볼록, 볼록함수의 합 $J$도 볼록입니다.` },

  // ───── 07
  { ch: 'ch07', id: 'dist', title: '점과 초평면 사이의 거리', keys: ['점과 초평면 사이의 거리'], src: '강의 필기 · W3 월',
    tags: 'distance point hyperplane projection normal 거리 초평면 사영 법선',
    stmt: R`$H=\{z:w^Tz+b=0\}$ ($w\ne0$)와 점 $x$ 사이의 거리는 $\dfrac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}$이다.`,
    body: R`
**수선의 발(필기).** $x_p=x-d$가 $H$ 위의 점이고 $d$가 법선 $w$와 평행하다고 두면 $d=\alpha w$. $x_p\in H$에서
$$w^T(x-\alpha w)+b=0\iff\alpha=\frac{w^Tx+b}{w^Tw}.$$
$$\lVert d\rVert_2=\sqrt{\alpha^2w^Tw}=\lvert\alpha\rvert\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{w^Tw}\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}.$$

**최소 거리.** $H$ 위의 임의의 점 $z$에 대해 $w^T(x_p-z)=(-b)-(-b)=0$이므로 $x_p-z\perp w\parallel d$. 따라서
$$\lVert x-z\rVert^2=\lVert d+(x_p-z)\rVert^2=\lVert d\rVert^2+\lVert x_p-z\rVert^2\ge\lVert d\rVert^2,$$
등호는 $z=x_p$. 즉 $\lVert d\rVert$가 $x$에서 $H$까지의 거리입니다.`,
    note: R`$w$가 법선인 이유: $H$ 위의 두 점 $z_1,z_2$에 대해 $w^T(z_1-z_2)=0$, 즉 $w$는 평면 안의 모든 방향과 직교합니다. $x=0$이면 원점까지의 거리 $\lvert b\rvert/\lVert w\rVert$ (슬라이드 20).` },
  { ch: 'ch07', id: 'svmprimal', title: '마진 최대화 문제에서 하드 마진 SVM으로', keys: ['하드 마진 SVM (원문제)'], src: '강의 필기 · W3 월',
    tags: 'SVM margin maximization scale invariance primal problem 마진 최대화 스케일 불변 원문제',
    stmt: R`자료가 선형 분리 가능하면 $\max_{w,b}r(w,b)$ s.t. $y_i(w^Tx_i+b)\ge0$ ($r(w,b)=\min_{x\in D}\lvert w^Tx+b\rvert/\lVert w\rVert_2$)의 최적 초평면은 $\min_{w,b}\frac12w^Tw$ s.t. $y_i(w^Tx_i+b)\ge1$의 해와 같다.`,
    body: R`
**1. 스케일 불변(필기).** $\beta>0$이면 $\{x:\beta w^Tx+\beta b=0\}$은 같은 평면이고
$$r(\beta w,\beta b)=\min_x\frac{\beta\lvert w^Tx+b\rvert}{\beta\lVert w\rVert}=r(w,b),\qquad y_i(\beta w^Tx_i+\beta b)\ge0\iff y_i(w^Tx_i+b)\ge0.$$

**2. 정규화.** 최적 평면은 어떤 자료점도 지나지 않습니다(지나면 마진이 0인데, 분리 가능하므로 마진이 양수인 평면이 있음). 따라서 $\min_i\lvert w^Tx_i+b\rvert>0$이고, $\beta=1/\min_i\lvert w^Tx_i+b\rvert$로 스케일을 바꿔 $\min_i\lvert w^Tx_i+b\rvert=1$로 둘 수 있습니다. 그러면
$$r(w,b)=\frac1{\lVert w\rVert}\Big[\min_x\lvert w^Tx+b\rvert\Big]=\frac1{\lVert w\rVert}.$$
(필기는 분모를 $w^Tw$로 적었지만 거리 공식의 분모는 $\lVert w\rVert=\sqrt{w^Tw}$입니다.)

**3. 목적함수.** $\max\frac1{\lVert w\rVert}\iff\min\lVert w\rVert\iff\min\frac12w^Tw$ ($t\mapsto\frac12t^2$은 $t\ge0$에서 증가).

**4. 제약의 합치기.** 이제 문제는 “$\min\frac12w^Tw$ s.t. $y_i(w^Tx_i+b)\ge0$, $\min_i\lvert w^Tx_i+b\rvert=1$”입니다(필기). 이것이 “$\min\frac12w^Tw$ s.t. $y_i(w^Tx_i+b)\ge1$”과 같음을 보입니다.
- 앞 문제의 가능해는 뒤 문제의 가능해: $y_i\in\{\pm1\}$이고 $y_i(w^Tx_i+b)\ge0$이면 $y_i(w^Tx_i+b)=\lvert w^Tx_i+b\rvert\ge1$.
- 뒤 문제의 최적해 $(w^*,b^*)$는 앞 문제의 가능해: $y_i(\cdot)\ge1\ge0$은 자명하고, 만약 $m=\min_iy_i(w^{*T}x_i+b^*)>1$이면 $(w^*/m,b^*/m)$도 뒤 문제의 가능해인데 $\frac12\lVert w^*/m\rVert^2<\frac12\lVert w^*\rVert^2$이라 최적성에 모순. 따라서 $m=1$, 즉 $\min_i\lvert w^{*T}x_i+b^*\rvert=1$.

앞 문제의 가능 영역이 뒤 문제의 가능 영역에 포함되고, 뒤 문제의 최적해가 앞 영역에 들어 있으므로 두 문제의 최적해가 같습니다.`,
    note: R`최적해에서 $\min_iy_i(w^Tx_i+b)=1$이므로 등호를 이루는 점, 즉 $x^Tw+b=\pm1$ 위의 점이 반드시 있습니다. 이것이 서포트 벡터이고 마진 폭은 $2/\lVert w\rVert$입니다.` },
  { ch: 'ch07', id: 'penalty', title: '벌점 함수로 제약 표현하기', keys: ['SVM 쌍대 문제'], src: '강의 필기 · W3 월',
    tags: 'penalty Lagrange multiplier constraint min max SVM 벌점 라그랑주 승수 제약',
    stmt: R`$g_i(w,b)=1-y_i(x_i^Tw+b)$라 하면 $\max_{\alpha_i\ge0}\alpha_ig_i=0$ ($g_i\le0$), $+\infty$ ($g_i>0$). 따라서 $\min_{w,b}\big[\frac12w^Tw+\sum_i\max_{\alpha_i\ge0}\alpha_ig_i\big]=\min_{w,b}\max_{\alpha\ge0}L_p(w,b,\alpha)$는 하드 마진 SVM과 같다.`,
    body: R`
**(i) $g_i\le0$ (제약 만족).** $\alpha_i\ge0$이면 $\alpha_ig_i\le0$이고 $\alpha_i=0$에서 0이 되므로 최댓값 0.

**(ii) $g_i>0$ (제약 위반).** $\alpha_ig_i\to\infty$ ($\alpha_i\to\infty$)이므로 상한이 없어 $+\infty$.

따라서 $\frac12w^Tw+\sum_i\max_{\alpha_i}\alpha_ig_i$는 가능해에서 $\frac12w^Tw$, 불가능해에서 $+\infty$이고, 이를 최소화하면 원문제의 최적해가 나옵니다. $\alpha_i$들은 서로 독립적으로 고를 수 있으므로 $\sum_i\max_{\alpha_i}=\max_\alpha\sum_i$이고, $L_p=\frac12w^Tw+\sum_i\alpha_ig_i$로 쓰면 $\min_{w,b}\max_{\alpha\ge0}L_p$입니다.` },
  { ch: 'ch07', id: 'weakdual', title: '약한 쌍대성', keys: ['SVM 쌍대 문제'],
    tags: 'weak duality min max inequality Lagrangian dual 약한 쌍대성 최소 최대',
    stmt: R`임의의 집합 $U,V$와 함수 $L:U\times V\to\mathbb R$에 대해 $\inf_{u}\sup_{v}L(u,v)\ge\sup_{v}\inf_{u}L(u,v)$.`,
    body: R`
임의의 $u'\in U$, $v'\in V$를 고정하면 하한과 상한의 정의에서
$$\inf_{u}L(u,v')\le L(u',v')\le\sup_{v}L(u',v).$$
맨 왼쪽은 $u'$와 무관하므로, 오른쪽을 $u'$에 대해 하한을 취해도 부등식이 유지됩니다: $\inf_uL(u,v')\le\inf_{u'}\sup_vL(u',v)$. 이제 우변은 $v'$와 무관하므로 좌변을 $v'$에 대해 상한을 취하면
$$\sup_{v'}\inf_uL(u,v')\le\inf_{u'}\sup_vL(u',v).$$`,
    note: R`SVM에서는 원문제가 볼록 이차계획이고 제약이 아핀이며 가능해가 있으므로 등호(강한 쌍대성)가 성립합니다(슬레이터 조건의 아핀 버전). 그래서 쌍대 문제의 최적값과 원문제의 최적값이 같고, 쌍대 해로 원문제의 해를 복원할 수 있습니다.` },
  { ch: 'ch07', id: 'svmdual', title: 'SVM 쌍대 문제의 유도', keys: ['SVM 쌍대 문제'],
    tags: 'SVM dual quadratic programming Lagrangian stationarity kernel 쌍대 이차계획 라그랑지안 정류',
    stmt: R`$L_p(w,b,\alpha)=\frac12w^Tw+\sum_i\alpha_i(1-y_i(x_i^Tw+b))$, $\alpha\ge0$에 대해 $\min_{w,b}L_p$는 $\sum_i\alpha_iy_i=0$일 때 $\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$이고 ($w=\sum_i\alpha_iy_ix_i$에서 달성), $\sum_i\alpha_iy_i\ne0$이면 $-\infty$이다. 따라서 쌍대 문제는
$$\max_\alpha\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j\quad\text{s.t. }\alpha_i\ge0,\ \sum_i\alpha_iy_i=0.$$`,
    body: R`
$L_p$를 전개합니다.
$$L_p=\frac12w^Tw-w^T\Big(\sum_i\alpha_iy_ix_i\Big)-b\sum_i\alpha_iy_i+\sum_i\alpha_i.$$
**$b$에 대해.** $b$의 일차식이므로 계수 $\sum_i\alpha_iy_i\ne0$이면 $b\to\pm\infty$로 $-\infty$. 쌍대 함수가 유한하려면 $\sum_i\alpha_iy_i=0$ (슬라이드의 $\partial L_p/\partial b=0$).

**$w$에 대해.** $\frac12w^Tw-w^Tu$ ($u=\sum_i\alpha_iy_ix_i$)는 순볼록 이차식이고 $\nabla_w=w-u=0$에서 최소, 최솟값은 $\frac12u^Tu-u^Tu=-\frac12u^Tu$.

**대입.** $\sum\alpha_iy_i=0$이면
$$\min_{w,b}L_p=\sum_i\alpha_i-\frac12u^Tu=\sum_i\alpha_i-\frac12\Big(\sum_i\alpha_iy_ix_i\Big)^T\Big(\sum_j\alpha_jy_jx_j\Big)=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$
이를 $\alpha\ge0$, $\sum\alpha_iy_i=0$에서 최대화하는 것이 쌍대 문제입니다.`,
    note: R`쌍대 목적함수는 $\alpha$에 대해 오목입니다: 이차항 $-\frac12\lVert\sum\alpha_iy_ix_i\rVert^2\le0$. 따라서 쌍대 문제는 볼록 최적화(오목 함수의 최대화)이고 이차계획법 풀이기로 풉니다.` },
  { ch: 'ch07', id: 'svmb', title: '절편 b와 KKT 상보성', keys: ['SVM의 절편 b'],
    tags: 'SVM bias intercept support vector KKT complementary slackness 절편 서포트 벡터 상보성',
    stmt: R`서포트 벡터 $x_i$ ($y_i(x_i^Tw+b)=1$)에서 $b=y_i-x_i^Tw$. 또 최적해에서 $\alpha_i\big(1-y_i(x_i^Tw+b)\big)=0$이므로 $y_i(x_i^Tw+b)>1$인 점은 $\alpha_i=0$이다.`,
    body: R`
**절편.** $y_i(x_i^Tw+b)=1$의 양변에 $y_i$를 곱하면 $y_i^2(x_i^Tw+b)=y_i$이고 $y_i^2=1$이므로 $x_i^Tw+b=y_i$, $b=y_i-x_i^Tw$.

**상보성.** 강한 쌍대성이 성립하고 $(w^*,b^*)$, $\alpha^*$가 각각 원·쌍대 최적해이면
$$\tfrac12\lVert w^*\rVert^2=\min_{w,b}L_p(w,b,\alpha^*)\le L_p(w^*,b^*,\alpha^*)=\tfrac12\lVert w^*\rVert^2+\sum_i\alpha_i^*g_i(w^*,b^*).$$
그런데 $\alpha_i^*\ge0$, $g_i(w^*,b^*)\le0$이라 $\sum_i\alpha_i^*g_i\le0$. 두 식에서 $\sum_i\alpha_i^*g_i=0$이고, 각 항이 $\le0$이므로 모든 $i$에 대해 $\alpha_i^*g_i=0$. $g_i<0$ (마진 밖)이면 $\alpha_i^*=0$.`,
    note: R`결과적으로 $w=\sum_i\alpha_iy_ix_i$는 $\alpha_i>0$인 점, 즉 마진 경계 위의 서포트 벡터만의 일차결합입니다. 서포트 벡터가 아닌 점을 옮기거나 지워도(마진 밖에 있는 한) 해가 바뀌지 않습니다.` },
  );
})();
