/* 개념 정리 — 03 연립 ODE와 상평면 (Kreyszig 10판 4장, §4.0–4.6). 교재의 절 구성을 따르되 설명과 예제는 새로 썼습니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.learn = EM.learn || [];
(function () {
  const R = String.raw;
  EM.learn.push({
    n: 3,
    summary: R`미지함수가 여러 개인 **연립 ODE** $\mathbf y'=A\mathbf y+\mathbf g$를 다룹니다. 풀이는 행렬의 **고유값 문제**로 바뀌고, 해를 $(y_1,y_2)$ 평면의 궤적으로 그리는 **상평면 방법**으로 임계점의 종류와 안정성을 식을 풀지 않고도 판정합니다. 비선형계는 임계점 근처에서 선형화해 같은 방법을 씁니다. 교재 4장의 구성을 따릅니다.`,
    goals: [
      R`$n$계 ODE를 1계 연립 ODE로 바꾸고, 혼합·회로 문제를 연립 ODE로 세울 수 있다`,
      R`연립 ODE의 기저, 론스키안, 기본행렬을 설명할 수 있다`,
      R`실수·복소수·중복 고유값의 경우 일반해를 쓸 수 있다`,
      R`$p=\tr A$, $q=\det A$로 임계점의 종류와 안정성을 판정할 수 있다`,
      R`비선형계의 임계점을 찾아 야코비 행렬로 선형화할 수 있다`,
      R`비동차 연립 ODE의 특수해를 미정계수법·매개변수 변환법으로 구할 수 있다`,
    ],
    sections: [
      { k: '4.1', p: '130', title: '연립 ODE 모델과 행렬 표기', body: R`
여러 미지함수가 서로 얽힌 방정식은 벡터 $\mathbf y=(y_1,\dots,y_n)^T$로 묶어 $\mathbf y'=A\mathbf y+\mathbf g(t)$로 씁니다. 교재는 이 장 앞(4.0절)에서 필요한 행렬 계산(곱, 행렬식, 고유값)을 짧게 복습합니다. 자세한 내용은 선형대수 단원에 있습니다[[ch06:7.2|행렬의 곱.]][[ch07:8.1|고유값과 고유벡터 구하기.]].

**대표 모델.**
- **두 탱크 혼합**: 탱크끼리 물을 주고받으면 각 탱크의 소금 양 변화율이 두 탱크의 농도에 의존합니다.
- **전기 회로망**: 가지가 여럿인 회로에서 키르히호프 법칙을 각 고리에 쓰면 전류들의 연립 ODE가 됩니다.
- **질량–스프링계 여러 개**: 물체마다 방정식 하나.

:::ex 예제 1 (두 탱크)
각 200 L인 탱크 T1, T2 사이로 물이 10 L/min씩 양방향으로 흐른다(외부 유입·유출 없음). 소금 양 $y_1,y_2$의 방정식은?
---
T1: 나가는 소금 $10\cdot\frac{y_1}{200}$, 들어오는 소금 $10\cdot\frac{y_2}{200}$.
$$\mathbf y'=\begin{pmatrix}-0.05&0.05\\0.05&-0.05\end{pmatrix}\mathbf y$$
고유값 $0$, $-0.1$. 고유값 0의 고유벡터 $(1,1)^T$가 "두 탱크 농도가 같아진 평형", $-0.1$의 $(1,-1)^T$가 "차이가 $e^{-0.1t}$로 사라짐"을 뜻합니다.
:::

:::key n계 ODE → 1계 연립
$$y_1=y,\quad y_2=y',\quad\dots,\quad y_n=y^{(n-1)}$$
$$y_1'=y_2,\ \dots,\ y_{n-1}'=y_n,\ y_n'=F(t,y_1,\dots,y_n)$$
:::

이 변환(교재 Theorem 1)으로 **모든 $n$계 ODE는 1계 연립 ODE**가 됩니다. 그래서 수치해법과 이론을 1계 연립에 대해서만 만들면 충분합니다.

:::ex 예제 2
질량–스프링계 $my''+cy'+ky=0$을 연립 ODE로 쓰세요.
---
$y_1=y$, $y_2=y'$로 두면
$$\mathbf y'=\begin{pmatrix}0&1\\-k/m&-c/m\end{pmatrix}\mathbf y$$
특성방정식 $\det(A-\lambda I)=\lambda^2+\frac cm\lambda+\frac km=0$은 2.4절의 특성방정식과 같습니다[[ch02:2.4|질량–스프링계의 자유진동.]].
:::
` },
      { k: '4.2', p: '137', title: '연립 ODE의 기본 이론', body: R`
- **존재·유일성**(교재 Theorem 1–2): $\mathbf y'=\mathbf f(t,\mathbf y)$에서 $\mathbf f$와 $\partial f_i/\partial y_j$가 연속이면 $\mathbf y(t_0)=\mathbf K$인 해가 유일합니다. 선형계 $\mathbf y'=A(t)\mathbf y+\mathbf g$는 $A,\mathbf g$가 연속인 구간 전체에서 해가 존재합니다[[ch01:1.7|1계 ODE의 존재·유일성.]].
- **중첩 원리**(Theorem 3): 동차 선형계의 해의 일차결합은 해.
- **기저**: 일차독립인 해 $\mathbf y^{(1)},\dots,\mathbf y^{(n)}$. 일반해 $\mathbf y=c_1\mathbf y^{(1)}+\cdots+c_n\mathbf y^{(n)}=Y\mathbf c$.

:::def 기본행렬과 론스키안
해 벡터들을 열로 세운 행렬 $Y=[\mathbf y^{(1)}\ \cdots\ \mathbf y^{(n)}]$를 **기본행렬**, 그 행렬식 $W=\det Y$를 **론스키안**이라 합니다. 해들이 기저 $\iff$ 어떤 한 점에서 $W\ne0$ ($W$는 항상 0이거나 항상 0이 아님).
:::

2계 ODE의 론스키안 $\begin{vmatrix}y_1&y_2\\y_1'&y_2'\end{vmatrix}$은 $y$와 $y'$을 성분으로 하는 해 벡터의 론스키안과 같습니다[[ch02:2.6|2계 ODE의 론스키안.]].

:::ex 예제
$\mathbf y^{(1)}=(1,2)^Te^{-2t}$, $\mathbf y^{(2)}=(1,-1)^Te^{-5t}$는 기저인가?
---
$$W=\begin{vmatrix}e^{-2t}&e^{-5t}\\2e^{-2t}&-e^{-5t}\end{vmatrix}=-3e^{-7t}\ne0$$
따라서 기저입니다(다음 절 예제 1의 해).
:::
` },
      { k: '4.3', p: '140', title: '상수계수 연립 ODE와 상평면', body: R`
$\mathbf y=\mathbf xe^{\lambda t}$를 $\mathbf y'=A\mathbf y$에 대입하면 $\lambda\mathbf xe^{\lambda t}=A\mathbf xe^{\lambda t}$, 즉 $A\mathbf x=\lambda\mathbf x$: **고유값 문제**입니다[[ch07:8.1|특성방정식 $\det(A-\lambda I)=0$.]].

:::key 고유값 방법
$$\mathbf y=c_1\mathbf x^{(1)}e^{\lambda_1t}+\cdots+c_n\mathbf x^{(n)}e^{\lambda_nt}\qquad(\text{독립인 고유벡터가 } n\text{개일 때})$$
$$\text{중복 고유값(고유벡터 1개): }\ \mathbf y^{(2)}=\mathbf x\,te^{\lambda t}+\mathbf u\,e^{\lambda t},\qquad (A-\lambda I)\mathbf u=\mathbf x$$
:::

- 교재 Theorem 1: $A$가 일차독립인 고유벡터 $n$개를 가지면 위 식이 일반해입니다. 대칭행렬이나 고유값이 모두 다른 행렬은 항상 그렇습니다[[ch07:8.4|고유기저와 대각화.]].
- **복소 고유값** $\lambda=\alpha\pm i\beta$: $\mathbf xe^{\lambda t}$의 실수부와 허수부가 두 개의 실수해입니다.
- **초기조건**은 $\mathbf y(0)=c_1\mathbf x^{(1)}+\cdots$ 연립일차방정식을 풀어 맞춥니다.

**상평면.** $n=2$일 때 해 $(y_1(t),y_2(t))$를 $y_1y_2$ 평면의 곡선(**궤적**)으로 그린 것이 **상평면 그림**입니다. $t$를 매개변수로 보는 셈이고, 1계 ODE의 방향장에 해당합니다[[ch01:1.2|방향장.]]. $\mathbf y'=\mathbf 0$인 점($A\mathbf y=\mathbf 0$)은 **임계점**이며, $\det A\ne0$이면 원점 하나입니다.

:::ex 예제 1 (서로 다른 실수 고유값)
$\mathbf y'=\begin{pmatrix}-4&1\\2&-3\end{pmatrix}\mathbf y$의 일반해는?
---
$\det(A-\lambda I)=(\lambda+4)(\lambda+3)-2=\lambda^2+7\lambda+10=0$, $\lambda=-2,-5$.
$\lambda=-2$: $\begin{pmatrix}-2&1\\2&-1\end{pmatrix}\mathbf x=\mathbf 0$에서 $\mathbf x=(1,2)^T$. $\lambda=-5$: $\mathbf x=(1,-1)^T$.
$$\mathbf y=c_1\begin{pmatrix}1\\2\end{pmatrix}e^{-2t}+c_2\begin{pmatrix}1\\-1\end{pmatrix}e^{-5t}$$
모든 궤적이 원점으로 들어가고, 빨리 사라지는 $e^{-5t}$ 성분이 먼저 없어져 결국 $(1,2)^T$ 방향에 접하며 들어갑니다(**비고유 마디점**, 안정).
:::

:::ex 예제 2 (중복 고유값)
$\mathbf y'=\begin{pmatrix}1&1\\-1&3\end{pmatrix}\mathbf y$
---
$\lambda^2-4\lambda+4=0$, $\lambda=2$ (중근). $A-2I=\begin{pmatrix}-1&1\\-1&1\end{pmatrix}$이므로 고유벡터는 $\mathbf x=(1,1)^T$ 하나뿐입니다.
$(A-2I)\mathbf u=\mathbf x$에서 $-u_1+u_2=1$, $\mathbf u=(0,1)^T$.
$$\mathbf y=c_1\begin{pmatrix}1\\1\end{pmatrix}e^{2t}+c_2\Big[\begin{pmatrix}1\\1\end{pmatrix}te^{2t}+\begin{pmatrix}0\\1\end{pmatrix}e^{2t}\Big]$$
(**퇴화 마디점**, 불안정)
:::

:::ex 예제 3 (복소 고유값)
$\mathbf y'=\begin{pmatrix}-1&1\\-1&-1\end{pmatrix}\mathbf y$
---
$\lambda=-1\pm i$. $\lambda=-1+i$의 고유벡터 $(1,i)^T$. $\mathbf xe^{\lambda t}=e^{-t}(1,i)^T(\cos t+i\sin t)$의 실수부와 허수부:
$$\mathbf y=e^{-t}\Big[c_1\begin{pmatrix}\cos t\\-\sin t\end{pmatrix}+c_2\begin{pmatrix}\sin t\\\cos t\end{pmatrix}\Big]$$
궤적은 원점으로 감겨 들어가는 나선입니다(**나선점**, 안정).
:::
` },
      { k: '4.4', p: '148', title: '임계점의 판정과 안정성', body: R`
$\mathbf y'=A\mathbf y$ ($\det A\ne0$)의 임계점은 원점 하나이고, 그 종류는 고유값으로 정해집니다. 계산할 때는 고유값 대신 $p=\lambda_1+\lambda_2=\tr A$, $q=\lambda_1\lambda_2=\det A$, $\Delta=p^2-4q$를 쓰면 빠릅니다. 특성방정식이 $\lambda^2-p\lambda+q=0$이기 때문입니다.

:::key 임계점의 종류
| 종류 | 조건 | 고유값 |
|---|---|---|
| 마디점 (node) | $q>0,\ \Delta\ge0$ | 부호가 같은 실근 |
| 안장점 (saddle) | $q<0$ | 부호가 다른 실근 |
| 중심 (center) | $p=0,\ q>0$ | 순허수 |
| 나선점 (spiral) | $p\ne0,\ \Delta<0$ | 실수부가 0이 아닌 복소근 |

| 안정성 | 조건 |
|---|---|
| 안정하고 끌어당김 | $p<0,\ q>0$ |
| 안정 | $p\le0,\ q>0$ |
| 불안정 | $p>0$ 또는 $q<0$ |
:::

:::fig pq
:::

- **안정**: 임계점 가까이에서 출발한 궤적이 계속 가까이 머묾. **끌어당김**: 모든 가까운 궤적이 임계점으로 수렴. 중심은 안정하지만 끌어당기지는 않습니다.
- 마디점은 다시 **비고유 마디점**(고유 방향이 둘), **고유 마디점**(모든 방향으로 직선 진입, $A=kI$), **퇴화 마디점**(고유벡터 하나)으로 나뉩니다.
- 2계 ODE $y''+ay'+by=0$을 연립으로 바꾸면 $p=-a$, $q=b$. 감쇠가 있으면($a>0$) 안정, 부족감쇠이면 나선점입니다[[ch02:2.4|감쇠의 세 경우.]].

:::ex 예제
$\mathbf y'=\begin{pmatrix}2&-5\\1&-2\end{pmatrix}\mathbf y$의 임계점은?
---
$p=0$, $q=-4+5=1>0$ → **중심**(안정, 끌어당기지 않음). 고유값 $\pm i$, 궤적은 원점을 도는 타원입니다.
:::

:::tip 시험 포인트
고유값을 끝까지 구하지 않아도 됩니다. $\tr A$와 $\det A$를 적고 표에 대입하면 종류와 안정성을 한 줄로 답할 수 있습니다.
:::
` },
      { k: '4.5', p: '152', title: '비선형계의 정성적 방법', body: R`
비선형계 $\mathbf y'=\mathbf f(\mathbf y)$ (자율계)는 대개 풀 수 없지만, **임계점**($\mathbf f(\mathbf y_0)=\mathbf 0$)의 종류만 알아도 궤적의 전체 모양을 짐작할 수 있습니다. 임계점을 원점으로 옮기고 테일러 전개의 1차 항만 남기면
$$\mathbf y'\approx J\mathbf y,\qquad J=\Big[\frac{\partial f_i}{\partial y_j}\Big]_{\mathbf y_0}\quad(\text{야코비 행렬})$$

:::thm 선형화 (교재 Theorem 1)
$f_1,f_2$가 임계점 근처에서 연속인 편도함수를 가지고 $\det J\ne0$이면, 비선형계의 임계점은 선형화한 계와 **같은 종류, 같은 안정성**을 가집니다. 예외: $J$가 **중근** 또는 **순허수** 고유값을 가지면 원래 계는 같은 종류이거나 나선점일 수 있습니다.
:::

즉 **중심만은 믿을 수 없습니다.** 선형화가 중심이면 비선형 항 때문에 안정 나선점이나 불안정 나선점으로 바뀔 수 있으므로, 에너지 보존 같은 추가 논리가 필요합니다.

:::ex 예제 (이중 우물)
$y_1'=y_2$, $y_2'=y_1-y_1^3$의 임계점을 분류하세요.
---
$y_2=0$, $y_1(1-y_1^2)=0$에서 임계점 $(0,0)$, $(\pm1,0)$.
$$J=\begin{pmatrix}0&1\\1-3y_1^2&0\end{pmatrix}$$
$(0,0)$: $q=-1<0$ → **안장점**(불안정). $(\pm1,0)$: $J=\begin{pmatrix}0&1\\-2&0\end{pmatrix}$, $p=0$, $q=2$ → 선형화는 중심.
이 계는 에너지 $E=\frac12y_2^2-\frac12y_1^2+\frac14y_1^4$가 보존되어 궤적이 $E=$상수인 닫힌 곡선이므로 실제로도 중심입니다. 두 우물 바닥에서 흔들리는 입자, 좌굴된 보의 진동 모델입니다.
:::

**대표 모델.**
- **진자** $\theta''+\frac gL\sin\theta=0$: $(0,0)$은 중심(흔들림), $(\pi,0)$은 안장점(거꾸로 선 불안정 평형). 감쇠가 있으면 $(0,0)$이 안정 나선점.
- **로트카–볼테라 포식자–피식자 모델**: 두 종의 개체수가 주기적으로 오르내립니다. 양의 임계점이 중심.
- **극한 순환**(판 데르 폴 방정식 $y''-\mu(1-y^2)y'+y=0$): 작은 진폭에서는 음의 감쇠, 큰 진폭에서는 양의 감쇠라 하나의 닫힌 궤적으로 모여드는 **자기 지속 진동**이 생깁니다. 선형계에는 없는 현상입니다.

**1계 방정식으로 바꾸기.** $\dfrac{dy_2}{dy_1}=\dfrac{y_2'}{y_1'}=\dfrac{f_2}{f_1}$로 $t$를 소거하면 궤적의 방정식이 됩니다. 위 예제의 에너지식이 바로 이렇게 얻어집니다: $\frac{dy_2}{dy_1}=\frac{y_1-y_1^3}{y_2}$, 변수분리하면 $\frac12y_2^2=\frac12y_1^2-\frac14y_1^4+c$[[ch01:1.3|변수분리형 ODE.]].
` },
      { k: '4.6', p: '160', title: '비동차 선형 연립 ODE', body: R`
$\mathbf y'=A\mathbf y+\mathbf g$의 일반해는 $\mathbf y=\mathbf y^{(h)}+\mathbf y^{(p)}$입니다(2계 ODE의 $y_h+y_p$와 같은 구조[[ch02:2.7|비동차 ODE의 해 구조와 미정계수법.]]). 특수해를 구하는 방법은 세 가지입니다.

- **미정계수법**: $\mathbf g=\mathbf ue^{kt}$이고 $k$가 고유값이 아니면 $\mathbf y^{(p)}=\mathbf ve^{kt}$로 두고 $(kI-A)\mathbf v=\mathbf u$를 풉니다. $k$가 고유값이면 **수정 규칙**: $\mathbf y^{(p)}=\mathbf a\,te^{kt}+\mathbf b\,e^{kt}$ (스칼라 ODE와 달리 $\mathbf be^{kt}$ 항도 필요).
- **매개변수 변환법**: 기본행렬 $Y$로 $\mathbf y^{(p)}=Y(t)\displaystyle\int Y^{-1}(t)\,\mathbf g(t)\,dt$. 어떤 연속 $\mathbf g$에도 적용됩니다.
- **대각화**: $A=XDX^{-1}$이면 $\mathbf y=X\mathbf z$로 두어 $\mathbf z'=D\mathbf z+X^{-1}\mathbf g$, 서로 분리된 1계 방정식들로 만듭니다[[ch07:8.4|대각화 $X^{-1}AX=D$.]].

:::ex 예제 1 (기본 규칙)
$\mathbf y'=\begin{pmatrix}-4&1\\2&-3\end{pmatrix}\mathbf y+\begin{pmatrix}1\\0\end{pmatrix}e^{t}$의 특수해
---
$k=1$은 고유값($-2,-5$)이 아니므로 $\mathbf y^{(p)}=\mathbf ve^{t}$. $(I-A)\mathbf v=(1,0)^T$에서
$$\begin{pmatrix}5&-1\\-2&4\end{pmatrix}\mathbf v=\begin{pmatrix}1\\0\end{pmatrix}\;\Rightarrow\;\mathbf v=\frac1{9}\begin{pmatrix}2\\1\end{pmatrix}$$
:::

:::ex 예제 2 (수정 규칙)
같은 $A$에 $\mathbf g=(0,3)^Te^{-2t}$
---
$-2$가 고유값이므로 $\mathbf y^{(p)}=\mathbf ate^{-2t}+\mathbf be^{-2t}$. 대입해 $te^{-2t}$와 $e^{-2t}$의 계수를 비교하면
$$(A+2I)\mathbf a=\mathbf 0,\qquad (A+2I)\mathbf b=\mathbf a-\begin{pmatrix}0\\3\end{pmatrix}$$
$\mathbf a=k(1,2)^T$. 두 번째 식의 우변 $(k,2k-3)^T$가 $A+2I=\begin{pmatrix}-2&1\\2&-1\end{pmatrix}$의 열공간(= $(1,-1)^T$의 배수)에 있어야 하므로 $k=1$. 그러면 $-2b_1+b_2=1$, $\mathbf b=(0,1)^T$.
$$\mathbf y^{(p)}=\begin{pmatrix}1\\2\end{pmatrix}te^{-2t}+\begin{pmatrix}0\\1\end{pmatrix}e^{-2t}$$
:::

라플라스 변환을 쓰면 연립 ODE도 연립 **일차**방정식으로 바뀝니다[[ch05:6.7|라플라스 변환으로 연립 ODE 풀기.]].
` },
    ],
  });
})();
