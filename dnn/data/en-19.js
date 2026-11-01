/* English text — 19 Recurrent Networks & Backpropagation Through Time (W9 Wed slides 1–17 and the notes after slide 9). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '접은 그림': 'folded',
    '펼친 그림: 시점마다 같은 가중치': 'unrolled: the same weights at every step',
    '접은 RNN과 펼친 RNN': 'Folded and unrolled RNN',
    '두 단계 RNN의 계산 그래프와 W의 세 경로': 'Computational graph of the two-step RNN and the three paths of W',
    '최근 k걸음만 역전파': 'backprop only the last k steps',
    '순전파: 은닉 상태를 처음부터 계속 넘긴다': 'forward: hidden states carried from the start',
    '역전파': 'backprop',
    '첫 상태는 상수로 넘겨받음': 'first state passed in as a constant',
    '잘린 시간 역전파': 'Truncated backpropagation through time',
  });
  Object.assign(EM.en.fig, {
    rnnunroll: R`(Left) An RNN is a network whose hidden state $\mathbf h$ loops back into itself. (Right) Unrolling the loop along time gives a chain in which the same cell is copied at every step. In the notation of slide 6, $\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b)$, $\hat{\mathbf y}_t=\mathbf W^{out}\mathbf h_t$, $\mathbf h_0=\mathbf 0$, and every step uses the **same** $\mathbf U$, $\mathbf W$, $\mathbf W^{out}$.`,
    rnn2step: R`The two-step RNN of the notes: $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$, $L_t=\frac12(Y_t-Z_t)^2$. The two arrows leaving $W$ at the bottom mean that $W$ is used at **both** steps. There are three paths from $W$ to the loss: ① $W\to h_1\to Y_1\to L_1$, ② $W\to h_2\to Y_2\to L_2$ (direct), ③ $W\to h_1\to h_2\to Y_2\to L_2$ (across time). $\partial L/\partial W$ is the sum of the chain-rule products along these three paths.`,
    tbptt: R`Truncated BPTT (slide 9). Hidden states are carried forward from the start to the end of the sequence (bottom arrow), but the loss and the backpropagation are computed only inside the chunk of the last $k$ steps (dashed box). The first state $h_{t_0}$ of the chunk is treated as a constant passed in from the previous chunk, so the gradient paths reaching further back are cut.`,
  });
  EM.en.ch[19] = {
    title: 'Recurrent Networks and Backpropagation Through Time',
    fig: R`The log of products $\gamma^k$ of Jacobian factors: as the number of steps $k$ grows, the curves with $\gamma>1$ explode upward and those with $\gamma<1$ vanish downward; the dashed line is the gradient clipping threshold`,
    tagline: R`An RNN repeats the same function with the same parameters at every step and remembers the order it has seen in its hidden state $h_t$. Unrolled, it becomes a very deep network, and backpropagation climbs back through time multiplying Jacobians — a product that makes the gradient explode or vanish.`,
    summary: R`We study **recurrent neural networks** (RNNs), which handle data such as sentences, speech, and video whose length varies and whose order matters. Starting from the five shapes of input and output (one to one, one to many, many to one, and two kinds of many to many), we see that unrolling the **vanilla RNN** $h_t=\sigma(Uh_{t-1}+Wx_t+b)$ along time gives a long computational graph in which every step uses the same weights. Training is backpropagation on this graph, **backpropagation through time** (BPTT), and for long sequences **truncated BPTT** backpropagates only the last few steps. Following the class notes, we derive the **gradients of a two-step scalar RNN** $\partial L/\partial V,\partial L/\partial c,\partial L/\partial W,\partial L/\partial U,\partial L/\partial b$ path by path with the chain rule (the part marked for Quiz 2), and extend it to many steps to obtain the **backward recursion** in which $\partial\mathcal L/\partial h_\ell$ is a product of Jacobians $\partial h_{k+1}/\partial h_k$. Finally we cover the **exploding gradients** (fixed by clipping) and **vanishing gradients** (leading to the LSTM) that this product causes.`,
    goals: [
      R`Explain why RNNs are needed (variable-length sequence data) and name the five input–output shapes with examples`,
      R`Write the forward pass of the vanilla RNN and explain the unrolled graph, parameter sharing, and why the number of parameters does not depend on the length`,
      R`Explain what backpropagation through time (BPTT) and truncated BPTT compute and what they drop`,
      R`Derive $\partial L/\partial V$, $\partial L/\partial c$, $\partial L/\partial W$, $\partial L/\partial U$, $\partial L/\partial b$ for a two-step scalar RNN with the chain rule path by path, and point out the terms that vanish when $h_0=0$`,
      R`Derive $\partial\mathcal L/\partial\tilde\theta=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}$ and the backward recursion $\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))W$ for a many-step RNN`,
      R`Explain the conditions for vanishing and exploding gradients with the bound $(\gamma\lVert W\rVert_2)^{L-\ell}$ on a product of Jacobians`,
      R`Prove the properties of gradient clipping $g\leftarrow\min(1,v/\lVert g\rVert)g$ and explain why vanishing gradients are the bigger problem`,
    ],
    secTitles: { '19.1': 'Why RNNs', '19.2': 'Vanilla RNN', '19.3': 'BPTT', '19.4': 'Two-step gradients', '19.5': 'Many-step backprop', '19.6': 'Exploding · vanishing' },
    secs: {
      '19.1': { title: 'Why RNNs: Sequence Data and Five Shapes', body: R`
:::idea In plain words
The networks so far (MLPs, CNNs) take one input of fixed size and give one output. But much data — sentences, speech, videos, stock prices — **varies in length and depends on order**. A recurrent neural network (RNN) reads the elements one at a time, keeps a summary of what it has seen so far in a **hidden state**, and updates that state with the next element.
:::

**Sequence data.** The one-line summary of slide 3 is “RNNs are networks to process or generate **sequence (or variable-length) data**.” They are divided into five shapes by which of input and output is a sequence (on the slide, red boxes are inputs, green boxes hidden states, blue boxes outputs).

| Shape | Input → output | Examples (slide 3) |
|---|---|---|
| one to one | one vector → one vector | ordinary network (FFN, no recurrence) |
| one to many | one → sequence | image → video, image → caption |
| many to one | sequence → one | video classification, action recognition |
| many to many (delayed) | read the whole sequence, then → sequence | translation (English → Korean), video → caption |
| many to many (synchronous) | one input → one output at every step | video segmentation, video editing, video style transfer |

:::key Input–output shapes of an RNN
An RNN reads a sequence $x_1,\dots,x_T$ one element at a time and updates its hidden state $h_t$ at every step. Depending on when it produces outputs it is one to many, many to one, or many to many (delayed, producing outputs after reading the whole input, or synchronous, producing one at every step); one to one is an ordinary network without recurrence.
:::

**Time marks in the notes** (slide 2). For many to one, $t=1,2,3$ is written under the inputs and the output is only at $t=3$. For the delayed many to many, the inputs are marked $t=1,2,3$ and the outputs $t=4,5,6$. It is like translation, where the first word can be chosen only after reading the sentence to the end.

**Why an MLP will not do.** An MLP has a fixed input size, so sentences of different lengths cannot be fed as they are, and padding with zeros to the longest length makes the parameters grow with the length. The bigger problem is that it uses different weights at each position, so a pattern learned at the 3rd position (e.g., “not good”) must be learned again at the 10th. An RNN solves both by using **the same weights at every step** (19.2).

### Going deeper

Just as a convolutional layer uses the same filter at every position in space[[ch15:15.6|Weight sharing and translation equivariance of convolutional layers.]], an RNN uses the same update rule at every step in time. The difference is that a convolution output sees only a few nearby cells, while the RNN's $h_t$ in principle depends on **all** of $x_1,\dots,x_t$. This unlimited memory is both the strength and the source of the gradient problems of 19.6.
` },
      '19.2': { title: 'The Vanilla RNN and the Unrolled Graph', body: R`
:::idea In plain words
An RNN is a network with a loop that comes back to itself. Unrolling the loop along time gives a long chain in which the same cell is copied at every step, and every cell uses **the same weights**. So however long the chain is, the number of parameters stays the same.
:::

**Internal state** (slide 4). Key idea: RNNs have an **internal state** that is updated as a sequence is processed. The arrow from the RNN box back into itself in the picture is that state.

**Unrolled RNN** (slide 5). At every step the network takes an input $x_t$, updates the state, and gives an output $y_t$. The notes write this as $h_t=f(h_{t-1},x_t)$, $y_t=g(h_t)$. $h_2$ is determined by $x_2$ and $h_1$, and $h_1$ carries the information of $x_1$.

:::key Vanilla RNN
$$\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b),\qquad\hat{\mathbf y}_t=\mathbf W^{out}\mathbf h_t,\qquad\mathbf h_0=\mathbf 0\qquad(t\ge1)$$
$\mathbf U$ is the hidden → hidden (recurrent) weight, $\mathbf W$ the input → hidden weight, and $\mathbf W^{out}$ the hidden → output weight (notation of slide 6). **The same function and the same parameters are used at every step.**
:::

:::fig rnnunroll
:::

:::hand Class notes — the first two steps (slide 6)
$t=1$, input $\mathbf x_1$: $\mathbf h_1=\sigma(\mathbf W\mathbf x_1+\mathbf b)\ \to\ \hat{\mathbf y}_1=\mathbf W^{out}\mathbf h_1$. (Since $\mathbf h_0=\mathbf 0$, there is no $\mathbf U\mathbf h_0$ term.)

$t=2$, input $\mathbf x_2$: $\mathbf h_2=\sigma(\mathbf U\mathbf h_1+\mathbf W\mathbf x_2+\mathbf b)\ \to\ \hat{\mathbf y}_2=\mathbf W^{out}\mathbf h_2$.

The notes circle $\mathbf W$, $\mathbf b$, $\mathbf W^{out}$ to stress that both steps use the **same** matrices. There are no separate $\mathbf W_1,\mathbf W_2,\dots$ per step (slide: “the same function and the same set of parameters are used at every time step”).
:::

**General form** (slide 7). New state = (some function with parameters $W$)(old state, input at this step), output = (another function with parameters $W_{hy}$)(new state):
$$h_t=f_W(h_{t-1},x_t),\qquad y_t=f_{W_{hy}}(h_t).$$
The vanilla RNN chooses $f_W(h,x)=\sigma(Uh+Wx+b)$, and the LSTM of Unit 20 chooses $f_W$ to be a more complicated function with gates.

:::warn The weight names differ between slides
Slide 6 writes $\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b)$, with **$\mathbf U$ recurrent and $\mathbf W$ the input** weight, while the notes after slide 9 (19.4) write $h_t=\tanh(Wh_{t-1}+Ux_t+b)$, with **$W$ recurrent and $U$ the input** weight. The many-step notes (19.5) call the hidden bias $c$ and the output bias $b$, and LSTM slide 18 uses $W$ for the matrix stacking the four gates. Write the forward pass on the first line of an answer to state **your own notation**. This unit follows slide 6 in 19.1–19.3 and the notes from 19.4 on.
:::

**Number of parameters.** With an $m$-dimensional input, $n$-dimensional hidden state, and $p$-dimensional output, $\mathbf U\in\mathbb R^{n\times n}$, $\mathbf W\in\mathbb R^{n\times m}$, $\mathbf b\in\mathbb R^n$, $\mathbf W^{out}\in\mathbb R^{p\times n}$, so there are $n^2+nm+n+pn$ in all, independent of the sequence length $T$.

:::ex Example 1 — three forward steps
Feeding $x=(2,1,0.5)$ to the scalar RNN $h_t=\ReLU(0.5h_{t-1}+x_t)$, $\hat y_t=2h_t$, $h_0=0$ (in the notation of slide 6, $U=0.5$, $W=1$, $b=0$, $W^{out}=2$), what is $\hat y$?
---
$h_1=\ReLU(0+2)=2$, $h_2=\ReLU(1+1)=2$, $h_3=\ReLU(1+0.5)=1.5$, so $\hat y=(4,4,3)$. If the ReLU is on at every step, $h_3=0.25x_1+0.5x_2+x_3$. The influence of past inputs shrinks by a factor $U=0.5$ per step, the same phenomenon as the vanishing gradient of 19.6.
:::

### Going deeper

A vanilla RNN usually uses $\tanh$ as the hidden activation. Its output is bounded in $(-1,1)$, so the state does not run away from step to step, and its slope is 1 near 0, which makes early training easy. On the other hand, for large $\lvert a\rvert$ it saturates and $\tanh'(a)=1-\tanh^2a\approx0$, and this factor enters the products of backpropagation directly (19.4, 19.6).
` },
      '19.3': { title: 'Backpropagation Through Time and Truncated BPTT', body: R`
:::idea In plain words
An unrolled RNN is simply a very long computational graph. So training is ordinary backpropagation: compute forward through the whole sequence to get the loss, then go backward through the whole sequence to get the gradient. This is called **backpropagation through time** (BPTT).
:::

**Computational graph and backpropagation** (slide 8). The losses of all steps gather into one loss $L=\sum_tL_t$, and we “forward through the entire sequence to compute the loss, then backward through the entire sequence to compute the gradient.” Since all steps share the parameters, the gradients coming from each step are **added**, as for a variable used by several nodes of a computational graph[[ch09:9.4|The copy gate (gradient adder): the gradient of a variable used in several places is the sum of the gradients coming from each use.]].

:::key Two principles of BPTT
(1) The loss of the unrolled graph is $L=\sum_{t=1}^TL_t$. (2) Since every step uses the same parameter $\theta$, writing $\theta^{(t)}$ for the copy used at step $t$, $\frac{\partial L}{\partial\theta}=\sum_{t=1}^T\frac{\partial L}{\partial\theta^{(t)}}$.
:::

**Memory and time.** Backpropagation needs every $h_t$ of the forward pass, so the memory grows with $T$, and a single parameter update requires one forward and one backward pass over the whole sequence (which might be an entire book).

**Truncated BPTT** (slide 9). “Carry hidden states forward in time forever, but only backpropagate for **some smaller number of steps**.” Split the sequence into chunks of $k$ steps, and for each chunk (1) run forward starting from the last state of the previous chunk, (2) backpropagate with the loss of this chunk only, (3) update the parameters, and (4) pass the last state on to the next chunk.

:::fig tbptt
:::

:::key Truncated BPTT
Hidden states are carried forward from the start of the sequence, but backpropagation runs only inside the chunk of the last $k$ steps. The first state $h_{t_0}$ of the chunk is treated as a **constant** passed in from before, which amounts to setting $\partial h_{t_0}/\partial\theta$ to 0, so every gradient path that goes through $h_{t_0}$ to earlier steps is cut.
:::

The first state $h_{t_0}$ of a chunk is not 0. So the terms of the 19.4 gradients for the case $h_0\ne0$ actually survive in truncated BPTT.

:::ex Example 2 — number of updates and memory
Training on a sequence of length $T=1000$ with truncated BPTT in chunks of $k=100$ steps, how many parameter updates are there, and how many hidden states are stored per backward pass?
---
There are $1000/100=10$ chunks, so 10 updates (full BPTT makes 1). Each pass stores $100$ hidden states (plus the first state passed in). The price is that dependencies longer than 100 steps cannot be learned through the gradient.
:::
` },
      '19.4': { title: 'Gradients of a Two-Step RNN', body: R`
:::idea In plain words
Backpropagation in an RNN is harder than in an MLP because the parameters are used **at several steps at once**. Change $W$ a little and $h_1$ changes, and $h_2$ changes both directly (since it uses $W$ again) **and** indirectly through the changed $h_1$. Find every path from the parameter to the loss, write the chain-rule product along each path, and add them. Doing it by hand for two steps reveals the general formula.
:::

**Setting** (notes). From here on we follow the notation of the notes.
$$h_t=\tanh(Wh_{t-1}+UX_t+b),\qquad Y_t=Vh_t+c,\qquad\theta=(W,U,V,b,c).$$
For an RNN with $T$ cells the input is $(X_1,\dots,X_T)$, the output $(Y_1,\dots,Y_T)$, the target $(Z_1,\dots,Z_T)$, and the loss $L=\sum_{t=1}^TL_t$, for example $L_t=\E[\lvert Y_t-Z_t\rvert^2]$ (the notes add “or …”: other losses work too). $\nabla_\theta L$ composes backpropagation at each step with backpropagation across time, which makes it more complicated than for an MLP. So we start with two steps $T=2$ and all variables one-dimensional continuous variables.

:::fig rnn2step
:::

:::hand Class notes — forward pass and local derivatives
Forward pass:
$$\begin{aligned}a_1&=Wh_0+UX_1+b,&h_1&=\tanh a_1,&Y_1&=Vh_1+c,\\a_2&=Wh_1+UX_2+b,&h_2&=\tanh a_2,&Y_2&=Vh_2+c.\end{aligned}$$

Setting $L_t=\frac12(Y_t-Z_t)^2$, we get $L=L_1+L_2=\frac12\lvert Y_1-Z_1\rvert^2+\frac12\lvert Y_2-Z_2\rvert^2=\frac12\lVert Y-Z\rVert^2$, and we need $\nabla_\theta L=\big(\frac{\partial L}{\partial W},\frac{\partial L}{\partial V},\frac{\partial L}{\partial U},\frac{\partial L}{\partial b},\frac{\partial L}{\partial c}\big)$.

By the chain rule and $\frac{d}{da}\tanh a=\sech^2a=1-\tanh^2a$,
$$\frac{\partial h_1}{\partial W}=\frac{\partial}{\partial W}\tanh a_1=\sech^2a_1\,\frac{\partial a_1}{\partial W}=(1-\tanh^2a_1)h_0=(1-h_1^2)h_0.$$

Similarly,
$$\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1,\qquad\frac{\partial h_1}{\partial b}=1-h_1^2,\qquad\frac{\partial h_2}{\partial b}=1-h_2^2,$$
$$\frac{\partial h_1}{\partial U}=(1-h_1^2)X_1,\qquad\frac{\partial h_2}{\partial U}=(1-h_2^2)X_2.$$

Since $L_1$ depends on $h_1$ only through $Y_1$,
$$\frac{\partial L_1}{\partial h_1}=\frac{\partial L_1}{\partial Y_1}\frac{\partial Y_1}{\partial h_1}=(Y_1-Z_1)V,\qquad\frac{\partial L_2}{\partial h_2}=(Y_2-Z_2)V.$$

The derivative across time:
$$\frac{\partial h_2}{\partial h_1}=\frac{\partial}{\partial h_1}\tanh a_2=\sech^2a_2\,\frac{\partial a_2}{\partial h_1}=(1-\tanh^2a_2)W=(1-h_2^2)W.$$
:::

**What the partial derivative means.** The $\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1$ above is the derivative of $a_2=Wh_1+UX_2+b$ with respect to $W$ **with $h_1$ held fixed** (the direct path). Since $h_1$ also depends on $W$, the total derivative with respect to $W$ is $\frac{dh_2}{dW}=\frac{\partial h_2}{\partial W}+\frac{\partial h_2}{\partial h_1}\frac{dh_1}{dW}$, and the third term of $\partial L/\partial W$ below is exactly this indirect path.

:::hand Class notes — gradients parameter by parameter
**V.** $L_t$ depends on $V$ only through $Y_t$, so
$$\frac{\partial L}{\partial V}=\frac{\partial L_1}{\partial Y_1}\frac{\partial Y_1}{\partial V}+\frac{\partial L_2}{\partial Y_2}\frac{\partial Y_2}{\partial V}=(Y_1-Z_1)h_1+(Y_2-Z_2)h_2=\sum_{t=1}^2(Y_t-Z_t)h_t.$$

**c** (notes: D.I.Y.). Since $\frac{\partial Y_t}{\partial c}=1$, $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.

**W.** $W$ reaches $L$ along three paths: $L_1\leftarrow h_1\leftarrow W$, $L_2\leftarrow h_2\leftarrow W$ (direct), $L_2\leftarrow h_2\leftarrow h_1\leftarrow W$.
$$\begin{aligned}\frac{\partial L}{\partial W}&=\frac{\partial L_1}{\partial W}+\frac{\partial L_2}{\partial W}=\frac{\partial L_1}{\partial h_1}\frac{\partial h_1}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial W}+\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial h_1}\frac{\partial h_1}{\partial W}\\&=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1\\&\quad+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.\end{aligned}$$

**U** (notes: D.I.Y.). Along the same three paths only the last factor changes, to $\frac{\partial h_t}{\partial U}=(1-h_t^2)X_t$.
$$\begin{aligned}\frac{\partial L}{\partial U}&=(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)X_2\\&\quad+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1.\end{aligned}$$

**b** (notes: D.I.Y.). Since $\frac{\partial h_t}{\partial b}=1-h_t^2$,
$$\begin{aligned}\frac{\partial L}{\partial b}&=(Y_1-Z_1)V(1-h_1^2)+(Y_2-Z_2)V(1-h_2^2)\\&\quad+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2).\end{aligned}$$
:::

:::warn The third term in the notes
The notes write the third term of $\partial L/\partial W$ as $(Y_2-Z_2)V(1-h_0^2)W(1-h_1^2)h_0$, but the middle factor comes from $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$, so $(1-h_2^2)$ is correct. Also, if $h_0=0$ (the usual initial state), the first and third terms, which carry $h_0$, vanish and only $\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1$ is left. At the first step $W$ multiplies 0, so changing $W$ does not change $h_1$. The gradients of $U$ and $b$ are not multiplied by $h_0$, so all three of their terms remain.
:::

**Bundling with δ.** There is a way to compute the three-term formulas at once. Let $\delta_t:=\frac{\partial L}{\partial a_t}$ (the total derivative, summing every path through $a_t$). Then
$$\delta_2=(Y_2-Z_2)V(1-h_2^2),\qquad\delta_1=\big[(Y_1-Z_1)V+\delta_2W\big](1-h_1^2),$$
$$\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1,\qquad\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2,\qquad\frac{\partial L}{\partial b}=\delta_1+\delta_2.$$
Expanding $\delta_1h_0$ gives the first and third terms, and $\delta_2h_1$ is the second. For each parameter, sum over the steps “$\delta_t$ × (what multiplies that parameter inside $a_t$)”. 19.5 generalizes this.

:::key Gradients of a two-step RNN
If $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^2\frac12(Y_t-Z_t)^2$, then
$$\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t,\qquad\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t),$$
$$\begin{aligned}\frac{\partial L}{\partial W}=\ &(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1\\&+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0\end{aligned}$$
(paths $L_1\leftarrow h_1\leftarrow W$, $L_2\leftarrow h_2\leftarrow W$, $L_2\leftarrow h_2\leftarrow h_1\leftarrow W$). $\partial L/\partial U$ and $\partial L/\partial b$ replace the last factor $h_{s-1}$ of each term by $X_s$ and $1$. Bundled, $\frac{\partial L}{\partial W}=\sum_t\delta_th_{t-1}$, $\frac{\partial L}{\partial U}=\sum_t\delta_tX_t$, $\frac{\partial L}{\partial b}=\sum_t\delta_t$.
:::

:::ex Example 3 — numbers all the way through
With $W=0.5$, $U=1$, $V=2$, $b=c=0$, $h_0=0$, $X=(1,-1)$, $Z=(1,0)$, compute the forward pass and all five gradients.
---
**Forward pass.** $a_1=1$, $h_1=\tanh1\approx0.7616$, $Y_1\approx1.5232$. $a_2=0.5\cdot0.7616-1\approx-0.6192$, $h_2\approx-0.5506$, $Y_2\approx-1.1011$. Errors $Y_1-Z_1\approx0.5232$, $Y_2-Z_2\approx-1.1011$, loss $L\approx0.7431$.

**Local factors.** $1-h_1^2\approx0.4200$, $1-h_2^2\approx0.6969$.

**δ.** $\delta_2=(-1.1011)(2)(0.6969)\approx-1.5347$, $\delta_1=(0.5232\cdot2-1.5347\cdot0.5)(0.4200)=(1.0464-0.7674)(0.4200)\approx0.1172$.

**Gradients.** $\frac{\partial L}{\partial V}=0.5232\cdot0.7616+(-1.1011)(-0.5506)\approx0.3985+0.6063=1.0047$, $\frac{\partial L}{\partial c}\approx0.5232-1.1011=-0.5780$. Since $h_0=0$, $\frac{\partial L}{\partial W}=\delta_2h_1\approx-1.5347\cdot0.7616\approx-1.1688$ (the second term only). $\frac{\partial L}{\partial U}=\delta_1\cdot1+\delta_2\cdot(-1)\approx0.1172+1.5347=1.6519$, which as three terms is $0.4395+1.5347-0.3223$. $\frac{\partial L}{\partial b}=\delta_1+\delta_2\approx-1.4175$ ($=0.4395-1.5347-0.3223$). Checking with central differences $\frac{L(\theta+\epsilon)-L(\theta-\epsilon)}{2\epsilon}$, all five values agree to six decimal places.
:::

:::tip Quiz 2 (11/04)
The notes put a red box saying “Quiz 2 (11/04)” next to $\partial L_1/\partial h_1$ in this derivation. Checklist for the answer:
1. Write the forward pass first (your own notation, stating which weight is recurrent) together with $a_t$, $h_t$, $Y_t$, $L_t$.
2. List **all paths** from the parameter you want to $L$. $V$ and $c$ have one per step; $W$, $U$, $b$ have $T(T+1)/2$ (three when $T=2$).
3. Write the chain-rule product along each path and add them.
4. Simplify with $\tanh'(a)=\sech^2a=1-\tanh^2a=1-h^2$.
5. Mark the terms that vanish when $h_0=0$, and if possible check by bundling with $\delta_t$.
:::

### Going deeper

With $T$ steps, $W$ reaches $L_t$ along one path through each $h_s$ ($s\le t$), so there are $\sum_{t=1}^Tt=T(T+1)/2$ terms.
$$\frac{\partial L}{\partial W}=\sum_{t=1}^T(Y_t-Z_t)V\sum_{s=1}^t\Big(\prod_{k=s+1}^t(1-h_k^2)W\Big)(1-h_s^2)h_{s-1}.$$
In a term with large $t-s$, that is, a path reaching far into the past, $(1-h_k^2)W$ is multiplied $t-s$ times. This product is the protagonist of 19.6.
` },
      '19.5': { title: 'Backpropagation in a Many-Step RNN', body: R`
:::idea In plain words
With many steps the job is the same. Starting from the output, walk down the hidden states one step at a time, updating “the effect of this state on the loss” $\partial\mathcal L/\partial h_\ell$ (multiplying one Jacobian at a time), and add the share where the parameters are used directly at each step. The three-term formulas of 19.4 are this procedure written out for two steps.
:::

**The multi-cell case** (notes, slide 10). Turn the input $X$ into a sequence $\tau(X)=(u_1,\dots,u_L)$ and set
$$h_0=0,\qquad h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)\quad(\ell=1,\dots,L),\qquad f_\theta(X)=Ah_L+b,$$
with $q_{\tilde\theta}:\mathbb R^n\times\mathbb R^m\to\mathbb R^n$, for example $q(h,u)=\phi(Wh+Uu+c)$. Here $\theta=(A,b,\tilde\theta)$, $A\in\mathbb R^{1\times n}$, $b\in\mathbb R$, $\tilde\theta\in\mathbb R^p$, and $f_\theta(X)\in\mathbb R$. It is a many-to-one model with a single output at the end.

**Outer parameters** (slide 10). The chain rule on the loss $\mathcal L(f_\theta(X),Y)$ gives
$$\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial\theta}=\Big(\frac{\partial\mathcal L}{\partial f}(f_\theta(X),Y)\Big)\frac{\partial f_\theta(X)}{\partial\theta},\qquad\frac{\partial f_\theta(X)}{\partial A}=h_L,\quad\frac{\partial f_\theta(X)}{\partial b}=1,\quad\frac{\partial f_\theta(X)}{\partial\tilde\theta}=A\frac{\partial h_L}{\partial\tilde\theta}.$$
(Arranged in the same $1\times n$ shape as $A$, $\partial f/\partial A=h_L$ is $h_L^T$.)

**Recurrent parameters** (slide 13, notes). $\tilde\theta$ is used in every application of $q$, so the notes fill the blank of slide 13 with sums.
$$\frac{\partial f_\theta(X)}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial f}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta},\qquad\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta}.$$
Here $\frac{\partial h_\ell}{\partial\tilde\theta}$ is the **direct** derivative with $h_{\ell-1}$ held fixed, $\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$, which is how the first formula of slide 14 writes it. In contrast, $\frac{\partial\mathcal L}{\partial h_\ell}$ sums every path from $h_\ell$ to the loss.

:::key Backpropagation in a many-step RNN
If $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$ and $f_\theta(X)=Ah_L+b$, then (gradients are row vectors)
$$\frac{\partial\mathcal L}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L}{\partial h_\ell}\,\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell),\qquad\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_{L-2}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell},$$
$\frac{\partial\mathcal L}{\partial h_L}=\frac{\partial\mathcal L}{\partial f}A$, $\frac{\partial\mathcal L}{\partial A}=\frac{\partial\mathcal L}{\partial f}h_L^T$, $\frac{\partial\mathcal L}{\partial b}=\frac{\partial\mathcal L}{\partial f}$.
:::

:::warn Slides 11–12
In the uploaded PDF, slide 10 is followed by 13, so 11–12 are missing. Judging from the title of slide 13, “Translate calculation to ∂L/∂θ̃”, the missing pages most likely unrolled $\partial h_L/\partial\tilde\theta$ step by step. The backward recursion below fills in that content. Also, these notes call the hidden bias $c$ and the output bias $b$, the reverse of 19.4.
:::

**Backward recursion.** With $q(h,u)=\phi(Wh+Uu+c)$, $a_\ell=Wh_{\ell-1}+Uu_\ell+c$, and the row vector $\delta_\ell:=\frac{\partial\mathcal L}{\partial h_\ell}$, we have $\frac{\partial h_{\ell+1}}{\partial h_\ell}=\diag(\phi'(a_{\ell+1}))W$, so[[ch09:9.5|Jacobians of vector inputs and outputs, multiplied by row-vector gradients.]]
$$\delta_L=\frac{\partial\mathcal L}{\partial f}A,\qquad\delta_\ell=\delta_{\ell+1}\diag(\phi'(a_{\ell+1}))\,W\quad(\ell=L-1,\dots,1),$$
$$\frac{\partial\mathcal L}{\partial W}=\sum_{\ell=1}^L\big(\phi'(a_\ell)\odot\delta_\ell^T\big)h_{\ell-1}^T,\qquad\frac{\partial\mathcal L}{\partial U}=\sum_{\ell=1}^L\big(\phi'(a_\ell)\odot\delta_\ell^T\big)u_\ell^T,\qquad\frac{\partial\mathcal L}{\partial c}=\sum_{\ell=1}^L\phi'(a_\ell)\odot\delta_\ell^T.$$
If $h_\ell$ and $a_\ell$ are stored during the forward pass, backpropagation is a single backward computation of $\delta$, costing $O(L)$, the same as the forward pass.

**When there is an output at every step.** If, as in 19.4, the loss is $L=\sum_tL_t$, then $h_t$ reaches $L_t$ directly and every later loss through $h_{t+1}$. So the direct share is added to $\mathbf g_t:=\partial L/\partial h_t$ (written as a column vector).

:::key Backpropagation through time (BPTT)
If $h_t=\tanh(Wh_{t-1}+Ux_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^T\frac12\lVert Y_t-Z_t\rVert^2$, then (column-vector gradients, $h_t^2$ elementwise)
$$\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1},\qquad\boldsymbol\delta_t=\diag(1-h_t^2)\,\mathbf g_t,\qquad\boldsymbol\delta_{T+1}=\mathbf 0,$$
$$\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T,\quad\frac{\partial L}{\partial U}=\sum_t\boldsymbol\delta_tx_t^T,\quad\frac{\partial L}{\partial b}=\sum_t\boldsymbol\delta_t,\quad\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t^T,\quad\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t).$$
:::

**From $T=2$ back to 19.4.** In the scalar case, $\delta_3=0$ gives $g_2=V(Y_2-Z_2)$, $\delta_2=(1-h_2^2)V(Y_2-Z_2)$, and then $g_1=V(Y_1-Z_1)+W\delta_2$, $\delta_1=(1-h_1^2)g_1$. So $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1$ reproduces the three terms of the notes exactly. For the slides' model with an output only at the end, there is no $L_1$, so $\delta_1=(1-h_1^2)W\delta_2$ and only the second and third terms remain.

:::ex Example 4 — output only at the end
For the scalar $h_\ell=\tanh(Wh_{\ell-1}+Uu_\ell+c)$, $\ell=1,2$, $f=Ah_2+b$, $\mathcal L=\frac12(f-y)^2$, write $\partial\mathcal L/\partial W$.
---
$\delta_2=(f-y)A$ and $\delta_1=\delta_2(1-h_2^2)W$, so
$$\frac{\partial\mathcal L}{\partial W}=\delta_2(1-h_2^2)h_1+\delta_1(1-h_1^2)h_0=(f-y)A(1-h_2^2)h_1+(f-y)A(1-h_2^2)W(1-h_1^2)h_0.$$
There are only two paths (no $L_1$), and with $h_0=0$ only the first term remains.
:::

### Going deeper

BPTT finds the gradient in time $O(T)$ and memory $O(T)$. The opposite approach carries $\partial h_t/\partial\theta$ forward along with the forward pass (real-time recurrent learning, RTRL); its memory does not depend on $T$, so it works even on endless sequences, but for $W\in\mathbb R^{n\times n}$ the quantity $\partial h_t/\partial W$ has size $n\times n^2$, costing $O(n^4)$ per step, so in practice truncated BPTT is used.
` },
      '19.6': { title: 'Exploding and Vanishing Gradients and Gradient Clipping', body: R`
:::idea In plain words
In the formula of 19.5, the gradient for a distant past step is a product of tens or hundreds of Jacobians. Multiply a number slightly above 1 by itself 100 times and it becomes huge ($1.1^{100}\approx13{,}781$); multiply a number slightly below 1 by itself 100 times and it is almost 0 ($0.9^{100}\approx0.00003$). The first is an **exploding gradient**, the second a **vanishing gradient**.
:::

**RNNs are extremely deep networks** (slide 14).
$$\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial\tilde\theta}=\sum_{\ell=1}^L\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial h_\ell}\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell),\qquad\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial h_\ell}=\frac{\partial\mathcal L(f_\theta(X),Y)}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_{L-2}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}.$$
Sequence lengths in the hundreds or thousands are common (notes: $L=100,1000$), so $\partial\mathcal L/\partial h_\ell$ for a distant step is a product of hundreds or thousands of factors. Multiplying many numbers is unstable.
- If most of the numbers are greater than 1, the product goes to $\infty$ (**exploding gradients**, which can be fixed with gradient clipping).
- If most of the numbers are less than 1, the product goes to 0 (**vanishing gradients**, the bigger problem). The product stays a reasonable size only if the numbers are all close to 1.

:::key Conditions for vanishing and exploding gradients
With $\gamma=\sup_z\lvert\phi'(z)\rvert$ ($\gamma=1$ for $\tanh$), $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2=\lVert\diag(\phi'(a_{k+1}))W\rVert_2\le\gamma\lVert W\rVert_2$, and
$$\Big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\Big\rVert\le\big(\gamma\lVert W\rVert_2\big)^{L-\ell}\Big\lVert\frac{\partial\mathcal L}{\partial h_L}\Big\rVert.$$
So if $\gamma\lVert W\rVert_2<1$, the gradient for distant steps **vanishes** exponentially. For the gradient to **explode**, $\gamma\lVert W\rVert_2>1$ is required (a necessary condition).
:::

In the scalar case with small activations, so that $\tanh'\approx1$, each factor is $\approx w$ and the product is $w^{L-\ell}$. The cover figure draws the log of $\gamma^k$; even a small departure of $\gamma$ from 1 makes the lines fan far apart. It is the same phenomenon as in a deep MLP initialized too small or too large, now happening along time[[ch11:11.1|Too-small or too-large initialization: activations and gradients vanish or blow up layer after layer.]].

**Exploding gradients and clipping** (slide 15).
- The exploding gradient problem occurs when the gradient magnitude is very large.
- Exploding gradients mean that the output is very sensitive to small changes of the parameters in a certain direction. Sometimes such gradients are unworkable and the network architecture must be changed.
- Sometimes, however, the **direction** of the gradient is fine, and then one can optimize with the clipped gradient.

:::key Gradient clipping
For a threshold $v>0$ (a scalar),
$$\mathbf g\leftarrow\min\Big(1,\frac{v}{\lVert\mathbf g\rVert}\Big)\mathbf g=\begin{cases}\mathbf g&\lVert\mathbf g\rVert\le v\\\dfrac{v}{\lVert\mathbf g\rVert}\mathbf g&\text{otherwise}\end{cases}$$
The direction is kept and the size becomes $\min(\lVert\mathbf g\rVert,v)$.
:::

:::warn The max on slide 15
The slide writes $g\leftarrow\max\big(1,\frac{v}{\lVert g\rVert}\big)g$, but when $\lVert g\rVert\le v$ we have $\frac{v}{\lVert g\rVert}\ge1$, so the max would actually **enlarge** small gradients. The formula consistent with the cases on the same slide ($g$ if $\lVert g\rVert\le v$, otherwise $\frac{v}{\lVert g\rVert}g$) is the $\min$. Also, slide 14 shows a raw LaTeX command where $\infty$ was meant.
:::

The picture on slide 15 shows a loss $J(w,b)$ with a steep **cliff**. Without clipping, the huge gradient at the cliff throws one step far off the graph; with clipping, the step goes in the same direction but small, and stays near the valley.

:::ex Example 5 — computing a clip
With $\mathbf g=(3,4)$ and $v=2$, what is the clipped gradient? With $v=10$?
---
$\lVert\mathbf g\rVert=5>2$, so $\frac25(3,4)=(1.2,1.6)$, of size 2. With $v=10$, $5\le10$ and it stays $(3,4)$. With the slide's max, $v=10$ would give $\max(1,2)\mathbf g=(6,8)$, actually larger.
:::

**Vanishing gradients** (slide 16). Intuitively, vanishing gradients means the gradient signal does not reach the earlier layers (the distant past steps). In an RNN, $\partial\mathcal L/\partial h_L$ may not be small, but
$$\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_{L-2}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$$
can be small. This means changes in $h_\ell$ hardly affect $\mathcal L$, and since $\frac{\partial\mathcal L}{\partial u_\ell}=\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial u_\ell}$, (small) changes in $u_\ell$ do not affect $\mathcal L$ either. We can read this as the RNN not using the information of $u_\ell$, that is, **not remembering** $u_\ell$ at step $L$ (not a precise argument, since large changes may affect it). In any case the gradient signal from far away at time $L$ is lost, and the model cannot learn what information to preserve at time $\ell$.

:::ex Example 6 — the factor over 100 steps
In a scalar $\tanh$ RNN, suppose the activations are small so that $1-h_k^2\approx1$. With $W=0.9$ and with $W=1.1$, by what factor does the gradient change on its way to a step 100 steps back?
---
$\prod_{k}(1-h_k^2)W\approx W^{100}$: $0.9^{100}\approx2.66\times10^{-5}$ (vanishing), $1.1^{100}\approx1.38\times10^{4}$ (exploding). In a real $\tanh$ RNN, as $h$ grows, $1-h^2$ shrinks and the product may fall again, but then saturation causes vanishing.
:::

**Why vanishing is the bigger problem.** Exploding is visible immediately from $\lVert\mathbf g\rVert$ and can be handled by clipping. Vanishing is silent. The total gradient $\sum_\ell$ is dominated by the terms of nearby steps, so scaling the whole gradient up leaves the terms of distant steps buried relative to them, and the model learns only short dependencies.

**Better gradient flow** (slide 17). Slide 17 has only its title, “Promoting better gradient flow,” and moves straight on to the LSTM (slide 18). The LSTM provides a separate path, the cell state, whose Jacobian factor is $\diag(f_t)$, so if the network learns $f_t\approx1$ the gradient passes through almost undiminished[[ch20:20.2|Gradient flow in the LSTM: the Jacobian multiplied along the cell state is the forget gate diag(f_t).]]. It is the same idea as ResNet's residual connection, which made the Jacobian $I+\partial F/\partial h$[[ch16:16.6|The Jacobian I + ∂F/∂h of a residual connection.]].

### Going deeper

The slide's clipping looks at the norm of the whole gradient vector: **norm clipping**. There is also **value clipping**, which cuts each component to $[-v,v]$, but it shrinks the components differently and so changes the direction. Norm clipping keeps the direction and only bounds the size of one step by $\eta v$, which is the same as lowering the learning rate for that step alone.
` },
    },
    probs: [
      { q: R`Which RNN shape fits the task of watching a video and classifying the action in it (e.g., running, jumping) into a single category?`,
        choices: [R`one to many`, R`many to one`, R`delayed many to many`, R`synchronous many to many`],
        sol: R`It reads the sequence of frames and outputs one category at the end, so it is many to one (video classification and action recognition on slide 3).` },
      { q: R`Which shape best fits translating an English sentence into a Korean sentence?`,
        choices: [R`one to one`, R`one to many`, R`delayed many to many, producing output after reading the whole input`, R`synchronous many to many, producing one output per input at every step`],
        sol: R`The two languages differ in word order and length, so output starts only after the whole sentence is read. The inputs at $t=1,2,3$ and outputs at $t=4,5,6$ in the notes show this shape.` },
      { q: R`What is the shape of the task of taking one image and producing a descriptive sentence (a caption)?`,
        choices: [R`one to many`, R`many to one`, R`synchronous many to many`, R`one to one`],
        sol: R`The input is one image and the output is a sequence of words, so it is one to many (Img2Cap on slide 3).` },
      { q: R`Which statement about the vanilla RNN of slide 6 is correct?`,
        choices: [R`It uses a different weight $\mathbf W_t$ at each step`, R`It uses the same function and the same parameters $\mathbf U,\mathbf W,\mathbf b,\mathbf W^{out}$ at every step`, R`It produces outputs directly from inputs without a hidden state`, R`The initial state $\mathbf h_0$ is the mean of the training data`],
        sol: R`Slide 6: “the same function and the same set of parameters are used at every time step.” $\mathbf h_0=\mathbf 0$.` },
      { q: R`How many parameters does the vanilla RNN $\mathbf h_t=\sigma(\mathbf U\mathbf h_{t-1}+\mathbf W\mathbf x_t+\mathbf b)$, $\hat{\mathbf y}_t=\mathbf W^{out}\mathbf h_t$ with a 10-dimensional input, 20-dimensional hidden state, and 5-dimensional output have in total? How many when used on a sequence of length 50?`,
        sol: R`$\mathbf U$: $20\cdot20=400$, $\mathbf W$: $20\cdot10=200$, $\mathbf b$: 20, $\mathbf W^{out}$: $5\cdot20=100$. That is 720 in total, and since the parameters are shared it is still 720 for length 50.` },
      { q: R`Feeding $x=(2,1,0.5)$ to the scalar RNN $h_t=\ReLU(0.5h_{t-1}+x_t)$, $\hat y_t=2h_t$, $h_0=0$, what is $\hat y_3$?`,
        sol: R`$h_1=2$, $h_2=\ReLU(1+1)=2$, $h_3=\ReLU(1+0.5)=1.5$, $\hat y_3=3$.` },
      { q: R`Give three advantages of the RNN using the same parameters at every step (parameter sharing).`,
        sol: R`(1) The number of parameters does not depend on the sequence length, so inputs of different lengths are handled by the same model. (2) A pattern learned at one step is reused at other steps (generalization along time), which is data-efficient. (3) It can be applied to sequences of lengths not seen in training. The price is that the gradient becomes a product of powers of the same $W$, causing explosion and vanishing.`,
        rubric: R`- Number of parameters independent of the length — 1 pt
- Patterns shared between steps — 1 pt
- Application to other lengths (or mention of the price) — 1 pt` },
      { q: R`Which statement about truncated BPTT is correct?`,
        choices: [R`It resets the hidden state to 0 every $k$ steps`, R`It keeps carrying the hidden state forward but backpropagates only within the last $k$ steps`, R`It uses only the first $k$ steps of the sequence for training`, R`It clips the gradient every $k$ steps`],
        sol: R`Slide 9: “Carry hidden states forward in time forever, but only backpropagate for some smaller number of steps.” The first state of a chunk is not 0 but the value passed in from before.` },
      { q: R`Why does the memory of full BPTT on a sequence of length $T$ grow in proportion to $T$?`,
        choices: [R`Because the parameters are copied and stored at every step`, R`Because computing local derivatives such as $1-h_t^2$ in backpropagation needs every hidden state $h_t$ of the forward pass`, R`Because each loss $L_t$ is minimized separately`, R`Because gradient clipping is done at every step`],
        sol: R`The parameters are shared, so there is only one set. The local gradients of backpropagation depend on $h_t$ and $a_t$, so all intermediate values of the forward pass must be stored.` },
      { q: R`In the two-step RNN of the notes, $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$, $L=\sum_{t=1}^2\frac12(Y_t-Z_t)^2$, with $V=2$, $c=0$, $W=0.5$, $X=(1,2)$, $Z=(0,0)$, the forward pass gave $h_0=0$, $h_1=0.5$, $h_2=-0.5$. What is $\partial L/\partial V$?`,
        sol: R`$Y_1=1$, $Y_2=-1$. $\frac{\partial L}{\partial V}=(Y_1-Z_1)h_1+(Y_2-Z_2)h_2=1\cdot0.5+(-1)(-0.5)=1$.` },
      { q: R`With the same values as in the previous problem ($V=2$, $W=0.5$, $h_0=0$, $h_1=0.5$, $h_2=-0.5$, $Y=(1,-1)$, $Z=(0,0)$), what is $\partial L/\partial W$?`,
        sol: R`$1-h_1^2=1-h_2^2=0.75$. Since $h_0=0$ the first and third terms vanish and $\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1=(-1)(2)(0.75)(0.5)=-0.75$.` },
      { q: R`With the same values and $X=(1,2)$, what is $\partial L/\partial U$?`,
        sol: R`$\delta_2=(Y_2-Z_2)V(1-h_2^2)=-1.5$, $\delta_1=[(Y_1-Z_1)V+\delta_2W](1-h_1^2)=(2-0.75)(0.75)=0.9375$. $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2=0.9375-3=-2.0625$. As three terms it is $1.5-3-0.5625$.` },
      { q: R`With the same values, what is $\partial L/\partial b$?`,
        sol: R`$\frac{\partial L}{\partial b}=\delta_1+\delta_2=0.9375-1.5=-0.5625$. As three terms: $(Y_1-Z_1)V(1-h_1^2)=1.5$, $(Y_2-Z_2)V(1-h_2^2)=-1.5$, $(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)=-0.5625$.` },
      { q: R`Which correctly writes the third term $\frac{\partial L_2}{\partial h_2}\frac{\partial h_2}{\partial h_1}\frac{\partial h_1}{\partial W}$ of $\partial L/\partial W$ in the notes?`,
        choices: [R`$(Y_2-Z_2)V(1-h_0^2)W(1-h_1^2)h_0$`, R`$(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0$`, R`$(Y_2-Z_2)V(1-h_2^2)(1-h_1^2)h_1$`, R`$(Y_1-Z_1)V(1-h_1^2)W(1-h_2^2)h_0$`],
        sol: R`$\frac{\partial L_2}{\partial h_2}=(Y_2-Z_2)V$, $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$, $\frac{\partial h_1}{\partial W}=(1-h_1^2)h_0$. The $(1-h_0^2)$ in the notes is a slip for $(1-h_2^2)$.` },
      { q: R`For the scalar RNN $h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$ ($t=1,2$), $L=L_1+L_2$, $L_t=\frac12(Y_t-Z_t)^2$, derive the following.
1. Write the forward pass with $a_t$, $h_t$, $Y_t$, and find $\frac{\partial h_1}{\partial W}$, $\frac{\partial h_2}{\partial W}$ ($h_1$ fixed), $\frac{\partial h_2}{\partial h_1}$, and $\frac{\partial L_t}{\partial h_t}$.
2. Find $\frac{\partial L}{\partial V}$ and $\frac{\partial L}{\partial c}$.
3. Write every path from $W$ to $L$ and find $\frac{\partial L}{\partial W}$.`,
        hint: R`$\frac{d}{da}\tanh a=1-\tanh^2a$. $W$ is used in both $a_1$ and $a_2$, and $h_1$ also enters $a_2$.`,
        sol: R`
**1.** $a_1=Wh_0+UX_1+b$, $h_1=\tanh a_1$, $Y_1=Vh_1+c$, $a_2=Wh_1+UX_2+b$, $h_2=\tanh a_2$, $Y_2=Vh_2+c$. By the chain rule, $\frac{\partial h_1}{\partial W}=(1-h_1^2)h_0$, $\frac{\partial h_2}{\partial W}=(1-h_2^2)h_1$, $\frac{\partial h_2}{\partial h_1}=(1-h_2^2)W$, $\frac{\partial L_t}{\partial h_t}=(Y_t-Z_t)V$.

**2.** $L_t$ depends on $V$ and $c$ only through $Y_t$, so $\frac{\partial L}{\partial V}=\sum_t(Y_t-Z_t)h_t$ and $\frac{\partial L}{\partial c}=\sum_t(Y_t-Z_t)$.

**3.** Paths: $W\to h_1\to L_1$, $W\to h_2\to L_2$, $W\to h_1\to h_2\to L_2$. Therefore
$$\frac{\partial L}{\partial W}=(Y_1-Z_1)V(1-h_1^2)h_0+(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0.$$`,
        rubric: R`
- Forward pass and the four local derivatives (using $\tanh'=1-h^2$) — 3 pts
- $\partial L/\partial V$, $\partial L/\partial c$ — 2 pts
- All three paths found — 2 pts
- The three terms of $\partial L/\partial W$ correct (the $(1-h_2^2)W$ of the third term) — 3 pts` },
      { q: R`For the same two-step RNN, derive path by path the $\frac{\partial L}{\partial U}$ and $\frac{\partial L}{\partial b}$ that the notes left as “D.I.Y.”, and show that with $\delta_2=(Y_2-Z_2)V(1-h_2^2)$ and $\delta_1=[(Y_1-Z_1)V+\delta_2W](1-h_1^2)$, $\frac{\partial L}{\partial U}=\delta_1X_1+\delta_2X_2$ and $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.`,
        sol: R`
**Paths.** Like $W$, $U$ and $b$ enter both $a_1$ and $a_2$, so there are three paths: $\to h_1\to L_1$, $\to h_2\to L_2$, $\to h_1\to h_2\to L_2$. The local derivatives are $\frac{\partial h_t}{\partial U}=(1-h_t^2)X_t$ and $\frac{\partial h_t}{\partial b}=1-h_t^2$ ($h_{t-1}$ fixed).

**U.** $\frac{\partial L}{\partial U}=(Y_1-Z_1)V(1-h_1^2)X_1+(Y_2-Z_2)V(1-h_2^2)X_2+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1$.

**b.** $\frac{\partial L}{\partial b}=(Y_1-Z_1)V(1-h_1^2)+(Y_2-Z_2)V(1-h_2^2)+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)$.

**Bundling with δ.** $\delta_1X_1=(Y_1-Z_1)V(1-h_1^2)X_1+\delta_2W(1-h_1^2)X_1$ gives the first and third terms and $\delta_2X_2$ the second, so the sum is $\frac{\partial L}{\partial U}$. Replacing $X_t$ by 1 gives $\frac{\partial L}{\partial b}=\delta_1+\delta_2$.`,
        rubric: R`
- The three paths and the local derivatives — 2 pts
- The three terms of $\partial L/\partial U$ — 3 pts
- The three terms of $\partial L/\partial b$ — 2 pts
- Checking equality with the δ form by expansion — 3 pts` },
      { q: R`In the two-step RNN, suppose the initial state is $h_0\ne0$ (as in a chunk of truncated BPTT).
1. Which terms of $\partial L/\partial W$ vanish when $h_0=0$, and why?
2. Find $\partial L/\partial W$ for $V=2$, $W=0.5$, $h_0=1$, $h_1=0.5$, $h_2=-0.5$, $Y=(1,-1)$, $Z=(0,0)$.`,
        sol: R`
**1.** The first term $(Y_1-Z_1)V(1-h_1^2)h_0$ and the third term $(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0$, which carry $h_0$. Since $\frac{\partial h_1}{\partial W}=(1-h_1^2)h_0=0$, that is, at the first step $W$ multiplies $h_0=0$, changing $W$ does not change $h_1$.

**2.** $1-h_1^2=1-h_2^2=0.75$, $\delta_2=(-1)(2)(0.75)=-1.5$, $\delta_1=(1\cdot2-1.5\cdot0.5)(0.75)=0.9375$. $\frac{\partial L}{\partial W}=\delta_1h_0+\delta_2h_1=0.9375-0.75=0.1875$. As three terms it is $1.5-0.75-0.5625$ (with $h_0=0$ it would be $-0.75$).`,
        rubric: R`
- The two vanishing terms and the reason ($\partial h_1/\partial W=(1-h_1^2)h_0$) — 2 pts
- The correct value 0.1875 via δ or the three terms — 3 pts` },
      { q: R`For a three-step scalar RNN ($t=1,2,3$, same model and $L=\sum_{t=1}^3\frac12(Y_t-Z_t)^2$), write $\partial L/\partial W$ as all its path terms, and show that with $\delta_3=(Y_3-Z_3)V(1-h_3^2)$ and $\delta_t=[(Y_t-Z_t)V+\delta_{t+1}W](1-h_t^2)$ ($t=2,1$), $\frac{\partial L}{\partial W}=\sum_{t=1}^3\delta_th_{t-1}$. How many terms are there?`,
        sol: R`
**Paths.** $W$ enters $L_t$ at $a_s$ ($s\le t$) and reaches it via $h_s\to h_{s+1}\to\cdots\to h_t\to L_t$. The contribution of one path is $(Y_t-Z_t)V\big[\prod_{k=s+1}^t(1-h_k^2)W\big](1-h_s^2)h_{s-1}$.

**Six terms.** Writing $e_t=Y_t-Z_t$ and $d_t=1-h_t^2$,
$$\begin{aligned}\frac{\partial L}{\partial W}=\ &e_1Vd_1h_0+e_2Vd_2h_1+e_2Vd_2Wd_1h_0\\&+e_3Vd_3h_2+e_3Vd_3Wd_2h_1+e_3Vd_3Wd_2Wd_1h_0.\end{aligned}$$
There are $1+2+3=6$.

**Bundling with δ.** $\delta_3=e_3Vd_3$, $\delta_2=(e_2V+\delta_3W)d_2=e_2Vd_2+e_3Vd_3Wd_2$, $\delta_1=(e_1V+\delta_2W)d_1=e_1Vd_1+e_2Vd_2Wd_1+e_3Vd_3Wd_2Wd_1$. Then $\delta_3h_2$ is the fourth term, $\delta_2h_1$ the second and fifth, and $\delta_1h_0$ the first, third, and sixth, so the sum equals the formula above.`,
        rubric: R`
- The general form of a path — 2 pts
- All six terms correct — 4 pts
- Showing equality by expanding the δ recursion — 3 pts
- The number of terms $T(T+1)/2=6$ — 1 pt` },
      { q: R`In the two-step RNN, suppose there is an output only at the last step, so $L=\frac12(Y_2-Z_2)^2$ (many to one). Write $\partial L/\partial W$ and $\partial L/\partial U$, and say how many terms of each remain when $h_0=0$.`,
        sol: R`There is no $L_1$, so there are two paths: $W\to h_2\to L$ (direct) and $W\to h_1\to h_2\to L$.
$$\frac{\partial L}{\partial W}=(Y_2-Z_2)V(1-h_2^2)h_1+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)h_0,$$
$$\frac{\partial L}{\partial U}=(Y_2-Z_2)V(1-h_2^2)X_2+(Y_2-Z_2)V(1-h_2^2)W(1-h_1^2)X_1.$$
With $h_0=0$, one term of $\partial L/\partial W$ (the first) and both terms of $\partial L/\partial U$ remain.`,
        rubric: R`
- The two paths — 1 pt
- The formulas for $\partial L/\partial W$ and $\partial L/\partial U$ — 3 pts
- The terms that remain when $h_0=0$ — 1 pt` },
      { q: R`For the vector RNN $h_t=\tanh(Wh_{t-1}+Ux_t+b)$ ($h_t\in\mathbb R^n$), $Y_t=Vh_t+c$, $L=\sum_{t=1}^T\frac12\lVert Y_t-Z_t\rVert^2$, show that $\mathbf g_t=\partial L/\partial h_t$ (a column vector) satisfies
$$\mathbf g_t=V^T(Y_t-Z_t)+W^T\diag(1-h_{t+1}^2)\,\mathbf g_{t+1},\qquad\mathbf g_{T+1}=\mathbf 0,$$
and, with $\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t$, that $\frac{\partial L}{\partial W}=\sum_t\boldsymbol\delta_th_{t-1}^T$.`,
        sol: R`
**Where $h_t$ reaches.** $h_t$ reaches $L_t$ through $Y_t$, and every later loss through $a_{t+1}=Wh_t+Ux_{t+1}+b$ and $h_{t+1}$. By the chain rule (multiplying by transposed Jacobians),
$$\mathbf g_t=\Big(\frac{\partial Y_t}{\partial h_t}\Big)^T(Y_t-Z_t)+\Big(\frac{\partial h_{t+1}}{\partial h_t}\Big)^T\mathbf g_{t+1}=V^T(Y_t-Z_t)+\big(\diag(1-h_{t+1}^2)W\big)^T\mathbf g_{t+1}.$$
A diagonal matrix is symmetric, so the second term is $W^T\diag(1-h_{t+1}^2)\mathbf g_{t+1}=W^T\boldsymbol\delta_{t+1}$. At the last step there is nothing after, so $\mathbf g_{T+1}=\mathbf 0$.

**W.** $W$ enters $a_t$ directly at every step, and $\frac{\partial L}{\partial a_t}=\diag(1-h_t^2)\mathbf g_t=\boldsymbol\delta_t$. Since $a_{t,i}=\sum_jW_{ij}h_{t-1,j}+\cdots$, the share of step $t$ is $\frac{\partial L}{\partial a_{t,i}}h_{t-1,j}$, and the gradient of the shared $W$ is the sum over steps $\frac{\partial L}{\partial W_{ij}}=\sum_t\delta_{t,i}h_{t-1,j}$, that is, $\sum_t\boldsymbol\delta_th_{t-1}^T$.`,
        rubric: R`
- The two paths of influence of $h_t$ — 2 pts
- The Jacobian $\diag(1-h_{t+1}^2)W$ and its transpose — 3 pts
- The terminal condition — 1 pt
- $\partial L/\partial a_t=\boldsymbol\delta_t$ and the sum over steps giving $\sum\boldsymbol\delta_th_{t-1}^T$ — 4 pts` },
      { q: R`In the many-step model $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$, $f_\theta(X)=Ah_L+b$, what does $\frac{\partial h_\ell}{\partial\tilde\theta}$ mean in $\frac{\partial\mathcal L}{\partial\tilde\theta}=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial h_\ell}{\partial\tilde\theta}$ of slide 13?`,
        choices: [R`The total derivative of $h_\ell$ with respect to $\tilde\theta$ (including the paths through earlier steps)`, R`The direct derivative with $h_{\ell-1}$ held fixed, $\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$`, R`$\frac{\partial h_L}{\partial h_\ell}$`, R`The $\ell$-th component of $A$`],
        sol: R`The indirect paths through earlier steps are already in $\frac{\partial\mathcal L}{\partial h_\ell}$ (the product of Jacobians), so here we count only the share where $\tilde\theta$ is used directly at step $\ell$. Using the total derivative would count paths twice.` },
      { q: R`For $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$, prove by induction on $L$ that $\frac{dh_L}{d\tilde\theta}=\sum_{\ell=1}^L\frac{\partial h_L}{\partial h_\ell}\frac{\partial q_{\tilde\theta}}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$ (where $\frac{\partial h_L}{\partial h_\ell}=\frac{\partial h_L}{\partial h_{L-1}}\cdots\frac{\partial h_{\ell+1}}{\partial h_\ell}$ and $\frac{\partial h_L}{\partial h_L}=I$).`,
        sol: R`
**$L=1$.** $h_0$ does not depend on $\tilde\theta$, so $\frac{dh_1}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_0,u_1)$, which equals the right-hand side ($\ell=1$, the product is $I$).

**Inductive step.** In $h_L=q_{\tilde\theta}(h_{L-1},u_L)$, $\tilde\theta$ enters directly and through $h_{L-1}$, so by the multivariable chain rule
$$\frac{dh_L}{d\tilde\theta}=\frac{\partial q}{\partial\tilde\theta}(h_{L-1},u_L)+\frac{\partial h_L}{\partial h_{L-1}}\frac{dh_{L-1}}{d\tilde\theta}.$$
Substituting the induction hypothesis $\frac{dh_{L-1}}{d\tilde\theta}=\sum_{\ell=1}^{L-1}\frac{\partial h_{L-1}}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}(h_{\ell-1},u_\ell)$ and using $\frac{\partial h_L}{\partial h_{L-1}}\frac{\partial h_{L-1}}{\partial h_\ell}=\frac{\partial h_L}{\partial h_\ell}$ gives the terms $\ell=1,\dots,L-1$, and the first term is the term $\ell=L$.`,
        rubric: R`
- Base case — 2 pts
- Chain rule over the direct and indirect paths — 4 pts
- Substituting the hypothesis and merging the Jacobian products — 4 pts` },
      { q: R`In a scalar RNN, if the factor multiplied at every step is a constant $0.9$, by what factor is the gradient 50 steps away scaled? (as a decimal)`,
        sol: R`$0.9^{50}=e^{50\ln0.9}\approx e^{-5.27}\approx0.00515$. At 100 steps it is $0.9^{100}\approx2.66\times10^{-5}$.` },
      { q: R`Applying norm clipping $\mathbf g\leftarrow\min(1,v/\lVert\mathbf g\rVert)\mathbf g$ with threshold $v=2$ to the gradient $\mathbf g=(3,4)$, what is the first component?`,
        sol: R`$\lVert\mathbf g\rVert=5>2$, so $\frac25(3,4)=(1.2,1.6)$. The direction is the same and the size is 2.` },
      { q: R`What is wrong with the formula $g\leftarrow\max\big(1,\frac{v}{\lVert g\rVert}\big)g$ on slide 15?`,
        choices: [R`Nothing is wrong`, R`When $\lVert g\rVert\le v$ it scales $g$ up by $\frac{v}{\lVert g\rVert}\ge1$; to match the cases on the same slide it must be $\min$`, R`It changes the direction`, R`$v$ must be negative`],
        sol: R`The cases ($g$ if $\lVert g\rVert\le v$, otherwise $\frac v{\lVert g\rVert}g$) are $\min\big(1,\frac{v}{\lVert g\rVert}\big)g$.` },
      { q: R`Which architecture was designed to ease the **vanishing** gradients of the vanilla RNN?`,
        choices: [R`Gradient clipping`, R`The LSTM, which uses gates to carry a separate cell state`, R`A larger learning rate`, R`Initializing the hidden state to 0`],
        sol: R`Clipping handles explosion. Slides 17–22 introduce the LSTM as an architecture that helps gradient flow. The Jacobian multiplied along the cell state is $\diag(f_t)$, so with $f_t\approx1$ the gradient passes almost unchanged.` },
      { q: R`For $h_{k+1}=\phi(Wh_k+Uu_{k+1}+c)$ with $\gamma=\sup\lvert\phi'\rvert$, show that
$$\Big\lVert\frac{\partial\mathcal L}{\partial h_\ell}\Big\rVert\le\big(\gamma\lVert W\rVert_2\big)^{L-\ell}\Big\lVert\frac{\partial\mathcal L}{\partial h_L}\Big\rVert,$$
and from it write a sufficient condition for the gradient to vanish and a necessary condition for it to explode. With $\phi=\tanh$ and $W=0.5I$, at most by what factor is the gradient 20 steps back scaled?`,
        sol: R`
**One step.** $\frac{\partial h_{k+1}}{\partial h_k}=\diag(\phi'(a_{k+1}))W$. The 2-norm of a diagonal matrix is the largest absolute diagonal entry, so $\lVert\diag(\phi'(a_{k+1}))\rVert_2\le\gamma$, and by submultiplicativity of the norm $\big\lVert\frac{\partial h_{k+1}}{\partial h_k}\big\rVert_2\le\gamma\lVert W\rVert_2$.

**The product.** Applying submultiplicativity $L-\ell$ times to $\frac{\partial\mathcal L}{\partial h_\ell}=\frac{\partial\mathcal L}{\partial h_L}\prod_{k=\ell}^{L-1}\frac{\partial h_{k+1}}{\partial h_k}$ gives the result.

**Conditions.** If $\gamma\lVert W\rVert_2<1$, the right-hand side goes to 0 exponentially, a sufficient condition for vanishing. By contraposition, explosion (a growing product) requires $\gamma\lVert W\rVert_2>1$ (necessary, not sufficient).

**Example.** $\gamma=1$ and $\lVert0.5I\rVert_2=0.5$, so the factor is at most $0.5^{20}\approx9.5\times10^{-7}$.`,
        rubric: R`
- The one-step Jacobian and the bound $\gamma\lVert W\rVert_2$ — 3 pts
- The bound on the product — 2 pts
- Correctly distinguishing the sufficient and necessary conditions — 3 pts
- The value $0.5^{20}$ — 2 pts` },
      { q: R`Show that norm clipping $\mathrm{clip}(\mathbf g)=\min\big(1,\frac{v}{\lVert\mathbf g\rVert}\big)\mathbf g$ ($\mathbf g\ne\mathbf 0$, $v>0$) preserves the direction and that $\lVert\mathrm{clip}(\mathbf g)\rVert=\min(\lVert\mathbf g\rVert,v)$. Give an example of why value clipping, which cuts each component to $[-v,v]$, can change the direction.`,
        sol: R`
**Direction.** $s=\min(1,v/\lVert\mathbf g\rVert)>0$, so $\mathrm{clip}(\mathbf g)=s\mathbf g$ is a positive multiple of $\mathbf g$, that is, in the same direction.

**Size.** $\lVert s\mathbf g\rVert=s\lVert\mathbf g\rVert=\min(\lVert\mathbf g\rVert,v)$.

**Value clipping.** With $\mathbf g=(10,1)$ and $v=2$, value clipping gives $(2,1)$, whose direction differs from $(10,1)$. Norm clipping gives $\frac{2}{\sqrt{101}}(10,1)\approx(1.99,0.20)$.`,
        rubric: R`
- Direction preserved since it is a positive multiple — 2 pts
- The size computation — 2 pts
- A counterexample for value clipping — 1 pt` },
    ],
  };
})();
