/* English text — 09 Backpropagation (W4 Mon (1) slides 50–89 with notes, W4 Mon (2) notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    graph1: R`The upper numbers are the forward-pass values, and the lower numbers are $\partial f/\partial(\cdot)$ obtained by backpropagation. A multiplication node sends the gradients across, swapping the inputs.`,
    graph2: R`$f(\mathbf w,\mathbf x)=1/(1+e^{-(w_0x_0+w_1x_1+w_2)})$. The upper numbers are forward-pass values, and the lower numbers are backpropagated gradients. Grouping the $+,\ \times(-1)$, $\exp$, $+1$, $1/x$ nodes gives a single sigmoid gate, whose local gradient is $\sigma(1-\sigma)=0.73\times0.27\approx0.20$.`,
    mlpback: R`$x=(1,2)$, $W_1=\begin{pmatrix}0.5&-0.5\\1&0\end{pmatrix}$, $b_1=(0,-0.5)$, ReLU, $W_2=(1\ \ {-1})$, $b_2=0$, loss $\tfrac12(y-1)^2$. The upper values are the forward pass and the lower values the backward pass. The first hidden neuron has $a_1<0$, so it is off ($h_1=0$), and no gradient passes through it in backpropagation either.`,
  });
  EM.en.ch[9] = {
    title: 'Backpropagation and Computational Graphs',
    fig: R`A computational graph connected in layers. The bold line is one path along which the gradient flows back`,
    tagline: R`Downstream gradient = upstream gradient × local gradient. Repeating this one line at every node computes the gradient of any neural network.`,
    summary: R`Gradient descent needs the gradient of the loss with respect to every parameter. Deriving it by hand for a network with many layers is unrealistic, so we break the computation into a **graph of small nodes** and, at each node, multiply “upstream gradient × local gradient” and pass it backward (**backpropagation**). Addition distributes the gradient, multiplication swaps the inputs, copying adds the gradients, and max sends it to one side only. With vectors, Jacobians are multiplied; an elementwise function has a diagonal Jacobian and becomes an elementwise product, and a matrix product $z=Wx$ is computed by $\partial L/\partial x=W^T\delta$ and $\partial L/\partial W=\delta x^T$. Repeating this layer by layer is the backpropagation recursion of the multilayer perceptron.`,
    goals: [
      R`Write the gradient descent algorithm (initialization, update, stopping condition) and explain why backpropagation is needed`,
      R`Compute the forward-pass values and backpropagated gradients node by node in a computational graph`,
      R`Backpropagate the sigmoid neuron example node by node, and at once with a single sigmoid gate`,
      R`State the gradient rules of the add, multiply, copy, and max gates and their justification (the multivariable chain rule)`,
      R`Derive the vector backpropagation formulas $W^T\delta$, $\delta x^T$ for elementwise functions and matrix products, and check the sizes`,
      R`Derive the backpropagation recursion of an MLP and compute every gradient of a small network by hand`,
    ],
    secTitles: { '9.1': 'Gradient descent', '9.2': 'Chain rule', '9.3': 'Sigmoid neuron', '9.4': 'Gate patterns', '9.5': 'Vectors · Jacobians', '9.6': 'MLP backprop' },
    secs: {
      '9.1': { title: 'Gradient Descent and the Problem of Computing Gradients', body: R`
:::idea In plain words
When the network is wrong, we need to know “which weight is responsible, and by how much?” to fix it. The size of that responsibility is the gradient $\partial L/\partial w$. With millions of parameters, measuring responsibility by wiggling them one by one is impossible (millions of forward passes); instead, distributing the responsibility **backward** from the output gives every responsibility in a single backward computation. This is backpropagation.
:::

We learn the weights by optimization. On the loss surface, different starting points can lead to different local minima.

:::key The gradient descent method
1. (Random) initialization $\theta^0$
2. Update the solution with a small step size: $\theta^{k+1}\leftarrow\theta^k-\alpha\nabla\mathcal L(\theta^k)$
3. Repeat until the stop condition is satisfied: $k\ge N$ or $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$
:::

Notes: the iterations were counted in **epochs**, with a picture of the loss going down unevenly. (Strictly, an epoch is “one pass over the whole training data”, and one update is an iteration. In full-batch gradient descent the two coincide[[ch10:10.3|In minibatch SGD, one epoch contains many updates.]].) Backpropagation was proposed by Werbos (1974) and by Rumelhart, Hinton, and Williams (1986). As in the slide's figure, a neuron multiplies the inputs $x_i$ by weights $w_{ij}$, sums them into $\mathrm{net}_j$, and feeds it to the activation function $\varphi$ to output $o_j$; backpropagation follows these arrows in reverse to send the gradients.

**Why backpropagation.** For the 2-layer network $s=f(x;W_1,W_2)=W_2\max(0,W_1x)$, the SVM loss $L_i=\sum_{j\ne y_i}\max(0,s_j-s_{y_i}+1)$, the regularizer $R(W)=\sum_kW_k^2$, and the total loss
$$L=\frac1N\sum_{i=1}^NL_i+\lambda R(W_1)+\lambda R(W_2),$$
should we derive $\partial L/\partial W_1$ and $\partial L/\partial W_2$ **by hand**? We would have to redo the derivation every time the layers change, which is unrealistic. We compute them mechanically with the computational graph and the chain rule.

**Reading the SVM loss.** $L_i$ is “0 if the correct score $s_{y_i}$ exceeds every other score by at least 1, and otherwise a penalty equal to the shortfall”. Example: with scores $s=(3.2,\ 5.1,\ -1.7)$ and correct class 1, $L_i=\max(0,5.1-3.2+1)+\max(0,-1.7-3.2+1)=2.9+0=2.9$.

### Going deeper: comparison with numerical differentiation

Computing the gradient by **numerical differentiation** $\frac{\partial L}{\partial\theta_j}\approx\frac{L(\theta+h e_j)-L(\theta-he_j)}{2h}$ needs $2P$ forward passes for $P$ parameters. Backpropagation gives **all** $P$ gradients exactly with 1 forward pass + 1 backward pass (of similar cost). So numerical differentiation is used only for **gradient checking**, to verify that backpropagation code is correct (a relative error around $10^{-7}$ is normal). “All the derivatives of one output with respect to every input at once” is possible because the loss is a **scalar**, and this method is called reverse-mode automatic differentiation[[@med:ch10:8.2|Automatic differentiation: forward mode and reverse mode.]].
` },
      '9.2': { title: 'Computational Graphs and the Chain Rule', body: R`
:::idea In plain words
Think of gears. Turning $x$ by 1 turns $q$ by 1 ($\partial q/\partial x=1$), and turning $q$ by 1 turns $f$ by $z$ ($\partial f/\partial q=z$). Then turning $x$ by 1 turns $f$ by $1\times z$. The chain rule is the rule that **multiplies rates of change**, and backpropagation accumulates these products in order, starting from the output side.
:::

$f(x,y,z)=(x+y)z$, inputs $(x,y,z)=(-2,5,-4)$. We introduce the intermediate value $q=x+y$.

**Forward pass.** $q=3$, $f=qz=-12$.

**Backward pass.** Start at the end with $\dfrac{\partial f}{\partial f}=1$.
- $f=qz$: $\dfrac{\partial f}{\partial z}=q=3$, $\dfrac{\partial f}{\partial q}=z=-4$
- $q=x+y$: $\dfrac{\partial q}{\partial x}=\dfrac{\partial q}{\partial y}=1$
- Chain rule: $\dfrac{\partial f}{\partial x}=\dfrac{\partial f}{\partial q}\dfrac{\partial q}{\partial x}=-4$, $\dfrac{\partial f}{\partial y}=-4$[[@base:ch04:4.2|The multivariable chain rule and products of Jacobian matrices.]]

:::fig graph1
:::

**Check.** Differentiating $f=(x+y)z$ directly gives $\partial f/\partial x=z=-4$, $\partial f/\partial y=z=-4$, $\partial f/\partial z=x+y=3$. The same. Meaning: increasing $x$ a little ($\varepsilon$) changes $f$ by about $-4\varepsilon$. Indeed, with $x=-1.99$, $f=(3.01)(-4)=-12.04$.

:::key The chain rule: upstream × local gradient
When the upstream gradient $\dfrac{\partial L}{\partial z}$ arrives from behind at a node $z=f(x,y)$,
$$\underbrace{\frac{\partial L}{\partial x}}_{\text{downstream}}=\underbrace{\frac{\partial L}{\partial z}}_{\text{upstream}}\ \underbrace{\frac{\partial z}{\partial x}}_{\text{local}},\qquad \frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}\frac{\partial z}{\partial y}$$
If a variable flows into several nodes, the gradients of the paths are **added**.
:::

Each node can compute its local gradient knowing only its own inputs and output, so however complex the whole graph is, the computation finishes node by node. This is the heart of backpropagation. Remember also that the input values of each node must be **stored** during the forward pass so that the local gradients can be computed in the backward pass (the memory cost).

:::ex Example 1 — When a variable is used twice
Find $\partial f/\partial x$ for $f(x,y)=(x+y)\cdot x$ at $(x,y)=(2,3)$ with a computational graph.
---
Graph: $q=x+y=5$, $f=q\cdot x=10$. $x$ flows into **two places**: the addition node and the multiplication node.
- Through the multiplication node (directly): $\frac{\partial f}{\partial x}\big|_{\text{direct}}=q=5$
- Through the addition node: $\frac{\partial f}{\partial q}\cdot\frac{\partial q}{\partial x}=x\cdot1=2$
Adding the two paths, $\frac{\partial f}{\partial x}=5+2=7$. Differentiating directly, $f=x^2+xy$ and $\partial f/\partial x=2x+y=7$ ✓. Counting only one path is wrong.
:::
` },
      '9.3': { title: 'Backpropagation for a Sigmoid Neuron', body: R`
:::idea In plain words
Break a single logistic neuron into very small pieces (multiply, add, $\times(-1)$, $\exp$, $+1$, $1/x$), and the derivative of each piece is high-school level. Start a 1 at the end and, at each piece, multiply “incoming gradient × my derivative” and pass it on, and the gradients of all the weights come out.
:::

$$f(w,x)=\frac1{1+e^{-(w_0x_0+w_1x_1+w_2)}},$$
$$w_0=2,\ x_0=-1,\ w_1=-3,\ x_1=-2,\ w_2=-3$$

**Forward pass.** $w_0x_0=-2$, $w_1x_1=6$, sum $4$, $+w_2$ → $1$, $\times(-1)$ → $-1$, $\exp$ → $0.37$, $+1$ → $1.37$, $1/x$ → $0.73$.

**Table of local gradients.**

| Node | Formula | Local gradient |
|---|---|---|
| Exponential | $f(x)=e^x$ | $e^x$ |
| Constant multiple | $f_a(x)=ax$ | $a$ |
| Reciprocal | $f(x)=1/x$ | $-1/x^2$ |
| Adding a constant | $f_c(x)=c+x$ | $1$ |

**Backward pass.** Start from the output gradient $1.00$ and multiply in order.
- $1/x$: $(1.00)\big(-1/1.37^2\big)=-0.53$
- $+1$: $(-0.53)(1)=-0.53$
- $\exp$: $(-0.53)(e^{-1})=-0.20$
- $\times(-1)$: $(-0.20)(-1)=0.20$
- Addition: $0.20$ is distributed unchanged → the gradient of $w_2$ is $0.20$
- Multiplication $w_0x_0$: $0.20\times x_0=-0.20$ to $w_0$, $0.20\times w_0=0.40$ to $x_0$
- Multiplication $w_1x_1$: $0.20\times x_1=-0.40$ to $w_1$, $0.20\times w_1=-0.60$ to $x_1$

:::fig graph2
:::

:::key The sigmoid gate
$$\sigma(x)=\frac1{1+e^{-x}},$$
$$\frac{d\sigma}{dx}=\frac{e^{-x}}{(1+e^{-x})^2}=\Big(\frac{1+e^{-x}-1}{1+e^{-x}}\Big)\Big(\frac1{1+e^{-x}}\Big)=(1-\sigma(x))\sigma(x)$$
In the example above, $[1.00]\times[(1-0.73)(0.73)]\approx0.20$: the same as processing the four nodes at once.
:::

The representation of a computational graph is **not unique**. Choose node units whose local gradients are easy.

**Checking with the formula.** $z=w_0x_0+w_1x_1+w_2=1$, $\sigma(1)\approx0.7311$, $\sigma'(1)=0.7311\times0.2689\approx0.1966$. By the chain rule, $\frac{\partial f}{\partial w_0}=\sigma'(z)x_0=-0.197$, $\frac{\partial f}{\partial w_1}=\sigma'(z)x_1=-0.393$, $\frac{\partial f}{\partial w_2}=\sigma'(z)=0.197$, $\frac{\partial f}{\partial x_0}=\sigma'(z)w_0=0.393$, $\frac{\partial f}{\partial x_1}=\sigma'(z)w_1=-0.590$. These agree with the values on the slide (rounded to two decimals).

Notes (Week 4 Monday 2): the $\nabla_wf=\big(\frac{\partial f}{\partial w_0},\frac{\partial f}{\partial w_1},\frac{\partial f}{\partial w_2}\big)=(-0.2,-0.4,0.2)$ obtained this way goes into one step of gradient descent solving $\min_wf(w,x)$.

:::ex Example 2 — One update step
For the neuron above, apply one step of gradient descent with learning rate $0.5$ that **decreases** $f$. What are $w$ and the new output?
---
$w\leftarrow w-0.5\nabla_wf=(2,-3,-3)-0.5(-0.2,-0.4,0.2)=(2.1,\ -2.8,\ -3.1)$. The new $z=2.1(-1)+(-2.8)(-2)-3.1=-2.1+5.6-3.1=0.4$, and $\sigma(0.4)\approx0.599<0.731$. The output decreased.
:::
` },
      '9.4': { title: 'Patterns in Gradient Flow', body: R`
:::idea In plain words
Memorize just the “gradient pass-through rules” of four common nodes, and you can backpropagate most graphs by eye. Addition **distributes** equally, multiplication **swaps** by multiplying by the other value, a copied variable **adds up** all the gradients that come back, and max **sends** only to the winner.
:::

:::key Gradient rules for each gate
- **add gate = gradient distributor**: if $z=x+y$, then $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}$ (e.g., $3+4=7$, upstream 2 → both get 2)
- **mul gate = “swap multiplier”**: if $z=xy$, then $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z}\,y$, $\frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}\,x$ (e.g., $2\times3=6$, upstream 5 → $15$ to $x$, $10$ to $y$)
- **copy gate = gradient adder**: if $x$ is used in two places, $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z_1}+\frac{\partial L}{\partial z_2}$ (e.g., 4 and 2 → 6)
- **max gate = gradient router**: if $z=\max(x,y)$, the larger input gets the whole upstream gradient and the smaller gets 0 (e.g., $\max(4,5)=5$, upstream 9 → 9 to the 5 side, 0 to the 4 side)
:::

The “adding” of the copy gate comes from the multivariable chain rule $\frac{\partial L}{\partial x}=\sum_k\frac{\partial L}{\partial z_k}\frac{\partial z_k}{\partial x}$. In a neural network, a hidden value spreads to every neuron of the next layer, so this rule is always in use.

**Why each rule holds.** Addition: $\partial(x+y)/\partial x=1$. Multiplication: $\partial(xy)/\partial x=y$ — so **the value of the other input** is multiplied. Max: if $x>y$, then near that point $\max(x,y)=x$ moves exactly with $x$, while small changes in $y$ do not affect the result, so $\partial/\partial x=1$ and $\partial/\partial y=0$ (at a tie it is not differentiable, but by convention one side is chosen). ReLU $\max(0,x)$ is a special case of the max gate.

:::warn The pitfall of the multiply gate
The multiply gate swaps the **magnitudes** of its inputs. If one input is very large (e.g., a large weight), the gradient of the other becomes very large too, and if it is very small, the gradient becomes almost 0. “Learning fails if the initial weights are too small” in Unit 11 and input normalization in Unit 12 are related to this property.
:::
` },
      '9.5': { title: 'Vector Inputs and Outputs and the Jacobian', body: R`
:::idea In plain words
Even when inputs and outputs are vectors, the principle is the same: “upstream gradient × local derivative”. Only the local derivative becomes a matrix (the Jacobian). The two cases common in neural networks — elementwise functions and matrix products — can be finished with short formulas without actually building the Jacobian.
:::

| Input → output | Derivative | Size and entries |
|---|---|---|
| Scalar → scalar | Ordinary derivative | $\frac{\partial y}{\partial x}\in\mathbb R$ |
| Vector $\mathbb R^N$ → scalar | Gradient | $\big(\frac{\partial y}{\partial x}\big)_n=\frac{\partial y}{\partial x_n}$, $\mathbb R^N$ |
| Vector $\mathbb R^N$ → vector $\mathbb R^M$ | Jacobian | $\big(\frac{\partial y}{\partial x}\big)_{n,m}=\frac{\partial y_m}{\partial x_n}$, $\mathbb R^{N\times M}$ |

(The notes also wrote the common $J=[\partial f_i/\partial x_j]$ ($M\times N$). The slide's $N\times M$ layout is its transpose, and in this layout the multiplication order $\frac{\partial L}{\partial x}=\frac{\partial y}{\partial x}\frac{\partial L}{\partial y}$ is natural.) Each entry means “if each component of $x$ changes a little, how much does each component of $y$ change?”

:::ex Example 3 — Elementwise ReLU (slide 87)
$x=(1,-2,3,-1)$, $y=\max(0,x)$ (elementwise), upstream gradient $\frac{\partial L}{\partial y}=(4,-1,5,9)$. What is $\frac{\partial L}{\partial x}$?
---
$y=(1,0,3,0)$. The Jacobian is the diagonal $\diag(1,0,1,0)$ (an elementwise function, so all off-diagonal entries are 0), hence
$$\frac{\partial L}{\partial x}=\diag(1,0,1,0)\begin{pmatrix}4\\-1\\5\\9\end{pmatrix}=\begin{pmatrix}4\\0\\5\\0\end{pmatrix}.$$
:::

:::key Backprop with vectors
Elementwise function $y_i=g(x_i)$: the Jacobian is diagonal, so **never build the matrix**; multiply elementwise: $\big(\frac{\partial L}{\partial x}\big)_i=g'(x_i)\big(\frac{\partial L}{\partial y}\big)_i$. For ReLU, it passes only where $x_i>0$.
Matrix product $z=Wx$ ($W\in\mathbb R^{M\times N}$), upstream $\delta=\frac{\partial L}{\partial z}\in\mathbb R^M$:
$$\frac{\partial L}{\partial x}=W^T\delta,\qquad \frac{\partial L}{\partial W}=\delta\,x^T\ \ (M\times N)$$
:::

**Derivation in components.** $z_i=\sum_jW_{ij}x_j$.
- $x_j$ enters every $z_i$ (a copy gate), so $\frac{\partial L}{\partial x_j}=\sum_i\frac{\partial L}{\partial z_i}\frac{\partial z_i}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j$.
- $W_{ij}$ enters only $z_i$, so $\frac{\partial L}{\partial W_{ij}}=\delta_i\frac{\partial z_i}{\partial W_{ij}}=\delta_ix_j$, i.e., the matrix $\delta x^T$ (an outer product).

The matrix-product rule is the matrix version of the “swap” rule of the multiply gate: the gradient of $x$ is multiplied by $W$, and the gradient of $W$ by $x$. Matching the sizes determines where the transposes go automatically.

:::tip Recovering the formulas from the sizes
$\frac{\partial L}{\partial W}$ must have the same size $M\times N$ as $W$, and the only ingredients are $\delta$ ($M\times1$) and $x$ ($N\times1$). The only way to make $M\times N$ is $\delta x^T$. Likewise, $\frac{\partial L}{\partial x}$ ($N\times1$) can only be $W^T\delta$ from $W$ ($M\times N$) and $\delta$. If you forget the formulas in an exam, match the sizes.
:::

:::ex Example 4 — Backprop through a matrix product
$W=\begin{pmatrix}1&2\\0&-1\\3&1\end{pmatrix}$, $x=(2,1)$, $z=Wx$, upstream $\delta=(1,-2,0.5)$. What are $\partial L/\partial x$ and $\partial L/\partial W$?
---
$W^T\delta=\big(1\cdot1+0\cdot(-2)+3\cdot0.5,\ 2\cdot1+(-1)(-2)+1\cdot0.5\big)=(2.5,\ 4.5)$.
$\delta x^T=\begin{pmatrix}2&1\\-4&-2\\1&0.5\end{pmatrix}$ (row $i$ = $\delta_i\times x^T$).
:::

### Going deeper: batches and the transpose convention

If $B$ samples are stacked as rows in $X\in\mathbb R^{B\times N}$ and computed as $Z=XW^T$ ($B\times M$) (the library convention), then $\frac{\partial L}{\partial X}=\frac{\partial L}{\partial Z}W$ and $\frac{\partial L}{\partial W}=\big(\frac{\partial L}{\partial Z}\big)^TX$ — the sum of the per-sample outer products $\delta_bx_b^T$. That the gradient of a batch is the sum (or mean) of the per-sample gradients is the starting point of minibatch SGD in Unit 10. Building the Jacobian would need an $M\times N$ matrix, but backpropagation uses only “Jacobian–vector products”, so memory of the size of the vectors suffices.
` },
      '9.6': { title: 'Backpropagation in a Multilayer Perceptron', body: R`
:::idea In plain words
For each layer, compute from the back “how much the loss changes if the input sum $a_\ell$ of this layer changes a little” ($\delta_\ell$). Each time we go back one layer we (1) multiply by the transpose of the weight matrix and (2) multiply elementwise by the gradient of the activation. Once we have $\delta_\ell$, the weight gradient of that layer is “$\delta_\ell$ × the input of that layer”.
:::

Applying the rules above in turn to the MLP $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$ with loss $L$ gives a recursion for the layer errors $\delta_\ell=\partial L/\partial a_\ell$.

:::key Backpropagation in a multilayer perceptron
$$\delta_L=\frac{\partial L}{\partial a_L},\qquad \delta_\ell=\sigma'(a_\ell)\odot\big(W_{\ell+1}^T\delta_{\ell+1}\big),\qquad \frac{\partial L}{\partial W_\ell}=\delta_\ell\,h_{\ell-1}^T,\qquad \frac{\partial L}{\partial b_\ell}=\delta_\ell$$
:::

**Derivation.** Layer $\ell+1$ is $h_\ell\xrightarrow{W_{\ell+1}}a_{\ell+1}$, and the activation of layer $\ell$ is $a_\ell\xrightarrow{\sigma}h_\ell$.
1. Matrix-product rule: $\frac{\partial L}{\partial h_\ell}=W_{\ell+1}^T\frac{\partial L}{\partial a_{\ell+1}}=W_{\ell+1}^T\delta_{\ell+1}$.
2. Elementwise rule: $\delta_\ell=\frac{\partial L}{\partial a_\ell}=\sigma'(a_\ell)\odot\frac{\partial L}{\partial h_\ell}$.
3. Matrix-product rule (weight side): from $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $\frac{\partial L}{\partial W_\ell}=\delta_\ell h_{\ell-1}^T$, and the bias is an addition, so $\frac{\partial L}{\partial b_\ell}=\delta_\ell$.

- Computing $\delta_\ell$ takes one matrix–vector product and one elementwise product, so one backward pass costs the same order as a forward pass.
- With a softmax + cross-entropy output, $\delta_L=p-y$[[ch06:6.3|$\partial J/\partial z_m=p_m-y_m$.]]; with a linear output + squared error $\frac12\lVert y_L-t\rVert^2$, $\delta_L=y_L-t$.
- The $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$ of the medical AI course (Bishop Ch. 8) is exactly this formula in component notation[[@med:ch10:8.1b|Error backpropagation: the error of a hidden unit = gradient of the activation × weighted sum of the next layer's errors.]].

:::ex Example 5 — A 2-2-1 network by hand, to the end
$x=(1,2)$, $W_1=\begin{pmatrix}0.5&-0.5\\1&0\end{pmatrix}$, $b_1=(0,-0.5)$, ReLU, $W_2=(1\ \ {-1})$, $b_2=0$, target $t=1$, loss $L=\frac12(y-t)^2$. Find every gradient.
---
**Forward pass.** $a_1=W_1x+b_1=(0.5-1+0,\ 1+0-0.5)=(-0.5,\ 0.5)$, $h=\ReLU(a_1)=(0,\ 0.5)$, $y=W_2h+b_2=-0.5$, $L=\frac12(-1.5)^2=1.125$.
**Output layer.** $\delta_2=y-t=-1.5$. $\frac{\partial L}{\partial W_2}=\delta_2h^T=(0,\ -0.75)$, $\frac{\partial L}{\partial b_2}=-1.5$.
**Hidden layer.** $W_2^T\delta_2=(-1.5,\ 1.5)$. Since $\ReLU'(a_1)=(0,1)$, $\delta_1=(0,\ 1.5)$.
$\frac{\partial L}{\partial W_1}=\delta_1x^T=\begin{pmatrix}0&0\\1.5&3\end{pmatrix}$, $\frac{\partial L}{\partial b_1}=(0,\ 1.5)$.
**Check.** Increasing the $(2,1)$ entry of $W_1$ by $\varepsilon$ increases $a_{1,2}$ by $\varepsilon\cdot x_1=\varepsilon$, $h_2$ by $\varepsilon$ as well, $y$ by $-\varepsilon$, and $L$ by about $(y-t)(-\varepsilon)=1.5\varepsilon$ ✓. The first hidden neuron is off, so the gradients of the first row of $W_1$ are all 0.
:::

:::fig mlpback
:::

### Going deeper: vanishing and exploding gradients

Unrolling the recursion, $\delta_\ell=\sigma'(a_\ell)\odot W_{\ell+1}^T\big(\sigma'(a_{\ell+1})\odot W_{\ell+2}^T(\cdots)\big)$ — $W^T$ and $\sigma'$ are **multiplied** at every layer. The sigmoid has $\sigma'\le\frac14$, so with 10 layers the gradient can shrink by a factor $4^{-10}\approx10^{-6}$ and vanish; with large weights it explodes instead. Unit 10 (ReLU), Unit 11 (initialization that preserves variance), and Unit 12 (batch normalization) are all devices for keeping this product near 1[[ch11:11.1|Experiments in which activations and gradients vanish or explode with too small or too large an initialization.]].
` },
    },
    probs: [
      // u09
      { q: R`For $f=(x+y)z$ at $(x,y,z)=(1,2,3)$, what is $\partial f/\partial x$?`,
        sol: R`$\partial f/\partial q=z=3$, $\partial q/\partial x=1$. $3$.` },
      { q: R`At the same input, what is $\partial f/\partial z$?`,
        sol: R`$\partial f/\partial z=q=x+y=3$.` },
      { q: R`For $f=(x+y)\cdot\max(y,z)$ at $(x,y,z)=(1,3,2)$, what is $\partial f/\partial y$?`,
        sol: R`$y$ is used along two paths. $q=x+y=4$, $m=\max(y,z)=3$ (the $y$ side). $\partial f/\partial y=m\cdot1+q\cdot1=3+4=7$. The sum of the copy gate.` },
      { q: R`In the sigmoid neuron example, what is the gradient with respect to $x_1$?`,
        sol: R`$0.20$ comes into the addition node after the sigmoid gate, and at the multiply gate $w_1x_1$ the gradient of $x_1$ is $0.20\times w_1=0.20\times(-3)=-0.60$.` },
      { q: R`In the same neuron, if the inputs are changed to $x_0=0$, $x_1=0$ ($w$ unchanged), what is $\partial f/\partial w_2$?`,
        sol: R`The sum is $w_2=-3$, so $\sigma(-3)\approx0.0474$. $\partial f/\partial w_2=\sigma(1-\sigma)\approx0.0474\times0.9526\approx0.0452$.` },
      { q: R`What is the local gradient of the $1/x$ node?`,
        choices: [R`$1/x^2$`, R`$-1/x^2$`, R`$\ln x$`, R`$-x^2$`],
        sol: R`$\frac d{dx}x^{-1}=-x^{-2}$. In the example, $-1/1.37^2\approx-0.53$.` },
      { q: R`For the multiply gate $z=xy$ with $x=2$, $y=3$, and upstream gradient 5, what is $\partial L/\partial x$?`,
        sol: R`Swapping the inputs: $5\times y=15$. $\partial L/\partial y=5\times x=10$.` },
      { q: R`For $z=\max(x,y)$ with $x=4$, $y=5$, and upstream gradient 9, what is $(\partial L/\partial x,\ \partial L/\partial y)$?`,
        choices: [R`$(9,9)$`, R`$(0,9)$`, R`$(4.5,4.5)$`, R`$(9,0)$`],
        sol: R`The max gate sends the gradient only to the selected input.` },
      { q: R`A hidden value is copied to three neurons of the next layer, which receive upstream gradients $1,-2,4$. What is the gradient of that hidden value?`,
        choices: [R`4`, R`3`, R`$-2$`, R`$\tfrac13$`],
        sol: R`The copy gate adds the gradients: $1-2+4=3$.` },
      { q: R`For $x=(2,-1,0.5)$, $y=\max(0,x)$, and upstream $\partial L/\partial y=(3,7,-2)$, what is the sum of the components of $\partial L/\partial x$?`,
        sol: R`The mask is $(1,0,1)$, so $(3,0,-2)$, with sum $1$.` },
      { q: R`For $z=Wx$, $W\in\mathbb R^{3\times5}$, and upstream $\delta\in\mathbb R^3$, what is $\partial L/\partial W$?`,
        choices: [R`$x\delta^T$ ($5\times3$)`, R`$\delta x^T$ ($3\times5$)`, R`$W^T\delta$`, R`$\delta^Tx$`],
        sol: R`Since $z_i=\sum_jW_{ij}x_j$, $\partial L/\partial W_{ij}=\delta_ix_j$, i.e., $\delta x^T$. It must have the same size as $W$.` },
      { q: R`For $W=\begin{pmatrix}1&2\\0&-1\end{pmatrix}$, $z=Wx$, and upstream $\delta=(3,1)$, what is the second component of $\partial L/\partial x$?`,
        sol: R`$W^T\delta=\begin{pmatrix}1&0\\2&-1\end{pmatrix}\begin{pmatrix}3\\1\end{pmatrix}=(3,\ 6-1)=(3,5)$.` },
      { q: R`In an MLP with $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$, what problem tends to arise as the network gets deeper with sigmoid activations?`,
        choices: [R`Only exploding gradients`, R`$\sigma'\le\frac14$ is multiplied at every layer, so gradients tend to vanish`, R`The gradient is always 1`, R`Backpropagation becomes impossible`],
        sol: R`Unless the weights are large, factors of at most $\frac14$ are multiplied as many times as there are layers, and the gradients of the early layers approach 0. ReLU (slope 1 on the positive side), good initialization, batch normalization, and residual connections mitigate this.` },
      { q: R`Draw the computational graph of $f(w,x)=\sigma(w_0x_0+w_1x_1+w_2)$, and find the gradients of all inputs by backpropagation at $w_0=2,x_0=-1,w_1=-3,x_1=-2,w_2=-3$. Check that grouping the sigmoid gate into one node gives the same answer.`,
        sol: R`
Forward: $w_0x_0=-2$, $w_1x_1=6$, sum $4$, $+w_2=1$, $\times-1=-1$, $e^{(\cdot)}=0.368$, $+1=1.368$, $1/x=0.731$.
Backward: $1/x$: $-1/1.368^2=-0.534$; $+1$: $-0.534$; $\exp$: $-0.534\times0.368=-0.197$; $\times-1$: $0.197$; addition: $0.197$ to $w_2$ and to both products.
Multiplication: $\partial f/\partial w_0=0.197\times(-1)=-0.197$, $\partial f/\partial x_0=0.197\times2=0.393$, $\partial f/\partial w_1=0.197\times(-2)=-0.393$, $\partial f/\partial x_1=0.197\times(-3)=-0.590$.
**Grouped.** $\sigma'(1)=\sigma(1)(1-\sigma(1))=0.731\times0.269=0.197$. The same value is passed to the addition node, so the result is the same (rounded, the slide's $-0.20,0.40,-0.40,-0.60,0.20$).`,
        rubric: R`
- Forward values — 3 pts
- Local gradient and product at each node of the backward pass — 4 pts
- The swap rule of the multiply gate — 2 pts
- Checking with the sigmoid gate — 1 pt` },
      { q: R`If $z=Wx$ ($W\in\mathbb R^{M\times N}$) and $L$ depends on $W,x$ only through $z$, prove in components that $\frac{\partial L}{\partial x}=W^T\frac{\partial L}{\partial z}$ and $\frac{\partial L}{\partial W}=\frac{\partial L}{\partial z}x^T$.`,
        sol: R`
$z_i=\sum_{j=1}^NW_{ij}x_j$. Multivariable chain rule: $\frac{\partial L}{\partial x_j}=\sum_i\frac{\partial L}{\partial z_i}\frac{\partial z_i}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j$.
$W_{kl}$ appears only in $z_k$ and $\partial z_k/\partial W_{kl}=x_l$, so $\frac{\partial L}{\partial W_{kl}}=\delta_kx_l=(\delta x^T)_{kl}$.`,
        rubric: R`
- The componentwise formula for $z_i$ — 2 pts
- The chain rule for $x$ (a sum) — 4 pts
- The gradient for $W$ and its outer-product form — 4 pts` },
      // more-09
      { q: R`For $f(x,y,z)=xy+\max(x,z)$ at $(x,y,z)=(3,-2,1)$, what is $\partial f/\partial x$?`,
        sol: R`$x$ flows into two places, the multiplication node and the max node (copy → add). Multiplication: the other input $y=-2$. Max: $x=3>z=1$, so 1 goes to $x$. The sum is $-2+1=-1$. ($\partial f/\partial z=0$.)` },
      { q: R`For the sigmoid neuron $f=\sigma(w_0x_0+w_1x_1+w_2)$ with $w=(1,-1,1)$ and $x=(2,3)$, what is $\partial f/\partial w_0$?`,
        sol: R`$z=2-3+1=0$, $\sigma(0)=\tfrac12$, $\sigma'(0)=\tfrac14$. $\partial f/\partial w_0=\sigma'(z)x_0=\tfrac14\cdot2=0.5$.` },
      { q: R`With $x=(2,-1)$, $W_1=\begin{pmatrix}1&1\\-1&2\end{pmatrix}$, $b_1=(0,1)$, ReLU, $W_2=(2\ \ {-1})$, $b_2=0.5$, target $t=0$, and loss $\frac12(y-t)^2$, what is $\partial L/\partial(W_1)_{12}$ (row 1, column 2)?`,
        sol: R`Forward: $a_1=(2-1,\ -2-2+1)=(1,-3)$, $h=(1,0)$, $y=2+0.5=2.5$. $\delta_2=2.5$. $W_2^T\delta_2=(5,-2.5)$, ReLU$'$$=(1,0)$ → $\delta_1=(5,0)$. $\partial L/\partial W_1=\delta_1x^T=\begin{pmatrix}10&-5\\0&0\end{pmatrix}$. The (1,2) entry is $-5$.` },
      { q: R`For $z=Wx+b$ ($W\in\mathbb R^{M\times N}$) with upstream gradient $\delta=\partial L/\partial z$, derive $\frac{\partial L}{\partial x}=W^T\delta$, $\frac{\partial L}{\partial W}=\delta x^T$, $\frac{\partial L}{\partial b}=\delta$ by computing in components.`,
        sol: R`
$z_i=\sum_jW_{ij}x_j+b_i$. $L$ depends only through $z$, so the chain rule gives $\frac{\partial L}{\partial\theta}=\sum_i\frac{\partial L}{\partial z_i}\frac{\partial z_i}{\partial\theta}$.
- $\frac{\partial z_i}{\partial x_j}=W_{ij}$ → $\frac{\partial L}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j$.
- $\frac{\partial z_k}{\partial W_{ij}}=\delta_{ki}x_j$ (Kronecker delta) → $\frac{\partial L}{\partial W_{ij}}=\delta_ix_j=(\delta x^T)_{ij}$.
- $\frac{\partial z_k}{\partial b_i}=\delta_{ki}$ → $\frac{\partial L}{\partial b_i}=\delta_i$.`,
        rubric: R`
- Componentwise expression and the multivariable chain rule — 3 pts
- The gradient for $x$ (why a sum remains) — 3 pts
- The gradient for $W$ (why only one term remains) — 3 pts
- The bias — 1 pt` },
      { q: R`In the MLP $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$, derive that $\delta_\ell=\partial L/\partial a_\ell$ satisfies $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$, and write that $\delta_L=p-y$ when the output is softmax + cross-entropy.`,
        sol: R`
$a_{\ell+1}=W_{\ell+1}h_\ell+b_{\ell+1}$, and $L$ depends on $h_\ell$ only through $a_{\ell+1}$, so (the matrix-product rule) $\frac{\partial L}{\partial h_\ell}=W_{\ell+1}^T\delta_{\ell+1}$.
$h_\ell=\sigma(a_\ell)$ is elementwise, so its Jacobian is the diagonal $\diag(\sigma'(a_\ell))$: $\delta_\ell=\sigma'(a_\ell)\odot\frac{\partial L}{\partial h_\ell}$.
Output: if $L=-\sum_ky_k\log p_k$ and $p=\softmax(a_L)$, then $\frac{\partial L}{\partial a_{L,m}}=-\sum_k\frac{y_k}{p_k}p_k(\delta_{km}-p_m)=p_m-y_m$ ($\sum y_k=1$).`,
        rubric: R`
- The gradient with respect to $h_\ell$ — 4 pts
- The diagonal Jacobian of an elementwise activation — 3 pts
- $\delta_L$ of the softmax output — 3 pts` },
      { q: R`Approximate the derivative of $f(w)=w^3$ at $w=2$ by the central difference $\frac{f(w+h)-f(w-h)}{2h}$ with $h=0.01$. (4 decimal places)`,
        sol: R`$\frac{2.01^3-1.99^3}{0.02}=\frac{8.120601-7.880599}{0.02}=12.0001$. The error relative to the true value 12 is $h^2=10^{-4}$ — the error of the central difference is $O(h^2)$. It is used for gradient checking.` },
      { q: R`Why must the input values of each node be stored during the forward pass in order to backpropagate?`,
        choices: [R`To recompute the output probabilities`, R`Because the local gradients (e.g., the other input of a multiply gate, the sign for ReLU) depend on forward-pass values`, R`To set the learning rate`, R`They need not be stored`],
        sol: R`For example, the local gradients of $z=xy$ are $y$ and $x$, and the local gradient of $\sigma$ is $\sigma(a)(1-\sigma(a))$. So the memory cost of backpropagation is the size of the stored activations.` },
      { q: R`For $f=\tanh(w^Tx+b)$, derive $\nabla_wf$ and $\partial f/\partial b$ by backpropagation through the computational graph (linear → tanh).`,
        sol: R`
$a=w^Tx+b$, $f=\tanh a$. At the output, $\partial f/\partial f=1$. The local gradient of the tanh node is $1-\tanh^2a=1-f^2$ → $\partial f/\partial a=1-f^2$.
$a=\sum_jw_jx_j+b$: the multiply gate gives $\partial a/\partial w_j=x_j$, and the addition gives $\partial a/\partial b=1$.
Hence $\nabla_wf=(1-f^2)x$ and $\partial f/\partial b=1-f^2$.`,
        rubric: R`
- The graph and the forward pass — 2 pts
- The local gradient of tanh — 4 pts
- The weight and bias gradients — 4 pts` },
      { q: R`For $z=\max(x,y)$ with $x=-1$, $y=-3$, and upstream gradient $6$, what is $\partial L/\partial y$?`,
        sol: R`The larger one is $x=-1$, so the whole gradient 6 goes to $x$ and $y$ gets 0.` },
      // quizprep-b
      { q: R`A 2-layer network $a=W_1x+b_1$, $h=\ReLU(a)$, $z=W_2h+b_2$, $p=\softmax(z)$, $L=-\sum_ky_k\log p_k$ ($y$ one-hot).
1. Show that $\delta_2:=\partial L/\partial z=p-y$.
2. Use the chain rule to derive $\dfrac{\partial L}{\partial W_2}=\delta_2h^T$, $\dfrac{\partial L}{\partial b_2}=\delta_2$, $\delta_1:=\dfrac{\partial L}{\partial a}=(W_2^T\delta_2)\odot\mathbb 1[a\gt0]$, and $\dfrac{\partial L}{\partial W_1}=\delta_1x^T$.
3. With $x=(1,2)$, $W_1=\begin{pmatrix}1&-1\\0&1\end{pmatrix}$, $b_1=0$, $W_2=I$, $b_2=0$, and correct class 1 ($y=(1,0)$), find $p$, $L$, and $\partial L/\partial W_1$. (4 decimal places)`,
        sol: R`
**1.** Since $\sum_ky_k=1$, $L=-\sum_ky_kz_k+\log\sum_je^{z_j}$. $\frac{\partial L}{\partial z_k}=-y_k+\frac{e^{z_k}}{\sum_je^{z_j}}=p_k-y_k$.
**2.** Since $z_k=\sum_j(W_2)_{kj}h_j+(b_2)_k$, $\frac{\partial L}{\partial(W_2)_{kj}}=\delta_{2,k}h_j$ ($\delta_2h^T$ as a matrix) and $\frac{\partial L}{\partial(b_2)_k}=\delta_{2,k}$. $h_j$ enters every $z_k$, so $\frac{\partial L}{\partial h_j}=\sum_k\delta_{2,k}(W_2)_{kj}=(W_2^T\delta_2)_j$. The derivative of $h_j=\max(0,a_j)$ is $\mathbb 1[a_j\gt0]$ (0 by convention at $a_j=0$), so $\delta_1=(W_2^T\delta_2)\odot\mathbb 1[a\gt0]$. Finally, from $a_j=\sum_i(W_1)_{ji}x_i+(b_1)_j$, $\frac{\partial L}{\partial(W_1)_{ji}}=\delta_{1,j}x_i$.
**3.** $a=(1-2,\ 2)=(-1,2)$, $h=(0,2)$, $z=(0,2)$.
$$p=\Big(\frac1{1+e^2},\frac{e^2}{1+e^2}\Big)\approx(0.1192,\ 0.8808),\qquad L=\log(1+e^2)\approx2.1269.$$
$\delta_2=p-y\approx(-0.8808,\ 0.8808)$, $W_2^T\delta_2=\delta_2$, and the mask $\mathbb 1[a\gt0]=(0,1)$ gives $\delta_1\approx(0,\ 0.8808)$.
$$\frac{\partial L}{\partial W_1}=\delta_1x^T\approx\begin{pmatrix}0&0\\0.8808&1.7616\end{pmatrix}.$$
The first hidden unit is off ($a_1\lt0$), so no gradient flows into its row.`,
        rubric: R`
- $\delta_2=p-y$ — 2 pts
- Deriving the four gradients (stating the ReLU derivative) — 4 pts
- Forward values — 2 pts; backward values — 2 pts` },
    ],
  };
})();
