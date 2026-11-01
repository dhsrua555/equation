/* 논리 지도 — 18 바론 정리와 일반화. 바론 클래스와 정리 1에서 출발해 Maurey 보조정리(무작위 평균)와
   바론의 보조정리(푸리에 표현 → 헤비사이드 계단)의 두 갈래가 정리의 완성에서 만나고, 일반화(위험과 라데마허 복잡도)로 넘어가는 흐름입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 18,
    easy: R`
17단원의 보편 근사 정리는 신경망이 연속함수를 **얼마든지 정확하게** 근사할 수 있다고 말하지만, 뉴런이 몇 개 필요한지는 말하지 않습니다. 이 단원의 앞부분은 그 질문에 답합니다. 푸리에 변환으로 함수의 “울퉁불퉁함”을 재어, 기울기의 주파수 진폭을 다 더한 값이 $C$ 이하인 함수들(**바론 클래스**)을 정의하면, 은닉 뉴런 $N$개로 평균 제곱 오차를 $4C^2/N$ 근처까지 낮출 수 있습니다. 이 식에는 입력 차원 $d$가 없습니다. 격자로 공간을 나누는 근사가 $\varepsilon^{-d}$개의 칸을 요구하는 것(차원의 저주)과 대조됩니다.

증명은 두 갈래가 만나는 구조입니다. 한 갈래는 **Maurey 보조정리**입니다. 볼록 껍질 안의 점은 꼭짓점들의 가중 평균이니, 가중치를 확률로 보고 $N$개를 무작위로 뽑아 평균하면 오차의 제곱이 평균적으로 $B^2/N$이 됩니다. 미니배치 평균의 분산이 $1/N$로 주는 것과 같은 계산입니다. 다른 갈래는 **바론의 보조정리**입니다. 푸리에 역변환으로 $f-f(0)$을 코사인 물결들의 확률 평균으로 쓰고, 각 물결(한 방향으로만 변하는 능선 함수)을 높이 합이 2 이하인 계단 함수들로 바꿉니다. 두 갈래를 합치면 계단 뉴런 $N$개로 $4C^2/N$을 얻고, 계단을 기울기가 큰 시그모이드로 바꾸면 보통의 은닉층 하나짜리 신경망이 됩니다.

뒷부분은 **일반화**입니다. 실제로는 데이터 $n$개만 보고 함수를 고르므로, 학습 데이터에서의 평균 손실(경험적 위험)과 새 데이터에서의 기대 손실(모집단 위험)이 어긋날 수 있습니다. 초과 위험은 최적화·일반화·근사의 세 항으로 나뉘고, 일반화 항은 클래스가 무작위 부호 $\pm1$을 얼마나 잘 따라가는지를 재는 **라데마허 복잡도**로 다스립니다. 그 결과 차이는 $2\operatorname{Rad}_n+O(1/\sqrt n)$이고, 노름이 $Q$ 이하인 클래스에서는 $\operatorname{Rad}_n\lesssim Q/\sqrt n$입니다.`,
    easyEn: R`
The universal approximation theorem of Unit 17 says that neural networks can approximate continuous functions **as accurately as we like**, but not how many neurons that takes. The first half of this unit answers that question. Measuring how "bumpy" a function is with the Fourier transform, define the functions whose gradient's frequency amplitudes add up to at most $C$ (the **Barron class**): then $N$ hidden neurons bring the mean squared error down to about $4C^2/N$. The input dimension $d$ does not appear in this formula. Contrast this with approximation on a grid, which needs $\varepsilon^{-d}$ cells (the curse of dimensionality).

The proof is two branches that meet. One branch is **Maurey's lemma**. A point in a convex hull is a weighted average of the vertices, so treating the weights as probabilities and averaging $N$ random draws makes the squared error $B^2/N$ on average. It is the same computation as the variance of a minibatch average shrinking like $1/N$. The other branch is **Barron's lemma**. The inverse Fourier transform writes $f-f(0)$ as a probability average of cosine waves, and each wave (a ridge function that varies in only one direction) is replaced by step functions whose heights add up to at most 2. Combining the branches gives $4C^2/N$ with $N$ step neurons, and replacing the steps by steep sigmoids gives an ordinary network with one hidden layer.

The second half is **generalization**. In practice we choose a function after seeing only $n$ data points, so the average loss on the training data (the empirical risk) can differ from the expected loss on new data (the population risk). The excess risk splits into optimization, generalization, and approximation terms, and the generalization term is controlled by the **Rademacher complexity**, which measures how well the class can follow random signs $\pm1$. The gap is then $2\operatorname{Rad}_n+O(1/\sqrt n)$, and for a class with norm at most $Q$, $\operatorname{Rad}_n\lesssim Q/\sqrt n$.`,
    nodes: [
      { id: 'barron', role: 'def', k: '18.1', t: R`바론 클래스 $\Gamma_C$`, en: R`The Barron class $\Gamma_C$`,
        d: R`푸리에 변환 $\hat f(\xi)=\int f(x)e^{-2\pi i\xi^Tx}dx$로 $\int|2\pi\xi||\hat f(\xi)|d\xi<C$인 함수를 모읍니다. 기울기의 주파수 진폭의 합이라 이런 함수는 $C$-립시츠입니다.`,
        dEn: R`With the Fourier transform $\hat f(\xi)=\int f(x)e^{-2\pi i\xi^Tx}dx$, collect the functions with $\int|2\pi\xi||\hat f(\xi)|d\xi<C$. It is the sum of the gradient's frequency amplitudes, so such functions are $C$-Lipschitz.` },
      { id: 'thm', role: 'q', k: '18.2', t: R`뉴런 $N$개로 $c/N$?`, en: R`$c/N$ with $N$ neurons?`,
        d: R`바론 정리: $f\in\Gamma_C$이면 모든 $c>4C^2$에 대해 은닉 뉴런 $N$개의 망이 단위 공에서 평균 제곱 오차 $c/N$ 이하를 냅니다. 필기의 “$c>4C_1$”은 $c>4C^2$으로 읽습니다.`,
        dEn: R`Barron's theorem: for $f\in\Gamma_C$ and every $c>4C^2$, a network with $N$ hidden neurons reaches mean squared error at most $c/N$ on the unit ball. The notes' "$c>4C_1$" is read as $c>4C^2$.` },
      { id: 'curse', role: 'lim', k: '18.2', at: '**차원의 저주**', t: R`격자는 $\varepsilon^{-d}$칸`, en: R`A grid needs $\varepsilon^{-d}$ cells`,
        d: R`격자 근사는 오차 $\varepsilon$에 칸이 $\varepsilon^{-d}$개 필요해 차원이 크면 쓸 수 없습니다. 바론 정리의 $N\approx4C^2/\varepsilon^2$에는 $d$가 없습니다. 다만 $C$가 $d$와 함께 커질 수 있습니다.`,
        dEn: R`Grid approximation needs $\varepsilon^{-d}$ cells for error $\varepsilon$, hopeless in high dimension. Barron's $N\approx4C^2/\varepsilon^2$ has no $d$, although $C$ may grow with $d$.` },
      { id: 'maurey', role: 'tool', k: '18.3', t: R`Maurey 보조정리`, en: R`Maurey's lemma`,
        d: R`힐베르트 공간에서 노름이 $B$ 이하인 원소들의 볼록 껍질(의 폐포)에 있는 점은 그 원소 $N$개의 평균으로 제곱 오차 $c/N$ ($c>B^2$) 이하로 근사됩니다.`,
        dEn: R`In a Hilbert space, a point of the (closed) convex hull of elements of norm at most $B$ is approximated by an average of $N$ of them with squared error at most $c/N$ ($c>B^2$).` },
      { id: 'sample', role: 'step', k: '18.3', at: ':::hand', t: R`무작위로 뽑아 평균하기`, en: R`Average random draws`,
        d: R`$\mathbb P(X_i=h_j)=\alpha_j$로 뽑으면 $\E X_i=f^*$이고, 독립이라 교차항이 사라져 $\E\lVert f^*-\frac1N\sum X_j\rVert^2\le B^2/N$. 기댓값이 그 이하이니 그런 뽑기 결과가 존재합니다.`,
        dEn: R`Drawing with $\mathbb P(X_i=h_j)=\alpha_j$ gives $\E X_i=f^*$, and independence kills the cross terms: $\E\lVert f^*-\frac1N\sum X_j\rVert^2\le B^2/N$. Since the expectation is that small, such a draw exists.` },
      { id: 'fourier', role: 'idea', k: '18.4', t: R`푸리에 표현과 확률측도 $\Lambda$`, en: R`Fourier form and the measure $\Lambda$`,
        d: R`역변환과 위상 $\kappa$로 $f(x)-f(0)=C_f\int q_x(\xi)d\Lambda(\xi)$. $\Lambda$의 밀도는 $|2\pi\xi||\hat f|/C_f$이고, 이 적분은 능선 함수 $x\mapsto C_fq_x(\xi)$들의 볼록 결합의 극한입니다.`,
        dEn: R`The inverse transform and the phase $\kappa$ give $f(x)-f(0)=C_f\int q_x(\xi)d\Lambda(\xi)$. $\Lambda$ has density $|2\pi\xi||\hat f|/C_f$, and the integral is a limit of convex combinations of the ridge functions $x\mapsto C_fq_x(\xi)$.` },
      { id: 'stair', role: 'step', k: '18.4', at: '**빠진 단계', t: R`능선을 계단으로: 높이 $2C$`, en: R`Ridge to staircase: height $2C$`,
        d: R`$q_x(\xi)=\varphi(\langle x,\omega\rangle)$이고 $\varphi(0)=0$, $|\varphi'|\le1$. $[-1,1]$에서 전체 변동이 2 이하라, 높이 2 이하인 헤비사이드들의 볼록 결합으로 오차 $1/K$ 이내에 근사됩니다.`,
        dEn: R`$q_x(\xi)=\varphi(\langle x,\omega\rangle)$ with $\varphi(0)=0$ and $|\varphi'|\le1$. Its total variation on $[-1,1]$ is at most 2, so convex combinations of Heavisides of height at most 2 approximate it within $1/K$.` },
      { id: 'done', role: 'res', k: '18.5', t: R`계단 뉴런 $N$개로 $4C^2/N$`, en: R`$4C^2/N$ with $N$ step neurons`,
        d: R`보조정리 2로 $f-f(0)\in\overline{\operatorname{co}}(G_C)$, 보조정리 1에 $B=2C$를 넣으면 평균 제곱 오차 $c/N$ ($c>4C^2$). 계수는 $\gamma_i/N$이고 출력 가중치의 합은 $2C$ 이하입니다.`,
        dEn: R`Lemma 2 gives $f-f(0)\in\overline{\operatorname{co}}(G_C)$, and Lemma 1 with $B=2C$ gives mean squared error $c/N$ ($c>4C^2$). The coefficients are $\gamma_i/N$, and the output weights add up to at most $2C$.` },
      { id: 'sigm', role: 'fix', k: '18.5', at: '**시그모이드에서 헤비사이드로**', t: R`$\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$`, en: R`$\sigma(\lambda t)\to\mathbf 1_{\mathbb R_+}(t)$`,
        d: R`기울기 $\lambda$를 키운 시그모이드는 초평면(부피 0) 밖에서 계단 함수로 가고, 유계라 $L^2$에서도 수렴합니다. 남겨 둔 여유 $c-c'$로 이 오차를 흡수하면 은닉층 하나의 신경망이 됩니다.`,
        dEn: R`A sigmoid with large slope $\lambda$ tends to the step function off a hyperplane (volume 0) and, being bounded, converges in $L^2$. The slack $c-c'$ absorbs this error, leaving a network with one hidden layer.` },
      { id: 'risk', role: 'def', k: '18.6', t: R`모집단 위험과 경험적 위험`, en: R`Population and empirical risk`,
        d: R`$R(f)=\E\ell(Y,f(X))$와 $\hat R_n(f)=\frac1n\sum\ell(y_i,f(x_i))$. 초과 위험은 최적화 + $2\sup_f|R-\hat R_n|$ + 근사의 세 항 이하로 나뉩니다.`,
        dEn: R`$R(f)=\E\ell(Y,f(X))$ and $\hat R_n(f)=\frac1n\sum\ell(y_i,f(x_i))$. The excess risk is bounded by optimization + $2\sup_f|R-\hat R_n|$ + approximation.` },
      { id: 'rad', role: 'tool', k: '18.7', t: R`라데마허 복잡도`, en: R`Rademacher complexity`,
        d: R`무작위 부호 $\xi_i=\pm1$과 클래스의 최대 상관 $\E\sup_f\frac1n\sum\xi_if(z_i)$. 함수 하나면 0, 모든 부호 패턴을 만들면 1입니다.`,
        dEn: R`The largest correlation of the class with random signs $\xi_i=\pm1$, $\E\sup_f\frac1n\sum\xi_if(z_i)$. It is 0 for a single function and 1 for a class producing every sign pattern.` },
      { id: 'gap', role: 'res', k: '18.7', at: ':::key 라데마허 일반화 한계', t: R`차이는 $2\operatorname{Rad}_n+O(1/\sqrt n)$`, en: R`Gap $2\operatorname{Rad}_n+O(1/\sqrt n)$`,
        d: R`대칭화로 기댓값 한계 $2\operatorname{Rad}_n$을, McDiarmid로 확률 한계를 얻습니다. 노름이 $Q$ 이하인 선형 클래스는 $\operatorname{Rad}\le Q/\sqrt n$이라 차이가 $O(1/\sqrt n)$입니다.`,
        dEn: R`Symmetrization gives the expected bound $2\operatorname{Rad}_n$, and McDiarmid the high-probability bound. A linear class of norm at most $Q$ has $\operatorname{Rad}\le Q/\sqrt n$, so the gap is $O(1/\sqrt n)$.` },
    ],
    rows: [['barron'], ['thm'], ['curse', 'maurey', 'fourier'], ['sample', 'stair'], ['done'], ['sigm'], ['risk'], ['rad'], ['gap']],
    edges: [
      ['barron', 'thm', R`이런 함수라면`, R`for such functions`],
      ['thm', 'curse', R`$d$가 크면?`, R`large $d$?`],
      ['thm', 'maurey', R`볼록 껍질에 있다면`, R`if in a convex hull`],
      ['thm', 'fourier', R`$f$는 볼록 껍질에?`, R`is $f$ in one?`],
      ['maurey', 'sample', R`증명`, R`proof`],
      ['fourier', 'stair', R`각 능선을`, R`each ridge`],
      ['sample', 'done', R`$B=2C$`, R`$B=2C$`],
      ['stair', 'done', R`$f-f(0)\in\overline{\operatorname{co}}(G_C)$`, R`$f-f(0)\in\overline{\operatorname{co}}(G_C)$`],
      ['done', 'sigm', R`계단을 시그모이드로`, R`steps to sigmoids`],
      ['sigm', 'risk', R`근사 다음은 일반화`, R`after approximation`],
      ['risk', 'rad', R`$\sup_f|R-\hat R_n|$을 재려면`, R`to measure the sup gap`],
      ['rad', 'gap', R`대칭화`, R`symmetrization`],
    ],
  });
})();
