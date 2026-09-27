/* 01 벡터와 직선 운동 — B&J 11.1–11.6, 수업 필기 3월 4일·9일 */
window.EM = window.EM || { chapters: [], exams: [] };
(function () {
  const R = String.raw;
  EM.chapters.push({
    n: 1, part: 'A', title: '벡터와 질점의 직선 운동', en: 'Vectors & Rectilinear Motion', ref: 'B&J 11.1–11.6 · 필기 3/4, 3/9', plot: 'dyRect',
    fig: R`삼차 다항식 위치 x(t)와 그 도함수인 속도, 가속도. 속도가 0인 곳에서 위치가 극값`,
    tagline: R`동역학은 “어디에 있는가”를 시간의 함수로 쓰는 데서 시작합니다. 위치를 한 번 미분하면 속도, 두 번 미분하면 가속도입니다.`,
    summary: R`질점의 운동은 위치 벡터 $\mathbf r(t)$로 기술하고, **속도** $\mathbf v=d\mathbf r/dt$, **가속도** $\mathbf a=d\mathbf v/dt$입니다. 직선 운동에서는 부호 있는 스칼라 $x,v,a$로 충분하며, 가속도가 시간·위치·속도 중 무엇의 함수로 주어지느냐에 따라 $dv=a\,dt$, $v\,dv=a\,dx$, $dt=dv/a$ 중 하나를 적분합니다. 가속도가 일정하면 세 공식 $v=v_0+at$, $x=x_0+v_0t+\tfrac12at^2$, $v^2=v_0^2+2a(x-x_0)$로 충분합니다. 여러 질점은 **상대 운동** $\mathbf r_B=\mathbf r_A+\mathbf r_{B/A}$로 잇고, 줄로 이어진 블록처럼 위치 사이에 구속이 있으면 **종속 운동**으로 속도와 가속도의 관계를 얻습니다. 속력(speed)은 속도의 크기이고, 이동 거리는 변위와 다릅니다.`,
    goals: [
      R`벡터의 크기, 단위벡터, 내적, 외적, 평면으로의 사영을 계산할 수 있다`,
      R`위치 함수에서 속도와 가속도를 구하고 이동 거리와 변위를 구분할 수 있다`,
      R`가속도가 $t$, $x$, $v$의 함수일 때 알맞은 적분으로 운동을 결정할 수 있다`,
      R`등가속도 운동의 세 공식을 유도하고 적용할 수 있다`,
      R`상대 위치·속도·가속도로 두 질점의 운동을 기술할 수 있다`,
      R`줄의 길이가 일정하다는 구속으로 종속 운동의 관계식을 세울 수 있다`,
    ],
    secTitles: { '11.1': '벡터 복습', '11.2': '위치·속도·가속도', '11.3': '운동의 결정', '11.5': '등가속도 운동', '11.6': '여러 질점의 운동' },
    sections: [
      { k: '11.1', p: 602, src: '수업 필기 · 3월 4일', title: '벡터 복습: 크기, 방향, 내적, 외적', body: R`
수업의 첫 시간은 벡터 복습이었습니다. 동역학의 양(위치, 속도, 힘)은 모두 **크기와 방향**을 가진 벡터이고, 역학에서는 여기에 **작용점**(시작점)이 중요할 때가 있습니다(3단원).

:::def 성분, 크기, 단위벡터
직교 좌표계의 단위벡터 $\mathbf i,\mathbf j,\mathbf k$로 $\mathbf P=P_x\mathbf i+P_y\mathbf j+P_z\mathbf k$라 쓰면
$$\lvert\mathbf P\rvert=\sqrt{P_x^2+P_y^2+P_z^2},\qquad\hat{\mathbf P}=\frac{\mathbf P}{\lvert\mathbf P\rvert}.$$
예: $\mathbf P=(4,3)$이면 $\lvert\mathbf P\rvert=5$, 방향 $(\tfrac45,\tfrac35)$.
:::

:::key 내적과 외적
$$\mathbf P\cdot\mathbf Q=P_xQ_x+P_yQ_y+P_zQ_z=\lvert\mathbf P\rvert\lvert\mathbf Q\rvert\cos\theta$$
$$\mathbf P\times\mathbf Q=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\P_x&P_y&P_z\\Q_x&Q_y&Q_z\end{vmatrix},\qquad\lvert\mathbf P\times\mathbf Q\rvert=\lvert\mathbf P\rvert\lvert\mathbf Q\rvert\sin\theta$$
외적의 방향은 오른손 법칙: $\mathbf i\times\mathbf j=\mathbf k$, $\mathbf j\times\mathbf k=\mathbf i$, $\mathbf k\times\mathbf i=\mathbf j$, 같은 벡터끼리는 0.
:::

:::key 평면으로의 사영
평면의 법선 $\mathbf n$에 대해
$$\mathbf P_{\text{normal}}=\frac{\mathbf P\cdot\mathbf n}{\mathbf n\cdot\mathbf n}\mathbf n,\qquad\mathbf P_{\text{proj}}=\mathbf P-\mathbf P_{\text{normal}}.$$
$\mathbf n$이 단위벡터면 분모는 1이다.
:::

:::ex 예제 1
$\mathbf P=(1,2,3)$을 법선 $\mathbf n=(0,0,2)$인 평면($xy$ 평면)에 사영하면?
---
$\mathbf P\cdot\mathbf n=6$, $\mathbf n\cdot\mathbf n=4$이므로 $\mathbf P_{\text{normal}}=\tfrac64(0,0,2)=(0,0,3)$, $\mathbf P_{\text{proj}}=(1,2,0)$. 법선이 단위벡터가 아닐 때 $\mathbf n\cdot\mathbf n$으로 나누는 것을 잊으면 $(0,0,12)$라는 틀린 답이 나옵니다.
:::
` },
      { k: '11.2', p: 603, src: '수업 필기 · 3월 4일, 9일', title: '위치, 속도, 가속도', body: R`
직선 위를 움직이는 질점의 위치를 $x(t)$라 합시다(원점에서 잰 부호 있는 거리).

:::key 속도와 가속도
$$v_{\text{avg}}=\frac{x(t+\Delta t)-x(t)}{\Delta t},\qquad v=\lim_{\Delta t\to0}\frac{\Delta x}{\Delta t}=\frac{dx}{dt},\qquad a=\frac{dv}{dt}=\frac{d^2x}{dt^2}$$
**속력**은 속도의 크기 $\lvert v\rvert$이다(“속도 제한”은 속력 제한).
:::

필기의 예: $x(t)=t^2$이면 $v=2t$, $a=2$. 벡터로 쓰면 $\mathbf x=t^2\mathbf i$, $\mathbf v=2t\mathbf i$, $\mathbf a=2\mathbf i$입니다.

:::ex 예제 2 — 변위와 이동 거리
$x(t)=t^3-6t^2+9t+2$ (m, s). 속도가 0인 시각, 가속도가 0인 시각, $0\le t\le2$ 동안의 이동 거리는?
---
$v=3t^2-12t+9=3(t-1)(t-3)$ → $t=1$, $3$ s. $a=6t-12$ → $t=2$ s.
$x(0)=2$, $x(1)=6$, $x(2)=4$. $t=1$에서 방향이 바뀌므로 이동 거리 $=\lvert6-2\rvert+\lvert4-6\rvert=6$ m, 변위는 $x(2)-x(0)=2$ m.
:::

:::warn 이동 거리는 속도의 부호가 바뀌는 곳에서 나눠 센다
$\int_0^2v\,dt$는 변위입니다. 이동 거리는 $\int\lvert v\rvert dt$라, 속도가 0이 되는 시각에서 구간을 나눠 더합니다.
:::
` },
      { k: '11.3', p: 607, title: '가속도에서 운동을 결정하기', body: R`
운동 방정식(3단원)이 주는 것은 보통 가속도입니다. 가속도가 무엇의 함수인지에 따라 적분 방법이 다릅니다.

:::key 가속도의 세 가지 형태
- $a=f(t)$: $v=v_0+\int_0^tf\,dt$, $x=x_0+\int_0^tv\,dt$.
- $a=f(x)$: $v\,dv=a\,dx$(연쇄법칙 $a=\frac{dv}{dt}=\frac{dv}{dx}\frac{dx}{dt}=v\frac{dv}{dx}$)에서 $\tfrac12v^2-\tfrac12v_0^2=\int_{x_0}^xf\,dx$.
- $a=f(v)$: $dt=\dfrac{dv}{f(v)}$ 또는 $dx=\dfrac{v\,dv}{f(v)}$.
:::

$a=v\,dv/dx$는 연쇄법칙[[@base:ch04:4.2|연쇄법칙. 합성함수의 미분은 각 단계의 미분의 곱입니다.]]의 한 예입니다. 수업에서는 같은 연쇄법칙이 신경망 학습의 역전파에서 “경로마다 편미분을 곱해 더하는” 형태로 쓰인다는 예도 보였습니다[[@dnn:ch09:9.2|계산 그래프와 연쇄법칙. 한 변수의 영향을 모든 경로에 대해 곱하고 더합니다.]].

:::ex 예제 3 — 속도에 비례하는 저항
물속에서 $a=-0.5v$ (s⁻¹)로 감속하는 보트가 $v_0=10$ m/s에서 엔진을 껐다. 속력이 1 m/s가 되는 시각과 멈출 때까지의 거리는?
---
$dv/v=-0.5\,dt$ → $v=10e^{-0.5t}$. $v=1$이면 $t=2\ln10=4.61$ s.
$dx=v\,dv/a=-2\,dv$ → $x=2(10-v)$. $v\to0$이면 20 m. 시간은 무한히 걸리지만 거리는 유한합니다.
:::

:::ex 예제 4 — 위치의 함수인 가속도
스프링에 달린 질점의 가속도가 $a=-9x$ (m/s², $x$ in m)이고 $x=0.2$ m에서 정지해 있었다. $x=0$을 지날 때의 속력은?
---
$\tfrac12v^2=\int_{0.2}^0(-9x)dx=\tfrac92(0.04)$ → $v=0.6$ m/s.
:::
` },
      { k: '11.5', p: 617, title: '등속·등가속도 직선 운동', body: R`
:::key 등가속도 운동의 세 공식
$$v=v_0+at,\qquad x=x_0+v_0t+\tfrac12at^2,\qquad v^2=v_0^2+2a(x-x_0)$$
$a=0$이면 등속 운동 $x=x_0+vt$.
:::

셋째 식은 앞 절의 $v\,dv=a\,dx$를 $a$ 일정으로 적분한 것이고, 시간을 모를 때 씁니다.

:::ex 예제 5 — 연직 투사
높이 5 m에서 공을 20 m/s로 위로 던졌다($g=9.81$ m/s²). 최고 높이와 땅에 닿는 시각은?
---
위를 양으로 $a=-9.81$. 최고점 $v=0$: $0=400-2(9.81)(y-5)$ → $y=25.4$ m.
땅: $0=5+20t-4.905t^2$ → $t=\dfrac{20+\sqrt{400+98.1}}{9.81}=4.31$ s.
:::
` },
      { k: '11.6', p: 618, src: '수업 필기 · 3월 9일', title: '여러 질점의 운동: 상대 운동과 종속 운동', body: R`
:::key 상대 운동 (병진하는 기준틀)
$$\mathbf r_B=\mathbf r_A+\mathbf r_{B/A},\qquad\mathbf v_B=\mathbf v_A+\mathbf v_{B/A},\qquad\mathbf a_B=\mathbf a_A+\mathbf a_{B/A}$$
$\mathbf r_{B/A}$는 $A$에서 본 $B$의 위치(“$A$에 대한 $B$”).
:::

필기의 예처럼 사람이 가만히 서서($\mathbf r_A$ 일정) 달리는 차를 보면 $\mathbf v_V=\mathbf v_{V/A}$ — 정지한 관찰자가 보는 상대 속도가 곧 절대 속도입니다.

:::ex 예제 6 — 교차로의 두 차
차 $A$는 교차로를 지나며 동쪽으로 15 m/s 등속, 같은 순간 차 $B$는 교차로 북쪽 40 m에서 정지 상태로부터 남쪽으로 2 m/s²로 출발한다. 3 s 뒤 $A$에 대한 $B$의 위치·속도·가속도는?
---
교차로를 원점, 동쪽 $\mathbf i$, 북쪽 $\mathbf j$. $\mathbf r_A=15t\,\mathbf i$, $\mathbf r_B=(40-t^2)\mathbf j$.
$\mathbf r_{B/A}=-15t\,\mathbf i+(40-t^2)\mathbf j=(-45,\,31)$ m, $\mathbf v_{B/A}=(-15,\,-6)$ m/s, $\mathbf a_{B/A}=(0,\,-2)$ m/s².
:::

:::fig dPulley
:::

:::key 종속 운동
줄의 길이가 일정하면 위치 좌표의 일차 결합이 일정하다. 예: $x_A+2x_B=$ 일정이면
$$v_A+2v_B=0,\qquad a_A+2a_B=0.$$
좌표의 개수에서 구속식의 개수를 뺀 것이 자유도다.
:::

:::ex 예제 7
위 그림에서 $A$가 0.3 m/s로 내려가면 $B$는?
---
$v_B=-v_A/2=-0.15$ m/s — 위로 0.15 m/s. 움직도르래는 줄 두 가닥이 받치므로 속도가 절반입니다.
:::

:::note 자유도
평면의 두 점은 좌표 넷이지만 서로 독립이면 자유도도 넷입니다. 줄 하나로 이으면 구속식이 하나 생겨 셋이 됩니다. 이 개념은 8단원의 일반화 좌표와 로봇공학의 그뤼블러 공식[[@robot:ch01:2.2a|자유도 = 좌표 수 − 독립인 구속 수.]]으로 이어집니다.
:::
` },
    ],
    problems: [
      { sec: '11.1', type: 'num', lv: 1, q: R`$\mathbf P=(2,-1,2)$, $\mathbf Q=(1,4,-3)$일 때 $\mathbf P\cdot\mathbf Q$는?`, ans: '-8', ansTex: R`-8`,
        sol: R`$2-4-6=-8$. 음수이므로 두 벡터 사이 각은 90°보다 큽니다.` },
      { sec: '11.1', type: 'num', lv: 1, q: R`$\mathbf P=(1,2,0)$, $\mathbf Q=(3,0,4)$일 때 $\mathbf P\times\mathbf Q$의 $z$ 성분은?`, ans: '-6', ansTex: R`-6`,
        sol: R`$(P\times Q)_z=P_xQ_y-P_yQ_x=1\cdot0-2\cdot3=-6$. 전체는 $(8,-4,-6)$.` },
      { sec: '11.1', type: 'num', lv: 2, q: R`$\mathbf P=(3,1,4)$를 법선 $\mathbf n=(1,1,0)$인 평면에 사영한 벡터의 $x$ 성분은?`, ans: '1', ansTex: R`1`,
        sol: R`$\mathbf P\cdot\mathbf n=4$, $\mathbf n\cdot\mathbf n=2$ → $\mathbf P_{\text{normal}}=(2,2,0)$, $\mathbf P_{\text{proj}}=(1,-1,4)$.` },
      { sec: '11.2', type: 'num', lv: 1, q: R`$x(t)=4t^3-2t$ (m, s)일 때 $t=2$ s의 가속도(m/s²)는?`, ans: '48', ansTex: R`48`,
        sol: R`$v=12t^2-2$, $a=24t=48$ m/s².` },
      { sec: '11.2', type: 'num', lv: 2, q: R`$x(t)=t^3-6t^2+9t+2$ (m, s)에서 $0\le t\le4$ 동안의 이동 거리(m)는?`, ans: '12', ansTex: R`12\ \text{m}`,
        sol: R`$x(0)=2$, $x(1)=6$, $x(3)=2$, $x(4)=6$. 방향 전환은 $t=1,3$. 거리 $4+4+4=12$ m.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`$a=-0.5v$ (s⁻¹)로 감속하는 보트가 $v_0=10$ m/s에서 출발했다. 속력이 절반이 될 때까지 간 거리(m)는?`, ans: '10', ansTex: R`10\ \text{m}`,
        sol: R`$x=2(v_0-v)=2(10-5)=10$ m.` },
      { sec: '11.3', type: 'num', lv: 2, q: R`$a=-4x$ (m/s²)인 질점이 $x=0$에서 $v=2$ m/s였다. 멈추는 위치(m)는?`, ans: '1', ansTex: R`1\ \text{m}`,
        sol: R`$\tfrac12v^2-\tfrac12(4)=-2x^2$ → $v=0$이면 $x^2=1$, $x=1$ m.` },
      { sec: '11.3', type: 'mc', lv: 1, q: R`가속도가 위치의 함수 $a=f(x)$로 주어졌을 때 가장 먼저 쓰는 관계는?`,
        choices: [R`$v=\int a\,dt$`, R`$v\,dv=a\,dx$`, R`$x=v_0t+\tfrac12at^2$`, R`$dt=dv/a$`], ans: 1,
        sol: R`시간을 모르므로 연쇄법칙 $a=v\,dv/dx$로 $t$를 없앱니다. 등가속도 공식은 $a$가 일정할 때만 씁니다.` },
      { sec: '11.5', type: 'num', lv: 1, q: R`정지에서 3 m/s²로 가속하는 차가 50 m를 간 순간의 속력(m/s)은?`, ans: 'sqrt(300)', ansTex: R`17.3\ \text{m/s}`,
        sol: R`$v^2=2(3)(50)=300$, $v=17.3$ m/s.` },
      { sec: '11.5', type: 'num', lv: 2, q: R`높이 5 m에서 20 m/s로 위로 던진 공이 땅에 닿는 시각(s)은? ($g=9.81$)`, ans: '(20+sqrt(400+98.1))/9.81', ansTex: R`4.31\ \text{s}`,
        sol: R`$4.905t^2-20t-5=0$의 양근: $t=(20+\sqrt{498.1})/9.81=4.31$ s.` },
      { sec: '11.6', type: 'num', lv: 2, q: R`예제 6의 두 차에서 $t=2$ s일 때 $A$와 $B$ 사이의 거리(m)는?`, ans: 'sqrt(30^2+36^2)', ansTex: R`46.9\ \text{m}`,
        sol: R`$\mathbf r_{B/A}=(-30,\ 36)$, 거리 $\sqrt{900+1296}=46.9$ m.` },
      { sec: '11.6', type: 'num', lv: 2, q: R`줄의 구속이 $2x_A+3x_B=$ 일정인 도르래 계에서 $A$가 아래로 0.6 m/s²로 가속한다. $B$의 가속도(m/s², 아래가 양)는?`, ans: '-0.4', ansTex: R`-0.4`,
        sol: R`$2a_A+3a_B=0$ → $a_B=-2(0.6)/3=-0.4$ — 위로 0.4 m/s².` },
      { sec: '11.6', type: 'mc', lv: 2, q: R`평면 위의 질점 $A$, $B$를 길이가 일정한 막대로 이었다. 이 계의 자유도는?`,
        choices: [R`4`, R`3`, R`2`, R`1`], ans: 1,
        sol: R`좌표 $(x_A,y_A,x_B,y_B)$ 넷에 구속 $\lvert\mathbf r_B-\mathbf r_A\rvert=\ell$ 하나: $4-1=3$.` },
      { sec: '11.3', type: 'open', lv: 2, proof: true, q: R`가속도가 위치의 함수 $a=f(x)$일 때 $\tfrac12v^2-\tfrac12v_0^2=\int_{x_0}^xf(s)\,ds$가 성립함을 연쇄법칙으로 보이고, 등가속도에서 $v^2=v_0^2+2a(x-x_0)$가 됨을 유도하세요.`,
        sol: R`
$v=dx/dt$이고 $v$를 $x$의 함수로 볼 수 있는 구간(운동 방향이 바뀌지 않는 구간)에서 연쇄법칙으로 $a=\dfrac{dv}{dt}=\dfrac{dv}{dx}\dfrac{dx}{dt}=v\dfrac{dv}{dx}$.
따라서 $v\,dv=f(x)\,dx$. 양변을 $x_0$에서 $x$까지 적분: $\tfrac12v^2-\tfrac12v_0^2=\int_{x_0}^xf(s)ds$.
$f\equiv a$ 상수면 우변이 $a(x-x_0)$이므로 $v^2=v_0^2+2a(x-x_0)$.
(이 식은 5단원의 일-에너지 정리 $\int F\,dx=\Delta(\tfrac12mv^2)$의 1차원 판입니다.)`,
        rubric: R`
- 연쇄법칙으로 $a=v\,dv/dx$ — 4점
- 변수분리와 적분 — 4점
- 등가속도 특수화 — 2점` },
      { sec: '11.6', type: 'open', lv: 2, proof: true, q: R`예제의 도르래 계(그림)에서 줄의 길이가 일정하다는 사실로 $v_A=-2v_B$, $a_A=-2a_B$를 유도하세요. 좌표의 원점과 방향을 명시하세요.`,
        sol: R`
천장(고정 도르래 축 높이)을 원점으로 아래를 양으로 $x_A$, $x_B$(움직도르래 축)를 잽니다.
줄의 길이 = ($A$까지의 수직 가닥 $x_A$) + (움직도르래 양쪽의 두 가닥 $2x_B$) + (도르래에 감긴 부분과 고정 길이 $C$). 줄이 늘지 않으므로 $x_A+2x_B+C=\ell$.
시간으로 미분: $\dot x_A+2\dot x_B=0$, 곧 $v_A=-2v_B$. 한 번 더: $a_A=-2a_B$.
(도르래 반지름이 일정하므로 감긴 길이는 상수입니다.)`,
        rubric: R`
- 좌표 정의 — 2점
- 길이 식 — 4점
- 미분으로 두 관계 — 4점` },
    ],
  });
})();
