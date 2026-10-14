/* 논리 지도 — 08 신경망의 기초. 단원 첫머리의 쉬운 요약(easy)과 생각의 흐름을 그린 지도(nodes·rows·edges).
   “층 = 행렬곱 + 비선형 함수” → 왜 비선형인가 → XOR와 은닉층 → 비선형 임베딩 → MLP의 순서입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 8,
    easy: R`
사진 한 장을 보고 고양이인지 개인지 맞히는 일을 생각해 봅시다. 컴퓨터에게 사진은 화소 값을 늘어놓은 긴 숫자 목록($32\times32$ 컬러 사진이면 3072개)일 뿐이므로, 필요한 것은 ‘숫자 목록을 넣으면 클래스를 내놓는 함수’입니다. 이 단원은 그런 함수를 자료로부터 배우는 **신경망**(neural network)이 어떤 모양이고, 왜 그런 모양이어야 하는지에 답합니다.

신경망은 **행렬곱과 활성화 함수를 번갈아 이어 붙인 함수**입니다: $f(x)=W_2\max(0,W_1x)$. 행렬곱은 직선을 직선으로 보내는 변환이라, 활성화 없이 층을 아무리 쌓아도 결국 행렬 하나(아핀함수 하나)와 같아집니다. 그래서 층 사이에 시그모이드, tanh, ReLU $\max(0,z)$처럼 그래프를 ‘꺾는’ 함수를 끼우고, 분류라면 마지막에 소프트맥스(softmax)를 붙여 점수를 확률로 바꿉니다.

층이 하나뿐인 **퍼셉트론**(perceptron)은 (활성화가 단조 함수이면) 경계를 직선으로밖에 긋지 못해, “둘 중 하나만 참이면 1”인 **XOR**조차 풀지 못합니다. 그런데 ReLU 은닉 유닛 두 개를 넣으면 XOR를 정확히 계산할 수 있습니다. 은닉층이 점들을 새 좌표로 옮겨 놓아, 거기서는 직선 하나로 갈라지기 때문입니다. 이것이 이 단원의 중심 생각인 **비선형 임베딩**(nonlinear embedding)이고, 층을 깊게 쌓으면 가장자리 → 부분 → 전체처럼 점점 추상적인 특징을 배웁니다.

끝으로 이 모두를 **다층 퍼셉트론**(MLP) $y_\ell=\sigma(W_\ell y_{\ell-1}+b_\ell)$으로 정리하고 파라미터 수를 셉니다. CIFAR10용 예에서는 약 620만 개 가운데 첫 층이 76%를 차지해, 이미지에는 완전연결층이 비효율적이라는 한계가 드러나고 이것이 합성곱 신경망(CNN)으로 이어집니다. 이 많은 가중치를 자료에 맞추는 방법은 9단원(역전파)과 10단원(SGD)에서 다룹니다.`,
    easyEn: R`
Think of looking at a photo and telling whether it shows a cat or a dog. To a computer a photo is just a long list of pixel values (3072 numbers for a $32\times32$ color image), so what we need is “a function that takes a list of numbers and returns a class”. This unit answers what a **neural network**, which learns such a function from data, looks like, and why it must look that way.

A neural network is **a function that alternates matrix products and activation functions**: $f(x)=W_2\max(0,W_1x)$. A matrix product sends lines to lines, so without activations any number of stacked layers is still a single matrix (a single affine function). That is why we insert functions that “bend” the graph, such as the sigmoid, tanh, or ReLU $\max(0,z)$, between the layers, and for classification we attach a softmax at the end to turn scores into probabilities.

A **perceptron** with a single layer can only draw a straight boundary (when its activation is monotone), so it cannot solve even **XOR**, “1 if exactly one of the two is true”. Yet with two ReLU hidden units the network computes XOR exactly, because the hidden layer moves the points to new coordinates where a single line separates them. This is the central idea of the unit, the **nonlinear embedding**; stacking layers deeper, the network learns more and more abstract features, from edges to parts to wholes.

Finally everything is written as the **multilayer perceptron** (MLP) $y_\ell=\sigma(W_\ell y_{\ell-1}+b_\ell)$, and we count its parameters. In the CIFAR10 example the first layer holds 76% of about 6.2 million parameters, which exposes a limit (fully connected layers are inefficient for images) that leads to convolutional networks (CNNs). How to fit all these weights to the data is the subject of Unit 9 (backpropagation) and Unit 10 (SGD).`,
    nodes: [
      { id: 'cls', role: 'q', k: '8.1', t: R`분류 함수를 자료로`, en: R`Learn a classifier from data`,
        d: R`분류는 입력을 클래스 하나로 보내는 함수 $f(x;W)$입니다. 딥러닝은 특징과 분류기를 손으로 짜지 않고 자료로 함께 배웁니다(종단간). 그 함수의 모양이 이 단원의 질문입니다.`,
        dEn: R`Classification is a function $f(x;W)$ sending an input to one class. Deep learning learns the features and the classifier together from data (end to end) instead of designing them by hand; what this function looks like is the unit's question.` },
      { id: 'net', role: 'def', k: '8.2', t: R`신경망 = 행렬곱 + 활성화`, en: R`Network = linear + activation`,
        d: R`행렬곱 사이에 비선형 활성화를 끼운 함수 $f(x)=W_2\max(0,W_1x)$입니다. 행렬곱 한 번은 뉴런 여러 개가 동시에 가중합을 계산하는 것입니다.`,
        dEn: R`A function with nonlinear activations between matrix products, $f(x)=W_2\max(0,W_1x)$. One matrix product is many neurons computing their weighted sums at the same time.` },
      { id: 'collapse', role: 'res', k: '8.2', at: ':::key 선형층의 합성은 선형', t: R`활성화 없으면 아핀 하나`, en: R`No activation: one affine map`,
        d: R`활성화를 빼면 $W_2(W_1x+b_1)+b_2$가 아핀함수 하나가 되어, 층을 쌓아도 표현력이 늘지 않습니다. 그래서 비선형성이 핵심입니다.`,
        dEn: R`Without activations, $W_2(W_1x+b_1)+b_2$ is a single affine function, so stacking layers adds no expressive power. This is why the nonlinearity is the key.` },
      { id: 'act', role: 'tool', k: '8.3', t: R`활성화 함수·순방향 계산`, en: R`Activations and a forward pass`,
        d: R`시그모이드·tanh·ReLU 같은 꺾는 함수들과 점수를 확률로 바꾸는 소프트맥스를 갖추고, 작은 신경망의 출력을 손으로 계산해 봅니다.`,
        dEn: R`The menu of bending functions (sigmoid, tanh, ReLU, …) and the softmax that turns scores into probabilities; with them we compute a small network's output by hand.` },
      { id: 'xor', role: 'lim', k: '8.4', t: R`한 층의 한계: XOR`, en: R`One layer's limit: XOR`,
        d: R`퍼셉트론 $g(w^Tx+b)$는 $g$가 단조이면 결정 경계가 직선입니다. XOR 자료는 어떤 직선으로도 나눌 수 없으므로 한 층으로는 풀 수 없습니다.`,
        dEn: R`A perceptron $g(w^Tx+b)$ has a straight-line decision boundary when $g$ is monotone. No line separates the XOR data, so one layer cannot solve it.` },
      { id: 'xorfix', role: 'fix', k: '8.4', at: '**신경망이 XOR를 계산함.**', t: R`은닉층 하나로 XOR`, en: R`One hidden layer computes XOR`,
        d: R`$s=x_1+x_2$일 때 $\max(0,s)-2\max(0,s-1)$은 XOR를 정확히 계산합니다. 은닉 유닛이 점들을 새 좌표로 옮기자 직선 하나로 갈라집니다.`,
        dEn: R`With $s=x_1+x_2$, $\max(0,s)-2\max(0,s-1)$ computes XOR exactly. The hidden units move the points to new coordinates where a single line splits them.` },
      { id: 'embed', role: 'res', k: '8.5', t: R`은닉층 = 비선형 임베딩`, en: R`Hidden layer = nonlinear embedding`,
        d: R`XOR에서 본 일을 일반화합니다. 은닉층은 자료를 선형 분리 가능한 공간으로 옮기는 사상을 학습하고, 출력층은 그 공간의 선형 분류기일 뿐입니다.`,
        dEn: R`This generalizes what XOR showed: a hidden layer learns a map into a linearly separable space, and the output layer is just a linear classifier in that space.` },
      { id: 'deep', role: 'view', k: '8.5', at: '**인식 관점.**', t: R`깊이: 추상화의 위계`, en: R`Depth: levels of abstraction`,
        d: R`깊은 신경망은 가장자리 → 부분 → 전체로 특징을 쌓습니다. 은닉층 하나로도 근사는 되지만(보편 근사), 깊으면 뉴런이 기하급수적으로 적게 드는 경우가 있습니다.`,
        dEn: R`A deep network builds features from edges to parts to wholes. One hidden layer can already approximate (universal approximation), but depth sometimes needs exponentially fewer neurons.` },
      { id: 'mlp', role: 'def', k: '8.6', t: R`MLP의 식과 파라미터 수`, en: R`The MLP and its parameter count`,
        d: R`지금까지를 $y_\ell=\sigma(W_\ell y_{\ell-1}+b_\ell)$로 정리합니다. $W_\ell$은 (출력 수)×(입력 수) 크기이고, 파라미터 수는 $\sum_\ell(n_{\ell-1}+1)n_\ell$입니다.`,
        dEn: R`Everything so far written as $y_\ell=\sigma(W_\ell y_{\ell-1}+b_\ell)$. $W_\ell$ has size (outputs) × (inputs), and the number of parameters is $\sum_\ell(n_{\ell-1}+1)n_\ell$.` },
      { id: 'cnn', role: 'lim', k: '8.6', at: '### 더 깊이: 왜 합성곱인가', t: R`완전연결의 한계 → CNN`, en: R`Limit of full connection → CNN`,
        d: R`CIFAR10용 MLP는 첫 층이 파라미터의 76%입니다. 완전연결층은 국소성·평행이동 불변성을 쓰지 못해, 가중치를 공유하는 합성곱층(CNN)으로 이어집니다.`,
        dEn: R`In the CIFAR10 MLP the first layer holds 76% of the parameters. Fully connected layers cannot use locality or translation invariance, which leads to convolutional layers that share weights (CNNs).` },
    ],
    rows: [['cls'], ['net'], ['collapse', 'act'], ['xor'], ['xorfix'], ['embed'], ['deep', 'mlp'], [null, 'cnn']],
    edges: [
      ['cls', 'net', R`어떤 함수로?`, R`which function?`],
      ['net', 'collapse', R`활성화를 빼면?`, R`drop the activations?`],
      ['net', 'act', R`어떤 활성화?`, R`which activations?`],
      ['collapse', 'xor', R`한 층이면 충분?`, R`is one layer enough?`],
      ['act', 'xor'],
      ['xor', 'xorfix', R`은닉층을 넣으면`, R`add a hidden layer`],
      ['xorfix', 'embed', R`일반화하면`, R`in general`],
      ['embed', 'deep', R`깊게 쌓으면`, R`stack deeper`],
      ['embed', 'mlp', R`식으로 쓰면`, R`as formulas`],
      ['mlp', 'cnn', R`이미지라면?`, R`for images?`],
    ],
  });
})();
