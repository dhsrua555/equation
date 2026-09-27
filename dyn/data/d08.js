/* 08 라그랑주 역학 — Lagrangian Dynamics 자료 6.2, 수업 필기 4월 1일·6일, TA 세션 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 8, part: 'B', title: '라그랑주 역학: 일반화 좌표로 운동 방정식 세우기', en: 'Lagrangian Dynamics', ref: 'Lagrangian 자료 6.2 · 필기 4/1, 4/6', plot: 'dyPendulum',
    fig: R`진자의 상평면. 닫힌 곡선은 흔들림, 바깥 곡선은 한 바퀴씩 도는 운동`,
    tagline: R`자유물체도 없이, 스칼라 두 개(운동에너지와 퍼텐셜 에너지)만으로 운동 방정식이 나옵니다. 구속력은 처음부터 식에 나타나지 않습니다.`,
    summary: R`계의 형상을 **완전히** 정하는 **서로 독립인** 좌표의 최소 개수가 **자유도**이고, 그런 좌표 $q$를 **일반화 좌표**라 합니다. 라그랑지안 $L(q,\dot q)=T-V$를 만들면 운동은 전체 라그랑지안의 적분을 극값으로 만드는 경로이고(해밀턴의 원리), 7단원의 결과에 따라 **오일러-라그랑주 방정식** $\frac{d}{dt}\frac{\partial L}{\partial\dot q_i}-\frac{\partial L}{\partial q_i}=Q_i$가 운동 방정식입니다. 보존력은 $V$에 들어가고, 마찰·입력 토크 같은 나머지 힘은 **일반화 힘** $Q_i$(좌표가 각이면 토크)로 오른쪽에 둡니다. 스프링-질량에서는 $m\ddot x=-kx$, 진자에서는 $ml^2\ddot\theta+mgl\sin\theta=0$ — 뉴턴 법칙과 같은 결과를 더 적은 계산으로 얻습니다. $L$에 나타나지 않는 좌표(**순환 좌표**)의 운동량 $\partial L/\partial\dot q$는 보존됩니다.`,
    goals: [
      R`자유도를 세고 형상을 완전히 정하는 독립 일반화 좌표를 고를 수 있다`,
      R`일반화 좌표로 $T$와 $V$를 쓰고 라그랑지안을 만들 수 있다`,
      R`오일러-라그랑주 방정식으로 한 자유도·두 자유도 계의 운동 방정식을 유도할 수 있다`,
      R`비보존력을 일반화 힘으로 넣을 수 있다`,
      R`순환 좌표의 보존량과 평형점을 찾을 수 있다`,
    ],
    secTitles: { '6.2a': '일반화 좌표와 자유도', '6.2b': '라그랑주 방정식', '6.2c': '일반화 힘', '6.2d': '회전 고리의 구슬', '6.2e': '수레와 진자', '6.2f': '순환 좌표' },
    sections: [
      { k: '6.2a', src: '수업 필기 · 4월 6일', title: '일반화 좌표와 자유도', body: R`
:::def 일반화 좌표 (필기)
계의 형상을 (1) **완전히 정하는** (2) **서로 독립인** 좌표의 집합 $q=(q_1,\dots,q_n)$. 이런 좌표의 최소 개수 $n$이 **자유도**다.
:::

**독립.** $x_2=f(x_1)$처럼 한 좌표가 다른 좌표로 정해지면 독립이 아닙니다. 필기의 주의: $x_2=x_1^2$은 $x_1$로 정해지므로 독립이 아니지만, 함수로서 $\alpha_1x_1+\alpha_2x_1^2=0$($\forall x_1$)이면 $\alpha_1=\alpha_2=0$이라 **일차독립**입니다. 일반화 좌표에 필요한 것은 일차독립이 아니라 “서로 정해지지 않음”입니다.

**완전히 정함.** 진자 추의 위치 $(x,y)$는 형상을 정하지만 구속 $x^2+y^2=L^2$ 때문에 독립이 아닙니다. 각 $\theta$ 하나면 $x=L\sin\theta$, $y=-L\cos\theta$로 모두 정해지므로 자유도 1, 일반화 좌표 $q=\theta$.

:::ex 예제 1 — 자유도 세기
(a) 경사면을 따라 미끄러지는 블록 (b) 평면 위를 도는 이중 진자 (c) 수레(레일 위)에 매단 진자
---
(a) 경사면을 따라 잰 거리 $s$ 하나: 1. (b) 두 막대의 각 $\theta_1,\theta_2$: 2. (c) 수레 위치 $x$와 진자 각 $\theta$: 2.
:::
` },
      { k: '6.2b', src: '수업 필기 · 4월 1일 · Lagrangian 자료 6.2', title: '라그랑지안과 오일러-라그랑주 방정식', body: R`
:::key 라그랑주 방정식 (보존력만 있을 때)
$$L(q,\dot q)=T(q,\dot q)-V(q),\qquad\frac{d}{dt}\frac{\partial L}{\partial\dot q_i}-\frac{\partial L}{\partial q_i}=0\quad(i=1,\dots,n)$$
:::

TA 세션의 요약: $\frac{d}{dt}\frac{\partial L}{\partial\dot q}$은 “일반화 운동량의 변화율”, $\frac{\partial L}{\partial q}$는 “일반화 힘(보존력 부분)”이라, 라그랑주 방정식은 일반화 좌표로 쓴 $F=ma$입니다.

:::ex 예제 2 — 스프링-질량 (필기)
$L=\tfrac12m\dot x^2-\tfrac12kx^2$. $\frac{d}{dt}(m\dot x)-(-kx)=0$ → $m\ddot x=-kx$. 뉴턴 법칙 $\sum F=-kx=m\ddot x$와 같습니다.
:::

:::ex 예제 3 — 진자 (필기)
길이 $l$, 질량 $m$, 수직에서 잰 각 $\theta$. $T=\tfrac12m(l\dot\theta)^2$, $V=-mgl\cos\theta$(매단 점 기준).
$L=\tfrac12ml^2\dot\theta^2+mgl\cos\theta$. $\frac{d}{dt}(ml^2\dot\theta)+mgl\sin\theta=0$ → $ml^2\ddot\theta+mgl\sin\theta=0$.
장력은 일을 하지 않는 구속력이라 식에 나타나지 않습니다. 작은 각이면 $\ddot\theta+(g/l)\theta=0$, 주기 $2\pi\sqrt{l/g}$[[@em:ch02:2.4|질량-스프링계의 자유진동. 같은 꼴의 방정식입니다.]].
:::

:::tip 순서
1. 자유도와 일반화 좌표. 2. 각 질점(또는 강체)의 속도를 $q,\dot q$로 → $T$. 3. $V$(중력, 스프링). 4. $L=T-V$. 5. 좌표마다 E-L.
:::
` },
      { k: '6.2c', src: '수업 필기 · 4월 6일 · TA 세션', title: '비보존력과 일반화 힘', body: R`
마찰이나 모터 토크처럼 퍼텐셜이 없는 힘은 $L$에 넣을 수 없습니다. 필기는 방정식을 확장합니다.

:::key 확장된 라그랑주 방정식
$$\frac{d}{dt}\frac{\partial L}{\partial\dot q_i}-\frac{\partial L}{\partial q_i}=Q_i,\qquad Q_i=\sum_k\mathbf F_k\cdot\frac{\partial\mathbf r_k}{\partial q_i}$$
$\mathbf F_k$는 $V$에 넣지 않은 힘, $\mathbf r_k$는 그 작용점. $Q^T\dot q$는 그 힘들의 일률이다.
:::

:::warn 일반화 힘은 “$q$ 방향의 힘”과 같지 않다 (필기 보충)
필기는 $Q_i$를 “$q_i$ 방향 비보존력의 합”이라 적었습니다. $q_i$가 **길이**이고 힘이 그 방향이면 맞지만, $q_i$가 **각**이면 $Q_i$는 토크입니다: 진자 추에 접선 힘 $F$가 걸리면 $\mathbf r=l(\sin\theta,-\cos\theta)$, $\partial\mathbf r/\partial\theta=l(\cos\theta,\sin\theta)$라 $Q_\theta=Fl$. 단위가 N·m이어야 $Q_\theta\dot\theta$가 일률이 됩니다.
:::

:::ex 예제 4 — 거친 경사면 (필기)
경사각 $\theta$의 면을 따라 내려가는 거리 $x$를 좌표로, 운동 마찰력 크기 $f$.
---
$T=\tfrac12m\dot x^2$, $V=-mgx\sin\theta$ → $L=\tfrac12m\dot x^2+mgx\sin\theta$.
왼쪽 $=m\ddot x-mg\sin\theta$, 오른쪽 $Q_x=-f$(운동 반대). $m\ddot x=mg\sin\theta-f$.
:::
` },
      { k: '6.2d', title: '예제: 회전하는 고리 위의 구슬', body: R`
:::fig dHoop
:::

:::ex 예제 5
반지름 $r$인 원형 고리가 연직 지름을 축으로 일정한 각속도 $\omega$로 돈다. 고리를 따라 마찰 없이 움직이는 구슬(질량 $m$)의 운동 방정식과 평형 위치는? $\theta$는 가장 낮은 점에서 잰 각이다.
---
속도: 고리를 따라 $r\dot\theta$, 고리와 함께 도는 원(반지름 $r\sin\theta$)을 따라 $r\omega\sin\theta$ — 서로 수직.
$T=\tfrac12m(r^2\dot\theta^2+r^2\omega^2\sin^2\theta)$, $V=-mgr\cos\theta$.
E-L: $mr^2\ddot\theta-mr^2\omega^2\sin\theta\cos\theta+mgr\sin\theta=0$ →
$$\ddot\theta=\Big(\omega^2\cos\theta-\frac gr\Big)\sin\theta.$$
평형($\ddot\theta=0$, $\dot\theta=0$): $\theta=0$ 또는 $\cos\theta=g/(r\omega^2)$(단 $\omega^2>g/r$).
$r=0.2$ m, $\omega=10$ rad/s면 $\cos\theta=0.4905$, $\theta=60.6°$. 고리를 빨리 돌리면 구슬이 옆으로 올라가 머뭅니다.
:::

:::warn 이 계에서는 $T+V$가 보존되지 않는다
고리를 일정한 $\omega$로 돌리는 모터가 계에 일을 합니다. 대신 $L$이 $t$를 직접 포함하지 않아 $h=\dot\theta\,\partial L/\partial\dot\theta-L=\tfrac12mr^2\dot\theta^2-\tfrac12mr^2\omega^2\sin^2\theta-mgr\cos\theta$가 보존됩니다(야코비 적분). $T$가 $\dot q$의 이차 동차식일 때만 $h=T+V$입니다.
:::
` },
      { k: '6.2e', title: '예제: 두 자유도 — 스프링 수레와 진자', body: R`
:::fig dCartPend
:::

:::ex 예제 6
질량 $M$의 수레가 강성 $k$인 스프링으로 벽에 이어져 매끄러운 레일 위를 움직이고, 수레에 길이 $l$의 진자(추 $m$)가 매달려 있다. 운동 방정식은?
---
추의 위치 $(x+l\sin\theta,\ -l\cos\theta)$, 속도 $(\dot x+l\dot\theta\cos\theta,\ l\dot\theta\sin\theta)$.
$T=\tfrac12M\dot x^2+\tfrac12m\big(\dot x^2+2l\dot x\dot\theta\cos\theta+l^2\dot\theta^2\big)$, $V=\tfrac12kx^2-mgl\cos\theta$.
$x$: $\frac{d}{dt}\big[(M+m)\dot x+ml\dot\theta\cos\theta\big]+kx=0$ →
$$(M+m)\ddot x+ml(\ddot\theta\cos\theta-\dot\theta^2\sin\theta)+kx=0$$
$\theta$: $\frac{d}{dt}\big[ml\dot x\cos\theta+ml^2\dot\theta\big]-\big(-ml\dot x\dot\theta\sin\theta-mgl\sin\theta\big)=0$ →
$$l\ddot\theta+\ddot x\cos\theta+g\sin\theta=0$$
($ml\dot x\dot\theta\sin\theta$ 항이 양쪽에서 지워짐). $k=0$이면 수평 운동량 $(M+m)\dot x+ml\dot\theta\cos\theta$가 보존됩니다.
:::
` },
      { k: '6.2f', title: '순환 좌표와 보존량', body: R`
:::key 순환 좌표
$L$이 어떤 좌표 $q_j$를 포함하지 않으면($\partial L/\partial q_j=0$) 그 좌표에 대한 **일반화 운동량**
$$p_j=\frac{\partial L}{\partial\dot q_j}$$
이 보존된다($Q_j=0$일 때).
:::

:::ex 예제 7 — 스프링에 매인 퍽
매끄러운 수평면에서 퍽(질량 $m$)이 원점에 고정된 스프링(강성 $k$, 자연 길이 $r_0$)에 매여 있다. 극좌표로 운동 방정식과 보존량은?
---
$L=\tfrac12m(\dot r^2+r^2\dot\theta^2)-\tfrac12k(r-r_0)^2$. $\theta$는 순환 좌표: $p_\theta=mr^2\dot\theta$ 일정 — 4단원의 중심력 각운동량 보존.
$r$: $m\ddot r-mr\dot\theta^2+k(r-r_0)=0$.
:::

:::note 뉴턴 법칙과 무엇이 다른가
뉴턴 방법은 힘(벡터)과 구속력을 모두 다루고 좌표계의 가속도(2단원)를 따로 계산해야 합니다. 라그랑주 방법은 속도만 알면 되고 구속력이 사라지지만, 구속력 자체(예: 진자의 장력)가 필요하면 다시 뉴턴 방법으로 구해야 합니다. 여러 물체가 이어진 계, 회전하는 좌표가 섞인 계에서 특히 편합니다(로봇팔의 동역학[[@robot:ch13:8.1|로봇팔의 라그랑주 동역학. 관절각이 일반화 좌표입니다.]]).
:::
` },
    ],
    problems: [
      { sec: '6.2a', type: 'num', lv: 1, q: R`평면에서 움직이는 이중 진자(막대 두 개)의 자유도는?`, ans: '2', ansTex: R`2`,
        sol: R`두 추의 좌표 넷에 길이 구속 둘: $4-2=2$. 일반화 좌표 $\theta_1,\theta_2$.` },
      { sec: '6.2a', type: 'mc', lv: 2, q: R`진자 추의 좌표 $(x,y)$를 일반화 좌표로 쓸 수 없는 이유는?`,
        choices: [R`형상을 정하지 못해서`, R`구속 $x^2+y^2=L^2$ 때문에 서로 독립이 아니라서`, R`일차종속이라서`, R`각이 아니라서`], ans: 1,
        sol: R`형상은 정하지만 하나가 다른 하나로 정해집니다. 독립인 좌표는 하나($\theta$)뿐입니다.` },
      { sec: '6.2b', type: 'mc', lv: 1, q: R`$L=\tfrac12m\dot x^2-\tfrac12kx^2$의 운동 방정식은?`,
        choices: [R`$m\ddot x=kx$`, R`$m\ddot x=-kx$`, R`$m\dot x=-kx$`, R`$m\ddot x=-\tfrac12kx^2$`], ans: 1,
        sol: R`$\frac{d}{dt}(m\dot x)-(-kx)=0$.` },
      { sec: '6.2b', type: 'num', lv: 1, q: R`길이 0.8 m 진자의 작은 진동 주기(s)는? ($g=9.81$)`, ans: '2*pi*sqrt(0.8/9.81)', ansTex: R`1.79\ \text{s}`,
        sol: R`$ml^2\ddot\theta+mgl\theta=0$ → $\omega_n=\sqrt{g/l}$, $\tau=2\pi\sqrt{0.8/9.81}=1.79$ s.` },
      { sec: '6.2b', type: 'num', lv: 2, q: R`길이 $l$, 질량 $m$인 균일한 막대가 한 끝을 축으로 연직면에서 흔들린다($I_O=\tfrac13ml^2$). 작은 진동의 각진동수를 $l=0.9$ m에서 구하면(rad/s)?`, ans: 'sqrt(1.5*9.81/0.9)', ansTex: R`4.04`,
        sol: R`$L=\tfrac16ml^2\dot\theta^2+mg\tfrac l2\cos\theta$ → $\tfrac13ml^2\ddot\theta+\tfrac12mgl\sin\theta=0$, $\omega_n=\sqrt{3g/2l}=4.04$ rad/s.` },
      { sec: '6.2c', type: 'num', lv: 2, q: R`질량 2 kg, 길이 0.5 m 진자 추에 늘 접선 방향으로 3 N의 힘이 걸린다. 일반화 좌표 $\theta$에 대한 일반화 힘(N·m)은?`, ans: '1.5', ansTex: R`1.5\ \text{N}\cdot\text{m}`,
        sol: R`$Q_\theta=\mathbf F\cdot\partial\mathbf r/\partial\theta=F\,l=1.5$ N·m — 토크입니다.` },
      { sec: '6.2c', type: 'mc', lv: 2, q: R`라그랑주 방정식에서 운동 마찰력은 어떻게 넣는가?`,
        choices: [R`퍼텐셜 에너지 $V$에 $\mu Nx$로 넣는다`, R`일반화 힘 $Q$로 방정식의 오른쪽에 넣는다`, R`무시한다`, R`$T$에서 뺀다`], ans: 1,
        sol: R`마찰은 퍼텐셜이 없는 비보존력입니다(일이 경로에 의존).` },
      { sec: '6.2d', type: 'num', lv: 2, q: R`반지름 0.2 m 고리가 10 rad/s로 돈다. 구슬의 옆쪽 평형 각(가장 낮은 점에서, 도)은?`, ans: 'acos(9.81/20)*180/pi', ansTex: R`60.6°`,
        sol: R`$\cos\theta=g/(r\omega^2)=9.81/20$, $\theta=60.6°$.` },
      { sec: '6.2d', type: 'num', lv: 2, q: R`반지름 0.25 m 고리 위 구슬이 가장 낮은 점을 벗어나 옆으로 올라가려면 고리의 각속도가 최소 몇 rad/s를 넘어야 하는가?`, ans: 'sqrt(9.81/0.25)', ansTex: R`6.26`,
        sol: R`옆쪽 평형 $\cos\theta=g/(r\omega^2)<1$이려면 $\omega>\sqrt{g/r}=6.26$ rad/s.` },
      { sec: '6.2e', type: 'mc', lv: 2, q: R`예제 6에서 $k=0$(스프링 없음)이면 보존되는 양은?`,
        choices: [R`$(M+m)\dot x$`, R`$(M+m)\dot x+ml\dot\theta\cos\theta$`, R`$ml^2\dot\theta$`, R`$\dot\theta$`], ans: 1,
        sol: R`$x$가 순환 좌표가 되어 $\partial L/\partial\dot x=(M+m)\dot x+ml\dot\theta\cos\theta$(계의 수평 운동량)가 보존됩니다.` },
      { sec: '6.2f', type: 'num', lv: 2, q: R`예제 7의 퍽이 $r=0.5$ m에서 $\dot\theta=4$ rad/s로 돌고 있다. $r=0.8$ m가 되었을 때 $\dot\theta$(rad/s)는?`, ans: '4*0.25/0.64', ansTex: R`1.5625`,
        sol: R`$r^2\dot\theta$ 일정: $0.25(4)=0.64\dot\theta$, $\dot\theta=1.5625$.` },
      { sec: '6.2f', type: 'num', lv: 3, q: R`예제 7에서 $m=1$ kg, $k=100$ N/m, $r_0=0.4$ m. 퍽이 반지름 0.5 m 원운동을 하려면 $\dot\theta$(rad/s)는?`, ans: 'sqrt(100*0.1/0.5)', ansTex: R`4.47`,
        sol: R`$\ddot r=0$: $mr\dot\theta^2=k(r-r_0)$ → $\dot\theta^2=100(0.1)/0.5=20$, $\dot\theta=4.47$ rad/s.` },
      { sec: '6.2d', type: 'open', lv: 2, proof: true, q: R`예제 5(회전 고리의 구슬)의 라그랑지안을 세우고 운동 방정식 $\ddot\theta=(\omega^2\cos\theta-g/r)\sin\theta$를 유도하세요. 옆쪽 평형이 존재할 조건도 밝히세요.`,
        sol: R`
구슬의 위치(고리와 함께 도는 좌표): 축에서의 거리 $r\sin\theta$, 높이 $-r\cos\theta$.
속도의 두 성분: 고리를 따라 $r\dot\theta$, 축을 도는 원을 따라 $\omega r\sin\theta$ — 수직이므로 $v^2=r^2\dot\theta^2+r^2\omega^2\sin^2\theta$.
$L=\tfrac12mr^2(\dot\theta^2+\omega^2\sin^2\theta)+mgr\cos\theta$.
$\partial L/\partial\dot\theta=mr^2\dot\theta$, $\partial L/\partial\theta=mr^2\omega^2\sin\theta\cos\theta-mgr\sin\theta$.
E-L: $mr^2\ddot\theta-mr^2\omega^2\sin\theta\cos\theta+mgr\sin\theta=0$ → 결론.
평형: $\sin\theta=0$ 또는 $\cos\theta=g/(r\omega^2)$ — 후자는 $r\omega^2>g$일 때만 존재.`,
        rubric: R`
- 속도 두 성분 — 3점
- 라그랑지안 — 2점
- 편미분과 E-L — 3점
- 평형 조건 — 2점` },
      { sec: '6.2e', type: 'open', lv: 3, proof: true, q: R`예제 6(스프링 수레와 진자)의 $\theta$ 방정식 $l\ddot\theta+\ddot x\cos\theta+g\sin\theta=0$을 유도하고, 같은 식을 뉴턴 법칙(수레와 함께 가속하는 기준틀의 관성력)으로도 확인하세요.`,
        sol: R`
**라그랑주.** $\partial L/\partial\dot\theta=ml\dot x\cos\theta+ml^2\dot\theta$. 시간 미분: $ml\ddot x\cos\theta-ml\dot x\dot\theta\sin\theta+ml^2\ddot\theta$. $\partial L/\partial\theta=-ml\dot x\dot\theta\sin\theta-mgl\sin\theta$. 빼면 $ml\ddot x\cos\theta+ml^2\ddot\theta+mgl\sin\theta=0$, $ml$로 나눠 결론.
**뉴턴.** 수레($\ddot x$로 가속)와 함께 움직이는 틀에서 추에는 관성력 $-m\ddot x\,\mathbf i$가 더해진다. 매단 점에 대한 모멘트(접선 방향): 중력의 접선 성분 $-mg\sin\theta$, 관성력의 접선 성분 $-m\ddot x\cos\theta$. 그 틀에서 추는 반지름 $l$ 원운동이므로 $ml\ddot\theta=-mg\sin\theta-m\ddot x\cos\theta$. 같은 식.`,
        rubric: R`
- 라그랑주 유도(교차항 소거 확인) — 5점
- 관성력을 쓴 뉴턴 확인 — 5점` },
    ],
  });
})();
