/* 20 LSTM과 RNN의 응용 — 9주차 수요일 슬라이드 18–22(필기 포함)와 9주차 수요일(2) 슬라이드 23–34 (Recurrent Neural Networks and Applications) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 20, part: 'G', title: 'LSTM과 RNN의 응용', en: 'LSTM & Applications of RNNs', ref: 'W9 수 · 슬라이드 18–34', plot: 'lstm',
    fig: R`k걸음 뒤에 남는 기울기의 배율: 망각 게이트가 f ≈ 0.98인 LSTM 셀 경로 ∏f(굵은 선)는 높게 남고, 바닐라 RNN 경로 ∏(1−h²)w(가는 선)는 빠르게 0으로 떨어진다`,
    tagline: R`LSTM은 기억을 셀 상태 $c_t$라는 벨트에 따로 싣고 입력·망각·출력 게이트로 쓰고, 지우고, 내보냅니다. 셀 경로의 기울기가 $\diag(f_t)$라서 먼 과거까지 내려가고, 이 LSTM으로 다음 단어를 예측하는 언어 모델, 번역기, 이미지 캡셔닝을 만듭니다.`,
    summary: R`19단원의 바닐라 RNN은 기울기가 걸음마다 $W_h$와 $\tanh'$을 곱해 사라지기 쉬웠습니다. **LSTM**은 은닉 상태 $h_t$ 옆에 셀 상태 $c_t$를 두고, 입력 게이트 $i$·망각 게이트 $f$·출력 게이트 $o$와 후보 $g$로 $c_t=f\odot c_{t-1}+i\odot g$, $h_t=o\odot\tanh(c_t)$를 계산합니다. 필기의 Rmk대로 셀 경로의 야코비안은 $\diag(f_t)$라서 $f_t\approx1$이면 기울기가 끊기지 않고 흐릅니다(전체 야코비안의 나머지 항과 이 논증의 한계도 봅니다). 응용으로는 문장을 원-핫 토큰의 열로 보고 임베딩 → LSTM → 분류층으로 **다음 토큰을 예측하는 언어 모델**을 만들어, 학습(칸마다 교차 엔트로피, 교사 강요)과 추론(탐욕 대 샘플링)을 구분합니다. 마지막으로 인코더-디코더 **기계 번역**과 CNN + RNN **이미지 캡셔닝**을 봅니다.`,
    goals: [
      R`LSTM의 네 게이트 $i,f,o,g$의 식과 역할, 셀 상태와 은닉 상태의 갱신식을 쓰고, 큰 행렬 $W$ 표기와 게이트별 표기가 같은 식임을 보일 수 있다`,
      R`LSTM 한 걸음을 손으로 계산하고, 매개변수 수 $4h(h+d)+4h$를 셀 수 있다`,
      R`셀 경로의 야코비안 $\diag(f_t)$와 RNN의 $\diag(1-h_t^2)W_h$를 유도해, LSTM이 긴 의존성을 쉽게 배우는 이유와 그 한계를 설명할 수 있다`,
      R`원-핫 부호화, 임베딩, 분류층으로 이루어진 RNN 언어 모델의 식을 쓰고, 문장 생성이 다음 토큰 예측의 되풀이임을 설명할 수 있다`,
      R`언어 모델의 학습 손실(칸마다 교차 엔트로피)과 그 기울기 $\softmax(\hat{\mathbf x}_t)-\mathbf x_t$를 유도하고, 교사 강요를 설명할 수 있다`,
      R`탐욕 디코딩과 확률적 샘플링을 비교하고, 탐욕이 가장 그럴듯한 문장을 보장하지 않는 예를 들 수 있다`,
      R`인코더-디코더 기계 번역과 CNN + RNN 이미지 캡셔닝의 구조를 설명할 수 있다`,
    ],
    secTitles: { '20.1': 'LSTM의 게이트', '20.2': '기울기 흐름', '20.3': '언어 모델', '20.4': '학습과 추론', '20.5': '번역·캡셔닝' },
    sections: [
      { k: '20.1', src: 'W9 수 · 슬라이드 18–21 필기', title: 'LSTM의 게이트와 셀 상태', body: R`
:::idea 쉽게 말하면
바닐라 RNN은 기억(은닉 상태)을 매 걸음 통째로 $\tanh(W\,\cdot)$에 통과시켜 다시 씁니다. LSTM은 기억을 **셀 상태** $c_t$라는 별도의 벨트에 싣고, 세 개의 밸브(게이트)로 ‘얼마나 지울지($f$)’, ‘새 내용을 얼마나 쓸지($i$)’, ‘얼마나 내보낼지($o$)’를 $0$과 $1$ 사이의 값으로 조절합니다. 벨트 위의 기억은 성분별 곱과 덧셈만 거치므로 오래 살아남습니다.
:::

**바닐라 RNN과 LSTM** (슬라이드 18). 바닐라 RNN은 한 걸음에 은닉 상태 하나를
$$h_t=\tanh\Big(W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}\Big)$$
로 갱신합니다[[ch19:19.2|바닐라 RNN의 점화식과 매개변수 공유.]]. 이 갱신을 여러 번 거치면 기울기가 걸음마다 $W$와 $\tanh'$을 곱해 사라지거나 폭발합니다[[ch19:19.6|기울기 폭발·소실과 잘라내기.]]. **LSTM**(Long Short-Term Memory, Hochreiter & Schmidhuber 1997)은 상태를 둘로 나눕니다. **은닉 상태** $h_t$는 출력과 다음 걸음으로 내보내는 상태이고, **셀 상태** $c_t$는 필기의 표현으로 ‘long memory’입니다.

:::key LSTM의 네 게이트와 셀 상태
$$\begin{pmatrix}i\\f\\o\\g\end{pmatrix}=\begin{pmatrix}\sigma\\\sigma\\\sigma\\\tanh\end{pmatrix}W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix},\qquad W\in\mathbb R^{4h\times(h+d)}$$
$$c_t=f\odot c_{t-1}+i\odot g,\qquad h_t=o\odot\tanh(c_t)$$
$h_t,c_t\in\mathbb R^h$, $x_t\in\mathbb R^d$. 게이트 $i,f,o\in(0,1)^h$, 후보 $g\in(-1,1)^h$이고 $\odot$는 성분별 곱이다. 편향을 쓰면 $W(\cdot)$ 대신 $W(\cdot)+b$, $b\in\mathbb R^{4h}$.
:::

:::hand 수업 필기 — 게이트를 하나씩 쓰기
RNN: $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$. LSTM: $h_t$는 은닉 상태(hidden state), $c_t$는 셀 상태(cell state, long memory).
- **입력 게이트** $i_t=\sigma(W_ix_t+U_ih_{t-1}+b_i)$ — 새 정보 $g_t$를 셀에 얼마나 쓸까.
- **망각 게이트** $f_t=\sigma(W_fx_t+U_fh_{t-1}+b_f)$ — $c_{t-1}$의 정보를 얼마나 가져갈까.
- **출력 게이트** $o_t=\sigma(W_ox_t+U_oh_{t-1}+b_o)$ — 셀을 얼마나 $h_t$에 쓸까.
- **후보** $g_t=\tanh(W_gx_t+U_gh_{t-1}+b_g)$ — 현재 입력에서 새로 쓸 내용.
$$c_t=f_t\odot c_{t-1}+i_t\odot g_t,\qquad h_t=o_t\odot\tanh(c_t)$$
$\odot$: 성분별 곱(elementwise multiplication).
:::

**두 표기는 같은 식입니다** (슬라이드 18–19, 21). 큰 행렬 $W$를 게이트마다 $h$줄씩 네 묶음으로 자르고, 각 묶음을 다시 $h_{t-1}$에 곱하는 열과 $x_t$에 곱하는 열로 나누면
$$W=\begin{pmatrix}U_i&W_i\\U_f&W_f\\U_o&W_o\\U_g&W_g\end{pmatrix},\qquad W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}=\begin{pmatrix}U_ih_{t-1}+W_ix_t\\U_fh_{t-1}+W_fx_t\\U_oh_{t-1}+W_ox_t\\U_gh_{t-1}+W_gx_t\end{pmatrix}$$
입니다. 그래서 구현에서는 행렬곱 한 번으로 $4h$개의 전활성값을 얻은 뒤 위에서부터 $h$개씩 잘라 $\sigma,\sigma,\sigma,\tanh$를 적용합니다(슬라이드 19의 그림). 슬라이드 21의 $f_t=\sigma(W_f\cdot[h_{t-1},x_t]+b_f)$도 같은 식으로, $[h_{t-1},x_t]$는 두 벡터를 이어 붙인 것이고 후보를 $\tilde C_t$로 씁니다.

:::fig lstmstack
:::

| 기호 | 이름 | 활성화 | 값의 범위 | 하는 일 (슬라이드 19) |
|---|---|---|---|---|
| $i$ | 입력 게이트 | $\sigma$ | $(0,1)$ | 셀에 쓸지 |
| $f$ | 망각 게이트 | $\sigma$ | $(0,1)$ | 셀을 지울지 |
| $o$ | 출력 게이트 | $\sigma$ | $(0,1)$ | 셀을 얼마나 드러낼지 |
| $g$ | 후보 | $\tanh$ | $(-1,1)$ | 셀에 무엇을 얼마나 쓸지 |

:::fig lstmcell
:::

:::warn 슬라이드 19의 크기와 ‘gate gate’
슬라이드 19는 $W$를 $4h\times2h$로 적었는데, 이는 입력과 은닉 상태의 크기가 같다($d=h$)고 둔 것입니다. 일반적으로 $x_t\in\mathbb R^d$이면 $W\in\mathbb R^{4h\times(h+d)}$입니다. 또 슬라이드는 $g$를 “Gate gate (?)”라 불렀지만, $g$는 $0$과 $1$ 사이의 밸브가 아니라 $\tanh$로 만든 $(-1,1)$ 값의 **후보 내용**(슬라이드 21의 $\tilde C_t$)입니다. 엄밀한 뜻의 게이트는 $i,f,o$ 셋입니다.
:::

**매개변수 수.** 네 묶음이 각각 $h\times(h+d)$개의 가중치와 $h$개의 편향을 가집니다.

:::key LSTM의 매개변수 수
$$4h(h+d)+4h$$
바닐라 RNN의 $h(h+d)+h$의 정확히 4배이고, $d=h$이면 $8h^2+4h$이다.
:::

:::ex 예제 1 — LSTM 한 걸음
스칼라 LSTM($h=d=1$)에서 $c_{t-1}=0.4$이고, 네 전활성값 $W(h_{t-1};x_t)+b$가 $(i,f,o,g)$ 순서로 $(0,\ \ln3,\ 0,\ \ln2)$이다. $c_t$와 $h_t$는?
---
$i=\sigma(0)=\frac12$, $f=\sigma(\ln3)=\frac1{1+1/3}=\frac34$, $o=\frac12$, $g=\tanh(\ln2)=\frac{2-1/2}{2+1/2}=\frac35$.
$c_t=\frac34\cdot0.4+\frac12\cdot\frac35=0.3+0.3=0.6$, $h_t=\frac12\tanh(0.6)\approx0.2685$. 이전 기억의 $75\%$를 남기고 후보의 절반을 더했습니다.
:::

:::ex 예제 2 — 매개변수 세기
단어 임베딩($d=300$)을 받는 은닉 크기 $h=512$의 LSTM과 바닐라 RNN의 매개변수 수는?
---
LSTM: $4\cdot512\cdot(512+300)+4\cdot512=1{,}662{,}976+2{,}048=1{,}665{,}024$. 바닐라 RNN: $512\cdot812+512=416{,}256$. 정확히 4배입니다.
:::

### 더 깊이

**왜 게이트는 $\sigma$이고 후보는 $\tanh$인가.** $\sigma$의 값은 $(0,1)$이라 ‘얼마나 통과시킬지’를 나타내는 부드러운 스위치가 되고, $0/1$ 스위치와 달리 미분할 수 있어 역전파로 학습됩니다. 후보 $g$와 출력의 $\tanh(c_t)$는 $(-1,1)$ 값이라 셀에 더하는 내용과 **빼는** 내용을 모두 나타내면서 크기를 제한합니다.

**망각 게이트의 역사와 초기화.** 1997년의 원래 LSTM에는 망각 게이트가 없었고($f\equiv1$), Gers 등(2000)이 셀을 지우는 $f$를 더했습니다. 실무에서는 학습 초기에 $f\approx1$이 되도록 $b_f$를 양수(예: $1$)로 초기화하는 일이 흔한데, 20.2절의 기울기 지름길을 처음부터 열어 두려는 것입니다.
` },
      { k: '20.2', src: 'W9 수 · 슬라이드 22 필기', title: 'LSTM의 기울기 흐름', body: R`
:::idea 쉽게 말하면
RNN에서 기울기가 과거로 내려갈 때는 걸음마다 $W_h$를 곱하고 $\tanh'$로 깎이는 좁은 관문을 지나야 했습니다. LSTM의 셀 상태에는 걸음마다 망각 게이트 $f_t$만 곱해지는 **지름길**이 있습니다. $f_t\approx1$이면 기울기가 거의 줄지 않고 먼 과거까지 내려갑니다(슬라이드 22의 “Uninterrupted gradient flow!”).
:::

:::hand 수업 필기 — Rmk: 셀 상태의 기울기
$c_t=f_t\odot c_{t-1}+i_t\odot g_t$이므로
$$\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)$$
이고, $f_t\approx1$이면 이 야코비안은 거의 항등행렬입니다. 비교: RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$에서는
$$\frac{\partial h_t}{\partial h_{t-1}}=(1-h_t^2)\,W_h.$$
:::

**필기의 두 식 채우기.** 성분으로 쓰면 $c_{t,j}=f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$이고, 게이트를 고정하면 $c_{t,j}$는 $c_{t-1,j}$에만 의존하므로 $\partial c_{t,j}/\partial c_{t-1,k}=f_{t,j}\delta_{jk}$, 곧 야코비안은 대각행렬 $\diag(f_t)$입니다. RNN은 $a_t=W_hh_{t-1}+W_xx_t+b$, $h_t=\tanh(a_t)$로 두면 연쇄법칙과 $\tanh'=1-\tanh^2$에서
$$\frac{\partial h_t}{\partial h_{t-1}}=\diag\big(\tanh'(a_t)\big)\frac{\partial a_t}{\partial h_{t-1}}=\diag(1-h_t^2)\,W_h$$
입니다. 필기의 $(1-h_t^2)W_h$는 이 대각행렬을 줄여 쓴 것입니다[[ch09:9.5|벡터 입출력의 야코비안과 연쇄법칙.]].

:::key 셀 상태의 기울기 경로
셀 경로만 따라가면(게이트를 고정하고)
$$\frac{\partial c_t}{\partial c_{t-k}}=\diag(f_t)\diag(f_{t-1})\cdots\diag(f_{t-k+1})=\diag\Big(\prod_{s=t-k+1}^{t}f_s\Big),$$
바닐라 RNN은 $D_s=\diag(1-h_s^2)$로 두면
$$\frac{\partial h_t}{\partial h_{t-k}}=D_tW_h\,D_{t-1}W_h\cdots D_{t-k+1}W_h,\qquad\Big\lVert\frac{\partial h_t}{\partial h_{t-k}}\Big\rVert\le\lVert W_h\rVert^k.$$
:::

**무엇이 다른가.** RNN의 곱에는 같은 행렬 $W_h$가 $k$번 들어가고 $\lVert D_s\rVert\le1$이므로, $\lVert W_h\rVert<1$이면 기울기가 $\lVert W_h\rVert^k$ 이하로 지수적으로 줄고, $W_h$의 가장 큰 특잇값이 $1$보다 크면 폭발할 수도 있습니다. 셀 경로에는 행렬곱도 활성화의 미분도 없이 성분별로 $\prod_sf_s$만 남으므로, 망이 $f_s\approx1$을 배우면 기울기가 그대로 내려갑니다. 특히 $f=1$, $i=0$이면 $c_t=c_{t-1}$이라 셀의 정보가 무한히 보존됩니다(슬라이드 22). 반면 바닐라 RNN이 정보를 보존하려면 모든 입력에 대해 $\tanh(W_hh+W_xx+b)\approx h$가 되는 $W_h$를 배워야 하는데, 이는 훨씬 어렵습니다.

:::ex 예제 3 — 100걸음 뒤에 남는 기울기
망각 게이트가 줄곧 $f_s=0.98$인 셀 경로와, 한 걸음 인수의 크기가 $0.8$인 RNN 경로에서 100걸음 뒤 기울기의 배율은?
---
셀: $0.98^{100}\approx0.133$. RNN: $0.8^{100}\approx2.0\times10^{-10}$. 같은 100걸음이지만 셀 경로는 기울기의 약 $13\%$를 전하고, RNN 경로는 사실상 $0$입니다(단원 표지의 굵은 곡선과 가는 곡선).
:::

**잔차 연결과 같은 생각.** $f_t=1$이면 $c_t=c_{t-1}+i_t\odot g_t$로, 셀은 시간 방향의 **잔차 연결**입니다. ResNet 블록 $x+F(x)$의 야코비안 $I+\partial F/\partial x$가 깊이 방향으로 기울기의 지름길을 만든 것처럼[[ch16:16.6|ResNet: 깊이의 문제와 잔차 연결.]], 셀의 덧셈은 시간 방향의 지름길을 만듭니다. 망각 게이트는 이 지름길을 언제 끊을지(언제 지울지)를 망이 스스로 배우게 하는 밸브입니다.

:::warn 보장은 아니다 — 그리고 필기의 diag(f_t)는 셀 경로의 미분
슬라이드 22의 말대로 LSTM이 기울기 소실·폭발이 없음을 **보장하지는 않습니다**. 망이 $f_s$를 작게 배우면 그 경로의 기울기는 여전히 사라지고(그것이 곧 ‘잊기’입니다), 다른 경로로는 폭발할 수도 있어 기울기 잘라내기를 함께 씁니다[[ch19:19.6|기울기 잘라내기.]]. 또 필기의 $\diag(f_t)$는 게이트를 고정한 **셀 경로**의 미분입니다. 게이트와 후보는 $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$을 통해 $c_{t-1}$에도 의존하므로 전체 야코비안에는 항이 더 있습니다(아래 ‘더 깊이’).
:::

### 더 깊이

:::key 셀 상태의 전체 야코비안
$h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$이고 $f_t,i_t,g_t$가 $h_{t-1}$의 함수이면
$$\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+\Big[\diag(c_{t-1})\frac{\partial f_t}{\partial h_{t-1}}+\diag(g_t)\frac{\partial i_t}{\partial h_{t-1}}+\diag(i_t)\frac{\partial g_t}{\partial h_{t-1}}\Big]\diag\big(o_{t-1}\odot(1-\tanh^2(c_{t-1}))\big)$$
$$\frac{\partial f_t}{\partial h_{t-1}}=\diag\big(f_t\odot(1-f_t)\big)U_f,\quad\frac{\partial i_t}{\partial h_{t-1}}=\diag\big(i_t\odot(1-i_t)\big)U_i,\quad\frac{\partial g_t}{\partial h_{t-1}}=\diag(1-g_t^2)\,U_g$$
:::

첫 항 $\diag(f_t)$는 필기의 셀 경로이고, 대괄호 안의 항들은 $h_{t-1}$을 거쳐 게이트로 들어가는 경로입니다. 이 경로들은 $U_\bullet$를 곱하고 $\sigma'=\sigma(1-\sigma)\le\frac14$, $\tanh'\le1$로 깎이므로 바닐라 RNN의 경로와 같은 모양입니다. 여러 걸음의 곱 $\prod_s\big(\diag(f_s)+E_s\big)$를 전개하면 모든 걸음에서 $\diag(f_s)$를 고른 항 $\diag\big(\prod_sf_s\big)$가 따로 한 항으로 남습니다. 잔차망의 곱 $\prod_k(I+A_k)$에 $I$ 항이 남는 것과 같은 이유로, 나머지 항이 이를 정확히 상쇄하지 않는 한 $f\approx1$인 성분의 기울기는 살아남습니다. 필기와 슬라이드가 셀 경로만으로 논증하는 이유가 이것입니다.
` },
      { k: '20.3', src: 'W9 수 · 슬라이드 23–28', title: '언어 모델: 원-핫 부호화와 임베딩', body: R`
:::idea 쉽게 말하면
문장은 단어라는 기호의 열입니다. 기호마다 번호를 붙여 원-핫 벡터로 바꾸고(토큰화), 학습되는 행렬로 조밀한 벡터(임베딩)로 옮긴 뒤 LSTM에 한 칸씩 넣습니다. LSTM의 은닉 상태는 ‘지금까지 읽은 문장의 요약’이 되고, 그 위의 분류층이 **다음 단어**의 점수를 냅니다. 문장을 만드는 일은 다음 단어 맞히기를 되풀이하는 것입니다.
:::

**RNN의 응용** (슬라이드 23–24). 두 가지를 봅니다. (1) **언어 모델링**: 문장 생성, 기계 번역(“The agreement on the European Economic Area was signed in August 1992.” → 프랑스어), 텍스트 요약은 모두 문장을 받아 문장을 내는 함수 $f_\theta$입니다. (2) **이미지 캡셔닝**: 단순한 캡셔닝과 어텐션을 쓴 캡셔닝(20.5절).

| 과제 | 입력 | 출력 (슬라이드 24의 예) |
|---|---|---|
| 문장 생성 | 시작 기호 | I am very hungry at the end of every class |
| 기계 번역 | The agreement on the European Economic Area was signed in August 1992. | L'accord sur l'Espace économique européen a été signé en août 1992. |
| 텍스트 요약 | 긴 문서(Document) | 짧은 요약문(Summary) |

슬라이드는 이 셋에 “And so many more…”를 덧붙였습니다. 세 과제 모두 $f_\theta$ 하나가 토큰열을 받아 토큰열을 내는 틀입니다.

**수업 중의 곁가지** (슬라이드 23의 그림). 수업에서는 감염병의 SIRD 모형(감수성 S, 감염 I, 회복 R, 사망 D의 상미분방정식)에서 감염률 같은 계수($\alpha,\beta$; 필기의 ‘감염지수’)를 시간에 따라 변하는 값으로 보고, 이를 LSTM으로 추정해 ODE에 넣는 그림을 그렸습니다. 시계열 뒤에 숨은 매개변수를 RNN으로 읽어 내는 예로 보면 되고, 슬라이드의 본론은 아닙니다.

**문장은 이산 기호의 열** (슬라이드 25). 어휘(vocabulary)의 크기를 $n$이라 하고 각 기호(토큰)에 번호 $k\in\{1,\dots,n\}$를 붙이면, 토큰 $k$는 원-핫 벡터 $e_k\in\mathbb R^n$($k$번째 성분만 $1$)이 됩니다. 슬라이드의 예 “A Man is holding a bat”은 $n=8$짜리 원-핫 벡터 $\mathbf x_0,\dots,\mathbf x_5$의 열입니다.

| 토큰 | <SOS> | A | Man | is | holding | a | bat |
|---|---|---|---|---|---|---|---|
| 원-핫 ($n=8$) | 00100000 | 00001000 | 01000000 | 00000010 | 00000100 | 00001000 | 10000000 |

(<SOS>의 코드는 슬라이드 26에서, 나머지는 슬라이드 25에서 가져왔습니다.)

:::warn 슬라이드의 원-핫 코드
슬라이드 25에서 “A”와 “a”는 같은 코드 $[00001000]$이고, 슬라이드 28에서는 문장 끝 기호 <EOS>의 출력 코드도 $[00001000]$입니다. 대소문자를 구별하지 않는 어휘라면 “A”와 “a”가 같은 토큰인 것은 자연스럽지만, <EOS>는 반드시 자기만의 번호를 가져야 생성을 멈출 수 있습니다. 그림을 간단히 하려고 코드를 겹쳐 쓴 것으로 보면 됩니다.
:::

**RNN 언어 모델** (슬라이드 26–28). 층을 아래에서부터 쌓으면 원-핫 부호화 → 연속 단어 임베딩 → 순환 신경망(LSTM) → 연속 출력 임베딩 → 분류층입니다.

:::key RNN 언어 모델
$$\mathbf z_t=W_e\mathbf x_t+\mathbf b_e,\qquad\mathbf h_t=\mathrm{LSTM}(\mathbf z_t,\mathbf h_{t-1},\mathbf c_{t-1};\theta),\qquad\hat{\mathbf x}_{t+1}=W_d\mathbf h_t+\mathbf b_d$$
$\mathbf x_t\in\mathbb R^n$은 원-핫, $W_e\in\mathbb R^{d\times n}$, $\mathbf h_t\in\mathbb R^d$, $W_d\in\mathbb R^{n\times d}$. $\softmax(\hat{\mathbf x}_{t+1})$이 다음 토큰의 확률분포이다.
:::

:::fig lmstep
:::

**임베딩은 열 고르기입니다.** $\mathbf x_t=e_k$이면 $W_e\mathbf x_t$는 $W_e$의 $k$번째 열이므로, 임베딩층은 토큰마다 $d$차원 벡터 하나를 찾아 주는 표(lookup table)입니다. 원-핫 벡터는 $n$차원(보통 수만)이고 서로 다른 두 단어 사이의 거리가 모두 $\sqrt2$로 같지만, 학습된 임베딩은 $d$차원(수백)이고 비슷하게 쓰이는 단어끼리 가까워질 수 있습니다.

**문장 생성 = 다음 토큰 예측** (슬라이드 26–28). 시작 기호 <SOS>를 넣으면 첫 단어 “A”의 점수가 나와야 하고, “A”를 넣으면 “Man”, …, “bat”을 넣으면 <EOS>가 나와야 합니다. 이는 확률의 곱셈 규칙
$$P(x_1,\dots,x_T)=\prod_{t=1}^TP(x_t\mid x_0,\dots,x_{t-1})$$
의 각 인수를 하나의 망으로 모델링하는 것입니다. 은닉 상태 $\mathbf h_{t-1}$이 앞의 모든 토큰 $x_0,\dots,x_{t-1}$을 요약하고, $\softmax(\hat{\mathbf x}_t)$가 $P(x_t\mid x_{<t})$를 냅니다.

:::ex 예제 4 — 언어 모델의 매개변수
어휘 $n=10{,}000$, 임베딩과 은닉 크기 $d=256$인 언어 모델(임베딩 → LSTM 한 층 → 분류층)의 매개변수 수는?
---
임베딩 $W_e,\mathbf b_e$: $256\cdot10{,}000+256=2{,}560{,}256$. LSTM($h=d=256$): $4\cdot256\cdot512+4\cdot256=525{,}312$. 분류층 $W_d,\mathbf b_d$: $10{,}000\cdot256+10{,}000=2{,}570{,}000$. 합 $5{,}655{,}568$개 중 약 $91\%$가 어휘 크기에 비례하는 임베딩과 분류층에 있습니다. AlexNet의 매개변수가 완전연결층에 몰린 것과 비슷합니다[[ch16:16.2|AlexNet: 층별 크기와 매개변수.]].
:::

### 더 깊이

원-핫 벡터를 곧바로 LSTM에 넣어도 됩니다. 그러면 LSTM의 입력 가중치가 $4h\times n$이 되는데, 이를 (입력 가중치 $4h\times d$)·$W_e$로 인수분해한 것이 임베딩층입니다. $W_e$가 네 게이트에 공통인 $d$차원 표현을 먼저 만들어, $h=d$일 때 입력 쪽 가중치를 $4dn$에서 $dn+4d^2$로 줄입니다($n\gg d$). 또 분류층 $W_d$는 $n$개의 출력 임베딩을 행으로 가진 행렬로 볼 수 있어, $W_d=W_e^T$로 묶어 쓰는 경우(가중치 묶기)도 흔합니다.
` },
      { k: '20.4', src: 'W9 수 · 슬라이드 29–31', title: '언어 모델의 학습과 추론', body: R`
:::idea 쉽게 말하면
학습할 때는 정답 문장을 한 칸씩 밀어 넣고, 칸마다 ‘다음 단어 맞히기’라는 $n$개 클래스 분류 문제의 교차 엔트로피를 모두 더합니다. 생성할 때는 정답이 없으니, 모델이 고른 단어를 다음 칸의 입력으로 되먹이고 <EOS>가 나오면 멈춥니다.
:::

**학습** (슬라이드 29). 입력 열 <SOS>, A, Man, …, bat($\mathbf x_0,\dots,\mathbf x_6$)을 넣어 예측 $\hat{\mathbf x}_1,\dots,\hat{\mathbf x}_7$을 얻고, 각 칸의 정답 $\mathbf x_1,\dots,\mathbf x_7$(A, Man, …, bat, <EOS>)과 비교합니다.

:::key 언어 모델의 학습 손실
$$\mathcal L=\sum_{t=1}^T\mathcal L(\hat{\mathbf x}_t,\mathbf x_t)=-\sum_{t=1}^T\log\big[\softmax(\hat{\mathbf x}_t)\big]_{k_t},\qquad\frac{\partial\mathcal L}{\partial\hat{\mathbf x}_t}=\softmax(\hat{\mathbf x}_t)-\mathbf x_t$$
$k_t$는 $t$번째 정답 토큰의 번호($\mathbf x_t=e_{k_t}$)이다. 칸마다 단어 수준의 분류(교차 엔트로피)이다.
:::

슬라이드 29의 빨간 글씨대로 이것은 칸마다의 **단어 수준 분류**이고, 6단원 소프트맥스 회귀의 손실을 $T$번 더한 것입니다[[ch06:6.2|가능도와 교차 엔트로피.]]. 로짓에 대한 기울기 $\softmax(\hat{\mathbf x}_t)-\mathbf x_t$도 그대로입니다[[ch06:6.3|소프트맥스 교차 엔트로피의 기울기.]]. 이 기울기가 $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$를 거쳐 $\mathbf h_{t-1}$로 들어가고, 19단원의 시간 역전파로 모든 걸음의 매개변수에 전해집니다[[ch19:19.3|시간 역전파와 잘린 BPTT.]].

**교사 강요.** 학습 때 칸 $t$의 입력은 모델이 직전에 예측한 단어가 아니라 **정답** 단어 $\mathbf x_{t-1}$입니다. 이를 교사 강요(teacher forcing)라 부릅니다(슬라이드에는 이름이 없습니다). 덕분에 모든 칸의 입력을 미리 알고, 한 번의 순전파로 $T$개의 손실을 모두 계산할 수 있습니다.

:::fig lmunroll
:::

**추론** (슬라이드 30–31). 정답이 없으므로 칸마다 점수 $S(\mathbf x_t)=\softmax(\hat{\mathbf x}_t)$에서 단어 하나를 골라 다음 칸의 입력으로 되먹이고, <EOS>를 뽑으면 멈춥니다.

:::key 탐욕 디코딩과 샘플링
- **탐욕**(greedy): $x_t=\argmax_kS(\mathbf x_t)_k$ — 결정적이라 같은 시작이면 늘 같은 문장이 나온다.
- **확률적 방법**(probabilistic): $x_t\sim S(\mathbf x_t)$ — 점수의 확률대로 뽑아 다양한 문장이 나온다.
뽑은 토큰을 다음 입력으로 되먹이고, <EOS>를 뽑으면 멈춘다.
:::

:::fig sampling
:::

:::ex 예제 5 — 한 칸의 교차 엔트로피
어휘가 4개이고 로짓이 $\hat{\mathbf x}_t=(2,1,0,0)$, 정답이 첫 토큰일 때 손실과 로짓의 기울기는?
---
$p=\softmax(\hat{\mathbf x}_t)=\frac{(e^2,e,1,1)}{e^2+e+2}\approx(0.610,0.225,0.083,0.083)$. 손실은 $-\ln p_1=\ln\big(1+e^{-1}+2e^{-2}\big)\approx0.494$, 기울기는 $p-e_1\approx(-0.390,0.225,0.083,0.083)$. 정답의 로짓은 올리고 나머지는 각자의 확률만큼 내리라는 뜻입니다.
:::

:::ex 예제 6 — 탐욕이 가장 그럴듯한 문장을 고르지는 않는다
두 토큰짜리 문장에서 $P(\text{A})=0.6$, $P(\text{B})=0.4$이고, A 다음 토큰의 최대 확률은 $0.5$, B 다음은 C가 $0.9$이다. 탐욕 디코딩의 문장과 가장 확률이 큰 문장은?
---
탐욕은 첫 칸에서 A를 고르고 그다음 확률 $0.5$의 토큰을 골라 문장 확률이 $0.6\cdot0.5=0.30$입니다. 그런데 B, C는 $0.4\cdot0.9=0.36$으로 더 큽니다. 칸마다의 최선이 문장 전체의 최선은 아닙니다. 빔 탐색 같은 방법이 이 틈을 메웁니다.
:::

### 더 깊이

**온도.** 샘플링에서 $\softmax(\hat{\mathbf x}_t/\tau)$를 쓰면 $\tau\to0$은 탐욕에, $\tau=1$은 그대로의 샘플링에 해당하고, $\tau$가 크면 균등분포에 가까워집니다. **노출 편향.** 교사 강요로 학습한 모델은 정답 입력만 보았으므로, 추론 때 자기가 낸 실수가 입력으로 들어오는 상황에 약할 수 있습니다. 둘 다 슬라이드 밖의 이야기로, 슬라이드의 두 방법을 이해하는 데 도움이 되는 정도로 알아 두면 됩니다.
` },
      { k: '20.5', src: 'W9 수 · 슬라이드 32–34', title: '기계 번역과 이미지 캡셔닝', body: R`
:::idea 쉽게 말하면
번역은 ‘입력 문장을 끝까지 읽고 → 다른 언어로 다시 쓰기’입니다. **인코더** RNN이 입력 문장을 끝까지 읽어 마지막 상태 $\mathbf s$에 요약하고, **디코더** RNN이 $\mathbf s$에서 출발하는 언어 모델로 번역문을 한 단어씩 만듭니다. 이미지 캡셔닝은 인코더 자리에 CNN을 둔 같은 구조입니다.
:::

**기계 번역** (슬라이드 32). “He loved to eat .”를 임베딩해 인코더 LSTM에 넣고, 마지막 상태 $\mathbf s$를 디코더의 시작 상태로 넘깁니다. 디코더는 NULL(시작 기호)에서 출발해 “Er liebte zu essen .”를 한 단어씩 생성하고, 칸마다의 출력은 소프트맥스 분류입니다. 입력과 출력의 길이가 다른 다대다 구조입니다[[ch19:19.1|RNN의 다섯 가지 입출력 구조.]].

:::key 인코더-디코더와 이미지 캡셔닝
$$\mathbf s=\mathrm{Enc}(x_1,\dots,x_m),\qquad P(y_1,\dots,y_T\mid x)=\prod_{t=1}^TP(y_t\mid y_0,\dots,y_{t-1},\mathbf s)$$
이미지 캡셔닝은 $f_\theta\big(y\mid g_\phi(\mathbf x)\big)$: CNN $g_\phi$가 이미지의 시각적 특성을 뽑고, RNN $f_\theta$가 그 특성을 조건으로 문장을 낸다.
:::

:::fig encdec
:::

디코더는 20.3절의 언어 모델과 똑같고, 다만 시작 상태가 $\mathbf 0$이 아니라 입력 문장의 요약 $\mathbf s$입니다. 학습도 20.4절처럼 정답 번역문을 교사 강요로 넣고 칸마다의 교차 엔트로피를 더하며, 손실의 기울기는 디코더를 지나 $\mathbf s$를 거쳐 인코더까지 역전파됩니다.

**이미지 캡셔닝** (슬라이드 33–34). 과제는 이미지 $\mathbf x$를 자연어 문장 $\mathbf y$로 묘사하는 것입니다(예: “man in black shirt is playing guitar.”). 일은 두 단계로 나뉩니다. (1) 이미지의 시각적 패턴을 인식하는 **CNN**[[ch15:15.5|풀링층과 완전연결층.]], (2) 이미지를 조건으로 문장을 생성하는 **RNN**. 수업에서는 이를 $f_\theta(\mathbf y\mid g_\phi(\mathbf x))$로 적어, 인코더 CNN($g_\phi$)과 디코더 RNN($f_\theta$)이 서로 다른 매개변수를 가진 다른 함수임을 표시했습니다. 가장 단순한 방법은 CNN의 마지막 특성 벡터(예: 분류층 직전의 4096차원)로 RNN의 시작 상태를 정하는 것입니다.

:::fig caption
:::

:::warn 어텐션은 아직
슬라이드 23·33은 ‘어텐션을 쓴 이미지 캡셔닝’을 예고하지만, 받은 슬라이드(23–34)에는 그 내용이 없습니다. 다만 동기는 분명합니다. 긴 입력 전체를 고정된 크기의 벡터 하나($\mathbf s$, 또는 CNN 특성 하나)에 담아야 하므로 정보의 병목이 생기고, 어텐션은 디코더가 칸마다 입력의 여러 위치를 다시 보게 해 이 병목을 풉니다.
:::

:::ex 예제 7 — 디코더의 입력과 목표
목표 번역문이 “Er liebte zu essen .”일 때 학습 중 디코더의 입력 열과 목표 열, 그리고 더해지는 교차 엔트로피 항의 수는?
---
입력은 NULL, Er, liebte, zu, essen이고 목표는 Er, liebte, zu, essen, “.”입니다. 칸마다 하나씩 교차 엔트로피 항 5개가 더해집니다(문장 끝 기호를 따로 두면 그 칸이 하나 더 붙습니다).
:::
` },
    ],
    problems: [
      { sec: '20.1', type: 'mc', lv: 1, q: R`LSTM에서 이전 셀 상태 $c_{t-1}$의 정보를 얼마나 남길지 정하는 것은?`,
        choices: [R`입력 게이트 $i$`, R`망각 게이트 $f$`, R`출력 게이트 $o$`, R`후보 $g$`], ans: 1,
        sol: R`$c_t=f\odot c_{t-1}+i\odot g$에서 $c_{t-1}$에 곱해지는 것이 $f$입니다. 필기: “$c_{t-1}$의 정보를 얼마나 가져갈까”.` },
      { sec: '20.1', type: 'mc', lv: 1, q: R`LSTM의 후보 $g$(슬라이드의 “gate gate”)의 값이 놓이는 범위는?`,
        choices: [R`$(0,1)$`, R`$(-1,1)$`, R`$[0,\infty)$`, R`$\mathbb R$ 전체`], ans: 1,
        sol: R`$g=\tanh(\cdot)$이므로 $(-1,1)$입니다. 게이트 $i,f,o$는 $\sigma$라서 $(0,1)$이고, $g$는 밸브가 아니라 셀에 더할(또는 뺄) 내용입니다.` },
      { sec: '20.1', type: 'num', lv: 2, q: R`스칼라 LSTM에서 $c_{t-1}=1$이고 전활성값이 $i$: $\ln3$, $f$: $0$, $g$: $\ln3$이다. $c_t$는?`, ans: '11/10', ansTex: R`\tfrac12\cdot1+\tfrac34\cdot\tfrac45=1.1`,
        sol: R`$i=\sigma(\ln3)=\frac34$, $f=\sigma(0)=\frac12$, $g=\tanh(\ln3)=\frac{3-1/3}{3+1/3}=\frac45$. $c_t=\frac12\cdot1+\frac34\cdot\frac45=0.5+0.6=1.1$.` },
      { sec: '20.1', type: 'num', lv: 2, q: R`바로 앞 문제에서 출력 게이트의 전활성값이 $0$이면 $h_t$는? (식으로 입력해도 됩니다)`, ans: 'tanh(1.1)/2', ansTex: R`\tfrac12\tanh(1.1)\approx0.4002`,
        sol: R`$o=\sigma(0)=\frac12$, $h_t=o\tanh(c_t)=\frac12\tanh(1.1)\approx\frac12\cdot0.8005=0.4002$.` },
      { sec: '20.1', type: 'num', lv: 1, q: R`입력과 은닉 크기가 모두 $100$인($d=h=100$) LSTM 한 층의 매개변수 수(편향 포함)는?`, ans: '80400', ansTex: R`4\cdot100\cdot200+400=80400`,
        sol: R`$4h(h+d)+4h=4\cdot100\cdot200+400=80{,}400$. 슬라이드 19의 $W\in\mathbb R^{4h\times2h}$가 $400\times200$입니다.` },
      { sec: '20.1', type: 'num', lv: 2, quiz: true, q: R`입력 크기 $d=128$, 은닉 크기 $h=256$인 LSTM 한 층의 매개변수 수(편향 포함)는?`, ans: '394240', ansTex: R`4\cdot256\cdot384+4\cdot256=394240`,
        sol: R`$4h(h+d)+4h=4\cdot256\cdot384+1{,}024=393{,}216+1{,}024=394{,}240$. 같은 크기의 바닐라 RNN($98{,}560$)의 4배입니다.` },
      { sec: '20.1', type: 'open', lv: 2, q: R`슬라이드 18의 한 줄짜리 식 $\begin{pmatrix}i\\f\\o\\g\end{pmatrix}=\begin{pmatrix}\sigma\\\sigma\\\sigma\\\tanh\end{pmatrix}W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}$과 필기의 게이트별 식 $i_t=\sigma(W_ix_t+U_ih_{t-1}+b_i)$ 등이 같은 식임을 $W$를 블록으로 나누어 보이고, $W$의 크기를 쓰세요.`,
        sol: R`$W=\begin{pmatrix}U_i&W_i\\U_f&W_f\\U_o&W_o\\U_g&W_g\end{pmatrix}$ ($U_\bullet\in\mathbb R^{h\times h}$, $W_\bullet\in\mathbb R^{h\times d}$)로 나누면 블록 행렬의 곱으로 $W\begin{pmatrix}h_{t-1}\\x_t\end{pmatrix}$의 $\bullet$번째 블록은 $U_\bullet h_{t-1}+W_\bullet x_t$입니다. 위에서부터 $h$개씩 잘라 $\sigma,\sigma,\sigma,\tanh$를 성분별로 적용하면(편향 $b=(b_i;b_f;b_o;b_g)$를 더해) 필기의 네 식이 됩니다. $W\in\mathbb R^{4h\times(h+d)}$이고, $d=h$이면 슬라이드 19의 $4h\times2h$입니다.`,
        rubric: R`- 블록 분할과 블록 곱 — 2점
- 성분별 활성화와 편향 — 1점
- $W$의 크기(일반형과 $d=h$의 경우) — 1점` },
      { sec: '20.2', type: 'mc', lv: 1, q: R`필기의 Rmk에서 셀 경로의 야코비안 $\partial c_t/\partial c_{t-1}$은?`,
        choices: [R`$\diag(i_t)$`, R`$\diag(f_t)$`, R`$\diag(o_t)\,U_f$`, R`$\diag(1-c_t^2)$`], ans: 1,
        sol: R`$c_t=f_t\odot c_{t-1}+i_t\odot g_t$에서 게이트를 고정하면 성분별로 $f_{t,j}$가 곱해질 뿐이므로 $\diag(f_t)$입니다. $f_t\approx1$이면 거의 항등행렬입니다.` },
      { sec: '20.2', type: 'mc', lv: 2, q: R`바닐라 RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$의 $\partial h_t/\partial h_{t-1}$은?`,
        choices: [R`$\diag(1-h_t^2)\,W_h$`, R`$W_h\diag(1-h_{t-1}^2)$`, R`$\diag(h_t)\,W_h$`, R`$\diag(1-h_t)\,W_h$`], ans: 0,
        sol: R`$a_t=W_hh_{t-1}+\cdots$, $h_t=\tanh(a_t)$이므로 연쇄법칙으로 $\diag(\tanh'(a_t))\,W_h=\diag(1-h_t^2)\,W_h$. 활성화의 미분은 바깥(왼쪽)에, 이번 걸음의 $h_t$로 계산됩니다.` },
      { sec: '20.2', type: 'num', lv: 1, q: R`망각 게이트가 줄곧 $0.98$이면 셀 경로를 따라 100걸음 뒤에 남는 기울기의 배율은? (식으로 입력해도 됩니다)`, ans: '0.98^100', ansTex: R`0.98^{100}\approx0.133`,
        sol: R`$\prod_sf_s=0.98^{100}\approx0.133$. 한 걸음 인수가 $0.8$인 RNN 경로의 $0.8^{100}\approx2\times10^{-10}$과 비교하세요.` },
      { sec: '20.2', type: 'mc', lv: 1, q: R`어떤 성분에서 줄곧 $f=1$, $i=0$이면 셀 상태는?`,
        choices: [R`$0$으로 지워진다`, R`이전 값이 그대로 무한히 보존된다`, R`출력 게이트에 따라 매 걸음 절반이 된다`, R`후보 $g$로 바뀐다`], ans: 1,
        sol: R`$c_t=1\cdot c_{t-1}+0\cdot g_t=c_{t-1}$. 슬라이드 22: “the information of that cell is preserved indefinitely”.` },
      { sec: '20.2', type: 'open', lv: 3, proof: true, quiz: true, q: R`(1) LSTM의 $c_t=f_t\odot c_{t-1}+i_t\odot g_t$에서 게이트를 고정할 때 $\partial c_t/\partial c_{t-1}=\diag(f_t)$임을 보이고, 셀 경로로 $k$걸음 거슬러 갈 때의 야코비안을 쓰세요. (2) 바닐라 RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$에 대해 $\partial h_t/\partial h_{t-1}=\diag(1-h_t^2)W_h$를 유도하고 $\lVert\partial h_t/\partial h_{t-k}\rVert\le\lVert W_h\rVert^k$을 보이세요. (3) 두 결과로 LSTM이 긴 의존성을 배우기 쉬운 이유를 설명하세요.`,
        sol: R`**(1)** 성분으로 $c_{t,j}=f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$. 게이트가 고정이면 $\partial c_{t,j}/\partial c_{t-1,l}=f_{t,j}\delta_{jl}$, 곧 $\diag(f_t)$. 연쇄법칙으로 $\frac{\partial c_t}{\partial c_{t-k}}=\diag(f_t)\cdots\diag(f_{t-k+1})=\diag\big(\prod_{s=t-k+1}^tf_s\big)$.
**(2)** $a_t=W_hh_{t-1}+W_xx_t+b$이면 $\partial a_t/\partial h_{t-1}=W_h$이고 $h_t=\tanh(a_t)$의 야코비안은 $\diag(1-\tanh^2a_t)=\diag(1-h_t^2)=:D_t$. 따라서 $\partial h_t/\partial h_{t-1}=D_tW_h$. $k$걸음이면 $D_tW_h\cdots D_{t-k+1}W_h$이고, $0<1-h^2\le1$이라 $\lVert D_s\rVert\le1$, 노름의 곱 부등식으로 $\le\lVert W_h\rVert^k$.
**(3)** RNN의 곱에는 같은 $W_h$가 $k$번 들어가 $\lVert W_h\rVert<1$이면 지수적으로 사라지고(크면 폭발할 수 있고), $\tanh$의 포화($h\approx\pm1$)도 기울기를 깎습니다. 셀 경로는 행렬곱도 활성화의 미분도 없이 성분별로 $\prod f_s$만 남으므로, 망이 $f\approx1$을 배우면 먼 과거까지 기울기가 거의 그대로 전달됩니다($f=1,i=0$이면 $c_t=c_{t-1}$). 다만 게이트를 거치는 다른 경로가 있어 소실·폭발이 완전히 없어지는 것은 아닙니다.`,
        rubric: R`- (1) 성분별 미분으로 $\diag(f_t)$와 $k$걸음의 곱 — 3점
- (2) 연쇄법칙과 $\tanh'=1-\tanh^2$로 $\diag(1-h_t^2)W_h$ — 3점
- (2) $\lVert D_s\rVert\le1$과 노름의 곱 부등식 — 2점
- (3) 비교와 한계(보장이 아님) — 2점` },
      { sec: '20.2', type: 'open', lv: 3, proof: true, q: R`게이트와 후보가 $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$을 통해 $c_{t-1}$에 의존한다는 것까지 넣어 $\partial c_t/\partial c_{t-1}$의 전체 식을 유도하세요(게이트는 $f_t=\sigma(W_fx_t+U_fh_{t-1}+b_f)$ 꼴). 필기의 $\diag(f_t)$가 이 식의 어느 항인지, 그리고 여러 걸음의 곱에서 그 항이 왜 중요한지 설명하세요.`,
        sol: R`$c_t=f_t\odot c_{t-1}+i_t\odot g_t$를 곱의 미분법으로 미분하면, $c_{t-1}$에 직접 곱해진 $f_t$에서 $\diag(f_t)$, $f_t$·$i_t$·$g_t$가 $h_{t-1}$을 통해 바뀌는 데서 $\diag(c_{t-1})\frac{\partial f_t}{\partial c_{t-1}}+\diag(g_t)\frac{\partial i_t}{\partial c_{t-1}}+\diag(i_t)\frac{\partial g_t}{\partial c_{t-1}}$이 나옵니다. 연쇄법칙으로 $\frac{\partial f_t}{\partial c_{t-1}}=\diag(f_t\odot(1-f_t))U_f\frac{\partial h_{t-1}}{\partial c_{t-1}}$ (같은 식으로 $i_t$는 $\sigma'$, $g_t$는 $\diag(1-g_t^2)U_g$), $\frac{\partial h_{t-1}}{\partial c_{t-1}}=\diag(o_{t-1}\odot(1-\tanh^2(c_{t-1})))$.
따라서 $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+E_t$, $E_t=\big[\diag(c_{t-1})\diag(f_t\odot(1-f_t))U_f+\diag(g_t)\diag(i_t\odot(1-i_t))U_i+\diag(i_t)\diag(1-g_t^2)U_g\big]\diag(o_{t-1}\odot(1-\tanh^2c_{t-1}))$.
필기의 $\diag(f_t)$는 첫 항(셀 경로)입니다. $E_t$는 $U_\bullet$를 곱하고 $\sigma'\le\frac14$, $\tanh'\le1$로 깎이는 RNN 꼴의 경로입니다. $k$걸음의 곱 $\prod_s(\diag(f_s)+E_s)$를 전개하면 $\diag(\prod_sf_s)$가 따로 한 항이고, ResNet의 $\prod(I+A_k)$에 $I$ 항이 남는 것처럼 나머지 항이 상쇄하지 않는 한 $f\approx1$인 성분의 기울기를 지켜 줍니다.`,
        rubric: R`- 곱의 미분법으로 직접 항과 게이트 경로의 분리 — 3점
- 게이트 미분 $\sigma'$, $\tanh'$와 $\partial h_{t-1}/\partial c_{t-1}$ — 3점
- 필기의 항이 무엇인지와 곱의 전개 논증 — 2점` },
      { sec: '20.2', type: 'mc', lv: 2, q: R`슬라이드 22의 결론으로 옳은 것은?`,
        choices: [R`LSTM은 기울기 소실과 폭발이 없음을 보장한다`, R`LSTM은 소실·폭발이 없음을 보장하지 않지만 긴 거리의 의존성을 배우기 쉽게 해 준다`, R`LSTM은 기울기 잘라내기를 대신하므로 잘라내기가 필요 없다`, R`LSTM은 망각 게이트를 늘 $1$로 고정한다`], ans: 1,
        sol: R`“LSTM doesn't guarantee that there is no vanishing/exploding gradient, but it does provide an easier way for the model to learn long-distance dependencies.” $f$는 학습되는 값이라 작아지면 그 경로의 기울기는 사라집니다.` },
      { sec: '20.3', type: 'mc', lv: 1, q: R`원-핫 벡터 $\mathbf x_t=e_k\in\mathbb R^n$에 임베딩 행렬 $W_e\in\mathbb R^{d\times n}$을 곱한 $W_e\mathbf x_t$는?`,
        choices: [R`$W_e$의 $k$번째 행`, R`$W_e$의 $k$번째 열`, R`$W_e$의 모든 열의 합`, R`$k$번째 성분만 남긴 $W_e$`], ans: 1,
        sol: R`$W_ee_k$는 $W_e$의 $k$번째 열입니다. 그래서 임베딩층은 토큰마다 $d$차원 벡터를 찾아 주는 표(lookup table)이고, 학습 때도 그 열만 기울기를 받습니다.` },
      { sec: '20.3', type: 'num', lv: 2, q: R`어휘 $n=10{,}000$, 임베딩 크기 $d=256$일 때 임베딩층 $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$의 매개변수 수는?`, ans: '2560256', ansTex: R`256\cdot10000+256=2560256`,
        sol: R`$W_e\in\mathbb R^{256\times10{,}000}$이 $2{,}560{,}000$개, $\mathbf b_e$가 $256$개로 $2{,}560{,}256$개입니다.` },
      { sec: '20.3', type: 'mc', lv: 1, q: R`슬라이드 26–28에서 RNN 언어 모델의 ‘문장 생성’은 무엇인가?`,
        choices: [R`문장 전체를 한 번에 분류하는 것`, R`다음 토큰을 예측하는 일을 되풀이하는 것`, R`원-핫 벡터를 정렬하는 것`, R`문장의 길이를 예측하는 것`], ans: 1,
        sol: R`“Sentence generation = predicting a next token.” <SOS>에서 시작해 예측한 토큰을 다음 입력으로 넣으며 <EOS>까지 갑니다.` },
      { sec: '20.3', type: 'open', lv: 2, q: R`확률의 곱셈 규칙 $P(x_1,\dots,x_T)=\prod_tP(x_t\mid x_{<t})$로 RNN 언어 모델이 문장의 확률을 어떻게 나타내는지 설명하세요. 은닉 상태 $\mathbf h_{t-1}$과 $\softmax(\hat{\mathbf x}_t)$의 역할을 밝히세요.`,
        sol: R`곱셈 규칙으로 문장의 결합확률은 ‘앞의 토큰들이 주어졌을 때 다음 토큰의 조건부확률’의 곱입니다. RNN은 $\mathbf h_{t-1}=$ (LSTM이 $x_0,\dots,x_{t-1}$을 차례로 읽은 상태)로 앞부분 전체를 고정된 크기의 벡터에 요약하고, $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$의 소프트맥스가 $P(x_t\mid x_{<t})$를 냅니다. 같은 매개변수를 모든 칸이 공유하므로 길이가 다른 문장도 한 모델로 다룹니다. 문장의 로그 확률은 칸마다의 $\log\softmax(\hat{\mathbf x}_t)_{k_t}$의 합이고, 그 음수가 학습 손실입니다.`,
        rubric: R`- 곱셈 규칙으로 조건부확률의 곱 — 1점
- $\mathbf h_{t-1}$이 앞부분의 요약 — 1점
- $\softmax(\hat{\mathbf x}_t)$가 다음 토큰의 분포, 로그 확률과 손실의 관계 — 2점` },
      { sec: '20.4', type: 'num', lv: 2, q: R`어휘가 3개이고 로짓이 $(1,0,0)$, 정답이 두 번째 토큰일 때 한 칸의 교차 엔트로피 손실은? (식으로 입력해도 됩니다)`, ans: 'ln(e+2)', ansTex: R`\ln(e+2)\approx1.551`,
        sol: R`$p_2=\frac{e^0}{e^1+e^0+e^0}=\frac1{e+2}$, 손실 $-\ln p_2=\ln(e+2)\approx1.551$.` },
      { sec: '20.4', type: 'open', lv: 3, proof: true, quiz: true, q: R`언어 모델의 손실 $\mathcal L=-\sum_{t=1}^T\log[\softmax(\hat{\mathbf x}_t)]_{k_t}$, $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$에 대해 (1) $\partial\mathcal L/\partial\hat{\mathbf x}_t=\softmax(\hat{\mathbf x}_t)-\mathbf x_t$, (2) $\partial\mathcal L/\partial W_d=\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$, $\partial\mathcal L/\partial\mathbf b_d=\sum_t(\mathbf p_t-\mathbf x_t)$ ($\mathbf p_t=\softmax(\hat{\mathbf x}_t)$)를 보이고, (3) 임베딩 $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$에서 $W_e$의 어느 열이 기울기를 받는지 설명하세요.`,
        sol: R`**(1)** 한 칸의 손실은 $\ell=-\hat x_{k}+\log\sum_je^{\hat x_j}$ ($k=k_t$). $\partial\ell/\partial\hat x_m=-\delta_{mk}+\frac{e^{\hat x_m}}{\sum_je^{\hat x_j}}=p_m-\delta_{mk}$, 곧 $\mathbf p_t-\mathbf x_t$. $\hat{\mathbf x}_t$는 칸 $t$의 손실에만 나오므로 $\mathcal L$에 대해서도 같습니다.
**(2)** $\hat x_{t,m}=\sum_lW_{d,ml}h_{t-1,l}+b_{d,m}$이므로 $\partial\hat x_{t,m}/\partial W_{d,ml}=h_{t-1,l}$. 연쇄법칙으로 $\partial\mathcal L/\partial W_{d,ml}=\sum_t(p_{t,m}-x_{t,m})h_{t-1,l}$, 행렬로 $\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$. 편향은 $\sum_t(\mathbf p_t-\mathbf x_t)$. 같은 $W_d$를 모든 칸이 공유하므로 칸별 기여를 더합니다.
**(3)** $\delta_t=\partial\mathcal L/\partial\mathbf z_t$(시간 역전파로 계산)라 하면 $\partial\mathcal L/\partial W_e=\sum_t\delta_t\mathbf x_t^T$. $\mathbf x_t=e_{k}$이면 $\delta_te_k^T$는 $k$번째 열만 $\delta_t$인 행렬이므로, 문장에 나온 토큰의 열만 기울기를 받습니다.`,
        rubric: R`- (1) 로그-합-지수의 미분으로 $\mathbf p_t-\mathbf x_t$ — 3점
- (2) 성분 미분과 칸별 합(공유) — 3점
- (2) 편향 — 1점
- (3) $\delta_t\mathbf x_t^T$와 열 하나만 기울기를 받는다는 해석 — 3점` },
      { sec: '20.4', type: 'mc', lv: 1, q: R`슬라이드 29처럼 학습할 때 칸 $t$의 입력으로 넣는 것은?`,
        choices: [R`직전 칸에서 모델이 예측한 토큰`, R`정답 문장의 직전 토큰 $\mathbf x_{t-1}$`, R`늘 <SOS>`, R`무작위 토큰`], ans: 1,
        sol: R`학습 때는 정답 토큰을 넣습니다(교사 강요). 그래서 모든 칸의 입력을 미리 알고 $T$개의 손실을 한 번에 계산합니다. 모델의 예측을 되먹이는 것은 추론 때입니다.` },
      { sec: '20.4', type: 'num', lv: 2, q: R`두 토큰짜리 문장에서 $P(\text{A})=0.55$, $P(\text{B})=0.45$이고, A 다음 토큰의 최대 확률은 $0.6$, B 다음은 C가 $0.9$이다. 확률이 가장 큰 두 토큰 문장의 확률은?`, ans: '0.405', ansTex: R`0.45\cdot0.9=0.405`,
        sol: R`탐욕은 A를 고르고 $0.55\cdot0.6=0.33$이지만, B, C가 $0.45\cdot0.9=0.405$로 가장 큽니다(A 다음의 어떤 토큰도 $0.6$ 이하라 $0.33$ 이하). 탐욕 디코딩이 최선의 문장을 보장하지 않는 예입니다.` },
      { sec: '20.4', type: 'mc', lv: 2, q: R`탐욕 디코딩과 확률적 샘플링의 비교로 옳은 것은?`,
        choices: [R`탐욕은 같은 시작에서 늘 같은 문장을 내고, 샘플링은 실행할 때마다 다른 문장을 낼 수 있다`, R`샘플링은 늘 확률이 가장 큰 문장을 낸다`, R`탐욕은 <EOS>를 뽑아도 멈추지 않는다`, R`둘은 학습 손실이 다르다`], ans: 0,
        sol: R`탐욕은 $\argmax$라 결정적이고, 샘플링은 $x_t\sim S(\mathbf x_t)$라 확률적입니다. 둘 다 추론 방법일 뿐 학습 손실은 같고, 둘 다 <EOS>에서 멈춥니다.` },
      { sec: '20.5', type: 'mc', lv: 1, q: R`슬라이드 32의 인코더-디코더 번역에서 $\mathbf s$는?`,
        choices: [R`번역문의 첫 단어`, R`입력 문장을 끝까지 읽은 인코더의 상태(문장의 요약)`, R`디코더의 소프트맥스 출력`, R`어휘의 크기`], ans: 1,
        sol: R`인코더가 “He loved to eat .”를 다 읽은 마지막 상태 $\mathbf s$를 디코더의 시작 상태로 넘깁니다. 디코더는 $\mathbf s$를 조건으로 한 언어 모델입니다.` },
      { sec: '20.5', type: 'mc', lv: 1, q: R`이미지 캡셔닝 $f_\theta(\mathbf y\mid g_\phi(\mathbf x))$에서 $g_\phi$의 역할은?`,
        choices: [R`문장을 생성하는 RNN`, R`이미지의 시각적 패턴(특성)을 뽑는 CNN`, R`단어를 원-핫으로 바꾸는 토큰화`, R`손실 함수`], ans: 1,
        sol: R`슬라이드 34: (1) 시각적 패턴 인식은 CNN($g_\phi$), (2) 이미지를 조건으로 한 문장 생성은 RNN($f_\theta$).` },
      { sec: '20.5', type: 'open', lv: 2, q: R`목표 번역문 “Er liebte zu essen .”에 대해 학습 중 디코더의 입력 열과 목표 열을 쓰고, 손실이 무엇의 합인지 밝히세요. 또 입력 문장 전체를 벡터 하나 $\mathbf s$에 담는 구조의 약점과, 슬라이드가 예고한 해결책을 쓰세요.`,
        sol: R`입력(교사 강요): NULL, Er, liebte, zu, essen. 목표: Er, liebte, zu, essen, “.”. 손실은 칸마다 $-\log P(y_t\mid y_{<t},\mathbf s)$(소프트맥스 교차 엔트로피) 5개의 합이고, 기울기는 디코더와 $\mathbf s$를 거쳐 인코더까지 갑니다. 약점: 입력이 길어도 고정된 크기의 $\mathbf s$ 하나에 담아야 해 정보의 병목이 생깁니다. 슬라이드 23·33이 예고한 어텐션은 디코더가 칸마다 입력의 여러 위치를 다시 보게 해 이를 풉니다.`,
        rubric: R`- 입력 열과 목표 열(한 칸 밀림) — 2점
- 칸마다 교차 엔트로피의 합과 기울기의 경로 — 1점
- 병목과 어텐션 — 1점` },
    ],
  });
})();
