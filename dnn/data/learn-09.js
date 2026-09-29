/* 개념 정리 — 09 역전파 (4주차 월요일(1) 슬라이드 50–89 필기, 4주차 월요일(2) 필기).
   “책임을 뒤로 나눠 주기”라는 직관에서 출발해, 스칼라 → 벡터 → 행렬 → MLP 순으로 연쇄법칙을 쌓고 작은 신경망을 손으로 끝까지 계산합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 9,
    summary: R`경사하강법에는 손실의 모든 파라미터에 대한 기울기가 필요합니다. 층이 많은 신경망에서 이를 손으로 유도하는 것은 비현실적이므로, 계산을 작은 **노드들의 그래프**로 쪼개고 각 노드에서 “상류 기울기 × 국소 기울기”를 곱해 뒤로 전달합니다(**역전파**). 덧셈은 기울기를 나눠 주고, 곱셈은 입력을 맞바꾸고, 복사는 기울기를 더하고, 최댓값은 한쪽으로만 보냅니다. 벡터에서는 야코비안이 곱해지는데, 성분별 함수는 대각이라 성분별 곱으로, 행렬곱 $z=Wx$는 $\partial L/\partial x=W^T\delta$, $\partial L/\partial W=\delta x^T$로 계산합니다. 이를 층마다 반복한 것이 다층 퍼셉트론의 역전파 점화식입니다.`,
    goals: [
      R`경사하강법 알고리즘(초기화, 갱신, 정지 조건)을 쓰고 역전파가 필요한 이유를 설명할 수 있다`,
      R`계산 그래프에서 순전파 값과 역전파 기울기를 노드마다 계산할 수 있다`,
      R`시그모이드 뉴런 예제를 노드별로, 그리고 시그모이드 게이트 한 번으로 역전파할 수 있다`,
      R`덧셈·곱셈·복사·최댓값 게이트의 기울기 규칙과 그 근거(다변수 연쇄법칙)를 말할 수 있다`,
      R`성분별 함수와 행렬곱의 벡터 역전파 공식 $W^T\delta$, $\delta x^T$를 유도하고 크기를 점검할 수 있다`,
      R`MLP의 역전파 점화식을 유도하고 작은 신경망에서 모든 기울기를 손으로 계산할 수 있다`,
    ],
    sections: [
      { k: '9.1', src: 'W4 월(1) · 슬라이드 50–53 필기', title: '경사하강법과 기울기 계산의 문제', body: R`
:::idea 쉽게 말하면
신경망이 틀렸을 때 “어느 가중치가 얼마나 책임이 있나?”를 알아야 고칠 수 있습니다. 그 책임의 크기가 기울기 $\partial L/\partial w$입니다. 파라미터가 수백만 개면 하나씩 흔들어 보며 책임을 재는 것은 불가능하고(순전파를 수백만 번), 대신 출력에서부터 **거꾸로** 책임을 나눠 주면 한 번의 역방향 계산으로 모든 책임이 구해집니다. 이것이 역전파입니다.
:::

최적화로 가중치를 학습합니다. 손실 곡면에서 시작점에 따라 다른 국소 최소에 도달할 수 있습니다.

:::key 경사하강법 알고리즘
1. (무작위) 초기화 $\theta^0$
2. 작은 보폭으로 갱신: $\theta^{k+1}\leftarrow\theta^k-\alpha\nabla\mathcal L(\theta^k)$
3. 정지 조건이 만족될 때까지 반복: $k\ge N$ 또는 $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$
:::

필기: 반복 횟수를 **에폭**(epoch)으로 세며 손실이 들쭉날쭉 내려가는 그림을 그렸습니다. (엄밀히는 에폭은 “훈련 자료 전체를 한 번 훑음”이고, 한 번의 갱신은 반복(iteration)입니다. 전체 배치 경사하강법에서는 둘이 같습니다[[ch10:10.3|미니배치 SGD에서는 에폭 하나에 여러 번 갱신합니다.]].) 역전파는 Werbos(1974), Rumelhart·Hinton·Williams(1986)가 제안했습니다. 슬라이드의 그림처럼 한 뉴런은 입력 $x_i$에 가중치 $w_{ij}$를 곱해 더한 $\mathrm{net}_j$를 활성화 함수 $\varphi$에 넣어 $o_j$를 내고, 역전파는 이 화살표를 거꾸로 따라 기울기를 보냅니다.

**왜 역전파인가.** 2층 신경망 $s=f(x;W_1,W_2)=W_2\max(0,W_1x)$, SVM 손실 $L_i=\sum_{j\ne y_i}\max(0,s_j-s_{y_i}+1)$, 규제 $R(W)=\sum_kW_k^2$, 전체 손실
$$L=\frac1N\sum_{i=1}^NL_i+\lambda R(W_1)+\lambda R(W_2)$$
에서 $\partial L/\partial W_1$, $\partial L/\partial W_2$를 **손으로** 유도할 수 있을까요? 층이 바뀔 때마다 다시 유도해야 하므로 비현실적입니다. 계산 그래프와 연쇄법칙으로 기계적으로 계산합니다.

**SVM 손실 읽기.** $L_i$는 “정답 점수 $s_{y_i}$가 다른 모든 점수보다 최소 1만큼 크면 0, 아니면 모자란 만큼 벌점”입니다. 예: 점수 $s=(3.2,\ 5.1,\ -1.7)$, 정답이 클래스 1이면 $L_i=\max(0,5.1-3.2+1)+\max(0,-1.7-3.2+1)=2.9+0=2.9$.

### 더 깊이: 수치 미분과의 비교

기울기를 **수치 미분** $\frac{\partial L}{\partial\theta_j}\approx\frac{L(\theta+h e_j)-L(\theta-he_j)}{2h}$으로 구하면 파라미터 $P$개에 순전파가 $2P$번 필요합니다. 역전파는 순전파 1번 + 역전파 1번(비슷한 비용)으로 **모든** $P$개의 기울기를 정확히 줍니다. 그래서 수치 미분은 역전파 코드가 맞는지 확인하는 **기울기 검사**에만 씁니다(상대오차 $10^{-7}$ 정도면 정상). 이 “출력 하나에 대한 모든 입력의 미분을 한 번에”가 가능한 이유는 손실이 **스칼라**이기 때문이고, 이 방법을 역방향 자동 미분이라 부릅니다[[@med:ch10:8.2|자동 미분: 순방향 모드와 역방향 모드.]].
` },
      { k: '9.2', src: 'W4 월(1) · 슬라이드 54–68 필기', title: '계산 그래프와 연쇄법칙', body: R`
:::idea 쉽게 말하면
톱니바퀴를 생각하세요. $x$를 1만큼 돌리면 $q$가 1만큼 돌고($\partial q/\partial x=1$), $q$를 1만큼 돌리면 $f$가 $z$만큼 돕니다($\partial f/\partial q=z$). 그러면 $x$를 1만큼 돌릴 때 $f$는 $1\times z$만큼 돕니다. 연쇄법칙은 **변화율을 곱하는** 규칙이고, 역전파는 이 곱을 출력 쪽에서부터 차례로 누적하는 것입니다.
:::

$f(x,y,z)=(x+y)z$, 입력 $(x,y,z)=(-2,5,-4)$. 중간값 $q=x+y$를 둡니다.

**순방향.** $q=3$, $f=qz=-12$.

**역방향.** 끝에서 시작해 $\dfrac{\partial f}{\partial f}=1$.
- $f=qz$: $\dfrac{\partial f}{\partial z}=q=3$, $\dfrac{\partial f}{\partial q}=z=-4$
- $q=x+y$: $\dfrac{\partial q}{\partial x}=\dfrac{\partial q}{\partial y}=1$
- 연쇄법칙: $\dfrac{\partial f}{\partial x}=\dfrac{\partial f}{\partial q}\dfrac{\partial q}{\partial x}=-4$, $\dfrac{\partial f}{\partial y}=-4$[[@base:ch04:4.2|다변수 연쇄법칙과 야코비 행렬의 곱.]]

:::fig graph1
:::

**확인.** $f=(x+y)z$를 직접 미분하면 $\partial f/\partial x=z=-4$, $\partial f/\partial y=z=-4$, $\partial f/\partial z=x+y=3$. 같습니다. 의미: $x$를 조금($\varepsilon$) 늘리면 $f$가 약 $-4\varepsilon$ 변합니다. 실제로 $x=-1.99$이면 $f=(3.01)(-4)=-12.04$.

:::key 연쇄법칙: 상류 × 국소 기울기
노드 $z=f(x,y)$에 뒤쪽에서 $\dfrac{\partial L}{\partial z}$(상류 기울기)가 들어오면
$$\underbrace{\frac{\partial L}{\partial x}}_{\text{하류}}=\underbrace{\frac{\partial L}{\partial z}}_{\text{상류}}\ \underbrace{\frac{\partial z}{\partial x}}_{\text{국소}},\qquad \frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}\frac{\partial z}{\partial y}$$
한 변수가 여러 노드로 흘러가면 각 경로의 기울기를 **더한다**.
:::

각 노드는 자기 입력·출력만 알면 국소 기울기를 계산할 수 있으므로, 전체 그래프가 아무리 복잡해도 노드 단위로 계산이 끝납니다. 이것이 역전파의 핵심입니다. 순방향에서 각 노드의 입력값을 **저장**해 두어야 역방향에서 국소 기울기를 계산할 수 있다는 점도 기억하세요(메모리 비용).

:::ex 예제 1 — 한 변수가 두 번 쓰일 때
$f(x,y)=(x+y)\cdot x$, $(x,y)=(2,3)$에서 $\partial f/\partial x$를 계산 그래프로 구하세요.
---
그래프: $q=x+y=5$, $f=q\cdot x=10$. $x$는 덧셈 노드와 곱셈 노드 **두 곳**으로 흘러갑니다.
- 곱셈 노드 경로(직접): $\frac{\partial f}{\partial x}\big|_{\text{직접}}=q=5$
- 덧셈 노드 경로: $\frac{\partial f}{\partial q}\cdot\frac{\partial q}{\partial x}=x\cdot1=2$
두 경로를 더해 $\frac{\partial f}{\partial x}=5+2=7$. 직접 미분하면 $f=x^2+xy$, $\partial f/\partial x=2x+y=7$ ✓. 한 경로만 세면 틀립니다.
:::
` },
      { k: '9.3', src: 'W4 월(1) · 슬라이드 69–83, W4 월(2) 필기', title: '시그모이드 뉴런의 역전파', body: R`
:::idea 쉽게 말하면
로지스틱 뉴런 하나를 아주 작은 조각(곱하기, 더하기, $\times(-1)$, $\exp$, $+1$, $1/x$)으로 쪼개면 각 조각의 미분은 고등학교 수준입니다. 끝에서 1을 출발시켜 조각마다 “들어온 기울기 × 내 미분”을 곱해 앞으로 넘기면, 모든 가중치의 기울기가 나옵니다.
:::

$$f(w,x)=\frac1{1+e^{-(w_0x_0+w_1x_1+w_2)}},$$
$$w_0=2,\ x_0=-1,\ w_1=-3,\ x_1=-2,\ w_2=-3$$

**순방향.** $w_0x_0=-2$, $w_1x_1=6$, 합 $4$, $+w_2$ → $1$, $\times(-1)$ → $-1$, $\exp$ → $0.37$, $+1$ → $1.37$, $1/x$ → $0.73$.

**국소 기울기 표.**

| 노드 | 식 | 국소 기울기 |
|---|---|---|
| 지수 | $f(x)=e^x$ | $e^x$ |
| 상수배 | $f_a(x)=ax$ | $a$ |
| 역수 | $f(x)=1/x$ | $-1/x^2$ |
| 상수 더하기 | $f_c(x)=c+x$ | $1$ |

**역방향.** 출력 기울기 $1.00$에서 시작해 차례로 곱합니다.
- $1/x$: $(1.00)\big(-1/1.37^2\big)=-0.53$
- $+1$: $(-0.53)(1)=-0.53$
- $\exp$: $(-0.53)(e^{-1})=-0.20$
- $\times(-1)$: $(-0.20)(-1)=0.20$
- 덧셈: $0.20$을 그대로 나눠 줌 → $w_2$의 기울기 $0.20$
- 곱셈 $w_0x_0$: $w_0$에 $0.20\times x_0=-0.20$, $x_0$에 $0.20\times w_0=0.40$
- 곱셈 $w_1x_1$: $w_1$에 $0.20\times x_1=-0.40$, $x_1$에 $0.20\times w_1=-0.60$

:::fig graph2
:::

:::key 시그모이드 게이트
$$\sigma(x)=\frac1{1+e^{-x}},$$
$$\frac{d\sigma}{dx}=\frac{e^{-x}}{(1+e^{-x})^2}=\Big(\frac{1+e^{-x}-1}{1+e^{-x}}\Big)\Big(\frac1{1+e^{-x}}\Big)=(1-\sigma(x))\sigma(x)$$
위 예에서 $[1.00]\times[(1-0.73)(0.73)]\approx0.20$: 네 개 노드를 한 번에 처리한 것과 같다.
:::

계산 그래프의 표현은 **유일하지 않습니다.** 국소 기울기가 쉬운 노드 단위를 고르면 됩니다.

**공식으로 확인.** $z=w_0x_0+w_1x_1+w_2=1$, $\sigma(1)\approx0.7311$, $\sigma'(1)=0.7311\times0.2689\approx0.1966$. 연쇄법칙으로 $\frac{\partial f}{\partial w_0}=\sigma'(z)x_0=-0.197$, $\frac{\partial f}{\partial w_1}=\sigma'(z)x_1=-0.393$, $\frac{\partial f}{\partial w_2}=\sigma'(z)=0.197$, $\frac{\partial f}{\partial x_0}=\sigma'(z)w_0=0.393$, $\frac{\partial f}{\partial x_1}=\sigma'(z)w_1=-0.590$. 슬라이드의 값(소수 둘째 자리 반올림)과 일치합니다.

필기(4주차 월요일 2): 이렇게 얻은 $\nabla_wf=\big(\frac{\partial f}{\partial w_0},\frac{\partial f}{\partial w_1},\frac{\partial f}{\partial w_2}\big)=(-0.2,-0.4,0.2)$가 $\min_wf(w,x)$를 푸는 경사하강법 한 걸음에 들어갑니다.

:::ex 예제 2 — 한 걸음 갱신
위 뉴런에서 학습률 $0.5$로 $f$를 **줄이는** 경사하강법 한 걸음을 적용하면 $w$와 새 출력은?
---
$w\leftarrow w-0.5\nabla_wf=(2,-3,-3)-0.5(-0.2,-0.4,0.2)=(2.1,\ -2.8,\ -3.1)$. 새 $z=2.1(-1)+(-2.8)(-2)-3.1=-2.1+5.6-3.1=0.4$, $\sigma(0.4)\approx0.599<0.731$. 출력이 줄었습니다.
:::
` },
      { k: '9.4', src: 'W4 월(1) · 슬라이드 84', title: '기울기 흐름의 패턴', body: R`
:::idea 쉽게 말하면
자주 나오는 네 가지 노드의 “기울기 통과 규칙”만 외우면 대부분의 그래프를 눈으로 역전파할 수 있습니다. 더하기는 똑같이 **나눠 주고**, 곱하기는 상대편 값을 곱해 **맞바꾸고**, 복사된 변수는 돌아온 기울기를 **모두 더하고**, 최댓값은 이긴 쪽으로만 **보냅니다**.
:::

:::key 게이트별 기울기 규칙
- **덧셈 게이트 = 기울기 분배기**: $z=x+y$이면 $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}$ (예: $3+4=7$, 상류 2 → 둘 다 2)
- **곱셈 게이트 = 입력 교환기**: $z=xy$이면 $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z}\,y$, $\frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}\,x$ (예: $2\times3=6$, 상류 5 → $x$에 $15$, $y$에 $10$)
- **복사 게이트 = 기울기 덧셈기**: $x$가 두 곳으로 쓰이면 $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z_1}+\frac{\partial L}{\partial z_2}$ (예: 4와 2 → 6)
- **최댓값 게이트 = 기울기 라우터**: $z=\max(x,y)$이면 큰 쪽에 상류 기울기 전부, 작은 쪽에 0 (예: $\max(4,5)=5$, 상류 9 → 5 쪽에 9, 4 쪽에 0)
:::

복사 게이트의 “더하기”는 다변수 연쇄법칙 $\frac{\partial L}{\partial x}=\sum_k\frac{\partial L}{\partial z_k}\frac{\partial z_k}{\partial x}$에서 나옵니다. 신경망에서 한 은닉값이 다음 층의 모든 뉴런으로 퍼지므로 이 규칙이 항상 쓰입니다.

**각 규칙의 근거.** 덧셈: $\partial(x+y)/\partial x=1$. 곱셈: $\partial(xy)/\partial x=y$ — 그래서 **다른 입력의 값**이 곱해집니다. 최댓값: $x>y$이면 $\max(x,y)=x$ 근처에서 $x$와 똑같이 움직이고 $y$는 조금 변해도 결과에 영향이 없으므로 $\partial/\partial x=1$, $\partial/\partial y=0$ (동점에서는 미분 불가능이지만 관례로 한쪽을 고름). ReLU $\max(0,x)$는 최댓값 게이트의 특수한 경우입니다.

:::warn 곱셈 게이트의 함정
곱셈 게이트는 입력의 **크기**를 맞바꿉니다. 한 입력이 매우 크면(예: 큰 가중치) 다른 쪽 기울기도 매우 커지고, 매우 작으면 기울기가 거의 0이 됩니다. 11단원의 “초기 가중치가 너무 작으면 학습이 안 된다”, 12단원의 입력 정규화가 이 성질과 관련 있습니다.
:::
` },
      { k: '9.5', src: 'W4 월(1) · 슬라이드 86–88 필기', title: '벡터 입출력과 야코비안', body: R`
:::idea 쉽게 말하면
입력과 출력이 벡터가 되어도 원리는 같습니다: “상류 기울기 × 국소 미분”. 다만 국소 미분이 행렬(야코비안)이 됩니다. 신경망에서 자주 나오는 두 경우 — 성분별 함수와 행렬곱 — 는 야코비안을 실제로 만들지 않고 짧은 공식으로 끝낼 수 있습니다.
:::

| 입력 → 출력 | 도함수 | 크기와 성분 |
|---|---|---|
| 스칼라 → 스칼라 | 보통의 도함수 | $\frac{\partial y}{\partial x}\in\mathbb R$ |
| 벡터 $\mathbb R^N$ → 스칼라 | 기울기 | $\big(\frac{\partial y}{\partial x}\big)_n=\frac{\partial y}{\partial x_n}$, $\mathbb R^N$ |
| 벡터 $\mathbb R^N$ → 벡터 $\mathbb R^M$ | 야코비안 | $\big(\frac{\partial y}{\partial x}\big)_{n,m}=\frac{\partial y_m}{\partial x_n}$, $\mathbb R^{N\times M}$ |

(필기에서는 흔히 쓰는 $J=[\partial f_i/\partial x_j]$ ($M\times N$)도 적었습니다. 슬라이드의 $N\times M$ 배치는 그 전치이며, 이 배치에서는 $\frac{\partial L}{\partial x}=\frac{\partial y}{\partial x}\frac{\partial L}{\partial y}$로 곱하는 순서가 자연스럽습니다.) 각 칸의 의미는 “$x$의 각 성분이 조금 바뀌면 $y$의 각 성분이 얼마나 바뀌나?”입니다.

:::ex 예제 3 — 성분별 ReLU (슬라이드 87)
$x=(1,-2,3,-1)$, $y=\max(0,x)$ (성분별), 상류 기울기 $\frac{\partial L}{\partial y}=(4,-1,5,9)$. $\frac{\partial L}{\partial x}$는?
---
$y=(1,0,3,0)$. 야코비안은 대각 $\diag(1,0,1,0)$(성분별 함수라 비대각은 모두 0)이므로
$$\frac{\partial L}{\partial x}=\diag(1,0,1,0)\begin{pmatrix}4\\-1\\5\\9\end{pmatrix}=\begin{pmatrix}4\\0\\5\\0\end{pmatrix}.$$
:::

:::key 벡터 역전파
성분별 함수 $y_i=g(x_i)$: 야코비안이 대각이므로 **절대 행렬을 만들지 않고** 성분별로 곱한다: $\big(\frac{\partial L}{\partial x}\big)_i=g'(x_i)\big(\frac{\partial L}{\partial y}\big)_i$. ReLU이면 $x_i>0$일 때만 통과.
행렬곱 $z=Wx$ ($W\in\mathbb R^{M\times N}$), 상류 $\delta=\frac{\partial L}{\partial z}\in\mathbb R^M$:
$$\frac{\partial L}{\partial x}=W^T\delta,\qquad \frac{\partial L}{\partial W}=\delta\,x^T\ \ (M\times N)$$
:::

**성분으로 유도.** $z_i=\sum_jW_{ij}x_j$.
- $x_j$는 모든 $z_i$에 들어가므로(복사 게이트) $\frac{\partial L}{\partial x_j}=\sum_i\frac{\partial L}{\partial z_i}\frac{\partial z_i}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j$.
- $W_{ij}$는 $z_i$에만 들어가므로 $\frac{\partial L}{\partial W_{ij}}=\delta_i\frac{\partial z_i}{\partial W_{ij}}=\delta_ix_j$, 즉 행렬 $\delta x^T$ (외적).

행렬곱 규칙은 곱셈 게이트의 “교환” 규칙의 행렬 버전입니다: $x$의 기울기에는 $W$가, $W$의 기울기에는 $x$가 곱해집니다. 크기를 맞추면 전치 위치가 자동으로 정해집니다.

:::tip 크기로 공식 되살리기
$\frac{\partial L}{\partial W}$는 $W$와 같은 크기 $M\times N$이어야 하고, 재료는 $\delta$ ($M\times1$)와 $x$ ($N\times1$)뿐입니다. $M\times N$을 만드는 방법은 $\delta x^T$ 하나. 마찬가지로 $\frac{\partial L}{\partial x}$ ($N\times1$)는 $W$ ($M\times N$)와 $\delta$로 $W^T\delta$밖에 없습니다. 시험에서 공식이 헷갈리면 크기를 맞추세요.
:::

:::ex 예제 4 — 행렬곱 역전파
$W=\begin{pmatrix}1&2\\0&-1\\3&1\end{pmatrix}$, $x=(2,1)$, $z=Wx$, 상류 $\delta=(1,-2,0.5)$. $\partial L/\partial x$와 $\partial L/\partial W$는?
---
$W^T\delta=\big(1\cdot1+0\cdot(-2)+3\cdot0.5,\ 2\cdot1+(-1)(-2)+1\cdot0.5\big)=(2.5,\ 4.5)$.
$\delta x^T=\begin{pmatrix}2&1\\-4&-2\\1&0.5\end{pmatrix}$ (행 $i$ = $\delta_i\times x^T$).
:::

### 더 깊이: 배치와 전치의 관례

표본 $B$개를 행으로 쌓은 $X\in\mathbb R^{B\times N}$에 $Z=XW^T$ ($B\times M$)로 계산하면(라이브러리 관례) $\frac{\partial L}{\partial X}=\frac{\partial L}{\partial Z}W$, $\frac{\partial L}{\partial W}=\big(\frac{\partial L}{\partial Z}\big)^TX$ — 표본별 외적 $\delta_bx_b^T$을 모두 더한 것입니다. 배치의 기울기는 표본별 기울기의 합(또는 평균)이라는 점이 10단원 미니배치 SGD의 출발점입니다. 야코비안을 실제로 만들면 $M\times N$ 행렬이 필요하지만 역전파는 “야코비안-벡터 곱”만 쓰므로 메모리가 벡터 크기로 충분합니다.
` },
      { k: '9.6', src: '9.2–9.5 종합', title: '다층 퍼셉트론의 역전파', body: R`
:::idea 쉽게 말하면
층마다 “이 층의 입력 합 $a_\ell$이 조금 바뀌면 손실이 얼마나 바뀌나”($\delta_\ell$)를 뒤에서부터 계산합니다. 한 층을 거슬러 올라갈 때마다 (1) 가중치 행렬의 전치를 곱하고 (2) 활성화의 기울기를 성분별로 곱합니다. $\delta_\ell$만 있으면 그 층의 가중치 기울기는 “$\delta_\ell$ × 그 층의 입력”입니다.
:::

MLP $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$, 손실 $L$에 위 규칙을 차례로 적용하면 층별 오차 $\delta_\ell=\partial L/\partial a_\ell$에 대한 점화식을 얻습니다.

:::key 다층 퍼셉트론의 역전파
$$\delta_L=\frac{\partial L}{\partial a_L},\qquad \delta_\ell=\sigma'(a_\ell)\odot\big(W_{\ell+1}^T\delta_{\ell+1}\big),\qquad \frac{\partial L}{\partial W_\ell}=\delta_\ell\,h_{\ell-1}^T,\qquad \frac{\partial L}{\partial b_\ell}=\delta_\ell$$
:::

**유도.** 층 $\ell+1$은 $h_\ell\xrightarrow{W_{\ell+1}}a_{\ell+1}$, 층 $\ell$의 활성화는 $a_\ell\xrightarrow{\sigma}h_\ell$.
1. 행렬곱 규칙: $\frac{\partial L}{\partial h_\ell}=W_{\ell+1}^T\frac{\partial L}{\partial a_{\ell+1}}=W_{\ell+1}^T\delta_{\ell+1}$.
2. 성분별 규칙: $\delta_\ell=\frac{\partial L}{\partial a_\ell}=\sigma'(a_\ell)\odot\frac{\partial L}{\partial h_\ell}$.
3. 행렬곱 규칙(가중치 쪽): $a_\ell=W_\ell h_{\ell-1}+b_\ell$에서 $\frac{\partial L}{\partial W_\ell}=\delta_\ell h_{\ell-1}^T$, 편향은 덧셈이라 $\frac{\partial L}{\partial b_\ell}=\delta_\ell$.

- $\delta_\ell$을 구하는 데 행렬-벡터 곱 하나, 성분별 곱 하나가 들므로 역전파 한 번의 비용은 순전파와 같은 차수입니다.
- 소프트맥스 + 교차 엔트로피 출력이면 $\delta_L=p-y$[[ch06:6.3|$\partial J/\partial z_m=p_m-y_m$.]], 선형 출력 + 제곱오차 $\frac12\lVert y_L-t\rVert^2$이면 $\delta_L=y_L-t$.
- 의료 인공지능 과목(Bishop 8장)의 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$가 바로 이 식의 성분 표기입니다[[@med:ch10:8.1b|오차 역전파: 은닉 유닛의 오차 = 활성화의 기울기 × 다음 층 오차의 가중합.]].

:::ex 예제 5 — 2-2-1 신경망을 손으로 끝까지
$x=(1,2)$, $W_1=\begin{pmatrix}0.5&-0.5\\1&0\end{pmatrix}$, $b_1=(0,-0.5)$, ReLU, $W_2=(1\ \ {-1})$, $b_2=0$, 목표 $t=1$, 손실 $L=\frac12(y-t)^2$. 모든 기울기를 구하세요.
---
**순전파.** $a_1=W_1x+b_1=(0.5-1+0,\ 1+0-0.5)=(-0.5,\ 0.5)$, $h=\ReLU(a_1)=(0,\ 0.5)$, $y=W_2h+b_2=-0.5$, $L=\frac12(-1.5)^2=1.125$.
**출력층.** $\delta_2=y-t=-1.5$. $\frac{\partial L}{\partial W_2}=\delta_2h^T=(0,\ -0.75)$, $\frac{\partial L}{\partial b_2}=-1.5$.
**은닉층.** $W_2^T\delta_2=(-1.5,\ 1.5)$. $\ReLU'(a_1)=(0,1)$이므로 $\delta_1=(0,\ 1.5)$.
$\frac{\partial L}{\partial W_1}=\delta_1x^T=\begin{pmatrix}0&0\\1.5&3\end{pmatrix}$, $\frac{\partial L}{\partial b_1}=(0,\ 1.5)$.
**확인.** $W_1$의 $(2,1)$ 성분을 $\varepsilon$만큼 늘리면 $a_{1,2}$가 $\varepsilon\cdot x_1=\varepsilon$ 늘고, $h_2$도 $\varepsilon$ 늘고, $y$는 $-\varepsilon$, $L$은 약 $(y-t)(-\varepsilon)=1.5\varepsilon$ 늡니다 ✓. 첫 은닉 뉴런은 꺼져 있어 $W_1$의 첫 행 기울기가 모두 0입니다.
:::

:::fig mlpback
:::

### 더 깊이: 기울기 소실과 폭발

점화식을 펼치면 $\delta_\ell=\sigma'(a_\ell)\odot W_{\ell+1}^T\big(\sigma'(a_{\ell+1})\odot W_{\ell+2}^T(\cdots)\big)$ — 층마다 $W^T$와 $\sigma'$이 **곱해집니다**. 시그모이드는 $\sigma'\le\frac14$라 층이 10개면 $4^{-10}\approx10^{-6}$배로 기울기가 사라질 수 있고(소실), 가중치가 크면 반대로 폭발합니다. 10단원(ReLU), 11단원(분산을 유지하는 초기화), 12단원(배치 정규화)이 모두 이 곱이 1 근처에 머물도록 하려는 장치입니다[[ch11:11.1|너무 작거나 큰 초기화에서 활성값과 기울기가 사라지거나 폭발하는 실험.]].
` },
    ],
  });
})();
