/* 07 동차 변환 행렬과 트위스트 — MR 3.3.1–3.3.2 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 7, part: 'B', title: '동차 변환과 트위스트', en: 'Homogeneous Transformations & Twists', ref: 'MR 3.3.1–3.3.2', plot: 'rbHelix',
    fig: R`나사 축 둘레의 나선들. 강체의 모든 순간 운동은 어떤 축 둘레의 회전과 그 축 방향의 병진을 합친 나사 운동이다`,
    tagline: R`회전과 위치를 4×4 행렬 하나에 담고, 그 시간 미분을 여섯 성분의 속도 벡터로 줄입니다. 강체의 속도는 나사 하나로 그릴 수 있습니다.`,
    summary: R`강체의 자세(방향과 위치)는 **동차 변환 행렬** $T=\begin{bmatrix}R&p\\0&1\end{bmatrix}\in SE(3)$로 나타냅니다. $SE(3)$도 곱과 역($T^{-1}=\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix}$)에 닫힌 군이고, 회전 행렬처럼 자세를 적고, 좌표계를 바꾸고($T_{ab}T_{bc}=T_{ac}$), 물체를 옮기는(앞곱: 고정 좌표계, 뒷곱: 물체 좌표계) 세 가지로 쓰입니다. 강체의 속도는 $T^{-1}\dot T=[\mathcal V_b]$, $\dot TT^{-1}=[\mathcal V_s]$에서 여섯 성분의 **트위스트** $\mathcal V=(\omega,v)$로 요약됩니다. 물체 트위스트 $\mathcal V_b$의 $v_b$는 {b} 원점의 속도, 공간 트위스트 $\mathcal V_s$의 $v_s$는 물체를 무한히 넓혔을 때 {s} 원점에 있는 점의 속도입니다. 둘은 **수반 행렬** $[\mathrm{Ad}_T]=\begin{bmatrix}R&0\\{}[p]R&R\end{bmatrix}$로 $\mathcal V_s=[\mathrm{Ad}_{T_{sb}}]\mathcal V_b$입니다. 모든 트위스트는 **나사 축** $\mathcal S=(\hat s,\,-\hat s\times q+h\hat s)$ 둘레의 속도 $\dot\theta$로 쓸 수 있습니다: $\mathcal V=\mathcal S\dot\theta$.`,
    goals: [
      R`동차 변환 행렬을 만들고 역행렬과 곱을 계산할 수 있다`,
      R`동차 좌표로 점을 옮기고 좌표계를 바꿀 수 있다`,
      R`물체 트위스트와 공간 트위스트를 구하고 각 성분의 뜻을 설명할 수 있다`,
      R`수반 행렬로 트위스트의 좌표계를 바꿀 수 있다`,
      R`트위스트를 나사 축과 피치, 속도로 나타낼 수 있다`,
    ],
    secTitles: { '3.3.1': '동차 변환 행렬', '3.3.2a': '트위스트와 수반 행렬', '3.3.2b': '나사 축' },
    sections: [
      { k: '3.3.1', p: 89, title: '동차 변환 행렬과 SE(3)', body: R`
{b}의 방향 $R_{sb}$와 원점의 위치 $p_{sb}$를 한 행렬에 넣습니다.

:::key 특수 유클리드 군 SE(3)
$$T=\begin{bmatrix}R&p\\0&1\end{bmatrix},\quad R\in SO(3),\ p\in\mathbb R^3;\qquad T^{-1}=\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix}$$
점은 동차 좌표 $(x,1)$로: $T\begin{bmatrix}x\\1\end{bmatrix}=\begin{bmatrix}Rx+p\\1\end{bmatrix}$. 곱에 닫혀 있고 교환 법칙은 없다. 자유도 $3+3=6$.
:::

회전 행렬의 세 가지 쓰임이 그대로 옮겨집니다: $T_{sb}$로 자세를 적고, $T_{ab}T_{bc}=T_{ac}$와 $T_{ab}x_b=x_a$로 좌표계를 바꾸고, 변환 $T=(\mathrm{Rot}(\hat\omega,\theta),p)$로 물체를 옮깁니다. $TT_{sb}$는 {s}의 축 둘레로 돌리고 {s}에서 잰 $p$만큼 옮기며, $T_{sb}T$는 {b}에서 잰 축과 거리로 움직입니다.

:::ex 예제 1
$T_{sb}$: $R=\mathrm{Rot}(\hat z,90°)$, $p=(1,2,0)$. (a) {b}에서 $(1,0,0)$인 점의 {s} 좌표, (b) $T_{sb}^{-1}$의 위치 부분은?
---
(a) $R(1,0,0)^T+p=(0,1,0)+(1,2,0)=(1,3,0)$.
(b) $-R^Tp$: $R^T=\begin{bmatrix}0&1&0\\-1&0&0\\0&0&1\end{bmatrix}$, $R^Tp=(2,-1,0)$ → $(-2,1,0)$. {b}에서 본 {s} 원점의 위치입니다.
:::
` },
      { k: '3.3.2a', p: 97, title: '트위스트와 수반 행렬', body: R`
$T(t)$를 미분해 $T^{-1}$을 곱하면
$$T^{-1}\dot T=\begin{bmatrix}R^T\dot R&R^T\dot p\\0&0\end{bmatrix}=\begin{bmatrix}[\omega_b]&v_b\\0&0\end{bmatrix}=[\mathcal V_b].$$

:::key 물체 트위스트와 공간 트위스트
$$\mathcal V_b=\begin{bmatrix}\omega_b\\v_b\end{bmatrix}:\ T^{-1}\dot T=[\mathcal V_b],\qquad\mathcal V_s=\begin{bmatrix}\omega_s\\v_s\end{bmatrix}:\ \dot TT^{-1}=[\mathcal V_s]$$
$v_b=R^T\dot p$는 {b} 원점의 속도를 {b} 좌표로 쓴 것. $v_s=\dot p-\omega_s\times p$는 물체를 무한히 넓혔을 때 **{s} 원점에 겹친 점**의 속도를 {s} 좌표로 쓴 것(원점의 속도가 아님).
:::

:::key 수반 행렬
$$[\mathrm{Ad}_T]=\begin{bmatrix}R&0\\{}[p]R&R\end{bmatrix}\in\mathbb R^{6\times6},\qquad\mathcal V_s=[\mathrm{Ad}_{T_{sb}}]\mathcal V_b,\qquad[\mathrm{Ad}_T]^{-1}=[\mathrm{Ad}_{T^{-1}}]$$
일반적으로 $\mathcal V_a=[\mathrm{Ad}_{T_{ab}}]\mathcal V_b$. 행렬로는 $[\mathcal V_s]=T[\mathcal V_b]T^{-1}$.
:::

:::ex 예제 2 — 한 점 둘레로 도는 물체
평면 물체가 고정점 $q=(3,0,0)$ 둘레로 반시계 2 rad/s로 돈다. {s}는 원점, 이 순간 {b}는 $(4,0,0)$에 있고 {s}와 방향이 같다. $\mathcal V_s$와 $\mathcal V_b$는?
---
$\omega=(0,0,2)$. $v_s$: {s} 원점에 겹친 점의 속도 $=\omega\times(0-q)=(0,0,2)\times(-3,0,0)=(0,-6,0)$.
$v_b$: {b} 원점의 속도 $=\omega\times(p-q)=(0,0,2)\times(1,0,0)=(0,2,0)$ ($R=I$라 좌표도 같음).
확인: $v_s=[p]R\omega_b+Rv_b=p\times\omega+v_b=(0,-8,0)+(0,2,0)=(0,-6,0)$.
:::
` },
      { k: '3.3.2b', p: 101, title: '나사 축으로 본 트위스트', body: R`
모든 강체 속도는 어떤 축 둘레로 돌면서 그 축 방향으로 미끄러지는 **나사 운동**입니다(샬의 정리).

:::fig rScrew
:::

:::key 나사 축과 피치
단위 방향 $\hat s$, 축 위의 점 $q$, 피치 $h$(회전 1 rad당 축 방향 이동)인 나사 축
$$\mathcal S=\begin{bmatrix}\hat s\\-\hat s\times q+h\hat s\end{bmatrix},\qquad\mathcal V=\mathcal S\dot\theta.$$
트위스트 $\mathcal V=(\omega,v)$에서: $\omega\ne0$이면 $\dot\theta=\lVert\omega\rVert$, $\mathcal S=\mathcal V/\lVert\omega\rVert$, $h=\hat\omega^Tv/\dot\theta$. $\omega=0$(순수 병진)이면 $\dot\theta=\lVert v\rVert$, $\mathcal S=(0,v/\lVert v\rVert)$, 피치는 무한대.
:::

:::ex 예제 3
{s}에서 트위스트 $\mathcal V_s=((0,0,2),(4,0,1))$의 나사 축은?
---
$\dot\theta=2$, $\mathcal S=((0,0,1),(2,0,0.5))$. 피치 $h=\hat s\cdot v_S=0.5$(1 rad에 0.5 m).
축 위의 점: $-\hat s\times q=v_S-h\hat s=(2,0,0)$. $q=(0,q_y,0)$으로 두면 $-\hat z\times q=(q_y,0,0)$ → $q_y=2$. 축은 $(0,2,0)$을 지나는 $\hat z$ 방향 직선.
:::

:::note 두 트위스트는 같은 나사
$\mathcal V_s$와 $\mathcal V_b$는 같은 나사 운동을 두 좌표계에서 쓴 것입니다. 나사 축, 피치, 회전 속도는 좌표계와 무관한 기하학적 대상이고, 수반 행렬은 그 표현만 바꿉니다.
:::
` },
    ],
    problems: [
      { sec: '3.3.1', type: 'num', lv: 1, q: R`$SE(3)$의 원소(강체 자세)의 자유도는?`, ans: '6', ansTex: R`6`,
        sol: R`방향 3 + 위치 3.` },
      { sec: '3.3.1', type: 'num', lv: 1, q: R`$T_{sb}$의 $R=\mathrm{Rot}(\hat z,90°)$, $p=(1,2,0)$일 때 {b}에서 $(1,0,0)$인 점의 {s} 좌표 중 $y$는?`, ans: '3', ansTex: R`3`,
        sol: R`$(0,1,0)+(1,2,0)=(1,3,0)$.` },
      { sec: '3.3.1', type: 'num', lv: 2, q: R`같은 $T_{sb}$의 역행렬 $T_{bs}$의 위치 부분의 $x$ 성분은?`, ans: '-2', ansTex: R`-2`,
        sol: R`$-R^Tp=(-2,1,0)$.` },
      { sec: '3.3.1', type: 'num', lv: 2, q: R`$T_{ab}=(\mathrm{Rot}(\hat z,90°),(1,0,0))$, $T_{bc}=(I,(1,0,0))$일 때 $T_{ac}$의 위치 부분의 $y$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$p_{ac}=R_{ab}p_{bc}+p_{ab}=(0,1,0)+(1,0,0)=(1,1,0)$.` },
      { sec: '3.3.1', type: 'mc', lv: 1, q: R`변환 $T$로 물체를 움직일 때 $T_{sb}T$ (뒷곱)의 뜻은?`,
        choices: [R`{s}의 축과 거리로 움직인다`, R`{b}의 축과 거리로 움직인다`, R`좌표계를 바꿀 뿐 움직이지 않는다`, R`역변환이다`], ans: 1,
        sol: R`회전 행렬에서처럼 뒷곱은 물체 좌표계 기준입니다.` },
      { sec: '3.3.2a', type: 'num', lv: 2, q: R`고정점 $q=(3,0,0)$ 둘레로 반시계 2 rad/s로 도는 평면 물체의 공간 트위스트에서 $v_s$의 $y$ 성분은?`, ans: '-6', ansTex: R`-6`,
        sol: R`$\omega\times(0-q)=(0,0,2)\times(-3,0,0)=(0,-6,0)$.` },
      { sec: '3.3.2a', type: 'num', lv: 2, q: R`같은 물체에서 {b}가 $(4,0,0)$에 있고 {s}와 방향이 같다. $v_b$의 $y$ 성분은?`, ans: '2', ansTex: R`2`,
        sol: R`$\omega\times(p-q)=(0,2,0)$.` },
      { sec: '3.3.2a', type: 'mc', lv: 2, q: R`공간 트위스트의 $v_s$가 나타내는 것은?`,
        choices: [R`{b} 원점의 속도`, R`물체를 무한히 넓혔을 때 {s} 원점에 겹친 점의 속도`, R`질량 중심의 속도`, R`각속도`], ans: 1,
        sol: R`$v_s=\dot p-\omega_s\times p=\dot p+\omega_s\times(0-p)$ — {b} 원점의 속도에서 {s} 원점까지의 상대 회전 속도를 더한 것.` },
      { sec: '3.3.2a', type: 'num', lv: 2, q: R`수반 행렬 $[\mathrm{Ad}_T]$의 행렬식은?`, ans: '1', ansTex: R`1`,
        sol: R`블록 하삼각: $\det R\cdot\det R=1$.` },
      { sec: '3.3.2b', type: 'num', lv: 1, q: R`트위스트 $((0,0,2),(0,0,1))$의 피치는?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$h=\hat\omega^Tv/\lVert\omega\rVert=1/2$.` },
      { sec: '3.3.2b', type: 'num', lv: 1, q: R`순수 병진 트위스트 $(0,(3,4,0))$의 속도 $\dot\theta$는?`, ans: '5', ansTex: R`5`,
        sol: R`$\lVert v\rVert=5$, $\mathcal S=(0,(0.6,0.8,0))$.` },
      { sec: '3.3.2b', type: 'num', lv: 2, q: R`점 $(0,2,0)$을 지나고 방향이 $\hat z$, 피치 0인 나사 축의 $v$ 부분의 $x$ 성분은?`, ans: '2', ansTex: R`2`,
        sol: R`$-\hat z\times(0,2,0)=-(-2,0,0)=(2,0,0)$.` },
      { sec: '3.3.2a', type: 'open', lv: 2, proof: true, q: R`$T=(R,p)$에 대해 $\dot TT^{-1}=\begin{bmatrix}[\omega_s]&\dot p-\omega_s\times p\\0&0\end{bmatrix}$임을 보이고, 이로부터 $\mathcal V_s=[\mathrm{Ad}_T]\mathcal V_b$를 유도하세요.`,
        sol: R`
$\dot T=\begin{bmatrix}\dot R&\dot p\\0&0\end{bmatrix}$, $T^{-1}=\begin{bmatrix}R^T&-R^Tp\\0&1\end{bmatrix}$.
$\dot TT^{-1}=\begin{bmatrix}\dot RR^T&-\dot RR^Tp+\dot p\\0&0\end{bmatrix}=\begin{bmatrix}[\omega_s]&\dot p-\omega_s\times p\\0&0\end{bmatrix}$ ($\dot RR^T=[\omega_s]$).
물체 트위스트는 $\omega_b=R^T\omega_s$, $v_b=R^T\dot p$. 따라서 $\omega_s=R\omega_b$,
$v_s=\dot p-\omega_s\times p=Rv_b+p\times\omega_s=Rv_b+[p]R\omega_b$.
모으면 $\begin{bmatrix}\omega_s\\v_s\end{bmatrix}=\begin{bmatrix}R&0\\{}[p]R&R\end{bmatrix}\begin{bmatrix}\omega_b\\v_b\end{bmatrix}$.`,
        rubric: R`
- $\dot TT^{-1}$의 블록 계산 — 4점
- $\omega_b$, $v_b$와의 관계 — 3점
- 수반 행렬로 정리 — 3점` },
    ],
  });
})();
