/* English text — 12 Learning-Rate Schedules & Batch Normalization (W4 Mon (2) slides 27–44, W4 Wed (1) notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    lrsched: R`(a) Step drops the rate to one tenth at fixed epochs (30, 60, 90); cosine decreases slowly at the start and end and quickly in the middle, reaching 0 at $T$; linear decreases at a constant speed. (b) Inverse square root drops quickly at first and then slowly. Warmup raises the rate linearly from 0 to $\alpha_0$ over the first few epochs and then decays it, preventing the loss from exploding under a large early learning rate.`,
    bnln: R`The shaded cells are the values used to compute one mean and variance. BN computes the statistics per feature (D of them), LN per sample (N of them).`,
  });
  EM.en.ch[12] = {
    title: 'Learning-Rate Schedules & Batch Normalization',
    fig: R`Learning-rate schedules after a linear warmup: step, linear, inverse square root, cosine (bold)`,
    tagline: R`The learning rate should be large at first and small later. Batch normalization sets each layer to mean 0 and variance 1, but gives back the freedom with $\gamma,\beta$.`,
    summary: R`The learning rate is the most important hyperparameter of every optimizer. Too large and the loss explodes; too small and training is slow; merely large and it drops fast but stalls at a high value. So we use it large at first and small later — **learning rate decay schedules** (step, cosine, linear, inverse square root) and an early **warmup**. The second half, **batch normalization** (BN), is a layer that sets each layer's activations to mean 0 and variance 1 with minibatch statistics and then gives the freedom to undo it with learnable $\gamma,\beta$. At inference it uses running averages, becomes an affine map, and can be fused into the preceding layer. BN makes training deep networks much easier, but the reason (reduced internal covariate shift versus a smoother loss landscape) is still debated.`,
    goals: [
      R`Distinguish the four learning curves by learning rate and explain why learning rate decay is needed`,
      R`Write the formulas of the step, cosine, linear, and inverse-square-root schedules and the linear warmup, and compute their values`,
      R`Compute batch normalization at training time by hand (per-feature mean and variance, normalization, $\gamma,\beta$)`,
      R`Explain why running averages are used at inference, and derive how BN becomes an affine map fused into the preceding layer`,
      R`Explain the scale invariance and effects of BN, and summarize covariate shift, internal covariate shift, and the theoretical debate`,
    ],
    secTitles: { '12.1': 'Learning rate', '12.2': 'Schedules', '12.3': 'BN at training', '12.4': 'BN at test', '12.5': 'Effects of BN · ICS' },
    secs: {
      '12.1': { title: 'The Learning Rate and Learning Curves', body: R`
:::idea In plain words
You roll a ball to the bottom of a bowl, and the distance it moves in one go is the learning rate. Too large and it flies over the opposite wall (explosion); too small and it takes all day. Moderately large gets near the bottom fast but bounces between the walls and never reaches the bottom. So the answer is **large at first, small later**.
:::

SGD, SGD+Momentum, Adagrad, RMSProp, and Adam all have the **learning rate** as a hyperparameter[[ch14:14.3|Adagrad, RMSProp, and Adam are covered in Week 5.]]. The four loss-versus-epoch curves on the slide:
- (a) Very high learning rate: the loss explodes
- (b) Low learning rate: decreases slowly and steadily
- (c) High learning rate: drops fast, then plateaus at a high value
- (d) Good learning rate

Sorted by learning rate in ascending order: **b < d < c < a**. Going down fast with a high learning rate at first and precisely with a low learning rate later takes the advantages of both → learning rate decay. Notes: on a bowl-shaped loss, a large learning rate oscillates between the walls, and reducing the learning rate lets it settle to the bottom.

**Why (c) stalls high.** Two reasons overlap. (1) A deterministic reason: in a direction with curvature $\beta$, if $\eta$ is close to $2/\beta$, every step jumps across the wall and barely decreases[[ch13:13.4|For $f=\frac\beta2x^2$, $x_{t+1}=(1-\eta\beta)x_t$.]]. (2) A stochastic reason: because of SGD's noise, the loss cannot go below a “noise floor” of about $\frac L2\eta G$[[ch13:13.6|SGD with a fixed learning rate stays at a noise floor.]]. In both cases, reducing $\eta$ solves it.

:::ex Example 1 — Comparing learning rates in a bowl
For $f(x)=\frac12x^2$ ($\beta=1$), $x_0=1$, what happens after 5 steps of GD $x\leftarrow x-\eta x$ with $\eta=0.1,\ 1,\ 1.9,\ 2.1$?
---
$x_t=(1-\eta)^t$. $\eta=0.1$: $0.9^5\approx0.59$ (slow). $\eta=1$: 0 in one step (optimal for this problem). $\eta=1.9$: $(-0.9)^5\approx-0.59$ (bouncing left and right, slowly). $\eta=2.1$: $(-1.1)^5\approx-1.61$ (explosion). In real problems where the curvature is unknown, it is safe to find a moderate value in between and reduce it over time.
:::
` },
      '12.2': { title: 'Learning Rate Decay Schedules', body: R`
:::idea In plain words
A schedule is “in what shape to reduce the learning rate over time”. Cut it in steps (step), smoothly like a half circle (cosine), at a constant rate (linear), or fast at first and slowly later (inverse square root). At the very beginning, a warmup that **raises it gradually from 0** is sometimes attached.
:::

:::key Learning rate schedules
With initial learning rate $\alpha_0$ and total number of epochs (or iterations) $T$,
- **Step**: reduce the learning rate at a few fixed points by multiplication. E.g., for ResNets, multiply LR by 0.1 after epochs 30, 60, and 90
- **Cosine**: $\alpha_t=\dfrac12\alpha_0\Big(1+\cos\dfrac{t\pi}{T}\Big)$
- **Linear**: $\alpha_t=\alpha_0\Big(1-\dfrac tT\Big)$
- **Inverse sqrt**: $\alpha_t=\alpha_0/\sqrt t$
- **Linear warmup**: increase linearly from 0 over the first ~5000 iterations (high initial learning rates can make the loss explode; the warmup prevents this)
:::

The cosine schedule is $\alpha_0$ at $t=0$, $\alpha_0/2$ at $t=T/2$, and 0 at $t=T$, changing slowly near the start and end (Loshchilov & Hutter, SGDR, 2017). Warmup is especially important when training with large batches (Goyal et al., 2017). The loss curve of the step schedule on the slide drops **like a staircase** every time the learning rate is reduced (because the “noise floor” that plateaued under the high learning rate is lowered).

:::fig lrsched
:::

:::ex Example 2 — Computing values
With $\alpha_0=0.1$ and $T=100$, what are the cosine value at $t=25$, the step schedule's value at $t=75$, and the linear schedule's value at $t=40$?
---
Cosine: $\frac12(0.1)(1+\cos\frac\pi4)=0.05(1+0.7071)\approx0.0854$. Step: $t=30$ and $60$ have passed, so $0.1\times0.1\times0.1=10^{-3}$. Linear: $0.1(1-0.4)=0.06$.
:::

### Going deeper: what theory says about schedules

SGD theory (Unit 13) says that a schedule satisfying both $\sum_t\eta_t=\infty$ (can go far enough) and $\sum_t\eta_t^2<\infty$ (the noise eventually settles), e.g., $\eta_t\propto1/t$, guarantees convergence for convex problems. For a fixed number of steps $T$, setting $\eta\propto1/\sqrt T$ gives $\min_t\E\lVert\nabla f\rVert^2=O(1/\sqrt T)$[[ch13:13.6|$\eta=O(1/\sqrt T)$ in the stochastic descent lemma.]]. Schedules that end at 0, like cosine and linear, remove almost all the noise in the final stretch and lower the final loss. Warmup gets past the stretch right after initialization where the curvature is large and the second-moment estimates of adaptive methods (Adam) are unstable.
` },
      '12.3': { title: 'Batch Normalization: Training Time', body: R`
:::idea In plain words
When comparing exam scores, converting them to standard scores — “subtract the mean and divide by the standard deviation” — makes a fair comparison even when the subjects differ in difficulty. Batch normalization converts **the output of each neuron of each layer into a standard score**. But since standard scores may not always be best, it also attaches knobs $\gamma,\beta$ that can “stretch and shift it back if desired”.
:::

“You want zero-mean unit-variance activations? **Just make them so.**” Consider a batch of activations at some layer. To make each dimension zero-mean unit-variance, apply
$$\hat x^{(k)}=\frac{x^{(k)}-\E[x^{(k)}]}{\sqrt{\Var[x^{(k)}]}}$$
This operation is differentiable, so backpropagation goes through it.

:::key Batch normalization (training)
Input $x\in\mathbb R^{N\times D}$ ($N$: batch size, $D$: feature dimension; $D=784$ for MNIST). Learnable $\gamma,\beta\in\mathbb R^D$.
$$\mu_j=\frac1N\sum_{i=1}^Nx_{ij},\qquad \sigma_j^2=\frac1N\sum_{i=1}^N(x_{ij}-\mu_j)^2\qquad(\text{size }D)$$
$$\hat x_{ij}=\frac{x_{ij}-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}},\qquad y_{ij}=\gamma_j\hat x_{ij}+\beta_j\qquad(\text{size }N\times D)$$
Learning $\gamma_j=\sqrt{\sigma_j^2+\varepsilon}$, $\beta_j=\mu_j$ recovers the identity function.
:::

- $\varepsilon$ (e.g., $10^{-5}$) prevents division by zero when the variance is 0 (notes).
- Normalization alone forces every layer to mean 0 and variance 1, which can reduce expressive power. $\gamma,\beta$ give the freedom to go back to the original distribution if needed. So **BN does not change the representation power of the network**.
- Notes: with a batch of $N=100$ and $D=784$ features, 784 means and 784 variances are computed.

**What “per feature” means.** The rows of $x$ are samples and the columns are features. The mean and variance are computed **along the columns** (over the samples of the batch, for the same feature). Computing them per sample (along the rows) is layer normalization (LN) (figure below).

:::ex Example 3 — A batch of 4, 2 features
For $x=\begin{pmatrix}1&2\\3&2\\5&4\\7&8\end{pmatrix}$, $\gamma=(2,1)$, $\beta=(1,0)$, $\varepsilon=0$, what is the BN output?
---
Feature 1: $\mu_1=4$, $\sigma_1^2=\frac{9+1+1+9}4=5$, $\hat x_{\cdot1}=\frac{(-3,-1,1,3)}{\sqrt5}\approx(-1.342,-0.447,0.447,1.342)$, $y_{\cdot1}=2\hat x+1\approx(-1.683,\ 0.106,\ 1.894,\ 3.683)$.
Feature 2: $\mu_2=4$, $\sigma_2^2=\frac{4+4+0+16}4=6$, $\hat x_{\cdot2}=\frac{(-2,-2,0,4)}{\sqrt6}\approx(-0.816,-0.816,0,1.633)$, $y_{\cdot2}=\hat x_{\cdot2}$.
Check: each column of $\hat x$ has mean 0 and variance 1. $y_{\cdot1}$ has mean $\beta_1=1$ and standard deviation $\gamma_1=2$.
:::

### Going deeper: backpropagation through BN

For a single feature, $\hat x_i=(x_i-\mu)/s$ with $s=\sqrt{\sigma^2+\varepsilon}$. $\mu$ and $s$ are also functions of $x$, so the gradient flows along three paths (directly, through the mean, and through the variance), and simplifying gives
$$\frac{\partial L}{\partial x_i}=\frac1s\Big(g_i-\frac1N\sum_kg_k-\hat x_i\cdot\frac1N\sum_kg_k\hat x_k\Big),\qquad g_i=\frac{\partial L}{\partial\hat x_i}=\gamma\frac{\partial L}{\partial y_i}.$$
It has the form of subtracting from the gradient its mean and its component along $\hat x$, so the gradient of the layer before BN does not flow “in the direction of increasing the size” — the same story as the scale invariance of Section 12.5. Also, since the other samples of the batch enter the formula, BN is a layer that mixes samples with one another, and that noise has a regularizing effect.
` },
      '12.4': { title: 'Batch Normalization: Test Time and Fusing', body: R`
:::idea In plain words
In the exam room (inference), students may come one at a time, so “this batch's mean” cannot be computed. So we use **values recorded steadily** over the training period (running averages) of the means and variances seen. Then BN becomes a single “multiply and add”, which can be merged into the layer right before it in advance.
:::

At inference the batch may be small or $N=1$, so batch statistics cannot be used. They are replaced by **running averages** accumulated during training.

:::key Batch normalization (inference)
During training (momentum $m$):
$$\mu^{\text{run}}\leftarrow m\,\mu^{\text{run}}+(1-m)\,\mu_{\text{batch}},\qquad (\sigma^2)^{\text{run}}\leftarrow m\,(\sigma^2)^{\text{run}}+(1-m)\,\sigma^2_{\text{batch}}$$
At test time: $\hat x_{ij}=\dfrac{x_{ij}-\mu_j^{\text{run}}}{\sqrt{(\sigma_j^2)^{\text{run}}+\varepsilon}}$, $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$.
All the values are constants, so BN becomes a per-channel affine map $y_{ij}=a_jx_{ij}+b_j$:
$$a_j=\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}},\qquad b_j=\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}.$$
:::

**Deriving the affine coefficients.** $y=\gamma\frac{x-\mu}s+\beta=\frac\gamma sx+\big(\beta-\frac{\gamma\mu}s\big)$ ($s=\sqrt{\sigma^2+\varepsilon}$).

**Properties of the running average.** If the batch mean is always the same value $c$ and the initial value is 0, then $\mu^{\text{run}}_t=c(1-m^t)$; with $m=0.9$ it is $0.271c$ after 3 steps, $0.88c$ after 20, and $0.995c$ after 50. The influence of old batches is forgotten exponentially as $m^k$ (an exponential moving average). It is the same tool as the $m$ of momentum and Adam in Unit 14[[ch14:14.4|Adam's first and second moments are also exponential moving averages, with bias correction at the start.]].

**Fusing with the preceding layer.** If BN follows a fully connected layer $x=Wu+c$,
$$y=\diag(a)(Wu+c)+b_{\text{BN}}=\underbrace{\diag(a)W}_{W'}u+\underbrace{\diag(a)c+b_{\text{BN}}}_{c'},$$
where $b_{\text{BN}}=(b_1,\dots,b_D)$ is the BN intercept above. The slide wrote this as “$W'=\diag(a)W$, $b'=\diag(a)b+b$”, where the first $b$ is the bias of the FC layer and the second $b$ is the BN intercept $b_j$. After fusing, **the inference cost is zero**.

:::ex Example 4 — Inference-mode BN and fusing
For one feature, $\gamma=2$, $\beta=1$, $\mu^{\text{run}}=3$, $(\sigma^2)^{\text{run}}=4$, $\varepsilon=0$. If the preceding layer is $x=Wu+c$ and that feature's row is $w^T=(1,-1)$ with $c=0.5$, what is the fused layer?
---
$a=\gamma/\sqrt4=1$, $b=\beta-\gamma\mu/2=1-3=-2$. The fused row is $w'^T=a\,w^T=(1,-1)$ and the fused bias $c'=a\,c+b=0.5-2=-1.5$. Check: for $u=(4,1)$ the FC output is $x=3.5$ and the BN output $2\cdot\frac{3.5-3}2+1=1.5$; the fused layer gives $4-1-1.5=1.5$ ✓.
:::

**Placement.** BN is usually inserted **after** a fully connected or convolutional layer and **before** the nonlinearity: FC → BN → tanh → FC → BN → tanh → …. (The bias $c$ of the preceding layer is erased when BN subtracts the mean, so the layer before BN often has no bias.)

:::fig bnln
:::

:::warn Training mode and inference mode
If the training mode (batch statistics) is mistakenly used at inference, the output for the same input depends on the other samples that came with it, and with batch size 1 the variance is 0, so every output becomes $\beta$. The library's model.eval() is this switch.
:::
` },
      '12.5': { title: 'Effects of BN and Internal Covariate Shift', body: R`
:::idea In plain words
BN is a tool “whose effect is certain but whose reason is still debated”. Its inventors explained that “it prevents the input distribution seen by later layers from shaking every time earlier layers change (internal covariate shift)”, but later experiments showed that training improves even though BN does not actually reduce that shaking. The leading explanation now is that “it makes the loss landscape smoother, so we can go down safely even with a large learning rate”.
:::

**Effects** (slides 41–42)
- Makes deep networks **much** easier to train; improves gradient flow
- Allows higher learning rates and faster convergence: scale invariance and stable gradients reduce the risk of divergence, and early convergence is faster even at the same learning rate
- Less sensitive to initialization: even if Xavier/He is a bit off, BN re-centers and rescales
- Acts as regularization during training (the noise of minibatch statistics)
- Zero overhead at test time (fusing)

:::key Scale invariance of batch normalization
Scaling the weights before BN by $\alpha>0$ leaves the output the same: $\mathrm{BN}\big((\alpha W)u\big)=\mathrm{BN}(Wu)$ (as $\varepsilon\to0$). Also $\nabla_{\alpha W}L=\frac1\alpha\nabla_WL$, so as the weights grow, the effective learning rate shrinks automatically.
:::

**Proof.** Replacing $x=Wu$ by $\alpha x$ makes the batch mean $\alpha\mu$ and the standard deviation $\alpha\sigma$ ($\alpha>0$), so $\frac{\alpha x-\alpha\mu}{\alpha\sigma}=\frac{x-\mu}\sigma$ — the same $\hat x$. Gradient: differentiating $L(W)=\tilde L(\alpha W)$ (the same output, so the same loss) in $W$ gives, by the chain rule, $\nabla_WL=\alpha\,\nabla\tilde L\big|_{\alpha W}$, i.e., the gradient at $\alpha W$ is $\frac1\alpha\nabla_WL$. If the weights are $\alpha$ times larger, the gradient is $\frac1\alpha$ times, and the relative change $\frac{\lVert\Delta W\rVert}{\lVert W\rVert}$ is $\frac1{\alpha^2}$ times, so a brake applies by itself.

**Summary (slide 43).** BN (sort of) enforces the normalization layer by layer and is an indispensable tool for training very deep neural networks, but its **theoretical justification is weak**. With BN, the batch size becomes a more important hyperparameter to tune, and training ResNet requires BN.

:::hand Class notes — covariate shift and internal covariate shift
① **Covariate shift**: in supervised learning, $P(X,Y)=P(Y\mid X)P(X)$. It is the situation where $P_{\text{train}}(X)\ne P_{\text{test}}(X)$ but $P_{\text{train}}(Y\mid X)=P_{\text{test}}(Y\mid X)$. The input distribution changes, but the relation stays the same.

② **Internal covariate shift** (ICS): the $\ell$-th layer is $z^{(\ell)}=W^{(\ell)}h^{(\ell-1)}+b^{(\ell)}$, $h^{(\ell)}=f(z^{(\ell)})$. The parameters keep changing during training, so **even for the same training data**, the distribution of the input $h^{(\ell-1)}$ can differ at each optimization step: $P_t(h^{(\ell-1)})\ne P_{t+1}(h^{(\ell-1)})$. Does BN solve ICS (?)
:::

**An example of covariate shift.** Using a pedestrian detector trained on daytime photos on night photos changes the input distribution $P(X)$, but the relation $P(Y\mid X)$ “a human shape means a pedestrian” stays the same. In medicine, different imaging equipment at different hospitals is a common cause.

**Theoretical justification (slide 44)**
- Original hypothesis (Ioffe & Szegedy, 2015): BN ⇒ reduced ICS ⇒ improved training
- Experiments (Santurkar et al., 2018): training improves consistently **even though BN does not reduce** the measured ICS (BN ⇏ reduced ICS, but BN ⇒ improved training)
- Alternative explanation: BN ⇒ **a smoother loss landscape** ⇒ easier optimization ⇒ improved training. This connects to the $\beta$-smoothness of Unit 13[[ch13:13.2|The smaller $\beta$, the larger the learning rate $\eta<2/\beta$ that can be used.]].

### Going deeper: normalization that does not rely on the batch

With small batches (e.g., high-resolution images, batch 2), BN's statistics are inaccurate and performance drops, and it is hard to use in models whose statistics differ at each time step, like recurrent networks. **Layer normalization** (LN) computes the mean and variance over all the features within a single sample, so it is independent of the batch size and computes the same thing at training and inference — the standard in transformers. Group normalization is an intermediate form that splits the channels into a few groups and normalizes each group[[@med:ch09:7.4c|Layer normalization.]].
` },
    },
    probs: [
      // u12
      { q: R`The loss dropped quickly and then flattened out at a high value. What is the most appropriate judgment about the learning rate?`,
        choices: [R`The learning rate is too low`, R`The learning rate is high — a decay schedule is needed`, R`The learning rate is just right`, R`The loss diverges`],
        sol: R`This is curve (c) on the slide. It is good at first but oscillates near the bottom, so the learning rate must be reduced.` },
      { q: R`In the cosine schedule $\alpha_t=\frac12\alpha_0(1+\cos\frac{t\pi}T)$ with $\alpha_0=0.1$, $T=100$, $t=25$, what is $\alpha_t$? (4 decimal places)`,
        sol: R`$\cos(\pi/4)=\frac{\sqrt2}2\approx0.7071$, $0.05\times1.7071\approx0.0854$.` },
      { q: R`With the step schedule ($\times0.1$ at epochs 30, 60, 90) and $\alpha_0=0.1$, what is the learning rate at epoch 75?`,
        sol: R`$0.01$ at 30, $0.001$ at 60, and it is before 90, so $0.001$.` },
      { q: R`In the linear schedule $\alpha_t=\alpha_0(1-t/T)$ with $\alpha_0=0.2$ and $T=50$, what is the learning rate at $t=40$?`,
        sol: R`$0.2(1-0.8)=0.04$.` },
      { q: R`The minibatch values of one feature are $(1,3,5,7)$, with $\varepsilon=0$, $\gamma=2$, $\beta=1$. What is the BN output of the value $7$? (4 decimal places)`,
        sol: R`$\mu=4$, $\sigma^2=\frac{9+1+1+9}4=5$. $\hat x=3/\sqrt5$, $y=2\cdot3/\sqrt5+1\approx3.6833$. (The variance divides by $N$.)` },
      { q: R`In BN of the input $x\in\mathbb R^{N\times D}$, what are the sizes of $\mu$, $\gamma$, and $y$?`,
        choices: [R`$N$, $N$, $N\times D$`, R`$D$, $D$, $N\times D$`, R`$D$, $N$, $D$`, R`$N\times D$, $D$, $D$`],
        sol: R`There is one mean, variance, $\gamma$, and $\beta$ per feature (size $D$), and the output has the same size $N\times D$ as the input.` },
      { q: R`Why does BN have learnable $\gamma,\beta$?`,
        choices: [R`To make the normalization stronger`, R`So that the original mean and variance can be recovered if needed (preserving expressive power)`, R`To keep the variance from becoming 0`, R`To make inference faster`],
        sol: R`With $\gamma=\sqrt{\sigma^2+\varepsilon}$, $\beta=\mu$ it is the identity. $\varepsilon$ protects the division.` },
      { q: R`For BN at inference with $\gamma=2$, $\beta=1$, $\mu^{\text{run}}=3$, $(\sigma^2)^{\text{run}}=4$, $\varepsilon=0$, what is the affine coefficient $b=\beta-\gamma\mu/\sqrt{\sigma^2}$?`,
        sol: R`$a=2/2=1$, $b=1-2\cdot3/2=-2$. That is, $y=x-2$.` },
      { q: R`With the running average $\mu^{\text{run}}\leftarrow0.9\mu^{\text{run}}+0.1\mu_{\text{batch}}$, initial value 0, and a batch mean of 10 every time, what is $\mu^{\text{run}}$ after 3 updates?`,
        sol: R`$1,\ 1.9,\ 2.71$. In general it approaches 10 as $10(1-0.9^t)$.` },
      { q: R`If an FC layer $x=Wu+c$ is followed by inference-mode BN ($y=\diag(a)x+b_{\text{BN}}$), what is the fused bias $c'$?`,
        choices: [R`$c+b_{\text{BN}}$`, R`$\diag(a)c+b_{\text{BN}}$`, R`$\diag(a)(c+b_{\text{BN}})$`, R`$b_{\text{BN}}$`],
        sol: R`$\diag(a)(Wu+c)+b_{\text{BN}}=\diag(a)Wu+\diag(a)c+b_{\text{BN}}$.` },
      { q: R`Which is a correct description of the experimental result of Santurkar et al. (2018)?`,
        choices: [R`BN reduces ICS, and that is why training improves`, R`BN does not reduce the measured ICS, yet training improves, and the explanation offered is that it smooths the loss landscape`, R`BN hinders training`, R`BN only improves test performance`],
        sol: R`The original hypothesis (reduced ICS) was not supported by experiments, and the alternative explanation is the smoothing of the loss landscape.` },
      { q: R`Which is the correct definition of covariate shift?`,
        choices: [R`$P(Y\mid X)$ changes while $P(X)$ stays the same`, R`$P_{\text{train}}(X)\ne P_{\text{test}}(X)$, but $P(Y\mid X)$ stays the same`, R`The labels change`, R`The model parameters change`],
        sol: R`Only the input distribution changes, and the input–output relation stays the same (notes).` },
      { q: R`If the weights right before BN are changed as $W\to3W$ ($\varepsilon=0$), $\nabla_{3W}L$ is how many times $\nabla_WL$?`,
        sol: R`The output is the same, so $L(3W)=L(W)$. Viewing $\tilde W=3W$, $L_{\text{new}}(\tilde W)=L(\tilde W/3)$ and $\nabla_{\tilde W}L_{\text{new}}=\frac13\nabla_WL$.` },
      { q: R`For the BN training output $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$, (1) show that within the batch $\hat x_{\cdot j}$ has mean 0 and variance $\sigma_j^2/(\sigma_j^2+\varepsilon)$, and (2) show that $y_{ij}=x_{ij}$ if $\gamma_j=\sqrt{\sigma_j^2+\varepsilon}$ and $\beta_j=\mu_j$.`,
        sol: R`
(1) $\frac1N\sum_i\hat x_{ij}=\frac{\frac1N\sum_ix_{ij}-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}=0$. Variance: $\frac1N\sum_i\hat x_{ij}^2=\frac{\frac1N\sum_i(x_{ij}-\mu_j)^2}{\sigma_j^2+\varepsilon}=\frac{\sigma_j^2}{\sigma_j^2+\varepsilon}\approx1$.
(2) $y_{ij}=\sqrt{\sigma_j^2+\varepsilon}\cdot\frac{x_{ij}-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}+\mu_j=x_{ij}$.
Hence a BN layer can become the identity if needed, so it does not reduce the expressive power of the network.`,
        rubric: R`
- Mean 0 — 3 pts
- The variance — 3 pts
- Recovering the identity — 4 pts` },
      { q: R`Show that inference-mode BN is an affine map $y_j=a_jx_j+b_j$ and find $a_j,b_j$. Then find $W',c'$ of the layer $y=W'u+c'$ obtained by fusing with the FC layer $x=Wu+c$.`,
        sol: R`
$y_j=\gamma_j\frac{x_j-\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}+\beta_j=\underbrace{\frac{\gamma_j}{\sqrt{\sigma_j^2+\varepsilon}}}_{a_j}x_j+\underbrace{\beta_j-\frac{\gamma_j\mu_j}{\sqrt{\sigma_j^2+\varepsilon}}}_{b_j}$. At inference $\mu,\sigma^2$ are running-average constants, so it is affine.
As a vector, $y=\diag(a)x+b$. Substituting $x=Wu+c$ gives $y=\diag(a)Wu+(\diag(a)c+b)$, so $W'=\diag(a)W$ (row $j$ multiplied by $a_j$) and $c'=\diag(a)c+b$.`,
        rubric: R`
- Computing $a_j,b_j$ — 5 pts
- $W'$, $c'$ of the fused layer — 5 pts` },
      // more-12
      { q: R`In the cosine schedule $\alpha_t=\frac12\alpha_0(1+\cos\frac{t\pi}T)$ with $\alpha_0=0.3$ and $t=T/3$, what is $\alpha_t$?`,
        sol: R`$\cos\frac\pi3=\frac12$, so $0.15(1.5)=0.225$.` },
      { q: R`In a warmup that raises the rate linearly from 0 to $\alpha_0=0.1$ over the first 5000 iterations, what is the learning rate at iteration 1200?`,
        sol: R`$0.1\times1200/5000=0.024$.` },
      { q: R`The minibatch values of one feature are $(2,4,4,6)$, with $\varepsilon=0$, $\gamma=3$, $\beta=-1$. What is the BN output of the value $6$? (4 decimal places)`,
        sol: R`$\mu=4$, $\sigma^2=\frac{4+0+0+4}4=2$. $\hat x=\frac{6-4}{\sqrt2}=\sqrt2$. $y=3\sqrt2-1\approx3.2426$.` },
      { q: R`With the running variance $(\sigma^2)^{\text{run}}\leftarrow0.9(\sigma^2)^{\text{run}}+0.1\sigma^2_{\text{batch}}$, initial value 1, and batch variances $5$ then $3$, what is the value after two updates?`,
        sol: R`First update $0.9(1)+0.1(5)=1.4$; second update $0.9(1.4)+0.1(3)=1.26+0.3=1.56$.` },
      { q: R`Show that for $\varepsilon=0$ the BN output $y_{ij}=\gamma_j\hat x_{ij}+\beta_j$ has batch mean $\beta_j$ and batch standard deviation $\lvert\gamma_j\rvert$.`,
        sol: R`
$\hat x_{ij}=(x_{ij}-\mu_j)/\sigma_j$. Batch mean: $\frac1N\sum_i\hat x_{ij}=\frac1{\sigma_j}\big(\frac1N\sum_ix_{ij}-\mu_j\big)=0$. Batch variance: $\frac1N\sum_i\hat x_{ij}^2=\frac1{\sigma_j^2}\cdot\frac1N\sum_i(x_{ij}-\mu_j)^2=\frac{\sigma_j^2}{\sigma_j^2}=1$.
$y=\gamma\hat x+\beta$ is an affine map, so its mean is $\gamma\cdot0+\beta=\beta$, its variance $\gamma^2\cdot1$, and its standard deviation $\lvert\gamma\rvert$.`,
        rubric: R`
- Mean 0 of $\hat x$ — 3 pts
- Variance 1 of $\hat x$ — 4 pts
- Mean and variance of an affine map — 3 pts` },
      { q: R`Show that a bias in the layer before BN has no effect on the BN output at training time, i.e., that the BN output of $x_{ij}+c_j$, with the same $c_j$ added to every sample, equals the BN output of $x_{ij}$.`,
        sol: R`
If $x'_{ij}=x_{ij}+c_j$, then $\mu'_j=\mu_j+c_j$ and $x'_{ij}-\mu'_j=x_{ij}-\mu_j$, hence $\sigma'^2_j=\sigma_j^2$. $\hat x'_{ij}=\hat x_{ij}$, and the output is the same. So the bias of the layer before BN is useless, and $\beta$ takes over its role.`,
        rubric: R`
- The mean shifts by $c_j$ — 4 pts
- The deviations and the variance are invariant — 4 pts
- Conclusion and meaning — 2 pts` },
      { q: R`Show that if the weight matrix right before BN is changed as $W\to\alpha W$ ($\alpha>0$, $\varepsilon=0$), (i) the output is the same and (ii) the gradient at $\alpha W$ is $\frac1\alpha$ times the gradient at $W$. What does this mean for the learning rate?`,
        sol: R`
**(i)** If the input of feature $j$ becomes $\alpha x_{ij}$, the mean is $\alpha\mu_j$ and the standard deviation $\alpha\sigma_j$ ($\alpha>0$). $\frac{\alpha x_{ij}-\alpha\mu_j}{\alpha\sigma_j}=\hat x_{ij}$ — the same output.
**(ii)** Viewing the loss as a function of the weights, (i) gives $L(\alpha V)=L(V)$ for every $V$. Differentiating in $V$ gives $\alpha\nabla L(\alpha V)=\nabla L(V)$, i.e., $\nabla L(\alpha W)=\frac1\alpha\nabla L(W)$.
**Meaning.** As the weights grow, the gradient shrinks and the size of the update relative to the weights becomes $\frac1{\alpha^2}$ times — the effective learning rate decreases automatically, making divergence hard. That is why a large learning rate can be used with BN.`,
        rubric: R`
- (i) Scaling of the mean and standard deviation — 3 pts
- (ii) Gradient scaling by differentiating the identity — 4 pts
- The meaning for the effective learning rate — 3 pts` },
      { q: R`Where did the slides place BN?`,
        choices: [R`After the activation function, before the next FC layer`, R`After an FC (or convolutional) layer, before the nonlinearity`, R`After the loss function`, R`Only at the input layer`],
        sol: R`FC → BN → tanh → FC → BN → tanh ….` },
      { q: R`For $f(x)=\frac52x^2$ ($\beta=5$), what is the upper bound of the learning rate for which GD $x\leftarrow x-\eta f'(x)$ converges?`,
        sol: R`$x_{t+1}=(1-5\eta)x_t$, and $\lvert1-5\eta\rvert<1\iff0<\eta<0.4$. The value that arrives in one step is $\eta=0.2$.` },
      // quizprep-b
      { q: R`For a minibatch $x_1,\dots,x_B$ of one feature, let $\mu=\frac1B\sum_ix_i$, $\sigma^2=\frac1B\sum_i(x_i-\mu)^2$, $s=\sqrt{\sigma^2+\varepsilon}$, $\hat x_i=(x_i-\mu)/s$, $y_i=\gamma\hat x_i+\beta$. Let the upstream gradient be $g_i:=\partial L/\partial\hat x_i=\gamma\,\partial L/\partial y_i$.
1. Show that $\dfrac{\partial\hat x_i}{\partial x_k}=\dfrac1s\Big(\mathbb 1[i=k]-\dfrac1B-\dfrac{\hat x_i\hat x_k}B\Big)$.
2. Derive $\dfrac{\partial L}{\partial x_k}=\dfrac1{Bs}\Big(Bg_k-\sum_ig_i-\hat x_k\sum_ig_i\hat x_i\Big)$.
3. Show that $\sum_k\partial L/\partial x_k=0$, and that if $\varepsilon=0$, $\sum_k\hat x_k\,\partial L/\partial x_k=0$ also holds. Explain which invariance of BN this is related to.
4. For $B=3$, $x=(0,1,2)$, $\varepsilon=0$, $\gamma=1$, $\partial L/\partial y=(1,0,0)$, find $\partial L/\partial x$.`,
        sol: R`
**1.** $\frac{\partial\mu}{\partial x_k}=\frac1B$. Using $\sum_i(x_i-\mu)=0$, $\frac{\partial\sigma^2}{\partial x_k}=\frac2B\sum_i(x_i-\mu)\big(\mathbb 1[i=k]-\frac1B\big)=\frac2B(x_k-\mu)$, so $\frac{\partial s}{\partial x_k}=\frac1{2s}\cdot\frac2B(x_k-\mu)=\frac{\hat x_k}B$. By the quotient rule,
$$\frac{\partial\hat x_i}{\partial x_k}=\frac{\mathbb 1[i=k]-\frac1B}s-\frac{x_i-\mu}{s^2}\cdot\frac{\hat x_k}B=\frac1s\Big(\mathbb 1[i=k]-\frac1B-\frac{\hat x_i\hat x_k}B\Big).$$
**2.** $\frac{\partial L}{\partial x_k}=\sum_ig_i\frac{\partial\hat x_i}{\partial x_k}=\frac1s\Big(g_k-\frac1B\sum_ig_i-\frac{\hat x_k}B\sum_ig_i\hat x_i\Big)$ — the same as the formula.
**3.** Since $\sum_k\hat x_k=0$, $\sum_k\frac{\partial L}{\partial x_k}=\frac1{Bs}\big(B\sum g-B\sum g-0\big)=0$. Also, if $\varepsilon=0$, $\sum_k\hat x_k^2=B\sigma^2/s^2=B$, so
$$\sum_k\hat x_k\frac{\partial L}{\partial x_k}=\frac1{Bs}\Big(B\sum_kg_k\hat x_k-0-B\sum_ig_i\hat x_i\Big)=0.$$
The BN output does not change when the whole batch is shifted by the same amount ($x\to x+c\mathbf 1$) or stretched about its mean ($x-\mu\to\kappa(x-\mu)$), so the input gradient has zero components in those two directions ($\mathbf 1$ and $\hat x$).
**4.** $\mu=1$, $\sigma^2=\frac23$, $s=\sqrt{2/3}$, $\hat x=(-\sqrt{3/2},0,\sqrt{3/2})\approx(-1.2247,0,1.2247)$. $g=(1,0,0)$, $\sum g=1$, $\sum g\hat x=-\sqrt{3/2}$. $Bs=3\sqrt{2/3}=\sqrt6$.
$$\frac{\partial L}{\partial x}=\frac1{\sqrt6}\big(3-1-\tfrac32,\ 0-1-0,\ 0-1+\tfrac32\big)=\Big(\frac1{2\sqrt6},-\frac1{\sqrt6},\frac1{2\sqrt6}\Big)\approx(0.2041,\ -0.4082,\ 0.2041).$$
The sum is 0 and the inner product with $\hat x$ is also 0 (checking 3). Note: if $B=2$, $\hat x$ is always $(\mp1,\pm1)$, so the BN output does not depend on the input and the gradient is 0.`,
        rubric: R`
- The derivatives of $\mu,\sigma^2,s$ and the Jacobian — 4 pts
- The input gradient formula — 2 pts
- The two sums being 0 and the invariance interpretation — 2 pts
- Numbers — 2 pts` },
    ],
  };
})();
