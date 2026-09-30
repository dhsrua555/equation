/* English text — proofs, Part B: 05 logistic regression, 06 softmax regression, 07 SVM. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 05
  'ch05-sigmoid': { title: 'The Logit and the Sigmoid, and the Derivative of the Sigmoid',
    stmt: R`$\sigma(z)=\frac1{1+e^{-z}}$ is the inverse of $\operatorname{logit}(p)=\log\frac p{1-p}$, $\sigma(-z)=1-\sigma(z)$, and $\sigma'(z)=\sigma(z)(1-\sigma(z))\le\frac14$.`,
    body: R`
**Inverse.** If $z=\log\frac p{1-p}$, then $e^z=\frac p{1-p}$, $e^z(1-p)=p$, $p(1+e^z)=e^z$, hence $p=\frac{e^z}{1+e^z}=\frac1{1+e^{-z}}=\sigma(z)$. Conversely, $\operatorname{logit}(\sigma(z))=\log\frac{1/(1+e^{-z})}{e^{-z}/(1+e^{-z})}=\log e^z=z$.

**Symmetry.** $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}=\frac1{e^z+1}=\sigma(-z)$.

**Derivative.** Differentiating $\sigma(z)=(1+e^{-z})^{-1}$ by the chain rule,
$$\sigma'(z)=\frac{e^{-z}}{(1+e^{-z})^2}=\frac1{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)\big(1-\sigma(z)\big).$$
For $s=\sigma(z)\in(0,1)$, $s(1-s)=\frac14-(s-\frac12)^2\le\frac14$, with equality at $s=\frac12$ ($z=0$).` },
  'ch05-lrnll': { title: 'Simplifying the Negative Log-Likelihood of Logistic Regression',
    stmt: R`If $P(y_i=1\mid x_i,w)=\sigma(w^Tx_i)$ and $y_i\in\{0,1\}$, then
$$-\log L(w)=-\sum_i\big[y_i\log\sigma(z_i)+(1-y_i)\log(1-\sigma(z_i))\big]=\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i,\quad z_i=w^Tx_i.$$`,
    body: R`
**Likelihood.** Writing the Bernoulli distribution in one formula, $p(y_i\mid x_i,w)=\sigma(z_i)^{y_i}(1-\sigma(z_i))^{1-y_i}$ (only the first factor survives if $y_i=1$, only the second if $0$). By independence $L=\prod_ip(y_i\mid x_i,w)$, and
$$-\log L=-\sum_i\big[y_i\log\sigma(z_i)+(1-y_i)\log(1-\sigma(z_i))\big].$$

**Simplifying (notes).** From $\sigma(z)=\frac1{1+e^{-z}}$ and $1-\sigma(z)=\frac{e^{-z}}{1+e^{-z}}$,
$$-\log\sigma(z)=\log(1+e^{-z}),\qquad -\log(1-\sigma(z))=-\log e^{-z}+\log(1+e^{-z})=z+\log(1+e^{-z}).$$
Substituting,
$$-\log L=\sum_iy_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i+\sum_i(1-y_i)\log(1+e^{-z_i}).$$
Adding the coefficients of the first and third sums gives $y_i+(1-y_i)=1$, so $-\log L=\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i$.`,
    note: R`Writing the labels as $t_i\in\{1,-1\}$, the same loss becomes the single line $\sum_i\log(1+e^{-t_iz_i})$ ($t_i=2y_i-1$). It has the form compared with the SVM's hinge loss $\max(0,1-t_iz_i)$.` },
  'ch05-lrgrad': { title: 'The Gradient of the Logistic Loss',
    stmt: R`The gradient of $J(w)=\sum_i\log(1+e^{-w^Tx_i})+\sum_i(1-y_i)w^Tx_i$ is $\nabla J=\sum_i\big(\sigma(w^Tx_i)-y_i\big)x_i$.`,
    body: R`
With $z_i=w^Tx_i$, $\nabla_wz_i=x_i$. By the chain rule,
$$\nabla_w\log(1+e^{-z_i})=\frac{-e^{-z_i}}{1+e^{-z_i}}\,x_i=-\big(1-\sigma(z_i)\big)x_i,\qquad \nabla_w(1-y_i)z_i=(1-y_i)x_i.$$
Adding gives $\big[-1+\sigma(z_i)+1-y_i\big]x_i=(\sigma(z_i)-y_i)x_i$. Summing gives the result.

**Another route (notes).** From the sample loss $l_i=-[y_i\log p_i+(1-y_i)\log(1-p_i)]$, $p_i=\sigma(z_i)$,
$$\frac{\partial l_i}{\partial z_i}=-\frac{y_i}{p_i}\sigma'(z_i)+\frac{1-y_i}{1-p_i}\sigma'(z_i)=-y_i(1-p_i)+(1-y_i)p_i=p_i-y_i,$$
(since $\sigma'=p_i(1-p_i)$), so $\nabla_wl_i=(p_i-y_i)x_i$.` },
  'ch05-lrhess': { title: 'The Hessian of the Logistic Loss and Convexity',
    stmt: R`$\nabla^2J(w)=\sum_i\sigma(z_i)(1-\sigma(z_i))x_ix_i^T=X^TSX$, which is positive semidefinite. Hence $J$ is convex, and a $w^*$ with $\nabla J(w^*)=0$ is a global minimizer.`,
    body: R`
**Hessian.** Differentiating the $k$-th component $\sum_i(\sigma(z_i)-y_i)x_{ik}$ of $\nabla J=\sum_i(\sigma(z_i)-y_i)x_i$ in $w_l$, with $\frac{\partial\sigma(z_i)}{\partial w_l}=\sigma'(z_i)x_{il}$,
$$\frac{\partial^2J}{\partial w_l\partial w_k}=\sum_i\sigma'(z_i)x_{ik}x_{il}\quad\Longrightarrow\quad\nabla^2J=\sum_i\sigma'(z_i)x_ix_i^T.$$
As a matrix it is $X^TSX$, where the $i$-th row of $X$ is $x_i^T$, $S=\diag(s_1,\dots,s_N)$, and $s_i=\sigma(z_i)(1-\sigma(z_i))$ (the notes' $\sum_ix_is_ix_i^T=X^TSX$).

**Positive semidefinite (notes).** For any $v$,
$$v^T\nabla^2Jv=(Xv)^TS(Xv)=\sum_is_i(x_i^Tv)^2\ge0,\qquad s_i\in(0,\tfrac14].$$

**Convexity.** For $u,w$, let $g(t)=J(w+t(u-w))$; then $g''(t)=(u-w)^T\nabla^2J(\cdot)(u-w)\ge0$, so $g$ is convex and $g(1)\ge g(0)+g'(0)$, i.e.,
$$J(u)\ge J(w)+\nabla J(w)^T(u-w).$$
If $\nabla J(w^*)=0$, then $J(u)\ge J(w^*)$ for every $u$.`,
    note: R`All the diagonal entries of $S$ are positive, so if the columns of $X$ are linearly independent, $X^TSX\succ0$ (strictly convex). Even so, if the data are linearly separable, a minimizer does not exist at all (the loss never reaches its lower bound 0). A positive definite Hessian only means “if a minimizer exists, it is unique”.` },
  'ch05-lrcontour': { title: 'The Probability Contours Are Parallel Hyperplanes',
    stmt: R`For $0<c<1$, $\{x:\sigma(w^Tx)=c\}=\{x:w^Tx=\log\frac c{1-c}\}$. In particular, for $c=\frac12$ it is the decision boundary $w^Tx=0$.`,
    body: R`
$\sigma$ is strictly increasing ($\sigma'>0$), hence one-to-one, and its inverse is the logit. So $\sigma(w^Tx)=c\iff w^Tx=\operatorname{logit}(c)$. The right side is a constant, so these are hyperplanes with the same normal $w$, and changing $c$ only translates them. $\operatorname{logit}(\frac12)=0$.` },

  // ───── 06
  'ch06-softjac': { title: 'The Jacobian of the Softmax',
    stmt: R`If $p_k=\dfrac{e^{z_k}}{\sum_je^{z_j}}$, then $\dfrac{\partial p_k}{\partial z_m}=p_k(\delta_{km}-p_m)$, i.e., the Jacobian is $\diag(p)-pp^T$.`,
    body: R`
$Z=\sum_je^{z_j}$, $\dfrac{\partial Z}{\partial z_m}=e^{z_m}$, $\dfrac{\partial e^{z_k}}{\partial z_m}=\delta_{km}e^{z_k}$. By the quotient rule,
$$\frac{\partial p_k}{\partial z_m}=\frac{\delta_{km}e^{z_k}\,Z-e^{z_k}\,e^{z_m}}{Z^2}=\delta_{km}\frac{e^{z_k}}Z-\frac{e^{z_k}}Z\cdot\frac{e^{z_m}}Z=\delta_{km}p_k-p_kp_m.$$
Collecting the $(k,m)$ entries gives $\diag(p)-pp^T$.

**With respect to the weights.** Since $z_l=w_l^Tx$, $\partial z_l/\partial w_{mn}=\delta_{lm}x_n$, and
$$\frac{\partial p_k}{\partial w_{mn}}=\sum_l\frac{\partial p_k}{\partial z_l}\frac{\partial z_l}{\partial w_{mn}}=(\delta_{km}p_k-p_kp_m)x_n$$
(the formula on slide 17).`,
    note: R`The row sums of $\diag(p)-pp^T$ are $p_k-p_k\sum_mp_m=0$. It is the derivative version of the fact that adding the same value to every logit does not change the probabilities.` },
  'ch06-softgrad': { title: 'The Gradient of the Softmax Cross-Entropy',
    stmt: R`If $J(W)=-\sum_i\sum_ky_{ik}\log p_k(x_i,W)$ (one-hot $y_i$), then $\dfrac{\partial J}{\partial w_{mn}}=-\sum_i\big(y_{im}-p_m(x_i,W)\big)x_{in}$, i.e., $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$.`,
    body: R`
For one sample, $\frac{\partial}{\partial w_{mn}}\log p_k=\frac1{p_k}\frac{\partial p_k}{\partial w_{mn}}=\frac1{p_k}(\delta_{km}p_k-p_kp_m)x_n=(\delta_{km}-p_m)x_n$. Hence
$$\frac{\partial J}{\partial w_{mn}}=-\sum_i\sum_ky_{ik}(\delta_{km}-p_m)x_{in}=-\sum_i\Big(y_{im}-p_m\sum_ky_{ik}\Big)x_{in}=-\sum_i(y_{im}-p_m)x_{in}.$$
The last step used the one-hot condition $\sum_ky_{ik}=1$. Collecting the $(m,n)$ entries gives $\nabla_WJ=\sum_i(p(x_i)-y_i)x_i^T$ (a $C\times d$ matrix).`,
    note: R`For $C=2$, $p_1=\sigma((w_1-w_2)^Tx)$, and this formula becomes the logistic regression gradient $\sum(\sigma-y)x$.` },
  'ch06-softshift': { title: 'Shift Invariance of the Softmax and the Binary Case',
    stmt: R`Replacing $z_k\to z_k+c$ for every $k$ leaves $\softmax(z)$ unchanged. In particular, for $C=2$, $p_1=\sigma(z_1-z_2)$.`,
    body: R`
$$\frac{e^{z_k+c}}{\sum_je^{z_j+c}}=\frac{e^ce^{z_k}}{e^c\sum_je^{z_j}}=\frac{e^{z_k}}{\sum_je^{z_j}}.$$
$C=2$: dividing the numerator and denominator of $p_1=\frac{e^{z_1}}{e^{z_1}+e^{z_2}}$ by $e^{z_1}$ gives $\frac1{1+e^{-(z_1-z_2)}}=\sigma(z_1-z_2)$.

In terms of the weights, adding the same $v$ to every $w_k$ adds $v^Tx$ to each $z_k$, so the model is the same. This is why the minimizer of unregularized softmax regression is not unique, and in numerical computation adding $c=-\max_jz_j$ prevents overflow.` },
  'ch06-softconvex': { title: 'The Softmax Cross-Entropy Is Convex',
    stmt: R`The Hessian of the single-sample loss $\ell(z)=-\log p_y(z)$ is $\nabla_z^2\ell=\diag(p)-pp^T\succeq0$, and hence $J(W)$ is convex in $W$.`,
    body: R`
$\ell(z)=-z_y+\log\sum_je^{z_j}$, so $\nabla_z\ell=p-e_y$ ($e_y$ one-hot) and $\nabla_z^2\ell=\frac{\partial p}{\partial z}=\diag(p)-pp^T$ (the Jacobian proof).
For any $v$,
$$v^T(\diag(p)-pp^T)v=\sum_kp_kv_k^2-\Big(\sum_kp_kv_k\Big)^2=\E_p[V^2]-(\E_p[V])^2=\Var_p(V)\ge0,$$
where $V$ is the random variable taking the value $v_k$ with probability $p_k$. $\ell$ is convex in $z$ and $z=Wx$ is a linear function of $W$, so the composition $\ell(Wx)$ is convex in $W$, and $J$, a sum of convex functions, is convex too.` },

  // ───── 07
  'ch07-dist': { title: 'The Distance from a Point to a Hyperplane',
    stmt: R`The distance between $H=\{z:w^Tz+b=0\}$ ($w\ne0$) and a point $x$ is $\dfrac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}$.`,
    body: R`
**The foot of the perpendicular (notes).** Suppose $x_p=x-d$ is a point of $H$ and $d$ is parallel to the normal $w$, so $d=\alpha w$. From $x_p\in H$,
$$w^T(x-\alpha w)+b=0\iff\alpha=\frac{w^Tx+b}{w^Tw}.$$
$$\lVert d\rVert_2=\sqrt{\alpha^2w^Tw}=\lvert\alpha\rvert\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{w^Tw}\sqrt{w^Tw}=\frac{\lvert w^Tx+b\rvert}{\lVert w\rVert_2}.$$

**Minimum distance.** For any point $z$ of $H$, $w^T(x_p-z)=(-b)-(-b)=0$, so $x_p-z\perp w\parallel d$. Hence
$$\lVert x-z\rVert^2=\lVert d+(x_p-z)\rVert^2=\lVert d\rVert^2+\lVert x_p-z\rVert^2\ge\lVert d\rVert^2,$$
with equality at $z=x_p$. That is, $\lVert d\rVert$ is the distance from $x$ to $H$.`,
    note: R`Why $w$ is the normal: for two points $z_1,z_2$ of $H$, $w^T(z_1-z_2)=0$, i.e., $w$ is orthogonal to every direction within the plane. With $x=0$, the distance to the origin is $\lvert b\rvert/\lVert w\rVert$ (slide 20).` },
  'ch07-svmprimal': { title: 'From Margin Maximization to the Hard-Margin SVM',
    stmt: R`If the data are linearly separable, the optimal hyperplane of $\max_{w,b}r(w,b)$ s.t. $y_i(w^Tx_i+b)\ge0$ ($r(w,b)=\min_{x\in D}\lvert w^Tx+b\rvert/\lVert w\rVert_2$) is the same as the solution of $\min_{w,b}\frac12w^Tw$ s.t. $y_i(w^Tx_i+b)\ge1$.`,
    body: R`
**1. Scale invariance (notes).** If $\beta>0$, $\{x:\beta w^Tx+\beta b=0\}$ is the same plane and
$$r(\beta w,\beta b)=\min_x\frac{\beta\lvert w^Tx+b\rvert}{\beta\lVert w\rVert}=r(w,b),\qquad y_i(\beta w^Tx_i+\beta b)\ge0\iff y_i(w^Tx_i+b)\ge0.$$

**2. Normalization.** The optimal plane passes through no data point (if it did, the margin would be 0, but since the data are separable there is a plane with positive margin). Hence $\min_i\lvert w^Tx_i+b\rvert>0$, and rescaling by $\beta=1/\min_i\lvert w^Tx_i+b\rvert$ we can set $\min_i\lvert w^Tx_i+b\rvert=1$. Then
$$r(w,b)=\frac1{\lVert w\rVert}\Big[\min_x\lvert w^Tx+b\rvert\Big]=\frac1{\lVert w\rVert}.$$
(The notes wrote the denominator as $w^Tw$, but the denominator of the distance formula is $\lVert w\rVert=\sqrt{w^Tw}$.)

**3. The objective.** $\max\frac1{\lVert w\rVert}\iff\min\lVert w\rVert\iff\min\frac12w^Tw$ ($t\mapsto\frac12t^2$ is increasing on $t\ge0$).

**4. Merging the constraints.** The problem is now “$\min\frac12w^Tw$ s.t. $y_i(w^Tx_i+b)\ge0$, $\min_i\lvert w^Tx_i+b\rvert=1$” (notes). We show that this is the same as “$\min\frac12w^Tw$ s.t. $y_i(w^Tx_i+b)\ge1$”.
- A feasible point of the former is feasible for the latter: if $y_i\in\{\pm1\}$ and $y_i(w^Tx_i+b)\ge0$, then $y_i(w^Tx_i+b)=\lvert w^Tx_i+b\rvert\ge1$.
- The optimal solution $(w^*,b^*)$ of the latter is feasible for the former: $y_i(\cdot)\ge1\ge0$ is clear, and if $m=\min_iy_i(w^{*T}x_i+b^*)>1$, then $(w^*/m,b^*/m)$ is also feasible for the latter with $\frac12\lVert w^*/m\rVert^2<\frac12\lVert w^*\rVert^2$, contradicting optimality. Hence $m=1$, i.e., $\min_i\lvert w^{*T}x_i+b^*\rvert=1$.

