/* 09 역전파 — 4주차 월요일(1) s.50–89 필기, 4주차 월요일(2) 필기 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 9, part: 'C', title: '역전파와 계산 그래프', en: 'Backpropagation', ref: 'W4 월(1) · s.50–89', plot: 'graph',
    fig: R`층으로 이어진 계산 그래프. 굵은 선은 기울기가 거슬러 올라가는 한 경로`,
    tagline: R`하류 기울기 = 상류 기울기 × 국소 기울기. 이 한 줄을 노드마다 반복하면 어떤 신경망의 기울기도 계산됩니다.`,
    summary: R`경사하강법에는 손실의 기울기가 필요하지만 신경망에서 이를 손으로 구하는 것은 비현실적입니다. 함수를 작은 연산(노드)으로 나눈 **계산 그래프** 위에서 연쇄법칙을 적용하면, 각 노드는 들어온 **상류 기울기**에 자신의 **국소 기울기**를 곱해 뒤로 보내기만 하면 됩니다. $f=(x+y)z$와 시그모이드 뉴런 예제를 앞뒤로 계산하고, 덧셈·곱셈·복사·최댓값 게이트의 기울기 패턴, 벡터 입출력에서의 야코비안과 ReLU 예제를 다룹니다.`,
    goals: [
      R`경사하강법의 알고리즘과 정지 조건을 쓸 수 있다`,
      R`계산 그래프에서 순방향 값과 역방향 기울기를 채울 수 있다`,
      R`시그모이드 게이트의 국소 기울기 $\sigma(1-\sigma)$를 유도하고 뉴런 예제의 기울기를 구할 수 있다`,
      R`덧셈·곱셈·복사·최댓값 게이트의 기울기 규칙을 연쇄법칙으로 설명할 수 있다`,
      R`야코비안의 정의를 쓰고 성분별 ReLU와 행렬곱의 역전파를 계산할 수 있다`,
    ],
    secTitles: { '9.1': '경사하강법', '9.2': '연쇄법칙', '9.3': '시그모이드 뉴런', '9.4': '게이트 패턴', '9.5': '벡터·야코비안', '9.6': 'MLP 역전파' },
    sections: [
      { k: '9.1', src: 'W4 월(1) · 슬라이드 50–53 필기', title: '경사하강법과 기울기 계산의 문제', body: R`
최적화로 가중치를 학습합니다. 손실 곡면에서 시작점에 따라 다른 국소 최소에 도달할 수 있습니다.

:::key 경사하강법 알고리즘
1. (무작위) 초기화 $\theta^0$
2. 작은 보폭으로 갱신: $\theta^{k+1}\leftarrow\theta^k-\alpha\nabla\mathcal L(\theta^k)$
3. 정지 조건이 만족될 때까지 반복: $k\ge N$ 또는 $\lVert\theta^{k+1}-\theta^k\rVert<\epsilon$
:::

필기: 반복 횟수를 **에폭**(epoch)으로 세며 손실이 들쭉날쭉 내려가는 그림을 그렸습니다. 역전파는 Werbos(1974), Rumelhart·Hinton·Williams(1986)가 제안했습니다.

**왜 역전파인가.** 2층 신경망 $s=f(x;W_1,W_2)=W_2\max(0,W_1x)$, SVM 손실 $L_i=\sum_{j\ne y_i}\max(0,s_j-s_{y_i}+1)$, 규제 $R(W)=\sum_kW_k^2$, 전체 손실
$$L=\frac1N\sum_{i=1}^NL_i+\lambda R(W_1)+\lambda R(W_2)$$
에서 $\partial L/\partial W_1$, $\partial L/\partial W_2$를 **손으로** 유도할 수 있을까요? 층이 바뀔 때마다 다시 유도해야 하므로 비현실적입니다. 계산 그래프와 연쇄법칙으로 기계적으로 계산합니다.
` },
      { k: '9.2', src: 'W4 월(1) · 슬라이드 54–68 필기', title: '계산 그래프와 연쇄법칙', body: R`
$f(x,y,z)=(x+y)z$, 입력 $(x,y,z)=(-2,5,-4)$. 중간값 $q=x+y$를 둡니다.

**순방향.** $q=3$, $f=qz=-12$.

**역방향.** 끝에서 시작해 $\dfrac{\partial f}{\partial f}=1$.
- $f=qz$: $\dfrac{\partial f}{\partial z}=q=3$, $\dfrac{\partial f}{\partial q}=z=-4$
- $q=x+y$: $\dfrac{\partial q}{\partial x}=\dfrac{\partial q}{\partial y}=1$
- 연쇄법칙: $\dfrac{\partial f}{\partial x}=\dfrac{\partial f}{\partial q}\dfrac{\partial q}{\partial x}=-4$, $\dfrac{\partial f}{\partial y}=-4$[[@base:ch04:4.2|다변수 연쇄법칙과 야코비 행렬의 곱.]]

:::fig graph1

:::key 연쇄법칙: 상류 × 국소 기울기
노드 $z=f(x,y)$에 뒤쪽에서 $\dfrac{\partial L}{\partial z}$(상류 기울기)가 들어오면
$$\underbrace{\frac{\partial L}{\partial x}}_{\text{하류}}=\underbrace{\frac{\partial L}{\partial z}}_{\text{상류}}\ \underbrace{\frac{\partial z}{\partial x}}_{\text{국소}},\qquad \frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}\frac{\partial z}{\partial y}$$
한 변수가 여러 노드로 흘러가면 각 경로의 기울기를 **더한다**.
:::

각 노드는 자기 입력·출력만 알면 국소 기울기를 계산할 수 있으므로, 전체 그래프가 아무리 복잡해도 노드 단위로 계산이 끝납니다. 이것이 역전파의 핵심입니다.
` },
      { k: '9.3', src: 'W4 월(1) · 슬라이드 69–83, W4 월(2) 필기', title: '시그모이드 뉴런의 역전파', body: R`
$$f(w,x)=\frac1{1+e^{-(w_0x_0+w_1x_1+w_2)}},\qquad w_0=2,\ x_0=-1,\ w_1=-3,\ x_1=-2,\ w_2=-3$$

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

:::key 시그모이드 게이트
$$\sigma(x)=\frac1{1+e^{-x}},\qquad \frac{d\sigma}{dx}=\frac{e^{-x}}{(1+e^{-x})^2}=\Big(\frac{1+e^{-x}-1}{1+e^{-x}}\Big)\Big(\frac1{1+e^{-x}}\Big)=(1-\sigma(x))\sigma(x)$$
위 예에서 $[1.00]\times[(1-0.73)(0.73)]\approx0.20$: 네 개 노드를 한 번에 처리한 것과 같다.
:::

계산 그래프의 표현은 **유일하지 않습니다.** 국소 기울기가 쉬운 노드 단위를 고르면 됩니다.

필기(4주차 월요일 2): 이렇게 얻은 $\nabla_wf=\big(\frac{\partial f}{\partial w_0},\frac{\partial f}{\partial w_1},\frac{\partial f}{\partial w_2}\big)=(-0.2,-0.4,0.2)$가 $\min_wf(w,x)$를 푸는 경사하강법 한 걸음에 들어갑니다.
` },
      { k: '9.4', src: 'W4 월(1) · 슬라이드 84', title: '기울기 흐름의 패턴', body: R`
:::key 게이트별 기울기 규칙
- **덧셈 게이트 = 기울기 분배기**: $z=x+y$이면 $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}$ (예: $3+4=7$, 상류 2 → 둘 다 2)
- **곱셈 게이트 = 입력 교환기**: $z=xy$이면 $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z}\,y$, $\frac{\partial L}{\partial y}=\frac{\partial L}{\partial z}\,x$ (예: $2\times3=6$, 상류 5 → $x$에 $15$, $y$에 $10$)
- **복사 게이트 = 기울기 덧셈기**: $x$가 두 곳으로 쓰이면 $\frac{\partial L}{\partial x}=\frac{\partial L}{\partial z_1}+\frac{\partial L}{\partial z_2}$ (예: 4와 2 → 6)
- **최댓값 게이트 = 기울기 라우터**: $z=\max(x,y)$이면 큰 쪽에 상류 기울기 전부, 작은 쪽에 0 (예: $\max(4,5)=5$, 상류 9 → 5 쪽에 9, 4 쪽에 0)
:::

복사 게이트의 “더하기”는 다변수 연쇄법칙 $\frac{\partial L}{\partial x}=\sum_k\frac{\partial L}{\partial z_k}\frac{\partial z_k}{\partial x}$에서 나옵니다. 신경망에서 한 은닉값이 다음 층의 모든 뉴런으로 퍼지므로 이 규칙이 항상 쓰입니다.
` },
      { k: '9.5', src: 'W4 월(1) · 슬라이드 86–88 필기', title: '벡터 입출력과 야코비안', body: R`
| 입력 → 출력 | 도함수 | 크기와 성분 |
|---|---|---|
| 스칼라 → 스칼라 | 보통의 도함수 | $\frac{\partial y}{\partial x}\in\mathbb R$ |
| 벡터 $\mathbb R^N$ → 스칼라 | 기울기 | $\big(\frac{\partial y}{\partial x}\big)_n=\frac{\partial y}{\partial x_n}$, $\mathbb R^N$ |
| 벡터 $\mathbb R^N$ → 벡터 $\mathbb R^M$ | 야코비안 | $\big(\frac{\partial y}{\partial x}\big)_{n,m}=\frac{\partial y_m}{\partial x_n}$, $\mathbb R^{N\times M}$ |

(필기에서는 흔히 쓰는 $J=[\partial f_i/\partial x_j]$ ($M\times N$)도 적었습니다. 슬라이드의 $N\times M$ 배치는 그 전치이며, 이 배치에서는 $\frac{\partial L}{\partial x}=\frac{\partial y}{\partial x}\frac{\partial L}{\partial y}$로 곱하는 순서가 자연스럽습니다.)

:::ex 예제 1 — 성분별 ReLU (슬라이드 87)
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

행렬곱 규칙은 곱셈 게이트의 “교환” 규칙의 행렬 버전입니다: $x$의 기울기에는 $W$가, $W$의 기울기에는 $x$가 곱해집니다. 크기를 맞추면 전치 위치가 자동으로 정해집니다.
` },
      { k: '9.6', src: '9.2–9.5 종합', title: '다층 퍼셉트론의 역전파', body: R`
MLP $a_\ell=W_\ell h_{\ell-1}+b_\ell$, $h_\ell=\sigma(a_\ell)$, 손실 $L$에 위 규칙을 차례로 적용하면 층별 오차 $\delta_\ell=\partial L/\partial a_\ell$에 대한 점화식을 얻습니다.

:::key 다층 퍼셉트론의 역전파
$$\delta_L=\frac{\partial L}{\partial a_L},\qquad \delta_\ell=\sigma'(a_\ell)\odot\big(W_{\ell+1}^T\delta_{\ell+1}\big),\qquad \frac{\partial L}{\partial W_\ell}=\delta_\ell\,h_{\ell-1}^T,\qquad \frac{\partial L}{\partial b_\ell}=\delta_\ell$$
:::

- $\delta_\ell$을 구하는 데 행렬-벡터 곱 하나, 성분별 곱 하나가 들므로 역전파 한 번의 비용은 순전파와 같은 차수입니다.
- 소프트맥스 + 교차 엔트로피 출력이면 $\delta_L=p-y$[[ch06:6.3|$\partial J/\partial z_m=p_m-y_m$.]], 선형 출력 + 제곱오차 $\frac12\lVert y_L-t\rVert^2$이면 $\delta_L=y_L-t$.
- 의료 인공지능 과목(Bishop 8장)의 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$가 바로 이 식의 성분 표기입니다[[@med:ch09:8.1b|오차 역전파: 은닉 유닛의 오차 = 활성화의 기울기 × 다음 층 오차의 가중합.]].
` },
    ],
    problems: [
      { sec: '9.2', type: 'num', lv: 1, q: R`$f=(x+y)z$, $(x,y,z)=(1,2,3)$에서 $\partial f/\partial x$는?`, ans: '3', ansTex: R`3`,
        sol: R`$\partial f/\partial q=z=3$, $\partial q/\partial x=1$. $3$.` },
      { sec: '9.2', type: 'num', lv: 1, q: R`같은 입력에서 $\partial f/\partial z$는?`, ans: '3', ansTex: R`3`,
        sol: R`$\partial f/\partial z=q=x+y=3$.` },
      { sec: '9.2', type: 'num', lv: 2, q: R`$f=(x+y)\cdot\max(y,z)$, $(x,y,z)=(1,3,2)$에서 $\partial f/\partial y$는?`, ans: '7', ansTex: R`7`,
        sol: R`$y$가 두 경로로 쓰입니다. $q=x+y=4$, $m=\max(y,z)=3$ (y 쪽). $\partial f/\partial y=m\cdot1+q\cdot1=3+4=7$. 복사 게이트의 합.` },
      { sec: '9.3', type: 'num', lv: 2, q: R`시그모이드 뉴런 예제에서 $x_1$에 대한 기울기는?`, ans: '-0.6', ansTex: R`-0.60`,
        sol: R`시그모이드 게이트 뒤 덧셈 노드로 $0.20$이 들어오고, 곱셈 게이트 $w_1x_1$에서 $x_1$의 기울기는 $0.20\times w_1=0.20\times(-3)=-0.60$.` },
      { sec: '9.3', type: 'num', lv: 2, q: R`같은 뉴런에서 입력을 $x_0=0$, $x_1=0$으로 바꾸면($w$는 그대로) $\partial f/\partial w_2$는?`, ans: 'e^3/(1+e^3)^2', ansTex: R`\sigma(-3)(1-\sigma(-3))\approx0.0452`,
        sol: R`합이 $w_2=-3$이므로 $\sigma(-3)\approx0.0474$. $\partial f/\partial w_2=\sigma(1-\sigma)\approx0.0474\times0.9526\approx0.0452$.` },
      { sec: '9.3', type: 'mc', lv: 1, q: R`$1/x$ 노드의 국소 기울기는?`,
        choices: [R`$1/x^2$`, R`$-1/x^2$`, R`$\ln x$`, R`$-x^2$`], ans: 1,
        sol: R`$\frac d{dx}x^{-1}=-x^{-2}$. 예제에서 $-1/1.37^2\approx-0.53$.` },
      { sec: '9.4', type: 'num', lv: 1, q: R`곱셈 게이트 $z=xy$, $x=2$, $y=3$, 상류 기울기 5일 때 $\partial L/\partial x$는?`, ans: '15', ansTex: R`15`,
        sol: R`입력 교환: $5\times y=15$. $\partial L/\partial y=5\times x=10$.` },
      { sec: '9.4', type: 'mc', lv: 1, q: R`$z=\max(x,y)$, $x=4$, $y=5$, 상류 기울기 9일 때 $(\partial L/\partial x,\ \partial L/\partial y)$는?`,
        choices: [R`$(9,9)$`, R`$(0,9)$`, R`$(4.5,4.5)$`, R`$(9,0)$`], ans: 1,
        sol: R`최댓값 게이트는 선택된 입력으로만 기울기를 보냅니다.` },
      { sec: '9.4', type: 'mc', lv: 2, q: R`한 은닉값이 다음 층의 뉴런 세 개로 복사되어 각각 상류 기울기 $1,-2,4$를 받는다. 그 은닉값의 기울기는?`,
        choices: [R`4`, R`3`, R`$-2$`, R`$\tfrac13$`], ans: 1,
        sol: R`복사 게이트는 기울기를 더합니다: $1-2+4=3$.` },
      { sec: '9.5', type: 'num', lv: 2, q: R`$x=(2,-1,0.5)$, $y=\max(0,x)$, 상류 $\partial L/\partial y=(3,7,-2)$일 때 $\partial L/\partial x$의 성분 합은?`, ans: '1', ansTex: R`1`,
        sol: R`마스크 $(1,0,1)$이므로 $(3,0,-2)$, 합 $1$.` },
      { sec: '9.5', type: 'mc', lv: 2, q: R`$z=Wx$, $W\in\mathbb R^{3\times5}$, 상류 $\delta\in\mathbb R^3$일 때 $\partial L/\partial W$는?`,
        choices: [R`$x\delta^T$ ($5\times3$)`, R`$\delta x^T$ ($3\times5$)`, R`$W^T\delta$`, R`$\delta^Tx$`], ans: 1,
        sol: R`$z_i=\sum_jW_{ij}x_j$이므로 $\partial L/\partial W_{ij}=\delta_ix_j$, 즉 $\delta x^T$. 크기가 $W$와 같아야 합니다.` },
      { sec: '9.5', type: 'num', lv: 2, q: R`$W=\begin{pmatrix}1&2\\0&-1\end{pmatrix}$, $z=Wx$, 상류 $\delta=(3,1)$일 때 $\partial L/\partial x$의 둘째 성분은?`, ans: '5', ansTex: R`5`,
        sol: R`$W^T\delta=\begin{pmatrix}1&0\\2&-1\end{pmatrix}\begin{pmatrix}3\\1\end{pmatrix}=(3,\ 6-1)=(3,5)$.` },
      { sec: '9.6', type: 'mc', lv: 2, q: R`MLP에서 $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$일 때, 시그모이드 활성화로 층이 깊어지면 생기기 쉬운 문제는?`,
        choices: [R`기울기 폭발만 생긴다`, R`$\sigma'\le\frac14$가 층마다 곱해져 기울기 소실이 생기기 쉽다`, R`기울기가 항상 1이다`, R`역전파가 불가능하다`], ans: 1,
        sol: R`가중치가 크지 않으면 $\frac14$ 이하의 인수가 층 수만큼 곱해져 앞쪽 층의 기울기가 0에 가까워집니다. ReLU(양수 구간 기울기 1), 좋은 초기화, 배치 정규화, 잔차 연결이 이를 완화합니다.` },
      { sec: '9.3', type: 'open', lv: 2, proof: true, q: R`$f(w,x)=\sigma(w_0x_0+w_1x_1+w_2)$에 대해 계산 그래프를 그리고, $w_0=2,x_0=-1,w_1=-3,x_1=-2,w_2=-3$에서 모든 입력의 기울기를 역전파로 구하세요. 시그모이드 게이트를 한 노드로 묶어 같은 답이 나옴을 확인하세요.`,
        sol: R`
순방향: $w_0x_0=-2$, $w_1x_1=6$, 합 $4$, $+w_2=1$, $\times-1=-1$, $e^{(\cdot)}=0.368$, $+1=1.368$, $1/x=0.731$.
역방향: $1/x$: $-1/1.368^2=-0.534$; $+1$: $-0.534$; $\exp$: $-0.534\times0.368=-0.197$; $\times-1$: $0.197$; 덧셈: $w_2$와 두 곱에 $0.197$.
곱셈: $\partial f/\partial w_0=0.197\times(-1)=-0.197$, $\partial f/\partial x_0=0.197\times2=0.393$, $\partial f/\partial w_1=0.197\times(-2)=-0.393$, $\partial f/\partial x_1=0.197\times(-3)=-0.590$.
**묶어서.** $\sigma'(1)=\sigma(1)(1-\sigma(1))=0.731\times0.269=0.197$. 같은 값이 덧셈 노드로 전달되어 결과가 같습니다(반올림하면 슬라이드의 $-0.20,0.40,-0.40,-0.60,0.20$).`,
        rubric: R`
- 순방향 값 — 3점
- 역방향 각 노드의 국소 기울기와 곱 — 4점
- 곱셈 게이트 교환 규칙 — 2점
- 시그모이드 게이트로 확인 — 1점` },
      { sec: '9.5', type: 'open', lv: 3, proof: true, q: R`$z=Wx$ ($W\in\mathbb R^{M\times N}$)이고 $L$이 $z$를 통해서만 $W,x$에 의존할 때 $\frac{\partial L}{\partial x}=W^T\frac{\partial L}{\partial z}$, $\frac{\partial L}{\partial W}=\frac{\partial L}{\partial z}x^T$임을 성분으로 증명하세요.`,
        sol: R`
$z_i=\sum_{j=1}^NW_{ij}x_j$. 다변수 연쇄법칙: $\frac{\partial L}{\partial x_j}=\sum_i\frac{\partial L}{\partial z_i}\frac{\partial z_i}{\partial x_j}=\sum_i\delta_iW_{ij}=(W^T\delta)_j$.
$W_{kl}$은 $z_k$에만 나타나고 $\partial z_k/\partial W_{kl}=x_l$이므로 $\frac{\partial L}{\partial W_{kl}}=\delta_kx_l=(\delta x^T)_{kl}$.`,
        rubric: R`
- $z_i$의 성분식 — 2점
- $x$에 대한 연쇄법칙(합) — 4점
- $W$에 대한 기울기와 외적 꼴 — 4점` },
    ],
  });
})();
