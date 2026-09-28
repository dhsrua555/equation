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
공학에서는 두 종류의 양을 다룹니다. 길이, 온도, 전압처럼 크기(수 하나)만으로 정해지는 **스칼라**와, 힘, 속도, 변위처럼 **크기와 방향**을 함께 가지는 **벡터**입니다. 벡터는 시작점 $P$와 끝점 $Q$를 잇는 화살표 $\overrightarrow{PQ}$로 나타내고, 화살표의 길이가 크기(노름) $|\mathbf a|$입니다. 길이가 1이면 **단위벡터**입니다.

:::def 벡터의 상등
두 벡터 $\mathbf a$, $\mathbf b$는 길이와 방향이 모두 같을 때 같다고 하고 $\mathbf a=\mathbf b$로 씁니다. 따라서 벡터는 **평행이동해도 같은 벡터**입니다. 시작점을 어디에 두든 상관없다는 뜻입니다.
:::

### 성분

직교좌표계를 잡고 $\mathbf a$의 시작점이 $P:(x_1,y_1,z_1)$, 끝점이 $Q:(x_2,y_2,z_2)$이면 $\mathbf a$의 **성분**은
$$a_1=x_2-x_1,\qquad a_2=y_2-y_1,\qquad a_3=z_2-z_1$$
이고 $\mathbf a=[a_1,a_2,a_3]$로 씁니다. 피타고라스 정리를 두 번 쓰면 길이는
$$|\mathbf a|=\sqrt{a_1^2+a_2^2+a_3^2}$$
원점에서 점 $(x,y,z)$로 가는 벡터 $\mathbf r=[x,y,z]$를 그 점의 **위치벡터**라 합니다. 평행이동하면 $P$와 $Q$의 좌표가 똑같이 바뀌어 차이는 그대로이므로, 다음이 성립합니다.

:::thm 벡터와 성분 (교재 §9.1 Theorem 1)
직교좌표계를 고정하면, 벡터는 성분의 순서쌍 $[a_1,a_2,a_3]$에 의해 유일하게 정해지고, 거꾸로 모든 순서쌍은 한 벡터를 나타냅니다.
:::

:::ex 예제 1 (성분과 길이)
$P:(3,-1,2)$에서 $Q:(5,3,-2)$로 가는 벡터의 성분, 길이, 같은 방향의 단위벡터는?
---
$\mathbf a=[5-3,\ 3-(-1),\ -2-2]=[2,4,-4]$, $|\mathbf a|=\sqrt{4+16+16}=6$. 단위벡터는 $\frac16\mathbf a=\big[\frac13,\frac23,-\frac23\big]$. 시작점을 $(0,0,0)$으로 옮기면 끝점이 $(2,4,-4)$가 되지만 같은 벡터입니다.
:::

### 덧셈과 스칼라배

두 벡터의 **합**은 $\mathbf b$의 시작점을 $\mathbf a$의 끝점에 놓았을 때 $\mathbf a$의 시작점에서 $\mathbf b$의 끝점으로 가는 벡터이고(평행사변형 법칙), 성분으로는 성분별 합입니다. **스칼라배** $c\mathbf a$는 길이가 $|c||\mathbf a|$이고 $c>0$이면 같은 방향, $c<0$이면 반대 방향입니다.
$$\mathbf a+\mathbf b=[a_1+b_1,\ a_2+b_2,\ a_3+b_3],\qquad c\mathbf a=[ca_1,\ ca_2,\ ca_3]$$
성분으로 계산하면 실수의 성질에서 곧바로
$$\mathbf a+\mathbf b=\mathbf b+\mathbf a,\quad(\mathbf u+\mathbf v)+\mathbf w=\mathbf u+(\mathbf v+\mathbf w),\quad\mathbf a+\mathbf 0=\mathbf a,\quad\mathbf a+(-\mathbf a)=\mathbf 0$$
$$c(\mathbf a+\mathbf b)=c\mathbf a+c\mathbf b,\quad(c+k)\mathbf a=c\mathbf a+k\mathbf a,\quad c(k\mathbf a)=(ck)\mathbf a,\quad 1\mathbf a=\mathbf a$$
이 따라 나옵니다. 또 $0\mathbf a=\mathbf 0$, $(-1)\mathbf a=-\mathbf a$입니다.

**단위벡터 $\mathbf i,\mathbf j,\mathbf k$.** 좌표축 방향의 단위벡터 $\mathbf i=[1,0,0]$, $\mathbf j=[0,1,0]$, $\mathbf k=[0,0,1]$을 쓰면 $\mathbf a=a_1\mathbf i+a_2\mathbf j+a_3\mathbf k$입니다. 두 표기는 같은 것이고, 어느 쪽을 써도 됩니다.

:::ex 예제 2 (힘의 합성과 평형)
한 점에 세 힘 $\mathbf p_1=[2,-1,3]$, $\mathbf p_2=[0,4,-2]$, $\mathbf p_3=[-3,0,1]$ (단위 N)이 작용한다. 합력은? 평형을 이루려면 어떤 힘을 더해야 하는가?
---
힘은 벡터이므로 합력은 벡터의 합입니다: $\mathbf p=[2+0-3,\ -1+4+0,\ 3-2+1]=[-1,3,2]$, 크기 $\sqrt{14}\approx3.74$ N. 평형(합력 $\mathbf 0$)에는 $\mathbf p_4=-\mathbf p=[1,-3,-2]$가 필요합니다.
:::

$n$개의 실수의 순서쌍으로 확장한 $\mathbb R^n$이 선형대수의 벡터공간입니다[[ch06:7.9|벡터공간 $\mathbb R^n$.]]. 3차원 공간의 벡터는 그 가장 친숙한 예이고, 이 장에서는 여기에 “길이와 각”(내적)과 “방향이 있는 넓이”(외적)라는 기하 구조를 더합니다.
` },
      { k: '9.2', p: '361', title: '내적', body: R`
일정한 힘이 한 일, 힘의 한 방향 성분처럼 “두 벡터를 곱해 스칼라를 얻는” 계산이 자주 필요합니다. 여기에 두 벡터의 길이와 사잇각이 관여합니다.

:::def 내적
$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\gamma\qquad(\mathbf a,\mathbf b\ne\mathbf 0),\qquad \mathbf a\cdot\mathbf b=0\quad(\mathbf a=\mathbf 0\text{ 또는 }\mathbf b=\mathbf 0)$$
$\gamma$ ($0\le\gamma\le\pi$)는 두 벡터의 시작점을 맞췄을 때의 사잇각입니다.
:::

**성분으로.** 정의에서 $\mathbf i\cdot\mathbf i=\mathbf j\cdot\mathbf j=\mathbf k\cdot\mathbf k=1$ (단위벡터, 각 0)이고 $\mathbf i\cdot\mathbf j=\mathbf j\cdot\mathbf k=\mathbf k\cdot\mathbf i=0$ (좌표축이 수직)입니다. $\mathbf a=a_1\mathbf i+a_2\mathbf j+a_3\mathbf k$, $\mathbf b$도 같이 쓰고 분배법칙으로 전개하면 9개 항 가운데 같은 단위벡터끼리의 3개만 남아
$$\mathbf a\cdot\mathbf b=a_1b_1+a_2b_2+a_3b_3$$
$\cos\gamma$가 양수, 0, 음수일 수 있으므로 내적도 그렇습니다. 예각이면 양수, 둔각이면 음수입니다.

:::thm 직교 판정 (교재 §9.2 Theorem 1)
영벡터가 아닌 두 벡터의 내적이 0일 필요충분조건은 두 벡터가 수직인 것입니다.
:::

**길이와 각.** $\mathbf b=\mathbf a$로 두면 $\mathbf a\cdot\mathbf a=|\mathbf a|^2$이므로
$$|\mathbf a|=\sqrt{\mathbf a\cdot\mathbf a},\qquad\cos\gamma=\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}=\frac{\mathbf a\cdot\mathbf b}{\sqrt{\mathbf a\cdot\mathbf a}\sqrt{\mathbf b\cdot\mathbf b}}$$

:::ex 예제 1 (사잇각)
$\mathbf a=[2,1,-2]$와 $\mathbf b=[1,1,0]$의 내적, 길이, 사잇각은?
---
$\mathbf a\cdot\mathbf b=2+1+0=3$, $|\mathbf a|=3$, $|\mathbf b|=\sqrt2$. $\cos\gamma=\frac3{3\sqrt2}=\frac1{\sqrt2}$이므로 $\gamma=45^\circ$.
:::

### 성질과 부등식

정의로부터 모든 벡터와 스칼라 $q_1,q_2$에 대해
$$(q_1\mathbf a+q_2\mathbf b)\cdot\mathbf c=q_1\,\mathbf a\cdot\mathbf c+q_2\,\mathbf b\cdot\mathbf c\ \ (\text{선형성}),\qquad\mathbf a\cdot\mathbf b=\mathbf b\cdot\mathbf a\ \ (\text{대칭성})$$
$$\mathbf a\cdot\mathbf a\ge0,\quad\mathbf a\cdot\mathbf a=0\iff\mathbf a=\mathbf 0\ \ (\text{양의 정부호성})$$
가 성립하고, 선형성에서 분배법칙 $(\mathbf a+\mathbf b)\cdot\mathbf c=\mathbf a\cdot\mathbf c+\mathbf b\cdot\mathbf c$가 나옵니다. $|\cos\gamma|\le1$에서
$$|\mathbf a\cdot\mathbf b|\le|\mathbf a||\mathbf b|\quad(\text{코시-슈바르츠}),\qquad|\mathbf a+\mathbf b|\le|\mathbf a|+|\mathbf b|\quad(\text{삼각부등식})$$
삼각부등식은 $|\mathbf a+\mathbf b|^2=|\mathbf a|^2+2\mathbf a\cdot\mathbf b+|\mathbf b|^2\le(|\mathbf a|+|\mathbf b|)^2$에서 나오고, “삼각형의 한 변은 다른 두 변의 합보다 짧다”는 뜻입니다. 같은 전개를 $\mathbf a-\mathbf b$에도 해서 더하면 **평행사변형 등식** $|\mathbf a+\mathbf b|^2+|\mathbf a-\mathbf b|^2=2(|\mathbf a|^2+|\mathbf b|^2)$을 얻습니다. 이 부등식들은 일반 내적공간(힐베르트 공간)에서도 성립합니다[[ch06:7.9|내적공간과 코시-슈바르츠 부등식.]].

### 응용: 일, 성분, 정사영

:::key 내적과 정사영
$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\gamma=a_1b_1+a_2b_2+a_3b_3$$
$$p=|\mathbf a|\cos\gamma=\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|}\ (\mathbf b\text{ 방향 성분}),\qquad W=\mathbf F\cdot\mathbf d\ (\text{일})$$
:::

**일.** 일정한 힘 $\mathbf p$를 받는 물체가 $\mathbf d$만큼 변위하면, 힘이 한 일은 힘의 크기 × 변위의 크기 × 사잇각의 코사인, 곧 $W=|\mathbf p||\mathbf d|\cos\alpha=\mathbf p\cdot\mathbf d$입니다. 힘이 변위에 수직이면 일은 0이고, 둔각이면 음수(힘을 거슬러 일을 해야 함)입니다. 변하는 힘에 대해서는 선적분이 됩니다(§10.1).

