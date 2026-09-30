/* English text — proofs, Part C: 08 neural networks, 09 backpropagation, 10 SGD and activations, 11 initialization, 12 learning rates and batch normalization. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 08
  'ch08-affine': { title: 'A Composition of Linear (Affine) Layers Is Affine',
    stmt: R`If $y_\ell=W_\ell y_{\ell-1}+b_\ell$ ($\ell=1,\dots,L$, $y_0=x$), then $y_L=Ax+c$ with $A=W_L\cdots W_1$ and $c=\sum_{k=1}^LW_L\cdots W_{k+1}b_k$.`,
    body: R`
We show by induction on $\ell$ that $y_\ell=A_\ell x+c_\ell$ with $A_\ell=W_\ell\cdots W_1$ and $c_\ell=\sum_{k=1}^\ell W_\ell\cdots W_{k+1}b_k$ (an empty product is $I$).
- $\ell=1$: $y_1=W_1x+b_1$ ($A_1=W_1$, $c_1=b_1$).
- $\ell-1\to\ell$: $y_\ell=W_\ell(A_{\ell-1}x+c_{\ell-1})+b_\ell=W_\ell A_{\ell-1}x+(W_\ell c_{\ell-1}+b_\ell)$. $W_\ell A_{\ell-1}=A_\ell$, and $W_\ell c_{\ell-1}+b_\ell=\sum_{k=1}^{\ell-1}W_\ell W_{\ell-1}\cdots W_{k+1}b_k+b_\ell=c_\ell$.`,
    note: R`Hence a network stacked without activations has only a single hyperplane as its decision boundary and is represented by one matrix of size $n_L\times n_0$. If a middle layer is narrow, $\operatorname{rank}A\le\min_\ell n_\ell$, which can even reduce the expressive power.` },
  'ch08-xor': { title: 'XOR Is Not Linearly Separable and Is Solved by One Hidden Layer',
    stmt: R`There is no $(w_1,w_2,b)$ that separates the XOR data with $(0,1),(1,0)$ positive and $(0,0),(1,1)$ negative. On the other hand, $f(x)=\max(0,x_1+x_2)-2\max(0,x_1+x_2-1)$ gives exactly the XOR values at the four points.`,
    body: R`
**Impossibility.** Let $s(x)=w_1x_1+w_2x_2+b$ and suppose $s>0$ on the positives and $s<0$ on the negatives.
$$s(0,1)+s(1,0)=w_1+w_2+2b>0,\qquad s(0,0)+s(1,1)=w_1+w_2+2b<0.$$
The same quantity cannot be both positive and negative, a contradiction. (Geometrically: the midpoint of the two positive points and the midpoint of the two negative points are both $(\frac12,\frac12)$.)

**Construction.** With $u=x_1+x_2$, $f=\max(0,u)-2\max(0,u-1)$.
| $x$ | $u$ | $f$ |
|---|---|---|
| $(0,0)$ | 0 | $0-0=0$ |
| $(1,0),(0,1)$ | 1 | $1-0=1$ |
| $(1,1)$ | 2 | $2-2=0$ |
In the hidden layer $(h_1,h_2)=(\max(0,u),\max(0,u-1))$, the four points are moved to $(0,0),(1,0),(1,0),(2,1)$, and the linear function $h_1-2h_2$ of the output layer separates them.`,
    note: R`If the perceptron's activation $g$ is monotone, the decision boundary $\{g(w^Tx+b)=c\}$ is still a hyperplane, so a single layer cannot solve XOR whatever the activation. A hidden layer must change the representation (the embedding viewpoint).` },
  'ch08-paramcount': { title: 'The Number of Parameters of an MLP',
    stmt: R`An MLP with layer sizes $n_0,n_1,\dots,n_L$ (biases in every layer) has $\sum_{\ell=1}^L(n_{\ell-1}+1)n_\ell$ parameters.`,
    body: R`
In layer $\ell$, $W_\ell\in\mathbb R^{n_\ell\times n_{\ell-1}}$ has $n_\ell n_{\ell-1}$ entries and $b_\ell\in\mathbb R^{n_\ell}$ has $n_\ell$, so together $(n_{\ell-1}+1)n_\ell$. Summing over layers gives the result.
Example: for $3072\to1536\to768\to384\to1$, $3073\cdot1536+1537\cdot768+769\cdot384+385=6{,}196{,}225$.` },

  // ───── 09
  'ch09-chain': { title: 'The Chain Rule on a Computational Graph',
    stmt: R`If, in a computational graph, a variable $x$ is used as an input of the nodes $z_1,\dots,z_K$ and the loss $L$ depends on $x$ only through the $z_k$, then $\dfrac{\partial L}{\partial x}=\sum_{k=1}^K\dfrac{\partial L}{\partial z_k}\dfrac{\partial z_k}{\partial x}$. In particular, for $K=1$, (downstream) = (upstream) × (local).`,
    body: R`
We can write $L=\Phi(z_1(x,\dots),\dots,z_K(x,\dots))$. The multivariable chain rule: if $\Phi$ is differentiable and each $z_k$ is differentiable in $x$,
$$\frac{\partial L}{\partial x}=\sum_{k=1}^K\frac{\partial\Phi}{\partial z_k}\frac{\partial z_k}{\partial x}.$$
$\frac{\partial\Phi}{\partial z_k}=\frac{\partial L}{\partial z_k}$ is the value that came back into $z_k$ (the upstream gradient), and $\frac{\partial z_k}{\partial x}$ is the local gradient that node $z_k$ can compute from its own inputs alone.

**The order of backpropagation.** If we topologically sort the graph and compute from the output toward the inputs, then whenever we use the upstream gradient of a variable, the gradients of all the nodes that use it have already been computed. Hence each edge is processed only once, and the total cost is of the same order as the forward computation.

**Example.** $f=(x+y)z$, $q=x+y$: $\frac{\partial f}{\partial x}=\frac{\partial f}{\partial q}\frac{\partial q}{\partial x}=z\cdot1=-4$ ($(x,y,z)=(-2,5,-4)$).` },
  'ch09-sigmoidgate': { title: 'The Local Gradient of the Sigmoid Gate',
    stmt: R`The local gradient of $\sigma(x)=\frac1{1+e^{-x}}$ is $\frac{d\sigma}{dx}=(1-\sigma(x))\sigma(x)$, and in the neuron example ($w_0x_0+w_1x_1+w_2=1$), $\sigma'(1)\approx0.20$.`,
    body: R`
$$\frac{d\sigma}{dx}=\frac{e^{-x}}{(1+e^{-x})^2}=\frac{(1+e^{-x})-1}{1+e^{-x}}\cdot\frac1{1+e^{-x}}=\big(1-\sigma(x)\big)\sigma(x).$$
In the forward pass of the example $\sigma(1)=1/(1+e^{-1})\approx0.731$, so $\sigma'(1)\approx0.731\times0.269\approx0.197\approx0.20$.

This equals the product of the local gradients of the four nodes ($\times-1$, $\exp$, $+1$, $1/x$):
$$(-1)\cdot e^{-1}\cdot1\cdot\Big(-\frac1{(1+e^{-1})^2}\Big)=\frac{e^{-1}}{(1+e^{-1})^2}=\sigma'(1).$$
So grouping the computational graph into “a single sigmoid node” gives the same result (the graph representation is not unique).` },
  'ch09-gates': { title: 'Gradients of the Add, Multiply, Copy, and Max Gates',
    stmt: R`With upstream gradient $\delta=\partial L/\partial z$: for addition $z=x+y$, $\partial L/\partial x=\partial L/\partial y=\delta$; for multiplication $z=xy$, $\partial L/\partial x=\delta y$ and $\partial L/\partial y=\delta x$; for copying ($x$ used as $z_1=x,z_2=x$), $\partial L/\partial x=\delta_1+\delta_2$; for max $z=\max(x,y)$ ($x\ne y$), $\delta$ to the larger and 0 to the smaller.`,
    body: R`
Each is the chain rule $\partial L/\partial x=\sum_k\delta_k\,\partial z_k/\partial x$ with the local gradient plugged in.
- **Add**: $\partial z/\partial x=\partial z/\partial y=1$.
- **Multiply**: $\partial z/\partial x=y$, $\partial z/\partial y=x$ — the other input is multiplied in, hence a “swapper”.
- **Copy**: if $z_1=x$, $z_2=x$, then $\partial z_k/\partial x=1$, and the two paths are **added**.
- **Max**: if $x>y$, then near $x$, $\max(x,y)=x$, so $\partial z/\partial x=1$ and $\partial z/\partial y=0$. At $x=y$ it is not differentiable, and by convention one side is chosen.`,
    note: R`ReLU $\max(0,x)$ is a special case of the max gate: it passes the gradient through unchanged when $x>0$ and blocks it when $x<0$.` },
  'ch09-matgrad': { title: 'Backpropagation through Elementwise Functions and Matrix Products',
    stmt: R`(1) If $y_i=g(x_i)$ (elementwise), $\frac{\partial L}{\partial x}=g'(x)\odot\frac{\partial L}{\partial y}$. (2) If $z=Wx$, $\frac{\partial L}{\partial x}=W^T\frac{\partial L}{\partial z}$ and $\frac{\partial L}{\partial W}=\frac{\partial L}{\partial z}x^T$.`,
    body: R`
**(1)** $y_m$ depends only on $x_m$, so $\frac{\partial y_m}{\partial x_n}=\delta_{mn}g'(x_n)$, i.e., the Jacobian is diagonal. By the chain rule:
$$\frac{\partial L}{\partial x_n}=\sum_m\frac{\partial L}{\partial y_m}\frac{\partial y_m}{\partial x_n}=g'(x_n)\frac{\partial L}{\partial y_n}.$$
For ReLU, $g'(x_n)=\mathbb 1\{x_n>0\}$. The slide's example: $x=(1,-2,3,-1)$, $\frac{\partial L}{\partial y}=(4,-1,5,9)$ → $(4,0,5,0)$. Multiply elementwise without actually building the $N\times N$ diagonal matrix.

**(2)** $z_i=\sum_jW_{ij}x_j$, $\delta=\frac{\partial L}{\partial z}$.
$$\frac{\partial L}{\partial x_j}=\sum_i\delta_i\frac{\partial z_i}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j,\qquad \frac{\partial L}{\partial W_{ij}}=\delta_i\frac{\partial z_i}{\partial W_{ij}}=\delta_ix_j=(\delta x^T)_{ij}.$$
($W_{ij}$ enters only $z_i$.)`,
    note: R`For a minibatch $X\in\mathbb R^{B\times N}$ with $Z=XW^T$, $\frac{\partial L}{\partial W}=\Delta^TX$ ($\Delta=\partial L/\partial Z$): the sum of the per-sample outer products $\delta_bx_b^T$. Placing the transposes so that the sizes match avoids mistakes.` },
  'ch09-mlpbp': { title: 'The Backpropagation Recursion of a Multilayer Perceptron',
    stmt: R`If $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$ ($\sigma$ elementwise), and $\delta_\ell=\partial L/\partial a_\ell$, then
$$\delta_\ell=\sigma'(a_\ell)\odot\big(W_{\ell+1}^T\delta_{\ell+1}\big),\qquad \frac{\partial L}{\partial W_\ell}=\delta_\ell h_{\ell-1}^T,\qquad \frac{\partial L}{\partial b_\ell}=\delta_\ell.$$`,
    body: R`
They are chained in the order $a_\ell\to h_\ell\to a_{\ell+1}$, and $L$ depends on $a_\ell$ only through $a_{\ell+1}$.
- Matrix-product rule: since $a_{\ell+1}=W_{\ell+1}h_\ell+b_{\ell+1}$, $\frac{\partial L}{\partial h_\ell}=W_{\ell+1}^T\delta_{\ell+1}$.
- Elementwise rule: since $h_\ell=\sigma(a_\ell)$, $\delta_\ell=\sigma'(a_\ell)\odot\frac{\partial L}{\partial h_\ell}$.
- Parameters: from $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $\frac{\partial L}{\partial W_\ell}=\delta_\ell h_{\ell-1}^T$, and since $\frac{\partial a_\ell}{\partial b_\ell}=I$, $\frac{\partial L}{\partial b_\ell}=\delta_\ell$.
In components, $\delta_j=\sigma'(a_j)\sum_kw_{kj}\delta_k$ and $\frac{\partial L}{\partial w_{ji}}=\delta_jh_i$ — Bishop's error backpropagation formulas.` },

  // ───── 10
  'ch10-unbiased': { title: 'Stochastic and Minibatch Gradients Are Unbiased Estimators',
    stmt: R`$f=\frac1N\sum_{i=1}^Nf_i$. If $i\sim\mathrm{Uniform}\{1,\dots,N\}$, then $\E[\nabla f_i(x)]=\nabla f(x)$. Drawing the index set $K$ uniformly among all subsets of size $B$ (or drawing the indices i.i.d. uniformly) also gives $\E\big[\frac1B\sum_{k\in K}\nabla f_k(x)\big]=\nabla f(x)$.`,
    body: R`
**A single sample.** $\E[\nabla f_i]=\sum_{i=1}^NP(i)\nabla f_i=\sum_i\frac1N\nabla f_i=\nabla f$.

**An i.i.d. minibatch.** Each $k_b$ is uniform, so $\E[\nabla f_{k_b}]=\nabla f$, and so is the mean.

**A minibatch without replacement.** By symmetry, the probability that each $i$ is in $K$ is $\frac{\binom{N-1}{B-1}}{\binom NB}=\frac BN$. Using the indicator $\mathbb 1\{i\in K\}$,
$$\E\Big[\frac1B\sum_{k\in K}\nabla f_k\Big]=\frac1B\sum_{i=1}^NP(i\in K)\nabla f_i=\frac1B\cdot\frac BN\sum_i\nabla f_i=\nabla f.$$` },
  'ch10-mbvar': { title: 'The Variance of the Minibatch Gradient Shrinks as 1/B',
    stmt: R`$g_i=\nabla f_i(x)$, $\bar g=\nabla f(x)$, $\Sigma=\frac1N\sum_i(g_i-\bar g)(g_i-\bar g)^T$. If $B$ indices are drawn i.i.d. uniformly, the covariance of $\hat g=\frac1B\sum_bg_{k_b}$ is $\Sigma/B$ and $\E\lVert\hat g-\bar g\rVert^2=\tr\Sigma/B$.`,
    body: R`
$e_b=g_{k_b}-\bar g$ are i.i.d. with $\E e_b=0$ and $\Cov(e_b)=\E[e_be_b^T]=\frac1N\sum_i(g_i-\bar g)(g_i-\bar g)^T=\Sigma$.
$$\Cov(\hat g)=\E\Big[\Big(\frac1B\sum_be_b\Big)\Big(\frac1B\sum_ce_c\Big)^T\Big]=\frac1{B^2}\Big(\sum_b\E[e_be_b^T]+\sum_{b\ne c}\E[e_b]\E[e_c]^T\Big)=\frac{B\Sigma}{B^2}=\frac\Sigma B.$$
Taking the trace, $\E\lVert\hat g-\bar g\rVert^2=\tr\Cov(\hat g)=\tr\Sigma/B$.`,
    note: R`Without replacement, $\Cov(\hat g)=\frac{N-B}{N-1}\cdot\frac\Sigma B$ (the finite population correction). If $B=N$ it is 0, i.e., the full-batch gradient has no noise.` },
  'ch10-actderiv': { title: 'The Derivatives of Sigmoid and tanh, and Saturation',
    stmt: R`$\sigma'(z)=\sigma(1-\sigma)\le\frac14$, $\tanh z=2\sigma(2z)-1$, $\tanh'(z)=1-\tanh^2z\le1$, and as $\lvert z\rvert\to\infty$ both derivatives go to 0.`,
    body: R`
$\sigma'=\sigma(1-\sigma)=\frac14-(\sigma-\frac12)^2\le\frac14$.
$2\sigma(2z)-1=\frac{2}{1+e^{-2z}}-1=\frac{1-e^{-2z}}{1+e^{-2z}}=\frac{e^z-e^{-z}}{e^z+e^{-z}}=\tanh z$.
By the quotient rule: $\tanh'z=\frac{(e^z+e^{-z})^2-(e^z-e^{-z})^2}{(e^z+e^{-z})^2}=1-\tanh^2z$.
**Saturation.** As $z\to\infty$, $\sigma\to1$, so $\sigma'=\sigma(1-\sigma)\to0$, and $\tanh\to1$, so $\tanh'\to0$. The same holds as $z\to-\infty$. A backpropagated signal passing through a saturated neuron is multiplied by this small number and vanishes.` },
  'ch10-samesign': { title: 'With Positive Inputs, the Weight Gradients Share a Sign',
    stmt: R`For a neuron $s=\sum_iw_ix_i+b$ with all $x_i>0$, the signs of $\partial L/\partial w_i$ ($i=1,\dots,n$) all equal the sign of $\partial L/\partial s$.`,
    body: R`
Since $\frac{\partial s}{\partial w_i}=x_i$, $\frac{\partial L}{\partial w_i}=\frac{\partial L}{\partial s}x_i$. If $x_i>0$, then $\sign\frac{\partial L}{\partial w_i}=\sign\frac{\partial L}{\partial s}$ (common to all).
Hence in one update $w\leftarrow w-\eta\nabla_wL$, all the $w_i$ increase together or decrease together. If the target direction lies in a quadrant like $(+,-)$, the only way to approach it is to zigzag, alternating between the $(+,+)$ and $(-,-)$ directions. If the inputs are sigmoid (or ReLU) outputs, they are always positive and this problem arises; tanh or input normalization (mean 0) mitigates it.` },

  // ───── 11
  'ch11-varprod': { title: 'The Variance of a Product of Independent Random Variables',
    stmt: R`If $w$ and $x$ are independent and $\E w=0$, then $\E[wx]=0$ and $\Var(wx)=\E[w^2]\E[x^2]=\Var(w)\,\E[x^2]$. In particular, if $\E x=0$, $\Var(wx)=\Var(w)\Var(x)$.`,
    body: R`
With independence, $\E[g(w)h(x)]=\E[g(w)]\E[h(x)]$. Hence $\E[wx]=\E w\,\E x=0$ and
$$\Var(wx)=\E[w^2x^2]-(\E[wx])^2=\E[w^2]\E[x^2].$$
Since $\E w=0$, $\E[w^2]=\Var(w)$. If $\E x=0$, then $\E[x^2]=\Var(x)$.`,
    note: R`When $\E x\ne0$ (ReLU outputs), it is the second moment $\E[x^2]$, not the variance, that enters — which matters for He initialization. That is why the notes said “track the second moment”.` },
  'ch11-xavier': { title: 'Deriving Xavier Initialization',
    stmt: R`If $y=\sum_{i=1}^{D_{in}}w_ix_i$ with all $w_i,x_i$ independent, $\E w_i=\E x_i=0$, $\Var w_i=\sigma^2$, and $\Var x_i=v$, then $\Var(y)=D_{in}\sigma^2v$. Hence $\Var(y)=v$ requires $\sigma^2=1/D_{in}$.`,
    body: R`
**Mean.** $\E y=\sum_i\E[w_ix_i]=\sum_i\E w_i\E x_i=0$, so $\Var y=\E[y^2]$.

**Second moment.** Expanding the square,
$$\E[y^2]=\E\Big[\sum_i\sum_kw_ix_iw_kx_k\Big]=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k].$$
- $i=k$: by independence, $\E[w_i^2]\E[x_i^2]=\sigma^2v$ (mean 0, so second moment = variance).
- $i\ne k$: $w_i$ is independent of all the rest, so $\E[w_iw_kx_ix_k]=\E[w_i]\,\E[w_kx_ix_k]=0$.

Hence $\Var(y)=\sum_{i=1}^{D_{in}}\sigma^2v=D_{in}\sigma^2v$.

**Preservation condition.** Setting $D_{in}\sigma^2v=v$ so that the variance does not change through the layer gives $\sigma^2=\frac1{D_{in}}$, i.e., $W=\text{randn}(D_{in},D_{out})/\sqrt{D_{in}}$.`,
    note: R`In backpropagation $\frac{\partial L}{\partial x_i}=\sum_{j=1}^{D_{out}}w_{ji}\delta_j$, so the same computation multiplies the gradient variance by $D_{out}\sigma^2$. The compromise between the two conditions is Glorot's $\sigma^2=\frac2{D_{in}+D_{out}}$. Near the origin $\tanh z\approx z$, so the linear analysis fits tanh well.` },
  'ch11-halfnormal': { title: 'Half-Normal Integrals: E[max(0,z)] and E[max(0,z)²]',
    stmt: R`If $z\sim\N(0,q)$ and $h=\max(0,z)$, then $\E[h]=\sqrt{\dfrac q{2\pi}}$, $\E[h^2]=\dfrac q2$, and $\Var(h)=\dfrac q2\Big(1-\dfrac1\pi\Big)$.`,
    body: R`
$\phi(z)=\frac1{\sqrt{2\pi q}}e^{-z^2/2q}$. Since $h=0$ ($z\le0$), $\E[h]=\int_0^\infty z\phi(z)\,dz$ and $\E[h^2]=\int_0^\infty z^2\phi(z)\,dz$.

**$\E[h]$.** Substituting $u=\frac{z^2}{2q}$ gives $du=\frac zq\,dz$, i.e., $z\,dz=q\,du$:
$$\int_0^\infty z\,e^{-z^2/2q}dz=q\int_0^\infty e^{-u}du=q\quad\Longrightarrow\quad\E[h]=\frac q{\sqrt{2\pi q}}=\sqrt{\frac q{2\pi}}.$$

**$\E[h^2]$ — by symmetry.** $z^2\phi(z)$ is even, so $\int_0^\infty z^2\phi=\frac12\int_{-\infty}^\infty z^2\phi=\frac12\E[z^2]=\frac q2$.

**$\E[h^2]$ — by integration by parts.** $u=z$, $dv=ze^{-z^2/2q}dz$, $v=-qe^{-z^2/2q}$:
$$\int_0^\infty z^2e^{-z^2/2q}dz=\Big[-qze^{-z^2/2q}\Big]_0^\infty+q\int_0^\infty e^{-z^2/2q}dz=0+q\cdot\frac{\sqrt{2\pi q}}2,$$
(half of the Gaussian integral $\int_{-\infty}^\infty e^{-z^2/2q}dz=\sqrt{2\pi q}$), so $\E[h^2]=\frac1{\sqrt{2\pi q}}\cdot\frac{q\sqrt{2\pi q}}2=\frac q2$.

**Variance.** $\Var(h)=\frac q2-\frac q{2\pi}$.`,
    note: R`$\E[h^2]=\frac12\E[z^2]$ holds even without normality, as long as the distribution of $z$ is symmetric about 0. If the $w_i$ have a symmetric distribution (e.g., a zero-mean normal) and are independent of $x$, then $z=\sum w_ix_i$ is symmetric.` },
  'ch11-he': { title: 'Deriving He (Kaiming) Initialization',
    stmt: R`In a ReLU layer $z=\sum_{i=1}^{D_{in}}w_ix_i$, $h=\max(0,z)$, if the $w_i$ have mean 0, variance $\sigma^2$, a symmetric distribution, and are independent of $x$, then $\E[h^2]=\frac12D_{in}\sigma^2\E[x^2]$. Preserving the second moment requires $\sigma^2=2/D_{in}$.`,
    body: R`
**1. The linear part (notes).** By independence $\Var(z)=\sum_i\Var(w_ix_i)$, and in $\Var(w_ix_i)=\E[(w_ix_i)^2]-(\E[w_ix_i])^2$ we have $\E[w_ix_i]=\E w_i\E x_i=0$ and $\E[(w_ix_i)^2]=\E[w_i^2]\E[x_i^2]=\sigma^2v$ ($v=\E[x_i^2]$). The cross terms $\E[w_iw_kx_ix_k]=0$ ($i\ne k$) also follow from $\E w_i=0$, so
$$\E[z^2]=\Var(z)=D_{in}\sigma^2v=:q.$$

**2. ReLU.** Since $z$ is symmetric (or approximating $z\sim\N(0,q)$ as in the notes), the half-normal integral gives
$$\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v.$$

**3. The preservation condition.** In signal propagation we track the second moment $v=\E[x_i^2]$. Before ReLU $\E[z^2]=D_{in}\sigma^2v$, and after ReLU $\E[h^2]=\frac12D_{in}\sigma^2v$. The input of the next layer is $h$, so requiring $\E[h^2]=\E[x^2]=v$ gives
$$\frac12D_{in}\sigma^2v=v\ \Longrightarrow\ \sigma^2=\frac2{D_{in}},\qquad\sigma=\sqrt{\frac2{D_{in}}}.$$`,
    note: R`The notes' assumption “$\E[x_i]=0$, $\Var(x_i)=v$” does not fit ReLU outputs ($\ge0$). But what step 1 actually uses is only $\E w_i=0$ and independence, and the result holds as is when $v$ is read as the second moment. The notes, too, summarized the conclusion as “track the second moment $v=\E[x_i^2]$”.` },
  'ch11-symmetry': { title: 'Neurons with the Same Initial Values Stay the Same Forever (Symmetry Breaking)',
    stmt: R`If two neurons $j,k$ of a hidden layer are initialized with the same incoming weights $w_j=w_k$, biases $b_j=b_k$, and outgoing weights $v_{\cdot j}=v_{\cdot k}$, then all three conditions continue to hold after every step of full-batch or minibatch gradient descent.`,
    body: R`
By induction. Suppose the conditions hold at some step.
- Forward: for the same input $h$, $a_j=w_j^Th+b_j=a_k$, hence $h_j=h_k$.
- Backward: $\delta_j=\sigma'(a_j)\sum_mv_{mj}\delta_m=\sigma'(a_k)\sum_mv_{mk}\delta_m=\delta_k$.
- Gradients: $\partial L/\partial w_j=\delta_jh=\partial L/\partial w_k$, $\partial L/\partial b_j=\partial L/\partial b_k$, $\partial L/\partial v_{mj}=\delta_mh_j=\partial L/\partial v_{mk}$.
They are updated by the same amount with the same gradients, so the conditions hold at the next step as well. For a minibatch too, they are the same for each sample, so the sums are the same.`,
    note: R`Setting all weights to 0 is the extreme case, in which every neuron of a layer becomes the same function. Random initialization breaks this symmetry (dropout also has a symmetry-breaking effect).` },

  // ───── 12
  'ch12-bnidentity': { title: 'The Statistics of Batch Normalization and Recovering the Identity',
    stmt: R`In the BN output $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$, the batch mean of $\hat x_{\cdot j}$ is 0 and its batch variance is $\frac{\sigma_j^2}{\sigma_j^2+\varepsilon}$, and if $\gamma_j=\sqrt{\sigma_j^2+\varepsilon}$ and $\beta_j=\mu_j$, then $y_{ij}=x_{ij}$.`,
    body: R`
$\hat x_{ij}=(x_{ij}-\mu_j)/s_j$, $s_j=\sqrt{\sigma_j^2+\varepsilon}$.
$$\frac1N\sum_i\hat x_{ij}=\frac{\mu_j-\mu_j}{s_j}=0,\qquad \frac1N\sum_i\hat x_{ij}^2=\frac{\frac1N\sum_i(x_{ij}-\mu_j)^2}{s_j^2}=\frac{\sigma_j^2}{\sigma_j^2+\varepsilon}.$$
The batch mean of $y_{ij}$ is $\beta_j$ and its variance $\gamma_j^2\sigma_j^2/(\sigma_j^2+\varepsilon)\approx\gamma_j^2$, so $\gamma,\beta$ set the scale and location of the output.
If $\gamma_j=s_j$ and $\beta_j=\mu_j$, then $y_{ij}=s_j\frac{x_{ij}-\mu_j}{s_j}+\mu_j=x_{ij}$.`,
    note: R`“Learning $\gamma=\sigma,\beta=\mu$ recovers the identity” (slide) is precisely $\gamma=\sqrt{\sigma^2+\varepsilon}$. But $\mu,\sigma$ change from batch to batch, so fixed $\gamma,\beta$ do not give the exact identity on every batch; understand it as “there is freedom to represent the original distribution”.` },
  'ch12-bnfuse': { title: 'Inference-Mode BN Is Affine and Can Be Fused into the Preceding Layer',
    stmt: R`For fixed $\mu,\sigma^2,\gamma,\beta,\varepsilon$, $y_j=a_jx_j+b_j$ with $a_j=\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}}$ and $b_j=\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}$. With a preceding FC layer $x=Wu+c$, $y=W'u+c'$ with $W'=\diag(a)W$ and $c'=\diag(a)c+b$.`,
    body: R`
$$y_j=\gamma_j\frac{x_j-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}+\beta_j=\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}}x_j+\Big(\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}\Big)=a_jx_j+b_j.$$
As a vector, $y=\diag(a)x+b$. Substituting $x=Wu+c$,
$$y=\diag(a)Wu+\diag(a)c+b.$$
$\diag(a)W$ is the matrix whose $j$-th row is the $j$-th row of $W$ multiplied by $a_j$. The fused layer has the same size and cost as the original FC layer, so BN costs nothing at inference.`,
    note: R`In the slide's “$b'=\diag(a)b+b$”, the first $b$ is the bias of the FC layer ($c$) and the second $b$ is the BN intercept $b_j$. Convolutional layers are fused the same way, per output channel.` },
  'ch12-ema': { title: 'A Running Average Is an Exponentially Weighted Average',
    stmt: R`If $\mu^{\text{run}}_t=m\,\mu^{\text{run}}_{t-1}+(1-m)\mu_t$ ($0\le m<1$), then $\mu^{\text{run}}_t=m^t\mu^{\text{run}}_0+(1-m)\sum_{s=1}^tm^{t-s}\mu_s$. If all batch means equal $\mu$, then $\mu^{\text{run}}_t\to\mu$.`,
    body: R`
By induction: for $t=1$ it is $m\mu_0^{\text{run}}+(1-m)\mu_1$. If it holds at $t-1$,
$$\mu^{\text{run}}_t=m\Big(m^{t-1}\mu_0^{\text{run}}+(1-m)\sum_{s=1}^{t-1}m^{t-1-s}\mu_s\Big)+(1-m)\mu_t=m^t\mu_0^{\text{run}}+(1-m)\sum_{s=1}^tm^{t-s}\mu_s.$$
The weights $(1-m)m^{t-s}$ sum to $1-m^t$ and $m^t\to0$, so if every $\mu_s=\mu$, $\mu^{\text{run}}_t=m^t\mu_0^{\text{run}}+(1-m^t)\mu\to\mu$. The more recent the batch, the larger its weight.` },
  'ch12-bnscale': { title: 'Scale Invariance of Batch Normalization',
    stmt: R`Let $\varepsilon=0$. Scaling the weights of the linear layer right before BN by $\alpha>0$ leaves the BN output the same: $\mathrm{BN}(\alpha Wu)=\mathrm{BN}(Wu)$. Hence the loss $L(W)$ satisfies $L(\alpha W)=L(W)$, $\nabla L(\alpha W)=\frac1\alpha\nabla L(W)$, and $\langle\nabla L(W),W\rangle=0$.`,
    body: R`
For feature $j$ of $x=Wu$, using $\alpha W$ makes the batch mean $\alpha\mu_j$ and the standard deviation $\alpha\sigma_j$, so
$$\hat x_{ij}=\frac{\alpha x_{ij}-\alpha\mu_j}{\alpha\sigma_j}=\frac{x_{ij}-\mu_j}{\sigma_j}.$$
The output is the same, so $L(\alpha W)=L(W)$ ($\forall\alpha>0$).
**Gradient.** Differentiating both sides in $W$, the chain rule gives $\alpha\nabla L(\alpha W)=\nabla L(W)$.
**Orthogonality.** Differentiating in $\alpha$ and setting $\alpha=1$ gives $\frac{d}{d\alpha}L(\alpha W)\big\rvert_{\alpha=1}=\langle\nabla L(W),W\rangle=0$.
Hence as the weights grow, the gradient shrinks and the effective learning rate decreases like $\eta/\alpha^2$ (in terms of the change of direction), making divergence hard even with a large learning rate.` },
  'ch12-cosine': { title: 'Properties of the Cosine Learning Rate Schedule',
    stmt: R`$\alpha_t=\frac12\alpha_0\big(1+\cos\frac{t\pi}T\big)$ ($0\le t\le T$) decreases monotonically from $\alpha_0$ to 0, $\alpha_{T/2}=\frac{\alpha_0}2$, and its slope is 0 at both ends.`,
    body: R`
$\cos$ decreases from 1 to $-1$ on $[0,\pi]$, so $\alpha_t$ decreases from $\alpha_0$ to 0. At $t=T/2$, $\cos\frac\pi2=0$, so it is $\alpha_0/2$.
$\frac{d\alpha_t}{dt}=-\frac{\alpha_0\pi}{2T}\sin\frac{t\pi}T$ is 0 at $t=0,T$, so the learning rate changes slowly at the start and end (staying long at a small learning rate at the end for fine-tuning). Compare: the slope of the linear schedule $\alpha_0(1-t/T)$ is the constant $-\alpha_0/T$.` },
  });
})();
