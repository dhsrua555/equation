/* 증명의 길잡이 — 21단원의 긴 증명(본문 600자 이상). 형식은 plan-a.js와 같습니다:
   쉬운 요약(easy)과 단계(nodes), 각 단계의 at은 한국어 본문에서 그 단계가 시작하는 조각의 첫머리입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    // ───── 21
    'ch21-condist': {
      easy: R`두 방식에서 이미지 특성 $\mathbf v$가 은닉 상태에 닿는 길을 세어 봅니다. 첫 단어 방식은 $\mathbf h_0$ 하나를 거쳐서만 들어가므로 $t$걸음 뒤의 기울기가 야코비안 $t$개의 곱을 지나고, 그 크기는 $\lVert W_h\rVert^t$ 이하로 눌립니다. 지름길은 매 걸음 $W_z\mathbf v$로 직접 들어가서 길이 1의 경로가 따로 있습니다.`,
      easyEn: R`We count the routes by which the image feature $\mathbf v$ reaches the hidden state in the two methods. The first-word method enters only through $\mathbf h_0$, so after $t$ steps the gradient passes through $t$ Jacobian factors and its size is squeezed to at most $\lVert W_h\rVert^t$. The shortcut enters directly at every step through $W_z\mathbf v$, so there is a separate route of length 1.`,
      nodes: [
        { id: 'prep', at: '**준비.**', t: R`$\partial\mathbf h_s/\partial\mathbf h_{s-1}=D_sW_h$`, en: R`$\partial\mathbf h_s/\partial\mathbf h_{s-1}=D_sW_h$`,
          d: R`$D_s=\diag(1-\mathbf h_s^2)$의 노름이 1 이하이고, 한 걸음의 야코비안이 $D_sW_h$입니다.`,
          dEn: R`The norm of $D_s=\diag(1-\mathbf h_s^2)$ is at most 1, and one step's Jacobian is $D_sW_h$.` },
        { id: 'first', at: '**첫 단어 방식.**', t: R`야코비안 $t$개의 곱`, en: R`A product of $t$ Jacobians`,
          d: R`연쇄법칙으로 $D_tW_h\cdots D_0W_v$를 얻고 노름의 곱 부등식으로 $\lVert W_h\rVert^t\lVert W_v\rVert$ 이하임을 보입니다.`,
          dEn: R`The chain rule gives $D_tW_h\cdots D_0W_v$, and the norm product inequality bounds it by $\lVert W_h\rVert^t\lVert W_v\rVert$.` },
        { id: 'short', at: '**지름길 방식.**', t: R`직접 항 $D_tW_z$`, en: R`The direct term $D_tW_z$`,
          d: R`$\mathbf v$가 걸음 $t$에 직접 들어가므로 이전 상태를 고정한 미분이 $D_tW_z$이고, 크기가 $t$와 무관합니다.`,
          dEn: R`Since $\mathbf v$ enters step $t$ directly, the derivative with the previous state fixed is $D_tW_z$, whose size does not depend on $t$.` },
      ],
    },
    'ch21-softgrad': {
      easy: R`소프트 어텐션 $\mathbf z=\sum\alpha_i\mathbf x_i$는 가중치가 양수이고 합이 1인 평균입니다. 그래서 크기가 가장 큰 $\mathbf x_i$를 넘지 못하고, 하드 어텐션이 $\alpha$로 한 칸을 뽑는 것의 기댓값과 같습니다. 점수에 대한 기울기는 소프트맥스의 야코비안 $\alpha_i(\delta_{im}-\alpha_m)$에서 나오고, 정리하면 $\alpha_m(\mathbf x_m-\mathbf z)$입니다.`,
      easyEn: R`The soft attention $\mathbf z=\sum\alpha_i\mathbf x_i$ is an average with positive weights summing to 1. So it cannot exceed the largest $\mathbf x_i$ in size, and it equals the expectation of the hard attention that draws one cell with $\alpha$. The gradient with respect to the scores comes from the softmax Jacobian $\alpha_i(\delta_{im}-\alpha_m)$, which simplifies to $\alpha_m(\mathbf x_m-\mathbf z)$.`,
      nodes: [
        { id: 'convex', at: '**(1) 볼록 결합.**', t: R`삼각 부등식`, en: R`Triangle inequality`,
          d: R`$\alpha_i>0$, $\sum\alpha_i=1$이므로 $\lVert\mathbf z\rVert\le\max_i\lVert\mathbf x_i\rVert$입니다.`,
          dEn: R`Since $\alpha_i>0$ and $\sum\alpha_i=1$, $\lVert\mathbf z\rVert\le\max_i\lVert\mathbf x_i\rVert$.` },
        { id: 'hard', at: '**(2) 하드 어텐션의 기댓값.**', t: R`$\mathbb E[\mathbf x_s]=\mathbf z$`, en: R`$\mathbb E[\mathbf x_s]=\mathbf z$`,
          d: R`$P(s=i)=\alpha_i$를 기댓값의 정의에 대입합니다.`,
          dEn: R`Substitute $P(s=i)=\alpha_i$ into the definition of expectation.` },
        { id: 'grad', at: '**(3) 점수의 기울기.**', t: R`소프트맥스 야코비안에서 $\alpha_m(\mathbf x_m-\mathbf z)$`, en: R`From the softmax Jacobian to $\alpha_m(\mathbf x_m-\mathbf z)$`,
          d: R`$\partial\alpha_i/\partial e_m=\alpha_i(\delta_{im}-\alpha_m)$를 $\sum_i(\cdot)\mathbf x_i$에 넣어 정리합니다.`,
          dEn: R`Insert $\partial\alpha_i/\partial e_m=\alpha_i(\delta_{im}-\alpha_m)$ into $\sum_i(\cdot)\mathbf x_i$ and simplify.` },
      ],
    },
    'ch21-scaling': {
      easy: R`점곱은 $D$개의 항을 더한 것이라 항이 독립이면 분산도 $D$배가 됩니다. 점수의 표준편차가 $\sqrt D$로 커지면 소프트맥스가 한 곳에 몰리고, 몰린 소프트맥스의 야코비안 $a_i(\delta_{im}-a_m)$은 모든 성분이 작아져 기울기가 사라집니다. $\sqrt D$로 나누면 분산이 1로 맞습니다.`,
      easyEn: R`A dot product is a sum of $D$ terms, so if the terms are independent the variance is also $D$ times larger. When the standard deviation of the scores grows like $\sqrt D$, the softmax piles onto one place, and the Jacobian $a_i(\delta_{im}-a_m)$ of a piled-up softmax has only small entries, so the gradient vanishes. Dividing by $\sqrt D$ brings the variance back to 1.`,
      nodes: [
        { id: 'mean', at: '**평균.**', t: R`독립이므로 평균 0`, en: R`Independence gives mean 0`,
          d: R`$\mathbb E[q_lk_l]=\mathbb E[q_l]\mathbb E[k_l]=0$.`, dEn: R`$\mathbb E[q_lk_l]=\mathbb E[q_l]\mathbb E[k_l]=0$.` },
        { id: 'var', at: '**분산.**', t: R`항마다 분산 1, 합하면 $D$`, en: R`Variance 1 per term, $D$ in total`,
          d: R`$\mathrm{Var}(q_lk_l)=1$이고 독립인 항의 분산이 더해져 $D$, $1/\sqrt D$를 곱하면 1입니다.`,
          dEn: R`$\mathrm{Var}(q_lk_l)=1$, the variances of independent terms add to $D$, and multiplying by $1/\sqrt D$ gives 1.` },
        { id: 'jac', at: '**소프트맥스의 야코비안.**', t: R`$a_i(\delta_{im}-a_m)$`, en: R`$a_i(\delta_{im}-a_m)$`,
          d: R`$a_i=e^{e_i}/Z$를 몫의 미분으로 미분합니다.`, dEn: R`Differentiate $a_i=e^{e_i}/Z$ by the quotient rule.` },
        { id: 'sat', at: '**포화.**', t: R`몰리면 모든 성분이 $\varepsilon$ 이하`, en: R`If piled up, every entry is at most $\varepsilon$`,
          d: R`$\max a_i\ge1-\varepsilon$이면 대각 성분과 비대각 성분이 모두 $\varepsilon$ 이하입니다.`,
          dEn: R`If $\max a_i\ge1-\varepsilon$, both diagonal and off-diagonal entries are at most $\varepsilon$.` },
        { id: 'concl', at: '**결론.**', t: R`분산이 $D$와 무관하게`, en: R`Variance independent of $D$`,
          d: R`나누기 전에는 점수 폭이 $\sqrt D$로 커져 포화하고, 나눈 뒤에는 폭이 $D$와 무관합니다.`,
          dEn: R`Before dividing, the score spread grows like $\sqrt D$ and saturates; after dividing the spread is independent of $D$.` },
      ],
    },
    'ch21-shapecost': {
      easy: R`모양을 따라가며 곱셈 수를 셉니다. 투영 세 개는 $N\times D$ 행렬과 $D\times d$ 행렬의 곱이고, $QK^T$와 $AV$는 $N\times N$ 행렬이 걸린 곱이라 $N^2d$가 두 번 나옵니다. 어텐션 행렬 $A$ 하나가 $N^2$개의 원소라 길이에 이차로 비쌉니다.`,
      easyEn: R`We follow the shapes and count multiplications. The three projections are products of an $N\times D$ and a $D\times d$ matrix, and $QK^T$ and $AV$ involve the $N\times N$ matrix, so $N^2d$ appears twice. The attention matrix $A$ alone has $N^2$ entries, so the cost is quadratic in the length.`,
      nodes: [
        { id: 'shape', at: '**모양.**', t: R`$A\in\mathbb R^{N\times N}$, $Y\in\mathbb R^{N\times D_v}$`, en: R`$A\in\mathbb R^{N\times N}$, $Y\in\mathbb R^{N\times D_v}$`,
          d: R`$Q,K,V$의 모양에서 $QK^T$, $AV$의 모양을 차례로 얻습니다.`, dEn: R`Get the shapes of $QK^T$ and $AV$ in turn from those of $Q,K,V$.` },
        { id: 'par', at: '**매개변수.**', t: R`$D(2D_k+D_v)$`, en: R`$D(2D_k+D_v)$`,
          d: R`세 투영 행렬의 원소 수를 더하고, $N$에 의존하지 않음을 확인합니다.`, dEn: R`Add the entries of the three projection matrices and note it does not depend on $N$.` },
        { id: 'mul', at: '**곱셈 수.**', t: R`투영, $QK^T$, $AV$`, en: R`Projections, $QK^T$, $AV$`,
          d: R`행렬 곱 $(a\times b)(b\times c)$는 $abc$번이라는 규칙을 세 곳에 적용합니다.`, dEn: R`Apply the rule that an $(a\times b)(b\times c)$ product takes $abc$ multiplications in the three places.` },
        { id: 'dom', at: '**메모리와 지배항.**', t: R`$N^2$ 대 $NDd$`, en: R`$N^2$ versus $NDd$`,
          d: R`$N\gg D$이면 $N^2d$, $N\ll D$이면 $NDd$가 지배합니다.`, dEn: R`$N^2d$ dominates when $N\gg D$ and $NDd$ when $N\ll D$.` },
      ],
    },
    'ch21-posrot': {
      easy: R`사인과 코사인의 덧셈 공식은 한 쌍 $(\sin\omega t,\cos\omega t)$를 각도 $\omega\Delta$만큼 돌린 것이 $t+\Delta$의 쌍이라는 말입니다. 회전의 각도에 $t$가 없으니 이동량 $\Delta$마다 하나의 회전행렬이 있고, 같은 위치 두 점의 내적은 코사인의 차 공식에서 $\Delta$로만 정해집니다. 이어 붙인 뒤의 선형 변환은 위치 부호에 선형 변환을 해서 더하는 것과 같습니다.`,
      easyEn: R`The addition formulas for sine and cosine say that rotating a pair $(\sin\omega t,\cos\omega t)$ by the angle $\omega\Delta$ gives the pair at $t+\Delta$. The rotation angle has no $t$, so each shift $\Delta$ has one rotation matrix, and the inner product of two positions is fixed by $\Delta$ alone through the cosine difference formula. A linear map after concatenation equals applying a linear map to the position code and adding it.`,
      nodes: [
        { id: 'rot', at: '**(1) 회전.**', t: R`덧셈 공식으로 $R(\Delta)$`, en: R`$R(\Delta)$ from the addition formulas`,
          d: R`쌍마다 각도 $\omega_k\Delta$의 $2\times2$ 회전이고 블록 대각으로 놓으면 직교행렬입니다.`, dEn: R`Each pair is a $2\times2$ rotation by $\omega_k\Delta$, and placing them block-diagonally gives an orthogonal matrix.` },
        { id: 'dot', at: '**(2) 내적.**', t: R`$\sum_k\cos\omega_k\Delta$`, en: R`$\sum_k\cos\omega_k\Delta$`,
          d: R`코사인의 차 공식으로 쌍마다 $\cos\omega\Delta$가 남습니다.`, dEn: R`By the cosine difference formula each pair leaves $\cos\omega\Delta$.` },
        { id: 'cat', at: '**(3) 이어 붙이기와 더하기.**', t: R`$[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$`, en: R`$[\mathbf x;\mathbf p]W=\mathbf xW_1+\mathbf pW_2$`,
          d: R`$W$를 두 블록으로 나누면 이어 붙이기가 더하기가 됩니다.`, dEn: R`Splitting $W$ into two blocks turns concatenation into addition.` },
      ],
    },
    'ch21-maskrows': {
      easy: R`마스크는 미래 칸의 점수에 $-\infty$를 더해 소프트맥스가 그 칸을 0으로 만들게 합니다. 대각은 남으므로 분모가 0이 되지 않고 각 행의 합은 1입니다. 행 $j$의 가중치가 $i\le j$에서만 0이 아니라서 출력 $\mathbf y_j$는 $\mathbf x_1,\dots,\mathbf x_j$의 함수입니다.`,
      easyEn: R`The mask adds $-\infty$ to the scores of the future cells so that the softmax makes them 0. The diagonal remains, so the denominator does not vanish and each row sums to 1. The weights of row $j$ are nonzero only for $i\le j$, so the output $\mathbf y_j$ is a function of $\mathbf x_1,\dots,\mathbf x_j$.`,
      nodes: [
        { id: 'row', at: '행 $j$의 소프트맥스는', t: R`행 $j$의 소프트맥스 식`, en: R`The softmax formula of row $j$`,
          d: R`분자와 분모에 마스크가 더해진 점수의 지수가 들어갑니다.`, dEn: R`The exponentials of the masked scores appear in the numerator and the denominator.` },
        { id: 'zero', at: '**(1) 미래는 0.**', t: R`$e^{-\infty}=0$`, en: R`$e^{-\infty}=0$`,
          d: R`$i>j$이면 분자가 0이라 $A$가 아래삼각행렬입니다.`, dEn: R`For $i>j$ the numerator is 0, so $A$ is lower triangular.` },
        { id: 'sum', at: '**(2) 행의 합.**', t: R`대각이 분모를 양수로 유지`, en: R`The diagonal keeps the denominator positive`,
          d: R`분모에 $l=j$인 항이 남아 $0<Z_j<\infty$이고, 분자를 모두 더하면 $Z_j$입니다.`, dEn: R`The term $l=j$ stays in the denominator so $0<Z_j<\infty$, and the numerators sum to $Z_j$.` },
        { id: 'dep', at: '**(3) 과거에만 의존.**', t: R`$\mathbf y_j$는 $\mathbf x_{\le j}$의 함수`, en: R`$\mathbf y_j$ is a function of $\mathbf x_{\le j}$`,
          d: R`$i\le j$의 $\mathbf q_j,\mathbf k_i,\mathbf v_i$만 쓰이므로 미래를 바꿔도 변하지 않습니다.`, dEn: R`Only $\mathbf q_j,\mathbf k_i,\mathbf v_i$ with $i\le j$ are used, so changing the future changes nothing.` },
      ],
    },
    'ch21-encblock': {
      easy: R`블록의 매개변수는 두 덩어리, 멀티헤드 어텐션 $4d^2$과 FF $2d\,d_{ff}$를 더한 것입니다. 순열 등변성은 조각마다 확인합니다. 어텐션은 등변이고, 잔차 연결, LN, FF는 토큰마다 같은 함수라서 행의 순열과 교환됩니다. 등변인 함수를 이어 붙인 것도 등변입니다.`,
      easyEn: R`The parameters of a block are the sum of two pieces, multi-head attention $4d^2$ and the FF $2d\,d_{ff}$. Permutation equivariance is checked piece by piece. Attention is equivariant, and the residual connection, LN, and FF are the same function for every token, so they commute with row permutations. A composition of equivariant functions is also equivariant.`,
      nodes: [
        { id: 'par', at: '**매개변수.**', t: R`$4d^2+2d\,d_{ff}$`, en: R`$4d^2+2d\,d_{ff}$`,
          d: R`LN과 편향은 작아서 빼고 $d_{ff}=4d$를 넣으면 $12d^2$입니다.`, dEn: R`Leave out the small LN and biases and put $d_{ff}=4d$ to get $12d^2$.` },
        { id: 'att', at: '**어텐션 부분의 등변.**', t: R`헤드, Concat, $W_o$`, en: R`Heads, Concat, $W_o$`,
          d: R`헤드는 등변이고 Concat과 $W_o$는 모든 행에 같은 선형 변환입니다.`, dEn: R`Each head is equivariant, and Concat and $W_o$ are the same linear map on every row.` },
        { id: 'rest', at: '**잔차, LN, FF.**', t: R`토큰마다 같은 함수`, en: R`The same function for every token`,
          d: R`행마다 같은 함수를 적용하는 연산은 행의 순열과 교환됩니다.`, dEn: R`An operation applying the same function to each row commutes with row permutations.` },
        { id: 'stack', at: '**쌓기.**', t: R`합성의 등변`, en: R`Equivariance of the composition`,
          d: R`등변인 함수를 합성해도 등변입니다.`, dEn: R`A composition of equivariant functions is equivariant.` },
      ],
    },
    'ch21-lnprop': {
      easy: R`층 정규화는 한 토큰의 특성에서 평균을 빼고 표준편차로 나누는 것입니다. 정의에서 곧바로 평균 0, 분산 1이 나오고, 입력에 양수를 곱하고 상수를 더하면 평균과 표준편차도 같은 방식으로 변해 서로 지워지므로 출력이 같습니다. 통계를 한 토큰 안에서만 구하기 때문에 배치와 무관합니다.`,
      easyEn: R`Layer normalization subtracts the mean from the features of one token and divides by the standard deviation. Mean 0 and variance 1 follow straight from the definition, and when the input is multiplied by a positive number and shifted by a constant, the mean and the standard deviation change in the same way and cancel, so the output is the same. Since the statistics come from one token alone, there is no dependence on the batch.`,
      nodes: [
        { id: 'mv', at: '**(1) 평균과 분산.**', t: R`정의에서 평균 0, 분산 1`, en: R`Mean 0, variance 1 from the definition`,
          d: R`평균이 0이라 분산은 제곱의 평균이고 $\sigma^2/\sigma^2=1$입니다.`, dEn: R`With mean 0 the variance is the mean of squares, which is $\sigma^2/\sigma^2=1$.` },
        { id: 'inv', at: '**(2) 이동과 스케일 불변.**', t: R`$\mu'=a\mu+b$, $\sigma'=a\sigma$`, en: R`$\mu'=a\mu+b$, $\sigma'=a\sigma$`,
          d: R`분자 $a(\mathbf h-\mu\mathbf 1)$와 분모 $a\sigma$에서 $a$가 약분됩니다.`, dEn: R`In the numerator $a(\mathbf h-\mu\mathbf 1)$ and the denominator $a\sigma$ the factor $a$ cancels.` },
        { id: 'batch', at: '**배치와의 관계.**', t: R`토큰 안에서만 통계`, en: R`Statistics inside one token`,
          d: R`$\mu,\sigma$가 한 토큰의 $d$개 성분으로만 정해져 BN과 달리 배치 크기와 무관합니다.`, dEn: R`$\mu,\sigma$ are fixed by the $d$ components of one token, so unlike BN there is no dependence on the batch size.` },
      ],
    },
  });
})();
