/* English text — 03 Entropy, KL Divergence, Mutual Information (W1 Wed slides 35–44, W2 Mon/Wed notes, Problem Set 1 Problem 1). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    binent: R`$H(p)=-p\log_2p-(1-p)\log_2(1-p)$. A coin whose outcome is certain ($p=0$ or $1$) has entropy 0, and the hardest to predict, the fair coin ($p=\tfrac12$), has the maximum of 1 bit. $p=0.9$ and $p=0.1$ are symmetric and have the same $0.469$ bits.`,
    jensen: R`Let $X$ be a random variable equal to $a$ with probability $0.35$ and to $b$ with probability $0.65$. Then $\E[\varphi(X)]$ is a point on the chord and $\varphi(\E X)$ a point on the curve. The curve of a convex function lies below the chord, so $\varphi(\E X)\le\E\varphi(X)$. Equality holds only when $X$ is concentrated at one value or $\varphi$ is a straight line on that interval.`,
    jskl: R`$p=\operatorname{Bern}(\tfrac12)$, $q=\operatorname{Bern}(s)$. As $s\to0$ or $s\to1$, $q$ regards one value of $p$ as nearly impossible, so $\KL(p\Vert q)\to\infty$. JS compares with the average $m$ of the two distributions, so it always stays at or below $\ln2$. Both curves are 0 only at $s=\tfrac12$ ($p=q$).`,
    venn: R`The left circle is $H(X)$ and the right circle $H(Y)$. The overlap is the mutual information $I(X;Y)$, and the whole union is the joint entropy $H(X,Y)$.`,
  });
  EM.en.ch[3] = {
    title: 'Entropy, KL Divergence, Mutual Information',
    fig: R`The binary entropy H(p) (bold) and KL(p‖q) for several q`,
    tagline: R`From the single fact $\KL(p\Vert q)\ge0$ follow cross-entropy $\ge$ entropy, mutual information $\ge0$, and “conditioning reduces entropy”.`,
    summary: R`These are the tools for measuring uncertainty and the amount of information. Starting from the **information** $-\log p$, which is larger for rarer events, we define its mean, the **entropy**; the **KL divergence**, which measures the difference between two distributions; the **mutual information**, the information two random variables share; and the **cross-entropy**, the true identity of the classification loss. All the inequalities (KL ≥ 0, $H(X\mid Y)\le H(X)$, $H_p(q)\ge H(p)$) come from one tool — Jensen's inequality. The last section proves the three properties of the **Jensen–Shannon (JS) divergence** from Problem 1 of Problem Set 1 (non-negativity, identity of indiscernibles, symmetry), and also covers its boundedness and its interpretation as mutual information.`,
    goals: [
      R`Explain why information is a logarithm (monotone decreasing + additive for independent events) and compute entropies`,
      R`Define conditional and joint entropy and prove the chain rule $H(X,Y)=H(X)+H(Y\mid X)$`,
      R`Prove $\KL(p\Vert q)\ge0$ and its equality condition with Jensen's inequality`,
      R`Derive the three expressions of mutual information and show that “conditioning reduces entropy”`,
      R`Show cross-entropy = entropy + KL and explain its relation to the classification loss`,
      R`Prove the non-negativity, identity, and symmetry of the JS divergence and $D_{JS}\le\log2$`,
    ],
    secTitles: { '3.1': 'Entropy', '3.2': 'Chain rule', '3.3': 'KL divergence', '3.4': 'Mutual information', '3.5': 'Cross-entropy', '3.6': 'JS divergence' },
    secs: {
      '3.1': { title: 'Information and Entropy', body: R`
:::idea In plain words
The news “the sun will rise tomorrow” carries no information, while “there will be heavy snow tomorrow (in midsummer)” carries a huge amount. The amount of information is **surprise**, and surprise is larger for rarer events. We can also think of the game of twenty questions: guessing one of the numbers 1 to 8 takes $\log_28=3$ yes/no questions. Entropy is “the average number of yes/no questions needed to find the answer”.
:::

We define the **information** (surprise) of an event with probability $p(x)$ as $h(x)=-\log p(x)$. This definition comes from two requirements.

- **Monotone decreasing** in $p(x)$: the rarer the event, the more information. A certain event ($p=1$) has information 0.
- **Additive** under independence: $h_{X,Y}(x,y)=h_X(x)+h_Y(y)$.

:::hand Lecture note — additivity
If $X,Y$ are independent, $p_{X,Y}(x,y)=p_X(x)p_Y(y)$, so
$$\begin{aligned}h_X(x)+h_Y(y)&=-\log p_X(x)-\log p_Y(y)=-\log\big(p_X(x)p_Y(y)\big)\\&=-\log p_{X,Y}(x,y)=h_{X,Y}(x,y).\end{aligned}$$
The logarithm is the function that turns products into sums, which is why information involves a logarithm.
:::

In fact, it is known that the only “continuous functions with $h(pq)=h(p)+h(q)$” are of the form $h(p)=-c\log p$ ($c>0$) (Cauchy's functional equation). The constant $c$ amounts to choosing the base of the logarithm.

:::key Entropy
$$H(X)=-\E\big[\log p(X)\big]=\E\Big[\log\frac1{p(X)}\Big]=-\sum_xp(x)\log p(x)$$
Since $0\le p\le1$, $H(X)\ge0$, and if $p(x)=1$ for some $x$ then $H(X)=0$. A random variable with $K$ values has $H(X)\le\log K$, with equality for the uniform distribution.
:::

With base-2 logarithms the unit is the bit; with base $e$, the nat. A fair coin has $H=\log_22=1$ bit, while a coin with heads probability $0.9$ has $H=-0.9\log_20.9-0.1\log_20.1\approx0.469$ bits, less uncertain. We adopt the convention $0\log0=0$ ($\lim_{t\to0^+}t\log t=0$).

:::fig binent
:::

:::ex Example 1 — Three distributions
What are the entropies (in bits) of (a) a fair die, (b) $P(A)=\tfrac12$, $P(B)=\tfrac14$, $P(C)=\tfrac14$, (c) $P(A)=1$?
---
(a) $\log_26\approx2.585$ bits. (b) $\tfrac12\cdot1+\tfrac14\cdot2+\tfrac14\cdot2=1.5$ bits — half the time a single question “Is it A?” ends it, otherwise one more question “Is it B?”, 1.5 questions on average. (c) 0 bits.
:::

**Proof of $H\le\log K$.** Let $u$ be the uniform distribution on the $K$ values; then by the non-negativity of KL in §3.3,
$$0\le\KL(p\Vert u)=\sum_xp(x)\log\frac{p(x)}{1/K}=\log K-H(X).$$
Equality holds only when $p=u$. That is, **the uniform distribution is the most uncertain**.

### Going deeper: compression and continuous distributions

By Shannon's source coding theorem, symbols from a distribution $p$ cannot be losslessly compressed below $H(p)$ bits on average, and can be compressed as close to $H(p)$ as desired. This is the basis for interpreting entropy as “the size of the information” measured in bits. For continuous distributions we use $-\int f\log f$ (the **differential entropy**), which behaves differently from the discrete entropy: it can be negative and it changes under a change of coordinates. Example: the differential entropy of $\N(\mu,\sigma^2)$ is $\frac12\log(2\pi e\sigma^2)$, which is negative when $\sigma$ is small[[@med:ch05:2.5|Information, entropy, differential entropy.]].
` },
      '3.2': { title: 'Conditional Entropy, Joint Entropy, and the Chain Rule', body: R`
:::idea In plain words
To find out two random variables $X,Y$ together, first find out $X$ (on average $H(X)$ questions), then find out $Y$ knowing $X$ (on average $H(Y\mid X)$ questions). Hence $H(X,Y)=H(X)+H(Y\mid X)$ — the numbers of questions add up.
:::

:::def Conditional entropy and joint entropy
$$H(Y\mid X)=-\E_{X,Y}\big[\log p(Y\mid X)\big]=-\sum_{x,y}p(x,y)\log p(y\mid x)$$
$$H(X,Y)=-\E\big[\log p(X,Y)\big]=-\sum_{x,y}p(x,y)\log p(x,y)$$
:::

$H(Y\mid X)$ is the average of “the uncertainty left in $Y$ after learning $X$”. It can also be written $H(Y\mid X)=\sum_xp(x)H(Y\mid X=x)$. (Proof: write $p(x,y)=p(x)p(y\mid x)$ and group by $x$ to get $-\sum_xp(x)\sum_yp(y\mid x)\log p(y\mid x)$.)

:::key Chain rule for entropy
$$H(X,Y)=H(X)+H(Y\mid X)=H(Y)+H(X\mid Y)$$
:::

:::hand Lecture note — the chain rule
Since $p(X,Y)=p(Y\mid X)p(X)$,
$$\begin{aligned}H(X,Y)&=-\E\big[\log p(Y\mid X)p(X)\big]\\&=-\E_{X,Y}\big[\log p(Y\mid X)\big]-\E_{X,Y}\big[\log p(X)\big]=H(Y\mid X)+H(X).\end{aligned}$$
The last term is the expectation of a function of $X$ alone, so it equals $-\E_X[\log p(X)]=H(X)$.
:::

:::ex Example 2 — Computing from a table
Joint distribution $p(0,0)=\tfrac12$, $p(0,1)=\tfrac14$, $p(1,0)=0$, $p(1,1)=\tfrac14$ (the first coordinate is $X$). Find $H(X,Y)$, $H(X)$, $H(Y\mid X)$ in bits and check the chain rule.
---
$H(X,Y)=\tfrac12\cdot1+\tfrac14\cdot2+\tfrac14\cdot2=1.5$ (the cell with probability 0 contributes 0).
The marginals are $P(X=0)=\tfrac34$, $P(X=1)=\tfrac14$, so $H(X)=-\tfrac34\log_2\tfrac34-\tfrac14\log_2\tfrac14\approx0.811$.
If $X=0$, the conditional distribution of $Y$ is $(\tfrac23,\tfrac13)$ with entropy $\approx0.918$; if $X=1$, $Y=1$ for certain, entropy 0. Hence $H(Y\mid X)=\tfrac34(0.918)+\tfrac14(0)\approx0.689$.
Check: $0.811+0.689=1.5=H(X,Y)$.
:::

In general, $H(X_1,\dots,X_n)=\sum_{i=1}^nH(X_i\mid X_1,\dots,X_{i-1})$. It is the same structure as a language model writing the probability of a sentence as the product of “the probability of the next word given the previous words”.

:::warn Conditional entropy is an average, not a “specific value”
$H(Y\mid X=x)$ can grow at a particular $x$ (it can even exceed $H(Y)$). What always decreases is the **average** $H(Y\mid X)$ (§3.4).
:::
` },
      '3.3': { title: 'Kullback–Leibler Divergence and Theorem 1', body: R`
:::idea In plain words
If the true distribution is $p$ but we design a compression code believing it is $q$, the code becomes longer on average. **How much longer** is the KL divergence. If $q=p$ the loss is 0, and otherwise there is always a loss (positive) — this is Theorem 1 of this section.
:::

:::def KL divergence (relative entropy)
$$\KL(p\Vert q)=D_{\mathrm{KL}}(p\Vert q)=\E_p\Big[\log\frac{p(X)}{q(X)}\Big]=\sum_xp(x)\log\frac{p(x)}{q(x)}$$
Conventions: $0\log\frac00=0$, $0\log\frac0a=0$, $b\log\frac b0=\infty$ ($b>0$). For continuous distributions, an integral replaces the sum.
:::

KL measures “the loss of using $q$ instead of the true distribution $p$”, but it is **not a distance**. It is not symmetric and does not satisfy the triangle inequality.

:::ex Example 3 — Two Bernoulli distributions (lecture notes)
With $p(1)=r,\ p(0)=1-r$ and $q(1)=s,\ q(0)=1-s$, write $\KL(p\Vert q)$ and $\KL(q\Vert p)$, and compare them at $r=\tfrac12$, $s=\tfrac14$ (natural logarithm).
---
$$\KL(p\Vert q)=r\log\frac rs+(1-r)\log\frac{1-r}{1-s},$$
$$\KL(q\Vert p)=s\log\frac sr+(1-s)\log\frac{1-s}{1-r}$$
$r=\tfrac12,s=\tfrac14$: $\KL(p\Vert q)=\tfrac12\log2+\tfrac12\log\tfrac23\approx0.1438$ and $\KL(q\Vert p)=\tfrac14\log\tfrac12+\tfrac34\log\tfrac32\approx0.1308$. They differ.
:::

### The tool: Jensen's inequality

A **convex function** is one whose chord (the segment joining two points of its graph) lies above the graph: $\varphi(\lambda a+(1-\lambda)b)\le\lambda\varphi(a)+(1-\lambda)\varphi(b)$ ($0\le\lambda\le1$). If $\varphi''\ge0$, it is convex (e.g., $x^2$, $e^x$, $-\log x$). Read with a random variable $X$ taking $a,b$ with probabilities $\lambda,1-\lambda$, this inequality is exactly $\varphi(\E X)\le\E\varphi(X)$.

:::thm Jensen's inequality
If $\varphi$ is convex, then $\varphi(\E[X])\le\E[\varphi(X)]$.[[@base:ch05:5.2|Proof of Jensen's inequality: induction on finite weighted sums.]] If $\varphi$ is concave (e.g., $\log$), the inequality reverses: $\E[\log X]\le\log\E[X]$.
:::

:::fig jensen
:::

**Equality condition.** If $\varphi$ is **strictly convex** (the chord lies strictly above the graph except at its endpoints; true if $\varphi''>0$), equality holds only when $X$ is constant with probability 1.

### Theorem 1

:::key Non-negativity of the KL divergence (Theorem 1)
$$\KL(p\Vert q)\ge0,\qquad \text{equality}\iff p(x)=q(x)\ \ \text{for all }x$$
:::

:::hand Lecture note — proof of Theorem 1
Let $E=\{x:p(x)>0\}$; the terms with $p(x)=0$ are 0, so
$$\begin{aligned}\KL(p\Vert q)&=\sum_{x\in E}p(x)\log\frac{p(x)}{q(x)}=\sum_{x\in E}p(x)\Big[-\log\frac{q(x)}{p(x)}\Big]\\&\ge-\log\Big(\sum_{x\in E}p(x)\frac{q(x)}{p(x)}\Big)=-\log\sum_{x\in E}q(x)\ \ge\ 0.\end{aligned}$$
The first inequality is Jensen, since $-\log$ is convex; the last uses $\sum_{x\in E}q(x)\le1$. Equality holds when $q(x)/p(x)=c$ is constant on $E$ and $\sum_{E}q=1$; then $1=\sum_xq(x)=c\sum_xp(x)=c$ gives $q=p$.
:::

Filling in the missing details:
- If $q(x)=0$ for some $x\in E$, that term is $+\infty$ and $\KL=\infty\ge0$ (trivial). From now on assume $q>0$ on $E$.
- Jensen is applied to the random variable $Z=q(X)/p(X)$ ($X\sim p$, on $E$): $\E[-\log Z]\ge-\log\E Z$ with $\E Z=\sum_Eq$.
- Equality requires **both** inequalities to be equalities. The first only when $Z$ is a constant $c$, since $-\log$ is strictly convex; the second only when $\sum_Eq=1$. Together, $c=1$, i.e., $q=p$ on $E$, and outside $E$, $\sum_Eq=1$ forces $q=0=p$.

### Going deeper: the two directions of KL

In learning, minimizing $\KL(p\Vert q_\theta)$ (with respect to the data $p$, the “forward KL”) heavily punishes $q$ for being 0 where $p$ is positive, so $q$ tries to **cover** all the modes of $p$ (mean-seeking). Conversely, minimizing $\KL(q_\theta\Vert p)$ (the “reverse KL”, variational inference) prevents $q$ from putting mass where $p$ is 0, so $q$ **latches onto one mode** (mode-seeking). The asymmetry is not a defect but a difference of use. A symmetric alternative is the JS divergence of §3.6.
` },
      '3.4': { title: 'Mutual Information', body: R`
:::idea In plain words
How much does knowing $X$ reduce the uncertainty about $Y$? That **reduction** is the mutual information. Knowing the weather ($X$) greatly reduces the uncertainty about whether to take an umbrella ($Y$), while a die roll has nothing to do with umbrellas and reduces nothing (mutual information 0).
:::

:::def Mutual information
$$I(X;Y)=\KL\big(p(x,y)\,\Vert\,p(x)p(y)\big)=\E_{p(x,y)}\Big[\log\frac{p(X,Y)}{p(X)p(Y)}\Big]$$
:::

It measures how different the joint distribution is from “the distribution assuming independence”, $p(x)p(y)$. By Theorem 1, $I(X;Y)\ge0$, with equality only when $X,Y$ are independent.

:::key Mutual information
$$\begin{aligned}I(X;Y)&=H(X)-H(X\mid Y)=H(Y)-H(Y\mid X)\\&=H(X)+H(Y)-H(X,Y)\end{aligned}$$
:::

:::hand Lecture note — derivation
Since $p(x,y)=p_{Y\mid X}(y\mid x)p_X(x)$,
$$I(X;Y)=\sum_{x,y}p(x,y)\log\frac{p(y\mid x)}{p(y)}=\E_{X,Y}\big[\log p(Y\mid X)-\log p(Y)\big].$$
Since $H(Y)=-\E_Y[\log p(Y)]$ and $H(Y\mid X)=-\E_{X,Y}[\log p(Y\mid X)]$, $I(X;Y)=-H(Y\mid X)+H(Y)$. In the same way, $I(X;Y)=H(X)-H(X\mid Y)$.
:::

The third expression comes from putting the chain rule $H(Y\mid X)=H(X,Y)-H(X)$ into the first.

:::fig venn
:::

**Conclusion.** Since $I\ge0$, $H(X\mid Y)\le H(X)$: on average **conditioning reduces entropy** (never increases it).

:::ex Example 4 — Mutual information of the table in §3.2
For the distribution of Example 2, find $I(X;Y)$ in bits.
---
$P(Y=0)=\tfrac12$ and $P(Y=1)=\tfrac12$, so $H(Y)=1$. $I=H(X)+H(Y)-H(X,Y)\approx0.811+1-1.5=0.311$ bits. Or $H(Y)-H(Y\mid X)=1-0.689=0.311$. Knowing $X$ resolves about 0.31 of the 1 bit of uncertainty about $Y$.
:::

### Going deeper: writing it as a conditional expectation

It can also be written $I(X;Y)=\sum_xp(x)\,\KL\big(p(y\mid x)\,\Vert\,p(y)\big)$ (from the definition with $p(x,y)=p(x)p(y\mid x)$). It is the average of “how much the distribution of $Y$ changes from its original distribution once $X$ turns out to be $x$”. The **information gain** of decision trees is exactly this quantity[[@ml:ch15:18.2b|Information gain is mutual information.]], and §3.6 uses this expression to read the JS divergence as a mutual information.
` },
      '3.5': { title: 'Cross Entropy', body: R`
:::idea In plain words
The cross-entropy is the average, over outcomes from the true distribution $p$, of the surprise $-\log q(x)$ assigned by the model $q$. The higher the probability the model gives the correct answer, the smaller the surprise and the smaller the cross-entropy. This is exactly the loss function of classification.
:::

:::def Cross-entropy
$$H_p(q)=-\E_p\big[\log q(X)\big]=-\sum_xp(x)\log q(x)$$
:::

:::key Cross-entropy
$$H_p(q)=H(p)+\KL(p\Vert q)\ \ge\ H(p)$$
:::

:::hand Lecture note — derivation
$$\begin{aligned}\KL(p\Vert q)=\sum_{x\in E}p\log\frac pq&=-\sum_{x\in E}p(x)\log q(x)-\sum_{x\in E}p(x)\log\frac1{p(x)}\\&=H_p(q)-H(p)\ \ge0.\end{aligned}$$
Hence $H_p(q)\ge H(p)$ (Gibbs' inequality).
:::

**Meaning for learning.** The data distribution $p$ is fixed, so minimizing the cross-entropy over the model $q$ is the same as minimizing $\KL(p\Vert q)$. For a one-hot label $p=(0,\dots,1,\dots,0)$, $H(p)=0$, so $H_p(q)=-\log q(\text{correct class})$ — exactly the negative log-likelihood of logistic and softmax regression[[ch06:6.2|The softmax regression loss $-\sum_i\sum_ky_{ik}\log p_k$ is a sum of cross-entropies.]]. The medical AI course treats the same relation as “MLE = KL minimization”[[@med:ch05:2.5b|Approximating KL by a sample mean leaves only the negative log-likelihood.]].

:::ex Example 5 — Computing a classification loss
The answer is the second class (one-hot $p=(0,1,0)$) and the model outputs $q=(0.2,0.5,0.3)$. What is the cross-entropy? And if the model improves to $q=(0.05,0.9,0.05)$?
---
$H_p(q)=-\log0.5\approx0.693$. The improved model has $-\log0.9\approx0.105$. The closer the probability of the correct answer is to 1, the closer the loss is to 0; giving the correct answer probability 0.01 is punished heavily with $-\log0.01\approx4.6$.
:::

### Going deeper: over the whole data set

If $\hat p$ is the empirical distribution of the training data $\{(x_i,y_i)\}$, the average cross-entropy loss $-\frac1N\sum_i\log q_\theta(y_i\mid x_i)$ is $H_{\hat p}(q_\theta)$. Hence “minimizing the cross-entropy = minimizing the negative log-likelihood = MLE = minimizing $\KL(\hat p\Vert q_\theta)$” all say the same thing. With label smoothing ($1-\varepsilon$ on the correct class and $\varepsilon/(K-1)$ on the rest), $H(p)>0$, which prevents the overconfidence of the model outputting probability 1.
` },
      '3.6': { title: 'Jensen–Shannon Divergence', body: R`
:::idea In plain words
KL is not symmetric and has the inconvenience of becoming infinite where $q$ is 0. The fix: build the **average distribution** $m$ by mixing the two distributions half and half, measure with KL how far $p$ and $q$ each are from $m$, and average. Then the order does not matter (symmetric), the value is always finite, and it is 0 only when the two distributions are equal.
:::

:::def Jensen–Shannon divergence
Let $p$ and $q$ be two probability distributions on a common probability space. The Jensen–Shannon divergence between $p$ and $q$ is defined by
$$D_{JS}(p\Vert q)=\frac12\KL(p\Vert m)+\frac12\KL(q\Vert m),\qquad m=\frac12(p+q).$$
:::

$m$ is a probability distribution: it is non-negative and $\sum_xm(x)=\frac12(1+1)=1$. Also, if $p(x)>0$ then $m(x)\ge\frac12p(x)>0$, so **the denominator of the KL never becomes 0**.

### Problem Set 1, Problem 1: the three properties

:::key Properties of the JS divergence
(i) Non-negativity $D_{JS}(p\Vert q)\ge0$ (ii) Identity of indiscernibles $D_{JS}(p\Vert q)=0\iff p=q$ (iii) Symmetry $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$. Moreover (iv) $D_{JS}(p\Vert q)\le\log2$.
:::

**(i) Non-negativity.** By Theorem 1 (§3.3), $\KL(p\Vert m)\ge0$ and $\KL(q\Vert m)\ge0$. We multiplied two non-negative numbers by $\frac12$ and added them, so $D_{JS}\ge0$.

**(ii) Identity of indiscernibles.** ($\Leftarrow$) If $p=q$, then $m=\frac12(p+p)=p$, so $\KL(p\Vert m)=\KL(p\Vert p)=0$ and likewise $\KL(q\Vert m)=0$. Hence $D_{JS}=0$.
($\Rightarrow$) If $D_{JS}=0$, the sum of two non-negative terms is 0, so **both** are 0: $\KL(p\Vert m)=0$ and $\KL(q\Vert m)=0$. By the equality condition of Theorem 1, $p=m$ and $q=m$. Hence $p=q$.

**(iii) Symmetry.** $m=\frac12(p+q)=\frac12(q+p)$ does not depend on the order of $p,q$. Therefore
$$D_{JS}(q\Vert p)=\frac12\KL(q\Vert m)+\frac12\KL(p\Vert m)=D_{JS}(p\Vert q)$$
(only the order of the two terms changes, by commutativity of addition).

**(iv) Boundedness.** Since $m(x)\ge\frac12p(x)$, $\frac{p(x)}{m(x)}\le2$ wherever $p(x)>0$, so $\KL(p\Vert m)=\sum_{p>0}p\log\frac pm\le\sum p\log2=\log2$. The same holds for $q$, so $D_{JS}\le\frac12\log2+\frac12\log2=\log2$. Equality holds when the supports of $p$ and $q$ do not overlap ($p(x)q(x)=0$ for all $x$): then $m=p/2$ wherever $p>0$, giving exactly $\log2$.

:::warn What proofs often leave out
In ($\Rightarrow$) of (ii), “a sum equal to 0 means each term is 0” holds **because each term is non-negative**. This one line and the **equality condition** of Theorem 1 must be cited explicitly for full marks. It is also good to point out that $m$ is a probability distribution and $p\ll m$ (the KL is finite). For continuous distributions, replace sums by integrals and read “for all $x$” as “for almost all $x$”.
:::

### A computed example and the entropy form

Writing out the two KLs, $\KL(p\Vert m)=-H(p)-\sum_xp(x)\log m(x)$, so
$$\begin{aligned}D_{JS}(p\Vert q)&=-\frac{H(p)+H(q)}2-\sum_x\frac{p(x)+q(x)}2\log m(x)\\&=H(m)-\frac{H(p)+H(q)}2.\end{aligned}$$
It is “the entropy of the mixture − the average of the entropies”. That this value is non-negative because entropy is a concave function is another proof of (i).

:::ex Example 6 — Two Bernoulli distributions
Find $D_{JS}$ in natural logarithms for $p=\operatorname{Bern}(\tfrac12)$, $q=\operatorname{Bern}(\tfrac14)$ (the same distributions as Example 3).
---
$m=\operatorname{Bern}(\tfrac38)$. $\KL(p\Vert m)=\tfrac12\log\tfrac{1/2}{3/8}+\tfrac12\log\tfrac{1/2}{5/8}=\tfrac12\log\tfrac43+\tfrac12\log\tfrac45\approx0.0323$,
$\KL(q\Vert m)=\tfrac14\log\tfrac{1/4}{3/8}+\tfrac34\log\tfrac{3/4}{5/8}=\tfrac14\log\tfrac23+\tfrac34\log\tfrac65\approx0.0354$.
$D_{JS}\approx\tfrac12(0.0323+0.0354)\approx0.0338$. By the entropy form too, $H(m)-\frac{H(p)+H(q)}2\approx0.6616-\frac{0.6931+0.5623}2\approx0.0338$. Unlike $\KL(p\Vert q)\approx0.144$ and $\KL(q\Vert p)\approx0.131$, swapping the order gives the same value.
:::

:::fig jskl
:::

### Going deeper: the mutual-information reading and GANs

Toss a fair coin $Z$; if $Z=0$ draw $X\sim p$, and if $Z=1$ draw $X\sim q$. Then the marginal of $X$ is $m$, and from the expression of §3.4, $I(X;Z)=\sum_zp(z)\KL(p(x\mid z)\Vert p(x))$,
$$I(X;Z)=\frac12\KL(p\Vert m)+\frac12\KL(q\Vert m)=D_{JS}(p\Vert q).$$
That is, the JS divergence is “how well one sample tells whether it came from $p$ or from $q$”. Since $0\le I(X;Z)\le H(Z)=\log2$, (i) and (iv) follow at once. In a generative adversarial network (GAN), when the discriminator is optimal the generator's objective becomes $2D_{JS}(p_{\text{data}}\Vert p_G)-\log4$ — exactly this interpretation. Also, $\sqrt{D_{JS}}$ is a true distance (metric) that even satisfies the triangle inequality.
` },
    },
    probs: [
      // u03
      { q: R`Find the entropy, in bits, of a fair die (6 faces).`,
        sol: R`It is the uniform distribution, so $H=\log_26\approx2.585$ bits.` },
      { q: R`What is the entropy (in bits) of a coin with heads probability $0.9$? (3 decimal places)`,
        sol: R`$-0.9\log_20.9-0.1\log_20.1=0.9(0.152)+0.1(3.322)\approx0.137+0.332=0.469$.` },
      { q: R`Which is **not** a reason for defining information as $h(x)=-\log p(x)$?`,
        choices: [R`The rarer an event, the more information it should carry`, R`The information of independent events should add up`, R`A certain event should carry zero information`, R`Information must be convex in the probability so that KL becomes a distance`],
        sol: R`The first three are the properties that pin down $-\log$. KL is never a distance (symmetry, triangle inequality) in any case.` },
      { q: R`If $p(x,y)$ is $p(0,0)=\tfrac12$, $p(0,1)=\tfrac14$, $p(1,0)=0$, $p(1,1)=\tfrac14$, what is $H(X,Y)$ (in bits)?`,
        sol: R`$-\tfrac12\log_2\tfrac12-2\cdot\tfrac14\log_2\tfrac14=\tfrac12+1=1.5$ bits.` },
      { q: R`For the distribution above, what is the entropy $H(X)$ of the marginal of $X$ (bits, 3 decimal places)?`,
        sol: R`$p_X(0)=\tfrac12+\tfrac14=\tfrac34$, $p_X(1)=0+\tfrac14=\tfrac14$. $H(X)=-\tfrac34\log_2\tfrac34-\tfrac14\log_2\tfrac14\approx0.311+0.5=0.811$.` },
      { q: R`For $p=\operatorname{Bern}(\tfrac12)$ and $q=\operatorname{Bern}(\tfrac14)$, what is $\KL(p\Vert q)$ (natural logarithm, 4 decimal places)?`,
        sol: R`$\tfrac12\ln\frac{1/2}{1/4}+\tfrac12\ln\frac{1/2}{3/4}=\tfrac12\ln2+\tfrac12\ln\tfrac23=\tfrac12\ln\tfrac43\approx0.1438$.` },
      { q: R`For the same two distributions, what is $\KL(q\Vert p)$ (natural logarithm)?`,
        sol: R`$\tfrac14\ln\frac{1/4}{1/2}+\tfrac34\ln\frac{3/4}{1/2}=-\tfrac14\ln2+\tfrac34\ln\tfrac32\approx-0.1733+0.3041=0.1308$. It differs from $\KL(p\Vert q)$.` },
      { q: R`In the proof of Theorem 1, to which function is Jensen's inequality applied, and what property does it have?`,
        choices: [R`$\log$, convex`, R`$-\log$, convex`, R`$x^2$, convex`, R`$e^x$, concave`],
        sol: R`$\sum p(x)\big[-\log\frac{q}{p}\big]\ge-\log\sum p\frac qp$. Since $-\log$ is (strictly) convex, $\E[\varphi(Z)]\ge\varphi(\E Z)$.` },
      { q: R`If there is a point in the support of $p$ where $q(x)=0$, what is $\KL(p\Vert q)$?`,
        choices: [R`0`, R`negative`, R`$+\infty$`, R`not defined, so it cannot be computed`],
        sol: R`By the convention $b\log\frac b0=\infty$ ($b>0$), it is $+\infty$. A model that assigns probability 0 to an event that actually happens receives an infinite penalty.` },
      { q: R`If $X$ and $Y$ are independent, what is $I(X;Y)$?`,
        sol: R`If $p(x,y)=p(x)p(y)$, then $\log\frac{p(x,y)}{p(x)p(y)}=0$. This is the equality condition of Theorem 1.` },
      { q: R`For the distribution of the §3.2 problem, enter $H(Y\mid X)$ (bits, 3 decimal places). ($p(0,0)=\tfrac12,\ p(0,1)=\tfrac14,\ p(1,0)=0,\ p(1,1)=\tfrac14$)`,
        sol: R`When $X=0$ ($\tfrac34$), $Y\mid X=0\sim(\tfrac23,\tfrac13)$ with entropy $\approx0.918$. When $X=1$, $Y=1$ for certain. $H(Y\mid X)=\tfrac34\times0.918\approx0.689$. Check by the chain rule: $H(X,Y)-H(X)=1.5-0.811=0.689$.` },
      { q: R`Which inequality always holds?`,
        choices: [R`$H(X\mid Y)\ge H(X)$`, R`$H(X\mid Y)\le H(X)$`, R`$I(X;Y)\le0$`, R`$H(X,Y)\le H(X\mid Y)$`],
        sol: R`$I(X;Y)=H(X)-H(X\mid Y)\ge0$. Conditioning reduces entropy (on average).` },
      { q: R`With a one-hot label $p=(0,1,0)$ and model prediction $q=(0.2,0.5,0.3)$, what is the cross-entropy $H_p(q)$ (natural logarithm)?`,
        sol: R`$H_p(q)=-\sum p_k\log q_k=-\log0.5=\ln2$. With a one-hot label, only $-\log$ of the probability of the correct class remains.` },
      { q: R`For a fixed $p$, minimizing $H_p(q)$ over $q$ is the same as minimizing what?`,
        choices: [R`$H(q)$`, R`$\KL(q\Vert p)$`, R`$\KL(p\Vert q)$`, R`$I(p;q)$`],
        sol: R`$H_p(q)=H(p)+\KL(p\Vert q)$ and $H(p)$ does not depend on $q$. The minimum is $H(p)$, at $q=p$.` },
      { q: R`For discrete distributions $p,q$, prove that $\KL(p\Vert q)\ge0$ with equality only when $p=q$ (Theorem 1).`,
        sol: R`
Let $E=\{x:p(x)>0\}$. If $q(x)=0$ for some $x\in E$, then $\KL=\infty\ge0$, so assume $q>0$ on $E$.
$\KL(p\Vert q)=\sum_{x\in E}p(x)\big[-\log\frac{q(x)}{p(x)}\big]$. Since $-\log$ is strictly convex and $\{p(x)\}_{x\in E}$ is a probability distribution, Jensen gives
$$\KL(p\Vert q)\ge-\log\sum_{x\in E}p(x)\frac{q(x)}{p(x)}=-\log\sum_{x\in E}q(x)\ge-\log1=0.$$
**Equality.** The second inequality is an equality when $\sum_Eq=1$, and the first (by strict convexity) when $q(x)/p(x)$ is a constant $c$ on $E$. Then $1=\sum_Eq=c\sum_Ep=c$, so $q=p$ on $E$, and outside $E$ the total of $q$ is $1-\sum_Eq=0$, so $q=0=p$. Conversely, if $p=q$, every term is $\log1=0$.`,
        rubric: R`
- Introducing $E$ and handling the case $q=0$ — 2 pts
- Applying Jensen (stating the function and the weights) — 4 pts
- At least 0 by $\sum_Eq\le1$ — 2 pts
- Equality condition — 2 pts` },
      { q: R`With $I(X;Y)$ defined as $\KL(p(x,y)\Vert p(x)p(y))$, show that $I(X;Y)=H(Y)-H(Y\mid X)$, and conclude $H(Y\mid X)\le H(Y)$.`,
        sol: R`
Since $p(x,y)=p(y\mid x)p(x)$, $\frac{p(x,y)}{p(x)p(y)}=\frac{p(y\mid x)}{p(y)}$.
$$I(X;Y)=\sum_{x,y}p(x,y)\log p(y\mid x)-\sum_{x,y}p(x,y)\log p(y).$$
The first sum is $-H(Y\mid X)$. The second is $\sum_y\big(\sum_xp(x,y)\big)\log p(y)=\sum_yp(y)\log p(y)=-H(Y)$. Hence $I=-H(Y\mid X)+H(Y)$.
$I$ is a KL, so by Theorem 1 $I\ge0$, i.e., $H(Y\mid X)\le H(Y)$.`,
        rubric: R`
- Turning the ratio into a conditional probability — 3 pts
- Getting $-H(Y)$ by marginalizing — 3 pts
- Conclusion citing Theorem 1 — 4 pts` },
      // more-03
      { q: R`**(Problem Set 1, Problem 1)** Let $p$ and $q$ be two probability distributions on a common probability space. The Jensen–Shannon divergence is defined by $D_{JS}(p\Vert q)=\frac12D_{KL}(p\Vert m)+\frac12D_{KL}(q\Vert m)$, where $m=\frac12(p+q)$. Prove the following properties of the Jensen–Shannon divergence:
(i) Non-negativity: $D_{JS}(p\Vert q)\ge0$.
(ii) Identity of indiscernibles (non-degeneracy): $D_{JS}(p\Vert q)=0\iff p=q$.
(iii) Symmetry: $D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$.`,
        sol: R`
**Preliminaries.** $m=\frac12(p+q)$ is non-negative with sum (integral) 1, so it is a probability distribution. If $p(x)>0$ then $m(x)\ge\frac12p(x)>0$, so $D_{KL}(p\Vert m)$ is well defined and finite (likewise for $q$). We use the non-negativity of the KL divergence and its equality condition (Theorem 1: $D_{KL}(a\Vert b)\ge0$, equality $\iff a=b$).

**(i)** Since $D_{KL}(p\Vert m)\ge0$ and $D_{KL}(q\Vert m)\ge0$, $D_{JS}=\frac12(\text{non-negative})+\frac12(\text{non-negative})\ge0$.

**(ii)** ($\Leftarrow$) If $p=q$, then $m=p=q$, so both KLs are $D_{KL}(p\Vert p)=0$ and $D_{JS}=0$.
($\Rightarrow$) If $D_{JS}=0$, the sum of two non-negative terms is 0, so $D_{KL}(p\Vert m)=0$ and $D_{KL}(q\Vert m)=0$. By the equality condition of Theorem 1, $p=m$ and $q=m$, hence $p=q$.

**(iii)** $m$ is symmetric in $p,q$ ($\frac12(p+q)=\frac12(q+p)$), so $D_{JS}(q\Vert p)=\frac12D_{KL}(q\Vert m)+\frac12D_{KL}(p\Vert m)$, which equals $D_{JS}(p\Vert q)$ by commutativity of addition.`,
        rubric: R`
- Checking that $m$ is a probability distribution and the KL is finite — 1 pt
- (i) citing the non-negativity of KL — 2 pts
- (ii) both directions, especially “a sum of non-negative terms equal to 0 forces each to be 0” — 3 pts
- (ii) using the equality condition of Theorem 1 — 2 pts
- (iii) the symmetry of $m$ — 2 pts` },
      { q: R`For $p=(1,0)$ and $q=(0,1)$ (two distributions with disjoint supports), find $D_{JS}(p\Vert q)$ in natural logarithms. (Both KLs are infinite.)`,
        sol: R`$m=(\tfrac12,\tfrac12)$. $D_{KL}(p\Vert m)=1\cdot\log\frac1{1/2}=\log2$ and $D_{KL}(q\Vert m)=\log2$. Their average is $\log2$ — the maximum of JS.` },
      { q: R`For $p=(\tfrac12,\tfrac12)$ and $q=(1,0)$, what is $D_{JS}(p\Vert q)$ (natural logarithm, 4 decimal places)?`,
        sol: R`$m=(\tfrac34,\tfrac14)$. $D_{KL}(p\Vert m)=\tfrac12\ln\tfrac{1/2}{3/4}+\tfrac12\ln\tfrac{1/2}{1/4}=\tfrac12\ln\tfrac23+\tfrac12\ln2=\tfrac12\ln\tfrac43$. $D_{KL}(q\Vert m)=\ln\tfrac1{3/4}=\ln\tfrac43$. $D_{JS}=\tfrac12\big(\tfrac12+1\big)\ln\tfrac43=\tfrac34\ln\tfrac43\approx0.2158$. Here $D_{KL}(p\Vert q)=\infty$.` },
      { q: R`Show that $D_{JS}(p\Vert q)\le\log2$, and that equality holds if and only if “$p(x)q(x)=0$ for all $x$”.`,
        sol: R`
Where $p(x)>0$, $m(x)=\frac{p(x)+q(x)}2\ge\frac{p(x)}2$, so $\log\frac{p(x)}{m(x)}\le\log2$, with equality only when $q(x)=0$. Therefore
$$D_{KL}(p\Vert m)=\sum_{p(x)>0}p(x)\log\frac{p(x)}{m(x)}\le\log2\sum_{p(x)>0}p(x)=\log2,$$
with equality $\iff$ $q(x)=0$ at every $x$ with $p(x)>0$. By the same argument $D_{KL}(q\Vert m)\le\log2$, with equality $\iff$ $p(x)=0$ at every $x$ with $q(x)>0$. Averaging gives $D_{JS}\le\log2$, with equality when both conditions hold, i.e., $p(x)q(x)=0$ for all $x$ (the two conditions are in fact the same statement).`,
        rubric: R`
- Observing $p/m\le2$ with its equality condition — 4 pts
- Upper bounds on the two KLs — 3 pts
- The iff condition for equality — 3 pts` },
      { q: R`Show that $D_{JS}(p\Vert q)=H(m)-\frac12\big(H(p)+H(q)\big)$, and use the concavity of entropy to prove $D_{JS}\ge0$ again.`,
        sol: R`
$D_{KL}(p\Vert m)=\sum p\log p-\sum p\log m=-H(p)-\sum_xp(x)\log m(x)$, and likewise for $q$. Averaging,
$$D_{JS}=-\frac{H(p)+H(q)}2-\sum_x\frac{p(x)+q(x)}2\log m(x)=-\frac{H(p)+H(q)}2-\sum_xm(x)\log m(x)=H(m)-\frac{H(p)+H(q)}2.$$
The function $\phi(t)=-t\log t$ has $\phi''(t)=-1/t<0$, so it is concave and $\phi\big(\frac{a+b}2\big)\ge\frac{\phi(a)+\phi(b)}2$. Putting $a=p(x)$, $b=q(x)$ for each $x$ and summing gives $H(m)\ge\frac{H(p)+H(q)}2$, i.e., $D_{JS}\ge0$.`,
        rubric: R`
- Splitting each KL into an entropy and a cross term — 3 pts
- Combining the cross terms into $H(m)$ — 3 pts
- Concavity of $-t\log t$ and the componentwise inequality — 4 pts` },
      { q: R`Which statement about the JS divergence is **false**?`,
        choices: [R`$D_{JS}(p\Vert q)=D_{JS}(q\Vert p)$`, R`$0\le D_{JS}\le\log2$`, R`$D_{JS}$ itself is a distance (metric) satisfying the triangle inequality`, R`It is finite even when the supports of $p$ and $q$ differ`],
        sol: R`It is $\sqrt{D_{JS}}$ that satisfies the triangle inequality. $D_{JS}$ itself does not (for the same reason that a squared distance breaks the triangle inequality).` },
      { q: R`Let $Z\sim\operatorname{Bern}(\tfrac12)$, and let $X\sim p$ if $Z=0$ and $X\sim q$ if $Z=1$. Show that $I(X;Z)=D_{JS}(p\Vert q)$, and obtain $D_{JS}\le\log2$ from it.`,
        sol: R`
The marginal of $X$ is $P(X=x)=\frac12p(x)+\frac12q(x)=m(x)$.
$I(X;Z)=\sum_zP(Z=z)\,D_{KL}\big(P_{X\mid Z=z}\Vert P_X\big)$ (the definition $\sum_{x,z}p(x,z)\log\frac{p(x\mid z)}{p(x)}$ grouped by $z$), so
$$I(X;Z)=\frac12D_{KL}(p\Vert m)+\frac12D_{KL}(q\Vert m)=D_{JS}(p\Vert q).$$
$I(X;Z)=H(Z)-H(Z\mid X)\le H(Z)=\log2$ (conditional entropy $\ge0$). Hence $D_{JS}\le\log2$.`,
        rubric: R`
- The marginal of $X$ is $m$ — 2 pts
- Writing the mutual information as an average of conditional KLs — 4 pts
- $H(Z)=\log2$ and the upper bound — 4 pts` },
      { q: R`What is the entropy (in bits) of the distribution $(\tfrac12,\tfrac14,\tfrac18,\tfrac18)$?`,
        sol: R`$\tfrac12(1)+\tfrac14(2)+\tfrac18(3)+\tfrac18(3)=1.75$. It equals the average number of questions “the first?” → “the second?” → “the third?”.` },
      { q: R`For a discrete random variable with $K$ values, prove with the non-negativity of KL that $H(X)\le\log K$, with equality only for the uniform distribution.`,
        sol: R`
Let $u(x)=1/K$ (uniform). $D_{KL}(p\Vert u)=\sum_xp(x)\log\frac{p(x)}{1/K}=\sum_xp(x)\log p(x)+\log K\sum_xp(x)=-H(X)+\log K$.
By Theorem 1, $D_{KL}(p\Vert u)\ge0$, so $H(X)\le\log K$, with equality $\iff p=u$.`,
        rubric: R`
- Expanding the KL against the uniform distribution — 5 pts
- Non-negativity and the equality condition — 5 pts` },
      { q: R`For a fixed $p$, show that the minimum of the cross-entropy $H_p(q)$ over $q$ is $H(p)$, attained only at $q=p$.`,
        sol: R`
$H_p(q)=H(p)+D_{KL}(p\Vert q)$ (expand: $-\sum p\log q=-\sum p\log p+\sum p\log\frac pq$). $H(p)$ does not depend on $q$, and $D_{KL}(p\Vert q)\ge0$ with equality $\iff q=p$. Hence $\min_qH_p(q)=H(p)$, and the only minimizer is $q=p$. (Reducing the cross-entropy of a classifier moves its predicted distribution toward the true distribution.)`,
        rubric: R`
- The decomposition $H_p(q)=H(p)+\mathrm{KL}$ — 5 pts
- Minimum value and minimizer from non-negativity and equality — 5 pts` },
      { q: R`With $p(0,0)=p(1,1)=0.4$ and $p(0,1)=p(1,0)=0.1$, what is $I(X;Y)$ (bits, 4 decimal places)?`,
        sol: R`Both marginals are $(\tfrac12,\tfrac12)$. $I=\sum p(x,y)\log_2\frac{p(x,y)}{1/4}=2(0.4)\log_21.6+2(0.1)\log_20.4\approx0.5425-0.2644=0.2781$.` },
      { q: R`Show that $H(X,Y)\le H(X)+H(Y)$, with equality only when $X,Y$ are independent.`,
        sol: R`
$H(X)+H(Y)-H(X,Y)=I(X;Y)=D_{KL}\big(p(x,y)\Vert p(x)p(y)\big)\ge0$ (Theorem 1), with equality $\iff p(x,y)=p(x)p(y)$ for all $x,y$, i.e., independence.`,
        rubric: R`
- The third expression of mutual information — 5 pts
- KL non-negativity and the equality condition (independence) — 5 pts` },
      // quizprep-a
      { q: R`For two discrete distributions with $p(x)\gt0$ and $q(x)\gt0$ for all $x$, define the Jeffreys divergence $J(p,q)=D_{KL}(p\Vert q)+D_{KL}(q\Vert p)$.
1. Show that $J(p,q)=\sum_x\big(p(x)-q(x)\big)\log\dfrac{p(x)}{q(x)}$.
2. Prove (i) $J\ge0$, (ii) $J=0\iff p=q$, (iii) $J(p,q)=J(q,p)$ using the properties of KL.
3. Prove (i) and (ii) again without the properties of KL, by showing directly that **each term** of the expression in 1 is non-negative.
4. Show what happens when the supports differ using $p=(1,0)$, $q=(\frac12,\frac12)$, and compare with the Jensen–Shannon divergence of the same pair.`,
        sol: R`
**1.** Since $D_{KL}(q\Vert p)=\sum_xq\log\frac qp=-\sum_xq\log\frac pq$, $J=\sum_xp\log\frac pq-\sum_xq\log\frac pq=\sum_x(p-q)\log\frac pq$.
**2.** (i) By Gibbs' inequality both KLs are $\ge0$. (ii) ($\Leftarrow$) If $p=q$ both KLs are 0. ($\Rightarrow$) If a sum of two non-negative numbers is 0, each is 0, and by the equality condition of $D_{KL}(p\Vert q)=0$, $p=q$. (iii) The definition is the sum of the two KLs, so swapping the order gives the same.
**3.** Since $\log$ is increasing, if $p(x)\gt q(x)$ then $p-q\gt0$ and $\log\frac pq\gt0$; if $p(x)\lt q(x)$ both are negative; if equal, 0. In every case each term $(p-q)\log\frac pq\ge0$, and it is 0 only when $p(x)=q(x)$. Hence $J\ge0$, and if $J=0$ every term is 0, so $p(x)=q(x)$ for all $x$.
**4.** $D_{KL}(p\Vert q)=1\cdot\log\frac1{1/2}=\log2$, but $D_{KL}(q\Vert p)$ contains $\frac12\log\frac{1/2}0=\infty$, so $J=\infty$. On the other hand, with $m=(\frac34,\frac14)$,
$$D_{JS}=\tfrac12\log\tfrac43+\tfrac12\cdot\tfrac12\Big(\log\tfrac23+\log2\Big)=\tfrac34\log\tfrac43\approx0.2158\ (\le\log2).$$
JS compares with the average distribution $m$, whose denominator never becomes 0, so it is finite even when the supports differ (Preliminary 2 of Problem Set 1, Problem 1).`,
        rubric: R`
- Rewriting the expression — 2 pts
- The three properties (citing the equality condition) — 3 pts
- The termwise sign argument — 3 pts
- The example with different supports and the JS value — 2 pts` },
      { q: R`For $\pi\in(0,1)$ define $m_\pi=\pi p+(1-\pi)q$ and $D_\pi(p,q)=\pi D_{KL}(p\Vert m_\pi)+(1-\pi)D_{KL}(q\Vert m_\pi)$ ($\pi=\frac12$ gives the JS divergence).
1. Show that $m_\pi$ is a probability distribution and that $D_\pi$ is finite.
2. Prove that $D_\pi\ge0$ and $D_\pi(p,q)=0\iff p=q$.
3. Show that $D_\pi(p,q)=D_{1-\pi}(q,p)$, and show with $p=(1,0)$, $q=(\frac12,\frac12)$, $\pi=\frac14$ that in general $D_\pi(p,q)\ne D_\pi(q,p)$ when $\pi\ne\frac12$.
4. Prove $D_\pi(p,q)\le h(\pi):=-\pi\log\pi-(1-\pi)\log(1-\pi)$.`,
        sol: R`
**1.** $m_\pi\ge0$ and $\sum_xm_\pi=\pi+(1-\pi)=1$. If $p(x)\gt0$ then $m_\pi(x)\ge\pi p(x)\gt0$, so $\frac{p(x)}{m_\pi(x)}\le\frac1\pi$ and hence $D_{KL}(p\Vert m_\pi)\le\log\frac1\pi\lt\infty$. In the same way, $D_{KL}(q\Vert m_\pi)\le\log\frac1{1-\pi}$.
**2.** Both KLs are $\ge0$ and the weights are positive, so $D_\pi\ge0$. If $D_\pi=0$, the two non-negative terms multiplied by positive weights are both 0, so $p=m_\pi$ and $q=m_\pi$ (the equality condition of Gibbs' inequality), hence $p=q$. Conversely, if $p=q$ then $m_\pi=p$ and it is 0.
**3.** The average distribution of $D_{1-\pi}(q,p)$ is $(1-\pi)q+\pi p=m_\pi$, the same, and so are the two terms $(1-\pi)D_{KL}(q\Vert m_\pi)+\pi D_{KL}(p\Vert m_\pi)$.
Example: with $m=\frac14p+\frac34q=(\frac58,\frac38)$, $D_{1/4}(p,q)=\frac14\log\frac85+\frac34\cdot\frac12\log\frac{16}{15}\approx0.1417$. In the other direction, with $m'=\frac14q+\frac34p=(\frac78,\frac18)$, $D_{1/4}(q,p)=\frac14\cdot\frac12\log\frac{16}7+\frac34\log\frac87\approx0.2035$. They differ.
**4.** A weighted sum of the two inequalities of 1 gives
$$D_\pi\le\pi\log\frac1\pi+(1-\pi)\log\frac1{1-\pi}=h(\pi).$$
With $\pi=\frac12$, $h=\log2$ — the upper bound of the JS divergence.`,
        rubric: R`
- Probability distribution and finiteness ($m_\pi\ge\pi p$) — 2 pts
- Non-negativity and identity (both directions) — 3 pts
- The symmetry relation and the counterexample computation — 2 pts
- The upper bound — 3 pts` },
      { q: R`The KL divergence between normal distributions.
1. Derive $D_{KL}\big(\N(\mu_1,\sigma^2)\,\Vert\,\N(\mu_2,\sigma^2)\big)=\dfrac{(\mu_1-\mu_2)^2}{2\sigma^2}$.
2. Check that the KL is symmetric in the case of 1.
3. Derive $D_{KL}\big(\N(0,1)\,\Vert\,\N(0,s^2)\big)=\frac12\Big(\frac1{s^2}-1+\log s^2\Big)$, and use $\log t\le t-1$ (equality $\iff t=1$) to show that it is $\ge0$ and 0 only when $s^2=1$.
4. For $s^2=4$, compute the value of 3 and the opposite direction $D_{KL}\big(\N(0,4)\Vert\N(0,1)\big)$ to show that the KL is not symmetric in general.`,
        sol: R`
**1.** The normalizing constants are equal and cancel, so
$$\log\frac{p(x)}{q(x)}=\frac{(x-\mu_2)^2-(x-\mu_1)^2}{2\sigma^2}=\frac{(\mu_1-\mu_2)(2x-\mu_1-\mu_2)}{2\sigma^2}.$$
Under $x\sim p$, $\E x=\mu_1$, so the expectation is $\frac{(\mu_1-\mu_2)(\mu_1-\mu_2)}{2\sigma^2}$.
**2.** $(\mu_1-\mu_2)^2=(\mu_2-\mu_1)^2$, so swapping the direction gives the same (a special property that holds only when the variances are equal).
**3.** $\log p-\log q=-\frac{x^2}2+\frac{x^2}{2s^2}+\frac12\log s^2$ ($\log\sqrt{2\pi}$ cancels). Since $\E_px^2=1$, $D_{KL}=\frac12\big(\frac1{s^2}-1+\log s^2\big)$. With $t=1/s^2$ this is $\frac12(t-1-\log t)\ge0$, with equality only when $t=1$, i.e., $s^2=1$.
**4.** $s^2=4$: $\frac12(\frac14-1+\log4)\approx0.3181$. The opposite direction, by the same computation, is $\frac12(4-1+\log\frac14)\approx0.8069$. They differ, so the KL is not symmetric.`,
        rubric: R`
- Derivation when only the means differ — 4 pts
- Checking symmetry — 1 pt
- Derivation when only the variances differ, with non-negativity and equality — 3 pts
- Numerical comparison of the two directions — 2 pts` },
      { q: R`The joint distribution $p(x,y)$ of discrete random variables $X,Y$ with marginals $p(x),p(y)$.
1. Show that $I(X;Y)=H(X)-H(X\mid Y)$ equals $D_{KL}\big(p(x,y)\,\Vert\,p(x)p(y)\big)$.
2. Show that $I(X;Y)\ge0$ with equality only when $X,Y$ are independent, and conclude $H(X\mid Y)\le H(X)$.
3. With $p(0,0)=\frac12$, $p(0,1)=\frac14$, $p(1,0)=0$, $p(1,1)=\frac14$, find $I(X;Y)$ in bits.`,
        sol: R`
**1.** The sums run only over cells with $p(x,y)\gt0$ (where $p(x)p(y)\gt0$). Using $p(x)=\sum_yp(x,y)$,
$$H(X)-H(X\mid Y)=-\sum_{x,y}p(x,y)\log p(x)+\sum_{x,y}p(x,y)\log p(x\mid y)=\sum_{x,y}p(x,y)\log\frac{p(x,y)}{p(x)p(y)},$$
($p(x\mid y)=p(x,y)/p(y)$) — the KL from the joint distribution to the product distribution.
**2.** By Gibbs' inequality it is $\ge0$, with equality when the two distributions are equal, i.e., $p(x,y)=p(x)p(y)$ for all $(x,y)$ (independence). Hence $H(X\mid Y)=H(X)-I(X;Y)\le H(X)$: knowing the condition reduces the uncertainty or leaves it the same.
**3.** $p_X=(\frac34,\frac14)$, $p_Y=(\frac12,\frac12)$.
$$I=\tfrac12\log_2\tfrac{1/2}{3/8}+\tfrac14\log_2\tfrac{1/4}{3/8}+\tfrac14\log_2\tfrac{1/4}{1/8}\approx0.2075-0.1462+0.25=0.3113\text{ bits}.$$
Check: $H(Y)=1$ and $H(Y\mid X)=\frac34h_2(\frac23)\approx0.6887$, so $I=1-0.6887=0.3113$.`,
        rubric: R`
- Rewriting into KL form (with care about the range of the sums) — 4 pts
- Non-negativity, equality, and the conditional-entropy conclusion — 3 pts
- Numerical computation — 3 pts` },
    ],
  };
})();
