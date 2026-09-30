/* English text — 14 Practical Optimizations: Momentum & Adaptive Learning Rates (W5 Mon (2) slides 1–16 with notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    illcond: R`The function of the class notes, $f(x_1,x_2)=\tfrac12x_1^2+\tfrac{100}2x_2^2$ (Hessian $\diag(1,100)$, condition number 100). (a) GD bounces left and right in the steep $x_2$ direction ($x_2$: $-1\to0.9\to-0.81\to\cdots$) while moving only $1.9\%$ per step in the shallow $x_1$ direction, so even after 40 steps $x_1\approx-2.3$. (b) Momentum, with a learning rate a quarter of GD's, does not bounce in the steep $x_2$ direction but decays in a smooth wave, and in the shallow $x_1$ direction gradients of the same sign pile up in the velocity (effective learning rate $\alpha/(1-\rho)=0.05$), reaching $x_1\approx-0.3$ after 40 steps. The open circle is the minimizer.`,
    nesterov: R`(Left) Momentum combines the gradient at the **current point** with the velocity to get the step. (Right) Nesterov measures the gradient at the **look-ahead point** $x+\rho v$, where the velocity would take us, and adds it to the velocity (“look ahead”). If the gradient has already changed direction at the look-ahead point, it shortens the step early and prevents overshooting.`,
    adaptive: R`40 steps from the same starting point. Adaptive methods divide each coordinate by “the size of the gradients so far”, so on the first step both coordinates move almost the same distance ($\approx\alpha$), starting off diagonally, and they do not bounce left and right in the steep $x_2$ direction as GD does. AdaGrad and RMSProp follow almost the same path and reach $x_1\approx-1$ after 40 steps. Adam, because of its first moment (momentum), ripples once smoothly in the $x_2$ direction but goes farther, reaching $x_1\approx-0.27$. GD is still at $x_1\approx-2.3$.`,
  });
  EM.en.ch[14] = {
    title: 'Practical Optimization: Momentum & Adaptive Learning Rates',
    fig: R`On elongated contours, gradient descent (thin line) bounces from side to side, while momentum (bold line) suppresses the oscillation and rolls down`,
    tagline: R`On a loss that is steep in one direction and shallow in another, GD zigzags slowly. Momentum accumulates velocity to cancel the oscillation, and AdaGrad, RMSProp, and Adam pick the step for each coordinate by dividing by the size of its gradients.`,
    summary: R`The theory of Unit 13 said that “the learning rate must match the curvature”. But when the curvature differs greatly between directions (a **bad condition number**), a learning rate matched to the steep direction is far too small in the shallow direction, and GD crawls along a narrow valley bouncing from side to side. The Week 5 Monday notes computed this with $f=\frac12x_1^2+\frac{100}2x_2^2$. There are two remedies. (1) **Momentum**: step with a “velocity” that accumulates past steps exponentially, so bouncing components cancel and consistent components add up. **Nesterov** uses the gradient at the point the velocity would take us to. (2) **Adaptive learning rates**: for each coordinate, accumulate the squared gradients so far (AdaGrad) or take their exponential moving average (RMSProp), and divide by its square root. **Adam** combines the two and corrects the initial bias.`,
    goals: [
      R`Define the condition number, and explain with per-coordinate recursions why GD zigzags slowly on a quadratic with a large condition number`,
      R`Write the momentum update, unroll $v_t$ as an exponentially weighted sum of past gradients, and explain the effective learning rate $\alpha/(1-\rho)$`,
      R`Write the “look ahead” of Nesterov momentum as a formula and compute the numerical example from class`,
      R`Write AdaGrad's accumulated sum of squares and per-coordinate learning rates, and explain its drawback that the learning rate keeps shrinking`,
      R`Explain how RMSProp's exponential moving average fixes AdaGrad's drawback`,
      R`Write Adam's first and second moments and bias correction, and state why the correction is needed and the default hyperparameters`,
    ],
    secTitles: { '14.1': 'Bad condition number', '14.2': 'Momentum · Nesterov', '14.3': 'AdaGrad · RMSProp', '14.4': 'Adam', '14.5': 'Summary' },
    secs: {
      '14.1': { title: 'Problems with GD/SGD: Bad Conditioning, Local Minima, Saddle Points', body: R`
:::idea In plain words
Suppose you are going down to the bottom of a long, narrow canyon. The direction **toward the walls** is very steep, and the direction **along the canyon** is almost flat. Following the slope drags you almost entirely toward the walls, bouncing from side to side, while you make only a little progress along the canyon, where you actually need to go. A large step flies over the wall; a small one takes forever. This is the “bad condition number” problem.
:::

The slide's question: what if the loss changes quickly in one direction and slowly in another? What does gradient descent do? — **Very slow progress along the shallow dimension, jitter along the steep direction.**

:::def Condition number
The ratio of the largest to the smallest (positive) eigenvalue of the (symmetric) Hessian of the loss, $\kappa=\lambda_{\max}/\lambda_{\min}$, is called the **condition number**. The slide writes “the ratio of the largest to smallest singular value of the Hessian matrix”; for a symmetric positive definite matrix, singular values = eigenvalues, so it is the same thing.
:::

### The computation in the class notes

:::key Condition number and gradient descent
For $f(x_1,x_2)=\frac12x_1^2+\frac{100}2x_2^2$, $\nabla f=(x_1,\ 100x_2)$, the Hessian is $H=\diag(1,100)$, and the condition number is $100$. GD $x\leftarrow x-\alpha\nabla f$ is, coordinate by coordinate,
$$x_{1,t+1}=(1-\alpha)\,x_{1,t},\qquad x_{2,t+1}=(1-100\alpha)\,x_{2,t}$$
and convergence requires $\lvert1-100\alpha\rvert<1$, i.e., $\alpha<0.02$. The shallow direction then shrinks by only a factor $1-\alpha>0.98$ per step.
:::

The table in the notes ($\alpha=0.019$, starting point $(-5,-1)$):

| $t$ | $x_1$ | $x_2$ |
|---|---|---|
| 0 | $-5$ | $-1$ |
| 1 | $-4.9$ | $0.9$ |
| 2 | $-4.8$ | $-0.8$ |
| 3 | $-4.7$ | $0.7$ |

$x_1$ shrinks by a factor $(1-0.019)=0.981$ each step and barely moves, while $x_2$ is multiplied by $(1-1.9)=-0.9$, so it shrinks while flipping sign (bouncing left and right). (Precisely, $x_1$: $-4.905$, $-4.812$, $-4.720$; $x_2$: $0.9$, $-0.81$, $0.729$.) Even after 40 steps $x_1\approx-2.32$ — not even halfway from the start.

:::fig illcond
:::

**Why the condition number sets the speed.** The error along the direction of eigenvalue $\lambda_i$ is multiplied by $\lvert1-\alpha\lambda_i\rvert$ at each step[[ch01:1.5|The same computation as for GD in linear regression: the error is multiplied by $(I-\alpha X^TX)$.]]. To avoid divergence, $\alpha<2/\lambda_{\max}$, and then the shrink factor in the shallowest direction is $1-\alpha\lambda_{\min}>1-2/\kappa$. Even with the best fixed learning rate $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$ the shrink factor is $\frac{\kappa-1}{\kappa+1}$ ($0.980$ for $\kappa=100$), so reducing the error by a factor $1/e$ takes about $\kappa/2=50$ steps.

### Two other problems (slide 3)

- **Local minima**: places where the gradient is zero, so GD gets stuck, but which are not the global minimum.
- **Saddle points**: points where the gradient is zero but the function goes up in some directions and down in others (e.g., the origin of $f=x^2-y^2$). In high-dimensional neural networks, saddle points and the **flat regions** around them are far more common than local minima, and GD becomes very slow there because the gradient is small.
- On top of that, our gradients come from minibatches, so they can be **noisy**, making the path even more jagged.

Momentum helps with all three problems: the accumulated velocity carries it over flat regions and small bumps, and components bouncing left and right cancel (next section).

### Going deeper: Newton's method and preconditioning

If the Hessian is known, $x\leftarrow x-H^{-1}\nabla f$ (Newton's method) solves a quadratic in one step: $H^{-1}\nabla f=(x_1,\ x_2)$, so it goes straight to the origin. That is, dividing each coordinate by its curvature removes the condition-number problem. But with $d$ parameters the Hessian is $d\times d$, which is impossible for neural networks. Approximating it by a diagonal matrix $D\approx\diag(H)$ and using “a different learning rate per coordinate”, $x\leftarrow x-\alpha D^{-1}\nabla f$, is **diagonal preconditioning**, and AdaGrad, RMSProp, and Adam in Section 14.3 imitate $D$ with “statistics of the gradient sizes” instead of the curvature.
` },
      '14.2': { title: 'Momentum and Nesterov Momentum', body: R`
:::idea In plain words
Think of rolling a heavy ball. The ball moves not only with the current slope but with **the velocity it has built up so far**. The components bouncing between the canyon walls come alternately from the right and the left and cancel out, while the component going down along the canyon has the same direction every time, so it builds up and gets faster and faster. Nesterov adds a clever twist: “go a little ahead in the direction you were moving, and measure the slope there”.
:::

### Momentum (heavy ball)

:::key Momentum (heavy ball)
GD: $x_{t+1}=x_t-\alpha\nabla f(x_t)$.
GD + momentum ($0\le\rho<1$, usually $0.9$):
$$v_{t+1}=\rho v_t-\alpha\nabla f(x_t),\qquad x_{t+1}=x_t+v_{t+1}.$$
Since $v_t=x_t-x_{t-1}$, in one line $x_{t+1}=x_t-\alpha\nabla f(x_t)+\rho(x_t-x_{t-1})$ (notes). The initial value is $v_0=0$, i.e., $x_{-1}=x_0$.
:::

$\rho v_t$ is the **inertia** (continuing the last step scaled by $\rho$), and $-\alpha\nabla f(x_t)$ is the **force** of this step. With $\rho=0$ it is the same as GD.

:::key Unrolling momentum
With $g_t:=\nabla f(x_t)$ and $v_0=0$,
$$v_1=-\alpha g_0,\qquad v_2=-\alpha(\rho g_0+g_1),\qquad v_3=-\alpha(\rho^2g_0+\rho g_1+g_2),\ \dots$$
$$v_{t}=-\alpha\sum_{k=0}^{t-1}\rho^{\,t-1-k}g_k.$$
:::

This is exactly the computation in the notes. The velocity is an **exponentially weighted sum** of past gradients, and the older a gradient, the more it is weakened by powers of $\rho$. (By induction: $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k<t}\rho^{t-k}g_k+g_t\big)$.)

**Two effects.**
- If the gradient is **constant** ($g_k=g$), $v_t\to-\alpha g\sum_{j\ge0}\rho^j=-\frac{\alpha}{1-\rho}g$ — the effective learning rate grows to $\frac\alpha{1-\rho}$ (10 times for $\rho=0.9$). It accelerates in shallow, straight directions.
- If the gradient **alternates in sign** ($g_k=(-1)^kg$), the terms of the sum cancel and $\lvert v_t\rvert\lesssim\frac{\alpha}{1+\rho}\lvert g\rvert$ — in oscillating directions the step actually shrinks.

:::ex Example 1 — Two steps on the class function
$f=\frac12x_1^2+50x_2^2$, $x_0=(-5,-1)$, $\alpha=0.019$, $\rho=0.8$, $v_0=0$. Find $x_1,x_2$ and compare with GD.
---
$g_0=(-5,-100)$. $v_1=-0.019g_0=(0.095,\ 1.9)$, $x_1=(-4.905,\ 0.9)$ (the same as GD).
$g_1=(-4.905,\ 90)$. $v_2=0.8(0.095,1.9)-0.019(-4.905,90)=(0.076+0.0932,\ 1.52-1.71)=(0.1692,\ -0.19)$, $x_2=(-4.736,\ 0.710)$.
Compared with GD's second point $(-4.812,\ -0.81)$, it has come farther in the $x_1$ direction ($0.169$ versus $0.093$), and the bouncing in the $x_2$ direction has decreased ($0.71$ versus $-0.81$, with no sign flip). After 40 steps momentum is near $(0.08,\ 0.02)$ and GD at $(-2.32,\ -0.015)$.
:::

### Nesterov momentum

:::key Nesterov momentum
$$v_{t+1}=\rho v_t-\alpha\nabla f(x_t+\rho v_t),\qquad x_{t+1}=x_t+v_{t+1}.$$
As written in the notes: with the “look-ahead point” $y_t=x_t+\rho_tv_t$, $v_{t+1}=\rho_tv_t-\alpha\nabla f(y_t)$ and $x_{t+1}=x_t+v_{t+1}=y_t-\alpha\nabla f(y_t)$.
:::

Momentum combines the gradient at the **current point** with the velocity to get the step used to update the weights; Nesterov “looks ahead” to the point where updating using the velocity would take us, computes the gradient there, and mixes it with the velocity to get the actual update direction. The second formula, $x_{t+1}=y_t-\alpha\nabla f(y_t)$, means “one GD step from the look-ahead point”.

:::fig nesterov
:::

:::ex Example 2 — The comparison in the class notes
$f(x)=\frac{x^2}2$ ($f'(x)=x$, minimizer $x^*=0$), $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$. What are $x_{t+1}$ for momentum and for Nesterov?
---
Inertia $\rho v_t=-1.8$, look-ahead point $y_t=1-1.8=-0.8$.

| | Momentum | Nesterov |
|---|---|---|
| Where the gradient is measured | $f'(1)=1$ | $f'(-0.8)=-0.8$ |
| Correction $-\alpha\nabla$ | $-0.1$ | $+0.08$ |
| $x_{t+1}$ | $1-1.8-0.1=-0.9$ | $-0.8+0.08=-0.72$ |

Because of the velocity both overshoot the minimizer 0, but momentum uses the gradient at **the place already passed** (the right, $x=1$) and pushes further left to $-0.9$, while Nesterov sees at **the place it will arrive** ($-0.8$) a gradient saying “already overshot”, pulls back to the right, and stops at $-0.72$ — closer to 0.
:::

The figure on slide 9 (the paths of SGD, SGD+momentum, and Nesterov) shows the same picture: momentum swings wide, overshoots, and comes back, while Nesterov overshoots less.

### Going deeper: the convergence rate on a quadratic

Viewing momentum along one eigendirection ($\lambda$) of a quadratic gives $x_{t+1}=(1+\rho-\alpha\lambda)x_t-\rho x_{t-1}$ — a second-order linear recurrence, and if the roots of the characteristic equation $z^2-(1+\rho-\alpha\lambda)z+\rho=0$ are complex, $\lvert z\rvert=\sqrt\rho$, so every direction shrinks at **the same rate**[[@em:ch02:2.2|Characteristic roots of second-order constant-coefficient equations and damped oscillation.]]. With the optimal choice ($\alpha=\frac4{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2}$, $\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$) the shrink factor is $\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$: GD's $\frac{\kappa-1}{\kappa+1}$ with $\kappa$ replaced by $\sqrt\kappa$. For $\kappa=100$ the number of steps drops from about 50 to about 5. Nesterov's accelerated method turns GD's $O(1/T)$ into $O(1/T^2)$ even for general smooth convex functions, and this is known to be the optimal rate for first-order methods (Nesterov 1983).
` },
      '14.3': { title: 'AdaGrad and RMSProp', body: R`
:::idea In plain words
Keep a record, for each coordinate, of “how large the gradients have been so far”, and **shrink** the step for coordinates whose gradients were always large (steep directions) and **enlarge** it for coordinates whose gradients were always small (shallow directions). Then the bouncing toward the steep canyon walls dies down and the progress along the canyon speeds up. AdaGrad adds up all the records from the start; RMSProp gives weight **only to recent records**.
:::

### AdaGrad

:::key AdaGrad
$$r_{t+1}=r_t+\nabla f(x_t)\odot\nabla f(x_t),\qquad x_{t+1}=x_t-\frac{\alpha}{\sqrt{r_{t+1}}+\varepsilon}\odot\nabla f(x_t)$$
($\odot$, division, and square roots are all elementwise.) In the notation of the notes, with $g_t=\nabla f(x_{t-1})$ and $A_t=A_{t-1}+g_t\odot g_t$ ($A_0=0$), $A_{t,j}=\sum_{k=1}^tg_{k,j}^2$ and $x_{t,j}=x_{t-1,j}-\dfrac{\alpha}{\sqrt{A_{t,j}}+\varepsilon}g_{t,j}$.
:::

In code: grad_squared += dx*dx; x -= learning_rate * dx / (np.sqrt(grad_squared) + 1e-7). The effective learning rate of coordinate $j$ is $\alpha/\sqrt{\sum_kg_{k,j}^2}$ — **different for each coordinate, and shrinking over time.**

:::ex Example 3 — The first step in the class notes
$g_1=(0.1,\ 10)$, $\alpha=0.01$, ignoring $\varepsilon$. What are the first steps of GD and AdaGrad?
---
$A_1=(0.01,\ 100)$, $\sqrt{A_1}=(0.1,\ 10)$.

| Coordinate $g$ | GD $-\alpha g$ | AdaGrad $-\alpha g/\sqrt A$ |
|---|---|---|
| $0.1$ | $-0.001$ | $-0.01$ |
| $10$ | $-0.1$ | $-0.01$ |

GD goes 100 times farther along the coordinate whose gradient is 100 times larger, but on the first step AdaGrad moves **every coordinate the same distance** $\alpha$ ($g/\sqrt{g^2}=\pm1$). Progress along steep directions is damped and progress along flat directions is accelerated (slide: “Progress along steep directions is damped; progress along flat directions is accelerated”).
:::

**Drawback.** Since it **accumulates all** the squares, $A_t$ keeps growing and the effective learning rate keeps shrinking. For convex problems this actually helps convergence, but for nonconvex problems that need long training, like neural networks, the learning rate approaches 0 too early and **learning stops**. Example: if the gradient size is always 1, the $t$-th step is $\alpha/\sqrt t$.

### RMSProp (Tieleman & Hinton, 2012)

:::key RMSProp
Use an **exponential moving average** (running average) of the squared gradients with decay rate $\beta$ (decay_rate, usually $0.9$ or $0.99$).
$$z\leftarrow\beta z+(1-\beta)\,\nabla f(x)\odot\nabla f(x),\qquad x\leftarrow x-\alpha\frac{\nabla f(x)}{\sqrt z+\epsilon}.$$
:::

In code: grad_squared = decay_rate * grad_squared + (1 - decay_rate) * dx * dx. Slide 13: “RMSProp improves upon AdaGrad, whose update magnitude continuously decreases because it accumulates the squares of all past gradients, eventually leading to vanishing updates. RMSProp addresses this by applying an exponential moving average (EMA), giving more weight to recent gradients while discounting older ones.” In the formulas of slide 8,
$$\begin{aligned}&\text{AdaGrad: }h\leftarrow h+\frac{\partial L}{\partial W}\odot\frac{\partial L}{\partial W},\\&\text{RMSProp: }h_i=\rho h_{i-1}+(1-\rho)\frac{\partial L_i}{\partial W}\odot\frac{\partial L_i}{\partial W},\\&W\leftarrow W-\eta\frac1{\sqrt h}\frac{\partial L}{\partial W}.\end{aligned}$$

**Why it does not shrink.** If the gradient size is a constant $c$, then $z\to c^2$ (the weights sum to $(1-\beta)\sum\beta^k=1$), so the step **stays constant** at $\alpha c/c=\alpha$. It does not shrink like AdaGrad's $\alpha/\sqrt t$. It effectively remembers only the most recent $\frac1{1-\beta}$ or so gradients (10 for 0.9, 100 for 0.99).

:::warn The norm notation on the slides
The formulas on slides 7 and 9 are written with the **squared norm** (a scalar), as in $z\leftarrow\beta z+(1-\beta)\lVert\nabla f(x)\rVert_2^2$, but the code right next to them, dx * dx, is the **elementwise square**. The whole point is to give each coordinate a different learning rate, so it must be read elementwise ($\odot$). Written as a scalar, it would give every coordinate the same learning rate — a method that does nothing for the condition-number problem.
:::

:::fig adaptive
:::
` },
      '14.4': { title: 'Adam: Momentum + RMSProp + Bias Correction', body: R`
:::idea In plain words
Adam combines two things. The **direction** to walk is a moving average of the gradients, as in momentum (the first moment), and the **size** of the step is set by dividing by the square root of a moving average of the squared gradients, as in RMSProp (the second moment). There is one problem: both averages start at 0, so for the first few steps they come out smaller than they really are. So a **bias correction** that enlarges them by the right amount at the start is added.
:::

### Adam (almost, slide 14)

$$m_1\leftarrow\beta_1m_1+(1-\beta_1)\nabla f(x)\quad(\text{moving average of the gradient: direction, momentum}),$$
$$m_2\leftarrow\beta_2m_2+(1-\beta_2)\nabla f(x)\odot\nabla f(x)\quad(\text{moving average of the square: AdaGrad/RMSProp}),$$
$$x\leftarrow x-\alpha\frac{m_1}{\sqrt{m_2}+\epsilon}.$$
It is “sort of like RMSProp with momentum”.

### Adam (full form, slide 15; Kingma & Ba, ICLR 2015)

:::key Adam
For $t=1,2,\dots$, with $g=\nabla f(x)$,
$$m_1\leftarrow\beta_1m_1+(1-\beta_1)g,\qquad m_2\leftarrow\beta_2m_2+(1-\beta_2)g\odot g,$$
$$\hat m_1=\frac{m_1}{1-\beta_1^t},\qquad \hat m_2=\frac{m_2}{1-\beta_2^t},\qquad x\leftarrow x-\alpha\frac{\hat m_1}{\sqrt{\hat m_2}+\epsilon}.$$
Start from $m_1=m_2=0$. Adam with $\beta_1=0.9$, $\beta_2=0.999$, and $\alpha=10^{-3}$ or $5\times10^{-4}$ is a great starting point for many models.
:::

:::key Adam's bias correction
Starting $m_1$ at 0 gives $m_{1,t}=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$, and if the expected gradient is constant ($\E g_k=\bar g$),
$$\E[m_{1,t}]=(1-\beta_1)\bar g\sum_{k=1}^t\beta_1^{t-k}=(1-\beta_1^t)\,\bar g.$$
Hence $\hat m_1=m_1/(1-\beta_1^t)$ is an unbiased estimator of $\bar g$. The same holds for $m_2$.
:::

**Derivation.** The unrolled formula follows by the same induction as momentum in Section 14.2. Multiplying by the sum $\sum_{k=1}^t\beta_1^{t-k}=1+\beta_1+\dots+\beta_1^{t-1}=\frac{1-\beta_1^t}{1-\beta_1}$ (a geometric series) gives $(1-\beta_1^t)\bar g$. When $t$ is small at the start, $1-\beta^t$ is small (e.g., $0.001$ for $\beta_2=0.999$, $t=1$), so the correction acts strongly; as $t$ grows it approaches 1 and the correction disappears.

:::ex Example 4 — The size of the first step
$\beta_1=0.9$, $\beta_2=0.999$, ignoring $\epsilon$. With first gradient $g_1$, what is the first step of (a) Adam with bias correction and (b) Adam without correction (the almost form)?
---
$m_1=0.1g_1$, $m_2=0.001g_1^2$ (elementwise).
(a) $\hat m_1=\frac{0.1g_1}{0.1}=g_1$, $\hat m_2=\frac{0.001g_1^2}{0.001}=g_1^2$. The step is $\alpha\frac{g_1}{\lvert g_1\rvert}=\alpha\,\operatorname{sign}(g_1)$ — each coordinate moves exactly $\alpha$ (regardless of the gradient size).
(b) The step is $\alpha\frac{0.1g_1}{\sqrt{0.001}\lvert g_1\rvert}=\frac{0.1}{0.0316}\alpha\approx3.16\alpha$ — the first step is more than 3 times larger than intended. The problem arises because the two moments are biased toward 0 by different amounts ($1-\beta_1=0.1$ versus $\sqrt{1-\beta_2}\approx0.032$), and the bias correction reconciles them.
:::

**The role of each part (the colored boxes on slide 15).**
- First line (momentum): smooths the direction — cancels oscillation, passes through flat regions.
- Second line (AdaGrad/RMSProp): per-coordinate scaling — mitigates the condition-number problem.
- Bias correction: fixes the size of the first few steps.
- Last line: the update. $\frac{\hat m_1}{\sqrt{\hat m_2}}$ is “mean of the gradient ÷ RMS of the gradient”, a “signal-to-noise ratio” roughly in $[-1,1]$, so the step size is roughly bounded by $\alpha$. That is why Adam's $\alpha$ is interpreted as “the approximate amount a weight moves in one step”.

### Going deeper: weight decay and AdamW

Adding $\frac\lambda2\lVert w\rVert^2$ to the loss adds $\lambda w$ to the gradient, but Adam divides even this by $\sqrt{\hat m_2}$, so the strength of the regularization differs from coordinate to coordinate. So **AdamW** (decoupled weight decay), which does not put the regularization into the gradient but subtracts it separately in the update, $w\leftarrow w-\alpha\lambda w$, is widely used[[@med:ch11:9.2|Weight decay.]]. Also, in theory there are counterexamples where Adam fails to converge on certain convex problems (when the second moment shrinks, the effective learning rate can grow), and variants such as AMSGrad, which uses the maximum of $\hat m_2$, have been proposed. In practice, Adam(W) + warmup + cosine decay is the standard combination[[ch12:12.2|Learning rate schedules and warmup.]].
` },
      '14.5': { title: 'Summary: Which Optimizer to Use', body: R`
:::idea In plain words
All the methods come from the same root, “go down along the slope”, and branch by (1) whether they remember the past **direction** (momentum) and (2) whether they use a different **size** for each coordinate (adaptive). Adam does both.
:::

| Method | Direction | Per-coordinate size | State | Key hyperparameters |
|---|---|---|---|---|
| (S)GD | $g$ | Same | None | $\alpha$ |
| Momentum | $\rho v-\alpha g$ | Same | $v$ | $\alpha,\rho=0.9$ |
| Nesterov | $g$ at the look-ahead point | Same | $v$ | $\alpha,\rho$ |
| AdaGrad | $g$ | $1/\sqrt{\sum g^2}$ (keeps decreasing) | $r$ | $\alpha$ |
| RMSProp | $g$ | $1/\sqrt{\text{EMA}(g^2)}$ | $z$ | $\alpha,\beta=0.9$ |
| Adam | $\text{EMA}(g)$ | $1/\sqrt{\text{EMA}(g^2)}$ + bias correction | $m_1,m_2$ | $\alpha=10^{-3},\beta_1=0.9,\beta_2=0.999$ |

- In every method **the learning rate is the most important** hyperparameter, and it is used together with a schedule (decay, warmup)[[ch12:12.1|The learning rate and learning curves.]].
- Memory: momentum and RMSProp store extra state as large as the number of parameters, Adam twice that.
- In practice Adam is less sensitive to hyperparameters and is widely used as the default, while SGD with momentum, when well tuned, sometimes generalizes better (especially for image classification with convolutional networks), so both are used.
- After Week 5: implement it yourself (“Code up!”), then convolutional neural networks (CNNs).

:::tip Exam summary
(1) The per-coordinate recursion and convergence condition of the condition-number example (2) the unrolled momentum formula and $\alpha/(1-\rho)$ (3) the look-ahead computation of Nesterov (4) AdaGrad's first step = $\alpha$ in every coordinate (5) why RMSProp fixes AdaGrad (6) Adam's bias correction $\E m_t=(1-\beta^t)\bar g$ and first step $\alpha\operatorname{sign}(g)$. Each comes out of a line or two of computation.
:::
` },
    },
    probs: [
      // u14
      { q: R`When GD is applied to $f(x_1,x_2)=\frac12x_1^2+\frac{100}2x_2^2$, what is the upper bound on the learning rate for which it does not diverge?`,
        sol: R`Per coordinate, $x_{2}\leftarrow(1-100\alpha)x_2$, and $\lvert1-100\alpha\rvert<1\iff0<\alpha<0.02$. (The condition $\alpha<2$ for $x_1$ is weaker.)` },
      { q: R`For the function above with $\alpha=0.019$ and $x_0=(-5,-1)$, what is the $x_2$ coordinate after three GD steps? (3 decimal places)`,
        sol: R`$x_2\leftarrow(1-1.9)x_2=-0.9x_2$: $-1\to0.9\to-0.81\to0.729$.` },
      { q: R`What is the condition number of a quadratic whose Hessian is $\diag(2,50)$?`,
        sol: R`$\kappa=50/2=25$.` },
      { q: R`On a quadratic with condition number $\kappa=100$, what is the per-step error shrink factor $\frac{\kappa-1}{\kappa+1}$ of GD with the optimal fixed learning rate $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$? (4 decimal places)`,
        sol: R`$\lvert1-\alpha\lambda_{\min}\rvert=\lvert1-\alpha\lambda_{\max}\rvert=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\kappa-1}{\kappa+1}=\frac{99}{101}$.` },
      { q: R`When the gradient always has the same direction and size, the effective learning rate of momentum ($\rho=0.9$) converges to how many times the original $\alpha$?`,
        sol: R`$v_t\to-\alpha g\sum_{j\ge0}\rho^j=-\frac\alpha{1-\rho}g$. For $\rho=0.9$, 10 times.` },
      { q: R`With $f(x)=\frac{x^2}2$, $x_t=2$, $v_t=-1$, $\rho=0.5$, $\alpha=0.2$, what is $x_{t+1}$ for (ordinary) momentum?`,
        sol: R`$v_{t+1}=0.5(-1)-0.2f'(2)=-0.5-0.4=-0.9$, $x_{t+1}=2-0.9=1.1$.` },
      { q: R`Under the same conditions, what is $x_{t+1}$ for Nesterov momentum?`,
        sol: R`Look-ahead point $y=2+0.5(-1)=1.5$, $v_{t+1}=-0.5-0.2f'(1.5)=-0.5-0.3=-0.8$, $x_{t+1}=2-0.8=1.2$ ($=y-\alpha f'(y)=1.5-0.3$).` },
      { q: R`In the class example ($f=x^2/2$, $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$), why is Nesterov closer to the minimizer than momentum?`,
        choices: [R`Because its learning rate is larger`, R`Because at the look-ahead point ($-0.8$) it sees a gradient saying “already overshot” and applies a correction ($+0.08$) that pulls it back`, R`Because it does not use the velocity`, R`Because it computes the gradient twice`],
        sol: R`Momentum uses the gradient at $x=1$, already passed (higher on the right), and pushes further left to $-0.9$; Nesterov uses the gradient at the place it will arrive and gets $-0.72$.` },
      { q: R`In AdaGrad with $g_1=(0.2,\ 20)$ and $\alpha=0.05$ (ignoring $\varepsilon$), what is the second component of the first step?`,
        sol: R`$A_1=(0.04,400)$, $\sqrt{A_1}=(0.2,20)$, and the step is $-\alpha g/\sqrt A=-0.05(1,1)$. On the first step every coordinate moves $\alpha$ (with sign opposite to the gradient).` },
      { q: R`For a coordinate whose gradient size is exactly 1 every time, the $t$-th step of AdaGrad has size $\alpha/\sqrt t$. With $\alpha=0.1$, what is the size of the 100th step?`,
        sol: R`$A_{100}=100$, and the step is $0.1/\sqrt{100}=0.01$. That it keeps shrinking is AdaGrad's drawback.` },
      { q: R`In RMSProp ($\beta=0.9$, $z_0=0$), if the gradient is $2$ every time, what is $z$ after 3 updates?`,
        sol: R`$z_1=0.1\cdot4=0.4$, $z_2=0.9(0.4)+0.4=0.76$, $z_3=0.9(0.76)+0.4=1.084$. In general $z_t=4(1-0.9^t)$, starting from 0 and approaching $g^2=4$ (biased low at first — the bias Adam corrects).` },
      { q: R`In Adam with $\beta_2=0.999$, what is the bias-correction denominator $1-\beta_2^t$ at $t=1$?`,
        sol: R`$1-0.999=0.001$. It enlarges $m_2$ by a factor of 1000.` },
      { q: R`The first step of Adam **without** bias correction ($\beta_1=0.9$, $\beta_2=0.999$, ignoring $\epsilon$) is how many times $\alpha$? (2 decimal places)`,
        sol: R`$m_1=0.1g$, $m_2=0.001g^2$, and the step is $\alpha\cdot0.1\lvert g\rvert/(\sqrt{0.001}\lvert g\rvert)\approx3.16\alpha$. With the correction it is exactly $\alpha$.` },
      { q: R`What starting hyperparameters do the Adam paper and the slides recommend?`,
        choices: [R`$\beta_1=0.5$, $\beta_2=0.9$, $\alpha=0.1$`, R`$\beta_1=0.9$, $\beta_2=0.999$, $\alpha=10^{-3}$ or $5\times10^{-4}$`, R`$\beta_1=0.999$, $\beta_2=0.9$, $\alpha=1$`, R`$\beta_1=\beta_2=0$`],
        sol: R`Slide 15: “Adam with beta1 = 0.9, beta2 = 0.999, and learning_rate = 1e-3 or 5e-4 is a great starting point for many models!”` },
      { q: R`For momentum $v_{t+1}=\rho v_t-\alpha g_t$, $v_0=0$, prove by induction that $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}g_k$, and show that (i) if $g_k=g$ (constant), $v_t\to-\frac\alpha{1-\rho}g$, and (ii) if $g_k=(-1)^kg$, $\lvert v_t\rvert$ is as small as about $\lvert v_t\rvert\le\frac{\alpha}{1+\rho}\lvert g\rvert+\alpha\rho^t\lvert g\rvert$.`,
        sol: R`
**Induction.** $t=1$: $v_1=-\alpha g_0$ ✓. If $v_t$ satisfies the formula, $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k=0}^{t-1}\rho^{t-k}g_k+g_t\big)=-\alpha\sum_{k=0}^t\rho^{t-k}g_k$ ✓.
**(i)** $v_t=-\alpha g\sum_{j=0}^{t-1}\rho^j=-\alpha g\frac{1-\rho^t}{1-\rho}\to-\frac{\alpha g}{1-\rho}$ ($0\le\rho<1$).
**(ii)** $v_t=-\alpha g\sum_{k=0}^{t-1}\rho^{t-1-k}(-1)^k$. Changing to $j=t-1-k$ gives $(-1)^{t-1}\sum_{j=0}^{t-1}(-\rho)^j$, and $\sum_{j=0}^{t-1}(-\rho)^j=\frac{1-(-\rho)^t}{1+\rho}$. Hence $\lvert v_t\rvert=\alpha\lvert g\rvert\frac{\lvert1-(-\rho)^t\rvert}{1+\rho}\le\frac{\alpha\lvert g\rvert(1+\rho^t)}{1+\rho}$ — roughly $\frac{\alpha}{1+\rho}\lvert g\rvert$, much smaller than the $\frac\alpha{1-\rho}$ of the constant case (about $0.53\alpha$ versus $10\alpha$ for $\rho=0.9$).`,
        rubric: R`
- Induction — 3 pts
- (i) The geometric series and the limit — 3 pts
- (ii) The alternating geometric series and the size comparison — 4 pts` },
      { q: R`For Adam's first moment $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $m_0=0$, show that $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$, and prove that if $\E g_k=\bar g$ (for all $k$), then $\E[m_t]=(1-\beta_1^t)\bar g$. Use this to explain the reason for the bias correction $\hat m_t=m_t/(1-\beta_1^t)$.`,
        sol: R`
**Unrolling (induction).** $t=1$: $m_1=(1-\beta_1)g_1$ ✓. $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t=(1-\beta_1)\big(\sum_{k=1}^{t-1}\beta_1^{t-k}g_k+g_t\big)=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$ ✓.
**Expectation.** By linearity, $\E m_t=(1-\beta_1)\bar g\sum_{k=1}^t\beta_1^{t-k}=(1-\beta_1)\bar g\frac{1-\beta_1^t}{1-\beta_1}=(1-\beta_1^t)\bar g$.
**The reason.** Starting from $m_0=0$, $m_t$ is biased (toward 0) by a factor $(1-\beta_1^t)$ relative to $\bar g$. Dividing by $1-\beta_1^t$ gives $\E\hat m_t=\bar g$ — unbiased. For large $t$, $\beta_1^t\to0$ and the correction disappears; it acts strongly only at the start. The same computation applies to $m_2$ with $g_k^2$.`,
        rubric: R`
- Induction for the unrolled formula — 3 pts
- The expectation and the geometric series — 4 pts
- The meaning of the bias correction — 3 pts` },
      { q: R`When GD $x_{t+1}=x_t-\alpha Hx_t$ is applied to $f(x)=\frac12x^THx$ ($H$ symmetric with eigenvalues $0<\lambda_{\min}\le\dots\le\lambda_{\max}$), (i) show the convergence condition $0<\alpha<2/\lambda_{\max}$, and (ii) show that under this condition the shrink factor of the slowest direction, $\max_i\lvert1-\alpha\lambda_i\rvert$, is minimized at $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$ with value $\frac{\kappa-1}{\kappa+1}$.`,
        sol: R`
**(i)** Diagonalize $H=Q\Lambda Q^T$ and let $u=Q^Tx$; then $u_{t+1,i}=(1-\alpha\lambda_i)u_{t,i}$. Convergence from every initial value $\iff\lvert1-\alpha\lambda_i\rvert<1$ $\forall i\iff0<\alpha<2/\lambda_{\max}$.
**(ii)** $\phi(\alpha)=\max_i\lvert1-\alpha\lambda_i\rvert=\max(\lvert1-\alpha\lambda_{\min}\rvert,\lvert1-\alpha\lambda_{\max}\rvert)$ (the absolute value of a linear function is largest at the extreme $\lambda$'s). The first term decreases in $\alpha$ (on $\alpha<1/\lambda_{\min}$) and the second increases for $\alpha>1/\lambda_{\max}$, so the minimum is where they are equal: $1-\alpha\lambda_{\min}=\alpha\lambda_{\max}-1\Rightarrow\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$. The value there is $1-\frac{2\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\kappa-1}{\kappa+1}$.`,
        rubric: R`
- Diagonalization and the per-coordinate recursion — 3 pts
- The convergence condition — 2 pts
- Why the maximum occurs at the extremes — 2 pts
- The balance point and its value — 3 pts` },
      { q: R`In RMSProp, if the gradient is the same value $g$ every time (with every component $g_j\ne0$) and $z_0=0$, show that $z_t=(1-\beta^t)g\odot g$, and show that as $t\to\infty$ the step size becomes a constant $\alpha$. Compare with AdaGrad.`,
        sol: R`
$z_t=\beta z_{t-1}+(1-\beta)g^2$ (elementwise). Unrolling, $z_t=(1-\beta)g^2\sum_{k=0}^{t-1}\beta^k=(1-\beta^t)g^2$. As $t\to\infty$, $z_t\to g^2$ and the step $\alpha\frac{g}{\sqrt{z_t}}\to\alpha\operatorname{sign}(g)$ — a constant size $\alpha$.
In AdaGrad $A_t=tg^2$, so the step $\alpha\frac{g}{\sqrt tg}=\frac\alpha{\sqrt t}$ keeps shrinking. RMSProp forgets old gradients and prevents this decay.`,
        rubric: R`
- The unrolled formula — 4 pts
- The limit and the step size — 3 pts
- Comparison with AdaGrad — 3 pts` },
      // quizprep-b
      { q: R`Adam (elementwise operations): $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2$, $m_0=v_0=0$, $\hat m_t=\frac{m_t}{1-\beta_1^t}$, $\hat v_t=\frac{v_t}{1-\beta_2^t}$, $x_t=x_{t-1}-\alpha\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}$.
1. Show that if $\epsilon=0$, the first step is $x_1-x_0=-\alpha\operatorname{sign}(g_1)$ in every nonzero component of $g_1$.
2. With $\epsilon=0$, prove by induction that replacing the loss $f$ by $cf$ ($c\gt0$) does not change Adam's trajectory $x_1,x_2,\dots$ from the same starting point. (Assume the denominators are nonzero.) What happens to SGD?
3. For $f(x)=\frac12(x_1^2+100x_2^2)$ and $x_0=(1,1)$, find the first step $x_1$ of SGD ($\alpha=0.01$) and of Adam ($\alpha=0.01$, $\epsilon=0$), and explain the difference in terms of the condition number.`,
        sol: R`
**1.** $m_1=(1-\beta_1)g_1$ and $v_1=(1-\beta_2)g_1^2$, so $\hat m_1=g_1$ and $\hat v_1=g_1^2$. In each component, $\frac{\hat m_1}{\sqrt{\hat v_1}}=\frac{g_1}{\lvert g_1\rvert}=\operatorname{sign}(g_1)$.
**2.** Claim: the trajectories agree at every $t$, and the moments of the changed loss are $m_t^{(c)}=cm_t$, $v_t^{(c)}=c^2v_t$. At $t=0$ the starting points agree and all moments are 0. If it holds up to $t-1$, $x_{t-1}$ is the same, so the new gradient is $cg_t$ and
$$m_t^{(c)}=\beta_1cm_{t-1}+(1-\beta_1)cg_t=cm_t,\qquad v_t^{(c)}=c^2v_t.$$
The bias correction divides by the same constants, so $\frac{\hat m_t^{(c)}}{\sqrt{\hat v_t^{(c)}}}=\frac{c\hat m_t}{c\sqrt{\hat v_t}}=\frac{\hat m_t}{\sqrt{\hat v_t}}$ ($c\gt0$), and hence $x_t$ is the same too. $\blacksquare$ For SGD the step becomes $c\alpha g_t$, the same as multiplying the learning rate by $c$ — it is sensitive to the scale of the loss.
**3.** $\nabla f(x_0)=(1,100)$. SGD: $x_1=(1,1)-0.01(1,100)=(0.99,\ 0)$. Adam: $x_1=(1,1)-0.01(1,1)=(0.99,\ 0.99)$. The condition number of the Hessian $\diag(1,100)$ is 100, so SGD takes a step 100 times larger in the steep direction (the second component), and diverges in that direction if $\alpha\gt0.02$. Adam divides each component by its gradient size and moves about $\alpha$ in both directions — which is why adaptive learning rates mitigate a bad condition number.`,
        rubric: R`
- The sign form of the first step — 3 pts
- Induction (hypothesis, moments scaled by $c$, invariance of the ratio) — 4 pts; comparison with SGD — 1 pt
- The two first steps and the condition-number interpretation — 2 pts` },
    ],
  };
})();