:::ex 예제 2 (일과 정사영)
힘 $\mathbf F=[2,5,0]$ N이 물체를 $\mathbf d=[3,1,0]$ m 옮길 때의 일과 이동 방향의 힘 성분은?
---
$W=\mathbf F\cdot\mathbf d=6+5=11$ J. 이동 방향 성분 $\dfrac{11}{|\mathbf d|}=\dfrac{11}{\sqrt{10}}\approx3.48$ N. 수직 성분은 일을 하지 않습니다.
:::

**정사영.** $\mathbf a$를 $\mathbf b$에 평행한 직선에 수직으로 내린 그림자의 부호 있는 길이 $p=|\mathbf a|\cos\gamma$를 $\mathbf a$의 $\mathbf b$ 방향 **성분**(정사영)이라 합니다. 분모·분자에 $|\mathbf b|$를 곱하면 위 공식이 되고, $\mathbf b$가 단위벡터이면 그냥 $p=\mathbf a\cdot\mathbf b$입니다. 방향까지 포함한 **벡터 정사영**은 $p$에 단위벡터 $\mathbf b/|\mathbf b|$를 곱한 $\dfrac{\mathbf a\cdot\mathbf b}{\mathbf b\cdot\mathbf b}\mathbf b$입니다.

:::fig f08proj
:::

:::ex 예제 3 (경사면 위의 상자)
수평과 $30^\circ$를 이루는 매끄러운 경사면에 무게 $200$ N인 상자가 있다. 무게를 경사면 방향 성분과 수직 성분으로 나누면? 상자를 붙잡아 두려면 경사면을 따라 얼마의 힘이 필요한가?
---
$x$축을 수평, $y$축을 연직 위로 잡으면 무게는 $\mathbf a=[0,-200]$. 경사면을 따라 올라가는 단위벡터 $\mathbf u=[\cos30^\circ,\sin30^\circ]=[0.866,\ 0.5]$, 경사면에 수직인 단위벡터 $\mathbf n=[-0.5,\ 0.866]$.
$$\mathbf a\cdot\mathbf u=-100,\qquad\mathbf a\cdot\mathbf n=-173.2$$
경사면을 따라 **내려가는** 방향으로 100 N, 경사면을 누르는 방향으로 173.2 N입니다. 확인: $100^2+173.2^2\approx200^2$ ✓. 붙잡는 힘은 경사면을 따라 위로 100 N입니다. 좌표를 경사면에 맞춰 돌리지 않아도 단위벡터와의 내적만으로 성분이 나온다는 점이 핵심입니다.
:::

:::ex 예제 4 (정규직교기저에서의 좌표)
$\mathbf e_1=\frac1{\sqrt2}[1,1,0]$, $\mathbf e_2=\frac1{\sqrt2}[1,-1,0]$, $\mathbf e_3=[0,0,1]$은 서로 수직인 단위벡터(정규직교기저)이다. $\mathbf v=[3,1,2]$를 $\mathbf v=l_1\mathbf e_1+l_2\mathbf e_2+l_3\mathbf e_3$으로 쓰면?
---
양변에 $\mathbf e_1$을 내적하면 정규직교성에서 $\mathbf e_1\cdot\mathbf v=l_1$입니다(나머지 항은 0). 곧 **계수는 내적 하나로 나옵니다**:
$$l_1=\frac{3+1}{\sqrt2}=2\sqrt2,\qquad l_2=\frac{3-1}{\sqrt2}=\sqrt2,\qquad l_3=2$$
확인: $2\sqrt2\cdot\frac1{\sqrt2}[1,1,0]+\sqrt2\cdot\frac1{\sqrt2}[1,-1,0]+2[0,0,1]=[3,1,2]$ ✓. 연립방정식을 풀 필요가 없다는 것이 직교기저의 큰 장점이고, 푸리에 계수가 적분 하나로 나오는 것도 같은 이유입니다.
:::

### 직선과 평면의 법선

$\mathbf a=[a_1,a_2]\ne\mathbf 0$, $\mathbf r=[x,y]$이면 평면의 직선 $a_1x+a_2y=c$는 $\mathbf a\cdot\mathbf r=c$입니다. 원점을 지나는 평행한 직선 $\mathbf a\cdot\mathbf r=0$ 위의 모든 $\mathbf r$이 $\mathbf a$에 수직이므로 $\mathbf a$는 직선의 **법선벡터**입니다. 공간에서도 똑같이 평면 $a_1x+a_2y+a_3z=c$의 법선벡터는 $\mathbf a=[a_1,a_2,a_3]$입니다.

:::ex 예제 5 (수직인 직선)
점 $(2,1)$을 지나고 직선 $3x-y=4$에 수직인 직선과 두 직선의 교점은?
---
주어진 직선의 법선은 $[3,-1]$. 구하는 직선의 법선 $\mathbf a$는 이것과 수직이어야 하므로 $3a_1-a_2=0$, 예컨대 $\mathbf a=[1,3]$. 따라서 $x+3y=c$이고 $(2,1)$을 지나므로 $c=5$: $x+3y=5$.
교점: $y=3x-4$를 넣으면 $10x=17$, $(x,y)=(1.7,\ 1.1)$ (확인: $1.7+3.3=5$ ✓).
:::

:::ex 예제 6 (헤세 표준형과 점-평면 거리)
평면 $2x-y+2z=5$의 단위법선벡터와 원점에서의 거리, 그리고 점 $(1,1,1)$까지의 거리는?
---
$\mathbf a=[2,-1,2]$, $|\mathbf a|=3$이므로 $\mathbf n=\frac13[2,-1,2]$. 평면의 식을 3으로 나누면 $\mathbf n\cdot\mathbf r=\frac53$ (**헤세 표준형**). 평면 위의 모든 점의 위치벡터가 $\mathbf n$ 방향으로 같은 성분 $\frac53$을 가지므로, 원점에서 평면까지의 거리는 $\frac53$입니다.
점 $(1,1,1)$의 $\mathbf n$ 방향 성분은 $\frac13(2-1+2)=1$이므로 거리는 $\big|1-\frac53\big|=\frac23$. 일반적으로 점 $\mathbf r_0$에서 평면 $\mathbf a\cdot\mathbf r=c$까지의 거리는 $\dfrac{|\mathbf a\cdot\mathbf r_0-c|}{|\mathbf a|}$입니다.
:::

함수의 **내적** $\int fg\,dx$도 같은 발상입니다. 삼각함수들이 서로 “직교”한다는 것이 푸리에 급수의 기초입니다[[ch10:11.5|함수의 직교성.]].
` },
      { k: '9.3', p: '368', title: '외적과 삼중곱', body: R`
내적의 결과는 스칼라였습니다. 이번에는 결과가 **벡터**인 곱을 정의합니다. 평면 위의 두 벡터 $\mathbf a$, $\mathbf b$가 평행사변형의 두 변일 때, 두 벡터에 모두 수직이고 길이가 그 평행사변형의 넓이인 벡터를 만들고 싶은 것입니다.

:::def 외적
$\mathbf v=\mathbf a\times\mathbf b$는 다음과 같은 벡터입니다.
1. $\mathbf a=\mathbf 0$ 또는 $\mathbf b=\mathbf 0$이거나 두 벡터가 한 직선 위에 있으면(평행) $\mathbf v=\mathbf 0$.
2. 그 밖에는 길이가 $|\mathbf v|=|\mathbf a||\mathbf b|\sin\gamma$ (평행사변형의 넓이)이고, $\mathbf a$와 $\mathbf b$에 모두 수직이며, $\mathbf a,\mathbf b,\mathbf v$가 이 순서로 **오른손계**를 이루는 벡터.
:::

**오른손계.** 오른손의 엄지, 검지, 중지를 서로 수직으로 폈을 때처럼 놓이는 세 벡터를 오른손계라 합니다. 같은 말로, $\mathbf a$를 $\mathbf b$ 쪽으로 ($\pi$보다 작은 각만큼) 돌릴 때 오른나사가 나아가는 방향이 $\mathbf v$입니다. $\mathbf i,\mathbf j,\mathbf k$가 오른손계인 좌표계를 **오른손 좌표계**라 하고, 응용에서는 이것을 씁니다.

:::fig f08cross
:::

**성분으로.** 오른손 좌표계에서
$$\mathbf a\times\mathbf b=[a_2b_3-a_3b_2,\ \ a_3b_1-a_1b_3,\ \ a_1b_2-a_2b_1]=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix}$$
행렬식은 첫 행이 벡터라서 “형식적”인 것이고, 첫 행으로 전개한 것이 왼쪽 식입니다. (왼손 좌표계에서는 앞에 $-$가 붙습니다.) 3×3 행렬식의 전개는 선형대수와 같습니다[[ch06:7.7|행렬식의 전개.]].

:::ex 예제 1 (외적 계산)
$\mathbf a=[1,2,0]$, $\mathbf b=[0,1,3]$의 외적
---
$\mathbf a\times\mathbf b=[2\cdot3-0\cdot1,\ \ 0\cdot0-1\cdot3,\ \ 1\cdot1-2\cdot0]=[6,-3,1]$. 검산: $\mathbf a\cdot[6,-3,1]=6-6=0$, $\mathbf b\cdot[6,-3,1]=-3+3=0$ ✓ (두 벡터에 수직). 평행사변형의 넓이는 $\sqrt{36+9+1}=\sqrt{46}$.
:::

**기본 벡터들의 외적.** 정의에서 곧바로
$$\mathbf i\times\mathbf j=\mathbf k,\quad\mathbf j\times\mathbf k=\mathbf i,\quad\mathbf k\times\mathbf i=\mathbf j,\qquad\mathbf j\times\mathbf i=-\mathbf k,\quad\mathbf k\times\mathbf j=-\mathbf i,\quad\mathbf i\times\mathbf k=-\mathbf j$$
($\mathbf i\to\mathbf j\to\mathbf k\to\mathbf i$ 순환 방향이면 $+$).

:::thm 외적의 성질 (교재 §9.3 Theorem 1)
(a) $(l\mathbf a)\times\mathbf b=l(\mathbf a\times\mathbf b)=\mathbf a\times(l\mathbf b)$.
(b) 분배법칙: $\mathbf a\times(\mathbf b+\mathbf c)=\mathbf a\times\mathbf b+\mathbf a\times\mathbf c$, $(\mathbf a+\mathbf b)\times\mathbf c=\mathbf a\times\mathbf c+\mathbf b\times\mathbf c$.
(c) **반교환**: $\mathbf b\times\mathbf a=-(\mathbf a\times\mathbf b)$. 특히 $\mathbf a\times\mathbf a=\mathbf 0$.
(d) **결합법칙이 성립하지 않음**: 일반적으로 $\mathbf a\times(\mathbf b\times\mathbf c)\ne(\mathbf a\times\mathbf b)\times\mathbf c$.
:::

(a)는 정의에서, (b)는 성분 공식이 각 행에 대해 선형이라는 데서 나옵니다. (c)는 행렬식의 두 행을 바꾸면 부호가 바뀌기 때문입니다(기하적으로도: $\mathbf b,\mathbf a,\mathbf w$가 오른손계가 되려면 $\mathbf w$가 반대쪽을 향해야 함). (d)는 반례 하나면 됩니다: $\mathbf i\times(\mathbf i\times\mathbf j)=\mathbf i\times\mathbf k=-\mathbf j$이지만 $(\mathbf i\times\mathbf i)\times\mathbf j=\mathbf 0\times\mathbf j=\mathbf 0$. 따라서 **괄호를 생략할 수 없고 순서도 바꿀 수 없습니다**.

