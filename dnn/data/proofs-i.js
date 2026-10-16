/* 판서에 없는 증명 — Part i: 09–13 (수업 판서에서 증명하지 않았지만 시험에 중요한 공식)
   src가 없으므로 증명 탭에 ‘판서에 없는 증명’으로 표시됩니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 09
  { ch: 'ch09', id: 'gdstop', title: '경사하강법의 정지 조건과 극한점', keys: ['경사하강법 알고리즘'],
    tags: 'gradient descent stopping criterion termination iteration count stationary point limit point 경사하강법 정지 조건 종료 반복 횟수 정류점 극한점',
    stmt: R`손실 $\mathcal L:\mathbb R^d\to\mathbb R$이 $\beta$-매끄럽고(기울기가 $\beta$-립시츠) 아래로 유계($\mathcal L^*=\inf\mathcal L>-\infty$)이며, 경사하강법 $\theta^{k+1}=\theta^k-\alpha\nabla\mathcal L(\theta^k)$의 보폭이 $0<\alpha<2/\beta$라 하자. (i) $\sum_{k=0}^\infty\lVert\nabla\mathcal L(\theta^k)\rVert^2\le\frac{2(\mathcal L(\theta^0)-\mathcal L^*)}{\alpha(2-\alpha\beta)}<\infty$이고, 따라서 $\nabla\mathcal L(\theta^k)\to0$, $\lVert\theta^{k+1}-\theta^k\rVert\to0$. (ii) 모든 $\epsilon>0$에 대해 정지 조건 $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$은 어떤 $k\le K_\epsilon:=\Big\lfloor\frac{2\alpha(\mathcal L(\theta^0)-\mathcal L^*)}{(2-\alpha\beta)\epsilon^2}\Big\rfloor$에서 성립하고, 그때 $\lVert\nabla\mathcal L(\theta^k)\rVert<\epsilon/\alpha$. (iii) $\mathcal L\in C^1$이고 $\alpha>0$이기만 하면, 반복점이 어떤 $\bar\theta$로 수렴할 때 $\nabla\mathcal L(\bar\theta)=0$이다.`,
    body: R`
**1. 한 걸음의 감소.** 하강 보조정리에 $\theta^{k+1}-\theta^k=-\alpha\nabla\mathcal L(\theta^k)$를 넣은 감소 조건(13.4절)은
$$\mathcal L(\theta^{k+1})\le\mathcal L(\theta^k)-c\,\lVert\nabla\mathcal L(\theta^k)\rVert^2,$$
$$c:=\alpha\Big(1-\frac{\alpha\beta}2\Big)=\frac{\alpha(2-\alpha\beta)}2.$$
가정 $0<\alpha<2/\beta$에서 $2-\alpha\beta>0$이므로 $c>0$입니다.

**2. 기울기 제곱의 합은 유한하다.** 1을 $k=0,\dots,K-1$에 대해 더하면 오른쪽이 망원급수가 되어
$$\begin{aligned}c\sum_{k=0}^{K-1}\lVert\nabla\mathcal L(\theta^k)\rVert^2&\le\mathcal L(\theta^0)-\mathcal L(\theta^K)\\&\le\mathcal L(\theta^0)-\mathcal L^*.\end{aligned}$$
음이 아닌 항들의 부분합이 $K$와 무관한 값 $S:=(\mathcal L(\theta^0)-\mathcal L^*)/c$ 이하이므로 급수가 수렴하고 그 합도 $S$ 이하입니다 — (i)의 부등식입니다. 수렴하는 급수의 항은 0으로 가므로 $\nabla\mathcal L(\theta^k)\to0$이고, 갱신식에서 $\lVert\theta^{k+1}-\theta^k\rVert=\alpha\lVert\nabla\mathcal L(\theta^k)\rVert\to0$.

**3. 정지 조건은 언제 만족되나.** $\lVert\theta^{k+1}-\theta^k\rVert\ge\epsilon$인 첨자 $k$들의 집합을 $J$라 합시다. $k\in J$이면 $\lVert\nabla\mathcal L(\theta^k)\rVert^2=\lVert\theta^{k+1}-\theta^k\rVert^2/\alpha^2\ge\epsilon^2/\alpha^2$이므로, 2의 합에서 $J$에 속한 항만 남겨도
$$\lvert J\rvert\cdot\frac{\epsilon^2}{\alpha^2}\le S,$$
$$\lvert J\rvert\le\frac{\alpha^2S}{\epsilon^2}=\frac{2\alpha(\mathcal L(\theta^0)-\mathcal L^*)}{(2-\alpha\beta)\epsilon^2}.$$
$\lvert J\rvert$는 정수이므로 $\lvert J\rvert\le K_\epsilon$. 첨자 $0,1,\dots,K_\epsilon$은 $K_\epsilon+1$개라 모두 $J$에 들어갈 수는 없고, $J$에 들지 않는 $k\le K_\epsilon$에서 $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$입니다. 그때 $\lVert\nabla\mathcal L(\theta^k)\rVert=\lVert\theta^{k+1}-\theta^k\rVert/\alpha<\epsilon/\alpha$.

**4. 극한점은 정류점.** 여기서는 $\mathcal L\in C^1$과 $\alpha>0$만 씁니다. $\theta^k\to\bar\theta$이면 $\theta^{k+1}\to\bar\theta$이기도 하므로 $\theta^k-\theta^{k+1}\to0$. 갱신식에서 $\nabla\mathcal L(\theta^k)=(\theta^k-\theta^{k+1})/\alpha\to0$이고, $\nabla\mathcal L$이 연속이므로 $\nabla\mathcal L(\bar\theta)=\lim_k\nabla\mathcal L(\theta^k)=0$.`,
    note: R`정지 조건 $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$이 말해 주는 것은 “기울기가 $\epsilon/\alpha$보다 작은 점에 왔다”뿐이고, 최솟점에 왔다는 것이 아닙니다. 정류점은 국소 최소일 수도 안장점일 수도 있으며, 어디에 멈출지는 초기화 $\theta^0$에 달려 있습니다(9.1절의 손실 곡면). 횟수 $K_\epsilon$은 $1/\epsilon^2$에 비례하는 최악의 상한입니다. $\alpha=1/\beta$로 두면 3의 논증은 13.4절의 $\min_{k<T}\lVert\nabla\mathcal L(\theta^k)\rVert^2\le\frac{2\beta(\mathcal L(\theta^0)-\mathcal L^*)}T$와 같은 내용입니다.` },
  { ch: 'ch09', id: 'batchmat', title: '배치 행렬곱의 역전파',
    tags: 'batch matrix multiplication backpropagation minibatch row convention linear layer outer product sum over samples 배치 행렬곱 역전파 미니배치 행 관례 선형층 외적 표본 합',
    stmt: R`표본 $B$개를 행으로 쌓은 $X\in\mathbb R^{B\times N}$ ($b$번째 행 $x_b^T$)과 $W\in\mathbb R^{M\times N}$로 $Z=XW^T\in\mathbb R^{B\times M}$를 계산하고, 스칼라 손실 $L$이 $Z$를 통해서만 $X,W$에 의존한다고 하자. $G:=\frac{\partial L}{\partial Z}\in\mathbb R^{B\times M}$ ($G_{bi}=\partial L/\partial Z_{bi}$, $b$번째 행을 $\delta_b^T$로 씀)라 하면
$$\frac{\partial L}{\partial X}=GW\quad(B\times N),$$
$$\frac{\partial L}{\partial W}=G^TX=\sum_{b=1}^B\delta_bx_b^T\quad(M\times N).$$`,
    body: R`
**1. 성분으로 쓰기.** $Z=XW^T$의 성분은 $Z_{bi}=\sum_{j=1}^NX_{bj}W_{ij}$, 즉 $Z$의 $b$번째 행은 $z_b=Wx_b$ — 표본 $b$에 9.5절의 $z=Wx$를 적용한 것입니다. $L$은 $Z$의 $BM$개 성분을 통해서만 의존하므로, 다변수 연쇄법칙으로 임의의 변수 $\theta$에 대해
$$\frac{\partial L}{\partial\theta}=\sum_{b'=1}^B\sum_{i=1}^MG_{b'i}\,\frac{\partial Z_{b'i}}{\partial\theta}.$$

**2. 입력에 대한 기울기.** $X_{bj}$는 $b$번째 행의 $Z_{b1},\dots,Z_{bM}$에만 들어가므로 $\frac{\partial Z_{b'i}}{\partial X_{bj}}=\mathbb 1[b'=b]\,W_{ij}$. 1에 넣으면 $b'$에 대한 합에서 $b'=b$인 항만 남아
$$\frac{\partial L}{\partial X_{bj}}=\sum_{i=1}^MG_{bi}W_{ij}=(GW)_{bj}.$$
$b$번째 행만 보면 $(W^T\delta_b)^T$ — 9.5절의 $W^T\delta$를 표본마다 따로 쓴 것이고, 다른 표본의 상류 기울기는 섞이지 않습니다.

**3. 가중치에 대한 기울기.** $W_{ij}$는 **모든 표본**의 $i$번째 출력 $Z_{1i},\dots,Z_{Bi}$에 들어가므로(복사 게이트) $\frac{\partial Z_{bi'}}{\partial W_{ij}}=\mathbb 1[i'=i]\,X_{bj}$. 1에 넣으면 $i'$에 대한 합에서는 $i'=i$만 남고 $b$에 대한 합은 그대로 남아
$$\frac{\partial L}{\partial W_{ij}}=\sum_{b=1}^BG_{bi}X_{bj}=(G^TX)_{ij}.$$
$G^T$의 $b$번째 열은 $\delta_b$, $X$의 $b$번째 행은 $x_b^T$이므로 행렬곱을 “열 × 행”의 합으로 쓰면 $G^TX=\sum_b\delta_bx_b^T$ — 표본별 외적(9.5절의 $\delta x^T$)을 모두 더한 것입니다.

**4. 크기 점검.** $GW$는 $(B\times M)(M\times N)=B\times N$으로 $X$와 같은 크기이고, $G^TX$는 $(M\times B)(B\times N)=M\times N$으로 $W$와 같은 크기입니다. $B=1$이면 $G=\delta^T$, $X=x^T$라 두 식은 $\frac{\partial L}{\partial x}=W^T\delta$, $\frac{\partial L}{\partial W}=\delta x^T$로 돌아갑니다.

**5. 평균 손실이면.** $L=\frac1B\sum_b\ell_b(z_b)$이면 $\delta_b=\frac1B\nabla_{z_b}\ell_b$이므로
$$\frac{\partial L}{\partial W}=\frac1B\sum_{b=1}^B\nabla_{z_b}\ell_b\,x_b^T,$$
곧 표본별 가중치 기울기 $\nabla_{z_b}\ell_b\,x_b^T$의 평균 — 10단원의 미니배치 기울기입니다.`,
    note: R`편향을 더한 $Z=XW^T+\mathbf 1c^T$ ($\mathbf 1\in\mathbb R^B$)이면 $c_i$도 모든 표본에 복사되므로 $\frac{\partial L}{\partial c}=G^T\mathbf 1=\sum_b\delta_b$ (배치 방향의 합)입니다. 공식이 헷갈리면 9.5절처럼 크기를 맞추면 됩니다: $X$와 같은 $B\times N$을 $G$ ($B\times M$)와 $W$ ($M\times N$)로 만드는 곱은 $GW$뿐이고, $W$와 같은 $M\times N$을 $G$와 $X$로 만드는 곱은 $G^TX$뿐입니다.` },

  // ───── 10
  { ch: 'ch10', id: 'mbnorepl', title: '섞어서 자른 미니배치: 비복원추출의 분산', keys: ['미니배치 기울기의 분산', '미니배치 SGD'],
    tags: 'minibatch sampling without replacement finite population correction variance random reshuffling epoch shuffle 미니배치 비복원추출 유한 모집단 보정 분산 섞기 에폭',
    stmt: R`$g_i=\nabla f_i(x)\in\mathbb R^d$ ($i=1,\dots,N$, $N\ge2$), $\nabla f=\frac1N\sum_ig_i$, $\Sigma=\frac1N\sum_i(g_i-\nabla f)(g_i-\nabla f)^T$라 하자. (a) 에폭마다 첨자 $1,\dots,N$의 순서를 균등하게 무작위로 섞고 앞에서부터 $B$개씩 자르면, 각 미니배치 $K$는 크기 $B$인 부분집합 $\binom NB$개 위의 균등분포를 따른다. (b) $K$가 그런 균등한 부분집합이면 $\hat g=\frac1B\sum_{k\in K}g_k$에 대해
$$\E\hat g=\nabla f,\qquad\Cov(\hat g)=\frac{N-B}{N-1}\cdot\frac\Sigma B,$$
$$\E\lVert\hat g-\nabla f\rVert^2=\frac{N-B}{N-1}\cdot\frac{\tr\Sigma}B.$$`,
    body: R`
**1. 섞어서 자른 배치는 균등한 부분집합 (a).** 섞기는 $N!$개의 순열 $\pi$ 중 하나를 같은 확률로 고르는 것이고, $m$번째 배치는 자리 $P_m=\{(m-1)B+1,\dots,mB\}$에 놓인 첨자들 $K=\{\pi(p):p\in P_m\}$입니다. 크기 $B$인 부분집합 $S$를 하나 고정하면, $K=S$가 되는 순열의 수는 $S$의 원소를 자리 $P_m$에 놓는 방법 $B!$과 나머지 $N-B$개를 나머지 자리에 놓는 방법 $(N-B)!$의 곱입니다. 따라서
$$P(K=S)=\frac{B!\,(N-B)!}{N!}=\frac1{\binom NB}$$
이고 이 값은 $S$와 무관합니다. (마지막 배치가 $B$보다 작으면 같은 논증으로 그 크기의 부분집합 위에서 균등합니다.)

**2. 지시변수로 쓰기.** $e_i=g_i-\nabla f$, $I_i=\mathbb 1[i\in K]$로 두면 $\sum_ie_i=\sum_ig_i-N\nabla f=0$이고, $\lvert K\rvert=B$이므로
$$\hat g-\nabla f=\frac1B\sum_{k\in K}e_k=\frac1B\sum_{i=1}^NI_ie_i.$$

**3. 포함 확률.** $i$를 포함하는 크기 $B$ 부분집합은 나머지 $N-1$개에서 $B-1$개를 고르는 수만큼 있으므로 $\E I_i=P(i\in K)=\binom{N-1}{B-1}\big/\binom NB=\frac BN$. $i\ne j$이면 둘을 모두 포함하는 부분집합은 $\binom{N-2}{B-2}$개라
$$\E[I_iI_j]=\frac{\binom{N-2}{B-2}}{\binom NB}=\frac{B(B-1)}{N(N-1)}$$
입니다($B=1$이면 양쪽 모두 0). 또 지시변수라 $I_i^2=I_i$.

**4. 불편성.** 기댓값의 선형성으로 $\E[\hat g-\nabla f]=\frac1B\sum_i\frac BN\,e_i=\frac1N\sum_ie_i=0$.

**5. 공분산.** 4에서 $\E\hat g=\nabla f$이므로 $\Cov(\hat g)=\E[(\hat g-\nabla f)(\hat g-\nabla f)^T]$. 2를 넣고 $I_i^2=I_i$를 쓰면
$$\begin{aligned}\Cov(\hat g)=\frac1{B^2}\Big(&\sum_i\E[I_i]\,e_ie_i^T\\&+\sum_{i\ne j}\E[I_iI_j]\,e_ie_j^T\Big).\end{aligned}$$
여기서 $\sum_ie_ie_i^T=N\Sigma$이고, $\sum_ie_i=0$이므로
$$\begin{aligned}\sum_{i\ne j}e_ie_j^T&=\Big(\sum_ie_i\Big)\Big(\sum_je_j\Big)^T-\sum_ie_ie_i^T\\&=-N\Sigma.\end{aligned}$$
3의 확률을 넣으면
$$\begin{aligned}\Cov(\hat g)&=\frac1{B^2}\Big(\frac BN\,N\Sigma-\frac{B(B-1)}{N(N-1)}\,N\Sigma\Big)\\&=\frac\Sigma B\Big(1-\frac{B-1}{N-1}\Big)=\frac{N-B}{N-1}\cdot\frac\Sigma B.\end{aligned}$$

**6. 제곱노름.** $\E\lVert\hat g-\nabla f\rVert^2=\E\,\tr\big[(\hat g-\nabla f)(\hat g-\nabla f)^T\big]=\tr\Cov(\hat g)$ (대각합과 기댓값은 순서를 바꿀 수 있음)이므로 마지막 식이 나옵니다.`,
    note: R`보정 계수 $\frac{N-B}{N-1}$은 $B=1$에서 1(복원추출과 같음), $B=N$에서 0(배치 = 자료 전체 = 정확한 기울기)이고, 그 사이에서는 1보다 작아 복원추출의 $\Sigma/B$보다 항상 작습니다. 같은 표본을 두 번 뽑지 않아 정보가 겹치지 않기 때문입니다. 다만 한 에폭의 배치들은 서로 겹치지 않게 정해지므로 **서로 독립이 아닙니다**. 개별 배치의 평균과 공분산은 위와 같지만, 매 걸음의 기울기가 과거와 무관하게 불편이라고 가정하는 13단원의 분석은 섞어서 자르는 방식에는 근사로만 맞습니다. ($B$가 $N$을 나누고 모든 배치 기울기를 같은 $x$에서 계산하면, 한 에폭의 배치 기울기 평균은 정확히 $\nabla f$입니다.)` },

  // ───── 11
  { ch: 'ch11', id: 'depth', title: '깊은 신경망에서 신호의 크기는 층마다 곱해진다', keys: ['초기화 크기와 신호의 크기'],
    tags: 'signal propagation deep network initialization exploding vanishing activations second moment Xavier He tanh ReLU 신호 전파 깊은 신경망 초기화 폭발 소멸 2차 모멘트',
    stmt: R`입력 $h_0=x$ ($\E\lVert x\rVert^2<\infty$, 평균이 0일 필요 없음)에서 $z_\ell=W_\ell h_{\ell-1}$, $h_\ell=\varphi(z_\ell)$ ($W_\ell\in\mathbb R^{n_\ell\times n_{\ell-1}}$, $\ell=1,\dots,L$)로 계산하고, $W_\ell$의 성분은 서로 독립·평균 0·분산 $\sigma_\ell^2$이며 $x,W_1,\dots,W_L$은 서로 독립이라 하자. 신호의 크기를 성분당 2차 모멘트 $m_\ell=\frac1{n_\ell}\E\lVert h_\ell\rVert^2$로 재면 (a) 활성화와 무관하게 모든 $i$에서 $\E[z_{\ell,i}^2]=n_{\ell-1}\sigma_\ell^2\,m_{\ell-1}$. (b) 선형 $\varphi(z)=z$이면 $m_L=\prod_{\ell=1}^L(n_{\ell-1}\sigma_\ell^2)\,m_0$. (c) ReLU이고 각 $W_\ell$의 분포가 부호를 바꿔도 같으면($W_\ell\overset d=-W_\ell$) $m_L=\prod_{\ell=1}^L\big(\frac12n_{\ell-1}\sigma_\ell^2\big)\,m_0$. (d) tanh이면 $m_L\le\prod_{\ell=1}^L(n_{\ell-1}\sigma_\ell^2)\,m_0$. 따라서 폭과 분산이 층마다 같으면($n$, $\sigma^2$) 신호는 깊이에 대해 기하급수적으로 폭발하거나 소멸하고, 크기가 유지되는 것은 $n\sigma^2=1$ (선형, Xavier) 또는 $n\sigma^2=2$ (ReLU, He)일 때뿐이다.`,
    body: R`
**1. 무엇이 무엇과 독립인가.** $h_{\ell-1}$은 $x,W_1,\dots,W_{\ell-1}$만의 함수이므로 $W_\ell$과 독립입니다. 또 세 활성화 모두 $\lvert\varphi(z)\rvert\le\lvert z\rvert$를 만족하므로(tanh는 4에서 확인) $\E\lVert h_\ell\rVert^2\le\E\lVert z_\ell\rVert^2$이고, 아래 2의 계산과 귀납법으로 모든 2차 모멘트가 유한합니다.

**2. 한 층 (a).** $W=W_\ell$, $h=h_{\ell-1}$로 줄여 쓰면 $z_{\ell,i}=\sum_jW_{ij}h_j$. 제곱을 전개하고 $W$와 $h$의 독립성으로 기댓값을 나누면
$$\E[z_{\ell,i}^2]=\sum_{j,k}\E[W_{ij}W_{ik}]\,\E[h_jh_k].$$
$j\ne k$이면 $W_{ij},W_{ik}$가 독립이고 평균 0이라 $\E[W_{ij}W_{ik}]=\E W_{ij}\,\E W_{ik}=0$이고, $j=k$이면 $\sigma_\ell^2$입니다. 따라서
$$\E[z_{\ell,i}^2]=\sigma_\ell^2\sum_j\E[h_j^2]=n_{\ell-1}\sigma_\ell^2\,m_{\ell-1}.$$
$h$의 성분끼리 독립이거나 평균이 0일 필요는 없습니다 — 교차항은 **가중치**의 평균이 0이라서 사라집니다. 또 $\E z_{\ell,i}=\sum_j\E W_{ij}\E h_j=0$이라 $\E[z_{\ell,i}^2]$이 곧 분산이므로, 제곱근을 취한 $\operatorname{std}(z_{\ell,i})=\sqrt{n_{\ell-1}}\,\sigma_\ell\sqrt{m_{\ell-1}}$가 키 박스의 식 “$\sqrt D\cdot\operatorname{std}(w)\cdot(\text{입력 크기})$”를 정확히 한 것입니다(입력 크기 = 성분의 제곱평균제곱근 $\sqrt{m_{\ell-1}}$).

**3. 선형과 ReLU (b), (c).** 선형이면 $h_\ell=z_\ell$이라 $m_\ell=\frac1{n_\ell}\sum_i\E[z_{\ell,i}^2]=n_{\ell-1}\sigma_\ell^2m_{\ell-1}$. ReLU이면 먼저 $z_{\ell,i}$가 0에 대해 대칭임을 봅니다: $W_\ell$은 $h_{\ell-1}$과 독립이고 $W_\ell\overset d=-W_\ell$이므로 $(W_\ell,h_{\ell-1})\overset d=(-W_\ell,h_{\ell-1})$, 따라서 $z_\ell=W_\ell h_{\ell-1}\overset d=-z_\ell$. 그러면 $z=z_{\ell,i}$에 대해 (왼쪽의 $z$를 같은 분포인 $-z$로 바꾸면 오른쪽)
$$\E\big[z^2\,\mathbb 1\{z>0\}\big]=\E\big[z^2\,\mathbb 1\{z<0\}\big]$$
이고 $z^2\mathbb 1\{z=0\}=0$이므로 두 값의 합이 $\E[z^2]$입니다. $\ReLU(z)^2=z^2\mathbb 1\{z>0\}$이므로 $\E[\ReLU(z)^2]=\frac12\E[z^2]$, 따라서 $m_\ell=\frac12n_{\ell-1}\sigma_\ell^2m_{\ell-1}$.

**4. tanh (d).** $\tanh0=0$이고 $0<\tanh'=1-\tanh^2\le1$이므로 평균값 정리로 $\lvert\tanh z\rvert=\lvert\tanh z-\tanh0\rvert\le\lvert z\rvert$. 따라서 $m_\ell\le\frac1{n_\ell}\E\lVert z_\ell\rVert^2=n_{\ell-1}\sigma_\ell^2m_{\ell-1}$.

**5. 층을 쌓으면.** 3, 4의 한 층 관계를 $\ell=1,\dots,L$에 차례로 쓰면(귀납법) (b)–(d)의 곱 공식이 나옵니다. 폭과 분산이 같으면 $m_L=(cn\sigma^2)^Lm_0$ ($c=1$ 선형, $c=\frac12$ ReLU)이므로, $cn\sigma^2>1$이면 깊이 $L$에 대해 기하급수적으로 폭발하고 $cn\sigma^2<1$이면 기하급수적으로 소멸하며, 유지되는 것은 $cn\sigma^2=1$일 때뿐입니다.

**6. 슬라이드의 수치.** $n=4096$이면 $\sqrt n=64$. $\sigma=0.01$: 2에서 $z$의 크기는 입력 크기의 $64\times0.01=0.64$배이고, tanh 층에서는 (d)로 신호 크기가 층마다 많아야 $0.64$배라 6층 뒤에는 $0.64^6\approx0.07$배 이하로 사라집니다(슬라이드: $0.49\to0.05$). $\sigma=0.05$: $z$의 크기가 입력 크기의 $3.2$배라 입력 크기가 1 가까이 유지되는 동안 tanh의 입력이 $\pm3$ 근처가 되어 포화됩니다. $\sigma=1/64$ (Xavier): 배율이 정확히 1입니다.`,
    note: R`같은 계산이 역방향에도 적용됩니다. 선형 층에서 상류 기울기 $\delta$를 고정하면 $\E\lVert W_\ell^T\delta\rVert^2=n_{\ell-1}\sigma_\ell^2\lVert\delta\rVert^2$, 성분당으로는 $n_\ell\sigma_\ell^2$배($D_{out}\sigma^2$)라서 기울기의 크기도 층마다 곱해집니다(Glorot의 역방향 조건). 시그모이드 층이면 여기에 $\sigma'\le\frac14$가 매 층 곱해져 $\lVert\delta_\ell\rVert\le\prod_{k=\ell+1}^L\frac{\lVert W_k\rVert_2}4\,\lVert\delta_L\rVert$이므로(9.6절 더 깊이) 가중치가 크지 않으면 기울기가 기하급수적으로 사라집니다. 위의 식들은 무작위 가중치에 대한 **기댓값**이고, 한 번 뽑은 망에서의 값이 기댓값에 가깝다는 것은 폭 $n$이 클수록 잘 맞는 근사입니다.` },
  { ch: 'ch11', id: 'glorot', title: 'Glorot의 절충식과 균등분포 초기화',
    tags: 'Glorot Xavier uniform initialization backward variance harmonic mean fan in fan out compromise 균등분포 초기화 역방향 분산 조화평균 절충',
    stmt: R`(a) 역전파 $g=W^T\delta$, 즉 $g_i=\sum_{j=1}^{D_{out}}W_{ji}\delta_j$에서 $W$의 성분이 서로 독립·평균 0·분산 $\sigma^2$이고 $W$와 $\delta$가 독립이며 $\E[\delta_j^2]=u$ ($\forall j$)이면 $\E g_i=0$, $\E[g_i^2]=D_{out}\sigma^2u$이다. 따라서 기울기의 2차 모멘트가 보존될 조건은 $\sigma^2=1/D_{out}$. (b) 순방향 조건 $\sigma^2=1/D_{in}$과 역방향 조건 $\sigma^2=1/D_{out}$은 $D_{in}=D_{out}$일 때만 동시에 성립한다. $\sigma^2=\frac2{D_{in}+D_{out}}$은 두 값의 조화평균이라 둘 사이에 있고, 이때 순방향 배율 $D_{in}\sigma^2$과 역방향 배율 $D_{out}\sigma^2$의 산술평균이 정확히 1이다. (c) $w\sim U(-a,a)$이면 $\E w=0$, $\Var w=a^2/3$. 따라서 분산이 $\frac2{D_{in}+D_{out}}$인 균등분포는 $a=\sqrt{\frac6{D_{in}+D_{out}}}$.`,
    body: R`
**1. 역방향 (a).** 평균: 독립성으로 $\E g_i=\sum_j\E W_{ji}\,\E\delta_j=0$. 2차 모멘트: 제곱을 전개하고 $W$와 $\delta$의 독립성으로 기댓값을 나누면
$$\E[g_i^2]=\sum_{j,k}\E[W_{ji}W_{ki}]\,\E[\delta_j\delta_k].$$
$j\ne k$이면 $W_{ji},W_{ki}$가 독립이고 평균 0이라 $\E[W_{ji}W_{ki}]=0$, $j=k$이면 $\sigma^2$입니다. 따라서 $\E[g_i^2]=\sigma^2\sum_{j=1}^{D_{out}}\E[\delta_j^2]=D_{out}\sigma^2u$이고, $\E[g_i^2]=u$이려면 $\sigma^2=1/D_{out}$. 순방향(11.2절)과 같은 계산에서 더하는 첨자만 출력 쪽 $D_{out}$개로 바뀐 것입니다.

**2. 두 조건과 조화평균 (b).** $\frac1{D_{in}}=\frac1{D_{out}}\iff D_{in}=D_{out}$이므로 폭이 다르면 하나의 $\sigma^2$로 두 조건을 모두 만족할 수 없습니다. 두 양수 $p=\frac1{D_{in}}$, $q=\frac1{D_{out}}$의 조화평균은
$$\frac2{\frac1p+\frac1q}=\frac2{D_{in}+D_{out}}$$
이고, 조화평균은 언제나 두 수 사이에 있습니다: $p\le q$이면 $\frac1q\le\frac12\big(\frac1p+\frac1q\big)\le\frac1p$이고 역수를 취하면 $p\le\frac2{1/p+1/q}\le q$. 이 $\sigma^2$에서 두 배율은 $D_{in}\sigma^2=\frac{2D_{in}}{D_{in}+D_{out}}$, $D_{out}\sigma^2=\frac{2D_{out}}{D_{in}+D_{out}}$이고 합이 2라 평균이 정확히 1입니다 — 한쪽이 1보다 크면 다른 쪽이 그만큼 1보다 작게 균형을 맞춘 것입니다.

**3. 균등분포의 분산 (c).** 밀도가 $[-a,a]$에서 $\frac1{2a}$이므로
$$\E w=\int_{-a}^a\frac w{2a}\,dw=0,$$
$$\begin{aligned}\Var w=\E w^2&=\int_{-a}^a\frac{w^2}{2a}\,dw\\&=\frac1{2a}\cdot\frac{2a^3}3=\frac{a^2}3.\end{aligned}$$
$\frac{a^2}3=\frac2{D_{in}+D_{out}}$을 풀면 $a^2=\frac6{D_{in}+D_{out}}$. 균등분포 $U(-a,a)$는 평균이 0이고 0에 대해 대칭이므로 1과 11.2절에서 가중치에 요구한 가정을 만족합니다.

**4. 수치 예.** $D_{in}=300$, $D_{out}=100$이면 $\sigma^2=\frac2{400}=0.005$, $a=\sqrt{6/400}\approx0.1225$. 두 배율은 $D_{in}\sigma^2=1.5$, $D_{out}\sigma^2=0.5$로 평균이 1입니다.`,
    note: R`1의 가정 “$W$와 $\delta$가 독립”은 근사입니다. $\delta$는 순전파 출력을 거쳐 $W$에 의존하기 때문입니다. Glorot과 Bengio(2010)의 원래 유도도 같은 근사를 씁니다. 같은 방법으로 He 초기화의 분산 $\frac2{D_{in}}$을 균등분포로 맞추면 $a=\sqrt{6/D_{in}}$입니다.` },

  // ───── 12
  { ch: 'ch12', id: 'lrquad', title: '이차 그릇에서 학습률의 네 영역과 잡음 바닥', keys: ['학습률과 학습 곡선'],
    tags: 'learning rate quadratic bowl divergence oscillation noise floor SGD learning curve step decay 2/beta 학습률 이차함수 발산 진동 잡음 바닥 학습 곡선 계단',
    stmt: R`$f(x)=\frac\beta2x^2$ ($\beta>0$), 주어진 $x_0\ne0$, $\eta>0$. (a) GD $x_{t+1}=x_t-\eta f'(x_t)$는 $x_t=(1-\eta\beta)^tx_0$, $f(x_t)=(1-\eta\beta)^{2t}f(x_0)$이고, $\eta<\frac1\beta$이면 부호를 유지하며 단조롭게 0으로, $\eta=\frac1\beta$이면 한 걸음에 $x_1=0$, $\frac1\beta<\eta<\frac2\beta$이면 부호를 바꾸며 0으로, $\eta=\frac2\beta$이면 $x_t=(-1)^tx_0$로 제자리 진동, $\eta>\frac2\beta$이면 $\lvert x_t\rvert\to\infty$ (발산). (b) SGD $x_{t+1}=x_t-\eta\big(f'(x_t)+\xi_t\big)$에서 잡음 $\xi_0,\xi_1,\dots$이 서로 독립이고 $\E\xi_t=0$, $\Var\xi_t=s^2>0$이면, $0<\eta<\frac2\beta$일 때
$$\lim_{t\to\infty}\E f(x_t)=\frac{\eta s^2}{2(2-\eta\beta)},$$
그리고 모든 $t\ge1$에서 $\E f(x_t)\ge\frac\beta2\eta^2s^2>0$이다. 즉 고정 학습률의 SGD는 대략 $\eta$에 비례하는 잡음 바닥 아래로 내려가지 못한다.`,
    body: R`
**1. 닫힌 꼴.** $f'(x)=\beta x$이므로 $x_{t+1}=x_t-\eta\beta x_t=rx_t$, $r:=1-\eta\beta$. 귀납법으로 $x_t=r^tx_0$이고 $f(x_t)=\frac\beta2r^{2t}x_0^2=r^{2t}f(x_0)$.

**2. 네 영역 (a).** 모든 것이 배율 $r$로 정해집니다.

- $0<\eta<\frac1\beta\iff0<r<1$: $x_t$는 $x_0$과 같은 부호를 유지하고 $\lvert x_t\rvert=r^t\lvert x_0\rvert$가 단조 감소해 0으로 갑니다.
- $\eta=\frac1\beta\iff r=0$: $x_1=0$, 한 걸음에 최솟점입니다.
- $\frac1\beta<\eta<\frac2\beta\iff-1<r<0$: 부호가 매 걸음 바뀌고(벽을 건너뜀) $\lvert x_t\rvert=\lvert r\rvert^t\lvert x_0\rvert\to0$.
- $\eta=\frac2\beta\iff r=-1$: $x_t=(-1)^tx_0$, 같은 높이의 두 점을 영원히 오갑니다.
- $\eta>\frac2\beta\iff r<-1$: $\lvert x_t\rvert=\lvert r\rvert^t\lvert x_0\rvert\to\infty$이고 손실 $f(x_t)=r^{2t}f(x_0)$이 기하급수적으로 폭발합니다.

손실이 매 걸음 줄어드는 것은 $r^2<1\iff0<\eta<\frac2\beta$일 때이고, 한 걸음의 감소 배율 $r^2=(1-\eta\beta)^2$은 $\eta=\frac1\beta$에서 0이며 $\eta$가 0이나 $\frac2\beta$에 가까울수록 1에 가까워 느려집니다.

**3. SGD의 2차 모멘트 점화식 (b).** $x_{t+1}=(1-\eta\beta)x_t-\eta\xi_t=rx_t-\eta\xi_t$. $x_t$는 $x_0,\xi_0,\dots,\xi_{t-1}$만의 함수라 $\xi_t$와 독립이므로 $\E[x_t\xi_t]=\E x_t\,\E\xi_t=0$. 제곱의 기댓값을 취하면 $a_t:=\E[x_t^2]$에 대해
$$\begin{aligned}a_{t+1}&=r^2a_t-2r\eta\,\E[x_t\xi_t]+\eta^2\E[\xi_t^2]\\&=r^2a_t+\eta^2s^2.\end{aligned}$$

**4. 극한.** $0<\eta<\frac2\beta$이면 $\rho:=r^2<1$입니다. 고정점 $a^*=\frac{\eta^2s^2}{1-\rho}$를 빼면 $a_{t+1}-a^*=\rho(a_t-a^*)$이므로 $a_t-a^*=\rho^t(a_0-a^*)\to0$. 여기서
$$1-\rho=1-(1-\eta\beta)^2=\eta\beta(2-\eta\beta),$$
$$a^*=\frac{\eta^2s^2}{\eta\beta(2-\eta\beta)}=\frac{\eta s^2}{\beta(2-\eta\beta)}$$
이므로 $\E f(x_t)=\frac\beta2a_t\to\frac\beta2a^*=\frac{\eta s^2}{2(2-\eta\beta)}$.

**5. 바닥 아래로는 못 간다.** 3의 점화식에서 $r^2a_t\ge0$이므로 모든 $t\ge0$에서 $a_{t+1}\ge\eta^2s^2$, 즉 $t\ge1$이면 $\E f(x_t)=\frac\beta2a_t\ge\frac\beta2\eta^2s^2>0$. 잡음이 있는 한 손실의 기댓값은 0에 닿지 못합니다.

**6. 학습 곡선 읽기.** 4의 극한 $\frac{\eta s^2}{2(2-\eta\beta)}$은 $\eta$에 대해 증가하고, 작은 $\eta$에서는 약 $\frac{\eta s^2}4$로 $\eta$에 비례합니다. 그래서 (b) 낮은 학습률은 감소 배율 $r^2$이 1에 가까워 느리지만 바닥이 낮고, (c) 높은 학습률은 초반에 빨리 내려가지만($r^2$이 작음) 높은 바닥에서 멈추며, (a) $\eta>\frac2\beta$이면 $\lvert r\rvert>1$이라 잡음과 무관하게 폭발합니다(3에서 $a_t\ge r^{2t}a_0\to\infty$). 학습 도중 $\eta$를 줄이면 바닥이 낮아지므로 손실이 한 번 더 뚝 떨어집니다 — 계단 스케줄의 손실 곡선입니다.`,
    note: R`실제 SGD의 잡음은 $x$에 따라 크기가 바뀌지만, “고정 학습률이면 $\eta$에 비례하는 잡음 바닥이 남는다”는 결론은 13.6절의 상한 $\frac L2\eta G$와 같은 모양입니다. 13.6절은 바닥의 **상한**을 주고, 이 예는 바닥이 실제로 있다는 **하한**을 보여 줍니다. 결정적 부분 (a)는 하강 보조정리의 조건 $\eta<2/\beta$가 더는 개선될 수 없음을 보여 주며(13.4절 예제 5), 14단원에서는 이차함수의 고윳값마다 같은 분석을 합니다($\eta<2/\lambda_{\max}$).` },
  { ch: 'ch12', id: 'lrdecay', title: '감소하는 학습률과 SGD의 수렴: 1/t와 1/√t', keys: ['학습률 스케줄'],
    tags: 'learning rate decay schedule Robbins Monro conditions inverse square root 1/t harmonic series integral test SGD convergence 학습률 감소 스케줄 로빈스 먼로 역제곱근 조화급수 적분 비교 수렴',
    stmt: R`가변 보폭 SGD의 수렴 정리(13.6절)의 가정 — $f$가 $L$-매끄럽고 하한 $f_*$를 가지며 $\E[g_t\mid x_t]=\nabla f(x_t)$, $\E[\lVert g_t\rVert^2\mid x_t]\le G$ — 아래에서 $\Delta=f(x_1)-f_*$, $M_T=\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2$라 하자. (a) $\sum_t\eta_t=\infty$이고 $\sum_t\eta_t^2<\infty$이면 $T\to\infty$일 때 $M_T\to0$이다. $\eta_t=c/t$ ($c>0$)는 이 조건을 만족한다. (b) 역제곱근 스케줄 $\eta_t=c/\sqrt t$이면 $T\ge2$에서
$$M_T\le\frac{\Delta+\frac{LGc^2}2(1+\ln T)}{c\sqrt T}=O\Big(\frac{\ln T}{\sqrt T}\Big).$$`,
    body: R`
**1. 출발점.** 13.6절의 정리는 $S_1(T)=\sum_{t=1}^T\eta_t$, $S_2(T)=\sum_{t=1}^T\eta_t^2$로 쓰면
$$M_T\le\frac{\Delta+\frac{LG}2S_2(T)}{S_1(T)}$$
입니다. 이제 스케줄마다 $S_1$은 아래로, $S_2$는 위로 누르면 됩니다.

**2. 조건 (a)에서 수렴.** $\sum\eta_t^2<\infty$이면 모든 $T$에서 $S_2(T)\le S_2^\infty:=\sum_{t=1}^\infty\eta_t^2$이므로
$$0\le M_T\le\frac{\Delta+\frac{LG}2S_2^\infty}{S_1(T)}.$$
분자는 $T$와 무관한 상수이고 $S_1(T)\to\infty$이므로 오른쪽이 0으로 가고, 따라서 $M_T\to0$.

**3. $\eta_t=c/t$가 (a)를 만족함.** $x\in[t,t+1]$에서 $\frac1t\ge\frac1x$이므로 적분하면 $\frac1t\ge\int_t^{t+1}\frac{dx}x$, 더하면 $\sum_{t=1}^T\frac1t\ge\int_1^{T+1}\frac{dx}x=\ln(T+1)\to\infty$. 또 $t\ge2$에서 $\frac1{t^2}\le\frac1{t(t-1)}=\frac1{t-1}-\frac1t$이고 망원급수로
$$\sum_{t=1}^T\frac1{t^2}\le1+\Big(1-\frac1T\Big)<2.$$

**4. 역제곱근의 적분 비교 (b).** 감소하는 양의 함수 $\phi$는 $[t,t+1]$에서 $\phi\le\phi(t)$, $[t-1,t]$에서 $\phi\ge\phi(t)$이므로 $\int_t^{t+1}\phi\le\phi(t)\le\int_{t-1}^t\phi$. $\phi(x)=x^{-1/2}$에 왼쪽 부등식을 쓰면
$$\sum_{t=1}^T\frac1{\sqrt t}\ge\int_1^{T+1}\frac{dx}{\sqrt x}=2\big(\sqrt{T+1}-1\big),$$
$\phi(x)=\frac1x$에 오른쪽 부등식을 $t\ge2$에서 쓰면
$$\sum_{t=1}^T\frac1t\le1+\int_1^T\frac{dx}x=1+\ln T.$$
따라서 $S_1(T)\ge2c\big(\sqrt{T+1}-1\big)$, $S_2(T)=c^2\sum_t\frac1t\le c^2(1+\ln T)$.

**5. 결합.** $T\ge2$이면 $\sqrt{T+1}-1\ge\frac{\sqrt T}2$입니다: 이는 $\sqrt{T+1}\ge1+\frac{\sqrt T}2$와 같고, 양변이 양수라 제곱하면 $T+1\ge1+\sqrt T+\frac T4\iff\frac34T\ge\sqrt T\iff\sqrt T\ge\frac43$인데 $\sqrt2>\frac43$입니다. 그러므로 $S_1(T)\ge c\sqrt T$이고, 4의 $S_2$ 상한과 함께 1에 넣으면 (b)의 식입니다. 마지막으로 $\frac{1+\ln T}{\sqrt T}\to0$이므로 이 경우에도 $M_T\to0$.`,
    note: R`두 스케줄의 비교가 흥미롭습니다. $c/t$는 고전적 조건(a)(로빈스-먼로 조건)를 만족해 $M_T\to0$이 보장되지만, 이 상한으로는 $S_1\approx c\ln T$라 $O(1/\ln T)$로 매우 느립니다. $c/\sqrt t$는 $\sum\eta_t^2=\infty$라 (a)를 만족하지 않는데도 $O(\ln T/\sqrt T)$로 훨씬 빠르고, $T$를 미리 정해야 하는 고정 보폭 $\eta=c/\sqrt T$의 $O(1/\sqrt T)$(13.6절)와 로그 인수만큼만 차이 납니다. 실제로 필요한 것은 $S_1\to\infty$ (멀리 갈 수 있음)와 $S_2/S_1\to0$ (잡음의 누적이 진전보다 느림)입니다.` },
  { ch: 'ch12', id: 'bnback', title: '배치 정규화의 역전파',
    tags: 'batch normalization backpropagation backward pass gradient gamma beta Jacobian mean variance path 배치 정규화 역전파 기울기 감마 베타 야코비안 평균 분산 경로',
    stmt: R`한 특성의 미니배치 $x_1,\dots,x_N$에서 $\mu=\frac1N\sum_ix_i$, $\sigma^2=\frac1N\sum_i(x_i-\mu)^2$, $s=\sqrt{\sigma^2+\varepsilon}>0$, $\hat x_i=(x_i-\mu)/s$, $y_i=\gamma\hat x_i+\beta$이고, 손실 $L$은 $x$에 BN 출력 $y$를 통해서만 의존한다고 하자. 그러면 $\frac{\partial L}{\partial\gamma}=\sum_i\frac{\partial L}{\partial y_i}\hat x_i$, $\frac{\partial L}{\partial\beta}=\sum_i\frac{\partial L}{\partial y_i}$, $g_i:=\frac{\partial L}{\partial\hat x_i}=\gamma\frac{\partial L}{\partial y_i}$이고
$$\begin{aligned}\frac{\partial L}{\partial x_k}=\frac1s\Big(&g_k-\frac1N\sum_ig_i\\&-\hat x_k\cdot\frac1N\sum_ig_i\hat x_i\Big).\end{aligned}$$
또 $\sum_k\frac{\partial L}{\partial x_k}=0$이고, $\varepsilon=0$이면 $\sum_k\hat x_k\frac{\partial L}{\partial x_k}=0$이다. 특성이 여럿이면 특성(열)마다 따로 적용한다.`,
    body: R`
**1. $\gamma$, $\beta$, $\hat x$의 기울기.** $y_i=\gamma\hat x_i+\beta$에서 $\frac{\partial y_i}{\partial\gamma}=\hat x_i$, $\frac{\partial y_i}{\partial\beta}=1$이고, $\gamma,\beta$는 배치의 모든 $y_i$에 쓰이므로(복사 게이트) 기울기를 $i$에 대해 더합니다. $\hat x_i$는 $y_i$에만 들어가므로 $g_i=\frac{\partial L}{\partial y_i}\gamma$.

**2. 평균과 표준편차의 미분.** $\frac{\partial\mu}{\partial x_k}=\frac1N$. 분산은 연쇄법칙과 $\sum_i(x_i-\mu)=0$으로
$$\begin{aligned}\frac{\partial\sigma^2}{\partial x_k}&=\frac2N\sum_i(x_i-\mu)\Big(\mathbb 1[i=k]-\frac1N\Big)\\&=\frac2N(x_k-\mu),\end{aligned}$$
따라서 $\frac{\partial s}{\partial x_k}=\frac1{2s}\cdot\frac2N(x_k-\mu)=\frac{\hat x_k}N$.

**3. 정규화의 야코비안.** 몫의 미분으로
$$\begin{aligned}\frac{\partial\hat x_i}{\partial x_k}&=\frac{\mathbb 1[i=k]-\frac1N}s-\frac{x_i-\mu}{s^2}\cdot\frac{\hat x_k}N\\&=\frac1s\Big(\mathbb 1[i=k]-\frac1N-\frac{\hat x_i\hat x_k}N\Big).\end{aligned}$$
$x_k$는 $\hat x_k$에 직접, 그리고 $\mu$와 $s$를 통해 **모든** $\hat x_i$에 들어갑니다 — 괄호의 세 항이 차례로 직접 경로, 평균 경로, 분산 경로입니다.

**4. 연쇄법칙.** $L$은 $x$에 $\hat x_1,\dots,\hat x_N$을 통해서만 의존하므로
$$\begin{aligned}\frac{\partial L}{\partial x_k}&=\sum_ig_i\frac{\partial\hat x_i}{\partial x_k}\\&=\frac1s\Big(g_k-\frac1N\sum_ig_i-\frac{\hat x_k}N\sum_ig_i\hat x_i\Big).\end{aligned}$$

**5. 두 항등식.** $\sum_k\hat x_k=\frac1s\sum_k(x_k-\mu)=0$이므로
$$\sum_k\frac{\partial L}{\partial x_k}=\frac1s\Big(\sum_kg_k-\sum_ig_i-0\Big)=0.$$
또 $\sum_k\hat x_k^2=\frac{N\sigma^2}{s^2}$이므로 $A:=\sum_ig_i\hat x_i$라 하면
$$\begin{aligned}\sum_k\hat x_k\frac{\partial L}{\partial x_k}&=\frac1s\Big(A-0-\frac{\sigma^2}{s^2}A\Big)\\&=\frac As\cdot\frac\varepsilon{\sigma^2+\varepsilon},\end{aligned}$$
이고 $\varepsilon=0$이면 0입니다.`,
    note: R`5의 두 항등식은 입력 기울기에 $\mathbf 1$ 방향과 ($\varepsilon=0$이면) $\hat x$ 방향 성분이 없다는 뜻입니다. BN 출력은 배치 전체를 같은 값만큼 옮기는 변화($x\to x+c\mathbf 1$)와 평균 둘레로 늘리는 변화($x-\mu\mathbf 1\to\kappa(x-\mu\mathbf 1)$, $\kappa>0$, $\varepsilon=0$)에 변하지 않으므로, 그 방향으로는 손실을 바꿀 수 없다는 것과 같은 말입니다 — 12.5절의 스케일 불변성입니다. 흔한 실수는 $\mu$와 $s$를 상수로 보고 $\frac{\partial L}{\partial x_k}=\frac{g_k}s$라고 쓰는 것으로, 3의 둘째·셋째 항(평균·분산 경로)을 빠뜨린 것입니다.` },

  // ───── 13
  { ch: 'ch13', id: 'convex', title: '볼록하고 매끄러운 함수에서 GD의 O(1/T) 수렴',
    tags: 'convex smooth gradient descent convergence rate O(1/T) function value first order condition Bubeck telescoping 볼록 매끄러움 경사하강법 수렴 속도 함수값 1차 조건 망원급수',
    stmt: R`$f:\mathbb R^d\to\mathbb R$이 미분가능하고 볼록이며($f(\theta x+(1-\theta)y)\le\theta f(x)+(1-\theta)f(y)$, $\theta\in[0,1]$) $\beta$-매끄럽고, 최솟점 $x^*$가 있다고 하자. 보폭 $0<\eta\le\frac1\beta$의 GD $x_{t+1}=x_t-\eta\nabla f(x_t)$는 모든 $T\ge1$에서
$$f(x_T)-f(x^*)\le\frac{\lVert x_0-x^*\rVert^2}{2\eta T}$$
를 만족하고, 특히 $\eta=\frac1\beta$이면 $f(x_T)-f(x^*)\le\frac{\beta\lVert x_0-x^*\rVert^2}{2T}$이다. 또 $\lVert x_t-x^*\rVert$는 $t$에 대해 증가하지 않는다.`,
    body: R`
**1. 볼록함수의 1차 조건.** 먼저 모든 $x,y$에서
$$f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle$$
(접평면이 그래프 아래에 있음)를 보입니다. $\theta\in(0,1]$에 대해 $x+\theta(y-x)=(1-\theta)x+\theta y$이므로 볼록성에서 $f(x+\theta(y-x))\le(1-\theta)f(x)+\theta f(y)$. 양변에서 $f(x)$를 빼고 $\theta>0$으로 나누면
$$\frac{f(x+\theta(y-x))-f(x)}\theta\le f(y)-f(x).$$
$\theta\to0^+$이면 왼쪽은 방향도함수 $\langle\nabla f(x),y-x\rangle$로 가고($f$가 미분가능), 부등식은 극한에서도 유지됩니다.

**2. 한 걸음의 감소.** $g_t:=\nabla f(x_t)$라 합시다. 감소 조건(13.4절)에서, $\eta\le\frac1\beta$이면 $1-\frac{\beta\eta}2\ge\frac12$이므로
$$\begin{aligned}f(x_{t+1})&\le f(x_t)-\eta\Big(1-\frac{\beta\eta}2\Big)\lVert g_t\rVert^2\\&\le f(x_t)-\frac\eta2\lVert g_t\rVert^2.\end{aligned}$$
특히 $f(x_t)$는 증가하지 않습니다.

**3. 볼록성으로 위에서 누르기.** 1에 $x=x_t$, $y=x^*$를 넣으면 $f(x_t)\le f(x^*)+\langle g_t,x_t-x^*\rangle$. 이것을 2에 넣으면
$$f(x_{t+1})-f(x^*)\le\langle g_t,x_t-x^*\rangle-\frac\eta2\lVert g_t\rVert^2.$$

**4. 완전제곱.** $x_{t+1}-x^*=(x_t-x^*)-\eta g_t$를 제곱하면
$$\begin{aligned}\lVert x_{t+1}-x^*\rVert^2=\lVert x_t-x^*\rVert^2&-2\eta\langle g_t,x_t-x^*\rangle\\&+\eta^2\lVert g_t\rVert^2.\end{aligned}$$
이를 정리해 $\frac1{2\eta}$을 곱하면 3의 오른쪽과 똑같은 식이 나옵니다:
$$\begin{aligned}&\langle g_t,x_t-x^*\rangle-\frac\eta2\lVert g_t\rVert^2\\&\quad=\frac{\lVert x_t-x^*\rVert^2-\lVert x_{t+1}-x^*\rVert^2}{2\eta}.\end{aligned}$$
따라서 $f(x_{t+1})-f(x^*)\le\frac1{2\eta}\big(\lVert x_t-x^*\rVert^2-\lVert x_{t+1}-x^*\rVert^2\big)$. 왼쪽은 $x^*$가 최솟점이라 $\ge0$이므로 $\lVert x_{t+1}-x^*\rVert\le\lVert x_t-x^*\rVert$입니다.

**5. 망원급수.** 4를 $t=0,\dots,T-1$에 대해 더하면 오른쪽의 가운데 항이 모두 지워져
$$\begin{aligned}\sum_{t=1}^T\big(f(x_t)-f(x^*)\big)&\le\frac{\lVert x_0-x^*\rVert^2-\lVert x_T-x^*\rVert^2}{2\eta}\\&\le\frac{\lVert x_0-x^*\rVert^2}{2\eta}.\end{aligned}$$

**6. 마지막 반복점.** 2에서 $f(x_1)\ge f(x_2)\ge\cdots\ge f(x_T)$이므로 5의 왼쪽 $T$개 항은 모두 $f(x_T)-f(x^*)$ 이상이고, $T\big(f(x_T)-f(x^*)\big)\le\frac{\lVert x_0-x^*\rVert^2}{2\eta}$. $T$로 나누면 결과입니다.`,
    note: R`비볼록이면 13.4절처럼 기울기에 대해서만 $\min_t\lVert\nabla f(x_t)\rVert^2=O(1/T)$를 말할 수 있었지만, 볼록이면 함수값 자체가 $O(1/T)$로 최솟값에 다가갑니다. 열쇠는 3 — 볼록이면 “현재 손실과 최솟값의 차이”를 기울기와 거리의 내적으로 누를 수 있다는 것 — 이고, 4의 완전제곱이 그 내적을 거리의 망원급수로 바꿉니다. 최솟점이 여럿이면 어느 $x^*$를 넣어도 성립하므로 $x_0$에서 가장 가까운 최솟점을 쓰면 됩니다. 5주차 필기가 소개한 Bubeck의 교재(Convex Optimization: Algorithms and Complexity)에 있는 정리입니다.` },
  { ch: 'ch13', id: 'strong', title: '강볼록 함수에서 GD의 선형 수렴',
    tags: 'strongly convex linear convergence geometric rate condition number PL inequality Polyak Lojasiewicz gradient descent 강볼록 선형 수렴 기하급수 조건수 경사하강법',
    stmt: R`$f\in C^2(\mathbb R^d)$이고 모든 $x$에서 $\mu I\preceq\nabla^2f(x)\preceq\beta I$ ($0<\mu\le\beta$)라 하자. $f^*=\inf f$로 두면 보폭 $\eta=\frac1\beta$의 GD는
$$f(x_T)-f^*\le\Big(1-\frac\mu\beta\Big)^T\big(f(x_0)-f^*\big)$$
를 만족한다. 또 $f$는 유일한 최솟점 $x^*$를 가지며 $\lVert x_T-x^*\rVert^2\le\frac2\mu\big(1-\frac\mu\beta\big)^T\big(f(x_0)-f^*\big)$이다.`,
    body: R`
**1. 이차 하한.** 하강 보조정리의 증명에 쓴 적분형 테일러 공식(13.3절의 $(*)$)은 $p=y-x$로 쓰면
$$\begin{aligned}f(y)=f(x)&+\langle\nabla f(x),p\rangle\\&+\int_0^1(1-s)\,p^T\nabla^2f(x+sp)\,p\,ds\end{aligned}$$
입니다. 이번에는 아래쪽 한계 $p^T\nabla^2f\,p\ge\mu\lVert p\rVert^2$와 $1-s\ge0$, $\int_0^1(1-s)\,ds=\frac12$를 쓰면
$$f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle+\frac\mu2\lVert y-x\rVert^2.$$
(위쪽 한계 $\beta$를 쓰면 하강 보조정리입니다.)

**2. 기울기로 최적값과의 차이를 누르기.** $g=\nabla f(x)$로 두고 1의 오른쪽을 $y$에 대해 완전제곱하면
$$\begin{aligned}&f(x)+\langle g,y-x\rangle+\frac\mu2\lVert y-x\rVert^2\\&\quad=f(x)-\frac{\lVert g\rVert^2}{2\mu}+\frac\mu2\Big\lVert y-x+\frac g\mu\Big\rVert^2\\&\quad\ge f(x)-\frac{\lVert g\rVert^2}{2\mu}.\end{aligned}$$
따라서 모든 $y$에서 $f(y)\ge f(x)-\frac{\lVert\nabla f(x)\rVert^2}{2\mu}$이고, $y$에 대한 하한을 취하면 $f^*\ge f(x)-\frac{\lVert\nabla f(x)\rVert^2}{2\mu}$ (특히 $f^*>-\infty$), 곧
$$\lVert\nabla f(x)\rVert^2\ge2\mu\big(f(x)-f^*\big).$$
기울기가 작으면 함수값도 최솟값에 가깝다는 뜻입니다.

**3. 한 걸음의 축소.** $-\beta I\preceq\mu I\preceq\nabla^2f\preceq\beta I$이므로 $f$는 $\beta$-매끄럽습니다(13.2절). $\eta=\frac1\beta$의 감소 조건과 2에서
$$\begin{aligned}f(x_{t+1})&\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2\\&\le f(x_t)-\frac\mu\beta\big(f(x_t)-f^*\big).\end{aligned}$$
양변에서 $f^*$를 빼면 $f(x_{t+1})-f^*\le\big(1-\frac\mu\beta\big)\big(f(x_t)-f^*\big)$.

**4. 반복.** $0\le1-\frac\mu\beta<1$이고 $f(x_t)-f^*\ge0$이므로 3을 $t=0,\dots,T-1$에 차례로 쓰면(귀납법) $f(x_T)-f^*\le\big(1-\frac\mu\beta\big)^T\big(f(x_0)-f^*\big)$.

**5. 최솟점과 반복점의 거리.** 1에서 $x=0$으로 두면 $f(y)\ge f(0)-\lVert\nabla f(0)\rVert\lVert y\rVert+\frac\mu2\lVert y\rVert^2\to\infty$ ($\lVert y\rVert\to\infty$)이므로 $\{y:f(y)\le f(0)\}$은 유계인 닫힌 집합이고, 연속함수 $f$는 그 위에서 최솟값을 가집니다. 그 밖에서는 $f>f(0)$이므로 이것이 전체의 최솟점 $x^*$이고 $\nabla f(x^*)=0$. 1에 $x=x^*$를 넣으면 $f(y)-f^*\ge\frac\mu2\lVert y-x^*\rVert^2$이므로 최솟점은 하나뿐이고, $y=x_T$에 4를 쓰면 거리의 식이 나옵니다.`,
    note: R`$\kappa=\beta/\mu$ (조건수)로 쓰면 배율은 $1-\frac1\kappa\le e^{-1/\kappa}$이라, 오차를 $\epsilon$배로 줄이는 데 약 $\kappa\ln\frac1\epsilon$걸음이면 충분합니다. 볼록만인 경우의 $O(1/T)$보다 훨씬 빠른 기하급수(선형) 수렴이지만 $\kappa$가 크면 느려집니다. 이차함수 $\frac12x^THx$이면 $\mu=\lambda_{\min}$, $\beta=\lambda_{\max}$로 14단원의 조건수 이야기로 이어집니다. 3–4에는 2의 부등식 $\lVert\nabla f\rVert^2\ge2\mu(f-f^*)$만 쓰이므로, 볼록이 아니어도 이 부등식(PL 조건, Polyak–Łojasiewicz)을 만족하는 매끄러운 함수에서는 같은 속도가 나옵니다.` },
  );

  // 600자 이상 증명의 길잡이
  Object.assign(EM.plans, {
    'ch09-gdstop': {
      easy: R`보일 것은 세 가지입니다: 기울기가 0으로 간다는 것, 정지 조건이 몇 번 안에 반드시 걸린다는 것, 그리고 반복점이 어딘가로 모이면 그곳은 기울기가 0인 점이라는 것. 열쇠는 감소 조건입니다. 매 걸음 손실이 “기울기 제곱 × 상수”만큼 줄어드는데 손실은 바닥 $\mathcal L^*$ 아래로 내려갈 수 없으니, 기울기 제곱을 모두 더해도 유한해야 합니다.

유한한 합에 큰 항이 무한히 많이 들어 있을 수는 없습니다. 그래서 걸음 크기가 $\epsilon$ 이상인 걸음의 개수를 셀 수 있고, 그 개수보다 한 번 더 걸으면 정지 조건이 반드시 만족됩니다.`,
      easyEn: R`Three things are shown: the gradient goes to 0, the stopping criterion must trigger within a known number of steps, and if the iterates gather at a point, that point has zero gradient. The key is the decrease condition. Every step lowers the loss by “a constant times the squared gradient”, and the loss cannot go below its floor $\mathcal L^*$, so the squared gradients must have a finite total.

A finite sum cannot contain infinitely many large terms. So the number of steps of size at least $\epsilon$ can be counted, and one step beyond that count the stopping criterion must hold.`,
      nodes: [
        { id: 'step', at: '**1. 한 걸음의 감소.**', t: R`한 걸음의 감소`, en: R`Decrease per step`,
          d: R`하강 보조정리에서 나온 감소 조건으로 매 걸음 손실이 $c\lVert\nabla\mathcal L\rVert^2$ 이상 줄고, $\alpha<2/\beta$라 $c>0$입니다.`,
          dEn: R`The decrease condition from the descent lemma lowers the loss by at least $c\lVert\nabla\mathcal L\rVert^2$ each step, and $c>0$ because $\alpha<2/\beta$.` },
        { id: 'sum', at: '**2. 기울기 제곱의 합은 유한하다.**', t: R`합이 유한`, en: R`The sum is finite`,
          d: R`더하면 망원급수가 되어 합이 $(\mathcal L(\theta^0)-\mathcal L^*)/c$ 이하입니다. 수렴하는 급수의 항은 0으로 가므로 기울기와 걸음 크기가 0으로 갑니다.`,
          dEn: R`Summing telescopes, so the total is at most $(\mathcal L(\theta^0)-\mathcal L^*)/c$. Terms of a convergent series go to 0, so the gradient and the step size go to 0.` },
        { id: 'count', at: '**3. 정지 조건은 언제 만족되나.**', t: R`큰 걸음의 개수 세기`, en: R`Count the large steps`,
          d: R`걸음이 $\epsilon$ 이상인 첨자마다 합에 $\epsilon^2/\alpha^2$ 이상이 들어가므로 그런 첨자는 $K_\epsilon$개 이하이고, 처음 $K_\epsilon+1$개 안에 정지 조건이 성립하는 $k$가 있습니다.`,
          dEn: R`Each index with a step of at least $\epsilon$ adds at least $\epsilon^2/\alpha^2$ to the sum, so there are at most $K_\epsilon$ such indices, and among the first $K_\epsilon+1$ there is a $k$ that meets the criterion.` },
        { id: 'limit', at: '**4. 극한점은 정류점.**', t: R`극한점은 정류점`, en: R`A limit is a stationary point`,
          d: R`반복점이 수렴하면 이웃한 두 반복점의 차가 0으로 가고, 그것이 곧 $\alpha\nabla\mathcal L(\theta^k)$이므로 연속성으로 극한에서 기울기가 0입니다.`,
          dEn: R`If the iterates converge, the difference of consecutive iterates goes to 0; that difference is $\alpha\nabla\mathcal L(\theta^k)$, so by continuity the gradient at the limit is 0.` },
      ],
    },
    'ch09-batchmat': {
      easy: R`표본을 행으로 쌓은 배치 계산 $Z=XW^T$도 결국 성분 $Z_{bi}=\sum_jX_{bj}W_{ij}$들의 모음이므로, 다변수 연쇄법칙을 성분마다 쓰면 됩니다. 핵심은 각 변수가 **어디에 들어가는지**입니다.

입력 $X_{bj}$는 자기 표본의 행에만 들어가므로 다른 표본과 섞이지 않고, 가중치 $W_{ij}$는 모든 표본에 공유되므로(복사 게이트) 표본별 기울기를 **더합니다**. 그래서 $\partial L/\partial X=GW$, $\partial L/\partial W=G^TX=\sum_b\delta_bx_b^T$가 됩니다.`,
      easyEn: R`The batch computation $Z=XW^T$, with samples stacked as rows, is still a collection of entries $Z_{bi}=\sum_jX_{bj}W_{ij}$, so the multivariable chain rule can be used entry by entry. The key is **where each variable enters**.

An input entry $X_{bj}$ enters only its own sample's row, so samples do not mix; a weight $W_{ij}$ is shared by all samples (a copy gate), so the per-sample gradients are **added**. This gives $\partial L/\partial X=GW$ and $\partial L/\partial W=G^TX=\sum_b\delta_bx_b^T$.`,
      nodes: [
        { id: 'comp', at: '**1. 성분으로 쓰기.**', t: R`성분과 연쇄법칙`, en: R`Entries and the chain rule`,
          d: R`$Z_{bi}=\sum_jX_{bj}W_{ij}$로 쓰고, $L$이 $Z$의 모든 성분을 통해 의존한다는 연쇄법칙을 준비합니다.`,
          dEn: R`Write $Z_{bi}=\sum_jX_{bj}W_{ij}$ and set up the chain rule through all entries of $Z$.` },
        { id: 'dx', at: '**2. 입력에 대한 기울기.**', t: R`입력: 자기 행만`, en: R`Input: its own row only`,
          d: R`$X_{bj}$는 $b$번째 행에만 들어가 표본에 대한 합이 사라지고 $(GW)_{bj}$가 남습니다.`,
          dEn: R`$X_{bj}$ enters only row $b$, so the sum over samples drops out and $(GW)_{bj}$ remains.` },
        { id: 'dw', at: '**3. 가중치에 대한 기울기.**', t: R`가중치: 표본에 대해 합`, en: R`Weights: sum over samples`,
          d: R`$W_{ij}$는 모든 표본의 $i$번째 출력에 들어가 표본에 대한 합이 남고, 그 합이 외적의 합 $\sum_b\delta_bx_b^T$입니다.`,
          dEn: R`$W_{ij}$ enters output $i$ of every sample, so the sum over samples stays, and it is the sum of outer products $\sum_b\delta_bx_b^T$.` },
        { id: 'size', at: '**4. 크기 점검.**', t: R`크기 점검`, en: R`Check the shapes`,
          d: R`두 결과의 크기가 각각 $X$, $W$와 같고, $B=1$이면 9.5절의 $W^T\delta$, $\delta x^T$로 돌아갑니다.`,
          dEn: R`The two results have the shapes of $X$ and $W$, and for $B=1$ they reduce to $W^T\delta$ and $\delta x^T$ of Section 9.5.` },
        { id: 'mean', at: '**5. 평균 손실이면.**', t: R`평균 손실 = 미니배치 기울기`, en: R`Mean loss = minibatch gradient`,
          d: R`손실이 표본 손실의 평균이면 가중치 기울기는 표본별 기울기의 평균, 곧 미니배치 기울기입니다.`,
          dEn: R`If the loss is the mean of per-sample losses, the weight gradient is the mean of per-sample gradients, i.e., the minibatch gradient.` },
      ],
    },
    'ch10-mbnorepl': {
      easy: R`두 가지를 보입니다. 먼저 “섞고 순서대로 자르기”로 만든 배치가 크기 $B$인 부분집합 중 하나를 똑같은 확률로 고른 것과 같다는 것(순열의 개수 세기). 그다음 그런 배치의 평균 기울기가 불편이고 분산이 $\frac{N-B}{N-1}\cdot\frac\Sigma B$라는 것입니다.

요령은 “$i$번째 표본이 배치에 들어갔나”를 나타내는 지시변수 $I_i$로 배치 평균을 쓰는 것입니다. 그러면 필요한 것은 $I_i$의 평균($B/N$)과 두 지시변수의 곱의 평균뿐이고, 편차들의 합이 0이라는 사실이 교차항을 $-N\Sigma$로 정리해 줍니다. 비복원이라 두 표본이 함께 뽑힐 확률이 조금 작아지는 것이 보정 계수의 정체입니다.`,
      easyEn: R`Two things are shown. First, a batch made by “shuffle, then cut in order” is the same as picking one of the subsets of size $B$ with equal probability (count permutations). Second, the mean gradient of such a batch is unbiased and has variance $\frac{N-B}{N-1}\cdot\frac\Sigma B$.

The trick is to write the batch mean with indicators $I_i$ telling whether sample $i$ is in the batch. Then all that is needed are the mean of $I_i$ ($B/N$) and the mean of a product of two indicators, and the fact that the deviations sum to 0 collapses the cross terms into $-N\Sigma$. Without replacement, two samples are slightly less likely to be drawn together, and that is where the correction factor comes from.`,
      nodes: [
        { id: 'shuffle', at: '**1. 섞어서 자른 배치는', t: R`섞어서 자르면 균등`, en: R`Shuffle-and-cut is uniform`,
          d: R`정해진 부분집합 $S$가 $m$번째 배치가 되는 순열은 $B!(N-B)!$개라 확률이 $1/\binom NB$로 $S$와 무관합니다.`,
          dEn: R`There are $B!(N-B)!$ permutations that make a given subset $S$ the $m$th batch, so its probability is $1/\binom NB$, the same for every $S$.` },
        { id: 'ind', at: '**2. 지시변수로 쓰기.**', t: R`지시변수로 쓰기`, en: R`Write with indicators`,
          d: R`편차 $e_i=g_i-\nabla f$의 합이 0임을 기록하고, 배치 평균의 오차를 $\frac1B\sum_iI_ie_i$로 씁니다.`,
          dEn: R`Note that the deviations $e_i=g_i-\nabla f$ sum to 0, and write the error of the batch mean as $\frac1B\sum_iI_ie_i$.` },
        { id: 'prob', at: '**3. 포함 확률.**', t: R`포함 확률 세기`, en: R`Count inclusion probabilities`,
          d: R`이항계수로 $\E I_i=B/N$, $\E[I_iI_j]=\frac{B(B-1)}{N(N-1)}$ ($i\ne j$)를 셉니다.`,
          dEn: R`Binomial coefficients give $\E I_i=B/N$ and $\E[I_iI_j]=\frac{B(B-1)}{N(N-1)}$ for $i\ne j$.` },
        { id: 'unb', at: '**4. 불편성.**', t: R`불편성`, en: R`Unbiasedness`,
          d: R`선형성과 $\sum e_i=0$으로 오차의 평균이 0입니다.`,
          dEn: R`Linearity and $\sum e_i=0$ make the mean error 0.` },
        { id: 'cov', at: '**5. 공분산.**', t: R`공분산과 보정 계수`, en: R`Covariance and the correction`,
          d: R`대각항은 $N\Sigma$, 교차항은 $\sum e_i=0$ 덕분에 $-N\Sigma$가 되어, 정리하면 $\frac{N-B}{N-1}\cdot\frac\Sigma B$입니다.`,
          dEn: R`The diagonal terms give $N\Sigma$ and, thanks to $\sum e_i=0$, the cross terms give $-N\Sigma$; simplifying yields $\frac{N-B}{N-1}\cdot\frac\Sigma B$.` },
        { id: 'tr', at: '**6. 제곱노름.**', t: R`제곱노름 = 대각합`, en: R`Squared norm = trace`,
          d: R`제곱노름의 기댓값은 공분산의 대각합입니다.`,
          dEn: R`The expected squared norm is the trace of the covariance.` },
      ],
    },
    'ch11-depth': {
      easy: R`한 층만 정확히 계산하면 나머지는 곱하기입니다. 한 층에서 $z_i=\sum_jW_{ij}h_j$의 제곱평균을 구할 때, 교차항은 **가중치**의 평균이 0이라 모두 사라지므로 입력 $h$가 어떤 분포든(평균이 0이 아니어도, 성분끼리 얽혀 있어도) 결과는 “폭 × 가중치 분산 × 입력의 제곱평균”입니다.

활성화는 이 배율에 상수 하나를 곱합니다: 선형은 1, ReLU는 대칭성 때문에 정확히 $\frac12$, tanh는 $\lvert\tanh z\rvert\le\lvert z\rvert$라 많아야 1. 층마다 같은 배율이 곱해지니 깊이에 대해 기하급수적으로 커지거나 작아지고, 배율이 정확히 1일 때(Xavier, He)만 크기가 유지됩니다.`,
      easyEn: R`Compute one layer exactly and the rest is multiplication. When taking the mean square of $z_i=\sum_jW_{ij}h_j$ for one layer, every cross term vanishes because the **weights** have mean 0, so whatever the distribution of the input $h$ (even with nonzero mean, even with entangled components) the result is “width × weight variance × mean square of the input”.

The activation multiplies this factor by one constant: 1 for linear, exactly $\frac12$ for ReLU by symmetry, at most 1 for tanh because $\lvert\tanh z\rvert\le\lvert z\rvert$. The same factor is multiplied at every layer, so the size grows or shrinks exponentially with depth, and only when the factor is exactly 1 (Xavier, He) is it kept.`,
      nodes: [
        { id: 'indep', at: '**1. 무엇이 무엇과 독립인가.**', t: R`독립성의 출처`, en: R`Where independence comes from`,
          d: R`$h_{\ell-1}$은 앞 층 가중치와 입력만의 함수라 $W_\ell$과 독립이고, $\lvert\varphi(z)\rvert\le\lvert z\rvert$로 모든 2차 모멘트가 유한합니다.`,
          dEn: R`$h_{\ell-1}$ depends only on the input and earlier weights, so it is independent of $W_\ell$, and $\lvert\varphi(z)\rvert\le\lvert z\rvert$ keeps every second moment finite.` },
        { id: 'one', at: '**2. 한 층 (a).**', t: R`한 층의 정확한 식`, en: R`One layer exactly`,
          d: R`제곱을 전개하면 교차항은 가중치의 평균이 0이라 사라지고 $\E[z_{\ell,i}^2]=n_{\ell-1}\sigma_\ell^2m_{\ell-1}$ — 키 박스의 std 식입니다.`,
          dEn: R`Expanding the square, cross terms vanish because the weights have mean 0, leaving $\E[z_{\ell,i}^2]=n_{\ell-1}\sigma_\ell^2m_{\ell-1}$, the std formula of the key box.` },
        { id: 'relu', at: '**3. 선형과 ReLU (b), (c).**', t: R`선형과 ReLU`, en: R`Linear and ReLU`,
          d: R`선형은 그대로, ReLU는 $z$가 0에 대해 대칭이라 양쪽 절반의 제곱평균이 같아 정확히 $\frac12$배가 됩니다.`,
          dEn: R`Linear passes the factor unchanged; for ReLU, $z$ is symmetric about 0, so both halves have the same mean square and exactly $\frac12$ remains.` },
        { id: 'tanh', at: '**4. tanh (d).**', t: R`tanh는 줄이기만`, en: R`tanh only shrinks`,
          d: R`평균값 정리로 $\lvert\tanh z\rvert\le\lvert z\rvert$이라 tanh 층의 배율은 선형의 배율 이하입니다.`,
          dEn: R`By the mean value theorem $\lvert\tanh z\rvert\le\lvert z\rvert$, so a tanh layer's factor is at most the linear one.` },
        { id: 'stack', at: '**5. 층을 쌓으면.**', t: R`층을 쌓으면 기하급수`, en: R`Stacking is exponential`,
          d: R`한 층의 관계를 곱하면 $(cn\sigma^2)^L$이 되어, 배율이 1이 아니면 깊이에 대해 기하급수적으로 폭발하거나 소멸합니다.`,
          dEn: R`Multiplying the one-layer relations gives $(cn\sigma^2)^L$, which explodes or vanishes exponentially in depth unless the factor is 1.` },
        { id: 'num', at: '**6. 슬라이드의 수치.**', t: R`슬라이드의 수치`, en: R`The numbers in the slides`,
          d: R`$n=4096$에서 $\sigma=0.01$은 층마다 0.64배(소멸), $0.05$는 3.2배(포화), $1/64$는 1배입니다.`,
          dEn: R`With $n=4096$, $\sigma=0.01$ gives 0.64 per layer (vanishing), $0.05$ gives 3.2 (saturation), and $1/64$ gives exactly 1.` },
      ],
    },
    'ch11-glorot': {
      easy: R`순방향에서 분산을 보존하려면 $\sigma^2=1/D_{in}$, 역방향에서는 같은 계산을 출력 쪽 첨자로 해서 $\sigma^2=1/D_{out}$이 필요합니다. 폭이 다르면 둘을 동시에 만족할 수 없으니 둘의 조화평균 $\frac2{D_{in}+D_{out}}$으로 절충하는데, 이 값은 두 배율의 평균을 정확히 1로 만드는 값입니다.

마지막으로 실제로는 균등분포 $U(-a,a)$로 뽑는 경우가 많으므로, 그 분산 $a^2/3$을 적분으로 구해 절충값에 맞추면 범위 $a=\sqrt{6/(D_{in}+D_{out})}$가 나옵니다.`,
      easyEn: R`Keeping the variance in the forward pass needs $\sigma^2=1/D_{in}$; in the backward pass the same computation over the output index needs $\sigma^2=1/D_{out}$. With different widths both cannot hold, so the compromise is their harmonic mean $\frac2{D_{in}+D_{out}}$, which is exactly the value that makes the average of the two factors equal to 1.

Finally, since weights are often drawn from a uniform distribution $U(-a,a)$, computing its variance $a^2/3$ by an integral and matching it to the compromise gives the range $a=\sqrt{6/(D_{in}+D_{out})}$.`,
      nodes: [
        { id: 'back', at: '**1. 역방향 (a).**', t: R`역방향 조건`, en: R`The backward condition`,
          d: R`$g=W^T\delta$의 2차 모멘트를 순방향과 같은 방법으로 계산하면 $D_{out}\sigma^2u$이고, 보존 조건은 $\sigma^2=1/D_{out}$입니다.`,
          dEn: R`Computing the second moment of $g=W^T\delta$ as in the forward pass gives $D_{out}\sigma^2u$, so preservation needs $\sigma^2=1/D_{out}$.` },
        { id: 'harm', at: '**2. 두 조건과 조화평균 (b).**', t: R`조화평균으로 절충`, en: R`Compromise by the harmonic mean`,
          d: R`두 조건은 폭이 같을 때만 함께 성립합니다. 조화평균은 둘 사이에 있고, 두 배율의 합이 2라 평균이 정확히 1입니다.`,
          dEn: R`The two conditions hold together only for equal widths. The harmonic mean lies between them, and the two factors sum to 2, so their average is exactly 1.` },
        { id: 'unif', at: '**3. 균등분포의 분산 (c).**', t: R`균등분포의 분산`, en: R`Variance of the uniform`,
          d: R`$\int_{-a}^aw^2/(2a)\,dw=a^2/3$을 절충값에 맞추면 $a=\sqrt{6/(D_{in}+D_{out})}$.`,
          dEn: R`Matching $\int_{-a}^aw^2/(2a)\,dw=a^2/3$ to the compromise gives $a=\sqrt{6/(D_{in}+D_{out})}$.` },
        { id: 'num', at: '**4. 수치 예.**', t: R`수치 예`, en: R`A numerical example`,
          d: R`$D_{in}=300$, $D_{out}=100$이면 $a\approx0.1225$이고 두 배율은 1.5와 0.5입니다.`,
          dEn: R`For $D_{in}=300$, $D_{out}=100$, $a\approx0.1225$ and the two factors are 1.5 and 0.5.` },
      ],
    },
    'ch12-lrquad': {
      easy: R`가장 단순한 그릇 $f=\frac\beta2x^2$에서는 경사하강법을 손으로 끝까지 풀 수 있습니다: 매 걸음 $x$가 같은 배율 $r=1-\eta\beta$로 곱해집니다. 학습률의 네 영역은 이 배율이 $(0,1)$, 0, $(-1,0)$, $-1$, $(-\infty,-1)$ 중 어디에 있느냐로 갈립니다.

여기에 기울기 잡음을 더하면 $\E[x_t^2]$가 “배율² × 이전 값 + 잡음”이라는 간단한 점화식을 따릅니다. 그 고정점이 잡음 바닥이고, 그 크기가 대략 $\eta$에 비례한다는 것이 슬라이드의 학습 곡선 (b), (c)와 계단 스케줄의 뚝 떨어짐을 설명합니다.`,
      easyEn: R`On the simplest bowl $f=\frac\beta2x^2$, gradient descent can be solved by hand: every step multiplies $x$ by the same factor $r=1-\eta\beta$. The four regimes of the learning rate are told apart by whether this factor lies in $(0,1)$, at 0, in $(-1,0)$, at $-1$, or in $(-\infty,-1)$.

Adding gradient noise, $\E[x_t^2]$ follows the simple recursion “factor² × previous value + noise”. Its fixed point is the noise floor, and its size, roughly proportional to $\eta$, explains the learning curves (b), (c) of the slides and the sudden drop of a step schedule.`,
      nodes: [
        { id: 'closed', at: '**1. 닫힌 꼴.**', g: R`결정적 GD: 네 영역`, gEn: R`Deterministic GD: four regimes`, t: R`닫힌 꼴`, en: R`Closed form`,
          d: R`$x_{t+1}=(1-\eta\beta)x_t$이므로 $x_t=r^tx_0$, $f(x_t)=r^{2t}f(x_0)$.`,
          dEn: R`$x_{t+1}=(1-\eta\beta)x_t$, so $x_t=r^tx_0$ and $f(x_t)=r^{2t}f(x_0)$.` },
        { id: 'regimes', at: '**2. 네 영역 (a).**', t: R`배율로 영역 나누기`, en: R`Regimes by the factor`,
          d: R`$r$의 위치에 따라 단조 감소, 한 걸음 도착, 진동하며 감소, 제자리 진동, 폭발로 나뉩니다.`,
          dEn: R`Depending on where $r$ lies: monotone decrease, arrival in one step, decrease with oscillation, endless oscillation, or blow-up.` },
        { id: 'rec', at: '**3. SGD의 2차 모멘트 점화식 (b).**', g: R`SGD: 잡음 바닥`, gEn: R`SGD: the noise floor`, t: R`2차 모멘트 점화식`, en: R`Second-moment recursion`,
          d: R`$x_t$와 새 잡음 $\xi_t$가 독립이라 교차항이 사라지고 $a_{t+1}=r^2a_t+\eta^2s^2$.`,
          dEn: R`Since $x_t$ is independent of the new noise $\xi_t$, the cross term vanishes and $a_{t+1}=r^2a_t+\eta^2s^2$.` },
        { id: 'lim', at: '**4. 극한.**', t: R`고정점 = 잡음 바닥`, en: R`Fixed point = noise floor`,
          d: R`$r^2<1$이면 고정점으로 수렴하고, 기대 손실의 극한은 $\frac{\eta s^2}{2(2-\eta\beta)}$입니다.`,
          dEn: R`For $r^2<1$ the recursion converges to its fixed point, and the expected loss tends to $\frac{\eta s^2}{2(2-\eta\beta)}$.` },
        { id: 'floor', at: '**5. 바닥 아래로는 못 간다.**', t: R`바닥의 하한`, en: R`A lower bound on the floor`,
          d: R`점화식의 잡음 항만으로 $t\ge1$에서 $\E f(x_t)\ge\frac\beta2\eta^2s^2>0$입니다.`,
          dEn: R`The noise term of the recursion alone gives $\E f(x_t)\ge\frac\beta2\eta^2s^2>0$ for $t\ge1$.` },
        { id: 'read', at: '**6. 학습 곡선 읽기.**', t: R`학습 곡선 읽기`, en: R`Reading the learning curves`,
          d: R`작은 $\eta$는 느리지만 바닥이 낮고, 큰 $\eta$는 빠르지만 바닥이 높으며, $\eta>2/\beta$는 폭발합니다. $\eta$를 줄이면 바닥이 내려갑니다.`,
          dEn: R`A small $\eta$ is slow but has a low floor, a large $\eta$ is fast but has a high floor, and $\eta>2/\beta$ blows up. Lowering $\eta$ lowers the floor.` },
      ],
    },
    'ch12-lrdecay': {
      easy: R`가변 보폭 SGD의 정리는 보장을 “(출발 차이 + 잡음 × 보폭 제곱의 합) ÷ 보폭의 합”으로 줍니다. 그러니 스케줄을 평가하려면 보폭의 합이 얼마나 빨리 커지는지, 보폭 제곱의 합이 얼마나 작게 머무는지만 알면 됩니다.

$\sum\eta_t^2$이 유한하고 $\sum\eta_t$가 무한하면 분자는 묶여 있고 분모는 끝없이 커지니 보장이 0으로 갑니다. 역제곱근 $c/\sqrt t$는 합을 적분과 비교해 분모 $\approx2c\sqrt T$, 분자 $\approx\ln T$를 얻어 $O(\ln T/\sqrt T)$가 됩니다.`,
      easyEn: R`The variable-step SGD theorem gives the guarantee as “(initial gap + noise × sum of squared steps) ÷ sum of steps”. So to judge a schedule, one only needs how fast the sum of steps grows and how small the sum of squared steps stays.

If $\sum\eta_t^2$ is finite and $\sum\eta_t$ is infinite, the numerator stays bounded while the denominator grows without bound, so the guarantee goes to 0. For the inverse square root $c/\sqrt t$, comparing the sums with integrals gives a denominator of about $2c\sqrt T$ and a numerator of about $\ln T$, hence $O(\ln T/\sqrt T)$.`,
      nodes: [
        { id: 'start', at: '**1. 출발점.**', t: R`정리를 두 합으로`, en: R`The theorem in two sums`,
          d: R`13.6절의 보장을 $S_1=\sum\eta_t$와 $S_2=\sum\eta_t^2$로 씁니다.`,
          dEn: R`Write the guarantee of Section 13.6 with $S_1=\sum\eta_t$ and $S_2=\sum\eta_t^2$.` },
        { id: 'rm', at: '**2. 조건 (a)에서 수렴.**', t: R`조건 (a)면 0으로`, en: R`Condition (a) gives 0`,
          d: R`$S_2$는 유한한 값으로 묶이고 $S_1\to\infty$이므로 보장이 0으로 갑니다.`,
          dEn: R`$S_2$ stays below a finite value while $S_1\to\infty$, so the guarantee goes to 0.` },
        { id: 'ct', at: '**3. $\\eta_t=c/t$가 (a)를 만족함.**', t: R`$c/t$의 두 급수`, en: R`The two series for $c/t$`,
          d: R`조화급수는 $\ln(T+1)$ 이상으로 발산하고, $\sum1/t^2$은 망원급수로 2 미만입니다.`,
          dEn: R`The harmonic series diverges, exceeding $\ln(T+1)$, and $\sum1/t^2$ stays below 2 by telescoping.` },
        { id: 'int', at: '**4. 역제곱근의 적분 비교 (b).**', t: R`적분과 비교`, en: R`Compare with integrals`,
          d: R`감소함수의 합을 적분으로 위아래에서 누르면 $\sum1/\sqrt t\ge2(\sqrt{T+1}-1)$, $\sum1/t\le1+\ln T$.`,
          dEn: R`Bounding sums of a decreasing function by integrals gives $\sum1/\sqrt t\ge2(\sqrt{T+1}-1)$ and $\sum1/t\le1+\ln T$.` },
        { id: 'comb', at: '**5. 결합.**', t: R`합쳐서 속도 읽기`, en: R`Combine and read the rate`,
          d: R`$T\ge2$에서 $\sqrt{T+1}-1\ge\sqrt T/2$이므로 $S_1\ge c\sqrt T$이고, 보장은 $O(\ln T/\sqrt T)$입니다.`,
          dEn: R`For $T\ge2$, $\sqrt{T+1}-1\ge\sqrt T/2$, so $S_1\ge c\sqrt T$ and the guarantee is $O(\ln T/\sqrt T)$.` },
      ],
    },
    'ch12-bnback': {
      easy: R`BN의 역전파가 까다로운 이유는 평균 $\mu$와 표준편차 $s$도 배치의 모든 $x_k$의 함수라서, $x_k$ 하나를 흔들면 자기 $\hat x_k$뿐 아니라 **모든** $\hat x_i$가 함께 움직이기 때문입니다. 그래서 먼저 $\mu$와 $s$를 $x_k$로 미분하고, 몫의 미분으로 야코비안 $\partial\hat x_i/\partial x_k$를 구한 뒤, 연쇄법칙으로 모읍니다.

결과의 세 항은 직접 경로, 평균 경로, 분산 경로에 대응합니다. 마지막으로 기울기의 합이 0이고 ($\varepsilon=0$이면) $\hat x$와도 직교한다는 것을 확인하는데, 이는 BN이 평행이동과 늘이기에 불변이라는 사실의 기울기 버전입니다.`,
      easyEn: R`Backpropagation through BN is tricky because the mean $\mu$ and the standard deviation $s$ are themselves functions of every $x_k$ in the batch, so nudging one $x_k$ moves not just its own $\hat x_k$ but **every** $\hat x_i$. So first differentiate $\mu$ and $s$ with respect to $x_k$, get the Jacobian $\partial\hat x_i/\partial x_k$ by the quotient rule, and then collect with the chain rule.

The three terms of the result correspond to the direct path, the mean path and the variance path. Finally we check that the gradient sums to 0 and (for $\varepsilon=0$) is orthogonal to $\hat x$, the gradient version of the fact that BN is invariant to shifting and stretching.`,
      nodes: [
        { id: 'gb', at: '**1. $\\gamma$, $\\beta$, $\\hat x$의 기울기.**', t: R`$\gamma$, $\beta$, $\hat x$`, en: R`$\gamma$, $\beta$, $\hat x$`,
          d: R`$\gamma,\beta$는 모든 표본에 공유되어 합이 되고, $\hat x_i$의 기울기는 $\gamma\,\partial L/\partial y_i$입니다.`,
          dEn: R`$\gamma,\beta$ are shared by all samples, so their gradients are sums, and the gradient of $\hat x_i$ is $\gamma\,\partial L/\partial y_i$.` },
        { id: 'stats', at: '**2. 평균과 표준편차의 미분.**', t: R`$\mu$와 $s$의 미분`, en: R`Derivatives of $\mu$ and $s$`,
          d: R`$\partial\mu/\partial x_k=1/N$이고, 편차의 합이 0이라 $\partial s/\partial x_k=\hat x_k/N$입니다.`,
          dEn: R`$\partial\mu/\partial x_k=1/N$, and since the deviations sum to 0, $\partial s/\partial x_k=\hat x_k/N$.` },
        { id: 'jac', at: '**3. 정규화의 야코비안.**', t: R`야코비안의 세 경로`, en: R`Three paths in the Jacobian`,
          d: R`몫의 미분으로 $\frac1s(\mathbb 1[i=k]-\frac1N-\frac{\hat x_i\hat x_k}N)$: 직접, 평균, 분산 경로입니다.`,
          dEn: R`The quotient rule gives $\frac1s(\mathbb 1[i=k]-\frac1N-\frac{\hat x_i\hat x_k}N)$: the direct, mean and variance paths.` },
        { id: 'chain', at: '**4. 연쇄법칙.**', t: R`연쇄법칙으로 모으기`, en: R`Collect by the chain rule`,
          d: R`$g_i$와 야코비안을 곱해 더하면 입력 기울기 공식이 나옵니다.`,
          dEn: R`Multiplying $g_i$ by the Jacobian and summing gives the input gradient formula.` },
        { id: 'ids', at: '**5. 두 항등식.**', t: R`합 0과 직교`, en: R`Zero sum and orthogonality`,
          d: R`$\sum\hat x_k=0$으로 기울기의 합이 0이고, $\sum\hat x_k^2=N\sigma^2/s^2$로 $\varepsilon=0$이면 $\hat x$와 직교합니다.`,
          dEn: R`$\sum\hat x_k=0$ makes the gradient sum to 0, and $\sum\hat x_k^2=N\sigma^2/s^2$ makes it orthogonal to $\hat x$ when $\varepsilon=0$.` },
      ],
    },
    'ch13-convex': {
      easy: R`볼록이면 접평면이 그래프 아래에 있으므로, 현재 손실과 최솟값의 차이를 “기울기 · (현재점 − 최솟점)”으로 위에서 누를 수 있습니다. 여기에 GD 한 걸음의 감소량을 합치고 완전제곱을 하면, 그 차이가 “최솟점까지 거리 제곱이 이번 걸음에 줄어든 양”보다 작다는 깔끔한 부등식이 나옵니다.

거리 제곱이 줄어든 양을 모두 더하면 망원급수라 처음 거리 제곱 이하이고, 손실은 매 걸음 줄어들므로 마지막 손실의 차이는 합의 $1/T$ 이하입니다. 그래서 $O(1/T)$입니다.`,
      easyEn: R`For a convex function the tangent plane lies below the graph, so the gap between the current loss and the minimum can be bounded above by “gradient · (current point − minimizer)”. Adding the decrease of one GD step and completing the square, we get a clean inequality: the gap is at most “how much the squared distance to the minimizer shrank in this step”.

Adding up the shrinkage of the squared distance telescopes to at most the initial squared distance, and since the loss decreases at every step, the final gap is at most $1/T$ of the sum. Hence $O(1/T)$.`,
      nodes: [
        { id: 'first', at: '**1. 볼록함수의 1차 조건.**', t: R`볼록의 1차 조건`, en: R`First-order condition`,
          d: R`볼록성의 정의를 $\theta$로 나누고 $\theta\to0^+$로 보내 $f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle$를 얻습니다.`,
          dEn: R`Divide the definition of convexity by $\theta$ and let $\theta\to0^+$ to get $f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle$.` },
        { id: 'desc', at: '**2. 한 걸음의 감소.**', t: R`한 걸음의 감소`, en: R`Decrease per step`,
          d: R`$\eta\le1/\beta$이면 감소 조건에서 $f(x_{t+1})\le f(x_t)-\frac\eta2\lVert g_t\rVert^2$.`,
          dEn: R`For $\eta\le1/\beta$ the decrease condition gives $f(x_{t+1})\le f(x_t)-\frac\eta2\lVert g_t\rVert^2$.` },
        { id: 'upper', at: '**3. 볼록성으로 위에서 누르기.**', t: R`볼록성으로 누르기`, en: R`Bound by convexity`,
          d: R`1을 $y=x^*$에 쓰고 2와 합쳐, 차이를 내적과 기울기 제곱으로 누릅니다.`,
          dEn: R`Use 1 at $y=x^*$ and combine with 2 to bound the gap by an inner product and a squared gradient.` },
        { id: 'square', at: '**4. 완전제곱.**', t: R`완전제곱 = 거리의 감소`, en: R`Complete the square`,
          d: R`$\lVert x_{t+1}-x^*\rVert^2$을 전개하면 3의 오른쪽이 정확히 거리 제곱의 감소량 $\div2\eta$입니다.`,
          dEn: R`Expanding $\lVert x_{t+1}-x^*\rVert^2$ shows that the right side of 3 is exactly the decrease of the squared distance divided by $2\eta$.` },
        { id: 'tele', at: '**5. 망원급수.**', t: R`망원급수`, en: R`Telescope`,
          d: R`더하면 가운데 항이 지워져 차이들의 합이 $\lVert x_0-x^*\rVert^2/(2\eta)$ 이하입니다.`,
          dEn: R`Summing cancels the middle terms, so the sum of the gaps is at most $\lVert x_0-x^*\rVert^2/(2\eta)$.` },
        { id: 'last', at: '**6. 마지막 반복점.**', t: R`마지막 반복점`, en: R`The last iterate`,
          d: R`손실이 단조 감소하므로 마지막 차이는 평균 이하, 곧 $T$로 나눈 값 이하입니다.`,
          dEn: R`The loss decreases monotonically, so the last gap is at most the average, i.e., the sum divided by $T$.` },
      ],
    },
    'ch13-strong': {
      easy: R`강볼록이면 함수가 각 점에서 곡률 $\mu$인 포물선 **위**에 있습니다(하강 보조정리의 거울상). 이 포물선의 최솟값을 계산하면 “기울기가 작으면 최솟값에도 가깝다”는 부등식 $\lVert\nabla f\rVert^2\ge2\mu(f-f^*)$이 나옵니다.

GD 한 걸음은 손실을 $\frac1{2\beta}\lVert\nabla f\rVert^2$만큼 줄이므로, 이 부등식을 넣으면 매 걸음 최솟값과의 차이가 같은 비율 $1-\mu/\beta$로 줄어듭니다. 같은 비율이 계속 곱해지니 기하급수적으로 수렴합니다.`,
      easyEn: R`If $f$ is strongly convex, it lies **above** a parabola of curvature $\mu$ at every point (the mirror image of the descent lemma). Computing the minimum of that parabola gives the inequality $\lVert\nabla f\rVert^2\ge2\mu(f-f^*)$: “a small gradient means being close to the minimum value”.

One GD step lowers the loss by $\frac1{2\beta}\lVert\nabla f\rVert^2$, so plugging in this inequality shrinks the gap to the minimum by the same ratio $1-\mu/\beta$ at every step. The same ratio is multiplied again and again, so the convergence is geometric.`,
      nodes: [
        { id: 'lower', at: '**1. 이차 하한.**', t: R`이차 하한`, en: R`Quadratic lower bound`,
          d: R`적분형 테일러 공식에 헤시안의 아래쪽 한계 $\mu$를 쓰면 $f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle+\frac\mu2\lVert y-x\rVert^2$.`,
          dEn: R`Using the lower Hessian bound $\mu$ in the integral Taylor formula gives $f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle+\frac\mu2\lVert y-x\rVert^2$.` },
        { id: 'pl', at: '**2. 기울기로 최적값과의 차이를 누르기.**', t: R`기울기가 차이를 누름`, en: R`The gradient bounds the gap`,
          d: R`하한 포물선을 완전제곱해 최소화하면 $\lVert\nabla f(x)\rVert^2\ge2\mu(f(x)-f^*)$.`,
          dEn: R`Minimizing the lower parabola by completing the square gives $\lVert\nabla f(x)\rVert^2\ge2\mu(f(x)-f^*)$.` },
        { id: 'contract', at: '**3. 한 걸음의 축소.**', t: R`한 걸음의 축소`, en: R`Contraction per step`,
          d: R`감소 조건에 2를 넣으면 차이가 매 걸음 $1-\mu/\beta$배 이하가 됩니다.`,
          dEn: R`Putting 2 into the decrease condition shrinks the gap by a factor of at most $1-\mu/\beta$ per step.` },
        { id: 'iter', at: '**4. 반복.**', t: R`반복`, en: R`Iterate`,
          d: R`같은 배율을 $T$번 곱해 $(1-\mu/\beta)^T$를 얻습니다.`,
          dEn: R`Multiplying the same factor $T$ times gives $(1-\mu/\beta)^T$.` },
        { id: 'dist', at: '**5. 최솟점과 반복점의 거리.**', t: R`최솟점과 거리`, en: R`Minimizer and distance`,
          d: R`이차 하한으로 최솟점이 존재하고 하나뿐임을 보이고, 거리 제곱을 함수값 차이의 $2/\mu$배로 누릅니다.`,
          dEn: R`The quadratic lower bound shows that a minimizer exists and is unique, and bounds the squared distance by $2/\mu$ times the gap.` },
      ],
    },
  });
})();
