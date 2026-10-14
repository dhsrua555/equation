/* 논리 지도 — 16 CNN 아키텍처와 현저성 지도. ImageNet의 흐름을 따라 AlexNet에서 VGG로 온 뒤, 효율(GoogLeNet의 병목)과
   깊이(ResNet의 잔차 연결) 두 갈래로 나뉘고, 같은 역전파로 현저성 지도에 닿는 흐름을 그립니다. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 16,
    easy: R`
15단원의 부품(합성곱·풀링·완전연결)으로 실제 망을 어떻게 지을까요? 이 단원은 1000개 클래스의 사진을 분류하는 ImageNet 대회의 흐름을 따라갑니다. 2012년 **AlexNet**(8층)이 처음으로 CNN을 써서 top-5 오류를 25.8%에서 16.4%로 낮췄고, 그 뒤로 층이 깊어질수록 오류가 줄어 2015년 ResNet(152층)은 3.6%에 이르렀습니다.

각 망은 앞 망의 약점을 고칩니다. AlexNet의 크기를 공식으로 직접 세어 보면 매개변수의 94%가 마지막 완전연결층에 몰려 있고, ReLU·드롭아웃 같은 설계 선택이 그 성공을 도왔습니다. **VGG**는 $3\times3$ 필터를 깊게 쌓아 같은 시야(수용 영역)를 더 적은 매개변수로 얻습니다. **GoogLeNet**은 여러 크기의 필터를 나란히 쓰는 인셉션 모듈에 $1\times1$ 합성곱 **병목**을 넣어 모듈의 매개변수를 약 3분의 1로 줄입니다.

그런데 그냥 더 쌓으면 56층 망이 20층 망보다 훈련 오차부터 나빠집니다. 과적합이 아니라 최적화가 어려운 것입니다. **ResNet**은 블록의 출력을 $F(x)+x$로 두는 **잔차 연결**로 이를 풉니다. 블록의 야코비안이 $I+\partial F/\partial x$가 되어, 기울기가 지름길을 타고 곧장 아래층까지 내려갑니다.

마지막으로 망이 사진의 어디를 보고 판단했는지 묻습니다. 클래스 점수를 입력 화소로 미분한 $\partial S_c/\partial I$, 곧 화소를 조금 바꿀 때 점수가 얼마나 변하는지를 그린 것이 **현저성 지도**(saliency map)입니다. 학습 때와 같은 역전파를 입력까지 내려보내면 한 번에 계산됩니다.`,
    easyEn: R`
How do we build real networks from the parts of Unit 15 (convolution, pooling, fully connected layers)? This unit follows the ImageNet competition, where photos are classified into 1000 classes. In 2012 **AlexNet** (8 layers) was the first to use a CNN and cut the top-5 error from 25.8% to 16.4%; after that the error kept falling as networks grew deeper, until ResNet (152 layers) reached 3.6% in 2015.

Each network fixes a weakness of the one before. Counting AlexNet's sizes with the formulas shows that 94% of its parameters sit in the last fully connected layers, and design choices such as ReLU and dropout helped it succeed. **VGG** stacks $3\times3$ filters deeply to get the same field of view (receptive field) with fewer parameters. **GoogLeNet** puts filters of several sizes side by side in an inception module and adds a $1\times1$ convolution **bottleneck**, cutting the parameters of the module to about a third.

But simply stacking more layers makes a 56-layer network worse than a 20-layer one, starting with the training error. This is not overfitting: optimization has become hard. **ResNet** solves it with **residual connections** that make a block output $F(x)+x$. The Jacobian of a block becomes $I+\partial F/\partial x$, so the gradient takes a shortcut straight down to the lower layers.

Finally we ask where in the photo the network looked when it decided. The **saliency map** draws $\partial S_c/\partial I$, the class score differentiated with respect to the input pixels: how much the score changes when a pixel changes a little. Running the same backpropagation as in training all the way down to the input computes it in one pass.`,
    nodes: [
      { id: 'imgnet', role: 'q', k: '16.1', t: R`깊을수록 좋아질까?`, en: R`Does deeper mean better?`,
        d: R`분류 CNN은 특성 학습과 분류의 두 단계입니다. ImageNet top-5 오류는 AlexNet(8층)의 16.4%부터 층이 늘수록 줄었습니다. 더 쌓으면 계속 좋아질까요?`,
        dEn: R`A classification CNN has two stages, feature learning and classification. The ImageNet top-5 error fell from AlexNet's 16.4% (8 layers) as layers were added. Does stacking more keep helping?` },
      { id: 'alex', role: 'app', k: '16.2', t: R`AlexNet: 크기와 매개변수`, en: R`AlexNet: sizes and parameters`,
        d: R`15단원의 출력 크기 공식으로 $227\to55\to27\to13\to6$을 차례로 계산합니다. 매개변수 약 6천만 개 중 94%가 마지막 완전연결 세 층에 있습니다.`,
        dEn: R`The output-size formula of Unit 15 gives $227\to55\to27\to13\to6$ step by step. Of about 60 million parameters, 94% sit in the last three fully connected layers.` },
      { id: 'design', role: 'fix', k: '16.3', t: R`ReLU·보폭 4·드롭아웃`, en: R`ReLU, stride 4, dropout`,
        d: R`포화하는 시그모이드 대신 ReLU로 기울기를 살리고, 첫 층의 보폭 4로 계산을 아끼고, 매개변수의 94%가 모인 완전연결층에는 드롭아웃 0.5로 과적합을 막습니다.`,
        dEn: R`ReLU keeps the gradient alive where the sigmoid saturates, stride 4 in the first layer saves computation, and dropout 0.5 guards against overfitting in the fully connected layers that hold 94% of the parameters.` },
      { id: 'vgg', role: 'idea', k: '16.4', t: R`VGG: $3\times3$을 깊게`, en: R`VGG: stacked $3\times3$`,
        d: R`ZFNet은 AlexNet의 첫 층을 다듬었고, VGG는 $3\times3$ 층만 쌓습니다. 두 층이면 $5\times5$를 보면서 가중치는 $18C^2<25C^2$이고, ReLU는 하나 더 들어갑니다.`,
        dEn: R`ZFNet tuned AlexNet's first layer, and VGG stacks only $3\times3$ layers. Two of them see a $5\times5$ field with $18C^2<25C^2$ weights and one more ReLU.` },
      { id: 'incep', role: 'def', k: '16.5', t: R`인셉션 모듈`, en: R`The inception module`,
        d: R`GoogLeNet(22층)의 부품입니다. $1\times1$, $3\times3$, $5\times5$ 합성곱과 최대 풀링을 나란히 쓰고, 결과를 깊이 방향으로 이어 붙입니다.`,
        dEn: R`The building block of GoogLeNet (22 layers). Use $1\times1$, $3\times3$, $5\times5$ convolutions and max pooling side by side, and concatenate the results along the depth.` },
      { id: 'naive', role: 'lim', k: '16.5', at: '**단순한 인셉션 모듈의 크기**', t: R`채널이 쌓인다`, en: R`Channels pile up`,
        d: R`$28\times28\times256$ 입력에서 출력은 $28\times28\times672$, 가중치는 약 109만 개입니다. 풀링 갈래가 256채널을 그대로 내보내 모듈마다 채널이 쌓입니다.`,
        dEn: R`From a $28\times28\times256$ input the output is $28\times28\times672$, with about 1.09 million weights. The pooling branch passes all 256 channels through, so channels pile up module after module.` },
      { id: 'bneck', role: 'fix', k: '16.5', at: '**$1\\times1$ 합성곱으로 차원 줄이기**', t: R`$1\times1$ 병목`, en: R`The $1\times1$ bottleneck`,
        d: R`비싼 $3\times3$·$5\times5$ 앞과 풀링 뒤에 $1\times1$ 합성곱(64)을 두어 채널을 줄입니다. 출력은 480채널, 가중치는 346,112개로 단순 모듈의 약 32%입니다.`,
        dEn: R`Put $1\times1$ convolutions (64) before the expensive $3\times3$ and $5\times5$ and after the pooling to cut the channels. The output has 480 channels and 346,112 weights, about 32% of the naive module.` },
      { id: 'degrade', role: 'lim', k: '16.6', t: R`깊으면 오히려 나빠진다`, en: R`Deeper plain nets do worse`,
        d: R`56층 단순 망은 20층보다 훈련 오차부터 높습니다. 과적합이 아니라 최적화 문제이고, 야코비안이 곱해지며 기울기가 소실되는 것이 잠재적 원인입니다.`,
        dEn: R`A 56-layer plain net has a higher error than a 20-layer one, even on the training data. This is not overfitting but an optimization problem; a likely cause is the gradient vanishing as Jacobians are multiplied.` },
      { id: 'resid', role: 'fix', k: '16.6', at: '**잔차 연결**', t: R`잔차 연결 $F(x)+x$`, en: R`Residual connection $F(x)+x$`,
        d: R`층들은 $F(x)=H(x)-x$만 배우고 입력을 지름길로 더합니다. $F=0$이면 항등사상이라, 깊은 망이 적어도 얕은 망만큼은 할 수 있게 됩니다.`,
        dEn: R`The layers learn only $F(x)=H(x)-x$, and the input is added back through a shortcut. With $F=0$ the block is the identity, so a deep net can do at least as well as a shallow one.` },
      { id: 'grad', role: 'res', k: '16.6', at: ':::key 잔차 연결', t: R`기울기의 지름길 $I+\partial F/\partial\mathbf h$`, en: R`Gradient shortcut $I+\partial F/\partial\mathbf h$`,
        d: R`블록의 야코비안이 $I+\partial F/\partial\mathbf h$라, 곱을 전개하면 위층 기울기가 그대로 내려오는 항이 남습니다. 잔차망은 깊을수록 좋아져 152층에서 top-5 3.6%를 얻었습니다.`,
        dEn: R`A block's Jacobian is $I+\partial F/\partial\mathbf h$, so expanding the product leaves a term that carries the upper gradient down unchanged. Residual nets improve with depth and reached a top-5 error of 3.6% at 152 layers.` },
      { id: 'sal', role: 'app', k: '16.7', t: R`현저성 지도 $\partial S_c/\partial I$`, en: R`Saliency map $\partial S_c/\partial I$`,
        d: R`망이 사진의 어디를 보았는지 묻습니다. 가중치는 고정하고 클래스 점수를 입력 화소까지 역전파하면, 1차 테일러 전개의 계수인 화소별 민감도가 나옵니다.`,
        dEn: R`Ask where in the photo the network looked. Keep the weights fixed and backpropagate the class score down to the input pixels: the result is each pixel's sensitivity, the coefficient of the first-order Taylor expansion.` },
    ],
    rows: [['imgnet'], ['alex'], ['design', 'vgg'], ['incep', 'degrade'], ['naive', 'resid'], ['bneck', 'grad'], ['sal']],
    edges: [
      ['imgnet', 'alex', R`처음 쓴 CNN`, R`the first CNN`],
      ['alex', 'design', R`왜 잘 됐나`, R`why it worked`],
      ['alex', 'vgg', R`필터를 작게·깊게`, R`smaller filters, deeper`],
      ['vgg', 'incep', R`넓고 효율적으로`, R`wider, cheaper`],
      ['vgg', 'degrade', R`더 깊게 쌓으면?`, R`even deeper?`],
      ['incep', 'naive', R`그대로 이어 붙이면`, R`concatenate as is`],
      ['naive', 'bneck', R`채널부터 줄이기`, R`shrink channels first`],
      ['degrade', 'resid', R`항등사상을 쉽게`, R`make identity easy`],
      ['resid', 'grad', R`기울기는?`, R`and the gradient?`],
      ['grad', 'sal', R`입력까지 미분하면`, R`down to the input`],
    ],
  });
})();
