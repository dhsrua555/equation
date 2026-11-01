/* English text — proofs for Unit 20: LSTM and applications of RNNs, W9 Wed slides 18–34 and notes
   (the cell-path gradient, the full Jacobian, the parameter count, the gradient of the language-model loss, greedy decoding). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 20
  'ch20-cellpath': { title: 'The Jacobian of the Cell Path and the Jacobian of the RNN',
    stmt: R`In the LSTM's $c_t=f_t\odot c_{t-1}+i_t\odot g_t$, with the gates $f_t,i_t,g_t$ held fixed, $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)$ and $\frac{\partial c_t}{\partial c_{t-k}}=\diag\big(\prod_{s=t-k+1}^tf_s\big)$. In the vanilla RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$, $\frac{\partial h_t}{\partial h_{t-1}}=\diag(1-h_t^2)W_h$ and $\big\lVert\frac{\partial h_t}{\partial h_{t-k}}\big\rVert\le\lVert W_h\rVert^k$.`,
    body: R`
**The cell path.** In components, $c_{t,j}=f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$. With the gates fixed, the only component of $c_{t-1}$ appearing in $c_{t,j}$ is $c_{t-1,j}$, with coefficient $f_{t,j}$, so $\frac{\partial c_{t,j}}{\partial c_{t-1,l}}=f_{t,j}\delta_{jl}$, that is, $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)$.

**k steps.** Multiplying the Jacobians by the chain rule gives
$$\frac{\partial c_t}{\partial c_{t-k}}=\frac{\partial c_t}{\partial c_{t-1}}\cdots\frac{\partial c_{t-k+1}}{\partial c_{t-k}}=\diag(f_t)\cdots\diag(f_{t-k+1})=\diag\Big(\prod_{s=t-k+1}^tf_s\Big)$$
since a product of diagonal matrices is the diagonal matrix of the products of the diagonal entries.

**One RNN step.** Let $a_t=W_hh_{t-1}+W_xx_t+b$; then $\frac{\partial a_t}{\partial h_{t-1}}=W_h$. Since $h_t=\tanh(a_t)$ acts componentwise, its Jacobian is $\diag(\tanh'(a_t))$, and $\tanh'=1-\tanh^2$ makes it $\diag(1-h_t^2)$. By the chain rule, $\frac{\partial h_t}{\partial h_{t-1}}=\diag(1-h_t^2)W_h$.

**k steps and the bound.** With $D_s=\diag(1-h_s^2)$, $\frac{\partial h_t}{\partial h_{t-k}}=D_tW_hD_{t-1}W_h\cdots D_{t-k+1}W_h$. Since $0<1-h_s^2\le1$, the operator norm of the diagonal matrix $D_s$ is $\max_j|1-h_{s,j}^2|\le1$, and the norm product inequality $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$ gives
$$\Big\lVert\frac{\partial h_t}{\partial h_{t-k}}\Big\rVert\le\prod_{s}\lVert D_s\rVert\lVert W_h\rVert\le\lVert W_h\rVert^k$$
as claimed.`,
    note: R`If $f_s=1$ and $i_s=0$, then $c_t=c_{t-1}$ and the Jacobian of the cell path is exactly $I$. By contrast, the gradient of an RNN with $\lVert W_h\rVert<1$ vanishes exponentially. The full formula, which also accounts for the gates depending on $c_{t-1}$, is in the proof of “the full Jacobian of the cell state”.` },
  'ch20-fulljac': { title: 'The Full Jacobian of the Cell State',
    stmt: R`If $f_t=\sigma(W_fx_t+U_fh_{t-1}+b_f)$, $i_t=\sigma(W_ix_t+U_ih_{t-1}+b_i)$, $g_t=\tanh(W_gx_t+U_gh_{t-1}+b_g)$, and $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$, then $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+E_t$ with $E_t=\big[\diag(c_{t-1})\diag(f_t\odot(1-f_t))U_f+\diag(g_t)\diag(i_t\odot(1-i_t))U_i+\diag(i_t)\diag(1-g_t^2)U_g\big]\diag\big(o_{t-1}\odot(1-\tanh^2(c_{t-1}))\big)$.`,
    body: R`
**The product rule.** Differentiating the $j$-th component $f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$ of $c_t=f_t\odot c_{t-1}+i_t\odot g_t$ with respect to $c_{t-1,l}$ gives
$$\frac{\partial c_{t,j}}{\partial c_{t-1,l}}=f_{t,j}\delta_{jl}+c_{t-1,j}\frac{\partial f_{t,j}}{\partial c_{t-1,l}}+g_{t,j}\frac{\partial i_{t,j}}{\partial c_{t-1,l}}+i_{t,j}\frac{\partial g_{t,j}}{\partial c_{t-1,l}}$$
and in matrix form $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+\diag(c_{t-1})\frac{\partial f_t}{\partial c_{t-1}}+\diag(g_t)\frac{\partial i_t}{\partial c_{t-1}}+\diag(i_t)\frac{\partial g_t}{\partial c_{t-1}}$. The first term is the cell path of the notes.

**Derivatives of the gates.** $f_t$ depends on $c_{t-1}$ only through $h_{t-1}$ ($o_{t-1}$ is a function of $h_{t-2}$ and $x_{t-1}$). Since $\sigma'=\sigma(1-\sigma)$, $\frac{\partial f_t}{\partial h_{t-1}}=\diag(f_t\odot(1-f_t))U_f$, likewise $\frac{\partial i_t}{\partial h_{t-1}}=\diag(i_t\odot(1-i_t))U_i$, and $\tanh'=1-\tanh^2$ gives $\frac{\partial g_t}{\partial h_{t-1}}=\diag(1-g_t^2)U_g$. Also, $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$ gives $\frac{\partial h_{t-1}}{\partial c_{t-1}}=\diag\big(o_{t-1}\odot(1-\tanh^2(c_{t-1}))\big)$.

**Putting it together.** Substituting the chain rule $\frac{\partial f_t}{\partial c_{t-1}}=\frac{\partial f_t}{\partial h_{t-1}}\frac{\partial h_{t-1}}{\partial c_{t-1}}$ and its siblings, and factoring out the common right factor $\frac{\partial h_{t-1}}{\partial c_{t-1}}$, gives the $\diag(f_t)+E_t$ of the statement.

**Several steps.** Expanding $\frac{\partial c_t}{\partial c_{t-k}}=\prod_{s=t-k+1}^{t}\big(\diag(f_s)+E_s\big)$ (later steps on the left), the term choosing $\diag(f_s)$ from every factor, $\diag\big(\prod_sf_s\big)$, stands on its own. Each $E_s$ is an RNN-like path that multiplies by $U_\bullet$ and is shrunk by $\sigma'\le\frac14$, $\tanh'\le1$, $o\le1$, so unless the other terms cancel it exactly, the gradient survives in the components with $f\approx1$. This is the same structure as the $I$ term remaining in a residual network's $\prod_k(I+A_k)$.`,
    note: R`This argument is not a guarantee. If the $E_s$ are large the gradient can explode, and if $f_s$ is small the cell path vanishes too. That is exactly the conclusion of slide 22 (“doesn't guarantee … but provides an easier way”).` },
  'ch20-lstmparams': { title: 'The Number of Parameters of an LSTM',
    stmt: R`One LSTM layer with input $x_t\in\mathbb R^d$ and hidden state $h_t\in\mathbb R^h$ has $4h(h+d)+4h$ parameters, four times a vanilla RNN of the same sizes ($h(h+d)+h$).`,
    body: R`
Each of the four branches $\bullet\in\{i,f,o,g\}$ has $U_\bullet\in\mathbb R^{h\times h}$, $W_\bullet\in\mathbb R^{h\times d}$, $b_\bullet\in\mathbb R^h$, so each branch has $h^2+hd+h=h(h+d)+h$ parameters. There are four branches sharing no parameters, so the total is $4\big(h(h+d)+h\big)=4h(h+d)+4h$.
Seen as one big matrix, stacking the four rows $\begin{pmatrix}U_\bullet&W_\bullet\end{pmatrix}$ gives $W\in\mathbb R^{4h\times(h+d)}$ and $b\in\mathbb R^{4h}$, the same count. A vanilla RNN has one each of $W_h\in\mathbb R^{h\times h}$, $W_x\in\mathbb R^{h\times d}$, $b\in\mathbb R^h$, that is $h(h+d)+h$, and the ratio is exactly $4$.`,
    note: R`With $d=h$ this is $8h^2+4h$, and $W$ is the $4h\times2h$ of slide 19. The count does not depend on the sequence length, because every step shares the same parameters.` },
  'ch20-lmgrad': { title: 'The Gradient of the Language-Model Loss',
    stmt: R`If $\mathcal L=-\sum_{t=1}^T\log[\mathbf p_t]_{k_t}$, $\mathbf p_t=\softmax(\hat{\mathbf x}_t)$, $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$, and $\mathbf x_t=e_{k_t}$, then $\frac{\partial\mathcal L}{\partial\hat{\mathbf x}_t}=\mathbf p_t-\mathbf x_t$, $\frac{\partial\mathcal L}{\partial W_d}=\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$, $\frac{\partial\mathcal L}{\partial\mathbf b_d}=\sum_t(\mathbf p_t-\mathbf x_t)$, and the gradient entering $\mathbf h_{t-1}$ through $\hat{\mathbf x}_t$ is $W_d^T(\mathbf p_t-\mathbf x_t)$. For the embedding $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$, $\frac{\partial\mathcal L}{\partial W_e}=\sum_t\delta_t\mathbf x_t^T$ with $\delta_t=\partial\mathcal L/\partial\mathbf z_t$.`,
    body: R`
**The loss of one slot.** With $k=k_t$, $\ell_t=-\log p_{t,k}=-\hat x_{t,k}+\log\sum_je^{\hat x_{t,j}}$. Differentiating with respect to $\hat x_{t,m}$,
$$\frac{\partial\ell_t}{\partial\hat x_{t,m}}=-\delta_{mk}+\frac{e^{\hat x_{t,m}}}{\sum_je^{\hat x_{t,j}}}=p_{t,m}-x_{t,m}$$
so $\frac{\partial\ell_t}{\partial\hat{\mathbf x}_t}=\mathbf p_t-\mathbf x_t$. Since $\hat{\mathbf x}_t$ appears only in the loss of slot $t$, the same holds for $\frac{\partial\mathcal L}{\partial\hat{\mathbf x}_t}$.

**The classification layer.** From $\hat x_{t,m}=\sum_lW_{d,ml}h_{t-1,l}+b_{d,m}$, $\frac{\partial\hat x_{t,m}}{\partial W_{d,ml}}=h_{t-1,l}$ and $\frac{\partial\hat x_{t,m}}{\partial b_{d,m}}=1$. Every slot uses the same $W_d$ and $\mathbf b_d$, so adding the contributions of the slots gives $\frac{\partial\mathcal L}{\partial W_{d,ml}}=\sum_t(p_{t,m}-x_{t,m})h_{t-1,l}$, that is, $\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$, and for the bias $\sum_t(\mathbf p_t-\mathbf x_t)$.

**Into the hidden state.** Since $\frac{\partial\hat{\mathbf x}_t}{\partial\mathbf h_{t-1}}=W_d$, the gradient the loss of slot $t$ gives $\mathbf h_{t-1}$ is $W_d^T(\mathbf p_t-\mathbf x_t)$. Because $\mathbf h_{t-1}$ is also used by later steps, backpropagation through time adds to this the gradient returning through $\mathbf h_t$.

**The embedding.** From $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$, $\frac{\partial z_{t,a}}{\partial W_{e,ab}}=x_{t,b}$, so $\frac{\partial\mathcal L}{\partial W_e}=\sum_t\delta_t\mathbf x_t^T$. With $\mathbf x_t=e_{k_t}$, the matrix $\delta_te_{k_t}^T$ is $\delta_t$ in column $k_t$ and zero elsewhere, so only the columns of the tokens in the sentence receive a gradient.`,
    note: R`At a single slot this is the same computation as the softmax cross-entropy gradient of Unit 6. What is new in a language model is that the contributions of the slots are added on shared parameters, and that the embedding is a column pick.` },
  'ch20-greedy': { title: 'Greedy Decoding and Ancestral Sampling',
    stmt: R`(1) Drawing $x_t\sim P(\cdot\mid x_{<t})$ at every slot produces the sentence $(x_1,\dots,x_T)$ with probability equal to the model's joint probability $P(x_1,\dots,x_T)$. (2) Greedy decoding, which takes the $\argmax$ at every slot, is not guaranteed to pick the sentence of largest joint probability.`,
    body: R`
**(1) Sampling.** Each slot's choice is made with the conditional probability given the earlier choices, so a particular sentence comes out with probability $\prod_tP(x_t\mid x_{<t})$, the product of the slots' probabilities. By the product rule this is $P(x_1,\dots,x_T)$. So the probabilistic method draws exactly from the sentence distribution the model defines.

**(2) Counterexample.** Let $P(\text{A})=0.6$, $P(\text{B})=0.4$, the largest probability of a token after A be $0.5$, and $P(\text{C}\mid\text{B})=0.9$. Greedy picks A, then a token of probability $0.5$, for a sentence probability of $0.6\cdot0.5=0.30$, yet $P(\text{B},\text{C})=0.4\cdot0.9=0.36>0.30$. Greedy only maximizes each factor separately, but later factors depend on earlier choices, so the maximum of the product is not the product of the factorwise maxima.`,
    note: R`Beam search narrows this gap by keeping the $B$ most probable partial sentences at every slot, but it does not guarantee the maximum either. Slides 30–31 cover only the greedy and the probabilistic methods.` },
  });
})();
