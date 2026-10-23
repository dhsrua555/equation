/* 실전 모의고사 VII — 교재 6·10·12장(07, 13–15단원) 종합: 신경망, CNN, 트랜스포머를 잇는 문항. 2026-10-23 추가. 연습문제와 겹치지 않는 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x7', roman: 'VII', kind: '교재 6·10·12장 범위', title: '신경망, CNN, 트랜스포머 종합', scopeText: '07, 13–15 단원',
    desc: '보편 근사·활성화·전이 학습·CLIP 손실, 보폭 합성곱의 계산량·풀링·수용 영역, 비최대 억제·스타일 오차·U-net 설계를 거쳐, 패치 임베딩·교차 어텐션·“합성곱은 위치로 고정한 어텐션” 증명·ViT와 CNN의 비용 비교로 세 단원을 잇습니다. 서술형 셋은 설계 계산 둘과 증명 하나입니다.',
    minutes: 110, plot: 'unet',
    problems: [
      { ch: 'ch07', type: 'num', lv: 1, pts: 3, q: R`The constructive proof of the universal approximation theorem builds ‘bumps’ $b(x)=\sigma\big(s(x-c_1)\big)-\sigma\big(s(x-c_2)\big)$ from the difference of two sigmoids and stacks them. For $s=10$, $c_1=0.2$, $c_2=0.6$, find the height $b(0.4)$ at the centre of the bump, $x=0.4$. (4 decimal places)`,
        ans: 'tanh(1)', ansTex: R`2\sigma(2)-1=\tanh1\approx0.7616`,
        sol: R`
**핵심.** 막대는 $x=c_1$에서 올라가는 계단과 $x=c_2$에서 올라가는 계단의 차입니다. 기울기 $s$가 유한하면 계단이 완만해 막대의 높이가 1에 못 미칩니다.

1. 두 시그모이드의 입력: $s(x-c_1)=10(0.4-0.2)=2$, $s(x-c_2)=10(0.4-0.6)=-2$.
2. 값: $\sigma(2)=\frac1{1+e^{-2}}=\frac1{1.1353}=0.8808$, $\sigma(-2)=0.1192$.
3. 차: $b(0.4)=0.8808-0.1192=0.7616$.
4. 식으로 정리하면 $\sigma(-a)=1-\sigma(a)$이므로 $b=2\sigma(2)-1$이고, 항등식 $\tanh a=2\sigma(2a)-1$에 $a=1$을 넣으면 $b=\tanh1$입니다.

**답.** $b(0.4)=\tanh1\approx0.7616$

**자주 하는 실수.** 첫 계단만 계산해 $\sigma(2)=0.8808$이라 답하거나, $c$를 빼지 않고 $\sigma(10\cdot0.4)$를 넣는 경우가 있습니다.

**검산.** 기울기를 $s=20$으로 키우면 $b=\tanh2\approx0.9640$으로 1에 가까워집니다. $s\to\infty$이면 $[c_1,c_2]$ 안에서 1, 밖에서 0인 막대가 되고, 막대마다 높이를 $g(c)$로 맞춰 쌓으면 연속함수 $g$를 근사합니다. 막대 하나에 은닉 유닛이 두 개 들므로, 구간 $[0,1]$을 폭 $\Delta$의 막대로 덮으려면 은닉 유닛이 $2/\Delta$개쯤 필요합니다.

관련: [[ch07:6.2b|보편 근사 정리]]` },
      { ch: 'ch07', type: 'mc', lv: 2, pts: 4, q: R`Which statement about activation functions for hidden units is correct?`,
        choices: [R`The derivative of softplus $\ln(1+e^a)$ is $\tanh a$, so the gradient is close to 1 for $a\gg1$`, R`Hard tanh $\max(-1,\min(1,a))$ has gradient 1 even for $\lvert a\rvert\gt1$, so it does not saturate`, R`The absolute value function $\lvert a\rvert$ is leaky ReLU with $\alpha=-1$, and for $a\ne0$ the magnitude of its gradient is always 1`, R`The derivative of the logistic sigmoid has maximum value 1, so the gradient does not shrink as it passes through many layers`], ans: 2,
        sol: R`
**핵심.** 활성화마다 도함수를 직접 써 보면 판정됩니다: $\text{softplus}'(a)=\sigma(a)$, hard tanh의 도함수는 $\lvert a\rvert\lt1$에서 1이고 밖에서 0, $\sigma'=\sigma(1-\sigma)\le\tfrac14$.

1. leaky ReLU $h(a)=\max(0,a)+\alpha\min(0,a)$에 $\alpha=-1$을 넣으면 $a\gt0$에서 $a$, $a\lt0$에서 $-a$, 곧 $\lvert a\rvert$입니다. 도함수는 $a\gt0$에서 $+1$, $a\lt0$에서 $-1$이라 크기가 늘 1이고, 입력이 커도 오차 신호가 줄지 않습니다.
2. softplus의 도함수는 $\frac{e^a}{1+e^a}=\sigma(a)$입니다. $a\gg1$에서 1에 가깝다는 결론은 맞지만 근거로 든 도함수가 틀렸습니다.
3. hard tanh는 $\lvert a\rvert\gt1$에서 상수 $\pm1$이라 기울기가 0입니다.
4. $\sigma'(a)$의 최댓값은 $\sigma'(0)=\tfrac14$입니다. 층마다 적어도 4배씩 줄 수 있어 기울기 소실의 원인이 됩니다.

**답.** ③

**보기 검토.** ① 결론은 맞으나 도함수가 $\sigma(a)$이지 $\tanh a$가 아닙니다. ② $\lvert a\rvert\gt1$에서 기울기가 0이라 포화합니다. ③ 정답 — 절댓값 함수는 $\alpha=-1$인 leaky ReLU이고 $a\ne0$에서 기울기 크기가 1입니다. ④ 최댓값은 $\tfrac14$이고, 최댓값이 1인 것은 $\tanh'$입니다.

관련: [[ch07:6.2c|은닉 유닛의 활성화 함수]]` },
      { ch: 'ch07', type: 'num', lv: 1, pts: 3, q: R`A VGG-16 pre-trained on ImageNet is adapted by transfer learning to classify 7 types of skin lesion. Because very few labelled images are available, only the final classification layer is replaced by one with 7 outputs (softmax) and retrained, while all other layers are frozen. How many parameters (including biases) are trained? (integer)`,
        ans: '4097*7', ansTex: R`(4096+1)\cdot7=28{,}679`,
        sol: R`
**핵심.** 대상 자료가 매우 적으면 사전학습 망을 고정된 특징 추출기로 쓰고 마지막 분류층만 다시 학습합니다. 완전연결층의 모수는 $(\text{입력 수}+1)\times\text{출력 수}$입니다.

1. VGG-16의 완전연결 부분은 $25{,}088\to4{,}096\to4{,}096\to1{,}000$입니다. 마지막 분류층의 입력은 둘째 완전연결층의 출력 4,096개입니다.
2. 출력을 1,000개에서 7개로 바꾼 새 층의 모수: 가중치 $4096\cdot7=28{,}672$, 편향 7, 합 $(4096+1)\cdot7=28{,}679$.
3. 나머지는 고정되므로, 학습 모수는 전체 $138{,}357{,}544$개의 약 $0.021\%$입니다.

**답.** $28{,}679$

**자주 하는 실수.** 첫 완전연결층의 입력 25,088을 써서 $(25{,}088+1)\cdot7$로 세거나, 편향을 빠뜨려 28,672로 답하는 경우가 있습니다.

**검산.** 이 방식에서는 훈련 영상을 고정된 망에 한 번만 통과시켜 4,096차원 표현을 저장해 두면, 반복 최적화는 작은 소프트맥스 회귀 하나만 하면 됩니다. 자료가 더 많으면 여러 층을, 미세조정이면 전체를 작은 학습률과 적은 반복으로 다시 학습합니다. 앞쪽 층의 저수준 특징(모서리·질감)은 자연 영상과 피부 영상에 공통이라 그대로 쓸 수 있습니다.

관련: [[ch07:6.3b|표현 학습, 전이 학습]], [[ch13:10.2f|VGG-16의 구조]]` },
      { ch: 'ch07', type: 'num', lv: 3, pts: 5, q: R`A chest X-ray encoder $\mathbf f_{\mathbf w}$ and a radiology report encoder $\mathbf g_{\boldsymbol\theta}$ are trained jointly with the CLIP loss. For a minibatch of 3 images and 3 reports, the inner products of the normalized embeddings $\mathbf f_{\mathbf w}(\mathbf x_i)^T\mathbf g_{\boldsymbol\theta}(\mathbf y_j)$ are given below (row $i$: image, column $j$: report; the diagonal entries are the matching pairs).
$$\begin{pmatrix}0.9&0.3&0.1\\0.5&0.8&0.2\\0.2&0.4&0.7\end{pmatrix}$$
Taking image 1–report 1 as the positive pair and the other images and reports in the same batch as negative examples, find the CLIP loss for this pair. (4 decimal places)`,
        ans: '-0.5*ln(exp(0.9)/(exp(0.9)+exp(0.5)+exp(0.2)))-0.5*ln(exp(0.9)/(exp(0.9)+exp(0.3)+exp(0.1)))', ansTex: R`\tfrac12(0.7733+0.6922)\approx0.7328`,
        sol: R`
**핵심.** CLIP 손실은 두 방향 InfoNCE의 평균입니다. 유사도 행렬을 $s_{ij}$라 하면
$$E=-\frac12\ln\frac{e^{s_{11}}}{e^{s_{11}}+\sum_{i\ne1}e^{s_{i1}}}-\frac12\ln\frac{e^{s_{11}}}{e^{s_{11}}+\sum_{j\ne1}e^{s_{1j}}}$$
첫 항은 판독문 1을 기준으로 영상들을(1열), 둘째 항은 영상 1을 기준으로 판독문들을(1행) 비교합니다.

1. 지수: $e^{0.9}=2.4596$, $e^{0.5}=1.6487$, $e^{0.2}=1.2214$, $e^{0.3}=1.3499$, $e^{0.1}=1.1052$.
2. 판독문 → 영상 방향(1열 $0.9,\,0.5,\,0.2$): $\frac{2.4596}{2.4596+1.6487+1.2214}=\frac{2.4596}{5.3297}=0.4615$, $-\ln0.4615=0.7733$.
3. 영상 → 판독문 방향(1행 $0.9,\,0.3,\,0.1$): $\frac{2.4596}{2.4596+1.3499+1.1052}=\frac{2.4596}{4.9147}=0.5005$, $-\ln0.5005=0.6922$.
4. 평균: $E=\tfrac12(0.7733+0.6922)=0.7328$.

**답.** $E\approx0.7328$

**자주 하는 실수.** 1행만 써서 한 방향 InfoNCE $0.6922$를 답하거나, 1열과 1행을 한 분모에 모두 넣는 경우입니다. 두 방향은 음성 예가 서로 다릅니다(다른 영상 대 다른 판독문). 행렬이 대칭이 아니므로 두 항의 값도 다릅니다.

**검산.** 대각 유사도를 키우거나 비대각을 줄이면 두 분수가 모두 1에 가까워져 $E\to0$입니다. 음성 항이 없으면 분수가 늘 1이라 손실이 상수 0이 되어 모든 임베딩을 한 점에 모으는 퇴화 해를 막지 못합니다. 영상 쪽 인코더로 비전 트랜스포머, 판독문 쪽으로 텍스트 트랜스포머를 쓰면 두 양식이 하나의 임베딩 공간을 공유하는 멀티모달 모델이 됩니다.

관련: [[ch07:6.3c|대조 학습과 CLIP]], [[ch15:12.4|멀티모달 트랜스포머]]` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 4, q: R`Chest X-rays are classified as normal/abnormal using 2 outputs and a softmax. For one image the logits are $(a_1,a_2)=(0.3,\ 1.8)$ and the true label is normal (class 1). Find the multiclass cross-entropy $E=-\sum_kt_k\ln y_k$. (4 decimal places)`,
        ans: 'ln(1+exp(1.5))', ansTex: R`\ln(1+e^{1.5})\approx1.7014`,
        sol: R`
**핵심.** 두 클래스 소프트맥스는 로짓 차의 시그모이드와 같습니다.
$$y_1=\frac{e^{a_1}}{e^{a_1}+e^{a_2}}=\frac1{1+e^{-(a_1-a_2)}}=\sigma(a_1-a_2)$$
그래서 출력 하나($a=a_1-a_2$)의 시그모이드 + 이진 교차 엔트로피와 같은 모델입니다.

1. $a_1-a_2=-1.5$이므로 $y_1=\sigma(-1.5)=\frac1{1+e^{1.5}}=\frac1{5.4817}=0.1824$. 직접 계산해도 $e^{0.3}=1.3499$, $e^{1.8}=6.0496$, $y_1=1.3499/7.3995=0.1824$입니다.
2. $t_1=1$, $t_2=0$이므로 $E=-\ln y_1=\ln(1+e^{1.5})=\ln5.4817=1.7014$.
3. 기울기: $\partial E/\partial a_1=y_1-t_1=-0.8176$, $\partial E/\partial a_2=y_2-t_2=+0.8176$. 합이 0인 것은 두 로짓에 같은 상수를 더해도 출력이 변하지 않기 때문입니다. 시그모이드 모형으로 보아도 $\partial E/\partial a=\sigma(a)-t=-0.8176$으로 같습니다.

**답.** $E=\ln(1+e^{1.5})\approx1.7014$

**자주 하는 실수.** 정답을 이상(클래스 2)으로 착각해 $-\ln y_2=\ln(1+e^{-1.5})=0.2014$로 답하거나, 자연로그 대신 상용로그를 쓰는 경우가 있습니다.

**검산.** 망이 틀린 쪽(이상)의 로짓을 1.5만큼 더 크게 냈으므로, 오차가 반반으로 예측할 때의 $\ln2=0.6931$보다 커야 합니다. $1.7014\gt0.6931$로 맞습니다.

관련: [[ch07:6.4|오차함수와 출력 활성화]]` },
      { ch: 'ch13', type: 'mc', lv: 1, pts: 3, q: R`Which of the following statements about the layer designs of LeNet, AlexNet, and VGG-16 agrees with the textbook?`,
        choices: [R`Each time VGG-16 halves the resolution with max-pooling, it increases the number of channels ($64\to128\to256\to512$) to preserve representational capacity`, R`Most of the parameters of VGG-16 are in the first convolutional layer`, R`LeNet used ReLU activations and max-pooling`, R`AlexNet obtained large receptive fields by stacking only $3\times3$ filters`], ans: 0,
        sol: R`
**핵심.** 세 구조의 층 설계를 구별하는 문제입니다. LeNet은 시그모이드와 평균 풀링, AlexNet은 ReLU, GPU 학습, 드롭아웃과 $11\times11$(보폭 4) 첫 필터, VGG-16은 $3\times3$ 필터만 쌓는 단순한 원칙을 씁니다.

1. VGG-16의 해상도는 $224\to112\to56\to28\to14\to7$, 채널은 $64\to128\to256\to512$입니다. $2\times2$ 최대 풀링이 유닛 수를 $\tfrac14$로 줄이는 만큼 채널을 늘려 표현 용량을 유지합니다.
2. 모수가 가장 많은 층은 첫 완전연결층($25{,}088\to4{,}096$, 약 1억 300만 개)이고, 첫 합성곱층은 $(9\cdot3+1)\cdot64=1{,}792$개뿐입니다. 첫 합성곱층에 몰려 있는 것은 **연결**(곱셈) 수입니다.

**답.** ①

**보기 검토.** ① 정답 — 해상도를 줄일 때 채널을 늘리는 것이 VGG의 설계 원칙입니다. ② 모수와 연결을 바꿔 말했습니다. 모수는 첫 완전연결층, 연결은 첫 합성곱층에 몰려 있습니다. ③ LeNet은 시그모이드와 $2\times2$ 평균 풀링을 썼습니다. ④ $3\times3$만 쌓은 것은 VGG이고, AlexNet의 첫 층은 $11\times11$, 보폭 4입니다.

관련: [[ch13:10.2f|다층 합성곱과 대표 구조]]` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 4, q: R`A convolutional layer applies 128 filters of size $3\times3$ to a $112\times112\times64$ feature map with padding 1 and stride 2. How many multiplications does it perform? (ignore biases; integer)`,
        ans: '56*56*128*9*64', ansTex: R`56^2\cdot128\cdot576=231{,}211{,}008`,
        sol: R`
**핵심.** 곱셈 수 = (출력 원소 수) × (출력 원소 하나에 드는 곱셈 수). 출력 한 변은 $\lfloor(J+2P-M)/S\rfloor+1$이고, 출력 원소 하나는 $M\times M\times C_{\text{IN}}$ 필터와 패치의 내적입니다.

1. 출력 한 변: $\lfloor(112+2-3)/2\rfloor+1=\lfloor55.5\rfloor+1=56$.
2. 출력 원소 수: $56\cdot56\cdot128=401{,}408$.
3. 원소 하나의 곱셈: $3\cdot3\cdot64=576$.
4. 곱: $401{,}408\cdot576=231{,}211{,}008\approx2.31\times10^8$.

**답.** $231{,}211{,}008$

**자주 하는 실수.** 보폭을 빼먹고 출력을 $112\times112$로 두면 $924{,}844{,}032$으로 정확히 4배가 됩니다. 출력 한 변을 $112/2+1=57$로 세는 실수도 흔합니다. 내림은 $(J+2P-M)/S$에 먼저 해야 합니다.

**검산.** 모수는 $(9\cdot64+1)\cdot128=73{,}856$개로 보폭과 무관하지만, 계산량은 보폭 $S$에 대해 대략 $1/S^2$로 줄어듭니다. 보폭 합성곱이 풀링처럼 다운샘플링으로 계산을 줄이는 이유입니다.

관련: [[ch13:10.2c|패딩과 보폭]], [[ch13:10.2d|다채널 합성곱]]` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 4, q: R`In the AlexNet of the textbook's table (input $224\times224\times3$), the output of convolution 5 is $12\times12\times256$; it is followed by $3\times3$ max-pooling (stride 2), then flattened and fed into a fully connected layer with 4,096 hidden units. How many parameters (including biases) does this fully connected layer have? (integer)`,
        ans: '(5*5*256+1)*4096', ansTex: R`(6400+1)\cdot4096=26{,}218{,}496`,
        sol: R`
**핵심.** 풀링 출력 크기도 합성곱과 같은 공식 $\lfloor(J-M)/S\rfloor+1$을 따르고(패딩 없음), 풀링에는 학습할 모수가 없습니다. 완전연결층은 펼친 길이에 편향 1을 더해 출력 수를 곱합니다.

1. 풀링 출력: $\lfloor(12-3)/2\rfloor+1=4+1=5$. 채널마다 따로 풀링하므로 $5\times5\times256$입니다.
2. 펼친 길이: $5\cdot5\cdot256=6{,}400$.
3. 모수: $(6{,}400+1)\cdot4{,}096=26{,}218{,}496$.

**답.** $26{,}218{,}496$ (약 2,600만)

**자주 하는 실수.** 풀링을 “절반”으로만 생각해 $6\times6$으로 두면 $(9{,}216+1)\cdot4{,}096=37{,}752{,}832$이 됩니다. $3\times3$ 창을 보폭 2로 미는 겹치는 풀링이라 단순히 절반이 아닙니다. (원 논문의 $6\times6$은 입력 227에서 나온 값입니다.)

**검산.** 같은 공식이 표의 다른 풀링과도 맞습니다: 풀링 1 $\lfloor(54-3)/2\rfloor+1=26$, 풀링 2 $\lfloor(26-3)/2\rfloor+1=12$. 합성곱 다섯 층의 모수를 모두 더해도 약 375만 개라, 이 한 층이 그 7배쯤입니다. CNN의 자유도 대부분이 완전연결층에 있다는 교재 설명과 맞습니다.

관련: [[ch13:10.2e|풀링]], [[ch13:10.2f|AlexNet]]` },
      { ch: 'ch13', type: 'num', lv: 3, pts: 5, q: R`Like the front part of VGG, a network consists of input → $3\times3$ convolution → $3\times3$ convolution → $2\times2$ max-pooling (stride 2) → $3\times3$ convolution → $3\times3$ convolution (all convolutions have stride 1). How many pixels on a side is the receptive field, in the input, of a single unit in the last layer? (integer)`,
        ans: '14', ansTex: R`3\to5\to6\to10\to14`,
        sol: R`
**핵심.** 보폭 1 합성곱만 있으면 한 변이 $L(M-1)+1$이지만, 보폭 2 풀링 뒤에는 위층의 한 칸이 입력에서 2화소씩 건너뛰므로 같은 $3\times3$ 창이 수용 영역을 2배 빠르게 넓힙니다. 가로·세로가 같으므로 한 변(1차원)만 셉니다.

1. 합성곱 두 층: $2\cdot(3-1)+1=5$화소. 여기까지는 맵에서 한 칸 이동이 입력에서 1화소 이동입니다.
2. 풀링 유닛 하나는 이웃한 합성곱 2 유닛 2개를 봅니다. 두 유닛의 수용 영역은 1화소 어긋난 5화소 창 두 개라 합치면 $5+1=6$화소. 이제 풀링 맵에서 한 칸 이동은 입력에서 2화소 이동입니다.
3. 셋째 합성곱: 풀링 유닛 3개는 서로 2화소씩 어긋나므로 $6+(3-1)\cdot2=10$화소.
4. 넷째 합성곱: 같은 이유로 $10+(3-1)\cdot2=14$화소.

**답.** $14$

**자주 하는 실수.** 풀링을 무시하고 $3\times3$ 네 층으로 보아 $4\cdot2+1=9$, 또는 풀링을 보폭 1인 $2\times2$ 창처럼 1만 더해 $10$으로 답하는 경우입니다. 풀링 뒤의 층에서는 “한 칸 = 2화소”라는 점이 핵심입니다.

**검산.** 위에서 아래로 거꾸로 펼쳐 봅니다. 맨 위 유닛 → 셋째 합성곱 출력 3칸 → 풀링 맵 5칸 → 합성곱 2 출력 10칸(풀링 칸마다 겹치지 않는 2칸) → 합성곱 1 출력 12칸 → 입력 14칸. 같은 결과입니다. 풀링이 수용 영역을 키우는 속도를 높여 깊은 층이 물체 수준의 넓은 패턴을 보게 됩니다.

관련: [[ch13:10.2f|유효 수용 영역]], [[ch13:10.2e|풀링]]` },
      { ch: 'ch13', type: 'mc', lv: 2, pts: 4, q: R`When one of the following operations is inserted between convolutional layers, which one does **not** break the translation equivariance of the network (shifting the input shifts the feature maps by the same amount)?`,
        choices: [R`Batch normalization in which the mean and variance are computed separately for each pixel position $(i,j)$`, R`Batch normalization that uses the same mean and variance, and the same learned gain and bias, at all spatial positions of a feature map (channel)`, R`Removing weight sharing to obtain a locally connected layer that uses different $3\times3$ weights at each position`, R`Adding to each pixel of a feature map a bias learned separately for its position $(i,j)$`], ans: 1,
        sol: R`
**핵심.** 등변성은 “모든 위치에서 같은 연산을 한다”에서 나옵니다. 합성곱은 같은 커널을 미끄러뜨리기 때문에 등변이고, 위치마다 다른 무엇이 끼어들면 옮긴 입력이 다른 처리를 받아 등변성이 깨집니다.

1. 입력을 한 칸 옮기면 합성곱 출력도 한 칸 옮겨집니다. 다음 처리가 위치와 무관한 함수(채널마다 같은 $\gamma\frac{a-\mu}{\sigma}+\beta$)이면, 옮겨진 값에 같은 함수를 적용하므로 결과도 그만큼 옮겨질 뿐입니다.
2. 통계를 위치마다 따로 내면, 옮겨진 특징이 원래와 다른 위치의 $\mu_{ij},\sigma_{ij}$로 정규화되어 결과가 단순한 이동이 아닙니다.
3. 교재도 합성곱망의 배치 정규화에서는 한 특징 맵의 모든 공간 위치에 같은 평균·분산을 써야 등변성이 유지된다고 강조합니다.

**답.** ②

**보기 검토.** ① 위치마다 다른 정규화라 이동한 특징이 다른 처리를 받습니다. ② 정답 — 채널마다 통계와 이득·편향이 하나라 위치와 무관합니다. ③ 가중치 공유가 사라지면 등변성의 근거(같은 필터를 모든 위치에)가 없어지고 모수도 크게 늘어납니다. ④ 위치별 편향은 같은 무늬라도 위치에 따라 다른 값을 내게 합니다.

관련: [[ch13:10.2b|합성곱 연산과 평행이동 등변성]], [[ch09:7.4b|배치 정규화]]` },
      { ch: 'ch14', type: 'mc', lv: 1, pts: 3, q: R`Grad-CAM is to be used to draw a heat map of where a chest X-ray classifier looked when it decided “pneumothorax”. Which choice of the layer at which the gradient is taken, the quantity that is differentiated, and the reason is appropriate?`,
        choices: [R`The first convolutional layer, the softmax probability $y_c$ — because its resolution is the highest`, R`The last fully connected layer, the softmax probability $y_c$ — because it is closest to the class decision`, R`The input pixels, the error $E(\mathbf x,t)$ — because it is the same gradient as in FGSM`, R`The last convolutional layer, the pre-softmax pre-activation $a^{(c)}$ — because it retains spatial position information while having the highest semantic level`], ans: 3,
        sol: R`
**핵심.** Grad-CAM은 $\alpha_k=\frac1{M_k}\sum_{i,j}\partial a^{(c)}/\partial a_{ij}^{(k)}$로 마지막 합성곱층의 채널마다 중요도를 내고, $\mathbf L=\sum_k\alpha_k\mathbf A^{(k)}$로 열지도를 만듭니다.

1. 층: 뒤의 완전연결층에서는 공간 위치가 섞여 사라지고, 앞쪽 층은 모서리 같은 저수준 특징이라 “기흉”이라는 의미와 거리가 멉니다. 마지막 합성곱층은 위치 격자가 남아 있으면서 가장 높은 수준의 특징을 담습니다.
2. 양: 소프트맥스 이전의 클래스 점수 $a^{(c)}$를 미분합니다. 확률 $y_c$는 분모에 다른 클래스의 점수가 들어가, 다른 클래스를 낮추는 방향에도 반응하기 때문입니다.
3. 열지도 $\mathbf L$은 마지막 합성곱층과 같은 크기(VGG-16이면 $14\times14$)라 영상 크기로 늘려 겹쳐 봅니다.

**답.** ④

**보기 검토.** ① 첫 층은 모서리 검출기 수준이라 클래스 판단의 근거를 보여 주지 못합니다. ② 완전연결층에는 공간 격자가 없어 열지도를 그릴 수 없습니다. ③ 입력 화소에 대한 오차의 기울기는 적대적 섭동을 만드는 FGSM의 재료이지 Grad-CAM이 아닙니다. ④ 정답.

관련: [[ch14:10.3b|돌출 맵, 적대적 공격]]` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 4, q: R`The six detection boxes for one class (pulmonary nodule) are listed below (each box is $[x_1,x_2]\times[y_1,y_2]$).

| Box | Location | Score |
|---|---|---|
| B1 | $[0,4]\times[0,4]$ | 0.92 |
| B2 | $[1,5]\times[0,4]$ | 0.85 |
| B3 | $[2,6]\times[2,6]$ | 0.80 |
| B4 | $[6,10]\times[5,9]$ | 0.62 |
| B5 | $[6,10]\times[6,10]$ | 0.70 |
| B6 | $[11,13]\times[0,2]$ | 0.45 |

If non-max suppression is applied with score threshold 0.5 and IoU threshold 0.5, what is the sum of the scores of the boxes kept as final detections? (2 decimal places)`,
        ans: '0.92+0.80+0.70', ansTex: R`0.92+0.80+0.70=2.42`,
        sol: R`
**핵심.** 비최대 억제는 (1) 점수 문턱 아래 상자를 버리고 (2) 남은 것 중 **점수가 가장 높은** 상자를 확정하고 (3) 그것과 IoU가 문턱을 넘는 상자를 버리기를 (4) 반복합니다. 목록 순서가 아니라 점수 순서로 처리합니다. $\text{IoU}=\frac{\lvert A\cap B\rvert}{\lvert A\rvert+\lvert B\rvert-\lvert A\cap B\rvert}$.

1. 점수 문턱: B6(0.45)을 버립니다. 남은 상자를 점수 순으로 세우면 B1 0.92, B2 0.85, B3 0.80, B5 0.70, B4 0.62.
2. B1 확정. B1–B2: 교집합 $[1,4]\times[0,4]$의 넓이 12, 합집합 $16+16-12=20$, IoU $0.6\gt0.5$ → B2 버림. B1–B3: 교집합 $[2,4]\times[2,4]$의 넓이 4, 합집합 28, IoU $0.143$ → 남김. B4, B5는 $x$ 구간이 B1과 겹치지 않아 IoU 0.
3. 남은 최고 점수 B3 확정. B3와 B4, B5는 $x$ 구간이 $x=6$ 한 점에서만 만나 교집합 넓이가 0 → 둘 다 남김.
4. 남은 최고 점수 B5(0.70) 확정. B5–B4: 교집합 $[6,10]\times[6,9]$의 넓이 12, 합집합 20, IoU $0.6$ → B4 버림.
5. 확정된 상자는 B1, B3, B5이고 점수 합은 $0.92+0.80+0.70=2.42$.

**답.** $2.42$

**자주 하는 실수.** 목록 순서대로 B4를 B5보다 먼저 확정하면 $0.92+0.80+0.62=2.34$가 됩니다. 점수 문턱을 잊으면 아무것과도 겹치지 않는 B6이 살아남아 $2.87$이 됩니다. B3를 B2와 겹친다고 지우는 것도 틀립니다(B2는 이미 지워졌고 IoU도 0.23).

**검산.** 결과는 서로 다른 세 곳(왼쪽 아래, 가운데, 오른쪽 위)에 상자가 하나씩 남은 것으로, “같은 물체의 중복만 지우고 다른 물체의 검출은 살린다”는 비최대 억제의 목적과 맞습니다.

관련: [[ch14:10.4|경계 상자와 IoU]], [[ch14:10.4b|비최대 억제]]` },
      { ch: 'ch14', type: 'num', lv: 2, pts: 4, q: R`In style transfer, the feature maps of the content image $\mathbf C$ at one layer ($2\times2$, 2 channels) are channel 1 $\begin{pmatrix}2&0\\1&3\end{pmatrix}$ and channel 2 $\begin{pmatrix}1&1\\0&2\end{pmatrix}$. The feature maps of the generated image $\mathbf G$ at the same layer are these two maps with their top and bottom rows swapped (the same swap in both channels). Find the content error $E_{\text{content}}(\mathbf G,\mathbf C)$. (integer) Also consider what the style error is when the same $\mathbf C$ is used as the style image as well.`,
        ans: '24', ansTex: R`20+4=24`,
        sol: R`
**핵심.** 내용 오차 $\sum_{i,j,k}\{a_{ijk}(\mathbf G)-a_{ijk}(\mathbf C)\}^2$는 **같은 위치**의 활성을 비교하고, 스타일 행렬 $F_{kk'}=\sum_{i,j}a_{ijk}a_{ijk'}$은 모든 위치에 걸쳐 **합**하므로 위치를 섞어도 변하지 않습니다.

1. 생성 영상의 맵: 채널 1 $\begin{pmatrix}1&3\\2&0\end{pmatrix}$, 채널 2 $\begin{pmatrix}0&2\\1&1\end{pmatrix}$.
2. 채널 1의 차의 제곱합: $(1-2)^2+(3-0)^2+(2-1)^2+(0-3)^2=1+9+1+9=20$.
3. 채널 2의 차의 제곱합: $(0-1)^2+(2-1)^2+(1-0)^2+(1-2)^2=1+1+1+1=4$.
4. $E_{\text{content}}=20+4=24$.
5. 스타일 행렬: 내용 영상에서 $F_{11}=4+0+1+9=14$, $F_{12}=2+0+0+6=8$, $F_{22}=1+1+0+4=6$. 생성 영상은 같은 네 곱을 순서만 바꿔 더하므로 $F_{11}=14$, $F_{12}=8$, $F_{22}=6$으로 같습니다. 따라서 $E_{\text{style}}(\mathbf G,\mathbf C)=0$.

**답.** $E_{\text{content}}=24$ (스타일 오차는 0)

**자주 하는 실수.** 제곱하지 않고 차의 절댓값을 더하거나(채널 1에서 8), 한 채널만 세는 경우입니다. 행을 바꾸면 스타일 행렬도 바뀐다고 생각하는 것도 흔한 오해입니다.

**검산.** 행 맞바꿈은 위치 $(i,j)$의 순열이고 $F_{kk'}$은 위치에 대한 합이라 어떤 순열에도 불변입니다. 스타일 오차는 특징이 “어디에” 나타나는지는 무시하고 “어떤 특징끼리 함께” 나타나는지만 맞추고, 배치는 내용 오차가 맞춥니다. 두 오차를 나눠 쓰는 원리가 이 계산에 그대로 드러납니다.

관련: [[ch14:10.6|신경 스타일 전이]]` },
      { ch: 'ch14', type: 'open', lv: 3, pts: 11, q: R`A small U-net is designed to segment a CT slice ($128\times128\times1$) into 3 classes: background, liver, and tumour. The encoder applies [two $3\times3$ “same” convolutions → $2\times2$ max-pooling (stride 2)] twice, increasing the channels $1\to32\to32$ and then $32\to64\to64$; at the bottom, two $3\times3$ “same” convolutions give $64\to128\to128$. The decoder applies [a $2\times2$ transpose convolution (output stride 2) that halves the number of channels → concatenation with the encoder features of the same resolution → two $3\times3$ “same” convolutions (with as many channels as the transpose-convolution output)] twice, and ends with a 1×1 convolution and a softmax. There is one bias per output channel.

(1) Show that a transpose convolution of an input of length $n$ with a filter of size $M$ and output stride $S$ (overlapping contributions are added, nothing is cropped) gives an output of length $S(n-1)+M$, and verify that the two transpose convolutions of the decoder restore the resolution $32\to64\to128$.

(2) Give the tensor sizes of the bottom output, the first transpose-convolution output, the result just after the first concatenation, the result just after the second concatenation, and the final output.

(3) Find the number of parameters of the first transpose convolution ($128\to64$ channels), of the first $3\times3$ convolution right after it, and of the final 1×1 convolution.

(4) Write down the error function used for training, and explain why the concatenating connections are needed for segmentation.`,
        rubric: R`
- (1) 입력 칸 $i$의 무늬가 출력 $iS,\dots,iS+M-1$에 놓임을 보여 길이 $S(n-1)+M$ 유도 — 3점
- (1) $M=S=2$이면 $2n$, $32\to64\to128$ 확인 — 1점
- (2) 다섯 텐서 크기 — 3점
- (3) 모수 $32{,}832$, $73{,}792$, $99$ — 2점
- (4) 화소별 교차 엔트로피와 이어 붙이는 연결의 역할 — 2점`,
        sol: R`
**핵심.** 전치 합성곱은 입력 한 칸을 필터 모양의 패치로 출력에 “뿌리고”, 입력에서 한 칸 가면 출력에서 $S$칸 갑니다. U-net은 같은 해상도의 인코더 특징을 디코더의 채널에 이어 붙여 다운샘플링이 버린 위치 정보를 되돌려 줍니다.

(1) 입력 칸 $i=0,1,\dots,n-1$의 기여 $z_iw_1,\dots,z_iw_M$은 출력의 $iS$번째부터 $iS+M-1$번째 칸까지 $M$칸에 놓이고, 겹치는 칸은 더합니다. 가장 뒤의 칸은 $i=n-1$일 때의 $(n-1)S+M-1$이므로 출력은 0번부터 $(n-1)S+M-1$번까지, 길이 $S(n-1)+M$입니다. 교재의 1차원 예($n=2$, $M=3$, $S=2$)에서 0이 아닐 수 있는 칸이 $2\cdot1+3=5$개인 것과 맞습니다($\mathbf A^T\mathbf z$의 여섯째 칸은 다운샘플링 입력의 패딩 자리라 늘 0). $M=S=2$이면 길이가 $2(n-1)+2=2n$이고, 패치가 겹치지도 비지도 않아 해상도가 정확히 두 배가 됩니다: $32\to64$, $64\to128$.

(2) 같은 합성곱은 크기를 유지하고, 풀링마다 한 변이 $\lfloor(128-2)/2\rfloor+1=64$, 다시 32로 절반이 됩니다.
- 바닥 출력: $32\times32\times128$
- 첫 전치 합성곱 출력: $64\times64\times64$
- 첫 이어 붙이기 직후: 인코더 둘째 단계의 $64\times64\times64$와 이어 $64\times64\times128$ (두 합성곱 뒤 $64\times64\times64$)
- 둘째 전치 합성곱($64\to32$) 뒤 $128\times128\times32$, 인코더 첫 단계의 $128\times128\times32$와 이어 $128\times128\times64$ (두 합성곱 뒤 $128\times128\times32$)
- 최종 출력: 1×1 합성곱으로 $128\times128\times3$, 화소마다 소프트맥스

(3) 다채널 전치 합성곱은 커널 위치마다 $C_{\text{IN}}\times C_{\text{OUT}}$개의 가중치를 가지므로 $M^2C_{\text{IN}}C_{\text{OUT}}+C_{\text{OUT}}=4\cdot128\cdot64+64=32{,}832$. 이어 붙인 128채널을 받는 $3\times3$ 합성곱은 $(9\cdot128+1)\cdot64=73{,}792$. 1×1 합성곱은 $(32+1)\cdot3=99$.

(4) 오차는 화소별 교차 엔트로피의 합 $E=-\sum_{i,j}\ln p_{ij,\,c_{ij}}$ ($c_{ij}$: 화소 $(i,j)$의 정답 클래스, 출력 원소는 $128\cdot128\cdot3=49{,}152$개)입니다. 풀링과 보폭은 계산을 줄이고 채널을 늘리게 해 주지만 위치 정보를 버립니다. 영상 전체에 레이블 하나를 붙이는 분류에는 괜찮아도, 종양 경계를 화소 단위로 그려야 하는 분할에는 치명적입니다. 이어 붙이는 연결은 다운샘플링 전의 고해상도 특징을 디코더에 직접 넘겨 경계의 세부를 되살립니다. 잔차 연결처럼 **더하지** 않고 채널로 **쌓으므로** 이어 붙인 뒤 채널 수가 두 배가 되고, 뒤따르는 합성곱이 두 정보를 섞는 법을 배웁니다.

관련: [[ch14:10.5b|전치 합성곱, 완전 합성곱망, U-net]], [[ch14:10.5|의미 분할과 업샘플링]]` },
      { ch: 'ch15', type: 'mc', lv: 1, pts: 3, q: R`Which statement comparing convolutional layers and self-attention layers is **false**?`,
        choices: [R`The number of learnable parameters of a self-attention layer does not depend on the number of tokens $N$`, R`The number of learnable parameters of a convolutional layer does not depend on the size of the input image`, R`In self-attention without positional encoding, permuting the order of the input tokens merely permutes the output in the same way`, R`An output unit of a single $3\times3$ convolutional layer with stride 1 depends on all positions of the input, like the output of self-attention`], ans: 3,
        sol: R`
**핵심.** 두 층 모두 모수를 공유합니다. 합성곱은 모든 위치가 같은 커널을, 어텐션은 모든 토큰이 같은 $\mathbf W^{(q)},\mathbf W^{(k)},\mathbf W^{(v)}$를 씁니다. 차이는 “누구를 보느냐”입니다. 합성곱 유닛은 수용 영역(이웃 $3\times3$)만 보고, 어텐션 출력 $\mathbf y_n=\sum_ma_{nm}\mathbf v_m$은 모든 토큰을 봅니다.

1. 어텐션의 모수는 투영 행렬들이라 $O(D^2)$이고 $N$과 무관합니다. $N$에 따라 늘어나는 것은 계산량 $O(N^2D)$입니다.
2. 합성곱층의 모수 $(M^2C_{\text{IN}}+1)C_{\text{OUT}}$에는 영상 크기가 없습니다.
3. 셀프 어텐션은 순열 등변입니다: $\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Attention}(\mathbf X)$. 그래서 위치 부호화를 더합니다.
4. $3\times3$ 합성곱 한 층의 출력은 입력의 $3\times3$ 이웃에만 의존합니다. 넓은 영역을 보려면 층을 쌓아 수용 영역 $L(M-1)+1$을 키워야 합니다.

**답.** ④

**보기 검토.** ① 옳음 — 멀티헤드 어텐션의 모수는 $4D^2$로 $N$이 없습니다. ② 옳음 — 같은 망을 크기가 다른 영상에 그대로 쓸 수 있는 이유입니다. ③ 옳음 — 순열 등변성입니다. ④ 틀림(정답) — 국소성은 CNN의 귀납적 편향이고, 한 층에서의 전역 의존은 어텐션의 성질입니다.

관련: [[ch15:12.4|비전 트랜스포머와 CNN]], [[ch13:10.2|CNN의 네 원리]]` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 4, q: R`A $224\times224$ greyscale chest X-ray ($C=1$) is split into patches with $P=16$; each patch is flattened, and the same linear projection (with bias) is applied to every patch to produce $D=768$-dimensional tokens. How many learnable parameters does this patch embedding layer have? (integer)`,
        ans: '(16*16*1+1)*768', ansTex: R`(256+1)\cdot768=197{,}376`,
        sol: R`
**핵심.** 패치 하나를 편 길이는 $P^2C$이고, 투영 $\mathbf E$(크기 $D\times P^2C$)와 편향을 **모든 패치가 공유**합니다. 이는 커널 $P\times P$, 보폭 $P$, 출력 채널 $D$인 합성곱층과 똑같습니다.

1. 패치 길이: $16\cdot16\cdot1=256$.
2. 투영의 가중치 $768\cdot256=196{,}608$, 편향 768, 합 $197{,}376$.
3. 합성곱으로 보기: 겹치지 않는 $16\times16$ 창마다 같은 가중치로 내적을 내므로 보폭 16의 합성곱입니다. 모수 공식 $(M^2C_{\text{IN}}+1)C_{\text{OUT}}=(256+1)\cdot768$로 같고, 출력 크기 $\lfloor(224-16)/16\rfloor+1=14$, 곧 $14\times14\times768$을 펼치면 토큰 196개가 됩니다.

**답.** $197{,}376$

**자주 하는 실수.** 패치마다 다른 투영이 있다고 보고 196을 곱하거나(약 $3.9\times10^7$), 컬러 영상처럼 $C=3$을 써서 $590{,}592$, 편향을 빼먹어 $196{,}608$로 답하는 경우입니다.

**검산.** 토큰 수 $N=HW/P^2=224^2/16^2=196$이 합성곱 출력 크기와 맞습니다. ViT가 영상의 2차원 구조에 대해 가진 귀납적 편향은 이 패치 자르기(국소 창과 가중치 공유) 하나뿐이고, 그 뒤의 층들은 모두 전역 어텐션입니다.

관련: [[ch15:12.4|비전 트랜스포머]], [[ch13:10.2d|다채널 합성곱]]` },
      { ch: 'ch15', type: 'num', lv: 3, pts: 5, q: R`In a ViT classifier, $\mathbf y=\operatorname{Softmax}(\mathbf W^T\mathbf c)$ ($\mathbf W\in\mathbb R^{D\times K}$) is attached to the final output $\mathbf c\in\mathbb R^D$ of the ⟨class⟩ token to classify normal, pneumonia, and tuberculosis ($K=3$). With the toy size $D=3$,
$$\mathbf c=\begin{pmatrix}2\\1\\0\end{pmatrix},\qquad \mathbf W=\begin{pmatrix}1&-0.5&0\\0.5&1&-1\\0&0.5&1\end{pmatrix}\quad(\text{column }k\text{ is class }k)$$
and the true label is pneumonia (class 2). Find the gradient $\partial E/\partial c_1$ of the cross-entropy $E=-\sum_kt_k\ln y_k$. (4 decimal places)`,
        ans: '(exp(2.5)-0.5)/(exp(2.5)+1+exp(-1))+0.5', ansTex: R`(y_1-t_1)-0.5(y_2-t_2)\approx1.3622`,
        sol: R`
**핵심.** 소프트맥스와 다중 클래스 교차 엔트로피의 짝은 $\partial E/\partial a_k=y_k-t_k$이고, 로짓 $a_k=\sum_dW_{dk}c_d$에 연쇄법칙을 쓰면
$$\frac{\partial E}{\partial c_d}=\sum_kW_{dk}(y_k-t_k),\qquad \nabla_{\mathbf c}E=\mathbf W(\mathbf y-\mathbf t).$$

1. 로짓(열마다 $\mathbf c$와 내적): $a_1=1\cdot2+0.5\cdot1+0=2.5$, $a_2=-0.5\cdot2+1\cdot1+0=0$, $a_3=0\cdot2-1\cdot1+0=-1$.
2. 소프트맥스: $e^{2.5}=12.1825$, $e^{0}=1$, $e^{-1}=0.3679$, 합 $13.5504$ → $\mathbf y=(0.8991,\ 0.0738,\ 0.0271)$.
3. $\mathbf t=(0,1,0)$이므로 $\mathbf y-\mathbf t=(0.8991,\ -0.9262,\ 0.0271)$.
4. $\mathbf W$의 첫 **행** $(1,-0.5,0)$과 내적: $\partial E/\partial c_1=0.8991+0.4631+0=1.3622$.

**답.** $\partial E/\partial c_1\approx1.3622$

**자주 하는 실수.** 첫 **열** $(1,0.5,0)$을 써서 $0.8991-0.4631=0.4360$으로 계산하는 경우입니다. $c_1$은 모든 로짓에 $W_{1k}$의 비율로 들어가므로 첫 행과 묶입니다. $\mathbf y-\mathbf t$ 대신 $\mathbf y$를 쓰면 $0.8622$가 됩니다.

**검산.** 수치 미분: $c_1$을 $2.01$로 바꾸면 $E$가 $2.6064$에서 $2.6200$으로 약 $0.0136$ 늘어 기울기 $1.36$과 맞습니다. 정답 클래스 확률이 $0.074$로 작아 오차가 크고($E=2.6064$), 기울기도 큽니다. 미세 조정에서 이 기울기는 ⟨class⟩ 위치로만 들어가고, 셀프 어텐션을 거쳐 모든 패치 토큰과 모수로 역전파됩니다.

관련: [[ch15:12.4|비전 트랜스포머]], [[ch07:6.4|오차함수와 출력 활성화]]` },
      { ch: 'ch15', type: 'mc', lv: 2, pts: 4, q: R`In both a U-net for segmentation and an encoder–decoder transformer for translation, “the decoder takes in and uses the representation produced by the encoder”. Which statement comparing the two architectures is correct?`,
        choices: [R`Like cross-attention, the skip connections of a U-net bring to each decoder position an average over all encoder positions, with weights determined by the input`, R`A causal mask is applied to cross-attention as well, so that the decoder cannot see the later tokens of the encoder sequence`, R`A U-net concatenates the encoder feature maps of the same resolution along the channel direction, position by position, whereas cross-attention compares queries coming from the decoder with the keys of the encoder representation $\mathbf Z$ and takes a weighted sum of the values`, R`The decoder of a U-net also generates the output pixels autoregressively, one at a time in raster order`], ans: 2,
        sol: R`
**핵심.** 인코더의 정보를 넘기는 방식이 다릅니다. U-net은 **위치로 고정된** 연결(같은 해상도, 같은 위치)이고, 교차 어텐션은 **내용으로 계산된** 연결입니다: $\mathbf Q=\mathbf X\mathbf W^{(q)}$, $\mathbf K=\mathbf Z\mathbf W^{(k)}$, $\mathbf V=\mathbf Z\mathbf W^{(v)}$, $\mathbf Y=\operatorname{Softmax}[\mathbf Q\mathbf K^T/\sqrt{D_k}]\mathbf V$.

1. U-net: 다운샘플링 층의 마지막 활성을 대응하는 업샘플링 층의 첫 채널들과 이어 붙입니다. 디코더 위치 $(i,j)$는 인코더의 같은 위치 $(i,j)$ 특징만 받고, 그 연결은 입력과 무관하게 고정입니다.
2. 교차 어텐션: 디코더 길이 $N'$, 인코더 길이 $N$이면 $N'\times N$ 어텐션 행렬로, 번역 단어마다 원문의 어느 단어를 볼지를 입력에 따라 정합니다.
3. 원문은 처음부터 모두 주어지므로 교차 어텐션에는 인과 마스크가 없습니다. 인과 마스크는 디코더의 셀프 어텐션에만 씁니다.
4. U-net은 모든 화소의 확률을 한 번의 순전파로 동시에 냅니다. 자기회귀 생성은 트랜스포머 디코더나 래스터 순서의 영상 생성 모델의 방식입니다.

**답.** ③

**보기 검토.** ① 입력에 따라 가중 평균하는 것은 교차 어텐션이고, U-net의 연결은 같은 위치끼리 고정입니다. ② 인과 마스크는 디코더 셀프 어텐션에만 있습니다. ③ 정답. ④ U-net은 전체 분할 지도를 한 번에 내며 자기회귀가 아닙니다.

관련: [[ch15:12.3b|인코더–디코더와 교차 어텐션]], [[ch14:10.5b|U-net]]` },
      { ch: 'ch15', type: 'open', lv: 3, pts: 11, proof: true, q: R`A convolution with kernel width 3, $D$ input and output channels, zero padding 1, stride 1, and no bias is applied to a one-dimensional sequence of length $N$ ($\mathbf X\in\mathbb R^{N\times D}$, with the tokens $\mathbf x_n\in\mathbb R^D$ stacked as rows). In row-vector form, $\mathbf y_n=\sum_{l\in\{-1,0,1\}}\mathbf x_{n+l}\mathbf K_l$ ($\mathbf K_l\in\mathbb R^{D\times D}$, $\mathbf x_0=\mathbf x_{N+1}=\mathbf 0$).

(1) Let $\mathbf S_l$ be the $N\times N$ matrix with $(\mathbf S_l)_{nm}=1$ if $m=n+l$ and 0 otherwise. Show that $\mathbf Y=\sum_l\mathbf S_l\mathbf X\mathbf K_l$.

(2) Compare this expression with the sum over heads of multi-head attention, $\mathbf Y=\sum_h\mathbf A_h\mathbf X\mathbf W_h^{(v)}\mathbf W_h^{(o)}$, and state which conditions three attention heads must satisfy for the convolution to be their attention. Make clear what constraint is needed on the attention matrices and on $\mathbf W_h^{(v)}\mathbf W_h^{(o)}$, respectively.

(3) Self-attention without positional encoding is permutation equivariant; show with a counterexample for $N=3$, $D=1$ that convolution is not, and explain what self-attention needs in order to learn a convolution-like operation.`,
        rubric: R`
- (1) $\mathbf S_l\mathbf X$의 $n$행이 $\mathbf x_{n+l}$이고 경계 행이 0 패딩과 같음 — 3점
- (2) $\mathbf A_h=\mathbf S_l$: 입력과 무관하게 상대 위치로 고정된 하드 어텐션 — 3점
- (2) $\mathbf W_h^{(v)}\mathbf W_h^{(o)}=\mathbf K_l$은 일반적으로 계수 $D$라 $D_v=D$가 필요함 — 2점
- (3) 순열 등변성이 깨지는 반례 — 2점
- (3) 위치 정보(위치 부호화)가 필요한 이유 — 1점`,
        sol: R`
**핵심.** 합성곱은 “누구를 볼지”를 **상대 위치**로 고정한 어텐션이고, 어텐션은 그것을 **내용**으로 매번 계산합니다. 교재의 머리별 합 $\mathbf Y=\sum_h\mathbf A_h\mathbf X\mathbf W_h^{(v)}\mathbf W_h^{(o)}$ 꼴에 두 연산을 함께 놓고 비교합니다.

(1) $\mathbf S_l\mathbf X$의 $n$행은 $\sum_m(\mathbf S_l)_{nm}\mathbf x_m$인데, $(\mathbf S_l)_{nm}$은 $m=n+l$일 때만 1이므로 이 합은 $\mathbf x_{n+l}$입니다. 경계에서 $n+l=0$ 또는 $N+1$이면 그런 열 $m$이 없어 그 행이 전부 0이고, 이것이 0 패딩 $\mathbf x_0=\mathbf x_{N+1}=\mathbf 0$과 같습니다. 따라서 $\mathbf S_l\mathbf X\mathbf K_l$의 $n$행은 $\mathbf x_{n+l}\mathbf K_l$이고, $l=-1,0,1$에 대해 더하면 $\mathbf Y=\sum_l\mathbf S_l\mathbf X\mathbf K_l$입니다.

(2) 오프셋 $l$ 하나에 머리 하나씩, 머리 3개를 두고 $\mathbf A_h=\mathbf S_l$, $\mathbf W_h^{(v)}\mathbf W_h^{(o)}=\mathbf K_l$로 놓으면 두 식이 같아집니다.
- 어텐션 행렬의 제약: $\mathbf S_l$의 각 행은 원소 하나만 1인 원-핫이므로, 경계가 아닌 행은 $a_{nm}\ge0$, $\sum_ma_{nm}=1$을 만족하는 **하드 어텐션**입니다(경계 행은 패딩 때문에 합이 0). 그러나 계수가 $\operatorname{Softmax}[\mathbf Q\mathbf K^T/\sqrt{D_k}]$처럼 입력에서 계산되지 않고, 입력과 무관하게 “$l$칸 옆”이라는 **상대 위치로 고정**되어 있습니다. 머리마다 모든 위치 $n$에서 같은 오프셋과 같은 $\mathbf K_l$을 쓰는 것이 합성곱의 가중치 공유입니다.
- 값·출력 행렬의 제약: $\mathbf W_h^{(v)}\in\mathbb R^{D\times D_v}$와 $\mathbf W_h^{(o)}\in\mathbb R^{D_v\times D}$의 곱은 계수가 $D_v$ 이하입니다. 일반적인 커널 행렬 $\mathbf K_l$은 계수가 $D$일 수 있으므로 $D_v=D$여야 합니다. 흔한 설정 $D_v=D/H$에서는 머리 하나가 계수 $D/H$ 이하인 커널만 나타냅니다.

(3) $N=3$, $D=1$, $\mathbf K_{-1}=1$, $\mathbf K_0=\mathbf K_1=0$, 곧 $y_n=x_{n-1}$(왼쪽 이웃 복사)을 봅니다. $\mathbf x=(1,2,3)$이면 $\mathbf y=(0,1,2)$. 앞의 두 토큰을 맞바꾸는 순열 $\mathbf P$로 $\mathbf P\mathbf x=(2,1,3)$을 넣으면 출력은 $(0,2,1)$이지만 $\mathbf P\mathbf y=(1,0,2)$이라 $\operatorname{Conv}(\mathbf P\mathbf X)\ne\mathbf P\operatorname{Conv}(\mathbf X)$입니다. 반면 위치 정보가 없는 셀프 어텐션은 어떤 투영 행렬을 쓰든 $\operatorname{Attention}(\mathbf P\mathbf X)=\mathbf P\operatorname{Attention}(\mathbf X)$이므로(토큰을 순서 없는 집합으로 봄), 순열 등변이 아닌 “왼쪽 이웃 복사”를 어떤 모수로도 나타낼 수 없습니다. 그래서 합성곱 같은 국소 연산을 배우려면 위치 부호화로 위치 정보를 넣어야 합니다. 사인파 부호화는 $\mathbf r_{n+k}=\mathbf M_k\mathbf r_n$처럼 상대 위치를 선형변환으로 담으므로, 쿼리·키 투영이 “$k$칸 옆”을 고르는 어텐션을 배울 수 있습니다.

**정리.** 합성곱은 상대 위치로 고정한 하드 어텐션에 모든 위치가 공유하는 커널을 붙인 것입니다. 어텐션은 이 고정을 풀어 내용으로 전역적으로 고르는 대신 국소성이라는 귀납적 편향을 내려놓아 자료가 더 필요합니다.

관련: [[ch15:12.1c|멀티헤드 어텐션의 머리별 합]], [[ch15:12.1d|순열 등변성과 위치 부호화]]` },
      { ch: 'ch15', type: 'open', lv: 3, pts: 12, q: R`A ViT ($P=16$, $D=768$, $H=12$ heads, position-wise MLP with $4D$ hidden units, including a ⟨class⟩ token) is used to classify $224\times224\times1$ chest X-rays. Count multiplications only, ignoring biases, softmax, and layer normalization.

(1) Find the number of tokens $N$ and the number of attention-matrix entries in one layer (summed over all heads).

(2) Count the multiplications of one transformer layer, split into (a) the Q, K, V and output projections, (b) the scores $\mathbf Q\mathbf K^T$ and the weighted sum $\operatorname{Softmax}[\cdot]\mathbf V$, and (c) the position-wise MLP; give each as a formula and evaluate it. Which part dominates, and, counting constants, how large must $N$ be for (b) to exceed the sum of the other two?

(3) On the same $14\times14$ grid, find the number of multiplications and the number of parameters (including biases) of a single $3\times3$ “same” convolutional layer with $768\to768$ channels, and compare them with the number of weights $12D^2$ of a transformer layer.

(4) When only $3\times3$ “same” convolutions with stride 1 are stacked, how many layers are needed for **every** output position of the $14\times14$ grid to see the whole grid? Compare this with a single self-attention layer, and explain what the inductive biases of the two architectures imply for medical imaging, where data are scarce.`,
        rubric: R`
- (1) $N=197$, 어텐션 원소 $12\cdot197^2=465{,}708$ — 2점
- (2) 세 항의 식 $4ND^2$, $2N^2D$, $8ND^2$와 그 값 — 3점
- (2) 투영과 MLP가 지배(비 $6D/N\approx23.4$), 문턱 $N\gt6D=4608$ — 2점
- (3) 합성곱 곱셈 $1.04\times10^9$, 모수 $5{,}309{,}184$와 $12D^2=7{,}077{,}888$ 비교 — 2점
- (4) 13층 대 1층 — 2점
- (4) 귀납적 편향과 자료 효율의 해석 — 1점`,
        sol: R`
**핵심.** 트랜스포머 층의 계산은 토큰 수에 선형인 부분($ND^2$: 투영과 MLP)과 제곱인 부분($N^2D$: 모든 토큰 쌍)으로 나뉩니다. 합성곱은 국소 창이라 계산이 위치 수에 선형이지만, 넓게 보려면 층을 쌓아야 합니다.

(1) 패치 토큰 $224^2/16^2=14\cdot14=196$개에 ⟨class⟩를 더해 $N=197$. 머리마다 어텐션 행렬이 $197^2=38{,}809$칸, 12머리 합 $465{,}708$칸입니다.

(2) 머리를 모은 투영은 $D\times D$ 크기입니다($HD_k=HD_v=D$).
- (a) $\mathbf X\mathbf W^{(q)}$, $\mathbf X\mathbf W^{(k)}$, $\mathbf X\mathbf W^{(v)}$, $\mathbf H\mathbf W^{(o)}$는 각각 $N\times D$에 $D\times D$를 곱해 $ND^2$이므로 $4ND^2=4\cdot197\cdot768^2=464{,}781{,}312$.
- (b) 머리마다 $\mathbf Q_h\mathbf K_h^T$가 $N^2D_k$, $\mathbf A_h\mathbf V_h$가 $N^2D_v$이고 머리를 더하면 $2N^2D=2\cdot38{,}809\cdot768=59{,}610{,}624$.
- (c) 토큰마다 $D\to4D\to D$이므로 $N(4D^2+4D^2)=8ND^2=929{,}562{,}624$.

합은 $1{,}453{,}954{,}560\approx1.45\times10^9$이고 (b)는 약 4.1%뿐입니다. (a)+(c) $=12ND^2$와 (b)의 비는 $\frac{12ND^2}{2N^2D}=\frac{6D}N=\frac{4608}{197}\approx23.4$로 투영과 MLP가 지배합니다. (b)가 더 커지려면 $2N^2D\gt12ND^2\iff N\gt6D=4608$이어야 합니다. 교재의 $O$ 표기 비교($N\gt D$)에 상수 6이 붙은 것입니다. 예컨대 패치를 $P=2$로 줄이면 $N=12{,}545$로 어텐션 쪽이 지배합니다.

(3) 합성곱: 출력 $14\cdot14\cdot768$개마다 $9\cdot768$번 곱하므로 $196\cdot9\cdot768^2=1{,}040{,}449{,}536\approx1.04\times10^9$. 모수 $(9\cdot768+1)\cdot768=5{,}309{,}184$. 트랜스포머 층의 가중치 $4D^2+8D^2=12D^2=7{,}077{,}888$은 그 약 1.33배이고, 계산량도 같은 규모($1.45\times10^9$ 대 $1.04\times10^9$)입니다. 비용은 비슷한데 한 층이 보는 범위가 크게 다릅니다.

(4) $L$층의 수용 영역은 한 변 $L(M-1)+1=2L+1$이고 각 위치를 가운데에 둡니다. 모서리 위치가 반대쪽 모서리(13칸 떨어짐)까지 보려면 $2L+1\ge2\cdot14-1=27$, 곧 $L\ge13$층이 필요합니다. 셀프 어텐션은 한 층에서 모든 토큰 쌍을 잇습니다.
해석: CNN은 “가까운 화소끼리 관련이 깊다”는 국소성과 이동 등변성을 구조로 넣어 적은 자료로도 잘 배우지만, 전역 관계는 깊이를 쌓아야 얻습니다. ViT는 첫 층부터 전역이지만 2차원 구조에 대한 편향이 패치 자르기뿐이라 그 구조를 자료에서 배워야 해 자료가 더 많이 필요합니다. 그래서 표본이 적은 의료 영상에서는 처음부터 학습하는 ViT보다 CNN이 유리하기 쉽고, ViT를 쓴다면 대규모 자료로 사전 학습한 모델을 미세 조정(LoRA 등)합니다.

관련: [[ch15:12.1c|트랜스포머 층의 계산량]], [[ch15:12.4|ViT 대 CNN]], [[ch13:10.2f|유효 수용 영역]]` },
    ],
  },
  );
})();
