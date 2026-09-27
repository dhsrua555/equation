/* 09 질점계와 강체의 평면 운동학 — B&J 14.1–14.12, 15.1–15.8, 수업 필기 4월 8일·13일·15일·20일, 보강(3월 30일분) */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 9, part: 'C', title: '질점계와 강체의 평면 운동학', en: 'Systems of Particles & Plane Kinematics', ref: 'B&J 14장, 15.1–15.8 · 필기 4/8–4/20', plot: 'dyCycloid',
    fig: R`구르는 바퀴 위의 점이 그리는 사이클로이드. 바닥에 닿는 순간 속도가 0이다`,
    tagline: R`질점이 많아지면 질량 중심 하나가 전체의 병진을 대표합니다. 모든 질점 사이의 거리가 고정되면 강체가 되고, 평면 운동은 한 점의 병진과 그 점에 대한 회전으로 나뉩니다.`,
    summary: R`질점계에서 내력은 작용-반작용으로 상쇄되므로 $\sum\mathbf F_{\text{ext}}=M\mathbf a_G$입니다. **질량 중심** $\mathbf r_G=\sum m_i\mathbf r_i/M$(연속체는 $\int\mathbf r\,dm/\int dm$)은 계 전체가 그 한 점에 모인 것처럼 움직이고, 뉴턴 법칙은 **관성틀**에서만 성립합니다. 운동에너지는 $T=\tfrac12Mv_G^2+\sum\tfrac12m_iv_i'^2$(질량 중심의 병진 + 질량 중심에 대한 상대 운동)으로 나뉘고, 로켓처럼 질량이 변하는 계는 $m\,dv/dt=\sum F+\dot m\,u$($u$: 나가는 질량의 상대 속도, 추력)입니다. **강체**는 모든 두 점 사이 거리가 일정한 계입니다. 평면 운동은 **병진 + 회전**이고, 두 점의 속도·가속도는 $\mathbf v_B=\mathbf v_A+\boldsymbol\omega\times\mathbf r_{B/A}$, $\mathbf a_B=\mathbf a_A+\boldsymbol\alpha\times\mathbf r_{B/A}-\omega^2\mathbf r_{B/A}$로 잇습니다. 속도가 0인 **순간 중심**을 찾으면 속도 계산이 곱셈 하나로 끝나고, 미끄러지지 않고 구르는 바퀴는 접촉점이 순간 중심이라 $v_G=r\omega$, $a_G=r\alpha$입니다.`,
    goals: [
      R`내력이 상쇄됨을 보이고 질량 중심의 운동 방정식 $\sum\mathbf F_{\text{ext}}=M\mathbf a_G$를 유도할 수 있다`,
      R`질점계와 연속체의 질량 중심을 계산할 수 있다`,
      R`질점계의 운동에너지를 질량 중심과 상대 운동으로 나누고 질량이 변하는 계의 추력 식을 유도할 수 있다`,
      R`강체의 평면 운동을 병진과 회전으로 나누고 상대 속도·가속도 식을 쓸 수 있다`,
      R`순간 중심을 작도해 속도를 구하고, 구름 조건 $v=r\omega$, $a=r\alpha$를 적용할 수 있다`,
    ],
    secTitles: { '14.2': '질점계와 질량 중심', '14.7': '질점계의 에너지', '14.12': '질량이 변하는 계', '15.5': '강체와 평면 운동', '15.7': '순간 중심', '15.8': '상대 가속도' },
    sections: [
      { k: '14.2', p: 856, src: '수업 필기 · 4월 8일, 13일', title: '질점계와 질량 중심', body: R`
두 질점을 생각합니다. 질점 1은 외력 $\mathbf F_1$과 질점 2가 주는 내력 $\mathbf f_{12}$를, 질점 2는 $\mathbf F_2$와 $\mathbf f_{21}$을 받습니다. 뉴턴 제3법칙으로 $\mathbf f_{21}=-\mathbf f_{12}$이므로 더하면
$$\mathbf F_1+\mathbf F_2=m_1\ddot{\mathbf x}_1+m_2\ddot{\mathbf x}_2=(m_1+m_2)\frac{m_1\ddot{\mathbf x}_1+m_2\ddot{\mathbf x}_2}{m_1+m_2}.$$
필기의 질문 “어느 점의 가속도가 $\frac{m_1\ddot x_1+m_2\ddot x_2}{m_1+m_2}$인가?”의 답이 **질량 중심**입니다. 두 질점 사이를 질량의 **반비례**로 나누는 점입니다($m_1$ 쪽까지의 거리 : $m_2$ 쪽까지의 거리 $=m_2:m_1$).

:::key 질량 중심과 그 운동
$$\mathbf r_G=\frac{\sum m_i\mathbf r_i}{\sum m_i}=\frac{\int\mathbf r\,dm}{\int dm},\qquad\sum\mathbf F_{\text{ext}}=M\mathbf a_G,\qquad\mathbf L=\sum m_i\mathbf v_i=M\mathbf v_G$$
:::

:::ex 예제 1 — 직사각형 판 (필기)
밀도 $\rho$가 일정한 가로 $X$, 세로 $Y$ 직사각형 판(한 모서리가 원점)의 질량 중심은?
---
$\int dm=\rho XY$. $\int x\,dm=\int_0^Y\int_0^X\rho x\,dx\,dy=\tfrac12\rho X^2Y$, 같은 방식으로 $\int y\,dm=\tfrac12\rho XY^2$. $\mathbf r_G=(X/2,\ Y/2)$ — 가운데.
:::

:::warn 관성틀에서만 (필기의 교훈)
기준점 $A$가 가속하면 $\mathbf a_1=\mathbf a_{1/A}+\mathbf a_{A}$이므로 $\sum\mathbf F_1\ne m_1\mathbf a_{1/A}$입니다. 가속하는 틀에서 뉴턴 법칙을 쓰려면 **관성력** $-m\mathbf a_A$를 더해야 합니다: 회전하는 차 안의 사람은 바깥으로 밀리는 “원심력”을 느끼지만, 관성틀에서는 그 힘이 없고 사람이 중심 쪽으로 가속할 뿐입니다.
:::

:::note 질량 중심 틀의 각운동량 (필기 4월 13일)
질량 중심을 원점으로 한 상대 위치 $\mathbf r_i'$는 $\sum m_i\mathbf r_i'=\mathbf 0$을 만족합니다. 그래서 질량 중심에 대한 각운동량 $\mathbf H_G=\sum\mathbf r_i'\times m_i\mathbf v_i$의 변화율은 관성틀 속도로 쓰든 상대 속도로 쓰든 같고, $\dot{\mathbf H}_G=\sum\mathbf M_G$(외력만)가 질량 중심이 가속해도 성립합니다. 강체의 운동 방정식 $\sum M_G=I_G\alpha$(11단원)의 근거입니다.
:::
` },
      { k: '14.7', p: 872, src: '수업 필기 · 4월 13일, 15일', title: '질점계의 운동에너지와 에너지 식', body: R`
각 질점의 속도를 $\mathbf v_i=\bar{\mathbf v}+\mathbf v_i'$(질량 중심 속도 + 상대 속도)로 쓰면
$$T=\sum\tfrac12m_i(\bar{\mathbf v}+\mathbf v_i')\cdot(\bar{\mathbf v}+\mathbf v_i')=\tfrac12M\bar v^2+\bar{\mathbf v}\cdot\sum m_i\mathbf v_i'+\sum\tfrac12m_iv_i'^2.$$
가운데 항은 $\sum m_i\mathbf v_i'=\frac{d}{dt}\sum m_i\mathbf r_i'=\mathbf 0$이라 사라집니다.

:::key 쾨니히 분해
$$T=\tfrac12M\bar v^2+\sum_i\tfrac12m_iv_i'^2$$
(질량 중심의 병진 운동에너지) + (질량 중심에 대한 상대 운동의 운동에너지). 강체가 질량 중심에 대해 $\omega$로 돌면 둘째 항은 $\tfrac12I_G\omega^2$이다(12단원).
:::

:::key 질점계의 일-에너지 식
$$T_1+V_1+U^{\text{nc}}_{1\to2}=T_2+V_2$$
$U$는 **모든** 힘(내력 포함)의 일이다. 강체처럼 질점 사이 거리가 일정하면 내력 쌍의 일은 상쇄된다.
:::

:::warn 내력도 일을 할 수 있다
필기의 예: 두 질점이 스프링으로 이어져 서로 다가가면, 내력 $\mathbf f_{12}+\mathbf f_{21}=\mathbf 0$이어도 두 질점의 변위가 달라 일의 합 $\mathbf f_{12}\cdot d\mathbf r_1+\mathbf f_{21}\cdot d\mathbf r_2=\mathbf f_{12}\cdot d(\mathbf r_1-\mathbf r_2)\ne0$입니다. 스프링 에너지로 계산에 넣어야 합니다. 퍼텐셜도 계 전체로는 $V=\sum V_i$이고, 중력만 $V=Mgh_G$로 질량 중심 하나로 줄어듭니다(선형 함수라서).
:::
` },
      { k: '14.12', p: 888, src: '수업 필기 · 4월 15일, 20일', title: '질량이 변하는 계: 로켓 방정식', body: R`
로켓이 시간 $dt$ 동안 질량 $dm$을 로켓에 대한 상대 속도 $u$로 뒤로 내뿜습니다. 계를 “시각 $t$의 로켓 전체(질량 $m+dm$)”로 잡으면 질량이 일정한 계라 충격량-운동량 원리를 쓸 수 있습니다.
- 시각 $t$: $L_1=(m+dm)v$.
- 시각 $t+dt$: 로켓 $m(v+dv)$ + 가스 $dm\,v_a$ ($v_a=v-u$는 가스의 절대 속도).
$L_2-L_1=m\,dv+dm(v_a-v)+\cdots=m\,dv-u\,dm=\sum F\,dt$ (2차 미소량 버림).

:::key 질량이 변하는 계의 운동 방정식
$$m\frac{dv}{dt}=\sum F+\Big\lvert\frac{dm}{dt}\Big\rvert u$$
$\lvert dm/dt\rvert u$가 **추력**이다. 외력이 없으면 $v_2-v_1=u\ln(m_1/m_2)$.
:::

:::warn 부호를 한 번 더 (필기의 두 판)
필기에는 $\sum F+\frac{dm}{dt}u=m\frac{dv}{dt}$와 $m\frac{dv}{dt}=-\frac{dm}{dt}u+\sum F$ 두 형태가 나옵니다. 차이는 $dm$을 “로켓이 잃은 질량(양수)”로 잡느냐, “로켓 질량의 변화(음수)”로 잡느냐입니다. 로켓 질량의 변화율 $\dot m<0$을 쓰면 추력은 $-\dot m u>0$. 어느 쪽이든 **추력은 앞으로**라는 물리적 결론을 확인하세요.
:::

:::ex 예제 2
질량 2000 kg(연료 포함)인 로켓이 연료를 초당 20 kg씩, 상대 속도 2000 m/s로 뿜는다. 연직 발사 직후의 가속도는?
---
추력 $20(2000)=40$ kN, 중력 $19.6$ kN. $a=(40000-19620)/2000=10.2$ m/s².
:::

:::note 흐름이 있는 계 (교재 14.11)
고정된 날개에 부딪혀 방향을 바꾸는 물줄기처럼 **일정하게 흐르는** 질량은 $\sum\mathbf F=\dot m(\mathbf v_{\text{out}}-\mathbf v_{\text{in}})$으로 다룹니다. 유체역학의 운동량 방정식[[@fluid:ch06:3.4a|검사체적의 운동량 방정식. 나가는 운동량 유량 − 들어오는 운동량 유량 = 힘.]]과 같은 식입니다.
:::
` },
      { k: '15.5', p: 932, src: '수업 필기 · 4월 20일 · 보강 필기', title: '강체와 평면 운동: 병진 + 회전', body: R`
:::def 강체 (필기)
어떤 두 점 사이의 거리도 늘 일정한 물체. 그래서 물체에 붙인 틀에서 본 두 점의 상대 위치 $\mathbf r_{B/A}$의 성분이 일정하다.
:::

:::key 평면 운동의 속도
평면 운동 = (기준점 $A$의 **병진**) + ($A$에 대한 **순수 회전**).
$$\mathbf v_B=\mathbf v_A+\boldsymbol\omega\times\mathbf r_{B/A},\qquad\lvert\boldsymbol\omega\times\mathbf r_{B/A}\rvert=\omega\,r_{B/A}$$
$\boldsymbol\omega=\omega\mathbf k$(반시계 +)는 강체 전체에 하나다.
:::

병진만 하면 $\mathbf r_{B/A}$가 방향까지 일정해 $\mathbf v_B=\mathbf v_A$, 고정축 회전만 하면 $\mathbf v_A=\mathbf 0$이라 $\mathbf v_B=\boldsymbol\omega\times\mathbf r_B$입니다. 일반 평면 운동은 둘의 합입니다(필기의 막대 그림).

:::fig dLadder
:::

:::ex 예제 3 — 미끄러지는 막대 (보강 필기)
길이 $l$인 막대의 끝 $A$가 바닥을, $B$가 벽을 따라 미끄러진다. 벽과 이루는 각 $\theta$가 늘어나는 순간 $\dot\theta=\omega$일 때 두 끝의 속도는?
---
벽 밑을 원점으로 $\mathbf r_A=l\sin\theta\,\mathbf i$, $\mathbf r_B=l\cos\theta\,\mathbf j$. 미분하면 $\mathbf v_A=l\omega\cos\theta\,\mathbf i$, $\mathbf v_B=-l\omega\sin\theta\,\mathbf j$.
두 속력의 비 $v_B/v_A=\tan\theta$.
상대 속도 식으로 확인: $A$에서 $B$로 가는 벡터 $\mathbf r_{B/A}=l(-\sin\theta,\ \cos\theta)$는 $+x$축과 $90°+\theta$를 이루므로, $\theta$가 늘면 막대는 **반시계**로 돕니다: $\boldsymbol\omega_{\text{막대}}=+\omega\mathbf k$(보강 필기와 같음).
$\boldsymbol\omega_{\text{막대}}\times\mathbf r_{B/A}=\omega l(-\cos\theta\,\mathbf i-\sin\theta\,\mathbf j)$이고, $\mathbf v_A$에 더하면 $\mathbf v_B=-l\omega\sin\theta\,\mathbf j$ — 미분한 결과와 같습니다.
:::

:::tip 각속도의 부호 정하기
막대가 도는 방향은 “막대 위의 한 방향 벡터가 $+x$축과 이루는 각이 늘어나는가”로 판단합니다. 벽에 기댄 막대가 쓰러지면(벽과의 각 $\theta$ 증가) 반시계입니다. 부호를 틀리면 속도의 크기는 맞아도 가속도 계산에서 항의 부호가 뒤집힙니다.
:::
` },
      { k: '15.7', p: 946, src: '보강 필기 · 필기 4월 27일', title: '순간 회전 중심', body: R`
:::key 순간 중심
평면 운동하는 강체에는 그 순간 속도가 0인 점 $C$(강체 밖일 수도 있음)가 있고, 모든 점의 속도는 $C$를 중심으로 도는 것처럼
$$\mathbf v_P=\boldsymbol\omega\times\mathbf r_{P/C},\qquad v_P=\omega\,\lvert CP\rvert$$
이다. 두 점의 속도 방향을 알면, 각 점에서 속도에 수직인 선의 교점이 $C$다.
:::

예제 3의 막대: $A$에서 연직선, $B$에서 수평선을 그으면 교점 $C=(l\sin\theta,\ l\cos\theta)$. $v_A=\omega\cdot CA=\omega l\cos\theta$, $v_B=\omega\cdot CB=\omega l\sin\theta$ — 미분 없이 같은 답입니다.

:::key 미끄러지지 않고 구르는 바퀴
접촉점의 속도가 0이므로 접촉점이 순간 중심이다.
$$v_G=r\omega,\qquad a_G=r\alpha\qquad(\text{평평한 면})$$
바퀴 꼭대기의 속도는 $2r\omega$ = 중심의 두 배.
:::

필기의 확인: $\mathbf v_{\text{접촉}}=\mathbf v_G+(-\omega\mathbf k)\times(-r\mathbf j)=r\omega\mathbf i-r\omega\mathbf i=\mathbf 0$.

:::warn 순간 중심의 가속도는 0이 아니다
순간 중심은 그 순간만 속도가 0입니다. 구르는 바퀴의 접촉점은 위로 $r\omega^2$의 가속도를 가집니다. 그래서 순간 중심은 **속도**에만 쓰고, 가속도는 다음 절의 상대 가속도 식으로 구합니다. 순간 중심 자체도 움직입니다(필기의 차선 변경 그림: 차의 순간 중심이 궤적을 그리며 옮겨 감).
:::
` },
      { k: '15.8', p: 957, src: '보강 필기', title: '상대 가속도', body: R`
$\mathbf v_B=\mathbf v_A+\boldsymbol\omega\times\mathbf r_{B/A}$를 미분합니다. 강체에서 $\dot{\mathbf r}_{B/A}=\boldsymbol\omega\times\mathbf r_{B/A}$이므로:

:::key 평면 운동의 가속도
$$\mathbf a_B=\mathbf a_A+\boldsymbol\alpha\times\mathbf r_{B/A}+\boldsymbol\omega\times(\boldsymbol\omega\times\mathbf r_{B/A})=\mathbf a_A+\alpha r_{B/A}\,\mathbf e_\theta-\omega^2r_{B/A}\,\mathbf e_r$$
$\mathbf e_r$는 $A$에서 $B$로 가는 방향, $\mathbf e_\theta$는 그것을 반시계로 90° 돌린 방향이다(평면에서 $\boldsymbol\omega\times(\boldsymbol\omega\times\mathbf r)=-\omega^2\mathbf r$).
:::

2단원의 극좌표 가속도에서 $r$이 일정한 경우($\dot r=\ddot r=0$)와 같습니다: 접선 $r\ddot\theta$, 법선(중심 쪽) $r\dot\theta^2$.

:::ex 예제 4 — 구르는 바퀴의 접촉점
반지름 $r$인 바퀴가 $\omega$, $\alpha$(둘 다 시계 방향)로 미끄러지지 않고 구른다. 접촉점의 가속도는?
---
$\mathbf a_G=r\alpha\,\mathbf i$. 접촉점 $P$: $\mathbf r_{P/G}=-r\mathbf j$, $\boldsymbol\alpha=-\alpha\mathbf k$.
$\boldsymbol\alpha\times\mathbf r_{P/G}=(-\alpha\mathbf k)\times(-r\mathbf j)=-r\alpha\,\mathbf i$, $-\omega^2\mathbf r_{P/G}=r\omega^2\mathbf j$.
$\mathbf a_P=r\alpha\mathbf i-r\alpha\mathbf i+r\omega^2\mathbf j=r\omega^2\,\mathbf j$ — 중심을 향해 위로.
:::

:::tip 풀이 순서
1. 속도를 먼저 풀어 $\omega$를 구한다(순간 중심이나 상대 속도).
2. 가속도 식에 $\omega^2$ 항(구심)을 넣고, 미지수 $\alpha$와 모르는 가속도 성분을 두 성분 식으로 푼다.
:::
` },
    ],
    problems: [
      { sec: '14.2', type: 'num', lv: 1, q: R`$x$축 위의 두 질점 $m_1=2$ kg($x=1$ m), $m_2=3$ kg($x=6$ m)의 질량 중심 위치(m)는?`, ans: '4', ansTex: R`4\ \text{m}`,
        sol: R`$(2+18)/5=4$ m. 무거운 쪽에 가깝습니다(거리비 3:2).` },
      { sec: '14.2', type: 'num', lv: 2, q: R`밀도가 일정한 삼각형 판(꼭짓점 $(0,0)$, $(3,0)$, $(0,3)$ m)의 질량 중심 $x$ 좌표(m)는?`, ans: '1', ansTex: R`1\ \text{m}`,
        sol: R`$\int x\,dm=\rho\int_0^3x(3-x)dx=\rho(13.5-9)=4.5\rho$, 넓이 $4.5$ → $\bar x=1$ m(꼭짓점 좌표의 평균).` },
      { sec: '14.2', type: 'mc', lv: 2, q: R`두 스케이터가 얼음 위에서 서로 밀어 멀어진다(마찰 무시). 옳은 것은?`,
        choices: [R`두 사람의 운동량이 각각 보존된다`, R`계의 질량 중심은 처음처럼 정지해 있다`, R`가벼운 사람의 운동량이 더 크다`, R`내력이 계의 운동량을 바꾼다`], ans: 1,
        sol: R`외력이 0이라 $M\mathbf a_G=\mathbf 0$. 운동량의 합은 0으로 유지되고, 두 사람의 운동량은 크기가 같고 방향이 반대입니다.` },
      { sec: '14.7', type: 'num', lv: 2, q: R`1 kg과 3 kg의 두 질점이 각각 $+4$ m/s, $-2$ m/s로 움직인다. 질량 중심에 대한 상대 운동의 운동에너지(J)는?`, ans: '0.5*0.75*36', ansTex: R`13.5\ \text{J}`,
        sol: R`$\bar v=(4-6)/4=-0.5$. 전체 $T=8+6=14$ J, 병진 $\tfrac12(4)(0.25)=0.5$ J, 상대 $13.5$ J(=$\tfrac12\mu u^2$, $\mu=0.75$, $u=6$).` },
      { sec: '14.12', type: 'num', lv: 2, q: R`외력이 없는 로켓이 상대 속도 2500 m/s로 가스를 뿜어 질량이 1000 kg에서 400 kg이 되었다. 속도 증가(m/s)는?`, ans: '2500*ln(2.5)', ansTex: R`2291\ \text{m/s}`,
        sol: R`$u\ln(m_1/m_2)=2500\ln2.5=2291$ m/s.` },
      { sec: '14.12', type: 'num', lv: 2, q: R`2000 kg 로켓이 초당 20 kg을 상대 속도 2000 m/s로 뿜으며 연직으로 발사된다. 발사 직후 가속도(m/s²)는?`, ans: '(40000-2000*9.81)/2000', ansTex: R`10.2`,
        sol: R`$(40\,000-19\,620)/2000=10.19$ m/s².` },
      { sec: '15.5', type: 'num', lv: 1, q: R`고정축에 대해 5 rad/s로 도는 원판에서 축에서 0.2 m인 점의 속력(m/s)은?`, ans: '1', ansTex: R`1`,
        sol: R`$v=r\omega=1$ m/s.` },
      { sec: '15.5', type: 'num', lv: 2, q: R`길이 2 m 막대의 끝 $A$가 바닥을 따라 1.5 m/s로 벽에서 멀어진다. 벽과 이루는 각이 30°인 순간 끝 $B$(벽 위)의 속력(m/s)은?`, ans: '1.5*tan(pi/6)', ansTex: R`0.866`,
        sol: R`$v_B=v_A\tan\theta=1.5\tan30°=0.866$ m/s.` },
      { sec: '15.7', type: 'num', lv: 2, q: R`같은 막대의 그 순간 각속도(rad/s)는?`, ans: '1.5/(2*cos(pi/6))', ansTex: R`0.866`,
        sol: R`순간 중심에서 $A$까지 거리 $l\cos\theta=1.732$ m. $\omega=v_A/CA=0.866$ rad/s.` },
      { sec: '15.7', type: 'num', lv: 1, q: R`반지름 0.3 m 바퀴가 미끄러지지 않고 구르며 중심이 6 m/s로 움직인다. 바퀴 꼭대기의 속력(m/s)은?`, ans: '12', ansTex: R`12`,
        sol: R`순간 중심(접촉점)에서 꼭대기까지 $2r$: $2r\omega=2(6)=12$ m/s.` },
      { sec: '15.7', type: 'num', lv: 2, q: R`같은 바퀴에서 중심과 같은 높이의 앞쪽 가장자리 점의 속력(m/s)은?`, ans: '6*sqrt(2)', ansTex: R`8.49`,
        sol: R`순간 중심까지 거리 $r\sqrt2$. $v=\omega r\sqrt2=6\sqrt2=8.49$ m/s.` },
      { sec: '15.8', type: 'num', lv: 2, q: R`반지름 0.25 m 바퀴가 $\omega=8$ rad/s, $\alpha=4$ rad/s²로 미끄러지지 않고 구른다. 접촉점의 가속도 크기(m/s²)는?`, ans: '0.25*64', ansTex: R`16`,
        sol: R`$r\omega^2=16$ m/s², 중심 쪽(위). $\alpha$ 항은 중심의 가속도와 상쇄됩니다.` },
      { sec: '15.8', type: 'num', lv: 3, q: R`길이 1 m 막대가 $A$(바닥)와 $B$(벽)로 미끄러진다. 벽과 45°인 순간 $A$가 일정한 속력 1 m/s로 벽에서 멀어진다. 막대의 각가속도 크기(rad/s²)는?`, ans: '2*sqrt(2)', ansTex: R`2.83`,
        sol: R`$x_A=\sin\theta$, $\dot x_A=\cos\theta\,\dot\theta=1$ → $\dot\theta=\sqrt2$. $\ddot x_A=0=-\sin\theta\,\dot\theta^2+\cos\theta\,\ddot\theta$ → $\ddot\theta=\tan\theta\,\dot\theta^2=1\cdot2=2$ rad/s². 끝의 속력이 일정해도 막대는 각가속합니다.` },
      { sec: '15.8', type: 'open', lv: 2, proof: true, q: R`강체 위의 두 점 $A$, $B$에 대해 $\mathbf v_B=\mathbf v_A+\boldsymbol\omega\times\mathbf r_{B/A}$에서 $\mathbf a_B=\mathbf a_A+\boldsymbol\alpha\times\mathbf r_{B/A}-\omega^2\mathbf r_{B/A}$(평면 운동)를 유도하세요.`,
        sol: R`
미분: $\mathbf a_B=\mathbf a_A+\dot{\boldsymbol\omega}\times\mathbf r_{B/A}+\boldsymbol\omega\times\dot{\mathbf r}_{B/A}$.
강체에서 $\mathbf r_{B/A}$는 길이가 일정하고 $\boldsymbol\omega$로 돌므로 $\dot{\mathbf r}_{B/A}=\boldsymbol\omega\times\mathbf r_{B/A}$.
$\mathbf a_B=\mathbf a_A+\boldsymbol\alpha\times\mathbf r_{B/A}+\boldsymbol\omega\times(\boldsymbol\omega\times\mathbf r_{B/A})$.
평면 운동($\boldsymbol\omega=\omega\mathbf k$, $\mathbf r\perp\mathbf k$): $\mathbf k\times(\mathbf k\times\mathbf r)=\mathbf k(\mathbf k\cdot\mathbf r)-\mathbf r(\mathbf k\cdot\mathbf k)=-\mathbf r$이므로 마지막 항 $=-\omega^2\mathbf r_{B/A}$.`,
        rubric: R`
- 곱 규칙 미분 — 3점
- $\dot{\mathbf r}_{B/A}=\boldsymbol\omega\times\mathbf r_{B/A}$ — 3점
- 삼중곱 전개 — 4점` },
      { sec: '14.12', type: 'open', lv: 2, proof: true, q: R`시각 $t$의 로켓 전체(질량 $m+dm$)를 계로 잡아 충격량-운동량 원리로 $m\,dv/dt=\sum F+u\lvert dm/dt\rvert$를 유도하세요($u$: 가스의 상대 속도).`,
        sol: R`
$t$: 운동량 $(m+dm)v$. $t+dt$: 로켓 $m(v+dv)$, 가스 $dm(v-u)$(절대 속도).
$L_2-L_1=mv+m\,dv+v\,dm-u\,dm-mv-v\,dm=m\,dv-u\,dm$.
충격량 $\sum F\,dt$와 같게 두고 $dt$로 나누면 $m\frac{dv}{dt}=\sum F+u\frac{dm}{dt}$ ($dm>0$: 잃은 질량). 곱 $dm\,dv$ 같은 2차 미소량은 버렸습니다.`,
        rubric: R`
- 계를 질량 일정하게 잡음 — 3점
- 두 시각의 운동량 — 4점
- 정리와 2차 항 무시 — 3점` },
    ],
  });
})();
