/* 증명 — Part C: 07 경사하강법, 08 정규화, 09 역전파, 10–11 규제
   src가 있는 항목은 Bishop 교재의 연습문제에 해당하는 유도입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 07 경사하강법
  { ch: 'ch08', id: 'minibatch-unbiased', title: '미니배치 기울기는 불편 추정량', keys: ['배치·확률적 경사하강법', '확률적 경사하강법 (Algorithm 7.1)'],
    tags: 'SGD mini-batch unbiased gradient estimate stochastic 미니배치 불편 추정 확률적 경사하강',
    stmt: R`$E(\mathbf w)=\sum_{n=1}^NE_n(\mathbf w)$이고 크기 $B$인 미니배치 $\mathcal B$를 $N$개 중에서 무작위(비복원, 균등)로 뽑으면 $\hat{\mathbf g}=\frac NB\sum_{n\in\mathcal B}\nabla E_n(\mathbf w)$는 $\E[\hat{\mathbf g}]=\nabla E(\mathbf w)$를 만족한다.`,
    body: R`
지시함수 $\mathbb 1[n\in\mathcal B]$로 쓰면 $\hat{\mathbf g}=\frac NB\sum_{n=1}^N\mathbb 1[n\in\mathcal B]\,\nabla E_n$. 균등하게 $B$개를 뽑으므로 대칭성으로 각 $n$이 뽑힐 확률은 같고, 그 합이 $\E\big[\sum_n\mathbb 1[n\in\mathcal B]\big]=B$이므로 $P(n\in\mathcal B)=B/N$. 기댓값의 선형성으로
$$\E[\hat{\mathbf g}]=\frac NB\sum_{n=1}^NP(n\in\mathcal B)\nabla E_n=\frac NB\cdot\frac BN\sum_n\nabla E_n=\nabla E(\mathbf w).$$
$B=1$이면 SGD($N\nabla E_n$), $B=N$이면 배치 경사하강법입니다. 오차를 평균 $\frac1N\sum_nE_n$으로 정의하면 추정량은 $\frac1B\sum_{n\in\mathcal B}\nabla E_n$이 됩니다.`,
    note: R`불편이라도 **분산**은 $B$가 작을수록 큽니다(복원 추출이면 공분산이 $1/B$배). 그래서 미니배치는 잡음과 계산량의 절충이고, 그 잡음이 국소 최소 탈출을 돕기도 합니다. 분산 계산은 심층 신경망 과목 10단원에 있습니다.` },
  { ch: 'ch08', id: 'gd-quadratic', title: '이차 곡면에서 경사하강법의 수렴 조건', keys: ['배치·확률적 경사하강법'], src: 'Bishop 연습문제 7.10',
    tags: 'gradient descent quadratic Hessian eigenvalue learning rate convergence condition number 경사하강 헤시안 고윳값 학습률 수렴',
    stmt: R`$E(\mathbf w)=E(\mathbf w^\star)+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$, $\mathbf H\mathbf u_i=\lambda_i\mathbf u_i$ ($\lambda_i>0$)에서 $\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\eta\nabla E$를 쓰면 고유방향 성분이 $\alpha_i^{(\tau)}=(1-\eta\lambda_i)^\tau\alpha_i^{(0)}$이고, 수렴할 필요충분조건은 $0<\eta<2/\lambda_{\max}$이다.`,
    body: R`
$\nabla E(\mathbf w)=\mathbf H(\mathbf w-\mathbf w^\star)$이므로
$$\mathbf w^{(\tau)}-\mathbf w^\star=(\mathbf I-\eta\mathbf H)(\mathbf w^{(\tau-1)}-\mathbf w^\star).$$
$\mathbf H$는 대칭이라 정규직교 고유벡터 $\{\mathbf u_i\}$가 있고, $\mathbf w-\mathbf w^\star=\sum_i\alpha_i\mathbf u_i$로 전개하면 $(\mathbf I-\eta\mathbf H)\mathbf u_i=(1-\eta\lambda_i)\mathbf u_i$이므로 성분별로
$$\alpha_i^{(\tau)}=(1-\eta\lambda_i)\alpha_i^{(\tau-1)}=(1-\eta\lambda_i)^\tau\alpha_i^{(0)}.$$
임의의 초기값에서 $\alpha_i^{(\tau)}\to0$ ($\forall i$)일 필요충분조건은 $\lvert1-\eta\lambda_i\rvert<1$, 즉 $0<\eta\lambda_i<2$. 모든 $i$에 대해 성립하려면 $0<\eta<2/\lambda_{\max}$.

**속도.** 가장 느린 성분의 수축률은 $\max_i\lvert1-\eta\lambda_i\rvert$입니다. $\eta$를 상한 근처 $\approx2/\lambda_{\max}$로 잡아도 가장 완만한 방향은 $1-\eta\lambda_{\min}\approx1-2\lambda_{\min}/\lambda_{\max}$배씩밖에 줄지 않으므로, 곡률 비 $\lambda_{\max}/\lambda_{\min}$이 크면(가늘고 긴 골짜기) 매우 느립니다.`,
    note: R`$\eta\lambda_i>1$인 방향에서는 $1-\eta\lambda_i<0$이라 부호가 매 단계 바뀌며 진동합니다 — 교재 그림 7.3의 지그재그. 입력 정규화(9단원)는 곡률 비를 줄이고, 모멘텀·적응형 학습률은 방향마다 다른 곡률을 보정합니다.` },
  { ch: 'ch08', id: 'init-variance', title: 'Xavier 초기화와 He 초기화의 분산 유도', keys: ['He 초기화와 Xavier 초기화'], src: 'Bishop 연습문제 7.9',
    tags: 'initialization Xavier Glorot He Kaiming variance ReLU tanh 초기화 분산',
    stmt: R`층 $a_i=\sum_{j=1}^{n_{\text{in}}}w_{ij}z_j$에서 $w_{ij}$가 서로 독립이고 평균 0, 분산 $\epsilon^2$이며 $z$와 독립이면 $\E[a_i]=0$, $\E[a_i^2]=n_{\text{in}}\epsilon^2\E[z_j^2]$. 이로부터 ReLU에서 $\epsilon^2=2/n_{\text{in}}$(He), tanh에서 $\epsilon^2=2/(n_{\text{in}}+n_{\text{out}})$(Xavier)가 나온다.`,
    body: R`
**1. 한 층의 모멘트.** 독립과 $\E[w_{ij}]=0$으로 $\E[a_i]=\sum_j\E[w_{ij}]\E[z_j]=0$.
$$\E[a_i^2]=\sum_{j,k}\E[w_{ij}w_{ik}]\,\E[z_jz_k]=\sum_j\epsilon^2\E[z_j^2]=n_{\text{in}}\epsilon^2\E[z^2]$$
($j\ne k$이면 $\E[w_{ij}w_{ik}]=\E[w_{ij}]\E[w_{ik}]=0$). 여기서 필요한 것은 $z$의 **분산이 아니라 2차 모멘트** $\E[z^2]$입니다.

**2. He (ReLU).** 앞 층 사전활성 $a$는 대칭인 가중치의 합이라 0에 대해 대칭 분포입니다. $z=\max(0,a)$이면
$$\E[z^2]=\E[a^2\,\mathbb 1[a>0]]=\frac12\E[a^2].$$
따라서 $\E[(a^{(l+1)})^2]=n_{\text{in}}\epsilon^2\cdot\frac12\E[(a^{(l)})^2]$. 층을 지나도 크기가 유지되려면 $n_{\text{in}}\epsilon^2/2=1$, 즉 $\epsilon^2=2/n_{\text{in}}$ ($\epsilon=\sqrt{2/n_{\text{in}}}$).

**3. Xavier (tanh·시그모이드 계열).** 0 근처에서 $\tanh a\approx a$라 $\E[z^2]\approx\E[a^2]$. 순전파 크기 유지: $n_{\text{in}}\epsilon^2=1$. 역전파 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k\approx\sum_kw_{kj}\delta_k$에 같은 계산을 하면 $\E[\delta_j^2]=n_{\text{out}}\epsilon^2\E[\delta_k^2]$이므로 기울기 크기 유지: $n_{\text{out}}\epsilon^2=1$. 둘을 동시에 만족할 수 없으므로 절충(조화평균)
$$\epsilon^2=\frac2{n_{\text{in}}+n_{\text{out}}}.$$
균등분포 $U[-r,r]$을 쓰면 분산이 $r^2/3$이므로 $r=\sqrt{6/(n_{\text{in}}+n_{\text{out}})}$.`,
    note: R`교재 (7.22)는 “앞 층 출력의 분산 $\lambda^2$”라고 쓰지만, ReLU 출력은 평균이 0이 아니므로 정확히는 **2차 모멘트**로 읽어야 위 계산이 맞습니다. 결론 $\epsilon^2=2/M$은 같습니다.` },
  { ch: 'ch08', id: 'momentum', title: '모멘텀의 유효 학습률: 누적과 상쇄', keys: ['모멘텀'],
    tags: 'momentum effective learning rate geometric series oscillation 모멘텀 유효 학습률 기하급수 진동',
    stmt: R`$\Delta\mathbf w^{(\tau)}=-\eta\mathbf g^{(\tau)}+\mu\Delta\mathbf w^{(\tau-1)}$ ($0\le\mu<1$)에서 기울기가 일정($\mathbf g$)하면 $\Delta\mathbf w\to-\frac\eta{1-\mu}\mathbf g$, 기울기 부호가 매번 바뀌면($\pm\mathbf g$) 정상 상태의 크기가 $\frac\eta{1+\mu}\lVert\mathbf g\rVert$이다.`,
    body: R`
**일정한 기울기.** 되풀이해 대입하면
$$\Delta\mathbf w^{(\tau)}=-\eta\mathbf g\,(1+\mu+\cdots+\mu^{\tau-1})+\mu^\tau\Delta\mathbf w^{(0)}=-\eta\mathbf g\,\frac{1-\mu^\tau}{1-\mu}+\mu^\tau\Delta\mathbf w^{(0)}\ \longrightarrow\ -\frac{\eta}{1-\mu}\mathbf g.$$
**부호가 바뀌는 기울기.** $\mathbf g^{(\tau)}=(-1)^\tau\mathbf g$일 때 정상 상태를 $\Delta\mathbf w^{(\tau)}=(-1)^\tau\mathbf D$로 두면
$$(-1)^\tau\mathbf D=-\eta(-1)^\tau\mathbf g+\mu(-1)^{\tau-1}\mathbf D\ \Rightarrow\ \mathbf D=-\eta\mathbf g-\mu\mathbf D\ \Rightarrow\ \mathbf D=-\frac\eta{1+\mu}\mathbf g.$$
(일반해는 이 정상 상태에 $(\ldots)\mu^\tau$로 사라지는 항을 더한 것.)

**해석.** $\mu=0.9$이면 골짜기를 **따라가는** 방향(기울기 부호 일정)의 유효 학습률은 $10\eta$, 골짜기를 **가로지르는** 방향(부호 교대)은 $\eta/1.9\approx0.53\eta$입니다. 모멘텀은 진동을 키우지 않으면서 진행 방향만 약 19배 가속합니다.`,
    note: R`교재·슬라이드는 곡률이 큰 영역에서 “모멘텀 기여가 상쇄되어 유효 학습률이 $\eta$에 가깝다”고 표현합니다. 위 계산은 그 정확한 형태로, 증폭 없이 오히려 약간 줄어듭니다($\eta/(1+\mu)$).` },
  { ch: 'ch08', id: 'schedule-sums', title: '학습률 스케줄의 총 이동 거리', keys: ['학습률 스케줄'],
    tags: 'learning rate schedule power law exponential decay Robbins Monro series 학습률 스케줄 거듭제곱 지수 급수',
    stmt: R`지수 스케줄 $\eta^{(\tau)}=\eta^{(0)}c^{\tau/s}$ ($0<c<1$)은 $\sum_\tau\eta^{(\tau)}<\infty$이다. 거듭제곱 스케줄 $\eta^{(\tau)}=\eta^{(0)}(1+\tau/s)^c$는 $c\ge-1$이면 $\sum_\tau\eta^{(\tau)}=\infty$, $c<-\frac12$이면 $\sum_\tau(\eta^{(\tau)})^2<\infty$이다.`,
    body: R`
**지수.** $q=c^{1/s}\in(0,1)$인 등비급수이므로
$$\sum_{\tau=0}^\infty\eta^{(0)}c^{\tau/s}=\frac{\eta^{(0)}}{1-c^{1/s}}<\infty.$$
기울기의 크기가 $G$ 이하이면 전체 이동 거리 $\sum_\tau\eta^{(\tau)}\lVert\nabla E\rVert\le\frac{\eta^{(0)}G}{1-c^{1/s}}$로 유한합니다. 너무 빨리 줄이면 최소점에 닿기 전에 사실상 멈출 수 있습니다.

**거듭제곱.** $\eta^{(\tau)}=\eta^{(0)}(1+\tau/s)^c$에서 $\tau$가 크면 $\eta^{(\tau)}\sim\eta^{(0)}s^{-c}\tau^{c}$. $p$-급수 $\sum\tau^{-p}$는 $p>1$일 때만 수렴하므로
- $\sum\eta^{(\tau)}$: $p=-c$, 발산 $\iff -c\le1\iff c\ge-1$
- $\sum(\eta^{(\tau)})^2$: $p=-2c$, 수렴 $\iff -2c>1\iff c<-\frac12$

따라서 $-1\le c<-\frac12$이면 “총 보폭은 무한(어디든 도달 가능), 보폭 제곱의 합은 유한(잡음이 평균화됨)”인 로빈스-먼로 조건을 둘 다 만족합니다.

**선형.** $K$단계 뒤 $\eta^{(K)}>0$에 고정되므로 합은 발산하고, 끝까지 일정한 크기의 SGD 잡음이 남습니다.`,
    note: R`로빈스-먼로 조건은 확률적 경사하강법이 (볼록 문제 등에서) 수렴하기 위한 고전적 충분조건입니다. 실무의 딥러닝에서는 이 조건보다 학습 곡선을 보며 스케줄을 고르는 경우가 많고, 교재도 학습 곡선 관찰을 강조합니다.` },
  { ch: 'ch08', id: 'adam-bias', title: '지수이동평균의 편향 보정과 Adam', keys: ['AdaGrad, RMSProp, Adam'], src: 'Bishop 연습문제 7.12',
    tags: 'Adam bias correction exponential moving average RMSProp AdaGrad 편향 보정 지수이동평균',
    stmt: R`$s^{(\tau)}=\beta s^{(\tau-1)}+(1-\beta)g^{(\tau)}$, $s^{(0)}=0$이면 $s^{(\tau)}=(1-\beta)\sum_{k=1}^\tau\beta^{\tau-k}g^{(k)}$이고, $\E[g^{(k)}]=\bar g$ (일정)이면 $\E[s^{(\tau)}]=(1-\beta^\tau)\bar g$이다. 따라서 $\hat s=s/(1-\beta^\tau)$는 불편이다.`,
    body: R`
**전개.** 귀납법: $\tau=1$이면 $s^{(1)}=(1-\beta)g^{(1)}$. $\tau-1$에서 성립하면
$$s^{(\tau)}=\beta(1-\beta)\sum_{k=1}^{\tau-1}\beta^{\tau-1-k}g^{(k)}+(1-\beta)g^{(\tau)}=(1-\beta)\sum_{k=1}^\tau\beta^{\tau-k}g^{(k)}.$$
**기댓값.** 유한 등비급수 $\sum_{k=1}^\tau\beta^{\tau-k}=\frac{1-\beta^\tau}{1-\beta}$로
$$\E[s^{(\tau)}]=(1-\beta)\bar g\,\frac{1-\beta^\tau}{1-\beta}=(1-\beta^\tau)\bar g.$$
가중치의 합이 $1$이 아니라 $1-\beta^\tau$이기 때문에 초기에 0 쪽으로 편향되며, $(1-\beta^\tau)$로 나누면 $\E[\hat s^{(\tau)}]=\bar g$. 같은 논리가 $g^2$의 이동평균 $r$에도 적용됩니다($\beta_2$).

**Adam 갱신의 크기.** $\delta\approx0$이고 기울기가 일정($g$)하면 $\hat s=g$, $\hat r=g^2$이므로 $\Delta w=-\eta\,\hat s/\sqrt{\hat r}=-\eta\,\mathrm{sign}(g)$ — 보폭이 대략 $\eta$로 **기울기의 척도와 무관**합니다. 오차를 $c>0$배 해도 $\hat s/\sqrt{\hat r}$은 변하지 않습니다.`,
    note: R`$\beta_2=0.99$이면 $\tau=1$에서 $1-\beta_2=0.01$이라 보정 없이는 $\sqrt r$가 10배 작아져 초기 보폭이 과도하게 커집니다. 보정 인수는 $\tau$가 커지면 1로 갑니다. AdaGrad는 $r$이 단조증가하므로 유효 학습률 $\eta/\sqrt{r}$이 계속 줄어듭니다.` },

  // ───── 08 정규화
  { ch: 'ch09', id: 'input-norm', title: '정규화된 입력의 평균과 분산', keys: ['입력 정규화'], src: 'Bishop 연습문제 7.14',
    tags: 'input normalization standardization z-score mean variance 입력 정규화 표준화',
    stmt: R`$\mu_i=\frac1N\sum_nx_{ni}$, $\sigma_i^2=\frac1N\sum_n(x_{ni}-\mu_i)^2>0$, $\tilde x_{ni}=(x_{ni}-\mu_i)/\sigma_i$이면 $\frac1N\sum_n\tilde x_{ni}=0$, $\frac1N\sum_n\tilde x_{ni}^2=1$.`,
    body: R`
$$\frac1N\sum_n\tilde x_{ni}=\frac1{\sigma_i}\Big(\frac1N\sum_nx_{ni}-\mu_i\Big)=\frac1{\sigma_i}(\mu_i-\mu_i)=0,$$
$$\frac1N\sum_n\big(\tilde x_{ni}-0\big)^2=\frac1{\sigma_i^2}\cdot\frac1N\sum_n(x_{ni}-\mu_i)^2=\frac{\sigma_i^2}{\sigma_i^2}=1.$$
검증·시험 자료 $x'$에는 같은 $\mu_i,\sigma_i$로 $\tilde x'=(x'-\mu_i)/\sigma_i$를 적용하므로, 그 자료의 평균·분산은 정확히 0·1이 아닐 수 있고 그래야 맞습니다(같은 변환).`,
    note: R`단층 선형 회귀에서 오차의 헤시안은 입력의 2차 모멘트 행렬 $\sum_n\mathbf x_n\mathbf x_n^T$에 비례합니다. 척도가 다른 입력(키 1.8 대 혈소판 300,000)은 대각 원소를 $10^{10}$배 이상 벌려 곡률 비를 키우고, 표준화는 이를 1 근처로 맞춥니다.` },
  { ch: 'ch09', id: 'bn-invariance', title: '배치 정규화의 척도·이동 불변성', keys: ['배치 정규화'],
    tags: 'batch normalization invariance scale shift bias redundant weight scale 배치 정규화 불변성 척도',
    stmt: R`미니배치의 사전활성을 $a_{ni}\to ca_{ni}+b$ ($c>0$)로 바꾸어도 $\delta=0$이면 $\hat a_{ni}$는 변하지 않는다. 따라서 BN 앞 층의 편향은 불필요하고, 들어오는 가중치 $\mathbf w_i$를 $c$배 해도 출력이 같으며, 그 결과 손실의 기울기는 $\mathbf w_i$에 수직이다.`,
    body: R`
**불변성.** 새 평균·분산은 $\mu_i'=c\mu_i+b$, $\sigma_i'^2=\frac1K\sum_n(ca_{ni}+b-c\mu_i-b)^2=c^2\sigma_i^2$. 따라서
$$\hat a_{ni}'=\frac{ca_{ni}+b-c\mu_i-b}{c\sigma_i}=\frac{a_{ni}-\mu_i}{\sigma_i}=\hat a_{ni}.$$
**결과 1 (편향).** $a_{ni}=\mathbf w_i^T\mathbf z_n+b_i$의 편향 $b_i$는 모든 $n$에 같은 이동이므로 사라집니다. 이동은 BN의 $\beta_i$가 맡습니다.

**결과 2 (가중치 척도).** $\mathbf w_i\to c\mathbf w_i$이면 $a_{ni}\to ca_{ni}$이므로 출력이 같습니다: $L(c\mathbf w_i)=L(\mathbf w_i)$.

**결과 3 (기울기 방향).** 이를 $c$로 미분해 $c=1$에서 보면
$$0=\frac{d}{dc}L(c\mathbf w_i)\Big|_{c=1}=\nabla_{\mathbf w_i}L^T\mathbf w_i,$$
즉 기울기가 $\mathbf w_i$에 수직입니다. 그래서 경사하강법의 한 걸음은 $\lVert\mathbf w_i\rVert^2$를 줄이지 못하고 ($\lVert\mathbf w-\eta\nabla L\rVert^2=\lVert\mathbf w\rVert^2+\eta^2\lVert\nabla L\rVert^2$) 오히려 조금 늘립니다.`,
    note: R`$\delta>0$이면 불변성은 근사적으로만 성립합니다. 가중치 척도에 무관해지는 이 성질이 BN이 초기화·학습률에 덜 민감하고 큰 학습률을 허용하는 이유 중 하나로 꼽힙니다. 추론 때는 이동평균으로 고정된 아핀 변환이라 앞 선형층에 합칠 수 있습니다.` },
  { ch: 'ch09', id: 'ln-properties', title: '층 정규화는 예제별 척도·이동에 불변', keys: ['층 정규화'],
    tags: 'layer normalization per example invariance batch independent 층 정규화',
    stmt: R`한 예제 $n$의 모든 유닛 사전활성을 $a_{ni}\to c_na_{ni}+b_n$ ($c_n>0$)으로 바꿔도 $\delta=0$이면 층 정규화 출력은 변하지 않으며, 예제 $n$의 출력은 다른 예제에 의존하지 않는다.`,
    body: R`
층 정규화의 통계는 예제 $n$ 안의 $M$개 유닛으로 구합니다: $\mu_n'=c_n\mu_n+b_n$, $\sigma_n'^2=\frac1M\sum_i(c_na_{ni}+b_n-c_n\mu_n-b_n)^2=c_n^2\sigma_n^2$. 따라서
$$\hat a_{ni}'=\frac{c_n(a_{ni}-\mu_n)}{c_n\sigma_n}=\hat a_{ni}.$$
$\mu_n,\sigma_n$은 $a_{n1},\dots,a_{nM}$만의 함수이므로 $\hat a_{ni}$와 $\tilde a_{ni}=\gamma_i\hat a_{ni}+\beta_i$도 예제 $n$만의 함수입니다. 그래서 배치 크기와 무관하고, 학습과 추론에 같은 식을 쓸 수 있습니다.`,
    note: R`반대로 배치 정규화는 한 예제의 출력이 같은 미니배치의 다른 예제들에 의존합니다 — 그래서 추론 때 이동평균이 필요하고, 배치 크기 1에서는 $\sigma_i^2=0$이 되어 퇴화합니다.` },

  // ───── 09 역전파
  { ch: 'ch10', id: 'single-layer', title: '단층 선형 모델의 기울기', keys: ['단층 신경망의 기울기'],
    tags: 'single layer linear gradient delta rule LMS 단층 선형 기울기',
    stmt: R`$y_{nk}=\sum_iw_{ki}x_{ni}$, $E_n=\frac12\sum_k(y_{nk}-t_{nk})^2$이면 $\partial E_n/\partial w_{ji}=(y_{nj}-t_{nj})x_{ni}$.`,
    body: R`
$w_{ji}$는 출력 $y_{nj}$에만 들어 있고 $\partial y_{nk}/\partial w_{ji}=\delta_{kj}x_{ni}$ (크로네커 델타)이므로
$$\frac{\partial E_n}{\partial w_{ji}}=\sum_k(y_{nk}-t_{nk})\frac{\partial y_{nk}}{\partial w_{ji}}=\sum_k(y_{nk}-t_{nk})\delta_{kj}x_{ni}=(y_{nj}-t_{nj})x_{ni}.$$
연결의 **출력 쪽 오차 신호** $y_{nj}-t_{nj}$와 **입력 쪽 활성** $x_{ni}$의 곱입니다.`,
    note: R`SGD로 쓰면 $w_{ji}\leftarrow w_{ji}-\eta(y_{nj}-t_{nj})x_{ni}$ — 고전적인 LMS(델타) 규칙입니다. 다층망의 $\partial E_n/\partial w_{ji}=\delta_jz_i$는 이 구조를 그대로 일반화합니다.` },
  { ch: 'ch10', id: 'backprop', title: '역전파 공식과 출력층의 오차 신호', keys: ['역전파 공식'], src: 'Bishop 연습문제 8.1',
    tags: 'backpropagation chain rule delta error signal canonical link softmax cross entropy 역전파 연쇄법칙 오차 신호 교차엔트로피',
    stmt: R`$a_j=\sum_iw_{ji}z_i$, $z_j=h(a_j)$, $\delta_j\equiv\partial E_n/\partial a_j$이면 $\partial E_n/\partial w_{ji}=\delta_jz_i$, $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$. 출력층에서 (선형, 제곱오차), (시그모이드, 이진 교차엔트로피), (소프트맥스, 교차엔트로피)의 세 조합 모두 $\delta_k=y_k-t_k$이다.`,
    body: R`
**가중치 기울기.** $E_n$은 $w_{ji}$에 합 $a_j$를 통해서만 의존합니다: $\frac{\partial E_n}{\partial w_{ji}}=\frac{\partial E_n}{\partial a_j}\frac{\partial a_j}{\partial w_{ji}}=\delta_jz_i$.

**은닉 유닛.** $a_j$의 변화는 $z_j$를 통해 $j$가 연결을 보내는 유닛들의 $a_k=\sum_{j'}w_{kj'}z_{j'}+\cdots$에만 전달됩니다. 다변수 연쇄법칙으로
$$\delta_j=\sum_k\frac{\partial E_n}{\partial a_k}\frac{\partial a_k}{\partial a_j}=\sum_k\delta_k\,w_{kj}h'(a_j)=h'(a_j)\sum_kw_{kj}\delta_k.$$
**출력층.**
1. 선형 $y_k=a_k$, $E_n=\frac12\sum_k(y_k-t_k)^2$: $\delta_k=y_k-t_k$.
2. $y=\sigma(a)$, $E_n=-t\ln y-(1-t)\ln(1-y)$: $\sigma'(a)=y(1-y)$이므로
$$\delta=\Big(-\frac ty+\frac{1-t}{1-y}\Big)y(1-y)=-t(1-y)+(1-t)y=y-t.$$
3. 소프트맥스 $y_k=e^{a_k}/\sum_le^{a_l}$, $E_n=-\sum_kt_k\ln y_k$ ($\sum_kt_k=1$): $\partial\ln y_k/\partial a_l=\delta_{kl}-y_l$이므로
$$\delta_l=-\sum_kt_k(\delta_{kl}-y_l)=-t_l+y_l\sum_kt_k=y_l-t_l.$$`,
    note: R`세 경우가 같은 꼴인 것은 우연이 아니라, 출력 활성화가 해당 분포(가우시안, 베르누이, 범주형)의 **정준 연결 함수**의 역이기 때문입니다. 역전파 전체 비용은 순전파와 같은 $O(W)$입니다.` },
  { ch: 'ch10', id: 'tanh-deriv', title: 'tanh·시그모이드의 도함수와 2층망 역전파', keys: ['2층 신경망 역전파'],
    tags: 'tanh derivative sigmoid derivative two-layer network backpropagation tanh 도함수 시그모이드 2층망',
    stmt: R`$\frac{d}{da}\tanh a=1-\tanh^2a$, $\sigma'(a)=\sigma(a)\{1-\sigma(a)\}$. 따라서 tanh 은닉·선형 출력 2층망에서 $\delta_j=(1-z_j^2)\sum_kw_{kj}^{(2)}\delta_k$, $\partial E_n/\partial w_{ji}^{(1)}=\delta_jx_i$, $\partial E_n/\partial w_{kj}^{(2)}=\delta_kz_j$.`,
    body: R`
**tanh.** $\tanh a=\frac{e^a-e^{-a}}{e^a+e^{-a}}$. 몫의 미분으로
$$\frac{d}{da}\tanh a=\frac{(e^a+e^{-a})^2-(e^a-e^{-a})^2}{(e^a+e^{-a})^2}=1-\tanh^2a.$$
**시그모이드.** $\sigma(a)=(1+e^{-a})^{-1}$이면 $\sigma'(a)=\frac{e^{-a}}{(1+e^{-a})^2}=\sigma(a)\cdot\frac{e^{-a}}{1+e^{-a}}=\sigma(a)\{1-\sigma(a)\}$.

**2층망.** 출력이 선형이고 제곱오차이므로 $\delta_k=y_k-t_k$. 은닉 유닛은 역전파 공식에 $h'(a_j)=1-\tanh^2a_j=1-z_j^2$를 넣어 $\delta_j=(1-z_j^2)\sum_kw_{kj}^{(2)}\delta_k$. 가중치 기울기는 “오차 신호 × 입력 활성”으로 첫 층은 $\delta_jx_i$, 둘째 층은 $\delta_kz_j$ (편향은 $x_0=z_0=1$).`,
    note: R`두 도함수 모두 **이미 계산한 출력**($z_j$ 또는 $\sigma$)만으로 표현되어, 순전파에서 저장한 값을 그대로 재사용할 수 있습니다. 두 도함수 모두 최댓값이 각각 1과 $\frac14$이고 포화 영역에서 0에 가까워 — 깊은 망에서 기울기 소실의 원인이 됩니다.` },
  { ch: 'ch10', id: 'central-diff', title: '중앙 차분의 2차 정확도', keys: [], src: 'Bishop 연습문제 8.3',
    tags: 'numerical differentiation finite difference central difference Taylor gradient check 수치 미분 유한 차분 중앙 차분 테일러',
    stmt: R`$E$가 충분히 매끄러우면 $\frac{E(w+\epsilon)-E(w)}{\epsilon}=E'(w)+O(\epsilon)$이고 $\frac{E(w+\epsilon)-E(w-\epsilon)}{2\epsilon}=E'(w)+O(\epsilon^2)$이다.`,
    body: R`
테일러 전개:
$$E(w\pm\epsilon)=E(w)\pm\epsilon E'(w)+\frac{\epsilon^2}2E''(w)\pm\frac{\epsilon^3}6E'''(w)+O(\epsilon^4).$$
**전방 차분.** $\frac{E(w+\epsilon)-E(w)}\epsilon=E'(w)+\frac\epsilon2E''(w)+O(\epsilon^2)$ — 오차 $O(\epsilon)$.

**중앙 차분.** 두 식을 빼면 짝수 차수 항이 상쇄됩니다:
$$E(w+\epsilon)-E(w-\epsilon)=2\epsilon E'(w)+\frac{\epsilon^3}3E'''(w)+O(\epsilon^5),$$
$$\frac{E(w+\epsilon)-E(w-\epsilon)}{2\epsilon}=E'(w)+\frac{\epsilon^2}6E'''(w)+O(\epsilon^4).$$
대가는 한 가중치당 순전파 두 번. 가중치 $W$개 각각에 $O(W)$ 순전파가 필요하므로 전체 $O(W^2)$입니다.`,
    note: R`$\epsilon$을 무작정 줄이면 부동소수점 반올림 오차(대략 $\text{기계 정밀도}/\epsilon$)가 커집니다. 교재 그림 8.2에서 오차 곡선이 기울기 1(전방)·2(중앙)로 내려가다 다시 올라가는 이유입니다. 실무에서는 역전파 구현을 중앙 차분과 비교해 검증합니다.` },
  { ch: 'ch10', id: 'jacobian', title: '야코비안의 역전파와 소프트맥스 도함수', keys: ['야코비안 행렬'], src: 'Bishop 연습문제 8.5',
    tags: 'Jacobian backpropagation softmax derivative sigmoid chain rule 야코비안 소프트맥스 도함수',
    stmt: R`$J_{ki}=\partial y_k/\partial x_i=\sum_jw_{ji}\,\partial y_k/\partial a_j$이고 $\partial y_k/\partial a_j=h'(a_j)\sum_lw_{lj}\,\partial y_k/\partial a_l$. 소프트맥스 출력에서 $\partial y_k/\partial a_l=\delta_{kl}y_k-y_ky_l$.`,
    body: R`
**재귀.** 입력 $x_i$는 첫 은닉층의 $a_j=\sum_iw_{ji}x_i$를 통해서만 출력에 영향을 주므로 $J_{ki}=\sum_j\frac{\partial y_k}{\partial a_j}\frac{\partial a_j}{\partial x_i}=\sum_jw_{ji}\frac{\partial y_k}{\partial a_j}$. 은닉 유닛 $j$의 $a_j$는 $z_j=h(a_j)$를 거쳐 다음 층 $a_l$들에 들어가므로
$$\frac{\partial y_k}{\partial a_j}=\sum_l\frac{\partial y_k}{\partial a_l}\frac{\partial a_l}{\partial a_j}=h'(a_j)\sum_lw_{lj}\frac{\partial y_k}{\partial a_l}.$$
오차 역전파와 같은 재귀이며, 출력층의 $\partial y_k/\partial a_l$에서 출발합니다.

**출력층.** 선형: $y_k=a_k\Rightarrow\delta_{kl}$. 시그모이드: $y_k=\sigma(a_k)$는 $a_k$에만 의존 $\Rightarrow\delta_{kl}\sigma'(a_l)$. 소프트맥스: $y_k=e^{a_k}/S$, $S=\sum_me^{a_m}$에서 몫의 미분으로
$$\frac{\partial y_k}{\partial a_l}=\frac{\delta_{kl}e^{a_k}S-e^{a_k}e^{a_l}}{S^2}=\delta_{kl}y_k-y_ky_l.$$`,
    note: R`소프트맥스 야코비안 $\operatorname{diag}(\mathbf y)-\mathbf y\mathbf y^T$의 각 열의 합은 $y_l-y_l\sum_ky_k=0$입니다 — 출력의 합이 항상 1이므로 어떤 $a_l$을 바꿔도 출력 변화의 합은 0이어야 하기 때문입니다.` },
  { ch: 'ch10', id: 'hessian-lm', title: '제곱오차의 헤시안과 외적 근사', keys: ['헤시안의 외적 근사'], src: 'Bishop 연습문제 8.8, 8.10',
    tags: 'Hessian outer product approximation Levenberg Marquardt Gauss Newton 헤시안 외적 근사',
    stmt: R`$E=\frac12\sum_n(y_n-t_n)^2$이면 $\mathbf H=\sum_n\nabla y_n\nabla y_n^T+\sum_n(y_n-t_n)\nabla\nabla y_n$. 둘째 항을 버린 $\sum_n\nabla a_n\nabla a_n^T$는 양의 준정부호이다. 시그모이드+교차엔트로피에서는 $\mathbf H\simeq\sum_ny_n(1-y_n)\nabla a_n\nabla a_n^T$.`,
    body: R`
**제곱오차.** $\nabla E=\sum_n(y_n-t_n)\nabla y_n$. 한 번 더 미분하면(곱의 미분, $\nabla(y_n-t_n)=\nabla y_n$)
$$\mathbf H=\nabla\nabla E=\sum_n\nabla y_n(\nabla y_n)^T+\sum_n(y_n-t_n)\nabla\nabla y_n.$$
선형 출력이면 $y_n=a_n$. 잔차가 작거나, 잔차가 평균 0이고 $\nabla\nabla y_n$과 무상관이면 둘째 항은 합에서 평균적으로 사라집니다.

**양의 준정부호.** $\mathbf v^T\big(\sum_n\nabla a_n\nabla a_n^T\big)\mathbf v=\sum_n(\nabla a_n^T\mathbf v)^2\ge0$.

**교차엔트로피.** $E=-\sum_n\{t_n\ln y_n+(1-t_n)\ln(1-y_n)\}$, $y_n=\sigma(a_n)$이면 $\partial E/\partial a_n=y_n-t_n$이므로 $\nabla E=\sum_n(y_n-t_n)\nabla a_n$. 다시 미분하면 $\nabla y_n=y_n(1-y_n)\nabla a_n$이므로
$$\mathbf H=\sum_ny_n(1-y_n)\nabla a_n\nabla a_n^T+\sum_n(y_n-t_n)\nabla\nabla a_n,$$
둘째 항을 버리면 (8.41).`,
    note: R`외적 근사는 1차 도함수 $\nabla a_n$만 필요해 역전파로 $O(W)$에 구하고 $O(W^2)$에 행렬을 만듭니다. 학습되지 않은 일반적인 망에서는 둘째 항이 무시할 만하지 않다는 점을 교재가 강조합니다.` },
  { ch: 'ch10', id: 'reverse-mode', title: '후진 모드 자동 미분의 수반 변수 재귀', keys: ['전진 모드와 후진 모드 자동 미분'], src: 'Bishop 연습문제 8.16',
    tags: 'reverse mode automatic differentiation adjoint evaluation trace forward mode tangent 자동 미분 후진 모드 수반 변수',
    stmt: R`계산 그래프의 출력 $f$와 중간 변수 $v_i$에 대해 $\bar v_i\equiv\partial f/\partial v_i=\sum_{j\in\mathrm{ch}(i)}\bar v_j\,\partial v_j/\partial v_i$이다. $f(x_1,x_2)=x_1x_2+\exp(x_1x_2)-\sin x_2$에 적용하면 $\partial f/\partial x_1=x_2(1+e^{x_1x_2})$, $\partial f/\partial x_2=x_1(1+e^{x_1x_2})-\cos x_2$.`,
    body: R`
**재귀.** $f$는 $v_i$에 오직 $v_i$를 입력으로 쓰는 자식 노드 $v_j$ ($j\in\mathrm{ch}(i)$)들을 통해서만 의존합니다. 다변수 연쇄법칙으로
$$\frac{\partial f}{\partial v_i}=\sum_{j\in\mathrm{ch}(i)}\frac{\partial f}{\partial v_j}\frac{\partial v_j}{\partial v_i}.$$
그래프를 위상 순서의 **역순**으로 방문하면 오른쪽의 $\bar v_j$는 이미 계산되어 있습니다. $\bar f=1$에서 시작합니다.

**예제.** $v_3=v_1v_2$, $v_4=\sin v_2$, $v_5=e^{v_3}$, $v_6=v_3-v_4$, $v_7=v_5+v_6=f$.
- $\bar v_7=1$; $\bar v_6=\bar v_7\cdot1=1$; $\bar v_5=\bar v_7\cdot1=1$
- $\bar v_4=\bar v_6\cdot(-1)=-1$
- $\bar v_3=\bar v_5\,e^{v_3}+\bar v_6\cdot1=e^{x_1x_2}+1$ ($v_3$의 자식은 $v_5,v_6$)
- $\bar v_2=\bar v_3\,v_1+\bar v_4\cos v_2=x_1(1+e^{x_1x_2})-\cos x_2$ ($v_2$의 자식은 $v_3,v_4$)
- $\bar v_1=\bar v_3\,v_2=x_2(1+e^{x_1x_2})$

직접 미분한 값과 일치합니다. 한 번의 역방향 패스로 **모든 입력**에 대한 미분이 나옵니다.

**비용 비교.** 출력 $K$개, 입력 $D$개인 야코비안: 전진 모드는 입력마다 한 패스($D$번), 후진 모드는 출력마다 한 패스($K$번). 신경망 학습은 $K=1$(오차), $D=W$(수백만)이므로 후진 모드가 유리합니다.`,
    note: R`역전파는 후진 모드 자동 미분의 특수한 경우이고, $\delta_j=\bar a_j$입니다. 후진 모드는 역방향에서 $v_1,v_2,v_3,\dots$의 값을 다시 써야 하므로 순전파의 중간값을 모두 저장해야 합니다(메모리 비용).` },

  // ───── 10 규제 I
  { ch: 'ch11', id: 'conv-equivariance', title: '합성곱의 평행이동 등변성과 풀링의 불변성', keys: ['불변성과 등변성'],
    tags: 'equivariance invariance convolution translation pooling CNN 등변성 불변성 합성곱 평행이동 풀링',
    stmt: R`순환 합성곱 $(S\mathbf x)_i=\sum_kw_kx_{i+k}$ (첨자는 $\bmod n$)와 평행이동 $(T_s\mathbf x)_i=x_{i-s}$에 대해 $S(T_s\mathbf x)=T_s(S\mathbf x)$(등변)이고, $C(\mathbf x)=\sum_i(S\mathbf x)_i$는 $C(T_s\mathbf x)=C(\mathbf x)$(불변)이다.`,
    body: R`
**등변성.**
$$\big(S(T_s\mathbf x)\big)_i=\sum_kw_k(T_s\mathbf x)_{i+k}=\sum_kw_kx_{i+k-s}=(S\mathbf x)_{i-s}=\big(T_s(S\mathbf x)\big)_i.$$
같은 가중치 $w_k$를 모든 위치 $i$에서 **공유**하기 때문에 성립합니다. 위치마다 다른 가중치($w_{ik}$)면 성립하지 않습니다.

**불변성.** 전체 합(전역 풀링)은 순서만 바뀐 같은 원소들의 합이므로
$$C(T_s\mathbf x)=\sum_i(S\mathbf x)_{i-s}=\sum_{i'}(S\mathbf x)_{i'}=C(\mathbf x).$$
일반적으로 “등변 층들 → 불변 집계”의 구조가 불변 분류기를 만듭니다. 불변성은 출력 변환 $\tilde T$가 항등인 등변성의 특수한 경우입니다.`,
    note: R`이것이 “망 구조 설계”로 불변성을 넣는 방법(네 가지 중 넷째)이며, 파라미터 공유(12단원)가 곧 귀납적 편향이 되는 예입니다. 실제 CNN은 경계 처리와 보폭(stride) 때문에 근사적으로만 등변입니다.` },
  { ch: 'ch11', id: 'wd-shrink', title: '가중치 감쇠는 둔감한 방향을 더 줄인다', keys: ['가중치 감쇠'], src: 'Bishop 연습문제 9.3',
    tags: 'weight decay shrinkage Hessian eigenvalue effective number of parameters 가중치 감쇠 축소 유효 파라미터',
    stmt: R`$E(\mathbf w)=E_0+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$에 $\frac\lambda2\mathbf w^T\mathbf w$를 더한 최소점은 헤시안 고유좌표에서 $\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$이다. 또 $\nabla E=0$인 곳에서 가중치 감쇠만 있으면 가중치는 지수적으로 0으로 감쇠한다.`,
    body: R`
**축소.** $\nabla\widetilde E=\mathbf H(\mathbf w-\mathbf w^\star)+\lambda\mathbf w=0\Rightarrow(\mathbf H+\lambda\mathbf I)\hat{\mathbf w}=\mathbf H\mathbf w^\star$. $\mathbf H=\sum_j\lambda_j\mathbf u_j\mathbf u_j^T$ (정규직교)이므로 $\mathbf u_j^T$를 곱하면 $(\lambda_j+\lambda)\hat w_j=\lambda_jw_j^\star$, 즉
$$\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star\qquad(\hat w_j=\mathbf u_j^T\hat{\mathbf w},\ w_j^\star=\mathbf u_j^T\mathbf w^\star).$$
$\lambda_j\gg\lambda$이면 $\hat w_j\approx w_j^\star$, $\lambda_j\ll\lambda$이면 $\hat w_j\approx0$. 유효 파라미터 수를 $\gamma=\sum_j\frac{\lambda_j}{\lambda_j+\lambda}$로 정의하면 $\lambda=0$에서 전체 수, $\lambda\to\infty$에서 0입니다.

**감쇠.** 오차 항이 없을 때 $\mathbf w^{(\tau+1)}=\mathbf w^{(\tau)}-\eta\lambda\mathbf w^{(\tau)}=(1-\eta\lambda)\mathbf w^{(\tau)}$이므로 $\mathbf w^{(\tau)}=(1-\eta\lambda)^\tau\mathbf w^{(0)}$. 연속 극한($\eta\to0$)의 미분방정식 $\frac{d\mathbf w}{dt}=-\lambda\mathbf w$의 해는 $\mathbf w(t)=e^{-\lambda t}\mathbf w_0$ — “가중치 감쇠”라는 이름의 유래입니다.`,
    note: R`곡률 $\lambda_j$가 작다는 것은 그 방향으로 가중치를 움직여도 오차가 거의 안 변한다는 뜻(자료가 그 방향을 잘 결정하지 못함)입니다. 규제는 자료가 지지하지 않는 방향부터 없앱니다.` },
  { ch: 'ch11', id: 'consistent', title: '선형 변환과 일관된 규제', keys: ['일관된 규제'], src: 'Bishop 연습문제 9.4',
    tags: 'consistent regularizer linear transformation invariance weight decay biases 일관된 규제 선형 변환 편향',
    stmt: R`2층 MLP에서 입력 $x_i\to ax_i+b$는 $w_{ji}\to w_{ji}/a$, $w_{j0}\to w_{j0}-\frac ba\sum_iw_{ji}$로, 출력 $y_k\to cy_k+d$는 $w_{kj}\to cw_{kj}$, $w_{k0}\to cw_{k0}+d$로 정확히 보정된다. $\frac{\lambda_1}2\sum_{\mathcal W_1}w^2+\frac{\lambda_2}2\sum_{\mathcal W_2}w^2$ (편향 제외)는 $\lambda_1\to a^2\lambda_1$, $\lambda_2\to c^{-2}\lambda_2$로 바꾸면 불변이다.`,
    body: R`
**입력 변환.** 새 첫 층의 사전활성:
$$\sum_i\frac{w_{ji}}a(ax_i+b)+w_{j0}-\frac ba\sum_iw_{ji}=\sum_iw_{ji}x_i+\frac ba\sum_iw_{ji}+w_{j0}-\frac ba\sum_iw_{ji}=\sum_iw_{ji}x_i+w_{j0}.$$
따라서 $z_j$가 그대로이고 망의 출력도 같습니다.

**출력 변환.** $\sum_jcw_{kj}z_j+cw_{k0}+d=c\Big(\sum_jw_{kj}z_j+w_{k0}\Big)+d=cy_k+d$.

**규제항.** 두 망은 동등하므로 규제가 둘을 똑같이 평가해야 합니다(일관성).
$$\frac{\tilde\lambda_1}2\sum_{\mathcal W_1}\Big(\frac wa\Big)^2=\frac{\lambda_1}2\sum_{\mathcal W_1}w^2\iff\tilde\lambda_1=a^2\lambda_1,\qquad \frac{\tilde\lambda_2}2\sum_{\mathcal W_2}(cw)^2=\frac{\lambda_2}2\sum_{\mathcal W_2}w^2\iff\tilde\lambda_2=\frac{\lambda_2}{c^2}.$$
층마다 **다른** 계수가 필요하므로 하나의 $\lambda$로는 안 되고, 편향은 임의의 이동($-\frac ba\sum w_{ji}$, $+d$)을 받으므로 제곱합에 넣으면 어떤 척도로도 보정할 수 없어 **제외**해야 합니다.`,
    note: R`교재 본문(과 PRML 5.5.1)에는 $\lambda_1\to a^{1/2}\lambda_1$, $\lambda_2\to c^{-1/2}\lambda_2$로 인쇄되어 있지만, 위 계산처럼 $a^2$, $c^{-2}$가 맞습니다.` },
  { ch: 'ch11', id: 'lasso-sparsity', title: '라쏘가 정확히 0인 가중치를 만드는 이유', keys: ['일반화된 가중치 감쇠'], src: 'Bishop 연습문제 9.5',
    tags: 'lasso L1 sparsity soft thresholding Lagrange multiplier constraint 라쏘 희소성 연성 임계 라그랑주',
    stmt: R`(i) $E(\mathbf w)+\frac\lambda2\sum_j\lvert w_j\rvert^q$의 최소점 $\hat{\mathbf w}$는 $\eta=\sum_j\lvert\hat w_j\rvert^q$로 둔 제약 문제 $\min E$ s.t. $\sum_j\lvert w_j\rvert^q\le\eta$의 해이다. (ii) 1차원 $\frac h2(w-w^\star)^2+\frac\lambda2\lvert w\rvert$ ($h>0$)의 최소점은 $\hat w=\operatorname{sign}(w^\star)\max\big(\lvert w^\star\rvert-\frac\lambda{2h},0\big)$이다.`,
    body: R`
**(i) 제약 문제와의 동치.** $\hat{\mathbf w}$가 벌점 문제의 최소점이고 $\eta=\sum_j\lvert\hat w_j\rvert^q$라 하자. 제약을 만족하는 임의의 $\mathbf w$ ($\sum\lvert w_j\rvert^q\le\eta$)에 대해
$$\begin{aligned}E(\mathbf w)+\frac\lambda2\sum_j\lvert w_j\rvert^q&\ge E(\hat{\mathbf w})+\frac\lambda2\eta\\ \Rightarrow\quad E(\mathbf w)&\ge E(\hat{\mathbf w})+\frac\lambda2\Big(\eta-\sum_j\lvert w_j\rvert^q\Big)\ge E(\hat{\mathbf w}).\end{aligned}$$
즉 $\hat{\mathbf w}$는 제약 영역 안에서 $E$를 최소화합니다. $\lambda$는 제약의 라그랑주 승수 역할이며, $\lambda$가 클수록 $\eta$가 작아집니다.

**(ii) 연성 임계(soft thresholding).** $f(w)=\frac h2(w-w^\star)^2+\frac\lambda2\lvert w\rvert$는 볼록입니다.
- $w>0$ 영역: $f'(w)=h(w-w^\star)+\frac\lambda2=0\Rightarrow w=w^\star-\frac\lambda{2h}$, 이 값이 양수일 때($w^\star>\frac\lambda{2h}$)만 유효.
- $w<0$ 영역: 대칭적으로 $w=w^\star+\frac\lambda{2h}$, $w^\star<-\frac\lambda{2h}$일 때.
- 그 외 $\lvert w^\star\rvert\le\frac\lambda{2h}$: 0에서의 좌우 미분 $f'(0^\pm)=-hw^\star\pm\frac\lambda2$가 $f'(0^-)\le0\le f'(0^+)$를 만족하므로 $w=0$이 최소점.

따라서 $\lvert w^\star\rvert$가 임계값 $\frac\lambda{2h}$ 이하인 가중치는 **정확히 0**이 됩니다.

**비교 (L2).** $\frac h2(w-w^\star)^2+\frac\lambda2w^2$의 최소점은 $\hat w=\frac h{h+\lambda}w^\star$로, $w^\star\ne0$이면 결코 0이 되지 않습니다.`,
    note: R`L1 벌점의 기울기는 0 근처에서도 크기 $\frac\lambda2$로 일정해 작은 가중치를 끝까지 0으로 밀지만, L2 벌점의 기울기 $\lambda w$는 0에 가까울수록 사라집니다. 이것이 마름모 제약의 꼭짓점 그림과 같은 이야기입니다.` },
  { ch: 'ch11', id: 'early-stopping', title: '조기 종료와 가중치 감쇠의 동등성', keys: ['조기 종료'], src: 'Bishop 연습문제 9.6',
    tags: 'early stopping weight decay equivalence quadratic Hessian eigenvalue 조기 종료 가중치 감쇠',
    stmt: R`이차 오차에서 $\mathbf w^{(0)}=\mathbf 0$, $\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\rho\nabla E$이면 $w_j^{(\tau)}=\{1-(1-\rho\eta_j)^\tau\}w_j^\star$ ($\mathbf H\mathbf u_j=\eta_j\mathbf u_j$). $\eta_j\gg(\rho\tau)^{-1}$이면 $w_j^{(\tau)}\simeq w_j^\star$, $\eta_j\ll(\rho\tau)^{-1}$이면 $w_j^{(\tau)}\simeq\rho\tau\eta_jw_j^\star$로, $\lambda=(\rho\tau)^{-1}$인 가중치 감쇠와 같은 꼴이다.`,
    body: R`
$\nabla E=\mathbf H(\mathbf w-\mathbf w^\star)$이므로 $\mathbf w^{(\tau)}-\mathbf w^\star=(\mathbf I-\rho\mathbf H)(\mathbf w^{(\tau-1)}-\mathbf w^\star)$. 고유좌표에서 성분별로
$$w_j^{(\tau)}-w_j^\star=(1-\rho\eta_j)^\tau(w_j^{(0)}-w_j^\star)=-(1-\rho\eta_j)^\tau w_j^\star\ \Rightarrow\ w_j^{(\tau)}=\{1-(1-\rho\eta_j)^\tau\}w_j^\star.$$
$\lvert1-\rho\eta_j\rvert<1$이면 $\tau\to\infty$에서 $\mathbf w^{(\tau)}\to\mathbf w^\star$.

**유한 $\tau$.** $\rho\eta_j$가 작으면 $(1-\rho\eta_j)^\tau\approx e^{-\rho\tau\eta_j}$.
- $\eta_j\gg(\rho\tau)^{-1}$: $e^{-\rho\tau\eta_j}\approx0$이므로 $w_j^{(\tau)}\simeq w_j^\star$.
- $\eta_j\ll(\rho\tau)^{-1}$: $e^{-\rho\tau\eta_j}\approx1-\rho\tau\eta_j$이므로 $w_j^{(\tau)}\simeq\rho\tau\eta_j\,w_j^\star$, $\lvert w_j^{(\tau)}\rvert\ll\lvert w_j^\star\rvert$.

**가중치 감쇠와 비교.** $\hat w_j=\frac{\eta_j}{\eta_j+\lambda}w_j^\star$는 $\eta_j\gg\lambda$이면 $\approx w_j^\star$, $\eta_j\ll\lambda$이면 $\approx\frac{\eta_j}\lambda w_j^\star$. $\lambda=(\rho\tau)^{-1}$로 두면 두 극한이 **정확히 일치**합니다. 학습을 오래 할수록($\tau\uparrow$) 유효 $\lambda$가 작아져 유효 복잡도가 커집니다.`,
    note: R`곡률이 큰 방향이 먼저 수렴하고 완만한 방향은 원점 근처에 머문 채로 멈추기 때문입니다(교재 그림 9.8). 검증 오차로 $\tau$를 고르는 것은 $\lambda$를 고르는 것과 같은 일을 학습 한 번으로 해냅니다.` },

  // ───── 11 규제 II
  { ch: 'ch12', id: 'soft-share', title: '소프트 가중치 공유의 기울기', keys: ['소프트 가중치 공유'], src: 'Bishop 연습문제 9.9, 9.10',
    tags: 'soft weight sharing mixture of Gaussians responsibility gradient 소프트 가중치 공유 혼합 가우시안 책임도',
    stmt: R`$\Omega(\mathbf w)=-\sum_i\ln\sum_j\pi_j\N(w_i\mid\mu_j,\sigma_j^2)$, $\gamma_j(w_i)=\frac{\pi_j\N(w_i\mid\mu_j,\sigma_j^2)}{\sum_k\pi_k\N(w_i\mid\mu_k,\sigma_k^2)}$이면 $\frac{\partial\Omega}{\partial w_i}=\sum_j\gamma_j(w_i)\frac{w_i-\mu_j}{\sigma_j^2}$, $\frac{\partial\Omega}{\partial\mu_j}=\sum_i\gamma_j(w_i)\frac{\mu_j-w_i}{\sigma_j^2}$.`,
    body: R`
가우시안의 도함수: $\frac{\partial}{\partial w}\N(w\mid\mu,\sigma^2)=-\frac{w-\mu}{\sigma^2}\N(w\mid\mu,\sigma^2)$, $\frac{\partial}{\partial\mu}\N(w\mid\mu,\sigma^2)=\frac{w-\mu}{\sigma^2}\N(w\mid\mu,\sigma^2)$.

**$w_i$에 대해.** $\Omega$에서 $w_i$가 들어 있는 항은 $-\ln\sum_j\pi_j\N_j(w_i)$ 하나뿐이므로
$$\frac{\partial\Omega}{\partial w_i}=-\frac{\sum_j\pi_j\big(-\frac{w_i-\mu_j}{\sigma_j^2}\big)\N_j(w_i)}{\sum_k\pi_k\N_k(w_i)}=\sum_j\gamma_j(w_i)\frac{w_i-\mu_j}{\sigma_j^2}.$$
**$\mu_j$에 대해.** 모든 $i$의 항에 $\mu_j$가 들어 있으므로
$$\frac{\partial\Omega}{\partial\mu_j}=-\sum_i\frac{\pi_j\frac{w_i-\mu_j}{\sigma_j^2}\N_j(w_i)}{\sum_k\pi_k\N_k(w_i)}=\sum_i\gamma_j(w_i)\frac{\mu_j-w_i}{\sigma_j^2}.$$
이를 0으로 두면 $\mu_j=\frac{\sum_i\gamma_j(w_i)w_i}{\sum_i\gamma_j(w_i)}$ — 책임도로 가중한 가중치들의 평균입니다.`,
    note: R`$\widetilde E=E+\lambda\Omega$의 경사하강에서 $-\lambda\,\partial\Omega/\partial w_i$는 각 가중치를 성분 중심 $\mu_j$ 쪽으로, 그 성분의 책임도 $\gamma_j(w_i)$와 정밀도 $1/\sigma_j^2$에 비례하는 힘으로 끌어당깁니다. 성분이 하나이고 $\mu=0$이면 보통의 가중치 감쇠로 돌아갑니다.` },
  { ch: 'ch12', id: 'residual-paths', title: '잔차망의 기울기는 경로들의 합', keys: ['잔차 연결'], src: 'Bishop 연습문제 9.13',
    tags: 'residual connection skip connection Jacobian paths ensemble gradient ResNet 잔차 연결 경로 야코비안',
    stmt: R`$\mathbf z_l=F_l(\mathbf z_{l-1})+\mathbf z_{l-1}$ ($\mathbf z_0=\mathbf x$, $l=1,\dots,L$)이면 $\frac{\partial\mathbf z_L}{\partial\mathbf x}=\prod_{l=L}^{1}(\mathbf I+J_l)$ ($J_l=\partial F_l/\partial\mathbf z_{l-1}$)이고, 이를 전개하면 항등행렬을 포함한 $2^L$개 경로 항의 합이다.`,
    body: R`
**블록의 야코비안.** $\frac{\partial\mathbf z_l}{\partial\mathbf z_{l-1}}=J_l+\mathbf I$. 연쇄법칙으로
$$\frac{\partial\mathbf z_L}{\partial\mathbf x}=(\mathbf I+J_L)(\mathbf I+J_{L-1})\cdots(\mathbf I+J_1).$$
**전개.** 각 괄호에서 $\mathbf I$(건너뜀) 또는 $J_l$(통과)을 고르므로
$$\frac{\partial\mathbf z_L}{\partial\mathbf x}=\mathbf I+\sum_lJ_l+\sum_{l>m}J_lJ_m+\cdots+J_L\cdots J_1,$$
$2^L$개 항 각각은 블록들의 부분집합을 통과하는 경로입니다. 순전파도 마찬가지로, $L=3$에서 대입하면 교재 (9.40)의 $\mathbf y=F_3(\cdots)+F_2(F_1(\mathbf x)+\mathbf x)+F_1(\mathbf x)+\mathbf x$처럼 깊이가 다른 부분망들의 합이 됩니다.

**결과.** 잔차가 없는 망의 야코비안은 $J_L\cdots J_1$ 하나뿐이라 $J_l$이 작으면 곱이 지수적으로 0에 가까워지고(소실), 흩어지면 산산조각 납니다. 잔차망에는 **항등 경로 $\mathbf I$와 짧은 경로들**이 항상 있어, 개별 $J_l$이 작거나 불규칙해도 기울기가 소실되지 않고 매끄럽습니다.`,
    note: R`이 전개는 “잔차망 = 여러 깊이의 얕은 망들의 앙상블”이라는 해석(교재 그림 9.15)의 수학적 근거입니다. $F_l\approx0$이면 블록이 항등 변환이 되므로 층을 더해도 성능이 나빠지지 않도록 학습을 시작할 수 있습니다.` },
  { ch: 'ch12', id: 'committee', title: '위원회 오차의 감소', keys: ['위원회 오차'], src: 'Bishop 연습문제 9.14, 9.15',
    tags: 'committee ensemble model averaging variance reduction Jensen bagging 위원회 앙상블 모델 평균 배깅',
    stmt: R`$y_m=h+\epsilon_m$, $y_{\text{COM}}=\frac1M\sum_my_m$, $E_{\text{AV}}=\frac1M\sum_m\E[\epsilon_m^2]$, $E_{\text{COM}}=\E\big[(\frac1M\sum_m\epsilon_m)^2\big]$. 오차가 평균 0이고 무상관이면 $E_{\text{COM}}=\frac1ME_{\text{AV}}$이고, 가정 없이 $E_{\text{COM}}\le E_{\text{AV}}$이다.`,
    body: R`
**무상관일 때.**
$$E_{\text{COM}}=\frac1{M^2}\E\Big[\sum_m\sum_l\epsilon_m\epsilon_l\Big]=\frac1{M^2}\Big(\sum_m\E[\epsilon_m^2]+\sum_{m\ne l}\E[\epsilon_m\epsilon_l]\Big).$$
$\E[\epsilon_m\epsilon_l]=0$ ($m\ne l$)이면 $E_{\text{COM}}=\frac1{M^2}\sum_m\E[\epsilon_m^2]=\frac1M\cdot\frac1M\sum_m\E[\epsilon_m^2]=\frac1ME_{\text{AV}}$.

**일반적인 경우.** $f(u)=u^2$은 볼록이므로 옌센 부등식(가중치 $\frac1M$)으로 각 $\mathbf x$에서
$$\Big(\frac1M\sum_m\epsilon_m(\mathbf x)\Big)^2\le\frac1M\sum_m\epsilon_m(\mathbf x)^2.$$
양변에 $\E_{\mathbf x}$를 취하면 $E_{\text{COM}}\le E_{\text{AV}}$. 등호는 모든 $\epsilon_m(\mathbf x)$가 같을 때(완전 상관)입니다.

**상관이 있으면.** 모든 $\E[\epsilon_m^2]=v$, $\E[\epsilon_m\epsilon_l]=\rho v$ ($m\ne l$)이면 $E_{\text{COM}}=\frac{v}{M}+\frac{M-1}M\rho v\to\rho v$ ($M\to\infty$). 모델을 아무리 늘려도 상관 부분 $\rho v$는 남습니다.`,
    note: R`그래서 앙상블에는 **다양성**(서로 다른 오차)이 필요하고, 배깅은 부트스트랩 자료로 이를 만듭니다. 복원 추출로 $N$개를 뽑으면 특정 점이 빠질 확률은 $(1-\frac1N)^N\to e^{-1}\approx0.368$, 즉 각 부트스트랩 자료는 원래 점의 약 63%만 포함합니다.` },
  { ch: 'ch12', id: 'dropout', title: '드롭아웃 추론의 가중치 척도와 선형회귀에서의 규제 효과', keys: ['드롭아웃'], src: 'Bishop 연습문제 9.18',
    tags: 'dropout weight scaling inference expectation Bernoulli mask regularization 드롭아웃 가중치 척도 베르누이 마스크',
    stmt: R`마스크 $R_i\sim\text{Bernoulli}(\rho)$를 곱한 입력 $a=\sum_iw_iR_iz_i$는 $\E[a]=\sum_i(\rho w_i)z_i$이다. 또 선형 모델 $y_k=\sum_iw_{ki}R_{ni}x_{ni}$의 제곱오차를 마스크에 대해 평균하면 $\sum_{n,k}\big(t_{nk}-\rho\sum_iw_{ki}x_{ni}\big)^2+\rho(1-\rho)\sum_{n,k,i}w_{ki}^2x_{ni}^2$이다.`,
    body: R`
**추론 척도.** $\E[R_i]=\rho$이고 $R_i$만 무작위이므로 선형성으로 $\E[a]=\sum_iw_i\E[R_i]z_i=\sum_i(\rho w_i)z_i$. 마스크 없이 전체 망을 쓸 때 나가는 가중치에 $\rho$를 곱하면 각 노드가 받는 입력이 학습 때의 **기댓값**과 같아집니다.

**선형회귀.** $u_{nk}=\sum_iw_{ki}R_{ni}x_{ni}$로 두면 $\E[u_{nk}]=\rho\sum_iw_{ki}x_{ni}$이고, $R_{ni}$들이 독립이며 $\Var[R_{ni}]=\rho-\rho^2=\rho(1-\rho)$이므로
$$\Var[u_{nk}]=\sum_iw_{ki}^2x_{ni}^2\,\rho(1-\rho).$$
$\E[(t-u)^2]=(t-\E[u])^2+\Var[u]$이므로
$$\E\big[E(\mathbf W)\big]=\sum_{n,k}\Big(t_{nk}-\rho\sum_iw_{ki}x_{ni}\Big)^2+\rho(1-\rho)\sum_{n,k,i}w_{ki}^2x_{ni}^2.$$
둘째 항은 입력의 크기 $x_{ni}^2$로 가중된 **이차 규제**(가중치 감쇠의 변형)입니다.`,
    note: R`$\E[R_iR_j]=\delta_{ij}\rho+(1-\delta_{ij})\rho^2$를 쓰면 같은 결과를 전개로 얻습니다. 비선형 망에서는 $\E[h(a)]\ne h(\E[a])$라 가중치 척도 조정이 근사일 뿐이고, 그래서 몬테카를로 드롭아웃(마스크 10–20개 평균)이 대안이 됩니다.` },
  );
})();
