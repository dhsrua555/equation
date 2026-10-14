/* 증명의 길잡이 — 09·11·13–16단원의 긴 증명(본문 600자 이상). 형식은 plan-a.js와 같습니다:
   쉬운 요약(easy)과 단계(nodes), 각 단계의 at은 한국어 본문에서 그 단계가 시작하는 조각의 첫머리입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    // ───── 09
    'ch09-chain': {
      easy: R`보여야 할 것은 ‘여러 노드의 입력으로 쓰인 변수의 기울기는 노드마다 (상류 기울기)×(국소 기울기)를 구해 모두 더한 것’이라는 식입니다. 손실 $L$을 $z_1,\dots,z_K$의 함수 $\Phi$로 보면 이는 다변수 연쇄법칙 그 자체라서 바로 얻어집니다. 중요한 것은 읽는 법입니다. $\partial L/\partial z_k$는 뒤쪽에서 이미 계산되어 넘어온 값이고, $\partial z_k/\partial x$는 노드 $z_k$가 자기 입력만 보고 계산할 수 있는 값입니다.

그다음 이 식을 그래프 전체에 쓰는 방법을 봅니다. 출력에서 입력 쪽으로 순서를 정하면 필요한 상류 기울기가 늘 먼저 준비되어 있고, 마지막으로 작은 예제에서 수치를 확인합니다.`,
      easyEn: R`What must be shown is that the gradient of a variable used as an input of several nodes is found by computing (upstream gradient) × (local gradient) for each node and adding them all. Viewing the loss $L$ as a function $\Phi$ of $z_1,\dots,z_K$, this is exactly the multivariable chain rule, so it follows at once. What matters is how to read it. $\partial L/\partial z_k$ is a value already computed further on and passed back, and $\partial z_k/\partial x$ is a value node $z_k$ can compute from its own inputs alone.

Then we see how to use the formula on a whole graph. Ordering the work from the output toward the inputs means the needed upstream gradients are always ready first, and finally a small example checks the numbers.`,
      nodes: [
        { id: 'rule', at: '$L=', t: R`다변수 연쇄법칙`, en: R`The multivariable chain rule`,
          d: R`$L$을 $z_k$들의 함수 $\Phi$로 쓰면, $\Phi$와 각 $z_k$가 미분가능할 때 $\frac{\partial L}{\partial x}=\sum_k\frac{\partial\Phi}{\partial z_k}\frac{\partial z_k}{\partial x}$입니다. 명제의 식이 바로 이것입니다.`,
          dEn: R`Writing $L$ as a function $\Phi$ of the $z_k$, if $\Phi$ and each $z_k$ are differentiable, $\frac{\partial L}{\partial x}=\sum_k\frac{\partial\Phi}{\partial z_k}\frac{\partial z_k}{\partial x}$. This is exactly the formula of the statement.` },
        { id: 'read', at: '$\\frac', t: R`상류 × 국소로 읽기`, en: R`Read it as upstream × local`,
          d: R`$\partial\Phi/\partial z_k=\partial L/\partial z_k$는 $z_k$에서 뒤로 들어온 상류 기울기이고, $\partial z_k/\partial x$는 노드 $z_k$가 자기 입력만으로 계산하는 국소 기울기입니다.`,
          dEn: R`$\partial\Phi/\partial z_k=\partial L/\partial z_k$ is the upstream gradient that came back into $z_k$, and $\partial z_k/\partial x$ is the local gradient node $z_k$ computes from its own inputs alone.` },
        { id: 'order', at: '**역전파의 순서.**', t: R`출력에서 입력 쪽으로`, en: R`From the output toward the inputs`,
          d: R`그래프를 위상정렬해 출력에서 입력 쪽으로 계산하면, 어떤 변수의 상류 기울기를 쓸 때 그 변수를 쓰는 노드들의 기울기가 이미 모두 계산되어 있습니다. 그래서 각 변은 한 번씩만 처리되고 비용은 순방향과 같은 차수입니다.`,
          dEn: R`Sorting the graph topologically and computing from the output toward the inputs, whenever a variable's upstream gradient is used, the gradients of all the nodes that use it are already computed. So each edge is processed once, and the cost is of the same order as the forward pass.` },
        { id: 'ex', at: '**예.**', t: R`작은 예제`, en: R`A small example`,
          d: R`$f=(x+y)z$에서 $q=x+y$를 거치면 (상류 $z$)×(국소 $1$)이므로, $(x,y,z)=(-2,5,-4)$에서 $\partial f/\partial x=-4$입니다.`,
          dEn: R`For $f=(x+y)z$ through $q=x+y$, it is (upstream $z$) × (local $1$), so at $(x,y,z)=(-2,5,-4)$, $\partial f/\partial x=-4$.` },
      ],
    },
    'ch09-matgrad': {
      easy: R`두 규칙 모두 같은 방법으로 보입니다. 연쇄법칙을 성분 하나씩 적고, 합의 어느 항이 0이 되는지 살핀 뒤 다시 벡터·행렬로 묶습니다. 그 판단은 ‘이 입력(또는 가중치)이 어느 출력에 들어가는가’ 하나로 정해집니다.

성분별 함수에서는 $x_n$이 $y_n$ 하나에만 들어가므로 합에서 한 항만 남아 성분별 곱 $g'(x)\odot\frac{\partial L}{\partial y}$가 됩니다. 행렬곱에서는 $x_j$가 모든 $z_i$에 들어가 합이 그대로 남아 $W^T\delta$가 되고, $W_{ij}$는 $z_i$ 하나에만 들어가 $\delta_ix_j$, 모으면 $\delta x^T$가 됩니다.`,
      easyEn: R`Both rules are proved the same way. Write the chain rule one component at a time, see which terms of the sum vanish, and collect the result back into a vector or matrix. That decision comes down to one question: which outputs does this input (or weight) enter?

For an elementwise function, $x_n$ enters only $y_n$, so one term of the sum survives and the result is the elementwise product $g'(x)\odot\frac{\partial L}{\partial y}$. For a matrix product, $x_j$ enters every $z_i$, so the whole sum stays and gives $W^T\delta$, while $W_{ij}$ enters only $z_i$, giving $\delta_ix_j$, which collect into $\delta x^T$.`,
      nodes: [
        { id: 'elem', at: '**(1)**', t: R`성분별 함수: 대각 야코비안`, en: R`Elementwise: a diagonal Jacobian`,
          d: R`$y_m$은 $x_m$에만 의존해 $\partial y_m/\partial x_n=\delta_{mn}g'(x_n)$이므로, 연쇄법칙의 합에서 $m=n$인 항만 남아 $g'(x_n)\,\partial L/\partial y_n$입니다.`,
          dEn: R`$y_m$ depends only on $x_m$, so $\partial y_m/\partial x_n=\delta_{mn}g'(x_n)$; only the term $m=n$ of the chain-rule sum survives, giving $g'(x_n)\,\partial L/\partial y_n$.` },
        { id: 'relu', at: 'ReLU이면', t: R`ReLU 예와 계산 요령`, en: R`The ReLU example and the shortcut`,
          d: R`ReLU는 $g'(x_n)=\mathbb 1\{x_n>0\}$이라 입력이 음수인 자리의 기울기를 막습니다(슬라이드 예: $(4,-1,5,9)\to(4,0,5,0)$). 대각행렬을 만들지 않고 성분별로 곱하면 됩니다.`,
          dEn: R`For ReLU $g'(x_n)=\mathbb 1\{x_n>0\}$, which blocks the gradient where the input is negative (slide example: $(4,-1,5,9)\to(4,0,5,0)$). No diagonal matrix is built; just multiply elementwise.` },
        { id: 'mat', at: '**(2)**', t: R`행렬곱: $W^T\delta$와 $\delta x^T$`, en: R`Matrix product: $W^T\delta$ and $\delta x^T$`,
          d: R`$z_i=\sum_jW_{ij}x_j$에서 $x_j$는 모든 $z_i$에 들어가므로 합이 남아 $(W^T\delta)_j$이고, $W_{ij}$는 $z_i$에만 들어가므로 한 항 $\delta_ix_j=(\delta x^T)_{ij}$입니다.`,
          dEn: R`In $z_i=\sum_jW_{ij}x_j$, $x_j$ enters every $z_i$, so the sum stays and gives $(W^T\delta)_j$; $W_{ij}$ enters only $z_i$, so a single term remains, $\delta_ix_j=(\delta x^T)_{ij}$.` },
      ],
    },
    'ch09-mlpbp': {
      easy: R`새로 계산할 것은 거의 없습니다. 한 층은 ‘행렬곱(+편향) → 성분별 활성화’ 두 단계이고, 두 단계의 역전파 규칙은 ‘성분별 함수와 행렬곱의 역전파’에서 이미 얻었습니다. 그러니 $a_\ell\to h_\ell\to a_{\ell+1}$의 사슬을 따라 두 규칙을 차례로 붙이면 됩니다.

본문 첫 줄은 $L$이 $a_\ell$에 $a_{\ell+1}$을 통해서만 의존한다는 점을 확인합니다. 그래서 $\delta_\ell$은 $\delta_{\ell+1}$만 알면 계산됩니다. 이어 두 규칙으로 점화식과 가중치·편향의 기울기를 얻고, 마지막으로 성분으로 풀어 Bishop의 오차 역전파 식과 맞춰 봅니다.`,
      easyEn: R`There is almost nothing new to compute. A layer is two stages, “matrix product (+ bias) → elementwise activation”, and the backpropagation rules for both stages were already obtained in “Backpropagation through Elementwise Functions and Matrix Products”. So we just apply the two rules one after the other along the chain $a_\ell\to h_\ell\to a_{\ell+1}$.

The first line of the proof checks that $L$ depends on $a_\ell$ only through $a_{\ell+1}$. Hence $\delta_\ell$ can be computed from $\delta_{\ell+1}$ alone. Then the two rules give the recursion and the gradients of the weights and biases, and finally writing them in components matches Bishop's error backpropagation formulas.`,
      nodes: [
        { id: 'dep', at: '$a_', t: R`의존의 사슬`, en: R`The chain of dependence`,
          d: R`$a_\ell\to h_\ell\to a_{\ell+1}$로 이어지고 $L$은 $a_\ell$에 $a_{\ell+1}$을 통해서만 의존하므로, $\delta_\ell$은 $\delta_{\ell+1}$만 알면 계산됩니다.`,
          dEn: R`The chain is $a_\ell\to h_\ell\to a_{\ell+1}$, and $L$ depends on $a_\ell$ only through $a_{\ell+1}$, so $\delta_\ell$ can be computed from $\delta_{\ell+1}$ alone.` },
        { id: 'rules', at: '- 행렬곱 규칙', t: R`두 규칙을 이어 붙이기`, en: R`Chain the two rules`,
          d: R`행렬곱 규칙으로 $\partial L/\partial h_\ell=W_{\ell+1}^T\delta_{\ell+1}$, 이어 성분별 규칙으로 $\delta_\ell=\sigma'(a_\ell)\odot\partial L/\partial h_\ell$. 같은 행렬곱 규칙을 $a_\ell=W_\ell h_{\ell-1}+b_\ell$에 쓰면 $\partial L/\partial W_\ell=\delta_\ell h_{\ell-1}^T$, $\partial L/\partial b_\ell=\delta_\ell$입니다.`,
          dEn: R`The matrix-product rule gives $\partial L/\partial h_\ell=W_{\ell+1}^T\delta_{\ell+1}$, and then the elementwise rule gives $\delta_\ell=\sigma'(a_\ell)\odot\partial L/\partial h_\ell$. The same matrix-product rule on $a_\ell=W_\ell h_{\ell-1}+b_\ell$ gives $\partial L/\partial W_\ell=\delta_\ell h_{\ell-1}^T$ and $\partial L/\partial b_\ell=\delta_\ell$.` },
        { id: 'comp', at: '성분으로 쓰면', t: R`성분으로 풀어 보기`, en: R`Written in components`,
          d: R`$\delta_j=\sigma'(a_j)\sum_kw_{kj}\delta_k$, $\partial L/\partial w_{ji}=\delta_jh_i$: 다음 층의 오차를 가중치를 따라 거꾸로 모은 뒤 활성화의 기울기를 곱한 것으로, Bishop의 오차 역전파 식입니다.`,
          dEn: R`$\delta_j=\sigma'(a_j)\sum_kw_{kj}\delta_k$ and $\partial L/\partial w_{ji}=\delta_jh_i$: gather the next layer's errors backward along the weights, then multiply by the slope of the activation. These are Bishop's error backpropagation formulas.` },
      ],
    },

    // ───── 11
    'ch11-halfnormal': {
      easy: R`ReLU 출력 $h=\max(0,z)$는 $z\le0$에서 0이므로, $\E[h]$와 $\E[h^2]$는 $0$부터 $\infty$까지의 반쪽 적분이 됩니다. 본문은 이 적분을 차례로 계산합니다. $\E[h]$는 $u=z^2/2q$로 치환하면 $\int_0^\infty e^{-u}du=1$이 되어 바로 끝납니다. $\E[h^2]$는 더 쉽습니다. $z^2\phi(z)$가 좌우 대칭이라 반쪽 적분은 전체 적분 $\E[z^2]=q$의 절반입니다.

같은 $\E[h^2]$를 부분적분으로 한 번 더 구해 검산하고, 마지막으로 $\Var(h)=\E[h^2]-(\E h)^2$로 분산을 얻습니다.`,
      easyEn: R`The ReLU output $h=\max(0,z)$ is 0 for $z\le0$, so $\E[h]$ and $\E[h^2]$ become half-line integrals from $0$ to $\infty$. The proof computes them in turn. For $\E[h]$, the substitution $u=z^2/2q$ turns it into $\int_0^\infty e^{-u}du=1$ and it is done at once. $\E[h^2]$ is even easier. $z^2\phi(z)$ is symmetric about 0, so the half-line integral is half of the full integral $\E[z^2]=q$.

The same $\E[h^2]$ is computed once more by integration by parts as a check, and finally $\Var(h)=\E[h^2]-(\E h)^2$ gives the variance.`,
      nodes: [
        { id: 'half', at: '$\\phi(z)=', t: R`반쪽 적분으로 쓰기`, en: R`Write half-line integrals`,
          d: R`$h$는 $z\le0$에서 0이므로 $\E[h]=\int_0^\infty z\phi(z)\,dz$, $\E[h^2]=\int_0^\infty z^2\phi(z)\,dz$로 양수 쪽 절반만 남습니다.`,
          dEn: R`$h$ is 0 for $z\le0$, so only the positive half remains: $\E[h]=\int_0^\infty z\phi(z)\,dz$ and $\E[h^2]=\int_0^\infty z^2\phi(z)\,dz$.` },
        { id: 'mean', at: '**$\\E[h]$.**', t: R`$\E[h]$: 치환`, en: R`$\E[h]$ by substitution`,
          d: R`$u=z^2/2q$로 두면 $z\,dz=q\,du$라 $\int_0^\infty ze^{-z^2/2q}dz=q$이고, 정규화 상수 $\sqrt{2\pi q}$로 나누면 $\E[h]=\sqrt{q/2\pi}$입니다.`,
          dEn: R`With $u=z^2/2q$, $z\,dz=q\,du$, so $\int_0^\infty ze^{-z^2/2q}dz=q$; dividing by the normalizing constant $\sqrt{2\pi q}$ gives $\E[h]=\sqrt{q/2\pi}$.` },
        { id: 'sym', at: '**$\\E[h^2]$ — 대칭으로.**', t: R`$\E[h^2]$: 대칭`, en: R`$\E[h^2]$ by symmetry`,
          d: R`$z^2\phi(z)$는 우함수이므로 반쪽 적분은 전체의 절반, 곧 $\frac12\E[z^2]=\frac q2$입니다.`,
          dEn: R`$z^2\phi(z)$ is even, so the half-line integral is half of the whole, $\frac12\E[z^2]=\frac q2$.` },
        { id: 'parts', at: '**$\\E[h^2]$ — 부분적분으로.**', t: R`부분적분으로 검산`, en: R`A check by parts`,
          d: R`$u=z$, $dv=ze^{-z^2/2q}dz$로 부분적분하면 경계항은 0이고, 남는 적분은 가우스 적분 $\sqrt{2\pi q}$의 절반이라 다시 $\E[h^2]=\frac q2$입니다.`,
          dEn: R`Integrating by parts with $u=z$, $dv=ze^{-z^2/2q}dz$, the boundary term is 0 and the remaining integral is half of the Gaussian integral $\sqrt{2\pi q}$, so again $\E[h^2]=\frac q2$.` },
        { id: 'var', at: '**분산.**', t: R`분산`, en: R`The variance`,
          d: R`$\Var(h)=\E[h^2]-(\E h)^2=\frac q2-\frac q{2\pi}=\frac q2\big(1-\frac1\pi\big)$.`,
          dEn: R`$\Var(h)=\E[h^2]-(\E h)^2=\frac q2-\frac q{2\pi}=\frac q2\big(1-\frac1\pi\big)$.` },
      ],
    },
    'ch11-he': {
      easy: R`목표는 ReLU 층을 지나도 신호의 크기, 곧 2차 모멘트 $\E[x^2]$가 줄지도 커지지도 않게 하는 가중치 분산 $\sigma^2$를 찾는 것입니다. 층 하나를 ‘선형 합 $z=\sum_iw_ix_i$’와 ‘ReLU’ 두 단계로 나누어, 각 단계에서 2차 모멘트가 몇 배가 되는지 계산합니다.

선형 합에서는 $D_{in}\sigma^2$배가 되고, ReLU는 대칭인 $z$의 음수 쪽 절반을 0으로 만들어 2차 모멘트를 정확히 절반으로 줄입니다. 전체 배율 $\frac12D_{in}\sigma^2$를 1로 놓으면 $\sigma^2=2/D_{in}$, Xavier 초기화의 $1/D_{in}$보다 두 배 큰 값이 나옵니다.`,
      easyEn: R`The goal is the weight variance $\sigma^2$ for which the size of the signal, its second moment $\E[x^2]$, neither shrinks nor grows through a ReLU layer. Split a layer into two stages, “the linear sum $z=\sum_iw_ix_i$” and “ReLU”, and compute by what factor each stage multiplies the second moment.

The linear sum multiplies it by $D_{in}\sigma^2$, and ReLU sets the negative half of the symmetric $z$ to 0, cutting the second moment exactly in half. Setting the overall factor $\frac12D_{in}\sigma^2$ to 1 gives $\sigma^2=2/D_{in}$, twice the $1/D_{in}$ of Xavier initialization.`,
      nodes: [
        { id: 'lin', at: '**1. 선형 부분', t: R`선형 합의 2차 모멘트`, en: R`Second moment of the linear sum`,
          d: R`$\E w_i=0$과 독립성 때문에 교차항이 모두 사라지고 각 항이 $\sigma^2v$를 내므로 $\E[z^2]=D_{in}\sigma^2v=:q$ ($v=\E[x_i^2]$)입니다.`,
          dEn: R`Because of $\E w_i=0$ and independence, all cross terms vanish and each term contributes $\sigma^2v$, so $\E[z^2]=D_{in}\sigma^2v=:q$ ($v=\E[x_i^2]$).` },
        { id: 'relu', at: '**2. ReLU.**', t: R`ReLU는 절반을 남김`, en: R`ReLU keeps half`,
          d: R`$z$가 0에 대해 대칭이므로 반정규 적분에서 $\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v$입니다.`,
          dEn: R`Since $z$ is symmetric about 0, the half-normal integral gives $\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v$.` },
        { id: 'keep', at: '**3. 보존 조건.**', t: R`보존 조건 → $\sigma^2=2/D_{in}$`, en: R`Preservation gives $\sigma^2=2/D_{in}$`,
          d: R`다음 층의 입력은 $h$이므로 $\E[h^2]=v$를 요구하면 $\frac12D_{in}\sigma^2=1$, 곧 $\sigma^2=2/D_{in}$입니다.`,
          dEn: R`The input of the next layer is $h$, so requiring $\E[h^2]=v$ gives $\frac12D_{in}\sigma^2=1$, that is, $\sigma^2=2/D_{in}$.` },
      ],
    },

    // ───── 13
    'ch13-steepest': {
      easy: R`길이 1인 방향 $v$ 가운데 내적 $\langle\nabla f(x),v\rangle$, 곧 그 방향으로 움직일 때 $f$가 변하는 빠르기를 가장 작게(가장 큰 음수로) 만드는 것을 찾습니다. 코시-슈바르츠 부등식이 ‘이 내적은 $-\lVert\nabla f(x)\rVert$보다 작아질 수 없다’는 바닥을 주고, 기울기의 반대 방향 단위벡터를 넣으면 그 바닥에 정확히 닿습니다. 등호가 성립하는 경우가 정해져 있어서 바닥에 닿는 방향은 그것 하나뿐입니다.

마지막으로 이 결론을 1차 근사와 이어 경사하강법의 갱신식을 얻습니다.`,
      easyEn: R`Among directions $v$ of length 1, we look for the one that makes the inner product $\langle\nabla f(x),v\rangle$, the rate at which $f$ changes when moving that way, as small (as negative) as possible. The Cauchy–Schwarz inequality gives a floor, “this inner product cannot go below $-\lVert\nabla f(x)\rVert$”, and the unit vector opposite to the gradient reaches that floor exactly. Because the equality case is pinned down, it is the only direction that reaches the floor.

Finally, linking this to the first-order approximation gives the update rule of gradient descent.`,
      nodes: [
        { id: 'cs', at: '코시-슈바르츠 부등식', t: R`코시-슈바르츠의 바닥`, en: R`The Cauchy–Schwarz floor`,
          d: R`$\lvert\langle a,v\rangle\rvert\le\lVert a\rVert\lVert v\rVert$에서 $\lVert v\rVert=1$이면 $\langle\nabla f(x),v\rangle\ge-\lVert\nabla f(x)\rVert$. 어떤 단위 방향도 이보다 작게 만들 수 없습니다.`,
          dEn: R`From $\lvert\langle a,v\rangle\rvert\le\lVert a\rVert\lVert v\rVert$, $\lVert v\rVert=1$ gives $\langle\nabla f(x),v\rangle\ge-\lVert\nabla f(x)\rVert$. No unit direction can go below this.` },
        { id: 'attain', at: '$v^*=', t: R`달성과 유일성`, en: R`Attained, and only there`,
          d: R`$v^*=-\nabla f(x)/\lVert\nabla f(x)\rVert$를 넣으면 바닥에 정확히 닿습니다. 등호는 $v$가 $\nabla f(x)$의 스칼라배일 때뿐이고, 단위벡터이면서 내적이 음수여야 하므로 $v=v^*$입니다.`,
          dEn: R`Putting in $v^*=-\nabla f(x)/\lVert\nabla f(x)\rVert$ reaches the floor exactly. Equality holds only when $v$ is a scalar multiple of $\nabla f(x)$, and a unit vector with a negative inner product must be $v^*$.` },
        { id: 'gd', at: '**GD와의 연결.**', t: R`경사하강법으로`, en: R`On to gradient descent`,
          d: R`1차 근사 $f(x+\eta v)\approx f(x)+\eta\langle\nabla f(x),v\rangle$을 가장 많이 줄이는 방향이 $v^*$이므로 그쪽으로 걷고, 보폭에 $1/\lVert\nabla f(x_t)\rVert$를 흡수하면 $x_{t+1}=x_t-\eta'\nabla f(x_t)$입니다.`,
          dEn: R`The direction that lowers the first-order approximation $f(x+\eta v)\approx f(x)+\eta\langle\nabla f(x),v\rangle$ the most is $v^*$, so step that way; absorbing $1/\lVert\nabla f(x_t)\rVert$ into the step size gives $x_{t+1}=x_t-\eta'\nabla f(x_t)$.` },
      ],
    },
    'ch13-lipschitzhess': {
      easy: R`두 조건이 같은 말임을 보입니다. (a)는 ‘기울기가 너무 빨리 변하지 않는다’, (b)는 ‘헤시안(곡률)이 어느 방향으로도 크기 $\beta$를 넘지 않는다’입니다. 헤시안은 기울기의 도함수이므로, 두 방향 모두 ‘변화량의 한계’와 ‘도함수의 한계’를 오가는 일입니다.

(a)⇒(b)는 헤시안을 기울기 차분몫의 극한으로 쓰고 그 차분몫에 (a)를 적용합니다. (b)⇒(a)는 거꾸로 기울기의 차이를 헤시안의 적분으로 쓰고 적분 안을 (b)로 누릅니다. 하강 보조정리에 쓰이는 $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$은 첫 방향에서 덤으로 나옵니다.`,
      easyEn: R`We show that the two conditions say the same thing. (a) says “the gradient does not change too fast”, and (b) says “the Hessian (the curvature) does not exceed size $\beta$ in any direction”. The Hessian is the derivative of the gradient, so both directions move between “a bound on the change” and “a bound on the derivative”.

(a)⇒(b) writes the Hessian as the limit of a difference quotient of the gradient and applies (a) to that quotient. (b)⇒(a) goes the other way: it writes the difference of gradients as an integral of the Hessian and bounds the integrand by (b). The inequality $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ used in the descent lemma comes for free in the first direction.`,
      nodes: [
        { id: 'lim', at: '**(a)⇒(b).**', g: R`(a)⇒(b): 차분몫의 극한으로`, gEn: R`(a)⇒(b): through a limit of difference quotients`,
          t: R`헤시안 = 차분몫의 극한`, en: R`The Hessian as a limit`,
          d: R`$\nabla f$가 미분가능하므로 $\nabla^2f(x)v$는 차분몫 $\frac{\nabla f(x+sv)-\nabla f(x)}s$의 $s\to0$ 극한입니다.`,
          dEn: R`Since $\nabla f$ is differentiable, $\nabla^2f(x)v$ is the limit as $s\to0$ of the difference quotient $\frac{\nabla f(x+sv)-\nabla f(x)}s$.` },
        { id: 'bound', at: '(a)에서', t: R`차분몫에 (a)를 적용`, en: R`Apply (a) to the quotient`,
          d: R`(a)로 차분몫의 노름은 $\beta\lVert v\rVert$ 이하이고 노름은 연속이므로 극한에서도 $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$, 곧 $\lVert\nabla^2f(x)\rVert_2\le\beta$. 코시-슈바르츠를 더하면 $\lvert v^T\nabla^2f(x)v\rvert\le\beta\lVert v\rVert^2$입니다.`,
          dEn: R`By (a) the quotient has norm at most $\beta\lVert v\rVert$, and the norm is continuous, so in the limit $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$, i.e., $\lVert\nabla^2f(x)\rVert_2\le\beta$. Adding Cauchy–Schwarz gives $\lvert v^T\nabla^2f(x)v\rvert\le\beta\lVert v\rVert^2$.` },
        { id: 'ftc', at: '**(b)⇒(a).**', g: R`(b)⇒(a): 적분으로 되돌리기`, gEn: R`(b)⇒(a): back through an integral`,
          t: R`기울기 차이 = 헤시안의 적분`, en: R`The gradient difference as an integral`,
          d: R`미적분학의 기본정리로 $\nabla f(x)-\nabla f(y)=\int_0^1\nabla^2f(y+t(x-y))(x-y)\,dt$이고, 적분 안을 (b)로 $\beta\lVert x-y\rVert$ 이하로 누르면 (a)입니다.`,
          dEn: R`By the fundamental theorem of calculus, $\nabla f(x)-\nabla f(y)=\int_0^1\nabla^2f(y+t(x-y))(x-y)\,dt$; bounding the integrand by $\beta\lVert x-y\rVert$ with (b) gives (a).` },
      ],
    },
    'ch13-descent': {
      easy: R`보일 것은 $f(y)$가 $x$에서의 1차 근사 $f(x)+\langle\nabla f(x),y-x\rangle$에 $\frac\beta2\lVert y-x\rVert^2$을 더한 값을 넘지 않는다는 것, 곧 그래프가 각 점에서 곡률 $\beta$인 포물선 아래에 있다는 것입니다. 두 증명 모두 $x$에서 $y$로 가는 선분 위로 문제를 옮겨 변수 하나의 함수로 만들고, 1차 근사에서 벗어난 양을 적분으로 쓴 뒤 그 적분을 $\beta$로 누릅니다.

증명 1(필기)은 헤시안을 써서 테일러 공식의 적분형 나머지를 $v^T\nabla^2fv\le\beta\lVert v\rVert^2$로 누르고, 증명 2는 헤시안 없이 기울기의 차이를 립시츠 조건으로 직접 누릅니다.`,
      easyEn: R`What must be shown is that $f(y)$ does not exceed the first-order approximation at $x$, $f(x)+\langle\nabla f(x),y-x\rangle$, plus $\frac\beta2\lVert y-x\rVert^2$; that is, the graph lies below a parabola of curvature $\beta$ at every point. Both proofs move the problem onto the segment from $x$ to $y$, making it a function of one variable, write the deviation from the first-order approximation as an integral, and bound that integral using $\beta$.

Proof 1 (the notes) uses the Hessian and bounds the integral remainder of Taylor's formula by $v^T\nabla^2fv\le\beta\lVert v\rVert^2$; Proof 2 avoids the Hessian and bounds the difference of gradients directly by the Lipschitz condition.`,
      nodes: [
        { id: 'taylor', at: '**증명 1', g: R`증명 1: 헤시안으로 ($f\in C^2$)`, gEn: R`Proof 1: with the Hessian ($f\in C^2$)`,
          t: R`선분 위의 테일러 공식`, en: R`Taylor's formula on the segment`,
          d: R`$g(t)=f(x+t(y-x))$의 도함수 ①과 적분형 나머지 공식 ②를 합쳐, $f(y)$를 1차 근사 + 적분 나머지로 쓴 등식 $(*)$를 얻습니다.`,
          dEn: R`Combining the derivatives ① of $g(t)=f(x+t(y-x))$ with the integral-remainder formula ② gives the identity $(*)$: $f(y)$ = first-order approximation + an integral remainder.` },
        { id: 'rem', at: '③', t: R`나머지를 $\beta$로 누르기`, en: R`Bound the remainder by $\beta$`,
          d: R`$v^T\nabla^2fv\le\beta\lVert v\rVert^2$이고 $1-s\ge0$이므로 나머지는 $\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2$ 이하이고, $(*)$에 넣으면 끝입니다.`,
          dEn: R`Since $v^T\nabla^2fv\le\beta\lVert v\rVert^2$ and $1-s\ge0$, the remainder is at most $\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2$; putting this into $(*)$ finishes it.` },
        { id: 'ftc', at: '**증명 2', g: R`증명 2: 헤시안 없이 ($f\in C^1$)`, gEn: R`Proof 2: without the Hessian ($f\in C^1$)`,
          t: R`오차를 적분으로`, en: R`The error as an integral`,
          d: R`$h(t)=f(x+t(y-x))$에 미적분학의 기본정리를 쓰면, 1차 근사의 오차가 $\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\rangle\,dt$가 됩니다.`,
          dEn: R`The fundamental theorem of calculus applied to $h(t)=f(x+t(y-x))$ turns the error of the first-order approximation into $\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\rangle\,dt$.` },
        { id: 'lip', at: '코시-슈바르츠와', t: R`립시츠 조건으로 누르기`, en: R`Bound it with the Lipschitz condition`,
          d: R`코시-슈바르츠와 $\lVert\nabla f(x+t(y-x))-\nabla f(x)\rVert\le\beta t\lVert y-x\rVert$로 피적분함수가 $\beta t\lVert y-x\rVert^2$ 이하이고, 적분하면 $\frac\beta2\lVert y-x\rVert^2$입니다.`,
          dEn: R`By Cauchy–Schwarz and $\lVert\nabla f(x+t(y-x))-\nabla f(x)\rVert\le\beta t\lVert y-x\rVert$, the integrand is at most $\beta t\lVert y-x\rVert^2$, which integrates to $\frac\beta2\lVert y-x\rVert^2$.` },
      ],
    },
    'ch13-gdstep': {
      easy: R`하강 보조정리는 ‘$f(y)$는 $x$에서의 1차 근사에 $\frac\beta2\lVert y-x\rVert^2$을 더한 값을 넘지 않는다’는 위쪽 한계입니다. 경사하강법의 한 걸음 $y-x=-\eta\nabla f(x_t)$를 여기에 넣기만 하면, 기울기를 따라 내려가며 얻는 이득 $\eta\lVert\nabla f(x_t)\rVert^2$과 곡률 때문에 생길 수 있는 손해 $\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2$의 차가 나옵니다.

이득이 손해보다 크려면 보폭이 $2/\beta$보다 작아야 하고, 그 차를 가장 크게 하는 보폭은 $1/\beta$입니다.`,
      easyEn: R`The descent lemma is an upper bound: “$f(y)$ does not exceed the first-order approximation at $x$ plus $\frac\beta2\lVert y-x\rVert^2$”. Just putting one step of gradient descent, $y-x=-\eta\nabla f(x_t)$, into it produces the gain from going down along the gradient, $\eta\lVert\nabla f(x_t)\rVert^2$, minus the possible loss due to curvature, $\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2$.

The gain exceeds the loss when the step is smaller than $2/\beta$, and the step that makes the difference largest is $1/\beta$.`,
      nodes: [
        { id: 'plug', at: '하강 보조정리에', t: R`한 걸음을 보조정리에 넣기`, en: R`Put one step into the lemma`,
          d: R`$y-x=-\eta\nabla f(x_t)$를 넣으면 내적 항은 $-\eta\lVert\nabla f(x_t)\rVert^2$, 이차 항은 $\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2$이 되어 감소량 $\big(\eta-\frac{\beta\eta^2}2\big)\lVert\nabla f(x_t)\rVert^2$이 나옵니다.`,
          dEn: R`Putting in $y-x=-\eta\nabla f(x_t)$, the inner-product term becomes $-\eta\lVert\nabla f(x_t)\rVert^2$ and the quadratic term $\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2$, giving the decrease $\big(\eta-\frac{\beta\eta^2}2\big)\lVert\nabla f(x_t)\rVert^2$.` },
        { id: 'cond', at: '$\\eta-', t: R`감소 조건 $0<\eta<2/\beta$`, en: R`Decrease when $0<\eta<2/\beta$`,
          d: R`계수 $\eta\big(1-\frac{\beta\eta}2\big)$는 $0<\eta<2/\beta$일 때 양수이므로 $f(x_{t+1})\le f(x_t)$이고, $\nabla f(x_t)\ne0$이면 엄격히 줄어듭니다.`,
          dEn: R`The coefficient $\eta\big(1-\frac{\beta\eta}2\big)$ is positive when $0<\eta<2/\beta$, so $f(x_{t+1})\le f(x_t)$, and the decrease is strict if $\nabla f(x_t)\ne0$.` },
        { id: 'opt', at: '**최적 보폭.**', t: R`가장 좋은 보폭 $1/\beta$`, en: R`The best step, $1/\beta$`,
          d: R`감소 계수 $\eta-\frac\beta2\eta^2$은 $\eta=1/\beta$에서 최대 $\frac1{2\beta}$이므로 $f(x_{t+1})\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$입니다.`,
          dEn: R`The coefficient $\eta-\frac\beta2\eta^2$ is largest at $\eta=1/\beta$, where it equals $\frac1{2\beta}$, so $f(x_{t+1})\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$.` },
      ],
    },
    'ch13-sgdsum': {
      easy: R`한 걸음마다 성립하는 확률적 경사하강 보조정리를 $T$걸음에 걸쳐 더해, 기울기 크기 제곱의 평균을 한꺼번에 누릅니다. 더할 때 이웃한 항이 서로 지워지는 망원급수가 핵심인데, 확률적이라 손질이 하나 더 필요합니다. 보조정리는 $x_t$가 주어졌을 때의 조건부 기댓값 $\E_t$로 적혀 있어 걸음마다 기준이 다르므로, 탑 성질로 모두 전체 기댓값 $\E$로 맞춘 뒤에 더합니다.

결과의 우변은 $\frac{f(x_0)-f^*}\eta$(학습률이 작을수록 커지는 항)와 $\frac L2\eta GT$(잡음 때문에 학습률에 비례해 쌓이는 항)의 합입니다. 두 항의 균형을 맞추는 $\eta$를 고르면 평균이 $\sqrt{2LG(f(x_0)-f^*)/T}$ 이하로 줄어듭니다.`,
      easyEn: R`Summing the stochastic descent lemma, which holds at each step, over $T$ steps bounds the average squared gradient size all at once. The key is a telescoping sum, where neighboring terms cancel, but because the steps are random one more adjustment is needed. The lemma is written with the conditional expectation $\E_t$ given $x_t$, a different reference at every step, so the tower property first brings every term to the full expectation $\E$ before summing.

The right side of the result is the sum of $\frac{f(x_0)-f^*}\eta$ (a term that grows as the learning rate shrinks) and $\frac L2\eta GT$ (a term that builds up in proportion to the learning rate because of noise). Choosing the $\eta$ that balances the two brings the average down to at most $\sqrt{2LG(f(x_0)-f^*)/T}$.`,
      nodes: [
        { id: 'one', at: '보조정리와', t: R`한 걸음의 부등식 정리`, en: R`Rearrange one step`,
          d: R`보조정리의 마지막 항을 $\E_t\lVert\tilde\nabla f(x_t)\rVert^2\le G$로 누르고 $\eta$로 나누어 $\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\E_t[f(x_t)-f(x_{t+1})]+\frac L2\eta G$로 씁니다.`,
          dEn: R`Bound the last term of the lemma by $\E_t\lVert\tilde\nabla f(x_t)\rVert^2\le G$ and divide by $\eta$ to get $\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\E_t[f(x_t)-f(x_{t+1})]+\frac L2\eta G$.` },
        { id: 'sum', at: '전체 기댓값을', t: R`기댓값을 맞추고 더하기`, en: R`Align expectations, then sum`,
          d: R`탑 성질로 모든 항을 전체 기댓값으로 바꾸고 $t=0,\dots,T-1$을 더하면 중간 항이 지워집니다. $\E f(x_T)\ge f^*$로 우변이 $\frac{f(x_0)-f^*}\eta+\frac L2\eta GT$가 됩니다.`,
          dEn: R`The tower property turns every term into a full expectation, and summing over $t=0,\dots,T-1$ cancels the middle terms. With $\E f(x_T)\ge f^*$ the right side becomes $\frac{f(x_0)-f^*}\eta+\frac L2\eta GT$.` },
        { id: 'eta', at: '$T$로 나눈', t: R`학습률 고르기`, en: R`Choose the learning rate`,
          d: R`$T$로 나눈 우변 $\frac{\Delta}{\eta T}+\frac{LG}2\eta$ ($\Delta=f(x_0)-f^*$)는 산술-기하 평균으로 $\eta=\sqrt{2\Delta/(LGT)}$에서 최소 $\sqrt{2LG\Delta/T}$입니다.`,
          dEn: R`The right side divided by $T$, $\frac{\Delta}{\eta T}+\frac{LG}2\eta$ ($\Delta=f(x_0)-f^*$), is smallest by AM–GM at $\eta=\sqrt{2\Delta/(LGT)}$, with value $\sqrt{2LG\Delta/T}$.` },
      ],
    },
    'ch13-varstep': {
      easy: R`걸음마다 보폭 $\eta_t$가 달라도 되는 SGD에서, 기울기 크기 제곱의 기댓값 가운데 가장 작은 것을 누릅니다. 뼈대는 고정 보폭 SGD의 합산 부등식과 같습니다. 한 걸음에 하강 보조정리를 쓰고, 조건부 기댓값으로 잡음을 평균 낸 뒤, 전체 기댓값으로 맞춰 망원급수로 더합니다. 다른 점은 걸음마다 무게 $\eta_t$가 붙는다는 것뿐입니다.

마지막에 ‘가중합 ≥ (가장 작은 값)×(무게의 합)’을 써서 $\sum_t\eta_t$로 나눕니다. 그래서 $\sum\eta_t=\infty$이고 $\sum\eta_t^2<\infty$인 스케줄(예: $\eta_t\propto1/t$)이면 오른쪽이 0으로 갑니다.`,
      easyEn: R`For SGD whose step size $\eta_t$ may change from step to step, we bound the smallest of the expected squared gradient sizes. The skeleton is the same as the summed inequality for SGD with a fixed step. Apply the descent lemma to one step, average out the noise with the conditional expectation, then bring everything to the full expectation and sum as a telescoping series. The only difference is that each step carries a weight $\eta_t$.

At the end, “a weighted sum ≥ (the smallest value) × (the sum of the weights)” lets us divide by $\sum_t\eta_t$. So with a schedule where $\sum\eta_t=\infty$ and $\sum\eta_t^2<\infty$ (e.g., $\eta_t\propto1/t$), the right side goes to 0.`,
      nodes: [
        { id: 'step', at: '**한 걸음.**', t: R`한 걸음: 하강 보조정리`, en: R`One step: the descent lemma`,
          d: R`$x_{t+1}-x_t=-\eta_tg_t$를 하강 보조정리에 넣어, 아직 확률적인 $g_t$가 남아 있는 위쪽 한계를 얻습니다.`,
          dEn: R`Putting $x_{t+1}-x_t=-\eta_tg_t$ into the descent lemma gives an upper bound that still contains the random $g_t$.` },
        { id: 'cond', at: '**조건부 기댓값**', t: R`$x_t$를 고정하고 평균 내기`, en: R`Average with $x_t$ fixed`,
          d: R`$x_t$가 주어지면 불편성으로 내적이 $\lVert\nabla f(x_t)\rVert^2$이 되고, 둘째 모멘트를 $G$로 눌러 $\E_tf(x_{t+1})\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G$입니다.`,
          dEn: R`Given $x_t$, unbiasedness turns the inner product into $\lVert\nabla f(x_t)\rVert^2$, and bounding the second moment by $G$ gives $\E_tf(x_{t+1})\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G$.` },
        { id: 'sum', at: '**탑 성질**', t: R`더하고 최솟값으로 나누기`, en: R`Sum, then divide out the minimum`,
          d: R`탑 성질로 전체 기댓값을 취해 $t=1,\dots,T$를 더하면 중간 항이 지워지고 $\E f(x_{T+1})\ge f_*$. 왼쪽 가중합은 $\big(\min_t\E\lVert\nabla f(x_t)\rVert^2\big)\sum_t\eta_t$ 이상이므로 $\sum_t\eta_t$로 나누면 끝입니다.`,
          dEn: R`Take full expectations by the tower property and sum over $t=1,\dots,T$: the middle terms cancel and $\E f(x_{T+1})\ge f_*$. The weighted sum on the left is at least $\big(\min_t\E\lVert\nabla f(x_t)\rVert^2\big)\sum_t\eta_t$, so dividing by $\sum_t\eta_t$ finishes it.` },
      ],
    },

    // ───── 14
    'ch14-condgd': {
      easy: R`이차함수 $f(x)=\frac12x^THx$에서는 경사하강법을 손으로 끝까지 풀 수 있습니다. 요령은 좌표축을 $H$의 고유벡터 방향으로 돌리는 것입니다. 그러면 $H$가 대각행렬이 되어, 고유방향 성분 하나하나가 서로 섞이지 않고 매 걸음 $(1-\alpha\lambda_i)$배씩 따로 변합니다.

이제 차례로 모든 배율의 절댓값이 1보다 작을 조건(수렴), 가장 큰 배율을 가장 작게 만드는 $\alpha$(최적 학습률), 그리고 수업의 수치 예를 봅니다. 가장 가파른 방향($\lambda_{\max}$)이 학습률의 상한을 정하고 가장 완만한 방향($\lambda_{\min}$)이 속도를 정하므로, 둘의 비 $\kappa$가 클수록 느려집니다.`,
      easyEn: R`For the quadratic $f(x)=\frac12x^THx$, gradient descent can be solved by hand all the way. The trick is to rotate the coordinate axes to the eigenvector directions of $H$. Then $H$ becomes diagonal, and each eigendirection component changes on its own, without mixing with the others, by a factor $(1-\alpha\lambda_i)$ at every step.

Then, in turn: the condition that every factor is less than 1 in absolute value (convergence), the $\alpha$ that makes the largest factor as small as possible (the optimal learning rate), and the numbers from class. The steepest direction ($\lambda_{\max}$) sets the upper limit of the learning rate and the flattest direction ($\lambda_{\min}$) sets the speed, so the larger their ratio $\kappa$, the slower it gets.`,
      nodes: [
        { id: 'diag', at: '$H=Q', t: R`고유방향으로 나누기`, en: R`Split along eigendirections`,
          d: R`$H=Q\Lambda Q^T$로 대각화해 $u_t=Q^Tx_t$로 보면 $u_{t+1,i}=(1-\alpha\lambda_i)u_{t,i}$: 성분마다 따로, 매 걸음 같은 배율로 변합니다.`,
          dEn: R`Diagonalizing $H=Q\Lambda Q^T$ and looking at $u_t=Q^Tx_t$ gives $u_{t+1,i}=(1-\alpha\lambda_i)u_{t,i}$: each component changes on its own, by the same factor at every step.` },
        { id: 'conv', at: '**수렴.**', t: R`수렴 조건`, en: R`When it converges`,
          d: R`모든 초기값에서 $u_t\to0$이려면 모든 $i$에서 $\lvert1-\alpha\lambda_i\rvert<1$, 곧 $0<\alpha\lambda_i<2$여야 하고, 가장 큰 고윳값이 조건을 정해 $\alpha<2/\lambda_{\max}$입니다.`,
          dEn: R`For $u_t\to0$ from every initial value we need $\lvert1-\alpha\lambda_i\rvert<1$, i.e., $0<\alpha\lambda_i<2$, for every $i$; the largest eigenvalue decides, giving $\alpha<2/\lambda_{\max}$.` },
        { id: 'opt', at: '**최적 고정 학습률.**', t: R`최적 학습률과 $\kappa$`, en: R`The best rate and $\kappa$`,
          d: R`가장 큰 배율 $\max(\lvert1-\alpha\lambda_{\min}\rvert,\lvert1-\alpha\lambda_{\max}\rvert)$은 두 값이 같을 때 가장 작습니다. 그때 $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$이고 배율은 $\frac{\kappa-1}{\kappa+1}$입니다.`,
          dEn: R`The largest factor $\max(\lvert1-\alpha\lambda_{\min}\rvert,\lvert1-\alpha\lambda_{\max}\rvert)$ is smallest when the two are equal. Then $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$ and the factor is $\frac{\kappa-1}{\kappa+1}$.` },
        { id: 'num', at: '**수업 수치.**', t: R`수업의 수치 예`, en: R`The numbers from class`,
          d: R`$H=\diag(1,100)$, $\alpha=0.019$이면 $x_1$은 매 걸음 $0.981$배로 천천히 줄고, $x_2$는 $-0.9$배라 부호를 바꾸며 진동합니다.`,
          dEn: R`With $H=\diag(1,100)$ and $\alpha=0.019$, $x_1$ shrinks slowly by $0.981$ per step, while $x_2$ is multiplied by $-0.9$ and oscillates in sign.` },
      ],
    },
    'ch14-adampf': {
      easy: R`Adam은 기울기의 지수이동평균 $m_t$(1차 모멘트)와 기울기 제곱의 지수이동평균(2차 모멘트)을 모두 0에서 시작합니다. 0에서 출발했으니 초반의 평균은 실제보다 0 쪽으로 끌려 있고, 펼친 식으로 계산하면 그 정도가 정확히 $(1-\beta_1^t)$배입니다. 이 배수로 나누는 것이 편향 보정입니다.

보정의 효과는 첫걸음에서 분명히 보입니다. 보정하면 첫걸음이 성분마다 정확히 크기 $\alpha$이고, 보정하지 않으면 기본값에서 약 $3.16$배로 커집니다.`,
      easyEn: R`Adam starts both the exponential moving average of the gradient $m_t$ (the first moment) and that of the squared gradient (the second moment) at 0. Having started from 0, the early averages are pulled toward 0, and computing the unrolled formula shows the factor is exactly $(1-\beta_1^t)$. Dividing by this factor is the bias correction.

The effect of the correction is plain at the first step. With the correction, the first step has size exactly $\alpha$ in every component; without it, the step is about $3.16$ times larger at the default values.`,
      nodes: [
        { id: 'unroll', at: '**펼치기.**', t: R`점화식 펼치기`, en: R`Unroll the recursion`,
          d: R`귀납법으로 $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$: 최근 기울기일수록 큰 무게를 받는 가중합입니다.`,
          dEn: R`By induction $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$: a weighted sum in which more recent gradients get larger weights.` },
        { id: 'mean', at: '**기댓값.**', t: R`기댓값은 $(1-\beta_1^t)$배`, en: R`The mean is off by $1-\beta_1^t$`,
          d: R`모든 $\E g_k=\bar g$이면 무게의 합이 등비급수라 $\E m_t=(1-\beta_1^t)\bar g$. 그래서 $1-\beta_1^t$로 나눈 $\hat m_t$가 불편이고, 2차 모멘트도 같은 계산입니다.`,
          dEn: R`If every $\E g_k=\bar g$, the weights sum as a geometric series, so $\E m_t=(1-\beta_1^t)\bar g$. Hence $\hat m_t$, divided by $1-\beta_1^t$, is unbiased, and the second moment works the same way.` },
        { id: 'first', at: '**첫걸음.**', t: R`보정된 첫걸음`, en: R`The corrected first step`,
          d: R`$t=1$에서 $\hat m_1=g_1$, $\hat m_2=g_1^2$이므로 걸음은 $\alpha g_1/\sqrt{g_1^2}=\alpha\operatorname{sign}(g_1)$, 성분마다 크기 $\alpha$입니다.`,
          dEn: R`At $t=1$, $\hat m_1=g_1$ and $\hat m_2=g_1^2$, so the step is $\alpha g_1/\sqrt{g_1^2}=\alpha\operatorname{sign}(g_1)$, of size $\alpha$ in every component.` },
        { id: 'raw', at: '**보정이 없으면**', t: R`보정이 없을 때`, en: R`Without the correction`,
          d: R`분자에 $1-\beta_1$, 분모에 $\sqrt{1-\beta_2}$가 남아 걸음이 $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$ 크기, 기본값에서 $0.1/0.0316\approx3.16$배입니다.`,
          dEn: R`The factors $1-\beta_1$ in the numerator and $\sqrt{1-\beta_2}$ in the denominator remain, so the step has size $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$, about $0.1/0.0316\approx3.16$ times at the defaults.` },
      ],
    },

    // ───── 15
    'ch15-convparams': {
      easy: R`매개변수를 세려면 ‘출력 한 칸을 만드는 데 어떤 수들이 쓰이는가’를 식으로 적어 보면 됩니다. 출력 맵 하나의 모든 칸은 같은 필터와 같은 편향을 씁니다(가중치 공유). 그래서 필터 하나의 $K\cdot K\cdot C_{\text{in}}$개 가중치와 편향 하나가 맵 하나에 필요한 전부이고, 맵이 $C_{\text{out}}$장이므로 곱하면 끝입니다. 이 식에는 입력 크기 $N$이 들어 있지 않습니다.

비교를 위해 완전연결층을 세면 입력과 출력의 모든 쌍마다 가중치가 하나씩 필요해 훨씬 많아집니다. 그 차이는 국소 연결과 가중치 공유 두 가지에서 옵니다.`,
      easyEn: R`To count the parameters, write down which numbers are used to make one output entry. Every entry of one output map uses the same filter and the same bias (weight sharing). So the $K\cdot K\cdot C_{\text{in}}$ weights of one filter plus one bias are all that one map needs, and with $C_{\text{out}}$ maps we just multiply. The input size $N$ does not appear in this count.

For comparison, a fully connected layer needs one weight for every pair of an input and an output, far more. The difference comes from two things: local connectivity and weight sharing.`,
      nodes: [
        { id: 'formula', at: '출력의', t: R`출력 한 칸의 식`, en: R`The formula for one output entry`,
          d: R`$G_c[x,y]$는 입력의 $K\times K\times C_{\text{in}}$ 조각에 필터 $w_c$를 곱해 더하고 $b_c$를 더한 값입니다. 쓰이는 수를 이 식에서 셉니다.`,
          dEn: R`$G_c[x,y]$ multiplies a $K\times K\times C_{\text{in}}$ patch of the input by the filter $w_c$, sums, and adds $b_c$. The numbers used are counted from this formula.` },
        { id: 'count', at: '이고, 필터', t: R`공유 덕분에 $N$과 무관`, en: R`Sharing makes it free of $N$`,
          d: R`$w_c$, $b_c$가 위치에 따라 바뀌지 않으므로 맵마다 $K^2C_{\text{in}}+1$개, 모두 $C_{\text{out}}(K^2C_{\text{in}}+1)$개. 완전연결층의 $N^2C_{\text{in}}\cdot N'^2C_{\text{out}}$개(+편향)와 비교하면 국소 연결과 공유가 줄인 몫이 보입니다.`,
          dEn: R`Since $w_c$ and $b_c$ do not change with position, each map needs $K^2C_{\text{in}}+1$, in total $C_{\text{out}}(K^2C_{\text{in}}+1)$. Against the $N^2C_{\text{in}}\cdot N'^2C_{\text{out}}$ (+ biases) of a fully connected layer, the saving from local connectivity and sharing is clear.` },
      ],
    },

    // ───── 16
    'ch16-inception': {
      easy: R`인셉션 모듈은 같은 입력에 여러 크기의 합성곱과 풀링을 나란히 적용하고, 결과를 채널 방향으로 이어 붙입니다. 그러니 셀 것은 두 가지입니다. 갈래마다의 가중치 $K^2C_{\text{in}}C_{\text{out}}$의 합, 그리고 갈래 출력 채널의 합입니다. 이것을 단순 모듈과 병목 모듈에 각각 적용해 비교합니다.

병목의 요령은 비싼 $3\times3$, $5\times5$ 합성곱 앞에 $1\times1$ 합성곱을 두어 채널을 256에서 64로 줄이는 것입니다. 공간 합성곱의 가중치는 입력 채널 수에 비례하므로, $1\times1$ 합성곱을 더 넣었는데도 전체 가중치가 약 $0.318$배로 줄어듭니다.`,
      easyEn: R`An inception module applies convolutions of several sizes and a pooling side by side to the same input and stacks the results along the channels. So there are two things to count: the sum of the weights $K^2C_{\text{in}}C_{\text{out}}$ over the branches, and the sum of the branch output channels. We apply this to the naive module and to the bottleneck module and compare.

The bottleneck trick is to put a $1\times1$ convolution before the expensive $3\times3$ and $5\times5$ convolutions, cutting the channels from 256 to 64. The weights of a spatial convolution are proportional to its number of input channels, so even with the extra $1\times1$ convolutions the total weight count drops to about $0.318$ times.`,
      nodes: [
        { id: 'rule', at: '합성곱층의', t: R`세는 규칙`, en: R`The counting rules`,
          d: R`합성곱층은 $K^2C_{\text{in}}C_{\text{out}}$개, 풀링은 0개. 모든 갈래가 $28\times28$을 유지하므로 출력 채널은 갈래 출력 채널의 합입니다.`,
          dEn: R`A convolution layer has $K^2C_{\text{in}}C_{\text{out}}$ weights, pooling has none. Every branch keeps $28\times28$, so the output channels are the sum of the branch output channels.` },
        { id: 'naive', at: '**단순.**', t: R`단순 모듈`, en: R`The naive module`,
          d: R`$32{,}768+442{,}368+614{,}400=1{,}089{,}536$개. 풀링 갈래가 256채널을 그대로 내보내 출력은 $672$채널입니다.`,
          dEn: R`$32{,}768+442{,}368+614{,}400=1{,}089{,}536$ weights. The pooling branch passes its 256 channels through, so the output has $672$ channels.` },
        { id: 'bott', at: '**병목.**', t: R`병목 모듈`, en: R`The bottleneck module`,
          d: R`$1\times1$(64) 합성곱 세 개가 늘지만 $3\times3$, $5\times5$가 64채널 위에서 계산되어 합 $346{,}112$개, 출력은 $480$채널입니다.`,
          dEn: R`Three $1\times1$ (64) convolutions are added, but the $3\times3$ and $5\times5$ now work on 64 channels, for a total of $346{,}112$ and $480$ output channels.` },
        { id: 'ratio', at: '비율은', t: R`어디서 줄었나`, en: R`Where the saving comes from`,
          d: R`비율은 약 $0.318$이고, 대부분 $5\times5$ 갈래($614{,}400\to169{,}984$)와 $3\times3$ 갈래($442{,}368\to126{,}976$)에서 줄었습니다.`,
          dEn: R`The ratio is about $0.318$, and most of the saving is in the $5\times5$ branch ($614{,}400\to169{,}984$) and the $3\times3$ branch ($442{,}368\to126{,}976$).` },
      ],
    },
    'ch16-resgrad': {
      easy: R`기울기가 깊은 망을 거꾸로 지나갈 때, 연쇄법칙 때문에 층마다 그 층의 야코비안이 하나씩 곱해집니다. 단순 망에서는 그 야코비안 $A_k$들만 곱해지므로, 노름이 모두 어떤 $a<1$ 이하이면 기울기가 층 수에 따라 지수적으로 작아집니다(기울기 소실). 잔차 연결은 각 층의 야코비안을 $I+A_k$로 바꿉니다.

곱 $(I+A_{L-1})\cdots(I+A_l)$을 전개하면 모든 인수에서 $I$를 고른 항, 곧 아무 야코비안도 곱해지지 않은 위층의 기울기 $\frac{\partial J}{\partial\mathbf h^{(L)}}$이 그대로 한 항으로 들어 있습니다. 단순 망의 곱에는 이런 지름길 항이 없습니다.`,
      easyEn: R`When the gradient travels backward through a deep network, the chain rule multiplies in the Jacobian of each layer one at a time. In a plain network only those Jacobians $A_k$ are multiplied, so if all of them have size at most $a<1$, the gradient shrinks exponentially with the number of layers (vanishing gradients). A residual connection turns each layer's Jacobian into $I+A_k$.

Expanding the product $(I+A_{L-1})\cdots(I+A_l)$, the term that picks $I$ from every factor, the upper layer's gradient $\frac{\partial J}{\partial\mathbf h^{(L)}}$ with no Jacobian multiplied at all, is present as a term of its own. The product of a plain network has no such shortcut term.`,
      nodes: [
        { id: 'res', at: '기울기를 행벡터로', t: R`잔차 층의 야코비안 $I+A_k$`, en: R`The residual Jacobian $I+A_k$`,
          d: R`행벡터 기울기에는 층마다 야코비안이 오른쪽에 곱해지고, $\mathbf h^{(k+1)}=\mathbf h^{(k)}+F_k$의 야코비안은 $I+A_k$입니다. 위층부터 차례로 대입해 곱 $\prod_k(I+A_k)$를 얻습니다.`,
          dEn: R`The row-vector gradient picks up each layer's Jacobian on the right, and the Jacobian of $\mathbf h^{(k+1)}=\mathbf h^{(k)}+F_k$ is $I+A_k$. Substituting from the top layer down gives the product $\prod_k(I+A_k)$.` },
        { id: 'expand', at: '곱을 전개하면', t: R`전개, 그리고 단순 망과 비교`, en: R`Expand, then compare with plain`,
          d: R`전개하면 $\frac{\partial J}{\partial\mathbf h^{(L)}}$이 그대로 한 항으로 남습니다. 단순 망은 $A_{L-1}\cdots A_l$뿐이라 노름의 곱 부등식으로 $a^{L-l}$배 이하로 줄어듭니다.`,
          dEn: R`Expanded, $\frac{\partial J}{\partial\mathbf h^{(L)}}$ remains as a term of its own. A plain network has only $A_{L-1}\cdots A_l$, so the norm product inequality shrinks it to at most $a^{L-l}$ times.` },
      ],
    },
    'ch16-saliency': {
      easy: R`현저성 지도는 ‘이 화소를 조금 바꾸면 클래스 점수가 얼마나 바뀌는가’를 화소마다 그린 그림입니다. 이것이 점수의 입력에 대한 기울기라는 것을 두 단계로 보입니다.

먼저 망 전체가 층들의 합성이므로, 연쇄법칙에서 입력 기울기는 층별 야코비안 곱의 한 행이고 역전파 한 번으로 계산됩니다. 다음으로 1차 근사(미분의 정의)에서 화소 $p$만 $\delta$ 바꾸면 점수가 약 $w_p\delta$ 바뀌므로, $|w_p|$가 그 화소에 대한 점수의 민감도입니다.`,
      easyEn: R`A saliency map draws, for each pixel, how much the class score changes when that pixel changes a little. Two steps show that this is the gradient of the score with respect to the input.

First, the whole network is a composition of layers, so by the chain rule the input gradient is one row of the product of the layer Jacobians, computed by a single backward pass. Next, by the first-order approximation (the definition of the derivative), changing only pixel $p$ by $\delta$ changes the score by about $w_p\delta$, so $|w_p|$ is the sensitivity of the score to that pixel.`,
      nodes: [
        { id: 'chain', at: '**연쇄법칙.**', t: R`야코비안 곱의 $c$번째 행`, en: R`Row $c$ of a Jacobian product`,
          d: R`합성 함수의 야코비안은 층별 야코비안의 곱이고, $S_c$는 $F^{(L)}$의 $c$번째 성분이라 그 행이 $\partial S_c/\partial I$입니다. $e_c^T$에 왼쪽부터 곱해 가면 역전파 한 번이면 됩니다.`,
          dEn: R`The Jacobian of a composition is the product of the layer Jacobians, and $S_c$ is the $c$-th component of $F^{(L)}$, so that row is $\partial S_c/\partial I$. Multiplying from the left starting with $e_c^T$ takes one backward pass.` },
        { id: 'lin', at: '**1차 근사.**', t: R`1차 근사와 민감도`, en: R`First-order approximation`,
          d: R`$S_c(I)=S_c(I_0)+w^T(I-I_0)+o(\lVert I-I_0\rVert)$에서 화소 $p$만 $\delta$ 바꾸면 점수가 $w_p\delta+o(\delta)$ 바뀝니다. 그래서 $|w_p|$가 민감도이고, 이를 이미지 모양으로 그린 것이 현저성 지도입니다.`,
          dEn: R`From $S_c(I)=S_c(I_0)+w^T(I-I_0)+o(\lVert I-I_0\rVert)$, changing only pixel $p$ by $\delta$ changes the score by $w_p\delta+o(\delta)$. So $|w_p|$ is the sensitivity, and drawing it in the shape of the image is the saliency map.` },
      ],
    },
  });
})();
