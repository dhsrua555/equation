/* English text — 15 Convolutional Neural Networks (W5 Mon (3) slides 1–71). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '경계 칸은 계산하지 않음': 'border cells are not computed',
    '3×3 이동 평균': '3×3 moving average',
    '입력 5×5': 'input 5×5',
    '필터 3×3': 'filter 3×3',
    '특성 맵 3×3': 'feature map 3×3',
    '필터 하나의 합성곱': 'Convolution with one filter',
    '완전연결층: 가중치 7×5 = 35개': 'fully connected: 7×5 = 35 weights',
    '합성곱층: 가중치 3개를 공유': 'convolution: 3 shared weights',
    'l번째 층 → (l+1)번째 층': 'layer l → layer l+1',
    '선의 종류 = 같은 가중치 w₁, w₂, w₃': 'line style = same weight w₁, w₂, w₃',
    '완전연결층과 합성곱층의 연결': 'Connections of a fully connected layer and a convolution layer',
  });
  Object.assign(EM.en.fig, {
    movavg: R`Left $F$: a square of value 90 (one hole of value 0 in the middle) and an isolated dot. Right $G$: each cell holds the average of its $3\times3$ neighborhood (slide 13). The marked window contains only one 90, so $G=90/9=10$. The edge of the square spreads as $0\to30\to60\to90$, the hole is filled to 80, and the isolated dot becomes a smudge of 10. Filled cells are those with value 50 or more.`,
    convex: R`Multiplying the filled $3\times3$ patch by the filter element by element and adding gives 51, the top-left of the feature map. Repeating the same computation while sliding the window one cell at a time gives the $3\times3$ feature map (slides 43–45). The nine numbers of the filter are the weights to be learned.`,
    fcconv: R`(Left) In a fully connected layer every node of the upper layer is connected to every node of the lower layer, and every line has its own weight. (Right) In a 1D convolution layer (filter size 3) each node is connected only to its three neighbors (local connectivity), and lines of the same style carry the same weight at every position (weight sharing). The figure of slides 63–65 drawn in 1D.`,
  });
  EM.en.ch[15] = {
    title: 'Convolutional Neural Networks: The Basics',
    fig: R`Sliding a moving-average filter of length 5 over a noisy step signal (thin line) gives a smooth curve (bold line). Using the same weights at every position is convolution`,
    tagline: R`Flattening an image into a fully connected layer makes the parameters explode and destroys the spatial structure. A convolution layer slides one small filter over every position (local connectivity + weight sharing), cutting the parameters and gaining translation equivariance: when the object moves, the output moves with it.`,
    summary: R`The networks so far were **fully connected layers** taking vectors as input. For images this is bad for two reasons: there are too many parameters, and the structure does not encode **translation equivariance/invariance** — that a cat is a cat whether it is on the left or on the right. This unit computes the parts of the remedy, the **convolutional neural network (CNN)**, one at a time. Starting from a moving average, it defines convolution with a filter, then covers the activation maps and parameter count of a convolution layer, the output size $N'=(N-K+2P)/S+1$ set by stride and padding, the pooling layer, and finally the comparison with fully connected layers and the definition of translation equivariance.`,
    goals: [
      R`Explain the advantages and disadvantages of fully connected layers (parameter count, no spatial structure or translation equivariance) and count their parameters`,
      R`Write a 2D moving average and filtering as formulas, and compute a feature map by applying a filter to a small image by hand`,
      R`Know why the filters of a convolution layer extend through the full depth of the input, and count the activation map size and the layer's parameters $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$`,
      R`Derive the output size formula with stride and padding $N'=(N-K+2P)/S+1$, and choose the size-preserving padding $P=(K-1)/2$`,
      R`Compute max and average pooling and global average pooling, and explain that pooling has no parameters to learn`,
      R`Compare convolution layers with fully connected layers through local connectivity and weight sharing, distinguish translation equivariance $f(g\cdot x)=g\cdot f(x)$ from invariance $f(g\cdot x)=f(x)$, and prove that convolution is equivariant`,
    ],
    secTitles: { '15.1': 'Limits of FC layers', '15.2': '2D convolution', '15.3': 'Convolution layer', '15.4': 'Output size', '15.5': 'Pooling', '15.6': 'Equivariance' },
    secs: {
      '15.1': { title: 'Fully Connected Layers: Advantages and Limits', body: R`
:::idea In plain words
If we lay out one photo as 3072 numbers in a row (32×32 pixels × 3 RGB channels) and connect every number to every neuron, a single neuron looks at the whole photo at once. But the meaning of a photo lies in the shapes that **nearby pixels** make together (edges, eyes, wheels), and a shape means the same thing **wherever** it appears in the photo. A fully connected layer knows neither fact and wastes parameters learning every position separately.
:::

The networks so far (Units 8–9) stacked **fully connected layers** $h=\sigma(Wx+b)$, which connect every component of the input vector to every neuron of the next layer[[ch08:8.5|Why stack layers: nonlinear embeddings.]].

**Advantages** (slide 2).
- **Simple.** Just matrix multiplications and activation functions.
- **Very general, in theory.** A sufficiently large multilayer perceptron can in principle learn any function (universal approximation).

**Disadvantages.**
- **Too many trainable parameters.** A layer sending a $d_{\text{in}}$-dimensional input to $d_{\text{out}}$ dimensions has $d_{\text{in}}d_{\text{out}}$ weights and $d_{\text{out}}$ biases.
- **It does not encode shift equivariance/invariance and therefore has a poor inductive bias.** When the same object moves, completely different input components light up, so the shapes at every position must be learned separately.

:::key Parameters of a fully connected layer
$$h=\sigma(Wx+b)$$
$$W\in\mathbb R^{d_{\text{out}}\times d_{\text{in}}},\quad b\in\mathbb R^{d_{\text{out}}}\qquad\Longrightarrow\qquad\#\text{params}=d_{\text{in}}d_{\text{out}}+d_{\text{out}}$$
Flattening a $32\times32\times3$ image gives $d_{\text{in}}=3072$, so one layer with 10 outputs needs $3072\cdot10+10=30{,}730$.
:::

**How images are different** (slides 3–4). Images are very high dimensional (millions of pixels), and the same object varies in shape and position. If we view an image as a matrix of numbers, flatten it into a row, and feed it to a fully connected layer, the spatial information of **which pixel neighbors which** is lost. Flattening in a shuffled order would be exactly the same problem for a fully connected layer. The question of the slides is: **how can we use the spatial structure of the image to learn a neural network?**

:::ex Example 1 — Parameters versus photo size
If we flatten a $224\times224\times3$ color photo and feed it to a fully connected layer with 1000 hidden neurons, how many parameters are there?
---
$d_{\text{in}}=224\cdot224\cdot3=150{,}528$, so $150{,}528\cdot1000+1000=150{,}529{,}000$, about 150 million. This one first layer is more than twice as large as the whole AlexNet of Unit 16 (about 60 million).
:::

**Translation equivariance/invariance** (slide 5). For many tasks in vision, moving (translating) an object either leaves the answer the same (**invariant**, e.g. “is it a cat?”) or moves the answer by the same amount (**equivariant**, e.g. “where is the cat?”). Roughly speaking, moving the object **does not change its meaning, only its position**. The precise definition is in Section 15.6.

**Locally connected layer** (slide 6). Pixel values depend on their neighbors, and that is the spatial structure. So each neuron of a hidden layer is connected not to the whole input but only to a **small input patch**. Adding “use the same weights for every patch” gives the convolution of the next section.

### Going deeper

An **inductive bias** is an assumption built into the model's structure before learning. A fully connected layer assumes “any components may be related”, the weakest assumption, so the data must teach everything else. A convolution layer builds in strong assumptions: “relations are between nearby things (locality), and the same shape is treated the same way everywhere (weight sharing)”. Because these assumptions hold for images, it generalizes better with less data and fewer parameters.
` },
      '15.2': { title: '2D Convolution: From Moving Averages to Filtering', body: R`
:::idea In plain words
Put a small window (say 3×3) on the image, average the values inside, write the result in one cell, and repeat while moving the window one cell at a time. That is a **moving average**; multiplying each cell by its own weight instead of averaging and then adding is **filtering** (convolution). The shape of the weights decides what to look for (a blur, an edge, a stroke).
:::

**2D moving average** (slides 8–13). At each position of an image $F[x,y]$, write the average of its $3\times3$ neighborhood in the output $G[x,y]$.
$$G[x,y]=\frac19\sum_{i=-1}^{1}\sum_{j=-1}^{1}F[x+i,\ y+j]$$
The $10\times10$ image of the slides has a white square of value 90 (one center pixel is a hole of 0) and an isolated white dot on a black (0) background. Moving the window from the top left to the right gives the first row $0,10,20,30,30,30,20,10$. For example the second value is $90/9=10$ because the window contains only one 90.

:::fig movavg
:::

In the result $G$, the sharp edge of the square **spreads** as $0\to30\to60\to90$, the hole (0) is filled by its surroundings to $80$, and the isolated dot is blurred into a smudge of $10$. A moving average is a **blur** filter that reduces noise. At the border the window would leave the image, so the computation is done only on the inner $8\times8$.

**The question of the slides: what if the filter were $5\times5$?** It averages 25 values at a time, so it blurs more, the edges spread wider, and the output shrinks to the inner $6\times6$ ($10-5+1=6$ by the formula of Section 15.4).

**General filter.** Replacing the averaging weight $\frac19$ by a different number $w[i,j]$ in each cell gives
$$G[x,y]=\sum_{i}\sum_{j}w[i,j]\,F[x+i,\ y+j]$$
which is called **filtering** (slides 66–68). Put the filter $w$ at every position, multiply element by element and add (a weighted average), and store the value at that position. In deep learning this operation is called **convolution**.

:::key 2D convolution (the deep learning convention)
$$G[x,y]=\sum_{i=0}^{K-1}\sum_{j=0}^{K-1}w[i,j]\,F[x+i,\ y+j]\ \ (+\,b)$$
The same filter $w$ is used at every position $(x,y)$. The $3\times3$ moving average is the case $w[i,j]=\frac19$.
:::

:::warn Convolution in mathematics and the sign
In mathematics and signal processing, convolution flips the filter: $\sum w[i,j]F[x-i,y-j]$. The “convolution” of deep learning libraries and of the slides is the unflipped **cross-correlation**. Since the filter is learned, flipping or not only means the learned filter comes out flipped; it makes no difference to expressive power. All computations in this unit, as in the slides, do not flip.
:::

**A filter is a shape detector.** Slides 66–68 apply a $4\times4$ filter shaped like a vertical bar (the middle two columns are 1, the outer columns 0) to a handwritten digit 9. The output is large (High) where the vertical stroke overlaps the filter shape and small (low) elsewhere. If the digit moves to the right, the same filter gives the same large value on the moved stroke. In the words of the slides, **filtering works the same way under translation**, and one filter can handle an object at any position (Section 15.6 shows that, precisely, it is “equivariant”).

### Going deeper

A moving average is a **low-pass** filter that passes only low frequencies, and a difference filter such as $w=\begin{pmatrix}-1&0&1\end{pmatrix}$ is a **high-pass** filter that gives large values only where the values change (edges). Classical image processing designed such filters by hand, but a CNN learns the filter entries $w[i,j]$ themselves by gradient descent. Visualizing first-layer filters indeed shows edge and color-contrast detectors[[@med:ch13:10.2b|The convolution operation and translation equivariance (Medical AI).]].
` },
      '15.3': { title: 'The Convolution Layer: Filters, Activation Maps, Parameters', body: R`
:::idea In plain words
A color image is a box with **depth** (3 RGB sheets) in addition to width and height. A filter is a small box of the same depth (e.g. 5×5×3); sliding it only along width and height and writing the sum of 75 products plus one bias gives one flat **activation map**. Using 6 filters gives 6 maps, that is, a new “image” of depth 6.
:::

**Layer types in CNNs** (slide 14): **convolution layer**, **pooling layer**, **fully connected layer**.

**Convolution layer** (slides 15–20). Keep the $32\times32\times3$ image as a box without flattening, preserving its spatial structure. **Convolve** a $5\times5\times3$ filter with the image, that is, slide it over the image spatially and compute dot products.
- Filters always extend through the **full depth** of the input volume. If the input has 3 channels, so does the filter.
- The output at one position is one number: the dot product of the filter with a $5\times5\times3$ chunk of the image, a 75-dimensional dot product + bias $w^Tx+b$.
- Computing it for every position gives a $28\times28\times1$ **activation map** (feature map), because $32-5+1=28$ (Section 15.4).

:::key Size and parameters of a convolution layer
With input $N\times N\times C_{\text{in}}$ and $C_{\text{out}}$ filters of size $K\times K\times C_{\text{in}}$, the output depth is $C_{\text{out}}$ (one activation map per filter) and
$$\#\text{params}=C_{\text{out}}\big(K\cdot K\cdot C_{\text{in}}+1\big)=K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$$
The parameter count is **independent** of the input width and height $N$.
:::

**Counting parameters** (slides 17, 36). One filter has $5\times5\times3+1=76$ weights (including the bias). Compare this with the $3072\times d_{\text{out}}$ a fully connected layer would need. A second filter gives a second activation map, and 6 filters give a “new image” of $28\times28\times6$. The parameters then number $6\times(75+1)=456$.

**Stacking layers** (slides 37–38). A ConvNet is a sequence of convolution layers interspersed with activation functions. $32\times32\times3$ → (CONV, ReLU: 6 filters of $5\times5\times3$) → $28\times28\times6$ → (CONV, ReLU: 10 filters of $5\times5\times6$) → $24\times24\times10$ → ⋯. The filters of the second layer must have depth 6 (the input depth).

:::fig convex
:::

:::ex Example 1 — The computation on the slides (one filter, stride 1, no padding)
Find the feature map obtained by applying the filter $\begin{pmatrix}1&2&3\\-4&7&4\\2&-5&1\end{pmatrix}$ to the input $\begin{pmatrix}2&4&9&1&4\\2&1&4&4&6\\1&1&2&9&2\\7&3&5&1&3\\2&3&4&8&5\end{pmatrix}$.
---
Multiplying the top-left $3\times3$ patch by the filter element by element and adding gives
$$2\cdot1+4\cdot2+9\cdot3+2\cdot(-4)+1\cdot7+4\cdot4+1\cdot2+1\cdot(-5)+2\cdot1=51$$
Moving the window one cell at a time and repeating (the bottom right is $2\cdot1+9\cdot2+2\cdot3+5\cdot(-4)+1\cdot7+3\cdot4+4\cdot2+8\cdot(-5)+5\cdot1=-2$) gives
$$\begin{pmatrix}51&66&20\\31&49&101\\15&53&-2\end{pmatrix}$$
A $5\times5$ input gives a $3\times3$ output. The nine numbers of this filter are the weights learned by gradient descent (slide 43).
:::

:::ex Example 2 — Two filters (slides 47–50)
What do we get by applying the filters $W_1=\begin{pmatrix}1&1&0\\0&1&-1\\0&0&0\end{pmatrix}$ and $W_2=\begin{pmatrix}-1&1&0\\0&-1&0\\-1&1&0\end{pmatrix}$ with stride 1 to the input $X=\begin{pmatrix}1&0&3&1\\0&-1&2&0\\2&0&4&2\\0&3&0&1\end{pmatrix}$?
---
Since $4-3+1=2$, each filter makes one $2\times2$ feature map, so the output is $2\times2\times2$.
$$W_1:\ \begin{pmatrix}-2&5\\-5&3\end{pmatrix},\qquad W_2:\ \begin{pmatrix}-2&5\\2&-4\end{pmatrix}$$
For example, the bottom right of $W_2$ is the dot product with the patch $\begin{pmatrix}-1&2&0\\0&4&2\\3&0&1\end{pmatrix}$: $(-1)(-1)+1\cdot2+(-1)\cdot4+(-1)\cdot3+1\cdot0=-4$.
:::

:::warn One cell of slides 47–50
The slides write the bottom right of the second feature map as $-5$, but by the computation above $-4$ is correct (the other seven cells agree with the slides). Collecting only the nonzero products of the patch gives $1+2-4-3=-4$.
:::

### Going deeper

A convolution layer is in the end a **linear layer** too. Flattening input and output into vectors gives $y=W_{\text{conv}}x+b$, where $W_{\text{conv}}$ is a very special large matrix: (1) most of its entries are 0 (local connectivity) and (2) the nonzero entries repeat the same filter values (weight sharing). So backpropagation follows the same rules as in Unit 9[[ch09:9.6|Backpropagation in a multilayer perceptron.]], and the gradient of a filter entry $w[i,j]$ is the **sum of the gradients at every position** where the filter was used (the gradient of a shared variable is summed).
` },
      '15.4': { title: 'Output Size: Stride and Padding', body: R`
:::idea In plain words
A ruler of length $K$ can be placed on a row of length $N$ in $N-K+1$ ways. Skipping $S$ cells between placements divides the number of places by roughly $S$, and padding $P$ zeros at each end makes the row $2P$ longer. Putting the three together gives the output size formula.
:::

**Stride 1** (slides 21–25). Moving a $3\times3$ filter one cell at a time (stride 1) over a $7\times7$ input gives $7-3+1=5$ positions across and 5 down, a $5\times5$ output.

**Stride 2** (slides 26–28). Moving two cells at a time, the left end of the filter lands on cells 0, 2, 4, giving a $3\times3$ output.

**Stride 3?** (slides 29–31). After cells 0 and 3, the next position 6 would need cells 7 and 8, outside the input. **It doesn't fit.** The formula also gives $(7-3)/3+1=2.33$, not an integer.

**Output size** (slide 31): $\frac{N-F}{S}+1$ ($F$: filter size). With $N=7$, $F=3$: stride 1 → 5, stride 2 → 3, stride 3 → 2.33 (impossible).

**Padding** (slides 32–34). In practice it is common to **zero pad** the border. A $3\times3$ filter with stride 1 on a $7\times7$ input padded by 1 cell gives $9-3+1=7$ on the $9\times9$ padded input, that is, a **$7\times7$ output**, keeping the size. In general, with stride 1 and an $F\times F$ filter, padding $\frac{F-1}2$ preserves the size: 1 for $F=3$, 2 for $F=5$, 3 for $F=7$.

:::key Output size formula
With input $N\times N\times C$, filter size $K$, stride $S$, padding $P$, and $D$ filters, the output is $N'\times N'\times C'$ with
$$N'=\frac{N-K+2P}{S}+1$$
$$C'=D$$
With stride 1 and $P=\frac{K-1}2$ ($K$ odd), $N'=N$ (size-preserving padding).
:::

**Derivation.** The padded row has length $N+2P$. The first cell of the filter can be at $0,S,2S,\dots,mS$, and at the last position the filter must not go past the end: $mS+K\le N+2P$. The largest $m$ is $\big\lfloor\frac{N+2P-K}{S}\big\rfloor$ and the number of positions is $m+1$, so when the division is exact, $N'=\frac{N-K+2P}{S}+1$. When it is not exact, the last few cells go unused (the slides' “doesn't fit”), and libraries take the floor $\lfloor\cdot\rfloor$.

:::ex Example 1 — The computations of slides 41–42
For an input $52\times52\times128$, what is the output of (a) kernel 3, stride 1, padding 1, 256 filters (b) kernel 4, stride 2, padding 1, 256 filters?
---
(a) $N'=\frac{52-3+2\cdot1}{1}+1=52$, output $52\times52\times256$ (size preserved).
(b) $N'=\frac{52-4+2\cdot1}{2}+1=26$, output $26\times26\times256$ (width and height halved).
The output depth is the number of filters, 256, regardless of the input depth 128.
:::

**The three operations** (slide 39): naive convolution (no padding, stride 1), **padding** (add values such as zero to the feature boundary), **stride** (apply the convolution sparsely, every N pixels).

### Going deeper

Without padding the size shrinks by $K-1$ per layer, so a $32\times32$ input with $5\times5$ filters reaches $32-7\cdot4=4$ after 7 layers. Padding lets us stack deep networks and also reduces the underuse of border pixels. Conversely a stride $S>1$ is **downsampling** that shrinks the output size to about $1/S$, and a large stride is sometimes used in the first layer to save computation (the stride 4 of AlexNet in Unit 16)[[@med:ch13:10.2c|Padding and stride (Medical AI).]].
` },
      '15.5': { title: 'Pooling Layers and Fully Connected Layers', body: R`
:::idea In plain words
Pooling shrinks a picture. Keeping only one representative value (the largest, or the average) for every $2\times2$ cells halves the width and height. It builds into the structure the judgment that “was that shape somewhere around here” matters more than the exact position.
:::

**Pooling layer** (slide 55). It makes the representations smaller and more manageable, and operates **over each activation map (channel) independently**. For example, shrinking $224\times224\times64$ to $112\times112\times64$ (downsampling) keeps the number of channels, 64.

**Average pooling and max pooling** (slides 56–58). Shrinking the $4\times4$ input $\begin{pmatrix}5&10&6&7\\4&0&4&3\\2&4&3&4\\0&8&1&6\end{pmatrix}$ with a $2\times2$ window and stride 2 gives
$$\text{average pooling}:\ \begin{pmatrix}4.75&5\\3.5&3.5\end{pmatrix},\qquad \text{max pooling}:\ \begin{pmatrix}10&7\\8&6\end{pmatrix}$$
For example, the top-left window $\{5,10,4,0\}$ has average $19/4=4.75$ and maximum 10.

:::key Pooling
With an $F\times F$ window and stride $S$, the output size follows the same formula as convolution, $\frac{N-F}{S}+1$, and the number of channels is unchanged. There are **no** parameters to learn.
$$\text{max pooling}:\ y=\max_{(i,j)\in\text{window}}x_{ij}$$
$$\text{average pooling}:\ y=\frac1{F^2}\sum_{(i,j)\in\text{window}}x_{ij}$$
$$\text{global average pooling}:\ H\times W\times C\to1\times1\times C$$
:::

**Global average pooling (GAP)** (slide 59). Average the whole activation map of each channel into a single number. $H\times W\times C$ becomes a $C$-dimensional vector, so using it after the last convolution layer instead of a huge fully connected layer cuts the parameters greatly (how GoogLeNet of Unit 16 removed the fully connected layers).

**Fully connected layer** (slides 60–61). Stretch a $32\times32\times3$ image to $3072\times1$ and multiply by $10\times3072$ weights $W$ to get 10 activations. One output is the dot product of one row of $W$ with the input (a 3072-dimensional dot product). A CNN usually classifies the features made by convolution and pooling with fully connected layers and a softmax at the end[[ch06:6.1|The multiclass model of softmax regression.]].

:::ex Example 1 — The gradient of pooling
If the gradient of the loss with respect to the output $y=10$ of the max pooling window $\{5,10,4,0\}$ is $\frac{\partial L}{\partial y}=2$, what are the gradients of the four inputs? And for average pooling?
---
Max pooling is $y=x_{\max}$, so only the cell that gave the maximum (10) receives the gradient 2 and the rest get 0: $(0,2,0,0)$. This is the same as the max gate of Unit 9 sending the gradient only to the larger side[[ch09:9.4|Patterns of gradient flow: a max gate routes the gradient to one side.]]. Average pooling is $y=\frac14\sum x$, so every input receives $\frac24=0.5$.
:::

**A bit of history** (slide 62). LeNet-5 (LeCun, Bottou, Bengio, Haffner 1998), which applied gradient-based learning to document recognition, already had the modern CNN structure of convolution → subsampling (pooling) → convolution → subsampling → fully connected.

### Going deeper

Pooling barely changes the output under small shifts. If the maximum moves by one cell inside a $2\times2$ max pooling window, the output stays the same. So adding pooling to convolution (equivariant) gives **approximate invariance** (Section 15.6). The price is the loss of exact position, so tasks where position matters, such as segmentation, use structures that reduce or undo pooling[[@med:ch14:10.5|Semantic segmentation and upsampling (Medical AI).]].
` },
      '15.6': { title: 'Convolution Layers versus Fully Connected Layers, and Translation Equivariance', body: R`
:::idea In plain words
In a fully connected layer every neuron has its own weights that look at the whole input. A neuron of a convolution layer looks at **only a few nearby cells** (local connectivity), and **all neurons reuse the same weights** (weight sharing). These two constraints cut the parameters greatly and give the property that when the input moves, the output moves along with it.
:::

**Comparison** (slides 63–65).
- **Fully connected layer**: every node of layer $l$ is connected to every node of layer $l+1$.
- **Convolution layer**: each node is **locally** connected (the size of the local neighborhood is determined by the kernel size), and **the weights are shared across different spatial locations**.

:::fig fcconv
:::

**$1\times1$ convolution** (slide 53). “$1\times1$ convolution layers make perfect sense.” With 32 $1\times1$ filters on a $56\times56\times64$ input, each filter has size $1\times1\times64$, computes one 64-dimensional dot product at each position, and the output is $56\times56\times32$. The answer to the slide's question “is it the same as an FC layer?”: **looking at a single pixel**, it is the same as a fully connected layer $y_{ij}=Wx_{ij}+b$ ($W\in\mathbb R^{32\times64}$) sending a 64-dimensional vector to 32 dimensions, and the difference is that the **same** $W$ is shared by every pixel $(i,j)$. The parameters number $64\cdot32+32=2080$.

**Equivariance and invariance** (slides 69–70). Writing $g\cdot x$ for an element $g$ of a set of transformations $G$ (here, translations) acting on the input,

:::key Translation equivariance and invariance
$$f\text{ is equivariant}\iff f(g\cdot x)=g\cdot f(x)\quad(\text{for all }g\in G)$$
$$f\text{ is invariant}\iff f(g\cdot x)=f(x)\quad(\text{for all }g\in G)$$
If $f$ is a convolution and $g$ a translation, $f$ is equivariant: translating the input and then convolving = convolving and then translating.
:::

**Proof.** Let the translation $g$ be $(g\cdot F)[x,y]=F[x-a,\ y-b]$ and the convolution $f(F)[x,y]=\sum_{i,j}w[i,j]F[x+i,y+j]$ (ignore the border, or view the image as infinitely wide). Then
$$f(g\cdot F)[x,y]=\sum_{i,j}w[i,j]\,(g\cdot F)[x+i,\ y+j]=\sum_{i,j}w[i,j]\,F[x-a+i,\ y-b+j]=f(F)[x-a,\ y-b]=\big(g\cdot f(F)\big)[x,y]$$
Since this holds at every $(x,y)$, $f(g\cdot F)=g\cdot f(F)$. The key is that **the same $w$ is used at every position** (weight sharing); for a locally connected layer or a fully connected layer with different weights at each position, the identity breaks.

:::ex Example 1 — Checking it in 1D
Apply the filter $w=(1,-1)$ ($y[t]=x[t]-x[t+1]$) to $x=(0,0,1,2,0,0)$, and also to $x'=(0,0,0,1,2,0)$, the input shifted right by one cell, and compare.
---
$f(x)=(0-0,\ 0-1,\ 1-2,\ 2-0,\ 0-0)=(0,-1,-1,2,0)$ and $f(x')=(0,0,-1,-1,2)$. $f(x')$ is $f(x)$ shifted right by one cell (equivariant). On the other hand, the maximum of the output $\max_tf(x)[t]=2$ stays 2 after the shift. Following the convolution with a global max pooling gives an **invariant** function.
:::

**In summary**, the convolution layer is equivariant and pooling (especially global pooling) makes things close to invariant, forming a structure suited both to classification (“what is it”, needs invariance) and detection (“where is it”, needs equivariance). The next unit is about real architectures built from these parts (AlexNet, VGG, GoogLeNet, ResNet) (slide 71).

### Going deeper

With zero padding at the border, equivariance does not hold exactly near the edges of the image, and with stride $S>1$ it holds only for shifts by multiples of $S$. The invariance of max pooling is also an approximate property for small shifts inside a window. Despite these limits, the equivariance gained from weight sharing is the key reason CNNs generalize on images with far less data than fully connected networks[[@med:ch12:9.4|Parameter sharing viewed as regularization (Medical AI).]].
` },
    },
    probs: [
      { q: R`How many parameters (including biases) does a fully connected layer with 10 outputs have when a $32\times32\times3$ image is flattened into it?`,
        sol: R`$d_{\text{in}}=32\cdot32\cdot3=3072$, weights $3072\cdot10$, biases 10. Total $30{,}730$.` },
      { q: R`Which is **not** one of the disadvantages of fully connected layers given on the slides?`,
        choices: [R`Too many trainable parameters`, R`It does not encode shift equivariance/invariance in its structure`, R`Flattening an image destroys the neighbor relations (spatial structure)`, R`Even when large enough, many functions cannot be represented in principle`],
        sol: R`On the contrary, the slides list “a sufficiently large MLP can learn any function, in theory” as an **advantage**. The problem is not expressive power but the parameter count and the inductive bias.` },
      { q: R`In the $3\times3$ moving average $G[x,y]=\frac19\sum_{i,j=-1}^1F[x+i,y+j]$, what is $G$ when the window contains four values of $90$ and five of $0$?`,
        sol: R`$4\cdot90/9=40$. The third value of the second row of the slides, 40, is this case.` },
      { q: R`What happens if the moving-average filter grows from $3\times3$ to $5\times5$ ($10\times10$ input, no padding)?`,
        choices: [R`Less blur, and the output is $8\times8$`, R`More blur, and the output is $6\times6$`, R`The same blur, and the output is $10\times10$`, R`More blur, and the output is $12\times12$`],
        sol: R`The averaged cells grow from 9 to 25 so the edges spread wider, and the number of positions drops to $10-5+1=6$, giving $6\times6$.` },
      { q: R`With the input and filter of Example 1 ($\begin{pmatrix}1&2&3\\-4&7&4\\2&-5&1\end{pmatrix}$), what is the center value of the feature map (the dot product with the center $3\times3$ patch of the input, $\begin{pmatrix}1&4&4\\1&2&9\\3&5&1\end{pmatrix}$)?`,
        sol: R`$1\cdot1+4\cdot2+4\cdot3+1\cdot(-4)+2\cdot7+9\cdot4+3\cdot2+5\cdot(-5)+1\cdot1=1+8+12-4+14+36+6-25+1=49$.` },
      { q: R`How many parameters does a convolution layer with 10 filters of size $5\times5$ (including biases) on a $28\times28\times6$ input have?`,
        sol: R`A filter extends through the full input depth 6: $5\times5\times6=150$ weights + 1 bias. Ten of them give $1510$. The output is $24\times24\times10$.` },
      { q: R`How many parameters does a convolution layer with 64 filters of size $3\times3$ (including biases, size-preserving padding) on a $224\times224\times3$ input have? (Compare with a fully connected layer of the same input and output sizes.)`,
        sol: R`$64\cdot(27+1)=1792$. Doing the same sizes $224\cdot224\cdot3\to224\cdot224\cdot64$ fully connected would take $150528\cdot3211264\approx4.8\times10^{11}$ weights alone. The parameters of a convolution layer do not depend on $N$.` },
      { q: R`With the input $X$ of Example 2 and the filter $W_2=\begin{pmatrix}-1&1&0\\0&-1&0\\-1&1&0\end{pmatrix}$, compute all four cells of the feature map and compare with the slide's values $\begin{pmatrix}-2&5\\2&-5\end{pmatrix}$.`,
        sol: R`Top-left patch $\begin{pmatrix}1&0&3\\0&-1&2\\2&0&4\end{pmatrix}$: $-1+0+0+0+1+0-2+0+0=-2$. Top right $\begin{pmatrix}0&3&1\\-1&2&0\\0&4&2\end{pmatrix}$: $0+3+0+0-2+0+0+4+0=5$. Bottom left $\begin{pmatrix}0&-1&2\\2&0&4\\0&3&0\end{pmatrix}$: $0-1+0+0+0+0+0+3+0=2$. Bottom right $\begin{pmatrix}-1&2&0\\0&4&2\\3&0&1\end{pmatrix}$: $1+2+0+0-4+0-3+0+0=-4$. The result is $\begin{pmatrix}-2&5\\2&-4\end{pmatrix}$, so the slide's last cell $-5$ should be $-4$.`,
        rubric: R`- Choosing the four patches correctly — 1 pt
- Each dot product — 0.5 pt each
- Pointing out the error in the slide's value — 1 pt` },
      { q: R`For a $7\times7$ input, a $3\times3$ filter, stride 2, and padding 0, what is the width of the output?`,
        sol: R`$(7-3)/2+1=3$. The left end of the filter lands on cells 0, 2, 4.` },
      { q: R`What happens when a $3\times3$ filter is applied to a $7\times7$ input with stride 3 and padding 0?`,
        choices: [R`A $2\times2$ output`, R`A $3\times3$ output`, R`It doesn't fit: $(7-3)/3+1$ is not an integer`, R`A $1\times1$ output`],
        sol: R`$(7-3)/3+1=2.33$. After cells 0 and 3, at cell 6 the filter would go outside the input (slides 30–31).` },
      { q: R`With stride 1, what padding $P$ makes a $7\times7$ filter preserve the output size?`,
        sol: R`$N'=N-7+2P+1=N\iff P=3$.` },
      { q: R`What is the width of the output when kernel 4, stride 2, padding 1, and 256 filters are used on a $52\times52\times128$ input?`,
        sol: R`$(52-4+2)/2+1=26$. The output is $26\times26\times256$ (slide 42).` },
      { q: R`Show that applying a filter of size $K$ with stride $S$ to an input of length $N$ padded by $P$ gives an output of length $\big\lfloor\frac{N-K+2P}{S}\big\rfloor+1$.`,
        sol: R`The padded length is $N+2P$. The first cell of the filter is at $0,S,2S,\dots$, and a filter placed at $mS$ uses cells $mS,\dots,mS+K-1$, so the condition is $mS+K-1\le N+2P-1$, that is, $m\le\frac{N+2P-K}{S}$. The possible $m$ are $0,1,\dots,\big\lfloor\frac{N+2P-K}{S}\big\rfloor$, so their number is $\big\lfloor\frac{N-K+2P}{S}\big\rfloor+1$. When the division is exact, it is $\frac{N-K+2P}{S}+1$.`,
        rubric: R`- The padded length and the cells the filter occupies — 1 pt
- The inequality for the last position — 2 pts
- Counting (starting from 0) — 1 pt` },
      { q: R`What is the top-left output of $2\times2$, stride-2 average pooling on $\begin{pmatrix}5&10&6&7\\4&0&4&3\\2&4&3&4\\0&8&1&6\end{pmatrix}$?`,
        sol: R`$(5+10+4+0)/4=4.75$. For max pooling, 10.` },
      { q: R`What is the dimension of the output vector of global average pooling on a $7\times7\times512$ feature?`,
        sol: R`Each channel averages its $7\times7=49$ values into one number. The number of channels, 512, is the dimension. There are no parameters to learn.` },
      { q: R`If a gradient of $3$ arrives at the output of the max pooling window $\{5,10,4,0\}$, what gradient goes to the inputs?`,
        choices: [R`$(0.75,0.75,0.75,0.75)$`, R`$(0,3,0,0)$`, R`$(3,3,3,3)$`, R`$(0,0,0,0)$`],
        sol: R`$y=\max$ has derivative 1 only with respect to the cell that gave the maximum and 0 for the rest. For average pooling it would be $(0.75,\dots)$.` },
      { q: R`How many parameters does a layer with 32 filters of size $1\times1$ (including biases) on a $56\times56\times64$ input have?`,
        sol: R`One filter has $1\times1\times64$ weights + 1 bias, so 32 of them have $32\cdot65=2080$. At each pixel it is the same as a fully connected map $\mathbb R^{64}\to\mathbb R^{32}$, with the weights shared by every pixel.` },
      { q: R`If $f(g\cdot x)=f(x)$ holds for every translation $g$, then $f$ is`,
        choices: [R`equivariant`, R`invariant`, R`linear`, R`invertible`],
        sol: R`If the output is the same regardless of the translation, it is **invariant**; if the output moves by the same amount ($f(g\cdot x)=g\cdot f(x)$), it is **equivariant**. Convolution is equivariant; adding global pooling makes it invariant.` },
      { q: R`For the 1D convolution $f(x)[t]=\sum_{i=0}^{K-1}w[i]\,x[t+i]$ (signals defined on all integers) and the translation $(g_a\cdot x)[t]=x[t-a]$, prove that $f(g_a\cdot x)=g_a\cdot f(x)$, and show with a counterexample that it does not hold in general for a locally connected layer $h(x)[t]=\sum_iw_t[i]\,x[t+i]$ with different weights $w_t[i]$ at each position.`,
        sol: R`**Equivariance.** $f(g_a\cdot x)[t]=\sum_iw[i]\,(g_a\cdot x)[t+i]=\sum_iw[i]\,x[t+i-a]=f(x)[t-a]=(g_a\cdot f(x))[t]$. Since this holds for every $t$, $f\circ g_a=g_a\circ f$.
**Counterexample.** $K=1$, $w_0[0]=1$, $w_t[0]=0$ ($t\ne0$), that is, $h(x)[t]=x[t]$ for $t=0$ and 0 elsewhere. If $x=\delta_0$ (1 only at 0), then $h(x)=\delta_0$ and $g_1\cdot h(x)=\delta_1$. But $g_1\cdot x=\delta_1$ and $h(\delta_1)[1]=w_1[0]\cdot1=0$, so $h(g_1\cdot x)=0\ne\delta_1$. Equivariance is guaranteed only when the weights do not depend on the position (sharing).`,
        rubric: R`- The equivariance identity via the substitution $t+i-a$ — 3 pts
- Constructing and checking the counterexample — 2 pts` },
    ],
  };
})();
