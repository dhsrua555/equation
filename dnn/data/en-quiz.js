/* English text — worked quiz: Problem Set 1 (M1407.0012, Prof. Youngjoon Hong). The problem statements follow the original English of the problem set. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.qz.ps1 = {
    title: 'Problem Set 1',
    meta: 'M1407.0012 · Prof. Youngjoon Hong · Due Date N/A (practice) · exam problems come in this format',
    intro: R`
All four problems are **proofs and derivations**. **The justification of each step**, more than the final result, decides the score. Common rules to follow when writing answers:

:::tip Common principles for writing answers
1. **Start from the definitions.** Writing the problem's symbols ($D_{JS}$, $m$, the posterior, the Lagrangian, $g(x)=\min_yf$) as formulas first gets you halfway there.
2. **Name the theorems you use and state their conditions.** As in “non-negativity of KL (Gibbs' inequality, equality $\iff$ the two distributions are equal)”, “$\log$ is an increasing function”, “the complementary slackness condition”.
3. **Show an equivalence (⇔) in both directions separately.**
4. **When you carry an inequality over, write one line saying over what you take the max or min.**
5. **Check at the end**: primal value = dual value, and agreement with known cases such as limits (MLE as $\tau^2\to\infty$).
:::
`,
    probs: {
      p1: { label: 'Problem 1', title: 'Three Properties of the Jensen–Shannon Divergence', where: 'Information theory',
        body: R`
:::def Problem
Let $p$ and $q$ be two probability distributions on a common probability space. The Jensen–Shannon (JS) divergence between $p$ and $q$ is defined by
$$D_{JS}(p\Vert q)=\frac12D_{KL}(p\Vert m)+\frac12D_{KL}(q\Vert m),\qquad m=\frac12(p+q)$$
Prove the following properties of the Jensen–Shannon divergence:
(i) Non-negativity: $D_{JS}(p\Vert q)\ge0$.
(ii) Identity of indiscernibles (non-degeneracy): $D_{JS}(p\Vert q)=0\iff p=q$.
(iii) Symmetry: $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$.
:::

:::key Key points
- All three properties follow from **a single property of the KL divergence** (Gibbs' inequality): $D_{KL}(a\Vert b)\ge0$, with equality $\iff a=b$. You must be able to state this theorem and its **equality condition** exactly.
- First check that **$m$ is a probability distribution and the KL is finite**. If $p(x)\gt0$ then $m(x)\ge\frac12p(x)\gt0$, so the denominator of $D_{KL}(p\Vert m)$ is never 0. (By contrast, $D_{KL}(p\Vert q)$ can be infinite.)
- The key line of ($\Rightarrow$) in (ii) is “if two **nonnegative** numbers sum to 0, **each** is 0”.
- For (iii) it suffices to show that $m=\frac12(p+q)$ is **symmetric** in $p$ and $q$.
- Bonus: $0\le D_{JS}\le\log2$, and $D_{JS}=H(m)-\frac{H(p)+H(q)}2$.
:::

:::ex Solution
Once Gibbs' inequality is proved, the rest takes a few lines. Write it yourself, then open this.
---
**Preparation 1: $m$ is a probability distribution.** $m(x)=\frac12\{p(x)+q(x)\}\ge0$ and $\sum_xm(x)=\frac12(1+1)=1$ (an integral in the continuous case).

**Preparation 2: the KL is finite.** At $x$ with $p(x)\gt0$, $m(x)\ge\frac12p(x)\gt0$, so $\frac{p(x)}{m(x)}\le2$ and hence $D_{KL}(p\Vert m)=\sum_{p(x)\gt0}p(x)\log\frac{p(x)}{m(x)}\le\log2\lt\infty$. The same holds for $q$.

**Preparation 3: Gibbs' inequality.** For two distributions $a,b$ ($a(x)\gt0\Rightarrow b(x)\gt0$), applying $\log t\le t-1$ (equality $\iff t=1$) to $t=\frac{b(x)}{a(x)}$ gives
$$-D_{KL}(a\Vert b)=\sum_{a(x)\gt0}a(x)\log\frac{b(x)}{a(x)}\le\sum_{a(x)\gt0}a(x)\Big(\frac{b(x)}{a(x)}-1\Big)=\sum_{a(x)\gt0}b(x)-1\le0.$$
Equality holds only when $b(x)=a(x)$ at every $x$ with $a(x)\gt0$ and $\sum_{a\gt0}b=1$, i.e., when $a=b$.

**(i)** By Preparation 3, $D_{KL}(p\Vert m)\ge0$ and $D_{KL}(q\Vert m)\ge0$, so
$$D_{JS}(p\Vert q)=\tfrac12D_{KL}(p\Vert m)+\tfrac12D_{KL}(q\Vert m)\ge0.$$

**(ii)** ($\Leftarrow$) If $p=q$, then $m=\frac12(p+p)=p=q$, so $D_{KL}(p\Vert m)=D_{KL}(p\Vert p)=0$ and $D_{KL}(q\Vert m)=0$; hence $D_{JS}=0$.
($\Rightarrow$) Suppose $D_{JS}=0$. The two terms $\frac12D_{KL}(p\Vert m)$ and $\frac12D_{KL}(q\Vert m)$ are nonnegative by (i) and sum to 0, so **both are 0**. By the equality condition of Gibbs' inequality, $p=m$ and $q=m$. Therefore $p=q$.

**(iii)** $m=\frac12(p+q)=\frac12(q+p)$ does not depend on the order of $p,q$. Hence
$$D_{JS}(q\Vert p)=\tfrac12D_{KL}(q\Vert m)+\tfrac12D_{KL}(p\Vert m)=D_{JS}(p\Vert q).\qquad\blacksquare$$

**A numerical check.** If $p=(\frac12,\frac12)$ and $q=(\frac14,\frac34)$, then $m=(\frac38,\frac58)$ and $D_{JS}\approx0.0338$ (natural log) — between 0 and $\log2\approx0.693$. For $p=(1,0)$ and $q=(0,1)$, whose supports do not overlap, $D_{JS}=\log2$ (the maximum), whereas $D_{KL}(p\Vert q)=\infty$.
:::

:::warn Common mistakes
- Confusing $D_{JS}$ with $\frac12\{D_{KL}(p\Vert q)+D_{KL}(q\Vert p)\}$ (the Jeffreys divergence). JS is the KL **with respect to the mean distribution $m$**.
- Writing only one direction in (ii), or writing “KL is 0, so they are equal” **without justification** (you must cite the equality condition).
- Forgetting that for continuous distributions “$p=q$” means “equal almost everywhere” (one added sentence suffices).
:::
` },
      p2: { label: 'Problem 2', title: 'The MAP of a Gaussian Mean: Ridge, Shrinkage, Bias–Variance', where: 'Probability and Bayesian inference',
        body: R`
:::def Problem
Assume $X_1,\dots,X_n$ are independent with $X_i\sim\N(\theta,1)$ ($i=1,\dots,n$), where the variance is known to be 1 and $\theta$ is unknown. The prior is $\theta\sim\N(0,\tau^2)$ with $\tau^2\gt0$. Expectations below are taken with respect to the sampling distribution of $(X_1,\dots,X_n)$ given $\theta$.

**1.** Derive the MAP estimator of $\theta$, and consider the Ridge problem
$$\hat\theta_{\text{MAP}}=\argmin_\theta\sum_{i=1}^n(X_i-\theta)^2+\lambda\theta^2,\qquad\lambda=\frac1{\tau^2}$$
Show that the MAP estimator coincides with the solution of this Ridge problem.

**2.** Express $\hat\theta_{\text{MAP}}$ in terms of the sample mean $\bar X=\frac1n\sum_{i=1}^nX_i$ as $\hat\theta_{\text{MAP}}=a\bar X$, and determine the shrinkage factor $a$ as a function of $n$ and $\tau^2$.

**3.** Let $\hat\theta$ be any estimator of $\theta$. Prove the identity $\E(\hat\theta-\theta)^2=\big(\E[\hat\theta]-\theta\big)^2+\Var(\hat\theta)$. Also, apply this identity to $\hat\theta=\hat\theta_{\text{MAP}}$ and compute its bias, variance, and MSE explicitly. (Hint: Write $\hat\theta-\theta=\hat\theta-\E[\hat\theta]+\E[\hat\theta]-\theta$ and expand the square.)
:::

:::key Key points
- **MAP = the maximizer of the posterior = the minimizer of “negative log-likelihood + negative log-prior”.** The evidence $p(X)$ and the normalizing constants do not depend on $\theta$, so they are dropped. Write down the justification that $\log$ is increasing, so the argmax is preserved.
- **Build the posterior in three steps:** Bayes' theorem $p(\theta\mid X)\propto p(X\mid\theta)\,p(\theta)$ → by independence $p(X\mid\theta)=\prod_ip(X_i\mid\theta)$ → plug $(\mu,\sigma^2)=(\theta,1)$ into the normal density formula, and $(0,\tau^2)$ for the prior.
- Gaussian likelihood → squared error, Gaussian prior → $L_2$ penalty. **Multiplying** the negative log posterior $\frac12\sum(X_i-\theta)^2+\frac1{2\tau^2}\theta^2$ **by 2** does not change the minimizer, and doing so gives the problem's ridge form ($\lambda=1/\tau^2$).
- The minimizer comes from derivative = 0, and **the second derivative $2(n+\lambda)\gt0$ confirms it is a minimum**.
- The shrinkage factor $a=\frac{n\tau^2}{n\tau^2+1}\in(0,1)$ pulls toward the prior mean 0. Checking limits: as $\tau^2\to\infty$ (an uninformative prior) or $n\to\infty$, $a\to1$ (the MLE $\bar X$); as $\tau^2\to0$, $\hat\theta\to0$.
- The key of the decomposition is why **the cross term is 0**: $\E[\hat\theta]-\theta$ is a **constant** that comes outside, and $\E[\hat\theta-\E\hat\theta]=0$.
- The expectation is taken over $X$ with $\theta$ **fixed** (not a Bayesian expectation). $\E\bar X=\theta$, $\Var\bar X=\frac1n$, $\Var(a\bar X)=a^2\Var\bar X$.
:::

:::ex Solution
The three parts are chained: the result of 1 is the input of 2, and the result of 2 is the input of 3.
---
**1. Deriving the MAP.** By Bayes' theorem, $p(\theta\mid X)\propto p(X\mid\theta)\,p(\theta)$. By independence the likelihood is a product, so
$$p(\theta\mid X)\propto\prod_{i=1}^n\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\cdot\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}.$$

:::note Where this formula comes from: fitting three pieces in turn
This one line contains three facts. ① and ② were proved in Unit 02, and ③ is a computation that plugs values into a formula.

**① Bayes' theorem → proportionality (∝).** Bayes' theorem for a continuous parameter is
$$p(\theta\mid X)=\frac{p(X\mid\theta)\,p(\theta)}{p(X)},\qquad p(X)=\int p(X\mid\theta)\,p(\theta)\,d\theta.$$
The denominator $p(X)$ is the value with $\theta$ integrated out, so it is **a positive number that does not change as $\theta$ changes**. Dividing by the same number at every $\theta$ does not change where the maximum is, so we drop the denominator and write “is proportional to (∝)”. In detail: [[ch02:2.5|Bayes' theorem for a continuous parameter]] (the discrete version is [[ch02:2.2|Bayes' theorem]])

**② Independence → product.** Here $X$ is the whole dataset $(X_1,\dots,X_n)$, so $p(X\mid\theta)$ is the joint density $p(X_1,\dots,X_n\mid\theta)$. Given $\theta$ the $X_i$ are independent, so the joint density splits into the product of the individual densities:
$$p(X_1,\dots,X_n\mid\theta)=p(X_1\mid\theta)\,p(X_2\mid\theta)\cdots p(X_n\mid\theta)=\prod_{i=1}^np(X_i\mid\theta).$$
It is the definition of independence for two events, $P(E\cap F)=P(E)P(F)$, extended to $n$. In detail: [[ch02:2.4|The likelihood of i.i.d. data is a product]]

**③ Plugging values into the normal density.** The density of $\N(\mu,\sigma^2)$ is
$$f(x)=\frac1{\sqrt{2\pi\sigma^2}}\,e^{-(x-\mu)^2/(2\sigma^2)}$$
(in detail: [[ch02:2.3|the normal distribution in the table of distributions]]). The two distributions of the problem simply put different things in the places of $x,\mu,\sigma^2$ of this formula.

| | Distribution | In place of $x$ | In place of $\mu$ | In place of $\sigma^2$ | Result |
|---|---|---|---|---|---|
| One likelihood factor | $X_i\mid\theta\sim\N(\theta,1)$ | $X_i$ | $\theta$ | $1$ | $\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}$ |
| Prior | $\theta\sim\N(0,\tau^2)$ | $\theta$ | $0$ | $\tau^2$ | $\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}$ |

In the first row $\sigma^2=1$, so $\sqrt{2\pi\cdot1}=\sqrt{2\pi}$ and the denominator of the exponent becomes $2\cdot1=2$. In the second row $\mu=0$, so $(\theta-0)^2=\theta^2$. The easily confused point is that in the prior **$\theta$ goes in the place of the variable $x$**.

**Putting it together.** Putting the first row of ③ into the product of ② $n$ times, and the second row of ③ into the $p(\theta)$ of ①, gives the formula above.

**How to get to the next line (the log).** Applying the two log rules $\log(ab)=\log a+\log b$ (product → sum) and $\log e^{u}=u$ one factor at a time,
$$\log\Big(\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\Big)=-\frac12\log(2\pi)-\frac{(X_i-\theta)^2}2,$$
$$\log\Big(\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}\Big)=-\frac12\log(2\pi\tau^2)-\frac{\theta^2}{2\tau^2}.$$
After adding the $n$ terms, collecting the terms without $\theta$ — $-\frac n2\log(2\pi)$, $-\frac12\log(2\pi\tau^2)$, and the $-\log p(X)$ dropped in ① — into a constant $C$ gives the formula below. The same computation keeping $\sigma^2$ is [[ch02:2.4|the log-likelihood of the Gaussian MLE]].
:::

Taking the log (collecting the terms independent of $\theta$ into a constant $C$),
$$\log p(\theta\mid X)=-\frac12\sum_{i=1}^n(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C.$$
Since $\log$ is increasing, $\hat\theta_{\text{MAP}}=\argmax_\theta p(\theta\mid X)=\argmax_\theta\log p(\theta\mid X)$. Multiplying by the positive constant $2$ and flipping the sign,
$$\hat\theta_{\text{MAP}}=\argmin_\theta\Big[\sum_{i=1}^n(X_i-\theta)^2+\frac1{\tau^2}\theta^2\Big],$$
which is the ridge problem with $\lambda=1/\tau^2$.

**2. The shrinkage factor.** With $g(\theta)=\sum_i(X_i-\theta)^2+\lambda\theta^2$,
$$g'(\theta)=-2\sum_iX_i+2n\theta+2\lambda\theta=0\ \Rightarrow\ \hat\theta=\frac{\sum_iX_i}{n+\lambda}=\frac{n}{n+\lambda}\bar X$$
$$g''(\theta)=2(n+\lambda)\gt0.$$
$g$ is strongly convex, so this stationary point is the unique minimizer. Substituting $\lambda=1/\tau^2$,
$$a=\frac n{n+1/\tau^2}=\frac{n\tau^2}{n\tau^2+1}.$$

**3. The bias–variance decomposition.** Let $\mu=\E[\hat\theta]$ (a constant). Then
$$\E(\hat\theta-\theta)^2=\E\big[(\hat\theta-\mu)+(\mu-\theta)\big]^2=\E(\hat\theta-\mu)^2+2(\mu-\theta)\,\E[\hat\theta-\mu]+(\mu-\theta)^2.$$
Since $\E[\hat\theta-\mu]=\mu-\mu=0$, the middle term vanishes, and $\E(\hat\theta-\theta)^2=\Var(\hat\theta)+(\E[\hat\theta]-\theta)^2$. $\blacksquare$

**Applying it to the MAP.** Since $\E\bar X=\theta$ and $\Var\bar X=\frac1n$ (independent with variance 1),
$$\text{bias}=\E[a\bar X]-\theta=(a-1)\theta=-\frac{\theta}{n\tau^2+1},\qquad \text{variance}=a^2\cdot\frac1n=\frac{n\tau^4}{(n\tau^2+1)^2},$$
$$\text{MSE}=\frac{\theta^2}{(n\tau^2+1)^2}+\frac{n\tau^4}{(n\tau^2+1)^2}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}.$$

**Interpretation and check.** The MSE of the MLE $\bar X$ is $\frac1n$ (zero bias). The MAP is better if and only if $\theta^2\lt2\tau^2+\frac1n$: when the true value is near the 0 that the prior believes in, it accepts a little bias and greatly reduces the variance. Example: with $n=4$ and $\tau^2=\frac12$, $a=\frac23$; if $\bar X=1.2$ then $\hat\theta_{\text{MAP}}=0.8$; with true value $\theta=1$, the MSE is $\frac29\approx0.222\lt\frac14$.
:::

:::warn Common mistakes
- Not writing **why** the normalizing constants and the evidence may be dropped from $\log p(\theta\mid X)$ (they do not depend on θ).
- Writing $\lambda$ as $\frac1{2\tau^2}$: it depends on the leading coefficient of the objective (whether a ½ is attached). The problem's ridge form is $\sum(X_i-\theta)^2+\lambda\theta^2$, so $\lambda=\frac1{\tau^2}$.
- Computing $\Var(a\bar X)=a\Var\bar X$ ($a^2$ is correct).
- Writing only “because the expectation is 0” for why the cross term is 0, and omitting that **$\E[\hat\theta]-\theta$ is a constant**.
- Taking the expectation over $\theta$ as well. Here $\theta$ is the fixed true value.
:::
` },
      p3: { label: 'Problem 3', title: 'The Dual Problem of a Two-Point Hard-Margin SVM', where: 'Support vector machines',
        body: R`
:::def Problem
Consider the following 2-dimensional dataset: $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$.

**1.** We set the primal problem
$$\min_{w,b}\ \frac12\lVert w\rVert^2\qquad\text{s.t. }y_i(w^Tx_i+b)\ge1,\ i=1,2$$
Derive the Lagrangian with multipliers $\alpha_1,\alpha_2\ge0$, minimize it over $w$, $b$, and derive the dual in terms of $\alpha_1,\alpha_2$. Solve for the optimal multipliers.

**2.** Using the optimal multipliers, recover the optimal parameters $w$ and $b$.

**3.** State the separating hyperplane $w^Tx+b=0$ and compute the margin.
:::

:::key Key points
- **The sign of the Lagrangian:** rewrite the constraints as $1-y_i(w^Tx_i+b)\le0$, multiply by $\alpha_i\ge0$, and **add**:
$L(w,b,\alpha)=\frac12\lVert w\rVert^2+\sum_i\alpha_i\{1-y_i(w^Tx_i+b)\}$.
- Memorize **the two stationarity conditions**: $\nabla_wL=0\Rightarrow w=\sum_i\alpha_iy_ix_i$, $\partial L/\partial b=0\Rightarrow\sum_i\alpha_iy_i=0$. The second becomes the **equality constraint** of the dual problem.
- The general form of the dual function: $g(\alpha)=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$. Here $x_1=0$, so only the term $x_2^Tx_2=8$ remains.
- **$b$ is found at a point with $\alpha_i\gt0$ (a support vector)** from $y_i(w^Tx_i+b)=1$ (the complementary slackness condition).
- **Margin** $=\frac1{\lVert w\rVert}$ (the distance from the hyperplane to the nearest point). The width between the two margin boundaries is $\frac2{\lVert w\rVert}$ — check which one is asked, and writing both is safe.
- **Two checks:** primal value $\frac12\lVert w\rVert^2$ = dual value $g(\alpha^*)$ (strong duality), and geometrically, whether the hyperplane is the **perpendicular bisector** of the two points.
:::

:::ex Solution
With two points, both become support vectors, and the hyperplane is the perpendicular bisector of the segment joining them. See whether that intuition and the computation agree.
---
**1. The Lagrangian.** Since $y_1(w^Tx_1+b)=-b$ and $y_2(w^Tx_2+b)=2w_1+2w_2+b$,
$$L=\frac12(w_1^2+w_2^2)+\alpha_1(1+b)+\alpha_2(1-2w_1-2w_2-b),\qquad\alpha_1,\alpha_2\ge0.$$
Minimize over $w,b$ (the stationarity conditions):
$$\frac{\partial L}{\partial w_1}=w_1-2\alpha_2=0,\quad \frac{\partial L}{\partial w_2}=w_2-2\alpha_2=0\ \Rightarrow\ w=(2\alpha_2,\,2\alpha_2)$$
$$\frac{\partial L}{\partial b}=\alpha_1-\alpha_2=0.$$
($L$ is a convex quadratic in $w$, so the stationary point is a minimizer. In $b$ it is linear, so if $\alpha_1\ne\alpha_2$ then $\inf_b L=-\infty$; hence $\alpha_1=\alpha_2$ enters the dual problem as a constraint.)
Substituting, $\frac12\lVert w\rVert^2=4\alpha_2^2$, $-2w_1-2w_2=-8\alpha_2$, and the $b$ term is $(\alpha_1-\alpha_2)b=0$, so
$$g(\alpha)=\alpha_1+\alpha_2-4\alpha_2^2.$$
**Dual problem:** $\max_\alpha\ \alpha_1+\alpha_2-4\alpha_2^2$ s.t. $\alpha_1=\alpha_2$, $\alpha_1,\alpha_2\ge0$.
Setting $\alpha_1=\alpha_2=\alpha$, $h(\alpha)=2\alpha-4\alpha^2$, $h'(\alpha)=2-8\alpha=0\Rightarrow\alpha=\frac14\ (\ge0)$, and $h''=-8\lt0$, so it is a maximum. $\alpha_1^*=\alpha_2^*=\frac14$, dual value $g^*=\frac12-\frac14=\frac14$.

**2. Recovery.** $w^*=(2\alpha_2^*,2\alpha_2^*)=(\frac12,\frac12)$ (the same as the general formula $\sum\alpha_iy_ix_i=\frac14(-1)(0,0)+\frac14(+1)(2,2)$).
Since $\alpha_2^*\gt0$, complementary slackness gives $y_2(w^Tx_2+b)=1$: $\frac12\cdot2+\frac12\cdot2+b=1\Rightarrow b^*=-1$. Check: at $x_1$, $y_1(w^Tx_1+b)=-(0-1)=1$ ✓ (also a support vector).

**3. The hyperplane and the margin.** $\frac12x_1+\frac12x_2-1=0$, i.e., $x_1+x_2=2$. Since $\lVert w^*\rVert=\frac1{\sqrt2}$,
$$\text{margin}=\frac1{\lVert w^*\rVert}=\sqrt2\quad(\text{width between the two boundaries }\tfrac2{\lVert w^*\rVert}=2\sqrt2).$$
**Check.** Primal value $\frac12\lVert w^*\rVert^2=\frac14=g^*$ (strong duality). Half the distance $2\sqrt2$ between the two points is $\sqrt2$, the midpoint $(1,1)$ lies on $x_1+x_2=2$, and the normal $(1,1)$ is parallel to the direction joining the two points — it is indeed the perpendicular bisector.
:::

:::warn Common mistakes
- Writing the sign of the constraint in the Lagrangian backwards, so that $\alpha\le0$ comes out.
- **Not using** $\sum\alpha_iy_i=0$, which comes from $\partial L/\partial b=0$, as a constraint of the dual problem.
- Finding $b$ at a point that is not a support vector (or from an inequality). Always use an equality at a point with $\alpha_i\gt0$.
- Confusing the margin with $\lVert w\rVert$ or $\frac2{\lVert w\rVert}$. Write the definition in one line before answering.
:::
` },
      p4: { label: 'Problem 4', title: 'The Max–Min Inequality and a Counterexample', where: 'Support vector machines · duality',
        body: R`
:::def Problem
Let $X$ and $Y$ be nonempty sets, and let $f:X\times Y\to\mathbb R$. Prove the max–min inequality
$$\max_{x\in X}\min_{y\in Y}f(x,y)\ \le\ \min_{y\in Y}\max_{x\in X}f(x,y)$$
Give a counterexample where equality does not hold.
:::

:::key Key points
- **Define two auxiliary functions**: $g(x)=\min_{y}f(x,y)$ (the row minimum) and $h(y)=\max_{x}f(x,y)$ (the column maximum).
- The key inequality in one line: for **all** $x',y'$, $g(x')\le f(x',y')\le h(y')$.
- Then optimize **one at a time**. The left side does not depend on $y'$, so first take $\min_{y'}$ on the right; then the right side does not depend on $x'$, so take $\max_{x'}$ on the left.
- Add one line saying that even when the maxima and minima do not exist, **the same logic** holds with $\sup$ and $\inf$.
- A **finite table** is the safest counterexample. Compute directly and show the maximum of the row minima and the minimum of the column maxima.
- Meaning: in the SVM, the dual value $d^*=\max_\alpha\min_wL\le\min_w\max_\alpha L=p^*$ (**weak duality**) is exactly this inequality. Equality (strong duality) holds when there is a saddle point.
:::

:::ex Solution
It says that “the best of the worst cases” cannot exceed “the worst of the best cases”. Picturing two players in a game makes it easy.
---
**Proof.** Let $g(x)=\min_{y\in Y}f(x,y)$ and $h(y)=\max_{x\in X}f(x,y)$. Fixing arbitrary $x'\in X$, $y'\in Y$, by the definitions of minimum and maximum,
$$g(x')=\min_yf(x',y)\le f(x',y')\le\max_xf(x,y')=h(y').$$
(1) With $x'$ fixed, this inequality holds for **every** $y'$, so $g(x')$ is a lower bound of $\{h(y'):y'\in Y\}$, and hence $g(x')\le\min_{y'}h(y')$.
(2) Now (1) holds for **every** $x'$, so $\min_{y'}h(y')$ is an upper bound of $\{g(x'):x'\in X\}$, and hence
$$\max_{x'}g(x')\le\min_{y'}h(y'),\quad\text{i.e.}\quad\max_x\min_yf(x,y)\le\min_y\max_xf(x,y).\qquad\blacksquare$$
If the maxima and minima do not exist, replacing $\min,\max$ by $\inf,\sup$ gives $\sup_x\inf_yf\le\inf_y\sup_xf$ by the same argument.

**Counterexample.** $X=Y=\{0,1\}$, $f(x,y)=(x-y)^2$:

| $f(x,y)$ | $y=0$ | $y=1$ | Row minimum $g(x)$ |
|---|---|---|---|
| $x=0$ | 0 | 1 | 0 |
| $x=1$ | 1 | 0 | 0 |
| Column maximum $h(y)$ | 1 | 1 | |

$\max_xg(x)=0$ and $\min_yh(y)=1$, so $0\lt1$ — equality does not hold. (Because no cell is a saddle point, “the minimum of its row and at the same time the maximum of its column”.)
:::

:::warn Common mistakes
- “Applying” $\max$ and $\min$ to both sides at once. You must write, **in order**, which variable is fixed and over which variable you optimize.
- Miscomputing one of $\max\min$ and $\min\max$ in the counterexample. Drawing the table avoids mistakes.
- Giving as a counterexample a function for which equality holds (e.g., $f(x,y)=x^2-y^2$, which has a saddle point).
:::
` },
    },
  };
  EM.en.qz.q1 = {
    title: 'Quiz 1',
    meta: 'M1407.0012 · Prof. Youngjoon Hong · given Sep. 30',
    intro: R`
Both problems are **derivations**. Problem 1 **generalizes Problem 2 of Problem Set 1** (MAP for a Gaussian mean) to vectors and matrices, and Problem 2 **generalizes the He-initialization derivation** from class to the Leaky ReLU.

:::tip What decides the score on this quiz
1. **Drop constants correctly.** Terms independent of $w$ ($\log p(y)$, normalizing constants) may be dropped, but say in one line **what is independent of $w$ and why**.
2. Read off $\lambda$ by multiplying by $\sigma^2$, justified by **multiplying by a positive number does not move the minimizer**.
3. State **why the inverse exists** ($X^TX+\lambda I\succ0$). $X^TX$ itself may be singular.
4. When splitting expectations, say **which independence you use** ($w$ independent of $x$, the $w_i$ independent of each other). There is **no** assumption that the $x_i$ are independent.
5. When using symmetry, handle **the case $z=0$**.
:::
`,
    probs: {
      p1: { label: 'Problem 1', title: 'MAP for the Gaussian Linear Model = Ridge Regression', where: 'Probabilistic regression and regularization',
        body: R`
:::def Problem
Let $X\in\mathbb R^{N\times d}$ be a fixed design matrix, where $N,d\ge1$. For $y\in\mathbb R^N$ and $w\in\mathbb R^d$, consider the Gaussian model
$$y\mid w\sim\N(Xw,\sigma^2I_N),\qquad w\sim\N(0,\tau^2I_d),$$
where $\sigma,\tau\gt0$ are known constants. All densities are conditional on the fixed matrix $X$; this conditioning is omitted from the notation.

**1.** Use Bayes' rule to obtain $-\log p(w\mid y)$ up to an additive constant independent of $w$. Show that maximum a posteriori (MAP) estimation is equivalent to minimizing
$$J_\lambda(w)=\frac12\lVert y-Xw\rVert_2^2+\frac\lambda2\lVert w\rVert_2^2,$$
and determine $\lambda$.

**2.** Differentiate $J_\lambda$ to derive a closed-form expression for the MAP estimate.
:::

:::key Key points
- **Posterior ∝ likelihood × prior.** $p(w\mid y)=\frac{p(y\mid w)p(w)}{p(y)}$, and the denominator $p(y)$ is a constant independent of $w$.
- The density of $\N(\mu,\sigma^2I_N)$ is $(2\pi\sigma^2)^{-N/2}\exp\!\big(-\frac{\lVert y-\mu\rVert^2}{2\sigma^2}\big)$. Its negative log is **squared error / $2\sigma^2$ + constant**.
- The answer is $\boxed{\lambda=\sigma^2/\tau^2}$: more noise or a narrower prior means stronger regularization. ($\lambda=1/\tau^2$ in Problem Set 1, where $\sigma^2=1$, is a special case.)
- The closed form is $\boxed{\hat w_{\text{MAP}}=(X^TX+\lambda I_d)^{-1}X^Ty}$. Invertibility follows from $v^T(X^TX+\lambda I)v=\lVert Xv\rVert^2+\lambda\lVert v\rVert^2\gt0$ for $v\ne0$.
- Check: as $\tau^2\to\infty$ ($\lambda\to0$) we recover least squares (the normal equations); as $\tau^2\to0$, $\hat w\to0$.
:::

:::ex Solution
Write the negative logs of the likelihood and the prior and add them. Try it yourself before opening.
---
**1. Negative log posterior.** By Bayes' rule
$$p(w\mid y)=\frac{p(y\mid w)\,p(w)}{p(y)},\qquad -\log p(w\mid y)=-\log p(y\mid w)-\log p(w)+\log p(y).$$
$p(y)=\int p(y\mid w)p(w)\,dw$ is integrated over $w$, so it does not depend on $w$. Substituting the two densities,
$$-\log p(y\mid w)=\frac1{2\sigma^2}\lVert y-Xw\rVert_2^2+\frac N2\log(2\pi\sigma^2),\qquad -\log p(w)=\frac1{2\tau^2}\lVert w\rVert_2^2+\frac d2\log(2\pi\tau^2).$$
Collecting the constants independent of $w$ into $C$,
$$-\log p(w\mid y)=\frac1{2\sigma^2}\lVert y-Xw\rVert_2^2+\frac1{2\tau^2}\lVert w\rVert_2^2+C.$$
**MAP and $J_\lambda$.** Since $\log$ is increasing, $\argmax_wp(w\mid y)=\argmin_w\{-\log p(w\mid y)\}$. Removing the constant $C$ and multiplying by the positive number $\sigma^2$ does not change the minimizer, so
$$\hat w_{\text{MAP}}=\argmin_w\ \sigma^2\big(-\log p(w\mid y)-C\big)=\argmin_w\ \frac12\lVert y-Xw\rVert_2^2+\frac{\sigma^2}{2\tau^2}\lVert w\rVert_2^2=\argmin_wJ_\lambda(w),\qquad\lambda=\frac{\sigma^2}{\tau^2}.$$

**2. Closed form.** Expanding, $J_\lambda(w)=\frac12\big(y^Ty-2w^TX^Ty+w^TX^TXw\big)+\frac\lambda2w^Tw$. With $\nabla_w(w^Tm)=m$ and $\nabla_w(w^TAw)=(A+A^T)w=2Aw$ (symmetric $A=X^TX$),
$$\nabla_wJ_\lambda(w)=-X^Ty+X^TXw+\lambda w=-X^T(y-Xw)+\lambda w.$$
Setting it to 0 gives $(X^TX+\lambda I_d)w=X^Ty$.
**Invertibility.** For $v\ne0$, $v^T(X^TX+\lambda I_d)v=\lVert Xv\rVert_2^2+\lambda\lVert v\rVert_2^2\ge\lambda\lVert v\rVert_2^2\gt0$, so $X^TX+\lambda I_d\succ0$ is invertible. (This holds even if the columns of $X$ are dependent or $N\lt d$.)
**It is the minimizer.** The Hessian $\nabla^2J_\lambda=X^TX+\lambda I_d\succ0$, so $J_\lambda$ is strongly convex and its unique stationary point is the unique minimizer:
$$\hat w_{\text{MAP}}=(X^TX+\lambda I_d)^{-1}X^Ty,\qquad\lambda=\frac{\sigma^2}{\tau^2}.\qquad\blacksquare$$

**Numerical check.** With $d=1$, $X=(1,1)^T$, $y=(1,3)^T$, $\sigma^2=\tau^2=1$: $\lambda=1$, $X^TX=2$, $X^Ty=4$, so $\hat w_{\text{MAP}}=\frac4{2+1}=\frac43$, **shrunk** toward 0 from the least-squares value $\frac42=2$.

**Remark.** The posterior itself is Gaussian, $\N\big(\hat w_{\text{MAP}},\,\sigma^2(X^TX+\lambda I)^{-1}\big)$, so the MAP equals the posterior mean. Also $(X^TX+\lambda I_d)^{-1}X^T=X^T(XX^T+\lambda I_N)^{-1}$, so $\hat w=X^T(XX^T+\lambda I_N)^{-1}y$, which needs only an $N\times N$ inverse when $N\lt d$ — exactly the form of [[ch04:4.5|kernel ridge regression]].
:::

:::warn Common mistakes
- Writing $\lambda=1/\tau^2$ or $\tau^2/\sigma^2$. Multiplying by $\sigma^2$ so that the first term of $J_\lambda$ has coefficient $\frac12$ gives $\lambda=\sigma^2/\tau^2$.
- Dropping $p(y)$ without a reason, or treating the normalizing constant $(2\pi\sigma^2)^{-N/2}$ as a function of $w$.
- Assuming $(X^TX)^{-1}$ exists. Nothing is assumed about $N,d$, so invertibility must come from the positive definiteness of $X^TX+\lambda I$.
- Getting the sign of the gradient ($-X^T(y-Xw)$) wrong, or forgetting the symmetry needed for $\nabla(w^TAw)=2Aw$.
:::
` },
      p2: { label: 'Problem 2', title: 'Second-Moment Preservation for the Leaky ReLU and He Initialization', where: 'Activation functions and weight initialization',
        body: R`
:::def Problem
For $0\le\alpha\le1$, define
$$\phi_\alpha(z)=\begin{cases}z,&z\ge0,\\\alpha z,&z\lt0.\end{cases}$$
Let $n\ge1$ and let $x\in\mathbb R^n$ be a random vector with $\E[x_i^2]=q$ for every $i$, where $0\lt q\lt\infty$. The weights $w_1,\dots,w_n$ are independent and identically distributed as $\N(0,s^2)$, with $s^2\gt0$. The entire weight vector is independent of $x$. Set
$$z=\sum_{i=1}^nw_ix_i,\qquad h=\phi_\alpha(z).$$

**1.** Prove that $\E[z]=0$ and $\E[z^2]=ns^2q$.

**2.** You may use, without proof, that $z$ and $-z$ have the same distribution. Use this symmetry to prove
$$\E[h^2]=\frac{1+\alpha^2}2\,\E[z^2].$$

**3.** Determine $s^2$ so that the output second moment equals the common per-coordinate input second moment, namely $\E[h^2]=q$. Evaluate your answer at $\alpha=0$ and $\alpha=1$, and identify the corresponding activations.
:::

:::key Key points
- In **part 1**, the single fact $\E[w_iw_j]=s^2\delta_{ij}$ kills the cross terms. Independence of the $x_i$ or $\E[x_i]=0$ is **not needed** — the independence and zero mean of the weights do all the work.
- In **part 2**, split $h^2=z^2\mathbf 1\{z\ge0\}+\alpha^2z^2\mathbf 1\{z\lt0\}$ and use symmetry to show that each half has expectation **$\frac12\E[z^2]$**. Gaussianity is not used.
- The answer to **part 3** is $\boxed{s^2=\dfrac2{(1+\alpha^2)\,n}}$. At $\alpha=0$ (ReLU) it is $2/n$ — **He (Kaiming) initialization**; at $\alpha=1$ (the identity, i.e., linear) it is $1/n$ — **LeCun initialization** (Xavier with equal fan-in and fan-out).
- What is preserved is the **second moment, not the variance**. The ReLU output has nonzero mean, so $\E[h^2]\ne\Var(h)$.
:::

:::ex Solution
The three parts build on each other. Try it yourself before opening.
---
**Preliminary: integrability.** Since $\E[x_i^2]=q\lt\infty$, Cauchy–Schwarz gives $\E|x_i|\le\sqrt q$ and $\E|x_ix_j|\le\sqrt{\E x_i^2\,\E x_j^2}=q$. The $w_i$ are Gaussian, so all their moments are finite. Hence every expectation below is finite, and the expectation of a product of independent random variables is the product of the expectations.

**1.** By linearity and the independence of $w_i$ and $x_i$,
$$\E[z]=\sum_{i=1}^n\E[w_ix_i]=\sum_{i=1}^n\E[w_i]\,\E[x_i]=\sum_{i=1}^n0\cdot\E[x_i]=0.$$
Expanding the square, and since the weight vector $(w_1,\dots,w_n)$ is independent of $x$, $\E[w_iw_jx_ix_j]=\E[w_iw_j]\,\E[x_ix_j]$:
$$\E[z^2]=\sum_{i=1}^n\sum_{j=1}^n\E[w_iw_j]\,\E[x_ix_j].$$
For $i\ne j$, $w_i,w_j$ are independent, so $\E[w_iw_j]=\E[w_i]\E[w_j]=0$; for $i=j$, $\E[w_i^2]=\Var(w_i)+(\E w_i)^2=s^2$. Thus $\E[w_iw_j]=s^2\delta_{ij}$ and
$$\E[z^2]=\sum_{i=1}^ns^2\,\E[x_i^2]=ns^2q.$$

**2.** Split $h^2$ by sign. If $z\ge0$ then $h^2=z^2$, and if $z\lt0$ then $h^2=\alpha^2z^2$, so
$$h^2=z^2\mathbf 1\{z\ge0\}+\alpha^2z^2\mathbf 1\{z\lt0\},\qquad \E[h^2]=A+\alpha^2B,$$
$$A=\E\big[z^2\mathbf 1\{z\ge0\}\big],\qquad B=\E\big[z^2\mathbf 1\{z\lt0\}\big].$$
**$A=B$.** Since $z$ and $-z$ have the same distribution, $\E[g(z)]=\E[g(-z)]$ for $g(t)=t^2\mathbf 1\{t\lt0\}$:
$$B=\E\big[z^2\mathbf 1\{z\lt0\}\big]=\E\big[(-z)^2\mathbf 1\{-z\lt0\}\big]=\E\big[z^2\mathbf 1\{z\gt0\}\big].$$
At $z=0$ we have $z^2=0$, so $z^2\mathbf 1\{z\gt0\}=z^2\mathbf 1\{z\ge0\}$ and $B=A$.
**Sum.** The two indicators sum to 1, so $A+B=\E[z^2]$. Together with $A=B$, $A=B=\frac12\E[z^2]$ and
$$\E[h^2]=\frac12\E[z^2]+\frac{\alpha^2}2\E[z^2]=\frac{1+\alpha^2}2\,\E[z^2].\qquad\blacksquare$$

**3.** Combining 1 and 2, $\E[h^2]=\frac{1+\alpha^2}2\,ns^2q$. For this to equal $q$ (dividing by $q\gt0$),
$$\frac{(1+\alpha^2)\,n\,s^2}2=1\iff s^2=\frac2{(1+\alpha^2)\,n}.$$

| $\alpha$ | Activation | $s^2$ | Name |
|---|---|---|---|
| $0$ | $\phi_0(z)=\max(0,z)$ — **ReLU** | $\dfrac2n$ | He (Kaiming) initialization |
| $1$ | $\phi_1(z)=z$ — **identity** (linear, no activation) | $\dfrac1n$ | LeCun initialization · Xavier $\frac2{n_{in}+n_{out}}$ with equal widths |
| $0\lt\alpha\lt1$ | **Leaky ReLU** (e.g., $\alpha=0.01$) | $\dfrac2{(1+\alpha^2)n}\approx\dfrac2n$ | He initialization for the Leaky ReLU |

**Interpretation.** The ReLU cuts off the negative half and so **halves** the second moment; doubling the weight variance ($2/n$) compensates. Keeping the negative side scaled by $\alpha$ reduces the loss to $\frac{1-\alpha^2}2$, so less compensation is needed. With this $s^2$ the second moment is kept layer after layer, so the signal neither explodes nor vanishes exponentially through a deep network.
:::

:::warn Common mistakes
- Assuming the $x_i$ are independent when expanding $\E[z^2]$. The cross terms vanish because $\E[w_iw_j]=0$; $\E[x_ix_j]$ need not be 0.
- Writing $\E[h^2]=\frac{1+\alpha^2}2\E[z^2]$ as “$\Var(h)$”. The ReLU output has positive mean, so variance and second moment differ.
- Not mentioning the difference between $\mathbf 1\{z\gt0\}$ and $\mathbf 1\{z\ge0\}$ (at $z=0$). One line saying $z^2=0$ there suffices.
- Calling $\alpha=1$ just “a Leaky ReLU”. $\phi_1$ is the identity, i.e., a **linear layer**.
:::
` },
    },
  };
})();