**벡터 삼중곱.** 괄호가 있는 곱은 다음 공식으로 계산합니다(성분으로 확인).
$$\mathbf a\times(\mathbf b\times\mathbf c)=(\mathbf a\cdot\mathbf c)\mathbf b-(\mathbf a\cdot\mathbf b)\mathbf c$$
위 반례에 넣으면 $(\mathbf i\cdot\mathbf j)\mathbf i-(\mathbf i\cdot\mathbf i)\mathbf j=-\mathbf j$ ✓.

### 응용: 모멘트와 회전 속도

:::ex 예제 2 (힘의 모멘트)
점 $Q$에 대한 힘 $\mathbf p$의 **모멘트**는 크기가 $m=|\mathbf p|d$ ($d$: $Q$에서 힘의 작용선까지의 거리)이고, $Q$에서 작용선 위의 임의의 점으로 가는 벡터를 $\mathbf r$이라 하면 $d=|\mathbf r|\sin\gamma$이므로 $m=|\mathbf r\times\mathbf p|$입니다. 방향까지 담은 **모멘트 벡터**는
$$\mathbf m=\mathbf r\times\mathbf p$$
이고, 그 방향은 힘이 일으키려는 회전의 축입니다. 점 $\mathbf r=[2,1,0]$ m에 힘 $\mathbf p=[0,0,10]$ N이 작용할 때 원점에 대한 모멘트는?
---
$\mathbf m=\mathbf r\times\mathbf p=[1\cdot10-0\cdot0,\ \ 0\cdot0-2\cdot10,\ \ 2\cdot0-1\cdot0]=[10,-20,0]$, 크기 $10\sqrt5\approx22.4$ N·m. 모멘트는 $\mathbf r$과 $\mathbf p$에 모두 수직인 수평 방향이고, 작용선 위의 다른 점 $\mathbf r+t\mathbf p$를 써도 $\mathbf p\times\mathbf p=\mathbf 0$이라 결과가 같습니다.
:::

:::ex 예제 3 (렌치)
길이 $0.3$ m인 렌치가 $x$축 방향으로 놓여 있고, 끝에 $xy$평면에서 렌치와 $60^\circ$를 이루는 $50$ N의 힘을 준다. 볼트에 걸리는 모멘트는?
---
$\mathbf r=[0.3,0,0]$, $\mathbf p=[50\cos60^\circ,\ 50\sin60^\circ,\ 0]=[25,\ 43.3,\ 0]$.
$$\mathbf m=\mathbf r\times\mathbf p=[0,\ 0,\ 0.3\cdot43.3-0\cdot25]=[0,\ 0,\ 12.99]$$
크기 약 13 N·m, 방향 $+z$: 위에서 보면 반시계 방향으로 돌리는 모멘트입니다(오른나사라면 $+z$로 나아감). 힘의 수직 성분 $50\sin60^\circ$만 모멘트에 기여합니다.
:::

**회전하는 물체의 속도.** 강체가 고정축 둘레로 돌 때, 축 방향이고 길이가 각속도 $\omega$인 벡터 $\mathbf w$로 회전을 나타냅니다(축에서 보았을 때 $\mathbf w$의 방향으로 오른나사가 나아가는 쪽으로 돎). 축 위에 원점을 둔 위치벡터 $\mathbf r$인 점은 축에서 거리 $d=|\mathbf r|\sin\gamma$에 있어 속력이 $\omega d=|\mathbf w\times\mathbf r|$이고, 방향도 맞으므로
$$\mathbf v=\mathbf w\times\mathbf r$$

:::ex 예제 4 (회전체의 속도)
$z$축 둘레로 $\omega=2$ rad/s로 도는 물체의 점 $(1,2,5)$에서의 속도는?
---
$\mathbf w=[0,0,2]$, $\mathbf v=\mathbf w\times\mathbf r=[0\cdot5-2\cdot2,\ \ 2\cdot1-0\cdot5,\ \ 0]=[-4,2,0]$. 속력 $2\sqrt5$는 (축에서의 거리 $\sqrt{1+4}$) × $\omega$와 같습니다 ✓. $z$좌표 5는 속도에 영향을 주지 않습니다.
:::

### 스칼라 삼중곱

세 벡터의 곱 가운데 가장 중요한 것은 **스칼라 삼중곱**(혼합곱)
$$(\mathbf a\ \mathbf b\ \mathbf c)=\mathbf a\cdot(\mathbf b\times\mathbf c)$$
입니다. $\mathbf b\times\mathbf c$의 성분을 넣고 내적하면 $a_1\begin{vmatrix}b_2&b_3\\c_2&c_3\end{vmatrix}-a_2\begin{vmatrix}b_1&b_3\\c_1&c_3\end{vmatrix}+a_3\begin{vmatrix}b_1&b_2\\c_1&c_2\end{vmatrix}$, 곧 3×3 행렬식의 첫 행 전개입니다.

:::key 내적·외적·삼중곱
$$\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\gamma=a_1b_1+a_2b_2+a_3b_3$$
$$\mathbf a\times\mathbf b=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix},\qquad |\mathbf a\times\mathbf b|=|\mathbf a||\mathbf b|\sin\gamma$$
$$(\mathbf a\ \mathbf b\ \mathbf c)=\mathbf a\cdot(\mathbf b\times\mathbf c)=\det\begin{pmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{pmatrix}$$
:::

:::thm 스칼라 삼중곱의 성질 (교재 §9.3 Theorem 2)
(a) 점과 가위표를 바꿔도 됩니다: $\mathbf a\cdot(\mathbf b\times\mathbf c)=(\mathbf a\times\mathbf b)\cdot\mathbf c$.
(b) $|(\mathbf a\ \mathbf b\ \mathbf c)|$는 $\mathbf a,\mathbf b,\mathbf c$를 모서리로 하는 평행육면체의 부피입니다.
(c) $\mathbb R^3$의 세 벡터가 일차독립일 필요충분조건은 $(\mathbf a\ \mathbf b\ \mathbf c)\ne0$입니다.
:::

**증명.** (a) $(\mathbf a\times\mathbf b)\cdot\mathbf c=\mathbf c\cdot(\mathbf a\times\mathbf b)$는 행이 $\mathbf c,\mathbf a,\mathbf b$인 행렬식입니다. 행을 두 번 바꾸면($\mathbf c\leftrightarrow\mathbf a$, 그다음 $\mathbf c\leftrightarrow\mathbf b$) $\mathbf a,\mathbf b,\mathbf c$ 순서가 되고 부호는 $(-1)^2=1$이라 변하지 않습니다. 같은 이유로 순환해도 값이 같습니다: $(\mathbf a\ \mathbf b\ \mathbf c)=(\mathbf b\ \mathbf c\ \mathbf a)=(\mathbf c\ \mathbf a\ \mathbf b)$.
(b) 밑면(변 $\mathbf b$, $\mathbf c$인 평행사변형)의 넓이는 $|\mathbf b\times\mathbf c|$, 높이는 $\mathbf a$의 $\mathbf b\times\mathbf c$ 방향 성분의 절댓값 $h=|\mathbf a||\cos\gamma|$입니다. 곱하면 $|\mathbf a||\mathbf b\times\mathbf c||\cos\gamma|=|\mathbf a\cdot(\mathbf b\times\mathbf c)|$.
(c) 세 벡터가 한 평면(또는 직선) 위에 있지 않을 때, 곧 평행육면체의 부피가 0이 아닐 때 일차독립입니다.

:::ex 예제 5 (삼각형의 넓이)
$P(1,0,0)$, $Q(0,2,0)$, $R(0,0,3)$을 꼭짓점으로 하는 삼각형의 넓이와 이 평면의 방정식은?
---
$\overrightarrow{PQ}=[-1,2,0]$, $\overrightarrow{PR}=[-1,0,3]$, $\overrightarrow{PQ}\times\overrightarrow{PR}=[6,3,2]$, 크기 7. 넓이는 평행사변형의 절반인 $\tfrac72$.
외적 $[6,3,2]$는 이 평면의 법선이기도 하므로 평면은 $6x+3y+2z=6$ ($P$를 대입해 상수 결정). $Q$, $R$도 만족합니다 ✓.
:::

:::ex 예제 6 (사면체의 부피와 일차독립)
(a) 원점과 $\mathbf a=[1,1,0]$, $\mathbf b=[0,1,1]$, $\mathbf c=[1,0,1]$의 끝점이 만드는 사면체의 부피는? (b) $[1,2,3]$, $[4,5,6]$, $[7,8,9]$는 일차독립인가?
---
(a) $(\mathbf a\ \mathbf b\ \mathbf c)=\det\begin{pmatrix}1&1&0\\0&1&1\\1&0&1\end{pmatrix}=1\cdot1-1\cdot(0-1)+0=2$. 사면체는 평행육면체 부피의 $\frac16$이므로 $\frac13$ (밑면이 평행사변형의 절반, 뿔이라 다시 $\frac13$).
(b) $\det\begin{pmatrix}1&2&3\\4&5&6\\7&8&9\end{pmatrix}=1(45-48)-2(36-42)+3(32-35)=-3+12-9=0$. 일차종속입니다. 실제로 $[7,8,9]=2[4,5,6]-[1,2,3]$이라 세 벡터가 한 평면 위에 있습니다.
:::

삼중곱의 부호는 세 벡터가 오른손계($+$)인지 왼손계($-$)인지를 알려 줍니다.
` },
      { k: '9.4', p: '375', title: '벡터함수와 벡터장, 벡터함수의 미분', body: R`
벡터 미적분은 두 종류의 함수를 다룹니다. 정의역(보통 공간의 한 영역, 곡면, 곡선)의 각 점 $P$에 벡터를 대응시키는 **벡터함수** $\mathbf v(P)=[v_1(P),v_2(P),v_3(P)]$는 **벡터장**을, 스칼라를 대응시키는 **스칼라함수** $f(P)$는 **스칼라장**을 정의합니다. 곡선의 접선벡터들, 곡면의 법선벡터들, 회전하는 물체의 속도가 벡터장의 예이고, 물체 안의 온도 분포, 대기의 압력이 스칼라장의 예입니다. 시간 같은 매개변수에 따라 변할 수도 있습니다.

**좌표와의 관계.** 직교좌표를 쓰면 $\mathbf v(x,y,z)$, $f(x,y,z)$로 씁니다. 성분은 좌표계에 따라 달라지지만, 물리적·기하적 의미가 있는 벡터장은 크기와 방향이 **점에만** 의존하고 좌표계의 선택과 무관해야 합니다. 스칼라함수도 마찬가지입니다.

:::ex 예제 1 (스칼라함수: 거리)
고정점 $P_0:(x_0,y_0,z_0)$에서 점 $P$까지의 거리 $f(P)=\sqrt{(x-x_0)^2+(y-y_0)^2+(z-z_0)^2}$는 스칼라함수입니다. 좌표계를 평행이동하거나 돌리면 좌표의 값은 바뀌지만 두 점 사이의 거리는 그대로이기 때문입니다. 반면 $P_0P$ 직선의 방향코사인들은 좌표계에 따라 바뀌므로 스칼라가 아닙니다.
:::

:::ex 예제 2 (벡터장: 회전체의 속도장과 중력장)
(a) 각속도 벡터 $\mathbf w$로 회전하는 물체의 속도는 §9.3에서 $\mathbf v=\mathbf w\times\mathbf r$이었습니다. 회전축을 $z$축, $\mathbf w=\omega\mathbf k$로 잡으면
$$\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\0&0&\omega\\x&y&z\end{vmatrix}=\omega[-y,\ x,\ 0]$$
(b) 점 $P_0$에 고정된 질량 $M$이 점 $P$의 질량 $m$을 끌어당기는 힘은 $P$에서 $P_0$을 향하고 크기가 $c/r^2$ ($c=GMm$, $r$: 거리)입니다. $\mathbf r=[x-x_0,\ y-y_0,\ z-z_0]$이라 하면 $-\frac1r\mathbf r$이 $P_0$을 향하는 단위벡터이므로
$$\mathbf p=-\frac c{r^3}\mathbf r=\Big[-c\frac{x-x_0}{r^3},\ -c\frac{y-y_0}{r^3},\ -c\frac{z-z_0}{r^3}\Big]$$
:::

:::fig f08fields
:::

### 극한, 연속, 도함수

미적분의 기본 개념이 벡터함수에 자연스럽게 옮겨집니다. 벡터열 $\mathbf a_{(n)}$이 $\lim|\mathbf a_{(n)}-\mathbf a|=0$이면 $\mathbf a$로 **수렴**하고, 벡터함수 $\mathbf v(t)$는 $\lim_{t\to t_0}|\mathbf v(t)-\mathbf l|=0$이면 극한 $\mathbf l$을 가집니다. $\lim_{t\to t_0}\mathbf v(t)=\mathbf v(t_0)$이면 $t_0$에서 **연속**입니다. 직교좌표에서는 이 모든 것이 **성분마다** 성립하는 것과 같습니다.

:::def 벡터함수의 도함수
$$\mathbf v'(t)=\lim_{\Delta t\to0}\frac{\mathbf v(t+\Delta t)-\mathbf v(t)}{\Delta t}$$
가 존재하면 $\mathbf v$는 $t$에서 미분가능합니다. 성분으로는 $\mathbf v'=[v_1',v_2',v_3']$, 곧 **성분마다 미분**합니다.
:::

