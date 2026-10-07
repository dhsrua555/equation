/* 모의고사 — 강의 계획서의 시험 범위에 맞춘 세 시험(중간고사 1: 1–9단원, 중간고사 2: 10–16단원, 기말고사: 전 범위·17–22단원 비중).
   연습문제와 겹치지 않는 문항. 실제 시험은 4문제 200점 서술형이므로(기출 풀이 탭) 여기서는 짧은 문항으로 개념을 점검합니다. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '중간고사 1 범위', title: '자유도, 파지, 좌표계와 D-H', scopeText: '01–09 단원 · MR 2장, 12장, 3.2.1–3.3.1, 부록 B·C',
    desc: '10월 12일 시험 범위: 그뤼블러 공식, C-공간, 마찰 없는·있는 파지와 힘 닫힘, 움직이는 좌표계와 각속도, 회전 행렬, 오일러 각과 롤-피치-요, 동차 변환, D-H 표현.',
    minutes: 90, plot: 'rbCone',
    problems: [
      { ch: 'ch01', type: 'num', lv: 1, pts: 6, q: R`평면 기구가 링크 6개(바닥 포함), 회전 관절 6개, 병진 관절 1개로 이루어져 있다. 그뤼블러 공식의 자유도는?`, ans: '1', ansTex: R`1`,
        sol: R`$3(6-1-7)+7=1$.` },
      { ch: 'ch01', type: 'num', lv: 2, pts: 8, q: R`바닥과 판을 UPU 다리 세 개(다리마다 링크 2개)로 이은 공간 병렬 기구의 그뤼블러 자유도는?

:::fig m3UPU bare
:::`, ans: '3', ansTex: R`3`,
        sol: R`$N=2+6=8$, $J=9$, $\sum f_i=3(2+1+2)=15$: $6(8-1-9)+15=3$.` },
      { ch: 'ch02', type: 'mc', lv: 1, pts: 6, q: R`직선 레일 위를 달리는 수레에 구면 진자(한 점 둘레로 자유롭게 도는 막대 끝의 질점)를 매달았다. C-공간은?

:::fig mPendulum bare
:::`,
        choices: [R`$\mathbb R^1\times S^1$`, R`$\mathbb R^1\times S^2$`, R`$T^3$`, R`$\mathbb R^3$`], ans: 1,
        sol: R`레일 위치 $\mathbb R^1$, 진자 끝의 방향 $S^2$ — 3차원.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 8, q: R`3단원 예제 1의 못 네 개 배치에서 $\ell_1=0.06$, $\ell_2=0.01$, $\ell_3=-0.02$, $\ell_4=-0.03$이다. 외력 없이 서로 밀어 붙이는 내력 $Ak=0$에서 $k_2/k_1$은?`, ans: '2', ansTex: R`2`,
        sol: R`$k_1(\ell_3-\ell_1)+k_2(\ell_2-\ell_4)=-0.08k_1+0.04k_2=0$ → $k_2/k_1=2$. 곱이 음수라 힘 닫힘입니다.` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 8, q: R`폭 10 cm인 상자의 마주 보는 두 연직 면을 두 손가락이 누르는데 접촉점의 높이 차가 4 cm다. 응우옌 정리로 힘 닫힘이 되는 최소 마찰 계수는?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`두 점을 잇는 선이 법선과 이루는 각의 탄젠트 $4/10$. $\mu>0.4$.` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 8, q: R`원판이 3 rad/s로 일정하게 돌고, 원판 위의 벌레가 반지름을 따라 0.2 m/s로 바깥으로 긴다. 코리올리 가속도의 크기(m/s²)는?`, ans: '1.2', ansTex: R`1.2`,
        sol: R`$\lVert2\omega\times v_{\text{rel}}\rVert=2\cdot3\cdot0.2=1.2$. 방향은 원판이 도는 쪽(앞쪽)입니다.` },
      { ch: 'ch06', type: 'num', lv: 1, pts: 6, q: R`$R_{sa}=\mathrm{Rot}(\hat z,90°)$, $R_{sb}=\mathrm{Rot}(\hat z,30°)$일 때 $R_{ab}$의 (1, 1) 성분은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$R_{ab}=R_{sa}^TR_{sb}=\mathrm{Rot}(\hat z,-60°)$, $\cos60°=0.5$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 8, q: R`어떤 회전 행렬의 $r_{31}=-\tfrac12$이다. ZYX 오일러 각 중 $\cos\beta\gt0$인 해의 $\beta$(도)는?`, ans: '30', ansTex: R`30`,
        sol: R`$r_{31}=-\sin\beta$ → $\sin\beta=\tfrac12$, $\cos\beta\gt0$ → $30°$. (다른 해는 $150°$.)` },
      { ch: 'ch08', type: 'num', lv: 2, pts: 8, q: R`$T_{ab}=(\mathrm{Rot}(\hat z,90°),(1,0,0))$, $T_{cb}=(I,(0,2,0))$일 때 $T_{ac}$의 위치 부분의 $x$ 성분은?`, ans: '3', ansTex: R`3`,
        sol: R`$T_{ac}=T_{ab}T_{cb}^{-1}=T_{ab}(I,(0,-2,0))$ → $p_{ac}=\mathrm{Rot}(\hat z,90°)(0,-2,0)+(1,0,0)=(2,0,0)+(1,0,0)=(3,0,0)$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 8, q: R`D-H 행 $(\alpha_{i-1},a_{i-1},d_i,\phi_i)=(90°,0.5,0.2,0)$에서 {i}의 원점을 {i−1}에서 본 위치의 $y$ 성분은?`, ans: '-0.2', ansTex: R`-0.2`,
        sol: R`위치 $(a,\,-d\sin\alpha,\,d\cos\alpha)=(0.5,\,-0.2,\,0)$.` },
      { ch: 'ch04', type: 'open', lv: 3, pts: 13, proof: true, q: R`한 변이 2인 정사각형 물체($-1\le x,y\le1$)를 두 마찰 손가락이 왼쪽 면의 가운데 $(-1,0)$(법선 $(1,0)$)과 윗면의 가운데 $(0,1)$(법선 $(0,-1)$)에서 누른다. (1) 응우옌 정리로 힘 닫힘에 필요한 마찰 계수 조건을 구하고, (2) $\mu=2$일 때 원뿔 모서리 렌치로 $Ak=0$인 양수 $k$를 실제로 찾아 판정을 확인하세요.`,
        sol: R`
(1) 왼쪽 접촉에서 윗면 접촉으로 가는 방향 $(1,1)/\sqrt2$는 왼쪽 법선 $(1,0)$과 45°, 반대 방향 $(-1,-1)/\sqrt2$는 윗면 법선 $(0,-1)$과 45°를 이룹니다. 선분이 두 원뿔의 내부에 있으려면 $\alpha>45°$, 즉 $\mu>1$.
(2) $\mu=2$: 왼쪽 모서리 $e_1=(1,2)$, $e_2=(1,-2)$, 윗면 모서리 $e_3=(2,-1)$, $e_4=(-2,-1)$.
선을 따라 미는 내력 $f_1=(1,1)$ (왼쪽), $f_2=(-1,-1)$ (윗면)를 모서리로 분해: $f_1=0.75e_1+0.25e_2$, $f_2=0.25e_3+0.75e_4$ — 계수가 모두 양수.
모멘트: $f_1$은 $(-1,0)$에서 $m=(-1)(1)-0=-1$, $f_2$는 $(0,1)$에서 $m=0-(1)(-1)=1$. 합 0 → $k=(0.75,0.25,0.25,0.75)$로 $Ak=0$.
계수: 네 작용선은 $(-1,0)$을 지나는 두 직선과 $(0,1)$을 지나는 두 직선이라 한 점에서 만나지도, 모두 평행하지도 않음 → 계수 3. 따라서 힘 닫힘.`,
        rubric: R`
- 선분과 법선의 각, 조건 $\mu>1$ — 4점
- 모서리 벡터와 내력의 분해(양의 계수) — 4점
- 모멘트 합 0 확인 — 2점
- 계수 3 논증과 결론 — 3점` },
      { ch: 'ch09', type: 'open', lv: 3, pts: 13, proof: true, q: R`관절 1은 수직축, 관절 2는 관절 1과 만나는 수평축, 관절 3은 관절 2와 평행하고 $L_2$ 떨어진 축, 손끝은 관절 3에서 $L_3$ 떨어진 RRR 팔이다(그림).

:::fig mRRR bare
:::

(1) 링크 좌표계를 정하고 D-H 표를 쓰라. (2) 영 자세에서 $T_{04}$를 구해 그림과 맞는지 확인하라. (3) 관절 1과 2가 만나지 않고 $\hat x$ 방향으로 $a_1$만큼 떨어져 있다면 표의 어느 칸이 바뀌는가?`,
        sol: R`
(1) {0}={1}(영 자세), $\hat z_1$ 수직. 축 1과 2가 만나므로 {1}의 원점은 교점, $\hat x_1$은 두 축에 수직, $a_1=0$, $\alpha_1=90°$. 축 2와 3은 평행: $\alpha_2=0$, $a_2=L_2$, 공통 수선을 팔이 있는 평면에 잡아 $d=0$. 끝 {4}: $a_3=L_3$.
| $i$ | $\alpha_{i-1}$ | $a_{i-1}$ | $d_i$ | $\phi_i$ |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | $\theta_1$ |
| 2 | 90° | 0 | 0 | $\theta_2$ |
| 3 | 0 | $L_2$ | 0 | $\theta_3$ |
| 4 | 0 | $L_3$ | 0 | 0 |
(2) $T_{04}(0)=\begin{bmatrix}1&0&0&L_2+L_3\\0&0&-1&0\\0&1&0&0\\0&0&0&1\end{bmatrix}$: 손끝이 $\hat x_0$ 방향으로 $L_2+L_3$ 뻗은 수평 자세, $\hat z_4$는 관절 2·3의 축 방향($-\hat y_0$).
(3) 2행의 $a_1$이 0에서 그 거리로 바뀝니다(공통 수선이 생김). $\alpha_1=90°$는 그대로, 나머지 행도 그대로입니다.`,
        rubric: R`
- 축의 관계(교차·평행) 판정 — 3점
- 표 네 행 — 4점
- 영 자세 검산 — 3점
- 오프셋이 생긴 경우 — 3점` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '중간고사 2 범위', title: '지수 좌표, 지수곱, 야코비안, 역기구학', scopeText: '10–16 단원 · MR 3.2.3–3.4, 4–6장',
    desc: '11월 18일 시험 범위: 회전과 강체 운동의 지수 좌표, 트위스트와 렌치, 지수곱 정기구학, 야코비안, 정역학과 특이점, 조작성, 역기구학.',
    minutes: 90, plot: 'rbManip',
    problems: [
      { ch: 'ch10', type: 'num', lv: 2, pts: 6, q: R`$R=\mathrm{Rot}(\hat y,90°)\,\mathrm{Rot}(\hat z,90°)$가 나타내는 회전의 각(도)은?`, ans: '120', ansTex: R`120°`,
        sol: R`$R=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$, $\operatorname{tr}R=0$ → $\cos\theta=-\tfrac12$. 축 $(1,1,1)/\sqrt3$ 둘레 120°.` },
      { ch: 'ch10', type: 'num', lv: 2, pts: 8, q: R`회전 행렬의 대각합이 $1+\sqrt2$이다. 회전각(rad)은?`, ans: 'pi/4', ansTex: R`\pi/4`,
        sol: R`$1+2\cos\theta=1+\sqrt2$ → $\cos\theta=\tfrac{\sqrt2}2$.` },
      { ch: 'ch10', type: 'mc', lv: 1, pts: 6, q: R`$SO(3)$를 반지름 $\pi$인 지수 좌표의 공으로 볼 때, 같은 회전을 나타내는 두 점은?`,
        choices: [R`원점과 겉면의 한 점`, R`겉면의 맞은편 두 점 $r$과 $-r$`, R`공 안의 맞은편 두 점 $r$과 $-r$ ($\lVert r\rVert\lt\pi$)`, R`없다(모든 점이 다른 회전)`], ans: 1,
        sol: R`$\theta=\pi$일 때만 $\pm\hat\omega$가 같은 회전입니다. 안쪽의 $r$과 $-r$은 서로 역회전입니다.` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 8, q: R`물체가 점 $(1,2,0)$을 지나는 $\hat z$ 방향 축 둘레로 3 rad/s로 돈다(병진 없음). 공간 트위스트의 $v_s$의 $x$ 성분은?`, ans: '6', ansTex: R`6`,
        sol: R`$v_s=-\omega\times q=-(0,0,3)\times(1,2,0)=-(-6,3,0)=(6,-3,0)$.` },
      { ch: 'ch12', type: 'num', lv: 1, pts: 6, q: R`점 $(0,0.3,0)$ m에 힘 $(10,0,0)$ N이 작용한다. 원점에 대한 렌치의 모멘트 $z$ 성분(N·m)은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$m_z=r_xf_y-r_yf_x=0-0.3(10)=-3$. $x$ 방향 힘이 원점보다 위를 지나 시계 방향 모멘트를 만듭니다.` },
      { ch: 'ch13', type: 'num', lv: 1, pts: 6, q: R`$L_1=L_2=L_3=1$인 평면 3R 팔이 $\theta=(\pi/3,-\pi/3,\pi/2)$일 때 끝점의 $y$ 좌표는?`, ans: 'sin(pi/3)+0+sin(pi/2)', ansTex: R`1.866`,
        sol: R`$s_1+s_{12}+s_{123}=0.866+0+1$.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 8, q: R`$L_1=0.4$, $L_2=0.3$인 평면 3R 팔(영 자세에서 $\hat x_s$ 방향으로 폄)의 $\mathcal S_3$에서 $v$의 $y$ 성분은?`, ans: '-0.7', ansTex: R`-0.7`,
        sol: R`$q_3=(0.7,0,0)$, $v=-\hat z\times q_3=(0,-0.7,0)$.` },
      { ch: 'ch14', type: 'num', lv: 1, pts: 8, q: R`$L_1=1$, $L_2=0.8$인 2R 팔이 $\theta_2=\pi/3$일 때 $\det J$는?`, ans: '0.8*sin(pi/3)', ansTex: R`0.693`,
        sol: R`$L_1L_2\sin\theta_2$.` },
      { ch: 'ch14', type: 'num', lv: 1, pts: 6, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(\pi/2,0)$이고 $\dot\theta=(1,1)$이다. 끝점 속도의 $x$ 성분은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$J=\begin{bmatrix}-2&-1\\0&0\end{bmatrix}$ → $\dot x=-3$, $\dot y=0$(곧게 편 특이 자세라 $y$ 방향 속도를 못 냄).` },
      { ch: 'ch15', type: 'num', lv: 2, pts: 8, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(\pi/2,-\pi/2)$ (끝점 $(1,1)$)에서 아래로 $f=(0,-10)$ N을 누른다. $\tau_2$ (N·m)는?`, ans: '-10', ansTex: R`-10`,
        sol: R`$J=\begin{bmatrix}-1&0\\1&1\end{bmatrix}$, $\tau=J^Tf=(-10,-10)$. 관절 2 $(0,1)$에서 끝점까지 수평 거리 1.` },
      { ch: 'ch15', type: 'num', lv: 3, pts: 8, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(0,\pi/3)$일 때 조작성 지표 $\mu_1=\sqrt{\lambda_{\max}/\lambda_{\min}}$은?`, ans: 'sqrt((2+sqrt(3.25))/(2-sqrt(3.25)))', ansTex: R`4.39`,
        sol: R`$J=\begin{bmatrix}-0.866&-0.866\\1.5&0.5\end{bmatrix}$, $A=JJ^T=\begin{bmatrix}1.5&-1.732\\-1.732&2.5\end{bmatrix}$. $\operatorname{tr}=4$, $\det=0.75$ → $\lambda=2\pm1.803$. $\mu_1=\sqrt{3.803/0.197}=4.39$.` },
      { ch: 'ch16', type: 'num', lv: 2, pts: 8, q: R`$L_1=1$, $L_2=0.8$인 2R 팔이 목표 $(1.2,0.6)$에 닿는 해 중 $\theta_2>0$인 것의 $\theta_2$ (rad)는?`, ans: 'acos(0.1)', ansTex: R`1.471`,
        sol: R`$\cos\theta_2=(1.44+0.36-1-0.64)/1.6=0.1$.` },
      { ch: 'ch14', type: 'open', lv: 3, pts: 14, proof: true, q: R`바닥이 $\hat z$ 둘레로 도는 회전 관절($\theta_1$) 위에 팔 방향으로 늘어나는 병진 관절($\theta_2$)이 있는 평면 RP 팔(영 자세 끝점 $(L_0,0,0)$, 그림).

:::fig mRP bare
:::

(1) 공간 야코비안의 두 열을 구하고, (2) 끝점 위치 $p$의 속도 $\dot p=J_p\dot\theta$의 $2\times2$ 행렬 $J_p$를 구해 특이점을 찾고 그 뜻을 설명하세요.`,
        sol: R`
(1) $J_{s1}=\mathcal S_1=(0,0,1,0,0,0)$. $J_{s2}=[\mathrm{Ad}_{e^{[\mathcal S_1]\theta_1}}]\mathcal S_2$: 병진 방향 $(1,0,0)$이 $\theta_1$만큼 돌아 $(0,0,0,\cos\theta_1,\sin\theta_1,0)$.
(2) $r=L_0+\theta_2$, $p=(r\cos\theta_1,r\sin\theta_1)$. $\dot p=v_s+\omega_s\times p$에서 관절 1의 기여 $\dot\theta_1\hat z\times p=\dot\theta_1(-r\sin\theta_1,r\cos\theta_1)$, 관절 2의 기여 $\dot\theta_2(\cos\theta_1,\sin\theta_1)$.
$J_p=\begin{bmatrix}-r\sin\theta_1&\cos\theta_1\\r\cos\theta_1&\sin\theta_1\end{bmatrix}$, $\det J_p=-r$.
특이점: $r=L_0+\theta_2=0$, 끝점이 회전축 위에 올 때. 그곳에서는 관절 1을 돌려도 끝점이 움직이지 않아 원주 방향 속도를 낼 수 없습니다. 공간 야코비안(트위스트)은 두 열이 늘 독립이지만, 끝점 “위치”만 볼 때 생기는 특이점입니다.`,
        rubric: R`
- 공간 야코비안 두 열 — 4점
- 끝점 속도의 두 기여 — 4점
- 행렬식과 특이 조건 — 3점
- 물리적 해석 — 3점` },
    ],
  },
  {
    id: 'x3', roman: 'III', kind: '기말고사 범위', title: '동역학, 계획과 제어, 강화 학습 (전 범위)', scopeText: '01–22 단원 · 17–22단원 비중',
    desc: '12월 9일 기말고사는 전 범위입니다. 이 모의고사는 중간고사 뒤의 내용(동역학, 궤적, 운동 계획, 제어, 강화 학습)에 무게를 두었습니다. 앞 범위는 모의고사 I·II로 점검하세요.',
    minutes: 90, plot: 'rbStep',
    problems: [
      { ch: 'ch17', type: 'num', lv: 2, pts: 8, q: R`끝에 점질량이 있는 2R 팔($m_1=2$ kg, $m_2=1$ kg, $L_1=L_2=1$ m)의 $\theta_2=\pi/2$에서 $m_{11}$ (kg·m²)은?`, ans: '4', ansTex: R`4`,
        sol: R`$m_1L_1^2+m_2(L_1^2+2L_1L_2c_2+L_2^2)=2+2=4$.` },
      { ch: 'ch18', type: 'num', lv: 1, pts: 8, q: R`관절 하나를 5차 다항식 스케일링으로 $T=3$ s 동안 1.2 rad 움직인다. 최대 관절 속도(rad/s)는?`, ans: '1.2*15/(8*3)', ansTex: R`0.75`,
        sol: R`$1.2\times\dfrac{15}{8T}=0.75$.` },
      { ch: 'ch19', type: 'mc', lv: 1, pts: 8, q: R`격자 위의 A* 탐색이 최단 경로를 찾는다고 보장되는 조건은?`,
        choices: [R`휴리스틱이 0보다 크다`, R`휴리스틱이 목표까지의 실제 남은 비용을 넘지 않는다(허용 가능)`, R`격자가 충분히 촘촘하다`, R`장애물이 볼록하다`], ans: 1,
        sol: R`허용 가능한(낙관적인) 휴리스틱이면 A*는 최적 경로를 돌려줍니다. 휴리스틱이 0이면 다익스트라와 같습니다.` },
      { ch: 'ch19', type: 'mc', lv: 1, pts: 8, q: R`RRT 같은 표본 추출 기반 계획법이 갖는 완전성은?`,
        choices: [R`완전성(해가 있으면 유한 시간에 반드시 찾음)`, R`분해능 완전성`, R`확률적 완전성(표본이 늘수록 해를 찾을 확률이 1로)`, R`완전성이 전혀 없다`], ans: 2,
        sol: R`해가 있으면 표본 수가 늘어날수록 찾을 확률이 1에 다가갑니다. 격자 방법은 분해능 완전성을 가집니다.` },
      { ch: 'ch20', type: 'num', lv: 2, pts: 10, q: R`관성 1인 관절의 오차 동역학이 $\ddot\theta_e+4\dot\theta_e+16\theta_e=0$이다. 계단 응답의 최대 오버슈트(비율)는?`, ans: 'exp(-pi*0.5/sqrt(0.75))', ansTex: R`0.163`,
        sol: R`$\omega_n=4$, $2\zeta\omega_n=4$ → $\zeta=0.5$. 오버슈트 $e^{-\pi\zeta/\sqrt{1-\zeta^2}}\approx0.163$.` },
      { ch: 'ch20', type: 'num', lv: 1, pts: 8, q: R`같은 오차 동역학의 2% 정착 시간(초)을 $4/(\zeta\omega_n)$으로 어림하면?`, ans: '2', ansTex: R`2`,
        sol: R`$\zeta\omega_n=2$ → $4/2=2$ s.` },
      { ch: 'ch21', type: 'num', lv: 1, pts: 8, q: R`매 단계 보상 1을 끝없이 받고 할인율이 $\gamma=0.9$일 때 반환값은?`, ans: '10', ansTex: R`10`,
        sol: R`$\sum_{k\ge0}0.9^k=\dfrac1{1-0.9}=10$.` },
      { ch: 'ch21', type: 'num', lv: 2, pts: 10, q: R`상태 $s_1$에서 ‘그만’(보상 5, 끝) 또는 ‘앞으로’(보상 0, $s_2$로)를 고를 수 있고, $s_2$에서는 ‘앞으로’(보상 10, 끝)뿐이다. $\gamma=0.9$일 때 $V^*(s_1)$은?`, ans: '9', ansTex: R`9`,
        sol: R`$V^*(s_2)=10$, $V^*(s_1)=\max(5,\ 0+0.9\cdot10)=9$ — 기다리는 쪽이 낫습니다.` },
      { ch: 'ch22', type: 'num', lv: 2, pts: 10, q: R`Q-학습에서 $Q(s,a)=2$, 보상 $r=1$, 다음 상태에서 $\max_{a'}Q(s',a')=5$, $\gamma=0.9$, 학습률 $\alpha=0.5$이다. 갱신 뒤의 $Q(s,a)$는?`, ans: '3.75', ansTex: R`3.75`,
        sol: R`$Q\leftarrow Q+\alpha\big(r+\gamma\max Q'-Q\big)=2+0.5(1+4.5-2)=3.75$.` },
      { ch: 'ch22', type: 'mc', lv: 1, pts: 8, q: R`Q-학습과 SARSA의 차이로 옳은 것은?`,
        choices: [R`Q-학습은 다음 상태에서 최대 $Q$를 목표로 쓰는 off-policy, SARSA는 실제로 고른 행동의 $Q$를 쓰는 on-policy`, R`둘 다 모델(전이 확률)이 필요하다`, R`SARSA는 할인율을 쓰지 않는다`, R`Q-학습은 정책 경사 방법이다`], ans: 0,
        sol: R`목표값이 $r+\gamma\max_{a'}Q(s',a')$(Q-학습)인지 $r+\gamma Q(s',a')$(SARSA, $a'$은 실제 행동)인지의 차이입니다.` },
      { ch: 'ch20', type: 'open', lv: 3, pts: 14, proof: true, q: R`동역학이 $\tau=M(\theta)\ddot\theta+h(\theta,\dot\theta)$인 로봇에 계산 토크 제어 $\tau=M(\theta)\big(\ddot\theta_d+K_p\theta_e+K_d\dot\theta_e\big)+h(\theta,\dot\theta)$, $\theta_e=\theta_d-\theta$를 쓴다. (1) 오차 동역학이 $\ddot\theta_e+K_d\dot\theta_e+K_p\theta_e=0$이 됨을 보여라. (2) 관절마다 임계 감쇠가 되도록 $K_p$, $K_d$를 고르는 식과, 그 장단점을 설명하라.`,
        sol: R`
(1) 두 식의 $\tau$를 같게 놓으면 $M\ddot\theta+h=M(\ddot\theta_d+K_p\theta_e+K_d\dot\theta_e)+h$. $h$가 지워지고 $M$이 가역이므로 $\ddot\theta=\ddot\theta_d+K_p\theta_e+K_d\dot\theta_e$, 곧 $\ddot\theta_e+K_d\dot\theta_e+K_p\theta_e=0$ — 비선형이던 로봇이 관절마다 독립인 선형 2차계가 됩니다.
(2) $K_p=\omega_n^2$, $K_d=2\zeta\omega_n$이므로 임계 감쇠 $\zeta=1$은 $K_d=2\sqrt{K_p}$. 오버슈트 없이 가장 빨리 수렴하고, $\omega_n$으로 빠르기를 정합니다. 단 $M$, $h$의 모델이 정확해야 하고(오차가 있으면 남는 항이 생겨 적분 항이나 강인 제어가 필요), 매 순간 동역학을 계산해야 합니다.`,
        rubric: R`
- 토크 식을 같게 놓고 $h$ 소거 — 4점
- $M$ 가역으로 오차 동역학 — 4점
- 임계 감쇠 조건 — 3점
- 장단점(모델 의존) — 3점` },
    ],
  },
  );
})();
