/* 14 실전 최적화: 모멘텀과 적응형 학습률 — 5주차 월요일(2) 슬라이드 1–11 필기 (Practical Optimizations) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 14, part: 'D', title: '실전 최적화: 모멘텀과 적응형 학습률', en: 'Momentum & Adaptive Learning Rates', ref: 'W5 월(2) · s.1–11 필기', plot: 'momentum',
    fig: R`길쭉한 등고선에서 경사하강법(가는 선)은 좌우로 튀고, 모멘텀(굵은 선)은 진동을 누르며 굴러 내려간다`,
    tagline: R`한 방향은 가파르고 다른 방향은 완만한 손실에서 GD는 느리게 지그재그합니다. 모멘텀은 속도를 누적해 진동을 상쇄하고, AdaGrad·RMSProp·Adam은 좌표마다 기울기 크기로 나눠 걸음을 고릅니다.`,
    summary: R`13단원의 이론은 “학습률이 곡률에 맞아야 한다”였습니다. 그런데 방향마다 곡률이 크게 다르면(**나쁜 조건수**) 가파른 방향에 맞춘 학습률은 완만한 방향에서 너무 작아, GD는 좁은 골짜기를 좌우로 튀며 기어갑니다. 5주차 월요일 필기는 $f=\frac12x_1^2+\frac{100}2x_2^2$로 이것을 계산해 보였습니다. 해결책은 둘입니다. (1) **모멘텀**: 지난 걸음들을 지수적으로 누적한 “속도”로 걸어, 튀는 성분은 상쇄되고 일정한 성분은 쌓입니다. **네스테로프**는 속도만큼 먼저 가 본 곳의 기울기를 씁니다. (2) **적응형 학습률**: 좌표마다 지금까지의 기울기 제곱을 누적(AdaGrad)하거나 지수이동평균(RMSProp)해 그 제곱근으로 나눕니다. **Adam**은 둘을 합치고 초기 편향을 보정합니다.`,
    goals: [
      R`조건수를 정의하고, 조건수가 큰 이차함수에서 GD가 느리게 지그재그하는 이유를 좌표별 점화식으로 설명할 수 있다`,
      R`모멘텀 갱신식을 쓰고 $v_t$를 과거 기울기의 지수 가중합으로 펼칠 수 있으며, 유효 학습률 $\alpha/(1-\rho)$를 설명할 수 있다`,
      R`네스테로프 모멘텀의 “미리 내다보기”를 식으로 쓰고 수업의 수치 예제를 계산할 수 있다`,
      R`AdaGrad의 누적 제곱합과 좌표별 학습률을 쓰고, 학습률이 계속 줄어드는 단점을 설명할 수 있다`,
      R`RMSProp의 지수이동평균이 AdaGrad의 단점을 어떻게 고치는지 설명할 수 있다`,
      R`Adam의 1차·2차 모멘트와 편향 보정을 쓰고, 보정이 필요한 이유와 기본 초매개변수를 말할 수 있다`,
    ],
    secTitles: { '14.1': '나쁜 조건수', '14.2': '모멘텀·네스테로프', '14.3': 'AdaGrad·RMSProp', '14.4': 'Adam', '14.5': '정리' },
    sections: [
      { k: '14.1', src: 'W5 월(2) · 슬라이드 2–3 필기', title: 'GD와 SGD의 문제: 나쁜 조건수, 국소 최소, 안장점', body: R`
:::idea 쉽게 말하면
좁고 긴 협곡의 바닥으로 내려간다고 합시다. 협곡의 **벽 방향**은 매우 가파르고, 협곡을 **따라가는 방향**은 거의 평평합니다. 경사를 따라 걸으면 거의 벽 쪽으로만 끌려가 좌우로 튀고, 정작 가야 할 협곡 방향으로는 조금씩밖에 못 갑니다. 걸음을 크게 하면 벽을 넘어 날아가고, 작게 하면 영원히 걸립니다. 이것이 “나쁜 조건수” 문제입니다.
:::

슬라이드의 질문: 손실이 한 방향으로는 빠르게, 다른 방향으로는 느리게 변하면 경사하강법은 무엇을 하나? — **완만한 방향으로는 매우 느리게 진전하고, 가파른 방향으로는 떨린다.**

:::def 조건수
손실의 헤시안(대칭)의 가장 큰 고윳값과 가장 작은 고윳값(양수)의 비 $\kappa=\lambda_{\max}/\lambda_{\min}$을 **조건수**라 합니다. 슬라이드는 “헤시안의 가장 큰 특잇값과 가장 작은 특잇값의 비”라고 적었는데, 대칭 양의 정부호 행렬에서는 특잇값 = 고윳값이라 같은 말입니다.
:::

### 수업 필기의 계산

:::key 조건수와 경사하강법
$f(x_1,x_2)=\frac12x_1^2+\frac{100}2x_2^2$이면 $\nabla f=(x_1,\ 100x_2)$, 헤시안 $H=\diag(1,100)$, 조건수 $100$. GD $x\leftarrow x-\alpha\nabla f$는 좌표별로
$$x_{1,t+1}=(1-\alpha)\,x_{1,t},\qquad x_{2,t+1}=(1-100\alpha)\,x_{2,t}$$
이고, 수렴하려면 $\lvert1-100\alpha\rvert<1$, 즉 $\alpha<0.02$. 이때 완만한 방향은 매 걸음 $1-\alpha>0.98$배밖에 줄지 않는다.
:::

필기의 표 ($\alpha=0.019$, 출발점 $(-5,-1)$):

| $t$ | $x_1$ | $x_2$ |
|---|---|---|
| 0 | $-5$ | $-1$ |
| 1 | $-4.9$ | $0.9$ |
| 2 | $-4.8$ | $-0.8$ |
| 3 | $-4.7$ | $0.7$ |

$x_1$은 $(1-0.019)=0.981$배씩 줄어 거의 제자리이고, $x_2$는 $(1-1.9)=-0.9$배라 부호가 바뀌며(좌우로 튀며) 줄어듭니다. (정확히는 $x_1$: $-4.905$, $-4.812$, $-4.720$, $x_2$: $0.9$, $-0.81$, $0.729$.) 40걸음 뒤에도 $x_1\approx-2.32$ — 출발점에서 절반도 못 왔습니다.

:::fig illcond
:::

**왜 조건수가 속도를 정하나.** 고윳값 $\lambda_i$ 방향의 오차는 매 걸음 $\lvert1-\alpha\lambda_i\rvert$배가 됩니다[[ch01:1.5|선형회귀의 GD에서 본 것과 같은 계산: 오차가 $(I-\alpha X^TX)$로 곱해짐.]]. 발산하지 않으려면 $\alpha<2/\lambda_{\max}$이고, 그러면 가장 완만한 방향의 축소율은 $1-\alpha\lambda_{\min}>1-2/\kappa$. 가장 좋은 고정 학습률 $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$을 써도 축소율이 $\frac{\kappa-1}{\kappa+1}$ ($\kappa=100$이면 $0.980$)이라, 오차를 $1/e$로 줄이는 데 약 $\kappa/2=50$걸음이 듭니다.

### 다른 두 가지 문제 (슬라이드 3)

- **국소 최소**: 기울기가 0이라 GD가 멈추지만 전역 최소가 아닌 곳.
- **안장점**: 기울기가 0이지만 어떤 방향으로는 올라가고 어떤 방향으로는 내려가는 점(예: $f=x^2-y^2$의 원점). 고차원 신경망에서는 국소 최소보다 안장점과 그 근처의 **평평한 지대**가 훨씬 흔하고, 거기서 기울기가 작아 GD가 매우 느려집니다.
- 여기에 SGD의 **잡음**까지 더해지면 경로가 더 들쭉날쭉해집니다.

모멘텀은 세 문제 모두에 도움이 됩니다: 쌓인 속도로 평평한 곳과 작은 언덕을 넘어가고, 좌우로 튀는 성분은 상쇄됩니다(다음 절).

### 더 깊이: 뉴턴법과 전처리

헤시안을 알면 $x\leftarrow x-H^{-1}\nabla f$ (뉴턴법)가 이차함수를 한 걸음에 풉니다: $H^{-1}\nabla f=(x_1,\ x_2)$라 바로 원점. 즉 좌표마다 곡률로 나눠 주면 조건수 문제가 사라집니다. 하지만 파라미터가 $d$개면 헤시안은 $d\times d$라 신경망에서는 불가능합니다. 대각 행렬 $D\approx\diag(H)$로 근사해 $x\leftarrow x-\alpha D^{-1}\nabla f$로 “좌표마다 다른 학습률”을 쓰는 것이 **대각 전처리**이고, 14.3절의 AdaGrad·RMSProp·Adam은 곡률 대신 “기울기 크기의 통계”로 $D$를 흉내 냅니다.
` },
      { k: '14.2', src: 'W5 월(2) · 슬라이드 3–6, 9 필기', title: '모멘텀과 네스테로프 모멘텀', body: R`
:::idea 쉽게 말하면
무거운 공을 굴린다고 생각하세요. 공은 지금의 경사뿐 아니라 **지금까지의 속도**를 가지고 움직입니다. 협곡 벽 사이를 튀는 성분은 오른쪽·왼쪽이 번갈아 와서 서로 상쇄되고, 협곡을 따라 내려가는 성분은 매번 같은 방향이라 쌓여서 점점 빨라집니다. 네스테로프는 여기에 “가던 방향으로 조금 먼저 가 보고, 거기서 경사를 재자”는 영리함을 더합니다.
:::

### 모멘텀 (heavy ball)

:::key 모멘텀 (heavy ball)
GD: $x_{t+1}=x_t-\alpha\nabla f(x_t)$.
GD + 모멘텀 ($0\le\rho<1$, 보통 $0.9$):
$$v_{t+1}=\rho v_t-\alpha\nabla f(x_t),\qquad x_{t+1}=x_t+v_{t+1}.$$
$v_t=x_t-x_{t-1}$이므로 한 줄로 $x_{t+1}=x_t-\alpha\nabla f(x_t)+\rho(x_t-x_{t-1})$ (필기). 초기값은 $v_0=0$, 즉 $x_{-1}=x_0$.
:::

$\rho v_t$가 **관성**(지난 걸음을 $\rho$배만큼 이어 가기), $-\alpha\nabla f(x_t)$가 이번 걸음의 **힘**입니다. $\rho=0$이면 GD와 같습니다.

:::key 모멘텀의 펼친 식
$g_t:=\nabla f(x_t)$, $v_0=0$이면
$$v_1=-\alpha g_0,\qquad v_2=-\alpha(\rho g_0+g_1),\qquad v_3=-\alpha(\rho^2g_0+\rho g_1+g_2),\ \dots$$
$$v_{t}=-\alpha\sum_{k=0}^{t-1}\rho^{\,t-1-k}g_k.$$
:::

필기의 계산 그대로입니다. 속도는 과거 기울기들의 **지수 가중합**이고, 오래된 기울기일수록 $\rho$의 거듭제곱만큼 약해집니다. (귀납법: $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k<t}\rho^{t-k}g_k+g_t\big)$.)

**두 가지 효과.**
- 기울기가 **일정**($g_k=g$)하면 $v_t\to-\alpha g\sum_{j\ge0}\rho^j=-\frac{\alpha}{1-\rho}g$ — 유효 학습률이 $\frac\alpha{1-\rho}$ ($\rho=0.9$이면 10배)로 커집니다. 완만하고 곧은 방향에서 가속합니다.
- 기울기의 **부호가 번갈아** 바뀌면($g_k=(-1)^kg$) 합의 항들이 상쇄되어 $\lvert v_t\rvert\lesssim\frac{\alpha}{1+\rho}\lvert g\rvert$ — 진동하는 방향에서는 오히려 걸음이 줄어듭니다.

:::ex 예제 1 — 수업 함수에서 두 걸음
$f=\frac12x_1^2+50x_2^2$, $x_0=(-5,-1)$, $\alpha=0.019$, $\rho=0.8$, $v_0=0$. $x_1,x_2$를 구하고 GD와 비교하세요.
---
$g_0=(-5,-100)$. $v_1=-0.019g_0=(0.095,\ 1.9)$, $x_1=(-4.905,\ 0.9)$ (GD와 같음).
$g_1=(-4.905,\ 90)$. $v_2=0.8(0.095,1.9)-0.019(-4.905,90)=(0.076+0.0932,\ 1.52-1.71)=(0.1692,\ -0.19)$, $x_2=(-4.736,\ 0.710)$.
GD의 둘째 점 $(-4.812,\ -0.81)$과 비교하면 $x_1$ 방향은 더 많이 왔고($0.169$ 대 $0.093$), $x_2$ 방향의 튐은 줄었습니다($0.71$ 대 $-0.81$로 부호가 바뀌지 않음). 40걸음 뒤 모멘텀은 $(0.08,\ 0.02)$ 근처, GD는 $(-2.32,\ -0.015)$.
:::

### 네스테로프 모멘텀

:::key 네스테로프 모멘텀
$$v_{t+1}=\rho v_t-\alpha\nabla f(x_t+\rho v_t),\qquad x_{t+1}=x_t+v_{t+1}.$$
필기의 쓰기: “앞 지점” $y_t=x_t+\rho_tv_t$를 두면 $v_{t+1}=\rho_tv_t-\alpha\nabla f(y_t)$, $x_{t+1}=x_t+v_{t+1}=y_t-\alpha\nabla f(y_t)$.
:::

모멘텀은 **지금 위치**의 기울기에 속도를 더하고, 네스테로프는 속도대로 가면 도착할 **앞 지점**에서 기울기를 계산해 더합니다(“look ahead”). 둘째 식 $x_{t+1}=y_t-\alpha\nabla f(y_t)$는 “앞 지점에서 GD 한 걸음”이라는 뜻입니다.

:::fig nesterov
:::

:::ex 예제 2 — 수업 필기의 비교
$f(x)=\frac{x^2}2$ ($f'(x)=x$, 최솟점 $x^*=0$), $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$. 모멘텀과 네스테로프의 $x_{t+1}$은?
---
관성 $\rho v_t=-1.8$, 앞 지점 $y_t=1-1.8=-0.8$.

| | 모멘텀 | 네스테로프 |
|---|---|---|
| 기울기를 재는 곳 | $f'(1)=1$ | $f'(-0.8)=-0.8$ |
| 보정 $-\alpha\nabla$ | $-0.1$ | $+0.08$ |
| $x_{t+1}$ | $1-1.8-0.1=-0.9$ | $-0.8+0.08=-0.72$ |

속도 때문에 둘 다 최솟점 0을 지나쳤지만, 모멘텀은 **이미 지나간 곳**(오른쪽, $x=1$)의 기울기로 더 왼쪽으로 밀어 $-0.9$가 되고, 네스테로프는 **도착할 곳**($-0.8$)에서 “벌써 지나쳤다”는 기울기를 보고 오른쪽으로 되돌려 $-0.72$에 멈춥니다 — 0에 더 가깝습니다.
:::

슬라이드 9의 그림(SGD, SGD+모멘텀, 네스테로프의 경로)도 같은 모습입니다: 모멘텀은 크게 휘돌아 지나쳤다 돌아오고, 네스테로프는 지나침이 작습니다.

### 더 깊이: 이차함수에서의 수렴 속도

모멘텀을 이차함수의 한 고유방향($\lambda$)에서 보면 $x_{t+1}=(1+\rho-\alpha\lambda)x_t-\rho x_{t-1}$ — 2계 선형 점화식이고, 특성방정식 $z^2-(1+\rho-\alpha\lambda)z+\rho=0$의 근이 복소수이면 $\lvert z\rvert=\sqrt\rho$로 모든 방향이 **같은 속도**로 줄어듭니다[[@em:ch02:2.2|상수계수 2계 방정식의 특성근과 감쇠 진동.]]. 최적으로 고르면($\alpha=\frac4{(\sqrt{\lambda_{\max}}+\sqrt{\lambda_{\min}})^2}$, $\sqrt\rho=\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$) 축소율이 $\frac{\sqrt\kappa-1}{\sqrt\kappa+1}$로, GD의 $\frac{\kappa-1}{\kappa+1}$에서 $\kappa$가 $\sqrt\kappa$로 바뀝니다. $\kappa=100$이면 걸음 수가 약 50에서 5 정도로 줍니다. 네스테로프 가속법은 일반적인 매끄러운 볼록 함수에서도 GD의 $O(1/T)$를 $O(1/T^2)$로 바꾸며, 이것이 1차 방법의 최적 속도임이 알려져 있습니다(Nesterov 1983).
` },
      { k: '14.3', src: 'W5 월(2) · 슬라이드 10–13 필기', title: 'AdaGrad와 RMSProp', body: R`
:::idea 쉽게 말하면
좌표마다 “지금까지 기울기가 얼마나 컸는지”를 기록해 두고, 기울기가 늘 컸던 좌표(가파른 방향)는 걸음을 **줄이고**, 늘 작았던 좌표(완만한 방향)는 걸음을 **키웁니다**. 그러면 가파른 협곡 벽 쪽 튐은 잦아들고 협곡 방향 진전은 빨라집니다. AdaGrad는 처음부터 모든 기록을 더하고, RMSProp은 **최근 기록만** 무게 있게 봅니다.
:::

### AdaGrad

:::key AdaGrad
$$r_{t+1}=r_t+\nabla f(x_t)\odot\nabla f(x_t),\qquad x_{t+1}=x_t-\frac{\alpha}{\sqrt{r_{t+1}}+\varepsilon}\odot\nabla f(x_t)$$
($\odot$, 나눗셈, 제곱근은 모두 성분별.) 필기의 표기: $g_t=\nabla f(x_{t-1})$, $A_t=A_{t-1}+g_t\odot g_t$ ($A_0=0$)이면 $A_{t,j}=\sum_{k=1}^tg_{k,j}^2$이고 $x_{t,j}=x_{t-1,j}-\dfrac{\alpha}{\sqrt{A_{t,j}}+\varepsilon}g_{t,j}$.
:::

코드로는 grad_squared += dx*dx; x -= learning_rate * dx / (np.sqrt(grad_squared) + 1e-7). 좌표 $j$의 유효 학습률은 $\alpha/\sqrt{\sum_kg_{k,j}^2}$ — **좌표마다 다르고, 시간이 갈수록 줄어듭니다.**

:::ex 예제 3 — 수업 필기의 첫걸음
$g_1=(0.1,\ 10)$, $\alpha=0.01$, $\varepsilon$은 무시. GD와 AdaGrad의 첫걸음은?
---
$A_1=(0.01,\ 100)$, $\sqrt{A_1}=(0.1,\ 10)$.

| 좌표 $g$ | GD $-\alpha g$ | AdaGrad $-\alpha g/\sqrt A$ |
|---|---|---|
| $0.1$ | $-0.001$ | $-0.01$ |
| $10$ | $-0.1$ | $-0.01$ |

GD는 기울기가 100배 큰 좌표로 100배 더 가지만, AdaGrad는 첫걸음에서 **모든 좌표가 같은 거리** $\alpha$만큼 갑니다($g/\sqrt{g^2}=\pm1$). 가파른 방향은 감쇠되고 완만한 방향은 가속됩니다(슬라이드: “Progress along steep directions is damped; progress along flat directions is accelerated”).
:::

**단점.** 제곱을 **모두 누적**하므로 $A_t$는 계속 커지고 유효 학습률은 계속 줄어듭니다. 볼록 문제에서는 이것이 오히려 수렴을 돕지만, 신경망처럼 오래 학습해야 하는 비볼록 문제에서는 학습률이 너무 일찍 0에 가까워져 **학습이 멈춥니다**. 예: 기울기 크기가 늘 1이면 $t$번째 걸음은 $\alpha/\sqrt t$.

### RMSProp (Tieleman & Hinton, 2012)

:::key RMSProp
감쇠율 $\beta$ (decay_rate, 보통 $0.9$ 또는 $0.99$)로 제곱 기울기의 **지수이동평균**(running average)을 씁니다.
$$z\leftarrow\beta z+(1-\beta)\,\nabla f(x)\odot\nabla f(x),\qquad x\leftarrow x-\alpha\frac{\nabla f(x)}{\sqrt z+\epsilon}.$$
:::

코드로는 grad_squared = decay_rate * grad_squared + (1 - decay_rate) * dx * dx. 슬라이드 13: “RMSProp은 AdaGrad를 개선한 것으로, AdaGrad는 과거의 모든 기울기 제곱을 누적해 갱신 크기가 계속 줄어 결국 사라진다. RMSProp은 지수이동평균을 써서 최근 기울기에 더 큰 무게를 주고 오래된 것은 할인한다.” 슬라이드 8의 식으로는
$$\begin{aligned}&\text{AdaGrad: }h\leftarrow h+\frac{\partial L}{\partial W}\odot\frac{\partial L}{\partial W},\\&\text{RMSProp: }h_i=\rho h_{i-1}+(1-\rho)\frac{\partial L_i}{\partial W}\odot\frac{\partial L_i}{\partial W},\\&W\leftarrow W-\eta\frac1{\sqrt h}\frac{\partial L}{\partial W}.\end{aligned}$$

**왜 줄어들지 않나.** 기울기 크기가 일정하게 $c$이면 $z\to c^2$ (가중치 $(1-\beta)\sum\beta^k=1$)이라 걸음이 $\alpha c/c=\alpha$로 **일정하게 유지**됩니다. AdaGrad처럼 $\alpha/\sqrt t$로 줄지 않습니다. 최근 약 $\frac1{1-\beta}$개(0.9이면 10개, 0.99이면 100개)의 기울기만 기억하는 셈입니다.

:::warn 슬라이드의 노름 기호
슬라이드 7·9의 식은 $z\leftarrow\beta z+(1-\beta)\lVert\nabla f(x)\rVert_2^2$처럼 **노름의 제곱**(스칼라)으로 적혀 있지만, 바로 옆의 코드 dx * dx는 **성분별 제곱**입니다. 좌표마다 다른 학습률을 주는 것이 핵심이므로 성분별($\odot$)로 읽어야 합니다. 스칼라로 쓰면 모든 좌표에 같은 학습률을 주는, 조건수 문제를 전혀 고치지 못하는 방법이 됩니다.
:::

:::fig adaptive
:::
` },
      { k: '14.4', src: 'W5 월(2) · 슬라이드 14–15', title: 'Adam: 모멘텀 + RMSProp + 편향 보정', body: R`
:::idea 쉽게 말하면
Adam은 두 가지를 합칩니다. 걸어갈 **방향**은 모멘텀처럼 기울기의 이동평균으로(1차 모멘트), 걸음의 **크기**는 RMSProp처럼 기울기 제곱의 이동평균의 제곱근으로 나눠서(2차 모멘트). 한 가지 문제가 있는데, 두 평균을 0에서 시작하니 처음 몇 걸음은 평균이 실제보다 작게 나옵니다. 그래서 처음에는 그만큼 키워 주는 **편향 보정**을 붙입니다.
:::

### Adam (거의 완성형, 슬라이드 14)

$$m_1\leftarrow\beta_1m_1+(1-\beta_1)\nabla f(x)\quad(\text{기울기의 이동평균: 방향, 모멘텀}),$$
$$m_2\leftarrow\beta_2m_2+(1-\beta_2)\nabla f(x)\odot\nabla f(x)\quad(\text{제곱의 이동평균: AdaGrad/RMSProp}),$$
$$x\leftarrow x-\alpha\frac{m_1}{\sqrt{m_2}+\epsilon}.$$
“모멘텀이 있는 RMSProp 같은 것”입니다.

### Adam (완성형, 슬라이드 15; Kingma & Ba, ICLR 2015)

:::key Adam
$t=1,2,\dots$에 대해 $g=\nabla f(x)$,
$$m_1\leftarrow\beta_1m_1+(1-\beta_1)g,\qquad m_2\leftarrow\beta_2m_2+(1-\beta_2)g\odot g,$$
$$\hat m_1=\frac{m_1}{1-\beta_1^t},\qquad \hat m_2=\frac{m_2}{1-\beta_2^t},\qquad x\leftarrow x-\alpha\frac{\hat m_1}{\sqrt{\hat m_2}+\epsilon}.$$
$m_1=m_2=0$에서 시작. $\beta_1=0.9$, $\beta_2=0.999$, $\alpha=10^{-3}$ 또는 $5\times10^{-4}$가 많은 모델에서 좋은 출발점이다.
:::

:::key Adam의 편향 보정
$m_1$을 0에서 시작하면 $m_{1,t}=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$이고, 기울기의 기댓값이 일정($\E g_k=\bar g$)하면
$$\E[m_{1,t}]=(1-\beta_1)\bar g\sum_{k=1}^t\beta_1^{t-k}=(1-\beta_1^t)\,\bar g.$$
따라서 $\hat m_1=m_1/(1-\beta_1^t)$는 $\bar g$의 불편추정량이다. $m_2$도 같다.
:::

**유도.** 펼친 식은 14.2절의 모멘텀과 같은 귀납법입니다. 합 $\sum_{k=1}^t\beta_1^{t-k}=1+\beta_1+\dots+\beta_1^{t-1}=\frac{1-\beta_1^t}{1-\beta_1}$ (등비급수)를 곱하면 $(1-\beta_1^t)\bar g$. 초기 $t$가 작을 때 $1-\beta^t$가 작아(예: $\beta_2=0.999$, $t=1$이면 $0.001$) 보정이 크게 작용하고, $t$가 커지면 1에 가까워져 보정이 사라집니다.

:::ex 예제 4 — 첫걸음의 크기
$\beta_1=0.9$, $\beta_2=0.999$, $\epsilon$ 무시. 첫 기울기가 $g_1$일 때 (a) 편향 보정이 있는 Adam과 (b) 보정 없는 Adam(거의 완성형)의 첫걸음은?
---
$m_1=0.1g_1$, $m_2=0.001g_1^2$ (성분별).
(a) $\hat m_1=\frac{0.1g_1}{0.1}=g_1$, $\hat m_2=\frac{0.001g_1^2}{0.001}=g_1^2$. 걸음 $=\alpha\frac{g_1}{\lvert g_1\rvert}=\alpha\,\operatorname{sign}(g_1)$ — 각 좌표가 정확히 $\alpha$만큼(기울기 크기와 무관).
(b) 걸음 $=\alpha\frac{0.1g_1}{\sqrt{0.001}\lvert g_1\rvert}=\frac{0.1}{0.0316}\alpha\approx3.16\alpha$ — 첫걸음이 의도보다 3배 이상 큽니다. 두 모멘트가 0 쪽으로 치우친 정도가 달라서($1-\beta_1=0.1$ 대 $\sqrt{1-\beta_2}\approx0.032$) 생기는 문제이고, 편향 보정이 이를 맞춰 줍니다.
:::

**각 부분의 역할(슬라이드 15의 색 상자).**
- 첫째 줄(모멘텀): 방향을 매끄럽게 — 진동 상쇄, 평평한 곳 통과.
- 둘째 줄(AdaGrad/RMSProp): 좌표별 크기 조절 — 조건수 문제 완화.
- 편향 보정: 초기 몇 걸음의 크기를 바로잡음.
- 마지막 줄: 갱신. $\frac{\hat m_1}{\sqrt{\hat m_2}}$는 “기울기의 평균 ÷ 기울기의 RMS”라 대략 $[-1,1]$ 범위의 “신호 대 잡음비”이고, 걸음의 크기는 대략 $\alpha$로 제한됩니다. 그래서 Adam의 $\alpha$는 “한 걸음에 가중치가 움직이는 대략의 크기”로 해석됩니다.

### 더 깊이: 가중치 감쇠와 AdamW

손실에 $\frac\lambda2\lVert w\rVert^2$을 더하면 기울기에 $\lambda w$가 더해지는데, Adam은 이것까지 $\sqrt{\hat m_2}$로 나눠 버려 좌표마다 규제 세기가 달라집니다. 그래서 규제를 기울기에 넣지 않고 갱신에서 따로 $w\leftarrow w-\alpha\lambda w$로 빼는 **AdamW**(분리된 가중치 감쇠)가 널리 쓰입니다[[@med:ch10:9.2|가중치 감쇠.]]. 또 Adam은 이론적으로 특정 볼록 문제에서 수렴하지 않는 반례가 있어(2차 모멘트가 줄면 유효 학습률이 커질 수 있음) $\hat m_2$의 최댓값을 쓰는 AMSGrad 같은 변형이 제안되었습니다. 실전에서는 Adam(W) + 워밍업 + 코사인 감소가 표준적인 조합입니다[[ch12:12.2|학습률 스케줄과 워밍업.]].
` },
      { k: '14.5', src: 'W5 월(2) · 슬라이드 16', title: '정리: 어떤 최적화기를 쓸까', body: R`
:::idea 쉽게 말하면
모든 방법은 “경사를 따라 내려간다”는 같은 뿌리에서 나와, (1) 과거의 **방향**을 기억하느냐(모멘텀), (2) 좌표마다 **크기**를 다르게 하느냐(적응형)로 갈립니다. Adam은 둘 다 합니다.
:::

| 방법 | 방향 | 좌표별 크기 | 상태 변수 | 핵심 초매개변수 |
|---|---|---|---|---|
| (S)GD | $g$ | 같음 | 없음 | $\alpha$ |
| 모멘텀 | $\rho v-\alpha g$ | 같음 | $v$ | $\alpha,\rho=0.9$ |
| 네스테로프 | 앞 지점의 $g$ | 같음 | $v$ | $\alpha,\rho$ |
| AdaGrad | $g$ | $1/\sqrt{\sum g^2}$ (계속 감소) | $r$ | $\alpha$ |
| RMSProp | $g$ | $1/\sqrt{\text{EMA}(g^2)}$ | $z$ | $\alpha,\beta=0.9$ |
| Adam | $\text{EMA}(g)$ | $1/\sqrt{\text{EMA}(g^2)}$ + 편향 보정 | $m_1,m_2$ | $\alpha=10^{-3},\beta_1=0.9,\beta_2=0.999$ |

- 모든 방법에서 **학습률이 가장 중요한** 초매개변수이고, 스케줄(감소, 워밍업)과 함께 씁니다[[ch12:12.1|학습률과 학습 곡선.]].
- 메모리: 모멘텀·RMSProp은 파라미터 수만큼, Adam은 2배의 추가 상태를 저장합니다.
- 실전에서는 Adam이 초매개변수에 덜 민감해 기본값으로 많이 쓰이고, 모멘텀 SGD는 잘 조율하면 일반화가 좋은 경우가 있어(특히 합성곱 신경망 영상 분류) 둘 다 쓰입니다.
- 5주차 이후: 직접 구현해 보기(“Code up!”), 그리고 합성곱 신경망(CNN).

:::tip 시험 대비 요약
(1) 조건수 예제의 좌표별 점화식과 수렴 조건 (2) 모멘텀의 펼친 식과 $\alpha/(1-\rho)$ (3) 네스테로프의 앞 지점 계산 (4) AdaGrad 첫걸음 = 모든 좌표 $\alpha$ (5) RMSProp이 AdaGrad를 고치는 이유 (6) Adam의 편향 보정 $\E m_t=(1-\beta^t)\bar g$와 첫걸음 $\alpha\operatorname{sign}(g)$. 모두 한두 줄 계산으로 나옵니다.
:::
` },
    ],
    problems: [
      { sec: '14.1', type: 'num', lv: 1, q: R`$f(x_1,x_2)=\frac12x_1^2+\frac{100}2x_2^2$에 GD를 쓸 때 발산하지 않는 학습률의 상한은?`, ans: '0.02', ansTex: R`2/\lambda_{\max}=0.02`,
        sol: R`좌표별 $x_{2}\leftarrow(1-100\alpha)x_2$, $\lvert1-100\alpha\rvert<1\iff0<\alpha<0.02$. ($x_1$의 조건 $\alpha<2$는 더 약함.)` },
      { sec: '14.1', type: 'num', lv: 1, q: R`위 함수에서 $\alpha=0.019$, $x_0=(-5,-1)$일 때 GD 세 걸음 뒤의 $x_2$ 좌표는? (소수 셋째 자리)`, ans: '0.729', ansTex: R`0.729`,
        sol: R`$x_2\leftarrow(1-1.9)x_2=-0.9x_2$: $-1\to0.9\to-0.81\to0.729$.` },
      { sec: '14.1', type: 'num', lv: 2, q: R`헤시안이 $\diag(2,50)$인 이차함수의 조건수는?`, ans: '25', ansTex: R`25`,
        sol: R`$\kappa=50/2=25$.` },
      { sec: '14.1', type: 'num', lv: 3, q: R`조건수 $\kappa=100$인 이차함수에서 최적의 고정 학습률 $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$을 쓴 GD의 한 걸음당 오차 축소율 $\frac{\kappa-1}{\kappa+1}$은? (소수 넷째 자리)`, ans: '99/101', ansTex: R`\tfrac{99}{101}\approx0.9802`,
        sol: R`$\lvert1-\alpha\lambda_{\min}\rvert=\lvert1-\alpha\lambda_{\max}\rvert=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\kappa-1}{\kappa+1}=\frac{99}{101}$.` },
      { sec: '14.2', type: 'num', lv: 1, q: R`기울기가 늘 같은 방향·크기일 때 모멘텀($\rho=0.9$)의 유효 학습률은 원래 $\alpha$의 몇 배로 수렴하는가?`, ans: '10', ansTex: R`\tfrac1{1-\rho}=10`,
        sol: R`$v_t\to-\alpha g\sum_{j\ge0}\rho^j=-\frac\alpha{1-\rho}g$. $\rho=0.9$이면 10배.` },
      { sec: '14.2', type: 'num', lv: 2, q: R`$f(x)=\frac{x^2}2$, $x_t=2$, $v_t=-1$, $\rho=0.5$, $\alpha=0.2$일 때 (보통의) 모멘텀의 $x_{t+1}$은?`, ans: '1.1', ansTex: R`1.1`,
        sol: R`$v_{t+1}=0.5(-1)-0.2f'(2)=-0.5-0.4=-0.9$, $x_{t+1}=2-0.9=1.1$.` },
      { sec: '14.2', type: 'num', lv: 2, q: R`같은 조건에서 네스테로프 모멘텀의 $x_{t+1}$은?`, ans: '1.2', ansTex: R`1.2`,
        sol: R`앞 지점 $y=2+0.5(-1)=1.5$, $v_{t+1}=-0.5-0.2f'(1.5)=-0.5-0.3=-0.8$, $x_{t+1}=2-0.8=1.2$ ($=y-\alpha f'(y)=1.5-0.3$).` },
      { sec: '14.2', type: 'mc', lv: 2, q: R`수업 예제($f=x^2/2$, $x_t=1$, $v_t=-2$, $\rho=0.9$, $\alpha=0.1$)에서 네스테로프가 모멘텀보다 최솟점에 가까운 이유는?`,
        choices: [R`학습률이 더 크기 때문`, R`앞 지점($-0.8$)에서 “이미 지나쳤다”는 기울기를 보고 되돌리는 보정($+0.08$)을 하기 때문`, R`속도를 쓰지 않기 때문`, R`기울기를 두 번 계산하기 때문`], ans: 1,
        sol: R`모멘텀은 이미 지나온 $x=1$의 기울기(오른쪽이 높음)로 더 왼쪽으로 밀어 $-0.9$, 네스테로프는 도착할 곳의 기울기로 $-0.72$.` },
      { sec: '14.3', type: 'num', lv: 1, q: R`AdaGrad에서 $g_1=(0.2,\ 20)$, $\alpha=0.05$ ($\varepsilon$ 무시)일 때 첫걸음의 둘째 성분은?`, ans: '-0.05', ansTex: R`-0.05`,
        sol: R`$A_1=(0.04,400)$, $\sqrt{A_1}=(0.2,20)$, 걸음 $-\alpha g/\sqrt A=-0.05(1,1)$. 첫걸음은 모든 좌표가 $\alpha$만큼(부호는 기울기 반대).` },
      { sec: '14.3', type: 'num', lv: 2, q: R`기울기 크기가 매번 정확히 1인 좌표에서 AdaGrad의 $t$번째 걸음 크기는 $\alpha/\sqrt t$이다. $\alpha=0.1$이면 100번째 걸음의 크기는?`, ans: '0.01', ansTex: R`0.01`,
        sol: R`$A_{100}=100$, 걸음 $0.1/\sqrt{100}=0.01$. 계속 줄어드는 것이 AdaGrad의 단점입니다.` },
      { sec: '14.3', type: 'num', lv: 2, q: R`RMSProp ($\beta=0.9$, $z_0=0$)에서 기울기가 매번 $2$이면 3번 갱신한 뒤의 $z$는?`, ans: '1.084', ansTex: R`4(1-0.9^3)=1.084`,
        sol: R`$z_1=0.1\cdot4=0.4$, $z_2=0.9(0.4)+0.4=0.76$, $z_3=0.9(0.76)+0.4=1.084$. 일반적으로 $z_t=4(1-0.9^t)$로, 0에서 시작해 $g^2=4$로 다가갑니다(초기에는 작게 치우침 — Adam이 보정하는 편향).` },
      { sec: '14.4', type: 'num', lv: 1, q: R`Adam에서 $\beta_2=0.999$일 때 $t=1$의 편향 보정 분모 $1-\beta_2^t$는?`, ans: '0.001', ansTex: R`0.001`,
        sol: R`$1-0.999=0.001$. $m_2$를 1000배 키워 줍니다.` },
      { sec: '14.4', type: 'num', lv: 2, q: R`편향 보정이 **없는** Adam($\beta_1=0.9$, $\beta_2=0.999$, $\epsilon$ 무시)의 첫걸음 크기는 $\alpha$의 몇 배인가? (소수 둘째 자리)`, ans: '0.1/sqrt(0.001)', ansTex: R`\tfrac{0.1}{\sqrt{0.001}}\approx3.16`,
        sol: R`$m_1=0.1g$, $m_2=0.001g^2$, 걸음 $\alpha\cdot0.1\lvert g\rvert/(\sqrt{0.001}\lvert g\rvert)\approx3.16\alpha$. 보정하면 정확히 $\alpha$.` },
      { sec: '14.4', type: 'mc', lv: 1, q: R`Adam 논문과 슬라이드가 권하는 출발점 초매개변수는?`,
        choices: [R`$\beta_1=0.5$, $\beta_2=0.9$, $\alpha=0.1$`, R`$\beta_1=0.9$, $\beta_2=0.999$, $\alpha=10^{-3}$ 또는 $5\times10^{-4}$`, R`$\beta_1=0.999$, $\beta_2=0.9$, $\alpha=1$`, R`$\beta_1=\beta_2=0$`], ans: 1,
        sol: R`슬라이드 15: “Adam with beta1 = 0.9, beta2 = 0.999, and learning_rate = 1e-3 or 5e-4 is a great starting point for many models!”` },
      { sec: '14.2', type: 'open', lv: 3, proof: true, q: R`모멘텀 $v_{t+1}=\rho v_t-\alpha g_t$, $v_0=0$에 대해 $v_t=-\alpha\sum_{k=0}^{t-1}\rho^{t-1-k}g_k$임을 귀납법으로 증명하고, (i) $g_k=g$ (일정)이면 $v_t\to-\frac\alpha{1-\rho}g$, (ii) $g_k=(-1)^kg$이면 $\lvert v_t\rvert\le\frac{\alpha}{1+\rho}\lvert g\rvert+\alpha\rho^t\lvert g\rvert$ 정도로 작음을 보이세요.`,
        sol: R`
**귀납법.** $t=1$: $v_1=-\alpha g_0$ ✓. $v_t$가 식을 만족하면 $v_{t+1}=\rho v_t-\alpha g_t=-\alpha\big(\sum_{k=0}^{t-1}\rho^{t-k}g_k+g_t\big)=-\alpha\sum_{k=0}^t\rho^{t-k}g_k$ ✓.
**(i)** $v_t=-\alpha g\sum_{j=0}^{t-1}\rho^j=-\alpha g\frac{1-\rho^t}{1-\rho}\to-\frac{\alpha g}{1-\rho}$ ($0\le\rho<1$).
**(ii)** $v_t=-\alpha g\sum_{k=0}^{t-1}\rho^{t-1-k}(-1)^k$. $j=t-1-k$로 바꾸면 $(-1)^{t-1}\sum_{j=0}^{t-1}(-\rho)^j$이고 $\sum_{j=0}^{t-1}(-\rho)^j=\frac{1-(-\rho)^t}{1+\rho}$. 따라서 $\lvert v_t\rvert=\alpha\lvert g\rvert\frac{\lvert1-(-\rho)^t\rvert}{1+\rho}\le\frac{\alpha\lvert g\rvert(1+\rho^t)}{1+\rho}$ — 대략 $\frac{\alpha}{1+\rho}\lvert g\rvert$로, 일정한 경우의 $\frac\alpha{1-\rho}$보다 훨씬 작습니다($\rho=0.9$이면 약 $0.53\alpha$ 대 $10\alpha$).`,
        rubric: R`
- 귀납법 — 3점
- (i) 등비급수와 극한 — 3점
- (ii) 교대 등비급수와 크기 비교 — 4점` },
      { sec: '14.4', type: 'open', lv: 3, proof: true, q: R`Adam의 1차 모멘트 $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$, $m_0=0$에 대해 $m_t=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$를 보이고, $\E g_k=\bar g$ (모든 $k$)이면 $\E[m_t]=(1-\beta_1^t)\bar g$임을 증명하세요. 이로부터 편향 보정 $\hat m_t=m_t/(1-\beta_1^t)$의 이유를 설명하세요.`,
        sol: R`
**펼치기(귀납법).** $t=1$: $m_1=(1-\beta_1)g_1$ ✓. $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t=(1-\beta_1)\big(\sum_{k=1}^{t-1}\beta_1^{t-k}g_k+g_t\big)=(1-\beta_1)\sum_{k=1}^t\beta_1^{t-k}g_k$ ✓.
**기댓값.** 선형성으로 $\E m_t=(1-\beta_1)\bar g\sum_{k=1}^t\beta_1^{t-k}=(1-\beta_1)\bar g\frac{1-\beta_1^t}{1-\beta_1}=(1-\beta_1^t)\bar g$.
**이유.** $m_0=0$에서 시작해 $m_t$는 $\bar g$보다 $(1-\beta_1^t)$배 작게(0 쪽으로) 치우칩니다. $1-\beta_1^t$로 나누면 $\E\hat m_t=\bar g$ — 불편. $t$가 크면 $\beta_1^t\to0$이라 보정이 사라지고, 초기에만 크게 작용합니다. $m_2$도 $g_k^2$에 대해 같은 계산.`,
        rubric: R`
- 펼친 식의 귀납법 — 3점
- 기댓값과 등비급수 — 4점
- 편향 보정의 의미 — 3점` },
      { sec: '14.1', type: 'open', lv: 3, proof: true, q: R`$f(x)=\frac12x^THx$ ($H$ 대칭, 고윳값 $0<\lambda_{\min}\le\dots\le\lambda_{\max}$)에 GD $x_{t+1}=x_t-\alpha Hx_t$를 쓸 때 (i) 수렴 조건 $0<\alpha<2/\lambda_{\max}$를 보이고 (ii) 이 조건 아래 가장 느린 방향의 축소율 $\max_i\lvert1-\alpha\lambda_i\rvert$가 $\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$에서 최소 $\frac{\kappa-1}{\kappa+1}$임을 보이세요.`,
        sol: R`
**(i)** $H=Q\Lambda Q^T$로 대각화하고 $u=Q^Tx$로 두면 $u_{t+1,i}=(1-\alpha\lambda_i)u_{t,i}$. 모든 초기값에서 수렴 $\iff\lvert1-\alpha\lambda_i\rvert<1$ $\forall i\iff0<\alpha<2/\lambda_{\max}$.
**(ii)** $\phi(\alpha)=\max_i\lvert1-\alpha\lambda_i\rvert=\max(\lvert1-\alpha\lambda_{\min}\rvert,\lvert1-\alpha\lambda_{\max}\rvert)$ (일차함수의 절댓값은 양 끝 $\lambda$에서 최대). 첫 항은 $\alpha$에 대해 감소($\alpha<1/\lambda_{\min}$ 구간), 둘째는 $\alpha>1/\lambda_{\max}$에서 증가하므로 최솟값은 두 값이 같을 때: $1-\alpha\lambda_{\min}=\alpha\lambda_{\max}-1\Rightarrow\alpha=\frac2{\lambda_{\max}+\lambda_{\min}}$. 그때 값 $1-\frac{2\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\lambda_{\max}-\lambda_{\min}}{\lambda_{\max}+\lambda_{\min}}=\frac{\kappa-1}{\kappa+1}$.`,
        rubric: R`
- 대각화와 좌표별 점화식 — 3점
- 수렴 조건 — 2점
- 최대가 양 끝에서 나오는 이유 — 2점
- 균형점과 값 — 3점` },
      { sec: '14.3', type: 'open', lv: 2, proof: true, q: R`RMSProp에서 기울기가 매번 같은 값 $g$ (성분별 $g_j\ne0$)이고 $z_0=0$이면 $z_t=(1-\beta^t)g\odot g$임을 보이고, $t\to\infty$일 때 걸음 크기가 $\alpha$로 일정해짐을 보이세요. AdaGrad와 비교하세요.`,
        sol: R`
$z_t=\beta z_{t-1}+(1-\beta)g^2$ (성분별). 펼치면 $z_t=(1-\beta)g^2\sum_{k=0}^{t-1}\beta^k=(1-\beta^t)g^2$. $t\to\infty$이면 $z_t\to g^2$, 걸음 $\alpha\frac{g}{\sqrt{z_t}}\to\alpha\operatorname{sign}(g)$ — 크기 $\alpha$로 일정.
AdaGrad는 $A_t=tg^2$라 걸음이 $\alpha\frac{g}{\sqrt tg}=\frac\alpha{\sqrt t}$로 계속 줄어듭니다. RMSProp은 오래된 기울기를 잊어 이 감소를 막습니다.`,
        rubric: R`
- 펼친 식 — 4점
- 극한과 걸음 크기 — 3점
- AdaGrad와 비교 — 3점` },
    ],
  });
})();
