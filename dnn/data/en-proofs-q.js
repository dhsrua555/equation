/* English text — proofs for Unit 23: Generative Models, W11 Mon notes (from maximum likelihood to KL) and W11 Wed notes
   (the ELBO by Jensen, the Gaussian decoder, the VAE objective, reparameterization), plus the autoregressive factorization, linear autoencoders and PCA,
   the ELBO gap and the closed-form Gaussian KL. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 23
  'ch23-autoreg': { title: 'The autoregressive factorization always holds and is normalized',
    stmt: R`Any distribution of $\mathbf x=(x_1,\dots,x_D)$ can be written as $p(\mathbf x)=\prod_{i=1}^Dp(x_i\mid\mathbf x_{<i})$ (where the conditioning marginals are positive). Conversely, if each $p_\theta(\cdot\mid\mathbf x_{<i})$ is a distribution over $x_i$, the product $p_\theta(\mathbf x)=\prod_ip_\theta(x_i\mid\mathbf x_{<i})$ is a distribution summing to $1$, and the log-likelihood $\log p_\theta(\mathbf x)=\sum_i\log p_\theta(x_i\mid\mathbf x_{<i})$ is computed exactly, with no normalizing constant.`,
    body: R`
**The product rule.** The definition of conditional probability, $p(a,b)=p(a)\,p(b\mid a)$, with $a=\mathbf x_{<k}$ and $b=x_k$ gives $p(\mathbf x_{\le k})=p(\mathbf x_{<k})\,p(x_k\mid\mathbf x_{<k})$. Applying it for $k=D,D-1,\dots,2$ in turn,
$$p(\mathbf x)=p(\mathbf x_{<D})\,p(x_D\mid\mathbf x_{<D})=p(\mathbf x_{<D-1})\,p(x_{D-1}\mid\mathbf x_{<D-1})\,p(x_D\mid\mathbf x_{<D})=\cdots=\prod_{i=1}^Dp(x_i\mid\mathbf x_{<i}),$$
where the first factor $p(x_1\mid\mathbf x_{<1})$ is $p(x_1)$. No assumption such as independence was used, so the factorization is an identity, not an approximation.

**Normalization.** Take discrete variables and sum from the last variable. $x_D$ appears only in the last factor and $\sum_{x_D}p_\theta(x_D\mid\mathbf x_{<D})=1$, so
$$\sum_{x_1,\dots,x_D}\prod_{i=1}^Dp_\theta(x_i\mid\mathbf x_{<i})=\sum_{x_1,\dots,x_{D-1}}\prod_{i=1}^{D-1}p_\theta(x_i\mid\mathbf x_{<i})\sum_{x_D}p_\theta(x_D\mid\mathbf x_{<D})=\sum_{x_1,\dots,x_{D-1}}\prod_{i=1}^{D-1}p_\theta(x_i\mid\mathbf x_{<i}).$$
Repeating this $D$ times leaves $1$, and for continuous variables the sums become integrals. So as long as each conditional is a normalized output such as a softmax, the whole product is automatically a distribution.

**The log-likelihood.** The log of a product is the sum of the logs, so $\log p_\theta(\mathbf x)=\sum_{i=1}^D\log p_\theta(x_i\mid\mathbf x_{<i})$, and each term is read off one network output. In training all of $\mathbf x_{<i}$ is given by the data, so the $D$ terms can be computed at once (with masked convolutions), but in generation $x_i$ must be drawn before the condition for $x_{i+1}$ is known, so the $D$ steps run one after another.`,
    note: R`The order is arbitrary. The product rule holds for any ordering of the variables, so raster order (top left to bottom right) is only a choice. The factorization itself is free, but the difficulty has not vanished; it has moved into the network that learns the conditionals $p(x_i\mid\mathbf x_{<i})$.` },
  'ch23-aepca': { title: 'The best reconstruction of a linear autoencoder is the projection onto the principal subspace',
    stmt: R`Let the data $\mathbf x_1,\dots,\mathbf x_N\in\mathbb R^D$ have $C=\frac1N\sum_i\mathbf x_i\mathbf x_i^T$ with eigenvalues $\lambda_1\ge\dots\ge\lambda_D\ge0$ and orthonormal eigenvectors $\mathbf e_1,\dots,\mathbf e_D$. The loss $\frac1N\sum_i\lVert\mathbf x_i-BA\mathbf x_i\rVert^2$ of a linear autoencoder $\hat{\mathbf x}=BA\mathbf x$ ($A\in\mathbb R^{d\times D}$, $B\in\mathbb R^{D\times d}$) with code dimension $d$ is at least $\lambda_{d+1}+\dots+\lambda_D$, and it equals this value for $U=[\mathbf e_1\ \cdots\ \mathbf e_d]$, $A=U^T$, $B=U$.`,
    body: R`
**Reconstruction is a projection.** Fix $B$. Whatever the code, the reconstruction $B\mathbf c$ lies in the column space $V$ of $B$ (dimension $\le d$), and the point of $V$ closest to $\mathbf x$ is the projection $P_V\mathbf x$. Let $U\in\mathbb R^{D\times d}$ ($U^TU=I_d$) be an orthonormal basis of a $d$-dimensional subspace containing $V$; projecting onto a larger space comes closer, so $\lVert\mathbf x-BA\mathbf x\rVert^2\ge\lVert\mathbf x-P_V\mathbf x\rVert^2\ge\lVert\mathbf x-UU^T\mathbf x\rVert^2$. Hence the loss is at least $\frac1N\sum_i\lVert\mathbf x_i-UU^T\mathbf x_i\rVert^2$ for some $U$.

**Pythagoras.** $UU^T\mathbf x$ and $\mathbf x-UU^T\mathbf x$ are orthogonal and $\lVert UU^T\mathbf x\rVert^2=\mathbf x^TUU^TUU^T\mathbf x=\lVert U^T\mathbf x\rVert^2$, so $\lVert\mathbf x-UU^T\mathbf x\rVert^2=\lVert\mathbf x\rVert^2-\lVert U^T\mathbf x\rVert^2$. Averaging, $\frac1N\sum_i\lVert U^T\mathbf x_i\rVert^2=\frac1N\sum_i\tr(U^T\mathbf x_i\mathbf x_i^TU)=\tr(U^TCU)$, so
$$\frac1N\sum_{i=1}^N\lVert\mathbf x_i-UU^T\mathbf x_i\rVert^2=\tr C-\tr(U^TCU)=\sum_{j=1}^D\lambda_j-\tr(U^TCU).$$

**As weights.** Substituting $C=\sum_j\lambda_j\mathbf e_j\mathbf e_j^T$ and setting $w_j=\lVert U^T\mathbf e_j\rVert^2$ gives $\tr(U^TCU)=\sum_j\lambda_j\lVert U^T\mathbf e_j\rVert^2=\sum_j\lambda_jw_j$. The weights have two properties. Since $UU^T$ is a projection, $w_j=\lVert UU^T\mathbf e_j\rVert^2\le\lVert\mathbf e_j\rVert^2=1$, and since the $\mathbf e_j$ form an orthonormal basis, $\sum_jw_j=\sum_j\lVert U^T\mathbf e_j\rVert^2=\lVert U^T\rVert_F^2=\tr(U^TU)=d$.

**The upper bound.** If $0\le w_j\le1$ and $\sum_jw_j=d$, then
$$\sum_j\lambda_jw_j-\sum_{j\le d}\lambda_j=\sum_{j\le d}\lambda_j(w_j-1)+\sum_{j>d}\lambda_jw_j\le\lambda_d\sum_{j\le d}(w_j-1)+\lambda_d\sum_{j>d}w_j=\lambda_d\Big(\sum_jw_j-d\Big)=0.$$
The first sum uses $w_j-1\le0$ and $\lambda_j\ge\lambda_d$, the second $w_j\ge0$ and $\lambda_j\le\lambda_d$. Therefore $\tr(U^TCU)\le\lambda_1+\dots+\lambda_d$ and the loss is at least $\lambda_{d+1}+\dots+\lambda_D$. For $U=[\mathbf e_1\ \cdots\ \mathbf e_d]$ we get $w_1=\dots=w_d=1$ and the other weights $0$, so equality holds, and $A=U^T$, $B=U$ produce exactly that reconstruction $UU^T\mathbf x$.`,
    note: R`For $d=1$ this becomes maximizing $\mathbf w^TC\mathbf w$, as computed in Section 23.3, and the answer is the eigenvector of the largest eigenvalue. A linear autoencoder only finds the same subspace as PCA, not necessarily the same basis (inserting an invertible $M^{-1}M$ between $A$ and $B$ leaves $BA$ unchanged). If the data mean is subtracted first, $C$ is the sample covariance and the sum of the discarded eigenvalues is the discarded variance. Shrinking along a curved manifold needs a nonlinear encoder and decoder.` },
  'ch23-mlekl': { title: 'Maximum likelihood estimation minimizes the KL divergence',
    stmt: R`Let the data $\mathbf x_1,\dots,\mathbf x_N$ be drawn independently from $p_{data}$, with $\E_{p_{data}}\lvert\log p_\theta(\mathbf x)\rvert<\infty$. (i) $H(p,q)=\KL(p\,\|\,q)+H(p)$, and (ii) $\KL(p\,\|\,q)\ge0$ with equality only when $p=q$. (iii) For each $\theta$, $\frac1N\sum_i\log p_\theta(\mathbf x_i)\to-H(p_{data},p_\theta)$, so with plenty of data the maximum likelihood estimate is close to $\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$.`,
    body: R`
**The average log-likelihood.** By independence the likelihood is the product $\prod_ip_\theta(\mathbf x_i)$. Since $\log$ is increasing and $\frac1N$ is a positive constant, neither changes the maximizer, so $\argmax_\theta\prod_ip_\theta(\mathbf x_i)=\argmax_\theta\frac1N\sum_i\log p_\theta(\mathbf x_i)$. For fixed $\theta$ the $\log p_\theta(\mathbf x_i)$ are independent, identically distributed random variables, so by the law of large numbers
$$\frac1N\sum_{i=1}^N\log p_\theta(\mathbf x_i)\ \longrightarrow\ \E_{p_{data}}[\log p_\theta(\mathbf x)]=-H(p_{data},p_\theta)\qquad(N\to\infty).$$

**Splitting the cross-entropy.** For discrete distributions (for continuous ones, replace sums by integrals),
$$H(p,q)=-\sum_xp(x)\log q(x)=\sum_xp(x)\log\frac{p(x)}{q(x)}-\sum_xp(x)\log p(x)=\KL(p\,\|\,q)+H(p).$$

**KL is nonnegative.** For $t>0$, $\log t\le t-1$, with equality only at $t=1$. Applying this to $t=q(x)/p(x)$ and summing only over $x$ with $p(x)>0$,
$$-\KL(p\,\|\,q)=\sum_{p(x)>0}p(x)\log\frac{q(x)}{p(x)}\le\sum_{p(x)>0}p(x)\Big(\frac{q(x)}{p(x)}-1\Big)=\sum_{p(x)>0}q(x)-1\le0.$$
Equality requires $q(x)=p(x)$ wherever $p(x)>0$ and $\sum_{p(x)>0}q(x)=1$, so $q=p$.

**Putting it together.** $H(p_{data})$ does not depend on $\theta$, so
$$\argmax_\theta\big(-H(p_{data},p_\theta)\big)=\argmin_\theta\big[\KL(p_{data}\,\|\,p_\theta)+H(p_{data})\big]=\argmin_\theta\KL(p_{data}\,\|\,p_\theta),$$
and if the model family contains $p_{data}$, then by (ii) the minimizer is $p_\theta=p_{data}$.`,
    note: R`“Close to” means that for each $\theta$ the average converges to the expectation. That the maximizer converges too (consistency of the maximum likelihood estimator) needs the stronger condition of uniform convergence in $\theta$ and is beyond this course. The direction also matters. $\KL(p_{data}\,\|\,p_\theta)$ heavily penalizes places where $p_{data}(\mathbf x)>0$ but $p_\theta(\mathbf x)\approx0$, so a model trained by maximum likelihood tries to cover every place where there is data.` },
  'ch23-elbo': { title: 'The ELBO from Jensen’s inequality',
    stmt: R`If $p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z>0$ and a density $q(\mathbf z)$ is positive wherever $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)>0$, then $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q(\mathbf z)\,\|\,p(\mathbf z))$. Any $q$ will do; the VAE uses a $q_\phi(\mathbf z\mid\mathbf x)$ that looks at $\mathbf x$.`,
    body: R`
**Jensen’s inequality.** $\log$ is concave, so its graph lies below its tangent lines. Using the tangent at $m>0$, $\log y\le\log m+\frac{y-m}m$ for every $y>0$. Plugging in a nonnegative random variable $Y$ with $\E[Y]>0$ and $m=\E[Y]$ and taking expectations (where $Y=0$, $\log Y=-\infty$ and the inequality still holds) gives $\E[\log Y]\le\log m+\frac{\E[Y]-m}m=\log\E[Y]$, that is, $\log\E[Y]\ge\E[\log Y]$.

**Multiply and divide.** The integrand is $0$ where $q(\mathbf z)=0$, so it suffices to integrate where $q(\mathbf z)>0$, and multiplying and dividing by $q$ there gives
$$p_\theta(\mathbf x)=\int q(\mathbf z)\,\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q(\mathbf z)}\,d\mathbf z=\E_q[Y],\qquad Y=\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q(\mathbf z)}.$$
$Y$ is a nonnegative random variable when $\mathbf z\sim q$, and $\E_q[Y]=p_\theta(\mathbf x)>0$.

**The lower bound.** By Jensen’s inequality and the properties of the log,
$$\log p_\theta(\mathbf x)=\log\E_q[Y]\ge\E_q[\log Y]=\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]+\E_q\Big[\log\frac{p(\mathbf z)}{q(\mathbf z)}\Big]=\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z)).$$
The last equality is the definition $\KL(q\,\|\,p)=\E_q[\log(q/p)]$.`,
    note: R`The notes multiplied and divided and went straight to Jensen’s inequality; here that inequality is also proved, with a tangent line. Equality in Jensen holds when $Y$ is constant (almost everywhere under $q$), that is, when $q(\mathbf z)\propto p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)$, so $q$ is the posterior. How loose the bound is gets computed exactly in the next proof.` },
  'ch23-elbogap': { title: 'The ELBO gap is the KL to the true posterior',
    stmt: R`Under the conditions of the previous proof, $\log p_\theta(\mathbf x)-\mathrm{ELBO}(q)=\KL(q(\mathbf z)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$. Hence equality in $\mathrm{ELBO}\le\log p_\theta(\mathbf x)$ holds only when $q$ is the posterior, and for fixed $\theta$, maximizing the ELBO over $q$ is the same as minimizing the KL to the posterior.`,
    body: R`
**Bayes’ rule.** If $p_\theta(\mathbf x)>0$, the definition of the posterior, $p_\theta(\mathbf z\mid\mathbf x)=p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/p_\theta(\mathbf x)$, gives $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)=p_\theta(\mathbf z\mid\mathbf x)\,p_\theta(\mathbf x)$.

**Rewriting the ELBO.** Substituting this into the previous proof’s $\mathrm{ELBO}=\E_q\big[\log\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q(\mathbf z)}\big]$,
$$\mathrm{ELBO}=\E_q\Big[\log p_\theta(\mathbf x)+\log\frac{p_\theta(\mathbf z\mid\mathbf x)}{q(\mathbf z)}\Big]=\log p_\theta(\mathbf x)-\KL(q(\mathbf z)\,\|\,p_\theta(\mathbf z\mid\mathbf x)).$$
$\log p_\theta(\mathbf x)$ is a constant that does not depend on $\mathbf z$, so it comes out of the expectation.

**Conclusion.** KL is nonnegative and zero only when the two distributions are equal (the third step of the maximum likelihood proof), so the gap is nonnegative and zero only when $q=p_\theta(\mathbf z\mid\mathbf x)$. For fixed $\theta$, $\log p_\theta(\mathbf x)$ does not depend on $q$, so $\argmax_q\mathrm{ELBO}=\argmin_q\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$. The VAE raises $\theta$ and $\phi$ together, so it raises the likelihood and tightens the bound at the same time.`,
    note: R`In the cover figure’s model $z\sim\N(0,1)$, $x\mid z\sim\N(z,1)$, $x=2$, the posterior is $\N(1,\frac12)$ and $\log p(x)=-\frac12\log(4\pi)-1\approx-2.27$. The ELBO of $q=\N(m,s^2)$ is $\log p(x)-\KL(\N(m,s^2)\,\|\,\N(1,\frac12))$, so every curve in the figure lies below this value, and only the top of the thick curve $s^2=\frac12$, at $m=1$, reaches it.` },
  'ch23-gaussdec': { title: 'The negative log-likelihood of a Gaussian decoder is a squared error',
    stmt: R`If $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I_D)$, then $-\log p_\theta(\mathbf x\mid\mathbf z)=\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$. With $\tau$ fixed, maximizing $\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]$ is the same as minimizing $\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$, and if $\tau^2$ is chosen too, the best value is $\tau^2=\frac1D\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$.`,
    body: R`
**The density.** With covariance $\tau^2I$, $\det(2\pi\tau^2I)=(2\pi\tau^2)^D$ and $(\tau^2I)^{-1}=I/\tau^2$, so the multivariate normal density is
$$p_\theta(\mathbf x\mid\mathbf z)=(2\pi\tau^2)^{-D/2}\exp\Big(-\frac{\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2}{2\tau^2}\Big).$$
Viewing it as a product of $D$ independent coordinates $\N(f_k,\tau^2)$ gives the same thing.

**The log.** Taking the negative log turns the constant factor into an added term and leaves only the exponent of the exponential, so $-\log p_\theta(\mathbf x\mid\mathbf z)=\frac D2\log(2\pi\tau^2)+\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$.

**Optimization.** Taking the expectation over $\mathbf z\sim q$ gives $\E_q[-\log p_\theta(\mathbf x\mid\mathbf z)]=\frac1{2\tau^2}\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$. With $\tau$ fixed the second term is a constant, and multiplying by the positive $\frac1{2\tau^2}$ does not move the minimizer, so maximizing the reconstruction term is minimizing the expected squared error.

**Choosing the variance.** Fix $E=\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2>0$ and look at $g(s)=\frac E{2s}+\frac D2\log s$ as a function of $s=\tau^2$: $g'(s)=\frac{Ds-E}{2s^2}$ is negative for $s<E/D$ and positive for $s>E/D$. So the minimizer is $s=E/D$, the mean squared error per coordinate.`,
    note: R`$\tau$ is the balance between the reconstruction term and the KL term. Multiplying the negative ELBO $\frac1{2\tau^2}\E_q\lVert\mathbf x-f_\theta\rVert^2+\KL$ by $2\tau^2$ gives $\E_q\lVert\mathbf x-f_\theta\rVert^2+2\tau^2\KL$: the smaller $\tau$, the weaker the KL and the closer to an autoencoder; the larger $\tau$, the more the codes stick to the prior and the blurrier the reconstructions. When pixels cluster at $0$ and $1$, a Bernoulli decoder replaces the Gaussian, and the reconstruction term becomes the binary cross-entropy.` },
  'ch23-gausskl': { title: 'The KL between a Gaussian and the standard normal',
    stmt: R`If $q=\N(\mu,\Sigma)$ ($\mu\in\mathbb R^d$, $\Sigma$ positive definite) and $p=\N(\mathbf 0,I_d)$, then $\KL(q\,\|\,p)=\frac12\big(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma\big)$. In one dimension $\KL(\N(\mu,\sigma^2)\,\|\,\N(0,1))=\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$, which is nonnegative and zero only for $\mu=0$, $\sigma^2=1$.`,
    body: R`
**1-D: the difference of log densities.** $q(z)=\frac1{\sqrt{2\pi\sigma^2}}e^{-(z-\mu)^2/(2\sigma^2)}$ and $p(z)=\frac1{\sqrt{2\pi}}e^{-z^2/2}$, so the $\sqrt{2\pi}$ cancels and
$$\log\frac{q(z)}{p(z)}=-\frac12\log\sigma^2-\frac{(z-\mu)^2}{2\sigma^2}+\frac{z^2}2.$$

**1-D: the expectation.** If $z\sim q$, then $\E[(z-\mu)^2]=\sigma^2$ and $\E[z^2]=\Var(z)+(\E z)^2=\sigma^2+\mu^2$. Therefore
$$\KL(q\,\|\,p)=\E_q\Big[\log\frac{q(z)}{p(z)}\Big]=-\frac12\log\sigma^2-\frac12+\frac{\sigma^2+\mu^2}2=\frac12\big(\sigma^2+\mu^2-1-\log\sigma^2\big).$$

**Diagonal covariance.** If $\Sigma=\diag(\sigma_1^2,\dots,\sigma_d^2)$, both $q$ and $p$ are products over coordinates, $q(\mathbf z)=\prod_kq_k(z_k)$ and $p(\mathbf z)=\prod_kp_k(z_k)$. Then $\log\frac qp=\sum_k\log\frac{q_k(z_k)}{p_k(z_k)}$, and the expectation of the $k$th term involves only $z_k\sim q_k$, so
$$\KL(q\,\|\,p)=\sum_{k=1}^d\KL(q_k\,\|\,p_k)=\frac12\sum_{k=1}^d\big(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2\big)=\frac12\big(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma\big).$$
This is because $\tr\Sigma=\sum_k\sigma_k^2$ and $\log\det\Sigma=\sum_k\log\sigma_k^2$.

**General covariance.** The same formula holds without the diagonal assumption. The normalizing constant $(2\pi)^{-d/2}$ cancels, so
$$\log\frac{q(\mathbf z)}{p(\mathbf z)}=-\frac12\log\det\Sigma-\frac12(\mathbf z-\mu)^T\Sigma^{-1}(\mathbf z-\mu)+\frac12\mathbf z^T\mathbf z,$$
and writing the quadratic forms as traces, $\E_q[(\mathbf z-\mu)^T\Sigma^{-1}(\mathbf z-\mu)]=\tr\big(\Sigma^{-1}\E_q[(\mathbf z-\mu)(\mathbf z-\mu)^T]\big)=\tr(\Sigma^{-1}\Sigma)=d$ and $\E_q[\mathbf z^T\mathbf z]=\tr\E_q[\mathbf z\mathbf z^T]=\tr(\Sigma+\mu\mu^T)=\tr\Sigma+\lVert\mu\rVert^2$. Adding the three gives $\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$.

**The minimum.** For $h(s)=s-1-\log s$ ($s>0$), the sign of $h'(s)=1-\frac1s$ changes from negative to positive at $s=1$, so $h(s)\ge h(1)=0$. The 1-D KL is $\frac12(h(\sigma^2)+\mu^2)\ge0$, zero only for $\sigma^2=1$, $\mu=0$. Also, as $\sigma^2\to0$, $-\log\sigma^2\to\infty$ and the KL grows without bound, so this term keeps the encoder from shrinking the variance to $0$ and becoming a deterministic autoencoder.`,
    note: R`This term is computed exactly, without samples, so in a VAE only the reconstruction term is estimated by Monte Carlo. For example, $\mu=2$, $\sigma^2=1$ gives $\frac12(1+4-1-0)=2$, and $\mu=0$, $\sigma^2=\frac12$ gives $\frac12(\frac12-1+\log2)\approx0.097$.` },
  'ch23-vaeloss': { title: 'The objective with the VAE assumptions plugged in',
    stmt: R`If $p(\mathbf z)=\N(\mathbf 0,I_d)$, $q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$, $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I_D)$ and $\tau$ is fixed, then maximizing $\sum_i\mathrm{ELBO}(\mathbf x_i)$ is the same as minimizing $\sum_i\big(\frac1{\tau^2}\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2+\tr\Sigma_\phi(\mathbf x_i)+\lVert\mu_\phi(\mathbf x_i)\rVert^2-\log\det\Sigma_\phi(\mathbf x_i)\big)$ (equation (3) in the notes).`,
    body: R`
**The negative ELBO.** The negative ELBO of one data point is $-\mathrm{ELBO}(\mathbf x)=\E_{q_\phi}[-\log p_\theta(\mathbf x\mid\mathbf z)]+\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$, and the sum of these over $i$ is minimized.

**The reconstruction term.** By the Gaussian decoder proof, $\E_{q_\phi}[-\log p_\theta(\mathbf x\mid\mathbf z)]=\frac1{2\tau^2}\E_{q_\phi}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$.

**The KL term.** Plugging $\mu=\mu_\phi(\mathbf x)$ and $\Sigma=\Sigma_\phi(\mathbf x)$ into the Gaussian KL proof gives $\KL=\frac12\big(\tr\Sigma_\phi(\mathbf x)+\lVert\mu_\phi(\mathbf x)\rVert^2-d-\log\det\Sigma_\phi(\mathbf x)\big)$.

**Collecting constants.** Adding the two and summing over $i$,
$$-\sum_{i=1}^N\mathrm{ELBO}(\mathbf x_i)=\frac12\sum_{i=1}^N\Big(\frac1{\tau^2}\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2+\tr\Sigma_\phi(\mathbf x_i)+\lVert\mu_\phi(\mathbf x_i)\rVert^2-\log\det\Sigma_\phi(\mathbf x_i)\Big)+N\Big(\frac D2\log(2\pi\tau^2)-\frac d2\Big).$$
The last term is a constant independent of $\theta$ and $\phi$, and multiplying by the positive $2$ does not change the minimizer, so it suffices to minimize equation (3).`,
    note: R`In practice $\Sigma_\phi=\diag(\sigma_\phi^2)$, and the encoder often outputs an unconstrained $\log\sigma_\phi^2$. Then the KL term is computed directly as $\frac12\sum_k(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$, and the remaining expectation $\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2$ is estimated from one sample using the reparameterization of the next proof.` },
  'ch23-reparam': { title: 'Reparameterization keeps the distribution and lets the gradient through',
    stmt: R`If $\varepsilon\sim\N(\mathbf 0,I_d)$, $\sigma_k>0$ and $\mathbf z=\mu+\sigma\odot\varepsilon$, then $\mathbf z\sim\N(\mu,\diag(\sigma^2))$, $\partial\mathbf z/\partial\mu=I$ and $\partial\mathbf z/\partial\sigma=\diag(\varepsilon)$. For differentiable $R$, if differentiation and expectation can be exchanged, then $\frac{\partial}{\partial\mu_k}\E_q[R(\mathbf z)]=\E_\varepsilon\big[\frac{\partial R}{\partial z_k}(\mathbf z)\big]$ and $\frac{\partial}{\partial\sigma_k}\E_q[R(\mathbf z)]=\E_\varepsilon\big[\frac{\partial R}{\partial z_k}(\mathbf z)\,\varepsilon_k\big]$, and the gradient computed from samples is an unbiased estimator of these.`,
    body: R`
**The same distribution.** Coordinatewise $z_k=\mu_k+\sigma_k\varepsilon_k$ with $\sigma_k>0$, so
$$P(z_k\le t)=P\Big(\varepsilon_k\le\frac{t-\mu_k}{\sigma_k}\Big)=\Phi\Big(\frac{t-\mu_k}{\sigma_k}\Big).$$
This is the cumulative distribution function of $\N(\mu_k,\sigma_k^2)$. The $\varepsilon_k$ are independent and $z_k$ is a function of $\varepsilon_k$ alone, so the $z_k$ are independent too, and therefore $\mathbf z\sim\N(\mu,\diag(\sigma^2))$.

**The Jacobian.** $\partial z_k/\partial\mu_l$ is $1$ for $k=l$ and $0$ otherwise, and $\partial z_k/\partial\sigma_l$ is $\varepsilon_k$ for $k=l$ and $0$ otherwise. So $\partial\mathbf z/\partial\mu=I$ and $\partial\mathbf z/\partial\sigma=\diag(\varepsilon)$.

**The gradient inside the expectation.** Since the distributions agree, $\E_q[R(\mathbf z)]=\E_\varepsilon[R(\mu+\sigma\odot\varepsilon)]$, and now the distribution of the expectation, $\N(\mathbf 0,I)$, does not depend on $\mu$ or $\sigma$. Moving the derivative inside the expectation and applying the chain rule with the Jacobian,
$$\frac{\partial}{\partial\mu_k}\E_q[R]=\E_\varepsilon\Big[\frac{\partial R}{\partial z_k}(\mathbf z)\Big],\qquad\frac{\partial}{\partial\sigma_k}\E_q[R]=\E_\varepsilon\Big[\frac{\partial R}{\partial z_k}(\mathbf z)\,\varepsilon_k\Big].$$
Reaching the encoder parameters $\phi$ takes one more chain rule, through $\mu_\phi$ and $\sigma_\phi$.

**Estimating from samples.** Draw $\varepsilon^{(1)},\dots,\varepsilon^{(L)}$ and set $\hat g=\frac1L\sum_l\nabla_{\mu,\sigma}R(\mu+\sigma\odot\varepsilon^{(l)})$; each term has the gradient above as its expectation, so $\E[\hat g]$ equals the true gradient. A VAE usually uses $L=1$.

**A check.** For $d=1$ and $R(z)=z^2$, $\E_q[R]=\mu^2+\sigma^2$, so the true gradient is $(2\mu,2\sigma)$. The formulas above give $\E[2z]=2\mu$ and $\E[2z\varepsilon]=\E[2(\mu+\sigma\varepsilon)\varepsilon]=2\mu\E[\varepsilon]+2\sigma\E[\varepsilon^2]=2\sigma$, the same.`,
    note: R`Drawing $\mathbf z$ without reparameterization treats $\mathbf z$ as a constant with respect to $\phi$, so the gradient of the reconstruction term never reaches the encoder: $\phi$ lives in the shape of the distribution, not in the sample. The score-function estimator $\nabla_\phi\E_q[R]=\E_q[R(\mathbf z)\nabla_\phi\log q_\phi(\mathbf z)]$ is an alternative, but its variance is large, so when $R$ is differentiable and the distribution can be written by a location and a scale, reparameterization is the standard.` },
  });
})();
