/* 개념 정리 — 09 벡터 적분과 적분 정리 (Kreyszig 10판 10장, §10.1–10.9). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 9,
    summary: R`곡선 위의 적분(선적분), 곡면 위의 적분(면적분), 그리고 이것들을 영역 내부의 적분과 잇는 세 정리, **그린·가우스(발산)·스토크스 정리**를 다룹니다. 세 정리는 모두 “경계에서의 적분 = 내부에서의 미분의 적분”이라는 한 가지 아이디어이고, 유체·열·전자기학의 기본 방정식이 여기서 나옵니다. 어떤 정리를 써야 계산이 가장 짧아지는지 고르는 것이 시험의 핵심입니다.`,
    goals: [
      R`매개변수화로 선적분을 계산하고 방향의 효과를 설명할 수 있다`,
      R`경로 독립을 판정하고 퍼텐셜로 선적분을 끝낼 수 있다`,
      R`극좌표·야코비안으로 이중적분의 변수를 바꿀 수 있다`,
      R`그린 정리로 선적분과 넓이를 계산할 수 있다`,
      R`곡면을 매개변수화하고 법선벡터와 면적분(유량)을 계산할 수 있다`,
      R`발산 정리와 스토크스 정리를 방향에 맞게 적용할 수 있다`,
      R`그린 항등식과 라플라스 방정식의 해의 유일성을 설명할 수 있다`,
    ],
    sections: [
      { k: '10.1', p: '413', title: '선적분', body: R`
벡터 적분은 보통의 정적분 $\int_a^bf(x)\,dx$를 넓힌 것입니다. 정적분은 $x$축 위의 구간을 따라 적분하지만, **선적분**은 공간이나 평면의 곡선을 따라 적분합니다(“곡선 적분”이 더 정확한 이름이지만 선적분이 표준 용어입니다). 곡면 위의 **면적분**(§10.6), 입체 위의 **삼중적분**(§10.7)이 뒤따르고, 이 장의 아름다움은 이 적분들을 서로 바꿀 수 있다는 데 있습니다.

**적분 경로.** 곡선 $C$를 매개변수 표현 $\mathbf r(t)=[x(t),y(t),z(t)]$, $a\le t\le b$로 나타냅니다[[ch08:9.5|곡선의 매개변수 표현.]]. $A=\mathbf r(a)$가 시작점, $B=\mathbf r(b)$가 끝점이고, $t$가 증가하는 방향이 $C$의 **양의 방향**입니다. $A=B$이면 **닫힌 경로**라 합니다. 각 점에서 유일한 접선을 가지고 그 방향이 연속적으로 변하면(곧 $\mathbf r'$이 연속이고 $\ne\mathbf 0$) **매끄러운** 곡선입니다. 이 장의 모든 적분 경로는 **조각마다 매끄럽다**(매끄러운 곡선 유한 개로 이루어짐)고 가정합니다. 정사각형의 경계가 그 예입니다.

:::key 선적분
$$\int_C\mathbf F\cdot d\mathbf r=\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt,\qquad \int_C f\,ds=\int_a^b f(\mathbf r(t))\,|\mathbf r'(t)|\,dt$$
:::

$d\mathbf r=[dx,dy,dz]$로 쓰면 성분 형태는
$$\int_C\mathbf F\cdot d\mathbf r=\int_C(F_1\,dx+F_2\,dy+F_3\,dz)=\int_a^b(F_1x'+F_2y'+F_3z')\,dt$$
닫힌 경로이면 $\oint_C$로도 씁니다. 피적분함수 $\mathbf F\cdot\mathbf r'$는 **스칼라**이고, $\mathbf F\cdot\mathbf r'/|\mathbf r'|$는 $\mathbf F$의 **접선 성분**입니다. 오른쪽은 $t$축 위의 보통 정적분이므로 $\mathbf F$가 연속이고 $C$가 조각마다 매끄러우면 존재합니다.

:::ex 예제 1 (평면의 선적분)
$\mathbf F=[y^2,\ -x]$를 원 $x^2+y^2=1$의 제1사분면 호를 따라 $(1,0)$에서 $(0,1)$까지 적분하세요.
---
$\mathbf r(t)=[\cos t,\ \sin t]$, $0\le t\le\pi/2$. $\mathbf F(\mathbf r(t))=[\sin^2t,\ -\cos t]$, $\mathbf r'(t)=[-\sin t,\ \cos t]$.
$$\int_C\mathbf F\cdot d\mathbf r=\int_0^{\pi/2}\big(-\sin^3t-\cos^2t\big)\,dt=-\frac23-\frac\pi4\approx-1.4521$$
($\int_0^{\pi/2}\sin^3t\,dt=\int_0^1(1-u^2)\,du=\frac23$, $u=\cos t$.) 음수이므로 이 경로에서 $\mathbf F$는 대체로 운동을 거스릅니다.
:::

:::ex 예제 2 (공간의 선적분)
$\mathbf F=[-y,\ x,\ z]$를 나선 $\mathbf r(t)=[\cos t,\ \sin t,\ 2t]$, $0\le t\le2\pi$를 따라 적분하세요.
---
$\mathbf F(\mathbf r(t))=[-\sin t,\ \cos t,\ 2t]$, $\mathbf r'=[-\sin t,\ \cos t,\ 2]$이므로 내적은 $\sin^2t+\cos^2t+4t=1+4t$.
$$\int_0^{2\pi}(1+4t)\,dt=2\pi+8\pi^2\approx85.24$$
평면과 계산 방법이 똑같습니다.
:::

:::ex 예제 3 (꼬인 삼차곡선)
$\mathbf F=(xy,\ z,\ x)$, $C:\mathbf r=(t,t^2,t^3)$, $0\le t\le1$
---
$\mathbf F(\mathbf r)=(t^3,t^3,t)$, $\mathbf r'=(1,2t,3t^2)$. 내적 $t^3+2t^4+3t^3=4t^3+2t^4$.
$$\int_0^1(4t^3+2t^4)\,dt=1+\tfrac25=\tfrac75$$
:::

### 성질과 매개변수에 대한 무관성

정적분의 성질에서 바로
$$\int_Ck\mathbf F\cdot d\mathbf r=k\int_C\mathbf F\cdot d\mathbf r,\qquad\int_C(\mathbf F+\mathbf G)\cdot d\mathbf r=\int_C\mathbf F\cdot d\mathbf r+\int_C\mathbf G\cdot d\mathbf r,\qquad\int_C=\int_{C_1}+\int_{C_2}$$
이 성립합니다($C$를 같은 방향의 두 호 $C_1$, $C_2$로 나눈 경우). **적분 방향을 거꾸로 하면 값에 $-1$이 곱해집니다.** 반면 방향만 유지하면 매개변수를 어떻게 잡든 상관없습니다.

:::thm 방향을 보존하는 매개변수 변환 (교재 §10.1 Theorem 1)
$C$에 같은 양의 방향을 주는 표현들은 선적분의 값도 같게 줍니다.
:::

**증명.** $t=\phi(t^*)$가 $a^*\le t^*\le b^*$를 $a\le t\le b$로 보내고 $\frac{dt}{dt^*}>0$이라 하고 $\mathbf r^*(t^*)=\mathbf r(\phi(t^*))$로 둡니다. 연쇄법칙 $\frac{d\mathbf r^*}{dt^*}=\frac{d\mathbf r}{dt}\frac{dt}{dt^*}$와 치환적분에서
$$\int_{a^*}^{b^*}\mathbf F(\mathbf r^*)\cdot\frac{d\mathbf r^*}{dt^*}dt^*=\int_{a^*}^{b^*}\mathbf F(\mathbf r(\phi))\cdot\frac{d\mathbf r}{dt}\frac{dt}{dt^*}dt^*=\int_a^b\mathbf F(\mathbf r(t))\cdot\frac{d\mathbf r}{dt}dt$$
그래서 가장 계산하기 편한 매개변수화를 고르면 됩니다.

### 동기: 변하는 힘이 한 일

일정한 힘이 직선 변위 $\mathbf d$에서 한 일은 $\mathbf F\cdot\mathbf d$였습니다(§9.2). 변하는 힘이 곡선을 따라 한 일은 곡선을 작은 현들로 나눠 각 현에서의 일 $\Delta W_m=\mathbf F(\mathbf r(t_m))\cdot[\mathbf r(t_{m+1})-\mathbf r(t_m)]\approx\mathbf F(\mathbf r(t_m))\cdot\mathbf r'(t_m)\Delta t_m$을 더하고, 가장 긴 $\Delta t_m$을 0으로 보낸 극한으로 정의합니다. 이 극한이 바로 위의 선적분이므로 선적분을 **일 적분**이라고도 합니다.

:::ex 예제 4 (일 = 운동에너지의 증가)
$t$가 시간이고 $\mathbf F$가 질량 $m$인 물체에 작용하는 (알짜) 힘이면, 곡선을 따라 한 일이 운동에너지의 증가와 같음을 보이세요.
---
$\frac{d\mathbf r}{dt}=\mathbf v$이므로 $W=\int_a^b\mathbf F\cdot\mathbf v\,dt$. 뉴턴 법칙 $\mathbf F=m\mathbf v'$과 $(\mathbf v\cdot\mathbf v)'=2\mathbf v'\cdot\mathbf v$에서
$$W=\int_a^bm\mathbf v'\cdot\mathbf v\,dt=\int_a^bm\Big(\frac{\mathbf v\cdot\mathbf v}2\Big)'dt=\frac m2|\mathbf v|^2\Big|_{t=a}^{t=b}$$
$\frac m2|\mathbf v|^2$이 운동에너지이므로 **한 일 = 운동에너지의 증가**, 역학의 기본 법칙입니다.
:::

### 다른 꼴의 선적분

$\mathbf F=F_1\mathbf i$ 등으로 두면 $\int_CF_1\,dx$, $\int_CF_2\,dy$, $\int_CF_3\,dz$가 특수한 경우로 나옵니다. 내적을 하지 않고 $\int_C\mathbf F(\mathbf r(t))\,dt$처럼 성분마다 적분해 **벡터값**을 얻는 선적분도 있습니다. 공학에서 자주 쓰는 것은 **호의 길이에 대한 선적분** $\int_Cf\,ds=\int_a^bf(\mathbf r(t))|\mathbf r'(t)|\,dt$로, 곡선 모양 철사의 질량, 무게중심 등을 줍니다. 이것은 $ds>0$이라 **방향과 무관**합니다.

:::ex 예제 5 (철사의 질량)
반원 $\mathbf r(t)=[2\cos t,\ 2\sin t]$, $0\le t\le\pi$ 모양의 철사의 선밀도가 $\delta=y$일 때 질량은?
---
$|\mathbf r'|=2$이므로 $M=\int_0^\pi(2\sin t)(2)\,dt=4[-\cos t]_0^\pi=8$.
:::

### 경로 의존성

:::thm 경로 의존성 (교재 §10.1 Theorem 2)
선적분의 값은 일반적으로 $\mathbf F$와 끝점 $A$, $B$뿐 아니라 **경로 자체**에도 의존합니다.
:::

:::ex 예제 6 (경로에 따라 달라짐)
$\mathbf F=(y,\,-x)$를 $(0,0)$에서 $(1,1)$까지 (a) 직선 $y=x$, (b) 포물선 $y=x^2$을 따라 적분하세요.
---
(a) $\mathbf r=(t,t)$: $(t,-t)\cdot(1,1)=0$, 적분 0.
(b) $\mathbf r=(t,t^2)$: $(t^2,-t)\cdot(1,2t)=-t^2$, 적분 $-\frac13$.
끝점이 같아도 값이 다릅니다. 반례 하나로 Theorem 2가 증명되는 셈입니다. 다음 절이 “언제 경로와 무관한가”입니다.
:::

:::fig f09paths
:::

복소 선적분 $\int_Cf(z)\,dz$는 이런 실수 선적분 두 개를 묶은 것입니다[[ch13:14.1|복소 선적분.]].
` },
      { k: '10.2', p: '419', title: '선적분의 경로 독립', body: R`
영역 $D$ 안의 모든 두 점 $A$, $B$에 대해 $A$에서 $B$로 가는 $D$ 안의 모든 경로에서 선적분 $\int_C(F_1dx+F_2dy+F_3dz)$가 같은 값을 가지면, 선적분이 $D$에서 **경로에 독립**이라 합니다.

경로 독립은 물리적으로 중요합니다. 산꼭대기까지 짧고 가파른 길로 가든 길고 완만한 길로 가든 중력에 맞서 하는 일은 같고, 늘린 용수철을 놓으면 늘릴 때 한 일을 그대로 돌려받습니다. 모든 힘이 그렇지는 않습니다. 소용돌이치는 큰 원형 수영장에서 헤엄치는 경우를 생각해 보세요. 경로 독립은 다음 세 가지와 동치임을 보입니다.
- (Theorem 1) $\mathbf F=\operatorname{grad}f$
- (Theorem 2) $D$ 안의 모든 닫힌 경로에서 적분이 0
- (Theorem 3) $\operatorname{curl}\mathbf F=\mathbf 0$ (단, $D$가 단순연결일 때)

:::key 경로 독립
$$\mathbf F=\nabla f\ \Rightarrow\ \int_A^B\mathbf F\cdot d\mathbf r=f(B)-f(A)$$
$$\text{단순연결 영역에서}\quad \operatorname{curl}\mathbf F=\mathbf 0\iff\mathbf F=\nabla f\iff\oint_C\mathbf F\cdot d\mathbf r=0$$
:::

:::thm 경로 독립과 기울기 (교재 §10.2 Theorem 1)
연속인 $F_1,F_2,F_3$에 대한 선적분이 영역 $D$에서 경로에 독립일 필요충분조건은 $\mathbf F$가 $D$에서 어떤 함수 $f$의 기울기인 것, 곧 $F_1=\frac{\partial f}{\partial x}$, $F_2=\frac{\partial f}{\partial y}$, $F_3=\frac{\partial f}{\partial z}$인 것입니다.
:::

**증명(충분조건).** $\mathbf F=\nabla f$이고 $C:\mathbf r(t)$가 $A$에서 $B$로 가는 경로이면, 연쇄법칙에서
$$\int_C(F_1dx+F_2dy+F_3dz)=\int_a^b\Big(\frac{\partial f}{\partial x}\frac{dx}{dt}+\frac{\partial f}{\partial y}\frac{dy}{dt}+\frac{\partial f}{\partial z}\frac{dz}{dt}\Big)dt=\int_a^b\frac{df}{dt}dt=f(B)-f(A)$$
경로와 무관한 값입니다. (역, 곧 경로 독립이면 퍼텐셜이 있다는 것은 $f(P)=\int_{A}^{P}\mathbf F\cdot d\mathbf r$로 정의해 보이는데, 교재 부록에 있습니다.)

결과 $\int_A^B\mathbf F\cdot d\mathbf r=f(B)-f(A)$는 미적분학의 기본정리 $\int_a^bg\,dx=G(b)-G(a)$의 벡터판이고, 선적분이 경로에 독립이면 언제나 이 식으로 계산합니다[[ch08:9.7|기울기와 퍼텐셜.]]. 다시 말해 **선적분이 경로에 독립 ⟺ $\mathbf F$가 퍼텐셜을 가짐**입니다.

:::ex 예제 1 (퍼텐셜이 보이는 경우)
$\int_C(2x\,dx+4y\,dy+6z\,dz)$가 경로에 독립임을 보이고 $(0,0,0)$에서 $(1,1,2)$까지의 값을 구하세요.
---
$\mathbf F=[2x,4y,6z]=\nabla f$, $f=x^2+2y^2+3z^2$. 따라서 값은 $f(1,1,2)-f(0,0,0)=1+2+12=15$.
검산(가장 편한 경로 $\mathbf r=[t,t,2t]$): $\mathbf F\cdot\mathbf r'=2t+4t+24t=30t$, $\int_0^130t\,dt=15$ ✓.
:::

:::ex 예제 2 (퍼텐셜 구하기)
$\displaystyle\int_C\big[(2xy+z^2)dx+x^2dy+2xz\,dz\big]$, $C$: $(0,0,0)$에서 $(1,2,3)$까지 임의의 경로
---
$f_x=2xy+z^2$을 $x$로 적분하면 $f=x^2y+xz^2+g(y,z)$. $f_y=x^2+g_y=x^2$에서 $g_y=0$, $f_z=2xz+g_z=2xz$에서 $g_z=0$이므로 $g$는 상수(0으로 둠).
$$\int_C=f(1,2,3)-f(0,0,0)=2+9=11$$
퍼텐셜이 실제로 존재한다는 것은 아래 Theorem 3의 회전 판정으로 미리 확인할 수 있습니다: $\operatorname{curl}\mathbf F=(0-0,\ 2z-2z,\ 2x-2x)=\mathbf 0$.
:::

### 닫힌 경로와 경로 독립

:::thm 닫힌 경로 (교재 §10.2 Theorem 2)
선적분이 $D$에서 경로에 독립일 필요충분조건은 $D$ 안의 모든 닫힌 경로에서 적분값이 0인 것입니다.
:::

**증명.** $A$에서 $B$로 가는 두 경로 $C_1$, $C_2$는 합쳐서($C_1$을 따라간 뒤 $C_2$를 거꾸로 돌아옴) 닫힌 경로 $C$가 됩니다. 거꾸로 가면 부호가 바뀌므로 $\oint_C=\int_{C_1}-\int_{C_2}$. 따라서 $\oint_C=0$과 $\int_{C_1}=\int_{C_2}$가 같은 말입니다.

**보존계와 비보존계.** 역학에서 이 정리는 “힘이 한 일이 경로에 독립 ⟺ 모든 왕복에서 한 일이 0”을 뜻합니다. 이때 힘(과 그 장)을 **보존적**이라 합니다. 보존력장에서는 역학적 에너지가 보존되어, 한 바퀴 돌아 제자리로 오면 처음과 같은 운동에너지를 가집니다(공기 저항을 무시하면 위로 던진 공이 같은 속력으로 손에 돌아옴). 마찰, 공기·물의 저항은 늘 운동을 거스르며 역학적 에너지를 열 등으로 바꾸므로, 이런 힘이 무시할 수 없으면 계는 **비보존적(소산적)**입니다.

### 미분형식의 완전성

피적분식 $\mathbf F\cdot d\mathbf r=F_1dx+F_2dy+F_3dz$를 **미분형식**이라 하고, 어떤 미분가능한 $f$의 전미분
$$df=\frac{\partial f}{\partial x}dx+\frac{\partial f}{\partial y}dy+\frac{\partial f}{\partial z}dz=(\nabla f)\cdot d\mathbf r$$
와 같으면 **완전**하다고 합니다. 비교하면 완전 ⟺ $\mathbf F=\nabla f$이므로, Theorem 1은 “선적분이 경로에 독립 ⟺ 계수가 연속인 미분형식이 완전”(교재 Theorem 3*)으로 바꿔 말할 수 있습니다. 실용적인 판정법을 위해 개념 하나가 필요합니다.

:::def 단순연결
영역 $D$ 안의 모든 닫힌 곡선을 $D$를 벗어나지 않고 연속적으로 한 점까지 줄일 수 있으면 $D$를 **단순연결**이라 합니다.
:::

구나 정육면체의 내부, 거기서 점을 유한 개 뺀 것, 두 동심구 사이의 영역은 단순연결입니다. 원환체(도넛)의 내부나 공간 대각선 하나를 뺀 정육면체 내부는 단순연결이 아닙니다(그 선을 감는 곡선을 줄일 수 없음). 평면에서는 구멍이 있는 영역이 단순연결이 아닙니다.

:::thm 완전성과 경로 독립의 판정 (교재 §10.2 Theorem 3)
$F_1,F_2,F_3$가 영역 $D$에서 연속인 1계 편도함수를 가진다고 하자.
(a) 미분형식이 $D$에서 완전하면(따라서 경로 독립이면) $D$에서 $\operatorname{curl}\mathbf F=\mathbf 0$, 곧
$$\frac{\partial F_3}{\partial y}=\frac{\partial F_2}{\partial z},\qquad\frac{\partial F_1}{\partial z}=\frac{\partial F_3}{\partial x},\qquad\frac{\partial F_2}{\partial x}=\frac{\partial F_1}{\partial y}$$
(b) $D$에서 $\operatorname{curl}\mathbf F=\mathbf 0$이고 **$D$가 단순연결이면** 미분형식은 완전하고 선적분은 경로에 독립입니다.
:::

(a)는 $\mathbf F=\nabla f$이면 $\operatorname{curl}(\nabla f)=\mathbf 0$ (§9.9)이기 때문입니다. (b)의 증명에는 스토크스 정리가 필요하므로 §10.9에서 합니다. 평면의 $\int_C(F_1dx+F_2dy)$에서는 회전의 $z$성분만 남아 조건이
$$\frac{\partial F_2}{\partial x}=\frac{\partial F_1}{\partial y}$$
하나가 됩니다. 1계 완전미분방정식의 조건 $M_y=N_x$와 같은 식입니다[[ch01:1.4|완전미분방정식.]].

:::ex 예제 3 (완전성 판정과 퍼텐셜)
$\displaystyle I=\int_C\big[(y\cos xy+2x)\,dx+x\cos xy\,dy+3z^2\,dz\big]$가 경로에 독립임을 보이고, $(0,0,0)$에서 $(1,\frac\pi2,1)$까지의 값을 구하세요.
---
**판정.** $(F_2)_x=\cos xy-xy\sin xy=(F_1)_y$, 그리고 $F_3=3z^2$은 $x,y$와 무관하고 $F_1,F_2$는 $z$와 무관하므로 나머지 두 조건도 성립합니다. 전 공간은 단순연결이므로 경로에 독립입니다.
**퍼텐셜.** 가장 간단해 보이는 $F_2$를 $y$로 적분하면 $f=\sin xy+g(x,z)$. $f_x=y\cos xy+g_x=F_1$에서 $g_x=2x$, $g=x^2+h(z)$. $f_z=h'=3z^2$에서 $h=z^3$. 따라서 $f=\sin xy+x^2+z^3$이고
$$I=f\big(1,\tfrac\pi2,1\big)-f(0,0,0)=1+1+1=3$$
:::

:::warn 단순연결 조건
$\mathbf F=\Big(\dfrac{-y}{x^2+y^2},\dfrac{x}{x^2+y^2}\Big)$는 원점 밖에서 회전이 0이지만 원점을 도는 원 위의 적분은 $2\pi$입니다. 원점에 구멍이 있어 영역이 단순연결이 아니기 때문입니다. 이것은 복소적분 $\oint\frac{dz}z=2\pi i$의 허수부와 같은 계산입니다[[ch13:14.2|코시 적분 정리와 단순연결 영역.]].
:::

**계산.** $(F_2)_x=\frac{(x^2+y^2)-2x^2}{(x^2+y^2)^2}=\frac{y^2-x^2}{(x^2+y^2)^2}=(F_1)_y$이므로 원점을 뺀 모든 곳에서 회전이 0입니다. 그러나 단위원 $x=\cos\theta$, $y=\sin\theta$에서 $-y\,dx+x\,dy=(\sin^2\theta+\cos^2\theta)d\theta=d\theta$이므로 $\oint=\int_0^{2\pi}d\theta=2\pi\ne0$. Theorem 3을 쓸 수 없는 영역(원점을 둘러싼 고리 모양 영역)이라 모순이 아닙니다. 사실 $\mathbf F=\nabla\theta$ ($\theta=\arctan\frac yx$, 극각)처럼 보이지만, 극각은 한 바퀴 돌면 $2\pi$만큼 늘어나 **한 값으로 정해지는 함수가 아니므로** Theorem 1도 쓸 수 없습니다.

물리에서 기울기장은 **보존력**(에너지 보존)이고, 유체에서 비회전 흐름의 속도 퍼텐셜이 이것입니다[[ch16:18.4|비회전 흐름과 속도 퍼텐셜.]].
` },
      { k: '10.3', p: '426', title: '이중적분 복습 (선택)', body: R`
정적분이 $x$축의 구간 위에서 적분하듯, **이중적분**은 $xy$ 평면의 닫힌 유계 영역 $R$ 위에서 $f(x,y)$를 적분합니다. $R$을 축에 평행한 직선들로 잘게 나누고, $R$ 안에 완전히 들어가는 직사각형들(넓이 $\Delta A_k$)에서 한 점 $(x_k,y_k)$씩을 골라 합 $J_n=\sum f(x_k,y_k)\Delta A_k$를 만든 뒤, 직사각형의 최대 대각선이 0으로 가도록 $n$을 늘립니다. $f$가 연속이고 $R$의 경계가 매끄러운 곡선 유한 개이면 이 극한은 분할 방법과 무관하게 존재하고, 그것이 $\iint_Rf(x,y)\,dx\,dy$ (또는 $\iint_Rf\,dA$)입니다.

**성질.** 선형성 $\iint(kf+g)=k\iint f+\iint g$, 영역의 분할 $\iint_R=\iint_{R_1}+\iint_{R_2}$, 그리고 $R$이 단순연결이면 **평균값 정리** $\iint_Rf\,dA=f(x_0,y_0)\cdot A$ (어떤 $(x_0,y_0)\in R$, $A$: $R$의 넓이)가 성립합니다.

### 반복적분으로 계산

$R$이 $a\le x\le b$, $g(x)\le y\le h(x)$로 쓰이면 $x$를 고정하고 $y$로 먼저 적분합니다:
$$\iint_Rf(x,y)\,dx\,dy=\int_a^b\Big[\int_{g(x)}^{h(x)}f(x,y)\,dy\Big]dx$$
$c\le y\le d$, $p(y)\le x\le q(y)$로 쓰이면 순서를 바꿔 $\int_c^d\big[\int_{p(y)}^{q(y)}f\,dx\big]dy$. 어느 쪽으로도 쓰이지 않는 영역은 그런 조각들로 나눠 더합니다.

**응용.** 넓이 $A=\iint_Rdx\,dy$, 곡면 $z=f(x,y)\ge0$ 아래의 부피 $V=\iint_Rf\,dx\,dy$, 밀도 $f$인 판의 질량 $M=\iint_Rf\,dA$, 무게중심 $\bar x=\frac1M\iint_Rxf\,dA$, $\bar y=\frac1M\iint_Ryf\,dA$, 관성모멘트 $I_x=\iint_Ry^2f\,dA$, $I_y=\iint_Rx^2f\,dA$, 극관성모멘트 $I_0=I_x+I_y$.

:::ex 예제 1 (삼각형 판)
밀도 1인 삼각형 판 $0\le y\le x\le1$의 질량, 무게중심, 관성모멘트는?
---
$y$로 먼저 적분합니다($0\le y\le x$).
$M=\int_0^1x\,dx=\frac12$. $\iint x\,dA=\int_0^1x\cdot x\,dx=\frac13$이므로 $\bar x=\frac23$. $\iint y\,dA=\int_0^1\frac{x^2}2dx=\frac16$이므로 $\bar y=\frac13$ (꼭짓점 좌표의 평균 $\big(\frac{0+1+1}3,\frac{0+0+1}3\big)$과 일치 ✓).
$I_x=\int_0^1\frac{x^3}3dx=\frac1{12}$, $I_y=\int_0^1x^2\cdot x\,dx=\frac14$, $I_0=\frac13$.
:::

### 변수변환과 야코비안

정적분의 치환 $\int_a^bf(x)\,dx=\int_\alpha^\beta f(x(u))\frac{dx}{du}du$에 해당하는 이중적분의 공식은
$$\iint_Rf(x,y)\,dx\,dy=\iint_{R^*}f\big(x(u,v),y(u,v)\big)\Big|\frac{\partial(x,y)}{\partial(u,v)}\Big|\,du\,dv$$
입니다. $dx\,dy$를 $du\,dv$ 곱하기 **야코비안**
$$J=\frac{\partial(x,y)}{\partial(u,v)}=\begin{vmatrix}\dfrac{\partial x}{\partial u}&\dfrac{\partial x}{\partial v}\\[2mm]\dfrac{\partial y}{\partial u}&\dfrac{\partial y}{\partial v}\end{vmatrix}$$
의 **절댓값**으로 바꿉니다. 변환은 연속인 편도함수를 가지고, $R^*$와 $R$ 사이의 일대일 대응이며, $J$가 $R^*$ 전체에서 한 부호여야 합니다.

**왜 야코비안인가.** $uv$ 평면의 작은 직사각형(변 $du$, $dv$)은 $xy$ 평면에서 두 변 벡터가 $\mathbf r_u\,du=[x_u,y_u]du$, $\mathbf r_v\,dv=[x_v,y_v]dv$인 작은 평행사변형으로 옮겨지고, 그 넓이는 2×2 행렬식의 절댓값 $|J|\,du\,dv$입니다[[ch06:7.7|행렬식과 넓이.]][[@base:ch04:4.2|연쇄법칙과 야코비 행렬: 극좌표의 넓이 요소 $r\,dr\,d\theta$.]].

:::key 이중적분의 변수변환
$$\iint_Rf(x,y)\,dx\,dy=\iint_{R^*}f\big(x(u,v),y(u,v)\big)\,\Big|\frac{\partial(x,y)}{\partial(u,v)}\Big|\,du\,dv,\qquad \frac{\partial(x,y)}{\partial(u,v)}=\begin{vmatrix}x_u&x_v\\y_u&y_v\end{vmatrix}$$
$$\text{극좌표: } dx\,dy=r\,dr\,d\theta$$
:::

**극좌표.** $x=r\cos\theta$, $y=r\sin\theta$이면 $J=\begin{vmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{vmatrix}=r$이므로
$$\iint_Rf(x,y)\,dx\,dy=\iint_{R^*}f(r\cos\theta,r\sin\theta)\,r\,dr\,d\theta$$

:::fig f09jac
:::

:::ex 예제 2 (극좌표)
반지름 2인 원판에서 $\iint(x^2+y^2)\,dA$
---
$\int_0^{2\pi}\!\int_0^2r^2\cdot r\,dr\,d\theta=2\pi\cdot\frac{2^4}4=8\pi$.
:::

:::ex 예제 3 (선형 변환)
$R:|x|+|y|\le1$에서 $\iint(x+y)^2\,dA$
---
$u=x+y$, $v=x-y$로 두면 $R$은 정사각형 $-1\le u,v\le1$. $x=\frac{u+v}2$, $y=\frac{u-v}2$에서 $\Big|\frac{\partial(x,y)}{\partial(u,v)}\Big|=\Big|{-\tfrac14-\tfrac14}\Big|=\tfrac12$.
$$\int_{-1}^1\!\int_{-1}^1u^2\cdot\tfrac12\,du\,dv=\tfrac12\cdot\tfrac23\cdot2=\tfrac23$$
영역의 모양이 변환을 알려 줍니다: 경계선 $x\pm y=\pm1$이 새 좌표선이 되도록 잡았습니다.
:::

:::ex 예제 4 (가우스 적분)
$I=\int_{-\infty}^\infty e^{-x^2}dx$를 이중적분으로 구하세요.
---
$I^2=\int e^{-x^2}dx\int e^{-y^2}dy=\iint_{\mathbb R^2}e^{-(x^2+y^2)}dx\,dy$를 극좌표로 바꾸면
$$I^2=\int_0^{2\pi}\!\int_0^\infty e^{-r^2}r\,dr\,d\theta=2\pi\cdot\frac12=\pi,\qquad I=\sqrt\pi$$
한 변수로는 원시함수를 쓸 수 없는 적분이, 차원을 올리면 야코비안 $r$ 덕분에 풀립니다. 정규분포와 오차함수의 기초입니다[[@base:ch02:2.3|가우스 적분.]].
:::
` },
      { k: '10.4', p: '433', title: '평면에서의 그린 정리', body: R`
평면 영역 위의 이중적분을 그 경계 위의 선적분으로 바꿀 수 있고, 그 반대도 됩니다. 계산을 간단히 해 줄 뿐 아니라, 이론에서 한 종류의 적분을 다른 종류로 옮길 때 쓰입니다.

:::thm 평면에서의 그린 정리 (교재 §10.4 Theorem 1)
$R$이 $xy$ 평면의 닫힌 유계 영역이고 그 경계 $C$가 매끄러운 곡선 유한 개로 이루어져 있다고 하자. $F_1(x,y)$, $F_2(x,y)$와 편도함수 $\partial F_1/\partial y$, $\partial F_2/\partial x$가 $R$을 포함하는 어떤 영역에서 연속이면
$$\iint_R\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)dx\,dy=\oint_C(F_1\,dx+F_2\,dy)$$
적분은 경계 $C$ 전체를 따라, **진행 방향의 왼쪽에 $R$이 있도록** 합니다.
:::

:::key 그린 정리
$$\iint_R\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)dx\,dy=\oint_C\big(F_1\,dx+F_2\,dy\big),\qquad A=\frac12\oint_C(x\,dy-y\,dx)$$
:::

- $C$는 영역 $R$을 **왼쪽에 두고** 도는 방향입니다(바깥 경계는 반시계, 안쪽 구멍의 경계는 시계 방향). 구멍이 있는 영역에서도 모든 경계를 합치면 성립합니다.
- 벡터 형태: $\mathbf F=[F_1,F_2]$로 두면 $\iint_R(\operatorname{curl}\mathbf F)\cdot\mathbf k\,dx\,dy=\oint_C\mathbf F\cdot d\mathbf r$. 3차원 스토크스 정리의 평면판입니다.
- “$R$을 포함하는 영역에서” 조건은 경계점에서도 내부와 같은 가정이 성립하도록 하려는 것입니다.

:::ex 예제 1 (정리의 확인)
$F_1=-x^2y$, $F_2=xy^2$, $C$: 단위원(반시계)에 대해 양변을 계산해 비교하세요.
---
**이중적분.** $\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}=y^2+x^2$. 극좌표로 $\int_0^{2\pi}\!\int_0^1r^2\cdot r\,dr\,d\theta=\frac\pi2$.
**선적분.** $\mathbf r=[\cos t,\sin t]$에서 $F_1x'+F_2y'=(-\cos^2t\sin t)(-\sin t)+(\cos t\sin^2t)(\cos t)=2\cos^2t\sin^2t=\frac12\sin^22t$. $\int_0^{2\pi}\frac12\sin^22t\,dt=\frac\pi2$ ✓.
:::

### 증명

먼저 $a\le x\le b$, $u(x)\le y\le v(x)$로도, $c\le y\le d$, $p(y)\le x\le q(y)$로도 쓸 수 있는 **특수 영역**에서 증명합니다. 왼쪽의 둘째 항(부호 빼고)을 $y$로 먼저 적분하면
$$\iint_R\frac{\partial F_1}{\partial y}dx\,dy=\int_a^b\Big[F_1(x,y)\Big]_{y=u(x)}^{y=v(x)}dx=\int_a^bF_1[x,v(x)]\,dx-\int_a^bF_1[x,u(x)]\,dx$$
$y=v(x)$는 위쪽 곡선 $C^{**}$, $y=u(x)$는 아래쪽 곡선 $C^*$입니다. 경계를 반시계로 돌면 $C^*$는 왼쪽에서 오른쪽으로, $C^{**}$는 오른쪽에서 왼쪽으로 가므로, 첫 적분의 방향을 뒤집어
$$\iint_R\frac{\partial F_1}{\partial y}dx\,dy=-\int_{C^{**}}F_1\,dx-\int_{C^*}F_1\,dx=-\oint_CF_1\,dx$$
경계에 $y$축에 평행한 부분이 있어도 거기서는 $dx=0$이라 적분이 0이므로 더해도 됩니다. 같은 방법으로 두 번째 표현을 써서 $x$로 먼저 적분하면 $\iint_R\frac{\partial F_2}{\partial x}dx\,dy=\oint_CF_2\,dy$. 둘을 합치면 정리가 됩니다.

특수 영역이 아닌 $R$은 특수 영역 유한 개로 나눠 각각에 정리를 쓰고 더합니다. 나누는 선 위의 적분은 이웃한 두 조각에서 **한 번씩 반대 방향으로** 나타나 지워지고, 바깥 경계 위의 적분만 남습니다. 실용적인 영역은 모두 이렇게 다룰 수 있습니다(가장 일반적인 영역은 극한 논증이 필요).

:::fig f09green
:::

:::ex 예제 2 (선적분을 이중적분으로)
$\oint_C(xy\,dx+x^2\,dy)$, $C$: 단위정사각형 $[0,1]^2$의 경계(반시계)
---
$\partial F_2/\partial x-\partial F_1/\partial y=2x-x=x$. $\iint_Rx\,dA=\int_0^1\!\int_0^1x\,dx\,dy=\frac12$.
네 변을 따로 적분하는 것보다 훨씬 짧습니다.
:::

### 응용 ① 경계에서 넓이 구하기

그린 정리에서 $F_1=0$, $F_2=x$로 두면 $\iint_Rdx\,dy=\oint_Cx\,dy$, $F_1=-y$, $F_2=0$으로 두면 $\iint_Rdx\,dy=-\oint_Cy\,dx$입니다. 더해서 반으로 나누면
$$A=\frac12\oint_C(x\,dy-y\,dx)$$
영역의 넓이를 경계 위의 선적분으로 나타내는 식으로, 경계를 따라 한 바퀴 돌려 넓이를 재는 기계(구적기)의 원리입니다. 타원 $x=a\cos t$, $y=b\sin t$에 쓰면 $x\,y'-y\,x'=ab\cos^2t+ab\sin^2t=ab$이므로 $A=\frac12\int_0^{2\pi}ab\,dt=\pi ab$.

**극좌표.** $x=r\cos\theta$, $y=r\sin\theta$이면 $dx=\cos\theta\,dr-r\sin\theta\,d\theta$, $dy=\sin\theta\,dr+r\cos\theta\,d\theta$이고 $x\,dy-y\,dx=r^2d\theta$이므로
$$A=\frac12\oint_Cr^2\,d\theta$$

:::ex 예제 3 (성망형의 넓이)
성망형(astroid) $\mathbf r=(\cos^3t,\ \sin^3t)$, $0\le t\le2\pi$가 둘러싼 넓이
---
$x\,dy-y\,dx=\big(3\cos^4t\sin^2t+3\sin^4t\cos^2t\big)dt=3\cos^2t\sin^2t\,dt=\tfrac34\sin^22t\,dt$.
$$A=\frac12\int_0^{2\pi}\tfrac34\sin^22t\,dt=\frac12\cdot\frac{3\pi}4=\frac{3\pi}8$$
:::

:::ex 예제 4 (장미곡선 꽃잎 하나)
$r=\cos2\theta$의 꽃잎 하나($-\frac\pi4\le\theta\le\frac\pi4$)의 넓이는?
---
$A=\frac12\int_{-\pi/4}^{\pi/4}\cos^22\theta\,d\theta=\frac12\Big[\frac\theta2+\frac{\sin4\theta}8\Big]_{-\pi/4}^{\pi/4}=\frac12\cdot\frac\pi4=\frac\pi8$.
:::

### 응용 ② 라플라시안의 이중적분 = 법선 도함수의 선적분

$w(x,y)$가 연속인 2계 편도함수를 가질 때 $F_1=-\frac{\partial w}{\partial y}$, $F_2=\frac{\partial w}{\partial x}$로 두면 왼쪽은 $\frac{\partial^2w}{\partial x^2}+\frac{\partial^2w}{\partial y^2}=\nabla^2w$입니다. 오른쪽은 호의 길이 $s$로
$$\oint_C\Big(-\frac{\partial w}{\partial y}\frac{dx}{ds}+\frac{\partial w}{\partial x}\frac{dy}{ds}\Big)ds=\oint_C(\nabla w)\cdot\mathbf n\,ds,\qquad\mathbf n=\Big[\frac{dy}{ds},-\frac{dx}{ds}\Big]$$
입니다. $\mathbf n$은 단위접선 $\big[\frac{dx}{ds},\frac{dy}{ds}\big]$에 수직인 단위벡터이고, 반시계 방향으로 돌 때 **바깥쪽**을 향합니다. $(\nabla w)\cdot\mathbf n$은 바깥 법선 방향의 방향도함수, 곧 **법선 도함수** $\frac{\partial w}{\partial n}$이므로
$$\iint_R\nabla^2w\,dx\,dy=\oint_C\frac{\partial w}{\partial n}\,ds$$
특히 $w$가 라플라스 방정식을 만족하면(조화함수) 닫힌 곡선 위 법선 도함수의 적분은 0입니다.

:::ex 예제 5 (법선 도함수 공식의 확인)
(a) $w=x^2+y^2$, $R$: 반지름 $a$인 원판, (b) $w=x^2-y^2$, $R$: 단위정사각형에서 양변을 비교하세요.
---
(a) $\nabla^2w=4$이므로 왼쪽 $=4\pi a^2$. 원 위에서 $\frac{\partial w}{\partial n}=\frac{\partial w}{\partial r}=2r=2a$이므로 오른쪽 $=2a\cdot2\pi a=4\pi a^2$ ✓.
(b) $\nabla^2w=2-2=0$ (조화함수). 네 변의 바깥 법선 도함수: $x=1$에서 $w_x=2$, $x=0$에서 $-w_x=0$, $y=1$에서 $w_y=-2$, $y=0$에서 $-w_y=0$. 합 $2+0-2+0=0$ ✓.
:::

그린 정리는 양방향으로 쓰여 계산을 쉬운 쪽으로 옮겨 주고, 더 근본적으로는 §10.9 스토크스 정리 증명의 핵심 도구입니다. 코시 적분 정리의 가장 짧은 증명도 그린 정리와 코시-리만 방정식입니다[[ch13:14.2|코시 적분 정리.]][[ch12:13.4|코시-리만 방정식.]].
` },
      { k: '10.5', p: '439', title: '면적분을 위한 곡면', body: R`
선적분에서 곡선을 따라 적분했듯이, 면적분에서는 곡면 위에서 적분합니다. 곡선을 매개변수로 나타냈으니 곡면도 매개변수로 나타내는 것이 자연스럽고, 둘째로 곡면의 법선을 구하는 법을 익힙니다.

### 곡면의 표현

곡면 $S$는 $z=f(x,y)$ 또는 $g(x,y,z)=0$으로 나타낼 수 있습니다. 예를 들어 $z=+\sqrt{a^2-x^2-y^2}$ 또는 $x^2+y^2+z^2-a^2=0$ ($z\ge0$)은 반지름 $a$인 반구면입니다.

곡선이 1차원이라 매개변수 하나였듯이 곡면은 2차원이므로 매개변수 둘 $u$, $v$가 필요합니다. **매개변수 표현**
$$\mathbf r(u,v)=[x(u,v),\ y(u,v),\ z(u,v)]\qquad((u,v)\in R)$$
은 $uv$ 평면의 영역 $R$의 각 점을 곡면 위의 점(위치벡터 $\mathbf r(u,v)$)으로 보내는 사상입니다. 면적분 계산에는 이 표현이 가장 편합니다.

- **원기둥** $x^2+y^2=a^2$, $-1\le z\le1$: $\mathbf r=[a\cos u,\ a\sin u,\ v]$, $0\le u\le2\pi$, $-1\le v\le1$. $u$=상수인 곡선은 수직선(모선), $v$=상수인 곡선은 평행한 원입니다.
- **구** $x^2+y^2+z^2=a^2$: $\mathbf r=[a\cos v\cos u,\ a\cos v\sin u,\ a\sin v]$, $0\le u\le2\pi$, $-\frac\pi2\le v\le\frac\pi2$. $u$는 경도, $v$는 위도이고 $u$=상수, $v$=상수인 곡선이 경선과 위선입니다(지리학의 좌표). 수학에서는 여위도를 쓴 $[a\cos u\sin v,\ a\sin u\sin v,\ a\cos v]$, $0\le v\le\pi$도 씁니다.
- **원뿔** $z=\sqrt{x^2+y^2}$, $0\le z\le H$: $\mathbf r=[u\cos v,\ u\sin v,\ u]$, $0\le u\le H$, $0\le v\le2\pi$. ($x^2+y^2=z^2$ 확인.)
- **원환체**(도넛): 반지름 $b$인 원을, 그 중심에서 거리 $a$ ($>b$)인 $z$축 둘레로 돌린 곡면: $\mathbf r=[(a+b\cos v)\cos u,\ (a+b\cos v)\sin u,\ b\sin v]$, $0\le u,v\le2\pi$.

### 접평면과 법선

곡면 위의 점 $P$를 지나는 곡면 위 곡선들의 접선벡터는 한 평면, 곧 **접평면**을 이룹니다(모서리나 뿔의 꼭짓점 같은 점은 예외). 곡면 위의 곡선은 미분가능한 함수 쌍 $u=u(t)$, $v=v(t)$로 $\tilde{\mathbf r}(t)=\mathbf r(u(t),v(t))$처럼 얻을 수 있고, 연쇄법칙에서
$$\tilde{\mathbf r}'(t)=\frac{\partial\mathbf r}{\partial u}u'+\frac{\partial\mathbf r}{\partial v}v'$$
따라서 모든 접선벡터가 $\mathbf r_u$와 $\mathbf r_v$의 일차결합입니다. $\mathbf r_u$, $\mathbf r_v$가 일차독립(기하적으로 $u$=상수, $v$=상수인 곡선이 $P$에서 0이 아닌 각으로 만남)이면 둘이 접평면을 펼치고, 그 외적이 법선입니다.

:::key 곡면의 법선벡터
$$\mathbf N=\mathbf r_u\times\mathbf r_v,\qquad \mathbf n=\frac{\mathbf N}{|\mathbf N|}$$
$$z=f(x,y):\ \mathbf N=(-f_x,\,-f_y,\,1),\qquad g(x,y,z)=0:\ \mathbf n=\frac{\nabla g}{|\nabla g|}$$
:::

$\mathbf r_u$, $\mathbf r_v$는 곡면의 두 접벡터이므로 그 외적이 법선입니다[[ch08:9.3|외적은 두 벡터에 수직.]][[ch08:9.7|기울기는 등위면의 법선.]]. $z=f(x,y)$는 $u=x$, $v=y$로 두어 $\mathbf r=[u,v,f]$, $\mathbf r_u=[1,0,f_u]$, $\mathbf r_v=[0,1,f_v]$, $\mathbf N=[-f_x,-f_y,1]$ (위쪽 법선)입니다.

법선이 곡면 위의 점에 따라 연속적으로 변하면 **매끄러운 곡면**, 매끄러운 조각 유한 개로 이루어지면 **조각마다 매끄러운 곡면**입니다. 구면은 매끄럽고 정육면체의 겉면은 조각마다 매끄럽습니다(모서리에서 법선이 끊김).

:::thm 접평면과 법선 (교재 §10.5 Theorem 1)
곡면 $S$가 연속인 $\mathbf r_u$, $\mathbf r_v$를 가지고 모든 점에서 $\mathbf N=\mathbf r_u\times\mathbf r_v\ne\mathbf 0$이면, $S$는 각 점 $P$에서 $\mathbf r_u$, $\mathbf r_v$가 펼치는 유일한 접평면과, 방향이 점에 따라 연속적으로 변하는 유일한 법선을 가집니다.
:::

:::fig f09surf
:::

:::ex 예제 1 (구면의 법선)
구면 $\mathbf r=[a\cos v\cos u,\ a\cos v\sin u,\ a\sin v]$의 $\mathbf N$과 단위법선은?
---
$\mathbf r_u=[-a\cos v\sin u,\ a\cos v\cos u,\ 0]$, $\mathbf r_v=[-a\sin v\cos u,\ -a\sin v\sin u,\ a\cos v]$.
$$\mathbf N=\mathbf r_u\times\mathbf r_v=[a^2\cos^2v\cos u,\ a^2\cos^2v\sin u,\ a^2\cos v\sin v]=a\cos v\,\mathbf r$$
따라서 $\mathbf n=\frac1a\mathbf r=\big[\frac xa,\frac ya,\frac za\big]$, 위치벡터 방향(바깥쪽)입니다. 기울기로 구해도 $\nabla(x^2+y^2+z^2-a^2)=2[x,y,z]$라 같습니다. 극($v=\pm\frac\pi2$)에서 $\mathbf N=\mathbf 0$인 것은 매개변수화의 문제일 뿐이고, $|\mathbf N|=a^2\cos v$는 다음 절에서 넓이 요소가 됩니다.
:::

:::ex 예제 2 (포물면의 법선)
포물면 $\mathbf r=(u\cos v,\ u\sin v,\ u^2)$의 법선벡터
---
$\mathbf r_u=(\cos v,\sin v,2u)$, $\mathbf r_v=(-u\sin v,u\cos v,0)$.
$$\mathbf N=\mathbf r_u\times\mathbf r_v=(-2u^2\cos v,\ -2u^2\sin v,\ u)$$
$z$성분이 양수이므로 위쪽(포물면 안쪽)을 향합니다. $u=0$ (꼭짓점)에서 $\mathbf N=\mathbf 0$이지만 이는 매개변수화의 문제일 뿐, $z=x^2+y^2$로 보면 $\mathbf N=(-2x,-2y,1)$로 매끄럽습니다.
:::

:::ex 예제 3 (원뿔의 꼭짓점)
원뿔 $g=z-\sqrt{x^2+y^2}=0$의 단위법선은?
---
$\nabla g=\Big[-\frac x{\sqrt{x^2+y^2}},\ -\frac y{\sqrt{x^2+y^2}},\ 1\Big]$, 길이 $\sqrt2$이므로 $\mathbf n=\frac1{\sqrt2}\Big[-\frac xr,-\frac yr,1\Big]$ ($r=\sqrt{x^2+y^2}$). 꼭짓점($r=0$)에서는 정해지지 않습니다. 포물면과 달리 이것은 곡면 자체의 성질(뾰족한 점)입니다.
:::
` },
      { k: '10.6', p: '443', title: '면적분', body: R`
매개변수 표현 $\mathbf r(u,v)$, $(u,v)\in R$로 주어진 조각마다 매끄러운 곡면 $S$에서 법선 $\mathbf N=\mathbf r_u\times\mathbf r_v$와 단위법선 $\mathbf n=\mathbf N/|\mathbf N|$을 씁니다. 벡터함수 $\mathbf F$의 **면적분**을
$$\iint_S\mathbf F\cdot\mathbf n\,dA=\iint_R\mathbf F(\mathbf r(u,v))\cdot\mathbf N(u,v)\,du\,dv$$
로 정의합니다. $|\mathbf N|=|\mathbf r_u\times\mathbf r_v|$는 변이 $\mathbf r_u$, $\mathbf r_v$인 평행사변형의 넓이이므로 $dA=|\mathbf N|\,du\,dv$가 곡면의 **넓이 요소**이고, $\mathbf n\,dA=\mathbf n|\mathbf N|\,du\,dv=\mathbf N\,du\,dv$입니다. 그래서 **단위법선을 따로 구할 필요가 없습니다**.

:::key 면적분
$$A=\iint_R|\mathbf N|\,du\,dv,\qquad \iint_S\mathbf F\cdot\mathbf n\,dA=\iint_R\mathbf F(\mathbf r(u,v))\cdot\mathbf N(u,v)\,du\,dv$$
$$z=f(x,y)\ (\text{위쪽}):\ \mathbf N=(-f_x,\,-f_y,\,1),\qquad \text{반지름 }a\text{인 구면}:\ dA=a^2\sin\phi\,d\phi\,d\theta$$
:::

**유량.** $\mathbf F\cdot\mathbf n$은 $\mathbf F$의 법선 성분입니다. $\mathbf F=\rho\mathbf v$ (밀도 × 속도)이면 면적분은 단위 시간에 $S$를 통과하는 유체의 질량, 곧 **유량**(flux)이므로 면적분을 **유량 적분**이라고도 합니다.

**성분 형태.** $\mathbf n=[\cos\alpha,\cos\beta,\cos\gamma]$ ($\alpha,\beta,\gamma$: $\mathbf n$과 좌표축의 사잇각)로 쓰면
$$\iint_S\mathbf F\cdot\mathbf n\,dA=\iint_S(F_1\cos\alpha+F_2\cos\beta+F_3\cos\gamma)\,dA=\iint_S(F_1\,dy\,dz+F_2\,dz\,dx+F_3\,dx\,dy)$$
여기서 $\cos\gamma\,dA=dx\,dy$ 등은 곡면 요소를 좌표평면에 정사영한 넓이인데, **방향에 주의**해야 합니다. $S$가 $z=h(x,y)$이고 $\cos\gamma>0$ (위쪽 법선)이면 $\iint_SF_3\,dx\,dy=+\iint_RF_3(x,y,h(x,y))\,dx\,dy$이지만, $\cos\gamma<0$이면 앞에 $-$가 붙습니다.

:::ex 예제 1 (물이 곡면을 통과하는 유량)
속도 $\mathbf v=[y,\ 2,\ xz]$ (m/s)로 흐르는 물이 포물기둥면 $S: y=x^2$, $0\le x\le1$, $0\le z\le2$를 $y$가 증가하는 쪽으로 통과하는 유량은? (물의 밀도는 1 t/m³로 둡니다.)
---
$x=u$, $z=v$로 두면 $\mathbf r=[u,\ u^2,\ v]$, $0\le u\le1$, $0\le v\le2$. $\mathbf r_u=[1,2u,0]$, $\mathbf r_v=[0,0,1]$이고 $\mathbf r_u\times\mathbf r_v=[2u,-1,0]$은 $y$가 줄어드는 쪽이므로, 원하는 방향의 법선은 $\mathbf N=\mathbf r_v\times\mathbf r_u=[-2u,\ 1,\ 0]$입니다.
$S$ 위에서 $\mathbf v=[u^2,\ 2,\ uv]$, $\mathbf v\cdot\mathbf N=-2u^3+2$.
$$\iint_S\mathbf v\cdot\mathbf n\,dA=\int_0^2\!\int_0^1(2-2u^3)\,du\,dv=2\Big(2-\frac12\Big)=3\ \text{m}^3/\text{s}$$
곧 초당 3000 L입니다. $\mathbf r_u\times\mathbf r_v$를 그대로 썼다면 $-3$이 나왔을 것입니다. 이것이 다음의 방향 문제입니다.
:::

:::ex 예제 2 (평면 조각)
$\mathbf F=[x,y,z]$가 평면 $x+y+z=1$의 제1팔분공간 부분을 위쪽으로 통과하는 유량은?
---
$x=u$, $y=v$로 두면 $\mathbf r=[u,\ v,\ 1-u-v]$이고 $(u,v)$는 삼각형 $R: u,v\ge0$, $u+v\le1$ ($S$를 $xy$평면에 정사영한 것). $\mathbf N=[1,0,-1]\times[0,1,-1]=[1,1,1]$ (위쪽).
$\mathbf F\cdot\mathbf N=u+v+(1-u-v)=1$이므로 유량 $=\iint_R1\,du\,dv=\frac12$ (삼각형 $R$의 넓이).
:::

### 곡면의 방향

면적분의 값은 $\mathbf n$과 $-\mathbf n$ 중 어느 것을 고르느냐에 따라 달라집니다. 두 단위법선 중 하나를 연속적으로 골라 놓은 곡면을 **향이 주어진 곡면**이라 합니다.

:::thm 방향을 바꾸면 (교재 §10.6 Theorem 1)
$\mathbf n$을 $-\mathbf n$으로 (따라서 $\mathbf N$을 $-\mathbf N$으로) 바꾸면 면적분에 $-1$이 곱해집니다.
:::

실제로는 $u$와 $v$의 역할을 바꾸면 됩니다: $\mathbf r_u\times\mathbf r_v$가 $\mathbf r_v\times\mathbf r_u=-\mathbf r_u\times\mathbf r_v$로 바뀝니다(예제 1).

**향을 줄 수 있는 곡면.** 매끄러운 곡면에서 한 점 $P_0$의 양의 법선 방향을 곡면 전체로 유일하고 연속적으로 이어 갈 수 있으면 **향을 줄 수 있다**고 합니다. 조각마다 매끄러운 곡면은, 각 조각의 향을 경계 곡선의 방향과 짝지은 뒤 이웃한 두 조각의 공통 경계에서 두 방향이 서로 반대가 되도록 맞출 수 있으면 향을 줄 수 있습니다(정육면체 겉면이 그 예). 충분히 작은 매끄러운 곡면 조각은 늘 향을 줄 수 있지만 곡면 전체는 아닐 수 있습니다. 대표적인 예가 **뫼비우스 띠**입니다: 직사각형 종이를 반 바퀴 비틀어 양끝을 붙인 띠에서 한 점의 법선을 가운데 선을 따라 한 바퀴 옮기면 반대 방향이 되어 돌아옵니다. 이런 곡면에서는 유량을 정의할 수 없습니다.

### 방향과 무관한 면적분

$$\iint_SG(\mathbf r)\,dA=\iint_RG(\mathbf r(u,v))\,|\mathbf N(u,v)|\,du\,dv$$
도 면적분이며, $dA=|\mathbf N|\,du\,dv$라 방향과 무관합니다. $G$가 곡면의 면밀도이면 질량, $G=1$이면 **곡면의 넓이** $A(S)=\iint_R|\mathbf r_u\times\mathbf r_v|\,du\,dv$입니다. $R$이 단순연결이고 $G$가 연속이면 평균값 정리 $\iint_SG\,dA=G(\mathbf r(u_0,v_0))\,A(S)$도 성립하고, §10.9에서 씁니다.

:::ex 예제 3 (구면과 원환체의 넓이)
(a) 반지름 $a$인 구면, (b) 원환체 $\mathbf r=[(a+b\cos v)\cos u,\ (a+b\cos v)\sin u,\ b\sin v]$의 넓이는?
---
(a) §10.5 예제 1에서 $|\mathbf N|=a^2|\cos v|$이므로 $A=\int_{-\pi/2}^{\pi/2}\!\int_0^{2\pi}a^2\cos v\,du\,dv=2\pi a^2\cdot2=4\pi a^2$.
(b) $\mathbf r_u=(a+b\cos v)[-\sin u,\ \cos u,\ 0]$, $\mathbf r_v=b[-\sin v\cos u,\ -\sin v\sin u,\ \cos v]$이고 외적은 $b(a+b\cos v)[\cos u\cos v,\ \sin u\cos v,\ \sin v]$ (길이 1인 벡터의 배수). 따라서 $|\mathbf N|=b(a+b\cos v)$,
$$A=\int_0^{2\pi}\!\int_0^{2\pi}b(a+b\cos v)\,du\,dv=4\pi^2ab$$
단면 원의 둘레 $2\pi b$ × 중심이 그리는 원의 둘레 $2\pi a$와 같습니다(파푸스 정리).
:::

:::ex 예제 4 (원뿔 껍질의 관성모멘트)
면밀도가 일정한 원뿔면 $z=\sqrt{x^2+y^2}$, $0\le z\le h$ (질량 $M$)의 $z$축에 대한 관성모멘트는?
---
면에 퍼진 질량의 축 $L$에 대한 관성모멘트는 $I=\iint_S\sigma D^2\,dA$ ($D$: 축까지의 거리, $\sigma$: 면밀도)입니다. $\mathbf r=[u\cos v,\ u\sin v,\ u]$에서 $\mathbf N=[-u\cos v,\ -u\sin v,\ u]$, $|\mathbf N|=\sqrt2u$, $D^2=u^2$.
넓이 $A=\int_0^{2\pi}\!\int_0^h\sqrt2u\,du\,dv=\sqrt2\pi h^2$이므로 $\sigma=M/A$.
$$I=\sigma\int_0^{2\pi}\!\int_0^hu^2\cdot\sqrt2u\,du\,dv=\sigma\sqrt2\pi\frac{h^4}2=\frac{Mh^2}2$$
밑면 반지름이 $h$이므로 $I=\frac12MR^2$입니다.
:::

**$z=f(x,y)$ 꼴.** $\mathbf N=[-f_x,-f_y,1]$이므로
$$\iint_SG\,dA=\iint_{R^*}G(x,y,f(x,y))\sqrt{1+f_x^2+f_y^2}\,dx\,dy,\qquad A(S)=\iint_{R^*}\sqrt{1+f_x^2+f_y^2}\,dx\,dy$$
($R^*$: $S$를 $xy$평면에 정사영한 영역). 예: 포물면 $z=x^2+y^2$, $x^2+y^2\le1$의 넓이는 $\int_0^{2\pi}\!\int_0^1\sqrt{1+4r^2}\,r\,dr\,d\theta=\frac\pi6\big(5\sqrt5-1\big)\approx5.33$.

:::ex 예제 5 (구면을 통과하는 유량)
$\mathbf F=(x,y,z)$가 반지름 $a$인 구면을 바깥으로 통과하는 유량은?
---
구면에서 $\mathbf n=\mathbf r/a$이므로 $\mathbf F\cdot\mathbf n=|\mathbf r|^2/a=a$. 넓이 $4\pi a^2$을 곱하면 $4\pi a^3$.
:::

:::ex 예제 6 ($z=f(x,y)$ 꼴)
$\mathbf F=(y,\ x,\ z)$가 포물면 $z=4-x^2-y^2$ ($z\ge0$)을 위쪽으로 통과하는 유량
---
$\mathbf N=(-f_x,-f_y,1)=(2x,2y,1)$. $\mathbf F\cdot\mathbf N=2xy+2xy+(4-x^2-y^2)$. 반지름 2인 원판에서 적분하면 $xy$ 항은 대칭으로 0이고
$$\int_0^{2\pi}\!\int_0^2(4-r^2)\,r\,dr\,d\theta=2\pi\Big[2r^2-\frac{r^4}4\Big]_0^2=8\pi$$
다음 절에서 발산 정리로 검산합니다.
:::
` },
      { k: '10.7', p: '452', title: '삼중적분과 가우스의 발산 정리', body: R`
이 절의 “큰” 정리는 삼중적분을 면적분으로 바꾸는 **발산 정리**입니다. 먼저 삼중적분을 짧게 복습합니다.

**삼중적분.** 공간의 닫힌 유계 영역 $T$를 좌표평면에 평행한 평면들로 잘게 나누고, $T$ 안에 완전히 들어가는 상자들(부피 $\Delta V_k$)에서 한 점씩 골라 합 $\sum f(x_k,y_k,z_k)\Delta V_k$를 만든 뒤, 상자 모서리의 최대 길이를 0으로 보낸 극한이 $\iiint_Tf\,dV$입니다. $f$가 연속이고 $T$의 경계가 매끄러운 곡면 유한 개이면 존재하고, 이중적분처럼 세 번의 반복적분으로 계산합니다. 원기둥좌표에서는 $dV=r\,dr\,d\theta\,dz$, 구좌표에서는 $dV=\rho^2\sin\phi\,d\rho\,d\phi\,d\theta$입니다.

:::thm 가우스의 발산 정리 (교재 §10.7 Theorem 1)
$T$가 공간의 닫힌 유계 영역이고 그 경계 $S$가 조각마다 매끄럽고 향을 줄 수 있는 곡면이라 하자. $\mathbf F$와 그 1계 편도함수가 $T$를 포함하는 영역에서 연속이면
$$\iiint_T\operatorname{div}\mathbf F\,dV=\iint_S\mathbf F\cdot\mathbf n\,dA$$
여기서 $\mathbf n$은 $S$의 **바깥쪽** 단위법선입니다.
:::

:::key 발산 정리 (가우스)
$$\iiint_T\operatorname{div}\mathbf F\,dV=\oiint_S\mathbf F\cdot\mathbf n\,dA\qquad(\mathbf n:\ \text{바깥 방향 단위법선})$$
:::

닫힌 곡면 $S$로 둘러싸인 영역 $T$에서, 내부의 샘(발산)을 모두 더한 것은 경계를 빠져나가는 총 유량과 같다는 뜻입니다. 성분으로 쓰면($\mathbf n=[\cos\alpha,\cos\beta,\cos\gamma]$)
$$\iiint_T\Big(\frac{\partial F_1}{\partial x}+\frac{\partial F_2}{\partial y}+\frac{\partial F_3}{\partial z}\Big)dx\,dy\,dz=\iint_S(F_1\cos\alpha+F_2\cos\beta+F_3\cos\gamma)\,dA=\iint_S(F_1\,dy\,dz+F_2\,dz\,dx+F_3\,dx\,dy)$$

:::ex 예제 1 (면적분을 삼중적분으로)
$\mathbf F=[x^3,\ y^3,\ z]$가 닫힌 원기둥 $x^2+y^2\le a^2$, $0\le z\le b$ (옆면과 위·아래 원판)를 빠져나가는 유량은?
---
$\operatorname{div}\mathbf F=3x^2+3y^2+1=3r^2+1$. 원기둥좌표로
$$\iiint_T(3r^2+1)\,dV=\int_0^b\!\int_0^{2\pi}\!\int_0^a(3r^2+1)\,r\,dr\,d\theta\,dz=2\pi b\Big(\frac{3a^4}4+\frac{a^2}2\Big)=\pi b\Big(\frac{3a^4}2+a^2\Big)$$
세 면을 따로 매개변수화해 면적분하는 것보다 훨씬 짧습니다.
:::

### 증명

성분 형태의 첫 등식은 세 성분마다
$$\iiint_T\frac{\partial F_1}{\partial x}dV=\iint_SF_1\cos\alpha\,dA,\quad\iiint_T\frac{\partial F_2}{\partial y}dV=\iint_SF_2\cos\beta\,dA,\quad\iiint_T\frac{\partial F_3}{\partial z}dV=\iint_SF_3\cos\gamma\,dA$$
가 성립하는 것과 같습니다. 좌표축에 평행한 직선이 $T$와 많아야 한 선분(또는 한 점)에서만 만나는 **특수 영역**에서 셋째 식을 보입니다. 이런 $T$는
$$g(x,y)\le z\le h(x,y),\qquad(x,y)\in R\ (T\text{를 }xy\text{평면에 정사영한 영역})$$
로 쓸 수 있고, $z=h$가 윗면 $S_1$, $z=g$가 아랫면 $S_2$, 나머지가 수직인 옆면 $S_3$입니다(구처럼 곡선으로 줄어들 수도 있음).

**왼쪽.** $z$로 먼저 적분하면
$$\iiint_T\frac{\partial F_3}{\partial z}dV=\iint_R\Big[\int_{g}^{h}\frac{\partial F_3}{\partial z}dz\Big]dx\,dy=\iint_RF_3[x,y,h(x,y)]\,dx\,dy-\iint_RF_3[x,y,g(x,y)]\,dx\,dy$$
**오른쪽.** $\iint_SF_3\cos\gamma\,dA=\iint_SF_3\,dx\,dy$에서 윗면 $S_1$은 $\cos\gamma>0$이라 $+\iint_RF_3[x,y,h]\,dx\,dy$, 아랫면 $S_2$는 $\cos\gamma<0$이라 $-\iint_RF_3[x,y,g]\,dx\,dy$, 옆면은 $\cos\gamma=0$이라 0입니다. 두 결과가 같으므로 셋째 식이 증명됩니다.
나머지 두 식은 $T$를 $g(y,z)\le x\le h(y,z)$, $g(z,x)\le y\le h(z,x)$로도 쓸 수 있다는 가정에서 변수 이름만 바꿔 얻습니다. 특수 영역 유한 개로 나눌 수 있는 $T$에서는 각각에 쓰고 더하면, 보조 곡면 위의 면적분이 둘씩 지워져(바깥 법선이 서로 반대) 전체 경계 위의 면적분만 남습니다. 그린 정리의 증명과 같은 구조입니다.

:::fig f09gauss
:::

:::ex 예제 2 (정리의 확인)
$\mathbf F=[x,0,0]$과 반지름 $a$인 구면에서 발산 정리의 양변을 비교하세요.
---
**삼중적분.** $\operatorname{div}\mathbf F=1$이므로 구의 부피 $\frac43\pi a^3$.
**면적분.** $\mathbf n=\frac1a[x,y,z]$이므로 $\mathbf F\cdot\mathbf n=\frac{x^2}a$. 대칭에서 $\iint_Sx^2dA=\iint_Sy^2dA=\iint_Sz^2dA$이고 셋의 합이 $\iint_Sa^2\,dA=a^2\cdot4\pi a^2$이므로 $\iint_Sx^2dA=\frac43\pi a^4$. 따라서 면적분 $=\frac1a\cdot\frac43\pi a^4=\frac43\pi a^3$ ✓.
:::

:::ex 예제 3 (구면 위의 유량)
$\mathbf F=(x^3,y^3,z^3)$이 반지름 $a$인 구면을 바깥으로 통과하는 유량
---
$\operatorname{div}\mathbf F=3(x^2+y^2+z^2)=3\rho^2$. 구좌표 $dV=\rho^2\sin\phi\,d\rho\,d\phi\,d\theta$로
$$\int_0^{2\pi}\!\int_0^\pi\!\int_0^a3\rho^2\cdot\rho^2\sin\phi\,d\rho\,d\phi\,d\theta=3\cdot\frac{a^5}5\cdot2\cdot2\pi=\frac{12\pi a^5}5$$
면적분으로 직접 하면 훨씬 깁니다.
:::

:::ex 예제 4 (닫아서 계산하기)
앞 절 예제 6의 유량 $8\pi$를 발산 정리로 검산하세요.
---
포물면에 바닥 원판 $z=0$ (법선 $-\mathbf k$)을 붙여 닫습니다. $\operatorname{div}\mathbf F=0+0+1=1$이므로 전체 유량 = 부피 $=\int_0^{2\pi}\!\int_0^2(4-r^2)r\,dr\,d\theta=8\pi$.
바닥에서 $\mathbf F\cdot(-\mathbf k)=-z=0$이므로 바닥 유량 0. 따라서 포물면 유량 $=8\pi-0=8\pi$ ✓
:::

:::tip 닫히지 않은 곡면
열린 곡면의 유량을 물으면, 계산이 쉬운 면(평평한 바닥 등)을 더해 닫은 뒤 발산 정리를 쓰고 더한 면의 유량을 빼는 방법이 자주 쓰입니다.
:::

### 발산의 좌표 불변성

발산은 좌표로 정의했지만, 발산 정리로 좌표와 무관한 의미를 줄 수 있습니다. 삼중적분의 평균값 정리 $\iiint_Tf\,dV=f(Q)\,V(T)$ ($Q\in T$)에서 $f=\operatorname{div}\mathbf F$로 두고 발산 정리를 쓰면
$$\operatorname{div}\mathbf F(Q)=\frac1{V(T)}\iint_{S(T)}\mathbf F\cdot\mathbf n\,dA$$
$T$를 한 점 $P$로 줄이면($T$의 점과 $P$ 사이의 최대 거리 $d(T)\to0$) $Q\to P$이므로
$$\operatorname{div}\mathbf F(P)=\lim_{d(T)\to0}\frac1{V(T)}\iint_{S(T)}\mathbf F\cdot\mathbf n\,dA$$

:::thm 발산의 불변성 (교재 §10.7 Theorem 2)
연속인 1계 편도함수를 가진 $\mathbf F$의 발산은 직교좌표의 선택과 무관하며, 각 점 $P$에서 위의 극한으로 주어집니다.
:::

오른쪽에는 좌표가 전혀 없으므로 §9.8의 불변성(Theorem 1)이 증명됩니다. 이 식을 발산의 정의로 삼기도 하며, 발산이 “단위 부피당 유출량”이라는 뜻이 여기서 정확해집니다[[ch08:9.8|발산의 물리적 의미.]].
` },
      { k: '10.8', p: '458', title: '발산 정리의 응용', body: R`
발산 정리는 유체 흐름에서 샘과 싱크를 특징짓고, 열 흐름에서 열방정식을 낳고, 퍼텐셜 이론에서 라플라스 방정식의 해의 성질을 줍니다. 이 절에서 영역 $T$와 경계 $S$는 발산 정리를 쓸 수 있는 것이라 가정합니다.

### ① 유체 흐름: 발산의 물리적 의미

:::ex 예제 1 (샘의 세기)
밀도 $\rho=1$로 일정하고 시간에 따라 변하지 않는(정상) 비압축성 흐름의 속도장을 $\mathbf v$라 하자. $\operatorname{div}\mathbf v$의 뜻은?
---
$S$의 작은 조각(넓이 $\Delta A$)에서 $\mathbf v\cdot\mathbf n\,\Delta A$는 단위 시간에 그 조각을 지나 **나가는**($\mathbf v\cdot\mathbf n>0$) 또는 **들어오는**($<0$) 유체의 질량입니다. 따라서 $\iint_S\mathbf v\cdot\mathbf n\,dA$는 $T$에서 밖으로 나가는 총 질량이고, 부피 $V$로 나눈 $\frac1V\iint_S\mathbf v\cdot\mathbf n\,dA$는 평균 유출입니다.
흐름이 정상이고 비압축성이므로, 밖으로 나가는 양이 0이 아니라면 $T$ 안에서 계속 공급되어야 합니다. 곧 $T$ 안에 **샘**(유체가 생기는 점, 음이면 싱크)이 있어야 합니다. $T$를 한 점 $P$로 줄이면 §10.7의 극한에서
$$\operatorname{div}\mathbf v(P)=\lim_{d(T)\to0}\frac1{V(T)}\iint_{S(T)}\mathbf v\cdot\mathbf n\,dA$$
**정상 비압축성 흐름의 속도의 발산은 그 점의 샘의 세기**입니다. $T$ 안에 샘이 없다 ⟺ $T$ 전체에서 $\operatorname{div}\mathbf v=0$이고, 그러면 $T$ 안의 모든 닫힌 곡면에서 $\iint_S\mathbf v\cdot\mathbf n\,dA=0$입니다.
:::

**연속방정식.** 압축성 유체라도, 임의의 영역에서 질량 감소율 = 경계를 빠져나가는 질량 유량이라는 균형에 발산 정리를 쓰면 영역이 임의이므로 피적분함수가 0이 되어 $\frac{\partial\rho}{\partial t}+\operatorname{div}(\rho\mathbf v)=0$을 얻습니다(§9.8에서 작은 상자로 유도한 것과 같음).

### ② 열의 흐름: 열방정식

:::ex 예제 2 (열방정식의 유도)
실험에 따르면 물체 안에서 열은 온도가 내려가는 방향으로 흐르고, 흐름의 빠르기는 온도의 기울기에 비례합니다: $\mathbf v=-K\operatorname{grad}U$ ($U(x,y,z,t)$: 온도, $K$: 열전도율). 열 흐름의 수학 모델을 세우세요.
---
**나가는 열.** 물체 안의 영역 $T$ (경계 $S$, 바깥 법선 $\mathbf n$)에서 단위 시간에 빠져나가는 열은 $\iint_S\mathbf v\cdot\mathbf n\,dA$. 발산 정리와 $\operatorname{div}(\operatorname{grad}U)=\nabla^2U$에서
$$\iint_S\mathbf v\cdot\mathbf n\,dA=-K\iiint_T\nabla^2U\,dx\,dy\,dz$$
**줄어드는 열.** $T$ 안의 총 열량은 $H=\iiint_T\sigma\rho U\,dx\,dy\,dz$ ($\sigma$: 비열, $\rho$: 밀도)이므로 감소율은 $-\frac{\partial H}{\partial t}=-\iiint_T\sigma\rho\frac{\partial U}{\partial t}dx\,dy\,dz$.
**같다고 놓으면** $\iiint_T\big(\sigma\rho\frac{\partial U}{\partial t}-K\nabla^2U\big)dx\,dy\,dz=0$. 이것이 물체 안의 **모든** 영역 $T$에서 성립하므로(피적분함수가 연속이면) 피적분함수 자체가 0입니다:
$$\frac{\partial U}{\partial t}=c^2\nabla^2U,\qquad c^2=\frac K{\sigma\rho}$$
:::

이것이 **열방정식**이고 $c^2$은 **열확산율**입니다. 기체·액체에서 밀도나 압력의 차이가 고르게 퍼지는 확산 과정도 같은 식이라 **확산방정식**이라고도 합니다. PDE 단원에서 이 방정식을 풉니다[[ch11:12.5|열방정식의 유도와 풀이.]]. 시간에 무관한 **정상 상태**에서는 $\frac{\partial U}{\partial t}=0$이라 라플라스 방정식 $\nabla^2U=0$이 됩니다.

### ③ 퍼텐셜 이론: 조화함수

라플라스 방정식 $\nabla^2f=0$의 해의 이론을 **퍼텐셜 이론**이라 하고, 연속인 2계 편도함수를 가진 해를 **조화함수**라 합니다(연속성은 발산 정리를 쓰기 위해 필요).

발산 정리에서 $\mathbf F=\operatorname{grad}f$로 두면 $\operatorname{div}\mathbf F=\nabla^2f$이고, $\mathbf F\cdot\mathbf n=\mathbf n\cdot\operatorname{grad}f$는 $S$의 바깥 법선 방향의 방향도함수, 곧 **법선 도함수** $\frac{\partial f}{\partial n}$입니다. 따라서
$$\iiint_T\nabla^2f\,dV=\iint_S\frac{\partial f}{\partial n}dA$$
(§10.4 응용 ②의 3차원판)이고, 다음을 얻습니다.

:::thm 조화함수의 기본 성질 (교재 §10.8 Theorem 1)
$f$가 영역 $D$에서 조화함수이고 $S$가 $D$ 안의 조각마다 매끄럽고 향을 줄 수 있는 닫힌 곡면으로서 그것이 둘러싼 영역도 모두 $D$에 속하면, $S$ 위에서 법선 도함수의 적분은 0입니다.
:::

샘이 없는 정상 상태의 퍼텐셜은 닫힌 곡면을 통한 총 유량이 0이라는 뜻입니다.

:::ex 예제 3 (조화함수의 확인)
$f=x^2-y^2$일 때 원점 중심 단위구면에서 $\oiint\frac{\partial f}{\partial n}dA$는?
---
$\nabla^2f=2-2=0$이므로 조화함수, 따라서 0. 직접: 구면에서 $\frac{\partial f}{\partial n}=\nabla f\cdot\mathbf r=2x^2-2y^2$이고 대칭으로 적분이 0 ✓
:::

:::ex 예제 4 (점 전하의 유량: 특이점이 있으면)
$\mathbf F=\dfrac{\mathbf r}{r^3}$ ($r=|\mathbf r|\ne0$)가 원점 중심 반지름 $a$인 구면을 바깥으로 통과하는 유량은? 원점을 둘러싸지 않는 닫힌 곡면에서는?
---
구면에서 $\mathbf F\cdot\mathbf n=\frac{\mathbf r}{a^3}\cdot\frac{\mathbf r}a=\frac1{a^2}$이므로 유량 $=\frac1{a^2}\cdot4\pi a^2=4\pi$, **반지름과 무관**합니다. 그런데 §9.8에서 $\operatorname{div}\mathbf F=0$ ($r\ne0$)이었으므로, 발산 정리를 그대로 쓰면 0이 나와야 할 것 같습니다. 모순이 아닌 이유는 $\mathbf F$가 원점에서 정의되지 않아(연속이 아님) 구 전체에 정리를 쓸 수 없기 때문입니다. 원점을 둘러싸지 않는 닫힌 곡면에서는 가정이 성립하므로 유량이 0입니다. 원점을 둘러싼 **어떤** 닫힌 곡면이든 유량은 $4\pi$입니다(작은 구면과의 사이 영역에 발산 정리를 쓰면 됨). 전기장의 가우스 법칙의 수학적 내용입니다.
:::

### 그린 공식과 유일성

:::ex 예제 5 (그린 공식)
$f$, $g$가 스칼라함수이고 $\mathbf F=f\operatorname{grad}g$가 발산 정리의 가정을 만족할 때 발산 정리를 적어 보세요.
---
$\operatorname{div}(f\nabla g)=\frac{\partial}{\partial x}(fg_x)+\frac{\partial}{\partial y}(fg_y)+\frac{\partial}{\partial z}(fg_z)=f\nabla^2g+\nabla f\cdot\nabla g$이고 $\mathbf F\cdot\mathbf n=f\,(\mathbf n\cdot\nabla g)=f\frac{\partial g}{\partial n}$이므로
$$\iiint_T\big(f\nabla^2g+\nabla f\cdot\nabla g\big)dV=\iint_Sf\frac{\partial g}{\partial n}dA\qquad(\text{그린 제1공식})$$
$f$와 $g$를 바꾼 식을 빼면 $\nabla f\cdot\nabla g$ 항이 지워져
$$\iiint_T\big(f\nabla^2g-g\nabla^2f\big)dV=\iint_S\Big(f\frac{\partial g}{\partial n}-g\frac{\partial f}{\partial n}\Big)dA\qquad(\text{그린 제2공식})$$
:::

:::key 그린 항등식과 유일성
$$\iiint_T\big(f\nabla^2g+\nabla f\cdot\nabla g\big)dV=\oiint_Sf\frac{\partial g}{\partial n}dA\qquad(\text{제1 항등식})$$
$$\iiint_T\big(f\nabla^2g-g\nabla^2f\big)dV=\oiint_S\Big(f\frac{\partial g}{\partial n}-g\frac{\partial f}{\partial n}\Big)dA\qquad(\text{제2 항등식})$$
라플라스 방정식의 디리클레 문제(경계값이 주어짐)의 해는 유일합니다(Theorem 3).
:::

**유일성.** $f$가 조화함수이고 $S$ 위에서 0이라 하고 제1공식에 $g=f$를 넣으면 $\nabla^2f=0$이고 오른쪽도 0이므로
$$\iiint_T|\operatorname{grad}f|^2\,dV=0$$
$|\operatorname{grad}f|^2$은 연속이고 음이 아니므로 $T$ 전체에서 $\operatorname{grad}f=\mathbf 0$, 곧 $f_x=f_y=f_z=0$이라 $f$는 상수이고, 연속성에 의해 $S$ 위의 값 0과 같습니다.

:::thm 조화함수 (교재 §10.8 Theorem 2)
$f$가 영역 $D$에서 조화함수이고, $D$ 안의 조각마다 매끄럽고 향을 줄 수 있는 닫힌 곡면 $S$ (그것이 둘러싼 영역 $T$도 $D$에 속함)의 모든 점에서 0이면, $f$는 $T$에서 항등적으로 0입니다.
:::

:::thm 라플라스 방정식의 해의 유일성 (교재 §10.8 Theorem 3)
$T$가 발산 정리의 가정을 만족하는 영역이고 $f$가 $T$와 경계 $S$를 포함하는 영역에서 조화함수이면, $f$는 $T$에서 $S$ 위의 값만으로 유일하게 정해집니다.
:::

$S$ 위에서 같은 값을 가지는 두 조화함수 $f_1$, $f_2$의 차 $f_1-f_2$는 조화함수이고 $S$ 위에서 0이므로 Theorem 2에 의해 $T$에서 0, 곧 $f_1=f_2$입니다. 경계값이 주어졌을 때 영역 안의 해를 구하는 문제를 **디리클레 문제**라 하므로, 이 정리는 “라플라스 방정식의 디리클레 문제의 해는 (있다면) 유일하다”는 뜻입니다. 2차원에서는 최대 원리로 같은 결론을 얻습니다[[ch16:18.6|조화함수의 최대 원리와 유일성.]].
` },
      { k: '10.9', p: '463', title: '스토크스 정리', body: R`
지금까지 평면 영역의 이중적분 ⟷ 경계 선적분(그린 정리), 공간 영역의 삼중적분 ⟷ 경계 면적분(발산 정리)을 보았습니다. 마지막 “큰” 정리는 **면적분 ⟷ 경계 선적분**이고, 그린 정리를 곡면으로 일반화한 것입니다.

:::thm 스토크스 정리 (교재 §10.9 Theorem 1)
$S$가 조각마다 매끄럽고 향이 주어진 곡면이고 그 경계가 조각마다 매끄러운 단순 닫힌 곡선 $C$라 하자. $\mathbf F$와 그 1계 편도함수가 $S$를 포함하는 영역에서 연속이면
$$\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=\oint_C\mathbf F\cdot\mathbf r'(s)\,ds$$
$\mathbf n$은 $S$의 단위법선이고, $C$를 도는 방향은 $\mathbf n$에 맞춰 정합니다(오른손 법칙). $\mathbf r'=d\mathbf r/ds$는 단위접선, $s$는 호의 길이입니다.
:::

:::key 스토크스 정리
$$\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=\oint_C\mathbf F\cdot d\mathbf r$$
:::

- **방향**은 오른손 법칙으로 맞춥니다: 엄지를 $\mathbf n$ 방향으로 두면 나머지 손가락이 $C$의 방향입니다(곡면 위를 걸을 때 $C$가 왼쪽에 곡면을 둠).
- 성분으로는 $\mathbf n\,dA=\mathbf N\,du\,dv$, $\mathbf r'\,ds=[dx,dy,dz]$로
$$\iint_R\Big[\Big(\frac{\partial F_3}{\partial y}-\frac{\partial F_2}{\partial z}\Big)N_1+\Big(\frac{\partial F_1}{\partial z}-\frac{\partial F_3}{\partial x}\Big)N_2+\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)N_3\Big]du\,dv=\oint_C(F_1dx+F_2dy+F_3dz)$$
- 경계 $C$가 같다면 **어떤 곡면을 골라도 결과가 같습니다**. 가장 간단한 곡면(보통 평평한 원판)을 고르세요. ($\operatorname{div}\operatorname{curl}\mathbf F=0$이라 두 곡면 사이에 발산 정리를 쓰면 차이가 0)

:::fig f09stokes
:::

:::ex 예제 1 (정리의 확인)
$\mathbf F=[-y,\ x,\ z]$, $S$: 포물면 $z=4-x^2-y^2$, $z\ge0$ (위쪽 법선)에서 양변을 비교하세요.
---
**선적분.** 경계는 $z=0$의 원 $x^2+y^2=4$이고, 위쪽 법선에 맞는 방향은 위에서 보아 반시계입니다. $\mathbf r=[2\cos t,\ 2\sin t,\ 0]$에서 $\mathbf F=[-2\sin t,\ 2\cos t,\ 0]$, $\mathbf r'=[-2\sin t,\ 2\cos t,\ 0]$이므로 $\mathbf F\cdot\mathbf r'=4$, $\oint=8\pi$.
**면적분.** $\operatorname{curl}\mathbf F=[0-0,\ 0-0,\ 1-(-1)]=[0,0,2]$. $\mathbf N=[2x,2y,1]$ (위쪽)이므로 $(\operatorname{curl}\mathbf F)\cdot\mathbf N=2$, 정사영 원판(넓이 $4\pi$) 위에서 적분하면 $8\pi$ ✓.
:::

### 증명

성분 형태가 성립하려면 $F_1$, $F_2$, $F_3$가 들어간 항들이 각각 같으면 됩니다. $F_1$에 대한 식
$$\iint_R\Big(\frac{\partial F_1}{\partial z}N_2-\frac{\partial F_1}{\partial y}N_3\Big)du\,dv=\oint_CF_1\,dx$$
를 $z=f(x,y)$로 쓸 수 있는 곡면에서 보입니다. $u=x$, $v=y$로 두면 $\mathbf N=[-f_x,-f_y,1]$ (위쪽)이고 $R$은 $S$의 정사영 $S^*$, 경계는 그 정사영 $C^*$이므로 왼쪽은
$$\iint_{S^*}\Big(-\frac{\partial F_1}{\partial z}f_y-\frac{\partial F_1}{\partial y}\Big)dx\,dy$$
오른쪽은 $C$ 위에서 $F_1=F_1(x,y,f(x,y))$이므로 $C^*$ 위의 선적분이고, 그린 정리($F_2=0$)를 쓰면 $\oint_{C^*}F_1\,dx=-\iint_{S^*}\frac{\partial}{\partial y}F_1(x,y,f(x,y))\,dx\,dy$. 연쇄법칙으로 $\frac{\partial}{\partial y}F_1(x,y,f)=\frac{\partial F_1}{\partial y}+\frac{\partial F_1}{\partial z}f_y$이므로 두 쪽이 같습니다. $F_2$, $F_3$에 대한 식은 곡면을 $y=g(x,z)$, $x=h(y,z)$로도 쓸 수 있다는 가정에서 같은 방법으로 얻고, 더하면 정리가 됩니다. 이런 조각 유한 개로 나눌 수 있는 곡면에는 발산 정리 때처럼 조각마다 쓰고 더하면 됩니다(공통 경계의 선적분이 반대 방향으로 두 번 나와 지워짐).

:::ex 예제 2 (그린 정리는 특수한 경우)
$\mathbf F=[F_1,F_2]$가 $xy$ 평면에 있고 $S$가 평면 영역이면 $\mathbf n=\mathbf k$이고 $(\operatorname{curl}\mathbf F)\cdot\mathbf k=\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}$이므로 스토크스 정리는
$$\iint_S\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)dA=\oint_C(F_1dx+F_2dy)$$
곧 그린 정리입니다(스토크스 정리의 증명에 그린 정리를 썼으니 서로 기대는 관계입니다).
:::

:::ex 예제 3 (선적분을 면적분으로)
$C$: 평면 $z=2$ 위의 원 $x^2+y^2=9$ (원점에 선 사람이 보아 반시계), $\mathbf F=[-yz^2,\ x,\ ze^{xy}]$일 때 $\oint_C\mathbf F\cdot d\mathbf r$은?
---
$C$를 경계로 하는 곡면으로 평면 $z=2$ 위의 원판을 잡으면 $\mathbf n=\mathbf k$이므로 회전의 $z$성분만 필요합니다: $\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}=1+z^2=5$ ($z=2$). 따라서 $\oint=5\times9\pi=45\pi$.
직접 확인: $\mathbf r=[3\cos t,3\sin t,2]$에서 $\mathbf F\cdot\mathbf r'=(-12\sin t)(-3\sin t)+(3\cos t)(3\cos t)=36\sin^2t+9\cos^2t$, $\int_0^{2\pi}=36\pi+9\pi=45\pi$ ✓. $F_3$의 복잡한 $e^{xy}$는 전혀 필요 없었습니다.
:::

:::ex 예제 4 (곡면 바꾸기)
$\mathbf F=(z,\,x,\,y)$, $S$: 반구면 $x^2+y^2+z^2=4$, $z\ge0$, 바깥 법선. $\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA$는?
---
$\operatorname{curl}\mathbf F=(1-0,\ 1-0,\ 1-0)=(1,1,1)$. 경계는 $z=0$의 원 $x^2+y^2=4$ (위에서 보아 반시계).
같은 경계를 가진 원판 $z=0$, $\mathbf n=\mathbf k$로 바꾸면 $(1,1,1)\cdot\mathbf k=1$이므로 넓이 $4\pi$.
직접 선적분: $\mathbf r=(2\cos t,2\sin t,0)$, $\mathbf F=(0,2\cos t,2\sin t)$, $\mathbf F\cdot\mathbf r'=4\cos^2t$, 적분 $4\pi$ ✓
:::

### 회전의 물리적 의미: 순환

점 $P$를 중심으로 반지름 $r_0$인 작은 원판 $S_{r_0}$ (경계 $C_{r_0}$, 넓이 $A_{r_0}$)에 스토크스 정리와 면적분의 평균값 정리를 쓰면
$$\oint_{C_{r_0}}\mathbf F\cdot\mathbf r'\,ds=\iint_{S_{r_0}}(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=(\operatorname{curl}\mathbf F)\cdot\mathbf n(P^*)\,A_{r_0}$$
($P^*$: 원판 안의 어떤 점). 유체의 속도 $\mathbf F=\mathbf v$에 대해 $\oint_{C}\mathbf v\cdot\mathbf r'\,ds$를 $C$ 둘레의 **순환**이라 하며, 흐름이 그 원을 따라 얼마나 도는지를 잽니다. $r_0\to0$으로 보내면
$$(\operatorname{curl}\mathbf v)\cdot\mathbf n(P)=\lim_{r_0\to0}\frac1{A_{r_0}}\oint_{C_{r_0}}\mathbf v\cdot\mathbf r'\,ds$$
**회전의 법선 성분은 그 점에서의 단위 넓이당 순환**입니다[[ch08:9.9|회전의 정의와 강체 회전.]]. (발산이 단위 부피당 유출이었던 것과 짝을 이룹니다.)

:::ex 예제 5 (닫힌 곡선을 도는 일)
힘 $\mathbf F=[yz^2,\ xz^2,\ 2xyz]$가 임의의 닫힌 곡선(예: 포물면과 원기둥의 교선)을 따라 한 바퀴 돌 때 한 일은?
---
$\mathbf F=\nabla(xyz^2)$이므로 $\operatorname{curl}\mathbf F=\mathbf 0$ (직접: $(2xz-2xz,\ 2yz-2yz,\ z^2-z^2)$). 스토크스 정리에서 $(\operatorname{curl}\mathbf F)\cdot\mathbf n=0$이므로 일은 0입니다. 보존장이라는 사실(§9.7)과 일치합니다.
:::

### 경로 독립의 증명 완성

§10.2 Theorem 3 (b), 곧 “단순연결 영역 $D$에서 $\operatorname{curl}\mathbf F=\mathbf 0$이면 경로 독립”을 이제 증명할 수 있습니다. $C$를 $D$ 안의 임의의 닫힌 경로라 하면, $D$가 단순연결이므로 $C$를 경계로 하는 곡면 $S$를 $D$ 안에서 찾을 수 있습니다. 스토크스 정리에서
$$\oint_C(F_1dx+F_2dy+F_3dz)=\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=0$$
이고, §10.2 Theorem 2에 의해 선적분은 경로에 독립입니다. (구멍이 있는 영역에서는 구멍을 감는 곡선을 경계로 하는 곡면이 영역 안에 없어서 이 논증이 실패하고, §10.2의 반례가 바로 그 경우입니다.)

| 주어진 것 | 쓸 도구 |
|---|---|
| 평면의 닫힌 곡선 위 선적분 | 그린 정리 |
| 닫힌 곡면을 지나는 유량 | 발산 정리 |
| 경계가 있는 곡면의 회전 유량, 공간의 닫힌 곡선 위 선적분 | 스토크스 정리 |
| 퍼텐셜이 있는 장의 선적분 | 끝점의 퍼텐셜 차 |

:::tip 시험 포인트
세 정리 모두 **방향**에서 부호 실수가 가장 많습니다. 그린은 반시계, 발산은 바깥 법선, 스토크스는 오른손 법칙. 답을 쓰기 전에 방향을 한 번 더 확인하세요. 비회전 흐름과 비압축 흐름을 합치면 2차원에서 복소 퍼텐셜이 나옵니다[[ch16:18.4|복소 퍼텐셜과 유체 흐름.]].
:::
` },
    ],
  });
})();
