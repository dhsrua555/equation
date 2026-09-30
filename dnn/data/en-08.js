/* English text — 08 Neural Networks & Multilayer Perceptrons (W3 Wed recorded slides 1–50, W4 Mon slides 48–49). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    actfns: R`(a) The sigmoid confines values to $(0,1)$ and tanh to $(-1,1)$, and both flatten out at the ends (saturation: gradient ≈ 0). (b) ReLU has slope 1 for positive inputs, so it does not saturate there, and it is the cheapest to compute. On the negative side ReLU is 0 (gradient 0), Leaky ReLU has a small slope 0.1, and ELU approaches $-1$ smoothly.`,
    xorfig: R`(a) The filled points $(0,1),(1,0)$ have label 1 and the open points $(0,0),(1,1)$ label 0. No single line can separate them, but the network $f=\max(0,x_1+x_2)-2\max(0,x_1+x_2-1)$ has $f>\tfrac12$ in the band between two parallel lines (shaded), which gets XOR right. (b) $f$ is a function of $s=x_1+x_2$ alone; the “bent line” made by the two hidden units (dashed) peaks at $s=1$.`,
  });
  EM.en.ch[8] = {
    title: 'Neural Networks & Multilayer Perceptrons',
    fig: R`Activation functions: ReLU (bold), leaky ReLU, ELU, tanh, sigmoid`,
    tagline: R`A neural network is linear functions chained together with nonlinear activations. Remove the activations and any number of stacked layers is a single linear function.`,
    summary: R`A neural network is the function $f(x)=W_2\max(0,W_1x)$: **linear functions (matrix products) chained together and separated by nonlinear activation functions**. Without the activations, any number of stacked layers equals a single matrix, so the nonlinearity is the key. A single-layer perceptron can only draw a straight boundary and cannot even solve XOR, but with a hidden layer it learns a **nonlinear embedding** that moves the inputs into a linearly separable space. A deep network stacks several stages of abstraction, such as edges → parts → whole. Finally we define the multilayer perceptron (MLP) by formulas and count its parameters.`,
    goals: [
      R`Explain the perception–reason–action structure of AI, the classification problem, and decision regions and boundaries`,
      R`Show that a composition of linear layers is a single affine function, and say why activation functions are needed`,
      R`Know the formulas and shapes of the main activation functions (sigmoid, tanh, ReLU, Leaky ReLU, Maxout, ELU), and compute a forward pass by hand`,
      R`Prove that XOR is not linearly separable, and build a network with ReLU hidden units that computes XOR`,
      R`Interpret hidden layers as nonlinear embeddings and as a hierarchy of abstractions`,
      R`Write an MLP by formulas and compute the matrix size of each layer and the total number of parameters`,
    ],
    secTitles: { '8.1': 'AI · classification', '8.2': 'Linear + nonlinear', '8.3': 'Activations · softmax', '8.4': 'Perceptron', '8.5': 'Why stack layers', '8.6': 'MLP' },
    secs: {
      '8.1': { title: 'The Goal of AI and the Classification Problem', body: R`
:::idea In plain words
Think of a self-driving car: it turns what the camera **sees** (a picture) into numbers (perception), **computes** from those numbers the judgment “there is a pedestrian ahead” (reasoning), and **executes** “stop” (action). The part deep learning takes on is the computation in the middle — a function $f(x;W)$ sending the input $x$ to the output $y$ — and the knobs $W$ of that function are set **by data**, not by people.
:::

The goal of AI is “to model the components of intelligence as computable functions”, which can be viewed in three stages.
- **Perception**: turn observations into a form the machine can handle
- **Reason**: a mapping $f(x;W)$ from data to outputs. In deep learning it is a neural network, and the parameters $W$ are learned from data
- **Action**: a decision (turn right/left, etc.)

**Classification** is the problem $f:\mathcal X\to\mathcal Y$ of assigning input data to one of two or more classes (e.g., $\mathcal X=\mathbb R^2$, $\mathcal Y=\{C_1,C_2,C_3\}$). Any decision rule divides the input space into **decision regions** $R_1,R_2,\dots$ separated by **decision boundaries**. Logistic and softmax regression were classifiers whose decision boundaries are hyperplanes[[ch06:6.1|Choosing the largest of the class scores $w_k^Tx$ makes the boundary a union of pieces of hyperplanes.]].

In image classification (cs231n: cat 82%, dog 15%, …), what the computer sees is a big table of pixel values. The traditional approach extracted **hand-crafted features** such as color (quantized RGB values) and texture (filter banks) and trained a classifier separately. Such features have a hard time achieving **invariance** to translation, scale, rotation, and occlusion. Deep learning is an **end-to-end** approach that learns the features and the classifier together: from the training images and training labels it builds the “learned image features & classifier” $f'(x)$ at once, and outputs a prediction $\hat y$ on a test image.

:::ex Example 1 — How many numbers is an image?
How many dimensions does a $32\times32$ color image (CIFAR10) and a $28\times28$ gray-scale image (MNIST) have as a vector?
---
A color image has three values R, G, B per pixel, so $32\times32\times3=3072$ dimensions. A gray-scale image has one value per pixel, so $28\times28=784$ dimensions. This is the size of the network's input layer.
:::
` },
      '8.2': { title: 'Composing Linear Functions and Nonlinearities', body: R`
:::idea In plain words
A linear function (a matrix product) is a transformation that “stretches, rotates, and mixes”, so it sends **lines to lines**. Chaining several such transformations is still one linear transformation in the end. So we insert “bending” functions (activations) between the layers. For example, ReLU $\max(0,z)$ cuts negative values to 0 and bends a line. With enough bends, it can imitate any curve.
:::

A neural network is **linear functions chained together and separated by nonlinear functions (activation functions)**. It is very roughly inspired by real neurons (which receive signals through dendrites, sum them in the cell body, and send a signal out along the axon when it exceeds a threshold). Biological neurons have complex connectivity patterns, but artificial neural networks are organized into regular **layers** for computational efficiency.

$$\begin{aligned}f(x)&=W_2\max(0,W_1x)&&(2\text{-layer})\\f(x)&=W_3\max(0,W_2\max(0,W_1x))&&(3\text{-layer})\end{aligned}$$

CIFAR10 example: $x\in\mathbb R^{3072}$ ($32\times32\times3$), a 100-dimensional hidden vector $h$ through $W_1\in\mathbb R^{100\times3072}$, and 10 scores $s$ through $W_2\in\mathbb R^{10\times100}$.

- Number of weights: $3072\times100+100\times10=308{,}200$ ($+100+10$ counting the biases)
- Lots of parameters make it easy to **memorize** small data (rote learning) and overfit.

**A matrix product is “many neurons”.** The $j$-th row $w_j^T$ of $W_1$ is the weight of hidden neuron $j$, and $(W_1x)_j=w_j^Tx$ is that neuron's input sum. One matrix product is 100 neurons computing their weighted sums **at the same time**.

:::key A composition of linear layers is linear
Without activation functions, $f(x)=W_3W_2W_1x=Wx$. Even with biases, $W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)$, which is **a single affine function**. Stacking any number of layers does not increase the expressive power.
:::

This is the answer to the slide's question “What if the activation function is removed?” The nonlinearity is what gives stacking layers its meaning. Moreover, the rank of $W=W_3W_2W_1$ is at most the size of the narrowest layer, so if there is a narrow layer in the middle, a stacked linear network is even **more restricted** than a single layer.

:::ex Example 2 — Finding the composite matrix
With $W_1=\begin{pmatrix}1&2\\0&1\end{pmatrix}$, $b_1=(1,0)^T$, $W_2=(1\ \ {-1})$, $b_2=3$, write the 2-layer network without activation as $Ax+c$.
---
$A=W_2W_1=(1\cdot1+(-1)\cdot0,\ 1\cdot2+(-1)\cdot1)=(1,\ 1)$, $c=W_2b_1+b_2=1+3=4$. That is, $f(x)=x_1+x_2+4$. Even with two layers, it is a single line (plane).
:::
` },
      '8.3': { title: 'Activation Functions and the Softmax Output', body: R`
:::idea In plain words
The activation function sets how much a neuron is “on”. The sigmoid does it smoothly between 0 and 1; ReLU says “off (0) if negative, pass through unchanged if positive”. Nowadays the ReLU family, which is cheap to compute and lets gradients flow well, is used most. The output layer is chosen for the purpose: softmax (probabilities) for classification, no activation for regression.
:::

| Name | Formula |
|---|---|
| Sigmoid | $\sigma(x)=\dfrac1{1+e^{-x}}$ |
| tanh | $\tanh(x)$ |
| ReLU | $\max(0,x)$ |
| Leaky ReLU | $\max(0.1x,\,x)$ |
| Maxout | $\max(w_1^Tx+b_1,\ w_2^Tx+b_2)$ |
| ELU | $x$ ($x\ge0$), $\alpha(e^x-1)$ ($x<0$) |

:::fig actfns
:::

$\tanh(x)=\frac{e^x-e^{-x}}{e^x+e^{-x}}=2\sigma(2x)-1$, so tanh is the sigmoid stretched and shifted to $(-1,1)$. Maxout is a “learned activation” that picks the larger of two linear functions of the input; it contains ReLU (the case $w_2=0$, $b_2=0$) and Leaky ReLU as special cases. The pros and cons of each function (saturation, being zero-centered or not, dead ReLUs) are revisited from the viewpoint of gradients in Unit 10[[ch10:10.4|Activation functions revisited: pros and cons.]].

The computation graph for a 2-layer neural network is $x\to W_1\to\max(0,\cdot)\to h\to W_2\to s$, and for classification we attach a softmax at the end, $f(x)=\softmax(W_2\max(0,W_1x))$, to output probabilities[[ch06:6.1|Softmax converts a vector of real numbers into a probability mass function.]].

:::ex Example 3 — Softmax (slide)
Turn the scores $[-1,\ 3]$ into probabilities.
---
$e^{-1}\approx0.3679$, $e^3\approx20.0855$. Dividing by the sum $20.4534$ gives $[0.01799,\ 0.98201]$.
:::

### Computing a forward pass by hand

The forward pass (numpy example): $h_1=f(W_1x+b_1)$, $h_2=f(W_2h_1+b_2)$, $\text{out}=W_3h_2+b_3$. Deep networks typically have many layers and potentially millions of parameters. The code on the slide is a “3-layer network” with 3 inputs, two hidden layers (4 units each), and 1 output ($W_1:4\times3$, $W_2:4\times4$, $W_3:1\times4$), with sigmoid activations.

:::ex Example 4 — Forward pass of a small network
$x=(1,2)$, $W_1=\begin{pmatrix}1&-1\\2&0\\-1&1\end{pmatrix}$, $b_1=(0,-1,1)$, ReLU, $W_2=(1\ \ {-1}\ \ 0.5)$, $b_2=0.5$, and a sigmoid at the output. What is the output probability?
---
$W_1x+b_1=(1-2+0,\ 2+0-1,\ -1+2+1)=(-1,\ 1,\ 2)$. ReLU: $h=(0,\ 1,\ 2)$ — the first neuron is off.
$z=W_2h+b_2=0-1+1+0.5=0.5$, $\sigma(0.5)\approx0.622$.
:::

**Terminology.** “2-layer neural network” = “1 hidden layer” (the input layer is not counted). With two hidden layers as on the slide, it is called a “3-layer network” or “a network with 2 hidden layers”, and if every neuron of adjacent layers is connected, the layer is **fully connected**.
` },
      '8.4': { title: 'The Perceptron and the Limits of Linear Separation', body: R`
:::idea In plain words
A problem that one line can split is handled by a linear classifier. But data crossed diagonally, like “1 if **exactly one** of the two is true” (XOR), cannot be split by any line. With one hidden layer, the network can first move the data to other coordinates and then split them with a line.
:::

We want to classify two-dimensional points into either the positive or the negative class with the linear model $\hat y=f(x;w,b)=w_1x_1+w_2x_2+b$. The parameters $[w_1,w_2,b]$ characterize the function (the slide's examples $[-1,-5,-1]$, $[3,3,-1]$, $[3,-2,1]$ — planes with different slopes). The decision boundary is the line $w_1x_1+w_2x_2+b=0$; the side with $\hat y>0$ is positive and the side with $\hat y<0$ negative. A new point $[x_1^*,x_2^*]$ is fed into the model and classified by the sign of $w_1x_1^*+w_2x_2^*+b$.

**Issue.** Most real-world data is **not linearly separable**. If no line can separate the regions correctly, nonlinearity is necessary. The perceptron puts a nonlinear activation $g$ on top of the linear expression.
$$\hat y=g\Big(b+\sum_iw_ix_i\Big)=g(w^Tx+b)$$
Still, if $g$ is monotone, the decision boundary of a single-layer perceptron is a line ($w^Tx+b=$ const). As long as the data are linearly separable, the perceptron learning rule stops after finitely many updates[[@ml:ch07:9.1b|The perceptron convergence theorem: number of updates ≤ (RB)².]].

:::key The limit of the perceptron
The XOR data $\{(0,0),(1,1)\}\to0$, $\{(0,1),(1,0)\}\to1$ cannot be separated by any line. The ReLU network with one hidden layer $f(x)=\max(0,x_1+x_2)-2\max(0,x_1+x_2-1)$ computes XOR exactly.
:::

**Proof of linear inseparability.** Suppose $w_1x_1+w_2x_2+b$ is positive at $(0,1),(1,0)$ and negative (or at most 0) at $(0,0),(1,1)$. Adding the first two conditions gives $w_1+w_2+2b>0$, and adding the last two gives $b+(w_1+w_2+b)\le0$, i.e., $w_1+w_2+2b\le0$. A contradiction. (Geometrically, the midpoints of the two diagonals are both $(\tfrac12,\tfrac12)$; the midpoint of one pair must be in the positive region and that of the other pair in the negative region, which is impossible for the same point.)

**The network computes XOR.** With $s=x_1+x_2$, $f=\max(0,s)-2\max(0,s-1)$. $(0,0)$: $s=0$, $f=0$. $(0,1),(1,0)$: $s=1$, $f=1-0=1$. $(1,1)$: $s=2$, $f=2-2=0$. Exactly XOR.

:::fig xorfig
:::

The hidden units $h_1=\max(0,s)$, $h_2=\max(0,s-1)$ move the inputs to new coordinates $(h_1,h_2)$: $(0,0)\mapsto(0,0)$, $(0,1),(1,0)\mapsto(1,0)$, $(1,1)\mapsto(2,1)$. In the new coordinates the two classes are separated by the line $h_1-2h_2=\tfrac12$ — this is exactly the “embedding into a linearly separable space” of Section 8.5.
` },
      '8.5': { title: 'Why Stack Layers: Nonlinear Embeddings', body: R`
:::idea In plain words
A hidden layer creates “a new way of looking at the data”. The network learns those coordinates themselves from data, so that points tangled in the original coordinates split neatly in the coordinates the hidden layer makes. The deeper the layer, the more abstract the view: pixels → lines and edges → parts such as a loop or a vertical stroke → the digit “9”.
:::

**Embedding viewpoint.** Hidden layers are **nonlinear embeddings** of the input. The model can embed the data into **the linearly separable space**. For example, points mixed as two concentric circles are split by a single plane after lifting them as $(x_1,x_2)\mapsto(x_1,x_2,x_1^2+x_2^2)$ (the same idea as the kernel trick, except that the network **learns** this map)[[ch04:4.4|The kernel trick fixes the feature map in advance; a neural network learns it.]].

:::fig lift
:::

As on slides 32–33, in the 3D space made by the hidden layer, the red points (inside the circle) rise to the top of a cone and are separated from the blue points by a single green plane. The final output layer is just a **linear classifier** (logistic or softmax) in that space.

**Handwritten digits.** A $28\times28$ gray-scale image is represented as a $784$-dimensional vector (each pixel has value between 0 and 1), and forward propagation through the hidden layers produces 10 outputs (0–9). A 2D visualization of the learned embedding of MNIST digits shows the digits clustering.

**Recognition viewpoint.** How does the human distinguish between different digits? By combinations of abstracted features (9 = upper loop + right vertical stroke, 8 = loop + loop, 4 = vertical stroke + short vertical stroke + horizontal stroke). A neural network also learns **multiple levels of abstraction**: edges → parts (the eyes and nose of a face) → whole. One neuron of the last hidden layer responds to an “upper loop”, another to a “vertical stroke”, and the output neuron “9” turns on when both are on.

:::tip Summary (slide 47)
- Perceptron: a simple non-linear function
- Neural network: a stack of perceptrons
- A deep neural network learns a hierarchy of features capturing different levels of abstraction, and learns to compose these concepts hierarchically to achieve the task.
:::

**Shallow learning with PyTorch (slide 48).** 1) Load data 2) Define model 3) Instantiate the model, choose the loss function and the optimizer 4) Train with SGD: clear previously computed gradients → compute the forward pass → compute the gradient via backprop → SGD update 5) Evaluate the trained model 6) Visualize results. The four lines of 4) are the content of Units 9–10 (backpropagation, SGD).

### Going deeper: the universal approximation theorem and the benefit of depth

With **one** hidden layer and enough neurons (if the activation is not a polynomial), any continuous function on a compact set can be approximated to any accuracy (the universal approximation theorem). One-dimensional ReLU makes this easy to see: a linear combination of the $\max(0,x-t)$ is a **piecewise linear function** bending at the points $t$, and with densely placed bends it can follow any continuous curve. Then why stack deep? Because there are cases where **depth needs exponentially fewer neurons** to represent the same function. Example: composing the sawtooth function $g(x)=2\max(0,x)-4\max(0,x-\tfrac12)$ with itself $k$ times gives a sawtooth with $2^{k-1}$ teeth, built from 2 neurons per layer $\times$ $k$ layers, whereas a single hidden layer needs about $2^k$ neurons.
` },
      '8.6': { title: 'The Multilayer Perceptron (MLP)', body: R`
:::idea In plain words
An MLP is a machine that repeats “matrix product → add bias → activation” several times. The matrix of layer $\ell$ has size (number of neurons in this layer) × (number in the previous layer), and the number of parameters is the total number of entries of these matrices and bias vectors.
:::

:::key The multilayer perceptron
A fully connected network (MLP) starts from $x=y_0\in\mathbb R^{n_0}$ and computes
$$y_\ell=\sigma(W_\ell y_{\ell-1}+b_\ell)\ \ (\ell=1,\dots,L-1),\qquad y_L=W_Ly_{L-1}+b_L$$
with $W_\ell\in\mathbb R^{n_\ell\times n_{\ell-1}}$, $b_\ell\in\mathbb R^{n_\ell}$, and $\sigma$ a componentwise activation. The number of parameters is $\sum_{\ell=1}^L(n_{\ell-1}+1)n_\ell$.
:::

The slide writes the formulas from the top as $y_L=W_Ly_{L-1}+b_L$, $y_{L-1}=\sigma(W_{L-1}y_{L-2}+b_{L-1})$, …, $y_1=\sigma(W_1x+b_1)$, with $n_L=1$ (a scalar output). The last layer has no activation (regression). For classification, a softmax is attached after it.

**Why the parameter-count formula holds.** Layer $\ell$ has $n_\ell$ neurons, and each neuron has one weight for each of the $n_{\ell-1}$ units of the previous layer plus one bias: $n_\ell(n_{\ell-1}+1)$.

:::ex Example 5 — An MLP for CIFAR10 (slide)
$x\in\mathbb R^{3072}\to h_1\in\mathbb R^{1536}\to h_2\in\mathbb R^{768}\to h_3\in\mathbb R^{384}\to O\in\mathbb R$, $\sigma=$ReLU, $h_1=\sigma(A_1x+b_1)$, and so on. How many parameters?
---
$A_1:1536\times3072$, $A_2:768\times1536$, $A_3:384\times768$, $A_4:1\times384$.
$$(3072+1)1536+(1536+1)768+(768+1)384+(384+1)\cdot1$$
$$=4{,}720{,}128+1{,}180{,}416+295{,}296+385=6{,}196{,}225.$$
The first layer accounts for 76% of the total. When the input is large, as with images, fully connected layers are inefficient, so convolutional layers (CNNs) are used.
:::

**A tip for checking matrix sizes.** In $y_\ell=W_\ell y_{\ell-1}$, $y_{\ell-1}$ is $n_{\ell-1}\times1$ and the result must be $n_\ell\times1$, so $W_\ell$ is $n_\ell\times n_{\ell-1}$ — “(number of outputs) × (number of inputs)”. To compute many samples at once, multiply $W_\ell$ by $Y_{\ell-1}\in\mathbb R^{n_{\ell-1}\times B}$ with the samples stacked as columns, and add the bias to every column (broadcasting).

### Going deeper: why convolution

A fully connected layer connects every pixel of the input to every neuron, so it cannot use the structure of images: “nearby pixels are strongly related” (locality) and “a cat is a cat wherever it is” (translation invariance). A convolutional layer slides a small filter over the whole image **with the same weights** (weight sharing), greatly reducing the parameters and building this structure into the model. It is the starting point of the CNNs to be covered after Week 5[[@med:ch12:9.4|Parameter sharing.]].
` },
    },
    probs: [
      // u08
      { q: R`For $f(x)=W_2\max(0,W_1x)$ with $x\in\mathbb R^{3072}$, 100 hidden units, and 10 outputs, how many **weights** are there (excluding biases)?`,
        sol: R`$3072\times100+100\times10=307{,}200+1{,}000=308{,}200$.` },
      { q: R`If biases $b_1\in\mathbb R^{100}$, $b_2\in\mathbb R^{10}$ are added to the same network, what is the total number of parameters?`,
        sol: R`$308{,}200+110$.` },
      { q: R`Which is correct about $f(x)=W_3W_2W_1x$ (no activation)?`,
        choices: [R`Having 3 layers, it is more expressive than 2 layers`, R`It equals a single linear function with $W=W_3W_2W_1$`, R`It can make a nonlinear decision boundary`, R`It cannot be trained`],
        sol: R`A product of matrices is a matrix, so it is a single linear function. There must be nonlinear activations between the layers.` },
      { q: R`Writing $y=W_2(W_1x+b_1)+b_2$ as an affine function $Ax+c$, what is $c$?`,
        choices: [R`$b_1+b_2$`, R`$W_2b_1+b_2$`, R`$W_1b_2+b_1$`, R`$W_2W_1b_1$`],
        sol: R`Expanding gives $W_2W_1x+W_2b_1+b_2$. $A=W_2W_1$, $c=W_2b_1+b_2$.` },
      { q: R`What is the value of Leaky ReLU $\max(0.1x,x)$ at $x=-3$?`,
        sol: R`$\max(-0.3,-3)=-0.3$.` },
      { q: R`What is the value of ELU ($\alpha=1$) at $x=-\ln2$?`,
        sol: R`Since $x<0$, $e^{-\ln2}-1=\tfrac12-1=-\tfrac12$.` },
      { q: R`What is the first component of the softmax of the scores $[-1,3]$? (4 decimal places)`,
        sol: R`$\frac{e^{-1}}{e^{-1}+e^3}=\frac1{1+e^4}\approx0.01799$.` },
      { q: R`Which is a correct reason XOR cannot be solved by a linear classifier?`,
        choices: [R`There is too little data`, R`No line can put $(0,1),(1,0)$ and $(0,0),(1,1)$ on opposite sides`, R`The activation function is the sigmoid`, R`The learning rate is large`],
        sol: R`One side of a line is a convex set, so if $(0,1),(1,0)$ are on the same side, so is their midpoint $(\tfrac12,\tfrac12)$. But the midpoint of $(0,0),(1,1)$ is also $(\tfrac12,\tfrac12)$, which must be on the opposite side — a contradiction.` },
      { q: R`For $f(x)=\max(0,x_1+x_2)-2\max(0,x_1+x_2-1)$, what is $f(1,1)$?`,
        sol: R`$\max(0,2)-2\max(0,1)=2-2=0$. With $f(1,0)=f(0,1)=1-0=1$ and $f(0,0)=0$, it equals XOR.` },
      { q: R`For the linear classifier with parameters $[w_1,w_2,b]=[3,3,-1]$, what is the sign at the point $(0.2,0.2)$?`,
        choices: [R`Positive ($f>0$)`, R`Negative ($f<0$)`, R`On the boundary ($f=0$)`, R`Cannot be determined`],
        sol: R`$3(0.2)+3(0.2)-1=0.2>0$.` },
      { q: R`How many dimensions does a $28\times28$ gray-scale image have when flattened into a vector?`,
        sol: R`$28\times28=784$.` },
      { q: R`How many parameters does the MLP $3072\to1536\to768\to384\to1$ (biases in every layer) have?`,
        sol: R`$(3072+1)1536+(1536+1)768+(768+1)384+(384+1)=4{,}720{,}128+1{,}180{,}416+295{,}296+385$.` },
      { q: R`What is the size of $W_\ell$ in an MLP?`,
        choices: [R`$n_{\ell-1}\times n_\ell$`, R`$n_\ell\times n_{\ell-1}$`, R`$n_\ell\times n_\ell$`, R`$n_0\times n_L$`],
        sol: R`In $y_\ell=\sigma(W_\ell y_{\ell-1}+b_\ell)$ it sends $y_{\ell-1}\in\mathbb R^{n_{\ell-1}}$ to $\mathbb R^{n_\ell}$, so it is $n_\ell\times n_{\ell-1}$.` },
      { q: R`Prove by mathematical induction that the $L$-layer network without activation functions $y_\ell=W_\ell y_{\ell-1}+b_\ell$ ($\ell=1,\dots,L$) equals a single-layer affine function $y_L=Ax+c$, and find $A$ and $c$.`,
        sol: R`
**Claim.** $y_\ell=A_\ell x+c_\ell$ with $A_\ell=W_\ell W_{\ell-1}\cdots W_1$ and $c_\ell=\sum_{k=1}^{\ell}W_\ell\cdots W_{k+1}b_k$ (an empty product is $I$).
**Base case.** $\ell=1$: $y_1=W_1x+b_1$.
**Induction step.** If $y_{\ell-1}=A_{\ell-1}x+c_{\ell-1}$, then $y_\ell=W_\ell(A_{\ell-1}x+c_{\ell-1})+b_\ell=(W_\ell A_{\ell-1})x+(W_\ell c_{\ell-1}+b_\ell)$. $A_\ell=W_\ell A_{\ell-1}$ and $c_\ell=W_\ell c_{\ell-1}+b_\ell$ agree with the formulas above.
Hence $y_L=Ax+c$ with $A=W_L\cdots W_1$. The decision boundary is only a hyperplane, so problems like XOR cannot be solved, and nonlinear activations between the layers are needed.`,
        rubric: R`
- The exact form of the induction hypothesis — 3 pts
- The computation in the induction step — 4 pts
- Conclusion and meaning — 3 pts` },
      { q: R`Prove that the XOR data are not linearly separable, and give a network with 2 ReLU hidden units that computes XOR exactly.`,
        sol: R`
**Impossibility.** Suppose $w_1x_1+w_2x_2+b$ is positive at $(0,1),(1,0)$ and negative at $(0,0),(1,1)$. Adding the first two gives $w_1+w_2+2b>0$, and adding the last two gives $b+(w_1+w_2+b)=w_1+w_2+2b<0$. A contradiction.
**Construction.** $h_1=\max(0,x_1+x_2)$, $h_2=\max(0,x_1+x_2-1)$, $f=h_1-2h_2$.
$(0,0)$: $0-0=0$. $(1,0),(0,1)$: $1-0=1$. $(1,1)$: $2-2\cdot1=0$. It agrees with XOR. When the hidden layer moves $(x_1,x_2)$ into the $(h_1,h_2)$ space, the four points become $(0,0),(1,0),(1,0),(2,1)$ and are separated by the line $h_1-2h_2=\tfrac12$.`,
        rubric: R`
- Deriving the contradiction from the sign conditions — 5 pts
- A correct network and checking the four points — 5 pts` },
      // more-08
      { q: R`How many parameters does the MNIST MLP $784\to256\to128\to10$ (biases in every layer) have?`,
        sol: R`$(784+1)256+(256+1)128+(128+1)10=200{,}960+32{,}896+1{,}290=235{,}146$.` },
      { q: R`With $x=(1,-1)$, $W_1=\begin{pmatrix}2&1\\-1&3\end{pmatrix}$, $b_1=(1,2)$, ReLU, $W_2=(1\ \ 2)$, $b_2=-0.5$, what is the output $W_2h+b_2$?`,
        sol: R`$W_1x+b_1=(2-1+1,\ -1-3+2)=(2,-2)$, and ReLU gives $h=(2,0)$. $W_2h+b_2=2+0-0.5=1.5$.` },
      { q: R`Show $\tanh(x)=2\sigma(2x)-1$, and use it to derive $\tanh'(x)=1-\tanh^2(x)$.`,
        sol: R`
$2\sigma(2x)-1=\frac{2}{1+e^{-2x}}-1=\frac{1-e^{-2x}}{1+e^{-2x}}$. Multiplying the numerator and denominator by $e^x$ gives $\frac{e^x-e^{-x}}{e^x+e^{-x}}=\tanh x$.
Differentiating: $\tanh'(x)=4\sigma'(2x)=4\sigma(2x)(1-\sigma(2x))$. Since $\sigma(2x)=\frac{1+t}2$ ($t=\tanh x$), this is $4\cdot\frac{1+t}2\cdot\frac{1-t}2=1-t^2$.`,
        rubric: R`
- The identity — 5 pts
- The chain rule and $\sigma'$ — 3 pts
- Simplifying to $1-\tanh^2$ — 2 pts` },
      { q: R`Show that the Maxout unit $\max(w_1^Tx+b_1,\ w_2^Tx+b_2)$ contains ReLU $\max(0,w^Tx+b)$ and Leaky ReLU $\max(0.1(w^Tx+b),\ w^Tx+b)$ as special cases.`,
        sol: R`
ReLU: setting $w_1=w$, $b_1=b$, $w_2=0$, $b_2=0$ gives $\max(w^Tx+b,0)$.
Leaky ReLU: setting $w_1=w$, $b_1=b$, $w_2=0.1w$, $b_2=0.1b$ gives $\max(w^Tx+b,\ 0.1(w^Tx+b))$.
Maxout is the maximum of two (or more) linear functions, so it makes a convex piecewise linear function, and it can be learned so that the slope is not 0 on either side.`,
        rubric: R`
- The substitution for ReLU — 5 pts
- The substitution for Leaky ReLU — 5 pts` },
      { q: R`Using only ReLU, write networks with one hidden layer that compute exactly (i) $\lvert x\rvert$ ($x\in\mathbb R$) and (ii) $\max(x_1,x_2)$, and check them.`,
        sol: R`
**(i)** $\lvert x\rvert=\max(0,x)+\max(0,-x)$: two hidden units (weights $1$, $-1$) and output weights $(1,1)$. If $x\ge0$ it is $x+0$; if $x<0$ it is $0+(-x)$.
**(ii)** $\max(x_1,x_2)=x_2+\max(0,x_1-x_2)$. Since the output layer is linear, write $x_2=\max(0,x_2)-\max(0,-x_2)$ and use 3 hidden units: $h=(\max(0,x_1-x_2),\max(0,x_2),\max(0,-x_2))$, output $h_1+h_2-h_3$. If $x_1\ge x_2$ it is $x_1-x_2+x_2=x_1$; otherwise $0+x_2=x_2$.`,
        rubric: R`
- (i) The network and the check — 4 pts
- (ii) The identity $\max(a,b)=b+\max(0,a-b)$ — 3 pts
- (ii) Expressing the linear term with ReLU only — 3 pts` },
      { q: R`Which Boolean function **cannot** be computed by the single-layer perceptron $\operatorname{step}(w_1x_1+w_2x_2+b)$? (inputs $x_i\in\{0,1\}$)`,
        choices: [R`AND`, R`OR`, R`NAND`, R`XOR`],
        sol: R`AND works with $w=(1,1)$, $b=-1.5$; OR with $b=-0.5$; NAND with $w=(-1,-1)$, $b=1.5$. XOR is not linearly separable.` },
      { q: R`What is the linear output $w^Tx+b$ of the perceptron $w=(1,1)$, $b=-1.5$ on the input $(1,1)$?`,
        sol: R`$1+1-1.5=0.5>0$, so 1. The other inputs $(0,0),(0,1),(1,0)$ give $-1.5,-0.5,-0.5<0$ — it computes AND.` },
      { q: R`For the network without activation $f(x)=W_3W_2W_1x$ with $W_1\in\mathbb R^{2\times100}$, $W_2\in\mathbb R^{100\times2}$, $W_3\in\mathbb R^{100\times100}$, show that writing $f$ as a single matrix $W$ gives $\operatorname{rank}W\le2$, and write what this means.`,
        sol: R`
$W=W_3W_2W_1\in\mathbb R^{100\times100}$. The rank of a product is at most the rank of each factor, so $\operatorname{rank}W\le\operatorname{rank}W_1\le2$ ($W_1$ has 2 rows).
(Reason: in $Wx=W_3W_2(W_1x)$, $W_1x$ lies in a 2-dimensional subspace, so the column space (range) of $W$ is the linear image of a 2-dimensional subspace, of dimension $\le2$.)
Meaning: the 100-dimensional input is squeezed to 2 dimensions and spread out again, so the output lies only in a plane (2-dimensional) of the 100-dimensional space. Stacking layers without activations, far from increasing the expressive power, is limited by the narrow layer (bottleneck).`,
        rubric: R`
- The rank inequality for products — 5 pts
- Explanation by the dimension of the range — 3 pts
- Meaning — 2 pts` },
      { q: R`Show that $g(x)=2\max(0,x)-4\max(0,x-\tfrac12)$ ($x\in[0,1]$) is the “tent function” ($2x$ if $x\le\tfrac12$, $2-2x$ otherwise), and show that $g\circ g$ is a sawtooth with two peaks on $[0,1]$.`,
        sol: R`
$x\le\tfrac12$: the second term is 0, so $g=2x$. $x>\tfrac12$: $2x-4(x-\tfrac12)=2-2x$. Hence $g([0,1])=[0,1]$ and $g(\tfrac12)=1$.
$g\circ g$: for $x\in[0,\tfrac14]$, $g(x)=2x\le\tfrac12$, so $g(g(x))=4x$; for $x\in[\tfrac14,\tfrac12]$, $g(x)\in[\tfrac12,1]$, so $2-4x$; for $x\in[\tfrac12,\tfrac34]$, $g(x)=2-2x\in[\tfrac12,1]$, so $2-2(2-2x)=4x-2$; for $x\in[\tfrac34,1]$, $g(x)\le\tfrac12$, so $4-4x$. Peaks at $x=\tfrac14,\tfrac34$ (value 1), valleys at $x=0,\tfrac12,1$ (value 0) — two teeth. Composing $k$ times gives $2^{k-1}$ teeth, so a deep network with 2 ReLUs per layer makes exponentially many bends.`,
        rubric: R`
- Checking the tent function — 3 pts
- $g\circ g$ split into four intervals — 5 pts
- The meaning of depth — 2 pts` },
      { q: R`What is the dimension of the vector obtained by flattening a $64\times64$ color (RGB) image?`,
        sol: R`$64\times64\times3=12{,}288$.` },
      // quizprep-b
      { q: R`XOR: $(0,0)\mapsto0$, $(0,1)\mapsto1$, $(1,0)\mapsto1$, $(1,1)\mapsto0$.
1. Prove that no $w\in\mathbb R^2$, $b\in\mathbb R$ can make “$w^Tx+b\gt0\iff$ the output is 1” hold at all four points.
2. Check that the ReLU hidden units $h_1=\max(0,x_1+x_2)$, $h_2=\max(0,x_1+x_2-1)$ and the output $o=h_1-2h_2$ give exactly the XOR values at the four points.
3. Show that the two classes are linearly separable in the space of the points $(h_1,h_2)$ made by the hidden layer, by giving a separating line. Explain the connection with “why we stack layers”.`,
        sol: R`
**1.** Suppose such $w,b$ exist. At the two points with output 1, $w_2+b\gt0$ and $w_1+b\gt0$; adding gives $w_1+w_2+2b\gt0$. At the two points with output 0, $b\le0$ and $w_1+w_2+b\le0$; adding gives $w_1+w_2+2b\le0$. A contradiction. $\blacksquare$
**2.** $(0,0)$: $h=(0,0)$, $o=0$. $(0,1)$ and $(1,0)$: $h_1=1$, $h_2=\max(0,0)=0$, $o=1$. $(1,1)$: $h_1=2$, $h_2=1$, $o=2-2=0$.
**3.** The images of the four points: $(0,0)\mapsto(0,0)$, $(0,1),(1,0)\mapsto(1,0)$, $(1,1)\mapsto(2,1)$. For the line $h_1-2h_2-\frac12=0$, $(1,0)$ gives $\frac12\gt0$, while $(0,0)$ and $(2,1)$ give $-\frac12\lt0$ — they are separated. Data that cannot be linearly separated in the original space become separable in the new coordinates (embedding) made by a nonlinear hidden layer, and the linear classifier of the last layer does that job.`,
        rubric: R`
- The proof by contradiction (four inequalities and adding) — 4 pts
- Checking the four points — 3 pts
- The separating line in the embedding space and its interpretation — 3 pts` },
    ],
  };
})();
