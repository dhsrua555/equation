/* English text — 21 Attention & Transformers (W10 Mon slides 35–80). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '입력 벡터들': 'input vectors',
    '질의 벡터': 'query vector',
    '점수': 'scores',
    '가중치 (합 1)': 'weights (sum 1)',
    '같은 입력을 가중 평균에 다시 쓴다': 'the same inputs are reused in the weighted average',
    '어텐션 층의 계산 흐름': 'Computation flow of an attention layer',
    '입력 X에서 투영해 만든다': 'built from the input X by projections',
    '행 하나 = 질의 하나의 가중치 (합 1)': 'one row = the weights of one query (sum 1)',
    '셀프 어텐션의 행렬 모양': 'Matrix shapes of self-attention',
    '점수 + 마스크': 'scores + mask',
    '소프트맥스 뒤의 A': 'A after the softmax',
    '미래 (i > j)의 점수는 −∞': 'scores of the future (i > j) are −∞',
    '미래 (i &gt; j)의 점수는 −∞': 'scores of the future (i &gt; j) are −∞',
    '각 행의 합 = 1, 위쪽 삼각은 0': 'each row sums to 1, the upper triangle is 0',
    '마스크 셀프 어텐션': 'Masked self-attention',
    '블록을 쌓는다': 'stack the block',
    '위치 부호화': 'positional encoding',
    '입력 토큰 x (n×d)': 'input tokens x (n×d)',
    '트랜스포머 인코더 블록': 'Transformer encoder block',
  });
  Object.assign(EM.en.figText, {
    "지름길: 매 칸의 입력에 이미지 특성 v를 더한다": "Shortcut: the image feature v is added to the input of every cell",
    "첫 단어 방식: 이미지 특성 v는 첫 칸에만 들어간다": "First-word method: the image feature v enters only the first cell",
    "이미지": "image",
    "v → 칸 t: 거리 1": "v → cell t: distance 1",
    "v → 칸 t: t걸음": "v → cell t: t steps",
    "이미지 조건화: 첫 단어와 지름길": "Image conditioning: first word and shortcut",
    "특성 지도 x": "feature map x",
    "어텐션 α": "attention α",
    "합 1": "sum 1",
    ": 다음 걸음의 질의": ": the query of the next step",
    "걸음 t마다 반복": "repeated every step t",
    "어텐션 캡셔닝의 걸음": "One step of attention captioning",
    "소프트": "soft",
    "(가중 평균)": "(weighted)",
    "하드": "hard",
    "(한 칸 선택)": "(picks one cell)",
    "균일": "uniform",
    "칸이 진할수록 큰 가중치. 소프트는 합이 1인 가중치로 모든 칸을 섞고,": "Darker cells have larger weights. Soft mixes all cells with weights that sum to 1;",
    "하드는 한 칸만 고른다": "hard picks a single cell",
    "소프트와 하드 어텐션 지도": "Soft and hard attention maps",
    "특성 지도": "feature map",
    "w (0~1, 독립)": "w (0 to 1, independent)",
    "전역 평균 풀링": "global avg. pool",
    "FC · 시그모이드": "FC · sigmoid",
    "채널마다 × w": "per channel × w",
    "그대로 지나가는 U": "U passes through unchanged",
    "스퀴즈-익사이트 블록": "Squeeze-and-excitation block",
    "점군": "point cloud",
    "소리": "audio",
    "언어": "language",
    "물체": "objects",
    "움직임": "motion",
    "의미": "semantics",
    "깊이": "depth",
    "단일 모델": "single model",
    "어텐션": "attention",
    "자료 형태를 가정하지 않는다": "assumes no data form",
    "하나의 모델로 여러 자료와 과제": "One model for many data types and tasks",
    "입력 x": "input x",
    "키 k | 값 v": "key k | value v",
    "질의 q": "query q",
    "A (행마다 합 1)": "A (each row sums to 1)",
    "출력 y": "output y",
    "질의 q는 밖에서 오고(교차), 입력 x에서 만들면 셀프 어텐션": "q comes from outside (cross); made from the input x it is self-attention",
    "질의가 여러 개인 교차 어텐션": "Cross-attention with several queries",
    "이진수: 비트마다 주기가 2배": "Binary: each bit doubles the period",
    "비트": "bit",
    "위치 t": "position t",
    "사인 부호화 p(t), d=16 (위: 빠른 쌍)": "Sinusoidal encoding p(t), d=16 (top: fast pairs)",
    "차원": "dim",
    "쌍 번호가 클수록 느리게 변하고, 위치마다 벡터 전체가 다르다": "Higher pair numbers change more slowly; each position has a different vector",
    "위치 부호화": "positional encoding",
    "Mask (선택)": "Mask (optional)",
    "스케일 점곱 어텐션": "Scaled dot-product attention",
    "스케일 점곱": "scaled dot-product",
    "멀티헤드 어텐션": "Multi-head attention",
    "스케일 점곱 어텐션과 멀티헤드": "Scaled dot-product attention and multi-head",
    "채널마다 (N, H, W)를 모은다": "collects (N, H, W) per channel",
    "샘플마다 (C, H, W)를 모은다": "collects (C, H, W) per sample",
    "LN (트랜스포머)": "LN (Transformer)",
    "토큰마다 C만 모은다": "collects only C per token",
    "정규화하는 축: BN과 LN": "Normalization axes: BN and LN",
  });
  Object.assign(EM.en.fig, {
    capcond: R`Two ways of conditioning on the image (slides 36–41). Top: the image feature $\mathbf v$ is fed to the LSTM once as the "first word", so the path from $\mathbf v$ gets longer for later cells. Bottom: the same $\mathbf v$ is connected to the input of every cell (shortcut), so the dependency distance is $1$. Above each cell is the next word produced by the softmax; below it is the input word.`,
    capattn: R`One step of soft-attention captioning (slides 47–51). From the feature map $\mathbf x$ and the previous hidden state $\mathbf h_{t-1}$, $f_{att}$ gives a score per cell and a softmax makes the attention $\alpha^{(t)}$ with sum $1$. The summary $\mathbf z^{(t)}$, $\mathbf x$ weighted by $\alpha^{(t)}$ and summed, enters the LSTM together with the word embedding $W_{emb}\mathbf y_t$, and the output $\mathbf h_t$ becomes the query of the next step. The darkness of a cell is its weight.`,
    attnmaps: R`Attention maps of soft and hard attention (slides 42, 53), redrawn as a simplified $7\times7$ grid (made-up values, not the real maps over a photo). "Uniform" at the left is the case without attention (all cells equal). Soft attention moves its weight distribution to a different place for each word (bird, flying, over, body, water); hard attention picks one cell from the same distribution and uses that cell's feature as it is.`,
    senet: R`The squeeze-and-excitation (SE) block (slide 54). Global average pooling reduces the feature map $U$ to one number per channel, $\mathbf s\in\mathbb R^C$ (squeeze); a bottleneck MLP ($C\to C/r\to C$) and a sigmoid make a per-channel weight $\mathbf w$ (excitation); then channel $c$ of the original $U$ is multiplied by $w_c$ (scale), giving $\tilde U$ of the same size. The values of $\mathbf w$ need not sum to $1$ (the shades of the bar cells are made-up values).`,
    onemodel: R`The goal of a versatile model (slide 61): several kinds of data (image, point cloud, audio, language) go into one network that gives several outputs (objects, motion, semantic segmentation, depth). The requirement is to treat the input as a set of vectors without assuming a grid or a chain, and attention is such an operation.`,
    crossattn: R`A general attention layer with $M$ queries and separate keys and values (slides 66–67). From the input $\mathbf x_i$ make the key $\mathbf k_i=\mathbf x_iW_k$ and the value $\mathbf v_i=\mathbf x_iW_v$; for each query $\mathbf q_j$ the scores $e_{j,i}=\mathbf q_j\cdot\mathbf k_i/\sqrt D$ form a row, the row-wise softmax gives $A$, and the output is $\mathbf y_j=\sum_ia_{j,i}\mathbf v_i$. If the queries are made from the same input, $\mathbf q=\mathbf xW_q$, this is self-attention.`,
    posenc: R`Positional encoding (slides 69, 77). Top left: the 4-bit binary numbers $0$–$15$; the lower bits flip faster and the period doubles with each bit to the left. Top right: the values of $\mathbf p(t)=(\sin\omega_kt,\cos\omega_kt)_k$ for $d=16$ computed for $t=0,\dots,31$ (blue $+$, brown $-$); upper pairs are faster. Bottom: the curves $\sin\omega_kt$ of three pairs $k=0,1,2$ with $\omega_k=1,\ 1/3.16,\ 1/10$, so the period grows.`,
    mha: R`Scaled dot-product attention and multi-head attention (slide 71, redrawn from the figure in Vaswani et al.). Left: $QK^T$ (MatMul) → Scale ($\div\sqrt{D_k}$) → Mask (optional) → SoftMax → MatMul with $V$. Right: $V,K,Q$ each pass through a per-head Linear layer (projection), the attention on the left runs $h$ times in parallel, and the head outputs are concatenated and fed to the last Linear layer ($W_o$).`,
    lncube: R`The cells over which the normalization statistics are collected (blue) drawn on a box of shape $N\times C\times(H,W$ or Seq\_len$)$ (slide 79). BN collects all samples and positions of one channel, LN in a CNN collects all channels and positions of one sample, and LN in a Transformer collects only all channels of one token of one sample.`,
    attnflow: R`The computation flow of the general attention layer (slides 64–65). For each input vector $\mathbf x_i$, the score against the query $\mathbf h$ is $e_i=\mathbf h\cdot\mathbf x_i/\sqrt D$ (alignment); a softmax turns the scores into weights $a_i$ that sum to $1$; and the sum of the same inputs $\mathbf x_i$ weighted by $a_i$ (mul + add) is the context vector $\mathbf c$ (dashed).`,
    attnshape: R`The shapes of self-attention (slides 63, 68). $Q,K,V$ are built from the input $X$, and the row-wise softmax of $QK^T/\sqrt{D_k}$ gives $A\in\mathbb R^{N\times N}$, which mixes $V$ into $Y=AV$. One row of $A$ (the shaded strip) holds the weights one query gives to the $N$ values and sums to $1$. The number of output rows equals the number of queries $N$.`,
    maskmat: R`Masked self-attention (slide 70). Row $j$ is query $j$ and column $i$ is key $i$. Hiding the future entries $i>j$ with $-\infty$ (left) makes their weights $e^{-\infty}=0$ after the softmax, so $A$ is lower triangular (right); the diagonal stays, so each row sums to $1$. The first row gives weight $1$ to itself.`,
    encblock: R`The Transformer encoder block (slides 72–77). The input tokens are embedded and the positional encoding is added; then the skip connection is added to multi-head attention and LayerNorm is applied ($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{Attn})$), and the position-wise FF with its skip connection and LayerNorm follows ($\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{FF})$). The block inside the dashed frame has input and output of the same size $n\times d$, so it can be stacked $N$ times.`,
  });
  EM.en.ch[21] = {
    title: 'Attention and Transformers',
    fig: R`The softmax weights of 16 keys sorted in decreasing order: without dividing the scores by √D (thin lines, dimensions D = 4, 16, 64, 256) the weights pile onto one key as D grows, whereas with the division (bold line) they stay spread out`,
    tagline: R`Attention is the operation in which one query scans the whole input and brings back as much of each part as it needs. The choice of which part of the picture to look at in captioning generalizes to the softmax of the score $q\cdot k/\sqrt D$, and stacking keys, values, and queries, positional encoding, masks, multiple heads, residual connections, and layer normalization gives the Transformer encoder.`,
    summary: R`The captioning of Unit 20 fed the image features into the LSTM only once at the start, so the model forgot the picture as the sentence grew. We repair this first with a **shortcut** at every step and then with **soft attention**. A score $e_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1})$ is computed at each position of the $14\times14$ feature map, a softmax gives weights $\alpha$ that sum to 1, and $\mathbf z=\sum\alpha\mathbf x$ summarizes the image. Channel attention (SENet) uses per-channel weights that need not sum to 1. In terms of inductive bias, a CNN assumes a 2D grid and translation invariance and an RNN a 1D chain; to let one model handle many kinds of data these assumptions must be weakened, and attention is the answer. The general attention layer is $e_i=\mathbf h\cdot\mathbf x_i/\sqrt D$, $\mathbf a=\mathrm{softmax}(\mathbf e)$, $\mathbf c=\sum a_i\mathbf x_i$, and the division by $\sqrt D$ keeps scores of variance $D$ from saturating the softmax. Building keys, values, and queries from the input gives **self-attention** $\mathrm{softmax}(QK^T/\sqrt{D_k})V$; it is permutation equivariant and so does not know the order, which is why we add a **positional encoding** (sines and cosines), and language models use a **mask** that sets the future to $-\infty$. Running several heads in parallel gives **multi-head** attention, and an **encoder block** combines it with residual connections, **layer normalization**, and a position-wise FF; stacking $N$ blocks gives the Transformer encoder.`,
    goals: [
      R`Compare the three ways of conditioning on the image in captioning (first word, shortcut, attention), and explain through a product of gradients why the image's influence fades in the first-word method`,
      R`Compute the soft attention $\mathbf z^{(t)}=\sum_{i,j}\alpha^{(t)}_{i,j}\mathbf x_{i,j}$, derive $\partial\mathbf z/\partial e_m=\alpha_m(\mathbf x_m-\mathbf z)$, and show that the expectation of hard attention is soft attention`,
      R`Write the computation and the parameter count of channel attention (SENet), distinguish it from spatial attention by whether the weights must sum to 1, and explain inductive bias through CNNs and RNNs`,
      R`Write the formula of the general attention layer, derive $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$, and show why we divide by $\sqrt D$ and how the gradient vanishes when the softmax saturates`,
      R`Compute the shapes of keys, values, and queries in cross- and self-attention, and prove the permutation equivariance $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$ and the cost $O(N^2d)$`,
      R`Show that the sinusoidal positional encoding satisfies the rotation $PE(t+\Delta)=R(\Delta)PE(t)$ for relative positions, and prove that in masked attention the weights of the future are $0$ and each row sums to $1$`,
      R`Derive the multi-head parameter count $4D^2$ and cost, compute the formula, shapes, and parameter count $12d^2$ of the encoder block, and compare the properties of layer normalization with BN`,
    ],
    secTitles: { '21.1': 'Image conditioning', '21.2': 'Spatial attention', '21.3': 'Channels · inductive bias', '21.4': 'Scaled dot product', '21.5': 'Self · cross', '21.6': 'Position · mask', '21.7': 'Multi-head · encoder', '21.8': 'Layer norm · cost' },
    secs: {
      '21.1': { title: 'Image Conditioning: From Once at the Start to Every Step', body: R`
:::idea In plain words
If the captioning model looks at the picture only once, at the moment it starts the sentence, its memory of the picture fades as the sentence grows. The model then stops looking at the picture and composes a plausible sentence from the previous words alone (“A man …” is always followed by “is standing”). Showing the picture again at every word reduces this problem, and attention goes one step further and also decides which part of the picture to look at.
:::

**Naive captioning** (slides 35–39). The structure is the same as in Unit 20[[ch20:20.5|Captioning with a CNN encoder + RNN decoder.]]. The image $\mathbf x$ goes through a pretrained CNN $g_\phi$ and the feature vector just before the classification layer is taken out (the FC layer's $1\times1\times4096$ for the VGG16 of slide 35, $1\times1\times2048$ in the following figure). A Linear layer matches this vector to the LSTM's input size and it is fed to the LSTM as the “first word”; then $\langle\mathrm{sos}\rangle$, Man, … are fed in and the LSTM emits the words one slot at a time. Training uses (image, sentence) pairs and adds the cross-entropy of every slot (slide 39): $\sum_{t=1}^T\mathcal L(\hat{\mathbf y}_t,\mathbf y_t)$. This is the same as training sentence generation[[ch20:20.4|The cross-entropy per slot and teacher forcing.]].

**The practical problem** (slide 40). The slide asks you to guess the next word after “$\langle\mathrm{sos}\rangle$ A Man ?”. If the RNN is strong enough it can produce a plausible sentence from the previous words alone, without the image, and the previous word in particular affects the next word more directly (because its **dependency distance** is short). For captioning to be conditioned on the content of the image, the conditioning on the image must be **strengthened**.

**Shortcut** (slide 41). Connect the image features to the input of **every step** rather than to the first input only. The advantage is that the dependency distance from the image to each slot shrinks to $1$; the disadvantage is that the model can still ignore the image condition.

:::key Three ways of conditioning on the image
With the image feature $\mathbf v=W_vg_\phi(\mathbf x)$ and the word embedding $W_{emb}\mathbf y_t$,
$$\text{first word:}\ \ \mathbf h_{-1}\!\leftarrow\!\mathrm{LSTM}(\mathbf 0,\mathbf v),\ \ \mathbf h_t=\mathrm{LSTM}(\mathbf h_{t-1},W_{emb}\mathbf y_t)$$
$$\text{shortcut:}\ \ \mathbf h_t=\mathrm{LSTM}(\mathbf h_{t-1},W_{emb}\mathbf y_t,\ \mathbf v)$$
$$\text{attention:}\ \ \mathbf h_t=\mathrm{LSTM}(\mathbf h_{t-1},W_{emb}\mathbf y_t,\ \mathbf z^{(t)}),\quad\mathbf z^{(t)}=\text{an image summary that differs at every step (21.2)}$$
:::

:::fig capcond
:::

The third puts a summary $\mathbf z^{(t)}$ made anew at every step in the place of $\mathbf v$. It summarizes “the part related to the word about to be written”, so on top of the dependency distance $1$ of the shortcut it also chooses what to look at.

:::ex Example 1 — the size of the conditioning layer
The feature vector is $2048$-dimensional and the LSTM's input (embedding) size is $512$. How many parameters does the Linear layer (with bias) that fits the feature to the LSTM have?
---
$2048\cdot512+512=1{,}048{,}576+512=1{,}049{,}088$ parameters. This layer is used only once per image, but in the first-word method its output has to flow into all later slots.
:::

### Going deeper

**Quantifying “dependency distance”.** In the first-word method there is only one path along which the hidden state at step $t$ depends on the image feature, and the gradient passes through $t$ Jacobian factors. For a vanilla RNN the norm is bounded by $\lVert W_h\rVert^t$[[ch19:19.6|Vanishing gradients.]]. In the shortcut method $\mathbf v$ enters the input of step $t$ directly, so a separate path of length $1$ appears. This comparison is derived in this unit's exercises.
` },
      '21.2': { title: 'Spatial Soft Attention and Hard Attention', body: R`
:::idea In plain words
In “A bird flying over a body of water.”, when writing bird you should look where the bird is, and when writing water you should look at the water. Attention divides the picture into $14\times14$ cells and gives each cell a **nonnegative weight**, making them add up to $1$. The average of the cells' features mixed with these weights is “the picture seen while writing this word”, and the weights are computed anew for every word.
:::

**What soft attention is** (slide 42). Having no attention (No attention) is the same as uniform attention, which gives every cell the same weight, and soft attention conditions the prediction of a word on a **part** of the image.

**Definition of attention** (slides 43–46). In captioning we use the conv5 output of the CNN, $\mathbf x\in\mathbb R^{14\times14\times512}$. There are $14\cdot14=196$ positions, and each position has a $C=512$-dimensional vector $\mathbf x_{i,j}$. The attention $\alpha^{(t)}\in\mathbb R^{W\times H}$ when writing word $t$ is a **positive matrix** with the same spatial size as the feature map and $\sum_{i,j}\alpha^{(t)}_{i,j}=1$. With it the image features are summarized into one vector.
$$\mathbf z^{(t)}=\sum_{i,j}\alpha^{(t)}_{i,j}\,\mathbf x_{i,j}\in\mathbb R^C$$
The two questions left by slides 45–46 are “how is the attention computed?” and “how is it used for predicting the word?”.

Which layer the image feature is taken from separates the two settings (slides 35–36, 43).

| Layer taken from | Shape | How it holds the image |
|---|---|---|
| FC layer (just before the classifier) | $1\times1\times4096$ (the later figures use $1\times1\times2048$) | the whole image is one vector; no position information |
| conv5 layer | $14\times14\times512$ | one $512$-dimensional vector at each of $196$ positions; a weight can be given per position |

**Computation** (slides 47–49). The LSTM's previous hidden state $\mathbf h_{t-1}$ expresses “what is needed now”. An attention module $f_{att}$ takes the features $\mathbf x$ and $\mathbf h_{t-1}$ and outputs a **score** $e^{(t)}_{i,j}$ at each position, and a softmax over all positions makes the weights.
$$e^{(t)}_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1}),\qquad\alpha^{(t)}_{i,j}=\frac{\exp(e^{(t)}_{i,j})}{\sum_{i',j'}\exp(e^{(t)}_{i',j'})}$$

**Use** (slides 50–51). The summary $\mathbf z^{(t)}$ is fed as an additional input of the LSTM (Modified LSTM) and is also added at the output stage.

:::fig capattn
:::

:::key Soft-attention captioning
$$e^{(t)}_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1}),\quad\alpha^{(t)}=\mathrm{softmax}(e^{(t)}),\quad\mathbf z^{(t)}=\sum_{i,j}\alpha^{(t)}_{i,j}\mathbf x_{i,j}$$
$$\mathbf h^{(t)}=\mathrm{LSTM}\big(\mathbf h_{t-1},\,W_{emb}\mathbf y_t,\,\mathbf z^{(t)}\big),\qquad\hat{\mathbf y}_{t+1}=\mathrm{softmax}\big(W^o(W_{emb}\mathbf y_t+W^h\mathbf h_t+W^z\mathbf z_t)\big)$$
Since $\alpha_{i,j}>0$ and $\sum\alpha=1$, $\mathbf z$ is a **convex combination** of the feature vectors.
:::

The slides do not fix the inside of $f_{att}$. A common example (outside the slides) is a small MLP $e_{i,j}=\mathbf w^T\tanh(W_x\mathbf x_{i,j}+W_h\mathbf h_{t-1})$, and the dot product of Section 21.4 is another choice. The output formula is written on the slide only as $\exp(\cdots)$, which we read as a softmax with the normalizing constant omitted.

**Hard attention** (slide 53). Soft attention takes a weighted average of all cells, but **hard attention** picks a single cell. Draw $s_t\sim\mathrm{Categorical}(\alpha^{(t)})$ and set $\mathbf z^{(t)}=\mathbf x_{s_t}$, and the picture appears as a single point (the lower row of the slide). Soft attention is the **expectation** of this choice, $\mathbb E[\mathbf x_{s_t}]=\sum\alpha\mathbf x$, and is trained by ordinary backpropagation, whereas for hard attention the operation of picking a cell is not differentiable and other training techniques are needed (outside the slides).

:::fig attnmaps
:::

:::ex Example 2 — a weighted average over three cells
The features of three cells are $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$, $\mathbf x_3=(1,1)$ and the scores are $e=(0,\ln3,0)$. What are $\alpha$ and $\mathbf z$?
---
$e^e=(1,3,1)$ with sum $5$, so $\alpha=(\frac15,\frac35,\frac15)$. $\mathbf z=\frac15(1,0)+\frac35(0,1)+\frac15(1,1)=(\frac25,\frac45)$. It is an average tilted toward $\mathbf x_2$, the cell with the largest score.
:::

:::warn The two meanings of “attention” in this unit
The attention of captioning is **one special case**, with a single query $\mathbf h_{t-1}$ and a $14\times14$ feature map as input. The general attention layer of Section 21.4 replaces the score function $f_{att}$ with a dot product and allows several queries; the captioning case is cross-attention with $M=1$ query and the features $\mathbf x$ as both keys and values.
:::
` },
      '21.3': { title: 'Channel Attention and Inductive Bias', body: R`
:::idea In plain words
Soft attention chose “which positions” to look at. Channel attention chooses “which filter responses” to amplify. Global pooling summarizes each channel into one number, a small neural network turns these into per-channel weights, and these are multiplied back onto the original feature map. The weights need not sum to $1$, as in positional attention; like the volume knobs of the channels, they are independent.
:::

**Channel attention: SENet** (slide 54). The Squeeze-and-Excitation Net reweights a feature map $U\in\mathbb R^{H\times W\times C}$ in three steps. The slide's memo says “get per-channel weights by global pooling and multiply them back onto the original dimensions”, and next to the figure it is written that “here the attention need not sum to $1$”.

:::key The squeeze-and-excitation block
$$s_c=\frac1{HW}\sum_{i,j}U_{i,j,c},\qquad\mathbf w=\sigma\big(W_2\,\mathrm{ReLU}(W_1\mathbf s)\big),\qquad\tilde U_{:,:,c}=w_c\,U_{:,:,c}$$
$W_1\in\mathbb R^{(C/r)\times C}$, $W_2\in\mathbb R^{C\times(C/r)}$ ($r$: reduction ratio). Without biases there are $2C^2/r$ parameters. The weights $w_c\in(0,1)$ are independent for each channel.
:::

:::fig senet
:::

The three steps are squeeze (global average pooling, $H\times W\times C\to C$), excitation (a bottleneck MLP and a sigmoid, $C\to C/r\to C$), and scale (a per-channel product). The reduction ratio $r$ and the formulas are from the SENet paper. The ANTBlock (a mobile network) at the bottom of the slide is an example that puts the same idea inside a residual block.

| | Spatial soft attention | Channel attention (SENet) |
|---|---|---|
| Shape of the weights | $H\times W$ (per position) | $C$ (per channel) |
| Normalization | softmax, sum $1$ | sigmoid, independent |
| What it does | mixes positions into a **summary** ($\mathbf z$) | **reweights** the feature map (same size) |

**Inductive bias** (slides 55–61). The networks learned so far are the MLP (linear layers + nonlinearity), the CNN (convolution + pooling + nonlinearity + MLP), and the RNN (an MLP for recurrence + gates), and now **attention and the Transformer** (dot-product attention + MLP) are added (slide 55). Slide 56 asks “why do models differ across data and tasks? what happens if we change the combination (a CNN on permutations, an RNN on images, an MLP on vectors and images)?”. The answer is **inductive bias**.

:::key Inductive bias
**Inductive bias** is the **set of assumptions** a learner uses when predicting outputs for **inputs it has not seen** (slide 57).
- CNN: the **2D grid structure** of the data and **translation invariance** (relying on locality)[[ch15:15.6|Translation equivariance of convolution.]].
- RNN: exploits the **1D chain structure** of the data and the **first-order Markov assumption** (the next state depends on the previous state)[[ch19:19.2|A recurrence that shares the same weights over time.]].
:::

Such assumptions are useful for designing efficient models, but the problem is that they **do not generalize to other forms of data** (slide 60). The last slide, 61, aims at a **general-purpose model** that feeds images, point clouds, sound, and language into one neural network to output objects, motion, meaning, and depth, and asks “what is the most important requirement for this?”, without writing the answer. The answer suggested by the flow of the following slides is “an operation that assumes nothing about the form of the data”, that is, attention, which sees the input only as a **collection of vectors** and mixes them with one another by scores[[@med:ch11:9.1|Inductive bias and invariance.]].

Slides 55 and 60 collected into one table (the last column summarizes the flow of the slides).

| Model | Composition (slide 55) | Assumption about the data | Data it suits |
|---|---|---|---|
| MLP | linear layer + nonlinearity | almost none (a separate weight per input component) | fixed-size vectors |
| CNN | convolution + pooling + nonlinearity + MLP | 2D grid, locality, translation invariance | images |
| RNN | MLP for the recurrence + gates | 1D chain, first-order Markov | sequences |
| Attention / Transformer | dot-product attention + MLP | the input is just a "set of vectors" (no grid or order assumed) | many forms (order is added by positional encoding) |

:::fig onemodel
:::

:::ex Example 3 — the size of an SE block
How many parameters (without biases) does an SE block with $C=64$ and reduction ratio $r=16$ have? What is the length of the vector after global pooling?
---
$W_1$ has $4\times64=256$ and $W_2$ has $64\times4=256$, for a total of $512=2C^2/r$. After global pooling the length is $64$, equal to the number of channels. Compared with a single convolution having $64\cdot64\cdot9\approx37\text{k}$ parameters, this is a very small burden.
:::
` },
      '21.4': { title: 'The General Attention Layer and the Scaled Dot Product', body: R`
:::idea In plain words
Attention is “a weighted average that scans the list of inputs with one query and brings back as much as is relevant”. How alike the query and each input are (the score) is turned into a weight by a softmax, and the inputs are mixed with these weights. We use the dot product $\mathbf h\cdot\mathbf x_i$ as the score, but the longer the vectors, the larger the dot product and the more the softmax piles onto one place, so we divide by $\sqrt D$.
:::

**The general attention layer** (slide 64). It takes input vectors $\mathbf x$ (shape $N\times D$) and a query $\mathbf h$ (shape $D$) and goes through three steps. **Alignment**: $e_i=f_{att}(\mathbf h,\mathbf x_i)$. **Attention**: $\mathbf a=\mathrm{softmax}(\mathbf e)$. **Output**: $\mathbf c=\sum_ia_i\mathbf x_i$ (the context vector, shape $D$). The slide stresses that this operation is **permutation invariant**. It does not care about the order of the inputs, so the $H\times W$ of a feature map can be flattened into $N=HW$ vectors and fed in. The captioning attention of Section 21.2 is exactly this layer.

**Scaled dot product** (slide 65). The score function is replaced by a dot product with its size adjusted.

:::key Scaled dot-product attention
$$e_i=\frac{\mathbf h\cdot\mathbf x_i}{\sqrt D},\qquad\mathbf a=\mathrm{softmax}(\mathbf e),\qquad\mathbf c=\sum_{i=1}^Na_i\mathbf x_i$$
With $M$ queries (slide 66, $Q\in\mathbb R^{M\times D}$), $e_{i,j}=\mathbf q_j\cdot\mathbf x_i/\sqrt D$, and the softmax is taken over the inputs for each query, $\mathbf y_j=\sum_ia_{i,j}\mathbf x_i$:
$$E=\frac{QX^T}{\sqrt D}\in\mathbb R^{M\times N},\qquad A=\mathrm{softmax}_{\text{row}}(E),\qquad Y=AX\in\mathbb R^{M\times D}$$
Row $j$ is query $j$, and the slide's $e_{i,j}$ is $E_{ji}$. If the components of $\mathbf q\cdot\mathbf k$ are independent with mean $0$ and variance $1$, then $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$.
:::

**Why $\sqrt D$** (the explanation on slide 65). (1) The larger the dimension, the more terms are added in the dot-product sum, so the **variance of the logits grows**. (2) Vectors of large magnitude produce far larger logits. (3) Then the distribution after the softmax has low entropy and piles onto one place, giving almost no weight to the rest. (4) As a result the gradient vanishes. So we divide by $\sqrt D$ to reduce the effect of large vectors. That the variance is exactly $D$ is in this unit's proofs, and there one also sees that the gradient goes to $0$ when the softmax saturates.

:::fig attnflow
:::

:::warn The notation is mixed
The same scale factor is written differently on different slides. Slide 62 has $\sqrt{d_k}$, 63 has $\sqrt d$, and 65–67 have $\sqrt D$. All of them refer to the **dimension of the queries and keys**. This unit writes $D$ when the queries, keys, and inputs all have $D$ dimensions, and $D_k$ when the dimension after projection differs.
:::

:::ex Example 4 — the effect of the scaling
For $\mathbf q,\mathbf k$ with independent components (mean $0$, variance $1$) and $D=64$, what is the standard deviation of $\mathbf q\cdot\mathbf k$? If the score gap between two keys was $8$ before dividing by $\sqrt D$, what are the two keys' weights after dividing?
---
The variance is $D=64$, so the standard deviation is $8$, and dividing by $\sqrt D=8$ makes the variance $1$. A score gap of $8\to1$ gives the larger one the weight $\frac1{1+e^{-1}}\approx0.73$ and the smaller one $0.27$. Without dividing it would be $\frac1{1+e^{-8}}\approx0.9997$, leaving almost only one key.
:::

### Going deeper

**Reading it as a temperature.** $\mathrm{softmax}(\mathbf e/\sqrt D)$ is a softmax with temperature $T=\sqrt D$. The curves on the unit's cover are exactly this: the softmax of the same scores multiplied by $\sqrt D$ (thin lines) piles onto one key as $D$ grows, while the original scale (bold line) stays spread out.

**Permutation invariance.** The output of the general attention layer does not change when the order of the inputs changes. Reordering only moves the terms of $\sum_ia_i\mathbf x_i$ along with their pairs $(a_i,\mathbf x_i)$, and a sum does not depend on the order. In a layer with several queries, the order of the outputs moves along with the queries, which is **equivariance** (Section 21.5).
` },
      '21.5': { title: 'Keys, Values, Queries; Cross-Attention and Self-Attention', body: R`
:::idea In plain words
The general attention layer uses the input $\mathbf x_i$ as the **same vector** both for computing scores and for the content that is mixed (slide 67). Using the library analogy, it is better to keep “the index used to check whether something matches the search words” separate from “the content actually fetched”. Attaching different linear layers to the input gives the **key** $\mathbf k=\mathbf xW_k$ (the index) and the **value** $\mathbf v=\mathbf xW_v$ (the content), and the query is the search term. If the query is also made from the same input, the inputs look each other up: **self-attention**.
:::

**Cross-attention** (slide 67). From the input $\mathbf x$ (shape $N\times D$) we make the key $\mathbf k=\mathbf xW_k$ ($D_k$-dimensional) and the value $\mathbf v=\mathbf xW_v$ ($D_v$-dimensional), and the query $\mathbf q$ (shape $M\times D_k$) comes from **outside**. The alignment is $e_{i,j}=\mathbf q_j\cdot\mathbf k_i/\sqrt D$, the attention is $\mathbf a=\mathrm{softmax}(\mathbf e)$, and the output is $\mathbf y_j=\sum_ia_{i,j}\mathbf v_i$ (shape $D_v$). Thanks to the linear layers for keys and values the input and output dimensions may differ, and, as the slide explains, attaching different FC layers to the scoring and mixing steps **adds expressive power**. The decoder of captioning or translation looking at the encoder's output is exactly this[[ch20:20.5|Relieving the bottleneck of the encoder–decoder.]].

:::fig crossattn
:::

**Self-attention** (slides 63, 68). The query is also made from the same input: $\mathbf q=\mathbf xW_q$.
$$\mathrm{Attn}(\mathbf xW_q,\mathbf xW_k,\mathbf xW_v)=\mathrm{softmax}\Big(\frac{\mathbf xW_q(\mathbf xW_k)^T}{\sqrt{d}}\Big)\mathbf xW_v,\qquad\mathbf x\in\mathbb R^{n\times d},\ A\in\mathbb R^{n\times n}$$
The output is a **contextual encoding** of the input, and the receptive field of a single layer is the **entire** input. The conclusion of slide 68 is that this layer is **permutation equivariant**.

:::key Shapes and cost of self-attention
$X\in\mathbb R^{N\times D}$, $W_q,W_k\in\mathbb R^{D\times D_k}$, $W_v\in\mathbb R^{D\times D_v}$:
$$Q=XW_q,\ K=XW_k,\ V=XW_v,\qquad A=\mathrm{softmax}\Big(\frac{QK^T}{\sqrt{D_k}}\Big)\in\mathbb R^{N\times N},\qquad Y=AV\in\mathbb R^{N\times D_v}$$
There are $D(2D_k+D_v)$ parameters (without biases). The number of multiplications is $ND(2D_k+D_v)+N^2(D_k+D_v)$, and the memory of $A$ is $N^2$. If $D_k=D_v=d$ the cost is $O(N^2d+Nd^2)$, that is, $O(N^2d)$ for the attention part.
:::

:::fig attnshape
:::

:::key Permutation equivariance of self-attention
If $P$ is a permutation matrix then $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$. That is, permuting the input just permutes the output in the same way. So without positional information it cannot tell “A looks at B” from “B looks at A” (Section 21.6).
:::

**Relation to captioning.** The attention of Section 21.2 is cross-attention with $M=1$ (the query $\mathbf h_{t-1}$) and the feature map $\mathbf x$ as both keys and values, where only the score function was an MLP[[@med:ch15:12.1b|Self-attention and QKV.]].

:::ex Example 5 — counting shapes and parameters
For a self-attention layer (without biases) with $N=10$, $D=512$, $D_k=D_v=64$, what are the shapes of $Q,K,V,A,Y$ and the number of parameters?
---
$Q,K\in\mathbb R^{10\times64}$, $V\in\mathbb R^{10\times64}$, $A\in\mathbb R^{10\times10}$, $Y\in\mathbb R^{10\times64}$. $W_q,W_k,W_v$ each have $512\cdot64=32{,}768$ parameters, for a total of $98{,}304$. The multiplications for $QK^T$ number $N^2D_k=100\cdot64=6{,}400$.
:::

:::ex Example 6 — what one query brings back
The keys are $\mathbf k_1=(1,0)$, $\mathbf k_2=(0,1)$ and the values are $v_1=2$, $v_2=6$ (scalars). What is the output for the query $\mathbf q=\sqrt2\,(\ln3,0)$? ($D_k=2$)
---
The scores $e_i=\mathbf q\cdot\mathbf k_i/\sqrt2$ are $(\ln3,0)$, so $\mathbf a=(\frac34,\frac14)$ and $y=\frac34\cdot2+\frac14\cdot6=3$. The query resembles key 1, so the average is tilted toward value 1.
:::
` },
      '21.6': { title: 'Positional Encoding and Masks', body: R`
:::idea In plain words
Self-attention just mixes the same things even if the order of the inputs is changed, so as it stands it cannot tell “the dog bites the man” from “the man bites the dog”. So we add to each input a vector telling “which position it is”. Also, a model that writes a sentence must not see words not yet written, so in the score table we hide the future entries with $-\infty$ so that they become $0$ after the softmax.
:::

**Positional encoding** (slide 69). To each input vector $\mathbf x_j$ we attach a special position code $\mathbf p_j$: $\mathbf p_j=pos(j)$, that is, a function $pos:\mathbb N\to\mathbb R^d$ that turns position $j$ into a $d$-dimensional vector. There are two choices. (1) A **learned table**: one learned vector for each position $t\in[0,T]$ ($T\times d$ parameters; lengths unseen in training cannot be represented). (2) A **fixed function**: design it to have the desired properties. The fixed function on the slide is the sine and cosine.

:::key Sinusoidal positional encoding
$$\mathbf p(t)=\big(\sin\omega_1t,\ \cos\omega_1t,\ \sin\omega_2t,\ \cos\omega_2t,\ \dots,\ \sin\omega_{d/2}t,\ \cos\omega_{d/2}t\big)^T\in\mathbb R^d,\qquad\omega_k=\frac1{10000^{2k/d}}$$
This agrees with the formula of slide 77, $PE_{(pos,2i)}=\sin(pos/10000^{2i/d_{model}})$, $PE_{(pos,2i+1)}=\cos(\cdot)$ (where the pairs are numbered from $i=0$). A relative position $\Delta$ appears as a rotation matrix: $\mathbf p(t+\Delta)=R(\Delta)\,\mathbf p(t)$.
:::

**Intuition** (the binary table on slide 69). Writing the binary numbers from $0$ to $15$, the rightmost bit flips every time and each bit further left flips twice as slowly. The sine–cosine pairs are a continuous version of these bits. The larger the index $k$, the smaller $\omega_k$ (the lower the frequency) and the slower the change, and the vector of all pairs together tells positions apart. The wavelength $2\pi/\omega_k=2\pi\cdot10000^{2k/d}$ grows geometrically.

:::fig posenc
:::

**Adding versus concatenating.** Slide 69 writes that $\mathbf p_j$ is **concatenated** to $\mathbf x_j$, and slide 77 draws it as ⊕, **adding** it to the input embedding. The two are in fact the same. The next linear layer gives $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$, so a linear map after concatenation is the same as “adding a linear transform of the position code”.

**Masked self-attention** (slide 70). A language model must predict the next word looking only at the words before it[[ch20:20.4|Teacher forcing: training by feeding the whole true sentence at once.]]. So that it cannot see the future even when the whole true sentence is fed in, **the alignment scores of the future are set directly to $-\infty$**. With key index $i$ and query index $j$, the slide's formula is
$$e_{i,j}=\begin{cases}\dfrac{\mathbf q_j\cdot\mathbf k_i}{\sqrt D},&i\le j\\[4pt]-\infty,&i>j\end{cases}$$
and since $e^{-\infty}=0$, the weight after the softmax becomes $0$.

:::key Masked self-attention
$$A=\mathrm{softmax}\Big(\frac{QK^T}{\sqrt{D_k}}+M\Big),\qquad M_{ji}=\begin{cases}0,&i\le j\\-\infty,&i>j\end{cases}$$
Row $j$ (query $j$) sees only the keys with $i\le j$, the weights for $i>j$ are $0$, and each row sums to $1$. The output $\mathbf y_j$ depends only on $\mathbf x_1,\dots,\mathbf x_j$.
:::

:::fig maskmat
:::

:::warn The −∞ in implementations
In practice one often adds a very large negative number (e.g. $-10^9$) instead of $-\infty$. If a row were all $-\infty$ we would get $0/0$, which has no value, but the mask above allows the diagonal ($i=j$) and avoids this. The first query ($j=1$) sees only itself, so its row is $(1,0,\dots,0)$.
:::

:::ex Example 7 — one pair of the sinusoidal code
For $d=4$, what are $\omega_1,\omega_2$? If one pair $(\sin\omega t,\cos\omega t)$ has $\omega=\pi/2$, what values does it go through at $t=0,1,2,3$?
---
$\omega_1=10000^{-2/4}=\frac1{100}$ and $\omega_2=10000^{-4/4}=\frac1{10000}$, and in both cases the larger $k$ is, the slower. For $\omega=\pi/2$, $(\sin,\cos)$ goes $(0,1),(1,0),(0,-1),(-1,0)$, making one full turn every 4 slots, and a shift by $\Delta$ consecutive slots is a rotation by the angle $\omega\Delta$.
:::

:::ex Example 8 — the size of a mask matrix
In masked self-attention with $N=4$, how many entries of $A$ are nonzero, and what is each row's sum?
---
Row $j$ keeps $j$ entries, so there are $1+2+3+4=\frac{4\cdot5}2=10$ and each row sums to $1$. It is a lower triangular matrix.
:::
` },
      '21.7': { title: 'Multi-Head Attention and the Encoder Block', body: R`
:::idea In plain words
A single attention mixes the inputs by “one criterion” only. In a sentence, a word may want to look at its grammatical partner, its semantic partner, and its next-door neighbor at the same time. **Multi-head** attention runs $h$ attentions in parallel, each mixing by a different criterion (different $W_q,W_k,W_v$), and concatenates the results. Adding residual connections, layer normalization, and a position-wise FF to this multi-head attention makes one **block**, and stacking $N$ blocks is the Transformer encoder.
:::

**Multi-head attention** (slide 71). The figure on the slide (from the paper by Vaswani et al.) shows on the left the scaled dot-product attention (MatMul → Scale → Mask (optional) → SoftMax → MatMul) and on the right $h$ of them stacked into multi-head attention. The inputs V, K, Q each pass through a per-head Linear layer and are attended, and the heads' outputs are concatenated and fed to the final Linear layer.

:::key Multi-head attention
$$\mathrm{head}_a=\mathrm{Attn}(XW_q^a,XW_k^a,XW_v^a),\qquad\mathrm{MHA}(X)=\big[\mathrm{head}_1,\dots,\mathrm{head}_h\big]W_o,\qquad W_o\in\mathbb R^{hD_v\times D}$$
With $D_k=D_v=D/h$ there are $h\cdot3D\cdot\frac Dh+D^2=4D^2$ parameters (without biases), and since one head costs $N^2D/h$ the total is $O(N^2D)$, the same as with a single head.
:::

:::fig mha
:::

**Encoder block** (slides 72–77). The slides explain a Transformer that uses only the encoder, building it up one line at a time.
- The input is tokenized into $\mathbf x\in\mathbb R^{n\times d}$ (72). Each token is encoded by a continuous embedding: $\mathbf h_i=\mathrm{FF}(\mathbf x_i)$ (73).
- Multi-head attention with a skip connection gives the **contextual encoding**: $\mathbf h_i=\mathrm{LayerNorm}(\mathbf h_i+\mathrm{Attn}(\mathbf h_i,\mathbf h,\mathbf h))$ (74). Here $\mathrm{Attn}(\mathbf q,K,V)$ is self-attention in which the query $\mathbf h_i$ looks at the whole of the keys and values $\mathbf h$.
- An additional encoding with a skip connection: $\mathbf h_i=\mathrm{LayerNorm}(\mathbf h_i+\mathrm{FF}(\mathbf h_i))$ (75).
- The output is reused repeatedly as the input of the next block. The block is stacked $N\times$ (76).
- When encoding the tokens, a **positional** embedding is added (77): a periodic function (sine and cosine) or a learned one.

:::key The encoder block
$$\mathbf h_i\leftarrow\mathrm{LayerNorm}\big(\mathbf h_i+\mathrm{MHA}(\mathbf h)_i\big),\qquad\mathbf h_i\leftarrow\mathrm{LayerNorm}\big(\mathbf h_i+\mathrm{FF}(\mathbf h_i)\big)$$
FF is the same two-layer MLP for every token, $\mathrm{FF}(\mathbf h)=W_2\,\mathrm{ReLU}(W_1\mathbf h+\mathbf b_1)+\mathbf b_2$, $W_1\in\mathbb R^{d_{ff}\times d}$. The input is $\mathbf x+\mathbf p$, and $N$ blocks are stacked. One block has $4d^2+2d\,d_{ff}$ parameters (excluding biases and normalization), which is $12d^2$ when $d_{ff}=4d$.
:::

:::fig encblock
:::

$\mathrm{FF}$ appears in two places on the slides. The $\mathrm{FF}(\mathbf x_i)$ of 73 is the layer that embeds the input (Input Embedding in the figure), and the $\mathrm{FF}(\mathbf h_i)$ of 75 is the position-wise MLP inside the block. They use the same symbol but are different layers. The input and output shapes of a block are the same $n\times d$, so the blocks can be stacked as they are, and thanks to the residual connections the gradient flows easily[[ch16:16.6|The gradient of residual connections.]]. $d_{ff}=4d$ is the choice of the original paper and is not on the slides[[@med:ch15:12.1c|Multi-head and the Transformer layer.]].

:::ex Example 9 — parameters of multi-head attention
For $D=512$, $h=8$ heads, and $D_k=D_v=64$, how many parameters (without biases) does multi-head attention have? And one block ($d_{ff}=2048$)?
---
One head has $W_q,W_k,W_v$ with $512\cdot64$ parameters each, so $3\cdot32{,}768=98{,}304$; for 8 heads $786{,}432$; and $W_o\in\mathbb R^{512\times512}$ has $262{,}144$, for a total of $1{,}048{,}576=4\cdot512^2$. FF has $2\cdot512\cdot2048=2{,}097{,}152$, so one block has $3{,}145{,}728=12\cdot512^2$.
:::

:::ex Example 10 — tracking the shapes
In one block with $n=10$, $d=64$, and $h=4$ heads, what are the shapes at each stage?
---
The input is $10\times64$. For each head $Q,K,V\in\mathbb R^{10\times16}$, $A\in\mathbb R^{10\times10}$ (4 heads), and the head output is $10\times16$. Concatenating gives $10\times64$, and multiplying by $W_o$ still gives $10\times64$. After the residual and LN it is $10\times64$, FF goes $64\to256\to64$, and after the residual and LN it is $10\times64$. The shape is the same after passing through the block.
:::
` },
      '21.8': { title: 'Layer Normalization and the Cost of Attention', body: R`
:::idea In plain words
Batch normalization computes the mean and variance over “the samples having the same channel” and adjusts accordingly. But sentences have all sorts of lengths, and in inference the batch size is often $1$. **Layer normalization** computes the mean and variance inside the feature vector of one sample and one token, so it does not depend on the batch. This is the “Add & Norm” of the Transformer block.
:::

**BN and LN** (slide 79). The slide shows in a figure which cells of a box of shape $N\times C\times(H,W\text{ or Seq\_len})$ are grouped together for normalization. **BN** picks one channel and gathers all the samples and positions ($N,H,W$) of that channel. **LN in a CNN** gathers all the channels and positions ($C,H,W$) of one sample. **LN in a Transformer** picks one sample and one token and gathers only the feature vector ($C$) of that token[[ch12:12.3|BN computes the mean and variance over the minibatch.]].

:::fig lncube
:::

:::key Layer normalization
For the features $\mathbf h\in\mathbb R^d$ of one token,
$$\mu=\frac1d\sum_{j=1}^dh_j,\qquad\sigma^2=\frac1d\sum_{j=1}^d(h_j-\mu)^2,\qquad\mathrm{LN}(\mathbf h)=\boldsymbol\gamma\odot\frac{\mathbf h-\mu\mathbf 1}{\sqrt{\sigma^2+\varepsilon}}+\boldsymbol\beta$$
$\boldsymbol\gamma,\boldsymbol\beta\in\mathbb R^d$ are learned. If $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$, the output has mean $0$ and variance $1$, and $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$ for $a>0$, $b\in\mathbb R$.
:::

| | BN | LN (Transformer) |
|---|---|---|
| Axes over which statistics are gathered | per channel, $(N,H,W)$ | per token, $C$ |
| Depends on the batch size | yes | no |
| Training and inference | differ (a moving average is used) | the same |
| Variable-length sentences | awkward | natural |

At inference BN must switch to the moving-average statistics collected during training[[ch12:12.4|The statistics of BN at inference.]], whereas LN needs only a single token and computes with the same formula as in training.

:::warn Slide 78 is empty
Slide 78 “Linearization of TF” has only a title and no content. These notes do not cover that part. The cost comparison below comes not from the slides but from the paper by Vaswani et al.
:::

:::ex Example 11 — computing layer normalization
What do we get by passing $\mathbf h=(2,4,4,6)$ through an LN with $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$?
---
$\mu=4$, the deviations are $(-2,0,0,2)$, and $\sigma^2=\frac{4+0+0+4}4=2$, so $\mathrm{LN}(\mathbf h)=\frac1{\sqrt2}(-2,0,0,2)=(-\sqrt2,0,0,\sqrt2)$. The mean is $0$ and the variance is $\frac{2+0+0+2}4=1$.
:::

### Going deeper

**Comparing the cost of one layer** (the paper's table, outside the slides). For length $N$ and dimension $d$,

| Layer | Cost per layer | Sequential operations | Maximum path between two tokens |
|---|---|---|---|
| Self-attention | $O(N^2d)$ | $O(1)$ | $O(1)$ |
| Recurrent (RNN) | $O(Nd^2)$ | $O(N)$ | $O(N)$ |

Attention is expensive when $N$ is larger than $d$, but every pair of tokens is connected in one step and the computation of a layer is parallel. In an RNN the information of two distant tokens must pass through $N$ steps, during which the gradient is multiplied and easily vanishes[[ch19:19.6|Vanishing gradients.]]. If order is needed, add the positional encoding (Section 21.6).
` },
    },
    probs: [
      { q: R`Which statement about the “practical problem” of slide 40 is correct?`,
        choices: [R`The image features are too small to enter the LSTM`, R`If the RNN is strong it can build a sentence from the previous words alone without using the image, and the previous word's influence is more direct`, R`The gradient of the cross-entropy becomes $0$`, R`The sentence never ends at inference`],
        sol: R`Slide 40: the previous word has a more direct influence (a short dependency distance) on the next word, so the image conditioning is weak. Hence the conditioning on the image must be strengthened.` },
      { q: R`How many parameters does the Linear layer (with bias) that fits a $2048$-dimensional image feature to a $512$-dimensional LSTM input have?`,
        sol: R`$2048\cdot512=1{,}048{,}576$ weights and $512$ biases, so $1{,}049{,}088$.` },
      { q: R`Consider a captioning model whose decoder is a vanilla RNN $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+\mathbf b)$, and compare (a) feeding the image feature $\mathbf v$ only as the first input ($\mathbf h_0=\tanh(W_v\mathbf v+\mathbf b)$) with (b) the shortcut that adds $W_z\mathbf v$ to the input of every step. (1) Show that in (a) $\lVert\partial\mathbf h_t/\partial\mathbf v\rVert\le\lVert W_h\rVert^t\lVert W_v\rVert$. (2) Show that in (b) $\partial\mathbf h_t/\partial\mathbf v$ has a direct term of length $1$ of size at most $\lVert W_z\rVert$. (3) Explain that the “dependency distance $1$” of slide 41 is this.`,
        sol: R`With $D_s=\diag(1-\mathbf h_s^2)$ we have $\lVert D_s\rVert\le1$ and $\partial\mathbf h_s/\partial\mathbf h_{s-1}=D_sW_h$.
**(1)** In (a), $\mathbf v$ enters only through $\mathbf h_0$, and $\partial\mathbf h_0/\partial\mathbf v=D_0W_v$. By the chain rule $\frac{\partial\mathbf h_t}{\partial\mathbf v}=D_tW_h\cdots D_1W_h\,D_0W_v$, and the norm product inequality gives $\le\lVert W_h\rVert^t\lVert W_v\rVert$. If $\lVert W_h\rVert<1$ this shrinks exponentially as $t$ grows, and the image's influence disappears.
**(2)** In (b), $\mathbf h_t=\tanh(W_h\mathbf h_{t-1}+W_x\mathbf y_t+W_z\mathbf v+\mathbf b)$, so $\mathbf v$ enters directly at every step, and the direct term at step $t$ is $\partial\mathbf h_t/\partial\mathbf v\supset D_tW_z$, whose norm is $\le\lVert W_z\rVert$ and does not depend on $t$. The total derivative is this term plus the distant paths as in (a).
**(3)** There is a path with only one Jacobian factor from the image to the output of step $t$, that is, a dependency distance $1$, so the gradient does not vanish as time passes. The slide's drawback is that if the learned $W_z$ is small, the model can ignore the image.`,
        rubric: R`- The Jacobian $D_sW_h$ and $\lVert D_s\rVert\le1$ — 2 points
- (1) $\lVert W_h\rVert^t\lVert W_v\rVert$ by the chain rule and the norm inequality — 3 points
- (2) The direct term $D_tW_z$ and a bound independent of $t$ — 3 points
- (3) The interpretation of dependency distance $1$ and its limit — 2 points` },
      { q: R`What is the shape of the summary $\mathbf z=\sum_{i,j}\alpha_{i,j}\mathbf x_{i,j}$ obtained by applying soft attention $\alpha\in\mathbb R^{14\times14}$ to the conv5 features $\mathbf x\in\mathbb R^{14\times14\times512}$?`,
        choices: [R`$14\times14$`, R`A $196$-dimensional vector`, R`A $512$-dimensional vector`, R`$14\times14\times512$`],
        sol: R`It is a weighted average of the $512$-dimensional vectors at $196$ positions, so $\mathbf z\in\mathbb R^{C}=\mathbb R^{512}$. The position dimensions are merged and disappear.` },
      { q: R`The features of three cells are $\mathbf x_1=(1,0)$, $\mathbf x_2=(0,1)$, $\mathbf x_3=(1,1)$ and the scores are $e=(0,\ln3,0)$. What is the sum of the two components of the soft-attention summary $\mathbf z$?`,
        sol: R`$\alpha=(\frac15,\frac35,\frac15)$ and $\mathbf z=(\frac25,\frac45)$, so the sum is $\frac65$.` },
      { q: R`Which comparison of soft and hard attention is correct?`,
        choices: [R`Soft attention is a weighted average and is trained by ordinary backpropagation, whereas hard attention needs other training techniques because of the operation of picking a cell`, R`Soft attention picks only one cell and hard attention averages all cells`, R`The weights of hard attention do not sum to $1$`, R`Their summary vectors are always the same`],
        sol: R`Soft: $\mathbf z=\sum\alpha\mathbf x$ is differentiable. Hard: draw $s\sim\alpha$ and set $\mathbf z=\mathbf x_s$; the draw is not differentiable. Soft attention is the expectation of hard attention.` },
      { q: R`For soft attention $\mathbf z=\sum_{i}\alpha_i\mathbf x_i$, $\alpha=\mathrm{softmax}(e)$ (positions listed in one line): (1) Show that $\lVert\mathbf z\rVert\le\max_i\lVert\mathbf x_i\rVert$ since $\alpha_i>0$ and $\sum\alpha_i=1$. (2) Show that for hard attention with $s\sim\mathrm{Categorical}(\alpha)$, $\mathbb E[\mathbf x_s]=\mathbf z$. (3) Using $\dfrac{\partial\alpha_i}{\partial e_m}=\alpha_i(\delta_{im}-\alpha_m)$, show that $\dfrac{\partial\mathbf z}{\partial e_m}=\alpha_m(\mathbf x_m-\mathbf z)$ and explain what it means.`,
        sol: R`**(1)** The triangle inequality and $\alpha_i>0$: $\lVert\mathbf z\rVert\le\sum_i\alpha_i\lVert\mathbf x_i\rVert\le\max_i\lVert\mathbf x_i\rVert\sum_i\alpha_i=\max_i\lVert\mathbf x_i\rVert$. $\mathbf z$ is a convex combination of the $\mathbf x_i$.
**(2)** Since $P(s=i)=\alpha_i$, $\mathbb E[\mathbf x_s]=\sum_iP(s=i)\mathbf x_i=\sum_i\alpha_i\mathbf x_i=\mathbf z$.
**(3)** Differentiating the softmax: from $\alpha_i=e^{e_i}/\sum_je^{e_j}$, $\partial\alpha_i/\partial e_m=\alpha_i\delta_{im}-\alpha_i\alpha_m$. Hence $\frac{\partial\mathbf z}{\partial e_m}=\sum_i\frac{\partial\alpha_i}{\partial e_m}\mathbf x_i=\alpha_m\mathbf x_m-\alpha_m\sum_i\alpha_i\mathbf x_i=\alpha_m(\mathbf x_m-\mathbf z)$.
Meaning: raising the score $e_m$ moves $\mathbf z$ toward $\mathbf x_m$ (in the direction from the current average to $\mathbf x_m$), by an amount proportional to the current weight $\alpha_m$. A cell with $\alpha_m\approx0$ hardly reacts even if its score changes.`,
        rubric: R`- (1) The triangle inequality and the convex combination — 2 points
- (2) The expectation computation — 2 points
- (3) The Jacobian term of the softmax and the simplification — 4 points
- (3) The interpretation — 2 points` },
      { q: R`According to the memo on slide 54, the weights of channel attention (SENet) are:`,
        choices: [R`Made by a softmax, so they always sum to $1$`, R`One for each position`, R`Not learned`, R`Not required to sum to $1$ (independent sigmoid values for each channel)`],
        sol: R`“Here the attention need not sum to 1.” A sigmoid makes a weight in $(0,1)$ for each channel and reweights the feature map, so there is no need to make the sum $1$.` },
      { q: R`How many parameters (without biases) does a squeeze-and-excitation block with $C=256$ and reduction ratio $r=16$ have?`,
        sol: R`$W_1\in\mathbb R^{16\times256}$ has $4096$ and $W_2\in\mathbb R^{256\times16}$ has $4096$, for a total of $8192=2C^2/r$.` },
      { q: R`Which statement about inductive bias is correct?`,
        choices: [R`A CNN assumes the 1D chain structure of the data and an RNN the 2D grid and translation invariance`, R`A CNN exploits the 2D grid structure and translation invariance, and an RNN the 1D chain structure`, R`Inductive bias is noise contained in the training data`, R`The larger the inductive bias, the better the model generalizes to every form of data`],
        sol: R`Slide 60: convolution exploits the 2D grid structure and translation invariance, and the RNN the 1D chain structure. Such assumptions are useful for efficient models but do not generalize to other forms of data.` },
      { q: R`Define inductive bias, and state what assumptions a CNN and an RNN each make. Explain why those assumptions are an obstacle to using one model for many kinds of data (images, point clouds, sound, language), and in what way attention meets this requirement.`,
        sol: R`**Definition**: the set of assumptions a learner uses to predict outputs for inputs it has not seen. A **CNN** assumes the 2D grid structure and translation invariance (locality), and an **RNN** the 1D chain structure.
These assumptions reduce parameters and give efficient models for the corresponding data, but they do not fit data that is neither a grid nor a chain, such as point clouds or graphs, and so they do not generalize to other forms of data (slide 60). That is why a different model is used for each kind of data.
Attention sees the input only as a **collection of vectors** with no assumption about position or form and mixes them with each other by scores (permutation invariant and equivariant), so any data can be turned into tokens and fed in. The structure that is needed (such as order) is supplied by the positional encoding only when it is needed.`,
        rubric: R`- The definition of inductive bias — 1 point
- The assumptions of CNN and RNN — 1 point
- The generalization problem — 1 point
- Why attention fits (a collection of vectors, position optional) — 1 point` },
      { q: R`For the general attention layer of slide 64 (query $\mathbf h\in\mathbb R^D$, input $\mathbf x\in\mathbb R^{N\times D}$), which statement about the output $\mathbf c=\sum_ia_i\mathbf x_i$ is correct?`,
        choices: [R`$\mathbf c\in\mathbb R^N$ and it is sensitive to the order of the inputs`, R`$\mathbf c\in\mathbb R^{N\times D}$`, R`$\mathbf c$ depends only on $\mathbf x_1$`, R`$\mathbf c\in\mathbb R^D$ and it does not change when the order of the inputs is changed (permutation invariant)`],
        sol: R`$\mathbf c$ is a $D$-dimensional vector (the context vector). Changing the order only moves the terms of $\sum_i a_i\mathbf x_i$ along with their pairs $(a_i,\mathbf x_i)$, so the sum is the same.` },
      { q: R`For $\mathbf q,\mathbf k\in\mathbb R^{256}$ with independent components of mean $0$ and variance $1$, what is $\mathrm{Var}(\mathbf q\cdot\mathbf k)$?`,
        sol: R`$\mathrm{Var}(\mathbf q\cdot\mathbf k)=D=256$. Dividing by $\sqrt D=16$ makes the variance $1$.` },
      { q: R`For $D=64$, the score gap between two keys was $8$ before dividing by $\sqrt D$. What is the softmax weight of the key with the larger score after the division? (You may enter an expression.)`,
        sol: R`After the division the score gap is $8/\sqrt{64}=1$. In the softmax over two keys the larger one gets $\frac{e^{1}}{e^1+1}=\frac1{1+e^{-1}}\approx0.731$ (before dividing it was $\frac1{1+e^{-8}}\approx0.9997$).` },
      { q: R`(1) For $\mathbf q,\mathbf k\in\mathbb R^D$ whose components $q_l,k_l$ are all independent with mean $0$ and variance $1$, show that $\mathbb E[\mathbf q\cdot\mathbf k]=0$ and $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$, and find the variance of $\mathbf q\cdot\mathbf k/\sqrt D$. (2) Show that the Jacobian of the softmax $\mathbf a=\mathrm{softmax}(\mathbf e)$ is $\partial a_i/\partial e_m=a_i(\delta_{im}-a_m)$, and that if $\max_ia_i\ge1-\varepsilon$ then every entry of the Jacobian has absolute value at most $\varepsilon$. (3) Use this to explain why we divide by $\sqrt D$.`,
        sol: R`**(1)** $\mathbb E[q_lk_l]=\mathbb E[q_l]\mathbb E[k_l]=0$, so $\mathbb E[\mathbf q\cdot\mathbf k]=0$. The variance of $q_lk_l$ is $\mathbb E[q_l^2k_l^2]-0=\mathbb E[q_l^2]\mathbb E[k_l^2]=1$. Terms with different $l$ are independent, so the variances add and $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$. Multiplying by the constant $1/\sqrt D$ scales the variance by $1/D$, so $\mathrm{Var}(\mathbf q\cdot\mathbf k/\sqrt D)=1$.
**(2)** From $a_i=e^{e_i}/Z$, $Z=\sum_je^{e_j}$, $\partial a_i/\partial e_m=\delta_{im}a_i-e^{e_i}e^{e_m}/Z^2=a_i(\delta_{im}-a_m)$. Take $i^*$ with $a_{i^*}\ge1-\varepsilon$; the sum of the rest is $\le\varepsilon$. The diagonal entry $a_i(1-a_i)$ is $\le1-a_{i^*}\le\varepsilon$ for $i=i^*$, and $\le a_i\le\varepsilon$ for $i\ne i^*$. For an off-diagonal entry $a_ia_m$ ($i\ne m$), one of the two is not $i^*$, so it is $\le a_{\text{that one}}\le\varepsilon$.
**(3)** If the dot product has variance $D$, the standard deviation of the logits grows like $\sqrt D$ and the score gaps become large; when the softmax saturates and $\max a_i\to1$, by (2) all gradients are close to $0$ and learning stops. Dividing by $\sqrt D$ makes the variance $1$, independent of $D$, and avoids the saturation.`,
        rubric: R`- (1) Mean $0$, variance $1$ of the product, and $D$ by the sum of independent terms — 3 points
- (1) Variance $1$ after the scaling — 1 point
- (2) The Jacobian of the softmax — 2 points
- (2) Every entry is at most $\varepsilon$ when saturated — 3 points
- (3) The conclusion — 1 point` },
      { q: R`What is the difference between cross-attention and self-attention?`,
        choices: [R`The query comes from a different input (e.g. the decoder) in cross-attention and from the same input in self-attention`, R`Cross-attention has no softmax`, R`Self-attention does not make keys and values`, R`The output length of cross-attention is always $N$`],
        sol: R`Slide 67: the query $\mathbf q$ (shape $M\times D_k$) comes from outside, and the output is $M$ vectors of dimension $D_v$, one per query. The self-attention of slide 68 makes the query from the same input as $\mathbf q=\mathbf xW_q$, so $M=N$.` },
      { q: R`How many parameters (without biases) does one head of self-attention with $D=512$, $D_k=D_v=64$ have?`,
        sol: R`$W_q,W_k,W_v$ each have $512\cdot64=32{,}768$, so $D(2D_k+D_v)=512\cdot192=98{,}304$.` },
      { q: R`Prove that the self-attention $\mathrm{Attn}(X)=\mathrm{softmax}\big(XW_q(XW_k)^T/\sqrt{D_k}\big)XW_v$ (the softmax is row-wise) satisfies $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$ for any permutation matrix $P$. Then show that in cross-attention, permuting the rows of the key and value inputs by the same permutation leaves the output unchanged.`,
        sol: R`Let $P^TP=I$, $Q=XW_q$, $K=XW_k$, $V=XW_v$; then for $PX$ we have $Q'=PQ$, $K'=PK$, $V'=PV$.
**Scores.** $E'=Q'K'^T/\sqrt{D_k}=PQK^TP^T/\sqrt{D_k}=PEP^T$.
**Softmax.** The row-wise softmax $\sigma$ permutes along when the entries of each row are permuted, so $\sigma(EP^T)=\sigma(E)P^T$, and a $P$ that reorders rows commutes with row-wise operations, so $\sigma(PE')=P\sigma(E')$. Hence $A'=\sigma(PEP^T)=P\,\sigma(E)\,P^T=PAP^T$.
**Output.** $Y'=A'V'=PAP^T\,PV=PA(P^TP)V=PAV=PY$. ∎
**Cross-attention.** Fix the query $Q$ and permute the rows of the keys and values, $K'=PK$, $V'=PV$; then $E'=QK^TP^T/\sqrt{D_k}=EP^T$, $A'=AP^T$, $Y'=AP^TPV=AV=Y$. So it is invariant to the order of the key–value pairs (the permutation invariance of Section 21.4) and equivariant to the order of the queries.`,
        rubric: R`- $Q',K',V'$ and the scores $PEP^T$ — 3 points
- The softmax commutes with the permutation — 3 points
- The output $PY$ via $P^TP=I$ — 2 points
- The invariance of cross-attention — 2 points` },
      { q: R`For one layer of self-attention with $X\in\mathbb R^{N\times D}$ and $D_k=D_v=d$, find the number of multiplications for each of the $Q,K,V$ projections, $QK^T$, and $AV$, and show that the total is $O(N^2d+NDd)$ and that the memory of the attention matrix is $N^2$. When $D=d$, which term dominates for $N\gg d$ and for $N\ll d$?`,
        sol: R`Projections $XW_q,XW_k,XW_v$: each is a product of $N\times D$ and $D\times d$, so $3NDd$. $QK^T$: $N\times d$ times $d\times N$, so $N^2d$. Softmax: constant work on $N^2$ entries, so $O(N^2)$. $AV$: $N\times N$ times $N\times d$, so $N^2d$. The total is $3NDd+2N^2d+O(N^2)=O(N^2d+NDd)$. $A$ is $N\times N$, so $N^2$ values are stored.
If $D=d$ the cost is $O(N^2d+Nd^2)$; for $N\gg d$, $N^2d$ (the attention matrix) dominates and the cost is quadratic in the length, and for $N\ll d$, $Nd^2$ (the projections) dominates.`,
        rubric: R`- Projections $3NDd$ — 2 points
- $N^2d$ each for $QK^T$ and $AV$ — 3 points
- The total and the memory $N^2$ — 2 points
- The dominant terms in the two regimes — 1 point` },
      { q: R`Why does self-attention need a positional encoding?`,
        choices: [R`Because the softmax erases the order`, R`Because the key dimension is small`, R`Because the layer is permutation equivariant and cannot know the order of the input by itself`, R`To reduce the learning rate`],
        sol: R`Since $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$, reordering the input just yields the same values in the new order, so the order cannot be known. The order is told by adding or concatenating the position code $\mathbf p_j$ to the input.` },
      { q: R`In the sinusoidal positional encoding $\omega_k=1/10000^{2k/d}$, what is $\omega_1$ when $d=4$?`,
        sol: R`$2k/d=2/4=\frac12$, so $\omega_1=10000^{-1/2}=\frac1{100}$.` },
      { q: R`For the sinusoidal positional encoding $\mathbf p(t)=(\sin\omega_kt,\cos\omega_kt)_{k=1}^{d/2}$: (1) Find a matrix $R(\Delta)$ (independent of $t$) with $\mathbf p(t+\Delta)=R(\Delta)\mathbf p(t)$ for every $\Delta$, and show that it is orthogonal. (2) Show that $\mathbf p(t)\cdot\mathbf p(t+\Delta)=\sum_k\cos(\omega_k\Delta)$ depends only on $\Delta$. (3) Use $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$ to explain the relation between slide 69 (concatenating) and slide 77 (adding).`,
        sol: R`**(1)** By the addition formulas, $\sin\omega(t+\Delta)=\sin\omega t\cos\omega\Delta+\cos\omega t\sin\omega\Delta$ and $\cos\omega(t+\Delta)=-\sin\omega t\sin\omega\Delta+\cos\omega t\cos\omega\Delta$. For the pair $(\sin\omega t,\cos\omega t)^T$,
$$\begin{pmatrix}\sin\omega(t+\Delta)\\\cos\omega(t+\Delta)\end{pmatrix}=\begin{pmatrix}\cos\omega\Delta&\sin\omega\Delta\\-\sin\omega\Delta&\cos\omega\Delta\end{pmatrix}\begin{pmatrix}\sin\omega t\\\cos\omega t\end{pmatrix}.$$
$R(\Delta)$ is the block-diagonal matrix placing this $2\times2$ rotation by the angle $\omega_k\Delta$ for $k=1,\dots,d/2$, and it contains no $t$. Each block is a rotation, so $R^TR=I$ and it is orthogonal.
**(2)** For each pair, $\sin\omega t\sin\omega(t+\Delta)+\cos\omega t\cos\omega(t+\Delta)=\cos(\omega\Delta)$ (the cosine difference formula). Summing over all pairs gives $\sum_k\cos(\omega_k\Delta)$, which does not involve $t$.
**(3)** $[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$ (split $W$ into upper and lower blocks $W_1,W_2$). A linear map after concatenation is the same as “applying the linear map $W_2$ to $\mathbf p$ and adding it to $\mathbf xW_1$”. So concatenating and adding have the same expressive power (adding just does not increase the input dimension).
Conclusion: the effect of a relative position $\Delta$ is a linear map independent of $t$, so the model can easily learn relative distances, and the inner product between positions is a function of the distance alone.`,
        rubric: R`- (1) The addition formulas and $R(\Delta)$ — 3 points
- (1) Orthogonality — 1 point
- (2) The cosine of the pairwise inner product — 3 points
- (3) Concatenating = adding — 2 points
- The interpretation — 1 point` },
      { q: R`For masked self-attention $A=\mathrm{softmax}(S+M)$ ($S=QK^T/\sqrt{D_k}$, $M_{ji}=0$ for $i\le j$ and $-\infty$ for $i>j$, row-wise softmax), show that (1) $A_{ji}=0$ for $i>j$, (2) each row sums to $1$, and (3) the output $\mathbf y_j=\sum_iA_{ji}\mathbf v_i$ depends only on $\mathbf x_1,\dots,\mathbf x_j$. Explain why this is needed for the parallel training of language models.`,
        sol: R`The softmax of row $j$ is $A_{ji}=\dfrac{\exp(S_{ji}+M_{ji})}{\sum_{l}\exp(S_{jl}+M_{jl})}$.
**(1)** For $i>j$, $M_{ji}=-\infty$ and $e^{-\infty}=0$, so the numerator is $0$, that is, $A_{ji}=0$.
**(2)** Only the terms with $i\le j$ remain in the denominator, $Z_j=\sum_{l\le j}e^{S_{jl}}$. The term $l=j$ is finite and positive, so $0<Z_j<\infty$, the denominator is well defined, and $\sum_iA_{ji}=\sum_{i\le j}e^{S_{ji}}/Z_j=1$.
**(3)** By (1), $\mathbf y_j=\sum_{i\le j}A_{ji}\mathbf v_i$, and $A_{ji}$ ($i\le j$) is determined only by $S_{ji}=\mathbf q_j\cdot\mathbf k_i/\sqrt{D_k}$ ($i\le j$). Since $\mathbf q_j,\mathbf k_i,\mathbf v_i$ are functions of $\mathbf x_j,\mathbf x_i,\mathbf x_i$ respectively, $\mathbf y_j$ is a function of $\mathbf x_1,\dots,\mathbf x_j$ alone. Changing a future $\mathbf x_m$ ($m>j$) does not change $\mathbf y_j$.
Why it is needed: to feed the whole true sentence at once and compute the next-word prediction loss of all slots simultaneously (teacher forcing), the output of slot $j$ must not see the future of the true sentence. The mask guarantees this, so $T$ slots can be trained in parallel.`,
        rubric: R`- (1) $e^{-\infty}=0$ — 2 points
- (2) Finiteness of the denominator (the diagonal allowed) and the sum $1$ — 3 points
- (3) The range of dependence of $\mathbf y_j$ — 3 points
- The need for parallel training — 2 points` },
      { q: R`How many parameters (without biases, including $W_o$) does multi-head attention with $D=512$, $h=8$ heads, and $D_k=D_v=64$ have?`,
        sol: R`Each head has $3\cdot512\cdot64=98{,}304$, and 8 heads have $786{,}432$. $W_o\in\mathbb R^{512\times512}$ has $262{,}144$. The total is $1{,}048{,}576=4D^2$.` },
      { q: R`For multi-head attention with $D_k=D_v=D/h$: (1) show that the number of parameters is $4D^2$ (without biases), (2) that the cost is $O(N^2D)$ independent of the number of heads $h$, and (3) that the total size of the attention matrices is $hN^2$, proportional to the number of heads. Compared with the single-head case ($h=1$, $D_k=D_v=D$), what does multi-head gain?`,
        sol: R`**(1)** One head has $W_q^a,W_k^a\in\mathbb R^{D\times D/h}$ and $W_v^a\in\mathbb R^{D\times D/h}$, which is $3D\cdot D/h$ parameters, and $h$ heads give $3D^2$. The output projection $W_o\in\mathbb R^{hD_v\times D}=\mathbb R^{D\times D}$ has $D^2$. The total is $4D^2$.
**(2)** $QK^T$ and $AV$ of one head each take $N^2\cdot D/h$, so $2N^2D/h$. Summing over $h$ heads gives $2N^2D$, independent of $h$ (the projections cost $3ND^2$ and $W_o$ costs $ND^2$, also independent of $h$).
**(3)** There is one $N\times N$ matrix per head, so $hN^2$.
**Comparison**: for $h=1$ the parameters are also $4D^2$ and the cost $O(N^2D)$, the same, but there is only one attention pattern. Multi-head learns $h$ different softmax patterns (similarities in different subspaces) at the same time at the same cost.`,
        rubric: R`- (1) $3D^2/h$ per head and $W_o$ — 3 points
- (2) $2N^2D/h$ per head and the sum — 3 points
- (3) The matrix size $hN^2$ — 1 point
- The interpretation of the comparison — 1 point` },
      { q: R`How many parameters (excluding biases and LayerNorm) does one encoder block with $d=512$ and $d_{ff}=2048$ have?`,
        sol: R`Multi-head attention has $4d^2=1{,}048{,}576$ and FF has $2d\,d_{ff}=2{,}097{,}152$. The total is $3{,}145{,}728=12d^2$.` },
      { q: R`In the encoder block of slides 74–75, what is the order of the computation done by one block?`,
        choices: [R`FF $\to$ LayerNorm $\to$ attention $\to$ LayerNorm`, R`LayerNorm only, twice`, R`Attention + residual $\to$ LayerNorm $\to$ FF + residual $\to$ LayerNorm`, R`Attention only, once`],
        sol: R`$\mathbf h\leftarrow\mathrm{LayerNorm}(\mathbf h+\mathrm{Attn}(\mathbf h,\mathbf h,\mathbf h))$, then $\mathbf h\leftarrow\mathrm{LayerNorm}(\mathbf h+\mathrm{FF}(\mathbf h))$. In each sublayer the skip connection is added and then normalized.` },
      { q: R`For one encoder block with $n=10$, $d=64$, $h=4$ heads, and $d_{ff}=256$, write the tensor shape at each stage from input to output, and count the parameters of the block (excluding biases and LN).`,
        sol: R`The input is $10\times64$. For each head $Q,K,V\in\mathbb R^{10\times16}$, $A\in\mathbb R^{10\times10}$, and the head output is $10\times16$. Concat is $10\times64$, and after $W_o$ it is $10\times64$. After the residual and LN it is $10\times64$. FF: $10\times64\to10\times256\to10\times64$. After the residual and LN it is $10\times64$ (the output of the block, the same shape as the input).
Parameters: attention $4d^2=4\cdot4096=16{,}384$, FF $2\cdot64\cdot256=32{,}768$. The total is $49{,}152=12d^2$.`,
        rubric: R`- The shapes of $Q,K,V,A$ per head — 2 points
- The shapes of Concat, $W_o$, and FF — 1 point
- The parameters $16{,}384+32{,}768$ — 1 point` },
      { q: R`Show that an encoder block $T(X)$ without positional encoding (multi-head self-attention + residual + LN, token-wise FF + residual + LN) is permutation equivariant, that is, $T(PX)=P\,T(X)$, and explain that an encoder with $N$ such blocks stacked is also equivariant. State in one sentence why this is the reason a positional encoding is needed.`,
        sol: R`**The attention part.** In multi-head attention each head's self-attention is equivariant ($\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$), and Concat and $W_o$ are the same linear map on every row, so they commute with row permutations. That is, $\mathrm{MHA}(PX)=P\,\mathrm{MHA}(X)$.
**Residual and LN.** $PX+\mathrm{MHA}(PX)=P(X+\mathrm{MHA}(X))$, and LN applies the same function to each row (token), so $\mathrm{LN}(PZ)=P\,\mathrm{LN}(Z)$.
**FF.** It is the same MLP for every token, so $\mathrm{FF}(PZ)=P\,\mathrm{FF}(Z)$, and the residual and LN commute for the same reason. Hence $T(PX)=P\,T(X)$.
**Stacking.** A composition of equivariant functions is equivariant: $T_N\circ\cdots\circ T_1(PX)=P\,T_N\circ\cdots\circ T_1(X)$.
Conclusion: without positional information the encoder cannot distinguish the order of the tokens, so for data in which order carries meaning a position code must be put into the input.`,
        rubric: R`- Equivariance of attention, Concat, and $W_o$ — 3 points
- Residual, LN, and FF being the same function on every row — 3 points
- Equivariance of the composition — 2 points
- The need for positional encoding — 2 points` },
      { q: R`Over what range does the LayerNorm of a Transformer (slide 79) gather the mean and variance?`,
        choices: [R`The feature vector $C$ of one token, after choosing one sample and one token`, R`All samples and positions of the batch that have the same channel`, R`All tokens and channels of one sample`, R`The entire training data`],
        sol: R`The LN of a Transformer computes the mean and variance over the feature dimension $C$ for each sample and token. So it does not depend on the batch size or the sentence length, and training and inference are the same. The first option is BN.` },
      { q: R`What is the first component of the result of applying LayerNorm with $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$ to $\mathbf h=(2,4,4,6)$? (You may enter an expression.)`,
        sol: R`$\mu=4$ and $\sigma^2=\frac{4+0+0+4}4=2$, so the first component is $\frac{2-4}{\sqrt2}=-\sqrt2$.` },
      { q: R`For the layer normalization $\mathrm{LN}(\mathbf h)=(\mathbf h-\mu\mathbf 1)/\sigma$ with $\varepsilon=0$, $\boldsymbol\gamma=\mathbf 1$, $\boldsymbol\beta=\mathbf 0$: (1) Show that the output has mean $0$ and variance $1$ and that $\lVert\mathrm{LN}(\mathbf h)\rVert^2=d$. (2) Show that $\mathrm{LN}(a\mathbf h+b\mathbf 1)=\mathrm{LN}(\mathbf h)$ for $a>0$, $b\in\mathbb R$. (3) Explain why, unlike BN, LN does not depend on the batch size.`,
        sol: R`**(1)** For $\mathbf y=(\mathbf h-\mu\mathbf 1)/\sigma$ the mean is $\frac1d\sum_j(h_j-\mu)/\sigma=(\mu-\mu)/\sigma=0$. The variance is $\frac1d\sum_jy_j^2=\frac1{\sigma^2}\cdot\frac1d\sum_j(h_j-\mu)^2=1$, and $\lVert\mathbf y\rVert^2=\sum_jy_j^2=d$.
**(2)** For $\mathbf h'=a\mathbf h+b\mathbf 1$, $\mu'=a\mu+b$, $h'_j-\mu'=a(h_j-\mu)$, $\sigma'^2=a^2\sigma^2$, and since $a>0$, $\sigma'=a\sigma$. Hence $\mathrm{LN}(\mathbf h')=a(\mathbf h-\mu\mathbf 1)/(a\sigma)=\mathrm{LN}(\mathbf h)$. (If $a<0$ the sign flips and we get $-\mathrm{LN}(\mathbf h)$.)
**(3)** $\mu,\sigma$ are computed from the $d$ components of a single token only, so no other sample of the same batch is used. BN computes the mean and variance from all samples of the batch for each channel, so its statistics depend on the batch size and a moving average is needed at inference.`,
        rubric: R`- (1) Mean $0$, variance $1$, norm $\sqrt d$ — 3 points
- (2) Shift and scale invariance — 4 points
- (3) The reason for batch independence — 3 points` },
    ],
  };
})();
