/* English text — proofs for Units 15–16: the convolutional networks of W5 Mon (3) and W6 Wed
   (output size, parameters, equivariance, small filters, inception, residual connections, saliency maps). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.pf, {
  // ───── 15
  'ch15-outsize': { title: 'Deriving the Output Size Formula of a Convolution',
    stmt: R`Applying a filter of size $K$ with stride $S$ to an input of length $N$ padded by $P$ gives an output of length $\big\lfloor\frac{N-K+2P}{S}\big\rfloor+1$, which is $\frac{N-K+2P}{S}+1$ when the division is exact. With stride 1 and odd $K$, the output length is $N$ when $P=\frac{K-1}2$.`,
    body: R`
Number the cells of the padded input $0,1,\dots,N+2P-1$. If the first cell of the filter is on cell $s$, the filter uses cells $s,s+1,\dots,s+K-1$. With stride $S$, the positions are $s=mS$ ($m=0,1,2,\dots$).
For the filter to stay inside the input we need $mS+K-1\le N+2P-1$, that is, $m\le\frac{N+2P-K}{S}$. The integers $m$ satisfying this are $0,1,\dots,\big\lfloor\frac{N+2P-K}{S}\big\rfloor$, so their number, the output length, is
$$N'=\Big\lfloor\frac{N-K+2P}{S}\Big\rfloor+1$$
If $S$ divides $N-K+2P$, the floor is unnecessary.
**Size preservation.** With $S=1$, $N'=N-K+2P+1$, and $N'=N\iff2P=K-1\iff P=\frac{K-1}2$. $K$ must be odd for $P$ to be an integer.`,
    note: R`Applying it separately to width and height gives a 2D output $N'\times N'$, and the output depth is the number of filters. Pooling follows the same formula (usually with $P=0$).` },
  'ch15-convparams': { title: 'The Number of Parameters of a Convolution Layer',
    stmt: R`A convolution layer with $C_{\text{out}}$ filters of size $K\times K$ (including biases) on an input $N\times N\times C_{\text{in}}$ has $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$ parameters, independent of $N$. A fully connected layer with the same input and output sizes needs $N^2C_{\text{in}}\cdot N'^2C_{\text{out}}+N'^2C_{\text{out}}$.`,
    body: R`
The $(x,y)$ entry of the $c$-th output activation map is
$$G_c[x,y]=\sum_{i=0}^{K-1}\sum_{j=0}^{K-1}\sum_{d=1}^{C_{\text{in}}}w_c[i,j,d]\,F[x+i,\ y+j,\ d]+b_c$$
and the filter $w_c$ and bias $b_c$ do not depend on the position $(x,y)$ (weight sharing). So one activation map needs the $K\cdot K\cdot C_{\text{in}}$ numbers of $w_c$ and one $b_c$, and with $C_{\text{out}}$ maps the total is $C_{\text{out}}(K^2C_{\text{in}}+1)$. There is no $N$ in this expression, so it does not depend on the width and height of the input.
**Comparison with fully connected.** If each of the $N'^2C_{\text{out}}$ output components had its own weight for every one of the $N^2C_{\text{in}}$ input components, there would be $N^2C_{\text{in}}\cdot N'^2C_{\text{out}}$ weights and $N'^2C_{\text{out}}$ biases. A convolution layer reduces this number because (1) each output sees only a $K\times K\times C_{\text{in}}$ patch (local connectivity) and (2) every position uses the same weights (sharing).`,
    note: R`The example of the slides: one $5\times5\times3$ filter has $75+1=76$, six have 456. Making the same output $28\times28\times6$ from $32\times32\times3$ fully connected would take $3072\cdot4704\approx1.4\times10^7$ weights alone.` },
  'ch15-equivar': { title: 'Translation Equivariance of Convolution',
    stmt: R`For the translation $(g_{a,b}\cdot F)[x,y]=F[x-a,\ y-b]$ and the convolution $f(F)[x,y]=\sum_{i,j}w[i,j]F[x+i,\ y+j]$ (an infinitely wide image), $f(g_{a,b}\cdot F)=g_{a,b}\cdot f(F)$. Also $p\circ f$, which follows $f$ with global max pooling $p(G)=\max_{x,y}G[x,y]$, is translation invariant.`,
    body: R`
**Equivariance.** For every $(x,y)$,
$$f(g_{a,b}\cdot F)[x,y]=\sum_{i,j}w[i,j]\,(g_{a,b}\cdot F)[x+i,\ y+j]=\sum_{i,j}w[i,j]\,F[x+i-a,\ y+j-b]=f(F)[x-a,\ y-b]=\big(g_{a,b}\cdot f(F)\big)[x,y].$$
The third equality puts $(x-a,y-b)$ in place of $(x,y)$ in the definition of $f(F)$, which is possible because $w[i,j]$ does not depend on the position (weight sharing).
**Invariance.** A translation only moves the cells and does not change the set of values, so $\max_{x,y}(g\cdot G)[x,y]=\max_{x,y}G[x,y]$. Therefore $p(f(g\cdot F))=p(g\cdot f(F))=p(f(F))$.
**Without sharing it breaks.** With different weights $w_{x,y}[i,j]$ at each position, the third equality becomes $\sum_{i,j}w_{x,y}[i,j]F[x+i-a,y+j-b]$, which in general differs from $\sum_{i,j}w_{x-a,y-b}[i,j]F[x-a+i,y-b+j]=f(F)[x-a,y-b]$.`,
    note: R`Real images are finite, so near the border (zero padding) equivariance is not exact, and with stride $S>1$ it holds only for shifts by multiples of $S$. Local max pooling is invariant only approximately, for small shifts within a window.` },
  // ───── 16
  'ch16-stack3': { title: 'Receptive Field and Parameters of Stacked 3×3 Convolutions',
    stmt: R`Stacking $n$ layers of stride-1 $3\times3$ convolutions gives one output cell a receptive field of $(2n+1)\times(2n+1)$. If all layers have $C$ channels, there are $9nC^2$ weights, fewer than the $(2n+1)^2C^2$ of one $(2n+1)\times(2n+1)$ convolution with the same receptive field ($n\ge2$).`,
    body: R`
**Receptive field.** Look at one direction. Let $r_n$ be the number of input cells one output cell sees after $n$ layers. $r_1=3$. One output cell of layer $n$ sees 3 consecutive cells of layer $n-1$, each of which sees $r_{n-1}$ consecutive input cells, and the ranges of two neighboring cells are offset by 1 cell because the stride is 1. So the combined range is $r_{n-1}+2$ cells, that is, $r_n=r_{n-1}+2=2n+1$. Width and height are the same, giving $(2n+1)\times(2n+1)$.
**Parameters.** Each layer has $3\cdot3\cdot C\cdot C=9C^2$, so $n$ layers have $9nC^2$. One layer with the same receptive field has $(2n+1)^2C^2$. For $n\ge2$, $(2n+1)^2-9n=4n^2-5n+1=(4n-1)(n-1)>0$, so stacking uses fewer. $n=2$: $18C^2<25C^2$; $n=3$: $27C^2<49C^2$.`,
    note: R`Since ReLU sits between the layers, the stacked network has more nonlinearity than one large-filter layer (linear + one ReLU). This is why VGG made every layer $3\times3$ (the slides give only the conclusion).` },
  'ch16-inception': { title: 'The Number of Parameters of an Inception Module',
    stmt: R`For an input $28\times28\times256$ (excluding biases), the naive inception module ($1\times1$ 128, $3\times3$ 192, $5\times5$ 96, $3\times3$ max pooling) has $1{,}089{,}536$ weights and output $28\times28\times672$. The bottleneck module, with $1\times1$ convolutions (64) before the $3\times3$ and $5\times5$ and after the pooling, has $346{,}112$ and output $28\times28\times480$.`,
    body: R`
A convolution layer has $K^2C_{\text{in}}C_{\text{out}}$ weights and pooling 0. Every branch uses stride 1 and size-preserving padding to keep $28\times28$, so the output channels are the sum of the branch output channels.
**Naive.** $1\cdot256\cdot128+9\cdot256\cdot192+25\cdot256\cdot96=32{,}768+442{,}368+614{,}400=1{,}089{,}536$. The pooling branch outputs the input's 256 channels as is, so the output has $128+192+96+256=672$ channels.
**Bottleneck.** $3\times3$ branch: $1\cdot256\cdot64+9\cdot64\cdot192=16{,}384+110{,}592$. $5\times5$ branch: $16{,}384+25\cdot64\cdot96=16{,}384+153{,}600$. Pooling branch: $1\cdot256\cdot64=16{,}384$. $1\times1$ branch: $32{,}768$. Total $346{,}112$, output $128+192+96+64=480$ channels.
The ratio is $346{,}112/1{,}089{,}536\approx0.318$, and most of the saving comes from the $5\times5$ branch ($614{,}400\to169{,}984$) and the $3\times3$ branch ($442{,}368\to126{,}976$), because the expensive spatial convolutions are computed on 64 channels instead of 256.`,
    note: R`Slide 40 writes the bottleneck module as “about 330k”, which is $329{,}728$, the sum with one $1\times1\times256\times64$ left out. Counting all six convolutions gives $346{,}112$.` },
  'ch16-resgrad': { title: 'Residual Connections and Gradient Flow',
    stmt: R`If $\mathbf h^{(k+1)}=\mathbf h^{(k)}+F_k(\mathbf h^{(k)})$ ($k=l,\dots,L-1$), then $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}\prod_{k=l}^{L-1}(I+A_k)$ ($A_k=\frac{\partial F_k}{\partial\mathbf h^{(k)}}$), and expanding the product contains $\frac{\partial J}{\partial\mathbf h^{(L)}}$ as is. For a plain network $\mathbf h^{(k+1)}=F_k(\mathbf h^{(k)})$ with $\lVert A_k\rVert\le a<1$, $\big\lVert\frac{\partial J}{\partial\mathbf h^{(l)}}\big\rVert\le a^{L-l}\big\lVert\frac{\partial J}{\partial\mathbf h^{(L)}}\big\rVert$.`,
    body: R`
Write gradients as row vectors. The chain rule gives $\frac{\partial J}{\partial\mathbf h^{(k)}}=\frac{\partial J}{\partial\mathbf h^{(k+1)}}\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}$[[ch09:9.5|Vector inputs and outputs, and the Jacobian.]].
**Residual.** $\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}=\frac{\partial\mathbf h^{(k)}}{\partial\mathbf h^{(k)}}+\frac{\partial F_k}{\partial\mathbf h^{(k)}}=I+A_k$. Substituting in the order $k=L-1,L-2,\dots,l$ gives
$$\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}(I+A_{L-1})(I+A_{L-2})\cdots(I+A_l).$$
Expanding the product gives the form $I+\sum_kA_k+\sum_{j>k}A_jA_k+\cdots$, so $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}+\frac{\partial J}{\partial\mathbf h^{(L)}}\big(\sum_kA_k+\cdots\big)$. The first term is the gradient of the upper layer with no Jacobian multiplied at all.
**Plain network.** $\frac{\partial\mathbf h^{(k+1)}}{\partial\mathbf h^{(k)}}=A_k$, so $\frac{\partial J}{\partial\mathbf h^{(l)}}=\frac{\partial J}{\partial\mathbf h^{(L)}}A_{L-1}\cdots A_l$, and repeating the norm product inequality $\lVert vA\rVert\le\lVert v\rVert\lVert A\rVert$ gives $\le a^{L-l}\big\lVert\frac{\partial J}{\partial\mathbf h^{(L)}}\big\rVert$. For large $L-l$ it is exponentially close to 0.`,
    note: R`Even in a residual network, a special case where the remaining terms cancel the first term is possible in theory, but early in training, when the weights of $F_k$ are initialized small, $A_k\approx0$ and the gradient passes through almost unchanged. That is why even hundreds of layers can be trained.` },
  'ch16-saliency': { title: 'A Saliency Map Is the Input Gradient of the Score',
    stmt: R`For the class score $S_c(I)=[F^{(L)}\circ\cdots\circ F^{(1)}](I)_c$, $\frac{\partial S_c}{\partial I}=\big[\frac{\partial F^{(L)}}{\partial F^{(L-1)}}\cdots\frac{\partial F^{(1)}}{\partial I}\big]_c$ (the $c$-th row), and near $I_0$, $S_c(I)=S_c(I_0)+w^T(I-I_0)+o(\lVert I-I_0\rVert)$ with $w=\frac{\partial S_c}{\partial I}\big|_{I_0}$.`,
    body: R`
**Chain rule.** The Jacobian of the composition $F^{(1)}=F^{(1)}(I)$, $F^{(k)}=F^{(k)}(F^{(k-1)})$ is the product of the Jacobians of the steps: $\frac{\partial F^{(L)}}{\partial I}=\frac{\partial F^{(L)}}{\partial F^{(L-1)}}\cdots\frac{\partial F^{(2)}}{\partial F^{(1)}}\frac{\partial F^{(1)}}{\partial I}$. $S_c$ is the $c$-th component of $F^{(L)}$, so the $c$-th row of this matrix is $\frac{\partial S_c}{\partial I}$. As in backpropagation, the computation multiplies the row vector $e_c^T$ by the Jacobians in turn from the left, so one forward pass and one backward pass suffice.
**First-order approximation.** If $S_c$ is differentiable at $I_0$, the definition of the derivative gives $S_c(I)=S_c(I_0)+\nabla S_c(I_0)^T(I-I_0)+o(\lVert I-I_0\rVert)$[[ch13:13.1|First-order Taylor expansion.]]. Changing only pixel $p$ by $\delta$ changes the score by $w_p\delta+o(\delta)$, so $|w_p|$ is the sensitivity of the score to that pixel. Drawing this $|w|$ in the shape of the image is the saliency map.`,
    note: R`For color images, using for each pixel the largest $|w|$ among its three channels is the method of Simonyan et al. (2014). A ReLU network is piecewise linear, so $w$ is the weight of the linear piece the input lies in, and for a linear classifier $S_c=w_c^TI+b_c$, $w=w_c$.` },
  });
})();
