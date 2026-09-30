/* English text — proofs, supplement: the theorems of Problem Set 1 (Problems 1–4), properties of expectation and variance,
   the Week 5 Monday notes (variable-step SGD, condition number, momentum, Nesterov, AdaGrad, RMSProp, Adam). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 02
  'ch02-expvar': { title: 'Properties of Expectation and Variance',
    stmt: R`(i) $\E[aX+bY+c]=a\E X+b\E Y+c$ (ii) $\Var X=\E X^2-(\E X)^2$, $\Var(aX+b)=a^2\Var X$ (iii) if $X,Y$ are independent, $\E[XY]=\E X\E Y$ and $\Var(X+Y)=\Var X+\Var Y$ (iv) if i.i.d. with variance $\sigma^2$, $\Var(\bar X)=\sigma^2/n$.`,
    body: R`
We write it for discrete random variables (for continuous ones, replace sums by integrals).
**(i)** $\E[aX+bY+c]=\sum_{x,y}(ax+by+c)p(x,y)=a\sum_xx\sum_yp(x,y)+b\sum_yy\sum_xp(x,y)+c=a\E X+b\E Y+c$ (marginal $\sum_yp(x,y)=p(x)$). Independence is not needed.
**(ii)** $\mu=\E X$. $\Var X=\E[(X-\mu)^2]=\E[X^2-2\mu X+\mu^2]=\E X^2-2\mu^2+\mu^2=\E X^2-\mu^2$ (using (i)). $\Var(aX+b)=\E[(aX+b-a\mu-b)^2]=a^2\E[(X-\mu)^2]$.
**(iii)** With independence $p(x,y)=p(x)p(y)$, so $\E[XY]=\sum_{x,y}xyp(x)p(y)=\big(\sum_xxp(x)\big)\big(\sum_yyp(y)\big)$. $\Var(X+Y)=\E[(X-\E X+Y-\E Y)^2]=\Var X+\Var Y+2\Cov(X,Y)$, and $\Cov(X,Y)=\E[XY]-\E X\E Y=0$.
**(iv)** Repeating (iii) for $n$ variables, $\Var\sum X_i=\sum\Var X_i=n\sigma^2$, and by (ii) $\Var(\frac1n\sum X_i)=\frac{n\sigma^2}{n^2}=\frac{\sigma^2}n$.`,
    note: R`(iv) is used for why the variance of the minibatch gradient shrinks as $1/B$ (Section 10.2), for the variance computations of initialization (Section 11.2), and for the bias–variance decomposition (Section 2.8).` },
  'ch02-mapridge': { title: 'The MAP of a Gaussian Mean Is Ridge (Problem Set 1, Problem 2)',
    stmt: R`If $X_1,\dots,X_n\overset{iid}{\sim}\N(\theta,1)$ and $\theta\sim\N(0,\tau^2)$, then $\hat\theta_{\text{MAP}}=\argmin_\theta\sum(X_i-\theta)^2+\lambda\theta^2$ ($\lambda=1/\tau^2$) and $\hat\theta_{\text{MAP}}=a\bar X$ with $a=\frac{n\tau^2}{n\tau^2+1}$. The posterior is $\N\big(a\bar X,\frac1{n+1/\tau^2}\big)$.`,
    body: R`
**The form of the MAP.** By Bayes' theorem, $p(\theta\mid X)\propto p(X\mid\theta)p(\theta)=\prod_i\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\cdot\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}$. Taking the log,
$$\log p(\theta\mid X)=-\frac12\sum_i(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C\qquad(C\text{ does not depend on }\theta).$$
Since $\log$ is strictly increasing, the maximizer of the posterior density = the maximizer of its log. Multiplying by $-2$ turns maximization into minimization: $\argmin_\theta\sum(X_i-\theta)^2+\frac1{\tau^2}\theta^2$.
**Solving.** $g(\theta)=\sum(X_i-\theta)^2+\lambda\theta^2$ is a quadratic with $g''=2(n+\lambda)>0$. $g'(\theta)=-2\sum X_i+2(n+\lambda)\theta=0$ gives $\theta=\frac{n\bar X}{n+\lambda}=\frac{n\tau^2}{n\tau^2+1}\bar X$.
**The posterior.** Completing the square in the exponent $-\frac12\big[(n+\lambda)\theta^2-2n\bar X\theta\big]+C$ gives $-\frac{n+\lambda}2(\theta-a\bar X)^2+C'$. It is the Gaussian $\N\big(a\bar X,\frac1{n+\lambda}\big)$, and since it is symmetric, MAP = posterior mean = $a\bar X$.`,
    note: R`Generalized to the linear model $y=X\beta+\varepsilon$, $\varepsilon\sim\N(0,\sigma^2I)$, $\beta\sim\N(0,\tau^2I)$, it is ridge $(\lambda I+X^TX)^{-1}X^Ty$ with $\lambda=\sigma^2/\tau^2$ (Section 4.3). Problem 2 is the case where $X$ is a single column of ones and $\sigma^2=1$.` },
  'ch02-biasvar': { title: 'The Bias–Variance Decomposition and the MSE of a Shrinkage Estimator (Problem Set 1, Problem 2)',
    stmt: R`For any estimator $\hat\theta$, $\E(\hat\theta-\theta)^2=(\E\hat\theta-\theta)^2+\Var(\hat\theta)$. In particular, $\hat\theta=a\bar X$ ($X_i\sim\N(\theta,1)$ i.i.d.) has bias $(a-1)\theta$, variance $a^2/n$, and MSE $(1-a)^2\theta^2+a^2/n$.`,
    body: R`
$b=\E\hat\theta-\theta$ is not a random variable but a **constant** (the expectation is over the sampling distribution with the true $\theta$ fixed). Splitting $\hat\theta-\theta=(\hat\theta-\E\hat\theta)+b$,
$$\E(\hat\theta-\theta)^2=\E(\hat\theta-\E\hat\theta)^2+2b\,\E(\hat\theta-\E\hat\theta)+b^2.$$
The middle term: $\E(\hat\theta-\E\hat\theta)=\E\hat\theta-\E\hat\theta=0$. The first term is the definition of $\Var(\hat\theta)$. Hence $\mathrm{MSE}=b^2+\Var\hat\theta$.
**The shrinkage estimator.** $\E\bar X=\theta$, $\Var\bar X=1/n$ (i.i.d.). $\E[a\bar X]=a\theta$ → bias $(a-1)\theta$; $\Var(a\bar X)=a^2/n$. MSE $=(1-a)^2\theta^2+\frac{a^2}n$. Substituting $a=\frac{n\tau^2}{n\tau^2+1}$ gives $1-a=\frac1{n\tau^2+1}$ and $\mathrm{MSE}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}$.`,
    note: R`It is smaller than the MSE $1/n$ of $\bar X$ (the MLE) if and only if $\theta^2<2\tau^2+\frac1n$. Accepting a little bias to reduce the variance is the core of regularization.` },
  // ───── 03
  'ch03-jsdiv': { title: 'Properties of the Jensen–Shannon Divergence (Problem Set 1, Problem 1)',
    stmt: R`For $m=\frac12(p+q)$ and $D_{JS}(p\Vert q)=\frac12\KL(p\Vert m)+\frac12\KL(q\Vert m)$: (i) non-negativity $D_{JS}\ge0$ (ii) identity of indiscernibles $D_{JS}=0\iff p=q$ (iii) symmetry $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$ (iv) $D_{JS}\le\log2$, with equality when the supports of $p,q$ are disjoint.`,
    body: R`
**Preparation.** $m\ge0$ and $\sum_xm(x)=\frac12+\frac12=1$, so $m$ is a probability distribution. If $p(x)>0$ then $m(x)\ge\frac12p(x)>0$, so $\KL(p\Vert m)$ has no term with a zero denominator and is finite (likewise for $q$). Theorem 1: $\KL(a\Vert b)\ge0$, with equality $\iff a=b$.
**(i)** Both KL divergences are $\ge0$, so their average is $\ge0$.
**(ii)** ($\Leftarrow$) $p=q\Rightarrow m=p\Rightarrow\KL(p\Vert m)=\KL(q\Vert m)=0$. ($\Rightarrow$) If $D_{JS}=0$, the sum of two nonnegative numbers is 0, so both are 0: $\KL(p\Vert m)=0$ and $\KL(q\Vert m)=0$. By the equality condition of Theorem 1, $p=m=q$.
**(iii)** $m$ is symmetric in $p,q$, so swapping them only swaps the order of the two terms.
**(iv)** Where $p(x)>0$, $\frac{p(x)}{m(x)}=\frac{2p(x)}{p(x)+q(x)}\le2$, with equality when $q(x)=0$. Hence $\KL(p\Vert m)\le\sum_{p>0}p\log2=\log2$ (equality $\iff$ $q=0$ wherever $p>0$). By symmetry $\KL(q\Vert m)\le\log2$. The average is $\le\log2$, with equality when $p(x)q(x)=0$ for every $x$.`,
    note: R`In terms of entropy, $D_{JS}=H(m)-\frac{H(p)+H(q)}2$ (concavity of entropy = non-negativity). For $X$ drawn from $p$ or $q$ according to a fair coin $Z$, $D_{JS}(p\Vert q)=I(X;Z)\le H(Z)=\log2$. $\sqrt{D_{JS}}$ is a metric.` },
  // ───── 07
  'ch07-maxmin': { title: 'The Max–Min Inequality and a Counterexample (Problem Set 1, Problem 4)',
    stmt: R`Let $X$ and $Y$ be nonempty sets, and let $f:X\times Y\to\mathbb R$. Then $\max_{x\in X}\min_{y\in Y}f(x,y)\le\min_{y\in Y}\max_{x\in X}f(x,y)$ ($\sup\inf\le\inf\sup$ if these do not exist). Equality does not hold in general.`,
    body: R`
Let $g(x)=\min_yf(x,y)$ and $h(y)=\max_xf(x,y)$. For any $x'\in X$, $y'\in Y$,
$$g(x')=\min_yf(x',y)\le f(x',y')\le\max_xf(x,y')=h(y').$$
Hence $g(x')\le h(y')$ holds for **every pair** $(x',y')$.
1. Fixing $x'$ and taking the minimum over $y'$ preserves the inequality: $g(x')\le\min_{y'}h(y')$.
2. The right side is now a constant, so taking the maximum over $x'$ preserves it: $\max_{x'}g(x')\le\min_{y'}h(y')$. ∎
**Counterexample.** $X=Y=\{0,1\}$, $f(x,y)=(x-y)^2$. For every $x$, $\min_yf=f(x,x)=0$, so the left side is $0$. For every $y$, $\max_xf=1$ ($x\ne y$), so the right side is $1$. $0<1$.`,
    note: R`If there is a saddle point $(x^*,y^*)$ ($f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$), equality holds. Replacing $x\to\alpha$, $y\to(w,b)$, $f\to L_p$ in the SVM gives weak duality, and the convex–concave structure makes it an equality (strong duality).` },
  // ───── 13
  'ch13-varstep': { title: 'Convergence of SGD with Variable Step Sizes',
    stmt: R`If $f=\frac1n\sum f_i$ is $L$-smooth with lower bound $f_*$, $x_{t+1}=x_t-\eta_tg_t$, $\E[g_t\mid x_t]=\nabla f(x_t)$, and $\E[\lVert g_t\rVert^2\mid x_t]\le G$, then $\min_{1\le t\le T}\E\lVert\nabla f(x_t)\rVert^2\le\dfrac{f(x_1)-f_*+\frac{LG}2\sum_t\eta_t^2}{\sum_t\eta_t}$.`,
    body: R`
**One step.** Putting $x_{t+1}-x_t=-\eta_tg_t$ into $L$-smoothness (the descent lemma),
$$f(x_{t+1})\le f(x_t)-\eta_t\langle\nabla f(x_t),g_t\rangle+\frac{L\eta_t^2}2\lVert g_t\rVert^2.$$
**Conditional expectation** $\E_t=\E[\cdot\mid x_t]$: functions of $x_t$ come out as constants, and by unbiasedness $\E_t\langle\nabla f(x_t),g_t\rangle=\lVert\nabla f(x_t)\rVert^2$. With the bound on the second moment,
$$\E_tf(x_{t+1})\le f(x_t)-\eta_t\lVert\nabla f(x_t)\rVert^2+\frac{L\eta_t^2}2G.$$
**Tower property** $\E[\E_t[Z]]=\E[Z]$: take the full expectation and rearrange: $\eta_t\E\lVert\nabla f(x_t)\rVert^2\le\E f(x_t)-\E f(x_{t+1})+\frac L2\eta_t^2G$.
**Telescoping.** Summing over $t=1,\dots,T$, $\sum_t\eta_t\E\lVert\nabla f(x_t)\rVert^2\le f(x_1)-\E f(x_{T+1})+\frac{LG}2\sum_t\eta_t^2\le f(x_1)-f_*+\frac{LG}2\sum_t\eta_t^2$.
**The minimum.** The left side is $\ge\big(\min_t\E\lVert\nabla f(x_t)\rVert^2\big)\sum_t\eta_t$. Dividing by $\sum_t\eta_t>0$ finishes the proof.`,
    note: R`Fixed step $\eta$: $\frac{f(x_1)-f_*}{\eta T}+\frac{LG}2\eta$. At the optimum $\eta^*=\sqrt{\frac{2(f(x_1)-f_*)}{LGT}}$ it is $\sqrt{\frac{2(f(x_1)-f_*)LG}T}=O(1/\sqrt T)$. If $\sum\eta_t=\infty$ and $\sum\eta_t^2<\infty$ (e.g., $\eta_t\propto1/t$), the right side goes to 0.` },
  // ───── 14
  'ch14-condgd': { title: 'The Condition Number and the Speed of Gradient Descent',
    stmt: R`Applying GD $x_{t+1}=x_t-\alpha Hx_t$ to $f(x)=\frac12x^THx$ ($H\succ0$, eigenvalues $\lambda_{\min}\le\dots\le\lambda_{\max}$), the component along each eigendirection is multiplied by $(1-\alpha\lambda_i)^t$. It converges $\iff0<\alpha<2/\lambda_{\max}$, and with the optimal fixed $\alpha$ the shrink factor is $\frac{\kappa-1}{\kappa+1}$ ($\kappa=\lambda_{\max}/\lambda_{\min}$). For the class example $H=\diag(1,100)$, $x_{1,t+1}=(1-\alpha)x_{1,t}$ and $x_{2,t+1}=(1-100\alpha)x_{2,t}$.`,
    body: R`
$H=Q\Lambda Q^T$ ($Q$ orthogonal). With $u_t=Q^Tx_t$, $u_{t+1}=Q^T(I-\alpha H)Qu_t=(I-\alpha\Lambda)u_t$, i.e., $u_{t+1,i}=(1-\alpha\lambda_i)u_{t,i}$. In the class example $H$ is already diagonal, so $Q=I$.
**Convergence.** $u_t\to0$ from every initial value $\iff$ $\lvert1-\alpha\lambda_i\rvert<1$ for every $i$ $\iff$ $0<\alpha\lambda_i<2$ $\iff$ $\alpha<2/\lambda_{\max}$.
**The optimal fixed learning rate.** $\phi(\alpha)=\max_i\lvert1-\alpha\lambda_i\rvert=\max(\lvert1-\alpha\lambda_{\min}\rvert,\lvert1-\alpha\lambda_{\max}\rvert)$. The first decreases on $\alpha\le1/\lambda_{\min}$ and the second increases on $\alpha\ge1/\lambda_{\max}$, so the minimum is where $1-\alpha\lambda_{\min}=\alpha\lambda_{\max}-1$, $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$. The value is $\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\kappa-1}{\kappa+1}$.
**The numbers from class.** $\alpha=0.019$: the shrink factor of $x_1$ is $0.981$, and $x_2$ is multiplied by $-0.9$ (an oscillation with alternating sign). $(-5,-1)\to(-4.905,0.9)\to(-4.812,-0.81)\to(-4.720,0.729)$.`,
    note: R`Reducing the error by a factor $1/e$ takes about $\frac{\kappa}{2}$ steps. Optimal momentum changes this to $\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ (about $\frac{\sqrt\kappa}2$ steps).` },
  'ch14-heavyball': { title: 'The Two Forms of Momentum and the Unrolled Formula',
    stmt: R`$v_{t+1}=\rho v_t-\alpha\nabla f(x_t)$, $x_{t+1}=x_t+v_{t+1}$, $v_0=0$ is the same as $x_{t+1}=x_t-\alpha\nabla f(x_t)+\rho(x_t-x_{t-1})$ ($x_{-1}=x_0$), and $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}\nabla f(x_k)$. If the gradient is constant ($g$), $v_t\to-\frac\alpha{1-\rho}g$.`,
    body: R`
**The two forms.** From $x_{t+1}=x_t+v_{t+1}$, $v_{t+1}=x_{t+1}-x_t$, hence $v_t=x_t-x_{t-1}$ ($t\ge1$; $v_0=0$ is the same as $x_{-1}=x_0$). Substituting into the velocity formula gives $x_{t+1}-x_t=\rho(x_t-x_{t-1})-\alpha\nabla f(x_t)$.
**The unrolled formula (induction).** $g_k=\nabla f(x_k)$. $t=1$: $v_1=-\alpha g_0$. If $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}g_k$, then $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k=0}^{t-1}\rho^{t-k}g_k+g_t\big)=-\alpha\sum_{k=0}^t\rho^{t-k}g_k$. The notes' $v_2=-\alpha(\rho g_0+g_1)$ and $v_3=-\alpha(\rho^2g_0+\rho g_1+g_2)$ are this.
**The effective learning rate.** If $g_k=g$, then $v_t=-\alpha g\frac{1-\rho^t}{1-\rho}\to-\frac\alpha{1-\rho}g$.`,
    note: R`For a gradient with alternating sign, $g_k=(-1)^kg$, $\lvert v_t\rvert\le\frac{\alpha(1+\rho^t)}{1+\rho}\lvert g\rvert$ — the oscillating direction is actually damped. This is why momentum helps in narrow valleys.` },
  'ch14-nesterovpf': { title: 'The “Look-Ahead” Form of Nesterov Momentum',
    stmt: R`With $y_t=x_t+\rho v_t$, $v_{t+1}=\rho v_t-\alpha\nabla f(x_t+\rho v_t)$, $x_{t+1}=x_t+v_{t+1}$ becomes $x_{t+1}=y_t-\alpha\nabla f(y_t)$ (one GD step from the look-ahead point). In the class example ($f=\frac{x^2}2$, $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$), momentum gives $-0.9$ and Nesterov $-0.72$.`,
    body: R`
$x_{t+1}=x_t+v_{t+1}=x_t+\rho v_t-\alpha\nabla f(x_t+\rho v_t)=y_t-\alpha\nabla f(y_t)$.
**Numbers.** $y_t=1+0.9(-2)=-0.8$. Momentum: $v_{t+1}=-1.8-0.1f'(1)=-1.9$, $x_{t+1}=-0.9$. Nesterov: $v_{t+1}=-1.8-0.1f'(-0.8)=-1.8+0.08=-1.72$, $x_{t+1}=1-1.72=-0.72$ ($=y_t-0.1y_t=-0.72$).
**Interpretation.** Both overshoot the minimizer 0 with the inertia $-1.8$. Momentum pushes further left with the gradient (positive) at the starting point $x_t=1$, while Nesterov pulls back with the gradient (negative) at the arrival point $y_t=-0.8$ and ends closer to 0.`,
    note: R`In code, the stored variable is changed to $\tilde x_t=x_t+\rho v_t$, and the update is written $v_{t+1}=\rho v_t-\alpha\nabla f(\tilde x_t)$, $\tilde x_{t+1}=\tilde x_t-\rho v_t+(1+\rho)v_{t+1}$, so the gradient is computed only once.` },
  'ch14-adagradpf': { title: 'The Per-Coordinate Steps of AdaGrad',
    stmt: R`In $A_t=A_{t-1}+g_t\odot g_t$ ($A_0=0$), $x_{t,j}=x_{t-1,j}-\frac{\alpha}{\sqrt{A_{t,j}}}g_{t,j}$ (ignoring $\varepsilon$): (i) the first step has size $\alpha$ in every coordinate; (ii) multiplying all the gradients of one coordinate by $c>0$ leaves the steps the same; (iii) if the gradient size is constant, the $t$-th step is $\alpha/\sqrt t$.`,
    body: R`
$A_{t,j}=\sum_{k=1}^tg_{k,j}^2$.
**(i)** $t=1$: $\frac{\alpha g_{1,j}}{\sqrt{g_{1,j}^2}}=\alpha\operatorname{sign}(g_{1,j})$. The class example $g_1=(0.1,10)$, $\alpha=0.01$: GD gives $(-0.001,-0.1)$, AdaGrad $(-0.01,-0.01)$.
**(ii)** Replacing every $g_{k,j}$ of coordinate $j$ by $cg_{k,j}$ multiplies $\sqrt{A_{t,j}}$ by $c$ too, so the ratio is the same — each coordinate's step is independent of its unit (scale).
**(iii)** If $\lvert g_{k,j}\rvert=c$, then $A_{t,j}=tc^2$ and the step is $\frac{\alpha c}{\sqrt tc}=\frac\alpha{\sqrt t}$ — it keeps shrinking.`,
    note: R`(iii) is AdaGrad's drawback that “learning stops too early” on nonconvex problems, which RMSProp fixes.` },
  'ch14-rmsproppf': { title: 'The Exponential Moving Average of RMSProp',
    stmt: R`If $z_t=\beta z_{t-1}+(1-\beta)g_t\odot g_t$ and $z_0=0$, then $z_t=(1-\beta)\sum_{k=1}^t\beta^{t-k}g_k\odot g_k$. If the gradient is constant ($g$), $z_t=(1-\beta^t)g\odot g\to g\odot g$ and the step $\alpha\frac{g}{\sqrt{z_t}}\to\alpha\operatorname{sign}(g)$ — its size does not shrink.`,
    body: R`
The unrolled formula follows by the same induction as momentum in Section 14.2 ($z_1=(1-\beta)g_1^2$, $z_t=\beta z_{t-1}+(1-\beta)g_t^2$). For a constant $g$, $z_t=(1-\beta)g^2\sum_{k=0}^{t-1}\beta^k=(1-\beta^t)g^2$. As $t\to\infty$ it is $g^2$, so the step size is $\alpha$.
The weights $(1-\beta)\beta^{t-k}$ shrink exponentially the further in the past $k$ is, and they sum to $1-\beta^t\le1$, so it is roughly the mean square of the most recent $\frac1{1-\beta}$ gradients. Unlike AdaGrad's $A_t=\sum g_k^2$ (all weights 1, a sum diverging like $t$), it **forgets old gradients**, so the effective learning rate does not go to 0.`,
    note: R`The slide's notation $\lVert\nabla f(x)\rVert_2^2$ must be read as the elementwise square, like the code (dx * dx). A scalar norm would not produce per-coordinate learning rates.` },
  'ch14-adampf': { title: 'Adam’s Bias Correction and First Step',
    stmt: R`If $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$ and $m_0=0$, then $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$, and if $\E g_k=\bar g$ (for all $k$), $\E m_t=(1-\beta_1^t)\bar g$. Hence $\hat m_t=m_t/(1-\beta_1^t)$ is unbiased. The first step of bias-corrected Adam is $\alpha\operatorname{sign}(g_1)$ (ignoring $\epsilon$), and without the correction it is $\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha$ (about $3.16\alpha$ with the defaults).`,
    body: R`
**Unrolling.** $m_1=(1-\beta_1)g_1$; substituting the induction hypothesis into $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$ gives $(1-\beta_1)\big(\sum_{k<t}\beta_1^{t-k}g_k+g_t\big)$.
**Expectation.** $\E m_t=(1-\beta_1)\bar g\sum_{k=1}^t\beta_1^{t-k}=(1-\beta_1)\bar g\cdot\frac{1-\beta_1^t}{1-\beta_1}=(1-\beta_1^t)\bar g$. The same computation gives $\E m_{2,t}=(1-\beta_2^t)\overline{g^2}$.
**The first step.** $t=1$: $\hat m_1=\frac{(1-\beta_1)g_1}{1-\beta_1}=g_1$ and $\hat m_2=\frac{(1-\beta_2)g_1^2}{1-\beta_2}=g_1^2$. The step is $\alpha\frac{g_1}{\sqrt{g_1^2}}=\alpha\operatorname{sign}(g_1)$ (elementwise).
**Without the correction** it is $\alpha\frac{(1-\beta_1)g_1}{\sqrt{(1-\beta_2)g_1^2}}=\frac{1-\beta_1}{\sqrt{1-\beta_2}}\alpha\operatorname{sign}(g_1)$. With $\beta_1=0.9$, $\beta_2=0.999$ this is $\frac{0.1}{0.0316}\approx3.16$ times.`,
    note: R`$\hat m_1/\sqrt{\hat m_2}$ is “mean of the gradient ÷ RMS of the gradient”, roughly in $[-1,1]$ componentwise, so Adam's step is roughly bounded by $\alpha$. Defaults: $\beta_1=0.9$, $\beta_2=0.999$, $\alpha=10^{-3}$ or $5\times10^{-4}$.` },
  });
})();
