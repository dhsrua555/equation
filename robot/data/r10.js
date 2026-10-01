/* 10 야코비안 — MR 5.1 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 10, part: 'C', title: '야코비안', en: 'The Manipulator Jacobian', ref: 'MR 5.1', plot: 'rbJacobian',
    fig: R`2R 팔의 끝점이 지나는 길을 따라 그린 속도 타원들. 같은 관절 속도라도 자세에 따라 끝점 속도가 달라진다`,
    tagline: R`관절 속도를 끝점 속도로 옮기는 선형 사상입니다. 열 하나가 관절 하나의 기여이고, 그 열은 지금 자세에서 그 관절의 나사 축입니다.`,
    summary: R`끝점의 속도는 관절 속도의 선형 결합입니다: $\mathcal V=J(\theta)\dot\theta$. 평면 2R 팔이면 끝점 좌표 $(x,y)$를 미분해 $2\times2$ 행렬을 얻고, 일반 팔은 지수곱 공식을 미분합니다. **공간 야코비안** $J_s$의 $i$번째 열은 $J_{si}=[\mathrm{Ad}_{e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_{i-1}]\theta_{i-1}}}]\mathcal S_i$ — 앞 관절들이 옮겨 놓은 **현재 자세의 관절 $i$ 나사 축**을 {s}로 쓴 것이고, 관절 $i$만 단위 속도로 움직일 때의 공간 트위스트입니다. **물체 야코비안** $J_b$는 같은 것을 {b}로 쓴 것으로 뒤쪽 관절의 운동을 되돌려 $J_{bi}=[\mathrm{Ad}_{e^{-[\mathcal B_n]\theta_n}\cdots e^{-[\mathcal B_{i+1}]\theta_{i+1}}}]\mathcal B_i$이며, $J_s=[\mathrm{Ad}_{T_{sb}}]J_b$입니다. 속도 기구학, 정역학(11단원), 역기구학(12단원)이 모두 이 행렬 위에 섭니다.`,
    goals: [
      R`평면 팔의 끝점 좌표를 미분해 야코비안을 구할 수 있다`,
      R`야코비안의 열을 “한 관절만 움직일 때의 속도”로 해석할 수 있다`,
      R`지수곱 공식에서 공간 야코비안의 열을 계산할 수 있다`,
      R`물체 야코비안을 구하고 공간 야코비안과의 관계를 쓸 수 있다`,
      R`공간 트위스트에서 끝점의 선속도를 구할 수 있다`,
    ],
    secTitles: { '5.1a': '평면 팔의 야코비안', '5.1.1': '공간 야코비안', '5.1.2': '물체 야코비안' },
    sections: [
      { k: '5.1a', p: 178, title: '평면 2R 팔의 야코비안', body: R`
:::fig rTwoR
:::

$x=L_1c_1+L_2c_{12}$, $y=L_1s_1+L_2s_{12}$를 시간으로 미분하면

:::key 평면 2R 팔의 야코비안
$$\begin{bmatrix}\dot x\\\dot y\end{bmatrix}=\begin{bmatrix}-L_1s_1-L_2s_{12}&-L_2s_{12}\\L_1c_1+L_2c_{12}&L_2c_{12}\end{bmatrix}\begin{bmatrix}\dot\theta_1\\\dot\theta_2\end{bmatrix},\qquad\det J=L_1L_2\sin\theta_2$$
열 $i$는 관절 $i$만 단위 속도로 돌 때의 끝점 속도.
:::

:::ex 예제 1
$L_1=L_2=1$, $\theta=(0,\pi/2)$에서 (a) $\dot\theta=(1,0)$, (b) $\dot\theta=(0,1)$일 때 끝점 속도는?
---
$J=\begin{bmatrix}-1&-1\\1&0\end{bmatrix}$. (a) $(-1,1)$: 관절 1이 끝점 $(1,1)$을 원점 둘레로 돌림. (b) $(-1,0)$: 관절 2가 끝점을 관절 2 $(1,0)$ 둘레로 돌림.
:::

$\det J=0$인 $\theta_2=0,\pi$(팔을 펴거나 완전히 접음)에서는 두 열이 나란해 어떤 방향으로는 속도를 낼 수 없습니다 — 특이점(11단원).

:::fig rJacCols
:::

:::idea 열을 미분 없이 그리기
관절 $i$만 돌리면 그보다 바깥의 모든 것이 관절 $i$ 둘레로 도는 강체입니다. 그래서 끝점 속도($J$의 $i$번째 열)는 “관절 $i$에서 끝점으로 그은 선분에 수직이고, 길이는 그 선분의 길이”입니다. 예제 1을 계산 없이 그림으로 확인해 보세요: 끝점 $(1,1)$, 관절 2는 $(1,0)$에 있으니 둘째 열은 길이 1, 방향 $(-1,0)$.
:::

:::sim jacobian
관절 속도 막대 $\dot\theta_1$, $\dot\theta_2$를 움직이면 두 열의 기여(점선)가 더해져 끝점 속도(초록)가 됩니다. 끝점을 끌어 자세를 바꾸면서 열의 방향이 위 그림의 규칙대로 바뀌는지 보세요.
:::
` },
      { k: '5.1.1', p: 178, title: '공간 야코비안', body: R`
$T=e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_n]\theta_n}M$을 미분해 $\dot TT^{-1}$을 계산하면 관절마다 항이 하나씩 나옵니다.

:::key 공간 야코비안
$$\mathcal V_s=J_s(\theta)\dot\theta,\qquad J_{s1}=\mathcal S_1,\qquad J_{si}=\big[\mathrm{Ad}_{e^{[\mathcal S_1]\theta_1}\cdots e^{[\mathcal S_{i-1}]\theta_{i-1}}}\big]\mathcal S_i\ (i\ge2)$$
$J_{si}$는 앞 관절 $1,\dots,i-1$이 움직인 뒤의 **현재 관절 $i$의 나사 축**을 {s}로 쓴 것. 뒤쪽 관절의 각에는 의존하지 않는다.
:::

:::idea 공간 야코비안의 열 = 지금의 관절 축
$J_{si}$를 구하는 식은 길어 보이지만 뜻은 단순합니다. 관절 $1,\dots,i-1$을 돌려 놓은 **지금 자세에서** 관절 $i$의 나사 축을 {s}로 적은 것이 $J_{si}$입니다. 관절 $i$만 단위 속도로 돌리면 바깥 부분 전체가 그 나사 축을 따라 움직이므로, 그 공간 트위스트가 곧 열입니다. 관절 $i$보다 바깥의 관절각은 관절 $i$의 축 위치를 바꾸지 않으므로 $J_{si}$에 나타나지 않습니다.
:::

그래서 계산은 기하로도 할 수 있습니다: 지금 자세에서 관절 $i$의 축 방향 $\omega_{si}$와 축 위의 점 $q_{si}$를 {s}로 읽어 $J_{si}=(\omega_{si},-\omega_{si}\times q_{si})$ (회전 관절).

:::ex 예제 2 — 평면 3R 팔
9단원의 평면 3R 팔의 $J_s(\theta)$는?
---
모든 축은 $\hat z$. 관절 2의 현재 위치 $q_2=(L_1c_1,L_1s_1,0)$, 관절 3은 $q_3=(L_1c_1+L_2c_{12},L_1s_1+L_2s_{12},0)$.
$-\hat z\times q=(q_y,-q_x,0)$이므로
$$J_s=\begin{bmatrix}0&0&0\\0&0&0\\1&1&1\\0&L_1s_1&L_1s_1+L_2s_{12}\\0&-L_1c_1&-L_1c_1-L_2c_{12}\\0&0&0\end{bmatrix}$$
:::

:::tip 끝점의 선속도
공간 트위스트의 $v_s$는 끝점의 속도가 아닙니다. 끝점 $p$의 속도는 $\dot p=v_s+\omega_s\times p$ — {s} 원점에 겹친 점의 속도에 회전 기여를 더합니다.
:::
` },
      { k: '5.1.2', p: 183, title: '물체 야코비안', body: R`
물체 형태 $T=Me^{[\mathcal B_1]\theta_1}\cdots e^{[\mathcal B_n]\theta_n}$을 미분해 $T^{-1}\dot T$를 계산합니다.

:::key 물체 야코비안
$$\mathcal V_b=J_b(\theta)\dot\theta,\qquad J_{bn}=\mathcal B_n,\qquad J_{bi}=\big[\mathrm{Ad}_{e^{-[\mathcal B_n]\theta_n}\cdots e^{-[\mathcal B_{i+1}]\theta_{i+1}}}\big]\mathcal B_i\ (i<n)$$
$$J_s(\theta)=[\mathrm{Ad}_{T_{sb}}]J_b(\theta),\qquad J_b(\theta)=[\mathrm{Ad}_{T_{bs}}]J_s(\theta)$$
:::

$J_{bi}$는 뒤쪽 관절 $i+1,\dots,n$에만 의존합니다(끝점에서 보면 뒤쪽 관절이 관절 $i$를 옮겨 놓은 것처럼 보임). 공간 야코비안과 물체 야코비안은 같은 선형 사상을 다른 좌표로 쓴 것이라 계수(rank)가 같고, 따라서 특이점도 같습니다.

:::ex 예제 3
평면 3R 팔($L_1=L_2=1$, $L_3=0.5$)의 $J_b$ 마지막 열은?
---
$J_{b3}=\mathcal B_3=(0,0,1,0,L_3,0)=(0,0,1,0,0.5,0)$ — 관절 3만 돌면 끝점은 자기 $\hat y_b$ 방향으로 $L_3$ 속도로 움직입니다.
:::

:::note 해석적 야코비안과의 차이
끝점 자세를 오일러 각 같은 최소 좌표 $x$로 쓰고 $\dot x=J_a\dot\theta$로 정의한 해석적 야코비안도 있습니다. 좌표의 특이점(짐벌 잠김)이 섞여 들어오므로, 이 책은 트위스트로 정의한 기하학적 야코비안 $J_s$, $J_b$를 주로 씁니다.
:::
` },
    ],
    problems: [
      { sec: '5.1a', type: 'num', lv: 1, q: R`$L_1=L_2=1$인 평면 2R 팔이 $\theta=(0,\pi/2)$이고 $\dot\theta=(1,0)$이다. 끝점 속도의 $y$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$J$의 첫 열 $(-1,1)$.` },
      { sec: '5.1a', type: 'num', lv: 1, q: R`같은 자세에서 $\dot\theta=(0,1)$일 때 끝점 속도의 $x$ 성분은?`, ans: '-1', ansTex: R`-1`,
        sol: R`둘째 열 $(-L_2s_{12},L_2c_{12})=(-1,0)$.` },
      { sec: '5.1a', type: 'num', lv: 1, q: R`$L_1=1$, $L_2=0.5$, $\theta_2=\pi/6$인 2R 팔의 $\det J$는?`, ans: '0.25', ansTex: R`0.25`,
        sol: R`$L_1L_2\sin\theta_2=0.5(0.5)=0.25$.` },
      { sec: '5.1a', type: 'mc', lv: 1, q: R`$n$관절 팔의 (공간) 야코비안의 크기는?`,
        choices: [R`$n\times n$`, R`$6\times n$`, R`$n\times6$`, R`$6\times6$`], ans: 1,
        sol: R`트위스트 6성분 × 관절 수.` },
      { sec: '5.1.1', type: 'num', lv: 2, q: R`$L_1=1$인 평면 3R 팔에서 $\theta_1=\pi/2$일 때 $J_{s2}$의 $v_x$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$L_1s_1=1$.` },
      { sec: '5.1.1', type: 'num', lv: 2, q: R`$L_1=L_2=1$인 평면 3R 팔에서 $\theta_1=\theta_2=0$일 때 $J_{s3}$의 $v_y$ 성분은?`, ans: '-2', ansTex: R`-2`,
        sol: R`$-L_1c_1-L_2c_{12}=-2$.` },
      { sec: '5.1.1', type: 'mc', lv: 2, q: R`공간 야코비안의 $i$번째 열에 대해 옳은 것은?`,
        choices: [R`모든 관절각에 의존한다`, R`현재 자세에서 관절 $i$의 나사 축을 {s}로 쓴 것으로, 관절 $1,\dots,i-1$의 각에만 의존한다`, R`영 자세의 축과 항상 같다`, R`끝점의 선속도다`], ans: 1,
        sol: R`뒤쪽 관절은 관절 $i$의 축을 옮기지 않습니다.` },
      { sec: '5.1.1', type: 'num', lv: 2, q: R`공간 트위스트가 $\omega_s=(0,0,1)$, $v_s=(0,-1,0)$이고 끝점이 $p=(2,0,0)$에 있다. 끝점 속도의 $y$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$\dot p=v_s+\omega_s\times p=(0,-1,0)+(0,2,0)=(0,1,0)$.` },
      { sec: '5.1.2', type: 'mc', lv: 1, q: R`공간 야코비안과 물체 야코비안의 관계는?`,
        choices: [R`$J_s=J_b$`, R`$J_s=[\mathrm{Ad}_{T_{sb}}]J_b$`, R`$J_s=J_b^T$`, R`$J_s=-J_b$`], ans: 1,
        sol: R`트위스트의 좌표 변환 $\mathcal V_s=[\mathrm{Ad}_{T_{sb}}]\mathcal V_b$를 열마다 적용한 것.` },
      { sec: '5.1.2', type: 'num', lv: 1, q: R`평면 3R 팔($L_3=0.5$)의 $J_{b3}$에서 $v_y$ 성분은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$J_{b3}=\mathcal B_3=(0,0,1,0,L_3,0)$.` },
      { sec: '5.1.2', type: 'mc', lv: 2, q: R`물체 야코비안의 $i$번째 열은 어떤 관절각에 의존하는가?`,
        choices: [R`$\theta_1,\dots,\theta_{i-1}$`, R`$\theta_{i+1},\dots,\theta_n$`, R`모든 관절각`, R`어느 것에도 의존하지 않는다`], ans: 1,
        sol: R`끝점에서 보면 관절 $i$와 끝점 사이의 관절들이 축을 옮겨 놓습니다.` },
      { sec: '5.1.1', type: 'open', lv: 2, proof: true, q: R`2관절 팔 $T=e^{[\mathcal S_1]\theta_1}e^{[\mathcal S_2]\theta_2}M$에서 $\dot TT^{-1}=[\mathcal S_1]\dot\theta_1+\big[\mathrm{Ad}_{e^{[\mathcal S_1]\theta_1}}\mathcal S_2\big]\dot\theta_2$임을 보이고, 이로부터 공간 야코비안의 열 공식을 설명하세요.`,
        sol: R`
$E_i=e^{[\mathcal S_i]\theta_i}$라 쓰면 $\dot E_i=[\mathcal S_i]E_i\dot\theta_i$ (지수의 미분).
$\dot T=\dot E_1E_2M+E_1\dot E_2M=[\mathcal S_1]\dot\theta_1E_1E_2M+E_1[\mathcal S_2]\dot\theta_2E_2M$.
$T^{-1}=M^{-1}E_2^{-1}E_1^{-1}$을 오른쪽에 곱하면
$\dot TT^{-1}=[\mathcal S_1]\dot\theta_1+E_1[\mathcal S_2]E_1^{-1}\dot\theta_2$.
$E_1[\mathcal S_2]E_1^{-1}=[\mathrm{Ad}_{E_1}\mathcal S_2]$(수반 행렬의 행렬 형태)이므로 $\mathcal V_s=\mathcal S_1\dot\theta_1+[\mathrm{Ad}_{E_1}]\mathcal S_2\dot\theta_2$ — 두 열이 $J_{s1}=\mathcal S_1$, $J_{s2}=[\mathrm{Ad}_{E_1}]\mathcal S_2$.
$n$관절에서도 같은 계산으로 $i$번째 항은 $E_1\cdots E_{i-1}$로 끼운 $\mathcal S_i$가 됩니다: 앞 관절들이 강체처럼 옮겨 놓은 관절 $i$의 축.`,
        rubric: R`
- 곱의 미분 — 3점
- $T^{-1}$을 곱해 정리 — 3점
- 수반 행렬로의 해석 — 2점
- 일반화 — 2점` },
    ],
  });
})();
