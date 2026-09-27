/* 05 회전 행렬과 SO(3) — MR 3.1–3.2.1 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'B', title: '회전 행렬과 SO(3)', en: 'Rotation Matrices & SO(3)', ref: 'MR 3.1–3.2.1', plot: 'rbFrames',
    fig: R`한 축 둘레로 조금씩 돌아가는 좌표축들. 세 축의 끝점이 원을 그린다`,
    tagline: R`강체의 방향을 3×3 행렬 하나로 나타냅니다. 같은 행렬이 방향을 적고, 좌표를 바꾸고, 물체를 돌리는 세 가지 일을 합니다.`,
    summary: R`물체에 붙인 좌표계 {b}의 세 단위 축을 고정 좌표계 {s}에서 쓴 것을 열로 모은 행렬이 **회전 행렬** $R_{sb}$입니다. 열들이 서로 수직인 단위 벡터이고 오른손 좌표계라 $R^TR=I$, $\det R=1$ — 이런 행렬의 집합이 **특수 직교군** $SO(3)$입니다. 9개의 수에 6개의 구속이 있어 방향의 자유도는 3입니다. $SO(3)$는 곱에 닫혀 있고 역행렬이 전치 $R^{-1}=R^T$이지만, 곱의 순서를 바꿀 수 없습니다. 회전 행렬은 세 가지로 쓰입니다: (1) 방향을 적는다($R_{sb}$), (2) 좌표계를 바꾼다($R_{ac}=R_{ab}R_{bc}$, $p_a=R_{ab}p_b$ — 아래첨자 지우기 규칙), (3) 벡터나 좌표계를 돌린다 — 앞에 곱하면 고정 좌표계의 축 둘레로, 뒤에 곱하면 물체 좌표계의 축 둘레로 돈다.`,
    goals: [
      R`평면 강체의 자세를 각과 위치로, 회전을 2×2 행렬로 나타낼 수 있다`,
      R`회전 행렬의 열의 뜻을 설명하고 $SO(3)$의 성질을 보일 수 있다`,
      R`좌표축 둘레의 기본 회전 행렬을 쓸 수 있다`,
      R`아래첨자 지우기 규칙으로 좌표계를 바꾸고 벡터를 옮길 수 있다`,
      R`앞곱과 뒷곱이 고정 축과 물체 축 둘레의 회전임을 구분할 수 있다`,
    ],
    secTitles: { '3.1': '평면의 강체 운동', '3.2.1a': '회전 행렬과 SO(3)', '3.2.1b': '회전 행렬의 세 가지 쓰임' },
    sections: [
      { k: '3.1', p: 62, title: '평면의 강체 운동', body: R`
평면에서 물체 좌표계 {b}의 원점을 고정 좌표계 {s}에서 $p=(p_x,p_y)$, {b}의 $\hat x_b$ 축이 $\hat x_s$와 이루는 각을 $\theta$라 하면 {b}의 축은
$$\hat x_b=\cos\theta\,\hat x_s+\sin\theta\,\hat y_s,\qquad\hat y_b=-\sin\theta\,\hat x_s+\cos\theta\,\hat y_s.$$
두 축을 열로 모으면 $P=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$ — 평면 회전 행렬입니다. {b}에서 좌표 $r_b$인 점은 {s}에서 $r_s=Pr_b+p$.

:::key 평면의 자세와 변환
$$T=\begin{bmatrix}P&p\\0&1\end{bmatrix},\qquad\begin{bmatrix}r_s\\1\end{bmatrix}=T\begin{bmatrix}r_b\\1\end{bmatrix}$$
$P^TP=I$, $\det P=1$. 평면 자세의 자유도 3($\theta$와 $p$) — 1단원의 셈과 같다.
:::

:::ex 예제 1
{b}가 {s}에 대해 90° 돌아 있고 원점이 $(2,1)$에 있다. {b}에서 $(1,0)$인 점은 {s}에서 어디인가?
---
$P(1,0)^T=(0,1)$, 더하기 $p$: $(2,2)$.
:::
` },
      { k: '3.2.1a', p: 68, title: '회전 행렬과 SO(3)', body: R`
공간에서도 같습니다. {b}의 단위 축 $\hat x_b,\hat y_b,\hat z_b$를 {s}의 좌표로 적어 열로 놓으면
$$R_{sb}=\big[\hat x_b\ \ \hat y_b\ \ \hat z_b\big]=\begin{bmatrix}r_{11}&r_{12}&r_{13}\\r_{21}&r_{22}&r_{23}\\r_{31}&r_{32}&r_{33}\end{bmatrix}.$$
열이 단위 벡터(구속 3개)이고 서로 수직(구속 3개)이며, 오른손 좌표계라 $\hat x_b\times\hat y_b=\hat z_b$입니다.

:::key 특수 직교군 SO(3)
$$SO(3)=\{R\in\mathbb R^{3\times3}:\ R^TR=I,\ \det R=1\}$$
- 닫힘: $R_1,R_2\in SO(3)\Rightarrow R_1R_2\in SO(3)$. 역: $R^{-1}=R^T\in SO(3)$. 항등원 $I$. 결합법칙. — 군(group)이다.
- 교환 법칙은 성립하지 않는다: 일반적으로 $R_1R_2\ne R_2R_1$.
- 벡터의 길이와 두 벡터 사이의 각을 보존한다: $\lVert Rx\rVert=\lVert x\rVert$.
:::

:::key 좌표축 둘레의 기본 회전
$$\mathrm{Rot}(\hat x,\theta)=\begin{bmatrix}1&0&0\\0&c_\theta&-s_\theta\\0&s_\theta&c_\theta\end{bmatrix},\ \mathrm{Rot}(\hat y,\theta)=\begin{bmatrix}c_\theta&0&s_\theta\\0&1&0\\-s_\theta&0&c_\theta\end{bmatrix},\ \mathrm{Rot}(\hat z,\theta)=\begin{bmatrix}c_\theta&-s_\theta&0\\s_\theta&c_\theta&0\\0&0&1\end{bmatrix}$$
:::

:::fig rFrames
:::

$\det R=-1$인 직교 행렬(예: $\mathrm{diag}(1,1,-1)$)은 거울 반사라 왼손 좌표계를 만듭니다 — 물체를 실제로 움직여서는 얻을 수 없는 자세입니다.
` },
      { k: '3.2.1b', p: 72, title: '회전 행렬의 세 가지 쓰임', body: R`
:::key 아래첨자 지우기 규칙
$$R_{ab}R_{bc}=R_{ac},\qquad R_{ab}\,p_b=p_a,\qquad R_{ba}=R_{ab}^{-1}=R_{ab}^T$$
안쪽 아래첨자가 같으면 지운다. $p_b$는 벡터 $p$를 {b}의 좌표로 적은 것.
:::

회전 행렬의 쓰임은 셋입니다.
1. **방향을 나타낸다**: $R_{sb}$는 {s}에서 본 {b}의 방향.
2. **좌표계를 바꾼다**: 같은 벡터를 {b} 좌표에서 {s} 좌표로 $p_s=R_{sb}p_b$.
3. **벡터나 좌표계를 돌린다**: 회전 $R=\mathrm{Rot}(\hat\omega,\theta)$로 {b}를 돌리는데, 축 $\hat\omega$를 어느 좌표계에서 읽느냐에 따라 곱하는 쪽이 다르다.

:::key 앞곱과 뒷곱
$$R_{sb'}=\mathrm{Rot}(\hat\omega,\theta)\,R_{sb}\quad(\hat\omega\text{를 고정 좌표계 \{s\}의 축으로 읽음})$$
$$R_{sb''}=R_{sb}\,\mathrm{Rot}(\hat\omega,\theta)\quad(\hat\omega\text{를 물체 좌표계 \{b\}의 축으로 읽음})$$
:::

:::ex 예제 2 — 앞곱과 뒷곱의 차이
$R_{sb}=\mathrm{Rot}(\hat z,90°)$인 {b}를 $\mathrm{Rot}(\hat x,90°)$만큼 돌린다. (a) {s}의 $\hat x_s$ 둘레, (b) {b}의 $\hat x_b$ 둘레로 돌린 결과는?
---
$R_z=\begin{bmatrix}0&-1&0\\1&0&0\\0&0&1\end{bmatrix}$, $R_x=\begin{bmatrix}1&0&0\\0&0&-1\\0&1&0\end{bmatrix}$.
(a) $R_xR_z=\begin{bmatrix}0&-1&0\\0&0&-1\\1&0&0\end{bmatrix}$. (b) $R_zR_x=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}$.
결과가 다릅니다. (b)에서는 $\hat x_b$가 $\hat x_b$ 둘레 회전으로 변하지 않으므로 첫 열 $(0,1,0)$이 그대로입니다.
:::

:::ex 예제 3 — 좌표 바꾸기
$R_{sb}=\mathrm{Rot}(\hat z,90°)$이고 {b}에서 $p_b=(1,2,0)$이다. $p_s$는?
---
$p_s=R_{sb}p_b=(0\cdot1-1\cdot2,\ 1\cdot1+0\cdot2,\ 0)=(-2,1,0)$.
:::

:::note 응력 변환과의 관계
고체역학의 응력 변환 $\sigma'=R^T\sigma R$[[@solid:ch12:7.1a|평면 응력의 변환. 요소를 돌려 본 응력은 회전 행렬로 바뀝니다.]]도 같은 회전 행렬입니다. 벡터는 $R$을 한 번, 텐서(행렬)는 양쪽에서 한 번씩 곱해 좌표를 바꿉니다.
:::
` },
    ],
    problems: [
      { sec: '3.1', type: 'num', lv: 1, q: R`평면에서 벡터 $(1,0)$을 30° 돌렸을 때 $x$ 성분은?`, ans: 'cos(pi/6)', ansTex: R`0.866`,
        sol: R`$P(1,0)^T=(\cos30°,\sin30°)$.` },
      { sec: '3.1', type: 'num', lv: 2, q: R`{b}가 {s}에 대해 90° 돌아 있고 원점이 $(2,1)$에 있다. {b}에서 $(1,0)$인 점의 {s} 좌표 중 $y$는?`, ans: '2', ansTex: R`2`,
        sol: R`$(0,1)+(2,1)=(2,2)$.` },
      { sec: '3.2.1a', type: 'num', lv: 1, q: R`$\mathrm{Rot}(\hat z,60°)$의 대각합(trace)은?`, ans: '1+2*cos(pi/3)', ansTex: R`2`,
        sol: R`$c+c+1=1+2\cos60°=2$.` },
      { sec: '3.2.1a', type: 'mc', lv: 1, q: R`다음 중 $SO(3)$에 속하지 **않는** 행렬은?`,
        choices: [R`$I$`, R`$\mathrm{diag}(1,-1,-1)$`, R`$\mathrm{diag}(1,1,-1)$`, R`$\mathrm{Rot}(\hat y,\pi)$`], ans: 2,
        sol: R`$\mathrm{diag}(1,1,-1)$은 직교하지만 행렬식이 $-1$(반사)입니다. $\mathrm{diag}(1,-1,-1)=\mathrm{Rot}(\hat x,\pi)$.` },
      { sec: '3.2.1a', type: 'num', lv: 1, q: R`회전 행렬의 9개 성분 사이에 독립인 구속이 6개다. 방향의 자유도는?`, ans: '3', ansTex: R`3`,
        sol: R`$9-6=3$.` },
      { sec: '3.2.1a', type: 'mc', lv: 1, q: R`회전 행렬의 역행렬은?`,
        choices: [R`$-R$`, R`$R^T$`, R`$R$ 자신`, R`$\det R\cdot R$`], ans: 1,
        sol: R`$R^TR=I$이므로.` },
      { sec: '3.2.1b', type: 'num', lv: 1, q: R`$R_{sb}=\mathrm{Rot}(\hat z,90°)$, $p_b=(1,2,0)$일 때 $p_s$의 $x$ 성분은?`, ans: '-2', ansTex: R`-2`,
        sol: R`$p_s=(-2,1,0)$.` },
      { sec: '3.2.1b', type: 'num', lv: 2, q: R`$R_{sb}=\mathrm{Rot}(\hat z,90°)$인 {b}를 물체 축 $\hat x_b$ 둘레로 90° 돌린 결과 $R_{sb''}$의 (1, 3) 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$R_{sb''}=R_zR_x$의 첫 행 $(0,0,1)$.` },
      { sec: '3.2.1b', type: 'num', lv: 2, q: R`같은 {b}를 고정 축 $\hat x_s$ 둘레로 90° 돌린 결과 $R_{sb'}$의 (3, 1) 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$R_xR_z$의 셋째 행 $(1,0,0)$.` },
      { sec: '3.2.1b', type: 'num', lv: 2, q: R`$R_{ab}=\mathrm{Rot}(\hat z,30°)$, $R_{bc}=\mathrm{Rot}(\hat z,45°)$일 때 $R_{ac}$의 (1, 1) 성분은?`, ans: 'cos(75*pi/180)', ansTex: R`0.259`,
        sol: R`같은 축 둘레의 회전은 각이 더해집니다: $R_{ac}=\mathrm{Rot}(\hat z,75°)$.` },
      { sec: '3.2.1b', type: 'num', lv: 2, q: R`$R_{ab}=\mathrm{Rot}(\hat z,30°)$일 때 $R_{ba}$의 (1, 2) 성분은?`, ans: '0.5', ansTex: R`0.5`,
        sol: R`$R_{ba}=R_{ab}^T=\mathrm{Rot}(\hat z,-30°)$의 (1, 2) $=\sin30°$.` },
      { sec: '3.2.1b', type: 'mc', lv: 2, q: R`$R_{sb}$ 앞에 $\mathrm{Rot}(\hat\omega,\theta)$를 곱하는 것의 뜻은?`,
        choices: [R`{b}의 축 $\hat\omega$ 둘레로 돌린다`, R`{s}의 축 $\hat\omega$ 둘레로 돌린다`, R`좌표계를 바꾸지 않는다`, R`{s}를 돌린다`], ans: 1,
        sol: R`앞곱은 고정 좌표계에서 읽은 축, 뒷곱은 물체 좌표계에서 읽은 축입니다.` },
      { sec: '3.2.1a', type: 'open', lv: 2, proof: true, q: R`$SO(3)$가 행렬 곱에 대해 닫혀 있고 역원이 $R^T$임을 보이고, 회전 행렬이 벡터의 내적(따라서 길이와 각)을 보존함을 보이세요. $\det R=\pm1$ 중 $+1$만 남기는 이유도 설명하세요.`,
        sol: R`
닫힘: $(R_1R_2)^T(R_1R_2)=R_2^TR_1^TR_1R_2=R_2^TR_2=I$, $\det(R_1R_2)=\det R_1\det R_2=1$.
역원: $R^TR=I$이므로 $R^{-1}=R^T$. $(R^T)^TR^T=RR^T=I$ ($R^TR=I$인 정사각 행렬은 $RR^T=I$도 만족), $\det R^T=\det R=1$ → $R^T\in SO(3)$.
내적 보존: $(Rx)\cdot(Ry)=x^TR^TRy=x^Ty$. 길이($y=x$)와 각(내적/길이)이 보존됩니다.
행렬식: $\det(R^TR)=(\det R)^2=1$ → $\pm1$. 열이 {b}의 축이고 {b}가 오른손 좌표계면 $\det R=\hat x_b\cdot(\hat y_b\times\hat z_b)=\hat x_b\cdot\hat x_b=1$. $-1$은 반사를 포함해 연속적인 운동으로 $I$에서 도달할 수 없습니다(행렬식은 연속적으로 변하므로 $1$에서 $-1$로 건너뛸 수 없음).`,
        rubric: R`
- 곱의 닫힘 — 3점
- 역원 — 2점
- 내적 보존 — 3점
- 행렬식 부호 — 2점` },
    ],
  });
})();
