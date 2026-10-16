/* English text — proofs not in the lecture notes, Part H (Units 5–8: logistic regression, softmax regression, SVM, basics of neural networks) */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  'ch05-gausslogit': { title: 'With Gaussian classes of equal covariance the posterior is logistic',
    stmt: R`Suppose the binary label $y\in\{0,1\}$ has prior $P(y=1)=\pi\in(0,1)$ and the inputs of each class are Gaussian with a common covariance, $x\mid y=k\sim\N(\mu_k,\Sigma)$ ($k=0,1$, $\Sigma$ symmetric positive definite). Then the posterior log odds is linear in $x$, and the logistic regression model comes out exactly.
$$\log\frac{P(y=1\mid x)}{P(y=0\mid x)}=w^Tx+b,$$
$$P(y=1\mid x)=\sigma(w^Tx+b),$$
$$w=\Sigma^{-1}(\mu_1-\mu_0),$$
$$\begin{aligned}b=&-\tfrac12\mu_1^T\Sigma^{-1}\mu_1+\tfrac12\mu_0^T\Sigma^{-1}\mu_0\\&+\log\tfrac{\pi}{1-\pi}.\end{aligned}$$`,
    body: R`
**1. Bayes' rule.** Let $f_k$ be the density of $\N(\mu_k,\Sigma)$. By Bayes' rule (Section 2.2)
$$P(y=1\mid x)=\frac{\pi f_1(x)}{\pi f_1(x)+(1-\pi)f_0(x)}.$$
Divide numerator and denominator by $\pi f_1(x)>0$ and set $a(x)=\log\dfrac{\pi f_1(x)}{(1-\pi)f_0(x)}$; then $P(y=1\mid x)=\dfrac1{1+e^{-a(x)}}=\sigma(a(x))$. Also $P(y=0\mid x)$ has the same denominator and numerator $(1-\pi)f_0(x)$, so the ratio of the two posteriors is $\frac{\pi f_1(x)}{(1-\pi)f_0(x)}$: $a(x)$ is exactly the posterior log odds (posterior odds = prior odds × likelihood ratio).

**2. The normalizing constants cancel.** The density of a $d$-dimensional Gaussian is
$$f_k(x)=\frac{\exp\big(-\frac12Q_k(x)\big)}{(2\pi)^{d/2}(\det\Sigma)^{1/2}},$$
$$Q_k(x)=(x-\mu_k)^T\Sigma^{-1}(x-\mu_k).$$
Both classes use the same $\Sigma$, so the denominators are equal and cancel in the ratio.
$$\log\frac{f_1(x)}{f_0(x)}=-\tfrac12Q_1(x)+\tfrac12Q_0(x).$$

**3. The quadratic term cancels.** If $\Sigma$ is symmetric then $(\Sigma^{-1})^T=(\Sigma^T)^{-1}=\Sigma^{-1}$, so $\Sigma^{-1}$ is symmetric too, and the $1\times1$ matrix $x^T\Sigma^{-1}\mu_k$ equals its transpose $\mu_k^T\Sigma^{-1}x$. Hence
$$Q_k=x^T\Sigma^{-1}x-2\mu_k^T\Sigma^{-1}x+\mu_k^T\Sigma^{-1}\mu_k.$$
In $-\frac12Q_1+\frac12Q_0$ the coefficient of $x^T\Sigma^{-1}x$ is $-\frac12+\frac12=0$, so it drops out and
$$\begin{aligned}-\tfrac12Q_1+\tfrac12Q_0=&\ (\mu_1-\mu_0)^T\Sigma^{-1}x\\&-\tfrac12\mu_1^T\Sigma^{-1}\mu_1+\tfrac12\mu_0^T\Sigma^{-1}\mu_0.\end{aligned}$$

**4. Conclusion.** Substituting step 3 into $a(x)=\log\frac\pi{1-\pi}+\log\frac{f_1(x)}{f_0(x)}$ gives $a(x)=w^Tx+b$. Transposing $w^T=(\mu_1-\mu_0)^T\Sigma^{-1}$ (again by the symmetry of $\Sigma^{-1}$) gives $w=\Sigma^{-1}(\mu_1-\mu_0)$, and $b$ collects the remaining constants. By step 1, $P(y=1\mid x)=\sigma(w^Tx+b)$. Absorbing the intercept as $w_0=b$, $x_0=1$ gives exactly $\log\frac p{1-p}=w^Tx$ of Section 5.2.`,
    note: R`If the covariances differ ($\Sigma_0\ne\Sigma_1$), the term $\frac12x^T(\Sigma_0^{-1}-\Sigma_1^{-1})x$ survives step 3 (the ratio of normalizing constants stays as a constant), so the log odds is quadratic in $x$ and the decision boundary is a quadric. The converse fails: a logistic posterior does not force the class distributions to be Gaussian, which is why logistic regression, fitting only the shape of the posterior without a distributional assumption, is used more widely. Also, since the log odds is $w^Tx$, increasing $x_j$ alone by 1 multiplies the odds by $e^{w_j}$ (the odds ratio).` },
  'ch05-separable': { title: 'Separable data have no maximum likelihood solution; regularization gives exactly one',
    stmt: R`Let $J(w)=\sum_{i=1}^N\big[\log(1+e^{-z_i})+(1-y_i)z_i\big]$ ($z_i=w^Tx_i$, $y_i\in\{0,1\}$) be the negative log likelihood of logistic regression.

(i) If the data are linearly separable, i.e. for some $\bar w$ we have $\bar w^Tx_i>0$ when $y_i=1$ and $\bar w^Tx_i<0$ when $y_i=0$, then $\inf_wJ(w)=0$ but $J(w)>0$ for every $w$. Hence $J$ has neither a minimizer nor a point of zero gradient.

(ii) If $\lambda>0$, then for any data $J_\lambda(w)=J(w)+\frac\lambda2\lVert w\rVert^2$ has exactly one minimizer.`,
    body: R`
**1. Sample losses are positive.** The loss of one sample, $\ell_i=\log(1+e^{-z_i})+(1-y_i)z_i$, is $\log(1+e^{-z_i})$ if $y_i=1$, and if $y_i=0$ it is
$$\begin{aligned}\log(1+e^{-z_i})+z_i&=\log\big(e^{z_i}(1+e^{-z_i})\big)\\&=\log(1+e^{z_i}).\end{aligned}$$
Rewriting the labels as $t_i=2y_i-1\in\{1,-1\}$ merges both cases into $\ell_i=\log(1+e^{-t_iz_i})$. The argument of the log exceeds 1, so $\ell_i>0$, and therefore $J(w)>0$ for every $w$.

**2. Scale up along the separator.** Separability means $m_i=t_i\,\bar w^Tx_i>0$ for all $i$. Putting $w=c\bar w$ ($c>0$) gives
$$J(c\bar w)=\sum_{i=1}^N\log\big(1+e^{-cm_i}\big).$$
Since $m_i>0$, each term strictly decreases in $c$ and tends to $\log1=0$ as $c\to\infty$. Hence $\inf_wJ\le\lim_{c\to\infty}J(c\bar w)=0$, and together with $J>0$ from step 1, $\inf_wJ=0$.

**3. No minimizer and no stationary point.** A minimizer $w^*$ would need $J(w^*)=\inf J=0$, contradicting $J(w^*)>0$ from step 1. Moreover $J$ is convex (Hessian $X^TSX\succeq0$, Section 5.5), so a point with $\nabla J(w)=0$ would be a global minimizer. As there is no minimizer, there is no point of zero gradient either, and gradient descent has no stationary point to converge to.

**4. Regularized: existence.** Now let $\lambda>0$ and the data be arbitrary. Since $J\ge0$, $J_\lambda(w)\ge\frac\lambda2\lVert w\rVert^2$. With $c_0=J_\lambda(0)=N\log2$, every $w$ with $\lVert w\rVert>\rho=\sqrt{2c_0/\lambda}$ has $J_\lambda(w)>c_0$. The closed ball $\{\lVert w\rVert\le\rho\}$ is closed and bounded and $J_\lambda$ is continuous, so $J_\lambda$ attains a minimum on the ball (extreme value theorem); that value is at most $J_\lambda(0)=c_0$, hence below every value outside the ball. So a global minimizer exists.

**5. Regularized: uniqueness.** The squared norm satisfies the midpoint identity
$$\Big\lVert\frac{u+v}2\Big\rVert^2=\frac{\lVert u\rVert^2+\lVert v\rVert^2}2-\frac{\lVert u-v\rVert^2}4$$
(expand both sides with inner products), and $J$ is convex, so $J(\frac{u+v}2)\le\frac{J(u)+J(v)}2$. Combining the two,
$$\begin{aligned}J_\lambda\Big(\frac{u+v}2\Big)\le&\ \frac{J_\lambda(u)+J_\lambda(v)}2\\&-\frac\lambda8\lVert u-v\rVert^2.\end{aligned}$$
If there were two minimizers $u\ne v$ with $J_\lambda(u)=J_\lambda(v)=m$, the midpoint would give $J_\lambda<m$, a contradiction. So the minimizer is unique.`,
    note: R`In the one-dimensional example of Section 5.5 ($x=-1$ with label 0, $x=+1$ with label 1, model $\sigma(wx)$), $\bar w=1$ separates and $J(w)=2\log(1+e^{-w})$ only decreases toward 0 as $w\to\infty$. The lesson of (i): a positive definite Hessian (Section 5.5) only says that a minimizer is unique **if** it exists, not that it exists. The penalty $\frac\lambda2\lVert w\rVert^2$ is the MAP estimate under the prior $w\sim\N(0,\frac1\lambda I)$ (Section 2.6).` },
  'ch06-lse': { title: 'Log-sum-exp is a soft maximum',
    stmt: R`For $z\in\mathbb R^C$ ($C\ge2$) let $\operatorname{LSE}(z)=\log\sum_{j=1}^Ce^{z_j}$, $M=\max_jz_j$, $A=\{k:z_k=M\}$, and $p=\softmax(z)$.

(i) $M<\operatorname{LSE}(z)\le M+\log C$, with equality on the right only when all $z_k$ are equal.

(ii) $\dfrac{\partial\operatorname{LSE}}{\partial z_k}=p_k$, i.e. $\nabla\operatorname{LSE}(z)=\softmax(z)$.

(iii) For a temperature $T>0$, $M<T\operatorname{LSE}(z/T)\le M+T\log C$, so $T\operatorname{LSE}(z/T)\to M$ as $T\to0^+$.

(iv) As $T\to0^+$, $\softmax(z/T)_k\to\frac1{\lvert A\rvert}$ ($k\in A$) and $0$ ($k\notin A$) (the one-hot vector of the argmax when the maximum is unique). As $T\to\infty$, $\softmax(z/T)\to\frac1C\mathbf 1$ (the uniform distribution).`,
    body: R`
**(i) Range.** For all $j$, $z_j\le M$, so $e^{z_j}\le e^M$, and $e^{z_k}=e^M$ for $k\in A$. Summing,
$$e^M<\sum_{j=1}^Ce^{z_j}\le Ce^M.$$
The left inequality is strict because $C\ge2$, so besides $e^M$ there is at least one more positive term. Equality on the right holds only when every term is $e^M$, i.e. all $z_j=M$. Since $\log$ is strictly increasing, taking logs gives $M<\operatorname{LSE}(z)\le M+\log C$, with the same equality condition.

**(ii) Gradient.** With $Z=\sum_je^{z_j}$, the only term containing $z_k$ is $e^{z_k}$, so $\frac{\partial Z}{\partial z_k}=e^{z_k}$. By the chain rule
$$\frac{\partial}{\partial z_k}\log Z=\frac1Z\frac{\partial Z}{\partial z_k}=\frac{e^{z_k}}{\sum_je^{z_j}}=p_k.$$

**(iii) Temperature and the maximum.** Apply (i) to the vector $z/T$. Since $T>0$, the maximum of $z/T$ is $M/T$, and
$$\frac MT<\operatorname{LSE}(z/T)\le\frac MT+\log C.$$
Multiplying by $T>0$ keeps the inequalities, so $M<T\operatorname{LSE}(z/T)\le M+T\log C$. As $T\to0^+$ the right end tends to $M$, so by the squeeze theorem $T\operatorname{LSE}(z/T)\to M$.

**(iv) Temperature and softmax.** Multiply numerator and denominator by $e^{-M/T}$ (shift invariance):
$$\softmax(z/T)_k=\frac{e^{(z_k-M)/T}}{\sum_je^{(z_j-M)/T}}.$$
For $k\in A$ the numerator is $e^0=1$; for $k\notin A$, $z_k-M<0$, so as $T\to0^+$ the exponent goes to $-\infty$ and the numerator to 0. Hence the denominator tends to the positive number $\lvert A\rvert$, and the limit is $\frac1{\lvert A\rvert}$ for $k\in A$ and 0 otherwise. As $T\to\infty$ every $(z_j-M)/T\to0$, so each term of numerator and denominator tends to 1 and the limit is $\frac1C$.`,
    note: R`Differentiating (ii) once more gives $\nabla^2\operatorname{LSE}=\frac{\partial p}{\partial z}=\diag(p)-pp^T\succeq0$ (the proofs of the Jacobian and of convexity), so LSE is convex. In short, LSE is a smooth convex function that approximates $\max$ to within $\log C$, and its gradient, the softmax, is a smoothed version of the gradient of $\max$ (the one-hot argmax). As a loss, $-\log p_c=\operatorname{LSE}(z)-z_c>M-z_c\ge0$, so a loss near 0 requires the correct score $z_c$ to be the maximum and well above the other scores.` },
  'ch06-regunique': { title: 'The flat direction of softmax regression and uniqueness of the regularized solution',
    stmt: R`(i) If all entries of $p\in\mathbb R^C$ are positive and $\sum_kp_k=1$, then for $H=\diag(p)-pp^T$
$$Hv=0\iff v^THv=0\iff v=c\mathbf 1\ \ (c\in\mathbb R).$$

(ii) The softmax regression loss $J(W)=-\sum_i\sum_ky_{ik}\log p_k(x_i,W)$ (the $k$-th row of $W\in\mathbb R^{C\times d}$ is $w_k^T$) satisfies $J(W+\mathbf 1u^T)=J(W)$ for every $u\in\mathbb R^d$, so a minimizer, if one exists, is not unique.

(iii) If $\lambda>0$, then $J_\lambda(W)=J(W)+\frac\lambda2\lVert W\rVert_F^2$ ($\lVert W\rVert_F^2=\sum_k\lVert w_k\rVert^2$) has exactly one minimizer $W^*$, and at it $\sum_kw_k^*=0$.`,
    body: R`
**(i) Null space.** With $\bar v=p^Tv=\sum_jp_jv_j$ we have $(Hv)_k=p_kv_k-p_k\bar v=p_k(v_k-\bar v)$. Since $p_k>0$, $Hv=0$ means $v_k=\bar v$ for all $k$, i.e. all entries are equal. Conversely, if $v=c\mathbf 1$ then $\bar v=c\sum_jp_j=c$, so $Hv=0$. The quadratic form is
$$v^THv=\sum_kp_kv_k(v_k-\bar v)=\sum_kp_k(v_k-\bar v)^2$$
(the second equality subtracts $\sum_kp_k\bar v(v_k-\bar v)=\bar v(\bar v-\bar v)=0$). Every term is nonnegative and $p_k>0$, so $v^THv=0$ is again the condition that all $v_k=\bar v$.

**(ii) Invariance in one direction.** The $k$-th row of $W+\mathbf 1u^T$ is $w_k+u$, so every score of sample $x_i$ moves by the same amount, $z_k\to z_k+u^Tx_i$. By shift invariance of the softmax all $p_k(x_i,\cdot)$ stay the same and $J(W+\mathbf 1u^T)=J(W)$. If $W^*$ is a minimizer, then $W^*+\mathbf 1u^T$ with $u\ne0$ is another minimizer with the same value. In score space this move is $z\to z+(u^Tx_i)\mathbf 1$, exactly the null space direction of (i).

**(iii-1) Existence.** Since $p_k\in(0,1)$, $-\log p_k>0$, so $J\ge0$ and $J_\lambda(W)\ge\frac\lambda2\lVert W\rVert_F^2$. At $W=0$ all probabilities are $\frac1C$, so $c_0=J_\lambda(0)=N\log C$. Where $\lVert W\rVert_F>\sqrt{2c_0/\lambda}$ we have $J_\lambda>c_0$, and on the closed ball $\lVert W\rVert_F\le\sqrt{2c_0/\lambda}$ the continuous function $J_\lambda$ attains a minimum (extreme value theorem), which is therefore the global minimum.

**(iii-2) Uniqueness.** $J$ is convex (convexity of softmax cross entropy), and expanding entrywise, the Frobenius norm satisfies the midpoint identity $\lVert\frac{U+V}2\rVert_F^2=\frac{\lVert U\rVert_F^2+\lVert V\rVert_F^2}2-\frac{\lVert U-V\rVert_F^2}4$. Hence $J_\lambda(\frac{U+V}2)\le\frac{J_\lambda(U)+J_\lambda(V)}2-\frac\lambda8\lVert U-V\rVert_F^2$, and two distinct minimizers would give a midpoint below the minimum, a contradiction.

**(iii-3) The rows sum to zero.** At the minimizer $W^*$ put $s=\sum_kw_k^*=W^{*T}\mathbf 1$ and consider $\varphi(u)=J_\lambda(W^*+\mathbf 1u^T)$. By (ii) the $J$ part does not change, and
$$\begin{aligned}\lVert W^*+\mathbf 1u^T\rVert_F^2&=\sum_k\lVert w_k^*+u\rVert^2\\&=\lVert W^*\rVert_F^2+2u^Ts+C\lVert u\rVert^2\end{aligned}$$
so $\varphi(u)-\varphi(0)=\lambda u^Ts+\frac{\lambda C}2\lVert u\rVert^2$. Since $W^*$ is a minimizer, this is nonnegative for every $u$. Taking $u=-ts$ ($t>0$) gives $\lambda\lVert s\rVert^2\big(-t+\frac C2t^2\big)\ge0$, and for $0<t<\frac2C$ the bracket is negative, so $\lVert s\rVert^2=0$, i.e. $\sum_kw_k^*=0$.`,
    note: R`(i) says the loss of one sample is flat in score space in **exactly one direction**, $\mathbf 1$ (“exactly one flat direction” in Section 6.4); (ii) says this direction appears in weight space as $W\to W+\mathbf 1u^T$. Regularization picks, out of this ambiguity, the one representative whose class weights sum to zero. Fixing the weights of one class to zero (Section 6.4) removes the same ambiguity with a different representative.` },
  'ch07-hyperplane': { title: 'The normal vector and the two sides of a hyperplane',
    stmt: R`Let $w\in\mathbb R^n$, $w\ne0$, $f(x)=x^Tw+b$, $H=\{x:f(x)=0\}$, and $u=w/\lVert w\rVert$.

(i) For two points $x,x'$ of $H$, $w^T(x-x')=0$ ($w$ is normal to $H$). Every point of $H$ has the same projection length $x^Tu=-b/\lVert w\rVert$ onto $u$, the point of $H$ nearest the origin is $x_0=-\frac b{\lVert w\rVert^2}w$, and its distance is $\frac{\lvert b\rvert}{\lVert w\rVert}$.

(ii) Every $x\in\mathbb R^n$ can be written uniquely as $x=x_H+t\,u$ ($x_H\in H$, $t\in\mathbb R$), and $t=\frac{f(x)}{\lVert w\rVert}$. Hence points with $f(x)>0$ lie on the side of $H$ that $w$ points to, and points with $f(x)<0$ on the opposite side.

(iii) If $y_i\in\{1,-1\}$ and $f(x_i)\ne0$, then $\sign(f(x_i))=y_i\iff y_if(x_i)>0$. So “$y_if(x_i)\ge0$ for all $i$” is the condition that no point lies on the wrong side (points on the boundary allowed).`,
    body: R`
**(i) Normal and distance to the origin.** If $x,x'\in H$, subtracting $w^Tx+b=0=w^Tx'+b$ gives $w^T(x-x')=0$, so $w$ is perpendicular to every direction $x-x'$ within $H$. Also $x^Tw=-b$ for $x\in H$, so $x^Tu=-b/\lVert w\rVert$ is constant. The point $x_0=-\frac b{\lVert w\rVert^2}w$ lies on $H$ because $f(x_0)=-\frac b{\lVert w\rVert^2}w^Tw+b=0$, and $\lVert x_0\rVert=\frac{\lvert b\rvert}{\lVert w\rVert}$. For any $x\in H$, $x_0^T(x-x_0)=-\frac b{\lVert w\rVert^2}w^T(x-x_0)=0$ (both points are on $H$), so by Pythagoras
$$\lVert x\rVert^2=\lVert x_0\rVert^2+\lVert x-x_0\rVert^2\ge\lVert x_0\rVert^2.$$

**(ii) Existence of the split.** Put $t=\frac{f(x)}{\lVert w\rVert}$ and $x_H=x-tu$. Since $w^Tu=\lVert w\rVert$,
$$f(x_H)=f(x)-t\,w^Tu=f(x)-f(x)=0,$$
so $x_H\in H$ and $x=x_H+tu$.

**(ii) Uniqueness of the split.** Conversely, if $x=x_H+tu$ with $x_H\in H$, applying $f$ gives $f(x)=\big(w^Tx_H+b\big)+t\,w^Tu=0+t\lVert w\rVert$. So $t=\frac{f(x)}{\lVert w\rVert}$ is determined, and so is $x_H=x-tu$.

**(ii) The two sides.** $t$ is the signed length from the point $x_H$ on $H$ to $x$, measured along the unit normal $u$. Since $\lVert w\rVert>0$, $t>0\iff f(x)>0$, so the points with $f(x)>0$ gather on the side of $H$ in the direction of $w$, and those with $f(x)<0$ on the other side. $\lvert t\rvert=\frac{\lvert f(x)\rvert}{\lVert w\rVert}$ is the distance between the point and the hyperplane (Section 7.2).

**(iii) Classification condition.** If $y_i\in\{1,-1\}$ and $f(x_i)\ne0$, then $y_if(x_i)>0$ says that $y_i$ and $f(x_i)$ have the same sign, which is exactly $\sign(f(x_i))=y_i$. A correct point gives a positive product and a wrong one a negative product, so if $y_if(x_i)\ge0$ for all $i$, no point is on the wrong side ($y_if(x_i)<0$).`,
    note: R`For a point on the boundary ($f(x_i)=0$) the sign is not determined, so it is neither clearly right nor wrong. The hard margin SVM constraint $y_i(w^Tx_i+b)\ge1$ excludes such points and, by $\lvert t\rvert=\lvert f(x_i)\rvert/\lVert w\rVert\ge1/\lVert w\rVert$ from (ii), keeps every point at least $1/\lVert w\rVert$ from the boundary. The decision boundary $w^Tx=0$ of logistic regression and its probability contours (Section 5.2) are hyperplanes with the same normal $w$.` },
  'ch07-softmargin': { title: 'Soft margin SVM is hinge loss + L2 regularization, and its dual constraint is 0 ≤ α ≤ C',
    stmt: R`For $y_i\in\{1,-1\}$ and $C>0$, the soft margin SVM
$$\min_{w,b,\xi}\ \tfrac12\lVert w\rVert^2+C\sum_{i=1}^N\xi_i$$
$$\text{s.t. }y_i(w^Tx_i+b)\ge1-\xi_i,\ \ \xi_i\ge0$$
satisfies the following.

(i) For fixed $(w,b)$ the only optimal slack is $\xi_i=\max\big(0,1-y_i(w^Tx_i+b)\big)$. Hence the problem is equivalent to hinge loss + $L_2$ regularization,
$$\begin{aligned}\min_{w,b}\ &\tfrac12\lVert w\rVert^2\\&+C\sum_i\max\big(0,1-y_i(w^Tx_i+b)\big)\end{aligned}$$
in the sense that the minimum values and the optimal $(w,b)$ coincide.

(ii) Its Lagrange dual is the hard margin dual with $\alpha_i\ge0$ replaced by $0\le\alpha_i\le C$.
$$\max_\alpha\ \sum_i\alpha_i-\tfrac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$$
$$\text{s.t. }0\le\alpha_i\le C,\ \ \sum_i\alpha_iy_i=0$$`,
    body: R`
**1. Eliminating the slacks.** With $m_i=y_i(w^Tx_i+b)$, the constraints on $\xi_i$ are $\xi_i\ge1-m_i$ and $\xi_i\ge0$, together $\xi_i\ge\max(0,1-m_i)$. For fixed $(w,b)$ the only part of the objective that depends on $\xi$ is $C\sum_i\xi_i$, which strictly increases in each $\xi_i$ because $C>0$; so the minimum is attained only by lowering each $\xi_i$ to its bound, $\xi_i=\max(0,1-m_i)$.

**2. The hinge form.** Splitting the minimization in two stages ($\min_{w,b,\xi}=\min_{w,b}\min_\xi$), step 1 gives
$$\begin{aligned}\min_{w,b,\xi}(\cdots)=\min_{w,b}\Big[&\tfrac12\lVert w\rVert^2\\&+C\sum_i\max(0,1-m_i)\Big].\end{aligned}$$
If $(w^*,b^*,\xi^*)$ is optimal for the original problem, then by step 1 $\xi^*$ is the hinge value at $(w^*,b^*)$ and $(w^*,b^*)$ is optimal on the right. Conversely, an optimal solution on the right with the $\xi$ of step 1 attached is optimal for the original problem.

**3. The Lagrangian.** Write the constraints as $1-\xi_i-m_i\le0$ and $-\xi_i\le0$ and attach multipliers $\alpha_i\ge0$, $\mu_i\ge0$:
$$\begin{aligned}L=&\ \tfrac12\lVert w\rVert^2+C\sum_i\xi_i-\sum_i\mu_i\xi_i\\&+\sum_i\alpha_i\big(1-\xi_i-y_i(w^Tx_i+b)\big).\end{aligned}$$
Collecting the terms with $\xi_i$ gives $(C-\alpha_i-\mu_i)\xi_i$, and the rest is the hard margin Lagrangian $L_p(w,b,\alpha)$, so
$$L=L_p(w,b,\alpha)+\sum_i(C-\alpha_i-\mu_i)\xi_i.$$

**4. Minimizing over the slacks.** $L$ is linear in $\xi_i\in\mathbb R$, so if the coefficient $C-\alpha_i-\mu_i\ne0$, letting $\xi_i\to\pm\infty$ gives $\inf L=-\infty$. Hence for the dual function to be finite we need $\mu_i=C-\alpha_i$ for all $i$, and then the $\xi$ terms vanish and $\inf_{w,b,\xi}L=\inf_{w,b}L_p(w,b,\alpha)$.

**5. The dual problem.** Exactly as in the hard margin case (derivation of the SVM dual), $\inf_{w,b}L_p$ equals $\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$ if $\sum_i\alpha_iy_i=0$ and $-\infty$ otherwise. The remaining conditions are $\alpha_i\ge0$ and $\mu_i=C-\alpha_i\ge0$, i.e. $0\le\alpha_i\le C$. Since $\mu$ is determined by $\alpha$, eliminating it gives the dual problem above.`,
    note: R`Dividing the objective of step 2 by $CN$ gives $\frac1N\sum_i\max(0,1-y_if(x_i))+\frac1{2CN}\lVert w\rVert^2$, so a larger $C$ means weaker regularization ($\lambda=\frac1{CN}$). Placed next to the logistic regression loss with labels $\pm1$, $\log(1+e^{-y_if(x_i)})$, the two methods share one template, “a loss of the margin $y_if(x_i)$ + $L_2$ regularization”, and differ only in the shape of the loss.` },
  'ch07-kkt': { title: 'The KKT conditions are sufficient for SVM optimality',
    stmt: R`For the hard margin SVM, suppose $(w^*,b^*)$ and $\alpha^*\in\mathbb R^N$ satisfy the following four (KKT) conditions.
- Stationarity: $w^*=\sum_i\alpha_i^*y_ix_i$, $\sum_i\alpha_i^*y_i=0$
- Primal feasibility: $y_i(w^{*T}x_i+b^*)\ge1$
- Dual feasibility: $\alpha_i^*\ge0$
- Complementary slackness: $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$

Then $(w^*,b^*)$ is optimal for the primal problem, $\alpha^*$ is optimal for the dual problem, and both optimal values equal $\frac12\lVert w^*\rVert^2$. Moreover every optimal solution of the primal has the same $w^*$.`,
    body: R`
Write $g_i(w,b)=1-y_i(w^Tx_i+b)$ and $L_p(w,b,\alpha)=\frac12\lVert w\rVert^2+\sum_i\alpha_ig_i(w,b)$.

**1. Minimizer of the Lagrangian.** Fix $\alpha^*$ and expand:
$$\begin{aligned}L_p(w,b,\alpha^*)=&\ \tfrac12\lVert w\rVert^2-w^T\textstyle\sum_i\alpha_i^*y_ix_i\\&-b\textstyle\sum_i\alpha_i^*y_i+\sum_i\alpha_i^*.\end{aligned}$$
By stationarity the second term is $-w^Tw^*$ and the third is 0, so completing the square,
$$\begin{aligned}L_p(w,b,\alpha^*)=&\ \tfrac12\lVert w-w^*\rVert^2\\&-\tfrac12\lVert w^*\rVert^2+\textstyle\sum_i\alpha_i^*.\end{aligned}$$
Hence $L_p(w,b,\alpha^*)\ge L_p(w^*,b^*,\alpha^*)$ for all $(w,b)$, with equality only when $w=w^*$ (whatever $b$ is).

**2. Its minimum value.** By complementary slackness $\sum_i\alpha_i^*g_i(w^*,b^*)=0$, so $L_p(w^*,b^*,\alpha^*)=\frac12\lVert w^*\rVert^2$.

**3. Primal optimality.** At any feasible $(w,b)$, i.e. with all $g_i(w,b)\le0$, we have $\sum_i\alpha_i^*g_i(w,b)\le0$ because $\alpha_i^*\ge0$, and so
$$\begin{aligned}\tfrac12\lVert w\rVert^2&\ge L_p(w,b,\alpha^*)\\&\ge L_p(w^*,b^*,\alpha^*)=\tfrac12\lVert w^*\rVert^2\end{aligned}$$
(the second line is steps 1 and 2). $(w^*,b^*)$ itself is feasible by primal feasibility, so it is optimal and the optimal value is $\frac12\lVert w^*\rVert^2$. At another optimal $(w,b)$ the whole chain must be equalities, so the equality case of step 1 gives $w=w^*$.

**4. Dual optimality.** By steps 1 and 2 the dual function $D(\alpha)=\inf_{w,b}L_p(w,b,\alpha)$ has $D(\alpha^*)=\frac12\lVert w^*\rVert^2$. For any $\alpha\ge0$, the definition of the infimum and $g_i(w^*,b^*)\le0$ give
$$\begin{aligned}D(\alpha)&\le L_p(w^*,b^*,\alpha)\\&=\tfrac12\lVert w^*\rVert^2+\textstyle\sum_i\alpha_ig_i(w^*,b^*)\le\tfrac12\lVert w^*\rVert^2.\end{aligned}$$
So $\alpha^*$ is optimal for the dual and the two optimal values agree.`,
    note: R`For the data of Problem Set 1, Problem 3, $w^*=(\frac12,\frac12)$, $b^*=-1$, $\alpha^*=(\frac14,\frac14)$ satisfy all four conditions (both constraints hold with equality), so this theorem alone confirms optimality. Adding $x_3=(4,1)$, $y_3=+1$ to the data, the conditions still hold with $\alpha_3^*=0$ ($y_3(w^{*T}x_3+b^*)=\frac32\ge1$). The theorem is a tool to certify a candidate without proving strong duality separately. The converse (if an optimum exists, some $\alpha^*$ satisfying KKT exists) is a deeper theorem that needs Slater's condition.` },
  'ch07-twopoint': { title: 'Solution of the two-point hard margin SVM (Problem Set 1, Problem 3)',
    stmt: R`For $x_1=(0,0)$, $y_1=-1$; $x_2=(2,2)$, $y_2=+1$, the hard margin SVM
$$\min_{w,b}\ \tfrac12\lVert w\rVert^2$$
$$\text{s.t. }y_i(w^Tx_i+b)\ge1\ \ (i=1,2)$$
has the unique solution $w^*=(\frac12,\frac12)$, $b^*=-1$, with minimum value $\frac14$. The dual solution is $\alpha_1^*=\alpha_2^*=\frac14$, the dual value $g^*=\frac14$ equals the primal value, and $w^*=\sum_i\alpha_i^*y_ix_i$. The separating hyperplane is (in coordinates) $x_1+x_2=2$ and the margin is $\frac1{\lVert w^*\rVert}=\sqrt2$.`,
    body: R`
**1. The constraints written out.** $y_1(w^Tx_1+b)=-b$ and $y_2(w^Tx_2+b)=2w_1+2w_2+b$, so the constraints are
$$-b\ge1,\qquad 2w_1+2w_2+b\ge1.$$

**2. A lower bound for the primal.** Adding the two constraints gives $2(w_1+w_2)\ge2$, i.e. $w_1+w_2\ge1$. On the other hand, expanding $(w_1-w_2)^2\ge0$ and rearranging gives $2(w_1^2+w_2^2)\ge(w_1+w_2)^2$, so
$$\tfrac12\lVert w\rVert^2\ge\tfrac14(w_1+w_2)^2\ge\tfrac14.$$
The objective is at least $\frac14$ at every feasible $(w,b)$.

**3. Equality and uniqueness.** For $\frac12\lVert w\rVert^2=\frac14$ both inequalities must be equalities, so $w_1=w_2$ and $w_1+w_2=1$, i.e. $w=(\frac12,\frac12)$. Then the second constraint reads $2+b\ge1$, i.e. $b\ge-1$, while the first says $b\le-1$, so $b=-1$. Conversely $(w^*,b^*)=((\frac12,\frac12),-1)$ satisfies both constraints with equality ($-b^*=1$, $1+1-1=1$). So it is the unique optimal solution and the minimum is $\frac14$.

**4. The dual function.** For $\alpha_1,\alpha_2\ge0$ the Lagrangian is
$$\begin{aligned}L=&\ \tfrac12\lVert w\rVert^2+\alpha_1(1+b)\\&+\alpha_2(1-2w_1-2w_2-b).\end{aligned}$$
The coefficient of $b$ is $\alpha_1-\alpha_2$, so if $\alpha_1\ne\alpha_2$, letting $b\to\pm\infty$ gives $\inf_{w,b}L=-\infty$. If $\alpha_1=\alpha_2$ the $b$ term vanishes, and with $\mathbf 1=(1,1)$ the part in $w$ is the perfect square $\frac12\lVert w\rVert^2-2\alpha_2(w_1+w_2)=\frac12\lVert w-2\alpha_2\mathbf 1\rVert^2-4\alpha_2^2$, minimized at $w=2\alpha_2\mathbf 1$ with value $-4\alpha_2^2$. Therefore
$$g(\alpha)=\alpha_1+\alpha_2-4\alpha_2^2\qquad(\alpha_1=\alpha_2).$$

**5. Solving the dual.** With $\alpha_1=\alpha_2=\alpha\ge0$, $g=2\alpha-4\alpha^2=\frac14-4(\alpha-\frac14)^2$, so the maximum is $g^*=\frac14$ at $\alpha=\frac14$. Then $w=2\alpha_2^*\mathbf 1=(\frac12,\frac12)=w^*$, which equals $\sum_i\alpha_i^*y_ix_i=\frac14(-1)(0,0)+\frac14(+1)(2,2)$.

**6. Strong duality and complementary slackness.** The dual value $g^*=\frac14$ equals the primal minimum of step 3 (weak duality $g^*\le\frac14$ holds with equality). Both multipliers are positive and both constraints are equalities, so complementary slackness $\alpha_i^*\big(1-y_i(w^{*T}x_i+b^*)\big)=0$ holds as well, and both points are support vectors. $b^*$ also follows from the support vector $x_2$: $b^*=y_2-w^{*T}x_2=1-2=-1$.

**7. Hyperplane and margin.** $w^{*T}x+b^*=\frac12x_1+\frac12x_2-1=0\iff x_1+x_2=2$ (here $x_1,x_2$ are coordinates). $\lVert w^*\rVert=\frac1{\sqrt2}$, and by the distance formula both data points are at distance $\frac{\lvert-1\rvert}{\lVert w^*\rVert}=\frac{\lvert1\rvert}{\lVert w^*\rVert}=\sqrt2$, so the margin is $\sqrt2$ and the width between the margin boundaries $x_1+x_2=0$ and $x_1+x_2=4$ is $2\sqrt2$.`,
    note: R`In general, for two distinct points $x_-$ ($y=-1$) and $x_+$ ($y=+1$), the same argument (subtracting the constraints gives $w^T(x_+-x_-)\ge2$, then the Cauchy–Schwarz inequality) yields $w^*=\frac{2d}{\lVert d\rVert^2}$ ($d=x_+-x_-$), $b^*=-\frac12w^{*T}(x_++x_-)$, margin $\frac{\lVert d\rVert}2$, and the separating hyperplane is the perpendicular bisector of the two points. Bounding the primal directly from below, as in step 2, proves optimality and uniqueness without duality theory, so it serves as a check that complements the order of the quiz solution (dual, then recovery).` },
  'ch08-embedding': { title: 'Concentric data: not separable in the input space, separable by one plane after lifting',
    stmt: R`Let $0<r_1<r_2$, with positive data $D_+\subset\{x\in\mathbb R^2:\lVert x\rVert\le r_1\}$ and negative data $D_-\subset\{x:\lVert x\rVert\ge r_2\}$. “$f$ separates the two sets” means $f>0$ at every point of one class and $f<0$ at every point of the other.

(i) If some convex combination of points of $D_+$ equals some convex combination of points of $D_-$ (the two convex hulls meet), then no affine function $f(x)=w^Tx+b$ separates the data. Example: the origin $\in D_+$ and $(\pm r_2,0),(0,\pm r_2)\in D_-$.

(ii) In the space reached by the feature map $\varphi(x)=(x_1,x_2,x_1^2+x_2^2)$, the linear classifier $h\mapsto v^Th+c$ with $v=(0,0,-1)$, $c=\frac{r_1^2+r_2^2}2$ separates the data.

(iii) The decision boundary of this classifier in the input space, $\{x:v^T\varphi(x)+c=0\}$, is the circle $\lVert x\rVert^2=\frac{r_1^2+r_2^2}2$.`,
    body: R`
**(i) Convex combinations preserve the sign of an affine function.** Suppose one point $x^\circ=\sum_j\lambda_jp_j=\sum_k\mu_kq_k$ ($p_j\in D_+$, $q_k\in D_-$, $\lambda_j,\mu_k\ge0$, $\sum_j\lambda_j=\sum_k\mu_k=1$) exists. Since $\sum_j\lambda_j=1$ we may write $b=\sum_j\lambda_jb$, and
$$\begin{aligned}f(x^\circ)&=w^T\sum_j\lambda_jp_j+\sum_j\lambda_jb\\&=\sum_j\lambda_jf(p_j).\end{aligned}$$
The same computation gives $f(x^\circ)=\sum_k\mu_kf(q_k)$. If $f$ were positive on $D_+$ and negative on $D_-$, then, the weights being nonnegative with sum 1 (so at least one is positive), the first formula would give $f(x^\circ)>0$ and the second $f(x^\circ)<0$, a contradiction. The case of opposite signs is the same. In the example, the origin itself is a convex combination of $D_+$, and $0=\frac14\big[(r_2,0)+(-r_2,0)+(0,r_2)+(0,-r_2)\big]$ is a convex combination of $D_-$.

**(ii) A plane in the lifted space.** For $h=\varphi(x)$, $v^Th+c=-\lVert x\rVert^2+\frac{r_1^2+r_2^2}2$. If $x\in D_+$ then $\lVert x\rVert^2\le r_1^2$, so
$$v^T\varphi(x)+c\ge\frac{r_2^2-r_1^2}2>0,$$
and if $x\in D_-$ then $\lVert x\rVert^2\ge r_2^2$, so $v^T\varphi(x)+c\le-\frac{r_2^2-r_1^2}2<0$. The plane $h_3=\frac{r_1^2+r_2^2}2$ in three-dimensional space separates the classes, and since $v$ is a unit vector both classes are at distance at least $\frac{r_2^2-r_1^2}2$ from it.

**(iii) Back to the input space.** $v^T\varphi(x)+c=0\iff\lVert x\rVert^2=\frac{r_1^2+r_2^2}2$, a circle of radius $\sqrt{(r_1^2+r_2^2)/2}$ (between $r_1$ and $r_2$). The output layer is **linear** in $h$, but $\varphi$ is nonlinear, so the decision boundary in the input space is a curve.`,
    note: R`In a neural network the place of $\varphi$ is taken by the hidden layer $h=\sigma(W_1x+b_1)$, the only difference being that this map is learned from data. XOR is the same story. The two diagonals have the same midpoint $(\frac12,\frac12)$, so by (i) XOR cannot be separated in the input space; but in the hidden coordinates $(h_1,h_2)=(\max(0,s),\max(0,s-1))$, $s=x_1+x_2$, we get $(0,0)\mapsto(0,0)$, $(0,1),(1,0)\mapsto(1,0)$, $(1,1)\mapsto(2,1)$, and $h_1-2h_2$ equals 1 on the positives and 0 on the negatives, so the line $h_1-2h_2=\frac12$ separates the classes (Section 8.4).` },
  'ch08-relu1d': { title: 'ReLU networks with one hidden layer and universal approximation in one dimension',
    stmt: R`Let $a<b$.

(i) If $a=t_0<t_1<\cdots<t_m<t_{m+1}=b$ and $g:[a,b]\to\mathbb R$ is continuous and affine with slope $s_k$ on each $[t_k,t_{k+1}]$, then on $[a,b]$
$$\begin{aligned}g(x)=&\ g(a)+s_0\ReLU(x-a)\\&+\sum_{k=1}^m(s_k-s_{k-1})\ReLU(x-t_k).\end{aligned}$$
That is, $g$ is represented exactly by a two-layer ReLU network $W_2\max(0,W_1x+b_1)+b_2$ with $m+1$ hidden units.

(ii) (Universal approximation in one dimension) If $g:[a,b]\to\mathbb R$ is continuous, then for every $\varepsilon>0$ there is a ReLU network $F$ with one hidden layer such that $\max_{x\in[a,b]}\lvert F(x)-g(x)\rvert\le\varepsilon$.`,
    body: R`
**1. The slope on each piece.** Call the right side of (i) $F(x)$. For $x\in[t_j,t_{j+1}]$ ($0\le j\le m$) we have $x-a\ge0$, so $\ReLU(x-a)=x-a$; for $k\le j$, $x-t_k\ge0$, so $\ReLU(x-t_k)=x-t_k$; for $k>j$, $x-t_k\le0$, so $\ReLU(x-t_k)=0$. Hence on this interval
$$\begin{aligned}F(x)=&\ g(a)+s_0(x-a)\\&+\sum_{k=1}^j(s_k-s_{k-1})(x-t_k)\end{aligned}$$
is affine, with slope given by the telescoping sum $s_0+\sum_{k=1}^j(s_k-s_{k-1})=s_j$.

**2. The same function.** $F$ is continuous (a linear combination of ReLUs) and $F(a)=g(a)$. If $F(t_j)=g(t_j)$, then on $[t_j,t_{j+1}]$ both $F$ and $g$ are affine functions through the same point $(t_j,g(t_j))$ with the same slope $s_j$, so they agree on the whole interval, and in particular $F(t_{j+1})=g(t_{j+1})$. Applying this for $j=0,1,\dots,m$ in turn gives $F=g$ on all of $[a,b]$. As a network: hidden units $h_k=\ReLU(x-t_k)$ with all entries of $W_1$ equal to 1 and biases $-t_k$ ($t_0=a$), output weights $s_0,\ s_1-s_0,\dots,s_m-s_{m-1}$, and output bias $g(a)$.

**3. Uniform continuity.** Now let $g$ be merely continuous. A continuous function on a closed bounded interval is uniformly continuous, so for $\varepsilon>0$ there is $\delta>0$ with $\lvert g(x)-g(x')\rvert\le\varepsilon$ whenever $\lvert x-x'\rvert\le\delta$. Choose a natural number $n$ with $(b-a)/n\le\delta$ and the equally spaced points $\tau_k=a+k\frac{b-a}n$ ($k=0,\dots,n$).

**4. Polyline interpolation.** Let $L$ be the polyline joining the points $(\tau_k,g(\tau_k))$ in order. If $x\in[\tau_k,\tau_{k+1}]$, then $x=(1-\theta)\tau_k+\theta\tau_{k+1}$ for some $\theta\in[0,1]$ and $L(x)=(1-\theta)g(\tau_k)+\theta g(\tau_{k+1})$. Writing $g(x)=(1-\theta)g(x)+\theta g(x)$ and using the triangle inequality,
$$\begin{aligned}\lvert L(x)-g(x)\rvert\le&\ (1-\theta)\lvert g(\tau_k)-g(x)\rvert\\&+\theta\lvert g(\tau_{k+1})-g(x)\rvert\le\varepsilon\end{aligned}$$
The last inequality comes from $\lvert\tau_k-x\rvert,\ \lvert\tau_{k+1}-x\rvert\le\delta$ and step 3.

**5. Conclusion.** $L$ is continuous and affine on each $[\tau_k,\tau_{k+1}]$, so by steps 1 and 2 it is exactly a ReLU network $F=L$ with $n$ hidden units, and $\max_{[a,b]}\lvert F-g\rvert\le\varepsilon$.`,
    note: R`The general universal approximation theorem (several dimensions, any non-polynomial activation) needs much deeper analysis, but for one-dimensional ReLU networks the computation above, “one corner = one unit”, is all there is. Conversely, a single hidden unit $v_j\ReLU(a_jx+c_j)$ has at most one corner ($x=-c_j/a_j$ when $a_j\ne0$), so a one-hidden-layer network with $m$ units has at most $m+1$ affine pieces. The sawtooth of Section 8.5 composed $k$ times has $2^k$ pieces on $[0,1]$, so one hidden layer needs at least $2^k-1$ units, whereas $k$ layers need only 2 units each (the benefit of depth).` },
  });
})();
