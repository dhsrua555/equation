/* English text — 02 Probability, Likelihood, Bayesian Inference (W1 Wed slides 14–34, W2 Mon notes, Problem Set 1 Problem 2). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    betapost: R`Seven heads in 10 tosses. Multiplying the prior (“probably fair”, high near 0.5) by the likelihood and normalizing gives the posterior $\operatorname{Beta}(9,5)$. The peak of the posterior (MAP, $\approx0.667$) is pulled slightly from the peak of the likelihood (MLE, $0.7$) toward the prior (0.5). (The likelihood curve is rescaled only to show its shape.)`,
    sellers: R`The posterior of seller 1, with 100 reviews, is concentrated narrowly near 0.89, while the posterior of seller 2, with 2 reviews, $3\theta^2$, is spread out widely. Seller 2's MLE is 1, but it is quite possible that the true value is near 0.5. Comparing the two gives $P(\theta_1>\theta_2\mid D)\approx0.713$.`,
    shrinkmse: R`With $n=4$ and $\tau^2=0.5$. The MSE of the sample mean is $1/n=0.25$ regardless of $\theta$. The MSE of MAP $\hat\theta=a\bar X$ ($a=\tfrac23$) is bias² $(1-a)^2\theta^2$ + variance $a^2/n$, a parabola in $\theta$. If the true value is near 0 ($\theta^2\lt2\tau^2+1/n=1.25$) MAP wins; far away it loses because of its bias.`,
  });
  EM.en.ch[2] = {
    title: 'Probability, Likelihood, Bayesian Inference',
    fig: R`The Beta posterior narrowing as a coin with heads probability 0.7 is tossed more and more`,
    tagline: R`Maximize the likelihood and you get the MLE; multiply by the prior and maximize and you get the MAP. After taking logs, MAP becomes “data fit + regularization”.`,
    summary: R`We build probability, the language for handling uncertainty with numbers, from its axioms, and compare two views of estimating parameters from data. **Maximum likelihood (MLE)** picks “the parameter that makes the observed data most plausible”, while **Bayesian inference** updates a belief about the parameter (the prior) with the data to obtain the posterior. **MAP**, the peak of the posterior, is the same as minimizing “data-fit loss + regularization”, which shows where regularization in machine learning comes from in probability. In class we worked the cough–cold, coin, and Amazon-seller examples. The last section works Problem 2 of Problem Set 1 (the MAP of a Gaussian mean = ridge, the shrinkage factor, the bias–variance decomposition) to the end.`,
    goals: [
      R`Prove complements, inclusion–exclusion, and monotonicity from the axioms of probability`,
      R`Compute posterior probabilities with the law of total probability and Bayes' theorem, and tell the direction of conditioning apart`,
      R`Use the properties of expectation and variance (linearity, the variance of a sum under independence, $\Var(\bar X)=\sigma^2/n$)`,
      R`Derive the MLE for Bernoulli and Gaussian data through the log-likelihood`,
      R`Find the posterior, the MAP, and the posterior mean for a Beta prior and a Bernoulli likelihood`,
      R`Show that MAP minimizes “negative log-likelihood + negative log-prior”, and explain that a Gaussian prior becomes $L_2$ regularization`,
      R`Prove MSE = bias² + variance and compute the bias, variance, and MSE of a shrinkage estimator`,
    ],
    secTitles: { '2.1': 'Axioms', '2.2': 'Conditional · Bayes', '2.3': 'Random variables', '2.4': 'MLE', '2.5': 'Bayesian inference', '2.6': 'MAP', '2.7': 'Amazon example', '2.8': 'Gaussian MAP · bias–variance' },
    secs: {
      '2.1': { title: 'Axioms of Probability and Basic Properties', body: R`
:::idea In plain words
Probability measures “how much of the whole”, like an **area**. We set the area of the set of all possible outcomes (the sample space $\Omega$) to 1 and call the area of an event $E$ (a collection of outcomes) $P(E)$. We take as **axioms** the three things any area obviously satisfies — it is never negative, the whole is 1, and the areas of non-overlapping pieces add up — and prove everything else from these three.
:::

A rule that assigns a number $P(E)$ to each event $E$ of the sample space $\Omega$ is a probability if it satisfies the following three axioms.

:::def Axioms of probability
1. $0\le P(E)\le1$
2. $P(\Omega)=1$
3. For a sequence of mutually exclusive events $E_1,E_2,\dots$ ($E_i\cap E_j=\varnothing$, $i\ne j$), $P\big(\bigcup_iE_i\big)=\sum_iP(E_i)$
:::

Example: rolling one die, $\Omega=\{1,\dots,6\}$ and each face has probability $\tfrac16$. The event “even” $E=\{2,4,6\}$ is the union of three disjoint pieces, so by axiom 3, $P(E)=\tfrac36$.

The following properties all follow from the axioms alone.

:::key Basic properties of probability
$$P(\varnothing)=0,\qquad P(E^c)=1-P(E),\qquad E\subset F\Rightarrow P(E)\le P(F)$$
$$P(E\cup F)=P(E)+P(F)-P(E\cap F)$$
For an increasing sequence of events $E_1\subset E_2\subset\cdots$, $P\big(\bigcup_nE_n\big)=\lim_nP(E_n)$; for a decreasing sequence, $P\big(\bigcap_nE_n\big)=\lim_nP(E_n)$ (continuity of probability).
:::

### Proving them from the axioms

- **Complement.** $E$ and $E^c$ are disjoint with union $\Omega$, so axioms 2 and 3 give $1=P(\Omega)=P(E)+P(E^c)$. In particular, $E=\Omega$ gives $P(\varnothing)=0$.
- **Monotonicity.** If $E\subset F$, then $F=E\cup(F\setminus E)$ (disjoint), so $P(F)=P(E)+P(F\setminus E)\ge P(E)$ (axiom 1).
- **Inclusion–exclusion.** $E\cup F=E\cup(F\setminus E)$ (disjoint) and $F=(E\cap F)\cup(F\setminus E)$ (disjoint). Axiom 3 applied to both gives $P(E\cup F)=P(E)+P(F\setminus E)$ and $P(F\setminus E)=P(F)-P(E\cap F)$. Substitute and we are done.
- **Continuity.** For an increasing sequence, the “newly added parts” $D_1=E_1$, $D_n=E_n\setminus E_{n-1}$ are disjoint, with $\bigcup E_n=\bigcup D_n$ and $E_n=D_1\cup\dots\cup D_n$. By axiom 3, $P(\bigcup E_n)=\sum_{k=1}^\infty P(D_k)=\lim_n\sum_{k=1}^nP(D_k)=\lim_nP(E_n)$. The decreasing case becomes the increasing one by taking complements.

:::tip Split into disjoint pieces
Almost every proof is “split the event into disjoint pieces, then use axiom 3”. For example, $E\cup F=E\cup(F\setminus E)$ and $F=(E\cap F)\cup(F\setminus E)$.
:::

:::ex Example 1 — Two dice
Rolling two dice, what is the probability that at least one shows 6?
---
The complement “neither is 6” has probability $\tfrac56\cdot\tfrac56=\tfrac{25}{36}$, so the answer is $1-\tfrac{25}{36}=\tfrac{11}{36}\approx0.306$. By inclusion–exclusion also $\tfrac16+\tfrac16-\tfrac1{36}=\tfrac{11}{36}$. Simply adding $\tfrac16+\tfrac16$ counts “both 6” twice.
:::

### Going deeper: why require countable sums?

Requiring axiom 3 for **countably infinitely many** events, not just finitely many, is what makes limits (continuity) possible. Computations such as $P(X\le x)=\lim P(X\le x+1/n)$ for a continuous random variable all rely on it. Also, we cannot assign a probability to every subset (paradoxes arise on intervals of real numbers), so the rigorous theory restricts the collection of events to a $\sigma$-algebra. In this course it is enough to think that “every event we can think of has a probability”.
` },
      '2.2': { title: 'Conditional Probability, the Law of Total Probability, and Bayes’ Theorem', body: R`
:::idea In plain words
The **conditional probability** $P(F\mid E)$ is “the probability of $F$ after we learn that $E$ happened”. Once we know $E$, the world shrinks to $E$, so we measure again the fraction of $E$ that $F$ occupies: $P(E\cap F)/P(E)$.
**Bayes' theorem** is the formula that reverses the direction of conditioning. What the doctor knows is “the probability of coughing given a cold”, but what the patient needs is “the probability of a cold given a cough”.
:::

When $P(E)>0$, the **conditional probability** is $P(F\mid E)=\dfrac{P(E\cap F)}{P(E)}$. Multiplying both sides by $P(E)$ gives the **multiplication rule** $P(E\cap F)=P(E)P(F\mid E)$. If $E_1,\dots,E_N$ ($N$ may be infinite) form a partition of $\Omega$ (disjoint, with union $\Omega$), then

:::key Bayes' theorem
$$P(F)=\sum_{i}P(E_i)P(F\mid E_i)\qquad(\text{law of total probability})$$
$$P(E_i\mid F)=\frac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$$
:::

**Proof.** $F=\bigcup_i(F\cap E_i)$ and the pieces are disjoint, so axiom 3 and the multiplication rule give $P(F)=\sum_iP(F\cap E_i)=\sum_iP(E_i)P(F\mid E_i)$. By definition $P(E_i\mid F)=P(E_i\cap F)/P(F)=P(F\mid E_i)P(E_i)/P(F)$; put the law of total probability in the denominator.

The interpretation from the lecture notes: it is the formula that updates the probability of $E_i$ **once $F$ is observed**. $P(F\mid E_i)$ is the **likelihood**, $P(E_i)$ the **prior probability**, the denominator $P(F)$ the **evidence**, and the left side the **posterior probability**.

**Independence.** If $P(E\cap F)=P(E)P(F)$, the events are independent, and then $P(F\mid E)=P(F)$. Tossing two coins with $E$ = the first is heads and $F$ = the second is heads, $P(E\cap F)=\tfrac14=P(E)P(F)$ and $P(F\mid E)=\tfrac12$.

:::warn Independent is not the same as disjoint
Two disjoint events ($E\cap F=\varnothing$) with positive probabilities are **never independent**. Knowing that $E$ happened gives the strong information that $F$ certainly did not: $P(F\mid E)=0\ne P(F)$.
:::

:::ex Example 2 — Cough and cold (lecture notes)
$Y=1$ means having the disease (a cold) and $X=1$ means coughing. Prior $P(Y=1)=0.1$, likelihoods $P(X=1\mid Y=1)=0.8$ and $P(X=1\mid Y=0)=0.2$. What is the probability of having the disease given a cough, $P(Y=1\mid X=1)$?
---
Total probability: $P(X=1)=0.8\times0.1+0.2\times0.9=0.08+0.18=0.26$.
Bayes: $P(Y=1\mid X=1)=\dfrac{0.08}{0.26}\approx0.3077$.
“The probability of coughing given a cold” is 0.8, but “the probability of a cold given a cough” is about 31%, because the prior 0.1 is small.
:::

**Counting people.** Suppose there are 1000 people: 80 of the 100 with a cold cough, and 180 of the 900 healthy people cough. Of the 260 who cough, 80 have a cold, i.e., $80/260\approx31\%$. Bayes' theorem is this table written as a formula.

| | Cough $X=1$ | No cough $X=0$ | Total |
|---|---|---|---|
| Cold $Y=1$ | 80 | 20 | 100 |
| Healthy $Y=0$ | 180 | 720 | 900 |
| Total | 260 | 740 | 1000 |

From the same table, the probability of a cold given **no** cough is $20/740\approx0.027$, smaller than the prior 0.1.

:::warn The direction of conditioning
$P(X=1\mid Y=1)$ and $P(Y=1\mid X=1)$ are completely different quantities. On an exam, first mark “given what”, then compute. The cancer-screening example of the medical AI course has the same structure[[@med:ch03:2.1b|With prevalence 1%, sensitivity 90%, and a 3% false positive rate, the probability of cancer given a positive test is about 23%.]].
:::

### Going deeper: the odds form and conditional independence

The ratio of the posterior probabilities of two hypotheses is $\dfrac{P(Y=1\mid X)}{P(Y=0\mid X)}=\dfrac{P(X\mid Y=1)}{P(X\mid Y=0)}\cdot\dfrac{P(Y=1)}{P(Y=0)}$ — **posterior odds = likelihood ratio × prior odds**. The evidence $P(X)$ cancels, which makes the computation easy, and taking logs gives the log-odds of logistic regression in Unit 5[[ch05:5.1|Logistic regression models the log-odds (logit) as a linear function.]]. If there are several symptoms $X_1,X_2$ and we assume they are independent given the disease (**conditional independence**), the likelihood ratios multiply — the assumption of the naive Bayes classifier.
` },
      '2.3': { title: 'Random Variables and Distributions', body: R`
:::idea In plain words
A **random variable** is **a rule that attaches a number** to each outcome of a random experiment. “The result of tossing a coin three times” is a symbol like (H,H,T), but “the number of heads” $X$ is the number 2. Once it is a number, we can average it, measure how spread out it is, and draw its graph.
:::

A **random variable** is a function $X:\Omega\to\mathbb R$. Tossing a coin three times and counting the heads, $X(\omega)=2$ when $\omega=(H,H,T)$.

- Cumulative distribution function (CDF) $F(x)=P(X\le x)$, tail function $G(x)=1-F(x)=P(X>x)$
- **Discrete** random variable: probability mass function $p(x_i)=P(X=x_i)$, $F(x)=\sum_{x_i\le x}p(x_i)$
- **Continuous** random variable: there is a probability density function $f$ with $P(X\le x)=\int_{-\infty}^xf(t)\,dt$
- **Parameter**: a value that determines the distribution, such as $p$ of a Bernoulli distribution or $\mu,\sigma^2$ of a normal distribution

For a continuous random variable, $f(x)$ itself is not a probability but a **density** (it can exceed 1). The probability of a single point is $P(X=x)=0$, and the probability of an interval is the area $\int_a^bf$.

:::note Notation
Writing the parameter after a vertical bar, as in $p(x\mid\theta)$, means “the distribution of $x$ when the parameter is $\theta$”. In the Bayesian view, $\theta$ is also treated as a random variable.
:::

### Distributions in this course

| Distribution | Values | Probability (density) | Mean | Variance |
|---|---|---|---|---|
| Bernoulli $\operatorname{Bern}(\theta)$ | $0,1$ | $\theta^x(1-\theta)^{1-x}$ | $\theta$ | $\theta(1-\theta)$ |
| Binomial $\operatorname{Bin}(n,\theta)$ | $0,\dots,n$ | $\binom nx\theta^x(1-\theta)^{n-x}$ | $n\theta$ | $n\theta(1-\theta)$ |
| Poisson $\operatorname{Poi}(\lambda)$ | $0,1,2,\dots$ | $e^{-\lambda}\lambda^x/x!$ | $\lambda$ | $\lambda$ |
| Uniform $U(a,b)$ | $[a,b]$ | $\frac1{b-a}$ | $\frac{a+b}2$ | $\frac{(b-a)^2}{12}$ |
| Normal $\N(\mu,\sigma^2)$ | $\mathbb R$ | $\frac1{\sqrt{2\pi\sigma^2}}e^{-(x-\mu)^2/(2\sigma^2)}$ | $\mu$ | $\sigma^2$ |
| Beta $\operatorname{Beta}(a,b)$ | $[0,1]$ | $\frac{\theta^{a-1}(1-\theta)^{b-1}}{B(a,b)}$ | $\frac a{a+b}$ | $\frac{ab}{(a+b)^2(a+b+1)}$ |

### Expectation and variance

The **expectation** (mean) $\E[X]=\sum_xx\,p(x)$ or $\int xf(x)\,dx$ is the center of mass of the distribution, and the **variance** $\Var(X)=\E[(X-\E X)^2]$ is the mean of the squared deviation from the mean. We collect the properties used again in later units (variance computations for initialization, the variance of SGD, the bias–variance decomposition).

:::key Properties of expectation and variance
- Linearity: $\E[aX+bY+c]=a\E X+b\E Y+c$ (no independence needed)
- $\Var(X)=\E[X^2]-(\E X)^2$, $\ \Var(aX+b)=a^2\Var(X)$
- If $X,Y$ are independent, $\E[XY]=\E X\,\E Y$ and $\Var(X+Y)=\Var X+\Var Y$
- If $X_1,\dots,X_n$ are i.i.d. with variance $\sigma^2$, the sample mean $\bar X=\frac1n\sum X_i$ has $\E\bar X=\E X_1$ and $\Var(\bar X)=\sigma^2/n$
:::

**Key steps of the proof.** $\Var X=\E[X^2-2X\E X+(\E X)^2]=\E X^2-2(\E X)^2+(\E X)^2$ (linearity). $\Var(X+Y)=\Var X+\Var Y+2\Cov(X,Y)$, and $\Cov(X,Y)=\E[XY]-\E X\E Y$ is 0 under independence. For the sample mean, $\Var(\frac1n\sum X_i)=\frac1{n^2}\sum\Var X_i=\frac{n\sigma^2}{n^2}$.

:::ex Example 3 — How much does the sample mean fluctuate?
Toss a fair coin 100 times and record the fraction of heads $\bar X$. What are the mean and standard deviation of $\bar X$?
---
$X_i\sim\operatorname{Bern}(0.5)$, $\Var X_i=0.25$. $\E\bar X=0.5$, $\Var\bar X=0.25/100=0.0025$, standard deviation $0.05$. Quadrupling the data halves the standard deviation (it scales like $1/\sqrt n$). This is the same reason the gradient noise shrinks when the mini-batch grows[[ch10:10.2|The variance of a mini-batch gradient is inversely proportional to the batch size.]].
:::

### Going deeper: several random variables

Two random variables are described by the **joint distribution** $p(x,y)$. The marginal is $p(x)=\sum_yp(x,y)$ (an integral in the continuous case), the conditional is $p(y\mid x)=p(x,y)/p(x)$, and independence means $p(x,y)=p(x)p(y)$. The entropy and mutual information of Unit 3 are functions of these distributions. The density of the **multivariate normal distribution** $\N(\mu,\Sigma)$ of a continuous vector $x\in\mathbb R^d$ is $\frac1{(2\pi)^{d/2}\lvert\Sigma\rvert^{1/2}}\exp\!\big(-\frac12(x-\mu)^T\Sigma^{-1}(x-\mu)\big)$, and if $\Sigma=\tau^2I$, the negative log density is $\frac1{2\tau^2}\lVert x-\mu\rVert^2+$const — the source of the ridge regularization of §2.6.
` },
      '2.4': { title: 'Likelihood and Maximum Likelihood Estimation', body: R`
:::idea In plain words
A coin was tossed 10 times and came up heads 7 times. What value of the heads probability $\theta$ is the most plausible? With $\theta=0.1$, getting 7 heads would be very hard; with $\theta=0.7$, it is quite natural. **Viewing “the probability of the observed data” as a function of $\theta$ and picking the $\theta$ that makes it largest** is maximum likelihood estimation.
:::

The **likelihood** is the same expression $p(x\mid\theta)$ viewed **in the other direction** (lecture notes).

- $p(x\mid\theta)$: fix $\theta$ and view it as a function of $x$ → a probability (density)
- $L(\theta;x)=p(x\mid\theta)$: fix the observation $x$ and view it as a function of $\theta$ → the likelihood

Example: $P(X=1\mid\theta)=\theta$. For a fair coin, plugging in $\theta=\tfrac12$ gives the probability $\tfrac12$; if we observed $x=1$, $L(\theta;x=1)=\theta$ is a function of $\theta$. The likelihood is not a probability distribution over $\theta$ ($\int L\,d\theta$ need not be 1).

If $X_1,\dots,X_n$ are i.i.d., independence makes the joint probability a product, $L(\theta)=\prod_{i=1}^np(x_i\mid\theta)$, and the $\hat\theta$ maximizing it is the **maximum likelihood estimator** (MLE). To turn the product into a sum we maximize $\log L$ instead (the maximizer is the same because $\log$ is increasing). There is also a practical reason: multiplying 0.1 a thousand times gives 0 on a computer, but the sum of logs, $-2302.6$, is perfectly fine.

:::key Bernoulli MLE
If $x_i\in\{0,1\}$, $P(X_i=1)=\theta$, and $S=\sum_ix_i$, then
$$L(\theta)=\theta^{S}(1-\theta)^{n-S},\qquad \ell(\theta)=S\log\theta+(n-S)\log(1-\theta)$$
$$\ell'(\theta)=\frac{S}{\theta}-\frac{n-S}{1-\theta}=0\ \Rightarrow\ \hat\theta_{\text{MLE}}=\frac Sn=\frac1n\sum_{i=1}^nx_i$$
:::

In the lecture notes, $\ell'=0$ gave $S(1-\theta)=(n-S)\theta$, i.e., $S=n\theta$. Since $\ell''(\theta)=-S/\theta^2-(n-S)/(1-\theta)^2<0$, this point is the maximizer. Check that the one-line notation $p(x\mid\theta)=\theta^x(1-\theta)^{1-x}$ becomes $\theta$ when $x=1$ and $1-\theta$ when $x=0$ — the likelihood of logistic regression uses the same notation[[ch05:5.3|$p(y_i\mid x_i,w)=p^{y_i}(1-p)^{1-y_i}$.]].

### MLE for Gaussian data

If $X_i\sim\N(\mu,\sigma^2)$ i.i.d., then
$$\ell(\mu,\sigma^2)=\sum_{i=1}^n\log\Big(\frac1{\sqrt{2\pi\sigma^2}}e^{-(x_i-\mu)^2/(2\sigma^2)}\Big)=-\frac n2\log(2\pi\sigma^2)-\frac1{2\sigma^2}\sum_{i=1}^n(x_i-\mu)^2.$$
Differentiating in $\mu$: $\frac1{\sigma^2}\sum(x_i-\mu)=0$, so $\hat\mu=\bar x$ (the sample mean). Differentiating in $\sigma^2$: $-\frac n{2\sigma^2}+\frac1{2\sigma^4}\sum(x_i-\mu)^2=0$, so $\hat\sigma^2=\frac1n\sum(x_i-\bar x)^2$.
The part involving $\mu$ is **minimizing the sum of squared errors**. This is why the least squares of Unit 1 is “the MLE under Gaussian noise”[[ch04:4.1|The probabilistic interpretation of linear regression.]].

:::ex Example 4 — Gaussian MLE
Treat the data $2,4,4,6$ as $\N(\mu,\sigma^2)$ and find the MLE.
---
$\hat\mu=16/4=4$, $\hat\sigma^2=\frac{4+0+0+4}4=2$. (The unbiased estimator divides by $n-1$ and gives $8/3$; see below.)
:::

:::warn Extreme data
If a coin comes up heads three times out of three, $\hat\theta_{\text{MLE}}=1$ — the overconfident belief “always heads from now on”. Bayesian inference and MAP, which bring in a prior, soften this problem.
:::

### Going deeper: properties of the MLE

- **Invariance.** If $\hat\theta$ is the MLE, then $g(\hat\theta)$ is the MLE of $g(\theta)$ (e.g., the MLE of the standard deviation is $\sqrt{\hat\sigma^2}$).
- **Bias.** $\E[\hat\sigma^2_{\text{MLE}}]=\frac{n-1}n\sigma^2$, so the variance is slightly underestimated[[@med:ch04:2.3b|The bias of maximum likelihood and its correction.]]. What bias is, and why it is not always bad, is seen in §2.8.
- **Asymptotics.** As the data grow, the MLE converges to the true value (consistency), is approximately normally distributed, and its variance approaches the smallest possible value (the Cramér–Rao bound).
- **Relation to KL.** Maximizing $\frac1n\ell(\theta)$ is the same as minimizing the KL divergence from the empirical distribution of the data to the model distribution[[ch03:3.5|Cross-entropy = entropy + KL.]].
` },
      '2.5': { title: 'Bayesian Inference: From Prior to Posterior', body: R`
:::idea In plain words
The MLE takes the attitude “$\theta$ is a fixed value, and we try to hit it”. The Bayesian view says “since we do not know $\theta$, let us express how much we do not know **as a probability distribution**”. Multiplying the belief before seeing the data (the prior) by the evidence the data give (the likelihood) yields the belief after seeing the data (the posterior). When new data arrive, we take the current posterior as the next prior and update again.
:::

In the Bayesian view, the parameter $\theta$ is also a random variable, and the belief before seeing the data is the **prior** $p(\theta)$.
$$p(\theta\mid x)=\frac{p(x,\theta)}{p(x)}=\frac{p(x\mid\theta)\,p(\theta)}{p(x)}=\frac{p(x\mid\theta)\,p(\theta)}{\int p(x\mid\theta)p(\theta)\,d\theta}$$
The posterior $\propto$ likelihood $\times$ prior, and the denominator $p(x)$ (the evidence) is a normalizing constant independent of $\theta$. It is Bayes' theorem of §2.2 with the partition $\{E_i\}$ replaced by the continuous $\theta$ and the sum by an integral.

:::def Beta distribution and Beta function
$$\operatorname{Beta}(\theta\mid a,b)=\frac{\Gamma(a+b)}{\Gamma(a)\Gamma(b)}\theta^{a-1}(1-\theta)^{b-1},$$
$$B(a,b)=\int_0^1t^{a-1}(1-t)^{b-1}dt=\frac{\Gamma(a)\Gamma(b)}{\Gamma(a+b)}$$
$\operatorname{Beta}(1,1)$ is the uniform distribution on $[0,1]$. The mean is $\frac{a}{a+b}$ and the mode is $\frac{a-1}{a+b-2}$ ($a,b>1$).
:::

The Gamma function $\Gamma(z)=\int_0^\infty t^{z-1}e^{-t}dt$ extends the factorial, so $\Gamma(m)=(m-1)!$ for positive integers. Hence for integer $a,b$, $B(a,b)=\frac{(a-1)!(b-1)!}{(a+b-1)!}$ can be computed by hand. Example: $\int_0^1\theta^3(1-\theta)^2d\theta=B(4,3)=\frac{3!\,2!}{6!}=\frac1{60}$.

:::key Beta posterior
For Bernoulli data ($S$ successes, $n-S$ failures) and the uniform prior $p(\theta)=1$ ($0\le\theta\le1$),
$$\begin{aligned}p(\theta\mid D)&=\frac{\Gamma(n+2)}{\Gamma(S+1)\Gamma(n-S+1)}\theta^{S}(1-\theta)^{n-S}\\&=\operatorname{Beta}(\theta\mid S+1,\,n-S+1)\end{aligned}$$
If the prior is $\operatorname{Beta}(a,b)$, the posterior is $\operatorname{Beta}(a+S,\ b+n-S)$.
:::

:::hand Lecture note — finding the normalizing constant
$p(\theta\mid D)\propto\theta^S(1-\theta)^{n-S}=:q(\theta)$. The normalizing constant $Z=\int_0^1\theta^S(1-\theta)^{n-S}d\theta$ is the Beta function with $a-1=S$ and $b-1=n-S$, so
$$Z=B(S+1,n-S+1)=\frac{\Gamma(S+1)\Gamma(n-S+1)}{\Gamma(n+2)}.$$
Hence $p(\theta\mid D)=q(\theta)/Z$ is the Beta distribution above. Since the prior and the posterior have the same form (Beta), the Beta distribution is the **conjugate prior** of the Bernoulli likelihood.
:::

### The prior = imaginary data seen in advance

Comparing the prior $\operatorname{Beta}(a,b)$ with the posterior $\operatorname{Beta}(a+S,b+n-S)$, $a-1$ behaves like “successes seen in advance” and $b-1$ like “failures seen in advance” (**pseudo-observations**). Rearranging the posterior mean,
$$\E[\theta\mid D]=\frac{a+S}{a+b+n}=\underbrace{\frac{a+b}{a+b+n}}_{\text{prior weight}}\cdot\frac a{a+b}+\underbrace{\frac n{a+b+n}}_{\text{data weight}}\cdot\frac Sn$$
— a **weighted average** of the prior mean and the MLE; as the data grow ($n\to\infty$) the weight of the data goes to 1 and it coincides with the MLE.

:::fig betapost
:::

:::ex Example 5 — Sequential updating
Starting from the uniform prior, a coin comes up heads, heads, tails. Compare updating all at once with updating one toss at a time.
---
All at once: $S=2$, $n=3$, so $\operatorname{Beta}(3,2)$.
One at a time: $\operatorname{Beta}(1,1)\xrightarrow{\text{H}}\operatorname{Beta}(2,1)\xrightarrow{\text{H}}\operatorname{Beta}(3,1)\xrightarrow{\text{T}}\operatorname{Beta}(3,2)$. The same. For i.i.d. data the likelihood is a product, so the posterior is the same regardless of the order and of how the data are split. The posterior mean is $3/5=0.6$ and the mode $2/3$.
:::

### Going deeper: when the prior is not conjugate

If the prior and the likelihood are not conjugate, the integral $p(x)$ in the denominator cannot be done by hand. So we draw samples from the posterior with Markov chain Monte Carlo (MCMC), or approximate the posterior by a simple distribution (variational inference). For the weights of a neural network, computing the full posterior is usually impossible, so in practice we often compute only the peak of the posterior (MAP) — the next section[[@med:ch06:2.6c|Fully Bayesian machine learning and its difficulty.]].
` },
      '2.6': { title: 'Maximum A Posteriori (MAP) Estimator: Likelihood + Prior', body: R`
:::idea In plain words
If carrying the whole posterior around is cumbersome, we pick only **its highest point** as the estimate. This is MAP. Taking logs, it becomes the problem of maximizing a score that adds “how well the data are explained” and “how well it agrees with the prior belief” — in machine-learning language, minimizing **loss + regularization**.
:::

Using the mode of the posterior instead of the whole posterior as the estimate is **MAP** (maximum a posteriori). Since $p(x)$ does not depend on $\theta$ and $\log$ is increasing (lecture notes: applying an increasing function such as $2x+5$ or adding a constant does not move the maximizer),

:::key MAP estimation
$$\begin{aligned}\hat\theta_{\text{MAP}}&=\argmax_\theta\log p(\theta\mid x)=\argmax_\theta\big[\log p(x\mid\theta)+\log p(\theta)\big]\\&=\argmin_\theta\big[\underbrace{-\log p(x\mid\theta)}_{\text{data-fit loss}}\ \underbrace{-\log p(\theta)}_{\text{regularization}}\big]\end{aligned}$$
If $\theta\sim\N(0,\tau^2I)$, then $-\log p(\theta)=\dfrac{1}{2\tau^2}\lVert\theta\rVert_2^2+\text{const}$ → $L_2$ regularization (ridge).
:::

**Line by line.** (1) The $\argmax$ of $p(\theta\mid x)=p(x\mid\theta)p(\theta)/p(x)$ does not depend on the denominator $p(x)$, so it equals $\argmax p(x\mid\theta)p(\theta)$. (2) Since $\log$ is increasing, $\argmax\log(\cdot)=\argmax\log p(x\mid\theta)+\log p(\theta)$. (3) Flipping the sign turns $\argmax$ into $\argmin$.

The MLE is $\argmax\log p(x\mid\theta)$ and uses no prior. MAP can use a prior, and that prior becomes the regularization term[[ch04:4.3|Ridge regression $\tfrac12f(\beta)+\tfrac\lambda2\lVert\beta\rVert^2$ is the MAP with Gaussian errors and a Gaussian prior.]]. With a Laplace prior $p(\theta)\propto e^{-\lvert\theta\rvert/b}$, $-\log p=\lvert\theta\rvert/b$ → $L_1$ regularization (lasso).

:::ex Example 6 — 10 tosses, 7 heads (lecture notes)
Find (1) the MLE and (2) the MAP with the prior $\operatorname{Beta}(2,2)$ (“the coin is probably fair”).
---
(1) $P(D\mid\theta)=\theta^7(1-\theta)^3$, $\hat\theta_{\text{MLE}}=7/10=0.7$.
(2) $P(\theta\mid D)\propto\theta^7(1-\theta)^3\cdot\theta^{2-1}(1-\theta)^{2-1}=\theta^8(1-\theta)^4$ → $\operatorname{Beta}(9,5)$. The mode is $\frac{9-1}{9+5-2}=\frac8{12}\approx0.667$.
The prior pulls the estimate toward $0.5$.
:::

The three curves in the figure above (§2.5) are this example. The posterior mean is $9/14\approx0.643$, slightly different from the MAP again — for an asymmetric distribution the mode and the mean differ.

:::tip Beta–Bernoulli MAP formula
With prior $\operatorname{Beta}(a,b)$ and $S$ successes in $n$ trials, $\hat\theta_{\text{MAP}}=\dfrac{S+a-1}{n+a+b-2}$. With $a=b=1$ (uniform) it equals the MLE.
:::

**Derivation.** $\log p(\theta\mid D)=(S+a-1)\log\theta+(n-S+b-1)\log(1-\theta)+$const. Setting the derivative to zero, $\frac{S+a-1}\theta=\frac{n-S+b-1}{1-\theta}$, i.e., $(S+a-1)(1-\theta)=(n-S+b-1)\theta$, which gives the formula. It is the Bernoulli MLE derivation with $S\to S+a-1$ and $n\to n+a+b-2$.

### Going deeper: the weakness of MAP

MAP is convenient but **changes when the parameter is changed (reparametrization)**, because a density picks up a Jacobian factor under a change of variables. For example, putting a uniform prior on the logit $\log\frac\theta{1-\theta}$ instead of on $\theta$ changes the MAP. The posterior mean and the full posterior suffer much less from this. MAP also throws away the uncertainty (the width of the distribution), so when comparing two targets with different amounts of data, as in §2.7, it is better to use the whole posterior.
` },
      '2.7': { title: 'Example: Who Should We Buy From?', body: R`
:::idea In plain words
Which store would you buy from: 4.5 stars (1000 reviews) or 5.0 stars (2 reviews)? Most people choose the first. The 5.0 with 2 reviews “might have been luck”. Bayesian inference turns this common sense into numbers.
:::

This is K. P. Murphy's example. Suppose we want to buy something from Amazon.com, and there are two sellers offering it for the same price. Seller 1 has 90 positive reviews and 10 negative reviews. Seller 2 has 2 positive reviews and 0 negative reviews.

- **By MLE**, $\hat\theta_1=0.9$ and $\hat\theta_2=1.0$ → the conclusion is that seller 2 is better. Believing “perfect” from two reviews is overconfidence.
- **By Bayes** (lecture notes), put the uniform prior $\operatorname{Beta}(1,1)$ on the reliabilities $\theta_1,\theta_2$:
$$p(\theta_1\mid D_1)=\operatorname{Beta}(91,11),\qquad p(\theta_2\mid D_2)=\operatorname{Beta}(3,1).$$
The two posteriors are independent, so
$$\begin{aligned}P(\theta_1>\theta_2\mid D_1,D_2)&=\iint\mathbb 1\{\theta_1>\theta_2\}\operatorname{Beta}(\theta_1\mid91,11)\\&\qquad\times\operatorname{Beta}(\theta_2\mid3,1)\,d\theta_1d\theta_2\approx0.71.\end{aligned}$$
(Numerical integration gives $0.713$.) So it is better to buy from **seller 1**. The posterior means are also $91/102\approx0.89$ versus $3/4=0.75$.

:::fig sellers
:::

### Solving the integral exactly by hand

$\operatorname{Beta}(3,1)$ has density $3t^2$ and CDF $P(\theta_2\le t)=t^3$. Fixing $\theta_1$, $P(\theta_2<\theta_1\mid\theta_1)=\theta_1^3$, so
$$P(\theta_1>\theta_2)=\E\big[\theta_1^3\big],\qquad \theta_1\sim\operatorname{Beta}(91,11).$$
Using the moments of the Beta distribution $\E[\theta^k]=\frac{B(a+k,b)}{B(a,b)}=\prod_{j=0}^{k-1}\frac{a+j}{a+b+j}$,
$$\E[\theta_1^3]=\frac{91}{102}\cdot\frac{92}{103}\cdot\frac{93}{104}\approx0.7126.$$
The “about 0.71” in class is exactly this value (matching the numerical integral).

:::idea The point
The less data, the wider the posterior. $\operatorname{Beta}(3,1)$ retains the uncertainty that $\theta_2$ could be near 1 or near 0.5, and Bayesian inference compares that uncertainty too.
:::

### Going deeper: solving it by Monte Carlo

When an integral is complicated, we estimate it by sampling. Draw $S$ pairs $\theta_1^{(s)}\sim\operatorname{Beta}(91,11)$, $\theta_2^{(s)}\sim\operatorname{Beta}(3,1)$ and count the fraction with $\theta_1^{(s)}>\theta_2^{(s)}$: this is an unbiased estimator of $P(\theta_1>\theta_2)$, with standard error about $\sqrt{0.71\cdot0.29/S}$ — about $\pm0.005$ for $S=10^4$. In Bayesian deep learning, “drawing the weights from the posterior several times and averaging the predictions” is the same idea.
` },
      '2.8': { title: 'MAP of a Gaussian Mean: Shrinkage and the Bias–Variance Decomposition', body: R`
:::idea In plain words
When measurements $X_1,\dots,X_n$ are scattered around the true value $\theta$, the most natural estimate is the mean $\bar X$. But if we have the prior belief “$\theta$ is probably near 0”, MAP returns $\bar X$ **pulled slightly** toward 0 (shrunk). Pulling makes it miss a little on average (bias) but fluctuate less (lower variance). The total error combining the two (the MSE) can actually decrease. This is the simplest model of why regularization reduces overfitting.
:::

### Setting

$X_1,\dots,X_n$ are independent with $X_i\sim\N(\theta,1)$ (the variance 1 is known and the mean $\theta$ is unknown). The prior is $\theta\sim\N(0,\tau^2)$, $\tau^2>0$.

### (1) MAP = ridge

Since posterior $\propto$ likelihood $\times$ prior,
$$\begin{aligned}\log p(\theta\mid X)&=\sum_{i=1}^n\log\Big(\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\Big)+\log\Big(\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}\Big)+C\\&=-\frac12\sum_{i=1}^n(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C'.\end{aligned}$$
The first line has three ingredients: posterior $\propto$ likelihood $\times$ prior (§2.5); the likelihood splits into $\prod_ip(X_i\mid\theta)$ by independence (§2.4); and the normal density $\frac1{\sqrt{2\pi\sigma^2}}e^{-(x-\mu)^2/(2\sigma^2)}$ with $(x,\mu,\sigma^2)=(X_i,\theta,1)$ for the likelihood and $(\theta,0,\tau^2)$ for the prior (the table of §2.3). The second line follows because the log of a product is a sum and $\log e^u=u$. (This substitution is worked out step by step in a table in the solution of Problem 2 on the **worked-problems** tab of the header.)
Dropping the constants independent of $\theta$ and multiplying by $-2$ turns the maximization into a minimization.

:::key The Gaussian MAP is ridge
$$\hat\theta_{\text{MAP}}=\argmin_\theta\Big[\sum_{i=1}^n(X_i-\theta)^2+\lambda\theta^2\Big],\qquad\lambda=\frac1{\tau^2}$$
The solution is $\hat\theta_{\text{MAP}}=\dfrac{\sum_iX_i}{n+\lambda}=a\bar X$ with shrinkage factor $a=\dfrac n{n+1/\tau^2}=\dfrac{n\tau^2}{n\tau^2+1}\in(0,1)$.
:::

**Solution.** Differentiating $g(\theta)=\sum(X_i-\theta)^2+\lambda\theta^2$ gives $g'(\theta)=-2\sum(X_i-\theta)+2\lambda\theta=-2\sum X_i+2(n+\lambda)\theta$. Since $g''=2(n+\lambda)>0$, $g$ is convex, so the solution of $g'=0$, $\theta=\sum X_i/(n+\lambda)$, is the minimizer. Using $\sum X_i=n\bar X$, $\hat\theta=\frac n{n+\lambda}\bar X$.

**Interpretation.**
- $\tau^2\to\infty$ (almost no prior belief): $a\to1$, MAP → MLE $\bar X$.
- $\tau^2\to0$ (firm belief that it is 0): $a\to0$, the data are ignored and the answer is 0.
- $n\to\infty$ (lots of data): $a\to1$. The data beat the prior belief.
- Since the likelihood and the prior are both Gaussian, the posterior is also Gaussian, $\N\big(a\bar X,\ \frac1{n+1/\tau^2}\big)$, and since it is symmetric, MAP = posterior mean. The precisions (inverse variances) add: $\frac1{\sigma_{\text{post}}^2}=n+\frac1{\tau^2}$.

### (2) The bias–variance decomposition

We measure how good an estimator $\hat\theta$ (a random variable, being a function of the data) is by the **mean squared error** $\mathrm{MSE}=\E[(\hat\theta-\theta)^2]$. The expectation is taken over the distribution of the data with $\theta$ fixed.

:::key Bias–variance decomposition
$$\E\big[(\hat\theta-\theta)^2\big]=\big(\E[\hat\theta]-\theta\big)^2+\Var(\hat\theta)=\text{bias}^2+\text{variance}$$
:::

**Proof.** Split $\hat\theta-\theta=(\hat\theta-\E\hat\theta)+(\E\hat\theta-\theta)$ and square. The second bracket $b=\E\hat\theta-\theta$ is a **constant**.
$$\E(\hat\theta-\theta)^2=\E(\hat\theta-\E\hat\theta)^2+2b\,\E(\hat\theta-\E\hat\theta)+b^2.$$
The middle term vanishes because $\E(\hat\theta-\E\hat\theta)=\E\hat\theta-\E\hat\theta=0$, and the first term is the definition of the variance. ∎

### (3) Bias, variance, and MSE of the shrinkage estimator

Since $\E\bar X=\theta$ and $\Var\bar X=1/n$ (§2.3), for $\hat\theta=a\bar X$
$$\text{bias}=a\theta-\theta=-(1-a)\theta=-\frac{\theta}{n\tau^2+1},\qquad \Var(\hat\theta)=\frac{a^2}n=\frac{n\tau^4}{(n\tau^2+1)^2},$$
$$\mathrm{MSE}(\hat\theta_{\text{MAP}})=\frac{\theta^2}{(n\tau^2+1)^2}+\frac{n\tau^4}{(n\tau^2+1)^2}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}.$$
The MLE $\bar X$ for comparison has bias 0, variance $1/n$, and MSE $1/n$.

:::ex Example 7 — Comparing with numbers
With $n=4$ and $\tau^2=0.5$, find the shrinkage factor and compare the MSEs of MAP and MLE when the true value is $\theta=0,1,2$.
---
$a=\frac{4(0.5)}{4(0.5)+1}=\frac23$. Variance $a^2/n=\frac{4/9}4=\frac19$, bias² $(1-a)^2\theta^2=\frac{\theta^2}9$.
- $\theta=0$: MAP $\frac19\approx0.111$ < MLE $0.25$
- $\theta=1$: MAP $\frac29\approx0.222$ < MLE $0.25$
- $\theta=2$: MAP $\frac59\approx0.556$ > MLE $0.25$

When MAP wins: $\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}<\frac1n\iff n\theta^2+n^2\tau^4<n^2\tau^4+2n\tau^2+1\iff\theta^2<2\tau^2+\frac1n$. Here $\theta^2<1.25$.
:::

:::fig shrinkmse
:::

:::warn Zero bias is not the best
The intuition “an unbiased estimator is good” is only half right. If the criterion is the MSE, it can be better to accept a little bias and reduce the variance a lot. Regularizers such as ridge, weight decay, and dropout all make this trade[[ch04:4.3|The $\lambda$ of ridge is the knob that trades bias for variance.]].
:::

### Going deeper: the James–Stein phenomenon

In dimension $d\ge3$ something surprising happens. Observing a single $X\sim\N(\theta,I_d)$, there is an estimator $\big(1-\frac{d-2}{\lVert X\rVert^2}\big)X$ whose MSE is smaller than that of $X$ for every $\theta$ (James–Stein). That is, in high dimensions, shrinking alone, “without any prior information”, can beat the sample mean **for every $\theta$**. It is one intuition for why regularization almost always helps neural networks with millions of parameters.
` },
    },
    probs: [
      // u02
      { q: R`When showing $P(E\cup F)=P(E)+P(F)-P(E\cap F)$ from the axioms of probability alone, which decomposition do you use first?`,
        choices: [R`$E\cup F=E\cup(F\setminus E)$, $F=(E\cap F)\cup(F\setminus E)$ (disjoint decompositions)`, R`$E\cup F=E\cap F$`, R`$P(E\cup F)=P(E)P(F)$`, R`Only $E\cup F=(E^c\cap F^c)^c$`],
        sol: R`Both are disjoint decompositions, so axiom 3 gives $P(E\cup F)=P(E)+P(F\setminus E)$ and $P(F)=P(E\cap F)+P(F\setminus E)$. Subtracting gives the result.` },
      { q: R`If $P(E)=0.5$, $P(F)=0.4$, and $P(E\cap F)=0.1$, what is $P(E^c\cap F^c)$?`,
        sol: R`$P(E\cup F)=0.5+0.4-0.1=0.8$. By De Morgan, $E^c\cap F^c=(E\cup F)^c$, so it is $1-0.8=0.2$.` },
      { q: R`In the cough–cold example with $P(Y=1)=0.1$, $P(X=1\mid Y=1)=0.8$, and $P(X=1\mid Y=0)=0.2$, what is $P(X=1)$?`,
        sol: R`Total probability: $0.8(0.1)+0.2(0.9)=0.26$.` },
      { q: R`In the same example, what is the probability of having the disease given **no** cough, $P(Y=1\mid X=0)$? (4 decimal places)`,
        sol: R`$P(X=0\mid Y=1)=0.2$ and $P(X=0)=1-0.26=0.74$. $P(Y=1\mid X=0)=\dfrac{0.2\times0.1}{0.74}=\dfrac{0.02}{0.74}\approx0.027$.` },
      { q: R`In Bayes' theorem $P(E_i\mid F)=\dfrac{P(F\mid E_i)P(E_i)}{P(F)}$, which term is the **evidence**?`,
        choices: [R`$P(F\mid E_i)$`, R`$P(E_i)$`, R`$P(F)$`, R`$P(E_i\mid F)$`],
        sol: R`$P(F\mid E_i)$ is the likelihood, $P(E_i)$ the prior probability, $P(F)=\sum_jP(F\mid E_j)P(E_j)$ the evidence (the normalizing constant), and $P(E_i\mid F)$ the posterior probability.` },
      { q: R`What is the MLE $\hat\theta$ for the Bernoulli data $1,0,1,1,0,1,1,1$?`,
        sol: R`$S=6$, $n=8$, $\hat\theta=S/n=0.75$.` },
      { q: R`What is the MLE for $X_1,\dots,X_n\overset{iid}{\sim}\operatorname{Poisson}(\lambda)$, $p(x\mid\lambda)=e^{-\lambda}\lambda^x/x!$?`,
        choices: [R`$\bar x$`, R`$\bar x^2$`, R`$1/\bar x$`, R`$\max_ix_i$`],
        sol: R`$\ell(\lambda)=-n\lambda+(\sum x_i)\log\lambda-\sum\log x_i!$, and $\ell'=-n+\sum x_i/\lambda=0$ gives $\hat\lambda=\bar x$. $\ell''=-\sum x_i/\lambda^2<0$.` },
      { q: R`What is the most precise reason why we may maximize the log-likelihood instead of the likelihood?`,
        choices: [R`Because the log-likelihood is always convex`, R`Because $\log$ is strictly increasing, so the location of the maximizer is the same`, R`Because the likelihood can be negative`, R`Because taking logs changes the parameter`],
        sol: R`$\log$ is strictly increasing, so $L(\theta_1)<L(\theta_2)\iff\log L(\theta_1)<\log L(\theta_2)$. As a bonus, the product becomes a sum, which is easy to differentiate, and the underflow from multiplying tiny numbers is avoided.` },
      { q: R`With the uniform prior and Bernoulli data $n=10$, $S=7$, what is the posterior?`,
        choices: [R`$\operatorname{Beta}(7,3)$`, R`$\operatorname{Beta}(8,4)$`, R`$\operatorname{Beta}(9,5)$`, R`$\operatorname{Beta}(7,10)$`],
        sol: R`$\operatorname{Beta}(S+1,n-S+1)=\operatorname{Beta}(8,4)$. $\operatorname{Beta}(9,5)$ is the answer when the prior is $\operatorname{Beta}(2,2)$.` },
      { q: R`What is the value of $\int_0^1\theta^3(1-\theta)^2\,d\theta$?`,
        sol: R`$B(4,3)=\dfrac{\Gamma(4)\Gamma(3)}{\Gamma(7)}=\dfrac{3!\,2!}{6!}=\dfrac{12}{720}=\dfrac1{60}$.` },
      { q: R`With the uniform prior, $S=3$ heads and $1$ tail, what is the posterior mean $E[\theta\mid D]$?`,
        sol: R`The posterior is $\operatorname{Beta}(4,2)$ with mean $\frac{4}{4+2}=\frac23$. (Laplace's rule of succession $\frac{S+1}{n+2}$.)` },
      { q: R`With the prior $\operatorname{Beta}(3,3)$ and 8 heads in 10 tosses, what is $\hat\theta_{\text{MAP}}$?`,
        sol: R`The posterior is $\operatorname{Beta}(3+8,3+2)=\operatorname{Beta}(11,5)$. Its mode is $\frac{11-1}{11+5-2}=\frac{10}{14}=\frac57$ — closer to 0.5 than the MLE $0.8$.` },
      { q: R`In MAP estimation, what regularization term does the prior $\theta\sim\N(0,\tau^2I)$ produce?`,
        choices: [R`$\lVert\theta\rVert_1/\tau$`, R`$\lVert\theta\rVert_2^2/(2\tau^2)$`, R`$\tau^2\lVert\theta\rVert_2^2$`, R`No regularization term arises`],
        sol: R`$-\log p(\theta)=\frac{1}{2\tau^2}\lVert\theta\rVert_2^2+\frac d2\log(2\pi\tau^2)$. The constant does not affect the optimization. The narrower the prior (the smaller $\tau$), the stronger the regularization. (A Laplace prior gives $L_1$.)` },
      { q: R`In the Amazon example with the uniform prior, what is the posterior of seller 2 (2 positive, 0 negative)?`,
        choices: [R`$\operatorname{Beta}(2,0)$`, R`$\operatorname{Beta}(3,1)$`, R`$\operatorname{Beta}(2,1)$`, R`$\operatorname{Beta}(1,3)$`],
        sol: R`$\operatorname{Beta}(S+1,n-S+1)=\operatorname{Beta}(3,1)$ with density $3\theta^2$. Seller 1 has $\operatorname{Beta}(91,11)$.` },
      { q: R`If $\theta_2\sim\operatorname{Beta}(3,1)$ (density $3t^2$) and we assume $\theta_1$ equals $0.9$ with probability 1, what is $P(\theta_1>\theta_2)$?`,
        sol: R`$P(\theta_2<0.9)=\int_0^{0.9}3t^2dt=0.9^3=0.729$. In reality $\theta_1$ also has a distribution, and the answer becomes about $0.71$.` },
      { q: R`Derive that the MLE for i.i.d. Bernoulli data $x_1,\dots,x_n$ is $\hat\theta=\frac1n\sum x_i$. Include the step confirming a maximum and explain the cases $S=0$ and $S=n$.`,
        sol: R`
Since $p(x_i\mid\theta)=\theta^{x_i}(1-\theta)^{1-x_i}$, $L(\theta)=\prod_i\theta^{x_i}(1-\theta)^{1-x_i}=\theta^S(1-\theta)^{n-S}$ with $S=\sum x_i$.
For $0<\theta<1$, $\ell(\theta)=S\log\theta+(n-S)\log(1-\theta)$ and $\ell'(\theta)=\frac S\theta-\frac{n-S}{1-\theta}$.
$\ell'=0\iff S(1-\theta)=(n-S)\theta\iff S=n\theta$, i.e., $\hat\theta=S/n$.
$\ell''(\theta)=-\frac S{\theta^2}-\frac{n-S}{(1-\theta)^2}<0$ ($0<S<n$), so $\ell$ is concave and this is the unique maximizer.
If $S=0$, $L=(1-\theta)^n$ decreases on $[0,1]$ and $\hat\theta=0$; if $S=n$, $L=\theta^n$ increases and $\hat\theta=1$. Both equal $S/n$.`,
        rubric: R`
- The product form of the likelihood and $\theta^S(1-\theta)^{n-S}$ — 3 pts
- Log-likelihood, its derivative, and the stationary point $S/n$ — 4 pts
- Confirming the maximum with the second derivative — 2 pts
- The boundary cases — 1 pt` },
      { q: R`Show that the MAP estimator is $\argmin_\theta\big[-\log p(x\mid\theta)-\log p(\theta)\big]$, and that for linear regression $y=X\beta+\varepsilon$, $\varepsilon\sim\N(0,\sigma^2I)$, $\beta\sim\N(0,\tau^2I)$, MAP is ridge regression.`,
        sol: R`
$p(\theta\mid x)=p(x\mid\theta)p(\theta)/p(x)$ and $p(x)$ does not depend on $\theta$, so $\argmax_\theta p(\theta\mid x)=\argmax_\theta p(x\mid\theta)p(\theta)$. Since $\log$ is strictly increasing, this is $=\argmax[\log p(x\mid\theta)+\log p(\theta)]=\argmin[-\log p(x\mid\theta)-\log p(\theta)]$.

In regression, $-\log p(y\mid\beta)=\frac1{2\sigma^2}\lVert y-X\beta\rVert^2+c_1$ and $-\log p(\beta)=\frac1{2\tau^2}\lVert\beta\rVert^2+c_2$. Therefore
$$\hat\beta_{\text{MAP}}=\argmin_\beta\frac1{2\sigma^2}\lVert y-X\beta\rVert^2+\frac1{2\tau^2}\lVert\beta\rVert^2=\argmin_\beta\tfrac12\lVert y-X\beta\rVert^2+\tfrac\lambda2\lVert\beta\rVert^2,\quad\lambda=\frac{\sigma^2}{\tau^2}.$$
(Multiplying through by $\sigma^2$ does not change the minimizer.) This is ridge regression, whose solution is $(X^TX+\lambda I)^{-1}X^Ty$.`,
        rubric: R`
- Dropping the evidence $p(x)$ and monotonicity of the log — 3 pts
- Computing the two negative log densities — 4 pts
- Deriving the ridge objective with $\lambda=\sigma^2/\tau^2$ — 3 pts` },
      // more-02
      { q: R`**(Problem Set 1, Problem 2)** Assume $X_1,\dots,X_n$ are independent with $X_i\sim\N(\theta,1)$, where the variance is known to be 1 and $\theta$ is unknown. The prior is $\theta\sim\N(0,\tau^2)$. Expectations below are taken with respect to the sampling distribution of $(X_1,\dots,X_n)$ given $\theta$.
1. Derive the MAP estimator of $\theta$. Show that it coincides with the solution of the Ridge problem $\hat\theta_{\text{MAP}}=\argmin_\theta\sum_{i=1}^n(X_i-\theta)^2+\lambda\theta^2$, $\lambda=1/\tau^2$.
2. Express $\hat\theta_{\text{MAP}}=a\bar X$ and determine the shrinkage factor $a$ as a function of $n,\tau^2$.
3. For any estimator $\hat\theta$ of $\theta$, prove the identity $\E(\hat\theta-\theta)^2=(\E\hat\theta-\theta)^2+\Var(\hat\theta)$, and compute the bias, variance, and MSE of $\hat\theta_{\text{MAP}}$.`,
        sol: R`
**1.** The posterior is $\propto\prod_i\frac1{\sqrt{2\pi}}e^{-(X_i-\theta)^2/2}\cdot\frac1{\sqrt{2\pi\tau^2}}e^{-\theta^2/(2\tau^2)}$. Taking logs,
$$\log p(\theta\mid X)=-\frac12\sum_i(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}+C.$$
Since $\log$ is increasing and $C$ does not depend on $\theta$, $\argmax\log p(\theta\mid X)=\argmin\big[\sum(X_i-\theta)^2+\theta^2/\tau^2\big]$ (multiplying by $-2$). This is the ridge problem with $\lambda=1/\tau^2$.
**2.** $g(\theta)=\sum(X_i-\theta)^2+\lambda\theta^2$, $g'(\theta)=-2\sum X_i+2(n+\lambda)\theta$, $g''=2(n+\lambda)>0$. $g'=0$ gives $\hat\theta=\frac{n\bar X}{n+\lambda}$, so $a=\frac n{n+1/\tau^2}=\frac{n\tau^2}{n\tau^2+1}$.
**3.** Let $b=\E\hat\theta-\theta$ (a constant). $\E(\hat\theta-\theta)^2=\E\big[(\hat\theta-\E\hat\theta)+b\big]^2=\E(\hat\theta-\E\hat\theta)^2+2b\,\E(\hat\theta-\E\hat\theta)+b^2=\Var(\hat\theta)+b^2$ (the middle term is 0).
Since $\E\bar X=\theta$ and $\Var\bar X=1/n$: bias $=(a-1)\theta=-\frac{\theta}{n\tau^2+1}$, variance $=\frac{a^2}n=\frac{n\tau^4}{(n\tau^2+1)^2}$, $\mathrm{MSE}=\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}$.`,
        rubric: R`
- Expanding the log posterior and dropping constants — 2 pts
- The ridge form and $\lambda=1/\tau^2$ — 2 pts
- Differentiation, convexity check, shrinkage factor — 2 pts
- Proof of the decomposition (stating why the cross term is 0) — 2 pts
- Bias, variance, MSE — 2 pts` },
      { q: R`In the setting above with $n=9$, $\tau^2=1/3$, and $\bar X=2$, what is $\hat\theta_{\text{MAP}}$?`,
        sol: R`$a=\frac{9(1/3)}{9(1/3)+1}=\frac34$, $\hat\theta=\frac34\cdot2=1.5$.` },
      { q: R`In the same setting ($n=9$, $\tau^2=1/3$), what is the MSE of $\hat\theta_{\text{MAP}}$ when the true value is $\theta=1$?`,
        sol: R`$\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}=\frac{1+9/9}{16}=\frac18$. The MSE of the MLE is $1/9\approx0.111$, so here the MLE is better ($\theta^2=1>2\tau^2+1/n\approx0.778$).` },
      { q: R`In the setting above, show that $\mathrm{MSE}(\hat\theta_{\text{MAP}})<\mathrm{MSE}(\bar X)$ if and only if $\theta^2<2\tau^2+\frac1n$.`,
        sol: R`
$\mathrm{MSE}(\bar X)=1/n$ (bias 0, variance $1/n$). Therefore
$$\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}<\frac1n\iff n\theta^2+n^2\tau^4<(n\tau^2+1)^2=n^2\tau^4+2n\tau^2+1\iff n\theta^2<2n\tau^2+1\iff\theta^2<2\tau^2+\frac1n.$$
(The denominators are positive, so multiplying keeps the direction of the inequality.) The more the prior puts its weight near the true value (the smaller $\theta^2$ is compared with $\tau^2$), the more shrinkage pays off.`,
        rubric: R`
- The two MSE formulas — 3 pts
- Clearing denominators and expanding — 4 pts
- Conclusion and interpretation — 3 pts` },
      { q: R`In the setting above, show by completing the square that the posterior $p(\theta\mid X)$ is the Gaussian $\N\big(a\bar X,\ \frac1{n+1/\tau^2}\big)$, and explain why MAP and the posterior mean coincide in this case.`,
        sol: R`
The exponent is $-\frac12\big[\sum(X_i-\theta)^2+\theta^2/\tau^2\big]=-\frac12\big[(n+\tfrac1{\tau^2})\theta^2-2n\bar X\theta\big]+C$.
With $P=n+1/\tau^2$, completing the square gives $-\frac P2\big(\theta-\frac{n\bar X}P\big)^2+C'$. Hence $p(\theta\mid X)\propto\exp\big(-\frac{(\theta-m)^2}{2/P}\big)$ with $m=\frac{n\bar X}{n+1/\tau^2}=a\bar X$ and variance $1/P$ — a Gaussian (the normalizing constant does not depend on $\theta$, so the shape alone determines the distribution).
A Gaussian is a unimodal distribution symmetric about its mean, so mode (MAP) = mean = median.`,
        rubric: R`
- Writing the exponent as a quadratic in $\theta$ — 4 pts
- Completing the square and identifying mean and variance — 4 pts
- Why MAP = posterior mean — 2 pts` },
      { q: R`With $X_i\sim\N(\theta,\sigma^2)$ ($\sigma^2=4$), prior $\theta\sim\N(\mu_0,\tau^2)$ ($\mu_0=1$, $\tau^2=1$), $n=4$, and $\bar X=3$, what is $\hat\theta_{\text{MAP}}=\dfrac{n\bar X/\sigma^2+\mu_0/\tau^2}{n/\sigma^2+1/\tau^2}$?`,
        sol: R`$\frac{4(3)/4+1}{4/4+1}=\frac{3+1}{2}=2$. The posterior mean is the weighted average of “the data mean” and “the prior mean” with their precisions ($n/\sigma^2=1$, $1/\tau^2=1$) as weights.` },
      { q: R`Which is true about the shrinkage factor $a=\frac{n\tau^2}{n\tau^2+1}$?`,
        choices: [R`As $n\to\infty$, $a\to0$`, R`As $\tau^2\to\infty$, MAP coincides with the MLE`, R`The smaller $\tau^2$, the larger the variance of MAP`, R`MAP is an unbiased estimator`],
        sol: R`As $\tau^2\to\infty$ (no prior belief), $a\to1$. Also $a\to1$ as $n\to\infty$. The variance $a^2/n$ gets smaller as $\tau^2$ gets smaller ($a$ smaller), and when $\theta\ne0$ the bias $-(1-a)\theta\ne0$.` },
      { q: R`For $X_i\sim\N(\mu,\sigma^2)$ i.i.d., show that the MLE $\hat\sigma^2=\frac1n\sum(X_i-\bar X)^2$ satisfies $\E[\hat\sigma^2]=\frac{n-1}n\sigma^2$.`,
        sol: R`
$\sum(X_i-\bar X)^2=\sum X_i^2-n\bar X^2$ (expand and use $\sum X_i=n\bar X$). Expectations:
$\E X_i^2=\Var X_i+(\E X_i)^2=\sigma^2+\mu^2$, $\E\bar X^2=\Var\bar X+\mu^2=\frac{\sigma^2}n+\mu^2$.
$$\E\sum(X_i-\bar X)^2=n(\sigma^2+\mu^2)-n\Big(\frac{\sigma^2}n+\mu^2\Big)=(n-1)\sigma^2.$$
Dividing by $n$, $\E\hat\sigma^2=\frac{n-1}n\sigma^2$. The bias is $-\sigma^2/n$, and dividing by $n-1$ gives an unbiased estimator. (Estimating the mean from the data costs one degree of freedom.)`,
        rubric: R`
- The identity for the sum of squares — 3 pts
- $\E X_i^2$ and $\E\bar X^2$ — 4 pts
- Conclusion — 3 pts` },
      { q: R`With the prior $\operatorname{Beta}(4,6)$ we observed 15 heads in 20 tosses. What is the posterior mean?`,
        sol: R`The posterior is $\operatorname{Beta}(4+15,\ 6+5)=\operatorname{Beta}(19,11)$ with mean $\frac{19}{30}$. The MAP is $\frac{18}{28}\approx0.643$ and the MLE $0.75$ — pulled toward the prior mean $0.4$.` },
      { q: R`If $\theta_1\sim\operatorname{Beta}(4,2)$ and $\theta_2\sim\operatorname{Beta}(2,1)$ (density $2t$, CDF $t^2$) are independent, what is $P(\theta_1>\theta_2)$?`,
        sol: R`$P(\theta_2<\theta_1\mid\theta_1)=\theta_1^2$, so $P=\E[\theta_1^2]=\frac{4}{6}\cdot\frac{5}{7}=\frac{20}{42}=\frac{10}{21}$.` },
      { q: R`If $X_1,\dots,X_{25}$ are i.i.d. with $\Var X_i=4$, what is the standard deviation of the sample mean?`,
        sol: R`$\Var\bar X=4/25$, standard deviation $2/5=0.4$.` },
      { q: R`Using only the multiplication rule and the axioms, prove the law of total probability $P(F)=\sum_iP(E_i)P(F\mid E_i)$ and Bayes' theorem. ($\{E_i\}$ is a partition of $\Omega$, $P(E_i)>0$)`,
        sol: R`
Since it is a partition, $F=F\cap\Omega=F\cap\bigcup_iE_i=\bigcup_i(F\cap E_i)$, and since the $E_i$ are disjoint, so are the $F\cap E_i$. Axiom 3: $P(F)=\sum_iP(F\cap E_i)$. By the definition of conditional probability, $P(F\cap E_i)=P(E_i)P(F\mid E_i)$ (the multiplication rule). Substituting gives the law of total probability.
Bayes: $P(E_i\mid F)=\frac{P(E_i\cap F)}{P(F)}=\frac{P(F\mid E_i)P(E_i)}{\sum_jP(F\mid E_j)P(E_j)}$ (assuming $P(F)>0$).`,
        rubric: R`
- Decomposing $F$ into disjoint pieces — 4 pts
- Axiom 3 and the multiplication rule — 3 pts
- Bayes' theorem — 3 pts` },
      // quizprep-a
      { q: R`$X_1,\dots,X_n$ are independent with $X_i\sim\operatorname{Poi}(\lambda)$, i.e., $P(X_i=k\mid\lambda)=e^{-\lambda}\lambda^k/k!$ ($\lambda\gt0$). The prior is the Gamma distribution $p(\lambda)\propto\lambda^{\alpha-1}e^{-\beta\lambda}$ ($\alpha\ge1$, $\beta\gt0$); let $S=\sum_iX_i$ and assume $S+\alpha-1\gt0$.
1. Show that the posterior is proportional to $\lambda^{S+\alpha-1}e^{-(n+\beta)\lambda}$, and derive the MAP estimator $\hat\lambda_{\text{MAP}}=\dfrac{S+\alpha-1}{n+\beta}$. (Confirm that it is a maximum.)
2. Write $\hat\lambda_{\text{MAP}}$ as a weighted average of the MLE $\bar X=S/n$ and the prior mode $(\alpha-1)/\beta$, and explain the meaning of the weights.
3. Fixing $\lambda$, compute the bias, variance, and MSE of $\hat\lambda_{\text{MAP}}$ over the sampling distribution of $X$. ($\E X_i=\Var X_i=\lambda$)`,
        sol: R`
**1.** By Bayes' theorem, $p(\lambda\mid X)\propto p(X\mid\lambda)p(\lambda)$. By independence the likelihood is a product:
$$p(X\mid\lambda)=\prod_{i=1}^n\frac{e^{-\lambda}\lambda^{X_i}}{X_i!}=\frac{e^{-n\lambda}\lambda^{S}}{\prod_iX_i!}.$$
$\prod_iX_i!$ does not depend on $\lambda$; dropping it, $p(\lambda\mid X)\propto\lambda^{S+\alpha-1}e^{-(n+\beta)\lambda}$. Taking logs, $\ell(\lambda)=(S+\alpha-1)\log\lambda-(n+\beta)\lambda+C$,
$$\ell'(\lambda)=\frac{S+\alpha-1}\lambda-(n+\beta)=0\ \Rightarrow\ \hat\lambda=\frac{S+\alpha-1}{n+\beta},\qquad \ell''(\lambda)=-\frac{S+\alpha-1}{\lambda^2}\lt0.$$
Since $\ell$ is concave this stationary point is the maximizer, and since $\log$ is increasing it is also the maximizer of the posterior.
**2.** $\hat\lambda=\dfrac n{n+\beta}\cdot\dfrac Sn+\dfrac\beta{n+\beta}\cdot\dfrac{\alpha-1}\beta$. The two weights sum to 1, and $\beta$ behaves like “the number of observations seen in advance” (with those pseudo-observations summing to $\alpha-1$). As $n\to\infty$ the weight on the MLE goes to 1 and the data beat the prior belief.
**3.** For an independent sum, $\E S=n\lambda$ and $\Var S=n\lambda$.
$$\text{bias}=\frac{n\lambda+\alpha-1}{n+\beta}-\lambda=\frac{\alpha-1-\beta\lambda}{n+\beta},\qquad\text{variance}=\frac{n\lambda}{(n+\beta)^2},$$
$$\mathrm{MSE}=\frac{(\alpha-1-\beta\lambda)^2+n\lambda}{(n+\beta)^2}.$$
Check: if the true value is the prior mode $\lambda=(\alpha-1)/\beta$, the bias is 0, and the variance $\frac{n\lambda}{(n+\beta)^2}$ is smaller than the MLE's MSE $\lambda/n$.`,
        rubric: R`
- Bayes' theorem + independence → product likelihood, dropping constants independent of $\lambda$ — 2 pts
- Derivative = 0 and the second derivative confirming a maximum — 2 pts
- The weighted-average form and its interpretation — 2 pts
- Bias, variance, MSE — 4 pts` },
      { q: R`We generalize Problem 2 of Problem Set 1. $X_1,\dots,X_n$ are independent, $X_i\sim\N(\theta,\sigma^2)$ ($\sigma^2$ known), with prior $\theta\sim\N(\mu_0,\tau^2)$.
1. Show that $\hat\theta_{\text{MAP}}=\argmin_\theta\Big[\sum_i(X_i-\theta)^2+\frac{\sigma^2}{\tau^2}(\theta-\mu_0)^2\Big]$, and find $\hat\theta_{\text{MAP}}=a\bar X+(1-a)\mu_0$ with $a=\dfrac{n\tau^2}{n\tau^2+\sigma^2}$.
2. Fixing $\theta$, compute the bias, variance, and MSE.
3. Show that $\mathrm{MSE}(\hat\theta_{\text{MAP}})\lt\mathrm{MSE}(\bar X)$ if and only if $(\theta-\mu_0)^2\lt2\tau^2+\dfrac{\sigma^2}n$. With $\mu_0=0$ and $\sigma^2=1$, what does this coincide with in Problem Set 1?`,
        sol: R`
**1.** $\log p(\theta\mid X)=-\frac1{2\sigma^2}\sum_i(X_i-\theta)^2-\frac1{2\tau^2}(\theta-\mu_0)^2+C$. Multiplying by the positive number $2\sigma^2$ and flipping the sign turns the maximization into the minimization of the bracket. With $\lambda=\sigma^2/\tau^2$,
$$-2\sum_i(X_i-\theta)+2\lambda(\theta-\mu_0)=0\ \Rightarrow\ \hat\theta=\frac{n\bar X+\lambda\mu_0}{n+\lambda},$$
and the second derivative $2(n+\lambda)\gt0$ makes it a minimizer. $a=\frac n{n+\lambda}=\frac{n\tau^2}{n\tau^2+\sigma^2}$, $1-a=\frac\lambda{n+\lambda}$.
**2.** Since $\E\bar X=\theta$, $\Var\bar X=\sigma^2/n$, and $\mu_0$ is a constant,
$$\text{bias}=a\theta+(1-a)\mu_0-\theta=(1-a)(\mu_0-\theta),\qquad\text{variance}=\frac{a^2\sigma^2}n,$$
$$\mathrm{MSE}=(1-a)^2(\theta-\mu_0)^2+\frac{a^2\sigma^2}n.$$
**3.** $\mathrm{MSE}(\bar X)=\sigma^2/n$. Dividing both sides of $(1-a)^2(\theta-\mu_0)^2\lt(1-a^2)\frac{\sigma^2}n$ by the positive number $1-a$ (an equivalence),
$$(\theta-\mu_0)^2\lt\frac{1+a}{1-a}\cdot\frac{\sigma^2}n=\frac{2n\tau^2+\sigma^2}{\sigma^2}\cdot\frac{\sigma^2}n=2\tau^2+\frac{\sigma^2}n.$$
With $\mu_0=0$ and $\sigma^2=1$ this is $\theta^2\lt2\tau^2+\frac1n$ — the “condition for MAP to beat the MLE” in the Problem Set 1 solution. The closer the true value is to the prior center $\mu_0$, the more shrinkage pays off.`,
        rubric: R`
- The log posterior and the argmin via a positive factor — 2 pts
- Stationary point, second-order condition, $a$ — 2 pts
- Bias (handling the constant $\mu_0$), variance, MSE — 3 pts
- The iff condition, stating the equivalence of dividing by a positive number — 3 pts` },
      { q: R`$X_1,\dots,X_n$ are independent, $X_i\sim\operatorname{Bern}(\theta)$, with prior $\operatorname{Beta}(2,2)$ (i.e., $p(\theta)\propto\theta(1-\theta)$) and $S=\sum_iX_i$.
1. Derive $\hat\theta_{\text{MAP}}=\dfrac{S+1}{n+2}$.
2. Fixing $\theta$, compute the bias, variance, and MSE.
3. Show that if $\theta=\frac12$, the MSE of MAP is smaller than that of the MLE $S/n$ for every $n\ge1$. If $\theta=1$, which is smaller? Give the reason in one sentence.`,
        sol: R`
**1.** $p(\theta\mid X)\propto\theta^S(1-\theta)^{n-S}\cdot\theta(1-\theta)=\theta^{S+1}(1-\theta)^{n-S+1}$. The derivative of the log:
$$\frac{S+1}\theta-\frac{n-S+1}{1-\theta}=0\ \Rightarrow\ (S+1)(1-\theta)=(n-S+1)\theta\ \Rightarrow\ \theta=\frac{S+1}{n+2}.$$
The second derivative $-\frac{S+1}{\theta^2}-\frac{n-S+1}{(1-\theta)^2}\lt0$ (both coefficients $\ge1$), so it is a maximizer.
**2.** Since $\E S=n\theta$ and $\Var S=n\theta(1-\theta)$,
$$\text{bias}=\frac{n\theta+1}{n+2}-\theta=\frac{1-2\theta}{n+2},\qquad\text{variance}=\frac{n\theta(1-\theta)}{(n+2)^2},$$
$$\mathrm{MSE}=\frac{(1-2\theta)^2+n\theta(1-\theta)}{(n+2)^2}.$$
**3.** $\theta=\frac12$: $\mathrm{MSE}_{\text{MAP}}=\frac{n/4}{(n+2)^2}$ and $\mathrm{MSE}_{\text{MLE}}=\frac{\theta(1-\theta)}n=\frac1{4n}$. $\frac n{(n+2)^2}\lt\frac1n\iff n^2\lt(n+2)^2$ always holds. $\theta=1$: the MLE is always exactly 1, so its MSE is 0, while MAP has $\frac1{(n+2)^2}\gt0$ — the MLE is better. The prior pulls the estimate toward $\frac12$, so when the true value is at an end, that pull is pure loss (bias).`,
        rubric: R`
- Expanding the posterior and deriving the MAP (including the maximum check) — 3 pts
- Bias, variance, MSE — 4 pts
- Comparing the two cases with the reason — 3 pts` },
      { q: R`Fix an input $x$ and let the new observation be $Y=f(x)+\varepsilon$, $\E\varepsilon=0$, $\Var\varepsilon=\sigma^2$. The predictor $\hat f(x)$ is a function of the training data $D$, and $\varepsilon$ is independent of $D$.
1. Prove $\E_{D,\varepsilon}\big[(Y-\hat f(x))^2\big]=\sigma^2+\big(\E_D\hat f(x)-f(x)\big)^2+\Var_D\big(\hat f(x)\big)$.
2. Name the three terms, state what they mean, and say which one no predictor can reduce.
3. In the setting of Problem 2 of Problem Set 1, find the expected squared prediction error when a new observation $Y\sim\N(\theta,1)$ (independent of the data) is predicted by $\hat\theta_{\text{MAP}}$.`,
        sol: R`
**1.** Since $Y-\hat f=\varepsilon+(f-\hat f)$, $(Y-\hat f)^2=\varepsilon^2+2\varepsilon(f-\hat f)+(f-\hat f)^2$. Taking expectations,
- $\E\varepsilon^2=\Var\varepsilon=\sigma^2$ ($\E\varepsilon=0$).
- $\hat f$ is a function of $D$ only and $\varepsilon$ is independent of $D$, so $\E[\varepsilon(f-\hat f)]=\E\varepsilon\cdot\E(f-\hat f)=0$.
- $\E_D(\hat f-f)^2=(\E\hat f-f)^2+\Var\hat f$: the bias–variance decomposition of Problem Set 1, Problem 2-3, with $\hat\theta=\hat f$ and $\theta=f$ (add and subtract $\mu=\E\hat f$ and expand; the cross term is 0 because $\E[\hat f-\mu]=0$ and $\mu-f$ is a constant).
Adding the three results gives the identity. $\blacksquare$
**2.** $\sigma^2$: irreducible noise (no predictor can reduce it). The second term: bias², how far the model misses on average. The third term: variance, how much the prediction fluctuates when the training data change.
**3.** $\sigma^2=1$, and the sum of the second and third terms is the MSE of $\hat\theta_{\text{MAP}}$, so
$$1+\frac{\theta^2+n\tau^4}{(n\tau^2+1)^2}.$$`,
        rubric: R`
- Splitting the error into $\varepsilon+(f-\hat f)$ and expanding — 1 pt
- Why the cross term is 0 (independence and $\E\varepsilon=0$) — 2 pts
- Applying the bias–variance decomposition (including the cross term) — 2 pts
- Interpreting the terms — 2 pts
- The numerical expression — 3 pts` },
      { q: R`$X_i\mid\theta\sim\N(\theta,1)$ (independent), with prior $\theta\sim\N(0,\tau^2)$.
1. Show by completing the square that after one observation $x_1$ the posterior is $\N(m_1,v_1)$ with $\dfrac1{v_1}=1+\dfrac1{\tau^2}$ and $m_1=v_1x_1$.
2. Taking this posterior as the new prior and updating once more with $x_2$, show that the result is $\N(m_2,v_2)$ with $\dfrac1{v_2}=2+\dfrac1{\tau^2}$ and $m_2=v_2(x_1+x_2)$.
3. Check that this equals the posterior using both observations at once ($n=2$ in Problem 2 of Problem Set 1: mean $a\bar X$, variance $\frac1{n+1/\tau^2}$), and explain with the product of likelihoods why it must.`,
        sol: R`
**1.** $\log p(\theta\mid x_1)=-\frac12(x_1-\theta)^2-\frac{\theta^2}{2\tau^2}+C=-\frac12\Big[\frac1{v_1}\theta^2-2x_1\theta\Big]+C'$. Completing the square in the bracket gives $\frac1{v_1}(\theta-v_1x_1)^2-v_1x_1^2$, so
$$\log p(\theta\mid x_1)=-\frac{(\theta-v_1x_1)^2}{2v_1}+C''$$
— the log density (up to a constant) of a normal distribution with mean $m_1=v_1x_1$ and variance $v_1$.
**2.** $\log p(\theta\mid x_1,x_2)=-\frac{(\theta-m_1)^2}{2v_1}-\frac{(x_2-\theta)^2}2+C$. The coefficient of $\theta^2$, $-\frac12\big(\frac1{v_1}+1\big)$, gives $\frac1{v_2}=\frac1{v_1}+1=2+\frac1{\tau^2}$ (the precisions add). The coefficient of $\theta$, $\frac{m_1}{v_1}+x_2=x_1+x_2$, gives $m_2=v_2(x_1+x_2)$.
**3.** $n=2$: $a\bar X=\frac{2\tau^2}{2\tau^2+1}\cdot\frac{x_1+x_2}2=\frac{\tau^2(x_1+x_2)}{2\tau^2+1}$, and $v_2=\frac1{2+1/\tau^2}=\frac{\tau^2}{2\tau^2+1}$, so it equals $m_2=v_2(x_1+x_2)$ and the variances agree too. Reason: given $\theta$, $x_1$ and $x_2$ are independent, so
$$p(\theta\mid x_1,x_2)\propto p(x_2\mid\theta)\,\big[p(x_1\mid\theta)\,p(\theta)\big]\propto p(x_2\mid\theta)\,p(\theta\mid x_1).$$
Because the likelihood is a product, multiplying one factor at a time or all at once gives the same result (the same principle as the sequential Beta update of §2.5).`,
        rubric: R`
- Reading off the mean and variance by completing the square — 3 pts
- Precision and mean of the sequential update — 3 pts
- Checking agreement with the batch posterior — 2 pts, explaining why by the product of likelihoods — 2 pts` },
    ],
  };
})();
