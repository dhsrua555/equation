/* 13 라그랑주 동역학 — MR 8.1 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 13, part: 'C', title: '로봇의 라그랑주 동역학', en: 'Lagrangian Dynamics of Robots', ref: 'MR 8.1', plot: 'rbDynamics',
    fig: R`토크 없이 풀어 놓은 2R 팔(이중 진자)의 끝점이 그리는 궤적. 작은 차이가 금세 벌어진다`,
    tagline: R`운동에너지와 위치에너지만 관절각으로 쓰면 나머지는 미분이 해 줍니다. 결과는 늘 같은 모양: 질량 행렬, 속도의 제곱 항, 중력 항.`,
    summary: R`관절각 $\theta$를 일반화 좌표로 삼고 라그랑지안 $\mathcal L=\mathcal K-\mathcal P$를 쓰면, 관절 토크는 $\tau=\dfrac{d}{dt}\dfrac{\partial\mathcal L}{\partial\dot\theta}-\dfrac{\partial\mathcal L}{\partial\theta}$입니다(회전 관절의 일반화 힘은 토크, 병진 관절은 힘). 링크를 잇는 구속력은 일을 하지 않아 식에서 빠집니다. 운동에너지는 관절 속도의 이차 형식 $\mathcal K=\tfrac12\dot\theta^TM(\theta)\dot\theta$라 결과는 언제나 $\tau=M(\theta)\ddot\theta+c(\theta,\dot\theta)+g(\theta)$ 꼴입니다. **질량 행렬** $M$은 대칭 양의 정부호이고 자세에 따라 변합니다. $c$는 속도의 곱($\dot\theta_i\dot\theta_j$: 코리올리 항, $\dot\theta_i^2$: 원심 항)으로 이루어지며 크리스토펠 기호 $\Gamma_{ijk}=\tfrac12\big(\partial_km_{ij}+\partial_jm_{ik}-\partial_im_{jk}\big)$로 $M$에서 곧바로 나옵니다. $g$는 위치에너지의 기울기입니다. 2R 팔(끝에 점질량)에서 모든 항을 손으로 구할 수 있습니다.`,
    goals: [
      R`관절각을 일반화 좌표로 라그랑지안을 쓰고 오일러-라그랑주 방정식을 적용할 수 있다`,
      R`2R 팔의 질량 행렬, 속도 항, 중력 항을 유도할 수 있다`,
      R`동역학 방정식의 표준형 $M\ddot\theta+c+g=\tau$의 각 항을 설명할 수 있다`,
      R`크리스토펠 기호로 질량 행렬에서 속도 항을 계산할 수 있다`,
      R`질량 행렬의 성질과 자세에 따른 겉보기 질량의 변화를 설명할 수 있다`,
    ],
    secTitles: { '8.1': '라그랑주 방정식과 2R 팔', '8.1.2': '일반형과 크리스토펠 기호', '8.1.3': '질량 행렬의 뜻' },
    sections: [
      { k: '8.1', p: 272, title: '라그랑주 방정식과 2R 팔', body: R`
동역학에서 배운 라그랑주 방정식[[@dyn:ch08:6.2b|라그랑지안 L = T − V와 오일러-라그랑주 방정식. 구속력이 식에서 사라집니다.]]을 로봇에 쓰면, 일반화 좌표는 관절 변수 $\theta$이고 일반화 힘은 관절 토크(병진 관절이면 힘) $\tau$입니다.

:::key 로봇의 라그랑주 방정식
$$\mathcal L(\theta,\dot\theta)=\mathcal K(\theta,\dot\theta)-\mathcal P(\theta),\qquad\tau_i=\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\theta_i}-\frac{\partial\mathcal L}{\partial\theta_i}$$
링크 사이의 구속력은 가상 일을 하지 않아 나타나지 않는다.
:::

:::fig rTwoR
:::

:::ex 예제 1 — 2R 팔(끝에 점질량)
링크 1 끝에 $m_1$, 링크 2 끝에 $m_2$가 있고 링크 질량은 무시한다. 중력은 $-\hat y$. 운동 방정식은?
---
$m_1$의 위치 $(L_1c_1,L_1s_1)$ → 속력² $L_1^2\dot\theta_1^2$.
$m_2$의 위치 $(L_1c_1+L_2c_{12},L_1s_1+L_2s_{12})$ → 속력² $L_1^2\dot\theta_1^2+L_2^2(\dot\theta_1+\dot\theta_2)^2+2L_1L_2c_2\dot\theta_1(\dot\theta_1+\dot\theta_2)$.
$\mathcal P=m_1gL_1s_1+m_2g(L_1s_1+L_2s_{12})$.
미분해 정리하면 $\tau=M\ddot\theta+c+g$:
$$M=\begin{bmatrix}m_1L_1^2+m_2(L_1^2+2L_1L_2c_2+L_2^2)&m_2(L_1L_2c_2+L_2^2)\\m_2(L_1L_2c_2+L_2^2)&m_2L_2^2\end{bmatrix}$$
$$c=\begin{bmatrix}-m_2L_1L_2s_2(2\dot\theta_1\dot\theta_2+\dot\theta_2^2)\\m_2L_1L_2s_2\dot\theta_1^2\end{bmatrix},\qquad g=\begin{bmatrix}(m_1+m_2)L_1g\,c_1+m_2gL_2c_{12}\\m_2gL_2c_{12}\end{bmatrix}$$
:::

:::ex 예제 2 — 멈춰 있는 팔
$m_1=m_2=1$ kg, $L_1=L_2=1$ m인 팔을 수평으로 편 채($\theta=(0,0)$) 멈춰 두는 토크는?
---
$\dot\theta=\ddot\theta=0$ → $\tau=g(\theta)$: $\tau_1=(2)(1)(9.81)+9.81=29.4$ N·m, $\tau_2=9.81$ N·m. 정역학의 모멘트 $m_1gL_1+m_2g(L_1+L_2)$와 같습니다.
:::
` },
      { k: '8.1.2', p: 277, title: '일반형: 질량 행렬, 속도 항, 중력 항', body: R`
각 링크의 운동에너지는 관절 속도의 이차식이므로 전체는 $\mathcal K=\tfrac12\dot\theta^TM(\theta)\dot\theta=\tfrac12\sum_{i,j}m_{ij}(\theta)\dot\theta_i\dot\theta_j$입니다. 이것을 라그랑주 방정식에 넣으면:

:::key 동역학의 표준형
$$\tau=M(\theta)\ddot\theta+c(\theta,\dot\theta)+g(\theta),\qquad g_i=\frac{\partial\mathcal P}{\partial\theta_i}$$
$$c_i=\sum_{j,k}\Gamma_{ijk}(\theta)\dot\theta_j\dot\theta_k,\qquad\Gamma_{ijk}=\frac12\Big(\frac{\partial m_{ij}}{\partial\theta_k}+\frac{\partial m_{ik}}{\partial\theta_j}-\frac{\partial m_{jk}}{\partial\theta_i}\Big)$$
$\Gamma_{ijk}$는 크리스토펠 기호. $\dot\theta_j\dot\theta_k$ ($j\ne k$) 항은 코리올리 항, $\dot\theta_j^2$ 항은 원심 항. 행렬로 $c=C(\theta,\dot\theta)\dot\theta$, $C_{ij}=\sum_k\Gamma_{ijk}\dot\theta_k$로 쓰면 $\dot M-2C$는 반대칭이다.
:::

:::ex 예제 3 — 2R 팔의 크리스토펠 기호
예제 1의 $M$은 $\theta_2$에만 의존합니다: $\partial m_{11}/\partial\theta_2=-2m_2L_1L_2s_2$, $\partial m_{12}/\partial\theta_2=-m_2L_1L_2s_2$, $\partial m_{22}/\partial\theta_2=0$.
---
$\Gamma_{112}=\Gamma_{121}=\tfrac12\partial_2m_{11}=-m_2L_1L_2s_2$, $\Gamma_{122}=\partial_2m_{12}=-m_2L_1L_2s_2$, $\Gamma_{111}=0$.
$\Gamma_{211}=-\tfrac12\partial_2m_{11}=m_2L_1L_2s_2$, $\Gamma_{212}=\Gamma_{221}=\Gamma_{222}=0$.
$c_1=2\Gamma_{112}\dot\theta_1\dot\theta_2+\Gamma_{122}\dot\theta_2^2=-m_2L_1L_2s_2(2\dot\theta_1\dot\theta_2+\dot\theta_2^2)$, $c_2=\Gamma_{211}\dot\theta_1^2=m_2L_1L_2s_2\dot\theta_1^2$ — 예제 1과 같습니다.
:::

:::note 뉴턴-오일러 방법과의 비교
라그랑주 방법은 에너지만 쓰므로 식을 세우기 쉽고 구조($M$, $c$, $g$)가 잘 보입니다. 링크마다 힘과 모멘트를 주고받는 뉴턴-오일러 방법(MR 8.3)은 계산이 관절 수에 비례해 빠르고 관절 반력도 알려 주어, 실시간 제어에는 주로 그쪽을 씁니다. 두 방법의 결과는 같습니다.
:::
` },
      { k: '8.1.3', p: 279, title: '질량 행렬의 뜻', body: R`
:::key 질량 행렬의 성질
- 대칭이고 양의 정부호: 움직이는 한 운동에너지 $\tfrac12\dot\theta^TM\dot\theta>0$.
- 자세에 따라 변한다: 같은 토크라도 팔을 펴면 첫 관절이 느리게 가속한다(2R: $m_{11}$이 $\theta_2=0$에서 최대).
- 끝점에서 느끼는 겉보기 질량은 방향마다 다르다: 가역인 $J$에 대해 $\Lambda(\theta)=J^{-T}MJ^{-1}$, 방향 $u$로 밀 때의 유효 질량은 $u^T\Lambda u$ 꼴의 이차 형식.
:::

관절 공간의 관성 행렬은 동역학 3차원 강체의 관성 행렬[[@dyn:ch14:18.2|강체의 관성 행렬: 각속도와 각운동량을 잇는 대칭 양의 정부호 행렬.]]과 같은 역할을 합니다: 속도에서 운동량을, 가속도에서 힘을 만듭니다. 대각 성분이 아닌 $m_{12}$는 한 관절의 가속이 다른 관절에 토크를 요구하는 결합을 나타냅니다.

:::ex 예제 4 — 수평면의 팔
예제 1의 팔($m_1=m_2=L_1=L_2=1$)을 수평면에 눕혀(중력 효과 없음) $\theta=(0,\pi/2)$에서 정지 상태로 두고 $\tau=(1,0)$을 준다. 순간 각가속도는?
---
$c_2=0$ → $M=\begin{bmatrix}3&1\\1&1\end{bmatrix}$, $c=0$(정지), $g=0$.
$\ddot\theta=M^{-1}\tau=\tfrac12\begin{bmatrix}1&-1\\-1&3\end{bmatrix}\begin{bmatrix}1\\0\end{bmatrix}=(0.5,-0.5)$. 관절 2에는 토크를 주지 않았는데도 반대로 가속합니다 — 결합 항 $m_{12}$ 때문입니다.
:::
` },
    ],
    problems: [
      { sec: '8.1', type: 'num', lv: 1, q: R`한 관절 팔 끝(축에서 0.5 m)에 2 kg 점질량이 있다. 팔을 수평으로 멈춰 두는 토크(N·m)는?`, ans: '2*9.81*0.5', ansTex: R`9.81`,
        sol: R`$\tau=\partial\mathcal P/\partial\theta=mgl\cos\theta$, $\theta=0$에서 $9.81$.` },
      { sec: '8.1', type: 'num', lv: 2, q: R`예제 1의 2R 팔($m_1=m_2=1$ kg, $L_1=L_2=1$ m)을 $\theta=(0,0)$에 멈춰 두는 $\tau_1$ (N·m)은?`, ans: '2*9.81+9.81', ansTex: R`29.4`,
        sol: R`$(m_1+m_2)gL_1+m_2gL_2$.` },
      { sec: '8.1', type: 'num', lv: 2, q: R`같은 팔을 $\theta=(0,\pi/2)$에 멈춰 두는 $\tau_1$ (N·m)은?`, ans: '2*9.81', ansTex: R`19.6`,
        sol: R`$c_{12}=0$ → $\tau_1=(m_1+m_2)gL_1=19.6$, $\tau_2=0$.` },
      { sec: '8.1', type: 'num', lv: 1, q: R`같은 팔의 $\theta_2=0$에서 $m_{11}$ (kg·m²)은?`, ans: '5', ansTex: R`5`,
        sol: R`$1+(1+2+1)=5$.` },
      { sec: '8.1.2', type: 'num', lv: 1, q: R`같은 팔의 $\theta_2=\pi/2$에서 $m_{12}$는?`, ans: '1', ansTex: R`1`,
        sol: R`$m_2(L_1L_2c_2+L_2^2)=0+1$.` },
      { sec: '8.1.2', type: 'num', lv: 2, q: R`같은 팔이 $\theta_2=\pi/2$, $\dot\theta=(1,1)$일 때 $c_1$은?`, ans: '-3', ansTex: R`-3`,
        sol: R`$-m_2L_1L_2s_2(2+1)=-3$.` },
      { sec: '8.1.2', type: 'num', lv: 2, q: R`같은 팔이 $\theta_2=\pi/2$, $\dot\theta_1=2$일 때 $c_2$는?`, ans: '4', ansTex: R`4`,
        sol: R`$m_2L_1L_2s_2\dot\theta_1^2=4$ — 첫 관절이 돌 때 둘째 링크를 바깥으로 던지는 원심 효과.` },
      { sec: '8.1.2', type: 'mc', lv: 1, q: R`질량 행렬 $M(\theta)$가 양의 정부호인 이유는?`,
        choices: [R`대칭이라서`, R`움직이는 한 운동에너지 $\tfrac12\dot\theta^TM\dot\theta$가 양수라서`, R`중력 때문에`, R`관절이 회전형이라서`], ans: 1,
        sol: R`질량이 있는 물체가 움직이면 운동에너지는 0보다 큽니다.` },
      { sec: '8.1.2', type: 'mc', lv: 2, q: R`속도 항 $c(\theta,\dot\theta)$에서 $\dot\theta_1\dot\theta_2$ 꼴의 항을 부르는 이름은?`,
        choices: [R`원심 항`, R`코리올리 항`, R`중력 항`, R`마찰 항`], ans: 1,
        sol: R`서로 다른 관절 속도의 곱은 코리올리 항, 같은 관절 속도의 제곱은 원심 항입니다.` },
      { sec: '8.1.3', type: 'num', lv: 2, q: R`수평면에 눕힌 같은 팔이 $\theta=(0,\pi/2)$에서 정지해 있고 $\tau=(1,0)$을 받는다. $\ddot\theta_2$는?`, ans: '-0.5', ansTex: R`-0.5`,
        sol: R`$M^{-1}(1,0)^T=(0.5,-0.5)$.` },
      { sec: '8.1', type: 'mc', lv: 2, q: R`라그랑주 방법으로 로봇 동역학을 세울 때 링크 사이의 구속력이 나타나지 않는 이유는?`,
        choices: [R`구속력이 0이라서`, R`관절각을 일반화 좌표로 쓰면 구속이 자동으로 만족되고, 구속력은 가상 변위에 일을 하지 않아서`, R`중력과 상쇄되어서`, R`질량 행렬에 포함되어서`], ans: 1,
        sol: R`관절 반력이 필요하면 뉴턴-오일러 방법을 씁니다.` },
      { sec: '8.1', type: 'open', lv: 2, proof: true, q: R`예제 1의 2R 팔에 대해 운동에너지와 위치에너지를 쓰고, 라그랑주 방정식으로 $\tau_2=m_2(L_1L_2c_2+L_2^2)\ddot\theta_1+m_2L_2^2\ddot\theta_2+m_2L_1L_2s_2\dot\theta_1^2+m_2gL_2c_{12}$를 유도하세요.`,
        sol: R`
$\mathcal K=\tfrac12(m_1+m_2)L_1^2\dot\theta_1^2+\tfrac12m_2L_2^2(\dot\theta_1+\dot\theta_2)^2+m_2L_1L_2c_2\dot\theta_1(\dot\theta_1+\dot\theta_2)$.
$\mathcal P=(m_1+m_2)gL_1s_1+m_2gL_2s_{12}$.
$\dfrac{\partial\mathcal L}{\partial\dot\theta_2}=m_2L_2^2(\dot\theta_1+\dot\theta_2)+m_2L_1L_2c_2\dot\theta_1$.
$\dfrac{d}{dt}(\cdot)=m_2L_2^2(\ddot\theta_1+\ddot\theta_2)+m_2L_1L_2c_2\ddot\theta_1-m_2L_1L_2s_2\dot\theta_2\dot\theta_1$.
$\dfrac{\partial\mathcal L}{\partial\theta_2}=-m_2L_1L_2s_2\dot\theta_1(\dot\theta_1+\dot\theta_2)-m_2gL_2c_{12}$.
빼면 $\tau_2=m_2(L_1L_2c_2+L_2^2)\ddot\theta_1+m_2L_2^2\ddot\theta_2-m_2L_1L_2s_2\dot\theta_1\dot\theta_2+m_2L_1L_2s_2\dot\theta_1(\dot\theta_1+\dot\theta_2)+m_2gL_2c_{12}$.
$\dot\theta_1\dot\theta_2$ 항이 상쇄되어 $m_2L_1L_2s_2\dot\theta_1^2$만 남습니다.`,
        rubric: R`
- 두 점질량의 속력과 운동에너지 — 3점
- 위치에너지 — 1점
- $\theta_2$에 대한 미분과 시간 미분 — 4점
- 정리(코리올리 항 상쇄) — 2점` },
    ],
  });
})();
