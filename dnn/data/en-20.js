/* English text — 20 LSTM & Applications of RNNs (W9 Wed slides 18–22 with notes, W9 Wed (2) slides 23–34). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    'LSTM 셀': 'LSTM cell',
    '역전파: 셀 경로에는 f만 곱해진다': 'backprop: only f multiplies along the cell path',
    '언어 모델의 학습과 추론': 'Training and inference of a language model',
    '학습: 칸마다 교차 엔트로피를 더한다': 'training: add the cross-entropy of every slot',
    '학습: 아래 칸의 입력은 정답 토큰 (교사 강요)': 'training: the inputs below are the true tokens (teacher forcing)',
    '추론: 점선처럼 뽑은 토큰을 다음 입력으로 되먹이고 &lt;EOS&gt;에서 멈춘다': 'inference: feed each chosen token back as the next input (dashed) and stop at &lt;EOS&gt;',
    '인코더-디코더 번역': 'Encoder–decoder translation',
    '인코더': 'encoder',
    '디코더 (언어 모델)': 'decoder (language model)',
    '입력: 정답을 한 칸 민 열': 'input: the true sequence shifted by one',
    '출력: 칸마다 소프트맥스': 'output: a softmax at every slot',
    '입력 문장을 끝까지 읽는다': 'reads the whole input sentence',
    '요약': 'summary',
  });
  Object.assign(EM.en.fig, {
    lstmcell: R`The LSTM cell (slides 20–21). At the bottom $h_{t-1}$ and $x_t$ are stacked and multiplied by $W$, and $\sigma,\sigma,\tanh,\sigma$ applied to the four branches give $f,i,g,o$ (the filled box $g$ is the candidate, not a gate). On the cell path at the top, $c_{t-1}$ is multiplied by $f$ (×) and $i\odot g$ is added (+) to give $c_t$, and $\tanh(c_t)$ times $o$ is $h_t$. Red arrow: in backpropagation only $f$ multiplies along the cell path.`,
    lmunroll: R`An LSTM language model unrolled in time (slides 28–31). Slot $t$ reads the token $x_{t-1}$ and gives the scores $\hat x_t$ of the next token. In training the true tokens go in at the bottom (teacher forcing) and the cross-entropies of all slots are added; in inference the token chosen at each slot (greedy or sampled) is fed back along the dashed line as the next slot's input, stopping when <EOS> is drawn.`,
    encdec: R`Encoder–decoder translation (slide 32). The encoder LSTM reads “He loved to eat .” to the end and passes its last state $\mathbf s$ to the decoder as the starting state; the decoder, a language model starting from NULL, emits “Er liebte zu essen .” one word at a time. Putting a CNN in the encoder's place and passing image features instead of $\mathbf s$ gives image captioning.`,
  });
  EM.en.ch[20] = {
    title: 'LSTM and Applications of RNNs',
    fig: R`How much gradient survives k steps: the LSTM cell path ∏f with forget gate f ≈ 0.98 (bold) stays high, while the vanilla RNN path ∏(1−h²)w (thin) drops quickly to 0`,
    tagline: R`An LSTM carries its memory separately on a belt, the cell state $c_t$, and writes, erases, and reveals it with input, forget, and output gates. Because the gradient along the cell path is $\diag(f_t)$, it reaches far into the past, and with this LSTM we build language models that predict the next word, translators, and image captioning.`,
    summary: R`In the vanilla RNN of Unit 19 the gradient multiplies by $W_h$ and $\tanh'$ at every step and easily vanishes. The **LSTM** keeps a cell state $c_t$ beside the hidden state $h_t$ and uses the input gate $i$, forget gate $f$, output gate $o$, and candidate $g$ to compute $c_t=f\odot c_{t-1}+i\odot g$, $h_t=o\odot\tanh(c_t)$. As the remark in the notes says, the Jacobian of the cell path is $\diag(f_t)$, so with $f_t\approx1$ the gradient flows without interruption (we also look at the remaining terms of the full Jacobian and the limits of this argument). As applications, we view a sentence as a sequence of one-hot tokens and build a **language model that predicts the next token** with embedding → LSTM → classification layer, separating training (cross-entropy at every slot, teacher forcing) from inference (greedy versus sampling). Finally we look at encoder–decoder **machine translation** and CNN + RNN **image captioning**.`,
    goals: [
      R`Write the formulas and roles of the LSTM's four gates $i,f,o,g$ and the updates of the cell and hidden states, and show that the big-matrix $W$ notation and the gate-by-gate notation are the same formula`,
      R`Compute one LSTM step by hand and count its parameters, $4h(h+d)+4h$`,
      R`Derive the cell-path Jacobian $\diag(f_t)$ and the RNN's $\diag(1-h_t^2)W_h$, and explain why an LSTM learns long dependencies more easily, and the limits of that claim`,
      R`Write the formulas of an RNN language model made of one-hot encoding, embedding, and a classification layer, and explain that generating a sentence is repeated next-token prediction`,
      R`Derive the training loss of a language model (cross-entropy at every slot) and its gradient $\softmax(\hat{\mathbf x}_t)-\mathbf x_t$, and explain teacher forcing`,
      R`Compare greedy decoding with probabilistic sampling, and give an example where greedy decoding misses the most probable sentence`,
      R`Explain the structure of encoder–decoder machine translation and CNN + RNN image captioning`,
    ],
    secTitles: { '20.1': 'LSTM gates', '20.2': 'Gradient flow', '20.3': 'Language models', '20.4': 'Training and inference', '20.5': 'Translation · captioning' },
    secs: {
      '20.1': { title: 'The Gates and Cell State of the LSTM', body: R`
:::idea In plain words
A vanilla RNN rewrites its memory (the hidden state) at every step by passing all of it through $\tanh(W\,\cdot)$. An LSTM puts its memory on a separate belt, the **cell state** $c_t$, and uses three valves (gates) to set, with values between $0$ and $1$, “how much to erase ($f$)”, “how much new content to write ($i$)”, and “how much to reveal ($o$)”. The memory on the belt goes only through elementwise multiplications and additions, so it survives a long time.
:::

**Vanilla RNN and LSTM** (slide 18). A vanilla RNN updates its single hidden state in one step as
$$h_t=\tanh\Big(W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}\Big)$$
[[ch19:19.2|The recurrence of the vanilla RNN and parameter sharing.]]. Repeating this update many times makes the gradient multiply by $W$ and $\tanh'$ at every step, so it vanishes or explodes[[ch19:19.6|Exploding and vanishing gradients and clipping.]]. The **LSTM** (Long Short-Term Memory, Hochreiter & Schmidhuber 1997) splits the state in two. The **hidden state** $h_t$ is what is sent to the output and to the next step, and the **cell state** $c_t$ is, in the words of the notes, the “long memory”.

:::key The four gates and the cell state of the LSTM
$$\begin{pmatrix}i\\f\\o\\g\end{pmatrix}=\begin{pmatrix}\sigma\\\sigma\\\sigma\\\tanh\end{pmatrix}W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix},\qquad W\in\mathbb R^{4h\times(h+d)}$$
$$c_t=f\odot c_{t-1}+i\odot g,\qquad h_t=o\odot\tanh(c_t)$$
$h_t,c_t\in\mathbb R^h$, $x_t\in\mathbb R^d$. The gates are $i,f,o\in(0,1)^h$, the candidate is $g\in(-1,1)^h$, and $\odot$ is the elementwise product. With biases, $W(\cdot)$ becomes $W(\cdot)+b$, $b\in\mathbb R^{4h}$.
:::

:::hand Lecture notes — the gates one at a time
RNN: $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$. LSTM: $h_t$ is the hidden state, $c_t$ the cell state (long memory).
- **Input gate** $i_t=\sigma(W_ix_t+U_ih_{t-1}+b_i)$ — how much of the new information $g_t$ to write to the cell.
- **Forget gate** $f_t=\sigma(W_fx_t+U_fh_{t-1}+b_f)$ — how much of the information in $c_{t-1}$ to carry along.
- **Output gate** $o_t=\sigma(W_ox_t+U_oh_{t-1}+b_o)$ — how much of the cell to put into $h_t$.
- **Candidate** $g_t=\tanh(W_gx_t+U_gh_{t-1}+b_g)$ — the new content to write from the current input.
$$c_t=f_t\odot c_{t-1}+i_t\odot g_t,\qquad h_t=o_t\odot\tanh(c_t)$$
$\odot$: elementwise multiplication.
:::

**The two notations are the same formula** (slides 18–19, 21). Cutting the big matrix $W$ into four blocks of $h$ rows, one per gate, and splitting each block into the columns multiplying $h_{t-1}$ and those multiplying $x_t$,
$$W=\begin{pmatrix}U_i&W_i\\U_f&W_f\\U_o&W_o\\U_g&W_g\end{pmatrix},\qquad W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}=\begin{pmatrix}U_ih_{t-1}+W_ix_t\\U_fh_{t-1}+W_fx_t\\U_oh_{t-1}+W_ox_t\\U_gh_{t-1}+W_gx_t\end{pmatrix}$$
So an implementation gets the $4h$ pre-activations with one matrix product, cuts them into pieces of $h$ from the top, and applies $\sigma,\sigma,\sigma,\tanh$ (the picture on slide 19). Slide 21's $f_t=\sigma(W_f\cdot[h_{t-1},x_t]+b_f)$ is the same formula, where $[h_{t-1},x_t]$ is the concatenation of the two vectors and the candidate is written $\tilde C_t$.

| Symbol | Name | Activation | Range | What it does (slide 19) |
|---|---|---|---|---|
| $i$ | input gate | $\sigma$ | $(0,1)$ | whether to write to the cell |
| $f$ | forget gate | $\sigma$ | $(0,1)$ | whether to erase the cell |
| $o$ | output gate | $\sigma$ | $(0,1)$ | how much to reveal the cell |
| $g$ | candidate | $\tanh$ | $(-1,1)$ | what to write to the cell, and how much |

:::fig lstmcell
:::

:::warn The size on slide 19 and the “gate gate”
Slide 19 writes $W$ as $4h\times2h$, which assumes the input and the hidden state have the same size ($d=h$). In general, with $x_t\in\mathbb R^d$, $W\in\mathbb R^{4h\times(h+d)}$. The slide also calls $g$ the “Gate gate (?)”, but $g$ is not a valve between $0$ and $1$: it is the **candidate content** with values in $(-1,1)$ made by $\tanh$ (the $\tilde C_t$ of slide 21). The gates in the strict sense are the three $i,f,o$.
:::

**Number of parameters.** Each of the four blocks has $h\times(h+d)$ weights and $h$ biases.

:::key The number of parameters of an LSTM
$$4h(h+d)+4h$$
Exactly four times the $h(h+d)+h$ of a vanilla RNN; with $d=h$ it is $8h^2+4h$.
:::

:::ex Example 1 — one LSTM step
In a scalar LSTM ($h=d=1$), $c_{t-1}=0.4$ and the four pre-activations $W(h_{t-1};x_t)+b$ are, in the order $(i,f,o,g)$, $(0,\ \ln3,\ 0,\ \ln2)$. Find $c_t$ and $h_t$.
---
$i=\sigma(0)=\frac12$, $f=\sigma(\ln3)=\frac1{1+1/3}=\frac34$, $o=\frac12$, $g=\tanh(\ln2)=\frac{2-1/2}{2+1/2}=\frac35$.
$c_t=\frac34\cdot0.4+\frac12\cdot\frac35=0.3+0.3=0.6$, $h_t=\frac12\tanh(0.6)\approx0.2685$. The cell kept $75\%$ of its old memory and added half of the candidate.
:::

:::ex Example 2 — counting parameters
How many parameters do an LSTM and a vanilla RNN with hidden size $h=512$ have when they take word embeddings of size $d=300$?
---
LSTM: $4\cdot512\cdot(512+300)+4\cdot512=1{,}662{,}976+2{,}048=1{,}665{,}024$. Vanilla RNN: $512\cdot812+512=416{,}256$. Exactly four times.
:::

### Going deeper

**Why $\sigma$ for the gates and $\tanh$ for the candidate.** The values of $\sigma$ lie in $(0,1)$, so they act as soft switches saying “how much to let through”, and unlike $0/1$ switches they are differentiable, so backpropagation can learn them. The candidate $g$ and the output's $\tanh(c_t)$ take values in $(-1,1)$, so they can express content to add to the cell as well as content to **subtract**, while keeping its size bounded.

**History and initialization of the forget gate.** The original LSTM of 1997 had no forget gate ($f\equiv1$); Gers et al. (2000) added the $f$ that erases the cell. In practice $b_f$ is often initialized to a positive value (e.g., $1$) so that $f\approx1$ early in training, which opens the gradient shortcut of Section 20.2 from the start.
` },
      '20.2': { title: 'Gradient Flow in the LSTM', body: R`
:::idea In plain words
In an RNN, a gradient travelling into the past had to pass a narrow gate at every step, multiplying by $W_h$ and being shaved by $\tanh'$. The LSTM's cell state has a **shortcut** on which only the forget gate $f_t$ multiplies at each step. With $f_t\approx1$ the gradient reaches far into the past almost undiminished (“Uninterrupted gradient flow!” on slide 22).
:::

:::hand Lecture notes — remark: the gradient of the cell state
Since $c_t=f_t\odot c_{t-1}+i_t\odot g_t$,
$$\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)$$
and with $f_t\approx1$ this Jacobian is almost the identity. Compare: in the RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$,
$$\frac{\partial h_t}{\partial h_{t-1}}=(1-h_t^2)\,W_h.$$
:::

**Filling in the two formulas of the notes.** In components, $c_{t,j}=f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$, and with the gates fixed $c_{t,j}$ depends only on $c_{t-1,j}$, so $\partial c_{t,j}/\partial c_{t-1,k}=f_{t,j}\delta_{jk}$: the Jacobian is the diagonal matrix $\diag(f_t)$. For the RNN, write $a_t=W_hh_{t-1}+W_xx_t+b$ and $h_t=\tanh(a_t)$; the chain rule and $\tanh'=1-\tanh^2$ give
$$\frac{\partial h_t}{\partial h_{t-1}}=\diag\big(\tanh'(a_t)\big)\frac{\partial a_t}{\partial h_{t-1}}=\diag(1-h_t^2)\,W_h$$
The notes' $(1-h_t^2)W_h$ is shorthand for this diagonal matrix[[ch09:9.5|Jacobians of vector inputs and outputs and the chain rule.]].

:::key The gradient path of the cell state
Along the cell path alone (with the gates fixed),
$$\frac{\partial c_t}{\partial c_{t-k}}=\diag(f_t)\diag(f_{t-1})\cdots\diag(f_{t-k+1})=\diag\Big(\prod_{s=t-k+1}^{t}f_s\Big),$$
while for the vanilla RNN, with $D_s=\diag(1-h_s^2)$,
$$\frac{\partial h_t}{\partial h_{t-k}}=D_tW_h\,D_{t-1}W_h\cdots D_{t-k+1}W_h,\qquad\Big\lVert\frac{\partial h_t}{\partial h_{t-k}}\Big\rVert\le\lVert W_h\rVert^k.$$
:::

**What is different.** The RNN's product contains the same matrix $W_h$ $k$ times and $\lVert D_s\rVert\le1$, so if $\lVert W_h\rVert<1$ the gradient shrinks exponentially, below $\lVert W_h\rVert^k$, and if the largest singular value of $W_h$ exceeds $1$ it may explode. On the cell path there is neither a matrix product nor an activation derivative: only $\prod_sf_s$ remains componentwise, so if the network learns $f_s\approx1$ the gradient goes down unchanged. In particular, with $f=1$ and $i=0$, $c_t=c_{t-1}$ and the cell's information is preserved forever (slide 22). By contrast, for a vanilla RNN to preserve information it must learn a $W_h$ with $\tanh(W_hh+W_xx+b)\approx h$ for every input, which is much harder.

:::ex Example 3 — the gradient left after 100 steps
On a cell path whose forget gate stays at $f_s=0.98$, and on an RNN path whose one-step factor has size $0.8$, by what factor is the gradient scaled after 100 steps?
---
Cell: $0.98^{100}\approx0.133$. RNN: $0.8^{100}\approx2.0\times10^{-10}$. Over the same 100 steps the cell path passes on about $13\%$ of the gradient and the RNN path essentially $0$ (the bold and thin curves on the unit's cover).
:::

**The same idea as a residual connection.** With $f_t=1$, $c_t=c_{t-1}+i_t\odot g_t$, so the cell is a **residual connection** in time. Just as the Jacobian $I+\partial F/\partial x$ of a ResNet block $x+F(x)$ makes a gradient shortcut through depth[[ch16:16.6|ResNet: the problem of depth and residual connections.]], the addition in the cell makes a shortcut through time. The forget gate is the valve that lets the network learn by itself when to cut this shortcut (when to erase).

:::warn Not a guarantee — and the notes' diag(f_t) is the derivative along the cell path
As slide 22 says, the LSTM does **not guarantee** that there is no vanishing or exploding gradient. If the network learns a small $f_s$, the gradient on that path still vanishes (that is exactly “forgetting”), and other paths can still explode, so gradient clipping is used as well[[ch19:19.6|Gradient clipping.]]. Also, the notes' $\diag(f_t)$ is the derivative along the **cell path** with the gates held fixed. The gates and the candidate also depend on $c_{t-1}$ through $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$, so the full Jacobian has more terms (see “Going deeper” below).
:::

### Going deeper

:::key The full Jacobian of the cell state
If $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$ and $f_t,i_t,g_t$ are functions of $h_{t-1}$,
$$\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+\Big[\diag(c_{t-1})\frac{\partial f_t}{\partial h_{t-1}}+\diag(g_t)\frac{\partial i_t}{\partial h_{t-1}}+\diag(i_t)\frac{\partial g_t}{\partial h_{t-1}}\Big]\diag\big(o_{t-1}\odot(1-\tanh^2(c_{t-1}))\big)$$
$$\frac{\partial f_t}{\partial h_{t-1}}=\diag\big(f_t\odot(1-f_t)\big)U_f,\quad\frac{\partial i_t}{\partial h_{t-1}}=\diag\big(i_t\odot(1-i_t)\big)U_i,\quad\frac{\partial g_t}{\partial h_{t-1}}=\diag(1-g_t^2)\,U_g$$
:::

The first term $\diag(f_t)$ is the cell path of the notes, and the terms in brackets are paths that enter the gates through $h_{t-1}$. These paths multiply by $U_\bullet$ and are shaved by $\sigma'=\sigma(1-\sigma)\le\frac14$ and $\tanh'\le1$, so they have the same shape as the paths of a vanilla RNN. Expanding the product over several steps, $\prod_s\big(\diag(f_s)+E_s\big)$, the term that picks $\diag(f_s)$ at every step, $\diag\big(\prod_sf_s\big)$, remains as a term of its own. For the same reason that an $I$ term remains in a residual network's product $\prod_k(I+A_k)$, the gradient of the components with $f\approx1$ survives unless the other terms cancel it exactly. This is why the notes and the slides argue with the cell path alone.
` },
      '20.3': { title: 'Language Models: One-Hot Encoding and Embeddings', body: R`
:::idea In plain words
A sentence is a sequence of symbols called words. We number the symbols and turn them into one-hot vectors (tokenization), move them to dense vectors (embeddings) with a learned matrix, and feed them to the LSTM one slot at a time. The LSTM's hidden state becomes “a summary of the sentence read so far”, and the classification layer on top gives the scores of the **next word**. Making a sentence means repeating the guess of the next word.
:::

**Applications of RNNs** (slides 23–24). We look at two. (1) **Language modeling**: sentence generation, machine translation (“The agreement on the European Economic Area was signed in August 1992.” → French), and text summarization are all functions $f_\theta$ that take a sentence and give a sentence. (2) **Image captioning**: naive captioning and captioning with attention (Section 20.5).

**An aside from class** (the drawing on slide 23). In class a picture was drawn of the SIRD model of epidemics (an ordinary differential equation for susceptible S, infected I, recovered R, and dead D), where coefficients such as the infection rate ($\alpha,\beta$; the “infection index” of the notes) are treated as values changing in time, estimated by an LSTM, and fed into the ODE. Read it as an example of an RNN reading the parameters hidden behind a time series; it is not the main line of the slides.

**A sentence is a sequence of discrete symbols** (slide 25). If the vocabulary has size $n$ and each symbol (token) gets a number $k\in\{1,\dots,n\}$, token $k$ becomes the one-hot vector $e_k\in\mathbb R^n$ (only the $k$-th component is $1$). The slide's example “A Man is holding a bat” is a sequence of one-hot vectors $\mathbf x_0,\dots,\mathbf x_5$ with $n=8$.

:::warn The one-hot codes on the slides
On slide 25 “A” and “a” have the same code $[00001000]$, and on slide 28 the output code of the end-of-sentence symbol <EOS> is also $[00001000]$. In a vocabulary that ignores case, “A” and “a” being the same token is natural, but <EOS> must have a number of its own for generation to be able to stop. Read the overlapping codes as a shortcut to keep the pictures simple.
:::

**The RNN language model** (slides 26–28). Stacking the layers from the bottom: one-hot encoding → continuous word embedding → recurrent neural network (LSTM) → continuous output embedding → classification layer.

:::key The RNN language model
$$\mathbf z_t=W_e\mathbf x_t+\mathbf b_e,\qquad\mathbf h_t=\mathrm{LSTM}(\mathbf z_t,\mathbf h_{t-1},\mathbf c_{t-1};\theta),\qquad\hat{\mathbf x}_{t+1}=W_d\mathbf h_t+\mathbf b_d$$
$\mathbf x_t\in\mathbb R^n$ is one-hot, $W_e\in\mathbb R^{d\times n}$, $\mathbf h_t\in\mathbb R^d$, $W_d\in\mathbb R^{n\times d}$. $\softmax(\hat{\mathbf x}_{t+1})$ is the probability distribution of the next token.
:::

**An embedding picks a column.** If $\mathbf x_t=e_k$, then $W_e\mathbf x_t$ is the $k$-th column of $W_e$, so the embedding layer is a lookup table that finds one $d$-dimensional vector per token. One-hot vectors are $n$-dimensional (usually tens of thousands) and any two different words are the same distance $\sqrt2$ apart, while learned embeddings are $d$-dimensional (hundreds) and words used in similar ways can end up close.

**Sentence generation = next-token prediction** (slides 26–28). Feeding the start symbol <SOS> should give the scores of the first word “A”; feeding “A” should give “Man”, …, and feeding “bat” should give <EOS>. This models, with a single network, each factor of the product rule of probability
$$P(x_1,\dots,x_T)=\prod_{t=1}^TP(x_t\mid x_0,\dots,x_{t-1})$$
The hidden state $\mathbf h_{t-1}$ summarizes all the earlier tokens $x_0,\dots,x_{t-1}$, and $\softmax(\hat{\mathbf x}_t)$ gives $P(x_t\mid x_{<t})$.

:::ex Example 4 — parameters of a language model
How many parameters does a language model (embedding → one LSTM layer → classification layer) with vocabulary $n=10{,}000$ and embedding and hidden size $d=256$ have?
---
Embedding $W_e,\mathbf b_e$: $256\cdot10{,}000+256=2{,}560{,}256$. LSTM ($h=d=256$): $4\cdot256\cdot512+4\cdot256=525{,}312$. Classification layer $W_d,\mathbf b_d$: $10{,}000\cdot256+10{,}000=2{,}570{,}000$. Of the total $5{,}655{,}568$, about $91\%$ sit in the embedding and the classification layer, which grow with the vocabulary size. This is like AlexNet's parameters crowding into its fully connected layers[[ch16:16.2|AlexNet: sizes and parameters by layer.]].
:::

### Going deeper

The one-hot vectors could go straight into the LSTM. Then the LSTM's input weights become $4h\times n$, and factoring them as (input weights $4h\times d$)·$W_e$ is exactly the embedding layer. $W_e$ first builds a $d$-dimensional representation shared by the four gates, which, with $h=d$, cuts the input-side weights from $4dn$ to $dn+4d^2$ ($n\gg d$). Also, the classification layer $W_d$ can be seen as a matrix whose rows are $n$ output embeddings, and tying them as $W_d=W_e^T$ (weight tying) is common.
` },
      '20.4': { title: 'Training and Inference of a Language Model', body: R`
:::idea In plain words
In training we push the true sentence in one slot at a time and add up, over all slots, the cross-entropy of an $n$-class classification problem: “guess the next word”. In generation there is no true sentence, so we feed the word the model chose back in as the next slot's input and stop when <EOS> comes out.
:::

**Training** (slide 29). Feeding the input sequence <SOS>, A, Man, …, bat ($\mathbf x_0,\dots,\mathbf x_6$) gives the predictions $\hat{\mathbf x}_1,\dots,\hat{\mathbf x}_7$, which are compared with the true tokens of each slot $\mathbf x_1,\dots,\mathbf x_7$ (A, Man, …, bat, <EOS>).

:::key The training loss of a language model
$$\mathcal L=\sum_{t=1}^T\mathcal L(\hat{\mathbf x}_t,\mathbf x_t)=-\sum_{t=1}^T\log\big[\softmax(\hat{\mathbf x}_t)\big]_{k_t},\qquad\frac{\partial\mathcal L}{\partial\hat{\mathbf x}_t}=\softmax(\hat{\mathbf x}_t)-\mathbf x_t$$
$k_t$ is the number of the $t$-th true token ($\mathbf x_t=e_{k_t}$). Each slot is a word-level classification (cross-entropy).
:::

As the red text on slide 29 says, this is a **word-level classification** at every slot: the loss of the softmax regression of Unit 6, added $T$ times[[ch06:6.2|Likelihood and cross-entropy.]]. The gradient with respect to the logits, $\softmax(\hat{\mathbf x}_t)-\mathbf x_t$, is unchanged too[[ch06:6.3|The gradient of the softmax cross-entropy.]]. This gradient passes through $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$ into $\mathbf h_{t-1}$, and backpropagation through time from Unit 19 carries it to the parameters of every step[[ch19:19.3|Backpropagation through time and truncated BPTT.]].

**Teacher forcing.** In training, the input of slot $t$ is not the word the model predicted at the previous slot but the **true** word $\mathbf x_{t-1}$. This is called teacher forcing (the slides do not name it). Thanks to it all the inputs are known in advance, and one forward pass computes all $T$ losses.

:::fig lmunroll
:::

**Inference** (slides 30–31). With no true sentence, at every slot we pick one word from the scores $S(\mathbf x_t)=\softmax(\hat{\mathbf x}_t)$, feed it back as the next slot's input, and stop when <EOS> is drawn.

:::key Greedy decoding and sampling
- **Greedy**: $x_t=\argmax_kS(\mathbf x_t)_k$ — deterministic, so the same start always gives the same sentence.
- **Probabilistic method**: $x_t\sim S(\mathbf x_t)$ — draws by the probabilities of the scores, giving varied sentences.
The chosen token is fed back as the next input, and generation stops when <EOS> is drawn.
:::

:::ex Example 5 — the cross-entropy of one slot
With a vocabulary of 4, logits $\hat{\mathbf x}_t=(2,1,0,0)$, and the first token correct, find the loss and the gradient of the logits.
---
$p=\softmax(\hat{\mathbf x}_t)=\frac{(e^2,e,1,1)}{e^2+e+2}\approx(0.610,0.225,0.083,0.083)$. The loss is $-\ln p_1=\ln\big(1+e^{-1}+2e^{-2}\big)\approx0.494$ and the gradient is $p-e_1\approx(-0.390,0.225,0.083,0.083)$: raise the logit of the correct token and lower the others, each by its probability.
:::

:::ex Example 6 — greedy does not pick the most probable sentence
For two-token sentences, $P(\text{A})=0.6$, $P(\text{B})=0.4$, the largest probability of a token after A is $0.5$, and after B the token C has probability $0.9$. Which sentence does greedy decoding give, and which sentence is most probable?
---
Greedy picks A at the first slot and then the token of probability $0.5$, for a sentence probability of $0.6\cdot0.5=0.30$. But B, C has $0.4\cdot0.9=0.36$, which is larger. The best choice at each slot is not the best for the whole sentence. Methods such as beam search fill this gap.
:::

### Going deeper

**Temperature.** Sampling from $\softmax(\hat{\mathbf x}_t/\tau)$, $\tau\to0$ corresponds to greedy, $\tau=1$ to plain sampling, and a large $\tau$ approaches the uniform distribution. **Exposure bias.** A model trained with teacher forcing has only seen true inputs, so at inference it can be fragile when its own mistakes come back as inputs. Both lie outside the slides; it is enough to know them as an aid to understanding the slides' two methods.
` },
      '20.5': { title: 'Machine Translation and Image Captioning', body: R`
:::idea In plain words
Translation is “read the input sentence to the end → write it again in another language”. An **encoder** RNN reads the input sentence to the end and summarizes it in its last state $\mathbf s$, and a **decoder** RNN, a language model starting from $\mathbf s$, writes the translation one word at a time. Image captioning is the same structure with a CNN in the encoder's place.
:::

**Machine translation** (slide 32). “He loved to eat .” is embedded and fed to the encoder LSTM, and its last state $\mathbf s$ is passed to the decoder as the starting state. The decoder starts from NULL (the start symbol) and generates “Er liebte zu essen .” one word at a time, with a softmax classification at every slot. It is a many-to-many structure whose input and output lengths differ[[ch19:19.1|The five input–output structures of RNNs.]].

:::key Encoder–decoder and image captioning
$$\mathbf s=\mathrm{Enc}(x_1,\dots,x_m),\qquad P(y_1,\dots,y_T\mid x)=\prod_{t=1}^TP(y_t\mid y_0,\dots,y_{t-1},\mathbf s)$$
Image captioning is $f_\theta\big(y\mid g_\phi(\mathbf x)\big)$: a CNN $g_\phi$ extracts the visual features of the image, and an RNN $f_\theta$ produces a sentence conditioned on those features.
:::

:::fig encdec
:::

The decoder is exactly the language model of Section 20.3, except that its starting state is the summary $\mathbf s$ of the input sentence instead of $\mathbf 0$. Training is as in Section 20.4: the true translation goes in by teacher forcing and the cross-entropies of the slots are added, and the gradient of the loss flows back through the decoder and $\mathbf s$ all the way into the encoder.

**Image captioning** (slides 33–34). The task is to describe an image $\mathbf x$ with a natural-language sentence $\mathbf y$ (e.g., “man in black shirt is playing guitar.”). The work splits into two stages: (1) a **CNN** that recognizes the visual patterns in the image[[ch15:15.5|Pooling layers and fully connected layers.]], and (2) an **RNN** that generates a sentence conditioned on the image. In class this was written $f_\theta(\mathbf y\mid g_\phi(\mathbf x))$, marking that the encoder CNN ($g_\phi$) and the decoder RNN ($f_\theta$) are different functions with different parameters. The simplest method sets the RNN's starting state from the CNN's last feature vector (e.g., the 4096 dimensions just before the classification layer).

:::warn Attention is not covered yet
Slides 23 and 33 announce “image captioning with attention”, but the slides received (23–34) do not contain it. The motivation is clear, though: the whole of a long input has to fit into one vector of fixed size ($\mathbf s$, or one CNN feature), which creates an information bottleneck, and attention removes it by letting the decoder look again at several positions of the input at every slot.
:::

:::ex Example 7 — the decoder's inputs and targets
If the target translation is “Er liebte zu essen .”, what are the decoder's input sequence and target sequence during training, and how many cross-entropy terms are added?
---
The inputs are NULL, Er, liebte, zu, essen and the targets are Er, liebte, zu, essen, “.”. Five cross-entropy terms are added, one per slot (with a separate end-of-sentence symbol, one more slot is appended).
:::
` },
    },
    probs: [
      { q: R`In an LSTM, what decides how much of the information in the previous cell state $c_{t-1}$ to keep?`,
        choices: [R`The input gate $i$`, R`The forget gate $f$`, R`The output gate $o$`, R`The candidate $g$`],
        sol: R`In $c_t=f\odot c_{t-1}+i\odot g$, $f$ is what multiplies $c_{t-1}$. The notes: “how much of the information in $c_{t-1}$ to carry along”.` },
      { q: R`In what range do the values of the LSTM's candidate $g$ (the slide's “gate gate”) lie?`,
        choices: [R`$(0,1)$`, R`$(-1,1)$`, R`$[0,\infty)$`, R`All of $\mathbb R$`],
        sol: R`$g=\tanh(\cdot)$, so $(-1,1)$. The gates $i,f,o$ use $\sigma$ and lie in $(0,1)$; $g$ is not a valve but the content to add to (or subtract from) the cell.` },
      { q: R`In a scalar LSTM, $c_{t-1}=1$ and the pre-activations are $i$: $\ln3$, $f$: $0$, $g$: $\ln3$. Find $c_t$.`,
        sol: R`$i=\sigma(\ln3)=\frac34$, $f=\sigma(0)=\frac12$, $g=\tanh(\ln3)=\frac{3-1/3}{3+1/3}=\frac45$. $c_t=\frac12\cdot1+\frac34\cdot\frac45=0.5+0.6=1.1$.` },
      { q: R`In the previous problem, if the pre-activation of the output gate is $0$, what is $h_t$? (You may enter an expression.)`,
        sol: R`$o=\sigma(0)=\frac12$, $h_t=o\tanh(c_t)=\frac12\tanh(1.1)\approx\frac12\cdot0.8005=0.4002$.` },
      { q: R`How many parameters (including biases) does one LSTM layer have when the input and hidden sizes are both $100$ ($d=h=100$)?`,
        sol: R`$4h(h+d)+4h=4\cdot100\cdot200+400=80{,}400$. The $W\in\mathbb R^{4h\times2h}$ of slide 19 is $400\times200$.` },
      { q: R`How many parameters (including biases) does one LSTM layer with input size $d=128$ and hidden size $h=256$ have?`,
        sol: R`$4h(h+d)+4h=4\cdot256\cdot384+1{,}024=393{,}216+1{,}024=394{,}240$. That is four times a vanilla RNN of the same sizes ($98{,}560$).` },
      { q: R`Split $W$ into blocks to show that the one-line formula of slide 18, $\begin{pmatrix}i\\f\\o\\g\end{pmatrix}=\begin{pmatrix}\sigma\\\sigma\\\sigma\\\tanh\end{pmatrix}W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}$, and the gate-by-gate formulas of the notes, $i_t=\sigma(W_ix_t+U_ih_{t-1}+b_i)$ and so on, are the same formula, and give the size of $W$.`,
        sol: R`Splitting $W=\begin{pmatrix}U_i&W_i\\U_f&W_f\\U_o&W_o\\U_g&W_g\end{pmatrix}$ ($U_\bullet\in\mathbb R^{h\times h}$, $W_\bullet\in\mathbb R^{h\times d}$), the block product makes the $\bullet$-th block of $W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}$ equal to $U_\bullet h_{t-1}+W_\bullet x_t$. Cutting into pieces of $h$ from the top and applying $\sigma,\sigma,\sigma,\tanh$ componentwise (after adding the bias $b=(b_i;b_f;b_o;b_g)$) gives the four formulas of the notes. $W\in\mathbb R^{4h\times(h+d)}$, which with $d=h$ is the $4h\times2h$ of slide 19.`,
        rubric: R`- Block splitting and the block product — 2 points
- Componentwise activations and the bias — 1 point
- The size of $W$ (general form and the case $d=h$) — 1 point` },
      { q: R`In the remark of the notes, what is the Jacobian of the cell path, $\partial c_t/\partial c_{t-1}$?`,
        choices: [R`$\diag(i_t)$`, R`$\diag(f_t)$`, R`$\diag(o_t)\,U_f$`, R`$\diag(1-c_t^2)$`],
        sol: R`With the gates fixed in $c_t=f_t\odot c_{t-1}+i_t\odot g_t$, each component is just multiplied by $f_{t,j}$, so it is $\diag(f_t)$. With $f_t\approx1$ it is almost the identity.` },
      { q: R`What is $\partial h_t/\partial h_{t-1}$ for the vanilla RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$?`,
        choices: [R`$\diag(1-h_t^2)\,W_h$`, R`$W_h\diag(1-h_{t-1}^2)$`, R`$\diag(h_t)\,W_h$`, R`$\diag(1-h_t)\,W_h$`],
        sol: R`With $a_t=W_hh_{t-1}+\cdots$ and $h_t=\tanh(a_t)$, the chain rule gives $\diag(\tanh'(a_t))\,W_h=\diag(1-h_t^2)\,W_h$. The activation's derivative sits outside (on the left) and is computed from this step's $h_t$.` },
      { q: R`If the forget gate stays at $0.98$, by what factor is the gradient scaled after 100 steps along the cell path? (You may enter an expression.)`,
        sol: R`$\prod_sf_s=0.98^{100}\approx0.133$. Compare with $0.8^{100}\approx2\times10^{-10}$ for an RNN path with one-step factor $0.8$.` },
      { q: R`If a component keeps $f=1$ and $i=0$, what happens to the cell state?`,
        choices: [R`It is erased to $0$`, R`Its previous value is preserved unchanged forever`, R`It is halved at every step according to the output gate`, R`It turns into the candidate $g$`],
        sol: R`$c_t=1\cdot c_{t-1}+0\cdot g_t=c_{t-1}$. Slide 22: “the information of that cell is preserved indefinitely”.` },
      { q: R`(1) For the LSTM's $c_t=f_t\odot c_{t-1}+i_t\odot g_t$, show that $\partial c_t/\partial c_{t-1}=\diag(f_t)$ with the gates fixed, and write the Jacobian for going back $k$ steps along the cell path. (2) For the vanilla RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$, derive $\partial h_t/\partial h_{t-1}=\diag(1-h_t^2)W_h$ and show $\lVert\partial h_t/\partial h_{t-k}\rVert\le\lVert W_h\rVert^k$. (3) Use the two results to explain why an LSTM learns long dependencies more easily.`,
        sol: R`**(1)** In components $c_{t,j}=f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$. With the gates fixed, $\partial c_{t,j}/\partial c_{t-1,l}=f_{t,j}\delta_{jl}$, that is, $\diag(f_t)$. By the chain rule, $\frac{\partial c_t}{\partial c_{t-k}}=\diag(f_t)\cdots\diag(f_{t-k+1})=\diag\big(\prod_{s=t-k+1}^tf_s\big)$.
**(2)** With $a_t=W_hh_{t-1}+W_xx_t+b$, $\partial a_t/\partial h_{t-1}=W_h$, and the Jacobian of $h_t=\tanh(a_t)$ is $\diag(1-\tanh^2a_t)=\diag(1-h_t^2)=:D_t$. So $\partial h_t/\partial h_{t-1}=D_tW_h$. Over $k$ steps it is $D_tW_h\cdots D_{t-k+1}W_h$, and since $0<1-h^2\le1$, $\lVert D_s\rVert\le1$, and the norm product inequality gives $\le\lVert W_h\rVert^k$.
**(3)** The RNN's product contains the same $W_h$ $k$ times, so it vanishes exponentially if $\lVert W_h\rVert<1$ (and may explode if it is large), and the saturation of $\tanh$ ($h\approx\pm1$) also shaves the gradient. On the cell path there is neither a matrix product nor an activation derivative, only $\prod f_s$ componentwise, so if the network learns $f\approx1$ the gradient reaches the distant past almost unchanged ($c_t=c_{t-1}$ when $f=1,i=0$). Still, other paths through the gates exist, so vanishing and exploding do not disappear completely.`,
        rubric: R`- (1) $\diag(f_t)$ by componentwise differentiation and the $k$-step product — 3 points
- (2) $\diag(1-h_t^2)W_h$ by the chain rule and $\tanh'=1-\tanh^2$ — 3 points
- (2) $\lVert D_s\rVert\le1$ and the norm product inequality — 2 points
- (3) The comparison and its limit (not a guarantee) — 2 points` },
      { q: R`Taking into account that the gates and the candidate depend on $c_{t-1}$ through $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$, derive the full formula of $\partial c_t/\partial c_{t-1}$ (gates of the form $f_t=\sigma(W_fx_t+U_fh_{t-1}+b_f)$). Explain which term of the formula the notes' $\diag(f_t)$ is, and why that term matters in the product over several steps.`,
        sol: R`Differentiating $c_t=f_t\odot c_{t-1}+i_t\odot g_t$ by the product rule, the $f_t$ that directly multiplies $c_{t-1}$ gives $\diag(f_t)$, and $f_t$, $i_t$, $g_t$ changing through $h_{t-1}$ give $\diag(c_{t-1})\frac{\partial f_t}{\partial c_{t-1}}+\diag(g_t)\frac{\partial i_t}{\partial c_{t-1}}+\diag(i_t)\frac{\partial g_t}{\partial c_{t-1}}$. By the chain rule, $\frac{\partial f_t}{\partial c_{t-1}}=\diag(f_t\odot(1-f_t))U_f\frac{\partial h_{t-1}}{\partial c_{t-1}}$ (likewise $\sigma'$ for $i_t$, and $\diag(1-g_t^2)U_g$ for $g_t$), with $\frac{\partial h_{t-1}}{\partial c_{t-1}}=\diag(o_{t-1}\odot(1-\tanh^2(c_{t-1})))$.
So $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+E_t$, $E_t=\big[\diag(c_{t-1})\diag(f_t\odot(1-f_t))U_f+\diag(g_t)\diag(i_t\odot(1-i_t))U_i+\diag(i_t)\diag(1-g_t^2)U_g\big]\diag(o_{t-1}\odot(1-\tanh^2c_{t-1}))$.
The notes' $\diag(f_t)$ is the first term (the cell path). $E_t$ is an RNN-like path that multiplies by $U_\bullet$ and is shaved by $\sigma'\le\frac14$ and $\tanh'\le1$. Expanding the $k$-step product $\prod_s(\diag(f_s)+E_s)$, $\diag(\prod_sf_s)$ is a term of its own, and, just as an $I$ term remains in ResNet's $\prod(I+A_k)$, it protects the gradient of the components with $f\approx1$ unless the other terms cancel it.`,
        rubric: R`- Separating the direct term and the gate paths by the product rule — 3 points
- The gate derivatives $\sigma'$, $\tanh'$ and $\partial h_{t-1}/\partial c_{t-1}$ — 3 points
- Which term the notes use, and the expansion argument for the product — 2 points` },
      { q: R`Which is the correct conclusion of slide 22?`,
        choices: [R`The LSTM guarantees no vanishing or exploding gradients`, R`The LSTM does not guarantee the absence of vanishing or exploding gradients, but it makes long-distance dependencies easier to learn`, R`The LSTM replaces gradient clipping, so clipping is no longer needed`, R`The LSTM always fixes the forget gate at $1$`],
        sol: R`“LSTM doesn't guarantee that there is no vanishing/exploding gradient, but it does provide an easier way for the model to learn long-distance dependencies.” $f$ is learned, and if it becomes small the gradient on that path vanishes.` },
      { q: R`What is $W_e\mathbf x_t$, the one-hot vector $\mathbf x_t=e_k\in\mathbb R^n$ multiplied by the embedding matrix $W_e\in\mathbb R^{d\times n}$?`,
        choices: [R`The $k$-th row of $W_e$`, R`The $k$-th column of $W_e$`, R`The sum of all columns of $W_e$`, R`$W_e$ with only the $k$-th component kept`],
        sol: R`$W_ee_k$ is the $k$-th column of $W_e$. So the embedding layer is a lookup table that finds a $d$-dimensional vector for each token, and in training only that column receives a gradient.` },
      { q: R`With vocabulary $n=10{,}000$ and embedding size $d=256$, how many parameters does the embedding layer $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$ have?`,
        sol: R`$W_e\in\mathbb R^{256\times10{,}000}$ has $2{,}560{,}000$ and $\mathbf b_e$ has $256$, for $2{,}560{,}256$.` },
      { q: R`On slides 26–28, what is “sentence generation” in an RNN language model?`,
        choices: [R`Classifying the whole sentence at once`, R`Repeating the prediction of the next token`, R`Sorting the one-hot vectors`, R`Predicting the length of the sentence`],
        sol: R`“Sentence generation = predicting a next token.” Starting from <SOS>, each predicted token is fed in as the next input until <EOS>.` },
      { q: R`Using the product rule of probability $P(x_1,\dots,x_T)=\prod_tP(x_t\mid x_{<t})$, explain how an RNN language model represents the probability of a sentence. Make clear the roles of the hidden state $\mathbf h_{t-1}$ and of $\softmax(\hat{\mathbf x}_t)$.`,
        sol: R`By the product rule, the joint probability of a sentence is the product of the conditional probabilities of the next token given the earlier tokens. The RNN summarizes the whole beginning into a vector of fixed size, $\mathbf h_{t-1}=$ (the state after the LSTM has read $x_0,\dots,x_{t-1}$ in order), and the softmax of $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$ gives $P(x_t\mid x_{<t})$. All slots share the same parameters, so one model handles sentences of different lengths. The log probability of the sentence is the sum of the slots' $\log\softmax(\hat{\mathbf x}_t)_{k_t}$, and its negative is the training loss.`,
        rubric: R`- The product of conditional probabilities by the product rule — 1 point
- $\mathbf h_{t-1}$ as a summary of the beginning — 1 point
- $\softmax(\hat{\mathbf x}_t)$ as the next token's distribution, and the relation of the log probability to the loss — 2 points` },
      { q: R`With a vocabulary of 3, logits $(1,0,0)$, and the second token correct, what is the cross-entropy loss of the slot? (You may enter an expression.)`,
        sol: R`$p_2=\frac{e^0}{e^1+e^0+e^0}=\frac1{e+2}$, so the loss is $-\ln p_2=\ln(e+2)\approx1.551$.` },
      { q: R`For the language-model loss $\mathcal L=-\sum_{t=1}^T\log[\softmax(\hat{\mathbf x}_t)]_{k_t}$ with $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$, show (1) $\partial\mathcal L/\partial\hat{\mathbf x}_t=\softmax(\hat{\mathbf x}_t)-\mathbf x_t$ and (2) $\partial\mathcal L/\partial W_d=\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$, $\partial\mathcal L/\partial\mathbf b_d=\sum_t(\mathbf p_t-\mathbf x_t)$ ($\mathbf p_t=\softmax(\hat{\mathbf x}_t)$), and (3) explain which columns of $W_e$ receive a gradient through the embedding $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$.`,
        sol: R`**(1)** The loss of one slot is $\ell=-\hat x_{k}+\log\sum_je^{\hat x_j}$ ($k=k_t$). $\partial\ell/\partial\hat x_m=-\delta_{mk}+\frac{e^{\hat x_m}}{\sum_je^{\hat x_j}}=p_m-\delta_{mk}$, that is, $\mathbf p_t-\mathbf x_t$. Since $\hat{\mathbf x}_t$ appears only in the loss of slot $t$, the same holds for $\mathcal L$.
**(2)** $\hat x_{t,m}=\sum_lW_{d,ml}h_{t-1,l}+b_{d,m}$, so $\partial\hat x_{t,m}/\partial W_{d,ml}=h_{t-1,l}$. By the chain rule $\partial\mathcal L/\partial W_{d,ml}=\sum_t(p_{t,m}-x_{t,m})h_{t-1,l}$, in matrix form $\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$. The bias gets $\sum_t(\mathbf p_t-\mathbf x_t)$. All slots share the same $W_d$, so the slots' contributions are added.
**(3)** With $\delta_t=\partial\mathcal L/\partial\mathbf z_t$ (computed by backpropagation through time), $\partial\mathcal L/\partial W_e=\sum_t\delta_t\mathbf x_t^T$. If $\mathbf x_t=e_{k}$, then $\delta_te_k^T$ is a matrix whose only nonzero column is the $k$-th, equal to $\delta_t$, so only the columns of the tokens in the sentence receive a gradient.`,
        rubric: R`- (1) $\mathbf p_t-\mathbf x_t$ by differentiating the log-sum-exp — 3 points
- (2) Componentwise derivatives and the sum over slots (sharing) — 3 points
- (2) The bias — 1 point
- (3) $\delta_t\mathbf x_t^T$ and the reading that only one column gets a gradient — 3 points` },
      { q: R`In training as on slide 29, what is fed as the input of slot $t$?`,
        choices: [R`The token the model predicted at the previous slot`, R`The previous token of the true sentence, $\mathbf x_{t-1}$`, R`Always <SOS>`, R`A random token`],
        sol: R`In training the true tokens go in (teacher forcing), so all inputs are known in advance and the $T$ losses are computed at once. Feeding back the model's predictions is for inference.` },
      { q: R`For two-token sentences, $P(\text{A})=0.55$, $P(\text{B})=0.45$, the largest probability of a token after A is $0.6$, and after B the token C has probability $0.9$. What is the probability of the most probable two-token sentence?`,
        sol: R`Greedy picks A and gets $0.55\cdot0.6=0.33$, but B, C with $0.45\cdot0.9=0.405$ is the largest (every token after A has probability at most $0.6$, so at most $0.33$). An example where greedy decoding does not guarantee the best sentence.` },
      { q: R`Which comparison of greedy decoding and probabilistic sampling is correct?`,
        choices: [R`Greedy always gives the same sentence from the same start, while sampling can give a different sentence on each run`, R`Sampling always gives the most probable sentence`, R`Greedy does not stop even when it picks <EOS>`, R`The two have different training losses`],
        sol: R`Greedy is the $\argmax$, so it is deterministic; sampling is $x_t\sim S(\mathbf x_t)$, so it is random. Both are only inference methods with the same training loss, and both stop at <EOS>.` },
      { q: R`In the encoder–decoder translation of slide 32, what is $\mathbf s$?`,
        choices: [R`The first word of the translation`, R`The encoder's state after reading the whole input sentence (a summary of the sentence)`, R`The decoder's softmax output`, R`The size of the vocabulary`],
        sol: R`The encoder's last state $\mathbf s$ after reading all of “He loved to eat .” is passed to the decoder as its starting state. The decoder is a language model conditioned on $\mathbf s$.` },
      { q: R`In image captioning $f_\theta(\mathbf y\mid g_\phi(\mathbf x))$, what is the role of $g_\phi$?`,
        choices: [R`The RNN that generates the sentence`, R`The CNN that extracts the visual patterns (features) of the image`, R`Tokenization that turns words into one-hot vectors`, R`The loss function`],
        sol: R`Slide 34: (1) recognizing visual patterns is the CNN ($g_\phi$), (2) generating a sentence conditioned on the image is the RNN ($f_\theta$).` },
      { q: R`For the target translation “Er liebte zu essen .”, write the decoder's input sequence and target sequence during training and say what the loss is a sum of. Also give the weakness of a structure that stores the whole input sentence in one vector $\mathbf s$, and the remedy the slides announce.`,
        sol: R`Inputs (teacher forcing): NULL, Er, liebte, zu, essen. Targets: Er, liebte, zu, essen, “.”. The loss is the sum of five terms $-\log P(y_t\mid y_{<t},\mathbf s)$ (softmax cross-entropies), one per slot, and the gradient flows through the decoder and $\mathbf s$ into the encoder. Weakness: however long the input, it must fit into one $\mathbf s$ of fixed size, an information bottleneck. Attention, announced on slides 23 and 33, removes it by letting the decoder look again at several positions of the input at every slot.`,
        rubric: R`- The input and target sequences (shifted by one slot) — 2 points
- The sum of the slots' cross-entropies and the path of the gradient — 1 point
- The bottleneck and attention — 1 point` },
    ],
  };
})();
