/* English text — proofs for Unit 18: Barron's theorem from the W8 Wed and W9 Mon notes (Barron class, Maurey's lemma,
   Barron's lemma, completing the theorem) and generalization (risk decomposition, symmetrization, Rademacher complexity of a linear class). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  'ch18-lip': { title: 'Functions in the Barron Class Are C-Lipschitz',
    stmt: R`If $f\in L^1(\mathbb R^d)$, $\hat f\in L^1$, and $\int_{\mathbb R^d}|2\pi\xi||\hat f(\xi)|d\xi\le C$, then $|f(x)-f(y)|\le C|x-y|$ for all $x,y$.`,
    body: R`
Since $\hat f\in L^1$, the inverse transform $f(x)=\int\hat f(\xi)e^{2\pi i\xi^Tx}d\xi$ holds at every point, and
$$f(x)-f(y)=\int_{\mathbb R^d}\hat f(\xi)\big(e^{2\pi i\xi^Tx}-e^{2\pi i\xi^Ty}\big)d\xi.$$
The chord between two points $e^{iu},e^{iv}$ of the unit circle is shorter than the arc, so $|e^{iu}-e^{iv}|\le|u-v|$, and Cauchy–Schwarz applied to $u-v=2\pi\xi^T(x-y)$ gives $|u-v|\le2\pi|\xi||x-y|$. Therefore
$$|f(x)-f(y)|\le\int|\hat f(\xi)|\,2\pi|\xi|\,|x-y|\,d\xi=|x-y|\int|2\pi\xi||\hat f(\xi)|d\xi\le C|x-y|.$$`,
    note: R`Since $\nabla f(x)=\int2\pi i\xi\hat f(\xi)e^{2\pi i\xi^Tx}d\xi$, the same computation gives $|\nabla f(x)|\le\int|2\pi\xi||\hat f|d\xi$. The Barron condition says "the Fourier amplitudes of the gradient are integrable".` },
  'ch18-maurey': { title: 'Maurey’s Lemma',
    stmt: R`If $H$ is a Hilbert space and every element of $G\subset H$ has $\lVert g\rVert_H\le B$, then for $f\in\overline{\operatorname{co}}(G)$, $N\in\mathbb N$, and $c>B^2$ there are $g_1,\dots,g_N\in G$ with $\big\lVert f-\frac1N\sum_{i=1}^Ng_i\big\rVert_H^2\le\frac cN$.`,
    body: R`
**Nearby point.** Fix $\varepsilon>0$. Since $f$ is in the closure of $\operatorname{co}(G)$, there are $h_1,\dots,h_m\in G$ and $\alpha_j\ge0$ with $\sum_j\alpha_j=1$ such that $f^*=\sum_j\alpha_jh_j$ satisfies $\lVert f-f^*\rVert_H<\varepsilon$.

**Random draws.** Let $X_1,\dots,X_N$ be i.i.d. with $\mathbb P(X_i=h_j)=\alpha_j$. Then $\E X_i=\sum_j\alpha_jh_j=f^*$ and $\lVert X_i\rVert\le B$.

**Vanishing cross terms.** Expanding the squared norm of $f^*-\frac1N\sum_jX_j=\frac1N\sum_j(f^*-X_j)$,
$$\E\Big\lVert f^*-\frac1N\sum_jX_j\Big\rVert^2=\frac1{N^2}\Big(\sum_j\E\lVert f^*-X_j\rVert^2+\sum_{i\ne j}\E\langle f^*-X_i,f^*-X_j\rangle\Big).$$
For $i\ne j$, $X_i,X_j$ are independent and take finitely many values, so $\E\langle X_i,X_j\rangle=\sum_{k,l}\alpha_k\alpha_l\langle h_k,h_l\rangle=\lVert f^*\rVert^2$, and therefore $\E\langle f^*-X_i,f^*-X_j\rangle=\lVert f^*\rVert^2-\lVert f^*\rVert^2-\lVert f^*\rVert^2+\lVert f^*\rVert^2=0$.

**Size of one term.** The remaining $N$ terms have the same distribution, so
$$\E\Big\lVert f^*-\frac1N\sum_jX_j\Big\rVert^2=\frac1N\E\lVert f^*-X_1\rVert^2=\frac1N\big(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2\big)\le\frac{B^2}N.$$

**Existence.** A nonnegative random variable with expectation at most $\frac{B^2}N$ takes a value at most $\frac{B^2}N$ at some outcome $\omega$ (if every outcome were larger, so would be the expectation). Set $g_i:=X_i(\omega)\in G$.

**Triangle inequality.** $\big\lVert f-\frac1N\sum_ig_i\big\rVert\le\varepsilon+\frac B{\sqrt N}$. Since $c>B^2$, choosing $\varepsilon<\frac{\sqrt c-B}{\sqrt N}$ at the start makes the right side smaller than $\sqrt{c/N}$, and squaring gives the conclusion.`,
    note: R`The notes write "$\varepsilon>0$ arbitrary, this claim concludes the proof" and finish with the triangle inequality $\le\varepsilon+B/\sqrt N<\sqrt{c/N}$. The proof actually gives $\frac{B^2-\lVert f^*\rVert^2}N$, and if $f\in\operatorname{co}(G)$ one can take $\varepsilon=0$ and $c=B^2$.` },
  'ch18-barronlemma': { title: 'Barron’s Lemma: f − f(0) Lies in the Convex Hull of Heaviside Ridges',
    stmt: R`If $f\in\Gamma_C$, then $f|_{B_1^d}-f(0)\in\overline{\operatorname{co}}(G_C)$ in $L^2_\circ(B_1^d)$, where $G_C=\{x\mapsto\gamma\mathbf 1_{\mathbb R_+}(\langle a,x\rangle+b):a\in\mathbb R^d,b\in\mathbb R,|\gamma|\le2C\}$.`,
    body: R`
**Fourier representation (notes).** Let $C_f:=\int|2\pi\xi||\hat f(\xi)|d\xi<C$ (if $C_f=0$, then $\hat f=0$ a.e., so $f-f(0)=0\in\overline{\operatorname{co}}(G_C)$). Writing $\hat f(\xi)=|\hat f(\xi)|e^{i\kappa(\xi)}$ and taking the real part of the inverse transform,
$$f(x)-f(0)=\int|\hat f(\xi)|\big(\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)\big)d\xi=C_f\int q_x(\xi)\,d\Lambda(\xi),$$
with $q_x(\xi)=\frac{\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)}{|2\pi\xi|}$ and $d\Lambda=\frac1{C_f}|2\pi\xi||\hat f(\xi)|d\xi$ (a probability measure).

**Ridge function.** Fix $\xi\ne0$ and let $\omega=\xi/|\xi|$, $\varphi(t)=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}$. Then $q_x(\xi)=\varphi(\langle x,\omega\rangle)$, and for $\lVert x\rVert\le1$, $t=\langle x,\omega\rangle\in[-1,1]$. Since $\varphi(0)=0$ and $|\varphi'(t)|=|\sin(2\pi|\xi|t+\kappa)|\le1$, $|q_x(\xi)|\le1$.

**Staircase approximation.** With $t_k=k/K$ and $\Delta_k^\pm=\varphi(\pm t_k)-\varphi(\pm t_{k-1})$, form $S_K(t)=\sum_{k=1}^K\Delta_k^+\mathbf 1_{\mathbb R_+}(t-t_k)+\sum_{k=1}^K\Delta_k^-\mathbf 1_{\mathbb R_+}(-t-t_k)$; telescoping and the 1-Lipschitz property give $\sup_{[-1,1]}|\varphi-S_K|\le\frac1K$. The absolute heights add up to $V=\sum|\Delta_k^\pm|\le\int_{-1}^1|\varphi'|\le2$, and $S_K=\sum\frac{|\Delta|}V\big(V\operatorname{sign}(\Delta)\mathbf 1_{\mathbb R_+}(\langle\pm\omega,x\rangle-t_k)\big)$ is a convex combination of Heaviside ridges of height $V\le2$. Multiplying by $C_f$ gives height $2C_f\le2C$, so $C_fS_K(\langle x,\omega\rangle)\in\operatorname{co}(G_C)$, and since the normalized norm is at most the uniform norm, $\lVert C_fq_\cdot(\xi)-C_fS_K\rVert_{L^2_\circ}\le\frac{C_f}K\to0$. So each $x\mapsto C_fq_x(\xi)$ lies in $\overline{\operatorname{co}}(G_C)$.

**The integral as an average.** Draw $\xi_1,\dots,\xi_n$ independently from $\Lambda$ and let $F_n(x)=\frac1n\sum_iC_fq_x(\xi_i)$; at each $x$, $\E F_n(x)=f(x)-f(0)$ and $\Var F_n(x)\le\frac{C_f^2}n$ ($|C_fq_x|\le C_f$). Exchanging the average over $x$ and the expectation by Fubini,
$$\E\lVert F_n-(f-f(0))\rVert_{L^2_\circ}^2=\frac1{|B_1^d|}\int_{B_1^d}\Var F_n(x)\,dx\le\frac{C_f^2}n.$$
So some realization has $\lVert F_n-(f-f(0))\rVert^2\le C_f^2/n$, and as $n\to\infty$ these tend to $f-f(0)$. Each $F_n$ is a convex combination of elements of $\overline{\operatorname{co}}(G_C)$, so it lies in $\overline{\operatorname{co}}(G_C)$ again (a closed convex set), and so does the limit $f-f(0)$.`,
    note: R`Instead of the third step, the notes draw the Riemann sum $C\sum_\theta q_x(\theta)\Lambda(I_\theta)$ over a grid as "a convex combination". The idea is the same, but it needs details such as the continuity of $\kappa(\xi)$, so random draws as in Maurey's lemma are used here. Also, dividing by $\frac1C$ as in the notes gives $\Lambda$ mass $C_f/C<1$, so we divide by $C_f$. The fourth step and the second and third steps fill in what was skipped in class.` },
  'ch18-heaviside': { title: 'A Sigmoid with Growing Slope Becomes a Heaviside Function (L²)',
    stmt: R`If $\sigma$ is a sigmoid ($\lim_{t\to-\infty}\sigma=0$, $\lim_{t\to\infty}\sigma=1$, bounded) and $a\ne0$, then $\lVert\sigma(\lambda(\langle a,\cdot\rangle+b))-\mathbf 1_{\mathbb R_+}(\langle a,\cdot\rangle+b)\rVert_{L^2_\circ(B_1^d)}\to0$ as $\lambda\to\infty$.`,
    body: R`
Let $u(x)=\langle a,x\rangle+b$. If $u(x)>0$, then $\lambda u(x)\to+\infty$, so $\sigma(\lambda u(x))\to1=\mathbf 1_{\mathbb R_+}(u(x))$; if $u(x)<0$, it tends to $0=\mathbf 1_{\mathbb R_+}(u(x))$. The only place where convergence may fail is the hyperplane $\{u=0\}$, which has volume 0 because $a\ne0$.
The squared difference $|\sigma(\lambda u)-\mathbf 1_{\mathbb R_+}(u)|^2$ tends to 0 at almost every $x$ and, since $\sigma$ is bounded ($|\sigma|\le M$), is dominated by $(M+1)^2$. The ball has finite volume, so by dominated convergence $\frac1{|B_1^d|}\int_{B_1^d}|\sigma(\lambda u)-\mathbf 1_{\mathbb R_+}(u)|^2dx\to0$.`,
    note: R`The convergence is not uniform near the hyperplane. For the logistic function, for example, the difference is at most $e^{-\lambda\delta}$ where $|u|\ge\delta$, and the band $|u|<\delta$ has volume proportional to $\delta$, so with $\delta=\lambda^{-1/2}$ the $L^2$ error shrinks roughly like $\lambda^{-1/4}$.` },
  'ch18-barronthm': { title: 'Proof of Barron’s Theorem',
    stmt: R`If $\sigma$ is a sigmoid and $f\in\Gamma_C$, then for every $c>4C^2$ and $N\in\mathbb N$ there is $\Phi_N(x)=f(0)+\sum_{i=1}^N\frac{\gamma_i}N\sigma(\langle a_i,x\rangle+b_i)$ ($|\gamma_i|\le2C$) with $\frac1{|B_1^d|}\int_{B_1^d}|f-\Phi_N|^2dx\le\frac cN$.`,
    body: R`
**Heaviside version.** By Lemma 2, $f-f(0)\in\overline{\operatorname{co}}(G_C)$, and $g\in G_C$ has $\lVert g\rVert_{L^2_\circ}\le|\gamma|\le2C$. Choose $c'$ with $4C^2<c'<c$ and apply Lemma 1 with $H=L^2_\circ(B_1^d)$, $B=2C$, and $c'$: there are $g_i=\gamma_i\mathbf 1_{\mathbb R_+}(\langle a_i,\cdot\rangle+b_i)\in G_C$ with
$$\Big\lVert f-f(0)-\frac1N\sum_{i=1}^Ng_i\Big\rVert_{L^2_\circ}\le\sqrt{\frac{c'}N}.$$
A $g_i$ with $a_i=0$ is a constant and can be rewritten with $b_i\ne0$.

**Switching to sigmoids.** Let $\eta:=\sqrt{c/N}-\sqrt{c'/N}>0$. By the convergence from sigmoids to Heavisides (off a hyperplane if $a_i\ne0$, convergence of a constant if $a_i=0,b_i\ne0$), take $\lambda$ large so that $\lVert\sigma(\lambda(\langle a_i,\cdot\rangle+b_i))-\mathbf 1_{\mathbb R_+}(\langle a_i,\cdot\rangle+b_i)\rVert_{L^2_\circ}\le\frac\eta{2C}$ for all $i$ ($C>0$).

**Triangle inequality.** With $\Phi_N(x)=f(0)+\sum_i\frac{\gamma_i}N\sigma(\lambda\langle a_i,x\rangle+\lambda b_i)$,
$$\lVert f-\Phi_N\rVert_{L^2_\circ}\le\sqrt{\frac{c'}N}+\sum_i\frac{|\gamma_i|}N\cdot\frac\eta{2C}\le\sqrt{\frac{c'}N}+\eta=\sqrt{\frac cN}.$$
Squaring gives the theorem (write $\lambda a_i,\lambda b_i$ as the new $a_i,b_i$). $\Phi_N$ is a network with one hidden layer of $N$ neurons, output weights $\gamma_i/N$, and output bias $f(0)$.`,
    note: R`The notes write the coefficients as $|r_i|<2C_1$, the right side as $\frac{4C_1^2}N$, and the integral without normalization. Since Lemma 1 gives an average, the coefficients are $\gamma_i/N$; because of the closure and the slack for the sigmoid switch, the right side is $c/N$ ($c>4C^2$); and the integral is the mean divided by $|B_1^d|$. That $d$ appears nowhere in the proof is what "a dimension-free approximation rate" means.` },
  'ch18-riskdecomp': { title: 'The Three-Way Decomposition of the Excess Risk',
    stmt: R`If $f_{\mathcal F}=\argmin_{\mathcal F}R$, $\hat f=\argmin_{\mathcal F}\hat R_n$, $\tilde f\in\mathcal F$, and $R^*=\inf_fR(f)$, then $R(\tilde f)-R^*\le\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+2\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|+\big[R(f_{\mathcal F})-R^*\big]$.`,
    body: R`
Adding and subtracting so that the middle terms cancel,
$$\begin{aligned}R(\tilde f)-R^*&=\big[R(\tilde f)-\hat R_n(\tilde f)\big]+\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+\big[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})\big]\\&\quad+\big[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})\big]+\big[R(f_{\mathcal F})-R^*\big].\end{aligned}$$
Since $\tilde f,f_{\mathcal F}\in\mathcal F$, the first and fourth brackets are each at most $\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|$. Since $\hat f$ minimizes $\hat R_n$ over $\mathcal F$, the third bracket is at most 0. Keeping the second and fifth brackets as they are gives the conclusion.`,
    note: R`If the minima are not attained, use near-minimizers within $\delta$ in place of $f_{\mathcal F}$ and $\hat f$ and let $\delta\to0$ at the end. The second term (optimization) is nonnegative, and it is 0 if training minimizes the empirical risk exactly.` },
  'ch18-symm': { title: 'Symmetrization: The Expected Generalization Gap Is at Most 2 Rad',
    stmt: R`If $z_1,\dots,z_n$ are i.i.d., then $\E\big[\sup_{f\in\mathcal F}\big(\E f(z)-\frac1n\sum_{i=1}^nf(z_i)\big)\big]\le2\operatorname{Rad}_n(\mathcal F)$.`,
    body: R`
**Ghost sample.** Let $z_1',\dots,z_n'$ be a sample drawn separately from the same distribution (a ghost sample), with expectation $\E'$. Since $\E f(z)=\E'\frac1n\sum_if(z_i')$,
$$\sup_f\Big(\E f-\frac1n\sum_if(z_i)\Big)=\sup_f\E'\Big[\frac1n\sum_i\big(f(z_i')-f(z_i)\big)\Big]\le\E'\sup_f\frac1n\sum_i\big(f(z_i')-f(z_i)\big).$$
(For each $f$, the expectation inside the $\sup$ is at most the expectation of the $\sup$.) Taking expectations on both sides, the left side is the quantity we want and the right side is $\E\E'\sup_f\frac1n\sum_i(f(z_i')-f(z_i))$.

**Inserting signs.** The pairs $(z_i,z_i')$ are independent, and swapping $z_i$ and $z_i'$ in any $i$ leaves the joint distribution unchanged. A swap only flips the sign of $f(z_i')-f(z_i)$, so for each fixed choice of signs $\varepsilon_i\in\{\pm1\}$,
$$\E\E'\sup_f\sum_i\big(f(z_i')-f(z_i)\big)=\E\E'\sup_f\sum_i\varepsilon_i\big(f(z_i')-f(z_i)\big).$$
Averaging these identities over Rademacher $\xi_i$ lets us replace $\varepsilon_i$ on the right by $\xi_i$.

**Splitting in two.** The $\sup$ is subadditive over sums, so
$$\sup_f\sum_i\xi_i\big(f(z_i')-f(z_i)\big)\le\sup_f\sum_i\xi_if(z_i')+\sup_f\sum_i(-\xi_i)f(z_i).$$
Since $z_i'$ and $z_i$ have the same distribution and $-\xi_i$ is also Rademacher, both expectations divided by $n$ equal $\operatorname{Rad}_n(\mathcal F)$. Together they give $2\operatorname{Rad}_n(\mathcal F)$.`,
    note: R`The high-probability bound adds McDiarmid's inequality. If the function values lie in $[0,1]$, changing one sample changes $\sup_f(\E f-\frac1n\sum f(z_i))$ by at most $\frac1n$, so with probability at least $1-\frac\delta2$ it exceeds its expectation by no more than $\sqrt{\log(2/\delta)/(2n)}$. Applying the same argument to $-\mathcal F$ and combining gives the second formula of the key box.` },
  'ch18-linrad': { title: 'Rademacher Complexity of a Norm-Bounded Linear Class',
    stmt: R`If $\lVert x_i\rVert\le1$ ($i=1,\dots,n$) and $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$, then $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le\frac Q{\sqrt n}$.`,
    body: R`
With $v=\sum_i\xi_ix_i$, $\frac1n\sum_i\xi_i\langle w,x_i\rangle=\frac1n\langle w,v\rangle$, and by Cauchy–Schwarz $\sup_{\lVert w\rVert\le Q}\langle w,v\rangle=Q\lVert v\rVert$ (attained at $w=Qv/\lVert v\rVert$ if $v\ne0$). Hence $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)=\frac Qn\E\lVert v\rVert$.
The square root is concave, so Jensen's inequality gives $\E\lVert v\rVert\le\sqrt{\E\lVert v\rVert^2}$, and
$$\E\lVert v\rVert^2=\sum_{i,j}\E[\xi_i\xi_j]\langle x_i,x_j\rangle=\sum_i\lVert x_i\rVert^2\le n\qquad(\E\xi_i\xi_j=0,\ i\ne j;\ \xi_i^2=1).$$
Therefore $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le\frac Qn\sqrt n=\frac Q{\sqrt n}$.`,
    note: R`Averaging over the sample as well leaves the same bound, so $\operatorname{Rad}_n(\mathcal F_Q)\le Q/\sqrt n$. For a ReLU network with one hidden layer and $\sum_j|\beta_j|\lVert w_j\rVert\le Q$, the contraction lemma and this computation give $2Q/\sqrt n$.` },
  });
})();