$\mathbf v(t)$의 끝점이 그리는 곡선을 생각하면, 차분몫 $\frac{\mathbf v(t+\Delta t)-\mathbf v(t)}{\Delta t}$는 할선 방향이고 그 극한 $\mathbf v'(t)$는 접선 방향입니다(§9.5). 미분법의 규칙이 그대로 성립하고, 곱은 세 종류가 있습니다.
$$(c\mathbf v)'=c\mathbf v',\qquad(\mathbf u+\mathbf v)'=\mathbf u'+\mathbf v'$$
$$(\mathbf u\cdot\mathbf v)'=\mathbf u'\cdot\mathbf v+\mathbf u\cdot\mathbf v',\qquad(\mathbf u\times\mathbf v)'=\mathbf u'\times\mathbf v+\mathbf u\times\mathbf v'\ (\text{순서 유지}),\qquad(\mathbf u\ \mathbf v\ \mathbf w)'=(\mathbf u'\ \mathbf v\ \mathbf w)+(\mathbf u\ \mathbf v'\ \mathbf w)+(\mathbf u\ \mathbf v\ \mathbf w')$$
증명은 성분으로 쓰고 보통의 곱의 미분법을 쓰면 됩니다. 외적은 교환법칙이 없으므로 **순서를 지켜야** 합니다.

:::ex 예제 3 (곱의 미분 확인)
$\mathbf u=[t,t^2,1]$, $\mathbf v=[1,0,t]$에 대해 $(\mathbf u\cdot\mathbf v)'$와 $(\mathbf u\times\mathbf v)'$를 두 방법으로 구하세요.
---
**직접.** $\mathbf u\cdot\mathbf v=t+t=2t$이므로 $(\mathbf u\cdot\mathbf v)'=2$. $\mathbf u\times\mathbf v=[t^3,\ 1-t^2,\ -t^2]$이므로 $(\mathbf u\times\mathbf v)'=[3t^2,\ -2t,\ -2t]$.
**규칙으로.** $\mathbf u'=[1,2t,0]$, $\mathbf v'=[0,0,1]$. $\mathbf u'\cdot\mathbf v+\mathbf u\cdot\mathbf v'=1+1=2$ ✓. $\mathbf u'\times\mathbf v=[2t^2,\ -t,\ -2t]$, $\mathbf u\times\mathbf v'=[t^2,\ -t,\ 0]$, 합 $[3t^2,-2t,-2t]$ ✓.
:::

:::ex 예제 4 (길이가 일정한 벡터함수)
$|\mathbf v(t)|=c$ (일정)이면 $\mathbf v'$는 $\mathbf 0$이거나 $\mathbf v$에 수직임을 보이세요.
---
$\mathbf v\cdot\mathbf v=c^2$을 미분하면 $(\mathbf v\cdot\mathbf v)'=2\mathbf v\cdot\mathbf v'=0$. 원운동에서 속도가 위치벡터에 수직인 이유이고, 다음 절에서 단위접선벡터의 도함수가 접선에 수직이라는 사실(곡률과 주법선)의 근거가 됩니다.
:::

**편도함수.** 성분이 여러 변수 $t_1,\dots,t_n$의 함수이면 $\dfrac{\partial\mathbf v}{\partial t_m}=\Big[\dfrac{\partial v_1}{\partial t_m},\dfrac{\partial v_2}{\partial t_m},\dfrac{\partial v_3}{\partial t_m}\Big]$로 정의하고, 2계 편도함수도 같습니다. 예를 들어 원기둥면 $\mathbf r(u,v)=[a\cos u,\ a\sin u,\ v]$에서 $\mathbf r_u=[-a\sin u,\ a\cos u,\ 0]$ (원을 따라가는 접벡터), $\mathbf r_v=[0,0,1]$ (모선 방향)입니다. 곡면을 $\mathbf r(u,v)$로 나타낼 때 $\mathbf r_u$, $\mathbf r_v$가 접벡터가 되고, 그 외적이 법선이 됩니다[[ch09:10.5|곡면의 매개변수 표현과 법선.]].
` },
      { k: '9.5', p: '381', title: '곡선, 호의 길이, 곡률, 비틀림', body: R`
벡터 미적분을 곡선에 적용하는 것이 **미분기하**의 일부입니다. 곡선은 역학에서 움직이는 물체의 경로이고, 다음 장의 선적분에 필요합니다.

### 매개변수 표현

곡선 $C$를 $y=f(x)$나 두 곡면의 교선 $F(x,y,z)=0$, $G(x,y,z)=0$으로 줄 수도 있지만, 벡터 미적분에서는 **매개변수 표현**
$$\mathbf r(t)=[x(t),\ y(t),\ z(t)]=x(t)\mathbf i+y(t)\mathbf j+z(t)\mathbf k$$
을 씁니다. 각 $t$에 곡선 위의 한 점(위치벡터 $\mathbf r(t)$)이 대응하고, $t$가 증가하는 방향이 곡선의 **양의 방향**(방향 부여)입니다. 매개변수 표현은 세 좌표를 대등하게 다루고, 물리에서 $t$를 시간으로 읽을 수 있다는 장점이 있습니다.

- **원** $x^2+y^2=4$, $z=0$: $\mathbf r(t)=[2\cos t,\ 2\sin t,\ 0]$ ($0\le t\le2\pi$). 반시계 방향이 양의 방향입니다. $t$를 $t^*=-t$로 바꾸면 $\mathbf r^*(t^*)=[2\cos t^*,-2\sin t^*,0]$이 되어 시계 방향으로 바뀝니다.
- **타원** $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$: $\mathbf r(t)=[a\cos t,\ b\sin t,\ 0]$.
- **직선**: 점 $A$ (위치벡터 $\mathbf a$)를 지나고 $\mathbf b$ 방향이면 $\mathbf r(t)=\mathbf a+t\mathbf b$. 예: $(1,2,0)$과 $(3,-1,4)$를 지나는 직선은 $\mathbf r(t)=[1,2,0]+t[2,-3,4]$ ($\mathbf b$가 단위벡터이면 $t$가 $A$에서의 거리).
- **원형 나선** $\mathbf r(t)=[a\cos t,\ a\sin t,\ ct]$ ($c\ne0$): 원기둥 $x^2+y^2=a^2$ 위를 감아 오르는 곡선. $c>0$이면 오른나사처럼 감기고(오른나사 나선), $c<0$이면 왼나사 나선입니다. 한 평면 위에 있지 않은 **꼬인 곡선**의 대표입니다.
- **그래프** $y=f(x)$: $\mathbf r(t)=[t,\ f(t)]$.

### 접선

