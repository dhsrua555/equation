/* 논리 지도 — 19 순환 신경망과 시간 역전파. 가변 길이 순차 데이터에서 출발해 바닐라 RNN을 펼치고, 펼친 그래프의 역전파(BPTT)를
   두 단계에서 손으로 한 뒤 여러 단계의 점화식으로 넓히고, 그 점화식의 야코비안 곱이 폭발·소실로 이어지는 흐름을 그립니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 19,
    easy: R`
문장, 음성, 동영상은 길이가 제각각이고 순서가 중요합니다. 크기가 고정된 입력을 받는 MLP로는 다루기 어렵습니다. **순환 신경망**(RNN)은 원소를 하나씩 읽으며 지금까지 본 것을 은닉 상태 $h_t$에 요약하고, 그 상태와 다음 원소로 상태를 새로 고칩니다. 핵심은 **모든 시점이 같은 가중치**를 쓴다는 것이라, 시간 방향으로 펼치면 같은 칸이 복사된 긴 사슬이 됩니다.

펼친 사슬은 그냥 긴 계산 그래프이므로 학습은 보통의 역전파, 곧 **시간 역전파**(BPTT)입니다. 다만 같은 가중치가 여러 시점에서 쓰이므로, 가중치를 바꾸면 그 영향이 여러 경로로 손실에 닿습니다. 수업 필기는 이것을 시점 둘짜리 RNN에서 손으로 풀었고(Quiz 2 범위), 그 결과는 “경로마다 연쇄법칙의 곱을 쓰고 더하기”입니다. $W$의 기울기는 세 항이고, 셋째 항이 시간을 가로지르는 경로입니다.

시점이 많아지면 같은 계산을 출력에서부터 한 칸씩 거슬러 내려가는 **역방향 점화식**으로 합니다. 이때 먼 과거의 기울기는 한 걸음 야코비안을 여러 번 곱한 값이 되고, 그 크기는 대략 $(\gamma\lVert W\rVert)^{\text{걸음 수}}$입니다. 1보다 크면 **폭발**(기울기를 잘라내 해결), 1보다 작으면 **소실**입니다. 소실은 더 조용하고 더 큰 문제라, 20단원의 LSTM이 이를 고칩니다.`,
    easyEn: R`
Sentences, speech, and videos vary in length and depend on order. An MLP, which takes inputs of fixed size, handles them poorly. A **recurrent neural network** (RNN) reads the elements one at a time, summarizes what it has seen so far in the hidden state $h_t$, and updates that state with the next element. The key is that **every step uses the same weights**, so unrolled along time it becomes a long chain of copies of the same cell.

The unrolled chain is just a long computational graph, so training is ordinary backpropagation, called **backpropagation through time** (BPTT). But since the same weight is used at several steps, changing it affects the loss along several paths. The class notes worked this out by hand for an RNN with two steps (the Quiz 2 material), and the result is “write the chain-rule product along each path and add”. The gradient of $W$ has three terms, and the third is the path across time.

With many steps the same computation is done by a **backward recursion** that walks down one step at a time from the output. The gradient for a distant past step then becomes a product of many one-step Jacobians, of size roughly $(\gamma\lVert W\rVert)^{\text{steps}}$. Above 1 it **explodes** (fixed by clipping the gradient); below 1 it **vanishes**. Vanishing is quieter and the bigger problem, and the LSTM of Unit 20 fixes it.`,
    nodes: [
      { id: 'seq', role: 'q', k: '19.1', t: R`길이가 제각각인 순서열`, en: R`Sequences of varying length`,
        d: R`입출력 가운데 어느 쪽이 순서열인지에 따라 one to many, many to one, 두 가지 many to many로 나뉩니다. MLP는 길이가 고정되고 위치마다 가중치가 달라 맞지 않습니다.`,
        dEn: R`Depending on which of input and output is a sequence, there are one to many, many to one, and two kinds of many to many. An MLP has a fixed length and different weights per position, so it does not fit.` },
      { id: 'vanilla', role: 'def', k: '19.2', t: R`바닐라 RNN과 펼친 그래프`, en: R`Vanilla RNN, unrolled`,
        d: R`$h_t=\sigma(Uh_{t-1}+Wx_t+b)$, $\hat y_t=W^{out}h_t$, $h_0=0$. 펼치면 모든 시점이 같은 $U,W,W^{out}$을 쓰는 사슬이고, 매개변수 수는 길이와 무관합니다.`,
        dEn: R`$h_t=\sigma(Uh_{t-1}+Wx_t+b)$, $\hat y_t=W^{out}h_t$, $h_0=0$. Unrolled, it is a chain in which every step uses the same $U,W,W^{out}$, and the number of parameters does not depend on the length.` },
      { id: 'bptt', role: 'idea', k: '19.3', t: R`BPTT: 펼친 그래프의 역전파`, en: R`BPTT: backprop on the unrolled graph`,
        d: R`손실 $L=\sum_tL_t$을 순서열 전체로 앞으로 계산하고 거꾸로 기울기를 구합니다. 공유된 가중치의 기울기는 시점마다 온 기울기의 합입니다.`,
        dEn: R`Compute the loss $L=\sum_tL_t$ forward over the whole sequence and the gradient backward. The gradient of a shared weight is the sum of the gradients from each step.` },
      { id: 'tbptt', role: 'fix', k: '19.3', at: '**잘린 BPTT**', t: R`잘린 BPTT`, en: R`Truncated BPTT`,
        d: R`상태는 계속 앞으로 넘기되 역전파는 최근 $k$걸음에서만 합니다. 덩어리의 첫 상태는 0이 아닌 상수라, $h_0\ne0$인 항이 살아납니다.`,
        dEn: R`States keep moving forward, but backpropagation runs only over the last $k$ steps. The first state of a chunk is a nonzero constant, so the terms with $h_0\ne0$ come alive.` },
      { id: 'two', role: 'step', k: '19.4', t: R`두 단계를 손으로`, en: R`Two steps by hand`,
        d: R`$h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$. 국소 미분은 모두 $\tanh'=1-h^2$로 정리되고, 시간을 가로지르는 미분은 $\partial h_2/\partial h_1=(1-h_2^2)W$입니다.`,
        dEn: R`$h_t=\tanh(Wh_{t-1}+UX_t+b)$, $Y_t=Vh_t+c$. Every local derivative reduces to $\tanh'=1-h^2$, and the derivative across time is $\partial h_2/\partial h_1=(1-h_2^2)W$.` },
      { id: 'three', role: 'res', k: '19.4', at: ':::key 두 단계 RNN의 기울기', t: R`$W$의 세 경로`, en: R`Three paths of $W$`,
        d: R`$\partial L/\partial V=\sum(Y_t-Z_t)h_t$이고, $\partial L/\partial W$는 $L_1\leftarrow h_1$, $L_2\leftarrow h_2$, $L_2\leftarrow h_2\leftarrow h_1$의 세 항입니다. $\delta_t$로 묶으면 $\sum_t\delta_th_{t-1}$.`,
        dEn: R`$\partial L/\partial V=\sum(Y_t-Z_t)h_t$, and $\partial L/\partial W$ has three terms: $L_1\leftarrow h_1$, $L_2\leftarrow h_2$, $L_2\leftarrow h_2\leftarrow h_1$. Bundled with $\delta_t$ it is $\sum_t\delta_th_{t-1}$.` },
      { id: 'multi', role: 'step', k: '19.5', t: R`여러 단계: 슬라이드의 공식`, en: R`Many steps: the slides' formula`,
        d: R`$h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$이면 $\partial\mathcal L/\partial\tilde\theta=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}$이고, $\partial\mathcal L/\partial h_\ell$은 야코비안의 곱입니다.`,
        dEn: R`If $h_\ell=q_{\tilde\theta}(h_{\ell-1},u_\ell)$, then $\partial\mathcal L/\partial\tilde\theta=\sum_\ell\frac{\partial\mathcal L}{\partial h_\ell}\frac{\partial q}{\partial\tilde\theta}$, and $\partial\mathcal L/\partial h_\ell$ is a product of Jacobians.` },
      { id: 'rec', role: 'res', k: '19.5', at: ':::key 시간 역전파 (BPTT)', t: R`역방향 점화식`, en: R`The backward recursion`,
        d: R`$\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1}$, $\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t$, $\partial L/\partial W=\sum_t\boldsymbol\delta_th_{t-1}^T$. $T=2$이면 필기의 세 항입니다.`,
        dEn: R`$\mathbf g_t=V^T(Y_t-Z_t)+W^T\boldsymbol\delta_{t+1}$, $\boldsymbol\delta_t=\diag(1-h_t^2)\mathbf g_t$, $\partial L/\partial W=\sum_t\boldsymbol\delta_th_{t-1}^T$. For $T=2$ these are the three terms of the notes.` },
      { id: 'deep', role: 'lim', k: '19.6', t: R`아주 깊은 망`, en: R`An extremely deep network`,
        d: R`길이가 수백·수천이면 먼 시점의 기울기는 그만큼의 야코비안 곱이고, 크기는 많아야 $(\gamma\lVert W\rVert_2)^{L-\ell}$입니다.`,
        dEn: R`With lengths in the hundreds or thousands, the gradient for a distant step is a product of that many Jacobians, of size at most $(\gamma\lVert W\rVert_2)^{L-\ell}$.` },
      { id: 'clip', role: 'fix', k: '19.6', at: '**기울기 폭발과 잘라내기**', t: R`폭발 → 잘라내기`, en: R`Explosion → clipping`,
        d: R`$g\leftarrow\min(1,v/\lVert g\rVert)g$로 방향은 지키고 크기만 $v$ 이하로 묶습니다(슬라이드의 max는 min의 잘못).`,
        dEn: R`$g\leftarrow\min(1,v/\lVert g\rVert)g$ keeps the direction and only bounds the size by $v$ (the slide's max is a slip for min).` },
      { id: 'vanish', role: 'lim', k: '19.6', at: '**기울기 소실**', t: R`소실 → LSTM으로`, en: R`Vanishing → on to the LSTM`,
        d: R`먼 시점의 신호가 사라져 그때의 입력을 기억하도록 배울 수 없습니다. 조용해서 더 큰 문제이고, 20단원의 LSTM이 셀 상태의 길로 해결합니다.`,
        dEn: R`The signal from distant steps is lost, so the network cannot learn to remember those inputs. Being silent, it is the bigger problem, and the LSTM of Unit 20 solves it with the cell-state path.` },
    ],
    rows: [['seq'], ['vanilla'], ['bptt'], ['tbptt', 'two'], ['three'], ['multi'], ['rec'], ['deep'], ['clip', 'vanish']],
    edges: [
      ['seq', 'vanilla', R`같은 가중치로 되풀이`, R`repeat with the same weights`],
      ['vanilla', 'bptt', R`펼치면 계산 그래프`, R`unrolled: a graph`],
      ['bptt', 'tbptt', R`메모리를 아끼려면`, R`to save memory`],
      ['bptt', 'two', R`손으로 풀어 보면`, R`work it by hand`],
      ['two', 'three', R`경로마다 곱해 더하기`, R`multiply per path, add`],
      ['three', 'multi', R`시점을 늘리면`, R`more steps`],
      ['multi', 'rec', R`한 칸씩 거꾸로`, R`one step back at a time`],
      ['rec', 'deep', R`곱이 길어지면`, R`long products`],
      ['deep', 'clip', R`너무 크면`, R`too large`],
      ['deep', 'vanish', R`너무 작으면`, R`too small`],
    ],
  });
})();
