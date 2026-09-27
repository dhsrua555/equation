/* 14 3차원 강체: 관성 텐서, 주축, 운동에너지 — B&J 9.16–9.18, 18.1–18.4, 수업 필기 5월 18일·25일(보강)·27일, 6월 1일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 14, part: 'C', title: '관성 텐서와 주축', en: 'The Inertia Tensor & Principal Axes', ref: 'B&J 9.16–9.18, 18.1–18.4 · 필기 5/18–6/1', plot: 'dyEllipsoid',
    fig: R`관성 타원체. 주축 방향으로 반지름이 가장 길거나 짧다`,
    tagline: R`평면에서는 각운동량이 Iω 하나였지만, 3차원에서는 각속도와 각운동량이 서로 다른 방향을 가리킬 수 있습니다. 둘을 잇는 것은 3×3 대칭 행렬, 관성 텐서입니다.`,
    summary: R`3차원 강체의 질량 중심에 대한 각운동량 $\mathbf H=\sum\mathbf r'\times m(\boldsymbol\omega\times\mathbf r')$을 성분으로 쓰면 $\mathbf H=I\boldsymbol\omega$이고, $I$는 대각 성분 $I_{xx}=\int(y^2+z^2)dm$과 곱관성 성분으로 된 **대칭 행렬**입니다. 수업에는 두 표기가 나옵니다: 곱관성 모멘트 $I_{xy}=\int xy\,dm$을 쓰고 행렬에 $-I_{xy}$를 넣는 교재 방식, 그리고 텐서 성분 $I_{ij}=\int(r^2\delta_{ij}-x_ix_j)dm$(비대각이 이미 $-\int xy\,dm$). 행렬은 같고 부호만 표기가 다릅니다. 곱관성 모멘트가 있으면 $\mathbf H$는 $\boldsymbol\omega$와 평행하지 않습니다. 대칭 행렬은 **고윳값 분해**로 대각화되고, 고유벡터가 **주축**, 고윳값이 **주관성 모멘트**입니다. 물체가 어떤 평면에 대해 거울 대칭이면 그 평면에 수직인 축은 주축입니다. 다른 점으로는 3차원 **평행축 정리** $I_O=I_G+m(r_G^2\mathbb 1-\mathbf r_G\mathbf r_G^T)$로 옮기고, 운동에너지는 $T=\tfrac12mv_G^2+\tfrac12\boldsymbol\omega^TI_G\boldsymbol\omega$입니다.`,
    goals: [
      R`$\mathbf H=\sum\mathbf r'\times m(\boldsymbol\omega\times\mathbf r')$에서 관성 텐서의 성분을 유도할 수 있다`,
      R`곱관성 모멘트의 두 표기(교재 $I_{xy}=\int xy\,dm$, 텐서 $I_{ij}$)를 구분해 같은 행렬을 쓸 수 있다`,
      R`고윳값과 고유벡터로 주관성 모멘트와 주축을 구하고, 거울 대칭으로 주축을 알아볼 수 있다`,
      R`3차원 평행축 정리를 유도하고 적용할 수 있다`,
      R`3차원 강체의 각운동량과 운동에너지를 계산할 수 있다`,
    ],
    secTitles: { '18.2': '3차원 각운동량', '9.16': '두 가지 표기', '9.17': '주축과 대각화', '9.16b': '3차원 평행축 정리', '18.4': '3차원 운동에너지' },
    sections: [
      { k: '18.2', p: 1147, src: '수업 필기 · 5월 18일', title: '3차원 각운동량과 관성 행렬', body: R`
질량 중심 기준 상대 위치 $\mathbf r_i'=(x_i,y_i,z_i)$, 상대 속도 $\mathbf v_i'=\boldsymbol\omega\times\mathbf r_i'$. 평면이면 $\boldsymbol\omega=\omega\mathbf k$라 $\mathbf H_G=\big(\sum\Delta m_i(x_i^2+y_i^2)\big)\omega\mathbf k=I\omega\mathbf k$(필기). 3차원에서는 $\boldsymbol\omega=(\omega_x,\omega_y,\omega_z)$입니다.

필기의 계산($x$ 성분): $\mathbf v_i'=(\omega_yz_i-\omega_zy_i,\ \omega_zx_i-\omega_xz_i,\ \omega_xy_i-\omega_yx_i)$, $(\mathbf r_i'\times\mathbf v_i')_x=y_iv_{iz}'-z_iv_{iy}'=\omega_x(y_i^2+z_i^2)-\omega_yx_iy_i-\omega_zx_iz_i$. 모두 더하면:

:::key 3차원 각운동량
$$\begin{pmatrix}H_x\\H_y\\H_z\end{pmatrix}=\begin{pmatrix}I_x&-I_{xy}&-I_{xz}\\-I_{xy}&I_y&-I_{yz}\\-I_{xz}&-I_{yz}&I_z\end{pmatrix}\begin{pmatrix}\omega_x\\\omega_y\\\omega_z\end{pmatrix}$$
$$I_x=\int(y^2+z^2)dm,\quad I_y=\int(z^2+x^2)dm,\quad I_z=\int(x^2+y^2)dm,\quad I_{xy}=\int xy\,dm,\ I_{yz}=\int yz\,dm,\ I_{zx}=\int zx\,dm$$
(교재의 곱관성 모멘트 표기). 행렬은 대칭 $I^T=I$이다.
:::

:::note 평면 운동은 특수한 경우
$\boldsymbol\omega=\omega\mathbf k$이면 $\mathbf H=(-I_{xz}\omega,\ -I_{yz}\omega,\ I_z\omega)$. 운동 평면($z=0$)에 대해 대칭인 물체는 $I_{xz}=I_{yz}=0$이라 $\mathbf H=I_z\omega\mathbf k$ — 11단원에서 쓴 $H=I\omega$입니다. 대칭이 아니면 평면에서 도는 물체도 $\mathbf H$가 $z$축에서 기울어져, 일정한 속도로 돌려도 축에 모멘트가 필요합니다(15단원의 불균형 바퀴).
:::
` },
      { k: '9.16', src: '수업 필기 · 5월 25일(보강), 5월 27일, 6월 1일', title: '두 가지 표기: 곱관성 모멘트와 텐서 성분', body: R`
보강 강의와 6월 1일 필기는 한 줄로 모든 성분을 쓰는 **텐서 표기**를 씁니다.

:::key 관성 텐서 (텐서 표기)
$$I_{ij}=\int\big(r^2\delta_{ij}-x_ix_j\big)dm,\qquad\delta_{ij}=\begin{cases}1&i=j\\0&i\ne j\end{cases},\qquad(x_1,x_2,x_3)=(x,y,z)$$
예: $I_{11}=\int(x^2+y^2+z^2-x^2)dm=\int(y^2+z^2)dm$, $I_{12}=-\int xy\,dm$. 행렬은 $\mathbf H=[I_{ij}]\boldsymbol\omega$로 곧바로 쓴다.
:::

:::warn 필기끼리 다른 부호 표기 — 섞지 말 것
- 5월 18일·27일 필기와 교재: $I_{xy}=+\int xy\,dm$(곱관성 모멘트), 행렬 성분은 $-I_{xy}$.
- 5월 25일(보강)·6월 1일 필기: $I_{xy}=-\int xy\,dm$(텐서 성분), 행렬 성분은 $I_{xy}$ 그대로.
두 행렬은 **같습니다**. 예를 들어 아래 아령에서 $\int xy\,dm=2$이므로 교재식은 “$I_{xy}=2$, 행렬 성분 $-2$”, 텐서식은 “$I_{xy}=-2$, 행렬 성분 $-2$”입니다. 5월 18일 필기의 예제는 텐서식 부호($I_{xy}=-\sum m_ix_iy_i=-2$)로 계산한 뒤 교재식 행렬 틀에 넣지 않고 성분을 그대로 넣어 맞는 행렬을 얻었습니다. 한 문제 안에서는 한 표기만 쓰고, 행렬 성분 $=-\int xy\,dm$임을 확인하세요.
:::

:::fig dDumbbell
:::

:::ex 예제 1 — 아령 (필기)
질량 1 kg 두 개가 $(1,1,0)$, $(-1,-1,0)$ m에 있다(막대 질량 무시). 원점에 대한 관성 행렬은?
---
$I_{xx}=\sum m(y^2+z^2)=1+1=2$, $I_{yy}=2$, $I_{zz}=\sum m(x^2+y^2)=4$.
$\int xy\,dm=1\cdot1\cdot1+1\cdot(-1)(-1)=2$, $\int yz\,dm=\int zx\,dm=0$.
$$I=\begin{pmatrix}2&-2&0\\-2&2&0\\0&0&4\end{pmatrix}\ \text{kg}\cdot\text{m}^2.$$
$\boldsymbol\omega=\omega\mathbf i$로 돌리면 $\mathbf H=(2\omega,-2\omega,0)$ — $\boldsymbol\omega$와 45° 어긋납니다(필기: “$\boldsymbol\omega$의 방향 ≠ $\mathbf H$의 방향”).
:::
` },
      { k: '9.17', p: 533, src: '수업 필기 · 5월 27일, 6월 1일', title: '주축과 대각화', body: R`
:::key 주축과 주관성 모멘트
관성 행렬 $I$는 실대칭이므로 서로 수직인 세 고유벡터 $\mathbf v_1,\mathbf v_2,\mathbf v_3$와 실수 고윳값 $\lambda_1,\lambda_2,\lambda_3\ge0$가 있다[[@em:ch07:8.3|대칭 행렬의 고윳값은 실수이고 고유벡터는 서로 직교합니다.]]. 고유벡터 방향의 좌표축(**주축**)에서
$$I'=\begin{pmatrix}\lambda_1&0&0\\0&\lambda_2&0\\0&0&\lambda_3\end{pmatrix},\qquad\mathbf H=\lambda_1\omega_1\mathbf e_1+\lambda_2\omega_2\mathbf e_2+\lambda_3\omega_3\mathbf e_3.$$
주축 둘레로 돌리면 $\mathbf H\parallel\boldsymbol\omega$.
:::

:::ex 예제 2 — 아령의 주축 (필기)
예제 1의 행렬을 대각화하면?
---
$\det(I-\lambda\mathbb 1)=(4-\lambda)\big[(2-\lambda)^2-4\big]=(4-\lambda)\lambda(\lambda-4)$ → $\lambda=0,4,4$.
$\lambda=0$: $\mathbf v_1=\tfrac1{\sqrt2}(1,1,0)$(막대 방향 — 질량이 모두 축 위). $\lambda=4$: $\tfrac1{\sqrt2}(1,-1,0)$, $(0,0,1)$(막대에 수직인 모든 방향).
확인: 막대에 수직인 축에 대해 $I=2\cdot1\cdot(\sqrt2)^2=4$ ✓.
:::

:::key 거울 대칭과 주축 (필기의 Fact)
강체가 평면 $\Pi$에 대해 거울 대칭이면(질량 분포까지), $\Pi$에 수직인 모든 축은 주축이다. 예: $yz$ 평면에 대해 대칭이면 $\int xy\,dm=\int xz\,dm=0$(점 $(x,y,z)$와 $(-x,y,z)$가 짝을 이뤄 상쇄) → $x$축은 주축.
:::

:::ex 예제 3 — 원판의 곱관성 모멘트 (보강 필기)
반지름 $R$, 면밀도 $\rho$인 원판($xy$ 평면, 중심이 원점)의 $\int xy\,dm$은?
---
직접: $\rho\int_0^R\int_0^{2\pi}r^3\cos\theta\sin\theta\,d\theta\,dr=\rho\tfrac{R^4}4\int_0^{2\pi}\tfrac12\sin2\theta\,d\theta=0$.
대칭으로: $yz$ 평면에 대한 거울 대칭 → 계산 없이 0. $I_{\text{cm}}=\mathrm{diag}\big(\tfrac14mR^2,\tfrac14mR^2,\tfrac12mR^2\big)$.
:::
` },
      { k: '9.16b', src: '수업 필기 · 5월 25일(보강), 6월 1일', title: '3차원 평행축 정리', body: R`
:::key 3차원 평행축 정리
$O$에서 질량 중심까지 $\mathbf r_G=(x_G,y_G,z_G)$이면
$$I_{ij,O}=I_{ij,G}+m\big(r_G^2\delta_{ij}-x_{i,G}x_{j,G}\big),\qquad I_O=I_G+m\begin{pmatrix}y_G^2+z_G^2&-x_Gy_G&-x_Gz_G\\-x_Gy_G&x_G^2+z_G^2&-y_Gz_G\\-x_Gz_G&-y_Gz_G&x_G^2+y_G^2\end{pmatrix}$$
(텐서 표기. 교재 표기로 곱관성은 $I_{xy,O}=I_{xy,G}+mx_Gy_G$.)
:::

유도(보강 필기): $\mathbf r=\mathbf r_G+\mathbf r'$을 $\int(r^2\delta_{ij}-x_ix_j)dm$에 넣고 전개하면, $\mathbf r_G$만의 항(“질량 중심의 정보”), $\mathbf r'$만의 항($I_{ij,G}$), 교차항 $2\delta_{ij}\mathbf r_G\cdot\int\mathbf r'dm-x_{j,G}\int x_i'dm-x_{i,G}\int x_j'dm$이 나오고, 교차항은 $\int\mathbf r'dm=\mathbf 0$으로 모두 사라집니다. $i=j=1$이면 $I_{xx,O}=I_{xx,G}+m(y_G^2+z_G^2)=I_{xx,G}+md^2$ — 2차원 정리 그대로.

:::ex 예제 4 — 축 끝에 달린 원판 (보강 필기)
질량 $m$, 반지름 $r$인 원판의 중심 $G$가 원점에서 $x$축을 따라 $L$에 있고 원판면이 $yz$ 평면과 평행하다. 원점에 대한 $I_{xx,O}$, $I_{yy,O}$는?
---
$I_{xx,G}=\tfrac12mr^2$(원판 축), $I_{yy,G}=I_{zz,G}=\tfrac14mr^2$(지름). $\mathbf r_G=(L,0,0)$.
$I_{xx,O}=\tfrac12mr^2+0$, $I_{yy,O}=\tfrac14mr^2+mL^2$, 곱관성은 모두 0(대칭).
:::
` },
      { k: '18.4', p: 1152, src: '수업 필기 · 5월 25일(보강), 5월 27일', title: '3차원 강체의 운동에너지', body: R`
$T=\tfrac12\int v^2dm$에서 고정점 $O$에 대한 순수 회전($\mathbf v=\boldsymbol\omega\times\mathbf r$)이면 $\lvert\boldsymbol\omega\times\mathbf r\rvert^2=\omega^2r^2-(\boldsymbol\omega\cdot\mathbf r)^2$(라그랑주 항등식)으로 전개해:

:::key 3차원 운동에너지
$$T=\tfrac12\boldsymbol\omega^TI_O\boldsymbol\omega=\tfrac12\big(I_x\omega_x^2+I_y\omega_y^2+I_z\omega_z^2\big)-I_{xy}\omega_x\omega_y-I_{yz}\omega_y\omega_z-I_{zx}\omega_z\omega_x\ (\text{교재 표기})$$
일반 운동은 $T=\tfrac12mv_G^2+\tfrac12\boldsymbol\omega^TI_G\boldsymbol\omega$. 주축이면 곱항이 사라진다.
:::

:::warn 텐서 표기에서는 곱항의 부호가 +
텐서 성분($I_{xy}=-\int xy\,dm$)으로 쓰면 $T=\tfrac12\sum_{i,j}I_{ij}\omega_i\omega_j=\tfrac12(I_{xx}\omega_x^2+\cdots)+I_{xy}\omega_x\omega_y+\cdots$입니다. 보강 필기의 “$+I_{xy}\omega_x\omega_y$”와 5월 27일 필기의 “$-\omega_x\omega_yI_{xy}$”는 표기만 다르고 같은 값입니다.
:::

:::ex 예제 5 — 축 끝에서 구르는 원판 (보강 필기)
예제 4의 원판이 자기 축에 대해 $\omega_1$로 돌며, 축이 원점을 지나는 연직 $y$축 둘레로 돌아 원판이 수평면 위를 미끄러지지 않고 구른다. 원판의 각속도, 원점에 대한 각운동량과 운동에너지는?
---
구름: 중심의 속력을 두 방법으로 쓰면 $r\omega_1=L\lvert\omega_2\rvert$ → $\boldsymbol\omega=\omega_1\mathbf i-\tfrac rL\omega_1\mathbf j$(돌아가는 방향이 음의 $y$).
주축($x,y,z$)이므로 $\mathbf H_O=I_{xx,O}\omega_x\mathbf i+I_{yy,O}\omega_y\mathbf j=\tfrac12mr^2\omega_1\mathbf i-\big(\tfrac14mr^2+mL^2\big)\tfrac rL\omega_1\mathbf j$.
$T=\tfrac12\cdot\tfrac12mr^2\omega_1^2+\tfrac12\big(\tfrac14mr^2+mL^2\big)\tfrac{r^2}{L^2}\omega_1^2$.
질량 중심에 대해: $\mathbf H_G=\tfrac12mr^2\omega_1\mathbf i-\tfrac14mr^2\tfrac rL\omega_1\mathbf j$, $\mathbf L=m\mathbf v_G$, $\lvert\mathbf v_G\rvert=r\omega_1$(수평, $z$ 방향).
:::
` },
    ],
    problems: [
      { sec: '18.2', type: 'num', lv: 1, q: R`질점 1 kg이 $(0,2,1)$ m에 있다. 원점에 대한 $I_x=\sum m(y^2+z^2)$(kg·m²)는?`, ans: '5', ansTex: R`5`,
        sol: R`$4+1=5$.` },
      { sec: '18.2', type: 'mc', lv: 1, q: R`각운동량 $\mathbf H$가 각속도 $\boldsymbol\omega$와 평행하지 않을 수 있는 이유는?`,
        choices: [R`질량이 변하기 때문`, R`곱관성 모멘트가 0이 아닐 수 있어 $I\boldsymbol\omega$가 $\boldsymbol\omega$와 다른 방향이 되기 때문`, R`코리올리 효과 때문`, R`평행축 정리 때문`], ans: 1,
        sol: R`$I$가 대각이 아니면(주축이 아니면) $\mathbf H=I\boldsymbol\omega$는 일반적으로 $\boldsymbol\omega$와 평행하지 않습니다.` },
      { sec: '9.16', type: 'num', lv: 2, q: R`질량 2 kg 질점이 $(1,-2,3)$ m에 있다. 텐서 표기 $I_{12}=-\int xy\,dm$(kg·m²)는?`, ans: '4', ansTex: R`4`,
        sol: R`$-2(1)(-2)=4$. 교재 표기로는 $I_{xy}=\int xy\,dm=-4$이고, 행렬 성분은 어느 쪽이든 $+4$입니다.` },
      { sec: '9.16', type: 'num', lv: 2, q: R`예제 1의 아령을 $\boldsymbol\omega=3\mathbf i$ rad/s로 돌릴 때 $H_y$(kg·m²/s)는?`, ans: '-6', ansTex: R`-6`,
        sol: R`$H_y=-\big(\int xy\,dm\big)\omega_x=-2(3)=-6$.` },
      { sec: '9.17', type: 'num', lv: 2, q: R`관성 행렬 $\begin{pmatrix}3&-1&0\\-1&3&0\\0&0&5\end{pmatrix}$의 가장 작은 주관성 모멘트는?`, ans: '2', ansTex: R`2`,
        sol: R`$2\times2$ 블록의 고윳값 $3\pm1$ → 2, 4. 그리고 5. 가장 작은 값 2(주축 $\tfrac1{\sqrt2}(1,1,0)$).` },
      { sec: '9.17', type: 'mc', lv: 2, q: R`균일한 직육면체 상자의 질량 중심을 지나며 면에 수직인 세 축에 대해 옳은 것은?`,
        choices: [R`주축이 아니다`, R`세 축 모두 주축이다(세 대칭면에 수직)`, R`한 축만 주축이다`, R`곱관성 모멘트가 모두 같다`], ans: 1,
        sol: R`세 대칭면이 있고 각 면에 수직인 축이 주축입니다.` },
      { sec: '9.17', type: 'num', lv: 2, q: R`예제 2의 아령에서 $\tfrac1{\sqrt2}(1,-1,0)$ 방향 축에 대한 관성 모멘트(kg·m²)는?`, ans: '4', ansTex: R`4`,
        sol: R`$\mathbf v^TI\mathbf v=\tfrac12(2+2+2+2)=4$. 고윳값과 같습니다.` },
      { sec: '9.16b', type: 'num', lv: 2, q: R`예제 4의 원판($m=2$ kg, $r=0.2$ m, $L=0.5$ m)의 $I_{yy,O}$(kg·m²)는?`, ans: '0.25*2*0.04+2*0.25', ansTex: R`0.52`,
        sol: R`$\tfrac14mr^2+mL^2=0.02+0.5=0.52$.` },
      { sec: '9.16b', type: 'num', lv: 3, q: R`질량 3 kg 물체의 질량 중심이 $(1,2,0)$ m, $I_{xy,G}=0$(교재 표기)이다. 원점에 대한 교재 표기 곱관성 모멘트 $I_{xy,O}=\int xy\,dm$(kg·m²)는?`, ans: '6', ansTex: R`6`,
        sol: R`$I_{xy,O}=I_{xy,G}+mx_Gy_G=0+3(1)(2)=6$. 행렬 성분은 $-6$.` },
      { sec: '18.4', type: 'num', lv: 2, q: R`주축에 대한 주관성 모멘트가 $(2,3,4)$ kg·m²인 물체가 $\boldsymbol\omega=(1,2,1)$ rad/s(주축 성분)로 돈다. 회전 운동에너지(J)는?`, ans: '0.5*(2+12+4)', ansTex: R`9`,
        sol: R`$\tfrac12(2\cdot1+3\cdot4+4\cdot1)=9$ J.` },
      { sec: '18.4', type: 'num', lv: 3, q: R`예제 1의 아령을 원점 둘레로 $\boldsymbol\omega=(2,0,0)$ rad/s로 돌린다. 운동에너지(J)는?`, ans: '4', ansTex: R`4`,
        sol: R`$\tfrac12\boldsymbol\omega^TI\boldsymbol\omega=\tfrac12(2)(4)=4$ J. 직접: 두 질량이 $x$축에서 거리 1로 2 m/s — $2\times\tfrac12\cdot1\cdot4=4$ ✓.` },
      { sec: '9.17', type: 'open', lv: 2, proof: true, q: R`강체가 $yz$ 평면에 대해 거울 대칭이면 $x$축이 주축임을 보이세요.`,
        sol: R`
주축의 조건: $\boldsymbol\omega=\omega\mathbf i$일 때 $\mathbf H\parallel\mathbf i$, 곧 행렬의 첫 열의 비대각 성분 $-\int xy\,dm$, $-\int xz\,dm$이 0.
거울 대칭: 점 $(x,y,z)$의 질량 요소마다 $(-x,y,z)$에 같은 질량이 있습니다. 두 요소의 $xy\,dm$은 $xy$와 $-xy$로 상쇄되므로 $\int xy\,dm=0$, 같은 이유로 $\int xz\,dm=0$.
따라서 $I\mathbf i=I_x\mathbf i$ — $\mathbf i$는 고유벡터, $x$축은 주축.`,
        rubric: R`
- 주축 조건을 곱관성 성분으로 — 3점
- 대칭 짝의 상쇄 — 5점
- 결론 — 2점` },
      { sec: '9.16b', type: 'open', lv: 3, proof: true, q: R`텐서 표기 $I_{ij,O}=\int(r^2\delta_{ij}-x_ix_j)dm$에 $\mathbf r=\mathbf r_G+\mathbf r'$을 넣어 3차원 평행축 정리를 유도하세요.`,
        sol: R`
$r^2=r_G^2+2\mathbf r_G\cdot\mathbf r'+r'^2$, $x_ix_j=x_{iG}x_{jG}+x_{iG}x_j'+x_i'x_{jG}+x_i'x_j'$.
$I_{ij,O}=\int(r_G^2\delta_{ij}-x_{iG}x_{jG})dm+\int(r'^2\delta_{ij}-x_i'x_j')dm+\int\big(2\delta_{ij}\mathbf r_G\cdot\mathbf r'-x_{iG}x_j'-x_i'x_{jG}\big)dm$.
첫 항 $=m(r_G^2\delta_{ij}-x_{iG}x_{jG})$, 둘째 항 $=I_{ij,G}$. 셋째 항은 $\int\mathbf r'dm=\mathbf 0$(질량 중심의 정의)이라 0.`,
        rubric: R`
- 전개 — 4점
- 세 무리로 나눔 — 3점
- 교차항 소멸의 근거 — 3점` },
    ],
  });
})();
