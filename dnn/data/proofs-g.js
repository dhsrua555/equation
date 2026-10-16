/* 판서에 없는 증명 — Part G: 01–04 (선형회귀, 확률·추정, 정보이론, 확률적 회귀·규제·커널)
   수업 판서에서 증명하지 않았지만 시험에 중요한 공식. src가 없으므로 증명 탭에 ‘판서에 없는 증명’으로 표시됩니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 01
  { ch: 'ch01', id: 'simplels', title: '단순회귀의 최소제곱 공식과 무게중심', keys: ['정규방정식'],
    tags: 'simple linear regression slope intercept centroid least squares formula Sxy Sxx normal equations 단순회귀 기울기 절편 무게중심 최소제곱 공식 정규방정식',
    stmt: R`(a) 절편이 있는 선형회귀 $y=X\beta+\varepsilon$ ($X$의 첫 열이 $\mathbf 1=(1,\dots,1)^T$)에서 정규방정식의 해 $\hat\beta$는 $\hat\beta_0=\bar y-\sum_{j=1}^k\hat\beta_j\bar x_j$ ($\bar x_j=\frac1n\sum_ix_{ij}$)를 만족한다. 즉 적합된 직선(평면)은 무게중심 $(\bar x_1,\dots,\bar x_k,\bar y)$를 지난다.

(b) 단순회귀($k=1$)에서 $x_i$가 모두 같지는 않으면($S_{xx}>0$) 최소제곱해는 하나뿐이고
$$\hat\beta_1=\frac{S_{xy}}{S_{xx}},\qquad\hat\beta_0=\bar y-\hat\beta_1\bar x$$
이다. 여기서 $S_{xy}=\sum_i(x_i-\bar x)(y_i-\bar y)$, $S_{xx}=\sum_i(x_i-\bar x)^2$.`,
    body: R`
**(a) 정규방정식의 첫 줄.** 정규방정식 $X^TX\hat\beta=X^Ty$는 $X^T(y-X\hat\beta)=0$과 같고, 그 첫 성분은 $X$의 첫 열 $\mathbf 1$과 잔차의 내적입니다.
$$\sum_{i=1}^n\Big(y_i-\hat\beta_0-\sum_{j=1}^k\hat\beta_jx_{ij}\Big)=0$$
합을 항별로 나누면 $\sum_iy_i-n\hat\beta_0-\sum_j\hat\beta_j\sum_ix_{ij}=0$이고, $n$으로 나누면 $\bar y-\hat\beta_0-\sum_j\hat\beta_j\bar x_j=0$. 이것이 (a)입니다. 적합식 $\hat y=\hat\beta_0+\sum_j\hat\beta_jx_j$에 $x_j=\bar x_j$를 넣으면 $\bar y$가 나오므로 무게중심을 지납니다.

**(b) 1. 두 식.** $k=1$이면 정규방정식의 두 성분(잔차와 열 $\mathbf 1$, 열 $x$의 내적)은 다음과 같습니다.
$$\begin{aligned}n\beta_0+\beta_1\textstyle\sum_ix_i&=\textstyle\sum_iy_i\\\beta_0\textstyle\sum_ix_i+\beta_1\textstyle\sum_ix_i^2&=\textstyle\sum_ix_iy_i\end{aligned}$$
**2. 절편 소거.** 첫 식은 (a)와 같아서 $\beta_0=\bar y-\beta_1\bar x$. 이것과 $\sum_ix_i=n\bar x$를 둘째 식에 넣으면
$$(\bar y-\beta_1\bar x)\,n\bar x+\beta_1\textstyle\sum_ix_i^2=\sum_ix_iy_i$$
이고, 정리하면 $\beta_1\big(\sum_ix_i^2-n\bar x^2\big)=\sum_ix_iy_i-n\bar x\bar y$입니다.

**3. 편차 형태로.** $\sum_ix_i=n\bar x$, $\sum_iy_i=n\bar y$를 쓰며 전개하면
$$\begin{aligned}S_{xx}&=\textstyle\sum_ix_i^2-2\bar x\sum_ix_i+n\bar x^2=\sum_ix_i^2-n\bar x^2\\S_{xy}&=\textstyle\sum_ix_iy_i-\bar x\sum_iy_i-\bar y\sum_ix_i+n\bar x\bar y\\&=\textstyle\sum_ix_iy_i-n\bar x\bar y\end{aligned}$$
따라서 2단계의 식은 $\beta_1S_{xx}=S_{xy}$입니다.

**4. 유일성.** $S_{xx}>0$이면 $\beta_1=S_{xy}/S_{xx}$로 하나로 정해지고, 그러면 $\beta_0=\bar y-\beta_1\bar x$도 하나입니다. 최솟점은 모두 정규방정식을 만족하고 정규방정식의 해는 모두 최솟점이므로(1.3절), 이 해가 유일한 최소제곱해입니다. $S_{xx}=0$은 $x$가 상수벡터, 즉 두 열 $\mathbf 1$과 $x$가 비례한다는 뜻이므로 조건 $S_{xx}>0$은 “$X$의 열이 일차독립”과 같습니다.`,
    note: R`1.3절 예제 3에서 $\bar x=1.5$, $\bar y=2.25$, $S_{xx}=5$, $S_{xy}=4.5$이므로 $\hat\beta_1=0.9$, $\hat\beta_0=0.9$. $S_{xy}/S_{xx}$는 $x$와 $y$의 표본공분산을 $x$의 표본분산으로 나눈 것이라, 기울기는 “$x$가 한 단위 변할 때 $y$가 평균적으로 변하는 양”입니다. 절편이 없는 모델에는 (a)의 첫 줄이 없으므로 무게중심을 지난다는 보장도, 잔차의 합이 0이라는 보장도 없습니다(1.3절 예제 4).` },
  { ch: 'ch01', id: 'rsquared', title: '제곱합 분해와 결정계수의 범위', keys: ['기준선과 결정계수'],
    tags: 'R squared coefficient of determination total sum of squares SST SSE explained sum of squares decomposition baseline intercept 결정계수 총제곱합 잔차제곱합 설명된 제곱합 제곱합 분해 기준선 절편',
    stmt: R`설계행렬 $X$의 첫 열이 $\mathbf 1=(1,\dots,1)^T$(절편)이고 $\hat\beta$가 정규방정식 $X^TX\hat\beta=X^Ty$의 해, $\hat y=X\hat\beta$, $r=y-\hat y$라 하자. $S_{yy}=\sum_i(y_i-\bar y)^2>0$이면
$$S_{yy}=\mathrm{SSE}+S_{\hat y\hat y}$$
$$S_{\hat y\hat y}=\sum_{i=1}^n(\hat y_i-\bar y)^2$$
이다($\mathrm{SSE}=\sum_ir_i^2$). 따라서 $R^2=1-\frac{\mathrm{SSE}}{S_{yy}}=\frac{S_{\hat y\hat y}}{S_{yy}}$이고 $0\le R^2\le1$이다. $R^2=1$은 모든 잔차가 0일 때, $R^2=0$은 모든 $i$에서 $\hat y_i=\bar y$일 때뿐이다.`,
    body: R`
**1. 잔차의 합은 0.** 정규방정식은 $X^T(y-X\hat\beta)=X^Tr=0$, 즉 $X$의 모든 열이 $r$과 직교한다는 뜻입니다. 첫 열이 $\mathbf 1$이므로 $\mathbf 1^Tr=\sum_ir_i=0$. 따라서 $\sum_i\hat y_i=\sum_iy_i-\sum_ir_i=\sum_iy_i$, 곧 적합값의 평균도 $\bar y$입니다.

**2. 잔차는 적합값과도 직교.** $\hat y=X\hat\beta$는 $X$의 열들의 일차결합이므로 $\hat y^Tr=\hat\beta^TX^Tr=0$. 1단계와 합치면 $\sum_i(\hat y_i-\bar y)r_i=\hat y^Tr-\bar y\,\mathbf 1^Tr=0$입니다.

**3. 전개.** $y_i-\bar y=r_i+(\hat y_i-\bar y)$를 제곱해 $i$에 대해 더하면
$$\begin{aligned}S_{yy}&=\sum_ir_i^2+2\sum_ir_i(\hat y_i-\bar y)\\&\quad+\sum_i(\hat y_i-\bar y)^2\end{aligned}$$
가운데 교차항은 2단계에서 0이므로 $S_{yy}=\mathrm{SSE}+S_{\hat y\hat y}$입니다.

**4. 범위.** $S_{yy}>0$으로 나누면 $1=\frac{\mathrm{SSE}}{S_{yy}}+\frac{S_{\hat y\hat y}}{S_{yy}}$, 즉 $R^2=1-\frac{\mathrm{SSE}}{S_{yy}}=\frac{S_{\hat y\hat y}}{S_{yy}}$. 두 분수는 제곱합의 비라 모두 0 이상이므로 $R^2=\frac{S_{\hat y\hat y}}{S_{yy}}\ge0$이고 $R^2=1-\frac{\mathrm{SSE}}{S_{yy}}\le1$입니다.

**5. 등호.** $R^2=1\iff\mathrm{SSE}=0\iff$ 모든 $r_i=0$ (음이 아닌 수의 합이 0이면 각 항이 0), 즉 모든 점이 적합된 직선(평면) 위에 있습니다. $R^2=0\iff S_{\hat y\hat y}=0\iff$ 모든 $i$에서 $\hat y_i=\bar y$, 즉 최소제곱 모델이 기준선과 똑같은 예측을 냅니다.`,
    note: R`**절편이 꼭 필요합니다.** 1단계는 $\mathbf 1$이 $X$의 열이라는 데서 나왔습니다. 절편이 없으면 교차항이 남아 $R^2$이 음수가 될 수 있습니다. 예: $x=(1,2,3)$, $y=(3,2,1)$에 $y=\beta x$를 맞추면 $\hat\beta=\frac{10}{14}=\frac57$, $\mathrm{SSE}=\frac{336}{49}\approx6.86$, $S_{yy}=2$라서 $R^2\approx-2.43$ — 기준선보다도 나쁩니다. 절편이 있으면 기준선 자체가 $\beta=(\bar y,0,\dots,0)^T$로 후보에 들어 있으므로 $\mathrm{SSE}\le S_{yy}$라는 것이 $R^2\ge0$의 또 다른 설명입니다.

1.3절 예제 3에서는 $S_{\hat y\hat y}=4.05$, $\mathrm{SSE}=0.70$, 합 $4.75=S_{yy}$입니다. 슬라이드의 “SSR = 16.5”는 잔차제곱합(sum of squared residuals), 즉 이 증명의 SSE입니다. 열을 더 넣으면 최소화하는 범위가 넓어져 SSE가 줄거나 같으므로 훈련 자료의 $R^2$은 줄지 않습니다 — $R^2$만 보고 모델을 고르면 안 되는 이유입니다(4.2절 과적합).` },

  // ───── 02
  { ch: 'ch02', id: 'varbias', title: '분산 MLE의 편향과 n−1로 나누는 이유',
    tags: 'sample variance unbiased estimator bias MLE n-1 Bessel correction Gaussian 표본분산 불편추정량 편향 최대가능도 베셀 보정 가우시안',
    stmt: R`$X_1,\dots,X_n$ ($n\ge2$)이 i.i.d.이고 $\E X_i=\mu$, $\Var X_i=\sigma^2$이라 하자. $\bar X=\frac1n\sum_iX_i$, $\hat\sigma^2=\frac1n\sum_i(X_i-\bar X)^2$ (가우시안 자료의 분산 MLE)이면
$$\E[\hat\sigma^2]=\frac{n-1}n\sigma^2$$
이다. 따라서 $s^2=\frac1{n-1}\sum_i(X_i-\bar X)^2$은 $\sigma^2$의 불편추정량이다. 정규분포 가정은 필요 없다.`,
    body: R`
**1. 참평균 기준으로 다시 쓰기.** $X_i-\bar X=(X_i-\mu)-(\bar X-\mu)$로 쪼개 제곱해 더하면
$$\begin{aligned}\sum_i(X_i-\bar X)^2&=\sum_i(X_i-\mu)^2-2(\bar X-\mu)\sum_i(X_i-\mu)\\&\quad+n(\bar X-\mu)^2\end{aligned}$$
$\sum_i(X_i-\mu)=n\bar X-n\mu=n(\bar X-\mu)$이므로 가운데 항은 $-2n(\bar X-\mu)^2$이고, 다음을 얻습니다.
$$\sum_i(X_i-\bar X)^2=\sum_i(X_i-\mu)^2-n(\bar X-\mu)^2$$
**2. 기댓값.** 기댓값의 선형성으로 항마다 계산합니다. $\E(X_i-\mu)^2=\Var X_i=\sigma^2$이고, $\E\bar X=\mu$이므로 $\E(\bar X-\mu)^2=\Var\bar X=\frac{\sigma^2}n$ (독립이라서, 2.3절의 성질). 따라서
$$\E\sum_i(X_i-\bar X)^2=n\sigma^2-n\cdot\frac{\sigma^2}n=(n-1)\sigma^2.$$
**3. 결론.** $n$으로 나누면 $\E\hat\sigma^2=\frac{n-1}n\sigma^2<\sigma^2$이라 MLE는 분산을 평균적으로 과소추정합니다(편향 $-\sigma^2/n$). $n-1$로 나누면 $\E s^2=\sigma^2$. 독립성은 $\Var\bar X=\sigma^2/n$에서만 쓰였고, 정규분포라는 가정은 어디에도 쓰이지 않았습니다.`,
    note: R`**왜 작게 나오나.** $\bar X$는 $\sum_i(X_i-c)^2$을 최소로 하는 $c$입니다(미분하면 $c=\bar X$). 그러니 참평균 $\mu$ 대신 $\bar X$를 넣은 제곱합은 항상 더 작거나 같고, 1단계의 $n(\bar X-\mu)^2$이 정확히 그 차이입니다. 2.4절 예제 4(자료 $2,4,4,6$)의 $\hat\sigma^2=2$와 $s^2=\frac83$이 이 관계입니다. 4.1절의 회귀에서는 계수 $k+1$개를 자료에 맞추므로 같은 이유로 분모가 $n-k-1$이 됩니다(여기는 계수가 $\mu$ 하나인 경우).` },
  { ch: 'ch02', id: 'betamom', title: '베타분포의 모멘트와 두 사후분포의 비교', keys: ['두 베타 사후분포의 비교'],
    tags: 'Beta distribution moments mean variance Beta function integration by parts posterior comparison Amazon sellers Murphy 베타분포 모멘트 평균 분산 베타함수 부분적분 판매자 사후분포 비교',
    stmt: R`$a,b>0$이고 $\theta\sim\Beta(a,b)$ (밀도 $\theta^{a-1}(1-\theta)^{b-1}/B(a,b)$, $0<\theta<1$)이면 자연수 $m$에 대해
$$\E[\theta^m]=\frac{B(a+m,b)}{B(a,b)}=\prod_{j=0}^{m-1}\frac{a+j}{a+b+j}$$
이고, 특히 $\E\theta=\frac a{a+b}$, $\Var\theta=\frac{ab}{(a+b)^2(a+b+1)}$이다. 또 $\theta_1\sim\Beta(a,b)$와 $\theta_2\sim\Beta(3,1)$이 독립이면 $P(\theta_1>\theta_2)=\E[\theta_1^3]$이고, $(a,b)=(91,11)$이면 이 값은 $\frac{91}{102}\cdot\frac{92}{103}\cdot\frac{93}{104}\approx0.7126$이다.`,
    body: R`
**1. 모멘트는 베타함수의 비.** 밀도의 정의에서
$$\begin{aligned}\E[\theta^m]&=\int_0^1\theta^m\,\frac{\theta^{a-1}(1-\theta)^{b-1}}{B(a,b)}\,d\theta\\&=\frac{B(a+m,b)}{B(a,b)}\end{aligned}$$
입니다. 분자의 적분 $\int_0^1\theta^{a+m-1}(1-\theta)^{b-1}d\theta$가 베타함수의 정의에서 $B(a+m,b)$이기 때문입니다.

**2. 점화식.** 부분적분($u=t^a$, $dv=(1-t)^{b-1}dt$, $v=-(1-t)^b/b$)으로
$$\begin{aligned}B(a+1,b)&=\Big[-\frac{t^a(1-t)^b}{b}\Big]_0^1\\&\quad+\frac ab\int_0^1t^{a-1}(1-t)^b\,dt\\&=\frac ab\,B(a,b+1)\end{aligned}$$
경계항은 $t=0$에서 $t^a=0$ ($a>0$), $t=1$에서 $(1-t)^b=0$ ($b>0$)이라 사라집니다. 한편 피적분함수에 $1=t+(1-t)$를 곱해 나누면 $B(a,b)=B(a+1,b)+B(a,b+1)=B(a+1,b)+\frac baB(a+1,b)$. 따라서
$$B(a+1,b)=\frac a{a+b}\,B(a,b).$$
**3. 곱 공식.** 2단계를 $a,a+1,\dots,a+m-1$ (모두 양수)에 차례로 쓰면 비들이 연쇄적으로 약분됩니다.
$$\begin{aligned}\frac{B(a+m,b)}{B(a,b)}&=\prod_{j=0}^{m-1}\frac{B(a+j+1,b)}{B(a+j,b)}\\&=\prod_{j=0}^{m-1}\frac{a+j}{a+b+j}\end{aligned}$$
**4. 평균과 분산.** $m=1$이면 $\E\theta=\frac a{a+b}$, $m=2$이면 $\E\theta^2=\frac{a(a+1)}{(a+b)(a+b+1)}$. 따라서
$$\begin{aligned}\Var\theta&=\frac{a(a+1)}{(a+b)(a+b+1)}-\frac{a^2}{(a+b)^2}\\&=\frac{a\big[(a+1)(a+b)-a(a+b+1)\big]}{(a+b)^2(a+b+1)}\\&=\frac{ab}{(a+b)^2(a+b+1)}\end{aligned}$$
대괄호 안은 $a^2+ab+a+b-a^2-ab-a=b$입니다.

**5. 두 판매자.** $\theta_2\sim\Beta(3,1)$의 밀도는 $\theta^2/B(3,1)=3\theta^2$ ($B(3,1)=\int_0^1t^2dt=\frac13$)이고 누적분포는 $P(\theta_2\le t)=\int_0^t3s^2ds=t^3$ ($0\le t\le1$)입니다. 독립이라 결합밀도는 두 밀도의 곱이므로, $\theta_1=t$에서 먼저 $\theta_2$에 대해 적분하면(피적분함수가 음이 아니라 적분 순서를 정할 수 있음)
$$\begin{aligned}P(\theta_1>\theta_2)&=\int_0^1f_1(t)\,P(\theta_2<t)\,dt\\&=\int_0^1f_1(t)\,t^3\,dt=\E[\theta_1^3]\end{aligned}$$
여기서 $f_1$은 $\theta_1$의 밀도이고, $\theta_2$가 연속이라 $P(\theta_2<t)=P(\theta_2\le t)$입니다. $(a,b)=(91,11)$이면 3단계에서 $\E[\theta_1^3]=\frac{91\cdot92\cdot93}{102\cdot103\cdot104}=\frac{778596}{1092624}\approx0.7126$.`,
    note: R`같은 방법으로 $\theta_2\sim\Beta(k,1)$이면 누적분포가 $t^k$이므로 $P(\theta_1>\theta_2)=\E[\theta_1^k]$입니다. 4단계의 평균은 2.5절의 사후평균에 그대로 쓰입니다. 사전분포 $\Beta(a,b)$, $n$번 중 $S$번 성공이면 사후분포가 $\Beta(a+S,b+n-S)$라서
$$\begin{aligned}\E[\theta\mid D]&=\frac{a+S}{a+b+n}\\&=\frac{a+b}{a+b+n}\cdot\frac a{a+b}+\frac n{a+b+n}\cdot\frac Sn\end{aligned}$$
— 사전평균과 MLE의 가중평균입니다. 분산 $\frac{ab}{(a+b)^2(a+b+1)}$은 $a+b$가 클수록 작아지므로 리뷰가 많은 판매자 1의 사후분포가 훨씬 좁습니다: $\Beta(91,11)$의 표준편차는 약 $0.031$, $\Beta(3,1)$은 약 $0.194$.` },

  // ───── 03
  { ch: 'ch03', id: 'logunique', title: '정보량이 로그여야 하는 이유',
    tags: 'information content self-information surprisal logarithm uniqueness Cauchy functional equation additivity continuity Shannon 정보량 놀라움 로그 유일성 코시 함수방정식 가법성 연속성 섀넌',
    stmt: R`함수 $h:(0,1]\to\mathbb R$가 연속이고 모든 $p,q\in(0,1]$에 대해 $h(pq)=h(p)+h(q)$이면, 상수 $c=h(e^{-1})$에 대해
$$h(p)=-c\log p\qquad(0<p\le1)$$
이다. $h$가 감소함수(드문 사건일수록 정보가 많음)이고 상수가 아니면 $c>0$이다.`,
    body: R`
**1. 지수 좌표로 옮기기.** $t\ge0$에 대해 $g(t)=h(e^{-t})$로 둡니다. $t\mapsto e^{-t}$는 $[0,\infty)$를 $(0,1]$ 위로 일대일로 보내는 연속함수이므로 $g$는 $[0,\infty)$에서 연속이고, $p=e^{-t}$이면 $t=-\log p$라서 $h(p)=g(-\log p)$입니다. 곱이 합으로 바뀝니다.
$$\begin{aligned}g(s+t)&=h(e^{-s}e^{-t})=h(e^{-s})+h(e^{-t})\\&=g(s)+g(t)\end{aligned}$$
**2. 0과 자연수.** $s=t=0$을 넣으면 $g(0)=2g(0)$, 즉 $g(0)=0$. 또 $g(nt)=n\,g(t)$ ($n=1,2,\dots$)는 귀납법으로 나옵니다: $g((n+1)t)=g(nt)+g(t)=n\,g(t)+g(t)$.

**3. 유리수.** 자연수 $m,n$에 대해 2단계를 두 번 쓰면 $n\,g(\tfrac mn)=g(m)=m\,g(1)$이므로 $g(\tfrac mn)=\tfrac mn\,g(1)$. $g(0)=0$과 합치면 음이 아닌 모든 유리수 $r$에서 $g(r)=c\,r$, $c:=g(1)$입니다.

**4. 연속성.** 임의의 $t\ge0$에 대해 $r_k=\lfloor kt\rfloor/k$는 음이 아닌 유리수이고 $\lvert r_k-t\rvert\le\frac1k$이라 $r_k\to t$. $g$가 연속이므로 $g(t)=\lim_kg(r_k)=\lim_kc\,r_k=c\,t$.

**5. 되돌리기.** $h(p)=g(-\log p)=-c\log p$이고 $c=g(1)=h(e^{-1})$. 특히 $h(1)=0$입니다. $h$가 감소함수이면 $c=h(e^{-1})\ge h(1)=0$이고, $c=0$이면 $h\equiv0$이 상수이므로, 상수가 아닌 감소함수에서는 $c>0$입니다.`,
    note: R`상수 $c$는 로그의 밑을 고르는 것과 같습니다: $-c\log p=-\log_bp$, $b=e^{1/c}$. $c=1/\log2$이면 비트, $c=1$이면 내트입니다. 연속성(또는 단조성) 가정이 없으면 코시 방정식 $g(s+t)=g(s)+g(t)$에는 선형이 아닌 기괴한 해도 있으므로 4단계가 꼭 필요합니다. 수업 필기의 가법성(3.1절)은 “$h=-\log p$이면 가법적”이라는 방향이고, 이 정리는 그 역 “가법적이고 연속이면 로그뿐”입니다.` },
  { ch: 'ch03', id: 'cemle', title: '교차 엔트로피 최소화 = 최대가능도 = KL 최소화',
    tags: 'cross entropy maximum likelihood empirical distribution KL divergence negative log likelihood classification loss forward KL 교차 엔트로피 최대가능도 경험분포 KL 발산 음의 로그가능도 분류 손실',
    stmt: R`(a) 이산 자료 $x_1,\dots,x_N$의 경험분포를 $\hat p(x)=\frac1N\#\{i:x_i=x\}$, 모델 분포를 $q_\theta$라 하면
$$\begin{aligned}-\frac1N\sum_{i=1}^N\log q_\theta(x_i)&=H_{\hat p}(q_\theta)\\&=H(\hat p)+\KL(\hat p\Vert q_\theta)\end{aligned}$$
이다. $H(\hat p)$는 $\theta$와 무관하므로 가능도를 최대로 하는 $\theta$, 교차 엔트로피를 최소로 하는 $\theta$, $\KL(\hat p\Vert q_\theta)$를 최소로 하는 $\theta$는 모두 같다.

(b) 분류 자료 $(x_i,y_i)$와 모델 $q_\theta(y\mid x)$에서 $\hat p(x)$를 입력의 경험분포, $\hat p(y\mid x)$를 입력이 $x$인 표본들의 레이블 경험분포라 하면
$$\begin{aligned}&-\frac1N\sum_{i=1}^N\log q_\theta(y_i\mid x_i)\\&=\sum_x\hat p(x)\,H_{\hat p(\cdot\mid x)}\big(q_\theta(\cdot\mid x)\big)\end{aligned}$$
이다.`,
    body: R`
**1. 같은 값끼리 묶기.** 합 $\sum_{i=1}^N\log q_\theta(x_i)$에서 값이 $x$인 항은 $N\hat p(x)$개이고 모두 $\log q_\theta(x)$입니다. 따라서
$$\begin{aligned}-\frac1N\sum_{i=1}^N\log q_\theta(x_i)&=-\sum_x\hat p(x)\log q_\theta(x)\\&=H_{\hat p}(q_\theta)\end{aligned}$$
이고, 오른쪽 합은 $\hat p(x)>0$인(자료에 나온) $x$에 대해서만 도는 유한합입니다.

**2. 엔트로피와 KL로 나누기.** 3.5절의 항등식(교차 엔트로피 = 엔트로피 + KL)을 $p=\hat p$, $q=q_\theta$에 쓰면 $H_{\hat p}(q_\theta)=H(\hat p)+\KL(\hat p\Vert q_\theta)$입니다. 어떤 자료점에서 $q_\theta(x_i)=0$이면 양변이 모두 $+\infty$입니다.

**3. 최적점이 같다.** 가능도 $L(\theta)=\prod_iq_\theta(x_i)$에 대해 $-\frac1N\log L(\theta)$가 1단계의 좌변입니다. $\log$는 증가함수이고 $-\frac1N<0$이므로 $L$의 최대점은 좌변의 최소점입니다. 2단계에서 좌변은 $\theta$와 무관한 상수 $H(\hat p)$에 $\KL(\hat p\Vert q_\theta)$를 더한 것이므로 최소점이 같습니다. 최적점이 여러 개여도 세 문제의 해 집합이 같습니다.

**4. 조건부 모델.** 입력이 $x$이고 레이블이 $y$인 표본의 수는 $N\hat p(x)\hat p(y\mid x)$이므로, 1단계처럼 묶으면
$$\begin{aligned}&-\frac1N\sum_i\log q_\theta(y_i\mid x_i)\\&=-\sum_x\hat p(x)\sum_y\hat p(y\mid x)\log q_\theta(y\mid x)\\&=\sum_x\hat p(x)\,H_{\hat p(\cdot\mid x)}\big(q_\theta(\cdot\mid x)\big)\end{aligned}$$
각 $x$마다 2단계를 쓰면 $H(\hat p(\cdot\mid x))+\KL\big(\hat p(\cdot\mid x)\Vert q_\theta(\cdot\mid x)\big)$이고 앞의 엔트로피는 $\theta$와 무관하므로, 평균 교차 엔트로피 손실의 최소화는 입력별 KL의 가중평균 최소화, 곧 조건부 최대가능도와 같습니다. 입력이 모두 다르면 $\hat p(\cdot\mid x_i)$는 $y_i$에 확률 1을 주는 원-핫 분포라 엔트로피가 0이고, 손실은 표본마다의 $-\log q_\theta(y_i\mid x_i)$의 평균입니다.`,
    note: R`이 결과 때문에 분류 신경망의 “교차 엔트로피 손실”, “음의 로그가능도”, “KL 최소화”는 같은 학습을 가리킵니다(5·6단원의 손실). 방향에 주의하세요: 최대가능도가 줄이는 것은 $\KL(\hat p\Vert q_\theta)$ (자료 기준, 전방 KL)이지 $\KL(q_\theta\Vert\hat p)$가 아닙니다. 후자는 $q_\theta$가 자료에 없는 값에 확률을 조금만 줘도 $+\infty$가 됩니다. 2.4절의 “$\frac1n\ell(\theta)$의 최대화 = KL 최소화”가 (a)입니다.` },

  // ───── 04
  { ch: 'ch04', id: 'sse', title: '잔차제곱합의 기댓값과 잡음 분산의 불편추정량',
    tags: 'residual sum of squares expectation unbiased noise variance estimator degrees of freedom n-k-1 trace hat matrix MLE bias 잔차제곱합 기댓값 불편추정량 잡음 분산 자유도 대각합 모자 행렬 편향',
    stmt: R`$y=X\beta+\varepsilon$에서 $X\in\mathbb R^{n\times p}$ ($p=k+1<n$)는 고정되어 있고 열이 일차독립이며, $\E\varepsilon=0$, $\Cov(\varepsilon)=\sigma^2I_n$ (즉 $\E[\varepsilon_i\varepsilon_j]=\sigma^2\delta_{ij}$)이라 하자. $\hat\beta=(X^TX)^{-1}X^Ty$, $\mathrm{SSE}=\lVert y-X\hat\beta\rVert^2$이면
$$\E[\mathrm{SSE}]=(n-p)\sigma^2$$
이다. 따라서 $\hat\sigma^2_{\text{MLE}}=\mathrm{SSE}/n$은 $\E\hat\sigma^2_{\text{MLE}}=\frac{n-p}n\sigma^2$로 편향되어 있고, $\mathrm{SSE}/(n-k-1)$이 $\sigma^2$의 불편추정량이다. 정규분포 가정은 필요 없다.`,
    body: R`
**1. 잔차는 잡음의 사영.** $H=X(X^TX)^{-1}X^T$라 하면 $X\hat\beta=Hy$이고 $HX=X$입니다. $(I-H)X=X-X=0$이므로
$$r=y-Hy=(I-H)(X\beta+\varepsilon)=(I-H)\varepsilon$$
입니다. 잔차는 참값 $\beta$와 무관하고 잡음만으로 정해집니다.

**2. 이차형식.** $H$는 대칭이고 $H^2=H$이므로(1.3절, 잔차의 직교성과 정사영) $I-H$도 대칭이고 $(I-H)^2=I-2H+H^2=I-H$입니다. 따라서
$$\begin{aligned}\mathrm{SSE}=r^Tr&=\varepsilon^T(I-H)^T(I-H)\varepsilon\\&=\varepsilon^T(I-H)\varepsilon.\end{aligned}$$
**3. 이차형식의 기댓값.** 고정된 행렬 $A\in\mathbb R^{n\times n}$에 대해 기댓값의 선형성과 $\E[\varepsilon_i\varepsilon_j]=\sigma^2\delta_{ij}$로
$$\begin{aligned}\E[\varepsilon^TA\varepsilon]&=\sum_{i,j}A_{ij}\E[\varepsilon_i\varepsilon_j]\\&=\sigma^2\sum_iA_{ii}=\sigma^2\tr A.\end{aligned}$$
**4. 대각합.** $\tr(AB)=\tr(BA)$를 쓰면
$$\begin{aligned}\tr H&=\tr\big(X(X^TX)^{-1}X^T\big)\\&=\tr\big((X^TX)^{-1}X^TX\big)=\tr I_p=p\end{aligned}$$
이므로 $\tr(I-H)=n-p$이고, 3단계를 $A=I-H$에 쓰면 $\E[\mathrm{SSE}]=(n-p)\sigma^2$입니다.

**5. 추정량.** $n$으로 나누면 $\E\hat\sigma^2_{\text{MLE}}=\frac{n-p}n\sigma^2<\sigma^2$, $n-p=n-k-1$로 나누면 기댓값이 정확히 $\sigma^2$입니다. 잡음에 대해 쓴 가정은 $\E[\varepsilon\varepsilon^T]=\sigma^2I$ (3단계)뿐이고 정규분포는 필요 없습니다.`,
    note: R`4.1절 예제 1(점 4개, 모수 2개, $\mathrm{SSE}=0.70$)의 불편추정량 $0.70/(4-2)=0.35$가 이 결과입니다. $X=\mathbf 1$ (열 하나, $p=1$)이면 $\hat\beta=\bar y$, $\mathrm{SSE}=\sum_i(y_i-\bar y)^2$이라 2.4절의 $\E\hat\sigma^2=\frac{n-1}n\sigma^2$이 됩니다. 직관적으로, 모수 $p$개를 자료에 맞추면 잔차가 $n-p$차원 공간($X$의 열공간의 직교여공간)에 갇혀 잡음 $n$개 방향 중 $p$개 방향의 몫이 잔차에서 사라집니다.` },
  { ch: 'ch04', id: 'polyfit', title: '다항회귀의 해가 유일할 조건과 훈련오차 0 (방데르몽드 행렬)', keys: ['다항회귀와 일반화 오차'],
    tags: 'polynomial regression Vandermonde matrix interpolation full rank linear independence unique least squares training error zero overfitting 다항회귀 방데르몽드 행렬 보간 일차독립 유일 최소제곱 훈련오차 과적합',
    stmt: R`$x_1,\dots,x_n\in\mathbb R$이고 $X\in\mathbb R^{n\times(M+1)}$의 $i$행이 $(1,x_i,x_i^2,\dots,x_i^M)$이라 하자.

(i) $x_i$들 중 서로 다른 값이 $M+1$개 이상이면 $X$의 열은 일차독립이고, 따라서 $X^TX$가 가역이며 다항회귀의 최소제곱해 $\hat\beta=(X^TX)^{-1}X^Ty$는 유일하다. 서로 다른 값이 $M$개 이하이면 열은 일차종속이다.

(ii) $x_i$가 모두 다르고 $M=n-1$이면 $X$는 가역인 정사각행렬이고, $\hat\beta=X^{-1}y$의 다항식은 모든 점 $(x_i,y_i)$를 지나 훈련오차가 0이다.`,
    body: R`
**1. 열의 결합 = 다항식의 값.** $v=(v_0,\dots,v_M)^T$에 대해 $P_v(t)=v_0+v_1t+\dots+v_Mt^M$으로 두면 $(Xv)_i=\sum_jx_i^jv_j=P_v(x_i)$입니다. 즉 $Xv=0$은 “다항식 $P_v$가 모든 $x_i$에서 0”이라는 뜻입니다.

**2. 근의 개수.** 0이 아닌 다항식의 차수가 $M$ 이하이면 서로 다른 근은 많아야 $M$개입니다. 인수정리에서 $z_1,\dots,z_r$이 서로 다른 근이면 $(t-z_1)\cdots(t-z_r)$이 $P_v$를 나누므로 $r\le\deg P_v\le M$이기 때문입니다.

**3. (i) 일차독립.** 서로 다른 값이 $M+1$개 이상인데 $Xv=0$이면 $P_v$는 서로 다른 근을 $M+1$개 이상 가지므로, 2단계에서 $P_v$는 0인 다항식, 즉 $v=0$입니다. 따라서 열이 일차독립이고, 1.3절의 논증대로 $X^TXv=0\Rightarrow\lVert Xv\rVert^2=v^TX^TXv=0\Rightarrow v=0$이라 $X^TX$가 가역이며 최소제곱해가 유일합니다.

**4. (i) 일차종속.** 서로 다른 값이 $z_1,\dots,z_r$ ($r\le M$)뿐이면 다항식 $(t-z_1)\cdots(t-z_r)$의 계수를 $v$로 잡습니다(차수 $r\le M$이라 $v\in\mathbb R^{M+1}$, 최고차항 계수가 1이라 $v\ne0$). 모든 $x_i$가 어떤 $z_l$과 같으므로 $P_v(x_i)=0$, 즉 $Xv=0$입니다.

**5. (ii) 보간.** $x_i$가 모두 다르면 서로 다른 값이 $n=M+1$개라 (i)에서 정사각행렬 $X$의 열이 일차독립, 즉 $X$는 가역입니다. 그러면 $X\beta=y$가 $\beta=X^{-1}y$로 정확히 풀리고 잔차가 0이므로 $f(X^{-1}y)=0$이 최솟값입니다. 정규방정식의 해도 $(X^TX)^{-1}X^Ty=X^{-1}(X^T)^{-1}X^Ty=X^{-1}y$로 같습니다.`,
    note: R`슬라이드의 $M=9$, $n=10$ 실험에서 훈련 MSE가 $1.4\times10^{-22}$ (반올림 오차 수준)인 것이 (ii)입니다. 잡음까지 그대로 지나가므로 훈련오차 0은 좋은 모델의 증거가 아닙니다. 반대로 같은 $x$에서 여러 번 측정해 서로 다른 값이 $M$개 이하이면 (i)에서 $X^TX$가 특이해져 해가 무수히 많고, 이때는 릿지($\lambda>0$)가 유일한 해를 줍니다(4.3절). 정사각 방데르몽드 행렬의 행렬식이 $\prod_{i<j}(x_j-x_i)$라는 공식으로도 (ii)를 보일 수 있습니다.` },
  { ch: 'ch04', id: 'biasvar3', title: '기대 예측 오차 = 잡음 + 편향² + 분산', keys: ['다항회귀와 일반화 오차'],
    tags: 'bias variance tradeoff decomposition expected prediction error irreducible noise generalization overfitting underfitting test error 편향 분산 절충 분해 기대 예측 오차 줄일 수 없는 잡음 일반화 과적합 과소적합',
    stmt: R`입력 $x$를 고정하고 새 관측을 $Y=f(x)+\varepsilon$ ($\E\varepsilon=0$, $\Var\varepsilon=\sigma^2$)이라 하자. 예측값 $\hat f_D(x)$는 훈련 자료 $D$로 정해지는 (분산이 유한한) 확률변수이고 $\varepsilon$은 $D$와 독립이다. 그러면 $D$와 $\varepsilon$ 모두에 대한 기댓값으로
$$\begin{aligned}\E\big[(Y-\hat f_D(x))^2\big]&=\sigma^2\\&\quad+\big(\E_D\hat f_D(x)-f(x)\big)^2\\&\quad+\Var_D\big(\hat f_D(x)\big)\end{aligned}$$
즉 기대 오차 = 잡음 + 편향² + 분산이다.`,
    body: R`
$x$가 고정이므로 $f=f(x)$는 상수이고, $\hat f=\hat f_D(x)$, $\mu=\E_D\hat f$로 줄여 씁니다.

**1. 잡음 떼어 내기.** $Y-\hat f=\varepsilon+(f-\hat f)$이므로
$$(Y-\hat f)^2=\varepsilon^2+2\varepsilon(f-\hat f)+(f-\hat f)^2$$
이고, 기댓값의 선형성으로 세 항을 따로 계산합니다. 첫 항은 $\E\varepsilon^2=\Var\varepsilon+(\E\varepsilon)^2=\sigma^2$.

**2. 교차항.** $f-\hat f$는 $D$만의 함수이고 $\varepsilon$은 $D$와 독립이므로 곱의 기댓값이 기댓값의 곱입니다(2.3절): $\E[\varepsilon(f-\hat f)]=\E\varepsilon\cdot\E(f-\hat f)=0$. 여기서 독립성과 $\E\varepsilon=0$이 쓰입니다.

**3. 편향과 분산.** 마지막 항은 $\hat f$를 $f$의 추정량으로 본 평균제곱오차입니다. $f-\hat f=(f-\mu)+(\mu-\hat f)$로 쪼개면 $f-\mu$는 상수이고 $\E(\mu-\hat f)=0$이므로
$$\begin{aligned}\E(f-\hat f)^2&=(f-\mu)^2+2(f-\mu)\,\E(\mu-\hat f)\\&\quad+\E(\mu-\hat f)^2\\&=(\mu-f)^2+\Var\hat f\end{aligned}$$
입니다(2.8절 편향-분산 분해와 같은 계산).

**4. 합치기.** 세 결과를 더하면 $\E(Y-\hat f)^2=\sigma^2+(\mu-f)^2+\Var\hat f$입니다.`,
    note: R`첫 항 $\sigma^2$은 $\hat f$와 무관해서 어떤 모델로도 줄일 수 없는 오차입니다. 다항회귀에서 차수 $M$을 올리면 평균 예측 $\mu$가 $f$에 가까워져 편향²이 줄지만, 자료가 바뀔 때 예측이 크게 흔들려 분산이 커집니다(4.2절의 $M=9$). 그래서 검증 오차가 U자 모양이 되고 그 바닥의 $M$을 고릅니다. 이 분해는 고정된 한 점 $x$에서의 식이고, 입력에 대해 다시 평균하면 전체 일반화 오차가 됩니다. 2단계의 독립성이 깨지면(새 관측이 훈련 자료에 들어 있으면) 교차항이 남고, 그래서 훈련오차는 기대 오차를 과소평가합니다.` },
  { ch: 'ch04', id: 'softthresh', title: '라쏘의 연성 임계값과 릿지의 축소 (1차원)',
    tags: 'lasso soft thresholding L1 regularization sparsity ridge shrinkage one dimensional variable selection 라쏘 연성 임계값 L1 규제 희소성 릿지 축소 1차원 변수 선택',
    stmt: R`$z\in\mathbb R$, $\lambda>0$이라 하자.

(i) $g(\beta)=\frac12(\beta-z)^2+\lambda\lvert\beta\rvert$의 최소점은 하나뿐이고
$$\hat\beta=\sign(z)\max(\lvert z\rvert-\lambda,\,0)$$
(연성 임계값)이다. 특히 $\lvert z\rvert\le\lambda$이면 $\hat\beta=0$이다.

(ii) $h(\beta)=\frac12(\beta-z)^2+\frac\lambda2\beta^2$의 최소점은 하나뿐이고 $\hat\beta=\frac z{1+\lambda}$이며, $z\ne0$이면 $\hat\beta\ne0$이다.`,
    body: R`
$g$의 $\lvert\beta\rvert$는 0에서 미분할 수 없으므로 미분 대신 $g$의 값을 직접 비교합니다. $z$를 밝혀 쓸 때는 $g_z$라 적습니다.

**1. $\lvert z\rvert\le\lambda$인 경우.** $g(\beta)-g(0)=\frac12(\beta-z)^2-\frac12z^2+\lambda\lvert\beta\rvert$를 전개하고 $-\beta z\ge-\lvert\beta\rvert\lvert z\rvert$를 쓰면
$$\begin{aligned}g(\beta)-g(0)&=\tfrac12\beta^2-\beta z+\lambda\lvert\beta\rvert\\&\ge\tfrac12\beta^2+\lvert\beta\rvert(\lambda-\lvert z\rvert)\ge\tfrac12\beta^2\end{aligned}$$
이고, $\beta\ne0$이면 마지막 값이 양수입니다. 따라서 $\beta=0$이 유일한 최소점입니다.

**2. $z>\lambda$인 경우.** $b=z-\lambda>0$으로 두면 $g(b)=\frac12\lambda^2+\lambda(z-\lambda)$입니다. 임의의 $\beta$에 대해 $\beta-z=(\beta-b)-\lambda$를 넣어 전개하면
$$\begin{aligned}g(\beta)&=\tfrac12(\beta-b)^2-\lambda(\beta-b)+\tfrac12\lambda^2+\lambda\lvert\beta\rvert\\&=g(b)+\tfrac12(\beta-b)^2+\lambda(\lvert\beta\rvert-\beta)\end{aligned}$$
입니다(둘째 줄은 $-\lambda(\beta-b)+\frac12\lambda^2=-\lambda\beta+\lambda(z-\lambda)+\frac12\lambda^2$을 정리한 것). $\lvert\beta\rvert\ge\beta$이므로 $g(\beta)\ge g(b)+\frac12(\beta-b)^2$, 등호는 $\beta=b$일 때뿐입니다. 유일한 최소점은 $\hat\beta=z-\lambda=\sign(z)(\lvert z\rvert-\lambda)$.

**3. $z<-\lambda$인 경우.** $g_z(-\beta)=\frac12(-\beta-z)^2+\lambda\lvert\beta\rvert=\frac12(\beta-(-z))^2+\lambda\lvert\beta\rvert=g_{-z}(\beta)$입니다. $-z>\lambda$이므로 2단계에서 $g_{-z}$의 유일한 최소점은 $-z-\lambda$이고, 따라서 $g_z$의 유일한 최소점은 $-(-z-\lambda)=z+\lambda=\sign(z)(\lvert z\rvert-\lambda)$입니다.

**4. 한 식으로.** 세 경우를 모으면 $\hat\beta=\sign(z)\max(\lvert z\rvert-\lambda,0)$입니다($\lvert z\rvert\le\lambda$이면 $\max$가 0).

**5. (ii) 릿지.** 완전제곱하면
$$h(\beta)=\frac{1+\lambda}2\Big(\beta-\frac z{1+\lambda}\Big)^2+\frac{\lambda z^2}{2(1+\lambda)}$$
이고 $\frac{1+\lambda}2>0$이므로 유일한 최소점은 $\frac z{1+\lambda}$입니다. $z$를 $\frac1{1+\lambda}$배로 줄일 뿐이라 $z\ne0$이면 0이 되지 않습니다.`,
    note: R`직교 설계 $X^TX=I$이면 $\frac12\lVert y-X\beta\rVert^2=\frac12\lVert\beta-X^Ty\rVert^2+$($\beta$와 무관한 상수)라서 라쏘가 좌표마다 이 1차원 문제로 갈라지고, $z_j=(X^Ty)_j$에 연성 임계값을 쓴 것이 해입니다. 작은 $\lvert z_j\rvert$는 정확히 0이 되어 변수가 선택되고(희소성), 릿지는 모든 계수를 같은 비율로 줄이기만 합니다. 4.3절의 정의 $J=\frac12f+\frac\lambda2\sum_j\lvert\beta_j\rvert$와 비교하면 여기의 $\lambda$는 그 $\frac\lambda2$에 해당합니다(이름만 다름).` },
  { ch: 'ch04', id: 'gausskernel', title: '커널을 만드는 규칙과 가우시안 커널의 타당성', keys: ['커널 트릭', '커널의 예'],
    tags: 'Gaussian kernel RBF valid kernel positive semidefinite Gram matrix closure rules Schur product Hadamard exponential series Mercer normalized kernel 가우시안 커널 타당한 커널 그람 행렬 양의 준정부호 닫힘 규칙 슈어 곱 지수 급수 머서 정규화 커널',
    stmt: R`대칭함수 $K(x,z)=K(z,x)$가 모든 유한 자료 $x_1,\dots,x_n$에서 그람 행렬 $[K(x_i,x_j)]$이 양의 준정부호일 때 $K$를 커널이라 하자(4.6절의 판정 기준). $K_1,K_2$가 커널, $c>0$, $f:\mathbb R^d\to\mathbb R$가 임의의 함수이면 (a) $K_1+K_2$와 $cK_1$, (b) $K_1K_2$, (c) $f(x)K_1(x,z)f(z)$, (d) 커널들의 점별 극한도 커널이다.

따라서 $(x^Tz)^m$ ($m=0,1,2,\dots$), $e^{x^Tz/\sigma^2}$, 가우시안 커널 $e^{-\lVert x-z\rVert^2/2\sigma^2}$, 그리고 $K_1(x,x)>0$일 때 정규화 커널 $K_1(x,z)K_1(x,x)^{-1/2}K_1(z,z)^{-1/2}$이 모두 커널이다.`,
    body: R`
대칭성은 각 경우의 정의에서 바로 나오므로 그람 행렬의 준정부호성만 보입니다. 자료 $x_1,\dots,x_n$을 고정하고 $A=[K_1(x_i,x_j)]$, $B=[K_2(x_i,x_j)]$ (둘 다 양의 준정부호), 임의의 $u\in\mathbb R^n$을 잡습니다.

**(a) 합과 양수배.** $u^T(A+B)u=u^TAu+u^TBu\ge0$이고 $u^T(cA)u=c\,u^TAu\ge0$.

**(b) 곱 (슈어 곱).** $K_1K_2$의 그람 행렬은 성분별 곱 $A\circ B$, $(A\circ B)_{ij}=A_{ij}B_{ij}$입니다. $B$는 대칭 양의 준정부호라 직교 고유벡터 $w_1,\dots,w_n$과 고윳값 $\mu_l\ge0$으로 $B_{ij}=\sum_l\mu_lw_{l,i}w_{l,j}$라 쓸 수 있습니다. 그러면
$$\begin{aligned}u^T(A\circ B)u&=\sum_l\mu_l\sum_{i,j}(u_iw_{l,i})A_{ij}(u_jw_{l,j})\\&=\sum_l\mu_l\,v_l^TAv_l\ \ge0\end{aligned}$$
입니다. 여기서 $v_l=(u_1w_{l,1},\dots,u_nw_{l,n})^T$이고, $\mu_l\ge0$, $v_l^TAv_l\ge0$이기 때문입니다.

**(c) 양쪽에 같은 함수 곱하기.** 그람 행렬은 $DAD$, $D=\diag(f(x_1),\dots,f(x_n))$이고 $u^TDADu=(Du)^TA(Du)\ge0$.

**(d) 극한.** 커널 $K^{(N)}$이 각 점에서 $K$로 수렴하면 그람 행렬 $G^{(N)}$도 성분마다 $G$로 수렴하므로 $u^TG^{(N)}u\to u^TGu$. 음이 아닌 수의 극한은 음이 아니므로 $u^TGu\ge0$.

**1. 거듭제곱.** 선형 커널 $x^Tz$의 그람 행렬은 $u^TGu=\lVert\sum_iu_ix_i\rVert^2\ge0$, 상수 1의 그람 행렬은 $u^TGu=(\sum_iu_i)^2\ge0$이라 둘 다 커널입니다. (b)를 되풀이하면 $(x^Tz)^m$이 모두 커널입니다.

**2. 지수 급수.** 부분합 $S_N(x,z)=\sum_{m=0}^N\frac{(x^Tz)^m}{\sigma^{2m}m!}$은 (a)에서 커널이고, 지수함수의 테일러 급수는 모든 실수에서 수렴하므로 $S_N\to e^{x^Tz/\sigma^2}$. (d)에서 $e^{x^Tz/\sigma^2}$은 커널입니다.

**3. 가우시안 커널.** $\lVert x-z\rVert^2=\lVert x\rVert^2-2x^Tz+\lVert z\rVert^2$이므로 $f(x)=e^{-\lVert x\rVert^2/2\sigma^2}$로 두면
$$e^{-\lVert x-z\rVert^2/2\sigma^2}=f(x)\,e^{x^Tz/\sigma^2}f(z)$$
입니다. (c)와 2단계에서 가우시안 커널은 커널입니다. 정규화 커널은 (c)에서 $f(x)=K_1(x,x)^{-1/2}$로 둔 것입니다.`,
    note: R`판정 기준 “모든 그람 행렬이 양의 준정부호인 대칭함수는 어떤 특성공간의 내적”은 머서 정리로 알려져 있고 여기서는 증명하지 않습니다. 이 증명은 가우시안 커널이 그 기준을 만족함을 보인 것입니다. 2단계의 급수에는 모든 차수 $m$의 다항 특성이 들어가므로 가우시안 커널의 특성공간은 무한차원입니다. 커널이 아닌 예: $K(x,z)=x^Tz-1$은 $x_1=0$ 하나만 잡아도 그람 행렬이 $[-1]$이라 준정부호가 아닙니다. (a)와 (b)로 $(x^Tz+1)^2$ (4.6절)도 커널임을 바로 알 수 있습니다.` },
  );

  // roadmaps (본문 600자 이상)
  Object.assign(EM.plans, {
    'ch01-simplels': {
      easy: R`두 가지를 보입니다. 절편이 있으면 정규방정식의 첫 줄이 곧 “잔차의 합이 0”이라서 적합된 직선이 무게중심을 지난다는 것, 그리고 단순회귀에서는 정규방정식이 미지수 두 개의 연립방정식이라 손으로 풀린다는 것입니다.

요령은 첫 식으로 절편을 $\beta_0=\bar y-\beta_1\bar x$로 없애고, 남은 식의 합들을 평균에서의 편차로 바꿔 쓰는 것입니다. 그러면 $\beta_1S_{xx}=S_{xy}$라는 깔끔한 식이 나오고, $S_{xx}>0$이 해의 유일성을 보장합니다.`,
      easyEn: R`Two things are shown. With an intercept, the first row of the normal equations says exactly “the residuals sum to zero”, so the fitted line passes through the centroid; and in simple regression the normal equations are two equations in two unknowns that can be solved by hand.

The trick is to eliminate the intercept with the first equation, $\beta_0=\bar y-\beta_1\bar x$, and to rewrite the remaining sums as deviations from the means. This gives the clean equation $\beta_1S_{xx}=S_{xy}$, and $S_{xx}>0$ guarantees that the solution is unique.`,
      nodes: [
        { id: 'a', at: '**(a) 정규방정식의 첫 줄.**', g: R`(a) 무게중심`, gEn: R`(a) The centroid`, t: R`첫 열과의 내적`, en: R`Inner product with the first column`,
          d: R`정규방정식의 첫 성분은 잔차와 $\mathbf 1$의 내적이 0이라는 식입니다. $n$으로 나누면 $\hat\beta_0=\bar y-\sum_j\hat\beta_j\bar x_j$, 곧 무게중심을 지납니다.`,
          dEn: R`The first component of the normal equations says that the residual has zero inner product with $\mathbf 1$. Dividing by $n$ gives $\hat\beta_0=\bar y-\sum_j\hat\beta_j\bar x_j$: the fit passes through the centroid.` },
        { id: 'two', at: '**(b) 1. 두 식.**', g: R`(b) 단순회귀 공식`, gEn: R`(b) The simple-regression formula`, t: R`두 개의 식`, en: R`Two equations`,
          d: R`$k=1$이면 정규방정식은 $\beta_0,\beta_1$에 대한 연립일차방정식 두 개입니다.`,
          dEn: R`For $k=1$ the normal equations are two linear equations in $\beta_0,\beta_1$.` },
        { id: 'elim', at: '**2. 절편 소거.**', t: R`절편 없애기`, en: R`Eliminate the intercept`,
          d: R`첫 식에서 $\beta_0=\bar y-\beta_1\bar x$를 얻어 둘째 식에 넣으면 $\beta_1$만 남습니다.`,
          dEn: R`The first equation gives $\beta_0=\bar y-\beta_1\bar x$; substituting it into the second leaves only $\beta_1$.` },
        { id: 'dev', at: '**3. 편차 형태로.**', t: R`편차의 합으로`, en: R`Rewrite as deviations`,
          d: R`$\sum x_i^2-n\bar x^2=S_{xx}$, $\sum x_iy_i-n\bar x\bar y=S_{xy}$임을 전개로 확인하면 식이 $\beta_1S_{xx}=S_{xy}$가 됩니다.`,
          dEn: R`Expanding shows $\sum x_i^2-n\bar x^2=S_{xx}$ and $\sum x_iy_i-n\bar x\bar y=S_{xy}$, so the equation becomes $\beta_1S_{xx}=S_{xy}$.` },
        { id: 'uniq', at: '**4. 유일성.**', t: R`해가 하나뿐`, en: R`Only one solution`,
          d: R`$S_{xx}>0$이면 $\beta_1$, 이어서 $\beta_0$이 하나로 정해집니다. 이 조건은 두 열 $\mathbf 1$, $x$가 일차독립이라는 것과 같습니다.`,
          dEn: R`If $S_{xx}>0$, then $\beta_1$ and hence $\beta_0$ are determined uniquely. The condition is the same as the two columns $\mathbf 1$ and $x$ being linearly independent.` },
      ],
    },
    'ch01-rsquared': {
      easy: R`결정계수가 0과 1 사이라는 것은 “전체 흩어짐 = 남은 오차 + 설명된 흩어짐”이라는 분해에서 바로 나옵니다. 그 분해는 피타고라스 정리입니다: $y-\bar y\mathbf 1$을 잔차 $r$과 $\hat y-\bar y\mathbf 1$로 나누면 두 조각이 직교하기 때문입니다.

직교성의 근거는 정규방정식(잔차가 $X$의 모든 열과 직교)이고, 절편 열 $\mathbf 1$이 있다는 가정이 여기서 꼭 필요합니다. 분해가 되면 두 비가 모두 음이 아니고 합이 1이라 범위와 등호 조건이 따라 나옵니다.`,
      easyEn: R`That the coefficient of determination lies between 0 and 1 follows directly from the decomposition “total spread = remaining error + explained spread”. That decomposition is Pythagoras: splitting $y-\bar y\mathbf 1$ into the residual $r$ and $\hat y-\bar y\mathbf 1$ gives two orthogonal pieces.

The orthogonality comes from the normal equations (the residual is orthogonal to every column of $X$), and the assumption that the intercept column $\mathbf 1$ is present is essential here. Once the decomposition holds, both ratios are nonnegative and sum to 1, which gives the range and the equality cases.`,
      nodes: [
        { id: 'sum', at: '**1. 잔차의 합은 0.**', t: R`잔차의 합 = 0`, en: R`Residuals sum to 0`,
          d: R`정규방정식 $X^Tr=0$의 첫 성분($\mathbf 1$과의 내적)에서 $\sum r_i=0$, 그래서 적합값의 평균도 $\bar y$입니다.`,
          dEn: R`The first component of the normal equations $X^Tr=0$ (the inner product with $\mathbf 1$) gives $\sum r_i=0$, so the fitted values also have mean $\bar y$.` },
        { id: 'orth', at: '**2. 잔차는 적합값과도 직교.**', t: R`교차항이 0`, en: R`The cross term vanishes`,
          d: R`$\hat y$는 $X$의 열들의 결합이라 $\hat y^Tr=0$. 1단계와 합치면 $\sum(\hat y_i-\bar y)r_i=0$입니다.`,
          dEn: R`$\hat y$ is a combination of the columns of $X$, so $\hat y^Tr=0$. Together with step 1, $\sum(\hat y_i-\bar y)r_i=0$.` },
        { id: 'exp', at: '**3. 전개.**', t: R`제곱합 분해`, en: R`Decompose the sum of squares`,
          d: R`$y_i-\bar y=r_i+(\hat y_i-\bar y)$를 제곱해 더하면 교차항이 사라져 $S_{yy}=\mathrm{SSE}+S_{\hat y\hat y}$.`,
          dEn: R`Squaring $y_i-\bar y=r_i+(\hat y_i-\bar y)$ and summing, the cross term drops out: $S_{yy}=\mathrm{SSE}+S_{\hat y\hat y}$.` },
        { id: 'range', at: '**4. 범위.**', t: R`0 ≤ R² ≤ 1`, en: R`0 ≤ R² ≤ 1`,
          d: R`$S_{yy}$로 나누면 음이 아닌 두 비의 합이 1이므로 $R^2=S_{\hat y\hat y}/S_{yy}$는 0과 1 사이입니다.`,
          dEn: R`Dividing by $S_{yy}$, two nonnegative ratios add up to 1, so $R^2=S_{\hat y\hat y}/S_{yy}$ lies between 0 and 1.` },
        { id: 'eq', at: '**5. 등호.**', t: R`등호 조건`, en: R`Equality cases`,
          d: R`$R^2=1$은 잔차가 모두 0, $R^2=0$은 적합값이 모두 $\bar y$ (기준선과 같음)일 때입니다.`,
          dEn: R`$R^2=1$ exactly when all residuals are 0, and $R^2=0$ exactly when all fitted values equal $\bar y$ (the same as the baseline).` },
      ],
    },
    'ch02-varbias': {
      easy: R`표본평균 $\bar X$에서 잰 제곱합은 참평균 $\mu$에서 잰 제곱합보다 정확히 $n(\bar X-\mu)^2$만큼 작습니다. 이 항등식 하나가 핵심입니다.

기댓값을 취하면 참평균 기준의 제곱합은 $n\sigma^2$, 빠지는 몫은 $n\Var\bar X=\sigma^2$이라 $(n-1)\sigma^2$이 남습니다. 그래서 $n$으로 나누면 작게 나오고 $n-1$로 나누면 맞습니다.`,
      easyEn: R`The sum of squares measured from the sample mean $\bar X$ is smaller than the one measured from the true mean $\mu$ by exactly $n(\bar X-\mu)^2$. This single identity is the key.

Taking expectations, the sum measured from the true mean is $n\sigma^2$ and the part that drops out is $n\Var\bar X=\sigma^2$, leaving $(n-1)\sigma^2$. So dividing by $n$ comes out too small, and dividing by $n-1$ is exactly right.`,
      nodes: [
        { id: 'split', at: '**1. 참평균 기준으로 다시 쓰기.**', t: R`참평균 기준의 항등식`, en: R`An identity around the true mean`,
          d: R`$X_i-\bar X=(X_i-\mu)-(\bar X-\mu)$로 쪼개 전개하면 $\sum(X_i-\bar X)^2=\sum(X_i-\mu)^2-n(\bar X-\mu)^2$.`,
          dEn: R`Splitting $X_i-\bar X=(X_i-\mu)-(\bar X-\mu)$ and expanding gives $\sum(X_i-\bar X)^2=\sum(X_i-\mu)^2-n(\bar X-\mu)^2$.` },
        { id: 'exp', at: '**2. 기댓값.**', t: R`기댓값 계산`, en: R`Take expectations`,
          d: R`첫 합의 기댓값은 $n\sigma^2$, 둘째 항은 $n\Var\bar X=\sigma^2$이라 $(n-1)\sigma^2$이 남습니다.`,
          dEn: R`The first sum has expectation $n\sigma^2$, the second term $n\Var\bar X=\sigma^2$, leaving $(n-1)\sigma^2$.` },
        { id: 'conc', at: '**3. 결론.**', t: R`n과 n−1`, en: R`n versus n−1`,
          d: R`$n$으로 나누면 편향 $-\sigma^2/n$, $n-1$로 나누면 불편입니다. 정규분포 가정은 쓰이지 않았습니다.`,
          dEn: R`Dividing by $n$ gives bias $-\sigma^2/n$; dividing by $n-1$ is unbiased. No normality assumption was used.` },
      ],
    },
    'ch02-betamom': {
      easy: R`베타분포의 $m$차 모멘트는 정의에서 곧바로 두 베타함수의 비 $B(a+m,b)/B(a,b)$입니다. 그 비를 계산하는 열쇠는 점화식 $B(a+1,b)=\frac a{a+b}B(a,b)$ 하나이고, 이는 부분적분과 “$1=t+(1-t)$로 쪼개기”에서 나옵니다. 점화식을 $m$번 쓰면 곱 공식이 되고, $m=1,2$에서 평균과 분산이 나옵니다.

두 판매자 비교는 $\Beta(3,1)$의 누적분포가 $t^3$이라는 데서 끝납니다. $\theta_1$을 고정하면 $\theta_2$가 그보다 작을 확률이 $\theta_1^3$이므로, 구하는 확률은 $\theta_1^3$의 평균, 곧 3차 모멘트입니다.`,
      easyEn: R`By definition, the $m$-th moment of a Beta distribution is the ratio of two Beta functions, $B(a+m,b)/B(a,b)$. The key to computing that ratio is the single recursion $B(a+1,b)=\frac a{a+b}B(a,b)$, which comes from integration by parts and from “splitting with $1=t+(1-t)$”. Using the recursion $m$ times gives the product formula, and $m=1,2$ give the mean and the variance.

The comparison of the two sellers ends with the fact that the CDF of $\Beta(3,1)$ is $t^3$. With $\theta_1$ fixed, the probability that $\theta_2$ is smaller is $\theta_1^3$, so the probability we want is the mean of $\theta_1^3$, the third moment.`,
      nodes: [
        { id: 'ratio', at: '**1. 모멘트는 베타함수의 비.**', t: R`모멘트 = 베타함수의 비`, en: R`Moment = ratio of Beta functions`,
          d: R`$\theta^m$을 밀도에 곱하면 지수가 $a+m-1$이 되어 분자가 $B(a+m,b)$입니다.`,
          dEn: R`Multiplying the density by $\theta^m$ raises the exponent to $a+m-1$, so the numerator is $B(a+m,b)$.` },
        { id: 'rec', at: '**2. 점화식.**', t: R`점화식`, en: R`The recursion`,
          d: R`부분적분으로 $B(a+1,b)=\frac abB(a,b+1)$, 쪼개기로 $B(a,b)=B(a+1,b)+B(a,b+1)$. 둘을 합쳐 $B(a+1,b)=\frac a{a+b}B(a,b)$.`,
          dEn: R`Integration by parts gives $B(a+1,b)=\frac abB(a,b+1)$, splitting gives $B(a,b)=B(a+1,b)+B(a,b+1)$; together $B(a+1,b)=\frac a{a+b}B(a,b)$.` },
        { id: 'prod', at: '**3. 곱 공식.**', t: R`곱 공식`, en: R`The product formula`,
          d: R`점화식을 $m$번 쓰면 비들이 연쇄적으로 약분되어 $\prod_j\frac{a+j}{a+b+j}$가 됩니다.`,
          dEn: R`Applying the recursion $m$ times, the ratios telescope into $\prod_j\frac{a+j}{a+b+j}$.` },
        { id: 'mv', at: '**4. 평균과 분산.**', t: R`평균과 분산`, en: R`Mean and variance`,
          d: R`$m=1,2$를 넣고 $\Var\theta=\E\theta^2-(\E\theta)^2$을 통분합니다.`,
          dEn: R`Put $m=1,2$ and bring $\Var\theta=\E\theta^2-(\E\theta)^2$ to a common denominator.` },
        { id: 'sell', at: '**5. 두 판매자.**', t: R`두 판매자 비교`, en: R`Comparing the two sellers`,
          d: R`$\Beta(3,1)$의 누적분포 $t^3$을 써서 $\theta_1$에 조건을 걸면 $P(\theta_1>\theta_2)=\E[\theta_1^3]\approx0.7126$.`,
          dEn: R`Using the CDF $t^3$ of $\Beta(3,1)$ and conditioning on $\theta_1$ gives $P(\theta_1>\theta_2)=\E[\theta_1^3]\approx0.7126$.` },
      ],
    },
    'ch03-logunique': {
      easy: R`곱을 합으로 바꾸는 연속함수는 로그뿐이라는 것을 보입니다. 확률 $p$ 대신 $t=-\log p$를 변수로 쓰면 조건 $h(pq)=h(p)+h(q)$가 덧셈에 대한 코시 방정식 $g(s+t)=g(s)+g(t)$로 바뀝니다.

그 방정식에서 먼저 자연수, 다음 유리수에서 $g(t)=ct$를 얻고, 연속성으로 모든 실수로 넓힙니다. 마지막에 변수를 되돌리면 $h(p)=-c\log p$이고, “드문 사건일수록 정보가 많다”는 단조성이 $c>0$을 정합니다.`,
      easyEn: R`We show that the only continuous functions turning products into sums are logarithms. Using $t=-\log p$ instead of the probability $p$ as the variable, the condition $h(pq)=h(p)+h(q)$ becomes Cauchy's equation for addition, $g(s+t)=g(s)+g(t)$.

From that equation we get $g(t)=ct$ first at natural numbers, then at rationals, and continuity extends it to all reals. Changing the variable back gives $h(p)=-c\log p$, and the monotonicity “rarer events carry more information” fixes $c>0$.`,
      nodes: [
        { id: 'sub', at: '**1. 지수 좌표로 옮기기.**', t: R`곱을 합으로`, en: R`Products into sums`,
          d: R`$g(t)=h(e^{-t})$로 두면 $g$는 연속이고 $g(s+t)=g(s)+g(t)$입니다.`,
          dEn: R`With $g(t)=h(e^{-t})$, $g$ is continuous and $g(s+t)=g(s)+g(t)$.` },
        { id: 'nat', at: '**2. 0과 자연수.**', t: R`0과 자연수`, en: R`Zero and natural numbers`,
          d: R`$g(0)=0$이고 귀납법으로 $g(nt)=n\,g(t)$.`,
          dEn: R`$g(0)=0$, and by induction $g(nt)=n\,g(t)$.` },
        { id: 'rat', at: '**3. 유리수.**', t: R`유리수`, en: R`Rationals`,
          d: R`$n\,g(m/n)=g(m)=m\,g(1)$에서 음이 아닌 유리수 $r$마다 $g(r)=cr$.`,
          dEn: R`From $n\,g(m/n)=g(m)=m\,g(1)$, $g(r)=cr$ for every nonnegative rational $r$.` },
        { id: 'cont', at: '**4. 연속성.**', t: R`연속성으로 확장`, en: R`Extend by continuity`,
          d: R`유리수열 $r_k\to t$를 잡고 연속성을 쓰면 모든 $t\ge0$에서 $g(t)=ct$.`,
          dEn: R`Take rationals $r_k\to t$ and use continuity: $g(t)=ct$ for every $t\ge0$.` },
        { id: 'back', at: '**5. 되돌리기.**', t: R`되돌리기와 c의 부호`, en: R`Change back; the sign of c`,
          d: R`$h(p)=g(-\log p)=-c\log p$. 감소하고 상수가 아니면 $c=h(e^{-1})>h(1)=0$.`,
          dEn: R`$h(p)=g(-\log p)=-c\log p$. If $h$ is decreasing and not constant, $c=h(e^{-1})>h(1)=0$.` },
      ],
    },
    'ch03-cemle': {
      easy: R`평균 음의 로그가능도를 같은 값끼리 묶으면, 각 값이 나온 비율, 곧 경험분포 $\hat p$에 대한 평균이 되어 교차 엔트로피 $H_{\hat p}(q_\theta)$와 똑같은 식이 됩니다. 그러면 3.5절의 “교차 엔트로피 = 엔트로피 + KL”이 바로 쓰입니다.

엔트로피 $H(\hat p)$는 자료만으로 정해져 $\theta$와 무관하므로, 세 목적함수는 상수만큼 차이 나고 최적점이 같습니다. 분류처럼 조건부 모델이면 입력마다 같은 논증을 쓰고 입력의 비율로 평균합니다.`,
      easyEn: R`Grouping the average negative log-likelihood by equal values turns it into an average over the fraction of times each value occurs, that is, over the empirical distribution $\hat p$, which is exactly the cross-entropy $H_{\hat p}(q_\theta)$. Then the identity of Section 3.5, “cross-entropy = entropy + KL”, applies directly.

The entropy $H(\hat p)$ is fixed by the data and does not depend on $\theta$, so the three objectives differ by a constant and have the same optimizers. For a conditional model, as in classification, the same argument is used for each input and averaged with the input frequencies.`,
      nodes: [
        { id: 'group', at: '**1. 같은 값끼리 묶기.**', t: R`경험분포로 묶기`, en: R`Group into the empirical distribution`,
          d: R`값이 $x$인 항이 $N\hat p(x)$개이므로 평균 음의 로그가능도 $=-\sum_x\hat p(x)\log q_\theta(x)=H_{\hat p}(q_\theta)$.`,
          dEn: R`There are $N\hat p(x)$ terms with value $x$, so the average negative log-likelihood is $-\sum_x\hat p(x)\log q_\theta(x)=H_{\hat p}(q_\theta)$.` },
        { id: 'split', at: '**2. 엔트로피와 KL로 나누기.**', t: R`엔트로피 + KL`, en: R`Entropy plus KL`,
          d: R`3.5절의 항등식으로 $H_{\hat p}(q_\theta)=H(\hat p)+\KL(\hat p\Vert q_\theta)$.`,
          dEn: R`By the identity of Section 3.5, $H_{\hat p}(q_\theta)=H(\hat p)+\KL(\hat p\Vert q_\theta)$.` },
        { id: 'same', at: '**3. 최적점이 같다.**', t: R`세 문제의 해가 같다`, en: R`The three problems agree`,
          d: R`$\log$는 증가함수이고 $H(\hat p)$는 $\theta$와 무관하므로 가능도 최대화, 교차 엔트로피 최소화, KL 최소화의 해 집합이 같습니다.`,
          dEn: R`$\log$ is increasing and $H(\hat p)$ does not depend on $\theta$, so maximizing the likelihood, minimizing the cross-entropy and minimizing the KL have the same solution sets.` },
        { id: 'cond', at: '**4. 조건부 모델.**', t: R`조건부 모델 (분류)`, en: R`Conditional models (classification)`,
          d: R`입력별로 같은 계산을 하고 $\hat p(x)$로 평균하면 분류 손실도 입력별 교차 엔트로피의 평균입니다.`,
          dEn: R`Doing the same computation for each input and averaging with $\hat p(x)$ shows that the classification loss is also an average of per-input cross-entropies.` },
      ],
    },
    'ch04-sse': {
      easy: R`잔차를 잡음으로 쓰면 $r=(I-H)\varepsilon$이고, $I-H$가 대칭 멱등이라 잔차제곱합은 이차형식 $\varepsilon^T(I-H)\varepsilon$이 됩니다. 이차형식의 기댓값은 $\sigma^2\times$대각합이라, 모든 것이 $\tr(I-H)$ 계산으로 줄어듭니다.

대각합은 순환 성질 $\tr(AB)=\tr(BA)$로 $n\times n$ 행렬을 $p\times p$ 단위행렬로 바꿔 계산합니다: $\tr H=p$. 그래서 잔차제곱합의 평균은 $(n-p)\sigma^2$이고, $n$이 아니라 $n-p$로 나눠야 불편입니다.`,
      easyEn: R`Writing the residual in terms of the noise gives $r=(I-H)\varepsilon$, and since $I-H$ is symmetric and idempotent, the residual sum of squares is the quadratic form $\varepsilon^T(I-H)\varepsilon$. The expectation of a quadratic form is $\sigma^2$ times the trace, so everything reduces to computing $\tr(I-H)$.

The trace is computed with the cyclic property $\tr(AB)=\tr(BA)$, turning an $n\times n$ matrix into the $p\times p$ identity: $\tr H=p$. So the residual sum of squares has mean $(n-p)\sigma^2$, and one must divide by $n-p$, not $n$, to be unbiased.`,
      nodes: [
        { id: 'proj', at: '**1. 잔차는 잡음의 사영.**', t: R`잔차 = 사영된 잡음`, en: R`Residual = projected noise`,
          d: R`$(I-H)X=0$이므로 $r=(I-H)y=(I-H)\varepsilon$: 참값 $\beta$가 사라집니다.`,
          dEn: R`Since $(I-H)X=0$, $r=(I-H)y=(I-H)\varepsilon$: the true $\beta$ disappears.` },
        { id: 'quad', at: '**2. 이차형식.**', t: R`이차형식으로`, en: R`A quadratic form`,
          d: R`$I-H$가 대칭이고 멱등이라 $\mathrm{SSE}=\varepsilon^T(I-H)\varepsilon$.`,
          dEn: R`$I-H$ is symmetric and idempotent, so $\mathrm{SSE}=\varepsilon^T(I-H)\varepsilon$.` },
        { id: 'trace', at: '**3. 이차형식의 기댓값.**', t: R`기댓값 = σ² × 대각합`, en: R`Expectation = σ² × trace`,
          d: R`$\E[\varepsilon_i\varepsilon_j]=\sigma^2\delta_{ij}$이므로 대각성분만 남아 $\E[\varepsilon^TA\varepsilon]=\sigma^2\tr A$.`,
          dEn: R`Since $\E[\varepsilon_i\varepsilon_j]=\sigma^2\delta_{ij}$, only the diagonal survives: $\E[\varepsilon^TA\varepsilon]=\sigma^2\tr A$.` },
        { id: 'tr', at: '**4. 대각합.**', t: R`tr H = p`, en: R`tr H = p`,
          d: R`$\tr(AB)=\tr(BA)$로 $\tr H=\tr I_p=p$, 따라서 $\E[\mathrm{SSE}]=(n-p)\sigma^2$.`,
          dEn: R`By $\tr(AB)=\tr(BA)$, $\tr H=\tr I_p=p$, hence $\E[\mathrm{SSE}]=(n-p)\sigma^2$.` },
        { id: 'est', at: '**5. 추정량.**', t: R`편향과 보정`, en: R`Bias and correction`,
          d: R`$\mathrm{SSE}/n$은 작게 나오고 $\mathrm{SSE}/(n-k-1)$이 불편입니다.`,
          dEn: R`$\mathrm{SSE}/n$ comes out too small, and $\mathrm{SSE}/(n-k-1)$ is unbiased.` },
      ],
    },
    'ch04-polyfit': {
      easy: R`설계행렬 $X$에 벡터 $v$를 곱하는 것은 계수가 $v$인 다항식을 자료점들에서 계산하는 것과 같습니다. 그래서 “열이 일차독립인가”는 “차수 $M$ 이하의 다항식이 자료점에서 모두 0이 될 수 있는가”라는 질문이 됩니다.

0이 아닌 다항식의 근은 차수보다 많을 수 없으므로, 서로 다른 점이 $M+1$개 이상이면 그런 다항식은 0뿐이고, $M$개 이하이면 그 점들을 근으로 갖는 다항식을 직접 만들 수 있습니다. 점의 수와 계수의 수가 같으면 $X$가 정사각 가역이라 다항식이 모든 점을 정확히 지납니다.`,
      easyEn: R`Multiplying the design matrix $X$ by a vector $v$ is the same as evaluating the polynomial with coefficients $v$ at the data points. So “are the columns linearly independent?” becomes “can a polynomial of degree at most $M$ vanish at all the data points?”.

A nonzero polynomial cannot have more roots than its degree, so with $M+1$ or more distinct points such a polynomial must be zero, and with $M$ or fewer distinct points we can build one that has those points as roots. When the number of points equals the number of coefficients, $X$ is square and invertible, and the polynomial passes exactly through every point.`,
      nodes: [
        { id: 'poly', at: '**1. 열의 결합 = 다항식의 값.**', t: R`행렬 곱 = 다항식의 값`, en: R`Matrix product = polynomial values`,
          d: R`$(Xv)_i=P_v(x_i)$이므로 $Xv=0$은 $P_v$가 모든 자료점에서 0이라는 뜻입니다.`,
          dEn: R`$(Xv)_i=P_v(x_i)$, so $Xv=0$ means that $P_v$ vanishes at every data point.` },
        { id: 'roots', at: '**2. 근의 개수.**', t: R`근은 차수 이하`, en: R`At most degree-many roots`,
          d: R`인수정리로 0이 아닌 차수 $M$ 이하 다항식의 서로 다른 근은 많아야 $M$개입니다.`,
          dEn: R`By the factor theorem a nonzero polynomial of degree at most $M$ has at most $M$ distinct roots.` },
        { id: 'indep', at: '**3. (i) 일차독립.**', g: R`(i) 해의 유일성`, gEn: R`(i) Uniqueness of the fit`, t: R`M+1개 이상이면 독립`, en: R`M+1 or more points: independent`,
          d: R`서로 다른 점이 $M+1$개 이상이면 $Xv=0\Rightarrow v=0$, 그래서 $X^TX$가 가역이고 해가 유일합니다.`,
          dEn: R`With $M+1$ or more distinct points, $Xv=0\Rightarrow v=0$, so $X^TX$ is invertible and the fit is unique.` },
        { id: 'dep', at: '**4. (i) 일차종속.**', t: R`M개 이하이면 종속`, en: R`M or fewer points: dependent`,
          d: R`그 점들을 근으로 갖는 다항식 $(t-z_1)\cdots(t-z_r)$의 계수가 $Xv=0$인 $v\ne0$입니다.`,
          dEn: R`The coefficients of the polynomial $(t-z_1)\cdots(t-z_r)$, which has those points as roots, give $v\ne0$ with $Xv=0$.` },
        { id: 'interp', at: '**5. (ii) 보간.**', g: R`(ii) 훈련오차 0`, gEn: R`(ii) Zero training error`, t: R`정사각이면 보간`, en: R`Square: interpolation`,
          d: R`$M=n-1$이고 점이 모두 다르면 $X$가 가역이라 $X\beta=y$가 정확히 풀려 잔차가 0입니다.`,
          dEn: R`If $M=n-1$ and the points are distinct, $X$ is invertible, $X\beta=y$ is solved exactly, and the residual is 0.` },
      ],
    },
    'ch04-biasvar3': {
      easy: R`오차 $Y-\hat f$를 “관측 잡음 $\varepsilon$”과 “예측기가 참값에서 벗어난 양 $f-\hat f$”로 나누어 제곱합니다. 잡음은 훈련 자료와 독립이고 평균이 0이라 교차항이 사라집니다.

남은 $\E(f-\hat f)^2$은 2.8절과 같은 편향-분산 분해입니다: 평균 예측 $\mu$를 더하고 빼면 다시 교차항이 사라져 편향²과 분산이 남습니다. 결국 오차는 잡음, 편향², 분산의 세 조각입니다.`,
      easyEn: R`Split the error $Y-\hat f$ into “the observation noise $\varepsilon$” and “how far the predictor misses the true value, $f-\hat f$”, and square. The noise is independent of the training data and has mean 0, so the cross term disappears.

What remains, $\E(f-\hat f)^2$, is the same bias–variance decomposition as in Section 2.8: adding and subtracting the mean prediction $\mu$, the cross term vanishes again, leaving bias squared and variance. In the end the error has three pieces: noise, bias squared and variance.`,
      nodes: [
        { id: 'noise', at: '**1. 잡음 떼어 내기.**', t: R`잡음 떼어 내기`, en: R`Separate the noise`,
          d: R`$Y-\hat f=\varepsilon+(f-\hat f)$를 제곱하고, 첫 항의 기댓값은 $\sigma^2$입니다.`,
          dEn: R`Square $Y-\hat f=\varepsilon+(f-\hat f)$; the first term has expectation $\sigma^2$.` },
        { id: 'cross', at: '**2. 교차항.**', t: R`교차항 = 0`, en: R`Cross term = 0`,
          d: R`$\varepsilon$이 훈련 자료와 독립이고 $\E\varepsilon=0$이라 $\E[\varepsilon(f-\hat f)]=0$.`,
          dEn: R`$\varepsilon$ is independent of the training data and $\E\varepsilon=0$, so $\E[\varepsilon(f-\hat f)]=0$.` },
        { id: 'bv', at: '**3. 편향과 분산.**', t: R`편향² + 분산`, en: R`Bias² + variance`,
          d: R`평균 예측 $\mu$를 더하고 빼면 $\E(f-\hat f)^2=(\mu-f)^2+\Var\hat f$.`,
          dEn: R`Adding and subtracting the mean prediction $\mu$ gives $\E(f-\hat f)^2=(\mu-f)^2+\Var\hat f$.` },
        { id: 'sum', at: '**4. 합치기.**', t: R`세 조각`, en: R`Three pieces`,
          d: R`더하면 기대 오차 = 잡음 + 편향² + 분산.`,
          dEn: R`Adding up: expected error = noise + bias² + variance.` },
      ],
    },
    'ch04-softthresh': {
      easy: R`절댓값 때문에 0에서 미분이 안 되므로, 후보 답의 함숫값과 다른 점의 함숫값의 차를 직접 계산해 항상 양수임을 보입니다. $z$가 $[-\lambda,\lambda]$ 안에 있는지, 오른쪽인지, 왼쪽인지 세 경우로 나누고, 왼쪽은 부호를 뒤집어 오른쪽 경우로 돌려보냅니다.

릿지는 매끄러운 이차식이라 완전제곱 한 번으로 끝납니다. 두 답을 나란히 놓으면 라쏘는 작은 $z$를 정확히 0으로 보내고, 릿지는 일정 비율로 줄이기만 한다는 차이가 드러납니다.`,
      easyEn: R`Because of the absolute value there is no derivative at 0, so we compute the difference between the function value at another point and at the candidate answer directly and show that it is always positive. We split into three cases, $z$ inside $[-\lambda,\lambda]$, to the right, or to the left, and the left case is sent back to the right one by flipping the sign.

Ridge is a smooth quadratic, so one completion of the square finishes it. Side by side, the two answers show the difference: the lasso sends small $z$ exactly to 0, while ridge only shrinks by a fixed factor.`,
      nodes: [
        { id: 'zero', at: '**1. $', g: R`(i) 라쏘: 세 경우`, gEn: R`(i) Lasso: three cases`, t: R`|z| ≤ λ: 답은 0`, en: R`|z| ≤ λ: the answer is 0`,
          d: R`$g(\beta)-g(0)\ge\frac12\beta^2+\lvert\beta\rvert(\lambda-\lvert z\rvert)\ge\frac12\beta^2>0$ ($\beta\ne0$).`,
          dEn: R`$g(\beta)-g(0)\ge\frac12\beta^2+\lvert\beta\rvert(\lambda-\lvert z\rvert)\ge\frac12\beta^2>0$ for $\beta\ne0$.` },
        { id: 'right', at: '**2. $', t: R`z > λ: 답은 z−λ`, en: R`z > λ: the answer is z−λ`,
          d: R`$g(\beta)=g(b)+\frac12(\beta-b)^2+\lambda(\lvert\beta\rvert-\beta)$로 다시 쓰면 $b=z-\lambda$가 유일한 최소점입니다.`,
          dEn: R`Rewriting $g(\beta)=g(b)+\frac12(\beta-b)^2+\lambda(\lvert\beta\rvert-\beta)$ shows that $b=z-\lambda$ is the unique minimizer.` },
        { id: 'left', at: '**3. $', t: R`z < −λ: 대칭`, en: R`z < −λ: symmetry`,
          d: R`$g_z(-\beta)=g_{-z}(\beta)$이므로 2단계에서 답은 $z+\lambda$.`,
          dEn: R`$g_z(-\beta)=g_{-z}(\beta)$, so by step 2 the answer is $z+\lambda$.` },
        { id: 'one', at: '**4. 한 식으로.**', t: R`연성 임계값`, en: R`Soft thresholding`,
          d: R`세 경우를 모아 $\sign(z)\max(\lvert z\rvert-\lambda,0)$.`,
          dEn: R`The three cases combine into $\sign(z)\max(\lvert z\rvert-\lambda,0)$.` },
        { id: 'ridge', at: '**5. (ii) 릿지.**', g: R`(ii) 릿지`, gEn: R`(ii) Ridge`, t: R`완전제곱`, en: R`Complete the square`,
          d: R`$h$를 완전제곱하면 최소점 $\frac z{1+\lambda}$: 줄어들 뿐 0이 되지 않습니다.`,
          dEn: R`Completing the square in $h$ gives the minimizer $\frac z{1+\lambda}$: it shrinks but never becomes 0.` },
      ],
    },
    'ch04-gausskernel': {
      easy: R`커널인지는 “모든 그람 행렬이 양의 준정부호인가”로 판정하므로, 커널을 더하고, 곱하고, 양쪽에 함수를 곱하고, 극한을 취하는 네 가지 조작이 양의 준정부호성을 지킨다는 것을 먼저 보입니다. 가장 까다로운 곱은 한 행렬을 고유분해해 양의 준정부호 이차형식들의 음이 아닌 결합으로 쓰면 됩니다.

그다음 가우시안 커널을 그 조작들로 조립합니다. $e^{x^Tz/\sigma^2}$은 다항 커널 $(x^Tz)^m$들을 양의 계수로 더한 급수의 극한이고, 가우시안 커널은 그것의 양쪽에 같은 함수 $e^{-\lVert x\rVert^2/2\sigma^2}$를 곱한 것입니다.`,
      easyEn: R`Being a kernel is decided by “is every Gram matrix positive semidefinite?”, so we first show that four operations keep positive semidefiniteness: adding kernels, multiplying them, multiplying by the same function on both sides, and taking limits. The trickiest one, the product, is handled by eigendecomposing one matrix and writing the quadratic form as a nonnegative combination of positive semidefinite quadratic forms.

Then the Gaussian kernel is assembled from those operations. $e^{x^Tz/\sigma^2}$ is the limit of a series that adds the polynomial kernels $(x^Tz)^m$ with positive coefficients, and the Gaussian kernel multiplies it on both sides by the same function $e^{-\lVert x\rVert^2/2\sigma^2}$.`,
      nodes: [
        { id: 'sum', at: '**(a) 합과 양수배.**', g: R`네 가지 규칙`, gEn: R`Four rules`, t: R`합과 양수배`, en: R`Sums and positive multiples`,
          d: R`이차형식이 더해지고 양수배될 뿐이라 음이 아닙니다.`,
          dEn: R`The quadratic forms are just added or multiplied by a positive number, so they stay nonnegative.` },
        { id: 'prod', at: '**(b) 곱 (슈어 곱).**', t: R`곱: 슈어 곱`, en: R`Products: the Schur product`,
          d: R`$B$를 고유분해하면 $u^T(A\circ B)u=\sum_l\mu_lv_l^TAv_l\ge0$.`,
          dEn: R`Eigendecomposing $B$ gives $u^T(A\circ B)u=\sum_l\mu_lv_l^TAv_l\ge0$.` },
        { id: 'side', at: '**(c) 양쪽에 같은 함수 곱하기.**', t: R`양쪽에 f 곱하기`, en: R`Multiply by f on both sides`,
          d: R`그람 행렬이 $DAD$라 $u^TDADu=(Du)^TA(Du)\ge0$.`,
          dEn: R`The Gram matrix is $DAD$, so $u^TDADu=(Du)^TA(Du)\ge0$.` },
        { id: 'lim', at: '**(d) 극한.**', t: R`극한`, en: R`Limits`,
          d: R`음이 아닌 이차형식 값들의 극한은 음이 아닙니다.`,
          dEn: R`Limits of nonnegative quadratic-form values are nonnegative.` },
        { id: 'pow', at: '**1. 거듭제곱.**', g: R`가우시안 커널 조립`, gEn: R`Assembling the Gaussian kernel`, t: R`다항 커널`, en: R`Polynomial kernels`,
          d: R`선형 커널과 상수 1이 커널이고, 곱 규칙으로 $(x^Tz)^m$이 커널입니다.`,
          dEn: R`The linear kernel and the constant 1 are kernels, and by the product rule so is $(x^Tz)^m$.` },
        { id: 'exp', at: '**2. 지수 급수.**', t: R`지수 급수`, en: R`The exponential series`,
          d: R`양의 계수 부분합의 극한이므로 $e^{x^Tz/\sigma^2}$이 커널입니다.`,
          dEn: R`As the limit of partial sums with positive coefficients, $e^{x^Tz/\sigma^2}$ is a kernel.` },
        { id: 'gauss', at: '**3. 가우시안 커널.**', t: R`가우시안 = f · 지수 · f`, en: R`Gaussian = f · exponential · f`,
          d: R`$e^{-\lVert x-z\rVert^2/2\sigma^2}=f(x)e^{x^Tz/\sigma^2}f(z)$이고 (c)에서 커널입니다.`,
          dEn: R`$e^{-\lVert x-z\rVert^2/2\sigma^2}=f(x)e^{x^Tz/\sigma^2}f(z)$, a kernel by (c).` },
      ],
    },
  });
})();
