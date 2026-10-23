/* 실전 모의고사 X — 01–15단원 전 범위 종합. 두 단원 이상을 함께 써야 풀리는 문항으로 엮었습니다. 2026-10-23 추가. 연습문제와 겹치지 않는 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x10', roman: 'X', kind: '전 범위 종합', title: '전 범위 실전 모의고사', scopeText: '01–15 단원',
    desc: '전 범위를 두 단원 이상이 함께 필요한 문제로 엮었습니다. 가우시안 가능도에서 제곱오차와 역전파로, 사전분포에서 가중치 감쇠와 유효 파라미터 수로, 교차 엔트로피와 KL·온도, 유병률이 바뀐 분류기 출력의 베이즈 보정, Adam과 입력 정규화의 수렴, 드롭아웃의 규제 효과, 합성곱과 어텐션의 계산량, U-net, GPT 출력층의 기울기까지 다룹니다.',
    minutes: 120, plot: 'ecg',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 3, q: R`Which pairing of a medical-imaging AI task with its output layer and error function is **incorrect**?`,
        choices: [R`Bone-age assessment (hand X-ray → bone age): a single linear output + sum-of-squares error`, R`Automatic kidney segmentation: a two-class (kidney, background) softmax at each pixel + the sum of the per-pixel cross-entropies`, R`Low-dose PET denoising: a single softmax over all pixels of the output image, turning the pixel values into probabilities, compared with the standard-dose image by cross-entropy`, R`Detection of nodule, pneumothorax and cardiomegaly on chest X-rays: a sigmoid for each finding + the sum of the binary cross-entropies`], ans: 2,
        sol: R`
**핵심.** 오차함수는 “목표값이 어떤 분포를 따르는가”에서 나옵니다. 실수 목표는 가우시안 → 선형 출력 + 제곱오차, 서로 배타적인 클래스는 범주 분포 → 소프트맥스 + 교차 엔트로피(cross-entropy), 동시에 있을 수 있는 여러 소견은 독립 베르누이 → 시그모이드 + 이진 교차 엔트로피입니다.

1. 골연령은 실수이므로 회귀입니다. 가우시안 잡음 가정의 음의 로그가능도가 제곱오차합이고 출력은 선형이면 됩니다.
2. 분할은 화소마다의 분류이므로, 화소마다 클래스 확률의 합이 1인 소프트맥스를 쓰고 화소별 교차 엔트로피를 더합니다.
3. 잡음 제거는 저선량 영상에서 표준선량 영상으로 가는 **화소별 회귀**입니다. 화소값은 연속인 세기이지 “어느 화소인가”를 고르는 범주가 아닙니다. 모든 화소에 소프트맥스 하나를 씌우면 화소값의 합이 1로 묶여 밝기의 척도가 사라지고, 목표 영상도 확률분포가 아닙니다.
4. 세 소견은 한 영상에 함께 있을 수 있어 서로 독립인 이진 분류 세 개입니다.

**답.** ③

**보기 검토.** ① 옳음 — 실수 목표의 가우시안 회귀입니다. ② 옳음 — 화소마다의 범주 분포입니다. ③ 틀림 — 회귀 과제를 영상 전체에 대한 하나의 범주 분포로 잘못 모형화했습니다. 선형 출력 + 화소별 제곱오차가 알맞습니다. ④ 옳음 — 다중 레이블이므로 소프트맥스 하나가 아니라 시그모이드 $K$개입니다.

관련: [[ch01:0.4|의료 영상 AI의 응용]], [[ch07:6.4|오차함수와 출력 활성화]]
` },
      { ch: 'ch02', type: 'num', lv: 1, pts: 3, q: R`A polynomial model is fitted to $N=40$ training data points, and the minimum of the sum-of-squares error is $E(\mathbf w^\star)=\frac12\sum_n\{y(x_n,\mathbf w^\star)-t_n\}^2=0.45$. Assuming the targets follow $\N(t\mid y(x,\mathbf w),\sigma^2)$, find the maximum likelihood estimate $\sigma_{\text{ML}}$ of the noise standard deviation from the same data. (4 decimal places)`, ans: 'sqrt(2*0.45/40)', ansTex: R`\sigma_{\text{ML}}=\sqrt{2(0.45)/40}=0.15`,
        sol: R`
**핵심.** 가우시안 잡음 모델에서 $\mathbf w$의 최대가능도 해는 제곱오차합의 최소점 $\mathbf w^\star$이고, 그 위에서 잡음 분산의 최대가능도 해는 평균제곱잔차입니다.
$$\sigma^2_{\text{ML}}=\frac1N\sum_{n=1}^N\{y(x_n,\mathbf w^\star)-t_n\}^2=\frac{2E(\mathbf w^\star)}N$$

1. 로그가능도 $-\frac1{2\sigma^2}\sum_n\{y(x_n,\mathbf w)-t_n\}^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi)$에서 $\mathbf w$가 들어간 항은 첫째 항뿐이라 $\mathbf w_{\text{ML}}=\mathbf w^\star$입니다.
2. 잔차 제곱의 합은 $E$의 계수 $\frac12$을 되돌린 $2E(\mathbf w^\star)=0.9$입니다.
3. $\sigma^2_{\text{ML}}=0.9/40=0.0225$, $\sigma_{\text{ML}}=\sqrt{0.0225}=0.15$.

**답.** $\sigma_{\text{ML}}=0.15$

**자주 하는 실수.** 계수 $\frac12$을 잊고 $\sqrt{0.45/40}\approx0.1061$로 계산하는 것.

**검산.** $E_{\text{RMS}}=\sqrt{\frac1N\sum\{y-t\}^2}=\sqrt{2E/N}$이므로 훈련 자료의 RMS 오차가 곧 $\sigma_{\text{ML}}$이고, 단위도 목표값과 같습니다. 다만 모델을 같은 자료에 맞춘 뒤 잰 값이라 참 잡음보다 작게 나오기 쉽습니다. 최대가능도가 분산을 과소평가하는 편향이며 과적합이 심할수록 커집니다($M=9$, $N=10$이면 0까지 내려감).

관련: [[ch02:1.2b|RMS 오차]], [[ch04:2.3c|선형회귀의 확률적 해석]]
` },
      { ch: 'ch03', type: 'open', lv: 3, pts: 10, q: R`A chest X-ray classifier for tuberculosis screening was trained on a dataset with equal numbers of tuberculosis and normal images (training prevalence $\pi_0=0.5$). Its output $y(\mathbf x)$ exactly approximates the posterior probability $p_0(C=1\mid\mathbf x)$ under this training distribution (it is calibrated). The prevalence in the actual screening setting is $\pi=0.02$, and the class-conditional image distributions $p(\mathbf x\mid C)$ are assumed to be the same in the training data and in the field. (1) Using Bayes' theorem, express the posterior probability in the field $p(C=1\mid\mathbf x)$ in terms of $y,\pi_0,\pi$. (2) Find the posterior probability in the field for an image with $y=0.9$. (3) Find the threshold on $y$ required to declare a positive only when the posterior probability in the field is at least $0.5$, and explain what happens if the threshold is left at $0.5$, relating it to the positive predictive value of a screening test.`,
        rubric: R`
- (1) 훈련 분포에 베이즈 정리를 써서 가능도비 $\frac{p(\mathbf x\mid C=1)}{p(\mathbf x\mid C=0)}=\frac y{1-y}\cdot\frac{1-\pi_0}{\pi_0}$ — 3점
- (1) 현장 사전확률로 베이즈 정리를 다시 써서 $p(C=1\mid\mathbf x)$의 식 — 2점
- (2) $\frac{0.018}{0.116}\approx0.1552$ — 2점
- (3) 문턱 $y\ge0.98$ 유도 — 2점
- (3) 문턱 0.5의 결과(위양성 과다)와 기저율 해석 — 1점`,
        sol: R`
**핵심.** 분류기가 배운 것은 훈련 유병률이 섞인 사후확률입니다. 베이즈 정리로 사전확률을 떼어 내 클래스별 밀도의 비(가능도비)를 얻고, 현장의 유병률을 다시 곱해 정규화합니다.

1. 훈련 분포에서의 베이즈 정리는 $y=\frac{p(\mathbf x\mid1)\pi_0}{p(\mathbf x\mid1)\pi_0+p(\mathbf x\mid0)(1-\pi_0)}$입니다. $1-y$로 나누면 분모(증거)가 지워져
$$\frac y{1-y}=\frac{p(\mathbf x\mid1)}{p(\mathbf x\mid0)}\cdot\frac{\pi_0}{1-\pi_0}\ \Rightarrow\ \Lambda(\mathbf x)\equiv\frac{p(\mathbf x\mid1)}{p(\mathbf x\mid0)}=\frac y{1-y}\cdot\frac{1-\pi_0}{\pi_0}.$$
2. $p(\mathbf x\mid C)$가 현장에서도 같다는 가정 덕분에 같은 $\Lambda$를 현장의 사전확률과 함께 베이즈 정리에 넣을 수 있습니다:
$$p(C=1\mid\mathbf x)=\frac{\pi\Lambda}{\pi\Lambda+(1-\pi)}=\frac{y\,\pi/\pi_0}{y\,\pi/\pi_0+(1-y)(1-\pi)/(1-\pi_0)}.$$
3. (2) $\pi_0=0.5$이면 $\Lambda=y/(1-y)=9$이고 $p=\frac{0.02\times9}{0.02\times9+0.98}=\frac{0.18}{1.16}$, 같은 값으로 $\frac{0.9\times0.02}{0.9\times0.02+0.1\times0.98}=\frac{0.018}{0.116}\approx0.1552$입니다. 분류기가 0.9를 내도 현장에서 결핵일 확률은 약 16%입니다.
4. (3) $p\ge\frac12\iff\pi\Lambda\ge1-\pi\iff\Lambda\ge\frac{1-\pi}\pi=49$. $\pi_0=0.5$에서 $\Lambda=y/(1-y)$이므로 $\frac y{1-y}\ge49\iff y\ge\frac{49}{50}=0.98$.
5. 문턱을 0.5로 두면 $0.5\le y<0.98$인 영상, 곧 현장 사후확률이 $0.02$에서 $0.5$ 사이인 영상까지 모두 양성이 됩니다. 건강한 사람이 49배 많으므로 양성 판정의 대부분이 위양성이고 양성 예측도가 낮아집니다. 민감도가 높은 검사도 유병률이 낮으면 양성의 대부분이 위양성이라는 선별검사의 결론과 같은 현상(기저율 무시)입니다.

**검산.** $\pi=\pi_0$이면 식이 $p=y$로 돌아옵니다. $\mathbf x$ 대신 이진 검사 결과 $T=1$을 넣으면 $\Lambda=s/(1-c)$ (민감도 $s$, 특이도 $c$)이고, 식은 양성 예측도 $\frac{s\pi}{s\pi+(1-c)(1-\pi)}$가 됩니다.

관련: [[ch03:2.1b|베이즈 정리와 의료 선별검사]]
` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 4, q: R`After a linear regression is fitted by maximum likelihood, the residuals $y(x_n,\mathbf w_{\text{ML}})-t_n$ of four training data points are $0.2,\ -0.1,\ 0.3,\ -0.2$. Using the maximum likelihood estimate $\hat\sigma^2$ for the noise variance as well, find the negative log likelihood per data point $-\frac1N\ln p(\mathbf t\mid\mathbf x,\mathbf w_{\text{ML}},\hat\sigma^2)$ (in nats). (4 decimal places, include the sign)`, ans: '0.5*(1+ln(2*pi*0.045))', ansTex: R`\tfrac12\{1+\ln(2\pi\cdot0.045)\}\approx-0.1316`,
        sol: R`
**핵심.** 가우시안 잡음의 로그가능도
$$\ln p=-\frac1{2\sigma^2}\sum_n\{y(x_n,\mathbf w)-t_n\}^2-\frac N2\ln\sigma^2-\frac N2\ln(2\pi)$$
에 $\sigma^2_{\text{ML}}=\frac1N\sum_n\{\cdot\}^2$를 넣으면 첫째 항이 정확히 $-\frac N2$가 됩니다.

1. $\hat\sigma^2=\sigma^2_{\text{ML}}=\frac{0.04+0.01+0.09+0.04}4=\frac{0.18}4=0.045$.
2. $\sum_n\{\cdot\}^2=N\sigma^2_{\text{ML}}$이므로 첫째 항은 $-\frac1{2\sigma^2_{\text{ML}}}\cdot N\sigma^2_{\text{ML}}=-\frac N2$.
3. 따라서 $-\frac1N\ln p=\frac12+\frac12\ln\sigma^2_{\text{ML}}+\frac12\ln(2\pi)=\frac12\{1+\ln(2\pi\sigma^2_{\text{ML}})\}$.
4. $2\pi\times0.045=0.2827$, $\ln0.2827=-1.2632$, $\frac12(1-1.2632)\approx-0.1316$.

**답.** $\approx-0.1316$ 내트

**자주 하는 실수.** “음의 로그가능도는 양수”라고 생각해 부호를 바꾸는 것. 밀도는 1보다 클 수 있어(분산 0.045인 가우시안의 꼭대기 밀도는 $1/\sqrt{2\pi\cdot0.045}\approx1.881$) 로그밀도가 양수가 되고, 음의 로그가능도는 음수가 될 수 있습니다.

**검산.** 결과 $\frac12\{1+\ln(2\pi\sigma^2)\}$는 $\N(0,\sigma^2_{\text{ML}})$의 미분 엔트로피와 같은 식입니다. 최대가능도 해에서 잔차 하나의 평균 놀라움이 잔차 분포의 엔트로피가 되는 셈이고, $\sigma^2_{\text{ML}}=0.045<\frac1{2\pi e}\approx0.0585$이므로 음수가 나오는 것이 맞습니다.

관련: [[ch04:2.3c|선형회귀의 확률적 해석]], [[ch05:2.5|미분 엔트로피]]
` },
      { ch: 'ch05', type: 'mc', lv: 2, pts: 3, q: R`Which statement about the cross-entropy $-\sum_kt_k\ln y_k$ between the target distribution $\mathbf t$ of a classification network and its softmax output $\mathbf y$ is correct?`,
        choices: [R`$-\sum_kt_k\ln y_k=\KL(\mathbf t\Vert\mathbf y)-\mathrm H[\mathbf t]$`, R`If $\mathbf t$ is one-hot, then $\mathrm H[\mathbf t]=0$, so the cross-entropy equals $\KL(\mathbf t\Vert\mathbf y)$`, R`Since $-\sum_kt_k\ln y_k=-\sum_ky_k\ln t_k$, the roles of $\mathbf t$ and $\mathbf y$ may be interchanged`, R`Even for the soft target $\mathbf t=(0.9,\ 0.05,\ 0.05)$, the minimum value of the cross-entropy is 0`], ans: 1,
        sol: R`
**핵심.** KL 발산의 정의를 두 항으로 나누면
$$\KL(\mathbf t\Vert\mathbf y)=-\sum_kt_k\ln y_k-\Big(-\sum_kt_k\ln t_k\Big)\ \Rightarrow\ -\sum_kt_k\ln y_k=\mathrm H[\mathbf t]+\KL(\mathbf t\Vert\mathbf y).$$
$\mathrm H[\mathbf t]$는 모델과 무관하므로 교차 엔트로피 최소화는 KL 최소화, 곧 최대가능도와 같습니다.

1. 원-핫 $\mathbf t$는 한 성분만 1이고 $0\ln0=0$으로 두므로 $\mathrm H[\mathbf t]=0$, 교차 엔트로피 $=\KL(\mathbf t\Vert\mathbf y)$입니다.
2. 부드러운 목표에서는 $\KL\ge0$의 등호 조건 $\mathbf y=\mathbf t$에서 최솟값 $\mathrm H[\mathbf t]=-0.9\ln0.9-2(0.05\ln0.05)=0.0948+0.2996\approx0.3944$ 내트가 남습니다.

**답.** ②

**보기 검토.** ① 엔트로피의 부호가 틀렸습니다($+\mathrm H[\mathbf t]$). ② 정답입니다. ③ 교차 엔트로피와 KL은 비대칭입니다. 원-핫 $\mathbf t$에서는 $\ln0$이 나와 정의조차 되지 않습니다. ④ 최솟값은 0이 아니라 $\mathrm H[\mathbf t]\approx0.3944$입니다. 이 경우 훈련 손실이 0까지 내려가지 않는다고 학습이 덜 된 것은 아닙니다.

관련: [[ch05:2.5b|KL 발산]], [[ch07:6.4|오차함수와 출력 활성화]]
` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 4, q: R`The three class logits of a reading-assistant model are $\mathbf a=(\ln4,\ 0,\ 0)$. Let $p$ be the softmax distribution at temperature $T=1$, and let $q$ be the distribution at temperature $T=2$, $q_i=\exp(a_i/2)/\sum_j\exp(a_j/2)$. Find $\KL(p\Vert q)$ (in nats). (4 decimal places)`, ans: '(2/3)*ln(4/3)+(1/3)*ln(2/3)', ansTex: R`\tfrac23\ln\tfrac43+\tfrac13\ln\tfrac23\approx0.0566`,
        sol: R`
**핵심.** 온도를 올리면 로짓이 $1/T$배로 줄어 분포가 평평해집니다. 두 분포를 구한 뒤 이산 KL $\sum_ip_i\ln(p_i/q_i)$를 계산합니다.

1. $T=1$: $e^{\ln4}=4$, $e^0=1$이므로 $p=(\frac46,\frac16,\frac16)=(\frac23,\frac16,\frac16)$.
2. $T=2$: 로짓 $(\ln2,0,0)$, 지수 $(2,1,1)$이므로 $q=(\frac12,\frac14,\frac14)$.
3. $\KL(p\Vert q)=\frac23\ln\frac{2/3}{1/2}+2\cdot\frac16\ln\frac{1/6}{1/4}=\frac23\ln\frac43+\frac13\ln\frac23$.
4. $\frac23(0.2877)+\frac13(-0.4055)=0.1918-0.1352\approx0.0566$.

**답.** $\approx0.0566$ 내트

**자주 하는 실수.** 방향을 바꿔 $\KL(q\Vert p)\approx0.0589$를 계산하는 것. KL은 비대칭이라 값이 다릅니다.

**검산.** 교차 엔트로피 $-\sum_ip_i\ln q_i=\frac23\ln2+\frac13\ln4=\frac43\ln2=0.9242$에서 $\mathrm H[p]=0.8676$을 빼도 $0.0566$입니다. 또 $\mathrm H[q]=1.5$비트$=1.0397$ 내트$>\mathrm H[p]$로, 온도를 올리면 분포가 평평해져 엔트로피가 커진다는 성질과도 맞습니다.

관련: [[ch05:2.5b|KL 발산]], [[ch15:12.3|온도 표본 추출]]
` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 4, q: R`A line through the origin $y=wx$ is fitted to three measurements $(x,t)=(1,\ 0.9)$, $(2,\ 2.3)$, $(-1,\ -1.2)$. The noise is Gaussian with variance $\sigma^2=0.5$, and the prior distribution is $w\sim\N(0,s^2)$, $s^2=0.25$. Find $w_{\text{MAP}}$. (4 decimal places)`, ans: '6.7/(6+0.5/0.25)', ansTex: R`\tfrac{6.7}{6+2}=0.8375`,
        sol: R`
**핵심.** 음의 로그 사후분포
$$-\ln p(w\mid\mathcal D)=\frac1{2\sigma^2}\sum_n(wx_n-t_n)^2+\frac{w^2}{2s^2}+\text{const}$$
를 최소화합니다. $\sigma^2$을 곱하면 $\lambda=\sigma^2/s^2$인 $L_2$ 규제 최소제곱입니다.

1. 필요한 합: $\sum_nx_nt_n=0.9+4.6+1.2=6.7$, $\sum_nx_n^2=1+4+1=6$.
2. $w$로 미분해 0으로 두면 $\frac1{\sigma^2}\sum_nx_n(wx_n-t_n)+\frac w{s^2}=0$, 곧 $w\big(\sum_nx_n^2+\frac{\sigma^2}{s^2}\big)=\sum_nx_nt_n$. 1장의 $(\Phi^T\Phi+\lambda\mathbf I)\mathbf w=\Phi^T\mathbf t$를 $\Phi=(1,2,-1)^T$에 쓴 것과 같습니다.
3. $\lambda=0.5/0.25=2$, $w_{\text{MAP}}=\frac{6.7}{6+2}=0.8375$.

**답.** $w_{\text{MAP}}=0.8375$

**자주 하는 실수.** $\lambda=s^2/\sigma^2=0.5$로 뒤집어 $6.7/6.5\approx1.0308$을 얻는 것. 잡음이 클수록, 사전분포가 좁을수록 규제가 세져야 합니다.

**검산.** 정밀도 가중 평균으로도 구할 수 있습니다. 가능도는 $w$에 대해 평균 $w_{\text{ML}}=6.7/6=1.1167$, 분산 $v=\sigma^2/\sum_nx_n^2=0.08333$인 가우시안 모양이므로 $w_{\text{MAP}}=\frac{s^2}{s^2+v}w_{\text{ML}}=\frac{0.25}{0.3333}\times1.1167=0.75\times1.1167=0.8375$로 같습니다.

관련: [[ch06:2.6b|MAP 추정과 규제]], [[ch02:1.2c|규제와 모델 선택]]
` },
      { ch: 'ch07', type: 'mc', lv: 1, pts: 3, q: R`For which combination is the gradient $\partial E_n/\partial a_k$ of the single-sample error with respect to the output-unit pre-activation $a_k$ **not** equal to $y_k-t_k$?`,
        choices: [R`Linear output $y_k=a_k$ + sum-of-squares error $\frac12\sum_k(y_k-t_k)^2$`, R`Logistic sigmoid output + binary cross-entropy`, R`Softmax output + multiclass cross-entropy (1-of-$K$ targets)`, R`Logistic sigmoid output + squared error $\frac12(y-t)^2$`], ans: 3,
        sol: R`
**핵심.** 목표의 분포(가우시안, 베르누이, 범주 분포)의 음의 로그가능도를 오차로 쓰고 출력 활성화를 그 분포의 정준 연결로 고르면 언제나 $\partial E_n/\partial a_k=y_k-t_k$입니다. 짝이 맞지 않으면 활성화의 도함수가 남습니다.

1. ①: $y_k=a_k$이므로 $\partial E_n/\partial a_k=y_k-t_k$.
2. ②: $\sigma'=\sigma(1-\sigma)$가 교차 엔트로피의 분모 $y$, $1-y$와 약분되어 $y-t$.
3. ③: $\partial y_j/\partial a_k=y_j(\delta_{jk}-y_k)$와 $\sum_jt_j=1$로 $y_k-t_k$.
4. ④: $\frac{\partial E}{\partial a}=(y-t)\,\sigma'(a)=(y-t)\,y(1-y)$. 크게 틀린 예측($t=1$, $a\ll0$)에서 $y(1-y)\approx0$이라 기울기가 거의 사라져 학습이 느립니다.

**답.** ④

**보기 검토.** ①②③은 출력 활성화와 오차함수의 짝 표에 있는 세 경우로 모두 $y_k-t_k$입니다. ④만 짝이 어긋나 $y(1-y)$배가 붙습니다.

관련: [[ch07:6.4|오차함수와 출력 활성화]]
` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 3, q: R`In contrastive learning on chest X-rays, the cosine similarity between the anchor image and the positive example (a different augmentation of the same image) is $s^+=0.7$, and the similarities to three negative examples are $0.5,\ 0,\ -0.5$. Find $\partial E/\partial s^+$ for the InfoNCE loss $E$. (4 decimal places)`, ans: 'exp(0.7)/(exp(0.7)+exp(0.5)+1+exp(-0.5))-1', ansTex: R`p^+-1\approx-0.6178`,
        sol: R`
**핵심.** InfoNCE는 양성 유사도를 정답 클래스의 로짓, 음성 유사도들을 오답 로짓으로 둔 소프트맥스 교차 엔트로피입니다. 따라서 소프트맥스 + 교차 엔트로피의 기울기 $y_k-t_k$를 그대로 씁니다.
$$E=-\ln\frac{e^{s^+}}{e^{s^+}+\sum_ne^{s_n^-}},\qquad \frac{\partial E}{\partial s^+}=p^+-1,\qquad \frac{\partial E}{\partial s_n^-}=p_n^-$$

1. 지수: $e^{0.7}=2.0138$, $e^{0.5}=1.6487$, $e^0=1$, $e^{-0.5}=0.6065$, 합 $5.2690$.
2. $p^+=2.0138/5.2690=0.3822$, 음성 쪽 $p^-=(0.3129,\ 0.1898,\ 0.1151)$.
3. $\partial E/\partial s^+=0.3822-1=-0.6178$.
4. 경사하강은 $s^+$를 키우고(기울기가 음수), 음성 유사도는 $p_n^-$에 비례해 줄입니다. 가장 비슷한 음성(0.5)이 가장 세게 밀려납니다.

**답.** $\approx-0.6178$

**자주 하는 실수.** 손실값 $-\ln0.3822\approx0.9618$을 답으로 쓰거나, 부호를 $1-p^+$로 뒤집는 것.

**검산.** 소프트맥스 기울기의 합은 0이어야 합니다: $-0.6178+0.3129+0.1898+0.1151=0$.

관련: [[ch07:6.3c|대조 학습과 InfoNCE]], [[ch10:8.1|단층 신경망의 기울기]]
` },
      { ch: 'ch08', type: 'num', lv: 3, pts: 4, q: R`Radiologists assigned different labels $t=1$ and $t=0$ to two images with the same finding (input $x=1$). The model $y=\sigma(wx)$ is trained with the cross-entropy $E(w)=-\sum_n\{t_n\ln y_n+(1-t_n)\ln(1-y_n)\}$. Starting from $w^{(0)}=0.05$, find $w^{(2)}$ after two Adam updates ($\eta=0.1$, $\beta_1=0.9$, $\beta_2=0.99$, $\delta\approx0$, $s^{(0)}=r^{(0)}=0$). (4 decimal places)`, ans: '-0.05+0.1/19', ansTex: R`w^{(2)}=-0.05+\tfrac{0.1}{19}\approx-0.0447`,
        sol: R`
**핵심.** 먼저 오차의 기울기를 구합니다. 시그모이드 + 교차 엔트로피이므로 표본마다 $\partial E_n/\partial a=y_n-t_n$이고, $a=wx$에서 $\partial a/\partial w=x=1$입니다.
$$\frac{dE}{dw}=\sum_n(y_n-t_n)x_n=(\sigma(w)-1)+(\sigma(w)-0)=2\sigma(w)-1=\tanh(w/2)$$
최소점은 $w=0$ ($y=0.5$)이고, 기울기는 홀함수라 $g(-w)=-g(w)$입니다.

1. $\tau=1$: $g^{(1)}=\tanh(0.025)=0.02499\equiv g$. $s^{(1)}=0.1g$, $r^{(1)}=0.01g^2$, 보정하면 $\hat s=g$, $\hat r=g^2$이라 $\Delta w=-\eta\operatorname{sign}(g)=-0.1$. $w^{(1)}=-0.05$로 최소점을 지나칩니다.
2. $\tau=2$: $g^{(2)}=\tanh(-0.025)=-g$. $s^{(2)}=0.9(0.1g)+0.1(-g)=-0.01g$, $r^{(2)}=0.99(0.01g^2)+0.01g^2=0.0199g^2$.
3. 보정: $\hat s^{(2)}=\frac{-0.01g}{1-0.81}=-\frac g{19}$, $\hat r^{(2)}=\frac{0.0199g^2}{1-0.9801}=g^2$.
4. $\Delta w^{(2)}=-\eta\frac{-g/19}{\lvert g\rvert}=+\frac{0.1}{19}=0.005263$, $w^{(2)}=-0.05+0.005263=-0.04474$.

**답.** $w^{(2)}\approx-0.0447$

**자주 하는 실수.** Adam의 걸음이 늘 $\eta$라고 보고 $w^{(2)}=0.05$로 되돌아온다고 답하는 것. 1차 모멘트 $s$가 첫 기울기를 기억해 되돌림이 작습니다. 편향 보정을 빼면 $\Delta w^{(2)}=0.1\times0.00025/0.003526\approx0.0071$, $w^{(2)}\approx-0.0429$로 달라집니다.

**검산.** 같은 $\eta$의 경사하강법은 기울기 크기 0.025에 비례해 움직여 $w^{(2)}\approx0.0451$로 거의 제자리입니다. Adam의 걸음이 기울기의 척도와 무관하다는 성질이 확인되고, 그 대가로 최소점 근처에서는 걸음이 커서 넘어갑니다.

관련: [[ch08:7.3d|AdaGrad, RMSProp, Adam]], [[ch07:6.4|오차함수와 출력 활성화]]
` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 4, q: R`A linear regression with two inputs, $y=w_1x_1+w_2x_2$, is trained by batch gradient descent on $E(\mathbf w)=\frac12\sum_{n=1}^N(y_n-t_n)^2$. $N=100$, and over the training data the two inputs have zero mean, are uncorrelated, and have standard deviations 10 for $x_1$ (age, years) and 0.2 for $x_2$ (serum creatinine, mg/dL). With the learning rate set to $\eta=1/\lambda_{\max}$ ($\lambda_{\max}$: the largest eigenvalue of the Hessian), find the minimum number of iterations after which $\lvert w_2-w_2^\star\rvert$ is at most 1% of its initial value. (integer)`, ans: '11511', ansTex: R`\lceil\ln0.01/\ln0.9996\rceil=11511`,
        sol: R`
**핵심.** 선형 모델의 제곱오차는 정확히 이차식이고 헤시안은 $\mathbf H=\sum_n\mathbf x_n\mathbf x_n^T$입니다. 고유방향 성분 $w_i-w_i^\star$는 매 걸음 $(1-\eta\lambda_i)$배가 되므로, 입력의 척도가 곧 곡률이 되어 수렴 속도를 정합니다.

1. 평균 0, 무상관이므로 $\sum_nx_{n1}x_{n2}=0$이고 $\sum_nx_{ni}^2=N\sigma_i^2$입니다. $\mathbf H=\diag(100\cdot10^2,\ 100\cdot0.2^2)=\diag(10^4,\ 4)$이고 고유방향은 두 좌표축입니다.
2. $\eta=1/\lambda_{\max}=10^{-4}$. $w_1$ 성분은 $1-\eta\lambda_1=0$배로 한 번에 끝나지만, $w_2$ 성분은 매번 $1-10^{-4}\times4=0.9996$배입니다.
3. $0.9996^\tau\le0.01\iff\tau\ge\frac{\ln0.01}{\ln0.9996}=\frac{-4.6052}{-0.00040008}=11510.6$이므로 $\tau=11511$.

**답.** 11,511번

**자주 하는 실수.** $\ln(1-x)\approx-x$로 근사해 $11{,}513$을 얻는 것은 괜찮지만, 학습률을 상한 $2/\lambda_{\max}$로 두면 $w_1$ 성분이 매번 $-1$배가 되어 진동만 하고 줄지 않습니다.

**검산.** 입력을 훈련 자료의 평균·표준편차로 표준화하면 $\mathbf H=100\,\mathbf I$가 되어 곡률 비 $\lambda_{\max}/\lambda_{\min}$이 $2500$에서 $1$로 바뀌고, $\eta=0.01$에서 두 성분이 모두 한 번에 0이 됩니다. 입력 정규화가 오차 곡면의 좁은 골짜기를 둥글게 만든다는 뜻입니다.

관련: [[ch09:7.4|입력 정규화]], [[ch08:7.3|학습률과 수렴]]
` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 10, q: R`A small network that predicts a real-valued target: one input $x$, two ReLU hidden units $z_j=\ReLU(a_j)$, $a_j=w_j^{(1)}x+b_j^{(1)}$, and a linear output $y=\sum_jw_j^{(2)}z_j+b^{(2)}$. The current parameters are $\mathbf w^{(1)}=(1,\ -1)$, $\mathbf b^{(1)}=(0,\ 1)$, $\mathbf w^{(2)}=(2,\ 1)$, $b^{(2)}=0.5$, and the training data are $(x,t)=(2,\ 4)$, $(-1,\ 3)$. (1) Assuming the targets follow $\N(t\mid y(x,\mathbf w),\sigma^2)$ and the data are i.i.d., write down the negative log likelihood, and show that its $\mathbf w$-gradient is $1/\sigma^2$ times the gradient of $E(\mathbf w)=\frac12\sum_n(y_n-t_n)^2$ and that the $\delta$ of the output unit is $(y_n-t_n)/\sigma^2$. (2) Use backpropagation to find $\partial E/\partial w_1^{(1)}$ and $\partial E/\partial w_2^{(1)}$. (3) Find the maximum likelihood estimate $\hat\sigma^2$ of the noise variance at the current parameters, and find $\partial/\partial w_1^{(1)}$ of the negative log likelihood when $\sigma^2=\hat\sigma^2$. Also explain why $\sigma^2$ does not change the optimum for $\mathbf w$.`,
        rubric: R`
- (1) 음의 로그가능도와 $\mathbf w$가 들어간 항 — 2점
- (1) 기울기의 $1/\sigma^2$배, $\delta=(y_n-t_n)/\sigma^2$ — 1점
- (2) 순전파: 사전활성, 은닉 출력, $y_n$, 잔차 — 2점
- (2) 은닉 $\delta_j=h'(a_j)w_j^{(2)}\delta$의 역전파(ReLU의 0·1)와 두 기울기 $2$, $0.5$ — 3점
- (3) $\hat\sigma^2=0.25$와 기울기 $8$ — 1점
- (3) $\sigma^2$이 최적점을 바꾸지 않는 이유 — 1점`,
        sol: R`
**핵심.** 가우시안 잡음의 음의 로그가능도는 제곱오차합에 $1/\sigma^2$을 곱하고 상수를 더한 것이므로, 역전파는 제곱오차의 출발점 $\delta=y-t$에서 시작하면 되고 $\sigma^2$은 기울기의 척도만 바꿉니다.

(1) $-\ln p(\mathbf t\mid\mathbf x,\mathbf w,\sigma^2)=\frac1{2\sigma^2}\sum_n(y_n-t_n)^2+\frac N2\ln\sigma^2+\frac N2\ln(2\pi)=\frac1{\sigma^2}E(\mathbf w)+\frac N2\ln(2\pi\sigma^2)$. 둘째 항은 $\mathbf w$와 무관하므로 $\nabla_{\mathbf w}(-\ln p)=\frac1{\sigma^2}\nabla E$입니다. 선형 출력 $y=a$에서 표본 하나의 $\delta=\partial(-\ln p_n)/\partial a=(y_n-t_n)/\sigma^2$입니다.

(2) 순전파.
- $n=1$ ($x=2$): $a=(2,\ -1)$, $z=(2,\ 0)$, $y=2\cdot2+1\cdot0+0.5=4.5$, $\delta=y-t=0.5$.
- $n=2$ ($x=-1$): $a=(-1,\ 2)$, $z=(0,\ 2)$, $y=0+2+0.5=2.5$, $\delta=-0.5$.

역전파는 $\delta_j=h'(a_j)\,w_j^{(2)}\,\delta$ (ReLU: $a_j>0$이면 $h'=1$, 아니면 0), $\partial E_n/\partial w_j^{(1)}=\delta_jx_n$입니다.
- $n=1$: $\delta_1=1\cdot2\cdot0.5=1$, $\delta_2=0$ (꺼진 유닛) → 기여 $(1\cdot2,\ 0)=(2,\ 0)$.
- $n=2$: $\delta_1=0$, $\delta_2=1\cdot1\cdot(-0.5)=-0.5$ → 기여 $(0,\ (-0.5)(-1))=(0,\ 0.5)$.

합하면 $\partial E/\partial w_1^{(1)}=2$, $\partial E/\partial w_2^{(1)}=0.5$입니다. 은닉 유닛마다 자기가 켜진 표본에서만 기울기를 받습니다.

(3) $\mathbf w$를 고정하고 로그가능도를 $\sigma^2$으로 미분하면 $\hat\sigma^2=\frac1N\sum_n(y_n-t_n)^2=\frac{0.25+0.25}2=0.25$입니다. 이때 $\partial(-\ln p)/\partial w_1^{(1)}=\frac1{0.25}\times2=8$.
$\sigma^2$은 $E(\mathbf w)$ 앞의 양수 배율이라 $\nabla E=\mathbf 0$인 점, 곧 최적의 $\mathbf w$를 바꾸지 못하고 경사하강법의 실질 학습률만 $1/\sigma^2$배로 바꿉니다. 그래서 먼저 제곱오차합으로 $\mathbf w^\star$를 찾고, $\sigma^{2\star}$는 그 뒤에 잔차로 한 번 계산합니다.

**검산.** $w_1^{(1)}$을 $\pm10^{-5}$ 바꾼 중앙 차분은 $2.0000$, $w_2^{(1)}$은 $0.5000$으로 역전파 값과 같습니다. 출력 편향의 기울기는 $\sum_n\delta_n=0.5-0.5=0$입니다.

관련: [[ch10:8.1b|일반 피드포워드망과 역전파]], [[ch07:6.4|오차함수와 출력 활성화]]
` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 3, q: R`In regression with Gaussian noise ($\sigma^2=0.2$), MAP estimation is performed with a prior distribution $\N(w_i\mid0,\ s^2)$, $s^2=0.1$, on each weight. Use the quadratic approximation near the minimum of the sum-of-squares error $E(\mathbf w)=\frac12\sum_n\{y(\mathbf x_n,\mathbf w)-t_n\}^2$, whose Hessian eigenvalues are $8,\ 2,\ 0.5$, and measure the effective number of parameters by the sum of the shrinkage factors along the eigendirections, $\gamma=\sum_j\frac{\lambda_j}{\lambda_j+\lambda}$. Find $\gamma$. (1 decimal place)`, ans: '8/10+2/4+0.5/2.5', ansTex: R`0.8+0.5+0.2=1.5`,
        sol: R`
**핵심.** 가우시안 사전분포의 MAP은 $\frac12\sum_n\{\cdot\}^2+\frac\lambda2\mathbf w^T\mathbf w$ ($\lambda=\sigma^2/s^2$)의 최소화이고, 이차 오차에서 가중치 감쇠는 헤시안 고유방향마다 $\hat w_j=\frac{\lambda_j}{\lambda_j+\lambda}w_j^\star$로 줄입니다.

1. $\lambda=\sigma^2/s^2=0.2/0.1=2$.
2. 방향별 축소 비율: $\frac8{10}=0.8$, $\frac24=0.5$, $\frac{0.5}{2.5}=0.2$.
3. $\gamma=0.8+0.5+0.2=1.5$.
4. 모수는 3개이지만 곡률이 큰 방향은 거의 남고 둔감한 방향($\lambda_j=0.5<\lambda$)은 80% 눌려, 자료가 실제로 정하는 모수는 약 1.5개입니다.

**답.** $\gamma=1.5$

**자주 하는 실수.** $\lambda=s^2/\sigma^2=0.5$로 뒤집으면 $\gamma\approx2.24$, 잡음 분산을 빼고 $\lambda=1/s^2=10$을 $E$의 헤시안과 섞으면 $\gamma\approx0.66$이 됩니다.

**검산.** 음의 로그 사후분포 $\frac1{\sigma^2}E+\frac1{2s^2}\mathbf w^T\mathbf w$로 바로 계산하면 자료 항의 곡률이 $\lambda_j/\sigma^2=(40,\ 10,\ 2.5)$, 규제 계수가 $1/s^2=10$이라 비율이 $\frac{40}{50},\frac{10}{20},\frac{2.5}{12.5}$로 같습니다.

관련: [[ch11:9.2|가중치 감쇠]], [[ch06:2.6b|MAP 추정과 규제]]
` },
      { ch: 'ch11', type: 'mc', lv: 2, pts: 3, q: R`For a transformation $T$, a segmentation network $S$ and a classification network $C$, which description of equivariance and invariance is **incorrect**?`,
        choices: [R`A kidney segmentation network should satisfy $S(T(I))=T(S(I))$ (translation equivariance), and convolutional layers have this property by construction`, R`A network classifying the presence or absence of pneumothorax should satisfy $C(T(I))=C(I)$ (invariance), which is obtained by placing pooling after the equivariant convolutional layers`, R`For self-attention without positional encoding, permuting the order of the input tokens permutes the outputs in the same way (permutation equivariance)`, R`Since classification of radiology-report sentences should not depend on word order, removing positional encoding to preserve permutation symmetry is the appropriate inductive bias`], ans: 3,
        sol: R`
**핵심.** 등변성은 입력을 바꾸면 출력이 대응하게 바뀌는 성질 $S(T(I))=\tilde T(S(I))$이고, 불변성은 출력 쪽 변환이 항등인 특수한 경우 $C(T(I))=C(I)$입니다. 과제가 실제로 가진 대칭만 구조에 넣어야 귀납적 편향이 도움이 됩니다.

1. 분할에서는 장기를 옮기면 분할 지도도 따라 옮겨져야 하고, 같은 커널을 모든 위치에 쓰는 합성곱이 그 성질을 줍니다.
2. 분류는 병변이 어디 있든 같아야 하므로, 등변인 특징 맵을 풀링으로 요약해 (근사적) 불변성을 얻습니다.
3. 셀프 어텐션은 $\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Attention}(\mathbf X)$라 토큰을 순서 없는 집합으로 봅니다.
4. 그런데 문장의 뜻은 순서에 달려 있습니다. “결절 없음, 기흉 있음”과 “결절 있음, 기흉 없음”은 토큰이 같고 순서만 달라 정반대 소견입니다. 순서는 이 과제의 대칭이 아니므로 위치 부호화로 순열 대칭을 깨야 합니다.

**답.** ④

**보기 검토.** ① 옳음 — 평행이동 등변입니다. ② 옳음 — 등변성에 풀링을 더해 불변성을 얻습니다. ③ 옳음 — 순열 등변성입니다. ④ 틀림 — 순서에 민감한 과제에 순열 불변을 강요하면 필요한 정보를 버립니다(교재의 “The food was bad, not good at all.” 예와 같은 구조).

관련: [[ch11:9.1b|대칭, 불변성, 등변성]], [[ch15:12.1d|위치 부호화]]
` },
      { ch: 'ch12', type: 'open', lv: 3, pts: 10, q: R`Input dropout is applied to a linear regression output: $y=\sum_{i=1}^Dw_iR_ix_i$, where the masks $R_i$ are mutually independent and equal 1 with probability $\rho$ and 0 with probability $1-\rho$. The target is $t$. (1) Find $\E_R[y]$ and $\Var_R[y]$. (2) Show that $\E_R[(y-t)^2]=(\rho\,\mathbf w^T\mathbf x-t)^2+\rho(1-\rho)\sum_iw_i^2x_i^2$, and state what kind of regularized least squares the expected error over the whole data set $\{(\mathbf x_n,t_n)\}$, $\E_R\big[\frac12\sum_n(y_n-t_n)^2\big]$ (with a new mask drawn for each sample), becomes when rewritten in terms of the inference weights $\tilde{\mathbf w}=\rho\mathbf w$. (3) For $\mathbf w=(2,\ -1)$, $\mathbf x=(1,\ 3)$, $\rho=0.5$, $t=1$, list all four subnetworks to verify (1) and (2), and show numerically that for $\sigma(y)$, with a logistic sigmoid applied to the output, “the full network with its weights multiplied by $\rho$” is not equal to the average over the subnetworks.`,
        rubric: R`
- (1) $\E[R_i]=\rho$, $\E[R_iR_j]=\rho^2+\rho(1-\rho)\delta_{ij}$로 평균과 분산 — 3점
- (2) $\E[(y-t)^2]=(\E[y]-t)^2+\Var[y]$ 분해 — 2점
- (2) $\tilde{\mathbf w}$로 바꿔 계수 $\lambda_i=\frac{1-\rho}\rho\sum_nx_{ni}^2$인 이차 규제 — 2점
- (3) 부분망 네 개로 평균 $-0.5$, 기대 제곱오차 $5.5$ 확인 — 2점
- (3) 시그모이드: 부분망 평균 $0.4243$과 $\sigma(-0.5)=0.3775$ 비교 — 1점`,
        sol: R`
**핵심.** 드롭아웃 학습은 마스크 분포에 대한 기대 오차를 확률적으로 최소화하는 것입니다. 선형 모델에서는 그 기대값을 닫힌 꼴로 구할 수 있고, 분산 항이 규제로 나타납니다.

(1) $R_i$는 베르누이라 $\E[R_i]=\rho$이고, $R_i^2=R_i$이므로 $\E[R_i^2]=\rho$, 독립이면 $\E[R_iR_j]=\rho^2$ ($i\ne j$)입니다. 곧 $\E[R_iR_j]=\rho^2+\rho(1-\rho)\delta_{ij}$.
$\E[y]=\sum_iw_ix_i\E[R_i]=\rho\,\mathbf w^T\mathbf x$.
$\Var[y]=\E[y^2]-\E[y]^2=\sum_{i,j}w_iw_jx_ix_j\{\E[R_iR_j]-\rho^2\}=\rho(1-\rho)\sum_iw_i^2x_i^2$.

(2) 어떤 확률변수든 $\E[(y-t)^2]=\E[(y-\E y)^2]+2(\E y-t)\E[y-\E y]+(\E y-t)^2=\Var[y]+(\E[y]-t)^2$이고(가운데 항은 0), (1)을 넣으면 주어진 식입니다.
표본마다 더하고 $\mathbf w=\tilde{\mathbf w}/\rho$를 넣으면
$$\E_R\Big[\frac12\sum_n(y_n-t_n)^2\Big]=\frac12\sum_n(\tilde{\mathbf w}^T\mathbf x_n-t_n)^2+\frac12\sum_i\lambda_i\tilde w_i^2,\qquad \lambda_i=\frac{1-\rho}\rho\sum_nx_{ni}^2.$$
추론에 쓰는 망($\tilde{\mathbf w}$)의 최소제곱에 가중치마다 계수가 다른 $L_2$ 규제가 붙은 꼴입니다. 계수는 그 입력의 제곱합에 비례하고, 입력을 표준화해 $\sum_nx_{ni}^2=N$이면 보통의 가중치 감쇠 $\lambda=N\frac{1-\rho}\rho$가 됩니다. 교재의 “최소제곱 선형회귀에서 드롭아웃은 변형된 이차 규제와 같다”가 이것입니다.

(3) $(R_1,R_2)$ 네 경우가 각각 확률 $\frac14$입니다.

| $(R_1,R_2)$ | $(0,0)$ | $(1,0)$ | $(0,1)$ | $(1,1)$ |
|---|---|---|---|---|
| $y$ | $0$ | $2$ | $-3$ | $-1$ |
| $(y-1)^2$ | $1$ | $1$ | $16$ | $4$ |
| $\sigma(y)$ | $0.5$ | $0.8808$ | $0.0474$ | $0.2689$ |

평균 $y=(0+2-3-1)/4=-0.5$로 $\rho\,\mathbf w^T\mathbf x=0.5(2-3)$과 같습니다. 기대 제곱오차는 $22/4=5.5$이고 식으로는 $(-0.5-1)^2+0.25(4+9)=2.25+3.25=5.5$입니다.
선형 출력이면 $\rho$를 곱한 전체 망의 출력 $-0.5$가 네 부분망의 평균과 **정확히** 같습니다. 그러나 시그모이드를 씌우면 부분망 평균은 $(0.5+0.8808+0.0474+0.2689)/4=0.4243$인데 전체 망은 $\sigma(-0.5)=0.3775$입니다. 비선형 출력에서 가중치 배율 규칙은 근사일 뿐이고, 정확한 평균에 가까이 가려면 몬테카를로 드롭아웃처럼 마스크를 여러 번 뽑아 평균합니다.

관련: [[ch12:9.6b|드롭아웃]], [[ch11:9.2|가중치 감쇠]]
` },
      { ch: 'ch13', type: 'mc', lv: 1, pts: 3, q: R`When batch normalization is applied to the output of a convolutional layer for a minibatch of $K$ images of size $H\times W$ with $C$ channels, which method is appropriate, and for what reason?`,
        choices: [R`For each channel, compute a single mean and variance from the $KHW$ values over all images in the minibatch and all spatial positions, and also use one $\gamma_c,\beta_c$ per channel — the normalization does not depend on position, so translation equivariance is preserved`, R`For each position $(i,j)$ and channel, compute a separate mean and variance from $K$ values — normalizing each position differently also corrects edge effects and strengthens equivariance`, R`For each image, compute the mean and variance from the values over all channels and positions of that image — not depending on other images is the definition of batch normalization`, R`Convolutional layers share parameters, so they need no normalization; batch normalization is used only in fully connected layers`], ans: 0,
        sol: R`
**핵심.** 배치 정규화는 유닛마다 미니배치의 예제들에 걸쳐 평균·분산을 구합니다. 합성곱층에서는 한 채널의 모든 위치가 같은 커널을 공유하는 “같은 특징”이므로, 통계도 위치를 가리지 않고 함께 구해야 특징 맵이 위치와 무관하게 처리됩니다.

1. 채널 $c$의 값 $a_{n,i,j,c}$ ($n\le K$, $i\le H$, $j\le W$) $KHW$개로 $\mu_c$, $\sigma_c^2$을 구하고 $\tilde a=\gamma_c\hat a+\beta_c$로 되돌립니다.
2. 위치마다 다른 평균·분산·$\gamma,\beta$를 쓰면, 같은 무늬가 다른 위치에 나타났을 때 다른 값으로 정규화되어 평행이동 등변성이 깨지고 모수도 $HW$배로 늘어납니다.

**답.** ①

**보기 검토.** ① 정답입니다. ② 위치마다의 정규화는 등변성을 오히려 깨뜨립니다. ③ 한 예제 안에서 통계를 구하는 것은 층 정규화 쪽의 생각이지 배치 정규화가 아닙니다. ④ 합성곱망(CNN)이 배치 정규화의 주 사용처입니다. 모수 공유와 활성값의 척도 문제는 별개입니다.

관련: [[ch13:10.2b|합성곱 연산과 평행이동 등변성]], [[ch09:7.4b|배치 정규화]]
` },
      { ch: 'ch13', type: 'num', lv: 3, pts: 4, q: R`A feature map of a chest CT has $32\times32$ positions and $D=256$ channels. Compare (A) a $3\times3$ convolutional layer with same padding ($256\to256$) and (B) multi-head self-attention that treats the $N=1024$ positions as $D$-dimensional tokens ($H=8$, $D_k=D_v=32$, including $\mathbf W^{(o)}$). Counting one matrix product $(a\times b)(b\times c)$ as $abc$ multiplications and ignoring biases, softmax and divisions, find the ratio of the number of multiplications in (B) to that in (A). (fraction or decimal)`, ans: '4/3', ansTex: R`\tfrac{4D+2N}{9D}=\tfrac43\approx1.3333`,
        sol: R`
**핵심.** 합성곱은 위치마다 같은 $3\times3\times D\to D$ 연산을 하므로 위치 수 $N$에 선형이고, 셀프 어텐션은 투영($ND^2$ 꼴)에 더해 모든 토큰 쌍의 점수와 가중합($N^2D$ 꼴)이 있습니다.

1. (A) 출력 위치 $N$개 × 출력 채널 $D$개 × 입력 $3\cdot3\cdot D$개: $9ND^2=9\cdot1024\cdot256^2=6.040\times10^8$.
2. (B) 머리마다 $\mathbf Q_h,\mathbf K_h,\mathbf V_h$가 $(N\times D)(D\times32)$ 세 번이고 8머리 합이 $3ND^2$. 점수 $\mathbf Q_h\mathbf K_h^T$는 $N\cdot32\cdot N$, 8머리 합 $N^2D$. 가중합 $\mathbf A_h\mathbf V_h$도 $N^2D$. 출력 투영 $ND^2$. 합 $4ND^2+2N^2D=2.684\times10^8+5.369\times10^8=8.053\times10^8$.
3. 비: $\frac{4ND^2+2N^2D}{9ND^2}=\frac{4D+2N}{9D}=\frac{1024+2048}{2304}=\frac43$.

**답.** $\frac43\approx1.3333$배

**검산.** 모수는 반대입니다. 합성곱 $9D^2=589{,}824$개, 어텐션 $4D^2=262{,}144$개로 합성곱이 $2.25$배 많습니다. 어텐션의 모수는 $N$과 무관하지만 곱셈은 $N^2$으로 늘어, 특징 맵이 $64\times64$ ($N=4096$)이면 비가 $\frac{1024+8192}{2304}=4$로 커집니다. 합성곱은 국소성으로 계산을 아끼고, 어텐션은 그 비용으로 한 층에서 맵 전체를 봅니다.

관련: [[ch13:10.2d|다채널 합성곱]], [[ch15:12.1c|멀티헤드 어텐션과 트랜스포머 층]]
` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 3, q: R`The last stage of a U-net decoder for liver CT segmentation: a $256\times256\times64$ feature map upsampled by transpose convolution is concatenated through a skip connection with the encoder feature map of the same resolution ($256\times256\times64$), and then a $3\times3$ convolution ($\to64$ channels, same padding) and a $1\times1$ convolution ($\to3$ channels: liver, tumor, background) are applied in turn. Find the total number of parameters (including biases) of the two convolutional layers. (integer)`, ans: '(9*128+1)*64+(64+1)*3', ansTex: R`1153\cdot64+65\cdot3=73{,}987`,
        sol: R`
**핵심.** 합성곱층의 모수는 $(M^2C_{\text{IN}}+1)C_{\text{OUT}}$입니다. U-net의 건너뛰는 연결은 잔차 연결처럼 더하지 않고 채널을 **이어 붙이므로**, 다음 층의 입력 채널 수가 두 맵의 채널 수의 합이 됩니다.

1. 이어 붙인 입력 채널: $64+64=128$ (공간 크기가 같아야 이어 붙일 수 있습니다).
2. $3\times3$ 합성곱: $(9\cdot128+1)\cdot64=1153\cdot64=73{,}792$.
3. $1\times1$ 합성곱(화소마다 채널 벡터에 같은 선형변환): $(64+1)\cdot3=195$.
4. 합 $73{,}792+195=73{,}987$.

**답.** 73,987개

**자주 하는 실수.** 이어 붙이기를 덧셈으로 착각해 입력을 64채널로 두면 $(9\cdot64+1)\cdot64+195=37{,}123$이 됩니다. 출력 3채널에는 화소마다 소프트맥스를 씌우고 화소별 교차 엔트로피를 더해 학습하며, 이 부분에는 모수가 없습니다.

**검산.** 모수는 영상 크기와 무관합니다. 같은 망을 $512\times512$ 영상에 써도 모수는 그대로이고 출력 지도만 커집니다.

관련: [[ch14:10.5b|전치 합성곱, 완전 합성곱망, U-net]], [[ch13:10.2d|다채널 합성곱과 1×1 합성곱]]
` },
      { ch: 'ch15', type: 'num', lv: 1, pts: 3, q: R`When a radiology-report generation decoder produces the sentence “No left lung nodule” (4 tokens), the probabilities of the tokens, each given the preceding tokens, are $0.2,\ 0.5,\ 0.8,\ 0.9$ in order. How many bits is the information content $-\log_2p(\mathbf x_1,\dots,\mathbf x_4)$ of the whole sentence? (4 decimal places)`, ans: '-ln(0.2*0.5*0.8*0.9)/ln(2)', ansTex: R`-\log_20.072\approx3.7959`,
        sol: R`
**핵심.** 자기회귀 분해(곱의 규칙을 거듭 쓴 것) $p(\mathbf x_1,\dots,\mathbf x_N)=\prod_np(\mathbf x_n\mid\mathbf x_1,\dots,\mathbf x_{n-1})$와 정보량 $h=-\log_2p$를 씁니다. 곱의 로그는 합이므로 문장의 정보량은 토큰별 정보량의 합입니다.

1. 결합확률: $0.2\times0.5\times0.8\times0.9=0.072$.
2. 토큰별 정보량: $-\log_2$을 차례로 취하면 $2.3219,\ 1,\ 0.3219,\ 0.1520$비트.
3. 합 $3.7959$비트 $=-\log_20.072$.

**답.** $\approx3.7959$비트

**자주 하는 실수.** 확률을 더하거나 평균내는 것. 또 GPT의 학습 손실은 같은 양을 자연로그로 잰 $-\ln0.072\approx2.6311$ 내트(토큰당 평균 $0.6578$ 내트)입니다. 비트와 내트는 $\ln2$배 차이입니다.

**검산.** 확률 0.5인 둘째 토큰은 정확히 1비트이고, 확신이 큰 토큰(0.9)은 정보가 작습니다. 문장의 음의 로그확률을 최소화하는 것이 곧 다음 토큰 교차 엔트로피 학습입니다.

관련: [[ch15:12.2b|단어 주머니와 자기회귀 모델]], [[ch05:2.5|정보량과 엔트로피]]
` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 3, q: R`In a radiology-report transformer with vocabulary size $K=30{,}000$ and embedding dimension $D=512$, the token embeddings $\mathbf v_n=\mathbf E\mathbf x_n$ ($\mathbf E\in\mathbb R^{D\times K}$, $\mathbf x_n$ one-hot) are learned together with the network. A minibatch contains 2,000 tokens, of which 350 are distinct token types. For the error of this minibatch (no regularization term), at most how many elements of $\partial E/\partial\mathbf E$ can be nonzero? (integer)`, ans: '350*512', ansTex: R`350\times512=179{,}200`,
        sol: R`
**핵심.** 원-핫과의 곱은 $\mathbf E$의 한 열을 뽑는 것이므로, 연쇄법칙으로 $\frac{\partial E}{\partial\mathbf E}=\sum_n\frac{\partial E}{\partial\mathbf v_n}\mathbf x_n^T$이고, 이 행렬은 미니배치에 나온 토큰의 열에만 값이 있습니다.

1. $\mathbf v_n=\mathbf E\mathbf x_n$의 $d$번째 성분은 $\sum_kE_{dk}x_{nk}$이므로 $\partial v_{nd}/\partial E_{dk}=x_{nk}$, 곧 위치 $n$의 토큰이 $k$일 때만 1입니다.
2. 따라서 열 $k$의 기울기는 토큰 $k$가 나온 위치들의 $\partial E/\partial\mathbf v_n$을 더한 것입니다. 같은 토큰이 여러 번 나오면 그 위치들의 기울기가 한 열에 모입니다(모수 공유).
3. 나온 토큰 종류 350개의 열, $350\times512=179{,}200$개 원소만 0이 아닐 수 있습니다. 전체 $30{,}000\times512=15{,}360{,}000$개의 약 1.17%입니다.

**답.** 179,200개

**자주 하는 실수.** 토큰 수 2,000을 써서 $2000\times512$로 세는 것. 같은 토큰이 여러 번 나와도 같은 열 하나입니다.

**검산.** 가중치 감쇠를 쓰면 기울기에 $\lambda\mathbf E$가 더해져 모든 원소가 바뀌고, 모멘텀이 있는 옵티마이저(Adam 등)는 이번 기울기가 0인 열도 이전 모멘트로 움직일 수 있습니다. 이 문제의 “0이 아닐 수 있는 기울기”는 오차 항만의 이야기입니다.

관련: [[ch15:12.2|단어 임베딩과 토큰화]], [[ch10:8.1b|일반 피드포워드망과 역전파]]
` },
      { ch: 'ch15', type: 'mc', lv: 2, pts: 3, q: R`For a 500-token inpatient progress note, which statement about the path by which information from the first token reaches the output at the last position, and about its gradient, is correct?`,
        choices: [R`Because an RNN uses the same weights at every time step, the magnitude of $\partial\mathbf z_N/\partial\mathbf z_0$ is independent of the sequence length`, R`In a decoder with a causal mask, the first token cannot influence the output at the last position`, R`In a transformer, a single attention operation connects two positions directly, and every layer has the identity path of a residual connection, so the gradient is not propagated solely through repeated products of the same Jacobian`, R`The computational cost of self-attention is linear in the sequence length, so it always requires less computation than an RNN, even for long sequences`], ans: 2,
        sol: R`
**핵심.** RNN에서는 정보가 은닉 상태를 $N$번 차례로 거치므로 기울기가 야코비안 $N$개의 곱이 됩니다. 트랜스포머는 어떤 두 위치든 어텐션 한 번(경로 길이 1)으로 잇고, 잔차 연결이 블록마다 항등 경로($\mathbf I+J_l$)를 줍니다.

1. RNN: $\frac{\partial\mathbf z_N}{\partial\mathbf z_0}=\prod_{n=1}^N\frac{\partial\mathbf z_n}{\partial\mathbf z_{n-1}}$의 크기가 대략 $\rho^N$이라, $N=500$이면 $\rho=0.99$에서도 $0.99^{500}\approx0.0066$으로 소실됩니다.
2. 인과 마스크는 $a_{nm}=0$ ($m>n$), 곧 **미래**를 가립니다. 마지막 위치는 첫 토큰을 포함한 모든 앞 토큰에 어텐션할 수 있습니다.
3. 셀프 어텐션의 점수 계산은 $O(N^2D)$로 길이의 제곱에 비례합니다. 트랜스포머의 장점은 짧은 경로와 병렬 계산이지 계산량이 아닙니다.

**답.** ③

**보기 검토.** ① 모수를 공유하기 때문에 오히려 같은 행렬을 $N$번 곱해 소실·폭발이 생깁니다. ② 마스크의 방향을 뒤집었습니다. ③ 정답입니다. ④ $O(N^2)$이라 긴 서열에서는 어텐션이 병목입니다.

관련: [[ch15:12.2c|순환 신경망과 그 한계]], [[ch12:9.5|잔차 연결]]
` },
      { ch: 'ch15', type: 'open', lv: 3, pts: 10, q: R`The output layer (LSM) of a radiology-report decoder multiplies the representation $\tilde{\mathbf x}_n\in\mathbb R^D$ at position $n$ by $\mathbf W^{(p)}\in\mathbb R^{D\times K}$, which is shared by all positions, and applies a softmax: $\mathbf y_n=\operatorname{Softmax}(\mathbf W^{(p)T}\tilde{\mathbf x}_n)$, $E=-\sum_n\sum_kt_{nk}\ln y_{nk}$ ($\mathbf t_n$: one-hot vector of the next token). (1) Derive $\partial E/\partial\mathbf W^{(p)}=\sum_n\tilde{\mathbf x}_n(\mathbf y_n-\mathbf t_n)^T$. (2) For $D=2$, $K=3$, $\tilde{\mathbf x}_1=(1,0)$, $\tilde{\mathbf x}_2=(1,1)$, $\mathbf W^{(p)}=\begin{pmatrix}1&0&0\\0&1&0\end{pmatrix}$, with the next token being token 2 at position 1 and token 3 at position 2, find $\mathbf y_1$, $\mathbf y_2$, $E$ and $\partial E/\partial\mathbf W^{(p)}$. (3) Explain why all positions use the same $\mathbf W^{(p)}$, and why during training the errors at all positions may be obtained from a single forward pass.`,
        rubric: R`
- (1) 로짓 $a_{nk}=\sum_dW_{dk}\tilde x_{nd}$와 $\partial E/\partial a_{nk}=y_{nk}-t_{nk}$ — 2점
- (1) 연쇄법칙으로 $\partial E/\partial W_{dk}=\sum_n\tilde x_{nd}(y_{nk}-t_{nk})$, 위치별 기여의 합 — 2점
- (2) $\mathbf y_1$, $\mathbf y_2$, $E\approx3.4134$ — 2점
- (2) 기울기 행렬과 행의 합이 0인지 확인 — 2점
- (3) 모수 공유: 서열 길이와 무관, 위치마다의 기울기가 더해짐 — 1점
- (3) 인과 마스크로 각 위치가 앞 토큰만 보므로 한 번의 순전파로 모든 위치를 학습 — 1점`,
        sol: R`
**핵심.** 출력층은 위치마다 같은 “선형 + 소프트맥스”입니다. 위치 하나만 보면 소프트맥스 + 교차 엔트로피의 $\delta=\mathbf y_n-\mathbf t_n$에 입력 $\tilde{\mathbf x}_n$을 곱한 단층 망의 기울기이고, 공유 모수의 기울기는 위치별 기울기의 합입니다.

(1) 로짓은 $a_{nk}=\sum_dW_{dk}\tilde x_{nd}$, 곧 $\mathbf a_n=\mathbf W^{(p)T}\tilde{\mathbf x}_n$입니다. 7단원의 결과로 $\partial E/\partial a_{nk}=y_{nk}-t_{nk}$ ($\sum_kt_{nk}=1$). $W_{dk}$는 모든 위치의 $a_{nk}$에 들어가므로 연쇄법칙에서 위치마다의 기여를 더합니다:
$$\frac{\partial E}{\partial W_{dk}}=\sum_n\frac{\partial E}{\partial a_{nk}}\frac{\partial a_{nk}}{\partial W_{dk}}=\sum_n(y_{nk}-t_{nk})\,\tilde x_{nd}.$$
행렬로 쓰면 $\sum_n\tilde{\mathbf x}_n(\mathbf y_n-\mathbf t_n)^T$ ($D\times K$)입니다.

(2) $\mathbf a_1=(1,0,0)$이므로 $\mathbf y_1=\frac{(e,\,1,\,1)}{e+2}=(0.5761,\ 0.2119,\ 0.2119)$. $\mathbf a_2=(1,1,0)$이므로 $\mathbf y_2=\frac{(e,\,e,\,1)}{2e+1}=(0.4223,\ 0.4223,\ 0.1554)$.
$E=-\ln y_{12}-\ln y_{23}=\ln(e+2)+\ln(2e+1)=1.5514+1.8620\approx3.4134$.
$\mathbf y_1-\mathbf t_1=(0.5761,\ -0.7881,\ 0.2119)$, $\mathbf y_2-\mathbf t_2=(0.4223,\ 0.4223,\ -0.8446)$. $\tilde{\mathbf x}_1=(1,0)$은 첫 행에만, $\tilde{\mathbf x}_2=(1,1)$은 두 행 모두에 더해지므로
$$\frac{\partial E}{\partial\mathbf W^{(p)}}=\begin{pmatrix}0.9984&-0.3657&-0.6327\\0.4223&0.4223&-0.8446\end{pmatrix}.$$
각 행의 합이 0인 것은 $\sum_k(y_{nk}-t_{nk})=1-1=0$이기 때문이며 계산 확인에 씁니다. 경사하강을 하면 기울기가 음수인 원소(정답 토큰 쪽)는 커지고 양수인 원소는 작아집니다.

(3) 같은 $\mathbf W^{(p)}$를 모든 위치에 쓰면 모수 수가 서열 길이와 무관해 어떤 길이의 판독문에도 쓸 수 있고, 같은 토큰을 예측하는 지식을 위치마다 따로 배우지 않고 모든 위치의 기울기를 하나로 모읍니다(파라미터 공유). 학습 때는 입력을 한 칸 밀어 목표로 두고 인과 마스크($a_{nm}=0$, $m>n$)로 위치 $n$의 표현이 앞 토큰들에만 의존하게 하므로, 한 번의 순전파로 얻은 모든 위치의 예측이 각각 “앞 문맥으로 다음 토큰 맞히기” 표본이 되고 그 교차 엔트로피를 더해 쓸 수 있습니다.

**검산.** $W_{21}$을 $\pm10^{-6}$ 바꾼 중앙 차분은 $0.4223$으로 행렬의 (2,1) 원소와 같습니다.

관련: [[ch15:12.3|디코더 트랜스포머(GPT)와 표본 추출]], [[ch12:9.4|파라미터 공유]]
` },
    ],
  },
  );
})();
