/* 04 각운동량과 중심력 — B&J 12.7–12.13, 수업 필기 3월 18일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 4, part: 'A', title: '각운동량과 중심력 운동', en: 'Angular Momentum & Central Forces', ref: 'B&J 12.7–12.13 · 필기 3/18', plot: 'dyOrbit',
    fig: R`같은 초점을 공유하는 원·타원·포물선 궤도. 이심률이 1에 가까울수록 길쭉해진다`,
    tagline: R`힘이 늘 한 점을 향하면 그 점에 대한 각운동량은 변하지 않습니다. 행성이 가까울 때 빨리 도는 이유가 이 한 줄입니다.`,
    summary: R`질점의 점 $O$에 대한 **각운동량**은 $\mathbf H_O=\mathbf r\times m\mathbf v$이고, 미분하면 $\dot{\mathbf H}_O=\mathbf r\times\sum\mathbf F=\sum\mathbf M_O$(토크)입니다($\dot{\mathbf r}\times m\mathbf v=\mathbf 0$). 평면 운동을 극좌표로 쓰면 $H_O=mr^2\dot\theta$. 힘이 늘 $O$를 향하는 **중심력**이면 토크가 0이라 $r^2\dot\theta$가 일정하고, 이것은 **면적 속도** $\tfrac12r^2\dot\theta$가 일정하다는 케플러 제2법칙입니다. **만유인력** $F=GMm/r^2$에서 원 궤도의 속력은 $v=\sqrt{GM/r}$이고, 지표 근처에서는 $GM=gR^2$로 바꿔 씁니다. 극좌표의 $\sum F_\theta=m(r\ddot\theta+2\dot r\dot\theta)=\tfrac mr\tfrac{d}{dt}(r^2\dot\theta)$가 이 모든 것을 잇는 식입니다.`,
    goals: [
      R`각운동량 $\mathbf H_O=\mathbf r\times m\mathbf v$를 직교·극좌표로 계산할 수 있다`,
      R`$\dot{\mathbf H}_O=\sum\mathbf M_O$를 유도하고 중심력에서 각운동량 보존을 보일 수 있다`,
      R`$r^2\dot\theta$ 일정에서 면적 속도 일정(케플러 제2법칙)을 유도할 수 있다`,
      R`만유인력으로 원 궤도 속력, 주기, 정지 궤도 반지름을 구할 수 있다`,
      R`각운동량 보존으로 근점과 원점의 속력 관계를 구할 수 있다`,
    ],
    secTitles: { '12.7': '각운동량과 토크', '12.9': '중심력과 면적 속도', '12.10': '만유인력과 원 궤도', '12.11': '궤도의 두 점' },
    sections: [
      { k: '12.7', p: 721, src: '수업 필기 · 3월 18일', title: '질점의 각운동량과 그 변화율', body: R`
:::key 각운동량과 토크
$$\mathbf H_O=\mathbf r\times m\mathbf v,\qquad\dot{\mathbf H}_O=\mathbf r\times\sum\mathbf F=\sum\mathbf M_O$$
평면 운동($z=0$, $v_z=0$)이면 $\mathbf H_O=m(xv_y-yv_x)\mathbf k$이고, 극좌표로 $H_O=mr^2\dot\theta$.
:::

미분: $\dot{\mathbf H}_O=\dot{\mathbf r}\times m\mathbf v+\mathbf r\times m\dot{\mathbf v}$. 첫 항은 $\mathbf v\times m\mathbf v=\mathbf 0$(평행한 벡터의 외적), 둘째 항은 $\mathbf r\times\sum\mathbf F$.

극좌표: $\mathbf r=r\mathbf e_r$, $m\mathbf v=m(\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta)$. $\mathbf e_r\times\mathbf e_r=\mathbf 0$, $\lvert\mathbf e_r\times\mathbf e_\theta\rvert=1$이므로 $\lvert\mathbf H_O\rvert=mr^2\dot\theta$ — 필기의 계산 그대로입니다.

:::ex 예제 1
0.5 kg 질점이 $(3,4)$ m에서 속도 $(2,-1)$ m/s로 움직인다. 원점에 대한 각운동량은?
---
$H_z=m(xv_y-yv_x)=0.5(3(-1)-4(2))=-5.5$ kg·m²/s. 음수이므로 시계 방향으로 돕니다.
:::

:::tip 토크와 각가속도
원형 레일 위의 구슬처럼 $r$이 일정하면 $H=mr^2\dot\theta$를 미분해 $\sum M_O=mr^2\ddot\theta$ — 9단원의 $\sum M=I\alpha$($I=\sum m_ir_i^2$)의 원형입니다.
:::
` },
      { k: '12.9', p: 723, src: '수업 필기 · 3월 18일', title: '중심력과 면적 속도', body: R`
**중심력**은 늘 한 점 $O$를 향하거나 그 반대를 향하는 힘입니다. 그러면 $\mathbf r\times\mathbf F=\mathbf 0$이라 토크가 없습니다.

:::key 중심력 운동의 각운동량 보존
$$\mathbf H_O=\text{일정},\qquad r^2\dot\theta=h\ (\text{일정}),\qquad\frac{dA}{dt}=\frac12r^2\dot\theta=\frac h2$$
$h=H_O/m$은 단위 질량당 각운동량이다. 같은 시간에 쓸고 지나가는 넓이가 같다(케플러 제2법칙).
:::

극좌표 운동 방정식으로도 같습니다: $\sum F_\theta=0$이고 $r\ddot\theta+2\dot r\dot\theta=\dfrac1r\dfrac{d}{dt}(r^2\dot\theta)$이므로 $r^2\dot\theta$가 일정.

면적: 작은 시간 $\Delta t$ 동안 반지름이 $\Delta\theta$ 돌면 쓸고 지나간 부채꼴은 $\Delta A\approx\tfrac12r^2\Delta\theta$. 나누고 극한을 취하면 $dA/dt=\tfrac12r^2\dot\theta$.

:::fig dOrbit
:::

:::ex 예제 2 — 줄을 당기는 원운동
매끄러운 탁자의 구멍으로 줄을 넣어 0.3 kg 공을 반지름 0.6 m, 속력 2 m/s로 돌린다. 줄을 당겨 반지름을 0.3 m로 줄이면 속력은?
---
줄의 힘은 구멍을 향하는 중심력이라 $rv_\theta$가 일정: $0.6(2)=0.3v$ → $v=4$ m/s. 운동에너지는 네 배가 되는데, 그 일은 줄을 당긴 손이 했습니다(5단원).
:::
` },
      { k: '12.10', p: 724, src: '수업 필기 · 3월 18일', title: '만유인력과 원 궤도', body: R`
:::key 만유인력
$$F=\frac{GMm}{r^2},\qquad G=6.673\times10^{-11}\ \text{m}^3/(\text{kg}\cdot\text{s}^2)$$
지표($r=R$)에서 $mg=GMm/R^2$이므로 $GM=gR^2$ (지구 $R=6.37\times10^6$ m).
:::

필기처럼 극좌표 운동 방정식에 넣으면 $\sum F_r=-\dfrac{GMm}{r^2}=m(\ddot r-r\dot\theta^2)$, $\sum F_\theta=0$.

:::key 원 궤도
$r$ 일정이면 $\ddot r=0$이고 $\dfrac{GM}{r^2}=r\dot\theta^2=\dfrac{v^2}{r}$에서
$$v=\sqrt{\frac{GM}{r}},\qquad\tau=\frac{2\pi r}{v}=2\pi\sqrt{\frac{r^3}{GM}}$$
(케플러 제3법칙: 주기의 제곱은 반지름의 세제곱에 비례).
:::

:::ex 예제 3 — 정지 궤도
주기가 23.93 h(항성일)인 원 궤도의 반지름은?
---
$GM=gR^2=9.81(6.37\times10^6)^2=3.98\times10^{14}$. $r^3=GM\tau^2/(4\pi^2)$, $\tau=86150$ s → $r=4.22\times10^7$ m, 고도 약 35 800 km.
:::

:::note 스케일 확인 (필기의 차원 해석)
$[G]=\dfrac{[F][L^2]}{[M^2]}=M^{-1}L^3T^{-2}$. $\sqrt{GM/r}$의 차원은 $\sqrt{L^2T^{-2}}=LT^{-1}$로 속도가 맞습니다.
:::
` },
      { k: '12.11', p: 734, title: '궤도의 근점과 원점', body: R`
타원 궤도의 가장 가까운 점(근점)과 가장 먼 점(원점)에서는 속도가 반지름에 수직이라 $\dot r=0$이고 $H=mrv$입니다.

:::key 근점과 원점의 속력
$$r_Av_A=r_Bv_B\qquad(\text{근점 }A,\ \text{원점 }B)$$
에너지 보존(5단원) $\tfrac12v_A^2-\tfrac{GM}{r_A}=\tfrac12v_B^2-\tfrac{GM}{r_B}$과 함께 쓰면 두 점의 속력이 모두 정해진다.
:::

:::ex 예제 4
위성이 고도 500 km 근점에서 궤도에 들어서고, 원점 고도가 2000 km이다. 근점 속력은?
---
$r_A=6.87\times10^6$, $r_B=8.37\times10^6$ m. 두 식에서 $v_B=v_Ar_A/r_B$를 대입:
$\tfrac12v_A^2\big(1-(r_A/r_B)^2\big)=GM\big(\tfrac1{r_A}-\tfrac1{r_B}\big)$ → $v_A^2=\dfrac{2GMr_B}{r_A(r_A+r_B)}$.
$v_A=\sqrt{\dfrac{2(3.98\times10^{14})(8.37\times10^6)}{6.87\times10^6(15.24\times10^6)}}=7.98$ km/s. 원점 속력 $v_B=6.54$ km/s.
:::

:::note 궤도의 모양 (교재 12.11–12.13, 필기에서는 건너뜀)
중심력 $F\propto1/r^2$의 궤적은 원뿔곡선 $1/r=GM/h^2+C\cos\theta$입니다. 이심률 $\varepsilon=Ch^2/GM$가 1보다 작으면 타원, 1이면 포물선(탈출), 크면 쌍곡선. 필기는 2.3절을 건너뛰었으므로 시험 범위 밖으로 봅니다.
:::
` },
    ],
    problems: [
      { sec: '12.7', type: 'num', lv: 1, q: R`0.5 kg 질점이 $(3,4)$ m에서 속도 $(2,-1)$ m/s로 움직인다. 원점에 대한 각운동량 $H_z$(kg·m²/s)는?`, ans: '-5.5', ansTex: R`-5.5`,
        sol: R`$m(xv_y-yv_x)=0.5(-3-8)=-5.5$.` },
      { sec: '12.7', type: 'num', lv: 1, q: R`2 kg 질점이 반지름 1.5 m 원을 $\dot\theta=4$ rad/s로 돈다. 중심에 대한 각운동량 크기는?`, ans: '2*1.5^2*4', ansTex: R`18\ \text{kg}\cdot\text{m}^2/\text{s}`,
        sol: R`$mr^2\dot\theta=2(2.25)(4)=18$.` },
      { sec: '12.7', type: 'mc', lv: 2, q: R`$\dot{\mathbf H}_O=\mathbf r\times\sum\mathbf F$를 유도할 때 $\dot{\mathbf r}\times m\mathbf v$ 항이 사라지는 이유는?`,
        choices: [R`$\mathbf r$이 일정하므로`, R`$\dot{\mathbf r}=\mathbf v$와 $m\mathbf v$가 평행해 외적이 0이므로`, R`힘이 중심력이므로`, R`질량이 일정하므로`], ans: 1,
        sol: R`평행한 벡터의 외적은 0입니다. 이 단계는 어떤 힘에서도 성립합니다.` },
      { sec: '12.9', type: 'num', lv: 1, q: R`매끄러운 탁자 구멍을 통한 줄로 공을 반지름 0.8 m, 속력 3 m/s로 돌리다가 반지름을 0.5 m로 줄였다. 새 속력(m/s)은?`, ans: '4.8', ansTex: R`4.8\ \text{m/s}`,
        sol: R`$rv$ 일정: $0.8(3)=0.5v$, $v=4.8$ m/s.` },
      { sec: '12.9', type: 'num', lv: 2, q: R`중심력 운동에서 $r=2$ m일 때 $\dot\theta=3$ rad/s였다. $r=3$ m일 때 $\dot\theta$(rad/s)는?`, ans: '4/3', ansTex: R`1.33`,
        sol: R`$r^2\dot\theta$ 일정: $4(3)=9\dot\theta$, $\dot\theta=4/3$.` },
      { sec: '12.9', type: 'mc', lv: 2, q: R`케플러 제2법칙(면적 속도 일정)이 성립하기 위한 조건은?`,
        choices: [R`힘이 $1/r^2$에 비례`, R`힘이 늘 한 점을 향하는 중심력`, R`궤도가 타원`, R`에너지 보존`], ans: 1,
        sol: R`중심력이면 어떤 크기 법칙이든 토크가 0이라 $r^2\dot\theta$가 일정합니다. $1/r^2$은 타원 궤도(제1법칙)와 주기 법칙(제3법칙)에 필요합니다.` },
      { sec: '12.10', type: 'num', lv: 1, q: R`지구($GM=3.98\times10^{14}$ m³/s²) 중심에서 $7\times10^6$ m인 원 궤도의 속력(km/s)은?`, ans: 'sqrt(3.98e14/7e6)/1000', ansTex: R`7.54\ \text{km/s}`,
        sol: R`$\sqrt{GM/r}=\sqrt{5.686\times10^7}=7540$ m/s.` },
      { sec: '12.10', type: 'num', lv: 2, q: R`같은 궤도의 주기(분)는?`, ans: '2*pi*sqrt(7e6^3/3.98e14)/60', ansTex: R`97.2\ \text{min}`,
        sol: R`$2\pi\sqrt{r^3/GM}=2\pi\sqrt{3.43\times10^{20}/3.98\times10^{14}}=5833$ s $=97.2$ min.` },
      { sec: '12.10', type: 'num', lv: 2, q: R`지표 중력 $g=9.81$, 지구 반지름 6370 km일 때 $GM$($10^{14}$ m³/s² 단위)은?`, ans: '9.81*6.37^2/100', ansTex: R`3.98`,
        sol: R`$gR^2=9.81(6.37\times10^6)^2=3.98\times10^{14}$.` },
      { sec: '12.11', type: 'num', lv: 2, q: R`근점 반지름 $7\times10^6$ m에서 속력 8 km/s인 위성의 원점 반지름이 $9\times10^6$ m이다. 원점 속력(km/s)은?`, ans: '8*7/9', ansTex: R`6.22\ \text{km/s}`,
        sol: R`$r_Av_A=r_Bv_B$ → $v_B=8(7/9)=6.22$ km/s.` },
      { sec: '12.11', type: 'num', lv: 3, q: R`근점 고도 500 km, 원점 고도 2000 km인 지구 위성의 근점 속력(km/s)은? ($R=6370$ km, $GM=3.98\times10^{14}$)`, ans: 'sqrt(2*3.98e14*8.37e6/(6.87e6*15.24e6))/1000', ansTex: R`7.98\ \text{km/s}`,
        sol: R`$v_A^2=2GMr_B/[r_A(r_A+r_B)]$, $v_A=7.98$ km/s.` },
      { sec: '12.10', type: 'mc', lv: 2, q: R`원 궤도 반지름을 4배로 하면 주기는?`,
        choices: [R`2배`, R`4배`, R`8배`, R`16배`], ans: 2,
        sol: R`$\tau\propto r^{3/2}$이므로 $4^{3/2}=8$배.` },
      { sec: '12.9', type: 'open', lv: 2, proof: true, q: R`중심력 운동에서 $r^2\dot\theta$가 일정함을 (1) 각운동량 방법과 (2) 극좌표 운동 방정식 두 방법으로 보이고, 면적 속도가 일정함을 유도하세요.`,
        sol: R`
(1) $\dot{\mathbf H}_O=\mathbf r\times\mathbf F$, 중심력이면 $\mathbf F\parallel\mathbf r$이라 $\mathbf 0$. $\mathbf H_O$ 일정, 평면 운동에서 크기 $mr^2\dot\theta$ 일정.
(2) $\sum F_\theta=0=m(r\ddot\theta+2\dot r\dot\theta)$. $\dfrac{d}{dt}(r^2\dot\theta)=2r\dot r\dot\theta+r^2\ddot\theta=r(r\ddot\theta+2\dot r\dot\theta)=0$.
면적: $\Delta t$ 동안의 부채꼴 $\Delta A=\tfrac12r^2\Delta\theta+O(\Delta\theta^2)$, $\dfrac{dA}{dt}=\tfrac12r^2\dot\theta$ = 일정.`,
        rubric: R`
- 각운동량 방법 — 3점
- 극좌표 방법(미분 항등식) — 4점
- 면적 속도 — 3점` },
      { sec: '12.10', type: 'open', lv: 2, proof: true, q: R`만유인력만 받는 원 궤도에서 속력 $v=\sqrt{GM/r}$와 주기 $\tau=2\pi\sqrt{r^3/GM}$을 유도하고, 반지름을 늘리면 속력은 줄지만 주기는 늘어남을 설명하세요.`,
        sol: R`
$r$ 일정 → $\dot r=\ddot r=0$. $\sum F_r=-GMm/r^2=m(\ddot r-r\dot\theta^2)=-mr\dot\theta^2$. $v=r\dot\theta$로 $GM/r^2=v^2/r$, $v=\sqrt{GM/r}$.
$\tau=2\pi r/v=2\pi r\sqrt{r/GM}=2\pi\sqrt{r^3/GM}$.
$v\propto r^{-1/2}$은 감소, 둘레 $\propto r$이 속력 감소보다 빨리 늘어 $\tau\propto r^{3/2}$은 증가.`,
        rubric: R`
- 극좌표 식에서 $r$ 일정 — 3점
- 속력 — 3점
- 주기 — 3점
- 해석 — 1점` },
    ],
  });
})();
