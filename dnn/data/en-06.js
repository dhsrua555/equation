/* English text — 06 Softmax Regression (W3 Mon slides 14–22, notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    softtemp: R`$\softmax(z/T)$ applied to the same logits $z=(2,\,1,\,0.1)$. When the temperature $T$ is small, the probability concentrates on the largest logit (close to argmax); when it is large, it spreads toward the uniform distribution. $T=1$ is the ordinary softmax. In every case the order (1 > 2 > 3) does not change.`,
  });
  EM.en.ch[6] = {
    title: 'Softmax (Multinomial Logistic) Regression',
    fig: R`Softmax probabilities of three classes drawn along a line. The lower the temperature, the sharper the boundaries`,
    tagline: R`Give each class a weight $w_k$ and normalize $e^{w_k^Tx}$. The gradient is the same “(label − prediction) × input” as in logistic regression.`,
    summary: R`We extend logistic regression to classification with three or more classes (three species of iris, the digits 0–9). Each class gets a score $z_k=w_k^Tx$, and the **softmax** $e^{z_k}/\sum_je^{z_j}$ turns the scores into “probabilities that sum to 1”. With one-hot labels the negative log-likelihood is the **cross-entropy** $-\sum_i\log p_{y_i}(x_i)$, and the gradient is, exactly as in logistic regression, “(predicted probability − one-hot label) × input”. The loss is convex, but shifting the weights of all classes together gives the same answer, so without regularization the minimizer is not unique.`,
    goals: [
      R`Explain the definition and properties of the softmax function (positive, sums to 1, shift invariant), and show that it becomes logistic when $C=2$`,
      R`Write the likelihood with one-hot labels and derive the cross-entropy loss`,
      R`Prove $\partial p_k/\partial z_m=p_k(\delta_{km}-p_m)$ with the quotient rule`,
      R`Derive $\partial J/\partial w_{mn}=-\sum_i(y_{im}-p_m)x_{in}$ and compute it by hand`,
      R`Explain the max-subtraction stabilization, the positive semidefiniteness of the Hessian, and the effect of the temperature`,
    ],
    secTitles: { '6.1': 'Model', '6.2': 'Likelihood · loss', '6.3': 'Gradient', '6.4': 'Properties · numerics' },
    secs: {
      '6.1': { title: 'The Multiclass Model', body: R`
:::idea In plain words
A judge gives each candidate a score (possibly negative). To turn scores into probabilities, (1) make them all positive and (2) divide so that they sum to 1. Using the **exponential** $e^z$ to make them positive turns score differences into probability **ratios**: a score higher by 1 means a probability $e\approx2.7$ times larger. This is the softmax. As the name “soft max” says, it gives the largest probability to the highest score, but shares a little with the other candidates too.
:::

With $C$ classes, each class gets a weight vector $w_k$, and we collect them as $W=\begin{pmatrix}w_1^T\\\vdots\\w_C^T\end{pmatrix}\in\mathbb R^{C\times d}$. The score vector is a single matrix product, $z=Wx\in\mathbb R^C$.

:::key The softmax function
$$p_k=P(y=k\mid x,W)=\frac{e^{w_k^Tx}}{\sum_{j=1}^Ce^{w_j^Tx}},$$
$$z_k=w_k^Tx,\qquad \softmax(z)_k=\frac{e^{z_k}}{\sum_je^{z_j}}$$
Every $p_k>0$ and $\sum_kp_k=1$. Adding the same constant to every $z_k$ gives the same result.
:::

It converts a vector of real numbers into a probability mass function. The slide's example: for $z=(-1,3)$, $e^z\approx(0.3679,\,20.0855)$, and normalizing gives $(0.01799,\,0.98201)$.

**Why adding a constant changes nothing.** $e^{z_k+c}=e^ce^{z_k}$, so the numerator and denominator share the factor $e^c$, which cancels. Only the **differences** of the scores determine the probabilities.

**For $C=2$ it is logistic.** $p_1=\dfrac{e^{z_1}}{e^{z_1}+e^{z_2}}=\dfrac1{1+e^{-(z_1-z_2)}}=\sigma\big((w_1-w_2)^Tx\big)$. Only the **difference** of the two weights matters, so it reduces to the single $w=w_1-w_2$ (divide the numerator and denominator by $e^{z_1}$).

:::ex Example 1 — Computing by hand
What are the softmaxes of $z=(0,\ 0,\ \ln2)$ and $z=(2,1,0.1)$?
---
First: $e^z=(1,1,2)$, sum 4, $p=(0.25,0.25,0.5)$.
Second: $e^z\approx(7.389,\ 2.718,\ 1.105)$, sum $\approx11.21$, $p\approx(0.659,\ 0.242,\ 0.099)$. Check that a score difference of 1 becomes a probability ratio of $e$: $0.659/0.242\approx2.72$.
:::

:::fig softtemp
:::
` },
      '6.2': { title: 'Likelihood and Cross-Entropy', body: R`
:::idea In plain words
The goal of training is the same as in logistic regression: in each sample, **the probability given to the correct class** should be large. Maximizing the product of the correct-class probabilities (the likelihood) is the same as minimizing the sum of “$-\log$ of the correct-class probability”.
:::

We write the labels **one-hot**: $y_{ik}=1$ if $y_i=k$, and 0 otherwise. For example, with 3 classes and correct answer 2, $y_i=(0,1,0)$. Then the probability of a sample is $p(y_i\mid x_i,W)=\prod_{k=1}^Cp(y_i=k\mid x_i,W)^{y_{ik}}$ (factors with exponent 0 become 1, leaving only the probability of the correct class), and

:::key The softmax cross-entropy loss
$$L(W)=\prod_{i=1}^N\prod_{k=1}^Cp(y_i=k\mid x_i,W)^{y_{ik}},$$
$$J(W)=-\log L=-\sum_{i=1}^N\sum_{k=1}^Cy_{ik}\log p(y_i=k\mid x_i,W)$$
:::

$J$ is the sum over samples of the cross-entropy between the one-hot distribution and the predicted distribution[[ch03:3.5|For a one-hot $p$, $H_p(q)=-\log q(\text{correct})$.]]. We minimize it by gradient descent.

**The log-sum-exp form.** If the correct class is $c$, then $-\log p_c=-z_c+\log\sum_je^{z_j}$. The loss is “the soft maximum of all class scores − the correct score”. If the correct score is much larger than the others, $\log\sum_je^{z_j}\approx z_c$ and the loss is close to 0.

:::ex Example 2 — The iris example (class notes)
$C=3$, $x=(5.1,3.5,1.4,0.2)\in\mathbb R^4$, and $W\in\mathbb R^{3\times4}$ has rows $w_1=(0.1,0.2,0.3,0.4)$, $w_2=(-0.3,0.1,0.5,0.2)$, $w_3=(0.2,-0.4,0.1,0.3)$; the correct answer is class 1, i.e., $y=(1,0,0)$. Find the probability of each class and the loss of this sample.
---
$z_1=0.51+0.70+0.42+0.08=1.71$, $z_2=-1.53+0.35+0.70+0.04=-0.44$, $z_3=1.02-1.40+0.14+0.06=-0.18$.
$e^{z}\approx(5.529,\ 0.644,\ 0.835)$, sum $\approx7.008$.
$$p\approx(0.789,\ 0.092,\ 0.119)$$
Since the label is one-hot, $\prod_kp_k^{y_k}=p_1\approx0.789$, and the loss is $-\log p_1\approx0.237$. The log-sum-exp form also gives $-1.71+\log7.008\approx-1.71+1.947=0.237$.
:::

### Going deeper: label smoothing and KL

If instead of one-hot we give the correct class only $1-\varepsilon$, as in $y=(1-\varepsilon,\ \frac\varepsilon{C-1},\dots)$ (label smoothing), the minimum of the loss is no longer 0, which reduces the overconfidence of a model that widens the score gaps without limit to output probability 1. The loss is then $H(y)+\KL(y\Vert p)$, i.e., “fit $p$ to the distribution $y$”. In knowledge distillation, the softmax output of a large model (temperature $T>1$) takes the place of $y$ to train a small model.
` },
      '6.3': { title: 'The Gradient', body: R`
:::idea In plain words
The result is as simple as in logistic regression: the gradient with respect to the weights of class $m$ is the sum of “(probability given to class $m$ − is the label $m$?) × input”. The weights of the correct class are pulled toward the input, and the weights of a wrong class that received much probability are pushed away from the input.
:::

$w_{mn}$ is the $n$-th component of the weight vector of class $m$. Since $z_k=w_k^Tx$, $\partial z_k/\partial w_{mn}=\delta_{km}x_n$ (the Kronecker delta: 1 if $k=m$, 0 otherwise — the scores of the other classes do not depend on $w_{mn}$).

:::key The gradient of the softmax loss
$$\frac{\partial p_k}{\partial z_m}=p_k(\delta_{km}-p_m),\qquad \frac{\partial p_k(x_i,W)}{\partial w_{mn}}=\big(\delta_{mk}p_k-p_kp_m\big)x_{in}$$
$$\frac{\partial J}{\partial w_{mn}}=-\sum_{i=1}^N\sum_{k=1}^Cy_{ik}\frac1{p_k}\frac{\partial p_k}{\partial w_{mn}}=-\sum_{i=1}^N\big(y_{im}-p_m(x_i,W)\big)x_{in}$$
As a matrix: $\nabla_WJ=\sum_i(p(x_i)-y_i)\,x_i^T$ ($C\times d$).
:::

**Derivation.** The quotient rule: $p_k=e^{z_k}/Z$, $Z=\sum_je^{z_j}$, $\partial Z/\partial z_m=e^{z_m}$.
$$\frac{\partial p_k}{\partial z_m}=\frac{\delta_{km}e^{z_k}Z-e^{z_k}e^{z_m}}{Z^2}=\delta_{km}p_k-p_kp_m.$$
(If $k=m$ it is $p_m(1-p_m)$ — the same shape as the sigmoid derivative; if $k\ne m$ it is $-p_kp_m$ — when another class's score rises, my probability falls.) By the chain rule, $\partial p_k/\partial w_{mn}=\sum_l\frac{\partial p_k}{\partial z_l}\frac{\partial z_l}{\partial w_{mn}}=(\delta_{km}p_k-p_kp_m)x_n$. Substituting into the loss,
$$\begin{aligned}\frac{\partial J}{\partial w_{mn}}&=-\sum_i\sum_ky_{ik}(\delta_{km}-p_m)x_{in}\\&=-\sum_i\Big(y_{im}-p_m\sum_ky_{ik}\Big)x_{in}=-\sum_i(y_{im}-p_m)x_{in},\end{aligned}$$
where the last equality holds because the label is one-hot, so $\sum_ky_{ik}=1$.

**All at once with the Jacobian.** $\frac{\partial p}{\partial z}=\diag(p)-pp^T$ ($C\times C$). The gradient of the single-sample loss $\ell=-\sum_ky_k\log p_k$ with respect to $z$ is
$$\nabla_z\ell=\Big(\frac{\partial p}{\partial z}\Big)^T\Big(-\frac{y}{p}\Big)=-(\diag(p)-pp^T)\frac yp=-y+p\sum_ky_k=p-y$$
($y/p$ is componentwise division). And since $z=Wx$, $\nabla_W\ell=(p-y)x^T$.

:::ex Example 3 — Computing the gradient
For a single sample with $p=(0.7,0.2,0.1)$, label $y=(0,1,0)$, and input $x=(1,3)$, write out all of $\nabla_W\ell$.
---
$p-y=(0.7,\ -0.8,\ 0.1)$. $\nabla_W\ell=(p-y)x^T=\begin{pmatrix}0.7&2.1\\-0.8&-2.4\\0.1&0.3\end{pmatrix}$.
Gradient descent **subtracts** this, so the weights of the correct class 2 move in the $+0.8x$ direction (toward the input), and class 1, which is wrong but received 0.7, moves in the $-0.7x$ direction. Also check that each column sums to 0 ($\sum_k(p_k-y_k)=1-1=0$) — a trace of shift invariance.
:::

:::tip In one sentence
For both logistic and softmax, $\nabla=\sum_i(\text{predicted probability}-\text{one-hot label})\otimes\text{input}$. This is why, in backpropagation, the upstream gradient of a “softmax + cross-entropy” layer is $p-y$.
:::
` },
      '6.4': { title: 'Properties and Numerical Computation', body: R`
:::idea In plain words
In actual computation you only need to watch out for three things. When scores reach around 1000, $e^{1000}$ overflows, so compute **after subtracting the largest score** (the answer is the same). Shifting all class weights together gives the same answer, so add **regularization** to pick one. And the loss is convex, so gradient descent goes to the global minimum.
:::

- **Shift invariance.** If $w_k\to w_k+c$ (the same $c$ for every $k$), every $e^{w_k^Tx}$ is multiplied by $e^{c^Tx}$ and $p_k$ is unchanged. Hence without regularization the minimizer is not unique (one class's weights may be fixed to 0).
- **Numerical stabilization.** So that $e^{z_k}$ does not overflow, compute after subtracting $m=\max_jz_j$: $\softmax(z)=\softmax(z-m\mathbf 1)$.
- **Convexity.** The Hessian of the single-sample loss with respect to $z$ is $\diag(p)-pp^T$, and $v^T(\diag(p)-pp^T)v=\sum_kp_kv_k^2-\big(\sum_kp_kv_k\big)^2=\Var_p(v)\ge0$, so it is positive semidefinite. Since $z$ is a linear function of $W$, $J$ is convex in $W$.
- **Temperature.** In $\softmax(z/T)$, as $T\to0$ the probability concentrates on the class with the maximum (argmax), and as $T\to\infty$ it approaches the uniform distribution (the cover figure).

:::ex Example 4 — Computing without overflow
What is the softmax of $z=(1000,1001,999)$?
---
Computing $e^{1000}$ as is overflows the floating point. Subtracting the maximum 1001 gives $z'=(-1,0,-2)$, $e^{z'}\approx(0.368,1,0.135)$, sum $1.503$, $p\approx(0.245,0.665,0.090)$. The $\log\sum e^{z_j}$ in the loss is computed the same way: $1001+\log1.503\approx1001.41$.
:::

**What the Hessian formula means.** $\sum_kp_kv_k^2-(\sum_kp_kv_k)^2$ is the variance of “a random variable taking the value $v_k$ with probability $p_k$”. A variance is nonnegative, so the Hessian is positive semidefinite, and if $v$ is a vector with all components equal, $c\mathbf 1$, the variance is 0 — exactly the shift-invariant direction. That is, the loss has **exactly one flat direction**, and regularization blocks it.

### Going deeper: log-sum-exp is a soft maximum

For $\operatorname{LSE}(z)=\log\sum_je^{z_j}$, $\max_jz_j\le\operatorname{LSE}(z)\le\max_jz_j+\log C$ (the sum is at least its largest term and at most $C$ times it). With a temperature, $T\operatorname{LSE}(z/T)\to\max_jz_j$ ($T\to0$). The gradient of LSE is exactly the softmax ($\partial\operatorname{LSE}/\partial z_k=p_k$), and its Hessian is $\diag(p)-pp^T$, so LSE is a convex function. That is, the softmax is “a smoothed version of the gradient of max (the one-hot argmax)”. The weights of attention are also made with this softmax.
` },
    },
    probs: [
      // u06
      { q: R`What is the second component of the softmax of $z=(-1,3)$? (4 decimal places)`,
        sol: R`$\frac{e^3}{e^{-1}+e^3}=\frac1{1+e^{-4}}\approx0.98201$.` },
      { q: R`What is the third component of the softmax of $z=(0,0,\ln2)$?`,
        sol: R`$e^z=(1,1,2)$, sum 4. The third component is $2/4=\tfrac12$.` },
      { q: R`For $C=2$, what is $p_1$ of softmax regression?`,
        choices: [R`$\sigma(w_1^Tx)$`, R`$\sigma((w_1-w_2)^Tx)$`, R`$\sigma(w_1^Tx)\sigma(w_2^Tx)$`, R`$\frac12(\sigma(w_1^Tx)+\sigma(w_2^Tx))$`],
        sol: R`Dividing the numerator and denominator by $e^{z_1}$ gives $p_1=1/(1+e^{-(z_1-z_2)})$.` },
      { q: R`If 5 is added to every logit $z_k$, the softmax output is…`,
        choices: [R`multiplied by 5 in every component`, R`unchanged`, R`the uniform distribution`, R`larger only at the maximum`],
        sol: R`Both the numerator and the denominator are multiplied by $e^5$, which cancels. That is why we may subtract the maximum in numerical computation.` },
      { q: R`In the iris example, what is $p_3$ when $z=(1.71,-0.44,-0.18)$? (3 decimal places)`,
        sol: R`$e^{-0.18}\approx0.835$, sum $\approx5.529+0.644+0.835=7.008$, $p_3\approx0.119$.` },
      { q: R`In the iris example, if the correct answer had been class 2, what would the loss $-\log p_2$ of this sample be? (2 decimal places)`,
        sol: R`$p_2\approx0.644/7.008\approx0.0919$, $-\ln0.0919\approx2.39$. Being confidently wrong makes the loss large.` },
      { q: R`For the one-hot label $y_i=(0,0,1,0)$, what is $\prod_kp_k^{y_{ik}}$?`,
        choices: [R`$p_1p_2p_3p_4$`, R`$p_3$`, R`$1-p_3$`, R`$\sum_kp_k$`],
        sol: R`The factors with $y_{ik}=0$ are $p_k^0=1$, so only the probability of the correct class remains.` },
      { q: R`What is $\partial p_k/\partial z_m$ ($k\ne m$)?`,
        choices: [R`$p_k(1-p_k)$`, R`$-p_kp_m$`, R`$p_kp_m$`, R`0`],
        sol: R`In $p_k(\delta_{km}-p_m)$, $k\ne m$ gives $-p_kp_m$. When the logit of another class grows, my probability shrinks.` },
      { q: R`For a single sample with $p=(0.7,0.2,0.1)$, label $y=(0,1,0)$, and input $x=(1,3)$, what is $\partial J/\partial w_{21}$ ($m=2$, $n=1$)?`,
        sol: R`$-(y_2-p_2)x_1=-(1-0.2)(1)=-0.8$. The weights of the correct class grow in the $-\nabla$ direction, i.e., toward the input.` },
      { q: R`For the same sample, what is $\partial J/\partial w_{12}$ ($m=1$, $n=2$)?`,
        sol: R`$-(y_1-p_1)x_2=-(0-0.7)(3)=2.1$. The weights of the wrong class 1 decrease.` },
      { q: R`Why is the minimizer of unregularized softmax regression not unique?`,
        choices: [R`Because the loss is not convex`, R`Because adding the same vector to every $w_k$ does not change the probabilities`, R`Because of the one-hot labels`, R`Because of the learning rate`],
        sol: R`If $w_k\to w_k+c$, $c^Tx$ is added to every logit and the output is the same. The loss is convex but not strictly convex.` },
      { q: R`Computed stably, what is the first component of the softmax of the logits $z=(1000,1001)$?`,
        sol: R`Subtracting the maximum 1001 gives $(-1,0)$, and $\frac{e^{-1}}{e^{-1}+1}=\frac1{1+e}$. Computed as is, $e^{1000}$ overflows.` },
      { q: R`For the softmax $p_k=e^{z_k}/\sum_je^{z_j}$, prove $\partial p_k/\partial z_m=p_k(\delta_{km}-p_m)$, and use it to show that the gradient of $J=-\sum_ky_k\log p_k$ (one-hot $y$) is $\partial J/\partial z_m=p_m-y_m$.`,
        sol: R`
$Z=\sum_je^{z_j}$. By the quotient rule,
$$\frac{\partial p_k}{\partial z_m}=\frac{(\partial e^{z_k}/\partial z_m)Z-e^{z_k}(\partial Z/\partial z_m)}{Z^2}=\frac{\delta_{km}e^{z_k}Z-e^{z_k}e^{z_m}}{Z^2}=\delta_{km}p_k-p_kp_m.$$
Then
$$\frac{\partial J}{\partial z_m}=-\sum_ky_k\frac1{p_k}\frac{\partial p_k}{\partial z_m}=-\sum_ky_k(\delta_{km}-p_m)=-y_m+p_m\sum_ky_k=p_m-y_m.$$
($\sum_ky_k=1$.) Since $z_m=w_m^Tx$, $\partial J/\partial w_{mn}=(p_m-y_m)x_n$.`,
        rubric: R`
- The quotient rule and handling $\delta_{km}$ — 4 pts
- Differentiating the log and simplifying the sum — 4 pts
- Using the one-hot condition — 2 pts` },
      // more-06
      { q: R`For the single-sample loss $\ell(z)=-\sum_{k=1}^Cy_k\log p_k$, $p=\softmax(z)$, with $y$ one-hot, (i) show the Jacobian $\frac{\partial p}{\partial z}=\diag(p)-pp^T$, and (ii) derive $\nabla_z\ell=p-y$ in two ways (using the Jacobian, and using the log-sum-exp form).`,
        sol: R`
**(i)** $p_k=e^{z_k}/Z$. $\frac{\partial p_k}{\partial z_m}=\frac{\delta_{km}e^{z_k}Z-e^{z_k}e^{z_m}}{Z^2}=\delta_{km}p_k-p_kp_m$. As a matrix, $\diag(p)-pp^T$ (symmetric).
**(ii-a)** $\frac{\partial\ell}{\partial p_k}=-\frac{y_k}{p_k}$. $\frac{\partial\ell}{\partial z_m}=\sum_k\frac{\partial\ell}{\partial p_k}\frac{\partial p_k}{\partial z_m}=-\sum_k\frac{y_k}{p_k}(\delta_{km}p_k-p_kp_m)=-y_m+p_m\sum_ky_k=p_m-y_m$.
**(ii-b)** If the correct class is $c$, $\ell=-z_c+\log\sum_je^{z_j}$. $\frac{\partial\ell}{\partial z_m}=-\delta_{mc}+\frac{e^{z_m}}{\sum_je^{z_j}}=p_m-y_m$.`,
        rubric: R`
- The Jacobian by the quotient rule — 3 pts
- The chain rule and $\sum y_k=1$ — 4 pts
- Differentiating the log-sum-exp form — 3 pts` },
      { q: R`Show that softmax regression with $C=2$ is the same as logistic regression with $w=w_1-w_2$, and explain why, as a result, fixing one of $(w_1,w_2)$ to 0 does not reduce the expressive power.`,
        sol: R`
$p_1=\frac{e^{w_1^Tx}}{e^{w_1^Tx}+e^{w_2^Tx}}$. Dividing the numerator and denominator by $e^{w_1^Tx}$ gives $\frac1{1+e^{-(w_1-w_2)^Tx}}=\sigma\big((w_1-w_2)^Tx\big)$, and $p_2=1-p_1$.
The probabilities depend only on $w_1-w_2$, so $(w_1,w_2)$ and $(w_1-w_2,0)$ are the same model. Hence every model can be represented even with $w_2=0$ fixed (in general, one of the $C$ vectors can be fixed to 0).`,
        rubric: R`
- The sigmoid form by cancellation — 5 pts
- Depends only on the difference → one vector can be fixed — 5 pts` },
      { q: R`For $H=\diag(p)-pp^T$ ($p_k>0$, $\sum p_k=1$), (i) show $v^THv=\sum_kp_kv_k^2-(\sum_kp_kv_k)^2\ge0$, and (ii) show $Hv=0\iff v=c\mathbf 1$. What does this mean for the minimizer of softmax regression?`,
        sol: R`
**(i)** $v^T\diag(p)v=\sum p_kv_k^2$ and $v^Tpp^Tv=(p^Tv)^2$. For the random variable $V$ taking the value $v_k$ with probability $p_k$, $\Var(V)=\E V^2-(\E V)^2\ge0$.
**(ii)** $(Hv)_k=p_kv_k-p_k(p^Tv)=p_k(v_k-p^Tv)$. Since $p_k>0$, $Hv=0\iff v_k=p^Tv$ (the same value for every $k$) $\iff v=c\mathbf 1$. (Conversely, if $v=c\mathbf1$ then $p^Tv=c$.)
**Meaning.** The loss is convex, but its curvature is 0 in the direction that adds the same value to the scores of all classes ($w_k\to w_k+c$ in terms of the weights), so the minimizers are spread along a whole line. The regularizer $\frac\lambda2\lVert W\rVert^2$ blocks this direction and picks a unique solution.`,
        rubric: R`
- (i) Interpreting as a variance — 4 pts
- (ii) Computing the null space — 4 pts
- Non-uniqueness of the minimizer and regularization — 2 pts` },
      { q: R`For $z\in\mathbb R^C$, prove $\max_kz_k\le\log\sum_ke^{z_k}\le\max_kz_k+\log C$.`,
        sol: R`
Let $M=\max_kz_k$. For every $k$, $e^{z_k}\le e^M$, and one term equals $e^M$, so $e^M\le\sum_ke^{z_k}\le Ce^M$. Taking the log (an increasing function) gives $M\le\log\sum e^{z_k}\le M+\log C$.`,
        rubric: R`
- Lower and upper bounds of the sum — 6 pts
- Taking the log — 4 pts` },
      { q: R`What is the third component of the softmax of $z=(\ln1,\ln2,\ln3,\ln4)$?`,
        sol: R`$e^z=(1,2,3,4)$, sum 10. $p_3=3/10$.` },
      { q: R`In the iris example ($p\approx(0.789,0.092,0.119)$), if the correct answer had been class 3, what would the loss $-\log p_3$ be? (2 decimal places)`,
        sol: R`$-\log p_3=-z_3+\log\sum e^{z_j}=0.18+1.947\approx2.13$.` },
      { q: R`With $W=0$ ($3\times2$), input $x=(1,2)$, correct class 1 ($y=(1,0,0)$), and learning rate $0.3$, what is $w_{12}$ (the second component of the class-1 weights) after one step of gradient descent?`,
        sol: R`At $W=0$, $p=(\tfrac13,\tfrac13,\tfrac13)$ and $p-y=(-\tfrac23,\tfrac13,\tfrac13)$. $\nabla_W=(p-y)x^T$, whose first row is $(-\tfrac23,-\tfrac43)$. $w_1\leftarrow0-0.3(-\tfrac23,-\tfrac43)=(0.2,0.4)$.` },
      { q: R`What is the limit of $\softmax(z/T)$ as the temperature $T\to0^+$? (the maximum of $z$ is unique)`,
        choices: [R`The uniform distribution`, R`The one-hot vector with 1 only at the maximum component (argmax)`, R`The normalized vector of $z$`, R`All components 0`],
        sol: R`$e^{(z_k-z_{\max})/T}$ is 1 if $k$ is the maximum, and otherwise the exponent goes to $-\infty$, giving 0.` },
      { q: R`With $p=(0.1,0.6,0.3)$, correct class 3, and input $x=(2,-1)$, what is $\partial\ell/\partial w_{32}$?`,
        sol: R`$(p_3-y_3)x_2=(0.3-1)(-1)=0.7$.` },
      { q: R`Show that the softmax regression loss $J(W)$ is convex in $W$. (Hint: the composition of a convex function with a linear map is convex.)`,
        sol: R`
The loss of sample $i$ is $\ell_i(W)=g(Wx_i)$ with $g(z)=-z_{y_i}+\log\sum_je^{z_j}$.
The Hessian of $g$ is $\diag(p)-pp^T\succeq0$ (the variance interpretation), so $g$ is convex. The term $-z_{y_i}$ is linear and does not affect convexity.
$z=Wx_i$ is a linear function of $W$, so for any $W,W'$ and $\lambda\in[0,1]$, $\ell_i(\lambda W+(1-\lambda)W')=g(\lambda Wx_i+(1-\lambda)W'x_i)\le\lambda g(Wx_i)+(1-\lambda)g(W'x_i)$. Hence each $\ell_i$ is convex, and so is their sum $J$, a sum of convex functions.`,
        rubric: R`
- The Hessian of $g$ is PSD — 4 pts
- The composition with a linear map is convex — 4 pts
- Convexity of the sum — 2 pts` },
      // quizprep-a
      { q: R`Softmax regression $p_{ik}=\softmax(Wx_i)_k$ (the $k$-th row of $W$ is $w_k^T$), loss $J(W)=-\sum_i\sum_ky_{ik}\log p_{ik}$ ($y_i$ one-hot).
1. Show that adding the same vector $c$ to every row ($w_k\to w_k+c$) does not change the probabilities. Conclude from this that the minimizer of $J$ (if one exists) is not unique.
2. Using $\nabla_{w_k}J=\sum_i(p_{ik}-y_{ik})x_i$, show that $\sum_k\nabla_{w_k}J=0$.
3. Show that at every stationary point of $J_\lambda(W)=J(W)+\frac\lambda2\sum_k\lVert w_k\rVert^2$ ($\lambda\gt0$), $\sum_kw_k=0$. Explain how the regularization removes the degree of freedom in 1.`,
        sol: R`
**1.** Every logit moves by the same number $s=c^Tx$, $z_k=w_k^Tx\to z_k+c^Tx$, so
$$\frac{e^{z_k+s}}{\sum_je^{z_j+s}}=\frac{e^se^{z_k}}{e^s\sum_je^{z_j}}=\frac{e^{z_k}}{\sum_je^{z_j}}.$$
Hence $J(W+\mathbf 1c^T)=J(W)$, and if $W^*$ is a minimizer, so is $W^*+\mathbf 1c^T$ for every $c$.
**2.** For each $i$, $\sum_k(p_{ik}-y_{ik})=1-1=0$, so $\sum_k\nabla_{w_k}J=\sum_i\Big[\sum_k(p_{ik}-y_{ik})\Big]x_i=0$.
**3.** At a stationary point, $\nabla_{w_k}J_\lambda=\nabla_{w_k}J+\lambda w_k=0$ for every $k$. Summing over $k$ and using 2 gives $0+\lambda\sum_kw_k=0$, and since $\lambda\gt0$, $\sum_kw_k=0$. Among $W+\mathbf 1c^T$, only $c=-\frac1C\sum_kw_k$, which minimizes the penalty $\sum_k\lVert w_k+c\rVert^2$, remains (rows summing to 0), so the ambiguity of 1 disappears.`,
        rubric: R`
- Invariance and non-uniqueness — 3 pts
- The gradients sum to 0 — 3 pts
- The condition at a regularized stationary point and its interpretation — 4 pts` },
    ],
  };
})();