$\mathbf r(t)$가 미분가능하고 $\mathbf r'(t)\ne\mathbf 0$이면, 할선 벡터 $\frac1{\Delta t}[\mathbf r(t+\Delta t)-\mathbf r(t)]$의 극한인
$$\mathbf r'(t)=\lim_{\Delta t\to0}\frac{\mathbf r(t+\Delta t)-\mathbf r(t)}{\Delta t}$$
는 접선 방향이므로 $C$의 **접선벡터**라 하고, $\mathbf u=\frac1{|\mathbf r'|}\mathbf r'$을 **단위접선벡터**라 합니다. 둘 다 $t$가 증가하는 쪽을 향하므로 방향 부여를 뒤집으면 반대가 됩니다. 점 $P$ ($\mathbf r$)에서의 **접선**은
$$\mathbf q(w)=\mathbf r+w\,\mathbf r'\qquad(w\text{: 매개변수})$$

:::ex 예제 1 (타원의 접선)
타원 $\frac{x^2}9+\frac{y^2}4=1$의 점 $P:\big(\frac32,\sqrt3\big)$에서의 접선은?
---
$\mathbf r(t)=[3\cos t,\ 2\sin t]$에서 $P$는 $t=\pi/3$입니다. $\mathbf r'(t)=[-3\sin t,\ 2\cos t]$이므로 $\mathbf r'(\pi/3)=\big[-\frac{3\sqrt3}2,\ 1\big]$.
$$\mathbf q(w)=\Big[\frac32-\frac{3\sqrt3}2w,\ \ \sqrt3+w\Big]$$
검산: 접선의 음함수 꼴 $\frac{x_0x}9+\frac{y_0y}4=1$에 넣으면 $\frac16\big(\frac32-\frac{3\sqrt3}2w\big)+\frac{\sqrt3}4(\sqrt3+w)=\frac14-\frac{\sqrt3}4w+\frac34+\frac{\sqrt3}4w=1$ ✓.
:::

### 곡선의 길이와 호의 길이

$a\le t\le b$를 $t_0(=a)<t_1<\cdots<t_n(=b)$로 나누고 점 $\mathbf r(t_0),\dots,\mathbf r(t_n)$을 잇는 현들의 꺾은선의 길이 $l_n$을 생각합니다. 가장 긴 간격 $|\Delta t_m|$이 0으로 가도록 $n$을 늘리면, $\mathbf r'$이 연속일 때 $l_n$은 분할 방법과 매개변수의 선택에 무관한 극한을 가지고 그것이 곡선의 **길이**입니다. 각 현의 길이는 평균값 정리로 약 $|\mathbf r'(t_m)|\Delta t_m$이므로 합의 극한은 적분
$$l=\int_a^b\sqrt{\mathbf r'\cdot\mathbf r'}\,dt=\int_a^b|\mathbf r'(t)|\,dt$$
이 됩니다. 위끝을 변수로 바꾼
$$s(t)=\int_a^t\sqrt{\mathbf r'(\tilde t)\cdot\mathbf r'(\tilde t)}\,d\tilde t$$
를 **호의 길이 함수**라 합니다(시작점 $s=0$의 선택은 임의이고, 바꾸면 상수만 달라짐).

:::fig f08curve
:::

**선소.** 미분하고 제곱하면 $\big(\frac{ds}{dt}\big)^2=\frac{d\mathbf r}{dt}\cdot\frac{d\mathbf r}{dt}=\big(\frac{dx}{dt}\big)^2+\big(\frac{dy}{dt}\big)^2+\big(\frac{dz}{dt}\big)^2$, 곧
$$ds^2=d\mathbf r\cdot d\mathbf r=dx^2+dy^2+dz^2$$
$ds$를 **선소**라 합니다. 미소 변위의 피타고라스 정리입니다.

**호의 길이를 매개변수로.** $t$ 대신 $s$를 쓰면 $|\mathbf r'(s)|=\frac{ds}{ds}=1$이므로 **단위접선벡터가 그냥 $\mathbf u(s)=\mathbf r'(s)$**입니다. 곡률과 비틀림의 식이 크게 간단해집니다.

:::ex 예제 2 (나선의 길이, 호의 길이 매개변수)
나선 $\mathbf r(t)=[a\cos t,\ a\sin t,\ ct]$의 한 바퀴 길이와 호의 길이를 매개변수로 한 표현은?
---
$\mathbf r'=[-a\sin t,\ a\cos t,\ c]$, $\mathbf r'\cdot\mathbf r'=a^2+c^2=K^2$ (상수). 따라서 $s=Kt$, 한 바퀴($0\le t\le2\pi$)의 길이는 $2\pi\sqrt{a^2+c^2}$ (원기둥을 펼치면 밑변 $2\pi a$, 높이 $2\pi c$인 직각삼각형의 빗변). $t=s/K$를 넣으면
$$\mathbf r^*(s)=\Big[a\cos\frac sK,\ a\sin\frac sK,\ \frac{cs}K\Big],\qquad K=\sqrt{a^2+c^2}$$
$c=0$이면 원: $\mathbf r^*(s)=\big[a\cos\frac sa,\ a\sin\frac sa\big]$.
:::

:::ex 예제 3 (원뿔 나선의 길이)
$\mathbf r(t)=[e^t\cos t,\ e^t\sin t,\ e^t]$, $0\le t\le1$의 길이는?
---
$\mathbf r'=[e^t(\cos t-\sin t),\ e^t(\sin t+\cos t),\ e^t]$이고 $(\cos t-\sin t)^2+(\sin t+\cos t)^2=2$이므로 $|\mathbf r'|^2=3e^{2t}$. 길이 $\int_0^1\sqrt3e^t\,dt=\sqrt3(e-1)\approx2.976$.
:::

### 역학의 곡선: 속도와 가속도

$t$를 시간으로 읽으면 곡선은 움직이는 물체의 경로입니다. 접선벡터 $\mathbf v(t)=\mathbf r'(t)$가 **속도** (순간적인 운동 방향을 향하고 길이는 **속력** $|\mathbf v|=\frac{ds}{dt}$), $\mathbf a(t)=\mathbf v'(t)=\mathbf r''(t)$가 **가속도**입니다. 속도는 늘 경로에 접하지만 가속도는 일반적으로 그렇지 않습니다.

**접선 가속도와 법선 가속도.** 연쇄법칙으로 $\mathbf v=\frac{d\mathbf r}{ds}\frac{ds}{dt}=\mathbf u(s)\frac{ds}{dt}$이고 한 번 더 미분하면
$$\mathbf a=\frac{d\mathbf u}{ds}\Big(\frac{ds}{dt}\Big)^2+\mathbf u(s)\frac{d^2s}{dt^2}$$
$\mathbf u$는 길이가 1로 일정하므로 $\frac{d\mathbf u}{ds}\perp\mathbf u$ (§9.4 예제 4). 따라서 첫 항은 경로에 수직인 **법선 가속도**, 둘째 항은 접선 방향의 **접선 가속도**입니다. 실제 계산에서는 정사영을 씁니다:
$$\mathbf a_{\text{tan}}=\frac{\mathbf a\cdot\mathbf v}{\mathbf v\cdot\mathbf v}\mathbf v,\qquad\mathbf a_{\text{norm}}=\mathbf a-\mathbf a_{\text{tan}}$$

:::ex 예제 4 (가속도의 분해)
$\mathbf r(t)=[t,\ t^2,\ 0]$의 $t=1$에서 접선·법선 가속도는?
---
$\mathbf v=[1,2t,0]=[1,2,0]$, $\mathbf a=[0,2,0]$. $\mathbf a\cdot\mathbf v=4$, $\mathbf v\cdot\mathbf v=5$이므로
$$\mathbf a_{\text{tan}}=\tfrac45[1,2,0]=[0.8,\ 1.6,\ 0],\qquad\mathbf a_{\text{norm}}=[-0.8,\ 0.4,\ 0],\qquad|\mathbf a_{\text{norm}}|=\sqrt{0.8}\approx0.894$$
속력이 늘고 있으므로($\frac{d^2s}{dt^2}>0$) 접선 성분은 운동 방향이고, 법선 성분은 포물선이 휘는 안쪽을 향합니다. 아래 곡률 공식으로 검산하면 $\kappa|\mathbf v|^2=\frac2{5^{3/2}}\cdot5\approx0.894$ ✓.
:::

:::ex 예제 5 (구심가속도, 원심력)
$\mathbf r(t)=[R\cos\omega t,\ R\sin\omega t]$는 반지름 $R$인 원 위를 반시계 방향으로 도는 운동입니다. $\mathbf v=[-R\omega\sin\omega t,\ R\omega\cos\omega t]$는 원에 접하고 속력 $|\mathbf v|=R\omega$가 일정합니다(속력/반지름 = **각속력** $\omega$). 그래도 가속도는 있습니다:
$$\mathbf a=\mathbf v'=[-R\omega^2\cos\omega t,\ -R\omega^2\sin\omega t]=-\omega^2\mathbf r$$
중심을 향하는 **구심가속도**, 크기 $\omega^2R$입니다. 속도의 **방향**이 일정한 비율로 바뀌기 때문에 생기고, 접선 가속도는 0입니다. 질량 $m$을 곱한 $m\mathbf a$가 구심력, 반대 벡터 $-m\mathbf a$가 원심력입니다.
예: 반지름 50 m의 원형 트랙을 20 m/s로 도는 자동차는 $\omega=0.4$ rad/s, 구심가속도 $0.4^2\cdot50=8$ m/s² (중력가속도의 약 0.8배).
:::

:::fig f08accel
:::

:::ex 예제 6 (두 회전의 겹침: 코리올리 가속도)
지구(반지름 $R$)가 $z$축 둘레로 각속력 $\omega$로 돌고, 발사체가 자오선을 따라 일정한 각속력 $\gamma$로 북쪽으로 움직인다. 가속도는?
---
지구와 함께 도는 단위벡터 $\mathbf b(t)=[\cos\omega t,\ \sin\omega t,\ 0]$를 쓰면 발사체의 위치는 $\mathbf r(t)=R\cos\gamma t\,\mathbf b(t)+R\sin\gamma t\,\mathbf k$ (위도 $\gamma t$). $\mathbf b''=-\omega^2\mathbf b$에 유의해 두 번 미분하면
$$\mathbf a=\underbrace{R\cos\gamma t\,\mathbf b''}_{\text{지구 자전의 구심가속도}}\ \underbrace{-\,2\gamma R\sin\gamma t\,\mathbf b'}_{\text{코리올리 가속도}}\ \underbrace{-\,\gamma^2\mathbf r}_{\text{자오선 운동의 구심가속도}}$$
첫째와 셋째 항은 예제 5와 같은 구심가속도이고, 가운데 항이 두 회전이 상호작용해서 생기는 뜻밖의 **코리올리 가속도**입니다. 북반구($\sin\gamma t>0$)에서 $\mathbf a_{\text{cor}}$는 $-\mathbf b'$ 방향, 곧 자전과 반대 방향이고 크기는 북극에서 최대, 적도에서 0입니다. 발사체는 그 반대 방향의 관성력을 받아 자오선에서 **오른쪽**으로 치우칩니다(남반구에서는 왼쪽). 미사일, 포탄, 대기의 흐름에서 실제로 관측됩니다.
:::

### 곡률과 비틀림 (선택)

호의 길이 $s$로 나타낸 곡선에서 **곡률**은 단위접선벡터가 방향을 바꾸는 빠르기, 곧 곡선이 접선(직선)에서 벗어나는 정도입니다.
$$\kappa(s)=|\mathbf u'(s)|=|\mathbf r''(s)|\qquad('=d/ds)$$
$\kappa\ne0$이면 $\mathbf p=\frac1\kappa\mathbf u'$을 **단위주법선벡터**(곡선이 휘는 쪽을 향함), $\mathbf b=\mathbf u\times\mathbf p$를 **단위종법선벡터**라 합니다. $\mathbf u$와 $\mathbf p$가 펼치는 평면이 **접촉평면**(곡선에 가장 잘 맞는 평면)이고, 서로 수직인 단위벡터 $\mathbf u,\mathbf p,\mathbf b$를 곡선의 **삼면체**라 합니다.

**비틀림**은 접촉평면이 돌아가는 빠르기, 곧 곡선이 평면에서 벗어나는 정도이고 그 법선 $\mathbf b$의 변화율로 잽니다. $\mathbf b$는 길이가 일정하므로 $\mathbf b'\perp\mathbf b$이고, $\mathbf b\cdot\mathbf u=0$을 미분하면 $\mathbf b'\cdot\mathbf u+\mathbf b\cdot\mathbf u'=\mathbf b'\cdot\mathbf u+\kappa\,\mathbf b\cdot\mathbf p=\mathbf b'\cdot\mathbf u=0$이라 $\mathbf b'\perp\mathbf u$입니다. 따라서 $\mathbf b'$는 $\mathbf p$에 평행하고, $\mathbf b'=-\tau\mathbf p$로 써서
$$\tau(s)=-\mathbf p(s)\cdot\mathbf b'(s)$$
를 비틀림이라 합니다. 부호는 오른나사 나선의 비틀림이 양수가 되도록 정한 것입니다. 평면곡선은 $\mathbf b$가 일정하므로 $\tau=0$입니다.

:::fig f08helix
:::

:::key 곡선의 기본량
$$s=\int_a^b|\mathbf r'(t)|\,dt,\qquad \mathbf u=\frac{\mathbf r'}{|\mathbf r'|},\qquad \kappa=\frac{|\mathbf r'\times\mathbf r''|}{|\mathbf r'|^3}$$
$$\tau=\frac{(\mathbf r'\ \mathbf r''\ \mathbf r''')}{|\mathbf r'\times\mathbf r''|^2},\qquad \mathbf a=\frac{d^2s}{dt^2}\mathbf u+\kappa\Big(\frac{ds}{dt}\Big)^2\mathbf p$$
:::

곡선이 임의의 매개변수 $t$로 주어졌을 때는 위의 공식을 씁니다. (가속도 식에 $\mathbf r'\times$를 하면 접선 성분이 사라져 $|\mathbf r'\times\mathbf r''|=\kappa|\mathbf r'|^3$이 나옵니다.) $1/\kappa$를 **곡률 반지름**이라 합니다. 반지름 $a$인 원은 곡률이 $1/a$로, 크게 돌수록 덜 휩니다.

:::ex 예제 7 (나선의 곡률과 비틀림)
$\mathbf r=[a\cos t,\ a\sin t,\ ct]$ ($a>0$)의 곡률과 비틀림은?
---
$\mathbf r'=[-a\sin t,\ a\cos t,\ c]$, $\mathbf r''=[-a\cos t,\ -a\sin t,\ 0]$, $\mathbf r'''=[a\sin t,\ -a\cos t,\ 0]$.
$\mathbf r'\times\mathbf r''=[ac\sin t,\ -ac\cos t,\ a^2]$, $|\mathbf r'\times\mathbf r''|=a\sqrt{a^2+c^2}$, $|\mathbf r'|^3=(a^2+c^2)^{3/2}$이므로
$$\kappa=\frac a{a^2+c^2},\qquad\tau=\frac{(\mathbf r'\times\mathbf r'')\cdot\mathbf r'''}{a^2(a^2+c^2)}=\frac{a^2c}{a^2(a^2+c^2)}=\frac c{a^2+c^2}$$
둘 다 상수입니다. $c=0$이면 원($\kappa=\frac1a$, $\tau=0$), $c>0$ (오른나사)이면 $\tau>0$. 주법선 $\mathbf p=[-\cos t,-\sin t,0]$은 언제나 축을 향합니다.
:::

:::ex 예제 8 (평면곡선)
포물선 $y=x^2$의 원점에서의 곡률 반지름은?
---
$\mathbf r=[t,t^2,0]$, $\mathbf r'=[1,2t,0]$, $\mathbf r''=[0,2,0]$. $t=0$에서 $|\mathbf r'\times\mathbf r''|=2$, $|\mathbf r'|=1$이므로 $\kappa=2$, 곡률 반지름 $\frac12$. 일반적으로 그래프 $y=f(x)$의 곡률은 $\kappa=\dfrac{|f''|}{(1+f'^2)^{3/2}}$입니다.
:::

곡선의 매개변수화는 다음 단원의 선적분 계산의 첫 단계입니다[[ch09:10.1|선적분.]].
` },
      { k: '9.6', p: '392', title: '다변수 함수 복습 (선택)', body: R`
곡선은 한 변수의 벡터함수였습니다. 곡면과 벡터장에는 여러 변수의 함수가 필요하므로, 다음 절들에서 쓰는 두 도구를 정리합니다.

:::thm 연쇄법칙 (교재 §9.6 Theorem 1)
$w=f(x,y,z)$가 연속인 1계 편도함수를 가지고, $x=x(u,v)$, $y=y(u,v)$, $z=z(u,v)$도 그러하면 $w(u,v)=f(x(u,v),y(u,v),z(u,v))$의 편도함수는
$$\frac{\partial w}{\partial u}=\frac{\partial w}{\partial x}\frac{\partial x}{\partial u}+\frac{\partial w}{\partial y}\frac{\partial y}{\partial u}+\frac{\partial w}{\partial z}\frac{\partial z}{\partial u},\qquad\frac{\partial w}{\partial v}=\frac{\partial w}{\partial x}\frac{\partial x}{\partial v}+\frac{\partial w}{\partial y}\frac{\partial y}{\partial v}+\frac{\partial w}{\partial z}\frac{\partial z}{\partial v}$$
:::

“바깥 함수의 각 변수에 대한 편도함수 × 그 변수의 안쪽 편도함수”를 모든 경로에 대해 더합니다. 특수한 경우:
- 두 변수: $w=f(x,y)$, $x=x(u,v)$, $y=y(u,v)$이면 $\frac{\partial w}{\partial u}=\frac{\partial w}{\partial x}\frac{\partial x}{\partial u}+\frac{\partial w}{\partial y}\frac{\partial y}{\partial u}$.
- 한 변수를 따라: $x,y,z$가 $t$만의 함수이면 $\dfrac{dw}{dt}=\dfrac{\partial w}{\partial x}\dfrac{dx}{dt}+\dfrac{\partial w}{\partial y}\dfrac{dy}{dt}+\dfrac{\partial w}{\partial z}\dfrac{dz}{dt}$, 벡터로 쓰면 곡선 $\mathbf r(t)$ 위에서
$$\frac d{dt}f(\mathbf r(t))=\nabla f\cdot\mathbf r'(t)$$
다음 절의 방향도함수와 곡면의 법선, 그리고 선적분의 경로 독립이 모두 이 식에서 나옵니다.[[@base:ch04:4.2|다변수 연쇄법칙과 야코비 행렬.]]

:::ex 예제 1 (극좌표)
$w=x^2+y^2$, $x=r\cos\theta$, $y=r\sin\theta$일 때 $\partial w/\partial\theta$와 $\partial w/\partial r$은?
---
$\frac{\partial w}{\partial\theta}=2x(-r\sin\theta)+2y(r\cos\theta)=-2r^2\cos\theta\sin\theta+2r^2\sin\theta\cos\theta=0$. $\frac{\partial w}{\partial r}=2x\cos\theta+2y\sin\theta=2r$. $w=r^2$이니 당연한 결과입니다.
:::

:::ex 예제 2 (곡면 위의 편도함수)
$f=xyz$를 곡면 $z=x+y$ 위에서 생각한 $w(x,y)=f(x,y,x+y)$의 $\partial w/\partial x$는?
---
$z=g(x,y)$를 통해서도 $x$가 들어가므로 $\frac{\partial w}{\partial x}=f_x+f_z\,g_x=yz+xy\cdot1=y(x+y)+xy=2xy+y^2$. 직접: $w=x^2y+xy^2$이므로 $w_x=2xy+y^2$ ✓. 기호 $\frac{\partial f}{\partial x}$ (곡면 제약 없이)와 $\frac{\partial w}{\partial x}$ (곡면 위)를 구별해야 합니다.
:::

:::thm 평균값 정리 (교재 §9.6 Theorem 2)
$f(x,y,z)$가 볼록 영역에서 연속인 1계 편도함수를 가지면, 그 안의 점 $P_0$와 $P_0+\mathbf h$에 대해
$$f(P_0+\mathbf h)-f(P_0)=\nabla f(P_0+\theta\mathbf h)\cdot\mathbf h\qquad(0<\theta<1)$$
:::

선분 $P_0+t\mathbf h$ ($0\le t\le1$) 위에서 $F(t)=f(P_0+t\mathbf h)$에 한 변수 평균값 정리를 쓰고 연쇄법칙으로 $F'(t)=\nabla f\cdot\mathbf h$를 대입하면 됩니다. 두 변수, 한 변수의 경우도 같은 꼴입니다. “볼록” 조건은 선분이 영역 밖으로 나가지 않게 하려는 것입니다.
` },
      { k: '9.7', p: '395', title: '기울기와 방향도함수', body: R`
응용에 나오는 벡터장 가운데 일부(전부는 아님!)는 스칼라장에서 얻을 수 있습니다. 벡터 세 성분 대신 스칼라 하나를 다루면 훨씬 쉬우므로 큰 이점이고, 스칼라장에서 벡터장을 만드는 도구가 **기울기**입니다.

:::def 기울기
미분가능한 스칼라함수 $f(x,y,z)$의 기울기는
$$\operatorname{grad}f=\nabla f=\Big[\frac{\partial f}{\partial x},\ \frac{\partial f}{\partial y},\ \frac{\partial f}{\partial z}\Big]$$
입니다. $\nabla=\frac{\partial}{\partial x}\mathbf i+\frac{\partial}{\partial y}\mathbf j+\frac{\partial}{\partial z}\mathbf k$ (“나블라”)는 미분연산자입니다.
:::

예: $f=x^2y+yz^3$이면 $\nabla f=[2xy,\ x^2+z^3,\ 3yz^2]$. 기울기는 (1) 임의 방향의 변화율, (2) 곡면의 법선, (3) 스칼라장에서 벡터장 만들기에 쓰입니다.

### 방향도함수

편도함수는 좌표축 방향의 변화율입니다. 이것을 임의의 방향으로 넓힙니다.

:::def 방향도함수
점 $P$에서 벡터 $\mathbf b$ 방향의 **방향도함수**는
$$D_{\mathbf b}f=\frac{df}{ds}=\lim_{s\to0}\frac{f(Q)-f(P)}{s}$$
입니다. $Q$는 $P$를 지나 $\mathbf b$ 방향인 직선 위의 점이고 $|s|$는 $P$와 $Q$ 사이의 거리입니다($Q$가 $\mathbf b$ 쪽이면 $s>0$).
:::

**계산 공식의 유도.** $|\mathbf b|=1$이면 그 직선은 $\mathbf r(s)=\mathbf p_0+s\mathbf b$ ($\mathbf p_0$: $P$의 위치벡터)이고 $s$가 호의 길이입니다. $D_{\mathbf b}f$는 $f(x(s),y(s),z(s))$의 $s=0$에서의 도함수이므로 연쇄법칙과 $\mathbf r'(s)=\mathbf b$에서
$$D_{\mathbf b}f=\frac{\partial f}{\partial x}x'+\frac{\partial f}{\partial y}y'+\frac{\partial f}{\partial z}z'=\mathbf b\cdot\nabla f\qquad(|\mathbf b|=1)$$
방향이 길이가 1이 아닌 벡터 $\mathbf a$로 주어지면 반드시 단위벡터로 바꿔서
$$D_{\mathbf a}f=\frac1{|\mathbf a|}\mathbf a\cdot\nabla f$$

:::key 기울기와 방향도함수
$$\nabla f=\Big(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\Big),\qquad D_{\mathbf b}f=\frac{\mathbf b\cdot\nabla f}{|\mathbf b|}$$
$$\max_{\mathbf b}D_{\mathbf b}f=|\nabla f|,\qquad \text{곡면 } f=c\text{의 법선벡터}=\nabla f$$
:::

:::ex 예제 1 (방향도함수와 최대 증가율)
$f=xy^2+z^3$의 $P(1,-1,1)$에서 $\mathbf a=[2,1,-2]$ 방향의 방향도함수와 최대 증가율, 그 방향은?
---
$\nabla f=[y^2,\ 2xy,\ 3z^2]$, $P$에서 $[1,-2,3]$. $|\mathbf a|=3$이므로
$$D_{\mathbf a}f=\frac{2-2-6}{3}=-2$$
음수이므로 이 방향으로는 $f$가 줄어듭니다. 가장 빨리 늘어나는 방향은 $\nabla f(P)=[1,-2,3]$ 방향이고, 그 증가율은 $|\nabla f|=\sqrt{14}\approx3.74$.
:::

:::warn 단위벡터
방향벡터를 단위벡터로 만들지 않는 실수가 가장 많습니다. 반드시 $|\mathbf b|$로 나누세요.
:::

### 기울기는 벡터이고, 최대 증가 방향을 가리킨다

$\nabla f$는 성분이 세 개이니 벡터처럼 보이지만, 직교좌표의 성분으로 정의했으므로 좌표계를 바꿔도 길이와 방향이 같은지 확인해야 진짜 벡터입니다. (예를 들어 $[f_x,\ 2f_y,\ f_z]$도 성분은 세 개이지만 좌표계를 돌리면 길이와 방향이 바뀝니다.)

:::thm 최대 증가 방향 (교재 §9.7 Theorem 1)
$f$가 연속인 1계 편도함수를 가지면 $\nabla f$는 벡터, 곧 길이와 방향이 직교좌표계의 선택과 무관합니다. $\nabla f(P)\ne\mathbf 0$이면 그것은 $P$에서 $f$가 **가장 빨리 증가하는 방향**을 가리키고, 그 증가율이 $|\nabla f|$입니다.
:::

**증명.** $|\mathbf b|=1$이면 $D_{\mathbf b}f=|\mathbf b||\nabla f|\cos\gamma=|\nabla f|\cos\gamma$ ($\gamma$: $\mathbf b$와 $\nabla f$의 사잇각). $f$는 스칼라함수라 각 점의 값이 좌표계와 무관하고, 직선 위의 거리 $s$도 그러하므로 $D_{\mathbf b}f$도 좌표계와 무관합니다. 이 값은 $\cos\gamma=1$, 곧 $\mathbf b$가 $\nabla f$ 방향일 때 최대이고 최댓값이 $|\nabla f|$입니다. “최대가 되는 방향”과 “최댓값”은 좌표계와 무관한 양이므로 $\nabla f$의 방향과 길이도 그렇습니다. 같은 식에서 $\gamma=\pi$ ($-\nabla f$ 방향)이면 가장 빨리 감소하고, $\gamma=\pi/2$이면 변화율이 0입니다.

### 곡면의 법선벡터로서의 기울기

$f(x,y,z)=c$ (상수)가 나타내는 곡면 $S$를 $f$의 **등위면**이라 합니다. $S$ 위의 점 $P$를 지나 $S$ 위에 놓인 곡선 $\mathbf r(t)$는 $f(x(t),y(t),z(t))=c$를 만족하므로, 미분하면 연쇄법칙에서
$$\frac{\partial f}{\partial x}x'+\frac{\partial f}{\partial y}y'+\frac{\partial f}{\partial z}z'=\nabla f\cdot\mathbf r'=0$$
곧 $\nabla f$는 $S$ 위의 모든 곡선의 접선벡터에 수직입니다. 이 접선벡터들이 이루는 평면이 **접평면**(뿔의 꼭짓점 같은 예외는 제외)이고, 그 법선이 **곡면의 법선**입니다.

:::thm 곡면의 법선벡터 (교재 §9.7 Theorem 2)
곡면 $S: f(x,y,z)=c$ 위의 점 $P$에서 $\nabla f(P)\ne\mathbf 0$이면, $\nabla f(P)$는 $P$에서 $S$의 법선벡터입니다. 접평면은 $\nabla f(P)\cdot(\mathbf x-\mathbf p)=0$.
:::

평면에서는 기울기가 **등고선에 수직**이고, 이것이 직교 궤적의 원리입니다[[ch01:1.6|직교 궤적.]].

:::fig f08grad
:::

:::ex 예제 2 (접평면)
타원면 $x^2+2y^2+3z^2=6$ 위의 점 $(1,1,1)$에서의 접평면은?
---
$\nabla f=(2x,4y,6z)=(2,4,6)$. $2(x-1)+4(y-1)+6(z-1)=0$, 즉 $x+2y+3z=6$.
:::

:::ex 예제 3 (포물면의 단위법선)
$z=x^2+y^2$의 점 $(1,2,5)$에서의 단위법선벡터와 접평면은?
---
등위면 $f=x^2+y^2-z=0$으로 보면 $\nabla f=[2x,2y,-1]=[2,4,-1]$. 단위법선 $\mathbf n=\frac1{\sqrt{21}}[2,4,-1]$ (아래쪽을 향함; 다른 하나는 $-\mathbf n$). 접평면 $2(x-1)+4(y-2)-(z-5)=0$, 곧 $z=2x+4y-5$. $(1,2)$에서 $2+8-5=5$ ✓.
:::

### 퍼텐셜: 기울기인 벡터장

벡터장 $\mathbf v(P)$가 어떤 스칼라함수의 기울기 $\mathbf v=\nabla f$이면 $f$를 $\mathbf v$의 **퍼텐셜**이라 하고, $\mathbf v$를 **보존장**이라 합니다. 이런 장에서 물체(또는 전하)를 한 점에서 다른 점으로 옮겼다가 되돌아오면 에너지가 잃거나 얻는 것 없이 보존되기 때문입니다(일이 경로에 무관함, §10.2)[[ch09:10.2|경로 독립과 퍼텐셜.]]. 가장 중요한 예가 중력장입니다.

:::thm 중력장과 라플라스 방정식 (교재 §9.7 Theorem 3)
뉴턴의 인력 $\mathbf p=-\frac c{r^3}[x-x_0,\ y-y_0,\ z-z_0]$은 퍼텐셜 $f=\dfrac cr$을 가지며($r>0$), 이 $f$는 **라플라스 방정식**
$$\nabla^2f=\frac{\partial^2f}{\partial x^2}+\frac{\partial^2f}{\partial y^2}+\frac{\partial^2f}{\partial z^2}=0$$
을 만족합니다.
:::

**증명.** $r=\big((x-x_0)^2+(y-y_0)^2+(z-z_0)^2\big)^{1/2}$이므로
$$\frac{\partial}{\partial x}\Big(\frac1r\Big)=-\frac1{r^2}\cdot\frac{x-x_0}{r}=-\frac{x-x_0}{r^3}$$
이고 $y$, $z$도 같습니다. 따라서 $\nabla(c/r)=\mathbf p$. 한 번 더 미분하면
$$\frac{\partial^2}{\partial x^2}\Big(\frac1r\Big)=-\frac1{r^3}+\frac{3(x-x_0)^2}{r^5}$$
세 개를 더하면 $-\frac3{r^3}+\frac{3r^2}{r^5}=0$.

$\nabla^2$ (또는 $\Delta$)를 **라플라스 연산자**, $\nabla^2f$를 **라플라시안**이라 합니다. 임의의 질량 분포가 만드는 힘의 장도 퍼텐셜의 기울기이고, 그 퍼텐셜은 물질이 없는 영역에서 라플라스 방정식을 만족합니다. 정전기의 쿨롱 법칙 $\mathbf p=k\frac{\mathbf r}{r^3}$도 같은 꼴이라 전기장 $\mathbf E=-\nabla\Phi$에도 그대로 적용됩니다[[ch16:18.1|정전기 퍼텐셜.]]. 라플라스 방정식은 12장과 18장에서 자세히 다룹니다.[[@base:ch04:4.1|편미분과 선형 근사: 방향도함수 $\nabla f\cdot\mathbf u$.]]

:::ex 예제 4 (열의 흐름)
온도 분포가 $T(x,y,z)=100-x^2-2y^2-z^2$ (°C)인 물체에서, 점 $(1,1,2)$의 열은 어느 방향으로 흐르는가? 등온면은?
---
열은 온도가 가장 빨리 **감소**하는 방향, 곧 $-\nabla T$ 방향으로 흐릅니다(푸리에 법칙: 열 흐름 $=-K\nabla T$). $\nabla T=[-2x,-4y,-2z]=[-2,-4,-4]$이므로 흐름은 $[2,4,4]$, 단위벡터로 $\frac13[1,2,2]$ 방향입니다. 등온면 $T=$상수는 $x^2+2y^2+z^2=$상수인 타원면이고, 열의 흐름은 등온면에 수직입니다.
:::
` },
      { k: '9.8', p: '402', title: '벡터장의 발산', body: R`
벡터 미적분이 공학과 물리에서 중요한 것은 대부분 기울기, 발산, 회전 덕분입니다. 스칼라장에서 기울기로 벡터장을 얻었고, 거꾸로 벡터장에서 **발산**으로 스칼라장을, **회전**으로 다른 벡터장을 얻습니다.

:::def 발산
미분가능한 벡터함수 $\mathbf v=[v_1,v_2,v_3]$의 발산은
$$\operatorname{div}\mathbf v=\nabla\cdot\mathbf v=\frac{\partial v_1}{\partial x}+\frac{\partial v_2}{\partial y}+\frac{\partial v_3}{\partial z}$$
:::

예: $\mathbf v=[x^2z,\ -xy,\ yz^2]$이면 $\operatorname{div}\mathbf v=2xz-x+2yz$. $\nabla\cdot\mathbf v$는 편리한 기호일 뿐이고, “$\frac{\partial}{\partial x}$ 곱하기 $v_1$”은 $\frac{\partial v_1}{\partial x}$를 뜻합니다. $\nabla\cdot\mathbf v$는 스칼라이고 $\nabla f$는 벡터라는 점을 구별하세요.

:::thm 발산의 불변성 (교재 §9.8 Theorem 1)
$\operatorname{div}\mathbf v$는 스칼라함수입니다. 곧 그 값은 점(과 $\mathbf v$)에만 의존하고 직교좌표의 선택과 무관합니다: 다른 직교좌표 $x^*,y^*,z^*$와 그 성분으로 계산해도 $\frac{\partial v_1^*}{\partial x^*}+\frac{\partial v_2^*}{\partial y^*}+\frac{\partial v_3^*}{\partial z^*}$가 같은 값입니다.
:::

물리적 성질을 나타내는 양이라면 당연히 좌표계와 무관해야 합니다. 증명은 적분을 써서 §10.7에서 합니다.

**기울기의 발산 = 라플라시안.** $f$가 두 번 미분가능하면 $\mathbf v=\nabla f$의 발산은
$$\operatorname{div}(\operatorname{grad}f)=\frac{\partial^2f}{\partial x^2}+\frac{\partial^2f}{\partial y^2}+\frac{\partial^2f}{\partial z^2}=\nabla^2f$$
따라서 §9.7 Theorem 3에서 중력장 $\mathbf p=\nabla(c/r)$은 $\operatorname{div}\mathbf p=\nabla^2(c/r)=0$ ($r>0$)입니다.

### 물리적 의미: 유체의 연속방정식

:::ex 예제 1 (압축성 유체의 흐름과 발산)
샘(유체가 생기는 점)이나 싱크(사라지는 점)가 없는 영역에서 유체가 흐른다. 밀도 $\rho(x,y,z,t)$ (기체라면 위치와 시간에 따라 변함)와 속도 $\mathbf v$로 질량 보존을 식으로 쓰세요.
---
**작은 상자.** 모서리가 $\Delta x$, $\Delta y$, $\Delta z$이고 좌표축에 평행한 상자 $B$ (부피 $\Delta V=\Delta x\Delta y\Delta z$)를 생각하고 $\mathbf u=\rho\mathbf v=[u_1,u_2,u_3]$ (단위 넓이·단위 시간당 질량 흐름)으로 둡니다.
**한 쌍의 면.** $y$축에 수직인 왼쪽 면(넓이 $\Delta x\Delta z$)으로는 $v_1$, $v_3$ 성분이 면에 평행해 기여하지 않으므로, 짧은 시간 $\Delta t$ 동안 들어오는 질량은 약 $(u_2)_y\Delta x\Delta z\Delta t$, 맞은편 면으로 나가는 질량은 약 $(u_2)_{y+\Delta y}\Delta x\Delta z\Delta t$입니다. 차이(손실)는
$$\big[(u_2)_{y+\Delta y}-(u_2)_y\big]\Delta x\Delta z\Delta t=\frac{\Delta u_2}{\Delta y}\Delta V\Delta t$$
**세 쌍을 더하면** 상자의 질량 손실은 약 $\Big(\frac{\Delta u_1}{\Delta x}+\frac{\Delta u_2}{\Delta y}+\frac{\Delta u_3}{\Delta z}\Big)\Delta V\Delta t$.
**밀도의 감소와 같다.** 샘이 없으므로 이 손실은 상자 안 밀도의 감소 $-\frac{\partial\rho}{\partial t}\Delta V\Delta t$와 같습니다. $\Delta V\Delta t$로 나누고 모든 $\Delta$를 0으로 보내면
$$\frac{\partial\rho}{\partial t}+\operatorname{div}(\rho\mathbf v)=0$$
이것이 압축성 유체의 **연속방정식**(질량 보존)입니다.
- **정상 흐름**(시간에 무관)이면 $\operatorname{div}(\rho\mathbf v)=0$.
- **비압축성**($\rho$ 일정)이면 $\operatorname{div}\mathbf v=0$: 어느 부피 요소에서나 들어오는 양과 나가는 양이 늘 같습니다. 이런 $\mathbf v$를 **솔레노이드장**이라고도 합니다.
:::

결론적으로 **발산은 “단위 부피당 (나가는 양 − 들어오는 양)”**, 곧 샘의 세기입니다. 양수이면 그 점에서 흘러나오고(샘), 음수이면 빨려 들어갑니다(싱크). 비압축·비회전 2차원 흐름을 복소 퍼텐셜로 다루는 출발점이 $\operatorname{div}\mathbf v=0$입니다[[ch16:18.4|비압축·비회전 흐름과 복소 퍼텐셜.]]. 열이 흐르는 물체에서 열 흐름에 같은 균형을 적용하면 열방정식이 나옵니다[[ch11:12.5|열방정식의 유도.]].

:::fig f08div
:::

:::ex 예제 2 (발산 계산)
(a) $\mathbf v=[x^2y,\ xyz,\ -xz^2]$의 발산과 점 $(1,2,1)$에서의 값, (b) $\mathbf v=[x,y,z]$, (c) $\mathbf v=[y,-x,0]$
---
(a) $\operatorname{div}\mathbf v=2xy+xz-2xz=2xy-xz$. $(1,2,1)$에서 $4-1=3>0$ (샘).
(b) $1+1+1=3$: 모든 점에서 균일하게 팽창하는 흐름입니다.
(c) $0+0+0=0$: 회전 흐름은 부피를 바꾸지 않습니다.
:::

:::ex 예제 3 (곱의 발산)
$\operatorname{div}(f\mathbf v)=f\operatorname{div}\mathbf v+\mathbf v\cdot\nabla f$를 써서 $\operatorname{div}(r^n\mathbf r)$ ($\mathbf r=[x,y,z]$, $r=|\mathbf r|$)를 구하세요.
---
$\operatorname{div}\mathbf r=3$, $\nabla r^n=nr^{n-1}\nabla r=nr^{n-2}\mathbf r$이므로
$$\operatorname{div}(r^n\mathbf r)=3r^n+\mathbf r\cdot nr^{n-2}\mathbf r=(n+3)r^n$$
$n=-3$일 때만 0입니다. 중력장 $-c\,\mathbf r/r^3$의 발산이 0인 것($r\ne0$)과 일치합니다.
:::

발산이 “단위 부피당 유출량”이라는 뜻은 발산 정리로 정확해집니다[[ch09:10.7|발산 정리.]].
` },
      { k: '9.9', p: '406', title: '벡터장의 회전', body: R`
기울기, 발산과 함께 벡터 미적분의 세 번째 기본 연산이 **회전**입니다.

:::def 회전
미분가능한 $\mathbf v=[v_1,v_2,v_3]$의 회전은 (오른손 좌표계에서) 형식적 행렬식
$$\operatorname{curl}\mathbf v=\nabla\times\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\ \partial_x&\partial_y&\partial_z\\ v_1&v_2&v_3\end{vmatrix}=\Big(\frac{\partial v_3}{\partial y}-\frac{\partial v_2}{\partial z},\ \frac{\partial v_1}{\partial z}-\frac{\partial v_3}{\partial x},\ \frac{\partial v_2}{\partial x}-\frac{\partial v_1}{\partial y}\Big)$$
입니다. 왼손 좌표계에서는 앞에 $-$가 붙습니다. $\operatorname{rot}\mathbf v$로도 씁니다.
:::

**외우는 법.** 성분이 $x\to y\to z\to x$로 순환합니다: 첫 성분은 “$v_3$을 $y$로 − $v_2$를 $z$로”, 나머지는 첨자를 한 칸씩 돌리면 됩니다.

:::ex 예제 1 (회전 계산)
$\mathbf v=[xy,\ yz,\ zx]$의 회전은?
---
$$\operatorname{curl}\mathbf v=\Big(\frac{\partial(zx)}{\partial y}-\frac{\partial(yz)}{\partial z},\ \frac{\partial(xy)}{\partial z}-\frac{\partial(zx)}{\partial x},\ \frac{\partial(yz)}{\partial x}-\frac{\partial(xy)}{\partial y}\Big)=(0-y,\ 0-z,\ 0-x)=[-y,\ -z,\ -x]$$
:::

### 강체의 회전과 회전 연산

§9.3에서 고정축 둘레로 도는 강체의 속도장은 $\mathbf v=\mathbf w\times\mathbf r$이었습니다($\mathbf w$: 축 방향, 길이 $\omega$). 축을 $z$축으로 잡으면 $\mathbf w=[0,0,\omega]$, $\mathbf v=[-\omega y,\ \omega x,\ 0]$이고
$$\operatorname{curl}\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\ \partial_x&\partial_y&\partial_z\\ -\omega y&\omega x&0\end{vmatrix}=[0,\ 0,\ 2\omega]=2\mathbf w$$

:::thm 회전체와 회전 연산 (교재 §9.9 Theorem 1)
회전하는 강체의 속도장의 회전은 회전축 방향이고, 크기는 각속력의 두 배입니다.
:::

그래서 회전 연산은 “그 점에서 유체 요소가 도는 각속도의 두 배”로 읽을 수 있습니다. 차를 저을 때 생기는 소용돌이 같은 흐름은 회전이 0이 아닙니다.

:::ex 예제 2 (강체 회전)
$z$축 둘레로 각속도 3으로 도는 강체의 속도장과 회전은?
---
$\boldsymbol\omega=(0,0,3)$, $\mathbf v=\boldsymbol\omega\times\mathbf r=(-3y,\ 3x,\ 0)$.
$\operatorname{curl}\mathbf v=\big(0,\ 0,\ 3-(-3)\big)=(0,0,6)=2\boldsymbol\omega$ ✓. 발산은 0 (강체는 압축되지 않음).
:::

:::ex 예제 3 (흐름선이 곧아도 회전할 수 있다)
층밀림 흐름 $\mathbf v=[y,0,0]$ (위로 갈수록 빠르게 오른쪽으로 흐름)의 회전과, 원점 둘레를 도는 흐름 $\mathbf v=\big[\frac{-y}{x^2+y^2},\frac{x}{x^2+y^2},0\big]$의 회전은?
---
층밀림: $\operatorname{curl}\mathbf v=\big(0,\ 0,\ 0-1\big)=-\mathbf k$. 흐름선은 모두 직선이지만 위아래 속도 차 때문에 작은 바람개비는 시계 방향으로 돕니다.
원점 둘레 흐름: $\frac{\partial}{\partial x}\frac{x}{x^2+y^2}=\frac{y^2-x^2}{(x^2+y^2)^2}$, $\frac{\partial}{\partial y}\frac{-y}{x^2+y^2}=-\frac{(x^2+y^2)-2y^2}{(x^2+y^2)^2}=\frac{y^2-x^2}{(x^2+y^2)^2}$이므로 셋째 성분은 $\frac{y^2-x^2}{(x^2+y^2)^2}-\frac{y^2-x^2}{(x^2+y^2)^2}=0$. 원점을 뺀 모든 곳에서 회전이 0입니다. 흐름이 원을 그리지만 바깥으로 갈수록 딱 알맞게 느려져서 유체 요소는 스스로 돌지 않습니다. 이 장은 다음 장에서 “회전은 0인데 퍼텐셜이 없는” 유명한 예로 다시 나옵니다(원점이 빠진 영역은 단순연결이 아님).
:::

:::fig f08curl
:::

### 기울기·발산·회전 사이의 관계

:::thm 기울기, 발산, 회전 (교재 §9.9 Theorem 2)
기울기장은 비회전입니다: 연속인 2계 편도함수를 가진 $f$에 대해
$$\operatorname{curl}(\operatorname{grad}f)=\mathbf 0$$
또 회전의 발산은 0입니다: 두 번 연속미분가능한 $\mathbf v$에 대해
$$\operatorname{div}(\operatorname{curl}\mathbf v)=0$$
:::

**증명.** $\operatorname{curl}(\nabla f)$의 첫 성분은 $\frac{\partial}{\partial y}f_z-\frac{\partial}{\partial z}f_y=f_{zy}-f_{yz}=0$ (혼합편미분의 대칭성, 슈바르츠 정리)이고 나머지도 같습니다. $\operatorname{div}(\operatorname{curl}\mathbf v)=\frac{\partial}{\partial x}(v_{3,y}-v_{2,z})+\frac{\partial}{\partial y}(v_{1,z}-v_{3,x})+\frac{\partial}{\partial z}(v_{2,x}-v_{1,y})$에서 여섯 항이 둘씩 짝지어 지워집니다($v_{3,yx}$와 $-v_{3,xy}$ 등).

:::key 발산과 회전
$$\operatorname{div}\mathbf v=\nabla\cdot\mathbf v,\qquad \operatorname{curl}\mathbf v=\nabla\times\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\ \partial_x&\partial_y&\partial_z\\ v_1&v_2&v_3\end{vmatrix}$$
$$\operatorname{curl}(\nabla f)=\mathbf 0,\qquad \operatorname{div}(\operatorname{curl}\mathbf v)=0$$
:::

$\operatorname{curl}\mathbf v=\mathbf 0$인 장을 **비회전장**이라 합니다. 회전으로 흐름의 회전을 특징짓기 때문에 붙은 이름이고, 속도장이 아닌 곳에서 기울기장이 나오면 보통 **보존장**이라 부릅니다(§9.7). 중력장은 $\operatorname{curl}\mathbf p=\mathbf 0$인 비회전 기울기장입니다. 기울기장은 항상 비회전이고, 단순연결 영역에서는 그 역도 성립합니다(비회전 ⟹ 기울기장)[[ch09:10.2|회전이 0이면 퍼텐셜 존재.]]. $\operatorname{div}(\operatorname{curl}\mathbf v)=0$도 회전(소용돌이)과 발산(유출)의 해석에서 그럴듯합니다: 순수한 소용돌이에는 샘이 없습니다.

:::thm 회전의 불변성 (교재 §9.9 Theorem 3)
$\operatorname{curl}\mathbf v$는 벡터입니다. 곧 길이와 방향이 공간의 직교좌표계의 선택과 무관합니다.
:::

(증명은 교재 부록 4에 있고 꽤 깁니다.) 회전이 “단위 넓이당 순환”이라는 뜻은 스토크스 정리로 정확해집니다[[ch09:10.9|스토크스 정리.]].

### 곱의 미분과 퍼텐셜 구하기

:::key 곱의 미분 공식
$$\nabla(fg)=f\nabla g+g\nabla f,\qquad \nabla\cdot(f\mathbf v)=f\,\nabla\cdot\mathbf v+\mathbf v\cdot\nabla f$$
$$\nabla\times(f\mathbf v)=\nabla f\times\mathbf v+f\,\nabla\times\mathbf v$$
:::

모두 성분으로 쓰고 보통의 곱의 미분법을 적용하면 확인됩니다. 이 밖에 자주 쓰는 항등식으로 $\operatorname{div}(\mathbf u\times\mathbf v)=\mathbf v\cdot\operatorname{curl}\mathbf u-\mathbf u\cdot\operatorname{curl}\mathbf v$, $\operatorname{curl}(\operatorname{curl}\mathbf v)=\operatorname{grad}(\operatorname{div}\mathbf v)-\nabla^2\mathbf v$가 있습니다.

:::ex 예제 4 (퍼텐셜 찾기)
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

이로써 벡터 미분이 끝났습니다. 다음 장의 벡터 적분은 여기서 다룬 내적·외적, 곡선의 매개변수 표현, 그리고 기울기·발산·회전을 모두 씁니다.
` },
    ],
  });
})();
