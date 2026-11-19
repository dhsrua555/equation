/* English text — 22 Linear Attention & Vision Transformers (W10 Wed slides 12–29 and notes, W11 Mon notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '소프트맥스 어텐션': 'softmax attention',
    'N×N 행렬을 통째로 만든다': 'builds the whole N×N matrix',
    '시간·메모리 O(N²)': 'time and memory O(N²)',
    '선형 어텐션': 'linear attention',
    '질의마다': 'per query',
    'S와 Z는 한 번만 만든다': 'S and Z are built once',
    '시간·메모리 O(N)': 'time and memory O(N)',
    '소프트맥스 어텐션과 선형 어텐션의 계산 순서': 'Order of computation in softmax and linear attention',
    '채널 하나 · 모든 샘플과 위치': 'one channel · all samples and positions',
    '샘플 하나 · 모든 채널과 위치': 'one sample · all channels and positions',
    'LN (트랜스포머)': 'LN (Transformer)',
    '토큰 하나 · 모든 특징': 'one token · all features',
    '칸의 가로 = 공간 위치 2개, 세로 = 채널 2개. 색칠한 칸이 같은 평균·분산을 쓴다': 'columns = 2 spatial positions, rows = 2 channels; shaded cells share one mean and variance',
    '세 가지 정규화가 묶는 칸': 'The cells each normalization groups',
    '이미지를 P×P 패치로': 'the image as P×P patches',
    '선형 사상': 'linear map',
    '위치 임베딩을 더한 N+1개 토큰': 'N+1 tokens with position embeddings added',
    '트랜스포머 인코더 × L': 'Transformer encoder × L',
    'MLP 헤드': 'MLP head',
    '클래스': 'class',
    '클래스 토큰의 출력만': 'only the class token output',
    '비전 트랜스포머의 흐름': 'Flow of the Vision Transformer',
    '최솟값 ≈ −0.17 (x ≈ −0.75)': 'minimum ≈ −0.17 (x ≈ −0.75)',
    'GELU와 ReLU': 'GELU and ReLU',
    '전역 어텐션: 모든 토큰과': 'global attention: with every token',
    '윈도우 어텐션: 같은 창 안에서만': 'window attention: only inside one window',
    '쌍의 수 N² = 4096': 'pairs N² = 4096',
    '쌍의 수 (N/M²)·M⁴ = NM² = 1024': 'pairs (N/M²)·M⁴ = NM² = 1024',
    '전역 어텐션과 윈도우 어텐션': 'Global and window attention',
  });
  Object.assign(EM.en.fig, {
    linattn: R`The difference in the order of computation (Week 10 Wednesday notes). Top: softmax attention first builds the $N\times N$ matrix $A$, the row-normalized $QK^T$, and then multiplies by $V$, so its time and memory grow like $N^2$. Bottom: once the similarity is $\phi(\mathbf q)^T\phi(\mathbf k)$, associativity lets us build $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T\in\mathbb R^{r\times d_v}$ and $Z=\sum_j\phi(\mathbf k_j)\in\mathbb R^r$ only once, and each query gets its output as $S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$. No $N\times N$ matrix ever appears.`,
    normgroups: R`In the example from the notes ($B=2$, $C=2$, $H=1$, $W=2$) the cells that share one mean and variance are shaded. BN gathers channel 1 over both samples and both positions, $\{1,3,9,11\}$; the CNN LN uses every cell of sample 1, $\{1,3,5,7\}$; the Transformer LN uses the features of one token (position), $\{1,5\}$. The bottom lines give the mean and variance of that group and the normalized value of $1$ (or of the token $(1,5)$), with $\varepsilon=0$, $\gamma=1$, $\beta=0$.`,
    vitpipe: R`The flow of ViT (equations (1)–(4) of slides 15–22, redrawn). The image is cut into $N$ patches of size $P\times P$, which are flattened and mapped by the linear map $E$ to $D$-dimensional tokens; a learned class token (cls) is put in front and the position embedding $E_{pos}$ is added (eq. 1). Each of the $L$ encoder blocks puts LN before every sublayer and a residual after it (eqs. 2–3). Only $\mathbf y$, the LN of the class-token output $\mathbf z_L^0$ of the last layer (eq. 4), goes to the MLP head for classification.`,
    gelu: R`GELU $x\Phi(x)$ (solid) and ReLU (dashed), where $\Phi$ is the standard normal CDF. For large positive inputs $\Phi\approx1$, so it equals $x$; for large negative inputs $\Phi\approx0$, so it goes to $0$. Unlike ReLU it is differentiable everywhere, and on the negative side it has a small dip with minimum about $-0.17$ at $x\approx-0.75$ (the part circled in the notes).`,
    wmsa: R`A schematic with $N=8\times8=64$ tokens and windows of $M\times M=4\times4$. Left: in global self-attention the query q scores against all $N$ tokens, so there are $N^2$ pairs. Right: window attention (Swin's W-MSA) attends only among the $M^2$ tokens inside a window bounded by the bold lines, so each of the $N/M^2$ windows has $(M^2)^2$ pairs, $NM^2$ pairs in all. With the lecture's $56\times56$ and $M=7$ there are $64$ windows and the number of pairs drops by a factor of $64$.`,
  });
  EM.en.ch[22] = {
    title: 'Linear Attention and Vision Transformers',
    fig: R`Multiplications in one layer against the token count N for C = 96: global self-attention 4NC² + 2N²C (bold) bends upward like N², while window attention 4NC² + 2NM²C with window sizes M = 4, 7, 14 (thin) stays a straight line`,
    tagline: R`Two ways to cut the $O(N^2)$ cost of self-attention, and how to carry the Transformer over to images. Writing the similarity as an inner product of feature maps lets us reorder the computation into $O(N)$ (linear attention); cutting an image into patch tokens gives ViT; and attending only inside windows gives Swin's $4NC^2+2NM^2C$.`,
    summary: R`Week 10 Wednesday starts from the cost problem at the end of Unit 21. Softmax attention is rewritten as a weighted average with the similarity $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$, and replacing $\mathrm{sim}$ with a kernel $\phi(\mathbf q)^T\phi(\mathbf k)$ ($\phi=\mathrm{ELU}+1$) gives **linear attention**, which builds $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T$ and $Z=\sum_j\phi(\mathbf k_j)$ only once and computes $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$. Next the groups of the normalizations are compared: BN takes the mean and variance per channel over the batch and positions, the CNN LN over one whole sample, and the Transformer LN over the features of one token. The **Vision Transformer** (ViT) cuts an image into $P\times P$ patches, makes tokens with a linear map $E$, adds a class token and position embeddings, feeds them to a Pre-LN encoder, and classifies from the output of the class token. Its MLP activation is $\mathrm{GELU}(x)=x\Phi(x)$, and because ViT has a weaker inductive bias than a CNN it falls behind on small data but leads on large data. On Week 11 Monday the cost $O(mnk)$ of a matrix product is used to count the cost $4NC^2+2N^2C$ of one self-attention layer, and Swin's **window attention**, which attends only inside $M\times M$ windows, is shown to cost $4NC^2+2NM^2C$, linear in $N$.`,
    goals: [
      R`Rewrite softmax attention as a weighted average with the similarity $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$ and show that the output is a convex combination of the values`,
      R`Derive linear attention $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$ with the kernel $\phi(\mathbf q)^T\phi(\mathbf k)$, compute outputs from $S$ and $Z$, and show the cost $O(Nrd_v)$ and that the attention matrix has rank at most $r$`,
      R`Distinguish the groups over which BN, the CNN LN, and the Transformer LN gather the mean and variance, and compute all three normalizations on a given tensor`,
      R`Write ViT equations (1)–(4), compute the token count, the parameter counts of $E$ and $E_{pos}$, and the shape at each layer, and explain why position embeddings are interpolated when fine-tuning at a higher resolution`,
      R`Compute the values and derivative of $\mathrm{GELU}(x)=x\Phi(x)$, and explain the difference in inductive bias between ViT and CNNs and the resulting difference in performance with data size`,
      R`Derive the cost $4NC^2+2N^2C$ of one self-attention layer from the matrix-product cost $O(mnk)$ and decide which term dominates when`,
      R`Derive the window-attention cost $4NC^2+2NM^2C$, and compute the number of windows and the reduction factor in the $56\times56$, $M=7$ example`,
    ],
    secTitles: { '22.1': 'As a similarity', '22.2': 'Linear attention', '22.3': 'LN vs BN', '22.4': 'ViT', '22.5': 'GELU · ViT vs CNN', '22.6': 'Attention cost', '22.7': 'Window attention' },
    secs: {
      '22.1': { title: 'Softmax Attention as a Similarity-Weighted Average', body: R`
:::idea In plain words
The output of self-attention is a weighted average of the values $\mathbf v_j$, and the weight measures how much the query $\mathbf q_i$ and the key $\mathbf k_j$ resemble each other. Expanding the softmax reveals this resemblance as a single function, $\exp(\mathbf q_i^T\mathbf k_j/\sqrt D)$. That changing only this function changes the cost of attention is the starting point of this unit.
:::

**Starting point** (slide 12, “Linearization of TF”). At the end of Unit 21 we saw that one self-attention layer costs $O(N^2d)$ and that storing the attention matrix takes $N^2$ memory[[ch21:21.5|Shapes and cost of self-attention.]]. Slide 12 has only a title; in class the way to cut this cost (Katharopoulos et al., ICML 2020) was explained on the board.

:::hand Lecture note — the two bottlenecks of self-attention
From the input $X\in\mathbb R^{N\times D_x}$ we make $Q=XW_Q^T$, $K=XW_K^T$, $V=XW_V^T$, where $W_Q,W_K\in\mathbb R^{D\times D_x}$ and $W_V\in\mathbb R^{D_v\times D_x}$.

Row by row, $\hat{\mathbf v}_i=\sum_{j=1}^N\mathrm{softmax}_j\big(\mathbf q_i^T\mathbf k_j/\sqrt D\big)\,\mathbf v_j$; collected into matrices, $\hat V=\mathrm{softmax}(QK^T/\sqrt D)\,V$.

There are two bottlenecks. Storing $A=\mathrm{softmax}(QK^T/\sqrt D)\in\mathbb R^{N\times N}$ takes $O(N^2)$ memory, and computing $AV$ takes $O(N^2)$ time (the notes boxed “ICML” to mark the source).
:::

**Expanding the softmax.** The softmax weight of the score $s_{ij}=\mathbf q_i^T\mathbf k_j/\sqrt D$ is $\alpha_{ij}=e^{s_{ij}}/\sum_le^{s_{il}}$. The denominator does not depend on the summation index $j$, so it can be pulled out of the sum.

:::key Softmax attention written with a similarity
With $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$,
$$\hat{\mathbf v}_i=\frac{\sum_{j=1}^N\mathrm{sim}(\mathbf q_i,\mathbf k_j)\,\mathbf v_j}{\sum_{j=1}^N\mathrm{sim}(\mathbf q_i,\mathbf k_j)}.$$
If $\mathrm{sim}>0$, the weights are positive and sum to $1$, so $\hat{\mathbf v}_i$ is a convex combination of the $\mathbf v_j$. Softmax attention is the case where $\mathrm{sim}$ is chosen to be the exponential.
:::

Written this way, what attention needs becomes clear. A single nonnegative similarity is enough, and the exponential is just one of many choices. The next section changes this choice to turn the order of computation around.

:::ex Example 1 — Computing with similarities
With $D=1$, query $q=\ln3$, keys $k_1=0$, $k_2=1$, and values $v_1=4$, $v_2=8$, what is $\hat v$?
---
$\mathrm{sim}(q,k_1)=e^0=1$ and $\mathrm{sim}(q,k_2)=e^{\ln3}=3$, so $\hat v=\frac{1\cdot4+3\cdot8}{1+3}=\frac{28}4=7$. This equals the value computed with the softmax weights $(\frac14,\frac34)$.
:::
` },
      '22.2': { title: 'Kernel Feature Maps and Linear Attention', body: R`
:::idea In plain words
Merely regrouping the matrix product $(QK^T)V$ as $Q(K^TV)$ makes the $N\times N$ matrix disappear. The trouble is that the exponential inside the softmax blocks this regrouping. If the similarity becomes an inner product of feature maps, $\phi(\mathbf q)^T\phi(\mathbf k)$, the regrouping works, and we only need to build once the summaries $S$ and $Z$ that all queries share.
:::

**Switching to a kernel** (notes). Replace the similarity with a kernel $k(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)$, $\phi:\mathbb R^D\to\mathbb R^r$. The weights must be positive, so $\phi$ is chosen to have positive components. The notes use the following function on each component (so $r=D$).
$$\phi(\mathbf x)_l=\mathrm{ELU}(x_l)+1=\begin{cases}x_l+1,&x_l\ge0\\e^{x_l},&x_l<0\end{cases}$$

:::warn The ELU label in the notes
The notes call this function “ELU”, but the formula written is $\mathrm{ELU}(x)+1$. ELU itself is $e^x-1$ for $x<0$, which is negative and unsuitable as a similarity; adding $1$ makes every value positive. The original paper (Katharopoulos et al., 2020) also uses $\mathrm{elu}(x)+1$.
:::

**Reordering.** In both the numerator and the denominator $\phi(\mathbf q_i)^T$ does not depend on $j$, so it comes out of the sum (the output is written as a row vector).
$$\tilde{\mathbf v}_i^T=\frac{\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)\,\mathbf v_j^T}{\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)}=\frac{\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)\mathbf v_j^T}{\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)}$$

:::key Linear attention
With $S=\sum_{j=1}^N\phi(\mathbf k_j)\mathbf v_j^T\in\mathbb R^{r\times d_v}$ and $Z=\sum_{j=1}^N\phi(\mathbf k_j)\in\mathbb R^r$,
$$\tilde{\mathbf v}_i=\frac{S^T\phi(\mathbf q_i)}{\phi(\mathbf q_i)^TZ}.$$
Building $S$ and $Z$ costs $O(Nrd_v)$ and the outputs of all queries cost $O(Nrd_v)$, so the total time is linear in $N$, and no $N\times N$ matrix is stored.
:::

:::fig linattn
:::

:::hand Lecture note — counting the cost
$S$: one term $\phi(\mathbf k_j)\mathbf v_j^T$ takes $rd_v$ multiplications and $N$ of them are added, so $O(Nrd_v)$. $Z$: $O(Nr)$.

Outputs: per query, $S^T\phi(\mathbf q_i)$ costs $O(rd_v)$ and $\phi(\mathbf q_i)^TZ$ costs $O(r)$, so $N$ of them cost $O(Nrd_v+Nr)$.

Altogether this is $O(N)$ with $r$ and $d_v$ fixed. At the end the notes write $\hat V=AV\approx(\mathbf a\mathbf b^T)V$, pointing out that the method approximates the attention matrix by a low-rank matrix.
:::

**What low rank means.** The similarity matrix before normalization is $\phi(Q)\phi(K)^T$ (with $\phi(Q),\phi(K)\in\mathbb R^{N\times r}$), so its rank is at most $r$, and dividing each row by a positive number does not raise the rank. The $\exp(QK^T/\sqrt D)$ of softmax attention takes an exponential entry by entry, so it has no such limit and its rank can reach $N$. Linear attention buys speed by narrowing the attention patterns it can express.

:::ex Example 2 — Computing with S and Z
With $\phi(\mathbf k_1)=(1,0)$, $\phi(\mathbf k_2)=(1,1)$, values $v_1=2$, $v_2=4$ ($d_v=1$), and $\phi(\mathbf q)=(1,2)$, what is the output of linear attention?
---
$S=\phi(\mathbf k_1)v_1+\phi(\mathbf k_2)v_2=(2,0)+(4,4)=(6,4)$ and $Z=(1,0)+(1,1)=(2,1)$. The numerator is $\phi(\mathbf q)^TS=6+8=14$ and the denominator $\phi(\mathbf q)^TZ=2+2=4$, so $\tilde v=3.5$. Check: the similarities are $1$ and $3$, giving $\frac{1\cdot2+3\cdot4}{4}=3.5$.
:::

:::ex Example 3 — How much faster
With $N=4096$ and $d_v=r=64$, compare the multiplications for $AV$ in softmax attention with those for building $S$ in linear attention.
---
$AV$ takes $N^2d_v=4096^2\cdot64\approx1.07\times10^9$ multiplications and $S$ takes $Nrd_v=4096\cdot64\cdot64\approx1.68\times10^7$, a ratio of $N/r=64$. $QK^T$ is also $N^2D$ and shrinks by the same ratio, and the memory for the attention matrix, $4096^2\approx1.7\times10^7$ entries, disappears.
:::

### Going deeper

**With a mask it becomes an RNN** (outside the slides, from the original paper). When query $i$ may look only at $j\le i$, as in a language model, we use $S_i=\sum_{j\le i}\phi(\mathbf k_j)\mathbf v_j^T$ and $Z_i=\sum_{j\le i}\phi(\mathbf k_j)$, which update one step at a time as $S_i=S_{i-1}+\phi(\mathbf k_i)\mathbf v_i^T$ and $Z_i=Z_{i-1}+\phi(\mathbf k_i)$. This is an RNN carrying the state $(S_i,Z_i)$, so generation costs only $O(rd_v)$ per token. This is what the original paper's title, “Transformers are RNNs”, refers to[[ch21:21.6|Masked self-attention.]].
` },
      '22.3': { title: 'Layer Norm versus Batch Norm: Three Groupings', body: R`
:::idea In plain words
Normalization is the question of which numbers to treat as one group and bring to mean $0$ and variance $1$. BN gathers one channel across the whole batch, the CNN LN takes a whole image, and the Transformer LN takes only the features of one token. Different groups normalize the same number differently.
:::

**Slide 13.** The normalization formula is the same as in Unit 21[[ch21:21.8|The layer-norm formula and its comparison with BN.]]. The mean $\mu$ and variance $\sigma^2$ of a group give $(x-\mu)/\sqrt{\sigma^2+\varepsilon}$, which is then rescaled by the learned $\gamma$ and $\beta$. What differs is the range over which the mean and variance are gathered. Viewing the input as a $B\times C\times H\times W$ tensor (batch, channels, height, width):

:::key Groups for the normalization statistics
| | Cells the statistics are gathered over | Size of one group | Number of groups |
|---|---|---|---|
| BN (CNN) | all samples and positions of one channel | $BHW$ | $C$ |
| LN (CNN) | all channels and positions of one sample | $CHW$ | $B$ |
| LN (Transformer) | all feature components of one token | $C$ | number of tokens |

For each group compute $\mu$ and $\sigma^2$, map to $(x-\mu)/\sqrt{\sigma^2+\varepsilon}$, and rescale per channel (feature) by $\gamma$ and $\beta$. The statistics of LN use no other sample, so LN does not depend on the batch size.
:::

:::fig normgroups
:::

:::hand Lecture note — the example B = 2, C = 2, H = 1, W = 2
The two samples have the following values (two positions per channel).

| | Channel 1 | Channel 2 |
|---|---|---|
| $x^{(1)}$ | $1,\ 3$ | $5,\ 7$ |
| $x^{(2)}$ | $9,\ 11$ | $13,\ 15$ |

① CNN BN (several samples and spatial positions within the same channel): the group of channel 1 is $\{1,3,9,11\}$, so $\mu_1=6$ and $\sigma_1^2=\frac{25+9+9+25}4=17$. Channel 2 is $\{5,7,13,15\}$ with $\mu_2=10$, $\sigma_2^2=17$. The value $1$ becomes $(1-6)/\sqrt{17}\approx-1.21$.

② CNN LN (all channels and spatial positions of one image): the group of image 1 is $\{1,3,5,7\}$, so $\mu=4$ and $\sigma^2=\frac{9+1+1+9}4=5$. Image 2 is $\{9,11,13,15\}$ with $\mu=12$, $\sigma^2=5$. The value $1$ becomes $(1-4)/\sqrt5\approx-1.34$.

③ Transformer LN (all feature components of one token): treating positions as tokens, the tokens of image 1 are $(1,5)$ and $(3,7)$. The token $(1,5)$ has $\mu=3$ and $\sigma^2=4$, so it becomes $(-1,1)$.
:::

**What differs.** Under BN, how the value $1$ of sample 1 is normalized depends on the values $9,11$ of sample 2. That is, the BN output depends on the other samples that came in the same batch, which is why inference must use running averages collected during training[[ch12:12.4|BN statistics at inference.]]. Both LNs look at one sample only, so training and inference use the same formula. The Transformer LN has an even smaller group and is computed independently per token even when sentence lengths differ.

:::ex Example 4 — The same value 15 under three normalizations
Normalize the value $15$ at channel 2, position 2 of $x^{(2)}$ in the tensor above in all three ways.
---
BN: channel 2 has $\mu_2=10$, $\sigma_2^2=17$, so $(15-10)/\sqrt{17}=5/\sqrt{17}\approx1.21$. CNN LN: image 2 has $\mu=12$, $\sigma^2=5$, so $3/\sqrt5\approx1.34$. Transformer LN: the token $(11,15)$ has $\mu=13$, $\sigma^2=4$, so $(15-13)/2=1$. The same value turns into three different values.
:::
` },
      '22.4': { title: 'The Vision Transformer', body: R`
:::idea In plain words
A Transformer accepts anything that is a list of tokens. ViT cuts an image into $16\times16$ pieces (patches) and treats each piece like a word. It flattens each piece and makes a vector with a linear map, adds position information, puts one classification token in front, feeds everything to the encoder, and classifies from that token's output.
:::

**Why Transformers** (slide 14). Transformers have kept improving steadily as data and compute grow, and since they lack strong assumptions such as a grid or a chain, the same architecture serves many kinds of data[[ch21:21.3|Inductive bias and a universal model.]]. Slides 15–21 show, step by step, ViT (Dosovitskiy et al., 2021), which carries this over to images.

**Patch embedding** (slides 15–19). The image $\mathbf x\in\mathbb R^{H\times W\times C}$ is cut into $N=HW/P^2$ patches of size $P\times P$, and each patch is flattened into a vector $\mathbf x_p^i$ of length $P^2C$. Multiplying by a matrix $E\in\mathbb R^{(P^2C)\times D}$ makes a $D$-dimensional token. There is also a hybrid that uses the positions of a CNN feature map as tokens instead of flattened patches.

**Class token and position embedding** (slides 20–21). One learned vector $\mathbf x_{class}$ (a global token) is put in front, and the position embedding $E_{pos}\in\mathbb R^{(N+1)\times D}$ is added. The position embedding can be learned or fixed as a 2D periodic function. Self-attention does not know order[[ch21:21.6|Why positional encoding is needed.]], so without it the class token's output is the same even if the patches are shuffled.

:::key Equations of the Vision Transformer
$$\mathbf z_0=[\mathbf x_{class};\ \mathbf x_p^1E;\ \mathbf x_p^2E;\ \cdots;\ \mathbf x_p^NE]+E_{pos}\qquad(1)$$
$$\mathbf z'_\ell=\mathrm{MSA}(\mathrm{LN}(\mathbf z_{\ell-1}))+\mathbf z_{\ell-1},\qquad\ell=1,\dots,L\qquad(2)$$
$$\mathbf z_\ell=\mathrm{MLP}(\mathrm{LN}(\mathbf z'_\ell))+\mathbf z'_\ell,\qquad\ell=1,\dots,L\qquad(3)$$
$$\mathbf y=\mathrm{LN}(\mathbf z_L^0)\qquad(4)$$
$E\in\mathbb R^{(P^2C)\times D}$, $E_{pos}\in\mathbb R^{(N+1)\times D}$. MSA is multi-head self-attention, MLP is a two-layer network with GELU, and $\mathbf z_L^0$ is the first row (the class token) of the last layer's output.
:::

:::fig vitpipe
:::

**Difference from the Unit 21 encoder** (slide 22). The encoder block of Unit 21 put LN after each sublayer ($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{Attn})$)[[ch21:21.7|The Transformer encoder block.]], whereas ViT puts LN before every block and adds the residual after the block. So no normalization sits on the residual path $\mathbf z_{\ell-1}\to\mathbf z_\ell$, and the input passes unchanged to the upper layers. The classification head is attached only to $\mathbf y$; the outputs of the other $N$ tokens are not used.

:::ex Example 5 — Token count and parameters
For a $224\times224\times3$ image fed to a ViT with $P=16$ and $D=768$, find the number of tokens and the parameter counts of $E$ and $E_{pos}$.
---
There are $N=224^2/16^2=14\cdot14=196$ patches, plus the class token, so $197$ tokens. A flattened patch has length $16\cdot16\cdot3=768$, so $E$ has $768\times768=589{,}824$ parameters, $E_{pos}$ has $197\times768=151{,}296$, and the class token has $768$. Equations (2)–(3) do not change the shape, so every $\mathbf z_\ell$ is $197\times768$.
:::
` },
      '22.5': { title: 'GELU and ViT versus CNNs', body: R`
:::idea In plain words
ReLU cuts negatives sharply to $0$, whereas GELU lets the input $x$ through only in proportion to $\Phi(x)$, the probability that a standard normal draw is at most $x$. Large values pass almost unchanged, small values become almost $0$, and in between the two join smoothly.
:::

:::key GELU
$$\mathrm{GELU}(x)=x\,\Phi(x),\qquad\Phi(x)=P(X\le x),\quad X\sim\N(0,1)$$
A common approximation is $0.5x\big(1+\tanh\big[\sqrt{2/\pi}\,(x+0.044715x^3)\big]\big)$. The derivative is $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$ ($\varphi$ the standard normal density), and $\mathrm{GELU}'(0)=\tfrac12$.
:::

:::fig gelu
:::

**Properties** (slide 23, notes). $\mathrm{GELU}(1)=\Phi(1)\approx0.841$ and $\mathrm{GELU}(-1)=-\Phi(-1)\approx-0.159$. Since $\Phi(-x)=1-\Phi(x)$, the identity $\mathrm{GELU}(x)-\mathrm{GELU}(-x)=x$ always holds. Unlike ReLU it is differentiable everywhere, and it is not monotone on the negative side: it has a minimum of about $-0.17$ at $x\approx-0.75$ (the dip circled in the notes). The MLP of ViT uses this activation.

**ViT versus CNNs** (slide 24).

| | CNN | ViT |
|---|---|---|
| Range one layer sees | local (kernel size) | global (all patches) |
| Translation equivariance | guaranteed by convolution | not guaranteed by the architecture (the slide writes “X?”) |
| Position information | built into the grid structure | learned through position embeddings |
| Fine-tuning at a higher resolution | applies as is | position embeddings interpolated in 2D |

The patch embedding is local only within a patch, and self-attention sees every patch from the first layer. Its assumptions about images (its inductive bias) are correspondingly weak. When fine-tuning at a higher resolution, $P$ is kept, so the number of patches grows; the $E_{pos}$ learned on the original grid is interpolated in 2D to the new grid, and the head is replaced for the new task.

**Experiments** (slide 26). Pre-trained on relatively small data such as ImageNet, ViT scores below the CNN-based BiT; pre-trained on large data such as JFT-300M, ViT comes out ahead. A model with weak assumptions must learn them from the data, so it benefits when data is plentiful.

:::ex Example 6 — The grid when fine-tuning at a higher resolution
A ViT pre-trained at $224\times224$ with $P=16$ is fine-tuned at $384\times384$. What happens to the patch grid and the position embedding?
---
The grid grows from $14\times14=196$ patches to $24\times24=576$. The learned $E_{pos}$ covers only the $196$ patches (and the class token), so its patch part is laid out on the $14\times14$ grid and interpolated in 2D to $24\times24$, giving a new $E_{pos}\in\mathbb R^{577\times D}$. The class token's position embedding is kept as is.
:::
` },
      '22.6': { title: 'The Cost of Matrix Products and of Self-Attention', body: R`
:::idea In plain words
The cost of attention comes down to how many matrix products it performs. Multiplying an $m\times k$ matrix by a $k\times n$ matrix takes $k$ multiplications for each of the $mn$ entries of the result, $mnk$ in all. This one rule is enough to count the cost of one self-attention layer.
:::

:::hand Lecture note — the cost of a matrix product (Tip)
For $A\in\mathbb R^{m\times k}$ and $B\in\mathbb R^{k\times n}$, the entries of $Y=AB$ are $Y_{ij}=\sum_{l=1}^kA_{il}B_{lj}$. One entry takes $k$ multiplications and $k-1$ additions, and there are $mn$ entries, so the cost is $O(mnk)$.
:::

**Fixing the shapes** (notes). A feature map $X\in\mathbb R^{h\times w\times C}$ has a vector $\mathbf x_{r,c}\in\mathbb R^C$ at each position $(r,c)$ ($h$, $w$ the spatial size, $C$ the feature dimension). Laying the positions out in one row gives a matrix $X\in\mathbb R^{N\times C}$ of $N=hw$ tokens. The projections are $Q=XW_Q$, $K=XW_K$, $V=XW_V$ with $W_Q,W_K,W_V\in\mathbb R^{C\times C}$.

:::key Cost of self-attention
| Computation | Shape | Multiplications |
|---|---|---|
| $Q$, $K$, $V$ projections | $(N\times C)(C\times C)$ three times | $3NC^2$ |
| $QK^T$ | $(N\times C)(C\times N)$ | $N^2C$ |
| $AV$ | $(N\times N)(N\times C)$ | $N^2C$ |
| Output projection | $(N\times C)(C\times C)$ | $NC^2$ |

$$\Omega(\mathrm{MSA})=4NC^2+2N^2C=4hwC^2+2(hw)^2C$$
The first term is $O(NC^2)$ and the second $O(N^2C)$; the second is larger when $N>2C$. The softmax and the division by $\sqrt C$ are $O(N^2)$ and are left out.
:::

**The fourth projection.** The notes wrote $3NC^2$ for $Q$, $K$, $V$; the Swin paper's $4hwC^2$ also includes the $NC^2$ of the output projection $W_O\in\mathbb R^{C\times C}$ applied after the heads are concatenated. Splitting into $h$ heads changes nothing: each head's $QK^T$ costs $N^2(C/h)$, so the total is still $N^2C$[[ch21:21.7|Parameters and cost of multi-head attention.]].

:::ex Example 7 — Sizes in the first Swin stage
With $h=w=56$ and $C=96$, what are the two terms of one global self-attention layer?
---
$N=56^2=3136$. $4NC^2=4\cdot3136\cdot9216=115{,}605{,}504$ and $2N^2C=2\cdot3136^2\cdot96=1{,}888{,}223{,}232$, about $2.0\times10^9$ in total. Since $N=3136$ is far larger than $2C=192$, the attention term makes up about $94\%$ of the total. The attention matrix alone has $3136^2\approx9.8\times10^6$ entries per head.
:::
` },
      '22.7': { title: 'The Cost of Window Attention (Swin)', body: R`
:::idea In plain words
If instead of every token looking at every token we split the image into $M\times M$ windows and attend only inside each window, the number of partners of one token drops from $N$ to $M^2$. With the window size fixed, the cost becomes linear in the number of tokens.
:::

**The Swin Transformer** (slide 27). A hierarchy that shrinks the feature map stage by stage: $56\times56\times96\to28\times28\times192\to14\times14\times384\to7\times7\times768$, so at each stage the number of tokens is quartered and the channels double, the same shape as a CNN feature pyramid. Within each stage window attention (W-MSA) replaces global attention.

:::key Cost of window attention
With windows of size $M\times M$, $M^2$ tokens per window, and $N/M^2$ windows,
$$\Omega(\mathrm{W\text{-}MSA})=4NC^2+2NM^2C=4hwC^2+2M^2hwC$$
The projections $4NC^2$ are unchanged, and the attention is $2(M^2)^2C=2M^4C$ per window times $N/M^2$ windows, giving $2NM^2C$. With $M$ and $C$ fixed it is $O(N)$.
:::

:::fig wmsa
:::

:::hand Lecture note — the case 56×56, M = 7
With $h=w=56$, $N=3136$; with $7\times7$ windows there are $49$ tokens per window and $3136/49=64$ windows.

The score matrix of global attention has $3136^2=9{,}834{,}496$ entries and that of window attention $64\cdot49^2=153{,}664$, smaller by $N/M^2=64$. With $M$ and $C$ fixed, global attention is $O(N^2)$ and window attention $O(N)$.
:::

**Connections between windows** (slides 28–29, advanced). Attending only inside windows means no information crosses window borders. Swin alternates layers that use windows shifted by $(\lfloor M/2\rfloor,\lfloor M/2\rfloor)$ (shifted windows) so that neighboring windows mix, and between stages it lowers the resolution by patch merging, which concatenates neighboring $2\times2$ tokens ($4C$) and maps them linearly down to $2C$ (a role similar to pooling). The lecture marked this as advanced, so no exercises are given on it.

:::ex Example 8 — Comparing the total cost
With $h=w=56$, $C=96$, and $M=7$, what is the cost of one W-MSA layer, and how does it compare with global MSA?
---
$4NC^2=115{,}605{,}504$ and $2NM^2C=2\cdot3136\cdot49\cdot96=29{,}503{,}488$, so the total is $145{,}108{,}992$. That is about $13.8$ times smaller than the $2{,}003{,}828{,}736$ of global MSA. The attention term alone shrank by $2N^2C/(2NM^2C)=N/M^2=64$, and now the projection term is the larger one.
:::
` },
    },
    probs: [
      { q: R`Writing softmax attention with $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$, what is the output $\hat{\mathbf v}_i$?`,
        choices: [R`$\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j$`, R`$\dfrac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)}$`, R`$\dfrac{\sum_j\mathrm{sim}(\mathbf q_j,\mathbf k_i)\mathbf v_i}{\sum_j\mathrm{sim}(\mathbf q_j,\mathbf k_i)}$`, R`$\max_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j$`],
        sol: R`The denominator of the softmax weight $\alpha_{ij}=e^{s_{ij}}/\sum_le^{s_{il}}$ does not depend on $j$, so it comes out of the sum, leaving the similarity-weighted sum divided by the sum of similarities. Without normalization (the first choice) the weights do not sum to $1$.` },
      { q: R`Two keys have scores $\mathbf q^T\mathbf k_1/\sqrt D=0$ and $\mathbf q^T\mathbf k_2/\sqrt D=\ln4$, and the values are $v_1=10$, $v_2=5$. What is the output of softmax attention?`,
        sol: R`The similarities are $e^0=1$ and $e^{\ln4}=4$, so $\hat v=\frac{10+20}{5}=6$.` },
      { q: R`For self-attention $\hat{\mathbf v}_i=\sum_j\alpha_{ij}\mathbf v_j$, $\alpha_{ij}=\mathrm{softmax}_j(\mathbf q_i^T\mathbf k_j/\sqrt D)$: (1) Show that with $\mathrm{sim}(\mathbf q,\mathbf k)=\exp(\mathbf q^T\mathbf k/\sqrt D)$ we have $\hat{\mathbf v}_i=\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j/\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)$. (2) Show that for any positive function $\mathrm{sim}$ the $\hat{\mathbf v}_i$ of this formula is a convex combination of the $\mathbf v_j$ and $\lVert\hat{\mathbf v}_i\rVert\le\max_j\lVert\mathbf v_j\rVert$. (3) Express in terms of $N$ the cost of storing the matrix $A=\mathrm{softmax}(QK^T/\sqrt D)$ and of computing $AV$.`,
        sol: R`**(1)** With $s_{ij}=\mathbf q_i^T\mathbf k_j/\sqrt D$, $\alpha_{ij}=e^{s_{ij}}/\sum_le^{s_{il}}=\mathrm{sim}(\mathbf q_i,\mathbf k_j)/\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)$. The denominator does not depend on $j$, so $\hat{\mathbf v}_i=\sum_j\alpha_{ij}\mathbf v_j=\frac{\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j}{\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)}$.
**(2)** With $w_j=\mathrm{sim}(\mathbf q_i,\mathbf k_j)/\sum_l\mathrm{sim}(\mathbf q_i,\mathbf k_l)$ we have $w_j>0$ and $\sum_jw_j=1$, so $\hat{\mathbf v}_i=\sum_jw_j\mathbf v_j$ is a convex combination. By the triangle inequality $\lVert\hat{\mathbf v}_i\rVert\le\sum_jw_j\lVert\mathbf v_j\rVert\le\max_j\lVert\mathbf v_j\rVert$.
**(3)** $A$ is $N\times N$, so the memory is $O(N^2)$; $AV$ is $(N\times N)(N\times D_v)$, which takes $N^2D_v$ multiplications, i.e., $O(N^2)$ time.`,
        rubric: R`- (1) State that the denominator does not depend on $j$ and simplify — 4 points
- (2) Positive weights summing to $1$, the triangle inequality — 4 points
- (3) Memory $O(N^2)$ and time $O(N^2)$ — 2 points` },
      { q: R`What is the best reason for using $\phi(x)=\mathrm{ELU}(x)+1$ as the feature map in linear attention?`,
        choices: [R`The values of $\phi$ are always positive, so the similarity $\phi(\mathbf q)^T\phi(\mathbf k)$ is positive`, R`$\phi$ yields a kernel exactly equal to the exponential one`, R`$\phi$ raises the output dimension to $N$`, R`$\phi$ is non-differentiable, which stabilizes training`],
        sol: R`For $x\ge0$, $x+1\ge1$, and for $x<0$, $e^x>0$, so every component is positive and the weights stay positive. It is not the same as the exponential kernel (it is a different similarity, not an approximation), and the dimension is $r$.` },
      { q: R`With $\phi(\mathbf k_1)=(2,0)$, $\phi(\mathbf k_2)=(1,1)$, $\phi(\mathbf k_3)=(0,1)$, values $v=(1,3,5)$ ($d_v=1$), and $\phi(\mathbf q)=(1,1)$, what is the output of linear attention?`,
        sol: R`$S=(2,0)\cdot1+(1,1)\cdot3+(0,1)\cdot5=(5,8)$ and $Z=(3,2)$. The numerator is $\phi(\mathbf q)^TS=13$ and the denominator $\phi(\mathbf q)^TZ=5$, so the output is $13/5=2.6$. Computing directly with the similarities $2,2,1$ also gives $\frac{2+6+5}{5}$.` },
      { q: R`Apply $\phi(x)=\mathrm{ELU}(x)+1$ componentwise to $x=(-1,0,2)$. What is the sum of the components of the result? (An expression is fine.)`,
        sol: R`$\phi(-1)=e^{-1}\approx0.368$, $\phi(0)=0+1=1$, $\phi(2)=3$, so the sum is $4+e^{-1}\approx4.368$.` },
      { q: R`With $N=4096$ and $r=d_v=64$, how many times larger is the number of multiplications $N^2d_v$ for $AV$ in softmax attention than the number $Nrd_v$ for building $S$ in linear attention?`,
        sol: R`$\frac{N^2d_v}{Nrd_v}=\frac Nr=\frac{4096}{64}=64$ times. The ratio grows as $N$ grows.` },
      { q: R`For the attention $\tilde{\mathbf v}_i=\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)\mathbf v_j/\sum_j\mathrm{sim}(\mathbf q_i,\mathbf k_j)$ with the similarity replaced by $\mathrm{sim}(\mathbf q,\mathbf k)=\phi(\mathbf q)^T\phi(\mathbf k)$ ($\phi:\mathbb R^D\to\mathbb R^r$ with positive components): (1) Show that with $S=\sum_j\phi(\mathbf k_j)\mathbf v_j^T$ and $Z=\sum_j\phi(\mathbf k_j)$ we have $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$. (2) Show that computing the outputs for all $i$ costs $O(Nrd_v)$ and needs no $N\times N$ matrix. (3) Show that the similarity matrix before normalization has rank at most $r$.`,
        sol: R`**(1)** Writing the numerator as a row vector, $\sum_j\phi(\mathbf q_i)^T\phi(\mathbf k_j)\mathbf v_j^T=\phi(\mathbf q_i)^T\sum_j\phi(\mathbf k_j)\mathbf v_j^T=\phi(\mathbf q_i)^TS$ (associativity with the scalar $\phi(\mathbf q_i)^T\phi(\mathbf k_j)$, and $\phi(\mathbf q_i)$ does not depend on $j$). The denominator likewise is $\phi(\mathbf q_i)^TZ$. Transposing gives $\tilde{\mathbf v}_i=S^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ$.
**(2)** $S$ is a sum of $N$ outer products of size $r\times d_v$, so $Nrd_v$ multiplications; $Z$ takes $Nr$. Per query, $S^T\phi(\mathbf q_i)$ takes $rd_v$ and $\phi(\mathbf q_i)^TZ$ takes $r$, so $N$ queries take $N(rd_v+r)$. The total is $O(Nrd_v)$, and only $S$ and $Z$ are stored ($O(rd_v)$).
**(3)** The similarity matrix is $\phi(Q)\phi(K)^T$ with $\phi(Q),\phi(K)\in\mathbb R^{N\times r}$, so $\mathrm{rank}\le\min(\mathrm{rank}\,\phi(Q),\mathrm{rank}\,\phi(K))\le r$.`,
        rubric: R`- (1) Pull $\phi(\mathbf q_i)$ out of the sum and write it with $S$, $Z$ — 4 points
- (2) Multiplication counts for $S$, $Z$, and the outputs, and the $O(N)$ conclusion — 4 points
- (3) The rank inequality for a product — 2 points` },
      { q: R`In linear attention where query $i$ sees only keys with $j\le i$, as in a language model, $\tilde{\mathbf v}_i=\sum_{j\le i}\phi(\mathbf q_i)^T\phi(\mathbf k_j)\mathbf v_j/\sum_{j\le i}\phi(\mathbf q_i)^T\phi(\mathbf k_j)$: (1) Show that with $S_i=S_{i-1}+\phi(\mathbf k_i)\mathbf v_i^T$ and $Z_i=Z_{i-1}+\phi(\mathbf k_i)$ ($S_0=0$, $Z_0=\mathbf 0$) we have $\tilde{\mathbf v}_i=S_i^T\phi(\mathbf q_i)/\phi(\mathbf q_i)^TZ_i$. (2) Show that when generating tokens one at a time the cost of one step does not depend on $i$, and compare it with the cost of one step of softmax attention.`,
        sol: R`**(1)** By induction $S_i=\sum_{j\le i}\phi(\mathbf k_j)\mathbf v_j^T$ and $Z_i=\sum_{j\le i}\phi(\mathbf k_j)$; pulling $\phi(\mathbf q_i)^T$ out of the sums as in Section 22.2 gives the formula.
**(2)** At step $i$, updating $S_i$ takes $rd_v$ multiplications, updating $Z_i$ takes $r$, and the output takes $rd_v+r$, so the step is $O(rd_v)$, independent of $i$. In softmax attention the new query must score against all $i$ keys so far, so one step is $O(iD)$ and all keys and values must be stored. Linear attention is an RNN that carries only the state $(S_i,Z_i)$.` },
      { q: R`Over which group does the Transformer's LayerNorm compute the mean and variance?`,
        choices: [R`one feature component gathered over all tokens in the batch`, R`all feature components of one token`, R`all tokens and features of one sentence`, R`every value in the whole batch`],
        sol: R`The Transformer LN computes $\mu$ and $\sigma^2$ over the $C$ (or $d$) features of one token (item ③ of the notes). The first choice corresponds to BN.` },
      { q: R`Apply BN ($\varepsilon=0$, $\gamma=1$, $\beta=0$) to the tensor of the notes ($x^{(1)}$: channel 1 $\{1,3\}$, channel 2 $\{5,7\}$; $x^{(2)}$: channel 1 $\{9,11\}$, channel 2 $\{13,15\}$). What does the value $11$ become? (An expression is fine.)`,
        sol: R`$11$ is in channel 1, so with $\mu_1=6$ and $\sigma_1^2=17$ it becomes $(11-6)/\sqrt{17}=5/\sqrt{17}\approx1.213$.` },
      { q: R`Apply the CNN-style LN (all channels and positions of one sample) to the same tensor. What does the value $9$ become? (An expression is fine.)`,
        sol: R`$9$ is in image 2, whose group $\{9,11,13,15\}$ has $\mu=12$ and $\sigma^2=\frac{9+1+1+9}4=5$, so it becomes $-3/\sqrt5\approx-1.342$.` },
      { q: R`Apply the Transformer LN ($\varepsilon=0$, $\gamma=1$, $\beta=0$) to the three-feature token $\mathbf h=(1,2,6)$. What is the first component? (An expression is fine.)`,
        sol: R`$\mu=3$, the deviations are $(-2,-1,3)$, and $\sigma^2=\frac{4+1+9}3=\frac{14}3$, so the first component is $-2/\sqrt{14/3}\approx-0.926$.` },
      { q: R`Consider the $B=2$, $C=2$, $H=1$, $W=2$ tensor $x^{(1)}$: channel 1 $(a,b)$, channel 2 $(c,d)$; $x^{(2)}$: channel 1 $(e,f)$, channel 2 $(g,h)$ (with $\varepsilon=0$, $\gamma=1$, $\beta=0$). (1) Write which cells BN, the CNN LN, and the Transformer LN each use as one group, and show that within each group the normalized values have mean $0$ and variance $1$. (2) Show that under the Transformer LN a two-feature token $(u,v)$ ($u\ne v$) always becomes $(-1,1)$ or $(1,-1)$. (3) Show that under BN the normalized values of $x^{(1)}$ depend on the values of $x^{(2)}$, and explain why LN does not.`,
        sol: R`**(1)** BN: per channel, $\{a,b,e,f\}$ and $\{c,d,g,h\}$. CNN LN: per sample, $\{a,b,c,d\}$ and $\{e,f,g,h\}$. Transformer LN: per token (position), $(a,c)$, $(b,d)$, $(e,g)$, $(f,h)$. If a group $\{x_1,\dots,x_n\}$ with $\mu$, $\sigma^2$ maps to $y_k=(x_k-\mu)/\sigma$, then $\frac1n\sum y_k=\frac{1}{\sigma}(\frac1n\sum x_k-\mu)=0$ and $\frac1n\sum y_k^2=\frac{1}{\sigma^2}\cdot\frac1n\sum(x_k-\mu)^2=1$.
**(2)** $\mu=\frac{u+v}2$, the deviations are $\pm\frac{u-v}2$, $\sigma^2=\frac{(u-v)^2}4$, and $\sigma=\frac{\lvert u-v\rvert}2$, so the result is $\big(\frac{u-v}{\lvert u-v\rvert},\frac{v-u}{\lvert u-v\rvert}\big)=\pm(1,-1)$.
**(3)** Under BN the normalized value of $a$ is $(a-\mu_1)/\sigma_1$ with $\mu_1=\frac{a+b+e+f}4$, which contains $e$ and $f$, so changing $x^{(2)}$ changes it. The groups of LN lie inside one sample (or one token), so they do not involve other samples.`,
        rubric: R`- (1) The three groups written correctly — 3 points; proof of mean $0$ and variance $1$ — 2 points
- (2) Computing $\mu$, $\sigma$ and the conclusion — 2 points
- (3) BN's batch dependence and LN's independence — 3 points` },
      { q: R`In ViT's equation (4), $\mathbf y=\mathrm{LN}(\mathbf z_L^0)$, what is used for classification?`,
        choices: [R`the average of all patch-token outputs`, R`the output of the last patch token`, R`the output at the class-token position in the last layer`, R`the class token of the first layer`],
        sol: R`The superscript $0$ is the first row, the position of the class token placed in front, and the subscript $L$ is the last layer. LN is applied to this one row and the head is attached to it.` },
      { q: R`How many tokens (including the class token) enter the encoder when a $224\times224$ image is fed to a ViT with $P=16$?`,
        sol: R`$224/16=14$, so $196$ patches plus $1$ class token make $197$ tokens.` },
      { q: R`With $P=16$, $C=3$, and $D=768$, how many parameters does the patch-embedding matrix $E$ have (no bias)?`,
        sol: R`A flattened patch has length $P^2C=768$, so $E\in\mathbb R^{768\times768}$ has $589{,}824$ parameters. This number does not depend on the image size.` },
      { q: R`For a $384\times384$ image with $P=16$ and $D=768$, how many parameters does the position embedding $E_{pos}$ have?`,
        sol: R`There are $24^2=576$ patches, plus the class token, giving $577$ rows, so $577\cdot768=443{,}136$ parameters.` },
      { q: R`For a ViT with an $H\times W\times C$ image, patch size $P$ ($P$ divides $H$ and $W$), dimension $D$, and $L$ layers: (1) Find the shape of $\mathbf z_0$ in equation (1) and the parameter counts of $E$ and $E_{pos}$. (2) Show that equations (2)–(3) do not change the shape, so every $\mathbf z_\ell$ has the same shape (MSA and the MLP output $D$ dimensions per token). (3) Explain why, without the position embedding, reordering the patches does not change $\mathbf y$.`,
        sol: R`**(1)** Each of the $N=HW/P^2$ flattened patches $\mathbf x_p^i\in\mathbb R^{1\times P^2C}$ times $E\in\mathbb R^{(P^2C)\times D}$ is $1\times D$, and with the class token $\mathbf z_0\in\mathbb R^{(N+1)\times D}$. $E$ has $P^2CD$ parameters and $E_{pos}$ has $(N+1)D$.
**(2)** LN normalizes per token and keeps the shape, and the outputs of MSA and the MLP are also $(N+1)\times D$, so the residual additions are defined and $\mathbf z'_\ell,\mathbf z_\ell\in\mathbb R^{(N+1)\times D}$. By induction this holds for every layer.
**(3)** Self-attention, LN, and the MLP are permutation-equivariant: reordering the tokens reorders the outputs the same way. For a permutation $P$ that fixes the class token and shuffles only the patches, $\mathbf z_L$ is shuffled the same way and its first row $\mathbf z_L^0$ does not change. So without $E_{pos}$ the arrangement of the patches cannot be told apart.`,
        rubric: R`- (1) $N=HW/P^2$, the shape of $\mathbf z_0$, and the two parameter counts — 4 points
- (2) Each operation keeps the shape, and induction — 3 points
- (3) Permutation equivariance and the invariance of the class token — 3 points` },
      { q: R`Which statement about $\mathrm{GELU}(x)=x\Phi(x)$ is correct?`,
        choices: [R`It is always $0$ for $x<0$`, R`It is monotonically increasing`, R`It is differentiable everywhere and has a small negative dip on the negative side`, R`$\mathrm{GELU}'(0)=1$`],
        sol: R`$\Phi$ is smooth, so GELU is smooth too, and it has a minimum of about $-0.17$ at $x\approx-0.75$, so it is not monotone. $\mathrm{GELU}'(0)=\Phi(0)=\frac12$.` },
      { q: R`Given $\Phi(1)\approx0.8413$, what is $\mathrm{GELU}(-1)$?`,
        sol: R`$\mathrm{GELU}(-1)=-1\cdot\Phi(-1)=-(1-0.8413)=-0.1587$.` },
      { q: R`What is $\mathrm{GELU}'(0)$?`,
        sol: R`$\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$, so at $x=0$ it is $\Phi(0)=\frac12$.` },
      { q: R`Which statement matches the ViT-versus-CNN comparison of slides 24–26?`,
        choices: [R`ViT's architecture guarantees translation equivariance, so it beats CNNs even on small data`, R`ViT has a weak inductive bias, so it scores below BiT on small data and comes out ahead on large data such as JFT-300M`, R`For fine-tuning at a higher resolution ViT must learn its position embeddings again from scratch`, R`One layer of a CNN sees the whole image`],
        sol: R`ViT has weak assumptions such as locality and translation equivariance, so it has to learn that much from the data. At higher resolution the position embeddings are interpolated in 2D, and one CNN layer sees only as far as its kernel.` },
      { q: R`For $\mathrm{GELU}(x)=x\Phi(x)$: (1) Show that $\mathrm{GELU}'(x)=\Phi(x)+x\varphi(x)$. (2) Show that $\mathrm{GELU}(x)-\mathrm{GELU}(-x)=x$. (3) Show that $\mathrm{GELU}(x)-x\to0$ as $x\to\infty$ and $\mathrm{GELU}(x)\to0$ as $x\to-\infty$. (4) Check that $\mathrm{GELU}'(-1)<0<\mathrm{GELU}'(-\tfrac12)$ and conclude that there is a local minimum in $(-1,-\tfrac12)$ ($\Phi(-1)\approx0.1587$, $\varphi(1)\approx0.2420$, $\Phi(-\tfrac12)\approx0.3085$, $\varphi(\tfrac12)\approx0.3521$).`,
        sol: R`**(1)** The product rule and $\Phi'=\varphi$ give $\Phi(x)+x\varphi(x)$.
**(2)** $\Phi(-x)=1-\Phi(x)$, so $\mathrm{GELU}(-x)=-x(1-\Phi(x))=-x+\mathrm{GELU}(x)$.
**(3)** $x\to\infty$: $\mathrm{GELU}(x)-x=-x(1-\Phi(x))$, and the tail bound $1-\Phi(x)\le\varphi(x)/x$ ($x>0$) gives $\lvert\cdot\rvert\le\varphi(x)\to0$. $x\to-\infty$: $\lvert x\Phi(x)\rvert=\lvert x\rvert\Phi(-\lvert x\rvert)\le\varphi(x)\to0$.
**(4)** $\mathrm{GELU}'(-1)=0.1587-0.2420=-0.0833<0$ and $\mathrm{GELU}'(-\frac12)=0.3085-0.5\cdot0.3521=0.1325>0$. The derivative is continuous, so it vanishes somewhere in between, and since its sign changes from $-$ to $+$ that point is a local minimum (numerically $x\approx-0.752$, value $\approx-0.170$).` },
      { q: R`How many multiplications does the product of a $3\times4$ matrix and a $4\times5$ matrix need?`,
        sol: R`The result has $3\times5=15$ entries and each needs $4$ multiplications, so $60$ (and $3$ additions per entry, $45$ in all).` },
      { q: R`With $N=3136$ and $C=96$, what is the number of multiplications $4NC^2+2N^2C$ in one global self-attention layer? (An expression is fine.)`,
        sol: R`$4NC^2=115{,}605{,}504$ and $2N^2C=1{,}888{,}223{,}232$, so the total is $2{,}003{,}828{,}736\approx2.0\times10^9$.` },
      { q: R`With $C=96$, for what token count $N$ are the two terms $4NC^2$ and $2N^2C$ of self-attention equal?`,
        sol: R`$2N^2C=4NC^2\iff N=2C=192$. With more tokens the attention term is larger; with fewer, the projection term is.` },
      { q: R`For one self-attention layer with $N$ tokens of dimension $C$ ($Q=XW_Q$, $K=XW_K$, $V=XW_V$, $\mathrm{softmax}(QK^T/\sqrt C)V$, an output projection $W_O$, every $W\in\mathbb R^{C\times C}$): (1) Show that the product of $A\in\mathbb R^{m\times k}$ and $B\in\mathbb R^{k\times n}$ takes $mnk$ multiplications. (2) Use this to show that one layer takes $4NC^2+2N^2C$ multiplications (ignoring the softmax and the division). (3) Show that the count is the same when the computation is split into $h$ heads of $C/h$ dimensions each.`,
        sol: R`**(1)** $Y_{ij}=\sum_{l=1}^kA_{il}B_{lj}$ takes $k$ multiplications and there are $mn$ pairs $(i,j)$, so $mnk$.
**(2)** $Q$, $K$, $V$ are each $(N\times C)(C\times C)$, $NC^2$ apiece, $3NC^2$ in total. $QK^T$ is $(N\times C)(C\times N)$, so $N^2C$. $AV$ is $(N\times N)(N\times C)$, so $N^2C$. The output projection is $NC^2$. The sum is $4NC^2+2N^2C$.
**(3)** Per head, $Q_hK_h^T$ is $(N\times\frac Ch)(\frac Ch\times N)$, so $N^2C/h$, and $A_hV_h$ is also $N^2C/h$; adding the $h$ heads gives $2N^2C$. The projections just split the $C\times C$ matrices into per-head columns, so they stay $4NC^2$.`,
        rubric: R`- (1) $mn$ entries with $k$ multiplications each — 2 points
- (2) Shapes and multiplication counts of the four projections and the two attention products — 6 points
- (3) The per-head sum is the same — 2 points` },
      { q: R`How many windows are there when an $h=w=56$ feature map is split into $7\times7$ windows?`,
        sol: R`$N=3136$ and each window holds $49$ tokens, so there are $3136/49=64$ windows ($8\times8$).` },
      { q: R`With $N=3136$, $M=7$, and $C=96$, what is the attention term $2NM^2C$ of window attention?`,
        sol: R`$2\cdot3136\cdot49\cdot96=29{,}503{,}488$, which is $64$ times smaller than the $2N^2C=1{,}888{,}223{,}232$ of global attention.` },
      { q: R`In the second Swin stage ($28\times28$, $C=192$, $M=7$), what is the number of multiplications $4NC^2+2NM^2C$ of one W-MSA layer? (An expression is fine.)`,
        sol: R`$N=784$. $4NC^2=4\cdot784\cdot36864=115{,}605{,}504$, the same as in the first stage (a quarter of the tokens, four times $C^2$), and $2NM^2C=14{,}751{,}744$. The total is $130{,}357{,}248$.` },
      { q: R`For W-MSA, which splits a feature map of $N=hw$ tokens of dimension $C$ into $M\times M$ windows ($M$ divides $h$ and $w$) and runs self-attention only inside each window: (1) Find the number of windows and the attention multiplications per window, and show that the attention term is $2NM^2C$. (2) Show that the cost including the projections, $4NC^2+2NM^2C$, is $O(N)$ with $M$ and $C$ fixed, and that the ratio of the attention terms against global attention is $N/M^2$. (3) Compute both costs for $h=w=56$, $M=7$, $C=96$.`,
        sol: R`**(1)** There are $\frac hM\cdot\frac wM=N/M^2$ windows with $M^2$ tokens each. Inside a window $QK^T$ is $(M^2\times C)(C\times M^2)$, so $M^4C$, and $AV$ is also $M^4C$, giving $2M^4C$ per window. Multiplying, $\frac N{M^2}\cdot2M^4C=2NM^2C$.
**(2)** The projections are the same per token, so $4NC^2$. The sum $4NC^2+2NM^2C=N(4C^2+2M^2C)$ has a bracket independent of $N$, so it is $O(N)$. The ratio is $\frac{2N^2C}{2NM^2C}=\frac N{M^2}$.
**(3)** $N=3136$: global $4NC^2+2N^2C=115{,}605{,}504+1{,}888{,}223{,}232=2{,}003{,}828{,}736$; window $115{,}605{,}504+29{,}503{,}488=145{,}108{,}992$. The attention terms differ by a factor of $64$ and the totals by about $13.8$.`,
        rubric: R`- (1) The number of windows, $2M^4C$ per window, and the product $2NM^2C$ — 4 points
- (2) The $O(N)$ argument and the ratio $N/M^2$ — 3 points
- (3) The numerical computation — 3 points` },
    ],
  };
})();