The feasible region of the former is contained in that of the latter, and the optimal solution of the latter lies in the former region, so the two problems have the same optimal solution.`,
    note: R`At the optimum $\min_iy_i(w^Tx_i+b)=1$, so there are always points attaining equality, i.e., points on $x^Tw+b=\pm1$. These are the support vectors, and the margin width is $2/\lVert w\rVert$.` },
  'ch07-penalty': { title: 'Expressing Constraints with a Penalty Function',
    stmt: R`With $g_i(w,b)=1-y_i(x_i^Tw+b)$, $\max_{\alpha_i\ge0}\alpha_ig_i=0$ ($g_i\le0$) or $+\infty$ ($g_i>0$). Hence $\min_{w,b}\big[\frac12w^Tw+\sum_i\max_{\alpha_i\ge0}\alpha_ig_i\big]=\min_{w,b}\max_{\alpha\ge0}L_p(w,b,\alpha)$ is the same as the hard-margin SVM.`,
    body: R`
**(i) $g_i\le0$ (constraint satisfied).** If $\alpha_i\ge0$ then $\alpha_ig_i\le0$, and it is 0 at $\alpha_i=0$, so the maximum is 0.

**(ii) $g_i>0$ (constraint violated).** $\alpha_ig_i\to\infty$ ($\alpha_i\to\infty$), so it is unbounded: $+\infty$.

