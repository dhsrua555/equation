/* English text — Quiz 3 prep mock exam A (exams-4.js). Problems are listed in the same order as in the exam. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  const G = 'Quiz 3 prep · Week 10 Wed – Week 11 Wed';
  Object.assign(EM.en.ex, {
  q3a: {
    group: G,
    groupDesc: 'One exam-style set covering Units 22–23 (linear attention and vision Transformers; generative models: maximum likelihood, the ELBO, the VAE). Problem 1 computes linear attention by hand and derives the cost of global and window attention; Problem 2 sets up the ELBO and computes the Gaussian KL and the reparameterized gradients. Both problems have parts (a)(b)(c) and come with a grading rubric.',
    kind: 'Quiz 3 style', title: 'The Cost of Attention and the VAE Derivation', scopeText: 'Units 22–23',
    desc: 'Compute a linear attention output directly and derive the cost of self-attention and window attention, then set up the ELBO with Jensen’s inequality and check the Gaussian KL and the reparameterized gradients with numbers.',
    probs: [
      { q: R`This problem is about computing linear attention and window attention. A matrix product ($m\times n$)$\cdot$($n\times k$) costs $mnk$ multiplications.
(a) Three tokens have key features $\phi(\mathbf k_1)=(1,0)$, $\phi(\mathbf k_2)=(0,1)$, $\phi(\mathbf k_3)=(1,1)$, scalar values $v_1=1$, $v_2=2$, $v_3=3$, and the query feature is $\phi(\mathbf q_1)=(2,1)$. Find $S=\sum_j\phi(\mathbf k_j)v_j$ and $Z=\sum_j\phi(\mathbf k_j)$ and compute the linear attention output $\tilde v_1=\phi(\mathbf q_1)^TS/\phi(\mathbf q_1)^TZ$. Check the same value directly as an average weighted by the similarities $\phi(\mathbf q_1)^T\phi(\mathbf k_j)$.
(b) Derive that self-attention with $N$ tokens, dimension $C$ and $h$ heads costs $4NC^2+2N^2C$, and that window attention, done only inside non-overlapping $M\times M$ windows, costs $4NC^2+2NM^2C$. Use projections $W_Q,W_K,W_V,W_O\in\mathbb R^{C\times C}$ and ignore the cost of the softmax; state the assumptions you use and explain why $h$ does not appear in the result.
(c) For a $56\times56$ feature map ($N=56^2$), $C=96$, $M=7$, find the number of windows, the ratio $2N^2C/2NM^2C$ of the two attention terms, and the total cost of each method.`,
        sol: R`
**(a)** $S=1\cdot(1,0)+2\cdot(0,1)+3\cdot(1,1)=(4,5)$ and $Z=(1,0)+(0,1)+(1,1)=(2,2)$. Since $\phi(\mathbf q_1)^TS=2\cdot4+1\cdot5=13$ and $\phi(\mathbf q_1)^TZ=2\cdot2+1\cdot2=6$, $\tilde v_1=\boxed{13/6}\approx2.17$. Directly, the similarities are $\phi(\mathbf q_1)^T\phi(\mathbf k_j)=2,1,3$ and $\frac{2\cdot1+1\cdot2+3\cdot3}{2+1+3}=\frac{13}6$, the same. Linear attention builds $S$ and $Z$ once and all queries share them.
**(b)** Assumptions: input $X\in\mathbb R^{N\times C}$, $C/h$ dimensions per head, $h\mid C$, and the number of windows $N/M^2$ is an integer. The projections $XW_Q$, $XW_K$, $XW_V$ are each ($N\times C$)$\cdot$($C\times C$), costing $NC^2$, and the output projection is also $NC^2$, for $4NC^2$ in total. In one head, $Q_hK_h^T$ is ($N\times\frac Ch$)$\cdot$($\frac Ch\times N$), costing $N^2\frac Ch$, and $A_hV_h$ is ($N\times N$)$\cdot$($N\times\frac Ch$), costing $N^2\frac Ch$. Adding the $h$ heads,
$$h\cdot2N^2\frac Ch=2N^2C,$$
so $h$ cancels and global self-attention costs $4NC^2+2N^2C$. The heads only share out the $C$ dimensions; the total dimension stays the same. In window attention the projections are per token, so they stay $4NC^2$; one window is self-attention over $M^2$ tokens, with attention term $2(M^2)^2C$, and there are $N/M^2$ windows, so
$$\frac N{M^2}\cdot2M^4C=2NM^2C.$$
The total is $4NC^2+2NM^2C$.
**(c)** $N=3136$, there are $3136/49=\boxed{64}$ windows, and the ratio of the attention terms is $\frac{2N^2C}{2NM^2C}=\frac N{M^2}=\boxed{64}$. With $4NC^2=115{,}605{,}504$, $2N^2C=1{,}888{,}223{,}232$ and $2NM^2C=29{,}503{,}488$, global attention costs $\boxed{2{,}003{,}828{,}736}\approx2.0\times10^9$ and window attention $\boxed{145{,}108{,}992}\approx1.45\times10^8$, a total ratio of about $13.8$. In global attention the attention term is about $94\%$ of the cost, but in window attention the projection term is about $80\%$.`,
        rubric: R`
- (a) $S=(4,5)$, $Z=(2,2)$ — 6 points
- (a) $\tilde v_1=13/6$ and the check by the similarity-weighted average — 8 points
- (b) Projection cost $4NC^2$ — 8 points
- (b) $2N^2C/h$ per head, $2N^2C$ in total, and why $h$ cancels — 10 points
- (b) $N/M^2$ windows times $2M^4C$ giving $2NM^2C$, with the assumptions stated — 8 points
- (c) 64 windows and ratio 64 — 4 points
- (c) Total cost of both methods (ratio about 13.8) — 6 points` },
      { q: R`Consider a VAE with prior $p(\mathbf z)=\N(\mathbf 0,I)$, decoder $p_\theta(\mathbf x\mid\mathbf z)$ and encoder $q_\phi(\mathbf z\mid\mathbf x)$.
(a) Derive $\log p_\theta(\mathbf x)\ge\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$. State the inequality you use and the assumption needed on $q_\phi$, and say when equality holds.
(b) For one-dimensional $q=\N(\mu,\sigma^2)$ and $p=\N(0,1)$, derive $\KL(q\,\|\,p)=\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$ and find its value for $\mu=2$, $\sigma^2=1$.
(c) The encoder of a one-dimensional VAE outputs $\mu=2$, $\sigma=1$, and the noise $\varepsilon=-0.5$ is drawn and reparameterized as $z=\mu+\sigma\varepsilon$. The decoder is $f(z)=wz$ ($w=2$), the data point is $x=4$, and the reconstruction loss is $R=\frac12(x-f(z))^2$. Find $z$, $R$, $\partial R/\partial\mu$, $\partial R/\partial\sigma$ and the gradients of the KL term $\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$ with respect to $\mu$ and $\sigma$, and say what the single-sample $\partial R/\partial\mu$ is an unbiased estimator of.`,
        sol: R`
**(a)** Assumptions: $p_\theta(\mathbf x)>0$, and $q_\phi(\mathbf z\mid\mathbf x)$ is a density that is positive at every $\mathbf z$ with $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)>0$. Then multiplying and dividing by $q_\phi$ writes the integral as an expectation, and Jensen’s inequality for the concave $\log$, $\log\E[Y]\ge\E[\log Y]$, gives
$$\log p_\theta(\mathbf x)=\log\E_{q_\phi}\Big[\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big]\ge\E_{q_\phi}\Big[\log\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big]=\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z)).$$
The last equality splits the log in two and uses $\E_q[\log(p/q)]=-\KL(q\,\|\,p)$. Equality holds when the ratio $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/q_\phi(\mathbf z\mid\mathbf x)$ is constant, that is, when $q_\phi(\mathbf z\mid\mathbf x)=p_\theta(\mathbf z\mid\mathbf x)$, and in general the gap is $\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$.
**(b)** $\log\frac{q(z)}{p(z)}=-\frac12\log\sigma^2-\frac{(z-\mu)^2}{2\sigma^2}+\frac{z^2}2$, and under $z\sim q$, $\E[(z-\mu)^2]=\sigma^2$ and $\E[z^2]=\sigma^2+\mu^2$, so
$$\KL(q\,\|\,p)=-\frac12\log\sigma^2-\frac12+\frac{\sigma^2+\mu^2}2=\frac12\big(\sigma^2+\mu^2-1-\log\sigma^2\big).$$
For $\mu=2$, $\sigma^2=1$ it is $\frac12(1+4-1-0)=\boxed{2}$.
**(c)** $z=2+1\cdot(-0.5)=\boxed{1.5}$, $f(z)=3$, $R=\frac12(4-3)^2=\boxed{0.5}$. Since $\frac{\partial R}{\partial z}=-(x-wz)\,w=-2$, $\frac{\partial z}{\partial\mu}=1$ and $\frac{\partial z}{\partial\sigma}=\varepsilon=-0.5$,
$$\frac{\partial R}{\partial\mu}=-2\cdot1=\boxed{-2},\qquad\frac{\partial R}{\partial\sigma}=-2\cdot(-0.5)=\boxed{1}.$$
The gradients of the KL term are $\frac{\partial}{\partial\mu}=\mu=\boxed{2}$ and $\frac{\partial}{\partial\sigma}=\frac12\big(2\sigma-\frac2\sigma\big)=\sigma-\frac1\sigma=\boxed{0}$. The single-sample $\partial R/\partial\mu$ is an unbiased estimator of $\frac{\partial}{\partial\mu}\E_{z\sim\N(\mu,\sigma^2)}[R(z)]$. Indeed $\E[R]=\frac12\big((x-w\mu)^2+w^2\sigma^2\big)$, so the true gradients are $\partial/\partial\mu=-w(x-w\mu)=0$ and $\partial/\partial\sigma=w^2\sigma=4$; the single-sample values $-2$ and $1$ match them only on average.`,
        rubric: R`
- (a) Multiplying and dividing by $q_\phi$ to get an expectation, with the support assumption stated — 6 points
- (a) The lower bound by Jensen’s inequality (concavity of the log) — 6 points
- (a) Splitting into two terms and writing the KL — 4 points
- (a) The equality condition (the posterior), or the gap as the KL to the posterior — 4 points
- (b) The difference of log densities and the two expectations — 10 points
- (b) The value $2$ — 2 points
- (c) $z=1.5$, $R=0.5$ — 4 points
- (c) $\partial R/\partial\mu=-2$, $\partial R/\partial\sigma=1$ by the chain rule — 8 points
- (c) KL gradients $2$ and $0$ — 4 points
- (c) What the estimate is unbiased for, $\partial\E[R]/\partial\mu$ — 2 points` },
    ],
  },
  });
})();
