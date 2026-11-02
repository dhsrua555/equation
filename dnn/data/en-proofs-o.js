/* English text — proofs for Unit 21: Attention & Transformers, W10 Mon slides 35–80
   (dependency distance, soft attention, the sqrt D scaling, shape and cost, permutation equivariance, positional encoding, masks, multi-head, the encoder block, layer normalization). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 21
  'ch21-condist': { title: 'Dependency Distance in Image Conditioning: First Word versus Shortcut',
    stmt: R`In a vanilla RNN $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+\mathbf b)$, if the image feature $\mathbf v$ is fed only as the first input ($\mathbf h_0=\tanh(W_v\mathbf v+\mathbf b)$), then $\big\lVert\frac{\partial\mathbf h_t}{\partial\mathbf v}\big\rVert\le\lVert W_h\rVert^t\lVert W_v\rVert$. In the shortcut that adds $W_z\mathbf v$ at every step, $\frac{\partial\mathbf h_t}{\partial\mathbf v}$ has a direct term $D_tW_z$ of size $\le\lVert W_z\rVert$ independent of $t$.`,
    body: R`
**Preparation.** Let $D_s=\diag(1-\mathbf h_s^2)$. Since $0<1-h_{s,j}^2\le1$ we have $\lVert D_s\rVert\le1$, and the chain rule for $\mathbf h_s=\tanh(W_h\mathbf h_{s-1}+\cdots)$ gives $\partial\mathbf h_s/\partial\mathbf h_{s-1}=D_sW_h$[[ch19:19.6|Products of Jacobians and vanishing gradients.]].

**The first-word method.** $\mathbf v$ enters only through $\mathbf h_0$. We have $\partial\mathbf h_0/\partial\mathbf v=D_0W_v$, and by the chain rule
$$\frac{\partial\mathbf h_t}{\partial\mathbf v}=D_tW_h\,D_{t-1}W_h\cdots D_1W_h\,D_0W_v.$$
The norm product inequality $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$ and $\lVert D_s\rVert\le1$ give $\le\lVert W_h\rVert^t\lVert W_v\rVert$. If $\lVert W_h\rVert<1$ this shrinks exponentially as $t$ grows and the image's influence disappears.

**The shortcut method.** In $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+W_z\mathbf v+\mathbf b)$, $\mathbf v$ enters directly at every step. Differentiating $\mathbf h_t$ directly with respect to $\mathbf v$ (holding the previous state fixed) gives $D_tW_z$, with $\lVert D_tW_z\rVert\le\lVert W_z\rVert$, independent of $t$. The total derivative is this term plus the distant paths of the first-word method (those through $\mathbf h_{t-1}$ and so on).`,
    note: R`The “dependency distance $1$” of slide 41 is this direct term. However, if the learned $W_z$ is small the model can ignore the image, and attention (21.2) remedies this by feeding in not $\mathbf v$ but a summary $\mathbf z^{(t)}$ made anew for each word.` },
  'ch21-softgrad': { title: 'Soft Attention: Convex Combination, Expectation, and the Gradient with Respect to the Scores',
    stmt: R`For $\alpha=\mathrm{softmax}(e)$ and $\mathbf z=\sum_i\alpha_i\mathbf x_i$: (1) $\lVert\mathbf z\rVert\le\max_i\lVert\mathbf x_i\rVert$, (2) if $s\sim\mathrm{Categorical}(\alpha)$ then $\mathbb E[\mathbf x_s]=\mathbf z$, (3) $\dfrac{\partial\alpha_i}{\partial e_m}=\alpha_i(\delta_{im}-\alpha_m)$ and $\dfrac{\partial\mathbf z}{\partial e_m}=\alpha_m(\mathbf x_m-\mathbf z)$.`,
    body: R`
**(1) Convex combination.** Since $\alpha_i>0$ and $\sum_i\alpha_i=1$, the triangle inequality gives $\lVert\mathbf z\rVert\le\sum_i\alpha_i\lVert\mathbf x_i\rVert\le\max_i\lVert\mathbf x_i\rVert\sum_i\alpha_i=\max_i\lVert\mathbf x_i\rVert$. That is, $\mathbf z$ lies in the convex hull of the $\mathbf x_i$.

**(2) The expectation of hard attention.** Since $P(s=i)=\alpha_i$, $\mathbb E[\mathbf x_s]=\sum_iP(s=i)\mathbf x_i=\sum_i\alpha_i\mathbf x_i=\mathbf z$. Soft attention is the average of the choices of hard attention.

**(3) The gradient with respect to the scores.** From $\alpha_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$, and $\partial Z/\partial e_m=e^{e_m}$,
$$\frac{\partial\alpha_i}{\partial e_m}=\frac{\delta_{im}e^{e_i}}{Z}-\frac{e^{e_i}e^{e_m}}{Z^2}=\alpha_i(\delta_{im}-\alpha_m).$$
Hence
$$\frac{\partial\mathbf z}{\partial e_m}=\sum_i\frac{\partial\alpha_i}{\partial e_m}\mathbf x_i=\alpha_m\mathbf x_m-\alpha_m\sum_i\alpha_i\mathbf x_i=\alpha_m(\mathbf x_m-\mathbf z).$$`,
    note: R`Raising the score $e_m$ moves $\mathbf z$ from the current average toward $\mathbf x_m$, at a speed proportional to the current weight $\alpha_m$. A cell with $\alpha_m\approx0$ hardly reacts even when its score changes. Hard attention cannot use such a gradient because the operation of drawing $s$ is not differentiable.` },
  'ch21-scaling': { title: R`Why Divide by $\sqrt D$: the Variance of the Dot Product and Softmax Saturation`,
    stmt: R`If the components of $\mathbf q,\mathbf k\in\mathbb R^D$ are all independent with mean $0$ and variance $1$, then $\mathbb E[\mathbf q\cdot\mathbf k]=0$, $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$, and $\mathrm{Var}(\mathbf q\cdot\mathbf k/\sqrt D)=1$. Also the Jacobian of $\mathbf a=\mathrm{softmax}(\mathbf e)$ is $\partial a_i/\partial e_m=a_i(\delta_{im}-a_m)$, and if $\max_ia_i\ge1-\varepsilon$ every entry has absolute value at most $\varepsilon$.`,
    body: R`
**Mean.** Since $q_l$ and $k_l$ are independent, $\mathbb E[q_lk_l]=\mathbb E[q_l]\,\mathbb E[k_l]=0$, and $\mathbb E[\mathbf q\cdot\mathbf k]=0$.

**Variance.** Since the means are $0$, $\mathrm{Var}(q_lk_l)=\mathbb E[q_l^2k_l^2]=\mathbb E[q_l^2]\mathbb E[k_l^2]=1\cdot1=1$. The terms $q_lk_l$ for different $l$ are independent, so the variances add and $\mathrm{Var}(\mathbf q\cdot\mathbf k)=\sum_{l=1}^D1=D$. Multiplying by the constant $1/\sqrt D$ multiplies the variance by $1/D$, so $\mathrm{Var}(\mathbf q\cdot\mathbf k/\sqrt D)=1$.

**The Jacobian of the softmax.** From $a_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$, we get $\frac{\partial a_i}{\partial e_m}=\frac{\delta_{im}e^{e_i}}{Z}-\frac{e^{e_i}e^{e_m}}{Z^2}=a_i(\delta_{im}-a_m)$[[ch06:6.3|The gradient of the softmax.]].

**Saturation.** Take $i^*$ with $a_{i^*}\ge1-\varepsilon$; the sum of the other entries is $\le\varepsilon$. The diagonal entry $a_i(1-a_i)$ is $\le1-a_{i^*}\le\varepsilon$ for $i=i^*$ and $\le a_i\le\varepsilon$ for $i\ne i^*$. The size $a_ia_m$ of an off-diagonal entry ($i\ne m$) is $\le\varepsilon$ because at least one of the two is not $i^*$. So in a saturated softmax every gradient is at most $\varepsilon$.

**Conclusion.** If the dot product has variance $D$, the standard deviation of the scores grows like $\sqrt D$ and the gaps between scores are large; the softmax saturates and the gradient above is nearly $0$. Dividing by $\sqrt D$ makes the variance $1$, independent of $D$.`,
    note: R`The assumption that the components of $\mathbf q,\mathbf k$ are independent with mean $0$ and variance $1$ is a rough picture right after initialization. It does not hold as training proceeds, but dividing by $\sqrt D$ is the starting point for keeping the size of the scores independent of $D$.` },
  'ch21-shapecost': { title: 'Shapes, Parameters, and Cost of Self-Attention',
    stmt: R`For self-attention $Y=\mathrm{softmax}(QK^T/\sqrt{D_k})V$ with $X\in\mathbb R^{N\times D}$, $W_q,W_k\in\mathbb R^{D\times D_k}$, $W_v\in\mathbb R^{D\times D_v}$: $Y\in\mathbb R^{N\times D_v}$, the number of parameters is $D(2D_k+D_v)$, the number of multiplications is $ND(2D_k+D_v)+N^2(D_k+D_v)$, and the memory of the attention matrix is $N^2$. For $D_k=D_v=d$ the attention part is $O(N^2d)$.`,
    body: R`
**Shapes.** $Q=XW_q$, $K=XW_k\in\mathbb R^{N\times D_k}$, $V=XW_v\in\mathbb R^{N\times D_v}$. $QK^T\in\mathbb R^{N\times N}$, and the row-wise softmax does not change the shape, so $A\in\mathbb R^{N\times N}$ and $Y=AV\in\mathbb R^{N\times D_v}$.

**Parameters.** The three projection matrices have $DD_k+DD_k+DD_v=D(2D_k+D_v)$ entries (without biases). They do not depend on the sequence length $N$.

**Multiplications.** A projection is a product of $N\times D$ and $D\times D_\bullet$, so $ND(2D_k+D_v)$; $QK^T$ computes $N^2$ entries as dot products of length $D_k$, so $N^2D_k$; $AV$ is a product of $N\times N$ and $N\times D_v$, so $N^2D_v$; and the softmax is $O(N^2)$. The sum is $ND(2D_k+D_v)+N^2(D_k+D_v)+O(N^2)$.

**Memory and the dominant term.** The $N^2$ entries of $A$ are stored. For $D_k=D_v=d$ the attention part is $2N^2d$ and the projections are $3NDd$. For $N\gg D$ the term $N^2d$ dominates, and for $N\ll D$ the term $NDd$ does.`,
    note: R`The cost and memory that are quadratic in the length $N$ are the bottleneck when handling long documents. An RNN costs $O(Nd^2)$ but must compute the $N$ steps sequentially.` },
  'ch21-permequiv': { title: 'Permutation Equivariance of Self-Attention',
    stmt: R`For $\mathrm{Attn}(X)=\mathrm{softmax}\big(XW_q(XW_k)^T/\sqrt{D_k}\big)XW_v$ (row-wise softmax) and any permutation matrix $P$, $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$. Also, if the key and value rows are permuted by the same permutation with the queries fixed, the output of cross-attention does not change.`,
    body: R`
**Substitution.** Let $Q=XW_q$, $K=XW_k$, $V=XW_v$. For $PX$ we get $Q'=PQ$, $K'=PK$, $V'=PV$, and a permutation matrix satisfies $P^TP=I$.

**Scores.** $E'=\dfrac{Q'K'^T}{\sqrt{D_k}}=\dfrac{PQK^TP^T}{\sqrt{D_k}}=PEP^T$.

**Softmax.** The row-wise softmax $\sigma$ permutes along when the entries within a row are permuted, so $\sigma(EP^T)=\sigma(E)P^T$, and a $P$ that exchanges rows commutes with row-wise operations, $\sigma(PF)=P\sigma(F)$. Hence $A'=\sigma(PEP^T)=P\,\sigma(E)\,P^T=PAP^T$.

**Output.** $Y'=A'V'=PAP^T\,PV=PA(P^TP)V=PAV=PY$. ∎

**Cross-attention.** Fix the query $Q$ and set $K'=PK$, $V'=PV$. Then $E'=QK^TP^T/\sqrt{D_k}=EP^T$, $A'=AP^T$, $Y'=AP^TPV=AV=Y$. It is invariant to the order of the key–value pairs and equivariant to the order of the queries.`,
    note: R`Being equivariant, it cannot tell “who comes first and who comes later”. For data in which order carries meaning, the order must be told by a positional encoding (Section 21.6).` },
  'ch21-posrot': { title: 'Relative Position and Rotation Matrices in the Sinusoidal Positional Encoding',
    stmt: R`For $\mathbf p(t)=(\sin\omega_kt,\cos\omega_kt)_{k=1}^{d/2}$: (1) there is an orthogonal matrix $R(\Delta)$, independent of $t$, with $\mathbf p(t+\Delta)=R(\Delta)\mathbf p(t)$; (2) $\mathbf p(t)\cdot\mathbf p(t+\Delta)=\sum_k\cos(\omega_k\Delta)$; (3) $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$.`,
    body: R`
**(1) Rotation.** By the addition formulas $\sin(a+b)=\sin a\cos b+\cos a\sin b$ and $\cos(a+b)=\cos a\cos b-\sin a\sin b$, for one pair
$$\begin{pmatrix}\sin\omega(t+\Delta)\\\cos\omega(t+\Delta)\end{pmatrix}=\begin{pmatrix}\cos\omega\Delta&\sin\omega\Delta\\-\sin\omega\Delta&\cos\omega\Delta\end{pmatrix}\begin{pmatrix}\sin\omega t\\\cos\omega t\end{pmatrix}.$$
$R(\Delta)$ is the matrix that places the $2\times2$ rotation by the angle $\omega_k\Delta$ on the block diagonal for $k=1,\dots,d/2$, and it contains no $t$. Each block is a rotation, so $R^TR=I$.

**(2) Inner product.** For one pair, $\sin\omega t\sin\omega(t+\Delta)+\cos\omega t\cos\omega(t+\Delta)=\cos(\omega(t+\Delta)-\omega t)=\cos\omega\Delta$ (the cosine difference formula). Adding all pairs gives $\sum_k\cos(\omega_k\Delta)$, which depends on the distance $\Delta$ and not on $t$.

**(3) Concatenating and adding.** Splitting $W$ into upper and lower blocks $W_1,W_2$ gives $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$. A linear map after concatenation equals adding a linear transform of the position code by $W_2$, so slide 69 (concatenating) and slide 77 (adding) have the same expressive power.`,
    note: R`Because $R(\Delta)$ does not depend on $t$, the model can read a move from position $t$ to $t+\Delta$ as always the same linear map. Also $\mathbf p(t)\cdot\mathbf p(t)=d/2$, so all positions have the same magnitude.` },
  'ch21-maskrows': { title: 'Masked Attention: Zero Weights on the Future, Rows Summing to 1, Output Depending Only on the Past',
    stmt: R`If $A=\mathrm{softmax}(S+M)$ (row-wise) and $M_{ji}=0$ ($i\le j$), $-\infty$ ($i>j$), then (1) $A_{ji}=0$ for $i>j$, (2) each row sums to $1$, and (3) $\mathbf y_j=\sum_iA_{ji}\mathbf v_i$ depends only on $\mathbf x_1,\dots,\mathbf x_j$.`,
    body: R`
The softmax of row $j$ is $A_{ji}=\dfrac{\exp(S_{ji}+M_{ji})}{\sum_l\exp(S_{jl}+M_{jl})}$.

**(1) The future is 0.** For $i>j$, $M_{ji}=-\infty$ and $e^{-\infty}=0$, so the numerator is $0$ and $A_{ji}=0$. Hence $A$ is lower triangular.

**(2) Row sums.** Only the terms with $i\le j$ remain in the denominator, $Z_j=\sum_{l\le j}e^{S_{jl}}$. The term $l=j$ is finite and positive, so $0<Z_j<\infty$ and the denominator is well defined, and $\sum_iA_{ji}=\sum_{i\le j}e^{S_{ji}}/Z_j=1$. Allowing the diagonal is what prevents the denominator from becoming $0$.

**(3) Dependence on the past only.** By (1), $\mathbf y_j=\sum_{i\le j}A_{ji}\mathbf v_i$, and $A_{ji}$ ($i\le j$) is determined only by $S_{ji}=\mathbf q_j\cdot\mathbf k_i/\sqrt{D_k}$ ($i\le j$). Since $\mathbf q_j$ is a function of $\mathbf x_j$ and $\mathbf k_i,\mathbf v_i$ of $\mathbf x_i$, $\mathbf y_j$ is a function of $\mathbf x_1,\dots,\mathbf x_j$. Changing a future $\mathbf x_m$ ($m>j$) does not change $\mathbf y_j$.`,
    note: R`Thanks to this property, we can feed the whole true sentence at once and compute the next-word prediction loss of all slots in parallel (teacher forcing). At inference, generating one slot at a time gives the same values.` },
  'ch21-mhaparams': { title: 'Parameters and Cost of Multi-Head Attention',
    stmt: R`For $\mathrm{MHA}(X)=[\mathrm{head}_1,\dots,\mathrm{head}_h]W_o$ with $D_k=D_v=D/h$, the number of parameters is $4D^2$ (without biases), the sum $2N^2D$ of the per-head multiplications $2N^2D/h$ is independent of $h$, and the attention matrices number $h$, so $hN^2$ in total.`,
    body: R`
**Parameters.** One head has $W_q^a,W_k^a,W_v^a\in\mathbb R^{D\times D/h}$, which is $3D\cdot D/h$, and $h$ heads give $3D^2$. The Concat has size $N\times hD_v=N\times D$, so $W_o\in\mathbb R^{D\times D}$ has $D^2$. The total is $4D^2$.

**Cost.** $QK^T$ and $AV$ of one head each take $N^2\cdot D/h$ multiplications, so $2N^2D/h$, and $h$ heads give $2N^2D$, independent of $h$. The projections ($3ND^2$) and $W_o$ ($ND^2$) are also independent of $h$.

**Attention matrices.** There is one $N\times N$ matrix per head, so $hN^2$ are stored.

**Comparison with a single head.** For $h=1$, $D_k=D_v=D$, and both the parameters ($4D^2$) and the multiplications are the same. Multi-head learns $h$ softmax patterns in different subspaces at the same time at the same cost.`,
    note: R`Setting $D_k=D/h$ is the choice that keeps the cost equal. If each head had $D_k=D$, the parameters and the cost would be $h$ times larger.` },
  'ch21-encblock': { title: 'Parameters and Permutation Equivariance of the Encoder Block',
    stmt: R`The parameters of an encoder block $T$, excluding biases and normalization, are $4d^2+2d\,d_{ff}$ (which is $12d^2$ when $d_{ff}=4d$). Without positional encoding, $T(PX)=P\,T(X)$, and an encoder with $N$ blocks stacked is also permutation equivariant.`,
    body: R`
**Parameters.** Multi-head attention has $4d^2$ (the proof of Section 21.7). FF has $W_1\in\mathbb R^{d_{ff}\times d}$ and $W_2\in\mathbb R^{d\times d_{ff}}$, so $2d\,d_{ff}$. The $\gamma,\beta$ of LayerNorm and the biases are $O(d+d_{ff})$ and are left out as small. For $d_{ff}=4d$ this is $4d^2+8d^2=12d^2$.

**Equivariance of the attention part.** For each head $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$, and Concat and $W_o$ are the same linear map on every row and so commute with row permutations. Hence $\mathrm{MHA}(PX)=P\,\mathrm{MHA}(X)$.

**Residual, LN, FF.** $PX+\mathrm{MHA}(PX)=P\big(X+\mathrm{MHA}(X)\big)$. LN and FF apply the same function to each token (row), so $\mathrm{LN}(PZ)=P\,\mathrm{LN}(Z)$ and $\mathrm{FF}(PZ)=P\,\mathrm{FF}(Z)$, and the second residual connection and LN commute for the same reason. Therefore $T(PX)=P\,T(X)$.

**Stacking.** A composition of equivariant functions is equivariant, so $T_N\circ\cdots\circ T_1(PX)=P\,T_N\circ\cdots\circ T_1(X)$.`,
    note: R`If a position code $\mathbf p_j$ is added to the input, $X+\mathbf p$ is no longer equivariant under $P$, and the order of the tokens is reflected in the output. This is why the positional encoding is needed.` },
  'ch21-lnprop': { title: 'Layer Normalization: Mean and Variance, Shift and Scale Invariance',
    stmt: R`For $\mathrm{LN}(\mathbf h)=(\mathbf h-\mu\mathbf 1)/\sigma$ with $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$: (1) the output has mean $0$ and variance $1$, and $\lVert\mathrm{LN}(\mathbf h)\rVert^2=d$; (2) $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$ for $a>0$, $b\in\mathbb R$.`,
    body: R`
**(1) Mean and variance.** Let $\mathbf y=(\mathbf h-\mu\mathbf 1)/\sigma$. Its mean is $\frac1d\sum_jy_j=\frac1\sigma\big(\frac1d\sum_jh_j-\mu\big)=0$. Since the mean is $0$, the variance is $\frac1d\sum_jy_j^2=\frac1{\sigma^2}\cdot\frac1d\sum_j(h_j-\mu)^2=\frac{\sigma^2}{\sigma^2}=1$, and so $\lVert\mathbf y\rVert^2=\sum_jy_j^2=d$.

**(2) Shift and scale invariance.** For $\mathbf h'=a\mathbf h+b\mathbf 1$ we have $\mu'=a\mu+b$ and $h_j'-\mu'=a(h_j-\mu)$, so $\sigma'^2=a^2\sigma^2$, and since $a>0$, $\sigma'=a\sigma$. Therefore
$$\mathrm{LN}(\mathbf h')=\frac{a(\mathbf h-\mu\mathbf 1)}{a\sigma}=\mathrm{LN}(\mathbf h).$$
If $a<0$ then $\sigma'=|a|\sigma$ and the sign flips, giving $-\mathrm{LN}(\mathbf h)$.

**Relation to the batch.** Since $\mu,\sigma$ are computed from the $d$ components of one token only, no other sample of the same batch is used. BN gathers statistics from all samples of the batch for each channel, so it depends on the batch size, and at inference it must substitute the moving average from training[[ch12:12.3|BN uses minibatch statistics.]].`,
    note: R`If $\varepsilon>0$ the properties hold only approximately (the variance is larger by $\varepsilon$), and $\boldsymbol\gamma,\boldsymbol\beta$ make the mean and variance learnable again.` },
  });
})();
