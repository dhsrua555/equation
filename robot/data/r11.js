/* 11 정역학, 특이점, 조작성 — MR 5.2–5.4 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 11, part: 'C', title: '정역학, 특이점, 조작성', en: 'Statics, Singularities & Manipulability', ref: 'MR 5.2–5.4', plot: 'rbManip',
    fig: R`2R 팔의 조작성 타원: 팔을 펴 갈수록 타원이 납작해지다 특이점에서 선분이 된다`,
    tagline: R`야코비안의 전치는 끝점의 힘을 관절 토크로 옮깁니다. 야코비안이 계수를 잃는 자세가 특이점이고, 그 근처에서 속도와 힘의 능력이 한쪽으로 쏠립니다.`,
    summary: R`관절이 한 일률과 끝점이 한 일률이 같다는 것($\tau^T\dot\theta=\mathcal F^T\mathcal V$)에서 **정역학 관계** $\tau=J^T(\theta)\mathcal F$가 나옵니다 — 끝점이 환경에 렌치 $\mathcal F$를 가하려면 필요한 관절 토크입니다. $J(\theta)$의 계수가 최대보다 작아지는 자세가 **기구학적 특이점**입니다: 어떤 방향으로는 끝점 속도를 낼 수 없고, 거꾸로 그 방향의 힘은 관절 토크 없이 버팁니다. 특이점은 좌표계 선택과 무관한 팔의 성질입니다(2R 팔의 $\theta_2=0,\pi$). 특이점에 얼마나 가까운지는 **조작성 타원체**로 봅니다: 단위 관절 속도가 만드는 끝점 속도는 $\mathcal V^T(JJ^T)^{-1}\mathcal V\le1$인 타원체이고, 반축은 $A=JJ^T$의 고윳값 제곱근입니다. 가장 긴 축과 짧은 축의 비 $\mu_1$, 부피 $\mu_3=\sqrt{\det A}$로 수치화하며, 힘의 타원체는 축이 역수로 바뀝니다.`,
    goals: [
      R`일률의 같음에서 $\tau=J^T\mathcal F$를 유도하고 계산할 수 있다`,
      R`야코비안의 계수로 특이점을 판정할 수 있다`,
      R`특이점에서 속도와 힘에 무슨 일이 생기는지 설명할 수 있다`,
      R`조작성 타원체의 축과 조작성 지표를 계산할 수 있다`,
      R`속도 타원체와 힘 타원체의 관계를 설명할 수 있다`,
    ],
    secTitles: { '5.2': '열린 사슬의 정역학', '5.3': '특이점', '5.4': '조작성' },
    sections: [
      { k: '5.2', p: 190, title: '열린 사슬의 정역학', body: R`
마찰과 중력을 무시하면(또는 따로 더하면) 관절이 공급하는 일률은 끝점이 환경에 하는 일률과 같습니다: $\tau^T\dot\theta=\mathcal F^T\mathcal V=\mathcal F^TJ\dot\theta$. 모든 $\dot\theta$에 대해 성립하므로:

:::key 정역학 관계
$$\tau=J^T(\theta)\,\mathcal F\qquad(\tau=J_b^T\mathcal F_b=J_s^T\mathcal F_s)$$
$\mathcal F$는 끝점이 환경에 가하는 렌치(같은 좌표계의 야코비안과 짝을 맞춤). 평면 팔에서 끝점 힘만 보면 $\tau=J^Tf$ ($J$는 $2\times n$ 선속도 야코비안).
:::

:::ex 예제 1
$L_1=L_2=1$인 2R 팔이 $\theta=(0,\pi/2)$(끝점 $(1,1)$)에서 아래로 $f=(0,-10)$ N을 누르려면 관절 토크는?
---
$J=\begin{bmatrix}-1&-1\\1&0\end{bmatrix}$, $\tau=J^Tf=\begin{bmatrix}-1&1\\-1&0\end{bmatrix}\begin{bmatrix}0\\-10\end{bmatrix}=(-10,0)$ N·m.
관절 2는 끝점 바로 아래 $(1,0)$에 있어 연직 힘의 팔이 0이라 토크가 필요 없습니다. 관절 1의 토크는 $1\times(-10)$ — 정역학의 모멘트와 같습니다.
:::

:::note 거꾸로는?
$J$가 정사각이고 가역이면 $\mathcal F=J^{-T}\tau$로 관절 토크에서 끝점 힘을 얻습니다. 관절이 끝점 자유도보다 많으면(여유 팔) 끝점 힘을 바꾸지 않는 토크, 곧 $J^T$의 영공간 밖의 “내부 운동”이 생깁니다.
:::
` },
      { k: '5.3', p: 191, title: '기구학적 특이점', body: R`
:::key 기구학적 특이점
$\operatorname{rank}J(\theta)<\min(6,n)$ (평면 팔은 3 또는 끝점 자유도)인 자세. 이때
- 어떤 방향으로는 관절을 어떻게 움직여도 끝점 속도를 낼 수 없다(속도의 차원 손실).
- 그 방향의 렌치는 $J^T\mathcal F=0$이라 관절 토크 없이 버틴다.
$J_s$와 $J_b$는 가역 행렬 $[\mathrm{Ad}_{T_{sb}}]$로 이어져 계수가 같으므로, 특이점은 좌표계 선택과 무관하다.
:::

:::ex 예제 2 — 2R 팔의 특이점
$\det J=L_1L_2\sin\theta_2=0$ → $\theta_2=0$(곧게 폄) 또는 $\pi$(완전히 접음). 곧게 편 팔은 팔 방향으로 끝점을 움직일 수 없고, 팔 방향으로 미는 힘은 관절 토크 없이 링크가 받칩니다. 작업 공간의 경계(2단원 고리의 안팎 원)와 정확히 겹칩니다.
:::

:::ex 예제 3 — 평면 3R 팔
평면 3R 팔(끝점의 $\omega_z,v_x,v_y$만 보면 $3\times3$)은 언제 특이한가?
---
$\omega_z,v_x,v_y$ 행만 모은 $J_s$의 행렬식을 계산하면 $L_1L_2\sin\theta_2$ — 관절 3과 무관합니다. 예를 들어 $\theta_1=\theta_2=0$에서 $J_s$의 $v_x$ 행이 0이 되어 계수 2: 관절 1, 2, 3이 한 직선 위에 놓여 그 직선 방향 속도를 낼 수 없습니다.
:::

공간 팔의 대표적인 특이점: 두 회전축이 한 직선 위에 놓일 때(두 열이 같은 나사), 평행한 세 회전축이 한 평면에 놓일 때, 네 회전축이 한 점에서 만날 때(구면 손목의 짐벌 잠김이 이 경우).
` },
      { k: '5.4', p: 196, title: '조작성 타원체', body: R`
특이점에서 멀고 가까운 정도를 봅니다. 단위 원(구) $\lVert\dot\theta\rVert=1$의 관절 속도가 만드는 끝점 속도의 집합은 $\dot\theta=J^T(JJ^T)^{-1}\mathcal V$ (최소 노름 해)를 넣어 계산하면 타원체입니다.

:::fig rManip
:::

:::key 조작성 타원체와 지표
$$\mathcal V^T(JJ^T)^{-1}\mathcal V\le1,\qquad A=JJ^T$$
반축: $A$의 고유벡터 방향으로 길이 $\sqrt{\lambda_i}$.
- $\mu_1=\sqrt{\lambda_{\max}/\lambda_{\min}}\ge1$: 등방성(1이면 원).
- $\mu_2=\lambda_{\max}/\lambda_{\min}$: $A$의 조건수.
- $\mu_3=\sqrt{\lambda_1\lambda_2\cdots}=\sqrt{\det A}$: 부피에 비례.
**힘 타원체** $f^T(JJ^T)f\le1$은 같은 축을 갖되 반축이 $1/\sqrt{\lambda_i}$ — 속도를 잘 내는 방향으로는 힘을 잘 못 낸다.
:::

:::ex 예제 4
$L_1=L_2=1$인 2R 팔이 $\theta=(0,\pi/2)$일 때 조작성 지표는?
---
$J=\begin{bmatrix}-1&-1\\1&0\end{bmatrix}$, $A=JJ^T=\begin{bmatrix}2&-1\\-1&1\end{bmatrix}$. $\operatorname{tr}A=3$, $\det A=1$ → $\lambda=\dfrac{3\pm\sqrt5}2=2.618,\ 0.382$.
$\mu_1=\sqrt{2.618/0.382}=2.618$, $\mu_3=\sqrt1=1$.
2R 팔은 $\mu_3=\lvert\det J\rvert=L_1L_2\lvert\sin\theta_2\rvert$이라 $\theta_2=\pm90°$에서 부피가 최대입니다.
:::
` },
    ],
    problems: [
      { sec: '5.2', type: 'num', lv: 1, q: R`$L_1=L_2=1$인 2R 팔이 $\theta=(0,\pi/2)$에서 끝점으로 $f=(0,-10)$ N을 가하려면 $\tau_1$ (N·m)은?`, ans: '-10', ansTex: R`-10`,
        sol: R`$\tau=J^Tf=(-10,0)$.` },
      { sec: '5.2', type: 'num', lv: 2, q: R`같은 자세에서 $f=(5,0)$ N을 가하려면 $\tau_2$ (N·m)는?`, ans: '-5', ansTex: R`-5`,
        sol: R`$J^T=\begin{bmatrix}-1&1\\-1&0\end{bmatrix}$ → $\tau=(-5,-5)$.` },
      { sec: '5.2', type: 'mc', lv: 1, q: R`$\tau=J^T\mathcal F$의 근거는?`,
        choices: [R`뉴턴의 제2법칙`, R`관절이 공급하는 일률과 끝점이 하는 일률이 같다는 것`, R`야코비안이 대칭이라는 것`, R`특이점이 없다는 가정`], ans: 1,
        sol: R`$\tau^T\dot\theta=\mathcal F^TJ\dot\theta$가 모든 $\dot\theta$에 대해 성립.` },
      { sec: '5.3', type: 'mc', lv: 1, q: R`평면 2R 팔의 특이점은?`,
        choices: [R`$\theta_1=0$`, R`$\theta_2=0$ 또는 $\pi$`, R`$\theta_2=\pi/2$`, R`특이점이 없다`], ans: 1,
        sol: R`$\det J=L_1L_2\sin\theta_2=0$.` },
      { sec: '5.3', type: 'mc', lv: 2, q: R`특이점에 대해 옳은 것은?`,
        choices: [R`{s}를 어디에 두느냐에 따라 달라진다`, R`$J_s$와 $J_b$의 계수가 같으므로 좌표계 선택과 무관하다`, R`물체 야코비안에서만 정의된다`, R`관절 토크가 무한대가 되는 자세다`], ans: 1,
        sol: R`$J_s=[\mathrm{Ad}_{T_{sb}}]J_b$이고 수반 행렬은 가역입니다.` },
      { sec: '5.3', type: 'num', lv: 2, q: R`평면 3R 팔($L_1=L_2=1$)이 $\theta=(0,0,\theta_3)$일 때 $(\omega_z,v_x,v_y)$ 행으로 만든 $3\times3$ 야코비안의 계수는?`, ans: '2', ansTex: R`2`,
        sol: R`$v_x$ 행 $(0,L_1s_1,L_1s_1+L_2s_{12})=(0,0,0)$ — 계수 2.` },
      { sec: '5.3', type: 'mc', lv: 2, q: R`곧게 편 2R 팔을 팔 방향으로 미는 힘에 대해 옳은 것은?`,
        choices: [R`무한한 관절 토크가 필요하다`, R`관절 토크 없이 링크가 버틴다`, R`버틸 수 없다`, R`관절 2의 토크만 필요하다`], ans: 1,
        sol: R`그 방향 $f$에 대해 $J^Tf=0$입니다.` },
      { sec: '5.4', type: 'num', lv: 1, q: R`$L_1=L_2=1$인 2R 팔이 $\theta_2=\pi/2$일 때 조작성 지표 $\mu_3=\sqrt{\det(JJ^T)}$는?`, ans: '1', ansTex: R`1`,
        sol: R`$\lvert\det J\rvert=L_1L_2\lvert\sin\theta_2\rvert=1$.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`같은 팔이 $\theta=(0,\pi/2)$일 때 $A=JJ^T$의 가장 큰 고윳값은?`, ans: '(3+sqrt(5))/2', ansTex: R`2.618`,
        sol: R`$\operatorname{tr}A=3$, $\det A=1$.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`같은 자세의 $\mu_1=\sqrt{\lambda_{\max}/\lambda_{\min}}$은?`, ans: 'sqrt(((3+sqrt(5))/2)/((3-sqrt(5))/2))', ansTex: R`2.618`,
        sol: R`$\sqrt{2.618/0.382}=2.618$.` },
      { sec: '5.4', type: 'num', lv: 2, q: R`$L_1=1$, $L_2=0.5$인 2R 팔에서 $\mu_3$의 최댓값은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$L_1L_2\lvert\sin\theta_2\rvert$의 최대 $=0.5$ ($\theta_2=\pm90°$).` },
      { sec: '5.4', type: 'mc', lv: 2, q: R`속도 타원체와 힘 타원체의 관계로 옳은 것은?`,
        choices: [R`같은 타원체다`, R`축 방향은 같고 반축의 길이가 서로 역수다`, R`축이 서로 수직이다`, R`힘 타원체는 항상 원이다`], ans: 1,
        sol: R`속도는 $JJ^T$, 힘은 $(JJ^T)^{-1}$로 정해집니다. 빠르게 움직일 수 있는 방향으로는 힘을 적게 냅니다(지렛대).` },
      { sec: '5.2', type: 'open', lv: 2, proof: true, q: R`(1) 일률의 같음에서 $\tau=J^T\mathcal F$를 유도하세요. (2) $J$의 계수가 떨어진 특이점에서 $J^T\mathcal F=0$인 0이 아닌 렌치가 있음을 보이고 그 물리적 뜻을 설명하세요.`,
        sol: R`
(1) 관절 일률 $\tau^T\dot\theta$, 끝점이 환경에 하는 일률 $\mathcal F^T\mathcal V=\mathcal F^TJ\dot\theta$. 정적(또는 준정적)이고 손실이 없으면 둘이 같습니다: $(\tau-J^T\mathcal F)^T\dot\theta=0$이 모든 $\dot\theta$에 대해 성립하므로 $\tau=J^T\mathcal F$.
(2) $J$가 $m\times n$이고 계수 $r<m$이면 $J$의 열 공간은 $\mathbb R^m$의 진부분공간이라 그 직교 여공간에 0이 아닌 $\mathcal F$가 있습니다: 모든 열과 수직 → $J^T\mathcal F=0$.
뜻: 이 방향의 렌치는 관절 토크 없이 구조가 버팁니다. 동시에 $\mathcal F^T\mathcal V=\mathcal F^TJ\dot\theta=0$이라 이 방향으로는 끝점 속도를 낼 수 없습니다 — 속도를 잃은 방향이 곧 공짜로 버티는 힘의 방향입니다.`,
        rubric: R`
- 일률의 같음과 임의의 관절 속도 — 4점
- 계수 부족에서 직교 여공간의 벡터 — 3점
- 속도 손실과 힘 버팀의 대응 — 3점` },
    ],
  });
})();
