/* English text — 07 Support Vector Machines (W3 Mon slides 19–31, notes, Problem Set 1 Problems 3–4). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    distance: R`$\mathbf x_p=\mathbf x-\mathbf d$ lies on the plane and $\mathbf d$ is parallel to the normal $\mathbf w$. From this we get $\alpha=(\mathbf w^T\mathbf x+b)/\mathbf w^T\mathbf w$, and the distance is $\lvert\mathbf w^T\mathbf x+b\rvert/\lVert\mathbf w\rVert_2$.`,
    margin: R`The support vectors (circled points) lie on $\mathbf w^T\mathbf x+b=\pm1$, each at distance $1/\lVert\mathbf w\rVert$ from the decision plane $H_0$. The full width of the margin is $2/\lVert\mathbf w\rVert$.`,
    svm2pt: R`The two points of Problem 3 of Problem Set 1, $x_1=(0,0)$ (open circle, $y=-1$) and $x_2=(2,2)$ ($y=+1$). The maximum-margin hyperplane is the perpendicular bisector $x_1+x_2=2$ (solid line) of the segment joining the two points, and the dashed lines $x_1+x_2=0$ and $x_1+x_2=4$ are $H_-$ and $H_+$. The short segment is the margin $\sqrt2$. Adding a third point $x_3=(4,1)$ changes nothing: it lies outside $H_+$, so $\alpha_3=0$ and the solution stays the same.`,
  });
  EM.en.ch[7] = {
    title: 'Support Vector Machines',
    fig: R`The maximum-margin hyperplane (bold line), the two margin boundaries (dashed), and the circled support vectors`,
    tagline: R`The margin is invariant to scaling, so fixing $\min\lvert w^Tx+b\rvert=1$ turns “maximize the margin” into “minimize $\frac12\lVert w\rVert^2$”.`,
    summary: R`For linearly separable binary data $y_i\in\{1,-1\}$, we look for the hyperplane with the largest gap (margin) between the two classes. In the notes we derived the distance $\lvert w^Tx+b\rvert/\lVert w\rVert_2$ between a point and a hyperplane, and used the scale invariance of the margin to turn the problem into $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$. Moving the constraints into the penalty $\max_{\alpha\ge0}\alpha_i(1-y_i(\cdot))$ gives a min–max problem, and weak duality leads to the Lagrange dual problem (a quadratic program); the intercept $b$ is found from a support vector. The last two sections are Problem 3 (solving the dual of a two-point dataset to the end) and Problem 4 (the max–min inequality and a counterexample) of Problem Set 1.`,
    goals: [
      R`Show that $w$ is the normal of the hyperplane $w^Tx+b=0$, and write the classification rule and the “correct classification” condition $y_i(w^Tx_i+b)\ge0$`,
      R`Derive the distance $\lvert w^Tx+b\rvert/\lVert w\rVert_2$ between a point and a hyperplane from the foot of the perpendicular`,
      R`Use the scale invariance of the margin to turn margin maximization into $\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$`,
      R`Prove how a penalty function expresses a constraint, and prove weak duality $\min\max\ge\max\min$`,
      R`Derive $w=\sum\alpha_iy_ix_i$, $\sum\alpha_iy_i=0$ and the dual objective from the stationarity conditions of the Lagrangian, and compute $\alpha$, $w$, $b$, and the margin to the end on a small dataset`,
      R`Explain with KKT complementary slackness why only the support vectors contribute to the solution`,
      R`Prove the max–min inequality for an arbitrary function and construct a counterexample where equality fails`,
    ],
    secTitles: { '7.1': 'Hyperplanes · classification', '7.2': 'Point–plane distance', '7.3': 'Margin · primal', '7.4': 'Lagrange duality', '7.5': 'b · support vectors', '7.6': 'Dual by hand', '7.7': 'Max–min inequality' },
    secs: {
      '7.1': { title: 'Hyperplanes and Linear Classification', body: R`
:::idea In plain words
We want to split red and blue points in the plane with a single line. A line is determined by a “direction” (the normal $w$) and a “position” ($b$), and which side of the line a point is on is told by the **sign** of $w^Tx+b$. In three dimensions the line becomes a plane, and in general dimension a **hyperplane**.
:::

We write a hyperplane in $\mathbb R^n$ as $f(x)=x^Tw+b=\sum_ix_iw_i+b=0$. Dividing both sides by $\lVert w\rVert$,
$$\frac{x^Tw}{\lVert w\rVert}=P_w(x)=-\frac b{\lVert w\rVert}.$$
The left side is the **length of the projection** of $x$ onto the unit vector $w/\lVert w\rVert$ (notes: “project $x^T$ onto $w/\lVert w\rVert$”)[[@em:ch08:9.2|The component of a vector $x$ in the direction $u$ is $x\cdot u/\lVert u\rVert$.]]. Every point of the plane has the same projection length $-b/\lVert w\rVert$, so $w$ is the **normal** of the plane, and the distance from the origin to the plane is $\lvert b\rvert/\lVert w\rVert$.

**Why $w$ is the normal, in one line.** For two points $x,x'$ on the plane, $w^Tx+b=0=w^Tx'+b$ gives $w^T(x-x')=0$ — $w$ is perpendicular to every direction $x-x'$ within the plane.

**Classification rule.** $y=\sign(f(x))\in\{1,-1\}$: if $f(x)>0$ then $y=1$ ($x\in P$), and if $f(x)<0$ then $y=-1$ ($x\in N$).

Suppose the training data $\{(x_k,y_k)\}_{k=1}^K$ are linearly separable. Writing the four cases of prediction $\hat y=\sign(f(x))$ versus label (positive or negative label × right or wrong) in one formula, the condition for classifying every point correctly is
$$y_i(x_i^Tw+b)\ge0\qquad\forall i.$$
(This is why we write the labels as $\pm1$: when correct, $y_i$ and $f(x_i)$ have the same sign, so the product is positive.) Infinitely many hyperplanes satisfy this condition. Which is the best among them?

:::ex Example 1 — Classifying by the sign
With $w=(1,-1)$ and $b=0.5$, on which side are $x=(2,1)$ and $x'=(0,3)$? What is the distance from the origin to the plane?
---
$f(x)=2-1+0.5=1.5>0$, so $+1$; $f(x')=0-3+0.5=-2.5<0$, so $-1$. The distance to the origin is $\lvert b\rvert/\lVert w\rVert=0.5/\sqrt2\approx0.354$.
:::
` },
      '7.2': { title: 'Distance from a Point to a Hyperplane', body: R`
:::idea In plain words
The distance from a point to a plane is the length of the **perpendicular**. The perpendicular points along the normal $w$ of the plane, so we just compute “how far to go from $x$ in the direction of $w$ to reach the plane”.
:::

:::key Distance from a point to a hyperplane
The distance between the hyperplane $H_{w,b}=\{x:w^Tx+b=0\}$ and a point $x$ is
$$\mathrm{dist}(x,H)=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}.$$
:::

:::hand Class notes — derivation
Let $x_p$ be the foot of the perpendicular from $x$ to the plane and $d=x-x_p$. Then $x_p=x-d$ lies on the plane, so $w^T(x-d)+b=0$. $d$ is parallel to the normal $w$, so $d=\alpha w$ ($\alpha$ a scalar). Substituting,
$$w^T(x-\alpha w)+b=0\ \Rightarrow\ \alpha=\frac{w^Tx+b}{w^Tw}.$$
$$\lVert d\rVert_2=\sqrt{d^Td}=\sqrt{\alpha^2w^Tw}=\lvert\alpha\rvert\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{\sqrt{w^Tw}}=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}.$$
:::

:::fig distance
:::

Without the absolute value, $\frac{w^Tx+b}{\lVert w\rVert}$ is the **signed distance**, positive on the side $w$ points to. Multiplying by $y$, $\frac{y(w^Tx+b)}{\lVert w\rVert}$ is “how far the point is on the correct side” (the geometric margin).

:::ex Example 2 — Computing a distance
What is the distance between the point $(3,4)$ and the hyperplane $3x_1+4x_2-10=0$?
---
$\frac{\lvert9+16-10\rvert}{\sqrt{9+16}}=\frac{15}5=3$. The foot of the perpendicular is $x_p=x-\alpha w$ with $\alpha=15/25=0.6$, so $x_p=(3,4)-0.6(3,4)=(1.2,1.6)$. Check: $3(1.2)+4(1.6)=10$ ✓.
:::

:::def Margin
The margin of a hyperplane $H$ with respect to data $D$ is the distance to the nearest point.
$$r(w,b)=\min_{x\in D}\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}$$
:::
` },
      '7.3': { title: 'Margin Maximization and the Hard-Margin SVM', body: R`
:::idea In plain words
Build **the widest road** between the two groups of points, and take the center line of the road as the decision boundary. The wider the road, the more likely a new point stays on the correct side even if it wobbles a little. The points touching the edges of the road “support” the road, hence the name **support vectors**.
:::

The best decision plane $H_0$ is the plane with the **maximum margin**, lying midway between the nearest points of the two classes. The two planes through those nearest points, parallel to $H_0$, are called $H_+$ and $H_-$.

**Scale invariance (notes).** If $\beta>0$, $(\beta w,\beta b)$ represents the same plane and $r(\beta w,\beta b)=r(w,b)$. Hence we are free to choose the size of $(w,b)$. (The numerator and the denominator each get one factor $\beta$, which cancels: $\frac{\lvert\beta w^Tx+\beta b\rvert}{\lVert\beta w\rVert}=\frac{\beta\lvert w^Tx+b\rvert}{\beta\lVert w\rVert}$.)

The flow of the notes:
$$\max_{w,b}r(w,b)=\max_{w,b}\frac1{\lVert w\rVert}\Big[\min_{x\in D}\lvert w^Tx+b\rvert\Big]\quad\text{s.t. }y_i(w^Tx_i+b)\ge0.$$
Choosing the scale so that $\min_{x\in D}\lvert w^Tx+b\rvert=1$, the objective becomes $1/\lVert w\rVert$, and maximizing it is the same as minimizing $w^Tw$. The two constraints “$y_i(w^Tx_i+b)\ge0$” and “$\min_i\lvert w^Tx_i+b\rvert=1$” together are equivalent to “$y_i(w^Tx_i+b)\ge1$”.

**Why the last equivalence holds.** (⇒) With correct classification, $y_i(w^Tx_i+b)=\lvert w^Tx_i+b\rvert\ge\min_j\lvert w^Tx_j+b\rvert=1$. (⇐) If $y_i(\cdot)\ge1$, the classification is correct and $\min_i\lvert\cdot\rvert\ge1$. If the minimum were greater than 1, we could shrink $(w,b)$ (rescale) to make $\lVert w\rVert$ smaller, so at the optimum the minimum is exactly 1.

:::key Hard-margin SVM (primal problem)
$$\min_{w,b}\ \frac12w^Tw=\frac12\lVert w\rVert^2$$
$$\text{s.t. }\ y_i(x_i^Tw+b)\ge1\ \ (\text{i.e. }1-y_i(x_i^Tw+b)\le0),\ \ i=1,\dots,K$$
At the optimum, $H_\pm:\ x^Tw+b=\pm1$, the margin is $1/\lVert w\rVert$, and the width between the two planes is $2/\lVert w\rVert$[[@ml:ch12:15.1b|With a large margin, the sample complexity depends on (radius/margin)² instead of the dimension.]].
:::

:::fig margin
:::

Points of $P$ satisfy $x_i^Tw+b\ge1$ and points of $N$ satisfy $x_i^Tw+b\le-1$; the points where equality holds (= on $H_\pm$) are the **support vectors**: $x_i^Tw+b=y_i$.

:::note The denominator in the notes
The notes wrote the margin as $\min\lvert w^Tx+b\rvert/w^Tw$, but the denominator of the distance formula is $\sqrt{w^Tw}=\lVert w\rVert_2$. Since $t\mapsto t^2$ is increasing for $t\ge0$, “maximize $1/\lVert w\rVert$ ⇔ minimize $\lVert w\rVert$ ⇔ minimize $w^Tw$”, so the conclusion is the same. The equivalence of the constraints is written out in detail on the proof page.
:::

**Why use $\frac12$ and the square.** Minimizing $\lVert w\rVert$ and minimizing $\frac12\lVert w\rVert^2$ give the same answer, but the latter is a quadratic function differentiable everywhere, so the problem becomes a convex quadratic program and the gradient is neatly $w$.

### Going deeper: the soft margin

If the data are not perfectly separable, no $w$ satisfies the constraints. The soft-margin SVM introduces slack variables $\xi_i\ge0$, relaxes the constraints to $y_i(w^Tx_i+b)\ge1-\xi_i$, and minimizes $\frac12\lVert w\rVert^2+C\sum\xi_i$. The optimal $\xi_i=\max(0,1-y_i(w^Tx_i+b))$, so this is the same as minimizing the **hinge loss** + $L_2$ regularization, which can be compared side by side with logistic regression (logistic loss + regularization)[[@ml:ch12:15.2|Soft SVM and the hinge loss.]]. The only change in the dual problem is that the constraint becomes $0\le\alpha_i\le C$.
` },
      '7.4': { title: 'Lagrange Multipliers and the Dual Problem', body: R`
:::idea In plain words
Constrained optimization is hard. So we attach “a fine for violating a constraint” to the objective and turn it into an unconstrained problem. If we imagine that the **opponent** chooses the unit price $\alpha_i$ of the fine (the Lagrange multiplier), it becomes a game in which we try to decrease the objective with $w,b$ and the opponent tries to increase it with $\alpha$. Depending on who moves first, we get the primal or the dual problem, and “the one who moves first is at a disadvantage” is weak duality.
:::

**Constraints as penalties.** We turn the constrained problem into an unconstrained one.
$$\min_{w,b}\ \frac12w^Tw+\sum_i\max_{\alpha_i\ge0}\alpha_i\big(1-y_i(x_i^Tw+b)\big)$$
(Notes) If the bracket $1-y_i(\cdot)$ is $\le0$ (constraint satisfied), the maximum is at $\alpha_i=0$ and the penalty is 0; if the bracket is positive (violated), $\alpha_i\to\infty$ makes the penalty $+\infty$. Hence this problem is the same as the primal problem.

### Learning it on a small example

Let us solve $\min x^2$ s.t. $x\ge1$ (answer: $x=1$, value 1) the same way. Write the constraint as $1-x\le0$ and let $L(x,\alpha)=x^2+\alpha(1-x)$, $\alpha\ge0$.
- **Primal** $\min_x\max_{\alpha\ge0}L$: if $x<1$, $\max_\alpha=\infty$; if $x\ge1$, $\max_\alpha=x^2$ ($\alpha=0$). The minimum is 1, at $x=1$.
- **Dual** $\max_{\alpha\ge0}\min_xL$: differentiating in $x$, $2x-\alpha=0$, $x=\alpha/2$. Substituting, $g(\alpha)=\frac{\alpha^2}4+\alpha-\frac{\alpha^2}2=\alpha-\frac{\alpha^2}4$. $g'(\alpha)=1-\frac\alpha2=0$ gives $\alpha=2$, $g(2)=1$.
The two values agree (strong duality), and from the dual solution $\alpha=2$ we recover the original answer $x=\alpha/2=1$. $\alpha=2>0$ means the constraint is “tight” (equality at $x=1$).

:::key The SVM dual problem
Lagrangian $L_p(w,b,\alpha)=\frac12w^Tw+\sum_i\alpha_i\big(1-y_i(x_i^Tw+b)\big)$, $\alpha_i\ge0$.
$$\min_{w,b}\max_{\alpha\ge0}L_p\ \ge\ \max_{\alpha\ge0}\min_{w,b}L_p\qquad(\text{weak duality})$$
$$\nabla_wL_p=0\Rightarrow w=\sum_i\alpha_iy_ix_i,\qquad \frac{\partial L_p}{\partial b}=0\Rightarrow\sum_i\alpha_iy_i=0$$
$$\text{Dual problem:}\ \ \max_\alpha\ \sum_i\alpha_i-\frac12\sum_i\sum_j\alpha_i\alpha_jy_iy_jx_i^Tx_j\quad\text{s.t. }\alpha_i\ge0,\ \sum_i\alpha_iy_i=0$$
:::

The $\alpha_i$ are called **Lagrange multipliers**. The primal problem is convex (quadratic objective, affine constraints) and has a solution, so in this case equality (strong duality) holds and we may solve the dual instead. The dual is a **quadratic program** (QP) in $\alpha$, and the important point is that the data enter **only through the inner products $x_i^Tx_j$**. Replacing the inner product with a kernel $K(x_i,x_j)$ gives a nonlinear SVM[[ch04:4.4|The kernel trick: with inner products alone, compute without the feature map.]].

**Computing the stationarity conditions.** The terms of $L_p$ containing $w$ are $\frac12w^Tw-w^T\sum_i\alpha_iy_ix_i$, so $\nabla_wL_p=w-\sum_i\alpha_iy_ix_i$. The term containing $b$ is $-b\sum_i\alpha_iy_i$, so $\partial L_p/\partial b=-\sum_i\alpha_iy_i$. $L_p$ is **linear** in $b$, so if $\sum\alpha_iy_i\ne0$, $b\to\pm\infty$ gives $\min_b L_p=-\infty$. That is why $\sum\alpha_iy_i=0$ enters the dual problem as a **constraint**.

**Deriving the dual objective.** Putting the two stationarity conditions into $L_p=\frac12w^Tw+\sum_i\alpha_i-w^T\sum_i\alpha_iy_ix_i-b\sum_i\alpha_iy_i$, the $b$ term is 0 and $w^T\sum\alpha_iy_ix_i=w^Tw$, so
$$L=\sum_i\alpha_i-\frac12w^Tw=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$
The last equality expands $w^Tw=\big(\sum_i\alpha_iy_ix_i\big)^T\big(\sum_j\alpha_jy_jx_j\big)$.

:::warn The direction of weak duality
The side with $\min$ outside ($\min\max$) is **greater than or equal**. It is the same inequality as the max–min inequality $\max_x\min_yf\le\min_y\max_xf$ of Section 7.7, with only the variable names changed (here the maximizing variable is $\alpha$). If you get confused, remember “the one who moves later has the advantage”.
:::

### Going deeper: the KKT conditions

If strong duality holds for a convex problem, an optimal solution $(w^*,b^*,\alpha^*)$ satisfies all four of the following conditions (KKT), and conversely anything satisfying them is optimal.
- Stationarity: $w^*=\sum\alpha_i^*y_ix_i$, $\sum\alpha_i^*y_i=0$
- Primal feasibility: $y_i(w^{*T}x_i+b^*)\ge1$
- Dual feasibility: $\alpha_i^*\ge0$
- Complementary slackness: $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$

A sufficient condition for strong duality (Slater's condition) is “there is a point satisfying every inequality strictly”; with linearly separable data we can scale up to get $y_i(w^Tx_i+b)>1$, so it holds[[@ml:ch12:15.4|Lagrange duality.]].
` },
      '7.5': { title: 'Finding b and the Support Vectors', body: R`
:::idea In plain words
Solving the dual problem gives a multiplier $\alpha_i$ for each point. Most points have $\alpha_i=0$ — they are far from the road and have no influence on where the road is. $w$ is determined by the points with $\alpha_i>0$ alone, i.e., the support vectors touching the edges of the road, and putting one of them into the boundary equation gives $b$.
:::

Once $\alpha$ is found from the dual problem, $w=\sum_i\alpha_iy_ix_i$. The intercept is found from a single support vector.

:::key The intercept b of the SVM
At a support vector $x_i$, $y_i(x_i^Tw+b)=1$. Multiplying both sides by $y_i$ and using $y_i^2=1$,
$$x_i^Tw+b=y_i\ \Longrightarrow\ b=y_i-x_i^Tw.$$
:::

**Why only the support vectors matter (KKT complementary slackness).** At the optimum, $\alpha_i\big(1-y_i(x_i^Tw+b)\big)=0$ holds for every $i$. Hence a point outside the margin ($y_i(\cdot)>1$) has $\alpha_i=0$, and only the points with $\alpha_i>0$, i.e., the support vectors on $H_\pm$, contribute to $w=\sum\alpha_iy_ix_i$. Deleting the remaining points does not change the solution.

**Why complementary slackness holds.** Under strong duality, $\frac12\lVert w^*\rVert^2=L_p(w^*,b^*,\alpha^*)=\frac12\lVert w^*\rVert^2+\sum_i\alpha_i^*\big(1-y_i(\cdot)\big)$, so $\sum_i\alpha_i^*(1-y_i(\cdot))=0$. Each term is the product of $\alpha_i^*\ge0$ and $1-y_i(\cdot)\le0$, hence $\le0$, and if the sum is 0, **each term is 0**.

**Prediction.** $\hat y=\sign\big(\sum_i\alpha_iy_ix_i^Tx+b\big)$ — again only inner products are used. For numerical stability, in practice the values of $b$ obtained from all the support vectors are averaged.

:::ex Example 3 — Two points in one dimension
What is the hard-margin SVM for $x_1=1$ ($y=+1$) and $x_2=-1$ ($y=-1$)?
---
**From the picture first.** The two points are symmetric about 0, so the boundary is the midpoint 0, i.e., $b=0$. Both points are support vectors, so $w\cdot1+0=1$, $w=1$. We confirm this with the dual problem.

**1. $\alpha_1=\alpha_2$ from the constraint.** Putting $y_1=+1$, $y_2=-1$ into $\sum_i\alpha_iy_i=0$ gives $\alpha_1-\alpha_2=0$. So we set $\alpha_1=\alpha_2=\alpha$.

**2. Plugging numbers into the dual objective.** In the general form of Section 7.4,
$$g(\alpha)=\sum_i\alpha_i-\frac12\sum_i\sum_j\alpha_i\alpha_j\,y_iy_j\,x_i^Tx_j$$
the first term is $\alpha+\alpha=2\alpha$. The double sum in the second term is the sum of the four cells $(i,j)$. Since $y_1x_1=(+1)(1)=1$ and $y_2x_2=(-1)(-1)=1$, $y_iy_jx_ix_j=(y_ix_i)(y_jx_j)$ is 1 in all four cells.

| $(i,j)$ | $y_iy_jx_ix_j$ | value of the cell |
|---|---|---|
| (1,1) | $(1)(1)(1)(1)=1$ | $\alpha^2$ |
| (2,2) | $(-1)(-1)(-1)(-1)=1$ | $\alpha^2$ |
| (1,2) | $(1)(-1)(1)(-1)=1$ | $\alpha^2$ |
| (2,1) | $(-1)(1)(-1)(1)=1$ | $\alpha^2$ |

The double sum is $4\alpha^2$ (two diagonal cells, $1+1$, and two equal cross terms, $2$), so
$$g(\alpha)=2\alpha-\frac12\cdot4\alpha^2=2\alpha-2\alpha^2.$$
**A faster way:** the double sum is the expansion of $\lVert w\rVert^2$ (the derivation of Section 7.4), so from $w=\sum_i\alpha_iy_ix_i=\alpha(1)(1)+\alpha(-1)(-1)=2\alpha$ we get directly $\lVert w\rVert^2=4\alpha^2$ and $g=2\alpha-\frac12(4\alpha^2)$.

**3. Maximize.** $g'(\alpha)=2-4\alpha=0$ gives $\alpha=\frac12$ ($\ge0$), and $g''=-4\lt0$, so it is a maximum.

**4. Recover and check.** $w=2\alpha=1$. $b=y_1-x_1w=1-1=0$ (from the support vector $x_1$). The margin is $1/\lvert w\rvert=1$ — half the distance 2 between the two points. The primal value $\frac12w^2=\frac12$ and the dual value $g(\frac12)=1-\frac12=\frac12$ agree, confirming strong duality as well.
:::
` },
      '7.6': { title: 'Solving the Dual to the End on a Small Dataset', body: R`
:::idea In plain words
Exams ask you to go through Lagrangian → stationarity conditions → dual problem → $\alpha$ → $w,b$ → margin **from start to finish** by hand, on a dataset of two or three points. Once you know the order, the computation is short. Always check the result with a picture: with two points, the answer is the **perpendicular bisector** of the segment joining them.
:::

### Problem Set 1, Problem 3

Consider the following 2-dimensional dataset: $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$. The primal problem is
$$\min_{w,b}\ \frac12\lVert w\rVert^2\quad\text{s.t. }y_i(w^Tx_i+b)\ge1,\ i=1,2.$$

**Step 1 — the Lagrangian.** With multipliers $\alpha_1,\alpha_2\ge0$,
$$\begin{aligned}L(w,b,\alpha)&=\frac12\lVert w\rVert^2+\alpha_1\big(1-y_1(w^Tx_1+b)\big)+\alpha_2\big(1-y_2(w^Tx_2+b)\big)\\&=\frac12\lVert w\rVert^2+\alpha_1(1+b)+\alpha_2\big(1-2w_1-2w_2-b\big).\end{aligned}$$
($x_1=0$ gives $w^Tx_1=0$, and $y_1=-1$ gives $1-y_1b=1+b$.)

**Step 2 — minimize over $w,b$.**
$$\nabla_wL=w-\alpha_2(2,2)^T=0\ \Rightarrow\ w=(2\alpha_2,\ 2\alpha_2),$$
$$\frac{\partial L}{\partial b}=\alpha_1-\alpha_2=0\ \Rightarrow\ \alpha_1=\alpha_2.$$
These agree with the general formulas $w=\sum\alpha_iy_ix_i=\alpha_1(-1)(0,0)+\alpha_2(+1)(2,2)$ and $\sum\alpha_iy_i=-\alpha_1+\alpha_2=0$.

**Step 3 — the dual function.** Substituting ($\lVert w\rVert^2=8\alpha_2^2$, $2w_1+2w_2=8\alpha_2$, and the $b$ terms $\alpha_1b-\alpha_2b=0$),
$$g(\alpha_1,\alpha_2)=\frac12\cdot8\alpha_2^2+\alpha_1+\alpha_2-8\alpha_2^2=\alpha_1+\alpha_2-4\alpha_2^2.$$
With the general formula $\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$ as well: every inner product with $x_1$ is 0, so only the term $x_2^Tx_2=8$ remains, giving $\alpha_1+\alpha_2-\frac12\cdot8\alpha_2^2$. The same. The dual problem is
$$\max_{\alpha_1,\alpha_2\ge0}\ \alpha_1+\alpha_2-4\alpha_2^2\quad\text{s.t. }\alpha_1=\alpha_2.$$

**Step 4 — the optimal multipliers.** Setting $\alpha_1=\alpha_2=\alpha$ gives $h(\alpha)=2\alpha-4\alpha^2$, and $h'(\alpha)=2-8\alpha=0$ gives $\alpha=\tfrac14$ ($h''=-8<0$, a maximum). Hence
$$\alpha_1^*=\alpha_2^*=\frac14,\qquad g^*=\frac14.$$

**Step 5 — recover $w,b$.** $w^*=2\alpha_2^*(1,1)=\big(\tfrac12,\tfrac12\big)$. Both multipliers are positive, so both points are support vectors: at $x_2$, $w^Tx_2+b=+1$, i.e., $\tfrac12\cdot2+\tfrac12\cdot2+b=1$, so $b^*=-1$. (Check at $x_1$: $0+b=-1=y_1$ ✓.)

**Step 6 — the hyperplane and the margin.**
$$w^{*T}x+b^*=\tfrac12x_1+\tfrac12x_2-1=0\iff x_1+x_2=2.$$
The margin (the distance from the hyperplane to the nearest point) is $\frac1{\lVert w^*\rVert}=\frac1{\sqrt{1/4+1/4}}=\sqrt2$, and the width between the two margin planes $x_1+x_2=0$ and $x_1+x_2=4$ is $\frac2{\lVert w^*\rVert}=2\sqrt2$ (equal to the distance $\sqrt8$ between the two points).

**Check.** The primal value $\frac12\lVert w^*\rVert^2=\frac14$ = the dual value $g^*=\frac14$ (strong duality). Geometrically as well: the line through the midpoint $(1,1)$ of the two points, perpendicular to the direction $(1,1)$ joining them, is $x_1+x_2=2$.

:::fig svm2pt
:::

:::ex Example 4 — Adding a point that is not a support vector
If we add $x_3=(4,1)$, $y_3=+1$ to the data above, does the solution change? Check with the dual problem.
---
$w^{*T}x_3+b^*=2+0.5-1=1.5>1$, so the old solution still satisfies every constraint. In the dual problem, the constraint is $-\alpha_1+\alpha_2+\alpha_3=0$ and the objective is $\alpha_1+\alpha_2+\alpha_3-\frac12\big(8\alpha_2^2+2\cdot10\alpha_2\alpha_3+17\alpha_3^2\big)$ ($x_2^Tx_3=10$, $x_3^Tx_3=17$). Substituting $\alpha_1=\alpha_2+\alpha_3$ gives $2\alpha_2+2\alpha_3-4\alpha_2^2-10\alpha_2\alpha_3-8.5\alpha_3^2$. At $(\alpha_2,\alpha_3)=(\tfrac14,0)$ the derivative in the $\alpha_3$ direction is $2-10\cdot\tfrac14=-0.5<0$, so increasing $\alpha_3$ only hurts → $\alpha_3^*=0$. The solution is unchanged, consistent with complementary slackness ($x_3$ is outside the margin → $\alpha_3=0$).
:::

:::tip Checklist for the solution order
(1) Write the constraints as $1-y_i(w^Tx_i+b)\le0$ (2) $L=\frac12\lVert w\rVert^2+\sum\alpha_i(1-y_i(\cdot))$ (3) $\nabla_w=0$, $\partial_b=0$ (4) substitute to get a function of $\alpha$ alone (5) maximize under the constraints $\sum\alpha_iy_i=0$, $\alpha\ge0$ (6) $w=\sum\alpha_iy_ix_i$ (7) $b=y_i-w^Tx_i$ at a point with $\alpha_i>0$ (8) the margin $1/\lVert w\rVert$ ($2/\lVert w\rVert$ if the width is asked). Finally, check that the primal value = the dual value.
:::
` },
      '7.7': { title: 'The Max–Min Inequality and Saddle Points', body: R`
:::idea In plain words
Two people play a game. I choose a row $x$ to make the score $f(x,y)$ **large**, and the opponent chooses a column $y$ to make it **small**. If I reveal my choice first, the opponent sees it and responds in the worst way for me, so I get $\max_x\min_yf$; if the opponent reveals first, I respond, so I get $\min_y\max_xf$. **The one who chooses later has more information and the advantage**, so $\max_x\min_yf\le\min_y\max_xf$. This is the max–min inequality, and the weak duality of the SVM is exactly this.
:::

:::key The max–min inequality
For nonempty sets $X,Y$ and a function $f:X\times Y\to\mathbb R$ (when the maxima and minima exist),
$$\max_{x\in X}\min_{y\in Y}f(x,y)\ \le\ \min_{y\in Y}\max_{x\in X}f(x,y).$$
If the maxima and minima do not exist, the same inequality holds with $\sup$ and $\inf$.
:::

### Problem Set 1, Problem 4: the proof

Let $g(x)=\min_{y\in Y}f(x,y)$ and $h(y)=\max_{x\in X}f(x,y)$. Fixing arbitrary $x'\in X$ and $y'\in Y$,
$$g(x')=\min_yf(x',y)\ \le\ f(x',y')\ \le\ \max_xf(x,y')=h(y').$$
(A minimum is at most any particular value, and a maximum is at least any particular value.) That is, $g(x')\le h(y')$ for **every** $x'$ and **every** $y'$.
- The left side does not depend on $y'$, so the inequality survives taking the minimum of the right side over $y'$: $g(x')\le\min_{y'}h(y')$.
- Now the right side is a constant independent of $x'$, so the inequality survives taking the maximum of the left side: $\max_{x'}g(x')\le\min_{y'}h(y')$.
This is $\max_x\min_yf\le\min_y\max_xf$. ∎

**The sup/inf version.** By the same logic, $\inf_yf(x',y)\le f(x',y')\le\sup_xf(x,y')$ gives $\sup_{x'}\inf_yf\le\inf_{y'}\sup_xf$. Use “if $a\le b_y$ for every $y$, then $a\le\inf_yb_y$” (the definition of the infimum) and “if $a_x\le b$ for every $x$, then $\sup_xa_x\le b$”.

### A counterexample where equality fails

$X=Y=\{0,1\}$, $f(x,y)=1$ ($x\ne y$), $0$ ($x=y$) — i.e., $f(x,y)=(x-y)^2$. As a table,

| | $y=0$ | $y=1$ | $\min_y$ |
|---|---|---|---|
| $x=0$ | 0 | 1 | 0 |
| $x=1$ | 1 | 0 | 0 |
| $\max_x$ | 1 | 1 | |

- $\max_x\min_yf=\max(0,0)=0$ (whatever $x$ I choose, the opponent matches with $y=x$ to make 0)
- $\min_y\max_xf=\min(1,1)=1$ (whatever $y$ is chosen, I make 1 with $x\ne y$)

Since $0<1$, equality does not hold. This is the game of “matching pennies”.

:::ex Example 5 — A continuous counterexample and an example with equality
Compare the two values for (a) $X=Y=[0,1]$, $f(x,y)=(x-y)^2$ and (b) $X=Y=[-1,1]$, $f(x,y)=x^2-y^2$.
---
(a) $\min_y(x-y)^2=0$ ($y=x$), so $\max_x\min_y=0$. $\max_x(x-y)^2=\max(y^2,(1-y)^2)$, whose minimum over $y$ is $\tfrac14$ at $y=\tfrac12$. $0<\tfrac14$ — equality fails.
(b) $\min_y(x^2-y^2)=x^2-1$, and $\max_x=0$ ($x=\pm1$). $\max_x(x^2-y^2)=1-y^2$, and $\min_y=0$ ($y=\pm1$). Both are 0 — equality. This is because $(x^*,y^*)=(1,1)$ is a saddle point as defined below: $f(x,1)=x^2-1\le0=f(1,1)\le1-y^2=f(1,y)$.
:::

### The condition for equality: saddle points

If $(x^*,y^*)$ is a **saddle point** — $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ for all $x,y$ — then equality holds.
$$\min_y\max_xf\le\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)\le\max_x\min_yf,$$
and combined with the max–min inequality this gives equality. The minimax theorem of von Neumann and Sion says that if $X,Y$ are convex compact sets and $f$ is concave in $x$ and convex in $y$ (under conditions such as continuity), a saddle point exists and equality holds. In counterexample (a), $(x-y)^2$ is convex in $x$ (not concave), so the condition fails.

### The connection with the SVM

In the Lagrangian of Section 7.4, the **maximizing** variable is $\alpha$ and the **minimizing** variable is $(w,b)$. Replacing $x\to\alpha$, $y\to(w,b)$, $f\to L_p$ in the inequality above,
$$\max_{\alpha\ge0}\min_{w,b}L_p\ \le\ \min_{w,b}\max_{\alpha\ge0}L_p,$$
that is, “the value of the dual problem ≤ the value of the primal problem” (weak duality). $L_p$ is convex in $(w,b)$ and linear (concave) in $\alpha$, so the saddle-point condition holds and we get equality (strong duality); that saddle point is the $(w^*,b^*,\alpha^*)$ found in Section 7.6.

:::warn A common mistake
In the proof, comparing only **one and the same** $(x,y)$, as in “since $\min_yf(x,y)\le\max_xf(x,y)$…”, and stopping there is wrong. You must set up $g(x')\le f(x',y')\le h(y')$ for arbitrary, different $x'$ and $y'$, and then write the two steps optimizing one side at a time.
:::
` },
    },
    probs: [
      // u07
      { q: R`What is the distance between the hyperplane $3x_1+4x_2-10=0$ and the origin?`,
        sol: R`$\lvert b\rvert/\lVert w\rVert=10/5=2$.` },
      { q: R`What is the distance between the point $(3,4)$ and the hyperplane $3x_1+4x_2-10=0$?`,
        sol: R`$\lvert9+16-10\rvert/5=15/5=3$.` },
      { q: R`In the derivation of the notes, if $w=(1,2)$, $b=-1$, and $x=(2,2)$, what is $\alpha=\frac{w^Tx+b}{w^Tw}$?`,
        sol: R`$w^Tx+b=2+4-1=5$, $w^Tw=5$, $\alpha=1$. The foot of the perpendicular is $x_p=x-\alpha w=(1,0)$; check: $1+0-1=0$. The distance is $\lVert w\rVert=\sqrt5$.` },
      { q: R`What role does $r(\beta w,\beta b)=r(w,b)$ ($\beta>0$) play in the derivation of the SVM?`,
        choices: [R`It guarantees that the solution is unique`, R`It lets us fix the scale by $\min_i\lvert w^Tx_i+b\rvert=1$`, R`It lets us use kernels`, R`It lets us set $b=0$`],
        sol: R`Infinitely many $(w,b)$ represent the same plane, so we pick one representative. The margin then becomes $1/\lVert w\rVert$.` },
      { q: R`If the solution of a hard-margin SVM is $w=(3,4)$, what is the distance between the two margin planes $H_+$ and $H_-$?`,
        sol: R`The distance between $H_\pm:w^Tx+b=\pm1$ is $2/\lVert w\rVert=2/5$. Each is $1/5$ from the decision plane.` },
      { q: R`When does the hard-margin SVM constraint $y_i(x_i^Tw+b)\ge1$ fail?`,
        choices: [R`When a positive point is on $H_+$`, R`When a positive point is between $H_0$ and $H_+$`, R`When a negative point is below $H_-$`, R`When a negative point is on $H_-$`],
        sol: R`A positive point between the two planes has $0<x^Tw+b<1$. The hard margin allows no points inside the margin (the soft margin does).` },
      { q: R`What is the value of $\max_{\alpha\ge0}\alpha(1-t)$?`,
        choices: [R`Always 0`, R`0 if $t\ge1$, $+\infty$ if $t<1$`, R`$+\infty$ if $t\ge1$, 0 if $t<1$`, R`$1-t$`],
        sol: R`If $1-t\le0$, the maximum is 0 at $\alpha=0$. If $1-t>0$, $\alpha\to\infty$ gives infinity. This expresses the constraint $t=y_i(\cdot)\ge1$ as a penalty.` },
      { q: R`What condition do we get by differentiating the Lagrangian in $b$ and setting it to 0?`,
        choices: [R`$w=\sum\alpha_iy_ix_i$`, R`$\sum_i\alpha_iy_i=0$`, R`$\sum_i\alpha_i=1$`, R`$b=0$`],
        sol: R`$\partial L_p/\partial b=-\sum\alpha_iy_i=0$. It becomes the equality constraint of the dual problem.` },
      { q: R`How do the data enter the SVM dual problem?`,
        choices: [R`As the $x_i$ themselves`, R`Only through the inner products $x_i^Tx_j$`, R`Only through the norms $\lVert x_i\rVert$`, R`Only through the mean of the $x_i$`],
        sol: R`$\sum\alpha_i-\frac12\sum\alpha_i\alpha_jy_iy_jx_i^Tx_j$. That is why the kernel trick can be used.` },
      { q: R`If $w=(1,-1)$ and the support vector is $x=(3,1)$, $y=1$, what is $b$?`,
        sol: R`$b=y-x^Tw=1-(3-1)=-1$. Check: $x^Tw+b=2-1=1$.` },
      { q: R`For the one-dimensional data $x_1=1\,(y=+1)$, $x_2=-1\,(y=-1)$, what is $w$ of the hard-margin SVM? (Solve by the dual problem or geometrically.)`,
        sol: R`By symmetry $b=0$; the constraint is $w\ge1$, and minimizing $\frac12w^2$ gives $w=1$. Dual: $\alpha_1=\alpha_2=\alpha$ (the sum condition), objective $2\alpha-\frac12\alpha^2(1\cdot1+1\cdot1+2\cdot1)=2\alpha-2\alpha^2$, maximum at $\alpha=\tfrac12$, $w=\tfrac12(1)(1)+\tfrac12(-1)(-1)=1$. The margin is $1/\lVert w\rVert=1$ (half the distance 2 between the two points).` },
      { q: R`By KKT complementary slackness $\alpha_i(1-y_i(x_i^Tw+b))=0$, what is $\alpha_i$ for a point outside the margin ($y_i(\cdot)>1$)?`,
        choices: [R`Positive`, R`0`, R`Negative`, R`1`],
        sol: R`The bracket is negative, so for the product to be 0 we need $\alpha_i=0$. The solution $w=\sum\alpha_iy_ix_i$ is determined by the support vectors alone.` },
      { q: R`Prove that the distance between a point $x$ and the hyperplane $\{z:w^Tz+b=0\}$ is $\lvert w^Tx+b\rvert/\lVert w\rVert_2$, using the foot of the perpendicular $x_p=x-d$ and $d=\alpha w$.`,
        sol: R`
$d$ points along the normal, so $d=\alpha w$. For $x_p=x-\alpha w$ to lie on the plane we need $w^T(x-\alpha w)+b=0$, i.e., $\alpha=\frac{w^Tx+b}{w^Tw}$.
$\lVert d\rVert=\lvert\alpha\rvert\lVert w\rVert=\frac{\lvert w^Tx+b\rvert}{w^Tw}\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert}$.
This is the minimum distance: for any $z$ on the plane, $x-z=(x-x_p)+(x_p-z)$, and $x_p-z$ is parallel to the plane (i.e., $w^T(x_p-z)=0$), so $x-x_p\perp x_p-z$. By Pythagoras, $\lVert x-z\rVert^2=\lVert d\rVert^2+\lVert x_p-z\rVert^2\ge\lVert d\rVert^2$.`,
        rubric: R`
- Setting $d=\alpha w$ and computing $\alpha$ — 4 pts
- Computing the norm — 3 pts
- Checking that it is the minimum distance — 3 pts` },
      { q: R`For linearly separable data, show that the problem “maximize the margin $r(w,b)$ (s.t. $y_i(w^Tx_i+b)\ge0$)” gives the same hyperplane as “$\min\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$”.`,
        sol: R`
**Scale invariance.** For $\beta>0$, $r(\beta w,\beta b)=\min\frac{\beta\lvert w^Tx+b\rvert}{\beta\lVert w\rVert}=r(w,b)$, and the classification constraints are unchanged too. If the data are separable, there is a solution with $w^Tx_i+b\ne0$ at every point, so we can fix the scale so that $\min_i\lvert w^Tx_i+b\rvert=1$, and then $r=1/\lVert w\rVert$.

**Equivalence of the constraints.** (⇒) If $y_i(w^Tx_i+b)\ge0$ and $\lvert y_i\rvert=1$, then $y_i(w^Tx_i+b)=\lvert w^Tx_i+b\rvert\ge\min_j\lvert w^Tx_j+b\rvert=1$. (⇐) Among the $(w,b)$ satisfying $y_i(w^Tx_i+b)\ge1$, the one minimizing $\frac12\lVert w\rVert^2$ has $m=\min_iy_i(w^Tx_i+b)=1$. For if $m>1$, then $(w/m,b/m)$ also satisfies the constraints with a smaller $\lVert w\rVert$, a contradiction.

**Equivalence of the objectives.** $\max1/\lVert w\rVert\iff\min\lVert w\rVert\iff\min\frac12\lVert w\rVert^2$ ($t\mapsto t^2/2$ is increasing on the positives). Hence the optimal hyperplanes of the two problems are the same.`,
        rubric: R`
- Scale invariance and the normalization $\min\lvert\cdot\rvert=1$ — 3 pts
- Equivalence of the two constraints (both directions) — 4 pts
- Equivalence of the objectives — 3 pts` },
      { q: R`For an arbitrary function $L(u,v)$, prove weak duality $\min_u\max_vL(u,v)\ge\max_v\min_uL(u,v)$, and derive the dual objective $\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$ from the SVM Lagrangian.`,
        sol: R`
**Weak duality.** For any $u',v'$, $\min_uL(u,v')\le L(u',v')\le\max_vL(u',v)$. The left side does not depend on $u'$, so the inequality survives minimizing the right side over $u'$: $\min_uL(u,v')\le\min_{u'}\max_vL(u',v)$. Now maximizing the left side over $v'$ gives the result.

**The dual objective.** $L_p=\frac12w^Tw+\sum_i\alpha_i-w^T\sum_i\alpha_iy_ix_i-b\sum_i\alpha_iy_i$. It is a convex quadratic in $w$, minimized at $\nabla_w=w-\sum\alpha_iy_ix_i=0$; in $b$ it is linear, so if $\sum\alpha_iy_i\ne0$ then $\min_b=-\infty$, and in the dual only $\sum\alpha_iy_i=0$ is meaningful. Substituting,
$$\min_{w,b}L_p=\tfrac12w^Tw+\sum\alpha_i-w^Tw=\sum_i\alpha_i-\tfrac12\Big\lVert\sum_i\alpha_iy_ix_i\Big\rVert^2=\sum_i\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$`,
        rubric: R`
- The two-step inequality of weak duality — 4 pts
- The two stationarity conditions — 3 pts
- Substituting and simplifying — 3 pts` },
      // more-07
      { q: R`**(Problem Set 1, Problem 3)** Consider the following 2-dimensional dataset: $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$.
1. We set the primal problem $\min_{w,b}\frac12\lVert w\rVert^2$ s.t. $y_i(w^Tx_i+b)\ge1$ ($i=1,2$). Derive the Lagrangian with multipliers $\alpha_1,\alpha_2\ge0$, minimize it over $w,b$, and derive the dual in terms of $\alpha_1,\alpha_2$. Solve for the optimal multipliers.
2. Using the optimal multipliers, recover the optimal parameters $w$ and $b$.
3. State the separating hyperplane $w^Tx+b=0$ and compute the margin.`,
        sol: R`
**1.** $L=\frac12\lVert w\rVert^2+\alpha_1(1+b)+\alpha_2(1-2w_1-2w_2-b)$.
$\nabla_wL=w-\alpha_2(2,2)=0\Rightarrow w=(2\alpha_2,2\alpha_2)$; $\partial_bL=\alpha_1-\alpha_2=0$.
Substituting: $g(\alpha)=\alpha_1+\alpha_2-4\alpha_2^2$. Dual problem: $\max\ \alpha_1+\alpha_2-4\alpha_2^2$ s.t. $\alpha_1=\alpha_2$, $\alpha_i\ge0$.
With $\alpha_1=\alpha_2=\alpha$: maximize $2\alpha-4\alpha^2$ $\Rightarrow\alpha=\tfrac14$. $\alpha_1^*=\alpha_2^*=\tfrac14$.
**2.** $w^*=(\tfrac12,\tfrac12)$. Since $\alpha_2>0$, $x_2$ is a support vector: $w^Tx_2+b=1\Rightarrow2+b=1\Rightarrow b^*=-1$ ($b=-1$ is also confirmed at $x_1$).
**3.** $\tfrac12x_1+\tfrac12x_2-1=0$, i.e., $x_1+x_2=2$. The margin is $1/\lVert w^*\rVert=\sqrt2$ (the width between the two margin planes is $2\sqrt2$). Check: primal value $\tfrac14$ = dual value $\tfrac14$.`,
        rubric: R`
- The Lagrangian — 2 pts
- The two stationarity conditions — 2 pts
- The dual function and constraints — 2 pts
- The optimal multipliers — 1 pt
- Recovering $w,b$ (justifying the use of a support vector) — 2 pts
- The hyperplane and the margin — 1 pt` },
      { q: R`**(Problem Set 1, Problem 4)** Let $X$ and $Y$ be nonempty sets, and let $f:X\times Y\to\mathbb R$. Prove the max–min inequality $\max_{x\in X}\min_{y\in Y}f(x,y)\le\min_{y\in Y}\max_{x\in X}f(x,y)$. Give a counterexample where equality does not hold.`,
        sol: R`
**Proof.** Let $g(x)=\min_yf(x,y)$ and $h(y)=\max_xf(x,y)$. For any $x'\in X$, $y'\in Y$,
$$g(x')\le f(x',y')\le h(y').$$
Since $g(x')\le h(y')$ for every $y'$, $g(x')\le\min_{y'}h(y')$. Now this holds for every $x'$, so $\max_{x'}g(x')\le\min_{y'}h(y')$. ∎ (If the maxima and minima do not exist, the same logic gives $\sup\inf\le\inf\sup$.)
**Counterexample.** $X=Y=\{0,1\}$, $f(x,y)=(x-y)^2$. $\min_yf(x,y)=0$ ($y=x$ for each $x$) → $\max_x\min_y=0$. $\max_xf(x,y)=1$ ($x\ne y$ for each $y$) → $\min_y\max_x=1$. $0<1$.`,
        rubric: R`
- $g(x')\le f(x',y')\le h(y')$ at arbitrary $x',y'$ — 4 pts
- The two optimization steps (order and justification) — 3 pts
- The counterexample and the computation of the two values — 3 pts` },
      { q: R`For the data $x_1=(1,0)$, $y_1=-1$; $x_2=(3,2)$, $y_2=+1$, what is the value of the optimal multipliers $\alpha_1=\alpha_2$ of the hard-margin SVM?`,
        sol: R`$\sum\alpha_iy_i=0\Rightarrow\alpha_1=\alpha_2=\alpha$, $w=\alpha(x_2-x_1)=\alpha(2,2)$. The dual objective is $2\alpha-\frac12\alpha^2\lVert x_2-x_1\rVert^2=2\alpha-4\alpha^2$ (the general formula gives $\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j=\alpha^2\lVert x_2-x_1\rVert^2$). The maximum is at $\alpha=\tfrac14$.` },
      { q: R`In the problem above, what is the intercept $b$?`,
        sol: R`$w=\tfrac14(2,2)=(\tfrac12,\tfrac12)$. At $x_2$, $w^Tx_2+b=\tfrac52+b=1\Rightarrow b=-\tfrac32$ (check at $x_1$: $\tfrac12+b=-1$). The hyperplane $x_1+x_2=3$ passes through the midpoint $(2,1)$ of the two points.` },
      { q: R`If the solution of a hard-margin SVM is $w=(\tfrac12,\tfrac12)$, what is the margin $1/\lVert w\rVert$? (4 decimal places)`,
        sol: R`$\lVert w\rVert=\sqrt{\tfrac14+\tfrac14}=\tfrac1{\sqrt2}$, so the margin is $\sqrt2$.` },
      { q: R`Solve $\min_x(x-2)^2$ s.t. $x\le1$ by Lagrange duality: find the Lagrangian, the dual function $g(\alpha)$, the optimal $\alpha$, and the original solution, and check strong duality.`,
        sol: R`
The constraint is $x-1\le0$. $L=(x-2)^2+\alpha(x-1)$, $\alpha\ge0$.
$\partial_xL=2(x-2)+\alpha=0\Rightarrow x=2-\frac\alpha2$. Substituting: $g(\alpha)=\frac{\alpha^2}4+\alpha\big(1-\frac\alpha2\big)=\alpha-\frac{\alpha^2}4$.
$g'(\alpha)=1-\frac\alpha2=0\Rightarrow\alpha^*=2\ (\ge0)$, $g^*=1$. $x^*=2-1=1$, and the primal value $(1-2)^2=1=g^*$.
$\alpha^*>0$ and the constraint holds with equality at $x^*=1$ — consistent with complementary slackness $\alpha^*(x^*-1)=0$.`,
        rubric: R`
- The Lagrangian (mind the sign) — 2 pts
- The dual function — 3 pts
- The optimal multiplier and the solution — 3 pts
- Checking strong duality and complementary slackness — 2 pts` },
      { q: R`In the hard-margin SVM, assuming strong duality $\frac12\lVert w^*\rVert^2=\max_{\alpha\ge0}\min_{w,b}L_p$ holds and $(w^*,b^*,\alpha^*)$ is optimal, prove KKT complementary slackness $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$ ($\forall i$).`,
        sol: R`
The optimal dual value is $g(\alpha^*)=\min_{w,b}L_p(w,b,\alpha^*)\le L_p(w^*,b^*,\alpha^*)=\frac12\lVert w^*\rVert^2+\sum_i\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)$.
By primal feasibility each bracket is $\le0$, and $\alpha_i^*\ge0$, so the sum is $\le0$; hence $L_p(w^*,b^*,\alpha^*)\le\frac12\lVert w^*\rVert^2$.
By strong duality $g(\alpha^*)=\frac12\lVert w^*\rVert^2$, so all the inequalities above are equalities: $\sum_i\alpha_i^*(1-y_i(\cdot))=0$. Each term is $\le0$ and the sum is 0, so each term is 0.`,
        rubric: R`
- Dual value ≤ Lagrangian value — 3 pts
- The sign of each term — 3 pts
- Equality by strong duality, each term 0 — 4 pts` },
      { q: R`For $X=Y=\{-1,1\}$, $f(x,y)=xy$ (matching pennies, $x$ maximizes), find $\max_x\min_yf$ and $\min_y\max_xf$, and show that there is no saddle point.`,
        sol: R`
$\min_yxy=-1$ ($y=-x$), so $\max_x\min_y=-1$. $\max_xxy=1$ ($x=y$), so $\min_y\max_x=1$. $-1<1$.
If $(x^*,y^*)$ were a saddle point, $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ ($\forall x,y$), and then $\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)$ gives $1=f(x^*,y^*)=-1$ — a contradiction. (If there is a saddle point, the two values must be equal.)`,
        rubric: R`
- Computing the two values — 5 pts
- The contradiction using that a saddle point forces equality — 5 pts` },
      { q: R`Show that if $(x^*,y^*)$ is a saddle point of $f$, i.e., $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ for all $x\in X$, $y\in Y$, then $\max_x\min_yf=\min_y\max_xf=f(x^*,y^*)$.`,
        sol: R`
The left inequality gives $\max_xf(x,y^*)=f(x^*,y^*)$ (equality at $x=x^*$), and the right one gives $\min_yf(x^*,y)=f(x^*,y^*)$.
$\min_y\max_xf\le\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)\le\max_x\min_yf$.
Combined with the max–min inequality $\max_x\min_y\le\min_y\max_x$, all are equalities.`,
        rubric: R`
- The two equalities from the saddle-point condition — 4 pts
- The chain of inequalities — 4 pts
- Combining with the max–min inequality — 2 pts` },
      { q: R`Which is correct about the hard-margin SVM?`,
        choices: [R`Every training point has a positive $\alpha_i$`, R`Deleting points outside the margin ($y_i(w^Tx_i+b)>1$) does not change the solution`, R`$b$ comes directly out of the dual problem`, R`The dual problem is a quadratic program in $w$`],
        sol: R`By complementary slackness, points outside the margin have $\alpha_i=0$ and do not contribute to $w=\sum\alpha_iy_ix_i$. $b$ is found separately from a support vector, and the dual problem is a QP in $\alpha$.` },
      // quizprep-a
      { q: R`We generalize Problem 3 of Problem Set 1. Apply the hard-margin SVM to two distinct points $x_-$ ($y=-1$) and $x_+$ ($y=+1$), and let $d=x_+-x_-$.
1. Eliminate $w,b$ from the Lagrangian to derive the dual problem, and show that the optimal multipliers are $\alpha_+=\alpha_-=\dfrac2{\lVert d\rVert^2}$.
2. Show that $w^*=\dfrac{2d}{\lVert d\rVert^2}$ and $b^*=-\dfrac12(w^*)^T(x_++x_-)$.
3. Show that the margin is $1/\lVert w^*\rVert=\lVert d\rVert/2$ and that the separating hyperplane is the perpendicular bisector of the two points. Check strong duality as well.
4. Substitute $x_-=(0,0)$, $x_+=(2,2)$ and check that the answer agrees with Problem Set 1.`,
        sol: R`
**1.** $L=\frac12\lVert w\rVert^2+\alpha_-\big(1+w^Tx_-+b\big)+\alpha_+\big(1-w^Tx_+-b\big)$, $\alpha_\pm\ge0$. Stationarity: $\nabla_wL=0\Rightarrow w=\alpha_+x_+-\alpha_-x_-$, $\partial_bL=\alpha_--\alpha_+=0$. If $\alpha_+=\alpha_-=\alpha$, then $w=\alpha d$ and
$$g(\alpha)=2\alpha-\frac12\alpha^2\lVert d\rVert^2\quad(\alpha\ge0).$$
$g'(\alpha)=2-\alpha\lVert d\rVert^2=0\Rightarrow\alpha=\frac2{\lVert d\rVert^2}\ (\gt0)$, and $g''=-\lVert d\rVert^2\lt0$, so it is a maximum.
**2.** $w^*=\alpha d=\frac{2d}{\lVert d\rVert^2}$. Both points have $\alpha\gt0$, so by complementary slackness $w^Tx_++b=1$ and $w^Tx_-+b=-1$. Adding gives $b^*=-\frac12(w^*)^T(x_++x_-)$. (Subtracting gives $w^Td=2$ — indeed $\frac{2\lVert d\rVert^2}{\lVert d\rVert^2}=2$.)
**3.** $\lVert w^*\rVert=\frac2{\lVert d\rVert}$, so the margin is $\frac{\lVert d\rVert}2$ (half the distance between the two points). At the midpoint $c=\frac{x_++x_-}2$, $(w^*)^Tc+b^*=0$, so the hyperplane passes through the midpoint, and its normal $w^*$ is parallel to $d$, so it is the perpendicular bisector. The primal value is $\frac12\lVert w^*\rVert^2=\frac2{\lVert d\rVert^2}=g(\alpha^*)$.
**4.** $d=(2,2)$, $\lVert d\rVert^2=8$: $\alpha=\frac14$, $w^*=(\frac12,\frac12)$, $b^*=-\frac12\cdot\frac12(2+2)=-1$, margin $\sqrt2$ — the same as the answer of Problem Set 1.`,
        rubric: R`
- The Lagrangian and the two stationarity conditions — 2 pts; the dual function and the optimal multiplier (checking the maximum) — 2 pts
- $w^*$, $b^*$ (stating the use of complementary slackness) — 3 pts
- The margin, the perpendicular bisector, strong duality — 2 pts
- The substitution check — 1 pt` },
      { q: R`Apply the hard-margin SVM to the data $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$; $x_3=(4,1)$, $y_3=+1$.
1. Write all the KKT conditions of this problem (primal feasibility, dual feasibility, the two stationarity conditions, complementary slackness).
2. Check that the candidate $w=(\frac12,\frac12)$, $b=-1$, $\alpha=(\frac14,\frac14,0)$ satisfies all the KKT conditions.
3. Prove directly that a point satisfying the KKT conditions is optimal: for any feasible $(w',b')$, $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2$. (Hint: $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2+w^T(w'-w)$)
4. Explain why removing $x_3$ from the data does not change the solution.`,
        sol: R`
**1.** Primal feasibility $y_i(w^Tx_i+b)\ge1$; dual feasibility $\alpha_i\ge0$; stationarity $w=\sum_i\alpha_iy_ix_i$, $\sum_i\alpha_iy_i=0$; complementary slackness $\alpha_i\big[y_i(w^Tx_i+b)-1\big]=0$ ($i=1,2,3$).
**2.** Margin values: $x_1$: $-(0-1)=1$, $x_2$: $1+1-1=1$, $x_3$: $2+\frac12-1=\frac32\ge1$ — feasible. $\alpha\ge0$. $\sum\alpha_iy_i=-\frac14+\frac14+0=0$, $\sum\alpha_iy_ix_i=\frac14(2,2)=(\frac12,\frac12)=w$. Complementary slackness: $x_1,x_2$ have margin value 1, so it holds; $x_3$ has margin value $\frac32$, but $\alpha_3=0$, so it holds.
**3.** $\frac12\lVert\cdot\rVert^2$ is convex, so $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2+w^T(w'-w)$ (expanding, $\frac12\lVert w'-w\rVert^2\ge0$). By stationarity and $\sum\alpha_iy_i=0$ (which lets us add the $b'-b$ term),
$$w^T(w'-w)=\sum_i\alpha_iy_i\big[(w'^Tx_i+b')-(w^Tx_i+b)\big]=\sum_i\alpha_i\big[y_i(w'^Tx_i+b')-1\big]-\sum_i\alpha_i\big[y_i(w^Tx_i+b)-1\big].$$
The first sum is $\ge0$ by $\alpha_i\ge0$ and the feasibility of $(w',b')$, and the second sum is 0 by complementary slackness. Hence $\frac12\lVert w'\rVert^2\ge\frac12\lVert w\rVert^2$. $\blacksquare$
**4.** $\alpha_3=0$, so $x_3$ does not contribute to the stationarity condition. Without $x_3$, the same $(w,b,\alpha_1,\alpha_2)$ satisfies the KKT conditions of the two-point problem, so by 3 it is still optimal. The solution is determined by the support vectors ($\alpha_i\gt0$) alone.`,
        rubric: R`
- The five KKT conditions — 2 pts
- Checking the candidate (especially complementary slackness for $x_3$) — 3 pts
- Proof of sufficiency (the convexity inequality, using $\sum\alpha_iy_i=0$, the signs of the two sums) — 3 pts
- The support-vector interpretation — 2 pts` },
      { q: R`$\min_{x\in\mathbb R^2}\ x_1^2+x_2^2$ s.t. $x_1+x_2\ge2$.
1. Write the Lagrangian and find the dual function $g(\alpha)$ ($\alpha\ge0$).
2. Solve the dual problem to find $\alpha^*$ and the dual value $d^*$.
3. Recover the primal solution $x^*$, and check $p^*=d^*$ (strong duality) and complementary slackness.
4. If the constraint is changed to $x_1+x_2\ge-2$, find $\alpha^*$ and $x^*$ from the dual problem, and explain with complementary slackness.`,
        sol: R`
**1.** Write the constraint as $2-x_1-x_2\le0$ and let $L=x_1^2+x_2^2+\alpha(2-x_1-x_2)$. It is a convex quadratic in $x$, so the stationary point $2x_i-\alpha=0$, $x_i=\frac\alpha2$, is the minimizer. Substituting,
$$g(\alpha)=\frac{\alpha^2}2+\alpha(2-\alpha)=2\alpha-\frac{\alpha^2}2.$$
**2.** $g'(\alpha)=2-\alpha=0\Rightarrow\alpha^*=2\ (\ge0)$, $g''=-1\lt0$. $d^*=4-2=2$.
**3.** $x^*=(\frac{\alpha^*}2,\frac{\alpha^*}2)=(1,1)$, $p^*=1+1=2=d^*$. The constraint holds with equality ($1+1=2$) and $\alpha^*\gt0$ — complementary slackness $\alpha^*(2-x_1-x_2)=0$ holds.
**4.** $L=x_1^2+x_2^2+\alpha(-2-x_1-x_2)$, and the same computation gives $g(\alpha)=-2\alpha-\frac{\alpha^2}2$. On $\alpha\ge0$, $g'=-2-\alpha\lt0$, so the maximum is at $\alpha^*=0$, $d^*=0$. $x^*=(0,0)$, $p^*=0$. The unconstrained minimizer $(0,0)$ already satisfies $0\ge-2$, so the constraint is slack, and by complementary slackness the multiplier is 0.`,
        rubric: R`
- The Lagrangian with the correct sign and the dual function — 3 pts
- Solving the dual problem — 2 pts
- Recovering the primal solution, strong duality, complementary slackness — 3 pts
- The case of a slack constraint — 2 pts` },
      { q: R`Whether equality holds in the max–min inequality $\max_x\min_yf\le\min_y\max_xf$ ($x$ maximizes, $y$ minimizes).
1. For $X=Y=[0,1]$, $f(x,y)=(x-y)^2$, find $\max_x\min_yf$ and $\min_y\max_xf$.
2. For $X=Y=[-1,1]$, $f(x,y)=xy$, find the two values and a saddle point.
3. Show that if a saddle point $(x^*,y^*)$ — $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$ for all $x,y$ — exists, equality holds, and prove that the $f$ of 1 has no saddle point.`,
        sol: R`
**1.** Fixing $x$, $\min_y(x-y)^2=0$ ($y=x$), so $\max_x\min_yf=0$. Fixing $y$, $x\mapsto(x-y)^2$ is convex, so its maximum is at an endpoint: $\max_xf=\max\{y^2,(1-y)^2\}$. Minimizing this over $y$ gives $\frac14$ at $y=\frac12$. $0\lt\frac14$ — not an equality.
**2.** $\min_yxy=-\lvert x\rvert$ ($y=-\operatorname{sign}x$), and $\max_x(-\lvert x\rvert)=0$. $\max_xxy=\lvert y\rvert$, and $\min_y\lvert y\rvert=0$. The two values are both 0, and at $(0,0)$, $f(x,0)=0\le0\le f(0,y)=0$, so it is a saddle point.
**3.** If there is a saddle point, $\min_y\max_xf\le\max_xf(x,y^*)=f(x^*,y^*)=\min_yf(x^*,y)\le\max_x\min_yf$. The reverse inequality is the max–min inequality, so equality holds.
Suppose the $f$ of 1 had a saddle point $(x^*,y^*)$. The right inequality gives $f(x^*,y^*)=\min_yf(x^*,y)=0$, i.e., $y^*=x^*$. The left inequality requires $(x-x^*)^2\le0$ for every $x\in[0,1]$, a contradiction for any $x\ne x^*$. Hence there is no saddle point, which is why equality fails in 1.`,
        rubric: R`
- The two values of 1 (including the endpoint-maximum argument) — 3 pts
- The two values of 2 and checking the saddle point — 3 pts
- Saddle point ⇒ equality — 2 pts; no saddle point in 1 — 2 pts` },
      { q: R`Primal problem $p^*=\inf_xf(x)$ s.t. $g_i(x)\le0$ ($i=1,\dots,m$), Lagrangian $L(x,\alpha)=f(x)+\sum_i\alpha_ig_i(x)$, dual function $d(\alpha)=\inf_xL(x,\alpha)$.
1. Show that $\sup_{\alpha\ge0}L(x,\alpha)$ is $f(x)$ if $x$ is feasible and $+\infty$ otherwise, and conclude $p^*=\inf_x\sup_{\alpha\ge0}L(x,\alpha)$.
2. Show $d(\alpha)\le f(x)$ for every feasible $x$ and every $\alpha\ge0$, and conclude weak duality $d^*=\sup_{\alpha\ge0}d(\alpha)\le p^*$.
3. Explain why 2 is a special case of the max–min inequality of Problem 4 of Problem Set 1.
4. Show that $d(\alpha)$ is always a concave function, even if the primal problem is not convex.`,
        sol: R`
**1.** If $x$ is feasible, every $g_i(x)\le0$, so $\sum\alpha_ig_i(x)\le0$ for $\alpha\ge0$ and the maximum is $f(x)$ at $\alpha=0$. If $x$ is infeasible, some $g_j(x)\gt0$, and $\alpha_j\to\infty$ gives $L\to\infty$. Hence $\inf_x\sup_\alpha L$ is $\inf f$ over the feasible $x$, which is $p^*$.
**2.** $d(\alpha)=\inf_{x'}L(x',\alpha)\le L(x,\alpha)=f(x)+\sum_i\alpha_ig_i(x)\le f(x)$. This holds for every $\alpha\ge0$ and every feasible $x$, so taking the supremum on the left and the infimum on the right gives $d^*\le p^*$.
**3.** Applying the max–min inequality with the maximizing variable $\alpha\in\{\alpha\ge0\}$, the minimizing variable $x$, and the function $F(\alpha,x)=L(x,\alpha)$ gives $\sup_\alpha\inf_xL\le\inf_x\sup_\alpha L$, i.e., $d^*\le p^*$ (using 1). In the SVM, $d^*=p^*$ (strong duality) thanks to convexity and Slater's condition.
**4.** For fixed $x$, $\alpha\mapsto L(x,\alpha)$ is affine. For $t\in[0,1]$,
$$d(t\alpha+(1-t)\beta)=\inf_x\big[tL(x,\alpha)+(1-t)L(x,\beta)\big]\ge t\inf_xL(x,\alpha)+(1-t)\inf_xL(x,\beta).$$
The infimum of affine functions is concave.`,
        rubric: R`
- The two cases of the inner sup — 3 pts
- Weak duality (stating the order of the inequalities) — 3 pts
- The connection with the max–min inequality — 2 pts
- Concavity of the dual function — 2 pts` },
      { q: R`A hyperplane $H=\{x:w^Tx+b=0\}$ ($w\ne0$) and a point $x_0$.
1. Write the Lagrangian of $\min_x\frac12\lVert x-x_0\rVert^2$ s.t. $w^Tx+b=0$, and use the stationarity condition to find the nearest point $x^*=x_0-\dfrac{w^Tx_0+b}{\lVert w\rVert^2}w$.
2. Show that the distance between the point and the hyperplane is $\dfrac{\lvert w^Tx_0+b\rvert}{\lVert w\rVert}$.
3. Show that if the SVM constraints $y_i(w^Tx_i+b)\ge1$ ($y_i\in\{\pm1\}$) hold, every data point is at distance $\ge\frac1{\lVert w\rVert}$ from the hyperplane. Which points attain equality?
4. For $w=(3,4)$, $b=-5$, $x_0=(2,1)$, find the distance and $x^*$.`,
        sol: R`
**1.** It is an equality constraint, so the sign of the multiplier $\mu$ is free: $L=\frac12\lVert x-x_0\rVert^2+\mu(w^Tx+b)$. $\nabla_xL=x-x_0+\mu w=0\Rightarrow x=x_0-\mu w$. Putting this into the constraint, $w^Tx_0-\mu\lVert w\rVert^2+b=0$, $\mu=\frac{w^Tx_0+b}{\lVert w\rVert^2}$. The objective is strongly convex and the feasible set is affine, so this stationary point is the unique minimizer.
**2.** $\lVert x_0-x^*\rVert=\lvert\mu\rvert\lVert w\rVert=\frac{\lvert w^Tx_0+b\rvert}{\lVert w\rVert}$.
**3.** $y_i(w^Tx_i+b)\ge1\gt0$ and $\lvert y_i\rvert=1$, so $\lvert w^Tx_i+b\rvert=y_i(w^Tx_i+b)\ge1$. By 2, the distance is $\ge\frac1{\lVert w\rVert}$. Equality holds at the points with $y_i(w^Tx_i+b)=1$, i.e., points on the margin boundaries (candidate support vectors).
**4.** $w^Tx_0+b=6+4-5=5$ and $\lVert w\rVert=5$, so the distance is 1. $\mu=\frac5{25}=\frac15$, $x^*=(2,1)-\frac15(3,4)=(1.4,\ 0.2)$. Check: $3(1.4)+4(0.2)-5=0$.`,
        rubric: R`
- The Lagrangian and the nearest point — 4 pts
- The distance formula — 2 pts
- The lower bound on the margin and equality — 2 pts
- Numbers — 2 pts` },
    ],
  };
})();
