/* 증명 — Part C: 08 신경망, 09 역전파, 10 SGD·활성화, 11 초기화, 12 학습률·배치 정규화 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 08
  { ch: 'ch08', id: 'affine', title: '선형(아핀) 층의 합성은 아핀', keys: ['선형층의 합성은 선형'],
    tags: 'linear layer composition affine activation nonlinearity 선형 합성 아핀 활성화 비선형',
    stmt: R`$y_\ell=W_\ell y_{\ell-1}+b_\ell$ ($\ell=1,\dots,L$, $y_0=x$)이면 $y_L=Ax+c$, $A=W_L\cdots W_1$, $c=\sum_{k=1}^LW_L\cdots W_{k+1}b_k$.`,
    body: R`
$\ell$에 대한 귀납법으로 $y_\ell=A_\ell x+c_\ell$, $A_\ell=W_\ell\cdots W_1$, $c_\ell=\sum_{k=1}^\ell W_\ell\cdots W_{k+1}b_k$를 보입니다(빈 곱은 $I$).
- $\ell=1$: $y_1=W_1x+b_1$ ($A_1=W_1$, $c_1=b_1$).
- $\ell-1\to\ell$: $y_\ell=W_\ell(A_{\ell-1}x+c_{\ell-1})+b_\ell=W_\ell A_{\ell-1}x+(W_\ell c_{\ell-1}+b_\ell)$. $W_\ell A_{\ell-1}=A_\ell$이고 $W_\ell c_{\ell-1}+b_\ell=\sum_{k=1}^{\ell-1}W_\ell W_{\ell-1}\cdots W_{k+1}b_k+b_\ell=c_\ell$.`,
    note: R`따라서 활성화 없이 쌓은 신경망의 결정 경계는 초평면 하나뿐이고, 크기가 $n_L\times n_0$인 행렬 하나로 표현됩니다. 중간층이 좁으면 $\operatorname{rank}A\le\min_\ell n_\ell$이라 오히려 표현력이 줄기도 합니다.` },
  { ch: 'ch08', id: 'xor', title: 'XOR는 선형 분리 불가능하고 은닉층 하나로 풀린다', keys: ['퍼셉트론의 한계'],
    tags: 'XOR linear separability perceptron hidden layer ReLU 선형 분리 퍼셉트론 은닉층',
    stmt: R`$(0,1),(1,0)$을 양성, $(0,0),(1,1)$을 음성으로 하는 XOR 자료를 나누는 $(w_1,w_2,b)$는 없다. 반면 $f(x)=\max(0,x_1+x_2)-2\max(0,x_1+x_2-1)$은 네 점에서 XOR 값을 정확히 낸다.`,
    body: R`
**불가능.** $s(x)=w_1x_1+w_2x_2+b$라 하고 양성에서 $s>0$, 음성에서 $s<0$이라 가정합니다.
$$s(0,1)+s(1,0)=w_1+w_2+2b>0,\qquad s(0,0)+s(1,1)=w_1+w_2+2b<0.$$
같은 양이 양수이면서 음수일 수 없으므로 모순입니다. (기하학적으로: 두 양성 점의 중점과 두 음성 점의 중점이 모두 $(\frac12,\frac12)$입니다.)

**구성.** $u=x_1+x_2$로 두면 $f=\max(0,u)-2\max(0,u-1)$.
| $x$ | $u$ | $f$ |
|---|---|---|
| $(0,0)$ | 0 | $0-0=0$ |
| $(1,0),(0,1)$ | 1 | $1-0=1$ |
| $(1,1)$ | 2 | $2-2=0$ |
은닉층 $(h_1,h_2)=(\max(0,u),\max(0,u-1))$에서 네 점은 $(0,0),(1,0),(1,0),(2,1)$로 옮겨지고, 출력층의 선형함수 $h_1-2h_2$가 이들을 분리합니다.`,
    note: R`퍼셉트론의 활성화 $g$가 단조이면 결정 경계 $\{g(w^Tx+b)=c\}$는 여전히 초평면이므로, 단층으로는 활성화를 바꿔도 XOR를 풀 수 없습니다. 은닉층이 표현을 바꿔 주어야 합니다(임베딩 관점).` },
  { ch: 'ch08', id: 'paramcount', title: 'MLP의 파라미터 수', keys: ['다층 퍼셉트론'],
    tags: 'MLP parameter count fully connected 파라미터 수 완전연결',
    stmt: R`층 크기가 $n_0,n_1,\dots,n_L$인 MLP(모든 층에 편향)의 파라미터 수는 $\sum_{\ell=1}^L(n_{\ell-1}+1)n_\ell$이다.`,
    body: R`
$\ell$층의 $W_\ell\in\mathbb R^{n_\ell\times n_{\ell-1}}$은 성분이 $n_\ell n_{\ell-1}$개, $b_\ell\in\mathbb R^{n_\ell}$은 $n_\ell$개이므로 합 $(n_{\ell-1}+1)n_\ell$. 층마다 더하면 결과입니다.
예: $3072\to1536\to768\to384\to1$이면 $3073\cdot1536+1537\cdot768+769\cdot384+385=6{,}196{,}225$.` },

  // ───── 09
  { ch: 'ch09', id: 'chain', title: '계산 그래프의 연쇄법칙', keys: ['연쇄법칙: 상류 × 국소 기울기'],
    tags: 'chain rule computational graph upstream local gradient backpropagation 연쇄법칙 계산 그래프 상류 국소',
    stmt: R`계산 그래프에서 변수 $x$가 노드 $z_1,\dots,z_K$의 입력으로 쓰이고 손실 $L$이 $z_k$들을 통해서만 $x$에 의존하면 $\dfrac{\partial L}{\partial x}=\sum_{k=1}^K\dfrac{\partial L}{\partial z_k}\dfrac{\partial z_k}{\partial x}$. 특히 $K=1$이면 (하류) = (상류) × (국소).`,
    body: R`
$L=\Phi(z_1(x,\dots),\dots,z_K(x,\dots))$로 쓸 수 있습니다. 다변수 연쇄법칙: $\Phi$가 미분가능하고 각 $z_k$가 $x$에 대해 미분가능하면
$$\frac{\partial L}{\partial x}=\sum_{k=1}^K\frac{\partial\Phi}{\partial z_k}\frac{\partial z_k}{\partial x}.$$
$\frac{\partial\Phi}{\partial z_k}=\frac{\partial L}{\partial z_k}$은 $z_k$에서 뒤로 들어온 값(상류 기울기)이고, $\frac{\partial z_k}{\partial x}$는 노드 $z_k$가 자기 입력만 보고 계산할 수 있는 국소 기울기입니다.

**역전파의 순서.** 그래프를 위상정렬해 출력에서 입력 쪽으로 가며 계산하면, 어떤 변수의 상류 기울기를 쓸 때 그 변수를 쓰는 모든 노드의 기울기가 이미 계산되어 있습니다. 따라서 각 변은 한 번씩만 처리되고 전체 비용은 순방향 계산과 같은 차수입니다.

**예.** $f=(x+y)z$, $q=x+y$: $\frac{\partial f}{\partial x}=\frac{\partial f}{\partial q}\frac{\partial q}{\partial x}=z\cdot1=-4$ ($(x,y,z)=(-2,5,-4)$).` },
  { ch: 'ch09', id: 'sigmoidgate', title: '시그모이드 게이트의 국소 기울기', keys: ['시그모이드 게이트'],
    tags: 'sigmoid gate local gradient backprop neuron 시그모이드 게이트 국소 기울기 뉴런',
    stmt: R`$\sigma(x)=\frac1{1+e^{-x}}$의 국소 기울기는 $\frac{d\sigma}{dx}=(1-\sigma(x))\sigma(x)$이고, 뉴런 예제($w_0x_0+w_1x_1+w_2=1$)에서 $\sigma'(1)\approx0.20$이다.`,
    body: R`
$$\frac{d\sigma}{dx}=\frac{e^{-x}}{(1+e^{-x})^2}=\frac{(1+e^{-x})-1}{1+e^{-x}}\cdot\frac1{1+e^{-x}}=\big(1-\sigma(x)\big)\sigma(x).$$
예제의 순방향에서 $\sigma(1)=1/(1+e^{-1})\approx0.731$이므로 $\sigma'(1)\approx0.731\times0.269\approx0.197\approx0.20$.

이는 네 개 노드($\times-1$, $\exp$, $+1$, $1/x$)의 국소 기울기 곱과 같습니다:
$$(-1)\cdot e^{-1}\cdot1\cdot\Big(-\frac1{(1+e^{-1})^2}\Big)=\frac{e^{-1}}{(1+e^{-1})^2}=\sigma'(1).$$
그래서 계산 그래프를 “시그모이드 노드 하나”로 묶어도 결과가 같습니다(그래프 표현은 유일하지 않음).` },
  { ch: 'ch09', id: 'gates', title: '덧셈·곱셈·복사·최댓값 게이트의 기울기', keys: ['게이트별 기울기 규칙'],
    tags: 'add gate multiply gate copy gate max gate gradient router distributor 덧셈 곱셈 복사 최댓값 게이트',
    stmt: R`상류 기울기가 $\delta=\partial L/\partial z$일 때: 덧셈 $z=x+y$는 $\partial L/\partial x=\partial L/\partial y=\delta$, 곱셈 $z=xy$는 $\partial L/\partial x=\delta y$, $\partial L/\partial y=\delta x$, 복사($x$가 $z_1=x,z_2=x$로 쓰임)는 $\partial L/\partial x=\delta_1+\delta_2$, 최댓값 $z=\max(x,y)$ ($x\ne y$)는 큰 쪽에 $\delta$, 작은 쪽에 0.`,
    body: R`
모두 연쇄법칙 $\partial L/\partial x=\sum_k\delta_k\,\partial z_k/\partial x$에 국소 기울기를 넣은 것입니다.
- **덧셈**: $\partial z/\partial x=\partial z/\partial y=1$.
- **곱셈**: $\partial z/\partial x=y$, $\partial z/\partial y=x$ — 상대 입력이 곱해지므로 “교환기”.
- **복사**: $z_1=x$, $z_2=x$이면 $\partial z_k/\partial x=1$이고 두 경로를 **더합니다**.
- **최댓값**: $x>y$이면 $x$ 근방에서 $\max(x,y)=x$이므로 $\partial z/\partial x=1$, $\partial z/\partial y=0$. $x=y$에서는 미분 불가능하며 관례적으로 한쪽을 고릅니다.`,
    note: R`ReLU $\max(0,x)$는 최댓값 게이트의 특수한 경우라 $x>0$일 때 기울기를 그대로 통과, $x<0$일 때 막습니다.` },
  { ch: 'ch09', id: 'matgrad', title: '성분별 함수와 행렬곱의 역전파', keys: ['벡터 역전파'],
    tags: 'Jacobian ReLU elementwise matrix multiplication backprop vector 야코비안 성분별 행렬곱 벡터 역전파',
    stmt: R`(1) $y_i=g(x_i)$ (성분별)이면 $\frac{\partial L}{\partial x}=g'(x)\odot\frac{\partial L}{\partial y}$. (2) $z=Wx$이면 $\frac{\partial L}{\partial x}=W^T\frac{\partial L}{\partial z}$, $\frac{\partial L}{\partial W}=\frac{\partial L}{\partial z}x^T$.`,
    body: R`
**(1)** $y_m$은 $x_m$에만 의존하므로 $\frac{\partial y_m}{\partial x_n}=\delta_{mn}g'(x_n)$, 즉 야코비안이 대각입니다. 연쇄법칙:
$$\frac{\partial L}{\partial x_n}=\sum_m\frac{\partial L}{\partial y_m}\frac{\partial y_m}{\partial x_n}=g'(x_n)\frac{\partial L}{\partial y_n}.$$
ReLU이면 $g'(x_n)=\mathbb 1\{x_n>0\}$. 슬라이드 예: $x=(1,-2,3,-1)$, $\frac{\partial L}{\partial y}=(4,-1,5,9)$ → $(4,0,5,0)$. $N\times N$ 대각행렬을 실제로 만들지 않고 성분별로 곱합니다.

**(2)** $z_i=\sum_jW_{ij}x_j$, $\delta=\frac{\partial L}{\partial z}$.
$$\frac{\partial L}{\partial x_j}=\sum_i\delta_i\frac{\partial z_i}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j,\qquad \frac{\partial L}{\partial W_{ij}}=\delta_i\frac{\partial z_i}{\partial W_{ij}}=\delta_ix_j=(\delta x^T)_{ij}.$$
($W_{ij}$은 $z_i$에만 들어갑니다.)`,
    note: R`미니배치 $X\in\mathbb R^{B\times N}$, $Z=XW^T$이면 $\frac{\partial L}{\partial W}=\Delta^TX$ ($\Delta=\partial L/\partial Z$): 표본별 외적 $\delta_bx_b^T$를 더한 것입니다. 크기가 맞도록 전치를 두면 틀리지 않습니다.` },
  { ch: 'ch09', id: 'mlpbp', title: '다층 퍼셉트론의 역전파 점화식', keys: ['다층 퍼셉트론의 역전파'],
    tags: 'MLP backpropagation delta recursion error signal 다층 퍼셉트론 역전파 점화식 오차',
    stmt: R`$a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$ ($\sigma$ 성분별), $\delta_\ell=\partial L/\partial a_\ell$이면
$$\delta_\ell=\sigma'(a_\ell)\odot\big(W_{\ell+1}^T\delta_{\ell+1}\big),\qquad \frac{\partial L}{\partial W_\ell}=\delta_\ell h_{\ell-1}^T,\qquad \frac{\partial L}{\partial b_\ell}=\delta_\ell.$$`,
    body: R`
$a_\ell\to h_\ell\to a_{\ell+1}$ 순서로 이어져 있고 $L$은 $a_\ell$에 $a_{\ell+1}$을 통해서만 의존합니다.
- 행렬곱 규칙: $a_{\ell+1}=W_{\ell+1}h_\ell+b_{\ell+1}$이므로 $\frac{\partial L}{\partial h_\ell}=W_{\ell+1}^T\delta_{\ell+1}$.
- 성분별 규칙: $h_\ell=\sigma(a_\ell)$이므로 $\delta_\ell=\sigma'(a_\ell)\odot\frac{\partial L}{\partial h_\ell}$.
- 파라미터: $a_\ell=W_\ell h_{\ell-1}+b_\ell$에서 $\frac{\partial L}{\partial W_\ell}=\delta_\ell h_{\ell-1}^T$, $\frac{\partial a_\ell}{\partial b_\ell}=I$이므로 $\frac{\partial L}{\partial b_\ell}=\delta_\ell$.
성분으로 쓰면 $\delta_j=\sigma'(a_j)\sum_kw_{kj}\delta_k$, $\frac{\partial L}{\partial w_{ji}}=\delta_jh_i$ — Bishop의 오차 역전파 식입니다.` },

  // ───── 10
  { ch: 'ch10', id: 'unbiased', title: '확률적·미니배치 기울기는 불편추정량', keys: ['미니배치 기울기의 비편향성'],
    tags: 'stochastic gradient unbiased estimator minibatch expectation 확률적 기울기 불편 미니배치 기댓값',
    stmt: R`$f=\frac1N\sum_{i=1}^Nf_i$. $i\sim\mathrm{Uniform}\{1,\dots,N\}$이면 $\E[\nabla f_i(x)]=\nabla f(x)$. 첨자 집합 $K$를 크기 $B$인 모든 부분집합 중 균등하게(또는 첨자를 i.i.d. 균등하게) 뽑아도 $\E\big[\frac1B\sum_{k\in K}\nabla f_k(x)\big]=\nabla f(x)$.`,
    body: R`
**표본 하나.** $\E[\nabla f_i]=\sum_{i=1}^NP(i)\nabla f_i=\sum_i\frac1N\nabla f_i=\nabla f$.

**i.i.d. 미니배치.** 각 $k_b$가 균등하므로 $\E[\nabla f_{k_b}]=\nabla f$, 평균도 $\nabla f$.

**비복원 미니배치.** 대칭성에서 각 $i$가 $K$에 들어갈 확률은 $\frac{\binom{N-1}{B-1}}{\binom NB}=\frac BN$. 지시함수 $\mathbb 1\{i\in K\}$를 써서
$$\E\Big[\frac1B\sum_{k\in K}\nabla f_k\Big]=\frac1B\sum_{i=1}^NP(i\in K)\nabla f_i=\frac1B\cdot\frac BN\sum_i\nabla f_i=\nabla f.$$` },
  { ch: 'ch10', id: 'mbvar', title: '미니배치 기울기의 분산은 1/B로 줄어든다', keys: ['미니배치 기울기의 분산'],
    tags: 'minibatch variance batch size noise sampling with replacement 미니배치 분산 배치 크기 복원추출',
    stmt: R`$g_i=\nabla f_i(x)$, $\bar g=\nabla f(x)$, $\Sigma=\frac1N\sum_i(g_i-\bar g)(g_i-\bar g)^T$. 첨자를 i.i.d. 균등으로 $B$개 뽑으면 $\hat g=\frac1B\sum_bg_{k_b}$의 공분산은 $\Sigma/B$이고 $\E\lVert\hat g-\bar g\rVert^2=\tr\Sigma/B$.`,
    body: R`
$e_b=g_{k_b}-\bar g$는 i.i.d.이고 $\E e_b=0$, $\Cov(e_b)=\E[e_be_b^T]=\frac1N\sum_i(g_i-\bar g)(g_i-\bar g)^T=\Sigma$.
$$\Cov(\hat g)=\E\Big[\Big(\frac1B\sum_be_b\Big)\Big(\frac1B\sum_ce_c\Big)^T\Big]=\frac1{B^2}\Big(\sum_b\E[e_be_b^T]+\sum_{b\ne c}\E[e_b]\E[e_c]^T\Big)=\frac{B\Sigma}{B^2}=\frac\Sigma B.$$
대각합을 취하면 $\E\lVert\hat g-\bar g\rVert^2=\tr\Cov(\hat g)=\tr\Sigma/B$.`,
    note: R`비복원추출이면 $\Cov(\hat g)=\frac{N-B}{N-1}\cdot\frac\Sigma B$ (유한 모집단 보정). $B=N$이면 0, 즉 전체 배치 기울기는 잡음이 없습니다.` },
  { ch: 'ch10', id: 'actderiv', title: '시그모이드·tanh 도함수와 포화', keys: ['활성화 함수의 도함수'],
    tags: 'sigmoid tanh derivative saturation vanishing gradient 시그모이드 tanh 도함수 포화 기울기 소실',
    stmt: R`$\sigma'(z)=\sigma(1-\sigma)\le\frac14$, $\tanh z=2\sigma(2z)-1$, $\tanh'(z)=1-\tanh^2z\le1$, 그리고 $\lvert z\rvert\to\infty$이면 두 도함수 모두 0으로 간다.`,
    body: R`
$\sigma'=\sigma(1-\sigma)=\frac14-(\sigma-\frac12)^2\le\frac14$.
$2\sigma(2z)-1=\frac{2}{1+e^{-2z}}-1=\frac{1-e^{-2z}}{1+e^{-2z}}=\frac{e^z-e^{-z}}{e^z+e^{-z}}=\tanh z$.
몫의 미분: $\tanh'z=\frac{(e^z+e^{-z})^2-(e^z-e^{-z})^2}{(e^z+e^{-z})^2}=1-\tanh^2z$.
**포화.** $z\to\infty$이면 $\sigma\to1$이라 $\sigma'=\sigma(1-\sigma)\to0$, $\tanh\to1$이라 $\tanh'\to0$. $z\to-\infty$도 같습니다. 포화된 뉴런을 지나는 역전파 신호는 이 작은 수가 곱해져 사라집니다.` },
  { ch: 'ch10', id: 'samesign', title: '양수 입력이면 가중치 기울기의 부호가 같다', keys: ['시그모이드 출력은 0 중심이 아니다'],
    tags: 'zero centered sigmoid output gradient sign zigzag 0 중심 부호 지그재그',
    stmt: R`뉴런 $s=\sum_iw_ix_i+b$에서 모든 $x_i>0$이면 $\partial L/\partial w_i$ ($i=1,\dots,n$)의 부호는 모두 $\partial L/\partial s$의 부호와 같다.`,
    body: R`
$\frac{\partial s}{\partial w_i}=x_i$이므로 $\frac{\partial L}{\partial w_i}=\frac{\partial L}{\partial s}x_i$. $x_i>0$이면 $\sign\frac{\partial L}{\partial w_i}=\sign\frac{\partial L}{\partial s}$ (공통).
따라서 한 번의 갱신 $w\leftarrow w-\eta\nabla_wL$에서 모든 $w_i$가 함께 커지거나 함께 작아집니다. 목표 방향이 $(+,-)$ 같은 사분면에 있으면 $(+,+)$와 $(-,-)$ 방향을 번갈아 가며 지그재그로 접근할 수밖에 없습니다. 입력이 시그모이드(또는 ReLU) 출력이면 항상 양수라 이 문제가 생기고, tanh나 입력 정규화(평균 0)로 완화합니다.` },

  // ───── 11
  { ch: 'ch11', id: 'varprod', title: '독립인 확률변수 곱의 분산', keys: ['Xavier 초기화'],
    tags: 'variance product independent random variables second moment 분산 곱 독립 2차 모멘트',
    stmt: R`$w$와 $x$가 독립이고 $\E w=0$이면 $\E[wx]=0$, $\Var(wx)=\E[w^2]\E[x^2]=\Var(w)\,\E[x^2]$. 특히 $\E x=0$이면 $\Var(wx)=\Var(w)\Var(x)$.`,
    body: R`
독립이면 $\E[g(w)h(x)]=\E[g(w)]\E[h(x)]$. 따라서 $\E[wx]=\E w\,\E x=0$이고
$$\Var(wx)=\E[w^2x^2]-(\E[wx])^2=\E[w^2]\E[x^2].$$
$\E w=0$이므로 $\E[w^2]=\Var(w)$. $\E x=0$이면 $\E[x^2]=\Var(x)$.`,
    note: R`$\E x\ne0$인 경우(ReLU 출력) 분산이 아니라 2차 모멘트 $\E[x^2]$가 들어간다는 점이 He 초기화에서 중요합니다. 필기에서 “2차 모멘트를 추적한다”고 한 이유입니다.` },
  { ch: 'ch11', id: 'xavier', title: 'Xavier 초기화의 유도', keys: ['Xavier 초기화'], src: '강의 필기 · W4 월(2)',
    tags: 'Xavier Glorot initialization variance preserving tanh 초기화 분산 보존',
    stmt: R`$y=\sum_{i=1}^{D_{in}}w_ix_i$, 모든 $w_i,x_i$ 독립, $\E w_i=\E x_i=0$, $\Var w_i=\sigma^2$, $\Var x_i=v$이면 $\Var(y)=D_{in}\sigma^2v$. 따라서 $\Var(y)=v$가 되려면 $\sigma^2=1/D_{in}$.`,
    body: R`
**평균.** $\E y=\sum_i\E[w_ix_i]=\sum_i\E w_i\E x_i=0$이므로 $\Var y=\E[y^2]$.

**2차 모멘트.** 제곱을 전개하면
$$\E[y^2]=\E\Big[\sum_i\sum_kw_ix_iw_kx_k\Big]=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k].$$
- $i=k$: 독립성으로 $\E[w_i^2]\E[x_i^2]=\sigma^2v$ (평균이 0이라 2차 모멘트 = 분산).
- $i\ne k$: $w_i$는 나머지 모두와 독립이므로 $\E[w_iw_kx_ix_k]=\E[w_i]\,\E[w_kx_ix_k]=0$.

따라서 $\Var(y)=\sum_{i=1}^{D_{in}}\sigma^2v=D_{in}\sigma^2v$.

**보존 조건.** 층을 지나도 분산이 변하지 않게 $D_{in}\sigma^2v=v$로 두면 $\sigma^2=\frac1{D_{in}}$, 즉 $W=\text{randn}(D_{in},D_{out})/\sqrt{D_{in}}$.`,
    note: R`역전파에서는 $\frac{\partial L}{\partial x_i}=\sum_{j=1}^{D_{out}}w_{ji}\delta_j$이므로 같은 계산으로 기울기 분산이 $D_{out}\sigma^2$배가 됩니다. 두 조건을 절충한 것이 Glorot의 $\sigma^2=\frac2{D_{in}+D_{out}}$입니다. tanh는 원점 근처에서 $\tanh z\approx z$라 선형 분석이 잘 맞습니다.` },
  { ch: 'ch11', id: 'halfnormal', title: '반정규 적분: E[max(0,z)]와 E[max(0,z)²]', keys: ['He 초기화'], src: '강의 필기 · W4 수(1) D.I.Y.',
    tags: 'half normal ReLU expectation second moment Gaussian integral 반정규 기댓값 적분',
    stmt: R`$z\sim\N(0,q)$, $h=\max(0,z)$이면 $\E[h]=\sqrt{\dfrac q{2\pi}}$, $\E[h^2]=\dfrac q2$, $\Var(h)=\dfrac q2\Big(1-\dfrac1\pi\Big)$.`,
    body: R`
$\phi(z)=\frac1{\sqrt{2\pi q}}e^{-z^2/2q}$. $h=0$ ($z\le0$)이므로 $\E[h]=\int_0^\infty z\phi(z)\,dz$, $\E[h^2]=\int_0^\infty z^2\phi(z)\,dz$.

**$\E[h]$.** $u=\frac{z^2}{2q}$로 치환하면 $du=\frac zq\,dz$, 즉 $z\,dz=q\,du$:
$$\int_0^\infty z\,e^{-z^2/2q}dz=q\int_0^\infty e^{-u}du=q\quad\Longrightarrow\quad\E[h]=\frac q{\sqrt{2\pi q}}=\sqrt{\frac q{2\pi}}.$$

**$\E[h^2]$ — 대칭으로.** $z^2\phi(z)$는 우함수이므로 $\int_0^\infty z^2\phi=\frac12\int_{-\infty}^\infty z^2\phi=\frac12\E[z^2]=\frac q2$.

**$\E[h^2]$ — 부분적분으로.** $u=z$, $dv=ze^{-z^2/2q}dz$, $v=-qe^{-z^2/2q}$:
$$\int_0^\infty z^2e^{-z^2/2q}dz=\Big[-qze^{-z^2/2q}\Big]_0^\infty+q\int_0^\infty e^{-z^2/2q}dz=0+q\cdot\frac{\sqrt{2\pi q}}2,$$
(가우스 적분 $\int_{-\infty}^\infty e^{-z^2/2q}dz=\sqrt{2\pi q}$의 절반) 이므로 $\E[h^2]=\frac1{\sqrt{2\pi q}}\cdot\frac{q\sqrt{2\pi q}}2=\frac q2$.

**분산.** $\Var(h)=\frac q2-\frac q{2\pi}$.`,
    note: R`$\E[h^2]=\frac12\E[z^2]$는 정규분포가 아니어도 $z$의 분포가 0에 대해 대칭이면 성립합니다. $w_i$가 대칭분포(평균 0 정규 등)이고 $x$와 독립이면 $z=\sum w_ix_i$는 대칭입니다.` },
  { ch: 'ch11', id: 'he', title: 'He(Kaiming) 초기화의 유도', keys: ['He 초기화'], src: '강의 필기 · W4 수(1)',
    tags: 'He Kaiming MSRA initialization ReLU second moment 초기화 2차 모멘트',
    stmt: R`ReLU 층 $z=\sum_{i=1}^{D_{in}}w_ix_i$, $h=\max(0,z)$에서 $w_i$가 평균 0·분산 $\sigma^2$·대칭이고 $x$와 독립이면 $\E[h^2]=\frac12D_{in}\sigma^2\E[x^2]$. 2차 모멘트를 보존하려면 $\sigma^2=2/D_{in}$.`,
    body: R`
**1. 선형 부분(필기).** 독립성으로 $\Var(z)=\sum_i\Var(w_ix_i)$이고, $\Var(w_ix_i)=\E[(w_ix_i)^2]-(\E[w_ix_i])^2$에서 $\E[w_ix_i]=\E w_i\E x_i=0$, $\E[(w_ix_i)^2]=\E[w_i^2]\E[x_i^2]=\sigma^2v$ ($v=\E[x_i^2]$). 교차항 $\E[w_iw_kx_ix_k]=0$ ($i\ne k$)도 $\E w_i=0$에서 나오므로
$$\E[z^2]=\Var(z)=D_{in}\sigma^2v=:q.$$

**2. ReLU.** $z$가 대칭이므로(또는 필기처럼 $z\sim\N(0,q)$로 근사) 반정규 적분에서
$$\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v.$$

**3. 보존 조건.** 신호 전파에서는 2차 모멘트 $v=\E[x_i^2]$를 추적합니다. ReLU 전 $\E[z^2]=D_{in}\sigma^2v$, ReLU 후 $\E[h^2]=\frac12D_{in}\sigma^2v$. 다음 층의 입력이 $h$이므로 $\E[h^2]=\E[x^2]=v$를 요구하면
$$\frac12D_{in}\sigma^2v=v\ \Longrightarrow\ \sigma^2=\frac2{D_{in}},\qquad\sigma=\sqrt{\frac2{D_{in}}}.$$`,
    note: R`필기의 가정 “$\E[x_i]=0$, $\Var(x_i)=v$”는 ReLU 출력($\ge0$)에는 맞지 않습니다. 하지만 1단계에서 실제로 쓰는 것은 $\E w_i=0$과 독립성뿐이고, 결과는 $v$를 2차 모멘트로 읽으면 그대로 성립합니다. 필기에서도 결론 부분은 “2차 모멘트 $v=\E[x_i^2]$를 추적한다”로 정리했습니다.` },
  { ch: 'ch11', id: 'symmetry', title: '같은 초기값의 뉴런은 영원히 같다 (대칭 깨기)', keys: ['대칭 깨기'],
    tags: 'symmetry breaking initialization identical neurons gradient 대칭 깨기 초기화 동일 뉴런',
    stmt: R`은닉층의 두 뉴런 $j,k$가 들어오는 가중치 $w_j=w_k$, 편향 $b_j=b_k$, 나가는 가중치 $v_{\cdot j}=v_{\cdot k}$로 같게 초기화되면, 전체 배치·미니배치 경사하강법의 모든 단계 후에도 세 조건이 계속 성립한다.`,
    body: R`
귀납법. 어떤 단계에서 조건이 성립한다고 합시다.
- 순방향: 같은 입력 $h$에 대해 $a_j=w_j^Th+b_j=a_k$, 따라서 $h_j=h_k$.
- 역방향: $\delta_j=\sigma'(a_j)\sum_mv_{mj}\delta_m=\sigma'(a_k)\sum_mv_{mk}\delta_m=\delta_k$.
- 기울기: $\partial L/\partial w_j=\delta_jh=\partial L/\partial w_k$, $\partial L/\partial b_j=\partial L/\partial b_k$, $\partial L/\partial v_{mj}=\delta_mh_j=\partial L/\partial v_{mk}$.
같은 기울기로 같은 양만큼 갱신되므로 다음 단계에서도 조건이 성립합니다. 미니배치에서도 표본마다 같으므로 합도 같습니다.`,
    note: R`모든 가중치를 0으로 두면 극단적인 경우로, 한 층의 모든 뉴런이 같은 함수가 됩니다. 무작위 초기화가 이 대칭을 깹니다(드롭아웃도 대칭을 깨는 효과가 있음).` },

  // ───── 12
  { ch: 'ch12', id: 'bnidentity', title: '배치 정규화의 통계량과 항등함수 복원', keys: ['배치 정규화 (학습 시)'],
    tags: 'batch normalization identity gamma beta mean variance 배치 정규화 항등 평균 분산',
    stmt: R`BN 출력 $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$에서 $\hat x_{\cdot j}$의 배치 평균은 0, 배치 분산은 $\frac{\sigma_j^2}{\sigma_j^2+\varepsilon}$이고, $\gamma_j=\sqrt{\sigma_j^2+\varepsilon}$, $\beta_j=\mu_j$이면 $y_{ij}=x_{ij}$이다.`,
    body: R`
$\hat x_{ij}=(x_{ij}-\mu_j)/s_j$, $s_j=\sqrt{\sigma_j^2+\varepsilon}$.
$$\frac1N\sum_i\hat x_{ij}=\frac{\mu_j-\mu_j}{s_j}=0,\qquad \frac1N\sum_i\hat x_{ij}^2=\frac{\frac1N\sum_i(x_{ij}-\mu_j)^2}{s_j^2}=\frac{\sigma_j^2}{\sigma_j^2+\varepsilon}.$$
$y_{ij}$의 배치 평균은 $\beta_j$, 분산은 $\gamma_j^2\sigma_j^2/(\sigma_j^2+\varepsilon)\approx\gamma_j^2$이므로 $\gamma,\beta$가 출력의 크기와 위치를 정합니다.
$\gamma_j=s_j$, $\beta_j=\mu_j$이면 $y_{ij}=s_j\frac{x_{ij}-\mu_j}{s_j}+\mu_j=x_{ij}$.`,
    note: R`“$\gamma=\sigma,\beta=\mu$로 학습하면 항등함수를 되찾는다”(슬라이드)는 정확히는 $\gamma=\sqrt{\sigma^2+\varepsilon}$입니다. 다만 $\mu,\sigma$는 배치마다 바뀌는 값이라 고정된 $\gamma,\beta$로 모든 배치에서 정확히 항등이 되는 것은 아니고, “원래 분포를 표현할 자유가 있다”는 의미로 이해하면 됩니다.` },
  { ch: 'ch12', id: 'bnfuse', title: '추론 모드 BN은 아핀이고 앞 층과 합칠 수 있다', keys: ['배치 정규화 (추론 시)'],
    tags: 'batch normalization inference fusing affine running mean folding 추론 합치기 아핀 이동평균',
    stmt: R`고정된 $\mu,\sigma^2,\gamma,\beta,\varepsilon$에 대해 $y_j=a_jx_j+b_j$, $a_j=\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}}$, $b_j=\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}$. 앞에 FC층 $x=Wu+c$가 있으면 $y=W'u+c'$, $W'=\diag(a)W$, $c'=\diag(a)c+b$.`,
    body: R`
$$y_j=\gamma_j\frac{x_j-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}+\beta_j=\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}}x_j+\Big(\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}\Big)=a_jx_j+b_j.$$
벡터로 $y=\diag(a)x+b$. $x=Wu+c$를 넣으면
$$y=\diag(a)Wu+\diag(a)c+b.$$
$\diag(a)W$는 $W$의 $j$번째 행에 $a_j$를 곱한 행렬입니다. 합친 층은 원래 FC층과 같은 크기·같은 비용이므로 BN의 추론 비용이 0입니다.`,
    note: R`슬라이드의 “$b'=\diag(a)b+b$”에서 앞의 $b$는 FC층의 편향($c$), 뒤의 $b$는 BN의 절편 $b_j$입니다. 합성곱층도 출력 채널마다 같은 방식으로 합칩니다.` },
  { ch: 'ch12', id: 'ema', title: '이동평균은 지수가중 평균이다', keys: ['배치 정규화 (추론 시)'],
    tags: 'running average exponential moving average momentum batch norm 이동평균 지수가중 모멘텀',
    stmt: R`$\mu^{\text{run}}_t=m\,\mu^{\text{run}}_{t-1}+(1-m)\mu_t$ ($0\le m<1$)이면 $\mu^{\text{run}}_t=m^t\mu^{\text{run}}_0+(1-m)\sum_{s=1}^tm^{t-s}\mu_s$. 배치 평균이 모두 $\mu$이면 $\mu^{\text{run}}_t\to\mu$.`,
    body: R`
귀납법: $t=1$이면 $m\mu_0^{\text{run}}+(1-m)\mu_1$. $t-1$에서 성립하면
$$\mu^{\text{run}}_t=m\Big(m^{t-1}\mu_0^{\text{run}}+(1-m)\sum_{s=1}^{t-1}m^{t-1-s}\mu_s\Big)+(1-m)\mu_t=m^t\mu_0^{\text{run}}+(1-m)\sum_{s=1}^tm^{t-s}\mu_s.$$
가중치 $(1-m)m^{t-s}$의 합은 $1-m^t$이고 $m^t\to0$이므로, 모든 $\mu_s=\mu$이면 $\mu^{\text{run}}_t=m^t\mu_0^{\text{run}}+(1-m^t)\mu\to\mu$. 최근 배치일수록 큰 가중치를 받습니다.` },
  { ch: 'ch12', id: 'bnscale', title: '배치 정규화의 스케일 불변성', keys: ['배치 정규화의 스케일 불변성'],
    tags: 'batch normalization scale invariance effective learning rate gradient 스케일 불변 유효 학습률',
    stmt: R`$\varepsilon=0$이라 하자. BN 바로 앞의 선형층 가중치를 $\alpha>0$배 해도 BN 출력은 같다: $\mathrm{BN}(\alpha Wu)=\mathrm{BN}(Wu)$. 따라서 손실 $L(W)$는 $L(\alpha W)=L(W)$를 만족하고 $\nabla L(\alpha W)=\frac1\alpha\nabla L(W)$, $\langle\nabla L(W),W\rangle=0$.`,
    body: R`
$x=Wu$의 특성 $j$에 대해 $\alpha W$를 쓰면 배치 평균 $\alpha\mu_j$, 표준편차 $\alpha\sigma_j$이므로
$$\hat x_{ij}=\frac{\alpha x_{ij}-\alpha\mu_j}{\alpha\sigma_j}=\frac{x_{ij}-\mu_j}{\sigma_j}.$$
출력이 같으므로 $L(\alpha W)=L(W)$ ($\forall\alpha>0$).
**기울기.** 양변을 $W$로 미분하면 연쇄법칙으로 $\alpha\nabla L(\alpha W)=\nabla L(W)$.
**직교성.** $\alpha$로 미분하고 $\alpha=1$을 넣으면 $\frac{d}{d\alpha}L(\alpha W)\big\rvert_{\alpha=1}=\langle\nabla L(W),W\rangle=0$.
따라서 가중치가 커지면 기울기가 작아져 유효 학습률이 $\eta/\alpha^2$ 꼴로 줄고(방향 변화 기준), 큰 학습률에도 발산하기 어렵습니다.` },
  { ch: 'ch12', id: 'cosine', title: '코사인 학습률 스케줄의 성질', keys: ['학습률 스케줄'],
    tags: 'cosine annealing learning rate schedule 코사인 학습률 스케줄',
    stmt: R`$\alpha_t=\frac12\alpha_0\big(1+\cos\frac{t\pi}T\big)$ ($0\le t\le T$)는 $\alpha_0$에서 0까지 단조감소하고, $\alpha_{T/2}=\frac{\alpha_0}2$이며 양 끝에서 기울기가 0이다.`,
    body: R`
$\cos$는 $[0,\pi]$에서 1에서 $-1$로 감소하므로 $\alpha_t$는 $\alpha_0$에서 0으로 감소합니다. $t=T/2$이면 $\cos\frac\pi2=0$이라 $\alpha_0/2$.
$\frac{d\alpha_t}{dt}=-\frac{\alpha_0\pi}{2T}\sin\frac{t\pi}T$는 $t=0,T$에서 0이므로 시작과 끝에서 학습률이 천천히 변합니다(끝에서 작은 학습률로 오래 머물며 미세 조정). 비교: 선형 스케줄 $\alpha_0(1-t/T)$의 기울기는 일정한 $-\alpha_0/T$.` },
  );
})();
