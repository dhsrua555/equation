/* 증명 — Part A·B: 02 곡선 적합, 03 확률 규칙, 04 가우시안, 05 정보이론, 06 베이지안
   src가 있는 항목은 Bishop 교재의 연습문제에 해당하는 유도입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 02 곡선 적합
  { ch: 'ch02', id: 'poly-normal', title: '다항식 최소제곱의 정규방정식', keys: ['다항식 모델과 제곱오차합'],
    tags: 'polynomial least squares normal equation sum of squares 다항식 제곱오차 정규방정식',
    stmt: R`$E(\mathbf w)=\frac12\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}^2$, $y(x,\mathbf w)=\sum_{j=0}^Mw_jx^j$을 최소화하는 계수는 연립일차방정식 $\sum_{j=0}^MA_{ij}w_j=T_i$ ($i=0,\dots,M$)의 해이다. 여기서 $A_{ij}=\sum_nx_n^{i+j}$, $T_i=\sum_nx_n^it_n$.`,
    body: R`
$y(x_n,\mathbf w)$는 $\mathbf w$에 대해 **선형**이고 $\partial y(x_n,\mathbf w)/\partial w_i=x_n^i$입니다. 연쇄법칙으로
$$\frac{\partial E}{\partial w_i}=\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}x_n^i=\sum_{n=1}^N\Big(\sum_{j=0}^Mw_jx_n^j-t_n\Big)x_n^i=\sum_{j=0}^M\Big(\sum_nx_n^{i+j}\Big)w_j-\sum_nx_n^it_n.$$
이를 0으로 두면 $\sum_jA_{ij}w_j=T_i$.

**최솟점임.** 설계행렬 $\Phi_{nj}=x_n^j$로 쓰면 $E=\frac12\lVert\Phi\mathbf w-\mathbf t\rVert^2$, $A=\Phi^T\Phi$, $\mathbf T=\Phi^T\mathbf t$입니다. 헤시안 $\nabla\nabla E=\Phi^T\Phi$는 $\mathbf v^T\Phi^T\Phi\mathbf v=\lVert\Phi\mathbf v\rVert^2\ge0$이라 양의 준정부호이므로 $E$는 볼록이고, 정류점은 전역 최솟점입니다. 서로 다른 $x_n$이 $M+1$개 이상이면 $\Phi$의 열이 일차독립(방데르몽드)이라 해가 유일합니다.`,
    note: R`$E$가 $\mathbf w$의 이차식이라 도함수가 선형이 되고, 그래서 닫힌 형태의 해 $\mathbf w^\star$가 하나 존재합니다. 신경망은 $\mathbf w$에 대해 비선형이라 이런 닫힌 해가 없고 경사하강법이 필요합니다.` },
  { ch: 'ch02', id: 'rms', title: 'RMS 오차와 제곱오차합의 관계', keys: ['RMS 오차'],
    tags: 'RMS root mean square error 평균제곱근 오차',
    stmt: R`$E_{\text{RMS}}=\sqrt{2E(\mathbf w^\star)/N}$이고, $E_{\text{RMS}}$는 $N$과 목표값의 단위에 대해 공정한 척도이다: 모든 잔차가 크기 $r$이면 $E_{\text{RMS}}=r$.`,
    body: R`
정의에서 $\sum_n\{y(x_n,\mathbf w^\star)-t_n\}^2=2E(\mathbf w^\star)$이므로
$$E_{\text{RMS}}=\sqrt{\frac1N\cdot2E(\mathbf w^\star)}.$$
모든 $n$에서 $\lvert y(x_n,\mathbf w^\star)-t_n\rvert=r$이면 $\frac1N\sum r^2=r^2$이므로 $E_{\text{RMS}}=r$ — 목표값 $t$와 같은 단위의 “전형적인 잔차 크기”입니다. $E$ 자체는 $N$에 비례해 커지므로, 자료 수가 다른 훈련·시험 집합을 비교할 때는 $N$으로 나눈 $E_{\text{RMS}}$를 씁니다.` },
  { ch: 'ch02', id: 'poly-ridge', title: 'L2 규제된 다항식의 해', keys: ['L2 규제된 오차함수'],
    tags: 'ridge regularization weight decay shrinkage L2 규제 릿지',
    stmt: R`$\tilde E(\mathbf w)=\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2+\frac\lambda2\lVert\mathbf w\rVert^2$의 최솟점은 $\sum_j(A_{ij}+\lambda I_{ij})w_j=T_i$, 즉 $(\Phi^T\Phi+\lambda\mathbf I)\mathbf w=\Phi^T\mathbf t$를 만족하며, $\lambda>0$이면 항상 유일하다.`,
    body: R`
$\frac{\partial}{\partial w_i}\frac\lambda2\sum_jw_j^2=\lambda w_i$이므로 앞의 정규방정식에 $\lambda w_i$가 더해집니다:
$$\frac{\partial\tilde E}{\partial w_i}=\sum_jA_{ij}w_j-T_i+\lambda w_i=0\iff\sum_j(A_{ij}+\lambda I_{ij})w_j=T_i.$$
**유일성.** $\lambda>0$이면 $\mathbf v\ne\mathbf 0$에 대해 $\mathbf v^T(\Phi^T\Phi+\lambda\mathbf I)\mathbf v=\lVert\Phi\mathbf v\rVert^2+\lambda\lVert\mathbf v\rVert^2>0$이므로 행렬이 양의 정부호 → 가역이고, $\tilde E$는 강볼록이라 최솟점이 하나뿐입니다. 자료가 적어 $\Phi^T\Phi$가 특이행렬이어도($N<M+1$) 해가 존재합니다.`,
    note: R`계수가 크게 진동하는 과적합 해($M=9$)를 규제가 억누르는 이유가 여기 있습니다. 확률적으로는 가우시안 사전분포의 MAP 추정과 같습니다(6단원).` },

  // ───── 03 확률 규칙
  { ch: 'ch03', id: 'sum-product', title: '빈도로부터 합의 규칙과 곱의 규칙', keys: ['합의 규칙과 곱의 규칙'],
    tags: 'sum rule product rule marginal joint conditional 합의 규칙 곱의 규칙 주변화',
    stmt: R`$N$번 시행에서 $X=x_i,\ Y=y_j$인 횟수를 $n_{ij}$, $X=x_i$인 횟수를 $c_i$라 하고 확률을 상대빈도($N\to\infty$)로 정의하면 $p(X=x_i)=\sum_jp(X=x_i,Y=y_j)$, $p(X=x_i,Y=y_j)=p(Y=y_j\mid X=x_i)p(X=x_i)$.`,
    body: R`
정의에 따라
$$p(X=x_i,Y=y_j)=\frac{n_{ij}}N,\qquad p(X=x_i)=\frac{c_i}N,\qquad p(Y=y_j\mid X=x_i)=\frac{n_{ij}}{c_i}.$$
**합의 규칙.** $X=x_i$인 시행은 $Y$의 값에 따라 겹치지 않게 나뉘므로 $c_i=\sum_jn_{ij}$. 양변을 $N$으로 나누면 $p(X=x_i)=\sum_jp(X=x_i,Y=y_j)$.

**곱의 규칙.**
$$p(X=x_i,Y=y_j)=\frac{n_{ij}}N=\frac{n_{ij}}{c_i}\cdot\frac{c_i}N=p(Y=y_j\mid X=x_i)\,p(X=x_i).$$
**독립.** $p(Y\mid X)=p(Y)$이면 곱의 규칙이 $p(X,Y)=p(X)p(Y)$가 됩니다. 역으로 $p(X,Y)=p(X)p(Y)$이면 $p(Y\mid X)=p(X,Y)/p(X)=p(Y)$.`,
    note: R`빈도 해석은 직관을 주는 도구일 뿐이고, 두 규칙은 불확실성을 일관되게 다루려면 반드시 따라야 하는 공리로도 유도됩니다(콕스 정리). 연속 변수에서는 합이 적분으로 바뀝니다.` },
  { ch: 'ch03', id: 'bayes', title: '베이즈 정리와 암 선별검사', keys: ['베이즈 정리'],
    tags: 'Bayes theorem posterior prior likelihood evidence screening 베이즈 사후확률 선별검사 위양성',
    stmt: R`$p(Y\mid X)=\dfrac{p(X\mid Y)p(Y)}{p(X)}$, $p(X)=\sum_Yp(X\mid Y)p(Y)$. 유병률 $1\%$, 민감도 $90\%$, 위양성률 $3\%$이면 $p(C=1\mid T=1)=90/387\approx0.23$.`,
    body: R`
곱의 규칙을 두 순서로 쓰면 $p(X,Y)=p(Y\mid X)p(X)=p(X\mid Y)p(Y)$. $p(X)>0$으로 나누면 베이즈 정리입니다. 분모는 합의 규칙과 곱의 규칙으로
$$p(X)=\sum_Yp(X,Y)=\sum_Yp(X\mid Y)p(Y),$$
즉 분자를 모든 $Y$에 대해 더한 값이라, 사후확률의 합 $\sum_Yp(Y\mid X)=1$을 보장하는 정규화 상수입니다.

**선별검사.** $p(C=1)=0.01$, $p(T=1\mid C=1)=0.9$, $p(T=1\mid C=0)=0.03$.
$$p(T=1)=0.9\times0.01+0.03\times0.99=0.009+0.0297=0.0387,$$
$$p(C=1\mid T=1)=\frac{0.009}{0.0387}=\frac{90}{387}\approx0.2326.$$
10,000명으로 세면 양성 $90+297=387$명 중 실제 환자가 90명입니다.`,
    note: R`검사가 꽤 정확해도 사전확률(유병률)이 낮으면 양성 판정의 대부분이 위양성입니다. 이를 무시하는 것을 **기저율 오류**라 합니다. 두 번째 독립 검사도 양성이면, 첫 사후확률 $0.2326$을 새 사전확률로 써서 다시 갱신합니다.` },

  // ───── 04 확률밀도와 가우시안
  { ch: 'ch04', id: 'cdf', title: '누적분포와 밀도의 관계', keys: ['확률밀도와 누적분포'],
    tags: 'probability density cumulative distribution function CDF fundamental theorem of calculus 확률밀도 누적분포',
    stmt: R`$P(z)=\int_{-\infty}^zp(x)dx$이면 $p(x\in(a,b))=P(b)-P(a)$이고, $p$가 $x$에서 연속이면 $P'(x)=p(x)$이다. 또 $p(x)$ 자체는 1보다 클 수 있다.`,
    body: R`
구간의 가법성으로 $\int_{-\infty}^bp=\int_{-\infty}^ap+\int_a^bp$이므로 $p(x\in(a,b))=\int_a^bp(x)dx=P(b)-P(a)$.

$p$가 $x$에서 연속이면 미적분의 기본정리로
$$P'(x)=\lim_{h\to0}\frac{P(x+h)-P(x)}h=\lim_{h\to0}\frac1h\int_x^{x+h}p(u)\,du=p(x).$$
(적분 평균값 정리로 $\frac1h\int_x^{x+h}p=p(\xi_h)$, $\xi_h\to x$.)

**밀도는 확률이 아니다.** 작은 구간의 확률이 $p(x\in(x,x+\delta x))\simeq p(x)\delta x$일 뿐이라, 조건은 $p\ge0$과 $\int p=1$뿐입니다. 예: $U(0,\frac12)$의 밀도는 구간에서 $2$입니다. $P$는 확률이므로 $0\le P\le1$이고 단조증가합니다.`,
    note: R`한 점의 확률은 $p(x\in[x_0,x_0])=P(x_0)-P(x_0)=0$입니다. 그래서 연속 변수에서는 “$x=x_0$일 확률”이 아니라 밀도를 비교합니다.` },
  { ch: 'ch04', id: 'var-identity', title: '분산과 공분산의 공식, 독립이면 공분산 0', keys: ['기댓값과 분산'], src: 'Bishop 연습문제 2.8, 2.9',
    tags: 'variance covariance expectation linearity independence 분산 공분산 기댓값 독립',
    stmt: R`$\Var[f]=\E[f^2]-\E[f]^2$, $\Cov[x,y]=\E[xy]-\E[x]\E[y]$. $x,y$가 독립이면 $\Cov[x,y]=0$.`,
    body: R`
기댓값은 선형이고 $\E[f]$는 상수이므로
$$\Var[f]=\E\big[f^2-2f\E[f]+\E[f]^2\big]=\E[f^2]-2\E[f]\E[f]+\E[f]^2=\E[f^2]-\E[f]^2.$$
마찬가지로
$$\Cov[x,y]=\E\big[xy-x\E[y]-\E[x]y+\E[x]\E[y]\big]=\E[xy]-\E[x]\E[y].$$
독립이면 $p(x,y)=p(x)p(y)$이므로
$$\E[xy]=\iint xy\,p(x)p(y)\,dx\,dy=\int xp(x)dx\int yp(y)dy=\E[x]\E[y],$$
따라서 $\Cov[x,y]=0$.`,
    note: R`역은 성립하지 않습니다. $x\sim\mathcal N(0,1)$, $y=x^2$이면 $\Cov[x,y]=\E[x^3]=0$이지만 $y$는 $x$의 함수로 완전히 종속입니다.` },
  { ch: 'ch04', id: 'gauss-moments', title: '가우시안의 정규화와 평균·분산', keys: ['가우시안 분포'], src: 'Bishop 연습문제 2.12',
    tags: 'Gaussian normalization integral mean variance polar coordinates 가우시안 정규화 적분 평균 분산',
    stmt: R`$\int_{-\infty}^\infty\N(x\mid\mu,\sigma^2)dx=1$, $\E[x]=\mu$, $\E[x^2]=\mu^2+\sigma^2$, $\Var[x]=\sigma^2$.`,
    body: R`
**정규화.** $I=\int_{-\infty}^\infty\exp\big(-\frac{x^2}{2\sigma^2}\big)dx$로 두고 제곱해 극좌표($x=r\cos\theta$, $y=r\sin\theta$, $dx\,dy=r\,dr\,d\theta$)로 바꿉니다.
$$I^2=\iint\exp\Big(-\frac{x^2+y^2}{2\sigma^2}\Big)dx\,dy=\int_0^{2\pi}\!\!\int_0^\infty e^{-r^2/(2\sigma^2)}r\,dr\,d\theta=2\pi\Big[-\sigma^2e^{-r^2/(2\sigma^2)}\Big]_0^\infty=2\pi\sigma^2.$$
$I>0$이므로 $I=(2\pi\sigma^2)^{1/2}$. $y=x-\mu$로 치환하면 $\int\exp\{-(x-\mu)^2/(2\sigma^2)\}dx=I$이므로 $\N$의 적분은 1입니다.

**평균.** $y=x-\mu$로 치환하면
$$\E[x]=\int(y+\mu)\N(y\mid0,\sigma^2)dy=\underbrace{\int y\N(y\mid0,\sigma^2)dy}_{\text{홀함수}\ =\ 0}+\mu=\mu.$$
**분산.** 정규화 식 $\int\exp\{-(x-\mu)^2/(2\sigma^2)\}dx=(2\pi\sigma^2)^{1/2}$의 양변을 $\sigma^2$로 미분하면
$$\int\frac{(x-\mu)^2}{2\sigma^4}\exp\Big\{-\frac{(x-\mu)^2}{2\sigma^2}\Big\}dx=\frac12(2\pi)^{1/2}(\sigma^2)^{-1/2}.$$
양변에 $2\sigma^4/(2\pi\sigma^2)^{1/2}$를 곱하면 $\E[(x-\mu)^2]=\sigma^2$. 따라서 $\Var[x]=\sigma^2$, $\E[x^2]=\Var[x]+\E[x]^2=\mu^2+\sigma^2$.`,
    note: R`적분 기호 안에서 미분하는 방법(파인만 트릭)은 $\E[x^2]$를 부분적분 없이 얻게 해 줍니다. 극좌표 변환은 공학수학의 이중적분 변수변환입니다.` },
  { ch: 'ch04', id: 'gauss-ml', title: '가우시안의 최대가능도 해', keys: ['가우시안의 최대가능도 해'], src: 'Bishop 연습문제 2.15',
    tags: 'maximum likelihood Gaussian sample mean sample variance MLE 최대가능도 표본평균 표본분산',
    stmt: R`i.i.d. 표본 $x_1,\dots,x_N\sim\N(\mu,\sigma^2)$의 로그가능도를 최대화하는 값은 $\mu_{\text{ML}}=\frac1N\sum_nx_n$, $\sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\mu_{\text{ML}})^2$이다.`,
    body: R`
독립이므로 가능도는 곱 $p(\mathbf x\mid\mu,\sigma^2)=\prod_n\N(x_n\mid\mu,\sigma^2)$이고, 로그를 취하면
$$\ln p=-\frac1{2\sigma^2}\sum_{n=1}^N(x_n-\mu)^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi).$$
**$\mu$.** $\frac{\partial\ln p}{\partial\mu}=\frac1{\sigma^2}\sum_n(x_n-\mu)=0\Rightarrow\mu_{\text{ML}}=\frac1N\sum_nx_n$. 이계도함수 $-N/\sigma^2<0$이라 최대입니다.

**$\sigma^2$.** $v=\sigma^2$로 두고 미분하면
$$\frac{\partial\ln p}{\partial v}=\frac1{2v^2}\sum_n(x_n-\mu)^2-\frac N{2v}=0\Rightarrow v=\frac1N\sum_n(x_n-\mu)^2.$$
$\mu$의 최적값이 $\sigma^2$와 무관하므로 먼저 $\mu_{\text{ML}}$을 대입하면 $\sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\mu_{\text{ML}})^2$. ($v\to0^+$이나 $v\to\infty$에서 $\ln p\to-\infty$이므로 이 유일한 정류점이 최대)`,
    note: R`로그는 단조증가라 최대점이 같고, 곱을 합으로 바꿔 미분을 쉽게 하며, 작은 확률의 곱에서 생기는 수치적 언더플로도 막아 줍니다.` },
  { ch: 'ch04', id: 'ml-bias', title: '최대가능도 분산 추정의 편향', keys: ['최대가능도의 편향'], src: 'Bishop 연습문제 2.16, 2.17',
    tags: 'bias variance estimator unbiased Bessel N-1 편향 불편추정량 표본분산',
    stmt: R`$\E[\mu_{\text{ML}}]=\mu$, $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$. 참 평균을 쓴 $\hat\sigma^2=\frac1N\sum(x_n-\mu)^2$은 $\E[\hat\sigma^2]=\sigma^2$이다.`,
    body: R`
**핵심 식.** 독립이므로 $n\ne m$이면 $\E[x_nx_m]=\E[x_n]\E[x_m]=\mu^2$, $n=m$이면 $\E[x_n^2]=\mu^2+\sigma^2$. 합쳐서 $\E[x_nx_m]=\mu^2+I_{nm}\sigma^2$.

**평균.** $\E[\mu_{\text{ML}}]=\frac1N\sum_n\E[x_n]=\mu$.

**분산.** $\bar x=\mu_{\text{ML}}$로 쓰면
$$\E[\bar x^2]=\frac1{N^2}\sum_{n,m}\E[x_nx_m]=\frac1{N^2}\big(N^2\mu^2+N\sigma^2\big)=\mu^2+\frac{\sigma^2}N,\qquad \E[x_n\bar x]=\frac1N\sum_m\E[x_nx_m]=\mu^2+\frac{\sigma^2}N.$$
따라서
$$\E[(x_n-\bar x)^2]=\E[x_n^2]-2\E[x_n\bar x]+\E[\bar x^2]=(\mu^2+\sigma^2)-2\Big(\mu^2+\frac{\sigma^2}N\Big)+\mu^2+\frac{\sigma^2}N=\frac{N-1}N\sigma^2,$$
$\E[\sigma^2_{\text{ML}}]=\frac1N\sum_n\E[(x_n-\bar x)^2]=\frac{N-1}N\sigma^2$.

**참 평균을 알 때.** $\E[(x_n-\mu)^2]=\sigma^2$이므로 $\E[\hat\sigma^2]=\sigma^2$.`,
    note: R`편향의 원인은 분산을 참 평균이 아니라 **같은 자료로 맞춘** $\bar x$ 주위에서 재기 때문입니다. $\bar x$는 자료에 가장 가깝게 놓이므로 편차가 체계적으로 작게 나옵니다. $\frac N{N-1}$을 곱하면 불편추정량이 되고, $N\to\infty$이면 편향은 사라집니다.` },
  { ch: 'ch04', id: 'linreg-ml', title: '선형회귀의 최대가능도 = 최소제곱', keys: ['선형회귀의 최대가능도'],
    tags: 'linear regression maximum likelihood least squares noise variance 최대가능도 최소제곱 잡음 분산',
    stmt: R`$t=y(x,\mathbf w)+\epsilon$, $\epsilon\sim\N(0,\sigma^2)$ i.i.d.이면 $\mathbf w_{\text{ML}}$은 제곱오차합의 최소점이고, $\sigma^2_{\text{ML}}=\frac1N\sum_n\{y(x_n,\mathbf w_{\text{ML}})-t_n\}^2$이다.`,
    body: R`
$p(t_n\mid x_n,\mathbf w,\sigma^2)=\N(t_n\mid y(x_n,\mathbf w),\sigma^2)$이고 독립이므로
$$\ln p(\mathbf t\mid\mathbf x,\mathbf w,\sigma^2)=-\frac1{2\sigma^2}\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi).$$
**$\mathbf w$.** 뒤의 두 항은 $\mathbf w$와 무관하고 $\frac1{\sigma^2}>0$은 양의 상수이므로, 로그가능도 최대화 ⇔ $E(\mathbf w)=\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2$ 최소화. 그래서 $\mathbf w_{\text{ML}}$은 $\sigma^2$에 의존하지 않습니다.

**$\sigma^2$.** $v=\sigma^2$로 미분:
$$\frac{\partial}{\partial v}=\frac1{2v^2}\sum_n\{y(x_n,\mathbf w_{\text{ML}})-t_n\}^2-\frac N{2v}=0\Rightarrow\sigma^2_{\text{ML}}=\frac1N\sum_n\{y(x_n,\mathbf w_{\text{ML}})-t_n\}^2.$$
즉 잡음 분산의 추정값은 평균 제곱 잔차 $=E_{\text{RMS}}^2$입니다.`,
    note: R`제곱오차는 “가우시안 잡음”이라는 가정에서 나옵니다. 잡음이 라플라스 분포면 절대오차 $\sum\lvert y-t\rvert$가 됩니다. 이 확률적 해석 덕분에 예측이 분포 $\N(t\mid y(x,\mathbf w_{\text{ML}}),\sigma^2_{\text{ML}})$가 됩니다.` },

  // ───── 05 밀도 변환과 정보이론
  { ch: 'ch05', id: 'change-var', title: '확률밀도의 변수변환 공식', keys: ['확률밀도의 변수변환'],
    tags: 'change of variables density transformation Jacobian 변수변환 확률밀도 야코비안',
    stmt: R`$x=g(y)$가 순단조이고 미분 가능하면 $p_y(y)=p_x(g(y))\lvert g'(y)\rvert$.`,
    body: R`
누적분포 $P_y(y)=p(Y\le y)$에서 출발합니다.

**$g$가 증가.** $Y\le y\iff X=g(Y)\le g(y)$이므로 $P_y(y)=P_x(g(y))$. 미분하면 $p_y(y)=p_x(g(y))g'(y)$, 이때 $g'\ge0$.

**$g$가 감소.** $Y\le y\iff X\ge g(y)$이므로 $P_y(y)=1-P_x(g(y))$. 미분하면 $p_y(y)=-p_x(g(y))g'(y)$, 이때 $-g'=\lvert g'\rvert$.

두 경우를 합치면 $p_y(y)=p_x(g(y))\lvert g'(y)\rvert$. 직관적으로는 작은 구간의 확률이 보존되어야 한다는 것 — $p_x(x)\lvert\delta x\rvert\simeq p_y(y)\lvert\delta y\rvert$ — 입니다. 다변수에서는 부피의 확대율이 $\lvert\det J\rvert$이므로 $p_{\mathbf y}(\mathbf y)=p_{\mathbf x}(\mathbf g(\mathbf y))\lvert\det J\rvert$.`,
    note: R`야코비안 인수 때문에 **밀도의 최댓값 위치는 변수 선택에 따라 달라집니다**: $\hat x$가 $p_x$의 최댓점이어도 $p_y$의 최댓점은 일반적으로 $g^{-1}(\hat x)$가 아닙니다. 확률 질량(구간의 확률)은 보존되지만 밀도는 그렇지 않습니다.` },
  { ch: 'ch05', id: 'gauss-entropy', title: '가우시안의 미분 엔트로피', keys: ['정보량과 엔트로피'], src: 'Bishop 연습문제 2.25',
    tags: 'differential entropy Gaussian nats 미분 엔트로피 가우시안',
    stmt: R`$x\sim\N(\mu,\sigma^2)$이면 $\mathrm H[x]=\frac12\{1+\ln(2\pi\sigma^2)\}$.`,
    body: R`
$\ln\N(x\mid\mu,\sigma^2)=-\frac12\ln(2\pi\sigma^2)-\frac{(x-\mu)^2}{2\sigma^2}$이므로
$$\mathrm H[x]=-\E[\ln\N(x\mid\mu,\sigma^2)]=\frac12\ln(2\pi\sigma^2)+\frac{\E[(x-\mu)^2]}{2\sigma^2}=\frac12\ln(2\pi\sigma^2)+\frac12.$$
($\E[(x-\mu)^2]=\sigma^2$ 사용)`,
    note: R`분산이 클수록(분포가 넓을수록) 엔트로피가 커지고, $\sigma^2<1/(2\pi e)$이면 음수가 됩니다 — 미분 엔트로피는 이산 엔트로피와 달리 음수일 수 있습니다. 평균·분산이 정해진 분포 중 엔트로피가 최대인 것이 가우시안입니다.` },
  { ch: 'ch05', id: 'jensen', title: '옌센 부등식 (유한 형태)', keys: ['옌센 부등식'], src: 'Bishop 연습문제 2.33',
    tags: 'Jensen inequality convex induction 옌센 부등식 볼록 귀납법',
    stmt: R`$f$가 볼록이고 $\lambda_i\ge0$, $\sum_{i=1}^M\lambda_i=1$이면 $f\big(\sum_i\lambda_ix_i\big)\le\sum_i\lambda_if(x_i)$.`,
    body: R`
$M$에 대한 귀납법. $M=1$은 자명하고, $M=2$는 볼록함수의 정의 그 자체입니다.

$M$개에서 성립한다고 가정하고 $M+1$개를 봅니다. $\lambda_{M+1}=1$이면 자명하므로 $\lambda_{M+1}<1$이라 하고 $\mu_i=\lambda_i/(1-\lambda_{M+1})$ ($i\le M$)로 두면 $\mu_i\ge0$, $\sum_{i=1}^M\mu_i=1$입니다.
$$\sum_{i=1}^{M+1}\lambda_ix_i=\lambda_{M+1}x_{M+1}+(1-\lambda_{M+1})\sum_{i=1}^M\mu_ix_i.$$
두 점에 대한 볼록성으로
$$f\Big(\sum_{i=1}^{M+1}\lambda_ix_i\Big)\le\lambda_{M+1}f(x_{M+1})+(1-\lambda_{M+1})f\Big(\sum_{i=1}^M\mu_ix_i\Big),$$
귀납 가정으로 $f\big(\sum_{i\le M}\mu_ix_i\big)\le\sum_{i\le M}\mu_if(x_i)$이므로
$$f\Big(\sum_{i=1}^{M+1}\lambda_ix_i\Big)\le\lambda_{M+1}f(x_{M+1})+\sum_{i=1}^M\lambda_if(x_i).$$
$\lambda_i$를 확률로 보면 $f(\E[x])\le\E[f(x)]$이고, 연속 분포는 극한으로 얻습니다.`,
    note: R`$f$가 **순볼록**이면 등호는 $\lambda_i>0$인 $x_i$가 모두 같을 때만 성립합니다. 이 등호 조건이 KL 발산이 0일 필요충분조건 $p=q$로 이어집니다.` },
  { ch: 'ch05', id: 'kl-nonneg', title: 'KL 발산은 0 이상 (깁스 부등식)', keys: ['KL 발산', '옌센 부등식'],
    tags: 'KL divergence nonnegative Gibbs inequality Jensen 쿨백 라이블러 음이 아님',
    stmt: R`$\KL(p\Vert q)=-\int p(\mathbf x)\ln\frac{q(\mathbf x)}{p(\mathbf x)}d\mathbf x\ge0$이고, 등호는 $p=q$일 때만 성립한다.`,
    body: R`
$-\ln$은 순볼록이므로 옌센 부등식 $\E[f(u)]\ge f(\E[u])$를 $u=q(\mathbf x)/p(\mathbf x)$, 기댓값은 $p$에 대해 적용합니다($p>0$인 곳에서 적분).
$$\KL(p\Vert q)=\int p(\mathbf x)\Big\{-\ln\frac{q(\mathbf x)}{p(\mathbf x)}\Big\}d\mathbf x\ \ge\ -\ln\int p(\mathbf x)\frac{q(\mathbf x)}{p(\mathbf x)}d\mathbf x=-\ln\int_{p>0}q(\mathbf x)\,d\mathbf x\ \ge\ -\ln1=0.$$
마지막 단계는 $\int_{p>0}q\le\int q=1$과 $-\ln$의 단조감소를 썼습니다.

**등호.** 첫 부등식은 $-\ln$이 순볼록이므로 $q/p$가 ($p$에 대해 거의 모든 곳에서) 상수 $c$일 때만 등호이고, 둘째는 $q$의 질량이 모두 $p>0$ 위에 있을 때만 등호입니다. 그러면 $1=\int q=c\int p=c$이므로 $q=p$.`,
    note: R`$\KL(p\Vert q)=\text{교차엔트로피}-\mathrm H[p]$이므로 이 결과는 “교차엔트로피 $-\int p\ln q\ge$ 엔트로피 $-\int p\ln p$”와 같습니다. 분류에서 교차엔트로피 손실을 최소화하는 것이 KL을 최소화하는 이유입니다.` },
  { ch: 'ch05', id: 'ml-kl', title: '최대가능도는 KL 발산 최소화', keys: ['최대가능도 = KL 최소화'], src: 'Bishop 연습문제 2.34',
    tags: 'maximum likelihood KL divergence empirical distribution 최대가능도 KL 경험분포',
    stmt: R`자료 $\mathbf x_n\sim p$ (i.i.d.)에 대해 모델 $q(\mathbf x\mid\boldsymbol\theta)$의 로그가능도를 최대화하는 것은 $\KL(p\Vert q)$의 표본 근사를 최소화하는 것과 같다.`,
    body: R`
$$\KL(p\Vert q)=\E_{p}\big[-\ln q(\mathbf x\mid\boldsymbol\theta)\big]-\E_p\big[-\ln p(\mathbf x)\big].$$
둘째 항(엔트로피 $\mathrm H[p]$)은 $\boldsymbol\theta$와 무관합니다. 첫째 항의 기댓값을 표본평균으로 근사하면(큰수의 법칙)
$$\E_p\big[-\ln q(\mathbf x\mid\boldsymbol\theta)\big]\simeq-\frac1N\sum_{n=1}^N\ln q(\mathbf x_n\mid\boldsymbol\theta)=-\frac1N\ln\prod_nq(\mathbf x_n\mid\boldsymbol\theta).$$
따라서 $\arg\min_{\boldsymbol\theta}\KL(p\Vert q)\approx\arg\max_{\boldsymbol\theta}\sum_n\ln q(\mathbf x_n\mid\boldsymbol\theta)$ — 최대가능도입니다.

(이산 자료에서는 $p$ 자리에 경험분포 $\hat p(\mathbf x)=\frac1N\sum_n\mathbb 1[\mathbf x=\mathbf x_n]$를 넣으면 근사 없이 $\KL(\hat p\Vert q)=-\frac1N\sum_n\ln q(\mathbf x_n\mid\boldsymbol\theta)-\mathrm H[\hat p]$로 정확히 성립합니다.)`,
    note: R`$\KL(p\Vert q)$에서 기댓값이 **참 분포 $p$**에 대해 취해지기 때문에 자료로 근사할 수 있습니다. 반대 방향 $\KL(q\Vert p)$는 $p$를 알아야 해서 이렇게 할 수 없습니다.` },
  { ch: 'ch05', id: 'mutual-info', title: '결합 엔트로피 분해와 상호정보량', keys: ['결합·조건부 엔트로피와 상호정보량'], src: 'Bishop 연습문제 2.35, 2.38',
    tags: 'joint entropy conditional entropy mutual information independence 결합 엔트로피 조건부 엔트로피 상호정보량',
    stmt: R`$\mathrm H[\mathbf x,\mathbf y]=\mathrm H[\mathbf y\mid\mathbf x]+\mathrm H[\mathbf x]$, $\mathrm I[\mathbf x,\mathbf y]=\mathrm H[\mathbf x]-\mathrm H[\mathbf x\mid\mathbf y]=\mathrm H[\mathbf y]-\mathrm H[\mathbf y\mid\mathbf x]\ge0$이고, $\mathrm I=0$은 독립일 때만이다.`,
    body: R`
**분해.** 곱의 규칙 $\ln p(\mathbf x,\mathbf y)=\ln p(\mathbf y\mid\mathbf x)+\ln p(\mathbf x)$의 양변에 $-p(\mathbf x,\mathbf y)$를 곱해 적분하면
$$\mathrm H[\mathbf x,\mathbf y]=-\iint p(\mathbf x,\mathbf y)\ln p(\mathbf y\mid\mathbf x)-\iint p(\mathbf x,\mathbf y)\ln p(\mathbf x)=\mathrm H[\mathbf y\mid\mathbf x]+\mathrm H[\mathbf x].$$
(둘째 적분에서 $\mathbf y$를 먼저 적분하면 합의 규칙으로 $p(\mathbf x)$가 남습니다.)

**상호정보량.** 정의 $\mathrm I=\KL\big(p(\mathbf x,\mathbf y)\Vert p(\mathbf x)p(\mathbf y)\big)=-\iint p(\mathbf x,\mathbf y)\ln\frac{p(\mathbf x)p(\mathbf y)}{p(\mathbf x,\mathbf y)}$에 $p(\mathbf x,\mathbf y)=p(\mathbf x\mid\mathbf y)p(\mathbf y)$를 넣으면
$$\mathrm I=-\iint p(\mathbf x,\mathbf y)\ln p(\mathbf x)+\iint p(\mathbf x,\mathbf y)\ln p(\mathbf x\mid\mathbf y)=\mathrm H[\mathbf x]-\mathrm H[\mathbf x\mid\mathbf y].$$
$\mathbf x,\mathbf y$의 역할을 바꾸면 $\mathrm H[\mathbf y]-\mathrm H[\mathbf y\mid\mathbf x]$.

**부호.** KL이므로 $\mathrm I\ge0$, 등호는 $p(\mathbf x,\mathbf y)=p(\mathbf x)p(\mathbf y)$(독립)일 때만. 따라서 $\mathrm H[\mathbf x\mid\mathbf y]\le\mathrm H[\mathbf x]$ — 조건을 주면 엔트로피가 늘지 않으며, $\mathrm H[\mathbf x,\mathbf y]\le\mathrm H[\mathbf x]+\mathrm H[\mathbf y]$.`,
    note: R`$\mathrm I[\mathbf x,\mathbf y]$는 $\mathbf y$를 관측해 $\mathbf x$에 대한 불확실성이 얼마나 줄었는지입니다 — 베이지안 관점에서 사전분포 $p(\mathbf x)$에서 사후분포 $p(\mathbf x\mid\mathbf y)$로 갈 때의 평균 정보 획득.` },

  // ───── 06 베이지안
  { ch: 'ch06', id: 'beta-posterior', title: '균등 사전분포에서 베르누이 모수의 사후분포', keys: ['베이지안 모수 추정'],
    tags: 'Bayesian posterior Bernoulli uniform prior beta Laplace rule of succession 베이지안 사후분포 베르누이 라플라스',
    stmt: R`$\mu$에 균등 사전분포를 두고 $N$번 중 $m$번 성공을 관측하면 $p(\mu\mid\mathcal D)=\frac{(N+1)!}{m!(N-m)!}\mu^m(1-\mu)^{N-m}$이고, 사후평균은 $\frac{m+1}{N+2}$이다.`,
    body: R`
**베타 적분.** 음이 아닌 정수 $a,b$에 대해 $B(a,b)\equiv\int_0^1\mu^a(1-\mu)^bd\mu=\frac{a!\,b!}{(a+b+1)!}$. $b\ge1$이면 부분적분으로
$$B(a,b)=\Big[\frac{\mu^{a+1}}{a+1}(1-\mu)^b\Big]_0^1+\frac b{a+1}\int_0^1\mu^{a+1}(1-\mu)^{b-1}d\mu=\frac b{a+1}B(a+1,b-1),$$
이를 반복하면 $B(a,b)=\frac{b!\,a!}{(a+b)!}B(a+b,0)=\frac{a!\,b!}{(a+b)!}\cdot\frac1{a+b+1}$.

**사후분포.** 가능도 $p(\mathcal D\mid\mu)=\mu^m(1-\mu)^{N-m}$, 사전 $p(\mu)=1$. 베이즈 정리로 사후 $\propto\mu^m(1-\mu)^{N-m}$이고 정규화 상수는 $1/B(m,N-m)=\frac{(N+1)!}{m!(N-m)!}$.

**사후평균.**
$$\E[\mu\mid\mathcal D]=\frac{B(m+1,N-m)}{B(m,N-m)}=\frac{(m+1)!(N-m)!}{(N+2)!}\cdot\frac{(N+1)!}{m!(N-m)!}=\frac{m+1}{N+2}.$$
예: 3번 던져 3번 앞면($m=N=3$)이면 사후 $4\mu^3$, 사후평균 $4/5=0.8$ — MLE $m/N=1$처럼 극단적이지 않습니다.`,
    note: R`$\frac{m+1}{N+2}$는 “성공·실패를 하나씩 미리 봤다”고 치는 것과 같습니다(라플라스의 계승 규칙). 자료가 적을 때 MLE의 과신을 막는 규제 효과가 사전분포에서 나옵니다.` },
  { ch: 'ch06', id: 'map-l2', title: 'MAP 추정은 L2 규제', keys: ['MAP과 L2 규제'],
    tags: 'MAP maximum a posteriori Gaussian prior L2 regularization weight decay 사후확률 최대화 규제',
    stmt: R`잡음 $\N(0,\sigma^2)$의 회귀에 사전분포 $p(\mathbf w)=\prod_i\N(w_i\mid0,s^2)$를 두면, 사후확률을 최대화하는 $\mathbf w$는 $\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2+\frac\lambda2\mathbf w^T\mathbf w$의 최소점이고 $\lambda=\sigma^2/s^2$이다.`,
    body: R`
베이즈 정리의 음의 로그:
$$-\ln p(\mathbf w\mid\mathcal D)=-\ln p(\mathcal D\mid\mathbf w)-\ln p(\mathbf w)+\ln p(\mathcal D).$$
- 가능도: $-\ln p(\mathcal D\mid\mathbf w)=\frac1{2\sigma^2}\sum_n\{y(x_n,\mathbf w)-t_n\}^2+\frac N2\ln(2\pi\sigma^2)$
- 사전: $-\ln p(\mathbf w)=\sum_i\Big\{\frac{w_i^2}{2s^2}+\frac12\ln(2\pi s^2)\Big\}=\frac1{2s^2}\mathbf w^T\mathbf w+\text{const}$
- 증거 $p(\mathcal D)$는 $\mathbf w$와 무관

따라서 MAP 해는
$$\frac1{2\sigma^2}\sum_n\{y(x_n,\mathbf w)-t_n\}^2+\frac1{2s^2}\mathbf w^T\mathbf w$$
의 최소점입니다. 양의 상수 $\sigma^2$를 곱해도 최소점은 같으므로 $\frac12\sum_n\{\cdot\}^2+\frac{\sigma^2}{2s^2}\mathbf w^T\mathbf w$, 즉 $\lambda=\sigma^2/s^2$.`,
    note: R`사전분포가 좁을수록($s^2$ 작음) 또는 잡음이 클수록($\sigma^2$ 큼) 규제가 강해집니다. 라플라스 사전분포 $p(w_i)\propto e^{-\lvert w_i\rvert/b}$를 쓰면 L1(라쏘) 규제가 됩니다. MAP은 여전히 점 추정이라 사후분포의 불확실성은 버립니다.` },
  { ch: 'ch06', id: 'predictive', title: '베이지안 예측분포의 유도', keys: ['베이지안 예측분포'],
    tags: 'Bayesian predictive distribution marginalization posterior 예측분포 주변화',
    stmt: R`$p(t\mid x,\mathcal D)=\int p(t\mid x,\mathbf w)\,p(\mathbf w\mid\mathcal D)\,d\mathbf w$. 사후분포가 한 점 $\hat{\mathbf w}$에 몰려 있으면 $p(t\mid x,\hat{\mathbf w})$가 된다.`,
    body: R`
합의 규칙(연속형)으로 $\mathbf w$를 주변화하고 곱의 규칙을 적용합니다.
$$p(t\mid x,\mathcal D)=\int p(t,\mathbf w\mid x,\mathcal D)\,d\mathbf w=\int p(t\mid x,\mathbf w,\mathcal D)\,p(\mathbf w\mid x,\mathcal D)\,d\mathbf w.$$
두 가지 조건부 독립을 씁니다.
- $\mathbf w$가 주어지면 새 목표값 $t$의 분포는 모델이 정하므로 과거 자료와 무관: $p(t\mid x,\mathbf w,\mathcal D)=p(t\mid x,\mathbf w)$
- 새 입력 $x$만으로는(목표값 없이) $\mathbf w$에 대한 정보가 없음: $p(\mathbf w\mid x,\mathcal D)=p(\mathbf w\mid\mathcal D)$

따라서 $p(t\mid x,\mathcal D)=\int p(t\mid x,\mathbf w)p(\mathbf w\mid\mathcal D)d\mathbf w$ — 모든 가능한 $\mathbf w$의 예측을 사후확률로 가중 평균한 것입니다.

사후분포가 $\delta(\mathbf w-\hat{\mathbf w})$로 근사되면 적분이 $p(t\mid x,\hat{\mathbf w})$가 되어 MLE·MAP의 “플러그인” 예측이 됩니다.`,
    note: R`이 적분은 파라미터가 수백만 개인 신경망에서는 계산할 수 없습니다. 모델 평균·드롭아웃(12단원)은 이 평균을 값싸게 흉내 내는 방법으로 볼 수 있습니다.` },
  );
})();
