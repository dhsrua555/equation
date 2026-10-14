/* 논리 지도 — 07 서포트 벡터 머신. 단원 첫머리의 쉬운 요약(easy), 생각의 흐름을 그린 지도(nodes·rows·edges),
   그리고 각 절 머리와 소제목(at)에 붙는 위치 표시. 아래쪽은 계산 줄기(5–7)와 근거 줄기(8–10) 두 갈래입니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 7,
    easy: R`
빨간 점과 파란 점을 직선(일반적으로 **초평면**)으로 가르는 방법은 보통 무수히 많습니다. 이 단원의 질문은 그중 어느 것이 가장 좋은가입니다. **서포트 벡터 머신**(SVM)의 답은 “두 무리 사이로 가장 넓은 도로를 내고, 그 한가운데 선을 고르라”입니다. 경계에서 가장 가까운 점까지의 거리를 **마진**(margin)이라 하고, 마진이 클수록 새 점이 조금 흔들려도 올바른 쪽에 남을 가능성이 큽니다.

점과 초평면 사이의 거리 공식으로 마진을 식으로 쓰고, 초평면의 식은 양수배를 해도 같은 평면이라는 점(스케일 불변성)을 이용하면 문제가 깔끔해집니다. 모든 점이 도로 안으로 들어오지 않도록 $y_i(w^Tx_i+b)\ge1$을 지키면서 $\frac12\lVert w\rVert^2$을 가장 작게 만드는 것, 이것이 하드 마진 SVM입니다.

제약이 있는 최적화는 **라그랑주 승수**(Lagrange multiplier) $\alpha_i$로 다룹니다. 제약을 어기면 벌금을 매긴다고 생각하면, 우리는 $w,b$로 목적함수를 줄이고 상대는 $\alpha$로 키우는 게임이 됩니다. 두 사람의 순서를 바꾼 것이 **쌍대 문제**(dual problem)이고, 풀고 나면 $w=\sum_i\alpha_iy_ix_i$입니다. 도로에서 먼 점은 $\alpha_i=0$이라, 도로 가장자리에 닿은 점(**서포트 벡터**)만 답을 결정합니다. 쌍대 문제에는 자료가 내적 $x_i^Tx_j$로만 들어가서 커널로 넓힐 길이 열리고, 두 점짜리 자료로 이 과정을 처음부터 끝까지 손으로 풀어 봅니다.

마지막으로 순서를 바꿔도 되는 이유를 봅니다. 게임에서는 나중에 두는 쪽이 유리하므로 언제나 $\max\min\le\min\max$이고(**최대-최소 부등식**), 이것이 약한 쌍대성입니다. 등호는 안장점이 있을 때 성립하는데, SVM의 라그랑지안은 $(w,b)$에 볼록하고 $\alpha$에 선형이라 등호(강한 쌍대성)가 되어, 쌍대 문제를 풀어도 원래 문제의 답을 얻습니다.`,
    easyEn: R`
There are usually infinitely many ways to separate red points from blue points with a line (in general, a **hyperplane**). This unit asks which of them is best. The answer of the **support vector machine** (SVM) is: build the widest road between the two groups and take the line down its middle. The distance from the boundary to the nearest point is called the **margin**, and the larger the margin, the more likely a new point stays on the correct side even if it wobbles a little.

The formula for the distance from a point to a hyperplane turns the margin into an expression, and the fact that multiplying the equation of a hyperplane by a positive number gives the same plane (scale invariance) makes the problem tidy: keep every point from entering the road, $y_i(w^Tx_i+b)\ge1$, while making $\frac12\lVert w\rVert^2$ as small as possible. This is the hard-margin SVM.

Constrained optimization is handled with **Lagrange multipliers** $\alpha_i$. Think of fining every violated constraint: we choose $w,b$ to make the objective small, while an opponent chooses $\alpha$ to make it large. Swapping who moves first gives the **dual problem**, and its solution yields $w=\sum_i\alpha_iy_ix_i$. Points far from the road get $\alpha_i=0$, so only the points touching the edges of the road (the **support vectors**) decide the answer. The data enter the dual only through inner products $x_i^Tx_j$, which opens the way to kernels, and we solve the whole procedure by hand, start to finish, on a two-point dataset.

Finally we see why swapping the order is allowed. In a game the player who moves second has the advantage, so always $\max\min\le\min\max$ (the **max–min inequality**), and this is weak duality. Equality holds when there is a saddle point; the SVM Lagrangian is convex in $(w,b)$ and linear in $\alpha$, so equality (strong duality) holds, and solving the dual gives the answer to the original problem.`,
    nodes: [
      { id: 'q', role: 'q', k: '7.1', t: R`어느 초평면이 가장 좋은가?`, en: R`Which hyperplane is best?`,
        d: R`$w^Tx+b$의 부호로 분류하면($w$는 법선) 모든 점을 맞히는 조건은 $y_i(w^Tx_i+b)\ge0$입니다. 이런 초평면은 무수히 많아서 고를 기준이 필요합니다.`,
        dEn: R`Classify by the sign of $w^Tx+b$ ($w$ is the normal); getting every point right means $y_i(w^Tx_i+b)\ge0$. Infinitely many hyperplanes do this, so we need a criterion to choose.` },
      { id: 'dist', role: 'tool', k: '7.2', t: R`거리와 마진`, en: R`Distance and margin`,
        d: R`수선의 발로 점과 초평면 사이의 거리 $\lvert w^Tx+b\rvert/\lVert w\rVert$를 유도합니다. 가장 가까운 점까지의 거리가 마진 $r(w,b)$, 초평면을 재는 점수입니다.`,
        dEn: R`With the foot of the perpendicular, derive the distance $\lvert w^Tx+b\rvert/\lVert w\rVert$ from a point to a hyperplane. The distance to the nearest point is the margin $r(w,b)$, the score of a hyperplane.` },
      { id: 'primal', role: 'res', k: '7.3', t: R`하드 마진 SVM (원문제)`, en: R`Hard-margin SVM (primal)`,
        d: R`마진이 최대인 평면을 고릅니다. 스케일 불변성으로 가장 가까운 점에서 $\lvert w^Tx+b\rvert=1$로 맞추면 $y_i(w^Tx_i+b)\ge1$ 아래 $\frac12\lVert w\rVert^2$ 최소화가 됩니다.`,
        dEn: R`Choose the plane with the largest margin. Scale invariance lets us set $\lvert w^Tx+b\rvert=1$ at the nearest point, and the task becomes: minimize $\frac12\lVert w\rVert^2$ subject to $y_i(w^Tx_i+b)\ge1$.` },
      { id: 'penalty', role: 'step', k: '7.4', t: R`제약을 벌점으로: min–max`, en: R`Constraints as penalties: min–max`,
        d: R`$\max_{\alpha_i\ge0}\alpha_i(1-y_i(x_i^Tw+b))$는 제약을 지키면 0, 어기면 $+\infty$입니다. 이 벌점을 더해 원문제를 제약 없는 $\min_{w,b}\max_{\alpha\ge0}L_p$로 바꿉니다.`,
        dEn: R`$\max_{\alpha_i\ge0}\alpha_i(1-y_i(x_i^Tw+b))$ is 0 when the constraint holds and $+\infty$ when it fails. Adding these penalties turns the primal into the unconstrained $\min_{w,b}\max_{\alpha\ge0}L_p$.` },
      { id: 'dual', role: 'res', k: '7.4', at: ':::key SVM 쌍대 문제', t: R`쌍대 문제 (이차계획법)`, en: R`The dual problem (a QP)`,
        d: R`min과 max의 순서를 바꾸면 값은 같거나 작아집니다(약한 쌍대성). 안쪽 최소화에서 $w=\sum_i\alpha_iy_ix_i$, $\sum_i\alpha_iy_i=0$을 얻어 넣으면 내적 $x_i^Tx_j$만 담은 $\alpha$의 문제가 남습니다.`,
        dEn: R`Swapping min and max keeps the value or lowers it (weak duality). The inner minimization gives $w=\sum_i\alpha_iy_ix_i$ and $\sum_i\alpha_iy_i=0$; substituting leaves a problem in $\alpha$ that sees the data only through $x_i^Tx_j$.` },
      { id: 'sv', role: 'step', k: '7.5', t: R`$b$와 서포트 벡터`, en: R`$b$ and the support vectors`,
        d: R`$\alpha$를 구하면 $w=\sum_i\alpha_iy_ix_i$, 서포트 벡터 하나에서 $b=y_i-x_i^Tw$입니다. KKT 상보성 때문에 $\alpha_i>0$인 점, 곧 서포트 벡터만 해에 기여합니다.`,
        dEn: R`With $\alpha$ in hand, $w=\sum_i\alpha_iy_ix_i$, and one support vector gives $b=y_i-x_i^Tw$. By KKT complementary slackness only the points with $\alpha_i>0$, the support vectors, contribute.` },
      { id: 'ps3', role: 'ex', k: '7.6', t: R`두 점 자료로 끝까지`, en: R`Two points, start to finish`,
        d: R`$(0,0)$과 $(2,2)$에서 라그랑지안 → 정류 조건 → 쌍대 → $\alpha^*=\frac14$ → $w^*=(\frac12,\frac12)$, $b^*=-1$. 답은 두 점의 수직이등분선 $x_1+x_2=2$입니다.`,
        dEn: R`For the points $(0,0)$ and $(2,2)$: Lagrangian → stationarity → dual → $\alpha^*=\frac14$ → $w^*=(\frac12,\frac12)$, $b^*=-1$. The answer is the perpendicular bisector of the two points, $x_1+x_2=2$.` },
      { id: 'minmax', role: 'tool', k: '7.7', t: R`최대-최소 부등식`, en: R`The max–min inequality`,
        d: R`임의의 $x',y'$에서 $\min_yf(x',y)\le f(x',y')\le\max_xf(x,y')$를 세우고 한쪽씩 최적화하면 $\max_x\min_yf\le\min_y\max_xf$. 반례 $(x-y)^2$에서는 등호가 깨집니다.`,
        dEn: R`For arbitrary $x',y'$, write $\min_yf(x',y)\le f(x',y')\le\max_xf(x,y')$ and optimize one side at a time: $\max_x\min_yf\le\min_y\max_xf$. The counterexample $(x-y)^2$ shows that equality can fail.` },
      { id: 'saddle', role: 'check', k: '7.7', at: '### 등호의 조건', t: R`안장점이면 등호`, en: R`A saddle point gives equality`,
        d: R`$f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$인 안장점이 있으면 두 값이 같습니다. 최소최대 정리는 $f$가 $x$에 오목, $y$에 볼록일 때(몇 가지 조건 아래) 이를 보장합니다.`,
        dEn: R`If there is a saddle point with $f(x,y^*)\le f(x^*,y^*)\le f(x^*,y)$, the two values are equal. The minimax theorem guarantees this when $f$ is concave in $x$ and convex in $y$ (under some conditions).` },
      { id: 'link', role: 'app', k: '7.7', at: '### SVM과의 연결', t: R`SVM: 강한 쌍대성`, en: R`Back to the SVM: strong duality`,
        d: R`$x\to\alpha$, $y\to(w,b)$, $f\to L_p$로 바꾸면 약한 쌍대성입니다. $L_p$는 $(w,b)$에 볼록, $\alpha$에 선형이라 등호(강한 쌍대성)가 되고, 그 안장점이 7.6의 해입니다.`,
        dEn: R`With $x\to\alpha$, $y\to(w,b)$, $f\to L_p$ this is weak duality. $L_p$ is convex in $(w,b)$ and linear in $\alpha$, so equality (strong duality) holds, and the saddle point is the solution found in 7.6.` },
    ],
    rows: [['q'], ['dist'], ['primal'], ['penalty'], ['dual', 'minmax'], ['sv', 'saddle'], ['ps3', 'link']],
    edges: [
      ['q', 'dist', R`고를 기준은 거리`, R`choose by distance`],
      ['dist', 'primal', R`마진을 최대로`, R`maximize the margin`],
      ['primal', 'penalty', R`제약 없애기`, R`remove the constraints`],
      ['penalty', 'dual', R`min·max 바꾸기`, R`swap min and max`],
      ['penalty', 'minmax', R`그래도 되나?`, R`is that allowed?`],
      ['dual', 'sv', R`$\alpha$에서 $w,b$로`, R`from $\alpha$ to $w,b$`],
      ['minmax', 'saddle', R`언제 같은가?`, R`when equal?`],
      ['sv', 'ps3', R`두 점으로 끝까지`, R`two points by hand`],
      ['saddle', 'link', R`SVM에 대입`, R`apply to the SVM`],
    ],
  });
})();
