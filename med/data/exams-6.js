/* 실전 모의고사 VIII — 교재 1·2장 범위 2회(01–06 단원). 2026-10-23 추가. 연습문제·다른 모의고사와 겹치지 않는 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x8', roman: 'VIII', kind: '교재 1·2장 범위 · 2회', title: '확률, 정보이론, 베이지안 심화', scopeText: '01–06 단원',
    desc: '두 검사를 잇는 선별검사와 결합표의 주변화, 정규방정식과 교차검증, 공분산의 선형변환과 회귀의 잡음 정밀도, 극좌표 야코비안·상호정보량·최대 엔트로피 증명, 이산 후보와 베타 사후분포의 예측분포까지 다룹니다. I회보다 단계가 많은 계산과 증명 위주입니다.',
    minutes: 110, plot: 'posterior',
    problems: [
      { ch: 'ch01', type: 'mc', lv: 1, pts: 3, q: R`In low-dose PET, the detected count in a pixel follows a Poisson distribution with mean $\lambda$ (its variance is also $\lambda$). The mean count of a standard scan is $\lambda=400$, and the count is proportional to the scan time. If the signal-to-noise ratio (SNR) must stay **at least half** that of the standard scan, what is the shortest scan time allowed, as a percentage of the standard scan time?`,
        choices: [R`50%`, R`25%`, R`about 31.6%`, R`6.25%`], ans: 1,
        sol: R`
**핵심.** 포아송 계수는 평균과 분산이 모두 $\lambda$이므로 $\text{SNR}=\lambda/\sqrt\lambda=\sqrt\lambda$입니다. SNR은 계수의 제곱근에 비례합니다.

1. 표준 촬영: $\text{SNR}=\sqrt{400}=20$. 목표는 $10$ 이상입니다.
2. 촬영 시간을 표준의 $f$배로 하면 계수가 $400f$이고 $\text{SNR}=\sqrt{400f}=20\sqrt f$입니다.
3. $20\sqrt f\ge10\iff\sqrt f\ge\frac12\iff f\ge\frac14$. 최소 촬영 시간은 25%이고 그때 평균 계수는 100입니다.

**답.** ② 25%

**보기 검토.** ① 50% — SNR이 계수에 정비례한다고 본 실수입니다. 실제로 50%면 SNR이 $\sqrt{200}\approx14.1$로 여유가 있어 최소가 아닙니다. ② 정답 — $\sqrt{1/4}=1/2$. ③ 약 31.6% — 강의의 $1/\sqrt{10}\approx0.32$(10%로 찍을 때의 SNR 배율)를 시간 비율과 혼동한 것입니다. ④ 6.25% — $(1/2)^4$로 한 번 더 제곱한 값이며, 그때 SNR은 $\sqrt{25}=5$로 목표의 절반에 그칩니다.

**검산.** 강의 예처럼 10%로 찍으면 SNR이 $\sqrt{0.1}\approx0.32$배라 절반 아래로 떨어집니다. 이보다 낮은 선량의 영상을 표준 영상처럼 복원하는 것이 딥러닝 잡음 제거의 역할입니다.

관련: [[ch01:0.4|의료 영상 AI의 응용]]
` },
      { ch: 'ch02', type: 'num', lv: 2, pts: 4, q: R`A straight line $y(x,\mathbf w)=w_0+w_1x$ is fitted to the four points $(x_n,t_n)=(0,1),(1,3),(2,2),(3,6)$ by minimizing the sum-of-squares error. Solve the normal equations $\Phi^T\Phi\,\mathbf w^\star=\Phi^T\mathbf t$ and find the model's prediction $y(4,\mathbf w^\star)$ at $x=4$. (decimal)`, ans: '6.5', ansTex: R`w_0^\star+4w_1^\star=0.9+5.6=6.5`,
        sol: R`
**핵심.** 계획행렬 $\Phi_{nj}=x_n^j$ ($j=0,1$)로 정규방정식 $\Phi^T\Phi\,\mathbf w^\star=\Phi^T\mathbf t$를 세우고 $2\times2$ 연립방정식을 풉니다.

1. 필요한 합: $N=4$, $\sum x_n=6$, $\sum x_n^2=0+1+4+9=14$, $\sum t_n=12$, $\sum x_nt_n=0+3+4+18=25$.
2. 정규방정식의 두 줄: $4w_0+6w_1=12$, $6w_0+14w_1=25$. 즉 $\Phi^T\Phi=\begin{pmatrix}4&6\\6&14\end{pmatrix}$이고 행렬식은 $56-36=20$입니다.
3. 크라메르 공식(또는 소거): $w_1^\star=\frac{4\cdot25-6\cdot12}{20}=\frac{28}{20}=1.4$, $w_0^\star=\frac{14\cdot12-6\cdot25}{20}=\frac{18}{20}=0.9$.
4. 예측: $y(4,\mathbf w^\star)=0.9+1.4\times4=6.5$.

**답.** $6.5$

**자주 하는 실수.** 기울기를 $\sum x_nt_n/\sum x_n^2=25/14\approx1.786$으로 구하면 절편이 0인 모델을 맞춘 것이 되어 예측이 $7.14$로 나옵니다. 절편이 있으면 두 방정식을 함께 풀어야 합니다.

**검산.** 최소제곱 직선은 평균점 $(\bar x,\bar t)=(1.5,3)$을 지납니다: $0.9+1.4\times1.5=3$. 잔차 $t_n-y_n$은 $0.1,\ 0.7,\ -1.7,\ 0.9$로 합이 0이고($\partial E/\partial w_0=0$), $\sum_nx_n\times$잔차 $=0+0.7-3.4+2.7=0$입니다($\partial E/\partial w_1=0$).

관련: [[ch02:1.2a|자료, 선형 모델, 오차함수]]
` },
      { ch: 'ch02', type: 'num', lv: 3, pts: 5, q: R`The same straight-line model is fitted to the same four points $(0,1),(1,3),(2,2),(3,6)$ by minimizing the $L_2$-regularized error $\tilde E(\mathbf w)=\frac12\sum_n\{y(x_n,\mathbf w)-t_n\}^2+\frac\lambda2\lVert\mathbf w\rVert^2$. Here $\lVert\mathbf w\rVert^2=w_0^2+w_1^2$, so the bias (intercept) is regularized as well. Find the slope $w_1^\star$ for $\lambda=2$. (decimal)`, ans: '1.3', ansTex: R`w_1^\star=\tfrac{78}{60}=1.3`,
        sol: R`
**핵심.** 규제 항을 더해도 $\tilde E$는 $\mathbf w$의 이차식이고, $\nabla\tilde E=\Phi^T(\Phi\mathbf w-\mathbf t)+\lambda\mathbf w=\mathbf 0$에서 $(\Phi^T\Phi+\lambda\mathbf I)\mathbf w^\star=\Phi^T\mathbf t$를 얻습니다. 절편도 규제하므로 $\lambda$가 대각 원소 **둘 다**에 더해집니다.

1. 규제 없는 경우의 합을 그대로 씁니다: $\Phi^T\Phi=\begin{pmatrix}4&6\\6&14\end{pmatrix}$, $\Phi^T\mathbf t=(12,25)^T$.
2. $\lambda=2$: $\Phi^T\Phi+2\mathbf I=\begin{pmatrix}6&6\\6&16\end{pmatrix}$, 행렬식 $96-36=60$.
3. $w_1^\star=\frac{6\cdot25-6\cdot12}{60}=\frac{78}{60}=1.3$, $w_0^\star=\frac{16\cdot12-6\cdot25}{60}=\frac{42}{60}=0.7$.

**답.** $w_1^\star=1.3$

**해석.** 규제 없는 해 $(0.9,\ 1.4)$와 비교하면 $\lVert\mathbf w\rVert^2$이 $2.77$에서 $2.18$로 줄고, 훈련 제곱오차 $E=\frac12\sum\{y-t\}^2$는 $2.1$에서 $2.37$로 늘었습니다. 계수를 0 쪽으로 줄이는 대가로 훈련 적합을 조금 포기한 것입니다(축소).

**자주 하는 실수.** 절편을 규제에서 빼면($\lambda$를 $w_1$ 자리에만 더하면) $\begin{pmatrix}4&6\\6&16\end{pmatrix}$에서 $w_1^\star=1.0$, $w_0^\star=1.5$가 나옵니다. 문제가 정한 $\lVert\mathbf w\rVert^2=w_0^2+w_1^2$를 따라야 합니다. 또 $\frac\lambda2\lVert\mathbf w\rVert^2$의 기울기는 $\lambda\mathbf w$이므로 대각에 $\lambda/2$가 아니라 $\lambda$를 더합니다.

**검산.** $\nabla\tilde E$의 첫 성분 $4(0.7)+6(1.3)-12+2(0.7)=2.8+7.8-12+1.4=0$, 둘째 성분 $6(0.7)+14(1.3)-25+2(1.3)=4.2+18.2-25+2.6=0$.

관련: [[ch02:1.2c|규제와 모델 선택]]
` },
      { ch: 'ch02', type: 'mc', lv: 2, pts: 3, q: R`A research team building a model to assist chest X-ray reading splits 1,000 cases into 800 for training and 200 for testing. For each of 10 candidate values of the regularization coefficient $\lambda$, they train on the 800 training cases, pick the $\lambda$ with the **smallest error on the 200 test cases**, and report that test error as the final performance. Which assessment of this procedure is correct?`,
        choices: [
          R`Since the test data were not used to learn the weights, the reported error is an unbiased estimate`,
          R`$\lambda$ should have been chosen as the value with the smallest training error`,
          R`Because the model was selected using the test data, the reported error is optimistically biased. $\lambda$ should be chosen within the 800 training cases, using a validation set or $S$-fold cross-validation, and the 200 test cases used only once at the very end`,
          R`Cross-validation requires training $S$ times, so it cannot be used here; the only remedy is to enlarge the test set`,
        ], ans: 2,
        sol: R`
**핵심.** 초매개변수는 검증 오차로 고르고, 최종 성능은 고르는 데 쓰지 않은 테스트 자료로 한 번만 평가합니다. 어떤 자료에서 성능이 가장 좋은 후보를 골랐다면 그 자료의 오차는 더 이상 공정한 추정이 아닙니다.

1. 이 팀은 테스트 자료를 10개 후보 중 하나를 **고르는 데** 썼습니다. 테스트 자료가 사실상 검증 집합 역할을 한 것입니다.
2. 10개 오차의 최솟값은 우연히 그 200건에 잘 맞은 후보 쪽으로 치우치므로, 새 환자 자료에서의 오차보다 작게 나오기 쉽습니다(낙관적 편향).
3. 올바른 절차: 800건 안에서 검증 집합을 떼거나 $S$겹 교차검증(예: $S=5$이면 640건으로 학습하고 160건으로 평가하기를 5번)으로 $\lambda$를 고르고, 고른 $\lambda$로 800건 전체를 다시 학습한 뒤 200건으로 한 번 평가합니다.

**답.** ③

**보기 검토.** ① 가중치 학습에 쓰지 않았어도 **모델 선택**에 썼으므로 편향됩니다. ② 훈련 오차는 $\lambda=0$에서 항상 가장 작아 과적합한 모델을 고르게 됩니다. ③ 정답. ④ $S$겹 교차검증은 계산이 $S$배 들 뿐이고, 자료가 적을 때 오히려 권장되는 방법입니다.

관련: [[ch02:1.2c|규제와 모델 선택]]
` },
      { ch: 'ch03', type: 'mc', lv: 1, pts: 3, q: R`A model predicts whether a lung nodule is malignant using a single chest X-ray as its only input. Even with 10 times more training data, the test error did not fall below a certain level, but adding the same patient's CT images to the input reduced the error substantially. Which option correctly pairs the type of uncertainty that remained despite more data with the way to reduce it?`,
        choices: [
          R`It is epistemic uncertainty, and it will eventually vanish if more data are collected`,
          R`It arises from using frequentist probability, and it vanishes if we switch to the Bayesian interpretation of probability`,
          R`It is due to over-fitting, and it vanishes with stronger regularization`,
          R`It is aleatoric uncertainty: information not contained in the X-ray (an unobserved variable) appears as noise. It is reduced only by adding better features (observations)`,
        ], ans: 3,
        sol: R`
**핵심.** 인식적 불확실성은 유한한 자료에서 오는 지식 부족이라 자료를 늘리면 줄고, 우연적 불확실성은 본질적 무작위성이나 관측하지 않은 변수에서 오므로 자료 수가 아니라 관측(특징)을 바꿔야 줄어듭니다.

1. 자료를 10배 늘려도 오차가 그대로였습니다 → 자료 부족(인식적)으로는 설명되지 않습니다.
2. CT를 더하자 줄었습니다 → X선 한 장에 담기지 않은 정보가 있었고, 그 정보가 모델에게는 잡음으로 보였습니다. 교재의 $y=\sin(2\pi x_1)\sin(2\pi x_2)$에서 $x_2$를 관측하지 않으면 $y$가 흩어져 보이는 것과 같은 구조입니다.
3. 따라서 남은 불확실성은 X선이라는 입력을 기준으로 한 우연적 불확실성입니다.

**답.** ④

**보기 검토.** ① 자료를 늘려도 줄지 않았다는 관찰과 맞지 않습니다. ② 확률의 해석(장기 빈도 또는 믿음의 정도)을 바꾼다고 없던 정보가 생기지 않습니다. ③ 과적합이 원인이라면 자료를 10배 늘릴 때 시험 오차가 줄었어야 합니다. ④ 정답.

관련: [[ch03:2.0|불확실성과 확률의 두 해석]]
` },
      { ch: 'ch03', type: 'num', lv: 1, pts: 3, q: R`The table counts the final diagnosis $C$ and the chest X-ray finding $T$ for 200 patients at a respiratory clinic.

| | $T=$ normal | $T=$ infiltrate | $T=$ cavity |
|---|---|---|---|
| $C=$ normal | 120 | 18 | 2 |
| $C=$ pneumonia | 8 | 30 | 2 |
| $C=$ tuberculosis | 2 | 10 | 8 |

Among patients whose X-ray finding is **not** normal, what fraction have tuberculosis, i.e. $p(C=\text{tuberculosis}\mid T\ne\text{normal})$? (fraction or 4 decimal places)`, ans: '18/70', ansTex: R`\tfrac{18}{70}=\tfrac9{35}\approx0.2571`,
        sol: R`
**핵심.** 조건 $T\ne\text{정상}$은 두 값(침윤, 공동)을 합친 사건입니다. 합의 규칙으로 두 열을 더한 뒤 조건부확률 = 결합확률 / 주변확률로 계산합니다.

1. 조건 사건의 주변 빈도(합의 규칙): 침윤 열 $18+30+10=58$, 공동 열 $2+2+8=12$ → $T\ne$ 정상인 환자는 $70$명, $p(T\ne\text{정상})=70/200=0.35$.
2. 결합 빈도: 결핵이면서 $T\ne$ 정상인 환자 $10+8=18$명 → $p(C=\text{결핵},T\ne\text{정상})=18/200=0.09$.
3. 곱의 규칙에서 $p(C=\text{결핵}\mid T\ne\text{정상})=\frac{0.09}{0.35}=\frac{18}{70}\approx0.2571$.

**답.** $\frac{18}{70}\approx0.2571$

**자주 하는 실수.** 결핵 행의 합 20으로 나누면 $18/20=0.9$로, 반대 방향의 조건부확률 $p(T\ne\text{정상}\mid C=\text{결핵})$을 구한 것이 됩니다. 또 두 열의 조건부확률 $10/58$과 $8/12$를 단순 평균하면 약 $0.42$가 나오는데, 열마다 환자 수가 달라 틀립니다. 올바른 결합은 열의 크기로 가중한 평균 $\frac{58}{70}\cdot\frac{10}{58}+\frac{12}{70}\cdot\frac{8}{12}=\frac{18}{70}$입니다.

**검산.** 베이즈 정리로: $p(T\ne\text{정상}\mid C=\text{결핵})=0.9$, $p(C=\text{결핵})=20/200=0.1$이므로 $\frac{0.9\times0.1}{0.35}\approx0.2571$.

관련: [[ch03:2.1|결합·주변·조건부 확률과 두 규칙]]
` },
      { ch: 'ch03', type: 'mc', lv: 2, pts: 3, q: R`For the textbook's cancer screening test (prevalence 1%, sensitivity 90%, false-positive rate 3%), the positive predictive value is $p(C=1\mid T=1)=90/387\approx0.23$. Keeping everything else fixed and changing **only one** of the following, which raises the positive predictive value the most?`,
        choices: [R`Lower the false-positive rate from 3% to 1%`, R`Raise the sensitivity from 90% to 99%`, R`Make the sensitivity 100%`, R`Apply the test to a population with prevalence 2%`], ans: 0,
        sol: R`
**핵심.** 민감도 $s$, 위양성률 $f$, 유병률 $\pi$이면 $p(C=1\mid T=1)=\frac{s\pi}{s\pi+f(1-\pi)}$입니다. 유병률이 낮으면 분모의 위양성 항 $f(1-\pi)$가 지배하므로 그 항을 줄이는 것이 가장 효과적입니다.

1. 기준: $s\pi=0.009$, $f(1-\pi)=0.0297$ → $0.009/0.0387\approx0.2326$.
2. ① $f=0.01$: $\frac{0.009}{0.009+0.0099}=\frac{0.009}{0.0189}\approx0.4762$.
3. ② $s=0.99$: $\frac{0.0099}{0.0099+0.0297}=0.25$.
4. ③ $s=1$: $\frac{0.01}{0.01+0.0297}\approx0.2519$.
5. ④ $\pi=0.02$: $\frac{0.018}{0.018+0.0294}=\frac{0.018}{0.0474}\approx0.3797$.

**답.** ① 위양성률을 1%로 낮춘다 (약 0.23 → 0.48)

**보기 검토.** ① 정답 — 1만 명당 위양성자가 297명에서 99명으로 줄어듭니다. ② ③ 민감도는 분자와 분모의 작은 항만 키워 거의 변하지 않습니다(약 0.25). 민감도가 100%여도 양성 네 명 중 세 명은 위양성입니다. ④ 유병률을 두 배로 하면 0.38로 오르지만 ①보다 작습니다.

**검산.** 1만 명 기준 ①: 참양성 90명, 위양성 $0.01\times9{,}900=99$명 → $90/189\approx0.476$.

관련: [[ch03:2.1b|베이즈 정리와 선별검사]]
` },
      { ch: 'ch03', type: 'open', lv: 3, pts: 12, q: R`The prevalence of a certain cancer in the screening population is $\pi=0.02$. The first-line test A has sensitivity $0.95$ and specificity $0.90$; the confirmatory test B has sensitivity $0.90$ and specificity $0.99$. Assume that, given the disease status $C$, the two test results are independent (conditional independence).
(1) Find the probability $p(A=1)$ that test A is positive, and the positive predictive value $p(C=1\mid A=1)$.
(2) A person who tested positive on A is given B, which is also positive. Compute $p(C=1\mid A=1,B=1)$ in two ways, by using the posterior from (1) as the new prior and by using both test results at once, and show that the two agree.
(3) Find $p(C=1\mid A=1,B=0)$ for A positive and B negative, and interpret it together with $p(C=1\mid A=0)$ for A negative.
(4) If the same test A is used on emergency-department referrals, where the prevalence is 30%, what are the positive predictive value and the negative predictive value $p(C=0\mid A=0)$? Interpret the result in comparison with the screening population.`,
        rubric: R`
- (1) 합의 규칙으로 $p(A=1)=0.117$, 베이즈 정리로 $0.019/0.117\approx0.1624$ — 3점
- (2) 순차 갱신과 한 번에 계산이 모두 $0.0171/0.01808\approx0.9458$, 근거로 조건부 독립 사용 — 3점
- (3) $p(C=1\mid A=1,B=0)\approx0.0192$, $p(C=1\mid A=0)\approx0.00113$과 해석 — 3점
- (4) 유병률 30%에서 양성 예측도 $\approx0.8028$, 음성 예측도 $\approx0.9767$과 유병률 의존성 해석 — 3점`,
        sol: R`
**핵심.** 검사마다 합의 규칙(분모), 곱의 규칙(결합), 베이즈 정리(사후)를 적용합니다. 조건부 독립이면 $p(A,B\mid C)=p(A\mid C)\,p(B\mid C)$라서 결과를 하나씩 순서대로 반영해도 한 번에 반영해도 같습니다.

**(1)** $p(A=1)=0.95(0.02)+0.10(0.98)=0.019+0.098=0.117$. $p(C=1\mid A=1)=0.019/0.117\approx0.1624$. 건강한 98%의 10%가 양성이라 양성의 약 84%가 위양성입니다.

**(2)** 순차: 사전확률 $0.1624$로 $\frac{0.1624\times0.90}{0.1624\times0.90+0.8376\times0.01}=\frac{0.14615}{0.15453}\approx0.9458$.
한 번에: $p(A=1,B=1\mid C=1)=0.95\times0.90=0.855$, $p(A=1,B=1\mid C=0)=0.10\times0.01=0.001$이므로 $\frac{0.855(0.02)}{0.855(0.02)+0.001(0.98)}=\frac{0.0171}{0.01808}\approx0.9458$. 첫 사후확률의 분모 $0.117$이 약분되어 두 값이 같아지며, 이것이 조건부 독립의 결과입니다. “둘 다 양성일 때만 양성”인 직렬 전략의 민감도 $0.855$, 특이도 $0.999$로 계산한 것과도 같습니다.

**(3)** $p(A=1,B=0\mid C=1)=0.95\times0.10=0.095$, $p(A=1,B=0\mid C=0)=0.10\times0.99=0.099$ → $\frac{0.095(0.02)}{0.095(0.02)+0.099(0.98)}=\frac{0.0019}{0.09892}\approx0.0192$. 한편 $p(C=1\mid A=0)=\frac{0.05(0.02)}{0.05(0.02)+0.90(0.98)}=\frac{0.001}{0.883}\approx0.00113$. B 음성은 A 양성으로 16%까지 올라간 의심을 유병률 수준(약 2%)으로 되돌리지만, 처음부터 A 음성인 사람보다는 약 17배 높으므로 추적 관찰이 합리적입니다.

**(4)** $\pi=0.3$: 양성 예측도 $\frac{0.95(0.3)}{0.95(0.3)+0.10(0.7)}=\frac{0.285}{0.355}\approx0.8028$, 음성 예측도 $\frac{0.90(0.7)}{0.90(0.7)+0.05(0.3)}=\frac{0.63}{0.645}\approx0.9767$. 검진 집단에서는 각각 $0.1624$, $\frac{0.882}{0.883}\approx0.9989$였습니다. 민감도·특이도는 검사의 성질이지만 예측도는 유병률(사전확률)에 따라 바뀝니다. 유병률이 높으면 양성은 믿을 만해지고 음성의 안심 효과는 약해집니다.

**답.** (1) $0.117$, $0.1624$ (2) $0.9458$ (3) $0.0192$, $0.00113$ (4) $0.8028$, $0.9767$

관련: [[ch03:2.1b|베이즈 정리와 선별검사]]
` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 4, q: R`A lab value rescaled to $[0,2]$, denoted $x$, has density $p(x)=c\,x(2-x)$ ($0\le x\le2$, and 0 elsewhere). Find $\Var[x]$. (fraction or decimal)`, ans: '1/5', ansTex: R`\tfrac15=0.2`,
        sol: R`
**핵심.** 정규화 조건 $\int p(x)\,dx=1$로 $c$를 정하고 $\Var[x]=\E[x^2]-\E[x]^2$로 계산합니다.

1. 정규화: $\int_0^2x(2-x)\,dx=\big[x^2-\tfrac{x^3}3\big]_0^2=4-\tfrac83=\tfrac43$이므로 $c=\tfrac34$.
2. 평균: $p(1+u)=p(1-u)$로 $x=1$에 대해 대칭이므로 $\E[x]=1$. 직접 계산해도 $\tfrac34\int_0^2(2x^2-x^3)dx=\tfrac34\big(\tfrac{16}3-4\big)=1$.
3. 2차 모멘트: $\E[x^2]=\tfrac34\int_0^2(2x^3-x^4)dx=\tfrac34\big(8-\tfrac{32}5\big)=\tfrac34\cdot\tfrac85=\tfrac65$.
4. $\Var[x]=\tfrac65-1^2=\tfrac15$.

**답.** $\Var[x]=\frac15=0.2$

**자주 하는 실수.** $c$를 구하지 않고 $\int x\cdot x(2-x)dx=\tfrac43$, $\int x^2\cdot x(2-x)dx=\tfrac85$를 그대로 쓰면 $\tfrac85-\tfrac{16}9<0$으로 분산이 음수가 됩니다. 밀도는 적분이 1이어야 합니다.

**검산.** 같은 구간의 균등분포 $U(0,2)$는 $\E[x^2]=\tfrac12\int_0^2x^2dx=\tfrac43$이라 분산이 $\tfrac43-1=\tfrac13$입니다. $p(x)$는 가운데에 질량이 몰린 모양이므로 분산이 그보다 작아야 하고, 실제로 $\tfrac15<\tfrac13$입니다.

관련: [[ch04:2.2|확률밀도와 대표 분포]], [[ch04:2.2b|기댓값, 분산, 공분산]]
` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 4, q: R`Two lab values $\mathbf x=(x_1,x_2)^T$ have covariance matrix $\Cov[\mathbf x]=\begin{pmatrix}4&1.5\\1.5&1\end{pmatrix}$. Find the covariance $\Cov[y_1,y_2]$ of the two composite indices $y_1=x_1+x_2$ and $y_2=x_1-2x_2+3$. (decimal)`, ans: '0.5', ansTex: R`\Cov[y_1,y_2]=\tfrac12`,
        sol: R`
**핵심.** 공분산은 두 인자 각각에 대해 선형이고 상수 이동과 무관합니다: $\Cov[ax_1+bx_2,\ cx_1+dx_2+e]=ac\Var[x_1]+(ad+bc)\Cov[x_1,x_2]+bd\Var[x_2]$. 행렬로 쓰면 $\mathbf y=A\mathbf x+\mathbf b$일 때 $\Cov[\mathbf y]=A\Cov[\mathbf x]A^T$입니다.

1. 정의 $\Cov[y_1,y_2]=\E[\{y_1-\E y_1\}\{y_2-\E y_2\}]$에서 $\tilde x_i=x_i-\E x_i$로 두면 $y_1-\E y_1=\tilde x_1+\tilde x_2$, $y_2-\E y_2=\tilde x_1-2\tilde x_2$입니다. 상수 3은 빠집니다.
2. 전개: $\E[(\tilde x_1+\tilde x_2)(\tilde x_1-2\tilde x_2)]=\E[\tilde x_1^2]-2\E[\tilde x_1\tilde x_2]+\E[\tilde x_2\tilde x_1]-2\E[\tilde x_2^2]$.
3. 대입: $4-2(1.5)+1.5-2(1)=4-3+1.5-2=0.5$.

**답.** $\Cov[y_1,y_2]=0.5$

**자주 하는 실수.** 교차항을 빠뜨리면 $4-2=2$가 나오고, 교차항 계수를 $ad+bc=-2+1=-1$ 대신 $-2$만 쓰면 $4-3-2=-1$이 나옵니다.

**검산.** $A=\begin{pmatrix}1&1\\1&-2\end{pmatrix}$이면 $A\Cov[\mathbf x]A^T=\begin{pmatrix}8&0.5\\0.5&2\end{pmatrix}$입니다. 대각 성분 $\Var[y_1]=4+2(1.5)+1=8$, $\Var[y_2]=4-4(1.5)+4(1)=2$도 같은 규칙으로 확인되고, 비대각 성분이 $0.5$입니다.

관련: [[ch04:2.2b|기댓값, 분산, 공분산]]
` },
      { ch: 'ch04', type: 'mc', lv: 2, pts: 3, q: R`The data $1,4,7$ are drawn i.i.d. from a Gaussian $\N(\mu,\sigma^2)$. Which of the following is **false**?`,
        choices: [
          R`$\sigma^2_{\text{ML}}=6$, and its expectation is $\E[\sigma^2_{\text{ML}}]=\frac23\sigma^2$`,
          R`The unbiased estimate is $\tilde\sigma^2=\frac32\sigma^2_{\text{ML}}=9$`,
          R`Even when the true mean $\mu=5$ is known, the $\frac N{N-1}$ correction is still needed, so the unbiased estimate is $\frac32\cdot\frac13\sum_n(x_n-5)^2=10.5$`,
          R`When the true mean $\mu=5$ is known, $\frac13\sum_n(x_n-5)^2=7$ is an unbiased estimate of $\sigma^2$`,
        ], ans: 2,
        sol: R`
**핵심.** $\sigma^2_{\text{ML}}$의 편향 $\frac{N-1}N$은 편차를 **자료에서 추정한 평균** $\mu_{\text{ML}}$ 기준으로 재기 때문에 생깁니다. 참 평균으로 재면 각 항의 기댓값이 정확히 $\sigma^2$이라 보정이 필요 없습니다.

1. $\mu_{\text{ML}}=4$, 편차 제곱 $9,0,9$ → $\sigma^2_{\text{ML}}=18/3=6$, $\E[\sigma^2_{\text{ML}}]=\frac{N-1}N\sigma^2=\frac23\sigma^2$ (①은 참).
2. $\tilde\sigma^2=\frac N{N-1}\sigma^2_{\text{ML}}=\frac32\times6=9$, 즉 $\frac1{N-1}\sum(x_n-\bar x)^2=\frac{18}2$ (②는 참).
3. $\mu=5$를 알면 $\E[(x_n-5)^2]=\Var[x_n]=\sigma^2$이므로 $\frac13\sum(x_n-5)^2=\frac{16+1+4}3=7$이 불편입니다 (④는 참).
4. ③의 추가 보정은 불필요하고, 오히려 기댓값을 $\frac32\sigma^2$로 만들어 위쪽 편향을 줍니다.

**답.** ③

**보기 검토.** ① 참 — $N=3$이면 기댓값이 참값의 $2/3$. ② 참 — $\frac1{N-1}\sum(x_n-\bar x)^2$. ③ 거짓 — 보정은 평균을 자료로 추정했을 때만 필요합니다. ④ 참 — 참 평균 기준이면 $\frac1N$이 불편.

**자주 하는 실수.** 참 평균 기준 편차 제곱합 $21$이 표본평균 기준 $18$보다 큰 것은 우연이 아닙니다. $\sum(x_n-c)^2$은 $c=\bar x$에서 최소이므로 표본평균 기준으로 재면 항상 작게 나옵니다.

관련: [[ch04:2.3b|최대가능도의 편향과 보정]]
` },
      { ch: 'ch04', type: 'num', lv: 3, pts: 5, q: R`For dose $x$ and response $t$ with data $(1,2),(2,3),(3,7)$, assume a model through the origin, $y(x,w)=wx$, with Gaussian noise $p(t\mid x,w,\beta)=\N(t\mid wx,\beta^{-1})$ (precision $\beta=1/\sigma^2$). When $w$ and $\beta$ are estimated jointly by maximum likelihood, find $\beta_{\text{ML}}$. (fraction or 4 decimal places)`, ans: '14/9', ansTex: R`\beta_{\text{ML}}=\tfrac{14}9\approx1.5556`,
        sol: R`
**핵심.** 로그가능도는 $\ln p(\mathbf t\mid\mathbf x,w,\beta)=-\frac\beta2\sum_n(wx_n-t_n)^2+\frac N2\ln\beta-\frac N2\ln(2\pi)$입니다. $w$는 제곱오차합 최소화로 정해지고($\beta$와 무관), $\beta$는 $w_{\text{ML}}$을 넣은 뒤 $\beta$로 미분해 구합니다. 결과는 $1/\beta_{\text{ML}}=$ 평균제곱잔차입니다.

1. $w$에 대해: $\frac{\partial}{\partial w}\ln p=-\beta\sum_n(wx_n-t_n)x_n=0$ → $w_{\text{ML}}=\frac{\sum x_nt_n}{\sum x_n^2}=\frac{2+6+21}{1+4+9}=\frac{29}{14}\approx2.0714$.
2. 잔차 $t_n-w_{\text{ML}}x_n$: $2-\frac{29}{14}=-\frac1{14}$, $3-\frac{58}{14}=-\frac{16}{14}$, $7-\frac{87}{14}=\frac{11}{14}$.
3. 잔차 제곱합: $\frac{1+256+121}{196}=\frac{378}{196}=\frac{27}{14}\approx1.9286$.
4. $\beta$에 대해: $-\frac12\sum_n(w_{\text{ML}}x_n-t_n)^2+\frac N{2\beta}=0$ → $\frac1{\beta_{\text{ML}}}=\frac1N\sum_n(w_{\text{ML}}x_n-t_n)^2=\frac{27}{42}=\frac9{14}\approx0.6429$.
5. $\beta_{\text{ML}}=\frac{14}9\approx1.5556$.

**답.** $\beta_{\text{ML}}=\frac{14}9\approx1.5556$

**자주 하는 실수.** 잡음 분산 $\sigma^2_{\text{ML}}=\frac9{14}\approx0.6429$를 답으로 내거나, $N-1=2$로 나눠 $\frac{27}{28}$을 쓰는 것. 문제는 정밀도의 **최대가능도** 값을 묻습니다.

**검산.** 정규방정식 확인: $\sum_n(w_{\text{ML}}x_n-t_n)x_n=\frac{1\cdot1+16\cdot2-11\cdot3}{14}=0$. 예측분포는 $p(t\mid x,w_{\text{ML}},\beta_{\text{ML}})=\N\big(t\mid\frac{29}{14}x,\frac9{14}\big)$이고, 예컨대 $x=4$에서 평균은 $\frac{58}7\approx8.286$입니다.

관련: [[ch04:2.3c|선형회귀의 확률적 해석]]
` },
      { ch: 'ch05', type: 'num', lv: 3, pts: 5, q: R`Let $x_1,x_2$ be independent $\N(0,1)$ variables. Changing to polar coordinates $x_1=r\cos\theta$, $x_2=r\sin\theta$ ($r>0$, $0\le\theta<2\pi$), find the value at $r=1$ of the marginal density $p_r(r)$ of the radius $r$. (4 decimal places)`, ans: 'exp(-0.5)', ansTex: R`p_r(1)=e^{-1/2}\approx0.6065`,
        sol: R`
**핵심.** 다변수 변수변환 $p_{\mathbf y}(\mathbf y)=p_{\mathbf x}(\mathbf g(\mathbf y))\,\lvert\det J\rvert$ ($J_{ij}=\partial g_i/\partial y_j$)로 $(r,\theta)$의 결합밀도를 구한 뒤, 합의 규칙으로 $\theta$를 적분해 없앱니다. 여기서 $\mathbf y=(r,\theta)$, $\mathbf x=\mathbf g(\mathbf y)=(r\cos\theta,r\sin\theta)$입니다.

1. 결합밀도(독립이므로 곱): $p_{\mathbf x}(x_1,x_2)=\frac1{2\pi}\exp\{-\frac12(x_1^2+x_2^2)\}$.
2. 야코비안: $J=\begin{pmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{pmatrix}$, $\det J=r\cos^2\theta+r\sin^2\theta=r$.
3. $x_1^2+x_2^2=r^2$이므로 $p(r,\theta)=\frac{r}{2\pi}e^{-r^2/2}$.
4. 주변화: $p_r(r)=\int_0^{2\pi}\frac{r}{2\pi}e^{-r^2/2}d\theta=re^{-r^2/2}$.
5. $p_r(1)=e^{-1/2}\approx0.6065$.

**답.** $e^{-1/2}\approx0.6065$

**자주 하는 실수.** 야코비안 $r$을 빼고 대입만 하면 $e^{-r^2/2}$가 되는데, $\int_0^\infty e^{-r^2/2}dr=\sqrt{\pi/2}\ne1$이라 밀도가 아닙니다. $\theta$ 적분의 $2\pi$를 빠뜨려 $p(r,\theta)$의 값 $\frac1{2\pi}e^{-1/2}\approx0.0965$를 쓰는 실수도 흔합니다.

**검산.** $\int_0^\infty re^{-r^2/2}dr=\big[-e^{-r^2/2}\big]_0^\infty=1$. 또 $p_{\mathbf x}$의 최빈값은 원점($r=0$)이지만 $p_r$은 $\frac{d}{dr}(re^{-r^2/2})=(1-r^2)e^{-r^2/2}=0$에서 $r=1$이 최빈값입니다. 밀도의 최빈값이 변환을 따라가지 않는다는 예입니다.

관련: [[ch05:2.4|확률밀도의 변환]]
` },
      { ch: 'ch05', type: 'num', lv: 1, pts: 4, q: R`Mammography reading results are distributed as follows: $\frac12$ of all cases are normal, and among the abnormal findings $\frac34$ are benign tumors and $\frac14$ are malignant. What is the entropy, in bits, of the reading result (three values: normal, benign tumor, malignant)? (4 decimal places)`, ans: '(0.5*ln(2)+0.375*ln(8/3)+0.125*ln(8))/ln(2)', ansTex: R`\mathrm H\approx1.4056\ \text{비트}`,
        sol: R`
**핵심.** 먼저 곱의 규칙으로 세 값의 확률을 만든 뒤 $\mathrm H=-\sum p\log_2p$를 계산합니다.

1. 확률: $p(\text{정상})=\frac12$, $p(\text{양성})=\frac12\cdot\frac34=\frac38$, $p(\text{악성})=\frac12\cdot\frac14=\frac18$. 합은 1입니다.
2. 정보량: $-\log_2\frac12=1$, $-\log_2\frac38=\log_2\frac83\approx1.4150$, $-\log_2\frac18=3$.
3. 평균: $\mathrm H=\frac12(1)+\frac38(1.4150)+\frac18(3)=0.5+0.5306+0.375\approx1.4056$비트.

**답.** $\approx1.4056$비트

**검산.** 판독을 두 단계로 보면 $\mathrm H[\mathbf x,\mathbf y]=\mathrm H[\mathbf x]+\mathrm H[\mathbf y\mid\mathbf x]$와 같은 분해가 됩니다. 정상·이상을 가르는 데 1비트, 이상일 때(확률 $\frac12$) 양성·악성을 가르는 데 $-\frac34\log_2\frac34-\frac14\log_2\frac14\approx0.8113$비트이므로 $1+\frac12(0.8113)\approx1.4056$. 세 값의 최대 엔트로피 $\log_23\approx1.585$보다 작습니다.

**자주 하는 실수.** 자연로그로 계산하면 $1.4056\times\ln2\approx0.9743$내트가 나옵니다. 단위(비트, 내트)를 확인하세요.

관련: [[ch05:2.5|정보량, 엔트로피, 미분 엔트로피]], [[ch05:2.5c|조건부 엔트로피와 상호정보량]]
` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 4, q: R`The joint distribution of a radiologist's call $x$ and an AI's call $y$ (0 = normal, 1 = abnormal) is as follows.

| | $y=0$ | $y=1$ |
|---|---|---|
| $x=0$ | $1/2$ | $1/8$ |
| $x=1$ | $1/8$ | $1/4$ |

What is the mutual information $\mathrm I[x,y]$ in bits? (4 decimal places)`, ans: '2*(-(0.625*ln(0.625)+0.375*ln(0.375)))/ln(2)-1.75', ansTex: R`\mathrm I\approx0.1589\ \text{비트}`,
        sol: R`
**핵심.** $\mathrm I[x,y]=\KL\big(p(x,y)\Vert p(x)p(y)\big)=\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}$이고, 같은 값이 $\mathrm H[x]+\mathrm H[y]-\mathrm H[x,y]$로도 나옵니다($\mathrm H[x,y]=\mathrm H[y\mid x]+\mathrm H[x]$를 대입).

1. 주변분포(합의 규칙): $p(x=0)=\frac12+\frac18=\frac58$, $p(x=1)=\frac38$. 표가 대칭이라 $p(y)$도 $(\frac58,\frac38)$입니다.
2. 엔트로피: $\mathrm H[x]=\mathrm H[y]=-\frac58\log_2\frac58-\frac38\log_2\frac38\approx0.4238+0.5306=0.9544$비트. $\mathrm H[x,y]=\frac12(1)+2\cdot\frac18(3)+\frac14(2)=1.75$비트.
3. $\mathrm I=0.9544+0.9544-1.75\approx0.1589$비트.

**답.** $\approx0.1589$비트

**검산.** KL 정의로 직접: $\frac12\log_2\frac{1/2}{25/64}+2\cdot\frac18\log_2\frac{1/8}{15/64}+\frac14\log_2\frac{1/4}{9/64}=0.5(0.3561)+0.25(-0.9069)+0.25(0.8301)\approx0.1589$. 조건부 엔트로피로: $p(x\mid y=0)=(0.8,0.2)$, $p(x\mid y=1)=(\frac13,\frac23)$이라 $\mathrm H[x\mid y]=\frac58(0.7219)+\frac38(0.9183)\approx0.79557$, $\mathrm I=\mathrm H[x]-\mathrm H[x\mid y]=0.95443-0.79557\approx0.1589$.

**자주 하는 실수.** 두 판정이 일치할 확률 $\frac34$를 정보량으로 착각하거나, $p(x,y)=p(x)p(y)$로 놓고 계산해 0을 얻는 것. 상호정보량은 $y$를 알 때 $x$의 불확실성이 평균적으로 얼마나 줄어드는지를 잽니다.

관련: [[ch05:2.5c|조건부 엔트로피와 상호정보량]]
` },
      { ch: 'ch05', type: 'open', lv: 3, pts: 12, q: R`Let $q(x)=\N(x\mid\mu,s^2)$, and let $p(x)$ be an **arbitrary** continuous density with mean $m$ and variance $v$.
(1) Show that $-\int p(x)\ln q(x)\,dx=\frac12\ln(2\pi s^2)+\frac{v+(m-\mu)^2}{2s^2}$. Note that this value does not depend on the shape of $p$, only on its mean and variance.
(2) Using (1) and $\KL(p\Vert q)\ge0$, prove that among continuous densities with fixed mean and variance $\sigma^2$, the one with the largest differential entropy is the Gaussian, and that this entropy is $\frac12\{1+\ln(2\pi\sigma^2)\}$. State the condition for equality.
(3) Express $\KL\big(\N(m,v)\Vert\N(\mu,s^2)\big)$ in terms of $m,v,\mu,s^2$, and for $p=\N(1,1)$, $q=\N(0,4)$ compute and compare $\KL(p\Vert q)$ and $\KL(q\Vert p)$.`,
        rubric: R`
- (1) $-\ln q$를 펼치고 $\E_p[(x-\mu)^2]=v+(m-\mu)^2$ 유도 — 4점
- (2) $q=\N(m,\sigma^2)$로 두면 $-\int p\ln q=\mathrm H[q]$이고 $\KL(p\Vert q)=\mathrm H[q]-\mathrm H[p]\ge0$ — 3점
- (2) 등호는 $p=q$일 때만이므로 최대는 가우시안 하나뿐 — 2점
- (3) 일반식 $\frac12\ln\frac{s^2}v+\frac{v+(m-\mu)^2}{2s^2}-\frac12$, 수치 $\ln2-\frac14\approx0.4431$, $2-\ln2\approx1.3069$와 비대칭 해석 — 3점`,
        sol: R`
**핵심.** 가우시안의 로그밀도는 $x$의 이차식이라 $p$에 대한 기댓값이 $p$의 1·2차 모멘트로만 정해집니다. 이 사실과 KL의 비음성(옌센 부등식)을 합치면 최대 엔트로피 성질이 나옵니다.

**(1)** $-\ln q(x)=\frac12\ln(2\pi s^2)+\frac{(x-\mu)^2}{2s^2}$. 양변에 $p(x)$를 곱해 적분하면($\int p=1$) $-\int p\ln q=\frac12\ln(2\pi s^2)+\frac{\E_p[(x-\mu)^2]}{2s^2}$. $x-\mu=(x-m)+(m-\mu)$로 쪼개면 $\E_p[(x-\mu)^2]=\E_p[(x-m)^2]+2(m-\mu)\E_p[x-m]+(m-\mu)^2=v+0+(m-\mu)^2$.

**(2)** 평균 $m$, 분산 $\sigma^2$인 임의의 $p$에 대해 $q=\N(m,\sigma^2)$를 잡습니다. (1)에서 $\mu=m$, $s^2=v=\sigma^2$이면 $-\int p\ln q=\frac12\ln(2\pi\sigma^2)+\frac12$이고, $p=q$로 두면 이것이 곧 $\mathrm H[q]=\frac12\{1+\ln(2\pi\sigma^2)\}$입니다. 따라서 KL의 정의에서
$$\KL(p\Vert q)=-\int p\ln q-\Big(-\int p\ln p\Big)=\mathrm H[q]-\mathrm H[p]\ge0,$$
즉 $\mathrm H[p]\le\frac12\{1+\ln(2\pi\sigma^2)\}$. 등호는 $\KL(p\Vert q)=0$, 곧 $p=q$일 때만 성립하므로 최대를 주는 분포는 가우시안 하나뿐입니다.

**(3)** (1)의 값에서 $\mathrm H[p]=\frac12\{1+\ln(2\pi v)\}$를 빼면
$$\KL\big(\N(m,v)\Vert\N(\mu,s^2)\big)=\frac12\ln\frac{s^2}{v}+\frac{v+(m-\mu)^2}{2s^2}-\frac12.$$
$p=\N(1,1)$, $q=\N(0,4)$: $\KL(p\Vert q)=\frac12\ln4+\frac{1+1}8-\frac12=\ln2-\frac14\approx0.4431$. 반대로 $\KL(q\Vert p)=\frac12\ln\frac14+\frac{4+1}2-\frac12=2-\ln2\approx1.3069$. 넓은 $q$의 질량이 좁은 $p$가 거의 0인 꼬리까지 퍼져 있어서, $q$를 $p$로 근사하는 쪽의 손실이 훨씬 큽니다. KL은 대칭이 아닙니다.

**검산.** $m=\mu$, $v=s^2$이면 (3)의 식이 $0$입니다. 또 분산이 $\frac{a^2}{12}$인 균등분포 $U(0,a)$의 엔트로피는 $\ln a$이고, 같은 분산의 가우시안은 $\ln a+\frac12\{1+\ln\frac\pi6\}\approx\ln a+0.1765$로 더 큽니다.

**답.** (2) $\mathrm H[p]\le\frac12\{1+\ln(2\pi\sigma^2)\}$, 등호는 $p=\N(m,\sigma^2)$ (3) $\KL(p\Vert q)\approx0.4431$, $\KL(q\Vert p)\approx1.3069$

관련: [[ch05:2.5b|KL 발산]], [[ch05:2.5|정보량, 엔트로피, 미분 엔트로피]]
` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 4, q: R`After a drug is given, the change in blood pressure $x$ follows $\N(\mu,\sigma^2)$ with $\sigma^2=1$ known. The measurements for 4 patients are $1.2,\ 0.8,\ 1.5,\ 0.5$, and the effect $\mu$ is given the prior $\N(\mu\mid0,s^2)$ with $s^2=0.5$. Find $\mu_{\text{MAP}}$. (fraction or 4 decimal places)`, ans: '2/3', ansTex: R`\mu_{\text{MAP}}=\tfrac4{4+2}=\tfrac23\approx0.6667`,
        sol: R`
**핵심.** 가능도를 $\mu$의 함수로 보면 $\N(\mu\mid\bar x,\sigma^2/N)$ 모양의 가우시안입니다. 따라서 가중치 하나의 MAP 공식 $\mu_{\text{MAP}}=\frac{s^2}{s^2+v}\,\mu_{\text{ML}}$ ($v=\sigma^2/N$)을 쓸 수 있습니다.

1. $\mu_{\text{ML}}=\bar x=\frac{1.2+0.8+1.5+0.5}4=1$.
2. 가능도의 $\mu$ 의존 부분: $\sum_n(x_n-\mu)^2=\sum_n(x_n-\bar x)^2+N(\bar x-\mu)^2$이므로 $\prod_n\N(x_n\mid\mu,\sigma^2)\propto\exp\{-\frac N{2\sigma^2}(\mu-\bar x)^2\}$, 즉 분산 $v=\sigma^2/N=0.25$.
3. $-\ln(\text{사후})=\frac{(\mu-1)^2}{2(0.25)}+\frac{\mu^2}{2(0.5)}+\text{const}$를 미분해 0으로 두면 $4(\mu-1)+2\mu=0$ → $\mu=\frac46=\frac23$.

**답.** $\mu_{\text{MAP}}=\frac23\approx0.6667$

**자주 하는 실수.** 가능도 분산을 한 점의 분산 $\sigma^2=1$로 쓰면 $\frac{0.5}{1.5}=\frac13$이 나옵니다. 자료가 $N$개 모이면 가능도의 정밀도가 $N/\sigma^2$로 $N$배 커집니다.

**검산.** 정밀도 가중 평균으로: $\frac{(N/\sigma^2)\bar x+(1/s^2)\cdot0}{N/\sigma^2+1/s^2}=\frac{4\cdot1}{4+2}=\frac23$. $N\to\infty$이면 자료의 정밀도가 지배해 $\mu_{\text{MAP}}\to\bar x$이고, $s^2\to\infty$(평평한 사전분포)이면 MLE와 같아집니다. 지수가 $\mu$의 이차식이라 사후분포도 가우시안이므로 이 값은 사후평균이기도 합니다.

관련: [[ch06:2.6b|MAP 추정과 규제]]
` },
      { ch: 'ch06', type: 'mc', lv: 3, pts: 3, q: R`A parameter $\mu$ is estimated from data $\mathcal D$. Of the following four statements about the MAP estimate $\mu_{\text{MAP}}$, which maximizes the posterior distribution $p(\mu\mid\mathcal D)$, choose the one that is true.`,
        choices: [
          R`If the prior is constant (uniform) over the range of the parameter, the MAP estimate equals the maximum likelihood estimate`,
          R`If the parameter is reparameterized, e.g. $\eta=\ln\frac{\mu}{1-\mu}$, and the MAP estimate is found from the posterior density of $\eta$, the result is always the transformed value of $\mu_{\text{MAP}}$`,
          R`Regardless of the shape of the posterior, the MAP estimate equals the posterior mean`,
          R`MAP estimation with a Laplace prior $p(w_i)\propto e^{-\lvert w_i\rvert/b}$ gives $L_2$ regularization`,
        ], ans: 0,
        sol: R`
**핵심.** $p(\mu\mid\mathcal D)\propto p(\mathcal D\mid\mu)\,p(\mu)$이므로 $p(\mu)$가 상수면 사후분포와 가능도의 최대점이 같습니다. MAP은 사후 **밀도**의 최빈값이라 밀도 변환의 성질을 그대로 물려받습니다.

1. ① $p(\mu)=c$이면 $\argmax_\mu c\,p(\mathcal D\mid\mu)=\argmax_\mu p(\mathcal D\mid\mu)$ (참).
2. ② $\eta$의 밀도는 $p_\eta(\eta)=p_\mu(\mu)\lvert d\mu/d\eta\rvert$로 야코비안이 곱해집니다. 밀도의 최빈값은 변환을 따라가지 않으므로 일반적으로 다른 점이 나옵니다(거짓).
3. ③ 대칭인 단봉 분포가 아니면 다릅니다. 균등 사전분포에서 앞면 3번이면 사후 $4\mu^3$의 최빈값은 1, 평균은 0.8입니다(거짓).
4. ④ $-\ln p(\mathbf w)=\frac1b\sum_i\lvert w_i\rvert+$상수이므로 $L_1$ 규제(라쏘)입니다(거짓).

**답.** ①

**보기 검토.** ① 정답. ② 최빈값이 매개화에 의존하는 것이 MAP의 약점입니다. 사후분포 전체로 평균내는 예측은 적분이라 변수를 바꿔도 야코비안이 상쇄되어 이런 문제가 없습니다. ③ 평균과 최빈값을 혼동했습니다. ④ $L_2$는 영평균 가우시안 사전분포에서 나옵니다.

관련: [[ch06:2.6b|MAP 추정과 규제]], [[ch05:2.4|확률밀도의 변환]]
` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 4, q: R`The response rate $\mu$ of a new treatment is taken to be one of three values $0.2,\ 0.5,\ 0.8$, with prior probabilities $0.25,\ 0.5,\ 0.25$ respectively. Three patients were treated, with outcomes response, response, no response (patients independent). Using the fully Bayesian prediction, find the probability $p(x_4=1\mid\mathcal D)$ that the next patient responds. (4 decimal places)`, ans: '0.05845/0.1025', ansTex: R`\tfrac{0.05845}{0.1025}\approx0.5702`,
        sol: R`
**핵심.** 사후 ∝ 가능도 × 사전으로 세 후보의 사후확률을 구하고, 예측분포 $p(x_4=1\mid\mathcal D)=\sum_\mu p(x_4=1\mid\mu)\,p(\mu\mid\mathcal D)=\sum_\mu\mu\,p(\mu\mid\mathcal D)$를 계산합니다(후보가 유한하므로 적분 대신 합).

1. 가능도 $\mu^2(1-\mu)$: $\mu=0.2\to0.032$, $0.5\to0.125$, $0.8\to0.128$.
2. 가능도 × 사전: $0.008$, $0.0625$, $0.032$. 합(증거) $p(\mathcal D)=0.1025$.
3. 사후확률: $0.0780$, $0.6098$, $0.3122$.
4. 예측: $\frac{0.2(0.008)+0.5(0.0625)+0.8(0.032)}{0.1025}=\frac{0.0016+0.03125+0.0256}{0.1025}=\frac{0.05845}{0.1025}\approx0.5702$.

**답.** $\approx0.5702$

**비교.** 후보를 제한하지 않은 MLE는 $\frac23$, 세 후보 중 가능도가 가장 큰 값은 $0.8$입니다. MAP은 사후확률이 가장 큰 $\mu=0.5$라서 그 값을 꽂은 예측은 $0.5$입니다. 완전 베이지안 예측은 세 후보의 예측을 사후확률로 평균해 그 사이의 값을 냅니다.

**자주 하는 실수.** 사전확률을 빼고 가능도만 정규화하면 $\frac{0.2(0.032)+0.5(0.125)+0.8(0.128)}{0.285}=\frac{0.1713}{0.285}\approx0.6011$이 됩니다. 증거로 나누는 것을 잊으면 $0.05845$처럼 터무니없이 작은 값이 나옵니다.

**검산.** 사후확률의 합 $0.0780+0.6098+0.3122=1$. 예측값은 후보의 최솟값 $0.2$와 최댓값 $0.8$ 사이에 있어야 합니다.

관련: [[ch06:2.6c|완전 베이지안 머신러닝]], [[ch06:2.6|모수의 불확실성과 사후분포]]
` },
      { ch: 'ch06', type: 'open', lv: 3, pts: 12, q: R`A new diagnostic-assistance AI was tested on 5 difficult cases and got 4 right. Put a uniform prior $p(\mu)=1$ ($0\le\mu\le1$) on its accuracy $\mu$, and treat each case as an independent Bernoulli trial.
(1) Write the posterior distribution $p(\mu\mid\mathcal D)$ including its normalization constant, and verify that it integrates to 1.
(2) Find the MLE, the MAP estimate and the posterior mean, and explain why the MAP estimate equals the MLE.
(3) Derive, using the sum and product rules, the predictive probability $p(x_6=1\mid\mathcal D)$ that the next case is answered correctly, and find its value.
(4) Find the predictive probability that the next two cases are **both** answered correctly, compare it with the plug-in MLE value $\mu_{\text{ML}}^2$ and with $\{p(x_6=1\mid\mathcal D)\}^2$, and explain the differences.`,
        rubric: R`
- (1) $p(\mu\mid\mathcal D)=30\mu^4(1-\mu)$, 증거 $\frac1{30}$로 적분이 1임을 확인 — 3점
- (2) MLE와 MAP 모두 $\frac45$ (사전분포가 상수), 사후평균 $\frac57$ — 3점
- (3) $p(x_6=1\mid\mathcal D)=\int\mu\,p(\mu\mid\mathcal D)d\mu=\frac57$, $\mu$가 주어지면 새 증례가 자료와 독립임을 사용 — 3점
- (4) $\E[\mu^2\mid\mathcal D]=\frac{15}{28}\approx0.5357$을 $0.64$, $\frac{25}{49}$와 비교하고 $\Var[\mu\mid\mathcal D]$로 설명 — 3점`,
        sol: R`
**핵심.** 사후 ∝ 가능도 × 사전. 가능도 $\mu^4(1-\mu)$에 상수 사전분포를 곱하면 사후분포는 베타분포 $\operatorname{Beta}(5,2)$ 모양입니다. 예측은 사후분포로 모수를 평균내는 적분입니다.

**(1)** 가능도 $p(\mathcal D\mid\mu)=\mu^4(1-\mu)$, 증거 $p(\mathcal D)=\int_0^1\mu^4(1-\mu)d\mu=\frac15-\frac16=\frac1{30}$. 따라서 $p(\mu\mid\mathcal D)=30\mu^4(1-\mu)$이고, 단원의 공식 $\frac{(N+1)!}{m!\,(N-m)!}=\frac{6!}{4!\,1!}=30$과 같습니다. $\int_0^130\mu^4(1-\mu)d\mu=30\cdot\frac1{30}=1$.

**(2)** MLE: $\frac{d}{d\mu}\{4\ln\mu+\ln(1-\mu)\}=\frac4\mu-\frac1{1-\mu}=0$ → $\mu_{\text{ML}}=\frac45$. MAP: 사후분포는 가능도에 상수 30을 곱한 것뿐이라 최대점이 같아 $\mu_{\text{MAP}}=\frac45$입니다(균등 사전분포는 어느 값도 선호하지 않음). 사후평균: $\E[\mu\mid\mathcal D]=30\int_0^1\mu^5(1-\mu)d\mu=30\big(\frac16-\frac17\big)=\frac{30}{42}=\frac57\approx0.7143$, 공식 $\frac{m+1}{N+2}$과 같습니다.

**(3)** 합의 규칙으로 $\mu$를 끌어들이고 곱의 규칙으로 나누면 $p(x_6=1\mid\mathcal D)=\int p(x_6=1\mid\mu,\mathcal D)\,p(\mu\mid\mathcal D)\,d\mu$. $\mu$가 주어지면 새 증례는 과거 자료와 독립이라 $p(x_6=1\mid\mu,\mathcal D)=\mu$이므로 $p(x_6=1\mid\mathcal D)=\E[\mu\mid\mathcal D]=\frac57\approx0.7143$.

**(4)** 같은 방법으로 $p(x_6=1,x_7=1\mid\mathcal D)=\int\mu^2p(\mu\mid\mathcal D)d\mu=30\big(\frac17-\frac18\big)=\frac{30}{56}=\frac{15}{28}\approx0.5357$. MLE를 꽂은 $0.8^2=0.64$는 과신한 값이고, $\big(\frac57\big)^2=\frac{25}{49}\approx0.5102$는 두 예측을 독립으로 곱한 값입니다. 차이 $\frac{15}{28}-\frac{25}{49}=\frac{35}{1372}\approx0.0255$는 $\E[\mu^2]=\Var[\mu]+\E[\mu]^2$의 $\Var[\mu\mid\mathcal D]$입니다. $\mu$를 모르는 동안 두 증례는 같은 $\mu$를 공유해 양의 상관을 가지므로(첫 증례를 맞히면 $\mu$가 클 가능성이 커짐) 독립 곱보다 큽니다.

**답.** (1) $30\mu^4(1-\mu)$ (2) $\frac45$, $\frac45$, $\frac57$ (3) $\frac57\approx0.7143$ (4) $\frac{15}{28}\approx0.5357$

관련: [[ch06:2.6|모수의 불확실성과 사후분포]], [[ch06:2.6c|완전 베이지안 머신러닝]]
` },
    ],
  });
})();
