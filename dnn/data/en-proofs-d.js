/* English text — proofs, Part D: 13 the descent lemma and convergence of gradient descent (W4 Wed notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  'ch13-steepest': { title: 'The Steepest Descent Direction Is Opposite to the Gradient',
    stmt: R`If $\nabla f(x)\ne0$, then $\min_{\lVert v\rVert=1}\langle\nabla f(x),v\rangle=-\lVert\nabla f(x)\rVert$, and the minimum is attained only at $v=-\nabla f(x)/\lVert\nabla f(x)\rVert$.`,
    body: R`
By the Cauchy–Schwarz inequality $\lvert\langle a,v\rangle\rvert\le\lVert a\rVert\lVert v\rVert$, if $\lVert v\rVert=1$ then
$$\langle\nabla f(x),v\rangle\ge-\lVert\nabla f(x)\rVert.$$
Substituting $v^*=-\nabla f(x)/\lVert\nabla f(x)\rVert$ gives $\langle\nabla f(x),v^*\rangle=-\lVert\nabla f(x)\rVert^2/\lVert\nabla f(x)\rVert=-\lVert\nabla f(x)\rVert$, so the lower bound is attained.
**Uniqueness.** Equality in Cauchy–Schwarz holds only when $v$ is a scalar multiple of $\nabla f(x)$, and for a unit vector with negative inner product, $v=v^*$.

**Connection with GD.** The direction that decreases the first-order approximation $f(x+\eta v)\approx f(x)+\eta\langle\nabla f(x),v\rangle$ the most is $v^*$, so $x_{t+1}=x_t-\eta\frac{\nabla f(x_t)}{\lVert\nabla f(x_t)\rVert}$, and absorbing $\eta'=\eta/\lVert\nabla f(x_t)\rVert$ gives $x_{t+1}=x_t-\eta'\nabla f(x_t)$.`,
    note: R`This argument is an intuition for “small steps where the first-order approximation is good”. How small the step must be for an actual decrease is answered quantitatively by the descent lemma ($\eta<2/\beta$).` },
  'ch13-lipschitzhess': { title: 'A Lipschitz Gradient and Bounds on the Hessian (③)',
    stmt: R`For $f\in C^2(\mathbb R^d)$, the following are equivalent.
(a) $\lVert\nabla f(x)-\nabla f(y)\rVert\le\beta\lVert x-y\rVert$ ($\forall x,y$)
(b) $\lVert\nabla^2f(x)\rVert_2\le\beta$ ($\forall x$), i.e., $-\beta I\preceq\nabla^2f(x)\preceq\beta I$.
In particular, (a) implies $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ ($\forall x,v$).`,
    body: R`
**(a)⇒(b).** Fix $x,v$. Since $\nabla f$ is differentiable, by the directional derivative
$$\nabla^2f(x)v=\lim_{s\to0}\frac{\nabla f(x+sv)-\nabla f(x)}s.$$
By (a), $\Big\lVert\frac{\nabla f(x+sv)-\nabla f(x)}s\Big\rVert\le\frac{\beta\lvert s\rvert\lVert v\rVert}{\lvert s\rvert}=\beta\lVert v\rVert$, and the norm is continuous, so $\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert$. Since this holds for every $v$, the operator norm $\lVert\nabla^2f(x)\rVert_2\le\beta$. For a symmetric matrix this means that all eigenvalues lie in $[-\beta,\beta]$, and by Cauchy–Schwarz
$$\lvert v^T\nabla^2f(x)v\rvert\le\lVert v\rVert\,\lVert\nabla^2f(x)v\rVert\le\beta\lVert v\rVert^2.$$

**(b)⇒(a).** Applying the fundamental theorem of calculus to the vector-valued function $t\mapsto\nabla f(y+t(x-y))$,
$$\nabla f(x)-\nabla f(y)=\int_0^1\nabla^2f\big(y+t(x-y)\big)(x-y)\,dt,$$
$$\lVert\nabla f(x)-\nabla f(y)\rVert\le\int_0^1\lVert\nabla^2f(\cdot)\rVert_2\lVert x-y\rVert\,dt\le\beta\lVert x-y\rVert.$$`,
    note: R`Notes: “note: $\forall v$, $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2\iff\nabla^2f(x)\preceq\beta I$. We want $v^T\nabla^2f(x)v\le\beta\lVert v\rVert^2$ — Next class.” The descent lemma needs only the upper bound $\nabla^2f\preceq\beta I$. The lower bound $-\beta I$ gives $f(y)\ge f(x)+\langle\nabla f(x),y-x\rangle-\frac\beta2\lVert y-x\rVert^2$.` },
  'ch13-gchain': { title: 'The Derivatives of the Auxiliary Function g(t) (①)',
    stmt: R`If $f\in C^2$, $p=y-x$, $z(t)=x+tp$, and $g(t)=f(z(t))$, then $g'(t)=p^T\nabla f(z(t))$ and $g''(t)=p^T\nabla^2f(z(t))\,p$.`,
    body: R`
$z'(t)=p$ (an $n\times1$ column vector). In the multivariable chain rule $g'(t)=Df(z(t))\,z'(t)$, $Df(z)=\nabla f(z)^T$ is a $1\times n$ row vector, so
$$g'(t)=\nabla f(z(t))^Tp=p^T\nabla f(z(t))\qquad(1\times n\ \text{times}\ n\times1=1\times1).$$
$p$ is constant, so $g''(t)=p^T\frac{d}{dt}\nabla f(z(t))$. The derivative (Jacobian) of the map $\nabla f:\mathbb R^n\to\mathbb R^n$ is the Hessian $D(\nabla f)(z)=\nabla^2f(z)$, so by the chain rule again
$$\frac d{dt}\nabla f(z(t))=\nabla^2f(z(t))\,z'(t)=\nabla^2f(z(t))\,p\qquad(n\times n\ \text{times}\ n\times1),$$
$$g''(t)=p^T\nabla^2f(z(t))\,p=(y-x)^T\nabla^2f\big(x+t(y-x)\big)(y-x).$$` },
  'ch13-taylorint': { title: 'Taylor’s Formula with Integral Remainder (②)',
    stmt: R`If $g\in C^2[0,1]$, then $g(1)=g(0)+g'(0)+\displaystyle\int_0^1(1-s)g''(s)\,ds$.`,
    body: R`
By the fundamental theorem of calculus, $g(1)=g(0)+\int_0^1g'(s)\,ds$. In integration by parts $\int_0^1u\,dv=[uv]_0^1-\int_0^1v\,du$, set $u=g'(s)$, $dv=ds$, and choose $v$ as $s-1=-(1-s)$ (choosing the constant of integration this way is the trick):
$$\int_0^1g'(s)\,ds=\Big[-(1-s)g'(s)\Big]_0^1+\int_0^1(1-s)g''(s)\,ds=\big(0+g'(0)\big)+\int_0^1(1-s)g''(s)\,ds.$$
Substituting gives the result.

**The way of the notes.** Setting $u=1-s$, $v'=g''(s)$ gives $\int_0^1(1-s)g''(s)ds=\big[(1-s)g'(s)\big]_0^1+\int_0^1g'(s)ds=-g'(0)+g(1)-g(0)$, which rearranges to the same formula.`,
    note: R`The general form is $g(1)=\sum_{k=0}^{n}\frac{g^{(k)}(0)}{k!}+\int_0^1\frac{(1-s)^n}{n!}g^{(n+1)}(s)ds$. The descent lemma uses the case $n=1$.` },
  'ch13-descent': { title: 'The Descent Lemma (Lemma 3.1)',
    stmt: R`If $f:\mathbb R^d\to\mathbb R$ is continuously differentiable and $\nabla f$ is $\beta$-Lipschitz, then for all $x,y$
$$f(y)\le f(x)+\langle\nabla f(x),y-x\rangle+\frac\beta2\lVert y-x\rVert^2.$$`,
    body: R`
**Proof 1 (notes, $f\in C^2$).** $g(t)=f(x+t(y-x))$.
① $g'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$, $g''(t)=(y-x)^T\nabla^2f(x+t(y-x))(y-x)$.
② $g(1)=g(0)+g'(0)+\int_0^1(1-s)g''(s)ds$. Here $g(0)=f(x)$, $g(1)=f(y)$, and $g'(0)=\langle\nabla f(x),y-x\rangle$, so
$$f(y)=f(x)+\langle\nabla f(x),y-x\rangle+\int_0^1(1-s)(y-x)^T\nabla^2f(x+s(y-x))(y-x)\,ds.\qquad(*)$$
③ By $\beta$-smoothness, $v^T\nabla^2fv\le\beta\lVert v\rVert^2$ for every $v$. Since $1-s\ge0$,
$$\int_0^1(1-s)(y-x)^T\nabla^2f(\cdot)(y-x)\,ds\le\beta\lVert y-x\rVert^2\int_0^1(1-s)\,ds=\frac\beta2\lVert y-x\rVert^2.$$
Putting this into $(*)$ gives the result.

**Proof 2 (assuming only $f\in C^1$).** $h(t)=f(x+t(y-x))$ is $C^1$ with $h'(t)=\langle\nabla f(x+t(y-x)),y-x\rangle$. By the fundamental theorem of calculus,
$$f(y)-f(x)-\langle\nabla f(x),y-x\rangle=\int_0^1\big\langle\nabla f(x+t(y-x))-\nabla f(x),\,y-x\big\rangle dt.$$
By Cauchy–Schwarz and the Lipschitz condition $\lVert\nabla f(x+t(y-x))-\nabla f(x)\rVert\le\beta t\lVert y-x\rVert$, the integrand is $\le\beta t\lVert y-x\rVert^2$, so the right side is $\le\beta\lVert y-x\rVert^2\int_0^1t\,dt=\frac\beta2\lVert y-x\rVert^2$.`,
    note: R`The theorem on the slide is stated under the $C^1$ assumption, and the proof in the class notes assumes $C^2$ (the “$C^2$” in the margin of the notes). Proof 2 gives the same conclusion without the Hessian. Geometrically it means “the graph of $f$ lies below a parabola of curvature $\beta$ at every point”.` },
  'ch13-gdstep': { title: 'The Decrease Inequality for One Step of Gradient Descent',
    stmt: R`If $f$ is $\beta$-smooth and $x_{t+1}=x_t-\eta\nabla f(x_t)$, then $f(x_{t+1})\le f(x_t)-\big(\eta-\frac{\beta\eta^2}2\big)\lVert\nabla f(x_t)\rVert^2$. Hence if $0<\eta<2/\beta$, $f(x_{t+1})\le f(x_t)$.`,
    body: R`
Put $x=x_t$, $y=x_{t+1}$ into the descent lemma and use $x_{t+1}-x_t=-\eta\nabla f(x_t)$.
$$\begin{aligned}f(x_{t+1})&\le f(x_t)+\langle\nabla f(x_t),-\eta\nabla f(x_t)\rangle+\frac\beta2\lVert-\eta\nabla f(x_t)\rVert^2\\&=f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac{\beta\eta^2}2\lVert\nabla f(x_t)\rVert^2=f(x_t)-\Big(\eta-\frac{\beta\eta^2}2\Big)\lVert\nabla f(x_t)\rVert^2.\end{aligned}$$
$\eta-\frac{\beta\eta^2}2=\eta\big(1-\frac{\beta\eta}2\big)>0\iff0<\eta<\frac2\beta$. Then the second term on the right is $\le0$, so $f(x_{t+1})\le f(x_t)$, a strict decrease if $\nabla f(x_t)\ne0$.

**The optimal step.** $\phi(\eta)=\eta-\frac\beta2\eta^2$ is maximized at $\eta=1/\beta$ with value $\frac1{2\beta}$, so $f(x_{t+1})\le f(x_t)-\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2$.` },
  'ch13-gdrate': { title: 'The Convergence Rate of GD on Nonconvex Smooth Functions',
    stmt: R`If $f$ is $\beta$-smooth and bounded below ($f\ge f^*$) and $\eta=1/\beta$, then $\min_{0\le t<T}\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
    body: R`
Summing the one-step decrease inequality $\frac1{2\beta}\lVert\nabla f(x_t)\rVert^2\le f(x_t)-f(x_{t+1})$ over $t=0,\dots,T-1$, the right side telescopes:
$$\frac1{2\beta}\sum_{t=0}^{T-1}\lVert\nabla f(x_t)\rVert^2\le f(x_0)-f(x_T)\le f(x_0)-f^*.$$
The minimum is at most the average, so $\min_t\lVert\nabla f(x_t)\rVert^2\le\frac1T\sum_t\lVert\nabla f(x_t)\rVert^2\le\frac{2\beta(f(x_0)-f^*)}T$.`,
    note: R`Without convexity, we only get as far as approaching a stationary point (zero gradient). It may be a saddle point or a local minimum. If $f$ is convex, there is the stronger result $f(x_T)-f^*\le\frac{\beta\lVert x_0-x^*\rVert^2}{2T}$.` },
  'ch13-sgdlemma': { title: 'The Stochastic Gradient Descent Lemma',
    stmt: R`If $f$ is $L$-smooth, $x_{t+1}=x_t-\eta\tilde\nabla f(x_t)$, and $\E_t[\tilde\nabla f(x_t)]=\nabla f(x_t)$ ($\E_t[\cdot]=\E[\cdot\mid x_t]$), then
$$\E_t[f(x_{t+1})]\le f(x_t)-\eta\lVert\nabla f(x_t)\rVert^2+\frac L2\eta^2\E_t\big[\lVert\tilde\nabla f(x_t)\rVert^2\big].$$`,
    body: R`
Applying the descent lemma to $x=x_t$, $y=x_{t+1}$ (an inequality that holds with probability 1),
$$f(x_{t+1})\le f(x_t)-\eta\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle+\frac L2\eta^2\lVert\tilde\nabla f(x_t)\rVert^2.$$
Take $\E_t$ of both sides. Given $x_t$, $f(x_t)$ and $\nabla f(x_t)$ are constants, so
$$\E_t\langle\nabla f(x_t),\tilde\nabla f(x_t)\rangle=\langle\nabla f(x_t),\E_t\tilde\nabla f(x_t)\rangle=\lVert\nabla f(x_t)\rVert^2.$$
Leaving the remaining terms as they are gives the result.`,
    note: R`Since $\E_t\lVert\tilde\nabla f\rVert^2=\lVert\nabla f\rVert^2+\E_t\lVert\tilde\nabla f-\nabla f\rVert^2$ (second moment = square of the mean + variance), the result can be written as $\E_tf(x_{t+1})\le f(x_t)-\eta\big(1-\frac{L\eta}2\big)\lVert\nabla f\rVert^2+\frac{L\eta^2}2\Var_t(\tilde\nabla f)$. With zero variance it is the same as the GD decrease inequality, and with large variance the $\eta$ that guarantees a decrease becomes smaller.` },
  'ch13-sgdsum': { title: 'The Summed Inequality of SGD and the Learning Rate',
    stmt: R`Adding $\E_t\lVert\tilde\nabla f(x_t)\rVert^2\le G$ ($\forall t$) to the assumptions above,
$$\sum_{t=0}^{T-1}\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT,$$
and in particular, with $\eta=\sqrt{\frac{2(f(x_0)-f^*)}{LGT}}$, $\frac1T\sum_t\E\lVert\nabla f(x_t)\rVert^2\le\sqrt{\frac{2LG(f(x_0)-f^*)}T}$.`,
    body: R`
From the lemma and the bound $G$, $\eta\lVert\nabla f(x_t)\rVert^2\le f(x_t)-\E_tf(x_{t+1})+\frac L2\eta^2G$, i.e. (slide 10),
$$\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\E_t\big[f(x_t)-f(x_{t+1})\big]+\frac L2\eta G.$$
Taking the full expectation (tower property $\E[\E_t[\cdot]]=\E[\cdot]$), $\E\lVert\nabla f(x_t)\rVert^2\le\frac1\eta\big(\E f(x_t)-\E f(x_{t+1})\big)+\frac L2\eta G$. Summing over $t=0,\dots,T-1$ telescopes:
$$\sum_t\E\lVert\nabla f(x_t)\rVert^2\le\frac{f(x_0)-\E f(x_T)}\eta+\frac L2\eta GT\le\frac{f(x_0)-f^*}\eta+\frac L2\eta GT.$$
The right side divided by $T$, $\frac{\Delta}{\eta T}+\frac{LG}2\eta$ ($\Delta=f(x_0)-f^*$), is minimized by AM–GM at $\eta=\sqrt{2\Delta/(LGT)}$, with minimum $2\sqrt{\frac{\Delta LG}{2T}}=\sqrt{\frac{2LG\Delta}T}$.`,
    note: R`With $\eta$ fixed, $\frac L2\eta G$ remains even as $T\to\infty$ (the noise floor). The slide writes the summed inequality with $\sum_t\E_t[\cdot]$, but to form the telescoping sum a tower-property step is needed to put every term under the same (full) expectation.` },
  });
})();
