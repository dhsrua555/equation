/* English text — 16 CNN Architectures & Saliency Maps (W6 Wed slides 1–55). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '입력': 'input',
    '클래스': 'classes',
    '매개변수 62,378,344개의 자리': 'Where the 62,378,344 parameters are',
    '← 합성곱 다섯 층 6.0%': '← five conv layers 6.0%',
    'AlexNet의 단계별 크기와 매개변수': 'AlexNet sizes and parameters by stage',
    '3층 위 한 칸이 보는 입력 7칸': 'one cell after 3 layers sees 7 input cells',
    '3층: 입력 7칸 = 7×7 한 층': '3 layers: 7 input cells = one 7×7 layer',
    '2층: 입력 5칸 = 5×5 한 층': '2 layers: 5 input cells = one 5×5 layer',
    '1층: 입력 3칸': '1 layer: 3 input cells',
    '가중치: 3×3 세 층 27C², 7×7 한 층 49C²': 'weights: three 3×3 layers 27C², one 7×7 layer 49C²',
    '작은 필터를 쌓을 때의 수용 영역': 'Receptive field of stacked small filters',
    '8층': '8 layers', '19층': '19 layers', '22층': '22 layers', '152층': '152 layers',
    'ImageNet top-5 오류율': 'ImageNet top-5 error',
    '이전 층 28×28×256': 'previous layer 28×28×256',
    '이어 붙이기 → 28×28×480': 'concatenate → 28×28×480',
    '이어 붙이기 → 28×28×672': 'concatenate → 28×28×672',
    '풀링': 'pool',
    '단순: 1,089,536개': 'naive: 1,089,536',
    '병목: 346,112개': 'bottleneck: 346,112',
    '단순 인셉션 모듈과 병목 인셉션 모듈': 'Naive inception module and inception module with bottlenecks',
    '합성곱': 'conv',
    '단순 층': 'plain layers',
    '항등': 'identity',
    '잔차 블록': 'residual block',
    '256채널': '256 channels',
    '병목 블록': 'bottleneck block',
    '단순 층, 잔차 블록, 병목 잔차 블록': 'Plain layers, a residual block, and a bottleneck residual block',
  });
  Object.assign(EM.en.fig, {
    alexnet: R`Top: the output size of each stage (numbers below; $55^2\times96$ means $55\times55\times96$) and the kernel (s is the stride, p the padding). Box height roughly shows width and height, box width the number of channels, and the filled boxes are the fully connected layers. Width and height shrink $227\to55\to27\to13\to6$ while the channels grow. Bottom: 94% of the parameters are in FC6–FC8 (slides 7–18).`,
    receptive: R`Each layer of size-3 filters with stride 1 widens the range of inputs one cell sees (its receptive field) by one cell on each side, two in total: $3\to5\to7$. The bold lines are the three layer-1 cells seen by the middle cell of layer 2. In 2D, two $3\times3$ layers see the same range as one $5\times5$ layer and three see the same as one $7\times7$ layer, with fewer weights, $27C^2<49C^2$, and three ReLUs instead of one ($C$ channels, biases excluded).`,
    imagenet: R`Top-5 error (%) of the ImageNet classification challenge. CNNs were used from AlexNet in 2012 on (right of the dashed line), and the error fell as the networks grew deeper (number of layers above the bars). ResNet's 3.6% in 2015 is below the human error (about 5%).`,
    inception: R`(Left) The naive module computes four branches side by side and concatenates them, so the 256 channels of the pooling branch are added too, giving 672 channels. (Right) Putting $1\times1$ convolutions (64, filled boxes) before the $3\times3$ and $5\times5$ and after the pooling shrinks the output to 480 channels and the weights (excluding biases) to about 32%. The number below each box is the number of filters.`,
    resblock: R`(Left) Plain layers learn the desired mapping $H(x)$ directly. (Middle) In a residual block the layers learn only $F(x)$, and the input $x$ is added through the shortcut to give $F(x)+x$. With $F=0$ it is the identity, and the backpropagated gradient flows straight through the shortcut. (Right) The bottleneck block reduces the channels from 256 to 64 with $1\times1$ and expands them back to 256.`,
  });
  EM.en.ch[16] = {
    title: 'CNN Architectures and Saliency Maps',
    fig: R`ImageNet top-5 error: moving from the shallow methods of 2010–2011 (thin bars) to CNNs from AlexNet in 2012 on (bold bars), 28.2% fell to 3.6%`,
    tagline: R`AlexNet (8 layers) opened the deep learning era, VGG went deep with small filters, GoogLeNet gained efficiency with 1×1 convolution bottlenecks, and ResNet trained 152 layers with residual connections. We count the size and parameters of each layer ourselves to read the reasons behind the designs, and use saliency maps to see where a network looks.`,
    summary: R`We follow the ImageNet classification challenge through real architectures built from the parts of Unit 15 (convolution, pooling, fully connected). For **AlexNet** we compute the output size of every layer with $N'=(N-K+2P)/S+1$ all the way through, confirm that most of the parameters sit in the fully connected layers, and read the reasons for design choices such as ReLU, a large stride, and dropout. For **VGG** we compute why stacking $3\times3$ filters beats large filters, and for **GoogLeNet** how much the inception module and $1\times1$ convolution bottlenecks cut the parameters. For **ResNet** we show that deeper networks get worse starting with the training error (not overfitting), and use the chain rule to show how residual connections keep the gradient flowing. Finally we cover the **saliency map**, the input gradient of the class score $\partial S_c/\partial I$.`,
    goals: [
      R`State how CNN architectures evolved in the ImageNet challenge (AlexNet → ZFNet → VGG → GoogLeNet → ResNet) and their top-5 errors`,
      R`Compute AlexNet's output size and number of parameters layer by layer, and show that most of the parameters sit in the fully connected layers`,
      R`Explain what AlexNet's design choices — ReLU, a large first-layer stride, local response normalization, dropout — solved`,
      R`Compare the receptive field and parameters of stacked $3\times3$ filters with a large filter`,
      R`Compute the output size and parameters of an inception module, and explain how $1\times1$ convolution bottlenecks reduce the parameters`,
      R`Explain that the performance drop of deep networks is an optimization problem, not overfitting, and show the gradient flow through the Jacobian $I+\partial F/\partial x$ of a residual connection`,
      R`Define a saliency map as the input gradient of the class score, and write how to compute it with the chain rule of backpropagation`,
    ],
    secTitles: { '16.1': 'ImageNet and the timeline', '16.2': 'AlexNet sizes', '16.3': 'AlexNet design', '16.4': 'ZFNet · VGG', '16.5': 'GoogLeNet', '16.6': 'ResNet', '16.7': 'Saliency maps' },
    secs: {
      '16.1': { title: 'ImageNet Classification and the Evolution of CNN Architectures', body: R`
:::idea In plain words
An image classification CNN is a two-stage factory. The front repeats convolution, ReLU, and pooling to **learn features** that grow more abstract — edges → textures → parts → objects (feature learning), and the back flattens those features and **classifies** them with fully connected layers and a softmax (classification). Every year from 2012 on brought a way to build this factory deeper and more efficiently.
:::

**Review: a CNN for classification** (slide 2). Input → (convolution + ReLU → pooling) several times → flatten → fully connected → softmax. The front part is called **feature learning**, the back part **classification**[[ch15:15.5|Pooling layers and fully connected layers.]].

:::key The structure of a classification CNN and top-5 error
$$\text{input}\to\big[(\text{CONV}\to\text{ReLU})^{n}\to\text{POOL}\big]^{m}\to\text{flatten}\to(\text{FC}\to\text{ReLU})^{k}\to\text{FC}\to\text{softmax}$$
**Top-5 error**: the fraction of images whose correct class is not among the 5 classes the model ranks most probable. Used for ImageNet with its 1000 classes.
:::

**Top-5 error in the ImageNet challenge** (slides 3–4, 43).

| Year | Model | Layers | Top-5 error |
|---|---|---|---|
| 2010 | Lin et al. (shallow) | — | 28.2% |
| 2011 | Sanchez & Perronnin (shallow) | — | 25.8% |
| 2012 | AlexNet (Krizhevsky et al.) | 8 | 16.4% |
| 2013 | ZFNet (Zeiler & Fergus) | 8 | 11.7% |
| 2014 | VGG (Simonyan & Zisserman) | 19 | 7.3% |
| 2014 | GoogLeNet (Szegedy et al.) | 22 | 6.7% |
| 2015 | ResNet (He et al.) | 152 | 3.6% |

:::fig imagenet
:::

AlexNet in 2012 was the first to use a CNN, cutting the error sharply from 25.8% to 16.4% and opening the deep learning era in vision. From then on the error fell **as the depth grew** (8 → 16·19 → 22 → 152 layers). The question of slide 44: AlexNet (8 layers, 16.4%) → VGG (16 layers, 7.3%) → GoogLeNet (22 layers, 6.3%) suggests that deeper is better — does it keep improving **if we stack even deeper**? The answer is ResNet in Section 16.6.

:::warn Citations on the slides
Slides 26 and 43 also attach “[Simonyan et al. 2013]” to GoogLeNet and ResNet, which looks carried over from the previous slide (VGG). GoogLeNet is Szegedy et al. (2014) and ResNet is He et al. (2015), as the names under the bar chart say. Also, slide 44's 6.3% for GoogLeNet differs from slide 27's 6.7% (the challenge result); remember 6.7%.
:::

### Going deeper

Top-5 error is used because ImageNet's 1000 classes contain many similar ones (over 120 dog breeds, etc.) and one photo may contain several objects, so top-1 alone underestimates what a model can really do. ResNet's 3.6% in 2015 is lower than the reported human error on the same task (about 5%).
` },
      '16.2': { title: 'AlexNet: Layer Sizes and Parameters', body: R`
:::idea In plain words
AlexNet has 5 convolution layers and 3 fully connected layers, 8 layers in all. The output size of each layer follows in turn from the single formula of Unit 15, and counting the parameters shows, surprisingly, that **94% sit in the last three fully connected layers**.
:::

**Input** (slide 6). ImageNet (ILSVRC 2012, about 1.2 million images, 1000 classes). Since the images vary in size, they are first resized to $256\times256$, and a random $227\times227$ crop is fed in. The last dimension 3 is the RGB channels.

**Computing output sizes** (slides 7–18). For both convolution and pooling, $N'=\frac{N-K+2P}{S}+1$ (the slides write the no-padding case as “(feature size − kernel size)/stride + 1”).
- Conv1 (96 filters, $11\times11$, stride 4, pad 0): $\frac{227-11}{4}+1=55$ → $55\times55\times96$
- MaxPool1 ($3\times3$, stride 2): $\frac{55-3}{2}+1=27$ → $27\times27\times96$, followed by Norm1 (same size)
- Conv2 (256, $5\times5$, stride 1, pad 2): $\frac{27-5+4}{1}+1=27$ → $27\times27\times256$
- MaxPool2: $\frac{27-3}{2}+1=13$ → $13\times13\times256$, Norm2
- Conv3 (384, $3\times3$, stride 1, pad 1) → $13\times13\times384$, Conv4 (384) → $13\times13\times384$, Conv5 (256) → $13\times13\times256$
- MaxPool3: $\frac{13-3}{2}+1=6$ → $6\times6\times256$
- FC6: $6\cdot6\cdot256=9216$ → 4096, FC7: 4096 → 4096, FC8: 4096 → 1000 (number of classes)

:::key AlexNet layer sizes
$$227\xrightarrow{\text{Conv1}}55\xrightarrow{\text{Pool1}}27\xrightarrow{\text{Conv2}}27\xrightarrow{\text{Pool2}}13\xrightarrow{\text{Conv3–5}}13\xrightarrow{\text{Pool3}}6$$
$$6\cdot6\cdot256=9216\to4096\to4096\to1000$$
Of the roughly 60 million parameters, about 94% are in FC6–FC8.
:::

:::fig alexnet
:::

**Counting parameters.** A convolution layer has $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$, a fully connected layer $d_{\text{in}}d_{\text{out}}+d_{\text{out}}$[[ch15:15.3|Size and parameters of a convolution layer.]].

| Layer | Output | Parameters |
|---|---|---|
| Conv1 | $55\times55\times96$ | $11^2\cdot3\cdot96+96=34{,}944$ |
| Conv2 | $27\times27\times256$ | $5^2\cdot96\cdot256+256=614{,}656$ |
| Conv3 | $13\times13\times384$ | $3^2\cdot256\cdot384+384=885{,}120$ |
| Conv4 | $13\times13\times384$ | $3^2\cdot384\cdot384+384=1{,}327{,}488$ |
| Conv5 | $13\times13\times256$ | $3^2\cdot384\cdot256+256=884{,}992$ |
| FC6 | 4096 | $9216\cdot4096+4096=37{,}752{,}832$ |
| FC7 | 4096 | $4096\cdot4096+4096=16{,}781{,}312$ |
| FC8 | 1000 | $4096\cdot1000+1000=4{,}097{,}000$ |

The five convolution layers together have $3{,}747{,}200$ and the three fully connected layers $58{,}631{,}144$, which is **94.0%** of the total $62{,}378{,}344$. Pooling and normalization layers have no parameters to learn.

:::ex Example 1 — The input dimension of FC6
From the Conv5 output $13\times13\times256$, find the output size of MaxPool3 and the input dimension of FC6.
---
$3\times3$ pooling with stride 2: $\frac{13-3}{2}+1=6$. The channels stay, giving $6\times6\times256$, which flattens to $6\cdot6\cdot256=9216$ dimensions. This is the number in the slides' “FC6 (9216×4096)”.
:::

:::warn Difference from the original paper
The original AlexNet split the network across two GPUs, so Conv2, Conv4, and Conv5 saw only half of the input channels (those on the same GPU). That is why the original paper has about 61 million parameters. The table above counts as if every channel were connected, as on the slides.
:::

### Going deeper

The parameters concentrate in the fully connected layers, but the **computation** concentrates in the convolution layers instead. The multiplications of a convolution layer are (number of output positions) × (weights per filter) × (number of filters), so for example Conv1 does $55^2\cdot(11^2\cdot3)\cdot96\approx1.05\times10^8$ while FC6 does $9216\cdot4096\approx3.8\times10^7$. That parameters (memory) and computation (time) come from different places is the starting point for later designs (GoogLeNet removing FC layers, bottlenecks).
` },
      '16.3': { title: 'Design Choices of AlexNet', body: R`
:::idea In plain words
Several decisions made AlexNet succeed. It used **ReLU** instead of the sigmoid so the gradient would not die, skipped ahead with **stride 4** in the first layer to save computation, and fought overfitting in the huge fully connected layers with **dropout**.
:::

**The first CNN to apply the ReLU nonlinearity** (slide 19). Before, the sigmoid or tanh was used; these functions **saturate** for large inputs, their gradient becomes almost 0, and so learning is slow[[ch10:10.4|Activation functions revisited: saturation and gradients.]]. ReLU $\max(0,x)$ always has gradient 1 on the positive side, so the gradient reaches deep layers.
$$\sigma'(x)=\sigma(x)\big(1-\sigma(x)\big)\le\tfrac14,\qquad \tanh'(x)=1-\tanh^2x\to0\ (|x|\to\infty),\qquad \operatorname{ReLU}'(x)=1\ (x>0)$$

**Large stride in the first layer** (slide 20). Conv1's stride 4 cuts the feature size sharply, $227\to55$, to save computation. The model was trained on GPUs with about 3GB of memory at the time.

**Normalization layers** (slide 21). Norm1 and Norm2 are Local Response Normalization (LRN), which normalizes values by dividing by the activations of neighboring channels. They are **no longer used in recent CNNs**; batch normalization takes their place[[ch12:12.3|Batch normalization.]].

**Dropout and fully connected layers** (slide 22). Dropout 0.5 is applied in the fully connected layers to prevent overfitting. Switching each neuron off with probability 0.5 during training keeps it from relying on conspiracies of particular neurons and improves generalization[[@med:ch12:9.6b|Dropout (Medical AI).]]. As the slide says, **FC layers are extremely expensive**: as counted in Section 16.2, 94% of the parameters are there.

:::key Design choices of AlexNet
- ReLU: $\operatorname{ReLU}'(x)=1$ ($x>0$), so it learns faster than the saturating $\sigma'\le\frac14$ and $\tanh'\to0$
- Conv1 stride 4: feature size $227\to55$ to save computation
- LRN: no longer used (replaced by batch normalization)
- Dropout $p=0.5$ in the FC layers: prevents overfitting in the FC layers, which hold 94% of the parameters
:::

:::ex Example 1 — Ten layers of saturated sigmoids
Ignoring the weights and multiplying only the derivatives of the activation functions, by what factor does the gradient shrink if all ten layers have $\sigma'(x)=\frac14$ (the largest value)? And for ReLU (positive region)?
---
$\big(\tfrac14\big)^{10}=2^{-20}\approx9.5\times10^{-7}$, about one in a million. In practice $\sigma'<\frac14$ almost everywhere, so it is smaller still. In ReLU's positive region it is $1^{10}=1$, no shrinking (although neurons in the negative region pass 0).
:::

### Going deeper

AlexNet also used data augmentation (random crops, horizontal flips, color changes) and parallel training on two GPUs. Of these, ReLU, data augmentation, and dropout are still standard today, while LRN and the GPU split have disappeared. At test time dropout switches on every neuron and multiplies the outputs by the keep probability (or scales them up by $1/p$ during training) to match the expectation.
` },
      '16.4': { title: 'ZFNet and VGGNet: Small Filters, Deep', body: R`
:::idea In plain words
Instead of looking through one $5\times5$ window, passing through a $3\times3$ window twice ends up seeing the same $5\times5$ range with fewer parameters and one more nonlinearity. VGG used this idea to make every layer $3\times3$ and push the depth to 16–19 layers.
:::

**ZFNet** (Zeiler & Fergus 2013, slides 23–24). Better tuning of the network parameters over AlexNet. It changed CONV1 from ($11\times11$, stride 4) to ($7\times7$, stride 2) and used 512, 1024, 512 filters in CONV3, 4, 5 instead of 384, 384, 256, lowering the ImageNet top-5 error from 16.4% to 11.7%. The change came from the observation that the overly large first-layer filter and stride lose information.

**VGGNet** (Simonyan & Zisserman 2014, slide 25). Built **a deeper network with smaller convolutional filters** (16–19 layers, 7.3%). It is a simple structure with every convolution $3\times3$, stride 1, padding 1, and $2\times2$ max pooling in between.

**Why small filters** (the slides give only the conclusion, so we add the computation). The number of input cells one output cell sees is its **receptive field**. Stacking $n$ layers of $3\times3$ with stride 1 widens the receptive field by 2 per layer, to $1+2n$. Two layers give $5\times5$, three layers $7\times7$.

:::fig receptive
:::

:::key Stacking small filters
The receptive field of $n$ layers of stride-1 $3\times3$ convolutions is $(2n+1)\times(2n+1)$. If all layers have $C$ channels (excluding biases),
$$3\times3\ \text{two layers}:\ 2\cdot9C^2=18C^2\ <\ 5\times5\ \text{one layer}:\ 25C^2$$
$$3\times3\ \text{three layers}:\ 27C^2\ <\ 7\times7\ \text{one layer}:\ 49C^2$$
The same receptive field with fewer parameters, and as many more nonlinearities (ReLU) as there are layers.
:::

:::ex Example 1 — Three 3×3 layers instead of one 7×7
With $C=256$ channels, compare the weights of one $7\times7$ convolution layer and three $3\times3$ convolution layers.
---
$7\times7$: $49\cdot256^2=3{,}211{,}264$. Three $3\times3$ layers: $27\cdot256^2=1{,}769{,}472$. The ratio $27/49\approx0.55$ saves about 45% with the same $7\times7$ receptive field, and ReLU enters three times instead of once, expressing more complex functions.
:::

**From AlexNet to ZFNet** (slide 24). The changes in one table:

| | AlexNet | ZFNet |
|---|---|---|
| Conv1 | $11\times11$, stride 4, 96 filters | $7\times7$, stride 2, 96 filters (output $110\times110$) |
| Filters in Conv3, 4, 5 | 384, 384, 256 | 512, 1024, 512 |
| Everything else | unchanged | unchanged |
| Top-5 error | 16.4% | 11.7% |

**VGG-16 layout** (every convolution is $3\times3$, stride 1, padding 1, so sizes shrink only at pooling. The layout is the standard one of the original paper and is a supplement not on the slides). For a $224\times224\times3$ input:

| Stage | Convolutions | Output after pooling |
|---|---|---|
| 1 | $3\times3$, 64 filters, twice | $112\times112\times64$ |
| 2 | $3\times3$, 128 filters, twice | $56\times56\times128$ |
| 3 | $3\times3$, 256 filters, three times | $28\times28\times256$ |
| 4 | $3\times3$, 512 filters, three times | $14\times14\times512$ |
| 5 | $3\times3$, 512 filters, three times | $7\times7\times512$ |
| End | fully connected 4096, 4096, 1000 | 1000 classes |

At the end of each stage a $2\times2$ max pooling halves the width and height, and the channels double from stage to stage (the last two stay at 512).

### Going deeper

VGG-16 has### Going deeper

VGG-16 has about 138 million parameters, more than AlexNet, and again most are in the first fully connected layer ($7\cdot7\cdot512\cdot4096\approx1.03\times10^8$). Because the structure is simple, it is still often used as a feature extractor or as the base network for style transfer[[@med:ch13:10.2f|Deep convolution and representative architectures (Medical AI).]].
` },
      '16.5': { title: 'GoogLeNet and the Inception Module', body: R`
:::idea In plain words
Since we do not know which filter size is best, use $1\times1$, $3\times3$, $5\times5$, and pooling **all at once** side by side and stack the results along the channel direction (the inception module). Done naively the channels pile up, so put a $1\times1$ convolution in front of the expensive convolutions to reduce the channels first (a bottleneck). This bottleneck cuts the parameters to under a third.
:::

**GoogLeNet** (Szegedy et al. 2014, slides 26–27). Deeper, much more efficient, and more accurate.
- **Deeper network**: 22 layers (vs. 16 in VGG). Each layer is composed of a small network (the **inception module**).
- **Efficient parametrization**: no fully connected layers, and 12× fewer parameters than AlexNet.
- **Improved performance**: top-5 error 7.3% (VGG) → 6.7%.

**Inception module** (slide 28). It combines filters of different sizes ($1\times1$, $3\times3$, $5\times5$, max pooling with stride 1) to aggregate information from multiple receptive fields, and combines all the filter responses by **depth-wise concatenation**. Concatenation needs the same width and height, so stride 1 and size-preserving padding are used ($p=0$ for $1\times1$, $p=1$ for $3\times3$, $p=2$ for $5\times5$, $p=1$ for pooling).

**$1\times1$ convolution** (slides 29–32). Applying one $1\times1\times C$ filter to a $W\times H\times C$ feature computes one $C$-dimensional dot product at each pixel, giving $W\times H\times1$. Using $K$ filters gives $W\times H\times K$, which is a **pixel-wise embedding**: sending each pixel's $C$-dimensional vector to $K$ dimensions by the same linear map. If $K<C$, it reduces the dimension[[ch15:15.6|1×1 convolution = a fully connected map shared by every pixel.]].

:::fig inception
:::

**Sizes of the naive inception module** (slides 33–36). With a previous layer of $28\times28\times256$, running $1\times1$ (128), $3\times3$ (192), $5\times5$ (96) convolutions and a $3\times3$ max pooling side by side gives outputs $28\times28\times128$, $28\times28\times192$, $28\times28\times96$, $28\times28\times256$, and concatenating them gives
$$28\times28\times(128+192+96+256)=28\times28\times672$$
The parameters are $1\times1\times256\times128$, $3\times3\times256\times192$, $5\times5\times256\times96$. **Problem**: the feature dimension (channels) is too large, increasing the parameter size in upper layers and the memory requirement. The pooling branch passes the input's 256 channels through unchanged, so channels pile up with every module.

**$1\times1$ convolution for dimensionality reduction** (slides 37–40). Insert $1\times1$ convolutions for every convolution and pooling: put $1\times1$ (64) **before** the $3\times3$ and $5\times5$ to reduce the channels $256\to64$, and $1\times1$ (64) **after** the pooling. The output is $28\times28\times(128+192+96+64)=28\times28\times480$.

:::key Size and parameters of an inception module
Input $28\times28\times256$, excluding biases.
$$\text{naive}:\ 1^2\cdot256\cdot128+3^2\cdot256\cdot192+5^2\cdot256\cdot96=1{,}089{,}536$$
$$\text{bottleneck}:\ 1^2\cdot256\cdot128+3\cdot\big(1^2\cdot256\cdot64\big)+3^2\cdot64\cdot192+5^2\cdot64\cdot96=346{,}112$$
The output is $28\times28\times672$ for the naive module and $28\times28\times480$ for the bottleneck module.
:::

:::ex Example 1 — The parameters of the bottleneck module branch by branch
Find the weights of each of the six convolutions of the bottleneck inception module and add them up.
---
$1\times1$ (128): $256\cdot128=32{,}768$. $1\times1$ (64) before $3\times3$: $256\cdot64=16{,}384$. $3\times3$ (192): $9\cdot64\cdot192=110{,}592$. $1\times1$ (64) before $5\times5$: $16{,}384$. $5\times5$ (96): $25\cdot64\cdot96=153{,}600$. $1\times1$ (64) after pooling: $16{,}384$.
The total is $346{,}112$, about 32% of the naive module's $1{,}089{,}536$. The biggest saving is the most expensive $5\times5$ branch, $614{,}400\to16{,}384+153{,}600=169{,}984$.
:::

:::warn The “~330k” of slide 40
The slide gives the bottleneck module's parameters as “about 330k”. Adding all six convolutions gives $346{,}112\approx346$k as above; 330k ($329{,}728$) is the sum with one $1\times1\times256\times64$ (16,384) left out. The naive module's “about 1090k” is correct: $1{,}089{,}536$.
:::

:::fig googlenet
:::

**The overall GoogLeNet architecture** (slides 41–42). A stack of simple convolution layers for the initial layers (the stem), then a stack of inception modules in higher layers with occasional downsamplings (stride-2 pooling). It ends with global average pooling instead of fully connected layers[[ch15:15.5|Global average pooling.]].

### Going deeper

The computation shrinks in the same ratio. Each of the $28\cdot28=784$ output positions multiplies by the weights above, so the naive module does about $8.5\times10^8$ multiplications and the bottleneck module about $2.7\times10^8$. The **bottleneck** structure — reduce the channels with $1\times1$ convolutions, do the expensive operation, then expand again — is used as is by ResNet (Section 16.6) and most later efficient networks[[@med:ch13:10.2d|Multichannel convolution and 1×1 convolution (Medical AI).]].
` },
      '16.6': { title: 'ResNet: The Problem of Depth and Residual Connections', body: R`
:::idea In plain words
Stacking more layers made things worse **starting with the training error**. Getting worse at memorizing despite more capacity to memorize means not overfitting but that **optimization is hard**. ResNet opened a shortcut that “adds the input as is” to each block, turning the block's job into “a small correction to the input” and letting the gradient flow straight down the shortcut.
:::

**Depth vs. performance** (slides 45–46). Comparing a plain 20-layer network with a plain 56-layer network on CIFAR-10, the 56-layer network has **higher test error**. Is it overfitting due to the increased number of parameters? But the 56-layer network also has **higher training error**. It fits even the training data worse, so **it is not an overfitting problem**.

:::fig depthfail
:::

**Why does the deeper network perform worse?** (slide 47). In theory, a deeper network should be at least as good as the shallow one in fitting the training data: copy the shallow network and make the remaining layers identity mappings. However, larger networks are **much more difficult to optimize**. There are two potential problems in deeper networks.
- **Gradient vanishing** (the gradient norm approaches zero): in the chain rule of backpropagation, Jacobians are multiplied together.
$$\frac{\partial J(\mathbf W)}{\partial\mathbf h^{(l)}}=\frac{\partial J(\mathbf W)}{\partial\mathbf h^{(L)}}\,\frac{\partial\mathbf h^{(L)}}{\partial\mathbf h^{(L-1)}}\,\frac{\partial\mathbf h^{(L-1)}}{\partial\mathbf h^{(L-2)}}\cdots\frac{\partial\mathbf h^{(l+1)}}{\partial\mathbf h^{(l)}}$$
If the multiplied matrices have size below 1, the product shrinks like a power in the number of layers.
- **Covariate shift**: small variations in lower layers are amplified into large variations in deeper layers[[ch12:12.3|Batch normalization and internal covariate shift.]].

**Residual connection** (He et al. 2015, slide 48). Add a **shortcut connection** that allows learning the identity mapping. If $H(x)$ is the mapping the block should learn, the layers learn only $F(x)=H(x)-x$ and the output is $F(x)+x$.
- In the degenerate case, setting $F(x)=0$ learns the identity mapping. Keeping weights near 0 is easy, so a deeper network can do at least as well as a shallow one.
- Allowing the gradient to “bypass” the layers through the identity connection makes optimization much easier.

:::key Residual connection
$$\mathbf h^{(l+1)}=\mathbf h^{(l)}+F\big(\mathbf h^{(l)}\big)\quad\Longrightarrow\quad\frac{\partial\mathbf h^{(l+1)}}{\partial\mathbf h^{(l)}}=I+\frac{\partial F}{\partial\mathbf h^{(l)}}$$
$$\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}\prod_{k=l}^{L-1}\Big(I+\frac{\partial F_k}{\partial\mathbf h^{(k)}}\Big)=\frac{\partial J}{\partial\mathbf h^{(L)}}\big(I+\cdots\big)$$
Expanded, there is a term containing $\frac{\partial J}{\partial\mathbf h^{(L)}}$ **as is**, so the gradient does not vanish even if the Jacobians of $F$ are small.
:::

**Why.** For plain layers $\frac{\partial J}{\partial\mathbf h^{(l)}}$ is only the product of $L-l$ Jacobians, so if each has size $0.5$ it vanishes as $0.5^{L-l}$. In a residual block, expanding the product $\prod(I+A_k)$ gives $I+\sum_kA_k+\sum_{j<k}A_jA_k+\cdots$, and thanks to the leading $I$ the gradient of the upper layer reaches the lower layer **without passing through any product**. The shortcut acts as a highway for the gradient.

:::fig resblock
:::

**Two kinds of residual blocks** (slides 49–50). ResNet stacks $3\times3$ convolutions like VGG but adds a shortcut every two layers (the 34-layer residual network).
- **Plain residual block**: $3\times3$, 64 → ReLU → $3\times3$, 64, same channels so it adds directly.
- **Bottleneck residual block**: $1\times1$, 64 → $3\times3$, 64 → $1\times1$, 256 (channels $256\to64\to256$). Like GoogLeNet, it shrinks with $1\times1$ and expands again. Networks of 50 layers and more (152 layers) use this block.

:::ex Example 1 — The parameters of a bottleneck block
Compare the weights (excluding biases) of a bottleneck block ($1\times1$, 64 → $3\times3$, 64 → $1\times1$, 256) on a 256-channel input with a 64-channel plain block (two $3\times3$, 64 layers).
---
Bottleneck: $256\cdot64+9\cdot64\cdot64+64\cdot256=16{,}384+36{,}864+16{,}384=69{,}632$. Plain (64 channels): $2\cdot9\cdot64^2=73{,}728$. It handles a 4× wider (256-channel) representation at about the same cost. A plain block on 256 channels would be $2\cdot9\cdot256^2=1{,}179{,}648$, 17 times as much.
:::

**Results** (slide 51). On CIFAR-10, plain networks get worse in both training and test error as they get deeper (20 → 56 layers), while residual networks get better as they get deeper (20 → 110 layers). On ImageNet, 152 layers achieved a top-5 error of 3.6%.

### Going deeper

A residual connection can also be read as a differential equation. $\mathbf h^{(l+1)}=\mathbf h^{(l)}+F(\mathbf h^{(l)})$ has the same form as one step of Euler's method for $\dot{\mathbf h}=F(\mathbf h)$[[@em:ch01:1.2|Euler's method (Engineering Mathematics).]]. There are also experimental results showing that residual connections smooth the loss landscape, bringing it closer to the “well-conditioned” situation assumed by the gradient descent analysis of Units 13–14. Today's transformers also use a residual connection in every layer[[@med:ch12:9.5|Residual connections (Medical AI).]].
` },
      '16.7': { title: 'Saliency Maps: Where Does the Network Look?', body: R`
:::idea In plain words
This is a way to ask “which pixels played the biggest role in deciding that this photo is a dog?” Drawing as a picture how much the dog score changes when one pixel changes slightly — the size of the **derivative of the score with respect to the pixel** — lights up where the dog is.
:::

**Saliency** (slide 52). The quality of being particularly noticeable or important; prominence — the state or quality by which an item stands out from its neighbors. Saliency detection is considered to be a key attentional mechanism that enables organisms to focus their limited perceptual and cognitive resources on the most pertinent subset of the available sensory data.

**Visualizing the saliency map** (slides 53–55). We want to understand which part of an image contributes the most to make a prediction. Feeding an image $I$ to the network (forward) gives the score $S_c(I)$ of class $c$ (e.g. “dog”). The **sensitivity of the score changes with respect to the changes in pixels**, that is, the gradient $\frac{\partial S_c(I)}{\partial I}$, gives the contributions of pixels for classification. It is computed by backpropagation.

:::fig saliency
:::

:::key Saliency map
$$\frac{\partial S_c(I)}{\partial I}=\frac{\partial F^{(L)}}{\partial F^{(L-1)}}\,\frac{\partial F^{(L-1)}}{\partial F^{(L-2)}}\cdots\frac{\partial F^{(1)}}{\partial I}\qquad(S_c=\text{the }c\text{-th component of }F^{(L)})$$
Backpropagate as in training, but take the gradient with respect to the **input pixels** instead of the weights. The per-pixel map is $M_{ij}=\max_{\text{channel}}\left\lvert\frac{\partial S_c}{\partial I_{ij,\text{ch}}}\right\rvert$.
:::

**Why the gradient.** Expanding the score to first order near an image $I_0$,
$$S_c(I)\approx S_c(I_0)+w^T(I-I_0),\qquad w=\frac{\partial S_c}{\partial I}\Big|_{I_0}$$
[[ch13:13.1|First-order Taylor expansion.]]. Locally the score is a linear combination of the pixels, and pixels with larger weights $w$ change the score more when changed a little. So drawing $|w|$ in the shape of the image is the saliency map. For color images each pixel uses the largest $|w|$ among its three channels (the method of Simonyan et al. 2014; a detail not on the slides, so supplementary).

**Computation.** Use the same chain rule as in training-time backpropagation[[ch09:9.5|Vector inputs and outputs, and the Jacobian.]], except that (1) we start from the class score $S_c$ instead of the loss (usually the score before the softmax), (2) we keep the weights fixed, and (3) we send the gradient all the way down to the input $I$. One forward pass and one backward pass give the whole map.

:::ex Example 1 — The saliency of a linear model
If the score is $S_c(I)=w_c^TI+b_c$ for a linear classifier (the scores of softmax regression), what is the saliency map?
---
$\frac{\partial S_c}{\partial I}=w_c$, **the weights of class $c$ themselves**, regardless of the input. In a deep network $\frac{\partial S_c}{\partial I}$ depends on the input $I_0$, and the weights of this local linear approximation show “the pixels used for this decision on this photo”.
:::

### Going deeper

Gradient-based saliency maps are noisy and have limits, such as regions of zero gradient in ReLU networks, so many variants have appeared (gradient × input, integrated gradients, Grad-CAM, etc.). Using the same gradient $\partial S_c/\partial I$ in reverse to change the image very slightly in the direction that lowers the score creates an **adversarial example**: it looks the same to humans, yet its classification changes[[@med:ch14:10.3b|Saliency maps and adversarial attacks (Medical AI).]].
` },
    },
    probs: [
      { q: R`Which model was the first to use a CNN in the ImageNet challenge, lowering the top-5 error from 25.8% to 16.4%?`,
        choices: [R`ZFNet`, R`AlexNet`, R`VGGNet`, R`ResNet`],
        sol: R`AlexNet (Krizhevsky et al.) in 2012 opened the deep learning era in vision. Then ZFNet 11.7%, VGG 7.3%, GoogLeNet 6.7%, ResNet 3.6%.` },
      { q: R`What is the definition of top-5 error?`,
        choices: [R`The fraction where the probability of the correct class is below 5%`, R`The fraction where the correct class is not among the 5 classes the model ranks most probable`, R`The fraction wrong in all of 5 attempts`, R`The average error of the top 5 models`],
        sol: R`It counts as correct if any one of the top 5 predictions is the correct class.` },
      { q: R`Feeding a $227\times227\times3$ input to AlexNet's Conv1 (96 filters, $11\times11$, stride 4, pad 0), what is the width of the output?`,
        sol: R`$(227-11)/4+1=216/4+1=55$. The output is $55\times55\times96$.` },
      { q: R`What is the width of the output of $3\times3$, stride-2 max pooling on $55\times55\times96$?`,
        sol: R`$(55-3)/2+1=27$. The channels stay 96.` },
      { q: R`How many parameters (including biases) does AlexNet's Conv1 have?`,
        sol: R`One filter has $11\cdot11\cdot3=363$ weights + 1 bias, and 96 of them give $96\cdot364=34{,}944$.` },
      { q: R`How many weights (excluding biases) does AlexNet's FC6 have?`,
        sol: R`The input is MaxPool3's output $6\times6\times256=9216$ and the output is 4096. $9216\cdot4096=37{,}748{,}736$, so about 60% of the whole network's parameters are in this one layer.` },
      { q: R`What reason do the slides give for AlexNet using ReLU instead of the sigmoid or tanh?`,
        choices: [R`To make the outputs probabilities`, R`To avoid slow learning caused by saturating gradients`, R`To reduce the parameters`, R`To prevent overfitting`],
        sol: R`The sigmoid and tanh saturate for large inputs, their gradients get close to 0, and learning is slow. ReLU has gradient 1 on the positive side.` },
      { q: R`If the derivatives of the activation functions of ten layers are all $\frac14$, their product is $\frac1N$. What is $N$?`,
        sol: R`$(1/4)^{10}=1/4^{10}=1/1{,}048{,}576\approx9.54\times10^{-7}$. Since the largest derivative of the sigmoid is $\frac14$, this is the best case.` },
      { q: R`Stacking three stride-1 $3\times3$ convolutions, what is the side of the receptive field of one output cell?`,
        sol: R`It widens by 2 per layer: $3\to5\to7$.` },
      { q: R`With $C$ channels everywhere, what is the ratio (former/latter) of the weights of three $3\times3$ layers and one $7\times7$ layer? (4 decimal places)`,
        sol: R`$3\cdot9C^2/(49C^2)=27/49\approx0.5510$. The same receptive field with about 55% of the parameters.` },
      { q: R`With a $28\times28\times256$ input to the naive inception module ($1\times1$ 128, $3\times3$ 192, $5\times5$ 96, $3\times3$ max pooling), how many output channels are there?`,
        sol: R`The pooling branch passes the input's 256 channels through, so $128+192+96+256=672$.` },
      { q: R`How many weights (excluding biases) does the naive inception module above have?`,
        sol: R`$256\cdot128+9\cdot256\cdot192+25\cdot256\cdot96=32{,}768+442{,}368+614{,}400=1{,}089{,}536$.` },
      { q: R`How many weights (excluding biases) does the bottleneck inception module ($1\times1$ 64 inserted in three branches) have?`,
        sol: R`$32{,}768+16{,}384+110{,}592+16{,}384+153{,}600+16{,}384=346{,}112$. The slide's “about 330k” leaves out one $1\times1\times256\times64$.` },
      { q: R`Using $K$ filters of size $1\times1\times C$ on a $W\times H\times C$ feature is the same as`,
        choices: [R`global pooling that averages each channel separately`, R`a pixel-wise embedding multiplying each pixel's $C$-dimensional vector by the same $K\times C$ matrix`, R`using one more $3\times3$ convolution`, R`flattening the feature into one fully connected layer`],
        sol: R`The output at $(i,j)$ is $Wx_{ij}+b$ ($W\in\mathbb R^{K\times C}$), and $W$ is shared by every pixel. If $K<C$ it reduces the dimension.` },
      { q: R`What does the fact that the 56-layer plain network also had higher **training** error than the 20-layer plain network mean?`,
        choices: [R`It is overfitting`, R`It is not overfitting but a problem of hard optimization`, R`There is not enough data`, R`The learning rate is too small`],
        sol: R`With overfitting, the training error would be low and only the test error high. Since it cannot fit even the training data, it is an optimization problem.` },
      { q: R`How many weights (excluding biases) does a bottleneck residual block ($1\times1$ 64 → $3\times3$ 64 → $1\times1$ 256) on a 256-channel input have?`,
        sol: R`$256\cdot64+9\cdot64^2+64\cdot256=69{,}632$. About the same as a 64-channel plain block ($2\cdot9\cdot64^2=73{,}728$).` },
      { q: R`For residual blocks $\mathbf h^{(k+1)}=\mathbf h^{(k)}+F_k(\mathbf h^{(k)})$ ($k=l,\dots,L-1$), show that $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}\prod_{k=l}^{L-1}\big(I+A_k\big)$ ($A_k=\partial F_k/\partial\mathbf h^{(k)}$), and explain that when all $\lVert A_k\rVert\le a<1$ the gradient of a plain network $\mathbf h^{(k+1)}=F_k(\mathbf h^{(k)})$ shrinks by a factor of at most $a^{L-l}$, while the product for the residual network contains $I$.`,
        sol: R`**Chain rule.** $\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}=I+A_k$. With the gradient as a row vector, $\frac{\partial J}{\partial\mathbf h^{(k)}}=\frac{\partial J}{\partial\mathbf h^{(k+1)}}(I+A_k)$, and repeating from $k=L-1$ down to $l$ gives $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}(I+A_{L-1})\cdots(I+A_l)$.
**Plain network.** $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}A_{L-1}\cdots A_l$, so $\big\lVert\frac{\partial J}{\partial\mathbf h^{(l)}}\big\rVert\le a^{L-l}\big\lVert\frac{\partial J}{\partial\mathbf h^{(L)}}\big\rVert\to0$ (exponential vanishing).
**Residual network.** Expanding the product gives $I+\sum_kA_k+\sum_{j<k}A_kA_j+\cdots+A_{L-1}\cdots A_l$, and the first term $I$ passes $\frac{\partial J}{\partial\mathbf h^{(L)}}$ through as is. Unless the remaining terms cancel it exactly, the gradient does not vanish.`,
        rubric: R`- The block Jacobian $I+A_k$ and the product from the chain rule — 2 pts
- The $a^{L-l}$ bound for the plain network — 1 pt
- The expansion and the meaning of the $I$ term — 2 pts` },
      { q: R`A saliency map draws the size of`,
        choices: [R`the gradient of the loss with respect to the weights`, R`the gradient of the class score $S_c$ with respect to the input pixels, $\partial S_c/\partial I$`, R`the weights of the first-layer filters`, R`the activations of the last layer`],
        sol: R`It is the sensitivity of the score changes with respect to changes in the pixels, obtained by backpropagating to the input with the weights fixed.` },
      { q: R`Explain with a first-order Taylor expansion of the score $S_c(I)$ near an image $I_0$ why the saliency map is $\big\lvert\partial S_c/\partial I\big\rvert$, and state what the map becomes for a linear model $S_c(I)=w_c^TI+b_c$.`,
        sol: R`$S_c(I)\approx S_c(I_0)+w^T(I-I_0)$ with $w=\frac{\partial S_c}{\partial I}\big|_{I_0}$. Changing pixel $p$ by $\delta$ changes the score by about $w_p\delta$, so the larger $|w_p|$, the more sensitively that pixel contributes to the decision. For a linear model $w=w_c$, so the map is the class weights themselves, independent of the input.`,
        rubric: R`- First-order Taylor expansion — 2 pts
- Interpretation as sensitivity — 1 pt
- The linear model case — 1 pt` },
    ],
  };
})();

(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '층을 쌓았더니 오차가 늘었다': 'Stacking layers made the error grow',
    '오차 (%)': 'error (%)',
    '(a) 일반 망 (CIFAR-10)': '(a) Plain network (CIFAR-10)', '(b) 잔차 망': '(b) Residual network',
    '56층 시험': '56-layer test', '20층 시험': '20-layer test', '56층 훈련': '56-layer train', '20층 훈련': '20-layer train',
    '110층 시험': '110-layer test', '110층 훈련': '110-layer train',
    'GoogLeNet의 전체 구조': 'The whole GoogLeNet',
    '합성곱 줄기': 'conv stem', '+ 풀링': '+ pooling', '인셉션': 'inception',
    '풀링': 'pool', '평균': 'avg', '선형': 'linear', '+ 소프트맥스': '+ softmax',
    '입력 224×224×3 → 합성곱 줄기 → 인셉션 9개 → 전역 평균 풀링 → 선형 → 클래스': 'input 224×224×3 → conv stem → 9 inception modules → global average pooling → linear → classes',
    '큰 완전연결층이 없어 매개변수가 AlexNet의 약 1/12': 'No big fully connected layers: about 1/12 of AlexNet’s parameters',
    '현저성 지도의 계산 흐름': 'How a saliency map is computed',
    '이미지': 'image', '점수': 'score', '순전파: 이미지 → 클래스 점수': 'Forward: image → class score',
    '역전파: 점수에서 시작해 입력 화소까지 연쇄법칙': 'Backward: chain rule from the score down to the input pixels',
    '를 화소마다 그린 것이 현저성 지도': 'plotted at each pixel is the saliency map',
  });
  Object.assign(EM.en.fig, {
    depthfail: R`A schematic redrawing of the shapes of the curves on slides 45–46 and 51 (values are for illustration). (a) A plain stack of 56 layers has higher **test** error than 20 layers, and also higher **training** error (dashed): it is not overfitting but a harder optimization. (b) With residual connections, the deeper network (110 layers) has lower training and test error. The horizontal axis is the number of iterations (×10⁴), and the sudden drops are where the learning rate is cut.`,
    googlenet: R`A summary of the structure on slides 41–42. The early part is a few simple convolution layers (the stem); higher up, inception modules are stacked with occasional pooling for downsampling. The end is global average pooling and one linear layer, so there is no AlexNet-style giant fully connected layer, and with 22 layers it has about one twelfth of AlexNet’s parameters. The grouping of modules (3a–3b, 4a–4e, 5a–5b) follows the original paper.`,
    saliency: R`The diagram of slides 53–55. An image $I$ passes through layers $F^{(1)},\dots,F^{(L)}$ to become the class score $S_c(I)$ (forward, top). The same chain rule applied backwards gives the gradient $\frac{\partial S_c}{\partial I}$ from the score down to the input pixels (backward, bottom). Unlike training, the weights stay fixed and only the gradient with respect to the input is computed.`,
  });
})();
