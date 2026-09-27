/* 14 일반화된 훅의 법칙과 파손 이론 — B&J 2.5, 2.6, 2.8, 7.5, 강의 슬라이드 Lecture 11 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 14, part: 'C', title: '일반화된 훅의 법칙과 파손 이론', en: 'Generalized Hooke’s Law & Failure Criteria', ref: 'B&J 2.5–2.8, 7.5 · Lecture 11', plot: 'slYield',
    fig: R`주응력 평면의 트레스카 육각형과 폰 미제스 타원`,
    tagline: R`인장 시험은 한 방향으로만 당깁니다. 실제 부재의 한 점은 여러 방향으로 동시에 당겨지는데, 그 점이 언제 항복하는지를 단축 시험값 하나로 판단하는 규칙이 파손 이론입니다.`,
    summary: R`등방성 선형 탄성 재료에서 세 방향 응력의 효과를 중첩하면 **일반화된 훅의 법칙** $\varepsilon_x=\tfrac1E[\sigma_x-\nu(\sigma_y+\sigma_z)]$, $\gamma_{xy}=\tau_{xy}/G$가 됩니다. 부피 변화율은 $e=\tfrac{1-2\nu}{E}(\sigma_x+\sigma_y+\sigma_z)$이고 정수압 $p$에는 **체적 탄성 계수** $k=E/[3(1-2\nu)]$로 $e=-p/k$입니다. 순수 전단을 45° 돌려 본 인장·압축에서 $G=E/[2(1+\nu)]$가 나와 독립 상수는 둘뿐입니다. 연성 재료의 항복은 **트레스카**(최대 전단 응력 $\tau_{\max}=\sigma_Y/2$)나 **폰 미제스**(최대 뒤틀림 에너지 $\sigma_a^2-\sigma_a\sigma_b+\sigma_b^2=\sigma_Y^2$)로, 취성 재료의 파괴는 **최대 수직 응력**이나 **모어 기준**으로 판단합니다. 강의는 평형·기하·재료 법칙이 탄성 문제의 세 기둥임을 먼저 정리합니다.`,
    goals: [
      R`탄성 문제를 이루는 평형 방정식, 변형률-변위 관계, 구성 방정식을 구분할 수 있다`,
      R`일반화된 훅의 법칙으로 다축 응력의 변형률(또는 그 역)을 계산할 수 있다`,
      R`부피 변화율과 체적 탄성 계수를 구하고 $\nu<1/2$의 의미를 설명할 수 있다`,
      R`순수 전단 상태를 이용해 $G=E/2(1+\nu)$를 유도할 수 있다`,
      R`트레스카와 폰 미제스 기준으로 항복 여부와 안전 계수를 판정할 수 있다`,
      R`최대 수직 응력 기준과 모어 기준으로 취성 재료의 파괴를 판정할 수 있다`,
    ],
    secTitles: { '2.5a': '탄성 문제의 세 식', '2.5': '일반화된 훅의 법칙', '2.6': '체적 변화', '2.8': 'E, ν, G의 관계', '7.5a': '연성 재료의 항복', '7.5b': '취성 재료의 파괴' },
    sections: [
      { k: '2.5a', p: 95, src: '강의 슬라이드 · Lecture 11 A', title: '탄성 문제의 세 가지 식', body: R`
강의는 “결과부터 보자”며 탄성체의 한 점에서 성립해야 하는 세 종류의 식을 나란히 놓습니다. 지금까지의 모든 단원이 이 세 식의 특수한 경우였습니다.

:::def 탄성 문제의 세 기둥
- **평형 방정식**(힘): 미소 요소의 힘의 평형. 2차원, 체적력 $f$가 있을 때
$$\frac{\partial\sigma_x}{\partial x}+\frac{\partial\tau_{xy}}{\partial y}+f_x=0,\qquad\frac{\partial\tau_{xy}}{\partial x}+\frac{\partial\sigma_y}{\partial y}+f_y=0$$
- **기하 관계**(변형률-변위): $\varepsilon_x=\partial u/\partial x$, $\gamma_{xy}=\partial u/\partial y+\partial v/\partial x$ (3단원).
- **구성 방정식**(재료): 응력과 변형률의 관계 — 이 단원의 일반화된 훅의 법칙.
:::

3차원에서 미지수는 응력 6, 변형률 6, 변위 3의 15개이고 식도 평형 3, 기하 6, 구성 6의 15개입니다. 봉·축·보의 공식은 이 15개를 가정(평면 단면 등)으로 줄여 손으로 풀 수 있게 만든 것입니다.

:::note 원통 좌표 (강의 Remark)
축대칭 문제(두꺼운 관, 회전 원판)는 $r,\theta,z$ 좌표에서 같은 세 식을 씁니다. 기하 관계가 $\varepsilon_r=\partial u_r/\partial r$, $\varepsilon_\theta=u_r/r$처럼 바뀌는 것이 특징입니다. 원이 반지름 $u_r$만큼 커지면 둘레가 $2\pi u_r$ 늘어 원주 변형률이 $u_r/r$입니다.
:::
` },
      { k: '2.5', p: 95, src: '강의 슬라이드 · Lecture 11 A (Constitutive Equations)', title: '일반화된 훅의 법칙', body: R`
$\sigma_x$ 하나는 $x$로 $\sigma_x/E$만큼 늘리고 $y,z$로 $\nu\sigma_x/E$만큼 줄입니다(4단원). 선형이므로 세 방향 응력의 효과를 더합니다.

:::key 일반화된 훅의 법칙 (등방성)
$$\varepsilon_x=\frac1E\big[\sigma_x-\nu(\sigma_y+\sigma_z)\big],\quad\varepsilon_y=\frac1E\big[\sigma_y-\nu(\sigma_z+\sigma_x)\big],\quad\varepsilon_z=\frac1E\big[\sigma_z-\nu(\sigma_x+\sigma_y)\big]$$
$$\gamma_{xy}=\frac{\tau_{xy}}G,\qquad\gamma_{yz}=\frac{\tau_{yz}}G,\qquad\gamma_{zx}=\frac{\tau_{zx}}G$$
평면 응력($\sigma_z=0$)에서 거꾸로 풀면 $\sigma_x=\dfrac{E}{1-\nu^2}(\varepsilon_x+\nu\varepsilon_y)$, $\sigma_y=\dfrac{E}{1-\nu^2}(\varepsilon_y+\nu\varepsilon_x)$.
:::

등방성 재료에서는 수직 응력이 전단 변형률을, 전단 응력이 수직 변형률을 만들지 않습니다(방향에 대한 대칭).

:::ex 예제 1
강철 블록($E=200$ GPa, $\nu=0.3$)에 $\sigma_x=80$, $\sigma_y=-40$ MPa, $\sigma_z=0$. 세 방향 변형률은?
---
$\varepsilon_x=(80+0.3\times40)/200000=460$ με, $\varepsilon_y=(-40-0.3\times80)/200000=-320$ με, $\varepsilon_z=-0.3(80-40)/200000=-60$ με.
응력이 없는 $z$ 방향도 변형합니다.
:::

:::ex 예제 2 — 옆이 막힌 블록
고무 대신 강체 틀에 꼭 맞게 넣은 블록이 $x$로 $-50$ MPa를 받고 $y,z$로는 늘어날 수 없다($\varepsilon_y=\varepsilon_z=0$). 옆면의 응력은? ($\nu=0.3$)
---
$\varepsilon_y=0$: $\sigma_y-\nu(\sigma_z+\sigma_x)=0$, 대칭으로 $\sigma_y=\sigma_z$이므로 $\sigma_y(1-\nu)=\nu\sigma_x$, $\sigma_y=\tfrac{\nu}{1-\nu}\sigma_x=-21.4$ MPa.
:::
` },
      { k: '2.6', p: 97, title: '체적 변화와 체적 탄성 계수', body: R`
작은 정육면체의 부피는 $(1+\varepsilon_x)(1+\varepsilon_y)(1+\varepsilon_z)$배가 되므로 부피 변화율(팽창률, dilatation)은 1차까지 세 변형률의 합입니다.

:::key 팽창률과 체적 탄성 계수
$$e=\varepsilon_x+\varepsilon_y+\varepsilon_z=\frac{1-2\nu}{E}(\sigma_x+\sigma_y+\sigma_z)$$
정수압 $\sigma_x=\sigma_y=\sigma_z=-p$이면 $e=-p/k$,
$$k=\frac{E}{3(1-2\nu)}.$$
:::

$k>0$(압력을 주면 부피가 줄어야 함)이므로 $\nu<\tfrac12$입니다. $\nu\to\tfrac12$이면 $k\to\infty$ — 비압축성 재료(고무).

:::ex 예제 3
강철($E=200$ GPa, $\nu=0.3$)의 체적 탄성 계수와, 깊은 바다에서 100 MPa의 정수압을 받을 때 부피 변화율은?
---
$k=200/(3\times0.4)=166.7$ GPa, $e=-100/166700=-6.0\times10^{-4}$.
:::
` },
      { k: '2.8', p: 102, src: '강의 슬라이드 · Lecture 11 A (Shear Modulus vs Young’s Modulus)', title: 'E, ν, G의 관계', body: R`
4단원에서 미뤄 둔 관계입니다. 핵심은 **같은 상태를 두 좌표계에서 보는 것**입니다.

:::key 전단 탄성 계수와 E, ν
$$G=\frac{E}{2(1+\nu)}$$
:::

순수 전단 $\tau_{xy}=\tau$는 12단원의 모어 원으로 보면 45° 방향으로 $\sigma_1=\tau$, $\sigma_2=-\tau$입니다.
- 주축에서 훅의 법칙: $\varepsilon_1=\tfrac1E(\tau+\nu\tau)=\tfrac{(1+\nu)\tau}{E}$.
- 원래 축에서: $\varepsilon_x=\varepsilon_y=0$, $\gamma_{xy}=\tau/G$이고, 변형률 변환으로 45° 방향 $\varepsilon_1=\gamma_{xy}/2=\tfrac{\tau}{2G}$.
같은 변형률이므로 $\tfrac{(1+\nu)\tau}{E}=\tfrac\tau{2G}$.

:::tip 확인
강철 $E=200$, $\nu=0.3$ → $G=76.9$ GPa. 알루미늄 $E=70$, $\nu=0.33$ → $G=26.3$ GPa. 문제에서 $E$와 $G$가 모두 주어지면 서로 맞는지 확인해 보세요.
:::
` },
      { k: '7.5a', p: 507, src: '강의 슬라이드 · Lecture 11 B', title: '연성 재료의 항복 기준', body: R`
단축 인장에서는 $\sigma=\sigma_Y$일 때 항복합니다. 강의는 얇은 관을 인장과 비틀림으로 동시에 당긴 실험(Crandall의 그림)을 보여 주며, 다축 상태의 항복점이 하나의 곡선 위에 모인다는 것을 짚습니다. 그 곡선을 예측하는 두 기준입니다. (평면 응력, 면내 주응력 $\sigma_a,\sigma_b$, 세 번째는 0)

:::key 트레스카 기준 (최대 전단 응력)
절대 최대 전단 응력이 단축 항복 때의 값 $\sigma_Y/2$에 이르면 항복한다.
$$\max\big(|\sigma_a|,\ |\sigma_b|,\ |\sigma_a-\sigma_b|\big)=\sigma_Y$$
:::

:::key 폰 미제스 기준 (최대 뒤틀림 에너지)
모양을 바꾸는 데 저장된 변형 에너지가 단축 항복 때의 값에 이르면 항복한다.
$$\sigma_a^2-\sigma_a\sigma_b+\sigma_b^2=\sigma_Y^2,\qquad\sigma_{\text{vm}}=\sqrt{\sigma_x^2-\sigma_x\sigma_y+\sigma_y^2+3\tau_{xy}^2}$$
:::

:::fig sYieldLoci
:::

:::ex 예제 4
$\sigma_Y=250$ MPa인 강재의 한 점이 $\sigma_a=150$, $\sigma_b=60$ MPa이다. 두 기준의 안전 계수는?
---
트레스카: 두 주응력이 같은 부호라 $\max=150$, F.S. $=250/150=1.67$.
폰 미제스: $\sqrt{150^2-150(60)+60^2}=130.8$, F.S. $=250/130.8=1.91$. 트레스카가 조금 더 보수적입니다.
:::

:::ex 예제 5 — 굽힘 + 비틀림 축
11단원 예제 5의 점 $H$($\sigma=31.8$, $\tau=19.1$ MPa)의 등가 응력은?
---
폰 미제스: $\sqrt{\sigma^2+3\tau^2}=45.9$ MPa. 트레스카: $\sqrt{\sigma^2+4\tau^2}=2\tau_{\max}=49.7$ MPa. 축 설계식은 이 두 식에서 나옵니다.
:::
` },
      { k: '7.5b', p: 510, title: '취성 재료의 파괴 기준', body: R`
주철, 콘크리트, 유리처럼 항복 없이 끊어지는 재료는 인장 강도 $\sigma_{UT}$가 압축 강도 $\sigma_{UC}$보다 훨씬 작습니다.

:::key 최대 수직 응력 기준 (랭킨)
$$|\sigma_a|<\sigma_U,\qquad|\sigma_b|<\sigma_U$$
(인장과 압축 강도가 다르면 각각 $\sigma_{UT}$, $\sigma_{UC}$와 비교)
:::

:::key 모어 기준 (쿨롱-모어 직선 근사)
$\sigma_a>0>\sigma_b$인 사분면에서
$$\frac{\sigma_a}{\sigma_{UT}}-\frac{\sigma_b}{\sigma_{UC}}=1$$
이면 파괴한다. 두 주응력이 같은 부호인 사분면은 최대 수직 응력 기준과 같다.
:::

:::ex 예제 6
주철($\sigma_{UT}=150$, $\sigma_{UC}=600$ MPa)의 한 점이 $\sigma_a=100$, $\sigma_b=-200$ MPa이다. 두 기준으로 판정하면?
---
최대 수직 응력: $100<150$, $200<600$이라 안전.
모어: $100/150+200/600=0.667+0.333=1.0$ — 파괴 경계에 있습니다. 부호가 다른 두 주응력이 서로를 거드는 효과를 모어 기준만 잡아냅니다.
:::
` },
    ],
    problems: [
      { sec: '2.5a', type: 'mc', lv: 1, q: R`탄성 문제의 세 기둥이 아닌 것은?`,
        choices: [R`평형 방정식`, R`변형률-변위 관계`, R`구성 방정식(재료 법칙)`, R`에너지 보존에서 나온 속도 방정식`], ans: 3,
        sol: R`정적 탄성 문제는 평형(힘), 기하(변형률-변위), 구성(응력-변형률)의 세 종류 식으로 닫힙니다.` },
      { sec: '2.5', type: 'num', lv: 1, q: R`강철($E=200$ GPa, $\nu=0.3$)에 $\sigma_x=80$, $\sigma_y=-40$, $\sigma_z=0$ MPa. $\varepsilon_x$(με)는?`, ans: '460', ansTex: R`460\ \mu\varepsilon`,
        sol: R`$(80+0.3\times40)/200000=4.6\times10^{-4}$.` },
      { sec: '2.5', type: 'num', lv: 1, q: R`같은 상태의 $\varepsilon_z$(με)는?`, ans: '-60', ansTex: R`-60\ \mu\varepsilon`,
        sol: R`$-\nu(\sigma_x+\sigma_y)/E=-0.3(40)/200000=-60$ με.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`옆이 막힌($\varepsilon_y=\varepsilon_z=0$) 블록이 $x$로 $-50$ MPa를 받는다($\nu=0.3$). 옆면 응력 $\sigma_y$(MPa)는?`, ans: '-50*0.3/0.7', ansTex: R`-21.4\ \text{MPa}`,
        sol: R`$\sigma_y=\tfrac{\nu}{1-\nu}\sigma_x=-21.4$ MPa.` },
      { sec: '2.5', type: 'num', lv: 2, q: R`평면 응력 표면에서 $\varepsilon_x=600$, $\varepsilon_y=200$ με이다($E=70$ GPa, $\nu=0.33$). $\sigma_x$(MPa)는?`, ans: '70e3/(1-0.33^2)*(600e-6+0.33*200e-6)', ansTex: R`52.3\ \text{MPa}`,
        sol: R`$\sigma_x=\tfrac{E}{1-\nu^2}(\varepsilon_x+\nu\varepsilon_y)=\tfrac{70000}{0.8911}(666\times10^{-6})=52.3$ MPa.` },
      { sec: '2.6', type: 'num', lv: 1, q: R`$E=200$ GPa, $\nu=0.3$인 강철의 체적 탄성 계수(GPa)는?`, ans: '200/1.2', ansTex: R`166.7\ \text{GPa}`,
        sol: R`$k=E/[3(1-2\nu)]=200/1.2=166.7$ GPa.` },
      { sec: '2.6', type: 'num', lv: 2, q: R`같은 강철 구가 100 MPa의 정수압을 받는다. 부피 변화율은?`, ans: '-100/166666.67', ansTex: R`-6.0\times10^{-4}`,
        sol: R`$e=-p/k=-100/166667=-6.0\times10^{-4}$.` },
      { sec: '2.6', type: 'mc', lv: 2, q: R`등방성 재료의 포아송 비가 1/2을 넘을 수 없는 이유는?`,
        choices: [R`인장 시험에서 넥킹이 생기므로`, R`체적 탄성 계수 $E/3(1-2\nu)$가 양수여야(압력에 부피가 줄어야) 하므로`, R`$G$가 음수가 되므로`, R`변형률이 너무 커지므로`], ans: 1,
        sol: R`$\nu>1/2$이면 $k<0$ — 누르면 부피가 커지는 불안정한 재료입니다. $\nu=1/2$은 비압축성의 극한입니다.` },
      { sec: '2.8', type: 'num', lv: 1, q: R`알루미늄($E=70$ GPa, $\nu=0.33$)의 $G$(GPa)는?`, ans: '70/2.66', ansTex: R`26.3\ \text{GPa}`,
        sol: R`$G=E/2(1+\nu)=70/2.66=26.3$ GPa.` },
      { sec: '7.5a', type: 'num', lv: 1, q: R`$\sigma_Y=250$ MPa인 강재의 점이 $\sigma_a=150$, $\sigma_b=60$ MPa. 폰 미제스 등가 응력(MPa)은?`, ans: 'sqrt(150^2-150*60+60^2)', ansTex: R`130.8\ \text{MPa}`,
        sol: R`$\sqrt{22500-9000+3600}=130.8$ MPa. F.S. 1.91.` },
      { sec: '7.5a', type: 'num', lv: 2, q: R`$\sigma_a=200$, $\sigma_b=-100$ MPa인 점을 $\sigma_Y=250$ MPa 강재에서 트레스카로 판정한 안전 계수는?`, ans: '250/300', ansTex: R`0.83\ (\text{항복})`,
        sol: R`부호가 달라 $|\sigma_a-\sigma_b|=300>250$. F.S. $=0.83<1$로 항복합니다. 폰 미제스는 $264.6$ MPa로 역시 항복.` },
      { sec: '7.5a', type: 'mc', lv: 2, q: R`두 기준의 차이가 가장 큰 응력 상태는?`,
        choices: [R`단축 인장`, R`등이축 인장 $\sigma_a=\sigma_b$`, R`순수 전단 $\sigma_b=-\sigma_a$`, R`정수압`], ans: 2,
        sol: R`순수 전단에서 트레스카는 $\tau_Y=\sigma_Y/2$, 폰 미제스는 $\sigma_Y/\sqrt3=0.577\sigma_Y$로 15% 차이가 납니다.` },
      { sec: '7.5a', type: 'num', lv: 2, q: R`굽힘 응력 31.8 MPa와 비틀림 전단 응력 19.1 MPa가 겹친 축 표면의 폰 미제스 등가 응력(MPa)은?`, ans: 'sqrt(31.831^2+3*19.0986^2)', ansTex: R`45.9\ \text{MPa}`,
        sol: R`$\sqrt{\sigma^2+3\tau^2}=45.9$ MPa.` },
      { sec: '7.5b', type: 'num', lv: 2, q: R`주철($\sigma_{UT}=150$, $\sigma_{UC}=600$ MPa)의 점이 $\sigma_a=90$, $\sigma_b=-120$ MPa이다. 모어 기준의 좌변 $\sigma_a/\sigma_{UT}-\sigma_b/\sigma_{UC}$는?`, ans: '90/150+120/600', ansTex: R`0.8`,
        sol: R`$0.6+0.2=0.8<1$이므로 안전(모든 응력을 1.25배로 키우면 파괴).` },
      { sec: '2.8', type: 'open', lv: 2, proof: true, q: R`순수 전단 상태를 주축에서 본 인장·압축과 비교해 $G=E/[2(1+\nu)]$를 유도하세요.`,
        sol: R`
순수 전단 $\tau_{xy}=\tau$: 모어 원의 중심이 원점, 반지름 $\tau$ → 45° 방향 주응력 $\sigma_1=\tau$, $\sigma_2=-\tau$.
주축에서 훅의 법칙: $\varepsilon_1=\tfrac1E(\sigma_1-\nu\sigma_2)=\tfrac{(1+\nu)\tau}E$.
원래 축에서: $\varepsilon_x=\varepsilon_y=0$, $\gamma_{xy}=\tau/G$. 변형률 변환(12단원)으로 45° 방향 $\varepsilon_{45°}=\tfrac{\varepsilon_x+\varepsilon_y}2+\tfrac{\gamma_{xy}}2=\tfrac\tau{2G}$.
같은 방향의 같은 변형률이므로 $\tfrac{(1+\nu)}E=\tfrac1{2G}$, $G=\tfrac{E}{2(1+\nu)}$.`,
        rubric: R`
- 순수 전단의 주응력 — 3점
- 주축의 훅 법칙 — 3점
- 변형률 변환으로 같은 변형률 — 3점
- 결론 — 1점` },
    ],
  });
})();
