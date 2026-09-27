/* 10 회전 좌표계와 코리올리 가속도 — B&J 15.10–15.11, 15.14–15.15, 수업 필기 4월 27일·29일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 10, part: 'C', title: '회전 좌표계와 코리올리 가속도', en: 'Rotating Frames & Coriolis Acceleration', ref: 'B&J 15.10–15.15 · 필기 4/27, 4/29', plot: 'dyCoriolis',
    fig: R`회전하는 원판 위를 곧게 달리는 공이 고정된 틀에서 그리는 휘어진 궤적`,
    tagline: R`도는 틀 안에서 본 운동과 밖에서 본 운동은 다릅니다. 그 차이를 정확히 적는 식 하나, 벡터의 미분 규칙 (Q̇)_OXY = (Q̇)_oxy + Ω × Q가 이 단원의 전부입니다.`,
    summary: R`고정된 틀 $OXY$에 대해 각속도 $\boldsymbol\Omega$로 도는 틀 $oxy$의 단위벡터는 시간에 따라 방향이 바뀌므로 $d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$입니다. 그래서 어떤 벡터 $\mathbf Q$를 회전 틀의 성분으로 쓰면 고정 틀에서 본 변화율은 **회전 틀에서 본 변화율 + 보정항** $(\dot{\mathbf Q})_{OXY}=(\dot{\mathbf Q})_{oxy}+\boldsymbol\Omega\times\mathbf Q$입니다. 이를 위치에 적용하면 $\mathbf v_P=\mathbf v_o+(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r$, 한 번 더 적용하면 $\mathbf a_P=\mathbf a_o+(\ddot{\mathbf r})_{oxy}+\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)+2\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$이고 마지막 항이 **코리올리 가속도**입니다. 회전하는 팔 위의 고리, 도는 관 속의 물, 지구 위의 바람처럼 “움직이는 것 위에서 움직이는” 문제에 씁니다. 같은 식이 3차원 강체의 각운동량 미분(15단원)에도 그대로 쓰입니다.`,
    goals: [
      R`회전 틀의 단위벡터의 도함수 $d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$를 유도할 수 있다`,
      R`$(\dot{\mathbf Q})_{OXY}=(\dot{\mathbf Q})_{oxy}+\boldsymbol\Omega\times\mathbf Q$를 유도하고 각 항의 뜻을 설명할 수 있다`,
      R`회전하며 병진하는 틀에서 절대 속도와 절대 가속도 식을 유도할 수 있다`,
      R`코리올리 가속도의 크기와 방향을 구하고 물리적 의미를 설명할 수 있다`,
      R`회전하는 팔 위의 고리, 도는 관 속의 유체 입자의 가속도를 계산할 수 있다`,
    ],
    secTitles: { '15.10': '회전 틀에서의 미분', '15.11a': '절대 속도', '15.11b': '코리올리 가속도', '15.14': '3차원과 일반 운동' },
    sections: [
      { k: '15.10', p: 971, src: '수업 필기 · 4월 27일', title: '회전하는 틀에서 본 벡터의 변화율', body: R`
9단원에서는 기준점 $A$와 함께 **병진**만 하는 틀을 썼습니다($\mathbf r_B=\mathbf r_A+\mathbf r_{B/A}$). 이제 틀이 **회전**도 합니다.

어떤 벡터를 회전 틀의 단위벡터로 적습니다: $\mathbf Q=Q_x\mathbf i+Q_y\mathbf j+Q_z\mathbf k$. 고정 틀에서 미분하면
$$(\dot{\mathbf Q})_{OXY}=\dot Q_x\mathbf i+\dot Q_y\mathbf j+\dot Q_z\mathbf k+Q_x\frac{d\mathbf i}{dt}+Q_y\frac{d\mathbf j}{dt}+Q_z\frac{d\mathbf k}{dt}.$$
고정 틀의 $\mathbf I,\mathbf J,\mathbf K$와 달리 $d\mathbf i/dt$는 0이 아닙니다(필기: “반드시 0은 아니다”).

:::key 회전 틀 단위벡터의 도함수
$$\frac{d\mathbf i}{dt}=\boldsymbol\Omega\times\mathbf i,\qquad\frac{d\mathbf j}{dt}=\boldsymbol\Omega\times\mathbf j,\qquad\frac{d\mathbf k}{dt}=\boldsymbol\Omega\times\mathbf k$$
:::

필기의 논증: 단위벡터 $\mathbf i$의 끝점 $P$는 원점에서 길이 1로 틀과 함께 **순수 회전**하므로, 9단원의 $\mathbf v=\boldsymbol\omega\times\mathbf r$에서 $d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$.

:::key 회전 틀에서의 미분 규칙
$$(\dot{\mathbf Q})_{OXY}=(\dot{\mathbf Q})_{oxy}+\boldsymbol\Omega\times\mathbf Q,\qquad(\dot{\mathbf Q})_{oxy}=\dot Q_x\mathbf i+\dot Q_y\mathbf j+\dot Q_z\mathbf k$$
$(\dot{\mathbf Q})_{oxy}$는 회전 틀에 앉은 관찰자가 보는 변화율(단위벡터가 고정되어 보임), $\boldsymbol\Omega\times\mathbf Q$는 틀이 도는 데서 오는 **보정항**이다.
:::

:::ex 예제 1 — 회전 틀에 고정된 벡터
회전 틀에서 성분이 변하지 않는 벡터($(\dot{\mathbf Q})_{oxy}=\mathbf 0$), 예를 들어 강체에 그린 화살표는 고정 틀에서 $\dot{\mathbf Q}=\boldsymbol\Omega\times\mathbf Q$로 변합니다. 9단원의 $\dot{\mathbf r}_{B/A}=\boldsymbol\omega\times\mathbf r_{B/A}$가 이 경우입니다.
:::
` },
      { k: '15.11a', p: 973, src: '수업 필기 · 4월 27일, 29일', title: '회전하며 움직이는 틀에서의 절대 속도', body: R`
회전 틀의 원점 $o$가 고정점 $O$에서 $\mathbf r_o$에 있고, 점 $P$의 위치를 회전 틀에서 $\mathbf r$($=\mathbf r_{P/o}$)로 적습니다: $\mathbf r_P=\mathbf r_o+\mathbf r$. 미분 규칙을 $\mathbf r$에 적용하면:

:::key 절대 속도
$$\mathbf v_P=\mathbf v_o+(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r$$
$\mathbf v_o+\boldsymbol\Omega\times\mathbf r$는 “$P$와 같은 자리에 틀에 붙어 있는 점 $P'$의 속도”(끌림 속도), $(\dot{\mathbf r})_{oxy}$는 틀에 대한 $P$의 상대 속도다.
:::

필기의 두 극단: $P$가 틀에 붙어 있으면 $(\dot{\mathbf r})_{oxy}=\mathbf 0$이라 강체의 속도 식, 틀이 돌지 않으면($\boldsymbol\Omega=\mathbf 0$) 9단원의 병진 틀 식입니다.

:::fig dCoriolis
:::

:::ex 예제 2
수평면에서 일정한 $\Omega=3$ rad/s로 도는 팔을 따라 고리가 팔에 대해 0.5 m/s로 바깥으로 움직인다. 회전축에서 0.4 m인 순간 고리의 절대 속력은?
---
$(\dot{\mathbf r})_{oxy}=0.5$ m/s(팔 방향), $\boldsymbol\Omega\times\mathbf r=1.2$ m/s(팔에 수직). $v=\sqrt{0.25+1.44}=1.30$ m/s.
:::
` },
      { k: '15.11b', p: 975, src: '수업 필기 · 4월 29일', title: '절대 가속도와 코리올리 가속도', body: R`
$\mathbf v_P=\mathbf v_o+(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r$을 한 번 더 고정 틀에서 미분합니다. 필기처럼 두 부분으로 나눕니다.
- **①** $\mathbf Q=(\dot{\mathbf r})_{oxy}$에 규칙 적용: $\dfrac{d}{dt}(\dot{\mathbf r})_{oxy}=(\ddot{\mathbf r})_{oxy}+\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$.
- **②** $\mathbf Q=\boldsymbol\Omega\times\mathbf r$: $\dfrac{d}{dt}(\boldsymbol\Omega\times\mathbf r)=\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times\dot{\mathbf r}=\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times\big[(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r\big]$.
$\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$가 ①과 ②에서 한 번씩 나옵니다.

:::key 절대 가속도
$$\mathbf a_P=\underbrace{\mathbf a_o+\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)}_{\text{끌림 가속도 }\mathbf a_{P'}}+\underbrace{(\ddot{\mathbf r})_{oxy}}_{\text{상대 가속도}}+\underbrace{2\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}}_{\text{코리올리 가속도}}$$
평면 운동에서 코리올리 가속도의 크기는 $2\Omega v_{\text{rel}}$이고, 방향은 상대 속도를 $\boldsymbol\Omega$의 방향으로 90° 돌린 쪽이다.
:::

:::warn 코리올리 항을 빠뜨리는 실수
“틀에 붙은 점의 가속도 + 상대 가속도”만 더하면 틀립니다. 2단원 극좌표의 $2\dot r\dot\theta$ 항이 바로 이 코리올리 가속도입니다($\Omega=\dot\theta$, $v_{\text{rel}}=\dot r$). 두 번 나오는 이유도 같습니다: 상대 속도의 **방향**이 틀과 함께 돌고, 끌림 속도 $\boldsymbol\Omega\times\mathbf r$의 **크기**가 $r$이 변하며 바뀝니다.
:::

:::ex 예제 3 — 도는 팔 위의 고리
예제 2(일정한 $\Omega=3$ rad/s, $r=0.4$ m, 상대 속도 0.5 m/s 바깥, 상대 가속도 0.8 m/s² 바깥)의 절대 가속도는?
---
끌림: $\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)=-\Omega^2r=-3.6$ m/s²(중심 쪽). 상대: $+0.8$(바깥). 반지름 방향 합 $-2.8$ m/s².
코리올리: $2\Omega v_{\text{rel}}=3.0$ m/s², 팔에 수직(회전 방향 앞쪽).
$\lvert\mathbf a\rvert=\sqrt{2.8^2+3.0^2}=4.10$ m/s². 팔이 고리를 옆으로 미는 힘은 $m\times3.0$입니다.
:::

:::ex 예제 4 — 도는 관 속의 물
수평면에서 일정한 120 rpm으로 도는 곧은 관을 따라 물이 관에 대해 5 m/s로 바깥으로 흐른다. 축에서 0.5 m인 물 입자의 코리올리 가속도는?
---
$\Omega=120(2\pi/60)=12.57$ rad/s. $2\Omega v_{\text{rel}}=2(12.57)(5)=125.7$ m/s². 구심 가속도 $\Omega^2r=79.0$ m/s²보다 큽니다 — 관은 물을 옆으로 크게 밀어야 합니다(원심 펌프의 토크).
:::

:::note 지구 위의 코리올리
지구는 $\Omega=7.29\times10^{-5}$ rad/s로 돕니다. 북반구에서 북쪽으로 20 m/s로 부는 바람의 코리올리 가속도 크기는 $2\Omega v\sin\phi$(위도 $\phi=45°$에서 $2.1\times10^{-3}$ m/s²)로 작지만, 수백 km를 지나면 태풍의 회전 방향을 정할 만큼 쌓입니다.
:::
` },
      { k: '15.14', p: 998, src: '수업 필기 · 4월 27일', title: '3차원 회전 틀과 일반 운동', body: R`
위의 식은 차원과 무관하게 벡터로 유도했으므로 3차원에서도 그대로입니다. 다만 3차원에서는 $\boldsymbol\Omega$ 자체의 방향이 변할 수 있어 $\dot{\boldsymbol\Omega}$를 구할 때도 규칙을 씁니다.

:::key 각속도의 변화율
틀 $oxy$가 각속도 $\boldsymbol\Omega_1$로 돌고, 그 틀에 대해 물체가 $\boldsymbol\omega_2$로 돌면 물체의 각속도는 $\boldsymbol\omega=\boldsymbol\Omega_1+\boldsymbol\omega_2$이고
$$\dot{\boldsymbol\omega}=(\dot{\boldsymbol\omega})_{oxy}+\boldsymbol\Omega_1\times\boldsymbol\omega=(\dot{\boldsymbol\omega}_2)_{oxy}+\dot{\boldsymbol\Omega}_1+\boldsymbol\Omega_1\times\boldsymbol\omega_2.$$
:::

:::ex 예제 5 — 수직축을 도는 팔 끝의 회전 원판
원판이 자기 축(수평 $x$)에 대해 일정한 $\omega_1=6$ rad/s로 돌고, 그 축이 연직 $y$축 둘레를 일정한 $\Omega=2.5$ rad/s로 돈다. 원판의 각가속도는?
---
$\boldsymbol\omega=\omega_1\mathbf i+\Omega\mathbf j$. 두 크기가 일정해도 $\mathbf i$가 $\boldsymbol\Omega=\Omega\mathbf j$로 돌기 때문에 $\dot{\boldsymbol\omega}=\boldsymbol\Omega\times\omega_1\mathbf i=\Omega\omega_1(\mathbf j\times\mathbf i)=-15\,\mathbf k$ rad/s². 15단원의 자이로 효과가 여기서 나옵니다.
:::

:::tip 회전 틀을 고르는 요령
각속도가 일정한 부분(팔, 축, 관)에 틀을 붙이면 $(\dot{\ })_{oxy}$ 항이 간단해집니다. 3차원 강체에서는 관성 모멘트가 일정하게 보이는 **몸체에 붙은 틀**을 고릅니다(15단원).
:::
` },
    ],
    problems: [
      { sec: '15.10', type: 'mc', lv: 1, q: R`$(\dot{\mathbf Q})_{OXY}=(\dot{\mathbf Q})_{oxy}+\boldsymbol\Omega\times\mathbf Q$에서 $\boldsymbol\Omega\times\mathbf Q$가 생기는 이유는?`,
        choices: [R`$\mathbf Q$의 크기가 변하므로`, R`회전 틀의 단위벡터가 고정 틀에서 보면 돌기 때문에`, R`코리올리 힘 때문에`, R`$\mathbf Q$가 위치 벡터이므로`], ans: 1,
        sol: R`$d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$ 등을 모으면 $\boldsymbol\Omega\times\mathbf Q$가 됩니다. 모든 벡터에 성립합니다.` },
      { sec: '15.10', type: 'num', lv: 2, q: R`$\boldsymbol\Omega=2\mathbf k$ rad/s로 도는 틀에서 $\mathbf Q=3\mathbf i+t\,\mathbf j$ (단위벡터는 회전 틀). $t=1$에서 고정 틀에서 본 $\dot{\mathbf Q}$의 $\mathbf i$ 성분은?`, ans: '-2', ansTex: R`-2`,
        sol: R`$(\dot{\mathbf Q})_{oxy}=\mathbf j$, $\boldsymbol\Omega\times\mathbf Q=2\mathbf k\times(3\mathbf i+\mathbf j)=6\mathbf j-2\mathbf i$. 합 $-2\mathbf i+7\mathbf j$.` },
      { sec: '15.11a', type: 'num', lv: 1, q: R`$\Omega=3$ rad/s로 도는 팔 위의 고리가 $r=0.4$ m에서 팔에 대해 0.5 m/s로 바깥으로 움직인다. 절대 속력(m/s)은?`, ans: 'sqrt(0.25+1.44)', ansTex: R`1.30`,
        sol: R`$\sqrt{0.5^2+(3\times0.4)^2}=1.30$ m/s.` },
      { sec: '15.11b', type: 'num', lv: 1, q: R`$\Omega=4$ rad/s로 도는 틀에서 상대 속도 1.5 m/s(회전 평면 안)로 움직이는 점의 코리올리 가속도 크기(m/s²)는?`, ans: '12', ansTex: R`12`,
        sol: R`$2\Omega v_{\text{rel}}=2(4)(1.5)=12$ m/s².` },
      { sec: '15.11b', type: 'num', lv: 2, q: R`예제 3(Ω=3 rad/s 일정, r=0.4 m, 상대 속도 0.5 m/s, 상대 가속도 0.8 m/s², 모두 바깥)의 절대 가속도 크기(m/s²)는?`, ans: 'sqrt(2.8^2+3^2)', ansTex: R`4.10`,
        sol: R`반지름 $0.8-3.6=-2.8$, 가로 $2(3)(0.5)=3.0$. $\sqrt{7.84+9}=4.10$.` },
      { sec: '15.11b', type: 'num', lv: 2, q: R`150 rpm으로 도는 관 속을 관에 대해 3 m/s로 흐르는 물의 코리올리 가속도(m/s²)는?`, ans: '2*5*pi*3', ansTex: R`94.2`,
        sol: R`$\Omega=150(2\pi/60)=5\pi$ rad/s, $2\Omega v=30\pi=94.2$ m/s².` },
      { sec: '15.11b', type: 'mc', lv: 2, q: R`반시계로 도는 원판 위에서 중심에서 바깥으로 곧게 달리는(원판에 대해) 점의 코리올리 가속도 방향은?`,
        choices: [R`바깥쪽`, R`중심 쪽`, R`회전 방향(반시계 쪽 옆)`, R`회전 반대 방향 옆`], ans: 2,
        sol: R`$2\boldsymbol\Omega\times\mathbf v_{\text{rel}}$: $\mathbf k\times\mathbf e_r=\mathbf e_\theta$ — 회전 방향 쪽 옆입니다. 원판에 붙은 관찰자에게는 반대쪽으로 휘는 것처럼 보입니다.` },
      { sec: '15.11b', type: 'num', lv: 3, q: R`$\Omega=2$ rad/s, $\dot\Omega=1$ rad/s²로 도는 팔 위의 고리가 $r=0.5$ m에서 팔에 대해 정지해 있다. 절대 가속도 크기(m/s²)는?`, ans: 'sqrt(2^2+0.5^2)', ansTex: R`2.06`,
        sol: R`상대 속도·가속도가 0이라 코리올리도 0. 끌림: 구심 $\Omega^2r=2$, 접선 $\dot\Omega r=0.5$. $\sqrt{4.25}=2.06$ m/s².` },
      { sec: '15.14', type: 'num', lv: 2, q: R`원판이 자기 축(수평)에 대해 10 rad/s, 그 축이 연직축 둘레로 2 rad/s로 돈다(둘 다 일정). 원판의 각가속도 크기(rad/s²)는?`, ans: '20', ansTex: R`20`,
        sol: R`$\lvert\boldsymbol\Omega\times\omega_1\mathbf i\rvert=2\times10=20$ rad/s², 방향은 수평이고 축에 수직.` },
      { sec: '15.14', type: 'mc', lv: 2, q: R`각속도 벡터의 크기가 일정한데도 각가속도가 0이 아닐 수 있는 이유는?`,
        choices: [R`3차원에서는 각가속도가 정의되지 않으므로`, R`각속도 벡터의 방향이 변할 수 있으므로`, R`관성 모멘트가 변하므로`, R`코리올리 효과 때문에`], ans: 1,
        sol: R`벡터의 변화에는 크기 변화와 방향 변화가 있습니다. 평면 운동에서는 방향이 $\mathbf k$로 고정이라 이 효과가 없습니다.` },
      { sec: '15.11b', type: 'open', lv: 2, proof: true, q: R`회전 틀 원점의 가속도 $\mathbf a_o$, 틀의 각속도 $\boldsymbol\Omega$가 주어질 때 $\mathbf r_P=\mathbf r_o+\mathbf r$에서 절대 가속도 식(코리올리 항 포함)을 유도하세요.`,
        sol: R`
속도: $\mathbf v_P=\mathbf v_o+\dot{\mathbf r}=\mathbf v_o+(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r$ (미분 규칙).
가속도: $\mathbf a_P=\mathbf a_o+\frac{d}{dt}(\dot{\mathbf r})_{oxy}+\frac{d}{dt}(\boldsymbol\Omega\times\mathbf r)$.
$\frac{d}{dt}(\dot{\mathbf r})_{oxy}=(\ddot{\mathbf r})_{oxy}+\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$ (규칙을 $\mathbf Q=(\dot{\mathbf r})_{oxy}$에).
$\frac{d}{dt}(\boldsymbol\Omega\times\mathbf r)=\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times[(\dot{\mathbf r})_{oxy}+\boldsymbol\Omega\times\mathbf r]$.
합: $\mathbf a_P=\mathbf a_o+(\ddot{\mathbf r})_{oxy}+\dot{\boldsymbol\Omega}\times\mathbf r+\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)+2\boldsymbol\Omega\times(\dot{\mathbf r})_{oxy}$.`,
        rubric: R`
- 속도 식 — 2점
- 상대 속도 항의 미분(규칙 적용) — 3점
- 끌림 항의 미분 — 3점
- 코리올리 항이 두 번 나와 합쳐짐 — 2점` },
      { sec: '15.10', type: 'open', lv: 2, proof: true, q: R`회전 틀의 단위벡터 $\mathbf i$에 대해 $d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$임을 설명하고, 이로부터 임의의 벡터 $\mathbf Q$에 대한 미분 규칙을 유도하세요.`,
        sol: R`
$\mathbf i$의 시작점을 틀의 원점에 두면 끝점은 길이 1을 유지하며 틀과 함께 돕니다 — 원점에 대한 순수 회전. 순수 회전하는 점의 속도는 $\boldsymbol\Omega\times(\text{위치})$이므로 $d\mathbf i/dt=\boldsymbol\Omega\times\mathbf i$. $\mathbf j,\mathbf k$도 같습니다.
$\mathbf Q=Q_x\mathbf i+Q_y\mathbf j+Q_z\mathbf k$를 고정 틀에서 곱 규칙으로 미분: $\dot Q_x\mathbf i+\dot Q_y\mathbf j+\dot Q_z\mathbf k+Q_x\boldsymbol\Omega\times\mathbf i+Q_y\boldsymbol\Omega\times\mathbf j+Q_z\boldsymbol\Omega\times\mathbf k$.
앞 세 항이 $(\dot{\mathbf Q})_{oxy}$, 뒤 세 항은 외적의 분배법칙으로 $\boldsymbol\Omega\times\mathbf Q$.`,
        rubric: R`
- 단위벡터 끝점의 순수 회전 논증 — 4점
- 곱 규칙 전개 — 3점
- 분배법칙으로 정리 — 3점` },
    ],
  });
})();
