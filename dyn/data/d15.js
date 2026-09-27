/* 15 3차원 강체의 운동 방정식 — B&J 18.5–18.10, 수업 필기 6월 1일·8일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 15, part: 'C', title: '3차원 강체의 운동 방정식', en: 'Rigid Bodies in Three Dimensions', ref: 'B&J 18.5–18.10 · 필기 6/1, 6/8', plot: 'dyPrecession',
    fig: R`세차하는 팽이의 축 끝이 그리는 원. 자전이 빠를수록 세차는 느리다`,
    tagline: R`3차원에서 ΣM = Ḣ는 그대로지만, 고정된 틀에서는 관성 행렬이 시간에 따라 변합니다. 물체와 함께 도는 틀로 옮기면 관성 행렬은 상수가 되고, 대신 Ω × H라는 한 항이 붙습니다.`,
    summary: R`3차원 강체의 운동 방정식은 $\sum\mathbf F=m\mathbf a_G$와 $\sum\mathbf M_G=\dot{\mathbf H}_G$(또는 고정점 $O$에 대해 $\sum\mathbf M_O=\dot{\mathbf H}_O$)이고, $\dot{\mathbf H}$는 관성틀에서 잰 변화율입니다. 고정 틀에서는 $I(t)$가 물체의 회전에 따라 계속 변해 계산이 번거로우므로, 수업은 **물체와 함께 도는 틀**(각속도 $\boldsymbol\Omega$)을 씁니다: $\dot{\mathbf H}=(\dot{\mathbf H})_{oxyz}+\boldsymbol\Omega\times\mathbf H$(10단원의 규칙). 그 틀의 축이 주축이고 $\boldsymbol\Omega=\boldsymbol\omega$이면 **오일러 방정식** $\sum M_x=I_x\dot\omega_x-(I_y-I_z)\omega_y\omega_z$ 등이 됩니다. 각속도가 일정해도 $\mathbf H$가 $\boldsymbol\omega$와 평행하지 않으면 $\boldsymbol\omega\times\mathbf H\ne\mathbf 0$이라 축에 모멘트(베어링의 **동적 반력**)가 필요하고, 자전하는 원판의 축을 돌리면 **자이로 모멘트** $\boldsymbol\Omega\times\mathbf H$가 생겨 바닥을 더 세게 누르거나(굴림 원판) 무게를 받치며 세차합니다(자이로스코프).`,
    goals: [
      R`3차원 강체의 운동 방정식에서 $\dot{\mathbf H}$를 관성틀에서 재야 하는 이유를 설명할 수 있다`,
      R`회전 틀의 미분 규칙으로 $\dot{\mathbf H}=(\dot{\mathbf H})_{oxyz}+\boldsymbol\Omega\times\mathbf H$를 쓰고, 오일러 방정식을 유도할 수 있다`,
      R`일정한 각속도로 도는 비대칭 물체의 베어링 동적 반력을 구할 수 있다`,
      R`축 끝에서 구르는 원판처럼 자전과 공전이 겹친 물체의 모멘트와 반력을 구할 수 있다`,
      R`수평축 자이로스코프의 정상 세차 속도를 구할 수 있다`,
    ],
    secTitles: { '18.5': '운동 방정식과 틀의 선택', '18.6': '오일러 방정식', '18.8': '고정축 회전과 동적 반력', '18.9': '자전과 공전: 굴림 원판', '18.10': '자이로스코프의 세차' },
    sections: [
      { k: '18.5', p: 1165, src: '수업 필기 · 6월 1일, 8일', title: '운동 방정식과 틀의 선택', body: R`
:::key 3차원 강체의 운동 방정식
$$\sum\mathbf F=m\mathbf a_G,\qquad\sum\mathbf M_G=\dot{\mathbf H}_G\quad(\text{또는 고정점 }O\text{에 대해 }\sum\mathbf M_O=\dot{\mathbf H}_O)$$
$\dot{\mathbf H}$는 관성틀(전역 틀)에서 본 변화율이다.
:::

**전역 틀에서 풀기.** 관성 행렬을 전역 좌표로 쓰면 물체가 돌면서 $I(t)$가 변합니다. 필기 6월 1일의 예처럼 닫힌 식으로 쓸 수 있을 때는 $\mathbf H=I(t)\boldsymbol\omega$를 그대로 미분하면 되지만, 대개는 (1) $I(t)$를 닫힌 식으로 못 쓰거나 (2) 미분이 번거롭습니다(필기 6월 8일).

**물체 틀에서 풀기.** 물체와 함께 도는 틀에서는 관성 행렬이 상수입니다. 10단원의 규칙으로

:::key 회전 틀로 옮긴 모멘트 식
$$\sum\mathbf M_G=(\dot{\mathbf H}_G)_{oxyz}+\boldsymbol\Omega\times\mathbf H_G$$
$\boldsymbol\Omega$는 틀의 각속도. 틀을 물체에 붙이면 $\boldsymbol\Omega=\boldsymbol\omega$, 물체와 다르게 도는 틀(예: 축에 붙인 틀)도 쓸 수 있다.
:::

:::note 2차원에서는 왜 이 항이 없었나
평면 운동은 $\boldsymbol\omega=\omega\mathbf k$, $\mathbf H=I\omega\mathbf k$(대칭 물체)라 $\boldsymbol\omega\times\mathbf H=\omega\mathbf k\times I\omega\mathbf k=\mathbf 0$입니다. 3차원에서는 $\mathbf H$가 $\boldsymbol\omega$와 다른 방향일 수 있어 이 항이 남습니다(필기: “$\omega_z$가 일정해도 $\boldsymbol\omega\times\mathbf H$는 여전히 있다”).
:::
` },
      { k: '18.6', p: 1166, title: '오일러 방정식', body: R`
물체에 붙인 틀의 축이 주축이면 $\mathbf H_G=(I_x\omega_x,\ I_y\omega_y,\ I_z\omega_z)$이고 $(\dot{\mathbf H})_{oxyz}=(I_x\dot\omega_x,\ I_y\dot\omega_y,\ I_z\dot\omega_z)$. $\boldsymbol\omega\times\mathbf H$를 성분으로 쓰면:

:::key 오일러 방정식 (주축, 물체에 붙인 틀)
$$\sum M_x=I_x\dot\omega_x-(I_y-I_z)\omega_y\omega_z$$
$$\sum M_y=I_y\dot\omega_y-(I_z-I_x)\omega_z\omega_x$$
$$\sum M_z=I_z\dot\omega_z-(I_x-I_y)\omega_x\omega_y$$
:::

:::ex 예제 1 — 모멘트 없는 회전의 안정성
외력 모멘트가 없는 상자($I_1<I_2<I_3$)를 거의 한 주축 둘레로만 돌린다. 어느 축의 회전이 안정한가?
---
$\omega_1$이 크고 $\omega_2$, $\omega_3$가 작다고 두고 오일러 방정식을 선형화하면 $\ddot\omega_2=\dfrac{(I_3-I_1)(I_1-I_2)}{I_2I_3}\omega_1^2\,\omega_2$. $I_1$이 가장 작거나 가장 크면 계수가 음이라 $\omega_2$가 진동(안정), 가운데 축($I_2$)이면 양이라 지수적으로 커집니다(불안정). 테니스 라켓을 던져 보면 가운데 축 회전만 뒤집히는 이유입니다.
:::
` },
      { k: '18.8', p: 1168, src: '수업 필기 · 6월 1일', title: '고정축 회전과 베어링의 동적 반력', body: R`
:::fig dTiltRod
:::

:::ex 예제 2 — 축에 기울여 붙인 아령 (필기)
질량 $m$ 두 개를 길이 $2l$ 막대 양끝에 달고 가운데를 연직축에 각 $\alpha$로 고정해 일정한 $\omega$로 돌린다. 축이 받는 모멘트는?
---
**물체 틀**(막대가 $yz$ 평면): 질량 위치 $\pm(0,\ l\sin\alpha,\ l\cos\alpha)$. 텐서 성분 $I_{yz}=-\sum myz=-2ml^2\sin\alpha\cos\alpha$, $I_{zz}=2ml^2\sin^2\alpha$, $I_{xz}=0$.
$\boldsymbol\omega=\omega\mathbf k$ → $\mathbf H=(0,\ I_{yz}\omega,\ I_{zz}\omega)$, 틀에서 상수라 $(\dot{\mathbf H})_{oxyz}=\mathbf 0$.
$\sum\mathbf M=\boldsymbol\omega\times\mathbf H=\omega\mathbf k\times I_{yz}\omega\mathbf j=-I_{yz}\omega^2\mathbf i=2ml^2\omega^2\sin\alpha\cos\alpha\,\mathbf i_{\text{body}}$.
$\mathbf i_{\text{body}}$는 막대와 함께 돌므로 전역 틀에서는 $\sin\theta\,\mathbf I-\cos\theta\,\mathbf J$($\theta=\omega t$) — 필기의 전역 틀 계산 $2m\rho z_0\omega^2(\sin\theta,-\cos\theta,0)$($\rho=l\sin\alpha$, $z_0=l\cos\alpha$)와 같습니다.
$m=0.5$ kg, $l=0.3$ m, $\omega=20$ rad/s, $\alpha=30°$면 $M=15.6$ N·m. 베어링 간격 0.4 m면 각 베어링에 39 N의 도는 반력이 걸립니다.
:::

:::key 동적 균형
일정한 각속도로 도는 축에 모멘트가 필요 없으려면 회전축이 **주축**이어야 한다($\mathbf H\parallel\boldsymbol\omega$). 질량 중심이 축 위에 있는 것(정적 균형)만으로는 부족하다.
:::

:::note 필기의 두 방법
6월 1일 필기는 같은 문제를 (1) 전역 틀에서 $I(t)$를 닫힌 식으로 써서 $\mathbf H_{\text{cm}}=I(t)\boldsymbol\omega=2m(-\rho z_0\omega\cos\theta,\ -\rho z_0\omega\sin\theta,\ \rho^2\omega)$를 직접 미분하고, (2) 물체 틀에서 $\boldsymbol\omega\times\mathbf H$로 풀어 같은 답을 얻었습니다. 방법 (2)가 6월 8일 필기의 결론(“물체 틀: 식 3개로 충분”)입니다.
:::
` },
      { k: '18.9', src: '수업 필기 · 6월 8일, 5월 25일(보강)', title: '자전과 공전: 축 끝에서 구르는 원판', body: R`
:::fig dRollAxle
:::

:::ex 예제 3 — 바닥이 원판을 받치는 힘 (필기)
질량 $m$, 반지름 $r$인 원판이 길이 $L$인 가벼운 수평 축의 끝에 달려 있고, 축의 다른 끝 $O$는 연직축과 핀으로 이어져 있다. 원판이 자기 축에 대해 일정한 $\omega_1$로 돌며 바닥을 미끄러지지 않고 구른다. 바닥의 수직항력 $N$은?
---
① **각속도.** 구름: $v_G=r\omega_1=L\omega_2$. 원판 $\boldsymbol\omega=\omega_1\mathbf i-\tfrac rL\omega_1\mathbf j$, 축에 붙인 틀 $\boldsymbol\Omega=-\tfrac rL\omega_1\mathbf j$.
② **각운동량**(원점 $O$, 주축): $\mathbf H_O=I_{Ox}\omega_1\mathbf i-I_{Oy}\tfrac rL\omega_1\mathbf j$, $I_{Ox}=\tfrac12mr^2$, $I_{Oy}=\tfrac14mr^2+mL^2$. 틀에서 성분이 일정 → $(\dot{\mathbf H}_O)_{oxyz}=\mathbf 0$.
③ $\dot{\mathbf H}_O=\boldsymbol\Omega\times\mathbf H_O=\big(-\tfrac rL\omega_1\mathbf j\big)\times I_{Ox}\omega_1\mathbf i=\tfrac rLI_{Ox}\omega_1^2\mathbf k=\tfrac12m\tfrac{r^3}L\omega_1^2\mathbf k$ ($\mathbf j\times\mathbf j=\mathbf 0$).
④ **모멘트**($O$의 핀 반력은 모멘트 0): 무게 $L\mathbf i\times(-mg\mathbf j)=-mgL\mathbf k$, 수직항력 $(L\mathbf i-r\mathbf j)\times N\mathbf j=LN\mathbf k$.
⑤ $L(N-mg)=\tfrac12m\tfrac{r^3}L\omega_1^2$ → $$N=mg+\tfrac12m\frac{r^3}{L^2}\omega_1^2.$$
$m=4$ kg, $r=0.2$ m, $L=0.6$ m, $\omega_1=30$ rad/s면 $N=39.2+40=79.2$ N — 무게의 두 배. 맷돌이 빨리 돌수록 더 세게 가는 이유입니다.
핀 반력: 질량 중심은 반지름 $L$의 원을 $\omega_2$로 돌므로 $\mathbf a_G=-L\omega_2^2\mathbf i$, $R_x=-\tfrac{mr^2\omega_1^2}{L}$, $R_y=mg-N=-\tfrac12m\tfrac{r^3}{L^2}\omega_1^2$, $R_z=0$.
:::
` },
      { k: '18.10', p: 1186, title: '자이로스코프의 정상 세차', body: R`
자전하는 원판의 축이 수평이고, 한 끝이 받침점에 얹혀 있다. 떨어질 것 같은데 옆으로 천천히 돕니다(세차).

:::key 수평축 자이로스코프의 세차
자전 각속도 $\omega_s$(축 방향 성분), 축에 대한 관성 모멘트 $I$, 받침점에서 질량 중심까지 $d$일 때 정상 세차 각속도는
$$\Omega=\frac{mgd}{I\omega_s}.$$
:::

유도: 축에 붙인 틀(각속도 $\boldsymbol\Omega=\Omega\mathbf j$, 연직)에서 $\mathbf H\approx I\omega_s\mathbf i$(자전 몫, 세차 몫 $I_\perp\Omega\mathbf j$는 $\mathbf j$ 방향이라 외적에 기여하지 않음). $\dot{\mathbf H}=\boldsymbol\Omega\times\mathbf H=-I\omega_s\Omega\,\mathbf k$. 중력의 모멘트 $d\mathbf i\times(-mg\mathbf j)=-mgd\,\mathbf k$. 같게 두면 결론. 예제 3의 굴림 원판과 같은 구조이고, 중력 모멘트를 바닥 대신 자이로 모멘트가 받치는 것입니다.

:::ex 예제 4
질량 2 kg, $I=0.01$ kg·m²인 원판이 100 rad/s로 자전하고, 받침점에서 질량 중심까지 0.15 m다. 세차 각속도는?
---
$\Omega=\dfrac{2(9.81)(0.15)}{0.01(100)}=2.94$ rad/s. 자전을 두 배로 하면 세차는 절반.
:::

:::warn 근사의 범위
위 식은 축이 정확히 수평이고 $\Omega\ll\omega_s$일 때의 결과입니다. 축이 기울어진 일반 팽이의 정상 세차는 자전·세차·기울기 사이의 이차식을 풀어야 합니다(교재 18.10).
:::
` },
    ],
    problems: [
      { sec: '18.5', type: 'mc', lv: 1, q: R`3차원 강체 문제에서 물체와 함께 도는 틀을 쓰는 가장 큰 이점은?`,
        choices: [R`중력이 사라진다`, R`관성 행렬이 상수가 된다`, R`각운동량이 보존된다`, R`$\boldsymbol\Omega\times\mathbf H$ 항이 사라진다`], ans: 1,
        sol: R`대신 $\boldsymbol\Omega\times\mathbf H$ 항이 붙습니다.` },
      { sec: '18.5', type: 'mc', lv: 2, q: R`일정한 각속도로 도는 물체에 모멘트가 필요 없을 조건은?`,
        choices: [R`질량 중심이 회전축 위에 있다`, R`회전축이 주축이다($\mathbf H\parallel\boldsymbol\omega$)`, R`관성 모멘트가 작다`, R`각속도가 작다`], ans: 1,
        sol: R`$\sum\mathbf M=\boldsymbol\omega\times\mathbf H=\mathbf 0\iff\mathbf H\parallel\boldsymbol\omega$. 정적 균형(질량 중심)만으로는 부족합니다.` },
      { sec: '18.6', type: 'num', lv: 2, q: R`주관성 모멘트 $(I_x,I_y,I_z)=(2,3,4)$ kg·m²인 물체가 $\boldsymbol\omega=(0,2,3)$ rad/s(물체 틀, 일정)로 돈다. 필요한 $\sum M_x$(N·m)는?`, ans: '-(3-4)*2*3', ansTex: R`6`,
        sol: R`$I_x\dot\omega_x-(I_y-I_z)\omega_y\omega_z=0-(-1)(6)=6$ N·m.` },
      { sec: '18.6', type: 'mc', lv: 3, q: R`주관성 모멘트가 $I_1<I_2<I_3$인 물체를 모멘트 없이 던질 때 불안정한 회전축은?`,
        choices: [R`$I_1$ 축`, R`$I_2$ 축`, R`$I_3$ 축`, R`모두 안정`], ans: 1,
        sol: R`가운데 축에서 선형화한 교란이 지수적으로 커집니다.` },
      { sec: '18.8', type: 'num', lv: 2, q: R`아령($m=0.5$ kg, $l=0.3$ m)을 연직축에 30°로 고정해 20 rad/s로 돌린다. 축이 받아야 하는 모멘트(N·m)는?`, ans: '2*0.5*0.09*400*sin(pi/6)*cos(pi/6)', ansTex: R`15.6`,
        sol: R`$2ml^2\omega^2\sin\alpha\cos\alpha=15.59$ N·m.` },
      { sec: '18.8', type: 'num', lv: 2, q: R`같은 축의 베어링 간격이 0.4 m일 때 각 베어링의 반력 크기(N)는?`, ans: '15.588/0.4', ansTex: R`39.0`,
        sol: R`우력 $Rd=M$ → $R=39.0$ N. 무게를 받는 연직 반력은 별도입니다.` },
      { sec: '18.8', type: 'num', lv: 3, q: R`같은 아령에서 $\alpha$를 바꿔 필요한 모멘트를 최대로 하면 그 값(N·m)은?`, ans: '0.09*400*0.5', ansTex: R`18`,
        sol: R`$\sin\alpha\cos\alpha=\tfrac12\sin2\alpha$ → $\alpha=45°$에서 $ml^2\omega^2=0.5(0.09)(400)=18$ N·m.` },
      { sec: '18.9', type: 'num', lv: 2, q: R`예제 3($m=4$ kg, $r=0.2$ m, $L=0.6$ m, $\omega_1=30$ rad/s)에서 수직항력(N)은?`, ans: '4*9.81+0.5*4*0.008*900/0.36', ansTex: R`79.2`,
        sol: R`$mg+\tfrac12mr^3\omega_1^2/L^2=39.24+40=79.24$ N.` },
      { sec: '18.9', type: 'num', lv: 2, q: R`같은 원판에서 축이 연직축 둘레로 도는 각속도(rad/s)는?`, ans: '0.2*30/0.6', ansTex: R`10`,
        sol: R`$\omega_2=r\omega_1/L=10$ rad/s.` },
      { sec: '18.9', type: 'mc', lv: 2, q: R`예제 3에서 원판을 더 빨리 굴리면 수직항력은?`,
        choices: [R`변하지 않는다`, R`$\omega_1^2$에 비례해 커진다`, R`줄어든다`, R`0이 된다`], ans: 1,
        sol: R`자이로 모멘트 $\boldsymbol\Omega\times\mathbf H\propto\omega_1^2$를 바닥 반력의 추가분이 받칩니다.` },
      { sec: '18.10', type: 'num', lv: 1, q: R`$m=2$ kg, $I=0.01$ kg·m², $\omega_s=100$ rad/s, $d=0.15$ m인 수평축 자이로의 세차 각속도(rad/s)는?`, ans: '2*9.81*0.15/1', ansTex: R`2.94`,
        sol: R`$mgd/(I\omega_s)=2.943/1=2.94$ rad/s.` },
      { sec: '18.10', type: 'num', lv: 2, q: R`같은 자이로의 세차를 0.5 rad/s로 느리게 하려면 자전 각속도(rad/s)는?`, ans: '2*9.81*0.15/(0.01*0.5)', ansTex: R`589`,
        sol: R`$\omega_s=mgd/(I\Omega)=2.943/0.005=589$ rad/s.` },
      { sec: '18.6', type: 'open', lv: 2, proof: true, q: R`물체에 붙인 주축 틀에서 $\sum\mathbf M_G=(\dot{\mathbf H})_{oxyz}+\boldsymbol\omega\times\mathbf H$로부터 오일러 방정식의 $x$ 성분을 유도하세요.`,
        sol: R`
주축이면 $\mathbf H=(I_x\omega_x,\ I_y\omega_y,\ I_z\omega_z)$, 틀에서 $I$가 상수라 $(\dot{\mathbf H})_{oxyz}=(I_x\dot\omega_x,\ I_y\dot\omega_y,\ I_z\dot\omega_z)$.
$(\boldsymbol\omega\times\mathbf H)_x=\omega_yH_z-\omega_zH_y=\omega_y\omega_z(I_z-I_y)$.
$\sum M_x=I_x\dot\omega_x+(I_z-I_y)\omega_y\omega_z=I_x\dot\omega_x-(I_y-I_z)\omega_y\omega_z$.`,
        rubric: R`
- 주축의 $\mathbf H$와 틀에서의 변화율 — 4점
- 외적의 $x$ 성분 — 4점
- 정리 — 2점` },
      { sec: '18.9', type: 'open', lv: 3, proof: true, q: R`예제 3의 굴림 원판에서 수직항력 $N=mg+\tfrac12mr^3\omega_1^2/L^2$을 유도하세요. 각 단계에서 쓴 가정(구름, 주축, 틀의 각속도)을 명시하세요.`,
        sol: R`
구름: 접촉점 속도 0 → $v_G=r\omega_1$이고 $G$는 반지름 $L$의 원을 돌므로 $\omega_2=r\omega_1/L$. 축에 붙인 틀의 각속도 $\boldsymbol\Omega=-\omega_2\mathbf j$(방향은 그림의 약속).
주축: 원판의 대칭으로 $x$(축), $y$, $z$가 원점 $O$에 대한 주축. $\mathbf H_O=I_{Ox}\omega_1\mathbf i-I_{Oy}\omega_2\mathbf j$, $I_{Ox}=\tfrac12mr^2$(평행축 정리의 거리 0).
틀에서 성분이 일정하므로 $\dot{\mathbf H}_O=\boldsymbol\Omega\times\mathbf H_O=-\omega_2\mathbf j\times I_{Ox}\omega_1\mathbf i=I_{Ox}\omega_1\omega_2\mathbf k$.
$\sum\mathbf M_O$(핀 반력 제외): $L\mathbf i\times(-mg\mathbf j)+(L\mathbf i-r\mathbf j)\times N\mathbf j=(LN-mgL)\mathbf k$.
같게: $L(N-mg)=\tfrac12mr^2\omega_1\cdot\tfrac{r\omega_1}L$ → $N=mg+\tfrac12m\tfrac{r^3}{L^2}\omega_1^2$.`,
        rubric: R`
- 구름으로 $\omega_2$ — 2점
- 주축과 $\mathbf H_O$ — 3점
- $\boldsymbol\Omega\times\mathbf H_O$ — 2점
- 모멘트 계산 — 2점
- 결과 — 1점` },
    ],
  });
})();
