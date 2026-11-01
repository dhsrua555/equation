/* 증명의 길잡이 — 18단원의 긴 증명(본문 600자 이상). 형식은 plan-a.js와 같습니다:
   쉬운 요약(easy)과 단계(nodes), 각 단계의 at은 한국어 본문에서 그 단계가 시작하는 조각의 첫머리입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.plans = EM.plans || {};
(function () {
  const R = String.raw;
  Object.assign(EM.plans, {
    'ch18-maurey': {
      easy: R`볼록 껍질 안의 점 $f^*=\sum_j\alpha_jh_j$를 원소 $N$개의 **단순 평균**으로 흉내 내고 싶습니다. 어떤 $N$개를 고를지 직접 찾는 대신, $h_j$를 확률 $\alpha_j$로 $N$번 무작위로 뽑습니다. 그러면 뽑은 것의 평균은 기댓값이 정확히 $f^*$이고, 서로 독립이라 오차의 제곱의 기댓값이 한 번 뽑을 때의 $\frac1N$배, 곧 $\frac{B^2}N$ 이하로 줄어듭니다.

평균이 그만큼 작다면 실제로 그만큼 작은 뽑기 결과가 하나는 있어야 합니다. 그 결과를 $g_1,\dots,g_N$으로 쓰고, 처음에 폐포 때문에 생긴 작은 거리 $\varepsilon$을 삼각 부등식으로 더하면 끝입니다. $c>B^2$의 여유가 바로 그 $\varepsilon$을 흡수합니다.`,
      easyEn: R`We want to imitate the point $f^*=\sum_j\alpha_jh_j$ of the convex hull by a **plain average** of $N$ elements. Instead of searching for which $N$ to pick, we draw $h_j$ with probability $\alpha_j$, $N$ times at random. The average of the draws then has expectation exactly $f^*$, and because the draws are independent, the expected squared error is $\frac1N$ times that of a single draw, at most $\frac{B^2}N$.

If the average is that small, some actual outcome of the draws must be that small. Call it $g_1,\dots,g_N$, and add the small distance $\varepsilon$ that came from the closure using the triangle inequality. The slack $c>B^2$ is exactly what absorbs that $\varepsilon$.`,
      nodes: [
        { id: 'approx', at: '**근사점.**', t: R`폐포에서 근사점 $f^*$`, en: R`A nearby point $f^*$`,
          d: R`폐포의 정의에서 볼록 결합 $f^*=\sum_j\alpha_jh_j$를 $f$와 $\varepsilon$ 이내로 잡습니다. 이제 유한한 볼록 결합만 다루면 됩니다.`,
          dEn: R`By the definition of closure, pick a convex combination $f^*=\sum_j\alpha_jh_j$ within $\varepsilon$ of $f$. Now only a finite convex combination remains.` },
        { id: 'draw', at: '**무작위 뽑기.**', t: R`가중치를 확률로`, en: R`Weights as probabilities`,
          d: R`$\mathbb P(X_i=h_j)=\alpha_j$로 독립으로 뽑으면 $\E X_i=f^*$, $\lVert X_i\rVert\le B$입니다.`,
          dEn: R`Drawing independently with $\mathbb P(X_i=h_j)=\alpha_j$ gives $\E X_i=f^*$ and $\lVert X_i\rVert\le B$.` },
        { id: 'cross', at: '**교차항 소거.**', t: R`교차항이 사라진다`, en: R`The cross terms vanish`,
          d: R`제곱 노름을 전개하면 $i\ne j$인 교차항은 독립성과 평균 $f^*$ 때문에 기댓값이 0입니다. 남는 것은 대각항 $N$개뿐입니다.`,
          dEn: R`Expanding the squared norm, each cross term with $i\ne j$ has expectation 0 by independence and the common mean $f^*$. Only the $N$ diagonal terms remain.` },
        { id: 'one', at: '**한 항의 크기.**', t: R`$\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)$`, en: R`$\frac1N(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2)$`,
          d: R`$N$개를 $N^2$으로 나누어 $\frac1N\E\lVert f^*-X_1\rVert^2$이 남고, 전개하면 $\le\frac{B^2}N$입니다.`,
          dEn: R`$N$ terms divided by $N^2$ leave $\frac1N\E\lVert f^*-X_1\rVert^2$, which expands to at most $\frac{B^2}N$.` },
        { id: 'exist', at: '**존재.**', t: R`확률적 방법`, en: R`The probabilistic method`,
          d: R`기댓값이 $\frac{B^2}N$ 이하이면 그 이하인 결과가 적어도 하나 있습니다. 그것이 $g_1,\dots,g_N$입니다.`,
          dEn: R`If the expectation is at most $\frac{B^2}N$, at least one outcome is at most that. That outcome is $g_1,\dots,g_N$.` },
        { id: 'tri', at: '**삼각 부등식.**', t: R`$\varepsilon$을 $c>B^2$로 흡수`, en: R`Absorb $\varepsilon$ with $c>B^2$`,
          d: R`$\lVert f-\frac1N\sum g_i\rVert\le\varepsilon+\frac B{\sqrt N}$이고, $\varepsilon$을 $\frac{\sqrt c-B}{\sqrt N}$보다 작게 잡으면 $\sqrt{c/N}$ 아래입니다.`,
          dEn: R`$\lVert f-\frac1N\sum g_i\rVert\le\varepsilon+\frac B{\sqrt N}$, and taking $\varepsilon$ below $\frac{\sqrt c-B}{\sqrt N}$ keeps it under $\sqrt{c/N}$.` },
      ],
    },
    'ch18-barronlemma': {
      easy: R`보여야 할 것은 $f-f(0)$이 높이 $2C$ 이하인 “계단 뉴런”들의 볼록 결합으로 얼마든지 가깝게 근사된다는 것입니다. 먼저 푸리에 역변환으로 $f-f(0)$을 코사인 물결 $q_x(\xi)$들의 **확률 평균** $C_f\int q_x(\xi)d\Lambda(\xi)$로 씁니다. 평균이므로, 각 물결이 계단 뉴런들의 볼록 껍질 안에 있으면 평균도 그 안에 있을 것입니다.

각 물결은 한 방향 $\omega$로만 변하는 1차원 함수 $\varphi(t)$이고, $\varphi(0)=0$에서 출발해 기울기가 1을 넘지 않습니다. 그래서 $[-1,1]$ 위의 계단 함수로 오차 $\frac1K$ 이내에 따라갈 수 있고, 계단 높이의 합은 2를 넘지 않습니다. 마지막으로 적분을 무작위 표본의 평균으로 바꾸어(Maurey와 같은 계산) 볼록 결합의 극한임을 확인합니다.`,
      easyEn: R`What must be shown is that $f-f(0)$ can be approximated arbitrarily well by convex combinations of "step neurons" of height at most $2C$. First the inverse Fourier transform writes $f-f(0)$ as a **probability average** $C_f\int q_x(\xi)d\Lambda(\xi)$ of cosine waves $q_x(\xi)$. Since it is an average, if each wave lies in the convex hull of step neurons, the average should too.

Each wave is a one-dimensional function $\varphi(t)$ that varies in one direction $\omega$ only, starts at $\varphi(0)=0$, and has slope at most 1. So a staircase on $[-1,1]$ follows it within $\frac1K$, and the step heights add up to at most 2. Finally, replacing the integral by an average of random samples (the same computation as Maurey's) confirms that it is a limit of convex combinations.`,
      nodes: [
        { id: 'four', at: '**푸리에 표현 (필기).**', t: R`코사인 물결의 확률 평균`, en: R`A probability average of cosines`,
          d: R`역변환의 실수부와 위상 $\kappa$로 $f(x)-f(0)=C_f\int q_x(\xi)d\Lambda(\xi)$. $\Lambda$는 $C_f$로 나누어 확률측도로 만듭니다.`,
          dEn: R`The real part of the inverse transform with the phase $\kappa$ gives $f(x)-f(0)=C_f\int q_x(\xi)d\Lambda(\xi)$, with $\Lambda$ divided by $C_f$ to make a probability measure.` },
        { id: 'ridge', at: '**능선 함수.**', t: R`능선 $\varphi(\langle x,\omega\rangle)$`, en: R`The ridge $\varphi(\langle x,\omega\rangle)$`,
          d: R`$q_x(\xi)$는 $t=\langle x,\omega\rangle\in[-1,1]$만의 함수이고 $\varphi(0)=0$, $|\varphi'|\le1$이라 $|q_x|\le1$입니다.`,
          dEn: R`$q_x(\xi)$ depends only on $t=\langle x,\omega\rangle\in[-1,1]$, with $\varphi(0)=0$ and $|\varphi'|\le1$, so $|q_x|\le1$.` },
        { id: 'stair', at: '**계단 근사.**', t: R`계단으로: 높이 합 $\le2$`, en: R`To steps: heights add to $\le2$`,
          d: R`$t_k=\pm k/K$에서 뛰는 계단은 오차 $\frac1K$ 이내이고, 높이의 합은 전체 변동 $\le2$. $C_f$를 곱해 $G_C$의 볼록 결합이 됩니다.`,
          dEn: R`Steps at $t_k=\pm k/K$ stay within $\frac1K$, and their heights add up to the total variation, at most 2. Multiplying by $C_f$ gives convex combinations of $G_C$.` },
        { id: 'avg', at: '**적분을 평균으로.**', t: R`적분을 무작위 평균으로`, en: R`The integral as a random average`,
          d: R`$\Lambda$에서 뽑은 $n$개의 평균은 $L^2_\circ$에서 평균 제곱 오차 $C_f^2/n$ 이하로 $f-f(0)$에 다가갑니다. 닫힌 볼록 집합 안에 머무므로 극한도 그 안에 있습니다.`,
          dEn: R`The average of $n$ draws from $\Lambda$ approaches $f-f(0)$ in $L^2_\circ$ with mean squared error at most $C_f^2/n$. It stays inside a closed convex set, so the limit does too.` },
      ],
    },
    'ch18-barronthm': {
      easy: R`두 보조정리를 이어 붙이고 마지막에 계단을 시그모이드로 바꿉니다. 보조정리 2로 $f-f(0)$이 높이 $2C$ 이하인 계단 뉴런들의 볼록 껍질(의 폐포)에 있고, 계단 뉴런 하나의 노름은 $2C$ 이하이므로 보조정리 1에 $B=2C$를 넣으면 계단 뉴런 $N$개의 평균으로 오차가 $\sqrt{c'/N}$ 이하가 됩니다.

$c'$를 $c$보다 조금 작게 잡아 남긴 여유 $\eta$로, 계단을 시그모이드로 바꾸며 생기는 오차를 흡수합니다. 계수의 절댓값의 합이 $2C$ 이하라서, 뉴런 하나당 오차를 $\eta/(2C)$로만 만들면 됩니다.`,
      easyEn: R`Chain the two lemmas and finally replace the steps by sigmoids. By Lemma 2, $f-f(0)$ lies in the (closed) convex hull of step neurons of height at most $2C$, and each step neuron has norm at most $2C$, so Lemma 1 with $B=2C$ gives an average of $N$ step neurons within $\sqrt{c'/N}$.

Taking $c'$ slightly below $c$ leaves a slack $\eta$ that absorbs the error of replacing the steps by sigmoids. The coefficients add up to at most $2C$ in absolute value, so it is enough to make the error of each neuron at most $\eta/(2C)$.`,
      nodes: [
        { id: 'heavi', at: '**헤비사이드 판.**', t: R`계단 뉴런 $N$개로 $\sqrt{c'/N}$`, en: R`$\sqrt{c'/N}$ with $N$ step neurons`,
          d: R`보조정리 2와 $\lVert g\rVert\le2C$로 보조정리 1을 $B=2C$, $4C^2<c'<c$에서 씁니다.`,
          dEn: R`Lemma 2 and $\lVert g\rVert\le2C$ let us apply Lemma 1 with $B=2C$ and $4C^2<c'<c$.` },
        { id: 'swap', at: '**시그모이드로 바꾸기.**', t: R`여유 $\eta$ 안에서 바꾸기`, en: R`Swap within the slack $\eta$`,
          d: R`$\lambda$를 크게 잡아 뉴런마다 $L^2_\circ$ 오차를 $\eta/(2C)$ 이하로 만듭니다.`,
          dEn: R`Take $\lambda$ large so that each neuron's $L^2_\circ$ error is at most $\eta/(2C)$.` },
        { id: 'tri', at: '**삼각 부등식.**', t: R`합쳐서 $\sqrt{c/N}$`, en: R`Together $\sqrt{c/N}$`,
          d: R`계수 합 $\sum|\gamma_i|/N\le2C$로 추가 오차가 $\eta$ 이하이고, 합하면 $\sqrt{c/N}$입니다.`,
          dEn: R`With $\sum|\gamma_i|/N\le2C$ the extra error is at most $\eta$, and the total is $\sqrt{c/N}$.` },
      ],
    },
    'ch18-symm': {
      easy: R`모집단의 기댓값 $\E f$는 직접 다루기 어렵습니다. 그래서 같은 분포에서 뽑은 두 번째 표본(유령 표본)의 평균으로 바꾸면, 비교 대상이 “두 표본 평균의 차”가 됩니다.

두 표본은 바꿔 놓아도 분포가 같으므로, 각 차에 무작위 부호를 곱해도 기댓값이 그대로입니다. 그러면 $\sup$을 두 표본에 나누어 각각이 라데마허 복잡도가 되고, 합해서 $2\operatorname{Rad}_n$입니다.`,
      easyEn: R`The population expectation $\E f$ is hard to handle directly. Replacing it by the average over a second sample from the same distribution (a ghost sample) turns the comparison into a "difference of two sample averages".

The two samples can be swapped without changing the distribution, so multiplying each difference by a random sign leaves the expectation unchanged. Then the $\sup$ splits over the two samples, each part is a Rademacher complexity, and together they give $2\operatorname{Rad}_n$.`,
      nodes: [
        { id: 'ghost', at: '**유령 표본.**', t: R`$\E f$를 유령 표본의 평균으로`, en: R`$\E f$ as a ghost-sample average`,
          d: R`$\E f=\E'\frac1n\sum f(z_i')$을 넣고 $\sup\E\le\E\sup$으로 기댓값을 밖으로 꺼냅니다.`,
          dEn: R`Insert $\E f=\E'\frac1n\sum f(z_i')$ and pull the expectation out with $\sup\E\le\E\sup$.` },
        { id: 'sign', at: '**부호 넣기.**', t: R`맞바꿈 대칭으로 부호 $\xi_i$`, en: R`Signs $\xi_i$ by swap symmetry`,
          d: R`$z_i\leftrightarrow z_i'$를 바꿔도 분포가 같으니 각 차에 부호를 곱해도 기댓값이 같습니다.`,
          dEn: R`Swapping $z_i\leftrightarrow z_i'$ keeps the distribution, so multiplying each difference by a sign keeps the expectation.` },
        { id: 'split', at: '**둘로 나누기.**', t: R`$\sup$을 나누어 $2\operatorname{Rad}_n$`, en: R`Split the sup: $2\operatorname{Rad}_n$`,
          d: R`$\sup$의 준가법성으로 두 표본의 항을 떼면 각각의 기댓값이 $\operatorname{Rad}_n(\mathcal F)$입니다.`,
          dEn: R`Subadditivity of $\sup$ separates the two samples, and each expectation is $\operatorname{Rad}_n(\mathcal F)$.` },
      ],
    },
  });
})();
