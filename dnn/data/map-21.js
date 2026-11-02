/* 논리 지도 — 21 어텐션과 트랜스포머. 캡셔닝에서 그림을 한 번만 보는 병목에서 출발해 소프트 어텐션, 점수 $q\cdot k/\sqrt D$로의 일반화,
   키·값·질의와 셀프 어텐션의 순열 등변성, 그 처방인 위치 부호화와 마스크, 멀티헤드와 인코더 블록, 층 정규화로 가는 흐름을 그립니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 21,
    easy: R`
캡셔닝 모델이 그림을 첫 입력으로 한 번만 보면, 문장이 길어질수록 그림을 잊고 앞 단어만으로 문장을 이어 갑니다. 그림을 매 걸음 다시 보여 주는 지름길도 있지만, 어텐션은 한 걸음 더 나아가 **그림의 어느 칸을 볼지**를 단어마다 고릅니다. 칸마다 점수를 매겨 소프트맥스로 합이 $1$인 가중치를 만들고 그 가중 평균을 읽습니다.

이를 일반화하면 질의 하나가 입력 목록을 훑어 점수 $q\cdot k/\sqrt D$로 가중 평균을 가져오는 **어텐션 층**입니다. $\sqrt D$로 나누는 것은 점곱의 분산이 $D$라서 그대로 두면 소프트맥스가 한 곳에 몰려 기울기가 사라지기 때문입니다. 입력에서 키·값·질의를 모두 만들면 입력이 서로를 보는 **셀프 어텐션**인데, 이 층은 순서를 바꿔도 같은 값을 순서대로 낼 뿐인 **순열 등변**이라 순서를 모릅니다.

그래서 처방이 둘입니다. 순서가 필요하면 사인·코사인 **위치 부호화**를 더하고(상대 위치가 회전행렬로 나타납니다), 언어 모델처럼 미래를 보면 안 되면 점수에 $-\infty$를 더하는 **마스크**를 씁니다.

마지막으로 여러 헤드를 병렬로 돌리는 멀티헤드 어텐션에 잔차 연결과 **층 정규화**, 위치별 FF를 붙여 **인코더 블록**을 만들고 $N$번 쌓습니다. 층 정규화는 토큰 하나의 특성 안에서 평균과 분산을 맞추어 배치 크기와 무관합니다.`,
    easyEn: R`
If a captioning model sees the picture only once, as its first input, it forgets the picture as the sentence grows and continues from the previous words alone. A shortcut that shows the picture again at every step exists, but attention goes one step further and chooses **which cells of the picture to look at** for each word. It scores every cell, turns the scores into weights that sum to $1$ with a softmax, and reads the weighted average.

Generalized, this is the **attention layer**: one query scans a list of inputs and fetches a weighted average with scores $q\cdot k/\sqrt D$. We divide by $\sqrt D$ because the variance of the dot product is $D$, so left alone the softmax would pile onto one entry and the gradient would vanish. If keys, values, and queries are all made from the inputs, the inputs look at each other, which is **self-attention**; this layer is **permutation equivariant**, so reordering the input merely reorders the output, and it does not know the order.

So there are two remedies. If order matters, add the sine–cosine **positional encoding** (relative position appears as a rotation matrix); if the model must not see the future, as in a language model, add $-\infty$ to the scores with a **mask**.

Finally, we attach residual connections, **layer normalization**, and a position-wise FF to multi-head attention, which runs several heads in parallel, to make an **encoder block**, and stack it $N$ times. Layer normalization sets the mean and variance within the features of a single token, so it does not depend on the batch size.`,
    nodes: [
      { id: 'bottle', role: 'q', k: '21.1', t: R`그림을 한 번만 보면?`, en: R`What if the picture is seen once?`,
        d: R`첫 입력으로만 주면 앞 단어의 영향이 더 직접적이라 모델이 그림을 무시합니다. 지름길은 의존 거리를 $1$로 줄이지만 무시할 수는 있습니다.`,
        dEn: R`If it is given only as the first input, the earlier words have the more direct influence and the model ignores the picture. A shortcut cuts the dependency distance to $1$, but the model can still ignore it.` },
      { id: 'soft', role: 'def', k: '21.2', at: ':::key 소프트 어텐션 캡셔닝', t: R`소프트 어텐션 $\sum\alpha\mathbf x$`, en: R`Soft attention $\sum\alpha\mathbf x$`,
        d: R`점수 $e_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1})$를 소프트맥스해 합이 $1$인 $\alpha$로 $14\times14$ 특성을 가중 평균합니다. 하드는 한 칸을 뽑는 것이고 소프트는 그 기댓값입니다.`,
        dEn: R`Softmax the scores $e_{i,j}=f_{att}(\mathbf x_{i,j},\mathbf h_{t-1})$ into $\alpha$ summing to $1$ and take the weighted average of the $14\times14$ features. Hard attention picks one cell; soft is its expectation.` },
      { id: 'channel', role: 'view', k: '21.3', at: ':::key 스퀴즈-익사이트 블록', t: R`채널 어텐션 (SENet)`, en: R`Channel attention (SENet)`,
        d: R`위치 대신 채널을 고릅니다. 전역 풀링 → 병목 MLP → 시그모이드로 채널별 가중치를 만들어 곱하고, 합이 $1$일 필요가 없습니다.`,
        dEn: R`It chooses channels instead of positions. Global pooling, a bottleneck MLP, and a sigmoid make a weight per channel to multiply by; the weights need not sum to $1$.` },
      { id: 'bias', role: 'idea', k: '21.3', at: ':::key 귀납 편향', t: R`귀납 편향과 범용 모델`, en: R`Inductive bias and a universal model`,
        d: R`CNN은 2차원 격자와 이동 불변, RNN은 1차원 사슬을 가정해 다른 자료에 일반화되지 않습니다. 하나의 모델이 여러 자료를 다루려면 가정을 줄여야 합니다.`,
        dEn: R`CNNs assume a 2D grid and translation invariance, RNNs a 1D chain, and neither generalizes to other data. A single model for many kinds of data must assume less.` },
      { id: 'scaled', role: 'def', k: '21.4', at: ':::key 스케일 점곱 어텐션', t: R`스케일 점곱 $\mathbf q\cdot\mathbf k/\sqrt D$`, en: R`Scaled dot product $\mathbf q\cdot\mathbf k/\sqrt D$`,
        d: R`질의와 입력의 점곱을 점수로 쓰고 소프트맥스합니다. $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$이므로 $\sqrt D$로 나눠 포화와 기울기 소실을 막습니다.`,
        dEn: R`Use the dot product of the query and an input as the score and take a softmax. Since $\mathrm{Var}(\mathbf q\cdot\mathbf k)=D$, dividing by $\sqrt D$ prevents saturation and vanishing gradients.` },
      { id: 'self', role: 'def', k: '21.5', at: ':::key 셀프 어텐션의 모양과 비용', t: R`키·값·질의, 셀프 어텐션`, en: R`Keys, values, queries, self-attention`,
        d: R`$Q=XW_q$, $K=XW_k$, $V=XW_v$, $Y=\mathrm{softmax}(QK^T/\sqrt{D_k})V$. 모양은 $N\times D_v$, 비용은 $O(N^2d)$, 메모리는 $N^2$입니다.`,
        dEn: R`$Q=XW_q$, $K=XW_k$, $V=XW_v$, $Y=\mathrm{softmax}(QK^T/\sqrt{D_k})V$. The shape is $N\times D_v$, the cost $O(N^2d)$, the memory $N^2$.` },
      { id: 'equiv', role: 'res', k: '21.5', at: ':::key 셀프 어텐션의 순열 등변성', t: R`순열 등변 $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$`, en: R`Permutation equivariance $\mathrm{Attn}(PX)=P\,\mathrm{Attn}(X)$`,
        d: R`점수가 $PEP^T$로 바뀌고 소프트맥스가 순열과 교환되어, 입력의 순서를 바꾸면 출력이 같은 순서로 바뀔 뿐입니다. 곧 순서를 모릅니다.`,
        dEn: R`The scores become $PEP^T$ and the softmax commutes with permutations, so reordering the input just reorders the output. That is, it does not know the order.` },
      { id: 'pe', role: 'fix', k: '21.6', at: ':::key 사인 위치 부호화', t: R`위치 부호화`, en: R`Positional encoding`,
        d: R`사인·코사인 쌍으로 위치를 부호화해 입력에 더합니다. $\mathbf p(t+\Delta)=R(\Delta)\mathbf p(t)$라 상대 위치가 선형 사상입니다.`,
        dEn: R`Encode positions with sine–cosine pairs and add them to the input. Since $\mathbf p(t+\Delta)=R(\Delta)\mathbf p(t)$, relative position is a linear map.` },
      { id: 'mask', role: 'tool', k: '21.6', at: ':::key 마스크 셀프 어텐션', t: R`마스크 어텐션`, en: R`Masked attention`,
        d: R`$i>j$의 점수를 $-\infty$로 가려 미래의 가중치를 $0$으로 만듭니다. 각 행의 합은 $1$이고 $\mathbf y_j$는 $\mathbf x_{\le j}$에만 의존합니다.`,
        dEn: R`Mask the scores with $i>j$ to $-\infty$ so that the weights on the future are $0$. Every row still sums to $1$ and $\mathbf y_j$ depends only on $\mathbf x_{\le j}$.` },
      { id: 'mha', role: 'step', k: '21.7', at: ':::key 멀티헤드 어텐션', t: R`멀티헤드 어텐션`, en: R`Multi-head attention`,
        d: R`헤드 $h$개가 각자의 $W_q,W_k,W_v$로 어텐션하고 Concat한 뒤 $W_o$를 곱합니다. $D_k=D/h$이면 매개변수 $4D^2$, 계산량은 단일 헤드와 같습니다.`,
        dEn: R`$h$ heads attend with their own $W_q,W_k,W_v$, are concatenated, and multiplied by $W_o$. With $D_k=D/h$ the parameters are $4D^2$ and the computation equals that of a single head.` },
      { id: 'enc', role: 'app', k: '21.7', at: ':::key 인코더 블록', t: R`인코더 블록 $\times N$`, en: R`Encoder block $\times N$`,
        d: R`$\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{MHA})$, $\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{FF})$. 모양이 $n\times d$로 유지되어 쌓을 수 있고, 한 블록은 $12d^2$ 매개변수입니다.`,
        dEn: R`$\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{MHA})$, $\mathbf h\leftarrow\mathrm{LN}(\mathbf h+\mathrm{FF})$. The shape stays $n\times d$ so blocks stack, and one block has $12d^2$ parameters.` },
      { id: 'ln', role: 'alt', k: '21.8', t: R`층 정규화 대 배치 정규화`, en: R`Layer norm versus batch norm`,
        d: R`토큰 하나의 $d$개 특성에서 평균·분산을 맞춥니다. 배치 크기와 문장 길이에 무관하고 학습과 추론의 식이 같습니다.`,
        dEn: R`It normalizes the mean and variance over the $d$ features of a single token. It is independent of the batch size and the sentence length, and training and inference use the same formula.` },
    ],
    rows: [['bottle'], ['soft'], ['channel', 'scaled'], ['bias', 'self'], ['equiv'], ['pe', 'mask'], ['mha'], ['enc'], ['ln']],
    edges: [
      ['bottle', 'soft', R`어느 칸을 볼지 고르기`, R`choose which cell`],
      ['soft', 'channel', R`위치 대신 채널`, R`channels, not positions`],
      ['soft', 'scaled', R`점수 일반화`, R`generalize the score`],
      ['channel', 'bias', R`왜 범용인가`, R`why universal`],
      ['scaled', 'self', R`입력이 서로를 본다`, R`inputs look at each other`],
      ['self', 'equiv', R`성질은?`, R`its property?`],
      ['equiv', 'pe', R`순서가 필요하면`, R`if order matters`],
      ['equiv', 'mask', R`미래를 가리려면`, R`to hide the future`],
      ['pe', 'mha', R`여러 헤드로`, R`with many heads`],
      ['mha', 'enc', R`잔차와 FF를 붙여`, R`add residuals and FF`],
      ['enc', 'ln', R`정규화는?`, R`and the norm?`],
    ],
  });
})();
