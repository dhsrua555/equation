/* English text — 01 Linear Regression & Normal Equations (W1 Wed slides 3–12, handwritten note on slide 6).
   Each body mirrors the Korean original piece by piece; the Korean stays as the KO translation. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.en = EM.en || { ch: {}, pf: {}, ex: {}, qz: {}, fig: {} };
(function () {
  const R = String.raw;
  Object.assign(EM.en.fig, {
    lsqfit: R`The vertical segments are the residuals $y_i-\hat y_i$. (a) The sum of squared errors of the least-squares line is $0.01+0.04+0.49+0.16=0.70$; (b) the horizontal line that predicts every point by the mean $\bar y=2.25$ has sum of squared errors $4.75$. Giving the line a slope reduces the error from $4.75\to0.70$, and the ratio $1-0.70/4.75\approx0.85$ is called the coefficient of determination $R^2$.`,
    sseslope: R`Rotating a line through the centroid $(1.5,\,2.25)$ by slope $m$ and plotting the sum of squared errors gives $\mathrm{SSE}(m)=4.75-9m+5m^2$, a **parabola opening upward**. Starting from the horizontal line ($m=0$), the SSE first decreases, reaches its minimum $0.70$ at $m=0.9$, and then increases again. This is exactly the slide's picture: “if we slightly rotate the line, the SSE drops from 24.62 to 16.5, and then it increases again”.`,
    gdpath: R`Thin curves are points with equal sum of squared errors (level sets); the open circle is the minimizer $(0.9,\,0.9)$. We start at $(0,0)$ with the slide's rule $\beta\leftarrow\beta+\alpha X^T(y-X\beta)$. Because the level sets are elongated ellipses, (a) the iterates come down the steep direction quickly but crawl slowly along the flat long axis, and (b) with a learning rate close to the limit $2/\lambda_{\max}(X^TX)\approx0.119$ they zigzag across the steep direction on the way down.`,
  });
  EM.en.ch[1] = {
    title: 'Linear Regression & Normal Equations',
    fig: R`Lines rotating through the data points and their centroid; the bold line minimizes the sum of squared errors`,
    tagline: R`Differentiate the sum of squared errors $\lVert y-X\beta\rVert^2$ with respect to a vector and set it to zero: the normal equations appear. Every derivation in this course starts from this computation.`,
    summary: R`We look for the line (in general, the linear model $y=X\beta+\varepsilon$) that best explains the data $(x_i,y_i)$. If “best” is taken to mean **the smallest sum of squared errors**, the problem becomes the minimization of the function $f(\beta)=\lVert y-X\beta\rVert^2$ of $\beta$. In class we proved two vector-derivative formulas by hand, $\nabla_\beta(\beta^Tm)=m$ and $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$, and used them to derive the normal equations $X^TX\beta=X^Ty$. We also solve the same objective by gradient descent and discuss its drawback (each step must sweep the whole data set). The computation in this unit (expand → transpose a scalar → differentiate → set to zero) is repeated verbatim for logistic regression, ridge, kernels, and neural networks.`,
    goals: [
      R`Write the linear regression model in matrix form $y=X\beta+\varepsilon$ and state the size of $X$ and the meaning of its first column`,
      R`Prove $\nabla_\beta(\beta^Tm)=m$ and $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$ componentwise`,
      R`Expand and differentiate $f(\beta)=\lVert y-X\beta\rVert^2$ to derive the normal equations and $\hat\beta=(X^TX)^{-1}X^Ty$`,
      R`Explain when $X^TX$ is invertible and why the solution is a minimum (the Hessian $2X^TX\succeq0$)`,
      R`Write the gradient descent update $\beta_l\leftarrow\beta_l-\alpha\,\partial f/\partial\beta_l$ componentwise and state its drawback`,
      R`Explain the geometric meaning that the residual is orthogonal to the column space of $X$, and why a learning rate that is too large diverges`,
    ],
    secTitles: { '1.1': 'Model & least squares', '1.2': 'Vector derivatives', '1.3': 'Normal equations', '1.4': 'SSE view', '1.5': 'Gradient descent' },
    secs: {
      '1.1': { title: 'Linear Regression Model and the Sum of Squared Errors', body: R`
:::idea In plain words
Suppose we want to predict weight from height. If we plot a few people's (height, weight) as points, we see a band rising to the upper right. Summarizing this band by **a single line** is linear regression. In the line $\hat y=\beta_0+\beta_1x$, $\beta_1$ is “how much the weight increases on average when the height increases by 1” (the slope), and $\beta_0$ is the starting height (the intercept).
A line cannot pass through every point, so each point has a **miss** (the residual) $y_i-\hat y_i$. We collect all the misses into one score and **define** the line with the smallest score to be “the best line”.
:::

### The model: several explanatory variables

Suppose there are $n$ data points and $k$ explanatory variables. The $i$-th data point is $(x_{i1},\dots,x_{ik},\,y_i)$, and usually $n>k$. The linear regression model is
$$y_i=\beta_0+\sum_{j=1}^{k}x_{ij}\beta_j+\varepsilon_i,\qquad i=1,\dots,n$$
where $\varepsilon_i$ is the error the model cannot explain (measurement noise, missing variables, and so on). “Linear” means linear **in the coefficients $\beta$**, not in $x$. So even if we feed in processed variables such as $x_{i2}=x_{i1}^2$, it is still linear regression[[ch04:4.2|Polynomial regression is also linear regression, with the columns of the design matrix set to $1,x,x^2,\dots$.]].

### Writing it in one line with matrices

Instead of writing the $n$ equations separately, we collect them into vectors and a matrix[[@em:ch06:7.2|The $(i,j)$ entry of the matrix product $AB$ is the inner product of row $i$ of $A$ and column $j$ of $B$.]].
$$y=\begin{pmatrix}y_1\\\vdots\\y_n\end{pmatrix},\quad X=\begin{pmatrix}1&x_{11}&\cdots&x_{1k}\\\vdots&\vdots&&\vdots\\1&x_{n1}&\cdots&x_{nk}\end{pmatrix},\quad \beta=\begin{pmatrix}\beta_0\\\vdots\\\beta_k\end{pmatrix},\quad y=X\beta+\varepsilon$$
The $i$-th entry of $X\beta$ is the inner product of row $i$ of $X$ with $\beta$, $1\cdot\beta_0+x_{i1}\beta_1+\dots+x_{ik}\beta_k$, which is exactly the $n$ equations above. $X$ is called the **design matrix** and has size $n\times(k+1)$. **The first column is all ones** so that it multiplies the intercept $\beta_0$ (a “dummy variable that is always 1”, $x_{i0}=1$).

:::ex Example 1 — Building a design matrix
Three students have (study hours $x_1$, sleep hours $x_2$, score $y$) equal to $(2,7,70)$, $(4,6,80)$, $(5,8,92)$. Write $X$ and $y$ in $y=X\beta+\varepsilon$, and find the predictions and errors when $\beta=(40,5,3)^T$.
---
$$X=\begin{pmatrix}1&2&7\\1&4&6\\1&5&8\end{pmatrix}\ (3\times3),\qquad y=\begin{pmatrix}70\\80\\92\end{pmatrix}.$$
$X\beta=(40+10+21,\ 40+20+18,\ 40+25+24)^T=(71,78,89)^T$. The errors are $\varepsilon=y-X\beta=(-1,2,3)^T$, and the sum of squared errors is $1+4+9=14$.
:::

### Keeping score: the sum of squared errors

:::def Least-squares objective
We view the sum of squared errors as a function of $\beta$.
$$\begin{aligned}f(\beta)&:=\sum_{i=1}^n\varepsilon_i^2=\sum_{i=1}^n\Big(y_i-\beta_0-\sum_{j=1}^kx_{ij}\beta_j\Big)^2\\&=\lVert y-X\beta\rVert^2=(y-X\beta)^T(y-X\beta)\end{aligned}$$
The $\hat\beta$ that minimizes $f$ is called the **least-squares estimator** (LSE).
:::

The last equality is the fact that the squared length of a vector $v$ is $\lVert v\rVert^2=v_1^2+\dots+v_n^2=v^Tv$ ($v^T$ is $v$ laid down as a row vector).

**Why squares?** There are three reasons.
- (a) If we simply add the residuals, $+3$ and $-3$ cancel. We must remove the sign.
- (b) The absolute value $\lvert\varepsilon_i\rvert$ also removes the sign but is not differentiable at 0. The square is differentiable everywhere, so “differentiate and set to zero” works and the answer comes out as a single formula.
- (c) If the errors are assumed to be normally distributed, minimizing the sum of squared errors is exactly the same as **maximum likelihood estimation**[[ch04:4.1|With noise $\mathcal N(0,\sigma^2)$ the log-likelihood is $-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2+$const.]]. The square is not an arbitrary choice but one that comes from a probability model.

On the other hand, the square punishes large errors heavily, so a single outlier can drag the line toward it.

:::fig lsqfit
:::

:::tip Check the sizes first
In a derivation, write down the size of every term first; then you will not be confused about where to put a transpose. Since $y:n\times1$, $X:n\times(k+1)$, $\beta:(k+1)\times1$, both $X^Ty$ and $X^TX\beta$ are $(k+1)\times1$ and $X^TX$ is $(k+1)\times(k+1)$. A product $AB$ is defined only when the number of columns of $A$ equals the number of rows of $B$, and the result has size (rows of A)×(columns of B).
:::

### Going deeper: the language of mean and variance

$f(\beta)/n$ is called the **mean squared error** (MSE). A constant factor does not move the minimizer, so minimizing the SSE or the MSE gives the same $\hat\beta$. In machine learning the MSE is used more often because it can be compared regardless of the sample size. Also, in a model with an intercept, the optimal $\hat\beta_0$ is always $\bar y-\sum_j\hat\beta_j\bar x_j$ (end of §1.3), so the line always passes through the **centroid** $(\bar x,\bar y)$.
` },
      '1.2': { title: 'Two Formulas for Vector Derivatives', body: R`
:::idea In plain words
With one variable, a minimizer is where “the derivative = 0”. With several variables $\beta_0,\beta_1,\dots$ we must make the derivative in each variable's direction (the partial derivative) **all** zero. The vector obtained by stacking the partial derivatives is the **gradient** $\nabla_\beta g$, and the condition becomes the single line $\nabla_\beta g=0$.
With one variable we had $\frac{d}{dx}(mx)=m$ and $\frac{d}{dx}(ax^2)=2ax$. Formulas of almost the same shape hold for vectors, and those two formulas are all we need to derive the normal equations.
:::

For a scalar function $g(\beta)$ ($\beta\in\mathbb R^p$) the gradient is
$$\nabla_\beta g=\Big(\frac{\partial g}{\partial\beta_1},\ \dots,\ \frac{\partial g}{\partial\beta_p}\Big)^T$$
[[@em:ch08:9.7|The gradient is the vector of partial derivatives and points in the direction in which the function increases fastest.]]. The partial derivative $\partial g/\partial\beta_l$ is “the derivative in $\beta_l$ alone, holding the other variables constant”[[@base:ch04:4.1|Partial derivatives and linear approximation.]].

:::key Matrix derivative formulas
$$\nabla_\beta\big(\beta^Tm\big)=\nabla_\beta\big(m^T\beta\big)=m,\qquad \nabla_\beta\big(\beta^TA\beta\big)=(A+A^T)\beta$$
If $A$ is symmetric, $\nabla_\beta(\beta^TA\beta)=2A\beta$.
:::

### Proof (handwritten note in class)

:::hand Lecture note — showing it componentwise
(a) Since $\beta^Tm=\beta_1m_1+\beta_2m_2+\beta_3m_3$, taking $\partial/\partial\beta_l$ leaves only $m_l$. Collecting them, $\nabla_\beta(\beta^Tm)=m$.

(b) When we differentiate $\beta^TA\beta=\sum_{i,j}\beta_iA_{ij}\beta_j$ with respect to $\beta_k$, there are two kinds of terms containing $\beta_k$.
- (i) Terms with $i=k$: $\sum_jA_{kj}\beta_j=(A\beta)_k$
- (ii) Terms with $j=k$: $\sum_i\beta_iA_{ik}=(A^T\beta)_k$

The term with $i=j=k$, $A_{kk}\beta_k^2$, appears once in each place, and its derivative $2A_{kk}\beta_k$ is split exactly in half between the two sums. Hence $\dfrac{\partial}{\partial\beta_k}\beta^TA\beta=(A\beta)_k+(A^T\beta)_k$, that is, $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$.
:::

If (b) is confusing, look at it with the product rule. $\beta$ appears twice in $\beta^TA\beta$. If only the front $\beta$ is treated as the variable, we have $\beta^T(A\beta)$, form (a) with $m=A\beta$, giving $A\beta$. If only the back $\beta$ is the variable, we have $(\beta^TA)\beta=(A^T\beta)^T\beta$, form (a) with $m=A^T\beta$, giving $A^T\beta$. Adding them gives $(A+A^T)\beta$ — exactly the same structure as $(uv)'=u'v+uv'$ in one variable.

:::ex Example 2 — Checking directly in two dimensions
For $A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$ and $\beta=(\beta_1,\beta_2)^T$, expand $\beta^TA\beta$, find the gradient, and compare with the formula.
---
$\beta^TA\beta=\beta_1^2+2\beta_1\beta_2+3\beta_2^2$ (there is no $\beta_2\beta_1$ term because $A_{21}=0$).
Partial derivatives: $\partial/\partial\beta_1=2\beta_1+2\beta_2$, $\partial/\partial\beta_2=2\beta_1+6\beta_2$.
Formula: $A+A^T=\begin{pmatrix}2&2\\2&6\end{pmatrix}$, $(A+A^T)\beta=(2\beta_1+2\beta_2,\ 2\beta_1+6\beta_2)^T$. They agree.
:::

:::warn Do not use 2Aβ for a nonsymmetric matrix
If $A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$, then $\beta^TA\beta=\beta_1\beta_2$ and its gradient is $(\beta_2,\beta_1)^T=(A+A^T)\beta$. $2A\beta=(2\beta_2,0)^T$ is wrong. But since $\beta^TA\beta=\beta^T\tfrac{A+A^T}{2}\beta$, you may always think of keeping only the symmetric part.
:::

### Corollaries used again and again

Combining the two basic formulas gives the formulas we use throughout the course.
- $\nabla_\beta\lVert\beta\rVert^2=\nabla_\beta(\beta^TI\beta)=2\beta$ (the gradient of the ridge penalty[[ch04:4.3|Differentiating the ridge term $\lambda\lVert\beta\rVert^2$ gives $2\lambda\beta$.]])
- $\nabla_\beta\lVert A\beta-b\rVert^2=2A^T(A\beta-b)$ (holds even if $A$ is not square)
- $\nabla_\beta\,(c^T\beta+d)=c$ (the constant $d$ disappears)

The second follows by applying the two formulas to the expansion $\lVert A\beta-b\rVert^2=\beta^TA^TA\beta-2b^TA\beta+b^Tb$, which gives $2A^TA\beta-2A^Tb$.

### Going deeper: the gradient is the coefficient of the first-order approximation

The gradient is the vector satisfying $g(\beta+h)=g(\beta)+\nabla g(\beta)^Th+o(\lVert h\rVert)$. For example, if $g=\beta^TA\beta$ then
$$g(\beta+h)=\beta^TA\beta+\beta^TAh+h^TA\beta+h^TAh=g(\beta)+\big((A+A^T)\beta\big)^Th+O(\lVert h\rVert^2)$$
so $(A+A^T)\beta$ comes out without any componentwise computation. When computing gradients with respect to matrix variables in neural-network backpropagation, this “read off the first-order term” method is the fastest[[ch09:9.5|For vector inputs and outputs, the Jacobian plays the same role.]]. Whether the gradient is written as a column or a row vector (denominator/numerator layout) differs from book to book; like this course, stick to **column vectors**.
` },
      '1.3': { title: 'Normal Equations and the Least-Squares Solution', body: R`
:::idea In plain words
The sum of squared errors $f(\beta)$ is a “bowl-shaped” surface in $\beta$ (a quadratic function that is convex, opening upward). At the bottom of the bowl the slope is zero in every direction. So solving $\nabla f=0$ gives the bottom, that is, the best line. This equation is called the **normal equations**.
:::

### Derivation: expand → combine → differentiate → set to zero

**Step 1 (expand).** Multiply out $f(\beta)=(y-X\beta)^T(y-X\beta)$ by the distributive law. Since $(X\beta)^T=\beta^TX^T$ (the transpose of a product reverses the order),
$$f(\beta)=y^Ty-y^TX\beta-\beta^TX^Ty+\beta^TX^TX\beta.$$

**Step 2 (combine by transposing a scalar).** $y^TX\beta$ is $(1\times n)(n\times p)(p\times1)=1\times1$, that is, **a single number**. A number equals its own transpose, so $y^TX\beta=(y^TX\beta)^T=\beta^TX^Ty$. Therefore
$$f(\beta)=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta.$$

**Step 3 (take the gradient).** In the formulas of §1.2 put $m=X^Ty$ and $A=X^TX$. Since $A^T=(X^TX)^T=X^TX=A$ (symmetric), $(A+A^T)\beta=2X^TX\beta$. The first term $y^Ty$ is a constant independent of $\beta$, so its gradient is zero.
$$\nabla_\beta f=-2X^Ty+2X^TX\beta.$$

**Step 4 (set it to zero).**

:::key Normal equations
$$\nabla_\beta f(\beta)=-2X^T(y-X\beta)=0\iff X^TX\beta=X^Ty$$
If $X^TX$ is invertible, $\hat\beta=(X^TX)^{-1}X^Ty$.
:::

### Two checks: does a solution exist, and is it a minimum?

**When is it invertible?** $X^TX$ is invertible $\iff$ the columns of $X$ are linearly independent ($\operatorname{rank}X=k+1$). This is because $X^TXv=0$ implies $v^TX^TXv=\lVert Xv\rVert^2=0$, hence $Xv=0$[[@em:ch06:7.4|Rank and linear independence. If the columns are linearly independent, the only solution of $Xv=0$ is $v=0$.]]. So if the columns are linearly independent, $v=0$ is the only possibility, the null space of $X^TX$ is $\{0\}$, and $X^TX$ is invertible. Conversely, if the columns are dependent, there is $v\ne0$ with $Xv=0$, so $X^TXv=0$ and $X^TX$ is not invertible. The condition fails when there are fewer data points than variables ($n<k+1$). It also fails if the same variable is entered twice in different units (for example cm and m), because the columns are proportional.

**Why is it a minimum?** The Hessian (the matrix of second derivatives) is $\nabla^2f=2X^TX$, and for every $v$, $v^T(2X^TX)v=2\lVert Xv\rVert^2\ge0$, so $f$ is convex[[@base:ch04:4.3|If the Hessian is positive semidefinite the function is convex, and a critical point is a minimum.]]. For a convex function, a point where the gradient vanishes is a global minimizer. If the columns are linearly independent, $2X^TX\succ0$ and the minimizer is unique.

### Geometric meaning: orthogonal projection

The normal equations say $X^T(y-X\hat\beta)=0$, i.e., the residual $r=y-\hat y$ is orthogonal to **every column** of $X$. The set of all vectors $X\beta$ (the column space) is a plane inside $\mathbb R^n$, and $y$ usually lies off that plane. The point of the plane closest to $y$ is the **foot of the perpendicular** dropped from $y$ onto the plane[[@em:ch06:7.9c|In an inner-product space, the orthogonal projection onto a subspace is the best approximation.]]. That foot is $\hat y=X\hat\beta=X(X^TX)^{-1}X^Ty$, and $H=X(X^TX)^{-1}X^T$ is called the **hat matrix** ($H^T=H$, $H^2=H$ — a point already on the plane stays put when projected again).

We can also show it is a minimum without calculus. For any $\beta$, $y-X\beta=(y-X\hat\beta)+X(\hat\beta-\beta)$ and the two terms are orthogonal (the first is orthogonal to the column space, the second lies in it), so by the Pythagorean theorem
$$\lVert y-X\beta\rVert^2=\lVert y-X\hat\beta\rVert^2+\lVert X(\hat\beta-\beta)\rVert^2\ge\lVert y-X\hat\beta\rVert^2.$$

### Examples

:::ex Example 3 — Fitting a line to four points
Fit $y=\beta_0+\beta_1x$ to $(x,y)=(0,1),(1,2),(2,2),(3,4)$.
---
$X^TX=\begin{pmatrix}n&\sum x\\\sum x&\sum x^2\end{pmatrix}=\begin{pmatrix}4&6\\6&14\end{pmatrix}$, $X^Ty=\begin{pmatrix}\sum y\\\sum xy\end{pmatrix}=\begin{pmatrix}9\\18\end{pmatrix}$.
Since $\det=56-36=20$,
$$\hat\beta=\frac1{20}\begin{pmatrix}14&-6\\-6&4\end{pmatrix}\begin{pmatrix}9\\18\end{pmatrix}=\frac1{20}\begin{pmatrix}18\\18\end{pmatrix}=\begin{pmatrix}0.9\\0.9\end{pmatrix}.$$
The residuals are $0.1,\,0.2,\,-0.7,\,0.4$; their sum is 0 and the sum of their products with $x$ is $0+0.2-1.4+1.2=0$, so the normal equations hold. The minimal sum of squared errors is $0.70$.
:::

For simple regression ($k=1$), solving the normal equations by hand gives formulas that are easy to remember. Dividing the first equation $n\beta_0+\beta_1\sum x_i=\sum y_i$ by $n$ gives $\hat\beta_0=\bar y-\hat\beta_1\bar x$ (the line passes through the centroid). Substituting into the second equation and simplifying gives
$$\hat\beta_1=\frac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2}=\frac{S_{xy}}{S_{xx}}.$$
In Example 3, $\bar x=1.5$, $\bar y=2.25$, $S_{xx}=2.25+0.25+0.25+2.25=5$, $S_{xy}=4.5$, so $\hat\beta_1=0.9$ and $\hat\beta_0=2.25-1.35=0.9$. The same answer.

:::ex Example 4 — A line without intercept
Fit $y=\beta x$ to $x=(1,2,3)$, $y=(2,4,5)$.
---
$X=(1,2,3)^T$ has a single column, so $X^TX=1+4+9=14$, $X^Ty=2+8+15=25$, $\hat\beta=25/14\approx1.786$. Without an intercept the residuals need not sum to 0 ($2-1.786+4-3.571+5-5.357=0.286$). The residual is orthogonal only to **the columns of $X$**, and since there is no column of ones, there is no reason for the sum to be 0.
:::

:::warn Before memorizing the inverse formula
In a “derive” problem on an exam, writing only $\hat\beta=(X^TX)^{-1}X^Ty$ earns almost no points. Write it in order: expand → combine the two terms by transposing a scalar → the two derivative formulas → set to zero → the invertibility condition.
:::

### Going deeper: actual computation, and when it is not invertible

- A computer does not form $(X^TX)^{-1}$ directly. The condition number of $X^TX$ is the **square** of that of $X$, so numerical errors grow. Usually one factors $X=QR$ and solves $R\beta=Q^Ty$, or uses the singular value decomposition.
- If $X^TX$ is not invertible, the normal equations have infinitely many solutions (all giving the same $\hat y$). Among them the one with the smallest $\lVert\beta\rVert$ is given by the Moore–Penrose pseudoinverse, $X^+y$. Another remedy is **ridge**, which replaces $X^TX$ by $X^TX+\lambda I$ ($\lambda>0$); this matrix is always positive definite and hence invertible[[ch04:4.3|The ridge solution $(X^TX+\lambda I)^{-1}X^Ty$.]].
- The cost is $O(nk^2)$ to form $X^TX$ and $O(k^3)$ to solve. For a neural network with millions of variables this is impossible, so we use gradient descent.
` },
      '1.4': { title: 'Linear Regression (ML Approach): Which Line Is the “Best”?', body: R`
:::idea In plain words
Machine learning means “instead of a person writing the rule, let the computer look at the data and choose the rule with **the best score**”. For that we must decide three things: (1) the shape of the candidate rules (here, lines), (2) how to score them (the sum of squared errors), and (3) how to find the best score (the normal equations or gradient descent).
:::

In machine learning, “the line that explains the data set well” is defined as the minimizer of an objective function. The slides illustrate it as follows.

- **The horizontal line** that predicts the mean at every $x$ is our benchmark line; its sum of squared errors (residuals) is $24.62$
- What happens if we slightly **rotate** the line? The sum of squared errors decreases to $16.5$
- If we plot the SSE for each rotated line, then it **first decreases and then increases** → the lowest point is the best line

So the objective function is the sum of squared errors (SSE); the normal equations of §1.3 compute this lowest point in one shot, and the gradient descent of §1.5 walks down toward it little by little. The SSE is bowl-shaped, “first decreasing and then increasing”, because $f$ is convex.

:::fig sseslope
:::

### Vocabulary

| Term | In this unit | In general |
|---|---|---|
| Model (hypothesis) | $\hat y=X\beta$ | A function $f(x;\theta)$ sending inputs to outputs |
| Parameters | $\beta$ | Values $\theta$ learned from data (the weights of a neural network) |
| Loss (objective) | $\lVert y-X\beta\rVert^2$ | A score of how wrong the predictions are |
| Learning (training) | Normal equations or gradient descent | The process of minimizing the loss |
| Benchmark | Predict by the mean $\bar y$ | A predictor that has learned nothing |

### The benchmark line and the coefficient of determination

The sum of squared errors of the benchmark (the horizontal line $\hat y=\bar y$), $S_{yy}=\sum(y_i-\bar y)^2$, is called the **total sum of squares**. The fraction of it that the model removes,
$$R^2=1-\frac{\mathrm{SSE}}{S_{yy}}$$
is called the **coefficient of determination**. In Example 3 (§1.3), $S_{yy}=4.75$ and $\mathrm{SSE}=0.70$, so $R^2\approx0.853$ — the line explains about 85% of the spread of $y$. For the slide's data, $1-16.5/24.62\approx0.33$ is the value “halfway through the rotation”; at the best line it is larger.

:::warn A small training error does not mean a good model
If we use a very wiggly curve instead of a line, we can drive the SSE all the way to 0. But on new data it performs terribly (overfitting). This problem is treated with polynomial regression and regularization in Unit 4[[ch04:4.2|Fitting a degree-9 polynomial to 10 points gives zero training error but poor predictions.]].
:::
` },
      '1.5': { title: 'Gradient Descent Algorithm', body: R`
:::idea In plain words
How do you reach the lowest point of a mountain in thick fog? Feel the slope under your feet, take **one step in the steepest downhill direction**, feel the slope again, take another step… This is gradient descent. The size of one step is the **learning rate** $\alpha$. Too small and it takes forever; too large and you jump over the valley and bounce up the opposite wall.
:::

We can approach the minimizer of $f$ without computing an inverse. From the current position we move a little in the direction opposite to the gradient[[ch13:13.1|Why the negative gradient is the direction of fastest descent is shown in Unit 13 with the Taylor expansion.]].

### Computing the partial derivatives

With $x_{i0}=1$, $f(\beta)=\sum_i\big(y_i-\sum_{j=0}^k\beta_jx_{ij}\big)^2$. Differentiating in $\beta_l$ by the chain rule, and noting that the derivative of the bracket in $\beta_l$ is $-x_{il}$,
$$\begin{aligned}\frac{\partial f}{\partial\beta_l}&=\sum_{i=1}^n2\Big(y_i-\sum_j\beta_jx_{ij}\Big)\cdot(-x_{il})\\&=-2\sum_{i=1}^n\Big(y_i-\big(\beta_0+\sum_{j=1}^k\beta_jx_{ij}\big)\Big)x_{il},\qquad 0\le l\le k.\end{aligned}$$
Collected into a vector, $\nabla f=-2X^T(y-X\beta)$ — the same expression as in §1.3.

:::key Gradient descent update (linear regression)
$$\beta_l\leftarrow\beta_l-\alpha\frac{\partial f}{\partial\beta_l}=\beta_l+2\alpha\sum_{i=1}^n\big(y_i-\hat y_i\big)x_{il}\qquad(0\le l\le k)$$
The slide absorbs the constant 2 into the learning rate $\alpha$ and writes $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$. Update all $l$ **simultaneously** and repeat until convergence.
:::

The update is easy to read. If a prediction falls short ($y_i-\hat y_i>0$), $\beta_l$ is increased in the direction of that data point's $x_{il}$; if it overshoots, $\beta_l$ is decreased. Data points with larger errors pull harder.

- **Advantage**: it is the natural method of moving in the direction of steepest descent. It needs no inverse, and it works as is even when the model is not linear (neural networks).
- **Drawback**: before taking one step we must sweep **the whole training set** to compute the sum $\sum_{i=1}^n$. With a lot of data it is slow → the stochastic (mini-batch) gradient descent of Unit 10[[ch10:10.1|Estimate the gradient from part of the data instead of the full batch.]].

### Examples

:::ex Example 5 — Computing one step
For the data of Example 3, start at $\beta=(0,0)$ with $\alpha=0.01$ and apply the slide rule $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$ once.
---
Since $\hat y_i=0$, $\beta_0\leftarrow0.01\sum y_i=0.09$ and $\beta_1\leftarrow0.01\sum x_iy_i=0.18$. Both components must be computed **from the old values** at the same time.
:::

:::ex Example 6 — The second step and the change in the loss
Continuing Example 5, update once more and watch how the sum of squared errors changes.
---
At $\beta=(0.09,0.18)$ the predictions are $\hat y=(0.09,0.27,0.45,0.63)$ and the residuals $r=(0.91,1.73,1.55,3.37)$.
$\sum r_i=7.56$ and $\sum r_ix_i=0+1.73+3.10+10.11=14.94$, so $\beta\leftarrow(0.09+0.0756,\ 0.18+0.1494)=(0.1656,\ 0.3294)$.
The sum of squared errors decreases $25\to17.58\to12.44$ ($8.89$ after the third step). Continuing, $\beta$ approaches $(0.9,0.9)$.
:::

### The limit on the learning rate

Because the loss is quadratic, we can compute the behavior of gradient descent exactly. The slide rule is $\beta\leftarrow\beta+\alpha X^T(y-X\beta)$, and at the minimizer $\hat\beta$ we have $X^Ty=X^TX\hat\beta$, so the error $e=\beta-\hat\beta$ changes as
$$e\leftarrow(I-\alpha X^TX)\,e$$
If the eigenvalues of $X^TX$ are $\lambda_1\ge\dots\ge\lambda_p>0$, then along each eigenvector direction $e$ is multiplied by $(1-\alpha\lambda_i)$[[@em:ch07:8.4|A symmetric matrix is diagonalized by orthogonal eigenvectors.]]. Therefore
$$\text{convergence}\iff\lvert1-\alpha\lambda_i\rvert<1\ \ \forall i\iff0<\alpha<\frac2{\lambda_{\max}(X^TX)}.$$
In Example 3, the eigenvalues of $X^TX=\begin{pmatrix}4&6\\6&14\end{pmatrix}$ are $9\pm\sqrt{61}\approx16.81,\ 1.19$, so the limit is $2/16.81\approx0.119$. Running 200 steps with $\alpha=0.12$ diverges to $\beta\approx(-14.6,-32.1)$.

:::fig gdpath
:::

As the figure shows, when the ratio of the two eigenvalues (the **condition number** $\lambda_{\max}/\lambda_{\min}\approx14$) is large, the level sets become elongated and gradient descent slows down, because the slowest direction shrinks only by a factor $1-\alpha\lambda_{\min}$ per step. This is why **standardizing** the inputs to mean 0 and variance 1 helps[[ch12:12.3|Batch normalization does this standardization at every layer.]], and it is the problem that momentum and Adam in Week 5 try to solve[[ch14:14.1|Poor conditioning: a loss that is steep in one direction and flat in another.]].

:::tip Simultaneous update
If you change $\beta_0$ first and then use the new value to compute the residuals for $\beta_1$, it is no longer gradient descent (it becomes closer to coordinate descent). In code, compute the whole gradient vector first and subtract it in one go.
:::
` },
    },
    probs: [
      // u01
      { q: R`In a linear regression with $n=50$ data points and $k=3$ explanatory variables, what is the size of the design matrix $X$?`,
        choices: [R`$50\times3$`, R`$50\times4$`, R`$3\times50$`, R`$4\times4$`],
        sol: R`A column of ones for the intercept $\beta_0$ is added, so the size is $n\times(k+1)=50\times4$. $X^TX$ is $4\times4$.` },
      { q: R`For $A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$, what is $\nabla_\beta(\beta^TA\beta)$?`,
        choices: [R`$2A\beta$`, R`$\begin{pmatrix}2&2\\2&6\end{pmatrix}\beta$`, R`$\begin{pmatrix}1&2\\0&3\end{pmatrix}\beta$`, R`$\begin{pmatrix}2&4\\0&6\end{pmatrix}\beta$`],
        sol: R`$(A+A^T)\beta=\begin{pmatrix}2&2\\2&6\end{pmatrix}\beta$. Direct check: $\beta^TA\beta=\beta_1^2+2\beta_1\beta_2+3\beta_2^2$, gradient $(2\beta_1+2\beta_2,\ 2\beta_1+6\beta_2)$. Since $A$ is not symmetric, $2A\beta$ is wrong.` },
      { q: R`For $g(\beta)=\beta^Tm$ with $m=(3,-1,2)^T$, what is $\partial g/\partial\beta_3$?`,
        sol: R`Since $\nabla_\beta(\beta^Tm)=m$, it is the third component $m_3=2$.` },
      { q: R`For $A=\begin{pmatrix}2&1\\3&4\end{pmatrix}$ and $\beta=(1,2)^T$, what is the second component of $\nabla_\beta(\beta^TA\beta)$?`,
        sol: R`$A+A^T=\begin{pmatrix}4&4\\4&8\end{pmatrix}$, $(A+A^T)\beta=(4+8,\ 4+16)^T=(12,20)^T$. The second component is 20.` },
      { q: R`Fitting $y=\beta_0+\beta_1x$ by least squares to the data $(x,y)=(0,1),(1,2),(2,2),(3,4)$, what is $\hat\beta_1$?`,
        sol: R`$X^TX=\begin{pmatrix}4&6\\6&14\end{pmatrix}$, $X^Ty=(9,18)^T$, $\hat\beta=\tfrac1{20}(14\cdot9-6\cdot18,\ -6\cdot9+4\cdot18)=(0.9,0.9)$.` },
      { q: R`For the least-squares solution of the previous problem, what is the sum of squared errors $f(\hat\beta)$?`,
        sol: R`Predictions $0.9,1.8,2.7,3.6$, residuals $0.1,0.2,-0.7,0.4$. The sum of squares is $0.01+0.04+0.49+0.16=0.70$.` },
      { q: R`Fitting a line through the origin $y=\beta x$ (no intercept) by least squares to $x=(1,2,3)$, $y=(2,4,5)$, what is $\hat\beta$?`,
        sol: R`$X$ is the single column $(1,2,3)^T$. $\hat\beta=\dfrac{X^Ty}{X^TX}=\dfrac{2+8+15}{1+4+9}=\dfrac{25}{14}$.` },
      { q: R`In which case is $X^TX$ **not** invertible?`,
        choices: [R`When there are far more data points than explanatory variables`, R`When one explanatory variable always equals the sum of two others`, R`When $y$ is very noisy`, R`When every explanatory variable has mean 0`],
        sol: R`If $x_3=x_1+x_2$, the columns of $X$ are linearly dependent, so there is $v\ne0$ (of the form $v=(0,1,1,-1)^T$) with $Xv=0$, and $X^TXv=0$. The noise or the means of $y$ have nothing to do with invertibility.` },
      { q: R`For the least-squares solution $\hat\beta$, which always holds for the residual $r=y-X\hat\beta$?`,
        choices: [R`$r=0$`, R`$X^Tr=0$`, R`$Xr=0$`, R`$r^Ty=0$`],
        sol: R`This is the normal equation $X^T(y-X\hat\beta)=0$ itself. With an intercept, the first column of $X$ is all ones, so in particular the residuals sum to 0.` },
      { q: R`For the Hessian $\nabla^2f$ of $f(\beta)=\lVert y-X\beta\rVert^2$ with data $x=(0,1,2,3)$ (simple regression with intercept), what is the $(1,2)$ entry?`,
        sol: R`$\nabla^2f=2X^TX=2\begin{pmatrix}4&6\\6&14\end{pmatrix}$. The $(1,2)$ entry is $2\sum x_i=12$.` },
      { q: R`For the data of Example 1, start at $\beta=(0,0)$ with $\alpha=0.01$ and apply the slide rule $\beta_l\leftarrow\beta_l+\alpha\sum_i(y_i-\hat y_i)x_{il}$ once. What is $\beta_1$?`,
        sol: R`Since $\hat y_i=0$, $\beta_1=0.01\sum x_iy_i=0.01\times18=0.18$.` },
      { q: R`What drawback of (full-batch) gradient descent did the slides point out?`,
        choices: [R`It does not move in the direction opposite to the gradient`, R`Each step must sweep the whole training set`, R`It diverges even for convex functions`, R`It needs no learning rate`],
        sol: R`The update contains $\sum_{i=1}^n$, so moving once requires computing a sum over all $n$ data points. Stochastic and mini-batch gradient descent are used to reduce this cost.` },
      { q: R`Prove componentwise that $\nabla_\beta(\beta^TA\beta)=(A+A^T)\beta$ for any square matrix $A$.`,
        sol: R`
$\beta^TA\beta=\sum_i\sum_j\beta_iA_{ij}\beta_j$. Take the partial derivative in $\beta_k$. By the product rule, with $\partial\beta_i/\partial\beta_k=\delta_{ik}$,
$$\frac{\partial}{\partial\beta_k}\sum_{i,j}\beta_iA_{ij}\beta_j=\sum_{i,j}\big(\delta_{ik}A_{ij}\beta_j+\beta_iA_{ij}\delta_{jk}\big)=\sum_jA_{kj}\beta_j+\sum_iA_{ik}\beta_i.$$
The first sum is $(A\beta)_k$ and the second is $(A^T\beta)_k$. Since this holds for every $k$, $\nabla_\beta(\beta^TA\beta)=A\beta+A^T\beta=(A+A^T)\beta$. If $A$ is symmetric, it is $2A\beta$.` },
      { q: R`Derive that the $\beta$ minimizing $f(\beta)=(y-X\beta)^T(y-X\beta)$ satisfies the normal equations $X^TX\beta=X^Ty$, and show that when the columns of $X$ are linearly independent the solution is the unique minimizer.`,
        sol: R`
**Expand.** $f=y^Ty-\beta^TX^Ty-y^TX\beta+\beta^TX^TX\beta$. Since $y^TX\beta$ is a scalar, $y^TX\beta=(y^TX\beta)^T=\beta^TX^Ty$, so $f=y^Ty-2\beta^TX^Ty+\beta^TX^TX\beta$.

**Differentiate.** $\nabla(\beta^Tm)=m$ ($m=X^Ty$) and $\nabla(\beta^TA\beta)=(A+A^T)\beta=2X^TX\beta$ ($A=X^TX$ is symmetric). Hence $\nabla f=-2X^Ty+2X^TX\beta$. Setting it to zero gives $X^TX\beta=X^Ty$.

**Minimizer.** $\nabla^2f=2X^TX$ and $v^T(2X^TX)v=2\lVert Xv\rVert^2\ge0$, so $f$ is convex and the stationary point is a global minimizer. If the columns are linearly independent, $v\ne0\Rightarrow Xv\ne0$, so $2X^TX\succ0$ (positive definite) and invertible, and $\hat\beta=(X^TX)^{-1}X^Ty$ is the unique minimizer.`,
        rubric: R`
- Expansion and combining the cross terms by transposing a scalar — 3 pts
- Applying the two vector-derivative formulas, the gradient — 3 pts
- The normal equations — 1 pt
- Minimizer and uniqueness from positive (semi)definiteness of the Hessian — 3 pts` },
      { q: R`When the columns of $X$ are linearly independent, show that $H=X(X^TX)^{-1}X^T$ is symmetric and idempotent ($H^2=H$), and that the residual $y-Hy$ is orthogonal to the column space of $X$.`,
        sol: R`
**Symmetric.** $(X^TX)^{-1}$ is the inverse of a symmetric matrix and hence symmetric. $H^T=\big(X^T\big)^T\big((X^TX)^{-1}\big)^TX^T=X(X^TX)^{-1}X^T=H$.

**Idempotent.** $H^2=X(X^TX)^{-1}\underbrace{X^TX(X^TX)^{-1}}_{I}X^T=H$.

**Orthogonal.** $X^T(y-Hy)=X^Ty-X^TX(X^TX)^{-1}X^Ty=0$. Its inner product with any vector $Xv$ of the column space is $v^TX^T(y-Hy)=0$. Therefore $Hy=X\hat\beta$ is the orthogonal projection of $y$ onto the column space.` },
      // more-01
      { q: R`Which of the following is **not a linear regression model** (in the coefficients $\beta$)?`,
        choices: [R`$y=\beta_0+\beta_1x+\beta_2x^2+\varepsilon$`, R`$y=\beta_0+\beta_1\sin x+\beta_2\log x+\varepsilon$`, R`$y=\beta_0+\beta_1e^{\beta_2x}+\varepsilon$`, R`$y=\beta_1x_1+\beta_2x_1x_2+\varepsilon$`],
        sol: R`“Linear” means linear in $\beta$. $x^2$, $\sin x$, $x_1x_2$ can simply be put in as columns of the design matrix, but in $e^{\beta_2x}$ the parameter $\beta_2$ sits in the exponent, so the model is nonlinear in $\beta$.` },
      { q: R`For $g(\beta)=\beta^TA\beta+c^T\beta$ with $A=\begin{pmatrix}2&1\\3&4\end{pmatrix}$ and $c=(1,-1)^T$, what is $\partial g/\partial\beta_2$ at $\beta=(1,2)^T$?`,
        sol: R`$\nabla g=(A+A^T)\beta+c$. $A+A^T=\begin{pmatrix}4&4\\4&8\end{pmatrix}$, $(A+A^T)\beta=(12,20)^T$; adding $c$ gives $(13,19)^T$. The second component is 19.` },
      { q: R`Fitting $y=\beta_0+\beta_1x$ by least squares to the data $(1,2),(2,3),(3,5),(4,6)$, what is $\hat\beta_1$?`,
        sol: R`$\bar x=2.5$, $\bar y=4$. $S_{xx}=2.25+0.25+0.25+2.25=5$, $S_{xy}=(-1.5)(-2)+(-0.5)(-1)+(0.5)(1)+(1.5)(2)=7$. $\hat\beta_1=7/5=1.4$, $\hat\beta_0=4-1.4(2.5)=0.5$.` },
      { q: R`For the data above, what is the coefficient of determination $R^2=1-\mathrm{SSE}/S_{yy}$?`,
        sol: R`Predictions $0.5+1.4x=(1.9,3.3,4.7,6.1)$, residuals $(0.1,-0.3,0.3,-0.1)$, $\mathrm{SSE}=0.2$. $S_{yy}=4+1+1+4=10$. $R^2=1-0.02=0.98$.` },
      { q: R`For the data above, what is the upper limit $2/\lambda_{\max}(X^TX)$ on learning rates for which the slide rule $\beta\leftarrow\beta+\alpha X^T(y-X\beta)$ converges? (4 decimal places)`,
        sol: R`$X^TX=\begin{pmatrix}4&10\\10&30\end{pmatrix}$, trace 34, determinant 20. The eigenvalues are $17\pm\sqrt{289-20}=17\pm\sqrt{269}$, the largest $\approx33.40$. The limit is $2/33.40\approx0.0599$.` },
      { q: R`A column with height in cm and a column with height in m are both put into the design matrix. Which is correct?`,
        choices: [R`$X^TX$ is invertible and there is exactly one solution`, R`$X^TX$ is not invertible; the normal equations have infinitely many solutions, but the predictions $\hat y$ are all the same`, R`The normal equations have no solution`, R`The sum of squared errors becomes 0`],
        sol: R`The two columns are proportional (factor 100), hence linearly dependent, and $X^TX$ is singular. The normal equations always have a solution (the projection onto the column space exists); there are infinitely many solutions, but every $X\beta$ is the same projection $\hat y$.` },
      { q: R`For $A\in\mathbb R^{m\times p}$ and $b\in\mathbb R^m$, show that $\nabla_\beta\lVert A\beta-b\rVert^2=2A^T(A\beta-b)$ (i) by expansion and the two derivative formulas and (ii) componentwise.`,
        sol: R`
**(i)** $\lVert A\beta-b\rVert^2=(A\beta-b)^T(A\beta-b)=\beta^TA^TA\beta-\beta^TA^Tb-b^TA\beta+b^Tb$. Since $b^TA\beta$ is a scalar it equals $\beta^TA^Tb$, so this is $=\beta^T(A^TA)\beta-2\beta^T(A^Tb)+b^Tb$.
$A^TA$ is symmetric, so $\nabla(\beta^TA^TA\beta)=2A^TA\beta$ and $\nabla(\beta^TA^Tb)=A^Tb$. Together, $2A^TA\beta-2A^Tb=2A^T(A\beta-b)$.

**(ii)** Let $r=A\beta-b$, $r_i=\sum_jA_{ij}\beta_j-b_i$. Since $\lVert r\rVert^2=\sum_ir_i^2$,
$$\frac{\partial}{\partial\beta_l}\sum_ir_i^2=\sum_i2r_i\frac{\partial r_i}{\partial\beta_l}=2\sum_ir_iA_{il}=2(A^Tr)_l.$$
Collecting, $2A^Tr=2A^T(A\beta-b)$.`,
        rubric: R`
- Expansion and combining the cross terms by transposing a scalar — 3 pts
- Applying the two formulas (mentioning that $A^TA$ is symmetric) — 3 pts
- Chain rule in the componentwise computation and recognizing $(A^Tr)_l$ — 4 pts` },
      { q: R`When the columns of $X\in\mathbb R^{n\times p}$ are linearly independent, show (i) that $X^TX$ is positive definite, and from this (ii) that $X^TX$ is invertible and (iii) that the minimizer of $f(\beta)=\lVert y-X\beta\rVert^2$ is unique.`,
        sol: R`
**(i)** For any $v\ne0$, $v^TX^TXv=(Xv)^T(Xv)=\lVert Xv\rVert^2\ge0$. If the columns are linearly independent, $Xv=\sum_jv_jX_{:,j}=0$ only when $v=0$, so $v\ne0$ gives $\lVert Xv\rVert^2>0$. Therefore $X^TX\succ0$.

**(ii)** If $X^TXv=0$, then $v^TX^TXv=0$ and by (i) $v=0$. The null space is trivial, so the square matrix $X^TX$ is invertible.

**(iii)** The Hessian $\nabla^2f=2X^TX\succ0$, so $f$ is strongly convex. Concretely, from the decomposition of §1.3, $f(\beta)=f(\hat\beta)+(\beta-\hat\beta)^TX^TX(\beta-\hat\beta)$, the second term is positive when $\beta\ne\hat\beta$, so $f(\beta)>f(\hat\beta)$. The minimizer is the single point $\hat\beta=(X^TX)^{-1}X^Ty$.

(Reason for the decomposition: $y-X\beta=(y-X\hat\beta)+X(\hat\beta-\beta)$, and the cross term vanishes because of the normal equations $X^T(y-X\hat\beta)=0$.)`,
        rubric: R`
- $v^TX^TXv=\lVert Xv\rVert^2$ — 2 pts
- $Xv=0\Rightarrow v=0$ from linear independence — 3 pts
- Invertibility — 2 pts
- Uniqueness (strong convexity or the decomposition) — 3 pts` },
      { q: R`Write the normal equations of simple regression $y_i=\beta_0+\beta_1x_i+\varepsilon_i$ componentwise, and from them derive $\hat\beta_1=S_{xy}/S_{xx}$ and $\hat\beta_0=\bar y-\hat\beta_1\bar x$. ($S_{xy}=\sum(x_i-\bar x)(y_i-\bar y)$, $S_{xx}=\sum(x_i-\bar x)^2>0$)`,
        sol: R`
Since $X^TX=\begin{pmatrix}n&\sum x_i\\\sum x_i&\sum x_i^2\end{pmatrix}$ and $X^Ty=\begin{pmatrix}\sum y_i\\\sum x_iy_i\end{pmatrix}$, the normal equations are
$$n\beta_0+\beta_1\sum x_i=\sum y_i,\qquad \beta_0\sum x_i+\beta_1\sum x_i^2=\sum x_iy_i.$$
Dividing the first equation by $n$ gives $\beta_0=\bar y-\beta_1\bar x$. Substituting into the second,
$$(\bar y-\beta_1\bar x)n\bar x+\beta_1\sum x_i^2=\sum x_iy_i\iff\beta_1\Big(\sum x_i^2-n\bar x^2\Big)=\sum x_iy_i-n\bar x\bar y.$$
Since $\sum x_i^2-n\bar x^2=\sum(x_i-\bar x)^2=S_{xx}$ and $\sum x_iy_i-n\bar x\bar y=\sum(x_i-\bar x)(y_i-\bar y)=S_{xy}$, we get $\hat\beta_1=S_{xy}/S_{xx}$. ($S_{xx}>0$ means the $x_i$ are not all equal, i.e., the two columns of $X$ are independent.)`,
        rubric: R`
- Componentwise normal equations — 3 pts
- Eliminating $\beta_0$ with the first equation — 2 pts
- The two identities rewriting sums as sums of deviation products — 4 pts
- The meaning of $S_{xx}>0$ — 1 pt` },
      { q: R`When the design matrix has a column of ones, show that the least-squares residual $r=y-X\hat\beta$ satisfies (i) $\sum_ir_i=0$ and (ii) $\sum_ir_i\hat y_i=0$.`,
        sol: R`
The normal equations $X^T(y-X\hat\beta)=X^Tr=0$ say that $r$ has zero inner product with **every column** of $X$.
**(i)** For the column of ones $\mathbf 1$, $\mathbf 1^Tr=\sum r_i=0$.
**(ii)** $\hat y=X\hat\beta$ is a linear combination of the columns, so $\hat y^Tr=\hat\beta^TX^Tr=\hat\beta^T0=0$.
(Hence $\sum y_i=\sum\hat y_i$, and since $y=\hat y+r$ is an orthogonal decomposition, $\lVert y\rVert^2=\lVert\hat y\rVert^2+\lVert r\rVert^2$.)`,
        rubric: R`
- Reading the normal equations as “orthogonal to the columns” — 4 pts
- (i) — 3 pts
- (ii) — 3 pts` },
      { q: R`For the slide rule $\beta_{t+1}=\beta_t+\alpha X^T(y-X\beta_t)$, show that $e_t=\beta_t-\hat\beta$ satisfies $e_{t+1}=(I-\alpha X^TX)e_t$, and prove that when $X^TX\succ0$ the iteration converges from every initial point if and only if $0<\alpha<2/\lambda_{\max}(X^TX)$.`,
        sol: R`
Using the normal equations $X^Ty=X^TX\hat\beta$, we get $X^T(y-X\beta_t)=X^TX\hat\beta-X^TX\beta_t=-X^TXe_t$. Subtracting $\hat\beta$ from both sides gives $e_{t+1}=e_t-\alpha X^TXe_t=(I-\alpha X^TX)e_t$, hence $e_t=(I-\alpha X^TX)^te_0$.
Diagonalize $X^TX=Q\Lambda Q^T$ (orthogonal $Q$, $\Lambda=\operatorname{diag}(\lambda_i)$, $\lambda_i>0$) and set $u_t=Q^Te_t$; then $u_{t,i}=(1-\alpha\lambda_i)^tu_{0,i}$. $u_t\to0$ for every $u_0$ if and only if $\lvert1-\alpha\lambda_i\rvert<1$ for all $i$, i.e., $0<\alpha\lambda_i<2$. The strongest condition comes from $\lambda_{\max}$, so $0<\alpha<2/\lambda_{\max}$. (If $\alpha=2/\lambda_{\max}$, the component in that direction oscillates as $(-1)^t$ and does not converge.)`,
        rubric: R`
- Deriving the error recursion from the normal equations — 3 pts
- Separating components by the eigendecomposition — 3 pts
- Deriving the condition from $\lvert1-\alpha\lambda_i\rvert<1$ (both necessity and sufficiency) — 4 pts` },
      // quizprep-a
      { q: R`Consider weighted least squares with weights $c_i\gt0$, $J(\beta)=\sum_{i=1}^nc_i(y_i-x_i^T\beta)^2=(y-X\beta)^TC(y-X\beta)$, $C=\diag(c_1,\dots,c_n)$. The columns of $X\in\mathbb R^{n\times p}$ are linearly independent.
1. Find $\nabla_\beta J$ and derive the normal equations $X^TCX\beta=X^TCy$.
2. Show that $X^TCX$ is positive definite and that the solution of the normal equations is the unique minimizer of $J$.
3. Fitting the model without intercept $y=\beta x$ to the data $(x,y)=(0,1),(1,2),(2,3)$ with weights $c=(1,1,2)$, find $\hat\beta$ and compare with the case where all weights are 1.
4. Show that the MLE of the model $y_i=x_i^T\beta+\varepsilon_i$ with noise $\varepsilon_i\sim\N(0,\sigma_i^2)$ (independent, $\sigma_i^2$ known) is the weighted least-squares solution with $c_i=1/\sigma_i^2$.`,
        hint: R`Since $C$ is symmetric you can use $\nabla_\beta(\beta^TA\beta)=2A\beta$ ($A=X^TCX$).`,
        sol: R`
**1.** Since $C$ is symmetric, $J=y^TCy-2\beta^TX^TCy+\beta^TX^TCX\beta$. By the vector-derivative formulas $\nabla(b^T\beta)=b$ and $\nabla(\beta^TA\beta)=2A\beta$ (symmetric $A$),
$$\nabla_\beta J=-2X^TCy+2X^TCX\beta=0\ \Longrightarrow\ X^TCX\beta=X^TCy.$$
**2.** For $v\ne0$, $v^TX^TCXv=(Xv)^TC(Xv)=\sum_ic_i(Xv)_i^2\ge0$, and since every $c_i\gt0$ equality holds only when $Xv=0$, which the linearly independent columns rule out. Hence $X^TCX\succ0$ (invertible). The Hessian $2X^TCX\succ0$ makes $J$ strongly convex, and the unique stationary point $\hat\beta=(X^TCX)^{-1}X^TCy$ is the unique minimizer. **3.** $X^TCX=\sum c_ix_i^2=0+1+2\cdot4=9$ and $X^TCy=\sum c_ix_iy_i=0+2+2\cdot2\cdot3=14$, so $\hat\beta=\frac{14}9\approx1.556$. With all weights 1, $\frac{\sum x_iy_i}{\sum x_i^2}=\frac85=1.6$. The fit is pulled toward the point $(2,3)$ (slope 1.5), which has weight 2. The point with $x=0$ has no effect on the slope without intercept. **4.** The log-likelihood is $\ell(\beta)=\sum_i\Big[-\frac12\log(2\pi\sigma_i^2)-\frac{(y_i-x_i^T\beta)^2}{2\sigma_i^2}\Big]$. The first term does not depend on $\beta$, so $\argmax\ell=\argmin\sum_i\frac1{\sigma_i^2}(y_i-x_i^T\beta)^2$ — weighted least squares with $c_i=1/\sigma_i^2$. The noisier (less reliable) a point, the smaller its weight.`,
        rubric: R`
- Gradient and normal equations (stating the use of symmetry) — 3 pts
- Positive definiteness using both $c_i\gt0$ and linear independence of the columns — 2 pts, conclusion of a unique minimizer — 1 pt
- Numerical computation and comparison — 2 pts
- Equivalence with the MLE — 2 pts` },
    ],
  };
})();
