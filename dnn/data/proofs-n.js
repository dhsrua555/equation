/* 증명 — 20단원: 9주차 수요일 슬라이드 18–34와 필기(LSTM의 셀 경로 기울기, 전체 야코비안, 매개변수 수, 언어 모델 손실의 기울기, 탐욕 디코딩). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 20
  { ch: 'ch20', id: 'cellpath', title: '셀 경로의 야코비안과 RNN의 야코비안', keys: ['셀 상태의 기울기 경로'], src: '강의 필기 · W9 수',
    tags: 'LSTM cell state gradient forget gate Jacobian diag vanishing RNN tanh 셀 상태 망각 게이트 야코비안 기울기 소실',
    stmt: R`LSTM의 $c_t=f_t\odot c_{t-1}+i_t\odot g_t$에서 게이트 $f_t,i_t,g_t$를 고정하면 $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)$이고 $\frac{\partial c_t}{\partial c_{t-k}}=\diag\big(\prod_{s=t-k+1}^tf_s\big)$이다. 바닐라 RNN $h_t=\tanh(W_hh_{t-1}+W_xx_t+b)$에서는 $\frac{\partial h_t}{\partial h_{t-1}}=\diag(1-h_t^2)W_h$이고 $\big\lVert\frac{\partial h_t}{\partial h_{t-k}}\big\rVert\le\lVert W_h\rVert^k$이다.`,
    body: R`
**셀 경로.** 성분으로 쓰면 $c_{t,j}=f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$입니다. 게이트를 고정하면 $c_{t,j}$에 나오는 $c_{t-1}$의 성분은 $c_{t-1,j}$ 하나뿐이고 계수가 $f_{t,j}$이므로 $\frac{\partial c_{t,j}}{\partial c_{t-1,l}}=f_{t,j}\delta_{jl}$, 곧 $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)$입니다.

**k걸음.** 연쇄법칙으로 야코비안을 곱하면
$$\frac{\partial c_t}{\partial c_{t-k}}=\frac{\partial c_t}{\partial c_{t-1}}\cdots\frac{\partial c_{t-k+1}}{\partial c_{t-k}}=\diag(f_t)\cdots\diag(f_{t-k+1})=\diag\Big(\prod_{s=t-k+1}^tf_s\Big)$$
입니다. 대각행렬의 곱은 대각 성분끼리의 곱이기 때문입니다.

**RNN 한 걸음.** $a_t=W_hh_{t-1}+W_xx_t+b$로 두면 $\frac{\partial a_t}{\partial h_{t-1}}=W_h$입니다. $h_t=\tanh(a_t)$는 성분별 함수라 야코비안이 $\diag(\tanh'(a_t))$이고 $\tanh'=1-\tanh^2$이므로 $\diag(1-h_t^2)$입니다. 연쇄법칙으로 $\frac{\partial h_t}{\partial h_{t-1}}=\diag(1-h_t^2)W_h$.

**k걸음과 상계.** $D_s=\diag(1-h_s^2)$라 하면 $\frac{\partial h_t}{\partial h_{t-k}}=D_tW_hD_{t-1}W_h\cdots D_{t-k+1}W_h$입니다. $0<1-h_s^2\le1$이므로 대각행렬 $D_s$의 연산자 노름은 $\max_j|1-h_{s,j}^2|\le1$이고, 노름의 곱 부등식 $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$로
$$\Big\lVert\frac{\partial h_t}{\partial h_{t-k}}\Big\rVert\le\prod_{s}\lVert D_s\rVert\lVert W_h\rVert\le\lVert W_h\rVert^k$$
입니다.`,
    note: R`$f_s=1$, $i_s=0$이면 $c_t=c_{t-1}$이라 셀 경로의 야코비안이 정확히 $I$입니다. 반면 $\lVert W_h\rVert<1$인 RNN의 기울기는 지수적으로 사라집니다. 게이트도 $c_{t-1}$에 의존한다는 것까지 넣은 전체 식은 ‘셀 상태의 전체 야코비안’의 증명에 있습니다.` },
  { ch: 'ch20', id: 'fulljac', title: '셀 상태의 전체 야코비안', keys: ['셀 상태의 전체 야코비안'],
    tags: 'LSTM full Jacobian gate path product rule expansion residual 전체 야코비안 게이트 경로 곱의 미분법 전개',
    stmt: R`$f_t=\sigma(W_fx_t+U_fh_{t-1}+b_f)$, $i_t=\sigma(W_ix_t+U_ih_{t-1}+b_i)$, $g_t=\tanh(W_gx_t+U_gh_{t-1}+b_g)$, $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$이면 $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+E_t$이고, $E_t=\big[\diag(c_{t-1})\diag(f_t\odot(1-f_t))U_f+\diag(g_t)\diag(i_t\odot(1-i_t))U_i+\diag(i_t)\diag(1-g_t^2)U_g\big]\diag\big(o_{t-1}\odot(1-\tanh^2(c_{t-1}))\big)$이다.`,
    body: R`
**곱의 미분법.** $c_t=f_t\odot c_{t-1}+i_t\odot g_t$의 $j$번째 성분 $f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$를 $c_{t-1,l}$로 미분하면
$$\frac{\partial c_{t,j}}{\partial c_{t-1,l}}=f_{t,j}\delta_{jl}+c_{t-1,j}\frac{\partial f_{t,j}}{\partial c_{t-1,l}}+g_{t,j}\frac{\partial i_{t,j}}{\partial c_{t-1,l}}+i_{t,j}\frac{\partial g_{t,j}}{\partial c_{t-1,l}}$$
이고, 행렬로 $\frac{\partial c_t}{\partial c_{t-1}}=\diag(f_t)+\diag(c_{t-1})\frac{\partial f_t}{\partial c_{t-1}}+\diag(g_t)\frac{\partial i_t}{\partial c_{t-1}}+\diag(i_t)\frac{\partial g_t}{\partial c_{t-1}}$입니다. 첫 항이 필기의 셀 경로입니다.

**게이트의 미분.** $f_t$는 $h_{t-1}$을 통해서만 $c_{t-1}$에 의존합니다($o_{t-1}$은 $h_{t-2}$와 $x_{t-1}$의 함수입니다). $\sigma'=\sigma(1-\sigma)$이므로 $\frac{\partial f_t}{\partial h_{t-1}}=\diag(f_t\odot(1-f_t))U_f$, 같은 식으로 $\frac{\partial i_t}{\partial h_{t-1}}=\diag(i_t\odot(1-i_t))U_i$이고, $\tanh'=1-\tanh^2$에서 $\frac{\partial g_t}{\partial h_{t-1}}=\diag(1-g_t^2)U_g$입니다. 또 $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$이므로 $\frac{\partial h_{t-1}}{\partial c_{t-1}}=\diag\big(o_{t-1}\odot(1-\tanh^2(c_{t-1}))\big)$입니다.

**합치기.** 연쇄법칙 $\frac{\partial f_t}{\partial c_{t-1}}=\frac{\partial f_t}{\partial h_{t-1}}\frac{\partial h_{t-1}}{\partial c_{t-1}}$ 등을 대입하고 공통인 오른쪽 인수 $\frac{\partial h_{t-1}}{\partial c_{t-1}}$를 묶으면 명제의 $\diag(f_t)+E_t$가 됩니다.

**여러 걸음.** $\frac{\partial c_t}{\partial c_{t-k}}=\prod_{s=t-k+1}^{t}\big(\diag(f_s)+E_s\big)$(왼쪽이 나중 걸음)를 전개하면, 모든 인수에서 $\diag(f_s)$를 고른 항 $\diag\big(\prod_sf_s\big)$가 따로 한 항입니다. $E_s$는 $U_\bullet$를 곱하고 $\sigma'\le\frac14$, $\tanh'\le1$, $o\le1$로 깎이는 RNN 꼴의 경로이므로, 나머지 항이 이를 정확히 상쇄하지 않는 한 $f\approx1$인 성분에서 기울기가 남습니다. 잔차망의 $\prod_k(I+A_k)$에 $I$ 항이 남는 것과 같은 구조입니다.`,
    note: R`이 논증은 보장이 아닙니다. $E_s$가 크면 폭발할 수 있고, $f_s$가 작으면 셀 경로도 사라집니다. 슬라이드 22의 결론(“doesn't guarantee … but provides an easier way”)이 바로 이것입니다.` },
  { ch: 'ch20', id: 'lstmparams', title: 'LSTM의 매개변수 수', keys: ['LSTM의 매개변수 수'],
    tags: 'LSTM parameters count weights bias 4h(h+d) RNN 매개변수 수 가중치 편향',
    stmt: R`입력 $x_t\in\mathbb R^d$, 은닉 상태 $h_t\in\mathbb R^h$인 LSTM 한 층의 매개변수는 $4h(h+d)+4h$개로, 같은 크기의 바닐라 RNN($h(h+d)+h$)의 4배이다.`,
    body: R`
네 갈래 $\bullet\in\{i,f,o,g\}$는 각각 $U_\bullet\in\mathbb R^{h\times h}$, $W_\bullet\in\mathbb R^{h\times d}$, $b_\bullet\in\mathbb R^h$를 가지므로 갈래마다 $h^2+hd+h=h(h+d)+h$개입니다. 갈래는 네 개이고 서로 매개변수를 공유하지 않으므로 합은 $4\big(h(h+d)+h\big)=4h(h+d)+4h$입니다.
큰 행렬로 보면 $W=\begin{pmatrix}U_\bullet&W_\bullet\end{pmatrix}$를 네 줄 쌓은 $W\in\mathbb R^{4h\times(h+d)}$와 $b\in\mathbb R^{4h}$이므로 같은 수입니다. 바닐라 RNN은 $W_h\in\mathbb R^{h\times h}$, $W_x\in\mathbb R^{h\times d}$, $b\in\mathbb R^h$ 하나씩이라 $h(h+d)+h$이고, 비율은 정확히 $4$입니다.`,
    note: R`$d=h$이면 $8h^2+4h$이고 $W$는 슬라이드 19의 $4h\times2h$입니다. 매개변수 수는 시퀀스 길이와 무관합니다. 모든 걸음이 같은 매개변수를 공유하기 때문입니다.` },
  { ch: 'ch20', id: 'lmgrad', title: '언어 모델 손실의 기울기', keys: ['언어 모델의 학습 손실'],
    tags: 'language model cross-entropy softmax gradient logits embedding teacher forcing 언어 모델 교차 엔트로피 소프트맥스 기울기 임베딩',
    stmt: R`$\mathcal L=-\sum_{t=1}^T\log[\mathbf p_t]_{k_t}$, $\mathbf p_t=\softmax(\hat{\mathbf x}_t)$, $\hat{\mathbf x}_t=W_d\mathbf h_{t-1}+\mathbf b_d$, $\mathbf x_t=e_{k_t}$이면 $\frac{\partial\mathcal L}{\partial\hat{\mathbf x}_t}=\mathbf p_t-\mathbf x_t$, $\frac{\partial\mathcal L}{\partial W_d}=\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$, $\frac{\partial\mathcal L}{\partial\mathbf b_d}=\sum_t(\mathbf p_t-\mathbf x_t)$이고, $\hat{\mathbf x}_t$를 거쳐 $\mathbf h_{t-1}$로 들어가는 기울기는 $W_d^T(\mathbf p_t-\mathbf x_t)$이다. 임베딩 $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$에서는 $\frac{\partial\mathcal L}{\partial W_e}=\sum_t\delta_t\mathbf x_t^T$ ($\delta_t=\partial\mathcal L/\partial\mathbf z_t$)이다.`,
    body: R`
**한 칸의 손실.** $k=k_t$로 두면 $\ell_t=-\log p_{t,k}=-\hat x_{t,k}+\log\sum_je^{\hat x_{t,j}}$입니다. 이를 $\hat x_{t,m}$로 미분하면
$$\frac{\partial\ell_t}{\partial\hat x_{t,m}}=-\delta_{mk}+\frac{e^{\hat x_{t,m}}}{\sum_je^{\hat x_{t,j}}}=p_{t,m}-x_{t,m}$$
이므로 $\frac{\partial\ell_t}{\partial\hat{\mathbf x}_t}=\mathbf p_t-\mathbf x_t$입니다. $\hat{\mathbf x}_t$는 칸 $t$의 손실에만 나오므로 $\frac{\partial\mathcal L}{\partial\hat{\mathbf x}_t}$도 같습니다.

**분류층.** $\hat x_{t,m}=\sum_lW_{d,ml}h_{t-1,l}+b_{d,m}$에서 $\frac{\partial\hat x_{t,m}}{\partial W_{d,ml}}=h_{t-1,l}$, $\frac{\partial\hat x_{t,m}}{\partial b_{d,m}}=1$입니다. 모든 칸이 같은 $W_d$, $\mathbf b_d$를 쓰므로 칸마다의 기여를 더해 $\frac{\partial\mathcal L}{\partial W_{d,ml}}=\sum_t(p_{t,m}-x_{t,m})h_{t-1,l}$, 곧 $\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$이고 편향은 $\sum_t(\mathbf p_t-\mathbf x_t)$입니다.

**은닉 상태로.** $\frac{\partial\hat{\mathbf x}_t}{\partial\mathbf h_{t-1}}=W_d$이므로 칸 $t$의 손실이 $\mathbf h_{t-1}$에 주는 기울기는 $W_d^T(\mathbf p_t-\mathbf x_t)$입니다. $\mathbf h_{t-1}$은 뒤의 걸음에도 쓰이므로, 시간 역전파에서는 여기에 $\mathbf h_t$를 거쳐 돌아오는 기울기를 더합니다.

**임베딩.** $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$에서 $\frac{\partial z_{t,a}}{\partial W_{e,ab}}=x_{t,b}$이므로 $\frac{\partial\mathcal L}{\partial W_e}=\sum_t\delta_t\mathbf x_t^T$입니다. $\mathbf x_t=e_{k_t}$이면 $\delta_te_{k_t}^T$는 $k_t$번째 열만 $\delta_t$인 행렬이라, 문장에 나온 토큰의 열만 기울기를 받습니다.`,
    note: R`한 칸만 보면 6단원의 소프트맥스 교차 엔트로피 기울기와 같은 계산입니다. 언어 모델에서 새로운 것은 칸마다의 기여를 공유된 매개변수 위에서 더한다는 점과, 임베딩이 열 고르기라는 점입니다.` },
  { ch: 'ch20', id: 'greedy', title: '탐욕 디코딩과 조상 샘플링', keys: ['탐욕 디코딩과 샘플링'],
    tags: 'greedy decoding sampling ancestral beam search counterexample 탐욕 디코딩 샘플링 반례 빔 탐색',
    stmt: R`(1) 칸마다 $x_t\sim P(\cdot\mid x_{<t})$로 뽑으면 문장 $(x_1,\dots,x_T)$가 나올 확률은 모형의 결합확률 $P(x_1,\dots,x_T)$와 같다. (2) 칸마다 $\argmax$를 고르는 탐욕 디코딩은 결합확률이 가장 큰 문장을 고른다는 보장이 없다.`,
    body: R`
**(1) 샘플링.** 칸마다의 선택은 앞의 선택이 주어졌을 때의 조건부확률로 이루어지므로, 특정 문장이 나올 확률은 칸마다의 확률을 곱한 $\prod_tP(x_t\mid x_{<t})$입니다. 곱셈 규칙으로 이것은 $P(x_1,\dots,x_T)$입니다. 그래서 확률적 방법은 모형이 정한 문장 분포에서 정확히 표본을 뽑습니다.

**(2) 반례.** $P(\text{A})=0.6$, $P(\text{B})=0.4$, A 다음 토큰의 최대 확률이 $0.5$, $P(\text{C}\mid\text{B})=0.9$라 합시다. 탐욕은 A를 고른 뒤 확률 $0.5$의 토큰을 골라 문장 확률이 $0.6\cdot0.5=0.30$이지만, $P(\text{B},\text{C})=0.4\cdot0.9=0.36>0.30$입니다. 탐욕은 각 인수를 따로 최대화할 뿐인데, 뒤의 인수가 앞의 선택에 의존하므로 곱의 최대가 인수별 최대의 곱이 되지 않습니다.`,
    note: R`빔 탐색은 칸마다 확률이 큰 부분 문장 $B$개를 남겨 이 틈을 줄이지만, 역시 최대를 보장하지는 않습니다. 슬라이드 30–31은 탐욕과 확률적 방법 두 가지만 다룹니다.` },
  );
})();
