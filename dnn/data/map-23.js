/* 논리 지도 — 23 생성 모델. 자료의 분포를 배우는 물음에서 자기회귀 분해와 잠재 변수 모델로 갈라지고,
   최대가능도가 KL 최소화라는 관점에서 ELBO로, 오토인코더와 ELBO가 만나 VAE로, VAE의 두 계산(가우시안 KL, 재매개변수화)으로 가는 길을 그립니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 23,
    easy: R`
생성 모델은 자료의 분포 $p_{data}$를 닮은 $p_\theta$를 배워 새 표본을 뽑거나 확률을 매깁니다. 학습은 최대가능도로 하고, 자료가 많으면 이것은 $\KL(p_{data}\,\|\,p_\theta)$를 줄이는 것과 같습니다. 남은 문제는 $p_\theta(\mathbf x)$를 어떻게 계산하느냐입니다. **자기회귀 모델**은 곱셈 규칙으로 한 차원씩 쪼개 정확히 계산합니다.

**잠재 변수 모델**은 낮은 차원의 $\mathbf z$에서 $\mathbf x$를 만드는데, $p_\theta(\mathbf x)$가 $\mathbf z$에 대한 적분이라 계산할 수 없습니다. $\mathbf x$를 보고 $\mathbf z$를 추측하는 $q_\phi(\mathbf z\mid\mathbf x)$를 끼우면 젠센 부등식으로 하한 **ELBO**가 생기고, 그 틈은 진짜 사후분포와의 KL입니다. 한편 오토인코더는 $\mathbf x$를 코드로 줄였다 살리는 법을 배우지만, 코드의 분포를 몰라 생성에는 쓰기 어렵습니다.

**VAE**는 둘을 합칩니다. 인코더가 $q_\phi$, 디코더가 $p_\theta(\mathbf x\mid\mathbf z)$이고 셋 다 가우시안이면, ELBO는 제곱 오차와 닫힌 형태의 **가우시안 KL**이 됩니다. 마지막으로 $\mathbf z$를 뽑는 단계에 기울기가 지나가도록 $\mathbf z=\mu+\sigma\odot\varepsilon$로 **재매개변수화**하면 전체를 역전파로 학습할 수 있습니다.`,
    easyEn: R`
A generative model learns a $p_\theta$ resembling the data distribution $p_{data}$, to draw new samples or assign probabilities. It is trained by maximum likelihood, which with plenty of data is the same as reducing $\KL(p_{data}\,\|\,p_\theta)$. What remains is how to compute $p_\theta(\mathbf x)$. An **autoregressive model** splits it one dimension at a time with the product rule and computes it exactly.

A **latent variable model** makes $\mathbf x$ from a low-dimensional $\mathbf z$, but $p_\theta(\mathbf x)$ is an integral over $\mathbf z$ and cannot be computed. Inserting a $q_\phi(\mathbf z\mid\mathbf x)$ that looks at $\mathbf x$ and guesses $\mathbf z$ gives, by Jensen’s inequality, the lower bound **ELBO**, whose gap is the KL to the true posterior. Meanwhile an autoencoder learns to shrink $\mathbf x$ to a code and restore it, but since the code distribution is unknown it is hard to use for generation.

The **VAE** combines the two. The encoder is $q_\phi$, the decoder is $p_\theta(\mathbf x\mid\mathbf z)$, and when all three distributions are Gaussian the ELBO becomes a squared error plus a closed-form **Gaussian KL**. Finally, **reparameterizing** as $\mathbf z=\mu+\sigma\odot\varepsilon$ lets the gradient pass the step that draws $\mathbf z$, so the whole model trains by backpropagation.`,
    nodes: [
      { id: 'gen', role: 'q', k: '23.1', t: R`자료의 분포를 배우려면?`, en: R`How to learn the data distribution?`,
        d: R`생성 모델은 밀도 추정($p_\theta(\mathbf x)$ 매기기)과 표본 생성($p_\theta$에서 뽑기)을 목표로 합니다.`,
        dEn: R`A generative model aims at density estimation (assigning $p_\theta(\mathbf x)$) and sampling (drawing from $p_\theta$).` },
      { id: 'ar', role: 'res', k: '23.1', at: ':::key 자기회귀 분해', t: R`자기회귀 분해`, en: R`Autoregressive factorization`,
        d: R`$p(\mathbf x)=\prod_ip(x_i\mid\mathbf x_{<i})$로 정확한 가능도. PixelCNN은 학습은 한 번에, 생성은 $D$걸음입니다.`,
        dEn: R`$p(\mathbf x)=\prod_ip(x_i\mid\mathbf x_{<i})$ gives the exact likelihood. PixelCNN trains in one pass but generates in $D$ steps.` },
      { id: 'lv', role: 'def', k: '23.2', at: ':::key 잠재 변수 모델', t: R`잠재 변수 모델`, en: R`Latent variable model`,
        d: R`$p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z$. 뽑기는 쉽지만 가능도와 사후분포는 적분 때문에 계산할 수 없습니다.`,
        dEn: R`$p_\theta(\mathbf x)=\int p_\theta(\mathbf x\mid\mathbf z)p(\mathbf z)\,d\mathbf z$. Sampling is easy, but the likelihood and posterior cannot be computed because of the integral.` },
      { id: 'ae', role: 'tool', k: '23.3', at: ':::key 오토인코더 손실', t: R`오토인코더`, en: R`Autoencoder`,
        d: R`$\lVert\mathbf x-f_\theta(g_\phi(\mathbf x))\rVert^2$을 줄여 병목 코드를 배웁니다. 표시는 필요 없지만 코드의 분포를 모릅니다.`,
        dEn: R`It learns a bottleneck code by reducing $\lVert\mathbf x-f_\theta(g_\phi(\mathbf x))\rVert^2$. No labels are needed, but the code distribution is unknown.` },
      { id: 'mle', role: 'idea', k: '23.4', at: ':::key 최대가능도와 KL', t: R`최대가능도 $=$ KL 최소화`, en: R`Maximum likelihood $=$ KL minimization`,
        d: R`큰 수의 법칙과 $H(p,q)=\KL(p\,\|\,q)+H(p)$로 $\argmax\frac1N\sum\log p_\theta\approx\argmin\KL(p_{data}\,\|\,p_\theta)$.`,
        dEn: R`By the law of large numbers and $H(p,q)=\KL(p\,\|\,q)+H(p)$, $\argmax\frac1N\sum\log p_\theta\approx\argmin\KL(p_{data}\,\|\,p_\theta)$.` },
      { id: 'elbo', role: 'res', k: '23.5', at: ':::key ELBO', t: R`ELBO`, en: R`ELBO`,
        d: R`젠센으로 $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$, 틈은 $\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$입니다.`,
        dEn: R`By Jensen, $\log p_\theta(\mathbf x)\ge\E_q[\log p_\theta(\mathbf x\mid\mathbf z)]-\KL(q\,\|\,p(\mathbf z))$, with gap $\KL(q\,\|\,p_\theta(\mathbf z\mid\mathbf x))$.` },
      { id: 'vae', role: 'step', k: '23.6', at: ':::key VAE의 세 가정', t: R`VAE: 세 분포를 가우시안으로`, en: R`VAE: three Gaussian distributions`,
        d: R`$p(\mathbf z)=\N(\mathbf 0,I)$, $q_\phi=\N(\mu_\phi,\Sigma_\phi)$, $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta,\tau^2I)$. 복원 항이 제곱 오차가 됩니다.`,
        dEn: R`$p(\mathbf z)=\N(\mathbf 0,I)$, $q_\phi=\N(\mu_\phi,\Sigma_\phi)$, $p_\theta(\mathbf x\mid\mathbf z)=\N(f_\theta,\tau^2I)$. The reconstruction term becomes a squared error.` },
      { id: 'gkl', role: 'tool', k: '23.6', at: ':::key 가우시안 KL의 닫힌 형태', t: R`가우시안 KL의 닫힌 형태`, en: R`Closed-form Gaussian KL`,
        d: R`$\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$. $\mu\to\mathbf 0$, $\sigma^2\to1$로 당기고 분산이 $0$이 되는 것을 막습니다.`,
        dEn: R`$\frac12(\tr\Sigma+\lVert\mu\rVert^2-d-\log\det\Sigma)$. It pulls $\mu\to\mathbf 0$, $\sigma^2\to1$ and keeps the variance from reaching $0$.` },
      { id: 'rep', role: 'fix', k: '23.7', at: ':::key 재매개변수화', t: R`재매개변수화 $\mathbf z=\mu+\sigma\odot\varepsilon$`, en: R`Reparameterization $\mathbf z=\mu+\sigma\odot\varepsilon$`,
        d: R`무작위성을 $\varepsilon$으로 옮겨 $\partial\mathbf z/\partial\mu=I$, $\partial\mathbf z/\partial\sigma=\diag(\varepsilon)$. 복원 항의 기울기가 인코더까지 갑니다.`,
        dEn: R`Moving the randomness into $\varepsilon$ gives $\partial\mathbf z/\partial\mu=I$ and $\partial\mathbf z/\partial\sigma=\diag(\varepsilon)$, so the reconstruction gradient reaches the encoder.` },
    ],
    rows: [['gen', 'mle'], ['ar', 'lv'], ['ae', 'elbo'], ['vae'], ['gkl', 'rep']],
    edges: [
      ['gen', 'ar', R`곱셈 규칙으로`, R`by the product rule`],
      ['gen', 'lv', R`숨은 요인 z로`, R`with hidden factors z`],
      ['mle', 'ar', R`로그 가능도 최대화`, R`maximize the log-likelihood`],
      ['mle', 'lv', R`적분이 막는다`, R`blocked by an integral`],
      ['lv', 'ae', R`z를 추측하는 인코더`, R`an encoder that guesses z`],
      ['lv', 'elbo', R`q를 끼워 하한`, R`insert q for a bound`],
      ['ae', 'vae', R`코드에 분포를`, R`a distribution for codes`],
      ['elbo', 'vae', R`가우시안으로 계산`, R`compute with Gaussians`],
      ['vae', 'gkl', R`KL 항`, R`the KL term`],
      ['vae', 'rep', R`뽑기를 지나는 미분`, R`differentiate through the draw`],
    ],
  });
})();
