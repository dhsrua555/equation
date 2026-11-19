/* English text — 23 Generative Models: Maximum Likelihood, ELBO, VAE (W11 Mon slides 1–22 and notes, W11 Wed slides 18–72 and notes). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '왼쪽 위에서부터 한 줄씩': 'row by row from the top left',
    '이미 만든 픽셀 (조건)': 'pixels already made (condition)',
    '지금 만드는 픽셀': 'pixel being made now',
    '아직 없는 픽셀': 'pixels not made yet',
    '마스크 합성곱 3×3': '3×3 masked convolution',
    '가운데와 뒤쪽은 0': 'center and later are 0',
    '앞쪽 문맥만 본다': 'sees only earlier context',
    '자기회귀 모델의 픽셀 순서': 'Pixel order of an autoregressive model',
    '잠재 공간 (d차원)': 'latent space (d dimensions)',
    '디코더 (신경망)': 'decoder (neural network)',
    '데이터 공간 (D차원, D ≫ d)': 'data space (D dimensions, D ≫ d)',
    '유효한 이미지는 얇은 일부분': 'valid images form a thin subset',
    '잠재 변수 모델의 생성': 'Generation in a latent variable model',
    '입력': 'input',
    '인코더': 'encoder',
    '병목 (d차원)': 'bottleneck (d dimensions)',
    '디코더': 'decoder',
    '복원': 'reconstruction',
    '손실': 'loss',
    '정답 표시가': 'no labels',
    '필요 없다': 'needed',
    '(자기 지도)': '(self-supervised)',
    '오토인코더': 'Autoencoder',
    '사후분포와 다르면 틈이 있다': 'a gap when q differs from the posterior',
    '사후분포와 같으면 틈이 0': 'no gap when q is the posterior',
    'ELBO와 KL 틈': 'The ELBO and the KL gap',
    '최소: σ² = 1에서 0': 'minimum: 0 at σ² = 1',
    'σ² = 1에서 ½μ²': '½μ² at σ² = 1',
    '가우시안 KL의 모양': 'Shape of the Gaussian KL',
    '밖에서 뽑는 잡음': 'noise drawn outside',
    '기울기는 z를 지나 μ, σ로': 'gradients pass through z to μ, σ',
    'μ, σ에 직접 걸리는 항': 'a term acting on μ, σ directly',
    '재매개변수화와 기울기의 길': 'Reparameterization and the gradient path',
  });
  Object.assign(EM.en.fig, {
    pixelorder: R`The generation order of an autoregressive image model (PixelRNN and PixelCNN, Week 11 Monday slides 10–11). The pixels are laid out row by row from the top left, and pixel $x_i$ is drawn from a distribution conditioned on the pixels already made, $\mathbf x_{<i}$. PixelCNN uses a masked convolution (right) whose center and later weights are zeroed so that it sees only the context; training computes every pixel at once, but generation is still one pixel at a time.`,
    latentgen: R`A latent variable model (Week 11 Monday and Wednesday slides 15–25). Most of pixel space $\mathbb R^D$ is noise, and valid images gather on a thin subset (the bold curve). Points drawn from a simple distribution $\mathbf z\sim\mathcal N(\mathbf 0,I)$ of low dimension $d\ll D$ and sent to data space by the neural decoder $f_\theta$ produce points on that subset.`,
    autoenc: R`An autoencoder (Week 11 Wednesday slides 37–41). The encoder shrinks the input $\mathbf x$ to a small latent vector $\mathbf z$, and the decoder reconstructs $\hat{\mathbf x}$ from $\mathbf z$. The loss is only the reconstruction error $\lVert\mathbf x-\hat{\mathbf x}\rVert^2$, so no labels are needed. The bottleneck keeps it from memorizing the identity function and makes it learn a summary of the data.`,
    elbogap: R`$\log p(x)=\mathrm{ELBO}(q)+\KL(q\,\|\,p(z\mid x))$ in the two-state model of the example in Section 23.5 ($p(z)=\tfrac12$, $p(x\mid z{=}1)=0.8$, $p(x\mid z{=}2)=0.2$). Left: with a uniform $q$ the ELBO lies $0.223$ below $\log p(x)$, and that gap is the KL to the posterior. Right: choosing $q$ as the posterior $(0.8,0.2)$ closes the gap, and the ELBO equals $\log p(x)$.`,
    gausskl: R`The one-dimensional $\KL(\N(\mu,\sigma^2)\,\|\,\N(0,1))=\tfrac12(\sigma^2+\mu^2-1-\log\sigma^2)$ plotted against $\sigma^2$. It is smallest at $\sigma^2=1$, where it equals $\tfrac12\mu^2$, and it is $0$ only for $\mu=0$, $\sigma^2=1$. As $\sigma^2\to0$ the $-\log\sigma^2$ term makes it blow up, which keeps the encoder from shrinking the variance to $0$.`,
    reparam: R`The VAE forward pass and the reparameterization (Week 11 Wednesday slide 68, notes). The encoder outputs $\mu_\phi(\mathbf x)$ and $\sigma_\phi(\mathbf x)$, the noise $\varepsilon\sim\N(\mathbf 0,I)$ is drawn outside to form $\mathbf z=\mu+\sigma\odot\varepsilon$, and the decoder outputs $\hat{\mathbf x}=f_\theta(\mathbf z)$. Since the randomness sits only in $\varepsilon$, the gradient of the loss $R$ flows through $\mathbf z$ to $\mu$ and $\sigma$ and on to $\phi$ (dashed). The KL term acts on $\mu$ and $\sigma$ directly.`,
  });
  EM.en.ch[23] = {
    title: 'Generative Models: Maximum Likelihood, ELBO, VAE',
    fig: R`The ELBO against the mean m of q = N(m, s²) after observing x = 2 in the model z ~ N(0, 1), x | z ~ N(z, 1). The horizontal line is log p(x) ≈ −2.27, and only the bold curve, which uses the true posterior variance s² = 0.5, touches it at m = 1. The other variances (thin lines, s² = 0.09, 0.25, 1) stay below it`,
    tagline: R`Generative models that learn the distribution of the data. Autoregressive models write $p(\mathbf x)$ exactly with the product rule, latent variable models maximize the lower bound ELBO because of an integral, and the VAE makes all three distributions Gaussian, turning the ELBO into a squared error plus a closed-form KL, and trains with the reparameterization trick.`,
    summary: R`Week 11 Monday introduced the two goals of generative modeling (density estimation and sampling), autoregressive models (PixelRNN and PixelCNN), and latent variable models, and showed in the notes that maximum likelihood minimizes $\KL(p_{data}\,\|\,p_\theta)$, using the law of large numbers and $H(p,q)=\KL(p\,\|\,q)+H(p)$. Week 11 Wednesday went through autoencoders, derived the ELBO $\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$ with Jensen’s inequality, showed that under the three VAE assumptions the reconstruction term becomes a squared error and the KL term becomes $\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$, and sent gradients back to the encoder with the reparameterization $\mathbf z=\mu+\sigma\odot\varepsilon$. The closed form of the Gaussian KL, which the lecture postponed to “later,” is proved here starting from one dimension.`,
    goals: [
      R`Explain the two goals of a generative model, compute joint probabilities and log-likelihoods with the autoregressive factorization, and explain the difference between the training and generation cost of PixelCNN`,
      R`Write the marginal likelihood and posterior of a latent variable model, compute them directly for a discrete latent variable, and explain what is hard in the continuous case`,
      R`Write the autoencoder loss, compute the reconstruction and loss of a linear autoencoder, and explain why an autoencoder alone has trouble generating`,
      R`Show with the law of large numbers and $H(p,q)=\KL(p\,\|\,q)+H(p)$ that maximum likelihood minimizes $\KL(p_{data}\,\|\,p_\theta)$`,
      R`Derive the ELBO with Jensen’s inequality, show that the gap is $\KL(q\,\|\,p(\mathbf z\mid\mathbf x))$, and compute it in a discrete example`,
      R`Write the three VAE assumptions, and prove that a Gaussian decoder gives a squared error and that $\KL(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I))=\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$`,
      R`Find the mean, variance, $\partial\mathbf z/\partial\mu$, and $\partial\mathbf z/\partial\sigma$ of the reparameterization $\mathbf z=\mu+\sigma\odot\varepsilon$ and compute a single-sample gradient`,
    ],
    secTitles: { '23.1': 'Autoregressive models', '23.2': 'Latent variables', '23.3': 'Autoencoders', '23.4': 'Max likelihood and KL', '23.5': 'ELBO', '23.6': 'VAE assumptions', '23.7': 'Reparameterization' },
    secs: {
      '23.1': { title: 'Generative Modeling and Autoregressive Models', body: R`
:::idea In plain words
A generative model learns a distribution $p_\theta$ that imitates the distribution $p_{data}$ that produced the data. If it learns well, we can draw new samples from $p_\theta$ and also measure, as a probability, how plausible a given $\mathbf x$ is. The trouble is that one image is a vector with thousands of dimensions, so writing down its distribution whole is hard; an autoregressive model splits it one dimension at a time with the product rule of probability.
:::

**Discriminative and generative models.** The classifiers so far were discriminative models that learn the distribution $p(y\mid\mathbf x)$ of the label $y$ given the input $\mathbf x$. A generative model receives only the $\mathbf x$'s, without labels, and learns the distribution $p(\mathbf x)$ of $\mathbf x$ itself. There are two goals. One is **density estimation**, assigning a probability $p_\theta(\mathbf x)$ to a new $\mathbf x$; the other is **sampling**, drawing a new $\mathbf x$ from $p_\theta$.

Generative models are divided by whether $p_\theta(\mathbf x)$ can be computed by a formula. Autoregressive models compute it exactly, the VAE computes only a lower bound, and some models, such as GANs, only draw samples and never write a density. This unit covers the first two.

:::key Autoregressive factorization
By the product rule the distribution of $\mathbf x=(x_1,\dots,x_D)$ can always be written as
$$p(\mathbf x)=\prod_{i=1}^Dp(x_i\mid x_1,\dots,x_{i-1})=\prod_{i=1}^Dp(x_i\mid\mathbf x_{<i}).$$
An autoregressive model represents each conditional $p_\theta(x_i\mid\mathbf x_{<i})$ by a neural network and is trained by maximizing the log-likelihood $\log p_\theta(\mathbf x)=\sum_i\log p_\theta(x_i\mid\mathbf x_{<i})$.
:::

**PixelRNN and PixelCNN.** For images the order is set by laying the pixels out row by row from the top left. Pixel values are integers from $0$ to $255$, so each conditional is a softmax over $256$ values. PixelRNN reads the earlier pixels with an LSTM to summarize the context, and PixelCNN uses a **masked convolution**, which zeroes the center and later weights, so it sees only earlier pixels. During training every pixel value is already in the data, so PixelCNN can compute all $D$ conditionals at once. During generation, however, $x_i$ must be drawn before the context of $x_{i+1}$ exists, so both models have to compute $D$ times in sequence.

:::fig pixelorder
:::

:::ex Example 1 — The probability of three pixels
For three binary pixels with $p(x_1=1)=0.6$, $p(x_2=0\mid x_1=1)=0.5$, and $p(x_3=0\mid x_1=1,x_2=0)=0.8$, what is $p(1,0,0)$?
---
By the product rule $p(1,0,0)=p(x_1=1)\,p(x_2=0\mid x_1=1)\,p(x_3=0\mid x_1=1,x_2=0)=0.6\cdot0.5\cdot0.8=0.24$. The log-likelihood is the sum of three terms, $\ln0.6+\ln0.5+\ln0.8\approx-1.427=\ln0.24$.
:::

:::ex Example 2 — Steps needed to generate
If a $32\times32$ color image is made autoregressively one channel value at a time, how many sequential evaluations of the network are needed?
---
There are $32\cdot32\cdot3=3072$ values and each uses the earlier values as context, so $3072$. Contrast this with training, where PixelCNN obtains all $3072$ conditionals in one forward pass.
:::

### Going deeper

The product rule holds for every distribution, so the autoregressive factorization itself is not an approximation. Writing the joint distribution of $D$ binary pixels as a table takes $2^D-1$ independent parameters, and writing every conditional as a table takes $1+2+\dots+2^{D-1}=2^D-1$ as well. What makes autoregressive models practical is not the factorization but the fact that all conditionals share the parameters of one network.
` },
      '23.2': { title: 'Latent Variable Models', body: R`
:::idea In plain words
A photo of a cat has tens of thousands of pixels but is really determined by a few factors such as pose, fur color, and lighting. A latent variable model makes these factors a hidden variable $\mathbf z$, draws $\mathbf z$ first, and then makes $\mathbf x$ from $\mathbf z$. Drawing is easy, but finding the probability of a given $\mathbf x$ requires adding up every $\mathbf z$ that could have made it, which is hard.
:::

**A thin subset.** Pick a random point in $D$-dimensional pixel space and it is almost always noise. Natural images gather on a thin subset, and points on it move with far fewer factors. So it is natural to start from a variable $\mathbf z$ of low dimension $d\ll D$ and send it to data space with a neural network.

:::key Latent variable model
With a prior $p(\mathbf z)$ on the latent variable $\mathbf z\in\mathbb R^d$ (usually $\N(\mathbf 0,I)$) and a decoder $p_\theta(\mathbf x\mid\mathbf z)$, define
$$p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)\,p(\mathbf z)\,d\mathbf z.$$
Samples are drawn in turn, $\mathbf z\sim p(\mathbf z)$ and then $\mathbf x\sim p_\theta(\mathbf x\mid\mathbf z)$. The posterior is $p_\theta(\mathbf z\mid\mathbf x)=p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/p_\theta(\mathbf x)$.
:::

:::fig latentgen
:::

**What is hard.** Drawing is easy because it is two steps in turn. The hard part is the integral $p_\theta(\mathbf x)$. If $\mathbf z$ takes finitely many values the integral is a sum (a Gaussian mixture model is this case), but if $\mathbf z$ is continuous and the decoder is a neural network there is no closed form. The posterior $p_\theta(\mathbf z\mid\mathbf x)$ cannot be computed either, since $p_\theta(\mathbf x)$ is in its denominator. The simplest approach is the Monte Carlo approximation
$$p_\theta(\mathbf x)\approx\frac1K\sum_{k=1}^Kp_\theta(\mathbf x\mid\mathbf z_k),\qquad\mathbf z_k\sim p(\mathbf z)$$
but in high dimensions most $\mathbf z_k$ drawn from the prior barely explain $\mathbf x$, so $p_\theta(\mathbf x\mid\mathbf z_k)\approx0$ and a huge $K$ is needed. Section 23.5 gets around this with a distribution $q(\mathbf z\mid\mathbf x)$ that looks at $\mathbf x$ and picks only plausible $\mathbf z$.

:::ex Example 3 — A discrete latent variable
With $z\in\{1,2\}$, $p(z=1)=0.3$, $p(x=1\mid z=1)=0.9$, and $p(x=1\mid z=2)=0.2$, what are $p(x=1)$ and $p(z=1\mid x=1)$?
---
$p(x=1)=0.3\cdot0.9+0.7\cdot0.2=0.27+0.14=0.41$. By Bayes’ rule $p(z=1\mid x=1)=0.27/0.41\approx0.659$. Since $z$ has only two values the integral is a sum of two terms, but when $\mathbf z$ is continuous and high-dimensional this sum becomes an integral we cannot compute.
:::
` },
      '23.3': { title: 'Autoencoders and Generation', body: R`
:::idea In plain words
An autoencoder learns to shrink the input to a small code and bring it back. The code is smaller than the input, so it cannot simply memorize; it has to keep only the summary needed for reconstruction. Needing no labels is its strength, but because we do not know what distribution the codes follow, detaching the decoder to make new images is hard.
:::

**Structure.** The encoder $g_\phi:\mathbb R^D\to\mathbb R^d$ outputs $\mathbf z=g_\phi(\mathbf x)$, and the decoder $f_\theta:\mathbb R^d\to\mathbb R^D$ reconstructs $\hat{\mathbf x}=f_\theta(\mathbf z)$. The $\mathbf z$ with $d<D$ is called the bottleneck.

:::key Autoencoder loss
For data $\mathbf x_1,\dots,\mathbf x_N$, solve
$$\min_{\phi,\theta}\ \frac1N\sum_{i=1}^N\big\lVert\mathbf x_i-f_\theta(g_\phi(\mathbf x_i))\big\rVert^2.$$
Only the inputs appear in the loss, so no labels are needed (self-supervised learning).
:::

:::fig autoenc
:::

**Linear autoencoders.** If both the encoder and decoder are linear with $d=1$, $g(\mathbf x)=\mathbf w^T\mathbf x$, $f(z)=z\mathbf w$ ($\lVert\mathbf w\rVert=1$), the reconstruction is the orthogonal projection of $\mathbf x$ onto the direction $\mathbf w$, and the loss is $\lVert\mathbf x\rVert^2-(\mathbf w^T\mathbf x)^2$. Minimizing the sum is maximizing $\sum_i(\mathbf w^T\mathbf x_i)^2$, that is, finding the first direction of principal component analysis (PCA). A nonlinear autoencoder can be seen as extending this to curved surfaces.

:::ex Example 4 — Shrinking to one direction
With $\mathbf w=\frac1{\sqrt2}(1,1)$ and $\mathbf x=(3,1)$, what are the code, reconstruction, and loss of the linear autoencoder?
---
$z=\mathbf w^T\mathbf x=\frac4{\sqrt2}=2\sqrt2$, $\hat{\mathbf x}=z\mathbf w=(2,2)$, and the loss is $\lVert(3,1)-(2,2)\rVert^2=1+1=2$. The formula gives the same, $\lVert\mathbf x\rVert^2-z^2=10-8=2$.
:::

**Uses and limits.** A trained encoder serves as a feature extractor for problems with few labels: attach a classifier after the encoder and fine-tune with a few labels. Can the decoder then make new images? The problem is that we do not know where to draw the $\mathbf z$ to feed it. The codes of the training data are scattered over only part of code space, and feeding a point between them can give a meaningless output. Training the codes to follow a fixed distribution such as $\N(\mathbf 0,I)$ is what the VAE does (Section 23.6).
` },
      '23.4': { title: 'Maximum Likelihood Is KL Minimization', body: R`
:::idea In plain words
Maximum likelihood picks “the parameters that give the data we have the highest probability.” As the data grow, this becomes the same as fitting the model distribution $p_\theta$ as close as possible to the true distribution $p_{data}$ in the sense of the KL divergence. That is why generative models are trained by maximum likelihood.
:::

:::hand Lecture note — From maximum likelihood to KL
If the data $\mathbf x_1,\dots,\mathbf x_N\sim p_{data}$ are independent,
$$\theta^*=\argmax_\theta\prod_{i=1}^Np_\theta(\mathbf x_i)=\argmax_\theta\frac1N\sum_{i=1}^N\log p_\theta(\mathbf x_i).$$
By the law of large numbers, as $N\to\infty$, $\frac1N\sum_i\log p_\theta(\mathbf x_i)\to\E_{p_{data}}[\log p_\theta(\mathbf x)]$, so
$$\theta^*\approx\argmin_\theta\E_{p_{data}}[-\log p_\theta(\mathbf x)]=\argmin_\theta H(p_{data},p_\theta)=\argmin_\theta\big[\KL(p_{data}\,\|\,p_\theta)+H(p_{data})\big].$$
$H(p_{data})$ does not depend on $\theta$, so the last expression is $\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$.
:::

:::key Maximum likelihood and KL
The cross entropy splits as $H(p,q)=\KL(p\,\|\,q)+H(p)$, so with plenty of data the maximum likelihood estimate is
$$\argmax_\theta\frac1N\sum_{i=1}^N\log p_\theta(\mathbf x_i)\ \approx\ \argmin_\theta\KL(p_{data}\,\|\,p_\theta).$$
Since $\KL\ge0$ with $0$ only when $p_\theta=p_{data}$, the best $p_\theta$ is $p_{data}$ when the model is rich enough.
:::

The split of the cross entropy and $\KL\ge0$ were covered in Unit 3[[ch03:3.5|Cross entropy.]]. Using the cross-entropy loss in classification is the same story applied to $p(y\mid\mathbf x)$.

:::ex Example 5 — Maximum likelihood for a coin
A coin is tossed $10$ times and lands heads $7$ times. What is the maximum likelihood estimate for the model $p_\theta(1)=\theta$? And with $p_{data}(1)=0.7$, what are $\KL(p_{data}\,\|\,p_\theta)$ and the cross entropy for $\theta=0.5$?
---
Setting the derivative of the log-likelihood $7\ln\theta+3\ln(1-\theta)$, $\frac7\theta-\frac3{1-\theta}$, to $0$ gives $\theta^*=0.7$. $\KL=0.7\ln\frac{0.7}{0.5}+0.3\ln\frac{0.3}{0.5}\approx0.2355-0.1532=0.0823$ and $H(p_{data})=-0.7\ln0.7-0.3\ln0.3\approx0.6109$, so their sum $0.6931=\ln2$ equals the cross entropy $-0.7\ln0.5-0.3\ln0.5$.
:::

### Going deeper

Why $\KL(p_{data}\,\|\,p_\theta)$ and not the reverse direction $\KL(p_\theta\,\|\,p_{data})$? The reverse direction requires $\E_{p_\theta}[\log p_{data}]$, but we do not know the density $p_{data}$. The forward direction needs only samples from $p_{data}$, so it can be computed from data. The forward KL punishes heavily wherever $p_{data}>0$ but $p_\theta\approx0$, so a model trained by maximum likelihood tries to cover every place where data lie.
` },
      '23.5': { title: 'ELBO: A Lower Bound from Jensen’s Inequality', body: R`
:::idea In plain words
The $\log p_\theta(\mathbf x)$ of a latent variable model cannot be computed directly because of the integral. Instead, insert a distribution $q_\phi(\mathbf z\mid\mathbf x)$ that looks at $\mathbf x$ and guesses $\mathbf z$; Jensen’s inequality then gives a computable lower bound. This bound is the ELBO (evidence lower bound), and the difference between the bound and the true value is a KL measuring how far $q_\phi$ is from the true posterior.
:::

:::hand Lecture note — Building a lower bound with Jensen’s inequality
Multiplying and dividing by any distribution with $q_\phi(\mathbf z\mid\mathbf x)>0$ gives
$$\log p_\theta(\mathbf x)=\log\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z=\log\E_{q_\phi(\mathbf z\mid\mathbf x)}\Big[\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big].$$
Since $\log$ is concave, Jensen’s inequality $\log\E[Y]\ge\E[\log Y]$ gives
$$\log p_\theta(\mathbf x)\ge\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]+\E_{q_\phi}\Big[\log\frac{p(\mathbf z)}{q_\phi(\mathbf z\mid\mathbf x)}\Big]=\E_{q_\phi}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z)).$$
The notes put an arrow next to the first term saying it becomes $\lVert\hat{\mathbf x}-\mathbf x\rVert^2$, and wrote $\N(\mathbf 0,I)$ next to $p(\mathbf z)$ in the second term, marking the assumptions of Section 23.6 in advance.
:::

:::key ELBO
For any distribution $q_\phi(\mathbf z\mid\mathbf x)$,
$$\log p_\theta(\mathbf x)\ \ge\ \mathrm{ELBO}=\E_{q_\phi(\mathbf z\mid\mathbf x)}[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z)),$$
and the gap is exactly $\log p_\theta(\mathbf x)-\mathrm{ELBO}=\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p_\theta(\mathbf z\mid\mathbf x))\ge0$. The first term is the reconstruction term, and the second is a regularization term pulling $q_\phi$ toward the prior.
:::

:::fig elbogap
:::

**The training objective** (slide 57). Instead of the log-likelihood, maximize the ELBO over all the data.
$$\max_{\theta,\phi}\ \frac1N\sum_{i=1}^N\Big(\E_{q_\phi(\mathbf z\mid\mathbf x^{(i)})}[\log p_\theta(\mathbf x^{(i)}\mid\mathbf z)]-\KL(q_\phi(\mathbf z\mid\mathbf x^{(i)})\,\|\,p(\mathbf z))\Big)$$
Raising it through $\theta$ lifts the $\log p_\theta(\mathbf x)$ above the bound along with it; raising it through $\phi$ leaves $\log p_\theta(\mathbf x)$ unchanged, so the gap, the KL to the posterior, shrinks. One objective both trains the model and approximates the posterior.

:::ex Example 6 — Measuring the gap with two states
With $z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.8$, and $p(x\mid z=2)=0.2$, what are $\log p(x)$, the ELBO of a uniform $q$, and the gap?
---
$p(x)=\frac12(0.8+0.2)=0.5$, so $\log p(x)=\ln0.5\approx-0.693$. For a uniform $q$, $\mathrm{ELBO}=\sum_zq(z)\ln\frac{p(x,z)}{q(z)}=\frac12\ln\frac{0.4}{0.5}+\frac12\ln\frac{0.1}{0.5}\approx\frac12(-0.223-1.609)=-0.916$, and the gap is $0.223$. The posterior is $(0.8,0.2)$, so $\KL(q\,\|\,p(z\mid x))=\frac12\ln\frac{0.5}{0.8}+\frac12\ln\frac{0.5}{0.2}\approx0.223$, the same as the gap.
:::
` },
      '23.6': { title: 'VAE Assumptions, the Gaussian Decoder, and the Gaussian KL', body: R`
:::idea In plain words
To actually compute the two terms of the ELBO we must fix the form of three distributions. The VAE makes all three Gaussian. Then the reconstruction term becomes the squared error of an autoencoder, and the KL term becomes a simple expression in the mean and variance output by the encoder. In the end a VAE is “an autoencoder penalized so that its codes resemble $\N(\mathbf 0,I)$.”
:::

:::hand Lecture note — The VAE assumptions
Let $\mathbf x\in\mathbb R^D$ and $\mathbf z\in\mathbb R^d$ and assume three things: the prior $p(\mathbf z)=\N(\mathbf 0,I)$, the encoder $q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$ ($\Sigma_\phi$ diagonal), and the decoder $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$.

Putting these into the ELBO, the objective to minimize becomes (dropping constants and multiplying everything by $2$)
$$\sum_{i=1}^N\Big(\frac1{\tau^2}\E_{q_\phi}\lVert\mathbf x_i-f_\theta(\mathbf z)\rVert^2+\tr\Sigma_\phi(\mathbf x_i)+\lVert\mu_\phi(\mathbf x_i)\rVert^2-\log\det\Sigma_\phi(\mathbf x_i)\Big)\qquad(3)$$
The notes postponed the closed form of the KL to “later”; the key results and proofs below fill it in.
:::

:::key The three VAE assumptions
$p(\mathbf z)=\N(\mathbf 0,I)$, $q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\diag(\sigma_\phi^2(\mathbf x)))$, $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$. The encoder network outputs $\mu_\phi,\sigma_\phi\in\mathbb R^d$ from $\mathbf x$, and the decoder network outputs the mean $f_\theta(\mathbf z)\in\mathbb R^D$ from $\mathbf z$.
:::

**The reconstruction term.** Taking the log of a Gaussian density produces a squared error.

:::key Gaussian decoder and the L2 loss
If $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$, then
$$-\log p_\theta(\mathbf x\mid\mathbf z)=\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2),$$
so with $\tau$ fixed, maximizing the reconstruction term is the same as minimizing the squared error $\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2$.
:::

**The KL term.** Both distributions are Gaussian, so the KL has a closed form.

:::key Closed form of the Gaussian KL
$$\KL\big(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I)\big)=\frac12\big(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma\big).$$
If $\Sigma=\diag(\sigma_1^2,\dots,\sigma_d^2)$, this is $\frac12\sum_{k=1}^d(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$.
:::

:::fig gausskl
:::

Combining the two results, the negative ELBO of one data point is $\frac1{2\tau^2}\E_{q_\phi}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$ plus a constant, and multiplying by $2$ and dropping constants gives equation (3) of the notes. The KL term pulls $\mu$ toward $\mathbf 0$ and $\sigma_k^2$ toward $1$, and its $-\log\sigma_k^2$ keeps the variance from shrinking to $0$. With zero variance a VAE becomes an ordinary autoencoder, leaving empty space between the codes.

:::ex Example 7 — A one-dimensional KL
For $d=1$, what are $\KL(\N(1,1)\,\|\,\N(0,1))$ and $\KL(\N(0,e)\,\|\,\N(0,1))$?
---
The first is $\frac12(1+1-1-\ln1)=\frac12$. With variance $1$ and only the mean moved, it is $\frac12\mu^2$. The second is $\frac12(e+0-1-\ln e)=\frac{e-2}2\approx0.359$.
:::

:::ex Example 8 — The loss of a Gaussian decoder
With $D=2$, $\tau^2=1$, $\mathbf x=(1,2)$, and $f_\theta(\mathbf z)=(1,0)$, what is $-\log p_\theta(\mathbf x\mid\mathbf z)$?
---
$\frac12\lVert(0,2)\rVert^2+\frac22\ln(2\pi)=2+\ln(2\pi)\approx3.838$. The constant $\ln(2\pi)$ does not depend on $\theta$, so only half of the squared error $4$ affects training.
:::

### Going deeper

$\tau^2$ sets the weight between the two terms. A small $\tau^2$ makes the $\frac1{2\tau^2}$ of the reconstruction term large, so the VAE reconstructs sharply like an autoencoder but its codes drift away from the prior; a large $\tau^2$ lets the KL term win, so the codes stick to $\N(\mathbf 0,I)$ and the reconstructions blur. In the extreme, $q_\phi(\mathbf z\mid\mathbf x)=p(\mathbf z)$ and the code carries no information about $\mathbf x$ at all. Writing the loss as “squared error $+\,\beta\cdot$KL” in implementations is a way of tuning this weight with a single $\beta$.
` },
      '23.7': { title: 'The Reparameterization Trick', body: R`
:::idea In plain words
The reconstruction term of the ELBO is an expectation over $\mathbf z\sim q_\phi$, so it is approximated by drawing $\mathbf z$. But “drawing” is not a differentiable operation, so the gradient cannot reach the encoder. Move the randomness into an outside standard normal noise $\varepsilon$ and write $\mathbf z=\mu+\sigma\odot\varepsilon$; then $\mathbf z$ is an ordinary function of $\mu$ and $\sigma$, and backpropagation works.
:::

:::hand Lecture note — Differentiating through a draw
Let the reconstruction loss be $R(\theta,\phi)=\frac12\lVert f_\theta(\mathbf z)-\mathbf x\rVert^2$ with $\mathbf z\sim q_\phi(\mathbf z\mid\mathbf x)$. $\partial R/\partial\theta$ is computed directly along the decoder, but for $\partial R/\partial\phi$ the chain rule cannot be used, because $\mathbf z$ was “drawn” from $\phi$.

In one dimension, writing $z=\mu+\sigma\varepsilon$ with $\varepsilon\sim\N(0,1)$ gives $\E[z]=\mu+\sigma\E[\varepsilon]=\mu$ and $\Var(z)=\sigma^2\Var(\varepsilon)=\sigma^2$, so $z\sim\N(\mu,\sigma^2)$, the same distribution, and now $z$ is a differentiable function of $\mu$ and $\sigma$.
:::

:::key Reparameterization
Draw $\varepsilon\sim\N(\mathbf 0,I)$ independently of $\phi$ and set $\mathbf z=\mu_\phi(\mathbf x)+\sigma_\phi(\mathbf x)\odot\varepsilon$. Then $\mathbf z\sim\N(\mu_\phi,\diag(\sigma_\phi^2))$ and
$$\frac{\partial\mathbf z}{\partial\mu}=I,\qquad\frac{\partial\mathbf z}{\partial\sigma}=\diag(\varepsilon),\qquad\nabla_\phi\E_{q_\phi}[R(\mathbf z)]=\E_\varepsilon\big[\nabla_\phi R(\mu_\phi+\sigma_\phi\odot\varepsilon)\big].$$
Gradients flow along the Gaussian parameters $\mu$ and $\sigma$, and the noise $\varepsilon$ is treated as a constant (slide 68).
:::

:::fig reparam
:::

**One training step.** For each data point $\mathbf x$: (1) compute $\mu_\phi(\mathbf x)$ and $\sigma_\phi(\mathbf x)$ with the encoder; (2) draw $\varepsilon\sim\N(\mathbf 0,I)$ and form $\mathbf z=\mu+\sigma\odot\varepsilon$; (3) compute $f_\theta(\mathbf z)$ with the decoder and the loss $\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac12\sum_k(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$; (4) update $\theta$ and $\phi$ together by backpropagation. The expectation is usually approximated with a single $\varepsilon$, and this approximation is unbiased.

:::ex Example 9 — The gradient of one sample
With $f(z)=z^2$, $\mu=1$, $\sigma=2$, and drawn noise $\varepsilon=0.5$, what are $z$, $\partial f/\partial\mu$, and $\partial f/\partial\sigma$?
---
$z=1+2\cdot0.5=2$. By the chain rule $\frac{\partial f}{\partial\mu}=2z\cdot1=4$ and $\frac{\partial f}{\partial\sigma}=2z\cdot\varepsilon=2$. Checking with expectations, $\E[z^2]=\mu^2+\sigma^2$, so the true gradient is $(2\mu,2\sigma)=(2,4)$, and $\E_\varepsilon[2z]=2\mu$, $\E_\varepsilon[2z\varepsilon]=2\sigma$: the average of the single-sample gradients equals the true gradient.
:::

**Generation and the latent space** (slides 69–72). After training, set the encoder aside, draw $\mathbf z\sim\N(\mathbf 0,I)$, and output $f_\theta(\mathbf z)$ to get a new sample. Thanks to the KL term the codes fill the region around the origin without gaps, so moving in a straight line between two codes changes the output smoothly, and changing one coordinate of $\mathbf z$ often changes a single property such as face direction or expression (the assumption that $\Sigma_\phi$ is diagonal helps the coordinates act separately). On the other hand, the squared error leans toward the average of several plausible outputs, so VAE samples tend to be blurry.
` },
    },
    probs: [
      // 23.1
      { q: R`Which is the autoregressive factorization of the distribution of three variables $\mathbf x=(x_1,x_2,x_3)$ with no assumptions?`,
        choices: [R`$p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)$`, R`$p(x_1)\,p(x_2)\,p(x_3)$`, R`$p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_2)$`, R`$p(x_2\mid x_1)\,p(x_3\mid x_1,x_2)$`],
        sol: R`Applying the product rule in turn gives the first. The second adds independence, the third adds the Markov assumption that $x_3$ depends only on $x_2$, and the fourth is missing $p(x_1)$, so it is not a distribution of $\mathbf x$.` },
      { q: R`With $p(x_1=1)=0.5$, $p(x_2=1\mid x_1=1)=0.4$, and $p(x_3=0\mid x_1=1,x_2=1)=0.1$, what is $p(x_1=1,x_2=1,x_3=0)$?`,
        sol: R`By the autoregressive factorization, $0.5\cdot0.4\cdot0.1=0.02$.` },
      { q: R`How many independent parameters does a table of the joint distribution of $D=4$ binary pixels need, with no assumptions?`,
        sol: R`The probabilities of the $2^4=16$ cells sum to $1$, so one is fixed by the rest, leaving $15$. Tabulating the conditionals also takes $1+2+4+8=15$, so the factorization alone does not reduce the parameters.` },
      { q: R`How many sequential evaluations of the network are needed to generate a $28\times28$ grayscale image autoregressively, one pixel at a time?`,
        sol: R`Each pixel uses the earlier pixels as context, so $28\cdot28=784$.` },
      { q: R`Which statement about PixelCNN is correct?`,
        choices: [R`Training computes every conditional at once with masked convolutions, but generation proceeds one pixel at a time`, R`Generation can also draw every pixel at once`, R`The mask must leave the center pixel visible for the conditionals to be right`, R`It cannot compute the log-likelihood, so it maximizes a lower bound`],
        sol: R`During training every pixel value is in the data, so the conditionals can be computed simultaneously, but during generation $x_i$ must be drawn before the next context exists. Seeing the center pixel would mean predicting a pixel from itself, and autoregressive models compute the log-likelihood exactly.` },
      // 23.2
      { q: R`In the latent variable model $p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z$ (with continuous $\mathbf z$ and a neural decoder), what is generally hard?`,
        choices: [R`Drawing $\mathbf z\sim p(\mathbf z)$`, R`Drawing $\mathbf x$ given $\mathbf z$`, R`Computing $p_\theta(\mathbf x)$ and the posterior $p_\theta(\mathbf z\mid\mathbf x)$`, R`Computing the decoder $f_\theta(\mathbf z)$`],
        sol: R`Drawing is two steps in turn, but $p_\theta(\mathbf x)$ is an integral over all $\mathbf z$ with no closed form, and the posterior has that integral in its denominator.` },
      { q: R`With $z\in\{1,2\}$, $p(z=1)=0.4$, $p(x=1\mid z=1)=0.5$, and $p(x=1\mid z=2)=0.1$, what is $p(x=1)$?`,
        sol: R`$0.4\cdot0.5+0.6\cdot0.1=0.2+0.06=0.26$.` },
      { q: R`In the model of the previous problem, what is the posterior probability $p(z=1\mid x=1)$?`,
        sol: R`By Bayes’ rule $p(z=1\mid x=1)=\frac{p(x=1\mid z=1)p(z=1)}{p(x=1)}=\frac{0.2}{0.26}=\frac{10}{13}\approx0.769$.` },
      { q: R`In the Gaussian mixture with $p(z=1)=p(z=2)=\frac12$, $x\mid z=1\sim\N(0,1)$, and $x\mid z=2\sim\N(2,1)$, what is the density $p(x)$ at $x=1$? (An expression is fine.)`,
        sol: R`$x=1$ is at distance $1$ from both component means, so $p(x\mid z)=\frac1{\sqrt{2\pi}}e^{-1/2}$ for both. Hence $p(x)=\frac12\cdot\frac{e^{-1/2}}{\sqrt{2\pi}}+\frac12\cdot\frac{e^{-1/2}}{\sqrt{2\pi}}=\frac{e^{-1/2}}{\sqrt{2\pi}}\approx0.242$.` },
      { q: R`For the Monte Carlo estimator of a latent variable model, $\hat p_K=\frac1K\sum_{k=1}^Kp_\theta(\mathbf x\mid\mathbf z_k)$ ($\mathbf z_k\sim p(\mathbf z)$ independent): (1) Show that $\E[\hat p_K]=p_\theta(\mathbf x)$. (2) Show that $\Var(\hat p_K)=\frac1K\Var_{p(\mathbf z)}[p_\theta(\mathbf x\mid\mathbf z)]$. (3) In the model of Example 3 ($p(z=1)=0.3$, $p(x=1\mid z=1)=0.9$, $p(x=1\mid z=2)=0.2$), find this variance for $x=1$ and $K=1$.`,
        sol: R`**(1)** With $Y_k=p_\theta(\mathbf x\mid\mathbf z_k)$, $\E[Y_k]=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z=p_\theta(\mathbf x)$, and by linearity of expectation $\E[\hat p_K]=\frac1K\sum_k\E[Y_k]=p_\theta(\mathbf x)$.
**(2)** The $Y_k$ are independent and identically distributed, so $\Var(\hat p_K)=\frac1{K^2}\sum_k\Var(Y_k)=\frac1K\Var(Y_1)$.
**(3)** $Y$ is $0.9$ with probability $0.3$ and $0.2$ with probability $0.7$. $\E[Y]=0.41$ and $\E[Y^2]=0.3\cdot0.81+0.7\cdot0.04=0.271$, so $\Var(Y)=0.271-0.1681=0.1029$. The standard deviation $0.32$ is large next to the mean $0.41$, and in high dimensions this ratio gets far worse.` },
      // 23.3
      { q: R`What data are needed to train an autoencoder?`,
        choices: [R`Only the inputs $\mathbf x$`, R`Pairs of inputs and labels $(\mathbf x,y)$`, R`The correct code $\mathbf z$ for each input`, R`Codes $\mathbf z$ drawn from a prior`],
        sol: R`Only the input appears in the loss $\lVert\mathbf x-f_\theta(g_\phi(\mathbf x))\rVert^2$, so no labels are needed (self-supervised learning).` },
      { q: R`With $\mathbf w=\frac15(3,4)$ and $\mathbf x=(2,1)$, what is the reconstruction loss $\lVert\mathbf x-\hat{\mathbf x}\rVert^2$ of the linear autoencoder ($z=\mathbf w^T\mathbf x$, $\hat{\mathbf x}=z\mathbf w$)?`,
        sol: R`$z=\frac{6+4}5=2$, $\hat{\mathbf x}=(1.2,1.6)$, and the squared length of the difference $(0.8,-0.6)$ is $0.64+0.36=1$, matching the formula $\lVert\mathbf x\rVert^2-z^2=5-4=1$.` },
      { q: R`What goes wrong if the code dimension of an autoencoder is at least the input dimension ($d\ge D$)?`,
        choices: [R`It can learn the identity function and reach zero loss, so nothing guarantees a useful summary`, R`Training becomes impossible`, R`It automatically becomes a generative model`, R`It always gives the same solution as PCA`],
        sol: R`Without a bottleneck the encoder and decoder can just pass the input through and get zero loss. A bottleneck is what forces it to summarize the structure of the data.` },
      { q: R`What is the main reason it is hard to make new images by detaching the decoder of an ordinary trained autoencoder?`,
        choices: [R`We do not know the distribution of the codes $\mathbf z$, so we cannot decide where to draw the $\mathbf z$ fed to the decoder`, R`The decoder is not differentiable`, R`The decoder’s input dimension is larger than its output dimension`, R`Because the loss is a squared error`],
        sol: R`The codes of the training data are scattered over only part of code space, and their distribution is not fixed. The VAE solves this by matching the code distribution to $\N(\mathbf 0,I)$ with the KL term.` },
      { q: R`For the linear autoencoder $z=\mathbf w^T\mathbf x$, $\hat{\mathbf x}=z\mathbf w$ with $\lVert\mathbf w\rVert=1$: (1) Show that $\lVert\mathbf x-\hat{\mathbf x}\rVert^2=\lVert\mathbf x\rVert^2-(\mathbf w^T\mathbf x)^2$. (2) Show that the $\mathbf w$ minimizing $\sum_i\lVert\mathbf x_i-\hat{\mathbf x}_i\rVert^2$ is a unit eigenvector for the largest eigenvalue of $C=\sum_i\mathbf x_i\mathbf x_i^T$. (3) For the data $\mathbf x_1=(3,1)$, $\mathbf x_2=(1,3)$, find the best $\mathbf w$ and the minimum loss.`,
        sol: R`**(1)** $\lVert\mathbf x-z\mathbf w\rVert^2=\lVert\mathbf x\rVert^2-2z\,\mathbf w^T\mathbf x+z^2\lVert\mathbf w\rVert^2=\lVert\mathbf x\rVert^2-2z^2+z^2=\lVert\mathbf x\rVert^2-z^2$.
**(2)** The sum is $\sum_i\lVert\mathbf x_i\rVert^2-\sum_i(\mathbf w^T\mathbf x_i)^2=\text{const}-\mathbf w^TC\mathbf w$, so we maximize $\mathbf w^TC\mathbf w$. $C$ is symmetric, so write $C=Q\Lambda Q^T$ and $\mathbf a=Q^T\mathbf w$ ($\lVert\mathbf a\rVert=1$); then $\mathbf w^TC\mathbf w=\sum_k\lambda_ka_k^2\le\lambda_{\max}\sum_ka_k^2=\lambda_{\max}$, with equality when $\mathbf w$ is an eigenvector for $\lambda_{\max}$.
**(3)** $C=\begin{pmatrix}10&6\\6&10\end{pmatrix}$ has eigenvalues $16$ ($\frac1{\sqrt2}(1,1)$) and $4$ ($\frac1{\sqrt2}(1,-1)$). The best $\mathbf w=\frac1{\sqrt2}(1,1)$, and the minimum loss is $\lVert\mathbf x_1\rVert^2+\lVert\mathbf x_2\rVert^2-16=20-16=4$.`,
        rubric: R`- (1) Expansion and use of $\lVert\mathbf w\rVert=1$ — 3 points
- (2) Recasting as maximizing $\mathbf w^TC\mathbf w$, with the bound and equality case from the eigendecomposition — 4 points
- (3) $C$, its eigenvalues, the best $\mathbf w$, and the loss $4$ — 3 points` },
      // 23.4
      { q: R`Which is the correct split of the cross entropy $H(p,q)=-\E_p[\log q]$?`,
        choices: [R`$\KL(p\,\|\,q)+H(p)$`, R`$\KL(q\,\|\,p)+H(q)$`, R`$\KL(p\,\|\,q)-H(p)$`, R`$H(p)+H(q)$`],
        sol: R`$-\E_p[\log q]=\E_p[\log\frac pq]-\E_p[\log p]=\KL(p\,\|\,q)+H(p)$.` },
      { q: R`What is $\KL(\mathrm{Bern}(0.8)\,\|\,\mathrm{Bern}(0.5))$? (Natural log; an expression is fine.)`,
        sol: R`$0.8\ln\frac{0.8}{0.5}+0.2\ln\frac{0.2}{0.5}\approx0.3760-0.1833=0.193$.` },
      { q: R`A coin is tossed $20$ times and lands heads $6$ times. What is the maximum likelihood estimate of $p_\theta(1)=\theta$?`,
        sol: R`Setting the derivative of the log-likelihood $6\ln\theta+14\ln(1-\theta)$, $\frac6\theta-\frac{14}{1-\theta}$, to $0$ gives $\theta=0.3$.` },
      { q: R`What is the cross entropy $H(p_{data},p_\theta)$ for $p_{data}=\mathrm{Bern}(0.7)$ and $p_\theta=\mathrm{Bern}(0.9)$? (Natural log; an expression is fine.)`,
        sol: R`$-0.7\ln0.9-0.3\ln0.1\approx0.0738+0.6908=0.7645$. Since $H(p_{data})\approx0.6109$, $\KL(p_{data}\,\|\,p_\theta)\approx0.1537$, and the sum equals the cross entropy.` },
      { q: R`Maximum likelihood reduces $\KL(p_{data}\,\|\,p_\theta)$. Why is the reverse direction $\KL(p_\theta\,\|\,p_{data})$ not used as the training objective?`,
        choices: [R`The reverse direction needs the density values of $p_{data}$, but we only have samples`, R`The reverse direction is always $0$`, R`KL is symmetric, so the two directions are the same`, R`The reverse direction can be negative`],
        sol: R`$\KL(p_\theta\,\|\,p_{data})=\E_{p_\theta}[\log p_\theta-\log p_{data}]$ contains $\log p_{data}$, which we cannot compute. KL is not symmetric and is always at least $0$.` },
      { q: R`For independent samples $\mathbf x_1,\dots,\mathbf x_N\sim p_{data}$ and a model $p_\theta$: (1) Show, with reasons, that $\argmax_\theta\prod_ip_\theta(\mathbf x_i)=\argmax_\theta\frac1N\sum_i\log p_\theta(\mathbf x_i)$. (2) Using the law of large numbers, show that as $N\to\infty$ this objective converges to $-H(p_{data},p_\theta)$. (3) Show that $H(p,q)=\KL(p\,\|\,q)+H(p)$ and conclude that maximum likelihood corresponds to $\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$.`,
        sol: R`**(1)** $\log$ is strictly increasing, so it does not change the $\argmax$, and $\log\prod_i=\sum_i\log$. Multiplying by the positive $\frac1N$ also keeps the $\argmax$.
**(2)** $Y_i=\log p_\theta(\mathbf x_i)$ are independent and identically distributed with mean $\E_{p_{data}}[\log p_\theta(\mathbf x)]$ (assuming this expectation is finite), so by the law of large numbers $\frac1N\sum_iY_i\to\E_{p_{data}}[\log p_\theta(\mathbf x)]=-H(p_{data},p_\theta)$.
**(3)** $H(p,q)=-\E_p[\log q]=\E_p[\log\frac pq]-\E_p[\log p]=\KL(p\,\|\,q)+H(p)$. Hence $\argmax_\theta(-H(p_{data},p_\theta))=\argmin_\theta[\KL(p_{data}\,\|\,p_\theta)+H(p_{data})]=\argmin_\theta\KL(p_{data}\,\|\,p_\theta)$, the last equality because $H(p_{data})$ does not depend on $\theta$.`,
        rubric: R`- (1) Monotonicity of $\log$ and the product as a sum — 2 points
- (2) Independence, identical distribution, the law of large numbers, and writing it as a cross entropy — 4 points
- (3) Proof of the split and the conclusion that $H(p_{data})$ is a constant — 4 points` },
      // 23.5
      { q: R`Which inequality is used to derive the ELBO?`,
        choices: [R`$\log\E[Y]\ge\E[\log Y]$ (Jensen, $\log$ is concave)`, R`$\log\E[Y]\le\E[\log Y]$`, R`The Cauchy–Schwarz inequality`, R`Markov’s inequality`],
        sol: R`Since $\log$ is concave, Jensen’s inequality reads $\log\E[Y]\ge\E[\log Y]$, and applying it to $Y=p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)/q(\mathbf z\mid\mathbf x)$ gives the lower bound.` },
      { q: R`With $z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.6$, and $p(x\mid z=2)=0.2$, what is the gap $\log p(x)-\mathrm{ELBO}$ for a uniform $q$? (Natural log; an expression is fine.)`,
        sol: R`$p(x)=0.4$, so $\log p(x)=\ln0.4\approx-0.916$. $\mathrm{ELBO}=\frac12\ln\frac{0.3}{0.5}+\frac12\ln\frac{0.1}{0.5}=\frac12\ln0.12\approx-1.060$, and the gap is $0.144$. The KL to the posterior $(0.75,0.25)$ is $\frac12\ln\frac{0.5}{0.75}+\frac12\ln\frac{0.5}{0.25}=\frac12\ln\frac43$, the same.` },
      { q: R`Which equals $\log p_\theta(\mathbf x)-\mathrm{ELBO}(q_\phi)$?`,
        choices: [R`$\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p_\theta(\mathbf z\mid\mathbf x))$`, R`$\KL(q_\phi(\mathbf z\mid\mathbf x)\,\|\,p(\mathbf z))$`, R`$\KL(p_\theta(\mathbf z\mid\mathbf x)\,\|\,q_\phi(\mathbf z\mid\mathbf x))$`, R`Always $0$`],
        sol: R`$\log p_\theta(\mathbf x)=\E_q[\log\frac{p_\theta(\mathbf x,\mathbf z)}{q}]+\E_q[\log\frac q{p_\theta(\mathbf z\mid\mathbf x)}]$, and the second term is the KL from $q$ to the true posterior. The KL in the second choice is a term inside the ELBO.` },
      { q: R`What happens when $\theta$ is fixed and the ELBO is maximized over $\phi$?`,
        choices: [R`$\log p_\theta(\mathbf x)$ stays the same and $q_\phi$ moves closer to the posterior`, R`$\log p_\theta(\mathbf x)$ increases`, R`The prior $p(\mathbf z)$ changes`, R`The gap grows`],
        sol: R`In $\log p_\theta(\mathbf x)=\mathrm{ELBO}+\KL(q_\phi\,\|\,p_\theta(\mathbf z\mid\mathbf x))$ the left side does not depend on $\phi$, so as the ELBO grows the KL shrinks by the same amount.` },
      { q: R`With $z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.6$, and $p(x\mid z=2)=0.2$, what is the posterior probability $p(z=1\mid x)$?`,
        sol: R`$p(z=1\mid x)=\frac{0.5\cdot0.6}{0.5\cdot0.6+0.5\cdot0.2}=\frac{0.3}{0.4}=0.75$. Choosing $q$ as this distribution makes the ELBO equal $\log p(x)$.` },
      { q: R`For a latent variable model $p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z$ and a distribution $q(\mathbf z\mid\mathbf x)$: (1) State the needed assumption and derive $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$ with Jensen’s inequality. (2) Show that the gap is $\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$ and state when equality holds. (3) For $z\in\{1,2\}$, $p(z)=\frac12$, $p(x\mid z=1)=0.9$, $p(x\mid z=2)=0.1$, find the ELBO of a uniform $q$ and the gap.`,
        sol: R`**(1)** Assumption: $q(\mathbf z\mid\mathbf x)>0$ wherever $p_\theta(\mathbf x,\mathbf z)>0$. Then $p_\theta(\mathbf x)=\int q\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q}\,d\mathbf z=\E_q\big[\frac{p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)}{q}\big]$, and since $\log$ is concave, Jensen gives $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]+\E_q[\log\frac{p(\mathbf z)}q]=\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$.
**(2)** $p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)=p_\theta(\mathbf z\mid\mathbf x)p_\theta(\mathbf x)$, so $\mathrm{ELBO}=\E_q[\log\frac{p_\theta(\mathbf z\mid\mathbf x)p_\theta(\mathbf x)}q]=\log p_\theta(\mathbf x)-\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$. The KL is at least $0$ and is $0$ only when $q=p_\theta(\mathbf z\mid\mathbf x)$, which is when equality holds.
**(3)** $p(x)=0.5$ and $\log p(x)=\ln0.5\approx-0.693$. $\mathrm{ELBO}=\frac12\ln\frac{0.45}{0.5}+\frac12\ln\frac{0.05}{0.5}=\frac12\ln0.09\approx-1.204$, and the gap is $\ln\frac53\approx0.511$. The KL to the posterior $(0.9,0.1)$ is $\frac12\ln\frac{0.5}{0.9}+\frac12\ln\frac{0.5}{0.1}=\frac12\ln\frac{25}9=\ln\frac53$, the same.`,
        rubric: R`- (1) The $q>0$ assumption, multiplying and dividing, Jensen, splitting into two terms — 4 points
- (2) The gap as a KL via Bayes’ rule, and the equality condition — 3 points
- (3) Computing the ELBO and the gap — 3 points` },
      // 23.6
      { q: R`Which is NOT an assumption of the VAE?`,
        choices: [R`$p(\mathbf z)=\N(\mathbf 0,I)$`, R`$q_\phi(\mathbf z\mid\mathbf x)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$ with diagonal $\Sigma_\phi$`, R`$p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$`, R`$p(\mathbf z)=\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$`],
        sol: R`The prior is fixed as $\N(\mathbf 0,I)$, independent of $\mathbf x$; the $\N(\mu_\phi(\mathbf x),\Sigma_\phi(\mathbf x))$ that depends on $\mathbf x$ is the encoder (the approximate posterior).` },
      { q: R`What is $\KL(\N(1,2)\,\|\,\N(0,1))$? (In the $\N(\mu,\sigma^2)$ notation; an expression is fine.)`,
        sol: R`$\frac12(\sigma^2+\mu^2-1-\ln\sigma^2)=\frac12(2+1-1-\ln2)=\frac12(2-\ln2)\approx0.653$.` },
      { q: R`For $d=2$ with $\mu=(1,0)$ and $\Sigma=\diag(1,4)$, what is $\KL(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I))$? (An expression is fine.)`,
        sol: R`$\tr\Sigma=5$, $\lVert\mu\rVert^2=1$, and $\log\det\Sigma=\ln4$, so $\frac12(5+1-2-\ln4)=2-\ln2\approx1.307$. Adding the coordinates, $\frac12(1+1-1-0)+\frac12(4+0-1-\ln4)$, gives the same.` },
      { q: R`With $D=3$, $\tau^2=2$, $\mathbf x=(1,1,1)$, and $f_\theta(\mathbf z)=(1,-1,1)$, what is $-\log p_\theta(\mathbf x\mid\mathbf z)$? (Natural log; an expression is fine.)`,
        sol: R`$\frac1{2\tau^2}\lVert(0,2,0)\rVert^2=\frac44=1$ and $\frac D2\ln(2\pi\tau^2)=\frac32\ln(4\pi)\approx3.797$, for a total of about $4.797$.` },
      { q: R`(1) For $d=1$, prove $\KL(\N(\mu,\sigma^2)\,\|\,\N(0,1))=\frac12(\sigma^2+\mu^2-1-\log\sigma^2)$. (2) Using this, show that for diagonal $\Sigma$, $\KL(\N(\mu,\Sigma)\,\|\,\N(\mathbf 0,I))=\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$. (3) With $\mu$ fixed, find the $\sigma^2$ minimizing the one-dimensional KL and the minimum value.`,
        sol: R`**(1)** For $q=\N(\mu,\sigma^2)$ and $p=\N(0,1)$, $\log q(z)=-\frac12\log(2\pi\sigma^2)-\frac{(z-\mu)^2}{2\sigma^2}$ and $\log p(z)=-\frac12\log(2\pi)-\frac{z^2}2$. With $\E_q[(z-\mu)^2]=\sigma^2$ and $\E_q[z^2]=\sigma^2+\mu^2$, $\KL=\E_q[\log q-\log p]=-\frac12\log\sigma^2-\frac12+\frac12(\sigma^2+\mu^2)$.
**(2)** For diagonal $\Sigma$, both $q$ and $p$ are products of independent coordinates, so the logs split into sums and $\KL=\sum_k\KL(\N(\mu_k,\sigma_k^2)\,\|\,\N(0,1))=\frac12\sum_k(\sigma_k^2+\mu_k^2-1-\log\sigma_k^2)$. Since $\sum_k\sigma_k^2=\tr\Sigma$, $\sum_k\mu_k^2=\lVert\mu\rVert^2$, and $\sum_k\log\sigma_k^2=\log\det\Sigma$, this is the given formula.
**(3)** $\frac{\partial}{\partial\sigma^2}\KL=\frac12(1-\frac1{\sigma^2})=0$ gives $\sigma^2=1$, a minimum since the second derivative $\frac1{2\sigma^4}>0$. The minimum value is $\frac12\mu^2$.`,
        rubric: R`- (1) Simplifying with the two log densities and $\E_q[z^2]=\sigma^2+\mu^2$ — 4 points
- (2) Splitting into a sum over independent coordinates and writing it with the trace and determinant — 3 points
- (3) $\sigma^2=1$ and the minimum $\frac12\mu^2$ — 3 points` },
      { q: R`For $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta(\mathbf z),\tau^2I)$ ($\mathbf x\in\mathbb R^D$): (1) Derive $-\log p_\theta(\mathbf x\mid\mathbf z)=\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\frac D2\log(2\pi\tau^2)$. (2) Explain why, with $\tau$ fixed, optimizing over $\theta$ is the same as minimizing the squared error. (3) State which term of the ELBO gains weight when $\tau^2$ is made small.`,
        sol: R`**(1)** The density is $(2\pi\tau^2)^{-D/2}\exp(-\frac1{2\tau^2}\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2)$; taking the log and multiplying by $-1$ gives the formula.
**(2)** The second term is a constant independent of $\theta$, and the first is the squared error times the positive $\frac1{2\tau^2}$, so they share the minimizer.
**(3)** The negative ELBO is $\frac1{2\tau^2}\E_q\lVert\mathbf x-f_\theta(\mathbf z)\rVert^2+\KL$ plus a constant, so a small $\tau^2$ gives the reconstruction term more weight and brings the model closer to an autoencoder.`,
        rubric: R`- (1) The log of the Gaussian density — 4 points
- (2) The constant term and the positive multiple — 3 points
- (3) The weight of the reconstruction term — 3 points` },
      // 23.7
      { q: R`For $\varepsilon\sim\N(0,1)$ and $\sigma>0$, what is the distribution of $z=\mu+\sigma\varepsilon$?`,
        choices: [R`$\N(\mu,\sigma^2)$`, R`$\N(\mu,\sigma)$`, R`$\N(0,\sigma^2)$`, R`$\N(\mu,1)$`],
        sol: R`A linear transformation of a Gaussian is Gaussian, with $\E[z]=\mu$ and $\Var(z)=\sigma^2$ ($\N(\mu,\sigma^2)$ in variance notation).` },
      { q: R`With $\mu=1$, $\sigma=0.5$, and drawn noise $\varepsilon=-2$, what is $z=\mu+\sigma\varepsilon$?`,
        sol: R`$1+0.5\cdot(-2)=0$.` },
      { q: R`For $f(z)=z^2$ and $z=\mu+\sigma\varepsilon$ with $\mu=2$, $\sigma=1$, $\varepsilon=1$, what is $\partial f/\partial\sigma$?`,
        sol: R`$z=3$ and $\frac{\partial f}{\partial\sigma}=f'(z)\frac{\partial z}{\partial\sigma}=2z\cdot\varepsilon=6$.` },
      { q: R`What is the best reason the VAE needs the reparameterization trick?`,
        choices: [R`If $\mathbf z$ is drawn directly from $q_\phi$, it is not a differentiable function of $\phi$, so the gradient of the reconstruction term cannot be passed to $\phi$`, R`Because the KL term cannot be computed in closed form`, R`Because the decoder gradient $\partial R/\partial\theta$ cannot be computed`, R`To learn the prior`],
        sol: R`The KL term has a closed form and differentiates directly in $\mu$ and $\sigma$, and the gradient in $\theta$ is no problem. What is blocked is the gradient of the reconstruction term passing through the draw to $\phi$.` },
      { q: R`For $R=\frac12(x-wz)^2$ and $z=\mu+\sigma\varepsilon$ with $x=3$, $w=1$, $\mu=1$, $\sigma=1$, $\varepsilon=1$, what is $\partial R/\partial\sigma$?`,
        sol: R`$z=2$, $\frac{\partial R}{\partial z}=-(x-wz)w=-1$, and $\frac{\partial z}{\partial\sigma}=\varepsilon=1$, so $-1$. For this sample, increasing $\sigma$ lowers the loss.` },
      { q: R`For $\varepsilon\sim\N(0,1)$ and $z=\mu+\sigma\varepsilon$ ($\sigma>0$): (1) Show that $\E[z]=\mu$ and $\Var(z)=\sigma^2$. (2) Find $\partial z/\partial\mu$ and $\partial z/\partial\sigma$, and explain why, for a differentiable $f$, $\frac{\partial}{\partial\mu}\E[f(z)]=\E[f'(z)]$ and $\frac{\partial}{\partial\sigma}\E[f(z)]=\E[f'(z)\varepsilon]$ (assume the derivative and expectation can be swapped). (3) Check both identities directly for $f(z)=z^2$.`,
        sol: R`**(1)** By linearity of expectation $\E[z]=\mu+\sigma\E[\varepsilon]=\mu$ and $\Var(z)=\sigma^2\Var(\varepsilon)=\sigma^2$.
**(2)** $\frac{\partial z}{\partial\mu}=1$ and $\frac{\partial z}{\partial\sigma}=\varepsilon$. The expectation is written over the distribution of $\varepsilon$, which does not depend on $\mu$ or $\sigma$, so $\frac{\partial}{\partial\mu}\E_\varepsilon[f(\mu+\sigma\varepsilon)]=\E_\varepsilon[f'(z)\cdot1]$ and $\frac{\partial}{\partial\sigma}\E_\varepsilon[f(\mu+\sigma\varepsilon)]=\E_\varepsilon[f'(z)\varepsilon]$.
**(3)** $\E[z^2]=\mu^2+\sigma^2$, so the left sides are $2\mu$ and $2\sigma$. The right sides are $\E[2z]=2\mu$ and $\E[2z\varepsilon]=2\mu\E[\varepsilon]+2\sigma\E[\varepsilon^2]=2\sigma$, the same.`,
        rubric: R`- (1) The mean and variance — 2 points
- (2) The two partial derivatives and the key point that the expectation is over the distribution of $\varepsilon$ — 5 points
- (3) The check for $f=z^2$ — 3 points` },
    ],
  };
})();
