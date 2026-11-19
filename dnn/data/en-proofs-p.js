/* English text — proofs for Unit 22: Linear Attention & Vision Transformers, W10 Wed notes and slides 12–29, W11 Mon notes
   (attention as a similarity, linear attention and its cost, rank, normalization groups, ViT shapes, GELU, the cost of self-attention and of window attention). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 22
  'ch22-simrewrite': { title: 'Softmax attention is a similarity-weighted convex combination',
    stmt: R`If $\hat{\mathbf v}_i=\sum_{j=1}^N\mathrm{softmax}_j(\mathbf q_i^T\mathbf k_j/\sqrt D)\,\mathbf v_j$ and $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$, then $\hat{\mathbf v}_i=\dfrac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}$. Moreover, for any positive function $\mathrm{sim}$ the $\hat{\mathbf v}_i$ of this formula is a convex combination of the $\mathbf v_j$ and $\lVert\hat{\mathbf v}_i\rVert\le\max_j\lVert\mathbf v_j\rVert$.`,
    body: R`
**Writing out the softmax.** With the score $s_{ij}=\mathbf q_i^T\mathbf k_j/\sqrt D$, the definition of the softmax gives
$$\alpha_{ij}=\frac{e^{s_{ij}}}{\sum_{l=1}^Ne^{s_{il}}}=\frac{\mathrm{sim}(\mathbf q_i,\mathbf k_j)}{\sum_{l=1}^N\mathrm{sim}(\mathbf q_i,\mathbf k_l)}$$
because $e^{s_{ij}}=\exp(\mathbf q_i^T\mathbf k_j/\sqrt D)=\mathrm{sim}(\mathbf q_i,\mathbf k_j)$.

**Pulling out the denominator.** The denominator $Z_i=\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)$ depends only on the query $i$, not on the summation index $j$. Hence
$$\hat{\mathbf v}_i=\sum_j\alpha_{ij}\mathbf v_j=\frac1{Z_i}\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j=\frac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}.$$

**Convex combination.** Now let $\mathrm{sim}$ be any positive function and set $w_j=\mathrm{sim}(\mathbf q_i,\mathbf k_j)/Z_i$. Then $w_j>0$ and $\sum_jw_j=Z_i/Z_i=1$, so $\hat{\mathbf v}_i=\sum_jw_j\mathbf v_j$ is a convex combination. By the triangle inequality
$$\lVert\hat{\mathbf v}_i\rVert\le\sum_jw_j\lVert\mathbf v_j\rVert\le\Big(\max_j\lVert\mathbf v_j\rVert\Big)\sum_jw_j=\max_j\lVert\mathbf v_j\rVert.$$`,
    note: R`In this formula the only thing special about softmax attention is that $\mathrm{sim}$ is the exponential. The output staying inside the convex hull of the values holds for any positive similarity, so the property survives when the next proof replaces $\mathrm{sim}$ with a kernel.` },
  'ch22-linattn': { title: 'Reordering linear attention and its O(N) cost',
    stmt: R`If $\phi:\mathbb R^D\to\mathbb R^r$ has positive components and $\mathrm{sim}(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)$, then with $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T\in\mathbb R^{r\times d_v}$ and $Z=\sum_j\phi(\mathbf k_j)\in\mathbb R^r$ we have $\tilde{\mathbf v}_i=\dfrac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}=\dfrac{S^T\phi(\mathbf q_i)}{\phi(\mathbf q_i)^TZ}$, and the outputs for all $i$ can be computed in $O(Nrd_v)$ time without an $N\times N$ matrix. $\phi(x)=\mathrm{ELU}(x)+1$ is a map with positive components.`,
    body: R`
**Preparation.** Applying $\phi(x)=\mathrm{ELU}(x)+1$ componentwise gives $x+1\ge1$ for $x\ge0$ and $e^x>0$ for $x<0$, so every component is positive. Then $\mathrm{sim}(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)=\sum_l\phi(\mathbf q)_l\phi(\mathbf k)_l>0$, and the weights are positive.

**Numerator.** Writing the output as a row vector, since $\phi(\mathbf q_i)^T\phi(\mathbf k_j)$ is a scalar and matrix multiplication is associative,
$$\sum_j\big(\phi(\mathbf q_i)^T\phi(\mathbf k_j)\big)\mathbf v_j^T=\sum_j\phi(\mathbf q_i)^T\big(\phi(\mathbf k_j)\mathbf v_j^T\big)=\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)\mathbf v_j^T=\phi(\mathbf q_i)^TS.$$
The last equality holds because $\phi(\mathbf q_i)^T$ does not depend on $j$ and comes out of the sum.

**Denominator.** In the same way $\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)=\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)=\phi(\mathbf q_i)^TZ$. Dividing and transposing gives $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$.

**Cost.** $S$ is the sum of $N$ outer products $\phi(\mathbf k_j)\mathbf v_j^T$ of size $r\times d_v$ ($rd_v$ multiplications each), so $Nrd_v$; $Z$ takes $Nr$ additions. Per query, $S^T\phi(\mathbf q_i)$ takes $rd_v$ and $\phi(\mathbf q_i)^TZ$ takes $r$, so $N$ queries take $N(rd_v+r)$. The total is $O(Nrd_v)$, and the only intermediate results stored are $S$ and $Z$ ($rd_v+r$ numbers). In softmax attention $\exp$ acts entry by entry, so $\exp(QK^T)$ cannot be split like this; $QK^T$ must be formed first, at a cost of $N^2D$ and then $N^2d_v$.`,
    note: R`The key is the associativity of matrix products, $(\phi(Q)\phi(K)^T)V=\phi(Q)(\phi(K)^TV)$. The left order passes through an $N\times N$ matrix, the right order through an $r\times d_v$ one. With the softmax only the left order is available, because $\exp$ blocks the factorization.` },
  'ch22-lowrank': { title: 'The linear attention matrix has rank at most r',
    stmt: R`The attention matrix of linear attention, $\tilde A_{ij}=\phi(\mathbf q_i)^T\phi(\mathbf k_j)/\phi(\mathbf q_i)^TZ$, can be written as $\tilde A=D^{-1}\phi(Q)\phi(K)^T$ ($D=\diag(\phi(Q)Z)$), and $\mathrm{rank}\,\tilde A\le r$. By contrast, the matrix of softmax attention can have rank $N$.`,
    body: R`
**As matrices.** Let $\phi(Q)\in\mathbb R^{N\times r}$ be the matrix whose $i$th row is $\phi(\mathbf q_i)^T$, and $\phi(K)$ likewise; then $(\phi(Q)\phi(K)^T)_{ij}=\phi(\mathbf q_i)^T\phi(\mathbf k_j)$. Row $i$ sums to $\phi(\mathbf q_i)^TZ>0$, so $D=\diag(\phi(\mathbf q_1)^TZ,\dots,\phi(\mathbf q_N)^TZ)$ is invertible and $\tilde A=D^{-1}\phi(Q)\phi(K)^T$.

**Bounding the rank.** The rank of a product does not exceed the rank of either factor. $\phi(K)^T$ has $r$ rows, so $\mathrm{rank}\,\phi(K)^T\le r$, and hence $\mathrm{rank}(\phi(Q)\phi(K)^T)\le r$. Multiplying by the invertible $D^{-1}$ leaves the rank unchanged, so $\mathrm{rank}\,\tilde A\le r$.

**Comparison with the softmax.** In the softmax $A=D_s^{-1}\exp(QK^T/\sqrt D)$, $\exp$ acts entry by entry, so even if $QK^T$ has rank at most $D$, the rank of $\exp(QK^T/\sqrt D)$ is not limited. For example, with $D=1$ and $q_i=k_i=t\,i$ ($i=1,\dots,N$), $\exp(q_ik_j)=e^{t^2ij}=x_i^{\,j}$ (with distinct $x_i=e^{t^2i}$) forms a Vandermonde matrix of rank $N$. A rank-$1$ $QK^T$ has produced a rank-$N$ attention matrix.`,
    note: R`The notes' $\hat V=AV\approx(\mathbf a\mathbf b^T)V$ refers to this rank limit. If $r<N$, linear attention cannot imitate every pattern softmax attention can produce (for instance a sharp diagonal matrix). It trades expressiveness for speed.` },
  'ch22-normgroup': { title: 'The groups of three normalizations: mean 0, variance 1, and batch dependence',
    stmt: R`If a normalization uses $\mu=\frac1n\sum x_k$ and $\sigma^2=\frac1n\sum(x_k-\mu)^2>0$ of a group $G=\{x_1,\dots,x_n\}$ to form $y_k=(x_k-\mu)/\sigma$ ($\varepsilon=0$, $\gamma=1$, $\beta=0$), then within the group the mean of $y$ is $0$ and its variance $1$. The group of BN (all samples and positions of one channel) spans several samples, so one sample's output depends on the other samples; the group of LN (one sample or one token) does not. The Transformer LN of a two-feature token $(u,v)$, $u\ne v$, is $\pm(1,-1)$.`,
    body: R`
**Mean and variance.** $\frac1n\sum_ky_k=\frac1\sigma\big(\frac1n\sum_kx_k-\mu\big)=0$ and $\frac1n\sum_ky_k^2=\frac1{\sigma^2}\cdot\frac1n\sum_k(x_k-\mu)^2=\frac{\sigma^2}{\sigma^2}=1$. This holds however the group is chosen, so BN, the CNN LN, and the Transformer LN all give mean $0$ and variance $1$ within their own groups.

**Batch dependence.** In BN the value $x_{b,c,h,w}$ of sample $b$, channel $c$ is normalized with $\mu_c$, $\sigma_c$ of the group $\{x_{b',c,h',w'}\}$, which contains values of other samples $b'\ne b$. So changing a single $x_{b',c,h',w'}$ changes $\mu_c$ and therefore the output of sample $b$ (as long as the variance is nonzero). The group of LN is $\{x_{b,c',h',w'}\}$ (CNN) or $\{x_{b,c',h,w}\}_{c'}$ (one token), with the index $b$ fixed, so no other sample enters.

**A two-feature token.** For $(u,v)$, $\mu=\frac{u+v}2$, the deviations are $\frac{u-v}2$ and $\frac{v-u}2$, $\sigma^2=\frac{(u-v)^2}4$, and $\sigma=\frac{\lvert u-v\rvert}2$. The result is therefore $\big(\frac{u-v}{\lvert u-v\rvert},\frac{v-u}{\lvert u-v\rvert}\big)$: $(-1,1)$ if $u<v$ and $(1,-1)$ if $u>v$. The token $(1,5)$ of the notes becoming $(-1,1)$ is this case.`,
    note: R`With only two features LN keeps just which value is larger and erases all size information. Real Transformers have hundreds of features, so this does not happen, but it remains true that normalization keeps only the relative position within the group. That is why the learned $\gamma$ and $\beta$ leave room to restore the scale.` },
  'ch22-vitshape': { title: 'Token count, parameters, and per-layer shapes of ViT',
    stmt: R`For a ViT with an $H\times W\times C$ image, patch size $P$ ($P\mid H$, $P\mid W$), and dimension $D$, there are $N+1$ tokens ($N=HW/P^2$), $\mathbf z_0\in\mathbb R^{(N+1)\times D}$, and $E$ and $E_{pos}$ have $P^2CD$ and $(N+1)D$ parameters. Equations (2)–(3) keep the shape, so every $\mathbf z_\ell\in\mathbb R^{(N+1)\times D}$. Without the position embedding, shuffling the patches leaves $\mathbf y=\mathrm{LN}(\mathbf z_L^0)$ unchanged.`,
    body: R`
**Tokens and equation (1).** There are $H/P$ patches along the height and $W/P$ along the width, so $N=HW/P^2$. One patch is $P\times P\times C$, so flattened it is $\mathbf x_p^i\in\mathbb R^{1\times P^2C}$, and multiplied by $E\in\mathbb R^{(P^2C)\times D}$ it is $1\times D$. Stacked under $\mathbf x_{class}\in\mathbb R^{1\times D}$ these form $(N+1)\times D$, and adding $E_{pos}$ of the same shape gives $\mathbf z_0\in\mathbb R^{(N+1)\times D}$. The parameters are $P^2CD$ for $E$, $(N+1)D$ for $E_{pos}$, and $D$ for the class token.

**Equations (2)–(3) keep the shape.** Suppose $\mathbf z_{\ell-1}\in\mathbb R^{(N+1)\times D}$. LN normalizes each row (token) and keeps the shape, and MSA outputs $D$ dimensions per token, so $\mathrm{MSA}(\mathrm{LN}(\mathbf z_{\ell-1}))\in\mathbb R^{(N+1)\times D}$. The shapes match, so the residual addition is defined and $\mathbf z'_\ell\in\mathbb R^{(N+1)\times D}$. The MLP is also $D\to D$ per token, so by the same argument $\mathbf z_\ell\in\mathbb R^{(N+1)\times D}$. Induction starting from $\mathbf z_0$ gives the same shape at every layer.

**Without the position embedding.** Let $\Pi$ be a permutation matrix that fixes the class token and shuffles only the patches (the first row and first column of $\Pi$ are $\mathbf e_1$). LN and the MLP apply the same function to each row, so they commute with $\Pi$, and self-attention is permutation-equivariant, $\mathrm{MSA}(\Pi\mathbf z)=\Pi\,\mathrm{MSA}(\mathbf z)$[[ch21:21.5|Permutation equivariance of self-attention.]]. The residual additions commute too, so from the input $\Pi\mathbf z_0$ we get $\Pi\mathbf z_L$, and its first row $\mathbf z_L^0$ is unchanged because $\Pi$ fixes the first row.`,
    note: R`Once $E_{pos}$ is added, shuffling the patches does not shuffle the position embeddings, so the new input is no longer of the form $\Pi\mathbf z_0$; the argument breaks and the model can tell the arrangement of the patches apart. In the parameter count, $E$ does not depend on the image size while $E_{pos}$ grows with $N$, so fine-tuning at a different resolution only requires interpolating $E_{pos}$.` },
  'ch22-gelu': { title: 'The derivative, symmetry relation, limits, and negative dip of GELU',
    stmt: R`For $\mathrm{GELU}(x)=x\Phi(x)$: (1) $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$ and $\mathrm{GELU}'(0)=\frac12$; (2) $\mathrm{GELU}(x)-\mathrm{GELU}(-x)=x$; (3) $\mathrm{GELU}(x)-x\to0$ as $x\to\infty$ and $\mathrm{GELU}(x)\to0$ as $x\to-\infty$; (4) there is a local minimum in $(-1,-\frac12)$.`,
    body: R`
**(1) The derivative.** $\Phi'(x)=\varphi(x)=\frac1{\sqrt{2\pi}}e^{-x^2/2}$, so the product rule gives $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$. At $x=0$ this is $\Phi(0)=\frac12$.

**(2) The symmetry relation.** The standard normal is symmetric about $0$, so $\Phi(-x)=P(X\le-x)=P(X\ge x)=1-\Phi(x)$. Hence $\mathrm{GELU}(-x)=-x\Phi(-x)=-x+x\Phi(x)=-x+\mathrm{GELU}(x)$.

**(3) Limits.** For $x>0$ use the tail bound $1-\Phi(x)=\int_x^\infty\varphi(t)\,dt\le\int_x^\infty\frac tx\varphi(t)\,dt=\frac{\varphi(x)}x$ ($t/x\ge1$ for $t\ge x$, and $-\varphi(t)$ is an antiderivative of $t\varphi(t)$). Then $\lvert\mathrm{GELU}(x)-x\rvert=x(1-\Phi(x))\le\varphi(x)\to0$. As $x\to-\infty$, $\lvert x\Phi(x)\rvert=\lvert x\rvert\big(1-\Phi(\lvert x\rvert)\big)\le\varphi(x)\to0$.

**(4) The negative dip.** With $\Phi(-1)\approx0.1587$ and $\varphi(1)\approx0.2420$, $\mathrm{GELU}'(-1)=\Phi(-1)-\varphi(-1)\approx-0.0833<0$; with $\Phi(-\frac12)\approx0.3085$ and $\varphi(\frac12)\approx0.3521$, $\mathrm{GELU}'(-\frac12)\approx0.3085-0.1760=0.1325>0$. $\mathrm{GELU}'$ is continuous, so by the intermediate value theorem it vanishes somewhere in between, and since its sign changes from $-$ to $+$ that point is a local minimum. Solving numerically gives $x\approx-0.752$ and $\mathrm{GELU}\approx-0.170$.`,
    note: R`(2) shows that GELU is a smoothed correction of ReLU. ReLU also satisfies $\mathrm{ReLU}(x)-\mathrm{ReLU}(-x)=x$, and GELU keeps this relation while removing the kink. The price is losing monotonicity on the negative side, which creates the small dip.` },
  'ch22-matcost': { title: 'The cost of a matrix product and of one self-attention layer',
    stmt: R`The product of $A\in\mathbb R^{m\times k}$ and $B\in\mathbb R^{k\times n}$ takes $mnk$ multiplications and $mn(k-1)$ additions. One self-attention layer with $N$ tokens of dimension $C$ (with $Q$, $K$, $V$, and the output projection all $C\times C$) takes $4NC^2+2N^2C$ multiplications, and the same number when split into $h$ heads.`,
    body: R`
**Matrix product.** The entry $Y_{ij}=\sum_{l=1}^kA_{il}B_{lj}$ of $Y=AB$ adds up $k$ products $A_{il}B_{lj}$, so it takes $k$ multiplications and $k-1$ additions. There are $m\cdot n$ pairs $(i,j)$, so $mnk$ multiplications and $mn(k-1)$ additions, that is, $O(mnk)$.

**Projections.** With $X\in\mathbb R^{N\times C}$ and $W_Q\in\mathbb R^{C\times C}$, $Q=XW_Q$ has $m=N$, $k=C$, $n=C$, so $NC^2$. $K$ and $V$ are the same, $3NC^2$, and $W_O$, applied to the concatenated heads, is also $NC^2$, so the projections total $4NC^2$.

**Attention.** $QK^T$ is $(N\times C)(C\times N)$ with $m=N$, $k=C$, $n=N$, so $N^2C$. $A=\mathrm{softmax}(QK^T/\sqrt C)$ is an entrywise operation, $O(N^2)$, and $AV$ is $(N\times N)(N\times C)$ with $m=N$, $k=N$, $n=C$, so $N^2C$. Altogether $4NC^2+2N^2C$ plus an $O(N^2)$, which does not affect the order since $O(N^2)\le O(N^2C)$ for $C\ge1$.

**Splitting into heads.** If each of $h$ heads uses $C/h$ dimensions, then per head $Q_hK_h^T$ is $(N\times\frac Ch)(\frac Ch\times N)$, so $N^2C/h$, and $A_hV_h$ is $(N\times N)(N\times\frac Ch)$, so $N^2C/h$. Adding $h$ of them gives $2N^2C$ unchanged, and the projections only split the columns of the $C\times C$ matrices among the heads, so they stay $4NC^2$.`,
    note: R`The ratio of the two terms is $\frac{2N^2C}{4NC^2}=\frac N{2C}$, so attention dominates the cost once the number of tokens exceeds twice the feature dimension. For sentences (hundreds of tokens, $C$ in the hundreds) the two terms are similar, but on a $56\times56$ image grid ($N=3136$, $C=96$) the attention term is about $16$ times larger. Window attention in the next proof cuts this term.` },
  'ch22-wmsa': { title: 'The cost of window attention, 4NC²+2NM²C',
    stmt: R`If a feature map of $N=hw$ tokens of dimension $C$ is split into $M\times M$ windows ($M\mid h$, $M\mid w$) and self-attention runs only inside each window, the number of multiplications is $4NC^2+2NM^2C$. With $M$ and $C$ fixed it is $O(N)$, and the ratio of the attention terms against global attention is $N/M^2$.`,
    body: R`
**Number of windows.** There are $h/M$ windows along the height and $w/M$ along the width, $\frac hM\cdot\frac wM=\frac N{M^2}$ in all, with $M^2$ tokens per window.

**Attention in one window.** The token matrix of a window is $M^2\times C$, so $Q_wK_w^T$ is $(M^2\times C)(C\times M^2)$, $(M^2)^2C=M^4C$ multiplications, and $A_wV_w$ is $(M^2\times M^2)(M^2\times C)$, $M^4C$. One window takes $2M^4C$.

**Adding up.** With $N/M^2$ windows the attention takes $\frac N{M^2}\cdot2M^4C=2NM^2C$. The projections $W_Q,W_K,W_V,W_O$ multiply every token by the same matrix, so splitting into windows leaves them at $4NC^2$. The total is $4NC^2+2NM^2C=N(4C^2+2M^2C)$, and the bracket does not depend on $N$, so with $M$ and $C$ fixed it is $O(N)$.

**The ratio.** The attention term of global attention is $2N^2C$, so the ratio is $\frac{2N^2C}{2NM^2C}=\frac N{M^2}$. In the notes' case $h=w=56$, $M=7$, we have $N=3136$ and $64$ windows, so the ratio is $64$; with $C=96$ the global $2{,}003{,}828{,}736$ multiplications drop to $145{,}108{,}992$ for windows, about $13.8$ times fewer.`,
    note: R`The price is that no information passes between windows. Swin alternates layers whose windows are shifted by $\lfloor M/2\rfloor$ (shifted windows) to mix neighboring windows, and each such layer still costs the same $4NC^2+2NM^2C$ (slides 28–29, advanced).` },
  });
})();
