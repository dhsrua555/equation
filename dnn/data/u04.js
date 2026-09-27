/* 04 확률적 회귀, 규제, 커널 — 1주차 수요일 s.45–68, 2주차 수요일 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 4, part: 'A', title: '확률적 회귀, 규제, 커널 트릭', en: 'Probabilistic Regression, Regularization, Kernels', ref: 'W1 수 · s.45–68, W2 수 필기', plot: 'ridge',
    fig: R`M = 9 다항식을 여러 λ의 릿지 규제로 맞춘 곡선들과 참 곡선 sin 2πx(굵은 선)`,
    tagline: R`가우시안 잡음이면 최소제곱 = MLE, 가우시안 사전분포까지 두면 릿지. 푸시스루 항등식 한 줄이 릿지를 커널 릿지로 바꿉니다.`,
    summary: R`오차가 정규분포를 따른다고 가정하면 최소제곱추정이 최대가능도 추정과 같아집니다. 다항 특성으로 모델을 키우면 훈련오차는 0에 가까워지지만 과적합이 생기고, 계수 크기에 벌점을 주는 규제(릿지 $q=2$, 라쏘 $q=1$)로 이를 막습니다. 릿지 해 $(\lambda I+X^TX)^{-1}X^Ty$를 특성공간으로 옮긴 뒤 **푸시스루 항등식**으로 정리하면 특성 $\varphi$ 없이 커널 $K(x,z)=\varphi(x)^T\varphi(z)$만으로 예측하는 커널 릿지 회귀가 나옵니다. 필기에서 $\alpha$로 모수를 바꾸는 두 번째 유도와 2점 수치 예제를 풀었습니다.`,
    goals: [
      R`가우시안 잡음 가정에서 로그가능도를 쓰고 LSE = MLE임을 보일 수 있다`,
      R`다항회귀가 모수에 대해 선형임을 설명하고 과적합을 훈련·검증 오차로 판단할 수 있다`,
      R`릿지 목적함수를 미분해 $\hat\beta=(\lambda I+X^TX)^{-1}X^Ty$를 유도하고 가역성을 보일 수 있다`,
      R`푸시스루 항등식을 증명하고 커널 릿지 예측식 $f^*(x)=K(x,X)(\lambda I+K)^{-1}y$를 유도할 수 있다`,
      R`주어진 커널이 어떤 특성사상의 내적인지 보이고 작은 커널 릿지 예제를 계산할 수 있다`,
    ],
    secTitles: { '4.1': 'LSE = MLE', '4.2': '다항회귀·과적합', '4.3': '릿지·라쏘', '4.4': '커널 트릭', '4.5': '커널 릿지', '4.6': '커널의 예' },
    sections: [
      { k: '4.1', src: 'W1 수 · 슬라이드 45–48', title: '선형회귀의 확률적 해석: 최소제곱 = 최대가능도', body: R`
1단원의 모델에 오차의 분포를 가정합니다.
$$Y=\beta_0+\sum_{j=1}^k\beta_jx_j+\varepsilon,\qquad \varepsilon\sim\N(0,\sigma^2)\ \text{i.i.d.}$$
$h_i(\beta)=\beta_0+\sum_j\beta_jx_{ij}$로 쓰면 $y_i\mid x_i\sim\N(h_i(\beta),\sigma^2)$이고 가능도는
$$\prod_{i=1}^n\frac1{\sqrt{2\pi}\,\sigma}\exp\Big(-\frac{(y_i-h_i(\beta))^2}{2\sigma^2}\Big).$$

:::key 최소제곱 = 가우시안 MLE
$$\log p(y_1,\dots,y_n\mid x_1,\dots,x_n,\beta)=-n\log(\sqrt{2\pi}\,\sigma)-\sum_{i=1}^n\frac{(y_i-h_i(\beta))^2}{2\sigma^2}$$
$\beta$에 대해 최대로 하려면 $\sum_i(y_i-h_i(\beta))^2=f(\beta)$를 최소로 하면 된다. 따라서 LSE는 MLE이다.
:::

$\sigma^2$도 추정하면 $\hat\sigma^2_{\text{MLE}}=\frac1n\sum_i(y_i-h_i(\hat\beta))^2=f(\hat\beta)/n$, 즉 평균제곱잔차입니다. 이 추정량은 편향되어 있습니다(분모 $n-k-1$이 불편).

:::warn 가정이 바뀌면 손실도 바뀝니다
LSE = MLE는 **가우시안** 잡음일 때의 결론입니다. 잡음이 라플라스 분포 $\propto e^{-\lvert\varepsilon\rvert/b}$이면 MLE는 절댓값 오차합 $\sum\lvert y_i-h_i\rvert$을 최소로 합니다.
:::
` },
      { k: '4.2', src: 'W1 수 · 슬라이드 49–52, W2 수 필기', title: '다항회귀와 과적합', body: R`
$y=\beta_0+\beta_1x+\beta_2x^2+\cdots+\beta_Mx^M$처럼 특성을 $\{1,x,x^2,\dots,x^M\}$로 늘려도, **모수 $\beta$에 대해서는 선형**이므로 여전히 선형회귀입니다(필기). 설계행렬의 $i$번째 행이 $(1,x_i,x_i^2,\dots,x_i^M)$이 되고 해는 똑같이 $\hat\beta=(X^TX)^{-1}X^Ty$입니다.

슬라이드의 실험($\sin2\pi x$에서 뽑은 점 10개):

| 차수 $M$ | 1 | 3 | 5 | 9 |
|---|---|---|---|---|
| 훈련 MSE $f/n$ | 0.29 | 0.0096 | 0.0011 | $1.4\times10^{-22}$ |

$M=9$이면 모수 10개로 점 10개를 정확히 지나가 훈련오차가 사실상 0이지만, 점 사이에서 크게 출렁입니다(필기: $x\approx0.9$ 부근). 이것이 **과적합**입니다.

- **일반화**는 새 자료에 대한 성능입니다. 별도의 검증 자료로 $E_{\text{RMS}}=\sqrt{f(\beta)/n}$을 잽니다.
- $M\ge5$부터 훈련 곡선과 검증 곡선의 차이가 커집니다. 검증오차가 가장 작은 $M$(여기서는 5 부근)을 고릅니다.
- 자료가 많아지면 같은 $M=9$도 과적합이 덜합니다($n=10$ 대 $n=100$). 경험칙: 모수 하나당 자료 10개 정도.
` },
      { k: '4.3', src: 'W1 수 · 슬라이드 53–58, W2 수 필기', title: '규제: 릿지와 라쏘', body: R`
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

:::key 릿지 회귀의 해
$$J(\beta)=\frac12(y-X\beta)^T(y-X\beta)+\frac\lambda2\beta^T\beta,\qquad \nabla J=X^TX\beta-X^Ty+\lambda\beta=0$$
$$\hat\beta_{\text{ridge}}=(\lambda I+X^TX)^{-1}X^Ty$$
$\lambda>0$이면 $\lambda I+X^TX$는 양의 정부호라 **항상** 가역이다.
:::

가역성: $v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$ ($v\ne0$). 1단원에서 $X^TX$가 특이해 해가 유일하지 않던 경우($n<k+1$ 등)도 릿지는 유일한 해를 줍니다. 확률적으로는 가우시안 사전분포의 MAP입니다[[ch02:2.6|MAP에서 $\beta\sim\N(0,\tau^2I)$이면 $\lambda=\sigma^2/\tau^2$인 릿지.]]. 의료 인공지능 과목에서는 같은 식을 가중치 감쇠로 부릅니다[[@med:ch10:9.2|가중치 감쇠 $\tilde E=E+\frac\lambda2w^Tw$, 기울기에 $\lambda w$가 더해집니다.]].
` },
      { k: '4.4', src: 'W1 수 · 슬라이드 59–60', title: '커널 트릭', body: R`
평면에서 두 종류의 점을 직선으로 나눌 수 없어도, 표본을 더 높은 차원의 **특성공간**으로 보내는 사상 $x\mapsto\varphi(x)$를 쓰면 선형으로 분리될 수 있습니다. 예를 들어 원 안쪽과 바깥쪽의 점은 $\varphi(x)=(x_1^2,x_2^2,\sqrt2x_1x_2)$로 보내면 평면 $z_1+z_2=r^2$으로 나뉩니다.

특성공간에서의 선형모델은 $f(x)=\varphi(x)^T\beta$이고, 학습과 예측에는 $\varphi$ 자체가 아니라 내적만 필요하다는 것이 핵심입니다[[@ml:ch13:16.2|표현자 정리: 손실이 내적들에만 기대고 규제가 노름의 증가함수이면 최적해가 훈련점들의 결합이라 내적만으로 계산됩니다.]].

:::def 커널
$$K(x_i,x_j)=\varphi(x_i)^T\varphi(x_j)$$
새 공간의 차원(무한일 수도 있음)은 중요하지 않습니다. 커널은 두 점의 **유사도**를 잽니다.
:::
` },
      { k: '4.5', src: 'W1 수 · 슬라이드 61–66, W2 수 필기', title: '커널 릿지 회귀', body: R`
특성행렬을 $\varphi(X)=[\varphi(x_1)\ \cdots\ \varphi(x_n)]$(열로 쌓은 $d\times n$ 행렬)로 쓰면 예측 벡터는 $\varphi(X)^T\beta$이고
$$J=\frac12\big(y-\varphi(X)^T\beta\big)^T\big(y-\varphi(X)^T\beta\big)+\frac\lambda2\beta^T\beta.$$
4.3절과 같은 계산으로 $\nabla J=-\varphi(X)y+\varphi(X)\varphi(X)^T\beta+\lambda\beta=0$, 즉
$$\beta^*=\big(\lambda I+\varphi(X)\varphi(X)^T\big)^{-1}\varphi(X)y.$$
이 식에는 $d\times d$ 역행렬이 있어 특성 차원이 크면 계산할 수 없습니다. 여기서 행렬을 “밀어 넣는” 항등식을 씁니다.

:::key 푸시스루 항등식
$$(\lambda I_d+\varphi\varphi^T)\varphi=\varphi(\lambda I_n+\varphi^T\varphi)\ \Longrightarrow\ (\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}\qquad(\lambda>0)$$
:::

첫 식은 양변을 전개하면 둘 다 $\lambda\varphi+\varphi\varphi^T\varphi$입니다. 왼쪽에 $(\lambda I_d+\varphi\varphi^T)^{-1}$, 오른쪽에 $(\lambda I_n+\varphi^T\varphi)^{-1}$을 곱하면 둘째 식이 됩니다(두 행렬 모두 $\lambda>0$이면 양의 정부호라 가역).

:::key 커널 릿지 회귀
$$\beta^*=\varphi(X)\big(\lambda I+\varphi(X)^T\varphi(X)\big)^{-1}y,\qquad f^*(x)=\varphi(x)^T\beta^*=K(x,X)\big(\lambda I+K(X,X)\big)^{-1}y$$
$K(x,X)=[K(x,x_1)\ \cdots\ K(x,x_n)]$ ($1\times n$), $K(X,X)=[K(x_i,x_j)]$ ($n\times n$ 그람 행렬). $\alpha^*=(\lambda I+K)^{-1}y$로 두면 $f^*(x)=K(x,X)\alpha^*=\sum_i\alpha_i^*K(x,x_i)$, $\beta^*=\varphi(X)\alpha^*$.
:::

:::hand 수업 필기 — α로 바꿔 푸는 두 번째 유도
$\beta=\varphi(X)\alpha$로 두면 $\varphi(X)^T\beta=K\alpha$, $\beta^T\beta=\alpha^TK\alpha$ ($K=\varphi(X)^T\varphi(X)$, 대칭)이므로
$$J=\tfrac12\big(y^Ty-y^TK\alpha-\alpha^TKy+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha=\tfrac12\big(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha\big)+\tfrac\lambda2\alpha^TK\alpha.$$
$$\nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big)=0\ \Rightarrow\ \alpha^*=(K+\lambda I)^{-1}y.$$
첫 번째 유도와 같은 $f^*$가 나옵니다.
:::

:::ex 예제 1 — 두 점의 커널 릿지 (수업 필기)
$\varphi(x_1,x_2)=(x_1^2,x_2^2,\sqrt2x_1x_2)$, 즉 $K(x,z)=(x^Tz)^2$. 자료 $x_1=(1,1),\,y_1=3$과 $x_2=(2,0),\,y_2=2$, $\lambda=1$일 때 $x_t=(1,0)$에서의 예측값은?
---
$K(x_1,x_1)=(1+1)^2=4$, $K(x_1,x_2)=(2+0)^2=4$, $K(x_2,x_2)=4^2=16$이므로 $K=\begin{pmatrix}4&4\\4&16\end{pmatrix}$.
$\lambda I+K=\begin{pmatrix}5&4\\4&17\end{pmatrix}$, 행렬식 $85-16=69$.
$$\alpha^*=\frac1{69}\begin{pmatrix}17&-4\\-4&5\end{pmatrix}\begin{pmatrix}3\\2\end{pmatrix}=\frac1{69}\begin{pmatrix}43\\-2\end{pmatrix}$$
$K(x_t,X)=[(1\cdot1+0\cdot1)^2,\ (1\cdot2+0\cdot0)^2]=[1,\ 4]$.
$$f^*(x_t)=[1\ \ 4]\cdot\frac1{69}\begin{pmatrix}43\\-2\end{pmatrix}=\frac{35}{69}\approx0.507$$
:::

:::tip 크기 점검
$\varphi(X)$: $d\times n$, $K=\varphi^T\varphi$: $n\times n$, $K(x,X)$: $1\times n$, $\alpha^*$: $n\times1$. 역행렬이 $n\times n$이므로 자료 수 $n$이 계산량을 정합니다.
:::
` },
      { k: '4.6', src: 'W1 수 · 슬라이드 67–68, W2 수', title: '커널의 예', body: R`
:::key 커널의 예
- 선형 커널: $K(x,z)=x^Tz$
- 다항 커널: $K(x,z)=(x^Tz)^2=\big\langle(x_1^2,x_2^2,\sqrt2x_1x_2),(z_1^2,z_2^2,\sqrt2z_1z_2)\big\rangle$ (2차원 → 3차원)
- 가우시안 커널: $K(x,z)=\exp\big(-\lVert x-z\rVert^2/(2\sigma^2)\big)$
- 정규화 커널: $K_2(x,z)=K_1(x,z)\,K_1(x,x)^{-1/2}K_1(z,z)^{-1/2}$
:::

다항 커널의 등식은 전개하면 바로 확인됩니다: $(x_1z_1+x_2z_2)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2$.

**그람 행렬은 양의 준정부호.** $K=\varphi(X)^T\varphi(X)$이면 $c^TKc=\lVert\varphi(X)c\rVert^2\ge0$입니다. 그래서 $\lambda I+K$는 $\lambda>0$일 때 항상 가역입니다. 거꾸로, 모든 유한 자료에서 그람 행렬이 양의 준정부호인 대칭함수는 어떤 특성공간의 내적으로 쓸 수 있습니다(머서 정리).

:::note 정규화 커널
$K_2(x,x)=1$이 되어, 특성벡터를 단위길이로 만든 뒤의 내적(코사인 유사도)과 같습니다: $K_2(x,z)=\big\langle\frac{\varphi(x)}{\lVert\varphi(x)\rVert},\frac{\varphi(z)}{\lVert\varphi(z)\rVert}\big\rangle$.
:::
` },
    ],
    problems: [
      { sec: '4.1', type: 'mc', lv: 1, q: R`선형회귀에서 최소제곱추정량이 최대가능도 추정량과 같아지는 가정은?`,
        choices: [R`오차가 i.i.d. $\N(0,\sigma^2)$`, R`오차가 i.i.d. 라플라스 분포`, R`설명변수가 정규분포`, R`계수가 정규분포`], ans: 0,
        sol: R`가우시안 로그가능도가 $-\sum(y_i-h_i)^2/(2\sigma^2)+$상수라서입니다. 라플라스면 절댓값 오차, 계수의 정규분포(사전분포)는 MAP·릿지입니다.` },
      { sec: '4.1', type: 'num', lv: 2, q: R`1단원 예제($f(\hat\beta)=0.70$, $n=4$)에서 가우시안 잡음의 분산 MLE $\hat\sigma^2$은?`, ans: '0.175', ansTex: R`0.175`,
        sol: R`$\hat\sigma^2_{\text{MLE}}=f(\hat\beta)/n=0.70/4=0.175$. (불편추정량은 $0.70/(4-2)=0.35$.)` },
      { sec: '4.2', type: 'mc', lv: 1, q: R`$y=\beta_0+\beta_1x+\beta_2x^2$을 최소제곱으로 맞추는 문제가 “선형”회귀인 이유는?`,
        choices: [R`$x$에 대해 선형이라서`, R`모수 $\beta$에 대해 선형이라서`, R`$x^2$이 작아서`, R`$\beta_2=0$이라서`], ans: 1,
        sol: R`설계행렬의 행을 $(1,x_i,x_i^2)$로 두면 $y=X\beta$ 꼴이고 정규방정식이 그대로 적용됩니다.` },
      { sec: '4.2', type: 'mc', lv: 2, q: R`점 10개에 $M=9$ 다항식을 맞췄더니 훈련 MSE가 $10^{-22}$이었다. 가장 옳은 판단은?`,
        choices: [R`최적의 모델이다`, R`과적합이 의심되므로 검증 오차로 판단해야 한다`, R`과소적합이다`, R`자료를 줄이면 해결된다`], ans: 1,
        sol: R`모수 10개로 점 10개를 보간한 것뿐입니다. 일반화는 검증 자료의 $E_{\text{RMS}}$로 판단하고, 규제나 더 많은 자료로 해결합니다.` },
      { sec: '4.3', type: 'num', lv: 2, q: R`설명변수 하나, 절편 없는 모델 $y=\beta x$에서 $x=(1,2,3)$, $y=(2,4,5)$, $\lambda=1$일 때 릿지 해 $\hat\beta=(\lambda+X^TX)^{-1}X^Ty$는?`, ans: '25/15', ansTex: R`\tfrac53\approx1.667`,
        sol: R`$X^TX=14$, $X^Ty=25$. $\hat\beta=25/(1+14)=5/3$. 최소제곱해 $25/14\approx1.786$보다 0 쪽으로 줄어듭니다.` },
      { sec: '4.3', type: 'mc', lv: 2, q: R`$\lambda>0$일 때 $\lambda I+X^TX$가 항상 가역인 이유는?`,
        choices: [R`$X^TX$가 항상 가역이라서`, R`$v^T(\lambda I+X^TX)v=\lambda\lVert v\rVert^2+\lVert Xv\rVert^2>0$ ($v\ne0$)이라서`, R`$\lambda I$가 대각행렬이라서`, R`$X$가 정사각이라서`], ans: 1,
        sol: R`양의 정부호 행렬은 고유값이 모두 양수라 가역입니다. $X^TX$ 자체는 특이할 수 있습니다.` },
      { sec: '4.3', type: 'mc', lv: 2, q: R`규제항 $\frac\lambda2\sum\lvert\beta_j\rvert^q$에서 일부 계수를 정확히 0으로 만드는 경향이 있는 것은?`,
        choices: [R`$q=2$ (릿지)`, R`$q=1$ (라쏘)`, R`$q=4$`, R`$q$와 무관`], ans: 1,
        sol: R`$q=1$의 등고선(마름모)은 좌표축 위에 꼭짓점이 있어 최적점이 축 위(계수 0)에 걸리기 쉽습니다. 릿지는 계수를 줄이기만 합니다.` },
      { sec: '4.3', type: 'mc', lv: 1, q: R`릿지에서 $\lambda\to0$일 때 슬라이드 계수표가 보여 주는 현상은?`,
        choices: [R`모든 계수가 0이 된다`, R`계수의 크기가 매우 커지며 과적합된다`, R`훈련 오차가 커진다`, R`검증 오차가 최소가 된다`], ans: 1,
        sol: R`$\ln\lambda=-36.8$에서 $\beta_6\approx1.3\times10^5$처럼 계수가 폭발합니다.` },
      { sec: '4.5', type: 'num', lv: 2, q: R`예제 1과 같은 커널 $K(x,z)=(x^Tz)^2$, 자료 $x_1=(1,1),y_1=3$, $x_2=(2,0),y_2=2$, $\lambda=1$에서 $x_t=(0,1)$의 예측값은?`, ans: '43/69', ansTex: R`\tfrac{43}{69}\approx0.623`,
        sol: R`$\alpha^*=\frac1{69}(43,-2)$는 같습니다. $K(x_t,X)=[(0+1)^2,(0+0)^2]=[1,0]$이므로 $f^*=43/69$.` },
      { sec: '4.5', type: 'num', lv: 2, q: R`예제 1에서 $\alpha_2^*$는?`, ans: '-2/69', ansTex: R`-\tfrac{2}{69}`,
        sol: R`$(\lambda I+K)^{-1}y=\frac1{69}\begin{pmatrix}17&-4\\-4&5\end{pmatrix}\begin{pmatrix}3\\2\end{pmatrix}=\frac1{69}(43,-2)$.` },
      { sec: '4.5', type: 'mc', lv: 2, q: R`특성 차원 $d$, 자료 수 $n$일 때 커널 릿지 예측 $K(x,X)(\lambda I+K)^{-1}y$의 역행렬 크기는?`,
        choices: [R`$d\times d$`, R`$n\times n$`, R`$d\times n$`, R`$1\times1$`], ans: 1,
        sol: R`$K=\varphi(X)^T\varphi(X)$는 $n\times n$. 푸시스루 덕분에 $d\times d$ 역행렬(무한차원일 수도)을 피합니다.` },
      { sec: '4.6', type: 'mc', lv: 2, q: R`$x,z\in\mathbb R^2$에서 $K(x,z)=(x^Tz+1)^2$에 대응하는 특성사상은?`,
        choices: [R`$(x_1^2,x_2^2,\sqrt2x_1x_2)$`, R`$(x_1^2,x_2^2,\sqrt2x_1x_2,\sqrt2x_1,\sqrt2x_2,1)$`, R`$(x_1,x_2,1)$`, R`$(x_1^2,x_2^2,x_1x_2,x_1,x_2,1)$`], ans: 1,
        sol: R`$(x_1z_1+x_2z_2+1)^2=x_1^2z_1^2+x_2^2z_2^2+2x_1x_2z_1z_2+2x_1z_1+2x_2z_2+1$. 교차항마다 $\sqrt2$가 필요합니다.` },
      { sec: '4.6', type: 'num', lv: 1, q: R`가우시안 커널 $K(x,z)=\exp(-\lVert x-z\rVert^2/(2\sigma^2))$에서 $\sigma=1$, $x=(0,0)$, $z=(1,1)$이면 $K(x,z)$는?`, ans: 'e^(-1)', ansTex: R`e^{-1}\approx0.368`,
        sol: R`$\lVert x-z\rVert^2=2$이므로 $e^{-2/2}=e^{-1}$. 같은 점이면 1, 멀수록 0에 가까워지는 유사도입니다.` },
      { sec: '4.5', type: 'open', lv: 3, proof: true, q: R`$\varphi\in\mathbb R^{d\times n}$, $\lambda>0$일 때 푸시스루 항등식 $(\lambda I_d+\varphi\varphi^T)^{-1}\varphi=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}$을 증명하고, 이를 써서 커널 릿지 예측식 $f^*(x)=K(x,X)(\lambda I+K)^{-1}y$를 유도하세요.`,
        sol: R`
**가역성.** $v\ne0$이면 $v^T(\lambda I_d+\varphi\varphi^T)v=\lambda\lVert v\rVert^2+\lVert\varphi^Tv\rVert^2>0$, 같은 방법으로 $\lambda I_n+\varphi^T\varphi\succ0$. 둘 다 가역입니다.

**항등식.** $(\lambda I_d+\varphi\varphi^T)\varphi=\lambda\varphi+\varphi\varphi^T\varphi=\varphi(\lambda I_n+\varphi^T\varphi)$. 왼쪽에서 $(\lambda I_d+\varphi\varphi^T)^{-1}$, 오른쪽에서 $(\lambda I_n+\varphi^T\varphi)^{-1}$을 곱하면 결과.

**커널 릿지.** $J=\frac12\lVert y-\varphi^T\beta\rVert^2+\frac\lambda2\lVert\beta\rVert^2$의 기울기 $-\varphi y+\varphi\varphi^T\beta+\lambda\beta=0$에서 $\beta^*=(\lambda I_d+\varphi\varphi^T)^{-1}\varphi y=\varphi(\lambda I_n+\varphi^T\varphi)^{-1}y$. 따라서
$$f^*(x)=\varphi(x)^T\beta^*=\underbrace{\varphi(x)^T\varphi}_{K(x,X)}\big(\lambda I_n+\underbrace{\varphi^T\varphi}_{K}\big)^{-1}y.$$`,
        rubric: R`
- 두 행렬의 가역성 — 2점
- 항등식의 전개와 양쪽 곱 — 3점
- 릿지 기울기에서 $\beta^*$ — 2점
- 푸시스루 적용과 커널로 쓰기 — 3점` },
      { sec: '4.5', type: 'open', lv: 3, proof: true, q: R`수업 필기처럼 $\beta=\varphi(X)\alpha$로 두고 커널 릿지 목적함수를 $\alpha$의 함수로 쓴 뒤, $\nabla_\alpha J=0$에서 $\alpha^*=(K+\lambda I)^{-1}y$를 얻으세요. $K$가 특이하면 $\alpha$가 유일하지 않을 수 있는데, 그래도 예측값 $f(x)=K(x,X)\alpha$는 유일함을 보이세요.`,
        sol: R`
$\varphi^T\beta=\varphi^T\varphi\alpha=K\alpha$, $\beta^T\beta=\alpha^T\varphi^T\varphi\alpha=\alpha^TK\alpha$.
$J(\alpha)=\frac12(y-K\alpha)^T(y-K\alpha)+\frac\lambda2\alpha^TK\alpha=\frac12(y^Ty-2y^TK\alpha+\alpha^TK^2\alpha)+\frac\lambda2\alpha^TK\alpha$ ($K$ 대칭이라 $\alpha^TKy=y^TK\alpha$).
$\nabla_\alpha J=-Ky+K^2\alpha+\lambda K\alpha=K\big((K+\lambda I)\alpha-y\big)$. $K+\lambda I$는 가역이므로 $\alpha^*=(K+\lambda I)^{-1}y$가 해입니다.

**유일성.** $\alpha,\alpha'$가 모두 $\nabla J=0$을 만족하면 $K(K+\lambda I)\alpha=Ky=K(K+\lambda I)\alpha'$이므로 $\delta=\alpha-\alpha'$에 대해 $K(K+\lambda I)\delta=0$. 좌변에 $\delta^T$를 곱하면 $\lVert K\delta\rVert^2+\lambda\,\delta^TK\delta=0$, 두 항 모두 $\ge0$이라 $\delta^TK\delta=\lVert\varphi\delta\rVert^2=0$, 즉 $\varphi\delta=0$. 그러면 $K(x,X)\delta=\varphi(x)^T\varphi\delta=0$이므로 예측값이 같습니다.`,
        rubric: R`
- $K\alpha$, $\alpha^TK\alpha$ 치환 — 2점
- 전개와 기울기 — 4점
- $\alpha^*$ — 2점
- 예측값의 유일성 — 2점` },
    ],
  });
})();
