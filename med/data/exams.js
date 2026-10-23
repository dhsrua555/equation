/* 실전 모의고사 — 연습문제와 겹치지 않는 별도 문항. 서술형에는 채점 기준을 붙였습니다. 2026-10-23 풀이를 단계별로 다시 쓰고 객관식 정답 위치를 섞었습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '교재 1·2장 범위', title: '곡선 적합, 확률, 정보이론, 베이지안', scopeText: '01–06 단원',
    desc: '의료 데이터, 다항식 적합과 규제, 베이즈 정리와 선별검사, 가우시안 MLE와 편향, 밀도 변환, 엔트로피와 KL, MAP. 계산과 증명을 함께 봅니다.',
    minutes: 80, plot: 'roc',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 4, q: R`Which of the following is a **one-dimensional signal** recorded over time?`,
        choices: [R`CT image`, R`Electronic medical record (EMR)`, R`MRI image`, R`Electrocardiogram (ECG)`], ans: 3,
        sol: R`
**핵심.** 의료 데이터는 모양(차원)으로 나뉩니다. 생체전기 신호는 시간에 따른 1차원 시계열 $\mathbb R^{T}$, 의료영상은 2D·3D 격자 $\mathbb R^{H\times W}$, $\mathbb R^{D\times H\times W}$, 기록은 표와 텍스트입니다.

1. CT와 MRI는 단면 영상(2D)이거나 단면을 쌓은 부피(3D)이고, 시간을 더하면 4D 자료가 됩니다.
2. 전자의무기록(EMR)은 병력·소견·투약·검사 결과를 담은 병원 안의 환자 기록이라 표와 텍스트입니다.
3. 심전도(ECG)는 심장의 전기 활동을 시간 축 하나 위에서 잰 생체전기 신호입니다. 뇌파(EEG), 근전도(EMG)도 같은 종류입니다.

**답.** ④ 심전도(ECG)

**보기 검토.** ① CT 영상 — 2D 단면 또는 3D 부피 영상입니다. ② 전자의무기록(EMR) — 시간 신호가 아니라 표·텍스트 기록입니다. ③ MRI 영상 — CT처럼 2D/3D 격자 자료입니다. ④ 정답 — 시간에 따른 1차원 신호 $\mathbb R^{T}$입니다.

**자주 하는 실수.** 4D 영상(3D+시간)에도 시간이 들어 있어 헷갈리기 쉽지만, 한 시점의 값이 3차원 부피이므로 1차원 신호가 아닙니다. 자료의 차원이 1D 시계열 모델, 2D/3D 격자 모델, 표·텍스트 모델 중 무엇을 쓸지를 정합니다.

관련: [[ch01:0.1|의료 데이터의 모양]]` },
      { ch: 'ch02', type: 'mc', lv: 1, pts: 5, q: R`A polynomial of order $M=9$ is fitted to $N=10$ data points by minimizing the sum-of-squares error. Which statement is correct? (The $x_n$ are distinct.)`,
        choices: [R`The training error can be zero, but the test error is likely to be large (over-fitting)`, R`Both the training error and the test error are zero`, R`All the coefficients become small`, R`Decreasing $M$ reduces the training error`], ans: 0,
        sol: R`
**핵심.** $M$차 다항식 $y(x,\mathbf w)=\sum_{j=0}^Mw_jx^j$의 계수는 $M+1$개입니다. 계수 수가 자료 수와 같으면 모든 점을 정확히 지날 수 있지만, 그것은 규칙이 아니라 잡음까지 외운 결과입니다.

1. $M=9$이면 계수가 $M+1=10$개이고 자료도 $N=10$개입니다. $x_n$이 서로 다르면 계획행렬 $\Phi_{nj}=x_n^j$가 $10\times10$ 가역 행렬이라 $\Phi\mathbf w=\mathbf t$의 해가 있고, 제곱오차합 $E(\mathbf w)=\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2$이 정확히 0이 됩니다.
2. 이 곡선은 훈련점 사이에서 크게 출렁입니다. 교재 표 1.1의 $M=9$ 계수는 $w_6^\star\approx370{,}626$, $w_7^\star\approx-372{,}051$처럼 거대한 양수와 음수가 서로 상쇄합니다.
3. 그래서 새 자료에서 잰 $E_{\text{RMS}}$(시험 오차)는 크게 나빠집니다. 이것이 과적합입니다.

**답.** ① 훈련 오차는 0이 될 수 있지만 시험 오차는 커지기 쉽다(과적합)

**보기 검토.** ① 정답 — 훈련 오차 0, 시험 오차 큼. ② 시험 자료는 학습에 쓰이지 않았으므로 오차가 0이 될 이유가 없습니다. ③ 반대입니다. 규제가 없으면 계수가 매우 커집니다. ④ 차수를 줄이면 모델이 덜 유연해져 훈련 오차는 같거나 커집니다($M$이 클수록 훈련 오차가 줄어듭니다).

관련: [[ch02:1.2b|모델 복잡도와 과적합]]` },
      { ch: 'ch02', type: 'num', lv: 1, pts: 6, q: R`The residuals $y(x_n,\mathbf w^\star)-t_n$ of a model on four test points are $1,-1,2,0$. Find $E_{\text{RMS}}$. (4 decimal places)`, ans: 'sqrt(1.5)', ansTex: R`\sqrt{1.5}\approx1.2247`,
        sol: R`
**핵심.** RMS 오차는 제곱오차의 평균에 제곱근을 씌운 값입니다.
$$E_{\text{RMS}}=\sqrt{\frac1N\sum_{n=1}^N\{y(x_n,\mathbf w^\star)-t_n\}^2}$$

1. 잔차를 제곱합니다: $1^2,\ (-1)^2,\ 2^2,\ 0^2=1,\ 1,\ 4,\ 0$.
2. 합은 $6$이고 자료 수 $N=4$로 나누면 평균제곱오차는 $6/4=1.5$입니다.
3. 제곱근을 씌우면 $E_{\text{RMS}}=\sqrt{1.5}\approx1.2247$.

**답.** $\sqrt{1.5}\approx1.2247$

**자주 하는 실수.** 제곱오차합 $E=\frac12\sum\{\cdot\}^2=3$을 답으로 쓰거나, 제곱근을 빼먹고 $1.5$를 쓰는 경우가 많습니다. $N$으로 나누는 것은 크기가 다른 자료를 같은 기준으로 비교하려는 것이고, 제곱근은 단위를 목표값 $t$와 같게 하려는 것입니다. 잔차를 그대로 평균하면 $(1-1+2+0)/4=0.5$가 되어 부호가 상쇄되므로 오차의 척도가 아닙니다.

**검산.** $E_{\text{RMS}}$는 잔차 크기의 평균 $(1+1+2+0)/4=1$보다 크거나 같고(제곱평균 ≥ 산술평균) 가장 큰 잔차 크기 $2$보다 작아야 합니다. $1\le1.2247\le2$로 맞습니다.

관련: [[ch02:1.2b|RMS 오차]]` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 8, q: R`A test with sensitivity 0.8 and specificity 0.9 is used for a disease with prevalence 5%. Given a positive result, what is the probability that the patient has the disease? (4 decimal places)`, ans: '0.04/0.135', ansTex: R`\tfrac{0.04}{0.135}\approx0.2963`,
        sol: R`
**핵심.** 양성 예측도는 베이즈 정리로 조건의 방향을 뒤집어 구합니다. 유병률 $\pi$, 민감도 $s$, 특이도 $c$이면
$$p(D=1\mid T=1)=\frac{s\pi}{s\pi+(1-c)(1-\pi)}$$

1. 주어진 값: 유병률 $p(D=1)=0.05$, 민감도 $p(T=1\mid D=1)=0.8$, 특이도 $p(T=0\mid D=0)=0.9$이므로 위양성률은 $p(T=1\mid D=0)=1-0.9=0.1$입니다.
2. 참양성의 결합확률(곱의 규칙): $p(T=1,D=1)=0.8\times0.05=0.04$.
3. 위양성의 결합확률: $p(T=1,D=0)=0.1\times0.95=0.095$.
4. 증거(합의 규칙): $p(T=1)=0.04+0.095=0.135$.
5. 베이즈 정리: $p(D=1\mid T=1)=0.04/0.135\approx0.2963$.

**답.** $\tfrac{0.04}{0.135}\approx0.2963$

**자주 하는 실수.** “민감도가 0.8이니 양성이면 80%”라고 답하는 것은 $p(T\mid D)$와 $p(D\mid T)$를 혼동한 기저율 무시입니다. 위양성률 자리에 특이도 $0.9$를 그대로 넣으면 $0.04/(0.04+0.855)\approx0.0447$이 됩니다.

**검산.** 1000명으로 생각하면 환자 50명 중 40명, 건강한 950명 중 95명이 양성입니다. 양성 135명 가운데 환자는 40명이므로 $40/135\approx0.2963$. 건강한 사람이 19배 많아서 위양성(95명)이 참양성(40명)보다 많습니다.

관련: [[ch03:2.1b|베이즈 정리와 의료 선별검사]]` },
      { ch: 'ch03', type: 'num', lv: 3, pts: 6, q: R`The same patient takes the same test once more; given the disease status, the second test is independent of the first. The result is again positive. What is the probability that the patient has the disease? (4 decimal places)`, ans: '0.032/0.0415', ansTex: R`\tfrac{0.032}{0.0415}\approx0.7711`,
        sol: R`
**핵심.** 질환 여부 $D$가 주어지면 두 검사 결과가 독립(조건부 독립)이므로 가능도가 곱해집니다: $p(T_1=1,T_2=1\mid D)=p(T=1\mid D)^2$. 첫 검사의 사후확률을 다음 검사의 사전확률로 써도 같은 답이 나옵니다.

1. 두 번 다 양성일 가능도: 질환이면 $0.8^2=0.64$, 질환이 아니면 $0.1^2=0.01$.
2. 결합확률: $p(D=1,T_1=1,T_2=1)=0.05\times0.64=0.032$, $p(D=0,T_1=1,T_2=1)=0.95\times0.01=0.0095$.
3. 증거(합의 규칙): $0.032+0.0095=0.0415$.
4. 베이즈 정리: $p(D=1\mid T_1=1,T_2=1)=0.032/0.0415\approx0.7711$.

**답.** $\tfrac{0.032}{0.0415}\approx0.7711$

**검산.** 순차 갱신: 앞 문제의 사후확률 $0.2963$을 새 사전확률로 두면 $\frac{0.8\times0.2963}{0.8\times0.2963+0.1\times0.7037}=\frac{0.2370}{0.2370+0.07037}\approx0.7711$로 같습니다. 첫 검사의 증거 $0.135$가 분자와 분모에서 약분되기 때문입니다.

**자주 하는 실수.** 두 결과를 조건 없이 독립으로 보고 사후확률끼리 곱해 $0.2963^2\approx0.0878$을 쓰는 것은 틀립니다. 독립은 $D$가 주어졌을 때의 가정이므로 곱하는 것은 가능도 $p(T\mid D)$입니다. 두 번 양성이면 확률이 줄어들 리 없다는 점으로도 걸러낼 수 있습니다.

관련: [[ch03:2.1b|베이즈 정리와 의료 선별검사]], [[ch03:2.1|곱의 규칙]]` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 7, q: R`The variance of a Gaussian is estimated from the data $2,4,4,4,5,5,7,9$. Find the **unbiased** estimate $\tilde\sigma^2$. (4 decimal places)`, ans: '32/7', ansTex: R`\tfrac{32}{7}\approx4.5714`,
        sol: R`
**핵심.** 가우시안의 최대가능도 분산 $\sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\mu_{\text{ML}})^2$은 기댓값이 $\frac{N-1}N\sigma^2$로 작게 치우치므로, $\frac N{N-1}$을 곱한 $\tilde\sigma^2=\frac1{N-1}\sum_n(x_n-\mu_{\text{ML}})^2$이 불편 추정량입니다.

1. 표본평균: $\mu_{\text{ML}}=(2+4+4+4+5+5+7+9)/8=40/8=5$.
2. 편차는 $-3,-1,-1,-1,0,0,2,4$이고 제곱은 $9,1,1,1,0,0,4,16$, 합은 $32$입니다.
3. 최대가능도 분산: $\sigma^2_{\text{ML}}=32/8=4$.
4. 불편 추정: $\tilde\sigma^2=\frac N{N-1}\sigma^2_{\text{ML}}=\frac87\times4=\frac{32}7\approx4.5714$.

**답.** $\tfrac{32}7\approx4.5714$

**자주 하는 실수.** $N=8$로 나눈 $4$는 최대가능도 추정값(아래로 편향됨)입니다. 표준편차 $\sqrt{32/7}\approx2.138$을 답으로 쓰는 실수도 흔합니다.

**검산.** $\sum_nx_n^2-N\bar x^2=(4+16\times3+25\times2+49+81)-8\times25=232-200=32$로 편차 제곱합이 같습니다.

관련: [[ch04:2.3b|최대가능도의 편향과 보정]]` },
      { ch: 'ch04', type: 'mc', lv: 1, pts: 5, q: R`For $N$ i.i.d. samples from a Gaussian, what is $\E[\sigma^2_{\text{ML}}]$?`,
        choices: [R`$\sigma^2$`, R`$\frac N{N-1}\sigma^2$`, R`$\frac{N-1}N\sigma^2$`, R`$\frac{\sigma^2}N$`], ans: 2,
        sol: R`
**핵심.** $\sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\mu_{\text{ML}})^2$은 참 평균 $\mu$가 아니라 자료에 맞춘 평균 $\mu_{\text{ML}}=\bar x$를 기준으로 퍼짐을 잽니다.

1. $\sum_n(x_n-c)^2$은 $c=\bar x$에서 최소이므로, $\bar x$ 기준 편차 제곱합은 참 평균 기준보다 항상 작거나 같습니다. 그래서 아래로 치우칩니다.
2. 정량적으로 $\sum_n(x_n-\bar x)^2=\sum_nx_n^2-N\bar x^2$이고 $\E[x_n^2]=\mu^2+\sigma^2$, $\E[\bar x^2]=\mu^2+\sigma^2/N$이므로 기댓값은 $N(\mu^2+\sigma^2)-N(\mu^2+\sigma^2/N)=(N-1)\sigma^2$입니다.
3. $N$으로 나누면 $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$.

**답.** ③ $\frac{N-1}N\sigma^2$

**보기 검토.** ① $\sigma^2$ — 참 평균 $\mu$를 알 때 쓰는 $\frac1N\sum(x_n-\mu)^2$의 기댓값입니다. ② $\frac N{N-1}\sigma^2$ — 보정 인수를 거꾸로 쓴 것입니다(불편 추정량을 만들 때 $\sigma^2_{\text{ML}}$에 곱하는 인수). ③ 정답. ④ $\frac{\sigma^2}N$ — 표본평균의 분산 $\Var[\bar x]$입니다.

관련: [[ch04:2.3b|최대가능도의 편향과 보정]]` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 7, q: R`Let $x\sim U(0,1)$ and $y=x^2$. Find the density $p_y(0.04)$ at $y=0.04$.`, ans: '2.5', ansTex: R`\tfrac1{2\sqrt{0.04}}=2.5`,
        sol: R`
**핵심.** 확률밀도는 대입만으로 바뀌지 않고, 대응하는 구간의 확률이 같도록 야코비안을 곱합니다.
$$p_y(y)=p_x(g(y))\,\lvert g'(y)\rvert,\qquad x=g(y)$$

1. 역변환: $x\in(0,1)$에서 $y=x^2$은 단조증가이므로 $x=g(y)=\sqrt y$ ($0\lt y\lt1$).
2. 야코비안: $g'(y)=\frac1{2\sqrt y}$.
3. $x\sim U(0,1)$이라 $p_x=1$이므로 $p_y(y)=1\cdot\frac1{2\sqrt y}=\frac1{2\sqrt y}$.
4. $y=0.04$이면 $\sqrt y=0.2$이고 $p_y(0.04)=\frac1{2\times0.2}=2.5$.

**답.** $2.5$

**검산.** 정규화: $\int_0^1\frac1{2\sqrt y}\,dy=\big[\sqrt y\big]_0^1=1$. 누적분포로도 $P(y\le u)=P(x\le\sqrt u)=\sqrt u$를 $u$로 미분하면 $\frac1{2\sqrt u}$로 같습니다.

**자주 하는 실수.** 대입만 하면 $p_x(\sqrt{0.04})=1$, 야코비안 대신 $dy/dx=2x=0.4$를 곱하면 $0.4$가 나옵니다. 곱할 것은 $dy/dx$가 아니라 그 역수 $dx/dy$입니다. 밀도가 $y\to0$에서 커지는 것은 $x$의 구간이 $y$의 더 좁은 구간으로 눌리기 때문입니다($y=0.25$에서는 야코비안이 우연히 1이라 세 방법이 모두 1을 내므로 방법을 가려내지 못합니다).

관련: [[ch05:2.4|확률밀도의 변환]]` },
      { ch: 'ch05', type: 'num', lv: 1, pts: 6, q: R`Find the entropy (in bits) of four states with probabilities $\frac12,\frac14,\frac18,\frac18$.`, ans: '1.75', ansTex: R`1.75`,
        sol: R`
**핵심.** 섀넌 엔트로피는 정보량 $h(x)=-\log_2p(x)$의 평균입니다.
$$\mathrm H[x]=-\sum_xp(x)\log_2p(x)\quad(\text{비트})$$

1. 각 상태의 정보량: $-\log_2\frac12=1$, $-\log_2\frac14=2$, $-\log_2\frac18=3$, $-\log_2\frac18=3$비트.
2. 확률로 가중: $\frac12\cdot1+\frac14\cdot2+\frac18\cdot3+\frac18\cdot3=0.5+0.5+0.375+0.375$.
3. 합: $\mathrm H=1.75$비트.

**답.** $1.75$

**검산.** 상태가 4개이므로 $0\le\mathrm H\le\log_24=2$이고, 균등분포가 아니니 $2$보다 작아야 합니다. 자주 나오는 상태에 짧은 부호 $0,\ 10,\ 110,\ 111$을 주면 평균 부호 길이가 $\frac12\cdot1+\frac14\cdot2+\frac18\cdot3\cdot2=1.75$비트로 엔트로피와 같습니다(확률이 모두 2의 거듭제곱이라 하한에 정확히 닿습니다).

**자주 하는 실수.** 자연로그로 계산하면 $1.75\ln2\approx1.213$내트가 됩니다. 문제는 비트를 묻습니다. 정보량에 확률을 곱하지 않고 $1+2+3+3=9$를 쓰는 실수도 있습니다.

관련: [[ch05:2.5|정보량, 엔트로피]]` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 7, q: R`For $p=(\frac12,\frac12)$ and $q=(\frac14,\frac34)$, find $\KL(p\Vert q)$ (in nats). (4 decimal places)`, ans: '0.5*ln(4/3)', ansTex: R`\tfrac12\ln\tfrac43\approx0.1438`,
        sol: R`
**핵심.** 이산 분포의 KL 발산은 $p$에 대한 기댓값입니다.
$$\KL(p\Vert q)=-\sum_kp_k\ln\frac{q_k}{p_k}=\sum_kp_k\ln\frac{p_k}{q_k}\quad(\text{내트})$$

1. 첫 상태: $p_1\ln\frac{p_1}{q_1}=\frac12\ln\frac{1/2}{1/4}=\frac12\ln2\approx0.3466$.
2. 둘째 상태: $p_2\ln\frac{p_2}{q_2}=\frac12\ln\frac{1/2}{3/4}=\frac12\ln\frac23\approx-0.2027$.
3. 합: $\frac12\big(\ln2+\ln\frac23\big)=\frac12\ln\frac43\approx0.1438$.

**답.** $\tfrac12\ln\tfrac43\approx0.1438$

**자주 하는 실수.** 인수를 바꾼 $\KL(q\Vert p)=\frac14\ln\frac12+\frac34\ln\frac32\approx0.1308$은 다른 값입니다(KL은 대칭이 아님). $\log_2$를 쓰면 $0.2075$비트가 됩니다. 한 항이 음수라고 전체를 음수로 착각하면 안 됩니다.

**검산.** $\KL\ge0$이고 등호는 $p=q$일 때뿐인데, 여기서는 $p\ne q$이므로 양수여야 합니다. $0.1438\gt0$으로 맞습니다.

관련: [[ch05:2.5b|KL 발산]]` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 6, q: R`In a regression problem with noise variance $\sigma^2=0.25$, the prior $w_i\sim\N(0,s^2)$ with $s^2=0.5$ is placed on the weights. Find the L2 regularization coefficient $\lambda$ equivalent to MAP estimation (for the error $\frac12\sum\{\cdot\}^2+\frac\lambda2\mathbf w^T\mathbf w$).`, ans: '0.5', ansTex: R`\lambda=\sigma^2/s^2=0.5`,
        sol: R`
**핵심.** MAP은 음의 로그 사후분포 $-\ln p(\mathbf w\mid\mathcal D)=-\ln p(\mathcal D\mid\mathbf w)-\ln p(\mathbf w)+\text{const}$를 최소화합니다. 가우시안 잡음과 영평균 가우시안 사전분포에서는
$$E(\mathbf w)=\frac1{2\sigma^2}\sum_{n=1}^N\{y(x_n,\mathbf w)-t_n\}^2+\frac1{2s^2}\mathbf w^T\mathbf w$$

1. 가능도 $\prod_n\N(t_n\mid y(x_n,\mathbf w),\sigma^2)$의 음의 로그에서 $\frac1{2\sigma^2}\sum\{\cdot\}^2$, 사전분포 $\prod_i\N(w_i\mid0,s^2)$의 음의 로그에서 $\frac1{2s^2}\sum_iw_i^2$이 나옵니다($\mathbf w$와 무관한 항은 상수).
2. 양수 $\sigma^2$을 곱해도 최소점은 그대로이므로 $\frac12\sum\{\cdot\}^2+\frac{\sigma^2}{2s^2}\mathbf w^T\mathbf w$를 최소화해도 됩니다.
3. 기준식 $\frac12\sum\{\cdot\}^2+\frac\lambda2\mathbf w^T\mathbf w$와 비교하면 $\lambda=\sigma^2/s^2=0.25/0.5=0.5$.

**답.** $\lambda=\sigma^2/s^2=0.5$

**자주 하는 실수.** 비를 뒤집어 $s^2/\sigma^2=2$로 쓰거나, 사전분포 항의 계수 $1/s^2=2$를 그대로 답하는 실수가 흔합니다. 기준식의 자료 항 계수가 $\frac12$(즉 $\sigma^2$을 곱한 뒤의 꼴)라는 것을 먼저 맞춰야 합니다.

**검산.** 사전분포가 좁을수록($s^2$가 작을수록) 가중치를 0 근처에 묶는 믿음이 강하고, 잡음이 클수록($\sigma^2$가 클수록) 자료를 덜 믿으므로 규제가 세져야 합니다. $\lambda=\sigma^2/s^2$은 두 방향 모두 맞습니다.

관련: [[ch06:2.6b|MAP 추정과 규제]]` },
      { ch: 'ch06', type: 'mc', lv: 2, pts: 5, q: R`Which statement about the Bayesian predictive distribution $p(t\mid x,\mathcal D)$ is correct?`,
        choices: [R`It is always equal to $p(t\mid x,\mathbf w_{\text{MAP}})$`, R`It is the average of the predictions of all $\mathbf w$, weighted by their posterior probabilities`, R`It is computed from the prior distribution alone`, R`It becomes broader as the amount of data increases`], ans: 1,
        sol: R`
**핵심.** 완전 베이지안 예측은 모수 하나를 고르지 않고 사후분포 전체로 평균합니다.
$$p(t\mid x,\mathcal D)=\int p(t\mid x,\mathbf w)\,p(\mathbf w\mid\mathcal D)\,d\mathbf w$$

1. 피적분함수의 $p(t\mid x,\mathbf w)$는 모수가 $\mathbf w$일 때의 예측이고 $p(\mathbf w\mid\mathcal D)$는 그 모수의 사후확률이므로, 적분은 모든 $\mathbf w$의 예측을 사후확률로 가중 평균한 것입니다.
2. 사후분포 $p(\mathbf w\mid\mathcal D)\propto p(\mathcal D\mid\mathbf w)p(\mathbf w)$에는 자료와 사전분포가 모두 들어갑니다.
3. 예측분포의 퍼짐에는 관측 잡음과 모수의 불확실성이 함께 반영되고, 자료가 쌓여 사후분포가 좁아지면 모수 불확실성의 몫이 줄어듭니다.

**답.** ② 모든 $\mathbf w$의 예측을 사후확률로 가중 평균한 것이다

**보기 검토.** ① 사후분포가 한 점에 몰릴 때만 플러그인 예측 $p(t\mid x,\mathbf w_{\text{MAP}})$에 가까워질 뿐 항상 같지는 않습니다. MAP은 모수 하나만 고르므로 부분적으로만 베이지안입니다. ② 정답. ③ 사후분포를 쓰므로 자료가 들어갑니다. 사전분포만 쓰면 자료를 보기 전의 예측입니다. ④ 반대입니다. 자료가 많을수록 사후분포가 좁아져 예측분포도 좁아집니다(자료가 적은 곳에서 넓음).

관련: [[ch06:2.6c|완전 베이지안 머신러닝]]` },
      { ch: 'ch04', type: 'open', lv: 2, pts: 12, q: R`Let $x_1,\dots,x_N\sim\N(\mu,\sigma^2)$ i.i.d. Prove that $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2$, and write down the unbiased estimator.`,
        rubric: R`
- $\E[x_nx_m]=\mu^2+I_{nm}\sigma^2$ — 3점
- $\E[\bar x^2]$, $\E[x_n\bar x]$ 계산 — 4점
- $\E[(x_n-\bar x)^2]=\frac{N-1}N\sigma^2$ 정리 — 3점
- 불편 추정량 $\frac1{N-1}\sum(x_n-\bar x)^2$ — 2점`,
        sol: R`
**핵심.** $\sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\bar x)^2$ ($\bar x=\mu_{\text{ML}}=\frac1N\sum_mx_m$)의 기댓값은 $(x_n-\bar x)^2$을 전개해 두 표본의 곱 $x_nx_m$의 기댓값만 알면 구할 수 있습니다.

**1. 곱의 기댓값 (3점).** $n\ne m$이면 i.i.d.라 독립이므로 $\E[x_nx_m]=\E[x_n]\E[x_m]=\mu^2$. $n=m$이면 $\E[x_n^2]=\Var[x_n]+\E[x_n]^2=\sigma^2+\mu^2$. 두 경우를 합치면 ($I_{nm}$은 $n=m$이면 1, 아니면 0)
$$\E[x_nx_m]=\mu^2+I_{nm}\sigma^2$$

**2. 표본평균이 들어간 항 (4점).** 이중합에서 $I_{nm}=1$인 쌍은 대각선의 $N$개뿐이므로
$$\E[\bar x^2]=\frac1{N^2}\sum_{n=1}^N\sum_{m=1}^N\E[x_nx_m]=\frac1{N^2}\big(N^2\mu^2+N\sigma^2\big)=\mu^2+\frac{\sigma^2}N$$
한 표본과 평균의 곱은 $m=n$인 항 하나에만 $\sigma^2$이 붙어
$$\E[x_n\bar x]=\frac1N\sum_{m=1}^N\E[x_nx_m]=\frac1N\big(N\mu^2+\sigma^2\big)=\mu^2+\frac{\sigma^2}N$$

**3. 정리 (3점).** 전개해 대입하면
$$\E[(x_n-\bar x)^2]=\E[x_n^2]-2\E[x_n\bar x]+\E[\bar x^2]=(\mu^2+\sigma^2)-2\Big(\mu^2+\frac{\sigma^2}N\Big)+\mu^2+\frac{\sigma^2}N=\frac{N-1}N\sigma^2$$
$\mu^2$ 항이 모두 상쇄되어 참 평균에 무관합니다. 이 값은 $n$에도 무관하므로 $N$개를 평균해도 같습니다: $\E[\sigma^2_{\text{ML}}]=\frac1N\sum_n\E[(x_n-\bar x)^2]=\frac{N-1}N\sigma^2$.

**4. 불편 추정량 (2점).** 기댓값이 $\frac{N-1}N$배 작으므로 $\frac N{N-1}$을 곱하면 기댓값이 $\sigma^2$이 됩니다.
$$\tilde\sigma^2=\frac N{N-1}\sigma^2_{\text{ML}}=\frac1{N-1}\sum_{n=1}^N(x_n-\bar x)^2,\qquad \E[\tilde\sigma^2]=\sigma^2$$

**검산.** $N=1$이면 $\sigma^2_{\text{ML}}=0$이고 식도 $\frac01\sigma^2=0$을 줍니다. $N\to\infty$이면 편향 인수가 1로 갑니다. 편향의 원인은 $\sum(x_n-c)^2$을 최소로 하는 $c=\bar x$를 기준으로 재기 때문입니다(참 평균 $\mu$를 알면 $\frac1N\sum(x_n-\mu)^2$은 불편).

관련: [[ch04:2.3b|최대가능도의 편향과 보정]], [[ch04:2.2b|기댓값, 분산, 공분산]]` },
      { ch: 'ch05', type: 'open', lv: 3, pts: 16, q: R`(1) Using Jensen's inequality, prove that $\KL(p\Vert q)\ge0$, together with the condition for equality. (2) When a model $q(\mathbf x\mid\boldsymbol\theta)$ is fitted to data $\mathbf x_n\sim p$, explain why minimizing the KL divergence is equivalent to maximum likelihood.`,
        rubric: R`
- (1) $-\ln$의 볼록성과 옌센 적용 — 5점
- (1) $\int q=1$로 $\ge0$ 결론 — 2점
- (1) 등호: 순볼록 ⇒ $q/p$ 상수 ⇒ $q=p$ — 3점
- (2) $\KL=\E_p[-\ln q]-\mathrm H[p]$, 둘째 항은 $\boldsymbol\theta$와 무관 — 3점
- (2) 기댓값을 표본평균으로 근사 ⇒ 음의 로그가능도 — 3점`,
        sol: R`
**핵심.** (1) $f(u)=-\ln u$는 볼록이라 옌센 부등식 $f(\E[u])\le\E[f(u)]$를 쓸 수 있습니다. (2) KL을 두 항으로 나누면 첫 항만 $\boldsymbol\theta$에 의존하고, 그 기댓값을 표본평균으로 바꾸면 음의 로그가능도가 됩니다.

(1) **옌센 적용 (5점).** $f(u)=-\ln u$는 $f''(u)=1/u^2\gt0$이라 순볼록입니다. 확률변수 $u(\mathbf x)=q(\mathbf x)/p(\mathbf x)$를 $p$에 대해 평균하면 옌센 부등식 $\E_p[f(u)]\ge f(\E_p[u])$에서 ($p\gt0$인 곳에서 적분)
$$\KL(p\Vert q)=\int p(\mathbf x)\Big\{-\ln\frac{q(\mathbf x)}{p(\mathbf x)}\Big\}d\mathbf x\ \ge\ -\ln\int p(\mathbf x)\frac{q(\mathbf x)}{p(\mathbf x)}\,d\mathbf x$$

**결론 (2점).** 우변의 적분은 $\int_{p\gt0}q(\mathbf x)\,d\mathbf x\le\int q(\mathbf x)\,d\mathbf x=1$이고 $-\ln$은 감소함수이므로 $-\ln\int_{p\gt0}q\ge-\ln1=0$. 따라서 $\KL(p\Vert q)\ge0$입니다.

**등호 조건 (3점).** 순볼록 함수에서 옌센의 등호는 $u$가 ($p$에 대해 거의 어디서나) 상수일 때만 성립합니다: $q(\mathbf x)/p(\mathbf x)=c$. 둘째 부등식의 등호에는 $q$의 질량이 모두 $p\gt0$ 위에 있어야 하므로 $1=\int q=c\int p=c$, 즉 $q=p$입니다. 거꾸로 $q=p$이면 $\ln1=0$이라 $\KL=0$이므로, 등호는 정확히 $p=q$일 때 성립합니다.

(2) **분해 (3점).**
$$\KL(p\Vert q)=-\int p(\mathbf x)\ln q(\mathbf x\mid\boldsymbol\theta)\,d\mathbf x-\Big(-\int p(\mathbf x)\ln p(\mathbf x)\,d\mathbf x\Big)=\E_p[-\ln q(\mathbf x\mid\boldsymbol\theta)]-\mathrm H[p]$$
둘째 항(참 분포의 엔트로피)은 자료 분포만의 성질이라 $\boldsymbol\theta$와 무관하고, 최소화하는 $\boldsymbol\theta$에 영향을 주지 않습니다.

**표본평균 근사 (3점).** $p$는 모르지만 표본 $\mathbf x_n\sim p$가 있으므로 기댓값을 표본평균 $\E_p[f]\simeq\frac1N\sum_nf(\mathbf x_n)$으로 근사합니다.
$$\E_p[-\ln q(\mathbf x\mid\boldsymbol\theta)]\simeq-\frac1N\sum_{n=1}^N\ln q(\mathbf x_n\mid\boldsymbol\theta)$$
이것은 음의 로그가능도를 $N$으로 나눈 것입니다. 따라서 $\boldsymbol\theta$에 대해 KL을 최소화하는 것은 로그가능도 $\sum_n\ln q(\mathbf x_n\mid\boldsymbol\theta)$를 최대화하는 것, 즉 최대가능도와 같습니다.

**검산.** 이산형 예 $p=(\frac12,\frac12)$, $q=(\frac14,\frac34)$에서 $\KL=\frac12\ln\frac43\approx0.1438\gt0$으로 (1)과 맞고, $q=p$로 두면 각 항이 $\ln1=0$이 되어 등호가 성립합니다.

관련: [[ch05:2.5b|KL 발산]]` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '교재 7·8·9장 범위', title: '경사하강법, 정규화, 역전파, 규제', scopeText: '08–12 단원',
    desc: '모멘텀과 Adam, 초기화, 배치·층 정규화, 역전파 손계산과 야코비안, 가중치 감쇠·라쏘·조기 종료, 앙상블과 드롭아웃.',
    minutes: 80, plot: 'momentum',
    problems: [
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`With momentum $\mu=0.95$, in a region where the gradient is nearly constant, the effective learning rate is what multiple of $\eta$?`, ans: '20', ansTex: R`20`,
        sol: R`
**핵심.** 모멘텀 갱신 $\Delta\mathbf w^{(\tau-1)}=-\eta\nabla E+\mu\Delta\mathbf w^{(\tau-2)}$에서 기울기가 거의 일정하면 이전 걸음이 등비급수로 쌓입니다.
$$\Delta\mathbf w=-\eta\nabla E\{1+\mu+\mu^2+\cdots\}=-\frac\eta{1-\mu}\nabla E$$

1. 기울기가 일정한 영역에서는 매 걸음 같은 $-\eta\nabla E$가 더해지고, 앞선 걸음은 $\mu$배씩 줄어든 채 남습니다.
2. $0\le\mu\lt1$이면 등비급수가 수렴합니다: $1+\mu+\mu^2+\cdots=\frac1{1-\mu}$.
3. $\mu=0.95$이면 $\frac1{1-0.95}=\frac1{0.05}=20$.

**답.** $20$

**자주 하는 실수.** 두 걸음만 더한 $1+\mu=1.95$배나 $\frac1\mu\approx1.053$배로 답하는 경우가 있습니다. 정상 상태의 걸음이 $\Delta w=-\eta g+\mu\Delta w$를 만족한다고 두면 $\Delta w=-\frac\eta{1-\mu}g$가 바로 나옵니다.

**검산.** $\mu=0.9$이면 10배(교재 값), $\mu=0$이면 1배(보통 경사하강법)이고 $\mu\to1$이면 한없이 커집니다. 곡률이 큰 영역에서는 연속된 기여의 부호가 바뀌며 상쇄되어 유효 학습률이 $\eta$에 가깝습니다.

관련: [[ch08:7.3b|모멘텀]]` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 7, q: R`In the first step of Adam ($\beta_1=0.9$, $\beta_2=0.99$, $\delta\approx0$, $\eta=0.001$), the gradient is $g=0.2$. Find the weight change $\Delta w$ after bias correction. ($s^{(0)}=r^{(0)}=0$)`, ans: '-0.001', ansTex: R`-0.001`,
        sol: R`
**핵심.** Adam은 1차 모멘트 $s$와 2차 모멘트 $r$을 0에서 시작하는 지수가중 이동평균으로 두고, 초기의 0 쪽 편향을 $1/(1-\beta^\tau)$로 보정합니다.
$$\hat s^{(\tau)}=\frac{s^{(\tau)}}{1-\beta_1^\tau},\qquad \hat r^{(\tau)}=\frac{r^{(\tau)}}{1-\beta_2^\tau},\qquad \Delta w=-\eta\frac{\hat s^{(\tau)}}{\sqrt{\hat r^{(\tau)}}+\delta}$$

1. 1차 모멘트: $s^{(1)}=\beta_1\cdot0+(1-\beta_1)g=0.1\times0.2=0.02$.
2. 2차 모멘트: $r^{(1)}=\beta_2\cdot0+(1-\beta_2)g^2=0.01\times0.04=0.0004$.
3. 편향 보정($\tau=1$): $\hat s^{(1)}=\frac{0.02}{1-0.9}=0.2$, $\hat r^{(1)}=\frac{0.0004}{1-0.99}=0.04$.
4. 갱신: $\Delta w=-0.001\times\frac{0.2}{\sqrt{0.04}}=-0.001\times\frac{0.2}{0.2}=-0.001$.

**답.** $\Delta w=-0.001$

**자주 하는 실수.** 보통 SGD처럼 기울기를 곱해 $-\eta g=-0.0002$로 답하거나, 부호를 빼먹어 $+0.001$로 쓰는 실수가 흔합니다. 기울기가 양수이면 가중치는 줄어야 합니다.

**검산.** 첫 걸음에서는 $\hat s^{(1)}=g$, $\hat r^{(1)}=g^2$이므로 $\Delta w=-\eta\operatorname{sign}(g)$, 즉 기울기 크기와 무관하게 $\eta$만큼 움직입니다. 보정을 빼도 여기서는 $\frac{0.1}{\sqrt{0.01}}=1$이라 같은 값이 나오지만, 이것은 $(1-\beta_1)^2=1-\beta_2$인 우연이고 $\beta_2=0.999$이면 보정 없는 걸음이 $0.1/\sqrt{0.001}\approx3.162$배가 됩니다.

관련: [[ch08:7.3d|AdaGrad, RMSProp, Adam]]` },
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`Find the standard deviation of He initialization for a ReLU layer with 512 input units.`, ans: '0.0625', ansTex: R`\sqrt{2/512}=\tfrac1{16}`,
        sol: R`
**핵심.** He 초기화는 ReLU가 사전활성의 음수 절반을 0으로 만들어 분산이 절반으로 줄어드는 것을 보정해, 가중치 분산을 $2/n_{\text{in}}$으로 둡니다(Xavier는 $2/(n_{\text{in}}+n_{\text{out}})$, 시그모이드·tanh용).

1. 입력 유닛 $n_{\text{in}}=512$이므로 가우시안 $\N(0,\epsilon^2)$의 분산은 $\epsilon^2=\frac2{512}=\frac1{256}\approx0.003906$.
2. 표준편차는 그 제곱근: $\epsilon=\sqrt{1/256}=\frac1{16}=0.0625$.

**답.** $\sqrt{2/512}=\tfrac1{16}=0.0625$

**자주 하는 실수.** 분산 $1/256\approx0.0039$를 표준편차로 답하거나, Xavier 식에 $n_{\text{out}}=512$를 가정해 $\sqrt{2/1024}\approx0.0442$로 계산하는 실수가 흔합니다. He 초기화의 분산에는 $n_{\text{out}}$이 들어가지 않으므로 출력 유닛 수는 필요 없습니다.

**검산.** 같은 분산을 균등분포 $U[-\epsilon,\epsilon]$로 내려면 그 분산이 $\epsilon^2/3$이므로 $\epsilon=\sqrt3\times0.0625\approx0.1083$입니다. 가중치를 모두 같은 값으로 두지 않고 무작위로 뽑는 것은 같은 입력을 받는 뉴런들이 똑같이 학습되지 않도록 대칭을 깨기 위해서입니다.

관련: [[ch08:7.2b|파라미터 초기화]]` },
      { ch: 'ch08', type: 'mc', lv: 2, pts: 5, q: R`Gradient descent with a fixed learning rate is applied to a quadratic error whose Hessian has largest eigenvalue 4. Which learning rate gives convergence?`,
        choices: [R`$\eta=0.4$`, R`$\eta=0.6$`, R`$\eta=1$`, R`$\eta=2$`], ans: 0,
        sol: R`
**핵심.** 이차 오차에서 헤시안 고유방향 $\mathbf u_i$의 성분은 경사하강법 한 걸음마다 $(1-\eta\lambda_i)$배가 됩니다. 모든 방향이 수렴하려면 $\lvert1-\eta\lambda_i\rvert\lt1$, 즉
$$0\lt\eta\lt\frac2{\lambda_{\max}}$$

1. $\lambda_{\max}=4$이므로 상한은 $2/4=0.5$입니다.
2. 가장 가파른 방향의 배율 $1-4\eta$를 보기마다 계산하면 $\eta=0.4\to-0.6$, $0.6\to-1.4$, $1\to-3$, $2\to-7$.
3. 크기가 1보다 작은 것은 $\eta=0.4$뿐입니다(부호가 바뀌며 진동하지만 크기는 줄어듦).

**답.** ① $\eta=0.4$

**보기 검토.** ① 정답 — 배율 $\lvert-0.6\rvert\lt1$로 진동하며 수렴합니다. ② $\eta=0.6$ — 배율 $-1.4$라 매 걸음 1.4배로 커지며 발산합니다. ③ $\eta=1$ — 배율 $-3$, 발산. ④ $\eta=2$ — 배율 $-7$, 빠르게 발산.

**자주 하는 실수.** 상한을 $1/\lambda_{\max}=0.25$로 기억하면 ①도 안 된다고 판단하게 됩니다. $\eta=1/\lambda_{\max}$은 그 방향을 한 걸음에 끝내는 값이고, 발산 경계는 그 두 배입니다. 수렴 속도는 가장 완만한 방향 $\lambda_{\min}$이 정합니다.

관련: [[ch08:7.3|학습률과 수렴]]` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 7, q: R`The pre-activations in a minibatch ($K=4$) are $2,4,6,8$, with $\gamma=0.5$, $\beta=-1$, $\delta=0$. Find the batch normalization output for $a=8$. (4 decimal places)`, ans: '0.5*3/sqrt(5)-1', ansTex: R`\tfrac{1.5}{\sqrt5}-1\approx-0.3292`,
        sol: R`
**핵심.** 배치 정규화는 미니배치 안에서 유닛별 평균·분산으로 표준화한 뒤 학습 가능한 $\gamma,\beta$로 다시 척도화합니다.
$$\mu=\frac1K\sum_na_n,\quad \sigma^2=\frac1K\sum_n(a_n-\mu)^2,\quad \hat a=\frac{a-\mu}{\sqrt{\sigma^2+\delta}},\quad \tilde a=\gamma\hat a+\beta$$

1. 미니배치 평균: $\mu=\frac{2+4+6+8}4=5$.
2. 분산($\frac1K$ 정의): 편차 $-3,-1,1,3$, 제곱 $9,1,1,9$이므로 $\sigma^2=20/4=5$, $\sigma=\sqrt5\approx2.236$.
3. 표준화: $\hat a=\frac{8-5}{\sqrt5}=\frac3{\sqrt5}\approx1.342$.
4. 척도와 이동: $\tilde a=0.5\times1.342+(-1)=0.6708-1\approx-0.3292$.

**답.** $\tfrac{1.5}{\sqrt5}-1\approx-0.3292$

**자주 하는 실수.** 분산을 $K-1=3$으로 나눠 $20/3$을 쓰면 $\hat a=3/\sqrt{6.667}\approx1.162$, $\tilde a\approx-0.4191$이 됩니다. 배치 정규화는 $\frac1K$로 나눕니다. $\gamma$와 $\beta$를 바꿔 $-1\cdot\hat a+0.5$로 계산하는 실수도 있습니다.

**검산.** 표준화된 네 값 $\hat a=(-1.342,\,-0.447,\,0.447,\,1.342)$는 평균 0, 분산 1이고, $\tilde a$는 평균 $\beta=-1$, 표준편차 $\gamma=0.5$를 가집니다. $a=8$은 평균보다 $1.342$ 표준편차 위이므로 $\tilde a=-1+0.5\times1.342$가 맞습니다.

관련: [[ch09:7.4b|배치 정규화]]` },
      { ch: 'ch09', type: 'mc', lv: 1, pts: 5, q: R`Training must be done with a batch size of 1. Which normalization is appropriate, and why?`,
        choices: [R`Batch normalization — because it keeps moving averages`, R`Input normalization — because it also handles the hidden layers`, R`Layer normalization — because it computes the statistics over the units within a single example`, R`None of them can be used`], ans: 2,
        sol: R`
**핵심.** 정규화 방법은 평균·분산을 어느 축으로 구하는지가 다릅니다. 배치 정규화는 미니배치의 예제들에 걸쳐(유닛마다), 층 정규화는 한 예제 안의 은닉 유닛 $M$개에 걸쳐(예제마다) 구합니다.

1. 배치 크기 $K=1$이면 배치 정규화의 $\mu_i=a_{1i}$, $\sigma_i^2=0$이라 $\hat a_{1i}=(a_{1i}-a_{1i})/\sqrt{0+\delta}=0$이 되어 모든 정보가 사라집니다.
2. 층 정규화는 $\mu_n=\frac1M\sum_ia_{ni}$, $\sigma_n^2=\frac1M\sum_i(a_{ni}-\mu_n)^2$을 한 예제 안에서 계산하므로 $K=1$에서도 정상으로 작동하고, 학습과 추론에 같은 함수를 씁니다.

**답.** ③ 층 정규화 — 한 예제 안의 유닛들로 통계를 구해서

**보기 검토.** ① 이동평균은 추론 때 쓰는 값이고 학습 자체에는 쓰이지 않습니다. 학습 중에는 여전히 미니배치 통계가 필요해 $K=1$에서 퇴화합니다. ② 입력 정규화는 훈련 전에 한 번 입력만 표준화할 뿐 은닉층은 다루지 않습니다. ③ 정답. ④ 층 정규화를 쓸 수 있으므로 틀립니다.

관련: [[ch09:7.4c|층 정규화]]` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 8, q: R`A network with one input, one hidden and one output unit (no biases): $x=1$, $w^{(1)}=1$, $z=\tanh a$, $y=w^{(2)}z$, $w^{(2)}=1$, $E=\frac12(y-t)^2$, $t=0$. Find $\partial E/\partial w^{(1)}$. (4 decimal places)`, ans: '(1-tanh(1)^2)*tanh(1)', ansTex: R`(1-\tanh^21)\tanh1\approx0.3199`,
        sol: R`
**핵심.** tanh 은닉층·선형 출력의 2층망 역전파는 출력 오차 $\delta_k=y-t$, 은닉 오차 $\delta_j=h'(a_j)\,w^{(2)}\delta_k$, 가중치 기울기 $\partial E/\partial w^{(1)}=\delta_jx$이고, $h=\tanh$이면 $h'(a)=1-\tanh^2a=1-z^2$입니다.

1. 순전파: $a=w^{(1)}x=1$, $z=\tanh1\approx0.7616$, $y=w^{(2)}z\approx0.7616$.
2. 출력 오차: $\delta_k=y-t\approx0.7616$.
3. 은닉 오차: $1-z^2\approx1-0.5800=0.4200$이므로 $\delta_j=0.4200\times1\times0.7616\approx0.3199$.
4. 기울기: $\partial E/\partial w^{(1)}=\delta_jx=0.3199\times1\approx0.3199$.

**답.** $(1-\tanh^21)\tanh1\approx0.3199$

**자주 하는 실수.** 활성화 기울기를 빼먹으면 $\delta_kx\approx0.7616$, $h'$ 자리에 $1-z$를 쓰면 $0.2384\times0.7616\approx0.1816$이 됩니다. $\partial E/\partial w^{(2)}=\delta_kz\approx0.5800$과 혼동하지 않도록 어느 가중치를 묻는지 확인하세요.

**검산.** 직접 미분: $E=\frac12\tanh^2(w^{(1)}x)$이므로 $\frac{\partial E}{\partial w^{(1)}}=\tanh(w^{(1)}x)\{1-\tanh^2(w^{(1)}x)\}x\approx0.7616\times0.4200\approx0.3199$로 같습니다.

관련: [[ch10:8.1c|2층 신경망 예제]]` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 6, q: R`The softmax outputs are $\mathbf y=(0.5,0.3,0.2)$. Find $\partial y_1/\partial a_2$.`, ans: '-0.15', ansTex: R`-y_1y_2=-0.15`,
        sol: R`
**핵심.** 소프트맥스 $y_k=\frac{e^{a_k}}{\sum_me^{a_m}}$의 도함수는 크로네커 델타 $\delta_{kl}$로
$$\frac{\partial y_k}{\partial a_l}=\delta_{kl}y_k-y_ky_l$$

1. 유도: $\ln y_k=a_k-\ln\sum_me^{a_m}$을 $a_l$로 미분하면 $\frac1{y_k}\frac{\partial y_k}{\partial a_l}=\delta_{kl}-y_l$, 따라서 $\frac{\partial y_k}{\partial a_l}=y_k(\delta_{kl}-y_l)$.
2. $k=1$, $l=2$는 $k\ne l$이라 $\delta_{12}=0$: $\frac{\partial y_1}{\partial a_2}=-y_1y_2$.
3. 대입: $-0.5\times0.3=-0.15$.

**답.** $-y_1y_2=-0.15$

**자주 하는 실수.** 대각 원소 공식 $y_1(1-y_1)=0.25$를 쓰거나 $y_1(1-y_2)=0.35$처럼 섞는 실수가 있습니다. 다른 로짓 $a_2$가 커지면 분모가 커져 $y_1$은 줄어야 하므로 부호는 음수입니다.

**검산.** 모든 로짓에 같은 상수를 더해도 소프트맥스는 변하지 않으므로 한 행의 합이 0이어야 합니다: $\partial y_1/\partial a_1=0.5-0.25=0.25$, $\partial y_1/\partial a_2=-0.15$, $\partial y_1/\partial a_3=-0.5\times0.2=-0.1$, 합 $0$.

관련: [[ch10:8.1d|야코비안과 헤시안]]` },
      { ch: 'ch10', type: 'mc', lv: 2, pts: 5, q: R`How many passes of automatic differentiation are needed to compute the full Jacobian of a function with $K$ outputs and $D$ inputs?`,
        choices: [R`$K$ in forward mode, $D$ in reverse mode`, R`$D$ in forward mode, $K$ in reverse mode`, R`1 in either mode`, R`$KD$ in either mode`], ans: 1,
        sol: R`
**핵심.** 전진 모드는 입력 하나의 접선 변수 $\dot v_i=\partial v_i/\partial x$를 순전파와 함께 밀고 나가 야코비안의 **한 열**을, 후진 모드는 출력 하나의 수반 변수 $\bar v_i=\partial f/\partial v_i$를 거꾸로 전달해 **한 행**을 얻습니다.

1. 야코비안 $J_{ki}=\partial y_k/\partial x_i$는 $K\times D$ 행렬입니다.
2. 전진 모드 한 패스는 한 입력 $x_i$에 대한 모든 출력의 미분(열 하나)을 주므로 열 $D$개에 $D$번이 필요합니다.
3. 후진 모드 한 패스는 한 출력 $y_k$에 대한 모든 입력의 미분(행 하나)을 주므로 행 $K$개에 $K$번이 필요합니다.

**답.** ② 전진 모드 $D$번, 후진 모드 $K$번

**보기 검토.** ① 두 모드를 뒤바꾼 것입니다. ② 정답. ③ 한 번으로 전체 야코비안을 얻는 것은 $K=1$(후진) 또는 $D=1$(전진)일 때뿐입니다. ④ 원소 하나마다 패스를 쓴다는 뜻인데, 각 모드의 한 패스는 열 하나 또는 행 하나 전체를 한꺼번에 줍니다.

**자주 하는 실수.** 신경망 학습은 출력이 스칼라 오차 하나($K=1$)이고 입력(파라미터)이 수백만 개라 후진 모드 한 번이면 됩니다. 이 사실만 기억하고 “후진 모드는 입력마다 한 번”이라고 거꾸로 외우는 경우가 많습니다.

관련: [[ch10:8.2|자동 미분]]` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 7, q: R`Along one eigendirection of a quadratic error the curvature is $\lambda_j=2$. With weight decay $\lambda=0.5$, the component along that direction becomes what multiple of the minimum $w_j^\star$?`, ans: '0.8', ansTex: R`\tfrac{2}{2.5}=0.8`,
        sol: R`
**핵심.** 이차 오차에 가중치 감쇠 $\frac\lambda2\mathbf w^T\mathbf w$를 더하면 헤시안 고유좌표에서 각 성분이 그 방향의 곡률 $\lambda_j$에 따라
$$\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$$
로 줄어듭니다.

1. 고유좌표에서 오차는 $E_0+\frac12\sum_j\lambda_j(w_j-w_j^\star)^2$이고, 벌점 $\frac\lambda2\sum_jw_j^2$을 더해 $w_j$로 미분하면 $\lambda_j(w_j-w_j^\star)+\lambda w_j=0$.
2. 풀면 $w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$.
3. 대입: $\frac2{2+0.5}=\frac2{2.5}=0.8$.

**답.** $\tfrac2{2.5}=0.8$

**자주 하는 실수.** 줄어든 비율 $\frac\lambda{\lambda_j+\lambda}=0.2$와 남는 비율 $0.8$을 혼동하거나, 매 갱신의 감쇠 배율 $1-\eta\lambda$와 섞는 경우가 있습니다.

**검산.** $\lambda\to0$이면 배율 1(규제 없음), $\lambda\to\infty$이면 0입니다. 이 방향은 곡률 $\lambda_j=2$가 $\lambda=0.5$보다 큰 민감한 방향이라 20%만 줄었습니다. 곡률이 $0.1$인 둔감한 방향이었다면 $0.1/0.6\approx0.1667$배로 크게 줄었을 것입니다.

관련: [[ch11:9.2|가중치 감쇠]]` },
      { ch: 'ch11', type: 'num', lv: 3, pts: 6, q: R`For the one-dimensional error $\frac h2(w-w^\star)^2+\frac\lambda2\lvert w\rvert$ with $h=2$, $w^\star=0.3$, $\lambda=1$, find the minimizer $\hat w$.`, ans: '0.05', ansTex: R`0.05`,
        sol: R`
**핵심.** $L_1$ 벌점(라쏘)의 1차원 해는 소프트 문턱입니다. $E(w)=\frac h2(w-w^\star)^2+\frac\lambda2\lvert w\rvert$에서 $\lvert w^\star\rvert\gt\frac\lambda{2h}$이면 $w^\star$를 0 쪽으로 $\frac\lambda{2h}$만큼 옮기고, 아니면 정확히 0입니다.

1. $w\gt0$이라 가정하면 $\lvert w\rvert=w$이고 $E'(w)=h(w-w^\star)+\frac\lambda2=0$에서 $w=w^\star-\frac\lambda{2h}$.
2. 문턱: $\frac\lambda{2h}=\frac1{2\times2}=0.25$.
3. 후보 $w=0.3-0.25=0.05\gt0$이 가정과 맞으므로 정류점입니다.
4. $w\lt0$에서는 $E'(w)=h(w-w^\star)-\frac\lambda2=2(w-0.3)-0.5\lt0$이 항상 성립해 그 영역에 최소점이 없습니다. $E$는 볼록이므로 $\hat w=0.05$가 유일한 최소점입니다.

**답.** $\hat w=0.05$

**자주 하는 실수.** 벌점 계수 $\frac\lambda2$를 빠뜨려 문턱을 $\frac\lambda h=0.5$로 잡으면 해가 0이라고 잘못 결론 내립니다. 이차 벌점 $\frac\lambda2w^2$의 해 $\frac h{h+\lambda}w^\star=0.2$와도 혼동하지 마세요.

**검산.** $w=0.05$에서 $E'=2(0.05-0.3)+0.5=-0.5+0.5=0$. 만약 $w^\star=0.2$였다면 $0.2\le0.25$라 해가 정확히 0이 되는데, 이것이 라쏘가 희소해를 만드는 이유입니다.

관련: [[ch11:9.2b|일관된 규제와 라쏘]]` },
      { ch: 'ch11', type: 'mc', lv: 2, pts: 5, q: R`Early stopping after $\tau$ updates with learning rate $\rho$ is approximately equivalent to weight decay with which coefficient?`,
        choices: [R`$\lambda\approx\rho\tau$`, R`$\lambda\approx\rho/\tau$`, R`$\lambda\approx\tau/\rho$`, R`$\lambda\approx(\rho\tau)^{-1}$`], ans: 3,
        sol: R`
**핵심.** 이차 오차에서 원점부터 학습률 $\rho$로 $\tau$번 갱신하면 헤시안 고유방향($\mathbf H\mathbf u_j=\eta_j\mathbf u_j$) 성분이
$$w_j^{(\tau)}=\big\{1-(1-\rho\eta_j)^\tau\big\}w_j^\star$$
가 됩니다. 이것을 가중치 감쇠의 축소 $\frac{\eta_j}{\eta_j+\lambda}w_j^\star$(곡률을 $\eta_j$로 쓴 꼴)와 비교합니다.

1. $\eta_j\gg(\rho\tau)^{-1}$이면 $(1-\rho\eta_j)^\tau\approx0$이라 $w_j^{(\tau)}\simeq w_j^\star$(거의 다 학습됨).
2. $\eta_j\ll(\rho\tau)^{-1}$이면 $(1-\rho\eta_j)^\tau\approx1-\tau\rho\eta_j$라 $w_j^{(\tau)}\approx\rho\tau\eta_jw_j^\star\ll w_j^\star$(거의 움직이지 않음).
3. 가중치 감쇠도 $\eta_j\gg\lambda$이면 그대로, $\eta_j\ll\lambda$이면 $\frac{\eta_j}\lambda w_j^\star$로 눌립니다. 경계값 $(\rho\tau)^{-1}$이 $\lambda$와 같은 역할을 하므로 $\lambda\approx(\rho\tau)^{-1}$.

**답.** ④ $\lambda\approx(\rho\tau)^{-1}$

**보기 검토.** ① $\rho\tau$ — 역수를 놓친 것으로, 오래 학습할수록 규제가 세진다는 뜻이 되어 반대입니다. ② $\rho/\tau$ — 학습률이 클수록 규제가 세진다는 뜻이라 틀립니다. ③ $\tau/\rho$ — 반복이 많을수록 규제가 세진다는 뜻이라 틀립니다. ④ 정답 — 학습률이나 반복 수가 커질수록 유효 $\lambda$가 작아져 유효 복잡도(유효 파라미터 수)가 커집니다.

관련: [[ch11:9.3|학습 곡선, 조기 종료, 이중 하강]]` },
      { ch: 'ch12', type: 'num', lv: 1, pts: 6, q: R`Four models have zero-mean, mutually uncorrelated errors, and their average error is $E_{\text{AV}}=0.08$. Find the committee error.`, ans: '0.02', ansTex: R`0.02`,
        sol: R`
**핵심.** 모델 $y_m=h+\epsilon_m$의 평균 $y_{\text{COM}}=\frac1M\sum_my_m$의 오차는 $E_{\text{COM}}=\E\big[\{\frac1M\sum_m\epsilon_m\}^2\big]$이고, 오차가 평균 0이며 무상관이면 교차항이 사라져 $E_{\text{COM}}=\frac1ME_{\text{AV}}$입니다.

1. 전개: $E_{\text{COM}}=\frac1{M^2}\Big(\sum_m\E[\epsilon_m^2]+\sum_{m\ne l}\E[\epsilon_m\epsilon_l]\Big)$.
2. 무상관·평균 0이면 $\E[\epsilon_m\epsilon_l]=0$ ($m\ne l$)이므로 $E_{\text{COM}}=\frac1{M^2}\sum_m\E[\epsilon_m^2]=\frac1M\Big(\frac1M\sum_m\E[\epsilon_m^2]\Big)=\frac1ME_{\text{AV}}$.
3. 대입: $0.08/4=0.02$.

**답.** $0.02$

**자주 하는 실수.** $\frac1{M^2}$만 보고 $E_{\text{AV}}/M^2=0.005$로 나누거나(대각항이 $M$개라는 것을 잊음), 표준편차와 혼동해 $E_{\text{AV}}/\sqrt M=0.04$를 쓰는 실수가 있습니다.

**검산.** 쌍마다 상관계수가 $\rho$이면 $E_{\text{COM}}=\{\rho+(1-\rho)/M\}E_{\text{AV}}$이고, $\rho=0$을 넣으면 $0.08/4$로 맞습니다. 실제 모델들은 오차가 강하게 상관되어 이만큼 줄지는 않지만 $E_{\text{AV}}$보다 나빠지지는 않습니다.

관련: [[ch12:9.6|모델 평균]]` },
      { ch: 'ch12', type: 'num', lv: 1, pts: 5, q: R`A network was trained with dropout, keeping each input node with probability $\rho=0.8$. When the full network is used at inference, what should an outgoing weight of $2.5$ from an input node be changed to?`, ans: '2', ansTex: R`2.5\times0.8=2`,
        sol: R`
**핵심.** 드롭아웃 학습에서 노드는 확률 $\rho$로만 존재합니다. 추론 때 마스크 없는 전체 망을 쓰려면 그 노드에서 **나가는 가중치에 $\rho$를 곱해** 다음 노드가 받는 입력의 기댓값을 학습 때와 맞춥니다.

1. 학습 중 이 연결이 다음 유닛에 주는 기여는 $R_iwz_i$ ($R_i\in\{0,1\}$, $P(R_i=1)=\rho$)이고, 기댓값은 $\E[R_i]wz_i=\rho wz_i$입니다.
2. 추론 때는 노드가 항상 있으므로($R_i=1$) 같은 기댓값을 내려면 가중치를 $\rho w$로 바꿉니다.
3. 대입: $0.8\times2.5=2$.

**답.** $2.5\times0.8=2$

**자주 하는 실수.** $\rho$로 나눠 $2.5/0.8=3.125$로 답하는 실수가 흔합니다. $1/\rho$를 곱하는 것은 **학습 때** 남은 활성을 키우는 역드롭아웃(inverted dropout) 관행이고, 그때는 추론 때 아무것도 바꾸지 않습니다. 제거 확률 $0.2$를 곱해 $0.5$로 쓰는 것도 틀립니다.

**검산.** 두 관행 모두 기댓값을 맞춥니다: 학습 때 $\times\frac1\rho$ 후 추론 그대로, 또는 학습 그대로 후 추론 때 $\times\rho$. 가중치를 바꾸지 않으려면 몬테카를로 드롭아웃(마스크 10–20개를 뽑아 예측을 평균)을 씁니다.

관련: [[ch12:9.6b|드롭아웃]]` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 16, q: R`(1) With $a_j=\sum_iw_{ji}z_i$, $z_j=h(a_j)$ and $\delta_j=\partial E_n/\partial a_j$, derive $\partial E_n/\partial w_{ji}=\delta_jz_i$ and $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$. (2) For softmax outputs with the cross-entropy error $E_n=-\sum_kt_k\ln y_k$ ($\sum_kt_k=1$), show that $\delta_l=y_l-t_l$.`,
        rubric: R`
- (1) $w_{ji}$는 $a_j$를 통해서만 영향 — 3점
- (1) 다음 층 $a_k$들에 대한 연쇄법칙 합 — 4점
- (1) $\partial a_k/\partial a_j=w_{kj}h'(a_j)$ — 2점
- (2) $\partial\ln y_k/\partial a_l=\delta_{kl}-y_l$ — 4점
- (2) $\sum_kt_k=1$ 사용해 정리 — 3점`,
        sol: R`
**핵심.** 역전파는 연쇄법칙을 “어떤 변수를 거쳐서만 영향을 주는가”에 따라 정리한 것입니다. (1)은 $w_{ji}\to a_j\to E_n$과 $a_j\to z_j\to\{a_k\}\to E_n$의 경로를, (2)는 로그 소프트맥스의 미분을 씁니다.

(1) **첫째 공식 (3점).** 가중치 $w_{ji}$는 유닛 $j$의 사전활성 $a_j=\sum_iw_{ji}z_i$에만 들어 있으므로 $E_n$에 $a_j$를 통해서만 영향을 줍니다. 연쇄법칙과 $\partial a_j/\partial w_{ji}=z_i$에서
$$\frac{\partial E_n}{\partial w_{ji}}=\frac{\partial E_n}{\partial a_j}\frac{\partial a_j}{\partial w_{ji}}=\delta_jz_i$$
즉 가중치 기울기 = 오차 신호 × 입력 활성입니다.

**연쇄법칙 합 (4점).** $a_j$가 바뀌면 $z_j=h(a_j)$가 바뀌고, $z_j$는 유닛 $j$가 연결을 보내는 모든 유닛 $k$의 사전활성 $a_k=\sum_jw_{kj}z_j$에 들어갑니다. $E_n$은 이 $a_k$들을 통해서만 $a_j$에 의존하므로 다변수 연쇄법칙으로 경로마다 더합니다.
$$\delta_j=\frac{\partial E_n}{\partial a_j}=\sum_k\frac{\partial E_n}{\partial a_k}\frac{\partial a_k}{\partial a_j}=\sum_k\delta_k\frac{\partial a_k}{\partial a_j}$$

**국소 미분 (2점).** $\frac{\partial a_k}{\partial a_j}=\frac{\partial a_k}{\partial z_j}\frac{\partial z_j}{\partial a_j}=w_{kj}h'(a_j)$. 대입하고 $k$와 무관한 $h'(a_j)$를 합 밖으로 빼면
$$\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$$

(2) **로그 소프트맥스의 미분 (4점).** $y_k=\frac{e^{a_k}}{\sum_me^{a_m}}$이므로 $\ln y_k=a_k-\ln\sum_me^{a_m}$. $a_l$로 미분하면 첫 항은 $\delta_{kl}$, 둘째 항은 $\frac{e^{a_l}}{\sum_me^{a_m}}=y_l$이라
$$\frac{\partial\ln y_k}{\partial a_l}=\delta_{kl}-y_l$$

**정리 (3점).**
$$\delta_l=\frac{\partial E_n}{\partial a_l}=-\sum_kt_k\frac{\partial\ln y_k}{\partial a_l}=-\sum_kt_k(\delta_{kl}-y_l)=-t_l+y_l\sum_kt_k$$
원-핫 목표처럼 $\sum_kt_k=1$이면 $\delta_l=y_l-t_l$입니다.

**검산.** $K=2$, $\mathbf a=(0,0)$, $\mathbf t=(1,0)$이면 $\mathbf y=(0.5,0.5)$이고 $E_n=-\ln y_1=\ln(1+e^{a_2-a_1})$. 직접 미분하면 $\partial E_n/\partial a_1=-\frac{e^{a_2-a_1}}{1+e^{a_2-a_1}}=-0.5=y_1-t_1$로 맞습니다. 출력 오차가 선형 출력+제곱오차와 같은 $y-t$ 꼴이 되는 것이 정준 연결의 성질입니다.

관련: [[ch10:8.1b|일반 피드포워드망과 역전파]], [[ch07:6.4|오차함수와 출력 활성화]]` },
    ],
  },
  {
    id: 'x3', roman: 'III', kind: '중간고사 종합', title: '종합 모의고사', scopeText: '01–06, 08–12 단원',
    desc: '확률과 정보이론부터 옵티마이저·정규화·역전파·규제까지. 실제 시험처럼 계산과 유도를 섞었습니다.',
    minutes: 100, plot: 'exam',
    problems: [
      { ch: 'ch03', type: 'num', lv: 2, pts: 7, q: R`A test with sensitivity 99% and false-positive rate 1% is used for a rare disease with prevalence 0.1%. Given a positive result, what is the probability that the patient has the disease? (4 decimal places)`, ans: '0.00099/0.01098', ansTex: R`\tfrac{0.00099}{0.01098}\approx0.0902`,
        sol: R`
**핵심.** 유병률이 매우 낮으면 정확한 검사라도 양성 예측도가 낮습니다. 베이즈 정리
$$p(D=1\mid T=1)=\frac{p(T=1\mid D=1)p(D=1)}{p(T=1\mid D=1)p(D=1)+p(T=1\mid D=0)p(D=0)}$$

1. 주어진 값: $p(D=1)=0.001$, 민감도 $p(T=1\mid D=1)=0.99$, 위양성률 $p(T=1\mid D=0)=0.01$, $p(D=0)=0.999$.
2. 참양성(곱의 규칙): $0.99\times0.001=0.00099$.
3. 위양성: $0.01\times0.999=0.00999$.
4. 증거(합의 규칙): $p(T=1)=0.00099+0.00999=0.01098$.
5. 사후확률: $0.00099/0.01098\approx0.0902$.

**답.** $\tfrac{0.00099}{0.01098}\approx0.0902$

**자주 하는 실수.** “99% 정확하니 0.99”라고 답하는 기저율 무시가 가장 흔합니다. 위양성 항에서 $p(D=0)=0.999$ 대신 1을 쓰면 $0.00099/0.01099\approx0.0901$로 거의 같지만 식이 틀린 것입니다.

**검산.** 10만 명 중 환자 100명에서 99명, 건강한 99,900명에서 999명이 양성입니다. 양성 1,098명 가운데 환자는 99명이라 $99/1098\approx0.0902$, 즉 양성의 약 91%가 위양성입니다.

관련: [[ch03:2.1b|베이즈 정리와 의료 선별검사]]` },
      { ch: 'ch04', type: 'num', lv: 1, pts: 6, q: R`A Gaussian is fitted to the data $1,2,6$ by maximum likelihood. Find $\sigma^2_{\text{ML}}$.`, ans: '14/3', ansTex: R`\tfrac{14}3`,
        sol: R`
**핵심.** 가우시안의 최대가능도 해는 표본평균과 $N$으로 나눈 표본분산입니다.
$$\mu_{\text{ML}}=\frac1N\sum_nx_n,\qquad \sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\mu_{\text{ML}})^2$$

1. 로그가능도 $-\frac1{2\sigma^2}\sum(x_n-\mu)^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi)$를 $\mu$로 미분해 0으로 두면 $\mu_{\text{ML}}=\bar x=(1+2+6)/3=3$.
2. 편차는 $-2,-1,3$, 제곱은 $4,1,9$, 합은 $14$입니다.
3. $\sigma^2$로 미분해 0으로 두면 $\sigma^2_{\text{ML}}=\frac1N\sum(x_n-\bar x)^2=14/3\approx4.667$.

**답.** $\tfrac{14}3$

**자주 하는 실수.** $N-1=2$로 나눈 $7$은 불편 추정량 $\tilde\sigma^2$이지 최대가능도 해가 아닙니다. 표준편차 $\sqrt{14/3}\approx2.160$을 답으로 쓰는 실수도 있습니다.

**검산.** $\frac1N\sum x_n^2-\bar x^2=\frac{1+4+36}3-9=\frac{41}3-9=\frac{14}3$으로 같습니다.

관련: [[ch04:2.3|가우시안 분포와 최대가능도]]` },
      { ch: 'ch05', type: 'mc', lv: 2, pts: 5, q: R`Which of the following is **always** true?`,
        choices: [R`$\KL(p\Vert q)=\KL(q\Vert p)$`, R`$\mathrm H[\mathbf x\mid\mathbf y]\le\mathrm H[\mathbf x]$`, R`Differential entropy is always nonnegative`, R`It is possible that $\mathrm I[\mathbf x,\mathbf y]<0$`], ans: 1,
        sol: R`
**핵심.** 상호정보량은 KL 발산이라 음이 아닙니다.
$$\mathrm I[\mathbf x,\mathbf y]\equiv\KL\big(p(\mathbf x,\mathbf y)\Vert p(\mathbf x)p(\mathbf y)\big)=\mathrm H[\mathbf x]-\mathrm H[\mathbf x\mid\mathbf y]\ge0$$

1. $\KL\ge0$(옌센 부등식)이므로 $\mathrm I\ge0$이고, 위 등식에서 바로 $\mathrm H[\mathbf x\mid\mathbf y]\le\mathrm H[\mathbf x]$가 나옵니다. $\mathbf y$를 관측하면 $\mathbf x$의 불확실성이 줄거나 그대로라는 뜻이며, 등호는 독립일 때입니다.
2. 나머지 보기에는 반례가 있습니다.

**답.** ② $\mathrm H[\mathbf x\mid\mathbf y]\le\mathrm H[\mathbf x]$

**보기 검토.** ① KL은 대칭이 아닙니다. 예: $p=(\frac12,\frac12)$, $q=(\frac14,\frac34)$이면 $\KL(p\Vert q)\approx0.1438$, $\KL(q\Vert p)\approx0.1308$. ② 정답. ③ 가우시안의 미분 엔트로피 $\frac12\{1+\ln(2\pi\sigma^2)\}$는 $\sigma^2\lt\frac1{2\pi e}\approx0.0585$이면 음수입니다. 항상 0 이상인 것은 이산 엔트로피입니다. ④ 상호정보량은 KL이므로 음수가 될 수 없습니다.

관련: [[ch05:2.5c|조건부 엔트로피와 상호정보량]]` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 6, q: R`Find the difference in differential entropy between $\N(0,4)$ and $\N(0,1)$, $\mathrm H[\N(0,4)]-\mathrm H[\N(0,1)]$ (in nats). (4 decimal places)`, ans: 'ln(2)', ansTex: R`\tfrac12\ln4=\ln2\approx0.6931`,
        sol: R`
**핵심.** 가우시안의 미분 엔트로피는 분산에만 의존합니다.
$$\mathrm H[x]=\frac12\{1+\ln(2\pi\sigma^2)\}\quad(\text{내트})$$

1. $\N(0,4)$는 $\sigma^2=4$이므로 $\mathrm H=\frac12\{1+\ln(8\pi)\}\approx2.112$.
2. $\N(0,1)$은 $\sigma^2=1$이므로 $\mathrm H=\frac12\{1+\ln(2\pi)\}\approx1.419$.
3. 차이: 상수 $\frac12$와 $\frac12\ln2\pi$가 상쇄되어 $\frac12\ln\frac41=\frac12\ln4=\ln2\approx0.6931$.

**답.** $\tfrac12\ln4=\ln2\approx0.6931$

**자주 하는 실수.** $\N(\mu,\sigma^2)$의 둘째 인수는 분산인데 $\sigma=4$로 읽으면 $\frac12\ln16=\ln4\approx1.386$이 됩니다. 비트로 답하면 $1$비트입니다(표준편차가 2배이면 1비트 늘어남).

**검산.** $x\sim\N(0,1)$이면 $y=2x\sim\N(0,4)$이고, 밀도 변환 $p_y(y)=p_x(y/2)\cdot\frac12$에서 $\mathrm H[y]=-\E[\ln p_x(x)-\ln2]=\mathrm H[x]+\ln2$로 같은 결과입니다.

관련: [[ch05:2.5|정보량, 엔트로피, 미분 엔트로피]]` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 6, q: R`A uniform prior is placed on the success probability $\mu$, and 7 successes are observed in 10 trials. Find the posterior mean. (4 decimal places)`, ans: '2/3', ansTex: R`\tfrac{7+1}{10+2}=\tfrac23`,
        sol: R`
**핵심.** 성공 확률 $\mu$에 균등 사전분포 $p(\mu)=1$ ($0\le\mu\le1$)을 두고 $N$번 중 $m$번 성공을 보면 사후분포는 $\mu^m(1-\mu)^{N-m}$에 비례하고
$$\E[\mu\mid\mathcal D]=\frac{m+1}{N+2}$$

1. 가능도: 시행이 독립이므로 곱의 규칙으로 $p(\mathcal D\mid\mu)=\mu^7(1-\mu)^3$.
2. 사후분포: 사후 $\propto$ 가능도 × 사전 $=\mu^7(1-\mu)^3$. 정규화하면 $\frac{11!}{7!\,3!}\mu^7(1-\mu)^3$, 즉 $\operatorname{Beta}(8,4)$입니다.
3. 사후평균: $\frac{m+1}{N+2}=\frac{7+1}{10+2}=\frac8{12}=\frac23\approx0.6667$.

**답.** $\tfrac{7+1}{10+2}=\tfrac23$

**자주 하는 실수.** 최대가능도 추정값 $m/N=0.7$을 답하거나, 사후분포의 최빈값(MAP)과 사후평균을 혼동하는 경우가 많습니다. 균등 사전분포에서는 MAP이 MLE와 같은 $0.7$이고, 사후평균만 $\frac{m+1}{N+2}$로 다릅니다.

**검산.** 사후평균은 MLE $0.7$에서 사전분포의 평균 $0.5$ 쪽으로 당겨져야 하는데 $0.6667$이 둘 사이에 있습니다. $N\to\infty$이면 $\frac{m+1}{N+2}\to\frac mN$으로 MLE에 가까워집니다.

관련: [[ch06:2.6|모수의 불확실성과 사후분포]]` },
      { ch: 'ch02', type: 'mc', lv: 1, pts: 5, q: R`In polynomial curve fitting, what happens if the regularization coefficient $\lambda$ is made very large?`,
        choices: [R`Over-fitting becomes more severe`, R`The coefficients are pushed toward zero, giving under-fitting (increased bias)`, R`The training error becomes zero`, R`Nothing changes`], ans: 1,
        sol: R`
**핵심.** $L_2$ 규제된 오차 $\tilde E(\mathbf w)=\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2+\frac\lambda2\lVert\mathbf w\rVert^2$에서 $\lambda$는 벌점항의 상대적 중요도입니다.

1. 해는 $(\Phi^T\Phi+\lambda\mathbf I)\mathbf w^\star=\Phi^T\mathbf t$를 만족합니다. $\lambda$가 $\Phi^T\Phi$의 원소보다 훨씬 크면 $\mathbf w^\star\approx\frac1\lambda\Phi^T\mathbf t\to\mathbf 0$.
2. 계수가 모두 0 가까이로 눌리면 곡선이 거의 평평해져 $\sin(2\pi x)$의 굴곡을 따라가지 못합니다(교재 $M=9$, $\ln\lambda=0$: 모든 계수 $\approx0$).
3. 모델이 지나치게 단순해진 것이므로 과소적합, 곧 편향이 커진 상태입니다.

**답.** ② 계수가 0 쪽으로 눌려 과소적합(편향 증가)이 된다

**보기 검토.** ① 과적합은 $\lambda$가 너무 작을 때(규제 없음, $\ln\lambda=-\infty$) 생깁니다. ② 정답. ③ 훈련 오차 0은 규제가 없고 모수가 충분할 때의 일이고, 큰 $\lambda$에서는 훈련 오차가 오히려 커집니다. ④ $\lambda$가 해 $\mathbf w^\star$를 직접 바꾸므로 변화가 있습니다.

**자주 하는 실수.** 적절한 $\lambda$를 훈련 오차로 고르면 항상 $\lambda=0$이 이깁니다. 초매개변수는 검증 자료(또는 $S$겹 교차검증)로 골라야 합니다.

관련: [[ch02:1.2c|규제와 모델 선택]]` },
      { ch: 'ch08', type: 'num', lv: 1, pts: 6, q: R`For the exponential schedule $\eta^{(\tau)}=\eta^{(0)}c^{\tau/s}$ with $\eta^{(0)}=0.01$, $c=0.1$, $s=100$, find the learning rate at $\tau=200$.`, ans: '0.0001', ansTex: R`10^{-4}`,
        sol: R`
**핵심.** 학습률 스케줄은 처음에 큰 $\eta$로 빠르게 움직이고 시간이 지나면 줄여 안정적으로 수렴하게 합니다. 지수 스케줄 $\eta^{(\tau)}=\eta^{(0)}c^{\tau/s}$ ($0\lt c\lt1$)는 $s$단계마다 학습률을 $c$배로 줄입니다.

1. 지수: $\tau/s=200/100=2$.
2. 감소 인수: $c^{\tau/s}=0.1^2=0.01$.
3. 학습률: $\eta^{(200)}=0.01\times0.01=10^{-4}$.

**답.** $10^{-4}$

**자주 하는 실수.** 지수를 $\tau$로 써서 $0.1^{200}$처럼 사실상 0을 만들거나, $\tau/s$를 뒤집어 $0.01\times0.1^{0.5}\approx0.003162$로 계산하는 실수가 있습니다. 선형 스케줄 $\big(1-\frac\tau K\big)\eta^{(0)}+\frac\tau K\eta^{(K)}$과 섞지 않도록 식을 먼저 확인하세요.

**검산.** $\tau=100$에서 $10^{-3}$, $\tau=200$에서 $10^{-4}$로 100단계마다 한 자릿수씩 줄어 $c=0.1$, $s=100$의 의미와 맞습니다. $\ln\eta^{(\tau)}$가 $\tau$의 일차함수라 로그 눈금에서 직선입니다.

관련: [[ch08:7.3c|학습률 스케줄]]` },
      { ch: 'ch08', type: 'mc', lv: 2, pts: 5, q: R`Let $E=\sum_nE_n$. Which statement about $\frac NB\sum_{n\in\mathcal B}\nabla E_n$, formed from a random minibatch $\mathcal B$ (of size $B$), is correct?`,
        choices: [R`Its expectation is $\nabla E$, and its variance is smaller for larger $B$`, R`It is always equal to $\nabla E$`, R`Its expectation is $\nabla E/B$`, R`Its variance does not depend on $B$`], ans: 0,
        sol: R`
**핵심.** $E=\sum_nE_n$이므로 전체 기울기는 $\nabla E=\sum_{n=1}^N\nabla E_n$입니다. 무작위로 뽑은 $B$개의 합에 $\frac NB$를 곱하면 이 전체 합의 불편 추정량이 됩니다.

1. 자료를 무작위로 섞어 뽑으면 각 자료점이 미니배치에 들어갈 확률은 $B/N$입니다. 따라서 $\E\big[\sum_{n\in\mathcal B}\nabla E_n\big]=\sum_{n=1}^N\frac BN\nabla E_n=\frac BN\nabla E$.
2. $\frac NB$를 곱하면 기댓값이 정확히 $\nabla E$이므로 불편 추정량입니다.
3. 추정량은 $N\cdot\frac1B\sum_{n\in\mathcal B}\nabla E_n$, 즉 표본 $B$개의 평균에 $N$을 곱한 꼴이라 표본평균처럼 분산이 대략 $1/B$에 비례해 줄어듭니다.

**답.** ① 기댓값이 $\nabla E$이고 분산은 $B$가 클수록 작다

**보기 검토.** ① 정답. ② 뽑힌 미니배치에 따라 값이 달라지는 확률적 추정이라 일반적으로 $\nabla E$와 다릅니다($B=N$일 때만 같음). ③ $\frac NB$를 곱했으므로 $\frac1B$배가 남지 않습니다. ④ 평균내는 표본이 많을수록 잡음이 줄어 분산은 $B$에 의존합니다.

**검산.** $B=1$이면 SGD의 $N\nabla E_n$(잡음이 매우 큼), $B=N$이면 배치 경사하강법의 $\nabla E$(분산 0)로 두 극단과 맞습니다.

관련: [[ch08:7.2|배치, 확률적, 미니배치 경사하강법]]` },
      { ch: 'ch09', type: 'mc', lv: 3, pts: 5, q: R`Which statement about the weights $\mathbf w_i$ of the linear layer immediately before batch normalization is correct? ($\delta\approx0$)`,
        choices: [R`Doubling $\mathbf w_i$ doubles the output`, R`The bias $b_i$ of the preceding layer has a large effect on the output`, R`The gradient of the loss $\nabla_{\mathbf w_i}L$ is orthogonal to $\mathbf w_i$`, R`Training is easier without $\gamma_i,\beta_i$`], ans: 2,
        sol: R`
**핵심.** 배치 정규화는 사전활성 $a_{ni}=\mathbf w_i^T\mathbf z_n+b_i$에서 미니배치 평균 $\mu_i$를 빼고 표준편차 $\sigma_i$로 나눕니다. 그래서 $\hat a_{ni}=\frac{a_{ni}-\mu_i}{\sigma_i}$ ($\delta\approx0$)는 $\mathbf w_i$의 **크기**와 편향 $b_i$에 무관합니다.

1. 편향: $b_i$는 모든 예제에 똑같이 더해져 $\mu_i$에도 그대로 들어가므로 $a_{ni}-\mu_i=\mathbf w_i^T(\mathbf z_n-\bar{\mathbf z})$에서 사라집니다($\bar{\mathbf z}$: 미니배치 평균).
2. 척도: $\mathbf w_i\to c\mathbf w_i$ ($c\gt0$)이면 $a_{ni}-\mu_i$와 $\sigma_i$가 모두 $c$배가 되어 $\hat a_{ni}$는 그대로입니다. 따라서 모든 $c\gt0$에서 $L(c\mathbf w_i)=L(\mathbf w_i)$.
3. 이 등식을 $c$로 미분해 $c=1$을 넣으면(연쇄법칙) $\frac{d}{dc}L(c\mathbf w_i)\big|_{c=1}=\nabla_{\mathbf w_i}L^T\mathbf w_i=0$, 즉 기울기가 $\mathbf w_i$에 수직입니다.

**답.** ③ 손실의 기울기 $\nabla_{\mathbf w_i}L$은 $\mathbf w_i$에 수직이다

**보기 검토.** ① 2배 해도 평균과 표준편차가 함께 2배가 되어 출력은 변하지 않습니다. ② $b_i$는 평균을 빼면서 상쇄되어 영향이 없습니다. 정규화 뒤의 평균은 $\beta_i$가 정합니다. ③ 정답. ④ $\gamma_i,\beta_i$가 없으면 층의 표현력이 줄어듭니다. 이들이 평균·분산을 직접 정하는 독립 파라미터라 오히려 학습이 쉬워집니다.

관련: [[ch09:7.4b|배치 정규화]]` },
      { ch: 'ch10', type: 'num', lv: 3, pts: 7, q: R`For $f(x_1,x_2)=x_1x_2+\exp(x_1x_2)-\sin x_2$, find $\partial f/\partial x_2$ at $(x_1,x_2)=(1,1)$. (4 decimal places)`, ans: '1+e-cos(1)', ansTex: R`1+e-\cos1\approx3.1780`,
        sol: R`
**핵심.** 후진 모드 자동 미분은 출력에서 시작해 수반 변수 $\bar v_i=\partial f/\partial v_i$를 $\bar v_i=\sum_{j\in\mathrm{ch}(i)}\bar v_j\frac{\partial v_j}{\partial v_i}$로 거꾸로 전달합니다. 교재의 중간 변수는 $v_1=x_1$, $v_2=x_2$, $v_3=v_1v_2$, $v_4=\sin v_2$, $v_5=\exp v_3$, $v_6=v_3-v_4$, $v_7=v_5+v_6=f$입니다.

1. 순전파($x_1=x_2=1$): $v_3=1$, $v_4=\sin1\approx0.8415$, $v_5=e\approx2.718$, $v_6\approx0.1585$, $f=v_7\approx2.877$.
2. 출력 쪽: $\bar v_7=1$, $\bar v_5=\bar v_7=1$, $\bar v_6=\bar v_7=1$, $\bar v_4=-\bar v_6=-1$.
3. $v_3$은 $v_5$와 $v_6$ 두 곳에 쓰이므로 두 경로를 더합니다: $\bar v_3=\bar v_5v_5+\bar v_6=e+1\approx3.718$.
4. $v_2$는 $v_3$과 $v_4$에 쓰입니다: $\bar v_2=\bar v_3v_1+\bar v_4\cos v_2=(1+e)\cdot1-\cos1\approx3.718-0.5403\approx3.178$.

**답.** $1+e-\cos1\approx3.1780$

**자주 하는 실수.** 자식이 둘인 노드에서 한 경로만 더하면($\bar v_3=e$) $e-\cos1\approx2.178$이 되고, $-\sin x_2$의 미분 부호를 놓치면 $1+e+\cos1\approx4.259$가 됩니다.

**검산.** 직접 미분: $\frac{\partial f}{\partial x_2}=x_1+x_1e^{x_1x_2}-\cos x_2=1+e-\cos1$. 같은 역방향 패스에서 $\bar v_1=\bar v_3v_2=1+e$도 함께 나옵니다(출력이 하나라 한 번으로 충분).

관련: [[ch10:8.2|자동 미분]]` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 6, q: R`Approximate the derivative of $E(w)=w^3$ at $w=1$ by central differences with $\epsilon=0.1$.`, ans: '3.01', ansTex: R`3.01`,
        sol: R`
**핵심.** 중앙 차분 $\frac{E(w+\epsilon)-E(w-\epsilon)}{2\epsilon}$은 테일러 전개 $E(w\pm\epsilon)=E\pm\epsilon E'+\frac{\epsilon^2}2E''\pm\frac{\epsilon^3}6E'''+\cdots$에서 짝수 차 항이 상쇄되어 $E'(w)+\frac{\epsilon^2}6E'''(w)+O(\epsilon^4)$, 즉 오차가 $O(\epsilon^2)$입니다.

1. $E(1.1)=1.1^3=1.331$, $E(0.9)=0.9^3=0.729$.
2. 차: $1.331-0.729=0.602$.
3. $2\epsilon=0.2$로 나누면 $0.602/0.2=3.01$.

**답.** $3.01$

**검산.** 참값은 $E'(1)=3w^2=3$입니다. 오차 $0.01$은 $\frac{\epsilon^2}6E'''=\frac{0.01}6\times6=0.01$과 정확히 같습니다. $E=w^3$은 4차 이상 도함수가 0이라 이 항뿐이고, 실제로 $\frac{(1+\epsilon)^3-(1-\epsilon)^3}{2\epsilon}=3+\epsilon^2$입니다.

**자주 하는 실수.** 전진 차분 $\frac{E(1.1)-E(1)}{0.1}=3.31$을 쓰면 오차가 $O(\epsilon)$이라 오차($0.31$)가 31배 큽니다. $2\epsilon$ 대신 $\epsilon$으로 나눠 $6.02$를 쓰는 실수도 있습니다. 중앙 차분은 역전파 구현을 검증(gradient check)하는 데 쓰며, 가중치를 하나씩 흔들어야 해 전체 기울기에 $O(W^2)$이 듭니다.

관련: [[ch10:8.1c|2층 신경망 예제와 수치 미분]]` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 6, q: R`Starting from the origin, training is stopped after 10 updates with learning rate $\rho=0.1$. The component along the direction with curvature $\eta_j=0.1$ is what multiple of $w_j^\star$? (4 decimal places)`, ans: '1-0.99^10', ansTex: R`1-0.99^{10}\approx0.0956`,
        sol: R`
**핵심.** 이차 오차 $E=E_0+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$에서 원점부터 $\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\rho\nabla E$로 갱신하면 헤시안 고유방향($\mathbf H\mathbf u_j=\eta_j\mathbf u_j$) 성분이
$$w_j^{(\tau)}=\big\{1-(1-\rho\eta_j)^\tau\big\}w_j^\star$$

1. 유도: 고유좌표에서 $\nabla E$의 $j$성분은 $\eta_j(w_j-w_j^\star)$이므로 $w_j^{(\tau)}-w_j^\star=(1-\rho\eta_j)(w_j^{(\tau-1)}-w_j^\star)$. $w_j^{(0)}=0$에서 시작하면 $w_j^{(\tau)}-w_j^\star=-(1-\rho\eta_j)^\tau w_j^\star$.
2. 배율: $\rho\eta_j=0.1\times0.1=0.01$이고 $(1-0.01)^{10}=0.99^{10}\approx0.9044$.
3. $w_j^{(10)}/w_j^\star=1-0.9044\approx0.0956$.

**답.** $1-0.99^{10}\approx0.0956$

**자주 하는 실수.** 남은 거리의 비율 $(1-\rho\eta_j)^\tau\approx0.9044$를 답으로 쓰는 실수, 근사 $\rho\tau\eta_j=0.1$을 정확한 값처럼 쓰는 실수가 있습니다(근사는 $\rho\tau\eta_j\ll1$일 때만 좋음).

**검산.** 조기 종료는 $\lambda\approx(\rho\tau)^{-1}=1$인 가중치 감쇠와 비슷해야 하고, 그 축소 배율 $\frac{\eta_j}{\eta_j+\lambda}=\frac{0.1}{1.1}\approx0.0909$는 $0.0956$과 가깝습니다. 둔감한 방향이라 거의 움직이지 않은 상태에서 멈춘 것입니다.

관련: [[ch11:9.3|학습 곡선, 조기 종료, 이중 하강]]` },
      { ch: 'ch12', type: 'num', lv: 3, pts: 6, q: R`The errors of five models each have variance 1 (zero mean), and every pair has correlation coefficient 0.5. Find the committee error $E_{\text{COM}}$.`, ans: '0.6', ansTex: R`\tfrac15+\tfrac45(0.5)=0.6`,
        sol: R`
**핵심.** 오차의 분산이 모두 $v$이고 쌍마다 상관계수가 $\rho$이면 $\E[\epsilon_m\epsilon_l]=\rho v$ ($m\ne l$)이고
$$E_{\text{COM}}=\Big(\rho+\frac{1-\rho}M\Big)E_{\text{AV}}$$

1. 전개: $E_{\text{COM}}=\frac1{M^2}\E\big[(\sum_m\epsilon_m)^2\big]=\frac1{M^2}\Big(\sum_m\E[\epsilon_m^2]+\sum_{m\ne l}\E[\epsilon_m\epsilon_l]\Big)$.
2. 대각항 $M$개는 각각 $v$, 교차항(순서쌍) $M(M-1)$개는 각각 $\rho v$이므로 $E_{\text{COM}}=\frac{Mv+M(M-1)\rho v}{M^2}=\frac vM+\frac{M-1}M\rho v$.
3. 대입($M=5$, $v=1$, $\rho=0.5$): $\frac15+\frac45\times0.5=0.2+0.4=0.6$.

**답.** $\tfrac15+\tfrac45(0.5)=0.6$

**자주 하는 실수.** 무상관 공식 $E_{\text{AV}}/M=0.2$를 그대로 쓰거나, 교차항을 $M(M-1)/2=10$개로 세어 $\frac{5+10\times0.5}{25}=0.4$를 얻는 실수가 흔합니다. $\sum_{m\ne l}$은 $(m,l)$과 $(l,m)$을 따로 세므로 $20$개입니다.

**검산.** $\rho=0$이면 $1/M=0.2$, $\rho=1$이면 $1$(모델이 모두 같아 전혀 줄지 않음)이고, $0.6$은 그 사이입니다. $E_{\text{AV}}=1$보다 작아 $E_{\text{COM}}\le E_{\text{AV}}$와도 맞습니다.

관련: [[ch12:9.6|모델 평균]]` },
      { ch: 'ch12', type: 'mc', lv: 2, pts: 5, q: R`Which of the following is **not** a correct reason why residual connections help in training very deep networks?`,
        choices: [R`The Jacobian of a block is $\mathbf I+J_l$, so the identity path passes the gradient directly`, R`The error surface becomes smoother`, R`The network behaves like an ensemble of shallow and deep paths`, R`They greatly reduce the number of parameters`], ans: 3,
        sol: R`
**핵심.** 잔차 블록 $\mathbf z_l=F_l(\mathbf z_{l-1})+\mathbf z_{l-1}$은 입력을 출력에 그대로 더하는 건너뛰는 연결입니다. 더하기에는 파라미터가 없으므로 파라미터 수는 거의 같고, 달라지는 것은 기울기의 전달과 오차 곡면의 성질입니다.

1. 블록의 야코비안은 $\frac{\partial\mathbf z_l}{\partial\mathbf z_{l-1}}=\frac{\partial F_l}{\partial\mathbf z_{l-1}}+\mathbf I=J_l+\mathbf I$라, $J_l$이 작아도 항등 경로로 기울기가 직통 전달됩니다.
2. 깊은 ReLU 망의 산산조각 난 기울기와 달리 잔차망의 기울기는 입력·파라미터의 작은 변화에 덜 민감하고, 오차 곡면도 훨씬 매끄러워집니다.
3. 블록을 대입해 펼치면 출력이 여러 깊이 경로의 합이 되어($L$블록이면 $2^L$개 경로) 얕은·깊은 부분망의 앙상블처럼 작동합니다.

**답.** ④ 파라미터 수를 크게 줄인다

**보기 검토.** ① 옳은 설명 — 항등 행렬 $\mathbf I$가 기울기의 직통 경로입니다. ② 옳은 설명 — 교재가 든 효과(56층 망의 곡면 시각화)입니다. ③ 옳은 설명 — 펼친 식의 경로 앙상블 해석입니다. ④ 옳지 않음, 정답 — 건너뛰는 연결은 파라미터를 거의 늘리지도 줄이지도 않습니다. 차원이 다를 때 쓰는 $\mathbf z_l=F_l(\mathbf z_{l-1})+\mathbf W\mathbf z_{l-1}$은 오히려 파라미터를 더합니다.

관련: [[ch12:9.5|잔차 연결]]` },
      { ch: 'ch11', type: 'open', lv: 3, pts: 10, q: R`Add $\frac\lambda2\mathbf w^T\mathbf w$ to the quadratic error $E=E_0+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$. Show that, in the eigenvector coordinates of the Hessian, the minimizer is $\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$, and explain what it means that directions of small curvature are shrunk more.`,
        rubric: R`
- $(\mathbf H+\lambda\mathbf I)\hat{\mathbf w}=\mathbf H\mathbf w^\star$ — 3점
- 고유분해·사영으로 성분식 — 4점
- 해석(둔감한 방향 억제, 유효 파라미터 수) — 3점`,
        sol: R`
**핵심.** 규제된 오차 $\widetilde E=E_0+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)+\frac\lambda2\mathbf w^T\mathbf w$는 $\mathbf w$의 이차식이라 기울기를 0으로 두면 최소점이 나오고, 헤시안의 고유벡터 좌표에서는 성분마다 따로 풀립니다.

**1. 정류 조건 (3점).** $\mathbf H$는 대칭이므로 $\nabla\widetilde E=\mathbf H(\mathbf w-\mathbf w^\star)+\lambda\mathbf w$. 최소점 $\hat{\mathbf w}$에서 0으로 두면
$$(\mathbf H+\lambda\mathbf I)\hat{\mathbf w}=\mathbf H\mathbf w^\star$$
최소점 근처에서 $\mathbf H$는 양의 준정부호이고 $\lambda\gt0$이므로 $\mathbf H+\lambda\mathbf I$는 양의 정부호입니다. 따라서 해가 유일하고 최소점입니다.

**2. 고유좌표의 성분식 (4점).** $\mathbf H\mathbf u_j=\lambda_j\mathbf u_j$, $\mathbf u_j^T\mathbf u_k=\delta_{jk}$로 두면 $\mathbf H=\sum_j\lambda_j\mathbf u_j\mathbf u_j^T$입니다. 성분을 $\hat w_j=\mathbf u_j^T\hat{\mathbf w}$, $w_j^\star=\mathbf u_j^T\mathbf w^\star$로 정의하고 위 식의 양변에 $\mathbf u_j^T$를 곱하면, $\mathbf u_j^T\mathbf H=\lambda_j\mathbf u_j^T$이므로
$$(\lambda_j+\lambda)\hat w_j=\lambda_jw_j^\star\quad\Longrightarrow\quad\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$$

**3. 해석 (3점).** 고윳값 $\lambda_j$는 그 방향의 곡률, 즉 오차가 그 성분에 얼마나 민감한지를 나타냅니다.
- 곡률이 큰 방향($\lambda_j\gg\lambda$): 배율 $\approx1$. 오차에 중요한 성분이라 거의 그대로 남습니다.
- 곡률이 작은 방향($\lambda_j\ll\lambda$): 배율 $\approx\lambda_j/\lambda\approx0$. 움직여도 오차가 거의 변하지 않는 둔감한 성분이라 0 가까이로 눌립니다.
- 즉 출력에 영향이 적은 파라미터를 억제하는 셈이고, 규제 뒤에도 크게 남는(활성인) 방향의 수가 **유효 파라미터 수**입니다($\lambda=0$이면 전체, $\lambda\to\infty$이면 0).

**검산.** 예: $\lambda_1=0.25$, $\lambda_2=4$, $\lambda=1$이면 배율이 $0.2$와 $0.8$이라 둔감한 방향은 80% 줄고 민감한 방향은 20%만 줄어듭니다. $\lambda=0$이면 모든 배율이 1이 되어 $\hat{\mathbf w}=\mathbf w^\star$로 돌아옵니다.

관련: [[ch11:9.2|가중치 감쇠]]` },
      { ch: 'ch12', type: 'open', lv: 2, pts: 9, q: R`For the average $y_{\text{COM}}$ of the models $y_m=h+\epsilon_m$ ($m=1,\dots,M$), prove that $E_{\text{COM}}\le E_{\text{AV}}$.`,
        rubric: R`
- $E_{\text{COM}}$, $E_{\text{AV}}$를 $\epsilon_m$으로 표현 — 3점
- 점별로 $(\frac1M\sum\epsilon_m)^2\le\frac1M\sum\epsilon_m^2$ (볼록성·옌센 또는 코시-슈바르츠) — 4점
- 기댓값을 취해 결론 — 2점`,
        sol: R`
**핵심.** 위원회 오차는 “오차의 평균의 제곱”, 평균 오차는 “오차 제곱의 평균”입니다. $u\mapsto u^2$이 볼록이므로 옌센 부등식으로 앞의 것이 뒤의 것보다 작거나 같습니다.

**1. 오차로 표현 (3점).** $y_{\text{COM}}(\mathbf x)=\frac1M\sum_my_m(\mathbf x)=h(\mathbf x)+\frac1M\sum_m\epsilon_m(\mathbf x)$이므로
$$E_{\text{COM}}=\E_{\mathbf x}\big[\{y_{\text{COM}}(\mathbf x)-h(\mathbf x)\}^2\big]=\E_{\mathbf x}\Big[\Big\{\frac1M\sum_{m=1}^M\epsilon_m(\mathbf x)\Big\}^2\Big]$$
각 모델의 제곱오차는 $\E_{\mathbf x}[\{y_m(\mathbf x)-h(\mathbf x)\}^2]=\E_{\mathbf x}[\epsilon_m(\mathbf x)^2]$이고, 그 평균이
$$E_{\text{AV}}=\frac1M\sum_{m=1}^M\E_{\mathbf x}\big[\epsilon_m(\mathbf x)^2\big]$$

**2. 점별 부등식 (4점).** 한 점 $\mathbf x$를 고정하고 $u_m=\epsilon_m(\mathbf x)$로 둡니다. $f(u)=u^2$은 볼록이므로 가중치가 모두 $\frac1M$(합 1)인 옌센 부등식 $f\big(\sum_m\frac1Mu_m\big)\le\sum_m\frac1Mf(u_m)$에서
$$\Big(\frac1M\sum_mu_m\Big)^2\le\frac1M\sum_mu_m^2$$
코시-슈바르츠로도 같습니다: $\big(\sum_m1\cdot u_m\big)^2\le\big(\sum_m1^2\big)\big(\sum_mu_m^2\big)=M\sum_mu_m^2$를 $M^2$으로 나누면 위 식입니다.

**3. 기댓값 (2점).** 부등식이 모든 $\mathbf x$에서 성립하므로 양변을 $\mathbf x$에 대해 평균해도 방향이 유지되고, 기댓값의 선형성으로 합과 순서를 바꿀 수 있습니다.
$$E_{\text{COM}}=\E_{\mathbf x}\Big[\Big(\frac1M\sum_m\epsilon_m\Big)^2\Big]\le\frac1M\sum_m\E_{\mathbf x}[\epsilon_m^2]=E_{\text{AV}}$$
오차의 평균이 0이라는 가정이나 무상관 가정은 쓰지 않았습니다.

**검산.** 두 값의 차이는 $E_{\text{AV}}-E_{\text{COM}}=\E_{\mathbf x}\big[\frac1M\sum_m(\epsilon_m-\bar\epsilon)^2\big]\ge0$ ($\bar\epsilon=\frac1M\sum_m\epsilon_m$)으로, 모델들의 오차가 서로 다를수록(다양성) 위원회의 이득이 큽니다. 모든 $\epsilon_m$이 같으면 등호가 성립합니다.

관련: [[ch12:9.6|모델 평균]]` },
    ],
  },
  );
})();
