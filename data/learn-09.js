/* 개념 정리 — 09 벡터 적분과 적분 정리 (Kreyszig 10판 10장, §10.1–10.9). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 9,
    summary: R`곡선 위의 적분(선적분), 곡면 위의 적분(면적분), 그리고 이것들을 영역 내부의 적분과 잇는 세 정리, **그린·가우스(발산)·스토크스 정리**를 다룹니다. 세 정리는 모두 "경계에서의 적분 = 내부에서의 미분의 적분"이라는 한 가지 아이디어이고, 유체·열·전자기학의 기본 방정식이 여기서 나옵니다. 어떤 정리를 써야 계산이 가장 짧아지는지 고르는 것이 시험의 핵심입니다.`,
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
곡선 $C:\mathbf r(t)$, $a\le t\le b$를 따라 힘 $\mathbf F$가 한 일은 작은 변위 $d\mathbf r$에 대한 일 $\mathbf F\cdot d\mathbf r$을 모두 더한 것입니다. 곡선은 매끄럽고(연속인 $\mathbf r'\ne\mathbf 0$), $t$가 증가하는 방향이 곡선의 방향입니다[[ch08:9.5|곡선의 매개변수 표현.]].

:::key 선적분
$$\int_C\mathbf F\cdot d\mathbf r=\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt,\qquad \int_C f\,ds=\int_a^b f(\mathbf r(t))\,|\mathbf r'(t)|\,dt$$
:::

- 성분으로 쓰면 $\int_C(F_1\,dx+F_2\,dy+F_3\,dz)$.
- **성질**: 선형, 경로를 이어 붙이면 적분도 더해짐, **방향을 바꾸면 부호가 바뀜**. 호의 길이에 대한 적분 $\int f\,ds$ (질량, 길이)는 방향과 무관합니다.
- **매개변수에 무관**(교재 Theorem 1): 같은 방향을 유지하는 매개변수 변환에 대해 값이 변하지 않습니다. 그래서 가장 계산하기 편한 매개변수화를 고르면 됩니다.
- **일 = 운동에너지 증가**: $\mathbf F=m\mathbf r''$이면 $\int\mathbf F\cdot d\mathbf r=\frac m2|\mathbf v|^2\Big|_a^b$.

:::ex 예제 1
$\mathbf F=(xy,\ z,\ x)$, $C:\mathbf r=(t,t^2,t^3)$, $0\le t\le1$
---
$\mathbf F(\mathbf r)=(t^3,t^3,t)$, $\mathbf r'=(1,2t,3t^2)$. 내적 $t^3+2t^4+3t^3=4t^3+2t^4$.
$$\int_0^1(4t^3+2t^4)\,dt=1+\tfrac25=\tfrac75$$
:::

:::ex 예제 2 (경로에 따라 달라짐)
$\mathbf F=(y,\,-x)$를 $(0,0)$에서 $(1,1)$까지 (a) 직선 $y=x$, (b) 포물선 $y=x^2$을 따라 적분하세요.
---
(a) $\mathbf r=(t,t)$: $(t,-t)\cdot(1,1)=0$, 적분 0.
(b) $\mathbf r=(t,t^2)$: $(t^2,-t)\cdot(1,2t)=-t^2$, 적분 $-\frac13$.
끝점이 같아도 값이 다릅니다(교재 Theorem 2: 일반적으로 선적분은 경로에 의존). 다음 절이 "언제 경로와 무관한가"입니다.
:::

복소 선적분 $\int_Cf(z)\,dz$는 이런 실수 선적분 두 개를 묶은 것입니다[[ch13:14.1|복소 선적분.]].
` },
      { k: '10.2', p: '419', title: '선적분의 경로 독립', body: R`
:::key 경로 독립
$$\mathbf F=\nabla f\ \Rightarrow\ \int_A^B\mathbf F\cdot d\mathbf r=f(B)-f(A)$$
$$\text{단순연결 영역에서}\quad \operatorname{curl}\mathbf F=\mathbf 0\iff\mathbf F=\nabla f\iff\oint_C\mathbf F\cdot d\mathbf r=0$$
:::

- **Theorem 1**: 영역 $D$에서 선적분이 경로에 무관 $\iff$ $\mathbf F$가 기울기장($\mathbf F=\nabla f$). 증명의 핵심은 연쇄법칙 $\frac{d}{dt}f(\mathbf r(t))=\nabla f\cdot\mathbf r'$ (미적분학의 기본정리의 벡터판)[[ch08:9.7|기울기와 퍼텐셜.]].
- **Theorem 2**: 경로 독립 $\iff$ 모든 닫힌 경로에서 적분이 0.
- **Theorem 3 (완전성 판정)**: $F_1dx+F_2dy+F_3dz$가 어떤 $f$의 전미분 $df$일 때 **완전**하다고 합니다. 성분이 연속 편도함수를 가지고 영역이 **단순연결**이면, 완전 $\iff\operatorname{curl}\mathbf F=\mathbf 0$. 평면에서는 $\partial F_2/\partial x=\partial F_1/\partial y$. 1계 완전미분방정식의 조건 $M_y=N_x$와 같은 식입니다[[ch01:1.4|완전미분방정식.]].

**단순연결**: 영역 안의 모든 닫힌 곡선을 영역을 벗어나지 않고 한 점으로 줄일 수 있는 영역. 구멍이 있는 평면 영역은 단순연결이 아닙니다(3차원에서는 구 껍질 사이 영역은 단순연결, 원환체는 아님).

:::ex 예제 (퍼텐셜로 끝내기)
$\displaystyle\int_C\big[(2xy+z^2)dx+x^2dy+2xz\,dz\big]$, $C$: $(0,0,0)$에서 $(1,2,3)$까지 임의의 경로
---
$\operatorname{curl}\mathbf F=(0-0,\ 2z-2z,\ 2x-2x)=\mathbf 0$, $\mathbb R^3$은 단순연결이므로 경로에 무관합니다.
$f_x=2xy+z^2$에서 $f=x^2y+xz^2+g(y,z)$, $f_y=x^2$, $f_z=2xz$와 비교하면 $g$는 상수.
$$\int_C=f(1,2,3)-f(0,0,0)=2+9=11$$
:::

:::warn 단순연결 조건
$\mathbf F=\Big(\dfrac{-y}{x^2+y^2},\dfrac{x}{x^2+y^2}\Big)$는 원점 밖에서 회전이 0이지만 원점을 도는 원 위의 적분은 $2\pi$입니다. 원점에 구멍이 있어 영역이 단순연결이 아니기 때문입니다. 이것은 복소적분 $\oint\frac{dz}z=2\pi i$의 허수부와 같은 계산입니다[[ch13:14.2|코시 적분 정리와 단순연결 영역.]].
:::

물리에서 기울기장은 **보존력**(에너지 보존)이고, 유체에서 비회전 흐름의 속도 퍼텐셜이 이것입니다[[ch16:18.4|비회전 흐름과 속도 퍼텐셜.]].
` },
      { k: '10.3', p: '426', title: '이중적분 복습 (선택)', body: R`
이중적분 $\iint_Rf(x,y)\,dx\,dy$는 반복적분으로 계산합니다: 영역을 $a\le x\le b$, $g(x)\le y\le h(x)$로 쓰면 $\int_a^b\big[\int_{g(x)}^{h(x)}f\,dy\big]dx$. 넓이($f=1$), 질량($f=$밀도), 무게중심 $\bar x=\frac1M\iint x\,f\,dA$, 관성모멘트 $I_x=\iint y^2f\,dA$ 등을 계산합니다.

:::key 이중적분의 변수변환
$$\iint_Rf(x,y)\,dx\,dy=\iint_{R^*}f\big(x(u,v),y(u,v)\big)\,\Big|\frac{\partial(x,y)}{\partial(u,v)}\Big|\,du\,dv,\qquad \frac{\partial(x,y)}{\partial(u,v)}=\begin{vmatrix}x_u&x_v\\y_u&y_v\end{vmatrix}$$
$$\text{극좌표: } dx\,dy=r\,dr\,d\theta$$
:::

야코비안은 작은 사각형 $du\,dv$가 옮겨진 평행사변형의 넓이 비율입니다(2×2 행렬식)[[ch06:7.7|행렬식과 넓이.]].

:::ex 예제 1 (극좌표)
반지름 2인 원판에서 $\iint(x^2+y^2)\,dA$
---
$\int_0^{2\pi}\!\int_0^2r^2\cdot r\,dr\,d\theta=2\pi\cdot\frac{2^4}4=8\pi$.
:::

:::ex 예제 2 (선형 변환)
$R:|x|+|y|\le1$에서 $\iint(x+y)^2\,dA$
---
$u=x+y$, $v=x-y$로 두면 $R$은 정사각형 $-1\le u,v\le1$. $x=\frac{u+v}2$, $y=\frac{u-v}2$에서 $\Big|\frac{\partial(x,y)}{\partial(u,v)}\Big|=\Big|{-\tfrac14-\tfrac14}\Big|=\tfrac12$.
$$\int_{-1}^1\!\int_{-1}^1u^2\cdot\tfrac12\,du\,dv=\tfrac12\cdot\tfrac23\cdot2=\tfrac23$$
:::
` },
      { k: '10.4', p: '433', title: '평면에서의 그린 정리', body: R`
:::key 그린 정리
$$\iint_R\Big(\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}\Big)dx\,dy=\oint_C\big(F_1\,dx+F_2\,dy\big),\qquad A=\frac12\oint_C(x\,dy-y\,dx)$$
:::

- $C$는 영역 $R$을 **왼쪽에 두고** 도는 방향입니다(바깥 경계는 반시계, 안쪽 구멍의 경계는 시계 방향). 구멍이 있는 영역에서도 모든 경계를 합치면 성립합니다.
- 벡터 형태: $\iint_R(\operatorname{curl}\mathbf F)\cdot\mathbf k\,dA=\oint_C\mathbf F\cdot d\mathbf r$. 3차원 스토크스 정리의 평면판입니다.
- **넓이 공식**: $F_1=0$, $F_2=x$이면 $A=\oint x\,dy$; $F_1=-y$, $F_2=0$이면 $A=-\oint y\,dx$. 극좌표로는 $A=\frac12\oint r^2d\theta$.
- **라플라시안의 적분**: $F_1=-\partial w/\partial y$, $F_2=\partial w/\partial x$로 두면 $\iint_R\nabla^2w\,dA=\oint_C\frac{\partial w}{\partial n}ds$ (법선 도함수). 조화함수의 경계 법선 도함수 적분은 0입니다.

:::ex 예제 1
$\oint_C(xy\,dx+x^2\,dy)$, $C$: 단위정사각형 $[0,1]^2$의 경계(반시계)
---
$\partial F_2/\partial x-\partial F_1/\partial y=2x-x=x$. $\iint_Rx\,dA=\int_0^1\!\int_0^1x\,dx\,dy=\frac12$.
네 변을 따로 적분하는 것보다 훨씬 짧습니다.
:::

:::ex 예제 2 (넓이)
성망형(astroid) $\mathbf r=(\cos^3t,\ \sin^3t)$, $0\le t\le2\pi$가 둘러싼 넓이
---
$x\,dy-y\,dx=\big(3\cos^4t\sin^2t+3\sin^4t\cos^2t\big)dt=3\cos^2t\sin^2t\,dt=\tfrac34\sin^22t\,dt$.
$$A=\frac12\int_0^{2\pi}\tfrac34\sin^22t\,dt=\frac12\cdot\frac{3\pi}4=\frac{3\pi}8$$
:::

코시 적분 정리의 가장 짧은 증명이 그린 정리와 코시–리만 방정식입니다[[ch13:14.2|코시 적분 정리.]][[ch12:13.4|코시–리만 방정식.]].
` },
      { k: '10.5', p: '439', title: '면적분을 위한 곡면', body: R`
곡면의 표현: $z=f(x,y)$, $g(x,y,z)=0$, 또는 **매개변수 표현** $\mathbf r(u,v)=[x(u,v),y(u,v),z(u,v)]$ ($(u,v)\in R$). 면적분 계산에는 매개변수 표현이 가장 편합니다.
- 원기둥 $x^2+y^2=a^2$: $\mathbf r=[a\cos u,\ a\sin u,\ v]$
- 구 $x^2+y^2+z^2=a^2$: $\mathbf r=[a\cos v\cos u,\ a\cos v\sin u,\ a\sin v]$ ($u$: 경도, $v$: 위도)
- 원뿔 $z=\sqrt{x^2+y^2}$: $\mathbf r=[u\cos v,\ u\sin v,\ u]$

:::key 곡면의 법선벡터
$$\mathbf N=\mathbf r_u\times\mathbf r_v,\qquad \mathbf n=\frac{\mathbf N}{|\mathbf N|}$$
$$z=f(x,y):\ \mathbf N=(-f_x,\,-f_y,\,1),\qquad g(x,y,z)=0:\ \mathbf n=\frac{\nabla g}{|\nabla g|}$$
:::

$\mathbf r_u$, $\mathbf r_v$는 곡면의 두 접벡터이므로 그 외적이 법선입니다(교재 Theorem 1)[[ch08:9.3|외적은 두 벡터에 수직.]][[ch08:9.7|기울기는 등위면의 법선.]]. $\mathbf N\ne\mathbf 0$인 곳이 매끄러운 점입니다.

:::ex 예제
포물면 $\mathbf r=(u\cos v,\ u\sin v,\ u^2)$의 법선벡터
---
$\mathbf r_u=(\cos v,\sin v,2u)$, $\mathbf r_v=(-u\sin v,u\cos v,0)$.
$$\mathbf N=\mathbf r_u\times\mathbf r_v=(-2u^2\cos v,\ -2u^2\sin v,\ u)$$
$z$성분이 양수이므로 위쪽(포물면 안쪽)을 향합니다. $u=0$ (꼭짓점)에서 $\mathbf N=\mathbf 0$이지만 이는 매개변수화의 문제일 뿐, $z=x^2+y^2$로 보면 $\mathbf N=(-2x,-2y,1)$로 매끄럽습니다.
:::
` },
      { k: '10.6', p: '443', title: '면적분', body: R`
곡면 $S$를 법선 방향 $\mathbf n$으로 통과하는 **유량**(flux)은 $\iint_S\mathbf F\cdot\mathbf n\,dA$입니다. $\mathbf F=\rho\mathbf v$이면 단위 시간에 통과하는 질량입니다.

:::key 면적분
$$A=\iint_R|\mathbf N|\,du\,dv,\qquad \iint_S\mathbf F\cdot\mathbf n\,dA=\iint_R\mathbf F(\mathbf r(u,v))\cdot\mathbf N(u,v)\,du\,dv$$
$$z=f(x,y)\ (\text{위쪽}):\ \mathbf N=(-f_x,\,-f_y,\,1),\qquad \text{반지름 }a\text{인 구면}:\ dA=a^2\sin\phi\,d\phi\,d\theta$$
:::

- $\mathbf n\,dA=\mathbf n|\mathbf N|du\,dv=\mathbf N\,du\,dv$이므로 단위법선을 따로 구할 필요가 없습니다.
- **방향**: 법선을 반대로 잡으면 유량의 부호가 바뀝니다(교재 Theorem 1). 연속적으로 법선을 고를 수 있는 곡면이 **향을 줄 수 있는** 곡면이고, 뫼비우스 띠는 그렇지 않습니다.
- **방향과 무관한 면적분** $\iint_SG\,dA=\iint_RG(\mathbf r)|\mathbf N|\,du\,dv$: 넓이, 곡면의 질량, 관성모멘트.

:::ex 예제 1
$\mathbf F=(x,y,z)$가 반지름 $a$인 구면을 바깥으로 통과하는 유량은?
---
구면에서 $\mathbf n=\mathbf r/a$이므로 $\mathbf F\cdot\mathbf n=|\mathbf r|^2/a=a$. 넓이 $4\pi a^2$를 곱하면 $4\pi a^3$.
:::

:::ex 예제 2 ($z=f(x,y)$ 꼴)
$\mathbf F=(y,\ x,\ z)$가 포물면 $z=4-x^2-y^2$ ($z\ge0$)을 위쪽으로 통과하는 유량
---
$\mathbf N=(-f_x,-f_y,1)=(2x,2y,1)$. $\mathbf F\cdot\mathbf N=2xy+2xy+(4-x^2-y^2)$. 반지름 2인 원판에서 적분하면 $xy$ 항은 대칭으로 0이고
$$\int_0^{2\pi}\!\int_0^2(4-r^2)\,r\,dr\,d\theta=2\pi\Big[2r^2-\frac{r^4}4\Big]_0^2=8\pi$$
다음 절에서 발산 정리로 검산합니다.
:::
` },
      { k: '10.7', p: '452', title: '삼중적분과 가우스의 발산 정리', body: R`
닫힌 곡면 $S$로 둘러싸인 영역 $T$에서, 내부의 샘(발산)을 모두 더한 것은 경계를 빠져나가는 총 유량과 같습니다.

:::key 발산 정리 (가우스)
$$\iiint_T\operatorname{div}\mathbf F\,dV=\oiint_S\mathbf F\cdot\mathbf n\,dA\qquad(\mathbf n:\ \text{바깥 방향 단위법선})$$
:::

- 성분 형태: $\iiint(\partial_xF_1+\partial_yF_2+\partial_zF_3)\,dV=\oiint(F_1\,dy\,dz+F_2\,dz\,dx+F_3\,dx\,dy)$.
- 증명은 각 성분을 따로: $\iiint\partial_zF_3\,dV$를 $z$로 먼저 적분하면 위·아래 면의 값의 차가 되어 $\oiint F_3n_3\,dA$와 같아집니다.
- **발산의 불변성**(Theorem 2): $\operatorname{div}\mathbf F(P)=\lim\frac1{V}\oiint\mathbf F\cdot\mathbf n\,dA$. 발산이 "단위 부피당 유출량"이라는 뜻이 여기서 정확해집니다[[ch08:9.8|발산의 물리적 의미.]].

:::ex 예제 1
$\mathbf F=(x^3,y^3,z^3)$이 반지름 $a$인 구면을 바깥으로 통과하는 유량
---
$\operatorname{div}\mathbf F=3(x^2+y^2+z^2)=3r^2$. 구좌표 $dV=r^2\sin\phi\,dr\,d\phi\,d\theta$로
$$\int_0^{2\pi}\!\int_0^\pi\!\int_0^a3r^2\cdot r^2\sin\phi\,dr\,d\phi\,d\theta=3\cdot\frac{a^5}5\cdot2\cdot2\pi=\frac{12\pi a^5}5$$
면적분으로 직접 하면 훨씬 깁니다.
:::

:::ex 예제 2 (닫아서 계산하기)
앞 절 예제 2의 유량 $8\pi$를 발산 정리로 검산하세요.
---
포물면에 바닥 원판 $z=0$ (법선 $-\mathbf k$)을 붙여 닫습니다. $\operatorname{div}\mathbf F=0+0+1=1$이므로 전체 유량 = 부피 $=\int_0^{2\pi}\!\int_0^2(4-r^2)r\,dr\,d\theta=8\pi$.
바닥에서 $\mathbf F\cdot(-\mathbf k)=-z=0$이므로 바닥 유량 0. 따라서 포물면 유량 $=8\pi-0=8\pi$ ✓
:::

:::tip 닫히지 않은 곡면
열린 곡면의 유량을 물으면, 계산이 쉬운 면(평평한 바닥 등)을 더해 닫은 뒤 발산 정리를 쓰고 더한 면의 유량을 빼는 방법이 자주 쓰입니다.
:::
` },
      { k: '10.8', p: '458', title: '발산 정리의 응용', body: R`
**① 연속방정식.** 유체가 담긴 임의의 영역에서 질량 감소율 = 경계를 빠져나가는 질량 유량. 발산 정리로 면적분을 부피 적분으로 바꾸면 영역이 임의이므로 피적분함수가 0: $\frac{\partial\rho}{\partial t}+\operatorname{div}(\rho\mathbf v)=0$.

**② 열방정식.** 열은 온도가 높은 곳에서 낮은 곳으로 흐르므로 열 흐름 $\mathbf v=-K\nabla u$. 같은 논리로
$$\frac{\partial u}{\partial t}=c^2\nabla^2u,\qquad c^2=\frac K{\sigma\rho}$$
PDE 단원에서 이 방정식을 풉니다[[ch11:12.5|열방정식의 유도와 풀이.]].

**③ 조화함수.** $\nabla^2f=0$인 $f$에 발산 정리를 쓰면 $\oiint_S\frac{\partial f}{\partial n}dA=0$ (교재 Theorem 1). 샘이 없는 정상 상태의 퍼텐셜은 닫힌 곡면을 통한 총 유량이 0입니다.

:::key 그린 항등식과 유일성
$$\iiint_T\big(f\nabla^2g+\nabla f\cdot\nabla g\big)dV=\oiint_Sf\frac{\partial g}{\partial n}dA\qquad(\text{제1 항등식})$$
$$\iiint_T\big(f\nabla^2g-g\nabla^2f\big)dV=\oiint_S\Big(f\frac{\partial g}{\partial n}-g\frac{\partial f}{\partial n}\Big)dA\qquad(\text{제2 항등식})$$
라플라스 방정식의 디리클레 문제(경계값이 주어짐)의 해는 유일합니다(Theorem 3).
:::

제1 항등식은 $\mathbf F=f\nabla g$에 발산 정리를 쓴 것입니다. $f=g$가 조화함수이고 경계에서 0이면 $\iiint|\nabla f|^2dV=0$이므로 $f$는 상수, 즉 0입니다(Theorem 2). 두 해의 차에 이것을 적용하면 유일성이 나옵니다. 2차원에서는 최대 원리로 같은 결론을 얻습니다[[ch16:18.6|조화함수의 최대 원리와 유일성.]].

:::ex 예제
$f=x^2-y^2$일 때 원점 중심 단위구면에서 $\oiint\frac{\partial f}{\partial n}dA$는?
---
$\nabla^2f=2-2=0$이므로 조화함수, 따라서 0. 직접: 구면에서 $\frac{\partial f}{\partial n}=\nabla f\cdot\mathbf r=2x^2-2y^2$이고 대칭으로 적분이 0 ✓
:::
` },
      { k: '10.9', p: '463', title: '스토크스 정리', body: R`
:::key 스토크스 정리
$$\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA=\oint_C\mathbf F\cdot d\mathbf r$$
:::

- **방향**은 오른손 법칙으로 맞춥니다: 엄지를 $\mathbf n$ 방향으로 두면 나머지 손가락이 $C$의 방향입니다(곡면 위를 걸을 때 $C$가 왼쪽에 곡면을 둠).
- 곡면이 $xy$평면의 영역이면 $\mathbf n=\mathbf k$이고 그린 정리가 됩니다.
- 경계 $C$가 같다면 **어떤 곡면을 골라도 결과가 같습니다**. 가장 간단한 곡면(보통 평평한 원판)을 고르세요. ($\operatorname{div}\operatorname{curl}\mathbf F=0$이라 두 곡면 사이에 발산 정리를 쓰면 차이가 0)
- **회전의 물리적 의미**: 점 $P$를 둘러싼 작은 원판에 대해 $(\operatorname{curl}\mathbf F)\cdot\mathbf n=\lim\frac1A\oint_C\mathbf F\cdot d\mathbf r$. 회전의 법선 성분은 **단위 넓이당 순환**입니다[[ch08:9.9|회전의 정의와 강체 회전.]].
- **경로 독립의 증명**: 단순연결 영역에서 $\operatorname{curl}\mathbf F=\mathbf 0$이면 모든 닫힌 곡선이 곡면의 경계가 되므로 $\oint=0$. 10.2절 Theorem 3이 여기서 증명됩니다.

:::ex 예제
$\mathbf F=(z,\,x,\,y)$, $S$: 반구면 $x^2+y^2+z^2=4$, $z\ge0$, 바깥 법선. $\iint_S(\operatorname{curl}\mathbf F)\cdot\mathbf n\,dA$는?
---
$\operatorname{curl}\mathbf F=(1-0,\ 1-0,\ 1-0)=(1,1,1)$. 경계는 $z=0$의 원 $x^2+y^2=4$ (위에서 보아 반시계).
같은 경계를 가진 원판 $z=0$, $\mathbf n=\mathbf k$로 바꾸면 $(1,1,1)\cdot\mathbf k=1$이므로 넓이 $4\pi$.
직접 선적분: $\mathbf r=(2\cos t,2\sin t,0)$, $\mathbf F=(0,2\cos t,2\sin t)$, $\mathbf F\cdot\mathbf r'=4\cos^2t$, 적분 $4\pi$ ✓
:::

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
