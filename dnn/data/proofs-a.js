/* 증명 — Part A: 01 선형회귀, 02 확률·추정, 03 정보이론, 04 확률적 회귀·커널
   src가 있는 항목은 수업 중 필기로 증명한 것입니다. 필기에서 생략된 단계를 채워 넣었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'vecgrad', title: '벡터 미분의 두 공식', keys: ['행렬 미분 공식'], src: '강의 필기 · W1 수 s.6',
    tags: 'gradient vector derivative quadratic form 행렬 미분 이차형식 기울기',
    stmt: R`$\beta,m\in\mathbb R^p$, $A\in\mathbb R^{p\times p}$이면 $\nabla_\beta(\beta^Tm)=m$, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$. 특히 $A$가 대칭이면 $2A\beta$.`,
    body: R`
기울기의 $k$번째 성분이 $\partial/\partial\beta_k$임을 쓰고 성분으로 계산합니다. 크로네커 델타 $\delta_{ik}=\partial\beta_i/\partial\beta_k$ ($i=k$이면 1, 아니면 0).

**(a)** $\beta^Tm=\sum_i\beta_im_i$이므로 $\dfrac{\partial}{\partial\beta_k}\beta^Tm=\sum_i\delta_{ik}m_i=m_k$. 모든 $k$에 대해 모으면 $\nabla_\beta(\beta^Tm)=m$. $m^T\beta=\beta^Tm$(스칼라)이므로 같은 결과입니다.

**(b)** $\beta^TA\beta=\sum_{i=1}^p\sum_{j=1}^p\beta_iA_{ij}\beta_j$. 곱의 미분법으로
$$\frac{\partial}{\partial\beta_k}\beta^TA\beta=\sum_{i,j}\big(\delta_{ik}A_{ij}\beta_j+\beta_iA_{ij}\delta_{jk}\big)=\sum_jA_{kj}\beta_j+\sum_iA_{ik}\beta_i=(A\beta)_k+(A^T\beta)_k.$$
필기의 설명대로 첫 합은 “$i=k$인 항들”, 둘째 합은 “$j=k$인 항들”에서 온 것입니다. $i=j=k$인 항 $A_{kk}\beta_k^2$의 도함수 $2A_{kk}\beta_k$는 두 합에 한 번씩 $A_{kk}\beta_k$로 들어가므로 빠지거나 겹치지 않습니다. 따라서
$$\nabla_\beta(\beta^TA\beta)=A\beta+A^T\beta=(A+A^T)\beta.$$
$A^T=A$이면 $2A\beta$.`,
    note: R`정규방정식에서는 $A=X^TX$가 대칭이라 $2X^TX\beta$를 씁니다. 비대칭 $A$에 $2A\beta$를 쓰는 실수가 흔합니다. $\beta^TA\beta=\beta^T\frac{A+A^T}2\beta$이므로 이차형식은 항상 대칭 부분만 기억해도 됩니다.` },
  { ch: 'ch01', id: 'normal', title: '정규방정식과 최소제곱해', keys: ['정규방정식'], src: '강의 필기 · W1 수 s.6',
    tags: 'normal equation least squares LSE 정규방정식 최소제곱 헤시안 볼록',
    stmt: R`$f(\beta)=\lVert y-X\beta\rVert^2$의 최솟점은 $X^TX\beta=X^Ty$를 만족한다. $X$의 열이 일차독립이면 최솟점은 $\hat\beta=(X^TX)^{-1}X^Ty$ 하나뿐이다.`,
    body: R`
**1. 전개.** 전치의 성질 $(y-X\beta)^T=y^T-\beta^TX^T$로
$$f(\beta)=y^Ty-y^TX\beta-\beta^TX^Ty+\beta^TX^TX\beta.$$
$y^TX\beta$는 $1\times1$이라 자신의 전치와 같습니다: $y^TX\beta=(y^TX\beta)^T=\beta^TX^Ty$. 따라서 $f(\beta)=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$.

**2. 미분.** 벡터 미분 공식에서 $m=X^Ty$, $A=X^TX$로 두면($A^T=X^T(X^T)^T=X^TX$ 대칭)
$$\nabla f(\beta)=0-2X^Ty+2X^TX\beta=-2X^T(y-X\beta).$$

**3. 정류점.** $\nabla f=0\iff X^TX\beta=X^Ty$ (정규방정식).

**4. 최솟점임.** $f$는 $\beta$의 이차식이므로 임의의 $\beta,\ v$에 대해 정확히
$$f(\beta+v)=f(\beta)+\nabla f(\beta)^Tv+v^TX^TXv=f(\beta)+\nabla f(\beta)^Tv+\lVert Xv\rVert^2.$$
정규방정식의 해 $\hat\beta$에서는 $\nabla f(\hat\beta)=0$이므로 $f(\hat\beta+v)=f(\hat\beta)+\lVert Xv\rVert^2\ge f(\hat\beta)$. 따라서 $\hat\beta$는 전역 최솟점입니다(헤시안 $2X^TX\succeq0$이라 $f$가 볼록인 것과 같은 말입니다).

**5. 유일성.** $X$의 열이 일차독립이면 $v\ne0\Rightarrow Xv\ne0$이므로 $f(\hat\beta+v)>f(\hat\beta)$, 최솟점이 하나뿐입니다. 또 $X^TXv=0\Rightarrow v^TX^TXv=\lVert Xv\rVert^2=0\Rightarrow v=0$이라 $X^TX$가 가역이고 $\hat\beta=(X^TX)^{-1}X^Ty$.`,
    note: R`열이 일차종속이면 정규방정식의 해가 무수히 많고, 모두 같은 최솟값을 가집니다(4단계의 식에서 $Xv=0$인 방향으로는 $f$가 변하지 않음). 이때 릿지 규제 $\lambda>0$을 더하면 해가 유일해집니다.` },
  { ch: 'ch01', id: 'projection', title: '잔차의 직교성과 정사영', keys: ['정규방정식'],
    tags: 'orthogonal projection residual hat matrix 정사영 잔차 모자 행렬',
    stmt: R`최소제곱해 $\hat\beta$에서 잔차 $r=y-X\hat\beta$는 $X$의 모든 열과 직교하고, 열이 일차독립이면 $H=X(X^TX)^{-1}X^T$는 대칭 멱등행렬이며 $X\hat\beta=Hy$는 $y$의 열공간 위로의 정사영이다.`,
    body: R`
정규방정식 $X^TX\hat\beta=X^Ty$는 $X^T(y-X\hat\beta)=0$, 즉 $X$의 각 열 $c_j$에 대해 $c_j^Tr=0$입니다. 열공간의 임의의 원소 $Xv$에 대해서도 $(Xv)^Tr=v^TX^Tr=0$.

$H^T=X\big((X^TX)^{-1}\big)^TX^T=X(X^TX)^{-1}X^T=H$ (대칭행렬의 역행렬은 대칭). $H^2=X(X^TX)^{-1}(X^TX)(X^TX)^{-1}X^T=H$.

$\hat y=Hy$는 열공간에 있고 $y-\hat y\perp$ 열공간이므로 피타고라스 정리에서 열공간의 임의의 $z$에 대해 $\lVert y-z\rVert^2=\lVert y-\hat y\rVert^2+\lVert\hat y-z\rVert^2\ge\lVert y-\hat y\rVert^2$. 이것은 최소제곱의 기하학적 증명이기도 합니다.`,
    note: R`절편이 있으면 $X$의 첫 열이 $\mathbf 1$이므로 $\mathbf 1^Tr=\sum_ir_i=0$: 최소제곱 잔차의 합은 0입니다.` },
  { ch: 'ch01', id: 'gdpartial', title: '제곱오차합의 편미분', keys: ['경사하강법 갱신식 (선형회귀)'],
    tags: 'gradient descent partial derivative update rule 경사하강법 편미분 갱신',
    stmt: R`$f(\beta)=\sum_{i=1}^n\big(y_i-\sum_{j=0}^k\beta_jx_{ij}\big)^2$ ($x_{i0}=1$)이면 $\dfrac{\partial f}{\partial\beta_l}=-2\sum_{i=1}^n\big(y_i-\hat y_i\big)x_{il}$이고, 벡터로 $\nabla f=-2X^T(y-X\beta)$이다.`,
    body: R`
합의 각 항을 연쇄법칙으로 미분합니다. $e_i=y_i-\sum_j\beta_jx_{ij}$이면 $\partial e_i/\partial\beta_l=-x_{il}$이므로
$$\frac{\partial}{\partial\beta_l}\sum_ie_i^2=\sum_i2e_i\frac{\partial e_i}{\partial\beta_l}=-2\sum_ie_ix_{il}.$$
$l=0,\dots,k$를 세로로 모으면 $-2\sum_ie_i(x_{i0},\dots,x_{ik})^T=-2X^Te$, $e=y-X\beta$. 정규방정식 증명의 기울기와 같습니다.

경사하강법은 $\beta\leftarrow\beta-\alpha\nabla f=\beta+2\alpha X^T(y-X\beta)$이고, 슬라이드는 2를 $\alpha$에 흡수해 $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$로 씁니다.`,
    note: R`기울기 식에 $\sum_{i=1}^n$이 있어 한 번 갱신하는 데 전체 자료가 필요합니다. 한 점 $i$의 항만 쓰면 확률적 경사하강법(10단원)이 됩니다.` },

  // ───── 02
  { ch: 'ch02', id: 'axioms', title: '확률의 공리에서 기본 성질 유도', keys: ['확률의 기본 성질'],
    tags: 'probability axioms complement inclusion exclusion monotone 공리 여사건 포함배제 단조성',
    stmt: R`확률의 세 공리로부터 $P(\varnothing)=0$, $P(E^c)=1-P(E)$, $E\subset F\Rightarrow P(E)\le P(F)$, $P(E\cup F)=P(E)+P(F)-P(E\cap F)$가 성립한다.`,
    body: R`
**$P(\varnothing)=0$.** $E_1=\Omega$, $E_2=E_3=\cdots=\varnothing$은 서로소이고 합집합이 $\Omega$입니다. 공리 3에서 $P(\Omega)=P(\Omega)+\sum_{i\ge2}P(\varnothing)$. $P(\varnothing)\ge0$이므로 무한합이 유한하려면 $P(\varnothing)=0$. (따라서 공리 3은 유한 개의 서로소 사건에도 성립합니다: 나머지를 $\varnothing$으로 채우면 됩니다.)

**여사건.** $E$와 $E^c$는 서로소이고 $E\cup E^c=\Omega$이므로 $1=P(\Omega)=P(E)+P(E^c)$.

**단조성.** $E\subset F$이면 $F=E\cup(F\setminus E)$ (서로소)이므로 $P(F)=P(E)+P(F\setminus E)\ge P(E)$.

**포함배제.** $E\cup F=E\cup(F\setminus E)$, $F=(E\cap F)\cup(F\setminus E)$ 모두 서로소 분해입니다.
$$P(E\cup F)=P(E)+P(F\setminus E),\qquad P(F)=P(E\cap F)+P(F\setminus E).$$
두 식을 빼면 $P(E\cup F)-P(F)=P(E)-P(E\cap F)$.`,
    note: R`공리 1의 $P(E)\le1$은 사실 나머지 공리와 여사건 성질에서도 나옵니다: $P(E)=1-P(E^c)\le1$.` },
  { ch: 'ch02', id: 'continuity', title: '확률의 연속성', keys: ['확률의 기본 성질'],
    tags: 'continuity of probability increasing decreasing sequence 연속성 증가 감소 사건열',
    stmt: R`$E_1\subset E_2\subset\cdots$이면 $P\big(\bigcup_nE_n\big)=\lim_{n\to\infty}P(E_n)$. $E_1\supset E_2\supset\cdots$이면 $P\big(\bigcap_nE_n\big)=\lim_{n\to\infty}P(E_n)$.`,
    body: R`
**증가하는 경우.** $F_1=E_1$, $F_n=E_n\setminus E_{n-1}$ ($n\ge2$)로 두면 $F_n$들은 서로소이고 $\bigcup_{i=1}^nF_i=E_n$, $\bigcup_iF_i=\bigcup_iE_i$입니다. 공리 3에서
$$P\Big(\bigcup_iE_i\Big)=\sum_{i=1}^\infty P(F_i)=\lim_{n\to\infty}\sum_{i=1}^nP(F_i)=\lim_{n\to\infty}P\Big(\bigcup_{i=1}^nF_i\Big)=\lim_{n\to\infty}P(E_n).$$

**감소하는 경우.** $E_n^c$는 증가하는 사건열이고 드모르간 법칙에서 $\bigcup_nE_n^c=\big(\bigcap_nE_n\big)^c$. 앞의 결과와 여사건 성질로
$$1-P\Big(\bigcap_nE_n\Big)=P\Big(\bigcup_nE_n^c\Big)=\lim_nP(E_n^c)=1-\lim_nP(E_n).$$` },
  { ch: 'ch02', id: 'bayes', title: '전확률 법칙과 베이즈 정리', keys: ['베이즈 정리'],
    tags: 'total probability Bayes theorem posterior prior likelihood evidence 전확률 베이즈 사후 사전 가능도 증거',
    stmt: R`$\{E_i\}$가 $\Omega$의 분할이고 $P(E_i)>0$이면 $P(F)=\sum_iP(F\mid E_i)P(E_i)$이고, $P(F)>0$일 때 $P(E_i\mid F)=\dfrac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$.`,
    body: R`
$F=F\cap\Omega=\bigcup_i(F\cap E_i)$이고 $F\cap E_i$들은 서로소이므로 공리 3에서 $P(F)=\sum_iP(F\cap E_i)$. 조건부 확률의 정의 $P(F\cap E_i)=P(F\mid E_i)P(E_i)$를 넣으면 전확률 법칙입니다.

조건부 확률의 정의를 두 방향으로 쓰면 $P(E_i\cap F)=P(E_i\mid F)P(F)=P(F\mid E_i)P(E_i)$. $P(F)$로 나누고 분모에 전확률 법칙을 쓰면 베이즈 정리입니다.`,
    note: R`수업의 기침-감기 예제: $P(Y{=}1\mid X{=}1)=\frac{0.8\cdot0.1}{0.8\cdot0.1+0.2\cdot0.9}=\frac{0.08}{0.26}\approx0.308$.` },
  { ch: 'ch02', id: 'bernmle', title: '베르누이 분포의 최대가능도 추정', keys: ['베르누이 MLE'], src: '강의 필기 · W2 월',
    tags: 'maximum likelihood Bernoulli MLE log likelihood 최대가능도 베르누이 로그가능도',
    stmt: R`$x_1,\dots,x_n\in\{0,1\}$이 i.i.d. $\operatorname{Bern}(\theta)$에서 나왔고 $S=\sum_ix_i$이면 $\hat\theta_{\text{MLE}}=S/n$.`,
    body: R`
**가능도.** $p(x\mid\theta)=\theta^x(1-\theta)^{1-x}$ ($x=1$이면 $\theta$, $x=0$이면 $1-\theta$)이므로 독립성에서
$$L(\theta)=P\{X_1=x_1,\dots,X_n=x_n\mid\theta\}=\prod_{i=1}^n\theta^{x_i}(1-\theta)^{1-x_i}=\theta^{S}(1-\theta)^{n-S}.$$

**$0<S<n$.** $0<\theta<1$에서 $\ell(\theta)=\log L=S\log\theta+(n-S)\log(1-\theta)$.
$$\ell'(\theta)=\frac S\theta-\frac{n-S}{1-\theta}=0\iff S(1-\theta)=(n-S)\theta\iff S=n\theta.$$
$\ell''(\theta)=-\dfrac S{\theta^2}-\dfrac{n-S}{(1-\theta)^2}<0$이므로 $\ell$은 순오목이고, 정류점 $\theta=S/n$이 유일한 최대점입니다. 경계에서는 $\theta\to0^+$ 또는 $1^-$일 때 $\ell\to-\infty$이므로 최대점이 내부에 있습니다.

**$S=0$ 또는 $S=n$.** $L=(1-\theta)^n$은 감소, $L=\theta^n$은 증가하므로 최대점은 각각 $0$, $1$이고 역시 $S/n$입니다.`,
    note: R`이 추정량은 불편입니다: $E[S/n]=\theta$. 하지만 $n$이 작으면 0이나 1 같은 극단값이 나오기 쉬워, 사전분포를 쓰는 MAP·베이즈 추정이 필요합니다.` },
  { ch: 'ch02', id: 'betapost', title: '베르누이 가능도와 베타 사후분포', keys: ['베타 사후분포'], src: '강의 필기 · W2 월',
    tags: 'Beta posterior conjugate prior uniform Bayesian 베타 사후분포 켤레 균등 사전분포',
    stmt: R`베르누이 자료에서 $S$번 성공, $n-S$번 실패이고 사전분포가 $\operatorname{Beta}(a,b)$이면 사후분포는 $\operatorname{Beta}(a+S,\,b+n-S)$. 특히 균등 사전분포($a=b=1$)이면 $\operatorname{Beta}(S+1,n-S+1)$:
$$p(\theta\mid D)=\frac{\Gamma(n+2)}{\Gamma(S+1)\Gamma(n-S+1)}\theta^S(1-\theta)^{n-S}.$$`,
    body: R`
베이즈 정리 $p(\theta\mid D)=\dfrac{p(D\mid\theta)p(\theta)}{\int_0^1p(D\mid t)p(t)\,dt}$에서 분자는
$$p(D\mid\theta)p(\theta)=\theta^S(1-\theta)^{n-S}\cdot\frac{\theta^{a-1}(1-\theta)^{b-1}}{B(a,b)}=\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a,b)}.$$
분모는 같은 식을 $[0,1]$에서 적분한 것이고, 베타함수의 정의 $B(\alpha,\beta)=\int_0^1t^{\alpha-1}(1-t)^{\beta-1}dt$에서
$$\int_0^1p(D\mid t)p(t)\,dt=\frac{B(a+S,\,b+n-S)}{B(a,b)}.$$
나누면 $B(a,b)$가 약분되어
$$p(\theta\mid D)=\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a+S,\,b+n-S)}=\operatorname{Beta}(\theta\mid a+S,\,b+n-S).$$
균등 사전분포 $p(\theta)=1$ ($=\operatorname{Beta}(1,1)$, $B(1,1)=1$)이면 필기와 같이 $Z=B(S+1,n-S+1)=\dfrac{\Gamma(S+1)\Gamma(n-S+1)}{\Gamma(n+2)}$이고 결과가 나옵니다.`,
    note: R`$B(\alpha,\beta)=\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}$는 정리로 받아들입니다(감마함수의 곱을 이중적분으로 쓰고 변수를 바꾸어 증명). 정수에서는 $\Gamma(m)=(m-1)!$이라 $B(S+1,n-S+1)=\frac{S!(n-S)!}{(n+1)!}$입니다.` },
  { ch: 'ch02', id: 'mapl2', title: 'MAP은 가능도와 규제의 합을 최소화한다', keys: ['MAP 추정'], src: '강의 필기 · W2 월',
    tags: 'MAP maximum a posteriori regularization Gaussian prior L2 ridge 사후 최빈값 규제 가우시안 사전분포',
    stmt: R`$\hat\theta_{\text{MAP}}=\argmin_\theta\big[-\log p(x\mid\theta)-\log p(\theta)\big]$. 사전분포가 $\N(0,\tau^2I_d)$이면 규제항은 $\frac1{2\tau^2}\lVert\theta\rVert_2^2$(+상수)이다.`,
    body: R`
**1. 증거 제거.** 베이즈 정리 $p(\theta\mid x)=\dfrac{p(x\mid\theta)p(\theta)}{p(x)}$ (필기: $p(\theta,x)=p(x\mid\theta)p(\theta)$이므로 $p(\theta\mid x)=p(\theta,x)/p(x)$). $p(x)>0$은 $\theta$와 무관한 양수이므로 $\argmax_\theta p(\theta\mid x)=\argmax_\theta p(x\mid\theta)p(\theta)$.

**2. 단조변환.** 순증가함수 $g$에 대해 $\argmax_\theta h(\theta)=\argmax_\theta g(h(\theta))$입니다. $h(\theta_1)<h(\theta_2)\iff g(h(\theta_1))<g(h(\theta_2))$이기 때문입니다(필기의 예: $2x+5$). $g=\log$를 쓰면
$$\hat\theta_{\text{MAP}}=\argmax_\theta\big[\log p(x\mid\theta)+\log p(\theta)\big]=\argmin_\theta\big[-\log p(x\mid\theta)-\log p(\theta)\big].$$
첫 항이 자료 적합 손실(음의 로그가능도), 둘째 항이 규제입니다.

**3. 가우시안 사전분포.** $p(\theta)=(2\pi\tau^2)^{-d/2}\exp\big(-\lVert\theta\rVert_2^2/(2\tau^2)\big)$이므로
$$-\log p(\theta)=\frac1{2\tau^2}\lVert\theta\rVert_2^2+\frac d2\log(2\pi\tau^2).$$
둘째 항은 $\theta$와 무관한 상수라 최적화에서 빠지고, $L_2$ 규제 $\frac1{2\tau^2}\lVert\theta\rVert_2^2$만 남습니다.`,
    note: R`MLE는 $-\log p(\theta)$가 상수인 경우(균등 사전분포)의 MAP입니다. 라플라스 사전분포 $p(\theta_j)\propto e^{-\lvert\theta_j\rvert/b}$를 쓰면 $L_1$ 규제(라쏘)가 됩니다.` },
  { ch: 'ch02', id: 'betamode', title: '베타분포의 최빈값과 동전 예제의 MAP', keys: ['MAP 추정'], src: '강의 필기 · W2 월',
    tags: 'Beta mode MAP coin example 베타 최빈값 동전',
    stmt: R`$a,b>1$이면 $\operatorname{Beta}(a,b)$의 최빈값은 $\frac{a-1}{a+b-2}$이다. 따라서 사전분포 $\operatorname{Beta}(a,b)$와 $n$번 중 $S$번 성공에서 $\hat\theta_{\text{MAP}}=\frac{S+a-1}{n+a+b-2}$. 동전 10번 중 앞면 7번, 사전분포 $\operatorname{Beta}(2,2)$이면 $\hat\theta_{\text{MAP}}=\frac23$.`,
    body: R`
$g(\theta)=(a-1)\log\theta+(b-1)\log(1-\theta)$ (로그밀도에서 상수 제외)를 $0<\theta<1$에서 최대로 합니다.
$$g'(\theta)=\frac{a-1}\theta-\frac{b-1}{1-\theta}=0\iff(a-1)(1-\theta)=(b-1)\theta\iff\theta=\frac{a-1}{a+b-2}.$$
$a,b>1$이면 $g''=-\frac{a-1}{\theta^2}-\frac{b-1}{(1-\theta)^2}<0$이라 최대입니다.

사후분포가 $\operatorname{Beta}(a+S,b+n-S)$이므로 그 최빈값은 $\frac{S+a-1}{n+a+b-2}$.
필기의 예: $P(\theta\mid D)\propto\theta^7(1-\theta)^3\cdot\theta^{1}(1-\theta)^{1}=\theta^8(1-\theta)^4$, 즉 $\operatorname{Beta}(9,5)$이고 최빈값 $\frac{8}{12}=\frac23\approx0.667$. MLE $0.7$보다 사전분포의 중심 $0.5$ 쪽으로 당겨집니다.` },

  // ───── 03
  { ch: 'ch03', id: 'infoadd', title: '독립 사건의 정보량은 더해진다', keys: ['엔트로피'], src: '강의 필기 · W2 월',
    tags: 'information content additivity independence 정보량 가법성 독립',
    stmt: R`$h(x)=-\log p(x)$로 정의하면 $X,Y$가 독립일 때 $h_{X,Y}(x,y)=h_X(x)+h_Y(y)$.`,
    body: R`
독립이면 $p_{X,Y}(x,y)=p_X(x)p_Y(y)$이고 $\log$는 곱을 합으로 바꾸므로
$$h_X(x)+h_Y(y)=-\log p_X(x)-\log p_Y(y)=-\log\big(p_X(x)p_Y(y)\big)=-\log p_{X,Y}(x,y)=h_{X,Y}(x,y).$$`,
    note: R`거꾸로, $(0,1]$에서 연속이고 감소하며 $h(pq)=h(p)+h(q)$를 만족하는 함수는 $h(p)=-c\log p$ ($c>0$) 꼴뿐입니다(코시 함수방정식). 그래서 정보량의 정의에 로그가 들어갑니다.` },
  { ch: 'ch03', id: 'entropybound', title: '엔트로피의 범위: 0 ≤ H(X) ≤ log K', keys: ['엔트로피'],
    tags: 'entropy nonnegative maximum uniform bound 엔트로피 최대 균등분포',
    stmt: R`값이 $K$개인 이산 확률변수에 대해 $0\le H(X)\le\log K$. 왼쪽 등호는 한 값의 확률이 1일 때, 오른쪽 등호는 균등분포일 때 성립한다.`,
    body: R`
**하한.** $0<p(x)\le1$이면 $-\log p(x)\ge0$이므로 $H=\sum p(x)(-\log p(x))\ge0$. 등호는 모든 항이 0, 즉 $p(x)>0$인 $x$에서 $p(x)=1$일 때입니다.

**상한.** $u(x)=1/K$ (균등분포)로 두고 Theorem 1을 씁니다.
$$0\le\KL(p\Vert u)=\sum_xp(x)\log\frac{p(x)}{1/K}=\sum_xp(x)\log p(x)+\log K=-H(X)+\log K.$$
따라서 $H(X)\le\log K$이고 등호는 $p=u$일 때뿐입니다.` },
  { ch: 'ch03', id: 'chain', title: '엔트로피의 연쇄법칙', keys: ['엔트로피 연쇄법칙'], src: '강의 필기 · W2 월',
    tags: 'chain rule joint entropy conditional entropy 연쇄법칙 결합 엔트로피 조건부 엔트로피',
    stmt: R`$H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$.`,
    body: R`
$p(x,y)=p(y\mid x)p(x)$ ($p(x)>0$인 곳)이므로 $\log p(x,y)=\log p(y\mid x)+\log p(x)$. 기댓값의 선형성으로
$$H(X,Y)=-\E_{X,Y}[\log p(Y\mid X)p(X)]=-\E_{X,Y}[\log p(Y\mid X)]-\E_{X,Y}[\log p(X)].$$
첫 항은 정의에 의해 $H(Y\mid X)$. 둘째 항은 $X$만의 함수이므로 $\sum_{x,y}p(x,y)\log p(x)=\sum_x\big(\sum_yp(x,y)\big)\log p(x)=\sum_xp(x)\log p(x)$, 즉 $-\E_{X,Y}[\log p(X)]=H(X)$. 역할을 바꾸면 둘째 등식입니다.`,
    note: R`$n$개로 일반화하면 $H(X_1,\dots,X_n)=\sum_{i=1}^nH(X_i\mid X_1,\dots,X_{i-1})$.` },
  { ch: 'ch03', id: 'jensen', title: '젠센 부등식', keys: ['젠센 부등식'],
    tags: 'Jensen inequality convex concave expectation 젠센 볼록 오목 기댓값',
    stmt: R`$\varphi$가 볼록함수이고 $X$가 (기댓값이 있는) 확률변수이면 $\varphi(\E[X])\le\E[\varphi(X)]$. $\varphi$가 순볼록이면 등호는 $X$가 확률 1로 상수일 때뿐이다.`,
    body: R`
$\mu=\E[X]$라 합시다. 볼록함수는 모든 점에서 **받침선**을 가집니다: 어떤 기울기 $c$가 있어 모든 $t$에 대해
$$\varphi(t)\ge\varphi(\mu)+c(t-\mu).$$
(미분가능하면 $c=\varphi'(\mu)$이고, 이 부등식은 “볼록함수의 그래프는 접선 위에 있다”는 뜻입니다.) $t=X$를 넣고 기댓값을 취하면
$$\E[\varphi(X)]\ge\varphi(\mu)+c(\E[X]-\mu)=\varphi(\mu).$$

**등호.** $\varphi$가 순볼록이면 받침선 부등식은 $t\ne\mu$에서 순부등식입니다. $\E[\varphi(X)-\varphi(\mu)-c(X-\mu)]=0$이고 괄호 안이 $\ge0$이므로 확률 1로 0, 즉 $X=\mu$ (확률 1).`,
    note: R`유한 확률분포에서는 $\varphi\big(\sum_i\lambda_ix_i\big)\le\sum_i\lambda_i\varphi(x_i)$ ($\lambda_i\ge0$, $\sum\lambda_i=1$)이고, 볼록성의 정의 $\varphi(\lambda a+(1-\lambda)b)\le\lambda\varphi(a)+(1-\lambda)\varphi(b)$에서 귀납법으로도 증명됩니다. $\log$는 오목이라 $\E[\log X]\le\log\E[X]$.` },
  { ch: 'ch03', id: 'klnonneg', title: 'KL 발산은 음이 아니다 (Theorem 1)', keys: ['KL 발산의 비음성 (Theorem 1)'], src: '강의 필기 · W2 월',
    tags: 'KL divergence nonnegative Gibbs inequality Jensen theorem 1 비음성 깁스 부등식',
    stmt: R`이산분포 $p,q$에 대해 $\KL(p\Vert q)\ge0$이고, 등호는 모든 $x$에서 $p(x)=q(x)$일 때뿐이다.`,
    body: R`
$E=\{x:p(x)>0\}$로 두면 $p(x)=0$인 항은 약속에 의해 0이라
$$\KL(p\Vert q)=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}.$$
어떤 $x\in E$에서 $q(x)=0$이면 $\KL=+\infty>0$이므로, 이제 $E$에서 $q>0$이라 합시다.

**부등식.** $\{p(x)\}_{x\in E}$는 확률분포이고 $Z=q(X)/p(X)$는 $E$ 위의 양의 확률변수입니다. $-\log$는 순볼록이므로 젠센 부등식에서
$$\begin{aligned}\KL(p\Vert q)&=\sum_{x\in E}p(x)\Big[-\log\frac{q(x)}{p(x)}\Big]\ \ge\ -\log\Big(\sum_{x\in E}p(x)\frac{q(x)}{p(x)}\Big)\\&=-\log\sum_{x\in E}q(x)\ \ge\ -\log1=0.\end{aligned}$$
마지막 부등식은 $\sum_{x\in E}q(x)\le\sum_xq(x)=1$과 $-\log$의 감소성에서 나옵니다.

**등호.** 두 부등식이 모두 등호여야 합니다. 첫째는 순볼록성에서 $q(x)/p(x)=c$ (상수, $x\in E$), 둘째는 $\sum_{x\in E}q(x)=1$. 그러면
$$1=\sum_{x\in E}q(x)=c\sum_{x\in E}p(x)=c$$
이므로 $E$에서 $q=p$이고, $E$ 밖에서는 $\sum_{x\notin E}q(x)=1-1=0$이라 $q=0=p$. 역으로 $p=q$이면 모든 항이 $\log1=0$입니다.`,
    note: R`필기에서는 “$q(x)/p(x)=c$ for all $x$, hence $1=\sum q=c\sum p=c$”로 한 줄에 썼습니다. 엄밀하게는 합을 $E$ 위에서만 취한다는 점과, 등호 조건에 $\sum_Eq=1$도 필요하다는 점을 챙기면 됩니다. 연속분포에서도 합을 적분으로 바꾸면 같은 증명입니다.` },
  { ch: 'ch03', id: 'mi', title: '상호정보량과 엔트로피의 관계', keys: ['상호정보량'], src: '강의 필기 · W2 수',
    tags: 'mutual information entropy conditional KL Venn 상호정보량 조건부 엔트로피 벤 다이어그램',
    stmt: R`$I(X;Y)=\KL(p(x,y)\Vert p(x)p(y))=H(Y)-H(Y\mid X)=H(X)-H(X\mid Y)=H(X)+H(Y)-H(X,Y)$.`,
    body: R`
$p(x,y)>0$인 곳에서 $p(x,y)=p(y\mid x)p(x)$이므로 $\dfrac{p(x,y)}{p(x)p(y)}=\dfrac{p(y\mid x)}{p(y)}$.
$$I(X;Y)=\sum_{x,y}p(x,y)\log\frac{p(y\mid x)}{p(y)}=\E_{X,Y}\big[\log p(Y\mid X)\big]-\E_{X,Y}\big[\log p(Y)\big].$$
첫 항은 $-H(Y\mid X)$. 둘째 항은 주변화 $\sum_xp(x,y)=p(y)$로 $\sum_yp(y)\log p(y)=-H(Y)$. 따라서 $I(X;Y)=H(Y)-H(Y\mid X)$.

$p(x,y)=p(x\mid y)p(y)$로 같은 계산을 하면 $I=H(X)-H(X\mid Y)$. 연쇄법칙 $H(X\mid Y)=H(X,Y)-H(Y)$를 넣으면 $I=H(X)+H(Y)-H(X,Y)$.`,
    note: R`$I$는 KL이므로 Theorem 1에서 $I(X;Y)\ge0$, 등호는 $p(x,y)=p(x)p(y)$ 즉 독립일 때뿐입니다. 따라서 $H(X\mid Y)\le H(X)$: 조건을 걸면 엔트로피는 (평균적으로) 줄어듭니다.` },
  { ch: 'ch03', id: 'crossent', title: '교차 엔트로피 = 엔트로피 + KL', keys: ['교차 엔트로피'], src: '강의 필기 · W2 수',
    tags: 'cross entropy Gibbs inequality KL classification loss 교차 엔트로피 깁스 분류 손실',
    stmt: R`$H_p(q)=-\E_p[\log q(X)]$라 하면 $H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$이고, 등호는 $p=q$일 때뿐이다.`,
    body: R`
$E=\{x:p(x)>0\}$에서
$$\KL(p\Vert q)=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}=-\sum_{x\in E}p(x)\log q(x)-\sum_{x\in E}p(x)\log\frac1{p(x)}=H_p(q)-H(p).$$
(필기: $\KL=-\sum p\log\frac qp=-\sum p\log q-\sum p\log\frac1p$.) Theorem 1에서 $\KL\ge0$이므로 $H_p(q)\ge H(p)$, 등호는 $p=q$.`,
    note: R`분류에서 $p$가 원-핫 레이블이면 $H(p)=0$이고 $H_p(q)=-\log q(\text{정답 클래스})$. 로지스틱·소프트맥스 회귀의 음의 로그가능도는 표본마다의 교차 엔트로피를 더한 것입니다.` },

  // ───── 04
  { ch: 'ch04', id: 'lsemle', title: '가우시안 잡음에서 최소제곱은 최대가능도', keys: ['최소제곱 = 가우시안 MLE'],
    tags: 'least squares maximum likelihood Gaussian noise LSE MLE 최소제곱 최대가능도 가우시안 잡음',
    stmt: R`$y_i=h_i(\beta)+\varepsilon_i$, $\varepsilon_i\overset{iid}{\sim}\N(0,\sigma^2)$이면 $\beta$의 MLE는 $\sum_i(y_i-h_i(\beta))^2$의 최소점이고, $\sigma^2$의 MLE는 $\frac1n\sum_i(y_i-h_i(\hat\beta))^2$이다.`,
    body: R`
독립성에서 로그가능도는 각 항의 로그밀도의 합입니다.
$$\ell(\beta,\sigma)=\sum_{i=1}^n\log\Big[\frac1{\sqrt{2\pi}\sigma}e^{-(y_i-h_i(\beta))^2/(2\sigma^2)}\Big]=-n\log(\sqrt{2\pi}\sigma)-\frac1{2\sigma^2}\sum_{i=1}^n(y_i-h_i(\beta))^2.$$
**$\beta$에 대해.** 첫 항은 $\beta$와 무관하고 둘째 항의 계수 $-\frac1{2\sigma^2}<0$이므로, $\ell$을 최대로 하는 것은 $f(\beta)=\sum(y_i-h_i(\beta))^2$을 최소로 하는 것과 같습니다. 이 결론은 $\sigma$의 값과 무관합니다.

**$\sigma^2$에 대해.** $v=\sigma^2$로 두면 $\ell=-\frac n2\log(2\pi v)-\frac{f(\hat\beta)}{2v}$, $\dfrac{\partial\ell}{\partial v}=-\dfrac n{2v}+\dfrac{f(\hat\beta)}{2v^2}=0$에서 $\hat v=f(\hat\beta)/n$. $v\to0^+$이나 $v\to\infty$에서 $\ell\to-\infty$ ($f(\hat\beta)>0$일 때)이므로 최대입니다.` },
  { ch: 'ch04', id: 'ridge', title: '릿지 회귀의 해', keys: ['릿지 회귀의 해'], src: '강의 필기 · W2 수',
    tags: 'ridge regression L2 regularization weight decay closed form 릿지 규제 해',
    stmt: R`$\lambda>0$이면 $J(\beta)=\frac12\lVert y-X\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$의 유일한 최소점은 $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$이다.`,
    body: R`
전개하면 $J=\frac12\big(y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta\big)+\frac\lambda2\beta^T\beta$. 벡터 미분 공식으로
$$\nabla J=-X^Ty+X^TX\beta+\lambda\beta=(\lambda I+X^TX)\beta-X^Ty.$$
**가역성.** $v\ne0$이면 $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$이므로 $\lambda I+X^TX$는 양의 정부호이고 가역입니다. 따라서 $\nabla J=0$의 해는 $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$ 하나.

**최소.** $J(\hat\beta+v)=J(\hat\beta)+\nabla J(\hat\beta)^Tv+\frac12v^T(\lambda I+X^TX)v=J(\hat\beta)+\frac12\big(\lambda\lVert v\rVert^2+\lVert Xv\rVert^2\big)>J(\hat\beta)$ ($v\ne0$). 유일한 전역 최소점입니다.`,
    note: R`$X$의 특잇값분해 $X=U\Sigma V^T$로 쓰면 $\hat\beta=\sum_j\frac{\sigma_j}{\sigma_j^2+\lambda}(u_j^Ty)v_j$. 작은 특잇값 방향의 계수가 크게 줄어듭니다($\lambda=0$이면 $1/\sigma_j$로 폭발). 이것이 “계수 축소”의 정체입니다.` },
  { ch: 'ch04', id: 'pushthrough', title: '푸시스루 항등식', keys: ['푸시스루 항등식'], src: '강의 필기 · W2 수',
    tags: 'push-through identity matrix inverse kernel 푸시스루 항등식 역행렬',
    stmt: R`$\varphi\in\mathbb R^{d\times n}$, $\lambda>0$이면 $(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$.`,
    body: R`
**1. 두 행렬은 가역.** $v\in\mathbb R^d\setminus\{0\}$에 대해 $v^T(\lambda I_d+\varphi\varphi^T)v=\lambda\lVert v\rVert^2+\lVert\varphi^Tv\rVert^2>0$. 같은 방법으로 $u\in\mathbb R^n\setminus\{0\}$에 대해 $u^T(\lambda I_n+\varphi^T\varphi)u=\lambda\lVert u\rVert^2+\lVert\varphi u\rVert^2>0$. 양의 정부호 행렬은 가역입니다.

**2. 교환 관계.** 분배법칙으로
$$(\lambda I_d+\varphi\varphi^T)\varphi=\lambda\varphi+\varphi\varphi^T\varphi=\varphi(\lambda I_n+\varphi^T\varphi).$$

**3. 역행렬 곱하기.** 양변의 왼쪽에 $(\lambda I_d+\varphi\varphi^T)^{-1}$, 오른쪽에 $(\lambda I_n+\varphi^T\varphi)^{-1}$을 곱하면
$$\varphi(\lambda I_n+\varphi^T\varphi)^{-1}=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi.$$`,
    note: R`필기에서는 $A:=\lambda I+\varphi\varphi^T$로 두고 “$A\varphi=\varphi A\Rightarrow A^{-1}\varphi=\varphi A^{-1}$”처럼 썼는데, 양쪽의 $A$는 크기가 다른 두 행렬($d\times d$와 $n\times n$)이라는 점이 핵심입니다. 그래서 왼쪽과 오른쪽에 **서로 다른** 역행렬을 곱합니다. 크기를 적어 두면 헷갈리지 않습니다.` },
  { ch: 'ch04', id: 'kernelridge', title: '커널 릿지 회귀의 예측식', keys: ['커널 릿지 회귀'], src: '강의 필기 · W2 수',
    tags: 'kernel ridge regression Gram matrix representer alpha 커널 릿지 그람 행렬',
    stmt: R`특성공간의 릿지 문제 $J(\beta)=\frac12\lVert y-\varphi(X)^T\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$의 해로 만든 예측은
$$f^*(x)=K(x,X)\big(\lambda I+K(X,X)\big)^{-1}y,$$
$K(x,X)=\varphi(x)^T\varphi(X)$, $K(X,X)=\varphi(X)^T\varphi(X)$이다. $\beta=\varphi(X)\alpha$로 두고 풀어도 $\alpha^*=(K+\lambda I)^{-1}y$로 같은 예측을 얻는다.`,
    body: R`
$\varphi=\varphi(X)$로 줄여 씁니다.

**유도 1 (푸시스루).** $J=\frac12(y-\varphi^T\beta)^T(y-\varphi^T\beta)+\frac\lambda2\beta^T\beta$. 벡터 미분 공식에서 ($X$ 자리에 $\varphi^T$)
$$\nabla_\beta J=-\varphi y+\varphi\varphi^T\beta+\lambda\beta=0\ \Rightarrow\ \beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y.$$
마지막 등호가 푸시스루 항등식입니다. 따라서 $f^*(x)=\varphi(x)^T\beta^*=\varphi(x)^T\varphi\,(\lambda I+\varphi^T\varphi)^{-1}y=K(x,X)(\lambda I+K)^{-1}y$.

**유도 2 ($\alpha$ 치환, 필기).** $\beta=\varphi\alpha$이면 $\varphi^T\beta=K\alpha$, $\beta^T\beta=\alpha^TK\alpha$이고 $K$는 대칭이므로
$$J(\alpha)=\tfrac12\big(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha,\qquad \nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big).$$
$\alpha^*=(K+\lambda I)^{-1}y$이면 괄호가 0이라 $\nabla_\alpha J=0$. 그러면 $\beta^*=\varphi\alpha^*$로 유도 1의 해와 같고, $f^*(x)=\varphi(x)^T\varphi\alpha^*=K(x,X)\alpha^*=\sum_{i=1}^n\alpha_i^*K(x,x_i)$.`,
    note: R`유도 2에서 $\beta$를 $\varphi(X)$의 열공간으로 제한해도 손해가 없는 이유: 임의의 $\beta=\varphi\alpha+\beta_\perp$ ($\varphi^T\beta_\perp=0$)이면 오차항은 $\beta_\perp$와 무관하고 $\lVert\beta\rVert^2=\lVert\varphi\alpha\rVert^2+\lVert\beta_\perp\rVert^2$이라 $\beta_\perp=0$일 때 $J$가 더 작습니다. 이것이 표현자 정리(representer theorem)의 가장 간단한 경우입니다.` },
  { ch: 'ch04', id: 'kernelex', title: '다항 커널의 특성사상과 그람 행렬의 준정부호성', keys: ['커널의 예'],
    tags: 'polynomial kernel feature map Gram matrix positive semidefinite 다항 커널 특성사상 그람 양의 준정부호',
    stmt: R`$x,z\in\mathbb R^2$에서 $(x^Tz)^2=\varphi(x)^T\varphi(z)$, $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$. 또 어떤 커널 $K(x,z)=\varphi(x)^T\varphi(z)$의 그람 행렬도 양의 준정부호이다.`,
    body: R`
**다항 커널.** $(x^Tz)^2=(x_1z_1+x_2z_2)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2=(x_1^2)(z_1^2)+(x_2^2)(z_2^2)+(\sqrt2x_1x_2)(\sqrt2z_1z_2)=\varphi(x)^T\varphi(z)$.

**그람 행렬.** $K_{ij}=\varphi(x_i)^T\varphi(x_j)$이면 $K=\Phi^T\Phi$ ($\Phi=[\varphi(x_1)\cdots\varphi(x_n)]$). 임의의 $c\in\mathbb R^n$에 대해
$$c^TKc=\sum_{i,j}c_ic_j\varphi(x_i)^T\varphi(x_j)=\Big\lVert\sum_ic_i\varphi(x_i)\Big\rVert^2\ge0.$$
따라서 $\lambda>0$이면 $K+\lambda I\succ0$이고 커널 릿지의 역행렬이 항상 존재합니다.`,
    note: R`가우시안 커널은 무한차원 특성사상에 대응합니다($e^{-\lVert x-z\rVert^2/2\sigma^2}=e^{-\lVert x\rVert^2/2\sigma^2}e^{-\lVert z\rVert^2/2\sigma^2}e^{x^Tz/\sigma^2}$에서 마지막 인수를 테일러 전개). 그래서 특성을 직접 계산하지 않는 커널 트릭이 필요합니다.` },
  );
})();
