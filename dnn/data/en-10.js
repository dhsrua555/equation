/* English text — 10 SGD, Minibatches, Activation Functions (W4 Mon (2) slides 1–15 with notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    sgdpaths: R`Paths of 40 steps each from the same point with the same learning rate ($0.5$) on the least-squares loss (contours) of 40 data points. Batch GD moves smoothly, minibatch wobbles a little, and single-sample SGD wobbles strongly on its way to near the minimizer (open circle). The gradients of the three methods have the same expectation and differ only in **variance**. SGD cannot stay still even after reaching the minimizer and hovers around it (the noise floor).`,
    actderiv: R`These are the values multiplied at each layer in backpropagation. The sigmoid is at most $\tfrac14$, so the gradient shrinks by at least a factor of 4 at every layer, and for $\lvert z\rvert\gt4$ or so it is almost 0 (saturation). tanh is 1 at 0 but also 0 at both ends. ReLU is exactly 1 on the positive side, so it does not shrink, and exactly 0 on the negative side (dead ReLU).`,
  });
  EM.en.ch[10] = {
    title: 'Stochastic Gradients, Minibatches, and Activations',
    fig: R`A gradient descent path (smooth bold line) and a stochastic gradient descent path (wobbly line) on elliptical contours`,
    tagline: R`The expectation of the minibatch gradient equals the full gradient, and its variance shrinks as 1/B. Activation functions are chosen by saturation and zero-centeredness.`,
    summary: R`The loss is the mean of the per-sample losses, $f=\frac1N\sum f_i$, so the exact gradient needs the whole dataset. We may instead step with the gradient of a single sample or a small **minibatch** because, when drawn at random, that gradient is an **unbiased estimator** (its expectation is the exact gradient). The only difference is the variance, which shrinks as $1/B$ as the batch size $B$ grows. Most deep learning uses minibatch SGD (sample → forward → backward → update). The second half revisits activation functions from the viewpoint of their **derivatives**: the saturation and non-zero-centered outputs of the sigmoid, tanh, the advantages of ReLU and the dead ReLU, Leaky ReLU and ELU.`,
    goals: [
      R`Define the full-batch, stochastic, and minibatch gradients and state their pros and cons and the number of updates per epoch`,
      R`Prove that a randomly drawn (minibatch) gradient is an unbiased estimator`,
      R`Derive that the covariance of an i.i.d. minibatch gradient is $\Sigma/B$, and explain the correction factor for sampling without replacement`,
      R`Write the four steps of the minibatch SGD algorithm`,
      R`Find the derivatives of sigmoid, tanh, and ReLU and their ranges, and explain saturation, zero-centeredness, and the dead ReLU problem`,
    ],
    secTitles: { '10.1': 'Three gradients', '10.2': 'Expectation · variance', '10.3': 'Minibatch SGD', '10.4': 'Activation functions' },
    secs: {
      '10.1': { title: 'Full-Batch, Stochastic, and Minibatch Gradients', body: R`
:::idea In plain words
To predict an election result you could ask the whole country (accurate but very slow), but asking 1000 random people is fairly accurate too (a poll). Gradient descent is the same. Instead of asking the **whole** dataset “which way reduces the loss”, we ask a randomly chosen **part** of it (a minibatch) and take a step. Even if the answer is slightly off, on average it points the right way, so we get there in the end.
:::

Let the loss be the average of the per-data-point losses, $f(x)=\frac1N\sum_{i=1}^Nf_i(x)$, $f_i(x)=L(\hat y_i,y_i)$. (Here $x$ is the **parameter** of the network, and the data are hidden in the index $i$.)

:::key Unbiasedness of the minibatch gradient
- **Full (batch) gradient**: $\nabla f=\frac1N\sum_{i=1}^N\nabla f_i$ — exact, but each step is very expensive
- **Stochastic gradient**: $i\sim\mathrm{Uniform}\{1,\dots,N\}$, $\tilde f=f_i$, $\nabla\tilde f=\nabla f_i$ — each step is very fast, but the large variance makes the path unstable
- **Mini-batch (stochastic) gradient**: $K\subset\{1,\dots,N\}$, $\nabla\tilde f=\frac1{\lvert K\rvert}\sum_{k\in K}\nabla f_k$ — much faster than the full gradient and more stable than a single sample

With random selection, $\E[\nabla f_i(x)]=\nabla f(x)$ and $\E[\nabla\tilde f(x)]=\nabla f(x)$ (unbiased).
:::

The proof is one line: if $i$ is uniform, $\E[\nabla f_i]=\sum_{i=1}^N\frac1N\nabla f_i=\nabla f$. For a minibatch, each of the $B$ indices is drawn uniformly (with or without replacement, the marginal distribution of each position is uniform), so by linearity of expectation $\E\big[\frac1B\sum_b\nabla f_{k_b}\big]=\frac1B\sum_b\E[\nabla f_{k_b}]=\nabla f$. Most deep learning uses minibatch SGD.

**Epoch.** One pass over the whole training data is one epoch. The example in the notes: splitting 1000 data points into minibatches of size 100 gives **10** updates per epoch (batch GD 1, single-sample SGD 1000). If it does not divide evenly, the last batch is either smaller ($\lceil N/B\rceil$ updates if it is kept) or dropped ($\lfloor N/B\rfloor$ updates).

:::ex Example 1 — The cost of one step
There are $N=10^6$ data points, and computing the gradient of one sample takes $1\,\mu s$. What is the time of one step of batch GD and of minibatch SGD with $B=100$, and how many steps does each take in the same 1 second?
---
Batch GD: one step is $10^6\,\mu s=1$ second → 1 step per second. Minibatch: one step is $100\,\mu s$ → 10,000 steps per second. A minibatch step is less accurate, but being able to correct 10,000 times in the same time is overwhelming. (In practice a GPU processes a batch in parallel, which changes the ratio, but the direction is the same.)
:::

:::fig sgdpaths
:::
` },
      '10.2': { title: 'Same Expectation, Different Variance', body: R`
:::idea In plain words
In a poll, asking 100 people makes the result swing a lot from one survey to the next, while asking 10,000 barely swings. The size of the swing (the standard deviation) is inversely proportional to the **square root** of the sample size. The same holds for the minibatch gradient: making the batch 4 times larger halves the swing.
:::

The gradients of the three methods all have expectation identical to the full gradient. The difference is the **variance**. On the contour plot, batch GD goes to the minimizer smoothly, minibatch in a slight zigzag, and SGD with heavy wobbling. The SGD learning curve is jagged.

:::key Variance of the minibatch gradient
$g_i=\nabla f_i(x)$, $\Sigma=\frac1N\sum_i(g_i-\nabla f)(g_i-\nabla f)^T$ (the covariance of a single-sample gradient). If the minibatch indices $k_1,\dots,k_B$ are drawn **with replacement** (i.i.d. uniform),
$$\Cov\Big(\frac1B\sum_{b=1}^Bg_{k_b}\Big)=\frac1B\Sigma,\qquad \E\Big\lVert\frac1B\sum_bg_{k_b}-\nabla f\Big\rVert^2=\frac{\tr\Sigma}B.$$
Without replacement it is $\frac{N-B}{N-1}\cdot\frac{\Sigma}B$ (0 if $B=N$).
:::

**Derivation.** Let $X_b=g_{k_b}-\nabla f$; these are i.i.d. with $\E X_b=0$ and $\Cov(X_b)=\Sigma$. By independence the cross terms vanish, $\E[X_bX_c^T]=\E X_b\,\E X_c^T=0$ ($b\ne c$), so
$$\Cov\Big(\frac1B\sum_bX_b\Big)=\frac1{B^2}\sum_b\sum_c\E[X_bX_c^T]=\frac1{B^2}\sum_b\Sigma=\frac\Sigma B.$$
Taking the trace gives $\E\lVert\cdot\rVert^2=\tr\Sigma/B$ (the expected squared norm of a vector = the trace of its covariance). It is the same computation as $\Var(\bar X)=\sigma^2/n$ for a scalar sample mean (Section 2.3)[[ch02:2.3|For i.i.d. samples, the variance of the sample mean is $\sigma^2/n$.]].

That is, making the batch 4 times larger halves the standard deviation of the gradient noise. Unbiasedness alone guarantees a convergence rate for convex problems[[@ml:ch11:14.3|The SGD convergence theorem: E[f(w̄)] − f(w*) ≤ Bρ/√T.]]. On the other hand, the computation is proportional to $B$, so for the same amount of computation, going many times with small batches is often better. In the **SGD descent lemma** of Unit 13 we see this variance term limiting the convergence rate[[ch13:13.6|$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f\rVert^2+\frac L2\eta^2\E_t\lVert\tilde\nabla f\rVert^2$.]].

:::ex Example 2 — Counting the variance of sampling without replacement directly
From the scalar gradients $g_i\in\{1,3,5,7\}$ ($N=4$, mean 4), what is the variance of the minibatch mean when minibatches of size $B=2$ are drawn without replacement?
---
The means of the 6 possible pairs: $2,3,4,4,5,6$. Their variance is $\frac{4+1+0+0+1+4}6=\frac53$.
Checking the formula: $\sigma^2=\Sigma=\frac{9+1+1+9}4=5$, $\frac{N-B}{N-1}\cdot\frac{\sigma^2}B=\frac23\cdot\frac52=\frac53$ ✓. With replacement it would be the larger $\frac52$.
:::

### Going deeper: batch size and learning rate

Since the size of the noise enters as $\eta^2\tr\Sigma/B$ (Unit 13), making the batch $k$ times larger while also making the learning rate $k$ times larger keeps “the distance moved and the noise during one epoch” roughly the same (the **linear scaling rule**, Goyal et al. 2017). Using a large learning rate from the start is then unstable, so a **warmup** is needed[[ch12:12.2|Linear warmup: raise the learning rate linearly from 0 over the first few thousand iterations.]]. There are also observations that too large a batch has little noise and gets trapped in sharp minima, generalizing worse, so the noise of SGD is sometimes viewed as playing the role of a **regularizer**.
` },
      '10.3': { title: 'The Minibatch SGD Algorithm', body: R`
:::idea In plain words
Training is four lines repeated: draw a few data points → pass them through the network and measure the loss → compute the gradient backward → move the weights a little against the gradient. This is repeated tens of thousands to millions of times.
:::

Loop:
1. Sample a batch of data (batch size?)
2. Forward prop it through the graph (network), get the loss
3. Backprop to calculate the gradients[[ch09:9.2|Computational graphs and the chain rule.]]
4. Update the parameters using the gradient

In practice the data are often **shuffled** every epoch and then cut in order (sampling without replacement). Algorithm 7.2 of the medical AI course does it this way[[@med:ch08:7.2|Minibatch SGD: if $n>N$, shuffle and start over.]].

**Pseudocode.**
- Setup: initialize the parameters $\theta$ (Unit 11) and set the learning rate $\eta$ (Unit 12)
- For each epoch $e=1,\dots,E$: (1) shuffle the order of the data at random; (2) for each batch $K$ of $B$ consecutive points from the front, $g\leftarrow\frac1B\sum_{i\in K}\nabla_\theta f_i(\theta)$ (forward + backward) and $\theta\leftarrow\theta-\eta g$; (3) measure and record the validation loss (used for early stopping and adjusting the learning rate)

In PyTorch it is four lines: “clear previously computed gradients (zero_grad) → forward → backward → update (step)” (Section 8.5). The first line is needed because the library **accumulates** gradients (adding them, like a copy gate).

**Choosing the batch size.** Too small, and the noise is large and the GPU sits idle; too large, and each step is expensive and memory runs out. Powers of 2 between 32 and 512 are common, and with batch normalization (Unit 12) the batch size also affects the estimation of the statistics.
` },
      '10.4': { title: 'Revisiting Nonlinear Activation Functions', body: R`
:::idea In plain words
In backpropagation, the gradient is multiplied by the **derivative** of the activation function at every layer (Section 9.6). So a good activation function (1) has few regions where the derivative is near 0 (saturation) and (2) ideally produces both positive and negative outputs centered around 0. The sigmoid is bad at both, tanh is good only at (2), and ReLU is good at (1) but switches off completely for negative inputs.
:::

:::key Derivatives of the activation functions
$$\sigma'(z)=\sigma(z)(1-\sigma(z))\in\big(0,\tfrac14\big],\qquad \tanh'(z)=1-\tanh^2(z)\in(0,1],$$
$$\ReLU'(z)=\begin{cases}1&z>0\\0&z<0\end{cases}$$
$\tanh(z)=2\sigma(2z)-1$.
:::

**Why these ranges.** $\sigma(1-\sigma)$ is the quadratic $s-s^2$ in $s=\sigma\in(0,1)$, with maximum $\tfrac14$ at $s=\tfrac12$ ($z=0$) — which also follows from the AM–GM inequality $s(1-s)\le\big(\frac{s+1-s}2\big)^2=\frac14$. $\tanh'=1-\tanh^2$ lies in $(0,1]$ because $\tanh\in(-1,1)$. ReLU is not differentiable at $z=0$, but by convention 0 (or 1) is used.

:::fig actderiv
:::

**Sigmoid** $g(z)=\frac1{1+e^{-z}}$
- Pros: bounds the activation value range to $[0,1]$
- Cons 1: **zero gradient on saturated neurons**. When $\lvert z\rvert$ is large, $\sigma'(z)\approx0$ and the backpropagated signal vanishes. For example, $\sigma'(4)\approx0.0177$, $\sigma'(10)\approx4.5\times10^{-5}$.
- Cons 2: **outputs are not zero-centered** (always positive). In the weight gradient of the next layer, $\frac{\partial L}{\partial W}=\frac{\partial L}{\partial h}\,z^T$, if the inputs $z$ are all positive, the gradients of the weights coming into a neuron all have the same sign. So the weights move only “all toward the positive direction” or “all toward the negative direction”, producing a zigzag path.

:::key Sigmoid outputs are not zero-centered
For a neuron $s=\sum_iw_ix_i+b$ with all $x_i>0$, the sign of $\frac{\partial L}{\partial w_i}=\frac{\partial L}{\partial s}x_i$ equals the sign of $\frac{\partial L}{\partial s}$, regardless of $i$.
:::

**An example of the zigzag.** Suppose there are two weights and the optimal direction is $(+1,-1)$ (one must grow and the other shrink). If the inputs are all positive, each update $-\eta\frac{\partial L}{\partial s}(x_1,x_2)$ points only into the first or the third quadrant, so the weights must approach $(+1,-1)$ in a staircase, alternating between the $(+,+)$ and $(-,-)$ directions. Making the inputs mean 0 (tanh, input normalization, BN) removes this problem.

**tanh**: outputs in $[-1,1]$, **zero-centered (symmetric)**. But the gradient is still 0 in the saturated regions.

**ReLU** $g(z)=\max(0,z)$
- Pros: no saturation on the positive side, and easy to compute (one comparison)
- Cons: outputs are not zero-centered, and **zero gradient for negative inputs** — once a neuron is negative on every input, it cannot come back to life (the “dead ReLU”)

**An example of a dead ReLU.** If the learning rate is too large and one update makes the bias very negative ($b=-100$), then $w^Tx+b<0$ for almost every input → output 0, gradient 0 → the weights are never updated again. A small positive initial bias or Leaky ReLU is the remedy.

**Others**: Leaky ReLU $\max(0.01x,x)$ (a small slope on the negative side as well), ELU $x\ (x>0)$, $\alpha(e^x-1)\ (x\le0)$ (saturates smoothly on the negative side, with mean close to 0). The default in practice is ReLU, and only the output layer is chosen for the purpose (sigmoid: binary probability, softmax: multiclass).

### Going deeper: the link between gradient flow and initialization

In $\delta_\ell=\sigma'(a_\ell)\odot W_{\ell+1}^T\delta_{\ell+1}$, $\lVert\delta_\ell\rVert$ is multiplied at each layer by roughly “the typical size of $\sigma'$ × the size of $W$”. ReLU has $\sigma'=1$ on active neurons, but about half of them are 0, so on average the **second moment of the signal is halved**. Doubling the weight variance to compensate is the He initialization $\Var(w)=2/D_{\text{in}}$ of Unit 11[[ch11:11.3|Passing through ReLU halves the second moment, so double the variance.]].
` },
    },
    probs: [
      // u10
      { q: R`When 1000 training data points are split with batch size 100, how many updates are there per epoch?`,
        sol: R`$1000/100=10$. Batch GD: 1; single-sample SGD: 1000.` },
      { q: R`With $N=50000$ data points and batch size $B=128$ (including the last incomplete batch), how many updates are there per epoch?`,
        sol: R`$50000/128=390.6$, so 391 (the last batch has 80).` },
      { q: R`Which is a correct feature of full-batch gradient descent?`,
        choices: [R`The gradient is inaccurate but fast`, R`The gradient is exact, but each step is expensive`, R`It has the largest variance`, R`It has no notion of an epoch`],
        sol: R`$\frac1N\sum\nabla f_i$ must be computed every time.` },
      { q: R`Which is correct about the gradient $\nabla f_i$ of a uniformly drawn sample?`,
        choices: [R`$\E[\nabla f_i]=N\nabla f$`, R`$\E[\nabla f_i]=\nabla f$`, R`$\nabla f_i=\nabla f$ always`, R`Its variance is 0`],
        sol: R`$\sum_i\frac1N\nabla f_i=\nabla f$ (unbiased). Individual values differ and have variance.` },
      { q: R`The variance (scalar) of a single-sample gradient is $\sigma^2=16$. What is the standard deviation of the gradient of an i.i.d. minibatch with $B=64$?`,
        sol: R`The variance is $16/64=0.25$, so the standard deviation is $0.5$.` },
      { q: R`From the scalar gradients $g_i\in\{1,3,5,7\}$ ($N=4$), what is the variance of the minibatch mean when minibatches of size 2 are drawn **without replacement**?`,
        sol: R`$\sigma^2=\frac14\sum(g_i-4)^2=\frac{9+1+1+9}4=5$. Without replacement: $\frac{N-B}{N-1}\frac{\sigma^2}B=\frac23\cdot\frac52=\frac53$. (Check with the variance of the means $2,3,4,4,5,6$ of the 6 pairs: mean 4, sum of squared deviations $4+1+0+0+1+4=10$, $10/6=5/3$.)` },
      { q: R`What is $\sigma'(z)$ at $z=4$? (4 decimal places)`,
        sol: R`$\sigma(4)\approx0.9820$, $\sigma'=0.9820\times0.0180\approx0.0177$. It is in the saturated region, so the gradient is small.` },
      { q: R`What is $\tanh'(0)$?`,
        sol: R`$1-\tanh^2(0)=1$. It is 4 times the sigmoid's maximum slope $\frac14$ (since $\tanh(z)=2\sigma(2z)-1$, $\tanh'(z)=4\sigma'(2z)$).` },
      { q: R`What problem arises because sigmoid outputs are not zero-centered?`,
        choices: [R`The outputs exceed 1`, R`The weight gradients of a neuron in the next layer all have the same sign, so the updates zigzag`, R`Backpropagation becomes impossible`, R`The loss becomes negative`],
        sol: R`$\partial L/\partial w_i=\delta\,x_i$, and if $x_i>0$ the sign equals that of $\delta$. If the optimal direction is + for some weights and − for others, it cannot be reached in one move.` },
      { q: R`Which disadvantages of ReLU did the slides mention?`,
        choices: [R`Saturation on the positive side`, R`Zero gradient for negative inputs and outputs that are not zero-centered`, R`Expensive computation`, R`Bounded outputs`],
        sol: R`No saturation on the positive side and easy computation are its advantages.` },
      { q: R`Which activation function has zero-centered (symmetric) outputs but still has the saturation problem?`,
        choices: [R`Sigmoid`, R`tanh`, R`ReLU`, R`Leaky ReLU`],
        sol: R`The range of tanh is $[-1,1]$ and it is symmetric about the origin. The gradient in the saturated regions is still close to 0.` },
      { q: R`For $f=\frac1N\sum_if_i$, when the indices $k_1,\dots,k_B$ are drawn independently and uniformly from $\{1,\dots,N\}$, show that the minibatch gradient $\hat g=\frac1B\sum_b\nabla f_{k_b}$ is unbiased and that $\E\lVert\hat g-\nabla f\rVert^2=\frac1B\cdot\frac1N\sum_i\lVert\nabla f_i-\nabla f\rVert^2$.`,
        sol: R`
**Unbiased.** $\E[\nabla f_{k_b}]=\sum_i\frac1N\nabla f_i=\nabla f$, so by linearity $\E\hat g=\nabla f$.
**Variance.** $e_b=\nabla f_{k_b}-\nabla f$ are independent with $\E e_b=0$ and $\E\lVert e_b\rVert^2=\frac1N\sum_i\lVert\nabla f_i-\nabla f\rVert^2=:s^2$.
$$\E\Big\lVert\frac1B\sum_be_b\Big\rVert^2=\frac1{B^2}\Big(\sum_b\E\lVert e_b\rVert^2+\sum_{b\ne c}\E[e_b]^T\E[e_c]\Big)=\frac1{B^2}\cdot Bs^2=\frac{s^2}B.$$
The cross terms are 0 by independence and $\E e_b=0$.`,
        rubric: R`
- Unbiasedness — 3 pts
- The error decomposition and independence — 3 pts
- Eliminating the cross terms and $s^2/B$ — 4 pts` },
      { q: R`(1) Show that $\sigma'(z)\le\frac14$, and (2) prove $\tanh(z)=2\sigma(2z)-1$ and $\tanh'(z)=1-\tanh^2(z)$.`,
        sol: R`
(1) With $s=\sigma(z)\in(0,1)$, $\sigma'=s(1-s)=\frac14-(s-\frac12)^2\le\frac14$, with equality at $z=0$.
(2) $2\sigma(2z)-1=\frac2{1+e^{-2z}}-1=\frac{1-e^{-2z}}{1+e^{-2z}}=\frac{e^z-e^{-z}}{e^z+e^{-z}}=\tanh z$.
$\tanh'(z)=\frac{(e^z+e^{-z})^2-(e^z-e^{-z})^2}{(e^z+e^{-z})^2}=1-\tanh^2z$. (Alternatively, substitute $\sigma(2z)=\frac{1+\tanh z}2$ into $4\sigma'(2z)=4\sigma(2z)(1-\sigma(2z))$.)`,
        rubric: R`
- (1) Completing the square — 3 pts
- (2) The identity — 3 pts
- (2) The derivative — 4 pts` },
      // more-10
      { q: R`From scalar values $x_1,\dots,x_N$ (mean $\mu$, variance $\sigma^2=\frac1N\sum(x_i-\mu)^2$), show that when a sample of size $B$ is drawn **without replacement**, the variance of the sample mean is $\frac{\sigma^2}B\cdot\frac{N-B}{N-1}$.`,
        sol: R`
$X_b=x_{k_b}-\mu$ ($b=1,\dots,B$). The marginal distribution of each $X_b$ is uniform, so $\E X_b=0$ and $\E X_b^2=\sigma^2$.
If $b\ne c$, $(k_b,k_c)$ is uniform over ordered pairs of distinct indices, so
$$\E[X_bX_c]=\frac1{N(N-1)}\sum_{i\ne j}(x_i-\mu)(x_j-\mu)=\frac{\big(\sum_i(x_i-\mu)\big)^2-\sum_i(x_i-\mu)^2}{N(N-1)}=\frac{0-N\sigma^2}{N(N-1)}=-\frac{\sigma^2}{N-1}.$$
$\Var\big(\sum_bX_b\big)=B\sigma^2+B(B-1)\Big(-\frac{\sigma^2}{N-1}\Big)=B\sigma^2\frac{N-B}{N-1}$. Dividing by $B^2$ gives the result. (If $B=N$ it is 0 — drawing everything leaves no wobble.)`,
        rubric: R`
- The marginal distribution of each position is uniform — 2 pts
- The covariance of two distinct positions, $-\sigma^2/(N-1)$ — 5 pts
- The variance of the sum and simplification — 3 pts` },
      { q: R`For $f=\frac1N\sum_{i=1}^Nf_i$, when the minibatch $K$ is drawn uniformly among all subsets of size $B$, show that $\E\big[\frac1B\sum_{k\in K}\nabla f_k\big]=\nabla f$.`,
        sol: R`
$\frac1B\sum_{k\in K}\nabla f_k=\frac1B\sum_{i=1}^N\mathbb 1[i\in K]\nabla f_i$. By symmetry every $i$ has the same probability of being included, and $\sum_iP(i\in K)=\E\lvert K\rvert=B$, so $P(i\in K)=B/N$.
By linearity of expectation, $\E\big[\frac1B\sum_i\mathbb 1[i\in K]\nabla f_i\big]=\frac1B\sum_i\frac BN\nabla f_i=\nabla f$.`,
        rubric: R`
- Writing with indicator functions — 3 pts
- The inclusion probability $B/N$ — 4 pts
- Concluding by linearity — 3 pts` },
      { q: R`When $60000$ data points are split with batch size $256$ and the last incomplete batch is **dropped**, how many updates are there per epoch?`,
        sol: R`$\lfloor60000/256\rfloor=\lfloor234.375\rfloor=234$. If it is not dropped, 235.` },
      { q: R`If the variance of a single-sample scalar gradient is $9$, what is the standard deviation of the gradient of an i.i.d. minibatch with $B=36$?`,
        sol: R`$\sqrt{9/36}=0.5$.` },
      { q: R`What is $\sigma'(-2)$? (4 decimal places)`,
        sol: R`$\sigma(-2)\approx0.1192$, $\sigma'=0.1192\times0.8808\approx0.1050$. Since $\sigma'(-z)=\sigma'(z)$ (symmetric), it equals $\sigma'(2)$.` },
      { q: R`In backpropagation through 5 sigmoid layers, what is the maximum of the product of the derivative factors alone, $\prod\sigma'(a_\ell)$?`,
        sol: R`Each $\sigma'\le\frac14$, so the product is $\le4^{-5}\approx0.00098$. Unless the weights compensate for this, the gradients of the early layers vanish.` },
      { q: R`(i) Show $\sigma'(z)=\sigma(z)(1-\sigma(z))\le\frac14$ with the AM–GM inequality and write the equality condition. (ii) What about $\tanh'(z)\le1$ and its equality condition?`,
        sol: R`
**(i)** $s=\sigma(z)\in(0,1)$, $1-s>0$. $\sqrt{s(1-s)}\le\frac{s+(1-s)}2=\frac12$, so $s(1-s)\le\frac14$, with equality when $s=1-s$, i.e., $\sigma(z)=\tfrac12$, $z=0$.
**(ii)** $\tanh'(z)=1-\tanh^2(z)\le1$, with equality when $\tanh z=0$, i.e., $z=0$.`,
        rubric: R`
- (i) Applying the inequality — 4 pts
- (i) The equality condition — 2 pts
- (ii) — 4 pts` },
      { q: R`Show that if the inputs of a neuron $s=w_1x_1+w_2x_2+b$ are always positive ($x_1,x_2>0$), one gradient descent update $\Delta w=-\eta\nabla_wL$ points only in the first or third quadrant direction, and explain what happens when the optimal direction of change is $(1,-1)$.`,
        sol: R`
$\nabla_wL=\frac{\partial L}{\partial s}(x_1,x_2)$. Since $x_1,x_2>0$, both components have the sign of $\frac{\partial L}{\partial s}$. Hence $\Delta w$ has both components positive (first quadrant) or both negative (third quadrant) (even if $x$ differs from sample to sample, the sign relation is the same).
It cannot move in the $(1,-1)$ direction (fourth quadrant) in one step, so it must move in a “staircase zigzag”, e.g., once along $(+,+)$ and once along $(-,-)$ alternately, and convergence slows down. Making the inputs mean 0 (tanh, normalization) solves this.`,
        rubric: R`
- Analysis of the signs of the gradient — 5 pts
- Explaining the zigzag and slow convergence — 3 pts
- The remedy — 2 pts` },
      { q: R`During training, the bias of some ReLU neuron became $-50$, so $w^Tx+b<0$ for every training input. Which is correct?`,
        choices: [R`The gradient grows at the next update and it soon recovers`, R`Both the output and the gradient are 0, so the weights of that neuron are no longer updated`, R`The output becomes negative and sends a negative signal to the next layer`, R`It never happens, regardless of the learning rate`],
        sol: R`This is a “dead ReLU”. ReLU$'=0$, so the backpropagated signal is cut at that neuron. Leaky ReLU, a smaller learning rate, and a positive initial bias are remedies.` },
      // quizprep-b
      { q: R`Data $(x_i,y_i)=(1,1),(2,3),(3,2)$ and $f(\beta)=\frac13\sum_{i=1}^3\frac12(\beta x_i-y_i)^2$ ($\beta\in\mathbb R$).
1. Show that the stochastic gradient using one uniformly drawn sample, $g=(\beta x_I-y_I)x_I$ ($I$ uniform on $\{1,2,3\}$), satisfies $\E g=f'(\beta)$.
2. Find $\Var(g)$ at $\beta=1$.
3. Prove that the variance of the mean gradient $\bar g_B$ of a minibatch of size $B$ drawn independently with replacement is $\Var(g)/B$. At $\beta=1$, how large must $B$ be to make the standard deviation at most $0.5$?`,
        sol: R`
**1.** $\E g=\frac13\sum_i(\beta x_i-y_i)x_i$ and $f'(\beta)=\frac13\sum_i(\beta x_i-y_i)x_i$. They are equal (an unbiased estimator).
**2.** $\beta=1$: $g_1=(1-1)\cdot1=0$, $g_2=(2-3)\cdot2=-2$, $g_3=(3-2)\cdot3=3$. $\E g=\frac13$, $\E g^2=\frac{0+4+9}3=\frac{13}3$, $\Var g=\frac{13}3-\frac19=\frac{38}9\approx4.222$.
**3.** $\bar g_B=\frac1B\sum_{b=1}^Bg^{(b)}$, where the $g^{(b)}$ are i.i.d., so their covariances are 0 and
$$\Var\bar g_B=\frac1{B^2}\sum_b\Var g^{(b)}=\frac{B\Var g}{B^2}=\frac{\Var g}B.$$
The standard deviation $\sqrt{38/(9B)}\le0.5\iff B\ge\frac{38}{9\cdot0.25}\approx16.9$, so $B\ge17$.`,
        rubric: R`
- Unbiasedness — 3 pts
- Computing the variance — 3 pts
- Proof of the $1/B$ (stating the use of independence) — 3 pts; the batch size — 1 pt` },
    ],
  };
})();
