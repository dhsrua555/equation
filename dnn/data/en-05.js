/* English text — 05 Logistic Regression (W3 Mon slides 3–16, notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    sigmoid: R`$\sigma$ is an S-shaped curve that sends the whole real line into $(0,1)$ and passes through $\tfrac12$ at $z=0$. Its derivative attains its maximum $\tfrac14$ at $z=0$ and approaches 0 as $\lvert z\rvert$ grows (**saturation**). This fact is the root of the vanishing-gradient problem in Unit 10.`,
    logcontour: R`The points with equal $P(y=1\mid x)=\sigma(w_0+w_1x_1+w_2x_2)$ lie on lines $w^Tx=\text{const}$, so they are all parallel to the decision boundary ($p=0.5$, solid line). Filled dots have label 1, open dots label 0. The farther from the decision boundary, the closer the probability is to 0 or 1.`,
    bceloss: R`When the label is 1 but the score $z$ is very negative (confidently wrong), the cross-entropy loss keeps growing almost like a straight line and gives a strong gradient. The squared error $(1-\sigma(z))^2$ flattens out in the same situation (gradient $\approx0$), so learning stalls, and it is not even convex in $z$.`,
  });
  EM.en.ch[5] = {
    title: 'Logistic Regression',
    fig: R`Sigmoids σ(kx) with different slopes. The bold line is k = 1`,
    tagline: R`Make the log-odds linear and you get $p=\sigma(w^Tx)$. The Hessian of the loss is $X^TSX\succeq0$, so a local minimum is a global minimum.`,
    summary: R`For a problem with two answers, such as “spam or not”, this is the most basic classifier that answers not just yes or no but with a **probability**. Turning the probability $p$ into the odds $p/(1-p)$ and then into the log-odds gives the whole real line, so this is where we put the linear expression $w^Tx$. Solving back gives $p=\sigma(w^Tx)$ (the sigmoid). The parameters are learned by maximum likelihood; the negative log-likelihood is the **binary cross-entropy**, and its gradient is $\sum(\sigma(w^Tx_i)-y_i)x_i$ — “(prediction − label) × input”. The Hessian $X^TSX$ is positive semidefinite, so the loss is convex and gradient descent finds the global minimum.`,
    goals: [
      R`Write the relations among probability, odds, and logit, and show that the sigmoid is the inverse of the logit`,
      R`Prove $\sigma'(z)=\sigma(z)(1-\sigma(z))$ and $\sigma(-z)=1-\sigma(z)$`,
      R`Explain the logistic regression model, the decision boundary, and why the probability contours are parallel`,
      R`Derive the negative log-likelihood $\sum\log(1+e^{-w^Tx_i})+\sum(1-y_i)w^Tx_i$ from the Bernoulli likelihood`,
      R`Derive the gradient $\sum(\sigma(z_i)-y_i)x_i$ and the Hessian $X^TSX$, and prove convexity`,
      R`Explain why the solution diverges on linearly separable data and what regularization does`,
    ],
    secTitles: { '5.1': 'Odds · logit · sigmoid', '5.2': 'Model · decision boundary', '5.3': 'Likelihood · loss', '5.4': 'Gradient', '5.5': 'Convexity' },
    secs: {
      '5.1': { title: 'Odds, Logit, and the Sigmoid', body: R`
:::idea In plain words
A probability of 0.8 means “8 times out of 10”; the odds are “happens : does not happen = 8 : 2 = 4 times”. The “4 to 1” used in horse racing is an odds. A probability is trapped between 0 and 1, but the odds run from 0 to infinity, and the **log-odds** from $-\infty$ to $+\infty$. To pair with the linear expression $w^Tx$, which uses the whole real line, the log-odds is the perfect fit.
:::

If an event occurs $n$ times in $N$ trials, the probability is $p=n/N$ and the **odds** are $o=\dfrac{n}{N-n}$. Dividing the numerator and denominator by $N$, the two quantities can be converted into each other.
$$o=\frac p{1-p},\qquad p=\frac o{1+o}$$
(The second is the first solved for $p$: $o(1-p)=p\Rightarrow o=p(1+o)$.) A probability lies in $[0,1]$ and the odds in $[0,\infty)$, so applying a logarithm once more gives the whole real line.

:::def Logit and the logistic (sigmoid) function
$$\operatorname{logit}(p)=\log\frac p{1-p}:\ (0,1)\to(-\infty,\infty),$$
$$\sigma(z)=\frac1{1+e^{-z}}:\ (-\infty,\infty)\to(0,1)$$
The two are inverses of each other.
:::

:::key Properties of the sigmoid
$$\sigma(z)=\frac{e^z}{1+e^z},\qquad \sigma(-z)=1-\sigma(z),\qquad \sigma'(z)=\sigma(z)\big(1-\sigma(z)\big)$$
:::

Solving $z=\operatorname{logit}(p)$ for $p$ gives $e^z=\frac p{1-p}$, $p=\frac{e^z}{1+e^z}=\frac1{1+e^{-z}}=\sigma(z)$. The derivative is $\sigma'(z)=\frac{e^{-z}}{(1+e^{-z})^2}=\frac1{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)(1-\sigma(z))$, with maximum $\tfrac14$ at $z=0$. We use this fact again in backpropagation (Unit 9) and in the saturation of activation functions (Unit 10). The symmetry: $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}=\frac1{e^z+1}=\sigma(-z)$.

:::fig sigmoid
:::

:::ex Example 1 — Converting back and forth
(a) The odds and logit of $p=0.8$. (b) The probability whose logit is $-2$.
---
(a) $o=0.8/0.2=4$, $\operatorname{logit}=\log4\approx1.386$. (b) $\sigma(-2)=\frac1{1+e^2}\approx0.119$. A logit of 0 means probability $\tfrac12$, a logit of $\pm2$ roughly 88% / 12%, and $\pm5$ gives 99.3% / 0.7%.
:::

### Going deeper: computing it numerically safely

Computing $\sigma(z)=1/(1+e^{-z})$ as written, at $z=-1000$ the value $e^{1000}$ overflows and the computation breaks. For $z<0$, using $\sigma(z)=e^z/(1+e^z)$ is safe. The $\log(1+e^{z})$ (**softplus**) that appears in the loss is also computed as $z+\log(1+e^{-z})$ when $z>0$. This is why deep learning libraries provide “sigmoid + cross-entropy” as a single function (e.g., a BCE that takes logits).
` },
      '5.2': { title: 'The Model: Log-Odds Made Linear', body: R`
:::idea In plain words
Multiply each feature (the number of occurrences of the word “free”, the number of links, …) by a weight and add them up to make a **score** $z=w^Tx$, then squash the score through the sigmoid into a probability. A score of 0 means fifty-fifty, a large score “almost surely 1”, a small one “almost surely 0”. A feature with a positive weight is evidence pushing toward 1, one with a negative weight evidence pushing toward 0.
:::

Logistic regression models a binary dependent variable. We set the **log-odds** of label 1 to a **linear expression** (notes: “linearize $P(y=1\mid x)$ in the log-odds”).
$$\log\frac{p}{1-p}=w^Tx,\qquad x=(1,x_1,\dots,x_n),\ w=(w_0,w_1,\dots,w_n)$$
$$\Longrightarrow\ p=P(y=1\mid x,w)=\frac1{1+e^{-w^Tx}}=\sigma(w^Tx)$$
The one-dimensional version on the slide is $z=\beta_0+\beta_1x$, $\text{odds}=e^{\beta_0+\beta_1x}$, $p=\frac{e^z}{e^z+1}$.

**Decision boundary.** The hyperplane $w^Tx=w_0+\sum_iw_ix_i=0$ separates the two labels. If $w^Tx_i>0$ then $p>\tfrac12$, so we classify $y_i=1$; if $w^Tx_i<0$, we classify $y_i=0$. If needed, the threshold $\tfrac12$ can be changed to another value (e.g., lower for a cancer test).

**Probability contours.** $\sigma$ is strictly increasing, so $\{x:\sigma(w^Tx)=c\}=\{x:w^Tx=\operatorname{logit}(c)\}$; that is, points with equal probability lie on **hyperplanes parallel** to the decision boundary. This is why, in the slide's 2D figure, the contours $0.334,\ 0.5,\ 0.666$ are all parallel lines. Points below the blue contour have probability greater than $0.666$ and are classified as 1.

:::fig logcontour
:::

:::ex Example 2 — Study hours and passing
$P(\text{pass}\mid x)=\sigma(-3+x)$ ($x$: hours of study). What are the probabilities of passing for students who studied 2, 3, and 4 hours, and what is the decision boundary?
---
$\sigma(-1)\approx0.269$, $\sigma(0)=0.5$, $\sigma(1)\approx0.731$. The decision boundary is $-3+x=0$, i.e., $x=3$ hours. Each extra hour of study raises the log-odds by 1, so the **odds are multiplied by $e\approx2.72$** (the probability does not rise by a fixed amount).
:::

**Interpreting the weights.** Holding the other features fixed and increasing only $x_j$ by 1 raises the log-odds by $w_j$, so the odds are multiplied by $e^{w_j}$ (the **odds ratio**). The phrase “the odds ratio for smokers is 2.0” in medical papers is this interpretation.

:::tip Why the sigmoid is useful
The logistic function is smooth, non-decreasing, and takes values in $(0,1)$, so it is well suited to **assigning probabilities**. The parameters are learned by maximum likelihood.
:::

### Going deeper: why make the log-odds linear

If the inputs of the two classes are Gaussians with a common covariance, $x\mid y=k\sim\N(\mu_k,\Sigma)$, then the posterior computed by Bayes' theorem has **exactly** the form $\sigma(w^Tx+b)$ ($w=\Sigma^{-1}(\mu_1-\mu_0)$). This is because taking the log of “posterior odds = likelihood ratio × prior odds” from Section 2.2 makes the log-likelihood ratio a linear function of $x$. Logistic regression is a discriminative model that assumes only the **shape** of the posterior, without this distributional assumption, and fits it directly. It is also “a single neuron with a single nonlinear activation”, the smallest unit of a neural network[[ch08:8.3|Sigmoid activations and the output layer.]].
` },
      '5.3': { title: 'Likelihood and the Cross-Entropy Loss', body: R`
:::idea In plain words
A good weight is one that “gave high probability to the actual labels”. The likelihood is the product, over the samples, of “the probability given to the correct label”; taking the log and flipping the sign gives “the sum of $-\log$ of the probability given to the correct label” — a loss that is near 0 when you are confidently right and punishes you heavily when you are confidently wrong.
:::

Data $D=\{(x_i,y_i)\}_{i=1}^N$, $y_i\in\{0,1\}$. Each label follows a Bernoulli distribution, so
$$p(y_i\mid x_i,w)=P(y_i=1\mid x_i,w)^{y_i}\big(1-P(y_i=1\mid x_i,w)\big)^{1-y_i},$$
$$L(w)=\prod_{i=1}^Np(y_i\mid x_i,w).$$
(This is the one-line notation in which only the first factor survives when $y_i=1$ and only the second when $y_i=0$[[ch02:2.4|The Bernoulli likelihood $\theta^x(1-\theta)^{1-x}$.]].) Writing $p_i=\sigma(w^Tx_i)$ (notes),
$$w^*=\argmax_w\log L=\argmin_w\Big\{-\sum_{i=1}^N\big[y_i\log p_i+(1-y_i)\log(1-p_i)\big]\Big\}.$$
The expression in the braces is the **binary cross-entropy** loss[[ch03:3.5|The cross-entropy between the label distribution $(y_i,1-y_i)$ and the predicted distribution $(p_i,1-p_i)$.]].

:::key The negative log-likelihood of logistic regression
$$-\log L(w)=\sum_{i=1}^N\log\big(1+e^{-w^Tx_i}\big)+\sum_{i=1}^N(1-y_i)\,w^Tx_i$$
:::

:::hand Class notes — simplifying
Since $P(y_i=1)=\dfrac1{1+e^{-w^Tx_i}}$ and $P(y_i=0)=\dfrac{e^{-w^Tx_i}}{1+e^{-w^Tx_i}}$,
$$-\log P(y_i=1)=\log(1+e^{-w^Tx_i}),$$
$$-\log P(y_i=0)=w^Tx_i+\log(1+e^{-w^Tx_i}).$$
$$\begin{aligned}-\log L=&\sum_iy_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i\\&+\sum_i(1-y_i)\log(1+e^{-w^Tx_i})\end{aligned}$$
Combining the first and third sums, $y_i+(1-y_i)=1$ gives the result above.
:::

The reason for the second formula: $-\log\frac{e^{-z}}{1+e^{-z}}=-\log e^{-z}+\log(1+e^{-z})=z+\log(1+e^{-z})$.

:::fig bceloss
:::

:::ex Example 3 — The loss of a few samples
Three samples have (score $z_i$, label $y_i$) equal to $(2,1)$, $(0,1)$, $(1,0)$. Find each loss and their sum, using natural logs.
---
If $y=1$ the loss is $\log(1+e^{-z})$: $z=2$ → $\log(1+e^{-2})\approx0.127$, $z=0$ → $\log2\approx0.693$.
If $y=0$ it is $\log(1+e^{z})$ (the same as the notes' formula $\log(1+e^{-z})+z$): $z=1$ → $\log(1+e)\approx1.313$.
The sum is $\approx2.133$. The third sample is on the wrong side (positive score but label 0), so its loss is the largest.
:::

### Going deeper: why not use the squared error

$\sum(y_i-\sigma(w^Tx_i))^2$ can also be used as a loss. However, (1) it is not convex in $w$, so local minima can appear, and (2) on a confidently wrong sample ($\sigma\approx0$ but $y=1$) the gradient $2(\sigma-y)\sigma(1-\sigma)x\approx0$, so learning stalls (the dashed line in the figure above). With cross-entropy the factor $\sigma'$ cancels and the gradient is $(\sigma-y)x$, so this problem does not arise. Writing the labels as $\pm1$ simplifies the loss to the single expression $\log(1+e^{-y\,w^Tx})$, called the **logistic loss**, which is compared with the hinge loss of the SVM[[@ml:ch15:18.4|From the Bernoulli cross-entropy to the logistic loss.]].
` },
      '5.4': { title: 'Gradient and Gradient Descent', body: R`
:::idea In plain words
The gradient formula is surprisingly simple: add up “(predicted probability − label) × input” over the samples. If the label is 1 and you predicted 0.3, you get $-0.7\times x$, and the weights move in the opposite direction so that next time the score is higher. Samples already predicted well (prediction ≈ label) have almost no effect.
:::

:::key The gradient of the logistic loss
$$\nabla_w\big(-\log L\big)=-\sum_{i=1}^N\frac{e^{-w^Tx_i}}{1+e^{-w^Tx_i}}x_i+\sum_{i=1}^N(1-y_i)x_i=\sum_{i=1}^N\big(\sigma(w^Tx_i)-y_i\big)x_i$$
Gradient descent: $w\leftarrow w-\alpha\sum_i\big(\sigma(w^Tx_i)-y_i\big)x_i$.
:::

The first equality comes from $\nabla_w\log(1+e^{-w^Tx})=\dfrac{-e^{-w^Tx}}{1+e^{-w^Tx}}x$ (chain rule: the derivative of the outer $\log u$ is $\frac1u$, and the gradient of the inner $u=1+e^{-w^Tx}$ is $-e^{-w^Tx}x$). The second term is $\nabla_w(w^Tx)=x$ (Section 1.2). The second equality holds because $1-\dfrac{e^{-z}}{1+e^{-z}}=\dfrac1{1+e^{-z}}=\sigma(z)$, so $-(1-\sigma(z_i))+(1-y_i)=\sigma(z_i)-y_i$.

In the notes, the loss of a single sample $l_i(w)=-[y_i\log p_i+(1-y_i)\log(1-p_i)]$ was differentiated by the chain rule, giving the same result $\nabla_wl_i=(\sigma(z_i)-y_i)x_i$ ($z_i=w^Tx_i$). The shape **(prediction − label) × input** is exactly that of the linear regression gradient $-(y_i-\hat y_i)x_i$, and it recurs in softmax regression.

**The chain-rule computation in the notes.** $\frac{\partial l_i}{\partial p_i}=-\frac{y_i}{p_i}+\frac{1-y_i}{1-p_i}=\frac{p_i-y_i}{p_i(1-p_i)}$, $\frac{\partial p_i}{\partial z_i}=p_i(1-p_i)$, $\nabla_wz_i=x_i$. Multiplying, $p_i(1-p_i)$ cancels and we get $(p_i-y_i)x_i$.

:::ex Example 4 — One step of gradient descent
Starting from $w=(0,0)$ with data $((1,2),1)$, $((1,-1),0)$ (the first component is the 1 for the intercept) and $\alpha=0.1$, what is $w$ after one step?
---
At $w=0$, every $\sigma(w^Tx_i)=\tfrac12$. The gradient is $(\tfrac12-1)(1,2)+(\tfrac12-0)(1,-1)=(-\tfrac12,-1)+(\tfrac12,-\tfrac12)=(0,-\tfrac32)$.
$w\leftarrow(0,0)-0.1(0,-1.5)=(0,\ 0.15)$. The point with a positive second feature is 1 and the one with a negative second feature is 0, so increasing $w_2$ is the right direction.
:::

:::warn There is no closed-form solution
Unlike linear regression, $\sum(\sigma(w^Tx_i)-y_i)x_i=0$ is a nonlinear equation in $w$, so there is no formula like the normal equations. We solve it by gradient descent (or Newton's method).
:::

### Going deeper: Newton's method (IRLS)

With the Hessian $H=X^TSX$ (Section 5.5), Newton's method $w\leftarrow w-H^{-1}\nabla J$ converges in a few steps. Rearranged, each step amounts to solving a **weighted least-squares** problem with weights $S$, hence the name iteratively reweighted least squares (IRLS). In neural networks with millions of parameters we cannot form $H$ or invert it, so we use first-order methods (the gradient descent family) — Adam and friends in Week 5 are attempts to imitate curvature without the Hessian[[ch14:14.3|AdaGrad · RMSProp · Adam: per-coordinate learning rates.]].
` },
      '5.5': { title: 'Convexity: The Hessian Is Positive Semidefinite', body: R`
:::idea In plain words
A convex loss means the surface is shaped like **a single bowl**. In a bowl, wherever you start, following the downhill path takes you to the same bottom. This is why logistic regression, unlike a neural network, gives “the same answer from any initial value”.
:::

:::key The Hessian of the logistic loss
$$J(w)=-\sum_i\big[y_i\log p_i+(1-y_i)\log(1-p_i)\big],$$
$$\nabla^2J=\sum_{i=1}^N\sigma(z_i)\big(1-\sigma(z_i)\big)x_ix_i^T=X^TSX\succeq0$$
$X=\begin{pmatrix}x_1^T\\\vdots\\x_N^T\end{pmatrix}\in\mathbb R^{N\times d}$, $S=\diag\big(\sigma(z_1)(1-\sigma(z_1)),\dots,\sigma(z_N)(1-\sigma(z_N))\big)$.
:::

:::hand Class notes — proof of convexity
Differentiate $\nabla_wl_i=(\sigma(z_i)-y_i)x_i$ once more. $y_i,x_i$ are constants and $\nabla_w\sigma(z_i)=\sigma'(z_i)x_i$, so
$$\nabla^2l_i=\nabla_w\big[(\sigma(z_i)-y_i)x_i\big]=\sigma'(z_i)\,x_ix_i^T\quad(d\times d),\qquad \sigma'=\sigma(1-\sigma).$$
Summing, $\nabla^2J=\sum_i\sigma(z_i)(1-\sigma(z_i))x_ix_i^T=X^TSX$. For any $v\in\mathbb R^d$,
$$v^T\nabla^2Jv=v^TX^TSXv=(Xv)^TS(Xv)=\sum_{i=1}^Ns_i(x_i^Tv)^2\ge0,\qquad s_i\in\big(0,\tfrac14\big].$$
The Hessian is positive semidefinite, so $J$ is convex (a single U-shaped bowl, not a W with several valleys).[[@base:ch04:4.3|The Hessian, convexity, and the test for extrema.]]
:::

**In components.** The $(j,k)$ entry is $\frac{\partial^2J}{\partial w_j\partial w_k}=\sum_i\sigma'(z_i)x_{ij}x_{ik}$. This is because differentiating the $j$-th component $(\sigma(z_i)-y_i)x_{ij}$ of the vector $(\sigma(z_i)-y_i)x_i$ in $w_k$ gives $\sigma'(z_i)\frac{\partial z_i}{\partial w_k}x_{ij}=\sigma'(z_i)x_{ik}x_{ij}$. The matrix $x_ix_i^T$ (outer product) is exactly the table of these entries.

:::ex Example 5 — Computing the Hessian
With $w=0$ and inputs $x_1=(1,0)$, $x_2=(1,1)$, what is the Hessian?
---
At $w=0$, $s_i=\tfrac12\cdot\tfrac12=\tfrac14$. $x_1x_1^T=\begin{pmatrix}1&0\\0&0\end{pmatrix}$, $x_2x_2^T=\begin{pmatrix}1&1\\1&1\end{pmatrix}$. $\nabla^2J=\frac14\begin{pmatrix}2&1\\1&1\end{pmatrix}$. The determinant is $\frac1{16}(2-1)>0$ and the diagonal is positive, so it is positive definite — near this point the loss is a strict bowl.
:::

**Meaning.** For a convex function, a point with zero gradient is a global minimum, so gradient descent does not get trapped in a local minimum[[@em:ch07:8.4|The quadratic form $v^TAv\ge0$ is the same condition as all eigenvalues being $\ge0$.]].

:::warn Linearly separable data
If the data are perfectly split by a hyperplane, the likelihood rises toward 1 as $\lVert w\rVert\to\infty$ in that direction, so **there is no finite maximum likelihood solution** (the loss only approaches 0). In practice this is prevented by adding a regularizer $\frac\lambda2\lVert w\rVert^2$ or by early stopping. With the regularizer, the Hessian becomes $X^TSX+\lambda I\succ0$ and the solution is unique.
:::

**An example of the separable case.** One-dimensional data $x=-1$ (label 0), $x=+1$ (label 1), model $\sigma(wx)$. The loss $2\log(1+e^{-w})$ keeps decreasing as $w$ grows, approaching 0 without reaching it. Gradient descent walks off endlessly toward $w\to\infty$, and the probabilities are pushed to the extremes 0 and 1 (overconfidence).

### Going deeper: convex but not strongly convex

Since $s_i>0$, $v^T\nabla^2Jv=0\iff Xv=0$. So if the columns of $X$ are linearly independent, the Hessian is positive **definite** (the same condition as in Unit 1). Even so, as $\lvert z_i\rvert$ grows, $s_i\to0$ and the curvature can become arbitrarily small, so without regularization strong convexity (a positive lower bound on the curvature) is not guaranteed. Adding $\frac\lambda2\lVert w\rVert^2$ gives $\nabla^2\succeq\lambda I$ everywhere, and the convergence of gradient descent speeds up to a linear (geometric) rate[[@ml:ch10:13.3|Strong convexity and Tikhonov regularization.]].
` },
    },
    probs: [
      // u05
      { q: R`What are the odds of an event with probability $p=0.8$?`,
        sol: R`$o=p/(1-p)=0.8/0.2=4$. Conversely, $p=o/(1+o)=4/5$.` },
      { q: R`For which $z$ is $\sigma(z)=0.75$?`,
        sol: R`$z=\operatorname{logit}(0.75)=\ln\frac{0.75}{0.25}=\ln3$.` },
      { q: R`What is the value of $\sigma'(0)$?`,
        sol: R`$\sigma(0)=\tfrac12$, so $\sigma'(0)=\tfrac12\cdot\tfrac12=\tfrac14$. This is the maximum of $\sigma'$.` },
      { q: R`Which is equal to $\sigma(-z)$?`,
        choices: [R`$-\sigma(z)$`, R`$1-\sigma(z)$`, R`$1/\sigma(z)$`, R`$\sigma(z)$`],
        sol: R`$\sigma(-z)=\frac1{1+e^z}=\frac{e^{-z}}{e^{-z}+1}=1-\frac1{1+e^{-z}}$.` },
      { q: R`In logistic regression, what is the set of points with $P(y=1\mid x)=0.9$?`,
        choices: [R`The decision boundary $w^Tx=0$`, R`The hyperplane $w^Tx=\ln9$, parallel to the decision boundary`, R`A circle`, R`A line parallel to $w$`],
        sol: R`$\sigma(w^Tx)=0.9\iff w^Tx=\operatorname{logit}(0.9)=\ln9$. The contours are all parallel hyperplanes.` },
      { q: R`With $w=(w_0,w_1,w_2)=(-1,2,1)$, what is $P(y=1\mid x)$ at $x=(1,0.5,1)$ (the first component is the 1 for the intercept)?`,
        sol: R`$w^Tx=-1+1+1=1$, so $\sigma(1)=1/(1+e^{-1})\approx0.731$.` },
      { q: R`What is the cross-entropy loss $-[y\log p+(1-y)\log(1-p)]$ of a single sample with $y_1=1$ and $w^Tx_1=0$?`,
        sol: R`$p=\sigma(0)=\tfrac12$, and the loss is $-\log\tfrac12=\ln2$. The notes' formula also gives $\log(1+e^0)+0=\ln2$.` },
      { q: R`Compute the loss of a sample with $y=0$ and $z=w^Tx=2$ using the notes' formula $\log(1+e^{-z})+(1-y)z$.`,
        sol: R`$\log(1+e^{-2})+2\approx0.127+2=2.127$. Directly: $-\log(1-\sigma(2))=-\log\frac{e^{-2}}{1+e^{-2}}=2+\log(1+e^{-2})$. The more confidently wrong, the larger the loss.` },
      { q: R`What is the gradient $\nabla_wl_i$ of the loss of a single sample?`,
        choices: [R`$(y_i-\sigma(w^Tx_i))x_i$`, R`$(\sigma(w^Tx_i)-y_i)x_i$`, R`$\sigma'(w^Tx_i)x_i$`, R`$(\sigma(w^Tx_i)-y_i)$`],
        sol: R`(prediction − label) × input. Gradient descent subtracts it, so $w\leftarrow w+\alpha(y_i-\sigma_i)x_i$.` },
      { q: R`At $w=0$ with data $(x_1,y_1)=((1,2),1)$, $(x_2,y_2)=((1,-1),0)$, what is the second component of the gradient $\sum_i(\sigma(w^Tx_i)-y_i)x_i$?`,
        sol: R`At $w=0$, $\sigma=\tfrac12$. $(\tfrac12-1)(1,2)+(\tfrac12-0)(1,-1)=(-\tfrac12,-1)+(\tfrac12,-\tfrac12)=(0,-1.5)$.` },
      { q: R`In the problem above, what is $w_2$ after one step of gradient descent with learning rate $\alpha=0.1$?`,
        sol: R`$w\leftarrow0-0.1\cdot(0,-1.5)=(0,0.15)$.` },
      { q: R`What is the key reason the Hessian $X^TSX$ of the logistic loss is positive semidefinite?`,
        choices: [R`Because $X$ is a square matrix`, R`Because the diagonal entries $\sigma(z_i)(1-\sigma(z_i))$ of $S$ are all nonnegative`, R`Because $y_i\in\{0,1\}$`, R`Because the learning rate is small`],
        sol: R`$v^TX^TSXv=\sum_is_i(x_i^Tv)^2\ge0$. The labels $y_i$ do not even appear in the Hessian.` },
      { q: R`With $w=0$ and inputs $x_1=(1,0)$, $x_2=(1,1)$, what is the $(1,1)$ entry of the Hessian $X^TSX$?`,
        sol: R`At $w=0$ every $s_i=\tfrac14$. $X^TSX=\tfrac14X^TX=\tfrac14\begin{pmatrix}2&1\\1&1\end{pmatrix}$, and the $(1,1)$ entry is $\tfrac12$.` },
      { q: R`What happens to unregularized logistic regression when the training data are perfectly separated by some hyperplane?`,
        choices: [R`It converges to a unique finite solution`, R`The loss approaches 0, but $\lVert w\rVert\to\infty$ diverges and there is no finite minimizer`, R`The loss increases`, R`The Hessian becomes negative definite`],
        sol: R`Scaling a separating $w$ by $c$ pushes the probability of every sample toward 1 on the correct side, so the loss keeps decreasing. The minimum (0) is not attained. This is fixed by $L_2$ regularization or early stopping.` },
      { q: R`With $y_i\in\{0,1\}$ and $P(y_i=1\mid x_i)=\sigma(w^Tx_i)$, show that the negative log-likelihood is $\sum_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i$, and derive that its gradient is $\sum_i(\sigma(w^Tx_i)-y_i)x_i$.`,
        sol: R`
Let $z_i=w^Tx_i$. $-\log\sigma(z)=\log(1+e^{-z})$ and $-\log(1-\sigma(z))=-\log\frac{e^{-z}}{1+e^{-z}}=z+\log(1+e^{-z})$.
$$-\log L=\sum_i\big[y_i\log(1+e^{-z_i})+(1-y_i)\big(z_i+\log(1+e^{-z_i})\big)\big]=\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i.$$
Gradient: $\nabla_wz_i=x_i$ and $\frac{d}{dz}\log(1+e^{-z})=\frac{-e^{-z}}{1+e^{-z}}=-(1-\sigma(z))$, so
$$\nabla_w(-\log L)=\sum_i\big[-(1-\sigma(z_i))+(1-y_i)\big]x_i=\sum_i(\sigma(z_i)-y_i)x_i.$$`,
        rubric: R`
- The Bernoulli likelihood and $-\log$ — 2 pts
- Rewriting $-\log(1-\sigma)$ and combining — 4 pts
- Computing the gradient — 4 pts` },
      { q: R`Find the Hessian of the cross-entropy loss $J(w)$ of logistic regression and prove that $J$ is convex.`,
        sol: R`
$\nabla J=\sum_i(\sigma(z_i)-y_i)x_i$, $z_i=w^Tx_i$. By the chain rule $\frac{\partial}{\partial w_k}\sigma(z_i)=\sigma'(z_i)x_{ik}$, so
$$\frac{\partial^2J}{\partial w_k\partial w_l}=\sum_i\sigma'(z_i)x_{ik}x_{il},\qquad \nabla^2J=\sum_i\sigma(z_i)(1-\sigma(z_i))x_ix_i^T=X^TSX.$$
$s_i=\sigma(z_i)(1-\sigma(z_i))\in(0,\tfrac14]$. For any $v$, $v^T\nabla^2Jv=\sum_is_i(x_i^Tv)^2\ge0$, so $\nabla^2J\succeq0$.
A $C^2$ function whose Hessian is positive semidefinite at every point is convex: by the integral form of Taylor's expansion, $J(u)=J(w)+\nabla J(w)^T(u-w)+\int_0^1(1-t)(u-w)^T\nabla^2J(w+t(u-w))(u-w)\,dt\ge J(w)+\nabla J(w)^T(u-w)$ (the first-order convexity condition).`,
        rubric: R`
- Computing the second derivatives and the form $X^TSX$ — 4 pts
- $s_i\ge0$ and the quadratic form $\ge0$ — 4 pts
- Hessian PSD ⇒ convex (with justification) — 2 pts` },
      // more-05
      { q: R`For $\sigma(z)=1/(1+e^{-z})$, (i) show that $\sigma$ is the inverse of $\operatorname{logit}(p)=\log\frac p{1-p}$, and prove (ii) $\sigma(-z)=1-\sigma(z)$ and (iii) $\sigma'(z)=\sigma(z)(1-\sigma(z))$.`,
        sol: R`
**(i)** $\operatorname{logit}(\sigma(z))=\log\frac{\sigma}{1-\sigma}$. Since $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}$, $\frac{\sigma}{1-\sigma}=\frac{1}{e^{-z}}=e^z$, whose log is $z$. Conversely, $\sigma(\operatorname{logit}p)=\frac1{1+\frac{1-p}p}=p$.
**(ii)** Multiplying the numerator and denominator of $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}$ by $e^z$ gives $\frac1{e^z+1}=\sigma(-z)$.
**(iii)** $\sigma(z)=(1+e^{-z})^{-1}$, $\sigma'(z)=-(1+e^{-z})^{-2}\cdot(-e^{-z})=\frac{e^{-z}}{(1+e^{-z})^2}=\frac1{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)(1-\sigma(z))$.`,
        rubric: R`
- (i) The compositions in both directions — 3 pts
- (ii) — 3 pts
- (iii) The chain rule and factoring — 4 pts` },
      { q: R`Write the labels as $\tilde y_i\in\{-1,+1\}$ and let $P(\tilde y_i=+1\mid x_i)=\sigma(w^Tx_i)$. Show that the negative log-likelihood is $\sum_i\log\big(1+e^{-\tilde y_iw^Tx_i}\big)$.`,
        sol: R`
$P(\tilde y=+1\mid x)=\sigma(w^Tx)$ and $P(\tilde y=-1\mid x)=1-\sigma(w^Tx)=\sigma(-w^Tx)$. Both cases are written in one line as $P(\tilde y\mid x)=\sigma(\tilde y\,w^Tx)$.
Hence $-\log L=-\sum_i\log\sigma(\tilde y_iw^Tx_i)=\sum_i\log\big(1+e^{-\tilde y_iw^Tx_i}\big)$ ($-\log\sigma(u)=\log(1+e^{-u})$).`,
        rubric: R`
- Using $1-\sigma(z)=\sigma(-z)$ — 4 pts
- The one-line notation $\sigma(\tilde yw^Tx)$ — 3 pts
- Simplifying the log — 3 pts` },
      { q: R`In a logistic regression, the weight of the smoking feature is $w_j=0.7$. With the other features equal, how many times the odds of a non-smoker are the odds of a smoker? (4 decimal places)`,
        sol: R`The log-odds rise by $0.7$, so the odds are multiplied by $e^{0.7}\approx2.014$ (the odds ratio). This does not mean the probability doubles.` },
      { q: R`Starting from $w=(0,0)$ with data $((1,1),0)$, $((1,3),1)$, $((1,2),1)$ (the first component is the 1 for the intercept) and learning rate $\alpha=0.2$, what is $w_2$ after one step of gradient descent?`,
        sol: R`Every $\sigma=\tfrac12$. The gradient is $\tfrac12(1,1)-\tfrac12(1,3)-\tfrac12(1,2)=(-\tfrac12,-2)$. $w\leftarrow(0,0)-0.2(-0.5,-2)=(0.1,0.4)$.` },
      { q: R`Differentiate the loss of a single sample $l(w)=-[y\log p+(1-y)\log(1-p)]$, $p=\sigma(z)$, $z=w^Tx$, by the chain rule $\frac{\partial l}{\partial p}\cdot\frac{\partial p}{\partial z}\cdot\nabla_wz$, and show that $\nabla_wl=(p-y)x$.`,
        sol: R`
$\frac{\partial l}{\partial p}=-\frac yp+\frac{1-y}{1-p}=\frac{-y(1-p)+(1-y)p}{p(1-p)}=\frac{p-y}{p(1-p)}$.
$\frac{\partial p}{\partial z}=\sigma'(z)=p(1-p)$, $\nabla_wz=x$.
Multiplying, $\frac{p-y}{p(1-p)}\cdot p(1-p)\cdot x=(p-y)x$.`,
        rubric: R`
- Putting $\partial l/\partial p$ over a common denominator — 4 pts
- $\sigma'=p(1-p)$ — 3 pts
- Cancelling and concluding — 3 pts` },
      { q: R`Show that if the columns of $X\in\mathbb R^{N\times d}$ are linearly independent, the Hessian $X^TSX$ of the logistic loss is positive **definite** at every $w$.`,
        sol: R`
$s_i=\sigma(z_i)(1-\sigma(z_i))$ is always $s_i>0$, since $\sigma(z_i)\in(0,1)$.
If $v\ne0$, then $v^TX^TSXv=\sum_is_i(x_i^Tv)^2\ge0$, and for it to be 0 we need $x_i^Tv=0$ for every $i$, i.e., $Xv=0$. If the columns are linearly independent, $Xv=0\Rightarrow v=0$, a contradiction. Hence $v^T\nabla^2Jv>0$.`,
        rubric: R`
- $s_i>0$ — 3 pts
- The quadratic form as a weighted sum of squares — 3 pts
- The condition for 0 and linear independence — 4 pts` },
      { q: R`Suppose the data are linearly separable: for some $w_0$, $w_0^Tx_i>0$ when $y_i=1$ and $w_0^Tx_i<0$ when $y_i=0$. Show that the unregularized logistic loss $J(w)$ has no minimum (it does not reach its lower bound 0).`,
        sol: R`
$J(w)=\sum_i\ell_i$ with each $\ell_i>0$, so $J>0$. Setting $w=cw_0$ ($c>0$), the loss of a sample with $y_i=1$, $\log(1+e^{-cw_0^Tx_i})\to0$ ($c\to\infty$), and the loss of a sample with $y_i=0$, $\log(1+e^{cw_0^Tx_i})\to0$ (the exponent goes to $-\infty$). Hence $\inf J=0$.
But $J(w)>0$ at every finite $w$, so the lower bound 0 is not attained and there is no minimizer. (Gradient descent keeps moving in the direction $\lVert w\rVert\to\infty$.)`,
        rubric: R`
- $J>0$ — 2 pts
- $J\to0$ along $cw_0$ — 5 pts
- The lower bound is not attained — 3 pts` },
      { q: R`Show that the Hessian of $J_\lambda(w)=J(w)+\frac\lambda2\lVert w\rVert^2$ ($\lambda>0$) is $\succeq\lambda I$, and argue that therefore a minimizer exists and is unique.`,
        sol: R`
$\nabla^2J_\lambda=X^TSX+\lambda I$. $v^T\nabla^2J_\lambda v=\sum s_i(x_i^Tv)^2+\lambda\lVert v\rVert^2\ge\lambda\lVert v\rVert^2$, so $\nabla^2J_\lambda\succeq\lambda I$ (strongly convex).
A strongly convex function satisfies $J_\lambda(w)\ge J_\lambda(0)+\nabla J_\lambda(0)^Tw+\frac\lambda2\lVert w\rVert^2$, so $J_\lambda\to\infty$ as $\lVert w\rVert\to\infty$: the minimizer lies in a bounded region (and exists because the function is continuous), and it is unique because, by strong convexity, the midpoint of two minimizers would be smaller.`,
        rubric: R`
- Computing the Hessian — 3 pts
- $\succeq\lambda I$ — 3 pts
- Existence (coercivity) and uniqueness — 4 pts` },
      { q: R`Which is a correct reason to use cross-entropy instead of the squared error $(y-\sigma(w^Tx))^2$ in logistic regression?`,
        choices: [R`Cross-entropy always gives a smaller value`, R`Cross-entropy is convex in $w$, and its gradient does not vanish even on confidently wrong samples`, R`The squared error is not differentiable`, R`The squared error cannot output probabilities`],
        sol: R`The gradient of the squared error is multiplied by $\sigma'(z)$, which is near 0 when $\lvert z\rvert$ is large, and the loss is not convex either. In cross-entropy $\sigma'$ cancels and the gradient is $(\sigma-y)x$.` },
      { q: R`With $w=(w_0,w_1)=(-3,1)$ (intercept, hours of study), what is the probability of passing for a student who studied 4 hours? (4 decimal places)`,
        sol: R`$z=-3+4=1$, $\sigma(1)=1/(1+e^{-1})\approx0.7311$.` },
      // quizprep-a
      { q: R`Put the prior $w\sim\N(0,\tau^2I)$ on logistic regression $P(y_i=1\mid x_i,w)=\sigma(w^Tx_i)$ ($y_i\in\{0,1\}$, independent samples).
1. Show that the MAP estimate is $\argmin_w\ F(w)$, $F(w)=J(w)+\frac1{2\tau^2}\lVert w\rVert^2$, $J(w)=-\sum_i\big[y_i\log\sigma(w^Tx_i)+(1-y_i)\log(1-\sigma(w^Tx_i))\big]$.
2. Using $\sigma'=\sigma(1-\sigma)$, find $\nabla F$ and the Hessian $\nabla^2F$.
3. Show that $\nabla^2F\succeq\frac1{\tau^2}I$, and explain why a minimizer exists and is unique. How do the MLE and the MAP differ when the data are linearly separable?`,
        sol: R`
**1.** The posterior is $\propto\prod_i\sigma(w^Tx_i)^{y_i}(1-\sigma(w^Tx_i))^{1-y_i}\cdot\exp\big(-\frac{\lVert w\rVert^2}{2\tau^2}\big)$ (the normalizing constant does not depend on $w$). Taking the negative log gives $F(w)+C$, and since $\log$ is increasing, the maximizer of the posterior = the minimizer of $F$.
**2.** For a single sample with $p=\sigma(z)$, $z=w^Tx$, $\frac{\partial l}{\partial z}=-\big[y(1-p)-(1-y)p\big]=p-y$. Hence
$$\nabla F=\sum_i(p_i-y_i)x_i+\frac w{\tau^2}=X^T(p-y)+\frac w{\tau^2},$$
$$\nabla^2F=\sum_ip_i(1-p_i)x_ix_i^T+\frac1{\tau^2}I=X^TSX+\frac1{\tau^2}I,\quad S=\diag\big(p_i(1-p_i)\big).$$
**3.** $v^TX^TSXv=\sum_ip_i(1-p_i)(x_i^Tv)^2\ge0$, so $\nabla^2F\succeq\frac1{\tau^2}I\succ0$ — $F$ is strongly convex, so there is at most one minimizer. Since $J\ge0$, $F(w)\ge\frac{\lVert w\rVert^2}{2\tau^2}\to\infty$ ($\lVert w\rVert\to\infty$), and $F$ is continuous, so a minimizer exists. On separable data, growing $w$ in the separating direction drives $J\to0$, so the MLE does not exist (the weights diverge), but the MAP stops at a finite solution because the penalty $\frac{\lVert w\rVert^2}{2\tau^2}$ grows.`,
        rubric: R`
- MAP → negative log-likelihood + $L_2$ penalty — 3 pts
- Gradient and Hessian — 4 pts
- Strong convexity, existence and uniqueness, the difference in the separable case — 3 pts` },
    ],
  };
})();
