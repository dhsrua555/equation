/* 논리 지도 — 02 확률, 가능도, 베이즈 추론. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 형식은 map-01.js와 같습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 2,
    easy: R`
이 단원은 질문 하나에서 시작합니다. 동전을 10번 던져 앞면이 7번 나왔다면, 이 동전의 앞면 확률은 얼마라고 봐야 할까요? 답하려면 먼저 불확실성을 다루는 언어인 **확률**이 필요합니다. 확률을 ‘전체 중 얼마만큼’을 재는 넓이처럼 다루는 세 공리에서 출발해, 조건이 주어졌을 때 확률을 고치는 **베이즈 정리**와 결과에 숫자를 붙이는 확률변수(평균·분산)를 차례로 세웁니다.

그다음 추정의 두 길을 봅니다. **최대가능도 추정**(MLE)은 ‘관측된 자료를 가장 그럴듯하게 만드는 값’을 고르므로 답은 $7/10$입니다. 그러나 세 번 던져 모두 앞면이면 ‘앞으로도 항상 앞면’이라고 과신합니다. **베이즈 추론**은 모르는 값을 하나로 정하지 않고 믿음의 분포로 둡니다. 자료를 보기 전의 믿음(사전분포)에 자료가 주는 증거(가능도)를 곱하면 자료를 본 뒤의 믿음(사후분포)이 됩니다.

사후분포에서 가장 높은 곳 하나만 고르는 것이 **MAP** 추정입니다. 로그를 취하면 ‘자료에 안 맞는 정도 + 사전 믿음에서 벗어난 정도’를 최소화하는 문제가 되는데, 이것이 머신러닝의 **손실 + 규제**입니다. ‘공정한 동전일 것 같다’는 사전분포 $\operatorname{Beta}(2,2)$를 쓰면 답이 $0.7$에서 약 $0.667$로 $0.5$ 쪽으로 당겨지고, 가우시안 사전분포는 $L_2$ 규제(릿지)가 됩니다. 리뷰가 적은 판매자를 고를 때처럼 불확실성 자체가 중요하면 사후분포 전체로 비교합니다.

마지막 절은 규제가 왜 도움이 되는지를 가장 단순한 경우로 보여 줍니다. 가우시안 평균의 MAP은 표본평균을 0 쪽으로 조금 끌어당기는데(**수축**), 그러면 평균적으로 조금 빗나가지만(편향) 덜 흔들립니다(분산). 전체 오차는 $\mathrm{MSE}=\text{편향}^2+\text{분산}$이라, 참값이 0에서 너무 멀지 않으면 오히려 줄어듭니다. 이 거래가 4단원의 릿지·라쏘로 이어집니다.`,
    easyEn: R`
This unit starts from a single question. If a coin lands heads 7 times in 10 tosses, what should we take its probability of heads to be? To answer, we first need **probability**, the language of uncertainty. Starting from three axioms that treat probability like an area (“how much of the whole”), we build **Bayes’ theorem**, which updates a probability once a condition is known, and random variables, which attach numbers to outcomes (with their mean and variance).

Next come two roads to an estimate. **Maximum likelihood estimation** (MLE) picks the value that makes the observed data most plausible, so the answer is $7/10$. But after three heads in three tosses it overconfidently says “always heads from now on”. **Bayesian inference** does not fix the unknown to one value; it keeps a distribution of belief. Multiplying the belief before the data (the prior) by the evidence of the data (the likelihood) gives the belief after the data (the posterior).

Picking only the highest point of the posterior is the **MAP** estimate. Taking logarithms, it minimizes “how badly the data fit + how far we stray from the prior belief”, which is exactly **loss + regularization** in machine learning. With the prior $\operatorname{Beta}(2,2)$ (“the coin is probably fair”) the answer moves from $0.7$ to about $0.667$, pulled toward $0.5$, and a Gaussian prior becomes the $L_2$ (ridge) penalty. When the uncertainty itself matters, as in choosing between sellers with few reviews, we compare whole posteriors.

The last section shows in the simplest case why regularization helps. The MAP of a Gaussian mean pulls the sample mean slightly toward 0 (**shrinkage**): on average it misses a little (bias) but wobbles less (variance). Since the total error is $\mathrm{MSE}=\text{bias}^2+\text{variance}$, the error actually goes down when the true value is not too far from 0. This trade leads to ridge and lasso in Unit 4.`,
    nodes: [
      { id: 'axioms', role: 'def', k: '2.1', t: R`확률의 세 공리`, en: R`The three axioms`,
        d: R`확률을 ‘넓이’처럼 다루는 세 규칙입니다. 여사건·포함배제·연속성 같은 성질은 모두 사건을 서로소 조각으로 쪼개 공리 3을 쓰면 나옵니다.`,
        dEn: R`Three rules that treat probability like an area. Every other property (complements, inclusion–exclusion, continuity) follows by splitting events into disjoint pieces and applying axiom 3.` },
      { id: 'bayes', role: 'tool', k: '2.2', t: R`베이즈 정리`, en: R`Bayes’ theorem`,
        d: R`조건부 확률과 전확률 법칙으로 조건의 방향을 뒤집습니다(감기면 기침 → 기침하면 감기). ‘사후 = 가능도 × 사전 ÷ 증거’라는 틀이 2.5절에서 다시 쓰입니다.`,
        dEn: R`Conditional probability and the law of total probability turn a condition around (cold → cough becomes cough → cold). The pattern “posterior = likelihood × prior ÷ evidence” returns in §2.5.` },
      { id: 'rv', role: 'tool', k: '2.3', t: R`확률변수·평균·분산`, en: R`Random variables, mean, variance`,
        d: R`결과에 숫자를 붙이면 분포·평균·분산을 다룰 수 있습니다. 표본평균의 분산 $\Var(\bar X)=\sigma^2/n$ 같은 성질이 뒤(2.8절)의 계산 재료입니다.`,
        dEn: R`Attaching numbers to outcomes lets us speak of distributions, means and variances. Properties such as $\Var(\bar X)=\sigma^2/n$ are the raw material for later computations (§2.8).` },
      { id: 'mle', role: 'def', k: '2.4', t: R`가능도와 MLE`, en: R`Likelihood and the MLE`,
        d: R`$p(x\mid\theta)$를 $\theta$의 함수로 보고, 관측 자료를 가장 그럴듯하게 만드는 $\theta$를 고릅니다(베르누이면 $S/n$). 자료가 적으면 과신하는 약점이 있습니다.`,
        dEn: R`Read $p(x\mid\theta)$ as a function of $\theta$ and pick the $\theta$ that makes the observed data most plausible ($S/n$ for Bernoulli data). With little data it is overconfident.` },
      { id: 'post', role: 'alt', k: '2.5', t: R`사전분포 → 사후분포`, en: R`From prior to posterior`,
        d: R`$\theta$도 확률변수로 보고 사후분포 $\propto$ 가능도 $\times$ 사전분포로 믿음을 고칩니다. 베르누이 자료에 베타 사전분포를 쓰면 사후분포도 베타입니다(켤레).`,
        dEn: R`Treat $\theta$ as a random variable too and update the belief by posterior $\propto$ likelihood $\times$ prior. With Bernoulli data and a beta prior, the posterior is again a beta (conjugacy).` },
      { id: 'virt', role: 'idea', k: '2.5', at: '### 사전분포 = 미리 본', t: R`사전분포 = 가상의 자료`, en: R`A prior is imaginary data`,
        d: R`$\operatorname{Beta}(a,b)$의 $a-1$, $b-1$은 미리 본 성공·실패 횟수처럼 행동합니다. 사후평균은 사전평균과 MLE의 가중평균이고, 자료가 많을수록 MLE에 가까워집니다.`,
        dEn: R`In $\operatorname{Beta}(a,b)$, $a-1$ and $b-1$ act like successes and failures seen in advance. The posterior mean is a weighted average of the prior mean and the MLE, and approaches the MLE as data grow.` },
      { id: 'map', role: 'res', k: '2.6', t: R`MAP = 손실 + 규제`, en: R`MAP = loss + regularizer`,
        d: R`사후분포의 꼭대기 하나를 고르면 $-\log p(x\mid\theta)-\log p(\theta)$의 최소화가 됩니다. 가우시안 사전분포는 $L_2$(릿지), 라플라스 사전분포는 $L_1$(라쏘) 규제입니다.`,
        dEn: R`Picking the single peak of the posterior means minimizing $-\log p(x\mid\theta)-\log p(\theta)$. A Gaussian prior becomes the $L_2$ (ridge) penalty, a Laplace prior the $L_1$ (lasso) penalty.` },
      { id: 'sellers', role: 'ex', k: '2.7', t: R`어느 판매자에게 살까`, en: R`Which seller to buy from`,
        d: R`MLE는 리뷰 2/0인 판매자를 고르지만, 두 사후분포 전체를 비교하면 $P(\theta_1>\theta_2)\approx0.71$로 90/10인 판매자가 낫습니다. 불확실성까지 비교한 결과입니다.`,
        dEn: R`The MLE picks the seller with 2 good reviews out of 2, but comparing the two whole posteriors gives $P(\theta_1>\theta_2)\approx0.71$ for the seller with 90 good and 10 bad. The uncertainty is compared too.` },
      { id: 'shrink', role: 'step', k: '2.8', t: R`가우시안 MAP = 수축`, en: R`Gaussian MAP = shrinkage`,
        d: R`$X_i\sim\N(\theta,1)$, 사전분포 $\N(0,\tau^2)$이면 MAP은 릿지 문제가 되고 해는 $a\bar X$, $a=n\tau^2/(n\tau^2+1)<1$입니다. 표본평균을 0 쪽으로 끌어당깁니다.`,
        dEn: R`With $X_i\sim\N(\theta,1)$ and the prior $\N(0,\tau^2)$, the MAP is a ridge problem whose solution is $a\bar X$ with $a=n\tau^2/(n\tau^2+1)<1$: the sample mean is pulled toward 0.` },
      { id: 'bv', role: 'res', k: '2.8', at: '### (2) 편향-분산 분해', t: R`편향-분산: 수축의 득실`, en: R`Bias–variance: what shrinkage buys`,
        d: R`$\mathrm{MSE}=\text{편향}^2+\text{분산}$. 수축은 편향을 만들지만 분산을 줄여, $\theta^2<2\tau^2+1/n$이면 MLE보다 MSE가 작습니다. 규제가 도움이 되는 가장 단순한 모형입니다.`,
        dEn: R`$\mathrm{MSE}=\text{bias}^2+\text{variance}$. Shrinkage adds bias but cuts variance, so when $\theta^2<2\tau^2+1/n$ its MSE beats the MLE. It is the simplest model of why regularization helps.` },
    ],
    rows: [['axioms', 'rv'], ['bayes', 'mle'], ['post'], ['virt', 'map'], ['sellers', 'shrink'], [null, 'bv']],
    edges: [
      ['axioms', 'bayes', R`조건이 주어지면`, R`given a condition`],
      ['rv', 'mle', R`$\theta$의 함수로`, R`as a function of $\theta$`],
      ['bayes', 'post', R`$\theta$에 적용`, R`apply it to $\theta$`],
      ['mle', 'post', R`가능도 × 사전`, R`likelihood × prior`],
      ['post', 'virt', R`가상의 자료로 보면`, R`read as imaginary data`],
      ['post', 'map', R`꼭대기 하나만`, R`keep only the peak`],
      ['map', 'sellers', R`분포 전체로`, R`the whole posterior`],
      ['map', 'shrink', R`가우시안이면`, R`the Gaussian case`],
      ['shrink', 'bv', R`MLE보다 나은가?`, R`better than the MLE?`],
    ],
  });
})();
