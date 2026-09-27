/* 11 강체의 평면 운동역학: 관성 모멘트, 운동 방정식, 구름, 타격 중심 — B&J 9.11–9.15, 16.1–16.8, 수업 필기 5월 4일·6일·11일·13일·18일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 11, part: 'C', title: '강체의 평면 운동역학: ΣF = ma, ΣM = Iα', en: 'Plane Motion of Rigid Bodies: Forces & Accelerations', ref: 'B&J 9.11–9.15, 16.1–16.8 · 필기 5/4–5/18', plot: 'dyInertia',
    fig: R`같은 질량과 반지름의 고리, 원판, 속 빈 구, 속찬 구가 경사면을 구르는 가속도 비교`,
    tagline: R`강체는 질량 중심으로 병진하고 질량 중심에 대해 회전합니다. 병진을 정하는 것이 질량이라면 회전을 정하는 것은 질량이 축에서 얼마나 멀리 퍼져 있는가, 곧 관성 모멘트입니다.`,
    summary: R`강체의 평면 운동은 두 식으로 정해집니다: $\sum\mathbf F=m\mathbf a_G$(질량 중심의 병진)와 $\sum M_G=I_G\alpha$(질량 중심에 대한 회전). **관성 모멘트** $I=\int r^2dm$은 축에서의 거리의 제곱으로 질량을 모은 값이고, 원판 $\tfrac12MR^2$, 직사각형 판 $\tfrac1{12}M(a^2+b^2)$, 속 빈 구 $\tfrac23MR^2$, 가는 막대 $\tfrac1{12}ML^2$입니다. 다른 축으로는 **평행축 정리** $I_O=I_G+md^2$로 옮기므로 도심축의 값이 최소입니다. 고정점 $O$에 대해 회전하는 물체는 $\sum M_O=I_O\alpha$를 바로 쓸 수 있습니다. **미끄러지지 않고 구르는** 원판은 $a=r\alpha$와 $f\le\mu_sN$을 함께 확인해야 하고(경사면에서 $a=\tfrac23g\sin\theta$, 조건 $\tan\theta\le3\mu_s$), 조건이 깨지면 $f=\mu_kN$으로 다시 풉니다. 막대의 한 점을 치거나 밀 때 축의 반력이 0이 되는 점이 **타격 중심**이고, 그 위치는 축에서 $I_O/(m\bar r)$입니다.`,
    goals: [
      R`질점계의 각운동량에서 $\sum M_G=I_G\alpha$를 유도할 수 있다`,
      R`원판, 직사각형 판, 속 빈 구, 막대의 관성 모멘트를 적분으로 구할 수 있다`,
      R`평행축 정리를 유도하고 적용할 수 있다`,
      R`고정축 회전, 일반 평면 운동의 운동 방정식을 세우고 반력과 가속도를 구할 수 있다`,
      R`구름 조건과 미끄러짐 조건을 판정하고 각각의 운동을 구할 수 있다`,
      R`타격 중심의 위치를 유도하고 그 뜻(축 반력 0)을 설명할 수 있다`,
    ],
    secTitles: { '16.2': '강체의 운동 방정식', '9.11': '관성 모멘트', '9.12': '평행축 정리', '16.8a': '고정축 회전', '16.8b': '구름과 미끄러짐', '16.8c': '타격 중심' },
    sections: [
      { k: '16.2', p: 1027, src: '수업 필기 · 5월 4일', title: '강체의 운동 방정식', body: R`
강체는 질점이 무한히 많은 계입니다(필기의 “Fact #1”). 9단원의 질점계 결과를 그대로 씁니다.

:::key 강체의 평면 운동 방정식
$$\sum\mathbf F=m\mathbf a_G,\qquad\sum M_G=I_G\alpha,\qquad I_G=\int r'^2dm$$
$r'$은 질량 중심을 지나고 운동 평면에 수직인 축에서의 거리. 평면 문제의 식은 세 개: $\sum F_x=ma_{Gx}$, $\sum F_y=ma_{Gy}$, $\sum M_G=I_G\alpha$.
:::

**질점 하나.** 반지름 $r$의 원 위를 도는 질점(필기의 강철 레일 위 구슬)은 $\mathbf v=\boldsymbol\omega\times\mathbf r$, 각운동량의 변화율은
$$\frac{d}{dt}(\mathbf r\times m\mathbf v)=\mathbf r\times m\frac{d}{dt}(\boldsymbol\omega\times\mathbf r)=m\big[\mathbf r\times(\boldsymbol\alpha\times\mathbf r)+\mathbf r\times(\boldsymbol\omega\times\mathbf v)\big].$$
평면에서 첫 항은 $mr^2\alpha\,\mathbf k$, 둘째 항은 $\mathbf r\times(\boldsymbol\omega\times\mathbf v)=\boldsymbol\omega(\mathbf r\cdot\mathbf v)-\mathbf v(\mathbf r\cdot\boldsymbol\omega)=\mathbf 0$($\mathbf r\perp\mathbf v$, $\mathbf r\perp\boldsymbol\omega$). 따라서 $\sum M=mr^2\alpha$.
**질점계·강체.** 질량 중심에 대한 상대 위치로 모두 더하면 $\sum M_G=\big(\sum m_ir_i'^2\big)\alpha=I_G\alpha$.

:::warn 모멘트 중심을 아무 점으로 잡으면 안 된다
$\sum M=I\alpha$는 (1) 질량 중심 $G$에 대해, 또는 (2) 고정점 $O$에 대해($I_O$ 사용)만 이 꼴입니다. 가속하는 다른 점 $P$에 대해서는 $\sum M_P=I_G\alpha+(\mathbf r_{G/P}\times m\mathbf a_G)_z$처럼 $m\mathbf a_G$의 모멘트가 더해집니다(필기 5월 6일의 두 계산: $G$에 대해 쓴 것과 $P$에 대해 쓴 것).
:::
` },
      { k: '9.11', p: 512, src: '수업 필기 · 5월 4일', title: '질량 관성 모멘트 계산', body: R`
:::key 관성 모멘트와 대표 값
$$I=\int r^2dm,\qquad I=mk^2\ (k:\text{ 회전 반지름})$$
| 물체 (질량중심축) | $I_G$ |
|---|---|
| 가는 막대(길이 $L$, 가운데 수직축) | $\tfrac1{12}mL^2$ |
| 원판·원기둥(축) | $\tfrac12mR^2$ |
| 얇은 고리·속 빈 원통(축) | $mR^2$ |
| 직사각형 판($a\times b$, 판에 수직인 축) | $\tfrac1{12}m(a^2+b^2)$ |
| 속 빈 구(얇은 껍질) | $\tfrac23mR^2$ |
| 속찬 구 | $\tfrac25mR^2$ |
:::

:::ex 예제 1 — 원판 (필기)
두께 $t$, 밀도 $\rho$, 반지름 $R$인 원판의 축에 대한 관성 모멘트는?
---
반지름 $r$, 폭 $dr$, 각 $d\theta$인 조각의 넓이는 $r\,dr\,d\theta$(필기는 두 부채꼴의 차 $\tfrac12(r+dr)^2d\theta-\tfrac12r^2d\theta$에서 고차항 $dr^2d\theta$를 버려 얻었습니다). $dm=\rho t\,r\,dr\,d\theta$.
$I=\int_0^{2\pi}\int_0^Rr^2\rho t\,r\,dr\,d\theta=\rho t\cdot2\pi\cdot\tfrac14R^4=\tfrac12(\rho t\pi R^2)R^2=\tfrac12MR^2$.
:::

:::ex 예제 2 — 직사각형 판 (필기)
가로 $a$, 세로 $b$인 판(가운데 수직축): $I=\rho t\int_{-b/2}^{b/2}\int_{-a/2}^{a/2}(x^2+y^2)dx\,dy=\rho t\big(\tfrac1{12}a^3b+\tfrac1{12}ab^3\big)=\tfrac1{12}M(a^2+b^2)$.
:::

:::ex 예제 3 — 속 빈 구 (필기)
반지름 $R$, 면밀도 $\rho$인 얇은 구 껍질의 지름에 대한 관성 모멘트는?
---
축과 각 $\theta$인 띠: 반지름 $R\sin\theta$, 폭 $R\,d\theta$ → 넓이 $2\pi R\sin\theta\cdot R\,d\theta$, 축에서의 거리 $R\sin\theta$.
$I=\int_0^\pi(R\sin\theta)^2\rho\,2\pi R^2\sin\theta\,d\theta=2\pi\rho R^4\int_0^\pi\sin^3\theta\,d\theta$.
$u=\cos\theta$로 $\int_0^\pi\sin^3\theta\,d\theta=\int_{-1}^1(1-u^2)du=\tfrac43$. $I=\tfrac83\pi\rho R^4=\tfrac23(4\pi R^2\rho)R^2=\tfrac23MR^2$.
:::

:::note 같은 질량, 다른 분포
고리 $mR^2$ > 속 빈 구 $\tfrac23mR^2$ > 원판 $\tfrac12mR^2$ > 속찬 구 $\tfrac25mR^2$. 질량이 축에서 멀수록 돌리기 어렵습니다. 고체역학의 단면 2차 모멘트[[@solid:ch08:4.2b|단면 2차 모멘트 $\int y^2dA$. 질량 대신 넓이를 모은 같은 꼴의 적분입니다.]]와 적분의 모양이 같습니다.
:::
` },
      { k: '9.12', p: 514, src: '수업 필기 · 5월 4일, 6일', title: '평행축 정리', body: R`
:::key 평행축 정리
질량 중심 $G$를 지나는 축과 평행하고 거리 $d$만큼 떨어진 축 $O$에 대해
$$I_O=I_G+md^2,\qquad\text{따라서 }I_O\ge I_G.$$
:::

유도(필기): $O$를 원점으로 $\mathbf r=\bar{\mathbf r}+\mathbf r'$($\bar{\mathbf r}=(\bar x,\bar y)$: 질량 중심).
$$I_O=\int(x^2+y^2)dm=\int\big[(\bar x+x')^2+(\bar y+y')^2\big]dm=(\bar x^2+\bar y^2)m+\int(x'^2+y'^2)dm+2\bar x\int x'dm+2\bar y\int y'dm.$$
질량 중심의 정의에서 $\int x'dm=\int y'dm=0$이므로 마지막 두 항이 사라집니다.

:::ex 예제 4
가는 막대(길이 $L$)의 한 끝에 대한 관성 모멘트는?
---
$I_O=\tfrac1{12}mL^2+m(L/2)^2=\tfrac13mL^2$.
:::

:::warn 평행축 정리는 G를 거쳐야 한다
$I_A$에서 $I_B$로 바로 옮기면 틀립니다: $I_B=I_A+m(d_B^2-d_A^2)$처럼 두 축 모두 $G$에서의 거리로 계산해야 합니다. 예: 막대의 한 끝에서 다른 끝으로 옮길 때 $I$는 변하지 않지만 $+mL^2$를 더하면 틀린 답이 나옵니다.
:::
` },
      { k: '16.8a', p: 1052, src: '수업 필기 · 5월 6일', title: '고정축 회전: 핀으로 받친 막대', body: R`
:::key 고정축 회전
고정점 $O$에 대해 회전하는 강체는
$$\sum M_O=I_O\alpha,\qquad a_{Gt}=\bar r\alpha,\qquad a_{Gn}=\bar r\omega^2$$
($\bar r$: $O$에서 $G$까지). 반력은 $\sum\mathbf F=m\mathbf a_G$의 두 성분에서 구한다.
:::

:::fig dPinRod
:::

:::ex 예제 5 — 수평에서 놓은 막대 (필기)
길이 $L$, 질량 $m$인 막대의 한 끝 $P$를 핀으로 받치고 수평으로 들었다가 놓았다. 놓는 순간 각가속도와 핀 반력은?
---
$P$에 대한 모멘트: $mg\tfrac L2=\tfrac13mL^2\alpha$ → $\alpha=\dfrac{3g}{2L}$.
$a_G=\tfrac L2\alpha=\tfrac34g$(아래). 연직: $R_y-mg=-m\tfrac34g$ → $R_y=\tfrac14mg$. 수평: $\omega=0$이라 $a_{Gn}=0$, $R_x=0$.
필기처럼 $G$에 대해 쓰면: $\sum M_G=R_y\tfrac L2=\tfrac1{12}mL^2\alpha$와 $\sum F_y$를 연립해 같은 답을 얻습니다.
:::

:::ex 예제 6 — 매달린 원판
반지름 0.2 m, 질량 4 kg인 원판이 가장자리의 핀에 매달려 있다가 지름이 수평인 위치에서 놓였다. 놓는 순간 각가속도는?
---
$I_O=\tfrac12mR^2+mR^2=\tfrac32mR^2$. $mgR=\tfrac32mR^2\alpha$ → $\alpha=\dfrac{2g}{3R}=32.7$ rad/s².
:::
` },
      { k: '16.8b', p: 1054, src: '수업 필기 · 5월 6일, 11일', title: '구름과 미끄러짐', body: R`
미끄러지지 않고 구르면 접촉점의 속도가 0이라 $v_G=r\omega$, $a_G=r\alpha$(9단원). 이 구속과 함께 **마찰 조건**을 반드시 확인합니다.

:::key 구름의 두 조건 (필기)
1. 운동학: $a_G=r\alpha$.
2. 힘: 필요한 정지 마찰 $\lvert f\rvert\le\mu_sN$. 만족하지 않으면 미끄러지며 $f=\mu_kN$(방향은 접촉점의 상대 미끄럼 반대), $a_G\ne r\alpha$.
:::

:::fig dRollIncline
:::

:::ex 예제 7 — 경사면을 구르는 원판 (필기)
경사각 $\theta$인 면을 원판(질량 $m$, 반지름 $r$)이 굴러 내려간다. 가속도, 마찰력, 미끄러지지 않을 조건은?
---
$\sum F_x=mg\sin\theta-f=ma$, $\sum F_y=N-mg\cos\theta=0$, $\sum M_G=fr=\tfrac12mr^2\alpha$.
$a=r\alpha$로 $f=\tfrac12ma$, 따라서 $mg\sin\theta=\tfrac32ma$:
$$a=\tfrac23g\sin\theta,\qquad f=\tfrac13mg\sin\theta,\qquad f\le\mu_smg\cos\theta\iff\tan\theta\le3\mu_s.$$
일반적으로 회전 반지름 $k$인 물체는 $a=\dfrac{g\sin\theta}{1+k^2/r^2}$: 고리 $\tfrac12g\sin\theta$, 원판 $\tfrac23$, 속찬 구 $\tfrac57$.
:::

:::ex 예제 8 — 미끄러지며 구르는 경우 (필기)
$\tan\theta>3\mu_s$라 미끄러지면?
---
$f=\mu_kmg\cos\theta$. $a=g(\sin\theta-\mu_k\cos\theta)$, $\alpha=\dfrac{fr}{\frac12mr^2}=\dfrac{2\mu_kg\cos\theta}{r}$. 이제 $a\ne r\alpha$입니다.
$\theta=30°$, $\mu_k=0.1$, $r=0.2$ m면 $a=4.06$ m/s², $\alpha=8.50$ rad/s²($r\alpha=1.70<a$ — 중심이 굴러야 할 속도보다 빨리 미끄러져 내려감).
:::

:::warn 구름에서 마찰의 방향은 미리 모른다
경사면에서는 마찰이 위를 향하지만, 수평면의 바퀴를 중심보다 위에서 밀면 마찰이 **앞**을 향할 수도 있습니다. 방향을 가정하고 풀어 부호로 판단합니다.
:::
` },
      { k: '16.8c', p: 1056, src: '수업 필기 · 5월 13일, 18일', title: '타격 중심', body: R`
연직 막대의 아래끝 $O$가 핀이고, 질량 중심 위 $x$만큼인 점에 수평 힘 $F$를 준다($O$에서 $G$까지 $\bar r$).

:::key 타격 중심
$$\sum F=F-N=ma_G,\quad\sum M_G=xF+\bar rN=I_G\alpha,\quad a_G=\bar r\alpha\ (O\text{ 고정})$$
$$\Longrightarrow\quad N=\frac{\frac{I_G}{m\bar r}-x}{\bar r+\frac{I_G}{m\bar r}}F,\qquad N=0\iff x=\frac{I_G}{m\bar r}.$$
핀에서 잰 거리로는 $\bar r+\dfrac{I_G}{m\bar r}=\dfrac{I_O}{m\bar r}$. 이 점을 치면 핀이 힘을 받지 않는다.
:::

가는 막대(길이 $L$, 끝이 핀)면 $\bar r=L/2$, $I_G=\tfrac1{12}mL^2$ → $x=L/6$, 핀에서 $\tfrac23L$. 야구 배트의 “스위트 스폿”에서 손이 울리지 않는 이유입니다.

:::note 자율주행의 타격 중심 (필기 5월 18일)
위에서 본 차량을 강체로 보면 앞바퀴와 뒷바퀴의 옆 방향 타이어 힘 $F_f$, $F_r$이
$$\sum F_y=F_f+F_r=ma_y,\qquad I\alpha=l_fF_f-l_rF_r$$
를 줍니다($l_f$, $l_r$: 질량 중심에서 앞·뒤 차축까지). 뒷차축에 대한 타격 중심, 곧 질량 중심 앞 $I/(ml_r)$인 점의 옆 가속도는
$$a_{y,\text{cop}}=a_y+\frac{I}{ml_r}\alpha=\frac{l_f+l_r}{l_r}\frac{F_f}{m}$$
로 $F_r$이 사라집니다. 조향으로 조절할 수 있는 $F_f$만으로 그 점의 옆 운동이 정해지므로, 추정하기 어려운 뒷바퀴 힘 없이 경로 추종 제어를 설계할 수 있습니다.
:::
` },
    ],
    problems: [
      { sec: '9.11', type: 'num', lv: 1, q: R`질량 3 kg, 반지름 0.4 m 원판의 축에 대한 관성 모멘트(kg·m²)는?`, ans: '0.24', ansTex: R`0.24`,
        sol: R`$\tfrac12(3)(0.16)=0.24$.` },
      { sec: '9.11', type: 'num', lv: 1, q: R`0.6 m × 0.8 m, 질량 5 kg 직사각형 판의 가운데 수직축에 대한 관성 모멘트(kg·m²)는?`, ans: '5*(0.36+0.64)/12', ansTex: R`0.417`,
        sol: R`$\tfrac1{12}(5)(1.0)=0.417$.` },
      { sec: '9.11', type: 'mc', lv: 2, q: R`같은 질량·반지름에서 관성 모멘트가 가장 큰 것은?`,
        choices: [R`속찬 구`, R`원판`, R`속 빈 구`, R`얇은 고리`], ans: 3,
        sol: R`고리 $mR^2$: 모든 질량이 축에서 $R$에 있습니다.` },
      { sec: '9.11', type: 'num', lv: 2, q: R`$\int_0^\pi\sin^3\theta\,d\theta$의 값은?`, ans: '4/3', ansTex: R`\tfrac43`,
        sol: R`$u=\cos\theta$: $\int_{-1}^{1}(1-u^2)du=2-\tfrac23=\tfrac43$. 속 빈 구의 $\tfrac23MR^2$ 유도에 씁니다.` },
      { sec: '9.12', type: 'num', lv: 1, q: R`길이 1.2 m, 질량 2 kg 막대의 한 끝에 대한 관성 모멘트(kg·m²)는?`, ans: '2*1.44/3', ansTex: R`0.96`,
        sol: R`$\tfrac13mL^2=0.96$.` },
      { sec: '9.12', type: 'num', lv: 2, q: R`같은 막대의 한 끝에서 0.3 m인 점을 지나는 수직축에 대한 관성 모멘트(kg·m²)는?`, ans: '2*1.44/12+2*0.09', ansTex: R`0.42`,
        sol: R`$G$에서 0.3 m: $I=\tfrac1{12}(2)(1.44)+2(0.3)^2=0.24+0.18=0.42$.` },
      { sec: '16.8a', type: 'num', lv: 1, q: R`한 끝이 핀인 길이 1.5 m 막대를 수평에서 놓은 순간의 각가속도(rad/s²)는?`, ans: '3*9.81/3', ansTex: R`9.81`,
        sol: R`$\alpha=3g/(2L)=29.43/3=9.81$ rad/s².` },
      { sec: '16.8a', type: 'num', lv: 2, q: R`같은 막대(질량 4 kg)의 놓는 순간 핀의 연직 반력(N)은?`, ans: '4*9.81/4', ansTex: R`9.81`,
        sol: R`$R_y=\tfrac14mg=9.81$ N.` },
      { sec: '16.8a', type: 'num', lv: 2, q: R`가장자리 핀에 매달린 반지름 0.2 m 원판을 지름이 수평일 때 놓았다. 각가속도(rad/s²)는?`, ans: '2*9.81/0.6', ansTex: R`32.7`,
        sol: R`$I_O=\tfrac32mR^2$, $\alpha=2g/(3R)=32.7$.` },
      { sec: '16.8b', type: 'num', lv: 1, q: R`경사 20°인 면을 미끄러지지 않고 구르는 원판의 가속도(m/s²)는?`, ans: '2/3*9.81*sin(20*pi/180)', ansTex: R`2.24`,
        sol: R`$\tfrac23g\sin20°=2.24$ m/s².` },
      { sec: '16.8b', type: 'num', lv: 2, q: R`경사 35°인 면에서 원판이 미끄러지지 않고 구르기 위한 최소 정지 마찰 계수는?`, ans: 'tan(35*pi/180)/3', ansTex: R`0.233`,
        sol: R`$\mu_s\ge\tfrac13\tan35°=0.233$.` },
      { sec: '16.8b', type: 'num', lv: 2, q: R`경사 30°인 면을 속찬 구가 미끄러지지 않고 구른다. 가속도(m/s²)는?`, ans: '5/7*9.81*0.5', ansTex: R`3.50`,
        sol: R`$k^2/r^2=\tfrac25$ → $a=g\sin30°/1.4=3.50$ m/s².` },
      { sec: '16.8b', type: 'num', lv: 3, q: R`경사 30°, $\mu_k=0.1$에서 미끄러지며 내려가는 원판(반지름 0.2 m)의 각가속도(rad/s²)는?`, ans: '2*0.1*9.81*cos(pi/6)/0.2', ansTex: R`8.50`,
        sol: R`$\alpha=2\mu_kg\cos\theta/r=8.50$ rad/s².` },
      { sec: '16.8c', type: 'num', lv: 2, q: R`한 끝이 핀인 길이 0.9 m 가는 막대에서 타격 중심은 핀에서 몇 m인가?`, ans: '0.6', ansTex: R`0.6\ \text{m}`,
        sol: R`$\tfrac23L=0.6$ m.` },
      { sec: '16.8c', type: 'num', lv: 3, q: R`질량 2 kg, $I_G=0.05$ kg·m²인 물체가 $G$에서 0.25 m인 점 $O$에 핀으로 매달려 있다. 핀에서 잰 타격 중심의 거리(m)는?`, ans: '0.25+0.05/(2*0.25)', ansTex: R`0.35`,
        sol: R`$\bar r+I_G/(m\bar r)=0.25+0.1=0.35$ m.` },
      { sec: '16.8b', type: 'open', lv: 2, proof: true, q: R`경사각 $\theta$인 면을 미끄러지지 않고 구르는 원판의 가속도와 마찰력을 유도하고, 미끄러지지 않을 조건 $\tan\theta\le3\mu_s$를 보이세요.`,
        sol: R`
자유물체도: $mg$, $N$(면에 수직), $f$(면을 따라 위).
$\sum F_x$: $mg\sin\theta-f=ma$. $\sum F_y$: $N=mg\cos\theta$. $\sum M_G$: $fr=\tfrac12mr^2\alpha$.
구름: $a=r\alpha$ → $f=\tfrac12ma$. 첫 식에 넣어 $a=\tfrac23g\sin\theta$, $f=\tfrac13mg\sin\theta$.
정지 마찰 한계 $f\le\mu_sN$: $\tfrac13mg\sin\theta\le\mu_smg\cos\theta\iff\tan\theta\le3\mu_s$.`,
        rubric: R`
- 세 운동 방정식 — 4점
- 구름 구속으로 연립 — 3점
- 마찰 조건 — 3점` },
      { sec: '16.8c', type: 'open', lv: 3, proof: true, q: R`아래끝 $O$가 핀인 강체(질량 $m$, $O$에서 $G$까지 $\bar r$, $I_G$)의 $G$ 위 $x$인 점에 수평 힘 $F$를 가할 때 핀의 수평 반력 $N$을 구하고, $N=0$이 되는 $x$(타격 중심)를 유도하세요.`,
        sol: R`
$N$을 $F$ 반대 방향으로 두면 $F-N=ma_G$, $\sum M_G=xF+\bar rN=I_G\alpha$. 핀이 고정이고 처음에 $\omega=0$이면 $a_G=\bar r\alpha$.
첫 식 $F-N=m\bar r\alpha$에 $I_G/(m\bar r)$를 곱해 둘째 식에서 빼면 $\tfrac{I_G}{m\bar r}(F-N)-xF-\bar rN=0$.
$N\big(\bar r+\tfrac{I_G}{m\bar r}\big)=\big(\tfrac{I_G}{m\bar r}-x\big)F$ → 결과. $N=0\iff x=I_G/(m\bar r)$.`,
        rubric: R`
- 두 운동 방정식과 운동학 구속 — 4점
- $\alpha$ 소거 — 4점
- 타격 중심 조건 — 2점` },
    ],
  });
})();
