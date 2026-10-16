/* English text — proofs not in the lecture notes, Part J (Units 14–16):
   Newton's method and diagonal preconditioning, the sqrt(kappa) rate of optimal momentum, the size of an Adam step,
   cross-correlation and flipping, backpropagation through convolution and pooling, multiplication counts and AlexNet,
   dropout expectations, deeper networks and the identity map. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 14
  'ch14-newton': { title: 'Newton’s Method and Diagonal Preconditioning',
    stmt: R`Let $f(x)=\frac12x^THx-b^Tx$ ($H$ symmetric, $H\succ0$) and $x^*=H^{-1}b$. (i) $x^*$ is the unique minimizer of $f$, and from any point $x$ one Newton step $x-H^{-1}\nabla f(x)$ equals $x^*$. (ii) Gradient descent preconditioned by a diagonal matrix $D$ with positive diagonal entries, $x_{t+1}=x_t-\alpha D^{-1}\nabla f(x_t)$, satisfies $e_{t+1}=(I-\alpha\tilde H)e_t$ for $e_t=D^{1/2}(x_t-x^*)$, where $\tilde H=D^{-1/2}HD^{-1/2}\succ0$. Hence the convergence condition and the optimal shrink factor are set by the eigenvalues of $\tilde H$ instead of $H$: convergence from every starting point $\iff0<\alpha<2/\tilde\lambda_{\max}$, and with the optimal fixed $\alpha$ the shrink factor is $\frac{\tilde\kappa-1}{\tilde\kappa+1}$ ($\tilde\kappa=\tilde\lambda_{\max}/\tilde\lambda_{\min}$). (iii) If $H$ is diagonal and $D=H$, then $\tilde H=I$ ($\tilde\kappa=1$), and $\alpha=1$ reaches $x^*$ in one step.`,
    body: R`
**1. The minimizer.** By the vector derivative formulas $\nabla f(x)=Hx-b$, and since $b=Hx^*$, $\nabla f(x)=H(x-x^*)$. As $H$ is symmetric, $x^THx^*=x^Tb=b^Tx$, so
$$\begin{aligned}&\tfrac12(x-x^*)^TH(x-x^*)\\&=\tfrac12x^THx-x^THx^*+\tfrac12x^{*T}Hx^*\\&=f(x)+\tfrac12x^{*T}Hx^*.\end{aligned}$$
Putting $x=x^*$ gives $f(x^*)=-\frac12x^{*T}Hx^*$, hence $f(x)-f(x^*)=\frac12(x-x^*)^TH(x-x^*)$, which is positive for $x\ne x^*$ because $H\succ0$. So $x^*$ is the unique minimizer.

**2. One Newton step.** From any $x$, $x-H^{-1}\nabla f(x)=x-H^{-1}H(x-x^*)=x^*$. In the class example $f=\frac12x_1^2+\frac{100}2x_2^2$ ($H=\diag(1,100)$, $b=0$), $H^{-1}\nabla f=(x_1,\ x_2)$, so one step goes straight to the origin.

**3. Changing coordinates.** Let $D=\diag(d_1,\dots,d_n)$ ($d_i>0$) and $D^{1/2}=\diag(\sqrt{d_1},\dots,\sqrt{d_n})$. Subtracting $x^*$ from the update and using $\nabla f(x_t)=H(x_t-x^*)$,
$$x_{t+1}-x^*=(I-\alpha D^{-1}H)(x_t-x^*).$$
Multiplying on the left by $D^{1/2}$ and substituting $x_t-x^*=D^{-1/2}e_t$, since $D^{1/2}D^{-1}=D^{-1/2}$,
$$e_{t+1}=e_t-\alpha D^{-1/2}HD^{-1/2}e_t=(I-\alpha\tilde H)e_t.$$

**4. The condition number $\tilde\kappa$.** $\tilde H^T=D^{-1/2}H^TD^{-1/2}=\tilde H$ (symmetric), and for $v\ne0$ we have $D^{-1/2}v\ne0$, so $v^T\tilde Hv=(D^{-1/2}v)^TH(D^{-1/2}v)>0$ (positive definite). Therefore $e_t$ is exactly the sequence produced by GD with learning rate $\alpha$ on $\frac12e^T\tilde He$, and the proof on the condition number and gradient descent (a factor $(1-\alpha\tilde\lambda_i)$ along each eigendirection) holds verbatim with $\tilde H$ in place of $H$: $e_t\to0$ from every starting point $\iff0<\alpha<2/\tilde\lambda_{\max}$, and with the optimal fixed $\alpha=\frac2{\tilde\lambda_{\max}+\tilde\lambda_{\min}}$ the shrink factor is $\frac{\tilde\kappa-1}{\tilde\kappa+1}$. Since $D^{-1/2}$ is invertible, $x_t\to x^*\iff e_t\to0$, and $\lVert x_t-x^*\rVert\le\lVert e_t\rVert/\sqrt{\min_id_i}$.

**5. Perfect diagonal preconditioning.** If $H=\diag(h_1,\dots,h_n)$ and $D=H$, diagonal matrices commute, so $\tilde H=H^{-1/2}HH^{-1/2}=I$ and $\tilde\kappa=1$. With $\alpha=1$, $e_1=(I-I)e_0=0$, i.e., $x_1=x^*$, and the update $x-H^{-1}\nabla f(x)$ is exactly the Newton step of 2. In the class example, dividing by $D=\diag(1,100)$ turns the condition number $100$ into $1$.`,
    note: R`If $H$ is not diagonal, diagonal preconditioning cannot remove the whole condition number. For example $H=\begin{pmatrix}1&0.99\\0.99&1\end{pmatrix}$ has eigenvalues $0.01$ and $1.99$ ($\kappa=199$), but $\diag(H)=I$, so dividing by $D=\diag(H)$ changes nothing — a valley running diagonally to the coordinate axes cannot be straightened by per-coordinate learning rates. AdaGrad, RMSProp and Adam (Sections 14.3–14.4) are diagonal preconditioners that build $D$ from statistics of gradient sizes instead of the Hessian. The point of this proof is that for a fixed $D$ the speed is set not by $\kappa$ but by $\tilde\kappa$.` },
  'ch14-hbrate': { title: 'The Convergence Rate of Optimal Momentum: √κ Instead of κ',
    stmt: R`Apply momentum $x_{t+1}=x_t-\alpha\nabla f(x_t)+\rho(x_t-x_{t-1})$ ($x_{-1}=x_0$) to $f(x)=\frac12x^THx$ ($H$ symmetric, eigenvalues $0<\lambda_{\min}\le\lambda_i\le\lambda_{\max}$, $\kappa=\lambda_{\max}/\lambda_{\min}>1$), and choose
$$\alpha=\frac4{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2},\quad\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}.$$
Then each eigendirection component follows $u_{t+1}=(1+\rho-\alpha\lambda_i)u_t-\rho u_{t-1}$, and both roots of its characteristic equation $z^2-(1+\rho-\alpha\lambda_i)z+\rho=0$ have absolute value exactly $\sqrt\rho$ for every $i$. Hence there is a constant $C$ depending only on $x_0$ and $H$ such that
$$\lVert x_t\rVert\le C(1+t)\Big(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\Big)^t.$$`,
    body: R`
**1. Splitting along eigendirections.** $\nabla f(x)=Hx$; diagonalize $H=Q\Lambda Q^T$ ($Q$ orthogonal) and set $u_t=Q^Tx_t$. Multiplying the update on the left by $Q^T$ gives $u_{t+1}=u_t-\alpha\Lambda u_t+\rho(u_t-u_{t-1})$, i.e., componentwise
$$u_{t+1,i}=b_iu_{t,i}-\rho\,u_{t-1,i},\qquad b_i=1+\rho-\alpha\lambda_i$$
with $u_{-1,i}=u_{0,i}$. The components do not mix, so we can look at one at a time, and since $Q$ is orthogonal, $\lVert x_t\rVert=\lVert u_t\rVert$. Below we fix $i$, drop the index and write $u_{t+1}=bu_t-\rho u_{t-1}$.

**2. Solving with characteristic roots.** Let $z_1,z_2$ be the two roots of $z^2-bz+\rho=0$; then $z_1+z_2=b$ and $z_1z_2=\rho$. For a root $z$, the sequence $z^t$ satisfies the recurrence: $z^{t+1}-bz^t+\rho z^{t-1}=z^{t-1}(z^2-bz+\rho)=0$. For a double root $z=\frac b2$ ($b=2z$, $\rho=z^2$), $tz^t$ satisfies it as well:
$$\begin{aligned}&(t+1)z^{t+1}-2z\cdot tz^t+z^2(t-1)z^{t-1}\\&=z^{t+1}\big[(t+1)-2t+(t-1)\big]=0.\end{aligned}$$
Since the recurrence is linear, linear combinations of these are solutions too. So for distinct roots we put $u_t=c_1z_1^t+c_2z_2^t$, for a double root $u_t=(c_1+c_2t)z^t$, and choose $c_1,c_2$ to match $u_0,u_1$ (distinct roots: the determinant of the linear system is $z_2-z_1\ne0$; double root: $c_1=u_0$, $c_2=u_1/z-u_0$, where $z\ne0$ because $z^2=\rho>0$). The recurrence determines $u_2,u_3,\dots$ uniquely from $u_0,u_1$, so this formula is $u_t$ for every $t\ge0$.

**3. The size of the roots.** If $b^2<4\rho$, the two roots are complex conjugates ($z_2=\bar z_1$ because the coefficients are real), so $\lvert z_1\rvert^2=z_1\bar z_1=z_1z_2=\rho$; if $b^2=4\rho$, the double root has size $\lvert z\rvert=\frac{\lvert b\rvert}2=\sqrt\rho$. So if $b^2\le4\rho$, both roots have absolute value $\sqrt\rho$, and the formula of 2 gives
$$\lvert u_t\rvert\le(\lvert c_1\rvert+\lvert c_2\rvert)(1+t)\,\rho^{t/2}.$$
This condition turns into a condition on $\alpha\lambda$.
$$\begin{aligned}b^2\le4\rho&\iff\lvert1+\rho-\alpha\lambda\rvert\le2\sqrt\rho\\&\iff(1-\sqrt\rho)^2\le\alpha\lambda\le(1+\sqrt\rho)^2.\end{aligned}$$

**4. Checking the given $\alpha,\rho$.** With $s=\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ ($0<s<1$) we have $1-s=\frac2{\sqrt\kappa+1}$ and $1+s=\frac{2\sqrt\kappa}{\sqrt\kappa+1}$, and $\sqrt\kappa+1=\frac{\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}}}{\sqrt{\lambda_{\min}}}$, so
$$(1-s)^2=\frac{4\lambda_{\min}}{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2}=\alpha\lambda_{\min},$$
$$(1+s)^2=\frac{4\kappa\lambda_{\min}}{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2}=\alpha\lambda_{\max}.$$
Since $\alpha>0$ and $\lambda_{\min}\le\lambda_i\le\lambda_{\max}$, every $i$ has $(1-s)^2\le\alpha\lambda_i\le(1+s)^2$, i.e., the condition of 3 holds, and both roots in every eigendirection have absolute value $s=\sqrt\rho$.

**5. Conclusion.** Each component has $\lvert u_{t,i}\rvert\le C_i(1+t)s^t$ ($C_i=\lvert c_{1,i}\rvert+\lvert c_{2,i}\rvert$), so $\lVert x_t\rVert=\lVert u_t\rVert\le\sum_i\lvert u_{t,i}\rvert\le C(1+t)s^t$ with $C=\sum_iC_i$. The factor $1+t$ grows more slowly than any exponential, so the error is multiplied by roughly $s=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$ per step: the $\frac{\kappa-1}{\kappa+1}$ of gradient descent with $\kappa$ replaced by $\sqrt\kappa$. For $\kappa=100$, $s=\frac9{11}\approx0.818$ versus $\frac{99}{101}\approx0.980$, and the number of steps $1/\ln(1/s)$ needed to shrink the error by $1/e$ is about $5$ versus $50$.`,
    note: R`The factor $(1+t)$ comes only from the double roots at the two extreme eigenvalues ($\lambda_{\min}$, $\lambda_{\max}$), where 4 holds with equality. The case $\kappa=1$ is excluded because then $\rho=0$ and $\alpha=1/\lambda$, and one GD step finishes. It is also known that no fixed choice is faster than this $(\alpha,\rho)$ (optimality), but that is not proved here. The practical default $\rho=0.9$ differs from this optimum (for $\kappa=100$, $\rho=(9/11)^2\approx0.67$); it is an empirical choice made without knowing the curvature.` },
  'ch14-adamscale': { title: 'The Size of an Adam Step: Scale Invariance and the Signal-to-Noise Ratio',
    stmt: R`For Adam (componentwise operations, $\epsilon=0$, denominators assumed nonzero, $0<\beta_1,\beta_2<1$, $m_{1,0}=m_{2,0}=0$)
$$\begin{aligned}m_{1,t}&=\beta_1m_{1,t-1}+(1-\beta_1)g_t,\\m_{2,t}&=\beta_2m_{2,t-1}+(1-\beta_2)g_t\odot g_t,\end{aligned}$$
with $\hat m_{k,t}=m_{k,t}/(1-\beta_k^t)$ and $x_t=x_{t-1}-\alpha\hat m_{1,t}/\sqrt{\hat m_{2,t}}$, the following hold.
- (i) Replacing the gradients $g_1,\dots,g_t$ by $Cg_1,\dots,Cg_t$ ($C=\diag(c_1,\dots,c_n)$, $c_j>0$) leaves the $t$-th step unchanged. In particular, replacing the loss by $cf$ ($c>0$) leaves the whole trajectory $x_1,x_2,\dots$ from the same starting point unchanged.
- (ii) $\hat m_{1,t}=\sum_{k=1}^ta_kg_k$ and $\hat m_{2,t}=\sum_{k=1}^tb_k\,g_k\odot g_k$, where the weights $a_k=\frac{(1-\beta_1)\beta_1^{t-k}}{1-\beta_1^t}$ and $b_k=\frac{(1-\beta_2)\beta_2^{t-k}}{1-\beta_2^t}$ are positive and each sum to 1 (weighted averages).
- (iii) If $\beta_1=\beta_2$, every coordinate has $\lvert x_{t,j}-x_{t-1,j}\rvert\le\alpha$.
- (iv) If the gradient of one coordinate has $\E g_k=\bar g$ and $\Var g_k=s^2$ for every $k$, then $\E\hat m_{1,t}=\bar g$ and $\E\hat m_{2,t}=\bar g^2+s^2$, and hence $\dfrac{\lvert\E\hat m_{1,t}\rvert}{\sqrt{\E\hat m_{2,t}}}=\dfrac{\lvert\bar g\rvert}{\sqrt{\bar g^2+s^2}}\le1$.`,
    body: R`
**1. Weighted-average form (ii).** Dividing the unrolled formula of Section 14.4 (by induction) $m_{1,t}=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$ by $1-\beta_1^t$ gives $\hat m_{1,t}=\sum_ka_kg_k$. Here $a_k>0$, and by the geometric series $1+\beta_1+\dots+\beta_1^{t-1}=\frac{1-\beta_1^t}{1-\beta_1}$,
$$\sum_{k=1}^ta_k=\frac{1-\beta_1}{1-\beta_1^t}\cdot\frac{1-\beta_1^t}{1-\beta_1}=1.$$
The same computation with $g_k\odot g_k$ and $\beta_2$ handles $\hat m_{2,t}$ and $b_k$. Bias correction is exactly the rescaling of weights whose sum is only $1-\beta^t$ (because of the start at 0) so that they sum to 1.

**2. Scale invariance (i).** If $g_{k,j}\to c_jg_{k,j}$ in coordinate $j$, then by (ii) $\hat m_{1,t,j}\to c_j\hat m_{1,t,j}$ and $\hat m_{2,t,j}\to c_j^2\hat m_{2,t,j}$, and since $c_j>0$, $\sqrt{c_j^2}=c_j$, so
$$\frac{c_j\hat m_{1,t,j}}{\sqrt{c_j^2\hat m_{2,t,j}}}=\frac{\hat m_{1,t,j}}{\sqrt{\hat m_{2,t,j}}}$$
— the step is the same. The case of the loss $cf$ is an induction: the starting points agree, and if $x_0,\dots,x_{t-1}$ agree, the gradients at those points are $cg_1,\dots,cg_t$, so by the computation above $x_t$ agrees as well.

**3. An upper bound on the step (iii).** If $\beta_1=\beta_2$, then $a_k=b_k$. In one coordinate, apply the Cauchy–Schwarz inequality to the two vectors $(\sqrt{a_k})_k$ and $(\sqrt{a_k}\,g_k)_k$:
$$\Big(\sum_ka_kg_k\Big)^2\le\Big(\sum_ka_k\Big)\Big(\sum_ka_kg_k^2\Big)=\sum_ka_kg_k^2,$$
i.e., $\hat m_{1,t}^2\le\hat m_{2,t}$, so the step $\alpha\lvert\hat m_{1,t}\rvert/\sqrt{\hat m_{2,t}}\le\alpha$. Equality holds only when the two vectors are proportional, that is, when all $g_k$ are equal.

**4. Signal-to-noise ratio (iv).** By linearity of expectation and (ii), $\E\hat m_{1,t}=\sum_ka_k\bar g=\bar g$, and since $\E g_k^2=\Var g_k+(\E g_k)^2=s^2+\bar g^2$, $\E\hat m_{2,t}=\sum_kb_k(\bar g^2+s^2)=\bar g^2+s^2$. The ratio $\frac{\lvert\bar g\rvert}{\sqrt{\bar g^2+s^2}}$ is at most 1 because the denominator is at least the numerator; it is 1 without noise ($s=0$) and close to 0 when the noise is much larger than the signal ($s\gg\lvert\bar g\rvert$). That is why $\hat m_1/\sqrt{\hat m_2}$ is read as the “mean ÷ RMS” of the gradient, a signal-to-noise ratio, and why the step size is taken to be roughly at most $\alpha$.`,
    note: R`(iv) is a ratio of expectations, not the expectation of a ratio. With the defaults $\beta_1=0.9\ne\beta_2=0.999$, (iii) does not hold exactly. The same Cauchy–Schwarz argument bounds the step by $\alpha\sqrt{\sum_ka_k^2/b_k}$; this constant is 1 at $t=1$, but for the special sequence in which the gradient grows by a factor $\beta_2/\beta_1\approx1.11$ per step it approaches $\sqrt{\frac{(1-\beta_1)^2}{(1-\beta_2)(1-\beta_1^2/\beta_2)}}\approx7.3$ as $t\to\infty$. So “step ≈ α” is an estimate for ordinary cases. By contrast, the SGD step $\alpha g$ becomes $c$ times larger when the loss is multiplied by $c$ (the same as changing the learning rate), so SGD is sensitive to scale.` },
  // ───── 15
  'ch15-flip': { title: 'Cross-Correlation and Flipped Convolution Have the Same Expressive Power',
    stmt: R`For a $K\times K$ filter $w$ and its flip $\tilde w[i,j]=w[K-1-i,\ K-1-j]$, the deep-learning convolution (cross-correlation) $(w\star F)[x,y]=\sum_{i,j=0}^{K-1}w[i,j]F[x+i,\ y+j]$ and the mathematical convolution $(w*F)[x,y]=\sum_{i,j=0}^{K-1}w[i,j]F[x-i,\ y-j]$ satisfy, for all $F$, $x$, $y$,
$$(w\star F)[x,y]=(\tilde w*F)[x+K-1,\ y+K-1].$$
Flipping is a one-to-one correspondence between filters, so the two layers represent the same set of functions (only the numbering of the output cells is shifted by $K-1$), and if gradient descent with the same learning rate $\eta$ is run on the loss $L(w)$ and on $\tilde L(v)=L(\tilde v)$, then $v_0=\tilde w_0$ implies $v_t=\tilde w_t$ for every $t$.`,
    body: R`
**1. Changing the index.** Put $i'=K-1-i$, $j'=K-1-j$; as $i$ runs over $0,\dots,K-1$ so does $i'$, hence
$$\begin{aligned}&(\tilde w*F)[x+K-1,\ y+K-1]\\&=\sum_{i,j}w[K-1-i,\ K-1-j]\\&\qquad\cdot F[x+K-1-i,\ y+K-1-j]\\&=\sum_{i',j'}w[i',j']\,F[x+i',\ y+j']=(w\star F)[x,y].\end{aligned}$$

**2. The same set of functions.** Flipping twice gives back the original ($\tilde{\tilde w}=w$), so $w\mapsto\tilde w$ is a one-to-one correspondence. The values of the cross-correlation layer $w$ equal those of the convolution layer $\tilde w$ (by 1), and conversely the values of the convolution layer $v$ equal those of the cross-correlation layer $\tilde v$. Only the numbers attached to the output cells differ.

**3. Training corresponds too.** Flipping permutes the $K^2$ entries, so it is a linear map $R$, and doing it twice gives the identity, so $R^T=R^{-1}=R$. By the chain rule the gradient of $\tilde L(v)=L(Rv)$ is $\nabla\tilde L(v)=R^T\nabla L(Rv)=R\nabla L(Rv)$. If $v_t=Rw_t$, then $Rv_t=RRw_t=w_t$, so
$$v_{t+1}=Rw_t-\eta R\nabla L(w_t)=Rw_{t+1}.$$
Starting from $v_0=Rw_0$, induction gives $v_t=Rw_t=\tilde w_t$ for every $t$. The learned filter simply comes out flipped.`,
    note: R`With multichannel filters and biases, flipping only the spatial indices $(i,j)$ gives the same argument. That is why deep-learning libraries use the simpler cross-correlation and merely call it convolution. In backpropagation the flipped filter appears naturally in the gradient with respect to the input (see the proof on backpropagation through a convolution layer).` },
  'ch15-convlinear': { title: 'A Convolution Layer Is a Linear Layer with a Shared Sparse Matrix (Backpropagation Formulas)',
    stmt: R`One channel, stride 1, no padding: let the input be $F\in\mathbb R^{N\times N}$, the filter $w\in\mathbb R^{K\times K}$, the bias $b$, $N'=N-K+1$, and
$$G[x,y]=\sum_{i,j=0}^{K-1}w[i,j]\,F[x+i,\ y+j]+b$$
($0\le x,y\le N'-1$). (i) Flattening $F$ and $G$ into vectors, $G=W_{\text{conv}}F+b\mathbf 1$, where the entry of $W_{\text{conv}}$ in row $(x,y)$ and column $(u,v)$ is $w[u-x,\ v-y]$ if $0\le u-x\le K-1$ and $0\le v-y\le K-1$, and 0 otherwise. Each row has only $K^2$ places that can be nonzero (local connectivity), and every row is filled with the same $K^2$ numbers $w[i,j]$ (weight sharing). (ii) For a loss $L$ and $\delta[x,y]=\partial L/\partial G[x,y]$, $\partial L/\partial b=\sum_{x,y}\delta[x,y]$, and
$$\frac{\partial L}{\partial w[i,j]}=\sum_{x,y}\delta[x,y]\,F[x+i,\ y+j],$$
$$\frac{\partial L}{\partial F[u,v]}=\sum_{i,j}w[i,j]\,\delta[u-i,\ v-j]$$
($\delta$ outside its range is 0), and the last expression is the $(u,v)$ component of $W_{\text{conv}}^T\delta$.`,
    body: R`
**1. Linearity and the matrix.** Fix $(x,y)$ and change variables to $u=x+i$, $v=y+j$; then $G[x,y]=\sum_{u,v}W_{(x,y),(u,v)}F[u,v]+b$, where $W_{(x,y),(u,v)}$ is $w[u-x,\ v-y]$ if $(u,v)$ lies in the $K\times K$ patch starting at $(x,y)$, and 0 outside it. This is the $(x,y)$-th component of a matrix–vector product, so $G=W_{\text{conv}}F+b\mathbf 1$. In a row only the $K^2$ cells of the patch can be nonzero, and an entry depends only on the offset $(u-x,\ v-y)$, so every row holds the same filter values, just shifted. A one-dimensional example ($N=4$, $K=2$):
$$W_{\text{conv}}=\begin{pmatrix}w_0&w_1&0&0\\0&w_0&w_1&0\\0&0&w_0&w_1\end{pmatrix}$$
A fully connected layer of the same size has $N'^2N^2$ entries, all free; here there are only $K^2$ (plus the bias).

**2. The gradient of the filter.** $w[i,j]$ is used in every output $G[x,y]$ (shared), and $\partial G[x,y]/\partial w[i,j]=F[x+i,\ y+j]$. Adding up all paths to $L$ by the multivariable chain rule,
$$\begin{aligned}\frac{\partial L}{\partial w[i,j]}&=\sum_{x,y}\frac{\partial L}{\partial G[x,y]}\frac{\partial G[x,y]}{\partial w[i,j]}\\&=\sum_{x,y}\delta[x,y]\,F[x+i,\ y+j].\end{aligned}$$
This is the rule of the copy gate: the gradient of a variable used in several places is the sum. The right-hand side is a cross-correlation that slides $\delta$ over $F$ like a filter, so it is computed by the same convolution routine. Also $\partial G[x,y]/\partial b=1$, so $\partial L/\partial b=\sum_{x,y}\delta[x,y]$.

**3. The gradient of the input.** $F[u,v]$ enters only the outputs $G[x,y]$ with $0\le u-x\le K-1$, $0\le v-y\le K-1$, with coefficient $w[u-x,\ v-y]=W_{(x,y),(u,v)}$. By the chain rule
$$\begin{aligned}\frac{\partial L}{\partial F[u,v]}&=\sum_{x,y}W_{(x,y),(u,v)}\,\delta[x,y]\\&=(W_{\text{conv}}^T\delta)_{(u,v)},\end{aligned}$$
which is exactly backpropagation through a matrix product, $z=Wx\Rightarrow\partial L/\partial x=W^T\partial L/\partial z$. Changing to $i=u-x$, $j=v-y$ gives $\sum_{i,j}w[i,j]\,\delta[u-i,\ v-j]$ (with $\delta$ set to 0 outside its range), which is the mathematical (flipping) convolution of the zero-padded $\delta$ with $w$.`,
    note: R`With several channels ($C_{\text{in}}\to C_{\text{out}}$) each output channel $c$ has a filter $w_c[i,j,d]$, so $\partial L/\partial w_c[i,j,d]=\sum_{x,y}\delta_c[x,y]F[x+i,\ y+j,\ d]$, and the gradient of the input becomes the sum over output channels $\sum_c\sum_{i,j}w_c[i,j,d]\,\delta_c[u-i,\ v-j]$. With stride $S$, replace $F[x+i]$ by $F[Sx+i]$. These formulas are the precise content of “gradients of a shared variable add up” in the “Going deeper” part of Section 15.3.` },
  'ch15-poolgrad': { title: 'The Size and Backpropagation of a Pooling Layer',
    stmt: R`For a one-channel input $x\in\mathbb R^{N\times N}$ with an $F\times F$ window and stride $S$, the windows are $R_{m,n}=\{(mS+i,\ nS+j):0\le i,j\le F-1\}$ ($0\le m,n\le N'-1$, $N'=\lfloor\frac{N-F}S\rfloor+1$); max pooling is $y_{m,n}=\max_{(p,q)\in R_{m,n}}x_{pq}$ and average pooling is $y_{m,n}=\frac1{F^2}\sum_{(p,q)\in R_{m,n}}x_{pq}$. For the upstream gradient $\delta_{m,n}=\partial L/\partial y_{m,n}$,
$$\text{average}:\ \frac{\partial L}{\partial x_{pq}}=\frac1{F^2}\sum_{(m,n):\,(p,q)\in R_{m,n}}\delta_{m,n},$$
$$\text{max}:\ \frac{\partial L}{\partial x_{pq}}=\sum_{(m,n):\,(p,q)=(p^*_{mn},q^*_{mn})}\delta_{m,n}.$$
For max pooling we assume that each window has a single maximizing cell $(p^*_{mn},q^*_{mn})$. If $S\ge F$ (the windows do not overlap), each sum has at most one term. Pooling acts on each channel separately, so the output is $N'\times N'\times C$, and it has no learnable parameters.`,
    body: R`
**1. Local gradients.** Average pooling is linear in $x$, so $\partial y_{m,n}/\partial x_{pq}$ is $\frac1{F^2}$ if $(p,q)\in R_{m,n}$ and 0 otherwise. In max pooling, if the maximizing cell is unique, its value exceeds the other values of the window by at least some $\gamma>0$. If every entry changes by less than $\gamma/2$, the maximizing cell stays the same, so near this point $y_{m,n}=x_{p^*_{mn}q^*_{mn}}$, and $\partial y_{m,n}/\partial x_{pq}$ is 1 if $(p,q)=(p^*_{mn},q^*_{mn})$ and 0 otherwise (the same as the gradient of a max gate).

**2. The chain rule.** $x_{pq}$ affects the outputs of all windows that contain it, so
$$\frac{\partial L}{\partial x_{pq}}=\sum_{m,n}\delta_{m,n}\frac{\partial y_{m,n}}{\partial x_{pq}}$$
and inserting the local gradients of 1 gives the two formulas of the statement. Max pooling sends the upstream gradient only to the cell that produced the maximum; average pooling spreads $\delta_{m,n}/F^2$ evenly over the $F^2$ cells of the window.

**3. Overlap.** If $(p,q)$ lies in two windows $R_{m,n}$ and $R_{m',n'}$, the first coordinate gives $mS\le p\le mS+F-1$ and $m'S\le p\le m'S+F-1$, so $\lvert m-m'\rvert S\le F-1$, and likewise for the second coordinate. If $S\ge F$, then $\lvert m-m'\rvert\le\frac{F-1}S<1$, so $m=m'$ (and likewise $n=n'$) — the windows do not overlap and each sum has at most one term. If $S<F$, a cell lies in several windows and receives all their gradients. In AlexNet's max pooling ($F=3$, $S=2$) a cell can lie in two windows horizontally and two vertically, up to four windows in all, and if two overlapping windows have their maximum at the same cell, that cell receives the sum of both $\delta$s.

**4. Size and parameters.** Counting the window positions is the same as in the derivation of the convolution output size formula ($K=F$, $P=0$), giving $N'=\lfloor\frac{N-F}S\rfloor+1$ per direction. The output formulas contain only the input $x$ and fixed functions (maximum, mean), so there is nothing to learn, and the output of channel $c$ is computed from the input of channel $c$ alone, so the number of channels $C$ stays the same. Global average pooling is the case where the window is the whole map: $H\times W\times C\to1\times1\times C$.`,
    note: R`If several cells tie for the maximum, max pooling is not differentiable there, and libraries pick one of them to receive the gradient. In Example 1 of Section 15.5 (window $\{5,10,4,0\}$, $\delta=2$), $(0,2,0,0)$ and $(0.5,0.5,0.5,0.5)$ are the case $S=F=2$ (no overlap) of the formulas above.` },
  // ───── 16
  'ch16-flops': { title: 'The Multiplication Count of a Convolution Layer and Where AlexNet’s Parameters and Computation Sit',
    stmt: R`(i) Computing a convolution layer with output $N'\times N'\times C_{\text{out}}$ and filters $K\times K\times C_{\text{in}}$ by its definition takes $N'^2K^2C_{\text{in}}C_{\text{out}}$ multiplications, i.e., (number of weights)$\times N'^2$. A fully connected layer $d_{\text{in}}\to d_{\text{out}}$ takes $d_{\text{in}}d_{\text{out}}$, i.e., (number of weights). (ii) In AlexNet with all channels connected (the architecture on the slides), the five convolution layers have $3{,}747{,}200$ parameters and the three fully connected layers $58{,}631{,}144$, so about $94.0\%$ sit in the fully connected layers; the convolution layers take $1{,}076{,}634{,}144$ multiplications ($\approx1.08\times10^9$) and the fully connected layers $58{,}621{,}952$ ($\approx5.9\times10^7$), so about $94.8\%$ sit in the convolution layers.`,
    body: R`
**1. A convolution layer.** One output cell $G_c[x,y]=\sum_{i,j,d}w_c[i,j,d]F[x+i,\ y+j,\ d]+b_c$ is a sum of $K\cdot K\cdot C_{\text{in}}$ products, and there are $N'^2C_{\text{out}}$ output cells, so there are $N'^2\cdot K^2C_{\text{in}}\cdot C_{\text{out}}$ multiplications. There are $K^2C_{\text{in}}C_{\text{out}}$ weights, so this is (number of weights)$\times N'^2$: each weight $w_c[i,j,d]$ is used once at each of the $N'^2$ positions of map $c$.

**2. A fully connected layer.** Each of the $d_{\text{out}}$ outputs is a $d_{\text{in}}$-dimensional inner product, so there are $d_{\text{in}}d_{\text{out}}$ multiplications, and each weight is used only once.

**3. AlexNet's parameters.** Adding up the table of Section 16.2 (convolution $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$, fully connected $d_{\text{in}}d_{\text{out}}+d_{\text{out}}$) gives

- convolution: $34{,}944+614{,}656+885{,}120+1{,}327{,}488+884{,}992=3{,}747{,}200$
- fully connected: $37{,}752{,}832+16{,}781{,}312+4{,}097{,}000=58{,}631{,}144$

and of the total $62{,}378{,}344$ the fully connected share is $58{,}631{,}144/62{,}378{,}344\approx0.940$.

**4. AlexNet's multiplications.** By the formula $N'^2\cdot K^2C_{\text{in}}\cdot C_{\text{out}}$ of 1,

- Conv1: $55^2\cdot363\cdot96=105{,}415{,}200$
- Conv2: $27^2\cdot2400\cdot256=447{,}897{,}600$
- Conv3: $13^2\cdot2304\cdot384=149{,}520{,}384$
- Conv4: $13^2\cdot3456\cdot384=224{,}280{,}576$
- Conv5: $13^2\cdot3456\cdot256=149{,}520{,}384$

and the sum is $1{,}076{,}634{,}144$. By the formula of 2 the fully connected layers take $9216\cdot4096+4096\cdot4096+4096\cdot1000=58{,}621{,}952$, and the convolution share is $1{,}076{,}634{,}144/1{,}135{,}256{,}096\approx0.948$.

**5. Why the distributions are opposite.** By 1–2, number of multiplications $=$ (number of weights) $\times$ (number of times each weight is reused), and that number is the number of output positions $N'^2$ (from $13^2=169$ up to $55^2=3025$) for a convolution layer and 1 for a fully connected layer. So convolution layers compute a lot with few parameters, and fully connected layers the opposite.`,
    note: R`Additions and biases are not counted (each multiplication comes with about one addition, so the ratios are the same). If, as in the original paper, the network is split over two GPUs so that Conv2, Conv4 and Conv5 see only half of their input channels, the weights and multiplications of those layers halve, but the conclusion is the same. By the same count, the weights of the inception module of Section 16.5 are used at $28^2=784$ positions, so the naive module takes $784\times1{,}089{,}536\approx8.5\times10^8$ multiplications and the bottleneck module $784\times346{,}112\approx2.7\times10^8$.` },
  'ch16-dropout': { title: 'Dropout Matches Expectations',
    stmt: R`Apply independent Bernoulli masks $m_i\in\{0,1\}$ with keep probability $p\in(0,1]$ ($P(m_i=1)=p$) to the output $h\in\mathbb R^d$ of a layer (fixed for a given input).
- (i) If training uses $\tilde h=m\odot h$, then $\E[\tilde h]=p\,h$, so using $p\,h$ at test time matches the expectation.
- (ii) If training uses $\tilde h=\frac1p\,m\odot h$ (inverted dropout), then $\E[\tilde h]=h$, so $h$ is used unchanged at test time.
- (iii) In (ii), the next layer $a=W\tilde h+c$ has $\E[a]=Wh+c$ (the test-time value) and $\Var(a_k)=\frac{1-p}p\sum_iW_{ki}^2h_i^2$.`,
    body: R`
**1. One component.** $\E[m_i]=1\cdot p+0\cdot(1-p)=p$, and $h_i$ is a constant, so $\E[m_ih_i]=p\,h_i$. Collecting the components, $\E[m\odot h]=p\,h$ (i). Multiplying by $\frac1p$, linearity of expectation gives $\E[\tilde h]=h$ (ii).

**2. The mean of the next layer.** By linearity of expectation $\E[a]=W\E[\tilde h]+c=Wh+c$, which equals the value computed at test time without masks.

**3. The variance of the next layer.** Since $m_i^2=m_i$, $\Var(m_i)=\E[m_i^2]-p^2=p(1-p)$, and $\Var(\tilde h_i)=\frac{h_i^2}{p^2}p(1-p)=\frac{1-p}ph_i^2$. The masks are independent, so the $\tilde h_i$ are independent too, and the variance of a linear combination of independent variables is the sum of their variances times the squared coefficients, so $\Var(a_k)=\sum_iW_{ki}^2\Var(\tilde h_i)=\frac{1-p}p\sum_iW_{ki}^2h_i^2$.`,
    note: R`AlexNet's “dropout 0.5” means a drop probability of 0.5, i.e., $p=0.5$, so with method (i) the outputs are multiplied by 0.5 at test time. The expectation matches exactly only up to the linear part of the next layer. For a nonlinear function $\sigma$ after it, in general $\E[\sigma(a)]\ne\sigma(\E a)$ (for the convex ReLU, Jensen's inequality gives $\E[\ReLU(a)]\ge\ReLU(\E a)$), so test-time scaling is an approximation. The variance $\frac{1-p}p\sum_iW_{ki}^2h_i^2$ is the size of the noise mixed in during training, and it grows as $p$ gets smaller.` },
  'ch16-deepshallow': { title: 'A Deeper Network Can Fit the Training Data at Least as Well as a Shallower One',
    stmt: R`Let the training loss be $J(\theta)=\frac1n\sum_{i=1}^n\ell\big(f_\theta(x_i),y_i\big)$.
- (i) If network B can represent every function that network A represents, then $\inf_{\theta_B}J_B\le\inf_{\theta_A}J_A$.
- (ii) If a layer $\ReLU(Wz+c)$ of the same width is inserted after a ReLU, then with $W=I$, $c=0$ it is the identity map. For a convolution layer ($C$ channels, $K\times K$ with $K$ odd, stride 1, padding $\frac{K-1}2$) the same holds with the filter $w_c[i,j,d]=1$ ($d=c$, $i=j=\frac{K-1}2$), all other entries 0, and bias 0.
- (iii) A residual block $h\mapsto h+F(h)$ with $F(h)=W_2\ReLU(W_1h+b_1)+b_2$ is the identity map for every $h$ when $W_2=0$ and $b_2=0$.

Therefore a deeper network obtained by adding such layers or blocks to a shallower one has an infimum of the training loss no larger than the shallower network's, and if the deeper network shows a higher training error, it is not because better parameters do not exist but because training (optimization) failed to find them.`,
    body: R`
**1. Inclusion of function sets (i).** Take any $\theta_A$; by assumption there is $\theta_B$ with $f_{\theta_B}=f_{\theta_A}$, and the loss depends only on the values of the function, so $J_B(\theta_B)=J_A(\theta_A)$. Hence $\inf J_B\le J_A(\theta_A)$; since this holds for every $\theta_A$, taking the infimum on the right gives $\inf J_B\le\inf J_A$.

**2. A fully connected identity layer (ii).** A vector $z$ that has just passed a ReLU has all components $z_k\ge0$. With the inserted layer set to $W=I$, $c=0$, $\ReLU(Iz+0)_k=\max(0,z_k)=z_k$, i.e., the layer is the identity map. Inserting this layer after $\phi_k$ in the shallow network $f=g\circ\phi_m\circ\cdots\circ\phi_1$ ($\phi_k$ are layers ending with a ReLU) gives the same value as $f$ for every input, and so does inserting several such layers.

**3. A convolutional identity layer (ii).** With stride 1 and padding $P=\frac{K-1}2$, the output size formula keeps the width and height. Writing $\bar F$ for the input padded with $P$ cells of zeros, the given filter gives
$$\begin{aligned}G_c[x,y]&=\sum_{i,j,d}w_c[i,j,d]\,\bar F[x+i,\ y+j,\ d]\\&=\bar F[x+P,\ y+P,\ c]=F[x,y,c]\end{aligned}$$
(the $(x+P,y+P)$ cell of the padded input is the original $(x,y)$ cell). The input comes after a ReLU, so $F\ge0$ and another ReLU leaves it unchanged.

**4. A residual block (iii).** If $W_2=0$ and $b_2=0$, then whatever $W_1,b_1$ are, $F(h)=0\cdot\ReLU(W_1h+b_1)+0=0$, so $h+F(h)=h$. Here no condition on the sign of $h$ is needed.

**5. Conclusion.** By 2–4 the deeper network can represent every function of the shallower one, so by 1 the infimum of its training loss is no larger. In the experiment of Section 16.6, the 56-layer plain network had a higher training error than the 20-layer one; this means that training failed to find parameters with a lower training error even though they exist. With overfitting, the training error would be low and only the test error high.`,
    note: R`In terms of expressive power alone, a plain network can also represent the identity (2–3), but only at a specific parameter point, $W=I$. A network initialized with small random values is far from that point, and training has to travel there. In a residual block the identity sits at $W_2=0$, i.e., near small weights, so a block that “does nothing” is easy to obtain (Section 16.6). ResNet applies one more ReLU after the addition, but if $h\ge0$ (the preceding layer ends with a ReLU), $\ReLU(h+0)=h$, and the conclusion is the same.` },
  });
})();
