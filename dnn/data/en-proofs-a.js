/* English text — proofs, Part A: 01 linear regression, 02 probability and estimation, 03 information theory, 04 probabilistic regression and kernels. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 01
  'ch01-vecgrad': { title: 'Two Formulas of Vector Calculus',
    stmt: R`If $\beta,m\in\mathbb R^p$ and $A\in\mathbb R^{p\times p}$, then $\nabla_\beta(\beta^Tm)=m$ and $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$. In particular, $2A\beta$ if $A$ is symmetric.`,
    body: R`
Use the fact that the $k$-th component of the gradient is $\partial/\partial\beta_k$, and compute in components. The Kronecker delta is $\delta_{ik}=\partial\beta_i/\partial\beta_k$ (1 if $i=k$, 0 otherwise).

**(a)** Since $\beta^Tm=\sum_i\beta_im_i$, $\dfrac{\partial}{\partial\beta_k}\beta^Tm=\sum_i\delta_{ik}m_i=m_k$. Collecting over all $k$ gives $\nabla_\beta(\beta^Tm)=m$. Since $m^T\beta=\beta^Tm$ (a scalar), the result is the same.

**(b)** $\beta^TA\beta=\sum_{i=1}^p\sum_{j=1}^p\beta_iA_{ij}\beta_j$. By the product rule,
$$\frac{\partial}{\partial\beta_k}\beta^TA\beta=\sum_{i,j}\big(\delta_{ik}A_{ij}\beta_j+\beta_iA_{ij}\delta_{jk}\big)=\sum_jA_{kj}\beta_j+\sum_iA_{ik}\beta_i=(A\beta)_k+(A^T\beta)_k.$$
As explained in the notes, the first sum comes from “the terms with $i=k$” and the second from “the terms with $j=k$”. The derivative $2A_{kk}\beta_k$ of the term $A_{kk}\beta_k^2$ with $i=j=k$ enters each of the two sums once as $A_{kk}\beta_k$, so nothing is missed or double-counted. Hence
$$\nabla_\beta(\beta^TA\beta)=A\beta+A^T\beta=(A+A^T)\beta.$$
If $A^T=A$, it is $2A\beta$.`,
    note: R`In the normal equations $A=X^TX$ is symmetric, so we use $2X^TX\beta$. Using $2A\beta$ for a nonsymmetric $A$ is a common mistake. Since $\beta^TA\beta=\beta^T\frac{A+A^T}2\beta$, for a quadratic form it is always enough to remember the symmetric part.` },
  'ch01-normal': { title: 'The Normal Equations and the Least-Squares Solution',
    stmt: R`A minimizer of $f(\beta)=\lVert y-X\beta\rVert^2$ satisfies $X^TX\beta=X^Ty$. If the columns of $X$ are linearly independent, the minimizer $\hat\beta=(X^TX)^{-1}X^Ty$ is unique.`,
    body: R`
**1. Expand.** By the transpose rule $(y-X\beta)^T=y^T-\beta^TX^T$,
$$f(\beta)=y^Ty-y^TX\beta-\beta^TX^Ty+\beta^TX^TX\beta.$$
$y^TX\beta$ is $1\times1$, so it equals its own transpose: $y^TX\beta=(y^TX\beta)^T=\beta^TX^Ty$. Hence $f(\beta)=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$.

**2. Differentiate.** In the vector calculus formulas, set $m=X^Ty$ and $A=X^TX$ ($A^T=X^T(X^T)^T=X^TX$ is symmetric):
$$\nabla f(\beta)=0-2X^Ty+2X^TX\beta=-2X^T(y-X\beta).$$

**3. Stationary point.** $\nabla f=0\iff X^TX\beta=X^Ty$ (the normal equations).

**4. It is a minimizer.** $f$ is quadratic in $\beta$, so for any $\beta,\ v$, exactly
$$f(\beta+v)=f(\beta)+\nabla f(\beta)^Tv+v^TX^TXv=f(\beta)+\nabla f(\beta)^Tv+\lVert Xv\rVert^2.$$
At a solution $\hat\beta$ of the normal equations, $\nabla f(\hat\beta)=0$, so $f(\hat\beta+v)=f(\hat\beta)+\lVert Xv\rVert^2\ge f(\hat\beta)$. Hence $\hat\beta$ is a global minimizer (the same as saying that $f$ is convex since the Hessian $2X^TX\succeq0$).

**5. Uniqueness.** If the columns of $X$ are linearly independent, $v\ne0\Rightarrow Xv\ne0$, so $f(\hat\beta+v)>f(\hat\beta)$ and the minimizer is unique. Also $X^TXv=0\Rightarrow v^TX^TXv=\lVert Xv\rVert^2=0\Rightarrow v=0$, so $X^TX$ is invertible and $\hat\beta=(X^TX)^{-1}X^Ty$.`,
    note: R`If the columns are linearly dependent, the normal equations have infinitely many solutions, all with the same minimum value ($f$ does not change along directions with $Xv=0$ in the formula of step 4). Adding a ridge regularizer $\lambda>0$ then makes the solution unique.` },
  'ch01-projection': { title: 'Orthogonality of the Residual and Orthogonal Projection',
    stmt: R`At the least-squares solution $\hat\beta$, the residual $r=y-X\hat\beta$ is orthogonal to every column of $X$; if the columns are linearly independent, $H=X(X^TX)^{-1}X^T$ is a symmetric idempotent matrix and $X\hat\beta=Hy$ is the orthogonal projection of $y$ onto the column space.`,
    body: R`
The normal equations $X^TX\hat\beta=X^Ty$ say $X^T(y-X\hat\beta)=0$, i.e., $c_j^Tr=0$ for each column $c_j$ of $X$. For any element $Xv$ of the column space as well, $(Xv)^Tr=v^TX^Tr=0$.

$H^T=X\big((X^TX)^{-1}\big)^TX^T=X(X^TX)^{-1}X^T=H$ (the inverse of a symmetric matrix is symmetric). $H^2=X(X^TX)^{-1}(X^TX)(X^TX)^{-1}X^T=H$.

$\hat y=Hy$ lies in the column space and $y-\hat y\perp$ the column space, so by the Pythagorean theorem, for any $z$ in the column space, $\lVert y-z\rVert^2=\lVert y-\hat y\rVert^2+\lVert\hat y-z\rVert^2\ge\lVert y-\hat y\rVert^2$. This is also a geometric proof of least squares.`,
    note: R`With an intercept, the first column of $X$ is $\mathbf 1$, so $\mathbf 1^Tr=\sum_ir_i=0$: the least-squares residuals sum to 0.` },
  'ch01-gdpartial': { title: 'Partial Derivatives of the Sum of Squared Errors',
    stmt: R`If $f(\beta)=\sum_{i=1}^n\big(y_i-\sum_{j=0}^k\beta_jx_{ij}\big)^2$ ($x_{i0}=1$), then $\dfrac{\partial f}{\partial\beta_l}=-2\sum_{i=1}^n\big(y_i-\hat y_i\big)x_{il}$, and as a vector $\nabla f=-2X^T(y-X\beta)$.`,
    body: R`
Differentiate each term of the sum by the chain rule. With $e_i=y_i-\sum_j\beta_jx_{ij}$, $\partial e_i/\partial\beta_l=-x_{il}$, so
$$\frac{\partial}{\partial\beta_l}\sum_ie_i^2=\sum_i2e_i\frac{\partial e_i}{\partial\beta_l}=-2\sum_ie_ix_{il}.$$
Stacking $l=0,\dots,k$ vertically gives $-2\sum_ie_i(x_{i0},\dots,x_{ik})^T=-2X^Te$, $e=y-X\beta$. It is the same gradient as in the proof of the normal equations.

Gradient descent is $\beta\leftarrow\beta-\alpha\nabla f=\beta+2\alpha X^T(y-X\beta)$, and the slide absorbs the 2 into $\alpha$ and writes $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$.`,
    note: R`The gradient formula contains $\sum_{i=1}^n$, so one update needs the whole dataset. Using only the term of one point $i$ gives stochastic gradient descent (Unit 10).` },

  // ───── 02
  'ch02-axioms': { title: 'Deriving the Basic Properties from the Axioms of Probability',
    stmt: R`From the three axioms of probability, $P(\varnothing)=0$, $P(E^c)=1-P(E)$, $E\subset F\Rightarrow P(E)\le P(F)$, and $P(E\cup F)=P(E)+P(F)-P(E\cap F)$ hold.`,
    body: R`
**$P(\varnothing)=0$.** $E_1=\Omega$, $E_2=E_3=\cdots=\varnothing$ are mutually exclusive with union $\Omega$. Axiom 3 gives $P(\Omega)=P(\Omega)+\sum_{i\ge2}P(\varnothing)$. Since $P(\varnothing)\ge0$, for the infinite sum to be finite we need $P(\varnothing)=0$. (Hence Axiom 3 also holds for finitely many mutually exclusive events: fill the rest with $\varnothing$.)

**Complement.** $E$ and $E^c$ are mutually exclusive and $E\cup E^c=\Omega$, so $1=P(\Omega)=P(E)+P(E^c)$.

**Monotonicity.** If $E\subset F$, then $F=E\cup(F\setminus E)$ (mutually exclusive), so $P(F)=P(E)+P(F\setminus E)\ge P(E)$.

**Inclusion–exclusion.** $E\cup F=E\cup(F\setminus E)$ and $F=(E\cap F)\cup(F\setminus E)$ are both disjoint decompositions.
$$P(E\cup F)=P(E)+P(F\setminus E),\qquad P(F)=P(E\cap F)+P(F\setminus E).$$
Subtracting the two gives $P(E\cup F)-P(F)=P(E)-P(E\cap F)$.`,
    note: R`$P(E)\le1$ in Axiom 1 actually also follows from the other axioms and the complement property: $P(E)=1-P(E^c)\le1$.` },
  'ch02-continuity': { title: 'Continuity of Probability',
    stmt: R`If $E_1\subset E_2\subset\cdots$, then $P\big(\bigcup_nE_n\big)=\lim_{n\to\infty}P(E_n)$. If $E_1\supset E_2\supset\cdots$, then $P\big(\bigcap_nE_n\big)=\lim_{n\to\infty}P(E_n)$.`,
    body: R`
**The increasing case.** Let $F_1=E_1$ and $F_n=E_n\setminus E_{n-1}$ ($n\ge2$); the $F_n$ are mutually exclusive, $\bigcup_{i=1}^nF_i=E_n$, and $\bigcup_iF_i=\bigcup_iE_i$. By Axiom 3,
$$P\Big(\bigcup_iE_i\Big)=\sum_{i=1}^\infty P(F_i)=\lim_{n\to\infty}\sum_{i=1}^nP(F_i)=\lim_{n\to\infty}P\Big(\bigcup_{i=1}^nF_i\Big)=\lim_{n\to\infty}P(E_n).$$

**The decreasing case.** $E_n^c$ is an increasing sequence of events, and by De Morgan's law $\bigcup_nE_n^c=\big(\bigcap_nE_n\big)^c$. By the previous result and the complement property,
$$1-P\Big(\bigcap_nE_n\Big)=P\Big(\bigcup_nE_n^c\Big)=\lim_nP(E_n^c)=1-\lim_nP(E_n).$$` },
  'ch02-bayes': { title: 'The Law of Total Probability and Bayes’ Theorem',
    stmt: R`If $\{E_i\}$ is a partition of $\Omega$ with $P(E_i)>0$, then $P(F)=\sum_iP(F\mid E_i)P(E_i)$, and when $P(F)>0$, $P(E_i\mid F)=\dfrac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$.`,
    body: R`
$F=F\cap\Omega=\bigcup_i(F\cap E_i)$ and the $F\cap E_i$ are mutually exclusive, so by Axiom 3 $P(F)=\sum_iP(F\cap E_i)$. Substituting the definition of conditional probability $P(F\cap E_i)=P(F\mid E_i)P(E_i)$ gives the law of total probability.

Writing the definition of conditional probability in both directions, $P(E_i\cap F)=P(E_i\mid F)P(F)=P(F\mid E_i)P(E_i)$. Dividing by $P(F)$ and using the law of total probability in the denominator gives Bayes' theorem.`,
    note: R`The cough–cold example from class: $P(Y{=}1\mid X{=}1)=\frac{0.8\cdot0.1}{0.8\cdot0.1+0.2\cdot0.9}=\frac{0.08}{0.26}\approx0.308$.` },
  'ch02-bernmle': { title: 'Maximum Likelihood Estimation of the Bernoulli Distribution',
    stmt: R`If $x_1,\dots,x_n\in\{0,1\}$ come i.i.d. from $\operatorname{Bern}(\theta)$ and $S=\sum_ix_i$, then $\hat\theta_{\text{MLE}}=S/n$.`,
    body: R`
**Likelihood.** $p(x\mid\theta)=\theta^x(1-\theta)^{1-x}$ ($\theta$ if $x=1$, $1-\theta$ if $x=0$), so by independence
$$L(\theta)=P\{X_1=x_1,\dots,X_n=x_n\mid\theta\}=\prod_{i=1}^n\theta^{x_i}(1-\theta)^{1-x_i}=\theta^{S}(1-\theta)^{n-S}.$$

**$0<S<n$.** On $0<\theta<1$, $\ell(\theta)=\log L=S\log\theta+(n-S)\log(1-\theta)$.
$$\ell'(\theta)=\frac S\theta-\frac{n-S}{1-\theta}=0\iff S(1-\theta)=(n-S)\theta\iff S=n\theta.$$
$\ell''(\theta)=-\dfrac S{\theta^2}-\dfrac{n-S}{(1-\theta)^2}<0$, so $\ell$ is strictly concave and the stationary point $\theta=S/n$ is the unique maximizer. At the boundary, $\ell\to-\infty$ as $\theta\to0^+$ or $1^-$, so the maximizer is in the interior.

**$S=0$ or $S=n$.** $L=(1-\theta)^n$ is decreasing and $L=\theta^n$ increasing, so the maximizers are $0$ and $1$ respectively — again $S/n$.`,
    note: R`This estimator is unbiased: $E[S/n]=\theta$. But when $n$ is small, extreme values such as 0 or 1 come out easily, so MAP and Bayesian estimation with a prior are needed.` },
  'ch02-betapost': { title: 'The Bernoulli Likelihood and the Beta Posterior',
    stmt: R`With Bernoulli data of $S$ successes and $n-S$ failures and prior $\operatorname{Beta}(a,b)$, the posterior is $\operatorname{Beta}(a+S,\,b+n-S)$. In particular, with the uniform prior ($a=b=1$) it is $\operatorname{Beta}(S+1,n-S+1)$:
$$p(\theta\mid D)=\frac{\Gamma(n+2)}{\Gamma(S+1)\Gamma(n-S+1)}\theta^S(1-\theta)^{n-S}.$$`,
    body: R`
In Bayes' theorem $p(\theta\mid D)=\dfrac{p(D\mid\theta)p(\theta)}{\int_0^1p(D\mid t)p(t)\,dt}$, the numerator is
$$p(D\mid\theta)p(\theta)=\theta^S(1-\theta)^{n-S}\cdot\frac{\theta^{a-1}(1-\theta)^{b-1}}{B(a,b)}=\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a,b)}.$$
The denominator is the same expression integrated over $[0,1]$, and by the definition of the beta function $B(\alpha,\beta)=\int_0^1t^{\alpha-1}(1-t)^{\beta-1}dt$,
$$\int_0^1p(D\mid t)p(t)\,dt=\frac{B(a+S,\,b+n-S)}{B(a,b)}.$$
Dividing, $B(a,b)$ cancels:
$$p(\theta\mid D)=\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a+S,\,b+n-S)}=\operatorname{Beta}(\theta\mid a+S,\,b+n-S).$$
With the uniform prior $p(\theta)=1$ ($=\operatorname{Beta}(1,1)$, $B(1,1)=1$), as in the notes $Z=B(S+1,n-S+1)=\dfrac{\Gamma(S+1)\Gamma(n-S+1)}{\Gamma(n+2)}$, and the result follows.`,
    note: R`$B(\alpha,\beta)=\frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}$ is accepted as a theorem (proved by writing the product of gamma functions as a double integral and changing variables). For integers $\Gamma(m)=(m-1)!$, so $B(S+1,n-S+1)=\frac{S!(n-S)!}{(n+1)!}$.` },
  'ch02-mapl2': { title: 'MAP Minimizes the Sum of the Likelihood Term and a Regularizer',
    stmt: R`$\hat\theta_{\text{MAP}}=\argmin_\theta\big[-\log p(x\mid\theta)-\log p(\theta)\big]$. If the prior is $\N(0,\tau^2I_d)$, the regularization term is $\frac1{2\tau^2}\lVert\theta\rVert_2^2$ (+ a constant).`,
    body: R`
**1. Removing the evidence.** Bayes' theorem $p(\theta\mid x)=\dfrac{p(x\mid\theta)p(\theta)}{p(x)}$ (notes: since $p(\theta,x)=p(x\mid\theta)p(\theta)$, $p(\theta\mid x)=p(\theta,x)/p(x)$). $p(x)>0$ is a positive number independent of $\theta$, so $\argmax_\theta p(\theta\mid x)=\argmax_\theta p(x\mid\theta)p(\theta)$.

**2. Monotone transformation.** For a strictly increasing function $g$, $\argmax_\theta h(\theta)=\argmax_\theta g(h(\theta))$. This is because $h(\theta_1)<h(\theta_2)\iff g(h(\theta_1))<g(h(\theta_2))$ (the example in the notes: $2x+5$). Using $g=\log$,
$$\hat\theta_{\text{MAP}}=\argmax_\theta\big[\log p(x\mid\theta)+\log p(\theta)\big]=\argmin_\theta\big[-\log p(x\mid\theta)-\log p(\theta)\big].$$
The first term is the data-fit loss (the negative log-likelihood), and the second is the regularizer.

**3. Gaussian prior.** $p(\theta)=(2\pi\tau^2)^{-d/2}\exp\big(-\lVert\theta\rVert_2^2/(2\tau^2)\big)$, so
$$-\log p(\theta)=\frac1{2\tau^2}\lVert\theta\rVert_2^2+\frac d2\log(2\pi\tau^2).$$
The second term is a constant independent of $\theta$ and drops out of the optimization, leaving only the $L_2$ regularizer $\frac1{2\tau^2}\lVert\theta\rVert_2^2$.`,
    note: R`The MLE is the MAP in the case where $-\log p(\theta)$ is constant (a uniform prior). A Laplace prior $p(\theta_j)\propto e^{-\lvert\theta_j\rvert/b}$ gives $L_1$ regularization (the lasso).` },
  'ch02-betamode': { title: 'The Mode of the Beta Distribution and the MAP of the Coin Example',
    stmt: R`If $a,b>1$, the mode of $\operatorname{Beta}(a,b)$ is $\frac{a-1}{a+b-2}$. Hence with prior $\operatorname{Beta}(a,b)$ and $S$ successes in $n$ trials, $\hat\theta_{\text{MAP}}=\frac{S+a-1}{n+a+b-2}$. With 7 heads in 10 tosses and prior $\operatorname{Beta}(2,2)$, $\hat\theta_{\text{MAP}}=\frac23$.`,
    body: R`
Maximize $g(\theta)=(a-1)\log\theta+(b-1)\log(1-\theta)$ (the log density without the constant) on $0<\theta<1$.
$$g'(\theta)=\frac{a-1}\theta-\frac{b-1}{1-\theta}=0\iff(a-1)(1-\theta)=(b-1)\theta\iff\theta=\frac{a-1}{a+b-2}.$$
If $a,b>1$, $g''=-\frac{a-1}{\theta^2}-\frac{b-1}{(1-\theta)^2}<0$, so it is a maximum.

The posterior is $\operatorname{Beta}(a+S,b+n-S)$, so its mode is $\frac{S+a-1}{n+a+b-2}$.
The example in the notes: $P(\theta\mid D)\propto\theta^7(1-\theta)^3\cdot\theta^{1}(1-\theta)^{1}=\theta^8(1-\theta)^4$, i.e., $\operatorname{Beta}(9,5)$, with mode $\frac{8}{12}=\frac23\approx0.667$. It is pulled from the MLE $0.7$ toward the prior's center $0.5$.` },

  // ───── 03
  'ch03-infoadd': { title: 'The Information of Independent Events Adds Up',
    stmt: R`Defining $h(x)=-\log p(x)$, if $X,Y$ are independent then $h_{X,Y}(x,y)=h_X(x)+h_Y(y)$.`,
    body: R`
With independence, $p_{X,Y}(x,y)=p_X(x)p_Y(y)$, and $\log$ turns products into sums, so
$$h_X(x)+h_Y(y)=-\log p_X(x)-\log p_Y(y)=-\log\big(p_X(x)p_Y(y)\big)=-\log p_{X,Y}(x,y)=h_{X,Y}(x,y).$$`,
    note: R`Conversely, the only functions on $(0,1]$ that are continuous, decreasing, and satisfy $h(pq)=h(p)+h(q)$ have the form $h(p)=-c\log p$ ($c>0$) (Cauchy's functional equation). That is why the definition of information contains a logarithm.` },
  'ch03-entropybound': { title: 'The Range of Entropy: 0 ≤ H(X) ≤ log K',
    stmt: R`For a discrete random variable with $K$ values, $0\le H(X)\le\log K$. The left equality holds when one value has probability 1, and the right equality for the uniform distribution.`,
    body: R`
**Lower bound.** If $0<p(x)\le1$, then $-\log p(x)\ge0$, so $H=\sum p(x)(-\log p(x))\ge0$. Equality holds when every term is 0, i.e., $p(x)=1$ at each $x$ with $p(x)>0$.

**Upper bound.** Let $u(x)=1/K$ (the uniform distribution) and use Theorem 1.
$$0\le\KL(p\Vert u)=\sum_xp(x)\log\frac{p(x)}{1/K}=\sum_xp(x)\log p(x)+\log K=-H(X)+\log K.$$
Hence $H(X)\le\log K$, with equality only when $p=u$.` },
  'ch03-chain': { title: 'The Chain Rule of Entropy',
    stmt: R`$H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$.`,
    body: R`
Since $p(x,y)=p(y\mid x)p(x)$ (where $p(x)>0$), $\log p(x,y)=\log p(y\mid x)+\log p(x)$. By linearity of expectation,
$$H(X,Y)=-\E_{X,Y}[\log p(Y\mid X)p(X)]=-\E_{X,Y}[\log p(Y\mid X)]-\E_{X,Y}[\log p(X)].$$
The first term is $H(Y\mid X)$ by definition. The second term is a function of $X$ alone, so $\sum_{x,y}p(x,y)\log p(x)=\sum_x\big(\sum_yp(x,y)\big)\log p(x)=\sum_xp(x)\log p(x)$, i.e., $-\E_{X,Y}[\log p(X)]=H(X)$. Swapping the roles gives the second equality.`,
    note: R`Generalized to $n$ variables, $H(X_1,\dots,X_n)=\sum_{i=1}^nH(X_i\mid X_1,\dots,X_{i-1})$.` },
  'ch03-jensen': { title: 'Jensen’s Inequality',
    stmt: R`If $\varphi$ is a convex function and $X$ is a random variable (with an expectation), then $\varphi(\E[X])\le\E[\varphi(X)]$. If $\varphi$ is strictly convex, equality holds only when $X$ is constant with probability 1.`,
    body: R`
Let $\mu=\E[X]$. A convex function has a **supporting line** at every point: there is a slope $c$ such that for all $t$
$$\varphi(t)\ge\varphi(\mu)+c(t-\mu).$$
(If it is differentiable, $c=\varphi'(\mu)$, and this inequality says “the graph of a convex function lies above its tangent”.) Putting $t=X$ and taking expectations,
$$\E[\varphi(X)]\ge\varphi(\mu)+c(\E[X]-\mu)=\varphi(\mu).$$

**Equality.** If $\varphi$ is strictly convex, the supporting-line inequality is strict for $t\ne\mu$. Since $\E[\varphi(X)-\varphi(\mu)-c(X-\mu)]=0$ and the quantity in the brackets is $\ge0$, it is 0 with probability 1, i.e., $X=\mu$ (with probability 1).`,
    note: R`For a finite probability distribution, $\varphi\big(\sum_i\lambda_ix_i\big)\le\sum_i\lambda_i\varphi(x_i)$ ($\lambda_i\ge0$, $\sum\lambda_i=1$), which can also be proved by induction from the definition of convexity $\varphi(\lambda a+(1-\lambda)b)\le\lambda\varphi(a)+(1-\lambda)\varphi(b)$. $\log$ is concave, so $\E[\log X]\le\log\E[X]$.` },
  'ch03-klnonneg': { title: 'The KL Divergence Is Nonnegative (Theorem 1)',
    stmt: R`For discrete distributions $p,q$, $\KL(p\Vert q)\ge0$, with equality only when $p(x)=q(x)$ for every $x$.`,
    body: R`
Let $E=\{x:p(x)>0\}$; the terms with $p(x)=0$ are 0 by convention, so
$$\KL(p\Vert q)=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}.$$
If $q(x)=0$ for some $x\in E$, then $\KL=+\infty>0$, so assume from now on that $q>0$ on $E$.

**The inequality.** $\{p(x)\}_{x\in E}$ is a probability distribution and $Z=q(X)/p(X)$ is a positive random variable on $E$. $-\log$ is strictly convex, so by Jensen's inequality
$$\begin{aligned}\KL(p\Vert q)&=\sum_{x\in E}p(x)\Big[-\log\frac{q(x)}{p(x)}\Big]\ \ge\ -\log\Big(\sum_{x\in E}p(x)\frac{q(x)}{p(x)}\Big)\\&=-\log\sum_{x\in E}q(x)\ \ge\ -\log1=0.\end{aligned}$$
The last inequality follows from $\sum_{x\in E}q(x)\le\sum_xq(x)=1$ and the fact that $-\log$ is decreasing.

**Equality.** Both inequalities must be equalities. The first gives, by strict convexity, $q(x)/p(x)=c$ (a constant, $x\in E$), and the second gives $\sum_{x\in E}q(x)=1$. Then
$$1=\sum_{x\in E}q(x)=c\sum_{x\in E}p(x)=c$$
so $q=p$ on $E$, and outside $E$, $\sum_{x\notin E}q(x)=1-1=0$, so $q=0=p$. Conversely, if $p=q$, every term is $\log1=0$.`,
    note: R`The notes wrote it in one line: “$q(x)/p(x)=c$ for all $x$, hence $1=\sum q=c\sum p=c$”. To be rigorous, keep track of the fact that the sums are taken only over $E$, and that the equality condition also needs $\sum_Eq=1$. For continuous distributions, replacing sums by integrals gives the same proof.` },
  'ch03-mi': { title: 'Mutual Information and Its Relation to Entropy',
    stmt: R`$I(X;Y)=\KL(p(x,y)\Vert p(x)p(y))=H(Y)-H(Y\mid X)=H(X)-H(X\mid Y)=H(X)+H(Y)-H(X,Y)$.`,
    body: R`
Where $p(x,y)>0$, $p(x,y)=p(y\mid x)p(x)$, so $\dfrac{p(x,y)}{p(x)p(y)}=\dfrac{p(y\mid x)}{p(y)}$.
$$I(X;Y)=\sum_{x,y}p(x,y)\log\frac{p(y\mid x)}{p(y)}=\E_{X,Y}\big[\log p(Y\mid X)\big]-\E_{X,Y}\big[\log p(Y)\big].$$
The first term is $-H(Y\mid X)$. The second term, by marginalization $\sum_xp(x,y)=p(y)$, is $\sum_yp(y)\log p(y)=-H(Y)$. Hence $I(X;Y)=H(Y)-H(Y\mid X)$.

The same computation with $p(x,y)=p(x\mid y)p(y)$ gives $I=H(X)-H(X\mid Y)$. Substituting the chain rule $H(X\mid Y)=H(X,Y)-H(Y)$ gives $I=H(X)+H(Y)-H(X,Y)$.`,
    note: R`$I$ is a KL divergence, so by Theorem 1 $I(X;Y)\ge0$, with equality only when $p(x,y)=p(x)p(y)$, i.e., independence. Hence $H(X\mid Y)\le H(X)$: conditioning reduces entropy (on average).` },
  'ch03-crossent': { title: 'Cross-Entropy = Entropy + KL',
    stmt: R`With $H_p(q)=-\E_p[\log q(X)]$, $H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$, with equality only when $p=q$.`,
    body: R`
On $E=\{x:p(x)>0\}$,
$$\KL(p\Vert q)=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}=-\sum_{x\in E}p(x)\log q(x)-\sum_{x\in E}p(x)\log\frac1{p(x)}=H_p(q)-H(p).$$
(Notes: $\KL=-\sum p\log\frac qp=-\sum p\log q-\sum p\log\frac1p$.) By Theorem 1 $\KL\ge0$, so $H_p(q)\ge H(p)$, with equality when $p=q$.`,
    note: R`In classification, if $p$ is a one-hot label, $H(p)=0$ and $H_p(q)=-\log q(\text{correct class})$. The negative log-likelihood of logistic and softmax regression is the sum of the per-sample cross-entropies.` },

  // ───── 04
  'ch04-lsemle': { title: 'With Gaussian Noise, Least Squares Is Maximum Likelihood',
    stmt: R`If $y_i=h_i(\beta)+\varepsilon_i$ with $\varepsilon_i\overset{iid}{\sim}\N(0,\sigma^2)$, then the MLE of $\beta$ is the minimizer of $\sum_i(y_i-h_i(\beta))^2$, and the MLE of $\sigma^2$ is $\frac1n\sum_i(y_i-h_i(\hat\beta))^2$.`,
    body: R`
By independence, the log-likelihood is the sum of the log densities of the terms.
$$\ell(\beta,\sigma)=\sum_{i=1}^n\log\Big[\frac1{\sqrt{2\pi}\sigma}e^{-(y_i-h_i(\beta))^2/(2\sigma^2)}\Big]=-n\log(\sqrt{2\pi}\sigma)-\frac1{2\sigma^2}\sum_{i=1}^n(y_i-h_i(\beta))^2.$$
**In $\beta$.** The first term does not depend on $\beta$ and the coefficient of the second term is $-\frac1{2\sigma^2}<0$, so maximizing $\ell$ is the same as minimizing $f(\beta)=\sum(y_i-h_i(\beta))^2$. This conclusion does not depend on the value of $\sigma$.

**In $\sigma^2$.** With $v=\sigma^2$, $\ell=-\frac n2\log(2\pi v)-\frac{f(\hat\beta)}{2v}$, and $\dfrac{\partial\ell}{\partial v}=-\dfrac n{2v}+\dfrac{f(\hat\beta)}{2v^2}=0$ gives $\hat v=f(\hat\beta)/n$. As $v\to0^+$ or $v\to\infty$, $\ell\to-\infty$ (when $f(\hat\beta)>0$), so it is a maximum.` },
  'ch04-ridge': { title: 'The Solution of Ridge Regression',
    stmt: R`If $\lambda>0$, the unique minimizer of $J(\beta)=\frac12\lVert y-X\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$ is $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$.`,
    body: R`
Expanding, $J=\frac12\big(y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta\big)+\frac\lambda2\beta^T\beta$. By the vector calculus formulas,
$$\nabla J=-X^Ty+X^TX\beta+\lambda\beta=(\lambda I+X^TX)\beta-X^Ty.$$
**Invertibility.** If $v\ne0$, $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$, so $\lambda I+X^TX$ is positive definite and invertible. Hence the solution of $\nabla J=0$ is the single $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$.

**Minimum.** $J(\hat\beta+v)=J(\hat\beta)+\nabla J(\hat\beta)^Tv+\frac12v^T(\lambda I+X^TX)v=J(\hat\beta)+\frac12\big(\lambda\lVert v\rVert^2+\lVert Xv\rVert^2\big)>J(\hat\beta)$ ($v\ne0$). It is the unique global minimizer.`,
    note: R`Writing the singular value decomposition $X=U\Sigma V^T$, $\hat\beta=\sum_j\frac{\sigma_j}{\sigma_j^2+\lambda}(u_j^Ty)v_j$. The coefficients along directions with small singular values shrink a lot (with $\lambda=0$ they explode as $1/\sigma_j$). This is what “coefficient shrinkage” really is.` },
  'ch04-pushthrough': { title: 'The Push-Through Identity',
    stmt: R`If $\varphi\in\mathbb R^{d\times n}$ and $\lambda>0$, then $(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$.`,
    body: R`
**1. Both matrices are invertible.** For $v\in\mathbb R^d\setminus\{0\}$, $v^T(\lambda I_d+\varphi\varphi^T)v=\lambda\lVert v\rVert^2+\lVert\varphi^Tv\rVert^2>0$. In the same way, for $u\in\mathbb R^n\setminus\{0\}$, $u^T(\lambda I_n+\varphi^T\varphi)u=\lambda\lVert u\rVert^2+\lVert\varphi u\rVert^2>0$. Positive definite matrices are invertible.

**2. The exchange relation.** By the distributive law,
$$(\lambda I_d+\varphi\varphi^T)\varphi=\lambda\varphi+\varphi\varphi^T\varphi=\varphi(\lambda I_n+\varphi^T\varphi).$$

**3. Multiply by the inverses.** Multiplying both sides on the left by $(\lambda I_d+\varphi\varphi^T)^{-1}$ and on the right by $(\lambda I_n+\varphi^T\varphi)^{-1}$,
$$\varphi(\lambda I_n+\varphi^T\varphi)^{-1}=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi.$$`,
    note: R`The notes set $A:=\lambda I+\varphi\varphi^T$ and wrote “$A\varphi=\varphi A\Rightarrow A^{-1}\varphi=\varphi A^{-1}$”, but the key point is that the $A$ on the two sides are two matrices of different sizes ($d\times d$ and $n\times n$). That is why **different** inverses are multiplied on the left and the right. Writing down the sizes prevents confusion.` },
  'ch04-kernelridge': { title: 'The Prediction Formula of Kernel Ridge Regression',
    stmt: R`The prediction built from the solution of the ridge problem in feature space, $J(\beta)=\frac12\lVert y-\varphi(X)^T\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$, is
$$f^*(x)=K(x,X)\big(\lambda I+K(X,X)\big)^{-1}y,$$
where $K(x,X)=\varphi(x)^T\varphi(X)$ and $K(X,X)=\varphi(X)^T\varphi(X)$. Solving with $\beta=\varphi(X)\alpha$ gives the same prediction with $\alpha^*=(K+\lambda I)^{-1}y$.`,
    body: R`
Abbreviate $\varphi=\varphi(X)$.

**Derivation 1 (push-through).** $J=\frac12(y-\varphi^T\beta)^T(y-\varphi^T\beta)+\frac\lambda2\beta^T\beta$. By the vector calculus formulas (with $\varphi^T$ in place of $X$),
$$\nabla_\beta J=-\varphi y+\varphi\varphi^T\beta+\lambda\beta=0\ \Rightarrow\ \beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y.$$
The last equality is the push-through identity. Hence $f^*(x)=\varphi(x)^T\beta^*=\varphi(x)^T\varphi\,(\lambda I+\varphi^T\varphi)^{-1}y=K(x,X)(\lambda I+K)^{-1}y$.

**Derivation 2 (substituting $\alpha$, notes).** If $\beta=\varphi\alpha$, then $\varphi^T\beta=K\alpha$ and $\beta^T\beta=\alpha^TK\alpha$, and $K$ is symmetric, so
$$J(\alpha)=\tfrac12\big(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha,\qquad \nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big).$$
If $\alpha^*=(K+\lambda I)^{-1}y$, the bracket is 0, so $\nabla_\alpha J=0$. Then $\beta^*=\varphi\alpha^*$ equals the solution of Derivation 1, and $f^*(x)=\varphi(x)^T\varphi\alpha^*=K(x,X)\alpha^*=\sum_{i=1}^n\alpha_i^*K(x,x_i)$.`,
    note: R`Why restricting $\beta$ to the column space of $\varphi(X)$ in Derivation 2 loses nothing: for any $\beta=\varphi\alpha+\beta_\perp$ ($\varphi^T\beta_\perp=0$), the error term does not depend on $\beta_\perp$ and $\lVert\beta\rVert^2=\lVert\varphi\alpha\rVert^2+\lVert\beta_\perp\rVert^2$, so $J$ is smaller with $\beta_\perp=0$. This is the simplest case of the representer theorem.` },
  'ch04-kernelex': { title: 'The Feature Map of the Polynomial Kernel and Positive Semidefiniteness of the Gram Matrix',
    stmt: R`For $x,z\in\mathbb R^2$, $(x^Tz)^2=\varphi(x)^T\varphi(z)$ with $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$. Also, the Gram matrix of any kernel $K(x,z)=\varphi(x)^T\varphi(z)$ is positive semidefinite.`,
    body: R`
**Polynomial kernel.** $(x^Tz)^2=(x_1z_1+x_2z_2)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2=(x_1^2)(z_1^2)+(x_2^2)(z_2^2)+(\sqrt2x_1x_2)(\sqrt2z_1z_2)=\varphi(x)^T\varphi(z)$.

**Gram matrix.** If $K_{ij}=\varphi(x_i)^T\varphi(x_j)$, then $K=\Phi^T\Phi$ ($\Phi=[\varphi(x_1)\cdots\varphi(x_n)]$). For any $c\in\mathbb R^n$,
$$c^TKc=\sum_{i,j}c_ic_j\varphi(x_i)^T\varphi(x_j)=\Big\lVert\sum_ic_i\varphi(x_i)\Big\rVert^2\ge0.$$
Hence if $\lambda>0$, $K+\lambda I\succ0$ and the inverse in kernel ridge always exists.`,
    note: R`The Gaussian kernel corresponds to an infinite-dimensional feature map (Taylor-expand the last factor of $e^{-\lVert x-z\rVert^2/2\sigma^2}=e^{-\lVert x\rVert^2/2\sigma^2}e^{-\lVert z\rVert^2/2\sigma^2}e^{x^Tz/\sigma^2}$). That is why the kernel trick, which never computes the features directly, is needed.` },
  });
})();
