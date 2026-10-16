/* English text — proofs not in the lecture notes, Part i (Units 09–13) */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 09
  'ch09-gdstop': { title: 'The Stopping Criterion of Gradient Descent and Its Limit Points',
    stmt: R`Let the loss $\mathcal L:\mathbb R^d\to\mathbb R$ be $\beta$-smooth (its gradient is $\beta$-Lipschitz) and bounded below ($\mathcal L^*=\inf\mathcal L>-\infty$), and let gradient descent $\theta^{k+1}=\theta^k-\alpha\nabla\mathcal L(\theta^k)$ use a step size $0<\alpha<2/\beta$. (i) $\sum_{k=0}^\infty\lVert\nabla\mathcal L(\theta^k)\rVert^2\le\frac{2(\mathcal L(\theta^0)-\mathcal L^*)}{\alpha(2-\alpha\beta)}<\infty$, hence $\nabla\mathcal L(\theta^k)\to0$ and $\lVert\theta^{k+1}-\theta^k\rVert\to0$. (ii) For every $\epsilon>0$ the stopping criterion $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$ holds at some $k\le K_\epsilon:=\Big\lfloor\frac{2\alpha(\mathcal L(\theta^0)-\mathcal L^*)}{(2-\alpha\beta)\epsilon^2}\Big\rfloor$, and there $\lVert\nabla\mathcal L(\theta^k)\rVert<\epsilon/\alpha$. (iii) As long as $\mathcal L\in C^1$ and $\alpha>0$, if the iterates converge to some $\bar\theta$, then $\nabla\mathcal L(\bar\theta)=0$.`,
    body: R`
**1. Decrease per step.** Putting $\theta^{k+1}-\theta^k=-\alpha\nabla\mathcal L(\theta^k)$ into the descent lemma gives the decrease condition (Section 13.4)
$$\mathcal L(\theta^{k+1})\le\mathcal L(\theta^k)-c\,\lVert\nabla\mathcal L(\theta^k)\rVert^2,$$
$$c:=\alpha\Big(1-\frac{\alpha\beta}2\Big)=\frac{\alpha(2-\alpha\beta)}2.$$
The assumption $0<\alpha<2/\beta$ gives $2-\alpha\beta>0$, so $c>0$.

**2. The squared gradients have a finite sum.** Adding 1 over $k=0,\dots,K-1$, the right side telescopes:
$$\begin{aligned}c\sum_{k=0}^{K-1}\lVert\nabla\mathcal L(\theta^k)\rVert^2&\le\mathcal L(\theta^0)-\mathcal L(\theta^K)\\&\le\mathcal L(\theta^0)-\mathcal L^*.\end{aligned}$$
The partial sums of nonnegative terms are at most $S:=(\mathcal L(\theta^0)-\mathcal L^*)/c$, a value independent of $K$, so the series converges and its sum is at most $S$ — the inequality in (i). The terms of a convergent series go to 0, so $\nabla\mathcal L(\theta^k)\to0$, and by the update rule $\lVert\theta^{k+1}-\theta^k\rVert=\alpha\lVert\nabla\mathcal L(\theta^k)\rVert\to0$.

**3. When is the stopping criterion met?** Let $J$ be the set of indices $k$ with $\lVert\theta^{k+1}-\theta^k\rVert\ge\epsilon$. For $k\in J$ we have $\lVert\nabla\mathcal L(\theta^k)\rVert^2=\lVert\theta^{k+1}-\theta^k\rVert^2/\alpha^2\ge\epsilon^2/\alpha^2$, so keeping only the terms in $J$ in the sum of 2,
$$\lvert J\rvert\cdot\frac{\epsilon^2}{\alpha^2}\le S,$$
$$\lvert J\rvert\le\frac{\alpha^2S}{\epsilon^2}=\frac{2\alpha(\mathcal L(\theta^0)-\mathcal L^*)}{(2-\alpha\beta)\epsilon^2}.$$
Since $\lvert J\rvert$ is an integer, $\lvert J\rvert\le K_\epsilon$. The indices $0,1,\dots,K_\epsilon$ are $K_\epsilon+1$ in number, so they cannot all lie in $J$, and at a $k\le K_\epsilon$ outside $J$ we have $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$. There $\lVert\nabla\mathcal L(\theta^k)\rVert=\lVert\theta^{k+1}-\theta^k\rVert/\alpha<\epsilon/\alpha$.

**4. A limit point is a stationary point.** Here we only use $\mathcal L\in C^1$ and $\alpha>0$. If $\theta^k\to\bar\theta$, then also $\theta^{k+1}\to\bar\theta$, so $\theta^k-\theta^{k+1}\to0$. By the update rule $\nabla\mathcal L(\theta^k)=(\theta^k-\theta^{k+1})/\alpha\to0$, and since $\nabla\mathcal L$ is continuous, $\nabla\mathcal L(\bar\theta)=\lim_k\nabla\mathcal L(\theta^k)=0$.`,
    note: R`All the stopping criterion $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$ tells us is “we reached a point where the gradient is smaller than $\epsilon/\alpha$”, not that we reached a minimizer. A stationary point can be a local minimum or a saddle point, and where the iteration stops depends on the initialization $\theta^0$ (the loss surface of Section 9.1). The count $K_\epsilon$ is a worst-case bound proportional to $1/\epsilon^2$. With $\alpha=1/\beta$, the argument of 3 says the same as $\min_{k<T}\lVert\nabla\mathcal L(\theta^k)\rVert^2\le\frac{2\beta(\mathcal L(\theta^0)-\mathcal L^*)}T$ of Section 13.4.` },
  'ch09-batchmat': { title: 'Backpropagation Through a Batched Matrix Product',
    stmt: R`Stack $B$ samples as the rows of $X\in\mathbb R^{B\times N}$ (row $b$ is $x_b^T$), take $W\in\mathbb R^{M\times N}$, compute $Z=XW^T\in\mathbb R^{B\times M}$, and let a scalar loss $L$ depend on $X,W$ only through $Z$. With $G:=\frac{\partial L}{\partial Z}\in\mathbb R^{B\times M}$ ($G_{bi}=\partial L/\partial Z_{bi}$, row $b$ written $\delta_b^T$),
$$\frac{\partial L}{\partial X}=GW\quad(B\times N),$$
$$\frac{\partial L}{\partial W}=G^TX=\sum_{b=1}^B\delta_bx_b^T\quad(M\times N).$$`,
    body: R`
**1. Write it in entries.** The entries of $Z=XW^T$ are $Z_{bi}=\sum_{j=1}^NX_{bj}W_{ij}$, i.e., row $b$ of $Z$ is $z_b=Wx_b$ — the $z=Wx$ of Section 9.5 applied to sample $b$. Since $L$ depends only through the $BM$ entries of $Z$, the multivariable chain rule gives, for any variable $\theta$,
$$\frac{\partial L}{\partial\theta}=\sum_{b'=1}^B\sum_{i=1}^MG_{b'i}\,\frac{\partial Z_{b'i}}{\partial\theta}.$$

**2. The gradient with respect to the input.** $X_{bj}$ enters only $Z_{b1},\dots,Z_{bM}$ in row $b$, so $\frac{\partial Z_{b'i}}{\partial X_{bj}}=\mathbb 1[b'=b]\,W_{ij}$. Putting this into 1, only the term $b'=b$ of the sum over $b'$ survives:
$$\frac{\partial L}{\partial X_{bj}}=\sum_{i=1}^MG_{bi}W_{ij}=(GW)_{bj}.$$
Row $b$ alone is $(W^T\delta_b)^T$ — the $W^T\delta$ of Section 9.5 used for each sample separately, with no mixing of other samples' upstream gradients.

**3. The gradient with respect to the weights.** $W_{ij}$ enters output $i$ of **every sample**, $Z_{1i},\dots,Z_{Bi}$ (a copy gate), so $\frac{\partial Z_{bi'}}{\partial W_{ij}}=\mathbb 1[i'=i]\,X_{bj}$. Putting this into 1, only $i'=i$ survives in the sum over $i'$, while the sum over $b$ stays:
$$\frac{\partial L}{\partial W_{ij}}=\sum_{b=1}^BG_{bi}X_{bj}=(G^TX)_{ij}.$$
Column $b$ of $G^T$ is $\delta_b$ and row $b$ of $X$ is $x_b^T$, so writing the matrix product as a sum of “column × row” gives $G^TX=\sum_b\delta_bx_b^T$ — the per-sample outer products ($\delta x^T$ of Section 9.5) all added up.

**4. Check the shapes.** $GW$ is $(B\times M)(M\times N)=B\times N$, the shape of $X$, and $G^TX$ is $(M\times B)(B\times N)=M\times N$, the shape of $W$. For $B=1$, $G=\delta^T$ and $X=x^T$, and the two formulas reduce to $\frac{\partial L}{\partial x}=W^T\delta$ and $\frac{\partial L}{\partial W}=\delta x^T$.

**5. For a mean loss.** If $L=\frac1B\sum_b\ell_b(z_b)$, then $\delta_b=\frac1B\nabla_{z_b}\ell_b$, so
$$\frac{\partial L}{\partial W}=\frac1B\sum_{b=1}^B\nabla_{z_b}\ell_b\,x_b^T,$$
the mean of the per-sample weight gradients $\nabla_{z_b}\ell_b\,x_b^T$ — the minibatch gradient of Unit 10.`,
    note: R`With a bias, $Z=XW^T+\mathbf 1c^T$ ($\mathbf 1\in\mathbb R^B$), each $c_i$ is also copied to every sample, so $\frac{\partial L}{\partial c}=G^T\mathbf 1=\sum_b\delta_b$ (a sum along the batch). If the formulas get confusing, match shapes as in Section 9.5: the only product of $G$ ($B\times M$) and $W$ ($M\times N$) that has the shape $B\times N$ of $X$ is $GW$, and the only product of $G$ and $X$ that has the shape $M\times N$ of $W$ is $G^TX$.` },

  // ───── 10
  'ch10-mbnorepl': { title: 'Shuffled and Cut Minibatches: Variance Without Replacement',
    stmt: R`Let $g_i=\nabla f_i(x)\in\mathbb R^d$ ($i=1,\dots,N$, $N\ge2$), $\nabla f=\frac1N\sum_ig_i$ and $\Sigma=\frac1N\sum_i(g_i-\nabla f)(g_i-\nabla f)^T$. (a) If at every epoch the order of the indices $1,\dots,N$ is shuffled uniformly at random and cut into consecutive pieces of $B$, each minibatch $K$ is uniformly distributed over the $\binom NB$ subsets of size $B$. (b) If $K$ is such a uniform subset, then $\hat g=\frac1B\sum_{k\in K}g_k$ satisfies
$$\E\hat g=\nabla f,\qquad\Cov(\hat g)=\frac{N-B}{N-1}\cdot\frac\Sigma B,$$
$$\E\lVert\hat g-\nabla f\rVert^2=\frac{N-B}{N-1}\cdot\frac{\tr\Sigma}B.$$`,
    body: R`
**1. A shuffled-and-cut batch is a uniform subset (a).** Shuffling picks one of the $N!$ permutations $\pi$ with equal probability, and the $m$th batch is the set of indices placed at positions $P_m=\{(m-1)B+1,\dots,mB\}$, $K=\{\pi(p):p\in P_m\}$. Fix a subset $S$ of size $B$. The number of permutations with $K=S$ is the number of ways to place the elements of $S$ at the positions $P_m$, $B!$, times the number of ways to place the other $N-B$ indices at the other positions, $(N-B)!$. Hence
$$P(K=S)=\frac{B!\,(N-B)!}{N!}=\frac1{\binom NB}$$
which does not depend on $S$. (If the last batch is smaller than $B$, the same argument shows it is uniform over subsets of its size.)

**2. Write it with indicators.** With $e_i=g_i-\nabla f$ and $I_i=\mathbb 1[i\in K]$ we have $\sum_ie_i=\sum_ig_i-N\nabla f=0$, and since $\lvert K\rvert=B$,
$$\hat g-\nabla f=\frac1B\sum_{k\in K}e_k=\frac1B\sum_{i=1}^NI_ie_i.$$

**3. Inclusion probabilities.** The subsets of size $B$ containing $i$ are as many as the ways to choose $B-1$ of the other $N-1$ indices, so $\E I_i=P(i\in K)=\binom{N-1}{B-1}\big/\binom NB=\frac BN$. For $i\ne j$, $\binom{N-2}{B-2}$ subsets contain both, so
$$\E[I_iI_j]=\frac{\binom{N-2}{B-2}}{\binom NB}=\frac{B(B-1)}{N(N-1)}$$
(both sides are 0 when $B=1$). Also $I_i^2=I_i$ for an indicator.

**4. Unbiasedness.** By linearity of expectation, $\E[\hat g-\nabla f]=\frac1B\sum_i\frac BN\,e_i=\frac1N\sum_ie_i=0$.

**5. Covariance.** By 4, $\E\hat g=\nabla f$, so $\Cov(\hat g)=\E[(\hat g-\nabla f)(\hat g-\nabla f)^T]$. Inserting 2 and using $I_i^2=I_i$,
$$\begin{aligned}\Cov(\hat g)=\frac1{B^2}\Big(&\sum_i\E[I_i]\,e_ie_i^T\\&+\sum_{i\ne j}\E[I_iI_j]\,e_ie_j^T\Big).\end{aligned}$$
Here $\sum_ie_ie_i^T=N\Sigma$, and since $\sum_ie_i=0$,
$$\begin{aligned}\sum_{i\ne j}e_ie_j^T&=\Big(\sum_ie_i\Big)\Big(\sum_je_j\Big)^T-\sum_ie_ie_i^T\\&=-N\Sigma.\end{aligned}$$
Inserting the probabilities of 3,
$$\begin{aligned}\Cov(\hat g)&=\frac1{B^2}\Big(\frac BN\,N\Sigma-\frac{B(B-1)}{N(N-1)}\,N\Sigma\Big)\\&=\frac\Sigma B\Big(1-\frac{B-1}{N-1}\Big)=\frac{N-B}{N-1}\cdot\frac\Sigma B.\end{aligned}$$

**6. Squared norm.** $\E\lVert\hat g-\nabla f\rVert^2=\E\,\tr\big[(\hat g-\nabla f)(\hat g-\nabla f)^T\big]=\tr\Cov(\hat g)$ (trace and expectation commute), which gives the last formula.`,
    note: R`The correction factor $\frac{N-B}{N-1}$ is 1 for $B=1$ (the same as with replacement) and 0 for $B=N$ (batch = whole data set = exact gradient); in between it is below 1, so the variance is always smaller than the $\Sigma/B$ of sampling with replacement. No sample is drawn twice, so no information is repeated. However, the batches of one epoch are chosen not to overlap, so they are **not independent of each other**. Each batch has the mean and covariance above, but the analysis of Unit 13, which assumes that each step's gradient is unbiased regardless of the past, fits the shuffle-and-cut scheme only approximately. (If $B$ divides $N$ and all batch gradients are computed at the same $x$, the average of the batch gradients over one epoch is exactly $\nabla f$.)` },

  // ───── 11
  'ch11-depth': { title: 'In a Deep Network the Signal Size Is Multiplied Layer by Layer',
    stmt: R`From the input $h_0=x$ ($\E\lVert x\rVert^2<\infty$, mean not necessarily 0) compute $z_\ell=W_\ell h_{\ell-1}$, $h_\ell=\varphi(z_\ell)$ ($W_\ell\in\mathbb R^{n_\ell\times n_{\ell-1}}$, $\ell=1,\dots,L$), where the entries of $W_\ell$ are independent with mean 0 and variance $\sigma_\ell^2$, and $x,W_1,\dots,W_L$ are independent. Measuring the size of the signal by the second moment per component $m_\ell=\frac1{n_\ell}\E\lVert h_\ell\rVert^2$: (a) for any activation, $\E[z_{\ell,i}^2]=n_{\ell-1}\sigma_\ell^2\,m_{\ell-1}$ for every $i$. (b) For the linear $\varphi(z)=z$, $m_L=\prod_{\ell=1}^L(n_{\ell-1}\sigma_\ell^2)\,m_0$. (c) For ReLU, if each $W_\ell$ has the same distribution after a sign flip ($W_\ell\overset d=-W_\ell$), $m_L=\prod_{\ell=1}^L\big(\frac12n_{\ell-1}\sigma_\ell^2\big)\,m_0$. (d) For tanh, $m_L\le\prod_{\ell=1}^L(n_{\ell-1}\sigma_\ell^2)\,m_0$. Hence if width and variance are the same in every layer ($n$, $\sigma^2$), the signal explodes or vanishes exponentially in depth, and its size is kept only when $n\sigma^2=1$ (linear, Xavier) or $n\sigma^2=2$ (ReLU, He).`,
    body: R`
**1. What is independent of what.** $h_{\ell-1}$ is a function of $x,W_1,\dots,W_{\ell-1}$ only, so it is independent of $W_\ell$. All three activations satisfy $\lvert\varphi(z)\rvert\le\lvert z\rvert$ (for tanh see 4), so $\E\lVert h_\ell\rVert^2\le\E\lVert z_\ell\rVert^2$, and by the computation of 2 and induction all second moments are finite.

**2. One layer (a).** Writing $W=W_\ell$ and $h=h_{\ell-1}$, $z_{\ell,i}=\sum_jW_{ij}h_j$. Expanding the square and splitting expectations by the independence of $W$ and $h$,
$$\E[z_{\ell,i}^2]=\sum_{j,k}\E[W_{ij}W_{ik}]\,\E[h_jh_k].$$
For $j\ne k$, $W_{ij}$ and $W_{ik}$ are independent with mean 0, so $\E[W_{ij}W_{ik}]=\E W_{ij}\,\E W_{ik}=0$; for $j=k$ it is $\sigma_\ell^2$. Hence
$$\E[z_{\ell,i}^2]=\sigma_\ell^2\sum_j\E[h_j^2]=n_{\ell-1}\sigma_\ell^2\,m_{\ell-1}.$$
The components of $h$ need not be independent or have mean 0 — the cross terms vanish because the **weights** have mean 0. Also $\E z_{\ell,i}=\sum_j\E W_{ij}\E h_j=0$, so $\E[z_{\ell,i}^2]$ is the variance, and its square root $\operatorname{std}(z_{\ell,i})=\sqrt{n_{\ell-1}}\,\sigma_\ell\sqrt{m_{\ell-1}}$ is the exact form of the key-box formula “$\sqrt D\cdot\operatorname{std}(w)\cdot(\text{input size})$” (input size = root mean square of the components, $\sqrt{m_{\ell-1}}$).

**3. Linear and ReLU (b), (c).** For linear, $h_\ell=z_\ell$, so $m_\ell=\frac1{n_\ell}\sum_i\E[z_{\ell,i}^2]=n_{\ell-1}\sigma_\ell^2m_{\ell-1}$. For ReLU, first note that $z_{\ell,i}$ is symmetric about 0: $W_\ell$ is independent of $h_{\ell-1}$ and $W_\ell\overset d=-W_\ell$, so $(W_\ell,h_{\ell-1})\overset d=(-W_\ell,h_{\ell-1})$, hence $z_\ell=W_\ell h_{\ell-1}\overset d=-z_\ell$. Then for $z=z_{\ell,i}$ (replace $z$ on the left by $-z$, which has the same distribution, to get the right)
$$\E\big[z^2\,\mathbb 1\{z>0\}\big]=\E\big[z^2\,\mathbb 1\{z<0\}\big]$$
and since $z^2\mathbb 1\{z=0\}=0$, the two values add up to $\E[z^2]$. As $\ReLU(z)^2=z^2\mathbb 1\{z>0\}$, we get $\E[\ReLU(z)^2]=\frac12\E[z^2]$, hence $m_\ell=\frac12n_{\ell-1}\sigma_\ell^2m_{\ell-1}$.

**4. tanh (d).** $\tanh0=0$ and $0<\tanh'=1-\tanh^2\le1$, so by the mean value theorem $\lvert\tanh z\rvert=\lvert\tanh z-\tanh0\rvert\le\lvert z\rvert$. Hence $m_\ell\le\frac1{n_\ell}\E\lVert z_\ell\rVert^2=n_{\ell-1}\sigma_\ell^2m_{\ell-1}$.

**5. Stacking layers.** Applying the one-layer relations of 3 and 4 for $\ell=1,\dots,L$ in turn (induction) gives the product formulas (b)–(d). With equal widths and variances, $m_L=(cn\sigma^2)^Lm_0$ ($c=1$ linear, $c=\frac12$ ReLU), so if $cn\sigma^2>1$ the signal explodes exponentially in the depth $L$, if $cn\sigma^2<1$ it vanishes exponentially, and it is kept only when $cn\sigma^2=1$.

**6. The numbers in the slides.** For $n=4096$, $\sqrt n=64$. $\sigma=0.01$: by 2 the size of $z$ is $64\times0.01=0.64$ times the input size, and in tanh layers, by (d), the signal size is multiplied by at most $0.64$ per layer, so after 6 layers it is below $0.64^6\approx0.07$ times the start (slides: $0.49\to0.05$). $\sigma=0.05$: the size of $z$ is $3.2$ times the input size, so while the input size stays near 1 the inputs to tanh are around $\pm3$ and saturate. $\sigma=1/64$ (Xavier): the factor is exactly 1.`,
    note: R`The same computation applies backward. In a linear layer with a fixed upstream gradient $\delta$, $\E\lVert W_\ell^T\delta\rVert^2=n_{\ell-1}\sigma_\ell^2\lVert\delta\rVert^2$, i.e., a factor $n_\ell\sigma_\ell^2$ ($D_{out}\sigma^2$) per component, so gradient sizes are also multiplied layer by layer (Glorot's backward condition). For sigmoid layers the factor $\sigma'\le\frac14$ is multiplied in at every layer, so $\lVert\delta_\ell\rVert\le\prod_{k=\ell+1}^L\frac{\lVert W_k\rVert_2}4\,\lVert\delta_L\rVert$ (Section 9.6, going deeper), and unless the weights are large the gradient vanishes exponentially. The formulas above are **expectations** over random weights; that the value in one sampled network is close to its expectation is an approximation that improves as the width $n$ grows.` },
  'ch11-glorot': { title: 'The Glorot Compromise and Uniform Initialization',
    stmt: R`(a) In backpropagation $g=W^T\delta$, i.e., $g_i=\sum_{j=1}^{D_{out}}W_{ji}\delta_j$, if the entries of $W$ are independent with mean 0 and variance $\sigma^2$, $W$ is independent of $\delta$, and $\E[\delta_j^2]=u$ ($\forall j$), then $\E g_i=0$ and $\E[g_i^2]=D_{out}\sigma^2u$. So the second moment of the gradient is preserved when $\sigma^2=1/D_{out}$. (b) The forward condition $\sigma^2=1/D_{in}$ and the backward condition $\sigma^2=1/D_{out}$ hold together only when $D_{in}=D_{out}$. $\sigma^2=\frac2{D_{in}+D_{out}}$ is the harmonic mean of the two values and lies between them, and with it the arithmetic mean of the forward factor $D_{in}\sigma^2$ and the backward factor $D_{out}\sigma^2$ is exactly 1. (c) If $w\sim U(-a,a)$, then $\E w=0$ and $\Var w=a^2/3$. Hence the uniform distribution with variance $\frac2{D_{in}+D_{out}}$ has $a=\sqrt{\frac6{D_{in}+D_{out}}}$.`,
    body: R`
**1. Backward (a).** Mean: by independence $\E g_i=\sum_j\E W_{ji}\,\E\delta_j=0$. Second moment: expanding the square and splitting expectations by the independence of $W$ and $\delta$,
$$\E[g_i^2]=\sum_{j,k}\E[W_{ji}W_{ki}]\,\E[\delta_j\delta_k].$$
For $j\ne k$, $W_{ji}$ and $W_{ki}$ are independent with mean 0, so $\E[W_{ji}W_{ki}]=0$; for $j=k$ it is $\sigma^2$. Hence $\E[g_i^2]=\sigma^2\sum_{j=1}^{D_{out}}\E[\delta_j^2]=D_{out}\sigma^2u$, and $\E[g_i^2]=u$ requires $\sigma^2=1/D_{out}$. It is the forward computation of Section 11.2 with the summed index now running over the $D_{out}$ outputs.

**2. Two conditions and the harmonic mean (b).** $\frac1{D_{in}}=\frac1{D_{out}}\iff D_{in}=D_{out}$, so with different widths no single $\sigma^2$ satisfies both conditions. The harmonic mean of the two positive numbers $p=\frac1{D_{in}}$, $q=\frac1{D_{out}}$ is
$$\frac2{\frac1p+\frac1q}=\frac2{D_{in}+D_{out}}$$
and a harmonic mean always lies between the two numbers: if $p\le q$, then $\frac1q\le\frac12\big(\frac1p+\frac1q\big)\le\frac1p$, and taking reciprocals, $p\le\frac2{1/p+1/q}\le q$. With this $\sigma^2$ the two factors are $D_{in}\sigma^2=\frac{2D_{in}}{D_{in}+D_{out}}$ and $D_{out}\sigma^2=\frac{2D_{out}}{D_{in}+D_{out}}$, which add up to 2, so their mean is exactly 1 — when one is above 1, the other is below 1 by the same amount, a balance.

**3. The variance of the uniform distribution (c).** The density is $\frac1{2a}$ on $[-a,a]$, so
$$\E w=\int_{-a}^a\frac w{2a}\,dw=0,$$
$$\begin{aligned}\Var w=\E w^2&=\int_{-a}^a\frac{w^2}{2a}\,dw\\&=\frac1{2a}\cdot\frac{2a^3}3=\frac{a^2}3.\end{aligned}$$
Solving $\frac{a^2}3=\frac2{D_{in}+D_{out}}$ gives $a^2=\frac6{D_{in}+D_{out}}$. The uniform $U(-a,a)$ has mean 0 and is symmetric about 0, so it satisfies the assumptions on the weights made in 1 and in Section 11.2.

**4. A numerical example.** For $D_{in}=300$, $D_{out}=100$: $\sigma^2=\frac2{400}=0.005$ and $a=\sqrt{6/400}\approx0.1225$. The two factors are $D_{in}\sigma^2=1.5$ and $D_{out}\sigma^2=0.5$, with mean 1.`,
    note: R`The assumption in 1 that $W$ and $\delta$ are independent is an approximation, since $\delta$ depends on $W$ through the forward outputs. The original derivation of Glorot and Bengio (2010) uses the same approximation. In the same way, matching the He variance $\frac2{D_{in}}$ with a uniform distribution gives $a=\sqrt{6/D_{in}}$.` },

  // ───── 12
  'ch12-lrquad': { title: 'Four Regimes of the Learning Rate on a Quadratic Bowl, and the Noise Floor',
    stmt: R`Let $f(x)=\frac\beta2x^2$ ($\beta>0$), with a given $x_0\ne0$ and $\eta>0$. (a) GD $x_{t+1}=x_t-\eta f'(x_t)$ gives $x_t=(1-\eta\beta)^tx_0$ and $f(x_t)=(1-\eta\beta)^{2t}f(x_0)$; for $\eta<\frac1\beta$ it goes to 0 monotonically keeping its sign, for $\eta=\frac1\beta$ it reaches $x_1=0$ in one step, for $\frac1\beta<\eta<\frac2\beta$ it goes to 0 while flipping sign, for $\eta=\frac2\beta$ it oscillates in place as $x_t=(-1)^tx_0$, and for $\eta>\frac2\beta$ we get $\lvert x_t\rvert\to\infty$ (divergence). (b) For SGD $x_{t+1}=x_t-\eta\big(f'(x_t)+\xi_t\big)$ with independent noise $\xi_0,\xi_1,\dots$, $\E\xi_t=0$ and $\Var\xi_t=s^2>0$, if $0<\eta<\frac2\beta$ then
$$\lim_{t\to\infty}\E f(x_t)=\frac{\eta s^2}{2(2-\eta\beta)},$$
and $\E f(x_t)\ge\frac\beta2\eta^2s^2>0$ for every $t\ge1$. That is, SGD with a fixed learning rate cannot go below a noise floor roughly proportional to $\eta$.`,
    body: R`
**1. Closed form.** $f'(x)=\beta x$, so $x_{t+1}=x_t-\eta\beta x_t=rx_t$ with $r:=1-\eta\beta$. By induction $x_t=r^tx_0$ and $f(x_t)=\frac\beta2r^{2t}x_0^2=r^{2t}f(x_0)$.

**2. Four regimes (a).** Everything is decided by the factor $r$.

- $0<\eta<\frac1\beta\iff0<r<1$: $x_t$ keeps the sign of $x_0$, and $\lvert x_t\rvert=r^t\lvert x_0\rvert$ decreases monotonically to 0.
- $\eta=\frac1\beta\iff r=0$: $x_1=0$, the minimizer in one step.
- $\frac1\beta<\eta<\frac2\beta\iff-1<r<0$: the sign flips at every step (jumping over the wall) and $\lvert x_t\rvert=\lvert r\rvert^t\lvert x_0\rvert\to0$.
- $\eta=\frac2\beta\iff r=-1$: $x_t=(-1)^tx_0$, bouncing forever between two points at the same height.
- $\eta>\frac2\beta\iff r<-1$: $\lvert x_t\rvert=\lvert r\rvert^t\lvert x_0\rvert\to\infty$ and the loss $f(x_t)=r^{2t}f(x_0)$ blows up exponentially.

The loss decreases at every step exactly when $r^2<1\iff0<\eta<\frac2\beta$, and the per-step factor $r^2=(1-\eta\beta)^2$ is 0 at $\eta=\frac1\beta$ and approaches 1 (slow progress) as $\eta$ approaches 0 or $\frac2\beta$.

**3. Second-moment recursion of SGD (b).** $x_{t+1}=(1-\eta\beta)x_t-\eta\xi_t=rx_t-\eta\xi_t$. Since $x_t$ is a function of $x_0,\xi_0,\dots,\xi_{t-1}$ only, it is independent of $\xi_t$, so $\E[x_t\xi_t]=\E x_t\,\E\xi_t=0$. Taking the expectation of the square, $a_t:=\E[x_t^2]$ satisfies
$$\begin{aligned}a_{t+1}&=r^2a_t-2r\eta\,\E[x_t\xi_t]+\eta^2\E[\xi_t^2]\\&=r^2a_t+\eta^2s^2.\end{aligned}$$

**4. The limit.** For $0<\eta<\frac2\beta$, $\rho:=r^2<1$. Subtracting the fixed point $a^*=\frac{\eta^2s^2}{1-\rho}$ gives $a_{t+1}-a^*=\rho(a_t-a^*)$, so $a_t-a^*=\rho^t(a_0-a^*)\to0$. Here
$$1-\rho=1-(1-\eta\beta)^2=\eta\beta(2-\eta\beta),$$
$$a^*=\frac{\eta^2s^2}{\eta\beta(2-\eta\beta)}=\frac{\eta s^2}{\beta(2-\eta\beta)}$$
so $\E f(x_t)=\frac\beta2a_t\to\frac\beta2a^*=\frac{\eta s^2}{2(2-\eta\beta)}$.

**5. No going below the floor.** In the recursion of 3, $r^2a_t\ge0$, so $a_{t+1}\ge\eta^2s^2$ for every $t\ge0$; that is, for $t\ge1$, $\E f(x_t)=\frac\beta2a_t\ge\frac\beta2\eta^2s^2>0$. As long as there is noise, the expected loss never reaches 0.

**6. Reading the learning curves.** The limit $\frac{\eta s^2}{2(2-\eta\beta)}$ of 4 increases with $\eta$, and for small $\eta$ it is about $\frac{\eta s^2}4$, proportional to $\eta$. So (b) a low learning rate is slow, since the factor $r^2$ is close to 1, but has a low floor; (c) a high learning rate goes down fast at first ($r^2$ small) but stops at a high floor; and (a) for $\eta>\frac2\beta$, $\lvert r\rvert>1$ and it blows up regardless of the noise (by 3, $a_t\ge r^{2t}a_0\to\infty$). Lowering $\eta$ during training lowers the floor, so the loss drops once more — the loss curve of a step schedule.`,
    note: R`The noise of real SGD changes size with $x$, but the conclusion “with a fixed learning rate a noise floor proportional to $\eta$ remains” has the same shape as the upper bound $\frac L2\eta G$ of Section 13.6. Section 13.6 gives an **upper** bound on the floor; this example shows a **lower** bound, that the floor really exists. The deterministic part (a) shows that the condition $\eta<2/\beta$ of the descent lemma cannot be improved (Example 5 of Section 13.4), and Unit 14 does the same analysis for each eigenvalue of a quadratic ($\eta<2/\lambda_{\max}$).` },
  'ch12-lrdecay': { title: 'Decaying Learning Rates and SGD Convergence: 1/t and 1/√t',
    stmt: R`Under the assumptions of the variable-step SGD theorem (Section 13.6) — $f$ is $L$-smooth with lower bound $f_*$, $\E[g_t\mid x_t]=\nabla f(x_t)$, $\E[\lVert g_t\rVert^2\mid x_t]\le G$ — let $\Delta=f(x_1)-f_*$ and $M_T=\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2$. (a) If $\sum_t\eta_t=\infty$ and $\sum_t\eta_t^2<\infty$, then $M_T\to0$ as $T\to\infty$. $\eta_t=c/t$ ($c>0$) satisfies this condition. (b) For the inverse square root schedule $\eta_t=c/\sqrt t$ and $T\ge2$,
$$M_T\le\frac{\Delta+\frac{LGc^2}2(1+\ln T)}{c\sqrt T}=O\Big(\frac{\ln T}{\sqrt T}\Big).$$`,
    body: R`
**1. Starting point.** With $S_1(T)=\sum_{t=1}^T\eta_t$ and $S_2(T)=\sum_{t=1}^T\eta_t^2$, the theorem of Section 13.6 reads
$$M_T\le\frac{\Delta+\frac{LG}2S_2(T)}{S_1(T)}$$
Now for each schedule it suffices to bound $S_1$ from below and $S_2$ from above.

**2. Convergence under condition (a).** If $\sum\eta_t^2<\infty$, then $S_2(T)\le S_2^\infty:=\sum_{t=1}^\infty\eta_t^2$ for every $T$, so
$$0\le M_T\le\frac{\Delta+\frac{LG}2S_2^\infty}{S_1(T)}.$$
The numerator is a constant independent of $T$ and $S_1(T)\to\infty$, so the right side goes to 0, and therefore $M_T\to0$.

**3. $\eta_t=c/t$ satisfies (a).** On $x\in[t,t+1]$, $\frac1t\ge\frac1x$; integrating gives $\frac1t\ge\int_t^{t+1}\frac{dx}x$, and summing, $\sum_{t=1}^T\frac1t\ge\int_1^{T+1}\frac{dx}x=\ln(T+1)\to\infty$. Also for $t\ge2$, $\frac1{t^2}\le\frac1{t(t-1)}=\frac1{t-1}-\frac1t$, and by telescoping
$$\sum_{t=1}^T\frac1{t^2}\le1+\Big(1-\frac1T\Big)<2.$$

**4. Integral comparison for the inverse square root (b).** A decreasing positive function $\phi$ satisfies $\phi\le\phi(t)$ on $[t,t+1]$ and $\phi\ge\phi(t)$ on $[t-1,t]$, so $\int_t^{t+1}\phi\le\phi(t)\le\int_{t-1}^t\phi$. The left inequality for $\phi(x)=x^{-1/2}$ gives
$$\sum_{t=1}^T\frac1{\sqrt t}\ge\int_1^{T+1}\frac{dx}{\sqrt x}=2\big(\sqrt{T+1}-1\big),$$
and the right inequality for $\phi(x)=\frac1x$, used for $t\ge2$, gives
$$\sum_{t=1}^T\frac1t\le1+\int_1^T\frac{dx}x=1+\ln T.$$
Hence $S_1(T)\ge2c\big(\sqrt{T+1}-1\big)$ and $S_2(T)=c^2\sum_t\frac1t\le c^2(1+\ln T)$.

**5. Combine.** For $T\ge2$, $\sqrt{T+1}-1\ge\frac{\sqrt T}2$: this is $\sqrt{T+1}\ge1+\frac{\sqrt T}2$, and since both sides are positive, squaring gives $T+1\ge1+\sqrt T+\frac T4\iff\frac34T\ge\sqrt T\iff\sqrt T\ge\frac43$, while $\sqrt2>\frac43$. Therefore $S_1(T)\ge c\sqrt T$, and putting this and the bound on $S_2$ from 4 into 1 gives the formula in (b). Finally, $\frac{1+\ln T}{\sqrt T}\to0$, so $M_T\to0$ in this case as well.`,
    note: R`Comparing the two schedules is instructive. $c/t$ satisfies the classical condition (a) (the Robbins–Monro conditions), so $M_T\to0$ is guaranteed, but with this bound $S_1\approx c\ln T$, giving a very slow $O(1/\ln T)$. $c/\sqrt t$ has $\sum\eta_t^2=\infty$ and does not satisfy (a), yet it is much faster, $O(\ln T/\sqrt T)$, only a log factor away from the $O(1/\sqrt T)$ of the fixed step $\eta=c/\sqrt T$ (Section 13.6), which needs $T$ fixed in advance. What is really needed is $S_1\to\infty$ (able to travel far) and $S_2/S_1\to0$ (noise accumulates more slowly than progress).` },
  'ch12-bnback': { title: 'Backpropagation Through Batch Normalization',
    stmt: R`For a minibatch $x_1,\dots,x_N$ of one feature let $\mu=\frac1N\sum_ix_i$, $\sigma^2=\frac1N\sum_i(x_i-\mu)^2$, $s=\sqrt{\sigma^2+\varepsilon}>0$, $\hat x_i=(x_i-\mu)/s$, $y_i=\gamma\hat x_i+\beta$, and let the loss $L$ depend on $x$ only through the BN output $y$. Then $\frac{\partial L}{\partial\gamma}=\sum_i\frac{\partial L}{\partial y_i}\hat x_i$, $\frac{\partial L}{\partial\beta}=\sum_i\frac{\partial L}{\partial y_i}$, $g_i:=\frac{\partial L}{\partial\hat x_i}=\gamma\frac{\partial L}{\partial y_i}$, and
$$\begin{aligned}\frac{\partial L}{\partial x_k}=\frac1s\Big(&g_k-\frac1N\sum_ig_i\\&-\hat x_k\cdot\frac1N\sum_ig_i\hat x_i\Big).\end{aligned}$$
Moreover $\sum_k\frac{\partial L}{\partial x_k}=0$, and if $\varepsilon=0$, $\sum_k\hat x_k\frac{\partial L}{\partial x_k}=0$. With several features, apply this to each feature (column) separately.`,
    body: R`
**1. Gradients of $\gamma$, $\beta$, $\hat x$.** From $y_i=\gamma\hat x_i+\beta$, $\frac{\partial y_i}{\partial\gamma}=\hat x_i$ and $\frac{\partial y_i}{\partial\beta}=1$, and since $\gamma,\beta$ are used by every $y_i$ in the batch (a copy gate), their gradients are summed over $i$. $\hat x_i$ enters only $y_i$, so $g_i=\frac{\partial L}{\partial y_i}\gamma$.

**2. Derivatives of the mean and the standard deviation.** $\frac{\partial\mu}{\partial x_k}=\frac1N$. For the variance, the chain rule and $\sum_i(x_i-\mu)=0$ give
$$\begin{aligned}\frac{\partial\sigma^2}{\partial x_k}&=\frac2N\sum_i(x_i-\mu)\Big(\mathbb 1[i=k]-\frac1N\Big)\\&=\frac2N(x_k-\mu),\end{aligned}$$
so $\frac{\partial s}{\partial x_k}=\frac1{2s}\cdot\frac2N(x_k-\mu)=\frac{\hat x_k}N$.

**3. The Jacobian of the normalization.** By the quotient rule,
$$\begin{aligned}\frac{\partial\hat x_i}{\partial x_k}&=\frac{\mathbb 1[i=k]-\frac1N}s-\frac{x_i-\mu}{s^2}\cdot\frac{\hat x_k}N\\&=\frac1s\Big(\mathbb 1[i=k]-\frac1N-\frac{\hat x_i\hat x_k}N\Big).\end{aligned}$$
$x_k$ enters $\hat x_k$ directly and, through $\mu$ and $s$, **every** $\hat x_i$ — the three terms in the parentheses are, in order, the direct path, the mean path and the variance path.

**4. Chain rule.** $L$ depends on $x$ only through $\hat x_1,\dots,\hat x_N$, so
$$\begin{aligned}\frac{\partial L}{\partial x_k}&=\sum_ig_i\frac{\partial\hat x_i}{\partial x_k}\\&=\frac1s\Big(g_k-\frac1N\sum_ig_i-\frac{\hat x_k}N\sum_ig_i\hat x_i\Big).\end{aligned}$$

**5. Two identities.** $\sum_k\hat x_k=\frac1s\sum_k(x_k-\mu)=0$, so
$$\sum_k\frac{\partial L}{\partial x_k}=\frac1s\Big(\sum_kg_k-\sum_ig_i-0\Big)=0.$$
Also $\sum_k\hat x_k^2=\frac{N\sigma^2}{s^2}$, so with $A:=\sum_ig_i\hat x_i$,
$$\begin{aligned}\sum_k\hat x_k\frac{\partial L}{\partial x_k}&=\frac1s\Big(A-0-\frac{\sigma^2}{s^2}A\Big)\\&=\frac As\cdot\frac\varepsilon{\sigma^2+\varepsilon},\end{aligned}$$
which is 0 when $\varepsilon=0$.`,
    note: R`The two identities of 5 say that the input gradient has no component along $\mathbf 1$ and (for $\varepsilon=0$) none along $\hat x$. The BN output does not change when the whole batch is shifted by the same amount ($x\to x+c\mathbf 1$) or stretched about its mean ($x-\mu\mathbf 1\to\kappa(x-\mu\mathbf 1)$, $\kappa>0$, $\varepsilon=0$), so the loss cannot be changed in those directions — the scale invariance of Section 12.5. A common mistake is to treat $\mu$ and $s$ as constants and write $\frac{\partial L}{\partial x_k}=\frac{g_k}s$, which drops the second and third terms of 3 (the mean and variance paths).` },

  // ───── 13
  'ch13-convex': { title: 'O(1/T) Convergence of GD for Convex Smooth Functions',
    stmt: R`Let $f:\mathbb R^d\to\mathbb R$ be differentiable, convex ($f(\theta x+(1-\theta)y)\le\theta f(x)+(1-\theta)f(y)$, $\theta\in[0,1]$) and $\beta$-smooth, with a minimizer $x^*$. GD with step size $0<\eta\le\frac1\beta$, $x_{t+1}=x_t-\eta\nabla f(x_t)$, satisfies for every $T\ge1$
$$f(x_T)-f(x^*)\le\frac{\lVert x_0-x^*\rVert^2}{2\eta T}$$
in particular $f(x_T)-f(x^*)\le\frac{\beta\lVert x_0-x^*\rVert^2}{2T}$ for $\eta=\frac1\beta$. Moreover $\lVert x_t-x^*\rVert$ does not increase with $t$.`,
    body: R`
**1. First-order condition for convex functions.** First we show that for all $x,y$
$$f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle$$
(the tangent plane lies below the graph). For $\theta\in(0,1]$, $x+\theta(y-x)=(1-\theta)x+\theta y$, so convexity gives $f(x+\theta(y-x))\le(1-\theta)f(x)+\theta f(y)$. Subtracting $f(x)$ from both sides and dividing by $\theta>0$,
$$\frac{f(x+\theta(y-x))-f(x)}\theta\le f(y)-f(x).$$
As $\theta\to0^+$ the left side tends to the directional derivative $\langle\nabla f(x),y-x\rangle$ ($f$ is differentiable), and the inequality survives the limit.

**2. Decrease per step.** Let $g_t:=\nabla f(x_t)$. By the decrease condition (Section 13.4), and since $\eta\le\frac1\beta$ gives $1-\frac{\beta\eta}2\ge\frac12$,
$$\begin{aligned}f(x_{t+1})&\le f(x_t)-\eta\Big(1-\frac{\beta\eta}2\Big)\lVert g_t\rVert^2\\&\le f(x_t)-\frac\eta2\lVert g_t\rVert^2.\end{aligned}$$
In particular $f(x_t)$ does not increase.

**3. Bound from above by convexity.** Putting $x=x_t$, $y=x^*$ in 1 gives $f(x_t)\le f(x^*)+\langle g_t,x_t-x^*\rangle$. Inserting this into 2,
$$f(x_{t+1})-f(x^*)\le\langle g_t,x_t-x^*\rangle-\frac\eta2\lVert g_t\rVert^2.$$

**4. Complete the square.** Squaring $x_{t+1}-x^*=(x_t-x^*)-\eta g_t$,
$$\begin{aligned}\lVert x_{t+1}-x^*\rVert^2=\lVert x_t-x^*\rVert^2&-2\eta\langle g_t,x_t-x^*\rangle\\&+\eta^2\lVert g_t\rVert^2.\end{aligned}$$
Rearranging and multiplying by $\frac1{2\eta}$ produces exactly the right side of 3:
$$\begin{aligned}&\langle g_t,x_t-x^*\rangle-\frac\eta2\lVert g_t\rVert^2\\&\quad=\frac{\lVert x_t-x^*\rVert^2-\lVert x_{t+1}-x^*\rVert^2}{2\eta}.\end{aligned}$$
Hence $f(x_{t+1})-f(x^*)\le\frac1{2\eta}\big(\lVert x_t-x^*\rVert^2-\lVert x_{t+1}-x^*\rVert^2\big)$. The left side is $\ge0$ because $x^*$ is a minimizer, so $\lVert x_{t+1}-x^*\rVert\le\lVert x_t-x^*\rVert$.

**5. Telescope.** Adding 4 over $t=0,\dots,T-1$, all the middle terms on the right cancel:
$$\begin{aligned}\sum_{t=1}^T\big(f(x_t)-f(x^*)\big)&\le\frac{\lVert x_0-x^*\rVert^2-\lVert x_T-x^*\rVert^2}{2\eta}\\&\le\frac{\lVert x_0-x^*\rVert^2}{2\eta}.\end{aligned}$$

**6. The last iterate.** By 2, $f(x_1)\ge f(x_2)\ge\cdots\ge f(x_T)$, so each of the $T$ terms on the left of 5 is at least $f(x_T)-f(x^*)$, and $T\big(f(x_T)-f(x^*)\big)\le\frac{\lVert x_0-x^*\rVert^2}{2\eta}$. Dividing by $T$ gives the result.`,
    note: R`Without convexity, as in Section 13.4, we could only say $\min_t\lVert\nabla f(x_t)\rVert^2=O(1/T)$ about the gradient; with convexity the function value itself approaches the minimum at rate $O(1/T)$. The key is 3 — convexity lets us bound “the gap between the current loss and the minimum” by an inner product of the gradient and the distance — and the completed square of 4 turns that inner product into a telescoping series of distances. If there are several minimizers the bound holds for any $x^*$, so one may use the minimizer closest to $x_0$. It is a theorem from Bubeck's book (Convex Optimization: Algorithms and Complexity), which the Week 5 notes recommended.` },
  'ch13-strong': { title: 'Linear Convergence of GD for Strongly Convex Functions',
    stmt: R`Let $f\in C^2(\mathbb R^d)$ with $\mu I\preceq\nabla^2f(x)\preceq\beta I$ for all $x$ ($0<\mu\le\beta$). With $f^*=\inf f$, GD with step size $\eta=\frac1\beta$ satisfies
$$f(x_T)-f^*\le\Big(1-\frac\mu\beta\Big)^T\big(f(x_0)-f^*\big)$$
Moreover $f$ has a unique minimizer $x^*$, and $\lVert x_T-x^*\rVert^2\le\frac2\mu\big(1-\frac\mu\beta\big)^T\big(f(x_0)-f^*\big)$.`,
    body: R`
**1. Quadratic lower bound.** The integral Taylor formula used to prove the descent lemma ($(*)$ of Section 13.3) reads, with $p=y-x$,
$$\begin{aligned}f(y)=f(x)&+\langle\nabla f(x),p\rangle\\&+\int_0^1(1-s)\,p^T\nabla^2f(x+sp)\,p\,ds\end{aligned}$$
This time use the lower bound $p^T\nabla^2f\,p\ge\mu\lVert p\rVert^2$, together with $1-s\ge0$ and $\int_0^1(1-s)\,ds=\frac12$:
$$f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle+\frac\mu2\lVert y-x\rVert^2.$$
(Using the upper bound $\beta$ instead gives the descent lemma.)

**2. The gradient bounds the gap to the optimum.** With $g=\nabla f(x)$, completing the square in $y$ on the right side of 1,
$$\begin{aligned}&f(x)+\langle g,y-x\rangle+\frac\mu2\lVert y-x\rVert^2\\&\quad=f(x)-\frac{\lVert g\rVert^2}{2\mu}+\frac\mu2\Big\lVert y-x+\frac g\mu\Big\rVert^2\\&\quad\ge f(x)-\frac{\lVert g\rVert^2}{2\mu}.\end{aligned}$$
So $f(y)\ge f(x)-\frac{\lVert\nabla f(x)\rVert^2}{2\mu}$ for every $y$, and taking the infimum over $y$, $f^*\ge f(x)-\frac{\lVert\nabla f(x)\rVert^2}{2\mu}$ (in particular $f^*>-\infty$), that is,
$$\lVert\nabla f(x)\rVert^2\ge2\mu\big(f(x)-f^*\big).$$
A small gradient means the function value is close to the minimum.

**3. Contraction per step.** Since $-\beta I\preceq\mu I\preceq\nabla^2f\preceq\beta I$, $f$ is $\beta$-smooth (Section 13.2). By the decrease condition with $\eta=\frac1\beta$ and by 2,
$$\begin{aligned}f(x_{t+1})&\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2\\&\le f(x_t)-\frac\mu\beta\big(f(x_t)-f^*\big).\end{aligned}$$
Subtracting $f^*$ from both sides, $f(x_{t+1})-f^*\le\big(1-\frac\mu\beta\big)\big(f(x_t)-f^*\big)$.

**4. Iterate.** Since $0\le1-\frac\mu\beta<1$ and $f(x_t)-f^*\ge0$, applying 3 for $t=0,\dots,T-1$ in turn (induction) gives $f(x_T)-f^*\le\big(1-\frac\mu\beta\big)^T\big(f(x_0)-f^*\big)$.

**5. The minimizer and the distance of the iterates.** Taking $x=0$ in 1, $f(y)\ge f(0)-\lVert\nabla f(0)\rVert\lVert y\rVert+\frac\mu2\lVert y\rVert^2\to\infty$ as $\lVert y\rVert\to\infty$, so $\{y:f(y)\le f(0)\}$ is a bounded closed set, on which the continuous $f$ attains a minimum. Outside it $f>f(0)$, so this is a global minimizer $x^*$, and $\nabla f(x^*)=0$. Putting $x=x^*$ in 1 gives $f(y)-f^*\ge\frac\mu2\lVert y-x^*\rVert^2$, so the minimizer is unique, and using this at $y=x_T$ together with 4 gives the distance bound.`,
    note: R`In terms of the condition number $\kappa=\beta/\mu$ the factor is $1-\frac1\kappa\le e^{-1/\kappa}$, so about $\kappa\ln\frac1\epsilon$ steps suffice to shrink the error by a factor $\epsilon$. This geometric (linear) convergence is much faster than the $O(1/T)$ of the merely convex case, but it slows down when $\kappa$ is large. For a quadratic $\frac12x^THx$, $\mu=\lambda_{\min}$ and $\beta=\lambda_{\max}$, which leads to the condition-number story of Unit 14. Steps 3–4 use only the inequality $\lVert\nabla f\rVert^2\ge2\mu(f-f^*)$ of 2, so any smooth function satisfying it (the PL condition, Polyak–Łojasiewicz), convex or not, gets the same rate.` },
  });
})();
