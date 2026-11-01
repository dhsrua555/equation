/* 증명 — 18단원: 8주차 수요일·9주차 월요일 필기의 바론 정리(바론 클래스, Maurey 보조정리, 바론의 보조정리, 정리의 완성)와
   일반화(위험의 분해, 대칭화, 선형 클래스의 라데마허 복잡도). */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  { ch: 'ch18', id: 'lip', title: '바론 클래스의 함수는 C-립시츠', keys: ['바론 클래스'],
    tags: 'Barron class Fourier transform Lipschitz gradient frequency 바론 클래스 푸리에 변환 립시츠',
    stmt: R`$f\in L^1(\mathbb R^d)$이고 $\hat f\in L^1$, $\int_{\mathbb R^d}|2\pi\xi||\hat f(\xi)|d\xi\le C$이면 모든 $x,y$에서 $|f(x)-f(y)|\le C|x-y|$이다.`,
    body: R`
$\hat f\in L^1$이므로 역변환 $f(x)=\int\hat f(\xi)e^{2\pi i\xi^Tx}d\xi$가 모든 점에서 성립하고
$$f(x)-f(y)=\int_{\mathbb R^d}\hat f(\xi)\big(e^{2\pi i\xi^Tx}-e^{2\pi i\xi^Ty}\big)d\xi.$$
단위원 위의 두 점 $e^{iu},e^{iv}$ 사이의 현은 호보다 짧으므로 $|e^{iu}-e^{iv}|\le|u-v|$이고, $u-v=2\pi\xi^T(x-y)$에 코시-슈바르츠를 쓰면 $|u-v|\le2\pi|\xi||x-y|$입니다. 따라서
$$|f(x)-f(y)|\le\int|\hat f(\xi)|\,2\pi|\xi|\,|x-y|\,d\xi=|x-y|\int|2\pi\xi||\hat f(\xi)|d\xi\le C|x-y|.$$`,
    note: R`$\nabla f(x)=\int2\pi i\xi\hat f(\xi)e^{2\pi i\xi^Tx}d\xi$이므로 같은 계산이 $|\nabla f(x)|\le\int|2\pi\xi||\hat f|d\xi$를 줍니다. 바론 조건은 “기울기의 푸리에 진폭이 적분가능하다”는 뜻입니다.` },
  { ch: 'ch18', id: 'maurey', title: 'Maurey 보조정리', keys: ['Maurey 보조정리 (보조정리 1)'], src: '강의 필기 · W9 월',
    tags: 'Maurey lemma convex hull Hilbert space probabilistic method sampling variance 1/N Barron Jones 볼록 껍질 힐베르트 확률적 방법 무작위 표본',
    stmt: R`$H$가 힐베르트 공간이고 $G\subset H$의 모든 원소가 $\lVert g\rVert_H\le B$이면, $f\in\overline{\operatorname{co}}(G)$, $N\in\mathbb N$, $c>B^2$에 대해 $\big\lVert f-\frac1N\sum_{i=1}^Ng_i\big\rVert_H^2\le\frac cN$인 $g_1,\dots,g_N\in G$가 있다.`,
    body: R`
**근사점.** $\varepsilon>0$을 고정합니다. $f$가 $\operatorname{co}(G)$의 폐포에 있으므로 $h_1,\dots,h_m\in G$와 $\alpha_j\ge0$, $\sum_j\alpha_j=1$이 있어 $f^*=\sum_j\alpha_jh_j$가 $\lVert f-f^*\rVert_H<\varepsilon$을 만족합니다.

**무작위 뽑기.** $X_1,\dots,X_N$을 독립 동일 분포, $\mathbb P(X_i=h_j)=\alpha_j$로 두면 $\E X_i=\sum_j\alpha_jh_j=f^*$이고 $\lVert X_i\rVert\le B$입니다.

**교차항 소거.** $f^*-\frac1N\sum_jX_j=\frac1N\sum_j(f^*-X_j)$의 제곱 노름을 전개하면
$$\E\Big\lVert f^*-\frac1N\sum_jX_j\Big\rVert^2=\frac1{N^2}\Big(\sum_j\E\lVert f^*-X_j\rVert^2+\sum_{i\ne j}\E\langle f^*-X_i,f^*-X_j\rangle\Big).$$
$i\ne j$이면 $X_i,X_j$가 독립이고 유한 개의 값을 가지므로 $\E\langle X_i,X_j\rangle=\sum_{k,l}\alpha_k\alpha_l\langle h_k,h_l\rangle=\lVert f^*\rVert^2$이고, 따라서 $\E\langle f^*-X_i,f^*-X_j\rangle=\lVert f^*\rVert^2-\lVert f^*\rVert^2-\lVert f^*\rVert^2+\lVert f^*\rVert^2=0$입니다.

**한 항의 크기.** 남은 $N$개 항은 같은 분포이므로
$$\E\Big\lVert f^*-\frac1N\sum_jX_j\Big\rVert^2=\frac1N\E\lVert f^*-X_1\rVert^2=\frac1N\big(\E\lVert X_1\rVert^2-\lVert f^*\rVert^2\big)\le\frac{B^2}N.$$

**존재.** 음이 아닌 확률변수의 기댓값이 $\frac{B^2}N$ 이하이므로 값이 $\frac{B^2}N$ 이하인 결과 $\omega$가 있습니다(모든 결과에서 더 크면 기댓값도 더 큼). $g_i:=X_i(\omega)\in G$로 둡니다.

**삼각 부등식.** $\big\lVert f-\frac1N\sum_ig_i\big\rVert\le\varepsilon+\frac B{\sqrt N}$. $c>B^2$이므로 처음에 $\varepsilon<\frac{\sqrt c-B}{\sqrt N}$로 잡으면 오른쪽이 $\sqrt{c/N}$보다 작고, 제곱하면 결론입니다.`,
    note: R`필기는 “$\varepsilon>0$ arbitrary, this claim concludes the proof”라고 적고 마지막에 삼각 부등식 $\le\varepsilon+B/\sqrt N<\sqrt{c/N}$을 썼습니다. 증명은 실제로 $\frac{B^2-\lVert f^*\rVert^2}N$을 주고, $f\in\operatorname{co}(G)$이면 $\varepsilon=0$으로 $c=B^2$도 됩니다.` },
  { ch: 'ch18', id: 'barronlemma', title: '바론의 보조정리: f − f(0)은 헤비사이드 능선의 볼록 껍질에 있다', keys: ['바론의 보조정리 (보조정리 2)'], src: '강의 필기 · W9 월',
    tags: 'Barron lemma Heaviside ridge function convex hull Fourier inverse phase probability measure staircase total variation 바론 보조정리 헤비사이드 능선 계단 볼록 껍질 위상',
    stmt: R`$f\in\Gamma_C$이면 $L^2_\circ(B_1^d)$에서 $f|_{B_1^d}-f(0)\in\overline{\operatorname{co}}(G_C)$이다. 여기서 $G_C=\{x\mapsto\gamma\mathbf 1_{\mathbb R_+}(\langle a,x\rangle+b):a\in\mathbb R^d,b\in\mathbb R,|\gamma|\le2C\}$.`,
    body: R`
**푸리에 표현 (필기).** $C_f:=\int|2\pi\xi||\hat f(\xi)|d\xi<C$로 둡니다($C_f=0$이면 $\hat f=0$ (a.e.)이라 $f-f(0)=0\in\overline{\operatorname{co}}(G_C)$). $\hat f(\xi)=|\hat f(\xi)|e^{i\kappa(\xi)}$로 쓰고 역변환의 실수부를 취하면
$$f(x)-f(0)=\int|\hat f(\xi)|\big(\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)\big)d\xi=C_f\int q_x(\xi)\,d\Lambda(\xi),$$
$q_x(\xi)=\frac{\cos(2\pi\langle x,\xi\rangle+\kappa(\xi))-\cos\kappa(\xi)}{|2\pi\xi|}$, $d\Lambda=\frac1{C_f}|2\pi\xi||\hat f(\xi)|d\xi$ (확률측도).

**능선 함수.** $\xi\ne0$을 고정하고 $\omega=\xi/|\xi|$, $\varphi(t)=\frac{\cos(2\pi|\xi|t+\kappa)-\cos\kappa}{2\pi|\xi|}$로 두면 $q_x(\xi)=\varphi(\langle x,\omega\rangle)$이고, $\lVert x\rVert\le1$에서 $t=\langle x,\omega\rangle\in[-1,1]$. $\varphi(0)=0$, $|\varphi'(t)|=|\sin(2\pi|\xi|t+\kappa)|\le1$이므로 $|q_x(\xi)|\le1$.

**계단 근사.** $t_k=k/K$, $\Delta_k^\pm=\varphi(\pm t_k)-\varphi(\pm t_{k-1})$로 $S_K(t)=\sum_{k=1}^K\Delta_k^+\mathbf 1_{\mathbb R_+}(t-t_k)+\sum_{k=1}^K\Delta_k^-\mathbf 1_{\mathbb R_+}(-t-t_k)$를 만들면, 망원합과 1-립시츠성으로 $\sup_{[-1,1]}|\varphi-S_K|\le\frac1K$. 높이의 절댓값의 합은 $V=\sum|\Delta_k^\pm|\le\int_{-1}^1|\varphi'|\le2$이고, $S_K=\sum\frac{|\Delta|}V\big(V\operatorname{sign}(\Delta)\mathbf 1_{\mathbb R_+}(\langle\pm\omega,x\rangle-t_k)\big)$는 높이 $V\le2$인 헤비사이드 능선들의 볼록 결합입니다. $C_f$를 곱하면 높이 $2C_f\le2C$이므로 $C_fS_K(\langle x,\omega\rangle)\in\operatorname{co}(G_C)$이고, 정규화된 노름은 균등 노름 이하라 $\lVert C_fq_\cdot(\xi)-C_fS_K\rVert_{L^2_\circ}\le\frac{C_f}K\to0$. 곧 각 $x\mapsto C_fq_x(\xi)$가 $\overline{\operatorname{co}}(G_C)$에 있습니다.

**적분을 평균으로.** $\xi_1,\dots,\xi_n$을 $\Lambda$에서 독립으로 뽑고 $F_n(x)=\frac1n\sum_iC_fq_x(\xi_i)$라 하면, 각 $x$에서 $\E F_n(x)=f(x)-f(0)$, $\Var F_n(x)\le\frac{C_f^2}n$ ($|C_fq_x|\le C_f$). 푸비니로 $x$에 대한 평균과 기댓값의 순서를 바꾸면
$$\E\lVert F_n-(f-f(0))\rVert_{L^2_\circ}^2=\frac1{|B_1^d|}\int_{B_1^d}\Var F_n(x)\,dx\le\frac{C_f^2}n.$$
따라서 $\lVert F_n-(f-f(0))\rVert^2\le C_f^2/n$인 실현이 있고, $n\to\infty$에서 이들은 $f-f(0)$로 갑니다. 각 $F_n$은 $\overline{\operatorname{co}}(G_C)$의 원소들의 볼록 결합이므로 다시 $\overline{\operatorname{co}}(G_C)$에 있고(닫힌 볼록 집합), 그 극한 $f-f(0)$도 그렇습니다.`,
    note: R`필기는 셋째 단계 대신 격자 위의 리만 합 $C\sum_\theta q_x(\theta)\Lambda(I_\theta)$를 “볼록 결합”으로 그렸습니다. 같은 생각이지만 $\kappa(\xi)$의 연속성 같은 세부가 필요해, 여기서는 Maurey와 같은 무작위 뽑기를 썼습니다. 또 필기처럼 $\frac1C$로 나누면 $\Lambda$의 질량이 $C_f/C<1$이라 $C_f$로 나누었습니다. 넷째 단계와 둘째·셋째 단계는 수업에서 생략된 부분을 채운 것입니다.` },
  { ch: 'ch18', id: 'heaviside', title: '시그모이드는 기울기를 키우면 헤비사이드가 된다 (L²)', keys: ['시그모이드에서 헤비사이드로'],
    tags: 'sigmoid Heaviside step function limit dominated convergence L2 hyperplane 시그모이드 헤비사이드 계단 지배수렴',
    stmt: R`$\sigma$가 시그모이드($\lim_{t\to-\infty}\sigma=0$, $\lim_{t\to\infty}\sigma=1$, 유계)이고 $a\ne0$이면 $\lambda\to\infty$일 때 $\lVert\sigma(\lambda(\langle a,\cdot\rangle+b))-\mathbf 1_{\mathbb R_+}(\langle a,\cdot\rangle+b)\rVert_{L^2_\circ(B_1^d)}\to0$이다.`,
    body: R`
$u(x)=\langle a,x\rangle+b$라 합니다. $u(x)>0$이면 $\lambda u(x)\to+\infty$이므로 $\sigma(\lambda u(x))\to1=\mathbf 1_{\mathbb R_+}(u(x))$, $u(x)<0$이면 $\to0=\mathbf 1_{\mathbb R_+}(u(x))$입니다. 수렴하지 않을 수 있는 곳은 초평면 $\{u=0\}$뿐이고, $a\ne0$이라 이 집합의 부피는 0입니다.
차의 제곱 $|\sigma(\lambda u)-\mathbf 1_{\mathbb R_+}(u)|^2$은 거의 모든 $x$에서 0으로 가고, $\sigma$가 유계($|\sigma|\le M$)라 $(M+1)^2$로 눌립니다. 공의 부피는 유한하므로 지배수렴정리에서 $\frac1{|B_1^d|}\int_{B_1^d}|\sigma(\lambda u)-\mathbf 1_{\mathbb R_+}(u)|^2dx\to0$.`,
    note: R`수렴은 초평면 근처에서 균등하지 않습니다. 예를 들어 로지스틱 함수에서 $|u|\ge\delta$인 곳의 차는 $e^{-\lambda\delta}$ 이하이고, $|u|<\delta$인 띠의 부피는 $\delta$에 비례하므로, $\delta=\lambda^{-1/2}$로 두면 $L^2$ 오차가 대략 $\lambda^{-1/4}$ 정도로 줄어듭니다.` },
  { ch: 'ch18', id: 'barronthm', title: '바론 정리의 증명', keys: ['바론 정리 (정리 1)'], src: '강의 필기 · W9 월',
    tags: 'Barron theorem approximation rate one hidden layer neural network C^2/N dimension-free curse of dimensionality 바론 정리 근사율 차원의 저주 은닉층',
    stmt: R`$\sigma$가 시그모이드이고 $f\in\Gamma_C$이면 모든 $c>4C^2$, $N\in\mathbb N$에 대해 $\Phi_N(x)=f(0)+\sum_{i=1}^N\frac{\gamma_i}N\sigma(\langle a_i,x\rangle+b_i)$ ($|\gamma_i|\le2C$)가 있어 $\frac1{|B_1^d|}\int_{B_1^d}|f-\Phi_N|^2dx\le\frac cN$이다.`,
    body: R`
**헤비사이드 판.** 보조정리 2로 $f-f(0)\in\overline{\operatorname{co}}(G_C)$이고 $g\in G_C$이면 $\lVert g\rVert_{L^2_\circ}\le|\gamma|\le2C$. $4C^2<c'<c$인 $c'$를 고르고 보조정리 1을 $H=L^2_\circ(B_1^d)$, $B=2C$, $c'$로 쓰면 $g_i=\gamma_i\mathbf 1_{\mathbb R_+}(\langle a_i,\cdot\rangle+b_i)\in G_C$가 있어
$$\Big\lVert f-f(0)-\frac1N\sum_{i=1}^Ng_i\Big\rVert_{L^2_\circ}\le\sqrt{\frac{c'}N}.$$
$a_i=0$인 $g_i$는 상수이므로 $b_i\ne0$으로 고쳐 쓸 수 있습니다.

**시그모이드로 바꾸기.** $\eta:=\sqrt{c/N}-\sqrt{c'/N}>0$. 시그모이드에서 헤비사이드로의 수렴($a_i\ne0$이면 초평면 밖 수렴, $a_i=0,b_i\ne0$이면 상수의 수렴)으로 $\lambda$를 크게 잡아 모든 $i$에서 $\lVert\sigma(\lambda(\langle a_i,\cdot\rangle+b_i))-\mathbf 1_{\mathbb R_+}(\langle a_i,\cdot\rangle+b_i)\rVert_{L^2_\circ}\le\frac\eta{2C}$로 만듭니다($C>0$).

**삼각 부등식.** $\Phi_N(x)=f(0)+\sum_i\frac{\gamma_i}N\sigma(\lambda\langle a_i,x\rangle+\lambda b_i)$로 두면
$$\lVert f-\Phi_N\rVert_{L^2_\circ}\le\sqrt{\frac{c'}N}+\sum_i\frac{|\gamma_i|}N\cdot\frac\eta{2C}\le\sqrt{\frac{c'}N}+\eta=\sqrt{\frac cN}.$$
제곱하면 정리입니다($\lambda a_i,\lambda b_i$를 새 $a_i,b_i$로 씁니다). $\Phi_N$은 은닉 뉴런 $N$개, 출력 가중치 $\gamma_i/N$, 출력 편향 $f(0)$인 은닉층 하나의 신경망입니다.`,
    note: R`필기는 계수를 $|r_i|<2C_1$, 오른쪽을 $\frac{4C_1^2}N$, 적분을 정규화 없이 적었습니다. 보조정리 1이 평균을 주므로 계수는 $\gamma_i/N$이고, 폐포와 시그모이드 대체의 여유 때문에 오른쪽은 $c/N$ ($c>4C^2$), 적분은 $\frac1{|B_1^d|}$로 나눈 평균입니다. 증명 어디에도 $d$가 들어가지 않는 것이 “차원과 무관한 근사율”의 뜻입니다.` },
  { ch: 'ch18', id: 'riskdecomp', title: '초과 위험의 세 갈래 분해', keys: ['위험의 세 갈래 분해'],
    tags: 'excess risk decomposition optimization generalization approximation error empirical risk minimization ERM population risk 초과 위험 분해 최적화 일반화 근사 오차',
    stmt: R`$f_{\mathcal F}=\argmin_{\mathcal F}R$, $\hat f=\argmin_{\mathcal F}\hat R_n$, $\tilde f\in\mathcal F$, $R^*=\inf_fR(f)$이면 $R(\tilde f)-R^*\le\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+2\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|+\big[R(f_{\mathcal F})-R^*\big]$.`,
    body: R`
가운데 항들이 서로 상쇄되도록 더하고 빼면
$$\begin{aligned}R(\tilde f)-R^*&=\big[R(\tilde f)-\hat R_n(\tilde f)\big]+\big[\hat R_n(\tilde f)-\hat R_n(\hat f)\big]+\big[\hat R_n(\hat f)-\hat R_n(f_{\mathcal F})\big]\\&\quad+\big[\hat R_n(f_{\mathcal F})-R(f_{\mathcal F})\big]+\big[R(f_{\mathcal F})-R^*\big].\end{aligned}$$
$\tilde f,f_{\mathcal F}\in\mathcal F$이므로 첫째와 넷째 괄호는 각각 $\sup_{f\in\mathcal F}|R(f)-\hat R_n(f)|$ 이하입니다. $\hat f$는 $\mathcal F$ 위에서 $\hat R_n$의 최소점이므로 셋째 괄호는 0 이하입니다. 남은 둘째와 다섯째 괄호를 그대로 두면 결론입니다.`,
    note: R`최솟값이 달성되지 않으면 $f_{\mathcal F}$, $\hat f$ 대신 오차가 $\delta$ 이내인 근사 최소점을 쓰고 마지막에 $\delta\to0$으로 보냅니다. 둘째 항(최적화)은 0 이상이고, 학습이 경험적 위험을 정확히 최소화하면 0입니다.` },
  { ch: 'ch18', id: 'symm', title: '대칭화: 일반화 차이의 기댓값은 2 Rad 이하', keys: ['라데마허 일반화 한계'],
    tags: 'symmetrization ghost sample Rademacher complexity generalization bound McDiarmid uniform deviation 대칭화 유령 표본 라데마허 복잡도 일반화 한계',
    stmt: R`$z_1,\dots,z_n$이 독립 동일 분포이면 $\E\big[\sup_{f\in\mathcal F}\big(\E f(z)-\frac1n\sum_{i=1}^nf(z_i)\big)\big]\le2\operatorname{Rad}_n(\mathcal F)$이다.`,
    body: R`
**유령 표본.** $z_1',\dots,z_n'$을 같은 분포에서 따로 뽑은 표본(유령 표본)이라 하고 그 기댓값을 $\E'$로 씁니다. $\E f(z)=\E'\frac1n\sum_if(z_i')$이므로
$$\sup_f\Big(\E f-\frac1n\sum_if(z_i)\Big)=\sup_f\E'\Big[\frac1n\sum_i\big(f(z_i')-f(z_i)\big)\Big]\le\E'\sup_f\frac1n\sum_i\big(f(z_i')-f(z_i)\big).$$
($\sup$ 안의 기댓값은 각 $f$마다 $\sup$의 기댓값 이하입니다.) 양변의 기댓값을 취하면 왼쪽은 구하는 양, 오른쪽은 $\E\E'\sup_f\frac1n\sum_i(f(z_i')-f(z_i))$입니다.

**부호 넣기.** $(z_i,z_i')$는 독립이고, 각 $i$에서 $z_i$와 $z_i'$를 맞바꾸어도 결합 분포가 변하지 않습니다. 맞바꾸면 $f(z_i')-f(z_i)$의 부호만 바뀌므로, 고정된 부호 $\varepsilon_i\in\{\pm1\}$ 각각에 대해
$$\E\E'\sup_f\sum_i\big(f(z_i')-f(z_i)\big)=\E\E'\sup_f\sum_i\varepsilon_i\big(f(z_i')-f(z_i)\big).$$
라데마허 $\xi_i$로 이 식들을 평균하면 오른쪽의 $\varepsilon_i$를 $\xi_i$로 바꿀 수 있습니다.

**둘로 나누기.** $\sup$은 합에 대해 준가법적이므로
$$\sup_f\sum_i\xi_i\big(f(z_i')-f(z_i)\big)\le\sup_f\sum_i\xi_if(z_i')+\sup_f\sum_i(-\xi_i)f(z_i).$$
$z_i'$와 $z_i$는 같은 분포이고 $-\xi_i$도 라데마허이므로 두 항의 기댓값을 $n$으로 나눈 것이 모두 $\operatorname{Rad}_n(\mathcal F)$입니다. 합하면 $2\operatorname{Rad}_n(\mathcal F)$.`,
    note: R`확률 한계는 여기에 McDiarmid 부등식을 더해 얻습니다. 함수값이 $[0,1]$에 있으면 표본 하나를 바꿀 때 $\sup_f(\E f-\frac1n\sum f(z_i))$가 많아야 $\frac1n$ 변하므로, 확률 $1-\frac\delta2$ 이상으로 기댓값보다 $\sqrt{\log(2/\delta)/(2n)}$ 이상 크지 않습니다. $-\mathcal F$에도 같은 논법을 써서 합치면 key의 둘째 식이 됩니다.` },
  { ch: 'ch18', id: 'linrad', title: '노름이 유계인 선형 클래스의 라데마허 복잡도', keys: ['노름이 유계인 선형 클래스'],
    tags: 'Rademacher complexity linear class norm bound Q over sqrt n Cauchy-Schwarz Jensen 라데마허 복잡도 선형 클래스 노름 코시-슈바르츠 젠센',
    stmt: R`$\lVert x_i\rVert\le1$ ($i=1,\dots,n$)이고 $\mathcal F_Q=\{x\mapsto\langle w,x\rangle:\lVert w\rVert\le Q\}$이면 $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le\frac Q{\sqrt n}$이다.`,
    body: R`
$v=\sum_i\xi_ix_i$로 두면 $\frac1n\sum_i\xi_i\langle w,x_i\rangle=\frac1n\langle w,v\rangle$이고, 코시-슈바르츠로 $\sup_{\lVert w\rVert\le Q}\langle w,v\rangle=Q\lVert v\rVert$ ($v\ne0$이면 $w=Qv/\lVert v\rVert$에서 달성)입니다. 따라서 $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)=\frac Qn\E\lVert v\rVert$.
제곱근은 오목하므로 젠센 부등식에서 $\E\lVert v\rVert\le\sqrt{\E\lVert v\rVert^2}$이고
$$\E\lVert v\rVert^2=\sum_{i,j}\E[\xi_i\xi_j]\langle x_i,x_j\rangle=\sum_i\lVert x_i\rVert^2\le n\qquad(\E\xi_i\xi_j=0,\ i\ne j;\ \xi_i^2=1).$$
그러므로 $\widehat{\operatorname{Rad}}_S(\mathcal F_Q)\le\frac Qn\sqrt n=\frac Q{\sqrt n}$.`,
    note: R`표본에 대해 다시 평균해도 같은 상한이 남으므로 $\operatorname{Rad}_n(\mathcal F_Q)\le Q/\sqrt n$. 은닉층 하나짜리 ReLU 망에서 $\sum_j|\beta_j|\lVert w_j\rVert\le Q$이면 축약 보조정리와 이 계산으로 $2Q/\sqrt n$을 얻습니다.` },
  );
})();
