/* 증명 — 23단원: 11주차 월요일 필기(최대가능도에서 KL로), 11주차 수요일 필기(젠센 부등식으로 만든 ELBO, 가우시안 디코더, VAE의 목표 함수, 재매개변수화).
   필기에서 유도한 것은 src를 달았고, 자기회귀 분해, 선형 오토인코더와 PCA, ELBO의 틈, 가우시안 KL의 닫힌 형태는 ‘판서에 없는 증명’(src 없음)입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 23
  { ch: 'ch23', id: 'autoreg', title: '자기회귀 분해는 언제나 성립하고 정규화되어 있다', keys: ['자기회귀 분해'],
    tags: 'autoregressive factorization chain rule product rule normalization exact likelihood PixelRNN PixelCNN 자기회귀 분해 곱셈 규칙 연쇄 법칙 정규화 정확한 가능도',
    stmt: R`$\mathbf x=(x_1,\dots,x_D)$의 분포는 무엇이든 $p(\mathbf x)=\prod_{i=1}^Dp(x_i\mid\mathbf x_{<i})$로 쓸 수 있다(조건이 되는 주변 확률이 양수인 곳에서). 거꾸로 각 $p_\theta(\cdot\mid\mathbf x_{<i})$가 $x_i$에 대한 분포이면 곱 $p_\theta(\mathbf x)=\prod_ip_\theta(x_i\mid\mathbf x_{<i})$는 합이 $1$인 분포이고, 로그 가능도 $\log p_\theta(\mathbf x)=\sum_i\log p_\theta(x_i\mid\mathbf x_{<i})$는 정규화 상수 없이 정확히 계산된다.`,
    body: R`
**곱셈 규칙.** 조건부 확률의 정의 $p(a,b)=p(a)\,p(b\mid a)$를 $a=\mathbf x_{<k}$, $b=x_k$에 쓰면 $p(\mathbf x_{\le k})=p(\mathbf x_{<k})\,p(x_k\mid\mathbf x_{<k})$입니다. 이것을 $k=D,D-1,\dots,2$ 차례로 적용하면
$$p(\mathbf x)=p(\mathbf x_{<D})\,p(x_D\mid\mathbf x_{<D})=p(\mathbf x_{<D-1})\,p(x_{D-1}\mid\mathbf x_{<D-1})\,p(x_D\mid\mathbf x_{<D})=\cdots=\prod_{i=1}^Dp(x_i\mid\mathbf x_{<i})$$
이고, 첫 인수 $p(x_1\mid\mathbf x_{<1})$은 $p(x_1)$입니다. 독립성 같은 가정을 하나도 쓰지 않았으므로 이 분해는 근사가 아니라 항등식입니다.

**정규화.** 이산 변수라 하고 맨 뒤 변수부터 더합니다. $x_D$는 마지막 인수에만 나오고 $\sum_{x_D}p_\theta(x_D\mid\mathbf x_{<D})=1$이므로
$$\sum_{x_1,\dots,x_D}\prod_{i=1}^Dp_\theta(x_i\mid\mathbf x_{<i})=\sum_{x_1,\dots,x_{D-1}}\prod_{i=1}^{D-1}p_\theta(x_i\mid\mathbf x_{<i})\sum_{x_D}p_\theta(x_D\mid\mathbf x_{<D})=\sum_{x_1,\dots,x_{D-1}}\prod_{i=1}^{D-1}p_\theta(x_i\mid\mathbf x_{<i})$$
입니다. 같은 일을 $D$번 되풀이하면 $1$이 남고, 연속 변수면 합을 적분으로 바꾸면 됩니다. 그래서 각 조건부를 소프트맥스처럼 정규화된 출력으로 만들기만 하면 전체가 저절로 분포가 됩니다.

**로그 가능도.** 곱의 로그는 로그의 합이므로 $\log p_\theta(\mathbf x)=\sum_{i=1}^D\log p_\theta(x_i\mid\mathbf x_{<i})$이고, 각 항은 신경망 출력 하나를 읽으면 됩니다. 학습할 때는 자료의 $\mathbf x_{<i}$가 모두 주어져 있어 $D$개의 항을 (마스크를 씌운 합성곱으로) 한꺼번에 계산할 수 있지만, 생성할 때는 $x_i$를 뽑아야 $x_{i+1}$의 조건이 정해지므로 $D$번을 차례로 계산해야 합니다.`,
    note: R`순서는 임의입니다. 변수를 어떤 순서로 늘어놓아도 곱셈 규칙은 성립하므로 래스터 순서(왼쪽 위에서 오른쪽 아래)는 선택일 뿐입니다. 분해 자체는 공짜지만 어려움이 사라진 것은 아니고, 조건부 $p(x_i\mid\mathbf x_{<i})$를 배우는 신경망으로 옮겨 간 것입니다.` },
  { ch: 'ch23', id: 'aepca', title: '선형 오토인코더의 최적 복원은 주성분 부분공간으로의 정사영이다', keys: ['오토인코더 손실'],
    tags: 'linear autoencoder PCA principal component analysis orthogonal projection eigenvalue reconstruction loss Eckart Young 선형 오토인코더 주성분 분석 정사영 고윳값 복원 손실',
    stmt: R`자료 $\mathbf x_1,\dots,\mathbf x_N\in\mathbb R^D$의 $C=\frac1N\sum_i\mathbf x_i\mathbf x_i^T$가 고윳값 $\lambda_1\ge\dots\ge\lambda_D\ge0$과 정규직교 고유벡터 $\mathbf e_1,\dots,\mathbf e_D$를 가진다고 하자. 코드 차원이 $d$인 선형 오토인코더 $\hat{\mathbf x}=BA\mathbf x$ ($A\in\mathbb R^{d\times D}$, $B\in\mathbb R^{D\times d}$)의 손실 $\frac1N\sum_i\lVert\mathbf x_i-BA\mathbf x_i\rVert^2$은 $\lambda_{d+1}+\dots+\lambda_D$ 이상이고, $U=[\mathbf e_1\ \cdots\ \mathbf e_d]$, $A=U^T$, $B=U$일 때 이 값이 된다.`,
    body: R`
**복원은 정사영.** $B$를 고정하면 코드를 어떻게 고르든 복원 $B\mathbf c$는 $B$의 열공간 $V$ (차원 $\le d$) 안에 있고, $V$ 안에서 $\mathbf x$에 가장 가까운 점은 정사영 $P_V\mathbf x$입니다. $V$를 담는 $d$차원 부분공간의 정규직교 기저를 $U\in\mathbb R^{D\times d}$ ($U^TU=I_d$)라 하면 더 큰 공간으로의 정사영이 더 가까우므로 $\lVert\mathbf x-BA\mathbf x\rVert^2\ge\lVert\mathbf x-P_V\mathbf x\rVert^2\ge\lVert\mathbf x-UU^T\mathbf x\rVert^2$입니다. 따라서 손실은 어떤 $U$의 $\frac1N\sum_i\lVert\mathbf x_i-UU^T\mathbf x_i\rVert^2$ 이상입니다.

**피타고라스.** $UU^T\mathbf x$와 $\mathbf x-UU^T\mathbf x$는 직교하고 $\lVert UU^T\mathbf x\rVert^2=\mathbf x^TUU^TUU^T\mathbf x=\lVert U^T\mathbf x\rVert^2$이므로 $\lVert\mathbf x-UU^T\mathbf x\rVert^2=\lVert\mathbf x\rVert^2-\lVert U^T\mathbf x\rVert^2$입니다. 평균을 내면 $\frac1N\sum_i\lVert U^T\mathbf x_i\rVert^2=\frac1N\sum_i\tr(U^T\mathbf x_i\mathbf x_i^TU)=\tr(U^TCU)$이므로
$$\frac1N\sum_{i=1}^N\lVert\mathbf x_i-UU^T\mathbf x_i\rVert^2=\tr C-\tr(U^TCU)=\sum_{j=1}^D\lambda_j-\tr(U^TCU).$$

**무게로 쓰기.** $C=\sum_j\lambda_j\mathbf e_j\mathbf e_j^T$를 넣고 $w_j=\lVert U^T\mathbf e_j\rVert^2$로 두면 $\tr(U^TCU)=\sum_j\lambda_j\lVert U^T\mathbf e_j\rVert^2=\sum_j\lambda_jw_j$입니다. 무게에는 두 성질이 있습니다. $UU^T$가 정사영이라 $w_j=\lVert UU^T\mathbf e_j\rVert^2\le\lVert\mathbf e_j\rVert^2=1$이고, $\mathbf e_j$들이 정규직교 기저라 $\sum_jw_j=\sum_j\lVert U^T\mathbf e_j\rVert^2=\lVert U^T\rVert_F^2=\tr(U^TU)=d$입니다.

**상한.** $0\le w_j\le1$, $\sum_jw_j=d$이면
$$\sum_j\lambda_jw_j-\sum_{j\le d}\lambda_j=\sum_{j\le d}\lambda_j(w_j-1)+\sum_{j>d}\lambda_jw_j\le\lambda_d\sum_{j\le d}(w_j-1)+\lambda_d\sum_{j>d}w_j=\lambda_d\Big(\sum_jw_j-d\Big)=0$$
입니다. 첫 합은 $w_j-1\le0$, $\lambda_j\ge\lambda_d$에서, 둘째 합은 $w_j\ge0$, $\lambda_j\le\lambda_d$에서 나옵니다. 그러므로 $\tr(U^TCU)\le\lambda_1+\dots+\lambda_d$이고 손실은 $\lambda_{d+1}+\dots+\lambda_D$ 이상입니다. $U=[\mathbf e_1\ \cdots\ \mathbf e_d]$이면 $w_1=\dots=w_d=1$, 나머지 무게가 $0$이라 등호가 성립하고, $A=U^T$, $B=U$가 바로 그 복원 $UU^T\mathbf x$를 만듭니다.`,
    note: R`$d=1$이면 23.3절의 계산처럼 $\mathbf w^TC\mathbf w$를 최대화하는 문제가 되고, 답은 가장 큰 고윳값의 고유벡터입니다. 선형 오토인코더는 PCA와 같은 부분공간을 찾을 뿐 기저까지 같을 필요는 없습니다($A$, $B$ 사이에 가역 행렬 $M^{-1}M$을 끼워도 $BA$는 같습니다). 자료의 평균을 먼저 빼면 $C$는 표본 공분산이고 버려진 고윳값의 합은 버려진 분산입니다. 굽은 다양체를 따라 줄이려면 비선형 인코더와 디코더가 필요합니다.` },
  { ch: 'ch23', id: 'mlekl', title: '최대가능도 추정은 KL 발산을 최소화한다', keys: ['최대가능도와 KL'], src: '강의 필기 · W11 월',
    tags: 'maximum likelihood estimation KL divergence cross entropy entropy law of large numbers Gibbs inequality 최대가능도 추정 KL 발산 교차 엔트로피 엔트로피 큰 수의 법칙 깁스 부등식',
    stmt: R`자료 $\mathbf x_1,\dots,\mathbf x_N$이 $p_{data}$에서 독립으로 뽑혔고 $\E_{p_{data}}\lvert\log p_\theta(\mathbf x)\rvert<\infty$라 하자. (i) $H(p,q)=\KL(p\,\|\,q)+H(p)$이고, (ii) $\KL(p\,\|\,q)\ge0$이며 등호는 $p=q$일 때만이다. (iii) 각 $\theta$에서 $\frac1N\sum_i\log p_\theta(\mathbf x_i)\to-H(p_{data},p_\theta)$이므로, 자료가 많으면 최대가능도 추정은 $\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$에 가깝다.`,
    body: R`
**로그 가능도의 평균.** 독립이므로 가능도는 곱 $\prod_ip_\theta(\mathbf x_i)$입니다. $\log$는 증가 함수이고 $\frac1N$은 양의 상수라 최대점을 바꾸지 않으므로 $\argmax_\theta\prod_ip_\theta(\mathbf x_i)=\argmax_\theta\frac1N\sum_i\log p_\theta(\mathbf x_i)$입니다. $\theta$를 고정하면 $\log p_\theta(\mathbf x_i)$들은 독립이고 분포가 같은 확률 변수이므로, 큰 수의 법칙으로
$$\frac1N\sum_{i=1}^N\log p_\theta(\mathbf x_i)\ \longrightarrow\ \E_{p_{data}}[\log p_\theta(\mathbf x)]=-H(p_{data},p_\theta)\qquad(N\to\infty).$$

**교차 엔트로피 나누기.** 이산 분포로 쓰면 (연속이면 합을 적분으로)
$$H(p,q)=-\sum_xp(x)\log q(x)=\sum_xp(x)\log\frac{p(x)}{q(x)}-\sum_xp(x)\log p(x)=\KL(p\,\|\,q)+H(p).$$

**KL은 0 이상.** $t>0$에서 $\log t\le t-1$이고 등호는 $t=1$에서만입니다. 이것을 $t=q(x)/p(x)$에 쓰고 $p(x)>0$인 $x$에 대해서만 더하면
$$-\KL(p\,\|\,q)=\sum_{p(x)>0}p(x)\log\frac{q(x)}{p(x)}\le\sum_{p(x)>0}p(x)\Big(\frac{q(x)}{p(x)}-1\Big)=\sum_{p(x)>0}q(x)-1\le0$$
입니다. 등호가 되려면 $p(x)>0$인 모든 곳에서 $q(x)=p(x)$이고 $\sum_{p(x)>0}q(x)=1$이어야 하므로 $q=p$입니다.

**합치기.** $H(p_{data})$는 $\theta$와 무관하므로
$$\argmax_\theta\big(-H(p_{data},p_\theta)\big)=\argmin_\theta\big[\KL(p_{data}\,\|\,p_\theta)+H(p_{data})\big]=\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$$
이고, 모형족이 $p_{data}$를 담고 있으면 (ii)에 따라 최소점은 $p_\theta=p_{data}$입니다.`,
    note: R`‘가깝다’는 각 $\theta$에서 평균이 기댓값으로 수렴한다는 뜻입니다. 최대점까지 수렴한다는 것(최대가능도 추정량의 일치성)은 $\theta$에 대해 고르게 수렴한다는 더 강한 조건이 필요하고, 이 강의의 범위 밖입니다. 방향도 중요합니다. $\KL(p_{data}\,\|\,p_\theta)$는 $p_{data}(\mathbf x)>0$인데 $p_\theta(\mathbf x)\approx0$인 곳을 크게 벌하므로, 최대가능도로 배운 모형은 자료가 있는 곳을 빠짐없이 덮으려 합니다.` },
  { ch: 'ch23', id: 'elbo', title: '젠센 부등식으로 얻는 ELBO', keys: ['ELBO'], src: '강의 필기 · W11 수',
    tags: 'ELBO evidence lower bound Jensen inequality concave logarithm variational inference latent variable model 증거 하한 젠센 부등식 오목 로그 변분 추론 잠재 변수',
    stmt: R`$p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z>0$이고 밀도 $q(\mathbf z)$가 $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)>0$인 모든 곳에서 양수이면 $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q(\mathbf z)\,\|\,p(\mathbf z))$이다. $q$는 무엇이든 되고, VAE는 $\mathbf x$를 보는 $q_\phi(\mathbf z\mid\mathbf x)$를 쓴다.`,
    body: R`
**젠센 부등식.** $\log$는 오목하므로 그래프가 접선 아래에 있습니다. $m>0$에서의 접선으로 쓰면 모든 $y>0$에 대해 $\log y\le\log m+\frac{y-m}m$입니다. 음이 아니고 $\E[Y]>0$인 확률 변수 $Y$와 $m=\E[Y]$를 넣고 기댓값을 취하면 ($Y=0$인 곳은 $\log Y=-\infty$라 부등식이 그대로입니다) $\E[\log Y]\le\log m+\frac{\E[Y]-m}m=\log\E[Y]$, 곧 $\log\E[Y]\ge\E[\log Y]$입니다.

**곱하고 나누기.** 피적분 함수는 $q(\mathbf z)=0$인 곳에서 $0$이므로 $q(\mathbf z)>0$인 곳에서만 적분해도 되고, 거기서 $q$를 곱하고 나누면
$$p_\theta(\mathbf x)=\int q(\mathbf z)\,\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q(\mathbf z)}\,d\mathbf z=\E_q[Y],\qquad Y=\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q(\mathbf z)}$$
입니다. $Y$는 $\mathbf z\sim q$일 때의 음이 아닌 확률 변수이고 $\E_q[Y]=p_\theta(\mathbf x)>0$입니다.

**하한.** 젠센 부등식과 로그의 성질로
$$\log p_\theta(\mathbf x)=\log\E_q[Y]\ge\E_q[\log Y]=\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]+\E_q\Big[\log\frac{p(\mathbf z)}{q(\mathbf z)}\Big]=\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$$
입니다. 마지막 등호는 KL의 정의 $\KL(q\,\|\,p)=\E_q[\log(q/p)]$입니다.`,
    note: R`필기는 곱하고 나눈 뒤 바로 젠센 부등식을 썼고, 여기서는 그 부등식도 접선으로 증명했습니다. 젠센의 등호는 $Y$가 ($q$에서 거의 어디서나) 상수일 때, 곧 $q(\mathbf z)\propto p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)$로 $q$가 사후분포일 때 성립합니다. 하한이 얼마나 느슨한지는 다음 증명에서 정확히 계산합니다.` },
  { ch: 'ch23', id: 'elbogap', title: 'ELBO의 틈은 진짜 사후분포와의 KL이다', keys: ['ELBO'],
    tags: 'ELBO gap true posterior KL divergence tight bound variational inference Bayes rule 증거 하한 틈 사후분포 KL 발산 베이즈 정리 변분 추론',
    stmt: R`앞 증명의 조건에서 $\log p_\theta(\mathbf x)-\mathrm{ELBO}(q)=\KL(q(\mathbf z)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$이다. 따라서 $\mathrm{ELBO}\le\log p_\theta(\mathbf x)$의 등호는 $q$가 사후분포일 때만 성립하고, $\theta$를 고정하면 ELBO를 $q$에 대해 최대화하는 것은 사후분포와의 KL을 최소화하는 것과 같다.`,
    body: R`
**베이즈 정리.** $p_\theta(\mathbf x)>0$이면 사후분포의 정의 $p_\theta(\mathbf z\mid\mathbf x)=p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/p_\theta(\mathbf x)$에서 $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)=p_\theta(\mathbf z\mid\mathbf x)\,p_\theta(\mathbf x)$입니다.

**ELBO 다시 쓰기.** 앞 증명의 $\mathrm{ELBO}=\E_q\big[\log\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q(\mathbf z)}\big]$에 이것을 넣으면
$$\mathrm{ELBO}=\E_q\Big[\log p_\theta(\mathbf x)+\log\frac{p_\theta(\mathbf z\mid\mathbf x)}{q(\mathbf z)}\Big]=\log p_\theta(\mathbf x)-\KL(q(\mathbf z)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$$
입니다. $\log p_\theta(\mathbf x)$는 $\mathbf z$와 무관한 상수라 기댓값 밖으로 나옵니다.

**결론.** KL은 $0$ 이상이고 두 분포가 같을 때만 $0$이므로(최대가능도 증명의 셋째 단계) 틈은 $0$ 이상이고, $q=p_\theta(\mathbf z\mid\mathbf x)$일 때만 $0$입니다. $\theta$를 고정하면 $\log p_\theta(\mathbf x)$는 $q$와 무관하므로 $\argmax_q\mathrm{ELBO}=\argmin_q\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$입니다. VAE는 $\theta$와 $\phi$를 함께 올리므로 가능도를 올리는 일과 하한을 조이는 일을 동시에 합니다.`,
    note: R`표지 그림의 모형 $z\sim\N(0,1)$, $x\mid z\sim\N(z,1)$, $x=2$에서 사후분포는 $\N(1,\frac12)$이고 $\log p(x)=-\frac12\log(4\pi)-1\approx-2.27$입니다. $q=\N(m,s^2)$의 ELBO는 $\log p(x)-\KL(\N(m,s^2)\,\|\,\N(1,\frac12))$이라 그림의 곡선은 모두 이 값 아래에 있고, $s^2=\frac12$인 굵은 곡선의 꼭대기 $m=1$에서만 닿습니다.` },
  { ch: 'ch23', id: 'gaussdec', title: '가우시안 디코더의 음의 로그 가능도는 제곱 오차다', keys: ['가우시안 디코더와 L2 손실'], src: '강의 필기 · W11 수',
    tags: 'Gaussian decoder negative log likelihood squared error L2 loss MSE variance tau reconstruction term VAE 가우시안 디코더 음의 로그 가능도 제곱 오차 분산 복원 항',
    stmt: R`$p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I_D)$이면 $-\log p_\theta(\mathbf x\mid\mathbf z)=\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$이다. $\tau$를 고정하면 $\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]$의 최대화는 $\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$의 최소화와 같고, $\tau^2$도 고르면 최적은 $\tau^2=\frac1D\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$이다.`,
    body: R`
**밀도.** 공분산이 $\tau^2I$이면 $\det(2\pi\tau^2I)=(2\pi\tau^2)^D$, $(\tau^2I)^{-1}=I/\tau^2$이므로 다변량 정규분포의 밀도는
$$p_\theta(\mathbf x\mid\mathbf z)=(2\pi\tau^2)^{-D/2}\exp\Big(-\frac{\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2}{2\tau^2}\Big)$$
입니다. 좌표마다 독립인 $\N(f_k,\tau^2)$ $D$개의 곱으로 봐도 같습니다.

**로그.** 음의 로그를 취하면 상수 인수는 더하는 항이 되고 지수는 그 지수만 남아 $-\log p_\theta(\mathbf x\mid\mathbf z)=\frac D2\log(2\pi\tau^2)+\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$입니다.

**최적화.** $\mathbf z\sim q$에 대해 기댓값을 취하면 $\E_q[-\log p_\theta(\mathbf x\mid\mathbf z)]=\frac1{2\tau^2}\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$입니다. $\tau$가 고정이면 둘째 항은 상수이고 양수 $\frac1{2\tau^2}$을 곱해도 최소점은 그대로이므로, 복원 항의 최대화는 기대 제곱 오차의 최소화입니다.

**분산 고르기.** $E=\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2>0$을 고정하고 $s=\tau^2$의 함수 $g(s)=\frac E{2s}+\frac D2\log s$를 보면, $g'(s)=\frac{Ds-E}{2s^2}$는 $s<E/D$에서 음수, $s>E/D$에서 양수입니다. 그래서 최소점은 $s=E/D$, 곧 좌표 하나당 평균 제곱 오차입니다.`,
    note: R`$\tau$는 복원 항과 KL 항 사이의 저울입니다. 음의 ELBO $\frac1{2\tau^2}\E_q\lVert\mathbf x-f_\theta\rVert^2+\KL$에 $2\tau^2$을 곱하면 $\E_q\lVert\mathbf x-f_\theta\rVert^2+2\tau^2\KL$이 되어, $\tau$가 작을수록 KL이 약해져 오토인코더에 가까워지고 클수록 코드가 사전분포에 붙어 흐린 복원이 나옵니다. 픽셀이 $0$과 $1$에 몰려 있으면 가우시안 대신 베르누이 디코더를 쓰고, 그때 복원 항은 이진 교차 엔트로피가 됩니다.` },
  { ch: 'ch23', id: 'gausskl', title: '가우시안과 표준 정규분포 사이의 KL', keys: ['가우시안 KL의 닫힌 형태'],
    tags: 'KL divergence Gaussian standard normal closed form trace log determinant diagonal covariance VAE regularizer posterior collapse 가우시안 KL 발산 표준 정규분포 닫힌 형태 대각합 행렬식 대각 공분산',
    stmt: R`$q=\N(\mu,\Sigma)$ ($\mu\in\mathbb R^d$, $\Sigma$는 양의 정부호), $p=\N(\mathbf 0,I_d)$이면 $\KL(q\,\|\,p)=\frac12\big(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma\big)$이다. 1차원에서는 $\KL(\N(\mu,\sigma^2)\,\|\,\N(0,1))=\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$이고, 이 값은 $0$ 이상이며 $\mu=0$, $\sigma^2=1$일 때만 $0$이다.`,
    body: R`
**1차원: 로그 밀도의 차.** $q(z)=\frac1{\sqrt{2\pi\sigma^2}}e^{-(z-\mu)^2/(2\sigma^2)}$, $p(z)=\frac1{\sqrt{2\pi}}e^{-z^2/2}$이므로 $\sqrt{2\pi}$가 지워져
$$\log\frac{q(z)}{p(z)}=-\frac12\log\sigma^2-\frac{(z-\mu)^2}{2\sigma^2}+\frac{z^2}2.$$

**1차원: 기댓값.** $z\sim q$이면 $\E[(z-\mu)^2]=\sigma^2$이고 $\E[z^2]=\Var(z)+(\E z)^2=\sigma^2+\mu^2$입니다. 따라서
$$\KL(q\,\|\,p)=\E_q\Big[\log\frac{q(z)}{p(z)}\Big]=-\frac12\log\sigma^2-\frac12+\frac{\sigma^2+\mu^2}2=\frac12\big(\sigma^2+\mu^2-1-\log\sigma^2\big).$$

**대각 공분산.** $\Sigma=\diag(\sigma_1^2,\dots,\sigma_d^2)$이면 $q$와 $p$ 모두 좌표마다의 곱 $q(\mathbf z)=\prod_kq_k(z_k)$, $p(\mathbf z)=\prod_kp_k(z_k)$입니다. 그러면 $\log\frac qp=\sum_k\log\frac{q_k(z_k)}{p_k(z_k)}$이고 $k$번째 항의 기댓값에는 $z_k\sim q_k$만 관여하므로
$$\KL(q\,\|\,p)=\sum_{k=1}^d\KL(q_k\,\|\,p_k)=\frac12\sum_{k=1}^d\big(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2\big)=\frac12\big(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma\big)$$
입니다. $\tr\Sigma=\sum_k\sigma_k^2$, $\log\det\Sigma=\sum_k\log\sigma_k^2$이기 때문입니다.

**일반 공분산.** 대각이 아니어도 같은 식이 나옵니다. 정규화 상수 $(2\pi)^{-d/2}$가 지워져
$$\log\frac{q(\mathbf z)}{p(\mathbf z)}=-\frac12\log\det\Sigma-\frac12(\mathbf z-\mu)^T\Sigma^{-1}(\mathbf z-\mu)+\frac12\mathbf z^T\mathbf z$$
이고, 이차 형식을 대각합으로 쓰면 $\E_q[(\mathbf z-\mu)^T\Sigma^{-1}(\mathbf z-\mu)]=\tr\big(\Sigma^{-1}\E_q[(\mathbf z-\mu)(\mathbf z-\mu)^T]\big)=\tr(\Sigma^{-1}\Sigma)=d$, $\E_q[\mathbf z^T\mathbf z]=\tr\E_q[\mathbf z\mathbf z^T]=\tr(\Sigma+\mu\mu^T)=\tr\Sigma+\lVert\mu\rVert^2$입니다. 셋을 더하면 $\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$입니다.

**최솟값.** $h(s)=s-1-\log s$ ($s>0$)는 $h'(s)=1-\frac1s$의 부호가 $s=1$에서 음에서 양으로 바뀌므로 $h(s)\ge h(1)=0$입니다. 1차원 KL은 $\frac12(h(\sigma^2)+\mu^2)\ge0$이고 $\sigma^2=1$, $\mu=0$일 때만 $0$입니다. 또 $\sigma^2\to0$이면 $-\log\sigma^2\to\infty$라 KL이 한없이 커지므로, 이 항은 인코더가 분산을 $0$으로 줄여 결정적인 오토인코더가 되는 것을 막습니다.`,
    note: R`이 항은 표본 없이 정확히 계산되므로, VAE에서 몬테카를로로 추정하는 것은 복원 항뿐입니다. 예를 들어 $\mu=2$, $\sigma^2=1$이면 $\frac12(1+4-1-0)=2$이고, $\mu=0$, $\sigma^2=\frac12$이면 $\frac12(\frac12-1+\log2)\approx0.097$입니다.` },
  { ch: 'ch23', id: 'vaeloss', title: 'VAE의 가정을 넣은 목표 함수', keys: ['VAE의 세 가정'], src: '강의 필기 · W11 수',
    tags: 'VAE objective negative ELBO Gaussian prior encoder decoder reconstruction KL regularizer loss function 변분 오토인코더 목표 함수 음의 ELBO 가우시안 사전분포 인코더 디코더 복원 정규화',
    stmt: R`$p(\mathbf z)=\N(\mathbf 0,I_d)$, $q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$, $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I_D)$이고 $\tau$가 고정이면, $\sum_i\mathrm{ELBO}(\mathbf x_i)$의 최대화는 $\sum_i\big(\frac1{\tau^2}\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2+\tr\Sigma_\phi(\mathbf x_i)+\lVert\mu_\phi(\mathbf x_i)\rVert^2-\log\det\Sigma_\phi(\mathbf x_i)\big)$의 최소화와 같다(필기의 식 (3)).`,
    body: R`
**음의 ELBO.** 자료 하나의 음의 ELBO는 $-\mathrm{ELBO}(\mathbf x)=\E_{q_\phi}[-\log p_\theta(\mathbf x\mid\mathbf z)]+\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$이고, 이것을 $i$에 대해 더한 것을 최소화합니다.

**복원 항.** 가우시안 디코더의 증명으로 $\E_{q_\phi}[-\log p_\theta(\mathbf x\mid\mathbf z)]=\frac1{2\tau^2}\E_{q_\phi}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$입니다.

**KL 항.** 가우시안 KL의 증명에 $\mu=\mu_\phi(\mathbf x)$, $\Sigma=\Sigma_\phi(\mathbf x)$를 넣으면 $\KL=\frac12\big(\tr\Sigma_\phi(\mathbf x)+\lVert\mu_\phi(\mathbf x)\rVert^2-d-\log\det\Sigma_\phi(\mathbf x)\big)$입니다.

**상수 정리.** 둘을 더해 $i$에 대해 합하면
$$-\sum_{i=1}^N\mathrm{ELBO}(\mathbf x_i)=\frac12\sum_{i=1}^N\Big(\frac1{\tau^2}\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2+\tr\Sigma_\phi(\mathbf x_i)+\lVert\mu_\phi(\mathbf x_i)\rVert^2-\log\det\Sigma_\phi(\mathbf x_i)\Big)+N\Big(\frac D2\log(2\pi\tau^2)-\frac d2\Big)$$
입니다. 마지막 항은 $\theta$, $\phi$와 무관한 상수이고 양수 $2$를 곱해도 최소점은 바뀌지 않으므로, 식 (3)을 최소화하면 됩니다.`,
    note: R`실제로는 $\Sigma_\phi=\diag(\sigma_\phi^2)$로 두고, 인코더가 부호 제약 없는 $\log\sigma_\phi^2$를 내게 하는 경우가 많습니다. 그러면 KL 항은 $\frac12\sum_k(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$로 바로 계산되고, 남은 기댓값 $\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2$은 다음 증명의 재매개변수화로 표본 하나를 뽑아 추정합니다.` },
  { ch: 'ch23', id: 'reparam', title: '재매개변수화는 분포를 지키고 기울기를 통과시킨다', keys: ['재매개변수화'], src: '강의 필기 · W11 수',
    tags: 'reparameterization trick pathwise gradient estimator Monte Carlo unbiased score function REINFORCE VAE backpropagation 재매개변수화 기법 기울기 추정량 몬테카를로 불편 역전파',
    stmt: R`$\varepsilon\sim\N(\mathbf 0,I_d)$, $\sigma_k>0$, $\mathbf z=\mu+\sigma\odot\varepsilon$이면 $\mathbf z\sim\N(\mu,\diag(\sigma^2))$이고 $\partial\mathbf z/\partial\mu=I$, $\partial\mathbf z/\partial\sigma=\diag(\varepsilon)$이다. 미분 가능한 $R$에 대해 미분과 기댓값의 순서를 바꿀 수 있으면 $\frac{\partial}{\partial\mu_k}\E_q[R(\mathbf z)]=\E_\varepsilon\big[\frac{\partial R}{\partial z_k}(\mathbf z)\big]$, $\frac{\partial}{\partial\sigma_k}\E_q[R(\mathbf z)]=\E_\varepsilon\big[\frac{\partial R}{\partial z_k}(\mathbf z)\,\varepsilon_k\big]$이고, 표본으로 계산한 기울기는 이것의 불편 추정량이다.`,
    body: R`
**분포가 같다.** 좌표마다 $z_k=\mu_k+\sigma_k\varepsilon_k$이고 $\sigma_k>0$이므로
$$P(z_k\le t)=P\Big(\varepsilon_k\le\frac{t-\mu_k}{\sigma_k}\Big)=\Phi\Big(\frac{t-\mu_k}{\sigma_k}\Big)$$
입니다. 이것은 $\N(\mu_k,\sigma_k^2)$의 누적 분포 함수입니다. $\varepsilon_k$들이 독립이고 $z_k$는 $\varepsilon_k$만의 함수이므로 $z_k$들도 독립이고, 따라서 $\mathbf z\sim\N(\mu,\diag(\sigma^2))$입니다.

**야코비안.** $\partial z_k/\partial\mu_l$은 $k=l$일 때 $1$, 아니면 $0$이고, $\partial z_k/\partial\sigma_l$은 $k=l$일 때 $\varepsilon_k$, 아니면 $0$입니다. 그래서 $\partial\mathbf z/\partial\mu=I$, $\partial\mathbf z/\partial\sigma=\diag(\varepsilon)$입니다.

**기울기를 기댓값 안으로.** 분포가 같으므로 $\E_q[R(\mathbf z)]=\E_\varepsilon[R(\mu+\sigma\odot\varepsilon)]$이고, 이제 기댓값을 취하는 분포 $\N(\mathbf 0,I)$는 $\mu$, $\sigma$와 무관합니다. 미분을 기댓값 안으로 넣고 야코비안으로 연쇄법칙을 쓰면
$$\frac{\partial}{\partial\mu_k}\E_q[R]=\E_\varepsilon\Big[\frac{\partial R}{\partial z_k}(\mathbf z)\Big],\qquad\frac{\partial}{\partial\sigma_k}\E_q[R]=\E_\varepsilon\Big[\frac{\partial R}{\partial z_k}(\mathbf z)\,\varepsilon_k\Big].$$
인코더의 매개변수 $\phi$까지는 연쇄법칙을 한 번 더 써서 $\mu_\phi$, $\sigma_\phi$를 거쳐 갑니다.

**표본으로 추정.** $\varepsilon^{(1)},\dots,\varepsilon^{(L)}$을 뽑아 $\hat g=\frac1L\sum_l\nabla_{\mu,\sigma}R(\mu+\sigma\odot\varepsilon^{(l)})$로 두면, 각 항의 기댓값이 위의 기울기이므로 $\E[\hat g]$는 참 기울기와 같습니다. VAE는 보통 $L=1$을 씁니다.

**확인.** $d=1$, $R(z)=z^2$이면 $\E_q[R]=\mu^2+\sigma^2$이라 참 기울기는 $(2\mu,2\sigma)$입니다. 위 식으로는 $\E[2z]=2\mu$, $\E[2z\varepsilon]=\E[2(\mu+\sigma\varepsilon)\varepsilon]=2\mu\E[\varepsilon]+2\sigma\E[\varepsilon^2]=2\sigma$로 같습니다.`,
    note: R`재매개변수화 없이 $\mathbf z$를 뽑으면 $\mathbf z$는 $\phi$에 대한 상수처럼 취급되어 복원 항의 기울기가 인코더에 가지 않습니다. $\phi$는 표본이 아니라 분포의 모양에 들어 있기 때문입니다. 다른 방법으로 점수 함수 추정량 $\nabla_\phi\E_q[R]=\E_q[R(\mathbf z)\nabla_\phi\log q_\phi(\mathbf z)]$도 있지만 분산이 커서, $R$이 미분 가능하고 분포를 위치와 크기로 쓸 수 있으면 재매개변수화가 표준입니다.` },
  );
})();
