/* English text — 17 The Universal Approximation Theorem (W8 Wed notes, pp. 1–7, Oct. 21). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  EM.en.figText = Object.assign(EM.en.figText || {}, {
    '가설 클래스 F': 'hypothesis class F',
    '(예: 은닉층 하나, 뉴런 N개)': '(e.g., one hidden layer, N neurons)',
    '최적화': 'optimization',
    '일반화': 'generalization',
    '근사': 'approximation',
    '이상적 목표': 'ideal target',
    '알고리즘 출력 → 경험적 위험 최소화 → 클래스 안의 최선 → 목표': 'algorithm output → empirical risk minimizer → best in class → target',
    '근사·일반화·최적화 오차': 'Approximation, generalization, and optimization errors',
    '시그모이드 계단 근사': 'Staircase approximation with sigmoids',
    '조밀한 집합과 조밀하지 않은 집합': 'A dense set and a set that is not dense',
    '공간 X': 'space X',
    '조밀한 D: 어느 f의 둘레에도 D의 원소가 있다': 'Dense D: every f has points of D arbitrarily near',
    '조밀하지 않은 D′: 원판이 D′에 닿지 않는다': 'Not dense D′: the disc misses D′',
  });
  Object.assign(EM.en.fig, {
    dense: R`The left panel redraws the figure in the notes: the inside of the closed curve is the space $X$ and the dots are a subset $D$. $D$ is dense in $X$ if the disc of radius $\varepsilon$ around any $f$ (red circle), however small, contains a point of $D$. The line $D'$ on the right fails this: choose $\varepsilon$ smaller than the distance from $f$ to $D'$ and the disc holds no point of $D'$. A line is closed, so $\overline{D'}=D'\ne X$.`,
    errsplit: R`A redrawing of the figure on the first page of the notes. The box is every function our chosen architecture can build (the hypothesis class $\mathcal F$), and the function we really want, $f^*$ (the ideal target), usually lies outside the box. The distance from the function we actually get, $f_{\mathrm{alg}}$, to $f^*$ has three pieces: how far gradient descent falls short of the empirical risk minimizer $\hat f_n$ (optimization), how much worse $\hat f_n$, chosen from finite data, is than the best in the class $f_{\mathcal F}$ (generalization), and how far even the best in the class falls short of the target (approximation). This unit deals with the last arrow.`,
    stair: R`A continuous function $f$ (bold) is followed like a staircase through its values at the points $x_j=j/N$ that cut $[0,1]$ into $N$ cells: $G_N(x)=f(0)+\sum_{j=1}^N\big(f(x_j)-f(x_{j-1})\big)\sigma\big(\lambda(x-m_j)\big)$, where $m_j$ is the middle of a cell and $\sigma$ is a logistic function made steep (large $\lambda$). One hidden neuron makes one step, and increasing $N$ shrinks the maximum error. The universal approximation theorem guarantees that such an approximation is always possible in $n$ dimensions too, but this grid construction multiplies the cells across dimensions and needs about $N^n$ neurons (Unit 18).`,
  });
  EM.en.ch[17] = {
    title: 'The Universal Approximation Theorem',
    fig: R`Universal approximation: staircases built from $N=4,8,16$ steep sigmoids follow the bold curve (a continuous function) more and more closely`,
    tagline: R`With enough sigmoid neurons in a single hidden layer, a network can imitate any continuous function on $[0,1]^n$ as closely as we like. We learn the language of measures, norms, and density one step at a time, then borrow the Hahn–Banach theorem and the Riesz representation theorem to follow Cybenko’s (1989) proof by contradiction to the end.`,
    summary: R`We split the error between the network we actually get and the function we really want into three pieces — **approximation, generalization, and optimization** — and deal with the approximation error. The question is whether one-hidden-layer networks $G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)$ can come arbitrarily close to a continuous function. To say this precisely we define **measures** (signed measures, Borel sets), the **normed space** $C(I_n)$ with the max norm, and **density**. The key property is being **discriminatory**: the only measure whose integral against every neuron is 0 is the zero measure, and continuous sigmoids have this property (Lemma 1). The proof is by contradiction. If the set $U$ of networks is not dense, a corollary of Hahn–Banach (Lemma 3) gives a bounded linear functional that vanishes on $U$, and the **Riesz representation theorem** turns it into an integral against a nonzero measure $\mu$ (Lemma 4). But the integral of $\mu$ against every neuron is 0, so by discrimination $\mu=0$ — a contradiction (Lemma 5, **Cybenko’s theorem**). Finally we point out that the theorem says nothing about the number of neurons or learnability, and move on to Unit 18.`,
    goals: [
      R`Distinguish the ideal target, the best in the hypothesis class, the empirical risk minimizer, and the algorithm’s output, and state what the approximation, generalization, and optimization errors are`,
      R`Explain the two axioms of a measure, Borel sets, signed measures, and the meaning of $\mu=0$, and compute integrals against Dirac measures and measures with a density`,
      R`Show that $C(K)$ is a linear space and that the max norm $\lVert f\rVert_\infty$ is a norm, define density with $\varepsilon$, and restate it with the closure`,
      R`Define sigmoids and discriminatory functions, and write the statement of the universal approximation theorem precisely, meaning “within $\varepsilon$ at every $x$”`,
      R`Prove Lemma 4 with the Hahn–Banach corollary (Lemma 3) and the Riesz representation theorem`,
      R`Prove Lemma 5 and Cybenko’s theorem by contradiction, and explain what the theorem does not say (the number of neurons, how to find the weights, generalization)`,
    ],
    secTitles: { '17.1': 'Three errors', '17.2': 'Measures', '17.3': 'Norms and density', '17.4': 'Sigmoids, discrimination', '17.5': 'Hahn–Banach · Riesz', '17.6': 'Cybenko’s theorem' },
    secs: {
      '17.1': { title: 'Three Errors and the Approximation Problem', body: R`
:::idea In plain words
The distance between the network in our hands and the function we really want splits into three pieces. (1) Can the chosen **architecture imitate** that function in the first place (approximation)? (2) Does a function chosen from finite data **also work on data it has never seen** (generalization)? (3) Did gradient descent **actually find** that function (optimization)? So far we have mostly looked at (3); this unit and Unit 18 answer (1) and (2) with mathematics.
:::

The first page of the notes has one box and three arrows (figure below). The box is every function our chosen architecture can build, the **hypothesis class** $\mathcal F$ (e.g., all networks with one hidden layer of $N$ neurons). The “Ideal target” outside the box is the function $f^*$ we really want to hit, and the notes draw a pulse-shaped function next to it. The three arrows are named opt, gen, and app.

:::fig errsplit
:::

When data come from a distribution $P$ and the loss is $\ell$, the **risk** (population risk) and the **empirical risk** of a function $f$ are
$$\mathcal R(f)=\E_{(X,Y)\sim P}\big[\ell(Y,f(X))\big],\qquad\widehat{\mathcal R}_n(f)=\frac1n\sum_{i=1}^n\ell(y_i,f(x_i))$$
(more in Section 18.6[[ch18:18.6|Population and empirical risk are treated in detail in Section 18.6.]]). We distinguish four functions: $f^*$, with the smallest risk among all functions; $f_{\mathcal F}=\argmin_{f\in\mathcal F}\mathcal R(f)$, with the smallest risk in the class; the empirical risk minimizer $\hat f_n=\argmin_{f\in\mathcal F}\widehat{\mathcal R}_n(f)$, which we can choose from the data; and $f_{\mathrm{alg}}\in\mathcal F$, which the algorithm (e.g., SGD) actually returns.

:::key Error decomposition
$$\begin{aligned}\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)=\ &\underbrace{\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)}_{\text{optimization error}}+\underbrace{\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})}_{\text{generalization error}}\\&+\underbrace{\mathcal R(f_{\mathcal F})-\mathcal R(f^*)}_{\text{approximation error}}\end{aligned}$$
The approximation and generalization errors are at least $0$ (because $f_{\mathcal F}$ and $f^*$ are minimal over their ranges).
:::

The three terms are different questions, and the units of this course take them one by one.

| Error | Question | Where |
|---|---|---|
| Approximation | Can the architecture imitate the target? | This unit (it can), Sections 18.1–18.5 (how fast) |
| Generalization | Is the best for finite data also good on the population? | Sections 18.6–18.7 (Rademacher complexity) |
| Optimization | Did the algorithm reach the empirical risk minimizer? | Units 13–14 (descent lemma, SGD, Adam) |

In the machine learning field the same decomposition appears as approximation and estimation errors[[@ml:ch04:5.2|Error decomposition: approximation error and estimation error.]]. Enlarging the class (adding neurons) can only shrink the approximation error, but since we must choose among more functions with the same data, the generalization error can grow. It is the same tug of war as the bias–variance decomposition[[ch02:2.8|The MAP of a Gaussian mean and the bias–variance decomposition.]].

:::ex Example 1 — Computing the three errors
In some problem $\mathcal R(f^*)=0.05$, $\mathcal R(f_{\mathcal F})=0.08$, $\mathcal R(\hat f_n)=0.12$, and $\mathcal R(f_{\mathrm{alg}})=0.15$. What are the three errors and the total excess risk?
---
Approximation $0.08-0.05=0.03$, generalization $0.12-0.08=0.04$, optimization $0.15-0.12=0.03$. The sum is $0.10=\mathcal R(f_{\mathrm{alg}})-\mathcal R(f^*)$. Here the largest share is the generalization error, so more data or regularization should come before more neurons.
:::

### Going deeper

The optimization error $\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)$ **can be negative**. $\hat f_n$ only minimizes the empirical risk, not the population risk, so a less optimized $f_{\mathrm{alg}}$ may by chance (or thanks to implicit regularization such as early stopping) be better on the population. The approximation and generalization errors, on the other hand, are at least $0$ by definition.
` },
      '17.2': { title: 'Measures, Borel Sets, and Signed Measures', body: R`
:::idea In plain words
A **measure** is a ruler for the size of sets. Length, area, volume, and probability are all measures. A **signed measure** allows negative sizes too; like a charge distribution that mixes positive and negative charges, it is the difference of two measures. There is one reason this unit needs measures: to write a linear rule that assigns numbers to continuous functions as “an integral against some measure” (Section 17.5).
:::

:::hand Class notes — Definition of a measure
A nonnegative measure satisfies
$$\mu(\varnothing)=0,\qquad\mu\Big(\bigcup_{j=1}^\infty A_j\Big)=\sum_{j=1}^\infty\mu(A_j)\quad(\text{when the }A_j\text{ are pairwise disjoint}).$$
The **Borel sets** of $K$ form the smallest collection that contains all open subsets of $K$ and is closed under complements in $K$ and countable unions. A signed measure is a measure with a sign. $\mu=0$ means $\mu(A)=0$ for every set $A$.
:::

:::key Measures and signed measures
A **measure** $\mu$: assigns to each Borel set a value in $[0,\infty]$, with $\mu(\varnothing)=0$ and $\mu\big(\bigcup_jA_j\big)=\sum_j\mu(A_j)$ for disjoint $A_1,A_2,\dots$ (countable additivity).
A **finite signed measure**: real values (negatives allowed) satisfying the same two axioms. It can always be written as the difference of two finite measures, $\mu=\mu^+-\mu^-$.
$$\mu=0\iff\mu(A)=0\ \ (\text{every Borel set }A),\qquad\int f\,d\mu=\int f\,d\mu^+-\int f\,d\mu^-.$$
:::

The **Borel sets** are the sets obtained by starting from open sets and repeating complements and countable unions as often as we like. Closed sets (complements of open sets), single points, intervals, half-spaces, and hyperplanes are all among them. Sizes are given only to Borel sets rather than “all subsets” because it is impossible to give every subset a length while keeping countable additivity. Every set met in engineering may be taken to be a Borel set.

Three examples are enough to remember.
- **Lebesgue measure** (length): on $[0,1]$, $\lambda([a,b])=b-a$, and $\int f\,d\lambda=\int_0^1f(x)\,dx$ (the ordinary integral).
- **Dirac measure** $\delta_p$: $\delta_p(A)=1$ if $p\in A$, and $0$ otherwise. The integral is a single function value, $\int f\,d\delta_p=f(p)$.
- **Measure with a density**: $\mu(A)=\int_Ag(x)\,dx$. If $g$ may be negative it is a signed measure, and $\int f\,d\mu=\int f(x)g(x)\,dx$.

Throughout this unit $I_n=[0,1]^n$ (the unit cube), and $M(I_n)$ is the set of finite signed (regular) Borel measures on $I_n$. For example, $\delta_{0.2}-\delta_{0.7}$ is an element of $M(I_1)$, and $\int f\,d(\delta_{0.2}-\delta_{0.7})=f(0.2)-f(0.7)$.

:::ex Example 2 — Integrating against a signed measure
For $\mu=2\delta_0-\delta_{1/2}+\lambda$ on $[0,1]$ ($\lambda$ is length), find the integral $\int f\,d\mu$ of $f(x)=x^2$ and $\mu([0,1])$.
---
$\int f\,d\mu=2f(0)-f(\tfrac12)+\int_0^1x^2dx=0-\tfrac14+\tfrac13=\tfrac1{12}$, and $\mu([0,1])=2-1+1=2$. For $f(x)=x^3$ it is $0-\tfrac18+\tfrac14=\tfrac18$ instead. The integral differs from function to function, and one of them being $0$ does not make $\mu=0$.
:::

:::warn “The integral is 0” is not “the measure is 0”
$\mu=0$ is the strong condition that $\mu(A)=0$ on **every** Borel set. For example, $\mu=\delta_{0.2}-\delta_{0.7}$ has $\mu([0,1])=0$, and many continuous functions have $\int f\,d\mu=0$ (it suffices that $f(0.2)=f(0.7)$), yet $\mu(\{0.2\})=1$, so $\mu\ne0$. Conversely, if $\int f\,d\mu=0$ for **every** continuous function $f$, then $\mu=0$ (the uniqueness in the Riesz representation theorem, Section 17.5). The definition of a discriminatory function (Section 17.4) sits somewhere in between: it is the property that draws $\mu=0$ out of “the integral against every neuron is 0.”
:::

### Going deeper

“Regular” is a technical condition saying the measure is approximated from inside and outside by open and closed (compact) sets. Finite Borel measures on a compact metric space like $I_n$ are automatically regular, so this unit need not worry about it. Among the ways of writing a signed measure as $\mu^+-\mu^-$, the standard one without overlap is called the Jordan decomposition, and $\lvert\mu\rvert=\mu^++\mu^-$ is called the total variation. We have $\big\lvert\int f\,d\mu\big\rvert\le\lVert f\rVert_\infty\lvert\mu\rvert(I_n)$.
` },
      '17.3': { title: 'Linear Spaces, Norms, and Density', body: R`
:::idea In plain words
Functions can be added and scaled by real numbers just like vectors. If we measure the distance between two functions as “the difference where they are farthest apart,” we can write “the network approximates the function” as a precise inequality. A set being **dense** means it contains an element as close as we like to any target — like the rationals being dense in the reals.
:::

:::hand Class notes — Linear spaces, normed spaces, density
- A real linear space (vector space) is a set whose elements can be added and multiplied by real numbers, obeying the usual vector space rules. Example: $C(K)=\{f:K\to\mathbb R\ :\ f\text{ is continuous}\}$. If $f,g\in C(K)$ and $a,b\in\mathbb R$, then $af+bg\in C(K)$ and $(af+bg)(x)=af(x)+bg(x)$.
- A normed linear space is a linear space $X$ equipped with a function $\lVert\cdot\rVert:X\to[0,\infty)$ such that $\lVert u\rVert=0\iff u=0$, $\lVert cu\rVert=\lvert c\rvert\lVert u\rVert$, and $\lVert u+v\rVert\le\lVert u\rVert+\lVert v\rVert$.
- Dense: a subset $D\subseteq X$ is dense in $X$ if for all $f\in X$ and all $\varepsilon>0$ there is $g\in D$ with $\lVert f-g\rVert<\varepsilon$.
:::

:::key Max norm and density
If $K$ is compact, the **max norm** on $C(K)$ is $\lVert f\rVert_\infty=\max_{x\in K}\lvert f(x)\rvert$ (a continuous function attains its maximum on a compact set).
$$D\text{ is dense in }X\iff\forall f\in X,\ \forall\varepsilon>0,\ \exists g\in D:\ \lVert f-g\rVert<\varepsilon\iff\overline D=X.$$
In $C(K)$, $\lVert f-g\rVert_\infty<\varepsilon$ is the same as $\lvert f(x)-g(x)\rvert<\varepsilon$ ($\forall x\in K$).
:::

Let us check that the max norm satisfies the three conditions of a norm. If $\lVert f\rVert_\infty=0$, then $f(x)=0$ at every point. $\lVert cf\rVert_\infty=\max\lvert c\rvert\lvert f(x)\rvert=\lvert c\rvert\lVert f\rVert_\infty$. The triangle inequality holds pointwise, $\lvert f(x)+g(x)\rvert\le\lvert f(x)\rvert+\lvert g(x)\rvert\le\lVert f\rVert_\infty+\lVert g\rVert_\infty$, and then we take the maximum of the left side[[@em:ch17:3.1c|Norms and normed spaces.]].

The **closure** $\overline D$ is every point reachable as the limit of a sequence of elements of $D$. The $\varepsilon$ condition in the definition is the same as “there is a sequence in $D$ converging to $f$,” so being dense is the same as $\overline D=X$. The figure in the notes shows a closed curve (the space $X$) traced without gaps by a red dotted line (a dense $D$), with an element of $D$ as close as we like to the blue point (any element). Also, if $U$ is a linear subspace, so is $\overline U$ (proof page).

:::fig dense
:::

Convergence in the max norm is the same as **uniform convergence**[[@base:ch05:5.3|Uniform convergence.]]. So “dense in $C(I_n)$” is approximation in the strongest sense: the error $\varepsilon$ is kept **at every point of the domain at once**. A well-known example is the Weierstrass theorem (polynomials are dense in $C([a,b])$), and approximating periodic functions by trigonometric polynomials is of the same kind[[@em:ch10:11.4|Approximation by trigonometric polynomials.]]. The universal approximation theorem is this theorem with neural networks in place of polynomials.

:::ex Example 3 — Computing a max norm
On $[0,1]$, find the distance $\lVert f-g\rVert_\infty$ between $f(x)=x$ and $g(x)=x^2$.
---
$h(x)=x-x^2\ge0$, and $h'(x)=1-2x=0$ gives $x=\tfrac12$. $h(\tfrac12)=\tfrac14$ and $h=0$ at both ends, so $\lVert f-g\rVert_\infty=\tfrac14$.
:::

:::warn A different norm means a different “close”
$g_k(x)=x^k$ on $[0,1]$ approaches $0$ in the square-integral norm, $\lVert g_k\rVert_2=\big(\int_0^1x^{2k}dx\big)^{1/2}=\frac1{\sqrt{2k+1}}\to0$, but not at all in the max norm, $\lVert g_k\rVert_\infty=g_k(1)=1$. The universal approximation theorem is about max-norm (uniform) approximation, while Barron’s theorem in Unit 18 is about square-integral approximation. Always check which norm is meant.
:::

### Going deeper

**Dense** and **proper subspace** do not exclude each other. The polynomials form a proper subspace of $C([0,1])$ ($e^x$ is not a polynomial) and yet are dense. That is why Lemma 3 in Section 17.5 assumes not “$U\ne X$” but “$U$ is not dense ($\overline U\ne X$).”
` },
      '17.4': { title: 'Sigmoids and Discriminatory Functions', body: R`
:::idea In plain words
What we want to show is that the set of one-hidden-layer networks $G(x)=\sum_j\alpha_j\sigma(w_j^Tx+\theta_j)$ is dense in $C(I_n)$. The key is being **discriminatory**: if we view each neuron $\sigma(w^Tx+\theta)$ as a probe that measures a measure, a nonzero measure is always caught by some probe. The only measure that looks like 0 to every probe is 0.
:::

:::hand Class notes — The goal and two definitions
**Goal: how do we show the UAT?**
Theorem. Let $\sigma$ be an arbitrary continuous sigmoid function. Then the finite sums of the form
$$G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j),\qquad w_j\in\mathbb R^n,\ \alpha_j,\theta_j\in\mathbb R$$
are dense in $C(I_n)$.

Definition. A function $\sigma:\mathbb R\to[0,1]$ is called a **sigmoid** if $\sigma\in C^1(\mathbb R)$, $\lim_{x\to-\infty}\sigma(x)=0$, and $\lim_{x\to\infty}\sigma(x)=1$.

Definition. Let $\mu\in M(I_n)$ (a signed Borel measure). A function $\sigma$ is called **discriminatory** for the measure $\mu$ if the following holds.
$$\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0\quad\forall w\in\mathbb R^n,\ \forall\theta\in\mathbb R\ \Longrightarrow\ \mu=0.$$

Lemma 1. Any continuous sigmoid function is discriminatory for all $\mu\in M(I_n)$. (Proof skipped in class.)
:::

:::key Sigmoids and discriminatory functions
**Sigmoid**: $\sigma:\mathbb R\to\mathbb R$, $\displaystyle\lim_{t\to-\infty}\sigma(t)=0$, $\displaystyle\lim_{t\to\infty}\sigma(t)=1$.
**Discriminatory function**: for every $\mu\in M(I_n)$,
$$\int_{I_n}\sigma(w^Tx+\theta)\,d\mu(x)=0\ \ (\forall w\in\mathbb R^n,\ \forall\theta\in\mathbb R)\ \Longrightarrow\ \mu=0.$$
**Lemma 1**: a continuous sigmoid is a discriminatory function.
:::

:::warn The notes’ definition of a sigmoid is stronger than needed
The notes require $\sigma\in C^1$ and values in $[0,1]$, but Cybenko’s theorem only needs $\sigma$ to be **continuous** with limits $0$ and $1$ at the two ends (continuity is needed so that $G$ lies in $C(I_n)$). Lemma 1 itself holds even for bounded measurable sigmoids (e.g., the step function $H$). The logistic function $s(t)=\frac1{1+e^{-t}}$ satisfies both definitions[[ch05:5.1|Odds, logits, and the sigmoid.]]. $\tanh$ does not fit the definition because its limits are $\pm1$, but $\tanh t=2s(2t)-1$, and a constant can be made by a neuron $s(\theta)$ with $w=0$, so $\tanh$ networks build the same set of functions as logistic networks.
:::

**The picture behind discrimination.** Making a neuron steep ($\sigma(\lambda(w^Tx+\theta))$, $\lambda\to\infty$) turns it into a step that is $1$ on the half-space $\{w^Tx+\theta>0\}$ and $0$ on the other side. So being discriminatory roughly says “the only measure that gives size $0$ to every half-space is $0$.” It is an idea similar to CT scanning, which reconstructs an object from slices in every direction. The proof of Lemma 1 (proof page, not in the lecture notes) obtains half-spaces through this limit and shows that vanishing on half-spaces makes the Fourier transform of the measure $0$, so the measure is $0$[[@em:ch10:11.9|The Fourier transform.]].

:::ex Example 4 — A two-point measure is caught
For $n=1$ and $\mu=\delta_a-\delta_b$ ($a\ne b$, $a,b\in[0,1]$), find $w,\theta$ with $\int s(wx+\theta)\,d\mu\ne0$ for the logistic function $s$.
---
$\int s(wx+\theta)\,d\mu=s(wa+\theta)-s(wb+\theta)$. With $w=1$ and $\theta=0$ this is $s(a)-s(b)$, which is nonzero for $a\ne b$ because $s$ is strictly increasing. So this $\mu$ does not satisfy “the integral against every neuron is 0,” and $\mu\ne0$ is consistent with the definition of discrimination.
:::

An example of a function that is **not** discriminatory makes the definition clear too. Neurons built from the identity $\sigma(t)=t$ (not a sigmoid) are just affine functions $wx+\theta$. For $n=1$ take $\mu=\delta_0-2\delta_{1/2}+\delta_1$; then
$$\int(wx+\theta)\,d\mu=\theta-2\Big(\frac w2+\theta\Big)+(w+\theta)=0\qquad(\forall w,\theta)$$
but $\mu\ne0$. Indeed sums of affine functions are affine and cannot approximate $x^2$, and this $\mu$ is exactly the measure that detects that “missing direction” ($\int x^2d\mu=0-\frac12+1=\frac12\ne0$).

### Going deeper

Activation functions that are not sigmoids also approximate universally. Leshno, Lin, Pinkus, and Schocken (1993) showed for continuous activations that “one-hidden-layer networks are dense $\iff$ $\sigma$ is not a polynomial,” so ReLU networks are universal approximators too[[ch10:10.4|Activation functions revisited.]]. Polynomial activations fail for the same reason as the identity example above: networks built from a polynomial $\sigma$ of degree $k$ only produce polynomials of degree at most $k$.
` },
      '17.5': { title: 'The Hahn–Banach Corollary and the Riesz Representation Theorem', body: R`
:::idea In plain words
If there is a subspace $U$ that is not dense, we can build a “measuring device” (a bounded linear functional) that returns $0$ on every element of $U$ but is not $0$ on the whole space (Hahn–Banach). And every such device on $C(K)$, without exception, is an integral against some measure (Riesz). Putting the two together: if $U$ is not dense, there is a nonzero measure whose integral against every function in $U$ is $0$ (Lemma 4).
:::

A **linear functional** is a linear map $L:X\to\mathbb R$ that assigns real numbers to the elements of the space, and it is **bounded** if there is a constant $C$ with $\lvert L(f)\rvert\le C\lVert f\rVert$ (bounded $\iff$ continuous). Examples on $C([0,1])$: the value at a point $f\mapsto f(0.3)$ ($\lvert f(0.3)\rvert\le\lVert f\rVert_\infty$), the integral $f\mapsto\int_0^1f(x)\,dx$, and the difference at two points $f\mapsto f(0)-f(1)$. Notice that all of them can be written as integrals against measures, $\int f\,d\delta_{0.3}$, $\int f\,d\lambda$, and $\int f\,d(\delta_0-\delta_1)$.

:::hand Class notes — Lemmas 3 and 4
**Lemma 3.** Let $U$ be a linear, non-dense subspace of a normed linear space $X$. Then there exists a bounded linear functional $L$ on $X$ such that $L\ne0$ on $X$ and $L|_U=0$. (Proof skipped.)

**Lemma 4.** Let $U$ be a linear, non-dense subspace of $C(I_n)$. Then there exists a measure $\mu\in M(I_n)$ such that $\int_{I_n}h\,d\mu=0$ ($\forall h\in U$).

(Proof) Taking $X=C(I_n)$ in Lemma 3, there is a bounded linear functional $L:C(I_n)\to\mathbb R$ such that $L\ne0$ on $C(I_n)$ and $L|_U=0$.
:::

:::key Riesz representation theorem (RRT)
If $K\subset\mathbb R^n$ is compact and $F$ is a bounded linear functional on $C(K)$, there is a **unique** finite signed measure $\mu$ on $K$ such that
$$F(f)=\int_Kf(x)\,d\mu(x)\qquad\forall f\in C(K).$$
If $F$ is positive ($f\ge0\Rightarrow F(f)\ge0$), then $\mu$ is a nonnegative measure.
:::

:::hand Class notes — Finishing Lemma 4 with the Riesz representation theorem
**Fact (R.R.T.)** $K$: a compact set in $\mathbb R^n$; $C(K)$: the continuous functions on $K$. Theorem: if $F$ is a bounded linear functional on $C(K)$, there is a unique finite signed measure $\mu$ on $K$ with $F(f)=\int_Kf(x)\,d\mu(x)$ for all $f\in C(K)$. That is, if $L$ is a positive linear functional on $C(K)$, there is $\mu$ on $K$ with $L(f)=\int_Kf(x)\,d\mu(x)$.

Applying the R.R.T. for bounded linear functionals on $C(I_n)$, there is $\mu\in M(I_n)$ with $L(f)=\int_{I_n}f\,d\mu$ for all $f\in C(I_n)$. In particular, for any $h\in U$ we obtain $L(h)=\int_{I_n}h\,d\mu=0$, which completes the lemma.
:::

:::key Lemmas 3 and 4
**Lemma 3** (Hahn–Banach corollary): if a linear subspace $U$ of a normed space $X$ is not dense ($\overline U\ne X$), there is a bounded linear functional $L$ with $L\ne0$ and $L|_U=0$.
**Lemma 4**: if $U$ is a non-dense linear subspace of $C(I_n)$, there is $\mu\in M(I_n)$ with $\mu\ne0$ such that
$$\int_{I_n}h\,d\mu=0\qquad\forall h\in U.$$
:::

Strung into one line, the proof of Lemma 4 goes as follows. Writing the $L$ of Lemma 3 as $L(f)=\int f\,d\mu$ by the Riesz representation theorem, for $h\in U$ we get $\int h\,d\mu=L(h)=0$; and since $L\ne0$ there is $f_0$ with $L(f_0)\ne0$, so $\int f_0\,d\mu\ne0$, that is, $\mu\ne0$.

:::warn Two places to read differently in the notes
(1) The statement of Lemma 4 is missing **$\mu\ne0$**. $\mu=0$ always satisfies $\int h\,d\mu=0$, so without this condition the lemma says nothing. That is exactly why the notes circle $L\ne0$ in the proof: to get $\mu\ne0$. (2) “$L(f)=\int_{I_n}h\,d\mu=0$” in the last line should be $L(h)$.
:::

**Why Lemma 3 is true** (in detail on the proof page). Pick a point $f_0$ outside $\overline U$; since $\overline U$ is closed, the distance $d=\inf_{u\in\overline U}\lVert f_0-u\rVert$ is positive. The functional that gives $td$ to $u+tf_0$ ($u\in\overline U$) is $0$ on $\overline U$, equals $d\ne0$ at $f_0$, and is bounded since $\lvert td\rvert\le\lVert u+tf_0\rVert$. The **Hahn–Banach theorem** extends it to all of $X$ while keeping the norm bound. This is impossible when $U$ is dense: if a bounded $L$ is $0$ on $U$, continuity makes it $0$ on all of $\overline U=X$.

:::ex Example 5 — Finding a measure that annihilates a subspace
Show that the subspace $U=\{f:\ f(0)=f(1)\}$ of $X=C([0,1])$ is not dense, and find a $\mu$ for Lemma 4.
---
$L(f)=f(0)-f(1)$ is a bounded linear functional with $\lvert L(f)\rvert\le2\lVert f\rVert_\infty$; it is $0$ on $U$ and $-1\ne0$ at $f(x)=x$. Every element $g$ of $U$ has $\lvert(f-g)(0)-(f-g)(1)\rvert=1$, so $\lVert f-g\rVert_\infty\ge\frac12$ — nothing in $U$ comes closer than $\frac12$ to $f(x)=x$, so $U$ is not dense. With $\mu=\delta_0-\delta_1$ we have $\int h\,d\mu=h(0)-h(1)=0$ ($h\in U$) and $\mu\ne0$. It matters that this $\mu$ is a **signed** measure. Nonnegative measures alone cannot catch every such subspace.
:::
` },
      '17.6': { title: 'Proof of Cybenko’s Theorem', body: R`
:::idea In plain words
It is a proof by contradiction. If we assume the set $U$ of networks is not dense, Lemma 4 gives a nonzero measure $\mu$ that is “invisible” to every function in $U$. But a network with a single neuron $\sigma(w^Tx+\theta)$ is also in $U$, so $\mu$ is invisible to every neuron, and discrimination forces $\mu=0$. This is a contradiction, so $U$ is dense.
:::

:::hand Class notes — Lemma 5 and Cybenko’s theorem
**Lemma 5.** Let $\sigma$ be any continuous discriminatory function. Then the finite sums of the form
$$G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j),\qquad w_j\in\mathbb R^n,\ \alpha_j,\theta_j\in\mathbb R$$
are dense in $C(I_n)$.

(Proof) Since $\sigma$ is continuous, it follows that $U=\big\{G:\ G(x)=\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)\big\}$ is a linear subspace of $C(I_n)$. We continue the proof by contradiction. Assume that $U$ is not dense in $C(I_n)$. By Lemma 4 there is a measure $\mu\in M(I_n)$ with $\int_{I_n}h\,d\mu=0$ for all $h\in U$.
$$\Rightarrow\ \sum_{j=1}^N\alpha_j\int_{I_n}\sigma(w_j^Tx+\theta_j)\,d\mu=0\quad\forall w_j\in\mathbb R^n,\ \alpha_j,\theta_j\in\mathbb R$$
$$\Rightarrow\ \int_{I_n}\sigma(w^Tx+\theta)\,d\mu=0\quad\forall w\in\mathbb R^n,\ \theta\in\mathbb R.$$
Using that $\sigma$ is discriminatory, we have $\mu=0$. Contradiction. ↯

**Theorem (Cybenko, 1989).** Let $\sigma$ be an arbitrary continuous sigmoid. The sums $G(x)=\sum\alpha_j\sigma(w_j^Tx+\theta_j)$ are dense in $C(I_n)$. (UAT)
:::

:::key Universal approximation theorem (Cybenko 1989)
If $\sigma$ is a continuous sigmoid, then for every $f\in C(I_n)$ and $\varepsilon>0$ there are $N\in\mathbb N$, $w_j\in\mathbb R^n$, and $\alpha_j,\theta_j\in\mathbb R$ such that
$$\Big\lvert f(x)-\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)\Big\rvert<\varepsilon\qquad\forall x\in I_n.$$
(Lemma 1 + Lemma 5)
:::

Let us check each step of the proof.
- **Why $U$ is a linear subspace.** Adding two finite sums gives a finite sum with the neurons concatenated, and scaling only changes the $\alpha_j$. With $\alpha=0$ we get the zero function. And since $\sigma$ is continuous, each $G$ is continuous, so $U\subseteq C(I_n)$. **This is where the continuity of $\sigma$ is used.**
- **From the second line to the third.** The first equation holds for every $N$ and every choice of coefficients, so setting $N=1$ and $\alpha_1=1$ gives the equation for a single neuron $\sigma(w^Tx+\theta)$.
- **The contradiction.** What Lemma 4 provides is a measure with $\mu\ne0$ (the correction in Section 17.5), so it collides head-on with $\mu=0$.

:::warn What is negated: not $U\ne C(I_n)$ but $\overline U\ne C(I_n)$
The negation of “$U$ is dense” is “the **closure** $\overline U$ is not all of $C(I_n)$.” The set $U$ of finite sums is usually not all of $C(I_n)$ anyway, so assuming “$U\ne C(I_n)$” yields nothing (just as the polynomials are dense but not everything). The Hahn–Banach construction in Lemma 3 also uses the positive distance to a point $f_0$ outside $\overline U$. The proof in the notes applies Lemma 4 directly to the assumption “not dense,” so it is correct, and the closure is used inside Lemma 3.
:::

**Building one by hand in one dimension.** The theorem only asserts existence, but for $n=1$ we can build the network by hand. With the points $x_j=\frac jN$ that cut $[0,1]$ into $N$ cells and the cell midpoints $m_j$, set
$$G_N(x)=f(0)+\sum_{j=1}^N\big(f(x_j)-f(x_{j-1})\big)\,\sigma\big(\lambda(x-m_j)\big);$$
for large $\lambda$ each neuron becomes one step, and $G_N$ follows $f$ like a staircase (figure below). Since $f$ is uniformly continuous, the maximum error goes to $0$ as $N$ grows.

:::fig stair
:::

:::ex Example 6 — Neurons needed for a staircase approximation
Approximate $f(x)=x$ by the staircase above with $\sigma$ the step function $H$ (the limit $\lambda\to\infty$). Express the maximum error in terms of $N$, and find the smallest $N$ that makes the error at most $0.01$.
---
On $x\in[m_j,m_{j+1})$ we have $G_N(x)=x_j=\frac jN$, and the bound on $\lvert x-\frac jN\rvert$ on this interval is $\frac1{2N}$, reached at the ends $m_j=x_j-\frac1{2N}$ and $m_{j+1}=x_j+\frac1{2N}$ (the end intervals are the same). So the maximum error is $\frac1{2N}$, and $\frac1{2N}\le0.01\iff N\ge50$. Using the same grid construction on the $n$-dimensional cube gives $N^n$ cells and as many neurons — $50^{10}$ for $n=10$.
:::

### Going deeper

Let us be clear about what the theorem **does not say**.
- **How many neurons are needed.** It guarantees only existence and gives no information about $N$. As in the example above, a general continuous function may need exponentially many neurons in the dimension. **Barron’s theorem** in Unit 18 gives a dimension-free rate $C^2/N$ for functions whose Fourier transform is suitably small[[ch18:18.2|Barron’s theorem and the curse of dimensionality.]].
- **How to find the weights.** It is an existence proof (by contradiction), so it gives no construction, and since the loss is not convex there is no guarantee that gradient descent reaches those weights (optimization error, Units 13–14).
- **Whether it can be learned from finite data.** The generalization error is a separate problem (Section 18.7).
- **Where it approximates.** Only on compact sets. Any compact $K\subset\mathbb R^n$ may replace $I_n$, but $f(x)=x$ cannot be approximated uniformly on all of $\mathbb R$ ($G$ is a finite sum of bounded functions, hence bounded).
- **Depth.** This theorem is about width (the number of neurons in one hidden layer). The advantage of stacking layers is a different question[[ch08:8.5|Why stack layers: nonlinear embeddings.]].
` },
    },
    probs: [
      { q: R`When the hypothesis class $\mathcal F$ is replaced by a larger class with more hidden neurons, which of the following **cannot increase**?`,
        choices: [R`The approximation error $\mathcal R(f_{\mathcal F})-\mathcal R(f^*)$`, R`The generalization error $\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})$`, R`The optimization error $\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)$`, R`The population risk of the empirical risk minimizer $\mathcal R(\hat f_n)$`],
        sol: R`The larger class contains the original one, so the risk of its best element $f_{\mathcal F}$ stays the same or decreases. The others depend on the data and the algorithm and can grow. In particular, the generalization error tends to grow when there are more functions to choose from.` },
      { q: R`If $\mathcal R(f^*)=0.05$, $\mathcal R(f_{\mathcal F})=0.08$, $\mathcal R(\hat f_n)=0.12$, and $\mathcal R(f_{\mathrm{alg}})=0.15$, what is the generalization error?`,
        sol: R`$\mathcal R(\hat f_n)-\mathcal R(f_{\mathcal F})=0.12-0.08=0.04$. Adding the approximation error $0.03$ and the optimization error $0.03$ gives the total excess risk $0.10$.` },
      { q: R`Of the three terms in the error decomposition, the approximation and generalization errors are always at least $0$, but the optimization error $\mathcal R(f_{\mathrm{alg}})-\mathcal R(\hat f_n)$ can be negative. Explain why in each case.`,
        sol: R`$f^*$ has the smallest risk among all functions, so $\mathcal R(f_{\mathcal F})\ge\mathcal R(f^*)$; $f_{\mathcal F}$ has the smallest risk within $\mathcal F$ and $\hat f_n\in\mathcal F$, so $\mathcal R(\hat f_n)\ge\mathcal R(f_{\mathcal F})$. But $\hat f_n$ only minimizes the **empirical** risk, not the population risk $\mathcal R$, so another element $f_{\mathrm{alg}}$ of $\mathcal F$ may have a smaller $\mathcal R$ (e.g., SGD stopped early overfits less).`,
        rubric: R`- Why the approximation error is nonnegative — 1 pt
- Why the generalization error is nonnegative ($\hat f_n\in\mathcal F$) — 1 pt
- That $\hat f_n$ only minimizes the empirical risk — 2 pts` },
      { q: R`Which of the following **must** a measure $\mu$ satisfy?`,
        choices: [R`$\mu(A\cap B)=\mu(A)\mu(B)$`, R`If $A,B$ are disjoint, $\mu(A\cup B)=\mu(A)+\mu(B)$`, R`$\mu(A^c)=1-\mu(A)$`, R`$\mu(\{x\})>0$ for every point $x$`],
        sol: R`Taking $A_1=A$, $A_2=B$, and the rest $\varnothing$ in countable additivity gives finite additivity, together with $\mu(\varnothing)=0$. The product property is independence, $1-\mu(A)$ applies only to probability measures of total size 1, and length is $0$ at a single point.` },
      { q: R`For the signed measure $\mu=2\delta_0-\delta_{1/2}+3\lambda$ on $[0,1]$ ($\lambda$ is length), what is $\int_0^1x\,d\mu(x)$?`,
        sol: R`$2\cdot0-\frac12+3\int_0^1x\,dx=-\frac12+\frac32=1$.` },
      { q: R`For $\mu=\delta_{0.2}-\delta_{0.7}$ on $[0,1]$, which is correct?`,
        choices: [R`$\mu([0,1])=0$, so $\mu=0$`, R`$\mu(\{0.2\})=1$, so $\mu\ne0$`, R`It takes negative values, so it is not a signed measure`, R`$\int f\,d\mu=0$ for every continuous function $f$`],
        sol: R`$\mu=0$ requires $0$ on every Borel set. $\int f\,d\mu=f(0.2)-f(0.7)$ is $-0.5\ne0$ for $f(x)=x$.` },
      { q: R`For the signed measure $\mu=\delta_0-2\delta_{1/2}+\delta_1$ on $[0,1]$, find (1) $\mu([0,1])$, (2) $\int x\,d\mu$, and (3) $\int x^2d\mu$, and explain why many functions have integral $0$ even though $\mu\ne0$.`,
        sol: R`(1) $1-2+1=0$. (2) $0-2\cdot\frac12+1=0$. (3) $0-2\cdot\frac14+1=\frac12$. So constants and affine functions all have integral $0$, but $x^2$ does not. $\mu(\{1/2\})=-2\ne0$, so $\mu\ne0$. Integrals vanishing for a few functions are not enough to conclude that a measure is $0$; pinning the measure down as $0$ takes enough functions (e.g., all continuous functions, or all neurons of a discriminatory function).`,
        rubric: R`- The three values — 3 pts
- The reason $\mu\ne0$ — 1 pt
- Explaining that a few functions do not determine a measure — 1 pt` },
      { q: R`On $[0,1]$ with $f(x)=x$ and $g(x)=x^2$, what is $\lVert f-g\rVert_\infty$?`,
        sol: R`The maximum of $x-x^2$ is $\frac14$ at $x=\frac12$.` },
      { q: R`On $[0,1]$, what is the square-integral norm $\lVert g\rVert_2=\big(\int_0^1g(x)^2dx\big)^{1/2}$ of $g(x)=x^4$? (Its max norm is $1$.)`,
        sol: R`$\int_0^1x^8dx=\frac19$, so $\lVert g\rVert_2=\frac13$. In general $\lVert x^k\rVert_2=\frac1{\sqrt{2k+1}}\to0$ while $\lVert x^k\rVert_\infty=1$, so closeness depends on the norm.` },
      { q: R`In $C([0,1])$ with the max norm, which subset is **dense**?`,
        choices: [R`All polynomials`, R`$\{f:\ f(0)=0\}$`, R`All constant functions`, R`$\{f:\ \lVert f\rVert_\infty\le1\}$`],
        sol: R`The Weierstrass theorem. Functions with $f(0)=0$ cannot come closer than $1$ to $f\equiv1$ (they differ by $1$ at the point $0$), constants cannot come closer than $\frac12$ to $f(x)=x$, and functions of norm at most 1 cannot come closer than $2$ to $f\equiv3$.` },
      { q: R`For compact $K$, show that $\lVert f\rVert_\infty=\max_{x\in K}\lvert f(x)\rvert$ is a norm on $C(K)$ by checking the three conditions one by one.`,
        sol: R`The maximum is well defined because the continuous function $\lvert f\rvert$ attains it on a compact set, and it is at least $0$.
**(i)** $\lVert f\rVert_\infty=0\Rightarrow\lvert f(x)\rvert\le0$ at every $x$, that is, $f=0$. The converse is obvious.
**(ii)** $\lVert cf\rVert_\infty=\max_x\lvert c\rvert\lvert f(x)\rvert=\lvert c\rvert\max_x\lvert f(x)\rvert$.
**(iii)** At each $x$, $\lvert f(x)+g(x)\rvert\le\lvert f(x)\rvert+\lvert g(x)\rvert\le\lVert f\rVert_\infty+\lVert g\rVert_\infty$. The right side does not depend on $x$, so it still holds after taking the maximum of the left side.`,
        rubric: R`- Existence of the maximum (compactness) — 1 pt
- Each of the three conditions — 1 pt each
- In the triangle inequality, pointwise first, then the maximum — 1 pt` },
      { q: R`Show that the closure $\overline U$ (all limits of sequences in $U$) of a linear subspace $U$ of a normed space $X$ is also a linear subspace, and explain “$U$ is dense $\iff\overline U=X$.”`,
        sol: R`If $f,g\in\overline U$, there are $u_k,v_k\in U$ with $u_k\to f$ and $v_k\to g$. Then $au_k+bv_k\in U$ and
$$\lVert(au_k+bv_k)-(af+bg)\rVert\le\lvert a\rvert\lVert u_k-f\rVert+\lvert b\rvert\lVert v_k-g\rVert\to0,$$
so $af+bg\in\overline U$. Also $0\in U\subseteq\overline U$.
In the definition of density, “for every $f$ and $\varepsilon$ there is $g\in U$ with $\lVert f-g\rVert<\varepsilon$,” setting $\varepsilon=\frac1k$ gives a sequence in $U$ converging to $f$, so $f\in\overline U$, that is, $\overline U=X$. Conversely, if $f\in\overline U$, the tail of a converging sequence lies within $\varepsilon$, so $U$ is dense.`,
        rubric: R`- Two sequences and the convergence of the linear combination (triangle inequality) — 3 pts
- Dense ⇒ the closure is everything — 1 pt
- The closure is everything ⇒ dense — 1 pt` },
      { q: R`Which is a **sigmoid** by the definition of this unit?`,
        choices: [R`$\tanh t$`, R`$\frac1{1+e^{-t}}$`, R`$\max(0,t)$`, R`$\sin t$`],
        sol: R`It must tend to $0$ as $t\to-\infty$ and to $1$ as $t\to\infty$. $\tanh$ tends to $-1$ and $1$, ReLU diverges, and $\sin$ has no limit. Still, $\tanh t=2s(2t)-1$, so $\tanh$ networks build the same set of functions.` },
      { q: R`For the identity activation $\sigma(t)=t$ and $\mu=\delta_0-2\delta_{1/2}+\delta_1$ on $[0,1]$, what is $\int\sigma(wx+\theta)\,d\mu(x)$ when $w=3$ and $\theta=-1$?`,
        sol: R`$(-1)-2\big(\frac32-1\big)+(3-1)=-1-1+2=0$. It is $0$ for every $w,\theta$ while $\mu\ne0$, so the identity is not a discriminatory function, and sums of affine functions cannot approximate $x^2$.` },
      { q: R`For the logistic function $s$ and $\mu=\delta_a-\delta_b$ ($a\ne b$) on $[0,1]$, show that there are $w,\theta$ with $\int s(wx+\theta)\,d\mu\ne0$. Explain how this fits the definition of discrimination.`,
        sol: R`$\int s(wx+\theta)\,d\mu=s(wa+\theta)-s(wb+\theta)$. With $w=1$ and $\theta=0$ this is $s(a)-s(b)$, and since $s'(t)=s(t)(1-s(t))>0$, $s$ is strictly increasing, so it is nonzero for $a\ne b$. Discrimination says “if the integral is 0 for every $w,\theta$, then $\mu=0$,” whose contrapositive is “if $\mu\ne0$, some neuron has a nonzero integral.” We have actually found such a neuron for this $\mu\ne0$.`,
        rubric: R`- Computing the integral as the difference of two function values — 1 pt
- Showing it is nonzero by strict monotonicity — 2 pts
- Connecting to the contrapositive of discrimination — 1 pt` },
      { q: R`For a continuous sigmoid $\sigma$, show that as $\lambda\to\infty$, $\sigma(\lambda t)$ converges to $1$ for $t>0$, $0$ for $t<0$, and $\sigma(0)$ at $t=0$, and explain why this convergence is not uniform near $t=0$. What role does this limit play in the proof of discrimination?`,
        sol: R`For $t>0$, $\lambda t\to\infty$, so $\sigma(\lambda t)\to1$; for $t<0$, $\lambda t\to-\infty$, so it tends to $0$; and at $t=0$ it stays $\sigma(0)$. The limit function is discontinuous at $t=0$ while each $\sigma(\lambda\cdot)$ is continuous, so, since a uniform limit of continuous functions is continuous, the convergence cannot be uniform (indeed $\sigma(1)$ remains at $t=\frac1\lambda$).
Role: from the assumption that every integral of $\sigma\big(\lambda(w^Tx+\theta)+\varphi\big)$ is $0$, the bounded convergence theorem moves the limit inside the integral to give an equation for the measures of the half-space $\{w^Tx+\theta>0\}$ and the hyperplane, $\mu(H^+)+\sigma(\varphi)\mu(\Pi)=0$. From it we draw that every half-space and hyperplane has measure $0$.`,
        rubric: R`- The limits in the three cases — 2 pts
- Why the convergence is not uniform — 1 pt
- The role of turning it into measures of half-spaces (bounded convergence) — 2 pts` },
      { q: R`Which is a **bounded linear functional** on $C([0,1])$?`,
        choices: [R`$f\mapsto f(0.3)$`, R`$f\mapsto f(0.3)^2$`, R`$f\mapsto\lVert f\rVert_\infty$`, R`$f\mapsto f'(0.3)$`],
        sol: R`$f(0.3)$ is linear and bounded since $\lvert f(0.3)\rvert\le\lVert f\rVert_\infty$, and its Riesz representation is $\int f\,d\delta_{0.3}$. The square and the norm are not linear, and since a continuous function need not be differentiable, $f'(0.3)$ is not defined on all of $C([0,1])$.` },
      { q: R`Writing $L(f)=f(0)-f(1)$ in the Riesz form $\int f\,d\mu$ gives $\mu=\delta_0-\delta_1$. For $f(x)=e^x$, what is $L(f)$?`,
        sol: R`$e^0-e^1=1-e\approx-1.718$.` },
      { q: R`The polynomials $P$ form a proper subspace of $C([0,1])$. Which is correct about Lemma 3?`,
        choices: [R`Since $P\ne C([0,1])$, there is a bounded $L\ne0$ that is $0$ on $P$`, R`Since $P$ is dense, the only bounded linear functional that is $0$ on $P$ is $L=0$`, R`Since $P$ is closed, Lemma 3 applies as it is`, R`Lemma 3 does not hold in infinite-dimensional spaces`],
        sol: R`A bounded $L$ is continuous, so if it is $0$ on the dense $P$, taking limits makes it $0$ on all of $\overline P=C([0,1])$. Lemma 3 must assume “not dense,” not “proper subspace.”` },
      { q: R`Using Lemma 3 and the Riesz representation theorem, prove Lemma 4: if $U$ is a non-dense linear subspace of $C(I_n)$, there is $\mu\in M(I_n)$ with $\mu\ne0$ and $\int_{I_n}h\,d\mu=0$ ($\forall h\in U$).`,
        sol: R`**Step 1.** Applying Lemma 3 to $X=C(I_n)$ (max norm) gives a bounded linear functional $L$ with $L\ne0$ and $L|_U=0$.
**Step 2.** $I_n$ is compact, so by the Riesz representation theorem there is a finite signed measure $\mu\in M(I_n)$ with $L(f)=\int_{I_n}f\,d\mu$ ($\forall f\in C(I_n)$).
**Step 3.** If $h\in U$, then $\int h\,d\mu=L(h)=0$.
**Step 4.** Since $L\ne0$ there is $f_0$ with $L(f_0)\ne0$, and $\int f_0\,d\mu=L(f_0)\ne0$, so $\mu\ne0$ (if $\mu=0$, every integral would be $0$).`,
        rubric: R`- Applying Lemma 3 (the normed space is $C(I_n)$) — 1 pt
- The hypotheses (compact, bounded) and conclusion of the Riesz representation theorem — 2 pts
- The integral is 0 on $U$ — 1 pt
- The reason $\mu\ne0$ — 2 pts` },
      { q: R`Show that $U=\{f\in C([0,1]):\ \int_0^1f(x)\,dx=0\}$ is not dense, and write a $\mu$ as in Lemma 4.`,
        sol: R`$L(f)=\int_0^1f\,dx$ is a bounded linear functional with $\lvert L(f)\rvert\le\lVert f\rVert_\infty$, and it is $0$ on $U$. If $g\in U$, then $1=\int_0^1(1-g)\,dx\le\lVert1-g\rVert_\infty$, so nothing in $U$ comes closer than $1$ to the constant $1$, and $U$ is not dense. With $\mu=\lambda$ (the length measure), $\int h\,d\lambda=0$ ($h\in U$) and $\lambda\ne0$.`,
        rubric: R`- The bounded linear functional $L$ with $L|_U=0$ — 1 pt
- Not dense (a lower bound on the distance) — 2 pts
- $\mu=\lambda$ — 1 pt` },
      { q: R`What does the universal approximation theorem (Cybenko) **guarantee**?`,
        choices: [R`For every $f\in C(I_n)$ and $\varepsilon>0$, there is a one-hidden-layer network within $\varepsilon$ at every $x\in I_n$`, R`The number of neurons needed is $N\le1/\varepsilon$`, R`Gradient descent finds the weights`, R`Uniform approximation on all of $\mathbb R^n$`],
        sol: R`It is an existence theorem. It says nothing about the number of neurons (partly answered by Barron’s theorem in Unit 18), optimization, or extension to the whole domain. $G$ is bounded, so it cannot approximate $f(x)=x$ uniformly on all of $\mathbb R$.` },
      { q: R`Where is the **continuity** of $\sigma$ used in the proof of Lemma 5?`,
        choices: [R`To put the elements of $U$ in $C(I_n)$ so that $U$ is a subspace of $C(I_n)$`, R`To obtain the measure from Lemma 4`, R`To set $N=1$ and $\alpha_1=1$`, R`To get the contradiction from $\mu=0$`],
        sol: R`Lemma 4 is a theorem about subspaces of $C(I_n)$, so each $G$ must be continuous. Discrimination is a separate assumption.` },
      { q: R`Approximating $f(x)=x$ on $[0,1]$ by a staircase $G_N$ of $N$ step-function neurons gives maximum error $\frac1{2N}$. What is the smallest $N$ that makes the maximum error at most $0.01$?`,
        sol: R`$\frac1{2N}\le0.01\iff N\ge50$. The same grid in $n$ dimensions needs $50^n$, so the number of neurons grows exponentially with the dimension.` },
      { q: R`Using Lemma 4 and discrimination, prove Lemma 5 — if $\sigma$ is a continuous discriminatory function, the sums $\sum_{j=1}^N\alpha_j\sigma(w_j^Tx+\theta_j)$ are dense in $C(I_n)$ — by contradiction. State exactly what you negate.`,
        sol: R`**Subspace.** Let $U$ be all such finite sums; it is closed under sums and scalar multiples (increase $N$ and concatenate), and since $\sigma$ is continuous, $U\subseteq C(I_n)$ is a linear subspace.
**Assumption (negation).** $U$ is not dense, that is, $\overline U\ne C(I_n)$. (Note: not $U\ne C(I_n)$.)
**Lemma 4.** There is $\mu\in M(I_n)$ with $\mu\ne0$ and $\int h\,d\mu=0$ ($\forall h\in U$).
**A single neuron.** $h(x)=\sigma(w^Tx+\theta)$ ($N=1$, $\alpha_1=1$) is also in $U$, so $\int\sigma(w^Tx+\theta)\,d\mu=0$ ($\forall w,\theta$).
**Contradiction.** Since $\sigma$ is discriminatory, $\mu=0$. This contradicts $\mu\ne0$, so $U$ is dense.`,
        rubric: R`- $U$ is a linear subspace of $C(I_n)$ (using continuity) — 2 pts
- The correct negation ($\overline U\ne C(I_n)$) — 1 pt
- $\mu\ne0$ from Lemma 4 — 1 pt
- Reducing to a single neuron — 1 pt
- Contradiction via discrimination — 1 pt` },
      { q: R`Even with the universal approximation theorem, training a real neural network can fail. Using the error decomposition of Section 17.1, give three reasons.`,
        sol: R`(1) **Approximation**: the theorem only says some finite $N$ exists, so if the $N$ actually used is too small, an approximation error remains (the $N$ needed can be very large depending on the dimension). (2) **Generalization**: even a large enough network, chosen as $\hat f_n$ from finite data, can be bad on the population (overfitting). (3) **Optimization**: the loss is not convex, so SGD may not reach $\hat f_n$ and may stall at local minima or saddle points. The theorem guarantees only the “possibility” in the first of these three.`,
        rubric: R`- Approximation: existence only, $N$ unknown — 1 pt
- Generalization — 1 pt
- Optimization — 1 pt` },
    ],
  };
})();
