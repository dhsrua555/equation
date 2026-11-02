/* 논리 지도 — 20 LSTM과 RNN의 응용. RNN의 짧은 기억에서 출발해 셀 상태와 게이트, 셀 경로의 기울기(필기의 Rmk)로 가고,
   그 LSTM으로 언어 모델을 지어 학습·추론한 뒤 번역과 캡셔닝으로 넓히는 흐름을 그립니다. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 20,
    easy: R`
19단원의 바닐라 RNN은 기억을 매 걸음 $\tanh(W\,\cdot)$에 통째로 통과시켜 다시 쓰기 때문에, 기울기가 과거로 내려가며 걸음마다 $W_h$와 $\tanh'$을 곱해 쉽게 사라집니다. **LSTM**은 기억을 **셀 상태** $c_t$라는 벨트에 따로 싣고, 입력·망각·출력 게이트로 무엇을 쓰고 지우고 내보낼지 정합니다. 갱신은 $c_t=f\odot c_{t-1}+i\odot g$, 곧 곱하기와 더하기뿐입니다.

그래서 셀을 따라 거슬러 가는 기울기에는 망각 게이트 $f_t$만 곱해집니다(필기의 $\partial c_t/\partial c_{t-1}=\diag(f_t)$). 망이 $f\approx1$을 배우면 기울기가 먼 과거까지 내려가는데, 이는 ResNet의 잔차 연결과 같은 생각입니다. 다만 게이트를 거치는 다른 경로가 있어 소실·폭발이 없다는 보장은 아닙니다.

이 LSTM으로 **언어 모델**을 짓습니다. 단어를 원-핫으로, 다시 임베딩으로 바꿔 한 칸씩 넣으면, 분류층이 다음 단어의 확률을 냅니다. 학습 때는 정답 문장을 넣고 칸마다의 교차 엔트로피를 더하며(교사 강요), 생성할 때는 뽑은 단어를 다음 입력으로 되먹입니다. 칸마다 가장 큰 것을 고르는 탐욕 디코딩이 가장 그럴듯한 문장을 보장하지는 않습니다.

마지막으로 인코더가 입력 문장을 벡터 하나로 요약하고 디코더(언어 모델)가 번역문을 쓰는 **기계 번역**, 인코더 자리에 CNN을 둔 **이미지 캡셔닝**을 봅니다.`,
    easyEn: R`
The vanilla RNN of Unit 19 rewrites its memory by passing it whole through $\tanh(W\,\cdot)$ at every step, so as the gradient travels into the past it multiplies by $W_h$ and $\tanh'$ at each step and easily vanishes. The **LSTM** carries its memory separately on a belt, the **cell state** $c_t$, and lets input, forget, and output gates decide what to write, erase, and reveal. The update is $c_t=f\odot c_{t-1}+i\odot g$: only multiplications and additions.

So the gradient travelling back along the cell is multiplied only by the forget gate $f_t$ (the notes' $\partial c_t/\partial c_{t-1}=\diag(f_t)$). If the network learns $f\approx1$, the gradient reaches far into the past, the same idea as ResNet's residual connection. But there are other paths through the gates, so it is no guarantee against vanishing or exploding.

With this LSTM we build a **language model**. Turning words into one-hot vectors and then embeddings and feeding them one slot at a time, a classification layer gives the probabilities of the next word. In training we feed the true sentence and add the cross-entropy of every slot (teacher forcing); in generation we feed each sampled word back as the next input. Greedy decoding, which takes the largest at each slot, does not guarantee the most probable sentence.

Finally we see **machine translation**, where an encoder summarizes the input sentence into one vector and a decoder (a language model) writes the translation, and **image captioning**, which puts a CNN in the encoder's place.`,
    nodes: [
      { id: 'short', role: 'q', k: '20.1', t: R`RNN의 기억은 왜 짧은가`, en: R`Why is an RNN's memory short?`,
        d: R`바닐라 RNN은 기억을 매 걸음 $\tanh(W\,\cdot)$로 다시 쓰고, 기울기는 걸음마다 $W$와 $\tanh'$을 곱해 사라지거나 폭발합니다.`,
        dEn: R`A vanilla RNN rewrites its memory with $\tanh(W\,\cdot)$ at every step, and the gradient multiplies by $W$ and $\tanh'$ at each step, vanishing or exploding.` },
      { id: 'gates', role: 'def', k: '20.1', at: ':::key LSTM의 네 게이트와 셀 상태', t: R`네 게이트와 셀 상태`, en: R`Four gates and the cell state`,
        d: R`$W(h_{t-1};x_t)$를 네 갈래로 잘라 $i,f,o=\sigma(\cdot)$, $g=\tanh(\cdot)$. $c_t=f\odot c_{t-1}+i\odot g$, $h_t=o\odot\tanh(c_t)$.`,
        dEn: R`Cut $W(h_{t-1};x_t)$ into four branches: $i,f,o=\sigma(\cdot)$, $g=\tanh(\cdot)$. $c_t=f\odot c_{t-1}+i\odot g$, $h_t=o\odot\tanh(c_t)$.` },
      { id: 'count', role: 'step', k: '20.1', at: '**매개변수 수.**', t: R`매개변수 $4h(h+d)+4h$`, en: R`Parameters $4h(h+d)+4h$`,
        d: R`네 갈래가 각각 $h\times(h+d)$ 가중치와 $h$개의 편향을 가져 바닐라 RNN의 정확히 4배입니다. 한 걸음을 손으로 계산해 봅니다.`,
        dEn: R`Each of the four branches has $h\times(h+d)$ weights and $h$ biases, exactly four times a vanilla RNN. We also compute one step by hand.` },
      { id: 'rmk', role: 'res', k: '20.2', at: ':::hand 수업 필기 — Rmk', t: R`셀 경로 $\diag(f_t)$`, en: R`Cell path $\diag(f_t)$`,
        d: R`필기의 Rmk: $\partial c_t/\partial c_{t-1}=\diag(f_t)$, $f_t\approx1$이면 거의 $I$. RNN은 $\diag(1-h_t^2)W_h$입니다.`,
        dEn: R`The notes' remark: $\partial c_t/\partial c_{t-1}=\diag(f_t)$, nearly $I$ when $f_t\approx1$. The RNN has $\diag(1-h_t^2)W_h$.` },
      { id: 'compare', role: 'check', k: '20.2', at: '**무엇이 다른가.**', t: R`$\prod f$ 대 $\lVert W_h\rVert^k$`, en: R`$\prod f$ versus $\lVert W_h\rVert^k$`,
        d: R`RNN의 곱은 $\lVert W_h\rVert^k$ 이하로 줄지만 셀 경로에는 $\prod_sf_s$만 남습니다. $f=1$, $i=0$이면 셀이 무한히 보존됩니다.`,
        dEn: R`The RNN's product shrinks below $\lVert W_h\rVert^k$, but only $\prod_sf_s$ remains on the cell path. With $f=1$, $i=0$ the cell is preserved forever.` },
      { id: 'resid', role: 'view', k: '20.2', at: '**잔차 연결과 같은 생각.**', t: R`시간 방향의 잔차 연결`, en: R`A residual connection in time`,
        d: R`$f=1$이면 $c_t=c_{t-1}+i\odot g$로 ResNet의 $x+F(x)$와 같은 지름길이고, 망각 게이트가 그 지름길을 언제 끊을지 배웁니다.`,
        dEn: R`With $f=1$, $c_t=c_{t-1}+i\odot g$ is the same shortcut as ResNet's $x+F(x)$, and the forget gate learns when to cut it.` },
      { id: 'limit', role: 'lim', k: '20.2', at: ':::warn 보장은 아니다', t: R`보장은 아니다`, en: R`Not a guarantee`,
        d: R`게이트도 $h_{t-1}$을 통해 $c_{t-1}$에 의존해 전체 야코비안은 $\diag(f_t)+E_t$입니다. 전개하면 $\diag(\prod f)$ 항이 남지만 소실·폭발이 없다는 보장은 아닙니다.`,
        dEn: R`The gates also depend on $c_{t-1}$ through $h_{t-1}$, so the full Jacobian is $\diag(f_t)+E_t$. Expanded, the term $\diag(\prod f)$ remains, but there is no guarantee against vanishing or exploding.` },
      { id: 'lm', role: 'app', k: '20.3', t: R`원-핫 → 임베딩 → LSTM → 분류층`, en: R`One-hot → embedding → LSTM → classifier`,
        d: R`문장은 이산 기호의 열입니다. $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$(열 고르기), $\mathbf h_t=\mathrm{LSTM}(\cdot)$, $\hat{\mathbf x}_{t+1}=W_d\mathbf h_t+\mathbf b_d$.`,
        dEn: R`A sentence is a sequence of discrete symbols. $\mathbf z_t=W_e\mathbf x_t+\mathbf b_e$ (picking a column), $\mathbf h_t=\mathrm{LSTM}(\cdot)$, $\hat{\mathbf x}_{t+1}=W_d\mathbf h_t+\mathbf b_d$.` },
      { id: 'next', role: 'idea', k: '20.3', at: '**문장 생성 = 다음 토큰 예측**', t: R`다음 토큰 예측`, en: R`Next-token prediction`,
        d: R`곱셈 규칙 $P(x_1,\dots,x_T)=\prod_tP(x_t\mid x_{<t})$의 각 인수를, 앞부분을 요약한 $\mathbf h_{t-1}$과 소프트맥스로 냅니다.`,
        dEn: R`Each factor of the product rule $P(x_1,\dots,x_T)=\prod_tP(x_t\mid x_{<t})$ comes from $\mathbf h_{t-1}$, a summary of what came before, and a softmax.` },
      { id: 'train', role: 'step', k: '20.4', t: R`칸마다 교차 엔트로피`, en: R`Cross-entropy at every slot`,
        d: R`손실은 칸마다 단어 분류의 교차 엔트로피의 합, 로짓의 기울기는 $\softmax(\hat{\mathbf x}_t)-\mathbf x_t$. 입력은 정답 토큰입니다(교사 강요).`,
        dEn: R`The loss is the sum of the word-classification cross-entropies of the slots, with logit gradient $\softmax(\hat{\mathbf x}_t)-\mathbf x_t$. The inputs are the true tokens (teacher forcing).` },
      { id: 'decode', role: 'alt', k: '20.4', at: '**추론**', t: R`탐욕 대 샘플링`, en: R`Greedy versus sampling`,
        d: R`뽑은 토큰을 되먹이고 <EOS>에서 멈춥니다. 탐욕은 결정적이지만 가장 그럴듯한 문장을 보장하지 않고, 샘플링은 다양한 문장을 냅니다.`,
        dEn: R`Feed each chosen token back and stop at <EOS>. Greedy is deterministic but does not guarantee the most probable sentence; sampling gives varied sentences.` },
      { id: 'encdec', role: 'app', k: '20.5', t: R`인코더-디코더와 캡셔닝`, en: R`Encoder–decoder and captioning`,
        d: R`인코더가 입력 문장을 $\mathbf s$로 요약하고 디코더(언어 모델)가 번역문을 씁니다. 인코더 자리에 CNN을 두면 이미지 캡셔닝입니다.`,
        dEn: R`The encoder summarizes the input sentence into $\mathbf s$, and the decoder (a language model) writes the translation. With a CNN as the encoder it is image captioning.` },
    ],
    rows: [['short'], ['gates'], ['count', 'rmk'], ['compare', 'resid'], ['limit', 'lm'], ['next'], ['train'], ['decode', 'encdec']],
    edges: [
      ['short', 'gates', R`기억을 따로 싣기`, R`carry memory apart`],
      ['gates', 'count', R`세어 보면`, R`count it`],
      ['gates', 'rmk', R`기울기는?`, R`and the gradient?`],
      ['rmk', 'compare', R`RNN과 비교`, R`compare with RNN`],
      ['rmk', 'resid', R`덧셈 = 지름길`, R`addition = shortcut`],
      ['compare', 'limit', R`그래도`, R`even so`],
      ['resid', 'lm', R`이 LSTM으로`, R`with this LSTM`],
      ['lm', 'next', R`문장 생성은`, R`generating text`],
      ['next', 'train', R`학습하면`, R`to train it`],
      ['train', 'decode', R`생성할 때`, R`at generation`],
      ['train', 'encdec', R`조건을 붙이면`, R`add a condition`],
    ],
  });
})();
