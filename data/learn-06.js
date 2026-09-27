/* 개념 정리 — 06 행렬과 연립일차방정식 (Kreyszig 10판 7장, §7.1–7.9). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 6,
    summary: R`교재 7장은 행렬 계산(§7.1–7.8)과 그 뒤의 추상적인 틀(§7.9 벡터공간·내적공간·선형변환)로 이루어집니다. 공학수학 2는 §7.9를 출발점으로 삼아 **내적**을 통해 푸리에 급수로 넘어가므로, 이 절을 세 부분으로 나누어 자세히 정리했습니다.`,
    goals: [
      R`가우스 소거법으로 연립방정식을 풀고 계수로 해의 개수를 판정할 수 있다`,
      R`행렬식의 성질, 크래머 공식, 역행렬 계산을 쓸 수 있다`,
      R`벡터공간·부분공간·기저·차원을 정의하고 예를 들 수 있다`,
      R`선형사상의 커널·이미지와 차원정리를 쓸 수 있다`,
      R`내적·노름·직교성을 정의하고 정사영으로 최선 근사를 구할 수 있다`,
    ],
    sections: [
      { k: '7.1', p: '257', title: '행렬과 벡터: 덧셈과 스칼라곱', body: R`
행렬은 수를 직사각형으로 배열한 것이고, 연립방정식의 계수·데이터 표·선형변환을 한꺼번에 담는 그릇입니다. $m\times n$ 행렬 $A=[a_{jk}]$에서 첫 첨자 $j$는 행, 둘째 첨자 $k$는 열입니다. 열이 하나이면 **열벡터**, 행이 하나이면 **행벡터**입니다.

- **상등**: 크기가 같고 모든 성분이 같을 때 $A=B$.
- **덧셈**: 크기가 같은 행렬끼리 성분별로 더합니다. $A+B=B+A$, $(A+B)+C=A+(B+C)$, $A+0=A$, $A+(-A)=0$.
- **스칼라곱**: 모든 성분에 $c$를 곱합니다. $c(A+B)=cA+cB$, $(c+k)A=cA+kA$, $c(kA)=(ck)A$, $1A=A$.

이 여덟 가지 규칙은 §7.9에서 **벡터공간의 공리**가 됩니다[[ch06:7.9|같은 규칙을 만족하는 집합을 모두 “벡터공간”이라 부릅니다.]].

:::ex 예제
$A=\begin{pmatrix}2&-1\\0&3\end{pmatrix}$, $B=\begin{pmatrix}1&4\\-2&5\end{pmatrix}$일 때 $3A-2B$는?
---
$$3A-2B=\begin{pmatrix}6-2&-3-8\\0+4&9-10\end{pmatrix}=\begin{pmatrix}4&-11\\4&-1\end{pmatrix}$$
:::
` },
      { k: '7.2', p: '263', title: '행렬의 곱', body: R`
$A$가 $m\times n$, $B$가 $n\times p$이면 곱 $C=AB$는 $m\times p$이고, $c_{jk}$는 **$A$의 $j$행과 $B$의 $k$열의 내적**입니다. $A$의 열 수와 $B$의 행 수가 같아야만 정의됩니다.

왜 이렇게 이상하게 정의할까요? 행렬을 선형변환 $\mathbf x\mapsto A\mathbf x$로 보면, $AB$는 “먼저 $B$로 변환하고 이어서 $A$로 변환”한 합성이 되도록 정의한 것입니다[[ch06:7.9|선형사상의 합성은 행렬의 곱에 대응합니다.]].

:::key 곱과 전치
$$c_{jk}=\sum_{l=1}^{n}a_{jl}b_{lk},\qquad (AB)^T=B^TA^T,\qquad (AB)^{-1}=B^{-1}A^{-1}$$
:::

- **교환법칙이 성립하지 않습니다**: $AB\ne BA$가 보통이고, 한쪽만 정의될 수도 있습니다.
- $AB=0$이어도 $A=0$ 또는 $B=0$이라는 보장이 없고, $AB=AC$에서 $B=C$를 얻을 수 없습니다($A$가 가역이면 가능, §7.8).
- 결합법칙 $(AB)C=A(BC)$, 분배법칙 $A(B+C)=AB+AC$는 성립합니다.

**특수 행렬.** 전치 $A^T$ (행과 열을 바꿈), 대칭 $A^T=A$, 반대칭 $A^T=-A$, 위·아래 삼각행렬, 대각행렬, 단위행렬 $I$. 모든 정사각행렬은 대칭 부분 $\tfrac12(A+A^T)$과 반대칭 부분 $\tfrac12(A-A^T)$의 합입니다.

:::ex 예제
$A=\begin{pmatrix}1&0&2\\-1&3&1\end{pmatrix}$, $B=\begin{pmatrix}3&1\\2&1\\1&0\end{pmatrix}$일 때 $AB$와 $BA$의 크기, $AB$를 구하세요.
---
$AB$는 $2\times2$, $BA$는 $3\times3$ (둘 다 정의되지만 크기부터 다름).
$$AB=\begin{pmatrix}3+0+2&1+0+0\\-3+6+1&-1+3+0\end{pmatrix}=\begin{pmatrix}5&1\\4&2\end{pmatrix}$$
:::
` },
      { k: '7.3', p: '272', title: '연립일차방정식과 가우스 소거법', body: R`
$m$개의 방정식과 $n$개의 미지수를 가진 연립방정식은 $A\mathbf x=\mathbf b$로 쓰고, 첨가행렬 $\tilde A=[A\ \ \mathbf b]$로 계산합니다. 회로의 키르히호프 법칙, 트러스의 힘 평형처럼 공학 모델은 대부분 이 꼴이 됩니다.

**기본 행 연산**(해를 바꾸지 않음): 두 행 교환, 한 행에 0이 아닌 상수 곱하기, 한 행의 상수배를 다른 행에 더하기. 행 연산으로 서로 바뀌는 연립방정식은 **행동치**이며 해가 같습니다.

**가우스 소거법**은 첫 열부터 차례로 피벗 아래를 0으로 만들어 **행사다리꼴**을 만든 뒤, 맨 아래 식부터 **역대입**합니다. 결과는 세 가지 중 하나입니다.

1. 해가 유일하다
2. 자유변수가 있어 해가 무수히 많다
3. $0=c\ (c\ne0)$ 꼴의 모순 행이 있어 해가 없다

:::ex 예제
$x_1+x_2+x_3=4,\ 2x_1+3x_2+x_3=9,\ x_1-x_2-x_3=-2$를 푸세요.
---
$$\left[\begin{array}{ccc|c}1&1&1&4\\2&3&1&9\\1&-1&-1&-2\end{array}\right]\to\left[\begin{array}{ccc|c}1&1&1&4\\0&1&-1&1\\0&-2&-2&-6\end{array}\right]\to\left[\begin{array}{ccc|c}1&1&1&4\\0&1&-1&1\\0&0&-4&-4\end{array}\right]$$
$x_3=1$, $x_2=1+x_3=2$, $x_1=4-2-1=1$.
:::

:::tip 시험 포인트
피벗이 0이면 아래 행과 바꾸세요(부분 피벗팅). 분수를 피하려면 행에 정수를 곱해 두고 소거해도 됩니다.
:::
` },
      { k: '7.4', p: '282', title: '일차독립, 계수, 벡터공간', body: R`
벡터 $\mathbf a_1,\dots,\mathbf a_m$이 **일차독립**이라는 것은 $c_1\mathbf a_1+\cdots+c_m\mathbf a_m=\mathbf 0$이 모든 $c_j=0$일 때만 성립한다는 뜻입니다. 하나라도 다른 것들의 일차결합이면 **일차종속**입니다.

행렬의 **계수**(rank)는 일차독립인 행의 최대 개수입니다. 교재의 핵심 정리는 두 가지입니다.

- 행 연산은 계수를 바꾸지 않는다 → 사다리꼴에서 0이 아닌 행의 수를 세면 된다.
- **행계수 = 열계수**: 일차독립인 열의 최대 개수도 같다.

성분이 $n$개인 벡터가 $n$개보다 많으면 반드시 종속입니다. $\mathbb R^n$의 부분집합 중 덧셈과 스칼라곱에 닫혀 있는 것을 **벡터공간**(부분공간), 공간을 생성하는 일차독립 벡터들을 **기저**, 기저의 개수를 **차원**이라 합니다. 행렬에서 나오는 네 공간이 중요합니다: 행공간, 열공간, 영공간 $\{\mathbf x:A\mathbf x=\mathbf 0\}$, (그리고 $A^T$의 영공간).

:::key 계수와 영공간
$$\operatorname{rank}A=(\text{행사다리꼴에서 0이 아닌 행의 수}),\qquad \operatorname{rank}A+\operatorname{nullity}A=n$$
:::

:::ex 예제
$A=\begin{pmatrix}1&2&1\\2&4&3\\3&6&4\end{pmatrix}$의 계수, 열공간의 기저, 영공간을 구하세요.
---
$R_2-2R_1=(0,0,1)$, $R_3-3R_1=(0,0,1)$, $R_3-R_2=\mathbf 0$ → 계수 2.
피벗은 1열과 3열에 있으므로 원래 행렬의 1열 $(1,2,3)^T$과 3열 $(1,3,4)^T$이 열공간의 기저.
$A\mathbf x=\mathbf 0$: $x_3=0$, $x_1+2x_2=0$ → $\mathbf x=t(-2,1,0)^T$. 차원 1이고 $2+1=3$ ✓
:::
` },
      { k: '7.5', p: '288', title: '연립방정식 해의 존재와 유일성', body: R`
:::key 해의 개수 판정 ($n$은 미지수의 개수, $\tilde A$는 첨가행렬)
| 조건 | 해 |
|---|---|
| $\operatorname{rank}A<\operatorname{rank}\tilde A$ | 없음 |
| $\operatorname{rank}A=\operatorname{rank}\tilde A=n$ | 유일 |
| $\operatorname{rank}A=\operatorname{rank}\tilde A=r<n$ | 무수히 많음 (자유변수 $n-r$개) |
:::

**동차계** $A\mathbf x=\mathbf 0$은 항상 자명해를 가지며, 해 전체가 벡터공간(영공간)을 이룹니다. 자명하지 않은 해는 $\operatorname{rank}A<n$일 때만 있습니다. 방정식보다 미지수가 많으면($m<n$) 항상 있습니다.

**비동차계**의 해 전체는
$$\mathbf x=\mathbf x_p+\mathbf x_h\qquad(\mathbf x_p:\ \text{특수해 하나},\ \mathbf x_h:\ \text{동차계의 일반해})$$
입니다. 두 해의 차는 동차계의 해이기 때문입니다. 이 구조는 선형 미분방정식의 “일반해 = 동차해 + 특수해”와 정확히 같습니다[[ch02:2.7|비동차 선형 ODE의 일반해 $y=y_h+y_p$.]][[ch03:4.6|비동차 연립 ODE $\mathbf y=\mathbf y^{(h)}+\mathbf y^{(p)}$.]]. 둘 다 “선형 사상의 해집합”이라는 같은 수학이기 때문입니다.
` },
      { k: '7.6', p: '291', title: '2차·3차 행렬식 (참고)', body: R`
$$\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc$$
3차 행렬식은 첫 행으로 전개합니다.
$$\det\begin{pmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\\a_{31}&a_{32}&a_{33}\end{pmatrix}=a_{11}\begin{vmatrix}a_{22}&a_{23}\\a_{32}&a_{33}\end{vmatrix}-a_{12}\begin{vmatrix}a_{21}&a_{23}\\a_{31}&a_{33}\end{vmatrix}+a_{13}\begin{vmatrix}a_{21}&a_{22}\\a_{31}&a_{32}\end{vmatrix}$$
2×2 연립방정식 $a_{11}x_1+a_{12}x_2=b_1$, $a_{21}x_1+a_{22}x_2=b_2$는 $D\ne0$일 때 $x_1=\frac{D_1}{D}$, $x_2=\frac{D_2}{D}$ ($D_k$는 $k$열을 $\mathbf b$로 바꾼 행렬식)입니다. 2차원에서 행렬식의 절댓값은 두 열벡터가 만드는 평행사변형의 넓이, 3차원에서는 평행육면체의 부피입니다[[ch08:9.3|삼중곱 = 행렬식 = 평행육면체의 부피.]].
` },
      { k: '7.7', p: '293', title: '행렬식과 크래머 공식', body: R`
$n$차 행렬식은 아무 행이나 열로 **여인수 전개**합니다: $\det A=\sum_k(-1)^{j+k}a_{jk}M_{jk}$ ($M_{jk}$는 $j$행 $k$열을 지운 소행렬식). 0이 많은 줄을 고르세요. 큰 행렬은 전개보다 **행 연산으로 삼각행렬을 만든 뒤 대각성분을 곱하는** 편이 훨씬 빠릅니다.

:::key 행렬식의 성질
$$\det(AB)=\det A\,\det B,\qquad \det(A^T)=\det A,\qquad \det(cA)=c^n\det A,\qquad \det(A^{-1})=\frac1{\det A}$$
$$\text{크래머 공식: } x_k=\frac{D_k}{D}\quad(D_k: D\text{의 }k\text{열을 }\mathbf b\text{로 바꾼 행렬식})$$
:::

- 두 행을 바꾸면 부호가 바뀌고, 한 행에 $c$를 곱하면 $c$배, 한 행의 배수를 다른 행에 더하면 불변.
- 두 행이 같거나 비례하면 0. 영행이 있으면 0.
- $n\times n$ 행렬에서 $\det A\ne0\iff\operatorname{rank}A=n\iff A$ 가역.

:::ex 예제
$\det\begin{pmatrix}1&2&0&1\\2&5&1&1\\0&1&3&2\\1&2&0&3\end{pmatrix}$을 구하세요.
---
$R_2-2R_1=(0,1,1,-1)$, $R_4-R_1=(0,0,0,2)$. 이어서 $R_3-R_2=(0,0,2,3)$.
대각성분 $1,1,2,2$인 위삼각행렬이 되었고 행 교환이 없었으므로 $\det=4$.
:::
` },
      { k: '7.8', p: '301', title: '역행렬과 가우스-조르단 소거', body: R`
$AA^{-1}=A^{-1}A=I$인 $A^{-1}$이 있으면 $A$는 **가역**(비특이)입니다. 가역이면 역행렬은 하나뿐이고, $A\mathbf x=\mathbf b$의 해는 $\mathbf x=A^{-1}\mathbf b$입니다.

**가우스-조르단 소거**: $[A\ \ I]$에 행 연산을 적용해 왼쪽을 $I$로 만들면 오른쪽이 $A^{-1}$입니다. 왼쪽이 $I$가 되지 않으면(영행이 생기면) 역행렬이 없습니다.

:::key 2×2 역행렬과 수반행렬
$$\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix},\qquad A^{-1}=\frac{1}{\det A}\operatorname{adj}A,\quad(\operatorname{adj}A)_{jk}=C_{kj}$$
:::

- 대각행렬의 역행렬은 대각성분의 역수.
- $(AB)^{-1}=B^{-1}A^{-1}$, $(A^T)^{-1}=(A^{-1})^T$.
- $A$가 가역이면 **소거법칙**이 성립합니다: $AB=AC\Rightarrow B=C$. 또 $\operatorname{rank}(AB)=\operatorname{rank}B$.

:::ex 예제
$A=\begin{pmatrix}1&0&1\\0&1&1\\1&1&0\end{pmatrix}$의 역행렬은?
---
$\det A=1(0-1)-0+1(0-1)=-2$. 여인수를 계산해 전치하면
$$A^{-1}=\frac12\begin{pmatrix}1&-1&1\\-1&1&1\\1&1&-1\end{pmatrix}$$
검산: $A$의 첫 행 $(1,0,1)$과 $A^{-1}$의 첫 열 $\frac12(1,-1,1)$의 곱은 $\frac12(1+1)=1$, 둘째 열과는 $\frac12(-1+1)=0$ ✓
:::
` },
      { k: '7.9', label: '7.9 ①', p: '309', title: '벡터공간과 선형사상', body: R`
지금까지 벡터는 $\mathbb R^n$의 원소였습니다. 그런데 행렬, 다항식, 연속함수도 더하고 상수배할 수 있습니다. 이 “더하기와 상수배의 규칙”만 뽑아내 공리로 삼은 것이 추상적인 벡터공간입니다. 이렇게 하면 함수도 벡터가 되고, 푸리에 급수는 “함수라는 벡터를 기저로 전개하는 것”이 됩니다.

:::def 벡터공간
체 $\mathbb F$ ($\mathbb R$ 또는 $\mathbb C$) 위의 집합 $V$에 덧셈과 스칼라곱이 주어지고 다음을 만족하면 $V$를 **벡터공간**이라 합니다. $V$의 원소는 벡터, $\mathbb F$의 원소는 스칼라입니다.
- (V1) $(u+v)+w=u+(v+w)$ (V2) $v+w=w+v$
- (V3) $v+0=v$인 영벡터 $0$이 존재 (V4) $v+w=0$인 역원 $w=-v$가 존재
- (V5) $1v=v$ (V6) $a(bv)=(ab)v$
- (V7) $(a+b)v=av+bv$ (V8) $a(v+w)=av+aw$
:::

**예.** $\mathbb F^n$; 차수 $n$ 이하 다항식 공간 $P_n$; 모든 다항식 $\mathbb F[t]$; $m\times n$ 행렬 전체 $M_{m,n}$; 구간에서 연속인 함수 전체 $C[a,b]$; 무한 번 미분가능한 함수 $C^\infty$. 동차 선형 ODE의 해 전체도 벡터공간입니다[[ch02:2.1|중첩 원리: 동차 선형 ODE의 해들의 일차결합도 해이므로 해집합은 2차원 벡터공간.]].

**부분공간.** $V$의 부분집합 $W$가 영벡터를 포함하고 덧셈과 스칼라곱에 닫혀 있으면 부분공간($W\le V$)입니다.
- $\{(x,y,z):x+y+z=0\}$은 $\mathbb R^3$의 부분공간(평면, 차원 2), $\{x+y+z=1\}$은 영벡터가 없어 아닙니다.
- 대칭행렬 전체는 $M_{n,n}$의 부분공간이고 차원은 $\frac{n(n+1)}2$.

**일차결합·생성·기저·차원.** 유한 개 벡터의 일차결합 $\sum a_iv_i$ 전체를 $\operatorname{span}(S)$라 합니다. $\operatorname{span}(\beta)=V$이고 $\beta$가 일차독립이면 $\beta$는 **기저**, 기저의 원소 수가 **차원**입니다. 모든 벡터공간은 기저를 가지며, 두 기저의 크기는 같습니다. $\dim P_n=n+1$ (기저 $1,t,\dots,t^n$), $\dim M_{m,n}=mn$. $C[a,b]$는 무한차원입니다.

:::def 선형사상
$L:V\to W$가 $L(v+w)=L(v)+L(w)$, $L(tv)=tL(v)$를 만족하면 **선형사상**(선형변환), $V=W$이면 **선형연산자**라 합니다.
:::

**예.** 행렬 곱 $L_A(\mathbf x)=A\mathbf x$; 미분 $D:f\mapsto f'$ ($C^\infty\to C^\infty$); 정적분 $L(f)=\int_a^bf\,dt$ ($C[a,b]\to\mathbb R$); 라플라스 변환도 선형사상입니다[[ch05:6.1|라플라스 변환의 선형성.]].

- **선형확장정리**: 선형사상은 기저에서의 값만으로 완전히 결정됩니다. $L(1,0)=(1,-1)$, $L(0,1)=(1,1)$이면 $L(a,b)=aL(1,0)+bL(0,1)=(a+b,\,-a+b)$.
- **행렬 표현**: 유한차원이면 기저를 정해 선형사상을 행렬로 씁니다. 예) $D:P_2\to P_2$, 기저 $1,x,x^2$에서 $D(1)=0$, $D(x)=1$, $D(x^2)=2x$이므로 $[D]=\begin{pmatrix}0&1&0\\0&0&2\\0&0&0\end{pmatrix}$.
- **합성**: $L_A\circ L_B=L_{AB}$. 행렬 곱의 정의가 여기서 옵니다.

:::key 선형사상과 차원정리
$$\ker L=\{v\in V:L(v)=0\},\qquad \operatorname{im}L=\{L(v):v\in V\}$$
$$\dim\ker L+\dim\operatorname{im}L=\dim V\qquad(V\text{ 유한차원})$$
:::

:::ex 예제 (미분연산자의 차원정리)
$D:P_3\to P_3$, $D(p)=p'$의 커널과 이미지를 구하고 차원정리를 확인하세요.
---
$\ker D$ = 상수함수 전체 (차원 1). $\operatorname{im}D=P_2$ (차수 2 이하, 차원 3). $1+3=4=\dim P_3$ ✓. 행렬에서의 $\operatorname{rank}+\operatorname{nullity}=n$과 같은 정리입니다[[ch06:7.4|$\operatorname{rank}A+\operatorname{nullity}A=n$.]].
:::

**고유값과 고유벡터.** 선형연산자 $L$에 대해 $L(v)=\lambda v$ ($v\ne0$)이면 $\lambda$는 고유값, $v$는 고유벡터입니다. 함수공간에서는 $D(e^{\lambda x})=\lambda e^{\lambda x}$이므로 지수함수가 미분연산자의 고유벡터입니다. 상수계수 ODE를 $e^{\lambda x}$로 푸는 이유가 여기 있습니다[[ch02:2.2|특성방정식: $e^{\lambda x}$를 대입하는 이유.]][[ch07:8.1|행렬의 고유값 문제.]]. 또 $\frac{d^2}{dx^2}$의 고유벡터가 $\sin nx$, $\cos nx$라는 사실이 푸리에 급수로 이어집니다[[ch10:11.5|스투름-리우빌 문제: 미분연산자의 고유함수 전개.]].
` },
      { k: '7.9b', label: '7.9 ②', p: '311', title: '내적공간: 내적, 노름, 직교', body: R`
벡터공간에는 길이와 각도가 없습니다. **내적**을 주면 길이(노름), 거리, 직교성이 생기고, 피타고라스 정리와 “가장 가까운 점” 같은 기하학을 함수공간에서도 쓸 수 있게 됩니다.

:::def 내적
$\mathbb F$ ($\mathbb R$ 또는 $\mathbb C$) 위의 벡터공간 $V$에서 두 벡터에 스칼라를 대응시키는 $\langle\cdot,\cdot\rangle$이 다음을 만족하면 **내적**입니다.
1. $\langle u+v,w\rangle=\langle u,w\rangle+\langle v,w\rangle$
2. $\langle cv,w\rangle=c\langle v,w\rangle$
3. $\langle w,v\rangle=\overline{\langle v,w\rangle}$
4. $v\ne0$이면 $\langle v,v\rangle>0$ (양의 정부호)

내적이 주어진 벡터공간을 **내적공간**이라 합니다.
:::

1, 2를 합하면 첫째 자리에 대해 선형입니다. 실수이면 3은 대칭성 $\langle w,v\rangle=\langle v,w\rangle$이고, 복소수이면 둘째 자리에 대해 **켤레 선형** $\langle v,cw\rangle=\bar c\langle v,w\rangle$입니다.

**중요한 예.**
- $\mathbb F^n$의 점곱 $\langle\mathbf a,\mathbf b\rangle=\sum a_i\overline{b_i}$. 실수이면 $\mathbf a^T\mathbf b$이지만, 복소수이면 켤레를 빠뜨리면 안 됩니다($\mathbf a^T\mathbf b$는 내적이 아님).
- 행렬공간 $M_{m,n}(\mathbb R)$의 $\langle A,B\rangle=\operatorname{tr}(AB^T)=\sum_{j,k}a_{jk}b_{jk}$. 성분을 한 줄로 늘어놓은 점곱과 같습니다(네 성질을 직접 확인해 보는 것이 좋은 연습입니다).
- **함수공간** $C[a,b]$의 $\langle f,g\rangle=\int_a^bf(x)g(x)\,dx$, 또는 가중함수 $r(x)>0$을 넣은 $\int_a^br\,fg\,dx$. 공학수학 2에서 가장 중요한 내적입니다.

:::key 노름과 기본 부등식
$$\|v\|=\sqrt{\langle v,v\rangle},\qquad |\langle u,v\rangle|\le\|u\|\,\|v\|\ (\text{코시-슈바르츠}),\qquad \|u+v\|\le\|u\|+\|v\|\ (\text{삼각부등식})$$
$$\|u+v\|^2+\|u-v\|^2=2\big(\|u\|^2+\|v\|^2\big)\ (\text{평행사변형 등식})$$
:::

노름이 주어진 공간을 **노름공간**이라 하며, 거리 $\|u-v\|$로 극한과 수렴을 정의할 수 있습니다. 내적 없이 노름만 줄 수도 있지만, 내적에서 온 노름은 반드시 평행사변형 등식을 만족합니다.

**직교.** $\langle v,w\rangle=0$이면 $v\perp w$. 서로 다른 원소끼리 모두 직교하면 **직교집합**, 모두 노름 1이면 **정규직교집합**, 그것이 기저이면 직교기저·정규직교기저입니다. 직교집합의 영이 아닌 벡터들은 자동으로 일차독립입니다.

:::ex 예제 1 (삼각함수계)
$\langle f,g\rangle=\int_{-\pi}^{\pi}fg\,dx$에서 $\{1,\cos x,\sin x,\cos2x,\sin2x,\dots\}$는 직교집합입니다. 정규직교집합으로 만들면?
---
$\|1\|^2=2\pi$, $\|\cos nx\|^2=\|\sin nx\|^2=\pi$이므로
$$\Big\{\frac1{\sqrt{2\pi}},\ \frac{\cos x}{\sqrt\pi},\ \frac{\sin x}{\sqrt\pi},\ \frac{\cos2x}{\sqrt\pi},\ \dots\Big\}$$
푸리에 급수는 이 정규직교집합에 대한 전개입니다[[ch10:11.1|푸리에 급수와 오일러 공식.]].
:::

:::ex 예제 2 (르장드르 다항식)
$P_2(\mathbb R)$에 $\langle f,g\rangle=\int_{-1}^1fg\,dx$를 줄 때 $\{1,\ x,\ \tfrac12(3x^2-1)\}$이 직교집합임을 보이고 각 노름을 구하세요.
---
$\langle1,x\rangle=\int x\,dx=0$ (기함수), $\langle x,\tfrac12(3x^2-1)\rangle=0$ (기함수), $\langle1,\tfrac12(3x^2-1)\rangle=\tfrac12\big(2-2\big)=0$.
$\|1\|^2=2$, $\|x\|^2=\tfrac23$, $\|\tfrac12(3x^2-1)\|^2=\tfrac25$. 이 다항식들이 르장드르 다항식 $P_0,P_1,P_2$입니다. 미분방정식의 해이면서 이런 직교 구조를 가진다는 점이 중요합니다[[ch04:5.2|르장드르 방정식과 $P_n$, 직교성 $\int P_mP_n=0$.]].
:::
` },
      { k: '7.9c', label: '7.9 ③', p: '311', title: '정사영과 근사, 베셀 부등식과 파세발 항등식', body: R`
내적이 주는 가장 강력한 도구는 **근사**입니다. 복잡한 벡터(함수)를 간단한 부분공간 안에서 “가장 가깝게” 흉내 내는 것입니다.

**한 방향으로의 정사영.** $v\ne0$일 때 $u$의 $v$ 방향 정사영은
$$\operatorname{proj}_vu=\frac{\langle u,v\rangle}{\|v\|^2}v$$
이고, 나머지 $u-\operatorname{proj}_vu$는 $v$와 직교합니다. $v$가 단위벡터이면 $\langle u,v\rangle v$입니다.

:::key 정사영과 최선 근사
$W$가 유한차원 부분공간이고 $\{v_1,\dots,v_m\}$이 $W$의 정규직교기저이면
$$w=\langle v,v_1\rangle v_1+\cdots+\langle v,v_m\rangle v_m\in W$$
에 대해 $v-w\perp W$이고, $w$는 $W$에서 $v$에 가장 가까운 유일한 벡터입니다: $\|v-w\|\le\|v-u\|\ (u\in W)$.
:::

직교기저(정규화 안 함)이면 계수를 $\frac{\langle v,v_i\rangle}{\|v_i\|^2}$로 쓰면 됩니다. 증명의 핵심은 피타고라스 정리 $\|v-u\|^2=\|v-w\|^2+\|w-u\|^2$입니다.

**그람-슈미트 과정.** 일차독립인 $u_1,u_2,\dots$에서 앞의 벡터들 방향 성분을 빼 나가면 직교집합을 얻습니다: $v_1=u_1$, $v_2=u_2-\operatorname{proj}_{v_1}u_2$, $v_3=u_3-\operatorname{proj}_{v_1}u_3-\operatorname{proj}_{v_2}u_3$, … $1,x,x^2$에 $\int_{-1}^1$ 내적으로 적용하면 $1,\ x,\ x^2-\frac13$ ($\propto P_2$)이 나옵니다.

:::ex 예제 ($e^x$의 2차 최선 근사)
$[-1,1]$에서 $\langle f,g\rangle=\int_{-1}^1fg\,dx$일 때, $P_2(\mathbb R)$에서 $e^x$에 가장 가까운 다항식은?
---
직교기저 $1,\ x,\ P_2=\frac12(3x^2-1)$ (노름제곱 $2,\frac23,\frac25$)로 계수를 구합니다.
$c_0=\frac12\int e^xdx=\sinh1\approx1.1752$.
$c_1=\frac32\int xe^xdx=\frac32\cdot\frac2e=\frac3e\approx1.1036$.
$c_2=\frac52\int e^x\frac{3x^2-1}2dx=\frac52\Big(e-\frac7e\Big)\approx0.3578$ ($\int x^2e^x=e-\frac5e$ 이용).
$$e^x\approx1.1752+1.1036x+0.3578\cdot\tfrac12(3x^2-1)\approx0.9963+1.1036x+0.5367x^2$$
테일러 다항식 $1+x+\frac12x^2$은 $x=0$ 근처만 잘 맞추지만, 이 다항식은 구간 전체에서 제곱 오차가 가장 작습니다. 구간 $[-\pi,\pi]$에서 $\sin x$를 5차 다항식으로 근사해도 마찬가지로, 최소제곱 근사가 5차 테일러 다항식보다 구간 끝에서 훨씬 정확합니다.
:::

**무한 정규직교집합으로.** 정규직교집합 $\{v_1,\dots,v_m\}$에 대해 정사영의 길이가 원래보다 길 수 없으므로 **베셀 부등식**
$$\sum_{i=1}^m|\langle v,v_i\rangle|^2\le\|v\|^2$$
이 성립합니다. $m\to\infty$로 가면 무한합이 수렴해야 하는데, 일반 내적공간에서는 무한합의 극한이 공간 안에 있다는 보장이 없습니다. 극한이 항상 공간 안에 있는(완비인) 내적공간을 **힐베르트 공간**이라 하고, 여기서 정규직교기저 $\{v_i\}$에 대해 **파세발 항등식**
$$\|v\|^2=\sum_{i=1}^\infty|\langle v,v_i\rangle|^2$$
이 성립합니다. 삼각함수계에 적용한 것이 푸리에 급수의 파세발 항등식이고, $\sum\frac1{n^2}=\frac{\pi^2}6$ 같은 결과가 여기서 나옵니다[[ch10:11.4|푸리에 계수로 쓴 베셀 부등식·파세발 항등식과 최소 제곱 오차.]][[ch10:11.6|일반화된 푸리에 급수의 평균 제곱 수렴과 완비성.]].

:::tip 시험 포인트
“정규직교”인지 “직교”인지부터 확인하세요. 직교기저인데 정규직교 공식 $\langle v,v_i\rangle v_i$를 쓰면 노름제곱만큼 틀립니다.
:::
` },
    ],
  });
})();