Hence $\frac12w^Tw+\sum_i\max_{\alpha_i}\alpha_ig_i$ equals $\frac12w^Tw$ at feasible points and $+\infty$ at infeasible ones, and minimizing it gives the optimal solution of the primal problem. The $\alpha_i$ can be chosen independently of one another, so $\sum_i\max_{\alpha_i}=\max_\alpha\sum_i$, and writing $L_p=\frac12w^Tw+\sum_i\alpha_ig_i$ gives $\min_{w,b}\max_{\alpha\ge0}L_p$.` },
  'ch07-weakdual': { title: 'Weak Duality',
    stmt: R`For any sets $U,V$ and function $L:U\times V\to\mathbb R$, $\inf_{u}\sup_{v}L(u,v)\ge\sup_{v}\inf_{u}L(u,v)$.`,
    body: R`
Fixing arbitrary $u'\in U$, $v'\in V$, by the definitions of infimum and supremum,
$$\inf_{u}L(u,v')\le L(u',v')\le\sup_{v}L(u',v).$$
The leftmost side does not depend on $u'$, so the inequality survives taking the infimum of the right side over $u'$: $\inf_uL(u,v')\le\inf_{u'}\sup_vL(u',v)$. Now the right side does not depend on $v'$, so taking the supremum of the left side over $v'$ gives
$$\sup_{v'}\inf_uL(u,v')\le\inf_{u'}\sup_vL(u',v).$$`,
    note: R`For the SVM the primal problem is a convex quadratic program with affine constraints and a feasible point, so equality (strong duality) holds (the affine version of Slater's condition). Hence the optimal values of the dual and primal problems are equal, and the primal solution can be recovered from the dual solution.` },
  'ch07-svmdual': { title: 'Deriving the SVM Dual Problem',
    stmt: R`For $L_p(w,b,\alpha)=\frac12w^Tw+\sum_i\alpha_i(1-y_i(x_i^Tw+b))$, $\alpha\ge0$, $\min_{w,b}L_p$ equals $\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$ when $\sum_i\alpha_iy_i=0$ (attained at $w=\sum_i\alpha_iy_ix_i$), and $-\infty$ when $\sum_i\alpha_iy_i\ne0$. Hence the dual problem is
$$\max_\alpha\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j\quad\text{s.t. }\alpha_i\ge0,\ \sum_i\alpha_iy_i=0.$$`,
    body: R`
Expand $L_p$.
$$L_p=\frac12w^Tw-w^T\Big(\sum_i\alpha_iy_ix_i\Big)-b\sum_i\alpha_iy_i+\sum_i\alpha_i.$$
**In $b$.** It is linear in $b$, so if the coefficient $\sum_i\alpha_iy_i\ne0$, $b\to\pm\infty$ gives $-\infty$. For the dual function to be finite, $\sum_i\alpha_iy_i=0$ (the slide's $\partial L_p/\partial b=0$).

**In $w$.** $\frac12w^Tw-w^Tu$ ($u=\sum_i\alpha_iy_ix_i$) is a strictly convex quadratic, minimized at $\nabla_w=w-u=0$, with minimum value $\frac12u^Tu-u^Tu=-\frac12u^Tu$.

**Substitution.** If $\sum\alpha_iy_i=0$,
$$\min_{w,b}L_p=\sum_i\alpha_i-\frac12u^Tu=\sum_i\alpha_i-\frac12\Big(\sum_i\alpha_iy_ix_i\Big)^T\Big(\sum_j\alpha_jy_jx_j\Big)=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j.$$
Maximizing this over $\alpha\ge0$, $\sum\alpha_iy_i=0$ is the dual problem.`,
    note: R`The dual objective is concave in $\alpha$: the quadratic term is $-\frac12\lVert\sum\alpha_iy_ix_i\rVert^2\le0$. Hence the dual problem is a convex optimization (maximizing a concave function), solved with a quadratic programming solver.` },
  'ch07-svmb': { title: 'The Intercept b and KKT Complementary Slackness',
    stmt: R`At a support vector $x_i$ ($y_i(x_i^Tw+b)=1$), $b=y_i-x_i^Tw$. Also, at the optimum $\alpha_i\big(1-y_i(x_i^Tw+b)\big)=0$, so points with $y_i(x_i^Tw+b)>1$ have $\alpha_i=0$.`,
    body: R`
**Intercept.** Multiplying both sides of $y_i(x_i^Tw+b)=1$ by $y_i$ gives $y_i^2(x_i^Tw+b)=y_i$, and since $y_i^2=1$, $x_i^Tw+b=y_i$, $b=y_i-x_i^Tw$.

**Complementary slackness.** If strong duality holds and $(w^*,b^*)$ and $\alpha^*$ are the primal and dual optimal solutions,
$$\tfrac12\lVert w^*\rVert^2=\min_{w,b}L_p(w,b,\alpha^*)\le L_p(w^*,b^*,\alpha^*)=\tfrac12\lVert w^*\rVert^2+\sum_i\alpha_i^*g_i(w^*,b^*).$$
But $\alpha_i^*\ge0$ and $g_i(w^*,b^*)\le0$, so $\sum_i\alpha_i^*g_i\le0$. From the two, $\sum_i\alpha_i^*g_i=0$, and since each term is $\le0$, $\alpha_i^*g_i=0$ for every $i$. If $g_i<0$ (outside the margin), $\alpha_i^*=0$.`,
    note: R`As a result, $w=\sum_i\alpha_iy_ix_i$ is a linear combination of only the points with $\alpha_i>0$, i.e., the support vectors on the margin boundaries. Moving or deleting points that are not support vectors (as long as they stay outside the margin) does not change the solution.` },
  });
})();
