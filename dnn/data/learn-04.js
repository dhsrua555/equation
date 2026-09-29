/* 개념 정리 — 04 확률적 회귀, 규제, 커널 (1주차 수요일 슬라이드 45–68, 2주차 수요일 필기).
   과적합을 눈으로 보고, 규제가 왜 효과가 있는지(MAP, 수축, 제약 영역)를 세 방향에서 설명한 뒤 커널까지 이어 갑니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 4,
    summary: R`선형회귀를 확률 모델로 다시 읽으면 **최소제곱 = 가우시안 잡음의 최대가능도**입니다. 특성을 $1,x,x^2,\dots$로 늘린 다항회귀는 여전히 선형회귀지만 차수가 높으면 **과적합**이 일어나고, 계수에 벌점을 주는 **규제**(릿지·라쏘)가 이를 막습니다. 릿지는 가우시안 사전분포의 MAP이고, 해는 항상 유일합니다. 마지막으로 특성을 고차원으로 올려도 **내적만** 있으면 계산할 수 있다는 **커널 트릭**을 써서, 푸시스루 항등식으로 커널 릿지 회귀를 유도합니다(수업의 두 점 예제 $35/69$).`,
    goals: [
      R`가우시안 잡음 가정에서 로그가능도를 전개해 최소제곱 = MLE임을 보이고 $\hat\sigma^2$을 구할 수 있다`,
      R`다항회귀가 선형회귀인 이유와 과적합·일반화·검증 오차를 설명할 수 있다`,
      R`릿지 해 $(\lambda I+X^TX)^{-1}X^Ty$를 유도하고 항상 가역인 이유, MAP과의 관계($\lambda=\sigma^2/\tau^2$)를 설명할 수 있다`,
      R`라쏘가 희소해를 만드는 이유를 제약 영역의 모양으로 설명할 수 있다`,
      R`커널의 정의와 다항·가우시안 커널을 알고, 그람 행렬이 양의 준정부호임을 보일 수 있다`,
      R`푸시스루 항등식을 증명하고 커널 릿지 예측식 $K(x,X)(\lambda I+K)^{-1}y$를 두 가지 방법으로 유도·계산할 수 있다`,
    ],
    sections: [
      { k: '4.1', src: 'W1 수 · 슬라이드 45–48', title: '선형회귀의 확률적 해석: 최소제곱 = 최대가능도', body: R`
:::idea 쉽게 말하면
1단원에서는 “제곱오차가 작으면 좋다”고 그냥 정했습니다. 이 절은 그 선택을 확률로 정당화합니다. “측정값은 참된 직선 위의 값에 **종 모양(정규분포) 잡음**이 더해진 것”이라고 가정하면, 관측된 자료를 가장 그럴듯하게 만드는 직선이 바로 제곱오차를 최소로 하는 직선입니다.
:::

1단원의 모델에 오차의 분포를 가정합니다.
$$Y=\beta_0+\sum_{j=1}^k\beta_jx_j+\varepsilon,\qquad \varepsilon\sim\N(0,\sigma^2)\ \text{i.i.d.}$$
$h_i(\beta)=\beta_0+\sum_j\beta_jx_{ij}$로 쓰면 $y_i=h_i(\beta)+\varepsilon_i$이고, 정규분포에 상수를 더하면 평균만 옮겨지므로 $y_i\mid x_i\sim\N(h_i(\beta),\sigma^2)$입니다. 자료들이 독립이라 가능도는 밀도의 곱입니다.
$$\prod_{i=1}^n\frac1{\sqrt{2\pi}\,\sigma}\exp\Big(-\frac{(y_i-h_i(\beta))^2}{2\sigma^2}\Big).$$

:::key 최소제곱 = 가우시안 MLE
$$\log p(y_1,\dots,y_n\mid x_1,\dots,x_n,\beta)=-n\log(\sqrt{2\pi}\,\sigma)-\sum_{i=1}^n\frac{(y_i-h_i(\beta))^2}{2\sigma^2}$$
$\beta$에 대해 최대로 하려면 $\sum_i(y_i-h_i(\beta))^2=f(\beta)$를 최소로 하면 된다. 따라서 LSE는 MLE이다.
:::

**한 줄씩.** 곱의 로그는 로그의 합이고, $\log\big(\frac1{\sqrt{2\pi}\sigma}e^{-u}\big)=-\log(\sqrt{2\pi}\sigma)-u$입니다. 첫 항은 $\beta$와 무관한 상수, 둘째 항은 $-\frac1{2\sigma^2}\times$(제곱오차합). 양수 $\frac1{2\sigma^2}$을 곱한 것은 최소점을 바꾸지 않으므로, $\sigma$를 몰라도 $\hat\beta$는 같습니다.

$\sigma^2$도 추정하면 로그가능도를 $\sigma^2$로 미분해 $-\frac n{2\sigma^2}+\frac{f(\hat\beta)}{2\sigma^4}=0$에서 $\hat\sigma^2_{\text{MLE}}=\frac1n\sum_i(y_i-h_i(\hat\beta))^2=f(\hat\beta)/n$, 즉 평균제곱잔차입니다. 이 추정량은 편향되어 있습니다(분모 $n-k-1$이 불편).

:::ex 예제 1 — 잡음의 크기 추정
1단원 예제(점 4개, $f(\hat\beta)=0.70$, 모수 2개)에서 $\hat\sigma^2_{\text{MLE}}$와 불편추정량은?
---
$\hat\sigma^2_{\text{MLE}}=0.70/4=0.175$. 불편추정량은 $0.70/(4-2)=0.35$. 자료가 적으면 두 값의 차이가 큽니다. 직선이 자료에 맞춰졌기 때문에 잔차가 참 잡음보다 작게 나오는 것을 자유도 $n-2$로 보정합니다.
:::

:::warn 가정이 바뀌면 손실도 바뀝니다
LSE = MLE는 **가우시안** 잡음일 때의 결론입니다. 잡음이 라플라스 분포 $\propto e^{-\lvert\varepsilon\rvert/b}$이면 MLE는 절댓값 오차합 $\sum\lvert y_i-h_i\rvert$을 최소로 합니다.
:::

### 더 깊이: 손실함수는 잡음 모델의 선택

일반적으로 “손실 = 음의 로그가능도”입니다. 가우시안 → 제곱오차, 라플라스 → 절댓값 오차(중앙값 회귀, 이상치에 강함), 베르누이 → 교차 엔트로피(5단원 로지스틱 회귀), 범주형 → 소프트맥스 교차 엔트로피(6단원). 잡음의 분산이 자료마다 다르면($\sigma_i^2$) 가중 최소제곱 $\sum(y_i-h_i)^2/\sigma_i^2$이 MLE가 됩니다. 신경망의 손실함수를 고를 때도 “출력에 어떤 분포를 가정하는가”를 물으면 됩니다[[@med:ch04:2.3c|선형회귀의 확률적 해석.]].
` },
      { k: '4.2', src: 'W1 수 · 슬라이드 49–52, W2 수 필기', title: '다항회귀와 과적합', body: R`
:::idea 쉽게 말하면
시험 문제를 **이해하지 않고 답만 외운** 학생은 기출문제는 100점이지만 새 문제는 못 풉니다. 모델도 같습니다. 모수가 많아 자유로운 모델은 훈련 자료를 잡음까지 통째로 외워 훈련오차를 0으로 만들 수 있지만, 새 자료에서는 엉망이 됩니다. 이것이 **과적합**이고, 우리가 원하는 것은 새 자료에서의 성능, 즉 **일반화**입니다.
:::

$y=\beta_0+\beta_1x+\beta_2x^2+\cdots+\beta_Mx^M$처럼 특성을 $\{1,x,x^2,\dots,x^M\}$로 늘려도, **모수 $\beta$에 대해서는 선형**이므로 여전히 선형회귀입니다(필기). 설계행렬의 $i$번째 행이 $(1,x_i,x_i^2,\dots,x_i^M)$이 되고 해는 똑같이 $\hat\beta=(X^TX)^{-1}X^Ty$입니다[[@ml:ch07:9.2b|다항 회귀는 선형 회귀다.]].

슬라이드의 실험($\sin2\pi x$에서 뽑은 점 10개):

| 차수 $M$ | 1 | 3 | 5 | 9 |
|---|---|---|---|---|
| 훈련 MSE $f/n$ | 0.29 | 0.0096 | 0.0011 | $1.4\times10^{-22}$ |

$M=9$이면 모수 10개로 점 10개를 정확히 지나가 훈련오차가 사실상 0이지만, 점 사이에서 크게 출렁입니다(필기: $x\approx0.9$ 부근). 이것이 **과적합**입니다.

:::fig polyfit
:::

- **일반화**는 새 자료에 대한 성능입니다. 별도의 검증 자료로 $E_{\text{RMS}}=\sqrt{f(\beta)/n}$을 잽니다. (제곱근을 취해 $y$와 같은 단위로 만들고, $n$으로 나눠 자료 수가 다른 집합끼리 비교합니다.)
- $M\ge5$부터 훈련 곡선과 검증 곡선의 차이가 커집니다. 검증오차가 가장 작은 $M$(여기서는 5 부근)을 고릅니다.
- 자료가 많아지면 같은 $M=9$도 과적합이 덜합니다($n=10$ 대 $n=100$). 경험칙: 모수 하나당 자료 10개 정도.

**왜 $M=9$이면 정확히 지나가나.** 서로 다른 $x_i$ 10개에서 $1,x,\dots,x^9$로 만든 $10\times10$ 설계행렬(방데르몽드 행렬)은 가역이라 $X\beta=y$를 정확히 푸는 $\beta$가 있습니다. 잔차 0, 훈련 MSE 0 — 그러나 이것은 잡음까지 맞춘 결과입니다.

:::ex 예제 2 — 훈련/검증 나누기
자료 100개로 차수를 고르려 한다. 절차를 쓰세요.
---
(1) 자료를 훈련 70개, 검증 30개로 무작위로 나눕니다. (2) 후보 $M=0,1,\dots,9$마다 훈련 자료로 $\hat\beta$를 구합니다. (3) 각 $\hat\beta$의 검증 $E_{\text{RMS}}$를 잽니다. (4) 검증오차가 가장 작은 $M$을 고르고, 필요하면 전체 자료로 다시 맞춥니다. 검증 자료를 모델 선택에 썼으므로 최종 성능 보고용 **시험 자료**는 따로 떼어 두어야 합니다.
:::

### 더 깊이: 편향-분산 절충

같은 크기의 훈련 자료를 여러 번 새로 뽑아 모델을 맞춘다고 상상하면, 어떤 점 $x$에서의 예측 오차는 **편향²**(평균 예측이 참값에서 벗어난 정도) + **분산**(자료에 따라 예측이 흔들리는 정도) + 잡음으로 나뉩니다. 차수가 낮으면 편향이 크고(과소적합), 높으면 분산이 큽니다(과적합). 2.8절의 수축 추정량이 이 거래의 가장 단순한 예입니다[[ch02:2.8|수축하면 편향이 생기지만 분산이 줄어 MSE가 작아질 수 있음.]]. 요즘의 매우 큰 신경망에서는 모수가 자료보다 훨씬 많은데도 검증오차가 다시 내려가는 **이중 하강**이 관찰되어, 이 절충이 전부는 아니라는 것도 알려져 있습니다[[@med:ch11:9.3|학습 곡선, 조기 종료, 이중 하강.]].
` },
      { k: '4.3', src: 'W1 수 · 슬라이드 53–58, W2 수 필기', title: '규제: 릿지와 라쏘', body: R`
:::idea 쉽게 말하면
과적합된 다항식은 계수가 수만, 수십만처럼 엄청나게 크고, 큰 양수와 큰 음수가 서로 상쇄하며 점들을 억지로 지나갑니다. 그래서 “오차를 줄이되 **계수가 커지면 벌점**을 준다”는 규칙을 더합니다. 벌점의 세기 $\lambda$가 “자료를 믿는 정도”와 “단순함을 선호하는 정도”를 맞바꾸는 손잡이입니다.
:::

과적합된 모델은 계수의 크기가 매우 큽니다. 슬라이드의 $M=9$ 계수표:

| | $\ln\lambda=-36.8$ | $\ln\lambda=-16.1$ | $\ln\lambda=0$ |
|---|---|---|---|
| $\beta_0$ | 0.0595 | 0.4318 | 0.0518 |
| $\beta_2$ | 769.8 | −19.60 | −0.432 |
| $\beta_6$ | 130036.2 | −36.51 | 0.0575 |
| $\beta_9$ | −1437.7 | −48.28 | 0.2105 |

$\lambda\to0$($\ln\lambda\to-\infty$)이면 과적합, $\ln\lambda=0$이면 너무 눌려 과소적합입니다. 규제가 있으면 훈련·검증 오차가 비슷한 추세를 보입니다.

:::def 규제된 목적함수
$$J=\frac12f(\beta)+\frac\lambda2\sum_{j=0}^M\lvert\beta_j\rvert^q$$
$q=2$: **릿지**(가중치 감쇠, 계수 축소), $q=1$: **라쏘**(일부 계수를 정확히 0으로 만들어 희소).
:::

### 릿지 해의 유도

$J(\beta)=\frac12(y-X\beta)^T(y-X\beta)+\frac\lambda2\beta^T\beta$. 1단원 계산에서 첫 항의 기울기는 $\frac12(-2X^Ty+2X^TX\beta)=X^TX\beta-X^Ty$, 둘째 항은 $\frac\lambda2\cdot2\beta=\lambda\beta$.

:::key 릿지 회귀의 해
$$J(\beta)=\frac12(y-X\beta)^T(y-X\beta)+\frac\lambda2\beta^T\beta,\qquad \nabla J=X^TX\beta-X^Ty+\lambda\beta=0$$
$$\hat\beta_{\text{ridge}}=(\lambda I+X^TX)^{-1}X^Ty$$
$\lambda>0$이면 $\lambda I+X^TX$는 양의 정부호라 **항상** 가역이다.
:::

가역성: $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$ ($v\ne0$). 1단원에서 $X^TX$가 특이해 해가 유일하지 않던 경우($n<k+1$ 등)도 릿지는 유일한 해를 줍니다. 헤시안 $\lambda I+X^TX\succ0$이라 $J$는 강볼록이고, 기울기 0인 점이 유일한 최솟점입니다.

:::ex 예제 3 — 릿지가 계수를 줄이는 모습
$(x,y)=(0,1),(1,2),(2,4)$에 $y=\beta_0+\beta_1x$를 맞출 때, $\lambda=0$과 $\lambda=1$ (두 계수 모두 규제)의 해를 비교하세요.
---
$X^TX=\begin{pmatrix}3&3\\3&5\end{pmatrix}$, $X^Ty=(7,10)^T$.
$\lambda=0$: $\det=6$, $\hat\beta=\frac16(5\cdot7-3\cdot10,\ -3\cdot7+3\cdot10)=(\tfrac56,\ \tfrac32)\approx(0.833,1.5)$.
$\lambda=1$: $\begin{pmatrix}4&3\\3&6\end{pmatrix}$, $\det=15$, $\hat\beta=\frac1{15}(6\cdot7-3\cdot10,\ -3\cdot7+4\cdot10)=(0.8,\ 1.267)$.
두 계수가 모두 0 쪽으로 줄었습니다. 실전에서는 절편 $\beta_0$은 규제하지 않는 경우가 많습니다(자료를 위아래로 옮기면 답이 달라지는 것을 막기 위해).
:::

### 확률적 해석: 가우시안 사전분포의 MAP

잡음 $\N(0,\sigma^2)$, 사전분포 $\beta\sim\N(0,\tau^2I)$이면 로그 사후분포는 $-\frac1{2\sigma^2}\lVert y-X\beta\rVert^2-\frac1{2\tau^2}\lVert\beta\rVert^2+$상수. $\sigma^2$을 곱하면 $-\big[\frac12\lVert y-X\beta\rVert^2+\frac{\sigma^2}{2\tau^2}\lVert\beta\rVert^2\big]$이므로 **$\lambda=\sigma^2/\tau^2$인 릿지**입니다[[ch02:2.6|MAP에서 $\beta\sim\N(0,\tau^2I)$이면 $\lambda=\sigma^2/\tau^2$인 릿지.]]. 사전분포가 좁을수록($\tau^2$ 작음) 규제가 셉니다. Problem Set 1의 문제 2는 $X$가 모두 1인 열 하나($\beta=\theta$), $\sigma^2=1$인 특수한 경우로, $\lambda=1/\tau^2$입니다[[ch02:2.8|가우시안 평균의 MAP = 릿지, 수축 계수 $n\tau^2/(n\tau^2+1)$.]]. 의료 인공지능 과목에서는 같은 식을 가중치 감쇠로 부릅니다[[@med:ch11:9.2|가중치 감쇠 $\tilde E=E+\frac\lambda2w^Tw$, 기울기에 $\lambda w$가 더해집니다.]].

### 라쏘와 희소성

$q=1$이면 벌점 $\lvert\beta_j\rvert$가 0에서 미분 불가능해 식 하나로 풀리지 않지만, 대신 **일부 계수를 정확히 0**으로 만듭니다(변수 선택). 이유는 그림으로 보는 것이 가장 쉽습니다. 규제된 문제는 라그랑주 승수 관점에서 “$\sum\lvert\beta_j\rvert^q\le t$라는 영역 안에서 제곱오차를 최소화”와 같습니다.

:::fig l1l2
:::

1차원에서 계산으로도 보입니다. $\min_\beta\frac12(\beta-z)^2+\lambda\lvert\beta\rvert$의 해는 **연성 임계값** $\hat\beta=\operatorname{sign}(z)\max(\lvert z\rvert-\lambda,0)$입니다: $\lvert z\rvert\le\lambda$이면 정확히 0. 같은 문제의 릿지 버전 $\frac12(\beta-z)^2+\frac\lambda2\beta^2$의 해는 $\hat\beta=\frac z{1+\lambda}$로, 줄어들기만 할 뿐 0이 되지 않습니다.

### 더 깊이: 특잇값으로 본 릿지

$X=UDV^T$ (특잇값 분해, $d_j$는 특잇값)로 쓰면
$$X\hat\beta_{\text{ridge}}=\sum_j u_j\,\frac{d_j^2}{d_j^2+\lambda}\,u_j^Ty.$$
최소제곱($\lambda=0$)은 각 방향 $u_j$로의 사영을 그대로 쓰고, 릿지는 방향마다 $\frac{d_j^2}{d_j^2+\lambda}$배로 **줄입니다**. 특잇값이 작은 방향(자료가 거의 퍼져 있지 않아 잡음에 휘둘리는 방향)일수록 많이 줄어듭니다. 그래서 릿지는 “불안정한 방향을 골라 누르는” 규제입니다. 유효 자유도 $\sum_j\frac{d_j^2}{d_j^2+\lambda}$는 $\lambda=0$이면 모수 수, $\lambda\to\infty$이면 0입니다[[@ml:ch10:13.1b|릿지 회귀와 안정성.]].
` },
      { k: '4.4', src: 'W1 수 · 슬라이드 59–60', title: '커널 트릭', body: R`
:::idea 쉽게 말하면
평면 위의 점들이 “원 안쪽”과 “원 바깥쪽”으로 나뉘어 있으면 직선 하나로는 못 가릅니다. 그런데 각 점에 “원점에서의 거리 제곱”이라는 **새 좌표**를 하나 더 붙여 3차원으로 올리면, 안쪽 점은 아래, 바깥 점은 위에 떠서 평평한 판 하나로 나뉩니다. 차원을 올리면 선형 모델도 복잡한 경계를 그릴 수 있습니다. 문제는 차원이 너무 커지면 계산이 불가능하다는 것인데, **내적만 필요하다면** 고차원 좌표를 실제로 만들지 않고도 계산할 수 있습니다. 이것이 커널 트릭입니다.
:::

평면에서 두 종류의 점을 직선으로 나눌 수 없어도, 표본을 더 높은 차원의 **특성공간**으로 보내는 사상 $x\mapsto\varphi(x)$를 쓰면 선형으로 분리될 수 있습니다. 예를 들어 원 안쪽과 바깥쪽의 점은 $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$로 보내면 평면 $z_1+z_2=r^2$으로 나뉩니다.

:::fig lift
:::

특성공간에서의 선형모델은 $f(x)=\varphi(x)^T\beta$이고, 학습과 예측에는 $\varphi$ 자체가 아니라 내적만 필요하다는 것이 핵심입니다[[@ml:ch13:16.2|표현자 정리: 손실이 내적들에만 기대고 규제가 노름의 증가함수이면 최적해가 훈련점들의 결합이라 내적만으로 계산됩니다.]].

:::def 커널
$$K(x_i,x_j)=\varphi(x_i)^T\varphi(x_j)$$
새 공간의 차원(무한일 수도 있음)은 중요하지 않습니다. 커널은 두 점의 **유사도**를 잽니다.
:::

### 계산량으로 보는 이득

$x\in\mathbb R^d$에서 모든 2차 항 $x_ix_j$를 특성으로 만들면 차원이 약 $d^2/2$입니다. $d=1000$이면 약 50만 차원 — 특성벡터 두 개의 내적에 50만 번의 곱셈. 그런데 $(x^Tz)^2$은 $d=1000$번의 곱셈으로 계산한 내적을 제곱하기만 하면 같은 값입니다. 가우시안 커널은 특성공간이 **무한차원**이라 특성을 만드는 것 자체가 불가능하지만, 커널 값은 $\exp(-\lVert x-z\rVert^2/2\sigma^2)$로 바로 계산됩니다.

:::ex 예제 4 — 특성 대신 커널로 내적 계산
$x=(1,2)$, $z=(3,-1)$일 때 $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$로 $\varphi(x)^T\varphi(z)$를 직접 계산하고 $(x^Tz)^2$과 비교하세요.
---
$\varphi(x)=(1,4,2\sqrt2)$, $\varphi(z)=(9,1,-3\sqrt2)$. 내적 $9+4-12=1$. 한편 $x^Tz=3-2=1$, 제곱 $1$. 같습니다.
:::
` },
      { k: '4.5', src: 'W1 수 · 슬라이드 61–66, W2 수 필기', title: '커널 릿지 회귀', body: R`
:::idea 쉽게 말하면
릿지 회귀를 특성공간에서 하면 답이 “훈련점들의 특성벡터를 적당히 섞은 것”이 됩니다. 그래서 새 점의 예측은 “새 점이 각 훈련점과 **얼마나 비슷한가**(커널)”에 가중치를 곱해 더한 것입니다: $f^*(x)=\sum_i\alpha_iK(x,x_i)$. 가중치 $\alpha$는 훈련점끼리의 유사도 표(그람 행렬)만으로 구합니다.
:::

특성행렬을 $\varphi(X)=[\varphi(x_1)\ \cdots\ \varphi(x_n)]$(열로 쌓은 $d\times n$ 행렬)로 쓰면 예측 벡터는 $\varphi(X)^T\beta$이고
$$J=\frac12\big(y-\varphi(X)^T\beta\big)^T\big(y-\varphi(X)^T\beta\big)+\frac\lambda2\beta^T\beta.$$
4.3절과 같은 계산($X$ 자리에 $\varphi(X)^T$)으로 $\nabla J=-\varphi(X)y+\varphi(X)\varphi(X)^T\beta+\lambda\beta=0$, 즉
$$\beta^*=\big(\lambda I+\varphi(X)\varphi(X)^T\big)^{-1}\varphi(X)y.$$
이 식에는 $d\times d$ 역행렬이 있어 특성 차원이 크면 계산할 수 없습니다. 여기서 행렬을 “밀어 넣는” 항등식을 씁니다.

:::key 푸시스루 항등식
$$\begin{aligned}&(\lambda I_d+\varphi\varphi^T)\varphi=\varphi(\lambda I_n+\varphi^T\varphi)\\\Longrightarrow\ &(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}\qquad(\lambda>0)\end{aligned}$$
:::

첫 식은 양변을 전개하면 둘 다 $\lambda\varphi+\varphi\varphi^T\varphi$입니다. 왼쪽에 $(\lambda I_d+\varphi\varphi^T)^{-1}$, 오른쪽에 $(\lambda I_n+\varphi^T\varphi)^{-1}$을 곱하면 둘째 식이 됩니다(두 행렬 모두 $\lambda>0$이면 양의 정부호라 가역). 즉 $A\varphi=\varphi B$에서 $\varphi B^{-1}=A^{-1}\varphi$를 얻는 것입니다: $A^{-1}(A\varphi)B^{-1}=A^{-1}(\varphi B)B^{-1}$.

:::key 커널 릿지 회귀
$$\beta^*=\varphi(X)\big(\lambda I+\varphi(X)^T\varphi(X)\big)^{-1}y,$$
$$f^*(x)=\varphi(x)^T\beta^*=K(x,X)\big(\lambda I+K(X,X)\big)^{-1}y$$
$K(x,X)=[K(x,x_1)\ \cdots\ K(x,x_n)]$ ($1\times n$), $K(X,X)=[K(x_i,x_j)]$ ($n\times n$ 그람 행렬). $\alpha^*=(\lambda I+K)^{-1}y$로 두면 $f^*(x)=K(x,X)\alpha^*=\sum_i\alpha_i^*K(x,x_i)$, $\beta^*=\varphi(X)\alpha^*$.
:::

**한 줄씩.** $\varphi(x)^T\varphi(X)=[\varphi(x)^T\varphi(x_1)\ \cdots]=K(x,X)$, $\varphi(X)^T\varphi(X)=[\varphi(x_i)^T\varphi(x_j)]=K(X,X)$. 역행렬이 $n\times n$으로 바뀌어 특성 차원 $d$가 무한이어도 계산됩니다.

:::hand 수업 필기 — α로 바꿔 푸는 두 번째 유도
$\beta=\varphi(X)\alpha$로 두면 $\varphi(X)^T\beta=K\alpha$, $\beta^T\beta=\alpha^TK\alpha$ ($K=\varphi(X)^T\varphi(X)$, 대칭)이므로
$$\begin{aligned}J&=\tfrac12\big(y^Ty-y^TK\alpha-\alpha^TKy+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha\\&=\tfrac12\big(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha.\end{aligned}$$
$$\nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big)=0,$$
$$\alpha^*=(K+\lambda I)^{-1}y.$$
첫 번째 유도와 같은 $f^*$가 나옵니다.
:::

**$\beta=\varphi(X)\alpha$로 둬도 되는 이유.** 임의의 $\beta$를 “$\varphi(x_i)$들이 펼치는 공간” 성분 $\varphi(X)\alpha$와 그에 수직인 성분 $\beta_\perp$로 나누면, $\beta_\perp$는 모든 훈련점과 내적이 0이라 오차항을 바꾸지 않고 $\lVert\beta\rVert^2$만 키웁니다. 그러므로 최적해에서는 $\beta_\perp=0$ (표현자 정리). 또 $K$가 특이하면 $K((K+\lambda I)\alpha-y)=0$의 해가 여럿일 수 있지만, 모두 같은 예측을 주고 $\alpha^*=(K+\lambda I)^{-1}y$가 그중 하나입니다.

:::ex 예제 5 — 두 점의 커널 릿지 (수업 필기)
$\varphi(x_1,x_2)=(x_1^2,x_2^2,\sqrt2x_1x_2)$, 즉 $K(x,z)=(x^Tz)^2$. 자료 $x_1=(1,1),\,y_1=3$과 $x_2=(2,0),\,y_2=2$, $\lambda=1$일 때 $x_t=(1,0)$에서의 예측값은?
---
$K(x_1,x_1)=(1+1)^2=4$, $K(x_1,x_2)=(2+0)^2=4$, $K(x_2,x_2)=4^2=16$이므로 $K=\begin{pmatrix}4&4\\4&16\end{pmatrix}$.
$\lambda I+K=\begin{pmatrix}5&4\\4&17\end{pmatrix}$, 행렬식 $85-16=69$.
$$\alpha^*=\frac1{69}\begin{pmatrix}17&-4\\-4&5\end{pmatrix}\begin{pmatrix}3\\2\end{pmatrix}=\frac1{69}\begin{pmatrix}43\\-2\end{pmatrix}$$
$K(x_t,X)=[(1\cdot1+0\cdot1)^2,\ (1\cdot2+0\cdot0)^2]=[1,\ 4]$.
$$f^*(x_t)=[1\ \ 4]\cdot\frac1{69}\begin{pmatrix}43\\-2\end{pmatrix}=\frac{35}{69}\approx0.507$$
:::

같은 예제를 특성공간에서 직접 풀어 확인할 수도 있습니다: $\varphi(x_1)=(1,1,\sqrt2)$, $\varphi(x_2)=(4,0,0)$, $\beta^*=\varphi(X)\alpha^*=\frac{43}{69}(1,1,\sqrt2)-\frac2{69}(4,0,0)=\frac1{69}(35,43,43\sqrt2)$. $\varphi(x_t)=(1,0,0)$이므로 $f^*=\frac{35}{69}$. 같습니다.

:::tip 크기 점검
$\varphi(X)$: $d\times n$, $K=\varphi^T\varphi$: $n\times n$, $K(x,X)$: $1\times n$, $\alpha^*$: $n\times1$. 역행렬이 $n\times n$이므로 자료 수 $n$이 계산량을 정합니다.
:::

### 더 깊이: 원시형과 쌍대형

$\beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y$ (원시형, $d\times d$ 역행렬)와 $\beta^*=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y$ (쌍대형, $n\times n$)는 같은 답입니다. $d\ll n$이면 원시형, $n\ll d$ (또는 $d=\infty$)이면 쌍대형이 싸습니다. 자료가 수백만 개면 $n\times n$ 행렬도 감당할 수 없어서 신경망처럼 특성을 **학습하는** 방법이 쓰이게 되었습니다. 커널 릿지 회귀의 예측식은 가우시안 과정 회귀의 사후평균과 같습니다[[@ml:ch13:16.4|커널 릿지 회귀와 가우시안 과정.]].
` },
      { k: '4.6', src: 'W1 수 · 슬라이드 67–68, W2 수', title: '커널의 예', body: R`
:::idea 쉽게 말하면
커널은 “두 점이 얼마나 비슷한가”를 재는 함수입니다. 선형 커널은 방향이 같을수록, 가우시안 커널은 **가까울수록** 큰 값을 줍니다. 가우시안 커널을 쓴 커널 릿지는 “새 점 근처의 훈련점들의 값을, 가까운 점일수록 크게 반영해 섞는” 예측을 합니다.
:::

:::key 커널의 예
- 선형 커널: $K(x,z)=x^Tz$
- 다항 커널: $K(x,z)=(x^Tz)^2=\big\langle(x_1^2,x_2^2,\sqrt2x_1x_2),(z_1^2,z_2^2,\sqrt2z_1z_2)\big\rangle$ (2차원 → 3차원)
- 가우시안 커널: $K(x,z)=\exp\big(-\lVert x-z\rVert^2/(2\sigma^2)\big)$
- 정규화 커널: $K_2(x,z)=K_1(x,z)\,K_1(x,x)^{-1/2}K_1(z,z)^{-1/2}$
:::

다항 커널의 등식은 전개하면 바로 확인됩니다: $(x_1z_1+x_2z_2)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2$. 상수를 더한 $(x^Tz+1)^2$은 1차 항과 상수까지 포함하는 특성 $(1,\sqrt2x_1,\sqrt2x_2,x_1^2,x_2^2,\sqrt2x_1x_2)$에 대응합니다.

:::ex 예제 6 — 가우시안 커널의 값
$\sigma=1$일 때 $x=(0,0)$과 $z=(1,1)$, $z'=(3,0)$의 커널 값은?
---
$\lVert x-z\rVert^2=2$이므로 $K=e^{-1}\approx0.368$. $\lVert x-z'\rVert^2=9$이므로 $K=e^{-4.5}\approx0.011$. 멀수록 0에 가까워지고, 자기 자신과는 항상 $K(x,x)=1$. $\sigma$가 작을수록 “가깝다”의 기준이 엄격해져 더 구불구불한 함수를 맞춥니다(과적합 쪽).
:::

**그람 행렬은 양의 준정부호.** $K=\varphi(X)^T\varphi(X)$이면 $c^TKc=\lVert\varphi(X)c\rVert^2\ge0$입니다. 그래서 $\lambda I+K$는 $\lambda>0$일 때 항상 가역입니다. 거꾸로, 모든 유한 자료에서 그람 행렬이 양의 준정부호인 대칭함수는 어떤 특성공간의 내적으로 쓸 수 있습니다(머서 정리)[[@ml:ch13:16.2c|커널의 판정: 양의 준정부호 그람 행렬.]].

:::note 정규화 커널
$K_2(x,x)=1$이 되어, 특성벡터를 단위길이로 만든 뒤의 내적(코사인 유사도)과 같습니다: $K_2(x,z)=\big\langle\frac{\varphi(x)}{\lVert\varphi(x)\rVert},\frac{\varphi(z)}{\lVert\varphi(z)\rVert}\big\rangle$.
:::

### 더 깊이: 커널을 만드는 규칙과 가우시안의 무한차원

$K_1,K_2$가 커널이면 $K_1+K_2$ (특성을 이어 붙임), $cK_1$ ($c>0$), $K_1K_2$ (특성의 텐서곱), $f(x)K_1(x,z)f(z)$도 커널입니다. 가우시안 커널이 커널인 이유는 이 규칙으로 보입니다:
$$e^{-\lVert x-z\rVert^2/2\sigma^2}=e^{-\lVert x\rVert^2/2\sigma^2}\cdot e^{x^Tz/\sigma^2}\cdot e^{-\lVert z\rVert^2/2\sigma^2},\qquad e^{x^Tz/\sigma^2}=\sum_{m=0}^\infty\frac{(x^Tz)^m}{\sigma^{2m}m!}.$$
가운데 인자는 다항 커널들의 양의 계수 합(무한 급수)이므로 커널이고, 양 끝은 $f(x)Kf(z)$ 꼴입니다. 모든 차수의 다항 특성을 가지므로 특성공간이 무한차원입니다.
` },
    ],
  });
})();
