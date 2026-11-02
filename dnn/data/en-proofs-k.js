/* English text — proofs for Unit 17: the universal approximation theorem (Cybenko 1989) of the W8 Wed notes (Oct. 21). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  'ch17-errsplit': { title: 'The Error Decomposition and the Signs of Its Terms',
    stmt: R`If $f^*$ minimizes the risk $\mathcal R$ among all functions, $f_{\mathcal F}$ minimizes it within $\mathcal F$, and $\hat f_n,f_{\mathrm{alg}}\in\mathcal F$, then
$$\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)=\big[\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)\big]+\big[\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})\big]+\big[\mathcal R(f_{\mathcal F})-\mathcal R(f^*)\big],$$
and the second (generalization) and third (approximation) terms are at least $0$.`,
    body: R`
**The identity.** On the right side $\mathcal R(\hat f_n)$ and $\mathcal R(f_{\mathcal F})$ are each added once and subtracted once (a telescoping sum), so only the left side remains.

**The approximation term.** $f^*$ has the smallest risk among all functions, and $f_{\mathcal F}$ is one of those functions, so $\mathcal R(f_{\mathcal F})\ge\mathcal R(f^*)$.

**The generalization term.** $f_{\mathcal F}$ has the smallest risk within $\mathcal F$ and $\hat f_n\in\mathcal F$, so $\mathcal R(\hat f_n)\ge\mathcal R(f_{\mathcal F})$.

**The optimization term.** What $\hat f_n$ minimizes is the empirical risk $\widehat{\mathcal R}_n$, not $\mathcal R$, so the order of $\mathcal R(f_{\mathrm{alg}})$ and $\mathcal R(\hat f_n)$ is not determined.`,
    note: R`If the minimizers do not exist, using infima in place of $f_{\mathcal F}$ and $f^*$ gives the same conclusion.` },
  'ch17-closure': { title: 'The Closure of a Subspace and Density',
    stmt: R`For a linear subspace $U$ of a normed space $X$, the closure $\overline U$ (all limits of sequences in $U$) is a linear subspace, and $U$ being dense is the same as $\overline U=X$.`,
    body: R`
**Subspace.** If $f,g\in\overline U$ and $a,b\in\mathbb R$, there are $u_k,v_k\in U$ with $u_k\to f$ and $v_k\to g$. Since $U$ is a subspace, $au_k+bv_k\in U$, and by the triangle inequality and homogeneity of the norm
$$\lVert(au_k+bv_k)-(af+bg)\rVert\le\lvert a\rvert\lVert u_k-f\rVert+\lvert b\rvert\lVert v_k-g\rVert\to0.$$
So $af+bg\in\overline U$, and $0\in U\subseteq\overline U$.

**Dense ⇒ $\overline U=X$.** For $f\in X$, choosing for each $\varepsilon=\frac1k$ some $u_k\in U$ with $\lVert f-u_k\rVert<\frac1k$ gives $u_k\to f$, that is, $f\in\overline U$.

**$\overline U=X$ ⇒ dense.** If $f\in X=\overline U$, there are $u_k\in U$ with $u_k\to f$, and for a given $\varepsilon$, $\lVert f-u_k\rVert<\varepsilon$ for large enough $k$.`,
    note: R`By the same logic, if a bounded linear functional $L$ is $0$ on $U$, then $L(f)=\lim L(u_k)=0$, so it is $0$ on $\overline U$ too. That is why a dense subspace cannot be “annihilated” by a nonzero $L$.` },
  'ch17-lemma1': { title: 'Lemma 1: A Continuous Sigmoid Is Discriminatory',
    stmt: R`Let $\sigma:\mathbb R\to\mathbb R$ be continuous with $\sigma(t)\to0$ ($t\to-\infty$) and $\sigma(t)\to1$ ($t\to\infty$). If $\mu\in M(I_n)$ satisfies $\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0$ for all $w\in\mathbb R^n$ and $\theta\in\mathbb R$, then $\mu=0$.`,
    body: R`
**Preparation.** $\sigma$ is continuous with finite limits at both ends, so it is bounded: for $\lvert t\rvert>T$ it is within $1$ of its limits, and on $[-T,T]$ it is a continuous function with a maximum. Say $\lvert\sigma\rvert\le M$. Write the signed measure as $\mu=\mu^+-\mu^-$ (two finite measures), and exchange limits and integrals by applying the bounded convergence theorem to each.

**Step 1: the limit of a steep neuron.** Fix $w,\theta,\varphi$ and set $\sigma_\lambda(x)=\sigma\big(\lambda(w^Tx+\theta)+\varphi\big)$; this is also a neuron $\sigma(w'^Tx+\theta')$ ($w'=\lambda w$, $\theta'=\lambda\theta+\varphi$), so $\int\sigma_\lambda\,d\mu=0$ by assumption. As $\lambda\to\infty$, pointwise
$$\sigma_\lambda(x)\to\gamma(x)=\begin{cases}1&w^Tx+\theta>0\\0&w^Tx+\theta<0\\\sigma(\varphi)&w^Tx+\theta=0\end{cases}$$
and $\lvert\sigma_\lambda\rvert\le M$, so by bounded convergence $0=\int\sigma_\lambda\,d\mu\to\int\gamma\,d\mu$. For the half-space $H^+=\{w^Tx+\theta>0\}$ and the hyperplane $\Pi=\{w^Tx+\theta=0\}$ (both intersected with $I_n$),
$$\mu(H^+)+\sigma(\varphi)\,\mu(\Pi)=0\qquad\forall\varphi\in\mathbb R.$$

**Step 2: half-spaces and hyperplanes have measure 0.** As $\varphi\to-\infty$, $\sigma(\varphi)\to0$, so $\mu(H^+)=0$; as $\varphi\to\infty$, $\mu(H^+)+\mu(\Pi)=0$, so $\mu(\Pi)=0$. Since $w,\theta$ are arbitrary, every open half-space and every hyperplane has measure $0$, and so does a closed half-space, their union.

**Step 3: a functional in one direction.** Fix a direction $w$, and for bounded Borel functions $h:\mathbb R\to\mathbb R$ set $F(h)=\int_{I_n}h(w^Tx)\,d\mu(x)$. $F$ is linear with $\lvert F(h)\rvert\le\sup_{t\in J}\lvert h(t)\rvert\cdot\lvert\mu\rvert(I_n)$, and since $w^Tx\in J=[-\lVert w\rVert_1,\lVert w\rVert_1]$ for $x\in I_n$, only the values on $J$ matter. For $h=\mathbf 1_{[c,\infty)}$, $F(h)=\mu(\{w^Tx\ge c\})=0$ (the closed half-space of Step 2), so $F(s)=0$ for $\mathbf 1_{[a,b)}=\mathbf 1_{[a,\infty)}-\mathbf 1_{[b,\infty)}$ and for every step function $s$, their linear combination. $\cos$ is uniformly continuous on the compact interval $J$, so there are step functions $s_k$ with $\sup_J\lvert\cos-s_k\rvert\to0$, and $\lvert F(\cos)\rvert=\lvert F(\cos-s_k)\rvert\le\sup_J\lvert\cos-s_k\rvert\,\lvert\mu\rvert(I_n)\to0$. In the same way $F(\sin)=0$.

**Step 4: the Fourier transform.** Hence for every $w\in\mathbb R^n$
$$\hat\mu(w)=\int_{I_n}e^{-iw^Tx}\,d\mu(x)=F(\cos)-iF(\sin)=0.$$
A finite signed measure is determined uniquely by its Fourier transform (uniqueness of the Fourier–Stieltjes transform), so $\mu=0$. ∎`,
    note: R`This proof uses continuity only for boundedness in Step 1, so it holds as is for bounded measurable sigmoids (e.g., the step function). In that case, however, $G$ is not continuous, and the conclusion of Cybenko’s theorem becomes $L^1$ approximation instead of $C(I_n)$. The proof was skipped in class.` },
  'ch17-lemma3': { title: 'Lemma 3: A Functional That Annihilates a Non-Dense Subspace',
    stmt: R`If a linear subspace $U$ of a normed space $X$ is not dense ($\overline U\ne X$), there is a bounded linear functional $L:X\to\mathbb R$ with $L|_U=0$ and $L\ne0$. (The Hahn–Banach extension theorem is used as a fact: if a linear functional $L_0$ on a subspace $V$ satisfies $\lvert L_0(v)\rvert\le C\lVert v\rVert$, it has a linear extension to all of $X$ with the same bound.)`,
    body: R`
**Choosing a point.** Since $\overline U\ne X$, choose $f_0\in X\setminus\overline U$. Setting $d=\inf_{u\in\overline U}\lVert f_0-u\rVert$, we have $d>0$. If $d=0$, there would be $u_k\in\overline U$ with $\lVert f_0-u_k\rVert\to0$, so $f_0$ would be a limit of elements of $\overline U$, that is, $f_0\in\overline U$ (the closure is closed) — a contradiction.

**Defining it on a small space.** On $V=\{u+tf_0:\ u\in\overline U,\ t\in\mathbb R\}$ set $L_0(u+tf_0)=td$. It is well defined because the representation is unique: if $u+tf_0=u'+t'f_0$ with $t\ne t'$, then $f_0=\frac{u'-u}{t-t'}\in\overline U$ (a subspace), a contradiction, so $t=t'$ and $u=u'$. $L_0$ is linear, $0$ on $\overline U$, and $L_0(f_0)=d\ne0$.

**Boundedness.** If $t\ne0$, then $-u/t\in\overline U$, so
$$\lVert u+tf_0\rVert=\lvert t\rvert\,\Big\lVert f_0-\Big(-\frac ut\Big)\Big\rVert\ge\lvert t\rvert d=\lvert L_0(u+tf_0)\rvert,$$
and if $t=0$ it is trivial since $L_0=0$. That is, $\lvert L_0(v)\rvert\le\lVert v\rVert$ ($v\in V$).

**Extension.** The Hahn–Banach theorem gives a linear extension $L$ on $X$ with $\lvert L(f)\rvert\le\lVert f\rVert$. $L$ is bounded, $L|_U=0$ ($U\subseteq\overline U$), and $L(f_0)=d\ne0$, so $L\ne0$. ∎`,
    note: R`If $U$ is dense there is no such $L$: if a bounded $L$ is $0$ on $U$, continuity makes it $0$ on all of $\overline U=X$. The proof was skipped in class.` },
  'ch17-lemma4': { title: 'Lemma 4: An Annihilating Measure from the Riesz Representation',
    stmt: R`If $U$ is a non-dense linear subspace of $C(I_n)$, there is $\mu\in M(I_n)$ with $\mu\ne0$ such that $\int_{I_n}h\,d\mu=0$ ($\forall h\in U$).`,
    body: R`
**Step 1: a functional.** $X=C(I_n)$ (max norm) is a normed space and $U$ is a non-dense linear subspace of it, so by Lemma 3 there is a bounded linear functional $L:C(I_n)\to\mathbb R$ with $L\ne0$ and $L|_U=0$.

**Step 2: turning it into a measure.** $I_n=[0,1]^n$ is a compact set in $\mathbb R^n$ and $L$ is a bounded linear functional on $C(I_n)$, so by the Riesz representation theorem there is a finite signed measure $\mu\in M(I_n)$ with
$$L(f)=\int_{I_n}f\,d\mu\qquad\forall f\in C(I_n).$$

**Step 3: zero on $U$.** If $h\in U$, then $\int_{I_n}h\,d\mu=L(h)=0$.

**Step 4: $\mu\ne0$.** Since $L\ne0$, there is $f_0\in C(I_n)$ with $L(f_0)\ne0$. If $\mu=0$, then $\int f_0\,d\mu$ would be $0$, but this value is $L(f_0)\ne0$, so $\mu\ne0$. ∎`,
    note: R`The statement in the notes is missing $\mu\ne0$, and $L(f)$ in the last line should be $L(h)$. Without $\mu\ne0$ the lemma is useless, since $\mu=0$ always satisfies the conclusion.` },
  'ch17-cybenko': { title: 'The Universal Approximation Theorem (Cybenko 1989)',
    stmt: R`If $\sigma$ is a continuous sigmoid, the functions of the form $G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)$ ($N\in\mathbb N$, $w_j\in\mathbb R^n$, $\alpha_j,\theta_j\in\mathbb R$) are dense in $C(I_n)$. That is, for every $f\in C(I_n)$ and $\varepsilon>0$ there is $G$ with $\lvert f(x)-G(x)\rvert<\varepsilon$ ($\forall x\in I_n$).`,
    body: R`
**Starting from Lemma 5.** We show the conclusion holds whenever $\sigma$ is continuous and discriminatory. A continuous sigmoid is discriminatory by Lemma 1, so this proves the theorem.

**Subspace.** Let $U$ be all finite sums of the form above. The sum of two elements is a finite sum with the neurons concatenated, a scalar multiple is a finite sum with changed $\alpha_j$, and $\alpha_1=0$ gives the zero function. Since $\sigma$ is continuous, each $G$ is continuous as sums and compositions of continuous functions, so $U$ is a linear subspace of $C(I_n)$.

**Assumption for contradiction.** Assume $U$ is not dense in $C(I_n)$, that is, $\overline U\ne C(I_n)$.

**Lemma 4.** There is $\mu\in M(I_n)$ with $\mu\ne0$ such that $\int_{I_n}h\,d\mu=0$ for every $h\in U$, that is,
$$\sum_{j=1}^N\alpha_j\int_{I_n}\sigma(w_j^Tx+\theta_j)\,d\mu(x)=0\qquad\forall N,\ w_j,\ \alpha_j,\ \theta_j.$$

**Down to one neuron.** Setting $N=1$ and $\alpha_1=1$ gives $\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0$ ($\forall w\in\mathbb R^n$, $\theta\in\mathbb R$).

**Contradiction.** Since $\sigma$ is discriminatory, $\mu=0$. This contradicts $\mu\ne0$, so $\overline U=C(I_n)$, that is, $U$ is dense. Unpacking the definition of density gives the $\varepsilon$ inequality of the conclusion. ∎`,
    note: R`What is negated is not “$U\ne C(I_n)$” but “$\overline U\ne C(I_n)$.” The theorem says nothing about the size of $N$, how to find the weights, or generalization. The same proof works on any compact $K\subset\mathbb R^n$ in place of $I_n$.` },
  });
})();
