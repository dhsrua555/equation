/* English text — 04 Probabilistic Regression, Regularization, Kernels (W1 Wed slides 45–68, W2 Wed notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    polyfit: R`The dashed curve is the true function $\sin2\pi x$ that generated the data, the dots are 10 noisy training points, and the solid curve is the least-squares polynomial. $M=1$ is too simple to follow the shape, while $M=9$ passes exactly through the 10 points with 10 parameters (zero training error) but oscillates wildly between the points, especially at both ends, and mispredicts new data.`,
    l1l2: R`The regularized problem is the same as minimizing the squared error under the constraint “the coefficients must lie in the shaded region”. The ellipses are level sets of the squared error, and the solution is the point where a level set first touches the region (the filled dot). The circle (ridge) has no corners, so it is usually touched where both coefficients are nonzero; the diamond (lasso) tends to be touched at a **corner** on an axis, making one coefficient exactly 0.`,
    lift: R`(a) The inner points (filled circles) and the outer points (open circles) cannot be separated by any line. (b) Adding the new coordinate $z=x_1^2+x_2^2$ (the squared distance from the origin) puts the inner points below and the outer points above, so the single horizontal line $z=1$ separates them. With the slide's $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$, the plane $z_1+z_2=1$ does the same job.`,
  });
  EM.en.ch[4] = {
    title: 'Probabilistic Regression, Regularization, Kernels',
    fig: R`Fits of an M = 9 polynomial with ridge regularization for several λ, and the true curve sin 2πx (bold)`,
    tagline: R`With Gaussian noise, least squares = MLE; add a Gaussian prior and you get ridge. One line of the push-through identity turns ridge into kernel ridge.`,
    summary: R`Read as a probability model, linear regression gives **least squares = maximum likelihood under Gaussian noise**. Polynomial regression, which extends the features to $1,x,x^2,\dots$, is still linear regression, but a high degree causes **overfitting**, and **regularization** that penalizes the coefficients (ridge, lasso) prevents it. Ridge is the MAP under a Gaussian prior, and its solution is always unique. Finally, using the **kernel trick** — computation is possible with **inner products only** even when the features are lifted to high dimensions — we derive kernel ridge regression through the push-through identity (the two-point example in class, $35/69$).`,
    goals: [
      R`Expand the log-likelihood under Gaussian noise to show least squares = MLE and find $\hat\sigma^2$`,
      R`Explain why polynomial regression is linear regression, and explain overfitting, generalization, and the validation error`,
      R`Derive the ridge solution $(\lambda I+X^TX)^{-1}X^Ty$, and explain why it is always invertible and how it relates to MAP ($\lambda=\sigma^2/\tau^2$)`,
      R`Explain from the shape of the constraint region why lasso produces sparse solutions`,
      R`Know the definition of a kernel and the polynomial and Gaussian kernels, and show that a Gram matrix is positive semidefinite`,
      R`Prove the push-through identity, and derive and compute the kernel ridge prediction $K(x,X)(\lambda I+K)^{-1}y$ in two ways`,
    ],
    secTitles: { '4.1': 'LSE = MLE', '4.2': 'Polynomials · overfitting', '4.3': 'Ridge · lasso', '4.4': 'Kernel trick', '4.5': 'Kernel ridge', '4.6': 'Kernel examples' },
    secs: {
      '4.1': { title: 'Linear Regression — Probabilistic Approach: Least Squares = Maximum Likelihood', body: R`
:::idea In plain words
In Unit 1 we simply decided that “small squared errors are good”. This section justifies that choice with probability. If we assume that “each measurement is the value on the true line plus **bell-shaped (normal) noise**”, then the line that makes the observed data most plausible is exactly the line minimizing the squared error.
:::

We assume a distribution for the error in the model of Unit 1.
$$Y=\beta_0+\sum_{j=1}^k\beta_jx_j+\varepsilon,\qquad \varepsilon\sim\N(0,\sigma^2)\ \text{i.i.d.}$$
Writing $h_i(\beta)=\beta_0+\sum_j\beta_jx_{ij}$, we have $y_i=h_i(\beta)+\varepsilon_i$, and adding a constant to a normal variable only shifts its mean, so $y_i\mid x_i\sim\N(h_i(\beta),\sigma^2)$. The data are independent, so the likelihood is the product of the densities.
$$\prod_{i=1}^n\frac1{\sqrt{2\pi}\,\sigma}\exp\Big(-\frac{(y_i-h_i(\beta))^2}{2\sigma^2}\Big).$$

:::key Least squares = Gaussian MLE
$$\log p(y_1,\dots,y_n\mid x_1,\dots,x_n,\beta)=-n\log(\sqrt{2\pi}\,\sigma)-\sum_{i=1}^n\frac{(y_i-h_i(\beta))^2}{2\sigma^2}$$
To maximize over $\beta$, it suffices to minimize $\sum_i(y_i-h_i(\beta))^2=f(\beta)$. Hence the LSE is the MLE.
:::

**Line by line.** The log of a product is the sum of the logs, and $\log\big(\frac1{\sqrt{2\pi}\sigma}e^{-u}\big)=-\log(\sqrt{2\pi}\sigma)-u$. The first term is a constant independent of $\beta$, and the second is $-\frac1{2\sigma^2}\times$(the sum of squared errors). Multiplying by the positive number $\frac1{2\sigma^2}$ does not move the minimizer, so $\hat\beta$ is the same even if $\sigma$ is unknown.

If we also estimate $\sigma^2$, differentiating the log-likelihood in $\sigma^2$ gives $-\frac n{2\sigma^2}+\frac{f(\hat\beta)}{2\sigma^4}=0$, so $\hat\sigma^2_{\text{MLE}}=\frac1n\sum_i(y_i-h_i(\hat\beta))^2=f(\hat\beta)/n$, the mean squared residual. This estimator is biased (the denominator $n-k-1$ makes it unbiased).

:::ex Example 1 — Estimating the size of the noise
For the example of Unit 1 (4 points, $f(\hat\beta)=0.70$, 2 parameters), what are $\hat\sigma^2_{\text{MLE}}$ and the unbiased estimator?
---
$\hat\sigma^2_{\text{MLE}}=0.70/4=0.175$. The unbiased estimator is $0.70/(4-2)=0.35$. With little data the two values differ a lot. Because the line was fitted to the data, the residuals come out smaller than the true noise, and the degrees of freedom $n-2$ correct for that.
:::

:::warn Change the assumption and the loss changes
LSE = MLE is the conclusion for **Gaussian** noise. If the noise has a Laplace distribution $\propto e^{-\lvert\varepsilon\rvert/b}$, the MLE minimizes the sum of absolute errors $\sum\lvert y_i-h_i\rvert$.
:::

### Going deeper: a loss function is a choice of noise model

In general, “loss = negative log-likelihood”. Gaussian → squared error, Laplace → absolute error (median regression, robust to outliers), Bernoulli → cross-entropy (logistic regression, Unit 5), categorical → softmax cross-entropy (Unit 6). If the noise variance differs from point to point ($\sigma_i^2$), the weighted least squares $\sum(y_i-h_i)^2/\sigma_i^2$ becomes the MLE. When choosing the loss of a neural network, too, just ask “what distribution do we assume for the output?”[[@med:ch04:2.3c|The probabilistic interpretation of linear regression.]].
` },
      '4.2': { title: 'Polynomial Regression and Overfitting', body: R`
:::idea In plain words
A student who **memorizes the answers without understanding** scores 100 on past exams but cannot solve new problems. Models are the same. A model free with many parameters can memorize the training data, noise and all, and drive the training error to 0, but on new data it performs terribly. This is **overfitting**, and what we want is performance on new data, i.e., **generalization**.
:::

Even if we extend the features to $\{1,x,x^2,\dots,x^M\}$, as in $y=\beta_0+\beta_1x+\beta_2x^2+\cdots+\beta_Mx^M$, the model is **linear in the parameters $\beta$**, so it is still linear regression (lecture notes). Row $i$ of the design matrix becomes $(1,x_i,x_i^2,\dots,x_i^M)$, and the solution is the same $\hat\beta=(X^TX)^{-1}X^Ty$[[@ml:ch07:9.2b|Polynomial regression is linear regression.]].

The experiment in the slides (10 points drawn from $\sin2\pi x$):

| Degree $M$ | 1 | 3 | 5 | 9 |
|---|---|---|---|---|
| Training MSE $f/n$ | 0.29 | 0.0096 | 0.0011 | $1.4\times10^{-22}$ |

With $M=9$, the 10 parameters pass exactly through the 10 points and the training error is essentially 0, but the curve oscillates wildly between the points (lecture notes: near $x\approx0.9$). This is **overfitting**.

:::fig polyfit
:::

- We want to have good performance for a new data set, so **generalization** is important. We measure generalization using a separate data set (validation set) with the root mean squared error $E_{\text{RMS}}=\sqrt{f(\beta)/n}$. (Taking the square root puts it in the same units as $y$, and dividing by $n$ lets sets of different sizes be compared.)
- The difference between the training curve and the test (validation) curve increases as $M$ increases for $M\ge5$. We choose the $M$ with the smallest validation error (around 5 here).
- With more data, the same $M=9$ overfits less ($n=10$ versus $n=100$). Rule of thumb: about 10 data points per parameter.

**Why $M=9$ passes exactly through the points.** For 10 distinct $x_i$, the $10\times10$ design matrix built from $1,x,\dots,x^9$ (a Vandermonde matrix) is invertible, so some $\beta$ solves $X\beta=y$ exactly. Zero residual, zero training MSE — but it is the result of fitting the noise too.

:::ex Example 2 — Splitting into training and validation
We want to choose the degree with 100 data points. Write the procedure.
---
(1) Randomly split the data into 70 training and 30 validation points. (2) For each candidate $M=0,1,\dots,9$, find $\hat\beta$ from the training data. (3) Measure the validation $E_{\text{RMS}}$ of each $\hat\beta$. (4) Choose the $M$ with the smallest validation error and, if needed, refit on all the data. Since the validation data were used for model selection, a separate **test set** must be held out for reporting the final performance.
:::

### Going deeper: the bias–variance trade-off

Imagine drawing a fresh training set of the same size many times and fitting the model each time; then the prediction error at a point $x$ splits into **bias²** (how far the average prediction is from the truth) + **variance** (how much the prediction fluctuates with the data) + noise. A low degree has large bias (underfitting), a high degree large variance (overfitting). The shrinkage estimator of §2.8 is the simplest example of this trade[[ch02:2.8|Shrinking introduces bias but reduces variance, so the MSE can shrink.]]. In today's very large neural networks, whose parameters far outnumber the data, **double descent** — the validation error coming down again — has been observed, so this trade-off is known not to be the whole story[[@med:ch11:9.3|Learning curves, early stopping, double descent.]].
` },
      '4.3': { title: 'Regularization: Ridge and Lasso', body: R`
:::idea In plain words
An overfitted polynomial has enormous coefficients, tens or hundreds of thousands, with huge positive and negative terms canceling each other to force the curve through the points. So we add the rule “reduce the error, but **penalize large coefficients**”. The penalty strength $\lambda$ is the knob that trades “how much we trust the data” against “how much we prefer simplicity”.
:::

An overfitted model has very large coefficients. The slide's table of coefficients for $M=9$:

| | $\ln\lambda=-36.8$ | $\ln\lambda=-16.1$ | $\ln\lambda=0$ |
|---|---|---|---|
| $\beta_0$ | 0.0595 | 0.4318 | 0.0518 |
| $\beta_2$ | 769.8 | −19.60 | −0.432 |
| $\beta_6$ | 130036.2 | −36.51 | 0.0575 |
| $\beta_9$ | −1437.7 | −48.28 | 0.2105 |

As $\lambda\to0$ ($\ln\lambda\to-\infty$) the model overfits; at $\ln\lambda=0$ it is pressed down too much and underfits. With regularization the test (validation) and training errors show a similar trend.

:::def Regularized objective
$$J=\frac12f(\beta)+\frac\lambda2\sum_{j=0}^M\lvert\beta_j\rvert^q$$
$q=2$: **ridge** (weight decay, shrinking the coefficients); $q=1$: **lasso** (sparse, making some coefficients exactly 0).
:::

### Deriving the ridge solution

$J(\beta)=\frac12(y-X\beta)^T(y-X\beta)+\frac\lambda2\beta^T\beta$. From the computation of Unit 1, the gradient of the first term is $\frac12(-2X^Ty+2X^TX\beta)=X^TX\beta-X^Ty$, and that of the second is $\frac\lambda2\cdot2\beta=\lambda\beta$.

:::key Solution of ridge regression
$$J(\beta)=\frac12(y-X\beta)^T(y-X\beta)+\frac\lambda2\beta^T\beta,\qquad \nabla J=X^TX\beta-X^Ty+\lambda\beta=0$$
$$\hat\beta_{\text{ridge}}=(\lambda I+X^TX)^{-1}X^Ty$$
If $\lambda>0$, $\lambda I+X^TX$ is positive definite and hence **always** invertible.
:::

Invertibility: $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$ ($v\ne0$). Even in the cases of Unit 1 where $X^TX$ was singular and the solution was not unique ($n<k+1$ and so on), ridge gives a unique solution. The Hessian $\lambda I+X^TX\succ0$ makes $J$ strongly convex, and the point with zero gradient is the unique minimizer.

:::ex Example 3 — Watching ridge shrink the coefficients
Fitting $y=\beta_0+\beta_1x$ to $(x,y)=(0,1),(1,2),(2,4)$, compare the solutions for $\lambda=0$ and $\lambda=1$ (both coefficients regularized).
---
$X^TX=\begin{pmatrix}3&3\\3&5\end{pmatrix}$, $X^Ty=(7,10)^T$.
$\lambda=0$: $\det=6$, $\hat\beta=\frac16(5\cdot7-3\cdot10,\ -3\cdot7+3\cdot10)=(\tfrac56,\ \tfrac32)\approx(0.833,1.5)$.
$\lambda=1$: $\begin{pmatrix}4&3\\3&6\end{pmatrix}$, $\det=15$, $\hat\beta=\frac1{15}(6\cdot7-3\cdot10,\ -3\cdot7+4\cdot10)=(0.8,\ 1.267)$.
Both coefficients shrank toward 0. In practice the intercept $\beta_0$ is often left unregularized (to avoid the answer changing when the data are shifted up or down).
:::

### Probabilistic reading: the MAP with a Gaussian prior

With noise $\N(0,\sigma^2)$ and prior $\beta\sim\N(0,\tau^2I)$, the log posterior is $-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2-\frac1{2\tau^2}\lVert\beta\rVert^2+$const. Multiplying by $\sigma^2$ gives $-\big[\frac12\lVert y-X\beta\rVert^2+\frac{\sigma^2}{2\tau^2}\lVert\beta\rVert^2\big]$, so it is **ridge with $\lambda=\sigma^2/\tau^2$**[[ch02:2.6|In MAP, $\beta\sim\N(0,\tau^2I)$ gives ridge with $\lambda=\sigma^2/\tau^2$.]]. The narrower the prior (smaller $\tau^2$), the stronger the regularization. Problem 2 of Problem Set 1 is the special case where $X$ is a single column of ones ($\beta=\theta$) and $\sigma^2=1$, with $\lambda=1/\tau^2$[[ch02:2.8|The MAP of a Gaussian mean = ridge, with shrinkage factor $n\tau^2/(n\tau^2+1)$.]]. The medical AI course calls the same formula weight decay[[@med:ch11:9.2|Weight decay $\tilde E=E+\frac\lambda2w^Tw$ adds $\lambda w$ to the gradient.]].

### Lasso and sparsity

With $q=1$ the penalty $\lvert\beta_j\rvert$ is not differentiable at 0, so there is no one-line solution, but instead it makes **some coefficients exactly 0** (variable selection). The easiest way to see why is a picture. In terms of Lagrange multipliers, the regularized problem is the same as “minimizing the squared error inside the region $\sum\lvert\beta_j\rvert^q\le t$”.

:::fig l1l2
:::

It can also be seen by computation in one dimension. The solution of $\min_\beta\frac12(\beta-z)^2+\lambda\lvert\beta\rvert$ is the **soft threshold** $\hat\beta=\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$: exactly 0 if $\lvert z\rvert\le\lambda$. The ridge version of the same problem, $\frac12(\beta-z)^2+\frac\lambda2\beta^2$, has solution $\hat\beta=\frac z{1+\lambda}$, which only shrinks and never becomes 0.

### Going deeper: ridge through singular values

Writing $X=UDV^T$ (the singular value decomposition, with singular values $d_j$),
$$X\hat\beta_{\text{ridge}}=\sum_j u_j\,\frac{d_j^2}{d_j^2+\lambda}\,u_j^Ty.$$
Least squares ($\lambda=0$) uses the projection onto each direction $u_j$ as is, while ridge **shrinks** each direction by the factor $\frac{d_j^2}{d_j^2+\lambda}$. The smaller the singular value of a direction (a direction in which the data are barely spread and which the noise easily sways), the more it shrinks. So ridge is a regularizer that “picks out the unstable directions and presses them down”. The effective degrees of freedom $\sum_j\frac{d_j^2}{d_j^2+\lambda}$ equal the number of parameters when $\lambda=0$ and go to 0 as $\lambda\to\infty$[[@ml:ch10:13.1b|Ridge regression and stability.]].
` },
      '4.4': { title: 'Kernel Trick', body: R`
:::idea In plain words
If the points of a plane are split into “inside a circle” and “outside a circle”, no single line separates them. But if we attach one more **new coordinate**, “the squared distance from the origin”, and lift the points to three dimensions, the inside points sit low and the outside points float high, so one flat sheet separates them. Raising the dimension lets even a linear model draw complicated boundaries. The trouble is that the computation becomes impossible when the dimension is too large, but **if only inner products are needed**, we can compute without actually building the high-dimensional coordinates. This is the kernel trick.
:::

Suppose we want to find a linear line to separate two types of data points in the plane, but it is impossible. Instead, if we map the samples into a feature space of higher dimensions, $x\mapsto\varphi(x)$, then the two types of data points can be linearly separated. For example, points inside and outside a circle are separated by the plane $z_1+z_2=r^2$ after mapping by $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$.

:::fig lift
:::

A linear model in feature space is $f(x)=\varphi(x)^T\beta$, and the key point is that learning and prediction need only inner products, not $\varphi$ itself[[@ml:ch13:16.2|The representer theorem: if the loss depends only on inner products and the regularizer is an increasing function of the norm, the optimum is a combination of the training points and can be computed with inner products alone.]].

:::def Kernel
$$K(x_i,x_j)=\varphi(x_i)^T\varphi(x_j)$$
The dimension of the new space (possibly infinite) does not matter. A kernel measures the **similarity** of two points.
:::

### The gain in computation

Building all second-order terms $x_ix_j$ of $x\in\mathbb R^d$ as features gives about $d^2/2$ dimensions. For $d=1000$, about 500,000 dimensions — 500,000 multiplications for the inner product of two feature vectors. Yet $(x^Tz)^2$ gives the same value by squaring an inner product computed with $d=1000$ multiplications. The Gaussian kernel has an **infinite-dimensional** feature space, so building the features is impossible in itself, but the kernel value is computed directly as $\exp(-\lVert x-z\rVert^2/2\sigma^2)$.

:::ex Example 4 — Computing the inner product with a kernel instead of features
For $x=(1,2)$ and $z=(3,-1)$, compute $\varphi(x)^T\varphi(z)$ directly with $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$ and compare with $(x^Tz)^2$.
---
$\varphi(x)=(1,4,2\sqrt2)$, $\varphi(z)=(9,1,-3\sqrt2)$. The inner product is $9+4-12=1$. Meanwhile $x^Tz=3-2=1$, whose square is $1$. The same.
:::
` },
      '4.5': { title: 'Kernel Ridge Regression', body: R`
:::idea In plain words
Doing ridge regression in feature space makes the answer “a suitable mixture of the feature vectors of the training points”. So the prediction at a new point is a weighted sum of “**how similar** the new point is to each training point” (the kernel): $f^*(x)=\sum_i\alpha_iK(x,x_i)$. The weights $\alpha$ are found from the table of similarities between training points (the Gram matrix) alone.
:::

Write the feature matrix as $\varphi(X)=[\varphi(x_1)\ \cdots\ \varphi(x_n)]$ (the $d\times n$ matrix with these as columns); then the prediction vector is $\varphi(X)^T\beta$ and
$$J=\frac12\big(y-\varphi(X)^T\beta\big)^T\big(y-\varphi(X)^T\beta\big)+\frac\lambda2\beta^T\beta.$$
The same computation as in §4.3 (with $\varphi(X)^T$ in place of $X$) gives $\nabla J=-\varphi(X)y+\varphi(X)\varphi(X)^T\beta+\lambda\beta=0$, that is,
$$\beta^*=\big(\lambda I+\varphi(X)\varphi(X)^T\big)^{-1}\varphi(X)y.$$
This formula contains a $d\times d$ inverse and cannot be computed when the feature dimension is large. Here we use an identity that “pushes” the matrix through.

:::key Push-through identity
$$\begin{aligned}&(\lambda I_d+\varphi\varphi^T)\varphi=\varphi(\lambda I_n+\varphi^T\varphi)\\\Longrightarrow\ &(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}\qquad(\lambda>0)\end{aligned}$$
:::

Expanding both sides of the first equation gives $\lambda\varphi+\varphi\varphi^T\varphi$ on each. Multiplying by $(\lambda I_d+\varphi\varphi^T)^{-1}$ on the left and $(\lambda I_n+\varphi^T\varphi)^{-1}$ on the right gives the second (both matrices are positive definite, hence invertible, when $\lambda>0$). That is, from $A\varphi=\varphi B$ we get $\varphi B^{-1}=A^{-1}\varphi$: $A^{-1}(A\varphi)B^{-1}=A^{-1}(\varphi B)B^{-1}$.

:::key Kernel ridge regression
$$\beta^*=\varphi(X)\big(\lambda I+\varphi(X)^T\varphi(X)\big)^{-1}y,$$
$$f^*(x)=\varphi(x)^T\beta^*=K(x,X)\big(\lambda I+K(X,X)\big)^{-1}y$$
$K(x,X)=[K(x,x_1)\ \cdots\ K(x,x_n)]$ ($1\times n$), $K(X,X)=[K(x_i,x_j)]$ ($n\times n$ Gram matrix). With $\alpha^*=(\lambda I+K)^{-1}y$, $f^*(x)=K(x,X)\alpha^*=\sum_i\alpha_i^*K(x,x_i)$ and $\beta^*=\varphi(X)\alpha^*$.
:::

**Line by line.** $\varphi(x)^T\varphi(X)=[\varphi(x)^T\varphi(x_1)\ \cdots]=K(x,X)$ and $\varphi(X)^T\varphi(X)=[\varphi(x_i)^T\varphi(x_j)]=K(X,X)$. The inverse becomes $n\times n$, so it is computable even if the feature dimension $d$ is infinite.

:::hand Lecture note — a second derivation in terms of α
Setting $\beta=\varphi(X)\alpha$, we have $\varphi(X)^T\beta=K\alpha$ and $\beta^T\beta=\alpha^TK\alpha$ ($K=\varphi(X)^T\varphi(X)$, symmetric), so
$$\begin{aligned}J&=\tfrac12\big(y^Ty-y^TK\alpha-\alpha^TKy+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha\\&=\tfrac12\big(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha.\end{aligned}$$
$$\nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big)=0,$$
$$\alpha^*=(K+\lambda I)^{-1}y.$$
The same $f^*$ as in the first derivation comes out.
:::

**Why we may set $\beta=\varphi(X)\alpha$.** Split any $\beta$ into its component $\varphi(X)\alpha$ in “the space spanned by the $\varphi(x_i)$” and a component $\beta_\perp$ orthogonal to it; $\beta_\perp$ has zero inner product with every training point, so it does not change the error term and only increases $\lVert\beta\rVert^2$. Hence $\beta_\perp=0$ at the optimum (the representer theorem). Also, if $K$ is singular, $K((K+\lambda I)\alpha-y)=0$ may have several solutions, but all give the same predictions, and $\alpha^*=(K+\lambda I)^{-1}y$ is one of them.

:::ex Example 5 — Kernel ridge with two points (lecture notes)
$\varphi(x_1,x_2)=(x_1^2,x_2^2,\sqrt2x_1x_2)$, i.e., $K(x,z)=(x^Tz)^2$. With data $x_1=(1,1),\,y_1=3$ and $x_2=(2,0),\,y_2=2$ and $\lambda=1$, what is the prediction at $x_t=(1,0)$?
---
$K(x_1,x_1)=(1+1)^2=4$, $K(x_1,x_2)=(2+0)^2=4$, $K(x_2,x_2)=4^2=16$, so $K=\begin{pmatrix}4&4\\4&16\end{pmatrix}$.
$\lambda I+K=\begin{pmatrix}5&4\\4&17\end{pmatrix}$, determinant $85-16=69$.
$$\alpha^*=\frac1{69}\begin{pmatrix}17&-4\\-4&5\end{pmatrix}\begin{pmatrix}3\\2\end{pmatrix}=\frac1{69}\begin{pmatrix}43\\-2\end{pmatrix}$$
$K(x_t,X)=[(1\cdot1+0\cdot1)^2,\ (1\cdot2+0\cdot0)^2]=[1,\ 4]$.
$$f^*(x_t)=[1\ \ 4]\cdot\frac1{69}\begin{pmatrix}43\\-2\end{pmatrix}=\frac{35}{69}\approx0.507$$
:::

We can also check the same example by solving directly in feature space: $\varphi(x_1)=(1,1,\sqrt2)$, $\varphi(x_2)=(4,0,0)$, $\beta^*=\varphi(X)\alpha^*=\frac{43}{69}(1,1,\sqrt2)-\frac2{69}(4,0,0)=\frac1{69}(35,43,43\sqrt2)$. Since $\varphi(x_t)=(1,0,0)$, $f^*=\frac{35}{69}$. The same.

:::tip Size check
$\varphi(X)$: $d\times n$, $K=\varphi^T\varphi$: $n\times n$, $K(x,X)$: $1\times n$, $\alpha^*$: $n\times1$. The inverse is $n\times n$, so the number of data points $n$ sets the cost.
:::

### Going deeper: primal and dual forms

$\beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y$ (the primal form, a $d\times d$ inverse) and $\beta^*=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y$ (the dual form, $n\times n$) give the same answer. If $d\ll n$ the primal form is cheaper; if $n\ll d$ (or $d=\infty$), the dual form. With millions of data points even the $n\times n$ matrix is unmanageable, which is why methods that **learn** the features, like neural networks, came into use. The kernel ridge prediction equals the posterior mean of Gaussian process regression[[@ml:ch13:16.4|Kernel ridge regression and Gaussian processes.]].
` },
      '4.6': { title: 'Examples of Kernels', body: R`
:::idea In plain words
A kernel is a function measuring “how similar two points are”. The linear kernel gives a larger value the more the directions agree, and the Gaussian kernel the **closer** the points are. Kernel ridge with a Gaussian kernel makes predictions that “mix the values of the training points near the new point, giving more weight to closer points”.
:::

:::key Examples of kernels
- Linear kernel: $K(x,z)=x^Tz$
- Polynomial kernel: $K(x,z)=(x^Tz)^2=\big\langle(x_1^2,x_2^2,\sqrt2x_1x_2),(z_1^2,z_2^2,\sqrt2z_1z_2)\big\rangle$ (2 dimensions → 3 dimensions)
- Gaussian kernel: $K(x,z)=\exp\big(-\lVert x-z\rVert^2/(2\sigma^2)\big)$
- Normalized kernel: $K_2(x,z)=K_1(x,z)\,K_1(x,x)^{-1/2}K_1(z,z)^{-1/2}$
:::

The identity for the polynomial kernel is checked by expanding: $(x_1z_1+x_2z_2)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2$. Adding a constant, $(x^Tz+1)^2$ corresponds to the features $(1,\sqrt2x_1,\sqrt2x_2,x_1^2,x_2^2,\sqrt2x_1x_2)$, which include the first-order terms and a constant.

:::ex Example 6 — Values of the Gaussian kernel
With $\sigma=1$, what are the kernel values between $x=(0,0)$ and $z=(1,1)$, $z'=(3,0)$?
---
$\lVert x-z\rVert^2=2$, so $K=e^{-1}\approx0.368$. $\lVert x-z'\rVert^2=9$, so $K=e^{-4.5}\approx0.011$. The farther apart, the closer to 0, and always $K(x,x)=1$ with itself. The smaller $\sigma$, the stricter the standard of “close”, and the wigglier the fitted function (toward overfitting).
:::

**A Gram matrix is positive semidefinite.** If $K=\varphi(X)^T\varphi(X)$, then $c^TKc=\lVert\varphi(X)c\rVert^2\ge0$. So $\lambda I+K$ is always invertible when $\lambda>0$. Conversely, a symmetric function whose Gram matrix is positive semidefinite on every finite data set can be written as an inner product in some feature space (Mercer's theorem)[[@ml:ch13:16.2c|Testing a kernel: positive semidefinite Gram matrices.]].

:::note Normalized kernel
It gives $K_2(x,x)=1$ and equals the inner product after scaling the feature vectors to unit length (the cosine similarity): $K_2(x,z)=\big\langle\frac{\varphi(x)}{\lVert\varphi(x)\rVert},\frac{\varphi(z)}{\lVert\varphi(z)\rVert}\big\rangle$.
:::

### Going deeper: rules for building kernels, and the infinite dimension of the Gaussian

If $K_1,K_2$ are kernels, so are $K_1+K_2$ (concatenating features), $cK_1$ ($c>0$), $K_1K_2$ (the tensor product of features), and $f(x)K_1(x,z)f(z)$. These rules show why the Gaussian kernel is a kernel:
$$e^{-\lVert x-z\rVert^2/2\sigma^2}=e^{-\lVert x\rVert^2/2\sigma^2}\cdot e^{x^Tz/\sigma^2}\cdot e^{-\lVert z\rVert^2/2\sigma^2},\qquad e^{x^Tz/\sigma^2}=\sum_{m=0}^\infty\frac{(x^Tz)^m}{\sigma^{2m}m!}.$$
The middle factor is a positive combination of polynomial kernels (an infinite series), hence a kernel, and the two outer factors have the form $f(x)Kf(z)$. It contains polynomial features of every degree, so the feature space is infinite-dimensional.
` },
    },
    probs: [
      // u04
      { q: R`Under what assumption does the least-squares estimator of linear regression coincide with the maximum likelihood estimator?`,
        choices: [R`The errors are i.i.d. $\N(0,\sigma^2)$`, R`The errors are i.i.d. Laplace`, R`The explanatory variables are normal`, R`The coefficients are normal`],
        sol: R`Because the Gaussian log-likelihood is $-\sum(y_i-h_i)^2/(2\sigma^2)+$const. Laplace noise gives absolute errors, and a normal distribution on the coefficients (a prior) gives MAP, i.e., ridge.` },
      { q: R`For the example of Unit 1 ($f(\hat\beta)=0.70$, $n=4$), what is the MLE $\hat\sigma^2$ of the Gaussian noise variance?`,
        sol: R`$\hat\sigma^2_{\text{MLE}}=f(\hat\beta)/n=0.70/4=0.175$. (The unbiased estimator is $0.70/(4-2)=0.35$.)` },
      { q: R`Why is fitting $y=\beta_0+\beta_1x+\beta_2x^2$ by least squares “linear” regression?`,
        choices: [R`Because it is linear in $x$`, R`Because it is linear in the parameters $\beta$`, R`Because $x^2$ is small`, R`Because $\beta_2=0$`],
        sol: R`With the rows of the design matrix set to $(1,x_i,x_i^2)$, it has the form $y=X\beta$ and the normal equations apply as is.` },
      { q: R`Fitting an $M=9$ polynomial to 10 points gave a training MSE of $10^{-22}$. Which judgment is most correct?`,
        choices: [R`It is the optimal model`, R`Overfitting is suspected, so judge by the validation error`, R`It underfits`, R`Reducing the data will fix it`],
        sol: R`It merely interpolates 10 points with 10 parameters. Judge generalization by the $E_{\text{RMS}}$ on validation data, and fix it with regularization or more data.` },
      { q: R`For the model with one explanatory variable and no intercept, $y=\beta x$, with $x=(1,2,3)$, $y=(2,4,5)$, and $\lambda=1$, what is the ridge solution $\hat\beta=(\lambda+X^TX)^{-1}X^Ty$?`,
        sol: R`$X^TX=14$ and $X^Ty=25$. $\hat\beta=25/(1+14)=5/3$ — shrunk toward 0 from the least-squares solution $25/14\approx1.786$.` },
      { q: R`Why is $\lambda I+X^TX$ always invertible when $\lambda>0$?`,
        choices: [R`Because $X^TX$ is always invertible`, R`Because $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$ ($v\ne0$)`, R`Because $\lambda I$ is diagonal`, R`Because $X$ is square`],
        sol: R`A positive definite matrix has all eigenvalues positive and is invertible. $X^TX$ itself can be singular.` },
      { q: R`For the regularization term $\frac\lambda2\sum\lvert\beta_j\rvert^q$, which tends to make some coefficients exactly 0?`,
        choices: [R`$q=2$ (ridge)`, R`$q=1$ (lasso)`, R`$q=4$`, R`It does not depend on $q$`],
        sol: R`The level set for $q=1$ (a diamond) has its corners on the coordinate axes, so the optimum easily lands on an axis (a zero coefficient). Ridge only shrinks the coefficients.` },
      { q: R`What does the slide's coefficient table show happening in ridge as $\lambda\to0$?`,
        choices: [R`All coefficients become 0`, R`The coefficients become very large and the model overfits`, R`The training error grows`, R`The validation error becomes minimal`],
        sol: R`At $\ln\lambda=-36.8$ the coefficients explode, e.g., $\beta_6\approx1.3\times10^5$.` },
      { q: R`With the same kernel as Example 1, $K(x,z)=(x^Tz)^2$, data $x_1=(1,1),y_1=3$, $x_2=(2,0),y_2=2$, and $\lambda=1$, what is the prediction at $x_t=(0,1)$?`,
        sol: R`$\alpha^*=\frac1{69}(43,-2)$ is the same. $K(x_t,X)=[(0+1)^2,(0+0)^2]=[1,0]$, so $f^*=43/69$.` },
      { q: R`In Example 1, what is $\alpha_2^*$?`,
        sol: R`$(\lambda I+K)^{-1}y=\frac1{69}\begin{pmatrix}17&-4\\-4&5\end{pmatrix}\begin{pmatrix}3\\2\end{pmatrix}=\frac1{69}(43,-2)$.` },
      { q: R`With feature dimension $d$ and $n$ data points, what is the size of the inverse in the kernel ridge prediction $K(x,X)(\lambda I+K)^{-1}y$?`,
        choices: [R`$d\times d$`, R`$n\times n$`, R`$d\times n$`, R`$1\times1$`],
        sol: R`$K=\varphi(X)^T\varphi(X)$ is $n\times n$. Thanks to the push-through identity we avoid a $d\times d$ inverse (possibly infinite-dimensional).` },
      { q: R`For $x,z\in\mathbb R^2$, which feature map corresponds to $K(x,z)=(x^Tz+1)^2$?`,
        choices: [R`$(x_1^2,x_2^2,\sqrt2x_1x_2)$`, R`$(x_1^2,x_2^2,\sqrt2x_1x_2,\sqrt2x_1,\sqrt2x_2,1)$`, R`$(x_1,x_2,1)$`, R`$(x_1^2,x_2^2,x_1x_2,x_1,x_2,1)$`],
        sol: R`$(x_1z_1+x_2z_2+1)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2+2x_1z_1+2x_2z_2+1$. Each cross term needs a $\sqrt2$.` },
      { q: R`For the Gaussian kernel $K(x,z)=\exp(-\lVert x-z\rVert^2/(2\sigma^2))$ with $\sigma=1$, $x=(0,0)$, $z=(1,1)$, what is $K(x,z)$?`,
        sol: R`$\lVert x-z\rVert^2=2$, so $e^{-2/2}=e^{-1}$. It is a similarity: 1 for the same point, approaching 0 as the points move apart.` },
      { q: R`For $\varphi\in\mathbb R^{d\times n}$ and $\lambda>0$, prove the push-through identity $(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$, and use it to derive the kernel ridge prediction $f^*(x)=K(x,X)(\lambda I+K)^{-1}y$.`,
        sol: R`
**Invertibility.** For $v\ne0$, $v^T(\lambda I_d+\varphi\varphi^T)v=\lambda\lVert v\rVert^2+\lVert\varphi^Tv\rVert^2>0$, and in the same way $\lambda I_n+\varphi^T\varphi\succ0$. Both are invertible.

**Identity.** $(\lambda I_d+\varphi\varphi^T)\varphi=\lambda\varphi+\varphi\varphi^T\varphi=\varphi(\lambda I_n+\varphi^T\varphi)$. Multiplying by $(\lambda I_d+\varphi\varphi^T)^{-1}$ on the left and $(\lambda I_n+\varphi^T\varphi)^{-1}$ on the right gives the result.

**Kernel ridge.** From the gradient of $J=\frac12\lVert y-\varphi^T\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$, $-\varphi y+\varphi\varphi^T\beta+\lambda\beta=0$, we get $\beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y$. Therefore
$$f^*(x)=\varphi(x)^T\beta^*=\underbrace{\varphi(x)^T\varphi}_{K(x,X)}\big(\lambda I_n+\underbrace{\varphi^T\varphi}_{K}\big)^{-1}y.$$`,
        rubric: R`
- Invertibility of the two matrices — 2 pts
- Expanding the identity and multiplying on both sides — 3 pts
- $\beta^*$ from the ridge gradient — 2 pts
- Applying push-through and writing it with kernels — 3 pts` },
      { q: R`As in the lecture notes, set $\beta=\varphi(X)\alpha$, write the kernel ridge objective as a function of $\alpha$, and obtain $\alpha^*=(K+\lambda I)^{-1}y$ from $\nabla_\alpha J=0$. If $K$ is singular, $\alpha$ may not be unique; show that the prediction $f(x)=K(x,X)\alpha$ is unique nonetheless.`,
        sol: R`
$\varphi^T\beta=\varphi^T\varphi\alpha=K\alpha$ and $\beta^T\beta=\alpha^T\varphi^T\varphi\alpha=\alpha^TK\alpha$.
$J(\alpha)=\frac12(y-K\alpha)^T(y-K\alpha)+\frac\lambda2\alpha^TK\alpha=\frac12(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha)+\frac\lambda2\alpha^TK\alpha$ (since $K$ is symmetric, $\alpha^TKy=y^TK\alpha$).
$\nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big)$. Since $K+\lambda I$ is invertible, $\alpha^*=(K+\lambda I)^{-1}y$ is a solution.

**Uniqueness.** If $\alpha,\alpha'$ both satisfy $\nabla J=0$, then $K(K+\lambda I)\alpha=Ky=K(K+\lambda I)\alpha'$, so $\delta=\alpha-\alpha'$ satisfies $K(K+\lambda I)\delta=0$. Multiplying on the left by $\delta^T$ gives $\lVert K\delta\rVert^2+\lambda\,\delta^TK\delta=0$; both terms are $\ge0$, so $\delta^TK\delta=\lVert\varphi\delta\rVert^2=0$, i.e., $\varphi\delta=0$. Then $K(x,X)\delta=\varphi(x)^T\varphi\delta=0$, so the predictions are the same.`,
        rubric: R`
- Substituting $K\alpha$ and $\alpha^TK\alpha$ — 2 pts
- Expansion and gradient — 4 pts
- $\alpha^*$ — 2 pts
- Uniqueness of the prediction — 2 pts` },
      // more-04
      { q: R`For the linear model $y=X\beta+\varepsilon$ with noise $\varepsilon\sim\N(0,\sigma^2I)$ and prior $\beta\sim\N(0,\tau^2I)$, derive that the MAP estimator of $\beta$ is the ridge solution $(\lambda I+X^TX)^{-1}X^Ty$ with $\lambda=\sigma^2/\tau^2$. Also state why the solution is unique.`,
        sol: R`
$\log p(\beta\mid y)=\log p(y\mid\beta)+\log p(\beta)+C=-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2-\frac1{2\tau^2}\lVert\beta\rVert^2+C'$.
Multiplying by $\sigma^2>0$ and flipping the sign, MAP $=\argmin_\beta\ \frac12\lVert y-X\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$ with $\lambda=\sigma^2/\tau^2$.
The gradient $X^TX\beta-X^Ty+\lambda\beta=0$ gives $(\lambda I+X^TX)\beta=X^Ty$.
For $v\ne0$, $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$, so the matrix is positive definite and hence invertible, and since the Hessian is positive definite the objective is strongly convex — the point with zero gradient is the unique minimizer.`,
        rubric: R`
- Log posterior and dropping constants — 3 pts
- The ridge form and $\lambda=\sigma^2/\tau^2$ — 2 pts
- Gradient and solution — 2 pts
- Positive definiteness and uniqueness — 3 pts` },
      { q: R`For $z\in\mathbb R$ and $\lambda>0$, show that the solution of $\min_\beta\ g(\beta)=\frac12(\beta-z)^2+\lambda\lvert\beta\rvert$ is $\hat\beta=\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$ (the soft threshold).`,
        sol: R`
$g$ is convex (a sum of convex functions). Split into cases.
- $\beta>0$: $g'=\beta-z+\lambda=0\Rightarrow\beta=z-\lambda$. For this point to satisfy $\beta>0$ we need $z>\lambda$.
- $\beta<0$: $g'=\beta-z-\lambda=0\Rightarrow\beta=z+\lambda$, and $\beta<0$ requires $z<-\lambda$.
- $\lvert z\rvert\le\lambda$: for $\beta>0$, $g'=\beta-z+\lambda>0$ (increasing), and for $\beta<0$, $g'=\beta-z-\lambda<0$ (decreasing), so the minimum is at $\beta=0$.
Combining the three cases, $\hat\beta=\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$. (With subdifferentials: $0\in\beta-z+\lambda\,\partial\lvert\beta\rvert$, $\partial\lvert0\rvert=[-1,1]$.)`,
        rubric: R`
- Convexity — 1 pt
- Stationary points and conditions for $\beta>0$ and $\beta<0$ — 5 pts
- Why 0 is the minimizer when $\lvert z\rvert\le\lambda$ — 4 pts` },
      { q: R`In the problem above with $z=3$ and $\lambda=1$, what is $\hat\beta$? (The ridge version $\frac12(\beta-z)^2+\frac\lambda2\beta^2$ has solution $z/(1+\lambda)=1.5$ under the same conditions.)`,
        sol: R`$\lvert z\rvert=3>\lambda=1$, so $\hat\beta=3-1=2$. Had $z=0.5$, it would be exactly 0 (ridge gives $0.25$).` },
      { q: R`What generally happens when the $\lambda$ of ridge is increased?`,
        choices: [R`bias↓, variance↑`, R`bias↑, variance↓`, R`both bias and variance↓`, R`training error↓`],
        sol: R`The coefficients are pressed toward 0, so the average prediction moves away from the truth (bias↑) while the fluctuation across data sets decreases (variance↓). The training error increases.` },
      { q: R`From the log-likelihood of the linear model with Gaussian noise, $\ell(\beta,\sigma^2)=-\frac n2\log(2\pi\sigma^2)-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2$, show that the MLE of $\sigma^2$ is $\hat\sigma^2=\frac1n\lVert y-X\hat\beta\rVert^2$.`,
        sol: R`
Maximizing over $\beta$ gives the least-squares solution $\hat\beta$ regardless of $\sigma^2$. Plug it in and maximize $h(s)=-\frac n2\log(2\pi s)-\frac{f}{2s}$ ($s=\sigma^2$, $f=\lVert y-X\hat\beta\rVert^2$).
$h'(s)=-\frac n{2s}+\frac f{2s^2}=0\iff s=f/n$. If $s<f/n$ then $h'>0$, and if $s>f/n$ then $h'<0$, so it is a maximum. Hence $\hat\sigma^2=f/n$.`,
        rubric: R`
- Why $\beta$ can be optimized first — 3 pts
- Differentiating in $\sigma^2$ — 4 pts
- Confirming a maximum — 3 pts` },
      { q: R`Doing kernel ridge with the one-dimensional linear kernel $K(x,z)=xz$, data $x=(1,2)$, $y=(1,3)$, and $\lambda=1$, what is the prediction at $x=3$?`,
        sol: R`$K=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, $\lambda I+K=\begin{pmatrix}2&2\\2&5\end{pmatrix}$, $\det=6$. $\alpha^*=\frac16\begin{pmatrix}5&-2\\-2&2\end{pmatrix}\begin{pmatrix}1\\3\end{pmatrix}=\frac16(-1,4)$. $K(3,X)=[3,6]$, $f=\frac{-3+24}6=3.5$.
Check (primal form): $\beta=(\lambda+\sum x^2)^{-1}\sum xy=\frac{7}{6}$, $3\beta=3.5$.` },
      { q: R`Doing kernel ridge with the one-dimensional Gaussian kernel ($\sigma=1$), data $x=(0,1)$, $y=(0,1)$, and $\lambda=0.5$, what is the prediction at $x=0.5$? (4 decimal places)`,
        sol: R`$K=\begin{pmatrix}1&e^{-1/2}\\e^{-1/2}&1\end{pmatrix}$, $e^{-1/2}\approx0.6065$. The determinant of $\lambda I+K$ is $1.5^2-0.3679=1.8821$. $\alpha^*=\frac1{1.8821}(-0.6065,\ 1.5)\approx(-0.3223,\ 0.7970)$. $K(0.5,X)=[e^{-1/8},e^{-1/8}]\approx[0.8825,0.8825]$. $f\approx0.8825(0.4747)\approx0.4189$.` },
      { q: R`For a $d\times n$ matrix $A$ and $\lambda>0$, show (i) that $\lambda I_d+AA^T$ and $\lambda I_n+A^TA$ are invertible, and (ii) prove $(\lambda I_d+AA^T)^{-1}A=A(\lambda I_n+A^TA)^{-1}$.`,
        sol: R`
**(i)** For $v\ne0$, $v^T(\lambda I+AA^T)v=\lambda\lVert v\rVert^2+\lVert A^Tv\rVert^2>0$ — positive definite, hence invertible. Likewise for $\lambda I+A^TA$ (with $\lVert Av\rVert^2$).
**(ii)** $(\lambda I_d+AA^T)A=\lambda A+AA^TA=A(\lambda I_n+A^TA)$. Multiplying by $(\lambda I_d+AA^T)^{-1}$ on the left and $(\lambda I_n+A^TA)^{-1}$ on the right gives $A(\lambda I_n+A^TA)^{-1}=(\lambda I_d+AA^T)^{-1}A$.`,
        rubric: R`
- (i) positive definiteness of the two matrices — 4 pts
- (ii) the commutation relation $(\lambda I+AA^T)A=A(\lambda I+A^TA)$ — 3 pts
- The order of multiplying by the inverses on both sides — 3 pts` },
      { q: R`For $x,z\in\mathbb R^2$, find a feature map $\varphi:\mathbb R^2\to\mathbb R^6$ with $K(x,z)=(x^Tz+1)^2=\varphi(x)^T\varphi(z)$ and check it by expansion.`,
        sol: R`
$(x_1z_1+x_2z_2+1)^2=x_1^2z_1^2+x_2^2z_2^2+1+2x_1x_2z_1z_2+2x_1z_1+2x_2z_2$.
With $\varphi(x)=(x_1^2,\ x_2^2,\ \sqrt2x_1x_2,\ \sqrt2x_1,\ \sqrt2x_2,\ 1)$, $\varphi(x)^T\varphi(z)$ equals exactly the six terms above.`,
        rubric: R`
- Expansion — 4 pts
- The feature map with coefficients $\sqrt2$ — 4 pts
- Check — 2 pts` },
      { q: R`Show that if $K_1,K_2$ are kernels (the Gram matrix on every finite data set is symmetric positive semidefinite), then $K_1+K_2$ and $cK_1$ ($c>0$) are kernels. Also show by a counterexample that $K(x,z)=x^Tz-1$ is not a kernel.`,
        sol: R`
For data $x_1,\dots,x_n$ and $v\in\mathbb R^n$, if the Gram matrices $G_1,G_2$ are positive semidefinite then $v^T(G_1+G_2)v=v^TG_1v+v^TG_2v\ge0$ and $v^T(cG_1)v=c\,v^TG_1v\ge0$. Symmetry is preserved too, so they are kernels.
For $K(x,z)=x^Tz-1$ and the single point $x=0$, the Gram matrix $[K(0,0)]=[-1]$ is negative, not positive semidefinite. (A kernel must have $K(x,x)=\lVert\varphi(x)\rVert^2\ge0$.)`,
        rubric: R`
- Sum and positive multiple of Gram matrices — 6 pts
- The counterexample and the necessity of $K(x,x)\ge0$ — 4 pts` },
      // quizprep-a
      { q: R`The $L_1$ that the Laplace distribution $p(u)=\frac1{2b}e^{-\lvert u\rvert/b}$ ($b\gt0$) produces.
1. In $y_i=x_i^T\beta+\varepsilon_i$, if the $\varepsilon_i$ are independent with the Laplace distribution above, show that the MLE of $\beta$ minimizes $\sum_i\lvert y_i-x_i^T\beta\rvert$.
2. If the noise is $\N(0,\sigma^2)$ and the prior is an independent Laplace on each component, $p(\beta_j)=\frac1{2b}e^{-\lvert\beta_j\rvert/b}$, show that MAP is the solution of the lasso $\argmin_\beta\lVert y-X\beta\rVert^2+\lambda\lVert\beta\rVert_1$ and find $\lambda$.
3. In the intercept-only model ($x_i=1$), show with the data $y=(1,2,10)$ that the MLE of 1 is the sample median, and compare with the MLE under Gaussian noise (the sample mean) to explain the effect of an outlier.`,
        sol: R`
**1.** By independence the log-likelihood is $\sum_i\big[-\log(2b)-\lvert y_i-x_i^T\beta\rvert/b\big]$. The first term and the positive factor $1/b$ do not move the minimizer, so $\hat\beta_{\text{MLE}}=\argmin\sum_i\lvert y_i-x_i^T\beta\rvert$.
**2.** $\log p(\beta\mid y)=-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2-\frac1b\sum_j\lvert\beta_j\rvert+C$. Multiplying by the positive number $2\sigma^2$ and flipping the sign,
$$\hat\beta_{\text{MAP}}=\argmin_\beta\ \lVert y-X\beta\rVert^2+\frac{2\sigma^2}b\lVert\beta\rVert_1,\qquad\lambda=\frac{2\sigma^2}b.$$
The narrower the prior (smaller $b$), the stronger the regularization.
**3.** $g(\beta)=\lvert1-\beta\rvert+\lvert2-\beta\rvert+\lvert10-\beta\rvert$ is piecewise linear, and its slope is (number of points below $\beta$) $-$ (number above): $-3$ for $\beta\lt1$, $-1$ for $1\lt\beta\lt2$, $+1$ for $2\lt\beta\lt10$, $+3$ for $\beta\gt10$. The point where the slope turns from negative to positive, $\beta=2$ (the median), is the minimizer, with $g(2)=9$. The sample mean $13/3\approx4.33$ is dragged by the outlier 10, but the median would stay put even if 10 became 100 — the $L_1$ loss is robust to outliers.`,
        rubric: R`
- Laplace likelihood → $L_1$ loss — 3 pts
- MAP = lasso and $\lambda$ — 4 pts
- The median argument and the comparison with outliers — 3 pts` },
      { q: R`$y=X\beta+\varepsilon$, $\varepsilon\sim\N(0,\sigma^2I_n)$, $X^TX=I_p$ (orthonormal columns).
1. Show that the ridge solution $\hat\beta_\lambda=\argmin_\beta\lVert y-X\beta\rVert^2+\lambda\lVert\beta\rVert^2$ is $\hat\beta_\lambda=\frac1{1+\lambda}X^Ty=\frac1{1+\lambda}\hat\beta_{\text{OLS}}$.
2. Show that $\hat\beta_{\text{OLS}}=X^Ty\sim\N(\beta,\sigma^2I_p)$, and compute the bias, variance, and MSE of each ridge component $j$.
3. For $\lambda\gt0$, show that $\mathrm{MSE}(\hat\beta_{\lambda,j})\lt\mathrm{MSE}(\hat\beta_{\text{OLS},j})\iff\beta_j^2\lt\sigma^2\big(1+\frac2\lambda\big)$, and explain how it corresponds to the condition $\theta^2\lt2\tau^2+\frac1n$ of Problem 2 of Problem Set 1.`,
        sol: R`
**1.** The gradient $-2X^T(y-X\beta)+2\lambda\beta=0$ gives $(X^TX+\lambda I)\beta=X^Ty$, i.e., $(1+\lambda)\beta=X^Ty$. The Hessian $2(1+\lambda)I\succ0$ makes it a minimizer.
**2.** $X^Ty=X^TX\beta+X^T\varepsilon=\beta+X^T\varepsilon$. $X^T\varepsilon$ is a linear transformation of a Gaussian, hence Gaussian, with mean 0 and covariance $X^T(\sigma^2I)X=\sigma^2I$. Hence $\hat\beta_{\text{OLS}}\sim\N(\beta,\sigma^2I)$. For component $j$ of ridge:
$$\text{bias}=\frac{\beta_j}{1+\lambda}-\beta_j=-\frac{\lambda\beta_j}{1+\lambda},\quad\text{variance}=\frac{\sigma^2}{(1+\lambda)^2},\quad\mathrm{MSE}=\frac{\lambda^2\beta_j^2+\sigma^2}{(1+\lambda)^2}.$$
**3.** The MSE of OLS is $\sigma^2$ (bias 0). $\lambda^2\beta_j^2+\sigma^2\lt\sigma^2(1+\lambda)^2\iff\lambda^2\beta_j^2\lt2\lambda\sigma^2+\lambda^2\sigma^2\iff\beta_j^2\lt\sigma^2(1+\frac2\lambda)$ (the last step divides by the positive number $\lambda^2$).
Correspondence: in PS1, $\bar X\sim\N(\theta,\frac1n)$ and $\hat\theta=\frac1{1+1/(n\tau^2)}\bar X$. Substituting $\sigma^2\leftrightarrow\frac1n$ and $\lambda\leftrightarrow\frac1{n\tau^2}$ gives $\sigma^2(1+\frac2\lambda)=\frac1n+2\tau^2$ — the same condition. Ridge performs the shrinkage of PS1 in each coordinate.`,
        rubric: R`
- The ridge solution — 2 pts
- The OLS distribution (mean, covariance) — 2 pts; bias, variance, MSE — 2 pts
- The iff condition — 2 pts; the correspondence with PS1 — 2 pts` },
    ],
  };
})();
