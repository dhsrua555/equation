/* 개념 정리 — 08 벡터 미분 (Kreyszig 10판 9장, §9.1–9.9). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 8,
    summary: R`힘, 속도, 전기장처럼 크기와 방향을 가진 양을 다루는 **벡터 미적분**의 전반부입니다. 내적·외적으로 각, 일, 넓이, 부피, 모멘트를 계산하고, 벡터함수로 곡선의 길이·곡률과 운동을 기술합니다. 마지막으로 세 미분 연산자 **기울기**(가장 가파른 방향), **발산**(샘의 세기), **회전**(소용돌이의 세기)을 정의합니다. 다음 단원의 적분 정리가 모두 이 연산자들 위에 세워집니다.`,
    goals: [
      R`벡터의 성분, 길이, 단위벡터를 계산할 수 있다`,
      R`내적으로 각, 일, 정사영, 평면의 법선을 구할 수 있다`,
      R`외적과 삼중곱으로 넓이, 부피, 모멘트, 회전 속도를 구할 수 있다`,
      R`곡선의 매개변수화, 호의 길이, 곡률, 속도·가속도를 구할 수 있다`,
      R`방향도함수, 최대 증가율, 곡면의 법선과 접평면을 구할 수 있다`,
      R`발산과 회전을 계산하고 물리적 의미(연속방정식, 강체 회전)를 설명할 수 있다`,
    ],
    sections: [
      { k: '9.1', p: '354', title: '2차원·3차원 공간의 벡터', body: R`
**벡터**는 크기와 방향을 가진 양이고, 시작점과 끝점이 있는 화살표로 나타냅니다. 크기와 방향이 같으면 위치와 무관하게 같은 벡터입니다. 직교좌표에서는 성분 $\mathbf a=[a_1,a_2,a_3]=a_1\mathbf i+a_2\mathbf j+a_3\mathbf k$로 쓰고(교재 Theorem 1: 벡터 ↔ 순서쌍), 크기는
$$|\mathbf a|=\sqrt{a_1^2+a_2^2+a_3^2}$$
- 점 $P(x_1,y_1,z_1)$에서 $Q(x_2,y_2,z_2)$로 가는 벡터: $[x_2-x_1,\ y_2-y_1,\ z_2-z_1]$. **위치벡터**는 원점에서 시작하는 벡터.
- **덧셈**은 성분별(평행사변형 법칙), **스칼라배** $c\mathbf a$는 크기 $|c|$배, $c<0$이면 방향 반대.
- **단위벡터** $\mathbf a/|\mathbf a|$: 방향만 남김.

:::ex 예제
$\mathbf a=[4,0,3]$의 크기와 단위벡터, 그리고 힘 $\mathbf p=[1,2,0]$, $\mathbf q=[0,-3,4]$의 합력은?
---
$|\mathbf a|=5$, 단위벡터 $[0.8,\ 0,\ 0.6]$. 합력 $\mathbf p+\mathbf q=[1,-1,4]$, 크기 $\sqrt{18}=3\sqrt2$.
:::

$n$개의 실수의 순서쌍으로 확장한 $\mathbb R^n$이 선형대수의 벡터공간입니다[[ch06:7.9|벡터공간 $\mathbb R^n$.]].
` },
      { k: '9.2', p: '361', title: '내적', body: R`
:::key 내적과 정사영
$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\gamma=a_1b_1+a_2b_2+a_3b_3$$
$$p=|\mathbf a|\cos\gamma=\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|}\ (\mathbf b\text{ 방향 성분}),\qquad W=\mathbf F\cdot\mathbf d\ (\text{일})$$
:::

- **직교 판정**(교재 Theorem 1): $\mathbf a\cdot\mathbf b=0\iff\mathbf a\perp\mathbf b$ (영벡터가 아닐 때).
- $|\mathbf a|=\sqrt{\mathbf a\cdot\mathbf a}$이고, 각은 $\cos\gamma=\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$.
- **부등식**: 코시-슈바르츠 $|\mathbf a\cdot\mathbf b|\le|\mathbf a||\mathbf b|$, 삼각부등식 $|\mathbf a+\mathbf b|\le|\mathbf a|+|\mathbf b|$, 평행사변형 등식 $|\mathbf a+\mathbf b|^2+|\mathbf a-\mathbf b|^2=2(|\mathbf a|^2+|\mathbf b|^2)$. 이 부등식들은 일반 내적공간에서도 성립합니다[[ch06:7.9|내적공간과 코시-슈바르츠 부등식.]].
- **평면의 법선**: 평면 $ax+by+cz=d$의 법선벡터는 $[a,b,c]$. 평면 위 두 점을 잇는 벡터와 내적이 0이기 때문입니다.

:::ex 예제 1 (일과 정사영)
힘 $\mathbf F=[2,5,0]$ N이 물체를 $\mathbf d=[3,1,0]$ m 옮길 때의 일과 이동 방향의 힘 성분은?
---
$W=\mathbf F\cdot\mathbf d=6+5=11$ J. 이동 방향 성분 $\dfrac{11}{|\mathbf d|}=\dfrac{11}{\sqrt{10}}\approx3.48$ N. 수직 성분은 일을 하지 않습니다.
:::

:::ex 예제 2 (점과 평면 사이의 거리)
점 $(1,1,1)$과 평면 $2x-y+2z=5$ 사이의 거리는?
---
단위법선 $\mathbf n=\frac13[2,-1,2]$. 평면 위의 점 $(0,-5,0)$에서 $(1,1,1)$로 가는 벡터 $[1,6,1]$을 $\mathbf n$에 정사영하면 $\frac13(2-6+2)=-\frac23$. 거리 $\frac23$.
:::

함수의 **내적** $\int fg\,dx$도 같은 발상입니다. 삼각함수들이 서로 “직교”한다는 것이 푸리에 급수의 기초입니다[[ch10:11.5|함수의 직교성.]].
` },
      { k: '9.3', p: '368', title: '외적과 삼중곱', body: R`
:::def 외적
$\mathbf v=\mathbf a\times\mathbf b$는 크기 $|\mathbf a||\mathbf b|\sin\gamma$ (두 벡터가 만드는 평행사변형의 넓이), 방향은 $\mathbf a$, $\mathbf b$에 모두 수직이고 $\mathbf a,\mathbf b,\mathbf v$가 **오른손 좌표계**를 이루는 벡터입니다.
:::

:::key 내적·외적·삼중곱
$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\gamma=a_1b_1+a_2b_2+a_3b_3$$
$$\mathbf a\times\mathbf b=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix},\qquad |\mathbf a\times\mathbf b|=|\mathbf a||\mathbf b|\sin\gamma$$
$$(\mathbf a\ \mathbf b\ \mathbf c)=\mathbf a\cdot(\mathbf b\times\mathbf c)=\det\begin{pmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{pmatrix}$$
:::

- **성질**(교재 Theorem 1): $\mathbf b\times\mathbf a=-\mathbf a\times\mathbf b$ (반교환), $\mathbf a\times\mathbf a=\mathbf 0$, 분배법칙은 성립하지만 **결합법칙은 성립하지 않음**. $\mathbf i\times\mathbf j=\mathbf k$, $\mathbf j\times\mathbf k=\mathbf i$, $\mathbf k\times\mathbf i=\mathbf j$.
- 행렬식 전개는 선형대수의 3×3 행렬식과 같습니다[[ch06:7.7|행렬식의 전개.]].
- **힘의 모멘트** $\mathbf m=\mathbf r\times\mathbf p$ (회전축에 대한 돌림힘), **회전하는 물체의 속도** $\mathbf v=\mathbf w\times\mathbf r$ ($\mathbf w$: 각속도 벡터).
- **삼중곱**(Theorem 2): $|(\mathbf a\ \mathbf b\ \mathbf c)|$는 평행육면체의 부피, 사면체는 그 $\frac16$. 세 벡터가 일차독립 $\iff(\mathbf a\ \mathbf b\ \mathbf c)\ne0$. 순환해도 값이 같습니다: $(\mathbf a\ \mathbf b\ \mathbf c)=(\mathbf b\ \mathbf c\ \mathbf a)$.

:::ex 예제 1 (삼각형의 넓이)
$P(1,0,0)$, $Q(0,2,0)$, $R(0,0,3)$을 꼭짓점으로 하는 삼각형의 넓이는?
---
$\overrightarrow{PQ}=(-1,2,0)$, $\overrightarrow{PR}=(-1,0,3)$, $\overrightarrow{PQ}\times\overrightarrow{PR}=(6,3,2)$, 크기 7.
넓이는 평행사변형의 절반인 $\tfrac72$. 외적 $(6,3,2)$는 이 평면의 법선이기도 합니다.
:::

:::ex 예제 2 (모멘트)
점 $\mathbf r=[2,1,0]$ m에 힘 $\mathbf p=[0,0,10]$ N이 작용할 때 원점에 대한 모멘트는?
---
$\mathbf m=\mathbf r\times\mathbf p=[1\cdot10-0,\ 0-2\cdot10,\ 0]=[10,-20,0]$, 크기 $10\sqrt5\approx22.4$ N·m.
:::

:::ex 예제 3 (사면체의 부피)
원점과 $\mathbf a=[1,1,0]$, $\mathbf b=[0,1,1]$, $\mathbf c=[1,0,1]$의 끝점이 만드는 사면체
---
$(\mathbf a\ \mathbf b\ \mathbf c)=\det\begin{pmatrix}1&1&0\\0&1&1\\1&0&1\end{pmatrix}=1\cdot1-1\cdot(0-1)+0=2$. 부피 $\frac16\cdot2=\frac13$.
:::
` },
      { k: '9.4', p: '375', title: '벡터함수와 벡터장, 벡터함수의 미분', body: R`
공간의 각 점에 스칼라를 대응시키면 **스칼라장**(온도, 퍼텐셜), 벡터를 대응시키면 **벡터장**(속도장, 힘의 장)입니다.
- **중력장**: 질점이 만드는 힘 $\mathbf p=-\dfrac c{r^3}\mathbf r$ (크기가 $1/r^2$에 비례, 중심을 향함).
- **회전 속도장**: $\mathbf v=\mathbf w\times\mathbf r$.

**미분.** 벡터함수 $\mathbf v(t)$의 도함수는 성분별로 미분합니다: $\mathbf v'=[v_1',v_2',v_3']$. 곱의 미분법이 그대로 성립합니다.
$$(\mathbf u\cdot\mathbf v)'=\mathbf u'\cdot\mathbf v+\mathbf u\cdot\mathbf v',\qquad(\mathbf u\times\mathbf v)'=\mathbf u'\times\mathbf v+\mathbf u\times\mathbf v'\ (\text{순서 유지})$$

:::ex 예제 (크기가 일정한 벡터)
$|\mathbf v(t)|$가 일정하면 $\mathbf v'\perp\mathbf v$임을 보이세요.
---
$\mathbf v\cdot\mathbf v=$상수를 미분하면 $2\mathbf v\cdot\mathbf v'=0$. 원운동에서 속도가 위치벡터에 수직인 이유입니다.
:::

편도함수 $\partial\mathbf v/\partial x$ 등도 성분별로 구합니다. 곡면을 $\mathbf r(u,v)$로 나타낼 때 $\mathbf r_u$, $\mathbf r_v$가 접벡터가 됩니다[[ch09:10.5|곡면의 매개변수 표현과 법선.]].
` },
      { k: '9.5', p: '381', title: '곡선, 호의 길이, 곡률, 비틀림', body: R`
공간곡선은 **매개변수 표현** $\mathbf r(t)=[x(t),y(t),z(t)]$로 나타냅니다. $t$가 증가하는 방향이 곡선의 **양의 방향**입니다. 예: 원 $[a\cos t,a\sin t,0]$, 타원 $[a\cos t,b\sin t,0]$, 직선 $\mathbf a+t\mathbf b$, 원형 나선 $[a\cos t,a\sin t,ct]$.

:::key 곡선의 기본량
$$s=\int_a^b|\mathbf r'(t)|\,dt,\qquad \mathbf u=\frac{\mathbf r'}{|\mathbf r'|},\qquad \kappa=\frac{|\mathbf r'\times\mathbf r''|}{|\mathbf r'|^3}$$
:::

- **접선벡터** $\mathbf r'(t)$, 단위접선벡터 $\mathbf u$. 점 $P$에서의 접선: $\mathbf q(w)=\mathbf r+w\mathbf r'$.
- **호의 길이**를 매개변수로 쓰면($|\mathbf r'(s)|=1$) 곡률이 $\kappa=|\mathbf u'(s)|=|\mathbf r''(s)|$로 간단해집니다. 곡률은 방향이 바뀌는 빠르기이고, $1/\kappa$가 곡률 반지름입니다.
- **비틀림** $\tau$: 곡선이 평면에서 벗어나는 정도. 평면곡선은 $\tau=0$. $\tau=\dfrac{(\mathbf r'\ \mathbf r''\ \mathbf r''')}{|\mathbf r'\times\mathbf r''|^2}$.
- **운동**: 속도 $\mathbf v=\mathbf r'$, 가속도 $\mathbf a=\mathbf r''$. 가속도는 접선 성분 $\frac{d^2s}{dt^2}$와 법선 성분 $\kappa\big(\frac{ds}{dt}\big)^2$로 나뉩니다. 반지름 $R$, 각속도 $\omega$인 원운동의 **구심가속도**는 크기 $\omega^2R$로 중심을 향합니다. 회전 좌표계에서 움직이면 **코리올리 가속도**가 추가됩니다.

:::ex 예제 1 (나선)
나선 $\mathbf r=(a\cos t,\,a\sin t,\,ct)$의 한 바퀴 길이와 곡률은?
---
$|\mathbf r'|=\sqrt{a^2+c^2}$이므로 한 바퀴($0\le t\le2\pi$)의 길이는 $2\pi\sqrt{a^2+c^2}$.
$|\mathbf r'\times\mathbf r''|=a\sqrt{a^2+c^2}$이므로 $\kappa=\dfrac{a}{a^2+c^2}$ (상수). $c=0$이면 원의 곡률 $\frac1a$.
:::

:::ex 예제 2 (평면곡선)
포물선 $y=x^2$의 원점에서의 곡률 반지름은?
---
$\mathbf r=[t,t^2,0]$, $\mathbf r'=[1,2t,0]$, $\mathbf r''=[0,2,0]$. $t=0$에서 $|\mathbf r'\times\mathbf r''|=2$, $|\mathbf r'|=1$이므로 $\kappa=2$, 곡률 반지름 $\frac12$.
:::

곡선의 매개변수화는 다음 단원의 선적분 계산의 첫 단계입니다[[ch09:10.1|선적분.]].
` },
      { k: '9.6', p: '392', title: '다변수 함수 복습 (선택)', body: R`
다음 절들에서 쓰는 두 도구입니다.

**연쇄법칙**(교재 Theorem 1): $w=f(x,y,z)$이고 $x,y,z$가 $u,v$의 함수이면
$$\frac{\partial w}{\partial u}=\frac{\partial w}{\partial x}\frac{\partial x}{\partial u}+\frac{\partial w}{\partial y}\frac{\partial y}{\partial u}+\frac{\partial w}{\partial z}\frac{\partial z}{\partial u}$$
곡선 $\mathbf r(t)$ 위에서는 $\frac{d}{dt}f(\mathbf r(t))=\nabla f\cdot\mathbf r'(t)$. 다음 절의 방향도함수와 선적분의 경로 독립이 이 식에서 나옵니다.[[@base:ch04:4.2|다변수 연쇄법칙과 야코비 행렬.]]

**평균값 정리**(Theorem 2): $f(\mathbf x_0+\mathbf h)-f(\mathbf x_0)=\nabla f(\mathbf x_0+\theta\mathbf h)\cdot\mathbf h$ ($0<\theta<1$).

:::ex 예제
$w=x^2+y^2$, $x=r\cos\theta$, $y=r\sin\theta$일 때 $\partial w/\partial\theta$는?
---
$2x(-r\sin\theta)+2y(r\cos\theta)=-2r^2\cos\theta\sin\theta+2r^2\sin\theta\cos\theta=0$. $w=r^2$은 $\theta$와 무관하니 당연합니다.
:::
` },
      { k: '9.7', p: '395', title: '기울기와 방향도함수', body: R`
스칼라 함수 $f$의 **기울기** $\nabla f=\operatorname{grad}f$는 $f$가 가장 빨리 증가하는 방향을 가리키고, 그 크기가 최대 증가율입니다(교재 Theorem 1).[[@base:ch04:4.1|편미분과 선형 근사: 방향도함수 $\nabla f\cdot\mathbf u$.]] 좌표계와 무관한 벡터입니다.

:::key 기울기와 방향도함수
$$\nabla f=\Big(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\Big),\qquad D_{\mathbf b}f=\frac{\mathbf b\cdot\nabla f}{|\mathbf b|}$$
$$\max_{\mathbf b}D_{\mathbf b}f=|\nabla f|,\qquad \text{곡면 } f=c\text{의 법선벡터}=\nabla f$$
:::

- **방향도함수** $D_{\mathbf b}f$: 방향 $\mathbf b$로 단위길이 움직일 때 $f$의 변화율. $D_{\mathbf b}f=|\nabla f|\cos\gamma$이므로 $\gamma=0$일 때 최대.
- **곡면의 법선**(Theorem 2): 곡면 $f(x,y,z)=c$ 위의 곡선을 따라 $f$가 일정하므로 $\nabla f\cdot\mathbf r'=0$. 즉 $\nabla f$는 모든 접선에 수직입니다. 접평면: $\nabla f(P)\cdot(\mathbf x-\mathbf p)=0$. 평면에서는 기울기가 **등고선에 수직**이고, 이것이 직교 궤적의 원리입니다[[ch01:1.6|직교 궤적.]].
- **퍼텐셜**: $\mathbf v=\nabla f$인 $f$가 있으면 $\mathbf v$를 **보존장**(기울기장)이라 합니다. 중력장은 퍼텐셜 $f=c/r$을 가지며, 이 $f$는 **라플라스 방정식** $\nabla^2f=0$을 만족합니다(Theorem 3). 보존장에서는 일이 경로에 무관합니다[[ch09:10.2|경로 독립과 퍼텐셜.]]. 전기장 $\mathbf E=-\nabla\Phi$도 같은 구조입니다[[ch16:18.1|정전기 퍼텐셜.]].

:::ex 예제 1
$f=xy^2+z^3$의 $P(1,-1,1)$에서 $\mathbf a=(2,1,-2)$ 방향의 방향도함수와 최대 증가율은?
---
$\nabla f=(y^2,\ 2xy,\ 3z^2)=(1,-2,3)$. $|\mathbf a|=3$이므로
$$D_{\mathbf a}f=\frac{2-2-6}{3}=-2,\qquad\max=|\nabla f|=\sqrt{14}$$
:::

:::ex 예제 2 (접평면)
타원면 $x^2+2y^2+3z^2=6$ 위의 점 $(1,1,1)$에서의 접평면은?
---
$\nabla f=(2x,4y,6z)=(2,4,6)$. $2(x-1)+4(y-1)+6(z-1)=0$, 즉 $x+2y+3z=6$.
:::

:::warn 단위벡터
방향벡터를 단위벡터로 만들지 않는 실수가 가장 많습니다. 반드시 $|\mathbf b|$로 나누세요.
:::
` },
      { k: '9.8', p: '402', title: '벡터장의 발산', body: R`
$$\operatorname{div}\mathbf v=\nabla\cdot\mathbf v=\frac{\partial v_1}{\partial x}+\frac{\partial v_2}{\partial y}+\frac{\partial v_3}{\partial z}$$
발산은 스칼라이고 좌표계에 무관합니다(교재 Theorem 1).

**물리적 의미.** 한 점 주위의 작은 상자에서 **단위 부피당 단위 시간에 흘러나가는 양**, 즉 샘(source)의 세기입니다. 유체의 밀도를 $\rho$라 하면 상자 여섯 면의 유출입을 더해 **연속방정식**을 얻습니다.
$$\frac{\partial\rho}{\partial t}+\operatorname{div}(\rho\mathbf v)=0$$
- 정상 흐름이면 $\operatorname{div}(\rho\mathbf v)=0$.
- **비압축성** 유체($\rho$ 일정)이면 $\operatorname{div}\mathbf v=0$ (들어온 만큼 나감). 2차원 이상 유체 흐름을 복소 퍼텐셜로 다루는 출발점입니다[[ch16:18.4|비압축·비회전 흐름과 복소 퍼텐셜.]].

**라플라시안.** 기울기의 발산 $\operatorname{div}(\nabla f)=\nabla^2f=f_{xx}+f_{yy}+f_{zz}$. 중력 퍼텐셜은 질량이 없는 곳에서 $\nabla^2f=0$을 만족합니다. 열이 흐르는 물체에서 열의 흐름에 발산을 적용하면 열방정식이 나옵니다[[ch11:12.5|열방정식의 유도.]].

:::ex 예제
$\mathbf v=(x^2y,\ xyz,\ -xz^2)$의 발산과 점 $(1,2,1)$에서의 값
---
$\operatorname{div}\mathbf v=2xy+xz-2xz=2xy-xz$. $(1,2,1)$에서 $4-1=3>0$ (샘).
:::

발산이 “단위 부피당 유출량”이라는 뜻은 발산 정리로 정확해집니다[[ch09:10.7|발산 정리.]].
` },
      { k: '9.9', p: '406', title: '벡터장의 회전', body: R`
$$\operatorname{curl}\mathbf v=\nabla\times\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\ \partial_x&\partial_y&\partial_z\\ v_1&v_2&v_3\end{vmatrix}=\Big(\frac{\partial v_3}{\partial y}-\frac{\partial v_2}{\partial z},\ \frac{\partial v_1}{\partial z}-\frac{\partial v_3}{\partial x},\ \frac{\partial v_2}{\partial x}-\frac{\partial v_1}{\partial y}\Big)$$
회전은 벡터장이 한 점 주위를 얼마나, 어느 축으로 도는지를 나타냅니다. 오른손 좌표계를 기준으로 하며 좌표계를 돌려도 변하지 않습니다(Theorem 3).

**강체 회전**(교재 Theorem 1): 각속도 $\boldsymbol\omega$로 도는 강체의 속도장 $\mathbf v=\boldsymbol\omega\times\mathbf r$은 $\operatorname{curl}\mathbf v=2\boldsymbol\omega$. 회전의 절반이 국소적인 각속도입니다.

:::key 발산과 회전
$$\operatorname{div}\mathbf v=\nabla\cdot\mathbf v,\qquad \operatorname{curl}\mathbf v=\nabla\times\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\ \partial_x&\partial_y&\partial_z\\ v_1&v_2&v_3\end{vmatrix}$$
$$\operatorname{curl}(\nabla f)=\mathbf 0,\qquad \operatorname{div}(\operatorname{curl}\mathbf v)=0$$
:::

두 항등식(Theorem 2)은 혼합편미분의 대칭성 $f_{xy}=f_{yx}$에서 나옵니다. $\operatorname{curl}\mathbf v=\mathbf 0$인 장을 **비회전장**이라 합니다. 기울기장은 항상 비회전이고, 단순연결 영역에서는 그 역도 성립합니다(비회전 ⟹ 기울기장)[[ch09:10.2|회전이 0이면 퍼텐셜 존재.]]. 회전이 “단위 넓이당 순환”이라는 뜻은 스토크스 정리로 정확해집니다[[ch09:10.9|스토크스 정리.]].

:::ex 예제 1 (강체 회전)
$z$축 둘레로 각속도 3으로 도는 강체의 속도장과 회전은?
---
$\boldsymbol\omega=(0,0,3)$, $\mathbf v=\boldsymbol\omega\times\mathbf r=(-3y,\ 3x,\ 0)$.
$\operatorname{curl}\mathbf v=\big(0,\ 0,\ 3-(-3)\big)=(0,0,6)=2\boldsymbol\omega$ ✓. 발산은 0 (강체는 압축되지 않음).
:::

:::key 곱의 미분 공식
$$\nabla(fg)=f\nabla g+g\nabla f,\qquad \nabla\cdot(f\mathbf v)=f\,\nabla\cdot\mathbf v+\mathbf v\cdot\nabla f$$
$$\nabla\times(f\mathbf v)=\nabla f\times\mathbf v+f\,\nabla\times\mathbf v$$
:::

:::ex 예제 2 (퍼텐셜 찾기)
$\mathbf F=(yz,\,xz,\,xy)$가 비회전임을 확인하고 퍼텐셜을 구하세요.
---
$\operatorname{curl}\mathbf F=(x-x,\ y-y,\ z-z)=\mathbf 0$. $f_x=yz$에서 $f=xyz+g(y,z)$. $f_y=xz+g_y=xz$이므로 $g_y=0$, $f_z=xy+g_z=xy$이므로 $g$는 상수.
$$f=xyz$$
:::

| 연산 | 입력 → 출력 | 의미 |
|---|---|---|
| $\nabla f$ | 스칼라 → 벡터 | 가장 가파른 방향과 증가율 |
| $\nabla\cdot\mathbf v$ | 벡터 → 스칼라 | 단위 부피당 유출(샘) |
| $\nabla\times\mathbf v$ | 벡터 → 벡터 | 회전축과 회전의 세기 |
| $\nabla^2f$ | 스칼라 → 스칼라 | 주변 평균과의 차이 |
` },
    ],
  });
})();
