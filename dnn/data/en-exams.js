/* English text — mock exams I–V (exams.js, exams-2.js). Problems are listed in the same order as in each exam. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.ex, {
  x1: {
    kind: 'Weeks 1–2', title: 'Regression, Probability, Information Theory, Kernels', scopeText: 'Units 01–04',
    desc: 'The normal equations, MLE, MAP and Bayesian posteriors, KL and mutual information, ridge and kernel ridge. Checks whether you can reproduce the proofs from the class notes.',
    probs: [
      { q: R`Which is the correct gradient of $f(\beta)=\lVert y-X\beta\rVert^2$?`,
        choices: [R`$2X^T(y-X\beta)$`, R`$-2X^T(y-X\beta)$`, R`$-2(y-X\beta)^TX$`, R`$2XX^T\beta-2Xy$`],
        sol: R`$f=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$, $\nabla f=-2X^Ty+2X^TX\beta=-2X^T(y-X\beta)$. The gradient is a column vector.` },
      { q: R`When $y=\beta_0+\beta_1x$ is fitted by least squares to the data $(x,y)=(1,1),(2,3),(3,2)$, what is $\hat\beta_0$?`,
        sol: R`$X^TX=\begin{pmatrix}3&6\\6&14\end{pmatrix}$, $X^Ty=(6,13)$. $\det=42-36=6$. $\hat\beta=\frac16(14\cdot6-6\cdot13,\ -6\cdot6+3\cdot13)=\frac16(6,3)=(1,0.5)$.` },
      { q: R`A disease has prevalence 2%, the test's sensitivity is $P(+\mid D)=0.95$, and its false positive rate is $P(+\mid D^c)=0.05$. What is the probability of having the disease given a positive test? (3 decimal places)`,
        sol: R`$P(+)=0.95(0.02)+0.05(0.98)=0.019+0.049=0.068$. $P(D\mid+)=0.019/0.068\approx0.279$.` },
      { q: R`With a uniform prior and Bernoulli data $n=6$ with $S=6$ successes, which is correct?`,
        choices: [R`$\hat\theta_{\text{MLE}}=\hat\theta_{\text{MAP}}=1$ and the posterior mean is $7/8$`, R`$\hat\theta_{\text{MLE}}=1$, $\hat\theta_{\text{MAP}}=6/7$`, R`The posterior is $\operatorname{Beta}(6,0)$`, R`The posterior mean is 1`],
        sol: R`The posterior is $\operatorname{Beta}(7,1)$ with density $7\theta^6$, maximized at $\theta=1$, so MAP = MLE = 1. The posterior mean is $\frac7{8}$. With a uniform prior, the MAP equals the MLE.` },
      { q: R`If $X$ is uniform on $\{1,2,3,4\}$ and $Y=X\bmod2$, what is $I(X;Y)$ (in bits)?`,
        sol: R`$Y$ is a function of $X$, so $H(Y\mid X)=0$ and $I=H(Y)-0=1$ bit ($Y$ is a fair coin).` },
      { q: R`Which of the following **always** holds?`,
        choices: [R`$\KL(p\Vert q)=\KL(q\Vert p)$`, R`$H_p(q)\ge H(p)$`, R`$H(X,Y)\ge H(X)+H(Y)$`, R`$I(X;Y)\le0$`],
        sol: R`$H_p(q)=H(p)+\KL(p\Vert q)\ge H(p)$. The others are false ($H(X,Y)=H(X)+H(Y)-I\le H(X)+H(Y)$).` },
      { q: R`With the kernel $K(x,z)=x^Tz$ (linear), data $x_1=1,\ y_1=2$, $x_2=2,\ y_2=2$ (one-dimensional), and $\lambda=1$, what is the kernel ridge prediction at $x=3$?`,
        sol: R`$K=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, $K+I=\begin{pmatrix}2&2\\2&5\end{pmatrix}$, $\det=6$. $\alpha^*=\frac16\begin{pmatrix}5&-2\\-2&2\end{pmatrix}\begin{pmatrix}2\\2\end{pmatrix}=\frac16\begin{pmatrix}6\\0\end{pmatrix}=\begin{pmatrix}1\\0\end{pmatrix}$. $K(3,X)=[3,\ 6]$, so $f^*(3)=3$.
Check (the primal ridge problem): $\hat\beta=\frac{X^Ty}{\lambda+X^TX}=\frac{2+4}{1+5}=1$, $f(3)=3\hat\beta=3$. Kernel ridge with a linear kernel is ordinary ridge.` },
      { q: R`Prove $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$ by computing in components, and use it to derive the normal equations $X^TX\hat\beta=X^Ty$. Also state the condition for $X^TX$ to be invertible.`,
        rubric: R`
- $\partial_k\sum_{i,j}\beta_iA_{ij}\beta_j=(A\beta)_k+(A^T\beta)_k$ — 5 pts
- Expanding $f$ and combining the cross terms by transposing a scalar — 3 pts
- The normal equations from gradient 0 — 3 pts
- The invertibility condition: the columns of $X$ are linearly independent ($Xv=0\Rightarrow v=0$) — 3 pts`,
        sol: R`
$\frac{\partial}{\partial\beta_k}\sum_{i,j}\beta_iA_{ij}\beta_j=\sum_jA_{kj}\beta_j+\sum_iA_{ik}\beta_i=(A\beta+A^T\beta)_k$.
$f=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$ ($y^TX\beta=\beta^TX^Ty$). $\nabla f=-2X^Ty+2X^TX\beta=0\Rightarrow X^TX\beta=X^Ty$.
$X^TXv=0\Rightarrow\lVert Xv\rVert^2=0\Rightarrow Xv=0$, so if the columns of $X$ are linearly independent, $v=0$, $X^TX$ is invertible, and $\hat\beta=(X^TX)^{-1}X^Ty$.` },
      { q: R`(1) Using Jensen's inequality, prove $\KL(p\Vert q)\ge0$ and the equality condition. (2) Use it to show $H_p(q)\ge H(p)$ and $I(X;Y)\ge0$.`,
        rubric: R`
- (1) Introducing the support $E$, the case $q=0$ — 2 pts
- (1) Convexity of $-\log$ and applying Jensen — 5 pts
- (1) $\sum_Eq\le1$ — 2 pts
- (1) The equality condition — 3 pts
- (2) Deriving $H_p(q)=H(p)+\KL$ — 3 pts
- (2) $I=\KL(p(x,y)\Vert p(x)p(y))\ge0$ — 3 pts`,
        sol: R`
(1) $E=\{p>0\}$. $\KL=\sum_Ep\,[-\log\frac qp]\ge-\log\sum_Ep\frac qp=-\log\sum_Eq\ge0$. Equality: $q/p$ is constant on $E$ and $\sum_Eq=1$ ⇒ $q=p$.
(2) $\KL=\sum p\log p-\sum p\log q=-H(p)+H_p(q)\ge0$. $I(X;Y)$ is the KL between the joint distribution and the product distribution, so $\ge0$.` },
      { q: R`For Bernoulli data with $S$ successes and $n-S$ failures and prior $\operatorname{Beta}(a,b)$, show that the posterior is $\operatorname{Beta}(a+S,b+n-S)$, including the normalizing constant, and derive the MAP estimator $\frac{S+a-1}{n+a+b-2}$ ($a+S>1$, $b+n-S>1$). Finally, explain that the MAP has the form “data-fit loss + regularization”.`,
        rubric: R`
- The form of likelihood × prior — 4 pts
- Computing the normalizing constant with the beta function — 5 pts
- The MAP by differentiating the log posterior — 5 pts
- Interpreting $-\log p(x\mid\theta)-\log p(\theta)$ — 4 pts`,
        sol: R`
$p(D\mid\theta)p(\theta)=\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a,b)}$. Evidence $=\frac{B(a+S,b+n-S)}{B(a,b)}$. Dividing gives $\frac{\theta^{a+S-1}(1-\theta)^{b+n-S-1}}{B(a+S,b+n-S)}=\operatorname{Beta}(a+S,b+n-S)$.
Log: $(a+S-1)\log\theta+(b+n-S-1)\log(1-\theta)$; setting the derivative to 0, $\frac{a+S-1}\theta=\frac{b+n-S-1}{1-\theta}$ ⇒ $\theta=\frac{a+S-1}{n+a+b-2}$ (a maximum since the second derivative is negative).
$\hat\theta_{\text{MAP}}=\argmin[-\log p(D\mid\theta)-\log p(\theta)]$: the first term is the negative log-likelihood (data fit), and the second, $-(a-1)\log\theta-(b-1)\log(1-\theta)$, is a regularizer pulling $\theta$ toward the mode of the prior.` },
    ],
  },
  x2: {
    kind: 'Week 3', title: 'Logistic, Softmax, SVM, Neural Networks', scopeText: 'Units 05–08',
    desc: 'Losses, gradients, and convexity of linear classifiers, the margin and dual problem of the SVM, and the structure of neural networks. Mostly the proofs from the Week 3 notes.',
    probs: [
      { q: R`If $\sigma(z)=0.2$, what is $\sigma'(z)$?`,
        sol: R`$\sigma'=\sigma(1-\sigma)=0.2\times0.8=0.16$.` },
      { q: R`Which is **not** correct about the Hessian $X^TSX$ of the logistic regression loss?`,
        choices: [R`It is positive semidefinite`, R`It does not depend on the labels $y_i$`, R`The diagonal entries of $S$ are at most $\frac14$`, R`It is always invertible`],
        sol: R`If the columns of $X$ are linearly dependent (e.g., fewer data points than dimensions), $X^TSX$ is singular. The rest are true.` },
      { q: R`With logits $z=(2,1,0)$ and correct class 3, what is the loss $-\log p_3$ (natural log, 3 decimal places)?`,
        sol: R`$p_3=\frac{1}{e^2+e+1}$, $-\log p_3=\ln(e^2+e+1)=\ln(11.107)\approx2.408$.` },
      { q: R`In the problem above, what is $\partial J/\partial z_1$? (3 decimal places)`,
        sol: R`$\partial J/\partial z_m=p_m-y_m$, and $y_1=0$, so $p_1=e^2/11.107\approx0.665$.` },
      { q: R`If the solution of a hard-margin SVM is $w=(1,1)$, $b=-3$, what is the distance from the point $(1,1)$ to the decision plane?`,
        sol: R`$\lvert1+1-3\rvert/\sqrt2=1/\sqrt2$. This point lies on $w^Tx+b=-1$, so it is a support vector of the negative class, and the distance equals the margin $1/\lVert w\rVert=1/\sqrt2$.` },
      { q: R`In the SVM dual problem, which is correct about the points with $\alpha_i>0$?`,
        choices: [R`They are outside the margin`, R`They are support vectors satisfying $y_i(x_i^Tw+b)=1$`, R`They are misclassified points`, R`They do not contribute to $w$`],
        sol: R`By KKT complementary slackness $\alpha_i(1-y_i(\cdot))=0$, if $\alpha_i>0$ then $y_i(\cdot)=1$.` },
      { q: R`How many parameters does the MLP $784\to256\to10$ (with biases) have?`,
        sol: R`$785\cdot256+257\cdot10=200{,}960+2{,}570=203{,}530$.` },
      { q: R`Simplify the negative log-likelihood of logistic regression to $\sum_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i$, find the gradient and the Hessian, and prove that the loss is convex.`,
        rubric: R`
- The Bernoulli likelihood and the negative log — 3 pts
- Simplifying with $-\log(1-\sigma)=z+\log(1+e^{-z})$ — 3 pts
- The gradient $\sum(\sigma_i-y_i)x_i$ — 3 pts
- The Hessian $\sum\sigma_i(1-\sigma_i)x_ix_i^T=X^TSX$ — 4 pts
- $v^TX^TSXv=\sum s_i(x_i^Tv)^2\ge0$ and convexity — 3 pts`,
        sol: R`
$-\log L=\sum[y_i\log(1+e^{-z_i})+(1-y_i)(z_i+\log(1+e^{-z_i}))]=\sum\log(1+e^{-z_i})+\sum(1-y_i)z_i$.
$\nabla=\sum[-(1-\sigma_i)+(1-y_i)]x_i=\sum(\sigma_i-y_i)x_i$. $\nabla^2=\sum\sigma_i'x_ix_i^T=X^TSX$, $s_i=\sigma_i(1-\sigma_i)>0$.
$v^T\nabla^2v=\sum s_i(x_i^Tv)^2\ge0$ ⇒ PSD ⇒ convex (stationary point = global minimum).` },
      { q: R`(1) Derive the distance between a point $x$ and the hyperplane $w^Tz+b=0$. (2) Use the scale invariance of the margin to turn the margin maximization problem into $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$. (3) Derive the dual problem from the Lagrangian.`,
        rubric: R`
- (1) $x_p=x-\alpha w$, $\alpha=\frac{w^Tx+b}{w^Tw}$, the distance — 5 pts
- (2) Scale invariance and the normalization $\min\lvert w^Tx_i+b\rvert=1$ — 4 pts
- (2) Equivalence of the constraints and of the objectives — 3 pts
- (3) The two stationarity conditions — 4 pts
- (3) Substituting to get the dual objective — 4 pts`,
        sol: R`
(1) From $w^T(x-\alpha w)+b=0$, $\alpha=\frac{w^Tx+b}{w^Tw}$, and the distance is $\lvert\alpha\rvert\lVert w\rVert=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert}$.
(2) $r(\beta w,\beta b)=r(w,b)$, so setting $\min_i\lvert w^Tx_i+b\rvert=1$ gives $r=1/\lVert w\rVert$; $y_i(\cdot)\ge0$ with $\min\lvert\cdot\rvert=1$ gives the same optimal solution as $y_i(\cdot)\ge1$. $\max1/\lVert w\rVert\iff\min\frac12\lVert w\rVert^2$.
(3) $L_p=\frac12w^Tw+\sum\alpha_i(1-y_i(x_i^Tw+b))$. $\nabla_w=0\Rightarrow w=\sum\alpha_iy_ix_i$, $\partial_b=0\Rightarrow\sum\alpha_iy_i=0$. Substituting: $\max_{\alpha\ge0}\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$ s.t. $\sum\alpha_iy_i=0$.` },
      { q: R`For the softmax $p_k=e^{z_k}/\sum_je^{z_j}$, find $\partial p_k/\partial z_m$, and derive the weight gradient $\partial J/\partial w_{mn}=(p_m-y_m)x_n$ ($z_k=w_k^Tx$) of the cross-entropy $J=-\sum_ky_k\log p_k$ with one-hot $y$. Also show that it becomes logistic regression when $C=2$.`,
        rubric: R`
- $p_k(\delta_{km}-p_m)$ by the quotient rule — 5 pts
- $\partial J/\partial z_m=p_m-y_m$ (using the one-hot condition) — 5 pts
- $w_{mn}$ by the chain rule — 3 pts
- $\sigma(z_1-z_2)$ for $C=2$ — 3 pts`,
        sol: R`
$\partial p_k/\partial z_m=\delta_{km}p_k-p_kp_m$. $\partial J/\partial z_m=-\sum_ky_k(\delta_{km}-p_m)=p_m-y_m$. Since $\partial z_m/\partial w_{mn}=x_n$, $\partial J/\partial w_{mn}=(p_m-y_m)x_n$.
$C=2$: $p_1=\frac1{1+e^{-(z_1-z_2)}}=\sigma((w_1-w_2)^Tx)$.` },
    ],
  },
  x3: {
    kind: 'Midterm-style · Weeks 1–4 combined', title: 'Derivations and Proofs Combined', scopeText: 'Units 01–13',
    desc: 'The whole range of Weeks 1–4. Checks whether you can write from scratch the theorems proved in the notes (the normal equations, KL, push-through, SVM, Xavier/He, the descent lemma).',
    probs: [
      { q: R`For $\lambda>0$, which equals $(\lambda I+\varphi\varphi^T)^{-1}\varphi$? ($\varphi\in\mathbb R^{d\times n}$)`,
        choices: [R`$\varphi(\lambda I+\varphi\varphi^T)^{-1}$`, R`$\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$`, R`$(\lambda I+\varphi^T\varphi)^{-1}\varphi$`, R`$\varphi^T(\lambda I+\varphi\varphi^T)^{-1}$`],
        sol: R`The push-through identity. Looking at the sizes, $(\lambda I_n+\varphi^T\varphi)$ is $n\times n$, so it can only multiply $\varphi$ on the right.` },
      { q: R`For $f=\max(x,y)\cdot z$ at $(x,y,z)=(2,5,-3)$, what is $\partial f/\partial y$?`,
        sol: R`$m=\max(2,5)=5$ ($y$ is selected), $\partial f/\partial m=z=-3$, and the max gate passes it to $y$: $-3$. $\partial f/\partial x=0$.` },
      { q: R`If the variance of a sample gradient is $\sigma^2=9$, what is the smallest batch size that makes the standard deviation of the minibatch gradient at most $0.5$ (i.i.d. sampling)?`,
        sol: R`$\sqrt{9/B}\le0.5\iff B\ge36$.` },
      { q: R`For a ReLU layer with $D_{in}=200$, what is the weight variance of He initialization?`,
        sol: R`$2/D_{in}=2/200=0.01$ (standard deviation $0.1$).` },
      { q: R`Which is correct about inference-mode BN?`,
        choices: [R`It uses the mean and variance of the current batch`, R`It uses running averages accumulated during training and becomes a per-channel affine map`, R`It does not use $\gamma,\beta$`, R`It cannot be used with batch size 1`],
        sol: R`It can be fused into the preceding layer as $y_j=a_jx_j+b_j$.` },
      { q: R`When GD is applied to $f(x)=\frac12x^T\begin{pmatrix}4&0\\0&1\end{pmatrix}x$, what is the upper bound on the learning rate for which the descent lemma guarantees a decrease?`,
        sol: R`$\beta=\lambda_{\max}=4$, $2/\beta=0.5$.` },
      { q: R`For the function above with $x_0=(1,1)$ and $\eta=0.25$, what is $f(x_1)$ after one GD step?`,
        sol: R`$\nabla f=(4x_1,x_2)=(4,1)$, $x_1=(1-1,\ 1-0.25)=(0,0.75)$. $f=\frac12(0+0.5625)=0.28125$. The lemma's upper bound: $f(x_0)-(\eta-\frac{4\eta^2}2)\lVert\nabla f\rVert^2=2.5-(0.25-0.125)17=0.375\ge0.28125$ ✓.` },
      { q: R`For a $C^2$ function $f$ whose gradient $\nabla f$ is $\beta$-Lipschitz, (1) show $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$, (2) prove the descent lemma with the auxiliary function $g(t)=f(x+t(y-x))$ and Taylor's formula in integral form, and (3) show that $x_{t+1}=x_t-\eta\nabla f(x_t)$ decreases $f$ when $\eta<2/\beta$.`,
        rubric: R`
- (1) The limit expression of the Hessian–vector product and the norm bound — 5 pts
- (2) $g'$, $g''$ by the chain rule — 3 pts
- (2) $g(1)=g(0)+g'(0)+\int(1-s)g''$ (justified by integration by parts) — 4 pts
- (2) $\frac\beta2\lVert y-x\rVert^2$ from the curvature bound — 3 pts
- (3) Substitution and the condition $(\eta-\frac{\beta\eta^2}2)>0$ — 5 pts`,
        sol: R`
(1) $\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s$, with norm $\le\beta\lVert v\rVert$. By Cauchy–Schwarz, $v^T\nabla^2fv\le\beta\lVert v\rVert^2$.
(2) $g'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$, $g''(t)=(y-x)^T\nabla^2f(\cdot)(y-x)\le\beta\lVert y-x\rVert^2$. $g(1)=g(0)+\int_0^1g'=g(0)+g'(0)+\int_0^1(1-s)g''(s)ds\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$.
(3) Substituting $y=x_t-\eta\nabla f(x_t)$: $f(x_{t+1})\le f(x_t)-(\eta-\frac{\beta\eta^2}2)\lVert\nabla f(x_t)\rVert^2$, and the bracket is positive if $0<\eta<2/\beta$.` },
      { q: R`For $z=\sum_{i=1}^{D_{in}}w_ix_i$ ($w_i$ independent, mean 0, variance $\sigma^2$, independent of $x$), show $\E[z^2]=D_{in}\sigma^2\E[x^2]$, and derive (1) the Xavier condition for a tanh layer with zero-mean inputs, and (2) the He condition for ReLU $h=\max(0,z)$ ($z\sim\N(0,q)$) by computing $\E[h^2]=q/2$ as an integral.`,
        rubric: R`
- Expanding the square and eliminating the cross terms — 4 pts
- (1) $\sigma^2=1/D_{in}$ — 3 pts
- (2) $\E[h^2]=q/2$ (symmetry or integration by parts) — 5 pts
- (2) $\sigma^2=2/D_{in}$ from preserving the second moment — 4 pts`,
        sol: R`
$\E z^2=\sum_i\E w_i^2\E x_i^2+\sum_{i\ne k}\E w_i\E[w_kx_ix_k]=D_{in}\sigma^2\E x^2$.
(1) If $\E x=0$, $\E x^2=\Var x$, and preservation $\Var z=\Var x$ ⇒ $\sigma^2=1/D_{in}$.
(2) $\E h^2=\int_0^\infty z^2\phi(z)dz=\frac12\int_{\mathbb R}z^2\phi=q/2$. $\E h^2=\frac12D_{in}\sigma^2\E x^2=\E x^2$ ⇒ $\sigma^2=2/D_{in}$.` },
      { q: R`In kernel ridge regression, substitute $\beta=\varphi(X)\alpha$, write the objective in terms of $\alpha$, and derive $\nabla_\alpha J=K((K+\lambda I)\alpha-y)$. Then, with $K(x,z)=(x^Tz)^2$, $x_1=(1,0),y_1=1$, $x_2=(0,2),y_2=2$, and $\lambda=1$, find the prediction at $x=(1,1)$.`,
        rubric: R`
- Substitution and expansion — 4 pts
- The gradient and $\alpha^*$ — 4 pts
- The numerical example: $K$, $\alpha^*$, $K(x,X)$, the prediction — 4 pts`,
        sol: R`
$J=\frac12\lVert y-K\alpha\rVert^2+\frac\lambda2\alpha^TK\alpha$, $\nabla_\alpha=-Ky+K^2\alpha+\lambda K\alpha=K((K+\lambda I)\alpha-y)$, $\alpha^*=(K+\lambda I)^{-1}y$.
Numbers: $K=\begin{pmatrix}1&0\\0&16\end{pmatrix}$ ($x_1^Tx_2=0$), $K+I=\diag(2,17)$, $\alpha^*=(\frac12,\frac2{17})$. $K(x,X)=[(1)^2,(2)^2]=[1,4]$. $f=\frac12+\frac8{17}=\frac{33}{34}\approx0.971$.` },
      { q: R`Prove the chain rule $H(X,Y)=H(X)+H(Y\mid X)$, and derive the mutual information $I(X;Y)=H(X)+H(Y)-H(X,Y)$.`,
        rubric: R`
- $\log p(x,y)=\log p(y\mid x)+\log p(x)$ and the expectation — 4 pts
- Obtaining $H(X)$ by marginalization — 2 pts
- Substituting the chain rule into $I=H(Y)-H(Y\mid X)$ — 4 pts`,
        sol: R`
$H(X,Y)=-\E[\log p(Y\mid X)]-\E[\log p(X)]=H(Y\mid X)+H(X)$.
$I=H(Y)-H(Y\mid X)=H(Y)-(H(X,Y)-H(X))=H(X)+H(Y)-H(X,Y)$.` },
    ],
  },
  x4: {
    kind: 'Problem Set 1 type · proofs', title: 'Divergences, MAP, SVM Duality, Max–Min', scopeText: 'Units 02 · 03 · 07',
    desc: 'The same types as the four problems of Problem Set 1 (the JS divergence, the Gaussian MAP and bias–variance, the dual of a two-point SVM, the max–min inequality), with changed conditions. The whole solution process is graded.',
    probs: [
      { q: R`For $\lambda\in(0,1)$ and two probability distributions $p,q$, define the **asymmetric JS divergence** $D_\lambda(p\Vert q)=\lambda\KL(p\Vert m_\lambda)+(1-\lambda)\KL(q\Vert m_\lambda)$, $m_\lambda=\lambda p+(1-\lambda)q$. Prove the following.
(i) $D_\lambda(p\Vert q)\ge0$ (ii) $D_\lambda(p\Vert q)=0\iff p=q$ (iii) $D_\lambda(p\Vert q)=D_{1-\lambda}(q\Vert p)$ (iv) $D_\lambda(p\Vert q)\le-\lambda\log\lambda-(1-\lambda)\log(1-\lambda)$.`,
        rubric: R`
- $m_\lambda$ is a probability distribution and the KL is finite ($m_\lambda\ge\lambda p$) — 2 pts
- (i) Non-negativity of KL and positive weights — 4 pts
- (ii) Both directions, “two nonnegative terms summing to 0 ⇒ each is 0”, the equality condition of Theorem 1 — 6 pts
- (iii) $m_{1-\lambda}(q,p)=m_\lambda(p,q)$ and swapping the weights — 4 pts
- (iv) The upper bound from $p/m_\lambda\le1/\lambda$, $q/m_\lambda\le1/(1-\lambda)$ — 6 pts`,
        sol: R`
$m_\lambda\ge0$ with sum $\lambda+(1-\lambda)=1$. If $p(x)>0$ then $m_\lambda(x)\ge\lambda p(x)>0$, so $\KL(p\Vert m_\lambda)<\infty$ (likewise for $q$).
**(i)** Both KL divergences are $\ge0$ and the weights $\lambda,1-\lambda>0$, so the sum is $\ge0$.
**(ii)** $p=q\Rightarrow m_\lambda=p\Rightarrow$ both KL are 0. Conversely, if $D_\lambda=0$, the sum of two nonnegative terms multiplied by positive weights is 0, so $\KL(p\Vert m_\lambda)=\KL(q\Vert m_\lambda)=0$, and by the equality condition $p=m_\lambda=q$.
**(iii)** $D_{1-\lambda}(q\Vert p)=(1-\lambda)\KL(q\Vert m')+\lambda\KL(p\Vert m')$ with $m'=(1-\lambda)q+\lambda p=m_\lambda$. The two terms are the same as the two terms of $D_\lambda(p\Vert q)$.
**(iv)** Where $p>0$, $\frac p{m_\lambda}\le\frac1\lambda$, so $\KL(p\Vert m_\lambda)\le\log\frac1\lambda$; likewise $\KL(q\Vert m_\lambda)\le\log\frac1{1-\lambda}$. The weighted sum is $\le\lambda\log\frac1\lambda+(1-\lambda)\log\frac1{1-\lambda}$ (the binary entropy). For $\lambda=\tfrac12$ it is $\log2$ — the ordinary JS.` },
      { q: R`For $p=(\tfrac12,\tfrac12,0)$ and $q=(0,\tfrac12,\tfrac12)$, find $D_{JS}(p\Vert q)$ in natural logs. (4 decimal places)`,
        sol: R`$m=(\tfrac14,\tfrac12,\tfrac14)$. $\KL(p\Vert m)=\tfrac12\ln\tfrac{1/2}{1/4}+\tfrac12\ln1=\tfrac12\ln2$, $\KL(q\Vert m)=\tfrac12\ln2$. The average is $\tfrac12\ln2$. (Only one cell overlaps, so it is half the maximum $\ln2$.)` },
      { q: R`$X_1,\dots,X_n\overset{iid}{\sim}\N(\theta,\sigma^2)$ ($\sigma^2$ known), prior $\theta\sim\N(\mu_0,\tau^2)$.
1. Show that the MAP estimator is the solution of $\argmin_\theta\frac1{\sigma^2}\sum(X_i-\theta)^2+\frac1{\tau^2}(\theta-\mu_0)^2$, and derive $\hat\theta_{\text{MAP}}=a\bar X+(1-a)\mu_0$, $a=\frac{n\tau^2}{n\tau^2+\sigma^2}$.
2. Find the bias, variance, and MSE of $\hat\theta_{\text{MAP}}$ (you may use the bias–variance decomposition without proof).
3. With $\sigma^2=4$, $n=16$, $\tau^2=1$, $\mu_0=2$, and $\bar X=5$, find $\hat\theta_{\text{MAP}}$, and compare its MSE, when the true value is $\theta=3$, with the MSE of the MLE ($\bar X$).`,
        rubric: R`
- The log posterior and the objective — 4 pts
- Differentiating, the solution, and $a$ — 5 pts
- Bias $(1-a)(\mu_0-\theta)$, variance $a^2\sigma^2/n$ — 5 pts
- The MSE — 3 pts
- Numbers: $4.4$, MSE $0.2$ versus $0.25$ — 5 pts`,
        sol: R`
**1.** $\log p(\theta\mid X)=-\frac1{2\sigma^2}\sum(X_i-\theta)^2-\frac1{2\tau^2}(\theta-\mu_0)^2+C$; multiplying by $-2$ gives the stated objective. Differentiating: $-\frac2{\sigma^2}\sum(X_i-\theta)+\frac2{\tau^2}(\theta-\mu_0)=0\Rightarrow\theta\big(\frac n{\sigma^2}+\frac1{\tau^2}\big)=\frac{n\bar X}{\sigma^2}+\frac{\mu_0}{\tau^2}$. Multiplying the numerator and denominator by $\sigma^2\tau^2$ gives $\theta=\frac{n\tau^2\bar X+\sigma^2\mu_0}{n\tau^2+\sigma^2}=a\bar X+(1-a)\mu_0$. (A quadratic with positive second derivative → a minimum.)
**2.** $\E\hat\theta=a\theta+(1-a)\mu_0$ → bias $(1-a)(\mu_0-\theta)$. $\Var\hat\theta=a^2\Var\bar X=a^2\sigma^2/n$. MSE $=(1-a)^2(\mu_0-\theta)^2+a^2\sigma^2/n$.
**3.** $a=\frac{16}{16+4}=0.8$, $\hat\theta=0.8(5)+0.2(2)=4.4$. $\theta=3$: bias$^2=(0.2)^2(2-3)^2=0.04$, variance $0.64\cdot4/16=0.16$, MSE $0.20$ < the MLE's $\sigma^2/n=0.25$.` },
      { q: R`Data $x_1=(0,0)$, $y_1=-1$; $x_2=(2,0)$, $y_2=+1$; $x_3=(0,2)$, $y_3=+1$.
1. Write the Lagrangian of the primal problem $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$, minimize it over $w,b$, and derive the dual problem.
2. Solve the dual problem for $\alpha_1,\alpha_2,\alpha_3$.
3. Find $w,b$, the separating hyperplane, and the margin, and check that the primal and dual values are equal.`,
        rubric: R`
- The Lagrangian — 3 pts
- The stationarity conditions $w=\sum\alpha_iy_ix_i$, $\sum\alpha_iy_i=0$ — 5 pts
- The dual objective (computing inner products) — 5 pts
- The optimal multipliers (substituting the constraint and maximizing) — 6 pts
- $w,b$ (justified by support vectors) — 4 pts
- The hyperplane, the margin, and checking strong duality — 3 pts`,
        sol: R`
**1.** $L=\frac12\lVert w\rVert^2+\sum_i\alpha_i(1-y_i(w^Tx_i+b))$. $\nabla_w=0$: $w=\sum\alpha_iy_ix_i=\alpha_2(2,0)+\alpha_3(0,2)=(2\alpha_2,2\alpha_3)$ ($x_1=0$). $\partial_b=0$: $-\alpha_1+\alpha_2+\alpha_3=0$.
Inner products: those with $x_1$ are 0, $x_2^Tx_2=x_3^Tx_3=4$, $x_2^Tx_3=0$. Dual: $\max\ \alpha_1+\alpha_2+\alpha_3-\frac12(4\alpha_2^2+4\alpha_3^2)$ s.t. $\alpha_1=\alpha_2+\alpha_3$, $\alpha\ge0$.
**2.** Substituting: $2\alpha_2+2\alpha_3-2\alpha_2^2-2\alpha_3^2$. Each variable separately: $2-4\alpha_j=0\Rightarrow\alpha_2=\alpha_3=\tfrac12$, $\alpha_1=1$.
**3.** $w=(1,1)$. Support vector $x_1$: $0+b=-1\Rightarrow b=-1$ ($x_2$: $2-1=1$ ✓, $x_3$: $2-1=1$ ✓). Hyperplane $x_1+x_2=1$. Margin $1/\lVert w\rVert=1/\sqrt2$ (the distance from the origin to the line). Primal value $\frac12\lVert w\rVert^2=1$, dual value $1+\tfrac12+\tfrac12-\frac12(1+1)=1$ ✓.` },
      { q: R`(1) For nonempty sets $X,Y$ and $f:X\times Y\to\mathbb R$, prove $\sup_{x}\inf_{y}f(x,y)\le\inf_y\sup_xf(x,y)$ (do not assume that maxima and minima exist). (2) For $X=Y=[-1,1]$, $f(x,y)=xy$, find the two values and explain with a saddle point why equality holds. (3) Show that for $X=Y=\{-1,1\}$, $f(x,y)=xy$, equality fails.`,
        rubric: R`
- (1) $\inf_yf(x',y)\le f(x',y')\le\sup_xf(x,y')$ — 4 pts
- (1) The two steps by the definitions of infimum and supremum — 5 pts
- (2) The two values 0 and checking the saddle point $(0,0)$ — 7 pts
- (3) $-1<1$ — 6 pts`,
        sol: R`
**(1)** For any $x',y'$: $\inf_yf(x',y)\le f(x',y')\le\sup_xf(x,y')$. The left side $a(x')$ is $\le b(y')$ for every $y'$, so $a(x')\le\inf_{y'}b(y')$ (the infimum is the greatest lower bound). This holds for every $x'$, so $\sup_{x'}a(x')\le\inf_{y'}b(y')$ (the supremum is the least upper bound).
**(2)** $\inf_yxy=-\lvert x\rvert$ ($y=-\operatorname{sign}x$), $\sup_x(-\lvert x\rvert)=0$. $\sup_xxy=\lvert y\rvert$, $\inf_y\lvert y\rvert=0$. Both are 0. $(x^*,y^*)=(0,0)$: $f(x,0)=0\le f(0,0)=0\le f(0,y)=0$ — a saddle point, hence equality.
**(3)** $\min_yxy=-1$ (for every $x$) → $\max_x\min_y=-1$. $\max_xxy=1$ (for every $y$) → $\min_y\max_x=1$. $-1<1$. Replacing the continuous interval by two discrete points removes the saddle point $(0,0)$, and equality fails.` },
    ],
  },
  x5: {
    kind: 'Week 5 · optimization', title: 'Descent Lemma, SGD, Momentum, Adam', scopeText: 'Units 13–14',
    desc: 'The range of the two Week 5 Monday lectures (optimization theory and practical optimization). Smoothness and the Hessian, the convergence guarantee of SGD, the condition number, and computations and proofs for momentum, Nesterov, AdaGrad, RMSProp, and Adam.',
    probs: [
      { q: R`For $f\in C^2$, which is equivalent to “$\nabla f$ is $\beta$-Lipschitz”?`,
        choices: [R`$\nabla^2f\succeq\beta I$`, R`$-\beta I\preceq\nabla^2f(x)\preceq\beta I$ ($\forall x$)`, R`$\lVert\nabla f\rVert\le\beta$`, R`$f$ is convex`],
        sol: R`Week 5 notes: (⇒) by the integral representation and Cauchy–Schwarz, (⇐) by the operator norm.` },
      { q: R`With $\beta=4$, $f(x)=5$, and $\nabla f(x)=(2,0,-1)$, what is the upper bound on $f(x_{t+1})$ after one GD step with $\eta=0.25$?`,
        sol: R`$f-(\eta-\frac\beta2\eta^2)\lVert\nabla f\rVert^2=5-(0.25-0.125)\cdot5=5-0.625=4.375$.` },
      { q: R`If $f=\frac1n\sum f_i$ is $L$-smooth with lower bound $f_*$, and SGD $x_{t+1}=x_t-\eta g_t$ (fixed step) has $\E[g_t\mid x_t]=\nabla f(x_t)$ and $\E[\lVert g_t\rVert^2\mid x_t]\le G$, prove $\frac1T\sum_{t=1}^T\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$, and find the $\eta$ that minimizes this bound and the resulting value.`,
        rubric: R`
- Applying the descent lemma — 3 pts
- The conditional expectation with unbiasedness and the second moment — 4 pts
- The tower property and telescoping — 5 pts
- Dividing by $T$ — 2 pts
- The optimal $\eta$ and the value — 6 pts`,
        sol: R`
$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),g_t\rangle+\frac{L\eta^2}2\lVert g_t\rVert^2$. $\E_t$: $\E_tf(x_{t+1})\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{L\eta^2}2G$. Full expectation (tower property), rearranging, and summing over $t=1..T$: $\eta\sum\E\lVert\nabla f\rVert^2\le f(x_1)-\E f(x_{T+1})+\frac{L\eta^2}2GT\le f(x_1)-f_*+\frac{L\eta^2GT}2$. Dividing by $\eta T$ gives the result.
$\phi(\eta)=\frac A{\eta T}+B\eta$ ($A=f(x_1)-f_*$, $B=LG/2$): $\eta^*=\sqrt{\frac A{BT}}=\sqrt{\frac{2(f(x_1)-f_*)}{LGT}}$, minimum $2\sqrt{\frac{AB}T}=\sqrt{\frac{2(f(x_1)-f_*)LG}T}=O(1/\sqrt T)$.` },
      { q: R`When GD is applied to $f(x_1,x_2)=\frac12(4x_1^2+x_2^2)$, what is the upper bound on the learning rate for convergence?`,
        sol: R`The Hessian is $\diag(4,1)$, $\lambda_{\max}=4$, and the bound is $2/4=0.5$. The condition number is 4.` },
      { q: R`With $f(x)=x^2$ ($f'=2x$), $x_t=1$, $v_t=-0.5$, $\rho=0.9$, $\alpha=0.1$, what is $x_{t+1}$ for Nesterov momentum?`,
        sol: R`Look-ahead point $y=1+0.9(-0.5)=0.55$. $x_{t+1}=y-\alpha f'(y)=0.55-0.1(1.1)=0.44$. (With momentum it would be $0.55-0.1f'(1)=0.35$.)` },
      { q: R`In AdaGrad ($\alpha=0.1$, ignoring $\varepsilon$), if the gradients of one coordinate are $3$ then $4$, what is the size of the **second** step?`,
        sol: R`$A_2=9+16=25$, and the step is $0.1\cdot4/\sqrt{25}=0.08$. (The first step is $0.1\cdot3/3=0.1$.)` },
      { q: R`In Adam ($\beta_1=0.9$, $\beta_2=0.999$), what is the bias-correction denominator $1-\beta_1^2$ of the first moment at $t=2$?`,
        sol: R`$1-0.81=0.19$. $m_2=0.09g_1+0.1g_2$, so if the gradients are equal it is $0.19g$, and dividing by 0.19 gives $g$.` },
      { q: R`(1) Prove $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}g_k$ for momentum $v_{t+1}=\rho v_t-\alpha g_t$, $v_0=0$. (2) For Adam's $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $m_0=0$, prove that if $\E g_k=\bar g$ then $\E m_t=(1-\beta_1^t)\bar g$, and show that without bias correction Adam's first step has size $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$.`,
        rubric: R`
- (1) Induction — 6 pts
- (2) The unrolled formula — 4 pts
- (2) The expectation by the geometric series — 5 pts
- (2) The first step without correction — 5 pts`,
        sol: R`
**(1)** $v_1=-\alpha g_0$. Under the hypothesis, $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k=0}^{t-1}\rho^{t-k}g_k+g_t\big)=-\alpha\sum_{k=0}^t\rho^{t-k}g_k$.
**(2)** The same induction gives $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$. $\E m_t=(1-\beta_1)\bar g\frac{1-\beta_1^t}{1-\beta_1}=(1-\beta_1^t)\bar g$.
First step (no correction): $m_1=(1-\beta_1)g_1$, $m_2=(1-\beta_2)g_1^2$, step $\alpha\frac{(1-\beta_1)g_1}{\sqrt{1-\beta_2}\lvert g_1\rvert}$, of size $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$ ($\approx3.16\alpha$ with the defaults). With the correction it is $\alpha$.` },
      { q: R`What is the key improvement of RMSProp over AdaGrad?`,
        choices: [R`It added momentum`, R`Instead of summing all squared gradients, it uses an exponential moving average so the effective learning rate does not shrink to 0`, R`It removed the learning rate`, R`It computes the Hessian`],
        sol: R`AdaGrad's accumulated sum keeps growing, so the step shrinks as $\alpha/\sqrt t$, but RMSProp forgets old gradients.` },
      { q: R`For $f=\frac12x_1^2+50x_2^2$, $x_0=(-5,-1)$, momentum with $\alpha=0.019$, $\rho=0.8$, $v_0=0$, what is the **first** coordinate of $x_2$ after two steps? (4 decimal places)`,
        sol: R`$g_0=(-5,-100)$, $v_1=(0.095,1.9)$, $x_1=(-4.905,0.9)$. $g_1=(-4.905,90)$, $v_2=0.8(0.095,1.9)-0.019(-4.905,90)=(0.169195,-0.19)$, $x_2=(-4.735805,\ 0.71)$.` },
    ],
  },
  });
})();
