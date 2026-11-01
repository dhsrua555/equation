/* English text — proofs for Unit 19: the recurrent networks of W9 Wed slides 1–17 and the notes after slide 9
   (two-step RNN gradients, many-step backpropagation, the BPTT recursion, vanishing/exploding conditions, clipping, truncated BPTT). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  'ch19-twostep': { title: 'Gradients of a Two-Step RNN',
    stmt: R`If $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$ ($t=1,2$), $L=\sum_{t=1}^2\frac12(Y_t-Z_t)^2$, then $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$, and
$$\frac{\partial L}{\partial W}=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.$$
$\partial L/\partial U$ and $\partial L/\partial b$ replace the last factor $h_{s-1}$ of each term by $X_s$ and $1$.`,
    body: R`
**Forward pass and paths.** $a_t=Wh_{t-1}+UX_t+b$, $h_t=\tanh a_t$, $Y_t=Vh_t+c$. $V$ and $c$ enter only $Y_t$, so there is one path per $L_t$. $W$, $U$, $b$ enter both $a_1$ and $a_2$, and $h_1$ enters $a_2$ again, so there is one path to $L_1$ ($a_1\to h_1\to L_1$) and two to $L_2$ ($a_2\to h_2\to L_2$, $a_1\to h_1\to h_2\to L_2$).

**Local derivatives.** Since $\tanh'(a)=\sech^2a=1-\tanh^2a$, $\frac{\partial h_t}{\partial a_t}=1-h_t^2$. With $h_{t-1}$ fixed, $\frac{\partial a_t}{\partial W}=h_{t-1}$, $\frac{\partial a_t}{\partial U}=X_t$, $\frac{\partial a_t}{\partial b}=1$, and the derivative across time is $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)\frac{\partial a_2}{\partial h_1}=(1-h_2^2)W$. On the output side, $\frac{\partial L_t}{\partial Y_t}=Y_t-Z_t$ and $\frac{\partial Y_t}{\partial h_t}=V$, so $\frac{\partial L_t}{\partial h_t}=(Y_t-Z_t)V$.

**V and c.** $\frac{\partial Y_t}{\partial V}=h_t$ and $\frac{\partial Y_t}{\partial c}=1$, so $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t$ and $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.

**W.** Adding the products along the three paths,
$$\frac{\partial L}{\partial W}=\frac{\partial L_1}{\partial h_1}\frac{\partial h_1}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial h_1}\frac{\partial h_1}{\partial W},$$
and inserting the local derivatives gives the three terms of the statement. The $\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1$ of the second term is the direct derivative with $h_1$ fixed, and the third term is the indirect path through $h_1$.

**U and b.** The paths are the same, and only the last factor changes, to $\frac{\partial h_s}{\partial U}=(1-h_s^2)X_s$ and $\frac{\partial h_s}{\partial b}=1-h_s^2$. That is, $X_s$ and $1$ take the place of $h_{s-1}$ in each term of $\partial L/\partial W$.

**Bundling with δ.** With $\delta_2=(Y_2-Z_2)V(1-h_2^2)$ and $\delta_1=[(Y_1-Z_1)V+\delta_2W](1-h_1^2)$, $\delta_1h_0$ gives the first and third terms and $\delta_2h_1$ the second, so $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$; in the same way $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$ and $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.`,
    note: R`The $(1-h_0^2)$ in the third term of the notes is a slip for $(1-h_2^2)$. With $h_0=0$ the first and third terms of $\partial L/\partial W$ vanish, but all three terms of $\partial L/\partial U$ and $\partial L/\partial b$ remain.` },
  'ch19-bptt': { title: 'The Recursion of Backpropagation Through Time',
    stmt: R`For $h_t=\tanh(Wh_{t-1}+Ux_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^T\frac12\lVert Y_t-Z_t\rVert^2$, the column vectors $\mathbf g_t=\partial L/\partial h_t$ and $\boldsymbol\delta_t=\partial L/\partial a_t$ satisfy
$$\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1},\qquad\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t,\qquad\boldsymbol\delta_{T+1}=\mathbf 0,$$
and $\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T$, $\frac{\partial L}{\partial U}=\sum_t\boldsymbol\delta_tx_t^T$, $\frac{\partial L}{\partial b}=\sum_t\boldsymbol\delta_t$, $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t^T$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.`,
    body: R`
**The two influences of $h_t$.** $h_t$ reaches (1) $L_t$ through $Y_t$ and (2) every loss from $h_{t+1}$ on through $a_{t+1}=Wh_t+Ux_{t+1}+b$, and there is no other way. The chain rule for column-vector gradients multiplies by transposed Jacobians, so
$$\mathbf g_t=\Big(\frac{\partial Y_t}{\partial h_t}\Big)^T\frac{\partial L_t}{\partial Y_t}+\Big(\frac{\partial a_{t+1}}{\partial h_t}\Big)^T\frac{\partial L}{\partial a_{t+1}}=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1}.$$

**Down to $a_t$.** $h_t=\tanh(a_t)$ acts elementwise, so $\frac{\partial h_t}{\partial a_t}=\diag(1-h_t^2)$, and $a_t$ reaches the loss only through $h_t$, so $\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t$. Nothing comes after the last step $T$, so setting $\boldsymbol\delta_{T+1}=\mathbf 0$ makes the same formula hold at $t=T$. Computing in the order $t=T,T-1,\dots,1$, the needed $\boldsymbol\delta_{t+1}$ is always ready first.

**Shared parameters.** The copy $W^{(t)}$ of $W$ used at step $t$ enters only $a_t$, and $a_{t,i}=\sum_jW^{(t)}_{ij}h_{t-1,j}+\cdots$, so $\frac{\partial L}{\partial W^{(t)}_{ij}}=\delta_{t,i}h_{t-1,j}$, that is, $\boldsymbol\delta_th_{t-1}^T$. The gradient of the shared $W$ is the sum of the gradients of its copies, so $\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T$. In the same way $U$ and $b$ give $\sum_t\boldsymbol\delta_tx_t^T$ and $\sum_t\boldsymbol\delta_t$.

**V and c.** $V$ and $c$ enter only $Y_t$, so $\frac{\partial L}{\partial V}=\sum_t\frac{\partial L_t}{\partial Y_t}h_t^T=\sum_t(Y_t-Z_t)h_t^T$ and $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.`,
    note: R`For $T=2$ in the scalar case, $\delta_2=(1-h_2^2)V(Y_2-Z_2)$, $\delta_1=(1-h_1^2)[V(Y_1-Z_1)+W\delta_2]$, and $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$ gives exactly the three terms of the notes.` },
  'ch19-multicell': { title: 'The Backpropagation Formula for a Many-Step RNN',
    stmt: R`If $h_0=0$, $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$ ($\ell=1,\dots,L$), and $f_\theta(X)=Ah_L+b$, then (gradients are row vectors)
$$\frac{\partial\mathcal L}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell),\qquad\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell},\qquad\frac{\partial\mathcal L}{\partial h_L}=\frac{\partial\mathcal L}{\partial f}A.$$`,
    body: R`
**Outer layer.** $f_\theta(X)=Ah_L+b$ and $\mathcal L$ depends on $\theta$ only through $f$, so $\frac{\partial\mathcal L}{\partial\theta}=\frac{\partial\mathcal L}{\partial f}\frac{\partial f}{\partial\theta}$. $\frac{\partial f}{\partial b}=1$, $\frac{\partial f}{\partial A}=h_L$ ($h_L^T$ in the shape of $A$), $\frac{\partial f}{\partial h_L}=A$, and $\tilde\theta$ enters only through $h_L$, so $\frac{\partial f}{\partial\tilde\theta}=A\frac{dh_L}{d\tilde\theta}$.

**Unrolling (induction).** We show $\frac{dh_L}{d\tilde\theta}=\sum_{\ell=1}^L\frac{\partial h_L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$ ($\frac{\partial h_L}{\partial h_L}=I$) by induction on $L$. For $L=1$, $h_0=0$ does not depend on $\tilde\theta$, so $\frac{dh_1}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_0,u_1)$. If it holds for $L-1$, then in $h_L=q_{\tilde\theta}(h_{L-1},u_L)$ the parameter $\tilde\theta$ enters directly and through $h_{L-1}$, so
$$\frac{dh_L}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_{L-1},u_L)+\frac{\partial h_L}{\partial h_{L-1}}\frac{dh_{L-1}}{d\tilde\theta},$$
and substituting the induction hypothesis and using $\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_\ell}=\frac{\partial h_L}{\partial h_\ell}$ gives the terms $\ell=1,\dots,L-1$, while the first term is the term $\ell=L$.

**Putting it together.** The two results give $\frac{\partial\mathcal L}{\partial\tilde\theta}=\frac{\partial\mathcal L}{\partial f}A\sum_\ell\frac{\partial h_L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$. $h_\ell$ reaches the loss only by passing through $h_{\ell+1},\dots,h_L$ in turn, so by the chain rule $\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial f}A\frac{\partial h_L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$, and substituting it gives the formula of the statement.

**Recursion.** If $q(h,u)=\phi(Wh+Uu+c)$, then $\frac{\partial h_{\ell+1}}{\partial h_\ell}=\diag(\phi'(a_{\ell+1}))W$, so $\delta_\ell=\frac{\partial\mathcal L}{\partial h_\ell}$ is computed backward in one pass by $\delta_L=\frac{\partial\mathcal L}{\partial f}A$, $\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))W$.`,
    note: R`Slides 11–12 are missing from the uploaded slides, so the unrolling computation (the inductive step) is filled in by this proof. The $\frac{\partial h_\ell}{\partial\tilde\theta}$ of slide 13 must be read as the direct derivative $\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$, or paths would be counted twice.` },
  'ch19-jacprod': { title: 'A Bound on Products of Jacobians and the Conditions for Vanishing and Exploding Gradients',
    stmt: R`If $h_{k+1}=\phi(Wh_k+Uu_{k+1}+c)$ and $\gamma=\sup_z\lvert\phi'(z)\rvert$, then $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2\le\gamma\lVert W\rVert_2$ and $\big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\big\rVert\le(\gamma\lVert W\rVert_2)^{L-\ell}\big\lVert\frac{\partial\mathcal L}{\partial h_L}\big\rVert$. Hence $\gamma\lVert W\rVert_2<1$ is a sufficient condition for vanishing gradients, and $\gamma\lVert W\rVert_2>1$ is a necessary condition for exploding gradients.`,
    body: R`
**The one-step Jacobian.** $a_{k+1}=Wh_k+Uu_{k+1}+c$ and $\phi$ acts elementwise, so $\frac{\partial h_{k+1}}{\partial h_k}=\diag(\phi'(a_{k+1}))\,W$.

**The norm of a diagonal matrix.** For $D=\diag(d_1,\dots,d_n)$, $\lVert Dx\rVert^2=\sum_id_i^2x_i^2\le\max_id_i^2\lVert x\rVert^2$, with equality on the coordinate axis of the largest $\lvert d_i\rvert$, so $\lVert D\rVert_2=\max_i\lvert d_i\rvert$. Here $\lvert\phi'(a_{k+1,i})\rvert\le\gamma$, so $\lVert\diag(\phi'(a_{k+1}))\rVert_2\le\gamma$.

**Submultiplicativity.** The operator norm satisfies $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$, so $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2\le\gamma\lVert W\rVert_2$. Applying this $L-\ell$ times to the row vector $\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$ (with $\lVert xM\rVert\le\lVert x\rVert\lVert M\rVert_2$) gives
$$\Big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\Big\rVert\le\big(\gamma\lVert W\rVert_2\big)^{L-\ell}\Big\lVert\frac{\partial\mathcal L}{\partial h_L}\Big\rVert.$$

**The two conditions.** If $\gamma\lVert W\rVert_2=\rho<1$, the right-hand side is $\rho^{L-\ell}\to0$ ($L-\ell\to\infty$), so vanishing cannot be avoided (a sufficient condition). Taking the contrapositive, for the gradient of distant steps to grow we need $\rho>1$ (a necessary condition). It is not sufficient: even with $\rho>1$, saturated activations give $\phi'(a)\approx0$ and can make the product small.

**A scalar example.** In $h_{k+1}=\tanh(wh_k+\cdots)$ with small activations so that $\tanh'\approx1$, the product is $\approx w^{L-\ell}$: it vanishes for $\lvert w\rvert<1$ and explodes for $\lvert w\rvert>1$ ($0.9^{100}\approx2.7\times10^{-5}$, $1.1^{100}\approx1.4\times10^4$).`,
    note: R`These are the conditions stated by Pascanu, Mikolov, Bengio (2013): if the largest singular value of $W$ is below $1/\gamma$, vanishing is certain, and for explosion it must exceed $1/\gamma$.` },
  'ch19-clip': { title: 'Properties of Gradient Clipping',
    stmt: R`For $\mathbf g\ne\mathbf 0$ and $v>0$, $\mathrm{clip}(\mathbf g)=\min\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)\mathbf g$ equals $\mathbf g$ if $\lVert\mathbf g\rVert\le v$ and $\frac{v}{\lVert\mathbf g\rVert}\mathbf g$ otherwise; it has the same direction as $\mathbf g$ and $\lVert\mathrm{clip}(\mathbf g)\rVert=\min(\lVert\mathbf g\rVert,v)$.`,
    body: R`
**Cases.** $\lVert\mathbf g\rVert\le v\iff\frac{v}{\lVert\mathbf g\rVert}\ge1$, so then $\min=1$ and $\mathrm{clip}(\mathbf g)=\mathbf g$. Otherwise $\frac{v}{\lVert\mathbf g\rVert}<1$ is the minimum and $\mathrm{clip}(\mathbf g)=\frac{v}{\lVert\mathbf g\rVert}\mathbf g$.

**Direction and size.** $s=\min\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)>0$, so $\mathrm{clip}(\mathbf g)=s\mathbf g$ is a positive multiple of $\mathbf g$, and $\lVert s\mathbf g\rVert=\min(\lVert\mathbf g\rVert,v)$.

**Written with max.** $\max\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)\mathbf g$ **grows** to size exactly $v$ when $\lVert\mathbf g\rVert\le v$, and otherwise stays $\mathbf g$, so it fails to shrink large gradients. What matches the cases on slide 15 is the $\min$.`,
    note: R`The clipped step $\eta\,\mathrm{clip}(\mathbf g)$ has size at most $\eta v$, so clipping is the same as lowering the learning rate to $\eta\frac{v}{\lVert\mathbf g\rVert}$ for that step only.` },
  'ch19-truncated': { title: 'The Terms Truncated BPTT Drops',
    stmt: R`Treating the first state $h_{t_0}$ of a chunk as a constant and backpropagating the chunk's loss $\sum_{t>t_0}L_t$ keeps, in the path expansion $\sum_t\sum_{s\le t}(\cdots)$, only the terms with $s>t_0$, that is, the terms of paths that do not pass through $h_{t_0}$.`,
    body: R`
**Path expansion.** As in the general formula of 19.4, $\frac{\partial L_t}{\partial W}=\sum_{s=1}^t\frac{\partial L_t}{\partial h_t}\frac{\partial h_t}{\partial h_s}\frac{\partial h_s}{\partial W}\Big|_{\text{direct}}$, and the $s$-th term is the path along which $W$ is used in $a_s$ and then passes $h_s\to\cdots\to h_t$.

**Holding it constant.** Treating $h_{t_0}$ as a constant sets $\frac{dh_{t_0}}{dW}=0$, so every path with $s\le t_0$ (where $W$ was used before reaching $h_{t_0}$) becomes 0 and only the terms with $s>t_0$ remain. The losses $L_t$ outside the chunk ($t\le t_0$) are not handled in this chunk.`,
    note: R`The dropped terms are distant paths in which $\frac{\partial h_t}{\partial h_s}$ multiplies $t-s\ge t-t_0$ Jacobians, so because of the vanishing of 19.6 they are usually small. That is why the truncated gradient, though biased, works well in practice; the price is that dependencies longer than a chunk cannot be learned through the gradient.` },
  });
})();
