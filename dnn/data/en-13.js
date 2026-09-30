/* English text — 13 Descent Lemma & Convergence of Gradient Descent (W4 Wed slides 1–10, W4 Wed (2) notes, W5 Mon (1) notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    quadub: R`The first-order approximation at the point $x$ (dashed, the tangent) can be above or below $f$, but the parabola obtained by adding $\frac\beta2\lVert y-x\rVert^2$ covers $f$ **always from above**. One step of gradient descent is the same as moving to the minimizer $y=x-\frac1\beta\nabla f(x)$ of this parabola; the bottom of the parabola is $\frac1{2\beta}\lVert\nabla f(x)\rVert^2$ below $f(x)$, so $f$ goes down at least that much.`,
    sgdbound: R`The upper bound $\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$ on $\frac1T\sum\E\lVert\nabla f(x_t)\rVert^2$ for $f(x_0)-f^*=10$, $L=1$, $G=4$, $T=100$. With a small learning rate the first term (not getting far from the start) is large, and with a large one the second term (noise) is large. The sum is minimized at $\eta^*=\sqrt{\frac{2(f(x_0)-f^*)}{LGT}}\propto\frac1{\sqrt T}$, with minimum $2\sqrt{\frac{(f(x_0)-f^*)LG}{2T}}=O(1/\sqrt T)$.`,
  });
  EM.en.ch[13] = {
    title: 'Descent Lemma & Convergence of Gradient Descent',
    fig: R`A β-smooth function (bold line) lies below the quadratic upper bounds (thin parabolas) built at each point`,
    tagline: R`If $\nabla f$ is $\beta$-Lipschitz, $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. Put $y=x-\eta\nabla f$ into it, and $f$ always goes down when $\eta<2/\beta$.`,
    summary: R`We justify gradient descent $x_{t+1}=x_t-\eta\nabla f(x_t)$ with the first-order Taylor approximation (the direction opposite to the gradient is the steepest descent direction), and prove the **descent lemma** (Lemma 3.1) that makes this rigorous. The Week 4 Wednesday notes used the auxiliary function $g(t)=f(x+t(y-x))$, finding $g''$ by the chain rule (①), Taylor's formula with integral remainder (②), and the upper bound on the Hessian coming from $\beta$-smoothness (③); in the **Week 5 Monday notes**, ③ — $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert\Rightarrow-\beta I\preceq\nabla^2f\preceq\beta I$ — was proved with an integral representation. Putting one GD step into the lemma gives the decrease condition $\eta<2/\beta$, and replacing the gradient by a stochastic gradient gives the **stochastic gradient descent lemma**. The Week 5 notes added the tower property and a telescoping sum to show that SGD with variable step sizes converges as $\min_t\E\lVert\nabla f(x_t)\rVert^2=O(1/\sqrt T)$.`,
    goals: [
      R`Show with the first-order Taylor approximation and the Cauchy–Schwarz inequality that the steepest descent direction is $-\nabla f/\lVert\nabla f\rVert$`,
      R`Define $\beta$-smoothness and prove its relation to $-\beta I\preceq\nabla^2f\preceq\beta I$ for $C^2$ functions (with the integral representation of the Week 5 notes)`,
      R`Prove the descent lemma with $g(t)$, the chain rule, and Taylor's formula in integral form`,
      R`Derive the decrease inequality for one GD step and the convergence condition $\eta<2/\beta$`,
      R`Derive the stochastic gradient descent lemma, and show $\min_t\E\lVert\nabla f\rVert^2\le\frac{f(x_0)-f^*+\frac{LG}2\sum\eta_t^2}{\sum\eta_t}$ with the tower property and a telescoping sum`,
      R`Obtain $O(1/\sqrt T)$ with a fixed step size $\eta\propto1/\sqrt T$, and state what this analysis means for deep learning and its limits`,
    ],
    secTitles: { '13.1': 'Taylor intuition', '13.2': 'β-smoothness', '13.3': 'Descent lemma', '13.4': 'GD decrease condition', '13.5': 'Meaning for deep learning', '13.6': 'SGD lemma' },
    secs: {
      '13.1': { title: 'Gradient Descent and the Taylor Intuition', body: R`
:::idea In plain words
If you walked down a hill blindfolded, you would feel the slope under your feet and take a step **in the direction that goes down most steeply**. Mathematically, “the slope under your feet” is the gradient $\nabla f$, and the steepest way down is exactly opposite to it. This section confirms that intuition with the first-order Taylor approximation and the Cauchy–Schwarz inequality.
:::

Consider the unconstrained optimization problem $\min_{x\in\mathbb R^d}f(x)$, $f:\mathbb R^d\to\mathbb R$ (the objective function). Gradient descent starts from an initial point $x_0\in\mathbb R^d$ and, for $t=0,1,2,\dots$, computes
$$x_{t+1}=x_t-\eta\nabla f(x_t),\qquad \eta>0\ (\text{learning rate, step size})$$
repeating this update.

**Why this direction.** Near $x_t$, the first-order Taylor approximation[[@base:ch04:4.3|Multivariable Taylor expansion and the Hessian.]] is
$$f(x_{t+1})\approx f(x_t)+\langle\nabla f(x_t),\,x_{t+1}-x_t\rangle.$$
Writing the update as $x_{t+1}=x_t+\eta v$ ($\lVert v\rVert=1$, $\eta>0$ small) gives $f(x_{t+1})\approx f(x_t)+\eta\langle\nabla f(x_t),v\rangle$. To get $f(x_{t+1})\le f(x_t)$ as in the notes — that is, to make $f(x_{t+1})$ as small as possible — we must make the inner product $\langle\nabla f(x_t),v\rangle$ as negative as possible.

:::key The steepest descent direction
Among unit vectors $v$, the one minimizing $\langle\nabla f(x),v\rangle$ is
$$v=-\frac{\nabla f(x)}{\lVert\nabla f(x)\rVert},\qquad \min_{\lVert v\rVert=1}\langle\nabla f(x),v\rangle=-\lVert\nabla f(x)\rVert.$$
:::

The Cauchy–Schwarz inequality $\lvert\langle a,v\rangle\rvert\le\lVert a\rVert\lVert v\rVert$ gives $\langle\nabla f,v\rangle\ge-\lVert\nabla f\rVert$, with equality when $v$ points in the same direction as $-\nabla f$[[@em:ch08:9.7|The directional derivative $D_uf=u\cdot\nabla f$ is largest at $u=\nabla f/\lVert\nabla f\rVert$ and smallest in the opposite direction.]].

Substituting gives $x_{t+1}=x_t-\eta\dfrac{\nabla f(x_t)}{\lVert\nabla f(x_t)\rVert}$. Absorbing the normalizing factor into the learning rate, $\eta'=\eta/\lVert\nabla f(x_t)\rVert$, gives standard GD $x_{t+1}=x_t-\eta'\nabla f(x_t)$. The next sections make this intuition rigorous with Taylor's theorem.

:::ex Example 1 — The steepest direction
For $f(x,y)=x^2+3y^2$ at the point $(1,1)$, what is the steepest descent direction (a unit vector), and what is the first-order approximate decrease after moving $0.1$ in that direction?
---
$\nabla f=(2x,6y)=(2,6)$, $\lVert\nabla f\rVert=\sqrt{40}\approx6.32$. The direction is $v=-(2,6)/\sqrt{40}\approx(-0.316,-0.949)$. The first-order approximate decrease is $\eta\lVert\nabla f\rVert=0.1\times6.32=0.632$. Actual value: $f(1,1)=4$, $f(1-0.0316,\ 1-0.0949)\approx0.9377+2.4580=3.396$, a decrease of $0.604$ — almost the same as the first-order approximation, the difference being due to the curvature (the quadratic term).
:::

:::note The relation with Euler's method
GD is Euler's method with step $\eta$ applied to the gradient flow $\dot x=-\nabla f(x)$[[@em:ch01:1.2|Euler's method $y_{n+1}=y_n+hf(x_n,y_n)$.]].
:::
` },
      '13.2': { title: 'β-Smoothness', body: R`
:::idea In plain words
“Smooth” means that the gradient **does not change abruptly**. Moving a distance $\lVert x-y\rVert$ changes the gradient by at most $\beta\lVert x-y\rVert$. In one variable this says “the absolute value of the second derivative (the curvature) is at most $\beta$”, and with an upper bound on the curvature we can compute how large a step is safe.
:::

:::def β-smoothness (L-smooth)
If $f:\mathbb R^d\to\mathbb R$ is continuously differentiable and its gradient is $\beta$-Lipschitz continuous, i.e.,
$$\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert\qquad\forall x,y\in\mathbb R^d,$$
$f$ is called **$\beta$-smooth** (from slide 8 on, the same constant is written $L$).
:::

It is the condition that the gradient does not change too fast. Think of it as an upper bound on the curvature.[[@base:ch05:5.1|The Lipschitz condition: here it is imposed on the gradient, not on the function.]]

:::key β-smoothness and the Hessian
If $f\in C^2$,
$$\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert\ \ \forall x,y\iff -\beta I\preceq\nabla^2f(x)\preceq\beta I\ \ \forall x.$$
In particular $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ for every $v$ (notes: this is the same statement as $\nabla^2f(x)\preceq\beta I$).
:::

The notation $A\preceq B$ means that $B-A$ is positive semidefinite, i.e., $v^TAv\le v^TBv$ for every $v$. Hence $\nabla^2f(x)\preceq\beta I\iff v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall v$).

### Week 5 notes: the proof of (⇒)

On Week 5 Monday, ③, which had been postponed to “next time” in Week 4, was proved with an integral representation.

:::hand Class notes — bounding the Hessian with an integral representation
**(★) The difference of gradients as an integral.** Let $\phi(t):=\nabla f(x+t(y-x))$, $t\in[0,1]$; then $\phi(0)=\nabla f(x)$, $\phi(1)=\nabla f(y)$, and by the chain rule
$$\phi'(t)=\nabla^2f(x+t(y-x))\,(y-x)\qquad(d\times d\ \text{matrix}\times d\times1).$$
By the fundamental theorem of calculus (componentwise),
$$\begin{aligned}\nabla f(y)-\nabla f(x)&=\phi(1)-\phi(0)=\int_0^1\phi'(t)\,dt\\&=\Big(\int_0^1\nabla^2f(x+t(y-x))\,dt\Big)(y-x).\end{aligned}$$

**Taking the inner product.** Taking the inner product of both sides with $(y-x)$,
$$\langle\nabla f(y)-\nabla f(x),\,y-x\rangle=(y-x)^T\Big(\int_0^1\nabla^2f(x+t(y-x))\,dt\Big)(y-x).$$
By Cauchy–Schwarz and the Lipschitz condition, the left side is $\le\lVert\nabla f(y)-\nabla f(x)\rVert\,\lVert y-x\rVert\le\beta\lVert y-x\rVert^2$.

**Let $y=x+hv$.** For any $v\in\mathbb R^d$ and small $h>0$, $y-x=hv$, so
$$h^2\,v^T\Big(\int_0^1\nabla^2f(x+thv)\,dt\Big)v\le\beta h^2\lVert v\rVert^2.$$
Dividing by $h^2$, $v^T\big(\int_0^1\nabla^2f(x+thv)dt\big)v\le\beta\lVert v\rVert^2$.

**$h\to0$.** Since $f\in C^2$, $\nabla^2f$ is continuous, so $\int_0^1\nabla^2f(x+thv)dt\to\nabla^2f(x)$. Hence $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$, i.e., $\nabla^2f(x)\preceq\beta I$.

**Similarly (D.I.Y.)** the other side of Cauchy–Schwarz, $\langle\nabla f(y)-\nabla f(x),y-x\rangle\ge-\lVert\nabla f(y)-\nabla f(x)\rVert\lVert y-x\rVert\ge-\beta\lVert y-x\rVert^2$, gives $-\beta I\preceq\nabla^2f(x)$.
:::

**A little more on the limit.** $\big\lvert v^T\big(\int_0^1\nabla^2f(x+thv)dt-\nabla^2f(x)\big)v\big\rvert\le\lVert v\rVert^2\sup_{t\in[0,1]}\lVert\nabla^2f(x+thv)-\nabla^2f(x)\rVert$, and by continuity the right side goes to 0 as $h\to0$.

**Proof of (⇐).** From the same representation (★), $\lVert\nabla f(y)-\nabla f(x)\rVert\le\int_0^1\lVert\nabla^2f(x+t(y-x))\rVert_2\,dt\,\lVert y-x\rVert$. If a symmetric matrix satisfies $-\beta I\preceq H\preceq\beta I$, all its eigenvalues lie in $[-\beta,\beta]$, so $\lVert H\rVert_2=\max\lvert\lambda_i\rvert\le\beta$. Hence $\lVert\nabla f(y)-\nabla f(x)\rVert\le\beta\lVert y-x\rVert$.

Another proof from the Week 4 notes (writing the Hessian–vector product as a limit of differences of gradients) is also on the proof page: $\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s$, and the norm of the numerator is at most $\beta s\lVert v\rVert$, so $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$ and, by Cauchy–Schwarz, $\lvert v^T\nabla^2f(x)v\rvert\le\beta\lVert v\rVert^2$.

:::ex Example 2 — A quadratic function
What is the smoothness constant of $f(x)=\frac12x^TAx$ ($A$ symmetric)?
---
$\nabla f=Ax$, so $\lVert\nabla f(x)-\nabla f(y)\rVert=\lVert A(x-y)\rVert\le\lVert A\rVert_2\lVert x-y\rVert$. The smallest constant is $\beta=\lVert A\rVert_2=\max_i\lvert\lambda_i(A)\rvert$ (the largest absolute eigenvalue)[[@em:ch07:8.3|A symmetric matrix has real eigenvalues and orthogonal eigenvectors.]]. Example: if $A=\diag(1,10)$, $\beta=10$.
:::

:::ex Example 3 — Functions that are not smooth
Are $f(x)=\lvert x\rvert$ and $f(x)=x^4$ ($x\in\mathbb R$) $\beta$-smooth?
---
$\lvert x\rvert$: not differentiable at 0 (the gradient jumps from $-1$ to $+1$), so no. $x^4$: $f''=12x^2$ is unbounded, so it is not smooth on all of $\mathbb R$ for any $\beta$, but restricted to $\lvert x\rvert\le R$ it is, with $\beta=12R^2$. These two examples contain the typical reasons deep learning losses are “not globally smooth” (the kink of ReLU, and curvature that grows as the weights grow).
:::
` },
      '13.3': { title: 'The Descent Lemma and Its Proof', body: R`
:::idea In plain words
If we know that the curvature is at most $\beta$, then the function is guaranteed to lie **below the parabola** “tangent + $\frac\beta2(\text{distance})^2$” drawn at the current position. The parabola can be minimized by hand, so the function goes down at least as much as the parabola does.
:::

:::key Descent lemma (Lemma 3.1)
If $f:\mathbb R^d\to\mathbb R$ is continuously differentiable and $\nabla f$ is $\beta$-Lipschitz, then
$$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2\qquad\forall x,y.$$
:::

$f$ lies below the **quadratic upper bound** built at each point (figure below)[[@ml:ch09:12.1c|The same inequality proved with an integral, from which the self-bounding property ‖∇f‖² ≤ 2βf of nonnegative functions follows.]]. It means that the error of the first-order approximation does not exceed $\frac\beta2\lVert y-x\rVert^2$.

:::fig quadub
:::

:::hand Class notes — proof (assuming f ∈ C²)
Define the auxiliary function $g(t)=f(x+t(y-x))$, $t\in\mathbb R$.

**① Chain rule.**
$$g'(t)=\langle\nabla f(x+t(y-x)),\,y-x\rangle,$$
$$g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x).$$

**② Taylor's formula with integral remainder.**
$$g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)\,ds.$$
Since $g(0)=f(x)$, $g(1)=f(x+y-x)=f(y)$, and $g'(0)=\langle\nabla f(x),y-x\rangle$,
$$\begin{aligned}f(y)=f(x)&+\langle\nabla f(x),y-x\rangle\\&+\int_0^1(1-s)(y-x)^T\nabla^2f(x+s(y-x))(y-x)\,ds.\qquad(*)\end{aligned}$$

**③ β-smoothness.** Since $v^T\nabla^2fv\le\beta\lVert v\rVert^2$ for every $v$,
$$\begin{aligned}&\int_0^1(1-s)(y-x)^T\nabla^2f(\cdot)(y-x)\,ds\\&\qquad\le\int_0^1(1-s)\beta\lVert y-x\rVert^2ds=\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2.\end{aligned}$$
Putting this into $(*)$ gives $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. ∎
:::

**The justification of ① (notes).** $p=y-x\in\mathbb R^{n\times1}$ (a column vector), $z(t)=x+tp$, $z'(t)=p$. Since $g(t)=f(z(t))$, $g'(t)=Df(z(t))\,z'(t)$ with $Df(z)=\nabla f(z)^T\in\mathbb R^{1\times n}$ (a row vector). Hence $g'(t)=\nabla f(z(t))^Tp=p^T\nabla f(z(t))$ ($1\times n$ times $n\times1$). Differentiating again, the derivative of $\nabla f:\mathbb R^n\to\mathbb R^n$ is the Hessian $D(\nabla f(z))=\nabla^2f(z)$ ($n\times n$), so $\frac d{dt}\nabla f(z(t))=\nabla^2f(z(t))z'(t)$, i.e., $g''(t)=p^T\nabla^2f(z(t))p$ — a $1\times1$ scalar.

**The justification of ② (notes, D.I.Y.).** By the fundamental theorem of calculus, $g(1)=g(0)+\int_0^1g'(s)ds$. Integrate by parts with $u=g'(s)$, $dv=ds$, choosing $v=-(1-s)$:
$$\int_0^1g'(s)ds=\big[-(1-s)g'(s)\big]_0^1+\int_0^1(1-s)g''(s)ds=g'(0)+\int_0^1(1-s)g''(s)ds.$$
(Setting “$u=1-s$, $v'=g''(s)$” as in the notes gives the same formula.)[[@base:ch02:2.2|Integration by parts.]]

**Why $1-s\ge0$ matters in ③.** Only by multiplying both sides of $g''(s)\le\beta\lVert y-x\rVert^2$ by the **nonnegative** $1-s$ is the direction of the inequality preserved, and it is still preserved after integrating.

:::tip A proof without the Hessian
Assuming only $f\in C^1$ suffices: $f(y)-f(x)-\langle\nabla f(x),y-x\rangle=\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\rangle dt\le\int_0^1\beta t\lVert y-x\rVert^2dt=\frac\beta2\lVert y-x\rVert^2$ (Cauchy–Schwarz and the Lipschitz condition). The theorem on the slide is stated under this assumption ($C^1$).
:::

:::ex Example 4 — Computing the upper bound
With $\beta=4$, $f(x)=3$, $\nabla f(x)=(1,-2)$, what is the upper bound on $f(y)$ at $y=x+(1,1)$, and at $y=x-\frac14\nabla f(x)$?
---
$y-x=(1,1)$: $3+(1-2)+\frac42\cdot2=6$. $y-x=-\frac14(1,-2)$: $3-\frac14\lVert\nabla f\rVert^2+\frac42\cdot\frac1{16}\lVert\nabla f\rVert^2=3-\frac54+\frac58=2.375$. Moving $\frac1\beta$ against the gradient lowers the bound to $f(x)-\frac1{2\beta}\lVert\nabla f\rVert^2=3-\frac58$.
:::
` },
      '13.4': { title: 'The Decrease in One Step of Gradient Descent', body: R`
:::idea In plain words
Plugging “the step actually taken”, $-\eta\nabla f$, into the parabola of the descent lemma guarantees a decrease of at least $(\eta-\frac\beta2\eta^2)\lVert\nabla f\rVert^2$ per step. For the bracket to be positive, $\eta<2/\beta$. Unless the step is too large for the curvature, the function **always** goes down.
:::

Put one GD step $y=x_{t+1}=x_t-\eta\nabla f(x_t)$, $x=x_t$ into the descent lemma.
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),x_{t+1}-x_t\rangle+\frac\beta2\lVert x_{t+1}-x_t\rVert^2\\&=f(x_t)+\langle\nabla f(x_t),-\eta\nabla f(x_t)\rangle+\frac\beta2\lVert-\eta\nabla f(x_t)\rVert^2\\&=f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2.\end{aligned}$$

:::key The decrease condition of gradient descent
$$f(x_{t+1})\le f(x_t)-\Big(\eta-\frac{\beta\eta^2}2\Big)\lVert\nabla f(x_t)\rVert^2$$
If $\eta-\frac{\beta\eta^2}2>0\iff0<\eta<\frac2\beta$, then $f(x_{t+1})\le f(x_t)$ (a strict decrease if the gradient is not 0). The guaranteed decrease is largest at $\eta=\frac1\beta$, namely $\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$.
:::

That is, **if the step size is small enough, GD always decreases the value of a smooth function.**

**The convergence rate (supplement).** With $\eta=1/\beta$, summing over $t=0,\dots,T-1$ gives a telescoping sum,
$$\frac1{2\beta}\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert^2\le f(x_0)-f(x_T)\le f(x_0)-f^*,$$
$$\min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta\big(f(x_0)-f^*\big)}T.$$
Even without convexity, the gradient approaches 0 at the rate $O(1/\sqrt T)$ (convergence to a stationary point; no guarantee of a global minimum).

**What telescoping means.** $\sum_{t=0}^{T-1}\big(f(x_t)-f(x_{t+1})\big)=f(x_0)-f(x_1)+f(x_1)-f(x_2)+\cdots=f(x_0)-f(x_T)$ — all the middle terms cancel. And if $f^*=\inf f$, then $f(x_T)\ge f^*$.

:::ex Example 5 — The limit for a quadratic
Applying GD to $f(x)=\frac\beta2x^2$ ($x\in\mathbb R$) gives $x_{t+1}=(1-\eta\beta)x_t$. When does it converge?
---
$\lvert1-\eta\beta\rvert<1\iff0<\eta<2/\beta$. With $\eta=2/\beta$, $x_{t+1}=-x_t$ oscillates in place, and anything larger diverges. The lemma's condition $\eta<2/\beta$ is **exactly** the best possible in this case.
:::

### A stronger conclusion under convexity (mentioned in the Week 5 notes)

The Week 5 notes said that “$f(x_{t+1})-f(x^*)$ and $x_{t+1}\to x^*$ are topics of **convex optimization**” and introduced Bubeck's book (Convex Optimization: Algorithms and Complexity). In short: if $f$ is convex and $\beta$-smooth, GD with $\eta=1/\beta$ satisfies
$$f(x_T)-f(x^*)\le\frac{\beta\lVert x_0-x^*\rVert^2}{2T},$$
so the function value itself approaches the minimum at $O(1/T)$, and under strong convexity ($\nabla^2f\succeq\mu I$) it converges **geometrically**, like $\big(1-\frac\mu\beta\big)^T$. Here $\beta/\mu$ is the condition number, and that a large condition number slows things down is the starting point of momentum and Adam in Unit 14[[ch14:14.1|On a quadratic with a large condition number, GD oscillates in the narrow direction and moves slowly in the wide one.]].
` },
      '13.5': { title: 'What It Means for Deep Learning', body: R`
:::idea In plain words
These proofs rely on the assumption “the curvature is at most $\beta$ everywhere”, which real neural network losses do not satisfy. Still, such analyses give a **feel** like “if the curvature is large, reduce the learning rate” and “if the noise is large, reduce the learning rate”. Theory is not a warranty but a compass.
:::

For deep learning losses, the condition “$\nabla f$ is $L$-Lipschitz” **usually does not hold** (e.g., ReLU has non-differentiable points, and the curvature grows as the weights grow). The purpose of such mathematical analysis is to gain **qualitative insight**; these convergence proofs are meant to provide you with intuition on the training dynamics of GD and SGD.

Because deep learning systems are hard to analyze rigorously as they are, we usually either
- analyze a simplified setting **rigorously**, or
- analyze the full setting **heuristically**.

Either way, the goal is qualitative insight rather than theoretical guarantees. For example, conclusions like “if the curvature ($\beta$) is large, the learning rate must be small” and “if BN smooths the loss landscape, a larger learning rate can be used”[[ch12:12.5|The alternative explanation of BN: a smoother loss landscape.]].

### Going deeper: the edge of stability

Recent research observed that when neural networks are trained with GD, the largest eigenvalue of the Hessian (the local $\beta$) **rises by itself to around $2/\eta$ and stays there** during training (the edge of stability). Rather than the condition $\eta<2/\beta$ of Section 13.4 being “respected”, training walks a tightrope at the boundary and the loss goes down non-monotonically. It is an example not of the simplified theory being wrong, but of the boundary it points to playing an important role in actual training.
` },
      '13.6': { title: 'The Stochastic Gradient Descent Lemma', body: R`
:::idea In plain words
SGD walks with a noisy gradient that is “right on average” instead of the exact gradient. So a **noise term** $\frac L2\eta^2\E\lVert\tilde\nabla f\rVert^2$ is added to the guaranteed decrease per step. Shrinking the step shrinks the noise term quickly, as $\eta^2$, and the progress slowly, as $\eta$, so with a suitably small learning rate the function goes down on average. The more steps we take (larger $T$), reducing the learning rate as $1/\sqrt T$ makes the gradient converge to 0.
:::

SGD is $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, where $\tilde\nabla f(x_t)$ is an unbiased estimator, $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$. Notation: $\E_t[\cdot]=\E[\cdot\mid x_t]$.

Putting $y=x_{t+1}$, $x=x_t$ into the quadratic upper bound of an $L$-smooth $f$, $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac L2\lVert x-y\rVert_2^2$, exactly as before,
$$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert_2^2.$$
Taking the conditional expectation and using unbiasedness gives the following.

:::key The stochastic gradient descent lemma
If $f$ is $L$-smooth and $\eta>0$ is an arbitrary step size, two consecutive iterates of SGD satisfy
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert_2^2+\frac L2\eta^2\,\E_t\big[\lVert\tilde\nabla f(x_t)\rVert_2^2\big].$$
If $\E_t[\lVert\tilde\nabla f(x_t)\rVert^2]\le G$ ($\forall t$), then
$$\lVert\nabla f(x_t)\rVert_2^2\le\frac1\eta\E_t\big[f(x_t)-f(x_{t+1})\big]+\frac L2\eta G,$$
$$\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert_2^2\le\frac1\eta\Big(\sum_{t=0}^{T-1}\E_t\big[f(x_t)-f(x_{t+1})\big]\Big)+\frac L2\eta GT.$$
:::

- The slide calls $\E_t\lVert\tilde\nabla f\rVert^2$ “the variance of the stochastic gradient”, but precisely it is the **second moment**: $\E_t\lVert\tilde\nabla f\rVert^2=\lVert\nabla f\rVert^2+\E_t\lVert\tilde\nabla f-\nabla f\rVert^2$ (bias² + variance). Substituting gives $\E_tf(x_{t+1})\le f(x_t)-\eta(1-\frac{L\eta}2)\lVert\nabla f\rVert^2+\frac{L\eta^2}2\Var_t$, and with zero variance it returns to the GD inequality of Section 13.4.
- As with exact GD, if $\eta$ is small enough a decrease is guaranteed **in expectation**, and the threshold is **inversely proportional** to the variance of the estimator. Enlarging the minibatch shrinks the variance by $\frac1B$[[ch10:10.2|The variance of an i.i.d. minibatch gradient is $\Sigma/B$.]], allowing a larger learning rate.
- Dividing the summed inequality by $T$ bounds the average squared gradient by $\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$. With a fixed $\eta$, the second term keeps it from going to 0, and it stays at a **noise floor**. With $\eta\propto1/\sqrt T$ it decreases as $O(1/\sqrt T)$ — the theoretical reason learning rate decay schedules are needed.

### Week 5 notes: the convergence proof of SGD with variable step sizes

On Week 5 Monday, the case of a finite-sum problem with varying step sizes $\eta_t$ was proved from start to finish.

:::hand Class notes — the setting and three assumptions
$\min_{x\in\mathbb R^d}f(x)$, $f(x)=\frac1n\sum_{i=1}^nf_i(x)$. SGD is $x_{t+1}=x_t-\eta_tg_t$, $g_t:=\nabla f_{i_t}(x_t)$, $i_t\sim\mathrm{Unif}\{1,\dots,n\}$.
① $L$-smoothness: $f(x)\le f(y)+\langle\nabla f(y),x-y\rangle+\frac L2\lVert x-y\rVert^2$
② Unbiasedness: $\E[g_t\mid x_t]=\nabla f(x_t)$
③ A uniform bound on the second moment: $\E[\lVert g_t\rVert^2\mid x_t]\le G$ (a bound that controls the quadratic term)
:::

:::hand Class notes — one step (Eq. 4)
Putting $y=x_t$, $x=x_{t+1}=x_t-\eta_tg_t$ into ①,
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),-\eta_tg_t\rangle+\frac L2\lVert\eta_tg_t\rVert^2\\&=f(x_t)-\eta_t\langle\nabla f(x_t),g_t\rangle+\frac{L\eta_t^2}2\lVert g_t\rVert^2.\end{aligned}$$
Taking $\E_t=\E[\cdot\mid x_t]$, ② gives $\E_t\langle\nabla f(x_t),g_t\rangle=\lVert\nabla f(x_t)\rVert^2$, so
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2\E_t\big[\lVert g_t\rVert^2\big].\qquad(4)$$
:::

:::hand Class notes — the tower property and telescoping (Eqs. 5, 6)
Apply ③ to (4) and take the full expectation. **Tower property**: if $\E_t[\cdot]=\E[\cdot\mid x_t]$, then $\E\big[\E_t[Z]\big]=\E[Z]$. Hence
$$\E[f(x_{t+1})]\le\E[f(x_t)]-\eta_t\E\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G,$$
which rearranges to $\eta_t\E\lVert\nabla f(x_t)\rVert^2\le\E[f(x_t)]-\E[f(x_{t+1})]+\frac L2\eta_t^2G$. Summing over $t=1,\dots,T$, the right side telescopes:
$$\begin{aligned}\sum_{t=1}^T\eta_t\E\lVert\nabla f(x_t)\rVert^2&\le f(x_1)-\E[f(x_{T+1})]+\frac L2G\sum_{t=1}^T\eta_t^2\\&\le f(x_1)-f_*+\frac L2G\sum_{t=1}^T\eta_t^2.\qquad(6)\end{aligned}$$
($f_*$ is the minimum value, and $\E f(x_{T+1})\ge f_*$.)
:::

:::key Convergence of SGD with variable step sizes
Under the three assumptions above,
$$\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2\ \le\ \frac{f(x_1)-f_*}{\sum_{t=1}^T\eta_t}+\frac{LG}2\cdot\frac{\sum_{t=1}^T\eta_t^2}{\sum_{t=1}^T\eta_t}.$$
With $\eta_t=\eta$ (fixed) it is $\le\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$, and with $\eta=c/\sqrt T$ it is $O(1/\sqrt T)$.
:::

**From (6) to the conclusion.** A weighted average is at least the minimum, so $\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\ge\big(\min_t\E\lVert\nabla f(x_t)\rVert^2\big)\sum_t\eta_t$ (notes: “Note that”). Dividing both sides of (6) by $\sum\eta_t>0$ gives the formula above. With a fixed step size, $\sum\eta_t=T\eta$ and $\sum\eta_t^2=T\eta^2$, so it is $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$ — the notes' “$\lesssim\frac1{\eta T}+\eta$”. Balancing the two terms gives $\eta\sim1/\sqrt T$ and the result $\lesssim\frac1{\sqrt T}$.

**The version on slides 10–11.** Writing the same thing with $t=0,\dots,T-1$ and fixed $\eta$ gives $\frac1T\sum_{t=0}^{T-1}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f_*}{\eta T}+\frac L2\eta G$, and choosing $\eta\approx\frac1{\sqrt T}$ gives $\E\lVert\nabla f(x_t)\rVert^2\approx\frac1{\sqrt T}$ at least once within $T$ steps — the gradient norm converges **regardless** of the (bounded) variance of the estimator.

:::fig sgdbound
:::

:::ex Example 6 — Computing the guarantee numerically
With $f(x_1)-f_*=10$, $L=1$, $G=4$, $T=10000$, what are the guarantees for the fixed step sizes $\eta=0.01$ and $\eta=0.1$, and what is the optimal fixed step size?
---
Guarantee $=\frac{10}{\eta\cdot10^4}+2\eta$. $\eta=0.01$: $0.1+0.02=0.12$. $\eta=0.1$: $0.01+0.2=0.21$. The optimum is $\eta^*=\sqrt{\frac{10}{2\cdot10^4}}\approx0.0224$, with guarantee $2\sqrt{\frac{10\cdot2}{10^4}}\approx0.089$. Increasing $T$ by a factor of 100 reduces the guarantee by a factor of 10 ($\sqrt{100}$).
:::

:::warn What converges
This result says that there is an iterate with a small **gradient norm** (near a stationary point), not that we reach the global minimum. And it is a guarantee not for “the last iterate” but for “the best of the $T$” (or one chosen at random). Under convexity, convergence of the function value itself can be shown (end of Section 13.4).
:::
` },
    },
    probs: [
      // u13
      { q: R`If $\nabla f(x)=(3,4)$, which unit vector $v$ minimizes $\langle\nabla f(x),v\rangle$?`,
        choices: [R`$(0.6,0.8)$`, R`$(-0.6,-0.8)$`, R`$(0.8,-0.6)$`, R`$(-1,0)$`],
        sol: R`$-\nabla f/\lVert\nabla f\rVert=-(3,4)/5$. The minimum is $-5$. $(0.8,-0.6)$ is orthogonal to the gradient, so the first-order change is 0.` },
      { q: R`For $f(x,y)=x^2+3y^2$ at the point $(1,1)$ with $\eta=0.1$, what is the $y$-coordinate after one GD step?`,
        sol: R`$\nabla f=(2x,6y)=(2,6)$. $y\leftarrow1-0.1\times6=0.4$ ($x\leftarrow0.8$).` },
      { q: R`What is the smoothness constant $\beta$ (the smallest value) of $f(x)=\frac12x^TAx$, $A=\begin{pmatrix}2&0\\0&8\end{pmatrix}$?`,
        sol: R`$\beta=\lVert A\rVert_2=\max\lvert\lambda_i\rvert=8$.` },
      { q: R`When GD is applied to the function above, what is the upper bound $2/\beta$ on the learning rate for which a decrease is guaranteed?`,
        sol: R`$2/8=0.25$. The direction of largest curvature (eigenvalue 8) limits the learning rate.` },
      { q: R`For $f\in C^2$, which is the same statement as “$v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall v$)”?`,
        choices: [R`$\nabla^2f(x)\succeq\beta I$`, R`$\nabla^2f(x)\preceq\beta I$`, R`$\nabla^2f(x)=\beta I$`, R`$\det\nabla^2f(x)\le\beta$`],
        sol: R`$v^T(\beta I-\nabla^2f)v\ge0$, i.e., $\beta I-\nabla^2f\succeq0$ (the note in the notes).` },
      { q: R`In the proof of the descent lemma, what is the second derivative of $g(t)=f(x+t(y-x))$?`,
        choices: [R`$\nabla^2f(x+t(y-x))$`, R`$(y-x)^T\nabla^2f(x+t(y-x))(y-x)$`, R`$\lVert y-x\rVert^2$`, R`$\langle\nabla f(x),y-x\rangle$`],
        sol: R`$g'(t)=p^T\nabla f(z(t))$, $g''(t)=p^T\nabla^2f(z(t))p$, $p=y-x$. It must be a scalar ($1\times1$).` },
      { q: R`What is the value of $\int_0^1(1-s)\,ds$, which appears in the proof?`,
        sol: R`$[s-s^2/2]_0^1=\tfrac12$. That is why the constant is $\frac\beta2$.` },
      { q: R`For a $\beta$-smooth $f$ with $f(x)=3$, $\nabla f(x)=(1,-2)$, and $\beta=4$, what upper bound on $f(y)$ at $y=x+(1,1)$ does the descent lemma give?`,
        sol: R`$3+\langle(1,-2),(1,1)\rangle+\frac42\lVert(1,1)\rVert^2=3-1+2\cdot2=6$.` },
      { q: R`With $\beta=10$, $\lVert\nabla f(x_t)\rVert^2=4$, and $\eta=0.05$, what is the lower bound $(\eta-\beta\eta^2/2)\lVert\nabla f\rVert^2$ on the decrease after one GD step?`,
        sol: R`$0.05-10(0.0025)/2=0.05-0.0125=0.0375$, $\times4=0.15$.` },
      { q: R`Which $\eta$ maximizes the lower bound on the decrease $(\eta-\beta\eta^2/2)\lVert\nabla f\rVert^2$ ($\beta=10$)?`,
        sol: R`$\frac d{d\eta}(\eta-\frac\beta2\eta^2)=1-\beta\eta=0$ gives $\eta=1/\beta$. The decrease is then $\frac1{2\beta}\lVert\nabla f\rVert^2$.` },
      { q: R`When GD is applied to $f(x)=\frac\beta2x^2$ with $\eta=2/\beta$, what happens?`,
        choices: [R`It reaches the minimizer in one step`, R`It oscillates as $x_{t+1}=-x_t$ and does not converge`, R`It diverges`, R`$x_t$ decreases monotonically`],
        sol: R`$x_{t+1}=(1-\eta\beta)x_t=-x_t$. With $\eta=1/\beta$ it reaches 0 in one step.` },
      { q: R`With $\beta=2$ and $f(x_0)-f^*=10$, running GD with $\eta=1/\beta$ for $T=100$ steps, what is the upper bound on $\min_t\lVert\nabla f(x_t)\rVert^2$?`,
        sol: R`$2\beta(f(x_0)-f^*)/T=2\cdot2\cdot10/100=0.4$.` },
      { q: R`In deriving the stochastic gradient descent lemma, what justifies $\E_t[\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle]=\lVert\nabla f(x_t)\rVert^2$?`,
        choices: [R`$\tilde\nabla f$ is deterministic`, R`Given $x_t$, $\nabla f(x_t)$ is a constant and $\E_t\tilde\nabla f(x_t)=\nabla f(x_t)$ (unbiasedness)`, R`$L$-smoothness`, R`Cauchy–Schwarz`],
        sol: R`Pull the constant out of the conditional expectation and use unbiasedness.` },
      { q: R`What does the summed inequality for SGD with a fixed learning rate $\eta$, $\frac1T\sum\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f^*}{\eta T}+\frac L2\eta G$, tell us?`,
        choices: [R`As $T\to\infty$, the average squared gradient goes to 0`, R`Even as $T\to\infty$, a noise floor $\frac L2\eta G$ remains — learning rate decay is needed`, R`The larger $G$, the better`, R`The larger $\eta$, always the better`],
        sol: R`The second term does not depend on $T$. Reducing $\eta\propto1/\sqrt T$ makes both terms $O(1/\sqrt T)$.` },
      { q: R`For $f\in C^2$, prove that if $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$ ($\forall x,y$), then $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ for all $x,v$. (Step ③, postponed to “next time” in class)`,
        sol: R`
Fix $x,v$ and consider $\nabla f(x+sv)-\nabla f(x)$ for $s\ne0$. Since $\nabla f$ is $C^1$,
$$\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s.$$
By the Lipschitz condition, $\Big\lVert\frac{\nabla f(x+sv)-\nabla f(x)}s\Big\rVert\le\frac{\beta\lVert sv\rVert}{\lvert s\rvert}=\beta\lVert v\rVert$. The norm is continuous, so in the limit $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$.
By Cauchy–Schwarz, $v^T\nabla^2f(x)v\le\lVert v\rVert\,\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert^2$. (The same method gives $\ge-\beta\lVert v\rVert^2$, so $-\beta I\preceq\nabla^2f\preceq\beta I$.)`,
        rubric: R`
- Expressing the Hessian–vector product as a limit of differences of gradients — 4 pts
- Bounding the norm with the Lipschitz condition — 3 pts
- Bounding the quadratic form with Cauchy–Schwarz — 3 pts` },
      { q: R`Prove the descent lemma $f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2$. (Assuming $f\in C^2$ and $\nabla^2f\preceq\beta I$, or only $C^1$ and the Lipschitz condition)`,
        sol: R`
**($C^2$ proof, notes)** $g(t)=f(x+t(y-x))$. By the chain rule, $g'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$ and $g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x)$.
Integrating $g(1)=g(0)+\int_0^1g'(s)ds$ by parts ($dv=ds$, $v=-(1-s)$) gives $g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)ds$.
Since $g''(s)\le\beta\lVert y-x\rVert^2$ and $1-s\ge0$, the integral is $\le\beta\lVert y-x\rVert^2\int_0^1(1-s)ds=\frac\beta2\lVert y-x\rVert^2$. Substituting $g(0)=f(x)$, $g(1)=f(y)$, $g'(0)=\langle\nabla f(x),y-x\rangle$ gives the result.

**($C^1$ proof)** Subtracting $\langle\nabla f(x),y-x\rangle$ from $f(y)-f(x)=\int_0^1\langle\nabla f(x+t(y-x)),y-x\rangle dt$ gives
$$\int_0^1\langle\nabla f(x+t(y-x))-\nabla f(x),y-x\rangle dt\le\int_0^1\beta t\lVert y-x\rVert\cdot\lVert y-x\rVert dt=\frac\beta2\lVert y-x\rVert^2.$$`,
        rubric: R`
- The auxiliary function and $g'$, $g''$ (or the integral representation) — 3 pts
- Taylor's formula in integral form (integration by parts) — 3 pts
- The curvature bound and $\int(1-s)=\frac12$ — 3 pts
- Conclusion — 1 pt` },
      { q: R`If $f$ is $L$-smooth, $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, and $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$, derive the stochastic gradient descent lemma, and show that if $\E_t\lVert\tilde\nabla f\rVert^2\le G$, then $\sum_{t=0}^{T-1}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT$ ($f^*=\inf f$).`,
        sol: R`
Descent lemma ($y=x_{t+1}$, $x=x_t$): $f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert^2$.
Taking $\E_t$, functions of $x_t$ are constants and $\E_t\langle\nabla f(x_t),\tilde\nabla f\rangle=\langle\nabla f(x_t),\E_t\tilde\nabla f\rangle=\lVert\nabla f(x_t)\rVert^2$:
$$\E_tf(x_{t+1})\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac L2\eta^2\E_t\lVert\tilde\nabla f\rVert^2\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac L2\eta^2G.$$
Rearranging: $\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\big(f(x_t)-\E_tf(x_{t+1})\big)+\frac L2\eta G$.
Taking the full expectation (tower property $\E[\E_t[\cdot]]=\E[\cdot]$) and summing over $t=0..T-1$ telescopes:
$$\sum_t\E\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\big(f(x_0)-\E f(x_T)\big)+\frac L2\eta GT\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT.$$`,
        rubric: R`
- Applying the descent lemma — 2 pts
- Conditional expectation and unbiasedness — 3 pts
- The bound $G$ and rearranging — 2 pts
- The tower property and telescoping — 3 pts` },
      // more-13
      { q: R`For $f\in C^2$ with $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$ ($\forall x,y$), prove $-\beta I\preceq\nabla^2f(x)\preceq\beta I$ ($\forall x$) using the integral representation $\nabla f(y)-\nabla f(x)=\big(\int_0^1\nabla^2f(x+t(y-x))dt\big)(y-x)$. (Week 5 notes)`,
        sol: R`
**The integral representation.** If $\phi(t)=\nabla f(x+t(y-x))$, then $\phi'(t)=\nabla^2f(x+t(y-x))(y-x)$ (chain rule). By the fundamental theorem of calculus, $\nabla f(y)-\nabla f(x)=\int_0^1\phi'(t)dt=\big(\int_0^1\nabla^2f(x+t(y-x))dt\big)(y-x)$.
**Inner product.** Taking the inner product with $(y-x)$ gives $\langle\nabla f(y)-\nabla f(x),y-x\rangle=(y-x)^TH(x,y)(y-x)$, $H(x,y)=\int_0^1\nabla^2f(x+t(y-x))dt$. By Cauchy–Schwarz and the Lipschitz condition, the left side lies in $[-\beta\lVert y-x\rVert^2,\ \beta\lVert y-x\rVert^2]$.
**$y=x+hv$.** $h^2v^TH(x,x+hv)v\in[-\beta h^2\lVert v\rVert^2,\ \beta h^2\lVert v\rVert^2]$. Divide by $h^2$ and let $h\to0$: since $\nabla^2f$ is continuous, $H(x,x+hv)\to\nabla^2f(x)$. Hence $-\beta\lVert v\rVert^2\le v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall v$), i.e., $-\beta I\preceq\nabla^2f(x)\preceq\beta I$.`,
        rubric: R`
- The integral representation (chain rule + fundamental theorem) — 3 pts
- Both bounds from the inner product, Cauchy–Schwarz, and Lipschitz — 3 pts
- $y=x+hv$ and dividing by $h^2$ — 2 pts
- The limit by continuity — 2 pts` },
      { q: R`Conversely, show that if $f\in C^2$ and $-\beta I\preceq\nabla^2f(x)\preceq\beta I$ at every $x$, then $\nabla f$ is $\beta$-Lipschitz.`,
        sol: R`
From the integral representation, $\lVert\nabla f(y)-\nabla f(x)\rVert=\Big\lVert\int_0^1\nabla^2f(z_t)(y-x)dt\Big\rVert\le\int_0^1\lVert\nabla^2f(z_t)\rVert_2dt\ \lVert y-x\rVert$ ($z_t=x+t(y-x)$).
If a symmetric matrix $H$ satisfies $-\beta I\preceq H\preceq\beta I$, all eigenvalues $\lambda_i\in[-\beta,\beta]$, and the operator norm of a symmetric matrix is $\lVert H\rVert_2=\max_i\lvert\lambda_i\rvert\le\beta$. Hence $\lVert\nabla f(y)-\nabla f(x)\rVert\le\beta\lVert y-x\rVert$.`,
        rubric: R`
- The integral representation and the norm inequality — 4 pts
- Eigenvalue range → operator norm $\le\beta$ — 4 pts
- Conclusion — 2 pts` },
      { q: R`If $f=\frac1n\sum f_i$ is $L$-smooth, $x_{t+1}=x_t-\eta_tg_t$, $\E[g_t\mid x_t]=\nabla f(x_t)$, and $\E[\lVert g_t\rVert^2\mid x_t]\le G$, prove
$$\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_1)-f_*+\frac{LG}2\sum_{t=1}^T\eta_t^2}{\sum_{t=1}^T\eta_t}.$$
(Week 5 notes) With a fixed step size $\eta\propto1/\sqrt T$, what rate results?`,
        sol: R`
**One step.** $L$-smoothness with $x=x_{t+1}$, $y=x_t$: $f(x_{t+1})\le f(x_t)-\eta_t\langle\nabla f(x_t),g_t\rangle+\frac{L\eta_t^2}2\lVert g_t\rVert^2$.
**Conditional expectation.** $\E_t\langle\nabla f(x_t),g_t\rangle=\langle\nabla f(x_t),\E_tg_t\rangle=\lVert\nabla f(x_t)\rVert^2$ (unbiasedness), $\E_t\lVert g_t\rVert^2\le G$. Hence $\E_tf(x_{t+1})\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G$.
**Tower property.** Full expectation: $\E f(x_{t+1})\le\E f(x_t)-\eta_t\E\lVert\nabla f(x_t)\rVert^2+\frac L2\eta_t^2G$. Rearranging and summing over $t=1..T$ telescopes:
$$\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\le f(x_1)-\E f(x_{T+1})+\frac{LG}2\sum\eta_t^2\le f(x_1)-f_*+\frac{LG}2\sum\eta_t^2.$$
**The minimum.** The left side is $\ge(\min_t\E\lVert\nabla f(x_t)\rVert^2)\sum_t\eta_t$. Dividing gives the result.
**Fixed step.** $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$. With $\eta=c/\sqrt T$, it is $\big(\frac{f(x_1)-f_*}c+\frac{LGc}2\big)\frac1{\sqrt T}=O(1/\sqrt T)$.`,
        rubric: R`
- Applying the smoothness inequality — 2 pts
- Conditional expectation with unbiasedness and $G$ — 2 pts
- The tower property — 2 pts
- Telescoping and $f_*$ — 2 pts
- The minimum argument and $O(1/\sqrt T)$ — 2 pts` },
      { q: R`For $A,B,T>0$, show that the minimum of $\phi(\eta)=\frac A{\eta T}+B\eta$ ($\eta>0$) is $2\sqrt{AB/T}$, attained at $\eta^*=\sqrt{A/(BT)}$.`,
        sol: R`
$\phi'(\eta)=-\frac A{\eta^2T}+B=0\iff\eta^2=\frac A{BT}$. $\phi''(\eta)=\frac{2A}{\eta^3T}>0$, so it is a minimum. $\phi(\eta^*)=\frac A{T}\sqrt{\frac{BT}A}+B\sqrt{\frac A{BT}}=\sqrt{\frac{AB}T}+\sqrt{\frac{AB}T}=2\sqrt{\frac{AB}T}$.
(Also by AM–GM: $\frac A{\eta T}+B\eta\ge2\sqrt{\frac{AB}T}$, with equality when the two terms are equal.)`,
        rubric: R`
- The derivative and the stationary point — 4 pts
- Checking the minimum — 2 pts
- Computing the minimum value — 4 pts` },
      { q: R`In the fixed-step SGD guarantee $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$ with $f(x_1)-f_*=8$, $L=2$, $G=1$, $T=200$, which $\eta$ minimizes the guarantee?`,
        sol: R`$A=8$, $B=LG/2=1$. $\eta^*=\sqrt{A/(BT)}=\sqrt{8/200}=0.2$, and the guarantee is then $2\sqrt{AB/T}=2\sqrt{0.04}=0.4$.` },
      { q: R`Show that if $\E_t[g]=\nabla f(x_t)$, then $\E_t\lVert g\rVert^2=\lVert\nabla f(x_t)\rVert^2+\E_t\lVert g-\nabla f(x_t)\rVert^2$, and explain what the slide's “variance” precisely is.`,
        sol: R`
Writing $g=\nabla f+(g-\nabla f)$, $\lVert g\rVert^2=\lVert\nabla f\rVert^2+2\langle\nabla f,g-\nabla f\rangle+\lVert g-\nabla f\rVert^2$. Given $x_t$, $\nabla f(x_t)$ is a constant and $\E_t[g-\nabla f]=0$, so the middle term has expectation 0. Hence the result.
$\E_t\lVert g\rVert^2$ is the **second moment** (= bias² $\lVert\nabla f\rVert^2$ + variance $\E_t\lVert g-\nabla f\rVert^2$). As the gradient approaches 0, the variance part dominates.`,
        rubric: R`
- The decomposition and expansion — 4 pts
- Why the cross term is 0 — 4 pts
- Interpretation — 2 pts` },
      { q: R`With $\beta=8$, which learning rate maximizes the lower bound on the decrease in one GD step, $(\eta-\frac\beta2\eta^2)\lVert\nabla f\rVert^2$?`,
        sol: R`$\eta=1/\beta=0.125$. The decrease is then $\frac1{16}\lVert\nabla f\rVert^2$.` },
      { q: R`What is the tower property used in the Week 5 notes?`,
        choices: [R`$\E[XY]=\E X\E Y$`, R`$\E\big[\E[Z\mid x_t]\big]=\E[Z]$`, R`$\E[Z\mid x_t]=Z$`, R`$\Var(\E[Z\mid x_t])=\Var Z$`],
        sol: R`Averaging a conditional expectation again gives the original expectation. It is used to turn the one-step (conditional) inequality into one about full expectations.` },
      { q: R`Show that GD with $\eta=1/\beta$ applied $T$ times to a $\beta$-smooth $f$ (with lower bound $f^*$) gives $\min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
        sol: R`
With $\eta=1/\beta$ the decrease condition gives $f(x_{t+1})\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$, i.e., $\lVert\nabla f(x_t)\rVert^2\le2\beta\big(f(x_t)-f(x_{t+1})\big)$.
Summing over $t=0..T-1$ telescopes: $\sum\lVert\nabla f(x_t)\rVert^2\le2\beta(f(x_0)-f(x_T))\le2\beta(f(x_0)-f^*)$. Since the minimum $\le$ the average, $\min_t\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
        rubric: R`
- The one-step inequality — 3 pts
- Telescoping and the lower bound — 4 pts
- Minimum ≤ average — 3 pts` },
      // quizprep-b
      { q: R`$f(x)=\frac12x^TAx-c^Tx$, where $A$ is symmetric with all eigenvalues in $[0,\beta]$ ($\beta\gt0$).
1. Show that $f(y)=f(x)+\nabla f(x)^T(y-x)+\frac12(y-x)^TA(y-x)$ for all $x,y$, and use it to prove the descent lemma $f(y)\le f(x)+\nabla f(x)^T(y-x)+\frac\beta2\lVert y-x\rVert^2$.
2. For gradient descent $x^+=x-\eta\nabla f(x)$, show $f(x^+)\le f(x)-\eta\big(1-\frac{\beta\eta}2\big)\lVert\nabla f(x)\rVert^2$, and find the $\eta$ that makes this guarantee largest and the decrease at that $\eta$.
3. For $A=\diag(1,4)$, $c=0$, $x=(2,1)$, $\eta=\frac14$, compute $f(x)$ and $f(x^+)$ and check the inequality of 2.`,
        sol: R`
**1.** $\nabla f(x)=Ax-c$. Since $A$ is symmetric, $\frac12(y-x)^TA(y-x)=\frac12y^TAy-x^TAy+\frac12x^TAx$ and $\nabla f(x)^T(y-x)=x^TAy-x^TAx-c^T(y-x)$. Adding gives $\frac12y^TAy-\frac12x^TAx-c^T(y-x)=f(y)-f(x)$ — for a quadratic, the second-order Taylor expansion is exact.
With $A=Q\Lambda Q^T$ (orthogonal diagonalization), $v^TAv=\sum_i\lambda_i(Q^Tv)_i^2\le\beta\sum_i(Q^Tv)_i^2=\beta\lVert v\rVert^2$. Applying it to $v=y-x$ gives the descent lemma.
**2.** Substituting $y=x^+$, $y-x=-\eta\nabla f$ gives $f(x^+)\le f(x)-\eta\lVert\nabla f\rVert^2+\frac\beta2\eta^2\lVert\nabla f\rVert^2$. $\eta-\frac\beta2\eta^2$ is largest at $\eta=\frac1\beta$, with value $\frac1{2\beta}$, so the decrease is at least $\frac1{2\beta}\lVert\nabla f(x)\rVert^2$.
**3.** $f(x)=\frac12(1\cdot4+4\cdot1)=4$, $\nabla f=Ax=(2,4)$, $x^+=(2,1)-\frac14(2,4)=(1.5,\ 0)$, $f(x^+)=\frac12(2.25)=1.125$. With $\beta=4$ and $\eta=\frac14=\frac1\beta$, the guarantee is $f(x^+)\le4-\frac18\cdot20=1.5$. Indeed $1.125\le1.5$ ✓.`,
        rubric: R`
- The exact expansion of a quadratic — 2 pts; the lemma from the eigenvalue bound — 2 pts
- The one-step GD inequality and the optimal step — 3 pts
- The numerical check — 3 pts` },
    ],
  };
})();
