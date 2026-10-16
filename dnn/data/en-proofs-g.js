/* English text — proofs not in the lecture notes, Part G (Units 1–4: linear regression, probability and estimation,
   information theory, probabilistic regression, regularization and kernels) */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 01
  'ch01-simplels': { title: 'The Least-Squares Formulas of Simple Regression and the Centroid',
    stmt: R`(a) In linear regression with an intercept, $y=X\beta+\varepsilon$ (the first column of $X$ is $\mathbf 1=(1,\dots,1)^T$), a solution $\hat\beta$ of the normal equations satisfies $\hat\beta_0=\bar y-\sum_{j=1}^k\hat\beta_j\bar x_j$ ($\bar x_j=\frac1n\sum_ix_{ij}$). That is, the fitted line (plane) passes through the centroid $(\bar x_1,\dots,\bar x_k,\bar y)$.

(b) In simple regression ($k=1$), if the $x_i$ are not all equal ($S_{xx}>0$), the least-squares solution is unique and
$$\hat\beta_1=\frac{S_{xy}}{S_{xx}},\qquad\hat\beta_0=\bar y-\hat\beta_1\bar x,$$
where $S_{xy}=\sum_i(x_i-\bar x)(y_i-\bar y)$ and $S_{xx}=\sum_i(x_i-\bar x)^2$.`,
    body: R`
**(a) The first row of the normal equations.** The normal equations $X^TX\hat\beta=X^Ty$ are the same as $X^T(y-X\hat\beta)=0$, and their first component is the inner product of the residual with the first column $\mathbf 1$ of $X$:
$$\sum_{i=1}^n\Big(y_i-\hat\beta_0-\sum_{j=1}^k\hat\beta_jx_{ij}\Big)=0$$
Splitting the sum term by term gives $\sum_iy_i-n\hat\beta_0-\sum_j\hat\beta_j\sum_ix_{ij}=0$, and dividing by $n$ gives $\bar y-\hat\beta_0-\sum_j\hat\beta_j\bar x_j=0$. This is (a). Putting $x_j=\bar x_j$ into the fit $\hat y=\hat\beta_0+\sum_j\hat\beta_jx_j$ returns $\bar y$, so the fit passes through the centroid.

**(b) 1. Two equations.** For $k=1$ the two components of the normal equations (inner products of the residual with the columns $\mathbf 1$ and $x$) are:
$$\begin{aligned}n\beta_0+\beta_1\textstyle\sum_ix_i&=\textstyle\sum_iy_i\\\beta_0\textstyle\sum_ix_i+\beta_1\textstyle\sum_ix_i^2&=\textstyle\sum_ix_iy_i\end{aligned}$$
**2. Eliminate the intercept.** The first equation is the same as (a), so $\beta_0=\bar y-\beta_1\bar x$. Putting this and $\sum_ix_i=n\bar x$ into the second equation gives
$$(\bar y-\beta_1\bar x)\,n\bar x+\beta_1\textstyle\sum_ix_i^2=\sum_ix_iy_i$$
and rearranging, $\beta_1\big(\sum_ix_i^2-n\bar x^2\big)=\sum_ix_iy_i-n\bar x\bar y$.

**3. Deviation form.** Expanding, with $\sum_ix_i=n\bar x$ and $\sum_iy_i=n\bar y$,
$$\begin{aligned}S_{xx}&=\textstyle\sum_ix_i^2-2\bar x\sum_ix_i+n\bar x^2=\sum_ix_i^2-n\bar x^2\\S_{xy}&=\textstyle\sum_ix_iy_i-\bar x\sum_iy_i-\bar y\sum_ix_i+n\bar x\bar y\\&=\textstyle\sum_ix_iy_i-n\bar x\bar y\end{aligned}$$
so the equation of step 2 reads $\beta_1S_{xx}=S_{xy}$.

**4. Uniqueness.** If $S_{xx}>0$, then $\beta_1=S_{xy}/S_{xx}$ is determined uniquely, and then so is $\beta_0=\bar y-\beta_1\bar x$. Every minimizer satisfies the normal equations and every solution of the normal equations is a minimizer (Section 1.3), so this solution is the unique least-squares solution. $S_{xx}=0$ means that $x$ is a constant vector, i.e., the two columns $\mathbf 1$ and $x$ are proportional, so the condition $S_{xx}>0$ is the same as “the columns of $X$ are linearly independent”.`,
    note: R`In Example 3 of Section 1.3, $\bar x=1.5$, $\bar y=2.25$, $S_{xx}=5$, $S_{xy}=4.5$, so $\hat\beta_1=0.9$ and $\hat\beta_0=0.9$. $S_{xy}/S_{xx}$ is the sample covariance of $x$ and $y$ divided by the sample variance of $x$, so the slope is “the average change of $y$ per unit change of $x$”. A model without an intercept has no first row as in (a), so there is no guarantee that it passes through the centroid, nor that the residuals sum to zero (Example 4 of Section 1.3).` },
  'ch01-rsquared': { title: 'The Sum-of-Squares Decomposition and the Range of R²',
    stmt: R`Let the first column of the design matrix $X$ be $\mathbf 1=(1,\dots,1)^T$ (an intercept), let $\hat\beta$ solve the normal equations $X^TX\hat\beta=X^Ty$, and let $\hat y=X\hat\beta$, $r=y-\hat y$. If $S_{yy}=\sum_i(y_i-\bar y)^2>0$, then
$$S_{yy}=\mathrm{SSE}+S_{\hat y\hat y}$$
$$S_{\hat y\hat y}=\sum_{i=1}^n(\hat y_i-\bar y)^2$$
(with $\mathrm{SSE}=\sum_ir_i^2$). Hence $R^2=1-\frac{\mathrm{SSE}}{S_{yy}}=\frac{S_{\hat y\hat y}}{S_{yy}}$ and $0\le R^2\le1$. $R^2=1$ exactly when all residuals are 0, and $R^2=0$ exactly when $\hat y_i=\bar y$ for every $i$.`,
    body: R`
**1. The residuals sum to 0.** The normal equations say $X^T(y-X\hat\beta)=X^Tr=0$, i.e., every column of $X$ is orthogonal to $r$. The first column is $\mathbf 1$, so $\mathbf 1^Tr=\sum_ir_i=0$. Hence $\sum_i\hat y_i=\sum_iy_i-\sum_ir_i=\sum_iy_i$: the fitted values also have mean $\bar y$.

**2. The residual is also orthogonal to the fitted values.** $\hat y=X\hat\beta$ is a linear combination of the columns of $X$, so $\hat y^Tr=\hat\beta^TX^Tr=0$. Together with step 1, $\sum_i(\hat y_i-\bar y)r_i=\hat y^Tr-\bar y\,\mathbf 1^Tr=0$.

**3. Expand.** Squaring $y_i-\bar y=r_i+(\hat y_i-\bar y)$ and summing over $i$,
$$\begin{aligned}S_{yy}&=\sum_ir_i^2+2\sum_ir_i(\hat y_i-\bar y)\\&\quad+\sum_i(\hat y_i-\bar y)^2\end{aligned}$$
The cross term in the middle is 0 by step 2, so $S_{yy}=\mathrm{SSE}+S_{\hat y\hat y}$.

**4. The range.** Dividing by $S_{yy}>0$ gives $1=\frac{\mathrm{SSE}}{S_{yy}}+\frac{S_{\hat y\hat y}}{S_{yy}}$, i.e., $R^2=1-\frac{\mathrm{SSE}}{S_{yy}}=\frac{S_{\hat y\hat y}}{S_{yy}}$. Both fractions are ratios of sums of squares and so are nonnegative; therefore $R^2=\frac{S_{\hat y\hat y}}{S_{yy}}\ge0$ and $R^2=1-\frac{\mathrm{SSE}}{S_{yy}}\le1$.

**5. Equality.** $R^2=1\iff\mathrm{SSE}=0\iff$ every $r_i=0$ (a sum of nonnegative numbers is 0 only if every term is 0), i.e., all points lie on the fitted line (plane). $R^2=0\iff S_{\hat y\hat y}=0\iff\hat y_i=\bar y$ for every $i$, i.e., the least-squares model makes exactly the same predictions as the baseline.`,
    note: R`**The intercept is essential.** Step 1 came from $\mathbf 1$ being a column of $X$. Without an intercept the cross term can survive and $R^2$ can be negative. Example: fitting $y=\beta x$ to $x=(1,2,3)$, $y=(3,2,1)$ gives $\hat\beta=\frac{10}{14}=\frac57$, $\mathrm{SSE}=\frac{336}{49}\approx6.86$, $S_{yy}=2$, so $R^2\approx-2.43$ — worse than the baseline. With an intercept the baseline itself is among the candidates, as $\beta=(\bar y,0,\dots,0)^T$, so $\mathrm{SSE}\le S_{yy}$; this is another way to see $R^2\ge0$.

In Example 3 of Section 1.3, $S_{\hat y\hat y}=4.05$, $\mathrm{SSE}=0.70$, and the sum is $4.75=S_{yy}$. The “SSR = 16.5” on the slides means the sum of squared residuals, i.e., the SSE of this proof. Adding columns enlarges the set we minimize over, so the SSE goes down or stays the same and the training $R^2$ never decreases — which is why a model must not be chosen by $R^2$ alone (overfitting, Section 4.2).` },

  // ───── 02
  'ch02-varbias': { title: 'The Bias of the Variance MLE and Why We Divide by n−1',
    stmt: R`Let $X_1,\dots,X_n$ ($n\ge2$) be i.i.d. with $\E X_i=\mu$ and $\Var X_i=\sigma^2$. With $\bar X=\frac1n\sum_iX_i$ and $\hat\sigma^2=\frac1n\sum_i(X_i-\bar X)^2$ (the variance MLE for Gaussian data),
$$\E[\hat\sigma^2]=\frac{n-1}n\sigma^2.$$
Hence $s^2=\frac1{n-1}\sum_i(X_i-\bar X)^2$ is an unbiased estimator of $\sigma^2$. No normality assumption is needed.`,
    body: R`
**1. Rewrite around the true mean.** Splitting $X_i-\bar X=(X_i-\mu)-(\bar X-\mu)$, squaring and summing,
$$\begin{aligned}\sum_i(X_i-\bar X)^2&=\sum_i(X_i-\mu)^2-2(\bar X-\mu)\sum_i(X_i-\mu)\\&\quad+n(\bar X-\mu)^2\end{aligned}$$
Since $\sum_i(X_i-\mu)=n\bar X-n\mu=n(\bar X-\mu)$, the middle term is $-2n(\bar X-\mu)^2$, and we get
$$\sum_i(X_i-\bar X)^2=\sum_i(X_i-\mu)^2-n(\bar X-\mu)^2$$
**2. Expectations.** By linearity of expectation we compute term by term. $\E(X_i-\mu)^2=\Var X_i=\sigma^2$, and since $\E\bar X=\mu$, $\E(\bar X-\mu)^2=\Var\bar X=\frac{\sigma^2}n$ (by independence, a property from Section 2.3). Therefore
$$\E\sum_i(X_i-\bar X)^2=n\sigma^2-n\cdot\frac{\sigma^2}n=(n-1)\sigma^2.$$
**3. Conclusion.** Dividing by $n$ gives $\E\hat\sigma^2=\frac{n-1}n\sigma^2<\sigma^2$, so the MLE underestimates the variance on average (bias $-\sigma^2/n$). Dividing by $n-1$ gives $\E s^2=\sigma^2$. Independence was used only for $\Var\bar X=\sigma^2/n$, and normality was used nowhere.`,
    note: R`**Why it comes out small.** $\bar X$ is the $c$ that minimizes $\sum_i(X_i-c)^2$ (differentiate: $c=\bar X$). So the sum of squares around $\bar X$ is always at most the one around the true mean $\mu$, and the term $n(\bar X-\mu)^2$ of step 1 is exactly the difference. The values $\hat\sigma^2=2$ and $s^2=\frac83$ of Example 4 in Section 2.4 (data $2,4,4,6$) show this relation. In the regression of Section 4.1, $k+1$ coefficients are fitted to the data, so for the same reason the denominator becomes $n-k-1$ (here there is a single coefficient, $\mu$).` },
  'ch02-betamom': { title: 'Moments of the Beta Distribution and Comparing Two Posteriors',
    stmt: R`If $a,b>0$ and $\theta\sim\Beta(a,b)$ (density $\theta^{a-1}(1-\theta)^{b-1}/B(a,b)$, $0<\theta<1$), then for every natural number $m$
$$\E[\theta^m]=\frac{B(a+m,b)}{B(a,b)}=\prod_{j=0}^{m-1}\frac{a+j}{a+b+j},$$
and in particular $\E\theta=\frac a{a+b}$ and $\Var\theta=\frac{ab}{(a+b)^2(a+b+1)}$. Moreover, if $\theta_1\sim\Beta(a,b)$ and $\theta_2\sim\Beta(3,1)$ are independent, then $P(\theta_1>\theta_2)=\E[\theta_1^3]$, and for $(a,b)=(91,11)$ this equals $\frac{91}{102}\cdot\frac{92}{103}\cdot\frac{93}{104}\approx0.7126$.`,
    body: R`
**1. A moment is a ratio of Beta functions.** By the definition of the density,
$$\begin{aligned}\E[\theta^m]&=\int_0^1\theta^m\,\frac{\theta^{a-1}(1-\theta)^{b-1}}{B(a,b)}\,d\theta\\&=\frac{B(a+m,b)}{B(a,b)}\end{aligned}$$
because the integral in the numerator, $\int_0^1\theta^{a+m-1}(1-\theta)^{b-1}d\theta$, is $B(a+m,b)$ by the definition of the Beta function.

**2. The recursion.** Integrating by parts ($u=t^a$, $dv=(1-t)^{b-1}dt$, $v=-(1-t)^b/b$),
$$\begin{aligned}B(a+1,b)&=\Big[-\frac{t^a(1-t)^b}{b}\Big]_0^1\\&\quad+\frac ab\int_0^1t^{a-1}(1-t)^b\,dt\\&=\frac ab\,B(a,b+1)\end{aligned}$$
The boundary term vanishes because $t^a=0$ at $t=0$ ($a>0$) and $(1-t)^b=0$ at $t=1$ ($b>0$). On the other hand, multiplying the integrand by $1=t+(1-t)$ and splitting gives $B(a,b)=B(a+1,b)+B(a,b+1)=B(a+1,b)+\frac baB(a+1,b)$. Therefore
$$B(a+1,b)=\frac a{a+b}\,B(a,b).$$
**3. The product formula.** Applying step 2 in turn at $a,a+1,\dots,a+m-1$ (all positive), the ratios telescope:
$$\begin{aligned}\frac{B(a+m,b)}{B(a,b)}&=\prod_{j=0}^{m-1}\frac{B(a+j+1,b)}{B(a+j,b)}\\&=\prod_{j=0}^{m-1}\frac{a+j}{a+b+j}\end{aligned}$$
**4. Mean and variance.** $m=1$ gives $\E\theta=\frac a{a+b}$, and $m=2$ gives $\E\theta^2=\frac{a(a+1)}{(a+b)(a+b+1)}$. Therefore
$$\begin{aligned}\Var\theta&=\frac{a(a+1)}{(a+b)(a+b+1)}-\frac{a^2}{(a+b)^2}\\&=\frac{a\big[(a+1)(a+b)-a(a+b+1)\big]}{(a+b)^2(a+b+1)}\\&=\frac{ab}{(a+b)^2(a+b+1)}\end{aligned}$$
The bracket is $a^2+ab+a+b-a^2-ab-a=b$.

**5. The two sellers.** The density of $\theta_2\sim\Beta(3,1)$ is $\theta^2/B(3,1)=3\theta^2$ ($B(3,1)=\int_0^1t^2dt=\frac13$), and its CDF is $P(\theta_2\le t)=\int_0^t3s^2ds=t^3$ ($0\le t\le1$). By independence the joint density is the product of the two densities, so integrating first over $\theta_2$ at $\theta_1=t$ (the integrand is nonnegative, so we may choose the order of integration),
$$\begin{aligned}P(\theta_1>\theta_2)&=\int_0^1f_1(t)\,P(\theta_2<t)\,dt\\&=\int_0^1f_1(t)\,t^3\,dt=\E[\theta_1^3]\end{aligned}$$
Here $f_1$ is the density of $\theta_1$, and $P(\theta_2<t)=P(\theta_2\le t)$ because $\theta_2$ is continuous. For $(a,b)=(91,11)$, step 3 gives $\E[\theta_1^3]=\frac{91\cdot92\cdot93}{102\cdot103\cdot104}=\frac{778596}{1092624}\approx0.7126$.`,
    note: R`In the same way, if $\theta_2\sim\Beta(k,1)$, its CDF is $t^k$ and $P(\theta_1>\theta_2)=\E[\theta_1^k]$. The mean of step 4 is exactly what the posterior mean of Section 2.5 uses. With prior $\Beta(a,b)$ and $S$ successes in $n$ trials the posterior is $\Beta(a+S,b+n-S)$, so
$$\begin{aligned}\E[\theta\mid D]&=\frac{a+S}{a+b+n}\\&=\frac{a+b}{a+b+n}\cdot\frac a{a+b}+\frac n{a+b+n}\cdot\frac Sn\end{aligned}$$
— a weighted average of the prior mean and the MLE. The variance $\frac{ab}{(a+b)^2(a+b+1)}$ shrinks as $a+b$ grows, so the posterior of seller 1, who has many reviews, is much narrower: the standard deviation of $\Beta(91,11)$ is about $0.031$, that of $\Beta(3,1)$ about $0.194$.` },

  // ───── 03
  'ch03-logunique': { title: 'Why Information Content Must Be a Logarithm',
    stmt: R`If $h:(0,1]\to\mathbb R$ is continuous and $h(pq)=h(p)+h(q)$ for all $p,q\in(0,1]$, then with the constant $c=h(e^{-1})$
$$h(p)=-c\log p\qquad(0<p\le1).$$
If $h$ is decreasing (rarer events carry more information) and not constant, then $c>0$.`,
    body: R`
**1. Move to exponential coordinates.** For $t\ge0$ put $g(t)=h(e^{-t})$. Since $t\mapsto e^{-t}$ is a continuous bijection of $[0,\infty)$ onto $(0,1]$, $g$ is continuous on $[0,\infty)$, and with $p=e^{-t}$ we have $t=-\log p$, so $h(p)=g(-\log p)$. Products turn into sums:
$$\begin{aligned}g(s+t)&=h(e^{-s}e^{-t})=h(e^{-s})+h(e^{-t})\\&=g(s)+g(t)\end{aligned}$$
**2. Zero and natural numbers.** Putting $s=t=0$ gives $g(0)=2g(0)$, i.e., $g(0)=0$. Also $g(nt)=n\,g(t)$ ($n=1,2,\dots$) follows by induction: $g((n+1)t)=g(nt)+g(t)=n\,g(t)+g(t)$.

**3. Rationals.** For natural numbers $m,n$, using step 2 twice gives $n\,g(\tfrac mn)=g(m)=m\,g(1)$, so $g(\tfrac mn)=\tfrac mn\,g(1)$. Together with $g(0)=0$, $g(r)=c\,r$ for every nonnegative rational $r$, where $c:=g(1)$.

**4. Continuity.** For any $t\ge0$, $r_k=\lfloor kt\rfloor/k$ is a nonnegative rational with $\lvert r_k-t\rvert\le\frac1k$, so $r_k\to t$. Since $g$ is continuous, $g(t)=\lim_kg(r_k)=\lim_kc\,r_k=c\,t$.

**5. Change back.** $h(p)=g(-\log p)=-c\log p$ with $c=g(1)=h(e^{-1})$. In particular $h(1)=0$. If $h$ is decreasing, then $c=h(e^{-1})\ge h(1)=0$, and if $c=0$ then $h\equiv0$ is constant; so for a decreasing $h$ that is not constant, $c>0$.`,
    note: R`The constant $c$ amounts to choosing the base of the logarithm: $-c\log p=-\log_bp$ with $b=e^{1/c}$. $c=1/\log2$ gives bits and $c=1$ gives nats. Without continuity (or monotonicity), Cauchy's equation $g(s+t)=g(s)+g(t)$ also has bizarre nonlinear solutions, so step 4 is really needed. The additivity in the lecture notes (Section 3.1) is the direction “if $h=-\log p$, it is additive”; this theorem is the converse, “additive and continuous means logarithm only”.` },
  'ch03-cemle': { title: 'Minimizing Cross-Entropy = Maximum Likelihood = Minimizing KL',
    stmt: R`(a) Let $\hat p(x)=\frac1N\#\{i:x_i=x\}$ be the empirical distribution of discrete data $x_1,\dots,x_N$ and $q_\theta$ a model distribution. Then
$$\begin{aligned}-\frac1N\sum_{i=1}^N\log q_\theta(x_i)&=H_{\hat p}(q_\theta)\\&=H(\hat p)+\KL(\hat p\Vert q_\theta).\end{aligned}$$
Since $H(\hat p)$ does not depend on $\theta$, the $\theta$ that maximizes the likelihood, the $\theta$ that minimizes the cross-entropy and the $\theta$ that minimizes $\KL(\hat p\Vert q_\theta)$ are all the same.

(b) For classification data $(x_i,y_i)$ and a model $q_\theta(y\mid x)$, let $\hat p(x)$ be the empirical distribution of the inputs and $\hat p(y\mid x)$ the empirical label distribution of the samples with input $x$. Then
$$\begin{aligned}&-\frac1N\sum_{i=1}^N\log q_\theta(y_i\mid x_i)\\&=\sum_x\hat p(x)\,H_{\hat p(\cdot\mid x)}\big(q_\theta(\cdot\mid x)\big)\end{aligned}$$
holds.`,
    body: R`
**1. Group equal values.** In the sum $\sum_{i=1}^N\log q_\theta(x_i)$ there are $N\hat p(x)$ terms with value $x$, each equal to $\log q_\theta(x)$. Hence
$$\begin{aligned}-\frac1N\sum_{i=1}^N\log q_\theta(x_i)&=-\sum_x\hat p(x)\log q_\theta(x)\\&=H_{\hat p}(q_\theta)\end{aligned}$$
and the sum on the right is a finite sum over the $x$ with $\hat p(x)>0$ (those that occur in the data).

**2. Split into entropy and KL.** Applying the identity of Section 3.5 (cross-entropy = entropy + KL) with $p=\hat p$, $q=q_\theta$ gives $H_{\hat p}(q_\theta)=H(\hat p)+\KL(\hat p\Vert q_\theta)$. If $q_\theta(x_i)=0$ at some data point, both sides are $+\infty$.

**3. The optimizers coincide.** For the likelihood $L(\theta)=\prod_iq_\theta(x_i)$, $-\frac1N\log L(\theta)$ is the left side of step 1. Since $\log$ is increasing and $-\frac1N<0$, the maximizers of $L$ are the minimizers of the left side. By step 2 the left side is the $\theta$-independent constant $H(\hat p)$ plus $\KL(\hat p\Vert q_\theta)$, so the minimizers are the same. Even if there are several optimizers, the three problems have the same solution set.

**4. Conditional models.** The number of samples with input $x$ and label $y$ is $N\hat p(x)\hat p(y\mid x)$, so grouping as in step 1,
$$\begin{aligned}&-\frac1N\sum_i\log q_\theta(y_i\mid x_i)\\&=-\sum_x\hat p(x)\sum_y\hat p(y\mid x)\log q_\theta(y\mid x)\\&=\sum_x\hat p(x)\,H_{\hat p(\cdot\mid x)}\big(q_\theta(\cdot\mid x)\big)\end{aligned}$$
Applying step 2 for each $x$ gives $H(\hat p(\cdot\mid x))+\KL\big(\hat p(\cdot\mid x)\Vert q_\theta(\cdot\mid x)\big)$, and the entropies do not depend on $\theta$; so minimizing the average cross-entropy loss is minimizing a weighted average of per-input KLs, i.e., conditional maximum likelihood. If all inputs are distinct, $\hat p(\cdot\mid x_i)$ is the one-hot distribution that puts probability 1 on $y_i$, its entropy is 0, and the loss is the average of the per-sample $-\log q_\theta(y_i\mid x_i)$.`,
    note: R`Because of this result, the “cross-entropy loss”, the “negative log-likelihood” and “KL minimization” of a classification network all describe the same training (the losses of Units 5 and 6). Mind the direction: maximum likelihood minimizes $\KL(\hat p\Vert q_\theta)$ (data first, the forward KL), not $\KL(q_\theta\Vert\hat p)$. The latter is $+\infty$ as soon as $q_\theta$ puts even a little probability on a value that is not in the data. The statement in Section 2.4, “maximizing $\frac1n\ell(\theta)$ = minimizing a KL”, is (a).` },

  // ───── 04
  'ch04-sse': { title: 'The Expected Residual Sum of Squares and an Unbiased Estimator of the Noise Variance',
    stmt: R`In $y=X\beta+\varepsilon$ let $X\in\mathbb R^{n\times p}$ ($p=k+1<n$) be fixed with linearly independent columns, and let $\E\varepsilon=0$, $\Cov(\varepsilon)=\sigma^2I_n$ (i.e., $\E[\varepsilon_i\varepsilon_j]=\sigma^2\delta_{ij}$). With $\hat\beta=(X^TX)^{-1}X^Ty$ and $\mathrm{SSE}=\lVert y-X\hat\beta\rVert^2$,
$$\E[\mathrm{SSE}]=(n-p)\sigma^2.$$
Hence $\hat\sigma^2_{\text{MLE}}=\mathrm{SSE}/n$ is biased, $\E\hat\sigma^2_{\text{MLE}}=\frac{n-p}n\sigma^2$, and $\mathrm{SSE}/(n-k-1)$ is an unbiased estimator of $\sigma^2$. No normality assumption is needed.`,
    body: R`
**1. The residual is projected noise.** With $H=X(X^TX)^{-1}X^T$ we have $X\hat\beta=Hy$ and $HX=X$. Since $(I-H)X=X-X=0$,
$$r=y-Hy=(I-H)(X\beta+\varepsilon)=(I-H)\varepsilon.$$
The residual does not depend on the true $\beta$; it is determined by the noise alone.

**2. A quadratic form.** $H$ is symmetric with $H^2=H$ (Section 1.3, orthogonality of the residual and projection), so $I-H$ is also symmetric and $(I-H)^2=I-2H+H^2=I-H$. Therefore
$$\begin{aligned}\mathrm{SSE}=r^Tr&=\varepsilon^T(I-H)^T(I-H)\varepsilon\\&=\varepsilon^T(I-H)\varepsilon.\end{aligned}$$
**3. Expectation of a quadratic form.** For a fixed matrix $A\in\mathbb R^{n\times n}$, linearity of expectation and $\E[\varepsilon_i\varepsilon_j]=\sigma^2\delta_{ij}$ give
$$\begin{aligned}\E[\varepsilon^TA\varepsilon]&=\sum_{i,j}A_{ij}\E[\varepsilon_i\varepsilon_j]\\&=\sigma^2\sum_iA_{ii}=\sigma^2\tr A.\end{aligned}$$
**4. The trace.** Using $\tr(AB)=\tr(BA)$,
$$\begin{aligned}\tr H&=\tr\big(X(X^TX)^{-1}X^T\big)\\&=\tr\big((X^TX)^{-1}X^TX\big)=\tr I_p=p\end{aligned}$$
so $\tr(I-H)=n-p$, and step 3 with $A=I-H$ gives $\E[\mathrm{SSE}]=(n-p)\sigma^2$.

**5. The estimators.** Dividing by $n$ gives $\E\hat\sigma^2_{\text{MLE}}=\frac{n-p}n\sigma^2<\sigma^2$; dividing by $n-p=n-k-1$ gives expectation exactly $\sigma^2$. The only assumption used about the noise is $\E[\varepsilon\varepsilon^T]=\sigma^2I$ (step 3); normality is not needed.`,
    note: R`The unbiased estimate $0.70/(4-2)=0.35$ in Example 1 of Section 4.1 (4 points, 2 parameters, $\mathrm{SSE}=0.70$) is this result. For $X=\mathbf 1$ (a single column, $p=1$), $\hat\beta=\bar y$ and $\mathrm{SSE}=\sum_i(y_i-\bar y)^2$, which gives $\E\hat\sigma^2=\frac{n-1}n\sigma^2$ of Section 2.4. Intuitively, fitting $p$ parameters to the data confines the residual to an $(n-p)$-dimensional space (the orthogonal complement of the column space of $X$), so the share of the noise along $p$ of its $n$ directions disappears from the residual.` },
  'ch04-polyfit': { title: 'When the Polynomial Fit Is Unique, and Zero Training Error (the Vandermonde Matrix)',
    stmt: R`Let $x_1,\dots,x_n\in\mathbb R$ and let the $i$-th row of $X\in\mathbb R^{n\times(M+1)}$ be $(1,x_i,x_i^2,\dots,x_i^M)$.

(i) If the $x_i$ take at least $M+1$ distinct values, the columns of $X$ are linearly independent; hence $X^TX$ is invertible and the least-squares polynomial fit $\hat\beta=(X^TX)^{-1}X^Ty$ is unique. If they take at most $M$ distinct values, the columns are linearly dependent.

(ii) If the $x_i$ are all distinct and $M=n-1$, then $X$ is an invertible square matrix, and the polynomial with $\hat\beta=X^{-1}y$ passes through every point $(x_i,y_i)$, so the training error is 0.`,
    body: R`
**1. Combinations of columns = values of a polynomial.** For $v=(v_0,\dots,v_M)^T$ put $P_v(t)=v_0+v_1t+\dots+v_Mt^M$; then $(Xv)_i=\sum_jx_i^jv_j=P_v(x_i)$. So $Xv=0$ means “the polynomial $P_v$ vanishes at every $x_i$”.

**2. Counting roots.** A nonzero polynomial of degree at most $M$ has at most $M$ distinct roots. Indeed, by the factor theorem, if $z_1,\dots,z_r$ are distinct roots, then $(t-z_1)\cdots(t-z_r)$ divides $P_v$, so $r\le\deg P_v\le M$.

**3. (i) Independence.** If there are at least $M+1$ distinct values and $Xv=0$, then $P_v$ has at least $M+1$ distinct roots, so by step 2 $P_v$ is the zero polynomial, i.e., $v=0$. Hence the columns are linearly independent, and by the argument of Section 1.3, $X^TXv=0\Rightarrow\lVert Xv\rVert^2=v^TX^TXv=0\Rightarrow v=0$, so $X^TX$ is invertible and the least-squares solution is unique.

**4. (i) Dependence.** If the only distinct values are $z_1,\dots,z_r$ ($r\le M$), take $v$ to be the coefficients of the polynomial $(t-z_1)\cdots(t-z_r)$ (its degree $r\le M$ puts $v$ in $\mathbb R^{M+1}$, and its leading coefficient 1 makes $v\ne0$). Every $x_i$ equals some $z_l$, so $P_v(x_i)=0$, i.e., $Xv=0$.

**5. (ii) Interpolation.** If the $x_i$ are all distinct, there are $n=M+1$ distinct values, so by (i) the square matrix $X$ has linearly independent columns, i.e., $X$ is invertible. Then $X\beta=y$ is solved exactly by $\beta=X^{-1}y$, the residual is 0, and $f(X^{-1}y)=0$ is the minimum. The normal-equation solution agrees: $(X^TX)^{-1}X^Ty=X^{-1}(X^T)^{-1}X^Ty=X^{-1}y$.`,
    note: R`The training MSE of $1.4\times10^{-22}$ (rounding-error level) in the slides' experiment with $M=9$, $n=10$ is (ii). The curve passes through the noise as well, so zero training error is no evidence of a good model. Conversely, if repeated measurements at the same $x$ leave at most $M$ distinct values, then by (i) $X^TX$ is singular and there are infinitely many solutions; ridge ($\lambda>0$) then gives a unique one (Section 4.3). (ii) can also be shown with the formula $\prod_{i<j}(x_j-x_i)$ for the determinant of a square Vandermonde matrix.` },
  'ch04-biasvar3': { title: 'Expected Prediction Error = Noise + Bias² + Variance',
    stmt: R`Fix an input $x$ and let a new observation be $Y=f(x)+\varepsilon$ ($\E\varepsilon=0$, $\Var\varepsilon=\sigma^2$). The prediction $\hat f_D(x)$ is a random variable (with finite variance) determined by the training data $D$, and $\varepsilon$ is independent of $D$. Then, with expectation over both $D$ and $\varepsilon$,
$$\begin{aligned}\E\big[(Y-\hat f_D(x))^2\big]&=\sigma^2\\&\quad+\big(\E_D\hat f_D(x)-f(x)\big)^2\\&\quad+\Var_D\big(\hat f_D(x)\big)\end{aligned}$$
that is, expected error = noise + bias² + variance.`,
    body: R`
Since $x$ is fixed, $f=f(x)$ is a constant; we abbreviate $\hat f=\hat f_D(x)$ and $\mu=\E_D\hat f$.

**1. Separate the noise.** Since $Y-\hat f=\varepsilon+(f-\hat f)$,
$$(Y-\hat f)^2=\varepsilon^2+2\varepsilon(f-\hat f)+(f-\hat f)^2$$
and by linearity of expectation we compute the three terms separately. The first is $\E\varepsilon^2=\Var\varepsilon+(\E\varepsilon)^2=\sigma^2$.

**2. The cross term.** $f-\hat f$ is a function of $D$ alone and $\varepsilon$ is independent of $D$, so the expectation of the product is the product of the expectations (Section 2.3): $\E[\varepsilon(f-\hat f)]=\E\varepsilon\cdot\E(f-\hat f)=0$. Independence and $\E\varepsilon=0$ are used here.

**3. Bias and variance.** The last term is the mean squared error of $\hat f$ viewed as an estimator of $f$. Splitting $f-\hat f=(f-\mu)+(\mu-\hat f)$, where $f-\mu$ is a constant and $\E(\mu-\hat f)=0$,
$$\begin{aligned}\E(f-\hat f)^2&=(f-\mu)^2+2(f-\mu)\,\E(\mu-\hat f)\\&\quad+\E(\mu-\hat f)^2\\&=(\mu-f)^2+\Var\hat f\end{aligned}$$
(the same computation as the bias–variance decomposition of Section 2.8).

**4. Combine.** Adding the three results gives $\E(Y-\hat f)^2=\sigma^2+(\mu-f)^2+\Var\hat f$.`,
    note: R`The first term $\sigma^2$ does not depend on $\hat f$, so no model can reduce it. In polynomial regression, raising the degree $M$ brings the mean prediction $\mu$ closer to $f$ and lowers the bias², but the prediction swings strongly when the data change, so the variance grows ($M=9$ in Section 4.2). That is why the validation error is U-shaped, and we pick the $M$ at its bottom. The decomposition holds at one fixed point $x$; averaging it again over the inputs gives the overall generalization error. If the independence of step 2 fails (the new observation is part of the training data), the cross term survives, which is why the training error underestimates the expected error.` },
  'ch04-softthresh': { title: 'Lasso Soft Thresholding and Ridge Shrinkage (One Dimension)',
    stmt: R`Let $z\in\mathbb R$ and $\lambda>0$.

(i) $g(\beta)=\frac12(\beta-z)^2+\lambda\lvert\beta\rvert$ has exactly one minimizer,
$$\hat\beta=\sign(z)\max(\lvert z\rvert-\lambda,\,0)$$
(soft thresholding). In particular $\hat\beta=0$ when $\lvert z\rvert\le\lambda$.

(ii) $h(\beta)=\frac12(\beta-z)^2+\frac\lambda2\beta^2$ has exactly one minimizer, $\hat\beta=\frac z{1+\lambda}$, and $\hat\beta\ne0$ whenever $z\ne0$.`,
    body: R`
The $\lvert\beta\rvert$ in $g$ is not differentiable at 0, so instead of differentiating we compare values of $g$ directly. When $z$ must be shown, we write $g_z$.

**1. The case $\lvert z\rvert\le\lambda$.** Expanding $g(\beta)-g(0)=\frac12(\beta-z)^2-\frac12z^2+\lambda\lvert\beta\rvert$ and using $-\beta z\ge-\lvert\beta\rvert\lvert z\rvert$,
$$\begin{aligned}g(\beta)-g(0)&=\tfrac12\beta^2-\beta z+\lambda\lvert\beta\rvert\\&\ge\tfrac12\beta^2+\lvert\beta\rvert(\lambda-\lvert z\rvert)\ge\tfrac12\beta^2\end{aligned}$$
and the last value is positive when $\beta\ne0$. Hence $\beta=0$ is the unique minimizer.

**2. The case $z>\lambda$.** Put $b=z-\lambda>0$; then $g(b)=\frac12\lambda^2+\lambda(z-\lambda)$. For any $\beta$, substituting $\beta-z=(\beta-b)-\lambda$ and expanding,
$$\begin{aligned}g(\beta)&=\tfrac12(\beta-b)^2-\lambda(\beta-b)+\tfrac12\lambda^2+\lambda\lvert\beta\rvert\\&=g(b)+\tfrac12(\beta-b)^2+\lambda(\lvert\beta\rvert-\beta)\end{aligned}$$
(the second line rearranges $-\lambda(\beta-b)+\frac12\lambda^2=-\lambda\beta+\lambda(z-\lambda)+\frac12\lambda^2$). Since $\lvert\beta\rvert\ge\beta$, $g(\beta)\ge g(b)+\frac12(\beta-b)^2$, with equality only at $\beta=b$. The unique minimizer is $\hat\beta=z-\lambda=\sign(z)(\lvert z\rvert-\lambda)$.

**3. The case $z<-\lambda$.** $g_z(-\beta)=\frac12(-\beta-z)^2+\lambda\lvert\beta\rvert=\frac12(\beta-(-z))^2+\lambda\lvert\beta\rvert=g_{-z}(\beta)$. Since $-z>\lambda$, by step 2 the unique minimizer of $g_{-z}$ is $-z-\lambda$, so the unique minimizer of $g_z$ is $-(-z-\lambda)=z+\lambda=\sign(z)(\lvert z\rvert-\lambda)$.

**4. One formula.** Collecting the three cases, $\hat\beta=\sign(z)\max(\lvert z\rvert-\lambda,0)$ (when $\lvert z\rvert\le\lambda$ the $\max$ is 0).

**5. (ii) Ridge.** Completing the square,
$$h(\beta)=\frac{1+\lambda}2\Big(\beta-\frac z{1+\lambda}\Big)^2+\frac{\lambda z^2}{2(1+\lambda)}$$
and since $\frac{1+\lambda}2>0$ the unique minimizer is $\frac z{1+\lambda}$. It only scales $z$ by $\frac1{1+\lambda}$, so it is never 0 when $z\ne0$.`,
    note: R`With an orthonormal design $X^TX=I$, $\frac12\lVert y-X\beta\rVert^2=\frac12\lVert\beta-X^Ty\rVert^2+$(a constant independent of $\beta$), so the lasso splits coordinatewise into this one-dimensional problem, and its solution is soft thresholding applied to $z_j=(X^Ty)_j$. Small $\lvert z_j\rvert$ become exactly 0, so variables are selected (sparsity), whereas ridge only shrinks every coefficient by the same factor. Compared with the definition $J=\frac12f+\frac\lambda2\sum_j\lvert\beta_j\rvert$ of Section 4.3, the $\lambda$ here corresponds to that $\frac\lambda2$ (only the name differs).` },
  'ch04-gausskernel': { title: 'Rules for Building Kernels and the Validity of the Gaussian Kernel',
    stmt: R`Call a symmetric function $K(x,z)=K(z,x)$ a kernel if for every finite data set $x_1,\dots,x_n$ the Gram matrix $[K(x_i,x_j)]$ is positive semidefinite (the criterion of Section 4.6). If $K_1,K_2$ are kernels, $c>0$, and $f:\mathbb R^d\to\mathbb R$ is any function, then (a) $K_1+K_2$ and $cK_1$, (b) $K_1K_2$, (c) $f(x)K_1(x,z)f(z)$, and (d) pointwise limits of kernels are kernels.

Hence $(x^Tz)^m$ ($m=0,1,2,\dots$), $e^{x^Tz/\sigma^2}$, the Gaussian kernel $e^{-\lVert x-z\rVert^2/2\sigma^2}$, and, when $K_1(x,x)>0$, the normalized kernel $K_1(x,z)K_1(x,x)^{-1/2}K_1(z,z)^{-1/2}$ are all kernels.`,
    body: R`
Symmetry follows directly from the definition in each case, so we only show that the Gram matrices are positive semidefinite. Fix data $x_1,\dots,x_n$, let $A=[K_1(x_i,x_j)]$ and $B=[K_2(x_i,x_j)]$ (both positive semidefinite), and take any $u\in\mathbb R^n$.

**(a) Sums and positive multiples.** $u^T(A+B)u=u^TAu+u^TBu\ge0$ and $u^T(cA)u=c\,u^TAu\ge0$.

**(b) Products (the Schur product).** The Gram matrix of $K_1K_2$ is the entrywise product $A\circ B$, $(A\circ B)_{ij}=A_{ij}B_{ij}$. Since $B$ is symmetric positive semidefinite, with orthonormal eigenvectors $w_1,\dots,w_n$ and eigenvalues $\mu_l\ge0$ we can write $B_{ij}=\sum_l\mu_lw_{l,i}w_{l,j}$. Then
$$\begin{aligned}u^T(A\circ B)u&=\sum_l\mu_l\sum_{i,j}(u_iw_{l,i})A_{ij}(u_jw_{l,j})\\&=\sum_l\mu_l\,v_l^TAv_l\ \ge0\end{aligned}$$
where $v_l=(u_1w_{l,1},\dots,u_nw_{l,n})^T$; this holds because $\mu_l\ge0$ and $v_l^TAv_l\ge0$.

**(c) The same function on both sides.** The Gram matrix is $DAD$ with $D=\diag(f(x_1),\dots,f(x_n))$, and $u^TDADu=(Du)^TA(Du)\ge0$.

**(d) Limits.** If kernels $K^{(N)}$ converge to $K$ at every point, the Gram matrices $G^{(N)}$ converge entrywise to $G$, so $u^TG^{(N)}u\to u^TGu$. A limit of nonnegative numbers is nonnegative, so $u^TGu\ge0$.

**1. Powers.** The Gram matrix of the linear kernel $x^Tz$ has $u^TGu=\lVert\sum_iu_ix_i\rVert^2\ge0$, and that of the constant 1 has $u^TGu=(\sum_iu_i)^2\ge0$, so both are kernels. Repeating (b), every $(x^Tz)^m$ is a kernel.

**2. The exponential series.** The partial sums $S_N(x,z)=\sum_{m=0}^N\frac{(x^Tz)^m}{\sigma^{2m}m!}$ are kernels by (a), and the Taylor series of the exponential converges at every real number, so $S_N\to e^{x^Tz/\sigma^2}$. By (d), $e^{x^Tz/\sigma^2}$ is a kernel.

**3. The Gaussian kernel.** Since $\lVert x-z\rVert^2=\lVert x\rVert^2-2x^Tz+\lVert z\rVert^2$, putting $f(x)=e^{-\lVert x\rVert^2/2\sigma^2}$ gives
$$e^{-\lVert x-z\rVert^2/2\sigma^2}=f(x)\,e^{x^Tz/\sigma^2}f(z)$$
By (c) and step 2 the Gaussian kernel is a kernel. The normalized kernel is (c) with $f(x)=K_1(x,x)^{-1/2}$.`,
    note: R`The criterion “a symmetric function all of whose Gram matrices are positive semidefinite is an inner product in some feature space” is known as Mercer's theorem and is not proved here; this proof shows that the Gaussian kernel meets that criterion. The series of step 2 contains polynomial features of every degree $m$, so the feature space of the Gaussian kernel is infinite-dimensional. A non-example: $K(x,z)=x^Tz-1$ is not a kernel, since already the single point $x_1=0$ gives the Gram matrix $[-1]$, which is not positive semidefinite. By (a) and (b), $(x^Tz+1)^2$ (Section 4.6) is also a kernel right away.` },
  });
})();
