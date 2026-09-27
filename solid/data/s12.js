/* 12 응력·변형률 변환과 모어 원 — B&J 7.1, 7.2, 7.4, 7.7, 7.9, 강의 슬라이드 Lecture 10 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 12, part: 'C', title: '응력·변형률 변환과 모어 원', en: 'Transformations of Stress & Strain', ref: 'B&J 7.1–7.2, 7.4, 7.7, 7.9 · Lecture 10', plot: 'slMohr',
    fig: R`평면 응력 상태들의 모어 원. 한 점의 모든 면의 응력이 원 하나 위에 있다`,
    tagline: R`같은 점에서도 자르는 면의 방향에 따라 응력이 달라집니다. 그중 가장 큰 수직 응력과 가장 큰 전단 응력이 파손을 정합니다.`,
    summary: R`한 점의 응력 성분은 좌표축에 따라 달라집니다. 쐐기의 평형에서 **변환 공식** $\sigma_{x'}=\tfrac{\sigma_x+\sigma_y}2+\tfrac{\sigma_x-\sigma_y}2\cos2\theta+\tau_{xy}\sin2\theta$, $\tau_{x'y'}=-\tfrac{\sigma_x-\sigma_y}2\sin2\theta+\tau_{xy}\cos2\theta$가 나오고, 이 식은 중심 $\sigma_{\text{ave}}$, 반지름 $R=\sqrt{((\sigma_x-\sigma_y)/2)^2+\tau_{xy}^2}$인 **모어 원**을 그립니다. 전단 응력이 0인 **주평면**에서 수직 응력이 최대·최소 $\sigma_{\text{ave}}\pm R$이고, 그와 45°인 면에서 면내 전단 응력이 최대 $R$입니다. 평면 응력에서도 세 번째 주응력 0을 잊으면 **절대 최대 전단 응력**을 놓칩니다. 변형률도 같은 공식을 따르되 전단 자리에 **$\gamma/2$**가 들어가고, 세 방향 스트레인 게이지(**로제트**)로 한 점의 변형률 상태를 모두 구합니다.`,
    goals: [
      R`쐐기의 평형으로 평면 응력의 변환 공식을 유도할 수 있다`,
      R`주응력, 주평면의 각, 면내 최대 전단 응력과 그 면의 수직 응력을 구할 수 있다`,
      R`모어 원을 그리고 원 위의 각 $2\theta$와 요소의 회전 $\theta$를 대응시킬 수 있다`,
      R`세 번째 주응력 0을 포함해 절대 최대 전단 응력을 구할 수 있다`,
      R`변형률 변환에 $\gamma/2$가 들어가는 이유를 설명하고 주변형률을 구할 수 있다`,
      R`45° 로제트의 세 읽음값에서 $\varepsilon_x,\varepsilon_y,\gamma_{xy}$를 구할 수 있다`,
    ],
    secTitles: { '7.1a': '변환 공식', '7.1b': '주응력', '7.2': '모어 원', '7.4': '절대 최대 전단', '7.7': '변형률 변환', '7.9': '로제트' },
    sections: [
      { k: '7.1a', p: 480, src: '강의 슬라이드 · Lecture 10 A', title: '평면 응력의 변환 공식', body: R`
강의의 관찰: “같은 점이라도 자르는 면의 방향에 따라 응력 성분이 다르다. 그러니 응력이 최대가 되는 방향이 있다.” 그 방향을 찾으려면 먼저 임의의 각 $\theta$로 돌린 축 $x'y'$에서의 성분을 알아야 합니다.

**평면 응력**: $\sigma_z=\tau_{xz}=\tau_{yz}=0$이고 $\sigma_x,\sigma_y,\tau_{xy}$만 있는 상태. 얇은 판, 부재의 자유 표면이 전형입니다.

:::fig sWedge
:::

:::key 평면 응력의 변환 공식
$x'$축이 $x$축에서 반시계로 $\theta$일 때
$$\sigma_{x'}=\frac{\sigma_x+\sigma_y}2+\frac{\sigma_x-\sigma_y}2\cos2\theta+\tau_{xy}\sin2\theta$$
$$\tau_{x'y'}=-\frac{\sigma_x-\sigma_y}2\sin2\theta+\tau_{xy}\cos2\theta$$
$\sigma_{y'}$은 $\theta$ 대신 $\theta+90°$를 넣은 값이고, $\sigma_{x'}+\sigma_{y'}=\sigma_x+\sigma_y$(불변량)이다.
:::

2단원의 경사면 공식($\sigma_\theta=\sigma_0\cos^2\theta$)은 $\sigma_y=\tau_{xy}=0$인 특수한 경우입니다.

:::ex 예제 1
$\sigma_x=60$, $\sigma_y=-20$, $\tau_{xy}=30$ MPa인 요소를 반시계로 30° 돌린 면의 성분은?
---
$\sigma_{\text{ave}}=20$, $\tfrac{\sigma_x-\sigma_y}2=40$. $2\theta=60°$.
$\sigma_{x'}=20+40(0.5)+30(0.866)=66.0$ MPa, $\tau_{x'y'}=-40(0.866)+30(0.5)=-19.6$ MPa, $\sigma_{y'}=40-66.0=-26.0$ MPa.
:::
` },
      { k: '7.1b', p: 482, src: '강의 슬라이드 · Lecture 10 C (Principal Stress and Principal Axis)', title: '주응력과 최대 전단 응력', body: R`
$d\sigma_{x'}/d\theta=0$은 $\tau_{x'y'}=0$과 같은 식입니다. 수직 응력이 극값인 면에는 전단 응력이 없습니다.

:::key 주응력과 주평면
$$\tan2\theta_p=\frac{2\tau_{xy}}{\sigma_x-\sigma_y},\qquad\sigma_{\max,\min}=\frac{\sigma_x+\sigma_y}2\pm\sqrt{\Big(\frac{\sigma_x-\sigma_y}2\Big)^2+\tau_{xy}^2}$$
두 주평면은 서로 90°이고 그 면의 전단 응력은 0이다.
:::

:::key 면내 최대 전단 응력
$$\tau_{\max}=R=\sqrt{\Big(\frac{\sigma_x-\sigma_y}2\Big)^2+\tau_{xy}^2},\qquad\tan2\theta_s=-\frac{\sigma_x-\sigma_y}{2\tau_{xy}}$$
최대 전단면은 주평면과 45°이고, 그 면의 수직 응력은 $0$이 아니라 $\sigma_{\text{ave}}$이다.
:::

:::ex 예제 2
예제 1의 요소($60,-20,30$)의 주응력과 방향, 최대 전단 응력은?
---
$R=\sqrt{40^2+30^2}=50$. $\sigma_1=70$, $\sigma_2=-30$ MPa.
$\tan2\theta_p=60/80=0.75$, $\theta_p=18.4°$. 이 면에 $\sigma_{x'}=20+40\cos36.9°+30\sin36.9°=70$을 확인해 $\sigma_1$의 면임을 정합니다(다른 해 $108.4°$는 $\sigma_2$).
$\tau_{\max}=50$ MPa, $\theta_s=18.4°-45°=-26.6°$, 그 면의 수직 응력 20 MPa.
:::

:::warn tan의 두 해
$\tan2\theta_p$는 $2\theta_p$와 $2\theta_p+180°$에서 같은 값입니다. 둘 중 어느 것이 $\sigma_{\max}$의 면인지는 변환 공식에 넣어 확인하거나 모어 원에서 읽습니다.
:::
` },
      { k: '7.2', p: 492, src: '강의 슬라이드 · Lecture 10 C', title: '모어 원', body: R`
변환 공식에서 $2\theta$를 소거하면(강의의 “Eq. A 다시 보기”)
$$\big(\sigma_{x'}-\sigma_{\text{ave}}\big)^2+\tau_{x'y'}^2=R^2.$$
모든 면의 $(\sigma,\tau)$가 한 원 위에 있습니다. 강의는 “변형률도 똑같다!!!”고 덧붙입니다.

:::key 모어 원 그리기 (교재 규약)
1. 점 $X(\sigma_x,\ -\tau_{xy})$와 $Y(\sigma_y,\ +\tau_{xy})$를 찍는다($\tau$축은 위가 양). 요소를 시계 방향으로 돌리려는 전단 응력의 면이 가로축 위에 온다.
2. $XY$를 이은 지름의 중점 $C(\sigma_{\text{ave}},0)$가 중심, $CX$가 반지름 $R$.
3. 요소를 $\theta$만큼 돌리면 원 위에서는 **같은 방향으로 $2\theta$** 돈다.
:::

:::fig sMohr
:::

:::tip 원에서 바로 읽는 것
가로축과 만나는 두 점이 주응력, 꼭대기와 바닥이 $\pm\tau_{\max}$, 중심이 최대 전단면의 수직 응력입니다. 원이 가로축의 한쪽에만 있으면(두 주응력이 같은 부호) 면내 최대 전단보다 절대 최대 전단이 더 큽니다(다음 절).
:::

:::note 순수 전단과 비틀림
$\sigma_x=\sigma_y=0$, $\tau_{xy}=\tau$이면 원의 중심이 원점이고 $\sigma_{1,2}=\pm\tau$, 주평면은 45°입니다. 6단원에서 비틀린 분필이 45° 나선으로 끊어지는 이유입니다.
:::
` },
      { k: '7.4', p: 504, title: '3차원으로 보기: 절대 최대 전단 응력', body: R`
평면 응력도 3차원에서 보면 주응력이 셋입니다: $\sigma_a$, $\sigma_b$(면내)와 $\sigma_c=0$(면에 수직). 세 쌍의 주응력으로 원 세 개를 그리면, 가장 큰 원의 반지름이 한 점의 **절대 최대 전단 응력**입니다.

:::key 절대 최대 전단 응력
$$\tau_{\text{abs,max}}=\frac{\sigma_{\max}-\sigma_{\min}}{2},\qquad\sigma_{\max},\sigma_{\min}\in\{\sigma_a,\sigma_b,0\}$$
면내 주응력의 부호가 다르면 $\tau_{\text{abs,max}}=R$(면내 값), 같은 부호면 $\tau_{\text{abs,max}}=\max(|\sigma_a|,|\sigma_b|)/2$이다.
:::

:::ex 예제 3
면내 주응력이 80 MPa, 30 MPa(둘 다 인장)인 점의 면내 최대 전단 응력과 절대 최대 전단 응력은?
---
면내: $(80-30)/2=25$ MPa. 절대: $(80-0)/2=40$ MPa. 13단원의 압력 용기가 정확히 이 상황입니다.
:::
` },
      { k: '7.7', p: 529, src: '강의 슬라이드 · Lecture 10 B', title: '평면 변형률의 변환', body: R`
3단원에서 본 대로 텐서 변형률 $\varepsilon_{xy}=\gamma_{xy}/2$가 응력의 $\tau_{xy}$ 자리에 들어갑니다(강의: Tensor Strains / Engineering Strains).

:::key 변형률 변환 공식
$$\varepsilon_{x'}=\frac{\varepsilon_x+\varepsilon_y}2+\frac{\varepsilon_x-\varepsilon_y}2\cos2\theta+\frac{\gamma_{xy}}2\sin2\theta$$
$$\frac{\gamma_{x'y'}}2=-\frac{\varepsilon_x-\varepsilon_y}2\sin2\theta+\frac{\gamma_{xy}}2\cos2\theta$$
주변형률 $\varepsilon_{1,2}=\varepsilon_{\text{ave}}\pm\sqrt{\big(\tfrac{\varepsilon_x-\varepsilon_y}2\big)^2+\big(\tfrac{\gamma_{xy}}2\big)^2}$, 모어 원의 세로축은 $\gamma/2$.
:::

:::ex 예제 4
$\varepsilon_x=400$, $\varepsilon_y=-100$, $\gamma_{xy}=300$ (με). 주변형률과 면내 최대 전단 변형률은?
---
$\varepsilon_{\text{ave}}=150$, 반지름 $\sqrt{250^2+150^2}=291.5$. $\varepsilon_1=441.5$, $\varepsilon_2=-141.5$ με.
면내 최대 **공학** 전단 변형률은 지름: $\gamma_{\max}=2(291.5)=583$ με. $\tan2\theta_p=300/500$, $\theta_p=15.5°$.
:::

:::warn 가장 흔한 실수
변형률 모어 원에 $\gamma_{xy}$를 그대로 찍는 것. 반지름이 두 배 가까이 틀어집니다. 등방성 재료에서는 주응력 방향과 주변형률 방향이 같습니다.
:::
` },
      { k: '7.9', p: 538, src: '강의 슬라이드 · Lecture 10 D', title: '스트레인 로제트', body: R`
스트레인 게이지는 붙인 방향의 수직 변형률만 잽니다. 전단 변형률은 직접 잴 수 없으므로, 세 방향 $\theta_a,\theta_b,\theta_c$에 게이지를 붙여(로제트) 세 식을 풉니다. 강의는 게이지의 원리를 시험에서 제외하고 계산만 다뤘습니다.

:::key 로제트의 식
$$\varepsilon_\theta=\varepsilon_x\cos^2\theta+\varepsilon_y\sin^2\theta+\gamma_{xy}\sin\theta\cos\theta$$
세 방향에 대해 쓰고 $\varepsilon_x,\varepsilon_y,\gamma_{xy}$를 푼다. **45° 로제트**($0°,45°,90°$)이면
$$\varepsilon_x=\varepsilon_a,\qquad\varepsilon_y=\varepsilon_c,\qquad\gamma_{xy}=2\varepsilon_b-\varepsilon_a-\varepsilon_c.$$
:::

:::ex 예제 5
45° 로제트의 읽음값이 $\varepsilon_a=500$, $\varepsilon_b=300$, $\varepsilon_c=-100$ με이다. 강철($E=200$ GPa, $\nu=0.3$)의 평면 응력 $\sigma_x$는?
---
$\varepsilon_x=500$, $\varepsilon_y=-100$, $\gamma_{xy}=600-500+100=200$ με.
평면 응력의 훅 법칙(14단원) $\sigma_x=\dfrac{E}{1-\nu^2}(\varepsilon_x+\nu\varepsilon_y)=\dfrac{200000}{0.91}(500-30)\times10^{-6}=103.3$ MPa.
:::
` },
    ],
    problems: [
      { sec: '7.1a', type: 'num', lv: 1, q: R`$\sigma_x=60$, $\sigma_y=-20$, $\tau_{xy}=30$ MPa인 요소를 반시계로 30° 돌린 면의 수직 응력 $\sigma_{x'}$(MPa)은?`, ans: '20+40*cos(pi/3)+30*sin(pi/3)', ansTex: R`66.0\ \text{MPa}`,
        sol: R`$20+40(0.5)+30(0.866)=66.0$ MPa.` },
      { sec: '7.1a', type: 'num', lv: 1, q: R`같은 회전에서 $\tau_{x'y'}$(MPa)는?`, ans: '-40*sin(pi/3)+30*cos(pi/3)', ansTex: R`-19.6\ \text{MPa}`,
        sol: R`$-40(0.866)+30(0.5)=-19.6$ MPa.` },
      { sec: '7.1a', type: 'mc', lv: 1, q: R`좌표를 돌려도 변하지 않는 양은?`,
        choices: [R`$\sigma_{x'}$`, R`$\tau_{x'y'}$`, R`$\sigma_{x'}+\sigma_{y'}$`, R`$\sigma_{x'}-\sigma_{y'}$`], ans: 2,
        sol: R`$\sigma_{x'}+\sigma_{y'}=\sigma_x+\sigma_y$(모어 원의 중심의 두 배)는 불변량입니다.` },
      { sec: '7.1b', type: 'num', lv: 1, q: R`$\sigma_x=60$, $\sigma_y=-20$, $\tau_{xy}=30$ MPa의 최대 주응력(MPa)은?`, ans: '70', ansTex: R`70\ \text{MPa}`,
        sol: R`$20+\sqrt{40^2+30^2}=70$ MPa.` },
      { sec: '7.1b', type: 'num', lv: 2, q: R`같은 요소에서 최대 주응력의 면이 $x$축에서 반시계로 몇 도인가?`, ans: '0.5*atan(0.75)*180/pi', ansTex: R`18.4°`,
        sol: R`$\tan2\theta_p=0.75$, $\theta_p=18.4°$. 변환 공식에 넣으면 70 MPa로 최대 쪽이 맞습니다.` },
      { sec: '7.1b', type: 'num', lv: 2, q: R`$\sigma_x=-40$, $\sigma_y=0$, $\tau_{xy}=-25$ MPa의 최대 주응력(MPa)은?`, ans: '-20+sqrt(20^2+25^2)', ansTex: R`12.0\ \text{MPa}`,
        sol: R`$\sigma_{\text{ave}}=-20$, $R=\sqrt{20^2+25^2}=32.0$. $\sigma_1=12.0$, $\sigma_2=-52.0$ MPa.` },
      { sec: '7.1b', type: 'mc', lv: 2, q: R`면내 최대 전단 응력이 작용하는 면의 수직 응력은?`,
        choices: [R`항상 0`, R`$\sigma_{\text{ave}}=(\sigma_x+\sigma_y)/2$`, R`$\sigma_{\max}$`, R`$\tau_{xy}$`], ans: 1,
        sol: R`모어 원의 꼭대기 점의 가로 좌표는 중심 $\sigma_{\text{ave}}$입니다.` },
      { sec: '7.2', type: 'mc', lv: 2, q: R`모어 원에서 요소를 반시계로 25° 돌린 면에 해당하는 점은 $X$에서 어떻게 움직인 점인가? (교재 규약)`,
        choices: [R`반시계로 25°`, R`반시계로 50°`, R`시계로 50°`, R`시계로 25°`], ans: 1,
        sol: R`원 위의 각은 요소 회전의 두 배이고, 교재 규약($X(\sigma_x,-\tau_{xy})$, $\tau$ 위가 양)에서는 방향이 같습니다.` },
      { sec: '7.2', type: 'num', lv: 2, q: R`11단원 예제 5의 점 $H$($\sigma_x=31.8$, $\sigma_y=0$, $\tau=19.1$ MPa)의 최대 주응력(MPa)은?`, ans: '15.915+sqrt(15.915^2+19.099^2)', ansTex: R`40.8\ \text{MPa}`,
        sol: R`$\sigma_{\text{ave}}=15.9$, $R=\sqrt{15.9^2+19.1^2}=24.9$. $\sigma_1=40.8$, $\sigma_2=-8.9$ MPa, $\tau_{\max}=24.9$ MPa.` },
      { sec: '7.4', type: 'num', lv: 1, q: R`면내 주응력이 80, 30 MPa(둘 다 인장)인 평면 응력 점의 절대 최대 전단 응력(MPa)은?`, ans: '40', ansTex: R`40\ \text{MPa}`,
        sol: R`세 주응력 80, 30, 0에서 $(80-0)/2=40$ MPa. 면내 최대 25 MPa보다 큽니다.` },
      { sec: '7.4', type: 'num', lv: 2, q: R`면내 주응력이 50 MPa와 $-30$ MPa인 점의 절대 최대 전단 응력(MPa)은?`, ans: '40', ansTex: R`40\ \text{MPa}`,
        sol: R`부호가 달라 0이 두 값 사이에 있으므로 $(50-(-30))/2=40$ MPa = 면내 값.` },
      { sec: '7.7', type: 'num', lv: 2, q: R`$\varepsilon_x=400$, $\varepsilon_y=-100$, $\gamma_{xy}=300$ με의 최대 주변형률(με)은?`, ans: '150+sqrt(250^2+150^2)', ansTex: R`441.5\ \mu\varepsilon`,
        sol: R`$150+\sqrt{250^2+150^2}=441.5$ με. 세로축에 $\gamma/2=150$을 씁니다.` },
      { sec: '7.9', type: 'num', lv: 1, q: R`45° 로제트 읽음값 $\varepsilon_a=500$, $\varepsilon_b=300$, $\varepsilon_c=-100$ με에서 $\gamma_{xy}$(με)는?`, ans: '200', ansTex: R`200\ \mu\varepsilon`,
        sol: R`$\gamma_{xy}=2\varepsilon_b-\varepsilon_a-\varepsilon_c=600-500+100=200$ με.` },
      { sec: '7.9', type: 'num', lv: 2, q: R`앞 문제의 강철($E=200$ GPa, $\nu=0.3$) 표면의 $\sigma_y$(MPa)는?`, ans: '200e3/0.91*(-100e-6+0.3*500e-6)', ansTex: R`11.0\ \text{MPa}`,
        sol: R`$\sigma_y=\tfrac{E}{1-\nu^2}(\varepsilon_y+\nu\varepsilon_x)=219780(-100+150)\times10^{-6}=11.0$ MPa.` },
      { sec: '7.1a', type: 'open', lv: 2, proof: true, q: R`평면 응력 요소를 법선이 $x$축과 $\theta$인 면으로 자른 쐐기의 평형에서 $\sigma_{x'}$과 $\tau_{x'y'}$의 변환 공식을 유도하세요.`,
        sol: R`
경사면 넓이 $\Delta A$, 세로면 $\Delta A\cos\theta$, 밑면 $\Delta A\sin\theta$.
세로면(음의 $x$면): $-\sigma_x\Delta A\cos\theta$ ($x$), $-\tau_{xy}\Delta A\cos\theta$ ($y$). 밑면(음의 $y$면): $-\tau_{xy}\Delta A\sin\theta$ ($x$), $-\sigma_y\Delta A\sin\theta$ ($y$).
$x'$ 방향($\cos\theta,\sin\theta$) 평형: $\sigma_{x'}\Delta A=\sigma_x\cos^2\theta+\sigma_y\sin^2\theta+2\tau_{xy}\sin\theta\cos\theta$ (모두 $\Delta A$ 곱).
$y'$ 방향($-\sin\theta,\cos\theta$) 평형: $\tau_{x'y'}=-(\sigma_x-\sigma_y)\sin\theta\cos\theta+\tau_{xy}(\cos^2\theta-\sin^2\theta)$.
배각 공식 $\cos^2\theta=\tfrac{1+\cos2\theta}2$, $\sin^2\theta=\tfrac{1-\cos2\theta}2$, $2\sin\theta\cos\theta=\sin2\theta$로 정리하면 변환 공식.`,
        rubric: R`
- 면의 넓이와 각 면의 힘 — 3점
- $x'$ 방향 평형 — 3점
- $y'$ 방향 평형 — 2점
- 배각 공식으로 정리 — 2점` },
      { sec: '7.2', type: 'open', lv: 2, proof: true, q: R`변환 공식에서 $\theta$를 소거해 모든 면의 $(\sigma_{x'},\tau_{x'y'})$가 원 위에 있음을 보이고, 주응력과 최대 전단 응력을 원에서 읽어 내세요.`,
        sol: R`
$\sigma_{x'}-\sigma_{\text{ave}}=a\cos2\theta+\tau_{xy}\sin2\theta$, $\tau_{x'y'}=-a\sin2\theta+\tau_{xy}\cos2\theta$ ($a=\tfrac{\sigma_x-\sigma_y}2$).
두 식을 제곱해 더하면 교차항이 지워지고 $(\sigma_{x'}-\sigma_{\text{ave}})^2+\tau_{x'y'}^2=a^2+\tau_{xy}^2=R^2$.
중심 $(\sigma_{\text{ave}},0)$, 반지름 $R$의 원. 가로축과의 교점($\tau=0$)이 $\sigma_{\text{ave}}\pm R$ — 주응력. 원 위의 $|\tau|$ 최댓값은 $R$ — 면내 최대 전단 응력, 그 점의 가로 좌표 $\sigma_{\text{ave}}$.`,
        rubric: R`
- 두 식의 정리 — 3점
- 제곱합으로 원의 방정식 — 4점
- 주응력과 최대 전단 읽기 — 3점` },
    ],
  });
})();
