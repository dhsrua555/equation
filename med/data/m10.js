/* 10 역전파 — Bishop 8.1–8.2 (p.233–251), 강의 Ch08 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 10, part: 'C', title: '역전파', en: 'Backpropagation', ref: 'Bishop §8.1–8.2', plot: 'backprop',
    fig: R`순전파로 사전활성과 활성을 계산한 뒤, 오차 신호 δ를 출력에서 입력 쪽으로 거꾸로 전달`,
    tagline: R`가중치 기울기 = 오차 신호 × 입력 활성. 은닉 유닛의 오차 = 활성화 기울기 × 다음 층 오차의 가중합.`,
    summary: R`역전파는 피드포워드 신경망의 오차함수 $E(\mathbf w)$를 파라미터에 대해 **효율적으로** 미분하는 알고리즘으로, 정보를 망을 따라 거꾸로 전달하는 국소 메시지 전달입니다. 단층 선형 모델의 기울기(오차 신호 × 입력)에서 출발해, 일반 피드포워드망의 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$를 유도하고, tanh 은닉층 2층망 예제를 손으로 계산합니다. 수치 미분(유한·중앙 차분)과의 비용 비교, 입력에 대한 **야코비안**, 오차의 **헤시안**과 Levenberg–Marquardt(외적) 근사, 그리고 현대 프레임워크의 **자동 미분**(전진·후진 모드)까지 다룹니다.`,
    goals: [
      R`단층 선형 모델에서 $\partial E_n/\partial w_{ji}=(y_{nj}-t_{nj})x_{ni}$를 유도할 수 있다`,
      R`$\delta_j\equiv\partial E_n/\partial a_j$를 정의하고 역전파 공식 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$를 연쇄법칙으로 유도할 수 있다`,
      R`tanh 은닉층·선형 출력의 2층망에서 순전파·역전파를 손으로 계산할 수 있다`,
      R`유한 차분과 중앙 차분의 오차 차수, 수치 미분의 $O(W^2)$ 비용을 설명할 수 있다`,
      R`출력층 활성화별 $\partial y_k/\partial a_l$(선형·시그모이드·소프트맥스)와 야코비안 역전파를 쓸 수 있다`,
      R`제곱오차의 헤시안을 유도하고 Levenberg–Marquardt 근사의 조건을 설명할 수 있다`,
      R`전진 모드와 후진 모드 자동 미분의 차이와 쓰임을 비교할 수 있다`,
    ],
    secTitles: { '8.1': '단층 신경망', '8.1b': '일반 피드포워드망', '8.1c': '2층 예제와 수치 미분', '8.1d': '야코비안과 헤시안', '8.2': '자동 미분' },
    sections: [
      { k: '8.1', label: '8.1.1', p: '234', src: '슬라이드 2–4', title: '단층 신경망의 기울기', body: R`
역전파는 옵티마이저가 쓸 **기울기**를 계산합니다. 핵심 목표는 피드포워드망의 오차 $E(\mathbf w)$를 파라미터에 대해 효율적으로 미분하는 것이고, 정보를 **거꾸로** 전달하는 국소 메시지 전달 알고리즘입니다. 현대 프레임워크는 순전파만 정의하면 기울기를 **자동 미분**으로 계산합니다(8.2).

독립 자료의 최대가능도 오차는 $E(\mathbf w)=\sum_nE_n(\mathbf w)$이므로 한 점의 $\nabla E_n$만 구하면 됩니다.

:::fig singlelayer
:::

:::key 단층 신경망의 기울기
출력이 입력의 가중합인 선형 모델과 제곱오차
$$y_k=\sum_iw_{ki}x_i,\qquad E_n=\frac12\sum_k(y_{nk}-t_{nk})^2$$
에서
$$\frac{\partial E_n}{\partial w_{ji}}=(y_{nj}-t_{nj})\,x_{ni}\qquad(\text{가중치 기울기}=\text{오차 신호}\times\text{입력 활성})$$
:::

$w_{ji}$는 $y_{nj}$에만 들어 있으므로 $\partial E_n/\partial w_{ji}=(y_{nj}-t_{nj})\,\partial y_{nj}/\partial w_{ji}=(y_{nj}-t_{nj})x_{ni}$. 이 “오차 신호 × 입력” 구조가 다층망에서도 그대로 유지됩니다.
` },
      { k: '8.1b', label: '8.1.2', p: '235', src: '슬라이드 5–6', title: '일반 피드포워드망과 역전파 알고리즘', body: R`
일반 피드포워드망에서 유닛 $j$는 입력의 가중합(사전활성)을 계산한 뒤 비선형 활성화를 적용합니다(편향은 $z_0=1$인 가중치로 흡수).
$$a_j=\sum_iw_{ji}z_i,\qquad z_j=h(a_j)$$

:::key 역전파 공식
오차 신호(“errors”) $\delta_j\equiv\dfrac{\partial E_n}{\partial a_j}$로 두면
$$\frac{\partial E_n}{\partial w_{ji}}=\delta_jz_i,\qquad \delta_k=y_k-t_k\ (\text{출력 유닛})$$
$$\delta_j=h'(a_j)\sum_kw_{kj}\delta_k\ (\text{은닉 유닛})$$
합은 유닛 $j$가 연결을 보내는 모든 유닛 $k$에 대해 취합니다.
:::

:::fig delta
:::

- **가중치 기울기 = 오차 신호 × 입력 활성** — $w_{ji}$는 $a_j$를 통해서만 $E_n$에 영향을 주므로 $\frac{\partial E_n}{\partial w_{ji}}=\frac{\partial E_n}{\partial a_j}\frac{\partial a_j}{\partial w_{ji}}=\delta_jz_i$.
- **은닉 유닛 오차 = 활성화의 기울기 × 다음 층 오차의 가중합** — $a_j$는 $z_j$를 거쳐 $j$가 연결된 모든 $a_k$에 영향을 주므로 $\delta_j=\sum_k\frac{\partial E_n}{\partial a_k}\frac{\partial a_k}{\partial a_j}=\sum_k\delta_kw_{kj}h'(a_j)$.
- 출력의 $\delta_k=y_k-t_k$는 선형 출력+제곱오차뿐 아니라 시그모이드+교차엔트로피, 소프트맥스+다중 교차엔트로피(정준 연결)에서도 같은 형태입니다.

**알고리즘 (Algorithm 8.1).** 입력: $\mathbf x_n$, 파라미터 $\mathbf w$, 오차 $E_n(\mathbf w)$, 활성화 $h(a)$. 출력: $\{\partial E_n/\partial w_{ji}\}$.
1. **순전파**: 모든 은닉·출력 유닛 $j$에 대해 $a_j\leftarrow\sum_iw_{ji}z_i$ ($\{z_i\}$는 입력 $\{x_i\}$ 포함), $z_j\leftarrow h(a_j)$
2. **오차 평가**: 모든 출력 유닛 $k$에 대해 $\delta_k\leftarrow\partial E_n/\partial a_k$
3. **역전파**(역순): 모든 은닉 유닛 $j$에 대해 $\delta_j\leftarrow h'(a_j)\sum_kw_{kj}\delta_k$, $\partial E_n/\partial w_{ji}\leftarrow\delta_jz_i$

배치의 기울기는 $\partial E/\partial w_{ji}=\sum_n\partial E_n/\partial w_{ji}$로 합칩니다. 계산 그래프 관점과 행렬 형태의 유도는 심층 신경망 과목에서 자세히 다룹니다[[@dnn:ch09:9.6|다층 퍼셉트론 역전파의 행렬 형태.]].
` },
      { k: '8.1c', label: '8.1.3–8.1.4', p: '238', src: '슬라이드 7', title: '2층 신경망 예제와 수치 미분', body: R`
출력 유닛은 **선형**, 은닉 유닛은 시그모이드 모양의 **tanh** 활성화를 쓰는 2층망(입력 $D$, 은닉 $M$, 출력 $K$, $x_0=z_0=1$은 편향).

:::fig mlp2
:::

:::key 2층 신경망 역전파
$$h(a)=\tanh(a),\qquad h'(a)=1-h(a)^2,\qquad E_n=\frac12\sum_{k=1}^K(y_k-t_k)^2$$
순전파: $a_j=\sum_{i=0}^Dw_{ji}^{(1)}x_i$, $z_j=\tanh(a_j)$, $y_k=\sum_{j=0}^Mw_{kj}^{(2)}z_j$
$$\delta_k=y_k-t_k,\qquad \delta_j=(1-z_j^2)\sum_{k=1}^Kw_{kj}^{(2)}\delta_k$$
$$\frac{\partial E_n}{\partial w_{ji}^{(1)}}=\delta_jx_i,\qquad \frac{\partial E_n}{\partial w_{kj}^{(2)}}=\delta_kz_j$$
:::

:::ex 손으로 한 번
입력 하나, 은닉 유닛 하나, 출력 하나(편향 없음). $x=2$, $w^{(1)}=0.5$, $w^{(2)}=2$, $t=1$.
---
순전파: $a=1$, $z=\tanh1\approx0.7616$, $y=2z\approx1.5232$.
역전파: $\delta_k=y-t\approx0.5232$, $\delta_j=(1-z^2)\,w^{(2)}\delta_k\approx0.4200\times2\times0.5232\approx0.4395$.
기울기: $\partial E/\partial w^{(2)}=\delta_kz\approx0.3985$, $\partial E/\partial w^{(1)}=\delta_jx\approx0.8789$.
:::

**수치 미분(8.1.4).** 역전파의 장점은 **효율**입니다. 오차 한 번 평가가 $O(W)$($W$: 가중치·편향 수)이고, 역전파도 전체 기울기를 $O(W)$에 구합니다. 반면 유한 차분
$$\frac{\partial E_n}{\partial w_{ji}}=\frac{E_n(w_{ji}+\epsilon)-E_n(w_{ji})}{\epsilon}+O(\epsilon)$$
$$\frac{\partial E_n}{\partial w_{ji}}=\frac{E_n(w_{ji}+\epsilon)-E_n(w_{ji}-\epsilon)}{2\epsilon}+O(\epsilon^2)$$
은 가중치 $W$개를 하나씩 흔들어야 하므로 $O(W^2)$입니다. 중앙 차분은 $O(\epsilon)$ 항이 상쇄되어 더 정확하지만 계산은 약 두 배입니다. $\epsilon$을 너무 줄이면 반올림 오차가 커집니다. 실무에서는 역전파·자동미분 코드를 **중앙 차분으로 검증**(gradient check)하는 데 씁니다.
:::fig numdiff
:::
` },
      { k: '8.1d', label: '8.1.5–8.1.6', p: '240', src: '슬라이드 8–9', title: '야코비안과 헤시안', body: R`
역전파는 오차의 기울기 말고 다른 도함수에도 쓸 수 있습니다.

:::key 야코비안 행렬
망 출력의 입력에 대한 야코비안:
$$J_{ki}=\frac{\partial y_k}{\partial x_i}=\sum_j\frac{\partial y_k}{\partial a_j}\frac{\partial a_j}{\partial x_i}=\sum_jw_{ji}\frac{\partial y_k}{\partial a_j}$$
$$\frac{\partial y_k}{\partial a_j}=\sum_l\frac{\partial y_k}{\partial a_l}\frac{\partial a_l}{\partial a_j}=h'(a_j)\sum_lw_{lj}\frac{\partial y_k}{\partial a_l}$$
출력층에서 시작하는 값 ($\delta_{kl}$: 크로네커 델타)
| 출력 활성화 | $\partial y_k/\partial a_l$ |
|---|---|
| 선형 | $\delta_{kl}$ |
| 로지스틱 시그모이드 | $\delta_{kl}\,\sigma'(a_l)$ |
| 소프트맥스 | $\delta_{kl}y_k-y_ky_l$ |
:::

야코비안은 입력의 작은 변화가 출력에 주는 영향($\Delta y_k\simeq\sum_iJ_{ki}\Delta x_i$)을 나타냅니다. 오차 역전파와 똑같은 재귀지만 출력 $k$마다 한 번씩 거꾸로 전달합니다. 벡터 입출력의 야코비안 연쇄법칙은 심층 신경망 과목에 있습니다[[@dnn:ch09:9.5|야코비안의 곱으로 쓰는 연쇄법칙.]].

**헤시안** $H_{ij}=\partial^2E/\partial w_i\partial w_j$는 오차 곡면의 **국소 곡률**을 나타내며 기울기보다 많은 정보를 줍니다.[[@base:ch04:4.3|헤시안과 2차 테일러 전개.]] 2차 최적화, 베이지안 신경망, 가중치 정밀도 축소(양자화) 등에 쓰이지만 $W\times W$ 행렬이라 큰 망에서는 계산·저장이 매우 비쌉니다(평가 $O(W^2)$, 역행렬 $O(W^3)$).

:::key 헤시안의 외적 근사
출력 하나의 제곱오차 $E=\frac12\sum_n(y_n-t_n)^2$에서 ($\nabla$는 $\mathbf w$에 대한 기울기)
$$\mathbf H=\nabla\nabla E=\sum_{n=1}^N\nabla y_n(\nabla y_n)^T+\sum_{n=1}^N(y_n-t_n)\nabla\nabla y_n$$
잘 학습되어 잔차 $y_n-t_n$이 작으면 둘째 항을 무시해 **Levenberg–Marquardt(외적) 근사**
$$\mathbf H\simeq\sum_{n=1}^N\nabla a_n\nabla a_n^T\qquad(\text{선형 출력이면 }y_n=a_n)$$
:::

외적 근사는 1차 도함수만 필요하므로 역전파로 $O(W)$에 $\nabla a_n$을 구한 뒤 $O(W^2)$ 곱셈으로 행렬을 만듭니다. 항상 양의 준정부호라는 장점이 있지만, 잘 학습된 망에서만 타당합니다. 로지스틱 시그모이드 출력 + 교차엔트로피에서는 $\mathbf H\simeq\sum_ny_n(1-y_n)\nabla a_n\nabla a_n^T$입니다.
` },
      { k: '8.2', label: '8.2', p: '244', src: '슬라이드 2, 교재 보충', title: '자동 미분', body: R`
기울기를 구하는 네 가지 방법:
1. **손으로 역전파 식 유도 후 구현** — 정확하고 빠르지만 유도·코딩에 시간이 들고 오류가 나기 쉬우며, 모델을 바꿀 때마다 순전파·역전파 코드를 함께 고쳐야 합니다.
2. **수치 미분** — 순전파 코드만 있으면 되지만 $O(W^2)$로 확장성이 나쁩니다. 디버깅용.
3. **기호 미분** — 컴퓨터 대수로 도함수 식을 만듭니다. 정확하지만 식이 기하급수적으로 길어지는 **표현식 팽창**(expression swell)과, 반복문·조건문 같은 제어 흐름을 다루지 못하는 문제가 있습니다.
4. **자동 미분**(autodiff) — 순전파 **코드**로부터 기울기를 계산하는 코드를 자동 생성합니다. 기계 정밀도로 정확하고, 중간 변수를 재사용해 중복 계산이 없으며, 분기·반복·재귀도 다룹니다.

:::key 전진 모드와 후진 모드 자동 미분
**전진 모드**: 각 중간(primal) 변수 $v_i$에 접선(tangent) 변수 $\dot v_i=\partial v_i/\partial x$를 붙여 순전파와 함께 $(v_i,\dot v_i)$를 계산. 입력 하나당 한 번의 패스 → $K\times D$ 야코비안에 $D$번.
**후진 모드**: 수반(adjoint) 변수 $\bar v_i=\partial f/\partial v_i$를 출력에서 거꾸로
$$\bar v_i=\sum_{j\in\mathrm{ch}(i)}\bar v_j\frac{\partial v_j}{\partial v_i}$$
($\mathrm{ch}(i)$: 노드 $i$의 자식). 출력 하나당 한 번의 패스 → 오차(스칼라)의 모든 파라미터 기울기를 **한 번에**. 역전파의 일반화입니다.
:::

- 신경망 학습은 출력이 스칼라 하나(오차)이고 입력(파라미터)이 수백만 개이므로 **후진 모드**가 압도적으로 효율적입니다.
- 후진 모드는 역방향 계산에 필요한 모든 중간 값을 저장해야 하므로 **메모리**를 더 씁니다. 전진 모드는 쓰고 나면 버릴 수 있어 구현이 쉽습니다.
- 두 모드 모두 한 패스의 비용은 함수 평가의 최대 6배, 실제로는 2–3배 정도입니다.

:::fig autodiff
:::

:::ex 교재 예제 $f(x_1,x_2)=x_1x_2+\exp(x_1x_2)-\sin x_2$
중간 변수: $v_1=x_1$, $v_2=x_2$, $v_3=v_1v_2$, $v_4=\sin v_2$, $v_5=\exp v_3$, $v_6=v_3-v_4$, $v_7=v_5+v_6=f$.
---
후진 모드: $\bar v_7=1$, $\bar v_6=\bar v_7=1$, $\bar v_5=\bar v_7=1$, $\bar v_4=-\bar v_6=-1$, $\bar v_3=\bar v_5v_5+\bar v_6=e^{x_1x_2}+1$, $\bar v_2=\bar v_3v_1+\bar v_4\cos v_2=x_1(1+e^{x_1x_2})-\cos x_2$, $\bar v_1=\bar v_3v_2=x_2(1+e^{x_1x_2})$. 한 번의 역방향 패스로 두 편미분을 모두 얻습니다. (교재 (8.75)의 인쇄는 $\bar v_2$의 첫 항이 흐려져 있는데, $\bar v_3v_1$이 맞습니다.)
:::
` },
    ],
    problems: [
      { sec: '8.1', type: 'num', lv: 1, q: R`단층 선형 모델 $y=w_1x_1+w_2x_2$, $E=\frac12(y-t)^2$에서 $x=(2,-1)$, $w=(1,1)$, $t=0$일 때 $\partial E/\partial w_2$는?`, ans: '-1', ansTex: R`-1`,
        sol: R`$y=2-1=1$, 오차 신호 $y-t=1$, $\partial E/\partial w_2=1\cdot x_2=-1$.` },
      { sec: '8.1b', type: 'mc', lv: 1, q: R`역전파에서 $\delta_j$의 정의는?`,
        choices: [R`$\partial E_n/\partial w_{ji}$`, R`$\partial E_n/\partial a_j$`, R`$\partial E_n/\partial z_j$`, R`$y_j-t_j$ (모든 유닛)`], ans: 1,
        sol: R`사전활성에 대한 오차의 미분. 출력 유닛(정준 연결)에서는 $y_k-t_k$가 됩니다.` },
      { sec: '8.1b', type: 'num', lv: 2, q: R`은닉 유닛 $j$가 ReLU이고 $a_j=0.7$, 다음 층 두 유닛으로 $w_{1j}=2$, $w_{2j}=-1$로 연결되며 $\delta_1=0.3$, $\delta_2=0.5$이다. $\delta_j$는?`, ans: '0.1', ansTex: R`0.1`,
        sol: R`$h'(0.7)=1$, $\delta_j=1\cdot(2\cdot0.3-1\cdot0.5)=0.1$.` },
      { sec: '8.1b', type: 'num', lv: 2, q: R`위 문제에서 $a_j=-0.7$이면 $\delta_j$는?`, ans: '0', ansTex: R`0`,
        sol: R`ReLU의 기울기가 0이므로 $\delta_j=0$ — 이 유닛으로 들어오는 가중치는 이 예제에서 갱신되지 않습니다.` },
      { sec: '8.1b', type: 'mc', lv: 2, q: R`$\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$에서 합이 도는 범위는?`,
        choices: [R`유닛 $j$로 연결을 보내는 모든 유닛`, R`유닛 $j$가 연결을 보내는 모든 유닛`, R`같은 층의 모든 유닛`, R`모든 출력 유닛만`], ans: 1,
        sol: R`$a_j$의 변화는 $z_j$를 받는 다음 유닛들의 $a_k$를 통해서만 오차에 전달됩니다.` },
      { sec: '8.1c', type: 'num', lv: 2, q: R`본문 예제($x=2$, $w^{(1)}=0.5$, $w^{(2)}=2$, $t=1$, tanh 은닉·선형 출력)에서 $\partial E/\partial w^{(1)}$은? (소수 넷째 자리)`, ans: '0.8789', ansTex: R`\approx0.8789`,
        sol: R`$z=\tanh1$, $\delta_k=2z-1$, $\delta_j=(1-z^2)\cdot2\cdot\delta_k\approx0.43945$, $\partial E/\partial w^{(1)}=\delta_j\cdot2\approx0.8789$.` },
      { sec: '8.1c', type: 'num', lv: 1, q: R`tanh 은닉 유닛의 출력이 $z_j=0.6$이면 $h'(a_j)$는?`, ans: '0.64', ansTex: R`0.64`,
        sol: R`$1-z_j^2=1-0.36$.` },
      { sec: '8.1c', type: 'mc', lv: 2, q: R`중앙 차분이 전방 유한 차분보다 정확한 이유는?`,
        choices: [R`$\epsilon$을 더 작게 잡을 수 있어서`, R`테일러 전개에서 $O(\epsilon)$ 항이 상쇄되어 오차가 $O(\epsilon^2)$이라서`, R`반올림 오차가 없어서`, R`계산량이 절반이라서`], ans: 1,
        sol: R`$E(w\pm\epsilon)=E\pm\epsilon E'+\frac{\epsilon^2}2E''\pm\cdots$의 차에서 $E''$ 항이 사라집니다. 계산량은 약 두 배.` },
      { sec: '8.1c', type: 'mc', lv: 1, q: R`가중치가 $W$개인 망에서 수치 미분으로 전체 기울기를 구하는 비용은?`,
        choices: [R`$O(W)$`, R`$O(W\log W)$`, R`$O(W^2)$`, R`$O(W^3)$`], ans: 2,
        sol: R`순전파 $O(W)$를 가중치 $W$개마다 반복합니다. 역전파는 $O(W)$.` },
      { sec: '8.1d', type: 'num', lv: 2, q: R`소프트맥스 출력의 사전활성이 $a=(1,0,-1)$일 때 $\partial y_1/\partial a_1$은? (소수 넷째 자리)`, ans: '0.2227', ansTex: R`y_1(1-y_1)\approx0.2227`,
        sol: R`$y_1=e/(e+1+e^{-1})\approx0.6652$, $\partial y_1/\partial a_1=y_1-y_1^2\approx0.2227$.` },
      { sec: '8.1d', type: 'num', lv: 2, q: R`같은 경우 $\partial y_1/\partial a_2$는? (소수 넷째 자리)`, ans: '-0.1628', ansTex: R`-y_1y_2\approx-0.1628`,
        sol: R`$y_2=1/(e+1+e^{-1})\approx0.2447$, $-y_1y_2\approx-0.1628$.` },
      { sec: '8.1d', type: 'mc', lv: 2, q: R`Levenberg–Marquardt 근사에서 무시하는 항과 그 근거는?`,
        choices: [R`$\sum\nabla y_n\nabla y_n^T$ — 항상 작아서`, R`$\sum(y_n-t_n)\nabla\nabla y_n$ — 잘 학습되면 잔차가 작아서`, R`대각 원소 — 계산이 비싸서`, R`비대각 원소 — 대칭이라서`], ans: 1,
        sol: R`잔차가 작거나 2차 도함수와 무상관이면 평균적으로 0에 가깝습니다.` },
      { sec: '8.1d', type: 'mc', lv: 1, q: R`헤시안의 쓰임으로 강의에서 든 것이 아닌 것은?`,
        choices: [R`2차 최적화 방법`, R`베이지안 신경망`, R`가중치 정밀도 축소`, R`미니배치 섞기`], ans: 3,
        sol: R`슬라이드: second-order optimization, Bayesian neural networks, weight-precision reduction.` },
      { sec: '8.2', type: 'mc', lv: 1, q: R`신경망 학습(스칼라 오차, 파라미터 수백만 개)에 더 효율적인 자동 미분 방식은?`,
        choices: [R`전진 모드`, R`후진 모드`, R`기호 미분`, R`수치 미분`], ans: 1,
        sol: R`후진 모드는 출력 하나당 한 번의 역방향 패스로 모든 입력(파라미터)에 대한 미분을 얻습니다.` },
      { sec: '8.2', type: 'num', lv: 2, q: R`$f(x_1,x_2)=x_1x_2+\exp(x_1x_2)-\sin x_2$에서 $(x_1,x_2)=(2,0)$일 때 $\partial f/\partial x_2$는?`, ans: '3', ansTex: R`3`,
        sol: R`$\bar v_2=x_1(1+e^{x_1x_2})-\cos x_2=2\cdot2-1=3$.` },
      { sec: '8.2', type: 'mc', lv: 2, q: R`기호 미분의 단점이 아닌 것은?`,
        choices: [R`표현식 팽창`, R`반복문·조건문을 다루지 못함`, R`중복 계산`, R`기계 정밀도보다 부정확함`], ans: 3,
        sol: R`기호 미분은 정확한 식을 주므로 정밀도 문제는 없습니다.` },
      { sec: '8.1b', type: 'open', lv: 2, q: R`$a_j=\sum_iw_{ji}z_i$, $z_j=h(a_j)$, $\delta_j\equiv\partial E_n/\partial a_j$일 때 연쇄법칙으로 (i) $\partial E_n/\partial w_{ji}=\delta_jz_i$, (ii) $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$를 유도하세요.`, proof: true,
        sol: R`
(i) $E_n$은 $w_{ji}$에 합 $a_j$를 통해서만 의존하므로 $\frac{\partial E_n}{\partial w_{ji}}=\frac{\partial E_n}{\partial a_j}\frac{\partial a_j}{\partial w_{ji}}=\delta_jz_i$ ($\partial a_j/\partial w_{ji}=z_i$).
(ii) $a_j$가 바뀌면 $z_j$가 바뀌고, $z_j$는 $j$가 연결을 보내는 유닛 $k$들의 $a_k=\sum_{j'}w_{kj'}z_{j'}$에 들어갑니다. 다변수 연쇄법칙으로 $\delta_j=\sum_k\frac{\partial E_n}{\partial a_k}\frac{\partial a_k}{\partial a_j}$이고 $\frac{\partial a_k}{\partial a_j}=w_{kj}h'(a_j)$이므로 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$.`,
        rubric: R`
- (i) $a_j$ 경유 연쇄법칙
- (ii) 다음 층 $a_k$들에 대한 합
- $\partial a_k/\partial a_j=w_{kj}h'(a_j)$` },
      { sec: '8.1d', type: 'open', lv: 2, q: R`$E=\frac12\sum_n(y_n-t_n)^2$의 헤시안이 $\sum_n\nabla y_n(\nabla y_n)^T+\sum_n(y_n-t_n)\nabla\nabla y_n$임을 보이고, 외적 근사가 양의 준정부호임을 보이세요.`, proof: true,
        sol: R`
$\nabla E=\sum_n(y_n-t_n)\nabla y_n$. 다시 미분(곱의 미분): $\nabla\nabla E=\sum_n\big[\nabla y_n(\nabla y_n)^T+(y_n-t_n)\nabla\nabla y_n\big]$.
외적 근사 $\mathbf H_{LM}=\sum_n\mathbf g_n\mathbf g_n^T$ ($\mathbf g_n=\nabla a_n$)에 대해 임의의 $\mathbf v$로 $\mathbf v^T\mathbf H_{LM}\mathbf v=\sum_n(\mathbf g_n^T\mathbf v)^2\ge0$. 따라서 양의 준정부호입니다.`,
        rubric: R`
- 1차 기울기
- 곱의 미분으로 두 항
- $\mathbf v^T\mathbf H\mathbf v=\sum(\cdot)^2\ge0$` },
    ],
  });
})();
