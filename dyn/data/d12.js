/* 12 강체의 일과 에너지 — B&J 17.1–17.7, 수업 필기 5월 11일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 12, part: 'C', title: '강체의 일과 에너지', en: 'Rigid Bodies: Work & Energy', ref: 'B&J 17.1–17.7 · 필기 5/11', plot: 'dyRollEnergy',
    fig: R`경사면을 구르는 원판의 에너지 나눔: 위치 에너지가 병진과 회전 운동에너지로 2:1로 나뉜다`,
    tagline: R`강체의 운동에너지는 질량 중심의 병진과 질량 중심에 대한 회전 두 몫입니다. 미끄러지지 않는 마찰은 일을 하지 않으므로, 구르는 문제의 절반은 에너지 보존 한 줄로 끝납니다.`,
    summary: R`질점계의 쾨니히 분해(9단원)를 강체에 쓰면 $T=\tfrac12mv_G^2+\tfrac12I_G\omega^2$이고, 고정점 $O$에 대해 회전하면 평행축 정리로 $T=\tfrac12I_O\omega^2$입니다. 강체에 작용하는 힘의 일은 **질량 중심의 변위에 대한 알짜힘의 일 + 회전각에 대한 알짜 모멘트의 일** $U=\int\sum\mathbf F\cdot d\mathbf r_G+\int\sum M_G\,d\theta$로 나눌 수 있고, 그래서 우력은 알짜힘이 0이어도 $M\,d\theta$의 일을 합니다. 미끄러지지 않고 구르는 바퀴의 마찰력은 작용점(접촉점)의 속도가 0이라 **일을 하지 않습니다** — 병진에서 빼앗는 일과 회전에 주는 일이 정확히 상쇄됩니다. 따라서 $T_1+V_1+U^{\text{nc}}_{1\to2}=T_2+V_2$로 속력을 바로 구하고, 일률은 $P=\mathbf F\cdot\mathbf v+M\omega$입니다.`,
    goals: [
      R`강체의 운동에너지 $\tfrac12mv_G^2+\tfrac12I_G\omega^2$를 유도하고 고정축 회전에서 $\tfrac12I_O\omega^2$와 같음을 보일 수 있다`,
      R`힘과 우력의 일을 계산하고, 우력이 알짜힘 없이도 일을 함을 설명할 수 있다`,
      R`구르는 바퀴의 마찰력이 일을 하지 않음을 두 방법으로 보일 수 있다`,
      R`에너지 보존으로 구르는 물체와 회전하는 막대의 속력·각속도를 구할 수 있다`,
      R`여러 강체가 이어진 계와 일률 문제에 에너지 방법을 적용할 수 있다`,
    ],
    secTitles: { '17.4': '강체의 운동에너지', '17.3': '힘과 우력의 일', '17.3b': '구름 마찰의 일', '17.6': '에너지 보존', '17.7': '일률과 연결된 계' },
    sections: [
      { k: '17.4', p: 1084, src: '수업 필기 · 5월 11일', title: '강체의 운동에너지', body: R`
9단원의 분해 $T=\tfrac12m\bar v^2+\sum\tfrac12m_iv_i'^2$에서, 강체의 상대 운동은 질량 중심에 대한 순수 회전이라 $v_i'=r_i'\omega$입니다. 그러면 둘째 항은 $\tfrac12\big(\sum m_ir_i'^2\big)\omega^2=\tfrac12I_G\omega^2$.

:::key 강체의 운동에너지
$$T=\tfrac12mv_G^2+\tfrac12I_G\omega^2\qquad(\text{병진}+\text{회전})$$
고정점 $O$에 대해 회전하면($v_G=\omega d$)
$$T=\tfrac12m(\omega d)^2+\tfrac12I_G\omega^2=\tfrac12(I_G+md^2)\omega^2=\tfrac12I_O\omega^2.$$
:::

:::ex 예제 1
질량 2 kg, 반지름 0.1 m 원판이 미끄러지지 않고 3 m/s로 구른다. 운동에너지는?
---
$\omega=30$ rad/s. $T=\tfrac12(2)(9)+\tfrac12\cdot\tfrac12(2)(0.01)(900)=9+4.5=13.5$ J. 원판의 운동에너지 중 $\tfrac13$이 회전 몫입니다.
순간 중심(접촉점)에 대한 고정축 회전으로 보면 $I_C=\tfrac32mr^2$, $T=\tfrac12\cdot\tfrac32(2)(0.01)(900)=13.5$ J — 같습니다.
:::
` },
      { k: '17.3', p: 1083, src: '수업 필기 · 5월 11일', title: '힘과 우력이 강체에 하는 일', body: R`
강체의 각 점의 변위는 $d\mathbf r_i=d\mathbf r_G+d\boldsymbol\theta\times\mathbf r_i'$입니다. 모든 힘의 일을 더하면

:::key 강체에 한 일
$$U_{1\to2}=\int_1^2\Big(\sum\mathbf F\Big)\cdot d\mathbf r_G+\int_1^2\Big(\sum M_G\Big)d\theta$$
첫 항은 질량 중심의 병진에 대한 일, 둘째 항은 회전에 대한 일. 일정한 우력 $M$이 각 $\Delta\theta$ 동안 한 일은 $M\Delta\theta$.
:::

$\sum\mathbf F_i\cdot(d\boldsymbol\theta\times\mathbf r_i')=d\boldsymbol\theta\cdot(\mathbf r_i'\times\mathbf F_i)$(삼중곱의 순환)이라 둘째 항이 모멘트가 됩니다.

:::ex 예제 2 — 우력의 일 (필기)
길이 $l$인 막대의 두 끝에 크기 $F$, 방향이 반대인 두 힘(우력)이 막대에 수직으로 작용해 막대가 가운데를 중심으로 $d\theta$ 돌았다. 한 일은?
---
**직접**: 각 끝이 $\tfrac l2d\theta$씩 움직이고 힘과 같은 방향이라 $dU=F\cdot\tfrac l2d\theta\cdot2=Fl\,d\theta$.
**식으로**: 알짜힘 $\mathbf F-\mathbf F=\mathbf 0$이라 첫 항은 0. $\sum M=lF$이므로 둘째 항 $lF\,d\theta$. 같습니다 — 알짜힘이 0이어도 일은 0이 아닙니다.
:::

:::note 일을 하지 않는 힘
- 고정된 핀의 반력(작용점이 움직이지 않음).
- 매끄러운 면의 수직항력(작용점의 속도에 수직).
- 미끄러지지 않고 구르는 물체의 접촉력(작용점의 속도가 0) — 다음 절.
- 강체 안의 내력(두 점 사이 거리가 일정).
:::
` },
      { k: '17.3b', p: 1085, src: '수업 필기 · 5월 11일', title: '구르는 바퀴의 마찰은 일을 하지 않는다', body: R`
경사면을 미끄러지지 않고 구르는 원판의 정지 마찰 $f$가 한 일을 필기처럼 두 방법으로 계산합니다.

:::key 구름 마찰의 일
미끄러지지 않고 구르면 접촉점의 속도가 0이므로 접촉점에 작용하는 마찰력과 수직항력은 일을 하지 않는다:
$$U_f=\int\mathbf f\cdot d\mathbf r_C=\int\mathbf f\cdot\mathbf v_C\,dt=0.$$
:::

**방법 1(작용점).** $d\mathbf r_C=\mathbf v_Cdt=\mathbf 0$. 끝.
**방법 2(병진 + 회전).** 질량 중심의 병진에 대해 마찰은 $-fv_Gdt$, 회전에 대해 마찰의 모멘트 $rf$가 $d\theta=\omega dt$ 동안 $rf\omega\,dt$. 합 $-f(v_G-r\omega)dt=0$ ($v_G=r\omega$).

:::warn 미끄러지면 일을 한다
미끄러지며 구르면 $v_C=v_G-r\omega\ne0$이라 마찰이 음의 일 $-f\int v_C\,dt$을 하고 그만큼 열이 됩니다. 11단원 예제 8의 원판에서는 에너지 보존을 쓸 수 없습니다.
:::
` },
      { k: '17.6', p: 1086, title: '에너지 보존', body: R`
:::key 강체의 에너지 식
$$T_1+V_1+U^{\text{nc}}_{1\to2}=T_2+V_2,\qquad T=\tfrac12mv_G^2+\tfrac12I_G\omega^2,\quad V_g=mgh_G$$
:::

:::ex 예제 3 — 경사면을 굴러 내려온 원판
정지 상태에서 높이 1.5 m를 굴러 내려온 원판의 속력은?
---
$mgh=\tfrac12mv^2+\tfrac12\cdot\tfrac12mr^2(v/r)^2=\tfrac34mv^2$ → $v=\sqrt{4gh/3}=4.43$ m/s. 미끄러지는 블록(마찰 없음)은 $\sqrt{2gh}=5.42$ m/s로 더 빠릅니다 — 원판은 에너지의 $\tfrac13$을 회전에 씁니다. 가속도 $\tfrac23g\sin\theta$(11단원)와 같은 결론입니다.
:::

:::ex 예제 4 — 핀으로 받친 막대가 수직을 지날 때
길이 1.2 m 막대의 한 끝을 핀으로 받치고 수평에서 놓았다. 수직으로 내려왔을 때의 각속도는?
---
$G$가 $L/2$ 내려감: $mg\tfrac L2=\tfrac12\cdot\tfrac13mL^2\omega^2$ → $\omega=\sqrt{3g/L}=4.95$ rad/s. 끝의 속력 $L\omega=5.94$ m/s는 같은 높이($L$)에서 떨어진 질점의 $\sqrt{2gL}=4.85$ m/s보다 빠릅니다.
:::
` },
      { k: '17.7', p: 1087, title: '일률과 연결된 강체', body: R`
:::key 강체에 전달되는 일률
$$P=\sum\mathbf F\cdot\mathbf v_G+\sum M_G\,\omega\qquad(\text{고정축: }P=M\omega)$$
:::

여러 강체가 핀·줄로 이어진 계는 **계 전체**에 에너지 식을 쓰면 내부 연결력(늘지 않는 줄의 장력, 핀 반력)의 일이 서로 상쇄되어 사라집니다.

:::ex 예제 5 — 도르래와 매달린 블록
질량 $M$, 반지름 $r$인 원판 도르래(마찰 없는 축)에 줄을 감고 끝에 질량 $m$ 블록을 매달았다. 정지에서 거리 $h$ 떨어졌을 때 블록의 속력은? ($M=2m$)
---
계(도르래 + 블록 + 줄): $mgh=\tfrac12mv^2+\tfrac12\cdot\tfrac12Mr^2(v/r)^2=\tfrac12(m+\tfrac12M)v^2$.
$M=2m$이면 $mgh=mv^2$, $v=\sqrt{gh}$. $h=2$ m면 4.43 m/s.
:::

:::ex 예제 6 — 모터의 일률
모터가 1500 rpm으로 도는 축에 토크 30 N·m를 준다. 일률은?
---
$\omega=157.1$ rad/s, $P=M\omega=4.71$ kW. 고체역학의 동력축 설계[[@solid:ch06:3.4|동력 $P=T\omega$로 축의 토크를 구해 지름을 정합니다.]]가 이 식에서 출발합니다.
:::
` },
    ],
    problems: [
      { sec: '17.4', type: 'num', lv: 1, q: R`질량 2 kg, 반지름 0.1 m 원판이 미끄러지지 않고 3 m/s로 구른다. 운동에너지(J)는?`, ans: '13.5', ansTex: R`13.5\ \text{J}`,
        sol: R`$\tfrac34mv^2=13.5$ J.` },
      { sec: '17.4', type: 'num', lv: 1, q: R`구르는 속찬 구의 운동에너지 중 회전 몫의 비율은?`, ans: '2/7', ansTex: R`\tfrac27`,
        sol: R`$T=\tfrac12mv^2(1+\tfrac25)$, 회전 몫 $\tfrac{2/5}{7/5}=\tfrac27$.` },
      { sec: '17.4', type: 'mc', lv: 2, q: R`고정점 $O$에 대해 도는 강체의 운동에너지 표현으로 옳은 것은?`,
        choices: [R`$\tfrac12I_G\omega^2$`, R`$\tfrac12I_O\omega^2=\tfrac12mv_G^2+\tfrac12I_G\omega^2$`, R`$\tfrac12mv_G^2$`, R`$\tfrac12I_O\omega^2+\tfrac12mv_G^2$`], ans: 1,
        sol: R`평행축 정리로 두 표현이 같습니다. 넷째는 병진을 두 번 셉니다.` },
      { sec: '17.3', type: 'num', lv: 1, q: R`크기 50 N·m인 일정한 우력이 원판을 3바퀴 돌렸다. 한 일(J)은?`, ans: '50*6*pi', ansTex: R`942.5\ \text{J}`,
        sol: R`$M\Delta\theta=50(6\pi)=942.5$ J.` },
      { sec: '17.3b', type: 'mc', lv: 2, q: R`미끄러지지 않고 경사면을 굴러 내려가는 원판에서 역학적 에너지가 보존되는 이유는?`,
        choices: [R`마찰력이 없으므로`, R`마찰력의 작용점(접촉점)의 속도가 0이라 마찰이 일을 하지 않으므로`, R`마찰력이 수직항력과 상쇄되므로`, R`원판이 강체이므로`], ans: 1,
        sol: R`마찰은 있지만(원판을 돌림) 일을 하지 않습니다. 병진의 일 $-fv$와 회전의 일 $+fr\omega$가 상쇄됩니다.` },
      { sec: '17.6', type: 'num', lv: 1, q: R`정지에서 높이 1.5 m를 굴러 내려온 원판의 속력(m/s)은?`, ans: 'sqrt(4*9.81*1.5/3)', ansTex: R`4.43`,
        sol: R`$\sqrt{4gh/3}=4.43$ m/s.` },
      { sec: '17.6', type: 'num', lv: 2, q: R`정지에서 높이 1.5 m를 굴러 내려온 얇은 고리의 속력(m/s)은?`, ans: 'sqrt(9.81*1.5)', ansTex: R`3.84`,
        sol: R`$mgh=\tfrac12mv^2+\tfrac12mr^2(v/r)^2=mv^2$ → $v=\sqrt{gh}=3.84$ m/s.` },
      { sec: '17.6', type: 'num', lv: 2, q: R`한 끝이 핀인 길이 1.2 m 막대를 수평에서 놓았다. 수직을 지날 때의 각속도(rad/s)는?`, ans: 'sqrt(3*9.81/1.2)', ansTex: R`4.95`,
        sol: R`$\sqrt{3g/L}=4.95$ rad/s.` },
      { sec: '17.6', type: 'num', lv: 3, q: R`같은 막대가 수직을 지날 때 핀의 연직 반력은 막대 무게의 몇 배인가?`, ans: '2.5', ansTex: R`2.5`,
        sol: R`수직 위치에서 $\alpha=0$(모멘트 0), $a_G=\tfrac L2\omega^2=\tfrac L2\cdot\tfrac{3g}{L}=\tfrac32g$(위). $R-mg=\tfrac32mg$ → $R=2.5mg$.` },
      { sec: '17.7', type: 'num', lv: 2, q: R`원판 도르래(질량 $2m$)에 감긴 줄에 매단 블록(질량 $m$)이 정지에서 2 m 떨어졌을 때 속력(m/s)은?`, ans: 'sqrt(9.81*2)', ansTex: R`4.43`,
        sol: R`$mgh=\tfrac12(m+m)v^2$ → $v=\sqrt{gh}=4.43$ m/s.` },
      { sec: '17.7', type: 'num', lv: 1, q: R`토크 30 N·m로 1500 rpm으로 도는 축의 일률(kW)은?`, ans: '30*1500*2*pi/60/1000', ansTex: R`4.71`,
        sol: R`$M\omega=30(157.1)=4712$ W.` },
      { sec: '17.3b', type: 'open', lv: 2, proof: true, q: R`미끄러지지 않고 구르는 원판에서 정지 마찰력이 한 일이 0임을 (1) 작용점의 속도로, (2) 병진과 회전의 일로 나누어 두 방법으로 보이세요.`,
        sol: R`
(1) 일률은 힘 · 작용점의 속도. 접촉점의 속도 $\mathbf v_C=\mathbf v_G+\boldsymbol\omega\times\mathbf r_{C/G}$는 구름 조건에서 0이므로 $P_f=\mathbf f\cdot\mathbf v_C=0$, 일도 0.
(2) 강체의 일 $=\int\sum\mathbf F\cdot d\mathbf r_G+\int\sum M_Gd\theta$ 중 마찰의 몫: 병진 $-fv_Gdt$(운동 반대), 회전 $+rf\,\omega dt$(회전 방향). 합 $-f(v_G-r\omega)dt=0$.`,
        rubric: R`
- 방법 1 — 4점
- 방법 2의 두 항 — 4점
- 구름 조건으로 상쇄 — 2점` },
      { sec: '17.4', type: 'open', lv: 2, proof: true, q: R`강체의 운동에너지가 $\tfrac12mv_G^2+\tfrac12I_G\omega^2$임을 질점계의 분해로 유도하고, 고정점에 대해 도는 경우 $\tfrac12I_O\omega^2$와 같음을 보이세요.`,
        sol: R`
$\mathbf v_i=\mathbf v_G+\mathbf v_i'$. $T=\sum\tfrac12m_iv_i^2=\tfrac12mv_G^2+\mathbf v_G\cdot\sum m_i\mathbf v_i'+\sum\tfrac12m_iv_i'^2$. 가운데 항은 $\sum m_i\mathbf r_i'=\mathbf 0$을 미분해 0.
강체의 상대 운동은 $G$에 대한 회전: $v_i'=\omega r_i'$ → 셋째 항 $\tfrac12\omega^2\sum m_ir_i'^2=\tfrac12I_G\omega^2$.
고정점 $O$($G$에서 $d$): $v_G=\omega d$, $T=\tfrac12(md^2+I_G)\omega^2=\tfrac12I_O\omega^2$(평행축 정리).`,
        rubric: R`
- 속도 분해와 교차항 소멸 — 4점
- 회전 몫 — 3점
- 고정축 경우 — 3점` },
    ],
  });
})();
