/* 12 서포트 벡터 머신 — UML 15장, 강의 노트 “Proof of the Equivalence of Two Hard-SVM Formulations” (Eq. 15.1), “Convex Optimization: Fritz John, KKT, Lagrangian Duality” (15장 보충), “Weak Duality Inequality” (Exercise 15.4) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 12, part: 'B', title: '서포트 벡터 머신', en: 'Support Vector Machines', ref: 'UML 15장', plot: 'hinge',
    fig: R`마진 z = y⟨w, x⟩에 대한 힌지 손실 max{0, 1−z}(굵은 선)와 0–1 손실(계단), 램프 손실과 로지스틱 계열 곡선`,
    tagline: R`분리하는 초평면이 여럿이면 가장 넓은 길을 내는 것을 고릅니다. 마진이 크면 차원이 아니라 (반지름/마진)²이 표본 수를 정합니다.`,
    summary: R`자료를 분리하는 반공간 중 **마진**(가장 가까운 점까지의 거리)이 가장 큰 것을 찾는 것이 **하드 SVM**입니다. $\lVert w\rVert=1$일 때 점까지의 거리는 $\lvert\langle w,x\rangle+b\rvert$이고, 분리하는 초평면 위에서는 이것이 $y(\langle w,x\rangle+b)$와 같아 두 표현이 동치입니다(강의 노트). 척도를 바꾸면 이차계획 $\min\lVert w\rVert^2$ s.t. $y_i(\langle w,x_i\rangle+b)\ge1$이 됩니다. 분리되지 않는 자료에는 여유 변수를 허용하는 **소프트 SVM**을 쓰고, 이는 “규제 + 힌지 손실”의 RLM이라 13장의 안정성 분석이 그대로 적용됩니다: 기대 0–1 오차 $\le L^{\mathrm{hinge}}_\cD(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}$. 라그랑주 **쌍대성**으로 해가 **서포트 벡터**들의 결합 $w=\sum\alpha_iy_ix_i$임을 보이고, 쌍대 문제가 내적 $\langle x_i,x_j\rangle$만 쓴다는 사실이 다음 단원의 커널로 이어집니다. 강의 노트는 약한 쌍대성 $\min\max\ge\max\min$을 별도로 증명했습니다.`,
    goals: [
      R`점과 초평면 사이의 거리 공식을 증명하고 마진을 정의할 수 있다`,
      R`하드 SVM의 두 표현(절댓값/부호 곱)이 분리 가능한 자료에서 동치임을 증명할 수 있다`,
      R`하드 SVM을 이차계획 $\min\lVert w\rVert^2$로 바꾸는 척도 논법을 쓸 수 있다`,
      R`소프트 SVM이 “$\lambda\lVert w\rVert^2$ + 힌지 손실”과 같음을 보이고 표본 복잡도를 13장으로 유도할 수 있다`,
      R`약한 쌍대성을 증명하고 하드·소프트 SVM의 쌍대 문제와 서포트 벡터 조건을 유도할 수 있다`,
      R`소프트 SVM의 SGD 구현을 14.5.3의 결과로 설명할 수 있다`,
    ],
    secTitles: { '15.1': '마진과 하드 SVM', '15.1b': '표본 복잡도', '15.2': '소프트 SVM', '15.3': '서포트 벡터', '15.4': '쌍대성', '15.5': 'SGD 구현' },
    sections: [
      { k: '15.1', p: 202, src: '강의 노트 · Eq. (15.1)', title: '마진과 하드 SVM', body: R`
:::key 점과 초평면 사이의 거리
$\lVert w\rVert=1$이면 점 $x$와 초평면 $\{v:\langle w,v\rangle+b=0\}$ 사이의 거리는 $\lvert\langle w,x\rangle+b\rvert$이다.
:::

$v=x-(\langle w,x\rangle+b)w$는 초평면 위에 있고($\langle w,v\rangle+b=\langle w,x\rangle+b-(\langle w,x\rangle+b)\lVert w\rVert^2=0$) $\lVert x-v\rVert=\lvert\langle w,x\rangle+b\rvert$. 초평면 위의 임의의 $u$에 대해 $\lVert x-u\rVert\ge\lvert\langle w,x-u\rangle\rvert=\lvert\langle w,x\rangle+b\rvert$ (코시–슈바르츠, $\langle w,u\rangle=-b$)이므로 최소입니다.

**마진**은 표본에서 초평면까지 가장 가까운 거리입니다. 하드 SVM은 분리하는 초평면 중 마진이 가장 큰 것을 고릅니다.

:::key 하드 SVM의 두 표현
자료가 분리 가능하면 다음 두 문제는 최적값과 최적해가 같다.
$$\text{(A)}\ \max_{\lVert w\rVert=1}\min_i\lvert\langle w,x_i\rangle+b\rvert\ \text{ s.t. }\ y_i(\langle w,x_i\rangle+b)>0\ \forall i,\qquad\text{(B)}\ \max_{\lVert w\rVert=1}\min_iy_i(\langle w,x_i\rangle+b).$$
:::

:::hand 강의 노트 — 세 단계
1. **(A)는 분리하는 정규화 초평면의 집합 $G$ 위의 최적화**이다.
2. $G$ 위에서는 항마다 $y_i(\langle w,x_i\rangle+b)=\lvert\langle w,x_i\rangle+b\rvert$ ($y_i=1$이면 양수이므로, $y_i=-1$이면 음수의 부호를 뒤집은 것이므로). 따라서 두 목적함수가 같다.
3. **(B)의 최적해는 저절로 $G$에 들어간다**: 분리 가능하므로 $G$의 어떤 점에서 (B)의 목적값이 양수이고, 최적해의 목적값은 그 이상이라 $\min_iy_i(\cdot)>0$, 즉 모든 $i$에서 분리.
:::

:::key 하드 SVM의 이차계획 표현
$(w_0,b_0)=\argmin_{(w,b)}\lVert w\rVert^2$ s.t. $y_i(\langle w,x_i\rangle+b)\ge1$ ($\forall i$)라 하면 $\hat w=\frac{w_0}{\lVert w_0\rVert}$, $\hat b=\frac{b_0}{\lVert w_0\rVert}$가 하드 SVM의 해이고 마진은 $\frac1{\lVert w_0\rVert}$이다.
:::

(B)의 해 $(w^\ast,b^\ast)$의 마진을 $\gamma^\ast$라 하면 $(w^\ast/\gamma^\ast,b^\ast/\gamma^\ast)$는 제약을 만족하므로 $\lVert w_0\rVert\le\frac1{\gamma^\ast}$. 역으로 $(\hat w,\hat b)$의 마진은 $\min_iy_i(\langle w_0,x_i\rangle+b_0)/\lVert w_0\rVert\ge\frac1{\lVert w_0\rVert}\ge\gamma^\ast$ — 최적입니다.
` },
      { k: '15.1b', p: 205, title: '동차 SVM과 하드 SVM의 표본 복잡도', body: R`
$b$를 없애는 **동차** 형태 $\min\lVert w\rVert^2$ s.t. $y_i\langle w,x_i\rangle\ge1$이 분석에 편합니다(9단원처럼 좌표를 하나 늘려 편향을 흡수할 수 있지만, 그러면 $b$도 규제된다는 작은 차이가 생깁니다).

:::def (γ, ρ)-마진 분리
$\cD$가 동차 반공간으로 **$(\gamma,\rho)$-마진 분리**: $\lVert w^\ast\rVert=1$인 $w^\ast$가 있어 확률 1로 $y\langle w^\ast,x\rangle\ge\gamma$이고 $\lVert x\rVert\le\rho$.
:::

:::key 하드 SVM의 표본 복잡도
$\cD$가 동차 반공간으로 $(\gamma,\rho)$-마진 분리이면, 확률 $1-\delta$ 이상으로 크기 $m$ 표본의 하드 SVM 출력의 0–1 오차는
$$\sqrt{\frac{4(\rho/\gamma)^2}m}+\sqrt{\frac{2\ln(2/\delta)}m}\ \text{ 이하이다.}$$
:::

차원 $d$가 없습니다! 반공간의 VC 차원은 $d+1$이라 $d$가 크면 VC 상한은 쓸모없지만, 마진이 크면 $(\rho/\gamma)^2$이 대신 복잡도를 잽니다(증명은 교재 26장의 라데마허 복잡도). 퍼셉트론의 실수 상한 $(RB)^2=(\rho/\gamma)^2$과 같은 양이라는 점도 눈여겨보세요.
` },
      { k: '15.2', p: 206, title: '소프트 SVM과 힌지 손실', body: R`
자료가 분리되지 않으면 제약을 **여유 변수** $\xi_i\ge0$만큼 풀어 줍니다.
$$\min_{w,b,\xi}\Big(\lambda\lVert w\rVert^2+\frac1m\sum_{i=1}^m\xi_i\Big)\quad\text{s.t.}\quad y_i(\langle w,x_i\rangle+b)\ge1-\xi_i,\ \ \xi_i\ge0.$$

:::key 소프트 SVM = 힌지 손실 + 규제
소프트 SVM은 다음과 같다.
$$\min_{w,b}\Big(\lambda\lVert w\rVert^2+L^{\mathrm{hinge}}_S((w,b))\Big),\qquad L^{\mathrm{hinge}}_S=\frac1m\sum_i\max\{0,1-y_i(\langle w,x_i\rangle+b)\}.$$
:::

$(w,b)$를 고정하면 $\xi_i$는 제약 $\xi_i\ge0$, $\xi_i\ge1-y_i(\cdot)$ 아래에서 가능한 한 작게 고르는 것이 최적이고, 그 값이 $\max\{0,1-y_i(\cdot)\}$ — 바로 힌지 손실입니다.

**표본 복잡도.** 소프트 SVM(동차)은 규제 $\lambda\lVert w\rVert^2$와 $\rho$-립시츠 볼록 손실(힌지, $\lVert x\rVert\le\rho$)의 RLM이므로 13장의 오라클 부등식이 그대로 적용되고, 힌지가 0–1 손실을 위에서 누르므로
$$\E_S[L^{0-1}_\cD(A(S))]\le\E_S[L^{\mathrm{hinge}}_\cD(A(S))]\le L^{\mathrm{hinge}}_\cD(u)+\lambda\lVert u\rVert^2+\frac{2\rho^2}{\lambda m}\qquad(\forall u).$$
$\lVert u\rVert\le B$에서 $\lambda$를 최적화하면 $\min_{\lVert u\rVert\le B}L^{\mathrm{hinge}}_\cD(u)+\sqrt{8\rho^2B^2/m}$. 역시 차원이 아니라 노름 $B$와 반지름 $\rho$가 복잡도입니다.
` },
      { k: '15.3', p: 210, title: '최적 조건과 서포트 벡터', body: R`
:::key 서포트 벡터
동차 하드 SVM의 해 $w_0$와 $I=\{i:\lvert\langle w_0,x_i\rangle\rvert=1\}$에 대해 계수 $\alpha_i$가 있어 $w_0=\sum_{i\in I}\alpha_ix_i$. $\{x_i:i\in I\}$를 **서포트 벡터**라 한다.
:::

마진 경계에 딱 걸친 점들만 해를 결정합니다. 나머지 점은 조금 움직이거나 지워도 해가 같습니다. 이것은 다음 절의 KKT 조건 중 **상보 여유성** $\alpha_i\big(1-y_i\langle w,x_i\rangle\big)=0$에서 나옵니다: 제약이 느슨한($y_i\langle w,x_i\rangle>1$) 점은 $\alpha_i=0$.

:::note 심층 신경망 과목과의 연결
같은 결론을 라그랑주 승수로 유도하고 $b$를 서포트 벡터에서 구했습니다[[@dnn:ch07:7.5|$b$ 구하기와 서포트 벡터.]]. 이 과목은 여기에 소프트 SVM의 상자 제약과 안정성 기반 일반화 상한을 더합니다.
:::
` },
      { k: '15.4', p: 211, src: '강의 노트 · Exercise 15.4, 15장 보충(볼록 최적화)', title: '라그랑주 쌍대성', body: R`
:::key 약한 쌍대성
임의의 집합 $\cX,\cY$와 함수 $f:\cX\times\cY\to\mathbb R$에 대해(최대·최소가 존재하면)
$$\min_{x\in\cX}\max_{y\in\cY}f(x,y)\ \ge\ \max_{y\in\cY}\min_{x\in\cX}f(x,y).$$
:::

:::hand 강의 노트 — 한 줄 증명
모든 $x,y$에서 $\min_{x'}f(x',y)\le f(x,y)\le\max_{y'}f(x,y')$. 왼쪽 끝은 $y$만, 오른쪽 끝은 $x$만의 함수이므로, $y$를 고정하고 오른쪽에서 $x$에 대해 min을 취하면 $\min_{x'}f(x',y)\le\min_x\max_{y'}f(x,y')$. 이제 $y$에 대해 max. 예: $f(x,y)=xy$, $\cX=\cY=\{-1,1\}$이면 좌변 1, 우변 $-1$ — 등호가 성립하지 않을 수 있습니다.
:::

**하드 SVM의 쌍대.** 제약을 벌점으로 바꾸면 $g(w)=\max_{\alpha\ge0}\sum_i\alpha_i(1-y_i\langle w,x_i\rangle)$은 제약을 만족하면 0, 아니면 $\infty$입니다. 그러므로
$$\min_w\tfrac12\lVert w\rVert^2\ \text{s.t. 제약}\ =\ \min_w\max_{\alpha\ge0}\Big[\tfrac12\lVert w\rVert^2+\sum_i\alpha_i(1-y_i\langle w,x_i\rangle)\Big].$$
min과 max를 바꾸면 약한 쌍대성으로 값이 줄거나 같고, 이 볼록 문제(슬레이터 조건: 분리 가능하면 $y_i\langle w,x_i\rangle>1$인 점이 있음)에서는 **강한 쌍대성**으로 같습니다. 안쪽 min은 $w=\sum_i\alpha_iy_ix_i$에서 이루어지고, 대입하면

:::key SVM의 쌍대 문제
하드 SVM(동차, $\frac12\lVert w\rVert^2$): $\displaystyle\max_{\alpha\ge0}\ \sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$, $w=\sum_i\alpha_iy_ix_i$.

소프트 SVM(동차, $\lambda\lVert w\rVert^2+\frac1m\sum\xi_i$): $\displaystyle\max_{0\le\alpha_i\le1/m}\ \sum_i\alpha_i-\frac1{4\lambda}\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$, $w=\frac1{2\lambda}\sum_i\alpha_iy_ix_i$.
:::

소프트의 상자 제약은 $\xi_i$에 대한 정류 조건 $\frac1m-\alpha_i-\mu_i=0$과 $\mu_i\ge0$에서 옵니다. 쌍대 문제는 **내적 $\langle x_i,x_j\rangle$만** 씁니다 — 커널 방법의 출발점입니다.

:::note KKT 조건 한눈에
볼록 문제 $\min f(w)$ s.t. $g_i(w)\le0$에서 슬레이터 조건이 성립하면, $w^\ast$가 최적 $\iff$ 다음을 만족하는 $\alpha\ge0$이 있음: (정류) $0\in\partial f(w^\ast)+\sum\alpha_i\partial g_i(w^\ast)$, (실현가능) $g_i(w^\ast)\le0$, (상보 여유) $\alpha_ig_i(w^\ast)=0$. 강의 노트는 이를 프리츠 존 조건에서 시작해 증명하고, 하드·소프트 SVM에 적용했습니다.
:::
` },
      { k: '15.5', p: 212, title: '소프트 SVM을 SGD로 풀기', body: R`
동차 소프트 SVM $\min_w\frac\lambda2\lVert w\rVert^2+L^{\mathrm{hinge}}_S(w)$는 11단원 14.5.3의 “SGD로 규제 손실 최소화”의 한 예입니다. 힌지 손실의 부분기울기는 $y_i\langle w,x_i\rangle<1$이면 $-y_ix_i$, 아니면 0이므로:

:::def 소프트 SVM의 SGD
$\theta^{(1)}=0$. $t=1,\dots,T$: $w^{(t)}=\frac1{\lambda t}\theta^{(t)}$; $i\sim U[m]$; $y_i\langle w^{(t)},x_i\rangle<1$이면 $\theta^{(t+1)}=\theta^{(t)}+y_ix_i$, 아니면 $\theta^{(t+1)}=\theta^{(t)}$. 출력 $\bar w=\frac1T\sum_tw^{(t)}$.
:::

$\theta$는 “마진을 어긴 예제들의 $y_ix_i$ 누적합”이고 $w^{(t)}=-\frac1{\lambda t}\sum v_i$와 같은 식입니다. 퍼셉트론과 닮았지만 틀린 예제뿐 아니라 **마진 1 안쪽**의 예제에서도 갱신하고, $\frac1{\lambda t}$로 줄여 규제 효과를 냅니다. 상한은 $\E[f(\bar w)]-f(w^\star)\le\frac{2\rho^2}{\lambda T}(1+\ln T)$ ($\lVert x_i\rVert\le\rho$).
` },
    ],
    problems: [
      { sec: '15.1', type: 'num', lv: 1, q: R`$w=(0.6,0.8)$, $b=-1$일 때 점 $x=(3,1)$과 초평면 사이의 거리는?`, ans: '1.6', ansTex: R`\lvert1.8+0.8-1\rvert=1.6`,
        sol: R`$\lVert w\rVert=1$이므로 $\lvert\langle w,x\rangle+b\rvert=\lvert1.8+0.8-1\rvert=1.6$.` },
      { sec: '15.1', type: 'num', lv: 2, q: R`$w=(3,4)$, $b=0$ (정규화 안 됨)일 때 점 $x=(1,1)$까지의 거리는?`, ans: '1.4', ansTex: R`\tfrac{7}{5}`,
        sol: R`정규화: $\lvert\langle w,x\rangle\rvert/\lVert w\rVert=7/5=1.4$.` },
      { sec: '15.1', type: 'num', lv: 2, q: R`이차계획 $\min\lVert w\rVert^2$ s.t. $y_i(\langle w,x_i\rangle+b)\ge1$의 해가 $\lVert w_0\rVert=4$이면 하드 SVM의 마진은?`, ans: '0.25', ansTex: R`1/4`,
        sol: R`마진 $=1/\lVert w_0\rVert=0.25$.` },
      { sec: '15.1', type: 'mc', lv: 2, q: R`강의 노트에서 (B)의 최적해가 저절로 모든 점을 분리한다고 한 이유는?`,
        choices: [R`$\lVert w\rVert=1$이므로`, R`분리 가능하므로 목적값이 양수인 점이 있고, 최적해의 $\min_iy_i(\cdot)$도 양수여야 하므로`, R`(A)와 목적함수가 같으므로`, R`마진이 1이므로`], ans: 1,
        sol: R`최적값 $\ge$ 분리하는 초평면의 값 $>0$. 최솟값이 양수면 모든 항이 양수입니다.` },
      { sec: '15.1b', type: 'num', lv: 2, q: R`$(\gamma,\rho)=(0.1,1)$, $m=10000$, $\delta=0.05$일 때 하드 SVM 오차 상한 $\sqrt{4(\rho/\gamma)^2/m}+\sqrt{2\ln(2/\delta)/m}$은? (소수 넷째 자리)`, ans: 'sqrt(400/10000)+sqrt(2*ln(40)/10000)', ansTex: R`0.2+0.0272\approx0.2272`,
        sol: R`$\sqrt{400/10^4}=0.2$, $\sqrt{2\cdot3.689/10^4}\approx0.0272$. 합 $\approx0.2272$. 차원과 무관합니다.` },
      { sec: '15.2', type: 'num', lv: 1, q: R`소프트 SVM에서 $y_i(\langle w,x_i\rangle+b)=0.4$인 예제의 최적 여유 변수 $\xi_i$는?`, ans: '0.6', ansTex: R`\max\{0,1-0.4\}`,
        sol: R`$\xi_i=\max\{0,1-0.4\}=0.6$ — 힌지 손실 값입니다.` },
      { sec: '15.2', type: 'mc', lv: 2, q: R`소프트 SVM의 기대 0–1 오차 상한이 차원 $d$에 기대지 않는 이유는?`,
        choices: [R`힌지 손실이 볼록이라서`, R`RLM의 안정성 상한 $\frac{2\rho^2}{\lambda m}$과 규제 항 $\lambda\lVert u\rVert^2$이 노름·반지름만 쓰므로`, R`VC 차원이 작아서`, R`$d$가 표본 수보다 작다고 가정해서`], ans: 1,
        sol: R`13장 분석은 립시츠 상수와 노름으로만 표현됩니다. 이것이 고차원(커널) 특징 공간에서도 SVM이 일반화하는 이유입니다.` },
      { sec: '15.3', type: 'mc', lv: 2, q: R`하드 SVM의 해에서 $y_i\langle w_0,x_i\rangle=3$인 예제의 쌍대 변수 $\alpha_i$는?`,
        choices: [R`$\alpha_i=3$`, R`$\alpha_i=0$ (상보 여유성)`, R`$\alpha_i=1$`, R`알 수 없다`], ans: 1,
        sol: R`제약이 느슨하면($>1$) $\alpha_i(1-y_i\langle w,x_i\rangle)=0$에서 $\alpha_i=0$. 서포트 벡터가 아닙니다.` },
      { sec: '15.4', type: 'mc', lv: 2, q: R`$f(x,y)=(x-y)^2$, $\cX=\cY=\{0,1\}$일 때 $\min_x\max_yf$와 $\max_y\min_xf$는?`,
        choices: [R`1과 0`, R`0과 0`, R`1과 1`, R`0과 1`], ans: 0,
        sol: R`$x$를 고르면 적이 반대 $y$를 골라 1, 그래서 $\min\max=1$. $y$를 먼저 고르면 $x=y$로 0, 그래서 $\max\min=0$. 약한 쌍대성 $1\ge0$.` },
      { sec: '15.4', type: 'mc', lv: 3, q: R`소프트 SVM 쌍대 문제의 제약 $0\le\alpha_i\le\frac1m$에서 상한 $\frac1m$은 어디서 오나?`,
        choices: [R`$w$에 대한 정류 조건`, R`$\xi_i$에 대한 정류 조건 $\frac1m-\alpha_i-\mu_i=0$과 $\mu_i\ge0$`, R`상보 여유성`, R`슬레이터 조건`], ans: 1,
        sol: R`$\xi_i\ge0$ 제약의 승수 $\mu_i\ge0$ 때문에 $\alpha_i=\frac1m-\mu_i\le\frac1m$. 목적함수의 $\frac1m\sum\xi_i$ 계수가 그대로 상한이 됩니다.` },
      { sec: '15.5', type: 'mc', lv: 2, q: R`소프트 SVM의 SGD가 퍼셉트론과 다른 점은?`,
        choices: [R`틀린 예제에서만 갱신한다`, R`마진이 1보다 작은(맞혔어도 경계에 가까운) 예제에서도 갱신하고, $\frac1{\lambda t}$로 줄여 규제 효과를 낸다`, R`갱신이 없다`, R`$b$만 갱신한다`], ans: 1,
        sol: R`조건이 $y_i\langle w,x_i\rangle<1$입니다. 퍼셉트론은 $\le0$일 때만 갱신합니다.` },
      { sec: '15.1', type: 'open', lv: 2, proof: true, q: R`분리 가능한 자료에서 하드 SVM의 두 표현 (A) $\max_{\lVert w\rVert=1}\min_i\lvert\langle w,x_i\rangle+b\rvert$ s.t. $y_i(\langle w,x_i\rangle+b)>0$, (B) $\max_{\lVert w\rVert=1}\min_iy_i(\langle w,x_i\rangle+b)$가 같은 최적해를 가짐을 증명하세요.`,
        sol: R`
$G=\{(w,b):\lVert w\rVert=1,\ y_i(\langle w,x_i\rangle+b)>0\ \forall i\}$. (A)는 $G$ 위의 최적화입니다.
$G$ 위에서 $y_i=1$이면 $\langle w,x_i\rangle+b>0$이라 $\lvert\cdot\rvert=y_i(\cdot)$, $y_i=-1$이면 $<0$이라 $\lvert\cdot\rvert=-(\cdot)=y_i(\cdot)$. 따라서 $G$ 위에서 두 목적함수가 같습니다.
(B)의 최적해 $(w,b)$: 분리 가능하므로 $G\ne\emptyset$이고 $G$의 점에서 (B)의 값이 양수. 최적값은 그 이상이므로 $\min_iy_i(\langle w,x_i\rangle+b)>0$, 즉 $(w,b)\in G$. 그러므로 (B)의 최적해는 $G$ 위의 최적해이고, $G$ 위에서 두 목적이 같으므로 (A)의 최적해와 일치합니다(최적값도 같음).`,
        rubric: R`
- (A)를 $G$ 위의 문제로 — 2점
- $G$ 위에서 항별 등식 (두 경우) — 4점
- (B)의 최적해가 $G$에 속함 — 3점
- 결론 — 1점` },
      { sec: '15.4', type: 'open', lv: 3, proof: true, q: R`동차 하드 SVM $\min_w\frac12\lVert w\rVert^2$ s.t. $y_i\langle w,x_i\rangle\ge1$의 라그랑주 쌍대 문제를 유도하고, 해가 $w=\sum_i\alpha_iy_ix_i$ 꼴임을 보이세요. (강한 쌍대성은 가정해도 됩니다.)`,
        sol: R`
라그랑지안 $\mathcal L(w,\alpha)=\frac12\lVert w\rVert^2+\sum_i\alpha_i(1-y_i\langle w,x_i\rangle)$, $\alpha\ge0$. $\max_{\alpha\ge0}\mathcal L$은 실현가능하면 $\frac12\lVert w\rVert^2$, 아니면 $\infty$이므로 원문제 $=\min_w\max_\alpha\mathcal L$.
강한 쌍대성으로 $=\max_{\alpha\ge0}\min_w\mathcal L$. 안쪽은 $w$의 강볼록 이차식이라 $\nabla_w\mathcal L=w-\sum\alpha_iy_ix_i=0$에서 최소: $w=\sum\alpha_iy_ix_i$.
대입: $\frac12\lVert\sum\alpha_iy_ix_i\rVert^2+\sum\alpha_i-\sum_i\alpha_iy_i\langle\sum_j\alpha_jy_jx_j,x_i\rangle=\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$.
쌍대: $\max_{\alpha\ge0}\sum\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$, 최적 $\alpha^\ast$에서 $w^\ast=\sum\alpha^\ast_iy_ix_i$.`,
        rubric: R`
- 라그랑지안과 min–max 표현 — 3점
- 정류 조건으로 $w=\sum\alpha_iy_ix_i$ — 3점
- 대입 계산으로 쌍대 목적함수 — 4점` },
    ],
  });
})();
