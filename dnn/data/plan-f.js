/* 증명의 길잡이 — 20단원의 긴 증명(본문 600자 이상). 형식은 plan-a.js와 같습니다:
   쉬운 요약(easy)과 단계(nodes), 각 단계의 at은 한국어 본문에서 그 단계가 시작하는 조각의 첫머리입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    // ───── 20
    'ch20-cellpath': {
      easy: R`보일 것은 두 야코비안입니다. LSTM의 셀은 $c_t=f_t\odot c_{t-1}+i_t\odot g_t$로 성분마다 따로 갱신되므로, 게이트를 고정하면 $c_{t-1}$의 각 성분에 $f_t$의 같은 성분이 곱해질 뿐이라 야코비안이 대각행렬 $\diag(f_t)$입니다. 여러 걸음이면 대각행렬끼리 곱하므로 성분마다 $f$의 곱만 남습니다.

RNN은 선형 사상 $W_h$ 다음에 성분별 $\tanh$를 거치므로 한 걸음의 야코비안이 $\diag(1-h_t^2)W_h$이고, 대각 인수의 크기가 1 이하라서 $k$걸음의 크기는 $\lVert W_h\rVert^k$을 넘지 못합니다. 두 결과를 나란히 놓으면 LSTM의 셀 경로가 왜 기울기를 잘 전하는지 보입니다.`,
      easyEn: R`What must be shown are two Jacobians. The LSTM cell is updated component by component as $c_t=f_t\odot c_{t-1}+i_t\odot g_t$, so with the gates fixed each component of $c_{t-1}$ is only multiplied by the same component of $f_t$, and the Jacobian is the diagonal matrix $\diag(f_t)$. Over several steps diagonal matrices are multiplied, so each component keeps only the product of the $f$'s.

The RNN passes through the linear map $W_h$ and then a componentwise $\tanh$, so one step has Jacobian $\diag(1-h_t^2)W_h$, and since the diagonal factors have size at most 1, the size over $k$ steps cannot exceed $\lVert W_h\rVert^k$. Putting the two results side by side shows why the LSTM's cell path carries the gradient well.`,
      nodes: [
        { id: 'cell', at: '**셀 경로.**', t: R`성분별 갱신 → $\diag(f_t)$`, en: R`Componentwise update → $\diag(f_t)$`,
          d: R`$c_{t,j}$에 나오는 것은 $c_{t-1,j}$ 하나뿐이고 계수가 $f_{t,j}$라 $\partial c_{t,j}/\partial c_{t-1,l}=f_{t,j}\delta_{jl}$입니다.`,
          dEn: R`Only $c_{t-1,j}$ appears in $c_{t,j}$, with coefficient $f_{t,j}$, so $\partial c_{t,j}/\partial c_{t-1,l}=f_{t,j}\delta_{jl}$.` },
        { id: 'kcell', at: '**k걸음.**', t: R`대각행렬의 곱`, en: R`A product of diagonal matrices`,
          d: R`연쇄법칙으로 야코비안을 곱하면 대각 성분끼리 곱해져 $\diag(\prod_sf_s)$가 됩니다.`,
          dEn: R`Multiplying the Jacobians by the chain rule multiplies the diagonal entries, giving $\diag(\prod_sf_s)$.` },
        { id: 'rnn', at: '**RNN 한 걸음.**', t: R`RNN: $\diag(1-h_t^2)W_h$`, en: R`RNN: $\diag(1-h_t^2)W_h$`,
          d: R`$a_t$의 야코비안 $W_h$에 성분별 $\tanh$의 야코비안 $\diag(1-h_t^2)$를 왼쪽에서 곱합니다.`,
          dEn: R`Multiply the Jacobian $W_h$ of $a_t$ on the left by the Jacobian $\diag(1-h_t^2)$ of the componentwise $\tanh$.` },
        { id: 'bound', at: '**k걸음과 상계.**', t: R`$\lVert D_s\rVert\le1$이라 $\lVert W_h\rVert^k$`, en: R`$\lVert D_s\rVert\le1$, hence $\lVert W_h\rVert^k$`,
          d: R`대각행렬 $D_s$의 노름은 $\max_j|1-h_{s,j}^2|\le1$이고, 노름의 곱 부등식으로 $k$걸음의 크기는 $\lVert W_h\rVert^k$ 이하입니다.`,
          dEn: R`The norm of the diagonal $D_s$ is $\max_j|1-h_{s,j}^2|\le1$, and the norm product inequality bounds the size over $k$ steps by $\lVert W_h\rVert^k$.` },
      ],
    },
    'ch20-fulljac': {
      easy: R`필기의 $\diag(f_t)$는 게이트를 상수로 본 미분입니다. 실제로는 게이트와 후보가 $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$을 통해 $c_{t-1}$에도 의존하므로, 곱의 미분법으로 $c_t=f_t\odot c_{t-1}+i_t\odot g_t$를 미분하면 항이 넷 나옵니다. 첫 항이 필기의 $\diag(f_t)$이고, 나머지 셋은 게이트를 거치는 경로입니다.

나머지 항은 연쇄법칙으로 ‘게이트의 $h_{t-1}$에 대한 미분’과 ‘$h_{t-1}$의 $c_{t-1}$에 대한 미분’의 곱으로 계산합니다. 끝으로 여러 걸음의 곱을 전개해, 모든 걸음에서 첫 항을 고른 $\diag(\prod f)$가 따로 남는다는 점, 그리고 그것이 왜 보장은 아닌지를 봅니다.`,
      easyEn: R`The notes' $\diag(f_t)$ is a derivative that treats the gates as constants. In fact the gates and the candidate also depend on $c_{t-1}$ through $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$, so differentiating $c_t=f_t\odot c_{t-1}+i_t\odot g_t$ by the product rule gives four terms. The first is the notes' $\diag(f_t)$, and the other three are paths through the gates.

The other terms are computed by the chain rule as the product of "the derivative of the gate with respect to $h_{t-1}$" and "the derivative of $h_{t-1}$ with respect to $c_{t-1}$". Finally we expand the product over several steps to see that $\diag(\prod f)$, the term choosing the first term at every step, remains on its own, and why that is still no guarantee.`,
      nodes: [
        { id: 'prod', at: '**곱의 미분법.**', t: R`네 항으로 나누기`, en: R`Split into four terms`,
          d: R`성분 $f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$를 미분하면 직접 항 $\diag(f_t)$와 $f_t,i_t,g_t$가 바뀌는 세 항이 나옵니다.`,
          dEn: R`Differentiating the component $f_{t,j}c_{t-1,j}+i_{t,j}g_{t,j}$ gives the direct term $\diag(f_t)$ and three terms from $f_t,i_t,g_t$ changing.` },
        { id: 'gate', at: '**게이트의 미분.**', t: R`$\sigma'$, $\tanh'$와 $\partial h_{t-1}/\partial c_{t-1}$`, en: R`$\sigma'$, $\tanh'$ and $\partial h_{t-1}/\partial c_{t-1}$`,
          d: R`$\sigma'=\sigma(1-\sigma)$, $\tanh'=1-\tanh^2$로 게이트의 $h_{t-1}$ 미분을, $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$에서 $\diag(o_{t-1}\odot(1-\tanh^2c_{t-1}))$를 얻습니다.`,
          dEn: R`$\sigma'=\sigma(1-\sigma)$ and $\tanh'=1-\tanh^2$ give the gates' derivatives with respect to $h_{t-1}$, and $h_{t-1}=o_{t-1}\odot\tanh(c_{t-1})$ gives $\diag(o_{t-1}\odot(1-\tanh^2c_{t-1}))$.` },
        { id: 'join', at: '**합치기.**', t: R`$\diag(f_t)+E_t$`, en: R`$\diag(f_t)+E_t$`,
          d: R`연쇄법칙으로 대입하고 공통인 오른쪽 인수를 묶으면 명제의 식입니다.`,
          dEn: R`Substituting with the chain rule and factoring out the common right factor gives the formula of the statement.` },
        { id: 'many', at: '**여러 걸음.**', t: R`전개하면 $\diag(\prod f)$가 남는다`, en: R`Expanded, $\diag(\prod f)$ remains`,
          d: R`$\prod_s(\diag(f_s)+E_s)$를 전개하면 셀 경로만의 항이 따로 남습니다. 잔차망의 $I$ 항과 같은 구조이지만, 다른 항이 상쇄하거나 커질 수 있어 보장은 아닙니다.`,
          dEn: R`Expanding $\prod_s(\diag(f_s)+E_s)$ leaves a term of the cell path alone. It has the same structure as the residual network's $I$ term, but the other terms can cancel it or grow, so it is no guarantee.` },
      ],
    },
    'ch20-lmgrad': {
      easy: R`언어 모델의 손실은 칸마다의 소프트맥스 교차 엔트로피를 더한 것이므로, 한 칸에서는 6단원과 같은 계산으로 로짓의 기울기 $\mathbf p_t-\mathbf x_t$를 얻습니다. 이것이 출발점입니다.

그다음 이 기울기를 아래로 보냅니다. 분류층 $W_d$, $\mathbf b_d$는 모든 칸이 공유하므로 칸마다의 기여를 더하고, 은닉 상태 $\mathbf h_{t-1}$에는 $W_d^T(\mathbf p_t-\mathbf x_t)$가 들어가 시간 역전파로 이어집니다. 마지막으로 임베딩은 원-핫 벡터를 곱하는 열 고르기라서, 그 칸의 토큰에 해당하는 열만 기울기를 받습니다.`,
      easyEn: R`The language model's loss is the sum of the softmax cross-entropies of the slots, so at one slot the same computation as in Unit 6 gives the logit gradient $\mathbf p_t-\mathbf x_t$. This is the starting point.

Then we send this gradient downward. The classification layer $W_d$, $\mathbf b_d$ is shared by all slots, so the contributions of the slots are added; the hidden state $\mathbf h_{t-1}$ receives $W_d^T(\mathbf p_t-\mathbf x_t)$, which continues into backpropagation through time. Finally the embedding is a column pick by a one-hot vector, so only the column of that slot's token receives a gradient.`,
      nodes: [
        { id: 'slot', at: '**한 칸의 손실.**', t: R`로짓의 기울기 $\mathbf p_t-\mathbf x_t$`, en: R`Logit gradient $\mathbf p_t-\mathbf x_t$`,
          d: R`$\ell_t=-\hat x_{t,k}+\log\sum_je^{\hat x_{t,j}}$를 미분하면 $p_{t,m}-\delta_{mk}$입니다.`,
          dEn: R`Differentiating $\ell_t=-\hat x_{t,k}+\log\sum_je^{\hat x_{t,j}}$ gives $p_{t,m}-\delta_{mk}$.` },
        { id: 'head', at: '**분류층.**', t: R`공유된 $W_d$: 칸마다 더하기`, en: R`Shared $W_d$: add over slots`,
          d: R`$\partial\hat x_{t,m}/\partial W_{d,ml}=h_{t-1,l}$이고 모든 칸이 같은 $W_d$를 쓰므로 $\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$.`,
          dEn: R`$\partial\hat x_{t,m}/\partial W_{d,ml}=h_{t-1,l}$, and every slot uses the same $W_d$, so $\sum_t(\mathbf p_t-\mathbf x_t)\mathbf h_{t-1}^T$.` },
        { id: 'hid', at: '**은닉 상태로.**', t: R`$W_d^T(\mathbf p_t-\mathbf x_t)$ → BPTT`, en: R`$W_d^T(\mathbf p_t-\mathbf x_t)$ → BPTT`,
          d: R`칸 $t$의 손실이 $\mathbf h_{t-1}$에 주는 기울기이고, 뒤 걸음에서 돌아오는 기울기와 더해 시간 역전파를 이어 갑니다.`,
          dEn: R`This is the gradient the loss of slot $t$ gives $\mathbf h_{t-1}$; added to the gradient returning from later steps, it continues backpropagation through time.` },
        { id: 'emb', at: '**임베딩.**', t: R`열 하나만 기울기를 받는다`, en: R`Only one column gets a gradient`,
          d: R`$\partial\mathcal L/\partial W_e=\sum_t\delta_t\mathbf x_t^T$이고 $\mathbf x_t=e_{k_t}$이면 $k_t$번째 열만 바뀝니다.`,
          dEn: R`$\partial\mathcal L/\partial W_e=\sum_t\delta_t\mathbf x_t^T$, and with $\mathbf x_t=e_{k_t}$ only column $k_t$ changes.` },
      ],
    },
  });
})();
