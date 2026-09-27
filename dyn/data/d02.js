/* 02 곡선 운동: 직교·접선-법선·극좌표 — B&J 11.9–11.14, 수업 필기 3월 9일·11일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 2, part: 'A', title: '곡선 운동: 세 가지 좌표계', en: 'Curvilinear Motion', ref: 'B&J 11.9–11.14 · 필기 3/9, 3/11', plot: 'dyProj',
    fig: R`같은 속력으로 던진 포물체의 궤적들. 45°에서 사거리가 가장 길다`,
    tagline: R`곡선 위의 운동은 좌표계를 잘 고르면 쉬워집니다. 직교 좌표는 단위벡터가 고정되고, 접선-법선과 극좌표는 단위벡터가 질점을 따라 돌기 때문에 가속도에 새 항이 생깁니다.`,
    summary: R`벡터 함수의 미분은 스칼라처럼 합·곱 규칙을 따르고, 속도는 늘 **경로에 접합니다**. 직교 좌표에서는 단위벡터가 상수라 성분별로 미분하면 되고, 포물체 운동은 수평 등속 + 연직 등가속도입니다. **접선-법선 좌표**에서는 $\mathbf v=v\mathbf e_t$이고, 단위벡터의 변화율 $d\mathbf e_t/dt=(v/\rho)\mathbf e_n$ 때문에 $\mathbf a=\dot v\,\mathbf e_t+(v^2/\rho)\mathbf e_n$ — 속력이 일정해도 경로가 휘면 곡률 중심 쪽으로 가속합니다. **극좌표**에서는 $d\mathbf e_r/dt=\dot\theta\mathbf e_\theta$, $d\mathbf e_\theta/dt=-\dot\theta\mathbf e_r$에서 $\mathbf v=\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta$, $\mathbf a=(\ddot r-r\dot\theta^2)\mathbf e_r+(r\ddot\theta+2\dot r\dot\theta)\mathbf e_\theta$가 나오고, 여기에 $z$를 더하면 원통 좌표입니다.`,
    goals: [
      R`벡터 함수의 합·곱·내적·외적의 미분 규칙을 극한으로 보일 수 있다`,
      R`직교 좌표로 포물체 운동을 풀고 최고점의 곡률 반지름을 구할 수 있다`,
      R`$d\mathbf e_t/dt=(v/\rho)\mathbf e_n$을 유도하고 접선·법선 가속도를 계산할 수 있다`,
      R`극좌표 단위벡터의 도함수로 속도와 가속도 공식을 유도할 수 있다`,
      R`문제에 맞는 좌표계를 고르고 원통 좌표로 확장할 수 있다`,
    ],
    secTitles: { '11.10': '벡터 함수의 미분', '11.11': '직교 성분과 포물체', '11.13': '접선-법선 성분', '11.14': '극좌표 성분' },
    sections: [
      { k: '11.10', p: 643, src: '수업 필기 · 3월 9일', title: '벡터 함수의 미분', body: R`
위치 $\mathbf P(t)$의 도함수는 스칼라와 같은 극한으로 정의합니다.
$$\frac{d\mathbf P}{dt}=\lim_{\Delta t\to0}\frac{\mathbf P(t+\Delta t)-\mathbf P(t)}{\Delta t}$$

:::key 벡터 미분의 규칙
$$\frac{d(\mathbf P+\mathbf Q)}{dt}=\dot{\mathbf P}+\dot{\mathbf Q},\quad\frac{d(f\mathbf P)}{dt}=\dot f\mathbf P+f\dot{\mathbf P},\quad\frac{d(\mathbf P\cdot\mathbf Q)}{dt}=\dot{\mathbf P}\cdot\mathbf Q+\mathbf P\cdot\dot{\mathbf Q},\quad\frac{d(\mathbf P\times\mathbf Q)}{dt}=\dot{\mathbf P}\times\mathbf Q+\mathbf P\times\dot{\mathbf Q}$$
외적은 순서를 바꾸면 부호가 바뀌므로 곱 규칙에서도 순서를 지킨다.
:::

:::key 속도는 경로에 접한다
$\Delta t\to0$이면 할선 $\mathbf P(t+\Delta t)-\mathbf P(t)$가 접선 방향으로 가므로 $\mathbf v=d\mathbf P/dt$는 경로의 접선이다.
:::

필기의 반례: 경로가 곧은 선인데 속도가 경로를 벗어나는 방향이라면, 다음 순간 질점이 경로 밖에 있어야 하므로 모순입니다.

:::note 등속 원운동도 가속한다
$\lvert\mathbf v\rvert$가 일정해도 방향이 바뀌면 $\mathbf a\ne\mathbf 0$입니다. $\mathbf v\cdot\mathbf v=v^2$이 일정하면 미분해서 $2\mathbf v\cdot\mathbf a=0$ — 가속도가 속도에 수직(구심 가속도)입니다. 가속도의 변화율은 **저크**(jerk)라 하며 승차감의 척도로 씁니다.
:::
` },
      { k: '11.11', p: 645, title: '직교 성분과 포물체 운동', body: R`
직교 좌표의 $\mathbf i,\mathbf j,\mathbf k$는 크기와 방향이 모두 시간에 따라 변하지 않으므로 $d\mathbf i/dt=\mathbf 0$입니다.

:::key 직교 성분
$$\mathbf v=\dot x\,\mathbf i+\dot y\,\mathbf j+\dot z\,\mathbf k,\qquad\mathbf a=\ddot x\,\mathbf i+\ddot y\,\mathbf j+\ddot z\,\mathbf k$$
포물체(공기 저항 무시): $\ddot x=0$, $\ddot y=-g$ — 수평은 등속, 연직은 등가속도.
:::

:::ex 예제 1 — 사거리
평지에서 속력 $v_0$, 각 $\alpha$로 던진 공의 비행 시간과 사거리는?
---
$y=v_0\sin\alpha\,t-\tfrac12gt^2=0$에서 $t_f=2v_0\sin\alpha/g$. $x_f=v_0\cos\alpha\,t_f=\dfrac{v_0^2\sin2\alpha}{g}$ — $\alpha=45°$에서 최대 $v_0^2/g$.
$v_0=20$ m/s, $\alpha=30°$면 $t_f=2.04$ s, $x_f=35.3$ m.
:::

:::ex 예제 2 — 최고점의 곡률 반지름
같은 공의 최고점에서 궤적의 곡률 반지름은?
---
최고점에서 속도는 수평 $v_0\cos\alpha$, 가속도는 아래 $g$로 속도에 수직이라 전부 법선 성분입니다. $g=v^2/\rho$에서 $\rho=\dfrac{v_0^2\cos^2\alpha}{g}=\dfrac{400(0.75)}{9.81}=30.6$ m. (다음 절의 $a_n=v^2/\rho$를 거꾸로 쓴 것.)
:::
` },
      { k: '11.13', p: 665, src: '수업 필기 · 3월 11일', title: '접선-법선 성분', body: R`
공장 바닥처럼 반듯한 격자가 아니라 곡선 도로를 따라가는 운동은 경로에 붙은 좌표가 편합니다(필기의 “비직교 좌표계”).

:::fig dNT
:::

경로를 따라 잰 거리(station)를 $s$라 하면 속도는 $\mathbf v=v\mathbf e_t$, $v=ds/dt$입니다. 이제 $\mathbf e_t$ 자체가 돌기 때문에 미분이 필요합니다.

:::key 접선 단위벡터의 변화율
$$\frac{d\mathbf e_t}{dt}=\frac{d\mathbf e_t}{d\theta}\frac{d\theta}{ds}\frac{ds}{dt}=\frac v\rho\,\mathbf e_n,\qquad\frac{d\mathbf e_n}{dt}=-\frac v\rho\,\mathbf e_t$$
세 인수: $\lvert d\mathbf e_t/d\theta\rvert=1$(방향은 $\mathbf e_n$), $d\theta/ds=1/\rho$(곡률), $ds/dt=v$.
:::

$\lvert d\mathbf e_t/d\theta\rvert$: 단위벡터 두 개가 $\Delta\theta$만큼 벌어지면 차의 길이는 이등변삼각형의 밑변 $2\sin(\Delta\theta/2)$이고, $\lim2\sin(\Delta\theta/2)/\Delta\theta=1$입니다(작은 각에서 $\sin x\approx x$; 15°에서도 오차 1%). 방향은 두 벡터의 이등분선에 수직, 극한에서 $\mathbf e_t$에 수직인 $\mathbf e_n$.

:::key 접선-법선 가속도
$$\mathbf a=\dot v\,\mathbf e_t+\frac{v^2}{\rho}\,\mathbf e_n$$
직선($\rho\to\infty$)이면 $\mathbf a=\dot v\mathbf e_t$, 등속 원운동($\dot v=0$)이면 구심 가속도 $v^2/\rho$만 남는다.
:::

:::warn 각의 양의 방향 (필기의 주의)
수업에서는 반시계 방향 회전을 양으로 둡니다($xy$ 평면의 양의 회전 = $+z$ 방향). $\mathbf e_n$을 “곡률 중심 쪽”으로 정의하면 휘는 방향과 무관하게 $d\mathbf e_t/dt=+(v/\rho)\mathbf e_n$입니다. 반대로 $\mathbf e_n$을 $\mathbf e_t$를 반시계로 90° 돌린 고정 규칙으로 정하면, 시계 방향으로 휘는 구간에서는 $-(v/\rho)\mathbf e_n$이 되어 부호가 바뀝니다. 어느 약속을 쓰는지 먼저 밝히세요.
:::

:::ex 예제 3
곡률 반지름 100 m인 곡선 도로를 20 m/s로 달리던 차가 2 m/s²로 감속한다. 가속도의 크기는?
---
$a_t=-2$, $a_n=400/100=4$ m/s². $\lvert\mathbf a\rvert=\sqrt{4+16}=4.47$ m/s².
:::
` },
      { k: '11.14', p: 668, src: '수업 필기 · 3월 11일', title: '극좌표 성분과 원통 좌표', body: R`
레이더처럼 한 점에서 거리와 각을 재는 경우 **극좌표** $(r,\theta)$가 자연스럽습니다.

:::fig dPolar
:::

:::key 극좌표 단위벡터의 도함수
$$\frac{d\mathbf e_r}{dt}=\dot\theta\,\mathbf e_\theta,\qquad\frac{d\mathbf e_\theta}{dt}=-\dot\theta\,\mathbf e_r$$
:::

:::key 극좌표의 속도와 가속도
$$\mathbf v=\dot r\,\mathbf e_r+r\dot\theta\,\mathbf e_\theta,\qquad\mathbf a=(\ddot r-r\dot\theta^2)\,\mathbf e_r+(r\ddot\theta+2\dot r\dot\theta)\,\mathbf e_\theta$$
원통 좌표는 여기에 $\dot z\mathbf k$, $\ddot z\mathbf k$를 더한다.
:::

유도: $\mathbf r=r\mathbf e_r$를 곱 규칙으로 미분하면 $\mathbf v=\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta$. 한 번 더 미분하면 $\ddot r\mathbf e_r+\dot r\dot\theta\mathbf e_\theta+\dot r\dot\theta\mathbf e_\theta+r\ddot\theta\mathbf e_\theta-r\dot\theta^2\mathbf e_r$. 같은 $\dot r\dot\theta$ 항이 두 번 나와 $2\dot r\dot\theta$가 됩니다.

:::ex 예제 4 — 회전하는 팔 위의 고리
일정한 각속도 $\dot\theta=2$ rad/s로 도는 팔을 따라 고리가 바깥으로 미끄러진다. $r=0.5$ m, $\dot r=0.4$ m/s, $\ddot r=0$인 순간의 가속도는?
---
$a_r=0-0.5(4)=-2$ m/s², $a_\theta=0+2(0.4)(2)=1.6$ m/s². 팔이 고리를 옆으로 밀어야 하는 가속도 $2\dot r\dot\theta$는 10단원의 코리올리 가속도와 같은 항입니다.
:::

:::tip 좌표계 고르기
- 힘이 한 방향으로 일정(중력): 직교 좌표.
- 경로가 주어지고 속력의 변화를 묻는다(도로, 롤러코스터): 접선-법선.
- 한 점을 중심으로 도는 팔, 중심력, 레이더: 극좌표.
:::
` },
    ],
    problems: [
      { sec: '11.10', type: 'mc', lv: 1, q: R`$\lvert\mathbf v(t)\rvert$가 일정한 운동에 대해 옳은 것은?`,
        choices: [R`가속도는 0이다`, R`가속도는 속도에 수직이다(또는 0)`, R`가속도는 속도와 평행하다`, R`경로는 직선이다`], ans: 1,
        sol: R`$\mathbf v\cdot\mathbf v$가 일정하면 미분해 $2\mathbf v\cdot\mathbf a=0$. 등속 원운동이 예입니다.` },
      { sec: '11.10', type: 'num', lv: 2, q: R`$\mathbf P=(t^2,\,t,\,1)$, $\mathbf Q=(1,\,t^2,\,t)$일 때 $t=1$에서 $\frac{d}{dt}(\mathbf P\cdot\mathbf Q)$는?`, ans: '6', ansTex: R`6`,
        sol: R`$\mathbf P\cdot\mathbf Q=t^2+t^3+t$, 도함수 $2t+3t^2+1=6$. 곱 규칙으로 $\dot{\mathbf P}\cdot\mathbf Q+\mathbf P\cdot\dot{\mathbf Q}=(2,1,0)\cdot(1,1,1)+(1,1,1)\cdot(0,2,1)=3+3$도 같습니다.` },
      { sec: '11.11', type: 'num', lv: 1, q: R`평지에서 20 m/s, 30°로 던진 공의 사거리(m)는? ($g=9.81$)`, ans: '400*sin(pi/3)/9.81', ansTex: R`35.3\ \text{m}`,
        sol: R`$v_0^2\sin2\alpha/g=400(0.866)/9.81=35.3$ m.` },
      { sec: '11.11', type: 'num', lv: 2, q: R`높이 15 m 절벽 끝에서 수평으로 12 m/s로 던진 돌이 땅에 닿는 곳까지의 수평 거리(m)는?`, ans: '12*sqrt(2*15/9.81)', ansTex: R`21.0\ \text{m}`,
        sol: R`$t=\sqrt{2h/g}=1.749$ s, $x=12t=21.0$ m.` },
      { sec: '11.11', type: 'num', lv: 2, q: R`20 m/s, 30°로 던진 공의 최고점에서 궤적의 곡률 반지름(m)은?`, ans: '400*0.75/9.81', ansTex: R`30.6\ \text{m}`,
        sol: R`$\rho=(v_0\cos\alpha)^2/g=300/9.81=30.6$ m.` },
      { sec: '11.13', type: 'num', lv: 1, q: R`곡률 반지름 50 m인 곡선을 15 m/s로 등속 주행하는 차의 가속도 크기(m/s²)는?`, ans: '4.5', ansTex: R`4.5`,
        sol: R`$a=a_n=v^2/\rho=225/50=4.5$ m/s².` },
      { sec: '11.13', type: 'num', lv: 2, q: R`곡률 반지름 100 m, 속력 20 m/s, 감속 2 m/s²인 차의 가속도 크기(m/s²)는?`, ans: 'sqrt(20)', ansTex: R`4.47`,
        sol: R`$\sqrt{2^2+4^2}=4.47$ m/s².` },
      { sec: '11.13', type: 'num', lv: 3, q: R`최대 가속도가 $0.8g$로 제한된 차가 곡률 반지름 60 m 곡선에 들어서며 동시에 3 m/s²로 제동한다. 낼 수 있는 최대 속력(m/s)은? ($g=9.81$)`, ans: 'sqrt(60*sqrt((0.8*9.81)^2-9))', ansTex: R`20.9\ \text{m/s}`,
        sol: R`$a_n^2+a_t^2\le(7.848)^2$ → $a_n\le\sqrt{61.59-9}=7.252$. $v=\sqrt{\rho a_n}=\sqrt{435.1}=20.9$ m/s.` },
      { sec: '11.14', type: 'num', lv: 1, q: R`$\dot\theta=2$ rad/s 일정, $r=0.5$ m, $\dot r=0.4$ m/s, $\ddot r=0$일 때 $a_\theta$(m/s²)는?`, ans: '1.6', ansTex: R`1.6`,
        sol: R`$r\ddot\theta+2\dot r\dot\theta=0+2(0.4)(2)=1.6$.` },
      { sec: '11.14', type: 'num', lv: 2, q: R`$r=2+\cos t$ (m), $\theta=t$ (rad)인 질점의 $t=0$에서 $a_r$(m/s²)은?`, ans: '-4', ansTex: R`-4`,
        sol: R`$r(0)=3$, $\dot r=-\sin t=0$, $\ddot r=-\cos t=-1$, $\dot\theta=1$. $a_r=\ddot r-r\dot\theta^2=-1-3=-4$.` },
      { sec: '11.14', type: 'mc', lv: 2, q: R`극좌표 가속도의 $2\dot r\dot\theta$ 항이 두 배인 이유는?`,
        choices: [R`원통 좌표로 바꿀 때 생긴다`, R`$\dot r\mathbf e_r$을 미분할 때와 $r\dot\theta\mathbf e_\theta$를 미분할 때 같은 항이 한 번씩 나온다`, R`$\mathbf e_\theta$의 길이가 2이기 때문`, R`근사에서 생긴 오차`], ans: 1,
        sol: R`$\dot r\,d\mathbf e_r/dt=\dot r\dot\theta\mathbf e_\theta$와 $r\dot\theta$의 곱 규칙에서 $\dot r\dot\theta\mathbf e_\theta$가 한 번 더 나옵니다.` },
      { sec: '11.14', type: 'num', lv: 2, q: R`원통 좌표에서 $r=1$ m 일정, $\dot\theta=3$ rad/s 일정, $z=0.5t^2$ (m)인 나선 운동의 가속도 크기(m/s²)는?`, ans: 'sqrt(81+1)', ansTex: R`9.06`,
        sol: R`$a_r=-r\dot\theta^2=-9$, $a_\theta=0$, $a_z=\ddot z=1$. $\sqrt{82}=9.06$ m/s².` },
      { sec: '11.13', type: 'open', lv: 2, proof: true, q: R`$\mathbf v=v\mathbf e_t$에서 출발해 $\mathbf a=\dot v\mathbf e_t+(v^2/\rho)\mathbf e_n$을 유도하세요. $d\mathbf e_t/d\theta$의 크기가 1임을 극한으로 보이세요.`,
        sol: R`
곱 규칙: $\mathbf a=\dot v\mathbf e_t+v\,d\mathbf e_t/dt$.
연쇄법칙: $\dfrac{d\mathbf e_t}{dt}=\dfrac{d\mathbf e_t}{d\theta}\dfrac{d\theta}{ds}\dfrac{ds}{dt}$ ($\theta$: 접선의 방향각, $s$: 호의 길이).
$\lvert\Delta\mathbf e_t\rvert$는 단위벡터 두 개가 $\Delta\theta$ 벌어진 이등변삼각형의 밑변 $2\sin(\Delta\theta/2)$, $\lim_{\Delta\theta\to0}2\sin(\Delta\theta/2)/\Delta\theta=1$. 방향은 $\Delta\theta\to0$에서 $\mathbf e_t$에 수직이며 휘는 쪽 → $\mathbf e_n$.
$d\theta/ds=1/\rho$(곡률의 정의), $ds/dt=v$. 따라서 $d\mathbf e_t/dt=(v/\rho)\mathbf e_n$이고 $\mathbf a=\dot v\mathbf e_t+(v^2/\rho)\mathbf e_n$.`,
        rubric: R`
- 곱 규칙 — 2점
- 연쇄법칙으로 세 인수 분해 — 3점
- 크기 1과 방향 $\mathbf e_n$ — 3점
- 결과 — 2점` },
      { sec: '11.14', type: 'open', lv: 2, proof: true, q: R`극좌표에서 $d\mathbf e_r/dt=\dot\theta\mathbf e_\theta$, $d\mathbf e_\theta/dt=-\dot\theta\mathbf e_r$을 보이고, 이를 이용해 가속도의 극좌표 성분을 유도하세요.`,
        sol: R`
직교 성분으로 $\mathbf e_r=(\cos\theta,\sin\theta)$, $\mathbf e_\theta=(-\sin\theta,\cos\theta)$. 시간 미분: $\dot{\mathbf e}_r=\dot\theta(-\sin\theta,\cos\theta)=\dot\theta\mathbf e_\theta$, $\dot{\mathbf e}_\theta=\dot\theta(-\cos\theta,-\sin\theta)=-\dot\theta\mathbf e_r$.
$\mathbf v=\frac{d}{dt}(r\mathbf e_r)=\dot r\mathbf e_r+r\dot\theta\mathbf e_\theta$.
$\mathbf a=\ddot r\mathbf e_r+\dot r\dot\theta\mathbf e_\theta+(\dot r\dot\theta+r\ddot\theta)\mathbf e_\theta+r\dot\theta(-\dot\theta\mathbf e_r)=(\ddot r-r\dot\theta^2)\mathbf e_r+(r\ddot\theta+2\dot r\dot\theta)\mathbf e_\theta$.`,
        rubric: R`
- 단위벡터의 도함수 — 4점
- 속도 — 2점
- 가속도 전개와 정리 — 4점` },
    ],
  });
})();
