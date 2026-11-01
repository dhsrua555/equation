/* English text — 18 Barron's Theorem & Generalization (W8 Wed notes pp. 7–9, W9 Mon notes pp. 1–9). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    'Maurey 보조정리: 무작위 꼭짓점의 평균': 'Maurey’s lemma: averages of random vertices',
    '코사인 능선과 헤비사이드 계단': 'A cosine ridge and its Heaviside staircase',
    '계단 근사, K = 5': 'staircase, K = 5',
  });
  Object.assign(EM.en.fig, {
    maurey: R`The vertices $h_1,\dots,h_5$ are drawn $N$ times with probabilities $\alpha=(0.1,0.3,0.15,0.25,0.2)$ and averaged; each cloud has 40 such averages. Every average lies in the convex hull (shaded region), and its expectation is $f^*=\sum_j\alpha_jh_j$. With $N=32$ (filled dots) the averages gather much more tightly around $f^*$ than with $N=4$ (open dots), because the mean squared distance $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)$ is inversely proportional to $N$.`,
    barronstep: R`The cosine ridge $\varphi(t)=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}$ with $|\xi|=0.6$, $\kappa=0.9$, and the Heaviside staircase that jumps by $\varphi(t_k)-\varphi(t_{k-1})$ at $t_k=\pm\frac k5$. Since $\varphi(0)=0$ and $|\varphi'|\le1$, the error is at most $\frac15$ everywhere, and the absolute step heights add up to at most the total variation $\int_{-1}^1|\varphi'|dt\le2$. This is where the height bound $2C$ of $G_C$ comes from.`,
  });
  EM.en.ch[18] = {
    title: 'Barron’s Theorem and Generalization',
    fig: R`Maurey's lemma: approximating a point of a convex hull by the average of $N$ random samples, the squared errors (dots) lie below the bold curve $B^2/N$ on average, while individual ones scatter above and below it`,
    tagline: R`A function whose first Fourier moment is at most $C$ can be approximated by $N$ hidden neurons to a mean squared error of about $4C^2/N$. The dimension $d$ does not appear. The key is Maurey's argument that an average of $N$ random draws gathers with variance $1/N$, and the same idea of randomness gives, through the Rademacher complexity, a generalization error of $O(1/\sqrt n)$.`,
    summary: R`The universal approximation theorem of Unit 17 only says approximation is **possible**, not how many neurons it takes. For functions in the **Barron class** $\Gamma_C$, defined through the Fourier transform, this unit proves **Barron's theorem**: a network with one hidden layer of $N$ neurons reaches mean squared error $c/N$ ($c>4C^2$). The proof has three steps: (1) **Maurey's lemma**, which approximates a point of a convex hull in a Hilbert space by an average of $N$ elements to within $B^2/N$ (random draws and vanishing cross terms); (2) **Barron's lemma**, which places $f-f(0)$ in the convex hull of Heaviside ridge functions of height at most $2C$ (inverse Fourier transform, the probability measure $\Lambda$, a staircase approximation of cosine ridges); (3) replacing the Heavisides by steep sigmoids. The second half turns to **generalization**: population and empirical risk, the decomposition into approximation, generalization, and optimization, and the **Rademacher complexity**, which shows that the gap is $2\operatorname{Rad}_n+O(1/\sqrt n)$ and that a norm-bounded linear class has $Q/\sqrt n$. The notes' condition "$c>4C_1$" is corrected to $c>4C^2$, and the board's $1/\sqrt{2n}$ to the precise high-probability bound.`,
    goals: [
      R`Write the Fourier transform convention of this unit, define the Barron class $\Gamma_C$, and show that its functions are $C$-Lipschitz`,
      R`State Barron's theorem precisely (the condition $c>4C^2$, the normalized mean squared error) and explain the curse of dimensionality by comparison with the $\varepsilon^{-d}$ of grid approximation`,
      R`Prove Maurey's lemma with random draws, vanishing cross terms, the probabilistic method, and the triangle inequality`,
      R`Explain the flow of the proof of Barron's lemma (inverse Fourier transform, phase $\kappa$, probability measure $\Lambda$, staircase approximation of cosine ridges) and say where the height $2C$ comes from`,
      R`Complete Theorem 1 from the two lemmas and $\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$, and compute the number of neurons needed`,
      R`Define population and empirical risk, and prove the inequality splitting the excess risk into optimization, generalization, and approximation terms`,
      R`Define the Rademacher complexity and compute it for small classes, and prove the $2\operatorname{Rad}_n$ bound by symmetrization and $Q/\sqrt n$ for a linear class`,
    ],
    secTitles: { '18.1': 'The Barron class', '18.2': 'Barron’s theorem', '18.3': 'Maurey’s lemma', '18.4': 'Convex hull of Heavisides', '18.5': 'Completing the theorem', '18.6': 'Risk and generalization', '18.7': 'Rademacher complexity' },
    secs: {
      '18.1': { title: 'The Fourier Transform and the Barron Class', body: R`
:::idea In plain words
We can measure how "bumpy" a function is by its frequencies. The Fourier transform $\hat f(\xi)$ tells how much of a wave with frequency $\xi$ the function contains. The **Barron class** collects the functions for which the amplitudes $|\hat f(\xi)|$ weighted by the size of the frequency $|2\pi\xi|$ add up to a finite total, that is, functions without too many rapidly oscillating components. The theorem of 18.2 says such functions can be approximated by a network with one hidden layer at a **rate independent of the dimension**.
:::

**The Fourier transform** (W8 Wed notes p. 7, W9 Mon notes p. 1). For $f\in L^1(\mathbb R^d)$, that is, $\int_{\mathbb R^d}|f(x)|\,dx<\infty$,
$$\hat f(\xi)=\int_{\mathbb R^d}f(x)\,e^{-2\pi i\,\xi^Tx}\,dx,\qquad\xi\in\mathbb R^d.$$
If $\hat f$ is integrable too ($\hat f\in L^1$), the inverse transform $f(x)=\int_{\mathbb R^d}\hat f(\xi)\,e^{2\pi i\,\xi^Tx}\,d\xi$ brings it back. With $2\pi$ in the exponent, the inverse has no constant in front, and the transform of $\nabla f$ is $2\pi i\,\xi\,\hat f(\xi)$[[@em:ch10:11.9|Engineering Mathematics uses another convention, with the factor 1/√(2π) and e^(−iwx). Reading the frequency as w = 2πξ gives the same content.]].

**Preliminary: Sobolev spaces** (W8 Wed notes p. 7). The notes first wrote
$$f\in H^s(\mathbb R^d)\iff\int_{\mathbb R^d}|\hat f(\xi)|^2(1+|\xi|^2)^s\,d\xi<\infty.$$
One derivative multiplies $\hat f$ by $2\pi i\xi$, so the weight $(1+|\xi|^2)^s$ says "the square integral stays finite after $s$ derivatives" in terms of frequencies. The Barron class takes this idea and replaces the integral of squares ($L^2$) by the integral of absolute values ($L^1$), and the weight by a single $|\xi|$.

:::key The Barron class
For $C>0$,
$$\Gamma_C:=\Big\{f\in L^1(\mathbb R^d):\ \lVert\hat f\rVert_{L^1(\mathbb R^d)}<\infty,\ \int_{\mathbb R^d}|2\pi\xi|\,|\hat f(\xi)|\,d\xi<C\Big\}.$$
If $f\in\Gamma_C$, then $|f(x)-f(y)|\le C|x-y|$ for all $x,y$.
:::

The notes call this constant $C_1$. This unit writes $C$.

**What it measures.** $\int|2\pi\xi||\hat f(\xi)|d\xi$ adds up all the Fourier amplitudes $|2\pi i\xi\hat f(\xi)|$ of the gradient $\nabla f$. From the inverse transform, $f(x)-f(y)=\int\hat f(\xi)\big(e^{2\pi i\xi^Tx}-e^{2\pi i\xi^Ty}\big)d\xi$, and $|e^{iu}-e^{iv}|\le|u-v|$, so
$$|f(x)-f(y)|\le\int|\hat f(\xi)|\,2\pi|\xi^T(x-y)|\,d\xi\le|x-y|\int|2\pi\xi||\hat f(\xi)|\,d\xi\le C|x-y|.$$
So functions of the Barron class are $C$-Lipschitz[[@base:ch05:5.1|The Lipschitz condition.]]. High-frequency components have large $|\xi|$ and hence large weight, so the faster a function oscillates, the larger $C$ becomes.

:::ex Example 1 — The Barron constant of a Gaussian
In $d=1$, the Fourier transform of $f(x)=e^{-\pi x^2}$ is $\hat f(\xi)=e^{-\pi\xi^2}$. Compute $\int|2\pi\xi||\hat f(\xi)|d\xi$ and say for which $C$ the function lies in $\Gamma_C$.
---
By symmetry, $\int_{-\infty}^{\infty}2\pi|\xi|e^{-\pi\xi^2}d\xi=2\int_0^\infty2\pi\xi e^{-\pi\xi^2}d\xi=2\big[-e^{-\pi\xi^2}\big]_0^\infty=2$. Since $\hat f$ is integrable too ($\int e^{-\pi\xi^2}d\xi=1$), $f\in\Gamma_C$ for every $C>2$. Indeed the maximum of $|f'(x)|=2\pi|x|e^{-\pi x^2}$ is $\sqrt{2\pi}e^{-1/2}\approx1.52$, below the Lipschitz bound 2.
:::

**When the domain is a ball** (W8 Wed notes p. 8). Networks are actually used on a bounded region $\Omega$ such as the unit ball. A function $f$ defined only on $\Omega$ has no Fourier transform, so we use the transform of an **extension** $f_e$ to all of $\mathbb R^d$ ($f_e|_\Omega=f$). There are infinitely many extensions, so we take the best one:
$$B^s(\Omega)=\Big\{f:\Omega\to\mathbb C\ :\ \lVert f\rVert_{B^s(\Omega)}:=\inf_{f_e|_\Omega=f}\int_{\mathbb R^d}(1+|\xi|)^s|\hat f_e(\xi)|\,d\xi<\infty\Big\}.$$
In the picture of the notes, the blue interval is $\Omega$, the red curve on it is $f$, and the green lines outside are the extension ("among the extensions of $f$, those equal to $f$ on $\Omega$"). Bending sharply outside creates high frequencies and enlarges the integral, so the infimum is set by the smoothest way of continuing. Since $|2\pi\xi|\le2\pi(1+|\xi|)$, a small $\lVert f\rVert_{B^1(\Omega)}$ means a small Barron constant (for a good extension).

:::warn Notation in the notes
The notes write the subscript on and off, as in $\Gamma_{C_1}$ and $C_1$. It is the same constant, and this unit always writes $C$. $|\xi|$ is the Euclidean norm $\lVert\xi\rVert_2$.
:::

### Going deeper

$\lVert\hat f\rVert_{L^1}<\infty$ makes the inverse formula hold at every point (then $f$ is continuous), and the proof in 18.4 uses it to write $f(x)-f(0)$ as a single integral. As an example outside the Barron class, the indicator $\mathbf 1_{[-1,1]}$ of an interval has $\hat f(\xi)=\frac{\sin2\pi\xi}{\pi\xi}$, which decays only like $1/|\xi|$, so $\int|\xi||\hat f|d\xi=\infty$. Such functions can still be approximated by networks in $L^2$, but the rate of 18.2 is not guaranteed.
` },
      '18.2': { title: 'Barron’s Theorem and the Curse of Dimensionality', body: R`
:::idea In plain words
For a function in the Barron class, $N$ hidden neurons bring the mean squared error below $\frac cN$, where $c$ only needs to be a little larger than $4C^2$. The surprise is that **the input dimension $d$ is absent** from this formula. Classical approximation, which cuts space into a fine grid, needs exponentially many cells as the dimension grows (the curse of dimensionality), but this does not happen for Barron functions.
:::

:::key Barron's theorem (Theorem 1)
Let $\sigma:\mathbb R\to\mathbb R$ be a sigmoid and $f\in\Gamma_C$ ($C>0$). With the unit ball $B_1^d:=\{x\in\mathbb R^d:\lVert x\rVert\le1\}$, for every $c>4C^2$ and $N\in\mathbb N$ there is a network $\Phi_N$ with $N$ hidden neurons such that
$$\frac1{|B_1^d|}\int_{B_1^d}|f(x)-\Phi_N(x)|^2\,dx\le\frac cN.$$
It can be chosen of the form $\Phi_N(x)=f(0)+\sum_{i=1}^N\frac{\gamma_i}N\,\sigma(\langle a_i,x\rangle+b_i)$ with $|\gamma_i|\le2C$.
:::

$|B_1^d|$ is the volume of the unit ball, so the left side is the **mean** squared error over the ball. The sigmoid follows the definition of 17.4 (continuous, tending to 0 at $-\infty$ and to 1 at $+\infty$)[[ch17:17.4|Sigmoids and discriminatory functions.]].

:::hand Lecture notes — Theorem 1 (W8 Wed p. 9, W9 Mon p. 1)
“Let $\sigma:\mathbb R\to\mathbb R$ sigmoid and let $f\in\Gamma_{C_1}$ for some $C_1>0$. Denote by $B_1^d:=\{x\in\mathbb R^d:\lVert x\rVert\le1\}$ the unit ball. Then, for every $c>4C_1^2$ and $N\in\mathbb N$, $\exists$ a NN $\Phi=f_N$ w/ $N$ neurons s.t. $\frac1{|B_1^d|}\int_{B_1^d}|f(x)-\Phi(x)|^2dx\le\frac cN$.”
Below it, in blue: “(curse of dimensionality)”.
:::

:::warn The condition is c > 4C²
Theorem 1 in the notes of Oct. 26 reads "$c>4C_1$", but the end of the proof on the same day (18.5) obtains $\frac{4C_1^2}N$, and the notes of Oct. 21 also have $4C_1^2$. The proof puts $B=2C$ into Maurey's lemma, which gives $B^2=4C^2$, so **the correct condition is $c>4C^2$**. Also, the last formula of the notes in 18.5 drops the $\frac1{|B_1^d|}$ in front of $\int_{B_1^d}$; since the norm $\lVert\cdot\rVert_{L^2_\circ}$ used in the proof is normalized, it should be read as the **mean**, as in the theorem.
:::

**The curse of dimensionality** (W9 Mon notes p. 1). For comparison, consider grid approximation. Cutting $[0,1]^d$ into small cubes of side $h$ and using a constant on each, an $L$-Lipschitz function has error at most $L\sqrt d\,h$, but there are $h^{-d}$ cells. For error $\varepsilon$ we need $h\approx\varepsilon$, hence about $\varepsilon^{-d}$ parameters. In general, approximating a function of smoothness $s$ with $N$ fixed basis functions only brings the error down like $N^{-s/d}$, which for large $d$ barely decreases at all.

| Target RMS error $\varepsilon=0.1$ | $d=1$ | $d=10$ | $d=100$ |
|---|---|---|---|
| Grid cells $\varepsilon^{-d}$ | $10$ | $10^{10}$ | $10^{100}$ |
| Barron: neurons $\approx4C^2/\varepsilon^2$ | $400C^2$ | $400C^2$ | $400C^2$ |

The square root of the mean squared error $\frac cN$ of Barron's theorem, the RMS error, is $\sqrt{c/N}$, so $N\approx c/\varepsilon^2$ neurons reach $\varepsilon$, independently of $d$. This is one of the theoretical clues to why networks work on high-dimensional inputs (for images $d$ is in the tens of thousands).

:::warn The price hides in C
That $d$ is missing from the formula does not make high dimension free. A function of the same shape can have a larger Barron constant $C$ in higher dimension (for example, $\int|2\pi\xi||\hat f|d\xi$ of the $d$-dimensional Gaussian $e^{-\pi|x|^2}$ is about $\sqrt{2\pi d}$). Also, the theorem says such a network **exists**, not that gradient descent **finds** it (the optimization error of 17.1).
:::

**The plan of the proof** (W9 Mon notes p. 4). The notes write: "This lemma (Maurey) suggests that we can show Thm 1 by showing that each function in $\Gamma_{C_1}$ belongs to the **convex hull** of NN." The proof has three steps.
1. **Maurey's lemma** (18.3): a point of the (closed) convex hull of elements of norm at most $B$ is approximated by an average of $N$ of those elements to a squared error of about $\frac{B^2}N$.
2. **Barron's lemma** (18.4): $f-f(0)$ lies in the closure of the convex hull of Heaviside ridge functions of height at most $2C$.
3. **Completion** (18.5): put $B=2C$ into step 1 and replace the Heavisides by steep sigmoids.

:::ex Example 2 — How many neurons
To approximate a Barron function with $C=1$ on the unit ball to mean squared error at most $0.01$, what is the smallest $N$ guaranteed by Theorem 1?
---
Choose $c>4$ with $\frac cN\le0.01$, that is, $N\ge100c$. Since $c$ need only be slightly larger than 4 ($c=4.01$), $N=401$ works, while $N=400$ would need $c\le4$ and is not guaranteed by the theorem. So $N=401$. The dimension $d$ never enters the computation.
:::
` },
      '18.3': { title: 'Maurey’s Lemma: Convex Hulls and Random Samples', body: R`
:::idea In plain words
A point $f^*=\sum_j\alpha_jh_j$ of a convex hull is a weighted average of the vertices. Treating the weights $\alpha_j$ as probabilities, **draw** a vertex at random $N$ times and average: the average has expectation $f^*$, and its spread (variance) shrinks by a factor $\frac1N$. It is the same principle that makes the variance of a minibatch gradient inversely proportional to the batch size[[ch10:10.2|The variance of a minibatch average is 1/B times smaller.]]. Then at least one outcome of the draws has error at most $\frac{B^2}N$.
:::

**Convex hull** (W9 Mon notes p. 1). The convex hull of a set $G$ is the set of all convex combinations of its elements:
$$\operatorname{co}(G):=\Big\{\sum_{j=1}^n\alpha_jx_j\ :\ n\in\mathbb N,\ x_j\in G,\ \alpha_j\ge0,\ \sum_j\alpha_j=1\Big\}.$$
$\overline{\operatorname{co}}(G)$ is its **closure**, the set of points that elements of $\operatorname{co}(G)$ approximate arbitrarily well[[@robot:ch03|Convex sets and convex hulls (the grasping unit of Robotics).]]. The notes write $\alpha_j>0$, which gives the same set since zero terms can be dropped. A Hilbert space is a complete space with an inner product; here it is enough to think of a space where lengths and angles can be measured, like $\mathbb R^m$ or the $L^2_\circ(B_1^d)$ of 18.4[[@em:ch17:3.2d|Hilbert spaces.]].

:::key Maurey's lemma (Lemma 1)
Let $H$ be a Hilbert space and suppose every element of $G\subset H$ satisfies $\lVert g\rVert_H\le B$. If $f\in\overline{\operatorname{co}}(G)$, then for every $N\in\mathbb N$ and $c>B^2$ there are $g_1,\dots,g_N\in G$ such that
$$\Big\lVert f-\frac1N\sum_{i=1}^Ng_i\Big\rVert_H^2\le\frac cN.$$
:::

:::hand Lecture notes — proof (W9 Mon pp. 2–3)
Fix $\varepsilon>0$ and $N\in\mathbb N$. Since $f\in\overline{\operatorname{co}}(G)$, there are coefficients $\alpha_1,\dots,\alpha_m\in[0,1]$ summing to 1 and elements $h_1,\dots,h_m\in G$ such that $f^*=\sum_{j=1}^m\alpha_jh_j$ satisfies $\lVert f-f^*\rVert_H<\varepsilon$.

**Claim.** There are $g_1,\dots,g_N$, each in $\{h_1,\dots,h_m\}$, such that
$$\Big\lVert f^*-\frac1N\sum_{i=1}^Ng_i\Big\rVert_H^2\le\frac{B^2}N.\qquad(3)$$
Since $\varepsilon$ is arbitrary, this claim concludes the proof (last step).

**Draw at random.** Let $X_1,\dots,X_N$ be i.i.d. random variables with $\mathbb P[X_i=h_j]=\alpha_j$ ($j=1,\dots,m$). Then $\E[X_i]=\sum_j\mathbb P(X_i=h_j)\,h_j=\sum_j\alpha_jh_j=f^*$.

**Expand.** Writing $f^*=\frac1N\sum_{j=1}^Nf^*$ and using $\big\lVert\sum_iv_i\big\rVert^2=\sum_i\lVert v_i\rVert^2+\sum_{i\ne j}\langle v_i,v_j\rangle$,
$$\begin{aligned}\E\Big\lVert f^*-\frac1N\sum_{j=1}^NX_j\Big\rVert^2&=\E\Big\lVert\frac1N\sum_{j=1}^N(f^*-X_j)\Big\rVert^2\\&=\frac1{N^2}\E\Big[\sum_{j=1}^N\lVert f^*-X_j\rVert^2+\sum_{i\ne j}\langle f^*-X_i,f^*-X_j\rangle\Big].\end{aligned}$$

**The cross terms are 0.** For $i\ne j$, independence gives $\E\langle X_i,X_j\rangle=\langle\E X_i,\E X_j\rangle=\lVert f^*\rVert^2$, so
$$\E\langle f^*-X_i,f^*-X_j\rangle=\lVert f^*\rVert^2-\langle f^*,\E X_j\rangle-\langle\E X_i,f^*\rangle+\E\langle X_i,X_j\rangle=0.$$

**Down to one term.** The remaining $N$ terms have the same distribution, $\E\langle f^*,X_1\rangle=\lVert f^*\rVert^2$, and $\lVert X_1\rVert\le B$, so
$$\begin{aligned}\E\Big\lVert f^*-\frac1N\sum_jX_j\Big\rVert^2&=\frac1N\E\lVert f^*-X_1\rVert^2=\frac1N\E\big[\lVert f^*\rVert^2-2\langle f^*,X_1\rangle+\lVert X_1\rVert^2\big]\\&=\frac1N\big(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2\big)\le\frac{B^2}N.\end{aligned}$$
Since the expectation is at most $\frac{B^2}N$, there is at least one outcome $\omega$ with $\lVert f^*-\frac1N\sum_jX_j(\omega)\rVert^2\le\frac{B^2}N$, and $g_i:=X_i(\omega)$ gives (3).

**Finish (triangle inequality).**
$$\Big\lVert f-\frac1N\sum_ig_i\Big\rVert_H\le\lVert f-f^*\rVert_H+\Big\lVert f^*-\frac1N\sum_ig_i\Big\rVert_H\le\varepsilon+\frac B{\sqrt N}<\sqrt{\frac cN}.$$
Because $c>B^2$, $\sqrt{c/N}-B/\sqrt N>0$, and taking $\varepsilon$ smaller than that makes the last inequality hold. Squaring, $\lVert f-\frac1N\sum_ig_i\rVert_H^2\le\frac cN$. ∎
:::

**Why the cross terms vanish.** As the red marks in the notes show, the heart of the proof is that the $f^*-X_i$ have **mean 0 and are independent**. So the expected squared norm of the sum is the sum of the expected squared norms (variances add), and averaging $N$ of them divides by $N^2$, leaving a factor $\frac1N$. $\E\langle X_i,X_j\rangle=\langle\E X_i,\E X_j\rangle$ can be checked directly, since $X_i,X_j$ take finitely many values: $\sum_{k,l}\alpha_k\alpha_l\langle h_k,h_l\rangle=\big\langle\sum_k\alpha_kh_k,\sum_l\alpha_lh_l\big\rangle$.

**The probabilistic method.** The argument is "if the expectation is at most $a$, at least one outcome is at most $a$". If every outcome were larger than $a$, so would be the average. Randomness is only a tool to show existence; the lemma itself is a deterministic statement.

:::fig maurey
:::

:::ex Example 3 — Checking it in the plane
With $H=\mathbb R^2$, $G=\{h_1,h_2\}=\{(1,0),(0,1)\}$ ($B=1$), and $f^*=\frac12h_1+\frac12h_2=(\frac12,\frac12)$, compute $\E\lVert f^*-\frac1N\sum_jX_j\rVert^2$ directly and compare with the formula of the proof.
---
Let $K\sim\operatorname{Bin}(N,\frac12)$ be the number of times $h_1$ is drawn. The average is $(\frac KN,1-\frac KN)$, and its squared distance from $f^*$ is $2(\frac KN-\frac12)^2$. Since $\Var(\frac KN)=\frac1{4N}$, the expectation is $\frac1{2N}$. This equals the formula of the proof, $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)=\frac1N(1-\frac12)=\frac1{2N}$, exactly, and is below the bound $\frac{B^2}N=\frac1N$.
:::

:::warn Why c > B²
The strict inequality absorbs the slack $\varepsilon$ that comes from the closure. If $f$ lies in $\operatorname{co}(G)$ itself rather than its closure, we can take $\varepsilon=0$ and $c=B^2$ also works. The proof actually gives the better $\frac{B^2-\lVert f^*\rVert^2}N$.
:::

### Going deeper

The lemma is due to Maurey, and Jones (1992) and Barron (1993) used it for neural network approximation. The proof expands an inner product (the cross terms vanish), so being in a Hilbert space matters; in a general normed space the same rate may fail. The argument also produces the approximant as **an average of $N$ elements of $G$**, so if $G$ is taken to be "the functions a single neuron makes", it is immediately a network with $N$ hidden neurons. This is the direction of 18.4–18.5.
` },
      '18.4': { title: 'The Convex Hull of Heaviside Functions', body: R`
:::idea In plain words
To use Maurey's lemma we must show that $f$ lies in the convex hull of "single-neuron functions". The inverse Fourier transform writes $f$ as a **weighted average** (an integral) of cosine waves. Turning the weights into a probability measure makes this a limit of convex combinations, and each cosine wave, a one-dimensional function varying in only one direction, is approximated by convex combinations of **step (Heaviside) functions**. That the step heights add up to at most 2 is where $2C$ comes from.
:::

**The family of Heaviside ridge functions** (W9 Mon notes p. 4). Let $\mathbf 1_{\mathbb R_+}(t)$ be the Heaviside function, 1 for $t\ge0$ and 0 for $t<0$, and set
$$G_C:=\big\{x\in B_1^d\mapsto\gamma\,\mathbf 1_{\mathbb R_+}(\langle a,x\rangle+b)\ :\ a\in\mathbb R^d,\ b\in\mathbb R,\ |\gamma|\le2C\big\}.$$
One element is a single "cliff", equal to $\gamma$ on one side of the hyperplane $\langle a,x\rangle+b=0$ and 0 on the other: **a single neuron** whose activation is a step function.

**The norm.** For functions on the ball we use the normalized $L^2$ norm:
$$\lVert g\rVert_{L^2_\circ(B_1^d)}:=\Big(\frac1{|B_1^d|}\int_{B_1^d}|g(x)|^2dx\Big)^{1/2}.$$
$L^2_\circ(B_1^d)$ is a Hilbert space with the inner product $\langle g,h\rangle=\frac1{|B_1^d|}\int_{B_1^d}gh\,dx$, and the constant 1 has norm 1. Hence $\lVert g\rVert_{L^2_\circ}\le|\gamma|\le2C$ for $g\in G_C$.

:::key Barron's lemma (Lemma 2)
If $d\in\mathbb N$, $C>0$, and $f\in\Gamma_C$, then
$$f|_{B_1^d}-f(0)\in\overline{\operatorname{co}}(G_C),$$
where the closure is taken in the norm $\lVert\cdot\rVert_{L^2_\circ(B_1^d)}$. (Barron, 1993)
:::

:::hand Lecture notes — sketch of the proof (W9 Mon pp. 5–7)
Since $f\in\Gamma_C$, $f,\hat f\in L^1(\mathbb R^d)$, and by the inverse transform
$$\begin{aligned}f(x)-f(0)&=\int_{\mathbb R^d}\hat f(\xi)\big(e^{2\pi i\langle x,\xi\rangle}-1\big)d\xi\\&=\int_{\mathbb R^d}|\hat f(\xi)|\big(e^{2\pi i\langle x,\xi\rangle+i\kappa(\xi)}-e^{i\kappa(\xi)}\big)d\xi.\end{aligned}$$
Here $\kappa(\xi)$ is the phase of $\hat f(\xi)$, that is, $\hat f(\xi)=|\hat f(\xi)|e^{i\kappa(\xi)}$. Since $f$ is real-valued, only the real part remains:
$$\begin{aligned}f(x)-f(0)&=\int_{\mathbb R^d}|\hat f(\xi)|\big(\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)\big)d\xi\\&=\int_{\mathbb R^d}\frac{\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)}{|2\pi\xi|}\,|2\pi\xi||\hat f(\xi)|\,d\xi.\end{aligned}$$
Defining a new measure $\Lambda$ by the density $d\Lambda(\xi)=\frac1C|2\pi\xi||\hat f(\xi)|\,d\xi$, $\Lambda$ is a probability measure on $\mathbb R^d$ (see the caution below), and
$$f(x)-f(0)=C\int_{\mathbb R^d}q_x(\xi)\,d\Lambda(\xi),\qquad q_x(\xi):=\frac{\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)}{|2\pi\xi|}.\qquad(5)$$
This integral is approximated by the sum $C\sum_\theta q_x(\theta)\Lambda(I_\theta)$ over the grid $\theta\in\frac1n\mathbb Z^d$ ($I_\theta$ a small cube containing $\theta$). Since $\Lambda(I_\theta)\ge0$ and they sum to 1, the sum is a **convex combination** of the functions $x\mapsto Cq_x(\theta)$. The picture in the notes: the original integral $f(x)-f(0)$ ← approximation → a convex combination.
:::

:::warn The notes' Λ and "conti. even"
$\Gamma_C$ is defined with $\int|2\pi\xi||\hat f|d\xi<C$ (strict), so dividing the density by $C$ gives total mass **less** than 1. The fix is to divide by $C_f:=\int|2\pi\xi||\hat f(\xi)|d\xi<C$ (if $C_f=0$, $f$ is constant and there is nothing to do). Then $\Lambda$ is a probability measure, the factor in (5) becomes $C_f$, and the height $2C_f$ obtained below is at most $2C$, so it still falls in $G_C$. The "conti., even" written next to $q$ in the notes is right: for real $f$, $\hat f(-\xi)=\overline{\hat f(\xi)}$, so $\kappa(-\xi)=-\kappa(\xi)$ and therefore $q_x(-\xi)=q_x(\xi)$.
:::

**The missing step: cosine ridges into steps** (not in the lecture notes). The sketch in the notes shows that $f-f(0)$ is a limit of convex combinations of the functions $x\mapsto C_fq_x(\xi)$. It remains to show that each $x\mapsto q_x(\xi)$ lies in the (closed) convex hull of Heaviside ridges of height at most 2. Fix $\xi\ne0$ and put $\omega=\xi/|\xi|$, $t=\langle x,\omega\rangle$; for $\lVert x\rVert\le1$, $t\in[-1,1]$ and
$$q_x(\xi)=\varphi(t),\qquad\varphi(t):=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}.$$
$\varphi$ is a **ridge function** varying only in the direction $\omega$, with $\varphi(0)=0$ and $|\varphi'(t)|=|\sin(2\pi|\xi|t+\kappa)|\le1$. Hence also $|q_x(\xi)|=|\varphi(t)|\le|t|\le1$ on the ball.

**Staircase approximation.** With $t_k=\frac kK$ ($k=0,\dots,K$), approximate
$$\varphi(t)\approx\sum_{k=1}^K\Delta_k^+\,\mathbf 1_{\mathbb R_+}(t-t_k)+\sum_{k=1}^K\Delta_k^-\,\mathbf 1_{\mathbb R_+}(-t-t_k),\qquad\Delta_k^\pm:=\varphi(\pm t_k)-\varphi(\pm t_{k-1}).$$
For $t_k\le t<t_{k+1}$ the first sum telescopes to $\varphi(t_k)-\varphi(0)=\varphi(t_k)$ and the second is 0; for $t<0$ it is the other way round. Since $\varphi$ is 1-Lipschitz, the error is at most $\frac1K$ for every $t\in[-1,1]$. Each term is a Heaviside ridge of the form $\mathbf 1_{\mathbb R_+}(\langle\pm\omega,x\rangle-t_k)$, and the absolute heights add up to
$$V:=\sum_k|\Delta_k^+|+\sum_k|\Delta_k^-|\le\int_{-1}^1|\varphi'(t)|\,dt\le2.$$
So the staircase equals $\sum\frac{|\Delta|}V\cdot\big(V\operatorname{sign}(\Delta)\,\mathbf 1_{\mathbb R_+}(\cdots)\big)$, a convex combination of ridges of height $V\le2$. Multiplying by the factor $C_f$ gives height $2C_f\le2C$, inside $G_C$, and the uniform error $\frac{C_f}K$ bounds the $L^2_\circ$ error, so letting $K\to\infty$, $x\mapsto C_fq_x(\xi)\in\overline{\operatorname{co}}(G_C)$.

:::fig barronstep
:::

**Finishing with the closure.** Instead of a Riemann sum, random draws as in 18.3 make the details simple. Draw $\xi_1,\dots,\xi_n$ independently from $\Lambda$; at each $x$, $\E[C_fq_x(\xi_i)]=f(x)-f(0)$ and $|C_fq_x|\le C_f$, so exactly as in 18.3,
$$\E\Big\lVert(f-f(0))-\frac1n\sum_{i=1}^nC_fq_\cdot(\xi_i)\Big\rVert_{L^2_\circ}^2\le\frac{C_f^2}n\to0.$$
Each average $\frac1n\sum_iC_fq_\cdot(\xi_i)$ is a convex combination of elements of $\overline{\operatorname{co}}(G_C)$, so it lies in $\overline{\operatorname{co}}(G_C)$ again (a closed convex set), and so does its limit $f-f(0)$. ∎

**What the height 2C means.** The sum of the step heights is at most the total variation $\int|\varphi'|$ of the ridge $\varphi$, and a $\varphi$ with slope at most 1 moving over the interval $[-1,1]$ of length 2 gives 2. For a ball of radius $r$ this becomes $2r$, which yields the constant $(2rC)^2$ of Barron's original theorem.
` },
      '18.5': { title: 'Completing Theorem 1: A Network with One Hidden Layer', body: R`
:::idea In plain words
Now the pieces fit together. By Lemma 2, $f-f(0)$ lies in the (closed) convex hull of step neurons of height at most $2C$, and Lemma 1 with $B=2C$ reaches a mean squared error of about $\frac{4C^2}N$ with an average of $N$ of those neurons. Finally, a step function is nearly the same as a sigmoid with a very large slope, so replacing the step neurons by sigmoid neurons gives an ordinary network with one hidden layer.
:::

:::hand Lecture notes — completing Theorem 1 (W9 Mon pp. 7–8)
$f\in\Gamma_{C_1}$. By Lemma 2, $f|_{B_1^d}-f(0)\in\overline{\operatorname{co}}(G_{C_1})$.
For every $g\in G_{C_1}$, $\lVert g\rVert_{L^2_\circ(B_1^d)}\le2C_1$, so by Lemma 1 with $H=L^2_\circ(B_1^d)$, for every $N\in\mathbb N$ there are $|r_i|<2C_1$ with
$$\int_{B_1^d}\Big|f(x)-f(0)-\sum_{i=1}^Nr_i\mathbf 1_{\mathbb R_+}(\langle a_i,x\rangle+b_i)\Big|^2\le\frac{4C_1^2}N.$$
And since "$\sigma(\lambda x)\to\mathbf 1_{\mathbb R_+}(x)$",
$$\int_{B_1^d}\Big|f(x)-f(0)-\sum_{i=1}^Nr_i\,\sigma(\langle a_i,x\rangle+b_i)\Big|^2dx\le\frac{4C_1^2}N,$$
that is, it is approximated by a network with one hidden layer ("1 layer NN").
:::

:::warn Reading the notes' formula correctly
Three things must be read differently. (1) Lemma 1 gives the **average** $\frac1N\sum_ig_i$, so the coefficients are $r_i=\frac{\gamma_i}N$ with $|\gamma_i|\le2C$ (so $|r_i|\le\frac{2C}N$). (2) Because of the closure, the right side is not $\frac{4C^2}N$ itself but "$\frac cN$ for any $c>4C^2$". (3) The integral is the mean normalized by $\frac1{|B_1^d|}$ (18.2).
:::

**From sigmoids to Heavisides** (W9 Mon notes p. 8). Written precisely, the line in quotation marks in the notes reads as follows.

:::key From sigmoids to Heavisides
If $\sigma$ is a sigmoid, then $\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$ for $t\ne0$ as $\lambda\to\infty$. Hence, if $a\ne0$,
$$\big\lVert\sigma\big(\lambda(\langle a,\cdot\rangle+b)\big)-\mathbf 1_{\mathbb R_+}(\langle a,\cdot\rangle+b)\big\rVert_{L^2_\circ(B_1^d)}\to0\qquad(\lambda\to\infty).$$
:::

For $t>0$, $\lambda t\to+\infty$, so $\sigma(\lambda t)\to1$; for $t<0$ it tends to 0. The points where they disagree, $\langle a,x\rangle+b=0$, form a hyperplane of volume 0, and $|\sigma-\mathbf 1_{\mathbb R_+}|\le1$ is bounded, so by dominated convergence the integral tends to 0 too. The convergence is not uniform near the hyperplane, but the band where the disagreement is large shrinks in volume as $\lambda$ grows, so the $L^2$ error vanishes. (An element with $a=0$ is the constant $\gamma\mathbf 1_{\mathbb R_+}(b)$, which can be rewritten with $b\ne0$ so that the same argument applies.)

**Finish.** Given $c>4C^2$, choose $c'$ with $4C^2<c'<c$ and get mean squared error $\le\frac{c'}N$ with Heavisides. By the triangle inequality, the extra RMS error from replacing all $N$ neurons by sigmoids is at most $\sum_i\frac{|\gamma_i|}N\big\lVert\sigma(\lambda\,\cdot)-\mathbf 1_{\mathbb R_+}(\cdot)\big\rVert\le2C\max_i\lVert\cdots\rVert$, and a large $\lambda$ makes it smaller than $\sqrt{c/N}-\sqrt{c'/N}$. The resulting
$$\Phi_N(x)=f(0)+\sum_{i=1}^N\frac{\gamma_i}N\,\sigma\big(\lambda\langle a_i,x\rangle+\lambda b_i\big)$$
is a **network with one hidden layer** of $N$ neurons and output bias $f(0)$, with mean squared error at most $\frac cN$[[ch08:8.6|Multilayer perceptrons.]].

:::ex Example 4 — Number of neurons and output weights
For $C=\frac12$, what is the smallest number of neurons for which Theorem 1 guarantees mean squared error at most $0.001$, and what bounds the sum of the absolute output weights $\frac{\gamma_i}N$?
---
$4C^2=1$, so $c>1$ and $\frac cN\le0.001\iff N\ge1000c$. Taking $c$ slightly larger than 1, the smallest is $N=1001$. The sum of the absolute output weights is $\sum_i\frac{|\gamma_i|}N\le2C=1$, independent of $N$.
:::

**What is guaranteed and what is not.** Theorem 1 concerns the **approximation error** among the three errors of 17.1. A network with one hidden layer of $N$ neurons and mean squared approximation error $O(C^2/N)$ exists. That the output weights add up to $\sum_i|\gamma_i|/N\le2C$ connects to the generalization bound of 18.7. On the other hand, the inner weights $\lambda a_i$ may grow without bound as $\lambda\to\infty$, and there is no guarantee that training finds this network[[ch17:17.1|The three errors: approximation, generalization, optimization.]].
` },
      '18.6': { title: 'Generalization: Population Risk and Empirical Risk', body: R`
:::idea In plain words
Approximation theory asks whether a good function **exists** in the class. In practice, however, we choose a function after seeing only $n$ data points, so whether a function that fits the training data also fits **unseen data** is a separate question. The first is measured by the population risk, the second by the empirical risk, and controlling their difference is the problem of generalization.
:::

**Setting** (W9 Mon notes p. 8). The input is $x\in\mathbb R^d$, the output $y\in\mathcal Y$, and the training data $\{(x_i,y_i)\}_{i=1}^n$ are drawn independently from an unknown distribution $P$. A loss $\ell(y,f(x))$ (e.g., squared error, cross-entropy) measures how bad a prediction is. We want the $f$ that minimizes the prediction error.

:::key Population risk and empirical risk
$$R(f):=\E_{(X,Y)\sim P}\big[\ell(Y,f(X))\big],\qquad\hat R_n(f):=\frac1n\sum_{i=1}^n\ell(y_i,f(x_i)).$$
$R$ is the **population risk** and $\hat R_n$ the **empirical risk**. We want $\argmin_{f\in\mathcal F}R(f)$, but since $P$ is unknown we solve $\argmin_{f\in\mathcal F}\hat R_n(f)$ (empirical risk minimization, ERM).
:::

The notes write the two argmins side by side, labelled "population risk" and "empirical risk". For a single fixed $f$, $\E\hat R_n(f)=R(f)$, and by the law of large numbers $\hat R_n(f)\to R(f)$. The trouble is that for $\hat f$, **chosen to minimize** $\hat R_n$, $\hat R_n(\hat f)$ comes out optimistically smaller than $R(\hat f)$ (overfitting)[[ch04:4.2|Polynomial regression and overfitting.]]. So we must control not one function but the gap over the whole class, $\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|$[[@ml:ch03:4.1b|The uniform convergence property.]].

:::key The three-way risk decomposition
For $f_{\mathcal F}=\argmin_{\mathcal F}R$, $\hat f=\argmin_{\mathcal F}\hat R_n$, the output $\tilde f\in\mathcal F$ of a training algorithm, and the minimum risk over all functions $R^*=\inf_fR(f)$,
$$R(\tilde f)-R^*\le\underbrace{\hat R_n(\tilde f)-\hat R_n(\hat f)}_{\text{optimization}}+\underbrace{2\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|}_{\text{generalization}}+\underbrace{R(f_{\mathcal F})-R^*}_{\text{approximation}}.$$
:::

**Proof.** Splitting into five brackets,
$$\begin{aligned}R(\tilde f)-R^*&=\big[R(\tilde f)-\hat R_n(\tilde f)\big]+\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+\big[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})\big]\\&\quad+\big[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})\big]+\big[R(f_{\mathcal F})-R^*\big].\end{aligned}$$
The first and fourth brackets are each at most $\sup_f|R-\hat R_n|$, and the third is at most 0 because $\hat f$ minimizes $\hat R_n$. ∎

The three arrows (opt, gen, app) in the picture of 17.1 are these three terms. The approximation error is handled by Unit 17 and 18.2–18.5, the generalization error by 18.7, and the optimization error by Units 13–14 (convergence of gradient descent and SGD)[[ch17:17.1|The three errors.]].

:::ex Example 5 — Computing an empirical risk
With squared loss $\ell(y,\hat y)=(y-\hat y)^2$ and data $(x,y)=(0,1),(1,1),(2,5)$, what is the empirical risk of $f(x)=2x$?
---
The predictions are $0,2,4$ and the errors $1,-1,1$, so $\hat R_3(f)=\frac{1+1+1}3=1$.
:::
` },
      '18.7': { title: 'Rademacher Complexity and Generalization Bounds', body: R`
:::idea In plain words
There is a way to measure how "rich" a class $\mathcal F$ is. Attach **fake labels from coin flips** $\xi_i=\pm1$ to the data, and see how well functions in the class can match those random labels (their correlation). A class that can follow any noise easily overfits the training data, and its gap between empirical and population risk is large. The expected value of this correlation is the **Rademacher complexity**.
:::

:::key Rademacher complexity
Independent identically distributed random variables $\xi_1,\dots,\xi_n$ with $\mathbb P(\xi_i=1)=\mathbb P(\xi_i=-1)=\frac12$ are called **Rademacher random variables**. For a function class $\mathcal F$ and a sample $z_1,\dots,z_n$,
$$\operatorname{Rad}_n(\mathcal F):=\E\Big[\sup_{f\in\mathcal F}\frac1n\sum_{i=1}^n\xi_if(z_i)\Big].$$
The expectation is over $\xi$ and (when the sample is random) over $z$. Fixing the sample $S$ and taking the expectation over $\xi$ only gives the empirical Rademacher complexity $\widehat{\operatorname{Rad}}_S(\mathcal F)$.
:::

**Two extremes.** For a single function ($\mathcal F=\{f\}$), $\E\sum_i\xi_if(z_i)=0$, so the complexity is 0. If the class can produce every sign pattern $\pm1$ on $n$ distinct points, then for any $\xi$ we can choose $f$ with $f(z_i)=\xi_i$ and get $\frac1n\sum_i\xi_i^2=1$, the largest possible value. Real classes lie in between, and the complexity usually shrinks as $n$ grows.

:::key Rademacher generalization bound
If the functions of $\mathcal F$ take values in $[0,1]$ and $z_1,\dots,z_n$ are i.i.d., then
$$\E\Big[\sup_{f\in\mathcal F}\Big(\E f(z)-\frac1n\sum_{i=1}^nf(z_i)\Big)\Big]\le2\operatorname{Rad}_n(\mathcal F),$$
and with probability at least $1-\delta$,
$$\sup_{f\in\mathcal F}\Big|\frac1n\sum_{i=1}^nf(z_i)-\E f(z)\Big|\le2\operatorname{Rad}_n(\mathcal F)+\sqrt{\frac{\log(2/\delta)}{2n}}.$$
:::

Putting the loss $z=(x,y)\mapsto\ell(y,f(x))$ in place of $f$ gives a bound on $\sup_f|R(f)-\hat R_n(f)|$ of 18.6.

:::hand Lecture notes (W9 Mon p. 9)
“Random variables $\xi_1,\dots,\xi_n$ are called Rademacher r.v. if they are i.i.d. and $\mathbb P(\xi_i=1)=\mathbb P(\xi_i=-1)=\frac12$. Define the Rademacher complexity of $\mathcal F$ by $\operatorname{Rad}_n(\mathcal F)=\E\big(\sup_{f\in\mathcal F}\frac1n\sum_{i=1}^n\xi_if(z_i)\big)$.”
For the network class $\mathcal F=\{f_\theta:f_\theta=\sum_j\beta_j\sigma(w_j^Tx)\}$,
$$\sup_{f\in\mathcal F}\Big|\frac1n\sum_{i=1}^nf(x_i)-\E[f]\Big|\le2\operatorname{Rad}(\mathcal F)+\frac1{\sqrt{2n}},\qquad\operatorname{Rad}(\mathcal F)\le\frac Q{\sqrt n}\ \ (\lVert f\rVert\le Q),$$
so the gap is $O\big(\frac1{\sqrt n}\big)$.
:::

:::warn What the board's 1/√(2n) is
The formula on the board abbreviates the precise theorem above. The second term is $\sqrt{\log(2/\delta)/(2n)}$, attached to "with probability at least $1-\delta$", with the log factor dropped, and it needs the assumption that the function values lie in $[0,1]$ (are bounded). It is the share of a concentration inequality (McDiarmid), which comes from the fact that changing one sample changes the $\sup$ by at most $\frac1n$; what matters is that both terms decay at the rate $\frac1{\sqrt n}$. Also, the $Q$ in "$Q/\sqrt n$ if $\lVert f\rVert\le Q$" means different things depending on which norm is used (below).
:::

**Symmetrization: why 2 Rad** (a proof not in the lecture notes). Consider a "ghost sample" $z_1',\dots,z_n'$ drawn separately from the same distribution. Since $\E f(z)=\E\frac1n\sum_if(z_i')$,
$$\E\sup_f\Big(\E f-\frac1n\sum_if(z_i)\Big)\le\E\sup_f\frac1n\sum_i\big(f(z_i')-f(z_i)\big).$$
Swapping $z_i$ and $z_i'$ leaves the distribution unchanged, so multiplying each difference $f(z_i')-f(z_i)$ by a sign $\xi_i$ leaves the expectation the same, and splitting the supremum in two gives
$$\le\E\sup_f\frac1n\sum_i\xi_if(z_i')+\E\sup_f\frac1n\sum_i(-\xi_i)f(z_i)=2\operatorname{Rad}_n(\mathcal F).$$
The first inequality pulls the expectation inside the $\sup$ outside ($\sup\E\le\E\sup$); the detailed proof is on the proof page.

:::key Norm-bounded linear class
If $\lVert x_i\rVert\le1$ ($i=1,\dots,n$) and $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$, then $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le\frac Q{\sqrt n}$.
:::

**Computation.** Computing the $\sup$ by Cauchy–Schwarz and using Jensen's inequality ($\E Z\le\sqrt{\E Z^2}$) and $\E\xi_i\xi_j=0$ ($i\ne j$),
$$\widehat{\operatorname{Rad}}_S(\mathcal F_Q)=\frac1n\E\sup_{\lVert w\rVert\le Q}\Big\langle w,\sum_i\xi_ix_i\Big\rangle=\frac Qn\E\Big\lVert\sum_i\xi_ix_i\Big\rVert\le\frac Qn\sqrt{\sum_i\lVert x_i\rVert^2}\le\frac Q{\sqrt n}.$$
It is the same computation as the vanishing cross terms in 18.3[[@base:ch05:5.2|The Cauchy–Schwarz and Jensen inequalities.]].

**The network class.** For a ReLU network with one hidden layer, $f(x)=\sum_j\beta_j\ReLU(w_j^Tx)$, with $\lVert x\rVert\le1$ and $\sum_j|\beta_j|\lVert w_j\rVert\le Q$, we have $\operatorname{Rad}_n\le\frac{2Q}{\sqrt n}$. The proof needs the contraction lemma (Ledoux–Talagrand), which says that composing with a Lipschitz function does not increase the complexity, so only the result is stated here. Constants and the definition of the norm differ between textbooks, so the board's "$Q/\sqrt n$ if $\lVert f\rVert\le Q$" should be read as a summary of results of this kind. The network of Barron's theorem has output weights adding up to at most $2C$, but its inner weights $\lambda a_i$ grow, so $Q$ measured in this norm can become large.

:::ex Example 6 — Rademacher complexity of two functions
Fix two points $z_1,z_2$ and let $\mathcal F=\{f_1,f_2\}$ with $(f_1(z_1),f_1(z_2))=(1,0)$ and $(f_2(z_1),f_2(z_2))=(0,1)$. What is $\widehat{\operatorname{Rad}}_S(\mathcal F)$?
---
$\sup_f\frac12\sum_i\xi_if(z_i)=\frac12\max(\xi_1,\xi_2)$. Of the four cases $(\xi_1,\xi_2)$, only $(-1,-1)$ gives maximum $-1$ and the other three give $1$, so $\E\max(\xi_1,\xi_2)=\frac{3-1}4=\frac12$. Hence $\widehat{\operatorname{Rad}}_S=\frac14$.
:::

**Approximation and generalization together.** Training a network with $N$ hidden neurons on $n$ data points, the approximation error is roughly $\frac{C^2}N$ and the generalization error roughly $\frac Q{\sqrt n}$. More neurons improve the approximation, but if $Q$ grows the generalization bound can get worse: this is the network version of the bias–variance trade-off[[ch02:2.8|The bias–variance decomposition.]]. It is also known, however, that real overparameterized networks do not show this simple trade-off as such, so these bounds are best seen as a starting point for understanding why networks work.

### Going deeper

McDiarmid's inequality: if a function $\Phi(z_1,\dots,z_n)$ of independent random variables changes by at most $c_i$ when one coordinate changes, then $\mathbb P(\Phi-\E\Phi\ge t)\le\exp\big(-2t^2/\sum_ic_i^2\big)$. $\Phi=\sup_f(\E f-\frac1n\sum_if(z_i))$ has $c_i=\frac1n$, so at $t=\sqrt{\log(2/\delta)/(2n)}$ the probability is $\frac\delta2$; applying the same argument to the other side $\sup_f(\frac1n\sum_if(z_i)-\E f)$ ($-\mathcal F$ has the same Rademacher complexity) and combining gives the second formula of the key box. It generalizes Hoeffding's inequality[[@ml:ch03:4.2|Concentration of measure: Hoeffding's inequality.]].
` },
    },
    probs: [
      { q: R`What is the Fourier transform convention of this unit (and the notes)?`,
        choices: [R`$\hat f(\xi)=\int_{\mathbb R^d}f(x)e^{-2\pi i\xi^Tx}dx$`, R`Only $\hat f(\xi)=\frac1{\sqrt{2\pi}}\int_{\mathbb R}f(x)e^{-i\xi x}dx$ is used`, R`$\hat f(\xi)=\int_{\mathbb R^d}f(x)e^{2\pi i\xi^Tx}dx$`, R`$\hat f(\xi)=\int_{\mathbb R^d}f(x)\cos(\xi^Tx)dx$`],
        sol: R`The convention with $2\pi$ in the exponent. Then the inverse transform $f(x)=\int\hat f(\xi)e^{2\pi i\xi^Tx}d\xi$ has no constant in front, and the transform of $\nabla f$ is $2\pi i\xi\hat f(\xi)$.` },
      { q: R`In $d=1$, with $f(x)=e^{-\pi x^2}$ and $\hat f(\xi)=e^{-\pi\xi^2}$, what is $\int_{-\infty}^\infty|2\pi\xi||\hat f(\xi)|\,d\xi$?`,
        sol: R`$2\int_0^\infty2\pi\xi e^{-\pi\xi^2}d\xi=2\big[-e^{-\pi\xi^2}\big]_0^\infty=2$. So $f\in\Gamma_C$ for $C>2$.` },
      { q: R`Which statement is always true for $f\in\Gamma_C$?`,
        choices: [R`$|f(x)-f(y)|\le C|x-y|$ for all $x,y$`, R`$f$ vanishes outside a bounded set`, R`$\hat f(\xi)=0$ for $|\xi|>C$`, R`$f$ also lies in $\Gamma_{C/2}$`],
        sol: R`From the inverse transform and $|e^{iu}-e^{iv}|\le|u-v|$, $|f(x)-f(y)|\le|x-y|\int|2\pi\xi||\hat f|d\xi\le C|x-y|$. Functions like the Gaussian, whose support is unbounded or which contain every frequency, can also lie in $\Gamma_C$.` },
      { q: R`Show that if $f\in\Gamma_C$, then $|f(x)-f(y)|\le C|x-y|$ for all $x,y\in\mathbb R^d$. You may use that the inverse transform holds at every point since $\hat f\in L^1$.`,
        sol: R`By the inverse transform, $f(x)-f(y)=\int\hat f(\xi)\big(e^{2\pi i\xi^Tx}-e^{2\pi i\xi^Ty}\big)d\xi$.
A chord between two points of the unit circle is no longer than the arc, so $|e^{iu}-e^{iv}|\le|u-v|$. Inserting $u=2\pi\xi^Tx$, $v=2\pi\xi^Ty$ and using Cauchy–Schwarz, $|\xi^T(x-y)|\le|\xi||x-y|$,
$$|f(x)-f(y)|\le\int|\hat f(\xi)|\,2\pi|\xi||x-y|\,d\xi=|x-y|\int|2\pi\xi||\hat f(\xi)|d\xi\le C|x-y|.$$`,
        rubric: R`- Write the difference as one integral with the inverse transform — 1 pt
- $|e^{iu}-e^{iv}|\le|u-v|$ — 1 pt
- Finish with Cauchy–Schwarz and the Barron condition — 1 pt` },
      { q: R`Over what is the infimum taken in $\lVert f\rVert_{B^s(\Omega)}=\inf\int(1+|\xi|)^s|\hat f_e(\xi)|d\xi$?`,
        choices: [R`All extensions $f_e$ to $\mathbb R^d$ that equal $f$ on $\Omega$`, R`All points $x$ in $\Omega$`, R`All frequencies $\xi$`, R`All orders $s$`],
        sol: R`A function defined only on $\Omega$ has no Fourier transform, so among the extensions with $f_e|_\Omega=f$ we use the one with the smallest weighted sum of amplitudes.` },
      { q: R`To approximate a Barron function with $C=1$ on the unit ball to mean squared error at most $0.01$, what is the smallest number of neurons $N$ guaranteed by Theorem 1?`,
        sol: R`$c>4C^2=4$ and $\frac cN\le0.01\iff N\ge100c$. Taking $c$ slightly above 4, $N=401$ works, while $N=400$ would require $c\le4$ and is not guaranteed.` },
      { q: R`Which is the best reason why the condition in Theorem 1 is $c>4C^2$ rather than $c\ge4C^2$?`,
        choices: [R`Lemma 1 deals with elements of a closure, and the step that replaces Heavisides by sigmoids also needs slack`, R`To prepare for large $d$`, R`Because $4C^2/N$ may not be an integer`, R`Because the sigmoid only takes values between 0 and 1`],
        sol: R`Maurey's lemma uses $c>B^2$ to absorb the distance $\varepsilon$ to the nearby point $f^*$ of $f\in\overline{\operatorname{co}}(G)$. In 18.5, $c'$ with $4C^2<c'<c$ gives the Heaviside version, and the remaining slack absorbs the error of switching to sigmoids.` },
      { q: R`How many cells does a grid cutting $[0,1]^{10}$ into cubes of side $0.1$ have?`,
        sol: R`10 cells per axis and 10 axes, so $10^{10}$ cells. Approximation by a constant on each cell needs that many parameters, but the number of neurons in Barron's theorem, $\approx4C^2/\varepsilon^2$, has no $d$.` },
      { q: R`What is the correct reading of "the approximation rate of Barron's theorem is independent of the dimension $d$"?`,
        choices: [R`$d$ does not appear directly in the bound $c/N$, but the Barron constant $C$ may grow with $d$`, R`The same network can be used in any dimension`, R`Gradient descent converges in a time independent of $d$`, R`The number of training data needed is independent of $d$`],
        sol: R`The theorem is an **existence** result about the approximation error, and $d$ can hide in the constant $C$ (for the Gaussian, $C\approx\sqrt{2\pi d}$). It says nothing about optimization or generalization.` },
      { q: R`With $H=\mathbb R^2$, $G=\{(1,0),(0,1)\}$, $f^*=(\frac12,\frac12)$, and $X_1,\dots,X_N$ drawn independently from $G$ with probability $\frac12$ each, what is $\E\lVert f^*-\frac1N\sum_jX_j\rVert^2$ for $N=10$?`,
        sol: R`$\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)=\frac1{10}(1-\frac12)=\frac1{20}$. Direct computation also gives $2\Var(K/N)=2\cdot\frac1{4N}=\frac1{20}$ ($K\sim\operatorname{Bin}(10,\frac12)$).` },
      { q: R`Prove Maurey's lemma: if every element of a subset $G$ of a Hilbert space $H$ has $\lVert g\rVert\le B$ and $f\in\overline{\operatorname{co}}(G)$, then for every $N$ and $c>B^2$ there are $g_1,\dots,g_N\in G$ with $\lVert f-\frac1N\sum_{i=1}^Ng_i\rVert^2\le\frac cN$.`,
        sol: R`**Nearby point.** For $\varepsilon>0$, take $f^*=\sum_{j=1}^m\alpha_jh_j$ ($h_j\in G$, $\alpha_j\ge0$, $\sum\alpha_j=1$) with $\lVert f-f^*\rVert<\varepsilon$.
**Random draws.** $X_1,\dots,X_N$ i.i.d. with $\mathbb P(X_i=h_j)=\alpha_j$. Then $\E X_i=f^*$.
**Variance computation.** $\E\lVert f^*-\frac1N\sum_jX_j\rVert^2=\frac1{N^2}\big[\sum_j\E\lVert f^*-X_j\rVert^2+\sum_{i\ne j}\E\langle f^*-X_i,f^*-X_j\rangle\big]$. By independence $\E\langle X_i,X_j\rangle=\lVert f^*\rVert^2$, and the cross term is $\lVert f^*\rVert^2-\lVert f^*\rVert^2-\lVert f^*\rVert^2+\lVert f^*\rVert^2=0$. What remains is $\frac1N\E\lVert f^*-X_1\rVert^2=\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)\le\frac{B^2}N$.
**Existence.** Since the expectation is at most $\frac{B^2}N$, some outcome $\omega$ has $\lVert f^*-\frac1N\sum_jX_j(\omega)\rVert^2\le\frac{B^2}N$. Take $g_i=X_i(\omega)\in G$.
**Triangle inequality.** $\lVert f-\frac1N\sum g_i\rVert\le\varepsilon+\frac B{\sqrt N}$. Since $c>B^2$, choosing $\varepsilon<\frac{\sqrt c-B}{\sqrt N}$ makes this $<\sqrt{c/N}$; squaring gives $\le\frac cN$.`,
        rubric: R`- Take a nearby point $f^*$ from the closure — 1 pt
- The distribution $\mathbb P(X_i=h_j)=\alpha_j$ and $\E X_i=f^*$ — 2 pts
- Expanding the squared norm and showing the cross terms vanish (independence) — 3 pts
- $\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)\le\frac{B^2}N$ — 2 pts
- The probabilistic method (existence) — 1 pt
- Triangle inequality and absorbing $\varepsilon$ with $c>B^2$ — 1 pt` },
      { q: R`In the proof of Maurey's lemma, why is $\E\langle f^*-X_i,f^*-X_j\rangle=0$ for $i\ne j$?`,
        choices: [R`Because $X_i,X_j$ are independent and both have mean $f^*$`, R`Because $h_1,\dots,h_m$ are mutually orthogonal`, R`Because $\lVert X_i\rVert\le B$`, R`Because $N$ is large enough`],
        sol: R`Independence gives $\E\langle X_i,X_j\rangle=\langle\E X_i,\E X_j\rangle=\lVert f^*\rVert^2$, and the four terms cancel as $\lVert f^*\rVert^2(1-1-1+1)=0$. Orthogonality of the $h_j$ is not needed.` },
      { q: R`Approximating an $f^*$ in the convex hull of elements of norm at most 3 by the average of 100 random samples, what bound $B^2/N$ on the expected squared error does the proof give?`,
        sol: R`$B^2/N=9/100=0.09$. The actual value is at most $\frac{9-\lVert f^*\rVert^2}{100}$.` },
      { q: R`What form do the elements of $G_C$ have?`,
        choices: [R`$x\mapsto\gamma\,\mathbf 1_{\mathbb R_+}(\langle a,x\rangle+b)$ with $|\gamma|\le2C$`, R`$x\mapsto\gamma\,\sigma(\langle a,x\rangle+b)$ with $|\gamma|\le C$`, R`$x\mapsto\cos(2\pi\langle\xi,x\rangle)$`, R`$x\mapsto\gamma\lVert x\rVert$ with $|\gamma|\le2C$`],
        sol: R`Heaviside ridge functions of height at most $2C$, that is, single neurons with a step activation. In the normalized norm, $\lVert g\rVert_{L^2_\circ}\le|\gamma|\le2C$.` },
      { q: R`Fix $\xi\ne0$ and $\kappa\in\mathbb R$, and let $\varphi(t)=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}$ ($t\in[-1,1]$).
1. Show that $\varphi(0)=0$ and $|\varphi'(t)|\le1$.
2. For $t_k=k/K$, show that $\sum_{k=1}^K\Delta_k^+\mathbf 1_{\mathbb R_+}(t-t_k)+\sum_{k=1}^K\Delta_k^-\mathbf 1_{\mathbb R_+}(-t-t_k)$ ($\Delta_k^\pm=\varphi(\pm t_k)-\varphi(\pm t_{k-1})$) is within $\frac1K$ of $\varphi$ on $[-1,1]$.
3. Show that this staircase is a convex combination of Heaviside functions whose heights are at most 2 in absolute value.`,
        sol: R`1. $\varphi(0)=\frac{\cos\kappa-\cos\kappa}{2\pi|\xi|}=0$, and $\varphi'(t)=-\sin(2\pi|\xi|t+\kappa)$, so $|\varphi'|\le1$.
2. If $t_k\le t<t_{k+1}$ ($t\ge0$), the first sum is $\sum_{j\le k}\Delta_j^+=\varphi(t_k)-\varphi(0)=\varphi(t_k)$, and the terms of the second sum vanish since $-t-t_j<0$. By the mean value theorem, $|\varphi(t)-\varphi(t_k)|\le|t-t_k|\le\frac1K$. The case $t<0$ is symmetric (for $t=0$ both sums are 0).
3. $V=\sum_k|\Delta_k^+|+\sum_k|\Delta_k^-|\le\int_{-1}^1|\varphi'|dt\le2$. The staircase is $\sum\frac{|\Delta|}V\big(V\operatorname{sign}(\Delta)\mathbf 1_{\mathbb R_+}(\cdots)\big)$, with weights $\frac{|\Delta|}V\ge0$ summing to 1 and each function of height $V\le2$. (If $V=0$ it is the zero function, i.e., $\gamma=0$.)`,
        rubric: R`- $\varphi(0)=0$ and $|\varphi'|\le1$ — 2 pts
- Value of the staircase by telescoping — 2 pts
- Error $\le1/K$ by 1-Lipschitz — 2 pts
- Total variation $\le2$ and rewriting as a convex combination — 4 pts` },
      { q: R`The notes define $\Lambda$ by the density $\frac1C|2\pi\xi||\hat f(\xi)|$ and call it a probability measure. What is the problem, and how is it fixed?`,
        choices: [R`If $\int|2\pi\xi||\hat f|<C$, the total mass is less than 1 — divide by $C_f=\int|2\pi\xi||\hat f|$ instead`, R`The density can be negative — take its absolute value`, R`The density has no value at $\xi=0$ — remove the origin`, R`There is no problem — by the definition of $\Gamma_C$ the mass is always exactly 1`],
        sol: R`$\Gamma_C$ is defined with a strict inequality, so the mass is $C_f/C<1$. Dividing by $C_f$ gives a probability measure, and thanks to the factor $C_f\le C$ the height bound $2C_f\le2C$ still holds.` },
      { q: R`Approximating $\varphi(t)=t$ ($t\in[-1,1]$) by the staircase of the text with $K=4$ steps on each side, what is the bound $\sup_t|\varphi(t)-\text{staircase}(t)|$?`,
        sol: R`Since $\varphi$ is 1-Lipschitz, the error is $|t-t_k|<\frac1K=\frac14$, and it comes arbitrarily close to $\frac14$ just before the next step, so the supremum is $\frac14$. The heights add up to $V=\int_{-1}^1|\varphi'|=2$, reaching the bound exactly.` },
      { q: R`$\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$ may fail at $t=0$. Why does the $L^2$ error of the network with sigmoids still tend to that of the Heaviside version?`,
        choices: [R`They disagree only on a hyperplane of volume 0, and $|\sigma-\mathbf 1_{\mathbb R_+}|\le1$ is bounded (dominated convergence)`, R`The sigmoid is exactly a step function`, R`The convergence is uniform on the whole ball`, R`Because $\lambda$ is taken small`],
        sol: R`Pointwise convergence holds outside a set of volume 0 and the difference is bounded, so dominated convergence gives $L^2$ convergence. Near the hyperplane it is not uniform.` },
      { q: R`For a Barron function with $C=\frac12$, what is the smallest number of neurons for which Theorem 1 guarantees mean squared error at most $0.001$?`,
        sol: R`$4C^2=1$, $c>1$, $N\ge1000c$. Taking $c$ slightly above 1 gives $N=1001$.` },
      { q: R`Correct the notes' formula $\int_{B_1^d}\big|f(x)-f(0)-\sum_{i=1}^Nr_i\mathbf 1_{\mathbb R_+}(\langle a_i,x\rangle+b_i)\big|^2\le\frac{4C_1^2}N$ ($|r_i|<2C_1$) so that it matches the conclusion of Lemma 1, and write the final network $\Phi_N$. What bounds the sum of the absolute output weights?`,
        sol: R`Lemma 1 gives the **average** of $g_i=\gamma_i\mathbf 1_{\mathbb R_+}(\langle a_i,\cdot\rangle+b_i)\in G_C$, so $r_i=\frac{\gamma_i}N$ with $|\gamma_i|\le2C$. The right side is $\frac cN$ for any $c>4C^2$, and the left side is the mean normalized by $\frac1{|B_1^d|}$:
$$\frac1{|B_1^d|}\int_{B_1^d}\Big|f(x)-f(0)-\frac1N\sum_{i=1}^N\gamma_i\mathbf 1_{\mathbb R_+}(\langle a_i,x\rangle+b_i)\Big|^2dx\le\frac cN.$$
Replacing the Heavisides by $\sigma(\lambda\,\cdot)$, $\Phi_N(x)=f(0)+\sum_i\frac{\gamma_i}N\sigma(\lambda\langle a_i,x\rangle+\lambda b_i)$. The absolute output weights add up to $\sum_i\frac{|\gamma_i|}N\le2C$.`,
        rubric: R`- Coefficients $r_i=\gamma_i/N$, $|\gamma_i|\le2C$ — 2 pts
- Right side $c/N$ ($c>4C^2$), left side as a normalized mean — 2 pts
- $\Phi_N$ and output weights adding to $\le2C$ — 2 pts` },
      { q: R`With squared loss and data $(0,1),(1,1),(2,5)$, what is the empirical risk $\hat R_3(f)$ of $f(x)=2x$?`,
        sol: R`Predictions $0,2,4$, errors $1,-1,1$, so $\frac{1+1+1}3=1$.` },
      { q: R`For $f_{\mathcal F}=\argmin_{\mathcal F}R$, $\hat f=\argmin_{\mathcal F}\hat R_n$, $\tilde f\in\mathcal F$, and $R^*=\inf_fR(f)$, prove
$$R(\tilde f)-R^*\le\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+2\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|+\big[R(f_{\mathcal F})-R^*\big],$$
and name the three terms and the units that handle them.`,
        sol: R`$R(\tilde f)-R^*=[R(\tilde f)-\hat R_n(\tilde f)]+[\hat R_n(\tilde f)-\hat R_n(\hat f)]+[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})]+[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})]+[R(f_{\mathcal F})-R^*]$ (an identity in which the middle terms cancel).
The first and fourth are each $\le\sup_f|R-\hat R_n|$, and the third is $\le0$ because $\hat f$ minimizes $\hat R_n$. Hence the inequality.
Names: optimization error (Units 13–14, gradient descent and SGD), generalization error (18.7, Rademacher), approximation error (Unit 17, 18.2–18.5).`,
        rubric: R`- The five-bracket identity — 2 pts
- First and fourth by the sup, third at most 0 — 2 pts
- Names of the three terms and the connections — 1 pt` },
      { q: R`For a fixed $f$, $\E\hat R_n(f)=R(f)$. Why does the ERM solution $\hat f$ tend to have $\hat R_n(\hat f)$ smaller than $R(\hat f)$?`,
        choices: [R`Because $\hat f$ was chosen to minimize $\hat R_n$ on that very data`, R`Because the loss can be negative`, R`Because $n$ is large`, R`Because $P$ is not a normal distribution`],
        sol: R`$\hat f$ depends on the data, so $\E\hat R_n(\hat f)=R(\hat f)$ fails. In fact it is biased the other way: $\E\hat R_n(\hat f)\le\E\hat R_n(f_{\mathcal F})=R(f_{\mathcal F})\le R(\hat f)$. That is why we control $\sup_f|R-\hat R_n|$.` },
      { q: R`What is the empirical Rademacher complexity of $\mathcal F=\{f_1,f_2\}$, where $f_1$ takes the values $(1,0)$ and $f_2$ the values $(0,1)$ at two points?`,
        sol: R`$\frac12\E\max(\xi_1,\xi_2)=\frac12\cdot\frac{1+1+1-1}4=\frac14$.` },
      { q: R`What are the Rademacher complexities of (a) a class $\{f\}$ with a single function and (b) a class producing every sign pattern $\pm1$ on $n$ distinct points?`,
        choices: [R`(a) 0, (b) 1`, R`(a) 1, (b) 0`, R`(a) $\frac12$, (b) 1`, R`(a) 0, (b) $\frac12$`],
        sol: R`(a) $\E\sum\xi_if(z_i)=0$. (b) For any $\xi$ choose $f(z_i)=\xi_i$, giving $\frac1n\sum\xi_i^2=1$.` },
      { q: R`Prove $\E\big[\sup_{f\in\mathcal F}\big(\E f(z)-\frac1n\sum_{i=1}^nf(z_i)\big)\big]\le2\operatorname{Rad}_n(\mathcal F)$ by symmetrization. Use a ghost sample $z_1',\dots,z_n'$.`,
        sol: R`**Ghost sample.** $\E f(z)=\E'\frac1n\sum_if(z_i')$, so $\sup_f(\E f-\hat\E_nf)=\sup_f\E'\big[\frac1n\sum_i(f(z_i')-f(z_i))\big]\le\E'\sup_f\frac1n\sum_i(f(z_i')-f(z_i))$ ($\sup\E\le\E\sup$). Take $\E$ on both sides.
**Inserting signs.** Swapping $z_i\leftrightarrow z_i'$ does not change the joint distribution, so $(f(z_i')-f(z_i))_i$ and $(\xi_i(f(z_i')-f(z_i)))_i$ have the same distribution (for any fixed $\xi$). Hence $\xi$ can be inserted into the expectation.
**Splitting.** $\sup_f\sum_i\xi_i(f(z_i')-f(z_i))\le\sup_f\sum_i\xi_if(z_i')+\sup_f\sum_i(-\xi_i)f(z_i)$. Since $-\xi$ is also Rademacher, both expectations equal $\operatorname{Rad}_n(\mathcal F)$. Together, $2\operatorname{Rad}_n(\mathcal F)$.`,
        rubric: R`- Write $\E f$ with a ghost sample and use $\sup\E\le\E\sup$ — 3 pts
- Insert signs $\xi_i$ by swap symmetry — 3 pts
- Split the sup and use the symmetry of $-\xi$ — 2 pts` },
      { q: R`Prove that $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le Q/\sqrt n$ when $\lVert x_i\rVert\le1$ and $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$.`,
        sol: R`$\sup_{\lVert w\rVert\le Q}\frac1n\sum_i\xi_i\langle w,x_i\rangle=\frac1n\sup_{\lVert w\rVert\le Q}\langle w,v\rangle$ with $v=\sum_i\xi_ix_i$. By Cauchy–Schwarz this equals $\frac Qn\lVert v\rVert$ (equality at $w=Qv/\lVert v\rVert$).
Jensen (the square root is concave): $\E\lVert v\rVert\le\sqrt{\E\lVert v\rVert^2}$. $\E\lVert v\rVert^2=\sum_{i,j}\E[\xi_i\xi_j]\langle x_i,x_j\rangle=\sum_i\lVert x_i\rVert^2\le n$ ($\E\xi_i\xi_j=0$, $i\ne j$).
Hence $\widehat{\operatorname{Rad}}_S\le\frac Qn\sqrt n=\frac Q{\sqrt n}$.`,
        rubric: R`- Compute the sup by Cauchy–Schwarz — 2 pts
- Jensen's inequality — 1 pt
- $\E\lVert v\rVert^2=\sum\lVert x_i\rVert^2$ by vanishing cross terms — 2 pts` },
      { q: R`From the board's $\operatorname{Rad}\le Q/\sqrt n$ with $Q=2$, what is the smallest $n$ that guarantees $\operatorname{Rad}\le0.05$?`,
        sol: R`$\frac2{\sqrt n}\le0.05\iff\sqrt n\ge40\iff n\ge1600$. Halving the error needs four times the data (the $1/\sqrt n$ rate).` },
    ],
  };
})();
