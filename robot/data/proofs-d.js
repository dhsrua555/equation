/* 유도 — 19–22단원: 운동 계획, 제어, 강화 학습 */
window.EM = window.EM || { chapters: [], exams: [] };
EM.proofs = EM.proofs || [];
(function () {
  const R = String.raw;
  EM.proofs.push(
  // ───── 19
  { ch: 'ch19', id: 'cobsGrow', title: '원형 로봇의 장애물 부풀리기와 구 근사 거리', keys: ['원형 로봇의 C-공간 장애물', '구로 근사한 거리'],
    tags: 'configuration space obstacle grown Minkowski sphere approximation distance collision C-공간 장애물 부풀리기 구 근사 충돌 검사',
    stmt: R`반지름 $r$인 원판 로봇이 중심 $q$에서 장애물 $\mathcal B$와 겹치는 것은 $\operatorname{dist}(q,\mathcal B)<r$과 동치이다. 또 두 구(중심 $c_1,c_2$, 반지름 $R_1,R_2$) 사이의 거리는 $\lVert c_1-c_2\rVert-R_1-R_2$이고, 물체를 빠짐없이 덮는 구들로 잰 거리는 실제 거리보다 크지 않다.`,
    body: R`
로봇이 차지하는 영역은 $D(q,r)=\{x:\lVert x-q\rVert\le r\}$입니다. $D(q,r)$의 내부가 $\mathcal B$와 만나는 것은 $\lVert b-q\rVert<r$인 $b\in\mathcal B$가 있는 것과 같고, 이는 $\operatorname{dist}(q,\mathcal B)=\inf_{b\in\mathcal B}\lVert b-q\rVert<r$과 같습니다. 그래서 C-공간 장애물은 $\mathcal B$의 $r$-근방, 곧 $\mathcal B$를 사방으로 $r$만큼 부풀린 집합입니다.
두 구의 점 $x_1=c_1+u_1$, $x_2=c_2+u_2$ ($\lVert u_i\rVert\le R_i$)에 대해 삼각 부등식으로 $\lVert x_1-x_2\rVert\ge\lVert c_1-c_2\rVert-R_1-R_2$이고, 두 중심을 잇는 선분 위의 점을 고르면 등호가 됩니다. 따라서 떨어진 두 구의 거리는 $\lVert c_1-c_2\rVert-R_1-R_2$이고, 겹치면 이 값이 음수가 되어 겹친 깊이를 나타냅니다.
보수적 근사: 로봇과 장애물의 모든 점이 어떤 구에 들어 있으면, 실제로 가장 가까운 두 점 $x\in$ 로봇, $y\in\mathcal B$도 각각 어떤 구 $i$, $j$에 들어 있으므로 $\min_{i,j}(\lVert r_i-b_j\rVert-R_i-B_j)\le\lVert x-y\rVert$. 근사 거리가 양수이면 실제 거리도 양수 — “충돌 없음” 판정을 믿을 수 있습니다.`,
    note: R`반대로 구가 물체를 다 덮지 못하면 근사 거리가 실제보다 커져, 실제로는 부딪히는 자세를 안전하다고 잘못 판정할 수 있습니다.` },
  { ch: 'ch19', id: 'astarOptimal', title: 'A*가 최소 비용 경로를 찾는 이유', keys: ['A* 탐색의 추정 총비용'],
    tags: 'A star optimality admissible consistent heuristic monotone Dijkstra proof A* 최적성 허용 가능 일관성 휴리스틱',
    stmt: R`간선 비용이 양수이고 휴리스틱이 일관적($h(\text{목표})=0$, 모든 간선에서 $h(n)\le c(n,m)+h(m)$)이면, A*가 노드를 OPEN에서 꺼낼 때 그 $g$는 출발점에서 그 노드까지의 최소 비용 $g^\ast$이다. 특히 꺼낸 목표의 $g$는 최소 경로 비용이다.`,
    body: R`
일관성을 경로를 따라 더하면, $m$에서 $n$까지 어떤 경로의 비용을 $c_P(m,n)$이라 할 때 $h(m)\le c_P(m,n)+h(n)$이고, $n$을 목표로 두면 $h\le h^\ast$(허용 가능)도 나옵니다.
귀류법: 처음으로 $g(n)>g^\ast(n)$인 채 꺼내진 노드를 $n$이라 합시다. 출발점에서 $n$까지의 최소 경로 $P$ 위에서 아직 닫히지 않은 첫 노드를 $m$, 그 바로 앞 노드를 $p$라 하면 $p$는 이미 닫혔고 (가정에 의해) $g(p)=g^\ast(p)$입니다. $p$를 넓힐 때 $g(m)\le g^\ast(p)+c(p,m)=g^\ast(m)$으로 고쳐졌으므로 $m$은 OPEN에 $g(m)=g^\ast(m)$으로 있습니다. ($m=n$이면 곧바로 모순.)
$P$가 최소 경로이므로 $g^\ast(m)+c_P(m,n)=g^\ast(n)$이고, 그러면 $f(m)=g^\ast(m)+h(m)\le g^\ast(m)+c_P(m,n)+h(n)=g^\ast(n)+h(n)<g(n)+h(n)=f(n)$.
$f(m)<f(n)$인 $m$이 OPEN에 있는데 $n$이 먼저 꺼내졌으니 모순입니다. 따라서 꺼내지는 모든 노드는 $g=g^\ast$이고, 목표에서 $h=0$이므로 $f(\text{목표})=g^\ast(\text{목표})$.`,
    note: R`닫은 노드를 다시 열 수 있게 구현하면 허용 가능성($h\le h^\ast$)만으로도 최적성이 보장됩니다. $h\equiv0$은 늘 일관적이므로 다익스트라는 항상 최적입니다.` },
  { ch: 'ch19', id: 'potentialForce', title: '포텐셜의 힘, 에너지 감소, 제어점 힘의 변환', keys: ['가상 포텐셜과 힘', '제어점의 척력을 관절 힘으로'],
    tags: 'virtual potential field attractive repulsive force gradient damping energy virtual work Jacobian transpose 포텐셜 인력 척력 감쇠 가상일',
    stmt: R`$F=-\partial P/\partial q$에서 $F_{\mathrm{goal}}=K(q_{\mathrm{goal}}-q)$, $F_{\mathcal B}=\frac{k}{d^3}\frac{\partial d}{\partial q}$이다. $u=F(q)-B\dot q$로 제어하면 운동 에너지와 가상 포텐셜의 합이 증가하지 않고, 제어점에 작용하는 힘 $\mathsf F$는 관절 힘 $J^T\mathsf F$와 같다.`,
    body: R`
$K$가 대칭이면 $\dfrac{\partial}{\partial q}\tfrac12(q-q_g)^TK(q-q_g)=K(q-q_g)$이므로 $F_{\mathrm{goal}}=K(q_g-q)$.
$P_{\mathcal B}=\tfrac k2d^{-2}$를 연쇄 법칙으로 미분하면 $\dfrac{\partial P_{\mathcal B}}{\partial q}=-kd^{-3}\dfrac{\partial d}{\partial q}$, 부호를 바꾸면 $F_{\mathcal B}$.
동역학 $M(q)\ddot q+C(q,\dot q)\dot q=u$에서 $E=\tfrac12\dot q^TM\dot q+P(q)$를 미분하면 $\dot E=\dot q^T(u-C\dot q)+\tfrac12\dot q^T\dot M\dot q+\dot q^T\dfrac{\partial P}{\partial q}^T$. $\dot M-2C$가 반대칭(17단원)이라 가운데 두 항이 지워지고, $u=F-B\dot q$를 넣으면 $\dot E=\dot q^TF-\dot q^TB\dot q-\dot q^TF=-\dot q^TB\dot q\le0$.
가상일: 제어점 속도가 $\dot f=J\dot q$이면 힘 $\mathsf F$의 일률은 $\mathsf F^T\dot f=(J^T\mathsf F)^T\dot q$. 모든 $\dot q$에 대해 같은 일률을 내는 관절 힘은 $J^T\mathsf F$뿐입니다.`,
    note: R`$E$가 줄어 로봇은 결국 멈추지만, 멈추는 곳은 $F=0$인 임계점 — 목표일 수도, 국소 극소점일 수도 있습니다.` },
  // ───── 20
  { ch: 'ch20', id: 'overshootFormula', title: '2차 오차 응답의 넘침과 정착 시간', keys: ['부족 감쇠 응답의 지표', '2차 오차 동역학의 표준형'],
    tags: 'second order underdamped overshoot peak time settling time damping ratio natural frequency 넘침 정착 시간 감쇠비 고유 진동수',
    stmt: R`$\ddot\theta_e+2\zeta\omega_n\dot\theta_e+\omega_n^2\theta_e=0$, $\theta_e(0)=1$, $\dot\theta_e(0)=0$, $0<\zeta<1$이면 첫 극값은 $t_p=\pi/\omega_d$에서 $\theta_e(t_p)=-e^{-\pi\zeta/\sqrt{1-\zeta^2}}$이고, 2% 정착 시간은 약 $4/(\zeta\omega_n)$이다.`,
    body: R`
특성 방정식 $s^2+2\zeta\omega_ns+\omega_n^2=0$의 근은 $s=-\zeta\omega_n\pm j\omega_d$, $\omega_d=\omega_n\sqrt{1-\zeta^2}$. 해는 $\theta_e=e^{-\zeta\omega_nt}(c_1\cos\omega_dt+c_2\sin\omega_dt)$.
$\theta_e(0)=1$에서 $c_1=1$, $\dot\theta_e(0)=-\zeta\omega_nc_1+\omega_dc_2=0$에서 $c_2=\zeta/\sqrt{1-\zeta^2}$.
미분하면 $\cos$ 항의 계수는 0이 되고 $\dot\theta_e=-\dfrac{\omega_n}{\sqrt{1-\zeta^2}}e^{-\zeta\omega_nt}\sin\omega_dt$. 처음으로 0이 되는 $t>0$은 $\omega_dt=\pi$.
$\theta_e(t_p)=e^{-\zeta\omega_n\pi/\omega_d}(\cos\pi+c_2\sin\pi)=-e^{-\pi\zeta/\sqrt{1-\zeta^2}}$ — 크기가 넘침입니다.
정착: $\lvert\theta_e\rvert\le\sqrt{c_1^2+c_2^2}\,e^{-\zeta\omega_nt}=e^{-\zeta\omega_nt}/\sqrt{1-\zeta^2}$. 이 포락선이 0.02가 되는 시각은 $t=\big(\ln50+\ln(1/\sqrt{1-\zeta^2})\big)/(\zeta\omega_n)$이고, $\ln50\approx3.9$에 비해 둘째 항이 작아 $t_s\approx4/(\zeta\omega_n)$.`,
    note: R`$\zeta=0.5$, $\omega_n=4$이면 포락선 기준 $2.03$ s, 실제 응답이 2% 띠에 머물기 시작하는 시각은 약 $2.02$ s로 근사값 2 s와 거의 같습니다.` },
  { ch: 'ch20', id: 'pidThirdOrder', title: '중력 아래 PID 제어의 3차 오차 동역학과 적분 이득의 상한', keys: ['PID 제어의 3차 오차 동역학', 'PD 제어의 오차 동역학', '오차 동역학과 안정성'],
    tags: 'PID PD control third order error dynamics integral gain bound Routh Hurwitz stability gravity PID 적분 이득 안정 조건 3차',
    stmt: R`$\tau=M\ddot\theta+b\dot\theta+\tau_{\mathrm{dist}}$인 관절에 고정 목표로 PID를 걸고 $\tau_{\mathrm{dist}}$가 일정하면 $M\theta_e^{(3)}+(b+K_d)\ddot\theta_e+K_p\dot\theta_e+K_i\theta_e=0$이고, $K_p>0$, $b+K_d>0$일 때 이것이 안정한 것은 $0<K_i<(b+K_d)K_p/M$과 동치이다.`,
    body: R`
$\dot\theta_d=0$이므로 $\dot\theta=-\dot\theta_e$, $\ddot\theta=-\ddot\theta_e$. 제어 법칙을 넣으면 $-M\ddot\theta_e-b\dot\theta_e+\tau_{\mathrm{dist}}=K_p\theta_e+K_i\int\theta_e+K_d\dot\theta_e$, 곧 $M\ddot\theta_e+(b+K_d)\dot\theta_e+K_p\theta_e+K_i\int\theta_e=\tau_{\mathrm{dist}}$. 한 번 미분하면 상수가 사라져 3차 식. ($K_i=0$이고 $\tau_{\mathrm{dist}}=0$이면 미분 전의 식이 곧 PD의 2차 오차 동역학.)
$M$으로 나눈 특성 다항식 $s^3+a_2s^2+a_1s+a_0$ ($a_2=(b+K_d)/M$, $a_1=K_p/M$, $a_0=K_i/M$)에서, 근이 허수축을 지나는 순간에는 $s=j\omega$가 근입니다: $-j\omega^3-a_2\omega^2+ja_1\omega+a_0=0$. 실수부 $a_0=a_2\omega^2$, 허수부 $\omega(a_1-\omega^2)=0$.
$\omega=0$이면 $a_0=0$, $\omega^2=a_1$이면 $a_0=a_2a_1$. 근은 계수에 연속으로 의존하므로, $a_0$가 $0$에서 $a_2a_1$ 사이를 움직이는 동안에는 어떤 근도 허수축을 건너지 않습니다.
$a_0$가 아주 작은 양수일 때 근은 PD의 두 근(왼쪽 반평면) 근처의 둘과 $s\approx-a_0/a_1<0$ 하나이므로 모두 안정 → $0<a_0<a_2a_1$ 전체에서 안정. $a_0=a_2a_1$에서는 $s^3+a_2s^2+a_1s+a_2a_1=(s+a_2)(s^2+a_1)$로 $\pm j\sqrt{a_1}$이 허수축 위에 있고, 그보다 크면 불안정해집니다. $a_0<a_2a_1$을 이득으로 쓰면 $K_i<(b+K_d)K_p/M$.`,
    note: R`일반적인 3차 다항식의 후르비츠 조건 “계수가 모두 양수이고 $a_2a_1>a_0$”을 이 경우에 직접 확인한 것입니다.` },
  { ch: 'ch20', id: 'modelBasedConvergence', title: '계산 토크 제어와 중력 보상 PD의 수렴', keys: ['계산 토크 제어', 'PD 제어와 중력 보상'],
    tags: 'computed torque inverse dynamics feedback linearization gravity compensation Lyapunov skew symmetric 계산 토크 역동역학 되먹임 선형화 중력 보상 리아푸노프',
    stmt: R`(1) 모델이 정확하면 계산 토크 제어 아래 오차는 $\ddot\theta_e+K_d\dot\theta_e+K_p\theta_e+K_i\int\theta_e=0$을 따른다. (2) 마찰이 없고 중력 보상이 정확하며 $\dot\theta_d=0$이면 $\tau=K_p\theta_e+K_d\dot\theta_e+g(\theta)$ 아래 오차 에너지 $V=\tfrac12\theta_e^TK_p\theta_e+\tfrac12\dot\theta^TM\dot\theta$가 증가하지 않는다.`,
    body: R`
(1) $M(\theta)\ddot\theta+h(\theta,\dot\theta)=M(\theta)\big(\ddot\theta_d+K_p\theta_e+K_i\textstyle\int\theta_e+K_d\dot\theta_e\big)+h(\theta,\dot\theta)$에서 $h$가 지워지고, $M$이 양의 정부호라 가역이므로 $\ddot\theta=\ddot\theta_d+K_p\theta_e+K_i\int\theta_e+K_d\dot\theta_e$. $\ddot\theta_e=\ddot\theta_d-\ddot\theta$를 쓰면 주어진 식. 비선형 항이 모두 상쇄되어 관절마다 같은 선형 방정식이 됩니다.
(2) 동역학 $M\ddot\theta+C\dot\theta+g=\tau=K_p\theta_e-K_d\dot\theta+g$ ($\dot\theta_e=-\dot\theta$)에서 $M\ddot\theta=K_p\theta_e-K_d\dot\theta-C\dot\theta$.
$\dot V=\theta_e^TK_p\dot\theta_e+\dot\theta^TM\ddot\theta+\tfrac12\dot\theta^T\dot M\dot\theta=-\dot\theta^TK_p\theta_e+\dot\theta^T(K_p\theta_e-K_d\dot\theta-C\dot\theta)+\tfrac12\dot\theta^T\dot M\dot\theta$.
$\dot M-2C$가 반대칭이라 $\dot\theta^T(\tfrac12\dot M-C)\dot\theta=0$ (17단원). 남는 것은 $\dot V=-\dot\theta^TK_d\dot\theta\le0$.
$\dot V=0$이면 $\dot\theta=0$인데, 그때 $\theta_e\ne0$이면 $M\ddot\theta=K_p\theta_e\ne0$이라 곧 다시 움직이므로 머물 수 있는 곳은 $\theta_e=0$뿐입니다(라살의 불변 원리).`,
    note: R`(2)는 모델의 관성 항을 몰라도 중력만 알면 고정 목표에 수렴함을 보입니다. 다만 궤적 추종에서는 (1)처럼 관성과 코리올리 항까지 보상해야 오차가 작게 유지됩니다.` },
  // ───── 21
  { ch: 'ch21', id: 'bellmanExpectation', title: '벨만 기대 방정식과 그 행렬 풀이', keys: ['벨만 기대 방정식', '정책 평가의 행렬 꼴'],
    tags: 'Bellman expectation equation value function return recursion Markov policy evaluation matrix inverse Neumann series 벨만 기대 방정식 정책 평가',
    stmt: R`$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)[R(s,a,s')+\gamma V^\pi(s')]$이고, 유한 상태에서 $V^\pi=(I-\gamma P_\pi)^{-1}r_\pi=\sum_{k\ge0}\gamma^kP_\pi^kr_\pi$이다.`,
    body: R`
$G_t=r_{t+1}+\gamma G_{t+1}$이므로 $V^\pi(s)=\mathbb E_\pi[r_{t+1}\mid s_t=s]+\gamma\,\mathbb E_\pi[G_{t+1}\mid s_t=s]$.
첫 행동과 다음 상태로 조건을 나누면(전확률) $\mathbb E_\pi[G_{t+1}\mid s_t=s]=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\,\mathbb E_\pi[G_{t+1}\mid s_t=s,a_t=a,s_{t+1}=s']$.
마르코프 성질 때문에 $s_{t+1}=s'$ 이후의 미래는 그 전과 무관하고, 정책도 현재 상태만 보므로 이 조건부 기댓값은 $V^\pi(s')$입니다. 보상 항도 같은 방식으로 나누면 주어진 식.
행렬로 쓰면 $V=r_\pi+\gamma P_\pi V$. 확률 행렬은 $\lVert P_\pi\rVert_\infty=1$이므로 $\lVert\gamma P_\pi\rVert_\infty=\gamma<1$이고, 노이만 급수 $\sum_k(\gamma P_\pi)^k$가 수렴해 $(I-\gamma P_\pi)^{-1}$이 됩니다. 이 급수는 “$k$걸음 뒤의 기대 보상 $P_\pi^kr_\pi$를 $\gamma^k$로 할인해 더한 것” — 가치의 정의 그대로입니다.`,
    note: R`$Q^\pi$의 식도 같은 방법으로, 첫 행동을 고정한 채 다음 상태와 다음 행동으로 나누면 나옵니다.` },
  { ch: 'ch21', id: 'bellmanContraction', title: '벨만 최적 연산자는 수축 사상이다', keys: ['가치 반복과 수축'],
    tags: 'Bellman optimality operator contraction max norm Banach fixed point value iteration convergence 수축 사상 가치 반복 고정점',
    stmt: R`$(TV)(s)=\max_a\sum_{s'}P(s'\mid s,a)[R+\gamma V(s')]$이면 $\lVert TV-TU\rVert_\infty\le\gamma\lVert V-U\rVert_\infty$이고, 가치 반복 $V_{k+1}=TV_k$는 유일한 고정점 $V^\ast$로 $\lVert V_k-V^\ast\rVert_\infty\le\gamma^k\lVert V_0-V^\ast\rVert_\infty$의 속도로 수렴한다.`,
    body: R`
$Q_V(s,a)=\sum_{s'}P(s'\mid s,a)[R+\gamma V(s')]$로 두면 $\lvert Q_V(s,a)-Q_U(s,a)\rvert=\gamma\big\lvert\sum_{s'}P(s'\mid s,a)(V(s')-U(s'))\big\rvert\le\gamma\lVert V-U\rVert_\infty$.
$\lvert\max_af(a)-\max_ag(a)\rvert\le\max_a\lvert f(a)-g(a)\rvert$ (최댓값을 주는 $a$에서 비교하면 됨)이므로 모든 $s$에서 $\lvert(TV)(s)-(TU)(s)\rvert\le\gamma\lVert V-U\rVert_\infty$.
수열 $V_k$는 $\lVert V_{k+1}-V_k\rVert\le\gamma^k\lVert V_1-V_0\rVert$라 코시 수열이고 $\mathbb R^{\lvert\mathcal S\rvert}$는 완비이므로 극한 $V^\ast$가 있으며, $T$의 연속성으로 $TV^\ast=V^\ast$. 고정점이 둘이면 $\lVert V-U\rVert\le\gamma\lVert V-U\rVert$에서 같습니다.
$\lVert V_k-V^\ast\rVert=\lVert TV_{k-1}-TV^\ast\rVert\le\gamma\lVert V_{k-1}-V^\ast\rVert$를 되풀이하면 $\gamma^k$ 속도.`,
    note: R`같은 논리로 정책 $\pi$의 기대 연산자 $T^\pi V=r_\pi+\gamma P_\pi V$도 $\gamma$-수축이라, 반복 정책 평가도 $V^\pi$로 수렴합니다.` },
  { ch: 'ch21', id: 'policyImprovement', title: '정책 개선 정리와 정책 반복의 종료', keys: ['정책 반복'],
    tags: 'policy improvement theorem greedy policy iteration monotone finite termination optimality 정책 개선 정리 정책 반복 탐욕',
    stmt: R`$\pi'(s)=\arg\max_aQ^\pi(s,a)$이면 모든 상태에서 $V^{\pi'}(s)\ge V^\pi(s)$이다. 개선해도 가치가 그대로이면 $V^\pi$는 벨만 최적 방정식을 만족해 $\pi$는 최적이다.`,
    body: R`
탐욕적으로 골랐으므로 $Q^\pi(s,\pi'(s))\ge\sum_a\pi(a\mid s)Q^\pi(s,a)=V^\pi(s)$.
$V^\pi(s)\le Q^\pi(s,\pi'(s))=\mathbb E[r_{t+1}+\gamma V^\pi(s_{t+1})\mid s_t=s,a_t=\pi'(s)]$. 오른쪽의 $V^\pi(s_{t+1})$에 같은 부등식을 다시 쓰면 $\le\mathbb E_{\pi'}[r_{t+1}+\gamma r_{t+2}+\gamma^2V^\pi(s_{t+2})\mid s_t=s]$.
이를 계속 펼치면 $\gamma^k\to0$이라 $V^\pi(s)\le\mathbb E_{\pi'}[\sum_k\gamma^kr_{t+k+1}\mid s_t=s]=V^{\pi'}(s)$.
가치가 바뀌지 않으면 $V^\pi(s)=\max_aQ^\pi(s,a)=\max_a\sum_{s'}P[R+\gamma V^\pi(s')]$ — 벨만 최적 방정식이고, 그 해는 유일하므로(수축) $V^\pi=V^\ast$.
동점이면 기존 행동을 유지하기로 하면, 정책이 바뀌는 단계마다 바뀐 상태에서 $V^\pi(s)<Q^\pi(s,\pi'(s))\le V^{\pi'}(s)$로 가치가 엄격히 커집니다. 결정적 정책은 $\lvert\mathcal A\rvert^{\lvert\mathcal S\rvert}$개뿐이고 같은 정책으로 돌아올 수 없으므로 유한 번 안에 끝납니다.`,
    note: R`배터리 로봇에서 가치가 $(-7,-13)\to(10,9)\to(13.79,12.41)$로 상태마다 커진 것이 이 정리의 예입니다.` },
  // ───── 22
  { ch: 'ch22', id: 'policyGradientThm', title: '정책 경사 정리: 로그 미분 요령', keys: ['정책 경사 정리'],
    tags: 'policy gradient theorem REINFORCE log derivative trick likelihood ratio score function causality 정책 경사 로그 미분 점수 함수',
    stmt: R`에피소드형 과제에서 $J(\theta)=\mathbb E_{\pi_\theta}[G_0]$이면 $\nabla_\theta J=\mathbb E_{\pi_\theta}\big[\sum_t\gamma^tG_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)\big]$이다.`,
    body: R`
궤적 $\xi=(s_0,a_0,r_1,s_1,\dots)$의 확률은 $p_\theta(\xi)=\rho(s_0)\prod_t\pi_\theta(a_t\mid s_t)P(s_{t+1}\mid s_t,a_t)$이고, $J=\sum_\xi p_\theta(\xi)G_0(\xi)$.
$\nabla p_\theta=p_\theta\nabla\log p_\theta$이므로 $\nabla J=\mathbb E[G_0\nabla\log p_\theta(\xi)]$. 로그를 취하면 곱이 합이 되고, $\rho$와 $P$는 $\theta$와 무관해 미분에서 사라집니다: $\nabla\log p_\theta(\xi)=\sum_t\nabla\log\pi_\theta(a_t\mid s_t)$.
인과성: $t$ 이전의 보상 $r_{k+1}$ ($k<t$)은 $a_t$보다 먼저 정해집니다. $s_t$까지의 역사를 고정하고 $a_t$에 대해 먼저 평균하면 $\sum_a\pi(a\mid s_t)\nabla\log\pi(a\mid s_t)=\sum_a\nabla\pi(a\mid s_t)=\nabla1=0$이므로 $\mathbb E[r_{k+1}\nabla\log\pi(a_t\mid s_t)]=0$.
그래서 $G_0=\sum_k\gamma^kr_{k+1}$ 가운데 $k\ge t$인 항만 남고, 그 합이 $\gamma^tG_t$입니다.`,
    note: R`전이 모델이 미분에서 빠지는 것이 핵심입니다. 실제 구현은 흔히 $\gamma^t$를 생략하는데, 이는 할인된 목적 함수의 정확한 경사와 조금 다른 방향을 씁니다.` },
  { ch: 'ch22', id: 'baselineAdvantage', title: '기준선은 경사를 바꾸지 않고, TD 오차는 이점을 추정한다', keys: ['기준선이 있는 REINFORCE', '행위자–비평자'],
    tags: 'baseline variance reduction unbiased advantage TD error actor critic REINFORCE 기준선 분산 이점 TD 오차 행위자 비평자',
    stmt: R`$\mathbb E_{a\sim\pi}[b(s)\nabla\log\pi_\theta(a\mid s)]=0$이고, 비평자가 정확해 $V_w=V^\pi$이면 $\mathbb E[\delta\mid s,a]=Q^\pi(s,a)-V^\pi(s)$이다.`,
    body: R`
$\mathbb E_a[b(s)\nabla\log\pi(a\mid s)]=b(s)\sum_a\pi(a\mid s)\dfrac{\nabla\pi(a\mid s)}{\pi(a\mid s)}=b(s)\nabla\sum_a\pi(a\mid s)=b(s)\nabla1=0$.
그래서 정책 경사의 각 항에서 $G_t$ 대신 $G_t-b(s_t)$를 써도 기댓값은 같습니다. $b$는 표본의 크기만 바꾸므로 분산을 줄이도록 고를 수 있고, $V(s_t)$에 가까울 때 효과가 큽니다.
TD 오차: $\mathbb E[\delta\mid s,a]=\mathbb E[r+\gamma V^\pi(s')\mid s,a]-V^\pi(s)=Q^\pi(s,a)-V^\pi(s)=A^\pi(s,a)$ (벨만 방정식의 $Q$ 꼴).
따라서 행위자의 갱신 $\delta\nabla\log\pi$는 기준선 $V^\pi$를 뺀 정책 경사 $(Q^\pi-V^\pi)\nabla\log\pi$의 한 걸음짜리 표본이고, 에피소드 끝을 기다리지 않습니다.`,
    note: R`실제 비평자는 근사이므로 $\delta$는 약간 편향된 추정입니다 — 몬테카를로(편향 없음, 분산 큼)와 TD(편향, 분산 작음)의 교환이 여기서도 나타납니다.` },
  { ch: 'ch22', id: 'shapingInvariance', title: '포텐셜 기반 보상 성형은 최적 정책을 바꾸지 않는다', keys: ['포텐셜 기반 보상 성형'],
    tags: 'potential based reward shaping policy invariance telescoping Ng 보상 성형 포텐셜 최적 정책 불변',
    stmt: R`$r'=r+\gamma\Phi(s')-\Phi(s)$로 바꾼 MDP에서 모든 정책의 행동 가치는 $Q'^\pi(s,a)=Q^\pi(s,a)-\Phi(s)$이고, 따라서 최적 정책이 같다.`,
    body: R`
$s_0=s$, $a_0=a$에서 시작한 궤적에서 성형 항의 할인 합은 망원경처럼 지워집니다:
$\sum_{t=0}^{T-1}\gamma^t\big(\gamma\Phi(s_{t+1})-\Phi(s_t)\big)=\gamma^T\Phi(s_T)-\Phi(s_0)$.
끝 상태에서 $\Phi=0$으로 두거나(에피소드형) $T\to\infty$에서 $\gamma^T\Phi\to0$($\Phi$ 유계)이면 이 합은 $-\Phi(s)$입니다.
기댓값을 취하면 $Q'^\pi(s,a)=Q^\pi(s,a)-\Phi(s)$. 빼는 양이 행동 $a$에 의존하지 않으므로 $\arg\max_aQ'^\ast(s,a)=\arg\max_aQ^\ast(s,a)$ — 최적 정책이 그대로입니다.`,
    note: R`“목표에 가까워지면 +1”처럼 포텐셜 차이 꼴이 아닌 보상을 더하면, 목표 근처를 빙빙 도는 순환에서 보상이 쌓여 최적 정책 자체가 바뀔 수 있습니다. 포텐셜 꼴에서는 닫힌 순환의 성형 보상 합이 ($\gamma=1$이면 정확히) 0입니다.` }
  );
})();
