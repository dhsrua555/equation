/* 모의고사 — 강의가 진행 중이라 범위를 추정해 만들었습니다. 연습문제와 겹치지 않는 문항, 75분 10문제. */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.exams.push(
  {
    id: 'x1', roman: 'I', kind: '중간고사 범위 (추정)', title: '자유도, 파지, 강체 운동', scopeText: '01–08 단원 · MR 2장, 3장, 12.2절',
    desc: '그뤼블러 공식, C-공간, 마찰 없는·있는 파지와 힘 닫힘, 회전 행렬과 지수 좌표, 동차 변환, 트위스트와 렌치. 강의 범위가 공지되면 맞춰 고치세요.',
    minutes: 75, plot: 'rbCone',
    problems: [
      { ch: 'ch01', type: 'num', lv: 1, pts: 8, q: R`평면 기구가 링크 6개(바닥 포함), 회전 관절 6개, 병진 관절 1개로 이루어져 있다. 그뤼블러 공식의 자유도는?`, ans: '1', ansTex: R`1`,
        sol: R`$3(6-1-7)+7=1$.` },
      { ch: 'ch01', type: 'num', lv: 2, pts: 10, q: R`바닥과 판을 UPU 다리 세 개(다리마다 링크 2개)로 이은 공간 병렬 기구의 그뤼블러 자유도는?`, ans: '3', ansTex: R`3`,
        sol: R`$N=2+6=8$, $J=9$, $\sum f_i=3(2+1+2)=15$: $6(8-1-9)+15=3$.` },
      { ch: 'ch02', type: 'mc', lv: 1, pts: 8, q: R`직선 레일 위를 달리는 수레에 구면 진자(한 점 둘레로 자유롭게 도는 막대 끝의 질점)를 매달았다. C-공간은?`,
        choices: [R`$\mathbb R^1\times S^1$`, R`$\mathbb R^1\times S^2$`, R`$T^3$`, R`$\mathbb R^3$`], ans: 1,
        sol: R`레일 위치 $\mathbb R^1$, 진자 끝의 방향 $S^2$ — 3차원.` },
      { ch: 'ch03', type: 'num', lv: 2, pts: 10, q: R`3단원 예제 1의 못 네 개 배치에서 $\ell_1=0.06$, $\ell_2=0.01$, $\ell_3=-0.02$, $\ell_4=-0.03$이다. 외력 없이 서로 밀어 붙이는 내력 $Ak=0$에서 $k_2/k_1$은?`, ans: '2', ansTex: R`2`,
        sol: R`$k_1(\ell_3-\ell_1)+k_2(\ell_2-\ell_4)=-0.08k_1+0.04k_2=0$ → $k_2/k_1=2$. 곱이 음수라 힘 닫힘입니다.` },
      { ch: 'ch04', type: 'num', lv: 2, pts: 10, q: R`폭 10 cm인 상자의 마주 보는 두 연직 면을 두 손가락이 누르는데 접촉점의 높이 차가 4 cm다. 응우옌 정리로 힘 닫힘이 되는 최소 마찰 계수는?`, ans: '0.4', ansTex: R`0.4`,
        sol: R`두 점을 잇는 선이 법선과 이루는 각의 탄젠트 $4/10$. $\mu>0.4$.` },
      { ch: 'ch05', type: 'num', lv: 2, pts: 8, q: R`$R=\mathrm{Rot}(\hat y,90°)\,\mathrm{Rot}(\hat z,90°)$가 나타내는 회전의 각(도)은?`, ans: '120', ansTex: R`120°`,
        sol: R`$R=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$, $\operatorname{tr}R=0$ → $\cos\theta=-\tfrac12$. 축 $(1,1,1)/\sqrt3$ 둘레 120°.` },
      { ch: 'ch06', type: 'num', lv: 2, pts: 10, q: R`회전 행렬의 대각합이 $1+\sqrt2$이다. 회전각(rad)은?`, ans: 'pi/4', ansTex: R`\pi/4`,
        sol: R`$1+2\cos\theta=1+\sqrt2$ → $\cos\theta=\tfrac{\sqrt2}2$.` },
      { ch: 'ch07', type: 'num', lv: 2, pts: 10, q: R`물체가 점 $(1,2,0)$을 지나는 $\hat z$ 방향 축 둘레로 3 rad/s로 돈다(병진 없음). 공간 트위스트의 $v_s$의 $x$ 성분은?`, ans: '6', ansTex: R`6`,
        sol: R`$v_s=-\omega\times q=-(0,0,3)\times(1,2,0)=-(-6,3,0)=(6,-3,0)$.` },
      { ch: 'ch08', type: 'num', lv: 1, pts: 8, q: R`점 $(0,0.3,0)$ m에 힘 $(10,0,0)$ N이 작용한다. 원점에 대한 렌치의 모멘트 $z$ 성분(N·m)은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$m_z=r_xf_y-r_yf_x=0-0.3(10)=-3$. $x$ 방향 힘이 원점보다 위를 지나 시계 방향 모멘트를 만듭니다.` },
      { ch: 'ch04', type: 'open', lv: 3, pts: 18, proof: true, q: R`한 변이 2인 정사각형 물체($-1\le x,y\le1$)를 두 마찰 손가락이 왼쪽 면의 가운데 $(-1,0)$(법선 $(1,0)$)과 윗면의 가운데 $(0,1)$(법선 $(0,-1)$)에서 누른다. (1) 응우옌 정리로 힘 닫힘에 필요한 마찰 계수 조건을 구하고, (2) $\mu=2$일 때 원뿔 모서리 렌치로 $Ak=0$인 양수 $k$를 실제로 찾아 판정을 확인하세요.`,
        sol: R`
(1) 왼쪽 접촉에서 윗면 접촉으로 가는 방향 $(1,1)/\sqrt2$는 왼쪽 법선 $(1,0)$과 45°, 반대 방향 $(-1,-1)/\sqrt2$는 윗면 법선 $(0,-1)$과 45°를 이룹니다. 선분이 두 원뿔의 내부에 있으려면 $\alpha>45°$, 즉 $\mu>1$.
(2) $\mu=2$: 왼쪽 모서리 $e_1=(1,2)$, $e_2=(1,-2)$, 윗면 모서리 $e_3=(2,-1)$, $e_4=(-2,-1)$.
선을 따라 미는 내력 $f_1=(1,1)$ (왼쪽), $f_2=(-1,-1)$ (윗면)를 모서리로 분해: $f_1=0.75e_1+0.25e_2$, $f_2=0.25e_3+0.75e_4$ — 계수가 모두 양수.
모멘트: $f_1$은 $(-1,0)$에서 $m=(-1)(1)-0=-1$, $f_2$는 $(0,1)$에서 $m=0-(1)(-1)=1$. 합 0 → $k=(0.75,0.25,0.25,0.75)$로 $Ak=0$.
계수: 네 작용선은 $(-1,0)$을 지나는 두 직선과 $(0,1)$을 지나는 두 직선이라 한 점에서 만나지도, 모두 평행하지도 않음 → 계수 3. 따라서 힘 닫힘.`,
        rubric: R`
- 선분과 법선의 각, 조건 $\mu>1$ — 5점
- 모서리 벡터와 내력의 분해(양의 계수) — 6점
- 모멘트 합 0 확인 — 3점
- 계수 3 논증과 결론 — 4점` },
    ],
  },
  {
    id: 'x2', roman: 'II', kind: '기말고사 범위 (추정)', title: '기구학, 동역학, 궤적', scopeText: '09–14 단원 · MR 4–6장, 8.1절, 9장',
    desc: '지수곱 정기구학, 야코비안, 정역학과 특이점, 조작성, 역기구학, 라그랑주 동역학, 시간 스케일링. 교재 순서를 따른 추정 범위입니다.',
    minutes: 75, plot: 'rbManip',
    problems: [
      { ch: 'ch09', type: 'num', lv: 1, pts: 8, q: R`$L_1=L_2=L_3=1$인 평면 3R 팔이 $\theta=(\pi/3,-\pi/3,\pi/2)$일 때 끝점의 $y$ 좌표는?`, ans: 'sin(pi/3)+0+sin(pi/2)', ansTex: R`1.866`,
        sol: R`$s_1+s_{12}+s_{123}=0.866+0+1$.` },
      { ch: 'ch09', type: 'num', lv: 2, pts: 10, q: R`$L_1=0.4$, $L_2=0.3$인 평면 3R 팔(영 자세에서 $\hat x_s$ 방향으로 폄)의 $\mathcal S_3$에서 $v$의 $y$ 성분은?`, ans: '-0.7', ansTex: R`-0.7`,
        sol: R`$q_3=(0.7,0,0)$, $v=-\hat z\times q_3=(0,-0.7,0)$.` },
      { ch: 'ch10', type: 'num', lv: 1, pts: 10, q: R`$L_1=1$, $L_2=0.8$인 2R 팔이 $\theta_2=\pi/3$일 때 $\det J$는?`, ans: '0.8*sin(pi/3)', ansTex: R`0.693`,
        sol: R`$L_1L_2\sin\theta_2$.` },
      { ch: 'ch10', type: 'num', lv: 1, pts: 8, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(\pi/2,0)$이고 $\dot\theta=(1,1)$이다. 끝점 속도의 $x$ 성분은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$J=\begin{bmatrix}-2&-1\\0&0\end{bmatrix}$ → $\dot x=-3$, $\dot y=0$(곧게 편 특이 자세라 $y$ 방향 속도를 못 냄).` },
      { ch: 'ch11', type: 'num', lv: 2, pts: 10, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(\pi/2,-\pi/2)$ (끝점 $(1,1)$)에서 아래로 $f=(0,-10)$ N을 누른다. $\tau_2$ (N·m)는?`, ans: '-10', ansTex: R`-10`,
        sol: R`$J=\begin{bmatrix}-1&0\\1&1\end{bmatrix}$, $\tau=J^Tf=(-10,-10)$. 관절 2 $(0,1)$에서 끝점까지 수평 거리 1.` },
      { ch: 'ch11', type: 'num', lv: 3, pts: 10, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(0,\pi/3)$일 때 조작성 지표 $\mu_1=\sqrt{\lambda_{\max}/\lambda_{\min}}$은?`, ans: 'sqrt((2+sqrt(3.25))/(2-sqrt(3.25)))', ansTex: R`4.39`,
        sol: R`$J=\begin{bmatrix}-0.866&-0.866\\1.5&0.5\end{bmatrix}$, $A=JJ^T=\begin{bmatrix}1.5&-1.732\\-1.732&2.5\end{bmatrix}$. $\operatorname{tr}=4$, $\det=0.75$ → $\lambda=2\pm1.803$. $\mu_1=\sqrt{3.803/0.197}=4.39$.` },
      { ch: 'ch12', type: 'num', lv: 2, pts: 10, q: R`$L_1=1$, $L_2=0.8$인 2R 팔이 목표 $(1.2,0.6)$에 닿는 해 중 $\theta_2>0$인 것의 $\theta_2$ (rad)는?`, ans: 'acos(0.1)', ansTex: R`1.471`,
        sol: R`$\cos\theta_2=(1.44+0.36-1-0.64)/1.6=0.1$.` },
      { ch: 'ch13', type: 'num', lv: 2, pts: 8, q: R`끝에 점질량이 있는 2R 팔($m_1=2$ kg, $m_2=1$ kg, $L_1=L_2=1$ m)의 $\theta_2=\pi/2$에서 $m_{11}$ (kg·m²)은?`, ans: '4', ansTex: R`4`,
        sol: R`$m_1L_1^2+m_2(L_1^2+2L_1L_2c_2+L_2^2)=2+2=4$.` },
      { ch: 'ch14', type: 'num', lv: 1, pts: 8, q: R`관절 하나를 5차 다항식 스케일링으로 $T=3$ s 동안 1.2 rad 움직인다. 최대 관절 속도(rad/s)는?`, ans: '1.2*15/(8*3)', ansTex: R`0.75`,
        sol: R`$1.2\times\dfrac{15}{8T}=0.75$.` },
      { ch: 'ch10', type: 'open', lv: 3, pts: 18, proof: true, q: R`바닥이 $\hat z$ 둘레로 도는 회전 관절($\theta_1$) 위에 팔 방향으로 늘어나는 병진 관절($\theta_2$)이 있는 평면 RP 팔(영 자세 끝점 $(L_0,0,0)$). (1) 공간 야코비안의 두 열을 구하고, (2) 끝점 위치 $p$의 속도 $\dot p=J_p\dot\theta$의 $2\times2$ 행렬 $J_p$를 구해 특이점을 찾고 그 뜻을 설명하세요.`,
        sol: R`
(1) $J_{s1}=\mathcal S_1=(0,0,1,0,0,0)$. $J_{s2}=[\mathrm{Ad}_{e^{[\mathcal S_1]\theta_1}}]\mathcal S_2$: 병진 방향 $(1,0,0)$이 $\theta_1$만큼 돌아 $(0,0,0,\cos\theta_1,\sin\theta_1,0)$.
(2) $r=L_0+\theta_2$, $p=(r\cos\theta_1,r\sin\theta_1)$. $\dot p=v_s+\omega_s\times p$에서 관절 1의 기여 $\dot\theta_1\hat z\times p=\dot\theta_1(-r\sin\theta_1,r\cos\theta_1)$, 관절 2의 기여 $\dot\theta_2(\cos\theta_1,\sin\theta_1)$.
$J_p=\begin{bmatrix}-r\sin\theta_1&\cos\theta_1\\r\cos\theta_1&\sin\theta_1\end{bmatrix}$, $\det J_p=-r$.
특이점: $r=L_0+\theta_2=0$, 끝점이 회전축 위에 올 때. 그곳에서는 관절 1을 돌려도 끝점이 움직이지 않아 원주 방향 속도를 낼 수 없습니다. 공간 야코비안(트위스트)은 두 열이 늘 독립이지만, 끝점 “위치”만 볼 때 생기는 특이점입니다.`,
        rubric: R`
- 공간 야코비안 두 열 — 5점
- 끝점 속도의 두 기여 — 5점
- 행렬식과 특이 조건 — 4점
- 물리적 해석 — 4점` },
    ],
  },
  );
})();
