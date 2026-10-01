/* 12 역기구학 — MR 6.1–6.3 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 12, part: 'C', title: '역기구학', en: 'Inverse Kinematics', ref: 'MR 6.1–6.3', plot: 'rbIK',
    fig: R`같은 목표점에 닿는 2R 팔의 두 자세들. 목표가 작업 공간 경계에 가까울수록 두 자세가 가까워진다`,
    tagline: R`원하는 끝점 자세에서 관절각을 거꾸로 찾습니다. 해가 없거나, 여럿이거나, 무한히 많을 수 있습니다.`,
    summary: R`**역기구학**은 $T(\theta)=X$를 만족하는 $\theta$를 찾는 문제입니다. 정기구학과 달리 해가 없을 수도(작업 공간 밖), 여러 개일 수도(2R 팔은 팔꿈치 위·아래 두 해, PUMA형 6R 팔은 최대 8해), 무한히 많을 수도(여유 자유도) 있습니다. 평면 2R 팔은 코사인 법칙으로 해석적으로 풉니다: $\cos\theta_2=\dfrac{x^2+y^2-L_1^2-L_2^2}{2L_1L_2}$, $\theta_1=\operatorname{atan2}(y,x)-\operatorname{atan2}(L_2\sin\theta_2,L_1+L_2\cos\theta_2)$. 일반적인 팔은 **뉴턴-랩슨** 반복 $\theta^{k+1}=\theta^k+J^\dagger(\theta^k)\,e^k$으로 수치적으로 풉니다. 오차 $e$는 위치만이면 좌표의 차이, 자세 전체면 $T_{sb}^{-1}T_{sd}$의 행렬 로그에서 얻은 물체 트위스트입니다. 원하는 끝점 속도에서 관절 속도를 구하는 **역속도 기구학**은 $\dot\theta=J^\dagger\mathcal V_d$이고, 관절이 남으면 **의사역행렬** $J^\dagger=J^T(JJ^T)^{-1}$이 크기가 가장 작은 관절 속도를 줍니다.`,
    goals: [
      R`역기구학의 해가 없거나 여럿이거나 무한한 경우를 구분할 수 있다`,
      R`평면 2R 팔의 역기구학을 코사인 법칙과 atan2로 풀 수 있다`,
      R`뉴턴-랩슨 방법으로 역기구학을 반복해서 풀 수 있다`,
      R`의사역행렬의 두 가지 뜻(최소 노름, 최소 제곱)을 설명할 수 있다`,
      R`역속도 기구학으로 관절 속도를 구할 수 있다`,
    ],
    secTitles: { '6.1': '해석적 역기구학', '6.2': '수치적 역기구학', '6.3': '역속도 기구학' },
    sections: [
      { k: '6.1', p: 221, title: '해석적 역기구학: 평면 2R 팔', body: R`
:::fig rElbow
:::

목표 $(x,y)$까지의 거리 $r=\sqrt{x^2+y^2}$. 원점, 팔꿈치, 끝점이 이루는 삼각형에 코사인 법칙을 쓰면 $r^2=L_1^2+L_2^2+2L_1L_2\cos\theta_2$.

:::key 평면 2R 팔의 역기구학
$$\cos\theta_2=\frac{x^2+y^2-L_1^2-L_2^2}{2L_1L_2},\qquad\theta_2=\operatorname{atan2}\big(\pm\sqrt{1-\cos^2\theta_2},\ \cos\theta_2\big)$$
$$\theta_1=\operatorname{atan2}(y,x)-\operatorname{atan2}(L_2\sin\theta_2,\ L_1+L_2\cos\theta_2)$$
$\lvert\cos\theta_2\rvert>1$이면 해 없음(작업 공간 밖), $=1$이면 한 해(경계, 특이점), $<1$이면 두 해.
:::

$\operatorname{atan2}(y,x)$는 두 인수의 부호로 사분면을 가려 $(-\pi,\pi]$의 각을 줍니다. $\tan^{-1}(y/x)$만 쓰면 반대 사분면의 해를 놓칩니다.

:::ex 예제 1
$L_1=L_2=1$, 목표 $(1,1)$.
---
$\cos\theta_2=(2-2)/2=0$ → $\theta_2=\pm\pi/2$.
$\theta_2=+\pi/2$: $\theta_1=\tfrac\pi4-\operatorname{atan2}(1,1)=0$. $\theta_2=-\pi/2$: $\theta_1=\tfrac\pi4-\operatorname{atan2}(-1,1)=\tfrac\pi2$.
두 해 $(0,\tfrac\pi2)$와 $(\tfrac\pi2,-\tfrac\pi2)$ — 9단원 식에 넣으면 둘 다 $(1,1)$입니다.
:::

:::note 여섯 관절 팔
손목의 세 축이 한 점에서 만나는 6R 팔(PUMA형)은 손목 중심의 위치로 앞 세 관절을, 나머지 방향으로 손목 세 관절을 따로 풉니다. 어깨 좌우, 팔꿈치 위아래, 손목 뒤집기의 조합으로 해가 최대 8개입니다.
:::
` },
      { k: '6.2', p: 226, title: '수치적 역기구학: 뉴턴-랩슨', body: R`
$f(\theta)=x_d$를 풀기 위해 현재 추정 $\theta^k$ 둘레에서 선형화합니다: $x_d\approx f(\theta^k)+J(\theta^k)\Delta\theta$.

:::key 뉴턴-랩슨 역기구학
$$\theta^{k+1}=\theta^k+J^\dagger(\theta^k)\big(x_d-f(\theta^k)\big)$$
오차가 허용치보다 작아질 때까지 반복한다. 자세 전체($SE(3)$)가 목표면 오차를 물체 트위스트 $[\mathcal V_b]=\log\big(T_{sb}^{-1}(\theta^k)T_{sd}\big)$로 두고 $\theta^{k+1}=\theta^k+J_b^\dagger(\theta^k)\mathcal V_b$.
:::

해 근처에서 시작하면 오차가 매번 대략 제곱으로 줄어(2차 수렴) 몇 번이면 끝납니다. 시작점에 따라 다른 해로 수렴하거나 발산할 수 있고, 특이점 근처에서는 $J^\dagger$가 커져 한 걸음이 지나치게 커집니다.

:::fig rNewton
:::

:::idea 한 걸음의 뜻
지금 자세 $\theta^k$에서 정기구학을 접선(1차식)으로 바꾸면 $f(\theta)\approx f(\theta^k)+J\,\Delta\theta$입니다. 이 근사가 목표 $x_d$와 같아지는 $\Delta\theta$를 풀어 한 걸음 가고, 새 자리에서 다시 접선을 긋습니다. 곡선이 접선과 비슷한 곳(해 근처)에서는 거의 정확히 맞으므로 오차가 매번 제곱으로 줄고, 멀리서는 접선이 엉뚱한 곳을 가리켜 크게 빗나가기도 합니다.
:::

:::sim ik
목표(×)를 끌어 놓고 ‘한 걸음’을 눌러 보세요. 흐린 팔이 지나온 추정들이고, 아래 표에서 오차가 0.1, 0.01, 0.0001처럼 자릿수가 두 배씩 줄어듭니다. 팔의 관절을 끌어 출발 자세를 바꾸면 수렴하는 해(흐린 점선의 두 해석해 중 하나)가 달라집니다.
:::

:::ex 예제 2 — 한 관절
길이 1인 막대의 끝이 $x=\cos\theta=0.5$가 되는 $\theta$를 $\theta^0=1$에서 뉴턴-랩슨으로 구하세요.
---
$f=\cos\theta$, $J=-\sin\theta$. $\theta^1=1+\dfrac{0.5-\cos1}{-\sin1}=1+\dfrac{0.5-0.5403}{-0.8415}=1.0479$.
참값 $\pi/3=1.0472$ — 한 번에 오차가 0.047에서 0.0007로 줄었습니다.
:::
` },
      { k: '6.3', p: 232, title: '역속도 기구학과 의사역행렬', body: R`
원하는 끝점 트위스트 $\mathcal V_d$를 내는 관절 속도를 찾습니다: $J\dot\theta=\mathcal V_d$.

:::key 의사역행렬
- $J$가 정사각이고 가역이면 $\dot\theta=J^{-1}\mathcal V_d$.
- 관절이 남으면($n>m$, $J$가 가로로 긴 행렬, 계수 $m$): $J^\dagger=J^T(JJ^T)^{-1}$. 해가 무한히 많은데, $\dot\theta=J^\dagger\mathcal V_d$는 그중 $\lVert\dot\theta\rVert$가 가장 작은 해.
- 관절이 모자라면($n<m$, 세로로 긴 행렬, 계수 $n$): $J^\dagger=(J^TJ)^{-1}J^T$. 정확한 해가 없을 수 있는데, $\lVert J\dot\theta-\mathcal V_d\rVert$를 가장 작게 하는 해.
:::

:::ex 예제 3
$J=\begin{bmatrix}1&0&1\\0&1&1\end{bmatrix}$인 3관절 팔(끝점 2차원)이 $\mathcal V_d=(1,0)$을 내는 최소 노름 관절 속도는?
---
$JJ^T=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, 역행렬 $\tfrac13\begin{bmatrix}2&-1\\-1&2\end{bmatrix}$. $J^\dagger=J^T(JJ^T)^{-1}=\tfrac13\begin{bmatrix}2&-1\\-1&2\\1&1\end{bmatrix}$.
$\dot\theta=J^\dagger(1,0)^T=(\tfrac23,-\tfrac13,\tfrac13)$. 다른 해, 예를 들어 $(1,0,0)$도 $(1,0)$을 내지만 노름이 $1>\sqrt{6}/3=0.816$입니다.
:::

:::sim ik 3r
끝점 위치(2차원)만 정하는 3R 팔은 관절이 하나 남습니다. ‘끝 링크 방향 φ’를 움직이면 끝점은 목표에 그대로 있고 팔만 접혔다 펴집니다 — 야코비안의 영공간 방향 $(I-J^\dagger J)w$를 따라 움직이는 **자기 운동**입니다. ‘한 걸음’은 의사역행렬로 뉴턴-랩슨을 합니다.
:::

:::tip 여유 자유도의 활용
최소 노름 해에 $J$의 영공간 방향 $(I-J^\dagger J)w$를 더해도 끝점 속도는 그대로입니다. 이 자유를 관절 제한 피하기, 장애물 피하기, 조작성 키우기에 씁니다.
:::
` },
    ],
    problems: [
      { sec: '6.1', type: 'num', lv: 1, q: R`$L_1=L_2=1$인 2R 팔이 목표 $(1,1)$에 닿는 해의 $\lvert\theta_2\rvert$ (rad)는?`, ans: 'pi/2', ansTex: R`\pi/2`,
        sol: R`$\cos\theta_2=0$.` },
      { sec: '6.1', type: 'num', lv: 2, q: R`위 목표에서 $\theta_2<0$인 해의 $\theta_1$ (rad)은?`, ans: 'pi/2', ansTex: R`\pi/2`,
        sol: R`$\tfrac\pi4-\operatorname{atan2}(-1,1)=\tfrac\pi4+\tfrac\pi4$.` },
      { sec: '6.1', type: 'num', lv: 1, q: R`$L_1=L_2=1$인 2R 팔이 목표 $(2,0)$에 닿는 서로 다른 해는 몇 개인가?`, ans: '1', ansTex: R`1`,
        sol: R`$\cos\theta_2=1$ — 곧게 편 한 자세(특이점).` },
      { sec: '6.1', type: 'num', lv: 1, q: R`같은 팔이 목표 $(2.5,0)$에 닿는 해는 몇 개인가?`, ans: '0', ansTex: R`0`,
        sol: R`$\cos\theta_2=(6.25-2)/2>1$ — 작업 공간 밖.` },
      { sec: '6.1', type: 'num', lv: 2, q: R`$L_1=2$, $L_2=1$인 2R 팔이 목표 $(2,1)$에 닿을 때 $\cos\theta_2$는?`, ans: '(5-5)/4', ansTex: R`0`,
        sol: R`$(4+1-4-1)/(2\cdot2\cdot1)=0$ → $\theta_2=\pm\pi/2$.` },
      { sec: '6.1', type: 'mc', lv: 1, q: R`손목 세 축이 한 점에서 만나는 PUMA형 6R 팔의 역기구학 해는 일반적으로 최대 몇 개인가?`,
        choices: [R`1`, R`2`, R`4`, R`8`], ans: 3,
        sol: R`어깨(2) × 팔꿈치(2) × 손목(2).` },
      { sec: '6.2', type: 'num', lv: 2, q: R`$\cos\theta=0.5$를 $\theta^0=1$에서 뉴턴-랩슨으로 한 번 반복한 $\theta^1$은?`, ans: '1+(0.5-cos(1))/(-sin(1))', ansTex: R`1.0479`,
        sol: R`$\theta^1=\theta^0+(x_d-\cos\theta^0)/(-\sin\theta^0)$.` },
      { sec: '6.2', type: 'mc', lv: 2, q: R`뉴턴-랩슨 역기구학에 대해 옳은 것은?`,
        choices: [R`시작점과 무관하게 항상 같은 해로 수렴한다`, R`해 근처에서 시작하면 빠르게(2차로) 수렴하지만, 시작점에 따라 다른 해로 가거나 발산할 수 있다`, R`특이점 근처에서 가장 빠르다`, R`야코비안이 필요 없다`], ans: 1,
        sol: R`국소 선형화를 반복하는 방법의 성질입니다.` },
      { sec: '6.2', type: 'mc', lv: 2, q: R`목표 자세 $T_{sd}$에 대한 뉴턴-랩슨에서 오차로 쓰는 것은?`,
        choices: [R`$T_{sd}-T_{sb}$의 성분`, R`$\log(T_{sb}^{-1}T_{sd})$에서 얻은 물체 트위스트`, R`위치 차이만`, R`관절각의 차이`], ans: 1,
        sol: R`현재 자세에서 목표로 가는 나사 운동(단위 시간)을 {b}로 쓴 것입니다.` },
      { sec: '6.3', type: 'num', lv: 1, q: R`$J=[1\ \ 1]$인 두 관절 팔이 끝점 속도 1을 내는 최소 노름 해의 $\dot\theta_1$은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$J^\dagger=J^T/(JJ^T)=\tfrac12(1,1)$.` },
      { sec: '6.3', type: 'num', lv: 2, q: R`$J=\begin{bmatrix}1&0&1\\0&1&1\end{bmatrix}$에서 $\mathcal V_d=(1,0)$의 최소 노름 해의 $\dot\theta_3$은?`, ans: '1/3', ansTex: R`1/3`,
        sol: R`$\dot\theta=(\tfrac23,-\tfrac13,\tfrac13)$.` },
      { sec: '6.3', type: 'mc', lv: 2, q: R`관절 수가 끝점 자유도보다 적은(세로로 긴) 야코비안의 의사역행렬 $(J^TJ)^{-1}J^T$가 주는 것은?`,
        choices: [R`최소 노름 해`, R`$\lVert J\dot\theta-\mathcal V_d\rVert$를 최소로 하는 해`, R`항상 정확한 해`, R`영공간`], ans: 1,
        sol: R`원하는 트위스트를 정확히 낼 수 없을 때 가장 가까운 것을 냅니다.` },
      { sec: '6.1', type: 'open', lv: 2, proof: true, q: R`평면 2R 팔의 역기구학 공식을 유도하세요: 코사인 법칙으로 $\cos\theta_2$를, 그리고 끝점 식을 $\theta_1$에 대해 정리해 $\theta_1=\operatorname{atan2}(y,x)-\operatorname{atan2}(L_2s_2,L_1+L_2c_2)$를 보이세요. 해가 0, 1, 2개인 조건도 밝히세요.`,
        sol: R`
$x^2+y^2=(L_1c_1+L_2c_{12})^2+(L_1s_1+L_2s_{12})^2=L_1^2+L_2^2+2L_1L_2(c_1c_{12}+s_1s_{12})=L_1^2+L_2^2+2L_1L_2c_2$ → $\cos\theta_2$ 식.
$\theta_1$: $c_{12}=c_1c_2-s_1s_2$, $s_{12}=s_1c_2+c_1s_2$를 넣으면
$x=(L_1+L_2c_2)c_1-L_2s_2s_1$, $y=(L_1+L_2c_2)s_1+L_2s_2c_1$.
$k_1=L_1+L_2c_2=\rho\cos\gamma$, $k_2=L_2s_2=\rho\sin\gamma$로 두면 $x=\rho\cos(\theta_1+\gamma)$, $y=\rho\sin(\theta_1+\gamma)$ → $\theta_1+\gamma=\operatorname{atan2}(y,x)$, $\gamma=\operatorname{atan2}(k_2,k_1)$.
해의 수: $\lvert\cos\theta_2\rvert>1$ — 없음(거리가 $\lvert L_1-L_2\rvert$와 $L_1+L_2$ 사이가 아님). $=\pm1$ — $s_2=0$ 하나. $<1$ — $s_2=\pm\sqrt{1-c_2^2}$ 두 개(각각 $\theta_1$이 하나씩 정해짐).`,
        rubric: R`
- 코사인 법칙 식 유도 — 3점
- $\theta_1$ 식 유도(합성각) — 4점
- 해의 개수 조건 — 3점` },
    ],
  });
})();
