/* 논리 지도 — 09 역전파. 단원 첫머리의 쉬운 요약(easy)과 생각의 흐름을 그린 지도(nodes·rows·edges).
   기울기가 필요하다 → 계산 그래프와 “상류 × 국소” → 뉴런·게이트·벡터 → MLP 점화식 → 소실·폭발의 순서입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 9,
    easy: R`
8단원의 신경망은 가중치가 수백만 개에 이를 수 있습니다. 경사하강법으로 이들을 고치려면 손실을 줄이기 위해 각 가중치를 어느 쪽으로 얼마나 움직여야 하는지, 곧 손실의 **기울기**(gradient)를 모든 가중치에 대해 알아야 합니다. 가중치를 하나씩 살짝 흔들어 재는 방법은 가중치 수의 두 배만큼 순전파를 돌려야 해서 너무 느리고, 구조가 바뀔 때마다 미분식을 손으로 유도할 수도 없습니다.

해법은 계산을 덧셈·곱셈 같은 작은 조각(노드)으로 쪼갠 **계산 그래프**(computational graph)입니다. 연쇄법칙에 따르면 변화율은 곱해지므로, 출력에서 1을 출발시켜 노드마다 “뒤에서 들어온 기울기(상류) × 그 노드의 미분(국소)”을 곱해 입력 쪽으로 넘기면 됩니다. 이것이 **역전파**(backpropagation)이고, 순전파 한 번과 역전파 한 번으로 모든 기울기가 한꺼번에 나옵니다. 덧셈은 기울기를 나눠 주고, 곱셈은 상대 입력을 곱해 주고, 여러 곳에 쓰인 변수는 돌아온 기울기를 더한다는 몇 가지 규칙만 알면 대부분의 그래프를 눈으로 따라갈 수 있습니다.

입력과 출력이 벡터여도 원리는 같습니다. 신경망에 늘 나오는 행렬곱 $z=Wx$는 상류 기울기 $\delta$에 대해 $\partial L/\partial x=W^T\delta$, $\partial L/\partial W=\delta x^T$라는 짧은 공식으로 끝납니다. 이를 층마다 되풀이한 것이 다층 퍼셉트론의 **역전파 점화식** $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$이고, 마지막에는 작은 신경망의 모든 기울기를 손으로 끝까지 계산해 봅니다.

점화식을 펼쳐 보면 층마다 $W^T$와 활성화의 미분이 계속 곱해집니다. 그래서 깊은 신경망에서는 기울기가 거의 사라지거나(소실) 터질(폭발) 수 있고, 이를 막는 장치인 ReLU(10단원), 초기화(11단원), 배치 정규화(12단원)로 이야기가 이어집니다.`,
    easyEn: R`
The networks of Unit 8 can have millions of weights. To fix them with gradient descent we must know, for every weight, which way and how far to move it to lower the loss: the **gradient** of the loss. Nudging the weights one at a time costs twice as many forward passes as there are weights, which is far too slow, and we cannot derive the formulas by hand every time the architecture changes.

The way out is the **computational graph**: the computation broken into small pieces (nodes) such as additions and multiplications. By the chain rule, rates of change multiply, so we start from 1 at the output and, at every node, multiply “the gradient coming from behind (upstream) × the node's own derivative (local)” and pass it on toward the inputs. This is **backpropagation**, and one forward pass plus one backward pass yields every gradient at once. A few rules (addition hands the gradient out, multiplication multiplies by the other input, a variable used in several places adds up the gradients that come back) let you follow most graphs by eye.

The principle stays the same when inputs and outputs are vectors. For the matrix product $z=Wx$ that appears everywhere in networks, an upstream gradient $\delta$ gives the short formulas $\partial L/\partial x=W^T\delta$ and $\partial L/\partial W=\delta x^T$. Repeating them layer by layer gives the **backpropagation recursion** of the multilayer perceptron, $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$, and at the end we compute every gradient of a small network by hand.

Unrolling the recursion shows a $W^T$ and an activation derivative multiplied in at every layer. So in deep networks the gradient can nearly disappear (vanish) or blow up (explode), and the story continues with the devices that prevent this: ReLU (Unit 10), initialization (Unit 11), and batch normalization (Unit 12).`,
    nodes: [
      { id: 'need', role: 'q', k: '9.1', t: R`모든 가중치의 기울기`, en: R`The gradient of every weight`,
        d: R`경사하강법 $\theta\leftarrow\theta-\alpha\nabla\mathcal L$에는 모든 파라미터의 기울기가 필요합니다. 구조가 바뀔 때마다 손으로 유도할 수는 없으니 기계적인 계산법이 필요합니다.`,
        dEn: R`Gradient descent $\theta\leftarrow\theta-\alpha\nabla\mathcal L$ needs the gradient for every parameter. We cannot derive it by hand whenever the architecture changes, so we need a mechanical method.` },
      { id: 'numdiff', role: 'alt', k: '9.1', at: '### 더 깊이: 수치 미분과의 비교', t: R`수치 미분은 너무 느리다`, en: R`Numerical derivatives: too slow`,
        d: R`하나씩 흔들어 재면 파라미터 $P$개에 순전파가 $2P$번 듭니다. 역전파는 순전파·역전파 한 번씩으로 모든 기울기를 주므로, 수치 미분은 기울기 검사에만 씁니다.`,
        dEn: R`Nudging each parameter costs $2P$ forward passes for $P$ parameters. Backpropagation gives every gradient with one forward and one backward pass, so numerical derivatives are used only for gradient checking.` },
      { id: 'graph', role: 'def', k: '9.2', t: R`계산 그래프`, en: R`The computational graph`,
        d: R`계산을 작은 노드로 쪼갭니다. $f=(x+y)z$를 앞으로 계산해 값을 저장하고, 끝의 $\partial f/\partial f=1$에서 거꾸로 기울기를 구하면 직접 미분한 값과 같습니다.`,
        dEn: R`Break the computation into small nodes. Compute $f=(x+y)z$ forward, store the values, and run the gradients backward from $\partial f/\partial f=1$: they agree with direct differentiation.` },
      { id: 'chain', role: 'res', k: '9.2', at: ':::key 연쇄법칙', t: R`하류 = 상류 × 국소`, en: R`Downstream = upstream × local`,
        d: R`이 단원의 핵심 규칙입니다. 각 노드는 자기 국소 기울기만 알면 되고, 한 변수가 여러 곳으로 흐르면 경로별 기울기를 더합니다.`,
        dEn: R`The key rule of the unit. Each node only needs its own local gradient, and when a variable flows into several places, the gradients along the paths are added.` },
      { id: 'sig', role: 'ex', k: '9.3', t: R`시그모이드 뉴런 손으로`, en: R`A sigmoid neuron by hand`,
        d: R`뉴런을 곱셈·덧셈·$\exp$·$1/x$ 같은 작은 노드로 쪼개 1.00에서 거꾸로 곱해 갑니다. 네 노드를 시그모이드 게이트로 묶으면 $\sigma'=\sigma(1-\sigma)$ 한 번으로 같은 0.20이 나옵니다.`,
        dEn: R`Split the neuron into small nodes such as product, sum, $\exp$ and $1/x$, and multiply backward from 1.00. Grouping four nodes into one sigmoid gate gives the same 0.20 at once from $\sigma'=\sigma(1-\sigma)$.` },
      { id: 'rules', role: 'tool', k: '9.4', t: R`게이트 네 가지 규칙`, en: R`Four gate rules`,
        d: R`덧셈은 기울기를 나눠 주고, 곱셈은 상대 입력을 곱해 맞바꾸고, 복사는 더하고, 최댓값은 큰 쪽으로만 보냅니다. 다음 절 행렬 공식의 재료입니다.`,
        dEn: R`Addition distributes the gradient, multiplication swaps in the other input, a copy adds, and max routes it to the larger input. These are the ingredients of the next section's matrix formulas.` },
      { id: 'vec', role: 'step', k: '9.5', t: R`벡터: $W^T\delta$와 $\delta x^T$`, en: R`Vectors: $W^T\delta$ and $\delta x^T$`,
        d: R`국소 미분이 야코비안이 되지만 실제로 만들지는 않습니다. 성분별 함수는 성분별 곱으로, $z=Wx$는 $\partial L/\partial x=W^T\delta$, $\partial L/\partial W=\delta x^T$로 끝납니다.`,
        dEn: R`The local derivative becomes a Jacobian, but it is never built. An elementwise function becomes a componentwise product, and $z=Wx$ gives $\partial L/\partial x=W^T\delta$ and $\partial L/\partial W=\delta x^T$.` },
      { id: 'mlp', role: 'res', k: '9.6', t: R`MLP 역전파 점화식`, en: R`The MLP backprop recursion`,
        d: R`두 규칙을 층마다 번갈아 쓰면 $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$, $\partial L/\partial W_\ell=\delta_\ell h_{\ell-1}^T$. 비용은 순전파와 같은 차수입니다.`,
        dEn: R`Alternating the two rules layer by layer gives $\delta_\ell=\sigma'(a_\ell)\odot(W_{\ell+1}^T\delta_{\ell+1})$ and $\partial L/\partial W_\ell=\delta_\ell h_{\ell-1}^T$, at the same order of cost as the forward pass.` },
      { id: 'hand', role: 'ex', k: '9.6', at: ':::ex 예제 5', t: R`2-2-1 신경망 끝까지`, en: R`A 2-2-1 network by hand`,
        d: R`순전파 → $\delta_2=y-t$ → $\delta_1$ → 모든 가중치 기울기를 손으로 구하고, 가중치 하나를 조금 바꿔 확인합니다. 꺼진 뉴런의 행은 기울기가 0입니다.`,
        dEn: R`Forward pass → $\delta_2=y-t$ → $\delta_1$ → every weight gradient by hand, then a check by nudging one weight. The row of the neuron that is off gets a zero gradient.` },
      { id: 'vanish', role: 'lim', k: '9.6', at: '### 더 깊이: 기울기 소실과 폭발', t: R`기울기 소실과 폭발`, en: R`Vanishing, exploding gradients`,
        d: R`층마다 $W^T$와 $\sigma'$이 곱해지므로, 시그모이드($\sigma'\le\frac14$)로 깊게 쌓으면 기울기가 사라지고 가중치가 크면 폭발합니다. 10–12단원이 이를 다룹니다.`,
        dEn: R`Every layer multiplies in a $W^T$ and a $\sigma'$, so a deep sigmoid stack ($\sigma'\le\frac14$) makes the gradient vanish, and large weights make it explode. Units 10–12 deal with this.` },
    ],
    rows: [['need'], ['numdiff', 'graph'], ['chain'], ['sig', 'rules'], [null, 'vec'], ['mlp'], ['hand', 'vanish']],
    edges: [
      ['need', 'numdiff', R`하나씩 흔들면?`, R`nudge each weight?`],
      ['need', 'graph', R`작게 쪼개면`, R`split into nodes`],
      ['graph', 'chain', R`한 줄 규칙으로`, R`the one-line rule`],
      ['chain', 'sig', R`뉴런 하나에`, R`on one neuron`],
      ['chain', 'rules', R`자주 쓰는 노드`, R`common nodes`],
      ['rules', 'vec', R`행렬 버전`, R`matrix version`],
      ['vec', 'mlp', R`층마다 반복`, R`repeat per layer`],
      ['mlp', 'hand', R`손으로 끝까지`, R`all by hand`],
      ['mlp', 'vanish', R`깊어지면?`, R`when it is deep?`],
    ],
  });
})();
