/* 증명의 길잡이 — 01–07단원의 긴 증명(본문 600자 이상). 증명 페이지의 명제 아래에 쉬운 요약과 단계 지도를,
   본문의 각 단계(at: 한국어 본문에서 그 단계가 시작하는 조각의 첫머리) 앞에 위치 표시를 붙입니다(core/app.js proofPlan).
   rows가 없으면 번호 순서의 길잡이로, 있으면 단원 지도와 같은 도식으로 그립니다. g는 단계 묶음의 제목입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    'ch01-vecgrad': {
      easy: R`두 공식 모두 같은 방법으로 보입니다. 기울기는 편도함수를 세로로 쌓은 것이므로, 함수를 성분의 합으로 풀어 쓰고 $\beta_k$ 하나로 미분한 뒤 다시 벡터로 모읍니다. 일차식은 한 줄이면 끝나고, 이차형식은 $\beta$가 두 번 들어 있어 미분이 두 묶음으로 갈라진다는 점만 조심하면 됩니다.`,
      easyEn: R`Both formulas are proved the same way. The gradient is the column of partial derivatives, so we write the function as a sum over components, differentiate with respect to a single $\beta_k$, and collect the results back into a vector. The linear form takes one line; for the quadratic form the only care needed is that $\beta$ appears twice, so the derivative splits into two groups of terms.`,
      nodes: [
        { id: 'comp', at: '기울기의', t: R`성분으로 보기`, en: R`Work in components`,
          d: R`기울기의 $k$번째 성분 $\partial/\partial\beta_k$를 계산하기로 하고, $\partial\beta_i/\partial\beta_k$를 크로네커 델타 $\delta_{ik}$로 적습니다.`,
          dEn: R`Decide to compute the $k$-th component $\partial/\partial\beta_k$ of the gradient, and write $\partial\beta_i/\partial\beta_k$ as the Kronecker delta $\delta_{ik}$.` },
        { id: 'a', at: '**(a)**', t: R`일차식 $\beta^Tm$`, en: R`The linear form $\beta^Tm$`,
          d: R`합 $\sum_i\beta_im_i$를 $\beta_k$로 미분하면 $m_k$ 하나만 남고, 모으면 $m$입니다.`,
          dEn: R`Differentiating the sum $\sum_i\beta_im_i$ with respect to $\beta_k$ leaves only $m_k$; collected, this is $m$.` },
        { id: 'b', at: '**(b)**', t: R`이차형식 $\beta^TA\beta$`, en: R`The quadratic form $\beta^TA\beta$`,
          d: R`곱의 미분으로 ‘$i=k$인 항’과 ‘$j=k$인 항’ 두 묶음이 생기고, 각각 $(A\beta)_k$와 $(A^T\beta)_k$가 됩니다.`,
          dEn: R`The product rule produces two groups, “the terms with $i=k$” and “the terms with $j=k$”, which become $(A\beta)_k$ and $(A^T\beta)_k$.` },
        { id: 'diag', at: '필기의 설명대로', t: R`대각항 확인과 정리`, en: R`Check the diagonal term, then collect`,
          d: R`$i=j=k$인 항이 두 묶음에 한 번씩 정확히 들어가 빠지거나 겹치지 않음을 확인하고, 벡터로 모아 $(A+A^T)\beta$를 얻습니다.`,
          dEn: R`Check that the term with $i=j=k$ enters each group exactly once, so nothing is missed or counted twice, and collect into the vector $(A+A^T)\beta$.` },
      ],
    },
    'ch01-normal': {
      easy: R`보여야 할 것은 두 가지입니다. 최솟점이라면 반드시 만족해야 하는 식(정규방정식)을 찾는 것, 그리고 그 식의 해가 정말 최솟점이며 열이 일차독립이면 하나뿐이라는 것입니다. 앞의 세 단계는 ‘바닥이면 기울기가 0’이라는 필요조건을, 뒤의 두 단계는 ‘기울기가 0인 곳이 정말 바닥’이라는 충분조건을 다룹니다.`,
      easyEn: R`Two things must be shown: the equation that any minimizer has to satisfy (the normal equations), and that a solution of that equation really is a minimizer, the only one when the columns are linearly independent. The first three steps give the necessary condition “at the bottom the gradient is zero”; the last two give the sufficient condition “where the gradient is zero is really the bottom”.`,
      nodes: [
        { id: 'expand', at: '**1. 전개.**', g: R`필요조건: 최솟점이면 기울기가 0`, gEn: R`Necessary: a minimizer has zero gradient`, t: R`전개`, en: R`Expand`,
          d: R`$f$를 $\beta$의 이차식으로 펼치고, 숫자 하나인 $y^TX\beta$를 전치해 가운데 두 항을 합칩니다.`,
          dEn: R`Write $f$ as a quadratic in $\beta$, and merge the two middle terms by transposing the scalar $y^TX\beta$.` },
        { id: 'diff', at: '**2. 미분.**', t: R`미분`, en: R`Differentiate`,
          d: R`벡터 미분 공식에 $m=X^Ty$, $A=X^TX$(대칭)를 넣어 $\nabla f=-2X^T(y-X\beta)$를 얻습니다.`,
          dEn: R`Put $m=X^Ty$ and the symmetric $A=X^TX$ into the vector derivative formulas to get $\nabla f=-2X^T(y-X\beta)$.` },
        { id: 'stat', at: '**3. 정류점.**', t: R`정류점 = 정규방정식`, en: R`Stationary point = normal equations`,
          d: R`$\nabla f=0$은 곧 $X^TX\beta=X^Ty$입니다. 최솟점은 반드시 이 식을 만족합니다.`,
          dEn: R`$\nabla f=0$ is exactly $X^TX\beta=X^Ty$. Every minimizer must satisfy it.` },
        { id: 'min', at: '**4. 최솟점임.**', g: R`충분조건: 기울기가 0이면 최솟점`, gEn: R`Sufficient: zero gradient means the minimum`, t: R`정말 최솟점`, en: R`Really a minimizer`,
          d: R`이차식의 정확한 전개 $f(\hat\beta+v)=f(\hat\beta)+\lVert Xv\rVert^2$로, 어느 방향 $v$로 움직여도 $f$가 줄지 않음을 보입니다.`,
          dEn: R`The exact expansion of a quadratic, $f(\hat\beta+v)=f(\hat\beta)+\lVert Xv\rVert^2$, shows that $f$ does not decrease in any direction $v$.` },
        { id: 'uniq', at: '**5. 유일성.**', t: R`유일성과 가역성`, en: R`Uniqueness and invertibility`,
          d: R`열이 일차독립이면 $v\ne0$일 때 $Xv\ne0$이라 $f$가 엄격히 커지고, 같은 이유로 $X^TX$도 가역이 되어 $\hat\beta=(X^TX)^{-1}X^Ty$.`,
          dEn: R`With linearly independent columns, $v\ne0$ gives $Xv\ne0$, so $f$ strictly increases; for the same reason $X^TX$ is invertible and $\hat\beta=(X^TX)^{-1}X^Ty$.` },
      ],
    },
    'ch02-axioms': {
      easy: R`보일 성질은 넷이지만 요령은 하나입니다. 다루는 사건을 **서로소인 조각**으로 쪼개고, 공리 3(서로소인 사건의 확률은 더해진다)으로 확률을 조각들의 합으로 쓴 뒤, 필요하면 공리 1(확률은 음이 아니다)이나 공리 2($P(\Omega)=1$)를 씁니다.

첫 단계 $P(\varnothing)=0$은 준비입니다. 공리 3은 사건을 끝없이 늘어놓은 열에 대한 약속인데, 이제 남는 자리를 공집합으로 채울 수 있으므로 사건을 두 조각으로 쪼갠 경우에도 쓸 수 있습니다. 뒤의 세 성질은 모두 이 ‘두 조각’ 버전을 씁니다.`,
      easyEn: R`There are four properties but only one trick. Split the event at hand into **mutually exclusive pieces**, use Axiom 3 (probabilities of mutually exclusive events add) to write its probability as a sum over the pieces, and then, where needed, use Axiom 1 (probabilities are nonnegative) or Axiom 2 ($P(\Omega)=1$).

The first step, $P(\varnothing)=0$, is groundwork. Axiom 3 is a statement about an endless sequence of events; since the unused places can now be filled with empty sets, it also applies when an event is split into just two pieces. The three properties after it all use this two-piece version.`,
      nodes: [
        { id: 'empty', at: R`**$P(\varnothing)=0$.**`, t: R`준비: $P(\varnothing)=0$`, en: R`Groundwork: $P(\varnothing)=0$`,
          d: R`$\Omega,\varnothing,\varnothing,\dots$에 공리 3을 쓰면 $P(\varnothing)=0$이고, 덕분에 공리 3을 유한 개, 특히 두 조각에도 쓸 수 있습니다.`,
          dEn: R`Axiom 3 applied to $\Omega,\varnothing,\varnothing,\dots$ gives $P(\varnothing)=0$, so Axiom 3 can be used for finitely many pieces, in particular for two.` },
        { id: 'comp', at: '**여사건.**', t: R`여사건`, en: R`Complement`,
          d: R`전체 $\Omega$를 $E$와 $E^c$ 두 조각으로 쪼개면, 공리 3과 공리 2에서 $P(E)+P(E^c)=1$입니다.`,
          dEn: R`Splitting the whole space $\Omega$ into the two pieces $E$ and $E^c$, Axioms 3 and 2 give $P(E)+P(E^c)=1$.` },
        { id: 'mono', at: '**단조성.**', t: R`단조성`, en: R`Monotonicity`,
          d: R`$F$를 $E$와 나머지 $F\setminus E$로 쪼개면 $P(F)=P(E)+P(F\setminus E)$이고, 더해지는 항이 음이 아니므로(공리 1) $P(F)\ge P(E)$.`,
          dEn: R`Splitting $F$ into $E$ and the rest $F\setminus E$ gives $P(F)=P(E)+P(F\setminus E)$; the added term is nonnegative (Axiom 1), so $P(F)\ge P(E)$.` },
        { id: 'split', at: '**포함배제.**', t: R`포함배제: 두 분해`, en: R`Inclusion–exclusion: two splits`,
          d: R`$E\cup F$와 $F$를 각각 서로소 조각으로 쪼개되, 같은 조각 $F\setminus E$가 두 분해에 모두 들어가게 합니다.`,
          dEn: R`Split both $E\cup F$ and $F$ into mutually exclusive pieces, arranged so that the same piece $F\setminus E$ appears in both.` },
        { id: 'sub', at: '두 식을 빼면', t: R`빼서 지우기`, en: R`Subtract to cancel`,
          d: R`두 식을 빼면 공통 조각의 확률 $P(F\setminus E)$가 사라지고, 옮겨 정리하면 $P(E\cup F)=P(E)+P(F)-P(E\cap F)$입니다.`,
          dEn: R`Subtracting the two equations removes the shared $P(F\setminus E)$; rearranging gives $P(E\cup F)=P(E)+P(F)-P(E\cap F)$.` },
      ],
    },
    'ch02-bernmle': {
      easy: R`최대가능도 추정은 ‘관측한 자료가 나올 확률’ $L(\theta)$를 가장 크게 하는 $\theta$를 찾는 것입니다. 자료가 독립이므로 $L$은 표본마다의 확률의 곱이고, 정리하면 성공 횟수 $S$만 남은 $\theta^S(1-\theta)^{n-S}$입니다.

곱은 미분하기 번거로우므로 **로그**를 취해 합으로 바꾸고, 미분해 0이 되는 점 $\theta=S/n$을 찾습니다. 그 점이 정말 최대인지는 이계도함수가 음수(순오목)라는 것으로 확인합니다. 다만 $S=0$이나 $S=n$이면 최대점이 구간의 끝 0이나 1에 있어 도함수가 0이 되는 점이 없으므로, 그 두 경우는 $L$이 단조라는 것으로 따로 처리합니다.`,
      easyEn: R`Maximum likelihood estimation looks for the $\theta$ that makes $L(\theta)$, “the probability of the observed data”, as large as possible. The data are independent, so $L$ is the product of the per-sample probabilities, which simplifies to $\theta^S(1-\theta)^{n-S}$: only the number of successes $S$ remains.

A product is awkward to differentiate, so take the **log** to turn it into a sum, and find the point where the derivative vanishes, $\theta=S/n$. That it really is the maximum is checked by the negative second derivative (strict concavity). If $S=0$ or $S=n$, however, the maximizer sits at an endpoint 0 or 1 and the derivative vanishes nowhere, so those two cases are handled separately by noting that $L$ is monotone.`,
      nodes: [
        { id: 'lik', at: '**가능도.**', t: R`가능도: $S$만 남는다`, en: R`Likelihood: only $S$ remains`,
          d: R`한 표본의 확률 $\theta^x(1-\theta)^{1-x}$를 독립성으로 곱하면 지수가 모여 $L(\theta)=\theta^S(1-\theta)^{n-S}$입니다.`,
          dEn: R`Multiplying the one-sample probability $\theta^x(1-\theta)^{1-x}$ over independent samples collects the exponents: $L(\theta)=\theta^S(1-\theta)^{n-S}$.` },
        { id: 'stat', at: '**$0<S<n$.**', g: R`보통의 경우 $0<S<n$`, gEn: R`The usual case $0<S<n$`, t: R`로그를 미분해 0으로`, en: R`Differentiate the log, set it to 0`,
          d: R`$\ell=S\log\theta+(n-S)\log(1-\theta)$를 미분해 0으로 두면 $S(1-\theta)=(n-S)\theta$, 곧 $\theta=S/n$입니다.`,
          dEn: R`Differentiating $\ell=S\log\theta+(n-S)\log(1-\theta)$ and setting it to 0 gives $S(1-\theta)=(n-S)\theta$, that is, $\theta=S/n$.` },
        { id: 'max', at: R`$\ell''(\theta)=`, t: R`정말 최대`, en: R`Really the maximum`,
          d: R`$\ell''<0$이라 $\ell$은 순오목이므로 정류점이 유일한 최대점입니다. 양 끝에서 $\ell\to-\infty$라 최대가 경계에 있을 수도 없습니다.`,
          dEn: R`$\ell''<0$, so $\ell$ is strictly concave and the stationary point is the unique maximizer; since $\ell\to-\infty$ at both ends, the maximum cannot sit on the boundary either.` },
        { id: 'edge', at: '**$S=0$', g: R`양 끝 $S=0$, $S=n$`, gEn: R`The extremes $S=0$, $S=n$`, t: R`단조라서 끝점이 최대`, en: R`Monotone, so an endpoint wins`,
          d: R`$S=0$이면 $L=(1-\theta)^n$이 감소해 최대점이 0, $S=n$이면 $L=\theta^n$이 증가해 최대점이 1입니다. 둘 다 $S/n$과 같습니다.`,
          dEn: R`For $S=0$, $L=(1-\theta)^n$ decreases, so the maximizer is 0; for $S=n$, $L=\theta^n$ increases, so it is 1. Both equal $S/n$.` },
      ],
    },
    'ch02-betapost': {
      easy: R`사후분포는 베이즈 정리의 분수, 곧 (가능도 × 사전밀도)를 그것을 $\theta$에 대해 적분한 값으로 나눈 것입니다. 핵심은 베르누이 가능도 $\theta^S(1-\theta)^{n-S}$와 베타 사전분포가 **같은 꼴**, 곧 ‘$\theta$의 거듭제곱 × $(1-\theta)$의 거듭제곱’이라는 점입니다.

곱하면 지수끼리 더해져 다시 같은 꼴이 되고, 분모의 적분은 베타함수의 정의에서 바로 읽힙니다. 그래서 사후분포는 매개변수만 $a\to a+S$, $b\to b+n-S$로 바뀐 베타분포입니다. 성공 횟수는 $a$에, 실패 횟수는 $b$에 더해지는 셈입니다.`,
      easyEn: R`The posterior is the fraction in Bayes' theorem: (likelihood × prior density) divided by its integral over $\theta$. The key is that the Bernoulli likelihood $\theta^S(1-\theta)^{n-S}$ and the beta prior have **the same shape**, “a power of $\theta$ times a power of $(1-\theta)$”.

Multiplying adds the exponents and gives that shape again, and the integral in the denominator can be read straight off the definition of the beta function. So the posterior is a beta distribution whose parameters have just moved from $a,b$ to $a+S$, $b+n-S$: the successes are added to $a$, the failures to $b$.`,
      nodes: [
        { id: 'num', at: '베이즈 정리', t: R`분자: 지수 더하기`, en: R`Numerator: add the exponents`,
          d: R`가능도 $\theta^S(1-\theta)^{n-S}$에 베타 밀도를 곱하면 지수가 더해져 $\theta^{a+S-1}(1-\theta)^{b+n-S-1}/B(a,b)$가 됩니다.`,
          dEn: R`Multiplying the likelihood $\theta^S(1-\theta)^{n-S}$ by the beta density adds the exponents: $\theta^{a+S-1}(1-\theta)^{b+n-S-1}/B(a,b)$.` },
        { id: 'den', at: '분모는', t: R`분모: 베타함수`, en: R`Denominator: a beta function`,
          d: R`분모는 분자를 $[0,1]$에서 적분한 것이고, 베타함수의 정의를 그대로 쓰면 $B(a+S,b+n-S)/B(a,b)$입니다.`,
          dEn: R`The denominator is the integral of the numerator over $[0,1]$; by the very definition of the beta function it is $B(a+S,b+n-S)/B(a,b)$.` },
        { id: 'div', at: '나누면', t: R`나누면 베타 밀도`, en: R`Divide: a beta density`,
          d: R`나누면 $B(a,b)$가 약분되어, 남은 식이 정확히 $\operatorname{Beta}(a+S,b+n-S)$의 밀도입니다.`,
          dEn: R`Dividing cancels $B(a,b)$, and what remains is exactly the density of $\operatorname{Beta}(a+S,b+n-S)$.` },
        { id: 'unif', at: '균등 사전분포', t: R`균등 사전분포`, en: R`The uniform prior`,
          d: R`$a=b=1$이면 $\operatorname{Beta}(S+1,n-S+1)$이고, 정규화 상수 $B(S+1,n-S+1)$을 감마함수로 쓰면 명제의 식입니다.`,
          dEn: R`With $a=b=1$ the posterior is $\operatorname{Beta}(S+1,n-S+1)$; writing the normalizing constant $B(S+1,n-S+1)$ with gamma functions gives the formula of the statement.` },
      ],
    },
    'ch02-mapl2': {
      easy: R`MAP은 사후확률을 가장 크게 하는 $\theta$입니다. 증명은 최대점의 **위치(argmax)를 바꾸지 않는 변형**만 차례로 써서, 이 문제를 ‘손실 + 규제’의 최소화로 바꿉니다. $\theta$와 무관한 양수 $p(x)$로 나누는 것을 없애고, 순증가함수 $\log$를 씌우고, 부호를 뒤집어 최대화를 최소화로 바꿉니다.

마지막으로 가우시안 사전분포를 넣으면 $-\log p(\theta)$가 $\frac1{2\tau^2}\lVert\theta\rVert_2^2$에 상수를 더한 것이 됩니다. 상수는 최소점의 위치에 영향이 없으므로 $L_2$ 규제만 남습니다.`,
      easyEn: R`The MAP estimate is the $\theta$ that makes the posterior largest. The proof applies only **changes that leave the location of the maximum (the argmax) unchanged**, one after another, until the problem becomes minimizing “loss + regularizer”: drop the division by $p(x)$, a positive number independent of $\theta$; apply the strictly increasing $\log$; flip the sign to turn maximization into minimization.

Finally, with a Gaussian prior, $-\log p(\theta)$ is $\frac1{2\tau^2}\lVert\theta\rVert_2^2$ plus a constant. A constant does not move the minimizer, so only the $L_2$ regularizer remains.`,
      nodes: [
        { id: 'evid', at: '**1. 증거 제거.**', t: R`증거 $p(x)$ 지우기`, en: R`Drop the evidence $p(x)$`,
          d: R`분모 $p(x)$는 $\theta$와 무관한 양수라 지워도 최대점이 그대로입니다. 남는 일은 $p(x\mid\theta)p(\theta)$의 최대화입니다.`,
          dEn: R`The denominator $p(x)$ is a positive number independent of $\theta$, so dropping it leaves the maximizer unchanged; what remains is to maximize $p(x\mid\theta)p(\theta)$.` },
        { id: 'log', at: '**2. 단조변환.**', t: R`로그 씌우고 부호 뒤집기`, en: R`Take the log, flip the sign`,
          d: R`순증가함수는 크기 순서를 지키므로 $\log$를 씌워도 최대점이 같고, 부호를 바꾸면 최대화가 최소화가 됩니다.`,
          dEn: R`A strictly increasing function preserves order, so applying $\log$ keeps the maximizer; flipping the sign turns maximization into minimization.` },
        { id: 'read', at: '첫 항이', t: R`손실 + 규제로 읽기`, en: R`Read it as loss + regularizer`,
          d: R`첫 항 $-\log p(x\mid\theta)$는 자료에 맞추는 손실(음의 로그가능도), 둘째 항 $-\log p(\theta)$는 사전분포에서 온 규제입니다.`,
          dEn: R`The first term $-\log p(x\mid\theta)$ is the data-fit loss (the negative log-likelihood); the second, $-\log p(\theta)$, is the regularizer coming from the prior.` },
        { id: 'gauss', at: '**3. 가우시안 사전분포.**', t: R`가우시안이면 $L_2$ 규제`, en: R`Gaussian prior: an $L_2$ penalty`,
          d: R`$\N(0,\tau^2I_d)$ 밀도의 $-\log$는 $\frac1{2\tau^2}\lVert\theta\rVert_2^2$에 상수를 더한 것이고, 상수는 최소점을 옮기지 않으므로 빠집니다.`,
          dEn: R`$-\log$ of the $\N(0,\tau^2I_d)$ density is $\frac1{2\tau^2}\lVert\theta\rVert_2^2$ plus a constant, and the constant does not move the minimizer, so it drops out.` },
      ],
    },
    'ch02-expvar': {
      easy: R`네 성질은 차례로 앞의 것을 씁니다. 바탕은 (i) **선형성**입니다. 기댓값은 확률을 가중치로 한 합이므로, 더하기와 상수배가 합 밖으로 나옵니다. (ii)는 분산의 정의를 펼쳐 (i)을 쓴 것이고, (iii)은 ‘독립이면 결합확률이 곱 $p(x)p(y)$로 갈라진다’는 점 하나로 곱의 기댓값과 합의 분산을 다룹니다.

(iv)는 (iii)과 (ii)를 이어 붙인 결과입니다. 독립인 $n$개를 더하면 분산이 $n$배가 되고, $n$으로 나누면 분산은 $n^2$으로 나뉘므로 표본평균의 분산은 $\sigma^2/n$로 줄어듭니다. 평균을 내면 흔들림이 줄어드는 이유가 이것입니다.`,
      easyEn: R`Each of the four properties uses the earlier ones. The foundation is (i), **linearity**: an expectation is a sum weighted by probabilities, so sums and constant multiples come out of it. (ii) expands the definition of variance and uses (i), and (iii) handles the expectation of a product and the variance of a sum with one fact: under independence the joint probability splits into the product $p(x)p(y)$.

(iv) chains (iii) and (ii). Adding $n$ independent variables multiplies the variance by $n$, and dividing by $n$ divides the variance by $n^2$, so the variance of the sample mean shrinks to $\sigma^2/n$. This is why averaging reduces fluctuation.`,
      nodes: [
        { id: 'lin', at: '**(i)**', t: R`(i) 선형성`, en: R`(i) Linearity`,
          d: R`결합분포로 합을 쓰고 주변화 $\sum_yp(x,y)=p(x)$를 쓰면 $a\E X+b\E Y+c$가 나옵니다. 독립은 필요 없습니다.`,
          dEn: R`Write the sum with the joint distribution and use the marginal $\sum_yp(x,y)=p(x)$ to get $a\E X+b\E Y+c$. No independence is needed.` },
        { id: 'var', at: '**(ii)**', t: R`(ii) 분산의 두 공식`, en: R`(ii) Two variance formulas`,
          d: R`제곱을 펼쳐 (i)을 쓰면 $\Var X=\E X^2-\mu^2$. $aX+b$에서는 $b$가 평균과 함께 빠지고 $a$는 제곱으로 나옵니다.`,
          dEn: R`Expanding the square and using (i) gives $\Var X=\E X^2-\mu^2$. For $aX+b$, the $b$ cancels against the mean and $a$ comes out squared.` },
        { id: 'ind', at: '**(iii)**', t: R`(iii) 독립이면`, en: R`(iii) Under independence`,
          d: R`독립이면 결합분포가 곱으로 갈라져 $\E[XY]=\E X\E Y$, 곧 공분산이 0이므로 $\Var(X+Y)$의 교차항이 사라집니다.`,
          dEn: R`Under independence the joint distribution factors, so $\E[XY]=\E X\E Y$; the covariance is 0 and the cross term of $\Var(X+Y)$ vanishes.` },
        { id: 'mean', at: '**(iv)**', t: R`(iv) 표본평균의 분산`, en: R`(iv) Variance of the sample mean`,
          d: R`(iii)을 $n$개로 반복해 $\Var\sum X_i=n\sigma^2$, (ii)로 $\frac1n$을 꺼내면 $\frac1{n^2}$이 붙어 $\sigma^2/n$입니다.`,
          dEn: R`Repeating (iii) for $n$ variables gives $\Var\sum X_i=n\sigma^2$; pulling out $\frac1n$ with (ii) brings a factor $\frac1{n^2}$, giving $\sigma^2/n$.` },
      ],
    },
    'ch02-mapridge': {
      easy: R`사후분포는 가능도 × 사전밀도에 비례하고, 둘 다 가우시안이라 **로그를 취하면 제곱항만 남습니다**. 자료에서 온 $\sum(X_i-\theta)^2$와 사전분포에서 온 $\theta^2/\tau^2$입니다. 그래서 사후밀도를 최대로 하는 문제가 곧 ‘제곱오차 + 벌점 $\lambda\theta^2$’을 최소로 하는 릿지 문제가 됩니다.

릿지 문제는 $\theta$의 이차식이라 미분해 0으로 두면 바로 풀리고, 답 $a\bar X$는 표본평균을 0 쪽으로 줄인 값입니다. 마지막으로 지수를 완전제곱하면 사후분포 자체가 가우시안임이 드러나고, 가우시안은 대칭이므로 최빈값(MAP)과 평균이 같습니다.`,
      easyEn: R`The posterior is proportional to likelihood × prior density, and both are Gaussian, so **taking the log leaves only squared terms**: $\sum(X_i-\theta)^2$ from the data and $\theta^2/\tau^2$ from the prior. Maximizing the posterior density thus becomes the ridge problem of minimizing “squared error + the penalty $\lambda\theta^2$”.

The ridge problem is a quadratic in $\theta$, so setting the derivative to zero solves it at once, and the answer $a\bar X$ is the sample mean shrunk toward 0. Finally, completing the square in the exponent shows that the posterior itself is Gaussian, and a Gaussian is symmetric, so its mode (the MAP) equals its mean.`,
      nodes: [
        { id: 'form', at: '**MAP의 꼴.**', t: R`사후밀도의 로그`, en: R`The log of the posterior`,
          d: R`가능도 × 사전밀도에 로그를 취하면 $-\frac12\sum_i(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}$에 $\theta$와 무관한 상수 $C$만 더해집니다.`,
          dEn: R`Taking the log of likelihood × prior density leaves $-\frac12\sum_i(X_i-\theta)^2-\frac{\theta^2}{2\tau^2}$ plus a constant $C$ independent of $\theta$.` },
        { id: 'ridge', at: R`$\log$가 순증가`, t: R`최대화 → 릿지 최소화`, en: R`Maximize → ridge minimization`,
          d: R`$\log$는 순증가라 최대점이 같고, $-2$를 곱하면 $\sum(X_i-\theta)^2+\frac1{\tau^2}\theta^2$의 최소화, 곧 $\lambda=1/\tau^2$인 릿지입니다.`,
          dEn: R`$\log$ is strictly increasing, so the maximizer is the same; multiplying by $-2$ gives the minimization of $\sum(X_i-\theta)^2+\frac1{\tau^2}\theta^2$, ridge with $\lambda=1/\tau^2$.` },
        { id: 'solve', at: '**풀이.**', t: R`이차식 풀기`, en: R`Solve the quadratic`,
          d: R`$g''=2(n+\lambda)>0$이므로 $g'=0$의 해 $\theta=\frac{n\bar X}{n+\lambda}=a\bar X$가 최소점입니다.`,
          dEn: R`Since $g''=2(n+\lambda)>0$, the solution of $g'=0$, $\theta=\frac{n\bar X}{n+\lambda}=a\bar X$, is the minimizer.` },
        { id: 'post', at: '**사후분포.**', t: R`완전제곱: 사후분포`, en: R`Complete the square: the posterior`,
          d: R`지수를 $\theta$에 대해 완전제곱하면 사후분포가 $\N(a\bar X,\frac1{n+\lambda})$이고, 대칭이므로 MAP = 사후평균 = $a\bar X$입니다.`,
          dEn: R`Completing the square in $\theta$ shows the posterior is $\N(a\bar X,\frac1{n+\lambda})$; it is symmetric, so MAP = posterior mean = $a\bar X$.` },
      ],
    },
    'ch02-biasvar': {
      easy: R`평균제곱오차(MSE)는 추정량이 참값에서 벗어난 정도의 제곱을 평균한 값입니다. 증명의 요령은 그 벗어남을 두 조각으로 나누는 것입니다. 추정량이 **자기 평균 주위에서 흔들리는 부분**과, 그 평균이 참값에서 **일정하게 비껴난 부분(편향)**입니다. 편향은 확률변수가 아니라 상수입니다.

제곱을 펼치면 교차항이 생기지만 흔들림의 평균은 0이므로 교차항도 사라지고, ‘MSE = 편향의 제곱 + 분산’만 남습니다. 수축 추정량 $a\bar X$에 쓰면 편향은 $(a-1)\theta$, 분산은 $a^2/n$입니다. $a$를 줄이면 편향은 커지고 분산은 작아지는 맞교환이 보입니다.`,
      easyEn: R`The mean squared error (MSE) is the average of the squared distance of an estimator from the true value. The trick of the proof is to split that distance into two pieces: the part where the estimator **fluctuates around its own mean**, and the part where that mean **is off from the true value by a fixed amount (the bias)**. The bias is not a random variable but a constant.

Expanding the square produces a cross term, but the fluctuation has mean 0, so the cross term vanishes too, leaving “MSE = bias squared + variance”. Applied to the shrinkage estimator $a\bar X$, the bias is $(a-1)\theta$ and the variance $a^2/n$. Making $a$ smaller increases the bias and decreases the variance: a trade-off.`,
      nodes: [
        { id: 'split', at: R`$b=\E\hat\theta-\theta$는`, t: R`두 조각으로 나누기`, en: R`Split into two pieces`,
          d: R`상수인 편향 $b$를 떼어 $\hat\theta-\theta=(\hat\theta-\E\hat\theta)+b$로 쓰고, 제곱의 평균을 펼치면 세 항이 생깁니다.`,
          dEn: R`Separating the constant bias $b$, write $\hat\theta-\theta=(\hat\theta-\E\hat\theta)+b$; expanding the mean of the square gives three terms.` },
        { id: 'cross', at: '가운데 항', t: R`교차항은 0`, en: R`The cross term is 0`,
          d: R`흔들림 $\hat\theta-\E\hat\theta$의 평균은 0이라 가운데 항이 사라지고, 첫 항은 분산의 정의라 $\mathrm{MSE}=b^2+\Var\hat\theta$입니다.`,
          dEn: R`The fluctuation $\hat\theta-\E\hat\theta$ has mean 0, so the middle term vanishes; the first term is the definition of the variance, so $\mathrm{MSE}=b^2+\Var\hat\theta$.` },
        { id: 'shrink', at: '**수축 추정량.**', t: R`수축 추정량에 적용`, en: R`Apply to the shrinkage estimator`,
          d: R`$\E\bar X=\theta$, $\Var\bar X=1/n$을 쓰면 $a\bar X$의 편향은 $(a-1)\theta$, 분산은 $a^2/n$이고, 편향의 제곱과 분산을 더하면 MSE입니다.`,
          dEn: R`With $\E\bar X=\theta$ and $\Var\bar X=1/n$, $a\bar X$ has bias $(a-1)\theta$ and variance $a^2/n$; adding the squared bias and the variance gives the MSE.` },
      ],
    },
    'ch03-klnonneg': {
      easy: R`$\KL(p\Vert q)$는 $-\log\frac{q(x)}{p(x)}$를 $p$로 평균한 값입니다. $-\log$는 볼록함수이므로 **젠센 부등식**으로 평균을 $\log$ 안으로 넣을 수 있고, 그러면 안에는 $\sum q(x)$, 곧 1 이하의 수만 남아 결과가 0 이상이 됩니다.

등호 조건은 쓰인 두 부등식이 모두 등호가 되는 경우를 따지면 나옵니다. 젠센 부등식의 등호는 비율 $q/p$가 상수일 때뿐이고($-\log$가 순볼록이므로), 둘째 부등식의 등호는 $q$의 질량이 모두 $p>0$인 곳에 있을 때뿐입니다. 둘을 합치면 $q=p$입니다.`,
      easyEn: R`$\KL(p\Vert q)$ is the average of $-\log\frac{q(x)}{p(x)}$ under $p$. Since $-\log$ is convex, **Jensen's inequality** moves the average inside the $\log$; inside then sits only $\sum q(x)$, a number at most 1, so the result is at least 0.

The equality condition comes from asking when both inequalities used are equalities. Jensen's is an equality only when the ratio $q/p$ is constant (because $-\log$ is strictly convex), and the second only when all of $q$'s mass lies where $p>0$. Together they force $q=p$.`,
      nodes: [
        { id: 'supp', at: R`$E=\{x:p(x)>0\}$로`, t: R`$p>0$인 곳만 보기`, en: R`Look only where $p>0$`,
          d: R`$p(x)=0$인 항은 0이라 합을 $p>0$인 집합 $E$로 줄입니다. $E$에 $q=0$인 점이 있으면 $\KL=+\infty$라 끝나므로, 이제 $E$에서 $q>0$이라 둡니다.`,
          dEn: R`Terms with $p(x)=0$ are 0, so the sum shrinks to the set $E$ where $p>0$. If $q=0$ somewhere on $E$, then $\KL=+\infty$ and we are done, so from now on $q>0$ on $E$.` },
        { id: 'jensen', at: '**부등식.**', t: R`젠센 부등식`, en: R`Jensen’s inequality`,
          d: R`$\KL$을 $-\log(q/p)$의 $p$-평균으로 보면, 볼록한 $-\log$ 안으로 평균을 넣을 수 있고, 안에 남는 $\sum_{x\in E}q(x)\le1$ 덕분에 결과가 0 이상입니다.`,
          dEn: R`View $\KL$ as the $p$-average of $-\log(q/p)$. Jensen’s inequality moves the average inside the convex $-\log$; what remains inside is $\sum_{x\in E}q(x)\le1$, so the result is at least 0.` },
        { id: 'eq', at: '**등호.**', t: R`등호의 두 조건`, en: R`Two conditions for equality`,
          d: R`등호이려면 두 부등식이 모두 등호여야 합니다. 순볼록성에서 $q/p=c$ (상수), 둘째에서 $\sum_{x\in E}q(x)=1$.`,
          dEn: R`Equality needs both inequalities to be equalities: strict convexity gives $q/p=c$ (a constant), and the second gives $\sum_{x\in E}q(x)=1$.` },
        { id: 'conc', at: '이므로', t: R`$c=1$, 곧 $q=p$`, en: R`$c=1$, so $q=p$`,
          d: R`두 조건에서 $c=1$이라 $E$에서 $q=p$이고, $E$ 밖에는 $q$의 질량이 남지 않아 $q=0=p$. 역으로 $p=q$이면 모든 항이 0입니다.`,
          dEn: R`The two conditions give $c=1$, so $q=p$ on $E$; no mass of $q$ is left outside $E$, so $q=0=p$ there. Conversely, if $p=q$, every term is 0.` },
      ],
    },
    'ch03-jsdiv': {
      easy: R`JS 발산은 두 분포 $p,q$를 각각 그 평균 $m=\frac12(p+q)$와 KL 발산으로 비교해 평균 낸 값입니다. 네 성질 가운데 셋은 거의 정의에서 바로 나옵니다. (i)과 (ii)는 KL에 관한 Theorem 1(음이 아니고, 0이면 두 분포가 같다)을 두 KL에 쓰면 되고, (iii)은 $m$이 $p$와 $q$에 대해 대칭이라는 점에서 나옵니다.

새로운 생각이 필요한 것은 (iv)의 상한뿐입니다. $m$은 적어도 $p$의 절반이므로 비율 $p/m$은 2를 넘지 못하고, 따라서 각 KL은 $\log2$ 이하입니다. 비율이 정확히 2가 되는 것은 $q=0$인 곳뿐이므로, 등호는 $p$와 $q$가 겹치지 않을 때입니다.`,
      easyEn: R`The JS divergence compares each of $p$ and $q$ with their average $m=\frac12(p+q)$ by the KL divergence and averages the two. Three of the four properties follow almost straight from the definition: (i) and (ii) apply Theorem 1 on the KL divergence (it is nonnegative, and 0 only when the two distributions agree) to the two KL terms, and (iii) follows from the symmetry of $m$ in $p$ and $q$.

Only the upper bound (iv) needs a new idea. $m$ is at least half of $p$, so the ratio $p/m$ cannot exceed 2, and hence each KL term is at most $\log2$. The ratio is exactly 2 only where $q=0$, so equality holds when $p$ and $q$ do not overlap.`,
      nodes: [
        { id: 'prep', at: '**준비.**', t: R`$m$은 분포, KL은 유한`, en: R`$m$ is a distribution, KL is finite`,
          d: R`$m$은 합이 1인 분포이고, $p>0$인 곳에서 $m\ge\frac12p>0$이라 두 KL이 유한합니다. 도구로 Theorem 1을 꺼내 둡니다.`,
          dEn: R`$m$ is a distribution summing to 1, and $m\ge\frac12p>0$ where $p>0$, so both KL terms are finite. Theorem 1 is set out as the tool.` },
        { id: 'i', at: '**(i)**', t: R`(i) 음이 아님`, en: R`(i) Nonnegativity`,
          d: R`음이 아닌 두 KL의 평균이므로 0 이상입니다.`,
          dEn: R`It is the average of two nonnegative KL terms, so it is at least 0.` },
        { id: 'ii', at: '**(ii)**', t: R`(ii) 0이면 같은 분포`, en: R`(ii) Zero means equal`,
          d: R`합이 0이면 두 KL이 모두 0이고, Theorem 1의 등호 조건으로 $p=m=q$. 역은 $p=q$이면 $m=p$라 바로 나옵니다.`,
          dEn: R`If the sum is 0, both KL terms are 0, and the equality case of Theorem 1 gives $p=m=q$. Conversely, $p=q$ makes $m=p$ at once.` },
        { id: 'iii', at: '**(iii)**', t: R`(iii) 대칭`, en: R`(iii) Symmetry`,
          d: R`$m$이 $p,q$에 대칭이라 둘을 바꾸면 두 항의 순서만 바뀝니다.`,
          dEn: R`$m$ is symmetric in $p,q$, so swapping them only swaps the two terms.` },
        { id: 'iv', at: '**(iv)**', t: R`(iv) 상한 $\log2$`, en: R`(iv) The bound $\log2$`,
          d: R`$p>0$인 곳에서 $p/m=\frac{2p}{p+q}\le2$라 $\KL(p\Vert m)\le\log2$이고 $q$도 같습니다. 등호는 모든 $x$에서 $p(x)q(x)=0$일 때.`,
          dEn: R`Where $p>0$, $p/m=\frac{2p}{p+q}\le2$, so $\KL(p\Vert m)\le\log2$, and likewise for $q$. Equality holds when $p(x)q(x)=0$ for every $x$.` },
      ],
    },
    'ch04-lsemle': {
      easy: R`잡음이 가우시안이면 각 관측 $y_i$의 밀도는 $\exp\big(-(y_i-h_i(\beta))^2/(2\sigma^2)\big)$에 비례합니다. 로그를 취하면 지수가 내려와 **잔차의 제곱**이 되고, 독립인 관측의 로그가능도는 이것들의 합입니다. 그래서 로그가능도는 ‘$\sigma$에만 걸린 항’과 ‘음수 × 제곱오차합’으로 나뉩니다.

$\beta$에 대해서는 첫 항이 상수이고 둘째 항의 계수가 음수이므로, 로그가능도를 키우는 것은 곧 제곱오차합을 줄이는 것입니다. 이 결론은 $\sigma$가 얼마든 같습니다. 그다음 $\hat\beta$를 넣은 채 $\sigma^2$에 대해 미분해 0으로 두면, $\sigma^2$의 추정량은 잔차 제곱의 평균이 됩니다.`,
      easyEn: R`With Gaussian noise, the density of each observation $y_i$ is proportional to $\exp\big(-(y_i-h_i(\beta))^2/(2\sigma^2)\big)$. Taking the log brings the exponent down as the **squared residual**, and the log-likelihood of independent observations is the sum of these. So the log-likelihood splits into “a term involving only $\sigma$” and “a negative number times the sum of squared errors”.

In $\beta$, the first term is constant and the second has a negative coefficient, so making the log-likelihood larger is making the sum of squared errors smaller, whatever $\sigma$ is. Then, with $\hat\beta$ plugged in, differentiating in $\sigma^2$ and setting the result to zero makes the estimate of $\sigma^2$ the mean of the squared residuals.`,
      nodes: [
        { id: 'll', at: '독립성에서', t: R`로그밀도를 더하기`, en: R`Add up the log densities`,
          d: R`독립이므로 정규밀도의 로그를 더하면 $-n\log(\sqrt{2\pi}\sigma)$와 $-\frac1{2\sigma^2}\sum(y_i-h_i(\beta))^2$ 두 부분이 됩니다.`,
          dEn: R`By independence, adding the logs of the normal densities gives two parts: $-n\log(\sqrt{2\pi}\sigma)$ and $-\frac1{2\sigma^2}\sum(y_i-h_i(\beta))^2$.` },
        { id: 'beta', at: R`**$\beta$에 대해.**`, t: R`$\beta$: 제곱합의 최소화`, en: R`In $\beta$: least squares`,
          d: R`첫 부분은 $\beta$와 무관하고 둘째 부분의 계수가 음수라, $\ell$의 최대화가 곧 제곱오차합의 최소화입니다. $\sigma$의 값과 상관없습니다.`,
          dEn: R`The first part does not involve $\beta$ and the second has a negative coefficient, so maximizing $\ell$ is minimizing the sum of squared errors, whatever $\sigma$ is.` },
        { id: 'sigma', at: R`**$\sigma^2$에 대해.**`, t: R`$\sigma^2$: 미분해 0으로`, en: R`In $\sigma^2$: set the derivative to 0`,
          d: R`$v=\sigma^2$로 미분해 0으로 두면 $\hat v=f(\hat\beta)/n$. $f(\hat\beta)>0$이면 $v\to0^+$, $v\to\infty$에서 $\ell\to-\infty$라 이 점이 최대입니다.`,
          dEn: R`Differentiating in $v=\sigma^2$ and setting it to zero gives $\hat v=f(\hat\beta)/n$. If $f(\hat\beta)>0$, $\ell\to-\infty$ as $v\to0^+$ and as $v\to\infty$, so this point is the maximum.` },
      ],
    },
    'ch04-pushthrough': {
      easy: R`보일 식은 크기가 다른 두 역행렬, $d\times d$인 $(\lambda I_d+\varphi\varphi^T)^{-1}$과 $n\times n$인 $(\lambda I_n+\varphi^T\varphi)^{-1}$를 잇습니다. 요령은 역행렬 없이 성립하는 **교환 관계** $(\lambda I_d+\varphi\varphi^T)\varphi=\varphi(\lambda I_n+\varphi^T\varphi)$를 먼저 보이는 것입니다. 괄호를 풀면 양변이 모두 $\lambda\varphi+\varphi\varphi^T\varphi$라 바로 나옵니다.

그다음 이 식의 왼쪽과 오른쪽에 각각 알맞은 크기의 역행렬을 곱하면 끝입니다. 그러려면 두 역행렬이 있어야 하므로, $\lambda>0$ 덕분에 두 행렬이 양의 정부호라는 것을 맨 먼저 확인합니다.`,
      easyEn: R`The identity links two inverses of different sizes: the $d\times d$ $(\lambda I_d+\varphi\varphi^T)^{-1}$ and the $n\times n$ $(\lambda I_n+\varphi^T\varphi)^{-1}$. The trick is to prove first an **exchange relation** that needs no inverses, $(\lambda I_d+\varphi\varphi^T)\varphi=\varphi(\lambda I_n+\varphi^T\varphi)$; expanding the brackets, both sides are $\lambda\varphi+\varphi\varphi^T\varphi$.

Then multiply this equation by the inverse of the right size on each side, on the left and on the right, and we are done. For that both inverses must exist, so the very first step checks that, thanks to $\lambda>0$, both matrices are positive definite.`,
      nodes: [
        { id: 'inv', at: '**1. 두 행렬은 가역.**', t: R`두 행렬은 가역`, en: R`Both matrices are invertible`,
          d: R`$\lambda>0$이라 $v\ne0$이면 $v^T(\lambda I_d+\varphi\varphi^T)v=\lambda\lVert v\rVert^2+\lVert\varphi^Tv\rVert^2>0$이고, $n\times n$ 쪽도 같습니다. 양의 정부호이므로 가역.`,
          dEn: R`Since $\lambda>0$, $v\ne0$ gives $v^T(\lambda I_d+\varphi\varphi^T)v=\lambda\lVert v\rVert^2+\lVert\varphi^Tv\rVert^2>0$, and likewise for the $n\times n$ matrix; positive definite, hence invertible.` },
        { id: 'swap', at: '**2. 교환 관계.**', t: R`교환 관계`, en: R`The exchange relation`,
          d: R`괄호를 풀면 양변이 모두 $\lambda\varphi+\varphi\varphi^T\varphi$입니다. 역행렬 없이 성립하는 식이라 어떤 가정도 필요 없습니다.`,
          dEn: R`Expanding the brackets, both sides equal $\lambda\varphi+\varphi\varphi^T\varphi$. No inverses are involved, so no assumption is needed.` },
        { id: 'mult', at: '**3. 역행렬 곱하기.**', t: R`양쪽에 서로 다른 역행렬`, en: R`A different inverse on each side`,
          d: R`왼쪽에 $d\times d$ 역행렬, 오른쪽에 $n\times n$ 역행렬을 곱하면 결과입니다. 두 행렬은 크기가 달라 서로 다른 역행렬입니다.`,
          dEn: R`Multiply by the $d\times d$ inverse on the left and the $n\times n$ inverse on the right. The two matrices have different sizes, so these are different inverses.` },
      ],
    },
    'ch04-kernelridge': {
      easy: R`목표는 예측 $f^*(x)=\varphi(x)^T\beta^*$를 특성 벡터 없이 **커널** $K(x,z)=\varphi(x)^T\varphi(z)$만으로 쓰는 것입니다. 특성 차원 $d$가 크면 $d\times d$ 역행렬을 계산할 수 없으므로, $\varphi$가 늘 내적 $\varphi^T\varphi$의 꼴로만 나타나도록 식을 바꿔야 합니다.

증명은 두 길을 보입니다. 유도 1은 보통의 릿지 해를 구한 뒤 푸시스루 항등식으로 $\varphi$를 역행렬의 반대편으로 옮겨, $d\times d$ 역행렬을 $n\times n$ 역행렬 $(\lambda I+K)^{-1}$로 바꿉니다. 유도 2(필기)는 처음부터 $\beta=\varphi\alpha$로 두어 문제 전체를 $K$로 쓰고 $\alpha$를 풉니다. 두 길은 같은 예측에 도착합니다.`,
      easyEn: R`The goal is to write the prediction $f^*(x)=\varphi(x)^T\beta^*$ with **kernels** $K(x,z)=\varphi(x)^T\varphi(z)$ alone, without feature vectors. When the feature dimension $d$ is large, a $d\times d$ inverse cannot be computed, so the formula must be rearranged until $\varphi$ appears only inside inner products $\varphi^T\varphi$.

The proof shows two routes. Derivation 1 finds the ordinary ridge solution and then uses the push-through identity to move $\varphi$ to the other side of the inverse, turning the $d\times d$ inverse into the $n\times n$ inverse $(\lambda I+K)^{-1}$. Derivation 2 (from the notes) sets $\beta=\varphi\alpha$ from the start, writes the whole problem in terms of $K$, and solves for $\alpha$. Both routes arrive at the same prediction.`,
      nodes: [
        { id: 'ridge', at: '**유도 1', g: R`유도 1: 푸시스루`, gEn: R`Derivation 1: push-through`, t: R`릿지 해, 그리고 푸시스루`, en: R`Ridge solution, then push-through`,
          d: R`기울기를 0으로 두면 $\beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y$이고, 푸시스루 항등식으로 $\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y$로 바꿉니다.`,
          dEn: R`Setting the gradient to zero gives $\beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y$, and the push-through identity turns it into $\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y$.` },
        { id: 'pred', at: '마지막 등호가', t: R`예측은 커널만으로`, en: R`The prediction in kernels only`,
          d: R`$f^*(x)=\varphi(x)^T\beta^*$에 넣으면 $\varphi(x)^T\varphi=K(x,X)$, $\varphi^T\varphi=K$로 묶여 특성 벡터가 사라집니다.`,
          dEn: R`Substituting into $f^*(x)=\varphi(x)^T\beta^*$, the products group into $\varphi(x)^T\varphi=K(x,X)$ and $\varphi^T\varphi=K$, and the feature vectors disappear.` },
        { id: 'alpha', at: '**유도 2', g: R`유도 2: $\beta=\varphi\alpha$로 치환`, gEn: R`Derivation 2: substitute $\beta=\varphi\alpha$`, t: R`$K$만으로 다시 쓰기`, en: R`Rewrite with $K$ alone`,
          d: R`$\varphi^T\beta=K\alpha$, $\beta^T\beta=\alpha^TK\alpha$라 $J$가 $K$로만 쓰이고, 기울기가 $K((K+\lambda I)\alpha-y)$로 묶입니다.`,
          dEn: R`Since $\varphi^T\beta=K\alpha$ and $\beta^T\beta=\alpha^TK\alpha$, $J$ is written with $K$ alone, and its gradient factors as $K((K+\lambda I)\alpha-y)$.` },
        { id: 'same', at: R`$\alpha^*=(K+\lambda I)^{-1}y$이면`, t: R`같은 예측에 도착`, en: R`The same prediction`,
          d: R`$\alpha^*=(K+\lambda I)^{-1}y$에서 괄호가 0이라 기울기가 0이고, $\beta^*=\varphi\alpha^*$는 유도 1의 해와 같아 예측도 같습니다.`,
          dEn: R`At $\alpha^*=(K+\lambda I)^{-1}y$ the bracket is 0, so the gradient vanishes; $\beta^*=\varphi\alpha^*$ is the solution of Derivation 1, so the prediction is the same.` },
      ],
    },
    'ch05-lrnll': {
      easy: R`먼저 각 표본의 확률을 베르누이 분포 한 식 $\sigma(z_i)^{y_i}(1-\sigma(z_i))^{1-y_i}$로 써서 모두 곱하고, $-\log$를 취해 곱을 합으로 바꿉니다. 이것이 교차 엔트로피 꼴입니다.

나머지는 시그모이드를 대입해 식을 줄이는 계산입니다. 열쇠는 $-\log\sigma(z)$와 $-\log(1-\sigma(z))$가 모두 같은 항 $\log(1+e^{-z})$를 품고 있고, 뒤의 것에는 $z$가 하나 더 붙는다는 점입니다. 그래서 $y_i$가 붙은 항과 $1-y_i$가 붙은 항이 합쳐져 계수가 1이 됩니다.`,
      easyEn: R`First write the probability of each sample with the single Bernoulli formula $\sigma(z_i)^{y_i}(1-\sigma(z_i))^{1-y_i}$, multiply over all samples, and take $-\log$ to turn the product into a sum. This is the cross-entropy form.

The rest is a computation that substitutes the sigmoid and shortens the expression. The key is that $-\log\sigma(z)$ and $-\log(1-\sigma(z))$ both contain the same term $\log(1+e^{-z})$, the latter with an extra $z$. So the terms carrying $y_i$ and $1-y_i$ merge, and their coefficients add up to 1.`,
      nodes: [
        { id: 'lik', at: '**가능도.**', t: R`가능도 → 교차 엔트로피`, en: R`Likelihood → cross-entropy`,
          d: R`$y_i$에 따라 한 인수만 남는 베르누이 식을 표본마다 곱하고 $-\log$를 취하면, 곱이 합이 되어 교차 엔트로피 꼴이 됩니다.`,
          dEn: R`Multiply over the samples the Bernoulli formula in which $y_i$ picks one factor, then take $-\log$: the product becomes a sum, in cross-entropy form.` },
        { id: 'two', at: '**정리(필기).**', t: R`두 로그를 계산`, en: R`Compute the two logs`,
          d: R`$-\log\sigma(z)=\log(1+e^{-z})$, $-\log(1-\sigma(z))=z+\log(1+e^{-z})$. 두 식에 같은 항 $\log(1+e^{-z})$가 들어 있습니다.`,
          dEn: R`$-\log\sigma(z)=\log(1+e^{-z})$ and $-\log(1-\sigma(z))=z+\log(1+e^{-z})$; both contain the same term $\log(1+e^{-z})$.` },
        { id: 'sub', at: '대입하면', t: R`대입`, en: R`Substitute`,
          d: R`두 식을 넣으면 $\log(1+e^{-z_i})$가 계수 $y_i$인 합과 계수 $1-y_i$인 합에 한 번씩 나타납니다.`,
          dEn: R`After substitution, $\log(1+e^{-z_i})$ appears twice: in a sum with coefficient $y_i$ and in one with coefficient $1-y_i$.` },
        { id: 'merge', at: '첫 합과', t: R`계수 합치기`, en: R`Merge the coefficients`,
          d: R`두 계수가 $y_i+(1-y_i)=1$로 합쳐져 명제의 짧은 식 $\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i$가 됩니다.`,
          dEn: R`The two coefficients add to $y_i+(1-y_i)=1$, giving the short form $\sum_i\log(1+e^{-z_i})+\sum_i(1-y_i)z_i$ of the statement.` },
      ],
    },
    'ch05-lrhess': {
      easy: R`할 일은 셋입니다. 기울기 $\sum_i(\sigma(z_i)-y_i)x_i$를 한 번 더 미분해 헤시안을 구하고, 그 헤시안이 **양의 준정부호**임을 보이고, 그로부터 ‘기울기가 0인 점은 전역 최소점’임을 끌어냅니다.

헤시안은 $\sigma'=\sigma(1-\sigma)$ 덕분에 양수 가중치 $s_i$를 단 $x_ix_i^T$들의 합이 됩니다. 각 $x_ix_i^T$는 어느 방향 $v$로 재어도 $(x_i^Tv)^2\ge0$이므로 합도 그렇습니다. 마지막 단계는 두 점을 잇는 선분 위로 함수를 제한해, 1변수 볼록함수의 성질 ‘그래프가 접선 위에 놓인다’를 쓰는 것입니다.`,
      easyEn: R`There are three tasks: differentiate the gradient $\sum_i(\sigma(z_i)-y_i)x_i$ once more to get the Hessian, show that this Hessian is **positive semidefinite**, and deduce from it that a point with zero gradient is a global minimizer.

Thanks to $\sigma'=\sigma(1-\sigma)$, the Hessian is a sum of the matrices $x_ix_i^T$ with positive weights $s_i$. Each $x_ix_i^T$, measured in any direction $v$, gives $(x_i^Tv)^2\ge0$, and so does the sum. The last step restricts the function to the segment between two points and uses a property of convex functions of one variable: the graph lies above its tangent.`,
      nodes: [
        { id: 'hess', at: '**헤시안.**', t: R`한 번 더 미분`, en: R`Differentiate once more`,
          d: R`기울기의 $k$번째 성분을 $w_l$로 미분하면 연쇄법칙으로 $\sigma'(z_i)x_{il}$이 나와 $\nabla^2J=\sum_i\sigma'(z_i)x_ix_i^T$입니다.`,
          dEn: R`Differentiating the $k$-th component of the gradient in $w_l$, the chain rule brings out $\sigma'(z_i)x_{il}$, so $\nabla^2J=\sum_i\sigma'(z_i)x_ix_i^T$.` },
        { id: 'mat', at: '행렬로 쓰면', t: R`행렬로 모으기: $X^TSX$`, en: R`Collect as a matrix: $X^TSX$`,
          d: R`가중치 $s_i=\sigma(z_i)(1-\sigma(z_i))$를 대각행렬 $S$에 두면 합이 $X^TSX$입니다.`,
          dEn: R`Put the weights $s_i=\sigma(z_i)(1-\sigma(z_i))$ on the diagonal of $S$; the sum is then $X^TSX$.` },
        { id: 'psd', at: '**양의 준정부호', t: R`양의 준정부호`, en: R`Positive semidefinite`,
          d: R`$v^T\nabla^2Jv=\sum_is_i(x_i^Tv)^2$에서 $s_i>0$이고 제곱은 음이 아니므로, 어느 방향 $v$로 재어도 0 이상입니다.`,
          dEn: R`In $v^T\nabla^2Jv=\sum_is_i(x_i^Tv)^2$ each $s_i>0$ and each square is nonnegative, so the value is at least 0 in every direction $v$.` },
        { id: 'cvx', at: '**볼록성.**', t: R`볼록 → 전역 최소`, en: R`Convex → global minimum`,
          d: R`선분 위의 1변수 함수 $g$는 $g''\ge0$이라 접선 위에 놓여 $J(u)\ge J(w)+\nabla J(w)^T(u-w)$이고, $\nabla J(w^*)=0$을 넣으면 끝입니다.`,
          dEn: R`On a segment, the one-variable function $g$ has $g''\ge0$, so it lies above its tangent: $J(u)\ge J(w)+\nabla J(w)^T(u-w)$. Putting in $\nabla J(w^*)=0$ finishes.` },
      ],
    },
    'ch07-svmprimal': {
      easy: R`출발점은 ‘가장 가까운 자료점까지의 거리(마진)가 가장 큰 분리 평면’을 찾는 문제이고, 도착점은 제약 $y_i(w^Tx_i+b)\ge1$ 아래에서 $\frac12w^Tw$를 최소화하는 문제입니다. 다리를 놓는 열쇠는 **스케일 불변성**입니다. $(w,b)$에 양수를 곱해도 같은 평면이므로 크기를 하나 마음대로 정할 수 있고, ‘가장 가까운 점에서 $\lvert w^Tx_i+b\rvert=1$’로 정하면 마진이 $1/\lVert w\rVert$가 되어 마진 최대화가 곧 $\lVert w\rVert$ 최소화입니다.

남은 일은 제약을 정리하는 것입니다. ‘모든 점이 평면의 옳은 쪽에 있다’와 ‘가장 가까운 점에서 정확히 1’이라는 두 조건을 부등식 하나 $y_i(w^Tx_i+b)\ge1$로 바꿔도 최적해가 같음을 보입니다. 핵심은, 부등식이 어느 점에서도 등호가 아니라면 $(w,b)$를 더 줄일 수 있으므로 최적해에서는 반드시 어떤 점에서 등호가 된다는 것입니다.`,
      easyEn: R`The starting point is the problem of finding the separating plane whose distance to the nearest data point (the margin) is largest; the end point is minimizing $\frac12w^Tw$ subject to $y_i(w^Tx_i+b)\ge1$. The bridge is **scale invariance**. Multiplying $(w,b)$ by a positive number gives the same plane, so one scale can be fixed at will; fixing $\lvert w^Tx_i+b\rvert=1$ at the nearest point makes the margin $1/\lVert w\rVert$, so maximizing the margin is minimizing $\lVert w\rVert$.

What remains is to tidy up the constraints. We show that replacing the two conditions “every point is on the correct side of the plane” and “exactly 1 at the nearest point” by the single inequality $y_i(w^Tx_i+b)\ge1$ leaves the optimum unchanged. The key is that if the inequality were strict at every point, $(w,b)$ could be shrunk further, so at the optimum it must be an equality at some point.`,
      nodes: [
        { id: 'scale', at: '**1. 스케일 불변', g: R`목적함수 바꾸기`, gEn: R`Rewrite the objective`, t: R`스케일 불변`, en: R`Scale invariance`,
          d: R`$(w,b)$에 $\beta>0$을 곱해도 평면도, 마진 $r$도, 분리 조건도 그대로입니다. 그래서 크기를 하나 마음대로 정해도 됩니다.`,
          dEn: R`Multiplying $(w,b)$ by $\beta>0$ changes neither the plane, nor the margin $r$, nor the separation condition, so one scale may be fixed freely.` },
        { id: 'norm', at: '**2. 정규화.**', t: R`정규화: 마진 $=1/\lVert w\rVert$`, en: R`Normalize: margin $=1/\lVert w\rVert$`,
          d: R`최적 평면은 자료점을 지나지 않으므로, 가장 가까운 점에서 $\lvert w^Tx_i+b\rvert=1$이 되게 크기를 맞추면 마진이 $1/\lVert w\rVert$입니다.`,
          dEn: R`The optimal plane passes through no data point, so scaling until $\lvert w^Tx_i+b\rvert=1$ at the nearest point makes the margin $1/\lVert w\rVert$.` },
        { id: 'obj', at: '**3. 목적함수.**', t: R`최대화 → 최소화`, en: R`Maximize → minimize`,
          d: R`$1/\lVert w\rVert$를 키우는 것은 $\lVert w\rVert$를, 따라서 $\frac12w^Tw$를 줄이는 것과 같습니다($t\ge0$에서 $\frac12t^2$은 증가).`,
          dEn: R`Making $1/\lVert w\rVert$ larger is making $\lVert w\rVert$, hence $\frac12w^Tw$, smaller ($\frac12t^2$ is increasing for $t\ge0$).` },
        { id: 'merge', at: '**4. 제약의 합치기.**', g: R`제약 바꾸기`, gEn: R`Rewrite the constraints`, t: R`목표: 두 제약을 하나로`, en: R`Goal: one constraint for two`,
          d: R`제약이 “$y_i(w^Tx_i+b)\ge0$, $\min_i\lvert w^Tx_i+b\rvert=1$”인 앞 문제와 “$y_i(w^Tx_i+b)\ge1$”인 뒤 문제의 최적해가 같음을 보이기로 합니다.`,
          dEn: R`We set out to show that the former problem, with constraints “$y_i(w^Tx_i+b)\ge0$, $\min_i\lvert w^Tx_i+b\rvert=1$”, and the latter, with “$y_i(w^Tx_i+b)\ge1$”, have the same optimum.` },
        { id: 'both', at: '- 앞 문제의', t: R`두 방향 확인`, en: R`Check both directions`,
          d: R`앞 문제의 가능해는 뒤 문제의 가능해입니다. 뒤 문제의 최적해에서는 $\min_iy_i(w^Tx_i+b)=1$이라(더 크면 나누어 $\lVert w\rVert$를 줄임) 앞 문제의 가능해입니다.`,
          dEn: R`A feasible point of the former is feasible for the latter. At the latter's optimum $\min_iy_i(w^Tx_i+b)=1$ (if larger, dividing would shrink $\lVert w\rVert$), so it is feasible for the former.` },
        { id: 'same', at: '앞 문제의 가능 영역', t: R`같은 최적해`, en: R`The same optimum`,
          d: R`넓은 영역에서의 최적해가 좁은 영역 안에 들어 있으므로 좁은 영역에서도 최적입니다. 따라서 두 문제의 최적해가 같습니다.`,
          dEn: R`The optimum over the larger region lies inside the smaller one, so it is optimal there too; hence the two problems share their optimum.` },
      ],
    },
    'ch07-svmdual': {
      easy: R`쌍대 문제를 얻으려면 $\alpha$를 고정하고 라그랑지안 $L_p$를 $w,b$에 대해 최소화한 값, 곧 **쌍대 함수**를 구해야 합니다. 펼쳐 보면 $L_p$는 $w$에 대해서는 볼록한 이차식, $b$에 대해서는 일차식이라 둘을 따로 다룰 수 있습니다.

일차식은 기울기가 0이 아니면 아래로 끝없이 내려가므로, 의미 있는 값을 얻으려면 $b$의 계수 $\sum_i\alpha_iy_i$가 0이어야 하고, 이것이 쌍대 문제의 등식 제약이 됩니다. 이차식은 꼭짓점 $w=\sum_i\alpha_iy_ix_i$에서 최소이고, 그 최솟값을 대입하면 $\alpha$만의 식이 남습니다. 이것을 최대화하는 것이 쌍대 문제입니다.`,
      easyEn: R`To get the dual problem, fix $\alpha$ and minimize the Lagrangian $L_p$ over $w,b$; the result is the **dual function**. Expanded, $L_p$ is a convex quadratic in $w$ and linear in $b$, so the two can be handled separately.

A linear function with nonzero slope goes down without bound, so to get a meaningful value the coefficient of $b$, $\sum_i\alpha_iy_i$, must be 0; this becomes the equality constraint of the dual problem. The quadratic is smallest at its vertex $w=\sum_i\alpha_iy_ix_i$, and substituting its minimum leaves an expression in $\alpha$ alone. Maximizing it is the dual problem.`,
      nodes: [
        { id: 'exp', at: '$L_p$를 전개', t: R`펼쳐서 $w$와 $b$ 나누기`, en: R`Expand: separate $w$ and $b$`,
          d: R`$L_p$를 $w$의 이차식, $b$의 일차식, 상수 $\sum_i\alpha_i$로 펼칩니다. 이제 $w$와 $b$에 대해 따로 최소화할 수 있습니다.`,
          dEn: R`Expand $L_p$ into a quadratic in $w$, a linear term in $b$, and the constant $\sum_i\alpha_i$. Now $w$ and $b$ can be minimized over separately.` },
        { id: 'b', at: '**$b$에 대해.**', t: R`$b$: 계수가 0이어야`, en: R`In $b$: the coefficient must vanish`,
          d: R`$b$의 계수 $\sum_i\alpha_iy_i$가 0이 아니면 $b\to\pm\infty$로 $-\infty$입니다. 유한하려면 $\sum_i\alpha_iy_i=0$, 이것이 쌍대 문제의 제약이 됩니다.`,
          dEn: R`If the coefficient $\sum_i\alpha_iy_i$ of $b$ is nonzero, $b\to\pm\infty$ sends $L_p$ to $-\infty$. To stay finite we need $\sum_i\alpha_iy_i=0$, which becomes a constraint of the dual.` },
        { id: 'w', at: '**$w$에 대해.**', t: R`$w$: 이차식의 꼭짓점`, en: R`In $w$: the vertex of a quadratic`,
          d: R`$\frac12w^Tw-w^Tu$는 순볼록 이차식이라 기울기가 0인 $w=u=\sum_i\alpha_iy_ix_i$에서 최소이고, 최솟값은 $-\frac12u^Tu$입니다.`,
          dEn: R`$\frac12w^Tw-w^Tu$ is a strictly convex quadratic, smallest where its gradient vanishes, $w=u=\sum_i\alpha_iy_ix_i$, with minimum $-\frac12u^Tu$.` },
        { id: 'sub', at: '**대입.**', t: R`대입해 $\alpha$만 남기기`, en: R`Substitute: only $\alpha$ remains`,
          d: R`최솟값을 넣고 $u^Tu$를 이중합으로 펼치면 $\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$. 이것을 제약 아래에서 최대화하면 쌍대 문제입니다.`,
          dEn: R`Putting in the minimum and expanding $u^Tu$ as a double sum gives $\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_jx_i^Tx_j$; maximizing it under the constraints is the dual problem.` },
      ],
    },
  });
})();
