/* English text — 11 Weight Initialization (W4 Mon (2) slides 16–26 with notes, W4 Wed (1) notes: deriving He initialization). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    initstd: R`The standard deviation of the activations measured at each layer in the slide's experiment (4096 hidden units, 6 layers, randn input). (a) tanh: scaled small by $0.01$, it shrinks at every layer toward 0; scaled large by $0.05$, it piles up at $\pm1$ and saturates (the standard deviation stalls at 0.85); Xavier stays moderate. (b) ReLU: Xavier shrinks at every layer, while He initialization keeps almost the same value at every layer.`,
  });
  EM.en.ch[11] = {
    title: 'Weight Initialization',
    fig: R`Distributions of activations through six tanh layers. Too small an initialization collapses to 0 (thin lines), while Xavier keeps the spread (bold line)`,
    tagline: R`$\Var(\sum_iw_ix_i)=D_{in}\sigma^2v$. To preserve the variance layer by layer, use $\sigma^2=1/D_{in}$ for tanh, and $2/D_{in}$ for ReLU since half is cut off.`,
    summary: R`Training starts from the initial values of the weights. If they are too small, the signal shrinks to 0 as it passes through the layers and the gradients vanish; if they are too large, tanh saturates and the gradients vanish as well. The solution is to choose the variance of the weights **so that the size of the signal (its variance or second moment) is preserved at every layer**. Under independence and zero mean, $\Var(\sum w_ix_i)=D_{in}\sigma^2v$, so $\sigma^2=1/D_{in}$ (Xavier). ReLU cuts off the negative half and halves the second moment, so $\sigma^2=2/D_{in}$ (He). In class, He initialization was derived by computing $\E[\max(0,z)]$ and $\E[\max(0,z)^2]$ as integrals. Finally we see why all the weights must not be set equal (symmetry breaking).`,
    goals: [
      R`Explain, with the forward activations and backward gradients, why learning stops with too small or too large an initialization`,
      R`Derive $\Var(\sum w_ix_i)=D_{in}\sigma^2v$ under independence and zero mean, and obtain Xavier initialization`,
      R`Compute $\E[\max(0,z)]=\sqrt{q/2\pi}$ and $\E[\max(0,z)^2]=q/2$ for $z\sim\N(0,q)$ by integration`,
      R`Derive He initialization $\sigma^2=2/D_{in}$ from the condition of preserving the second moment, and state its assumptions exactly`,
      R`Explain variance preservation in the backward direction and Glorot's compromise $2/(D_{in}+D_{out})$`,
      R`Prove why initializing with equal values keeps the neurons identical forever (symmetry)`,
    ],
    secTitles: { '11.1': 'Small/large init', '11.2': 'Xavier', '11.3': 'He', '11.4': 'Symmetry breaking' },
    secs: {
      '11.1': { title: 'Initializing Too Small or Too Big', body: R`
:::idea In plain words
Think of the whisper game. If each person passes the message on a little more **quietly**, the tenth person hears nothing (the signal dies); if each passes it on a little **louder**, it becomes a shout and the meaning is lost (saturation). The signal is multiplied by the weights at every layer, so the size of the weights is this “volume control”, and chosen well it keeps the same volume through many layers.
:::

Experiment: a 6-layer network with 4096 hidden units, input $x$=randn(16, 4096), tanh activations.

**Too small** ($W=0.01\times$randn): the standard deviation of the activations at each layer shrinks as $0.49,\,0.29,\,0.18,\,0.11,\,0.07,\,0.05$, giving **almost zero activations at the top layers**. The weight gradient is
$$\frac{\partial L}{\partial W}=\frac{\partial L}{\partial h}\,z^T$$
and since the input activations $z\approx0$, $\frac{\partial L}{\partial W}\approx0$ → **no learning**.

**Too big** ($W=0.05\times$randn): the standard deviation stays at $0.87,\,0.85,\dots$, but the activations pile up at $\pm1$ and **tanh saturates**. In the backward gradient
$$\frac{\partial L}{\partial z}=\frac{\partial L}{\partial h}\frac{\partial h}{\partial z}=\big(\sigma'(\cdot)\,W^T\big)\frac{\partial L}{\partial h}$$
we have $\sigma'\approx0$ (almost zero gradient due to saturation in the nonlinear function) → **no learning**.

**Xavier** ($W=$randn$/\sqrt{D_{in}}$): the standard deviations $0.63,\,0.49,\,0.41,\,0.36,\,0.32,\,0.30$ are reasonably spread at every layer.

:::fig initstd
:::

**Why 0.01 shrinks and 0.05 saturates.** The standard deviation of a neuron's input sum $\sum_{i=1}^{4096}w_ix_i$ is roughly $\sqrt{4096}\times(\text{weight standard deviation})\times(\text{input size})=64\times0.01\times(\cdot)=0.64\times(\cdot)$. It shrinks by about 0.64 at every layer (tanh shrinks it a little more). With $0.05$ it grows by $64\times0.05=3.2$, the input sums are around $\pm3$, and $\tanh$ sticks to $\pm1$. Xavier uses $1/\sqrt{4096}=1/64$, exactly a factor of 1 — the next section does this computation exactly.

:::warn The two kinds of “no learning” have different causes
With a small initialization the **forward signal** ($z$) becomes 0, so the weight gradient $\delta z^T$ is 0; with a large initialization, $\sigma'$ becomes 0 in the **backward signal** and the gradient is cut. Use the two formulas ($\partial L/\partial W=\delta z^T$ and $\delta_\ell=\sigma'\odot W^T\delta_{\ell+1}$) separately.
:::
` },
      '11.2': { title: 'Xavier (Glorot) Initialization', body: R`
:::idea In plain words
A neuron multiplies its $D_{in}$ inputs by weights and adds them up. Adding $D_{in}$ independent random values multiplies the variance by $D_{in}$, so setting the variance of the weights to $1/D_{in}$ cancels it exactly, and the variance of the output equals that of the input.
:::

:::key Xavier initialization
$y=\sum_{i=1}^{D_{in}}w_ix_i$. Assume: the $w_i$ are i.i.d. and the $x_i$ are i.i.d., $w$ and $x$ are independent, $\E[w_i]=0$, $\Var(w_i)=\sigma^2$, $\E[x_i]=0$, $\Var(x_i)=v$. Then
$$\Var(y)=D_{in}\,\sigma^2\,v.$$
Requiring $\Var(y)=\Var(x_i)=v$ gives $\sigma^2=\dfrac1{D_{in}}$, i.e., $W=\text{randn}(D_{in},D_{out})/\sqrt{D_{in}}$.
:::

:::hand Class notes — computing the variance
$\Var(y)=\E[y^2]-(\E[y])^2$, and $\E[y]=\sum_i\E[w_i]\E[x_i]=0$.
$$\E[y^2]=\E\Big[\Big(\sum_iw_ix_i\Big)^2\Big]=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k]$$
$$=\sum_i\E[w_i^2]\E[x_i^2]+\sum_{i\ne k}\underbrace{\E[w_i]}_{0}\E[w_k]\E[x_ix_k]=\sum_{i=1}^{D_{in}}\sigma^2\,\E[x_i^2].$$
Since $\E[x_i^2]=\Var(x_i)=v$ ($\E x_i=0$), $\Var(y)=D_{in}\sigma^2v$. Setting $\Var(y)=v$ gives $D_{in}\sigma^2v=v\Rightarrow\sigma^2=1/D_{in}$.
:::

**The justification of each equality.** (1) Expanding the square gives terms with equal indices, $w_i^2x_i^2$, and terms with different indices, $w_iw_kx_ix_k$. (2) $w$ and $x$ are independent, so $\E[w_i^2x_i^2]=\E[w_i^2]\E[x_i^2]$. (3) If $i\ne k$, $w_i$ is independent of the rest, so $\E[w_i]=0$ can be factored out and all the cross terms are 0. (4) $\E[w_i^2]=\Var(w_i)+(\E w_i)^2=\sigma^2$.

:::ex Example 1 — In numbers
If $D_{in}=100$, $\Var(w_i)=0.02$, and $\Var(x_i)=1$, then $\Var(y)=100\times0.02\times1=2$ — the variance doubles at every layer. Over 6 layers that is $2^6=64$ times. Xavier would give $\Var(w_i)=0.01$, standard deviation $0.1$.
:::

- Glorot & Bengio (2010) originally also wanted to preserve the variance in the backward direction ($\sigma^2=1/D_{out}$) and proposed the compromise of the two conditions, $\sigma^2=\dfrac2{D_{in}+D_{out}}$. The table in the medical AI course (Bishop) is this formula[[@med:ch08:7.2b|Xavier $2/(n_{in}+n_{out})$, He $2/n_{in}$.]].
- This derivation assumes that the inputs have **zero mean**. It fits zero-centered activations like tanh but not ReLU.

**Deriving the backward condition.** In backpropagation, $\frac{\partial L}{\partial x_i}=\sum_{j=1}^{D_{out}}W_{ji}\delta_j$ (the $W^T\delta$ of Section 9.5), so the same computation gives $\Var\big(\frac{\partial L}{\partial x_i}\big)=D_{out}\sigma^2\Var(\delta_j)$. Preserving the variance of the gradients requires $\sigma^2=1/D_{out}$. If the input and output widths differ, both conditions cannot hold at once, so we compromise with the harmonic mean $\frac2{D_{in}+D_{out}}$. Drawing from the uniform distribution $U(-a,a)$ (variance $a^2/3$) gives $a=\sqrt{6/(D_{in}+D_{out})}$.

### Going deeper: why the linear approximation is fine

Near 0, $\tanh z\approx z$, so if the input variance is moderate a layer can be viewed as “almost linear”, and the computation above holds approximately even including the activation. Still, for large $\lvert z\rvert$, tanh outputs values smaller than $\lvert z\rvert$, so even with Xavier the signal shrinks a little at every layer (the slide's $0.63\to0.30$). The $1/D_{in}$ that uses only the input width $D_{in}$ is also called LeCun initialization.
` },
      '11.3': { title: 'ReLU and He (Kaiming) Initialization', body: R`
:::idea In plain words
ReLU throws away negative values as 0. If the input sums are symmetric about 0, **half** is thrown away, so the energy of the signal (the second moment) is halved at every layer. So we make the weight variance **twice** that of Xavier to compensate in advance.
:::

Using Xavier in a ReLU network, the activations collapse toward 0 again as the layers go on (slide: mean/standard deviation from $0.39/0.58$ down to $0.07/0.10$). This is because ReLU cuts the negative half to 0, **halving the second moment at every layer**. (Xavier assumed zero-centered activations, and ReLU is not zero-centered.)

:::key He initialization
Approximating $z=\sum_{i=1}^{D_{in}}w_ix_i$ with $\E[w_i]=0$, $\Var(w_i)=\sigma^2$, $h=\max(0,z)$, by $z\sim\N(0,q)$,
$$\E[h]=\sqrt{\frac q{2\pi}},\qquad \E[h^2]=\frac q2,\qquad q=\Var(z)=D_{in}\sigma^2v.$$
To preserve the second moment at every layer, $\E[h^2]=\E[x^2]=v$, i.e., $\tfrac12D_{in}\sigma^2v=v$:
$$\sigma^2=\frac2{D_{in}},\qquad \sigma=\sqrt{\frac2{D_{in}}}.$$
:::

:::hand Class notes — deriving He initialization
$\Var(z)=\sum_{i}\Var(w_ix_i)$ (independence). $\Var(x_iw_i)=\E[(w_ix_i)^2]-(\E[w_ix_i])^2$ with $\E[w_ix_i]=\E[w_i]\E[x_i]=0$ and $\E[(w_ix_i)^2]=\E[w_i^2]\E[x_i^2]=\sigma^2v$. Hence $\Var(z)=D_{in}\sigma^2v=:q$.
Letting $h=\varphi(z)=\max(0,z)$ and $z\sim\N(0,q)$,
$$\E[h]=\int_0^\infty z\frac1{\sqrt{2\pi q}}e^{-z^2/2q}dz=\frac{\sqrt q}{\sqrt{2\pi}},$$
$$\E[h^2]=\int_0^\infty z^2\frac1{\sqrt{2\pi q}}e^{-z^2/2q}dz=\frac12q\quad(\text{D.I.Y.})$$
In signal propagation we track the second moment $v=\E[x_i^2]$. Before ReLU $\E[z^2]=D_{in}\sigma^2v$, and after ReLU $\E[h^2]=\frac12\E[z^2]=\frac12D_{in}\sigma^2v$. The preservation condition $\E[h^2]=\E[x^2]=v$ gives $\frac12D_{in}\sigma^2=1$, $\sigma^2=2/D_{in}$.
:::

**The D.I.Y. integrals.** With the substitution $u=z^2/2q$ ($du=z\,dz/q$),
$$\int_0^\infty z\,e^{-z^2/2q}dz=q\int_0^\infty e^{-u}du=q\ \Rightarrow\ \E[h]=\frac{q}{\sqrt{2\pi q}}=\sqrt{\frac q{2\pi}}.$$
$\E[h^2]$ follows directly from symmetry: $z^2e^{-z^2/2q}$ is an even function, so $\int_0^\infty=\frac12\int_{-\infty}^\infty$, i.e., $\E[h^2]=\frac12\E[z^2]=\frac q2$. (Also by integration by parts: $\int_0^\infty z\cdot ze^{-z^2/2q}dz=\big[-qze^{-z^2/2q}\big]_0^\infty+q\int_0^\infty e^{-z^2/2q}dz=q\cdot\frac{\sqrt{2\pi q}}2$.)

:::note Stating the assumptions exactly
The input of a ReLU layer, $x_i=h\ge0$, does not have mean 0, so instead of “$\Var(x_i)=v$” we must write, as in the notes, the **second moment** $v=\E[x_i^2]$. Even then, $\E[w_i]=0$ and independence suffice for $\E[z]=0$ and $\E[z^2]=D_{in}\sigma^2\E[x^2]$. Also, $\E[h^2]=\frac12\E[z^2]$ does not need a normal distribution; it only needs $z$ to be **symmetric** about 0 (automatic if the distribution of $w_i$ is symmetric). The normal assumption is used only to find the value of $\E[h]$.
:::

Slide result: with std $=\sqrt{2/D_{in}}$, every layer keeps mean $\approx0.55$ and standard deviation $\approx0.81$, “just right”. (He et al., ICCV 2015)

:::ex Example 2 — Checking with numbers
For $z\sim\N(0,4)$ ($q=4$), what are the mean, second moment, and variance of $h=\max(0,z)$?
---
$\E h=\sqrt{4/2\pi}=\frac2{\sqrt{2\pi}}\approx0.798$, $\E h^2=4/2=2$, $\Var h=2-0.798^2\approx1.363$. $\E h^2=2$ is exactly half of $\E z^2=4$.
:::

**What a nonzero mean means.** The ReLU output has mean $\sqrt{q/2\pi}>0$ (in the slide experiment, per-layer mean $\approx0.55$). So the right target is to preserve not the “variance” but the “second moment $=$ variance $+$ mean²”, and the $z$ of the next layer again has mean 0 because the weights have mean 0.
` },
      '11.4': { title: 'Breaking Symmetry and Research on Initialization', body: R`
:::idea In plain words
Give twins exactly the same education in exactly the same way, and they stay exactly the same person. If the neurons of a layer start out identical, they give the same output on the same input, get the same gradient and the same update, and **stay identical forever**. Even with 100 neurons it is effectively just 1, so we must make them randomly different at the start — “break the symmetry”.
:::

We must not set the weights **all to the same value** (e.g., 0). Neurons of the same layer that receive the same inputs give the same outputs, receive the same gradients in backpropagation, and remain the same after the update. The point of having many neurons disappears, so we must break the symmetry with **random** initialization.

:::key Symmetry breaking
If two neurons $j,k$ of a hidden layer start with the same incoming weights and the same outgoing weights, they remain the same after every step of (minibatch) gradient descent.
:::

**The core of the proof (induction).** Suppose that at some step the incoming weights $W_{j,:}=W_{k,:}$, the biases $b_j=b_k$, and the outgoing weights $W'_{:,j}=W'_{:,k}$. Then $a_j=a_k$ and $h_j=h_k$ on every input. In backpropagation $\frac{\partial L}{\partial h_j}=\sum_mW'_{mj}\delta'_m=\frac{\partial L}{\partial h_k}$ and $\delta_j=\sigma'(a_j)\frac{\partial L}{\partial h_j}=\delta_k$. The weight gradients are $\frac{\partial L}{\partial W_{j,:}}=\delta_jx^T=\frac{\partial L}{\partial W_{k,:}}$, and on the outgoing side $\frac{\partial L}{\partial W'_{mj}}=\delta'_mh_j=\frac{\partial L}{\partial W'_{mk}}$. They are updated by the same amount with the same gradients, so they are the same at the next step as well.

:::ex Example 3 — Initializing everything to 0
With ReLU hidden units and all weights and biases set to 0, what happens at the first update?
---
Every hidden output is $\max(0,0)=0$ and ReLU$'(0)=0$ (by convention), so the $\delta$ of the hidden layer is 0 and the gradients of the hidden-layer weights are 0. The gradients of the output-layer weights are also $\delta'h^T=0$ ($h=0$). Only the output-layer bias moves and the rest stay 0 forever — no learning. With the **same** nonzero value they do move, but all the hidden neurons move identically.
:::

Research on initialization (slide 26): Glorot & Bengio (2010), He et al. (2015), Saxe et al. (2013, exact dynamics of deep linear networks), Sussillo & Abbott (2014, random walk initialization). Batch normalization (Unit 12) makes training less sensitive to initialization.

### Going deeper: biases and the output layer

Biases have nothing to do with symmetry breaking (the weights are already random), so they are usually set to 0. A small positive value (e.g., 0.01) is sometimes used to reduce dead ReLUs. Setting the bias of a classification output layer to the log-odds of the class ratio (e.g., $\log(0.01/0.99)$ if 1% are positive) outputs sensible probabilities from the first step and prevents the initial loss from spiking. Saxe et al. showed that initializing with **orthogonal matrices** makes signals in every direction exactly preserve their size in deep linear networks (all singular values 1), making the training time almost independent of depth.
` },
    },
    probs: [
      // u11
      { q: R`What is the weight standard deviation of Xavier initialization for $D_{in}=4096$?`,
        sol: R`$1/\sqrt{4096}=1/64$.` },
      { q: R`What is the weight standard deviation of He initialization for $D_{in}=512$?`,
        sol: R`$\sqrt{2/512}=\sqrt{1/256}=1/16$.` },
      { q: R`For $D_{in}=100$, $\Var(w_i)=0.02$, $\Var(x_i)=1$ (all mean 0, independent), what is $\Var(\sum_iw_ix_i)$?`,
        sol: R`$D_{in}\sigma^2v=100\times0.02\times1=2$. The variance doubles at every layer and explodes (Xavier would be $0.01$).` },
      { q: R`What is the direct reason a tanh network initialized with $0.01\times$randn does not learn?`,
        choices: [R`tanh saturates`, R`The upper-layer activations are close to 0, so $\partial L/\partial W=\frac{\partial L}{\partial h}z^T\approx0$`, R`The loss diverges`, R`There are no biases`],
        sol: R`The weight gradient is multiplied by the input activation $z$. Saturation is the problem of too large an initialization.` },
      { q: R`What is the problem when a tanh network is initialized too big?`,
        choices: [R`The activations pile up at $\pm1$, $\tanh'\approx0$, and the gradients vanish`, R`The activations collapse to 0`, R`The gradient is always 1`, R`It becomes the same as Xavier`],
        sol: R`In $\partial L/\partial z=(\sigma'(\cdot)W^T)\partial L/\partial h$, $\sigma'\approx0$.` },
      { q: R`For $z\sim\N(0,4)$, what is $\E[\max(0,z)]$?`,
        sol: R`$\sqrt{q/2\pi}=\sqrt{4/2\pi}=\sqrt{2/\pi}$.` },
      { q: R`For $z\sim\N(0,4)$, what is $\Var(\max(0,z))$? (3 decimal places)`,
        sol: R`$\E[h^2]=q/2=2$, $(\E h)^2=q/2\pi=2/\pi$. The variance is $2-2/\pi\approx1.363$.` },
      { q: R`In the derivation of He initialization, which condition is essential for $\E[h^2]=\frac12\E[z^2]$ to hold?`,
        choices: [R`$z$ is normally distributed`, R`The distribution of $z$ is symmetric about 0`, R`The $x_i$ have mean 0`, R`$D_{in}$ is even`],
        sol: R`If $\E[z^2\mathbb 1\{z>0\}]=\E[z^2\mathbb 1\{z<0\}]$, each is $\frac12\E[z^2]$. The normal distribution is used to find $\E[h]$.` },
      { q: R`If Xavier ($\sigma^2=1/D_{in}$) is used in a ReLU network, by what factor does the second moment of the activations change through one layer?`,
        sol: R`$\E[h^2]=\frac12D_{in}\sigma^2v=\frac12v$. Over 10 layers it collapses by a factor $2^{-10}$.` },
      { q: R`In Glorot's compromise $\sigma^2=2/(D_{in}+D_{out})$, what is $\sigma^2$ for $D_{in}=300$, $D_{out}=100$?`,
        sol: R`$2/400=0.005$. It is the harmonic mean of the forward condition $1/300$ and the backward condition $1/100$.` },
      { q: R`Which is correct about the neurons of a hidden layer initialized with all weights 0?`,
        choices: [R`They naturally become different as training proceeds`, R`They all receive the same gradient and compute the same function forever`, R`It is the same as He initialization`, R`The gradients explode`],
        sol: R`The symmetry is not broken. This is why random initialization is needed.` },
      { q: R`For $y=\sum_{i=1}^{D_{in}}w_ix_i$ with all $w_i,x_i$ independent, $\E w_i=\E x_i=0$, $\Var w_i=\sigma^2$, $\Var x_i=v$, show that $\Var(y)=D_{in}\sigma^2v$, and derive Xavier initialization.`,
        sol: R`
$\E y=\sum\E w_i\E x_i=0$, so $\Var y=\E y^2$.
$\E y^2=\sum_i\E[w_i^2x_i^2]+\sum_{i\ne k}\E[w_iw_kx_ix_k]$. By independence, $\E[w_i^2x_i^2]=\E w_i^2\E x_i^2=\sigma^2v$, and the cross terms are $\E w_i\E w_k\E[x_ix_k]=0$.
Hence $\Var y=D_{in}\sigma^2v$. For the variance to be preserved through the layer, $D_{in}\sigma^2v=v$, i.e., $\sigma^2=1/D_{in}$.`,
        rubric: R`
- Mean 0 — 2 pts
- Expanding the square and independence — 5 pts
- The preservation condition and conclusion — 3 pts` },
      { q: R`For $z\sim\N(0,q)$ and $h=\max(0,z)$, compute $\E[h]=\sqrt{q/2\pi}$ and $\E[h^2]=q/2$ by integration (the D.I.Y. from class), and use them to derive He initialization $\sigma^2=2/D_{in}$.`,
        sol: R`
**$\E h$.** $\E h=\int_0^\infty\frac{z}{\sqrt{2\pi q}}e^{-z^2/2q}dz$. Substituting $u=z^2/2q$ gives $z\,dz=q\,du$: $=\frac{q}{\sqrt{2\pi q}}\int_0^\infty e^{-u}du=\sqrt{\frac q{2\pi}}$.
**$\E h^2$.** The integrand $z^2e^{-z^2/2q}$ is even, so $\int_0^\infty=\frac12\int_{-\infty}^\infty$ and $\E h^2=\frac12\E z^2=\frac q2$.
**Derivation.** With $z=\sum w_ix_i$, $\E w_i=0$, and independence, $\E z^2=D_{in}\sigma^2\E x^2$. After ReLU, $\E h^2=\frac12D_{in}\sigma^2\E x^2$. Preserving the second moment, $\E h^2=\E x^2$, gives $\sigma^2=2/D_{in}$.`,
        rubric: R`
- $\E h$ by substitution — 3 pts
- $\E h^2$ (symmetry or integration by parts) — 3 pts
- Propagation of the second moment and the He condition — 4 pts` },
      // more-11
      { q: R`For Leaky ReLU $h=\max(\alpha z,z)$ ($0\le\alpha<1$), with $z$ symmetric about 0 and $\E[z^2]=q$, show that $\E[h^2]=\frac{1+\alpha^2}2q$, and find the weight variance $\sigma^2$ that preserves the second moment. (For $\alpha=0$ it should agree with He.)`,
        sol: R`
If $z\ge0$ then $h=z$; if $z<0$ then $h=\alpha z$. $\E[h^2]=\E[z^2\mathbb 1_{z\ge0}]+\alpha^2\E[z^2\mathbb 1_{z<0}]$.
By symmetry $\E[z^2\mathbb 1_{z\ge0}]=\E[z^2\mathbb 1_{z<0}]=\frac q2$ (the contribution of $P(z=0)$ is 0). Hence $\E[h^2]=\frac{1+\alpha^2}2q$.
Since $q=D_{in}\sigma^2v$ (Section 11.2), the preservation condition $\frac{1+\alpha^2}2D_{in}\sigma^2v=v$ gives $\sigma^2=\frac2{(1+\alpha^2)D_{in}}$. For $\alpha=0$ it is $2/D_{in}$ (He), and for $\alpha=1$ (linear) it is $1/D_{in}$ (Xavier).`,
        rubric: R`
- Splitting into cases — 3 pts
- Half each by symmetry — 3 pts
- The preservation condition and $\sigma^2$ — 3 pts
- Checking the two limits — 1 pt` },
      { q: R`In backpropagation $g_i=\frac{\partial L}{\partial x_i}=\sum_{j=1}^{D_{out}}W_{ji}\delta_j$, where the $W_{ji}$ are i.i.d. with mean 0 and variance $\sigma^2$, independent of the $\delta_j$, and the $\delta_j$ have mean 0 and variance $u$, show that $\Var(g_i)=D_{out}\sigma^2u$, and explain Glorot initialization as a compromise between the forward and backward conditions.`,
        sol: R`
The same computation as in Section 11.2: $\E g_i=\sum_j\E W_{ji}\E\delta_j=0$. $\E g_i^2=\sum_j\E W_{ji}^2\E\delta_j^2+\sum_{j\ne k}\E[W_{ji}]\E[W_{ki}\delta_j\delta_k]=D_{out}\sigma^2u$ (the cross terms vanish by $\E W_{ji}=0$).
Preserving the variance backward ($\Var g_i=u$) requires $\sigma^2=1/D_{out}$, and forward requires $1/D_{in}$. If the widths differ, both cannot hold, so we compromise with $\sigma^2=\frac2{D_{in}+D_{out}}$ (the harmonic mean of the two values).`,
        rubric: R`
- Mean 0 — 2 pts
- Expanding the second moment and eliminating the cross terms — 5 pts
- The two conditions and the compromise — 3 pts` },
      { q: R`In Glorot uniform initialization $U(-a,a)$, matching the variance $a^2/3$ to $\frac2{D_{in}+D_{out}}$ with $D_{in}=300$, $D_{out}=100$, what is $a$? (4 decimal places)`,
        sol: R`$a^2/3=2/400\Rightarrow a^2=6/400=0.015$, $a\approx0.1225$.` },
      { q: R`What is the standard deviation of He initialization for $D_{in}=1024$? (4 decimal places)`,
        sol: R`$\sqrt{2/1024}=\sqrt{1/512}\approx0.0442$.` },
      { q: R`For $D_{in}=256$, $\Var(w_i)=1/128$, $\Var(x_i)=0.5$ (mean 0, independent), what is $\Var(\sum_iw_ix_i)$?`,
        sol: R`$256\times\frac1{128}\times0.5=1$. The variance doubles, $0.5\to1$ (a variance twice that of Xavier).` },
      { q: R`For $z\sim\N(0,9)$, what is $\E[\max(0,z)]$? (4 decimal places)`,
        sol: R`$\sqrt{q/2\pi}=\sqrt{9/2\pi}=3/\sqrt{2\pi}\approx1.1968$.` },
      { q: R`If Xavier ($\sigma^2=1/D_{in}$) is used in a ReLU network, the second moment of the activations after 10 layers is how many times the initial one?`,
        sol: R`At every layer $\E[h^2]=\frac12D_{in}\sigma^2\E[x^2]=\frac12\E[x^2]$. Over 10 layers it is $2^{-10}\approx0.001$ times — the signal vanishes.` },
      { q: R`Show that if $z$ is a continuous random variable symmetric about 0 (density $p(-t)=p(t)$), then $\E[\max(0,z)^2]=\frac12\E[z^2]$ even if it is not normal.`,
        sol: R`
$\E[\max(0,z)^2]=\int_0^\infty t^2p(t)\,dt$. $t\mapsto t^2p(t)$ is an even function, so $\int_0^\infty t^2p(t)dt=\frac12\int_{-\infty}^\infty t^2p(t)dt=\frac12\E[z^2]$.
(If the weight distribution is symmetric, $z=\sum w_ix_i$ is also symmetric — replacing $w\to-w$ leaves the distribution unchanged — so the He derivation needs no normality assumption.)`,
        rubric: R`
- The integral expression — 3 pts
- Even function and half — 5 pts
- The connection with the symmetry of the weights — 2 pts` },
      { q: R`Which pairing of activation function and initialization is most appropriate?`,
        choices: [R`tanh — He, ReLU — Xavier`, R`tanh — Xavier, ReLU — He`, R`Both $0.01\times$randn`, R`Both initialized to 0`],
        sol: R`Xavier assumes a zero-centered, nearly linear activation (tanh); He assumes ReLU, which cuts off half and halves the second moment.` },
      // quizprep-b
      { q: R`In a layer $z_j=\sum_{i=1}^{D}W_{ji}h_i$, the $W_{ji}$ are i.i.d. with mean 0, variance $s^2$, and a distribution symmetric about 0, independent of $h$. The $h_i$ are i.i.d. with $\E[h_i^2]=q$ (the mean need not be 0).
1. Prove that $\E z_j=0$ and $\E[z_j^2]=Ds^2q$. State all the assumptions used to make the cross terms vanish.
2. Show that if $z$ is a continuous random variable symmetric about 0, then $\E[\ReLU(z)^2]=\frac12\E[z^2]$. Also write why the $z_j$ of 1 is symmetric.
3. Show that for $q_\ell=\E[(z^{(\ell)})^2]$ to be preserved from layer to layer when stacking ReLU layers, we need $s^2=\frac2D$ (He initialization). With $s^2=\frac1D$ (Xavier), $q$ after 10 layers is how many times the initial one?`,
        sol: R`
**1.** $\E z_j=\sum_i\E W_{ji}\E h_i=0$ ($W$ and $h$ independent, $\E W=0$). Expanding the square,
$$\E z_j^2=\sum_i\sum_k\E[W_{ji}W_{jk}]\,\E[h_ih_k].$$
If $i\ne k$, $W_{ji},W_{jk}$ are independent with mean 0, so $\E[W_{ji}W_{jk}]=0$ — the cross terms vanish even if the mean of $h_ih_k$ is not 0. If $i=k$, the term is $s^2q$. Hence $Ds^2q$. Assumptions used: independence of $W$ and $h$, independence among the entries of $W$, and $\E W=0$.
**2.** If the density satisfies $p(-t)=p(t)$, then $\E[z^2\mathbb 1\{z\gt0\}]=\E[z^2\mathbb 1\{z\lt0\}]$, and since $P(z=0)=0$ the two add up to $\E z^2$. $\ReLU(z)^2=z^2\mathbb 1\{z\gt0\}$, so it is $\frac12\E z^2$. The $z_j$ of 1 is symmetric because replacing $W$ by $-W$ leaves the distribution unchanged (the distribution of $W$ is symmetric and independent of $h$), and then $z_j\to-z_j$.
**3.** If $h^{(\ell-1)}=\ReLU(z^{(\ell-1)})$, then by 2 $\E[(h^{(\ell-1)})^2]=\frac12q_{\ell-1}$, and by 1 $q_\ell=Ds^2\cdot\frac12q_{\ell-1}$. For $q_\ell=q_{\ell-1}$ we need $s^2=\frac2D$. With Xavier $s^2=\frac1D$, $q_\ell=\frac12q_{\ell-1}$, and after 10 layers it is $2^{-10}\approx0.00098$ times — the signal vanishes.`,
        rubric: R`
- The mean and the second moment (the cross-term argument and the assumptions) — 4 pts
- Symmetry and half for ReLU — 3 pts
- The He condition and the comparison with Xavier — 3 pts` },
    ],
  };
})();
