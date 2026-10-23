/* 실전 모의고사 IX — 교재 7·8·9장(08–12단원) 2회. 2026-10-23 추가. 연습문제·다른 모의고사와 겹치지 않는 문항입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x9', roman: 'IX', kind: '교재 7·8·9장 범위 · 2회', title: '학습, 정규화, 역전파, 규제 심화', scopeText: '08–12 단원',
    desc: '네스테로프·Adam 여러 단계 손계산, 이차 오차의 최적 학습률과 곡률 비, ReLU 망 초기화, 배치 정규화의 순전파와 역전파, 층 정규화, 2-2-1 신경망의 순전파·역전파 전체, 야코비안·수치 미분·자동 미분, 일관된 규제·라쏘·조기 종료, 소프트 가중치 공유, 잔차 경로, 앙상블과 드롭아웃의 기댓값. II회보다 계산이 길고 유도가 많습니다.',
    minutes: 100, plot: 'lasso',
    problems: [
      { ch: 'ch08', type: 'num', lv: 1, pts: 3, q: R`A network is trained on $N=32{,}000$ training images by minibatch SGD with batch size $B=64$, using the power-law schedule $\eta^{(\tau)}=\eta^{(0)}(1+\tau/s)^c$ ($s=500$, $c=-0.5$, where $\tau$ is the number of updates). At the end of which epoch does the learning rate reach half its initial value? (integer)`, ans: '3', ansTex: R`\tau=1500\ \Rightarrow\ 3\text{번째 에폭}`,
        sol: R`
**핵심.** 한 에폭은 훈련 자료 전체를 한 번 훑는 것이므로 한 에폭의 갱신 횟수는 $N/B$입니다. 스케줄 식의 $\tau$는 에폭 수가 아니라 **갱신 횟수**라는 점이 이 문제의 함정입니다.

1. 한 에폭의 갱신 횟수: $N/B=32000/64=500$.
2. 절반 조건: $(1+\tau/500)^{-0.5}=\frac12\iff(1+\tau/500)^{0.5}=2\iff1+\tau/500=4\iff\tau=1500$.
3. 에폭으로 환산: $1500/500=3$ — 셋째 에폭이 끝나는 순간입니다.

**답.** 3번째 에폭

**자주 하는 실수.** $1+\tau/s=2$로 풀면($c=-1$일 때의 답) $\tau=500$, 1에폭이 나옵니다. $c=-0.5$는 제곱근이므로 $2$가 아니라 $2^2=4$가 되어야 합니다. $\tau$를 에폭 수로 착각해 “1500번째 에폭”이라 답하는 실수도 있습니다.

**검산.** $\tau=1500$을 넣으면 $\eta=\eta^{(0)}(1+3)^{-0.5}=\eta^{(0)}/2$. 이 스케줄은 계속 줄어 $\tau=7500$(15에폭)에서 $\eta^{(0)}(16)^{-0.5}=\eta^{(0)}/4$가 됩니다.

관련: [[ch08:7.3c|학습률 스케줄]], [[ch08:7.2|배치, 확률적, 미니배치 경사하강법]]
` },
      { ch: 'ch08', type: 'mc', lv: 2, pts: 4, q: R`A deep ReLU network in which every layer has $n_{\text{in}}=n_{\text{out}}=256$ is initialized with Xavier initialization (variance $2/(n_{\text{in}}+n_{\text{out}})$). Assuming the pre-activations have a symmetric distribution with zero mean, how does the variance of the pre-activations change each time a layer is passed?`,
        choices: [R`It stays roughly constant from layer to layer`, R`It is multiplied by about $\tfrac12$ per layer, so after 10 layers it is about $10^{-3}$ times its initial value`, R`It roughly doubles per layer and explodes`, R`It is multiplied by about $\tfrac14$ per layer, so after 5 layers it is about $10^{-3}$ times its initial value`], ans: 1,
        sol: R`
**핵심.** 가중치가 평균 0이고 서로 독립이며 입력과도 독립이면, 사전활성 $a_j=\sum_iw_{ji}z_i$의 분산은 $n_{\text{in}}\Var[w]\,\E[z_i^2]$입니다. ReLU는 대칭 분포의 음수 절반을 0으로 만들므로 $\E[z^2]=\frac12\Var[a_{\text{앞층}}]$입니다.

1. Xavier 분산: $\Var[w]=\frac2{256+256}=\frac1{256}$.
2. 한 층의 비: $\Var[a]=256\cdot\frac1{256}\cdot\frac12\Var[a_{\text{앞층}}]=\frac12\Var[a_{\text{앞층}}]$.
3. 10층이면 $2^{-10}\approx9.8\times10^{-4}\approx10^{-3}$배 — 활성과 기울기가 층마다 작아지는 기울기 소실입니다.
4. He 초기화 $\Var[w]=2/n_{\text{in}}=2/256$을 쓰면 비가 $256\cdot\frac2{256}\cdot\frac12=1$이라 분산이 유지됩니다. He가 Xavier보다 2배 큰 이유가 바로 ReLU의 $\frac12$을 보정하는 것입니다.

**답.** ② 층마다 약 $\frac12$배, 10층 뒤 약 $10^{-3}$배

**보기 검토.** ① 틀림 — 분산 유지는 Xavier가 tanh 같은 활성화에서 노리는 성질이고, ReLU가 만드는 $\frac12$이 빠졌습니다. ② 정답. ③ 틀림 — 층마다 2배가 되려면 가중치 분산이 $4/n_{\text{in}}$이어야 합니다. ④ 틀림 — $\frac12$을 가중치와 ReLU에서 두 번 곱한 실수입니다. $n_{\text{in}}=n_{\text{out}}$이면 Xavier 분산은 $1/n_{\text{in}}$이라 가중치 쪽에서는 분산이 줄지 않습니다.

관련: [[ch08:7.2b|파라미터 초기화]]
` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 4, q: R`The error $E(w)=2w^2$ is minimized with Nesterov momentum: at each step the derivative is evaluated at the look-ahead point $\tilde w=w^{(\tau-1)}+\mu\Delta w^{(\tau-2)}$, the velocity is updated to $\Delta w^{(\tau-1)}=-\eta E'(\tilde w)+\mu\Delta w^{(\tau-2)}$, and the weight moves to $w^{(\tau)}=w^{(\tau-1)}+\Delta w^{(\tau-1)}$. With learning rate 0.05, momentum coefficient 0.6, starting point $w^{(0)}=1$ and initial velocity 0, find the position $w^{(3)}$ after three moves. (4 decimal places)`, ans: '0.31232', ansTex: R`w^{(3)}=0.31232`,
        sol: R`
**핵심.** 네스테로프 모멘텀은 이전 속도 $\mu\Delta w$만큼 먼저 가 본 점(앞을 보는 점)에서 기울기를 계산합니다. $E'(w)=4w$이므로 매 단계 ① 앞을 보는 점 $\tilde w=w+\mu\Delta w$ ② 기울기 $4\tilde w$ ③ 새 속도 $\Delta w=-\eta\cdot4\tilde w+\mu\Delta w$ ④ $w\leftarrow w+\Delta w$ 순서로 계산합니다($\eta=0.05$, $\mu=0.6$).

1. $\tau=1$: $\tilde w=1+0.6\cdot0=1$, $E'=4$, $\Delta w^{(0)}=-0.2$, $w^{(1)}=0.8$.
2. $\tau=2$: $\tilde w=0.8+0.6(-0.2)=0.68$, $E'=2.72$, $\Delta w^{(1)}=-0.136-0.12=-0.256$, $w^{(2)}=0.544$.
3. $\tau=3$: $\tilde w=0.544+0.6(-0.256)=0.3904$, $E'=1.5616$, $\Delta w^{(2)}=-0.07808-0.1536=-0.23168$, $w^{(3)}=0.31232$.

**답.** $w^{(3)}=0.31232\approx0.3123$

**비교.** 같은 설정의 보통 모멘텀(기울기를 $w^{(\tau-1)}$에서 계산)은 $0.8,\ 0.52,\ 0.248$, 모멘텀 없는 경사하강법은 $0.8^\tau$이라 $0.512$입니다. 처음 몇 걸음은 보통 모멘텀이 더 빨리 내려가지만, 계속 돌리면 보통 모멘텀은 5번째 걸음에 $-0.100$으로 최소점 0을 지나쳐 $-0.165$까지 출렁이고, 네스테로프는 6번째 걸음에 0을 지나도 가장 멀리 가야 $-0.053$ 정도입니다. 앞을 보는 점이 최소점에 더 가까워 기울기가 작게 계산되므로 미리 브레이크를 거는 셈입니다.

**자주 하는 실수.** 기울기를 $w^{(\tau-1)}$에서 계산하면 보통 모멘텀의 값 $0.248$이 나옵니다. 첫 단계는 처음 속도가 0이라 두 방법이 같고 둘째 단계부터 갈라집니다.

**검산.** 첫 갱신은 모멘텀 항이 0이므로 보통 경사하강법 $1-0.05\cdot4=0.8$과 같아야 하고, 실제로 같습니다.

관련: [[ch08:7.3b|모멘텀]]
` },
      { ch: 'ch08', type: 'num', lv: 3, pts: 5, q: R`The gradient with respect to one weight is $+1$ at the first step and $-0.5$ at the second step. For Adam (with bias correction) with first-moment decay rate 0.9, second-moment decay rate 0.999, learning rate 0.01, $\delta\approx0$, and both moments initialized to 0, find the weight change $w^{(2)}-w^{(1)}$ at the second step. (4 significant figures)`, ans: '-0.01*(0.04/0.19)/sqrt(0.001249/0.001999)', ansTex: R`-0.01\cdot\tfrac{0.04/0.19}{\sqrt{0.001249/0.001999}}\approx-0.002663`,
        sol: R`
**핵심.** Adam은 기울기의 이동평균 $s$(1차 모멘트)와 기울기 제곱의 이동평균 $r$(2차 모멘트)을 0에서 시작해 갱신하고, $1-\beta^\tau$로 나눠 편향을 보정한 뒤 $\Delta w=-\eta\,\hat s/(\sqrt{\hat r}+\delta)$만큼 움직입니다. 여기서 $\beta_1=0.9$, $\beta_2=0.999$(Adam 원 논문의 값)입니다.

1. $\tau=1$: $s^{(1)}=0.1\cdot1=0.1$, $r^{(1)}=0.001\cdot1=0.001$. 보정하면 $\hat s=0.1/0.1=1$, $\hat r=0.001/0.001=1$이라 $\Delta w^{(1)}=-0.01$.
2. $\tau=2$의 1차 모멘트: $s^{(2)}=0.9\cdot0.1+0.1\cdot(-0.5)=0.09-0.05=0.04$.
3. 2차 모멘트: $r^{(2)}=0.999\cdot0.001+0.001\cdot0.25=0.000999+0.00025=0.001249$.
4. 편향 보정: $1-\beta_1^2=0.19$, $1-\beta_2^2=0.001999$이므로 $\hat s^{(2)}=0.04/0.19\approx0.2105$, $\hat r^{(2)}=0.001249/0.001999\approx0.6248$, $\sqrt{\hat r^{(2)}}\approx0.7905$.
5. $\Delta w^{(2)}=-0.01\times0.2105/0.7905\approx-0.002663$.

**답.** $w^{(2)}-w^{(1)}\approx-0.002663$

**해석.** 둘째 기울기가 음수라 보통 SGD라면 $w$가 커지는 쪽으로 움직이지만, Adam은 첫 기울기의 관성이 남아 $\hat s>0$이므로 여전히 $w$를 줄이는 쪽으로, 다만 첫 걸음의 약 4분의 1 크기로 움직입니다. 기울기 부호가 한 번 바뀐 것만으로 방향을 뒤집지 않는 것이 1차 모멘트(모멘텀) 부분의 효과입니다.

**자주 하는 실수.** 보정을 빼면 $-0.01\times0.04/\sqrt{0.001249}\approx-0.01132$로 약 4.25배 큰 걸음이 됩니다. 보정한 걸음과 보정하지 않은 걸음의 비는 $\frac{\sqrt{1-\beta_2^\tau}}{1-\beta_1^\tau}=\frac{\sqrt{0.001999}}{0.19}\approx0.235$로 1이 아니기 때문입니다($\tau=1$에서도 $\sqrt{0.001}/0.1\approx0.316$). $r$이 0에서 아주 천천히 자라($1-\beta_2=0.001$) 보정 없이는 분모가 지나치게 작습니다. $\hat r$에 제곱근을 씌우는 것을 잊는 실수도 흔합니다.

**검산.** 첫 걸음은 기울기 크기와 무관하게 $\eta$여야 합니다($\hat s/\sqrt{\hat r}=g/\lvert g\rvert$). 1번 단계의 $-0.01$이 이와 맞습니다.

관련: [[ch08:7.3d|AdaGrad, RMSProp, Adam]]
` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 4, q: R`In a batch normalization layer, the pre-activations of one unit over a minibatch ($K=4$) are $a_n=2,4,4,10$, with $\gamma=2$, $\beta=0.5$, $\delta=0$. If the gradients arriving from the output side during backpropagation are $\partial L/\partial\tilde a_n=0.2,\,-0.1,\,0.4,\,0.3$, find $\partial L/\partial\gamma$.`, ans: '0.2', ansTex: R`\sum_n\tfrac{\partial L}{\partial\tilde a_n}\hat a_n=0.2`,
        sol: R`
**핵심.** 순전파로 $\hat a_n=(a_n-\mu)/\sigma$를 구한 뒤, $\tilde a_n=\gamma\hat a_n+\beta$에서 $\partial\tilde a_n/\partial\gamma=\hat a_n$입니다. $\gamma$는 미니배치의 모든 예제가 공유하므로 기울기를 예제에 대해 더합니다: $\frac{\partial L}{\partial\gamma}=\sum_n\frac{\partial L}{\partial\tilde a_n}\hat a_n$.

1. 평균: $\mu=(2+4+4+10)/4=5$.
2. 분산(교재 정의, $1/K$): 편차 $-3,-1,-1,5$의 제곱합 $9+1+1+25=36$, $\sigma^2=9$, $\sigma=3$.
3. 표준화: $\hat a_n=(-1,\,-\tfrac13,\,-\tfrac13,\,\tfrac53)$. 출력은 $\tilde a_n=2\hat a_n+0.5=(-1.5,\,-0.1667,\,-0.1667,\,3.833)$.
4. $\frac{\partial L}{\partial\gamma}=0.2(-1)+(-0.1)(-\tfrac13)+0.4(-\tfrac13)+0.3(\tfrac53)=-0.2+0.0333-0.1333+0.5=0.2$.

**답.** $\partial L/\partial\gamma=0.2$

**덧붙임.** 같은 방식으로 $\partial L/\partial\beta=\sum_n\partial L/\partial\tilde a_n=0.8$입니다. 사전활성 쪽 기울기 $\partial L/\partial a_n$은 단순히 $\gamma/\sigma$배 한 $(0.133,\,-0.067,\,0.267,\,0.2)$가 **아닙니다**. $\mu$와 $\sigma$도 모든 $a_n$의 함수이기 때문이며, 그 경로까지 넣으면 $(0.0333,\,-0.1889,\,0.1444,\,0.0111)$이 되어 합이 0입니다(다음 문제).

**자주 하는 실수.** $\hat a_n$ 대신 출력 $\tilde a_n$을 곱하면 $0.8$이 나옵니다. 분산을 $1/(K-1)$로 나누면 $\sigma=\sqrt{12}$가 되어 값이 달라집니다.

**검산.** $\hat a$의 평균은 $(-1-\frac13-\frac13+\frac53)/4=0$, 제곱평균은 $(1+\frac19+\frac19+\frac{25}9)/4=1$ — 표준화가 맞습니다.

관련: [[ch09:7.4b|배치 정규화]]
` },
      { ch: 'ch09', type: 'mc', lv: 3, pts: 4, q: R`The minibatch pre-activations $a_1,\dots,a_K$ of one unit pass through a batch normalization layer ($\delta=0$) and become $\tilde a_n=\gamma\hat a_n+\beta$. Of the following statements about the backpropagated gradients, choose the one that holds whatever the loss $L$ is.`,
        choices: [R`$\dfrac{\partial L}{\partial a_n}=\dfrac{\gamma}{\sigma}\dfrac{\partial L}{\partial\tilde a_n}$`, R`$\dfrac{\partial L}{\partial\beta}=0$`, R`The gradient with respect to the bias $b$ of the linear layer immediately before batch normalization is $\sum_n\dfrac{\partial L}{\partial\tilde a_n}$`, R`$\displaystyle\sum_{n=1}^K\frac{\partial L}{\partial a_n}=0$`], ans: 3,
        sol: R`
**핵심.** 미니배치의 모든 $a_n$에 같은 상수 $c$를 더하면 평균도 $c$만큼 움직이고 편차 $a_n-\mu$와 분산은 그대로이므로, 출력 $\tilde a_n$이 하나도 바뀌지 않습니다. 즉 $L(a_1+c,\dots,a_K+c)=L(a_1,\dots,a_K)$입니다.

1. 이 항등식을 $c$로 미분하고 $c=0$을 넣으면 연쇄법칙으로 $\sum_n\frac{\partial L}{\partial a_n}\cdot1=0$.
2. 앞 선형층의 편향 $b$는 모든 예제의 $a_n$에 똑같이 더해지므로 $\frac{\partial L}{\partial b}=\sum_n\frac{\partial L}{\partial a_n}=0$입니다. 배치 정규화 앞의 편향은 학습되지 않는 군더더기이고, 그 역할을 $\beta$가 맡습니다.
3. $\delta=0$이면 모든 $a_n$을 양수 $c$배 해도 출력이 같으므로, 같은 방법으로 $\sum_n\frac{\partial L}{\partial a_n}(a_n-\mu)=0$도 성립합니다.

**답.** ④

**보기 검토.** ① 틀림 — $\mu$와 $\sigma$ 자체가 모든 $a_n$의 함수라 $a_n$을 바꾸면 다른 예제의 $\hat a_m$도 바뀝니다. 이 경로를 빼먹는 것이 가장 흔한 실수입니다(앞 문제 수치에서 $\gamma/\sigma$배는 $0.133,\dots$이지만 참값은 $0.0333,\dots$). ② 틀림 — $\partial L/\partial\beta=\sum_n\partial L/\partial\tilde a_n$으로 일반적으로 0이 아니며, $\beta$는 경사하강법으로 학습됩니다. ③ 틀림 — 그 값은 $\partial L/\partial\beta$입니다. 앞층 편향의 기울기는 2번 단계처럼 0입니다. ④ 정답 — 평행이동에 대한 불변성에서 나옵니다.

관련: [[ch09:7.4b|배치 정규화]]
` },
      { ch: 'ch09', type: 'num', lv: 1, pts: 3, q: R`In a transformer that generates radiology reports, the pre-activations of 4 hidden units for one token are $\mathbf a=(1,2,3,6)$. If the layer normalization ($\delta=0$) parameters of the fourth unit are $\gamma_4=2$ and $\beta_4=-1$, find the output $\tilde a_4$. (4 decimal places)`, ans: '2*3/sqrt(3.5)-1', ansTex: R`2\cdot\tfrac{3}{\sqrt{3.5}}-1\approx2.2071`,
        sol: R`
**핵심.** 층 정규화는 **한 예제(토큰) 안의 유닛들**에 걸쳐 평균과 분산을 구합니다: $\mu_n=\frac1M\sum_ia_{ni}$, $\sigma_n^2=\frac1M\sum_i(a_{ni}-\mu_n)^2$ (교재 (7.59)의 오타를 바로잡은 식). 그다음 유닛별 $\gamma_i,\beta_i$로 다시 척도화합니다.

1. 평균: $\mu_n=(1+2+3+6)/4=3$.
2. 분산: 편차 $-2,-1,0,3$의 제곱합 $4+1+0+9=14$, $\sigma_n^2=14/4=3.5$, $\sigma_n\approx1.8708$.
3. 표준화: $\hat a_4=(6-3)/1.8708\approx1.6036$ (나머지는 $-1.0690,\,-0.5345,\,0$).
4. 출력: $\tilde a_4=2\times1.6036-1\approx2.2071$.

**답.** $\tilde a_4\approx2.2071$

**자주 하는 실수.** $1/(M-1)$로 나눠 $\sigma_n^2=14/3$을 쓰면 $\hat a_4\approx1.389$가 됩니다. 오타대로 유닛별 평균 $\mu_i$를 빼면 한 예제만으로는 계산 자체가 되지 않습니다. $\gamma_4$를 곱하기 전에 $\beta_4$를 더하는 순서 실수도 있습니다.

**검산.** $\hat{\mathbf a}$의 합은 $-1.069-0.5345+0+1.604\approx0$, 제곱합은 $14/3.5=4=M$ — 평균 0, 분산 1입니다. 이 계산에는 다른 예제가 전혀 필요 없으므로 배치 크기가 1이어도, 추론 때도 같은 식을 씁니다.

관련: [[ch09:7.4c|층 정규화]]
` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 4, q: R`To check backpropagation code, the derivative of $E(w)=e^w$ at $w=0$ (true value 1) is approximated with $\epsilon=0.1$ by the forward difference $\frac{E(w+\epsilon)-E(w)}{\epsilon}$ and by the central difference $\frac{E(w+\epsilon)-E(w-\epsilon)}{2\epsilon}$. How many times larger is the error of the forward difference than the error of the central difference? (1 decimal place)`, ans: '((exp(0.1)-1)/0.1-1)/((exp(0.1)-exp(-0.1))/0.2-1)', ansTex: R`\tfrac{0.051709}{0.0016675}\approx31.0`,
        sol: R`
**핵심.** 테일러 전개 $E(w\pm\epsilon)=E\pm\epsilon E'+\frac{\epsilon^2}2E''\pm\frac{\epsilon^3}6E'''+\cdots$에서 전방 차분은 $E'+\frac\epsilon2E''+\cdots$로 오차가 $O(\epsilon)$이고, 중앙 차분은 짝수 차 항이 상쇄되어 $E'+\frac{\epsilon^2}6E'''+\cdots$로 오차가 $O(\epsilon^2)$입니다.

1. $e^{0.1}\approx1.105171$, $e^{-0.1}\approx0.904837$.
2. 전방 차분: $(1.105171-1)/0.1=1.051709$, 오차 $0.051709$.
3. 중앙 차분: $(1.105171-0.904837)/0.2=1.001668$, 오차 $0.0016675$.
4. 비: $0.051709/0.0016675\approx31.0$.

**답.** 약 $31.0$배

**검산(차수).** 주요 항만 쓰면 전방 $\frac\epsilon2E''=0.05$, 중앙 $\frac{\epsilon^2}6E'''=0.001667$이라 비가 $3/\epsilon=30$이고, 고차항 때문에 실제로는 $31.0$입니다. $\epsilon=0.01$로 줄이면 오차가 각각 $0.0050167$(10분의 1)과 $1.667\times10^{-5}$(100분의 1)이 되어 비가 약 301 — 전방은 $O(\epsilon)$, 중앙은 $O(\epsilon^2)$로 줄어드는 것이 확인됩니다. 다만 $\epsilon$을 한없이 줄이면 반올림 오차가 커집니다.

**자주 하는 실수.** 주요 항의 비 $3/\epsilon=30$을 그대로 답하면 3% 어긋납니다. 또 중앙 차분은 더 정확한 대신 가중치마다 함수를 두 번 평가해야 하므로, 가중치 $W$개 전체를 검사하면 $O(W^2)$의 약 두 배 비용이 듭니다(역전파는 $O(W)$).

관련: [[ch10:8.1c|2층 신경망 예제와 수치 미분]]
` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 4, q: R`Two features $\mathbf x=(x_1,x_2)$ extracted from a CT image are fed into a network with 2 tanh hidden units and 2 linear outputs. The first-layer weights are $\mathbf W^{(1)}=\begin{pmatrix}1&-2\\0.5&1\end{pmatrix}$ (($j,i$) element $w^{(1)}_{ji}$: input $i$ → hidden $j$), the second-layer weights are $\mathbf W^{(2)}=\begin{pmatrix}2&1\\-1&3\end{pmatrix}$ (($k,j$) element $w^{(2)}_{kj}$: hidden $j$ → output $k$), and at the current input the hidden activations are $\mathbf z=(0,\,0.6)$. When the input changes by $\Delta\mathbf x=(0.01,\,-0.02)$, find $\Delta y_1$ as approximated using the Jacobian.`, ans: '0.0904', ansTex: R`J_{11}(0.01)+J_{12}(-0.02)=0.0904`,
        sol: R`
**핵심.** 야코비안 $J_{ki}=\partial y_k/\partial x_i$는 역전파와 같은 재귀로 구합니다. 출력이 선형이라 $\partial y_k/\partial a_l=\delta_{kl}$에서 시작하고, 은닉 유닛 $j$에서 $\frac{\partial y_k}{\partial a_j}=h'(a_j)\,w^{(2)}_{kj}$, 입력까지 $J_{ki}=\sum_jw^{(1)}_{ji}\frac{\partial y_k}{\partial a_j}$입니다. 그리고 $\Delta y_k\simeq\sum_iJ_{ki}\Delta x_i$.

1. tanh의 기울기 $h'(a_j)=1-z_j^2$: $h'_1=1-0=1$, $h'_2=1-0.36=0.64$.
2. 출력 1에 대한 은닉 쪽 값: $\frac{\partial y_1}{\partial a_1}=1\cdot2=2$, $\frac{\partial y_1}{\partial a_2}=0.64\cdot1=0.64$.
3. 입력 쪽: $J_{11}=2\cdot1+0.64\cdot0.5=2.32$, $J_{12}=2\cdot(-2)+0.64\cdot1=-3.36$.
4. $\Delta y_1\simeq2.32\times0.01+(-3.36)\times(-0.02)=0.0232+0.0672=0.0904$.

**답.** $\Delta y_1\approx0.0904$

**자주 하는 실수.** $\mathbf W^{(1)}$을 전치해 $w^{(1)}_{ij}$를 쓰면 $J_{12}=2\cdot0.5+0.64\cdot1=1.64$로 부호까지 틀립니다. $h'$을 시그모이드의 식 $z(1-z)$로 쓰는 실수도 흔합니다.

**검산.** 같은 방법으로 $J_{21}=-1\cdot1+3\cdot0.64\cdot0.5=-0.04$, $J_{22}=-1\cdot(-2)+3\cdot0.64\cdot1=3.92$. 행렬로는 $\mathbf J=\mathbf W^{(2)}\diag(h')\mathbf W^{(1)}=\begin{pmatrix}2.32&-3.36\\-0.04&3.92\end{pmatrix}$로 같은 값입니다. $x_2$에 대한 민감도가 큰 것은 $\lvert w^{(1)}_{12}\rvert=2$인 연결이 포화되지 않은 유닛 1($h'=1$)을 지나기 때문입니다.

관련: [[ch10:8.1d|야코비안과 헤시안]]
` },
      { ch: 'ch10', type: 'mc', lv: 2, pts: 4, q: R`We want to compute, by automatic differentiation, the **entire** Jacobian of a decoder network $\mathbf f:\mathbb R^3\to\mathbb R^{1024}$ that takes 3 latent variables and produces a $32\times32=1024$-pixel image. Which method finishes in the fewest passes?`,
        choices: [R`Forward mode, 3 passes — each pass gives the derivatives of all outputs with respect to one input (one column of the Jacobian)`, R`Reverse mode, 3 passes — each pass gives one column of the Jacobian`, R`Reverse mode, 1 pass — reverse mode gives all the derivatives at once`, R`Forward mode, 1024 passes — one output pixel per pass`], ans: 0,
        sol: R`
**핵심.** 전진 모드는 입력 방향 하나를 정해 접선 $\dot v_i=\partial v_i/\partial z_d$를 순전파와 함께 밀고 나가므로, 한 패스에 **입력 하나에 대한 모든 출력의 미분**(야코비안의 한 열)을 줍니다. 후진 모드는 출력 하나에서 수반 변수 $\bar v_i=\partial f_k/\partial v_i$를 거꾸로 전달해, 한 패스에 **출력 하나의 모든 입력에 대한 미분**(한 행)을 줍니다.

1. $1024\times3$ 야코비안: 전진 모드는 입력 수 $D=3$번, 후진 모드는 출력 수 $K=1024$번.
2. 입력이 적고 출력이 많으므로 전진 모드가 훨씬 유리합니다. 전진 모드는 중간값을 쓰고 바로 버릴 수 있어 메모리도 적게 씁니다.
3. 신경망 **학습**에서 후진 모드가 압도적인 것은 출력이 스칼라 오차 하나($K=1$)이고 입력(파라미터)이 수백만 개이기 때문입니다. 크기 관계가 반대면 결론도 반대입니다.

**답.** ① 전진 모드 3번

**보기 검토.** ① 정답. ② 틀림 — 후진 모드 한 패스가 주는 것은 열이 아니라 행(출력 하나)이므로 1024번이 필요합니다. ③ 틀림 — “한 번에 모든 미분”은 출력이 스칼라일 때만 맞습니다. ④ 틀림 — 출력마다 한 패스는 후진 모드의 셈이고, 전진 모드는 입력마다 한 패스입니다.

관련: [[ch10:8.2|자동 미분]]
` },
      { ch: 'ch11', type: 'mc', lv: 1, pts: 3, q: R`Pathology slide patches have no fixed orientation, so we want to use symmetry under rotations $T$ by multiples of $90^\circ$ as an inductive bias. For a tumor-region segmentation network $S$ and a malignancy classification network $C$, which of the following is correct?`,
        choices: [R`The segmentation network should satisfy $S(T(I))=S(I)$`, R`Data augmentation with rotated copies builds rotation invariance exactly into the network architecture`, R`$C(T(I))=C(I)$ is the special case of equivariance in which the transformation on the output side is the identity`, R`Rotations by multiples of $90^\circ$ do not form a group, because they have no inverses`], ans: 2,
        sol: R`
**핵심.** 등변성은 $S(T(I))=\tilde T(S(I))$ — 입력을 변환하면 출력도 대응하는 방식으로 변환됩니다(분할에서는 같은 회전). 불변성 $C(T(I))=C(I)$는 출력 쪽 변환이 항등인 특수한 경우입니다.

1. 패치를 돌리면 종양 영역 지도도 똑같이 돌아가야 하므로 분할은 **등변**: $S(T(I))=T(S(I))$.
2. 악성 여부는 방향과 무관하므로 분류는 **불변**: $C(T(I))=C(I)$.
3. 불변성을 넣는 방법은 전처리, 규제, 자료 증강, 망 구조 설계 네 가지이고, 구조가 불변성을 **정확히** 보장하는 것은 마지막뿐입니다.

**답.** ③

**보기 검토.** ① 틀림 — 분할 지도가 회전 전과 같으면 돌아간 종양의 위치를 엉뚱하게 표시합니다. 분할은 불변이 아니라 등변이어야 합니다. ② 틀림 — 증강은 변환된 예를 보여 주어 불변성을 **자료로부터 근사적으로** 배우게 할 뿐, 구조가 보장하지는 않습니다. ③ 정답. ④ 틀림 — $\{0^\circ,90^\circ,180^\circ,270^\circ\}$는 합성에 닫혀 있고 항등원($0^\circ$)과 역원($90^\circ$의 역원은 $270^\circ$)이 있어 군을 이룹니다(교재가 든 예).

관련: [[ch11:9.1b|대칭, 불변성, 등변성]]
` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 4, q: R`A two-layer network that predicts a risk score $y$ from tumor diameter $x$ (mm) uses the consistent regularizer $\frac{\lambda_1}2\sum_{w\in\mathcal W_1}w^2+\frac{\lambda_2}2\sum_{w\in\mathcal W_2}w^2$ ($\lambda_1=0.4$, $\lambda_2=0.3$, biases excluded). The data are transformed by converting the input to cm and subtracting the mean, $\tilde x=0.1x-5$, and by changing the output to $\tilde y=2y+1$. To regularize **the same function** to the same degree on the transformed data, what must the ratio $\tilde\lambda_1/\tilde\lambda_2$ of the new coefficients be? (4 decimal places)`, ans: '0.01*0.4/(0.3/4)', ansTex: R`\tfrac{a^2\lambda_1}{\lambda_2/c^2}=\tfrac{0.004}{0.075}\approx0.0533`,
        sol: R`
**핵심.** 입력을 $x\to ax+b$로 바꾸면 첫 층 가중치를 $w\to w/a$로(편향은 따로 보정), 출력을 $y\to cy+d$로 바꾸면 둘째 층 가중치를 $w\to cw$로 바꿔 같은 함수를 얻습니다. 규제항이 변하지 않으려면 단원에서 바로잡은 식대로 $\tilde\lambda_1=a^2\lambda_1$, $\tilde\lambda_2=\lambda_2/c^2$입니다.

1. 여기서 $a=0.1$, $b=-5$, $c=2$, $d=1$. 편향은 규제하지 않으므로 $b,d$는 계수에 영향이 없습니다.
2. 첫 층: $\frac{\tilde\lambda_1}2\sum(w/a)^2=\frac{\lambda_1}2\sum w^2\Rightarrow\tilde\lambda_1=a^2\lambda_1=0.01\times0.4=0.004$.
3. 둘째 층: $\frac{\tilde\lambda_2}2\sum(cw)^2=\frac{\lambda_2}2\sum w^2\Rightarrow\tilde\lambda_2=\lambda_2/c^2=0.3/4=0.075$.
4. 비: $0.004/0.075\approx0.0533$.

**답.** $\tilde\lambda_1/\tilde\lambda_2\approx0.0533$

**자주 하는 실수.** 교재(와 PRML)에 인쇄된 $\lambda_1\to a^{1/2}\lambda_1$, $\lambda_2\to c^{-1/2}\lambda_2$를 쓰면 $\frac{\sqrt{0.1}\times0.4}{0.3/\sqrt2}\approx0.596$이 나옵니다. 직접 대입하면 제곱이 맞습니다. 방향 감각으로도 확인할 수 있습니다: cm로 바꾸면 같은 함수의 첫 층 가중치가 10배 커지므로($w/a$), 같은 정도로 벌하려면 $\lambda_1$은 100분의 1이 되어야 합니다.

**검산.** 원래 비 $0.4/0.3\approx1.333$에 $a^2c^2=0.04$를 곱하면 $0.0533$으로 같습니다. 모든 가중치·편향에 하나의 $\lambda$를 쓰는 단순 가중치 감쇠로는 이런 조정이 불가능해, 같은 함수를 단위에 따라 다르게 벌하게 됩니다.

관련: [[ch11:9.2b|일관된 규제와 일반화된 가중치 감쇠]]
` },
      { ch: 'ch11', type: 'num', lv: 3, pts: 5, q: R`A quadratic error with diagonal Hessian (axes aligned with the eigenvectors) plus lasso regularization is $\widetilde E(\mathbf w)=\frac{h_1}2(w_1-w_1^\star)^2+\frac{h_2}2(w_2-w_2^\star)^2+\frac\lambda2\big(\lvert w_1\rvert+\lvert w_2\rvert\big)$, with $h_1=4$, $h_2=0.5$, $\mathbf w^\star=(0.6,\,0.4)$, $\lambda=1$. Find $\lVert\hat{\mathbf w}\rVert_1=\lvert\hat w_1\rvert+\lvert\hat w_2\rvert$ at the minimizer $\hat{\mathbf w}$.`, ans: '0.475', ansTex: R`\hat{\mathbf w}=(0.475,\,0)\ \Rightarrow\ 0.475`,
        sol: R`
**핵심.** 항들이 좌표별로 분리되므로 성분마다 1차원 문제 $\frac h2(w-w^\star)^2+\frac\lambda2\lvert w\rvert$를 풉니다. $w>0$ 쪽에서 미분하면 $h(w-w^\star)+\frac\lambda2=0$, $w=w^\star-\frac\lambda{2h}$이고, 이 값이 양수가 아니면 해는 0입니다(소프트 문턱): $\hat w=\operatorname{sign}(w^\star)\max\big(0,\ \lvert w^\star\rvert-\frac\lambda{2h}\big)$.

1. $w_1$: 문턱 $\frac\lambda{2h_1}=\frac18=0.125<0.6$ → $\hat w_1=0.6-0.125=0.475$.
2. $w_2$: 문턱 $\frac\lambda{2h_2}=1>0.4$ → $\hat w_2=0$. 실제로 $w_2>0$이면 기울기 $0.5(w_2-0.4)+0.5>0$, $w_2<0$이면 $0.5(w_2-0.4)-0.5<0$이라 0에서만 최소입니다.
3. $\lVert\hat{\mathbf w}\rVert_1=0.475+0=0.475$.

**답.** $0.475$

**비교(가중치 감쇠).** 같은 $\lambda$로 $\frac\lambda2(w_1^2+w_2^2)$를 쓰면 $\hat w_j=\frac{h_j}{h_j+\lambda}w_j^\star$이므로 $(0.8\times0.6,\ \frac{0.5}{1.5}\times0.4)=(0.48,\ 0.1333)$ — 둘 다 0이 아닌 값으로 줄어들 뿐입니다. 라쏘는 곡률이 작은(오차가 둔감한) $w_2$를 **정확히 0**으로 만들어 특징 선택을 합니다. 제약 영역 $\lvert w_1\rvert+\lvert w_2\rvert\le\eta$의 꼭짓점이 축 위에 있기 때문입니다.

**자주 하는 실수.** 문턱을 확인하지 않고 $\hat w_2=0.4-1=-0.6$으로 두면 $1.075$가 나옵니다. 이 식은 $w_2>0$을 가정하고 얻은 것이라 음수가 나오면 가정이 깨진 것입니다. 벌점을 $\lambda\lvert w\rvert$로 착각해 문턱을 $\lambda/h$로 쓰면 $\hat w_1=0.35$가 됩니다.

**검산.** $\hat w_1=0.475$에서 $4(0.475-0.6)+0.5=-0.5+0.5=0$ — 정류 조건이 맞습니다.

관련: [[ch11:9.2b|일관된 규제와 일반화된 가중치 감쇠]]
` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 3, q: R`A quadratic error is minimized by gradient descent with learning rate $\rho=0.1$ starting from the origin, and training is stopped early. What is the minimum number of updates needed for the component along the eigendirection with curvature $\eta_j=0.5$ to reach at least 90% of the corresponding component $w_j^\star$ of the minimum? (integer)`, ans: '45', ansTex: R`\tau\ge\tfrac{\ln0.1}{\ln0.95}\approx44.89\ \Rightarrow\ 45`,
        sol: R`
**핵심.** 이차 오차를 원점에서 경사하강하면 고유방향 성분이 $w_j^{(\tau)}=\{1-(1-\rho\eta_j)^\tau\}w_j^\star$로 자랍니다. 조건 $1-(1-\rho\eta_j)^\tau\ge0.9$를 $\tau$에 대해 풉니다.

1. 한 걸음의 인수: $1-\rho\eta_j=1-0.05=0.95$.
2. $0.95^\tau\le0.1\iff\tau\ge\frac{\ln0.1}{\ln0.95}=\frac{-2.3026}{-0.05129}\approx44.89$ (음수 $\ln0.95$로 나누므로 부등호가 뒤집힙니다).
3. 정수로 올려 $\tau=45$: $1-0.95^{45}\approx0.9006$이고, $\tau=44$이면 $0.8953$으로 모자랍니다.

**답.** 45번

**해석.** $\tau=45$에서 멈추면 유효 규제 계수는 $\lambda\approx(\rho\tau)^{-1}=1/4.5\approx0.222$입니다. 곡률이 $0.005$로 작은 방향은 같은 45번 동안 $1-(1-0.0005)^{45}\approx0.0223$배밖에 자라지 않아, 같은 $\lambda$의 가중치 감쇠 $\frac{0.005}{0.005+0.222}\approx0.0220$과 거의 같습니다. 곡률이 큰 방향은 빨리 수렴하고 둔감한 방향은 거의 움직이지 않은 채 멈추는 것이 조기 종료의 규제 효과입니다(큰 곡률 쪽은 $0.90$ 대 $0.69$로 정량적으로는 다릅니다).

**자주 하는 실수.** $0.95^\tau\le0.9$로 세우면(“90%가 남을 때”로 착각) $\tau\ge2.05$라 3번이 나옵니다. 성분은 $1-0.95^\tau$로 **자라는** 양입니다.

관련: [[ch11:9.3|학습 곡선, 조기 종료, 이중 하강]]
` },
      { ch: 'ch12', type: 'num', lv: 3, pts: 5, q: R`In soft weight sharing, the prior over the weights is a mixture of two Gaussian clusters. Cluster A has center 0, standard deviation 0.5 and mixing coefficient 0.7; cluster B has center 1, standard deviation 0.5 and mixing coefficient 0.3. With regularization strength $\lambda=1$, find the partial derivative of the regularization term $\lambda\Omega(\mathbf w)$ with respect to one weight, at the point where that weight is $w=0.6$. (4 decimal places)`, ans: '(2.4*0.7-1.6*0.3*exp(0.4))/(0.7+0.3*exp(0.4))', ansTex: R`2.4\gamma_1-1.6\gamma_2\approx0.8400`,
        sol: R`
**핵심.** 책임도 $\gamma_j(w)=\frac{\pi_j\N(w\mid\mu_j,\sigma_j^2)}{\sum_k\pi_k\N(w\mid\mu_k,\sigma_k^2)}$는 가중치 $w$가 군집 $j$에 속할 사후확률이고, $\Omega=-\sum_i\ln\sum_j\pi_j\N(w_i\mid\mu_j,\sigma_j^2)$를 미분한 규제항의 기울기 $\lambda\sum_j\gamma_j(w)\frac{w-\mu_j}{\sigma_j^2}$는 각 군집 중심 쪽으로 책임도에 비례하는 힘으로 $w$를 끌어당깁니다. 군집 A를 $j=1$ ($\pi_1=0.7$, $\mu_1=0$), B를 $j=2$ ($\pi_2=0.3$, $\mu_2=1$)로 두고 $\sigma_1=\sigma_2=0.5$입니다.

1. 두 성분의 분산이 같아 정규화 상수가 약분되므로 지수 부분만 비교합니다: $\N(0.6\mid0,0.25)\propto e^{-0.36/0.5}=e^{-0.72}$, $\N(0.6\mid1,0.25)\propto e^{-0.16/0.5}=e^{-0.32}$.
2. $\gamma_1=\frac{0.7e^{-0.72}}{0.7e^{-0.72}+0.3e^{-0.32}}=\frac{0.7}{0.7+0.3e^{0.4}}=\frac{0.7}{0.7+0.4475}\approx0.6100$, $\gamma_2\approx0.3900$.
3. 각 항: $\frac{w-\mu_1}{\sigma^2}=\frac{0.6}{0.25}=2.4$, $\frac{w-\mu_2}{\sigma^2}=\frac{-0.4}{0.25}=-1.6$.
4. 기울기: $0.6100\times2.4+0.3900\times(-1.6)=1.4640-0.6240\approx0.8400$.

**답.** $\approx0.8400$

**해석.** 기울기가 양수이므로 경사하강법은 $w$를 **줄이는** 쪽, 즉 $\mu_1=0$ 군집 쪽으로 끌어당깁니다. $w=0.6$은 거리로는 $\mu_2=1$에 더 가깝지만(0.4 대 0.6), 혼합 계수 $\pi_1=0.7$이 커서 책임도가 $\gamma_1=0.61$로 더 크고, 거리에 비례하는 당김($2.4$ 대 $1.6$)까지 곱해진 결과입니다. 가중치 감쇠(중심 0인 군집 하나)는 늘 0 쪽으로 당기지만, 여기서는 군집 구성에 따라 방향이 정해집니다.

**자주 하는 실수.** $\pi_j$를 빼고 책임도를 구하면 $\gamma_1=\frac1{1+e^{0.4}}\approx0.4013$이 되어 기울기가 $0.4013(2.4)-0.5987(1.6)\approx0.0052$로 거의 0이 됩니다. $\sigma_j^2$ 대신 $\sigma_j$로 나누면 값이 절반이 됩니다.

관련: [[ch12:9.4|파라미터 공유와 소프트 가중치 공유]]
` },
      { ch: 'ch12', type: 'num', lv: 2, pts: 3, q: R`In a residual network simplified to one dimension, $z_l=F_l(z_{l-1})+z_{l-1}$ ($l=1,\dots,5$, $z_0=x$, $y=z_5$), let each block be linear, $F_l(z)=0.1z$. Find the derivative $dy/dx$ with respect to the input, and compare it with a network that stacks the same blocks without residual connections, $z_l=F_l(z_{l-1})$. (answer: the value for the residual network, 4 decimal places)`, ans: '1.1^5', ansTex: R`(1+0.1)^5\approx1.6105`,
        sol: R`
**핵심.** 잔차 블록 하나의 미분은 $\frac{dz_l}{dz_{l-1}}=F_l'+1$ — 항등 경로의 1이 더해집니다. 연쇄법칙으로 블록들의 미분을 곱합니다.

1. 블록마다 $\frac{dz_l}{dz_{l-1}}=0.1+1=1.1$.
2. 다섯 블록: $\frac{dy}{dx}=1.1^5\approx1.6105$.
3. 잔차 연결이 없으면 $\frac{dy}{dx}=0.1^5=10^{-5}$ — 기울기가 사실상 사라집니다.

**답.** $1.1^5\approx1.6105$ (잔차 없이 $10^{-5}$)

**펼친 관점으로 검산.** 펼친 식은 블록마다 “거침($\times0.1$)/건너뜀($\times1$)”을 고른 $2^5=32$개 경로의 합입니다. $k$개 블록을 거치는 경로는 $\binom5k$개이고 각각 $0.1^k$을 기여하므로 $1+5(0.1)+10(0.01)+10(0.001)+5(0.0001)+0.00001=1.61051$ — 이항정리로 $1.1^5$와 같습니다. 기울기의 대부분(1.61 중 1.5)이 블록을 0–1개만 거치는 **얕은 경로**에서 오고, 잔차 없는 망은 다섯 블록을 모두 거치는 가장 깊은 경로 하나($10^{-5}$)만 남은 경우입니다. 얕은 경로가 기울기를 전달하고 깊은 경로가 표현력을 준다는 해석이 여기서 보입니다.

**자주 하는 실수.** $1+5\times0.1=1.5$처럼 블록마다의 기여를 더하기만 하면 블록을 여러 개 거치는 경로를 빠뜨립니다.

관련: [[ch12:9.5|잔차 연결]]
` },
      { ch: 'ch12', type: 'mc', lv: 1, pts: 3, q: R`Choose the correct statement about methods for combining several models. The errors of all models have zero mean and equal variance.`,
        choices: [R`No matter how many models with pairwise error correlation coefficient 0.5 are averaged, $E_{\text{COM}}$ does not fall below half of $E_{\text{AV}}$`, R`Boosting trains models in parallel, one on each bootstrap data set, and takes their simple average`, R`When 4 points are drawn with replacement from 4 data points, the probability that a particular data point is left out is $\tfrac14$`, R`If the models' errors are strongly correlated with each other, the committee error can be larger than $E_{\text{AV}}$`], ans: 0,
        sol: R`
**핵심.** 분산이 같고 쌍별 상관계수가 $\rho$이면 $E_{\text{COM}}=\big(\rho+\frac{1-\rho}M\big)E_{\text{AV}}$이고, 어떤 경우든 $E_{\text{COM}}\le E_{\text{AV}}$입니다.

1. $\rho=0.5$: $E_{\text{COM}}/E_{\text{AV}}=0.5+\frac{0.5}M$ — $M=10$이면 $0.55$이고, $M\to\infty$에서도 $0.5$로 다가갈 뿐 그 아래로는 가지 않습니다. 상관된 부분은 평균해도 상쇄되지 않기 때문입니다.
2. 복원 추출 한 번에 특정 자료가 뽑히지 않을 확률은 $\frac34$이고, 네 번 모두 뽑히지 않을 확률은 $(\frac34)^4\approx0.316$입니다($N\to\infty$이면 $e^{-1}\approx0.368$).

**답.** ①

**보기 검토.** ① 정답. ② 틀림 — 부트스트랩 자료로 병렬 학습해 평균하는 것은 배깅입니다. 부스팅은 앞 분류기가 틀린 예제에 가중치를 더 주며 **순차적으로** 학습하고 가중 다수결로 결합합니다. ③ 틀림 — $\frac14$은 한 번의 추출에서 그 자료가 뽑힐 확률이고, 빠질 확률은 $(\frac34)^4\approx0.316$입니다. ④ 틀림 — 볼록성(옌센 부등식)으로 가정 없이 $E_{\text{COM}}\le E_{\text{AV}}$이며, 상관이 강하면 줄어드는 폭이 작아질 뿐입니다($\rho=1$이면 같음).

관련: [[ch12:9.6|모델 평균: 앙상블, 배깅, 부스팅]]
` },
      { ch: 'ch08', type: 'open', lv: 3, pts: 12, q: R`Near a minimum the error is $E(\mathbf w)=E_0+\frac12(\mathbf w-\mathbf w^\star)^T\mathbf H(\mathbf w-\mathbf w^\star)$, and the eigenvalues of the Hessian are $\lambda_1=1$, $\lambda_2=9$ (a narrow valley caused by the two inputs having different scales). For batch gradient descent with fixed learning rate $\eta$, $\mathbf w^{(\tau)}=\mathbf w^{(\tau-1)}-\eta\nabla E$: (1) Show that, in the coordinates of the Hessian eigenvectors, $w_i^{(\tau)}-w_i^\star=(1-\eta\lambda_i)^\tau\big(w_i^{(0)}-w_i^\star\big)$. (2) Find the range of $\eta$ for which the iteration does not diverge. (3) Find the $\eta^\star$ that minimizes the convergence factor of the slowest component, $\max_i\lvert1-\eta\lambda_i\rvert$, and the factor at that value, and compare with $\eta=1/\lambda_{\max}$. (4) Find how many updates $\eta^\star$ and $\eta=1/9$ each need to reduce the length of the error vector to at most $10^{-3}$ of its initial value, and explain what happens if input normalization makes $\lambda_1=\lambda_2$.`,
        rubric: R`
- (1) $\nabla E=\mathbf H(\mathbf w-\mathbf w^\star)$로 오차 점화식 $\mathbf e^{(\tau)}=(\mathbf I-\eta\mathbf H)\mathbf e^{(\tau-1)}$을 세우고 고유벡터로 분해 — 3점
- (2) 모든 $i$에서 $\lvert1-\eta\lambda_i\rvert<1$이므로 $0<\eta<2/9$ — 2점
- (3) 두 인수의 크기가 같아지는 $\eta^\star=2/(\lambda_1+\lambda_2)=0.2$, 인수 $0.8=(\kappa-1)/(\kappa+1)$, $\eta=1/9$이면 $8/9$ — 4점
- (4) 31회와 59회, 곡률이 같아지면 한 번에 수렴 — 3점`,
        sol: R`
**핵심.** 이차 오차에서 경사하강법은 선형 점화식이 되고, 헤시안의 고유벡터 방향마다 독립적으로 $(1-\eta\lambda_i)$배씩 줄어듭니다. 곡률 비 $\kappa=\lambda_{\max}/\lambda_{\min}=9$가 수렴 속도를 정합니다.

(1) $\nabla E=\mathbf H(\mathbf w-\mathbf w^\star)$이므로 오차 벡터 $\mathbf e^{(\tau)}=\mathbf w^{(\tau)}-\mathbf w^\star$는
$$\mathbf e^{(\tau)}=\mathbf e^{(\tau-1)}-\eta\mathbf H\mathbf e^{(\tau-1)}=(\mathbf I-\eta\mathbf H)\mathbf e^{(\tau-1)}$$
를 따릅니다. $\mathbf H$는 대칭이라 정규직교 고유벡터 $\mathbf u_i$ ($\mathbf H\mathbf u_i=\lambda_i\mathbf u_i$)를 가집니다. 양변에 $\mathbf u_i^T$를 곱하면 $\mathbf u_i^T(\mathbf I-\eta\mathbf H)=(1-\eta\lambda_i)\mathbf u_i^T$이므로 성분 $e_i=\mathbf u_i^T\mathbf e$는 $e_i^{(\tau)}=(1-\eta\lambda_i)e_i^{(\tau-1)}=(1-\eta\lambda_i)^\tau e_i^{(0)}$입니다. 방향끼리 섞이지 않습니다.

(2) 모든 성분이 0으로 가려면 모든 $i$에서 $\lvert1-\eta\lambda_i\rvert<1$, 즉 $0<\eta<2/\lambda_i$이어야 합니다. 가장 엄격한 것은 $\lambda_{\max}=9$이므로 $0<\eta<2/9\approx0.222$입니다.

(3) $\lvert1-\eta\rvert$는 $\eta$가 커질수록 줄고, $\lvert1-9\eta\rvert$는 $\eta>1/9$에서 커집니다. 따라서 둘 중 큰 값은 두 값이 같아지는 곳에서 가장 작습니다: $1-\eta=9\eta-1\Rightarrow\eta^\star=\frac2{\lambda_1+\lambda_2}=0.2$. 이때 인수는 $1-0.2=0.8$과 $1-1.8=-0.8$로 크기가 같고, 수렴 인수는 $\frac{\kappa-1}{\kappa+1}=\frac8{10}=0.8$입니다. 곡률이 큰 성분은 부호가 매번 바뀌며(골짜기를 가로질러 진동하며) 줄어듭니다. $\eta=1/\lambda_{\max}=1/9$이면 가파른 성분은 한 번에 0이 되지만 완만한 성분의 인수가 $1-1/9=8/9\approx0.889$로 더 느립니다.

(4) 두 성분의 크기가 매 걸음 인수 $q$ 이하의 비율로 줄므로 $\lVert\mathbf e^{(\tau)}\rVert\le q^\tau\lVert\mathbf e^{(0)}\rVert$이고, $q^\tau\le10^{-3}$을 풉니다.
- $\eta^\star$ ($q=0.8$): $\tau\ge\frac{\ln1000}{\ln1.25}\approx30.96$ → 31회 ($0.8^{31}\approx9.9\times10^{-4}$).
- $\eta=1/9$ ($q=8/9$): $\tau\ge\frac{\ln1000}{\ln(9/8)}\approx58.65$ → 59회.
입력을 정규화해 곡률이 같아지면($\lambda_1=\lambda_2=\lambda$, $\kappa=1$) $\eta=1/\lambda$에서 모든 인수가 0이라 **한 번의 갱신**으로 최소점에 도달합니다. 곡률 비가 클수록 고정 학습률이 느리다는 것이 입력 정규화·모멘텀·적응형 학습률이 필요한 이유입니다.

**검산.** $\mathbf e^{(0)}=(1,1)$에서 $\eta=0.2$로 직접 돌리면 $(0.8,-0.8)$, $(0.64,0.64)$, $(0.512,-0.512)$ — 크기가 매번 0.8배입니다. $\eta=0.25>2/9$이면 가파른 성분의 인수가 $-1.25$라 발산합니다.

관련: [[ch08:7.3|학습률과 수렴]], [[ch09:7.4|왜 정규화하는가, 입력 정규화]]
` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 12, q: R`A two-layer network regresses a risk score on two standardized blood-test values $\mathbf x=(x_1,x_2)=(1,2)$. The 2 hidden units are tanh and the output is linear; the error is $E=\frac12(y-t)^2$ and the target is $t=0.5$. The first layer is $a_j=w^{(1)}_{j0}+w^{(1)}_{j1}x_1+w^{(1)}_{j2}x_2$ with $(w^{(1)}_{10},w^{(1)}_{11},w^{(1)}_{12})=(0.1,\,0.2,\,0.1)$, $(w^{(1)}_{20},w^{(1)}_{21},w^{(1)}_{22})=(0,\,-0.6,\,-0.2)$, and the second layer is $y=w^{(2)}_0+w^{(2)}_1z_1+w^{(2)}_2z_2$ with $(w^{(2)}_0,w^{(2)}_1,w^{(2)}_2)=(0.2,\,1,\,-0.5)$. Compute to 4 decimal places. (1) Using forward propagation, find $a_j$, $z_j$, $y$ and $E$. (2) Find the error signals $\delta_k$ (output) and $\delta_1$, $\delta_2$ (hidden). (3) Find the gradients with respect to all 9 parameters. (4) When all 9 parameters are updated together once with learning rate $\eta=0.05$, predict the change in the error using the linear (first-order Taylor) approximation in the gradient, and compare it with the actual error of $0.0730$ recomputed after the update. Also explain why the magnitudes of the first-layer gradients of the two hidden units differ so much.`,
        rubric: R`
- (1) $a=(0.5,-1)$, $z\approx(0.4621,-0.7616)$, $y\approx1.0429$, $E\approx0.1474$ — 3점
- (2) $\delta_k=y-t$, $\delta_j=(1-z_j^2)\,w^{(2)}_j\,\delta_k$ 계산 — 3점
- (3) 기울기 = 오차 신호 × 입력 활성(편향은 입력 1)으로 9개 — 3점
- (4) $\delta E\simeq-\eta\lVert\nabla E\rVert^2\approx-0.0850$과 실제 $-0.0744$의 차이(고차항), 포화와 가중치로 설명 — 3점`,
        sol: R`
**핵심.** 역전파 공식을 그대로 씁니다. 출력은 선형 출력 + 제곱오차라 $\delta_k=y-t$, 은닉은 $\delta_j=h'(a_j)\sum_kw_{kj}\delta_k$ (tanh이면 $h'=1-z^2$), 가중치 기울기는 오차 신호 × 그 가중치로 들어오는 활성 $\partial E/\partial w_{ji}=\delta_jz_i$이고 편향의 입력은 1입니다.

(1) 순전파.
- $a_1=0.1+0.2(1)+0.1(2)=0.5$, $a_2=0-0.6(1)-0.2(2)=-1$.
- $z_1=\tanh0.5\approx0.4621$, $z_2=\tanh(-1)\approx-0.7616$.
- $y=0.2+1(0.4621)-0.5(-0.7616)=0.2+0.4621+0.3808\approx1.0429$.
- $E=\frac12(1.0429-0.5)^2=\frac12(0.5429)^2\approx0.1474$.

(2) 역전파.
- $\delta_k=y-t\approx0.5429$.
- $h'(a_1)=1-0.4621^2\approx0.7864$, $h'(a_2)=1-0.7616^2\approx0.4200$.
- $\delta_1=0.7864\times1\times0.5429\approx0.4270$, $\delta_2=0.4200\times(-0.5)\times0.5429\approx-0.1140$.

(3) 기울기.
- 둘째 층: $\partial E/\partial w^{(2)}_0=\delta_k\approx0.5429$, $\partial E/\partial w^{(2)}_1=\delta_kz_1\approx0.2509$, $\partial E/\partial w^{(2)}_2=\delta_kz_2\approx-0.4135$.
- 첫 층 유닛 1: $(\delta_1,\ \delta_1x_1,\ \delta_1x_2)\approx(0.4270,\ 0.4270,\ 0.8540)$.
- 첫 층 유닛 2: $(\delta_2,\ \delta_2x_1,\ \delta_2x_2)\approx(-0.1140,\ -0.1140,\ -0.2280)$.

(4) 갱신이 $\delta\mathbf w=-\eta\nabla E$이므로 $\delta E\simeq-\eta\lVert\nabla E\rVert^2$입니다. 첫 층은 입력 제곱합 $1^2+1^2+2^2=6$을 곱해
$$\lVert\nabla E\rVert^2\approx0.2947+0.0629+0.1710+6(0.1823)+6(0.0130)\approx1.7005$$
따라서 $\delta E\simeq-0.05\times1.7005\approx-0.0850$, 예측 오차 $0.1474-0.0850=0.0624$입니다. 실제 오차는 $0.0730$ ($\delta E\approx-0.0744$)이라 1차 근사가 감소량을 약 14% 과대평가했습니다. 1차 근사는 $\delta\mathbf w$의 2차 이상 항(곡률)을 무시하는데, 이 걸음에서는 그 항이 약 $+0.0106$이라 실제 감소가 덜합니다. $\eta=0.1$이면 예측 감소량 $0.1701$이 현재 오차 $0.1474$보다 커지는 모순이 생깁니다 — 학습률이 클수록 선형 근사가 맞지 않습니다.
첫 층 기울기는 유닛 1이 유닛 2의 약 3.7배입니다. 유닛 2는 $\lvert a_2\rvert=1$로 tanh가 더 포화되어 $h'=0.42$ (유닛 1은 $0.79$)이고, 출력으로 가는 가중치도 $\lvert w^{(2)}_2\rvert=0.5$로 작아 오차 신호가 덜 전달되기 때문입니다.

**검산.** 유닛 1의 $w^{(1)}_{12}$를 $\pm10^{-3}$ 흔든 중앙 차분은 $0.85395$로 역전파 값과 일치합니다. 또 $\delta_k>0$ ($y>t$)이므로 갱신 후 $y$가 줄어야 하고, 실제로 $y\approx0.8820$이 됩니다.

관련: [[ch10:8.1c|2층 신경망 예제와 수치 미분]], [[ch10:8.1b|일반 피드포워드망과 역전파 알고리즘]]
` },
      { ch: 'ch12', type: 'open', lv: 3, pts: 11, q: R`In dropout, the masks $R_i\in\{0,1\}$ of the nodes $i$ are mutually independent and equal 1 with probability $\rho$. (1) Find the expectation and variance of the pre-activation $a=\sum_iw_iR_iz_i$ of a unit in the next layer, and explain why the outgoing weights are multiplied by $\rho$ at inference (or $1/\rho$ is applied during training). (2) For linear regression with dropout applied to the inputs, $y=\sum_iw_iR_ix_i$, show that $\E_R\big[(t-y)^2\big]=\big(t-\rho\,\mathbf w^T\mathbf x\big)^2+\rho(1-\rho)\sum_iw_i^2x_i^2$, and interpret what kind of regularization results when this is summed over the whole data set. (3) For $\mathbf x=(1,2)$, $\mathbf w=(0.5,\,0.25)$, $t=1$, $\rho=0.8$, compute the value in (2) and check that it agrees with a direct calculation listing all four masks.`,
        rubric: R`
- (1) $\E[a]=\rho\sum_iw_iz_i$와 가중치 척도 조정의 이유 — 2점
- (1) 독립성으로 $\Var[a]=\rho(1-\rho)\sum_iw_i^2z_i^2$ — 2점
- (2) $\E[(t-y)^2]=(t-\E[y])^2+\Var[y]$로 분해해 식 유도 — 3점
- (2) 입력마다 계수가 다른 변형된 이차 규제라는 해석 — 2점
- (3) $0.04+0.08=0.12$와 마스크 열거의 일치 — 2점`,
        sol: R`
**핵심.** $R_i$는 베르누이 변수라 $\E[R_i]=\rho$, $\E[R_i^2]=\E[R_i]=\rho$, $\Var[R_i]=\rho-\rho^2=\rho(1-\rho)$이고, 서로 독립이라 공분산이 0입니다. 드롭아웃의 잡음은 평균을 $\rho$배로 줄이고 분산을 더합니다.

(1) 기댓값의 선형성으로 $\E[a]=\sum_iw_iz_i\E[R_i]=\rho\sum_iw_iz_i$. 추론 때 마스크 없는 전체 망을 그대로 쓰면 사전활성이 학습 때 평균의 $1/\rho$배가 됩니다. 그래서 나가는 가중치에 $\rho$를 곱해 $\sum_i(\rho w_i)z_i=\E[a]$로 맞추며, 학습 때 남은 활성에 $1/\rho$를 곱하는 역드롭아웃도 같은 기댓값을 맞추는 방법입니다.
독립인 항들의 합이므로 분산도 그대로 더해집니다: $\Var[a]=\sum_iw_i^2z_i^2\Var[R_i]=\rho(1-\rho)\sum_iw_i^2z_i^2$. 이 잡음 때문에 갱신이 잡음이 많아지고(드롭아웃의 대가), 동시에 규제 효과가 생깁니다.

(2) 임의의 확률변수 $y$에 대해 $\E[(t-y)^2]=(t-\E[y])^2+\Var[y]$입니다($t-y=(t-\E y)+(\E y-y)$로 나누면 교차항의 기댓값 $2(t-\E y)\E[\E y-y]$가 0). (1)에서 $z_i$를 $x_i$로 바꾸면 $\E[y]=\rho\mathbf w^T\mathbf x$, $\Var[y]=\rho(1-\rho)\sum_iw_i^2x_i^2$이므로 주어진 식이 나옵니다.
자료 $n=1,\dots,N$에 대해 더하면
$$\sum_n\E_R\big[(t_n-y_n)^2\big]=\sum_n\big(t_n-\rho\mathbf w^T\mathbf x_n\big)^2+\rho(1-\rho)\sum_iw_i^2\Big(\sum_nx_{ni}^2\Big)$$
첫 항은 추론용 가중치 $\rho\mathbf w$의 보통 제곱오차이고, 둘째 항은 가중치 제곱 벌점이되 계수 $\rho(1-\rho)\sum_nx_{ni}^2$가 **입력마다 다른** 이차 규제입니다. 제곱합이 큰 입력에 붙은 가중치를 더 강하게 누르는 셈이고, 이것이 단원이 말하는 “최소제곱 선형회귀에서 드롭아웃은 변형된 이차 규제”의 뜻입니다. $\rho=1$(드롭아웃 없음)이면 벌점이 사라집니다.

(3) $\mathbf w^T\mathbf x=0.5+0.5=1$, $\E[y]=0.8$이므로 $(1-0.8)^2=0.04$. $\Var[y]=0.8\times0.2\times(0.25\cdot1+0.0625\cdot4)=0.16\times0.5=0.08$. 합은 $0.12$입니다.
마스크 열거: $(R_1,R_2)=(1,1)$은 확률 $0.64$, $y=1$, 제곱오차 0 / $(1,0)$은 $0.16$, $y=0.5$, $0.25$ / $(0,1)$은 $0.16$, $y=0.5$, $0.25$ / $(0,0)$은 $0.04$, $y=0$, $1$. 기댓값 $0.16(0.25)+0.16(0.25)+0.04(1)=0.04+0.04+0.04=0.12$ — 일치합니다.

**해석.** 드롭아웃 없이는 $\mathbf w^T\mathbf x=t$라 오차가 0인 가중치인데도 드롭아웃 목적함수는 $0.12$를 매깁니다. 학습은 이 값을 줄이려 하므로 특정 입력 하나에 크게 의존하는 가중치(공적응)를 피하게 됩니다.

관련: [[ch12:9.6b|드롭아웃]]
` },
    ],
  },
  );
})();
