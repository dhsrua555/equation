/* 05 일과 에너지 — B&J 13.1–13.9, 수업 필기 3월 23일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 5, part: 'A', title: '일과 에너지', en: 'Work & Energy', ref: 'B&J 13.1–13.9 · 필기 3/23', plot: 'dyWell',
    fig: R`퍼텐셜 에너지 곡선과 전체 에너지 수준. 전체 에너지선 아래에서만 움직일 수 있다`,
    tagline: R`힘은 벡터지만 에너지는 스칼라입니다. 방향을 따지지 않고 처음과 끝의 속력을 이을 수 있다는 것이 에너지 방법의 힘입니다.`,
    summary: R`힘이 경로를 따라 한 **일**은 $U_{1\to2}=\int\mathbf F\cdot d\mathbf r$이고, 운동 방정식에 $\mathbf v$를 내적해 적분하면 **일-에너지 정리** $U_{1\to2}=T_2-T_1$($T=\tfrac12mv^2$)이 나옵니다. 일이 경로에 무관한 **보존력**(중력, 스프링)은 **퍼텐셜 에너지** $V$로 $U_{1\to2}=V_1-V_2$, $\mathbf F=-\nabla V$로 쓰며 $V_g=mgh$ 또는 $-GMm/r$, $V_e=\tfrac12kx^2$입니다. 그러면 $T_1+V_1+U^{\text{nc}}_{1\to2}=T_2+V_2$이고, 비보존력(마찰)이 일을 하지 않으면 역학적 에너지가 보존됩니다. 속도에 수직인 수직항력과 진자의 장력은 일을 하지 않습니다. **일률**은 $P=\mathbf F\cdot\mathbf v$입니다.`,
    goals: [
      R`일의 정의와 단위(J), 차원을 쓰고 일정한 힘·스프링·마찰의 일을 계산할 수 있다`,
      R`$\sum\mathbf F\cdot\mathbf v=\tfrac{d}{dt}(\tfrac12mv^2)$로 일-에너지 정리를 유도할 수 있다`,
      R`보존력과 퍼텐셜 에너지를 정의하고 $\mathbf F=-\nabla V$를 적용할 수 있다`,
      R`비보존력의 일을 포함한 에너지 식으로 속력과 높이를 구할 수 있다`,
      R`일을 하지 않는 힘을 알아보고 일률과 효율을 계산할 수 있다`,
    ],
    secTitles: { '13.2': '일', '13.3': '일-에너지 정리', '13.5': '일률', '13.6': '보존력과 퍼텐셜', '13.8': '에너지 보존' },
    sections: [
      { k: '13.2', p: 756, src: '수업 필기 · 3월 23일', title: '힘이 한 일', body: R`
에너지는 크기만 있는 **스칼라**입니다. 필기의 그림처럼 같은 속력이면 방향이 달라도 운동에너지가 같습니다.

:::key 일
$$dU=\mathbf F\cdot d\mathbf r,\qquad U_{1\to2}=\int_1^2\mathbf F\cdot d\mathbf r$$
단위 N·m = J(줄), 차원 $ML^2T^{-2}$. 힘의 변위 방향 성분만 일을 한다.
:::

:::key 자주 쓰는 일
- 일정한 힘: $U=F_x\Delta x$ (변위 방향 성분).
- 중력: $U_{1\to2}=-mg(y_2-y_1)=-mg\Delta y$ (올라가면 음).
- 스프링: $U_{1\to2}=\int_{x_1}^{x_2}(-kx)dx=-\tfrac12kx_2^2+\tfrac12kx_1^2$.
- 운동 마찰: $U=-f\,s$ ($s$: **경로의 길이**, 변위가 아님).
:::

:::ex 예제 1
수평과 $\alpha=30°$인 힘 50 N으로 상자를 수평으로 4 m 끌었다. 이 힘이 한 일은? 같은 구간에서 크기 20 N인 마찰의 일은?
---
$U_F=50\cos30°(4)=173.2$ J. 마찰은 운동 반대 방향이라 $U_f=-20(4)=-80$ J. 수직항력과 무게는 변위에 수직이라 일이 0.
:::
` },
      { k: '13.3', p: 760, src: '수업 필기 · 3월 23일', title: '일-운동에너지 정리', body: R`
:::key 일-운동에너지 정리
$$T=\tfrac12mv^2,\qquad U_{1\to2}=T_2-T_1$$
$U_{1\to2}$는 질점에 작용하는 **모든** 힘($\sum\mathbf F$)이 한 일이다.
:::

유도(필기): $\sum\mathbf F\cdot\mathbf v=m\dot{\mathbf v}\cdot\mathbf v$이고 $\frac{d}{dt}(\mathbf v\cdot\mathbf v)=2\mathbf v\cdot\dot{\mathbf v}$이므로 $\sum\mathbf F\cdot\mathbf v=\tfrac12m\frac{d(v^2)}{dt}$. $\mathbf v\,dt=d\mathbf r$을 쓰면 $\sum\mathbf F\cdot d\mathbf r=d(\tfrac12mv^2)$, 적분하면 정리.

:::fig dPendulum
:::

:::ex 예제 2 — 진자 (필기의 예)
길이 $l$인 진자를 천장과 각 $\theta_1$인 위치에서 정지 상태로 놓았다. 가장 낮은 점의 속력은?
---
장력은 원 경로에 늘 수직(반지름 방향)이라 일이 0. 중력의 일은 $mg$ × (떨어진 높이) $=mgl(1-\sin\theta_1)$.
$mgl(1-\sin\theta_1)=\tfrac12mv_2^2$ → $v_2=\sqrt{2gl(1-\sin\theta_1)}$.
필기는 같은 결과를 접선 성분 $\sum F_\theta\,ds=mg\cos\theta\cdot l\,d\theta$를 $\theta_1$부터 $\pi/2$까지 적분해 얻었습니다: $mgl(1-\sin\theta_1)$.
차원 검사: $\sqrt{[LT^{-2}][L]}=LT^{-1}$ ✓. $l=1.2$ m, $\theta_1=30°$면 $v_2=3.43$ m/s.
:::
` },
      { k: '13.5', p: 763, title: '일률과 효율', body: R`
:::key 일률
$$P=\frac{dU}{dt}=\mathbf F\cdot\mathbf v,\qquad\eta=\frac{\text{출력 일률}}{\text{입력 일률}}$$
단위 W = J/s.
:::

:::ex 예제 3
1200 kg 차가 기울기 5%(100 m에 5 m 오름)인 오르막을 25 m/s로 등속 주행한다. 저항을 무시할 때 필요한 일률은?
---
경사 방향 힘 $F=mg\sin\theta$, $\sin\theta=0.05/\sqrt{1.0025}=0.0499$. $P=1200(9.81)(0.0499)(25)=14.7$ kW.
:::
` },
      { k: '13.6', p: 782, src: '수업 필기 · 3월 23일', title: '보존력과 퍼텐셜 에너지', body: R`
필기는 힘을 두 종류로 나눕니다.

:::def 보존력과 비보존력
- **보존력**: 한 일이 끝점에만 의존하고 **경로에 무관**한 힘. 힘이 위치만의 함수이고, 퍼텐셜 에너지 $V$가 존재해 $U_{1\to2}=V_1-V_2$(또는 $dU=-dV$).
- **비보존력**: 일이 경로에 따라 다른 힘. 운동 마찰이 전형입니다($U=-f\times$경로 길이).
:::

:::key 퍼텐셜 에너지
$$V_g=mgy\ (\text{지표 근처}),\qquad V_g=-\frac{GMm}{r}\ (\text{만유인력}),\qquad V_e=\tfrac12kx^2\ (\text{스프링, }x\text{: 늘어난 길이})$$
$$\mathbf F=-\nabla V=-\Big(\frac{\partial V}{\partial x}\mathbf i+\frac{\partial V}{\partial y}\mathbf j+\frac{\partial V}{\partial z}\mathbf k\Big)$$
:::

$\mathbf F=-\nabla V$는 $dU=\mathbf F\cdot d\mathbf r=F_xdx+F_ydy+F_zdz$와 $-dV=-(\partial_xVdx+\partial_yVdy+\partial_zVdz)$를 비교하면 나옵니다. 예: $V=\tfrac12kx^2$ → $F_x=-kx$.

:::ex 예제 4 — 탈출 속도
지표에서 위로 쏜 물체가 무한히 멀리 가려면($V\to0$, $T\ge0$) 최소 속력은?
---
$\tfrac12mv^2-\dfrac{GMm}{R}=0$ → $v_{\text{esc}}=\sqrt{2GM/R}=\sqrt{2gR}=\sqrt{2(9.81)(6.37\times10^6)}=11.2$ km/s.
:::

:::note 보존력의 판정 (교재 13.7)
힘이 보존력인 필요충분조건(단순 연결 영역): $\nabla\times\mathbf F=\mathbf 0$[[@em:ch09:10.2|선적분의 경로 독립. 퍼텐셜이 있으면 일은 끝점만의 함수입니다.]]. 예: $\mathbf F=(y,x)$는 $V=-xy$로 보존력, $\mathbf F=(-y,x)$는 회전이 0이 아니라 비보존력.
:::
` },
      { k: '13.8', p: 785, src: '수업 필기 · 3월 23일', title: '역학적 에너지 보존', body: R`
일-에너지 정리의 일을 보존력(퍼텐셜로)과 비보존력으로 나누면:

:::key 에너지 식
$$T_1+V_1+U^{\text{nc}}_{1\to2}=T_2+V_2$$
(1) 모든 힘이 보존력이거나 (2) 비보존력이 일을 하지 않으면 $T+V$ = 일정(역학적 에너지 보존).
:::

필기의 예: 매끄러운 경사면의 수직항력, 진자의 장력은 비보존력이지만 속도에 수직이라 일을 하지 않으므로 $T+V$가 일정합니다.

:::ex 예제 5 — 스프링 발사대와 마찰 구간
$k=800$ N/m인 스프링을 0.1 m 눌러 0.5 kg 블록을 발사한다(매끄러운 면). 발사 속력은? 그 뒤 $\mu_k=0.25$인 거친 면에서 몇 m를 가서 멈추는가?
---
$\tfrac12(800)(0.01)=\tfrac12(0.5)v^2$ → $v=4$ m/s.
$T_1+U^{\text{nc}}=0$: $\tfrac12(0.5)(16)=0.25(0.5)(9.81)s$ → $s=3.26$ m.
:::

:::ex 예제 6 — 수직 원 궤도의 최소 출발 높이
마찰 없는 트랙의 높이 $h$에서 정지 상태로 출발한 차가 반지름 $R$인 원 궤도를 한 바퀴 돌려면?
---
꼭대기(높이 $2R$)에서 최소 속력 $\sqrt{gR}$(3단원). 에너지: $mgh=mg(2R)+\tfrac12m(gR)$ → $h=2.5R$.
:::
` },
    ],
    problems: [
      { sec: '13.2', type: 'num', lv: 1, q: R`수평과 30°인 50 N의 힘으로 상자를 수평으로 4 m 끌었다. 이 힘의 일(J)은?`, ans: '200*cos(pi/6)', ansTex: R`173.2\ \text{J}`,
        sol: R`$50\cos30°\times4=173.2$ J.` },
      { sec: '13.2', type: 'num', lv: 1, q: R`$k=400$ N/m인 스프링을 늘어난 길이 0.05 m에서 0.15 m까지 더 늘릴 때 **스프링이** 한 일(J)은?`, ans: '-4', ansTex: R`-4\ \text{J}`,
        sol: R`$-\tfrac12k(x_2^2-x_1^2)=-200(0.0225-0.0025)=-4$ J. 늘리는 손이 한 일은 +4 J.` },
      { sec: '13.2', type: 'mc', lv: 2, q: R`2 kg 블록을 거친 바닥($\mu_k=0.3$)에서 A에서 B로 3 m 밀었다가 다시 A로 3 m 되돌렸다. 마찰이 한 일은?`,
        choices: [R`0`, R`$-17.7$ J`, R`$-35.3$ J`, R`$+35.3$ J`], ans: 2,
        sol: R`경로 길이 6 m: $-0.3(2)(9.81)(6)=-35.3$ J. 변위가 0이어도 마찰의 일은 0이 아닙니다 — 비보존력.` },
      { sec: '13.3', type: 'num', lv: 1, q: R`길이 1.2 m 진자를 천장과 30°인 위치에서 놓았다(필기의 각). 가장 낮은 점의 속력(m/s)은?`, ans: 'sqrt(2*9.81*1.2*0.5)', ansTex: R`3.43\ \text{m/s}`,
        sol: R`$\sqrt{2gl(1-\sin30°)}=\sqrt{11.77}=3.43$ m/s.` },
      { sec: '13.3', type: 'num', lv: 2, q: R`같은 진자(질량 0.5 kg)의 가장 낮은 점에서 장력(N)은?`, ans: '0.5*9.81*2', ansTex: R`9.81\ \text{N}`,
        sol: R`$T-mg=mv^2/l=m\cdot2g(1-\sin30°)=mg$ → $T=2mg=9.81$ N.` },
      { sec: '13.3', type: 'num', lv: 2, q: R`3 kg 블록이 매끄러운 경사면(30°)을 정지에서 출발해 경사면을 따라 2 m 미끄러졌다. 속력(m/s)은?`, ans: 'sqrt(2*9.81*1)', ansTex: R`4.43\ \text{m/s}`,
        sol: R`떨어진 높이 $2\sin30°=1$ m. $v=\sqrt{2g(1)}=4.43$ m/s. 수직항력은 일을 하지 않습니다.` },
      { sec: '13.5', type: 'num', lv: 2, q: R`1200 kg 차가 기울기 5% 오르막을 25 m/s로 등속 주행할 때 중력을 이기는 데 필요한 일률(kW)은?`, ans: '1200*9.81*0.05/sqrt(1.0025)*25/1000', ansTex: R`14.7\ \text{kW}`,
        sol: R`$mg\sin\theta\,v=14.7$ kW.` },
      { sec: '13.6', type: 'num', lv: 1, q: R`$V=3x^2y$ (J, m)일 때 점 $(1,2)$에서 힘의 $x$ 성분(N)은?`, ans: '-12', ansTex: R`-12\ \text{N}`,
        sol: R`$F_x=-\partial V/\partial x=-6xy=-12$ N.` },
      { sec: '13.6', type: 'num', lv: 2, q: R`지구 탈출 속도(km/s)는? ($g=9.81$, $R=6370$ km)`, ans: 'sqrt(2*9.81*6.37e6)/1000', ansTex: R`11.2\ \text{km/s}`,
        sol: R`$\sqrt{2gR}=11.18$ km/s.` },
      { sec: '13.6', type: 'mc', lv: 2, q: R`다음 중 보존력은?`,
        choices: [R`$\mathbf F=(-y,\ x)$`, R`$\mathbf F=(y,\ x)$`, R`속도에 비례하는 공기 저항`, R`운동 마찰력`], ans: 1,
        sol: R`$(y,x)=-\nabla(-xy)$. $(-y,x)$는 $\partial F_y/\partial x-\partial F_x/\partial y=2\ne0$이라 원을 한 바퀴 돌면 일이 0이 아닙니다.` },
      { sec: '13.8', type: 'num', lv: 2, q: R`$k=800$ N/m 스프링을 0.1 m 눌러 0.5 kg 블록을 발사했다. 이후 $\mu_k=0.25$인 면에서 미끄러지는 거리(m)는?`, ans: '4/(0.25*0.5*9.81)', ansTex: R`3.26\ \text{m}`,
        sol: R`발사 에너지 $\tfrac12(800)(0.1)^2=4$ J가 모두 마찰의 일로: $4=0.25(0.5)(9.81)s$ → $s=3.26$ m.` },
      { sec: '13.8', type: 'num', lv: 1, q: R`반지름 $R$인 마찰 없는 원 궤도를 한 바퀴 돌기 위한 최소 출발 높이는 $R$의 몇 배인가?`, ans: '2.5', ansTex: R`2.5`,
        sol: R`$mgh=2mgR+\tfrac12mgR$ → $h=2.5R$.` },
      { sec: '13.8', type: 'num', lv: 3, q: R`0.2 kg 공을 $k=2000$ N/m 스프링으로 연직 위로 쏘려 한다. 5 m 높이까지 올리려면 스프링을 몇 cm 눌러야 하나? (스프링을 누른 길이만큼의 높이 차도 포함)`, ans: '100*(0.2*9.81+sqrt((0.2*9.81)^2+2*2000*0.2*9.81*5))/2000', ansTex: R`10.0\ \text{cm}`,
        sol: R`누른 길이 $x$, 오르는 높이 $5+x$: $\tfrac12kx^2=mg(5+x)$ → $1000x^2-1.962x-9.81=0$, $x=\dfrac{1.962+\sqrt{1.962^2+39240}}{2000}=0.100$ m.` },
      { sec: '13.3', type: 'open', lv: 2, proof: true, q: R`질량이 일정한 질점에 대해 $\int_1^2\sum\mathbf F\cdot d\mathbf r=\tfrac12mv_2^2-\tfrac12mv_1^2$을 유도하세요.`,
        sol: R`
$\sum\mathbf F=m\dot{\mathbf v}$에 $\mathbf v$를 내적: $\sum\mathbf F\cdot\mathbf v=m\dot{\mathbf v}\cdot\mathbf v$.
$\frac{d}{dt}(\mathbf v\cdot\mathbf v)=2\mathbf v\cdot\dot{\mathbf v}$이므로 $m\dot{\mathbf v}\cdot\mathbf v=\frac{d}{dt}(\tfrac12mv^2)$.
양변에 $dt$를 곱하고 $\mathbf v\,dt=d\mathbf r$: $\sum\mathbf F\cdot d\mathbf r=d(\tfrac12mv^2)$.
경로를 따라 1에서 2까지 적분하면 결론.`,
        rubric: R`
- 운동 방정식에 $\mathbf v$ 내적 — 3점
- $\frac{d}{dt}(\mathbf v\cdot\mathbf v)$ 항등식 — 3점
- $\mathbf v\,dt=d\mathbf r$와 적분 — 4점` },
      { sec: '13.6', type: 'open', lv: 2, proof: true, q: R`만유인력 $\mathbf F=-\dfrac{GMm}{r^2}\mathbf e_r$이 한 일을 계산해 퍼텐셜 에너지 $V=-GMm/r$을 유도하고, 지표 근처($r=R+y$, $y\ll R$)에서 $V\approx$ 상수 $+\,mgy$가 됨을 보이세요.`,
        sol: R`
$d\mathbf r=dr\,\mathbf e_r+r\,d\theta\,\mathbf e_\theta$이므로 $\mathbf F\cdot d\mathbf r=-\dfrac{GMm}{r^2}dr$ — 반지름 변화만 일에 들어갑니다(경로 무관).
$U_{1\to2}=\int_{r_1}^{r_2}-\dfrac{GMm}{r^2}dr=\dfrac{GMm}{r_2}-\dfrac{GMm}{r_1}=V_1-V_2$, $V=-\dfrac{GMm}{r}$.
$r=R+y$: $-\dfrac{GMm}{R(1+y/R)}\approx-\dfrac{GMm}{R}\Big(1-\dfrac yR\Big)=-\dfrac{GMm}{R}+\dfrac{GMm}{R^2}y=$ 상수 $+mgy$ ($g=GM/R^2$).`,
        rubric: R`
- 내적에서 반지름 성분만 — 3점
- 적분과 $V$ — 4점
- 1차 근사 — 3점` },
    ],
  });
})();
