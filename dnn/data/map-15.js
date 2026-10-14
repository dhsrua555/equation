/* 논리 지도 — 15 합성곱 신경망의 기초. 완전연결층의 한계에서 국소 연결과 가중치 공유(합성곱)로 가고,
   합성곱층·출력 크기·풀링을 거쳐 이동 등변성에 이르는 흐름을 그립니다. 그리는 쪽은 core/app.js의 unitMap·secMarks입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 15,
    easy: R`
사진 한 장은 숫자 수천에서 수백만 개입니다. 지금까지의 신경망처럼 이것을 한 줄로 펴서 **완전연결층**(fully connected layer)에 넣으면 두 가지가 나쁩니다. 매개변수가 폭발하고($224\times224\times3$ 사진을 뉴런 1000개에 이으면 약 1.5억 개), 어느 화소가 어느 화소의 이웃인지, 그리고 고양이가 어디로 옮겨 가도 고양이라는 사실을 구조로 담지 못합니다.

해결책은 두 가지 가정을 구조에 넣는 것입니다. 뉴런이 가까운 몇 칸만 보게 하고(**국소 연결**), 모든 위치가 같은 가중치를 돌려 쓰게 합니다(**가중치 공유**). 그 결과가 작은 필터를 이미지 위에 미끄러뜨리며 곱해 더하는 **합성곱**(convolution)입니다. $3\times3$ 칸의 평균을 적는 이동 평균(흐림 필터)이 가장 쉬운 예이고, 가중치를 바꾸면 모서리나 획 같은 모양을 찾는 필터가 됩니다.

**합성곱층**은 입력의 깊이 전체로 뻗은 필터 여러 개로 활성화 맵 여러 장을 만듭니다. 매개변수는 $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$개로 이미지 크기와 무관하고, 출력의 가로·세로는 보폭과 패딩이 정하는 $N'=(N-K+2P)/S+1$입니다. **풀링**은 학습할 매개변수 없이 맵을 줄여, 창 안의 작은 위치 변화에는 출력이 거의 바뀌지 않게 합니다.

가중치 공유의 보상은 **이동 등변성**입니다. 입력을 옮긴 뒤 합성곱한 것과 합성곱한 뒤 옮긴 것이 같습니다: $f(g\cdot x)=g\cdot f(x)$. 합성곱(등변)에 풀링(불변에 가깝게)을 더하면 “어디인가”와 “무엇인가”에 모두 맞는 구조가 되고, 다음 단원은 이 부품으로 지은 실제 망들을 봅니다.`,
    easyEn: R`
A single photo is thousands to millions of numbers. Flattening it into one long row and feeding it to a **fully connected layer**, as our networks have done so far, is bad in two ways. The parameters explode (connecting a $224\times224\times3$ photo to 1000 neurons takes about 150 million), and the structure cannot express which pixel neighbors which, nor that a cat is still a cat wherever it moves.

The remedy is to build two assumptions into the structure. Let each neuron look at only a few nearby cells (**local connectivity**), and let every position reuse the same weights (**weight sharing**). The result is **convolution**: slide a small filter over the image, multiply, and add. The moving average, which writes down the mean of a $3\times3$ window (a blur filter), is the simplest example; change the weights and the filter detects shapes such as edges or strokes.

A **convolutional layer** makes several activation maps with several filters, each extending through the full depth of the input. Its parameter count $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$ does not depend on the image size, and the output width and height, set by stride and padding, are $N'=(N-K+2P)/S+1$. **Pooling** shrinks the maps without any parameters to learn, so that small shifts inside a window barely change the output.

The reward for weight sharing is **translation equivariance**. Shifting the input and then convolving gives the same as convolving and then shifting: $f(g\cdot x)=g\cdot f(x)$. Convolution (equivariant) plus pooling (nearly invariant) gives a structure suited both to “where is it?” and to “what is it?”, and the next unit looks at real networks built from these parts.`,
    nodes: [
      { id: 'fc', role: 'lim', k: '15.1', t: R`완전연결층의 한계`, en: R`Limits of fully connected layers`,
        d: R`이미지를 펴서 넣으면 매개변수가 $d_{\text{in}}d_{\text{out}}+d_{\text{out}}$개로 폭발하고, 이웃 관계와 이동 등변성이 사라집니다. 공간 구조를 어떻게 쓸까요?`,
        dEn: R`Feed it a flattened image and the parameters explode to $d_{\text{in}}d_{\text{out}}+d_{\text{out}}$, while neighbor relations and translation equivariance are lost. How can we use the spatial structure?` },
      { id: 'local', role: 'idea', k: '15.1', at: '**국소 연결층**', t: R`가까운 칸만 보기`, en: R`Look only at nearby pixels`,
        d: R`화소 값은 이웃끼리 서로 의존하므로(공간 구조) 은닉 뉴런을 작은 입력 조각(patch)에만 잇습니다. 여기에 ‘모든 조각에 같은 가중치’를 더하면 합성곱이 됩니다.`,
        dEn: R`Pixel values depend on their neighbors (that is the spatial structure), so connect each hidden neuron to a small input patch only. Add “the same weights for every patch” and you get convolution.` },
      { id: 'movavg', role: 'ex', k: '15.2', t: R`이동 평균`, en: R`The moving average`,
        d: R`$3\times3$ 창의 평균을 한 칸씩 옮기며 적으면 경계가 번지고 구멍이 메워지는 흐림 필터가 됩니다. 합성곱의 가장 쉬운 예입니다.`,
        dEn: R`Write down the mean of a $3\times3$ window, sliding it one cell at a time: edges spread and holes fill in, a blur filter. It is the simplest example of convolution.` },
      { id: 'filter', role: 'def', k: '15.2', at: '**일반 필터.**', t: R`필터링 = 합성곱`, en: R`Filtering = convolution`,
        d: R`평균의 $\frac19$을 칸마다 다른 $w[i,j]$로 바꾼 $G[x,y]=\sum w[i,j]F[x+i,y+j]$입니다. 같은 필터를 모든 위치에 쓰고, 필터의 모양이 찾을 모양을 정합니다.`,
        dEn: R`Replace the averaging weight $\frac19$ by cell-dependent weights $w[i,j]$: $G[x,y]=\sum w[i,j]F[x+i,y+j]$. The same filter is used at every position, and its shape decides which pattern it detects.` },
      { id: 'layer', role: 'def', k: '15.3', t: R`합성곱층과 활성화 맵`, en: R`Conv layer and activation maps`,
        d: R`필터는 입력의 깊이 전체로 뻗고, 필터 하나가 활성화 맵 한 장을 만듭니다. 매개변수 $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$은 이미지 크기 $N$과 무관합니다.`,
        dEn: R`Each filter extends through the full depth of the input, and one filter makes one activation map. The parameter count $K^2C_{\text{in}}C_{\text{out}}+C_{\text{out}}$ does not depend on the image size $N$.` },
      { id: 'size', role: 'res', k: '15.4', t: R`출력 크기 $N'=(N-K+2P)/S+1$`, en: R`Output $N'=(N-K+2P)/S+1$`,
        d: R`필터를 놓을 수 있는 자리를 세면 나옵니다. 보폭 $S$는 자리 수를 약 $1/S$로 줄이고, 보폭 1에서 패딩 $P=(K-1)/2$이면 크기가 그대로입니다.`,
        dEn: R`It comes from counting the positions a filter can take. A stride $S$ cuts their number to about $1/S$, and with stride 1 the padding $P=(K-1)/2$ keeps the size.` },
      { id: 'pool', role: 'def', k: '15.5', t: R`풀링: 매개변수 없는 축소`, en: R`Pooling: shrinking for free`,
        d: R`창마다 최댓값이나 평균 하나만 남겨 채널별로 줄입니다. 학습할 매개변수가 없고, 창 안의 작은 이동에는 출력이 거의 바뀌지 않습니다.`,
        dEn: R`Keep only the maximum or the mean of each window, channel by channel. There are no parameters to learn, and a small shift inside a window barely changes the output.` },
      { id: 'compare', role: 'view', k: '15.6', t: R`국소 연결 + 가중치 공유`, en: R`Local links + weight sharing`,
        d: R`완전연결층과 견주면 합성곱층은 이웃끼리만 잇고 같은 가중치를 모든 위치에서 씁니다. $1\times1$ 합성곱은 화소마다 공유된 완전연결층입니다.`,
        dEn: R`Compared with a fully connected layer, a convolutional layer links only neighbors and uses the same weights at every position. A $1\times1$ convolution is a fully connected layer shared by all pixels.` },
      { id: 'equi', role: 'res', k: '15.6', at: '**등변성과 불변성**', t: R`이동 등변성 $f(g\cdot x)=g\cdot f(x)$`, en: R`Equivariance $f(g\cdot x)=g\cdot f(x)$`,
        d: R`옮긴 뒤 합성곱한 것 = 합성곱한 뒤 옮긴 것. 증명의 열쇠는 모든 위치에서 같은 $w$(가중치 공유)이고, 위치마다 가중치가 다르면 깨집니다.`,
        dEn: R`Shift then convolve = convolve then shift. The key to the proof is the same $w$ at every position (weight sharing); with position-dependent weights it fails.` },
      { id: 'whole', role: 'app', k: '15.6', at: '**정리하면**', t: R`등변 + 불변 = CNN`, en: R`Equivariant + invariant = CNN`,
        d: R`합성곱은 등변(“어디인가”), 풀링은 불변에 가깝게(“무엇인가”) 만들어 검출과 분류에 모두 맞습니다. 다음 단원은 이 부품으로 지은 실제 망입니다.`,
        dEn: R`Convolution is equivariant (“where is it?”) and pooling makes things nearly invariant (“what is it?”), which suits both detection and classification. The next unit builds real networks from these parts.` },
    ],
    rows: [['fc'], ['local', 'movavg'], ['filter'], ['layer'], ['size', 'compare'], ['pool', 'equi'], ['whole']],
    edges: [
      ['fc', 'local', R`공간 구조를 쓰면`, R`use spatial structure`],
      ['local', 'filter', R`모든 조각에 같은 $w$`, R`same $w$ for every patch`],
      ['movavg', 'filter', R`$1/9$ 대신 $w$`, R`$w$ instead of $1/9$`],
      ['filter', 'layer', R`깊이 전체로`, R`through the full depth`],
      ['layer', 'size', R`크기를 세면`, R`count the size`],
      ['layer', 'compare', R`완전연결과 비교`, R`vs. fully connected`],
      ['size', 'pool', R`더 작게`, R`make it smaller`],
      ['compare', 'equi', R`공유하면 등변`, R`sharing ⇒ equivariance`],
      ['pool', 'whole', R`거의 불변`, R`nearly invariant`],
      ['equi', 'whole', R`등변`, R`equivariant`],
    ],
  });
})();
