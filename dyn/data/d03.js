/* 03 뉴턴 제2법칙과 다섯 가지 힘 — B&J 12.1–12.6, 12.8, 수업 필기 3월 16일·18일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 3, part: 'A', title: '뉴턴 제2법칙과 다섯 가지 힘', en: 'Newton’s Second Law', ref: 'B&J 12.1–12.6, 12.8 · 필기 3/16, 3/18', plot: 'dyFriction',
    fig: R`당기는 힘을 키울 때의 마찰력: 정지 마찰은 따라 커지다가 최대 정지 마찰에서 운동 마찰로 떨어진다`,
    tagline: R`운동학이 “어떻게 움직이는가”라면 운동역학은 “왜 그렇게 움직이는가”입니다. 원인은 힘이고, 힘과 가속도를 잇는 것이 ΣF = ma입니다.`,
    summary: R`질점의 **선운동량** $\mathbf L=m\mathbf v$의 변화율이 알짜힘이고, 질량이 일정하면 $\sum\mathbf F=m\mathbf a$입니다. 수업은 문제에 나오는 힘을 다섯 가지로 정리합니다: **중력**($mg$, 무게중심), **수직항력**(크기는 다른 힘에 따라 정해지고, 면에 수직, 접촉을 잃으면 0), **장력**(줄을 따라 물체 바깥쪽), **스프링 힘**($-k\Delta x$, 복원력), **마찰력**(상대 속도의 반대, 운동 마찰 $\mu_kN$, 정지 마찰은 $\mu_sN$ 이하). 풀이는 자유물체도를 그리고 좌표 성분마다 $\sum F=ma$를 쓰는 것이며, 곡선 운동에서는 2단원의 접선-법선($\sum F_n=mv^2/\rho$)이나 극좌표 성분($\sum F_r=m(\ddot r-r\dot\theta^2)$)을 씁니다.`,
    goals: [
      R`선운동량으로 뉴턴 제2법칙을 쓰고 질량이 일정할 때 $\sum\mathbf F=m\mathbf a$로 줄일 수 있다`,
      R`다섯 가지 힘의 크기·방향·작용점을 설명하고 자유물체도에 바르게 그릴 수 있다`,
      R`정지 마찰과 운동 마찰을 구분하고 미끄러짐 여부를 판정할 수 있다`,
      R`직교 성분으로 운동 방정식을 세워 가속도와 미지의 힘을 구할 수 있다`,
      R`접선-법선·극좌표 성분의 운동 방정식으로 곡선 운동의 힘을 구할 수 있다`,
    ],
    secTitles: { '12.2': '뉴턴 제2법칙', '12.2b': '다섯 가지 힘', '12.5': '운동 방정식과 FBD', '12.5b': '마찰', '12.8': '곡선 운동의 운동 방정식' },
    sections: [
      { k: '12.2', p: 693, src: '수업 필기 · 3월 16일', title: '선운동량과 뉴턴 제2법칙', body: R`
:::key 뉴턴 제2법칙
$$\mathbf L=m\mathbf v,\qquad\sum\mathbf F=\frac{d\mathbf L}{dt}\overset{m\ \text{일정}}{=}m\mathbf a$$
$\sum\mathbf F=\mathbf 0$이면 $\mathbf L$이 일정하다(선운동량 보존).
:::

1단원이 “운동의 기술”(위치·속도·가속도)이었다면 여기서부터는 **운동의 원인**을 다룹니다. 필기의 표현대로, 떨어지는 물체의 자유물체도에서 $\sum\mathbf F=m\mathbf g$(원인) $=m\mathbf a$(결과)이므로 $\mathbf a=\mathbf g$.

:::note 질량이 변하면
로켓처럼 질량이 변하면 $d(m\mathbf v)/dt=\dot m\mathbf v+m\dot{\mathbf v}$에서 $\dot m$ 항을 어떻게 다루느냐가 문제가 됩니다. 결론은 “나가는 질량의 상대 속도”가 들어간 식이고, 9단원에서 유도합니다. 이 단원에서는 질량이 일정하다고 둡니다.
:::

:::warn 관성 기준틀에서만
$\sum\mathbf F=m\mathbf a$의 $\mathbf a$는 가속하지 않는 기준틀(관성틀)에서 잰 가속도입니다. 가속하는 차 안에서 잰 가속도를 쓰면 가상의 “관성력”을 더해야 합니다(9단원).
:::
` },
      { k: '12.2b', p: 693, src: '수업 필기 · 3월 16일', title: '다섯 가지 힘', body: R`
역학의 벡터는 크기·방향에 더해 **작용점**(시작점)이 필요합니다. 크기와 방향이 같아도 다른 점에 작용하면 강체에 다른 효과(회전)를 줍니다(12단원).

:::def 수업의 다섯 가지 힘
1. **중력**: 크기 $mg$($g=9.81$ m/s²), 방향은 지구 중심(아래), 작용점은 질량 중심(정확히는 무게중심). 지표에서 먼 곳은 만유인력 $GMm/r^2$(4단원).
2. **수직항력**: 크기는 **다른 힘에 따라 정해진다**, 방향은 받치는 면에 수직, 작용점은 접촉면의 압력 중심(물체 쪽). 접촉을 잃는 순간 $N=0$.
3. **장력**: 크기는 다른 힘에 따라 정해진다, 방향은 줄을 따라 **물체에서 바깥쪽**(줄은 당기기만), 작용점은 줄이 붙은 점.
4. **스프링 힘**: $\mathbf F=-k\Delta\mathbf x$ — 크기 $k\lvert\Delta x\rvert$, 방향은 변위의 반대(복원력), 작용점은 붙은 점. 실제 스프링은 변위가 크면 비선형.
5. **마찰력**: 방향은 접촉면에 대한 **상대 속도의 반대**, 작용점은 접촉면. 미끄러지면 크기 $\mu_kN$.
:::

:::ex 예제 1 — 수직항력은 정해져 있지 않다
10 kg 상자를 바닥에 놓으면 $N=98.1$ N, 100 kg이면 981 N. 상자를 엘리베이터에서 $2$ m/s²로 위로 가속하면 $N-mg=ma$에서 10 kg 상자의 $N=118.1$ N. “수직항력 = $mg$”는 수직 가속도가 0이고 다른 수직 힘이 없을 때만 맞습니다.
:::

:::note 상대 속도와 마찰의 방향 (필기의 예)
블록 $A$가 판 $B$ 위에 있고, $A$는 $\mathbf v$, $B$는 $2\mathbf v$로 같은 방향으로 움직입니다. $B$에 대한 $A$의 상대 속도는 $-\mathbf v$(뒤로)이므로 $A$가 받는 마찰은 **앞으로**, $B$가 받는 마찰은 뒤로입니다. 땅에 대해 앞으로 가는 물체도 마찰을 앞으로 받을 수 있습니다.
:::
` },
      { k: '12.5', p: 697, src: '수업 필기 · 3월 16일', title: '운동 방정식과 자유물체도', body: R`
:::key 풀이 순서
1. 물체 하나를 떼어 **자유물체도**(힘)와 **운동선도**($m\mathbf a$)를 그린다.
2. 좌표축을 고른다(가속도가 한 축을 따르도록).
3. 성분마다 $\sum F_x=ma_x$, $\sum F_y=ma_y$.
4. 구속(정지, 접촉, 줄의 길이)으로 미지수를 줄인다.
:::

:::fig dBoxPull
:::

:::ex 예제 2 — 비스듬한 줄로 끄는 상자 (필기의 예)
질량 $m$, 운동 마찰 계수 $\mu$인 상자를 수평과 $\theta$인 줄로 끌어 가속도 $a$로 움직이려면 장력은?
---
$\sum F_y=T\sin\theta+N-mg=0$ → $N=mg-T\sin\theta$.
$\sum F_x=T\cos\theta-\mu N=ma$ → $T\cos\theta-\mu mg+\mu T\sin\theta=ma$.
$$T=\frac{ma+\mu mg}{\cos\theta+\mu\sin\theta}.$$
줄을 약간 위로 당기면 $N$이 줄어 마찰이 작아지므로 수평보다 유리합니다. $T$가 최소인 각은 분모를 최대로 하는 $\tan\theta=\mu$입니다.
:::

:::ex 예제 3 — 두 블록과 도르래
탁자 위 4 kg 블록(마찰 없음)이 줄과 도르래로 매달린 2 kg 블록과 이어져 있다. 가속도와 장력은?
---
탁자 블록: $T=4a$. 매달린 블록: $2g-T=2a$. 더하면 $2g=6a$, $a=3.27$ m/s², $T=13.1$ N. 장력은 매달린 블록의 무게 19.6 N보다 작습니다(그 블록이 가속하므로).
:::
` },
      { k: '12.5b', p: 698, src: '수업 필기 · 3월 16일', title: '마찰: 정지와 운동', body: R`
:::key 마찰력의 두 영역
- 미끄러지지 않을 때(정지 마찰): $\lvert f\rvert\le\mu_sN$. 크기는 평형(또는 운동 방정식)이 요구하는 만큼.
- 미끄러질 때(운동 마찰): $\lvert f\rvert=\mu_kN$, 방향은 상대 속도의 반대. 보통 $\mu_k<\mu_s$.
:::

:::ex 예제 4 — 경사면의 블록 (필기의 예 바로잡기)
경사각 $\theta$인 면 위 블록이 정지해 있다. 필기는 $\sum F_x=\mu N-mg\sin\theta=0$, $N=mg\cos\theta$에서 “$\mu=\tan\theta$”라 적었다. 이 식이 뜻하는 것은?
---
정지해 있으면 마찰은 **필요한 만큼** $f=mg\sin\theta$이고 조건은 $f\le\mu_sN$, 곧 $\tan\theta\le\mu_s$입니다. 등호 $\mu_s=\tan\theta$는 **미끄러지기 직전**(최대 경사각)일 때만 성립합니다. 그러므로 “정지해 있다 ⇒ $\mu=\tan\theta$”는 옳지 않고, “$\tan\theta\le\mu_s$”가 맞습니다.
필기의 두 번째 그림(“$\mu=\tan\theta$이면 속력이 일정”)은 **운동 마찰**의 이야기입니다: 이미 미끄러지는 블록은 $a=g(\sin\theta-\mu_k\cos\theta)$이므로 $\mu_k=\tan\theta$이면 등속으로 내려갑니다.
:::

:::tip 미끄러짐 판정의 순서
1. 미끄러지지 않는다고 가정하고 필요한 마찰 $f$를 구한다.
2. $\lvert f\rvert\le\mu_sN$이면 가정이 맞다. 아니면 미끄러지고 $f=\mu_kN$으로 다시 푼다.
:::
` },
      { k: '12.8', p: 722, src: '수업 필기 · 3월 18일', title: '곡선 운동의 운동 방정식', body: R`
:::key 접선-법선과 극좌표의 운동 방정식
$$\sum F_t=m\dot v,\qquad\sum F_n=m\frac{v^2}{\rho}$$
$$\sum F_r=m(\ddot r-r\dot\theta^2),\qquad\sum F_\theta=m(r\ddot\theta+2\dot r\dot\theta)$$
:::

:::fig dBanked
:::

:::ex 예제 5 — 경사진 곡선 도로의 설계 속력
곡률 반지름 $\rho$, 경사각 $\theta$인 도로에서 마찰 없이 돌 수 있는 속력은?
---
연직: $N\cos\theta=mg$. 수평(곡선 중심 쪽): $N\sin\theta=mv^2/\rho$. 나누면 $\tan\theta=v^2/(g\rho)$, $v=\sqrt{g\rho\tan\theta}$.
$\rho=120$ m, $\theta=15°$면 $v=\sqrt{9.81(120)(0.268)}=17.7$ m/s(64 km/h).
:::

:::ex 예제 6 — 수직 원 궤도의 꼭대기
반지름 $R$인 수직 원형 궤도의 안쪽을 도는 차가 꼭대기에서 궤도를 떠나지 않을 최소 속력은?
---
꼭대기에서 중심은 아래: $N+mg=mv^2/R$. 접촉을 유지하려면 $N\ge0$ → $v\ge\sqrt{gR}$. $N=0$이 “접촉을 잃는 순간”(다섯 가지 힘의 2번)입니다.
:::
` },
    ],
    problems: [
      { sec: '12.2', type: 'num', lv: 1, q: R`5 kg 물체에 $(12,\,-5)$ N의 알짜힘이 작용한다. 가속도의 크기(m/s²)는?`, ans: '13/5', ansTex: R`2.6`,
        sol: R`$\lvert\mathbf F\rvert=13$ N, $a=13/5=2.6$ m/s².` },
      { sec: '12.2b', type: 'num', lv: 1, q: R`70 kg 사람이 3 m/s²로 **아래로** 가속하는 엘리베이터 바닥을 누르는 힘(N)은?`, ans: '70*(9.81-3)', ansTex: R`476.7\ \text{N}`,
        sol: R`위를 양으로 $N-mg=m(-3)$ → $N=70(6.81)=476.7$ N.` },
      { sec: '12.2b', type: 'mc', lv: 1, q: R`장력에 대한 설명으로 옳은 것은?`,
        choices: [R`줄은 물체를 밀 수도 당길 수도 있다`, R`방향은 줄을 따라 물체에서 바깥쪽이고, 크기는 다른 힘과 운동에 따라 정해진다`, R`크기는 늘 매단 물체의 무게와 같다`, R`작용점은 물체의 무게중심이다`], ans: 1,
        sol: R`줄은 당기기만 합니다. 매단 물체가 가속하면 장력은 무게와 다릅니다.` },
      { sec: '12.2b', type: 'mc', lv: 2, q: R`블록 $A$(속도 $\mathbf v$)가 판 $B$(속도 $2\mathbf v$, 같은 방향) 위에서 미끄러진다. $A$가 받는 마찰력의 방향은?`,
        choices: [R`$\mathbf v$와 같은 방향`, R`$\mathbf v$와 반대 방향`, R`수직`, R`마찰이 없다`], ans: 0,
        sol: R`$B$에 대한 $A$의 상대 속도는 $-\mathbf v$이므로 마찰은 $+\mathbf v$ 방향입니다.` },
      { sec: '12.5', type: 'num', lv: 2, q: R`30 kg 상자를 수평과 25°인 줄로 끌어 1 m/s²로 가속한다($\mu_k=0.3$). 장력(N)은?`, ans: '(30*1+0.3*30*9.81)/(cos(25*pi/180)+0.3*sin(25*pi/180))', ansTex: R`114.5\ \text{N}`,
        sol: R`$T=(ma+\mu mg)/(\cos\theta+\mu\sin\theta)=(30+88.29)/(0.9063+0.1268)=114.5$ N.` },
      { sec: '12.5', type: 'num', lv: 2, q: R`탁자 위 4 kg 블록(마찰 없음)과 매달린 2 kg 블록이 줄로 이어져 있다. 줄의 장력(N)은?`, ans: '4*2*9.81/6', ansTex: R`13.1\ \text{N}`,
        sol: R`$a=2g/6$, $T=4a=8g/6=13.1$ N.` },
      { sec: '12.5', type: 'num', lv: 3, q: R`예제 2에서 장력이 최소가 되는 줄의 각(도)은? ($\mu=0.3$)`, ans: 'atan(0.3)*180/pi', ansTex: R`16.7°`,
        sol: R`분모 $\cos\theta+\mu\sin\theta$를 최대로: 미분 $-\sin\theta+\mu\cos\theta=0$ → $\tan\theta=\mu$, $\theta=16.7°$.` },
      { sec: '12.5b', type: 'num', lv: 1, q: R`$\mu_s=0.4$인 경사면에서 블록이 미끄러지지 않는 최대 경사각(도)은?`, ans: 'atan(0.4)*180/pi', ansTex: R`21.8°`,
        sol: R`$\tan\theta\le\mu_s$ → $\theta_{\max}=\arctan0.4=21.8°$.` },
      { sec: '12.5b', type: 'num', lv: 2, q: R`경사 30°인 면을 미끄러져 내려가는 블록의 가속도(m/s²)는? ($\mu_k=0.2$)`, ans: '9.81*(sin(pi/6)-0.2*cos(pi/6))', ansTex: R`3.21`,
        sol: R`$a=g(\sin30°-0.2\cos30°)=9.81(0.5-0.1732)=3.21$ m/s².` },
      { sec: '12.5b', type: 'mc', lv: 2, q: R`경사 20°인 면 위에 블록이 정지해 있다($\mu_s=0.5$). 마찰력의 크기는?`,
        choices: [R`$0.5mg\cos20°$`, R`$mg\sin20°$`, R`$mg\tan20°$`, R`0`], ans: 1,
        sol: R`정지 마찰은 필요한 만큼만 냅니다: $f=mg\sin20°=0.342mg$. 최대값 $0.5mg\cos20°=0.470mg$보다 작으니 정지가 맞습니다.` },
      { sec: '12.8', type: 'num', lv: 1, q: R`곡률 반지름 120 m, 경사 15°인 도로의 마찰 없는 설계 속력(m/s)은?`, ans: 'sqrt(9.81*120*tan(pi/12))', ansTex: R`17.7\ \text{m/s}`,
        sol: R`$v=\sqrt{g\rho\tan\theta}=17.7$ m/s.` },
      { sec: '12.8', type: 'num', lv: 2, q: R`반지름 8 m인 수직 원형 궤도 꼭대기를 지나는 최소 속력(m/s)은?`, ans: 'sqrt(9.81*8)', ansTex: R`8.86\ \text{m/s}`,
        sol: R`$v_{\min}=\sqrt{gR}=8.86$ m/s.` },
      { sec: '12.8', type: 'num', lv: 3, q: R`0.2 kg 고리가 수평면에서 $\dot\theta=4$ rad/s로 도는 매끄러운 막대를 따라 미끄러진다. $r=0.5$ m, $\dot r=1$ m/s인 순간 막대가 고리에 주는 수평 힘(N)은? ($\ddot\theta=0$)`, ans: '0.2*2*1*4', ansTex: R`1.6\ \text{N}`,
        sol: R`막대는 매끄러워 $e_r$ 방향 힘이 없고 $e_\theta$ 방향으로만 밉니다. $F_\theta=m(r\ddot\theta+2\dot r\dot\theta)=0.2(0+8)=1.6$ N. (그 순간 $\ddot r=r\dot\theta^2=8$ m/s²로 바깥으로 가속.)` },
      { sec: '12.5', type: 'open', lv: 2, proof: true, q: R`비스듬한 줄(수평과 $\theta$)로 운동 마찰 계수 $\mu$인 바닥 위 상자를 가속도 $a$로 끌 때 필요한 장력을 유도하고, 장력이 최소가 되는 각이 $\tan\theta=\mu$임을 보이세요.`,
        sol: R`
자유물체도: $mg$(아래), $N$(위), $\mu N$(뒤), $T$(각 $\theta$).
$y$: $T\sin\theta+N-mg=0$ → $N=mg-T\sin\theta$ (단, $N\ge0$).
$x$: $T\cos\theta-\mu N=ma$ → $T(\cos\theta+\mu\sin\theta)=ma+\mu mg$.
$T=\dfrac{m(a+\mu g)}{\cos\theta+\mu\sin\theta}$. 분자는 $\theta$와 무관하므로 분모 $h(\theta)=\cos\theta+\mu\sin\theta$를 최대로: $h'=-\sin\theta+\mu\cos\theta=0$ → $\tan\theta=\mu$. $h''<0$이라 최대. 최소 장력은 $m(a+\mu g)/\sqrt{1+\mu^2}$.`,
        rubric: R`
- 자유물체도와 두 성분 식 — 4점
- 장력 식 — 2점
- 최적화 — 3점
- 최소값 — 1점` },
      { sec: '12.8', type: 'open', lv: 2, proof: true, q: R`경사각 $\theta$, 곡률 반지름 $\rho$인 도로에서 정지 마찰 계수 $\mu_s$일 때 미끄러지지 않고 돌 수 있는 최대 속력을 유도하세요.`,
        sol: R`
최대 속력에서는 차가 바깥(위)으로 미끄러지려 하므로 마찰은 도로면을 따라 **아래로** $\mu_sN$.
연직: $N\cos\theta-\mu_sN\sin\theta-mg=0$.
수평(중심 쪽): $N\sin\theta+\mu_sN\cos\theta=mv^2/\rho$.
나누면 $\dfrac{v^2}{g\rho}=\dfrac{\sin\theta+\mu_s\cos\theta}{\cos\theta-\mu_s\sin\theta}=\dfrac{\tan\theta+\mu_s}{1-\mu_s\tan\theta}$.
$v_{\max}=\sqrt{g\rho\,\dfrac{\tan\theta+\mu_s}{1-\mu_s\tan\theta}}$ ($\mu_s\tan\theta<1$). $\mu_s=0$이면 설계 속력으로 돌아갑니다.`,
        rubric: R`
- 마찰의 방향 판단 — 3점
- 두 성분 식 — 4점
- 결과와 확인 — 3점` },
    ],
  });
})();
