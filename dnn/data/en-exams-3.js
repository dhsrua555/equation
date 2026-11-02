/* English text — Quiz 2 prep mock exams A–C (exams-3.js). Problems are listed in the same order as in each exam. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  const G = 'Quiz 2 prep · Week 8 Wed – Week 10 Mon';
  Object.assign(EM.en.ex, {
  q2a: {
    group: G,
    groupDesc: 'Covers Units 17–21 (the universal approximation theorem, Barron’s theorem and generalization, RNNs and backpropagation through time, LSTM and applications, attention and Transformers). The two-step RNN gradient, marked “Quiz 2 (11/04)” in the Week 9 Wednesday notes, is in A; the handwritten proofs on approximation and generalization are in B; short questions and derivations over the whole range are in C; the Week 10 Monday attention material is in D.',
    kind: 'Quiz 2 style · RNN', title: 'RNN Gradients and the LSTM', scopeText: 'Units 19–20',
    desc: 'Write the two-step RNN gradient marked for Quiz 2 in the notes from scratch, and prove vanishing/exploding in vector BPTT, gradient clipping, and the LSTM cell path.',
    probs: [
      { q: R`Consider the scalar RNN $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$ ($t=1,2$) with loss $L=L_1+L_2$, $L_t=\frac12(Y_t-Z_t)^2$. The initial state $h_0$ is a given constant and may be nonzero.
1. Write the forward pass with $a_t$, $h_t$, $Y_t$, and express the local derivatives $\partial h_t/\partial a_t$ and $\partial h_2/\partial h_1$ in terms of $h_t$.
2. Find $\partial L/\partial V$ and $\partial L/\partial c$.
3. List every path from $W$ to $L$ and find $\partial L/\partial W$.
4. Find $\partial L/\partial U$ and $\partial L/\partial b$.
5. If $h_0=0$, which terms of 3 vanish?`,
        sol: R`
**1.** $a_t=Wh_{t-1}+UX_t+b$, $h_t=\tanh a_t$, $Y_t=Vh_t+c$. $\frac{\partial h_t}{\partial a_t}=1-\tanh^2a_t=1-h_t^2$, and $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$.
**2.** $L_t$ depends on $V$ and $c$ only through $Y_t$, so $\frac{\partial L}{\partial V}=\sum_{t=1}^2(Y_t-Z_t)h_t$ and $\frac{\partial L}{\partial c}=\sum_{t=1}^2(Y_t-Z_t)$.
**3.** There are three paths: ① $W\to a_1\to h_1\to Y_1\to L_1$, ② $W\to a_2\to h_2\to Y_2\to L_2$, ③ $W\to a_1\to h_1\to a_2\to h_2\to Y_2\to L_2$. Adding the chain-rule product along each path,
$$\frac{\partial L}{\partial W}=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.$$
**4.** Replacing the last factor of each term, $\partial a_s/\partial W=h_{s-1}$, by $\partial a_s/\partial U=X_s$ and $\partial a_s/\partial b=1$,
$$\frac{\partial L}{\partial U}=(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)X_2+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1,$$
$$\frac{\partial L}{\partial b}=(Y_1-Z_1)V(1-h_1^2)+(Y_2-Z_2)V(1-h_2^2)+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2).$$
Bundling with $\delta_2=(Y_2-Z_2)V(1-h_2^2)$ and $\delta_1=\big[(Y_1-Z_1)V+\delta_2W\big](1-h_1^2)$ gives $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$, $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$, $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.
**5.** The first and third terms, which carry the factor $h_0$, vanish, leaving only $\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1$. All three terms of $\partial L/\partial U$ and $\partial L/\partial b$ remain.`,
        rubric: R`
- 1. Forward pass, $\tanh'=1-h^2$, $\partial h_2/\partial h_1=(1-h_2^2)W$ — 6 points
- 2. Gradients for $V$ and $c$ — 6 points
- 3. All three paths and the chain-rule product along each — 14 points
- 4. Gradients for $U$ and $b$ (three terms each) — 10 points
- 5. The terms that remain when $h_0=0$ — 4 points` },
      { q: R`In the RNN of problem 1, with $W=1$, $U=\frac12$, $V=1$, $b=c=0$, $h_0=0$, $X=(2,0)$, $Z=(0,0)$, what is $\partial L/\partial W$? (to 3 decimal places; you may enter an expression)`,
        sol: R`$a_1=1$, $h_1=\tanh1\approx0.7616$, $a_2=h_1$, $h_2=\tanh(0.7616)\approx0.6420$, $Y_t=h_t$. Since $h_0=0$ only the second term remains: $(Y_2-Z_2)V(1-h_2^2)h_1=0.6420\cdot0.5878\cdot0.7616\approx0.287$.` },
      { q: R`In the same setting, what is $\partial L/\partial U$? (to 3 decimal places; you may enter an expression)`,
        sol: R`Since $X_2=0$ the second term vanishes, and $(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1=2(1-h_1^2)\big[h_1+h_2(1-h_2^2)\big]=2(0.4200)(0.7616+0.3774)\approx0.957$. A central difference gives the same value.` },
      { q: R`Let $\mathbf h_t=\tanh(W\mathbf h_{t-1}+U\mathbf x_t+\mathbf b)\in\mathbb R^n$ ($t=1,\dots,T$), and let the loss $L$ depend only on $\mathbf h_T$.
1. Show $\frac{\partial\mathbf h_t}{\partial\mathbf h_{t-1}}=\diag(\mathbf 1-\mathbf h_t^{\odot2})\,W$, and write $\frac{\partial L}{\partial\mathbf h_t}$ as a row-vector gradient, a product of Jacobians (mind the order).
2. Show $\Big\lVert\frac{\partial L}{\partial\mathbf h_t}\Big\rVert\le\Big\lVert\frac{\partial L}{\partial\mathbf h_T}\Big\rVert\,\lVert W\rVert_2^{\,T-t}$, and say what happens when $\lVert W\rVert_2<1$.
3. Show that after gradient clipping with threshold $v$, $\mathbf g\leftarrow\min\big(1,\frac v{\lVert\mathbf g\rVert}\big)\mathbf g$, the norm is $\min(\lVert\mathbf g\rVert,v)$ and the direction is unchanged. Also say why this does not fix vanishing gradients.`,
        sol: R`
**1.** With $\mathbf a_t=W\mathbf h_{t-1}+U\mathbf x_t+\mathbf b$ and $\mathbf h_t=\tanh(\mathbf a_t)$ (componentwise), $\frac{\partial\mathbf h_t}{\partial\mathbf a_t}=\diag(1-h_{t,i}^2)$ and $\frac{\partial\mathbf a_t}{\partial\mathbf h_{t-1}}=W$, and their product is $\diag(\mathbf 1-\mathbf h_t^{\odot2})W$. $L$ depends only on $\mathbf h_T$, and $\mathbf h_T$ depends on $\mathbf h_t$ only through $\mathbf h_{T-1},\dots$ in turn, so
$$\frac{\partial L}{\partial\mathbf h_t}=\frac{\partial L}{\partial\mathbf h_T}\,\frac{\partial\mathbf h_T}{\partial\mathbf h_{T-1}}\cdots\frac{\partial\mathbf h_{t+1}}{\partial\mathbf h_t},$$
that is, multiply $\diag(\mathbf 1-\mathbf h_k^{\odot2})W$ from the left for $k=T,T-1,\dots,t+1$.
**2.** Since $|1-h^2|\le1$, $\lVert\diag(\mathbf 1-\mathbf h_k^{\odot2})\rVert_2\le1$, and by submultiplicativity of the operator norm each factor has norm at most $\lVert W\rVert_2$. Hence $\big\lVert\frac{\partial L}{\partial\mathbf h_t}\big\rVert\le\big\lVert\frac{\partial L}{\partial\mathbf h_T}\big\rVert\lVert W\rVert_2^{T-t}$. If $\lVert W\rVert_2<1$ this tends to $0$ exponentially as $T-t$ grows (vanishing gradient), and the network cannot learn how a distant input $\mathbf x_t$ affects the loss.
**3.** If $\lVert\mathbf g\rVert\le v$ the factor is 1 and nothing changes; if $\lVert\mathbf g\rVert>v$ the factor is $v/\lVert\mathbf g\rVert$ and the norm becomes $v$. Either way the norm is $\min(\lVert\mathbf g\rVert,v)$, and since we only multiplied by a positive number the direction $\mathbf g/\lVert\mathbf g\rVert$ is the same. Clipping only caps the size from above and never enlarges a small gradient, so it does nothing for vanishing (the max on slide 15 should be min). Vanishing is handled by architectures such as the LSTM.`,
        rubric: R`
- 1. The one-step Jacobian and the order of the product — 8 points
- 2. $\lVert\diag\rVert\le1$, submultiplicativity, interpretation as vanishing — 9 points
- 3. Norm and direction in both cases, why it does not help vanishing — 8 points` },
      { q: R`Answer for the LSTM cell state $\mathbf c_t=\mathbf f_t\odot\mathbf c_{t-1}+\mathbf i_t\odot\mathbf g_t$.
1. Write the cell-path derivative $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-1}}$ with the gates $\mathbf f_t$, $\mathbf i_t$, $\mathbf g_t$ held fixed, and its $k$-step product $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-k}}$.
2. If the forget gate stays at $0.95$ in every component, what is the factor along the cell path after 50 steps? Compare with a vanilla RNN path whose one-step factor is $0.7$.
3. Give one reason why this does not guarantee "no vanishing gradients".`,
        sol: R`
**1.** It is a componentwise product, so $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-1}}=\diag(\mathbf f_t)$, and the product is $\frac{\partial\mathbf c_t}{\partial\mathbf c_{t-k}}=\diag\big(\mathbf f_t\odot\mathbf f_{t-1}\odot\cdots\odot\mathbf f_{t-k+1}\big)$. Unlike the vanilla RNN, no matrix $W$ is multiplied in.
**2.** $0.95^{50}\approx0.077$ and $0.7^{50}\approx1.8\times10^{-8}$. The cell path keeps millions of times more gradient.
**3.** For example, if the forget gate is learned small, $\prod\mathbf f$ also shrinks exponentially. Or: the gates and the candidate $\mathbf g_t$ depend on $\mathbf c_{t-1}$ through $\mathbf h_{t-1}=\mathbf o_{t-1}\odot\tanh(\mathbf c_{t-1})$, so the full Jacobian has terms beyond the cell path. Either one suffices.`,
        rubric: R`
- 1. $\diag(\mathbf f_t)$ and the $k$-step product — 6 points
- 2. Computing and comparing the two factors — 5 points
- 3. Why it is not a guarantee — 4 points` },
    ],
  },
  q2b: {
    group: G,
    kind: 'Quiz 2 style · approximation and generalization', title: 'Cybenko, Maurey, Rademacher', scopeText: 'Units 17–18',
    desc: 'The proof by contradiction of the universal approximation theorem, the probabilistic proof of Maurey’s lemma, the number of neurons in Barron’s theorem, and the Rademacher complexity of a linear class.',
    probs: [
      { q: R`Let $I_n=[0,1]^n$ and let $\sigma$ be a continuous discriminatory function. You may use the following fact.
**(Lemma 4)** If $U$ is a linear subspace of $C(I_n)$ with $\overline U\ne C(I_n)$, there is a signed measure $\mu\in M(I_n)$, $\mu\ne0$, with $\int_{I_n}h\,d\mu=0$ for every $h\in U$.
1. State the definition of "$\sigma$ is discriminatory".
2. Show that $U=\big\{\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)\big\}$ is a linear subspace of $C(I_n)$.
3. Prove by contradiction that $U$ is dense in $C(I_n)$.
4. Name one thing this theorem says about one-hidden-layer networks and one thing it does not say.`,
        sol: R`
**1.** $\sigma$ is discriminatory if, for $\mu\in M(I_n)$, $\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0$ for all $w\in\mathbb R^n$, $\theta\in\mathbb R$ implies $\mu=0$.
**2.** Since $\sigma$ is continuous, $x\mapsto\sigma(w^Tx+\theta)$ is an element of $C(I_n)$. The sum of two finite sums is the finite sum with the terms put together, and a real multiple is the finite sum with the $\alpha_j$ multiplied, so both are again in $U$. $0$ is in it too, with $\alpha_1=0$.
**3.** Assume $\overline U\ne C(I_n)$ (not dense = the closure is not everything). By Lemma 4 there is $\mu\ne0$ with $\int h\,d\mu=0$ for every $h\in U$. In particular $h(x)=\sigma(w^Tx+\theta)$, with $N=1$ and $\alpha_1=1$, is in $U$, so $\int\sigma(w^Tx+\theta)\,d\mu=0$ for all $w,\theta$. Since $\sigma$ is discriminatory, $\mu=0$, a contradiction. Therefore $\overline U=C(I_n)$: for every $f\in C(I_n)$ and $\varepsilon>0$ there is $G\in U$ with $\sup_{x\in I_n}|G(x)-f(x)|<\varepsilon$.
**4.** It says: a continuous function can be approximated uniformly, as closely as we like, by a one-hidden-layer network (existence). It does not say one of: how many neurons $N$ are needed, whether gradient descent can find those weights, or whether the network generalizes from finite data.`,
        rubric: R`
- 1. Definition of a discriminatory function — 5 points
- 2. Linear subspace — 5 points
- 3. Assumption negating the closure, Lemma 4, applying it to an element with $N=1$, contradiction via discrimination — 14 points
- 4. What it says and what it does not — 6 points` },
      { q: R`Every element of a subset $G$ of a Hilbert space $H$ satisfies $\lVert g\rVert\le B$, and $f=\sum_{j=1}^m\alpha_jh_j$ ($h_j\in G$, $\alpha_j\ge0$, $\sum_j\alpha_j=1$).
1. Let $X_1,\dots,X_N$ be independent random variables with $P[X_i=h_j]=\alpha_j$. Show $\E X_i=f$.
2. Show $\E\Big\lVert f-\frac1N\sum_{i=1}^NX_i\Big\rVert^2=\frac1N\big(\E\lVert X_1\rVert^2-\lVert f\rVert^2\big)$. Say why the cross terms vanish.
3. Show that there exist $g_1,\dots,g_N\in G$ with $\big\lVert f-\frac1N\sum_ig_i\big\rVert^2\le\frac{B^2}N$.`,
        sol: R`
**1.** $\E X_i=\sum_jP[X_i=h_j]\,h_j=\sum_j\alpha_jh_j=f$.
**2.** Since $f=\frac1N\sum_if$, $f-\frac1N\sum_iX_i=\frac1N\sum_i(f-X_i)$. Expand $\lVert\sum_iv_i\rVert^2=\sum_i\lVert v_i\rVert^2+\sum_{i\ne j}\langle v_i,v_j\rangle$. For $i\ne j$, $X_i$ and $X_j$ are independent, so $\E\langle f-X_i,f-X_j\rangle=\langle f,f\rangle-\langle f,\E X_j\rangle-\langle\E X_i,f\rangle+\langle\E X_i,\E X_j\rangle=0$. What remains is $\frac1{N^2}\cdot N\,\E\lVert f-X_1\rVert^2$, and $\E\lVert f-X_1\rVert^2=\lVert f\rVert^2-2\langle f,\E X_1\rangle+\E\lVert X_1\rVert^2=\E\lVert X_1\rVert^2-\lVert f\rVert^2$.
**3.** Since $\E\lVert X_1\rVert^2\le B^2$, the expectation is at most $\frac{B^2-\lVert f\rVert^2}N\le\frac{B^2}N$. If the expectation of a random variable is at most some value, at least one outcome is at most that value (the probabilistic method), so the realizations $g_i=X_i(\omega)\in G$ of such an outcome are the desired elements.`,
        rubric: R`
- 1. Computing the expectation — 4 points
- 2. Writing it as $\frac1N\sum(f-X_i)$, cancelling the cross terms by independence, simplifying what remains — 16 points
- 3. The bound $B^2$ and the probabilistic method — 10 points` },
      { q: R`In Barron's theorem (mean squared error $\frac1{|B_1^d|}\int_{B_1^d}|f-\Phi_N|^2\le\frac cN$ for $c>4C^2$), what is the smallest number of neurons $N$ that the theorem guarantees for approximating a function with $C=3$ to mean squared error at most $0.05$?`,
        sol: R`$4C^2=36$, so $c>36$ is needed, and $\frac cN\le0.05\iff N\ge20c$. Taking $c$ just above 36 ($36<c\le36.05$), $N=721$ suffices, while $N=720$ would require $c\le36$ and is not guaranteed. This number does not depend on the input dimension $d$.` },
      { q: R`For points with $\lVert x_i\rVert\le1$ ($i=1,\dots,n$) and the class $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$, show that the empirical Rademacher complexity $\widehat{\operatorname{Rad}}_n(\mathcal F_Q)=\E_\xi\sup_{f\in\mathcal F_Q}\frac1n\sum_i\xi_if(x_i)$ is at most $\frac Q{\sqrt n}$. (The $\xi_i$ are independent Rademacher variables.)`,
        sol: R`By Cauchy–Schwarz, $\sup_{\lVert w\rVert\le Q}\frac1n\big\langle w,\sum_i\xi_ix_i\big\rangle=\frac Qn\big\lVert\sum_i\xi_ix_i\big\rVert$ (equality when $w$ points along $\sum_i\xi_ix_i$). Since $\sqrt{\cdot}$ is concave, Jensen's inequality gives $\E\big\lVert\sum_i\xi_ix_i\big\rVert\le\sqrt{\E\big\lVert\sum_i\xi_ix_i\big\rVert^2}$. Expanding, $\E\xi_i\xi_j=0$ for $i\ne j$ and $\xi_i^2=1$, so $\E\big\lVert\sum_i\xi_ix_i\big\rVert^2=\sum_i\lVert x_i\rVert^2\le n$. Hence $\widehat{\operatorname{Rad}}_n(\mathcal F_Q)\le\frac Qn\sqrt n=\frac Q{\sqrt n}$.`,
        rubric: R`
- Turning the supremum into a norm (Cauchy–Schwarz) — 5 points
- Jensen's inequality — 4 points
- Cancelling cross terms and $\sum_i\lVert x_i\rVert^2\le n$ — 6 points` },
      { q: R`Enlarging the hypothesis class $\mathcal F$ by adding hidden neurons generally reduces which error?`,
        choices: [R`The approximation error`, R`The generalization error`, R`The optimization error`, R`All three errors`],
        sol: R`A larger class lowers $\inf_{f\in\mathcal F}R(f)$ and so the approximation error, but with more functions to choose from the generalization error can grow, and nothing guarantees that optimization gets easier. The universal approximation theorem is a theorem about the approximation error.` },
      { q: R`Which of the following is **not** discriminatory on $[0,1]$?`,
        choices: [R`The logistic function $\frac1{1+e^{-t}}$`, R`The Heaviside step function`, R`The identity function $\sigma(t)=t$`, R`$\frac{1+\tanh t}2$`],
        sol: R`For the identity, $\int(wx+\theta)\,d\mu=w\int x\,d\mu+\theta\,\mu([0,1])$ sees only the mass and the first moment. For $\mu=\delta_0-2\delta_{1/2}+\delta_1\ne0$ both are $0$, so the integral is $0$ for all $w,\theta$ and the identity is not discriminatory. The others are (bounded measurable) sigmoids and therefore discriminatory.` },
      { q: R`For a class with values in $[0,1]$, with probability at least $1-\delta$, $\sup_f|\hat R_n(f)-R(f)|\le2\operatorname{Rad}_n(\mathcal F)+\sqrt{\frac{\log(2/\delta)}{2n}}$, and $\operatorname{Rad}_n\le Q/\sqrt n$. Roughly what happens to the right-hand side when the sample size is multiplied by 4?`,
        choices: [R`About half`, R`About a quarter`, R`About a sixteenth`, R`Unchanged`],
        sol: R`Both terms are proportional to $1/\sqrt n$, so $n\to4n$ gives $\frac1{\sqrt{4n}}=\frac12\cdot\frac1{\sqrt n}$, about half. Halving the error takes four times the data.` },
    ],
  },
  q2c: {
    group: G,
    kind: 'Quiz 2 review', title: 'Short Questions and Derivations over the Whole Range', scopeText: 'Units 15.7, 17–20',
    desc: 'Quick checks on RNN structure and parameters, clipping, the cross-entropy of a language model, Maurey, density, and PyTorch sizes, plus derivations of the δ recursion and the risk decomposition.',
    probs: [
      { q: R`What is the input/output structure of an RNN that translates an English sentence into Korean?`,
        choices: [R`one to one`, R`one to many`, R`many to one`, R`many to many, producing output after reading the whole input`],
        sol: R`It is many to many (encoder–decoder): the output sentence comes after the input sentence has been read to the end. Video classification is many to one and image captioning is one to many.` },
      { q: R`For the vanilla RNN $\mathbf h_t=\tanh(U\mathbf h_{t-1}+W\mathbf x_t+\mathbf b)$, $\hat{\mathbf y}_t=W^{\text{out}}\mathbf h_t$ with $\mathbf x_t\in\mathbb R^{10}$, $\mathbf h_t\in\mathbb R^{20}$, $\hat{\mathbf y}_t\in\mathbb R^5$, how many parameters are there in total? (the output has no bias)`,
        sol: R`$U$: $20\cdot20=400$, $W$: $20\cdot10=200$, $\mathbf b$: $20$, $W^{\text{out}}$: $5\cdot20=100$. Total $720$. All time steps share the parameters, so this does not depend on the sequence length.` },
      { q: R`How many parameters (including biases) does one LSTM layer with input size $d=50$ and hidden size $h=100$ have?`,
        sol: R`Each of the four gates has $h\times(h+d)$ weights and $h$ biases, so $4h(h+d)+4h=4\cdot100\cdot150+400=60{,}400$.` },
      { q: R`Clipping the gradient $\mathbf g=(6,8)$ with threshold $v=5$, what is the first component?`,
        sol: R`$\lVert\mathbf g\rVert=10>5$, so $\frac5{10}\mathbf g=(3,4)$. The norm is $5$ and the direction is unchanged.` },
      { q: R`Which statement about truncated BPTT is correct?`,
        choices: [R`It resets the hidden state to $\mathbf 0$ every few steps`, R`The forward pass keeps carrying the hidden state, but backpropagation runs only over the last few steps`, R`Both the forward and the backward pass run only over the first few steps`, R`It cuts the gradient's size at a threshold`],
        sol: R`Slide 9: the hidden state is carried forward in time indefinitely, but backpropagation runs only over a shorter window. Cutting the gradient's size is gradient clipping, a different technique.` },
      { q: R`At one position of a language model with a vocabulary of 4, the logits are $(2,0,0,0)$ and the correct token is the first one. What is the cross-entropy loss? (you may enter an expression)`,
        sol: R`$p_1=\frac{e^2}{e^2+3}$, and the loss is $-\ln p_1=\ln\frac{e^2+3}{e^2}=\ln(1+3e^{-2})\approx0.341$.` },
      { q: R`With $H=\mathbb R^3$, $G=\{\mathbf e_1,\mathbf e_2,\mathbf e_3\}$, $f^*=(\frac13,\frac13,\frac13)$, and $X_1,\dots,X_6$ drawn independently from $G$ with probability $\frac13$ each, what is $\E\big\lVert f^*-\frac16\sum_iX_i\big\rVert^2$?`,
        sol: R`By the identity in Maurey's lemma, $\frac1N\big(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2\big)=\frac16\big(1-\frac13\big)=\frac19$.` },
      { q: R`What does it mean for a set $D\subseteq C(K)$ to be dense in the max norm?`,
        choices: [R`For every $f\in C(K)$ and $\varepsilon>0$ there is $g\in D$ with $\sup_{x\in K}|f(x)-g(x)|<\varepsilon$`, R`For every $f\in C(K)$ and $\varepsilon>0$ there is $g\in D$ with $\int_K|f-g|^2<\varepsilon$`, R`$D=C(K)$`, R`$D$ is finite-dimensional`],
        sol: R`Closeness is measured by the max norm $\lVert f-g\rVert_\infty=\sup_K|f-g|$. The second choice is density in $L^2$, a weaker condition, and a dense set need not equal $C(K)$ (for example, all polynomials).` },
      { q: R`Apply $\texttt{Conv2d(3, 16, 5, padding=2)}$, ReLU, and $\texttt{MaxPool2d(2)}$ in turn to an input $1\times3\times32\times32$, then flatten with $\texttt{view(1, -1)}$. What is the length?`,
        sol: R`Convolution: $\frac{32-5+4}{1}+1=32$, with 16 channels. Pooling: $\frac{32-2}{2}+1=16$. Flattened: $16\cdot16\cdot16=4096$.` },
      { q: R`For the two-step scalar RNN of exam A ($h_t=\tanh a_t$, $a_t=Wh_{t-1}+UX_t+b$, $Y_t=Vh_t+c$, $L=\sum_t\frac12(Y_t-Z_t)^2$), let $\delta_t=\frac{\partial L}{\partial a_t}$.
1. Find $\delta_2$ and $\delta_1$.
2. Show $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$, $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$, $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.
3. Write the backward recursion and the three gradients for $T$ steps.`,
        sol: R`
**1.** $a_2$ affects only $L_2$, through $h_2$, so $\delta_2=(Y_2-Z_2)V(1-h_2^2)$. $a_1$ affects two places through $h_1$, namely $L_1$ and $a_2$, so $\frac{\partial L}{\partial h_1}=(Y_1-Z_1)V+\delta_2W$ and $\delta_1=\big[(Y_1-Z_1)V+\delta_2W\big](1-h_1^2)$.
**2.** $W$ enters $a_1$ and $a_2$ directly, so $\frac{\partial L}{\partial W}=\delta_1\frac{\partial a_1}{\partial W}+\delta_2\frac{\partial a_2}{\partial W}=\delta_1h_0+\delta_2h_1$. Here $\partial a_t/\partial W=h_{t-1}$ is the direct derivative with $h_{t-1}$ held constant; the indirect effect of $W$ changing $h_1$ is already inside $\delta_1$, in $\delta_2W$, so it is not counted twice. In the same way $\partial a_t/\partial U=X_t$ and $\partial a_t/\partial b=1$. Expanding gives the three-term formulas of exam A.
**3.** $\delta_T=(Y_T-Z_T)V(1-h_T^2)$, $\delta_t=\big[(Y_t-Z_t)V+\delta_{t+1}W\big](1-h_t^2)$ ($t=T-1,\dots,1$), and
$$\frac{\partial L}{\partial W}=\sum_{t=1}^T\delta_th_{t-1},\qquad\frac{\partial L}{\partial U}=\sum_{t=1}^T\delta_tX_t,\qquad\frac{\partial L}{\partial b}=\sum_{t=1}^T\delta_t.$$`,
        rubric: R`
- 1. $\delta_2$ and $\delta_1$ combining the two paths — 7 points
- 2. Distinguishing the direct derivative from the indirect effect — 6 points
- 3. The general recursion and the three gradients — 5 points` },
      { q: R`1. Define the population risk $R(f)$ and the empirical risk $\hat R_n(f)$.
2. With $\hat f=\argmin_{f\in\mathcal F}\hat R_n(f)$ and $f_{\mathcal F}=\argmin_{f\in\mathcal F}R(f)$, show $R(\hat f)-R(f_{\mathcal F})\le2\sup_{f\in\mathcal F}|\hat R_n(f)-R(f)|$.
3. In one or two sentences, say what this result and the Rademacher complexity tell us together.`,
        sol: R`
**1.** $R(f)=\E_{(X,Y)\sim P}\big[\ell(Y,f(X))\big]$, $\hat R_n(f)=\frac1n\sum_{i=1}^n\ell(Y_i,f(X_i))$.
**2.** $R(\hat f)-R(f_{\mathcal F})=\big[R(\hat f)-\hat R_n(\hat f)\big]+\big[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})\big]+\big[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})\big]$. The middle term is at most $0$ because $\hat f$ minimizes the empirical risk, and each end term is at most $\sup_{f\in\mathcal F}|\hat R_n(f)-R(f)|$.
**3.** If the loss takes values in $[0,1]$, the supremum is at most $2\operatorname{Rad}_n+\sqrt{\log(2/\delta)/(2n)}$ with high probability, so when the class is not too complex, e.g. $\operatorname{Rad}_n\le Q/\sqrt n$, the empirical risk minimizer approaches the best in the class at the rate $O(1/\sqrt n)$.`,
        rubric: R`
- 1. Definitions of the two risks — 4 points
- 2. The three-term decomposition and the sign of the middle term — 8 points
- 3. The Rademacher bound and the meaning of $1/\sqrt n$ — 4 points` },
    ],
  },
  q2d: {
    group: G,
    kind: 'Quiz 2 style · Attention', title: 'Derivatives of Scaled Dot-Product Attention, Masks, and Layer Normalization', scopeText: 'Unit 21',
    desc: 'Derive the Jacobian of the softmax and the gradient of the attention output with respect to the query, a bound under saturation, why masked attention is not permutation equivariant, and the Jacobian of layer normalization.',
    probs: [
      { q: R`Consider scaled dot-product attention with a query $\mathbf q\in\mathbb R^D$, keys $\mathbf k_1,\dots,\mathbf k_N\in\mathbb R^D$, and values $\mathbf v_1,\dots,\mathbf v_N\in\mathbb R^{d_v}$: $e_i=\mathbf q\cdot\mathbf k_i/\sqrt D$, $\mathbf a=\mathrm{softmax}(\mathbf e)$, $\mathbf c=\sum_ia_i\mathbf v_i$.
1. Show that the Jacobian of the softmax is $J=\diag(\mathbf a)-\mathbf a\mathbf a^T$, and show (i) $\mathrm{softmax}(\mathbf e+t\mathbf 1)=\mathrm{softmax}(\mathbf e)$, (ii) $J\mathbf 1=\mathbf 0$, (iii) $\mathbf u^TJ\mathbf u\ge0$ for every $\mathbf u$ (when all $a_i>0$, with equality only for $\mathbf u\parallel\mathbf 1$).
2. Derive $\dfrac{\partial\mathbf c}{\partial\mathbf q}=\dfrac1{\sqrt D}\sum_ma_m(\mathbf v_m-\mathbf c)\mathbf k_m^T$.
3. Show that if $\lVert\mathbf v_i\rVert\le V$ and $\lVert\mathbf k_i\rVert\le K$ for all $i$ and $\max_ia_i\ge1-\varepsilon$, then $\big\lVert\partial\mathbf c/\partial\mathbf q\big\rVert_2\le4VK\varepsilon/\sqrt D$, and explain why, without dividing by $\sqrt D$, the query is hardly trained.`,
        sol: R`
**1.** From $a_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$, $\frac{\partial a_i}{\partial e_m}=\frac{\delta_{im}e^{e_i}}Z-\frac{e^{e_i}e^{e_m}}{Z^2}=a_i\delta_{im}-a_ia_m$, that is, $J=\diag(\mathbf a)-\mathbf a\mathbf a^T$. (i) The factor $e^t$ multiplies the numerator and the denominator alike and cancels. (ii) $(J\mathbf 1)_i=a_i-a_i\sum_ma_m=0$. (iii) $\mathbf u^TJ\mathbf u=\sum_ia_iu_i^2-\big(\sum_ia_iu_i\big)^2=\mathrm{Var}_{\mathbf a}(\mathbf u)\ge0$, and when all $a_i>0$ the variance is $0$ only if $\mathbf u$ is constant.
**2.** $\dfrac{\partial\mathbf c}{\partial e_m}=\sum_i\dfrac{\partial a_i}{\partial e_m}\mathbf v_i=a_m\mathbf v_m-a_m\sum_ia_i\mathbf v_i=a_m(\mathbf v_m-\mathbf c)$ and $\dfrac{\partial e_m}{\partial\mathbf q}=\dfrac{\mathbf k_m^T}{\sqrt D}$. By the chain rule $\dfrac{\partial\mathbf c}{\partial\mathbf q}=\sum_m\dfrac{\partial\mathbf c}{\partial e_m}\dfrac{\partial e_m}{\partial\mathbf q}=\dfrac1{\sqrt D}\sum_ma_m(\mathbf v_m-\mathbf c)\mathbf k_m^T$.
**3.** By $\lVert\mathbf u\mathbf k^T\rVert_2=\lVert\mathbf u\rVert\lVert\mathbf k\rVert$ and the triangle inequality, $\big\lVert\sum_ma_m(\mathbf v_m-\mathbf c)\mathbf k_m^T\big\rVert_2\le K\sum_ma_m\lVert\mathbf v_m-\mathbf c\rVert$. Since $\mathbf c$ is a convex combination of the $\mathbf v_i$, $\lVert\mathbf c\rVert\le V$, so $\lVert\mathbf v_m-\mathbf c\rVert\le2V$. Let $i^*$ be the index with $a_{i^*}\ge1-\varepsilon$; then $\sum_{m\ne i^*}a_m\le\varepsilon$, so the terms with $m\ne i^*$ add up to $\le2V\varepsilon$. For the term $m=i^*$, $\mathbf c-\mathbf v_{i^*}=\sum_{i\ne i^*}a_i(\mathbf v_i-\mathbf v_{i^*})$ gives $\lVert\mathbf v_{i^*}-\mathbf c\rVert\le2V\varepsilon$, and with $a_{i^*}\le1$ this term is also $\le2V\varepsilon$. The sum is $\le K\cdot4V\varepsilon$, that is, $\le4VK\varepsilon/\sqrt D$.
Explanation: if the components of $\mathbf q,\mathbf k$ are independent with mean $0$ and variance $1$, the variance of $\mathbf q\cdot\mathbf k$ is $D$, so the spread of the scores grows like $\sqrt D$; without the division the softmax piles onto one key ($\varepsilon\approx0$), the bound above is close to $0$, and the gradient to $\mathbf q$ vanishes. Dividing by $\sqrt D$ makes the score variance $1$ and avoids the saturation.`,
        rubric: R`
- 1. The Jacobian $\diag(\mathbf a)-\mathbf a\mathbf a^T$ — 4 points
- 1. (i), (ii), (iii), 3 points each, 9 points (including the variance form) 
- 2. $\partial\mathbf c/\partial e_m=a_m(\mathbf v_m-\mathbf c)$ and the chain rule — 13 points
- 3. $\lVert\mathbf v_m-\mathbf c\rVert\le2V$ and the bound on the terms other than the dominant key — 8 points
- 3. The dominant key's term $\lVert\mathbf v_{i^*}-\mathbf c\rVert\le2V\varepsilon$ — 8 points
- 3. The explanation of what happens without dividing by $\sqrt D$ — 8 points` },
      { q: R`The two parts below are independent, and the input matrix is $X\in\mathbb R^{N\times d}$.
1. For masked self-attention $\mathrm{Attn}_M(X)=\mathrm{softmax}\big(QK^T/\sqrt{D_k}+M\big)V$ ($M_{ji}=0$ for $i\le j$, $-\infty$ for $i>j$), show that the first row is $\mathbf y_1=\mathbf v_1$. For $N=2$, $d_v=1$, all scores $0$ (that is, $W_q=0$), and $v_1=1$, $v_2=3$, find $Y=\mathrm{Attn}_M(X)$ and the output $\mathrm{Attn}_M(PX)$ for the input $PX$ with the two rows swapped, and show that $\mathrm{Attn}_M(PX)\ne P\,\mathrm{Attn}_M(X)$. State which equality in the proof of the permutation equivariance of self-attention breaks because of the mask.
2. Derive that the Jacobian of layer normalization $\mathbf y=\mathrm{LN}(\mathbf h)=(\mathbf h-\mu\mathbf 1)/\sigma$ ($\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$) is $\dfrac{\partial\mathbf y}{\partial\mathbf h}=\dfrac1\sigma\Big(I-\dfrac1d\mathbf 1\mathbf 1^T-\dfrac1d\mathbf y\mathbf y^T\Big)$, show that multiplying this matrix by $\mathbf 1$ and by $\mathbf y$ gives $\mathbf 0$, and explain the relation to shift and scale invariance.`,
        sol: R`
**1.** The mask of the first row is $(0,-\infty,\dots,-\infty)$, so $A_{1i}=0$ for $i>1$, and since the row sums to $1$, $A_{11}=1$, that is, $\mathbf y_1=\mathbf v_1$. With all scores $0$ the second row is $(\frac12,\frac12)$, so $A=\begin{pmatrix}1&0\\\frac12&\frac12\end{pmatrix}$ and $V=(1,3)^T$, giving $Y=(1,\,2)^T$. For the swapped input $V'=(3,1)^T$ and the scores are still $0$, so the same $A$ gives $\mathrm{Attn}_M(PX)=(3,\,2)^T$. On the other hand $P\,\mathrm{Attn}_M(X)=(2,\,1)^T$, so $\mathrm{Attn}_M(PX)\ne P\,\mathrm{Attn}_M(X)$.
Where it breaks: in the equivariance proof, $\sigma(PEP^T)=P\sigma(E)P^T$, but with the mask added, $PEP^T+M$ differs from $P(E+M)P^T=PEP^T+PMP^T$, because $PMP^T\ne M$ (the mask has a lower-triangular structure that fixes positions and does not commute with permutations). That is why masked attention can tell the order even without a positional encoding.
**2.** $\partial\mu/\partial h_j=1/d$, and in $\sigma^2=\frac1d\sum_i(h_i-\mu)^2$ the derivative through $\mu$ drops out because $\sum_i(h_i-\mu)=0$, so $\frac{\partial\sigma^2}{\partial h_j}=\frac2d(h_j-\mu)$, that is, $\frac{\partial\sigma}{\partial h_j}=\frac{h_j-\mu}{d\sigma}$. Differentiating $y_i=(h_i-\mu)/\sigma$ by the quotient rule,
$$\frac{\partial y_i}{\partial h_j}=\frac{\delta_{ij}-1/d}\sigma-\frac{(h_i-\mu)}{\sigma^2}\cdot\frac{h_j-\mu}{d\sigma}=\frac1\sigma\Big(\delta_{ij}-\frac1d-\frac{y_iy_j}d\Big).$$
This is the given matrix. Using $\mathbf 1^T\mathbf y=0$ and $\lVert\mathbf y\rVert^2=d$, multiplying by $\mathbf 1$ gives $\frac1\sigma\big(\mathbf 1-\mathbf 1-\frac1d\mathbf y(\mathbf y^T\mathbf 1)\big)=\mathbf 0$, and multiplying by $\mathbf y$ gives $\frac1\sigma\big(\mathbf y-\mathbf 0-\frac1d\mathbf y\cdot d\big)=\mathbf 0$.
Interpretation: moving $\mathbf h$ in the direction of $\mathbf 1$ (a shift) or of $\mathbf y$ (a scaling, the direction of $\mathbf h-\mu\mathbf 1$) does not change the output; this is the differential form of $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$. Since $\mathbf 1/\sqrt d$ and $\mathbf y/\sqrt d$ are orthogonal unit vectors, this matrix is an orthogonal projection multiplied by $1/\sigma$.`,
        rubric: R`
- 1. $A_{11}=1$ and $\mathbf y_1=\mathbf v_1$ for the first row — 5 points
- 1. Computing $\mathrm{Attn}_M(X)$, $\mathrm{Attn}_M(PX)$, and $P\,\mathrm{Attn}_M(X)$ and comparing them — 10 points
- 1. Pointing out the equality that breaks ($PMP^T\ne M$) — 10 points
- 2. The Jacobian via $\partial\mu$, $\partial\sigma$, and the quotient rule — 13 points
- 2. Multiplying by $\mathbf 1$ and $\mathbf y$ to get $\mathbf 0$ — 6 points
- 2. The relation to shift and scale invariance — 6 points` },
    ],
  }
  });
})();
